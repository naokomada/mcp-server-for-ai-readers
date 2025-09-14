// viemを使用してブロックチェーン上のNFT情報を取得するモジュール
// 実際のviem実装は後続で追加予定

export type McpTextContent = { type: "text"; text: string };

/**
 * NFTコントラクトアドレスとトークンIDを受け取り、MCPのcontent形式（text）でNFT情報を返す
 * @param contractAddress - NFTコントラクトのアドレス
 * @param tokenId - 取得したいNFTのトークンID
 * @returns Promise<McpTextContent[]> - NFT情報をMCPテキストコンテンツ形式で返却
 */
export async function searchNftInfo(contractAddress: string, tokenId: string): Promise<McpTextContent[]> {
  console.log(`[searchNftInfo] Called with contractAddress: ${contractAddress}, tokenId: ${tokenId}`);
  
  try {
    // TODO: viem実装を追加
    // - 適切なRPCプロバイダーとの接続
    // - NFTコントラクトとの相互作用
    // - メタデータの取得
    // - トークン所有者情報の取得
    
    const normalized = contractAddress?.trim();
    const normalizedTokenId = tokenId?.trim();
    
    if (!normalized || !normalizedTokenId) {
      console.log("[searchNftInfo] Invalid input parameters");
      const errorText = "NFT search failed: Contract address and token ID are required";
      return [{ type: "text", text: errorText }];
    }

    console.log(`[searchNftInfo] Processing NFT search for contract: ${normalized}, token: ${normalizedTokenId}`);
    
    // 仮の処理結果を返す
    const text = `NFT search result:\nContract Address: ${normalized}\nToken ID: ${normalizedTokenId}\n\n[PLACEHOLDER] Actual blockchain data will be fetched using viem in future implementation.`;

    console.log(`[searchNftInfo] Search completed successfully`);
    return [{ type: "text", text }];
    
  } catch (error) {
    console.error(`[searchNftInfo] Error occurred:`, error);
    const errorText = `NFT search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return [{ type: "text", text: errorText }];
  }
}

/**
 * NFTコレクション全体の情報を取得する（オプショナル機能）
 * @param contractAddress - NFTコントラクトのアドレス 
 * @returns Promise<McpTextContent[]> - コレクション情報をMCPテキストコンテンツ形式で返却
 */
export async function searchNftCollection(contractAddress: string): Promise<McpTextContent[]> {
  console.log(`[searchNftCollection] Called with contractAddress: ${contractAddress}`);
  
  try {
    // TODO: viem実装を追加
    // - コレクション名の取得
    // - シンボルの取得
    // - 総供給量の取得
    // - その他コレクションメタデータ
    
    const normalized = contractAddress?.trim();
    
    if (!normalized) {
      console.log("[searchNftCollection] Invalid contract address");
      const errorText = "NFT collection search failed: Contract address is required";
      return [{ type: "text", text: errorText }];
    }

    console.log(`[searchNftCollection] Processing collection search for contract: ${normalized}`);
    
    // 仮の処理結果を返す
    const text = `NFT Collection search result:\nContract Address: ${normalized}\n\n[PLACEHOLDER] Actual collection data will be fetched using viem in future implementation.`;

    console.log(`[searchNftCollection] Collection search completed successfully`);
    return [{ type: "text", text }];
    
  } catch (error) {
    console.error(`[searchNftCollection] Error occurred:`, error);
    const errorText = `NFT collection search failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return [{ type: "text", text: errorText }];
  }
}