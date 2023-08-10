// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./Troca.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenId  = 0;
    uint private immutable mintLimit;

    constructor() ERC721("Troca Club", "TRC") {
        mintLimit = 10;
    }    
   
    function mint (address _troca, string memory _tokenURI) external returns (uint256) {
        require(Troca(_troca).members(msg.sender), "___Owner must be a member.___");
        require(Troca(_troca).tokensByMember(msg.sender) <= mintLimit, "___No remaining tokens to mint.___");
        
        tokenId ++;
        Troca(_troca).mintNft(msg.sender);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);       

        return tokenId;
    }
}
