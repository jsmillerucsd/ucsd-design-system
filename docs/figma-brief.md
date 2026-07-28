# Figma Brief — for the UX designer

**Everything you need to structure the Figma library so it compiles into working code.**

Hand this over as-is. It is deliberately self-contained: it doesn't assume you've read the rest of the repo.

---

## Why this matters (30 seconds)

We're building the code side to read your Figma file **automatically**. When you change a color in Figma, a pull request opens; when it merges, that color updates in Bootstrap, Tailwind, the CMS, and the documentation our AI coding tools read — all in one commit, with no one retyping hex codes.

That only works if the file is structured a specific way. It's not much extra work, but it has to happen **before** the component library is finished. Restructuring 300 variables after the fact is days of work; doing it right the first time is close to free.

**The one-line version:** name things by *what they're for*, not *what they look like*, and bind every component to those names.

---

## 1. Three variable collections

Create exactly three, in this order.

| # | Collection | Publish? | What goes in it |
|---|---|---|---|
| 1 | `1. Primitives` | **Hidden** | The raw palette and raw scale. Every actual color value lives here — and *only* here. |
| 2 | `2. Semantic` | **Published** | What components use. Every value is an alias pointing at a primitive. |
| 3 | `3. Component` | Published | Rare. Only when one component needs a knob that doesn't belong in the semantic layer. |

### The rule that everything depends on

> **A component layer may only bind to `2. Semantic` (or `3. Component`). Never to `1. Primitives`.**

If a button's fill points at `blue/500`, we've hard-coded a brand decision into that button. Dark mode, a future rebrand, and a high-contrast theme then each require touching every component. If it points at `color/action/primary`, all three are a one-line change.

Think of `1. Primitives` as the paint box and `2. Semantic` as the decision about where paint goes. You mix in the paint box; you paint from the decisions.

---

## 2. Naming

Slash-delimited, lowercase, hyphens between words: `color/action/primary-hover`.

### Primitives — describe appearance

```
palette/blue/50 … 900          (500 = brand blue #00629b)
palette/navy/500 … 950         (900 = brand navy #182b49)
palette/gold/100 … 700         (500 = brand gold #ffcd00)
palette/neutral/50 … 900
palette/green | amber | red    (status hues)
palette/white, palette/black
```

Higher number = darker. Same convention as most modern systems.

### Semantic — describe purpose

This is a **closed set**. If you need a category that isn't here, that's a real conversation to have — not something to add quietly, because each addition multiplies across every framework we support.

| Group | Members |
|---|---|
| `color/surface/…` | `default` `subtle` `raised` `sunken` `inverse` |
| `color/text/…` | `default` `muted` `subtle` `inverse` `link` `link-hover` |
| `color/border/…` | `default` `subtle` `strong` `focus` |
| `color/action/…` | `primary` `primary-hover` `primary-active` `secondary` `secondary-hover` `secondary-active` `disabled` |
| `color/status/…` | `info` `success` `warning` `danger` — each also with `-subtle` (backgrounds) and `-strong` (text/icons) |
| `color/brand/…` | `navy` `blue` `gold` — **logo, wordmark and seal only** |
| `space/…` | `0 1 2 3 4 5 6 7 8 10 12 16 20 24` (multiples of 4px, so `space/4` = 16px) |
| `radius/…` | `none sm md lg xl pill circle` |
| `elevation/…` | `0 1 2 3 4` |
| `font/family/…` | `sans` `display` `mono` |
| `font/weight/…` | `regular medium semibold bold` |
| `text/…` | `xs sm md lg xl 2xl 3xl 4xl 5xl` — each with a size **and** a line-height |
| `breakpoint/…` | `sm md lg xl xxl` — **576 / 768 / 992 / 1200 / 1400, fixed** |

Three things worth flagging:

- **`color/brand/*` is tiny on purpose.** If you're reaching for it to style a button, you want `color/action/primary`.
- **Breakpoints are not negotiable.** They must match Bootstrap's exactly, or utilities and layouts disagree in ways that take days to debug.
- **State goes last:** `color/action/primary-hover`, never `color/action/hover-primary`.

### Please avoid

| Don't | Why |
|---|---|
| `color/blue` as a semantic name | If the brand color ever changes, the name becomes a lie |
| `space/small` | Small relative to what? Doesn't sort or scale |
| `text/h1` | Ties a type size to an HTML tag; an `<h1>` isn't always the biggest text |
| `color/button/blue/bg/hover/dark` | Encodes five things at once — use a semantic + a mode |

---

## 3. Light and dark mode

Add two modes — `Light` and `Dark` — **on the `2. Semantic` collection only**. Primitives have one mode.

Dark mode is done by **re-pointing the aliases**, not by adding new tokens:

| Token | Light points at | Dark points at |
|---|---|---|
| `color/surface/default` | `palette/white` | `palette/navy/950` |
| `color/text/default` | `palette/neutral/900` | `palette/neutral/50` |
| `color/text/link` | `palette/blue/500` | `palette/blue/300` ← lightened, or it fails contrast |

**Every semantic token needs a value in both modes.** Our build fails if one is missing, so it's worth sweeping for gaps before handing off.

This is genuinely new capability — the current Decorator V5 system can't express dark mode at all.

---

## 4. Component hygiene

These five habits are what let an AI tool turn your frame into decent code instead of a pile of absolutely-positioned divs.

1. **Name layers semantically.** `CardHeader`, not `Frame 74`. Layer names become the vocabulary in the generated code — and the prop names we wire up.
2. **Use Auto Layout everywhere.** Auto Layout translates directly to flexbox: direction, gap, alignment, padding. Absolute positioning translates to nothing useful and forces the tool to guess.
3. **Keep the hierarchy flat.** Every unnecessary wrapper frame becomes an unnecessary `<div>`.
4. **Variants for states,** named to match code: `State = Default | Hover | Focus | Active | Disabled`. Please don't skip **Focus** — it's a legal accessibility requirement and it's the state most often missing from design files.
5. **Boolean properties for optional parts:** `hasIcon`, `hasDescription`. These become component props one-to-one.

Component set names should match what we'll call them in code — Figma `Button` ↔ `<Button>` ↔ `.btn`.

---

## 5. Definition of done

Before a component is ready for engineering:

- [ ] Every fill, stroke, radius and spacing value is **bound to a semantic variable** — zero raw hex, zero raw px
- [ ] Nothing binds directly to `1. Primitives`
- [ ] Full variant matrix, **including focus and disabled**
- [ ] Renders correctly in **both** Light and Dark
- [ ] Auto Layout throughout
- [ ] Layers named semantically
- [ ] A Dev Mode annotation for any behavior a static frame can't show — what happens on submit, what the empty state is, what animates

---

## 6. What we need from you to start

Three things, roughly in this order:

1. **The `2. Semantic` collection populated**, even if component designs aren't finished. Tokens unblock all the engineering work; components can follow. This is the critical path.
2. **The Figma file key** — the string in the URL: `figma.com/design/`**`THIS_PART`**`/File-Name`.
3. **Confirmation of our Figma plan tier.** If UCSD is on **Enterprise**, we can pull variables automatically via API and you never think about it again. If not, we'll need one **Tokens Studio Pro** seat for you, and you'll push tokens to git from inside Figma. Either works — it only changes the plumbing.

---

## 7. Questions for you

| # | Question | Why we're asking |
|---|---|---|
| 1 | Keep **Teko** as the display/heading face? | Carried over from Decorator V5. Fine to keep, fine to change — but decide now, since it affects the type ramp. |
| 2 | Do we need a **density mode** (Comfortable / Compact)? | Useful for data-heavy admin screens, but it doubles spacing tokens. Our recommendation: **not in v1** — modes are additive, so we can add it later without breaking anything. |
| 3 | Icon set? | Glyphicons are dead (Bootstrap 3 only). We're assuming **Bootstrap Icons** unless you have a preference. |
| 4 | Any **sub-brands** in scope? (Health, Scripps, Rady) | They have their own identities. Confirming they're out of scope for v1. |

---

## 8. What happens after you hand off

1. We pull your variables and commit them as JSON.
2. A build turns that one source into: CSS variables, Bootstrap 5 Sass, a Tailwind theme, TypeScript types, and the documentation our AI coding tools read.
3. Engineers build each component **once, by hand**, per framework — we don't auto-generate components, because generated components have no accessibility and are unmaintainable.
4. We wire up **Figma Code Connect**, so from then on Dev Mode shows developers our *real* component code instead of generated markup, for every component you've designed.
5. Any color you change afterwards flows through automatically.

**You are the source of truth for values. We are the source of truth for implementations.** Neither side hand-copies from the other.

---

## Reference

The full engineering-side documentation, if you ever want it:

- `docs/token-naming-contract.md` — the naming rules and the reasoning
- `docs/figma-pipeline.md` — the whole pipeline, including what happens when things go wrong
- `layouts/` — page-level patterns (content page, landing page, listing) for the CMS

Questions welcome — especially "why can't I just…", because the answer is usually either a good reason we should have written down, or a rule that deserves to be relaxed.
