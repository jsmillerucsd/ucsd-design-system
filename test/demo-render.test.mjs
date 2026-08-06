/**
 * Renders the demo page and checks that what it emits actually compiles.
 *
 * The demo's whole claim is that UNMODIFIED shadcn/ui components land on UCSD
 * tokens. That claim is only worth something if something checks it, and reading
 * the source cannot: the class strings live inside shadcn's `cva` definitions and
 * only appear once the components render.
 *
 * So this renders the real component tree to HTML, collects every class it puts on
 * the page, and asserts each one exists in the compiled stylesheet. A class that
 * does not compile is invisible — the element simply has no styling — which is the
 * failure mode that made the first version of this demo look plausible while being
 * completely broken.
 *
 * Builds the demo itself, so it is self-contained and CI needs no extra step.
 */

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const run = promisify(execFile);
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMO = path.join(REPO, 'demo');

/**
 * The demo pages, each rendered and checked independently.
 *
 * `app` is a tour of components I arranged. `sidebar` is shadcn's sidebar-08 block
 * rendered whole — layout, composition and classes all theirs — which is the
 * stronger evidence and exercises the `--sidebar-*` slot family that the tour
 * never touches.
 */
const PAGES = [
  { name: 'app', importPage: "import { Page } from './app';" },
  // Blocks default-export their page, the way a Next.js route file would.
  { name: 'sidebar', importPage: "import Page from './blocks/sidebar-08/page';" },
];

/** page name -> rendered markup */
const rendered = new Map();
let css = '';

/**
 * Tailwind escapes every character outside [A-Za-z0-9_-] with a backslash, so a
 * class like `focus-visible:ring-ring/50` becomes `.focus-visible\:ring-ring\/50`.
 * The trailing-character check stops `p-3` matching `.p-3x-large`.
 */
const compiled = (cls) => {
  const needle = '.' + cls.replace(/[^a-zA-Z0-9_-]/g, (ch) => '\\' + ch);
  for (let i = css.indexOf(needle); i !== -1; i = css.indexOf(needle, i + 1)) {
    if (!/[A-Za-z0-9_\-\\]/.test(css[i + needle.length] ?? '')) return true;
  }
  return false;
};

const ENTITIES = { '&#x27;': "'", '&quot;': '"', '&gt;': '>', '&lt;': '<', '&amp;': '&' };
const decode = (s) => s.replace(/&(?:#x27|quot|gt|lt|amp);/g, (e) => ENTITIES[e]);

/**
 * Classes that are not Tailwind utilities and correctly generate no CSS.
 *
 * Two kinds, both correctly inert:
 *
 *   lucide-* / recharts-*   library targeting hooks stamped on rendered elements.
 *                           shadcn styles icons via `[&_svg]:` selectors instead.
 *   group / group/<name>    Tailwind MARKERS. They emit nothing themselves; they
 *   peer  / peer/<name>     exist so descendants can say `group-hover/<name>:...`,
 *                           and those variants do compile. Written to match only
 *                           the bare marker, so `group-hover:` still gets checked.
 *
 * Deliberately narrow. A broad pattern here would let a genuinely dead utility —
 * `text-white` is the live example — vanish into the exemption instead of failing.
 */
const NOT_UTILITIES = /^(lucide|recharts)(-|$)|^(group|peer)(\/|$)/;

const classesOn = (markup) =>
  new Set(
    [...markup.matchAll(/class="([^"]*)"/g)]
      .flatMap((m) => decode(m[1]).split(/\s+/))
      .filter((c) => c && !NOT_UTILITIES.test(c)),
  );

before(async () => {
  // Build first: the assertions compare rendered classes against THIS stylesheet,
  // so a stale one would report failures that are really just staleness.
  await run(process.execPath, [path.join(DEMO, 'build.mjs')], { cwd: REPO });
  css = await fs.readFile(path.join(DEMO, 'dist', 'shadcn.css'), 'utf8');

  // Rendered through react-dom/server rather than a headless browser: no browser to
  // install in CI, and the class strings are identical either way. CJS because
  // react-dom/server reaches for node built-ins that an ESM bundle cannot require.
  for (const { name, importPage } of PAGES) {
    const bundle = path.join(REPO, 'node_modules', '.cache', `ucsd-demo-ssr-${name}.cjs`);
    await esbuild.build({
      stdin: {
        contents:
          "import { renderToStaticMarkup } from 'react-dom/server';\n" +
          `${importPage}\n` +
          'export const html = renderToStaticMarkup(<Page />);\n',
        resolveDir: DEMO,
        loader: 'tsx',
      },
      outfile: bundle,
      bundle: true,
      format: 'cjs',
      platform: 'node',
      jsx: 'automatic',
      target: 'es2022',
      logLevel: 'error',
      define: { 'process.env.NODE_ENV': '"production"' },
    });

    rendered.set(name, createRequire(import.meta.url)(bundle).html);
  }
});

/** Slots each page must render, keyed by page. Sampled from what it composes. */
const EXPECTED_SLOTS = {
  app: [
    'button', 'card', 'alert', 'badge', 'table', 'tabs', 'separator',
    'input', 'label', 'progress', 'skeleton', 'avatar',
  ],
  // The block's own vocabulary. These come from sidebar.tsx, which we did not
  // write — if they stop appearing, the block was replaced by something else.
  sidebar: [
    'sidebar', 'sidebar-inset', 'sidebar-menu', 'sidebar-menu-button',
    'sidebar-group', 'sidebar-header', 'sidebar-footer', 'breadcrumb', 'separator',
  ],
};

describe('both demo pages render real components', () => {
  for (const { name } of PAGES) {
    test(`${name}: the page is built, not an empty shell`, () => {
      const markup = rendered.get(name);
      assert.ok(markup.length > 5_000, `${name} rendered only ${markup.length} chars`);
    });

    test(`${name}: shadcn components are present, by their own data-slot marks`, () => {
      // data-slot is shadcn's, not ours. If these are missing we are rendering
      // something else and every other assertion here is meaningless.
      for (const slot of EXPECTED_SLOTS[name]) {
        assert.ok(
          rendered.get(name).includes(`data-slot="${slot}"`),
          `no shadcn ${slot} rendered on ${name}`,
        );
      }
    });
  }

  test("shadcn's own variant classes reach the tour", () => {
    // Sampled from the vendored cva definitions. If these stop appearing, the
    // components were edited or replaced and the demo has stopped proving anything.
    const classes = classesOn(rendered.get('app'));
    for (const cls of ['bg-primary', 'text-primary-foreground', 'bg-secondary', 'border-input']) {
      assert.ok(classes.has(cls), `${cls} never rendered`);
    }
  });

  test('the block uses the sidebar slot family, not the page chrome', () => {
    // The point of including a block: --sidebar-* is a separate slot family in the
    // bridge, and nothing in the component tour exercises it.
    const classes = classesOn(rendered.get('sidebar'));
    const sidebarClasses = [...classes].filter((c) => /(^|:)(bg|text|border|ring)-sidebar/.test(c));
    assert.ok(
      sidebarClasses.length >= 3,
      `expected the block to use the sidebar slots, saw: ${sidebarClasses.join(' ') || 'none'}`,
    );
  });
});

describe('every class the components emit compiles', () => {
  for (const { name } of PAGES) {
    test(`${name}: no rendered class is missing from the stylesheet`, () => {
      const missing = [...classesOn(rendered.get(name))].filter((c) => !compiled(c));
      assert.deepEqual(
        missing,
        [],
        `these classes render on ${name} but generate no CSS, so they do nothing:\n  ` +
          missing.join('\n  '),
      );
    });
  }

  test('the counts are high enough to be meaningful', () => {
    // Guards against the check silently passing because a page rendered almost
    // nothing — an empty set trivially has no missing members.
    for (const [name, min] of [['app', 150], ['sidebar', 60]]) {
      const n = classesOn(rendered.get(name)).size;
      assert.ok(n > min, `${name} rendered only ${n} distinct classes`);
    }
  });
});

/** Every vendored file, across components, blocks and hooks. */
async function vendoredFiles() {
  const roots = ['components', 'blocks', 'hooks'].map((d) => path.join(DEMO, d));
  const out = [];
  const walk = async (dir) => {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else out.push(full);
    }
  };
  for (const r of roots) await walk(r);
  return out;
}

describe('the demo does not quietly edit shadcn', () => {
  test('every vendored file carries the provenance banner', async () => {
    const files = await vendoredFiles();
    assert.ok(files.length >= 20, `only ${files.length} vendored files`);
    for (const f of files) {
      assert.match(
        await fs.readFile(f, 'utf8'),
        /^\/\/ Vendored from the shadcn\/ui registry/,
        `${path.relative(DEMO, f)} is missing the vendor banner — hand-written or edited?`,
      );
    }
  });

  test('no UCSD token names leak into the vendored source', async () => {
    // The claim is that shadcn works UNMODIFIED. A --ucsd-* or a UCSD utility name
    // inside a vendored file would mean we quietly fixed the component instead of
    // the bridge, and the demo would be proving nothing.
    for (const f of await vendoredFiles()) {
      const src = await fs.readFile(f, 'utf8');
      const body = src.split('\n').slice(2).join('\n'); // skip the banner
      assert.doesNotMatch(
        body,
        /--ucsd-|ucsd-color-|surface-[1-5]\b/,
        `${path.relative(DEMO, f)} was edited to use UCSD tokens`,
      );
    }
  });

  test('the block is vendored whole, page and components together', async () => {
    // A block is evidence precisely because we did not compose it. Rebuilding its
    // layout by hand from its parts would quietly turn it back into my arrangement.
    const dir = path.join(DEMO, 'blocks', 'sidebar-08');
    await fs.access(path.join(dir, 'page.tsx'));
    const parts = await fs.readdir(path.join(dir, 'components'));
    assert.ok(parts.length >= 4, `sidebar-08 has only ${parts.length} component files`);
  });
});
