/**
 * Token validation gate — docs/figma.md §3.4.
 *
 * Runs against the token SOURCE (tokens/) and the BUILT output (dist/), and is
 * the thing that blocks a bad Figma sync from merging:
 *
 *   1. Semantic tokens are aliases, not literals   (else theming is impossible)
 *   2. Aliases resolve, <= 3 hops, no cycles
 *   3. Mode parity — every semantic token in both Light and Dark
 *   4. Names match the contract regex
 *   5. WCAG 2.2 AA contrast on defined pairs, in BOTH modes
 *
 * Check 5 is the important one: it catches an accessibility regression at design
 * time rather than in an audit eight months after launch.
 *
 *   node scripts/validate-tokens.mjs
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(REPO, 'tokens');
const DIST = path.join(REPO, 'packages', 'tokens', 'dist');

const problems = [];
const fail = (rule, msg) => problems.push({ rule, msg });

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

// ---------------------------------------------------------------------------
// Load source
// ---------------------------------------------------------------------------

async function loadTree(file) {
  const tree = await readJson(file);
  const out = new Map();
  (function walk(node, segs) {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && '$value' in v) out.set([...segs, k].join('.'), v);
      else if (v && typeof v === 'object') walk(v, [...segs, k]);
    }
  })(tree, []);
  return out;
}

const merge = (...maps) => new Map(maps.flatMap((m) => [...m]));

/**
 * Discover token files rather than listing them by name.
 *
 * Naming each file meant a newly added one — say a second component file synced
 * from Figma, which scripts/lib/figma-transform.mjs creates automatically — was
 * silently never loaded, so nothing in it was checked while CI still went green.
 */
async function tokenFiles(dir) {
  const found = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await tokenFiles(full));
    else if (entry.name.endsWith('.json')) found.push(full);
  }
  return found;
}

const allFiles = await tokenFiles(SRC);
const rel = (f) => path.relative(SRC, f).split(path.sep).join('/');
const load = async (matches) =>
  merge(...await Promise.all(allFiles.filter((f) => matches(rel(f))).map(loadTree)));

// Four tiers, mirroring the Figma collections: brand -> primitive -> semantic,
// plus the code-owned tokens Figma cannot express. See tokens/README.md.
const [brand, prim, light, dark, nonColorSemantic] = await Promise.all([
  load((r) => r === 'figma/brand.json'),
  load((r) => r === 'figma/primitive.json'),
  load((r) => r === 'figma/semantic.light.json'),
  load((r) => r === 'figma/semantic.dark.json'),
  load((r) => r === 'figma/layout.json' || r === 'figma/typography.json' || r.startsWith('code/')),
]);

for (const [mode, map] of [['light', light], ['dark', dark]]) {
  if (map.size === 0) {
    fail('missing-mode-file', `tokens/figma/semantic.${mode}.json is missing or empty. Run \`npm run sync:figma\`.`);
  }
}

// ---------------------------------------------------------------------------
// 1 + 2. Aliasing and resolution
// ---------------------------------------------------------------------------

// Same predicate as `asReference` in packages/tokens/build.mjs — keep in step.
const isRef = (v) => typeof v === 'string' && /^\{[^}]+\}$/.test(v);
const refTarget = (v) => v.slice(1, -1);

function resolve(refPath, universe, seen = new Set(), hops = 0) {
  if (seen.has(refPath)) return { error: `cycle at {${refPath}}` };
  if (hops > 3) return { error: `more than 3 alias hops at {${refPath}}` };
  const token = universe.get(refPath);
  if (!token) return { error: `unknown reference {${refPath}}` };
  if (!isRef(token.$value)) return { value: token.$value };
  return resolve(refTarget(token.$value), universe, new Set([...seen, refPath]), hops + 1);
}

for (const [modeName, modeMap] of [['Light', light], ['Dark', dark]]) {
  const universe = merge(brand, prim, modeMap, nonColorSemantic);

  for (const [name, token] of modeMap) {
    if (!isRef(token.$value)) {
      fail('semantic-must-alias',
        `${modeName}: ${name} is the literal "${token.$value}". Semantic colors must alias a primitive — ` +
        `bind it to a colors-primitive variable in Figma.`);
      continue;
    }
    const r = resolve(refTarget(token.$value), universe);
    if (r.error) fail('unresolvable-alias', `${modeName}: ${name} — ${r.error}`);
  }

  // Primitives may alias brand (the -500 steps do); brand itself must be literal.
  for (const [name, token] of prim) {
    if (isRef(token.$value)) {
      const r = resolve(refTarget(token.$value), universe);
      if (r.error) fail('unresolvable-alias', `${modeName}: ${name} — ${r.error}`);
    }
  }
}

for (const [name, token] of brand) {
  if (isRef(token.$value)) {
    fail('brand-must-be-literal',
      `${name} is an alias. The brand tier is the bottom of the stack and must hold literal values.`);
  }
}

// ---------------------------------------------------------------------------
// 3. Mode parity
// ---------------------------------------------------------------------------

for (const name of light.keys()) {
  if (!dark.has(name)) fail('mode-parity', `${name} exists in Light but not Dark.`);
}
for (const name of dark.keys()) {
  if (!light.has(name)) fail('mode-parity', `${name} exists in Dark but not Light.`);
}

// ---------------------------------------------------------------------------
// 4. Naming contract
// ---------------------------------------------------------------------------

const NAME_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*$/;

for (const map of [light, dark, nonColorSemantic, prim, brand]) {
  for (const full of map.keys()) {
    if (!NAME_RE.test(full)) {
      fail('naming-contract', `"${full}" does not match the naming contract (see docs/token-naming-contract.md).`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. WCAG contrast — against the BUILT, resolved values
// ---------------------------------------------------------------------------

let manifestLight, manifestDark;
try {
  [manifestLight, manifestDark] = await Promise.all([
    readJson(path.join(DIST, 'tokens.json')),
    readJson(path.join(DIST, 'tokens.dark.json')),
  ]);
} catch {
  fail('not-built', 'packages/tokens/dist not found — run `npm run build:tokens` before validating.');
}

function srgbToLinear(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/**
 * Pairs that must pass. `min` is 4.5 for body text, 3.0 for large text and for
 * non-text UI boundaries (WCAG 1.4.3 and 1.4.11).
 */
const PAIRS = [
  // Body and headings on the two content surfaces. `surface.background` is the
  // outer chrome band, not a text surface, so it is deliberately not listed.
  ['color.foreground.body-text', 'color.surface.1', 4.5],
  ['color.foreground.body-text', 'color.surface.2', 4.5],
  ['color.foreground.body-text-focus', 'color.surface.1', 4.5],
  ['color.foreground.heading-1', 'color.surface.1', 4.5],
  ['color.foreground.heading-2', 'color.surface.1', 4.5],
  ['color.foreground.heading-3', 'color.surface.1', 4.5],
  ['color.foreground.subheading', 'color.surface.1', 4.5],
  ['color.foreground.eyebrow', 'color.surface.1', 4.5],

  // Buttons: each label against its own fill.
  ['color.component.btn-label-primary', 'color.component.btn-primary', 4.5],
  ['color.component.btn-label-secondary', 'color.component.btn-secondary', 4.5],
  ['color.component.btn-label-tertiary', 'color.component.btn-tertiary', 4.5],

  ['color.component.link', 'color.surface.1', 4.5],
  ['color.component.icon', 'color.surface.1', 3.0],
  ['color.component.menu', 'color.surface.1', 4.5],

  // System messaging: the -foreground/-bg pairs are designed to be used together.
  ['color.system.foreground-success', 'color.system.bg-success', 4.5],
  ['color.system.foreground-warning', 'color.system.bg-warning', 4.5],
  ['color.system.foreground-error', 'color.system.bg-error', 4.5],
  ['color.system.foreground-information', 'color.system.bg-information', 4.5],

  // Non-text UI boundaries (WCAG 1.4.11).
  ['color.foreground.divider', 'color.surface.1', 3.0],
  ['color.foreground.subcard-border', 'color.surface.1', 3.0],
];

if (manifestLight) {
  const lightVals = new Map(manifestLight.map((t) => [t.path, t.value]));
  const darkVals = new Map([...lightVals, ...manifestDark.map((t) => [t.path, t.value])]);

  for (const [modeName, vals] of [['Light', lightVals], ['Dark', darkVals]]) {
    for (const [fg, bg, min] of PAIRS) {
      const a = vals.get(fg);
      const b = vals.get(bg);
      if (!a || !b) {
        fail('contrast-missing-token', `${modeName}: cannot check ${fg} on ${bg} — token missing.`);
        continue;
      }
      const ratio = contrast(a, b);

      // NaN < min is false, so an unparseable colour would slip through as a pass
      // and the script would still claim AA compliance. Fail loudly instead.
      if (!Number.isFinite(ratio)) {
        fail('contrast-unparseable',
          `${modeName}: cannot compute contrast for ${fg} (${a}) on ${bg} (${b}). ` +
          `Colour values must be hex; rgb()/hsl()/named colours are not supported.`);
        continue;
      }

      if (ratio < min) {
        fail('contrast',
          `${modeName}: ${fg} (${a}) on ${bg} (${b}) is ${ratio.toFixed(2)}:1, needs ${min}:1.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Accepted debt
//
// Defects in the Figma file we cannot fix from here. Listing one downgrades it to
// a warning so the gate can stay green while design fixes it upstream.
//
// The list is self-cleaning: an entry that no longer matches is itself an error.
// Otherwise the ledger silently accumulates rules nobody is enforcing, which is
// the failure mode that makes exception lists worse than no gate at all.
// ---------------------------------------------------------------------------

const { accepted = [] } = await readJson(path.join(SRC, 'known-issues.json')).catch(() => ({}));

const matched = new Set();
const accepts = (p) =>
  accepted.some((a, i) =>
    a.rule === p.rule && p.msg.includes(a.match) && (matched.add(i), true));

const waived = problems.filter(accepts);
const blocking = problems.filter((p) => !accepts(p));

for (const [i, a] of accepted.entries()) {
  if (!matched.has(i)) {
    blocking.push({
      rule: 'stale-known-issue',
      msg: `known-issues.json accepts "${a.match}" under [${a.rule}], but nothing matches it any more. ` +
           `If it was fixed, delete the entry.`,
    });
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

if (waived.length) {
  console.log(`\n${waived.length} accepted defect(s) — tracked in tokens/known-issues.json, owned by design:\n`);
  for (const p of waived) console.log(`  ! [${p.rule}] ${p.msg}`);
}

if (blocking.length === 0) {
  console.log('\n✓ tokens valid: aliasing, mode parity, naming, and WCAG AA contrast in both modes.');
  process.exit(0);
}

const byRule = blocking.reduce((m, p) => ((m[p.rule] ??= []).push(p.msg), m), {});
for (const [rule, msgs] of Object.entries(byRule)) {
  console.log(`\n[${rule}]  ${msgs.length} problem(s)`);
  for (const m of msgs) console.log(`  - ${m}`);
}
console.log(`\n${blocking.length} problem(s). See docs/token-naming-contract.md and docs/figma.md §3.`);
process.exit(1);
