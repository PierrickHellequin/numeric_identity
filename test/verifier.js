const Verifier = artifacts.require("./Verifier.sol");
const { assert, expect, use } = require("chai");
const {  solidity } = require("ethereum-waffle");
use(solidity);

contract("Verifier", async ([deployer, verifierAddress, verif2]) => {
    let townHall = 2;
    let verifierContract;
    beforeEach( async() => {
        verifierContract = await Verifier.deployed({from: deployer});
    })

    it("1. Fail because it is not execute by a verifier", async() => {

        await expect(verifierContract.addVerifier(
            verifierAddress,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall, 
            {from: verifierAddress}
        )).to.be.revertedWith("Only verifier can execute this function");
    });

    it("2. Create a good verifier and check data", async() => {
        await verifierContract.addVerifier(
            verifierAddress,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall, 
            {from: deployer}
        );

        let newVerifier = await verifierContract.getMapVerifier({from: verifierAddress});
        expect(newVerifier.country).to.be.equal("France");
        expect(newVerifier.city).to.be.equal("Wattrelos");
        expect(newVerifier.streetAddress).to.be.equal("Rue du smrt contract");
        expect(newVerifier.active).to.be.true;
    });

    it("3. Fail because is already exist", async() => {

        await expect(verifierContract.addVerifier(
            verifierAddress,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall,
            {from: deployer}
        )).to.be.revertedWith("Already exist");
    });

    it("4. New verifier can add other verifier", async() => {

        await verifierContract.addVerifier(
            verif2,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall,
            {from: verifierAddress}
        );
        let newVerifier = await verifierContract.getMapVerifier({from: verif2});
        expect(newVerifier.country).to.be.equal("France");
    });

})
