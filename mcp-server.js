#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const API_URL = process.env.TRAQ_API_URL;
const API_KEY = process.env.TRAQ_API_KEY;

if (!API_URL || !API_KEY) {
  console.error("Missing TRAQ_API_URL or TRAQ_API_KEY in .env");
  process.exit(1);
}

const server = new Server(
  {
    name: "traq-ai-skill",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const fetchTraq = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  // Use global fetch (available in Node 18+)
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`TRAQ API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_tasks",
        description: "List all productivity tasks",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_dashboard",
        description: "Get the dashboard for a specific date",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date in YYYY-MM-DD format" },
          },
          required: ["date"],
        },
      },
      {
        name: "get_analytics_summary",
        description: "Get today's productivity analytics snapshot",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date in YYYY-MM-DD format" },
          },
          required: ["date"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_tasks": {
        const tasks = await fetchTraq("/api/v1/tasks");
        return { content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }] };
      }
      case "get_dashboard": {
        const dashboard = await fetchTraq(`/api/v1/dashboard/${args.date}`);
        return { content: [{ type: "text", text: JSON.stringify(dashboard, null, 2) }] };
      }
      case "get_analytics_summary": {
        const analytics = await fetchTraq(`/api/v1/analytics/daily/${args.date}`);
        return { content: [{ type: "text", text: JSON.stringify(analytics, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TRAQ MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
