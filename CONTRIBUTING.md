# Contributing

For people working **on** the design system. If you're building an app **with** it, start at [`README.md`](README.md).

## The loop

```bash
npm install
npm run check          # build + every gate below, in order
```

Which is shorthand for:

```bash
npm run build          # tokens → every target, then DESIGN.md, then the skill
npm run test:tokens    # the validation gate
npm run audit:bridges  # every published token lands in a framework surface; no no-op Bootstrap variables
npm test               # contract tests + link check
npm run lint:designmd  # DESIGN.md against the format spec
```

Then look at the two demos — one per framework, because they exercise genuinely different chains:

```bash
npm run demo           # compiles demo/dist/shadcn.css with the real Tailwind compiler
```

- `packages/bootstrap/kitchen-sink.html` — Bootstrap 5, straight off the compiled `dist/`. No JavaScript.
- `demo/shadcn.html` — a tour of **unmodified shadcn/ui components**: buttons, alerts, cards, a Recharts chart, tabs, table with pagination, dialog, the full form-control set (input, select, radio group, checkbox, switch, slider, textarea), accordion, breadcrumb, dropdown menu, popover and tooltip.
- `demo/sidebar.html` — shadcn's **`sidebar-08` block**, rendered whole. Stronger evidence than the tour, because the layout and every class in it are shadcn's rather than ours, and it exercises the `--sidebar-*` slot family the tour never touches.

Everything under `demo/` is vendored from shadcn's own registry by `npm run demo:vendor`, which resolves `registryDependencies` recursively. Stylesheets are compiled from the same `dist/` files a consumer imports, in the order the docs prescribe. Nothing uses inline styles or hand-written component classes — a demo that renders from its own CSS can look perfect while the pipeline behind it is broken, which is exactly what happened to the first version of the shadcn page.

**Never edit anything under `demo/components/`, `demo/blocks/` or `demo/hooks/`.** If a component looks wrong, the token bridge is wrong. `npm test` renders both pages and fails if any class they emit compiles to nothing, if a vendored file loses its provenance banner, or if one acquires a UCSD token name.

## What CI enforces

| Check | Command | Why it exists |
|---|---|---|
| Token validation | `npm run test:tokens` | Aliases resolve; every semantic token exists in **both** modes; names match the contract; text/background pairs pass **WCAG 2.2 AA** in both modes. This is what blocks a bad Figma sync from merging. |
| Bridge coverage | `npm run audit:bridges` | Every published token is **bound into at least one framework surface** (Bootstrap variable, Tailwind namespace, shadcn slot) or carries a reasoned entry in `tokens/bridge-exceptions.json`. Catches a Figma token arriving with no downstream home; emits `dist/coverage.json` (per token, per target) as a CI artifact. The ledger is self-cleaning — a stale entry fails the audit. |
| Build contracts | `npm test` | The same value reaches Bootstrap, Tailwind, CSS and JS. Pins the promise the whole system makes. |
| Link check | `npm test` | Every relative link in every `.md` resolves, and no doc is orphaned. |
| Generated files are current | `git diff --exit-code` | `DESIGN.md`, `llms.txt` and `skills/` are committed build artifacts. A diff after rebuild means someone edited a generated file or forgot to rebuild. |
| Format spec | `npm run lint:designmd` | Gated on **errors only**. ~35 warnings are expected and permanent; they're enumerated in `.github/workflows/ci.yml`. |
| Self-check | `npm run validate` | The repo's own Sass is held to the rules it publishes. |

## Three rules that keep this from rotting

**1. Never hand-edit a generated file.** `packages/tokens/dist/`, `DESIGN.md`'s frontmatter, `llms.txt`, and `skills/**/references/generated/` are all build output. If one is wrong, the generator is wrong — fix the generator. CI will catch you either way.

**2. Prose names tokens; it never carries their values.** In `docs/design-md/`, write "the `color.component.btn-primary` fill", never the hex. The build fails on a literal hex or dimension outside a code fence. This is what makes `DESIGN.md` drift-proof: the generated half can't go stale and the written half has no numbers that could.

**3. Every rule has exactly one home.** The design rules live in `docs/design-md/08-dos-and-donts.md` and reach `DESIGN.md`, `llms.txt` and the skill by extraction. If you're about to restate a rule in a second file, link instead.

## Changing a token

Values come from Figma, not from here — see [`docs/figma.md`](docs/figma.md). Editing `tokens/` by hand is for scaffolding only, and the first sync will overwrite it.

When you do change the token *set* (not just values):

1. Check the name against [`docs/token-naming-contract.md`](docs/token-naming-contract.md). The semantic vocabulary is a **closed set** — adding a category needs design and engineering sign-off.
2. Give it a value in **both** `tokens/semantic/color/light.json` and `dark.json`. Mode parity is enforced.
3. Semantic tokens must **alias a primitive**, never carry a literal.
4. If it's a new text/background pairing, add it to `PAIRS` in `scripts/validate-tokens.mjs` — the contrast check only covers pairs it's told about.
5. Decide where the token **lands**: bind it in `packages/bootstrap/scss/_bridge.scss` and/or the Tailwind/shadcn formats in `packages/tokens/formats/`, or record why it stays var-only in `tokens/bridge-exceptions.json`. `npm run audit:bridges` fails until you have done one or the other.
6. `npm run build && npm run test:tokens && npm run audit:bridges && npm test`, and commit the regenerated files with your change.

Versioning on `@ucsd/tokens`: **patch** = value changed, **minor** = token added, **major** = token renamed, removed, or its meaning changed.

## Adding a usage guide or a layout pattern

Guides live in `docs/using/`; layout patterns in `docs/layouts/`. Both are copied into the skill at build time by `scripts/generate-skill-references.mjs` — add the file to the copy list there so agents get it too, then rebuild.

A layout pattern isn't done until it has a content-model table. That's the part the CMS team builds against, and the part most often missing.

## Manual checks CI doesn't cover

Visual regression, automated accessibility, and agent evals are not wired up. Until they are: open the kitchen sink after a token change, and if you've touched guidance, actually try it — give an agent `DESIGN.md` and see whether the output is compliant. The third one is the check most design systems never run, and it's the one that determines whether any of this survives contact with real teams.
