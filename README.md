# UCSD Design System

One source of design truth, many front-end targets, one file you hand an AI agent.

Successor to **Decorator V5** (`cdn.ucsd.edu/developer/decorator/5.0.2/`) — Bootstrap 3, jQuery, Glyphicons, no dark mode.

> **Status: scaffolding.** Token values are placeholders until the first Figma sync. Verify every brand value against `brand.ucsd.edu` before production use.

## The one idea

**Tokens are portable. Components are not.**

A `<Button>` in React and a `.btn` in Bootstrap 5 can never share an implementation. What they *can* share is one machine-readable definition of colour, space, type, radius, elevation and motion — and one prose statement of what UCSD should look and feel like.

```
  Figma Variables                    ← designer owns VALUES
        │  npm run sync:figma  (one-way, opens a PR)
        ▼
  tokens/**.json                     ← source of truth (W3C DTCG)
        │  npm run build      (Style Dictionary)
        ▼
  packages/tokens/dist/
        ├─▶ tokens.css   var(--ucsd-*), light + dark   → any framework
        ├─▶ _tokens.scss compile-time values           → Bootstrap 5
        ├─▶ theme.css    Tailwind v4 @theme            → Next.js / React
        ├─▶ tokens.js    typed object                  → canvas, charts, RN
        └─▶ tokens.json  ─┬─▶ DESIGN.md      ← the file you hand an agent
                          └─▶ llms.txt, skills/
```

Everything below `tokens/**.json` is generated. One colour change in Figma updates every framework target *and* what your coding agent knows, in the same commit.

## Quickstart

**Next.js / React / Vite** — [full guide](docs/using/nextjs.md)

```css
/* app/globals.css */
@import "tailwindcss";
@import "@ucsd/tokens/css";
@import "@ucsd/tokens/tailwind";
```

Then `bg-action-primary`, `text-text-muted`, `p-4`. Dark mode needs no `dark:` variants.

**Bootstrap 5 / static page / CMS template** — [full guide](docs/using/bootstrap.md)

```html
<link rel="stylesheet" href="https://cdn.ucsd.edu/ucsd/2/ucsd-bootstrap.min.css">
```

No build step, tokens included. With Sass instead: `@import "@ucsd/bootstrap/scss";`

**Vue, Svelte, web components, email, charts** — [full guide](docs/using/other.md)

```css
background: var(--ucsd-color-surface-default);
```

## Working with a coding agent

Point it at [`DESIGN.md`](DESIGN.md). That one file carries the visual identity — every semantic token with light and dark values, the rules, and the design intent behind them — in the [DESIGN.md format](https://github.com/google-labs-code/design.md) that agents understand with no setup.

```
Build a UCSD program landing page. Follow DESIGN.md.
Use the landing-page pattern from docs/layouts/.
Run `npm run validate` and fix what it reports.
```

Then check the work:

```bash
npm run validate "src/**/*.tsx"
```

The validator flags raw hex and px where a token exists, Bootstrap 3 leftovers, and common accessibility misses. Claude Code users also get the [skill](skills/ucsd-design-system/SKILL.md), which routes to the right guide automatically.

Building from a Figma frame? Figma's MCP server pairs with `DESIGN.md` — the frame answers *what it looks like*, `DESIGN.md` answers *what you're allowed to build*. Setup and the seat requirement are in [docs/figma.md §5.2](docs/figma.md).

## Figma → spec, in five steps

1. **The designer authors variables** in three collections — primitives (hidden), semantic (published, with Light and Dark modes), component. Components bind only to semantic. → [the contract](docs/figma.md). To skip hand-typing ~175 names, import the seed in [`tokens-studio/`](tokens-studio/README.md) first.
2. **The Tokens Studio plugin** pushes those variables back to `tokens/**.json` as DTCG, preserving aliases, and opens a pull request.
3. **The gate runs.** Aliases resolve, every token exists in both modes, names match the contract, and text/background pairs pass WCAG 2.2 AA — in both modes. A bad sync cannot merge.
4. **`npm run build`** compiles every target and regenerates `DESIGN.md`.
5. **Apps and agents pick it up.** Nobody retypes a hex code anywhere in this chain.

## Repo map

| Path | What it is | Hand-written? |
|---|---|---|
| [`DESIGN.md`](DESIGN.md) | The file you hand an agent. Visual identity + every semantic token. | Frontmatter generated; prose from `docs/design-md/` |
| `tokens/` | DTCG JSON. **Source of truth.** Synced from Figma — never hand-edit. | No — synced |
| `tokens-studio/` | One-time seed package the designer imports into Figma to create the variables. | No — generated |
| `packages/tokens/` | Style Dictionary build → CSS, Sass, Tailwind, TS, JSON | Config only |
| `packages/bootstrap/` | Bootstrap 5 theme + CDN bundle. The Decorator replacement. | Small bridge file |
| `docs/` | Usage guides, layouts, the Figma pipeline, decisions | Yes |
| `skills/ucsd-design-system/` | Claude Skill. `SKILL.md` routes; everything else is generated. | Router + validator |
| `scripts/`, `test/` | Sync, build generators, validation gate, contract tests | Yes |

## Docs

| | |
|---|---|
| [Using it: Next.js](docs/using/nextjs.md) · [Bootstrap](docs/using/bootstrap.md) · [everything else](docs/using/other.md) | Get it into your app |
| [Page layouts](docs/layouts/README.md) | Content, landing and listing patterns + CMS content models |
| [Figma → code](docs/figma.md) | The pipeline, and the authoring contract for designers |
| [Token naming contract](docs/token-naming-contract.md) | The naming scheme and its rationale |
| [Accessibility](docs/accessibility.md) | The contract every component owes |
| [Migrating off Decorator V5](docs/migration.md) | Bootstrap 3 → 5 class mapping and approach |
| [Architecture](docs/architecture.md) | Decisions, and the alternatives they rejected |
| [Contributing](CONTRIBUTING.md) | Build, test, and how to change a token |
| [DESIGN.md prose sources](docs/design-md/README.md) | How the agent-facing file is written |
