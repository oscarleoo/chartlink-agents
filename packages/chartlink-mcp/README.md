# chartlink-mcp

A stdio bridge to the chartlink MCP server, for clients that only launch local stdio servers. Charts and tables with live-updating embed links: https://chartlink.app

```json
{
  "mcpServers": {
    "chartlink": {
      "command": "npx",
      "args": ["-y", "chartlink-mcp"],
      "env": { "CHARTLINK_API_KEY": "viz_..." }
    }
  }
}
```

No key yet? `curl -X POST https://chartlink.app/api/signup` returns a workspace and its key — no account. The key is shown once.

If your client speaks HTTP MCP, skip this package and connect directly: `https://chartlink.app/mcp` with `Authorization: Bearer viz_...`.

The manual your agent should read first: https://chartlink.app/llms.txt
