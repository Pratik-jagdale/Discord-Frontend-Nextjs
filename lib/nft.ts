import { ethers } from "ethers";

export interface NFTCollection {
  id: string;
  name: string;
  contractAddress: string;
  nfts: NFT[];
}

export interface NFT {
  id: string;
  name: string;
  tokenId: string;
  image?: string;
}

export class NFTService {
  constructor() {
    // No skyBrowser needed for testing
  }

  async getUserNFTCollections(userAddress: string): Promise<NFTCollection[]> {
    console.log(`Mock: getUserNFTCollections for address ${userAddress}`);
    const nftIds = await this.fetchNfts(userAddress);
    const nfts: NFT[] = nftIds.map((tokenId) => ({
      id: tokenId,
      name: `Agent NFT #${tokenId}`,
      tokenId,
      image: `https://placekitten.com/200/200?image=${tokenId}`,
    }));
    return [
      {
        id: "0x1234567890abcdef",
        name: "Agent NFT Collection",
        contractAddress: "0x1234567890abcdef",
        nfts,
      },
    ];
  }

  async fetchNfts(address: string): Promise<string[]> {
    console.log(`Mock: fetchNfts for address ${address}`);
    // Hardcoded NFT IDs
    const hardcodedNFTs = ["1", "2", "3", "42", "99"];
    // Simulate storing in localStorage
    localStorage.setItem(`nfts-${address}`, JSON.stringify(hardcodedNFTs));
    return hardcodedNFTs;
  }

  async getNFTsFromCollection(contractAddress: string, userAddress: string): Promise<NFT[]> {
    console.log(`Mock: getNFTsFromCollection for contract ${contractAddress} and user ${userAddress}`);
    const nftIds = await this.fetchNfts(userAddress);
    return nftIds.map((tokenId) => ({
      id: tokenId,
      name: `Agent NFT #${tokenId}`,
      tokenId,
      image: `https://placekitten.com/200/200?image=${tokenId}`, // random image for testing
    }));
  }

  async verifyNFTOwnership(contractAddress: string, tokenId: string, userAddress: string): Promise<boolean> {
    console.log(`Mock: verifyNFTOwnership for token ${tokenId} and user ${userAddress}`);
    // Pretend user owns tokenId '1' and '42' only
    return ["1", "42"].includes(tokenId);
  }

  async mintNft(): Promise<boolean> {
    console.log(`Mock: mintNft called`);
    // Simulate successful mint
    alert("Mock: NFT minted successfully!");
    return true;
  }
}
