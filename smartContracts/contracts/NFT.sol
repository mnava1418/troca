// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./Troca.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenId  = 0;

    constructor() ERC721("Troca Club", "TRC") {}    
   
    function mint (address _troca, string memory _tokenURI) external returns (uint256) {
        require(Troca(_troca).members(msg.sender), "___Owner must be a member.___");
        
        tokenId ++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);       

        return tokenId;
    }
}
