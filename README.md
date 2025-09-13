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


live sample
cd frontend/
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app echo '{"message":"gm from cli"}'
node scripts/test-streamable-http-client.mjs https://mcp-server-for-ai-readers.vercel.app search_books '{"book_title":"book from cli"}'
