// シンプルな検索処理のスタブ。
// 実サービス接続やDB検索が必要になった場合は、このモジュールを拡張してください。

import { fetchAllBookTitles } from "./fetchBookNFT";

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



  try {
    const nftResults = await fetchAllBookTitles();
  //   results.push(...nftResults);
  } catch (error) {
  //   console.error(`[searchBooks] Error searching NFT collection:`, error);
  //   results.push({
  //     type: "text",
  //     text: `NFT collection search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
  //   });
  }

  const results: McpTextContent[] = [{ type: "text", text: "Book search result: (no title provided)" }];

  return results;
}
