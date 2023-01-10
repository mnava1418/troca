// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/*contract Troca is ReentrancyGuard {
    
}*/

contract Troca {
    address payable public immutable ownerAccount;
    mapping(address => bool) public members;

    /**EVENTS */
    event Subscription(
        address newMember
    );
    
    constructor(address _ownerAccount) {
        ownerAccount = payable(_ownerAccount);
    }

    function subscribe () payable external {
        require(msg.value > 0, "Membership fee is mandatory.");
        require(!members[msg.sender], "You are already a member.");
        
        ownerAccount.transfer(msg.value);
        members[msg.sender] = true;

        emit Subscription(msg.sender);
    }
} 
