// viemを使用してブロックチェーン上のNFT情報を取得するモジュール
// 実際のviem実装は後続で追加予定

import { createPublicClient, http, getContract } from 'viem';
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
    // TODO: viem実装を追加
    // - 適切なRPCプロバイダーとの接続
    // - NFTコントラクトとの相互作用
    // - メタデータの取得
    // - トークン所有者情報の取得
    
    
    // 仮の処理結果を返す
    const text = `result:\n none`;

    console.log(`[fetchAllBookTitles] Search completed successfully`);
    return [{ type: "text", text }];
    
  } catch (error) {
    console.error(`[fetchAllBookTitles] Error occurred:`, error);
    const errorText = `NFT search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return [{ type: "text", text: errorText }];
  }
}
