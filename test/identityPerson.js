const IdentityPerson = artifacts.require("identityPerson");
const { assert, expect, use } = require("chai");
const truffleAssert = require("truffle-assertions");
const { deployContract, MockProvider, solidity } = require("ethereum-waffle");
use(solidity);

contract("IdentityPerson", async ([deployer, parentAddress, validateur]) => {
  let identityPerson;
  beforeEach(async () => {
    identityPerson = await IdentityPerson.deployed();
  });

  it("Fail create a person because it is not the good wallet", async () => {
    await expect(
      identityPerson.registerPerson(
        parentAddress,
        "Pierrick",
        "Hellequin",
        "",
        "06/05/1992",
        "00:00:00",
        "France",
        "Wattrelos",
        "Male ultime",
        { from: validateur }
      )
    ).to.be.revertedWith("L adresse specifie ne corresponds pas.");
  });

  it("Create a person with the good information", async () => {
    //Create a child
    await identityPerson.registerPerson(
      parentAddress,
      "Pierrick",
      "Hellequin",
      "",
      "06/05/1992",
      "00:00:00",
      "France",
      "Wattrelos",
      "Male ultime",
      { from: parentAddress }
    );
    
    // We get the information of the child than we have create 
    let createPerson = await identityPerson.getPersonbyWallet(parentAddress, {
      from: parentAddress,
    });

    // An we verify information one by one
    expect(createPerson.name).to.be.equal("Pierrick");
    expect(createPerson.lastName).to.be.equal("Hellequin");
    expect(createPerson.birthCity).to.be.equal("Wattrelos");
  });
});

