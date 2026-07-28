# Figma → code

How a design decision made in Figma becomes working code in Bootstrap 5, Tailwind/shadcn, the CMS, and `DESIGN.md` — repeatably, without anyone retyping a hex code.

> **Status:** plan of record. The build and validation are wired; the sync itself is not. Decision gates are marked **⟡ DECIDE**.
>
> **Designers:** [§2](#2-the-figma-authoring-contract) is written for you and stands alone. The rest is engineering plumbing.

---

## 0. Principles

1. **One-way sync.** Figma → git. Never git → Figma, never bidirectional. Bidirectional token sync is the single most common way these systems rot.
2. **Figma owns *values*. Code owns *implementations*.** The boundary is absolute (§1).
3. **Every sync is a pull request.** A token change is a reviewable diff with a version bump, not a live CDN mutation. This is the biggest single improvement over Decorator V5.
4. **Generated artifacts are never hand-edited.** If you find yourself editing `packages/tokens/dist/`, `DESIGN.md`'s frontmatter, or `references/generated/`, the generator is wrong — fix the generator.
5. **Design system code is boring on purpose.** A new engineer should be able to trace a hex value from Figma to a rendered pixel in five minutes.

---

## 1. The boundary: what lives where

This table is the most important thing in this document. Most design-system failures are boundary failures.

| Artifact | Owner | Source of truth | Sync mechanism |
|---|---|---|---|
| Color / space / type / radius / elevation / motion **values** | Designer | Figma Variables | Automated (§3) |
| Token **names** | Joint contract | [`token-naming-contract.md`](token-naming-contract.md) | Reviewed in PR |
| Design **intent** — what the brand should feel like | Joint | [`design-md/`](design-md/README.md) → `DESIGN.md` prose | Hand-written |
| Component **visual spec** (anatomy, variants, states) | Designer | Figma component set | Manual, spec-driven (§5) |
| Component **implementation** (HTML/CSS/JSX) | Engineer | `packages/` | Hand-written, reviewed |
| Component **a11y contract** (roles, focus, keyboard) | Engineer | [`accessibility.md`](accessibility.md) | Hand-written |
| Page **layouts / CMS patterns** | Joint | [`layouts/`](layouts/README.md) | Hand-written spec |
| Content model / field names | CMS team | [`layouts/`](layouts/README.md) | Hand-written spec |

**Corollary:** we do *not* generate components from Figma. Generated components leak absolute positioning, magic numbers, and no accessibility. Figma tells us *what it should look like*; a human writes the component once, correctly, and Code Connect (§5) makes Figma point at that human-written code forever after.

---

## 2. The Figma authoring contract

**For the designer.** The pipeline is only as good as the file hygiene upstream. These are requirements, not suggestions — and they have to happen **before** the component library is finished. Restructuring 300 variables after the fact is days of work; doing it right the first time is close to free.

**The one-line version:** name things by *what they're for*, not *what they look like*, and bind every component to those names.

### 2.1 Three variable collections

| # | Collection | Publish? | What goes in it |
|---|---|---|---|
| 1 | `1. Primitives` | **Hidden** | The raw palette and raw scale. Every actual colour value lives here — and *only* here. |
| 2 | `2. Semantic` | **Published** | What components bind to. Every value is an alias pointing at a primitive. |
| 3 | `3. Component` | Published | Rare. Only when one component needs a knob that doesn't belong in the semantic layer. |

> **The rule everything depends on: a component layer may only bind to `2. Semantic` or `3. Component`. Never to `1. Primitives`.**

If a button's fill points at `blue/500`, a brand decision is hard-coded into that button, and dark mode, a rebrand and a high-contrast theme each require touching every component. If it points at `color/action/primary`, all three are a one-line change. Primitives are the paint box; semantics are the decision about where paint goes.

The sync script flags a primitive binding as an error (§3.3).

### 2.2 Naming

Slash-delimited, lowercase, hyphens between words: `color/action/primary-hover`. State goes **last**.

Primitives describe appearance — `palette/blue/50…900` (500 is brand blue), `palette/navy/500…950` (900 is brand navy), `palette/gold/100…700` (500 is brand gold), plus `neutral`, `green`, `amber`, `red`, `white`, `black`. Higher number = darker.

Semantics describe purpose, and are a **closed set**:

| Group | Members |
|---|---|
| `color/surface/…` | `default` `subtle` `raised` `sunken` `inverse` |
| `color/text/…` | `default` `muted` `subtle` `inverse` `link` `link-hover` |
| `color/border/…` | `default` `subtle` `strong` `focus` |
| `color/action/…` | `primary` `primary-hover` `primary-active` `secondary` `secondary-hover` `secondary-active` `disabled` |
| `color/status/…` | `info` `success` `warning` `danger` — each with `-subtle` (backgrounds) and `-strong` (text/icons) |
| `color/brand/…` | `navy` `blue` `gold` — **logo, wordmark and seal only** |
| `space/…` | `0 1 2 3 4 5 6 7 8 10 12 16 20 24` (multiples of 4, so `space/4` = 16px) |
| `radius/…` | `none sm md lg xl pill circle` |
| `elevation/…` | `0 1 2 3 4` |
| `font/family/…` · `font/weight/…` | `sans display mono` · `regular medium semibold bold` |
| `text/…` | `xs sm md lg xl 2xl 3xl 4xl 5xl` — each with a size **and** a line-height |
| `breakpoint/…` | `sm md lg xl xxl` — **576 / 768 / 992 / 1200 / 1400, fixed** |

Three worth flagging: `color/brand/*` is tiny on purpose (reaching for it to style a button means you want `color/action/primary`); breakpoints must match Bootstrap's exactly or utilities and layouts disagree in ways that take days to debug; and adding a semantic category is a real conversation, because each one multiplies across every framework.

Avoid: `color/blue` as a semantic (the name becomes a lie after a rebrand), `space/small` (relative to what? doesn't sort), `text/h1` (an `<h1>` isn't always the biggest text), `color/button/blue/bg/hover/dark` (five things in one name — use a semantic plus a mode).

Full rationale and the validation regex: [`token-naming-contract.md`](token-naming-contract.md).

### 2.3 Light and dark mode

Two modes — `Light` and `Dark` — **on the `2. Semantic` collection only**. Primitives have one mode.

Dark mode is done by **re-pointing aliases**, never by adding tokens:

| Token | Light points at | Dark points at |
|---|---|---|
| `color/surface/default` | `palette/white` | `palette/navy/950` |
| `color/text/default` | `palette/neutral/900` | `palette/neutral/50` |
| `color/text/link` | `palette/blue/500` | `palette/blue/300` ← lightened, or it fails contrast |

**Every semantic token needs a value in both modes** — the build fails if one is missing, so sweep for gaps before handing off. This is genuinely new capability: Decorator V5 cannot express dark mode at all.

⟡ **DECIDE:** a `Density: Comfortable | Compact` mode? Real value for data-dense admin apps, real cost on every token. Recommendation: **not in v1** — modes are additive and non-breaking, so it can come later.

### 2.4 Component hygiene

These five habits are what let a coding agent turn a frame into decent code instead of absolutely-positioned divs.

1. **Semantic layer names.** `CardHeader`, not `Frame 74`. Layer names become the vocabulary in generated code and the prop names Code Connect infers.
2. **Auto Layout everywhere.** It translates directly to flexbox — direction, gap, alignment, padding. Absolute positioning translates to nothing useful and forces the tool to guess.
3. **Flat hierarchy.** Every gratuitous wrapper frame becomes a gratuitous `<div>`.
4. **Variants for states,** named to match code: `State = Default | Hover | Focus | Active | Disabled`. Don't skip **Focus** — it's an accessibility requirement and the state most often missing from design files.
5. **Boolean properties for optional parts:** `hasIcon`, `hasDescription`. These become props one-to-one.

Component set names match the code name exactly: Figma `Button` ↔ `<Button>` ↔ `.btn`.

### 2.5 Definition of done

Before engineering picks up a component:

- [ ] Every fill, stroke, radius and spacing value **bound to a semantic variable** — zero raw hex, zero raw px
- [ ] Nothing bound directly to `1. Primitives`
- [ ] Full variant matrix, **including focus and disabled**
- [ ] Renders correctly in **both** Light and Dark
- [ ] Auto Layout throughout, layers named semantically
- [ ] A Dev Mode annotation for anything a static frame can't show — submit behaviour, empty state, what animates

### 2.6 To start, we need three things

1. **The `2. Semantic` collection populated**, even if component designs aren't finished. Tokens unblock all the engineering work; components can follow. This is the critical path.
2. **The Figma file key** — the string in the URL: `figma.com/design/`**`THIS_PART`**`/File-Name`.
3. **Confirmation of the Figma plan tier** (see §3.1).

Open questions for design — display face, density mode, icon set, sub-brand scope — are tracked in [`architecture.md`](architecture.md) so there is one list rather than two.

---

## 3. Getting variables out of Figma

### 3.1 ⟡ DECIDE: which export mechanism

| Option | How | Requires | Verdict |
|---|---|---|---|
| **A. Figma Variables REST API** | `GET /v1/files/:key/variables/local` from a scheduled Action | ⚠️ **Figma Enterprise plan** + PAT with `file_variables:read` | **Preferred.** Fully automated, no designer action, no plugin licensing. |
| **B. Tokens Studio plugin** | Designer pushes to a git branch from inside Figma | Tokens Studio Pro seat; works on **any** Figma plan | **Fallback.** Good DX, but a paid third-party dependency in the critical path. |
| **C. Manual plugin export** | Designer exports JSON, drops it in a PR | Nothing | Bootstrap only. **Do not ship as the steady state** — it decays the moment someone is on vacation. |

The *output* of this stage is identical either way, so downstream is unaffected. Pick on cost and plan tier alone; it is not an architectural decision.

### 3.2 What the sync script does

`scripts/sync-figma.mjs`:

1. Fetch local variables, collections and modes.
2. Filter to published collections (skip `1. Primitives` from semantic output, keep them as a resolvable alias target).
3. Map Figma types → DTCG `$type` (`COLOR`→`color`, `FLOAT`→`dimension`/`number`, `STRING`→`fontFamily`, `BOOLEAN`→ rejected; booleans are not tokens).
4. Convert Figma aliases (`VARIABLE_ALIAS`) → DTCG references (`{palette.blue.500}`). **Preserve the alias — never resolve it to a literal.** A flattened token file destroys the ability to rebrand or theme.
5. Convert Figma RGBA floats → hex.
6. Emit one file per concern into `tokens/`, stably key-sorted so diffs are readable.
7. Run validation (§3.3) and fail the job on error.

Output is plain [W3C DTCG](https://tr.designtokens.org/) — `$value` / `$type` / `$description` — chosen because Style Dictionary, Tokens Studio and Figma tooling all read it, so no one vendor is load-bearing.

```jsonc
// tokens/semantic/color/light.json
{
  "color": {
    "action": {
      "primary": {
        "$value": "{palette.blue.500}",   // alias, not #00629b
        "$type": "color",
        "$description": "Primary interactive fill: buttons, active nav, links."
      }
    }
  }
}
```

### 3.3 Validation gate (blocks the PR)

`scripts/validate-tokens.mjs`:

- Every semantic token resolves to a primitive, in ≤3 hops, with no cycles.
- Every semantic token exists in **both** Light and Dark modes.
- Naming matches the contract regex.
- Text/background pairs meet **WCAG 2.2 AA** (4.5:1 body, 3:1 large text and UI boundaries) in both modes.
- Token removals and renames are flagged as breaking → forces a major version bump.

The contrast check earns its keep. It caught a real defect on first run: dark-mode `text.inverse` on `action.primary` was 4.21:1, under the 4.5:1 minimum. That would have shipped and surfaced in an audit months later.

---

## 4. One source, N targets

`packages/tokens` runs Style Dictionary over `tokens/` and emits `dist/css/tokens.css`, `dist/scss/_tokens.scss`, `dist/tailwind/theme.css`, `dist/js/tokens.js` + `.d.ts`, and `dist/tokens.json`.

From `dist/tokens.json`, two generators run:

| Output | Consumer |
|---|---|
| `DESIGN.md` | **Any coding agent.** Generated frontmatter over hand-written prose from [`design-md/`](design-md/README.md); see [architecture D10](architecture.md). |
| `references/generated/`, `llms.txt` | The Claude Skill and the `llms.txt` convention. Rules are extracted from `DESIGN.md`, never retyped. |

Cross-framework consistency is a *property of the build*, not of anyone's discipline.

---

## 5. Components: the human step, made durable

Components are written **once, by hand**, per target. Then Figma is made to point at that code so it never has to be guessed at again.

### 5.1 Figma Code Connect

[Code Connect](https://www.figma.com/code-connect-docs/) maps a Figma component to a real snippet from this repo. Once published, Dev Mode shows **our** `<Button variant="primary">` instead of generated div soup — for every developer and every agent reading that file.

```ts
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

Code Connect supports HTML as well as React, so we publish two mappings per component — one for Bootstrap 5 markup, one for React. Cost is ~20 lines per component; do it for the highest-traffic ones and skip the long tail.

### 5.2 Dev Mode MCP, and how to build from a frame

Figma's Dev Mode MCP server runs locally and exposes the current selection: `get_code`, `get_variable_defs`, `get_code_connect_map`, `get_image`. ⚠️ Verify seat and plan requirements against current Figma docs before promising this to the team.

**It complements `DESIGN.md`; it does not replace it.** Dev Mode MCP answers *"what does this frame look like?"* — `DESIGN.md` answers *"what are we allowed to build, with which tokens and rules?"* Used alone, Dev Mode MCP produces plausible code full of raw hex values.

A Figma frame is the **visual** answer, not the implementation answer:

| Authoritative | Not authoritative |
|---|---|
| Layout structure and hierarchy | Absolute positioning (exported, almost never right) |
| Which component is used where | Generated class names and div nesting |
| Variant / state selection | Raw hex and px — map to tokens |
| Copy and content | Font stacks — use `font.family.*` |
| Responsive intent (via Auto Layout) | Breakpoints — use the `breakpoint.*` scale |

Procedure:

1. **Get the variables, not the pixels.** Call `get_variable_defs` on the selection first — it returns the *token names* the designer bound, which map straight to `--ucsd-*`. Highest-value step, most often skipped.
2. **Check `get_code_connect_map`.** If the component already exists in code, use it — don't regenerate from the frame.
3. **Translate remaining literals to tokens.** Look them up in `DESIGN.md`. If a value has no token, don't invent one — flag it. An unmapped value is either a designer error or a genuine gap worth raising.
4. **Rebuild the layout in flow.** Auto Layout → flexbox/grid; fixed frame widths → container tokens. Discard absolute positioning unless the design genuinely calls for overlay.
5. **Add what the frame can't show:** focus, keyboard behaviour, error/empty/loading states, reduced motion. A static frame shows one state of many; the rest are yours, not omissions by the designer.
6. **Validate:** `npm run validate <files>`.

If Dev Mode output shows a **primitive** binding (`blue/500`, `palette/*`), that's a design-file defect — the component was bound to the paint box. Use the matching semantic token and mention it, or dark mode breaks.

---

## 6. Governance

**Cadence.** Sync runs nightly and on demand. A token change opens a PR titled `chore(tokens): figma sync <date>` with a rendered before/after swatch diff.

**Approval.** One design approval (values are the designer's call) and one engineering approval (breaking-change assessment). Neither alone.

**Versioning.** Semver on `@ucsd/tokens`: **patch** = value changed; **minor** = token added; **major** = token renamed, removed, or its meaning changed.

**CDN.** `@ucsd/bootstrap` publishes immutable versioned URLs plus a floating major-line alias. Decorator V5's mutable `5.0.2` path is the anti-pattern being fixed — consumers currently cannot pin.

**Breaking changes** ship with a codemod or a documented find/replace table. Never a bare "we renamed things."

---

## 7. Known failure modes

| Failure | Prevention |
|---|---|
| Docs drift from tokens; an agent emits last quarter's hex | `DESIGN.md` and `references/generated/` are build artifacts; CI fails if regenerating produces a diff |
| Prose restates a token value, then the value changes | Prose in `design-md/` names tokens but never carries values; the generator fails the build on a literal hex or dimension outside a code fence |
| A rule gets copied to a second surface and the two disagree | Rules live once, in `design-md/08-dos-and-donts.md`; `llms.txt` and the skill extract them |
| Designer binds to primitives; dark mode breaks | Validation gate §3.3 |
| Someone hand-edits `dist/` | `dist/` is generated; CI diff check |
| Bidirectional sync fight | One-way by construction; no write scope on the Figma token |
| Bootstrap and React drift apart visually | Both compile from the same `tokens.json`; contract tests pin the shared values |
| Token sprawl (400 tokens nobody uses) | Semantic layer is a curated closed set; primitives stay hidden |
| Figma plan change kills the API path | DTCG is vendor-neutral; swapping to Tokens Studio replaces only §3.1 |

---

## 8. Rollout

| Phase | Work | Exit criterion |
|---|---|---|
| **0** | Agree the naming contract and collection structure with the designer | Figma file restructured into 3 collections; §2.5 met for 3 pilot components |
| **1** | `tokens/` + Style Dictionary + validation CI | `npm run build` produces every target; contrast gate green |
| **2** | Figma sync automated | A colour change in Figma opens a PR unaided |
| **3** | Bootstrap 5 theme + versioned CDN | One real page renders with zero Decorator CSS |
| **4** | Publish the skill to the Skills Library | An agent builds a compliant page from `DESIGN.md` alone |
| **5** | shadcn registry + Code Connect on the top components | `npx shadcn add` works from `design.ucsd.edu/r/` |
| **6** | CMS layout patterns | Content and landing templates in production |

Phases 3–6 are independent once 1–2 land. **Phase 0 is the urgent one** — it costs about a week and is nearly free right now; every week the designer builds under an ad-hoc naming scheme is a week of manual remapping later.
