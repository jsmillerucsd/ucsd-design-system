/**
 * figma-export/ -> tokens/figma/
 *
 * Ingests Figma's NATIVE variable export ("right-click a collection -> Export
 * modes"), which downloads as a ZIP per collection containing one DTCG-ish file
 * per mode. Drop the raw ZIPs (or extracted folders) in figma-export/ and run:
 *
 *   npm run sync:figma
 *
 * WHY THIS SHAPE. Figma resolves every `$value` to a literal and records the alias
 * separately under `$extensions["com.figma.aliasData"]`. A naive reader would
 * therefore flatten the whole system into hex codes and destroy the ability to
 * rebrand or theme. This script reads the alias data back and reconstructs real
 * DTCG references, so `tokens/` keeps the tier structure the designer authored.
 *
 * The designer never runs this. He exports from Figma and hands over the ZIPs;
 * a maintainer drops them in figma-export/ and runs the command.
 */

import { promises as fs } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IN = path.join(REPO, 'figma-export');
const OUT = path.join(REPO, 'tokens', 'figma');

// ---------------------------------------------------------------------------
// The contract with the Figma file
// ---------------------------------------------------------------------------

/**
 * Figma collection -> where its tokens land and what they are called.
 *
 * `root` namespaces each collection so the tiers cannot collide. They otherwise
 * would: `colors-brand` and `colors-primitive` both define `neutral/black`, and
 * Style Dictionary merges every source into one tree.
 */
const COLLECTIONS = {
  'colors-brand':         { file: 'brand.json',              root: 'brand',  tier: 'brand' },
  'colors-primitive':     { file: 'primitive.json',          root: 'palette', tier: 'primitive' },
  'colors-semantic':      { file: null,                      root: 'color',  tier: 'semantic', byMode: true },
  'layout-primitive':     { file: 'layout.json',             root: null,     tier: 'primitive' },
  'layout-semantic':      { file: 'layout-semantic.json',    root: null,     tier: 'semantic' },
  'typography-primitive': { file: 'typography-weights.json', root: 'weight', tier: 'primitive', numberType: 'fontWeight' },
  'typography-semantic':  { file: 'typography.json',         root: 'type',   tier: 'semantic',  numberType: 'fontWeight', leafSuffix: 'font-weight' },
};

/** Mode name -> the suffix used in tokens/figma/semantic.<mode>.json. */
const MODES = { 'light mode': 'light', 'dark mode': 'dark' };

/**
 * The `layout-primitive` collection has `spacing` at the root. Renaming here
 * keeps the emitted CSS variables reading like the rest of the system
 * (`--ucsd-space-large`, not `--ucsd-spacing-large`).
 */
const LAYOUT_RENAME = { spacing: ['space'] };

/**
 * Figma stores font weight as the typeface's style name. CSS needs a number.
 * Unmapped names are an error rather than a guess — shipping the wrong weight
 * silently is worse than failing the sync.
 */
const FONT_WEIGHTS = {
  thin: 100, extralight: 200, light: 300, regular: 400, normal: 400, book: 400,
  medium: 500, semibold: 600, demibold: 600, bold: 700, heavy: 800, extrabold: 800,
  black: 900, ultra: 900,
};

/** Typography leaves that are ratios or offsets, not lengths. */
const UNITLESS = new Set(['font-weight']);

/** Leaf renames. Figma has `fontsize` next to `line-height`; pick one convention. */
const LEAF_RENAME = { fontsize: 'font-size' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Lowercase, spaces to hyphens, drop anything that is not [a-z0-9-]. */
const slug = (s) =>
  String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/**
 * `navy/navy-500` -> `navy/500`, `gray/Gray-50` -> `gray/50`.
 *
 * Figma repeats the group name in each leaf. Carried through verbatim it produces
 * `--ucsd-palette-primary-navy-navy-500`, which is nobody's idea of a public API.
 * Stripping a leaf's redundant group prefix is purely mechanical and reversible.
 */
function collapseRepeats(segs) {
  return segs.map((seg, i) => {
    const parent = segs[i - 1];
    return parent && seg.startsWith(`${parent}-`) ? seg.slice(parent.length + 1) : seg;
  });
}

const segmentsOf = (figmaName) => collapseRepeats(figmaName.split('/').map(slug));

const setDeep = (obj, segs, value) => {
  let node = obj;
  for (const s of segs.slice(0, -1)) node = node[s] ??= {};
  node[segs.at(-1)] = value;
};

/** Stable key order so a re-sync produces a readable diff, not a reshuffle. */
export const sortDeep = (o) =>
  o && typeof o === 'object' && !Array.isArray(o)
    ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortDeep(o[k])]))
    : o;

/** Walk a DTCG tree, yielding [pathSegments, tokenObject] for every leaf. */
function* leaves(node, trail = []) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      if ('$value' in value) yield [[...trail, key], value];
      else yield* leaves(value, [...trail, key]);
    }
  }
}

// ---------------------------------------------------------------------------
// Transform (pure — exported for tests)
// ---------------------------------------------------------------------------

/**
 * @param {Array<{collection: string, mode: string, tree: object}>} inputs
 * @returns {{files: Map<string, object>, problems: string[], warnings: string[]}}
 *
 * Two classes, deliberately separated:
 *
 *   problems  the export cannot be read at all (unknown collection or mode, an
 *             alias into a collection that was not exported). Nothing is written,
 *             because a half-synced tokens/ is harder to recover from than none.
 *   warnings  the export is readable but the Figma file has a defect. These are
 *             printed loudly and the sync still writes, because POLICY is
 *             scripts/validate-tokens.mjs's job — it already gates the PR on
 *             aliasing, mode parity and contrast. Duplicating the rule here would
 *             mean a designer's mistake blocks the pipeline instead of failing the
 *             check that exists to describe it.
 */
export function transform(inputs) {
  const files = new Map();
  const problems = [];
  const warnings = [];

  /** Rewrite a Figma alias target into a DTCG reference in our namespace. */
  const referenceTo = (alias) => {
    const spec = COLLECTIONS[alias.targetVariableSetName];
    if (!spec) return null;
    let segs = segmentsOf(alias.targetVariableName);
    // layout-primitive renames its `spacing` group to `space` (see LAYOUT_RENAME
    // below). A reference written from the Figma-side name would not resolve, so
    // apply the same rename when the target is that collection.
    if (alias.targetVariableSetName === 'layout-primitive') {
      const rename = LAYOUT_RENAME[segs[0]];
      if (rename) segs = [...rename, ...segs.slice(1)];
    }
    return `{${[spec.root, ...segs].filter(Boolean).join('.')}}`;
  };

  for (const { collection, mode, tree } of inputs) {
    const spec = COLLECTIONS[collection];
    if (!spec) {
      problems.push(`Unknown collection "${collection}". Add it to COLLECTIONS in scripts/sync-figma.mjs.`);
      continue;
    }

    let file = spec.file;
    if (spec.byMode) {
      const key = MODES[mode.trim().toLowerCase()];
      if (!key) {
        problems.push(
          `Collection "${collection}" has mode "${mode}", which the build has no home for. ` +
          `Expected "Light mode" or "Dark mode".`,
        );
        continue;
      }
      file = `semantic.${key}.json`;
    }

    const out = files.get(file) ?? {};
    files.set(file, out);

    for (const [rawSegs, token] of leaves(tree)) {
      let segs = collapseRepeats(rawSegs.map(slug)).map((s) => LEAF_RENAME[s] ?? s);

      if (collection === 'layout-primitive') {
        const rename = LAYOUT_RENAME[segs[0]];
        if (rename) segs = [...rename, ...segs.slice(1)];
      } else if (spec.root) {
        segs = [spec.root, ...segs];
      }

      if (spec.leafSuffix) {
        segs = [...segs, spec.leafSuffix];
      }

      const name = segs.join('.');
      const alias = token.$extensions?.['com.figma.aliasData'];
      let reference = alias ? referenceTo(alias) : null;

      if (alias && !reference) {
        problems.push(`"${name}" aliases collection "${alias.targetVariableSetName}", which was not exported. Export it too.`);
        continue;
      }

      // Same-collection alias: Figma resolves these to a DTCG reference string in
      // $value but omits aliasData (only cross-collection aliases get it). Rewrite
      // with this collection's root and segment collapsing so it resolves in our tree.
      if (!reference && typeof token.$value === 'string' && /^\{[^}]+\}$/.test(token.$value)) {
        const inner = token.$value.slice(1, -1);
        let refSegs = collapseRepeats(inner.split('.').map(slug));
        if (collection === 'layout-primitive') {
          const rename = LAYOUT_RENAME[refSegs[0]];
          if (rename) refSegs = [...rename, ...refSegs.slice(1)];
        }
        reference = `{${[spec.root, ...refSegs].filter(Boolean).join('.')}}`;
      }

      let value;
      let type;

      if (token.$type === 'color') {
        type = 'color';
        value = reference ?? String(token.$value?.hex ?? token.$value).toLowerCase();
        // Figma drops alpha from `hex`; preserve it so translucent tokens survive.
        if (!reference && token.$value?.alpha != null && token.$value.alpha < 1) {
          const a = Math.round(token.$value.alpha * 255).toString(16).padStart(2, '0');
          value = `${value}${a}`;
        }
      } else if (token.$type === 'number') {
        if (spec.numberType === 'fontWeight') {
          type = 'fontWeight';
          value = reference ?? token.$value;
        } else {
          type = 'dimension';
          value = reference ?? (token.$value === 0 ? '0' : `${token.$value}px`);
        }
      } else if (token.$type === 'string') {
        const leaf = segs.at(-1);
        if (leaf === 'font-weight') {
          const weight = FONT_WEIGHTS[slug(token.$value).replace(/-/g, '')];
          if (!weight) {
            // Skipped rather than guessed: shipping the wrong weight silently is
            // worse than the token being absent, and absent is visible downstream.
            warnings.push(
              `"${name}" has font weight "${token.$value}", which is not a recognised weight — ` +
              `token skipped. Fix it in Figma.`,
            );
            continue;
          }
          type = 'fontWeight';
          value = weight;
        } else {
          type = leaf === 'font-family' ? 'fontFamily' : 'string';
          value = reference ?? token.$value;
        }
      } else {
        problems.push(`"${name}" has unsupported $type "${token.$type}".`);
        continue;
      }

      if (UNITLESS.has(segs.at(-1)) && type === 'dimension') value = token.$value;

      setDeep(out, segs, { $value: value, $type: type });
    }
  }

  // A semantic colour that is a literal rather than an alias breaks theming — the
  // designer bound a layer straight to a hex instead of to a primitive. Surfaced
  // here because this script is what reads the Figma file, but not enforced here:
  // validate-tokens.mjs owns that rule and blocks the PR on it.
  for (const [file, tree] of files) {
    if (!file.startsWith('semantic.')) continue;
    for (const [segs, token] of leaves(tree)) {
      if (token.$type === 'color' && !/^\{.+\}$/.test(token.$value)) {
        warnings.push(
          `${file}: "${segs.join('.')}" is the literal ${token.$value} — it should alias a primitive.`,
        );
      }
    }
  }

  return { files, problems: [...new Set(problems)], warnings: [...new Set(warnings)] };
}

// ---------------------------------------------------------------------------
// I/O
// ---------------------------------------------------------------------------

/**
 * Extract any .zip files in figma-export/ into like-named folders, so the
 * maintainer can drop Figma's raw downloads without manually unzipping.
 *
 * Uses the system `tar` (bsdtar on Windows 10+, available everywhere on macOS
 * and Linux) to avoid a dependency. After extraction, any *.tokens.json nested
 * in a subfolder is moved to the folder root — Figma sometimes wraps the file
 * in a directory matching the collection name.
 */
async function extractZips(inDir) {
  const entries = await fs.readdir(inDir, { withFileTypes: true });
  const zips = entries.filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.zip'));
  if (!zips.length) return;

  for (const zip of zips) {
    const zipPath = path.join(inDir, zip.name);
    const baseName = zip.name.replace(/\.zip$/i, '');
    const dest = path.join(inDir, baseName);

    await fs.mkdir(dest, { recursive: true });
    execFileSync('tar', ['-xf', zipPath, '-C', dest], { stdio: 'pipe' });

    await flattenTokensJson(dest);

    await fs.rm(zipPath);
    console.log(`sync-figma: extracted ${zip.name} -> ${baseName}/`);
  }
}

/** Move every *.tokens.json to the folder root and remove empty subdirectories. */
async function flattenTokensJson(dest) {
  async function walk(d) {
    for (const e of await fs.readdir(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name.endsWith('.tokens.json') && d !== dest) {
        await fs.rename(full, path.join(dest, e.name));
      }
    }
  }
  await walk(dest);

  async function pruneEmpty(d) {
    for (const e of (await fs.readdir(d, { withFileTypes: true })).filter((x) => x.isDirectory())) {
      const sub = path.join(d, e.name);
      await pruneEmpty(sub);
      if (!(await fs.readdir(sub)).length) await fs.rmdir(sub);
    }
  }
  await pruneEmpty(dest);
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') ||
    process.argv[1]?.endsWith('sync-figma.mjs')) {
  await fs.readdir(IN, { withFileTypes: true }).catch(() => {
    console.error(
      `\nsync-figma: figma-export/ not found.\n\n` +
      `  Ask the designer to right-click each variable collection in Figma and choose\n` +
      `  "Export modes", then drop the ZIPs here. See docs/figma.md §3.\n`,
    );
    process.exit(1);
  });

  await extractZips(IN);

  const collections = await fs.readdir(IN, { withFileTypes: true });
  const inputs = [];
  for (const dir of collections.filter((d) => d.isDirectory())) {
    for (const entry of await fs.readdir(path.join(IN, dir.name))) {
      if (!entry.endsWith('.json')) continue;
      const tree = JSON.parse(await fs.readFile(path.join(IN, dir.name, entry), 'utf8'));
      // The mode name is inside the file, so a renamed download still syncs correctly.
      const mode = tree.$extensions?.['com.figma.modeName'] ?? entry.replace(/\.tokens\.json$/, '');
      inputs.push({ collection: dir.name, mode, tree });
    }
  }

  if (!inputs.length) {
    console.error('\nsync-figma: figma-export/ has no collection folders.\n');
    process.exit(1);
  }

  const { files, problems, warnings } = transform(inputs);

  if (problems.length) {
    console.error(`\n${problems.length} problem(s) — the export could not be read, nothing was written:\n`);
    for (const p of problems) console.error(`  - ${p}`);
    console.error('\nSee docs/figma.md §3.\n');
    process.exit(1);
  }

  if (warnings.length) {
    console.warn(`\n${warnings.length} defect(s) in the Figma file — synced anyway, but these need fixing:\n`);
    for (const w of warnings) console.warn(`  ! ${w}`);
    console.warn('\n  `npm run test:tokens` will fail on these until they are fixed in Figma.\n');
  }

  await fs.mkdir(OUT, { recursive: true });
  await Promise.all(
    [...files].map(([file, tree]) =>
      fs.writeFile(path.join(OUT, file), JSON.stringify(sortDeep(tree), null, 2) + '\n', 'utf8'),
    ),
  );

  const count = [...files.values()].reduce((n, t) => n + [...leaves(t)].length, 0);
  console.log(
    `sync-figma: ${count} tokens from ${inputs.length} mode file(s) -> ${files.size} file(s) in tokens/figma/`,
  );
  console.log('Review the diff, then commit.');
}
