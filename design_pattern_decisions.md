# Design patern décisions :notebook:

Notre projet a pour but la création d'un registre de naissance incorruptible et infalsifiable. Pour cela on a choisi la blockchain Ethereum qui a fait ces preuves niveau sécurité et facile à mettre en place. 
## REWARDER CONTRACT (IdFundedRewarder.sol)

- Set du Reward token et du reward rate

Ces deux paramètres peuvent être changés par les owners du contract. Cela permettra de changer le token de reward si nécessaire (par exemple, le gouvernement souhaite utiliser son propre token avec ses propres tokenomics).


- Gestion de plusieurs ID par addresse ethereum

Une addresse ethereum peut avoir la responsabilité (les rewards) de plusieurs ID. cela permet à un parent de pouvoir enregistrer tous ses enfants avec la même adresse ethereum. On a limité à 10 le nombre max d'ID gérés pour éviter les "unbounded loop". Au delà de 10 IDs gérés, il faudra utiliser une 2eme addresse ethereum.


- Héritage

Le rewarder contract hérite de IdModificationListener. L'idée était que ce contract pourrait être "setté" sur le contrat d'état civil et donc pourrait être remplacé par un autre. Au final, on ne crée pas de liens entre les contrats donc l'héritage n'est pas forcément utile pour le moment. Cela pourrait tout de même simplifier l'écriture d'autrs "Rewarder" au niveau de la dapp (ou d'un wallet dans le futur)


- Lien entre le Rewarder et le contrat d'état civil

Le contrat qui valide une identité et le contrat qui contient les (ID,addresse) à rewarder sont indépendants.
Les deux seront alimentés via le front end. Créer une dépendance entre les deux contrat aurait été contraignant en terme d'évolution des contrats ou du design de l'application.


- Lien avec les protocoles "Defi"

Le lien est fait au niveau du front end et pas au niveau du smart contract de rewarder.
Les avantages sont:
    - smart contract plus simple (pas besoin de gérer les différents "placements")
    - ajout d'autres protocoles facile
    - la personne est plus libre dans ce qu'elle peut faire (utiliser un autre wallet)

## IDENTITY CONTRACT (IdentityPerson.sol/Validateur.sol)

### Guard Check

Permet de tester que les données en entrées sont valides et que l'ajout de donnée ne sont éxécuté que sous certaines conditions.
        
    require(msg.sender != address(0), "Not a good wallet");
    require(parentWithWallet[_ownerAddress].ownerAddress != _ownerAddress,"The parent already exist");

* Permet de s'assurer que le wallet renseigner est bien un owner valide.
* Permet de s'assurer que le wallet n'est pas déjà enregistré. 

### Restriction d'accès 

    modifier onlyValidateur() {
        require(mapValidateur[msg.sender].active == true, "Only validateur can execute this function");
        _;
    }

Permet de vérifier que seulement les entités (état, hôpital, mairie) puissent valider les données d'une personne ou ajouter une autre entité. 

    modifier notValidateur() {
        require(mapValidateur[msg.sender].active == false, "Only not validateur can register informations.");
        _;
    }

* Permet de vérifié que les entités (état, hopital, mairie) ne puissent pas s'enregistrer en tant que parent.

### Tight Variable Packing

Permet la réduction de gas en déclarant les données dans un struct du même type ensemble.

    struct Person {
        address validateBy;
        address parentWallet;
        TypeGeneration categorieAge;
        string name;
        string lastName;
        string otherName;
        string birthCity;
        string birthGender;
        string birthCountry;
        uint256 birthDate;
        bool alive;
        bool validate;
    }