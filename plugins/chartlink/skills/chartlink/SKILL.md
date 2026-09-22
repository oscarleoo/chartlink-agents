---
name: chartlink
description: Make a chart or map someone can embed, share or keep updated — a live-updating embed, a PNG for Substack, a public page — with chartlink. Templates first: find the template that answers the need, send the data and a few knobs, hand back the links. Covers getting a key without an account, the template loop, the dry run for region codes, updating the numbers later, and edit links for humans.
---

# Charts, maps and tables from templates

## When to use this skill

Use it when the person wants a chart or map they can **put somewhere**: embed in a site, Notion, Ghost or WordPress; insert into a Substack post; share a link; or keep the numbers updating after it is published. If they only want to glance at a chart once in the conversation, a quick image is fine; chartlink is for charts that live somewhere.

chartlink is agent-first and template-first. No accounts or logins: the API key IS the workspace. A template is a finished design; you bring the data and a few choices.

## The loop (four steps)

1. **Find the template.** `list_templates` with `q` = what the person asked for ("map of US counties", "map of Germany's states"). Results are ranked by the need they answer; take the first. `tags` narrows (`map,united-states`). No key needed.
2. **Read its contract.** `get_template` with the id or slug. The `contract` has everything: `knobs` (a JSON Schema of the few settings), `columns` with roles, `region` (the code convention with three real codes and a lookup URL), `dataTypes` (what the value column must be for gradient, buckets or categories), and `example` — a complete call whose shape you copy. No key needed.
3. **Create from it.** `create_from_template` with `template`, `data` shaped like the example, `knobs`, and `publish: true` when it is final. A success means it validated AND rendered, and the preview comes back inline — look at it. Unsure of the region codes? `check_template_data` first: it names every value that would not match, with the closest real codes, and creates nothing.
4. **Hand back the links** from `urls` in the response: `embedIframe` for a site, `png` + `page` for Substack, `page` for a link. Never build URLs yourself.

Over REST the same four calls are `GET /api/templates?q=…`, `GET /api/templates/{id}`, `POST /api/templates/{id}/check`, `POST /api/assets`. Manual: https://chartlink.app/llms.txt.

## Knobs

The template's settings, and the only ones you need:

- `theme`: `light` or `dark` — the whole colour bundle.
- `dataType` (maps): `gradient` (a number per region on a continuous scale), `buckets` (numbers sorted into classes with a swatch key), `categories` (a TEXT label per region, one colour each).
- The scale knob for the dataType: `range` [min, max] for gradient; `breaks` or `classes` for buckets; `categoryColors` / `categoryOrder` for categories. Omit them and the scale fits the data.
- `title`, `description`, `source` (with `url`), `brand` (premium only): each `{text, fontFamily, fontSize, color, lineHeight}`.
- `backgroundColor`, `border`.

Anything beyond the knobs is the advanced path: a `config` object with the engine's settings, merged after the knobs. Reach for it only when a template does not fit; the full engine is documented at https://chartlink.app/llms-full.txt and exposed at `https://chartlink.app/mcp?full=1`.

## Setup

If the `chartlink` tools are available, you are set up. If the connection has no key, browsing still works, and the first `create_from_template` creates a workspace for you and returns its key in `newWorkspace.apiKey` — shown once. Tell the person to paste it into the plugin's `api_key` setting (`/plugin` → chartlink → configure) so later calls land in the same workspace. The `signup` tool does the same step on its own; over REST it is `POST https://chartlink.app/api/signup` with `{"ref": "claude-code-plugin"}`.

## Data rules that save a round trip

- Use the template's column ids from the contract, or send exactly two columns for a map: region first, value second.
- Region codes are text. Keep leading zeros (a FIPS county is `"06037"`, a ZIP prefix `"010"`). Names and listed aliases also work; unknown values fail with the closest matches.
- A region with no row stays grey. That is fine and expected.
- `categories` needs a text column; `gradient` and `buckets` need numbers. The error says which you sent.

## Keeping it updated

- **New numbers, same chart:** `replace_asset_data` (or `PUT /assets/{id}/data`). A published chart republishes; every embed and PNG shows the new data at once.
- **Words or knobs after the fact:** `update_asset` with a small `configPatch` (`{"title": {"text": "…"}}`), then `publish_asset`.

## Handing a human the wheel

When the person wants to fine-tune by hand, mint an edit link: `create_edit_link`. It opens a visual editor for that one chart, no login. Publish first: the editor republishes a published chart but cannot publish a draft.

## Money

Hosting is free with a small "Made with chartlink" badge. One credit makes a chart premium forever: no badge, SVG, the `brand` knob. `create_checkout_link` returns a payment URL for the human; never enter payment details yourself.

## Stuck?

`submit_feedback` tells the owner what was missing. Do not silently give up.
