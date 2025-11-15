// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <0.9.0;

contract ExchangerV1Mock {
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

    // Mock implementation of V1 exchange functions
    function trxToTokenTransferInput(
        uint256 minTokensBought,
        uint256 deadline,
        address recipient
    ) public payable returns (uint256 tokensBought) {
        uint256[] memory amounts = getTokenOut(msg.sender);
        if (amounts.length == 0) {
            return defaultTokenOut;
        }
        require(amounts.length > 0, "No amounts set");
        uint256 amount = amounts[0];
        require(amount > 0, "Amount must be greater than 0");
        return amount;
    }

    function tokenToTrxTransferInput(
        uint256 tokensSold,
        uint256 minEthBought,
        uint256 deadline,
        address recipient
    ) public returns (uint256 ethBought) {
        uint256[] memory amounts = getTokenOut(msg.sender);
        if (amounts.length == 0) {
            return defaultTokenOut;
        }
        require(amounts.length > 0, "No amounts set");
        uint256 amount = amounts[0];
        require(amount > 0, "Amount must be greater than 0");
        return amount;
    }

    function tokenToTokenTransferInput(
        uint256 tokensSold,
        uint256 minTokensBought,
        uint256 minEthBought,
        uint256 deadline,
        address recipient,
        address tokenAddr
    ) public returns (uint256 tokensBought) {
        uint256[] memory amounts = getTokenOut(msg.sender);
        if (amounts.length == 0) {
            return defaultTokenOut;
        }
        require(amounts.length > 0, "No amounts set");
        uint256 amount = amounts[0];
        require(amount > 0, "Amount must be greater than 0");
        return amount;
    }
}