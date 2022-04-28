// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IdModificationListener.sol";

import "./RewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract IdRewarder is IdModificationListener
{
    struct TokenBalance
    {
        //uint balance;
        bool isInList;
        uint timestamp;
        address ethereumAddress;
    }

     // Key == 0 => unused !!!
     mapping (uint => TokenBalance) private rewardsBalance;
     mapping (address => uint) private addressToKey;
     uint private nbTokenPerSec = 1;
     ERC20PresetMinterPauser private rewToken;


    function setRewardToken(address RewTokenAddress) public onlyOwner
    {
        rewToken = ERC20PresetMinterPauser(RewTokenAddress);
    }
  
     function RegisterAddress(uint key,address newAddress) public onlyOwner
     {
         require (!rewardsBalance[key].isInList);
         uint current = block.timestamp;
         rewardsBalance[key] = TokenBalance(true,current,newAddress);
         addressToKey[newAddress] = key;
     }

     function RemoveAddress(uint key) public onlyOwner
     {
         require (!rewardsBalance[key].isInList);
         addressToKey[rewardsBalance[key].ethereumAddress] = 0;
         rewardsBalance[key] = TokenBalance(false,0,address(0));
     }

     function UpdateAddress(uint key,address newAddress) public onlyOwner
     {
         require (rewardsBalance[key].isInList);   
         addressToKey[rewardsBalance[key].ethereumAddress] = 0;   
         rewardsBalance[key].ethereumAddress = newAddress;
         addressToKey[newAddress] = key; 
     }

     function EstimateReward(uint key) public view returns (uint)
     {
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

     function Claim() public
     {
         uint key = addressToKey[msg.sender]; 
         require(key > 0);
         uint nbTokens = EstimateReward(key);
         require(nbTokens > 0);

        rewardsBalance[key].timestamp = block.timestamp;
        rewToken.mint(msg.sender, nbTokens);
        
     }

     // Debug
     function GetKey() public view returns (uint)
     {
        uint key = addressToKey[msg.sender]; 
        return key;
     }
}
