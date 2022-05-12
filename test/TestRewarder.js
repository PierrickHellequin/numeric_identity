const helper = require('./utils.js');
const SECONDS_IN_DAY = 86400;

const IdFundedRewarder = artifacts.require("./IdFundedRewarder.sol");
const RewardTokenDai = artifacts.require("./RewardTokenDai.sol");


contract("IdFundedRewarder", accounts => {


  var snapshotId;
  var amount3N;

  // add accounts
  it("...should be able to add accounts.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();


    await RewarderInstance.RegisterAddress(1, accounts[0], { from: accounts[0] });
    await RewarderInstance.RegisterAddress(2, accounts[1], { from: accounts[0] });

    // snapshot for id 3, so that we can advance in time later in tests
    snapshotId = await helper.takeSnapshot();

    

    await RewarderInstance.RegisterAddress(3, accounts[2], { from: accounts[0] });


    const nbRegistered = await RewarderInstance.GetNbRegisteredAdresses.call();

    assert.equal(nbRegistered, 3, "Nb of registered addresses is incorrect");
  });

  // remove accounts
  it("...should be able to remove accounts.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();


    await RewarderInstance.RemoveAddress(1, { from: accounts[0] });

    const nbRegistered = await RewarderInstance.GetNbRegisteredAdresses.call();

    assert.equal(nbRegistered, 2, "Nb of registered addresses is incorrect");
  });

  // key and addresses + check update
  it("...should be able to update addresses.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();

    const addresskey2 = await RewarderInstance.GetAddressFromKey.call(2);
    assert.equal(addresskey2, accounts[1], "GetAddressFromKey is incorrect");

    // const key3 = await RewarderInstance.GetKeyFromAddress.call(accounts[2]);
    // assert.equal(key3, 3, "GetKeyFromAddress is incorrect");

    // UPDATE
    await RewarderInstance.UpdateAddress(3, accounts[3]);
    const addresskey3 = await RewarderInstance.GetAddressFromKey.call(3);
    assert.equal(addresskey3, accounts[3], "Update address is incorrect");
   
  });

  // check estimated rewards after time
  // key and addresses + check update
  it("...should have earned some rewards.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();
    var nbDays = 1;


    //await helper.advanceTimeAndBlock(SECONDS_IN_DAY * nbDays); //advance 1 days
    await helper.revertToSnapShot(snapshotId);
    await helper.advanceTimeAndBlock(SECONDS_IN_DAY * nbDays); //advance 1 days

    // rate is 1 token/s --> 
    var rate = 1;
    const nbTokens = SECONDS_IN_DAY * nbDays * rate;


    const amount3 = await RewarderInstance.EstimateReward.call(3);
    amount3N = amount3.toNumber();
    const amount3bis = await RewarderInstance.EstimateRewardForAddress.call(accounts[3]);
    const amount3bisN = amount3bis.toNumber();


    assert.equal(amount3N,amount3bisN, "rewards amount is incorrect");
    // use a tolerance here as I don't know why but we have 86402 between blocks timestamps
    assert.equal((Math.abs(amount3bisN-nbTokens) < 5),true, "rewards amount is incorrect");
   
  });

  it("...should be able to claim.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();
    
    await RewarderInstance.Claim({ from: accounts[3] });

    const amount3bis = await RewarderInstance.EstimateRewardForAddress.call(accounts[3]);
    const amount3bisN = amount3bis.toNumber();

    const daiInstance = await RewardTokenDai.deployed();


    var balance = await daiInstance.balanceOf(accounts[3]);
    var balanceN = balance.toNumber();

    assert.equal(amount3bisN,0, "should not have rewards left to claim for now");
    // use a tolerance here as I don't know why but we have 86402 between blocks timestamps
    assert.equal((Math.abs(balanceN-amount3N) < 5),true, "claimed amount is incorrect");
   
  });




});
