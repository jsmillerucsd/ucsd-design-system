# Figma → Code Pipeline

How a design decision made in Figma becomes working code in Bootstrap 5, Tailwind/shadcn, the CMS, and an LLM's context — repeatably, without a human retyping hex codes.

> **Status:** plan of record. Nothing here is wired up yet. Decision gates are marked **⟡ DECIDE**.

---

## 0. Principles

1. **One-way sync.** Figma → git. Never git → Figma, never bidirectional. Bidirectional token sync is the single most common way these systems rot.
2. **Figma owns *values*. Code owns *implementations*.** The boundary is absolute (see §1).
3. **Every sync is a pull request.** A token change is a reviewable diff with a version bump, not a live CDN mutation. This is the biggest single improvement over Decorator V5.
4. **Generated artifacts are never hand-edited.** If you find yourself editing `packages/tokens/dist/` or `skills/**/references/generated/`, the generator is wrong — fix the generator.
5. **Design system code is boring on purpose.** Zero clever build steps. A new engineer should be able to trace a hex value from Figma to a rendered pixel in five minutes.

---

## 1. The boundary: what lives where

This table is the most important thing in this document. Most design-system failures are boundary failures.

| Artifact | Owner | Source of truth | Sync mechanism |
|---|---|---|---|
| Color / space / type / radius / elevation / motion **values** | Designer | Figma Variables | Automated (§3) |
| Token **names** | Joint contract | [`docs/token-naming-contract.md`](token-naming-contract.md) | Reviewed in PR |
| Component **visual spec** (anatomy, variants, states) | Designer | Figma component set | Manual, spec-driven (§5) |
| Component **implementation** (HTML/CSS/JSX) | Engineer | `packages/` | Hand-written, reviewed |
| Component **a11y contract** (roles, focus, keyboard) | Engineer | `packages/` + skill refs | Hand-written |
| Page **layouts / CMS patterns** | Joint | `layouts/*.md` | Hand-written spec (§6) |
| Content model / field names | CMS team | `layouts/*.md` | Hand-written spec |

**Corollary:** we do *not* generate components from Figma. Generated components are unmaintainable — they leak absolute positioning, magic numbers, and no accessibility. Figma tells us *what it should look like*; a human writes the component once, correctly, and then Code Connect (§5) makes Figma point at that human-written code forever after.

---

## 2. Stage 1 — Figma authoring contract

The pipeline is only as good as the file hygiene upstream. These are requirements on the designer's Figma file, not suggestions. Give this section to the UX designer **before** he finishes the component library — retrofitting naming across a finished library is days of work.

### 2.1 Variable collections

Three collections, in this order:

| Collection | Published? | Contains | Example |
|---|---|---|---|
| `1. Primitives` | **Hidden** from publishing | The raw palette and raw scale. Never referenced by a component. | `blue/60`, `navy/100`, `scale/4` |
| `2. Semantic` | **Published** | What components actually bind to. Every value is an alias to a primitive. | `color/action/primary`, `space/4` |
| `3. Component` | Published (optional) | Only where a component genuinely needs its own knob. | `button/primary/bg` |

> **Rule:** a component layer may only bind to `2. Semantic` or `3. Component`. If a designer binds a fill directly to `1. Primitives`, the sync script flags it (§3.4). This is what makes dark mode and future rebrands possible.

### 2.2 Modes

Modes on the `2. Semantic` collection only:

- `Light` (default) and `Dark`.
- ⟡ **DECIDE:** do we also need a `Density: Comfortable | Compact` mode? Adds real value for data-dense admin apps, adds real cost to every token. Recommendation: **not in v1.** Add later — modes are additive and non-breaking.

Primitives have exactly one mode. Dark mode is expressed by re-aliasing semantics, never by adding a `blue-dark` primitive.

### 2.3 Component hygiene

Adapted from the practices in *["Dear LLM, here's how my design system works"](https://uxdesign.cc/dear-llm-heres-how-my-design-system-works-b59fb9a342b7)*, which is the closest thing to a written standard for this right now:

- **Semantic layer names.** `CardHeader`, not `Frame 74`. Layer names become the vocabulary an LLM reasons in and the prop names Code Connect infers.
- **Auto Layout everywhere.** Auto Layout communicates flow, gap, and alignment. Absolute positioning communicates nothing translatable and forces the LLM to guess at `position: absolute`.
- **Flat hierarchy.** Every gratuitous wrapper frame becomes a gratuitous `<div>`.
- **Variants for states,** named to match code: `State=Default | Hover | Focus | Active | Disabled`.
- **Boolean properties for optional parts:** `hasIcon`, `hasDescription` — these map 1:1 onto component props.
- **Slots** for arbitrary content regions, rather than a variant per content shape.
- Component set names match the code component name exactly: Figma `Button` ↔ `packages/registry/button` ↔ `.btn` in Bootstrap.

### 2.4 Definition of done for a Figma component

Before an engineer picks it up, the component must have: all fills/strokes/radii/spacing bound to semantic variables (zero raw hex, zero raw px), a complete variant matrix including focus and disabled, both Light and Dark modes verified, and a Dev Mode annotation for any behavior not visible in the static frame.

---

## 3. Stage 2 — Getting variables out of Figma

### 3.1 ⟡ DECIDE: which export mechanism

| Option | How | Requires | Verdict |
|---|---|---|---|
| **A. Figma Variables REST API** | `GET /v1/files/:key/variables/local` from a scheduled GitHub Action | ⚠️ **Figma Enterprise plan** + PAT with `file_variables:read` | **Preferred.** Fully automated, no designer action, no plugin licensing, no drift. |
| **B. Tokens Studio plugin** | Designer pushes to a git branch from inside Figma | Tokens Studio Pro seat (~per-editor); works on **any** Figma plan | **Fallback.** Good DX, designer-driven, but adds a paid third-party dependency in the critical path. |
| **C. Manual plugin export** | Designer exports JSON, drops it in a PR | Nothing | Bootstrap only. Acceptable for the first month; **do not ship this as the steady state** — it decays the moment someone is on vacation. |

**Action:** confirm UCSD's Figma plan tier. Enterprise → A. Anything less → B, and budget one Tokens Studio Pro seat for the designer.

Either way the *output* of this stage is identical, so downstream stages (§4 onward) are unaffected by the choice. Pick A or B on cost/plan grounds alone; it is not an architectural decision.

### 3.2 What the sync script does

`scripts/sync-figma.mjs`:

1. Fetch local variables + collections + modes for the file.
2. Filter to published collections (skip `1. Primitives` from *semantic* output, but keep them as a resolvable alias target).
3. Map Figma types → DTCG `$type` (`COLOR`→`color`, `FLOAT`→`dimension`/`number`, `STRING`→`fontFamily`, `BOOLEAN`→ rejected with an error — booleans are not tokens).
4. Convert Figma aliases (`VARIABLE_ALIAS`) → DTCG references (`{palette.blue.60}`). **Preserve the alias — never resolve it to a literal.** A flattened token file destroys the ability to rebrand or theme.
5. Convert Figma RGBA floats → 8-digit hex, dropping `ff` alpha.
6. Emit one file per concern into `tokens/`, stably key-sorted so diffs are readable.
7. Run validation (§3.4) and fail the job on error.

### 3.3 Output shape (DTCG)

Plain [W3C Design Token Community Group](https://tr.designtokens.org/) format — `$value` / `$type` / `$description`. Chosen because Style Dictionary v4, Tokens Studio, and Figma's own tooling all read it, so we are not locked to any one vendor.

```jsonc
// tokens/semantic/color/light.json
{
  "color": {
    "action": {
      "primary": {
        "$value": "{palette.blue.60}",   // alias, not #00629B
        "$type": "color",
        "$description": "Primary interactive fill: buttons, active nav, links."
      }
    }
  }
}
```

### 3.4 Validation gate (runs in CI, blocks the PR)

- Every semantic token resolves to a primitive, in ≤3 hops, with no cycles.
- Every semantic token exists in **both** Light and Dark modes.
- Naming matches the contract regex in [`token-naming-contract.md`](token-naming-contract.md).
- Text/background semantic pairs meet **WCAG 2.2 AA** contrast (4.5:1 body, 3:1 large text and UI boundaries) in both modes. *This is the check that catches an accessibility regression at design time rather than in an audit 8 months later.*
- Token **removals** and renames are flagged as breaking → forces a major version bump.

---

## 4. Stage 3 — One source, N targets

`packages/tokens` runs Style Dictionary v4 over `tokens/` and emits:

| Output | Consumer | Notes |
|---|---|---|
| `dist/css/tokens.css` | Everything | `:root` + `[data-bs-theme=dark], .dark` blocks. The universal fallback. |
| `dist/scss/_tokens.scss` | `@ucsd/bootstrap` | Compile-time Sass vars — Bootstrap needs values, not `var()`, to compute its own maps. |
| `dist/tailwind/theme.css` | Tailwind v4 / shadcn | A `@theme` block, namespaced so Tailwind generates real utilities. |
| `dist/js/tokens.js` + `.d.ts` | React, RN, charts, canvas | Typed. |
| `dist/tokens.json` | **The docs + skill generator** | Flat, resolved. This is what makes LLM docs impossible to drift. |

Cross-framework consistency is a *property of the build*, not of anyone's discipline.

---

## 5. Stage 4 — Components: the human step, made durable

Components are written **once, by hand**, per target (Bootstrap 5 HTML/Sass; React in the shadcn registry). Then we make Figma point at that code so it never has to be guessed at again:

### 5.1 Figma Code Connect

[Code Connect](https://www.figma.com/code-connect-docs/) maps a Figma component to a real code snippet from this repo. Once published, Dev Mode shows **our** `<Button variant="primary">` instead of a generic autogenerated div soup — for every developer and every AI agent reading that file.

```ts
// packages/registry/button/button.figma.tsx
figma.connect(Button, 'https://figma.com/design/<KEY>?node-id=<ID>', {
  props: {
    variant:  figma.enum('Variant', { Primary: 'primary', Secondary: 'secondary' }),
    disabled: figma.boolean('Disabled'),
    label:    figma.string('Label'),
  },
  example: ({ variant, disabled, label }) =>
    <Button variant={variant} disabled={disabled}>{label}</Button>,
})
```

Code Connect supports **HTML as well as React**, so we publish two mappings per component — one for the Bootstrap 5 markup, one for the React registry component. A developer in Dev Mode sees the snippet for the stack they're actually in.

> Cost note: Code Connect is a per-component, ~20-line file. Do it for the ~20 highest-traffic components; skip the long tail. The value is concentrated.

### 5.2 Dev Mode MCP (the "build this screen" moment)

Figma's Dev Mode MCP server runs locally (`http://127.0.0.1:3845/mcp`) and exposes the current selection to an agent: `get_code`, `get_variable_defs`, `get_code_connect_map`, `get_image`. ⚠️ Verify seat/plan requirements against current Figma docs before promising this to the team.

**It is a complement to the skill, not a replacement.** Division of labor:

- **Dev Mode MCP** answers *"what does this specific frame look like?"*
- **The skill** answers *"what are we allowed to build, and with which tokens, patterns and a11y rules?"*

Used alone, Dev Mode MCP produces plausible code full of raw hex values. Used with the skill, it produces code on our tokens. Both, always.

### 5.3 The three-file rules convention

The article above recommends a `.ai/` folder of three rules files. We adopt the *idea* and put it where Claude Code actually looks, so there's one copy rather than two that disagree:

| Article's file | Our equivalent |
|---|---|
| `README.md` (stack + principles) | `skills/ucsd-design-system/SKILL.md` — the router |
| `design-system-rules.md` | `references/generated/tokens.md` + `references/components.md` |
| `figma-mcp-rules.md` | `references/figma-workflow.md` |

For non-Claude tools (Cursor, Copilot), `scripts/generate-skill-references.mjs` also emits `.ai/` and `llms.txt` from the same source. One truth, several file names.

---

## 6. Stage 5 — Layouts and CMS patterns

Page layouts are **not** derived from tokens and **not** generated from Figma. They are hand-written specs in `layouts/`, because a layout's real content is rules that don't exist in a Figma frame: which regions are required, what a CMS author may put in each, how it degrades at 320px, what the content model fields are.

Each pattern file carries: purpose and when-to-use, region anatomy, grid behavior, the allowed component set per region, responsive rules, **CMS content-model field mapping**, a11y landmarks, and a reference HTML skeleton in both Bootstrap 5 and Tailwind.

Figma's role for layouts is to supply the visual reference frame that the spec is written against. See [`docs/layouts.md`](layouts.md).

---

## 7. Governance

**Cadence.** Sync job runs nightly and on demand. A token change opens a PR titled `chore(tokens): figma sync <date>` with a rendered before/after swatch diff.

**Approval.** Token PRs need one design approval (values are the designer's call) and one engineering approval (breaking-change assessment). Neither alone.

**Versioning.** Semver on `@ucsd/tokens`:
- **patch** — value changed, name unchanged
- **minor** — token added
- **major** — token renamed or removed, or a semantic meaning changed

**CDN.** `@ucsd/bootstrap` publishes immutable versioned URLs (`.../ucsd/2.1.0/ucsd-bootstrap.css`) plus a floating `.../ucsd/2/...` major-line alias. Decorator V5's mutable `5.0.2` path is the anti-pattern we're fixing — consumers currently cannot pin.

**Breaking changes** ship with a codemod or a documented find/replace table in the release notes. Never a bare "we renamed things."

---

## 8. Known failure modes

| Failure | Prevention |
|---|---|
| Docs drift from tokens; LLM emits last quarter's hex | `references/generated/` is a build artifact; CI fails if regenerating produces a diff |
| Designer binds to primitives; dark mode breaks | Validation gate §3.4 |
| Someone hand-edits `dist/` | `dist/` gitignored; built in CI |
| Bidirectional sync fight | One-way by construction; no write scope on the Figma token |
| Bootstrap and React drift apart visually | Both compile from the same `tokens.json`; visual regression on the kitchen sink in CI |
| Token sprawl (400 tokens nobody uses) | Semantic layer is curated, additions need design review; primitives stay hidden |
| Figma plan change kills the API path | DTCG is vendor-neutral; swapping to Tokens Studio only replaces §3.1 |

---

## 9. Rollout

| Phase | Work | Exit criterion | Owner |
|---|---|---|---|
| **0** | Agree the naming contract + collection structure with the designer | Designer's Figma file restructured into 3 collections; §2.4 met for 3 pilot components | Design + Eng |
| **1** | `tokens/` + Style Dictionary + validation CI | `npm run build` produces all 5 outputs; contrast gate green | Eng |
| **2** | Figma sync automated | A color change in Figma opens a PR unaided | Eng |
| **3** | Bootstrap 5 theme + versioned CDN | One real page renders with zero Decorator CSS | Eng |
| **4** | Docs site + `llms.txt` + generated skill; publish to Skills Library | An agent builds a compliant page from the skill alone | Eng |
| **5** | shadcn registry + Code Connect on top ~20 components | `npx shadcn add` works from `design.ucsd.edu/r/` | Eng |
| **6** | CMS layout patterns | Content and landing templates in production | CMS + Design |

Phases 3–6 are independent once 1–2 land, so they can run in parallel across people.

**Phase 0 is the urgent one.** It costs about a week and it is nearly free right now; every week the designer builds components under an ad-hoc naming scheme is a week of manual remapping later.
