// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// @title Contract verifier for the identity of an human
// @author Pierrick Hellequin
// @notice This contract add/update verifier
// @custom:certication This is an contrat create for the certification alyra
contract Verifier {
    enum TypeValidateur {
        hospital,
        state,
        townHall
    }

    struct verifier {
        address veriferAddress;
        string country;
        string city;
        string streetAddress;
        TypeValidateur typeValidateur;
        bool active;
    }

    mapping(address => verifier) private mapVerifier;

    event addVerifierEvent(address _veriferAddress, string  _country, string  _city, string  _streetAddress, TypeValidateur  _typeValidateur);
    /// @notice Create a MODIFIER to validate that only the verifier can execute some functions
    modifier onlyVerifier() {
        require(mapVerifier[msg.sender].active == true, "Only verifier can execute this function");
        _;
    }

    /// @notice Create a MODIFIER to validate that only the verifier can execute some functions
    modifier notVerifier() {
        require(mapVerifier[msg.sender].active == false, "Only not verifier can register informations.");
        _;
    }

    //@notice Add by default the deployer as verifier
    constructor() {
        mapVerifier[msg.sender] = verifier(
            msg.sender,
            "@solidyLand",
            "@truffle",
            "@rue de la joie",
            TypeValidateur.state,
            true
        );
    }

    /// @notice Function to save the identity of the owner of the wallet (the parent)
    /// @param  _veriferAddress : The address of the owner of this identity
    /// @param _country : country of this identity
    /// @param _city : city of this identity
    /// @param _streetAddress : country of this identity
    /// @param _typeValidateur type of validateur
    function addVerifier(
        address _veriferAddress,
        string memory _country,
        string memory _city,
        string memory _streetAddress,
        TypeValidateur  _typeValidateur
    ) public onlyVerifier {
        
        require(_typeValidateur == TypeValidateur.hospital || _typeValidateur == TypeValidateur.state ||_typeValidateur == TypeValidateur.townHall, "Wrong type of validator");
        require(mapVerifier[_veriferAddress].active == false, "Already exist");

        mapVerifier[_veriferAddress] = verifier(
            _veriferAddress,
            _country,
            _city,
            _streetAddress,
            _typeValidateur,
            true
        );

        emit addVerifierEvent(_veriferAddress, _country, _city, _streetAddress,  _typeValidateur);
    }

    /// @notice Get my information of verifier
    function getMapVerifier() public view returns(verifier memory){
        return mapVerifier[msg.sender]; 
    } 

}
