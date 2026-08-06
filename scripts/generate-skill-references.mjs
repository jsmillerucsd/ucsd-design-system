/**
 * Generate the LLM-facing documentation from the built tokens.
 *
 * This script is the reason the system doesn't rot. Hand-written design-system
 * docs drift from the tokens within one sprint, and a confidently stale hex code
 * is worse than no documentation at all. So the token reference is a BUILD
 * ARTIFACT: change a value in Figma, and the model's knowledge changes with it,
 * in the same commit.
 *
 * Outputs (all committed — the skill must work with no build step):
 *   skills/…/references/generated/tokens.md    full token reference
 *   skills/…/references/generated/banned.json  machine-readable literals to reject
 *   skills/…/references/generated/*.md         copies of the agent-relevant docs/
 *   llms.txt                                   convention for non-Claude tools
 *
 * Nothing here is hand-written prose. The visual rules live once, in
 * docs/design-md/08-dos-and-donts.md, and reach DESIGN.md and then llms.txt by
 * extraction; the guides live once, under docs/, and are copied in. Before this,
 * llms.txt carried a hand-typed copy of the rules that could silently disagree
 * with SKILL.md, and nothing in CI would have caught it.
 *
 * Runs AFTER generate-design-md.mjs — see the build script ordering in package.json.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tailwindName } from '../packages/tokens/formats/tailwind-theme.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(REPO, 'packages', 'tokens', 'dist');
const SKILL_DIR = path.join(REPO, 'skills', 'ucsd-design-system');
const GEN = path.join(SKILL_DIR, 'references', 'generated');

const read = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

/**
 * Extract a `## ` section body from a markdown document.
 *
 * Used to lift the rules out of DESIGN.md rather than restating them in a string
 * literal here. A hardcoded copy would drift the moment the rules changed, and CI
 * would not notice — regenerating would reproduce the same stale text. Exiting on
 * a missing heading turns a silent drift into a build failure.
 */
function section(md, titlePattern) {
  const body = md
    .split(/^## /m)
    .slice(1)
    .find((part) => titlePattern.test(part.split('\n', 1)[0]));
  if (!body) {
    console.error(
      `\ngenerate-skill-references: no DESIGN.md section matching ${titlePattern}.\n` +
      `  Rules are extracted from DESIGN.md — restore the heading in\n` +
      `  docs/design-md/ or update this script.\n`,
    );
    process.exit(1);
  }
  return body.split('\n').slice(1).join('\n').trim();
}

let light, dark;
try {
  [light, dark] = await Promise.all([
    read(path.join(DIST, 'tokens.json')),
    read(path.join(DIST, 'tokens.dark.json')),
  ]);
} catch {
  console.error('\ngenerate-skill-references: tokens not built.\n  Run `npm run build:tokens` first.\n');
  process.exit(1);
}

/** The canonical visual rules. Extracted, never retyped — see the header note. */
let designMd;
try {
  designMd = await fs.readFile(path.join(REPO, 'DESIGN.md'), 'utf8');
} catch {
  console.error('\ngenerate-skill-references: DESIGN.md not found.\n  Run `npm run build:designmd` first.\n');
  process.exit(1);
}

const darkByPath = new Map(dark.map((t) => [t.path, t]));

/**
 * Utility hint for a token, derived from the SAME mapping the Tailwind formatter
 * uses. A hand-written second copy had already drifted: font, breakpoint and
 * container tokens do get utilities, but the docs showed "—" for all of them.
 *
 * Keyed on the emitted Tailwind variable name, so a token that stops being exposed
 * automatically falls back to "—" here with no edit.
 */
const HINTS = [
  [/^--color-(.+)$/,             (x) => `\`bg-${x}\` \`text-${x}\` \`border-${x}\``],
  [/^--spacing-(.+)$/,           (x) => `\`p-${x}\` \`m-${x}\` \`gap-${x}\``],
  [/^--radius-(.+)$/,            (x) => `\`rounded-${x}\``],
  [/^--shadow-(.+)$/,            (x) => `\`shadow-${x}\``],
  [/^--text-(.+)--line-height$/, (x) => `paired with \`text-${x}\``],
  [/^--text-(.+)$/,              (x) => `\`text-${x}\``],
  [/^--font-weight-(.+)$/,       (x) => `\`font-${x}\``],
  [/^--font-(.+)$/,              (x) => `\`font-${x}\``],
  [/^--breakpoint-(.+)$/,        (x) => `\`${x}:\` variants`],
  [/^--container-(.+)$/,         (x) => `\`max-w-${x}\``],
];

function tailwindHint(t) {
  const mapped = tailwindName({ path: t.path.split('.') });
  if (!mapped) return '—';
  for (const [re, format] of HINTS) {
    const m = mapped.name.match(re);
    if (m) return format(m[1]);
  }
  return `\`${mapped.name.replace(/^--/, '')}\``;
}

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');

/** Group semantic tokens by their first two path segments (color.action, space, ...). */
function groupOf(t) {
  const p = t.path.split('.');
  return p[0] === 'color' ? `color.${p[1]}` : p[0];
}

const semantic = light.filter((t) => t.tier === 'semantic');
const primitive = light.filter((t) => t.tier === 'primitive');
const component = light.filter((t) => t.tier === 'component');

// Group in one pass. The previous form re-derived groupOf() for every token once
// per group, and re-split every path each time.
const byGroup = Map.groupBy(semantic, groupOf);

const row = (cells) => `| ${cells.join(' | ')} |`;

// --- tokens.md ---------------------------------------------------------------

const lines = [
  '# UCSD Design Tokens — full reference',
  '',
  '> **GENERATED FILE — do not edit.** Produced by `scripts/generate-skill-references.mjs`',
  '> from `packages/tokens/dist/tokens.json`. To change a value, change it in Figma',
  '> and run the sync; see `docs/figma.md`.',
  '',
  `Semantic tokens: **${semantic.length}** · component: **${component.length}** · primitives: **${primitive.length}**`,
  '',
  '## How to reference a token',
  '',
  '| Target | Syntax | Example |',
  '|---|---|---|',
  '| Plain CSS / any framework | `var(--ucsd-<path>)` | `var(--ucsd-color-action-primary)` |',
  '| Bootstrap 5 Sass | `$ucsd-<path>` | `$ucsd-color-action-primary` |',
  '| Tailwind / shadcn | utility class | `bg-action-primary` |',
  '| JS / React | `tokens[\'<path>\']` | `tokens[\'color.action.primary\']` |',
  '',
  '## Semantic tokens',
  '',
  'These are the tokens you should be using. They carry intent, and they change',
  'with light/dark mode automatically.',
  '',
];

for (const g of [...byGroup.keys()].sort()) {
  const isColor = g.startsWith('color');
  // Columns are declared once; the Dark column is spliced in for colour groups.
  const headers = ['Token', 'CSS variable', 'Tailwind',
    ...(isColor ? ['Light', 'Dark'] : ['Value']), 'Use for'];

  lines.push(`### \`${g}\``, '', row(headers), row(headers.map(() => '---')));

  for (const t of byGroup.get(g)) {
    lines.push(row([
      `\`${t.path}\``,
      `\`${t.cssVar}\``,
      tailwindHint(t),
      `\`${t.value}\``,
      ...(isColor ? [`\`${darkByPath.get(t.path)?.value ?? '—'}\``] : []),
      esc(t.description) || '—',
    ]));
  }
  lines.push('');
}

lines.push(
  '## Component tokens',
  '',
  'Only where a component needs a knob the semantic layer should not carry.',
  '',
  '| Token | CSS variable | Resolves to | Value |',
  '|---|---|---|---|',
  ...component.map((t) => `| \`${t.path}\` | \`${t.cssVar}\` | \`${t.reference ?? '—'}\` | \`${t.value}\` |`),
  '',
  '## Primitives — DO NOT USE DIRECTLY',
  '',
  'Listed only so you can recognise them. Referencing a primitive from a component',
  'hard-codes a brand decision and breaks dark mode. Always use a semantic token.',
  '',
  '<details><summary>Primitive palette</summary>',
  '',
  '| Token | Value |',
  '|---|---|',
  ...primitive.map((t) => `| \`${t.path}\` | \`${t.value}\` |`),
  '',
  '</details>',
  '',
);

// --- banned.json (fuels the validator) ---------------------------------------

// A literal value usually maps to several tokens (16px is both space.4 and
// text.md.size; #00629b is both color.action.primary and color.brand.blue).
// Suggesting the wrong one is worse than suggesting nothing, so the map is
// keyed by CATEGORY and each entry keeps ranked candidates.

/**
 * Preferred order when several semantic colours share a value.
 *
 * `theme.*` first because a raw brand hex in someone's CSS is almost always
 * reaching for the brand colour itself; `component.*` next because those are what
 * a control is actually made of. `status.*` last — it is a narrow signalling set
 * and suggesting it for a general colour would be misleading.
 */
const COLOR_RANK = [
  'color.theme', 'color.component', 'color.foreground', 'color.surface',
  'color.system', 'color.status',
];
const rankOf = (t) => {
  const i = COLOR_RANK.findIndex((p) => t.path.startsWith(p));
  return i === -1 ? COLOR_RANK.length : i;
};

const colorCandidates = {};
for (const t of light.filter((t) => t.tier === 'semantic' && t.type === 'color')) {
  const hex = String(t.value).toLowerCase();
  if (!/^#[0-9a-f]{3,8}$/.test(hex)) continue;
  (colorCandidates[hex] ??= []).push(t);
}
for (const hex of Object.keys(colorCandidates)) {
  colorCandidates[hex] = colorCandidates[hex]
    .sort((a, b) => rankOf(a) - rankOf(b))
    .map((t) => t.cssVar);
}

/** Hexes that exist only as primitives — real, but never the right thing to type. */
const primitiveHexes = [
  ...new Set(
    primitive
      .filter((t) => t.type === 'color')
      .map((t) => String(t.value).toLowerCase())
      .filter((h) => !colorCandidates[h]),
  ),
];

const dimsFor = (prefix) =>
  Object.fromEntries(
    light
      .filter((t) => t.path.startsWith(`${prefix}.`) && /^\d+px$/.test(String(t.value)))
      .map((t) => [String(t.value), t.cssVar]),
  );

const banned = {
  $comment: 'GENERATED. Literal values that must not appear in source — a token exists for each.',
  colors: colorCandidates,
  primitiveHexes,
  space: dimsFor('space'),
  radius: dimsFor('radius'),
  // Derived rather than hardcoded in validate.mjs, so a breakpoint change flows
  // through to the validator instead of needing a parallel manual edit.
  breakpoints: light
    .filter((t) => t.path.startsWith('breakpoint.'))
    .map((t) => String(t.value).replace(/px$/, '')),
  /**
   * Tailwind classes that compile without complaint and are still wrong.
   *
   * Both are verified against the real compiler in test/tailwind-compile.test.mjs
   * rather than assumed — they are exactly the kind of defect that reads as correct
   * in review and only shows up as a few pixels of drift in the browser.
   */
  tailwindClasses: {
    'max-w-prose':
      'max-w-[--ucsd-container-prose] — Tailwind hard-codes max-w-prose to 65ch and it ' +
      'wins over --container-prose (70ch); @utility cannot override it either',
    '2xl:':
      'xxl: — the UCSD scale names the widest breakpoint xxl, and 2xl is reset, so ' +
      '2xl: utilities silently never generate',
  },
  legacyDecoratorClasses: [
    'panel', 'panel-body', 'panel-heading', 'panel-default',
    'btn-default', 'glyphicon', 'img-responsive', 'hidden-xs', 'visible-xs',
    'col-xs-1', 'col-xs-2', 'col-xs-3', 'col-xs-4', 'col-xs-6', 'col-xs-12',
    'well', 'page-header', 'form-horizontal', 'control-label', 'input-lg', 'input-sm',
  ],
};

// --- llms.txt ----------------------------------------------------------------

const dosAndDonts = section(designMd, /Do's and Don'ts/);

const llmsTxt = `# UCSD Design System

> Token-first design system for UC San Diego. Successor to Decorator V5 (Bootstrap 3).
> Bootstrap 5 and Tailwind/shadcn are both first-class targets; they share tokens, not markup.

## Core rules

Extracted verbatim from [DESIGN.md](DESIGN.md), which is the canonical statement of them.

${dosAndDonts}

## Docs
- [DESIGN.md](DESIGN.md): **start here.** The visual identity — every semantic token with light and dark values, plus what UCSD should look and feel like.
- [Using it](docs/using/nextjs.md): per-stack setup — Next.js/React, Bootstrap 5, and everything else.
- [Token reference](skills/ucsd-design-system/references/generated/tokens.md): every token including primitives and component tokens, with CSS/Sass/Tailwind/JS syntax.
- [Skill entry point](skills/ucsd-design-system/SKILL.md): how to choose a stack, accessibility, and how to verify your output.
- [Layouts](docs/layouts/README.md): CMS page patterns — content, landing, listing.
- [Token naming contract](docs/token-naming-contract.md): the naming scheme and its rationale.
- [Figma → code](docs/figma.md): how design changes become code.
- [Architecture](docs/architecture.md): decisions and rejected alternatives.

## Optional
- [Migration from Decorator V5](docs/migration.md): Bootstrap 3 to 5 class mapping.
`;

// --- copy the agent-relevant docs into the skill ------------------------------
//
// These are authored once, under docs/, where a human finds them. The skill needs
// its own copies because it is published to the Skills Library standalone, where
// there is no repo around it (architecture D5).
//
// Relative links are flattened to backticked repo paths on the way in: a link like
// [x](../migration.md) resolves in docs/ and resolves nowhere in the skill, so
// carrying it across would manufacture broken links. A path an agent can look up
// is more useful there than a link that 404s.

/** [docs-relative source, name inside references/generated/] */
const COPY = [
  ['using/nextjs.md', 'using-nextjs.md'],
  ['using/bootstrap.md', 'using-bootstrap.md'],
  ['using/other.md', 'using-other.md'],
  ['accessibility.md', 'accessibility.md'],
  ['migration.md', 'migration.md'],
  ['layouts/README.md', 'layouts.md'],
];

const posix = (p) => p.split(path.sep).join('/');

const flattenLinks = (md, sourceDir) =>
  md.replace(/\[([^\]]+)\]\((?!https?:|#)([^)#]+)(#[^)]*)?\)/g, (_m, text, target) => {
    const resolved = posix(path.relative(REPO, path.resolve(REPO, sourceDir, target)));
    // Link text is very often already a path (`../migration.md`), and appending the
    // resolved path to it reads as a stutter. Replace outright in that case.
    const bare = text.replace(/`/g, '').trim();
    return /\.(md|json|mjs)$|\//.test(bare) ? `\`${resolved}\`` : `${text} (\`${resolved}\`)`;
  });

const copied = await Promise.all(
  COPY.map(async ([from, to]) => {
    const src = path.join(REPO, 'docs', from);
    const body = await fs.readFile(src, 'utf8').catch(() => {
      console.error(`\ngenerate-skill-references: docs/${from} is missing — update the COPY list.\n`);
      process.exit(1);
    });
    const rel = `docs/${from}`;
    const header =
      `<!-- COPY of ${rel} — do not edit here. Edit the source and run \`npm run build\`. -->\n\n`;
    return [to, header + flattenLinks(body, path.posix.dirname(rel))];
  }),
);

await fs.mkdir(GEN, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(GEN, 'tokens.md'), lines.join('\n'), 'utf8'),
  fs.writeFile(path.join(GEN, 'banned.json'), JSON.stringify(banned, null, 2) + '\n', 'utf8'),
  fs.writeFile(path.join(REPO, 'llms.txt'), llmsTxt, 'utf8'),
  ...copied.map(([name, body]) => fs.writeFile(path.join(GEN, name), body, 'utf8')),
]);

console.log(
  `skill references: ${semantic.length} semantic + ${component.length} component tokens, ` +
    `${copied.length} docs copied`,
);
