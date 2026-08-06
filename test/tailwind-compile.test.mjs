/**
 * Contract tests for the Tailwind and shadcn targets — against REAL compiled CSS.
 *
 * The Bootstrap target has always been testable because it ships a compiled
 * stylesheet. The Tailwind target does not: `theme.css` is a set of declarations
 * that only mean anything once Tailwind has run, so reading it proves nothing about
 * which utilities exist or what they resolve to. Every defect this file pins was
 * invisible to a source-level check and visible the moment the compiler ran:
 *
 *   - `p-4` / `rounded-md` silently compiling against Tailwind's own scales
 *   - `--font-weight-h1` and `--font-h1` colliding on `.font-h1`, family winning
 *   - shadcn slots having no bridge at all
 *
 * So these tests invoke the real Tailwind CLI over the real build output. Slower
 * than string matching, and the only thing that actually holds.
 *
 * Requires `npm run build` first.
 */

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const run = promisify(execFile);

/**
 * Located via its package.json rather than a hardcoded path, so workspace hoisting
 * can put it anywhere. Resolving the package itself does not work — it declares only
 * a `bin`, no main export.
 */
const tailwindCli = () => {
  const require_ = createRequire(pathToFileURL(path.join(REPO, 'package.json')));
  const pkg = require_.resolve('@tailwindcss/cli/package.json');
  return path.join(path.dirname(pkg), require_(pkg).bin.tailwindcss);
};
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOK = path.join(REPO, 'packages', 'tokens', 'dist');

/**
 * Utilities to compile. Tailwind only emits a class it has seen, so anything not
 * listed here simply will not appear and `css()` would report it as missing.
 */
const CANDIDATES = [
  // UCSD semantic utilities
  'bg-surface-1', 'bg-surface-2', 'text-foreground-body-text', 'border-foreground-card-border',
  'bg-component-btn-primary', 'text-component-btn-label-primary',
  'bg-component-btn-tertiary', 'text-component-btn-label-tertiary',
  'p-large', 'gap-small', 'rounded-rounded-2', 'shadow-2',
  'text-h1', 'text-body-md', 'font-h1', 'font-body',
  'max-w-base', 'md:p-large', 'xxl:p-large',
  // Tailwind's own scales, which must land on UCSD values
  'p-1', 'p-2', 'p-3', 'p-4', 'px-4', 'py-2', 'h-9', 'gap-2', 'rounded-md', 'rounded-lg', 'rounded-sm',
  // shadcn slots
  'bg-background', 'text-foreground', 'bg-primary', 'text-primary-foreground',
  'bg-secondary', 'text-secondary-foreground', 'bg-destructive', 'bg-muted',
  'text-muted-foreground', 'border-border', 'ring-ring', 'bg-card', 'bg-sidebar', 'bg-chart-1',
  // Must NOT compile
  'bg-blue-500', 'text-slate-700', 'bg-white', 'text-black', '2xl:p-large',
];

let out = '';
let dir = '';

/** The body of a generated rule, whitespace-collapsed. Empty string if absent. */
const css = (cls) => {
  const sel = `.${cls.replace(/([:])/g, '\\$1')} {`;
  const i = out.indexOf(sel);
  if (i === -1) return '';
  return out.slice(i + sel.length, out.indexOf('}', i)).replace(/\s+/g, ' ').trim();
};

const has = (cls) => css(cls) !== '';

/**
 * Follow a utility's var() chain through the compiled sheet until it reaches the
 * token layer.
 *
 * Utilities never point at `--ucsd-*` directly — Tailwind puts its own namespace
 * variable in between (`bg-surface-1` -> `--color-surface-1` -> `--ucsd-color-surface-1`),
 * and the shadcn bridge adds a slot hop on top of that. Asserting the whole chain
 * is what proves the mapping is wired end to end; matching the utility body alone
 * would pass even if the namespace variable pointed nowhere.
 */
const firstVar = (s) => s?.match(/var\((--[a-zA-Z0-9-]+)/)?.[1] ?? null;

let DEFS = new Map();

const chain = (cls) => {
  const seen = [];
  let name = firstVar(css(cls));
  while (name && !seen.includes(name)) {
    seen.push(name);
    if (name.startsWith('--ucsd-')) break;
    name = firstVar(DEFS.get(name));
  }
  return seen;
};

/** Asserts a utility resolves through to the given `--ucsd-*` custom property. */
const resolvesTo = (cls, ucsdVar) => {
  const path = chain(cls);
  assert.ok(
    path.includes(ucsdVar),
    `.${cls} should resolve to ${ucsdVar}, but its var() chain was ` +
      `${path.length ? path.join(' -> ') : '(no utility generated)'}`,
  );
};

before(async () => {
  for (const f of ['tailwind/theme.css', 'shadcn/theme.css', 'css/tokens.css']) {
    await fs.access(path.join(TOK, f)).catch(() => {
      throw new Error(`packages/tokens/dist/${f} missing — run \`npm run build\` first.`);
    });
  }

  // Scratch dir lives under the repo's node_modules rather than the OS temp dir, so
  // `@import "tailwindcss"` resolves by walking up to the repo's node_modules —
  // exactly the way it resolves in a consumer's app. From os.tmpdir() it cannot.
  dir = path.join(REPO, 'node_modules', '.cache', 'ucsd-tailwind-test');
  await fs.rm(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  await fs.mkdir(dir, { recursive: true });

  // Import order is the one the docs tell consumers to use. It matters: the
  // Tailwind theme resets --color-* to initial, so the shadcn bridge must land
  // after it or every shadcn slot is wiped.
  const posix = (p) => p.split(path.sep).join('/');
  await fs.writeFile(
    path.join(dir, 'input.css'),
    [
      '@import "tailwindcss";',
      `@import "${posix(path.join(TOK, 'css', 'tokens.css'))}";`,
      `@import "${posix(path.join(TOK, 'tailwind', 'theme.css'))}";`,
      `@import "${posix(path.join(TOK, 'shadcn', 'theme.css'))}";`,
      `@source inline("${CANDIDATES.join(' ')}");`,
    ].join('\n'),
    'utf8',
  );

  await run(process.execPath, [tailwindCli(), '-i', 'input.css', '-o', 'out.css'], { cwd: dir });
  out = await fs.readFile(path.join(dir, 'out.css'), 'utf8');

  // First definition wins, which is the light-mode one: the dark block restates the
  // same names later in the file and would otherwise shadow it here.
  DEFS = new Map();
  for (const [, name, value] of out.matchAll(/^\s*(--[a-zA-Z0-9-]+):\s*([^;]+);/gm)) {
    if (!DEFS.has(name)) DEFS.set(name, value);
  }
});

after(async () => {
  if (dir) await fs.rm(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
});

describe('UCSD utilities compile and resolve through the token layer', () => {
  test('semantic colours resolve to --ucsd-* rather than a literal', () => {
    // The var() indirection is what makes dark mode work with no `dark:` variant.
    // A literal here would mean the utility froze one mode in place.
    resolvesTo('bg-surface-1', '--ucsd-color-surface-1');
    resolvesTo('text-foreground-body-text', '--ucsd-color-foreground-body-text');
    resolvesTo('border-foreground-card-border', '--ucsd-color-foreground-card-border');
  });

  test('the tertiary button pair exists as utilities', () => {
    // DESIGN.md specifies three button treatments; docs referenced a tertiary pair
    // long before a token backed it, so both halves are pinned here.
    resolvesTo('bg-component-btn-tertiary', '--ucsd-color-component-btn-tertiary');
    resolvesTo('text-component-btn-label-tertiary', '--ucsd-color-component-btn-label-tertiary');
  });

  test('spacing, radius, shadow and container utilities generate', () => {
    resolvesTo('p-large', '--ucsd-space-large');
    resolvesTo('gap-small', '--ucsd-space-small');
    resolvesTo('rounded-rounded-2', '--ucsd-radius-rounded-2');
    resolvesTo('shadow-2', '--ucsd-elevation-2');
    resolvesTo('max-w-base', '--ucsd-container-base');
  });

  test('breakpoint variants come from the UCSD scale', () => {
    assert.ok(has('md:p-large'), 'md: variant should compile');
    assert.ok(has('xxl:p-large'), 'xxl: is the UCSD name for the widest breakpoint');
    assert.ok(!has('2xl:p-large'), "2xl: is Tailwind's name and is reset — docs must say xxl:");
  });
});

describe('type roles carry size, line height and weight together', () => {
  // DESIGN.md: "Every role carries its size AND its line height. They cannot be
  // mismatched." Weight rides along for the same reason.
  test('text-<role> sets all three', () => {
    const h1 = css('text-h1');
    assert.match(h1, /font-size: var\(--text-h1\)/);
    assert.match(h1, /line-height: var\(--tw-leading, var\(--text-h1--line-height\)\)/);
    assert.match(h1, /font-weight: var\(--tw-font-weight, var\(--text-h1--font-weight\)\)/);
  });

  test('font-<role> is the family, and does not strand the weight', () => {
    // Regression guard: Tailwind feeds ONE `font-*` utility from both --font-* and
    // --font-weight-*. Emitting both for h1 made the family win and the weight
    // unreachable. Weights now live on --text-<role>--font-weight instead.
    assert.match(css('font-h1'), /font-family: var\(--font-h1\)/);
    assert.doesNotMatch(css('font-h1'), /font-weight/);
    assert.ok(
      !out.includes('--font-weight-h1:'),
      '--font-weight-h1 must not be emitted; it collides with the font-family token on .font-h1',
    );
  });
});

describe('text does not fall back to serif', () => {
  // Brix Sans and Refrigerator Deluxe are licensed faces that nobody has installed
  // until the web licence is confirmed. A bare `font-family: 'Brix Sans'` therefore
  // resolves to the browser's default SERIF — so the Tailwind demo rendered in Times
  // while the Bootstrap page beside it, which has always appended a stack, looked
  // correct. Same tokens, wildly different pages.
  test('every font role carries a fallback stack', async () => {
    const theme = await fs.readFile(path.join(TOK, 'tailwind', 'theme.css'), 'utf8');
    const roles = [...theme.matchAll(/^\s*(--font-[a-z0-9-]+):\s*([^;]+);/gm)]
      .filter(([, name]) => !name.startsWith('--font-weight-'));

    assert.ok(roles.length > 0, 'no --font-* roles emitted at all');
    for (const [, name, value] of roles) {
      assert.match(
        value,
        /var\(--ucsd-type-fallback-(sans|display)\)/,
        `${name} has no fallback stack — it renders as serif wherever the UCSD faces are absent`,
      );
    }
  });

  test('the condensed display face falls back to a condensed stack', () => {
    // Classification is derived (a role whose face differs from the body face is a
    // display role), not hardcoded, so a face change in Figma carries through.
    resolvesTo('font-h1', '--ucsd-type-h1-font-family');
    assert.match(DEFS.get('--font-h1'), /--ucsd-type-fallback-display/);
    assert.match(DEFS.get('--font-body'), /--ucsd-type-fallback-sans/);
  });

  test('the document font is correct with no class on <body>', () => {
    // Tailwind's preflight reads --default-font-family, which reads --font-sans.
    // Bootstrap does the same job via $font-family-sans-serif; without this the two
    // frameworks disagree on what an unclassed paragraph looks like.
    assert.match(DEFS.get('--font-sans') ?? '', /--ucsd-type-body-font-family/);
    assert.match(DEFS.get('--default-font-family') ?? '', /--font-sans/);
  });

  test('Bootstrap and Tailwind degrade to the same stack', async () => {
    const bootstrap = await fs.readFile(
      path.join(REPO, 'packages', 'bootstrap', 'dist', 'ucsd-bootstrap.css'),
      'utf8',
    );
    const manifest = JSON.parse(await fs.readFile(path.join(TOK, 'tokens.json'), 'utf8'));
    const stack = manifest.find((t) => t.path === 'type.fallback.sans').value;

    // Sass strips the quotes the CSS custom property keeps, so compare on the faces.
    const faces = stack.split(',').map((s) => s.trim().replace(/^'|'$/g, ''));
    const bsLine = bootstrap.match(/--bs-font-sans-serif:\s*([^;]+);/)?.[1] ?? '';
    for (const face of faces) {
      assert.ok(
        bsLine.includes(face),
        `Bootstrap's fallback stack is missing "${face}" — it has drifted from type.fallback.sans`,
      );
    }
  });
});

describe("Tailwind's own scales are re-pointed at UCSD values", () => {
  // Every stock shadcn component ships with these classes. Unbridged they compile
  // against Tailwind's 4px base and 0.375rem radii — plausible, off-system, and
  // invisible in review.
  test('the numeric spacing scale is built on the UCSD 5px step', () => {
    assert.match(css('p-1'), /var\(--spacing\)/);
    assert.match(css('p-4'), /calc\(var\(--spacing\) \* 4\)/);
    assert.match(out, /--spacing:\s*var\(--ucsd-space-extra-small\)/);
  });

  test('p-1 through p-4 agree with Bootstrap .p-1 through .p-4', async () => {
    // DESIGN.md claims ".p-4 and space.large are the same value reached two ways".
    // 5px base x 4 = 20px = space.large = Bootstrap's $spacers 4. Pinned because it
    // is the one place the two frameworks can silently disagree by a few pixels.
    const manifest = JSON.parse(await fs.readFile(path.join(TOK, 'tokens.json'), 'utf8'));
    const val = (p) => manifest.find((t) => t.path === p).value;
    assert.equal(val('space.extra-small'), '5px');
    for (const [step, tokenPath] of [
      [1, 'space.extra-small'],
      [2, 'space.small'],
      [3, 'space.medium'],
      [4, 'space.large'],
    ]) {
      assert.equal(
        `${5 * step}px`,
        val(tokenPath),
        `Tailwind p-${step} must equal ${tokenPath}, which backs Bootstrap .p-${step}`,
      );
    }
  });

  test('rounded-sm/md/lg come from the UCSD radius scale', () => {
    assert.match(css('rounded-sm'), /var\(--radius-sm\)/);
    assert.match(out, /--radius-sm:\s*var\(--ucsd-radius-rounded-1\)/);
    assert.match(out, /--radius-md:\s*var\(--ucsd-radius-rounded-2\)/);
    assert.match(out, /--radius-lg:\s*var\(--ucsd-radius-rounded-3\)/);
  });
});

describe('off-system utilities do not compile at all', () => {
  test("Tailwind's palette is gone", () => {
    for (const cls of ['bg-blue-500', 'text-slate-700', 'bg-white', 'text-black']) {
      assert.ok(!has(cls), `${cls} must not compile — it is not a UCSD colour and ignores dark mode`);
    }
  });
});

describe('the shadcn bridge reaches shadcn components', () => {
  // Without this file a consumer runs `npx shadcn add button` and gets a component
  // bound to slots nothing defines. These assert the full chain:
  // utility -> shadcn slot -> UCSD token.
  test('every shadcn slot generates a utility', () => {
    for (const cls of [
      'bg-background', 'text-foreground', 'bg-primary', 'text-primary-foreground',
      'bg-secondary', 'text-secondary-foreground', 'bg-destructive', 'bg-muted',
      'text-muted-foreground', 'border-border', 'ring-ring', 'bg-card',
      'bg-sidebar', 'bg-chart-1',
    ]) {
      assert.ok(has(cls), `${cls} missing — the shadcn bridge did not survive compilation`);
    }
  });

  test('slots resolve through to UCSD tokens, not to a literal', () => {
    resolvesTo('bg-background', '--ucsd-color-surface-1');
    resolvesTo('bg-primary', '--ucsd-color-component-btn-secondary');
    resolvesTo('text-primary-foreground', '--ucsd-color-component-btn-label-secondary');
    resolvesTo('bg-destructive', '--ucsd-color-system-error');
    resolvesTo('border-border', '--ucsd-color-foreground-card-border');
    resolvesTo('bg-secondary', '--ucsd-color-component-btn-tertiary');
  });

  test('the bridge carries no .dark block', async () => {
    // Dark mode is a re-alias of the same semantic tokens. A .dark block here would
    // pin one mode and quietly defeat that.
    const bridge = await fs.readFile(path.join(TOK, 'shadcn', 'theme.css'), 'utf8');
    assert.ok(!/^\s*\.dark\s*[,{]/m.test(bridge), 'shadcn bridge must not define its own .dark block');
  });

  test('--radius is defined once, in the bridge only', async () => {
    const bridge = await fs.readFile(path.join(TOK, 'shadcn', 'theme.css'), 'utf8');
    const theme = await fs.readFile(path.join(TOK, 'tailwind', 'theme.css'), 'utf8');
    assert.match(bridge, /--radius:\s*var\(--ucsd-radius-rounded-2\)/);
    assert.ok(!/--radius:\s/.test(theme), '--radius belongs to the shadcn bridge, not theme.css');
  });
});

describe('the documented import order is the one that works', () => {
  test('shadcn slots survive the --color-*: initial reset', () => {
    // theme.css wipes the colour namespace. Imported in the wrong order the bridge
    // is erased and every shadcn component loses its colours — the exact failure
    // this suite exists to catch, so it is asserted rather than left to the docs.
    assert.ok(
      out.indexOf('--color-*: initial') === -1 || has('bg-background'),
      'the reset must come before the shadcn bridge',
    );
  });
});
