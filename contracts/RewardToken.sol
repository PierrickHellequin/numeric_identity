// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";



contract RewardToken is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol,address minter) ERC20PresetMinterPauser(name, symbol) {
        grantRole(MINTER_ROLE, minter);
        grantRole(DEFAULT_ADMIN_ROLE, minter);
        grantRole(PAUSER_ROLE, minter);
    }
} 



