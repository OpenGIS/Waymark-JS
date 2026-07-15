/**
 * Generates the project skill file for agents.
 *
 * Assembles a consumer-facing skill from docs/1.api.md only.
 * Internals/contributor docs are excluded — this is for library consumers.
 *
 * Output path is fixed: ./SKILL.md (project root)
 *
 * Usage: node scripts/skill-md.js
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const API_DOC = path.join(ROOT, "docs", "1.api.md");
const OUTPUT = path.join(ROOT, "SKILL.md");

// Strip Nuxt Content frontmatter (--- ... ---) from the top of a file
function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, "").trimStart();
}

// Strip api-contract marker comments (sync automation internals)
function stripContractMarkers(content) {
  return content.replace(/^\s*<!--\s*api-contract:.*?-->\s*\n?/gm, "");
}

// Strip the api-contract NOTE block (sync automation info, not consumer-relevant)
function stripContractNote(content) {
  return content.replace(
    />\s*\[!NOTE\]\s*\n>\s*API heading names and `api-contract` marker blocks are enforced by sync automation\. Change them only alongside matching tests and sync scripts\.\s*\n/g,
    "",
  );
}

const raw = fs.readFileSync(API_DOC, "utf8");
const apiContent = stripContractNote(
  stripContractMarkers(stripFrontmatter(raw)),
);

const skill = `---
name: waymark-js
description: Consumer API reference for the Waymark JS map library. Use when building with createInstance(...), configuring maps, basemaps, data layers, paint, types, or instance events.
---

${apiContent}
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, skill, "utf8");
console.log(`Written: ${path.relative(ROOT, OUTPUT)}`);
