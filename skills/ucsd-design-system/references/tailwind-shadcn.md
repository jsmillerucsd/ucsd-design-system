# Building with Tailwind & shadcn

For Next.js and React. Tailwind v4 (CSS-first config) plus shadcn components pulled from the UCSD registry.

## Setup

```css
/* app/globals.css */
@import "tailwindcss";
@import "@ucsd/tokens/css";       /* defines --ucsd-*, light and dark */
@import "@ucsd/tokens/tailwind";  /* maps them into Tailwind utilities */
```

That's the whole configuration. No `tailwind.config.js` — Tailwind v4 reads the `@theme` block from the imported CSS.

Components:

```bash
npx shadcn@latest add https://design.ucsd.edu/r/button.json
```

You get the source in your repo and you own it. Modify it freely — that's the model. Just keep the token classes when you do.

## How tokens become utilities

`@ucsd/tokens/tailwind` republishes each token into a Tailwind namespace, so utilities generate normally:

| Token | Utility |
|---|---|
| `color.action.primary` | `bg-action-primary` `text-action-primary` `border-action-primary` |
| `color.surface.default` | `bg-surface-default` |
| `color.text.muted` | `text-text-muted` |
| `space.4` | `p-4` `m-4` `gap-4` |
| `radius.md` | `rounded-md` |
| `elevation.2` | `shadow-2` |
| `text.lg` | `text-lg` (size **and** line-height together) |

The values are `var(--ucsd-*)` references, not literals. That's deliberate: utilities resolve through the token layer at runtime, so **dark mode works with no `dark:` variants**.

```html
<!-- correct: follows light/dark automatically -->
<div class="bg-surface-default text-text-default">…</div>

<!-- wrong: fights the token layer -->
<div class="bg-white text-black dark:bg-slate-900 dark:text-white">…</div>
```

Enabling dark mode is a class or attribute on a wrapper — `.dark`, `[data-theme="dark"]`, or `[data-bs-theme="dark"]` all work.

## Rules specific to this stack

1. **Don't use Tailwind's default palette.** `bg-blue-500`, `text-slate-700`, `bg-white` are not UCSD colours and don't respond to dark mode. Use the semantic utilities above.
2. **Don't use arbitrary values for colour or spacing** — `bg-[#00629b]`, `p-[17px]`. If no token fits, say so rather than inventing one.
3. **Arbitrary values are fine for genuine one-offs** that aren't colour or spacing — `grid-cols-[200px_1fr]`, `max-w-[--ucsd-container-prose]`.
4. **Breakpoints are UCSD's.** `sm: md: lg: xl: 2xl:` map to 576/768/992/1200/1400 via the theme. Never `min-[850px]:`.
5. **Compose with `cn()`**, the standard shadcn `clsx` + `tailwind-merge` helper, so consumer classes can override.

## shadcn component conventions

- Keep the `cva` variant structure. Add UCSD variants rather than replacing the base.
- Variant names match the design system, not Tailwind: `variant="primary" | "secondary" | "ghost" | "danger"`.
- Keep the Radix primitive underneath. It's carrying the focus management, keyboard handling and ARIA — hand-rolled replacements reliably lose those.
- Keep `focus-visible:ring-*` classes. Focus styling is a requirement, not decoration.

Example variant wired to tokens:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold " +
  "transition-colors focus-visible:outline-none focus-visible:ring-[3px] " +
  "focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-action-primary text-text-inverse hover:bg-action-primary-hover",
        secondary: "border border-border-strong bg-surface-default text-action-secondary hover:bg-surface-subtle",
        ghost:     "text-action-primary hover:bg-surface-subtle",
        danger:    "bg-status-danger text-text-inverse hover:bg-status-danger-strong",
      },
      size: { sm: "h-9 px-3", md: "h-11 px-4", lg: "h-12 px-6" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
```

Note `size.md` is `h-11` (44px) — the WCAG 2.2 minimum target size. Don't go below it for primary actions.

## Next.js notes

- Import `@ucsd/tokens/css` once in the root layout's global stylesheet, not per route.
- Self-host Roboto and Teko via `next/font` rather than a Google Fonts link — avoids a render-blocking third-party request and the layout shift.
- Server Components by default; `"use client"` only where you need interactivity. Most shadcn primitives need it, most layout does not.
- Setting the initial theme: write the class before paint (an inline script in `<head>`) or you get a flash of the wrong mode.
