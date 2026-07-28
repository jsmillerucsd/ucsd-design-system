# Tokens Studio import package — UCSD

**GENERATED — do not edit.** Produced by `scripts/export-tokens-studio.mjs` from
`tokens/`. Regenerate with `npm run build`.

This is a **one-time seed** so nobody hand-types ~175 variable names.
After the import, **Figma is upstream**: the designer owns values from then on, and
they flow back to code via the plugin's git sync. See `docs/figma.md`.

## What the designer needs

| Requirement | Why |
|---|---|
| **Figma Professional plan or higher** | Variable *modes* are not available on Free/Starter. Light + Dark is two modes, so Free cannot express this system at all. |
| The file in a **Project**, not Drafts | Figma refuses to create more than one mode for files sitting in Drafts, even on a paid plan. |
| **Tokens Studio Pro licence** (one seat) | Creating Themes is Pro-only, and Themes are the only route to a multi-mode Variable Collection. The free tier can import these tokens, but every collection lands with a single mode. |

## Import

1. Install the **Tokens Studio** plugin in the Figma file.
2. Settings → Token Format → **W3C DTCG**. These files use `$value`/`$type`; the
   legacy format will not read them correctly.
3. Load this folder — either via the plugin's file upload, or by pointing its
   GitHub sync at the `tokens-studio/` directory of this repo (multi-file mode).
4. Confirm four Token Sets appear in the order in `$metadata.json`, and three
   Themes under two groups.
5. **Styles & Variables → Export → Themes**, which produces:
   - `1. Primitives` — one collection, one mode. **Set this collection to hidden from publishing.**
   - `2. Semantic` — one collection with **Light** and **Dark** modes. Publish this one.

## Then: rebind the component library

The import creates correctly-named variables. It **cannot** rebind existing
components — that part is manual, and it's the real work. For each component, swap
raw fills and hardcoded values for the matching `2. Semantic` variable. Figma's
right-click → *swap variable* helps once a layer is already bound to something.

The rule that makes everything else work: **components bind only to `2. Semantic`
(or `3. Component`), never to `1. Primitives`.** A component pointing at
`palette/blue/500` hard-codes a brand decision and breaks dark mode.

## The names are a starting point, not a cage

The semantic vocabulary is a closed set on purpose — it's what every framework
compiles against — but it is not sacred. If a category is missing or wrong for how
UCSD actually designs, that's a conversation worth having before the library is
finished, not after. `docs/token-naming-contract.md` has the reasoning behind each
group; `docs/figma.md` §2 is the full authoring contract, written to be read on
its own.

## What's deliberately absent

`elevation` and `motion` are in `tokens/` but not here. Figma Variables have no
shadow or easing type, so they cannot be variables — shadows live in Figma as
**effect styles**, authored by hand. They still reach code normally.

Values in this seed are **placeholders except the brand colours** (UCSD Blue, Navy
and Gold are the real Decorator V5 values). Everything else is a reasonable default
waiting to be replaced.
