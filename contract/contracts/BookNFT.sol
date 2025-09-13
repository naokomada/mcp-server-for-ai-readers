// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BookNFT is ERC721 {
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _bookTitles;
    mapping(uint256 => string) private _bookUrls;

    constructor() ERC721("Book NFT", "BOOK") {}

    function mint(string memory bookTitle, string memory bookUrl) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _bookTitles[tokenId] = bookTitle;
        _bookUrls[tokenId] = bookUrl;
    }

    function getBookTitle(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "BookNFT: query for nonexistent token");
        return _bookTitles[tokenId];
    }

    function getBookUrl(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "BookNFT: query for nonexistent token");
        return _bookUrls[tokenId];
    }
}