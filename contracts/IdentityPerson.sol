// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract IdentityPerson {
    address defaultAdress;
    enum DocumentLegal {
        Passport,
        Securitesocial,
        permisConduire
    }
    enum TypeGeneration {
        Child,
        Adult,
        older
    }

    struct Parent {
        address ownerAddress;
        string name;
        string lastName;
        string gender;
        string country;
        DocumentLegal document;
        uint256 numberDocument;
        bytes20 identifiantUnique;
        bool validate;
    }

    struct Person {
        bytes20 identifiantUnique;
        address validateBy;
        TypeGeneration categorieAge;
        string name;
        string lastName;
        string otherName;
        string birthDate;
        string bithHour;
        string birthCity;
        string birthGender;
        string birthCountry;
        bool validate;
    }

    // Information d'une personne liée à un identifiant unique
    mapping(bytes20 => Person) private people;
    // Information d'une personne liée à un wallet
    mapping(address => Person) private peopleWithWallet;
    // Parent liée à une addresse
    mapping(bytes20 => Parent) private parent;
    //Event, register a person
    event registerPeople(
        bytes20 identifiantUnique,
        address validateBy,
        TypeGeneration categorieAge,
        string name,
        string lastName,
        string otherName,
        string birthDate,
        string bithHour,
        string birthCity,
        string birthGender,
        string birthCountry,
        bool validate
    );

    //Enregistrer des personnes
    function registerPerson(
        address _ownerAddress,
        string memory _name,
        string memory _lastName,
        string memory _otherName,
        string memory _birthDate,
        string memory _birthHour,
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
            _birthHour,
            _birthCity,
            _birthGender,
            _birthCountry,
            false
        );

        emit registerPeople(
            idPerson,
            defaultAdress,
            TypeGeneration.Child,
            "Pierrick",
            _lastName,
            _otherName,
            _birthDate,
            _birthHour,
            _birthCity,
            _birthGender,
            _birthCountry,
            false
        );

        // people[idPerson].push(ownPerson);
    }

    //Valider des personnes par l'état
    function validatePerson(address personWallet) public {
        peopleWithWallet[personWallet].validate = true;
        peopleWithWallet[personWallet].validateBy = msg.sender;
    }

    //Modifier des données
    function getPersonbyWallet(address personWallet)
        public
        view
        returns (Person memory)
    {
        require(msg.sender == personWallet, "Le wallet n'est pas le Bon");
        return peopleWithWallet[msg.sender];
    }
}
