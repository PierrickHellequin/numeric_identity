// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IdModificationListener.sol";






/// @title IdFundedRewarder Contract
/// @author Tibo
/// @notice This rewards registered couples (id,EthereumAddress) regularly
contract IdFundedRewarder is IdModificationListener
{
    struct RewardInfo
    {
        bool isInList;
        uint timestamp;
        address ethereumAddress;
        uint indexInArray;
    }

    
     mapping (bytes20 => RewardInfo) private rewardInfos;
     mapping (address => bytes20[]) private addressToKeys;
     
     uint private nbTokenPerSec = 1;// in wei per sec
     uint private nbRegisteredAddresses = 0;
    
    // Reward Token
    IERC20 private rewToken;


    // Events
    event rewardTokenChanged(
        address RewTokenAddress
    );

    event rewardRateChanged(
        uint NewRate
    );

    event idRegistered(
        bytes20 ID,
        address ethereumAddress
    );

    event idRemoved(
        bytes20 ID
    );

    event addressUpdated(
        bytes20 ID,
        address ethereumAddress
    );

    event addressClaimed(
        address ethereumAddress
    );

    /**
     *   @notice Set the Reward ERC20 token
     *   
     *   @param RewTokenAddress Address of the reward ERC20
     *
     */
    function setRewardToken(address RewTokenAddress) public onlyOwner
    {
        rewToken = IERC20(RewTokenAddress);
        emit rewardTokenChanged(RewTokenAddress);
    }

    /**
     *   @notice Set the Reward rate (nb wei per second)
     *   
     *   @param TokensPerSec Nb of wei per second
     *
     */
    function setRewardRate(uint TokensPerSec) public onlyOwner
    {
        nbTokenPerSec = TokensPerSec;
        emit rewardRateChanged(TokensPerSec);
    }
  
    /**
     *   @notice Register an ID with the associated ethereum address
     *   
     *   @param key Unique Id 
     *   @param newAddress Ethereum address that will be allowed to claim rewards
     *
     */
    function RegisterAddress(bytes20 key,address newAddress) public onlyOwner
    {
        require (!rewardInfos[key].isInList,"Unique ID already there");
        uint current = block.timestamp;
         
        addressToKeys[newAddress].push(key);
        // an address can manage no more than 100 ids
        require(addressToKeys[newAddress].length < 100,"Ethereum address already manages 100 IDs");
        rewardInfos[key] = RewardInfo(true,current,newAddress,addressToKeys[newAddress].length-1);
        nbRegisteredAddresses++;
        emit idRegistered(key,newAddress);
    }

    /**
     *   @notice Removes an ID
     *   
     *   @param key Unique Id 
     *
     */
    function RemoveAddress(bytes20 key) public onlyOwner
    {
        require (rewardInfos[key].isInList,"ID not in list");
        uint indexInArray = rewardInfos[key].indexInArray;
        // remove in array
        bytes20[] storage arrayOfKeys = addressToKeys[rewardInfos[key].ethereumAddress];
        if (indexInArray > 0)
            arrayOfKeys[indexInArray] = arrayOfKeys[arrayOfKeys.length - 1];

        arrayOfKeys.pop();
        nbRegisteredAddresses--;
        emit idRemoved(key);
    }

    /**
     *   @notice Updates the ethereum address that can claim rewards for an ID
     *   
     *   @param key Unique Id 
     *   @param newAddress Ethereum address that will be allowed to claim rewards
     *
     */
    function UpdateAddress(bytes20 key,address newAddress) public onlyOwner
    {
        require (rewardInfos[key].isInList,"ID not in list");   
        uint indexInArray = rewardInfos[key].indexInArray;
        // remove this key from the keys associated to this adress
        bytes20[] storage arrayOfKeys = addressToKeys[rewardInfos[key].ethereumAddress];
        if (indexInArray > 0)
            arrayOfKeys[indexInArray] = arrayOfKeys[arrayOfKeys.length - 1];

        arrayOfKeys.pop();

        // add the key to the new adress
        addressToKeys[newAddress].push(key);
        require(addressToKeys[newAddress].length < 100,"Ethereum address already manages 100 IDs");
       
        rewardInfos[key].ethereumAddress = newAddress;
        rewardInfos[key].indexInArray = addressToKeys[newAddress].length - 1;

        emit addressUpdated(key,newAddress);
    }

    /**
     *   @notice Returns the number of registered ID
     *   
     *   @return number of IDS that generates rewards
     *   
     *
     */
    function GetNbRegisteredAdresses() public view returns (uint)
    {
        return nbRegisteredAddresses;
    }

    /**
     *   @notice Returns the ethereum address that can claim rewards for a given key
     *   
     *   @return The ethereum address
     *   
     *
     */
    function GetAddressFromKey(bytes20 key) public view returns (address)
    {
        require (rewardInfos[key].isInList,"ID not in list");   
        return rewardInfos[key].ethereumAddress;
    }




    /**
     *   @notice Returns the nb of tokens claimable for a given ethereum address
     *  
     *   @param ethAddress Ethereum address
     *
     *   @return Number of wei claimable
     *   
     *
     */
    function EstimateRewardForAddress(address ethAddress) public view returns (uint)
    {
        bytes20[] memory keys = addressToKeys[ethAddress];
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



    /**
     *   @notice Claim rewards
     *  
     *   
     *
     */
    function Claim() public
    {
        bytes20[] memory keys = addressToKeys[msg.sender];
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
        require(res,"Reward token transfer failed");
        emit addressClaimed(msg.sender);
       
    }

}
