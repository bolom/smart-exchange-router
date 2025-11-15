// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.9.0;

import "../tokens/TRC20.sol";

contract TRC20Mock is TRC20 {
    string public name;
    string public symbol;
    
    constructor() public {
        name = "Mock Token";
        symbol = "MOCK";
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }
}