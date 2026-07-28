# Testing

A design system has three distinct things to verify, and they fail in different ways:

1. **The tokens are internally sound** — aliases resolve, both modes exist, contrast passes.
2. **The build propagates them faithfully** — the same value reaches Bootstrap, Tailwind, CSS and JS.
3. **The guidance actually works** — a person or an agent reading the docs produces compliant code.

The third is the one most design systems never test, and it's the one that determines whether any of this survives contact with real teams.

---

## What runs today

| Layer | Command | Runs in CI | Status |
|---|---|---|---|
| Token validation | `npm run test:tokens` | ✔ | **Working** |
| Build contract tests | `npm test` | ✔ | **Working** — 35 assertions |
| Validator self-tests | `npm test` | ✔ | **Working** |
| Generated docs freshness | `git diff --exit-code` | ✔ | **Working** |
| Visual check | open `packages/bootstrap/kitchen-sink.html` | ✖ | Manual |
| Screenshot regression | — | ✖ | Proposed |
| Automated a11y | — | ✖ | Proposed |
| Agent evals | — | ✖ | Proposed |

```bash
npm run build && npm run test:tokens && npm test
```

---

## 1. Token validation

`scripts/validate-tokens.mjs` — the gate from [`figma-pipeline.md`](figma-pipeline.md) §3.4. It blocks a bad Figma sync from merging:

- Semantic tokens are **aliases, not literals** (a literal makes theming impossible)
- Aliases resolve, ≤3 hops, no cycles
- **Mode parity** — every semantic token exists in both Light and Dark
- Names match the contract regex
- **WCAG 2.2 AA contrast** on 21 defined pairs, in both modes

The contrast check earns its keep. It caught a real defect on first run: dark-mode `text.inverse` on `action.primary` was 4.21:1, under the 4.5:1 minimum. That would have shipped and turned up in an accessibility audit months later. Fixed by re-aliasing dark `action.primary` to a lighter blue.

**Add a pair whenever you add a color combination the design uses.** The check only covers pairs it's told about — an unlisted combination is unchecked.

## 2. Build contract tests

`test/build-outputs.test.mjs` pins the core promise: one source, same value everywhere. It traces the brand blue from the manifest → CSS custom property → Sass literal → `--bs-primary` → `.btn-primary` → Tailwind namespace, and does the same for the spacing scale and breakpoints.

It also pins the mechanisms that are easy to break silently:

- CSS keeps `var()` references rather than resolving them — this is what makes dark mode work
- Component tokens are **not** redefined in dark mode; they inherit through indirection
- Primitives don't leak into the Tailwind theme (they'd become `bg-palette-*` utilities)

These exist so a Style Dictionary or Bootstrap upgrade fails here rather than in someone's browser.

## 3. Validator self-tests

`test/validator.test.mjs` runs the validator against a deliberately noncompliant fixture and a compliant one, asserting **both** directions. False positives matter as much as misses: a tool that cries wolf gets ignored, and then nobody checks anything.

This caught a real bug during development — `.custom-panel` tripped the Bootstrap 3 `panel` rule, because `\b` treats a hyphen as a word boundary. Fixed with lookarounds.

## 4. Generated docs freshness

CI rebuilds and fails if `skills/`, `llms.txt` or `.ai/` change. That's what makes the "docs can't drift" claim true rather than aspirational — the token reference an LLM reads is a build artifact, and CI proves it matches the tokens.

## 5. Visual

`packages/bootstrap/kitchen-sink.html` renders every component with a mode toggle. Open it after `npm run build`.

What to check by hand:

- [ ] Toggle dark mode — every swatch changes. Anything that doesn't is hard-coded.
- [ ] Tab through the whole page — visible focus ring on every interactive element, in both modes.
- [ ] Zoom to 400% — no horizontal scroll, nothing clipped.
- [ ] Narrow to 320px — nothing overflows.
- [ ] Compare against Figma side by side.

**Proposed next:** Playwright screenshots of the kitchen sink at three widths × two modes, diffed per PR. That turns "did this token change break anything visually" from a question into an artifact. Worth doing once the token values stop churning — before then, every PR legitimately changes every screenshot.

## 6. Accessibility

Contrast is covered by layer 1. The rest needs two things automation can't do.

**Proposed:** `axe-core` against the kitchen sink in CI. Cheap, catches the mechanical subset.

**Not automatable, and required anyway:** keyboard-only navigation of a real page, and a screen-reader pass (NVDA or VoiceOver) on each layout pattern. Automated checks find roughly a third of real accessibility issues. Never report a page as accessible on the strength of a passing linter.

## 7. Agent evals — testing that the guidance works

This is the one that matters most and is least standard, so here's the concrete shape.

**The insight:** we already have a machine-checkable definition of "correct output" — `validate.mjs`. So testing the skill is mechanical:

```
golden prompt → agent + skill → generated code → validate.mjs → pass/fail
```

A proposed `evals/` directory:

```
evals/
├── prompts/
│   ├── content-page-with-form.md
│   ├── landing-page-three-sections.md
│   ├── migrate-decorator-page.md      (input: a real Bootstrap 3 page)
│   ├── dark-mode-card.md
│   └── shadcn-button-variant.md
└── run.mjs
```

Each prompt runs against the skill; the output goes through `validate.mjs`. Scoring:

| Metric | Target |
|---|---|
| Validator errors | **0** — this is pass/fail |
| Validator warnings | ≤2 |
| Correct layout pattern chosen | yes/no |
| Used semantic tokens, not primitives | yes/no |
| Included skip link, one `<h1>`, focus styles | yes/no |

Run the suite when the skill changes, when tokens change materially, and when a new model version ships. **Watch for regressions specifically after model upgrades** — guidance tuned to one model's failure modes can quietly stop landing on the next.

A failing eval is usually a documentation bug, not a model bug. If three different models all reach for `bg-blue-500`, the skill isn't saying clearly enough not to. That's the signal this layer exists to produce.

**Baseline worth capturing:** run the same prompts *without* the skill. If output quality is similar, the skill isn't earning its context budget and should be cut down.

## 8. Consumer smoke tests

Proposed: one minimal real app per target — a static page, a Bootstrap 5 SPA, a Next.js route — built in CI against the published packages. Catches packaging errors (wrong `exports` map, missing file in `files`, broken Sass import path) that no unit test sees because the tests import from source.

---

## Test it before the designer's tokens land

You don't need the real Figma file to validate the pipeline. Change a placeholder value in `tokens/primitive/color.json`, run `npm run build`, and confirm it propagates:

```bash
npm run build && npm run test:tokens && npm test
git diff --stat   # every downstream target should have moved
```

If a value change doesn't ripple into the Bootstrap CSS, the Tailwind theme *and* the generated token docs, the pipeline is broken — and better to find that now than during the first real sync.

## What we deliberately don't test

- **Whether the design is good.** Not a testable property. That's design review.
- **Alt text quality, focus order, whether a live region says something useful.** Requires a human.
- **Bootstrap itself.** It has its own test suite; we test our mapping onto it.
- **Every token permutation.** The contrast pairs are the combinations the design actually uses. Testing all 103×103 would produce noise, not signal.
