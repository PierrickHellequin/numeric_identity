var Verifier = artifacts.require("./Verifier.sol");
var IdentityPerson = artifacts.require("./IdentityPerson.sol");

module.exports = async function (deployer) {
  //frploy contract verifier 
  await deployer.deploy(Verifier);
  const instanceVerifier = await Verifier.deployed();
  //deploy contract identity
  await deployer.deploy(IdentityPerson);
  const instanceIdentity = await IdentityPerson.deployed();
};
