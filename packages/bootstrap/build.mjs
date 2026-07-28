/**
 * @ucsd/bootstrap build
 *
 * Compiles the Sass entry twice (expanded + compressed) and prepends the token
 * custom properties, so the CDN bundle is self-contained: one <link> gives a
 * consumer the tokens AND the Bootstrap theme, with dark mode working.
 *
 * Uses the Sass JS API rather than the CLI so the build behaves identically on
 * Windows and CI without shell quoting differences.
 */

import * as sass from 'sass';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const DIST = path.join(HERE, 'dist');
const ENTRY = path.join(HERE, 'scss', 'ucsd-bootstrap.scss');
const TOKENS_CSS = path.join(REPO, 'packages', 'tokens', 'dist', 'css', 'tokens.css');

try {
  await fs.access(TOKENS_CSS);
} catch {
  console.error('\n@ucsd/bootstrap: tokens not built.\n  Run `npm run build:tokens` first.\n');
  process.exit(1);
}

const tokensCss = await fs.readFile(TOKENS_CSS, 'utf8');

const loadPaths = [
  path.join(REPO, 'node_modules'),
  path.join(HERE, 'node_modules'),
  path.join(HERE, 'scss'),
];

await fs.mkdir(DIST, { recursive: true });

for (const [style, file] of [['expanded', 'ucsd-bootstrap.css'], ['compressed', 'ucsd-bootstrap.min.css']]) {
  const { css } = sass.compile(ENTRY, {
    style,
    loadPaths,
    quietDeps: true, // Bootstrap 5.3 emits Dart Sass @import deprecation noise
    silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
  });
  await fs.writeFile(path.join(DIST, file), `${tokensCss}\n${css}\n`, 'utf8');
  const kb = (Buffer.byteLength(tokensCss + css) / 1024).toFixed(1);
  console.log(`@ucsd/bootstrap: ${file} (${kb} kB)`);
}
