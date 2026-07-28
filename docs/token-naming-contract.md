# Token Naming Contract

The one document design and engineering both sign. Everything downstream — CSS variable names, Sass variables, Tailwind utilities, LLM prose — is mechanically derived from these names.

> **Give this to the UX designer before the Figma library is finished.** Renaming 300 variables after the fact is days of work; naming them correctly the first time is free.

---

## Three tiers

| Tier | Answers | Referenced by components? | Example |
|---|---|---|---|
| **Primitive** | "What colors and sizes exist?" | **Never** | `palette.blue.60` |
| **Semantic** | "What is this *for*?" | **Always** | `color.action.primary` |
| **Component** | "What does *this one thing* need?" | Only by that component | `button.primary.bg` |

Primitives are a paint box. Semantics are the decision. Components are the exception.

### Why components never touch primitives

Bind a button to `palette.blue.60` and you have hard-coded a brand decision into a component. Dark mode, a rebrand, or a high-contrast theme then requires touching every component. Bind it to `color.action.primary` and all three are a re-alias in one place.

This is also the single highest-leverage thing for LLM output quality: `color-action-primary` states its intent, so a model picks it correctly without reading docs. `blue-60` requires the model to *know* that blue-60 is the action color — which it doesn't, so it guesses.

---

## Shape

```
{tier-root}.{category}.{concept}.{variant?}.{state?}
```

Rendered as CSS custom properties with the `ucsd` prefix:

| Token path | CSS custom property | Sass |
|---|---|---|
| `palette.blue.60` | `--ucsd-palette-blue-60` | `$ucsd-palette-blue-60` |
| `color.action.primary` | `--ucsd-color-action-primary` | `$ucsd-color-action-primary` |
| `color.action.primary.hover` | `--ucsd-color-action-primary-hover` | `$ucsd-color-action-primary-hover` |
| `button.primary.bg` | `--ucsd-button-primary-bg` | `$ucsd-button-primary-bg` |

**Rules.** Lowercase `kebab-case` segments. Singular nouns (`color`, not `colors`). No abbreviations except the universally understood `bg`, `fg`, `min`, `max`. Numeric scales unquoted and unpadded (`60`, not `060`). US spelling (`color`).

**Validation regex** (enforced in CI):

```
^[a-z][a-z0-9]*(-[a-z0-9]+)*(\.[a-z][a-z0-9]*(-[a-z0-9]+)*)*$
```

---

## The semantic vocabulary

This is a **closed set.** Adding a category needs design + engineering sign-off. A closed set is what keeps 40 useful tokens from becoming 400 unusable ones.

### `color.*`

| Group | Purpose | Members |
|---|---|---|
| `color.surface.*` | Backgrounds of containers | `default` `subtle` `raised` `sunken` `inverse` |
| `color.text.*` | Foreground text | `default` `muted` `subtle` `inverse` `link` `link-hover` |
| `color.border.*` | Strokes and dividers | `default` `subtle` `strong` `focus` |
| `color.action.*` | Interactive fills | `primary` `primary-hover` `primary-active` `secondary` `secondary-hover` `disabled` |
| `color.status.*` | Feedback | `info` `success` `warning` `danger`, each with `-subtle` (background) and `-strong` (text/icon) |
| `color.brand.*` | Immovable brand marks only — logo, wordmark, seal | `navy` `blue` `gold` |

> `color.brand.*` is deliberately tiny. If you are reaching for it to style a button, you want `color.action.primary`.

### `space.*`

A single 4px-based scale — `space.0` … `space.24`. One scale for margin, padding and gap. No `space.inset.*` / `space.stack.*` split: it doubles the token count and every team invents a different rule for which to use.

### `font.*` / `text.*`

- `font.family.sans` `font.family.display` `font.family.mono`
- `font.weight.regular` `medium` `semibold` `bold`
- `text.xs` … `text.5xl` — each a composite token carrying `fontSize` + `lineHeight`, so the two can never be mismatched.

### `radius.*` · `elevation.*` · `motion.*` · `breakpoint.*`

- `radius.none` `sm` `md` `lg` `xl` `pill` `circle`
- `elevation.0` … `elevation.4`
- `motion.duration.fast|base|slow`, `motion.easing.standard|enter|exit`
- `breakpoint.sm|md|lg|xl|xxl` — **must match Bootstrap 5's** (576/768/992/1200/1400) so BS utilities and Tailwind agree. Non-negotiable; a mismatch here produces bugs that take days to find.

---

## Naming states

State goes **last**, as a suffix on the token it modifies:

✅ `color.action.primary.hover`
❌ `color.action.hover.primary` — sorts wrong and reads wrong
❌ `color.hover.action.primary`

Supported state suffixes: `hover` `active` `focus` `disabled` `visited` `selected`.

---

## Dark mode

Dark mode is **a mode on the semantic collection**, not a set of new tokens.

✅ `color.surface.default` = `{palette.white}` in Light, `{palette.navy.90}` in Dark
❌ A `color.surface.default.dark` token

Consequence: **every semantic token must have a value in both modes.** CI enforces it. Primitives have one mode and never change per theme.

This is a genuine capability gain over Decorator V5, whose skill explicitly refuses dark-mode guidance because the system can't express it.

---

## Anti-patterns

| Don't | Why | Instead |
|---|---|---|
| `color.blue` as a semantic | Renaming the brand color to green makes it a lie | `color.action.primary` |
| `space.small` | "Small" relative to what? Doesn't sort or interpolate | `space.2` |
| `color.button.blue.bg.hover.dark` | Encodes tier, component, primitive, state and mode in one name | `button.primary.bg.hover` + a Dark mode |
| `text.h1` | Couples a type ramp to an HTML tag; an `<h1>` isn't always the largest text | `text.4xl` |
| A component token for every component | Token sprawl; the semantic layer stops meaning anything | Use semantics; add component tokens only on demonstrated need |
| Two scales that nearly agree | Guaranteed 1px drift between frameworks | One scale, referenced everywhere |
