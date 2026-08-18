# UCSD Design System

Token-first design system for UC San Diego. Successor to Decorator V5.

Two packages ship from this repo:

- **`@ucsd/tokens`** - CSS custom properties, Sass, Tailwind @theme, JS, JSON
- **`@ucsd/bootstrap`** - Bootstrap 5 theme, compiled CSS + Sass entry point

Tokens sync from the designer's Figma file. `DESIGN.md` is the single file you hand a coding agent.

## Install

Add one line to your app's `.npmrc`:

```
@ucsd:registry=https://npm.pkg.github.com
```

Then:

```bash
npm install @ucsd/tokens        # any framework
npm install @ucsd/bootstrap     # Bootstrap 5 sites
```

## Use it

**Next.js / React / Tailwind / shadcn** - [full guide](docs/using/nextjs.md)

```css
@import "@ucsd/tokens/full";
```

One import: Tailwind, the tokens (light and dark), the utility theme and the shadcn bridge, in the only order that works. Then `bg-component-btn-primary`, `text-foreground-body-text`, `p-md-16`, `text-h1` — and `npx shadcn add button` renders on-brand unedited. Dark mode needs no `dark:` variants.

**Bootstrap 5 / CMS / static page** - [full guide](docs/using/bootstrap.md)

```bash
npm install @ucsd/bootstrap
```

With Sass: `@import "@ucsd/bootstrap/scss";`

**Vue, Svelte, anything else** - [full guide](docs/using/other.md)

```css
background: var(--ucsd-color-surface-1);
color: var(--ucsd-color-foreground-body-text);
```

## Use it with an agent

Point it at [`DESIGN.md`](DESIGN.md). One file, no setup: every semantic token with light and dark values, the rules, and the design intent, in the [DESIGN.md format](https://github.com/google-labs-code/design.md) agents already understand.

```
Build a UCSD program landing page. Follow DESIGN.md.
Use the landing-page pattern from docs/layouts/.
Run `npm run validate` and fix what it reports.
```

`npm run validate "src/**/*.tsx"` flags raw hex and px where a token exists, Bootstrap 3 leftovers, and common accessibility misses.

## Keep it updated

Figma owns the values. The designer never touches git:

| Who | Does |
|---|---|
| Designer | In Figma: right-click each collection, Export modes, send the ZIPs |
| You | Drop them in `figma-export/`, run `npm run sync:figma`, review the diff, open a PR |

`npm run build` recompiles every target from that one source. Two gates block a bad sync: aliases must resolve, every token must exist in both modes, names must match the contract, text/background pairs must pass WCAG 2.2 AA — and every published token must land in at least one framework surface (or carry a documented exception), so a new Figma token cannot arrive and silently reach nothing. Full detail in [docs/figma.md](docs/figma.md).

### Where edits go

**Never edit `DESIGN.md` directly** — every line of it is build output, and the next `npm run build` overwrites the file without warning. Everything in it has an editable home:

| To change | Edit | Then |
|---|---|---|
| A **value** — a color, size, radius, weight | The Figma file | Designer exports, you run `npm run sync:figma` |
| The **prose** — guidance, rules, voice, do's and don'ts | [`docs/design-md/*.md`](docs/design-md/README.md) (one file per section) | `npm run build` and commit the regenerated `DESIGN.md` with it |

One rule for the prose: it names tokens, never their values — no hex, no px. The build fails otherwise; [docs/design-md/README.md](docs/design-md/README.md) explains why.

## Docs

| Doc | What |
|---|---|
| [Using: Next.js](docs/using/nextjs.md) / [Bootstrap](docs/using/bootstrap.md) / [other](docs/using/other.md) | Get it into your app |
| [Page layouts](docs/layouts/README.md) | Content, landing, listing patterns + CMS content models |
| [Figma to code](docs/figma.md) | The sync and the authoring contract for designers |
| [Figma naming delta](docs/figma-naming-delta.md) | Punch list of Figma-side naming fixes for the designer |
| [Token naming contract](docs/token-naming-contract.md) | The four tiers and what each is for |
| [Accessibility](docs/accessibility.md) | The contract every component owes |
| [Migrating off Decorator V5](docs/migration.md) | Bootstrap 3 to 5 class mapping |
| [Architecture](docs/architecture.md) | Decisions and the alternatives they rejected |
| [Contributing](CONTRIBUTING.md) | Build, test, repo map, how to change a token |
