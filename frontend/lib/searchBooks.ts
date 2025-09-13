// シンプルな検索処理のスタブ。
// 実サービス接続やDB検索が必要になった場合は、このモジュールを拡張してください。

import { searchNftInfo, searchNftCollection } from "./searchNfts";

export type McpTextContent = { type: "text"; text: string };

/**
 * タイトルを受け取り、MCPのcontent形式（text）で結果を返す。
 */
export async function searchBooks(bookTitle: string): Promise<McpTextContent[]> {
  // ここではデモとして、受け取ったタイトルをそのまま整形して返却
  const normalized = bookTitle?.trim();
  const text = normalized
    ? `Book search result for title: "${normalized}"`
    : "Book search result: (no title provided)";

  return [{ type: "text", text }];
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
