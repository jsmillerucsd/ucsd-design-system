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
| Next.js / React / Vite | `@ucsd/tokens` + Tailwind v4 `@theme`. There is **no UCSD component registry yet** — use shadcn's own components and swap in the token utilities. |
| Vue, Svelte, web components, HTML email | `@ucsd/tokens/css` → use `var(--ucsd-*)` directly |
| A CMS page template | Start from a pattern in `docs/layouts/`, then use any of the above to render it |

If the user hasn't said, **ask** rather than guessing — the answer changes every line of markup you write.

## 2. Hard rules — read `DESIGN.md`

**The rules live in [`DESIGN.md`](../../DESIGN.md) at the repo root, under "Do's and Don'ts". Read that section before writing code.** It is the canonical statement of them, and it is deliberately the only copy — a rule restated here would eventually disagree with it.

`DESIGN.md` also carries every semantic token with its light *and* dark value, and the design intent behind them. If you read one file in this repo, read that one.

What it covers, and where the supporting detail is:

| The rule says | Detail lives in |
|---|---|
| No raw hex or raw px — use a semantic token | `references/generated/tokens.md` — the authoritative token list |
| Never bind a component to a primitive (`palette.*`) | `docs/token-naming-contract.md` |
| Dark mode is automatic; never hand-write `dark:` colors | `DESIGN.md` → Colors |
| Never invent a breakpoint | `DESIGN.md` → `breakpoints` |
| Bootstrap 3 classes are errors, not legacy style | `references/generated/migration.md` — the full class mapping |
| Accessibility floors: one `<h1>`, skip link, visible focus, target size, real labels | `references/generated/accessibility.md` |

## 3. Verify your own output

After writing code, run:

```bash
node skills/ucsd-design-system/scripts/validate.mjs <files...>
```

It flags raw hex/px where a token exists, Bootstrap 3 leftovers, and common a11y misses. Fix what it reports before presenting the work. If the repo isn't checked out locally, apply the rules in §2 by hand.

## 4. Where to look things up

Load these **only when relevant** — don't read them all up front.

Everything under `references/generated/` is built from the token source or copied from `docs/`, so it cannot disagree with the system.

| File | Read it when |
|---|---|
| `DESIGN.md` (repo root) | **First.** The visual identity: the rules, every semantic token with light + dark values, and the intent behind them. |
| `references/generated/tokens.md` | You need a specific token name or value. **The authoritative list** — every token including primitives and component tokens, with CSS/Sass/Tailwind syntax. |
| `references/generated/using-nextjs.md` | Building with Next.js, React, Vite or Tailwind — setup and how tokens map to utilities |
| `references/generated/using-bootstrap.md` | Building with Bootstrap 5 — component recipes and the UCSD-specific classes |
| `references/generated/using-other.md` | Vue, Svelte, web components, HTML email, canvas or charts |
| `references/generated/layouts.md` | Building a page or CMS template — which layout pattern to use |
| `references/generated/accessibility.md` | Any interactive component, form, or a11y question |
| `references/generated/migration.md` | Converting a Decorator V5 / Bootstrap 3 page |

## 5. Working from Figma

If you have Figma Dev Mode MCP output, treat it as the *visual* answer only. Its raw hex values and pixel offsets are **not** authoritative — map them onto tokens before writing code, and prefer flow layout over the absolute positioning Figma exports suggest.

Call `get_variable_defs` on the selection first: it returns the *token names* the designer bound, which map straight to `--ucsd-*`. That is the highest-value step and the one most often skipped. Then check `get_code_connect_map` — if the component already exists in code, use it rather than regenerating from the frame. Full procedure: `docs/figma.md` §5.2.

## 6. Things this system does not cover

Say so plainly rather than inventing guidance: print/editorial design, native mobile, data-visualization color scales beyond the status tokens, and any UCSD sub-brand (Health, Scripps, Rady) with its own identity. For brand questions outside the web system, point to `brand.ucsd.edu`.
