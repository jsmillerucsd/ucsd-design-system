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
  ['primary', q('{colors.action-primary}')],
  ...semanticColors.map((t) => [colorKey(t.path), q(t.value)]),
];

// --- typography --------------------------------------------------------------

// Each ramp step carries size and line-height as a pair in the token source, so
// the two can never be mismatched. Family is the sans face for every step: there
// is no per-step family binding in the tokens, and inventing one here would be a
// fact the design system does not actually assert. When to reach for the display
// face is prose, in docs/design-md/03-typography.md.
const sans = val('font.family.sans');

const steps = new Map();
for (const [rest, t] of under('text')) {
  const [step, prop] = rest.split('.');
  if (!prop) continue;
  if (!steps.has(step)) steps.set(step, {});
  steps.get(step)[prop] = t.value;
}

// Step keys are quoted: `2xl` and friends are strings, but leaving a key that
// opens with a digit unquoted invites a YAML parser to guess.
const typography = [...steps].flatMap(([step, { size, 'line-height': lh }]) => [
  `  ${q(step)}:`,
  ...emit(
    [
      ['fontFamily', q(sans)],
      ['fontSize', q(size)],
      ...(lh ? [['lineHeight', q(lh)]] : []),
    ],
    4,
  ),
]);

// --- spacing / rounded -------------------------------------------------------

// The spec's Dimension type wants a unit suffix; the token source carries a bare
// `0` for the zero steps of both scales, which is correct CSS but not a Dimension.
// Normalising here keeps the tokens honest and the emitted file conformant.
const dimension = (v) => (String(v) === '0' ? '0px' : v);

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
// `padding` is emitted as a resolved two-value shorthand: the spec's Dimension is
// a single value, so a `{spacing.2} {spacing.4}` reference pair would not resolve.
// Being generated, the literal cannot drift.
const shorthandPadding = () => {
  const y = val('button.padding-y');
  const x = val('button.padding-x');
  return y && x ? [['padding', q(`${y} ${x}`)]] : [];
};

function buttonVariant(variant) {
  const t = (leaf) => byPath.get(`button.${variant}.${leaf}`);
  const base = [
    ...(t('bg') ? [['backgroundColor', refOrValue(t('bg'))]] : []),
    ...(t('fg') ? [['textColor', refOrValue(t('fg'))]] : []),
    // `borderColor` is not one of the spec's eight component properties, so this
    // draws an "unknown component property" warning. Emitted anyway — a secondary
    // button without its border colour is materially less useful to an agent, and
    // the consumer contract for unknown properties is "accept with warning".
    ...(t('border') ? [['borderColor', refOrValue(t('border'))]] : []),
    ...(byPath.get('button.radius') ? [['rounded', refOrValue(byPath.get('button.radius'))]] : []),
    ...(val('button.min-height') ? [['height', q(val('button.min-height'))]] : []),
    ...shorthandPadding(),
  ];
  const hover = t('bg-hover') ? [['backgroundColor', refOrValue(t('bg-hover'))]] : [];
  return { base, hover };
}

const components = ['primary', 'secondary'].flatMap((variant) => {
  const { base, hover } = buttonVariant(variant);
  if (!base.length) return [];
  return [
    `  button-${variant}:`,
    ...emit(base, 4),
    ...(hover.length ? [`  button-${variant}-hover:`, ...emit(hover, 4)] : []),
  ];
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

const motion = ['duration', 'easing'].flatMap((group) => {
  const pairs = under(`motion.${group}`).map(([k, t]) => [k, q(t.value)]);
  return pairs.length ? [`  ${group}:`, ...emit(pairs, 4)] : [];
});

// --- modes -------------------------------------------------------------------

// The spec has no modes concept (google-labs-code/design.md#13, open). Dark mode is
// the one thing our token set carries that the base schema cannot, and dropping it
// would regress what we already tell agents. Shaped like the proposal in #13 so
// this becomes conformant rather than rewritten if the spec adopts it.
const darkColors = dark
  .filter((t) => t.tier === 'semantic' && t.path.startsWith('color.'))
  .map((t) => [colorKey(t.path), q(t.value)]);

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
 * documentation. Fenced code blocks are exempt so usage examples still work.
 */
function assertNoLiterals(file, body) {
  const withoutCode = body.replace(/^```[\s\S]*?^```/gm, '');
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

  The YAML above is GENERATED from the design tokens; the prose below is written by
  hand in docs/design-md/. Regenerate with \`npm run build\`. CI fails if this file is
  stale, and if prose ever restates a token value.

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
    `${steps.size} type steps, ${spacing.length} spacing, ${SECTIONS.length} prose sections`,
);
