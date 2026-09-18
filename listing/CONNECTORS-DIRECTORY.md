# Anthropic Connectors Directory — submission draft

The portal lives at https://claude.ai/admin-settings/directory/submissions/new
and walks through ten steps. Everything below is the text for those steps,
in order, so the submission is a paste job. Docs: https://claude.com/docs/connectors/building/submission
and the review checklist https://claude.com/docs/connectors/building/review-criteria.

## Before the portal (prerequisites)

- The portal is inside a Claude **Team or Enterprise** organization's settings.
  Individual plans cannot submit. An Owner submits.
- Every tool needs a `title` and `readOnlyHint` or `destructiveHint`. Done on
  the server (2026-09-18): reads are read-only, create/duplicate/signup/submit
  are non-destructive, everything else is destructive.
- A **test account**: a workspace key on a fully populated workspace (charts of
  every type, one published, one with a data source). Mint one for reviewers
  and revoke it after review.
- Public documentation: https://chartlink.app/llms.txt (already public).
- Privacy policy: https://chartlink.app/privacy. Terms: https://chartlink.app/terms.
- Icon: `public/icon.png` in the chartlink repo (square). Screenshots are not
  required — chartlink is a plain MCP server, not an MCP App.

## Step: Connection

- Server URL: `https://chartlink.app/mcp`
- Transport: Streamable HTTP
- How users reach it: **Universal URL**

## Step: Tools

Synced from the server. 27 tools; the read-only group is whoami, list_*,
get_*; the write group is everything else.

## Step: Listing

- Name: `chartlink`
- Tagline (≤55): `Charts, maps and tables for agents, with live embeds`
- Description (≤2000):

  chartlink makes charts, maps and tables for AI agents. An agent drafts a chart from
  one message, sees the rendered preview inline, adjusts it with a small patch,
  and publishes. What comes back is a live embed, a public share page, a
  full-resolution PNG and a CSV of the data. When the numbers change, one call
  republishes every embed and image at once; or attach a CSV/JSON URL and the
  chart refetches itself on a schedule with no agent involved.

  Twelve types: line, bar, area, scatter, dumbbell, slope, heatmap, choropleth,
  symbol map, pie, waterfall, and sortable tables. Maps draw any of 237
  geographies — world countries, US states, every country's regions — cropped
  with bounds and flattened with a choice of projections. Any published chart
  is a template. Brands set fonts, colours and spacing once; charts inherit
  them. Editorial defaults: direct labels over legends, dropped labels over
  squeezed ones, a source line, a notes line for the caveat.

  No accounts: the API key is the workspace, and the `signup` tool mints one in
  a single call. Hosting is free with a small "Made with chartlink" badge; one
  credit makes a chart premium forever. Every chart has a no-login edit link
  that opens a visual editor, so an agent can hand a human the wheel for the
  last five percent.

- Categories (1–5): Data & analytics · Productivity · Design · Developer tools
- Documentation URL: https://chartlink.app/llms.txt
- Privacy policy URL: https://chartlink.app/privacy
- Support contact: support@chartlink.app
- Icon: `icon.png`
- Slug: `chartlink` (permanent once published)

## Step: Use cases

- Primary: a person asks Claude for a chart of some numbers and gets back an
  embed, a PNG and a page they can share; a newsletter or report author keeps a
  chart that updates itself from a CSV URL; an analyst turns a table into a
  sortable, embeddable table with sparklines.
- What users need first: nothing. The `signup` tool creates a workspace and
  returns its key. Premium features need credits bought on chartlink.app.
- Reads data, writes data: both. Reads list and fetch the user's own charts;
  writes create, update, publish and delete them.

## Step: Company

- Company: chartlink (Oscar Leo, Sweden)
- Website: https://chartlink.app
- Contact: pre-filled from the account.

## Step: Authentication

chartlink authenticates with a bearer API key, not OAuth. The honest options
in the portal, best first:

1. **Request headers (`static_headers`, beta):** an administrator enters
   `Authorization: Bearer viz_…` once when adding the connector; Claude sends
   it on every request. Fits an organization sharing one workspace. Standard
   header name, so no extra approval.
2. **No authentication with on-demand auth:** the server initializes and lists
   tools without a key, and the `signup` tool returns a key — but Claude cannot
   attach that key to later requests on its own, so today this mode only
   works for signup. Flag it as "partial auth" and expect the reviewer to ask.
3. **OAuth:** not available. Building an authorization server that maps a
   consent to a workspace key is the change that would make chartlink a
   first-class consumer connector. Not started.

Recommendation: submit with option 1 and say so plainly in the notes.

## Step: Data handling

- The API is chartlink's own, first party.
- No personal health data. No sponsored content.
- The connector sends only what the user gives it: the data rows and config
  for the chart. It does not read conversation history or files.

## Step: Test & launch

- Test credentials: `Authorization: Bearer <reviewer key>` (mint on a
  populated workspace; revoke after).
- Access instructions: add the connector with the header above; run `whoami`,
  `list_asset_types`, `get_spec_schema` for `line`, then `create_asset` with
  the minimal example from the schema response; `publish_asset`; open
  `urls.page`. Every tool has been exercised through the MCP Inspector and as a
  custom connector in Claude.

## Step: Compliance

Seven acknowledgments, all yes: directory guidelines, first-party API,
no financial transactions (checkout links open chartlink's own Paddle page;
no funds move through the connector), no AI media generation (charts are
rendered from data, which the criteria explicitly allow), prompt injection
(tool descriptions describe what the tool does and nothing else), no
conversation data collection, public documentation.
