// シンプルな検索処理のスタブ。
// 実サービス接続やDB検索が必要になった場合は、このモジュールを拡張してください。

export type McpTextContent = { type: "text"; text: string };
import { getNftUrls, parseNftSpec } from "./nftTokenUrl";

/**
 * タイトルを受け取り、MCPのcontent形式（text）で結果を返す。
 */
export async function searchBooks(bookTitle: string): Promise<McpTextContent[]> {
  // ここではデモとして、受け取ったタイトルをそのまま整形して返却
  const normalized = bookTitle?.trim();
  const lines: string[] = [];
  if (normalized) {
    lines.push(`Book search result for title: "${normalized}"`);

    // 入力文字列から NFT 参照指定がある場合、viem + Alchemy RPC で tokenURI/image を引く
    const spec = parseNftSpec(normalized);
    if (spec) {
      try {
        const res = await getNftUrls(spec);
        const extras: string[] = [];
        if (res.standard) extras.push(`standard=${res.standard}`);
        extras.push(`rpc=${res.usedRpcUrl}`);
        if (res.tokenUri) extras.push(`tokenURI=${res.tokenUri}`);
        if (res.imageUrl) extras.push(`image=${res.imageUrl}`);
        lines.push(`[NFT] ${extras.join(" | ")}`);
      } catch (e: any) {
        lines.push(`[NFT] error: ${e?.message ?? String(e)}`);
      }
    }
  } else {
    lines.push("Book search result: (no title provided)");
  }

  return [{ type: "text", text: lines.join("\n") }];
}
