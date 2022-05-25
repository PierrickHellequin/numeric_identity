const IdentityPerson = artifacts.require("identityPerson");
const { assert, expect, use } = require("chai");
const {  solidity } = require("ethereum-waffle");
use(solidity);
use(require('chai-bignumber')());

contract("IdentityPerson", async ([deployer, parentAddress, parentAddress2, validateur]) => {
  let identityPerson, uniqueIdentifiant;
  let event;
  before(async () => {
    identityPerson = await IdentityPerson.deployed({from: deployer});
  });

  it("1. Fail because verifier want to register person", async () => {
    
    await expect(
      identityPerson.registerPerson(
        parentAddress,
        "Pierrick",
        "Hellequin",
        "",
        Date.parse("06/05/1992 00:00:00"),
        "France",
        "Wattrelos",
        "Homme",
        { from: deployer }
      )
    ).to.be.revertedWith("Only not verifier can register informations.");
  });

  it("2. Fail because verifier want to register parent", async () => {
    
    await expect(identityPerson.registerParent(
      parentAddress,
      "Pierrick",
      "Hellequin",
      "France",
      "Passport",
      11235813213445,
      { from: deployer }
    )).to.be.revertedWith("Only not verifier can register informations."); 
  });

  it("3. Fail because missing parent information", async () => {
    await expect(
      identityPerson.registerPerson(
        parentAddress,
        "Pierrick",
        "Hellequin",
        "",
        Date.parse("06/05/1992 00:00:00"),
        "France",
        "Wattrelos",
        "Homme",
        { from: parentAddress }
      )
    ).to.be.revertedWith("Missing information on parent.");
  });

  it("4. Create a parent with the good information", async () => {

    await identityPerson.registerParent(
      parentAddress,
      "Pierrick",
      "Hellequin",
      "France",
      "Passport",
      11235813213445,
      { from: parentAddress }
    );

    let parent = await identityPerson.getParentbyWallet({ from: parentAddress });

    expect(parent.name).to.be.equal("Pierrick");
    expect(parent.lastName).to.be.equal("Hellequin");
    expect(parent.country).to.be.equal("France");
    expect(parent.document).to.be.equal("Passport");
    expect(parent.numberDocument).to.be.equal("11235813213445");

  });

  it("5. Fail create a parent because is already exist", async() => {
    await expect( identityPerson.registerParent(
      parentAddress,
      "Pierrick",
      "Hellequin",
      "France",
      "Passport",
      11235813213445,
      { from: parentAddress }
    )).to.be.revertedWith("The parent already exist");
  });

  it("6. Create a person with the good information and a parent", async () => {

    //Create a parent 
    await identityPerson.registerParent(
      parentAddress2,
      "Pierrick",
      "Hellequin",
      "France",
      "Passport",
      11235813213445,
      { from: parentAddress2 }
    );

    //Create a child
    let result = await identityPerson.registerPerson(
      parentAddress2,
      "Hugo",
      "Hellequin",
      "",
      Date.parse("06/05/2002 00:00:00"),
      "France",
      "Wattrelos",
      "Homme",
      { from: parentAddress2 }
    );

    event = result.logs[0].args;
    assert(event.name, "Hugo");
    assert(event.lastName, "Hugo");
    assert(event.birthDate, Date.parse("06/05/2002 00:00:00"));
    assert(event.birthCountry, "France");
    assert(event.birthCity, "Wattrelos");
    assert(event.birthGender, "Homme");
  }); 
  
  it("7. Fail to validate a child who doesn't exist", async() =>{
    await expect(identityPerson.validatePerson("0xd904b27454842a03653e4ef2a8bd6533c57043a4")).to.be.revertedWith("This person doesn't exist.");;
  });

  it("8. Validate a child", async() =>{
    await identityPerson.validatePerson(event.idPerson);
    let validPerson = await identityPerson.getPersonByID(event.idPerson);
    expect(validPerson.validate).to.be.true;
  });

  it('9. Update a person information', async()=>{
    await identityPerson.updatePerson(event.idPerson, "Cedric", "Vandaele", "enzo", "Homme", Date.parse("06/05/2002 00:00:00"), { from: parentAddress2 });
    let updatePerson = await identityPerson.getPersonByID(event.idPerson);
    expect(updatePerson.validate).to.be.false;
    expect(updatePerson.name).to.be.equal("Cedric");
  });
  
});
