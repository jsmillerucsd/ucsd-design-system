/**
 * tokens/ -> a Tokens Studio import package.
 *
 * The Figma Variables REST API is Enterprise-gated, so the sync path for this
 * project is the Tokens Studio plugin (docs/figma.md §3.1, option B). This script
 * produces the package the designer imports ONCE to seed the Figma file with
 * correctly-named variables — after that, Figma is upstream and this output is
 * only a reference.
 *
 * It exists so the designer never has to hand-type ~130 variable names from a
 * spec. Names are the half of the contract that engineering cares about; values
 * are the half the designer owns. Seeding the names costs nothing and removes the
 * most likely source of a mismatch.
 *
 * Structure (Tokens Studio multi-file):
 *   $metadata.json          set order — lowest set wins on conflict
 *   $themes.json            theme groups -> Figma Variable Collections + modes
 *   primitive.json          the paint box, exported as its own hidden collection
 *   semantic.json           mode-independent semantics (space, radius, type, ...)
 *   semantic-color-light.json  \ same token paths, different aliases: this is what
 *   semantic-color-dark.json   / makes dark mode a re-alias rather than new tokens
 *
 * Output is committed so it can be handed over from GitHub with no build step.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(REPO, 'tokens');
const OUT = path.join(REPO, 'tokens-studio');

/**
 * Groups excluded from the seed.
 *
 * Figma Variables have no shadow type and no easing type, so these cannot become
 * variables at all — they would import as inert strings and read as clutter in the
 * designer's file. They stay in tokens/ and reach code normally; they are simply
 * not part of what Figma owns. Elevation lives in Figma as effect *styles*, which
 * are authored by hand.
 */
const NOT_EXPRESSIBLE_IN_FIGMA = new Set(['elevation', 'motion']);

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

/** Merge DTCG trees, dropping the groups Figma can't hold. */
function mergeTrees(trees) {
  const out = {};
  for (const tree of trees) {
    for (const [key, value] of Object.entries(tree)) {
      if (NOT_EXPRESSIBLE_IN_FIGMA.has(key)) continue;
      out[key] = key in out ? { ...out[key], ...value } : value;
    }
  }
  return out;
}

const [primitiveColor, light, dark, layout, space, typography] = await Promise.all([
  readJson(path.join(SRC, 'primitive', 'color.json')),
  readJson(path.join(SRC, 'semantic', 'color', 'light.json')),
  readJson(path.join(SRC, 'semantic', 'color', 'dark.json')),
  readJson(path.join(SRC, 'semantic', 'layout.json')),
  readJson(path.join(SRC, 'semantic', 'space.json')),
  readJson(path.join(SRC, 'semantic', 'typography.json')),
]).catch((e) => {
  console.error(`\nexport-tokens-studio: could not read tokens/ — ${e.message}\n`);
  process.exit(1);
});

const sets = {
  'primitive': mergeTrees([primitiveColor]),
  'semantic': mergeTrees([layout, space, typography]),
  'semantic-color-light': mergeTrees([light]),
  'semantic-color-dark': mergeTrees([dark]),
};

// Order matters: the LOWEST enabled set wins a name collision. light and dark hold
// identical token paths, so dark sitting below light is what lets the Dark theme
// override colours while inheriting everything else from `semantic`.
const tokenSetOrder = ['primitive', 'semantic', 'semantic-color-light', 'semantic-color-dark'];

/**
 * Theme groups become Figma Variable Collections; themes within a group become
 * Modes on that collection. This is the only way to get a two-mode collection out
 * of the plugin, and it requires a Tokens Studio Pro licence — see the README.
 *
 * `source` means "resolve references against this set, but don't emit variables
 * for it", which is how primitives stay out of the published semantic collection.
 */
const themes = [
  {
    id: 'primitives',
    name: 'Value',
    group: '1. Primitives',
    selectedTokenSets: {
      'primitive': 'enabled',
    },
  },
  {
    id: 'semantic-light',
    name: 'Light',
    group: '2. Semantic',
    selectedTokenSets: {
      'primitive': 'source',
      'semantic': 'enabled',
      'semantic-color-light': 'enabled',
      'semantic-color-dark': 'disabled',
    },
  },
  {
    id: 'semantic-dark',
    name: 'Dark',
    group: '2. Semantic',
    selectedTokenSets: {
      'primitive': 'source',
      'semantic': 'enabled',
      'semantic-color-light': 'disabled',
      'semantic-color-dark': 'enabled',
    },
  },
];

const count = (tree) => {
  let n = 0;
  (function walk(node) {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object') ('$value' in v) ? n++ : walk(v);
    }
  })(tree);
  return n;
};

const readme = `# Tokens Studio import package — UCSD

**GENERATED — do not edit.** Produced by \`scripts/export-tokens-studio.mjs\` from
\`tokens/\`. Regenerate with \`npm run build\`.

This is a **one-time seed** so nobody hand-types ~${Object.values(sets).reduce((n, s) => n + count(s), 0)} variable names.
After the import, **Figma is upstream**: the designer owns values from then on, and
they flow back to code via the plugin's git sync. See \`docs/figma.md\`.

## What the designer needs

| Requirement | Why |
|---|---|
| **Figma Professional plan or higher** | Variable *modes* are not available on Free/Starter. Light + Dark is two modes, so Free cannot express this system at all. |
| The file in a **Project**, not Drafts | Figma refuses to create more than one mode for files sitting in Drafts, even on a paid plan. |
| **Tokens Studio Pro licence** (one seat) | Creating Themes is Pro-only, and Themes are the only route to a multi-mode Variable Collection. The free tier can import these tokens, but every collection lands with a single mode. |

## Import

1. Install the **Tokens Studio** plugin in the Figma file.
2. Settings → Token Format → **W3C DTCG**. These files use \`$value\`/\`$type\`; the
   legacy format will not read them correctly.
3. Load this folder — either via the plugin's file upload, or by pointing its
   GitHub sync at the \`tokens-studio/\` directory of this repo (multi-file mode).
4. Confirm four Token Sets appear in the order in \`$metadata.json\`, and three
   Themes under two groups.
5. **Styles & Variables → Export → Themes**, which produces:
   - \`1. Primitives\` — one collection, one mode. **Set this collection to hidden from publishing.**
   - \`2. Semantic\` — one collection with **Light** and **Dark** modes. Publish this one.

## Then: rebind the component library

The import creates correctly-named variables. It **cannot** rebind existing
components — that part is manual, and it's the real work. For each component, swap
raw fills and hardcoded values for the matching \`2. Semantic\` variable. Figma's
right-click → *swap variable* helps once a layer is already bound to something.

The rule that makes everything else work: **components bind only to \`2. Semantic\`
(or \`3. Component\`), never to \`1. Primitives\`.** A component pointing at
\`palette/blue/500\` hard-codes a brand decision and breaks dark mode.

## The names are a starting point, not a cage

The semantic vocabulary is a closed set on purpose — it's what every framework
compiles against — but it is not sacred. If a category is missing or wrong for how
UCSD actually designs, that's a conversation worth having before the library is
finished, not after. \`docs/token-naming-contract.md\` has the reasoning behind each
group; \`docs/figma.md\` §2 is the full authoring contract, written to be read on
its own.

## What's deliberately absent

\`elevation\` and \`motion\` are in \`tokens/\` but not here. Figma Variables have no
shadow or easing type, so they cannot be variables — shadows live in Figma as
**effect styles**, authored by hand. They still reach code normally.

Values in this seed are **placeholders except the brand colours** (UCSD Blue, Navy
and Gold are the real Decorator V5 values). Everything else is a reasonable default
waiting to be replaced.
`;

await fs.rm(OUT, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
await fs.mkdir(OUT, { recursive: true });

const write = (name, data) =>
  fs.writeFile(path.join(OUT, name), JSON.stringify(data, null, 2) + '\n', 'utf8');

await Promise.all([
  ...Object.entries(sets).map(([name, tree]) => write(`${name}.json`, tree)),
  write('$metadata.json', { tokenSetOrder }),
  write('$themes.json', themes),
  fs.writeFile(path.join(OUT, 'README.md'), readme, 'utf8'),
]);

const total = Object.values(sets).reduce((n, s) => n + count(s), 0);
console.log(
  `tokens-studio: ${total} tokens across ${Object.keys(sets).length} sets, ` +
    `${themes.length} themes in ${new Set(themes.map((t) => t.group)).size} groups`,
);
