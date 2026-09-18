# chartlink — listing kit

Copy from here. Every directory gets the same words, the same image and the same install line, so a reader who sees us twice recognises us.

## Name

chartlink

## Tagline (under 80 characters)

Charts, maps and tables for AI agents, with live-updating embed links.

## Short description (under 200 characters)

An agent drafts a chart from one message, looks at the preview, publishes it, and hands back an embed that updates when the numbers do. No accounts: the API key is the workspace.

## Plain description (what it does — use this on directories)

Creates charts, maps and tables and publishes them as live embeds, PNGs and share pages.

Tools cover the whole loop: sign up for a workspace key, list the chart types and read each type's config schema with worked examples, create a chart from data rows (the response includes a rendered preview), patch its config, replace its data or attach a CSV/JSON URL that refetches on a schedule, publish, unpublish, duplicate, delete. Twelve types: line, bar, area, scatter, dumbbell, slope, heatmap, choropleth, symbol map, pie, waterfall and sortable tables. Maps cover 237 geographies (countries, US states, regions of every country). Brands hold fonts, colours and spacing shared across charts. Any published chart can be used as a template. An edit link opens a visual editor for a person to finish by hand.

Authentication: an API key in the X-API-Key header (or Authorization: Bearer), obtained with POST https://chartlink.app/api/signup. Manual: https://chartlink.app/llms.txt

## Long description (for a human reader)

chartlink is a chart platform built for agents rather than for a human at a dashboard. There is nothing to log in to: `POST /api/signup` returns a workspace and its key in one unauthenticated call, and from then on the agent drafts a chart, sees the rendered preview inline, adjusts it with a small patch, and publishes. What comes back is a live embed, a public share page, a full-resolution PNG and a CSV of the data.

The part people keep: when the numbers change, `PUT /data` republishes every embed and image at once. Or attach a CSV/JSON URL and the chart refetches itself on a schedule with no agent involved.

Twelve types: line, bar, area, scatter, dumbbell, slope, heatmap, choropleth, symbol map, pie, waterfall, and sortable tables. Maps draw any of 237 geographies — world countries, US states, every country's regions — cropped with bounds and flattened with a choice of projections, with lon/lat points on top. Any published chart is a template. Brands set fonts, colours and spacing once; charts inherit them. Any Google Font by name. Editorial defaults: direct labels over legends, dropped labels over squeezed ones, a source line, a notes line for the caveat.

Hosting is free with a small "Made with chartlink" badge. One credit makes one chart premium forever: no badge, SVG export, a custom footer. Nothing is metered.

For humans, every chart has a no-login edit link that opens a visual editor, so an agent can hand over the wheel for the last five percent.

## Install line (MCP, HTTP)

```
URL:    https://chartlink.app/mcp
Header: Authorization: Bearer <key from POST https://chartlink.app/api/signup>
        (or X-API-Key: <key> — for gateways that map one field to one header)
```

Claude Code:

```
claude mcp add chartlink --transport http https://chartlink.app/mcp --header "Authorization: Bearer <key>"
```

Claude Code plugin:

```
/plugin marketplace add oscarleoo/chartlink-agents
/plugin install chartlink@chartlink
```

stdio-only clients:

```
npx chartlink-mcp     (CHARTLINK_API_KEY=viz_... in the environment)
```

## Tools (27)

whoami · list_asset_types · get_spec_schema · list_assets · get_asset · list_geographies · list_templates · create_asset · update_asset · replace_asset_data · set_data_source · clear_data_source · fetch_data_source · publish_asset · unpublish_asset · duplicate_asset · delete_asset · list_brands · create_brand · update_brand · get_billing · create_checkout_link · upgrade_to_premium · create_edit_link · revoke_edit_link · submit_feedback · signup

## Categories / tags

data visualization · charts · embeds · publishing · newsletters · analytics · tables · maps

## Links

- Homepage: https://chartlink.app
- Agent manual: https://chartlink.app/llms.txt
- OpenAPI: https://chartlink.app/api/openapi.json
- MCP endpoint: https://chartlink.app/mcp
- Source for the plugin and shim: https://github.com/oscarleoo/chartlink-agents
- Support: support@chartlink.app

## Image

`chartlink-japan-waterfall-1200.png` in this folder — a published chart, 1200px wide, exactly what an embed shows. Use it as the listing image; a screenshot of a dashboard would be the wrong promise.

## One-paragraph pitch for a human reviewer

Most chart tools assume a person at a screen. chartlink assumes the person is talking to an agent, and gives the agent everything it needs in one manual: get a key without an account, draft, look, publish, hand back an embed that keeps itself updated. Readers get a real chart page with the data attached. The human gets an edit link when they want to fiddle.

## Where to submit (week 2 checklist)

- [ ] Official MCP registry (registry.modelcontextprotocol.io) — needs the server.json in this repo's `packages/chartlink-mcp`
- [ ] Smithery
- [ ] Glama
- [ ] PulseMCP
- [ ] mcp.so
- [ ] Cursor MCP directory
- [ ] Windsurf / Codeium MCP directory
- [ ] awesome-mcp-servers (punkpeye) — PR
- [ ] Claude Code plugin marketplace — this repo, once public
- [ ] npm: publish `packages/chartlink-mcp` as `chartlink-mcp`
