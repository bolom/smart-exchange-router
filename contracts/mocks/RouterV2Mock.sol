// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.9.0;

contract RouterV2Mock {
    mapping(address => uint256[]) private tokenOutValues;
    uint256 public defaultTokenOut = 1;
    address[] public supportedTokens;

    constructor() public payable {
    }

    function setUp(address[] memory tokens, uint256 defaultOut) public {
        for (uint i = 0; i < tokens.length; i++) {
            // Mark tokens as supported
        }
        supportedTokens = tokens;
        defaultTokenOut = defaultOut;
    }

    function setTokenOut(uint256[] memory amounts) public {
        tokenOutValues[msg.sender] = amounts;
    }

    function getTokenOut(address sender) public view returns (uint256[] memory) {
        return tokenOutValues[sender];
    }

    // Mock implementation of V2 swap functions
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        address to,
        uint256 deadline
    ) public returns (uint256[] memory amounts) {
        uint256[] memory amountsOut = getTokenOut(msg.sender);
        if (amountsOut.length == 0) {
            amounts = new uint256[](path.length);
            amounts[0] = amountIn;
            for (uint i = 1; i < path.length; i++) {
                amounts[i] = defaultTokenOut;
            }
        } else {
            amounts = amountsOut;
        }
        require(amounts.length > 0, "No amounts set");
        return amounts;
    }
}