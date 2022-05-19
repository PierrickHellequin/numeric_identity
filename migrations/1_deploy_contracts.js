
var FakeDai = artifacts.require("./FakeDai.sol");
var Rewarder = artifacts.require("./IdFundedRewarder.sol");


const abiDai = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "bytes32"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "",
              "type": "bytes32"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          },
          {
              "name": "_spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  }
];

// // GANACHE DEPLOY
module.exports = async function(deployer) {

  var daiAdress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
  let accounts = await web3.eth.getAccounts();

  //var theaccount = accounts[0];
  var theaccount = "0x1AEA6e9F801E65c9967D061d8202C3dFc3447220";


  console.log("****** DEPLOY REWARDER CONTRACT **************************");
  await deployer.deploy(Rewarder);
  const instanceRewarder = await Rewarder.deployed();
  //console.log("adress rewarder "+instanceRewarder);
  
  // console.log("****** DEPLOY FAKE DAI TOKEN **************************");
  await deployer.deploy(FakeDai,"REWARD","REW");
  const FakeDaiInstance = await FakeDai.deployed();
  console.log("adress Dai token "+FakeDaiInstance.address);


  console.log("****** FUND REWARDER CONTRACT **************************");



  // 1000 dai for test
  const weiValue = web3.utils.toWei('1000', 'ether');
  //await FakeDaiInstance.methods.transfer(instanceRewarder.address,weiValue);
  FakeDaiInstance.transfer(instanceRewarder.address,weiValue);


  console.log("****** CALL SET REWARD TOKEN TO STAKER **************************");
  await instanceRewarder.setRewardToken(FakeDaiInstance.address);
  


  // change reward rate
  console.log("****** REWARD RATE **************************");
  await instanceRewarder.setRewardRate(1);


  
  // add some citizens
  console.log("****** ADDING SOME CITIZENS FOR DBG **************************");
  //await instanceRewarder.RegisterAddress(1,theaccount);
  
 
};


// // RINKEBY DEPLOY
// module.exports = async function(deployer) {

//     var daiAdress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
//     let accounts = await web3.eth.getAccounts();
  
//     //var theaccount = accounts[0];
//     var theaccount = "0x1AEA6e9F801E65c9967D061d8202C3dFc3447220";
  
  
//     console.log("****** DEPLOY REWARDER CONTRACT **************************");
//     await deployer.deploy(Rewarder);
//     const instanceRewarder = await Rewarder.deployed();
//     //console.log("adress rewarder "+instanceRewarder);
    
//     // console.log("****** DEPLOY REWARD TOKEN **************************");
//     // await deployer.deploy(RewardToken,"REWARD","REW");
//     // const instanceRew = await RewardToken.deployed();
//     // console.log("adress rew token "+instanceRew);
  
//     // use deployed DAI
    
//     //let instanceRew = web3.eth.contract(abiDai).at(daiAdress);
//     let instanceRew = new web3.eth.Contract(abiDai, daiAdress, {from: theaccount})
  
//     console.log("****** FUND REWARDER CONTRACT **************************");
  
  
  
//     // 100 dai for test
//     const weiValue = web3.utils.toWei('1000', 'ether');
//     await instanceRew.methods.transfer(instanceRewarder.address,weiValue);
  
//     console.log("****** CALL SET REWARD TOKEN TO STAKER **************************");
//     //await instanceRewarder.setRewardToken(instanceRew.address);
//     await instanceRewarder.setRewardToken(daiAdress);
  
  
//     // change reward rate
//     console.log("****** REWARD RATE **************************");
//     //await instanceRewarder.setRewardRate(100000000000000);
//     await instanceRewarder.setRewardRate(10000000000000);
  
    
//     // add some citizens
//     console.log("****** ADDING SOME CITIZENS FOR DBG **************************");
//     await instanceRewarder.RegisterAddress("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",theaccount);
    
   
//   };