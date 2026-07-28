/**
 * Token validation gate — docs/figma-pipeline.md §3.4.
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

const [prim, light, dark, space, typo, layout, button] = await Promise.all([
  loadTree(path.join(SRC, 'primitive', 'color.json')),
  loadTree(path.join(SRC, 'semantic', 'color', 'light.json')),
  loadTree(path.join(SRC, 'semantic', 'color', 'dark.json')),
  loadTree(path.join(SRC, 'semantic', 'space.json')),
  loadTree(path.join(SRC, 'semantic', 'typography.json')),
  loadTree(path.join(SRC, 'semantic', 'layout.json')),
  loadTree(path.join(SRC, 'component', 'button.json')),
]);

const nonColorSemantic = merge(space, typo, layout);

// ---------------------------------------------------------------------------
// 1 + 2. Aliasing and resolution
// ---------------------------------------------------------------------------

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
  const universe = merge(prim, modeMap, nonColorSemantic, button);

  for (const [name, token] of modeMap) {
    if (!isRef(token.$value)) {
      fail('semantic-must-alias',
        `${modeName}: color.${name} is the literal "${token.$value}". Semantic colors must alias a primitive.`);
      continue;
    }
    const r = resolve(refTarget(token.$value), universe);
    if (r.error) fail('unresolvable-alias', `${modeName}: color.${name} — ${r.error}`);
  }

  for (const [name, token] of button) {
    if (isRef(token.$value)) {
      const r = resolve(refTarget(token.$value), universe);
      if (r.error) fail('unresolvable-alias', `${modeName}: ${name} — ${r.error}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Mode parity
// ---------------------------------------------------------------------------

for (const name of light.keys()) {
  if (!dark.has(name)) fail('mode-parity', `color.${name} exists in Light but not Dark.`);
}
for (const name of dark.keys()) {
  if (!light.has(name)) fail('mode-parity', `color.${name} exists in Dark but not Light.`);
}

// ---------------------------------------------------------------------------
// 4. Naming contract
// ---------------------------------------------------------------------------

const NAME_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*$/;

for (const [prefix, map] of [['color', light], ['color', dark], ['', nonColorSemantic], ['', button], ['', prim]]) {
  for (const name of map.keys()) {
    const full = prefix ? `${prefix}.${name}` : name;
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
  ['color.text.default', 'color.surface.default', 4.5],
  ['color.text.default', 'color.surface.subtle', 4.5],
  ['color.text.default', 'color.surface.raised', 4.5],
  ['color.text.default', 'color.surface.sunken', 4.5],
  ['color.text.muted', 'color.surface.default', 4.5],
  ['color.text.muted', 'color.surface.subtle', 4.5],
  ['color.text.subtle', 'color.surface.default', 3.0],
  ['color.text.inverse', 'color.surface.inverse', 4.5],
  ['color.text.link', 'color.surface.default', 4.5],
  ['color.text.link', 'color.surface.subtle', 4.5],
  ['color.text.link-hover', 'color.surface.default', 4.5],
  ['color.text.inverse', 'color.action.primary', 4.5],
  ['color.text.inverse', 'color.action.primary-hover', 4.5],
  ['color.action.secondary', 'color.surface.default', 4.5],
  ['color.border.focus', 'color.surface.default', 3.0],
  ['color.border.focus', 'color.surface.subtle', 3.0],
  ['color.border.strong', 'color.surface.default', 3.0],
  ['color.status.info-strong', 'color.status.info-subtle', 4.5],
  ['color.status.success-strong', 'color.status.success-subtle', 4.5],
  ['color.status.warning-strong', 'color.status.warning-subtle', 4.5],
  ['color.status.danger-strong', 'color.status.danger-subtle', 4.5],
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
// Report
// ---------------------------------------------------------------------------

if (problems.length === 0) {
  console.log('✓ tokens valid: aliasing, mode parity, naming, and WCAG AA contrast in both modes.');
  process.exit(0);
}

const byRule = problems.reduce((m, p) => ((m[p.rule] ??= []).push(p.msg), m), {});
for (const [rule, msgs] of Object.entries(byRule)) {
  console.log(`\n[${rule}]  ${msgs.length} problem(s)`);
  for (const m of msgs) console.log(`  - ${m}`);
}
console.log(`\n${problems.length} problem(s). See docs/token-naming-contract.md and docs/figma-pipeline.md §3.4.`);
process.exit(1);
