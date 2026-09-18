#!/usr/bin/env node
// Is this repo telling the truth about the live server? Compares the MCP
// tool inventory (tools/list works without a key) and the chart-type list
// (from llms.txt) against what LISTING.md and SKILL.md claim.
//
//   node scripts/check.mjs            # exit 1 on any drift, with the diff
//
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.CHARTLINK_URL ?? "https://chartlink.app";

const res = await fetch(`${BASE}/mcp`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
});
const rpc = await res.json();
const liveTools = (rpc.result?.tools ?? []).map((t) => t.name);
if (liveTools.length === 0) throw new Error(`tools/list returned nothing: ${JSON.stringify(rpc).slice(0, 200)}`);

const llms = await (await fetch(`${BASE}/llms.txt`)).text();
const typesLine = llms.split("\n").find((l) => l.startsWith("CHART TYPES:"));
if (!typesLine) throw new Error("llms.txt has no 'CHART TYPES:' line");
const liveTypes = typesLine.replace("CHART TYPES:", "").split(",").map((s) => s.trim()).filter(Boolean);

const listing = readFileSync(join(root, "listing/LISTING.md"), "utf8");
const skill = readFileSync(join(root, "plugins/chartlink/skills/chartlink/SKILL.md"), "utf8");

const problems = [];
// Tools: the LISTING line under "## Tools (N)" must equal the live set, and N must match.
const m = listing.match(/## Tools \((\d+)\)\n\n([^\n]+)/);
if (!m) problems.push("LISTING.md: no '## Tools (N)' section");
else {
  const claimed = m[2].split("·").map((s) => s.trim()).filter(Boolean);
  const missing = liveTools.filter((t) => !claimed.includes(t));
  const extra = claimed.filter((t) => !liveTools.includes(t));
  if (missing.length) problems.push(`LISTING.md tools missing: ${missing.join(", ")}`);
  if (extra.length) problems.push(`LISTING.md tools no longer on the server: ${extra.join(", ")}`);
  if (Number(m[1]) !== liveTools.length) problems.push(`LISTING.md says ${m[1]} tools; server has ${liveTools.length}`);
}
// Types: LISTING enumerates them, so every live id must appear. SKILL describes
// instead of enumerating; its contract is the count it states ("twelve today")
// and that any type it does name still exists.
for (const t of liveTypes) {
  const human = t.replace("-", " ");
  if (!listing.includes(t) && !listing.includes(human)) problems.push(`LISTING.md never mentions type "${t}"`);
}
const WORDS = { eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16 };
const countWord = skill.match(/\b(eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen) today\b/)?.[1];
if (!countWord) problems.push('SKILL.md should state the type count as "<word> today"');
else if (WORDS[countWord] !== liveTypes.length) problems.push(`SKILL.md says ${countWord} types; server has ${liveTypes.length}`);
const KNOWN_TYPE_WORDS = ["line", "bar", "area", "scatter", "dumbbell", "slope", "heatmap", "choropleth", "symbol-map", "pie", "waterfall", "table"];
for (const t of KNOWN_TYPE_WORDS) {
  if (skill.includes("`" + t + "`") && !liveTypes.includes(t)) problems.push(`SKILL.md names type "${t}", which the server no longer has`);
}
// Any tool the skill names must exist.
for (const name of skill.match(/`([a-z_]+)`/g)?.map((s) => s.slice(1, -1)) ?? []) {
  if (/^[a-z]+_[a-z_]+$/.test(name) && !liveTools.includes(name) && !["api_key", "data_source"].includes(name) && !name.startsWith("chart") && !name.startsWith("document")) {
    problems.push(`SKILL.md names tool "${name}", which the server does not have`);
  }
}

// The Cursor layout at the repo root mirrors the Claude plugin: one skill,
// one MCP config, two spellings of its filename. They must not drift.
const rootSkill = readFileSync(join(root, "skills/chartlink/SKILL.md"), "utf8");
if (rootSkill !== skill) problems.push("skills/chartlink/SKILL.md (Cursor) differs from plugins/chartlink/skills/chartlink/SKILL.md (Claude) — copy one over the other");
const mcpA = readFileSync(join(root, "mcp.json"), "utf8");
const mcpB = readFileSync(join(root, ".mcp.json"), "utf8");
if (mcpA !== mcpB) problems.push("mcp.json and .mcp.json differ — they are the same file under the two names directories look for");

console.log(`server: ${liveTools.length} tools, ${liveTypes.length} chart types`);
if (problems.length) {
  for (const p of problems) console.error("✗ " + p);
  process.exit(1);
}
console.log("✓ LISTING.md, both SKILL.md copies and both mcp.json copies match the live server");
