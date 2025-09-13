import "server-only";
import { createPublicClient, http, fallback, type PublicClient, getAddress, type Abi } from "viem";

// 最小限のABI（ERC-721/1155のメタデータ URI 取得）
const ERC721_METADATA_ABI = [
  {
    type: "function",
    stateMutability: "view",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
 ] as const satisfies Abi;

const ERC1155_METADATA_ABI = [
  {
    type: "function",
    stateMutability: "view",
    name: "uri",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
 ] as const satisfies Abi;

export type SupportedStandard = "erc721" | "erc1155" | "auto";

export type NftSpec = {
  contract: `0x${string}`;
  tokenId: bigint;
  // 優先チェーン表記。実RPC URLは env から供給（必要に応じて複数対応可）
  chain?: string; // e.g. "mainnet", "polygon", "base" など（任意）
  standard?: SupportedStandard; // 未指定時は auto 判定
};

export type NftResolved = {
  tokenUri?: string;
  imageUrl?: string;
  standard?: Exclude<SupportedStandard, "auto">;
  usedRpcUrl: string;
};

// --- Helper: env から Alchemy RPC URL を取得 ---
function getAlchemyRpcUrl(chain?: string): string {
  // 単一チェーン想定: ALCHEMY_RPC_URL を優先
  // 必要なら将来的にチェーン別（ALCHEMY_RPC_URL_ETHEREUM 等）を拡張
  const direct = process.env.ALCHEMY_RPC_URL?.trim();
  if (direct) return direct;

  // 互換: ALCHEMY_HTTP_URL / ALCHEMY_API_URL など、よくある別名
  const aliases = [
    process.env.ALCHEMY_HTTP_URL,
    process.env.ALCHEMY_API_URL,
  ].filter(Boolean) as string[];
  if (aliases.length > 0) return aliases[0]!;

  const hint = chain ? ` for chain "${chain}"` : "";
  throw new Error(
    `Missing Alchemy RPC URL. Set ALCHEMY_RPC_URL${hint} (e.g. https://eth-mainnet.g.alchemy.com/v2/XXXXX).`
  );
}

function buildClient(rpcUrl: string): PublicClient {
  return createPublicClient({
    transport: fallback([http(rpcUrl)]),
  });
}

// --- Helper: ipfs/ar スキームの正規化 ---
export function normalizeUrl(u?: string): string | undefined {
  if (!u) return u;
  if (u.startsWith("ipfs://")) {
    const path = u.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${path}`;
  }
  if (u.startsWith("ar://")) {
    return `https://arweave.net/${u.replace("ar://", "")}`;
  }
  return u;
}

// --- Helper: ERC1155 の {id} 置換（小文字 0x なし 64 桁 hex） ---
function replace1155IdTemplate(uri: string, tokenId: bigint): string {
  if (!uri.includes("{id}")) return uri;
  const hex = tokenId.toString(16).padStart(64, "0").toLowerCase();
  return uri.replaceAll("{id}", hex);
}

// --- tokenURI 取得（ERC-721 → 失敗なら ERC-1155 の順で試行） ---
async function readTokenUriAuto(
  client: PublicClient,
  contract: `0x${string}`,
  tokenId: bigint
): Promise<{ uri?: string; standard?: Exclude<SupportedStandard, "auto"> }> {
  // 1) ERC-721 tokenURI
  try {
    const uri = (await client.readContract({
      abi: ERC721_METADATA_ABI,
      address: contract,
      functionName: "tokenURI",
      args: [tokenId],
    })) as string;
    return { uri, standard: "erc721" };
  } catch (_) {
    // continue
  }

  // 2) ERC-1155 uri(id)
  try {
    let raw = (await client.readContract({
      abi: ERC1155_METADATA_ABI,
      address: contract,
      functionName: "uri",
      args: [tokenId],
    })) as string;
    raw = replace1155IdTemplate(raw, tokenId);
    return { uri: raw, standard: "erc1155" };
  } catch (_) {
    // continue
  }

  return { uri: undefined, standard: undefined };
}

async function readTokenUriSpecific(
  client: PublicClient,
  contract: `0x${string}`,
  tokenId: bigint,
  standard: Exclude<SupportedStandard, "auto">
): Promise<string | undefined> {
  if (standard === "erc721") {
    try {
      return (await client.readContract({
        abi: ERC721_METADATA_ABI,
        address: contract,
        functionName: "tokenURI",
        args: [tokenId],
      })) as string;
    } catch (_) {
      return undefined;
    }
  } else {
    try {
      const raw = (await client.readContract({
        abi: ERC1155_METADATA_ABI,
        address: contract,
        functionName: "uri",
        args: [tokenId],
      })) as string;
      return replace1155IdTemplate(raw, tokenId);
    } catch (_) {
      return undefined;
    }
  }
}

// --- Metadata を取得して image フィールドを解決 ---
async function tryFetchImageUrl(tokenUri?: string): Promise<string | undefined> {
  if (!tokenUri) return undefined;
  const normalized = normalizeUrl(tokenUri);
  if (!normalized) return undefined;
  try {
    const res = await fetch(normalized, { headers: { accept: "application/json,*/*" } });
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) return undefined;
    if (contentType.includes("application/json")) {
      const json = await res.json();
      const image = typeof json?.image === "string" ? (json.image as string) : undefined;
      return normalizeUrl(image);
    }
    // JSON でなくてもそのまま URL として返しておく（例えば直接画像 URL の場合）
    return normalized;
  } catch (_) {
    return undefined;
  }
}

export async function getNftUrls(spec: NftSpec): Promise<NftResolved> {
  const rpcUrl = getAlchemyRpcUrl(spec.chain);
  const client = buildClient(rpcUrl);
  const address = getAddress(spec.contract); // 正規化 & checksum

  let tokenUri: string | undefined;
  let standard: Exclude<SupportedStandard, "auto"> | undefined;

  if (spec.standard && spec.standard !== "auto") {
    tokenUri = await readTokenUriSpecific(client, address, spec.tokenId, spec.standard);
    standard = spec.standard;
  } else {
    const r = await readTokenUriAuto(client, address, spec.tokenId);
    tokenUri = r.uri;
    standard = r.standard;
  }

  const imageUrl = await tryFetchImageUrl(tokenUri);
  return { tokenUri: tokenUri ? normalizeUrl(tokenUri) : undefined, imageUrl, standard, usedRpcUrl: rpcUrl };
}

// --- 入力ヘルパ：文字列から NftSpec をざっくり抽出 ---
// 例1: "nft:mainnet:0xabc...:123" → chain, contract, tokenId
// 例2: "contract=0xabc..., tokenId=123, chain=mainnet, standard=erc721"
export function parseNftSpec(input?: string): NftSpec | undefined {
  if (!input) return undefined;
  const s = input.trim();

  // パターン1: nft:chain:contract:tokenId
  if (s.toLowerCase().startsWith("nft:")) {
    const parts = s.split(":");
    // nft:chain:contract:tokenId → 4 パート
    if (parts.length >= 4) {
      const [, chain, contract, tokenIdRaw] = parts;
      try {
        return {
          chain,
          contract: getAddress(contract) as `0x${string}`,
          tokenId: BigInt(tokenIdRaw),
          standard: "auto",
        };
      } catch (_) {
        // fallthrough
      }
    }
  }

  // パターン2: key=value のカンマ区切り
  // 例: "contract=0xabc, tokenId=1, chain=base, standard=erc1155"
  if (s.includes("=")) {
    const map = new Map<string, string>();
    s.split(/[,\n]/).forEach((kv) => {
      const [k, v] = kv.split("=");
      if (k && v) map.set(k.trim().toLowerCase(), v.trim());
    });
    if (map.has("contract") && map.has("tokenid")) {
      const contract = map.get("contract")!;
      const tokenIdRaw = map.get("tokenid")!;
      const chain = map.get("chain") || undefined;
      const standard = (map.get("standard") as SupportedStandard | undefined) || "auto";
      try {
        return {
          chain,
          contract: getAddress(contract) as `0x${string}`,
          tokenId: BigInt(tokenIdRaw),
          standard,
        };
      } catch (_) {
        // invalid input
      }
    }
  }

  return undefined;
}
