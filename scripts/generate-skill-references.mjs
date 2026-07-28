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
 *   skills/ucsd-design-system/references/generated/tokens.md   full token reference
 *   skills/ucsd-design-system/references/generated/banned.json machine-readable literals to reject
 *   llms.txt                                                   convention for non-Claude tools
 *   .ai/design-system-rules.md                                 Cursor / Copilot mirror
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
 * Used to derive the `.ai/` mirror from SKILL.md rather than duplicating its rules
 * in a string literal here. A hardcoded copy would drift the moment SKILL.md changed,
 * and CI would not notice — regenerating would reproduce the same stale text.
 * Throwing on a missing heading turns a silent drift into a build failure.
 */
function section(md, titlePattern) {
  const body = md
    .split(/^## /m)
    .slice(1)
    .find((part) => titlePattern.test(part.split('\n', 1)[0]));
  if (!body) {
    console.error(
      `\ngenerate-skill-references: no SKILL.md section matching ${titlePattern}.\n` +
      `  The .ai/ mirror is derived from SKILL.md — restore the heading or update this script.\n`,
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
  '> and run the sync; see `docs/figma-pipeline.md`.',
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

/** Preferred order when several semantic colours share a value. Brand last: it is rarely what you want. */
const COLOR_RANK = ['color.action', 'color.surface', 'color.text', 'color.border', 'color.status', 'color.brand'];
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
  legacyDecoratorClasses: [
    'panel', 'panel-body', 'panel-heading', 'panel-default',
    'btn-default', 'glyphicon', 'img-responsive', 'hidden-xs', 'visible-xs',
    'col-xs-1', 'col-xs-2', 'col-xs-3', 'col-xs-4', 'col-xs-6', 'col-xs-12',
    'well', 'page-header', 'form-horizontal', 'control-label', 'input-lg', 'input-sm',
  ],
};

// --- llms.txt ----------------------------------------------------------------

const llmsTxt = `# UCSD Design System

> Token-first design system for UC San Diego. Successor to Decorator V5 (Bootstrap 3).
> Bootstrap 5 and Tailwind/shadcn are both first-class targets; they share tokens, not markup.

## Core rules
- Never write a raw hex colour or raw px spacing. Use a semantic token.
- Never reference a primitive (\`palette.*\`) from a component. Use a semantic token.
- Dark mode is automatic when you use semantic tokens. Do not write \`dark:\` overrides for colour.
- Breakpoints are Bootstrap 5's: 576 / 768 / 992 / 1200 / 1400.
- Every page needs a skip link, one \`<h1>\`, and a visible focus ring.

## Docs
- [Token reference](skills/ucsd-design-system/references/generated/tokens.md): every token, light + dark values, and how to reference it from CSS, Sass, Tailwind or JS.
- [Skill entry point](skills/ucsd-design-system/SKILL.md): how to choose a stack and the hard rules.
- [Layouts](layouts/README.md): CMS page patterns — content, landing, listing, article, section.
- [Token naming contract](docs/token-naming-contract.md): the naming scheme and its rationale.
- [Figma pipeline](docs/figma-pipeline.md): how design changes become code.
- [Architecture](docs/architecture.md): decisions and rejected alternatives.

## Optional
- [Migration from Decorator V5](docs/migration-decorator-v5.md): Bootstrap 3 to 5 class mapping.
`;

// --- .ai mirror for non-Claude tools -----------------------------------------
// Sections are lifted verbatim from SKILL.md so the two can never disagree.

const skillMd = await fs.readFile(path.join(SKILL_DIR, 'SKILL.md'), 'utf8');

const aiRules = `# UCSD Design System — rules for AI code assistants

Mirror of \`skills/ucsd-design-system/SKILL.md\` for tools that read \`.ai/\` (Cursor, Copilot).
GENERATED — do not edit. Source of truth is SKILL.md; the sections below are extracted
from it verbatim by \`scripts/generate-skill-references.mjs\`.

Full token reference: \`../skills/ucsd-design-system/references/generated/tokens.md\`

## Pick the target

${section(skillMd, /Pick the target/)}

## Hard rules

${section(skillMd, /Hard rules/)}

## Verify your own output

${section(skillMd, /Verify your own output/)}
`;

await fs.mkdir(GEN, { recursive: true });
await fs.mkdir(path.join(REPO, '.ai'), { recursive: true });
await Promise.all([
  fs.writeFile(path.join(GEN, 'tokens.md'), lines.join('\n'), 'utf8'),
  fs.writeFile(path.join(GEN, 'banned.json'), JSON.stringify(banned, null, 2) + '\n', 'utf8'),
  fs.writeFile(path.join(REPO, 'llms.txt'), llmsTxt, 'utf8'),
  fs.writeFile(path.join(REPO, '.ai', 'design-system-rules.md'), aiRules, 'utf8'),
]);

console.log(
  `skill references: ${semantic.length} semantic + ${component.length} component tokens documented`,
);
