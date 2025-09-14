import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet, sepolia } from 'viem/chains';

export type McpTextContent = { type: "text"; text: string };

/**
 * コントラクトから本のタイトル一覧を取得して返す
 * @returns Promise<string[]> - 本のタイトル配列
 */
export async function fetchAllBookTitles(): Promise<string[]> {
  console.log(`[fetchAllBookTitles] Called`);

  try {
    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    })
    
    const contractAddress: `0x${string}` = process.env.BOOK_NFT_CONTRACT_ADDRESS as `0x${string}`;
    console.log(`[fetchAllBookTitles] Using contract address: ${contractAddress}`);

    const resAllTitles = await client.readContract({
      address: contractAddress,
      abi: [
        {
          inputs: [],
          name: 'getAllBookTitles',
          outputs: [{ name: '', type: 'string[]' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getAllBookTitles',
      args: [],
    }) as string[];

    console.log(`[fetchAllBookTitles] All book titles: ${resAllTitles.join(", ")}`);
    return resAllTitles;
    
  } catch (error) {
    console.error(`[fetchAllBookTitles] Error occurred:`, error);
    return [];
  }
}

// 個別の本のNFTの所在（URLを返却する）
export async function fetchBookURL(tokenId: bigint): Promise<string> {
  console.log(`[fetchBookURL] Called with tokenId: ${tokenId}`);

  try {
    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    })
    
    const contractAddress: `0x${string}` = process.env.BOOK_NFT_CONTRACT_ADDRESS as `0x${string}`;
    console.log(`[fetchBookURL] Using contract address: ${contractAddress}`);

    // コントラクトから指定されたトークンIDの本のURLを取得する
    const bookUrl = await client.readContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'tokenId', type: 'uint256' }],
          name: 'getBookUrl',
          outputs: [{ name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getBookUrl',
      args: [tokenId],
    }) as string;

    console.log(`[fetchBookURL] Book URL for tokenId ${tokenId}: ${bookUrl}`);
    return bookUrl;
    
  } catch (error) {
    console.error(`[fetchBookURL] Error occurred:`, error);
    return "";
  }
}
