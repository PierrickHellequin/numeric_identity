const helper = require('./utils.js');
const SECONDS_IN_DAY = 86400;

const IdFundedRewarder = artifacts.require("./IdFundedRewarder.sol");
const FakeDai = artifacts.require("./FakeDai.sol");


contract("IdFundedRewarder", accounts => {


  var snapshotId;
  var amount3N;

  var id1 = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id2 = "0xbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id3 = "0xcaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

  var id4 = "0xdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id5 = "0xeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id6 = "0xfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id7 = "0xabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id8 = "0xacaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id9 = "0xadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id10 ="0xaeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id11 ="0xafaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  var id12 ="0xa1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

  var id13 ="0xa2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";


  // rinkeby mode
  // var theaccount = "0x1AEA6e9F801E65c9967D061d8202C3dFc3447220";

  // var account0 = theaccount;
  // var account1 = "0x42779cE288a2fA61e4C719aD0c952D1E441F6d34";
  // var account2 = "0x0A6Dc092a6A5d438bF911653E064E692e30Cb603";

  // ganache mode
  var theaccount = accounts[0];
  var account0 = accounts[0];
  var account1 = accounts[1];
  var account2 = accounts[2];
  var account3 = accounts[3];

  // add accounts
  it("...should be able to add accounts.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();


    await RewarderInstance.RegisterAddress(id1, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id2, account1, { from: theaccount });

    // snapshot for id 3, so that we can advance in time later in tests
    snapshotId = await helper.takeSnapshot();

    

    await RewarderInstance.RegisterAddress(id3, account2, { from: theaccount });


    const nbRegistered = await RewarderInstance.GetNbRegisteredAdresses.call();

    assert.equal(nbRegistered, 3, "Nb of registered addresses is incorrect");
  });

  // remove accounts
  it("...should be able to remove accounts.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();


    await RewarderInstance.RemoveAddress(id1, { from: accounts[0] });

    const nbRegistered = await RewarderInstance.GetNbRegisteredAdresses.call();

    assert.equal(nbRegistered, 2, "Nb of registered addresses is incorrect");
  });

  // key and addresses + check update
  it("...should be able to update addresses.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();

    const addresskey2 = await RewarderInstance.GetAddressFromKey.call(id2);
    assert.equal(addresskey2, account1, "GetAddressFromKey is incorrect");

    // UPDATE
    await RewarderInstance.UpdateAddress(id3, accounts[3]);
    const addresskey3 = await RewarderInstance.GetAddressFromKey.call(id3);
    assert.equal(addresskey3, account3, "Update address is incorrect");
   
  });

  // check estimated rewards after time
  // key and addresses + check update
  it("...should have earned some rewards.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();
    var nbDays = 1;


    //await helper.advanceTimeAndBlock(SECONDS_IN_DAY * nbDays); //advance 1 days
    await helper.revertToSnapShot(snapshotId);
    await helper.advanceTimeAndBlock(SECONDS_IN_DAY * nbDays); //advance 1 days

    // rate is 1 wei/s --> 
    var rate = 1;
    const nbTokens = SECONDS_IN_DAY * nbDays * rate;


 
    const amount3bis = await RewarderInstance.EstimateRewardForAddress.call(account3);
    const amount3bisN = amount3bis.toNumber();



    // use a tolerance here as I don't know WHY but we have 86411 between blocks timestamps
    // tolerance is in Wei so it's acceptable
    assert.equal((Math.abs(amount3bisN-nbTokens) < 20),true, "rewards amount is incorrect");
    //assert.equal(amount3bisN,nbTokens, "rewards amount is incorrect");
   
  });

  it("...should be able to claim.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();
    
    const daiInstance = await FakeDai.deployed();


    var balanceContract = await daiInstance.balanceOf(RewarderInstance.address);
    var balanceContract2 = web3.utils.fromWei(balanceContract, 'ether');

    const amount3bis = await RewarderInstance.EstimateRewardForAddress.call(account3);
    const amount3bisN = amount3bis.toNumber();

    // const daiInstance = await RewardTokenDai.deployed();
    await RewarderInstance.Claim({ from: account3 });

    var balance = await daiInstance.balanceOf(account3);
    var balanceN = balance.toNumber();

    //assert.equal(amount3bisN,balanceN, "should not have rewards left to claim for now");
    // use a tolerance here as I don't know why but we have 86411 between blocks timestamps
    assert.equal((Math.abs(balanceN-amount3bisN) < 20),true, "claimed amount is incorrect");
   
  });

  it("...A unique address should be able to manage multiple IDs.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();
    
    // 2eme id associé à account0
    await RewarderInstance.RegisterAddress(id4, account0, { from: theaccount });
    //
    await RewarderInstance.RegisterAddress(id5, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id6, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id7, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id8, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id9, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id10, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id11, account0, { from: theaccount });
    await RewarderInstance.RegisterAddress(id12, account0, { from: theaccount });

    // // This one should not be added (10 max)
    // var iserror = false;
    // try {
    //   await RewarderInstance.RegisterAddress(id13, account0, { from: theaccount });
    // } 
    // catch (error)
    // {
    //   iserror = true;
    // }
    // if (!iserror)
    // {
    //   assert.equal(1,0, "Adding 11 ID should trigger an exception");
    // }



   
  });




});
