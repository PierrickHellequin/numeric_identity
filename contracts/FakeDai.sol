// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract FakeDai is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender,1000000 * 1e18);
    }
} 