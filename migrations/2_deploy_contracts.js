var RewardToken = artifacts.require("./RewardTokenDai.sol");
//var Rewarder = artifacts.require("./IdRewarder.sol");
var Rewarder = artifacts.require("./IdFundedRewarder.sol");

module.exports = async function(deployer) {

  let accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  console.log("****** DEPLOY REWARDER CONTRACT **************************");
  await deployer.deploy(Rewarder);
  const instanceRewarder = await Rewarder.deployed();
  console.log("adress rewarder "+instanceRewarder);
  
  console.log("****** DEPLOY REWARD TOKEN **************************");
  // await deployer.deploy(RewardToken,"REWARD","REW",instanceRewarder.address);
  // const instanceRew = await RewardToken.deployed();
  // console.log("adress rew token "+instanceRew);

  await deployer.deploy(RewardToken,"REWARD","REW");
  const instanceRew = await RewardToken.deployed();
  console.log("adress rew token "+instanceRew);


  console.log("****** FUND REWARDER CONTRACT **************************");

  // 1000 dai for test
  const weiValue = web3.utils.toWei('1000', 'ether');
  instanceRew.transfer(instanceRewarder.address,weiValue);

  console.log("****** CALL SET REWARD TOKEN TO STAKER **************************");
  await instanceRewarder.setRewardToken(instanceRew.address);


  // // add some citizens
  // console.log("****** ADDING SOME CITIZENS FOR DBG **************************");
  // await instanceRewarder.RegisterAddress(1,accounts[0]);
  // //await instanceRewarder.RegisterAddress(2,"0x167275608901797c1C3fA41DD549cfC7ca404c34");
 
};
