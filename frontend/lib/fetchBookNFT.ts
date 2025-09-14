import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet, sepolia } from 'viem/chains';

export type McpTextContent = { type: "text"; text: string };

/**
 * NFTコントラクトアドレスとトークンIDを受け取り、MCPのcontent形式（text）でNFT情報を返す
 * @param contractAddress - NFTコントラクトのアドレス
 * @param tokenId - 取得したいNFTのトークンID
 * @returns Promise<McpTextContent[]> - NFT情報をMCPテキストコンテンツ形式で返却
 */
export async function fetchAllBookTitles(): Promise<McpTextContent[]> {
  console.log(`[fetchAllBookTitles] Called`);

  try {
    const client = createPublicClient({
      chain: sepolia,
      transport: http(),
    })
    
    const contractAddress: `0x${string}` = process.env.BOOK_NFT_CONTRACT_ADDRESS as `0x${string}`;
    console.log(`[fetchAllBookTitles] Using contract address: ${contractAddress}`);

    // コントラクトから本のタイトルのリストを取得する
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
    
    // resAllTitlesをそのまま返却
    return resAllTitles.map(title => ({ type: "text", text: title }));
    
  } catch (error) {
    console.error(`[fetchAllBookTitles] Error occurred:`, error);
    const errorText = `NFT search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return [{ type: "text", text: errorText }];
  }
}

// 個別の本のNFTの所在（URLを返却する）
export async function fetchBookURL(tokenId: bigint): Promise<McpTextContent[]> {
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
    
    // URLを返却
    return [{ type: "text", text: bookUrl }];
    
  } catch (error) {
    console.error(`[fetchBookURL] Error occurred:`, error);
    const errorText = `Failed to fetch book URL for tokenId ${tokenId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
    return [{ type: "text", text: errorText }];
  }
}
