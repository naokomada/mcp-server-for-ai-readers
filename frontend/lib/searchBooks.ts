// シンプルな検索処理のスタブ。
// 実サービス接続やDB検索が必要になった場合は、このモジュールを拡張してください。

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
