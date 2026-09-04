/**
 * @jsmillerucsd/tokens build
 *
 * One DTCG source in `tokens/` -> five outputs, so cross-framework consistency is a
 * property of the build rather than of anyone's discipline.
 *
 *   dist/css/tokens.css       :root + dark-mode block. The universal fallback.
 *   dist/scss/_tokens.scss    compile-time Sass values for Bootstrap 5.
 *   dist/tailwind/theme.css   Tailwind v4 @theme mapping.
 *   dist/shadcn/theme.css     shadcn/ui variable bridge, layered on the above.
 *   dist/js/tokens.js|.d.ts   typed object for React / charts / canvas.
 *   dist/tokens.json          flat manifest -> feeds the docs + the Claude skill.
 *
 * Modes are handled by running Style Dictionary twice over different colour sources.
 * The light pass emits every token; the dark pass emits ONLY the re-aliased colours,
 * scoped to the dark selector. Because CSS output keeps references as `var()`,
 * component tokens such as --ucsd-button-primary-bg follow dark mode for free.
 */

import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tailwindTheme } from './formats/tailwind-theme.mjs';
import { shadcnTheme } from './formats/shadcn-theme.mjs';
import { COLLECTIONS } from '../../scripts/sync-figma.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const DIST = path.join(HERE, 'dist');

/** Style Dictionary paths need POSIX separators, including on Windows. */
const posix = (p) => p.split(path.sep).join('/');
const g = (...segs) => posix(path.join(REPO, ...segs));
const DIST_POSIX = posix(DIST);

const PREFIX = 'ucsd';

// Selectors that opt a subtree into dark mode. Shared with the Tailwind theme,
// which has to publish the same thing as a `dark:` variant.
import { DARK_SELECTOR } from './dark-selector.mjs';

/**
 * Mode-invariant sources. `tokens/figma/` is written by the Figma sync;
 * `tokens/code/` holds what Figma Variables cannot express (breakpoints, shadows,
 * easings) and the sync never touches. See tokens/README.md.
 */
const COMMON_SOURCES = [
  g('tokens', 'figma', 'brand.json'),
  g('tokens', 'figma', 'primitive.json'),
  g('tokens', 'figma', 'typography-weights.json'),
  g('tokens', 'figma', 'layout.json'),
  g('tokens', 'figma', 'layout-semantic.json'),
  g('tokens', 'figma', 'typography.json'),
  g('tokens', 'code', '*.json'),
];

const sourcesFor = (mode) => [...COMMON_SOURCES, g('tokens', 'figma', `semantic.${mode}.json`)];

/** Values are authored with units already (`16px`), so no size transforms are wanted. */
const TRANSFORMS = ['attribute/cti', 'name/kebab', 'color/css'];

const isDarkToken = (token) => posix(token.filePath).includes('/figma/semantic.dark.json');

/**
 * Which tier the manifest labels a token, read from the same COLLECTIONS table
 * the Figma sync writes the files from — one home, so a new collection cannot
 * default into the published tier by virtue of this file not knowing about it.
 * The by-mode colour files (semantic.light/dark.json) and code/ (engineering-
 * owned, semantic in nature) sit outside the table by design.
 */
const TIER_BY_FILE = new Map(
  Object.values(COLLECTIONS).filter((c) => c.file).map((c) => [c.file, c.publishTier]),
);

const tierOf = (filePath) => {
  const p = posix(filePath);
  if (!p.includes('/figma/')) return 'semantic';
  const base = p.split('/').at(-1);
  if (base.startsWith('semantic.')) return 'semantic';
  const tier = TIER_BY_FILE.get(base);
  if (!tier) {
    throw new Error(
      `build: no publish tier for tokens/figma/${base} — add its collection to ` +
      `COLLECTIONS in scripts/sync-figma.mjs.`,
    );
  }
  return tier;
};

/**
 * Every platform shares the same transforms and prefix; only the output directory
 * and file list differ. Declaring that once keeps the light and dark passes from
 * drifting apart when a transform is added.
 */
const platform = (dir, files) => ({
  transforms: TRANSFORMS,
  prefix: PREFIX,
  buildPath: `${DIST_POSIX}/${dir}`,
  files,
});

// ---------------------------------------------------------------------------
// Custom formats
// ---------------------------------------------------------------------------

/**
 * A DTCG alias, or null if the value is a literal. Same predicate as `isRef` in
 * scripts/validate-tokens.mjs — keep the two in step.
 */
const asReference = (v) => (typeof v === 'string' && /^\{[^}]+\}$/.test(v) ? v : null);

/** Flat manifest consumed by the docs site and `scripts/generate-skill-references.mjs`. */
const manifest = {
  name: 'json/ucsd-manifest',
  format: ({ dictionary }) =>
    JSON.stringify(
      dictionary.allTokens.map((t) => ({
        name: t.name,
        cssVar: `--${t.name}`,
        path: t.path.join('.'),
        tier: tierOf(t.filePath),
        type: t.$type ?? t.type ?? null,
        value: t.$value ?? t.value,
        reference: asReference(t.original?.$value ?? t.original?.value),
        description: t.$description ?? t.comment ?? null,
      })),
      null,
      2,
    ) + '\n',
};

/** ESM object + declaration file. Hand-rolled to keep identifiers predictable. */
const jsModule = {
  name: 'javascript/ucsd-esm',
  format: ({ dictionary }) => {
    const entries = dictionary.allTokens
      .map((t) => `  '${t.path.join('.')}': ${JSON.stringify(t.$value ?? t.value)},`)
      .join('\n');
    return `// GENERATED by @jsmillerucsd/tokens. Do not edit.\nexport const tokens = {\n${entries}\n};\n\nexport default tokens;\n`;
  },
};

const jsTypes = {
  name: 'typescript/ucsd-dts',
  format: ({ dictionary }) => {
    const keys = dictionary.allTokens.map((t) => `  '${t.path.join('.')}': string;`).join('\n');
    return `// GENERATED by @jsmillerucsd/tokens. Do not edit.\nexport declare const tokens: {\n${keys}\n};\nexport default tokens;\n`;
  },
};

for (const f of [tailwindTheme, shadcnTheme, manifest, jsModule, jsTypes]) {
  StyleDictionary.registerFormat(f);
}

// ---------------------------------------------------------------------------
// Passes
// ---------------------------------------------------------------------------

const lightPass = new StyleDictionary({
  source: sourcesFor('light'),
  log: { verbosity: 'default', warnings: 'warn' },
  platforms: {
    css: platform('css/', [{
      destination: '_root.css',
      format: 'css/variables',
      options: { selector: ':root', outputReferences: true },
    }]),
    scss: platform('scss/', [{
      destination: '_tokens.scss',
      format: 'scss/variables',
      // Bootstrap needs literal values at compile time to build its own maps,
      // so references are resolved here rather than emitted as var().
      options: { outputReferences: false },
    }]),
    tailwind: platform('tailwind/', [
      { destination: 'theme.css', format: 'css/ucsd-tailwind-theme' },
    ]),
    shadcn: platform('shadcn/', [
      { destination: 'theme.css', format: 'css/ucsd-shadcn-theme' },
    ]),
    js: platform('js/', [
      { destination: 'tokens.js',   format: 'javascript/ucsd-esm' },
      { destination: 'tokens.d.ts', format: 'typescript/ucsd-dts' },
    ]),
    manifest: platform('', [
      { destination: 'tokens.json', format: 'json/ucsd-manifest' },
    ]),
  },
});

const darkPass = new StyleDictionary({
  source: sourcesFor('dark'),
  // Warnings are disabled here for one specific, expected case: the dark block
  // references primitives that are filtered OUT of its own output because they
  // already live in :root from the light pass. Style Dictionary flags that as
  // "filtered out token references"; here it is the intended design, and the
  // resulting `var(--ucsd-palette-*)` resolves correctly at runtime.
  log: { verbosity: 'default', warnings: 'disabled' },
  platforms: {
    css: platform('css/', [{
      destination: '_dark.css',
      format: 'css/variables',
      filter: isDarkToken,
      options: { selector: DARK_SELECTOR, outputReferences: true },
    }]),
    // Dark-mode literals for Bootstrap's $*-dark variables ($ucsd-dark-*).
    // Bootstrap passes several of them through to-rgb() and into SVG data URIs
    // at compile time, where a var() reference cannot resolve — so the bridge
    // needs the dark values as Sass literals, exactly like the light ones.
    scss: {
      transforms: TRANSFORMS,
      prefix: 'ucsd-dark',
      buildPath: `${DIST_POSIX}/scss/`,
      files: [{
        destination: '_tokens-dark.scss',
        format: 'scss/variables',
        filter: isDarkToken,
        options: { outputReferences: false },
      }],
    },
    manifest: platform('', [
      { destination: 'tokens.dark.json', format: 'json/ucsd-manifest', filter: isDarkToken },
    ]),
  },
});

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

// maxRetries: Windows throws EBUSY when an editor, indexer or AV scanner holds a
// handle on dist/. Retrying briefly is the standard mitigation.
await fs.rm(DIST, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });

// The passes read disjoint sources and write disjoint files, so there is no
// ordering dependency between them.
await Promise.all([lightPass.buildAllPlatforms(), darkPass.buildAllPlatforms()]);

// Stitch the two CSS blocks into the single file consumers import.
const cssDir = path.join(DIST, 'css');
const [root, dark] = await Promise.all([
  fs.readFile(path.join(cssDir, '_root.css'), 'utf8'),
  fs.readFile(path.join(cssDir, '_dark.css'), 'utf8'),
]);

const banner = `/**
 * UCSD Design System tokens.
 * GENERATED by @jsmillerucsd/tokens — do not edit. Change values in Figma; see docs/figma.md.
 *
 * Dark mode activates under: ${DARK_SELECTOR}
 */
`;

const stripBanner = (s) => s.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '');

await fs.writeFile(
  path.join(cssDir, 'tokens.css'),
  `${banner}\n${stripBanner(root)}\n${stripBanner(dark)}`,
  'utf8',
);
await Promise.all([
  fs.rm(path.join(cssDir, '_root.css')),
  fs.rm(path.join(cssDir, '_dark.css')),
]);

// The one-line entry for the Tailwind/shadcn stack. The four imports and their
// ORDER are the whole consumer setup, and the order is load-bearing (the theme
// resets --color-* to initial, so the shadcn bridge must come after it) — baking
// it into one file removes the error class instead of documenting it.
await fs.writeFile(
  path.join(DIST, 'full.css'),
  `/**
 * UCSD Design System — the complete Tailwind v4 + shadcn/ui stack in one import:
 *
 *   @import "@jsmillerucsd/tokens/full";
 *
 * GENERATED by @jsmillerucsd/tokens — do not edit. Equivalent to the documented four
 * imports, in the only order that works. Not for Bootstrap sites (use
 * @ucsd/bootstrap) or non-Tailwind stacks (import @jsmillerucsd/tokens/css alone).
 */
@import "tailwindcss";
@import "./css/tokens.css";
@import "./tailwind/theme.css";
@import "./shadcn/theme.css";
`,
  'utf8',
);

const count = JSON.parse(await fs.readFile(path.join(DIST, 'tokens.json'), 'utf8')).length;
console.log(`\n@jsmillerucsd/tokens: built ${count} tokens -> ${path.relative(REPO, DIST)}`);
