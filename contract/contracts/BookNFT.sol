// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BookNFT is ERC721 {
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _bookTitles;

    constructor() ERC721("Book NFT", "BOOK") {}

    function mint(string memory bookTitle) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _bookTitles[tokenId] = bookTitle;
    }

    function getBookTitle(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "BookNFT: query for nonexistent token");
        return _bookTitles[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "BookNFT: query for nonexistent token");
        return "https://example.com/book_dapp_metadata.json"; // 固定値を返す
    }
}