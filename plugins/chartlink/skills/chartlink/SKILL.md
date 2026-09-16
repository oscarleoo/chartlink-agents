---
name: chartlink
description: Make a chart or table someone can embed, share or keep updated — a live-updating embed, a PNG for Substack, a public share page — with chartlink. Covers getting a key without an account, the draft → look → publish loop, updating the numbers later, and handing a human an edit link.
---

# Charts and tables with live-updating embeds

## When to use this skill

Use it when the person wants a chart or table they can **put somewhere**: embed in a site, Notion, Ghost or WordPress; insert into a Substack post; share a link; or keep a chart's numbers updating after it is published. If they only want to look at a chart once in the conversation, a quick image is fine; chartlink is for charts that live somewhere.

chartlink is agent-first: there are no accounts or logins. The API key IS the workspace, an edit link is one chart, and a share URL is one published chart.

## Setup (once)

If the `chartlink` MCP tools are available, you are set up — skip to the loop.

If they are not (no key configured yet), get one — no account, no human step. Over a keyless MCP connection the `signup` tool does this without leaving MCP; over REST:

```bash
curl -s -X POST https://chartlink.app/api/signup \
  -H 'Content-Type: application/json' -d '{"name": "<project name>", "ref": "claude-code-plugin"}'
```

The response contains `apiKey` (starts with `viz_`). It is shown exactly once. Tell the person to paste it into the plugin's `api_key` setting (`/plugin` → chartlink → configure) so the MCP tools connect, and until then use the REST API directly with `Authorization: Bearer <key>`.

Read the manual once per session before the first chart: https://chartlink.app/llms.txt. It is short and it is authoritative — the settings shape, sizing rules, and the conventions you cannot guess from schemas live there.

## The loop

1. **Pick the type.** `list_asset_types` (or `GET /api/asset-types`) lists the ids with a one-line description each — read it rather than assuming; the set grows (twelve today, from line and bar to choropleth, symbol-map and table). **Prefer a template:** `list_templates` shows published charts whose whole design you can reuse — `create_asset` with `{template: "<id>", data}` copies type and config, so you only bring the numbers.
2. **Read the schema for that type once.** `get_spec_schema` (or `GET /api/asset-types/{type}/schema`). It returns the JSON Schema, two worked examples, and `defaults` — the full config in force when nothing is set. Read a baseline value from `defaults` instead of guessing it.
3. **Create a draft.** `create_asset` with `type`, `data` (typed columns + row arrays) and a `config` that sets only what the story needs: a title, a description, a source. A 201 means it validated AND rendered. **Maps:** `chart.geography` names a boundary set (`countries`, `us-states`, or a country's regions such as `de-regions`); call `list_geographies` before naming regions, since an unknown region fails with the closest matches. `chart.projection` and `chart.bounds` pick the flattening and the crop; a `symbol-map` puts lon/lat rows on the same basemaps.
4. **Look at it.** The create/update result includes the preview image inline over MCP (over REST, GET `urls.previewPng` with the same Authorization header). Judge it like an editor: is the story readable at a glance, are labels dropped, is the title doing work?
5. **Adjust with a small patch.** `update_asset` with `configPatch` (deep-merged) for changes; pass `config` (replaces everything) only to remove keys. Repeat 4–5 until it is right. Two or three passes is normal; ten means the type is wrong.
6. **Publish.** `publish_asset`. Then hand back what the person needs from `urls`:
   - a site, Notion, Ghost, WordPress → `urls.embedIframe`
   - Substack → insert `urls.png` as an image and link the image to `urls.page`
   - just a link → `urls.page`
   Never construct URLs yourself; take them from the response.

## Keeping it updated

- **New numbers, same chart:** `replace_asset_data` (PUT data with `publish=auto`). A published chart republishes itself; every embed and PNG shows the new data immediately.
- **Self-updating from a URL:** `set_data_source` with a CSV/JSON URL and `refresh: hourly|daily|weekly`. The platform refetches on schedule and republishes; no agent in the loop. This is also the bulk-import path for large datasets.

## Handing a human the wheel

When the person wants to fine-tune looks by hand (colours, spacing, fonts), mint an edit link: `create_edit_link`. It opens a visual editor for that one chart, no login, and saves through the same API. Publish first: the editor republishes a published chart but cannot publish a draft. Offer it instead of a nudge-by-nudge loop.

## Rules that save a round trip

- **Settings are element-shaped.** `title: {text, font, padding}`, `description`, `source`, `notes`, `texts[]` for free-placed captions, `chart: {…type options}`, `document: {background, padding, aspect}`. Errors name the path you wrote and list the keys an object takes.
- **Omit `document.aspect`** and the canvas adapts to its content. Set it only for a fixed shape (1:1 social card, 3:4 print slot).
- **One title with a `\n`** is one element. Do not build a two-line title from two `texts[]` entries; use `description` for the subtitle.
- **Dates:** column `type: "date"` parses `2024`, `2024-03`, `2024-03-15`, `2024-Q2` and ISO timestamps on its own. Anything else needs `dateFormat` (strftime, e.g. `%d/%m/%Y`).
- **Hosting is free** (full-resolution PNGs, live embeds, with a small "Made with chartlink" badge). A credit makes one chart premium forever: no badge, SVG, custom footer. To buy, `create_checkout_link` returns a payment URL for the human; never enter payment details yourself.
- **Stuck?** `submit_feedback` (POST /api/feedback) tells the owner what was missing. Do not silently give up.

## Remixing a chart you were shown

Any published chartlink chart exposes its recipe: `https://chartlink.app/a/{id}.json` (type, config, columns) and `…/{id}.csv` (data). To recreate it with the person's own data, create an asset with that type and config and the new rows in the same columns, then publish.
