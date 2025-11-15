// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.9.0;
pragma experimental ABIEncoderV2;

import "../interfaces/IRouterV3.sol";

contract RouterV3Mock is v3 {
    mapping(address => uint256[]) private tokenOutValues;
    uint256 public defaultTokenOut = 1;
    
    constructor() public payable {
    }

    function setTokenOut(uint256[] memory amounts) public {
        tokenOutValues[msg.sender] = amounts;
    }

    function getTokenOut(address sender) public view returns (uint256[] memory) {
        return tokenOutValues[sender];
    }

    function exactInput(ExactInputParams calldata params) external payable override returns (uint256 amountOut) {
        uint256[] memory amountsOut = getTokenOut(msg.sender);
        if (amountsOut.length == 0) {
            return params.amountOutMinimum; // Return minimum as default
        }
        return amountsOut[0];
    }

    function exactOutput(ExactOutputParams calldata params) external payable override returns (uint256 amountIn) {
        uint256[] memory amountsOut = getTokenOut(msg.sender);
        if (amountsOut.length == 0) {
            return params.amountInMaximum; // Return maximum as default
        }
        return amountsOut[0];
    }

    function refundETH() external payable override {
        // Mock implementation - does nothing
    }
}