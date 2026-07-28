/**
 * Pure transform: Figma Variables API payload -> DTCG token trees.
 *
 * Split out from sync-figma.mjs so it can be tested without a Figma account.
 * This half does no I/O and never exits the process; it returns the files it
 * would write plus every problem it found, and the caller decides what to do.
 *
 * Keeping it pure is deliberate: the original combined script could not be
 * exercised at all without credentials, and shipped with four logic bugs.
 */

/** Maps Figma collection names to the tier they belong to. Adjust on first run. */
const COLLECTIONS = {
  '1. Primitives': { tier: 'primitive', dir: 'primitive' },
  '2. Semantic': { tier: 'semantic', dir: 'semantic' },
  '3. Component': { tier: 'component', dir: 'component' },
};

/**
 * Which file each token root is written to.
 *
 * These MUST match the committed layout in tokens/, because packages/tokens/build.mjs
 * globs those paths and scripts/validate-tokens.mjs reads several of them by name.
 * Deriving filenames from the token root instead (radius -> semantic/radius.json)
 * would leave the existing files in place and define every token twice.
 *
 * An unmapped root is an error rather than a new file: the semantic vocabulary is a
 * closed set (docs/token-naming-contract.md), so an unknown root means the contract
 * changed and a human has to decide where it belongs.
 */
const FILE_FOR_ROOT = {
  primitive: {
    palette: 'primitive/color.json',
  },
  semantic: {
    // color.* is handled separately — it splits by mode.
    space: 'semantic/space.json',
    font: 'semantic/typography.json',
    text: 'semantic/typography.json',
    radius: 'semantic/layout.json',
    elevation: 'semantic/layout.json',
    motion: 'semantic/layout.json',
    breakpoint: 'semantic/layout.json',
    container: 'semantic/layout.json',
  },
};

/** Colour modes we know how to write. Anything else has no home in the build. */
const KNOWN_MODES = new Set(['light', 'dark']);

// --- helpers -----------------------------------------------------------------

export const toHex = ({ r, g, b, a }) => {
  const c = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}${a < 1 ? c(a) : ''}`;
};

/** Lowercase, collapse whitespace to hyphens, drop anything else. */
export const slug = (s) => s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/** Figma names are slash-delimited: "color/action/primary". */
const segments = (name) => name.split('/').map(slug);

const dtcgType = (figmaType, pathSegs) => {
  if (figmaType === 'COLOR') return 'color';
  if (figmaType === 'STRING') return pathSegs.includes('family') ? 'fontFamily' : 'string';
  if (figmaType === 'FLOAT') {
    if (pathSegs.includes('weight')) return 'fontWeight';
    if (pathSegs.includes('duration')) return 'duration';
    return 'dimension';
  }
  throw new Error(`BOOLEAN variable "${pathSegs.join('/')}" is not a design token — remove it from the published collection.`);
};

/** Numbers become dimensions with units; weights and durations don't. */
export const formatFloat = (n, type) =>
  type === 'dimension' ? (n === 0 ? '0' : `${n}px`)
  : type === 'duration' ? `${n}ms`
  : n;

const setDeep = (obj, segs, value) => {
  let node = obj;
  for (const s of segs.slice(0, -1)) node = node[s] ??= {};
  node[segs.at(-1)] = value;
};

/** Stable key order so PR diffs are readable rather than reshuffled noise. */
export const sortDeep = (o) =>
  Array.isArray(o) ? o
  : o && typeof o === 'object'
    ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortDeep(o[k])]))
    : o;

/**
 * Decide which file a token belongs in.
 *
 * Returns `{ file }` or `{ problem }` — never both. Pulled out of the main loop so
 * the routing rules read as one flat set of cases instead of four nested levels.
 */
function fileFor({ spec, segs, mode, collection, splitsByMode }) {
  if (splitsByMode) {
    if (collection.modes.length < 2) {
      return {
        problem:
          `Semantic colours need both a Light and a Dark mode, but "${collection.name}" ` +
          `has only "${mode.name}". Add the missing mode — see docs/figma.md §3.`,
      };
    }
    const modeSlug = slug(mode.name);
    if (!KNOWN_MODES.has(modeSlug)) {
      return {
        problem:
          `Colour mode "${mode.name}" is not supported. Name the modes exactly "Light" and "Dark" — ` +
          `the build reads tokens/semantic/color/{light,dark}.json.`,
      };
    }
    return { file: `${spec.dir}/color/${modeSlug}.json` };
  }

  if (spec.tier === 'component') return { file: `${spec.dir}/${segs[0]}.json` };

  const file = FILE_FOR_ROOT[spec.tier]?.[segs[0]];
  if (file) return { file };
  return {
    problem:
      `"${segs.join('/')}" has an unmapped root "${segs[0]}" for the ${spec.tier} tier. ` +
      `Add it to FILE_FOR_ROOT in scripts/lib/figma-transform.mjs, or rename it to ` +
      `fit the closed vocabulary in docs/token-naming-contract.md.`,
  };
}

// --- transform ---------------------------------------------------------------

/**
 * @param {object} meta  the `meta` object from GET /v1/files/:key/variables/local
 * @returns {{ files: Map<string, object>, problems: string[] }}
 *   `files` maps a repo-relative path under tokens/ to a DTCG tree.
 *   `problems` is de-duplicated; a non-empty list means nothing should be written.
 */
export function transform(meta) {
  const variables = Object.values(meta.variables);
  const collections = meta.variableCollections;

  const files = new Map();
  const problems = [];

  const resolveAlias = (id) => {
    const target = meta.variables[id];
    if (!target) throw new Error(`alias points at unknown variable ${id}`);
    return `{${segments(target.name).join('.')}}`;
  };

  for (const v of variables) {
    const collection = collections[v.variableCollectionId];
    const spec = COLLECTIONS[collection?.name];
    if (!spec) continue; // unmapped collection — ignored on purpose

    const segs = segments(v.name);
    let type;
    try {
      type = dtcgType(v.resolvedType, segs);
    } catch (e) {
      problems.push(e.message);
      continue;
    }

    // Mode-invariant, so decided once per variable rather than per mode.
    const splitsByMode = spec.tier === 'semantic' && segs[0] === 'color';

    for (const mode of collection.modes) {
      const rawValue = v.valuesByMode[mode.modeId];
      if (rawValue === undefined) {
        problems.push(`"${v.name}" has no value in mode "${mode.name}"`);
        continue;
      }

      let value;
      try {
        if (rawValue?.type === 'VARIABLE_ALIAS') {
          value = resolveAlias(rawValue.id);
        } else if (v.resolvedType === 'COLOR') {
          value = toHex(rawValue);
        } else if (v.resolvedType === 'FLOAT') {
          value = formatFloat(rawValue, type);
        } else {
          value = rawValue;
        }
      } catch (e) {
        // A dangling alias is a file problem, not a crash — collect it and carry on
        // so the operator sees every problem at once rather than only the first.
        problems.push(`"${v.name}" (${mode.name}): ${e.message}`);
        continue;
      }

      // A semantic colour that is a literal rather than an alias breaks theming.
      if (spec.tier === 'semantic' && type === 'color' && rawValue?.type !== 'VARIABLE_ALIAS') {
        problems.push(`"${v.name}" (${mode.name}) is a literal ${value}. Semantic tokens must alias a primitive.`);
      }

      // Semantic colours split by mode; everything else uses the default mode only.
      if (!splitsByMode && mode.modeId !== collection.defaultModeId) continue;

      const { file, problem } = fileFor({ spec, segs, mode, collection, splitsByMode });
      if (problem) {
        problems.push(problem);
        continue;
      }

      const tree = files.get(file) ?? {};
      files.set(file, tree);

      const token = { $value: value, $type: type };
      if (v.description) token.$description = v.description;
      setDeep(tree, segs, token);
    }
  }

  // Structural problems repeat once per affected token; collapse them so the
  // operator sees one line per distinct issue.
  return { files, problems: [...new Set(problems)] };
}
