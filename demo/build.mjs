/**
 * Builds the shadcn demo: bundles the page, then compiles its stylesheet.
 *
 * This exists because the demo previously tried to load Tailwind in the browser:
 *
 *   @import url("https://cdn.tailwindcss.com");
 *
 * That URL serves JavaScript, so the browser rejected it as a stylesheet and no
 * utility ever generated. `@theme { ... }` is likewise a compiler at-rule that a
 * browser ignores. The page therefore rendered entirely from hand-written inline
 * styles while appearing to demonstrate the token pipeline — and any class that
 * was NOT hand-rolled (the `bg-system-bg-*` alerts) silently rendered transparent.
 *
 * A demo that cannot fail is worse than no demo. This one is compiled from the
 * same dist/ files a consumer imports, in the same order the docs prescribe, so
 * what you see in the browser is what a Next.js app gets.
 *
 *   node demo/build.mjs   (or: npm run demo)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import * as esbuild from 'esbuild';

const run = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const TOK = path.join(REPO, 'packages', 'tokens', 'dist');
const OUT = path.join(HERE, 'dist');

const posix = (p) => p.split(path.sep).join('/');

for (const f of ['css/tokens.css', 'tailwind/theme.css', 'shadcn/theme.css']) {
  await fs.access(path.join(TOK, f)).catch(() => {
    console.error(`\ndemo: packages/tokens/dist/${f} missing.\n  Run \`npm run build:tokens\` first.\n`);
    process.exit(1);
  });
}

await fs.mkdir(OUT, { recursive: true });

/** One entry per demo page. Each pairs with the .html of the same name. */
export const PAGES = ['app', 'sidebar'];

// --- 0. Copy the Bootstrap kitchen-sink into demo/dist -----------------------
//
// The kitchen-sink lives in packages/bootstrap/ because that is where its CSS is
// built. Copying it here lets `demo/bootstrap.html` link a same-directory
// stylesheet, so all three demos are reachable from one place.
const bsSrc = path.join(REPO, 'packages', 'bootstrap', 'kitchen-sink.html');
const bsCssSrc = path.join(REPO, 'packages', 'bootstrap', 'dist', 'ucsd-bootstrap.css');
const bsCssOut = path.join(OUT, 'ucsd-bootstrap.css');
await fs.copyFile(bsCssSrc, bsCssOut);
await fs.writeFile(
  path.join(OUT, 'bootstrap.html'),
  (await fs.readFile(bsSrc, 'utf8')).replace('./dist/ucsd-bootstrap.css', './ucsd-bootstrap.css'),
  'utf8',
);

// --- 1. Bundle the pages -----------------------------------------------------
//
// esbuild only, no framework: the vendored shadcn components are ordinary React,
// and a bundler is all they need. Rendering in the browser rather than
// pre-rendering keeps the Radix behaviour (tab roving focus, dialog focus trap,
// sidebar rail collapse, off-canvas sheet) actually working, which is half of
// what makes them worth demonstrating.
await esbuild.build({
  entryPoints: PAGES.map((p) => path.join(HERE, `${p}.tsx`)),
  outdir: OUT,
  bundle: true,
  format: 'iife',
  jsx: 'automatic',
  target: 'es2022',
  minify: true,
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
});

// The exact stylesheet docs/using/nextjs.md gives consumers: the single full.css
// entry, which carries the four imports in the only order that works and
// shadcn's required base layer.
const input = path.join(OUT, 'input.css');
await fs.writeFile(
  input,
  [
    `@import "${posix(path.join(TOK, 'full.css'))}";`,
    // Scan the SOURCES, not dist/. The bundle is minified and would feed Tailwind
    // mangled candidates; the components' own class strings are what matter here.
    // One stylesheet serves both pages, so both trees have to be scanned.
    ...PAGES.map((p) => `@source "${posix(path.join(HERE, `${p}.tsx`))}";`),
    `@source "${posix(path.join(HERE, 'components'))}";`,
    `@source "${posix(path.join(HERE, 'blocks'))}";`,
    `@source "${posix(path.join(HERE, 'hooks'))}";`,
    `@source "${posix(path.join(HERE, 'shadcn.html'))}";`,
    `@source "${posix(path.join(HERE, 'sidebar.html'))}";`,
  ].join('\n'),
  'utf8',
);

// Located via its package.json rather than a hardcoded path, so workspace hoisting
// can put it anywhere. Resolving the package itself does not work — it declares only
// a `bin`, no main export.
const require_ = createRequire(pathToFileURL(path.join(REPO, 'package.json')));
const cliPkg = require_.resolve('@tailwindcss/cli/package.json');
const cli = path.join(path.dirname(cliPkg), require_(cliPkg).bin.tailwindcss);
const out = path.join(OUT, 'shadcn.css');

// Run from the repo so `@import "tailwindcss"` resolves out of the root node_modules,
// the same way it resolves in a consumer's app.
await run(process.execPath, [cli, '-i', input, '-o', out], { cwd: REPO });

const kb = async (p) => ((await fs.stat(p)).size / 1024).toFixed(1);
for (const p of PAGES) console.log(`demo: dist/${p}.js (${await kb(path.join(OUT, `${p}.js`))} kB)`);
console.log(`demo: dist/shadcn.css (${await kb(out)} kB)`);
console.log(`demo: dist/bootstrap.html + dist/ucsd-bootstrap.css (${await kb(bsCssOut)} kB)`);
console.log('demo: open demo/shadcn.html (component tour), demo/sidebar.html (sidebar-08), or demo/bootstrap.html (kitchen sink)');
