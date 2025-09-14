import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BookNFTModule = buildModule("BookNFTModule", (m) => {
  const bookNFT = m.contract("BookNFT", []);

  return { bookNFT };
});

export default BookNFTModule;
