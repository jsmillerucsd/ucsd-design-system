/**
 * Figma Variables -> tokens/*.json
 *
 * One-way sync, Figma to git, landing as a pull request. See docs/figma-pipeline.md §3.
 *
 *   FIGMA_TOKEN=figd_...  FIGMA_FILE_KEY=abc123  node scripts/sync-figma.mjs
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

/** Maps Figma collection names to the tier they belong to. Adjust on first run. */
const COLLECTIONS = {
  '1. Primitives': { tier: 'primitive', dir: 'primitive' },
  '2. Semantic': { tier: 'semantic', dir: 'semantic' },
  '3. Component': { tier: 'component', dir: 'component' },
};

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
const variables = Object.values(meta.variables);
const collections = meta.variableCollections;

// --- helpers -----------------------------------------------------------------

const toHex = ({ r, g, b, a }) => {
  const c = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}${a < 1 ? c(a) : ''}`;
};

/** Figma names are slash-delimited: "color/action/primary". */
const segments = (name) => name.split('/').map((s) => s.trim().toLowerCase().replace(/\s+/g, '-'));

const dtcgType = (figmaType, pathSegs) => {
  if (figmaType === 'COLOR') return 'color';
  if (figmaType === 'STRING') return pathSegs.includes('family') ? 'fontFamily' : 'string';
  if (figmaType === 'FLOAT') {
    if (pathSegs.includes('weight')) return 'fontWeight';
    if (pathSegs.includes('duration')) return 'duration';
    return 'dimension';
  }
  throw new Error(`BOOLEAN variable "${pathSegs.join('/')}" is not a design token — remove it from the published collection.`);
};

/** Numbers become dimensions with units; weights and durations don't. */
const formatFloat = (n, type) =>
  type === 'dimension' ? (n === 0 ? '0' : `${n}px`)
  : type === 'duration' ? `${n}ms`
  : n;

const resolveAlias = (id) => {
  const target = meta.variables[id];
  if (!target) throw new Error(`alias points at unknown variable ${id}`);
  return `{${segments(target.name).join('.')}}`;
};

const setDeep = (obj, segs, value) => {
  let node = obj;
  for (const s of segs.slice(0, -1)) node = node[s] ??= {};
  node[segs.at(-1)] = value;
};

/** Stable key order so PR diffs are readable rather than reshuffled noise. */
const sortDeep = (o) =>
  Array.isArray(o) ? o
  : o && typeof o === 'object'
    ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortDeep(o[k])]))
    : o;

// --- build one tree per (collection, mode) -----------------------------------

const trees = new Map(); // "dir/file" -> object
const problems = [];

for (const v of variables) {
  const collection = collections[v.variableCollectionId];
  const spec = COLLECTIONS[collection?.name];
  if (!spec) continue; // unmapped collection — ignored on purpose

  const segs = segments(v.name);
  let type;
  try {
    type = dtcgType(v.resolvedType, segs);
  } catch (e) {
    problems.push(e.message);
    continue;
  }

  for (const mode of collection.modes) {
    const rawValue = v.valuesByMode[mode.modeId];
    if (rawValue === undefined) {
      problems.push(`"${v.name}" has no value in mode "${mode.name}"`);
      continue;
    }

    let value;
    if (rawValue?.type === 'VARIABLE_ALIAS') {
      value = resolveAlias(rawValue.id);
    } else if (v.resolvedType === 'COLOR') {
      value = toHex(rawValue);
    } else if (v.resolvedType === 'FLOAT') {
      value = formatFloat(rawValue, type);
    } else {
      value = rawValue;
    }

    // A semantic colour that is a literal rather than an alias breaks theming.
    if (spec.tier === 'semantic' && type === 'color' && rawValue?.type !== 'VARIABLE_ALIAS') {
      problems.push(`"${v.name}" (${mode.name}) is a literal ${value}. Semantic tokens must alias a primitive.`);
    }

    // Colour collections split by mode; everything else uses the default mode only.
    const multiMode = collection.modes.length > 1 && segs[0] === 'color';
    if (!multiMode && mode.modeId !== collection.defaultModeId) continue;

    const file = multiMode
      ? `${spec.dir}/color/${mode.name.toLowerCase()}.json`
      : `${spec.dir}/${segs[0]}.json`;

    const tree = trees.get(file) ?? {};
    trees.set(file, tree);

    const token = { $value: value, $type: type };
    if (v.description) token.$description = v.description;
    setDeep(tree, segs, token);
  }
}

// --- write -------------------------------------------------------------------

for (const [file, tree] of trees) {
  const dest = path.join(TOKENS, file);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, JSON.stringify(sortDeep(tree), null, 2) + '\n', 'utf8');
  console.log(`wrote tokens/${file}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) in the Figma file:`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nFix these in Figma. See docs/figma-pipeline.md §2 for the authoring contract.');
  process.exit(1);
}

console.log(`\nSynced ${variables.length} variables into ${trees.size} file(s). Review the diff, then commit.`);
