// シンプルな検索処理のスタブ。
// 実サービス接続やDB検索が必要になった場合は、このモジュールを拡張してください。

import { fetchAllBookTitles, fetchBookURL } from "./fetchBookNFT";

export type McpTextContent = { type: "text"; text: string };

/**
 * タイトルを受け取り、MCPのcontent形式（text）で結果を返す。
 * タイトルがコントラクトアドレス形式の場合は、NFTコレクション情報も検索する。
 */
export async function searchBooks(bookTitle: string): Promise<McpTextContent[]> {
  console.log(`[searchBooks] Called with bookTitle: ${bookTitle}`);

  try {
    const bookTitles = await fetchAllBookTitles();

    console.log(`[searchBooks] Fetched book titles: ${bookTitles.join(", ")}`);

    // bookTitleに合致する要素とそのインデックスを検索
    const matchingBooks: { index: number; title: string }[] = [];
    
    bookTitles.forEach((title, index) => {
      // 完全一致または部分一致で検索
      if (title.toLowerCase().includes(bookTitle.toLowerCase())) {
        matchingBooks.push({ index, title });
      }
    });

    // 結果を返却
    if (matchingBooks.length === 0) {
      return [{ 
        type: "text", 
        text: `No books found matching "${bookTitle}". Available titles: ${bookTitles.join(", ")}` 
      }];
    }

    const bookUrls = await Promise.all(
      matchingBooks.map(match => fetchBookURL(BigInt(match.index)))
    );

    console.log(`[searchBooks] Fetched book titles: ${bookTitles.join(", ")}`);
    console.log(`[searchBooks] Matching books: ${matchingBooks.map(m => m.title).join(", ")}`);
    console.log(`[searchBooks] Book URLs: ${bookUrls.join(" | ")}`);

    const matchResults = matchingBooks.map((match, i) => 
      //`Index ${match.index}: ${match.title} URL: ${bookUrls[i] || "(not found)"}`
      `${bookUrls[i] || "(not found)"}`
    );

    // return [{ 
    //   type: "text", 
    //   text: `Found ${matchingBooks.length} matching book(s) for "${bookTitle}": ${matchResults}` 
    // }];

    return [{ 
      type: "text", 
      text: `${matchResults}` 
    }];

  } catch (error) {
    console.error(`[searchBooks] Error searching books:`, error);
    return [{ 
      type: "text", 
      text: `Book search failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }];
  }
}
