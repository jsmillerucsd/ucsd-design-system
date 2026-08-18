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
    // $primary = btn.primary (Yellow #ffcd00), $secondary = btn.secondary (Blue
    // #00629b) — per DESIGN.md components block.
    assert.match(bootstrapCss, /--bs-primary:\s*#ffcd00/);
    assert.match(bootstrapCss, /--bs-secondary:\s*#00629b/);
  });

  test('Tailwind exposes semantic colours as a utility namespace', () => {
    assert.match(tailwind, /--color-theme-secondary:\s*var\(--ucsd-color-theme-secondary\)/);
  });
});

describe('one spacing scale everywhere', () => {
  test('space.md-16 is 16px', () => {
    assert.equal(byPath(manifest, 'space.md-16').value, '16px');
  });

  test('Bootstrap maps it to the numeric spacer key .p-4', () => {
    // The Figma scale is numeric (4px base); _bridge.scss maps it onto the numeric
    // keys Bootstrap users have muscle memory for.
    assert.match(bootstrapCss, /\.p-4\s*\{\s*padding:\s*16px/);
  });

  test('Tailwind maps it into the spacing namespace', () => {
    assert.match(tailwind, /--spacing-md-16:\s*var\(--ucsd-space-md-16\)/);
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
    const known = new Set([
      'color.foreground.card-border',
      'color.foreground.surface-text-bg',
      'color.component.card.semi-transparent-blue',
      'color.component.card.semi-transparent-navy',
    ]);
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

describe('the body role reaches both targets', () => {
  // DESIGN.md typography block: body copy is body-md (18px/23px). Bootstrap
  // compiles $font-size-base from the token (÷16 -> rem); Tailwind sets <body>
  // in a base layer from the same two tokens. Neither may fall back to the
  // browser's 16px default.
  test('Bootstrap body is body-md, in rem', () => {
    assert.match(bootstrapCss, /--bs-body-font-size:\s*1\.125rem/);
  });

  test('Tailwind sets body from the body-md tokens', () => {
    assert.match(tailwind, /body\s*\{\s*font-size:\s*var\(--ucsd-type-body-md-font-size\);\s*line-height:\s*var\(--ucsd-type-body-md-line-height\)/);
  });

  // Stock text-* re-pointing is asserted through the real compiler in
  // test/tailwind-compile.test.mjs (resolvesTo('text-base', ...)).
});

describe('Bootstrap surfaces follow the Sand rules', () => {
  test('the card header cap is not a surface change', () => {
    // DESIGN.md: "a card is differentiated by its border and padding, not by a
    // surface change." A Sand cap was the mechanical tinting the Sand rules
    // forbid, and disagreed with the shadcn card.
    assert.match(bootstrapCss, /--bs-card-cap-bg:\s*transparent/);
  });

  test("Bootstrap's gray ramp is the designer's ramp", () => {
    // $gray-600 backs most of Bootstrap's derived muted colours; stock it is
    // the blue-tinted #6c757d. palette.neutral.gray.500 is the designed step.
    assert.match(bootstrapCss, /--bs-gray-600:\s*#747678/);
    assert.ok(!bootstrapCss.includes('#6c757d'), "stock Bootstrap gray-600 survived in the bundle");
  });

  test('component surfaces re-alias in dark mode', () => {
    // The regression this guards: a component variable bound to a Sass LITERAL
    // compiles the light value into .card { --bs-card-bg: #ffffff } and stays
    // white in dark mode — the token layer's dark selector can never reach it.
    // Bound as var(--ucsd-*), the cascade resolves it to the dark literal.
    // This resolves each variable exactly as a dark-mode browser would.
    // Comments stripped first: the tokens.css banner mentions the dark selector
    // in prose, which would otherwise classify the first :root block as dark.
    // Last declaration wins, like the cascade.
    const stripped = bootstrapCss.replace(/\/\*[\s\S]*?\*\//g, '');
    const defs = { light: new Map(), dark: new Map() };
    for (const [, sel, body] of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const mode = /data-bs-theme="dark"|\.dark/.test(sel) ? 'dark'
        : /:root/.test(sel) ? 'light' : null;
      if (!mode) continue;
      for (const [, n, v] of body.matchAll(/(--ucsd-[a-z0-9-]+):\s*([^;]+);/g)) {
        defs[mode].set(n, v.trim());
      }
    }
    const resolve = (v, depth = 0) => {
      const ref = String(v).match(/var\((--ucsd-[a-z0-9-]+)/)?.[1];
      if (!ref || depth > 8) return v;
      return resolve(defs.dark.get(ref) ?? defs.light.get(ref), depth + 1);
    };
    const darkVal = (p) => darkManifest.find((t) => t.path === p).value;

    for (const [bsVar, tokenPath] of [
      ['--bs-card-bg', 'color.surface.1'],
      ['--bs-dropdown-bg', 'color.surface.1'],
      ['--bs-list-group-bg', 'color.surface.1'],
      ['--bs-popover-bg', 'color.surface.1'],
      ['--bs-toast-bg', 'color.surface.1'],
      ['--bs-table-striped-bg', 'color.surface.5'],
      ['--bs-accordion-active-bg', 'color.surface.2'],
    ]) {
      const decl = bootstrapCss.match(new RegExp(`${bsVar}:\\s*([^;]+);`))?.[1];
      assert.ok(decl, `${bsVar} not found in the bundle`);
      assert.equal(resolve(decl), darkVal(tokenPath),
        `${bsVar} must resolve to the dark ${tokenPath} literal in dark mode`);
    }
  });

  test("Bootstrap's own dark block carries the dark token literals", () => {
    // $enable-dark-mode emits [data-bs-theme=dark] from the $*-dark variables.
    // Stock, that is a second gray palette fighting the token layer; bound,
    // it must equal the dark manifest exactly.
    const darkBody = darkManifest.find((t) => t.path === 'color.foreground.body-text').value;
    const block = bootstrapCss.slice(bootstrapCss.indexOf('[data-bs-theme=dark]'));
    assert.ok(block.includes(`--bs-body-color: ${darkBody}`),
      `dark --bs-body-color should be ${darkBody} (the dark token literal)`);
  });
});

describe('per-role heading fidelity in Bootstrap', () => {
  // Bootstrap has ONE $headings-font-family (the display face, from h1); the
  // Figma roles put h2/h4/h5 in the working face. _ucsd.scss overrides them.
  test('h2 is the working face, not the display face', () => {
    assert.match(bootstrapCss, /h2,\s*\.h2\s*\{\s*font-family:\s*Brix Sans/);
  });

  test('h3 carries its own designed weight', () => {
    assert.match(bootstrapCss, /h3,\s*\.h3\s*\{\s*font-weight:\s*900/);
  });
});

describe('the layout-semantic collection is bound', () => {
  test('button.radius reaches the Bootstrap button', () => {
    assert.equal(byPath(manifest, 'button.radius').reference, '{radius.rounded-8}');
    assert.match(bootstrapCss, /--bs-btn-border-radius:\s*8px/);
  });

  test('grid.gap reaches Bootstrap CSS grid', () => {
    assert.match(bootstrapCss, /\.grid\s*\{\s*--bs-gap:\s*var\(--ucsd-grid-gap\)/);
  });

  test('icon sizes reach the Tailwind spacing namespace', () => {
    assert.match(tailwind, /--spacing-icon-sm-8:\s*var\(--ucsd-icon-sm-8\)/);
  });
});

describe('motion defaults are on-system', () => {
  test('Tailwind default transition and easings come from the motion tokens', () => {
    assert.match(tailwind, /--default-transition-duration:\s*var\(--ucsd-motion-duration-base\)/);
    assert.match(tailwind, /--ease-out:\s*var\(--ucsd-motion-easing-enter\)/);
    assert.match(tailwind, /--ease-in:\s*var\(--ucsd-motion-easing-exit\)/);
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
