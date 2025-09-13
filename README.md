# mcp-server-for-ai-readers

mcp server template from https://github.com/vercel-labs/mcp-for-next.js#





client

pnpm install

node scripts/test-client.mjs https://mcp-for-next-js.vercel.app
node scripts/test-streamable-http-client.mjs https://mcp-for-next-js.vercel.app


SSEを使いたい場合の設定:
route.ts のオプションで disableSse: false にする。
再デプロイ後、test-client.mjs（SSE版）で /sse に接続できるようになる。


local usage
node scripts/test-streamable-http-client.mjs http://localhost:3000 echo '{"message":"gm from cli"}'
node scripts/test-streamable-http-client.mjs http://localhost:3000 search_books '{"book_title":"book from cli"}'
node scripts/test-streamable-http-client.mjs http://localhost:3000 search_books '{"book_title":"nft:mainnet:0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85:1"}'


live sample
cd frontend/
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app echo '{"message":"gm from cli"}'
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app search_books '{"book_title":"book from cli"}'

contract
```bash
cd contract
cp .env.example .env
npm install
npx hardhat compile

# deploy contract
npx hardhat ignition deploy ignition/modules/BookNFT.ts --network sepolia

npx hardhat getState --network base_sepolia --tokenid 1
```
