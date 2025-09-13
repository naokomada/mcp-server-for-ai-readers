import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { searchBooks } from "@/lib/searchBooks";

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
        content: await searchBooks(book_title),
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
          description: "Search books by title",
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
