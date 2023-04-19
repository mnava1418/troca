// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NFT.sol";

contract Troca is ReentrancyGuard {
    address payable public immutable ownerAccount;
    mapping(address => bool) public members;
    uint private immutable feePercent;

    /**EVENTS */
    event Subscription(
        address newMember
    );

    event BuyToken(
        address buyer,
        address seller,
        uint256 tokenId
    );

    event SwitchToken(
        address buyer,
        address seller,
        uint256 buyerTokenId,
        uint256 sellerTokenId
    );
    
    constructor(address _ownerAccount) {
        ownerAccount = payable(_ownerAccount);
        members[ownerAccount] = true;
        feePercent = 2;
    }

    function subscribe () payable external {
        require(msg.value > 0, "___Membership fee is mandatory.___");
        require(!members[msg.sender], "___You are already a member.___");
        
        ownerAccount.transfer(msg.value);
        members[msg.sender] = true;

        emit Subscription(msg.sender);
    }

    function buyToken (address _nft, address _nftOwner, uint256 _tokenId) payable external {
        require(_tokenId > 0, "___Token id is mandatory.___");
        
        uint256 fee = _calculateFee(msg.value);
        uint256 price = msg.value - fee;

        payable(_nftOwner).transfer(price);
        ownerAccount.transfer(fee);

        NFT(_nft).safeTransferFrom(_nftOwner, msg.sender, _tokenId);

        emit BuyToken(msg.sender, _nftOwner, _tokenId);
    }

    function switchToken (address _nft, address _seller, uint256 _sellerTokenId, uint256 _buyerTokenId) payable external {
        require(_sellerTokenId > 0, "___Seller Token Id is mandatory.___");
        require(_buyerTokenId > 0, "___Buyer Token Id is mandatory.___");

        require(members[_seller], "___Seller must be a member.___");
        require(members[msg.sender], "___Buyer must be a member.___");
        
        if(msg.value > 0) {
            uint256 fee = _calculateFee(msg.value);
            uint256 price = msg.value - fee;

            payable(_seller).transfer(price);
            ownerAccount.transfer(fee);
        }

        NFT(_nft).safeTransferFrom(_seller, msg.sender, _sellerTokenId);
        NFT(_nft).safeTransferFrom(msg.sender, _seller, _buyerTokenId);

        emit SwitchToken(msg.sender, _seller, _buyerTokenId, _sellerTokenId);
    }

    function _calculateFee(uint256 _amount) private view returns (uint256) {
          return (_amount * feePercent / 100);
    }
} 
