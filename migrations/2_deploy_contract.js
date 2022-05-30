var Validateur = artifacts.require("./Validateur.sol");
var IdentityPerson = artifacts.require("./IdentityPerson.sol");

module.exports = async function (deployer) {
  //frploy contract validateur 
  await deployer.deploy(Validateur);
  const instanceValidateur = await Validateur.deployed();
  //deploy contract identity
  await deployer.deploy(IdentityPerson);
  const instanceIdentity = await IdentityPerson.deployed();
};
