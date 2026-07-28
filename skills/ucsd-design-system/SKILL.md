---
name: ucsd-design-system
description: Build UC San Diego branded web interfaces using the UCSD Design System — design tokens, Bootstrap 5, Tailwind/shadcn, and CMS page layouts. Use when building or restyling any UCSD web page, app, component or CMS template; when asked for UCSD branding, colors, typography or spacing; or when migrating off Decorator V5 / Bootstrap 3.
---

# UCSD Design System

Token-first design system for UC San Diego. Replaces **Decorator V5** (Bootstrap 3, jQuery, Glyphicons).

**The model:** one token source drives every framework. Bootstrap 5 and Tailwind/shadcn are both first-class and permanent — they share *tokens*, not markup. Write idiomatic code for whichever stack you're in; correctness comes from using the right tokens.

---

## 1. Pick the target

| Situation | Do this |
|---|---|
| No build step; static page, legacy app, quick CMS template | `<link>` the CDN bundle (`ucsd-bootstrap.min.css`). Tokens are included. |
| Bootstrap 5 app, has a Sass build | `@import "@ucsd/bootstrap/scss";` — gives Bootstrap's full Sass API on UCSD tokens |
| Next.js / React | `@ucsd/tokens` + Tailwind v4 `@theme` + shadcn components from the registry |
| Vue, Svelte, web components, HTML email | `@ucsd/tokens/css` → use `var(--ucsd-*)` directly |
| A CMS page template | Start from a pattern in `layouts/`, then use any of the above to render it |

If the user hasn't said, **ask** rather than guessing — the answer changes every line of markup you write.

## 2. Hard rules

These are not style preferences. Violating them breaks dark mode, rebranding, or accessibility.

1. **No raw hex colors. No raw px for spacing or radius.** Use `var(--ucsd-*)`, `$ucsd-*`, or the Tailwind utility. If you can't find a token for something, say so rather than inventing a value.
2. **Never reference a primitive** (`palette.*` / `--ucsd-palette-*`) from a component. Primitives are the paint box; components bind to *semantic* tokens (`color.action.primary`). Referencing a primitive hard-codes a brand decision and breaks dark mode.
3. **Dark mode is free.** Use semantic tokens and it works. Do not hand-write `dark:` color overrides or a second palette.
4. **Bootstrap 5 only.** Bootstrap 3 classes are errors: `panel*` → `card`, `btn-default` → `btn-secondary`, `col-xs-*` → `col-*`, `img-responsive` → `img-fluid`, `glyphicon` → Bootstrap Icons. See `references/migration.md`.
5. **Breakpoints are 576 / 768 / 992 / 1200 / 1400** — Bootstrap 5's, matched exactly by the tokens. Never invent a breakpoint.
6. **Accessibility is not optional:** one `<h1>` per page, a skip link, visible focus ring (never `outline: none` without a replacement), 44px minimum touch target, labels tied to inputs, landmark elements. See `references/accessibility.md`.

## 3. Verify your own output

After writing code, run:

```bash
node skills/ucsd-design-system/scripts/validate.mjs <files...>
```

It flags raw hex/px where a token exists, Bootstrap 3 leftovers, and common a11y misses. Fix what it reports before presenting the work. If the repo isn't checked out locally, apply the rules in §2 by hand.

## 4. Where to look things up

Load these **only when relevant** — don't read them all up front.

| File | Read it when |
|---|---|
| `references/generated/tokens.md` | You need a specific token name or value. **The authoritative list** — every token, light + dark, with CSS/Sass/Tailwind syntax. |
| `references/bootstrap5.md` | Building with Bootstrap 5 — component recipes and the UCSD-specific classes |
| `references/tailwind-shadcn.md` | Building with Tailwind or shadcn — setup and how tokens map to utilities |
| `references/layouts.md` | Building a page or CMS template — which layout pattern to use |
| `references/accessibility.md` | Any interactive component, form, or a11y question |
| `references/migration.md` | Converting a Decorator V5 / Bootstrap 3 page |
| `references/figma-workflow.md` | Working from a Figma frame or Dev Mode MCP output |

## 5. Working from Figma

If you have Figma Dev Mode MCP output, treat it as the *visual* answer only. Its raw hex values and pixel offsets are **not** authoritative — map them onto tokens before writing code, and prefer flow layout over the absolute positioning Figma exports suggest. `references/figma-workflow.md` has the mapping procedure.

## 6. Things this system does not cover

Say so plainly rather than inventing guidance: print/editorial design, native mobile, data-visualization color scales beyond the status tokens, and any UCSD sub-brand (Health, Scripps, Rady) with its own identity. For brand questions outside the web system, point to `brand.ucsd.edu`.
