# Token Naming Contract

The document design and engineering both sign. Everything downstream — CSS variable names, Sass variables, Tailwind utilities, `DESIGN.md` — is mechanically derived from these names.

**The names are the designer's.** They come from the Figma file and the sync adopts them as-is, because Figma is the source of truth and a translation layer in between would drift. What the sync does normalise is purely mechanical: lowercasing, spaces to hyphens, and collapsing a leaf that repeats its group (`navy/navy-500` → `navy.500`).

---

## Four tiers

| Tier | Figma collection | Answers | Referenced by components? | Example |
|---|---|---|---|---|
| **Brand** | `colors-brand` | "What are the UCSD colours?" | **Never** | `brand.core.navy` |
| **Primitive** | `colors-primitive` | "What tints and shades exist?" | **Never** | `palette.primary.blue.500` |
| **Semantic** | `colors-semantic` | "What is this *for*?" | **Always** | `color.component.btn-primary` |
| **Code-owned** | — | "What can't Figma express?" | Always | `breakpoint.md`, `elevation.2` |

Brand is the paint. Primitives are the mixed tints. Semantics are the decision about where paint goes.

### Why components never touch brand or primitive

Bind a button to `palette.primary.blue.500` and a brand decision is hard-coded into that button. Dark mode, a rebrand and a high-contrast theme then each require touching every component. Bind it to `color.component.btn-primary` and all three are a re-alias in one place.

This is also the highest-leverage thing for agent output quality: `color-component-btn-primary` states its intent, so a model picks it correctly without reading docs. `blue-500` requires the model to *know* that blue-500 is the button colour — which it doesn't, so it guesses.

The validation gate enforces it: a semantic colour holding a literal instead of an alias fails `npm run test:tokens`.

---

## Shape

Rendered as CSS custom properties with the `ucsd` prefix:

| Token path | CSS custom property | Sass |
|---|---|---|
| `brand.core.navy` | `--ucsd-brand-core-navy` | `$ucsd-brand-core-navy` |
| `palette.primary.blue.500` | `--ucsd-palette-primary-blue-500` | `$ucsd-palette-primary-blue-500` |
| `color.component.btn-primary` | `--ucsd-color-component-btn-primary` | `$ucsd-color-component-btn-primary` |
| `space.large` | `--ucsd-space-large` | `$ucsd-space-large` |
| `type.h1.font-size` | `--ucsd-type-h1-font-size` | `$ucsd-type-h1-font-size` |

**Rules.** Lowercase `kebab-case` segments, enforced by the sync. US spelling.

**Validation regex** (enforced by `scripts/validate-tokens.mjs`):

```
^[a-z][a-z0-9]*(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)*$
```

The first segment must start with a letter; later segments may start with a digit, because numeric scale steps are the norm — `palette.primary.navy.500`, `space.2x-large`, `elevation.1`.

---

## The semantic vocabulary

Six groups, from the `colors-semantic` collection. Adding one is a design + engineering conversation, because each addition multiplies across every framework target.

| Group | Purpose | Members |
|---|---|---|
| `color.theme.*` | Brand identity | `primary` (navy) `secondary` (blue) `accent` (yellow) |
| `color.surface.*` | What sits behind content | `background` (outer chrome) `1` (content) `2` (raised) |
| `color.foreground.*` | Text, rules and borders | `heading-1..3` `subheading` `eyebrow` `heading-light` `body-text` `body-text-focus` `divider` `card-border` `subcard-border` `surface-text-bg` |
| `color.component.*` | What a control is made of | `btn-primary\|secondary\|tertiary` + matching `btn-label-*`, `link` `icon` `menu` `menu-bottom-nav` `bg-progress-bar` |
| `color.system.*` | Feedback messaging | `success` `warning` `error` `information`, each with a `bg-` and `foreground-` pair |
| `color.status.*` | Standalone state marks | `good` `warning` `critical` |

> `color.theme.*` is brand identity. If you are reaching for it to style a button, you want `color.component.btn-*`.

### `space.*` · `radius.*` · `type.*`

- **`space.*`** — t-shirt sized: `extra-small` `small` `medium` `large` `extra-large` `2x-large` `3x-large` `4x-large` (4 → 48px). Bootstrap's numeric `.p-1`…`.p-8` map onto these in `_bridge.scss`.
- **`radius.*`** — Figma defines `default` (12px); `none` `sm` `lg` `pill` are code-owned for Bootstrap's component API.
- **`type.*`** — roles, not a numeric ramp: `h1` `h2` `h2-small` `h3` `subheading` `eyebrow` `button` `body.small|medium|large`. Each carries `font-size`, `line-height`, `font-weight`, `font-family`, `tracking`.

Type roles are named after their use rather than their scale. That is not what this document originally prescribed — an `<h1>` isn't always the largest text on a page — but it is what the design library is built on, and forcing a rename would mean rebinding every component for little gain.

### Code-owned groups

`breakpoint.*` (**must** match Bootstrap 5's 576/768/992/1200/1400), `container.*`, `elevation.*`, `motion.*`. See [`../tokens/README.md`](../tokens/README.md) for why each cannot be a Figma variable.

---

## Dark mode

Dark mode is **a mode on the semantic collection**, not a set of new tokens.

✅ `color.surface.1` = `{palette.neutral.white}` in Light, `{palette.neutral.gray.950}` in Dark
❌ A `color.surface.1-dark` token

Consequence: **every semantic token must have a value in both modes.** CI enforces it. Brand and primitives have one value and never change per theme.

---

## Anti-patterns

| Don't | Why | Instead |
|---|---|---|
| Bind a component to `palette.*` | Hard-codes a tint; breaks dark mode and rebranding | A `color.*` semantic token |
| Add a `-dark` suffixed token | Duplicates the whole palette | Re-alias in `semantic.dark.json` via Figma's Dark mode |
| Hand-edit `tokens/figma/` | Overwritten by the next sync, silently | Change it in Figma |
| Invent a breakpoint | Bootstrap and Tailwind stop agreeing | The `breakpoint.*` scale |
| Two scales that nearly agree | Guaranteed 1px drift between frameworks | One scale, referenced everywhere |
