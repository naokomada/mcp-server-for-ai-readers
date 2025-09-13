import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// StreamableHttp server
const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "echo",
      "description",
      {
        message: z.string(),
      },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      }),
    );

    server.tool(
      "search_books",
      "description",
      {
        book_title: z.string(),
      },
      async ({ book_title }) => ({
        content: [{ type: "text", text: `Tool search_books: ${book_title}` }],
      }),
    );

  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        search_books: {
          description: "Search for books",
        },
      },
    },
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
