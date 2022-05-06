// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IdModificationListener.sol";

import "./RewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IdFundedRewarder is IdModificationListener
{
    // todo rename
    // todo: events
    // todo: doc solidity
    // todo: change owner (in deploy) so that main contract can register
    struct TokenBalance
    {
        bool isInList;
        uint timestamp;
        address ethereumAddress;
    }

     // Key == 0 => unused !!!
     mapping (uint => TokenBalance) private rewardsBalance;// todo rename
     mapping (address => uint) private addressToKey;
     uint private nbTokenPerSec = 100000000000000;// in wei
     uint nbRegisteredAddresses = 0;
    



     ERC20 private rewToken;


    function setRewardToken(address RewTokenAddress) public onlyOwner
    {
        rewToken = ERC20(RewTokenAddress);
    }

    function setRewardRate(uint TokensPerSec) public onlyOwner
    {
        nbTokenPerSec = TokensPerSec;
    }
  
     function RegisterAddress(uint key,address newAddress) public onlyOwner
     {
         // key == 0 means invalid
         require (key > 0);
         require (!rewardsBalance[key].isInList);
         uint current = block.timestamp;
         rewardsBalance[key] = TokenBalance(true,current,newAddress);
         addressToKey[newAddress] = key;
         nbRegisteredAddresses++;
     }

     function RemoveAddress(uint key) public onlyOwner
     {
         require (rewardsBalance[key].isInList);
         addressToKey[rewardsBalance[key].ethereumAddress] = 0;
         rewardsBalance[key] = TokenBalance(false,0,address(0));
         nbRegisteredAddresses--;
     }

     function UpdateAddress(uint key,address newAddress) public onlyOwner
     {
         require (rewardsBalance[key].isInList);   
         addressToKey[rewardsBalance[key].ethereumAddress] = 0;   
         rewardsBalance[key].ethereumAddress = newAddress;
         addressToKey[newAddress] = key; 
     }

     function GetNbRegisteredAdresses() public view returns (uint)
     {
         return nbRegisteredAddresses;
     }

     function GetAddressFromKey(uint key) public view returns (address)
     {
         require (rewardsBalance[key].isInList);   
         return rewardsBalance[key].ethereumAddress;
     }

     function GetKeyFromAddress(address ethAddress) public view returns (uint)
     {
         return addressToKey[ethAddress];
     }

     function EstimateReward(uint key) public view returns (uint)
     {
         require (rewardsBalance[key].isInList);   
         uint current = block.timestamp;
         uint prev = rewardsBalance[key].timestamp;

         uint nbTokens = (current - prev) * nbTokenPerSec;
         return nbTokens;
     }

     function EstimateRewardForAddress(address ethAddress) public view returns (uint)
     {
         uint key = addressToKey[ethAddress];
         if (key > 0)
         {
            uint current = block.timestamp;
            uint prev = rewardsBalance[key].timestamp;

            uint nbTokens = (current - prev) * nbTokenPerSec;

            return nbTokens;
         }
         else
         {
             return 0;
         }
     }

     function IsRegisteredAdress(address ethAddress) public view returns (bool)
     {
         uint key = addressToKey[ethAddress];
         if (key > 0)
         {
             return true;
         }
         else
         {
             return false;
         }
     }

     function Claim() public
     {
         uint key = addressToKey[msg.sender]; 
         require(key > 0);
         uint nbTokens = EstimateReward(key);
         require(nbTokens > 0);

        rewardsBalance[key].timestamp = block.timestamp;
        bool res = rewToken.transfer(msg.sender, nbTokens);
        require(res);
        
     }

     // *************************************** Debug ************************************************
     function GetKey() public view returns (uint)
     {
        uint key = addressToKey[msg.sender]; 
        return key;
     }
}
