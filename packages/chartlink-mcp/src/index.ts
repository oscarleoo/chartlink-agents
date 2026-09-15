#!/usr/bin/env node
// chartlink-mcp: a stdio ↔ HTTP bridge. Some MCP clients only launch local
// stdio servers; chartlink lives at https://chartlink.app/mcp. This process
// connects to chartlink as a client and re-exposes every tool over stdio,
// forwarding each call unchanged. Nothing runs locally but the bridge.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

const URL_ = process.env.CHARTLINK_MCP_URL ?? "https://chartlink.app/mcp";
const KEY = process.env.CHARTLINK_API_KEY;

if (!KEY) {
  process.stderr.write(
    "chartlink-mcp: set CHARTLINK_API_KEY (starts with viz_). No key yet? " +
      "curl -X POST https://chartlink.app/api/signup — no account needed, the key is shown once.\n"
  );
  process.exit(2);
}

async function main() {
  const upstream = new Client({ name: "chartlink-mcp-bridge", version: "0.1.0" });
  await upstream.connect(
    new StreamableHTTPClientTransport(new URL(URL_), {
      requestInit: { headers: { Authorization: `Bearer ${KEY}` } },
    })
  );

  const server = new Server(
    { name: "chartlink", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => upstream.listTools());
  server.setRequestHandler(CallToolRequestSchema, async (req: CallToolRequest) =>
    upstream.callTool({ name: req.params.name, arguments: req.params.arguments ?? {} })
  );

  await server.connect(new StdioServerTransport());
}

main().catch((e) => {
  process.stderr.write(`chartlink-mcp: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
