/**
 * Generate the root DESIGN.md — the file we hand to any coding agent.
 *
 * DESIGN.md is the zero-config convention for describing a visual identity to an
 * agent (Stitch, Cursor, Copilot, v0, a contractor with a clone). Unlike llms.txt
 * or a Claude Skill, it works with no prior knowledge that this repo has docs.
 *
 * THE SPLIT, and why it is this way round:
 *
 *   frontmatter  GENERATED from packages/tokens/dist/*.json. Values live in Figma,
 *                reach tokens/ via sync, and reach here via the build. One source.
 *   prose        HAND-WRITTEN in docs/design-md/. It carries intent — the thing
 *                tokens cannot express and the thing that decides whether output
 *                feels like UCSD or merely uses UCSD's colours.
 *
 * Prose must never restate a token value. That rule is what makes the file
 * drift-proof: the generated half cannot go stale, and the hand-written half
 * contains no numbers that could. Enforced by assertNoLiterals() below.
 * See https://github.com/google-labs-code/design.md/issues/16.
 *
 * We deliberately do NOT make DESIGN.md the source of truth for values — see
 * docs/architecture.md D10. The format has no modes concept, so it cannot carry
 * our light+dark semantic layer, and the format's own PHILOSOPHY.md disclaims
 * replacing token pipelines.
 *
 * Output: DESIGN.md (repo root, committed).
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(REPO, 'packages', 'tokens', 'dist');
const PROSE = path.join(REPO, 'docs', 'design-md');

const die = (msg) => {
  console.error(`\ngenerate-design-md: ${msg}\n`);
  process.exit(1);
};

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

let light, dark;
try {
  [light, dark] = await Promise.all([
    fs.readFile(path.join(DIST, 'tokens.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(DIST, 'tokens.dark.json'), 'utf8').then(JSON.parse),
  ]);
} catch {
  die('tokens not built.\n  Run `npm run build:tokens` first.');
}

const byPath = new Map(light.map((t) => [t.path, t]));
const val = (p) => byPath.get(p)?.value;

/** Tokens under a dotted prefix, in source order, keyed by the remainder of the path. */
const under = (prefix, list = light) =>
  list
    .filter((t) => t.path === prefix || t.path.startsWith(`${prefix}.`))
    .map((t) => [t.path.slice(prefix.length + 1), t]);

// ---------------------------------------------------------------------------
// YAML emission
//
// Hand-rolled rather than pulling in a YAML dependency: the shapes here are flat
// maps of scalars, and every value is emitted double-quoted, which sidesteps the
// two ways this normally goes wrong — a leading `#` starting a comment, and a
// leading `{` being read as a flow mapping.
// ---------------------------------------------------------------------------

const q = (v) => JSON.stringify(String(v));

/** Emit `key: value` pairs at a given indent. Keys are quoted when not plain. */
function emit(pairs, indent = 2) {
  const pad = ' '.repeat(indent);
  return pairs.map(([k, v]) => `${pad}${/^[a-z][a-z0-9-]*$/i.test(k) ? k : q(k)}: ${v}`);
}

const block = (name, pairs, indent = 2) =>
  pairs.length ? [`${' '.repeat(indent - 2)}${name}:`, ...emit(pairs, indent)] : [];

// ---------------------------------------------------------------------------
// Token -> DESIGN.md mapping
// ---------------------------------------------------------------------------

/**
 * `color.action.primary` -> `action-primary`.
 *
 * Only semantic colours are emitted. Primitives are withheld on purpose: the
 * hard rule is that components never bind to `palette.*`, and the cheapest way
 * to enforce it against an agent is to not put primitives in the file at all.
 */
const colorKey = (p) => p.slice('color.'.length).replaceAll('.', '-');

const semanticColors = light.filter((t) => t.tier === 'semantic' && t.path.startsWith('color.'));

/**
 * The typography collection is a set of named roles, each carrying several
 * properties. Group them so each role becomes one DESIGN.md typography entry.
 */
const typeRoles = new Map();
for (const t of light.filter((x) => x.path.startsWith('type.'))) {
  const segs = t.path.split('.');
  const role = segs.slice(1, -1).join('-');
  const leaf = segs.at(-1);
  if (!role) continue;
  if (!typeRoles.has(role)) typeRoles.set(role, {});
  typeRoles.get(role)[leaf] = t.value;
}

/**
 * A DTCG reference (`{color.action.primary}`) rewritten into a DESIGN.md
 * reference (`{colors.action-primary}`), or null if the group has no DESIGN.md
 * equivalent. Null callers fall back to the resolved literal.
 */
function toDesignRef(ref) {
  if (!ref) return null;
  const p = ref.slice(1, -1);
  if (p.startsWith('color.')) return `{colors.${colorKey(p)}}`;
  if (p.startsWith('radius.')) return `{rounded.${p.slice('radius.'.length)}}`;
  if (p.startsWith('space.')) return `{spacing.${p.slice('space.'.length)}}`;
  return null;
}

/** Prefer the semantic reference so the tier relationship stays visible in the file. */
const refOrValue = (token) => q(toDesignRef(token?.reference) ?? token?.value ?? '');

// --- colors ------------------------------------------------------------------

const colors = [
  // `missing-primary` warns that agents "will auto-generate one" when no bare
  // `primary` exists. Our palette is role-named, so alias it rather than let an
  // agent invent a brand colour. This key exists only in DESIGN.md.
  ['primary', q('{colors.theme-primary}')],
  ...semanticColors.map((t) => [colorKey(t.path), q(t.value)]),
];

// --- typography --------------------------------------------------------------

// The spec's Dimension type wants a unit suffix; the token source carries a bare
// `0` for zero steps and zero tracking, which is correct CSS but not a Dimension.
const dimension = (v) => (String(v) === '0' ? '0px' : v);

// One entry per role, carrying whichever properties the Figma file defines for it.
// Roles are quoted: `h2-small` is fine bare, but a key that opens with a digit
// invites a YAML parser to guess, and the role set is the designer's to change.
const typography = [...typeRoles].flatMap(([role, props]) => {
  const pairs = [
    ...(props['font-family'] ? [['fontFamily', q(props['font-family'])]] : []),
    ...(props['font-size'] ? [['fontSize', q(props['font-size'])]] : []),
    ...(props['line-height'] ? [['lineHeight', q(props['line-height'])]] : []),
    ...(props['font-weight'] ? [['fontWeight', props['font-weight']]] : []),
    ...(props['tracking'] != null ? [['letterSpacing', q(dimension(props['tracking']))]] : []),
  ];
  return pairs.length ? [`  ${q(role)}:`, ...emit(pairs, 4)] : [];
});

// --- spacing / rounded -------------------------------------------------------

const spacing = under('space').map(([k, t]) => [k, q(dimension(t.value))]);

// `rounded` is a spec'd group whose Dimension type admits only px/em/rem, and the
// linter errors on anything else. `radius.circle` is a percentage — legitimate CSS,
// not a legal Dimension — so it is filtered out rather than allowed to fail the
// build. It stays available in the full token reference, and what a circular radius
// is *for* is prose, in docs/design-md/06-shapes.md.
const isDimension = (v) => /^-?\d+(\.\d+)?(px|em|rem)$/.test(String(v));

const rounded = under('radius')
  .map(([k, t]) => [k, dimension(t.value)])
  .filter(([, v]) => isDimension(v))
  .map(([k, v]) => [k, q(v)]);

// --- components --------------------------------------------------------------

// Emitted as references, not literals, so the binding a component is required to
// use is visible in the file — and so the linter's contrast-ratio rule can check
// the background/text pairs it resolves.
//
// The Figma file pairs each button fill with its own label colour
// (`component/btn/primary` + `component/btn/label-primary`), which maps exactly onto
// the spec's backgroundColor/textColor pair. Radius and typography come from the
// shared scale, since the Figma file has no per-button values for them.
const BUTTONS = ['primary', 'secondary', 'tertiary'];

const components = BUTTONS.flatMap((variant) => {
  const fill = byPath.get(`color.component.btn.${variant}`);
  const label = byPath.get(`color.component.btn.label-${variant}`);
  if (!fill) return [];

  // Reference the semantic colour by its DESIGN.md key rather than following the
  // token's own alias: `{palette.secondary.yellow.500}` has no meaning in this file
  // (primitives are deliberately absent), so it would silently fall back to a hex
  // and the binding would be lost.
  // The button's corner radius is a SEMANTIC token in Figma (layout-semantic:
  // button.radius, aliasing a radius step). Emit the step it resolves to as a
  // {rounded.*} reference so the linter can follow it inside this file.
  const btnRadius = toDesignRef(byPath.get('button.radius')?.reference);

  const pairs = [
    ['backgroundColor', q(`{colors.${colorKey(fill.path)}}`)],
    ...(label ? [['textColor', q(`{colors.${colorKey(label.path)}}`)]] : []),
    ...(btnRadius ? [['rounded', q(btnRadius)]] : []),
    ...(typeRoles.get('button')?.['font-size']
      ? [['typography', q('{typography.button}')]] : []),
  ];
  return [`  button-${variant}:`, ...emit(pairs, 4)];
});

// --- custom keys -------------------------------------------------------------

// The spec deliberately standardises only the universal categories and leaves the
// rest open: "the format grows through its users, not its spec". These are the
// groups our token set has that the base schema does not name.
//
// Caveat, verified against the linter rather than the docs: while `unknown-key`
// ignores custom keys, `token-like-ignored` does NOT — it warns on any unknown
// top-level key whose values look like tokens, which is exactly what these are.
// Four warnings (breakpoints, containers, motion, modes) are therefore expected
// and permanent. They are warnings, CI gates on errors, and dropping the data to
// silence them would cost far more than it saves.

const breakpoints = under('breakpoint').map(([k, t]) => [k, q(t.value)]);
const containers = under('container').map(([k, t]) => [k, q(t.value)]);
const elevation = under('elevation').map(([k, t]) => [k, q(t.value)]);
// From the Figma layout-semantic collection: icon sizes and the CSS-grid cell
// gap (distinct from containers.gutter, the row/column gutter).
const icons = under('icon').map(([k, t]) => [k, q(t.value)]);
const grid = under('grid').map(([k, t]) => [k, refOrValue(t)]);

const motion = ['duration', 'easing'].flatMap((group) => {
  const pairs = under(`motion.${group}`).map(([k, t]) => [k, q(t.value)]);
  return pairs.length ? [`  ${group}:`, ...emit(pairs, 4)] : [];
});

// --- modes -------------------------------------------------------------------

// The spec has no modes concept (google-labs-code/design.md#13, open). Dark mode is
// the one thing our token set carries that the base schema cannot, and dropping it
// would regress what we already tell agents. Shaped like the proposal in #13 so
// this becomes conformant rather than rewritten if the spec adopts it.
const darkByPath = new Map(dark.map((t) => [t.path, t]));

/**
 * The dark value of a colour that has no entry of its own in the dark manifest.
 *
 * Code-owned component tokens (tokens/code/components.json) alias a semantic colour
 * rather than restating it, precisely so they inherit dark mode — the CSS emits
 * `var(--ucsd-color-surface-2)` and follows automatically. But the dark manifest is
 * filtered to tokens declared in semantic.dark.json, so those aliases are absent
 * from it, and a naive projection would leave them out of `modes.dark` entirely.
 * DESIGN.md would then claim they are mode-invariant, which is false.
 *
 * So follow the alias chain until it lands on something the dark manifest defines.
 * A chain that never does is genuinely the same in both modes, and its light value
 * is the honest answer.
 */
function darkValueOf(token, seen = new Set()) {
  const ref = token.reference?.slice(1, -1);
  if (!ref || seen.has(ref)) return token.value;
  if (darkByPath.has(ref)) return darkByPath.get(ref).value;
  const next = byPath.get(ref);
  return next ? darkValueOf(next, new Set([...seen, ref])) : token.value;
}

const darkColors = [
  ...dark.filter((t) => t.tier === 'semantic' && t.path.startsWith('color.')),
  ...semanticColors.filter((t) => !darkByPath.has(t.path)),
]
  .map((t) => [colorKey(t.path), q(darkByPath.get(t.path)?.value ?? darkValueOf(t))])
  .sort(([a], [b]) => a.localeCompare(b));

// ---------------------------------------------------------------------------
// Prose
// ---------------------------------------------------------------------------

const SECTIONS = [
  '01-overview.md',
  '02-colors.md',
  '03-typography.md',
  '04-layout.md',
  '05-elevation.md',
  '06-shapes.md',
  '07-components.md',
  '08-dos-and-donts.md',
];

/**
 * Reject literal token values in prose.
 *
 * This is the whole drift defence. A value written into prose is a second copy
 * that no build step keeps honest, and a confidently stale hex is worse than no
 * documentation. Fenced code blocks and inline code spans are exempt so usage
 * examples and short code references (e.g. a per-colour hex in `#182B49` form)
 * still work — inline code is code, not prose, and the rule targets prose.
 */
function assertNoLiterals(file, body) {
  const withoutCode = body
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/`[^`]*`/g, '');
  const found = [
    ...withoutCode.matchAll(/#[0-9a-fA-F]{3,8}\b/g),
    ...withoutCode.matchAll(/\b\d+(?:\.\d+)?(?:px|rem|em)\b/g),
  ].map((m) => m[0]);

  if (found.length) {
    die(
      `docs/design-md/${file} contains literal token values: ${[...new Set(found)].join(', ')}\n\n` +
        '  Prose names tokens; it never carries their values — that is what keeps this\n' +
        '  file from going stale. Write "the color.action.primary fill" or "the widest\n' +
        '  step of the ramp" instead. Fenced code blocks are exempt.',
    );
  }
}

const prose = [];
for (const file of SECTIONS) {
  let body;
  try {
    body = await fs.readFile(path.join(PROSE, file), 'utf8');
  } catch {
    die(`docs/design-md/${file} is missing.\n  Section order is fixed by the spec; see docs/design-md/README.md.`);
  }
  assertNoLiterals(file, body);
  prose.push(body.trim());
}

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------

const frontmatter = [
  '---',
  '# GENERATED BLOCK — do not edit.',
  '# Values come from Figma via tokens/ and packages/tokens/dist/tokens.json.',
  '# Edit the prose in docs/design-md/, then run `npm run build`.',
  'version: alpha',
  'name: UC San Diego',
  `description: ${q('Design system for UC San Diego. Bootstrap 5 and Tailwind/shadcn are both first-class targets; they share tokens, not markup.')}`,
  'colors:',
  '  # Semantic roles only. Primitives are withheld deliberately — components must',
  '  # never bind to a raw palette value. Dark mode is a re-alias of these same',
  '  # tokens; see `modes` at the end of this block.',
  ...emit(colors),
  'typography:',
  ...typography,
  ...block('spacing', spacing),
  ...block('rounded', rounded),
  'components:',
  ...components,
  ...block('breakpoints', breakpoints),
  ...block('containers', containers),
  ...block('icons', icons),
  ...block('grid', grid),
  ...block('elevation', elevation),
  'motion:',
  ...motion,
  'modes:',
  '  dark:',
  ...block('colors', darkColors, 6),
  '---',
];

const header = `<!--
  DESIGN.md — the file to hand any coding agent building for UC San Diego.

  DO NOT EDIT THIS FILE DIRECTLY. Every line is build output, and \`npm run build\`
  overwrites an edit made here without warning:

    values (the YAML above)   -> change in Figma, then \`npm run sync:figma\`
    prose  (everything below) -> edit docs/design-md/*.md, then \`npm run build\`

  CI fails if this file is stale, and if prose ever restates a token value.

  Full token reference (light + dark, with CSS/Sass/Tailwind syntax):
    skills/ucsd-design-system/references/generated/tokens.md
-->

# UC San Diego Design System`;

await fs.writeFile(
  path.join(REPO, 'DESIGN.md'),
  `${frontmatter.join('\n')}\n\n${header}\n\n${prose.join('\n\n')}\n`,
  'utf8',
);

console.log(
  `DESIGN.md: ${semanticColors.length} colours (+${darkColors.length} dark), ` +
    `${typeRoles.size} type roles, ${spacing.length} spacing, ${SECTIONS.length} prose sections`,
);
