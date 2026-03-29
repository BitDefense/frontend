// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Example {
    public uint256 totalSupply;

    constructor() {
        totalSupply = 1 ether;
    }

    function attack(uint256 newTotalSupply) external {
        totalSupply = newTotalSupply;
    }
}
