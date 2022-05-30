// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// @title Contract validateur for the identity of an human
// @author Pierrick Hellequin
// @notice This contract add/update validateur
// @custom:certication This is an contrat create for the certification alyra
contract Validateur {
    enum TypeValidateur {
        hospital,
        state,
        townHall
    }

    struct validateur {
        address veriferAddress;
        string country;
        string city;
        string streetAddress;
        TypeValidateur typeValidateur;
        bool active;
    }

    mapping(address => validateur) private mapValidateur;

    event addValidateurEvent(address _veriferAddress, string  _country, string  _city, string  _streetAddress, TypeValidateur  _typeValidateur);
    /// @notice Create a MODIFIER to validate that only the validateur can execute some functions
    modifier onlyValidateur() {
        require(mapValidateur[msg.sender].active == true, "Only validateur can execute this function");
        _;
    }

    /// @notice Create a MODIFIER to validate that only the validateur can execute some functions
    modifier notValidateur() {
        require(mapValidateur[msg.sender].active == false, "Only not validateur can register informations.");
        _;
    }

    //@notice Add by default the deployer as validateur
    constructor() {
        mapValidateur[msg.sender] = validateur(
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
    function addValidateur(
        address _veriferAddress,
        string memory _country,
        string memory _city,
        string memory _streetAddress,
        TypeValidateur  _typeValidateur
    ) public onlyValidateur {
        require(msg.sender != address(0), "The wallet is not valid");
        require(_typeValidateur == TypeValidateur.hospital || _typeValidateur == TypeValidateur.state ||_typeValidateur == TypeValidateur.townHall, "Wrong type of validator");
        require(mapValidateur[_veriferAddress].active == false, "Already exist");

        mapValidateur[_veriferAddress] = validateur(
            _veriferAddress,
            _country,
            _city,
            _streetAddress,
            _typeValidateur,
            true
        );

        emit addValidateurEvent(_veriferAddress, _country, _city, _streetAddress,  _typeValidateur);
    }

    /// @notice Get my information of validateur
    function getMapValidateur() public view returns(validateur memory){
        return mapValidateur[msg.sender]; 
    } 
}
