// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Verifier.sol";

// @title Contract for the identity of an human
// @author Pierrick Hellequin
// @notice This contract
// @custom:certication This is an contrat create for the certification alyra
contract IdentityPerson is Verifier {
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
        uint16 nbChildren;
        bool alive;
        bytes20 identifiantUnique;
    }

    struct Person {
        address validateBy;
        address parentWallet;
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

    /// @notice Information of a parent linked to a wallet
    mapping(address => Parent) private parentWithWallet;
    /// @notice Information of a parent linked to a unique ID
    mapping(address => bytes20) private parentWithChild;
    /// @notice Information of a person linked to a wallet
    mapping(bytes20 => Person) private peopleByIdentifiant;

    /// @notice Event, register a person
    event registerPeople(
        bytes20 idPerson,
        address parentWallet,
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
        uint16 nbChildren,
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
    function registerParent (
        address _ownerAddress,
        string memory _name,
        string memory _lastName,
        string memory _country,
        string memory _document,
        uint256 _numberDocument
    )  notVerifier public {
        require(
            parentWithWallet[_ownerAddress].ownerAddress != _ownerAddress,
            "The parent already exist"
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
            0,
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
            0,
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
    )  public notVerifier returns(bytes20 ID){
        require(parentWithWallet[_ownerAddress].ownerAddress == _ownerAddress, "Missing information on parent.");
        require(parentWithWallet[_ownerAddress].nbChildren < 10, "The limit of registration is 10 child");
        bytes20 idPerson = bytes20(
            keccak256(abi.encode(msg.sender, blockhash(block.number - 1)))
        );

        peopleByIdentifiant[idPerson] = Person(
            defaultAdress,
            msg.sender,
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

        parentWithChild[msg.sender] = idPerson;
        parentWithWallet[_ownerAddress].nbChildren = parentWithWallet[_ownerAddress].nbChildren +1;

        emit registerPeople(
            idPerson,
            msg.sender,
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

        return idPerson;
    }

    /// @notice Update child informations 
    /// @param identifiantUnique identifiant unique of a person to update
    /// @param _name Name of the child
    /// @param _lastName Last name of the child
    /// @param _otherName other name of the child
    /// @param _birthDate Birth date at the birth child
    /// @param _birthGender Gender at birth of child
    function updatePerson(
        bytes20 identifiantUnique, string memory _name, string memory _lastName, string memory _otherName,
        string memory _birthGender, uint256 _birthDate
    ) public {
        require(peopleByIdentifiant[identifiantUnique].parentWallet == msg.sender, "You can only update your child information.");
        peopleByIdentifiant[identifiantUnique].name = _name;
        peopleByIdentifiant[identifiantUnique].lastName = _lastName;
        peopleByIdentifiant[identifiantUnique].otherName = _otherName;
        peopleByIdentifiant[identifiantUnique].birthGender = _birthGender;
        peopleByIdentifiant[identifiantUnique].birthDate = _birthDate;
        peopleByIdentifiant[identifiantUnique].validate = false;
    }

    /// @notice Validate child by the validator (State, hospital, town hall)
    /// @param identifiantUnique identifiant unique of a person to validate
    function validatePerson(bytes20 identifiantUnique) public onlyVerifier {
        require( peopleByIdentifiant[identifiantUnique].birthDate != 0, "This person doesn't exist");
        peopleByIdentifiant[identifiantUnique].validate = true;
        peopleByIdentifiant[identifiantUnique].validateBy = msg.sender;
    }

    /// @notice Get a person data by his wallet
    /// @param identifiantUnique identifiant unique
    function getPersonByID(bytes20 identifiantUnique) public view returns (Person memory){
        return peopleByIdentifiant[identifiantUnique];
    }

    /// @notice Get a parent data by his wallet
    function getParentbyWallet() public view returns (Parent memory){
        return parentWithWallet[msg.sender];
    }
}
