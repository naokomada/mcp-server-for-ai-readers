


import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BookNFT } from "../typechain-types";


describe("BookNFT", function () {

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBookNFTFixture() {
    
     // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const book = await hre.viem.deployContract("BookNFT");

    const publicClient = await hre.viem.getPublicClient();

    return {
      book,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { book } = await loadFixture(deployBookNFTFixture);

      expect(await book.read.name()).to.equal("Book NFT");
      expect(await book.read.symbol()).to.equal("BOOK");
    });
  });

  describe("Minting", function () {
    it("Should mint a new token", async function () {
      const { book } = await loadFixture(deployBookNFTFixture);

      const bookTitle = "My First Book";
      const bookUrl = "https://example.com/my_first_book";

      await book.write.mint([bookTitle, bookUrl]);

      const tokenId = 0n;
      expect(await book.read.getBookTitle([tokenId])).to.equal(bookTitle);
      expect(await book.read.getBookUrl([tokenId])).to.equal(bookUrl);
    })
  });

});
