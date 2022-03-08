// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
    uint256 public maxSupply = 1000000 ether;

    constructor()
        ERC20("Governance Token", "GOT")
        ERC20Permit("GovernanceToken")
    {
        _mint(msg.sender, maxSupply);
    }

    // Snapshot of tokens people have at a certain block
    // So people don't just buy a ton tokens to vote for a proposal and then dump the tokens

    // These are overrides that we need to write for snapshot purpose
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }
}
