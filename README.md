# chartlink for agents

[chartlink](https://chartlink.app) makes charts, maps and tables with live-updating embed links, from templates. An agent finds the template that answers the need, sends the data and a few knobs (theme, data type, the words), looks at the preview, and hands back an embed that updates when the numbers do. No accounts: the API key is the workspace, and browsing the templates needs no key at all.

This repo is how agents connect.

## Claude Code plugin

```
/plugin marketplace add oscarleoo/chartlink-agents
/plugin install chartlink@chartlink
```

The plugin adds the chartlink MCP server and a skill that teaches the template loop: find the template, read its contract, create from it, hand back the links. Ask Claude to "set up chartlink" and it gets its own key (`POST /api/signup`, no account) and tells you where to paste it.

## Cursor

The repo root is a Cursor plugin: `.cursor-plugin/plugin.json`, `mcp.json` (the chartlink server over HTTP, key from the `CHARTLINK_API_KEY` environment variable) and the same skill. Install from [cursor.directory](https://cursor.directory) or add the server by hand:

```json
{ "mcpServers": { "chartlink": { "url": "https://chartlink.app/mcp", "headers": { "X-API-Key": "viz_..." } } } }
```

## Any MCP client (HTTP)

```
URL:    https://chartlink.app/mcp
Header: Authorization: Bearer viz_...
```

Get a key with `curl -X POST https://chartlink.app/api/signup`. The key is shown once.

## Clients that only speak stdio

```
npx chartlink-mcp
```

with `CHARTLINK_API_KEY=viz_...` in the environment. It bridges stdio to the HTTP server above; nothing runs locally but the bridge. Source in `packages/chartlink-mcp`.

## Template path or the whole engine

`https://chartlink.app/mcp` exposes the template path (nine tools). `https://chartlink.app/mcp?full=1` exposes every tool of the engine. Manuals: https://chartlink.app/llms.txt (templates) and https://chartlink.app/llms-full.txt (the engine).

## Plain REST

Everything is documented for agents at https://chartlink.app/llms.txt and as OpenAPI at https://chartlink.app/api/openapi.json.

## Listing kit

`listing/` holds the text and image used on every directory chartlink is listed in.

## Keeping this repo honest

`node scripts/check.mjs` compares LISTING.md and SKILL.md with the live server: the MCP tool inventory (tools/list works without a key) and the chart-type list from llms.txt. Run it before a release; it exits 1 on drift.
