const Validateur = artifacts.require("./Validateur.sol");
const { assert, expect, use } = require("chai");
const {  solidity } = require("ethereum-waffle");
use(solidity);

contract("Validateur", async ([deployer, validateurAddress, verif2]) => {
    let townHall = 2;
    let validateurContract;
    beforeEach( async() => {
        validateurContract = await Validateur.deployed({from: deployer});
    })

    it("1. Fail because it is not execute by a validateur", async() => {

        await expect(validateurContract.addValidateur(
            validateurAddress,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall, 
            {from: validateurAddress}
        )).to.be.revertedWith("Only validateur can execute this function");
    });

    it("2. Create a good validateur and check data", async() => {
        await validateurContract.addValidateur(
            validateurAddress,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall, 
            {from: deployer}
        );

        let newValidateur = await validateurContract.getMapValidateur({from: validateurAddress});
        expect(newValidateur.country).to.be.equal("France");
        expect(newValidateur.city).to.be.equal("Wattrelos");
        expect(newValidateur.streetAddress).to.be.equal("Rue du smrt contract");
        expect(newValidateur.active).to.be.true;
    });

    it("3. Fail because is already exist", async() => {

        await expect(validateurContract.addValidateur(
            validateurAddress,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall,
            {from: deployer}
        )).to.be.revertedWith("Already exist");
    });

    it("4. New validateur can add other validateur", async() => {

        await validateurContract.addValidateur(
            verif2,
            "France",
            "Wattrelos",
            "Rue du smrt contract",
            townHall,
            {from: validateurAddress}
        );
        let newValidateur = await validateurContract.getMapValidateur({from: verif2});
        expect(newValidateur.country).to.be.equal("France");
    });

})
