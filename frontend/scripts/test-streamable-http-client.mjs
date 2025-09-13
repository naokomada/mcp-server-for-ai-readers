import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.argv[2] || "https://mcp-on-vercel.vercel.app";
const toolName = process.argv[3];
const rawArgs = process.argv[4];

function parseArgs(raw) {
  if (!raw) return {};
  // Try JSON first
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (_) {
    // fallthrough to key=value or echo convenience
  }

  // Support key=value pairs separated by commas (e.g., message=hello,foo=bar)
  if (/^[^=]+=.*/.test(raw)) {
    const obj = {};
    for (const pair of raw.split(",")) {
      const [k, ...rest] = pair.split("=");
      if (!k) continue;
      obj[k.trim()] = rest.join("=").trim();
    }
    return obj;
  }

  // If just a bare string and tool is echo, treat as message
  return { message: raw };
}

async function main() {
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  console.log("Connecting to", `${origin}/mcp`);
  await client.connect(transport);
  console.log("Connected", client.getServerCapabilities());

  // If no tool specified, list tools (existing behavior)
  if (!toolName) {
    const tools = await client.listTools();
    console.log(JSON.stringify(tools, null, 2));
    return;
  }

  const args = parseArgs(rawArgs);

  // Optional: verify the tool exists
  try {
    const { tools } = await client.listTools();
    const found = tools?.find?.((t) => t.name === toolName);
    if (!found) {
      console.error(`Tool not found: ${toolName}`);
      console.error("Available tools:", tools?.map?.((t) => t.name).join(", "));
      return;
    }
  } catch (e) {
    // Non-fatal; continue to attempt call
  }

  // Call the specified tool with provided args
  try {
    // Prefer the object form per MCP SDK (name + arguments)
    const result = await client.callTool({ name: toolName, arguments: args });
    console.log("Tool call result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Tool call failed:", err);
  } finally {
    try { client.close?.(); } catch (_) {}
  }
}

main();
