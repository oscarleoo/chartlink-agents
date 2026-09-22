# chartlink-mcp

A stdio bridge to the chartlink MCP server, for clients that only launch local stdio servers. Charts, maps and tables with live-updating embed links: https://chartlink.app

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

Without a key the bridge still starts and lists every tool, so you can look before you sign up; each tool call then answers with the signup step instead of running.

If your client speaks HTTP MCP, skip this package and connect directly: `https://chartlink.app/mcp` with `Authorization: Bearer viz_...`.

By default the server exposes the template path — nine tools: find a template by need, read its contract, dry-run your data, create from it with your data and a few knobs, publish, hand back the links. The whole engine (every chart type, the full settings schema, brands, data sources) is behind `CHARTLINK_MCP_URL=https://chartlink.app/mcp?full=1`.

The manual your agent should read first: https://chartlink.app/llms.txt (the templates and the four-step loop); the full engine manual is https://chartlink.app/llms-full.txt.
