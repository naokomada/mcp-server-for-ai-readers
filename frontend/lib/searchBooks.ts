// シンプルな検索処理のスタブ。
// 実サービス接続やDB検索が必要になった場合は、このモジュールを拡張してください。

import { searchNftInfo, searchNftCollection } from "./searchNfts";

export type McpTextContent = { type: "text"; text: string };

/**
 * タイトルを受け取り、MCPのcontent形式（text）で結果を返す。
 * タイトルがコントラクトアドレス形式の場合は、NFTコレクション情報も検索する。
 */
export async function searchBooks(bookTitle: string): Promise<McpTextContent[]> {
  console.log(`[searchBooks] Called with bookTitle: ${bookTitle}`);
  
  // const normalized = bookTitle?.trim();
  
  // if (!normalized) {
  //   return [{ type: "text", text: "Book search result: (no title provided)" }];
  // }



  // try {
  //   const nftResults = await searchNftCollectionInfo(normalized);
  //   results.push(...nftResults);
  // } catch (error) {
  //   console.error(`[searchBooks] Error searching NFT collection:`, error);
  //   results.push({
  //     type: "text",
  //     text: `NFT collection search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
  //   });
  // }

  const results: McpTextContent[] = [{ type: "text", text: "Book search result: (no title provided)" }];

  return results;
}

/**
 * NFT情報を検索する関数（searchNfts.tsモジュールのラッパー）
 * @param contractAddress - NFTコントラクトのアドレス
 * @param tokenId - 取得したいNFTのトークンID
 * @returns Promise<McpTextContent[]> - NFT情報をMCPテキストコンテンツ形式で返却
 */
export async function searchNft(contractAddress: string, tokenId: string): Promise<McpTextContent[]> {
  console.log(`[searchBooks.searchNft] Delegating to searchNfts module: ${contractAddress}, ${tokenId}`);
  return await searchNftInfo(contractAddress, tokenId);
}

/**
 * NFTコレクション情報を検索する関数（searchNfts.tsモジュールのラッパー）
 * @param contractAddress - NFTコントラクトのアドレス
 * @returns Promise<McpTextContent[]> - コレクション情報をMCPテキストコンテンツ形式で返却
 */
export async function searchNftCollectionInfo(contractAddress: string): Promise<McpTextContent[]> {
  console.log(`[searchBooks.searchNftCollectionInfo] Delegating to searchNfts module: ${contractAddress}`);
  return await searchNftCollection(contractAddress);
}
