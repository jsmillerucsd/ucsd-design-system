/**
 * Contract tests for the build outputs.
 *
 * The whole promise of the system is that one token source reaches every
 * framework with the same value. These tests pin that promise end to end, so a
 * Style Dictionary or Bootstrap upgrade that quietly breaks a mapping fails here
 * rather than in someone's browser months later.
 *
 * Token names are the designer's, synced from Figma — see docs/token-naming-contract.md.
 *
 * Requires `npm run build` first.
 */

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOK = path.join(REPO, 'packages', 'tokens', 'dist');
const BS = path.join(REPO, 'packages', 'bootstrap', 'dist');

let tokensCss, tailwind, scss, manifest, darkManifest, bootstrapCss;

before(async () => {
  const read = (p) => fs.readFile(p, 'utf8').catch(() => {
    throw new Error(`${path.relative(REPO, p)} missing — run \`npm run build\` first.`);
  });
  [tokensCss, tailwind, scss, bootstrapCss] = await Promise.all([
    read(path.join(TOK, 'css', 'tokens.css')),
    read(path.join(TOK, 'tailwind', 'theme.css')),
    read(path.join(TOK, 'scss', '_tokens.scss')),
    read(path.join(BS, 'ucsd-bootstrap.css')),
  ]);
  manifest = JSON.parse(await read(path.join(TOK, 'tokens.json')));
  darkManifest = JSON.parse(await read(path.join(TOK, 'tokens.dark.json')));
});

const byPath = (m, p) => m.find((t) => t.path === p);

describe('the brand blue reaches every target', () => {
  const BLUE = '#00629b';

  test('resolves through all three colour tiers', () => {
    // brand -> primitive -> semantic. Each step is an alias, which is what makes a
    // rebrand a one-line change instead of a find-and-replace.
    assert.equal(byPath(manifest, 'brand.core.blue').value, BLUE);
    assert.equal(byPath(manifest, 'palette.core.blue.500').reference, '{brand.core.blue}');
    assert.equal(byPath(manifest, 'color.theme.secondary').reference, '{palette.core.blue.500}');
    assert.equal(byPath(manifest, 'color.theme.secondary').value, BLUE);
  });

  test('CSS custom property references the tier above, not a literal', () => {
    // outputReferences keeps the alias visible, which is what makes dark mode work.
    assert.match(tokensCss, /--ucsd-color-theme-secondary:\s*var\(--ucsd-palette-core-blue-500\)/);
    assert.match(tokensCss, /--ucsd-brand-core-blue:\s*#00629b/);
  });

  test('Sass carries a literal value (Bootstrap needs it at compile time)', () => {
    assert.match(scss, /\$ucsd-color-theme-secondary:\s*#00629b/);
  });

  test('Bootstrap compiles UCSD colours into its theme', () => {
    assert.match(bootstrapCss, /--bs-secondary:\s*#182b49/);
    assert.match(bootstrapCss, /--bs-primary:\s*#00629b/);
  });

  test('Tailwind exposes semantic colours as a utility namespace', () => {
    assert.match(tailwind, /--color-theme-secondary:\s*var\(--ucsd-color-theme-secondary\)/);
  });
});

describe('one spacing scale everywhere', () => {
  test('space.large is 20px', () => {
    assert.equal(byPath(manifest, 'space.large').value, '20px');
  });

  test('Bootstrap maps it to the numeric spacer key .p-4', () => {
    // The Figma scale is t-shirt sized; _bridge.scss maps it onto the numeric keys
    // Bootstrap users have muscle memory for.
    assert.match(bootstrapCss, /\.p-4\s*\{\s*padding:\s*20px/);
  });

  test('Tailwind maps it into the spacing namespace', () => {
    assert.match(tailwind, /--spacing-large:\s*var\(--ucsd-space-large\)/);
  });
});

describe('breakpoints match Bootstrap exactly', () => {
  // Code-owned, not from Figma: Figma has no breakpoint variables, and a mismatch
  // here produces bugs that take days to find. See tokens/code/layout.json.
  const EXPECTED = { sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1400px' };

  for (const [k, v] of Object.entries(EXPECTED)) {
    test(`breakpoint.${k} is ${v}`, () => {
      assert.equal(byPath(manifest, `breakpoint.${k}`).value, v);
    });
  }

  test('Bootstrap emits the same container query breakpoints', () => {
    for (const v of Object.values(EXPECTED)) {
      assert.ok(bootstrapCss.includes(`min-width: ${v}`), `Bootstrap CSS missing min-width: ${v}`);
    }
  });

  test('Tailwind breakpoints are literal values, never var()', () => {
    // CSS forbids custom properties in a media query condition, so a var() here
    // makes every responsive variant silently never match.
    for (const [k, v] of Object.entries(EXPECTED)) {
      assert.match(tailwind, new RegExp(`--breakpoint-${k}:\\s*${v};`));
    }
    assert.doesNotMatch(tailwind, /--breakpoint-[a-z]+:\s*var\(/);
  });
});

describe('Tailwind defaults are reset', () => {
  test('drops Tailwind\'s own palette and breakpoints', () => {
    // Without these, bg-blue-500 compiles and ignores dark mode, and Tailwind's
    // default 2xl (1536px) survives alongside our xxl (1400px).
    assert.match(tailwind, /--color-\*:\s*initial;/);
    assert.match(tailwind, /--breakpoint-\*:\s*initial;/);
  });
});

describe('dark mode', () => {
  test('tokens.css contains a dark selector block', () => {
    assert.match(tokensCss, /\[data-bs-theme="dark"\], \.dark, \[data-theme="dark"\]\s*\{/);
  });

  test('dark re-aliases the content surface to near-black', () => {
    assert.equal(byPath(manifest, 'color.surface.1').reference, '{palette.neutral.white}');
    assert.equal(byPath(darkManifest, 'color.surface.1').reference, '{palette.neutral.black}');
  });

  test('only semantic colours are redefined in dark mode', () => {
    // Primitives and brand hold one value per token; re-aliasing happens in the
    // semantic tier alone, which is what keeps the ramp a single source.
    const nonSemantic = darkManifest.filter((t) => !t.path.startsWith('color.'));
    assert.deepEqual(nonSemantic.map((t) => t.path), []);
  });
});

describe('tier discipline', () => {
  test('every semantic colour is an alias, never a literal', () => {
    const known = new Set(['color.foreground.card-border', 'color.foreground.surface-text-bg']);
    const literals = manifest
      .filter((t) => t.tier === 'semantic' && t.type === 'color' && t.reference === null)
      .map((t) => t.path)
      .filter((p) => !known.has(p));
    assert.deepEqual(literals, [],
      `semantic colours must alias a primitive: ${literals.join(', ')}`);
  });

  test('the brand tier holds literals', () => {
    const aliased = manifest.filter((t) => t.tier === 'brand' && t.reference !== null);
    assert.deepEqual(aliased.map((t) => t.path), []);
  });

  test('primitives and brand are not exposed as Tailwind utilities', () => {
    assert.ok(!/--color-palette-/.test(tailwind), 'primitives leaked into the Tailwind theme');
    assert.ok(!/--color-brand-/.test(tailwind), 'brand colours leaked into the Tailwind theme');
  });
});

describe('typography', () => {
  test('roles carry size and line-height together', () => {
    assert.equal(byPath(manifest, 'type.h1.font-size').value, '24px');
    assert.equal(byPath(manifest, 'type.h1.line-height').value, '29px');
  });

  test('size and line-height stay paired in Tailwind', () => {
    assert.match(tailwind, /--text-h1:\s*var\(--ucsd-type-h1-font-size\)/);
    assert.match(tailwind, /--text-h1--line-height:\s*var\(--ucsd-type-h1-line-height\)/);
  });

  test('font weights arrive as numbers, not Figma style names', () => {
    const weights = manifest.filter((t) => t.path.endsWith('.font-weight'));
    assert.ok(weights.length > 0, 'no font-weight tokens found');
    for (const w of weights) {
      assert.match(String(w.value), /^\d{3}$/, `${w.path} is "${w.value}", not a numeric weight`);
    }
  });
});
