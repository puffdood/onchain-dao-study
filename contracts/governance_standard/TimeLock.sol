// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        uint256 _minDelay, // how long you have to wait before executing
        address[] memory _proposers, // the list of addresses that can propose
        address[] memory _executors // the list of addresses that can execute
    ) TimelockController(_minDelay, _proposers, _executors) {}
}
