// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

import "./Troca.sol";

contract NFT is ERC721URIStorage, ERC721Royalty {
    uint256 private tokenId  = 0;

    constructor() ERC721("Troca Club", "TRC") {}

    function _burn(uint256 _tokenId) internal override(ERC721URIStorage, ERC721Royalty) {
        super._burn(_tokenId);
    }

    function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Royalty) returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }
   
    function mint (address _troca, address _owner, string memory _tokenURI, uint96 _royalty) external returns (uint256) {
        require(Troca(_troca).members(_owner), "Owner must be a member.");
        
        tokenId ++;
        _safeMint(_owner, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _setTokenRoyalty(tokenId, _owner, _royalty);

        return tokenId;
    }
}
