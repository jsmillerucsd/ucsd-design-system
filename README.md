# UCSD's DESIGN.md

The UC San Diego design system as **one file you hand a coding agent** — [`DESIGN.md`](DESIGN.md) — plus the same tokens compiled for every framework.

Successor to **Decorator V5** (Bootstrap 3, jQuery, Glyphicons, no dark mode).

> **Status: real values, not placeholders.** Colour, type, spacing and radius are synced from the designer's Figma file. Two caveats: the display faces (Refrigerator Deluxe, Brix Sans) are licensed and their **web licence is unconfirmed**, and `tokens/known-issues.json` tracks six defects design still needs to fix.

## Use it

**Next.js / React / Vite** — [full guide](docs/using/nextjs.md)

```css
/* app/globals.css */
@import "tailwindcss";
@import "@ucsd/tokens/css";
@import "@ucsd/tokens/tailwind";
```

Then `bg-theme-primary`, `text-foreground-body-text`, `p-large`, `text-h1`. Dark mode needs no `dark:` variants.

**Bootstrap 5 / static page / CMS template** — [full guide](docs/using/bootstrap.md)

```html
<link rel="stylesheet" href="https://cdn.ucsd.edu/ucsd/2/ucsd-bootstrap.min.css">
```

No build step, tokens included. With Sass instead: `@import "@ucsd/bootstrap/scss";`

**Vue, Svelte, web components, email, charts** — [full guide](docs/using/other.md)

```css
background: var(--ucsd-color-surface-1);
color: var(--ucsd-color-foreground-body-text);
```

## Use it with an agent

Point it at [`DESIGN.md`](DESIGN.md). One file, no setup: every semantic token with light *and* dark values, the rules, and the design intent behind them, in the [DESIGN.md format](https://github.com/google-labs-code/design.md) agents already understand.

```
Build a UCSD program landing page. Follow DESIGN.md.
Use the landing-page pattern from docs/layouts/.
Run `npm run validate` and fix what it reports.
```

`npm run validate "src/**/*.tsx"` flags raw hex and px where a token exists, Bootstrap 3 leftovers, and common accessibility misses. Claude Code users also get the [skill](skills/ucsd-design-system/SKILL.md).

## Keep it updated

Figma owns the values. The designer never touches git:

| Who | Does |
|---|---|
| **Designer** | In Figma: right-click each variable collection → **Export modes** → send the files |
| **You** | Drop them in `figma-export/`, run `npm run sync:figma`, review the diff, open a PR |

`npm run build` then recompiles every target — CSS, Sass, Tailwind, TS, Bootstrap, `DESIGN.md`, and the skill — from that one source. Nobody retypes a hex code anywhere in the chain.

The gate blocks a bad sync: aliases must resolve, every token must exist in both modes, names must match the contract, and text/background pairs must pass WCAG 2.2 AA in both modes. Full detail in [docs/figma.md](docs/figma.md).

## Docs

| | |
|---|---|
| [Using it: Next.js](docs/using/nextjs.md) · [Bootstrap](docs/using/bootstrap.md) · [everything else](docs/using/other.md) | Get it into your app |
| [Page layouts](docs/layouts/README.md) | Content, landing and listing patterns + CMS content models |
| [Figma → code](docs/figma.md) | The sync, and the authoring contract for designers |
| [Token naming contract](docs/token-naming-contract.md) | The four tiers and what each is for |
| [Accessibility](docs/accessibility.md) | The contract every component owes |
| [Migrating off Decorator V5](docs/migration.md) | Bootstrap 3 → 5 class mapping |
| [Architecture](docs/architecture.md) | Decisions, and the alternatives they rejected |
| [Contributing](CONTRIBUTING.md) | Build, test, repo map, how to change a token |
