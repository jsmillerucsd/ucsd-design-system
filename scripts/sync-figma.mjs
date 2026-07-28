/**
 * Figma Variables -> tokens/*.json
 *
 * One-way sync, Figma to git, landing as a pull request. See docs/figma-pipeline.md §3.
 *
 *   FIGMA_TOKEN=figd_...  FIGMA_FILE_KEY=abc123  node scripts/sync-figma.mjs
 *
 * This file is only I/O: fetch, report, write. The mapping logic lives in
 * scripts/lib/figma-transform.mjs so it can be tested without a Figma account.
 *
 * STATUS: written against the documented shape of the Figma Variables REST API,
 * but NOT yet run against the real UCSD file — no file key or token exists yet.
 * Expect to adjust collection names in COLLECTIONS on first run.
 *
 * Requires the Figma Enterprise plan (the /variables/local endpoint is gated).
 * If UCSD is not on Enterprise, delete this script and use Tokens Studio instead
 * — everything downstream is unaffected, because both produce the same DTCG files.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform, sortDeep } from './lib/figma-transform.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = path.join(REPO, 'tokens');

const { FIGMA_TOKEN, FIGMA_FILE_KEY } = process.env;
if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error(`
Figma sync is not configured.

  FIGMA_TOKEN     personal access token with the file_variables:read scope
  FIGMA_FILE_KEY  from the file URL: figma.com/design/<FILE_KEY>/...

Set both and re-run. Until then, tokens/ holds placeholder values.
See docs/figma-pipeline.md §3 for the plan, including the Tokens Studio fallback.
`);
  process.exit(1);
}

const res = await fetch(
  `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
  { headers: { 'X-Figma-Token': FIGMA_TOKEN } },
);
if (!res.ok) {
  console.error(`Figma API ${res.status}: ${await res.text()}`);
  if (res.status === 403) {
    console.error('\n403 usually means the file is not on an Enterprise plan, or the token lacks file_variables:read.');
  }
  process.exit(1);
}

const { meta } = await res.json();
const { files, problems } = transform(meta);

// --- validate BEFORE writing -------------------------------------------------
// Nothing touches tokens/ unless the whole file is sound. Writing first and
// failing afterwards would leave an invalid, half-synced working tree behind.

if (problems.length) {
  console.error(`\n${problems.length} problem(s) in the Figma file — nothing was written:`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nFix these in Figma. See docs/figma-pipeline.md §2 for the authoring contract.');
  process.exit(1);
}

// --- write -------------------------------------------------------------------

for (const [file, tree] of files) {
  const dest = path.join(TOKENS, file);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, JSON.stringify(sortDeep(tree), null, 2) + '\n', 'utf8');
  console.log(`wrote tokens/${file}`);
}

const count = Object.keys(meta.variables).length;
console.log(`\nSynced ${count} variables into ${files.size} file(s). Review the diff, then commit.`);
