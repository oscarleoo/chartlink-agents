# chartlink for agents

[chartlink](https://chartlink.app) makes charts and tables with live-updating embed links. An agent drafts a chart from one message, looks at the preview, publishes it, and hands back an embed that updates when the numbers do. No accounts: the API key is the workspace.

This repo is how agents connect.

## Claude Code plugin

```
/plugin marketplace add oscarleoo/chartlink-agents
/plugin install chartlink@chartlink
```

The plugin adds the chartlink MCP server and a skill that teaches the create → preview → publish loop. Ask Claude to "set up chartlink" and it gets its own key (`POST /api/signup`, no account) and tells you where to paste it.

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

## Plain REST

Everything is documented for agents at https://chartlink.app/llms.txt and as OpenAPI at https://chartlink.app/api/openapi.json.

## Listing kit

`listing/` holds the text and image used on every directory chartlink is listed in.

## Keeping this repo honest

`node scripts/check.mjs` compares LISTING.md and SKILL.md with the live server: the MCP tool inventory (tools/list works without a key) and the chart-type list from llms.txt. Run it before a release; it exits 1 on drift.
