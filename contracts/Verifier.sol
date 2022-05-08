// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// @title Contract verifier for the identity of an human
// @author Pierrick Hellequin
// @notice This contract
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
        TypeValidateur typeVlidateur;
    }

    mapping(address => verifier) private mapVerifier;
    mapping(address => bool) private verifierByAddress;

    modifier onlyVerifier() {
        require(verifierByAddress[msg.sender] = true, "Not a verifier");
        _;
    }

    constructor() {
        verifierByAddress[msg.sender] = true;
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
        require(_typeValidateur == TypeValidateur.hospital || _typeValidateur == TypeValidateur.state ||_typeValidateur == TypeValidateur.townHall, "Mauvais type validateur");

        mapVerifier[_veriferAddress] = verifier(
            _veriferAddress,
            _country,
            _city,
            _streetAddress,
            _typeValidateur
        );

        verifierByAddress[_veriferAddress] = true;
    }

}
