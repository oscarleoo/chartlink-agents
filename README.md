# chartlink for agents

[chartlink](https://chartlink.app) makes charts and maps in your own brand, with live-updating embed links. You make the brand once in the studio, from your website; an agent sends the data and the words, looks at the preview, and hands back an embed that updates when the numbers do.

This repo is how agents connect.

## Claude Code plugin

```
/plugin marketplace add oscarleoo/chartlink-agents
/plugin install chartlink@chartlink
```

The plugin adds the chartlink MCP server and a skill that teaches the brand loop: pick the brand, create, look at the preview, publish, hand back the links. The first time, run `/mcp`, select chartlink and sign in in the browser; you pick the workspace it works in. No key is stored.

## Claude and other AI apps

Add `https://chartlink.app/mcp` as a custom connector and sign in. The server follows the MCP authorization spec (OAuth 2.1 with PKCE and dynamic client registration), so any client that supports it signs in the same way.

## Cursor

The repo root is a Cursor plugin: `.cursor-plugin/plugin.json`, `mcp.json` (the chartlink server over HTTP, signed in through the browser) and the same skill. Install from [cursor.directory](https://cursor.directory) or add the server by hand:

```json
{ "mcpServers": { "chartlink": { "url": "https://chartlink.app/mcp" } } }
```

## Scripts and CI

Tools that cannot sign in use an API key from the studio: Workspace → API keys for Claude Code and scripts. Send it as `Authorization: Bearer viz_...`. Keep keys out of chats.

Clients that only speak stdio can use the bridge, with the key in `CHARTLINK_API_KEY`:

```
npx chartlink-mcp
```

It bridges stdio to the HTTP server; nothing runs locally but the bridge. Source in `packages/chartlink-mcp`.

## The default tools or all of them

`https://chartlink.app/mcp` exposes the tools for making, changing and publishing charts and maps in a brand. `https://chartlink.app/mcp?full=1` adds brand editing, data sources and the rest. Manuals: https://chartlink.app/llms.txt and https://chartlink.app/llms-full.txt; OpenAPI at https://chartlink.app/api/openapi.json.

## Listing kit

`listing/` holds the text and image used on the directories chartlink is listed in.
