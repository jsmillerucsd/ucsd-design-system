# UCSD Design System — rules for AI code assistants

Mirror of `skills/ucsd-design-system/SKILL.md` for tools that read `.ai/` (Cursor, Copilot).
GENERATED — do not edit. Source of truth is SKILL.md; the sections below are extracted
from it verbatim by `scripts/generate-skill-references.mjs`.

Full token reference: `../skills/ucsd-design-system/references/generated/tokens.md`

## Pick the target

| Situation | Do this |
|---|---|
| No build step; static page, legacy app, quick CMS template | `<link>` the CDN bundle (`ucsd-bootstrap.min.css`). Tokens are included. |
| Bootstrap 5 app, has a Sass build | `@import "@ucsd/bootstrap/scss";` — gives Bootstrap's full Sass API on UCSD tokens |
| Next.js / React | `@ucsd/tokens` + Tailwind v4 `@theme` + shadcn components from the registry |
| Vue, Svelte, web components, HTML email | `@ucsd/tokens/css` → use `var(--ucsd-*)` directly |
| A CMS page template | Start from a pattern in `layouts/`, then use any of the above to render it |

If the user hasn't said, **ask** rather than guessing — the answer changes every line of markup you write.

## Hard rules

These are not style preferences. Violating them breaks dark mode, rebranding, or accessibility.

1. **No raw hex colors. No raw px for spacing or radius.** Use `var(--ucsd-*)`, `$ucsd-*`, or the Tailwind utility. If you can't find a token for something, say so rather than inventing a value.
2. **Never reference a primitive** (`palette.*` / `--ucsd-palette-*`) from a component. Primitives are the paint box; components bind to *semantic* tokens (`color.action.primary`). Referencing a primitive hard-codes a brand decision and breaks dark mode.
3. **Dark mode is free.** Use semantic tokens and it works. Do not hand-write `dark:` color overrides or a second palette.
4. **Bootstrap 5 only.** Bootstrap 3 classes are errors: `panel*` → `card`, `btn-default` → `btn-secondary`, `col-xs-*` → `col-*`, `img-responsive` → `img-fluid`, `glyphicon` → Bootstrap Icons. See `references/migration.md`.
5. **Breakpoints are 576 / 768 / 992 / 1200 / 1400** — Bootstrap 5's, matched exactly by the tokens. Never invent a breakpoint.
6. **Accessibility is not optional:** one `<h1>` per page, a skip link, visible focus ring (never `outline: none` without a replacement), 44px minimum touch target, labels tied to inputs, landmark elements. See `references/accessibility.md`.

## Verify your own output

After writing code, run:

```bash
node skills/ucsd-design-system/scripts/validate.mjs <files...>
```

It flags raw hex/px where a token exists, Bootstrap 3 leftovers, and common a11y misses. Fix what it reports before presenting the work. If the repo isn't checked out locally, apply the rules in §2 by hand.
