// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Example {
    uint256 public totalSupply;
    bool public paused;

    constructor() {
        totalSupply = 1_000_000;
    }

    function challenge(uint256 newTotalSupply) external {
        require(!paused);
        totalSupply = newTotalSupply;
    }

    function pause() external {
        paused = true;
    }

    function unpause() external {
        paused = false;
    }
}
