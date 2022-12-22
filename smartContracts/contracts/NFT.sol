// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint tokenId = 0;

    constructor() ERC721("My NFT", "NFT") {}
    
    function mint (string memory _tokenURI) external returns (uint) {
        tokenId ++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }
}