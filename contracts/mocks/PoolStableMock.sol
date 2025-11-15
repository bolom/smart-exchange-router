// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.9.0;

import "../interfaces/IPoolStable.sol";
import "../interfaces/IERC20.sol";

contract PoolStableMock is poolStable {
    address[] public tokens;
    mapping(address => uint256) public balances;
    mapping(address => uint256[]) private tokenOutValues;
    uint256 public defaultTokenOut = 1;

    constructor(address[] memory _tokens, uint256 defaultOut) public {
        tokens = _tokens;
        defaultTokenOut = defaultOut;
    }

    function setTokenOut(uint256[] memory amounts) public {
        tokenOutValues[msg.sender] = amounts;
    }

    function getTokenOut(address sender) public view returns (uint256[] memory) {
        return tokenOutValues[sender];
    }

    function exchange(uint128 tokenIdIn, uint128 tokenIdOut, uint256 amountIn, uint256 amountOutMin) external override {
        uint256[] memory amountsOut = getTokenOut(msg.sender);
        uint256 actualAmountOut;
        if (amountsOut.length == 0) {
            actualAmountOut = amountIn; // simplified logic
        } else {
            actualAmountOut = amountsOut[0];
        }
        
        require(actualAmountOut >= amountOutMin, "amountOutMin not satisfied");
        
        // Simplified mock: just return the expected amount
        // In real implementation, this would handle actual token exchange
    }

    function coins(uint256 tokenId) external view override returns (address) {
        require(tokenId < tokens.length, "Invalid token ID");
        return tokens[tokenId];
    }
}