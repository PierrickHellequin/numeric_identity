***** Rewards farming

Le risque principal en terme de sécurité, est d'avoir des fausses addresses enregistrées dans le contrat.
C'est pourquoi le process de validation (onlyOwner onlyValidator ou multiSig) est essentiel. La problématique est reportée sur la confiance qu'on aura dans les entités pouvant valider les ID. A terme le multisig sera indispensable car un "validateur" pourrait être corrompu (acteur malicieux ou perte/vol de clé privée) 


***** Re-Entrancy

Nos contrats ne sont pas concernés par cette attaque car on n'envoie pas d'ether et on n'en reçoit pas.


***** Arithmetic Over/Under Flows

Nous n'avons pas vu d'exploitation possible d'over/under flows. Mais dans un but préventif, nous utilisons tout de même safeMath dans IdFundedRewarder.sol.


***** Unexpected Ether

Ether envoyé par SelfDestruct ou pre-sent ether. Le fait que nos contrats aient une balance d'ether n'a aucune conséquence sur leur fonctionnement.


***** Delegatecall

Pas utilisé.


***** Default Visibilities

Les visibilités des différentes functions et variables ont été indiquées et vérifiées.


***** Entropy Illusion

Nous n'utilisons pas de random.


***** Frontrunning

Pas trouvé de frontrun possible.


***** Tx.Origin Authentication

Nous n'utilisons pas Tx.origin


***** DOS

Un DOS était possible si à une même addresse était associés trop d'ID (pas évident à réaliser puisque validé par un validateur). Nous avons donc limité à 10 le nombre d'ID associés à une addresse ethereum. Les loops ne dépassent donc jamais 10 itérations.


***** Block Timestamp Manipulation

Timestamp est utilisé seulement pour connaître combien on peut claim.



