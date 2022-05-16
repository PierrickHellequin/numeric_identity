// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Verifier.sol";
// @title Contract for the identity of an human
// @author Pierrick Hellequin
// @notice This contract 
// @custom:certication This is an contrat create for the certification alyra
contract IdentityPerson is Verifier{

    address defaultAdress;
    enum DocumentLegal {
        Passport,
        Securitesocial,
        permisConduire
    }

    enum TypeGeneration {
        Child,
        Adult
    }

    struct Parent {
        address ownerAddress;
        TypeGeneration categorieAge;
        string name;
        string lastName;
        string country;
        string document;
        uint256 numberDocument;
        bool alive;
        bytes20 identifiantUnique;
    }

    struct Person {
        bytes20 identifiantUnique;
        address validateBy;
        TypeGeneration categorieAge;
        string name;
        string lastName;
        string otherName;
        uint256 birthDate;
        string birthCity;
        string birthGender;
        string birthCountry;
        bool alive;
        bool validate;
    }

    /// @notice Information of a person linked to a wallet
    mapping(address => Person) private peopleWithWallet;
    /// @notice Information of a parent linked to a wallet
    mapping(address => Parent) private parentWithWallet;
    /// @notice Event, register a person
    event registerPeople(
        bytes20 identifiantUnique,
        address validateBy,
        TypeGeneration categorieAge,
        string name,
        string lastName,
        string otherName,
        uint256 birthDate,
        string birthCity,
        string birthGender,
        string birthCountry,
        bool alive,
        bool validate
    );

    event registerParentEvent(
        address _ownerAddress,
        TypeGeneration,
        string name,
        string lastName,
        string country,
        string document,
        uint256 numberDocument,
        bool alive,
        bytes20 idPerson
    );

    /// @notice Function to save the identity of the owner of the wallet (the parent)
    /// @param  _ownerAddress : The address of the owner of this identity
    /// @param _name : Name of this identity
    /// @param _lastName : lastname of this identity
    /// @param _country : country of this identity 
    /// @param _document: type of document (Passport, Secrurity social, drive license)
    /// @param  _numberDocument: number associated with the type of document
    function registerParent(
        address _ownerAddress,
        string memory _name,
        string memory _lastName,
        string memory _country,
        string memory _document,
        uint256 _numberDocument
    ) public {
        require(
            _ownerAddress == msg.sender,
            "L adresse specifie ne corresponds pas."
        );
        bytes20 idPerson = bytes20(
            keccak256(abi.encode(msg.sender, blockhash(block.number - 1)))
        );

        parentWithWallet[msg.sender] = Parent(
            _ownerAddress,
            TypeGeneration.Adult,
            _name,
            _lastName,
            _country,
            _document,
            _numberDocument,
            true,
            idPerson
        );

        emit registerParentEvent(
            _ownerAddress,
            TypeGeneration.Adult,
            _name,
            _lastName,
            _country,
            _document,
            _numberDocument,
            true,
            idPerson
        );
    }

    /// @notice Function to save the children of the owner address
    /// @param _ownerAddress Address of the parent of the child
    /// @param _name Name of the child 
    /// @param _lastName Last name of the child
    /// @param _otherName other name of the child
    /// @param _birthDate Birth date at the birth child
    /// @param _birthCountry Country at the birth child
    /// @param _birthCity City at the birth child
    /// @param _birthGender Gender at birth of child 
    function registerPerson(
        address _ownerAddress,
        string memory _name,
        string memory _lastName,
        string memory _otherName,
        uint256 _birthDate,
        string memory _birthCountry,
        string memory _birthCity,
        string memory _birthGender
    ) public {
        require(
            _ownerAddress == msg.sender,
            "L adresse specifie ne corresponds pas."
        );

        bytes20 idPerson = bytes20(
            keccak256(abi.encode(msg.sender, blockhash(block.number - 1)))
        );

        peopleWithWallet[msg.sender] = Person(
            idPerson,
            defaultAdress,
            TypeGeneration.Child,
            _name,
            _lastName,
            _otherName,
            _birthDate,
            _birthCity,
            _birthGender,
            _birthCountry,
            true,
            false
        );

        emit registerPeople(
            idPerson,
            defaultAdress,
            TypeGeneration.Child,
            _name,
            _lastName,
            _otherName,
            _birthDate,
            _birthCity,
            _birthGender,
            _birthCountry,
            true,
            false
        );

    }

    /// @notice Validate child by the validator (State, hospital, town hall)
    /// @param peopleWallet address wallet of the person to validate
    function validatePerson(address peopleWallet) onlyVerifier public {
        peopleWithWallet[peopleWallet].validate = true;
        peopleWithWallet[peopleWallet].validateBy = msg.sender;
    }

    /// @notice Get a person data by his wallet
    /// @param peopleWallet address wallet of the person to get the data
    function getPersonbyWallet(address peopleWallet)
        private
        view
        returns (Person memory)
    {
        require(msg.sender == peopleWallet, "Le wallet n'est pas le bon");
        return peopleWithWallet[msg.sender];
    }

    /// @notice Get a parent data by his wallet
    /// @param parentWallet address wallet of the parent to get the data
    function getParentbyWallet(address parentWallet)
        private
        view
        returns (Parent memory)
    {
        require(msg.sender == parentWallet, "Le wallet n'est pas le bon");
        return parentWithWallet[msg.sender];
    }
}
