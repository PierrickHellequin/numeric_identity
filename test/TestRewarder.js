const IdFundedRewarder = artifacts.require("./IdFundedRewarder.sol");
const RewardTokenDai = artifacts.require("./RewardTokenDai.sol");


contract("IdFundedRewarder", accounts => {

  // // initialize
  // it("...should initialize ok.", async () => {
  //   const IdFundedRewarder = await IdFundedRewarder.deployed();
  //   const RewardTokenDai = await RewardTokenDai.deployed();

  //   // set reward token
  //   await IdFundedRewarder.setRewardToken(RewardTokenDai.adress);

  //   // Set value of 89
  //   await simpleStorageInstance.set(89, { from: accounts[0] });

  //   // Get stored value
  //   const storedData = await simpleStorageInstance.get.call();

  //   assert.equal(storedData, 89, "The value 89 was not stored.");
  // });


  // add accounts
  it("...should be able to add accounts.", async () => {
    const RewarderInstance = await IdFundedRewarder.deployed();


    await RewarderInstance.RegisterAddress(1, accounts[0], { from: accounts[0] });
    await RewarderInstance.RegisterAddress(2, accounts[1], { from: accounts[0] });
    await RewarderInstance.RegisterAddress(3, accounts[2], { from: accounts[0] });

    // Get stored value
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

    const key3 = await RewarderInstance.GetKeyFromAddress.call(accounts[2]);
    assert.equal(key3, 3, "GetKeyFromAddress is incorrect");

    // UPDATE
    await RewarderInstance.UpdateAddress(3, accounts[3]);
    const addresskey3 = await RewarderInstance.GetAddressFromKey.call(3);
    assert.equal(addresskey3, accounts[3], "Update address is incorrect");
   
  });

  // check estimated rewards after time


  // check remove accounts and that they're not there anymore





});
