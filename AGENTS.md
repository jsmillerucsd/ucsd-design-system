# AGENTS.md

Front door for coding agents working on UCSD web projects.

## Building UI with this design system

Read [`DESIGN.md`](DESIGN.md). It has every semantic token (light and dark), the rules, and the design intent. Then:

- Next.js / React / Tailwind: [`docs/using/nextjs.md`](docs/using/nextjs.md)
- Bootstrap 5 / CMS / static: [`docs/using/bootstrap.md`](docs/using/bootstrap.md)
- Vue, Svelte, anything else: [`docs/using/other.md`](docs/using/other.md)
- Page layouts and CMS content models: [`docs/layouts/`](docs/layouts/README.md)

Validate your output: `npm run validate "src/**/*.tsx"` flags raw hex and px where a token exists, Bootstrap 3 leftovers, and accessibility misses.

## Working on this repo

If you are editing this design system rather than consuming it, read [`CONTRIBUTING.md`](CONTRIBUTING.md). Key rules:

- Never hand-edit generated files (`packages/tokens/dist/`, `DESIGN.md` frontmatter, `skills/` generated references). Fix the generator.
- Prose in `docs/design-md/` names tokens but never carries values. The build fails on literal hex or px outside code fences.
- Every rule has one home. `docs/design-md/08-dos-and-donts.md` is canonical; everything else links, never restates.

## Token names

Token path `color.component.btn-primary` becomes `--ucsd-color-component-btn-primary` in CSS, `$ucsd-color-component-btn-primary` in Sass, `bg-component-btn-primary` in Tailwind.

Four tiers, only two published:

| Tier | Example | Components bind to it? |
|---|---|---|
| brand | `brand.core.navy` | Never |
| primitive | `palette.primary.navy.500` | Never |
| semantic | `color.component.btn-primary` | Always |
| code-owned | `breakpoint.md`, `elevation.2` | Always |

Full contract: [`docs/token-naming-contract.md`](docs/token-naming-contract.md).
