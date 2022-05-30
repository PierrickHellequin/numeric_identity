   #ethdoc-viewer{ font-size: 0.8em; padding: 1em; } #ethdoc-viewer .lead{ font-size: 1em; } #ethdoc-viewer table { width: 50%; } #ethdoc-viewer hr { margin: 0; margin-bottom: 0.5rem; } #ethdoc-viewer p{ margin-bottom: 0.5rem; }

### IdentityPerson

  

**Functions**

* * *

###### addValidateur

Name

Type

Description

\_veriferAddress

address

: The address of the owner of this identity

\_country

string

: country of this identity

\_city

string

: city of this identity

\_streetAddress

string

: country of this identity

\_typeValidateur

uint8

type of validateur

Returns:

No parameters

* * *

###### getMapValidateur

**\*\*Add Documentation for the method here\*\***

No parameters

Returns:

Name

Type

Description

tuple

* * *

###### getParentbyWallet

**\*\*Add Documentation for the method here\*\***

No parameters

Returns:

Name

Type

Description

tuple

* * *

###### getPersonByID

Name

Type

Description

identifiantUnique

bytes20

identifiant unique

Returns:

Name

Type

Description

tuple

* * *

###### registerParent

Name

Type

Description

\_ownerAddress

address

: The address of the owner of this identity

\_name

string

: Name of this identity

\_lastName

string

: lastname of this identity

\_country

string

: country of this identity

\_document

string

: type of document (Passport, Secrurity social, drive license)

\_numberDocument

uint256

: number associated with the type of document

Returns:

No parameters

* * *

###### registerPerson

Name

Type

Description

\_ownerAddress

address

Address of the parent of the child

\_name

string

Name of the child

\_lastName

string

Last name of the child

\_otherName

string

other name of the child

\_birthDate

uint256

Birth date at the birth child

\_birthCountry

string

Country at the birth child

\_birthCity

string

City at the birth child

\_birthGender

string

Gender at birth of child

Returns:

Name

Type

Description

ID

bytes20

* * *

###### updatePerson

Name

Type

Description

identifiantUnique

bytes20

identifiant unique of a person to update

\_name

string

Name of the child

\_lastName

string

Last name of the child

\_otherName

string

other name of the child

\_birthGender

string

Gender at birth of child

\_birthDate

uint256

Birth date at the birth child

Returns:

No parameters

* * *

###### validatePerson

Name

Type

Description

identifiantUnique

bytes20

identifiant unique of a person to validate

Returns:

No parameters