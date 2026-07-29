<!-- COPY of docs/using/nextjs.md — do not edit here. Edit the source and run `npm run build`. -->

# Building with Next.js, React & Tailwind

For Next.js and React apps. Tailwind v4 (CSS-first config) on UCSD tokens. For the rules and the full token list, read `DESIGN.md`.

## Setup

```bash
npm install @ucsd/tokens
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@ucsd/tokens/css";       /* defines --ucsd-*, light and dark */
@import "@ucsd/tokens/tailwind";  /* maps them into Tailwind utilities */
```

That's the whole configuration. No `tailwind.config.js` — Tailwind v4 reads the `@theme` block from the imported CSS.

> **Components:** there is **no UCSD component package or shadcn registry yet.** `design.ucsd.edu/r/` does not resolve. The plan is a shadcn registry (see architecture D4 (`docs/architecture.md`)), sequenced as Phase 5 in `docs/figma.md`. Until then: install shadcn's own components with `npx shadcn@latest add button`, then swap their default classes for the UCSD token utilities below. You own the code either way — that's the model.

## How tokens become utilities

`@ucsd/tokens/tailwind` republishes each token into a Tailwind namespace, so utilities generate normally:

| Token | Utility |
|---|---|
| `color.theme.primary` | `bg-theme-primary` `text-theme-primary` `border-theme-primary` |
| `color.surface.1` | `bg-surface-1` |
| `color.foreground.body-text` | `text-foreground-body-text` |
| `color.component.btn-primary` | `bg-component-btn-primary` |
| `space.large` | `p-large` `m-large` `gap-large` |
| `radius.default` | `rounded-default` |
| `elevation.2` | `shadow-2` |
| `type.h1` | `text-h1` (size **and** line-height together) |

The values are `var(--ucsd-*)` references, not literals. That's deliberate: utilities resolve through the token layer at runtime, so **dark mode works with no `dark:` variants**.

```html
<!-- correct: follows light/dark automatically -->
<div class="bg-surface-1 text-foreground-body-text">…</div>

<!-- wrong: fights the token layer -->
<div class="bg-white text-black dark:bg-slate-900 dark:text-white">…</div>
```

Enabling dark mode is a class or attribute on a wrapper — `.dark`, `[data-theme="dark"]` or `[data-bs-theme="dark"]` all work.

## Rules specific to this stack

1. **Don't use Tailwind's default palette.** `bg-blue-500`, `text-slate-700`, `bg-white` are not UCSD colours and don't respond to dark mode. Use the semantic utilities above.
2. **Don't use arbitrary values for colour or spacing** — `bg-[#00629b]`, `p-[17px]`. If no token fits, say so rather than inventing one.
3. **Arbitrary values are fine for genuine one-offs** that aren't colour or spacing — `grid-cols-[200px_1fr]`, `max-w-[--ucsd-container-prose]`.
4. **Breakpoints are UCSD's.** `sm: md: lg: xl: 2xl:` come from the `breakpoint.*` scale and match Bootstrap exactly. Never `min-[850px]:`.
5. **Compose with `cn()`**, the standard `clsx` + `tailwind-merge` helper, so consumer classes can override.

## Component conventions

- Keep the `cva` variant structure. Add UCSD variants rather than replacing the base.
- Variant names match the design system, not Tailwind: `variant="primary" | "secondary" | "tertiary" | "danger"`.
- Keep the Radix primitive underneath. It carries focus management, keyboard handling and ARIA that hand-rolled replacements reliably lose.
- Keep `focus-visible:ring-*`. Focus styling is a requirement, not decoration.

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold " +
  "transition-colors focus-visible:outline-none focus-visible:ring-[3px] " +
  "focus-visible:ring-theme-secondary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-component-btn-primary text-component-btn-label-primary",
        secondary: "bg-component-btn-secondary text-component-btn-label-secondary",
        tertiary:  "bg-component-btn-tertiary text-component-btn-label-tertiary",
        danger:    "bg-system-error text-surface-1",
      },
      size: { sm: "h-9 px-3", md: "h-11 px-4", lg: "h-12 px-6" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
```

`size.md` is `h-11` — the WCAG 2.2 minimum target size. Don't go below it for primary actions.

## Next.js notes

- Import `@ucsd/tokens/css` once in the root layout's global stylesheet, not per route.
- Self-host Brix Sans and Refrigerator Deluxe via `next/font`. Both are **licensed** faces, not Google Fonts — confirm the web licence before shipping.
- Server Components by default; `"use client"` only where you need interactivity. Most primitives need it, most layout does not.
- Set the initial theme before paint (an inline script in `<head>`) or you get a flash of the wrong mode.

## Plain React, Vite, and other SPAs

Everything above applies except the Next.js notes. If you aren't using Tailwind at all, import `@ucsd/tokens/css` and use `var(--ucsd-*)` directly — see `docs/using/other.md`.
