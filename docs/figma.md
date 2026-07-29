# Figma → code

How a design decision made in Figma becomes working code in Bootstrap 5, Tailwind/shadcn, the CMS, and `DESIGN.md` — repeatably, without anyone retyping a hex code.

> **Status:** live. The sync runs against the designer's real Figma export; `tokens/` holds real UCSD values.
>
> **Designers:** [§2](#2-the-figma-authoring-contract) is written for you and stands alone. The rest is engineering plumbing.

---

## 0. Principles

1. **One-way sync.** Figma → git. Never git → Figma, never bidirectional. Bidirectional token sync is the single most common way these systems rot.
2. **Figma owns *values*. Code owns *implementations*.** The boundary is absolute (§1).
3. **Every sync is a pull request.** A token change is a reviewable diff, not a live CDN mutation. This is the biggest single improvement over Decorator V5.
4. **Generated artifacts are never hand-edited.** If you find yourself editing `tokens/figma/`, `packages/tokens/dist/`, or `DESIGN.md`'s frontmatter, the generator is wrong — fix the generator.
5. **The designer never touches git.** He exports from Figma and hands over files. Everything after that is a maintainer's job.

---

## 1. The boundary: what lives where

This table is the most important thing in this document. Most design-system failures are boundary failures.

| Artifact | Owner | Source of truth | Mechanism |
|---|---|---|---|
| Colour / spacing / radius / type **values** | Designer | Figma Variables | Automated (§3) |
| Token **names** | Designer, adopted as-is | The Figma file | Normalised mechanically by the sync |
| Breakpoints, shadows, easings, containers | Engineer | `tokens/code/` | Hand-written — Figma cannot express them |
| Design **intent** — what the brand should feel like | Joint | [`design-md/`](design-md/README.md) → `DESIGN.md` prose | Hand-written |
| Component **visual spec** | Designer | Figma component set | Manual, spec-driven (§5) |
| Component **implementation** | Engineer | `packages/` | Hand-written, reviewed |
| Component **a11y contract** | Engineer | [`accessibility.md`](accessibility.md) | Hand-written |
| Page **layouts / CMS patterns** | Joint | [`layouts/`](layouts/README.md) | Hand-written spec |

**Corollary:** we do *not* generate components from Figma. Generated components leak absolute positioning, magic numbers, and no accessibility. Figma tells us *what it should look like*; a human writes the component once, correctly.

---

## 2. The Figma authoring contract

**For the designer.** The pipeline reads the file as it is, so file hygiene upstream is the whole game.

### 2.1 The collections

Five, and this is the structure the sync expects:

| Collection | Modes | Contains |
|---|---|---|
| `colors-brand` | Value | The raw UCSD palette — `core/navy`, `core/blue`, `core/yellow`, `core/gold`, accents, neutrals. **Hidden from publishing.** |
| `colors-primitive` | Mode 1 | 50–900 ramps per hue. The `-500` step of each aliases its `colors-brand` colour. **Hidden.** |
| `colors-semantic` | **Light mode / Dark mode** | What components bind to: `theme/*`, `surface/*`, `foreground/*`, `component/*`, `system/*`, `status/*`. Every value aliases `colors-primitive`. **Published.** |
| `layout` | Mode 1 | `border-radius`, `spacing/*` |
| `typography` | Mode 1 | One group per role — `h1`, `body/small`, `button` — each with size, line-height, tracking, weight, family |

> **The rule everything depends on: a component layer binds only to `colors-semantic`. Never to `colors-primitive` or `colors-brand`.**

If a button's fill points at `blue/500`, a brand decision is hard-coded into that button, and dark mode, a rebrand and a high-contrast theme each require touching every component. If it points at `component/btn-primary`, all three are a one-line change.

The sync reports a semantic colour bound to a raw value, and `npm run test:tokens` fails on it.

### 2.2 Naming

Slash-delimited: `component/btn-label-primary`. The sync lowercases, turns spaces into hyphens, and collapses a leaf that repeats its group (`navy/navy-500` → `navy.500`).

That means **spaces and stray capitals are tolerated but not encouraged** — `neutral/cool gray` and `Gray-950` both sync fine, they just read inconsistently next to their siblings. Renaming is cheap while the library is young.

The full vocabulary, and what each group is for, is in [`token-naming-contract.md`](token-naming-contract.md).

### 2.3 Light and dark mode

Two modes on `colors-semantic` only. Dark mode is done by **re-pointing aliases**, never by adding tokens:

| Token | Light points at | Dark points at |
|---|---|---|
| `surface/surface-1` | `neutral/white` | `neutral/gray/Gray-950` |
| `foreground/body-text` | `neutral/gray/gray-600` | `neutral/gray/gray-350` |

**Every semantic token needs a value in both modes** — the build fails if one is missing.

### 2.4 Component hygiene

These habits are what let a coding agent turn a frame into decent code instead of absolutely-positioned divs.

1. **Semantic layer names.** `CardHeader`, not `Frame 74`.
2. **Auto Layout everywhere.** It translates directly to flexbox. Absolute positioning translates to nothing useful.
3. **Flat hierarchy.** Every gratuitous wrapper frame becomes a gratuitous `<div>`.
4. **Variants for states**, including **Focus** — an accessibility requirement and the state most often missing from design files.
5. **Component set names match the code name exactly.** Figma `Button` ↔ `<Button>` ↔ `.btn`. Code Connect would normally automate this mapping, but it needs an Organization plan we do not have (§5.1) — so this convention is the *only* signal an agent gets. It is load-bearing.

### 2.5 Definition of done

- [ ] Every fill, stroke, radius and spacing value **bound to a `colors-semantic` variable** — zero raw hex, zero raw px
- [ ] Nothing bound directly to `colors-primitive` or `colors-brand`
- [ ] Full variant matrix, **including focus and disabled**
- [ ] Renders correctly in **both** Light and Dark
- [ ] Auto Layout throughout, layers named semantically

---

## 3. The sync

### 3.1 How values leave Figma

UCSD is on **Figma Professional**, which rules out the Variables REST API (Enterprise-gated) but includes everything we need. Figma's **native DTCG export** does the whole job:

> Right-click a variable collection → **Export modes**. One JSON file per mode, in the same DTCG format `tokens/` already uses.

No plugin, no licence, no recurring cost. This is the payoff from choosing DTCG in [D3](architecture.md) — Figma converged on the same standard, so there is nothing in between.

**Requirements:** Professional or higher (variable modes do not exist on Free/Starter), and the file in a **Project**, not Drafts — Figma refuses a second mode for Drafts files even on a paid plan.

### 3.2 The handoff

```
DESIGNER (Figma only — no git, no terminal)
  right-click each collection → Export modes → send the files

MAINTAINER
  drop them in figma-export/<collection>/<Mode>.tokens.json
  npm run sync:figma
  review the diff, commit, open a PR
```

`figma-export/` is committed, so a PR shows exactly what Figma said alongside what we derived from it.

### 3.3 What the sync does

`scripts/sync-figma.mjs`:

1. Reads every mode file, taking the mode name from `$extensions["com.figma.modeName"]` inside the file rather than the filename.
2. **Reconstructs aliases.** Figma resolves every `$value` to a literal and records the alias separately under `$extensions["com.figma.aliasData"]`. A naive reader would flatten the whole system into hex codes and destroy theming; this reads the alias data back into real DTCG references.
3. Normalises names (§2.2) and namespaces each collection by tier, so `colors-brand` and `colors-primitive` can both define `neutral/black` without colliding.
4. Maps Figma's types: `number` → dimension in px, `string` → font family, and font-weight style names (`Heavy`, `bold`) → numeric CSS weights.
5. Writes `tokens/figma/`. Nothing is written if the export cannot be read.

**Defects are reported, not enforced.** An unrecognised font weight is skipped with a warning; a semantic colour bound to a raw hex is flagged. Policy lives in the validation gate, so a designer's mistake surfaces in the check built to describe it rather than blocking the pipeline.

### 3.4 Validation gate (blocks the PR)

`scripts/validate-tokens.mjs`:

- Semantic colours alias a primitive; primitives may alias brand; brand holds literals.
- Aliases resolve, ≤3 hops, no cycles.
- **Mode parity** — every semantic token in both Light and Dark.
- Names match the contract regex.
- **WCAG 2.2 AA contrast** on defined text/background pairs, in both modes.

Accepted defects live in `tokens/known-issues.json` with an owner and a reason. That list is self-cleaning: an entry that stops matching is itself an error, so a fixed issue must be deleted.

The contrast check earns its keep — on the first real sync it found four dark-mode failures in the Figma file, including a 2.79:1 information pair.

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

### 5.1 Figma Code Connect — **not available to us**

[Code Connect](https://www.figma.com/code-connect-docs/) maps a Figma component to a real snippet from this repo, so Dev Mode shows **our** `<Button variant="primary">` instead of generated div soup. It is the ideal answer to "which code component is this frame?"

**It requires the Organization or Enterprise plan.** UCSD is on Professional, so this is out of reach until that changes. Recorded here because it is the obvious thing to reach for and the disappointment is better spent once.

What replaces it, until then: **the component naming convention in [§2.4](#24-component-hygiene) is the only mapping signal we have.** Figma `Button` ↔ `<Button>` ↔ `.btn`, matched exactly. With Code Connect that convention is a convenience; without it, it is load-bearing — an agent has nothing else to go on. Enforce it in design review.

### 5.2 Dev Mode MCP, and how to build from a frame

Figma's MCP server exposes the current selection to an agent: `get_code`, `get_variable_defs`, `get_code_connect_map`, `get_image`.

**Available on Professional — with a caveat that decides whether it is usable at all.** Access is gated by *seat*, not just plan:

| Seat | Limit | Verdict |
|---|---|---|
| View / Collab | ~6 tool calls **per month** | A demo, not a workflow |
| **Dev or Full** | ~200/day, 10/min on Professional | What you need |

Two servers exist: a **remote** one (`mcp.figma.com/mcp`, no local setup, works on all plans) and a **desktop** one (`http://127.0.0.1:3845/mcp`, requires the Figma desktop app open with the MCP server enabled in preferences, and a Dev or Full seat on a paid plan). Prefer remote unless you need selection-based context or your org restricts external MCP endpoints.

For Claude Code, the official plugin bundles the MCP config:

```bash
claude plugin install figma@claude-plugins-official
```

⚠️ Figma has signalled this may become usage-billed; it was free during beta. Verify current billing before building a team workflow on it.

Note that `get_code_connect_map` returns nothing for us (§5.1), so step 2 below is a no-op until UCSD is on Organization or Enterprise.

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
2. **Match the component by name.** Figma `Button` is `<Button>` and `.btn` — check whether it already exists in code before regenerating it from the frame. (`get_code_connect_map` would answer this automatically, but Code Connect needs a plan we don't have; see §5.1.)
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
| Designer binds to primitives; dark mode breaks | Validation gate §3.4 |
| Someone hand-edits `dist/` | `dist/` is generated; CI diff check |
| Bidirectional sync fight | One-way by construction; no write scope on the Figma token |
| Bootstrap and React drift apart visually | Both compile from the same `tokens.json`; contract tests pin the shared values |
| Token sprawl (400 tokens nobody uses) | Semantic layer is a curated closed set; primitives stay hidden |
| Figma plan change kills the API path | DTCG is vendor-neutral; a plugin or the REST API would replace only §3.1 |

---

## 8. Rollout

| Phase | Work | Exit criterion |
|---|---|---|
| **0** | Agree the naming contract and collection structure with the designer | Figma file restructured into 3 collections; §2.5 met for 3 pilot components |
| **1** | `tokens/` + Style Dictionary + validation CI | `npm run build` produces every target; contrast gate green |
| **2** | Figma sync automated | A colour change in Figma opens a PR unaided |
| **3** | Bootstrap 5 theme + versioned CDN | One real page renders with zero Decorator CSS |
| **4** | Publish the skill to the Skills Library | An agent builds a compliant page from `DESIGN.md` alone |
| **5** | shadcn registry | `npx shadcn add` works from `design.ucsd.edu/r/` |
| **6** | CMS layout patterns | Content and landing templates in production |

Phases 3–6 are independent once 1–2 land. **Phase 0 is the urgent one** — it costs about a week and is nearly free right now; every week the designer builds under an ad-hoc naming scheme is a week of manual remapping later.
