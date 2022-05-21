   #ethdoc-viewer{ font-size: 0.8em; padding: 1em; } #ethdoc-viewer .lead{ font-size: 1em; } #ethdoc-viewer table { width: 50%; } #ethdoc-viewer hr { margin: 0; margin-bottom: 0.5rem; } #ethdoc-viewer p{ margin-bottom: 0.5rem; }

### IdFundedRewarder : IdFundedRewarder Contract

This rewards registered couples (id,EthereumAddress) regularly

Author: Tibo

  

**Functions**

* * *

###### Claim

**\*\*Add Documentation for the method here\*\***

No parameters

Returns:

No parameters

* * *

###### EstimateRewardForAddress

Name

Type

Description

ethAddress

address

Ethereum address

Returns:

Name

Type

Description

uint256

* * *

###### GetAddressFromKey

Name

Type

Description

key

bytes20

Returns:

Name

Type

Description

address

* * *

###### GetNbRegisteredAdresses

No parameters

Returns:

Name

Type

Description

uint256

* * *

###### RegisterAddress

Name

Type

Description

key

bytes20

Unique Id

newAddress

address

Ethereum address that will be allowed to claim rewards

Returns:

No parameters

* * *

###### RemoveAddress

Name

Type

Description

key

bytes20

Unique Id

Returns:

No parameters

* * *

###### UpdateAddress

Name

Type

Description

key

bytes20

Unique Id

newAddress

address

Ethereum address that will be allowed to claim rewards

Returns:

No parameters

* * *

###### owner

Returns the address of the current owner.

No parameters

Returns:

Name

Type

Description

address

* * *

###### renounceOwnership

Leaves the contract without owner. It will not be possible to call \`onlyOwner\` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.

No parameters

Returns:

No parameters

* * *

###### setRewardRate

Name

Type

Description

TokensPerSec

uint256

Nb of wei per second

Returns:

No parameters

* * *

###### setRewardToken

Name

Type

Description

RewTokenAddress

address

Address of the reward ERC20

Returns:

No parameters

* * *

###### transferOwnership

Transfers ownership of the contract to a new account (\`newOwner\`). Can only be called by the current owner.

Name

Type

Description

newOwner

address

Returns:

No parameters