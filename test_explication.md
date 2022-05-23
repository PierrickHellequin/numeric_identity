# Test et explication 
## TestRewarder.js

1) "...should be able to add accounts."

Teste l'ajout d'ID associé à une addresse ethereum qui pourra claim les rewards

2) "...should be able to remove accounts."

Teste la suppresion d'un ID (décès par exemple)

3) "...should be able to update addresses."

Teste la mise à jour de l'adresse ethereum associée à un ID

4) "...should have earned some rewards."

Teste que des rewards ont bien été accumulés.

5) "...should be able to claim."

Teste le claim de rewards.

6) "...A unique address should be able to manage multiple IDs."

Teste le fait qu'une unique ethereum adresse peut gérer différents ID. 

## identityPerson.js

1) Fail because verifier want to register person

Le test permet de vérifier qu'un Verifier ne puisse pas s'enregistrer en tant que personne dans la dApp

2) Fail because verifier want to register parent

Le test permet de vérifier qu'un Verifier ne puisse pas s'enregistrer en tant que parent dans la dApp

3) Fail because missing parent information

Le test permet de vérifier que les informations du parent soit enregistrer avant celle de l'enfant

4) Create a parent with the good information

Le test permet de vérifier que la création d'un parent avec les bonnes informations fonctionne

5) Fail create a parent because is already exist)

Le test permet de vérifier qu'on puisse pas enregistrer deux parent avec le même wallet

6) Create a person with the good information and a parent

Le test permet de vérifier que la création d'un personne fonctionne 

7) Fail to validate a child who doesn't exist

Le test permet de vérifier qu'on ne puisse pas valider des personnes qui n'existe pas

8) Validate a child

Le test permet de vérifier que la validation d'un enfant par un Verifier fonctionne

9) Fail because the limit of child is ten

Le test permet de vérifier qu'un parent ne puisse pas enregistrer plus de 10 enfants

10). Update a person information

Le test permet de vérifier que la mise à jour des informations d'une personne fontionne

## verifier.js

1) Fail because it is not execute by a verifier

Le test permet de vérifier que seul un autre Verifier puisse enregistrer un nouveau Verifier

2) Create a good verifier and check data

Le test permet de vérifier que l'ajout d'un Verifier fonctionne et que les données sont bien ajoutés 

3) Fail because is already exist

Le test permet de vérifier qu'on ne puisse pas ajouter deux Verifier

4).New verifier can add other verifier

Le test permet de vérifier que le nouveau Verifier enregistré posséde maintenant les droits d'un Verifier