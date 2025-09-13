# mcp-server-for-ai-readers

mcp server template from https://github.com/vercel-labs/mcp-for-next.js#





client

pnpm install

node scripts/test-client.mjs https://mcp-for-next-js.vercel.app
node scripts/test-streamable-http-client.mjs https://mcp-for-next-js.vercel.app

SSEを使いたい場合の設定:
route.ts のオプションで disableSse: false にする。
再デプロイ後、test-client.mjs（SSE版）で /sse に接続できるようになる。


live sample
cd frontend/
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app echo '{"message":"gm from cli"}'
