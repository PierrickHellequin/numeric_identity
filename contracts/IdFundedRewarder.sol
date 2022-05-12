// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IdModificationListener.sol";

import "./RewardToken.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IdFundedRewarder is IdModificationListener
{

    // todo: events
    // todo: doc solidity
    // todo: change owner (in deploy) so that main contract can register
    struct RewardInfo
    {
        bool isInList;
        uint timestamp;
        address ethereumAddress;
        uint indexInArray;
    }

     // Key == 0 => unused !!!
     mapping (uint => RewardInfo) private rewardInfos;


     mapping (address => uint[]) private addressToKeys;
     //uint private nbTokenPerSec = 100000000000000;// in wei

     // reduced for tests
     uint private nbTokenPerSec = 1;// in wei

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
  
    // ADD KEY
     function RegisterAddress(uint key,address newAddress) public onlyOwner
     {
         // key == 0 means invalid
         require (key > 0);
         require (!rewardInfos[key].isInList);
         uint current = block.timestamp;
         
         addressToKeys[newAddress].push(key);
         // an address can manage no more than 10 ids
         require(addressToKeys[newAddress].length < 10);
         rewardInfos[key] = RewardInfo(true,current,newAddress,addressToKeys[newAddress].length-1);
         nbRegisteredAddresses++;
     }

    // REMOVE KEY
     function RemoveAddress(uint key) public onlyOwner
     {
        require (rewardInfos[key].isInList);
        uint indexInArray = rewardInfos[key].indexInArray;
        // remove in array
        uint[] storage arrayOfKeys = addressToKeys[rewardInfos[key].ethereumAddress];
        if (indexInArray > 0)
            arrayOfKeys[indexInArray] = arrayOfKeys[arrayOfKeys.length - 1];

        arrayOfKeys.pop();
       
        nbRegisteredAddresses--;
     }

     function UpdateAddress(uint key,address newAddress) public onlyOwner
     {
         require (rewardInfos[key].isInList);   
         uint indexInArray = rewardInfos[key].indexInArray;
         // remove this key from the keys associated to this adress
        uint[] storage arrayOfKeys = addressToKeys[rewardInfos[key].ethereumAddress];
        if (indexInArray > 0)
            arrayOfKeys[indexInArray] = arrayOfKeys[arrayOfKeys.length - 1];

        arrayOfKeys.pop();

         // add the key to the new adress
         addressToKeys[newAddress].push(key);
         require(addressToKeys[newAddress].length < 10);
        
         rewardInfos[key].ethereumAddress = newAddress;
         rewardInfos[key].indexInArray = addressToKeys[newAddress].length - 1;
     }

     function GetNbRegisteredAdresses() public view returns (uint)
     {
         return nbRegisteredAddresses;
     }

     function GetAddressFromKey(uint key) public view returns (address)
     {
         require (rewardInfos[key].isInList);   
         return rewardInfos[key].ethereumAddress;
     }

    //  function GetKeyFromAddress(address ethAddress) public view returns (uint)
    //  {
    //      return addressToKey[ethAddress];
    //  }

     function EstimateReward(uint key) public view returns (uint)
     {
         require (rewardInfos[key].isInList);   
         uint current = block.timestamp;
         uint prev = rewardInfos[key].timestamp;

         uint nbTokens = (current - prev) * nbTokenPerSec;
         return nbTokens;
     }

     function EstimateRewardForAddress(address ethAddress) public view returns (uint)
     {
         uint[] memory keys = addressToKeys[ethAddress];
         uint nbTokens = 0;
         for (uint i =0; i < keys.length;i++)
         {
            if (keys[i] > 0)
            {
                uint current = block.timestamp;
                uint prev = rewardInfos[keys[i]].timestamp;
                uint nbTokensKey = (current - prev) * nbTokenPerSec;
                nbTokens += nbTokensKey;

            }
         }
         return nbTokens;
     }

     function IsRegisteredAdress(address ethAddress) public view returns (bool)
     {
         uint[] memory keys = addressToKeys[ethAddress];
       
         for (uint i =0; i < keys.length;i++)
         {
            if (keys[i] > 0)
            {
               return true;
            }
         }
         return false;

        //  uint key = addressToKey[ethAddress];
        //  if (key > 0)
        //  {
        //      return true;
        //  }
        //  else
        //  {
        //      return false;
        //  }
     }

     function Claim() public
     {
         uint[] memory keys = addressToKeys[msg.sender];
         uint nbTokens = 0;
         for (uint i =0; i < keys.length;i++)
         {
            if (keys[i] > 0)
            {
                uint current = block.timestamp;
                uint prev = rewardInfos[keys[i]].timestamp;
                uint nbTokensKey = (current - prev) * nbTokenPerSec;
                nbTokens += nbTokensKey;
                rewardInfos[keys[i]].timestamp = block.timestamp;

            }
         }
        bool res = rewToken.transfer(msg.sender, nbTokens);
        require(res);
        
     }

     // *************************************** Debug ************************************************
    //  function GetKey() public view returns (uint)
    //  {
    //     uint key = addressToKey[msg.sender]; 
    //     return key;
    //  }
}
