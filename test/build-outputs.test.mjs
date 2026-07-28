/**
 * Contract tests for the build outputs.
 *
 * The whole promise of the system is that one token source reaches every
 * framework with the same value. These tests pin that promise end to end, so a
 * Style Dictionary or Bootstrap upgrade that quietly breaks a mapping fails here
 * rather than in someone's browser months later.
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

  test('resolves in the manifest', () => {
    assert.equal(byPath(manifest, 'color.action.primary').value, BLUE);
  });

  test('CSS custom property references the primitive, not a literal', () => {
    // outputReferences keeps the alias visible, which is what makes dark mode work.
    assert.match(tokensCss, /--ucsd-color-action-primary:\s*var\(--ucsd-palette-blue-500\)/);
    assert.match(tokensCss, /--ucsd-palette-blue-500:\s*#00629b/);
  });

  test('Sass carries a literal value (Bootstrap needs it at compile time)', () => {
    assert.match(scss, /\$ucsd-color-action-primary:\s*#00629b/);
  });

  test('Bootstrap compiles it into --bs-primary and .btn-primary', () => {
    assert.match(bootstrapCss, /--bs-primary:\s*#00629b/);
    assert.match(bootstrapCss, /--bs-btn-bg:\s*#00629b/);
  });

  test('Tailwind exposes it as a utility namespace', () => {
    assert.match(tailwind, /--color-action-primary:\s*var\(--ucsd-color-action-primary\)/);
  });
});

describe('one spacing scale everywhere', () => {
  test('space.4 is 16px', () => {
    assert.equal(byPath(manifest, 'space.4').value, '16px');
  });

  test('Bootstrap .p-4 uses it', () => {
    assert.match(bootstrapCss, /\.p-4\s*\{\s*padding:\s*16px/);
  });

  test('Tailwind maps it into the spacing namespace', () => {
    assert.match(tailwind, /--spacing-4:\s*var\(--ucsd-space-4\)/);
  });
});

describe('breakpoints match Bootstrap exactly', () => {
  // A mismatch here produces bugs that take days to find, so it is pinned.
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

  test('dark re-aliases action.primary to a lighter blue', () => {
    assert.equal(byPath(darkManifest, 'color.action.primary').reference, '{palette.blue.300}');
  });

  test('component tokens inherit dark mode via var() indirection', () => {
    // This is the mechanism: button never needs a dark-mode entry of its own.
    assert.match(tokensCss, /--ucsd-button-primary-bg:\s*var\(--ucsd-color-action-primary\)/);
    assert.ok(!darkManifest.some((t) => t.path.startsWith('button.')),
      'button tokens should not be redefined in dark mode');
  });
});

describe('tier discipline', () => {
  test('every semantic colour is an alias, never a literal', () => {
    const literals = manifest
      .filter((t) => t.tier === 'semantic' && t.type === 'color' && t.reference === null)
      .map((t) => t.path);
    assert.deepEqual(literals, [], `semantic colours must alias primitives: ${literals.join(', ')}`);
  });

  test('primitives are not exposed as Tailwind utilities', () => {
    assert.ok(!/--color-palette-/.test(tailwind),
      'primitives leaked into the Tailwind theme — they would become bg-palette-* utilities');
  });
});

describe('type ramp', () => {
  test('size and line-height stay paired in Tailwind', () => {
    assert.match(tailwind, /--text-md:\s*var\(--ucsd-text-md-size\)/);
    assert.match(tailwind, /--text-md--line-height:\s*var\(--ucsd-text-md-line-height\)/);
  });
});
