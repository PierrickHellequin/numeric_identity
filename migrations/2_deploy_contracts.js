var RewardToken = artifacts.require("./RewardToken.sol");
var Rewarder = artifacts.require("./IdRewarder.sol");

module.exports = async function (deployer) {
/*   console.log("****** DEPLOY REWARDER CONTRACT **************************");
  await deployer.deploy(Rewarder);
  const instanceRewarder = await Rewarder.deployed();
  console.log("adress rewarder " + instanceRewarder);

  console.log("****** DEPLOY REWARD TOKEN **************************");
  await deployer.deploy(RewardToken, "REWARD", "REW", instanceRewarder.address);
  const instanceRew = await RewardToken.deployed();
  console.log("adress rew token " + instanceRew);

  console.log(
    "****** CALL SET REWARD TOKEN TO STAKER **************************"
  );
  await instanceRewarder.setRewardToken(instanceRew.address);

  // add some citizens
  console.log("****** ADDING SOME CITIZENS FOR DBG **************************");
  await instanceRewarder.RegisterAddress(
    1,
    "0x3De54f1515DFE078A471eb6dC229c258Be5a3ae3"
  ); */
  //await instanceRewarder.RegisterAddress(2,"0x167275608901797c1C3fA41DD549cfC7ca404c34");

};
