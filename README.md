# UCSD Design System

One source of design truth → many front-end targets → one documentation surface that humans **and** LLMs read.

Successor to the Bootstrap 3-era **Decorator V5** (`cdn.ucsd.edu/developer/decorator/5.0.2/`).

---

## The one idea

**Tokens are portable. Components are not.**

A `<Button>` in shadcn and a `.btn` in Bootstrap 5 can never share an implementation. What they *can* share is a single machine-readable definition of color, space, type, radius, elevation and motion — plus a single prose spec of each component's semantics and each page layout's anatomy.

```
Figma Variables ──sync──▶ tokens/*.json ──Style Dictionary──▶ css │ scss │ tailwind │ ts │ json
   (designer)              (source of truth)                        │
                                                                    ├─▶ @ucsd/bootstrap   Bootstrap 5 theme + CDN bundle
                                                                    ├─▶ @ucsd/registry    shadcn registry (React/Next.js)
                                                                    ├─▶ layouts/          CMS page patterns
                                                                    └─▶ skills/ + llms.txt LLM / agent access
```

Everything right of `tokens/*.json` is **generated or thin**. One color change in Figma updates every framework target *and* the LLM's knowledge in the same commit.

## Repo map

| Path | What it is | Hand-written? |
|---|---|---|
| `tokens/` | DTCG JSON. **Source of truth.** Synced from Figma — never hand-edit. | No — synced |
| `packages/tokens/` | Style Dictionary build → CSS vars, Sass, Tailwind `@theme`, TS, flat JSON | Config only |
| `packages/bootstrap/` | Bootstrap 5 Sass theme + compiled CDN bundle. Decorator replacement. | Small bridge file |
| `packages/registry/` | shadcn registry for React/Next.js | Components |
| `layouts/` | CMS page patterns — content, landing, article, listing, section | Yes |
| `docs/` | Architecture, Figma pipeline, naming contract, migration | Yes |
| `skills/ucsd-design-system/` | Claude Skill. `SKILL.md` routes; `references/generated/` is built | Router only |
| `.github/workflows/` | Figma sync PR, release, docs deploy | Yes |

## Which target do I use?

Bootstrap 5 and Tailwind/shadcn are **both permanent, first-class targets.** Neither is a waystation. They share tokens, not markup.

| Building | Use |
|---|---|
| No-build page, legacy app, quick CMS template | CDN `<link>` from `@ucsd/bootstrap` |
| Bootstrap 5 app (SPA or server-rendered) | `@ucsd/bootstrap` Sass entry, compiled with your app |
| Next.js / React app | `@ucsd/tokens` + Tailwind v4 `@theme` + `npx shadcn add` from the registry |
| Vue, Svelte, web components, email | `@ucsd/tokens` → `tokens.css` custom properties |
| A CMS page template | A `layouts/` pattern + any of the above |

## Quick start

```bash
npm install && npm run build && npm run test:tokens && npm test
```

Outputs land in `packages/tokens/dist/`. Then open `packages/bootstrap/kitchen-sink.html` to see it rendered.

## Docs

- [Architecture & decisions](docs/architecture.md)
- [**Figma → code pipeline**](docs/figma-pipeline.md) — how design becomes code, sustainably
- [**Figma brief**](docs/figma-brief.md) — self-contained handout for the UX designer
- [Testing](docs/testing.md) — including how to test that the LLM guidance actually works
- [Token naming contract](docs/token-naming-contract.md) — **read before authoring in Figma**
- [Layouts & CMS patterns](docs/layouts.md)
- [Migrating off Decorator V5](docs/migration-decorator-v5.md)

## Status

Scaffolding. **Token values are placeholders** until the first Figma sync — see [docs/figma-pipeline.md](docs/figma-pipeline.md). Verify all brand values against `brand.ucsd.edu` before any production use.
