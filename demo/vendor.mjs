/**
 * Vendors shadcn/ui source into demo/ from shadcn's own registry.
 *
 * The demo has to render components we did not write, or it proves nothing. This
 * pulls them from the same registry `npx shadcn add` uses, resolves each item's
 * registryDependencies recursively, and commits the result so the demo builds
 * offline afterwards and anyone can read exactly what is being rendered.
 *
 * NOT EDITED after download, apart from import paths — shadcn's `@/...` aliases
 * assume a bundler config we deliberately do not have here. No class string,
 * variant or markup is touched. The whole claim being tested is that unmodified
 * shadcn output lands on-brand, so a "fix" applied here would be a fix applied to
 * the evidence.
 *
 *   npm run demo:vendor        (only when adding an item or upgrading)
 *
 * Prints the npm dependencies the downloaded set needs; install those yourself
 * rather than having a build script mutate package.json.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Registry style. Pinned: class strings are only meaningful within one style. */
const STYLE = 'new-york-v4';

/**
 * What to fetch. registryDependencies are resolved automatically, so this lists
 * only what the demo pages import directly.
 *
 *   shadcn.html  — the component tour
 *   sidebar.html — the sidebar-08 block, an application shell shadcn ships whole
 */
const ITEMS = [
  'accordion', 'alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card',
  'chart', 'checkbox', 'dialog', 'input', 'label', 'pagination', 'popover',
  'progress', 'radio-group', 'select', 'separator', 'skeleton', 'slider',
  'switch', 'table', 'tabs', 'textarea',
  'sidebar-08',
];

/** Registry file type -> directory under demo/. */
const DEST = {
  'registry:ui': path.join(HERE, 'components', 'ui'),
  'registry:hook': path.join(HERE, 'hooks'),
  'registry:lib': path.join(HERE, 'lib'),
};

/** Blocks keep their own folder so a page and its components stay together. */
const blockDir = (registryPath) => {
  const m = registryPath.match(/\/blocks\/([^/]+)\/(.*)$/);
  return m ? path.join(HERE, 'blocks', m[1], path.dirname(m[2])) : null;
};

const destFor = (file) =>
  blockDir(file.path) ?? DEST[file.type] ?? path.join(HERE, 'components', 'ui');

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

const deps = new Set();
const fetched = new Set();
const written = new Map(); // absolute path -> content

async function resolve(name) {
  if (fetched.has(name)) return;
  fetched.add(name);

  const url = `https://ui.shadcn.com/r/styles/${STYLE}/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`vendor: ${name} -> ${res.status} ${res.statusText} (${url})`);
    process.exitCode = 1;
    return;
  }
  const item = await res.json();
  for (const d of item.dependencies ?? []) deps.add(d);

  for (const file of item.files ?? []) {
    written.set(path.join(destFor(file), path.basename(file.path)), file.content);
  }

  // Sequential rather than parallel: the tree is small and the registry is a
  // courtesy, not an endpoint we should hammer.
  for (const d of item.registryDependencies ?? []) await resolve(d);
}

for (const item of ITEMS) await resolve(item);

// ---------------------------------------------------------------------------
// Rewrite import paths and write
// ---------------------------------------------------------------------------

/**
 * shadcn alias -> the directory it lands in here. Longest prefix wins, so the
 * blocks rule is checked before the bare `@/registry/<style>/` catch-all.
 */
const ALIASES = [
  [`@/registry/${STYLE}/blocks/`, path.join(HERE, 'blocks')],
  [`@/registry/${STYLE}/ui/`, DEST['registry:ui']],
  [`@/registry/${STYLE}/hooks/`, DEST['registry:hook']],
  [`@/registry/${STYLE}/lib/`, DEST['registry:lib']],
  ['@/components/ui/', DEST['registry:ui']],
  ['@/hooks/', DEST['registry:hook']],
  ['@/lib/', DEST['registry:lib']],
].sort((a, b) => b[0].length - a[0].length);

const posix = (p) => p.split(path.sep).join('/');

/** A relative specifier from `fromDir`, always prefixed so it is not a bare import. */
function relative(fromDir, target) {
  const rel = posix(path.relative(fromDir, target));
  return rel.startsWith('.') ? rel : `./${rel}`;
}

const BANNER = `// Vendored from the shadcn/ui registry (style: ${STYLE}) by demo/vendor.mjs.
// Do not edit. If this looks wrong, fix the token bridge, not this file.
`;

// A leftover alias means a rewrite rule is missing and the bundle will fail with a
// far less obvious error, so collect and fail here instead. Checked against the
// REWRITTEN source — testing the raw registry content flagged every file.
const leftovers = [];

for (const [file, content] of written) {
  const dir = path.dirname(file);
  let src = content;

  for (const [alias, targetDir] of ALIASES) {
    // Match only inside an import specifier, so nothing in a comment or a class
    // string can be rewritten by accident.
    src = src.replace(
      new RegExp(`(["'])${alias.replace(/[/@]/g, '\\$&')}([^"']+)\\1`, 'g'),
      (_, q, rest) => `${q}${relative(dir, path.join(targetDir, rest))}${q}`,
    );
  }

  if (/from\s+["']@\//.test(src)) leftovers.push(file);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, BANNER + src, 'utf8');
}

const byDir = [...written.keys()].reduce((m, f) => {
  const k = posix(path.relative(HERE, path.dirname(f)));
  return (m[k] = (m[k] ?? 0) + 1), m;
}, {});

for (const [dir, n] of Object.entries(byDir).sort()) console.log(`vendor: ${String(n).padStart(3)} file(s) -> demo/${dir}/`);
console.log(`vendor: npm dependencies needed — ${[...deps].sort().join(' ')}`);

if (leftovers.length) {
  console.error(`\nvendor: unrewritten @/ alias in:\n  ${leftovers.join('\n  ')}`);
  process.exitCode = 1;
}
