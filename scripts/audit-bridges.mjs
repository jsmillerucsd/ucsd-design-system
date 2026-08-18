/**
 * Bridge coverage audit — the drift gate between Figma and the framework bridges.
 *
 * The sync guarantees tokens/ mirrors Figma, and the build guarantees every
 * mapping the bridges DO make points at a real token. What nothing guaranteed
 * until this script is the converse: that every published token actually LANDS
 * somewhere. That is exactly how the layout-semantic collection (button.radius,
 * grid.gap, icon.*) arrived from Figma, built green, and reached no framework.
 *
 * The contract enforced here:
 *
 *   Every published (semantic-tier) token is BOUND into at least one framework
 *   surface — a Bootstrap variable/rule, a Tailwind @theme namespace, or a
 *   shadcn slot — or carries a documented exception in
 *   tokens/bridge-exceptions.json.
 *
 * "At least one" rather than "all three" is deliberate: the three surfaces are
 * different shapes. Tailwind's @theme republishes whole namespaces, Bootstrap
 * binds only the variables its API has, and shadcn is a fixed slot contract.
 * Demanding per-target coverage would drown the signal in exceptions; demanding
 * at-least-one catches the failure that matters — a designer adds a token and
 * no engineer decides where it goes. Per-target detail still lands in the
 * coverage artifact for review.
 *
 * Detection is structural where structure exists: the Tailwind and shadcn
 * surfaces are generated from mappings their format modules export
 * (tailwindName / tailwindBoundPaths / shadcnTokenPaths), so the audit asks the
 * mappings rather than grepping the CSS they emit. Only the two hand-written
 * Bootstrap Sass files are scanned textually — there is no structure to query —
 * with comments stripped so prose mentioning a token does not count as binding.
 *
 * The exception ledger is self-cleaning, like tokens/known-issues.json: an entry
 * whose token no longer exists, or is now bound after all, is itself an error.
 *
 * Outputs packages/tokens/dist/coverage.json — machine-readable, one row per
 * published token with per-target booleans — for GitHub Actions to upload or
 * for any dashboard to consume. Exit 1 on any unbound, unexcepted token.
 *
 *   npm run audit:bridges     (CI runs it after the build)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tailwindName, tailwindBoundPaths } from '../packages/tokens/formats/tailwind-theme.mjs';
import { shadcnTokenPaths } from '../packages/tokens/formats/shadcn-theme.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(REPO, 'packages', 'tokens', 'dist');

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

const FILES = {
  bridge: path.join(REPO, 'packages', 'bootstrap', 'scss', '_bridge.scss'),
  ucsd: path.join(REPO, 'packages', 'bootstrap', 'scss', '_ucsd.scss'),
  bootstrapVars: path.join(REPO, 'node_modules', 'bootstrap', 'scss', '_variables.scss'),
  bootstrapVarsDark: path.join(REPO, 'node_modules', 'bootstrap', 'scss', '_variables-dark.scss'),
};

let manifest, src;
try {
  [manifest, ...src] = await Promise.all([
    readJson(path.join(DIST, 'tokens.json')),
    ...Object.values(FILES).map((f) => fs.readFile(f, 'utf8')),
  ]);
  src = Object.fromEntries(Object.keys(FILES).map((k, i) => [k, src[i]]));
} catch (e) {
  console.error(`\naudit-bridges: ${e.message}\n  Run \`npm ci\` and \`npm run build\` first.\n`);
  process.exit(1);
}

const stripComments = (s) => s.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

/** Token names ($ucsd-* or --ucsd-*) referenced by the hand-written Sass. */
const bootstrapBound = new Set(
  [...stripComments(src.bridge + src.ucsd).matchAll(/(?:\$|--)(ucsd-[a-z0-9-]+)/g)].map((m) => m[1]),
);

const shadcnBound = new Set(shadcnTokenPaths);

const boundIn = {
  bootstrap: (t) => bootstrapBound.has(t.name),
  tailwind: (t) => tailwindName({ path: t.path.split('.') }) !== null || tailwindBoundPaths.has(t.path),
  shadcn: (t) => shadcnBound.has(t.path),
};

// ---------------------------------------------------------------------------
// Coverage
// ---------------------------------------------------------------------------

/** Published tokens: the semantic tier (which includes the code-owned files). */
const published = manifest.filter((t) => t.tier === 'semantic');

const { exceptions = [] } = await readJson(path.join(REPO, 'tokens', 'bridge-exceptions.json'))
  .catch(() => ({}));
const exceptionByPath = new Map(exceptions.map((e) => [e.token, e]));

const problems = [];

const rows = published.map((t) => {
  const targets = Object.fromEntries(
    Object.entries(boundIn).map(([surface, test]) => [surface, test(t)]),
  );
  const anywhere = Object.values(targets).some(Boolean);
  const exception = exceptionByPath.get(t.path);

  let status;
  if (anywhere) {
    status = 'bound';
    if (exception) {
      problems.push(
        `bridge-exceptions.json excepts "${t.path}", but it is now bound. Delete the entry.`,
      );
    }
  } else if (exception) {
    status = 'excepted';
  } else {
    status = 'missing';
    problems.push(
      `${t.path} (--${t.name}) is bound in no framework surface. ` +
      `Map it in _bridge.scss / formats/*.mjs, or add a reasoned entry to tokens/bridge-exceptions.json.`,
    );
  }

  return {
    path: t.path,
    cssVar: t.cssVar,
    type: t.type,
    status,
    targets,
    ...(exception ? { reason: exception.reason } : {}),
  };
});

// The other half of the self-cleaning rule: an exception naming a token that no
// longer exists must be deleted ("now bound" is handled in the row pass above).
const publishedPaths = new Set(published.map((t) => t.path));
for (const e of exceptions) {
  if (!publishedPaths.has(e.token)) {
    problems.push(
      `bridge-exceptions.json excepts "${e.token}", which is not a published token. ` +
      `If it was renamed or removed, delete the entry.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Bootstrap variable existence — the no-op detector
//
// Every `$name:` assigned in _bridge.scss claims to override a Bootstrap
// variable, but Sass raises no error for a variable Bootstrap never reads, so a
// typo ships silently as a no-op ($progress-color and
// $list-group-action-hover-bg both did). Checked against Bootstrap's own
// _variables.scss, so a Bootstrap upgrade that renames a variable also fails
// here instead of silently un-theming a component.
// ---------------------------------------------------------------------------

const bootstrapVars = new Set(
  [...(src.bootstrapVars + src.bootstrapVarsDark).matchAll(/^\$([a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
);
for (const m of src.bridge.matchAll(/^\$([a-z0-9-]+)\s*:/gm)) {
  if (!bootstrapVars.has(m[1])) {
    problems.push(
      `_bridge.scss assigns $${m[1]}, which is not a Bootstrap variable — a silent no-op. ` +
      `Check the name against node_modules/bootstrap/scss/_variables.scss.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Artifact + report
// ---------------------------------------------------------------------------

const summary = {
  published: rows.length,
  bound: rows.filter((r) => r.status === 'bound').length,
  excepted: rows.filter((r) => r.status === 'excepted').length,
  missing: rows.filter((r) => r.status === 'missing').length,
  perTarget: Object.fromEntries(
    Object.keys(boundIn).map((s) => [s, rows.filter((r) => r.targets[s]).length]),
  ),
};

await fs.writeFile(
  path.join(DIST, 'coverage.json'),
  JSON.stringify({ summary, tokens: rows }, null, 2) + '\n',
  'utf8',
);

console.log(
  `audit-bridges: ${summary.published} published tokens — ` +
  `${summary.bound} bound (bootstrap ${summary.perTarget.bootstrap}, ` +
  `tailwind ${summary.perTarget.tailwind}, shadcn ${summary.perTarget.shadcn}), ` +
  `${summary.excepted} excepted, ${summary.missing} missing. -> dist/coverage.json`,
);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nSee tokens/bridge-exceptions.json and docs/figma.md §3.5.\n');
  process.exit(1);
}
console.log('✓ every published token is bound in a framework surface or carries a documented exception.');
