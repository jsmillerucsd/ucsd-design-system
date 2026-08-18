<!-- COPY of docs/using/nextjs.md — do not edit here. Edit the source and run `npm run build`. -->

# Building with Next.js, React & Tailwind

For Next.js and React apps. Tailwind v4 (CSS-first config) on UCSD tokens. For the rules and the full token list, read `DESIGN.md`.

## Setup

```bash
npm install @ucsd/tokens
```

```css
/* app/globals.css */
@import "@ucsd/tokens/full";
```

That's the whole configuration — Tailwind itself, the tokens (light and dark), the Tailwind theme and the shadcn bridge, in the one order that works. No `tailwind.config.js`; Tailwind v4 reads the `@theme` block from the imported CSS.

<details><summary>Composing the imports yourself instead</summary>

```css
@import "tailwindcss";
@import "@ucsd/tokens/css";       /* defines --ucsd-*, light and dark */
@import "@ucsd/tokens/tailwind";  /* maps them into Tailwind utilities */
@import "@ucsd/tokens/shadcn";    /* the shadcn slot bridge */
```

**The order is not cosmetic.** `@ucsd/tokens/tailwind` resets `--color-*` to `initial` so Tailwind's own palette cannot be used. Anything importing colours has to come after it, or the reset wipes it. `full` bakes this in; composing by hand, it is yours to hold. Asserted in `test/tailwind-compile.test.mjs`.

</details>

> **Components:** there is **no UCSD React component package and no shadcn registry.** This is the design — not a gap. Install shadcn's own components with `npx shadcn@latest add button`. You own the code; we own the tokens. See architecture D4 (`docs/architecture.md`) for why a registry was rejected.

## How tokens become utilities

`@ucsd/tokens/tailwind` republishes each token into a Tailwind namespace, so utilities generate normally:

| Token | Utility |
|---|---|
| `color.theme.primary` | `bg-theme-primary` `text-theme-primary` `border-theme-primary` |
| `color.surface.1` | `bg-surface-1` |
| `color.foreground.body-text` | `text-foreground-body-text` |
| `color.component.btn.primary` | `bg-component-btn-primary` |
| `space.md-16` | `p-md-16` `m-md-16` `gap-md-16` |
| `radius.rounded-8` | `rounded-rounded-8`, or just `rounded-md` |
| `elevation.2` | `shadow-2` |
| `type.h1` | `text-h1` — size, line-height **and** weight together |
| `container.base` | `max-w-base` |

The values are `var(--ucsd-*)` references, not literals. That's deliberate: utilities resolve through the token layer at runtime, so **dark mode works with no `dark:` variants**.

### Tailwind's own scales are re-pointed, not left alone

`p-4`, `rounded-md`, `h-9` and the rest still work, but they no longer mean what they mean in a stock Tailwind app:

- **Spacing** is built on the 4px UCSD step, so `p-1`…`p-4` are the same values as Bootstrap's `.p-1`…`.p-4` (4/8/12/16px). Past 4 the two diverge — Bootstrap jumps to 24/32/48/64 while Tailwind keeps stepping by 4 — so use the named steps (`p-xl-32`, `p-xxl-48`, `p-xxxl-64`) when you need those exactly.
- **`rounded-sm` / `rounded-md` / `rounded-lg`** come from the UCSD radius scale and match `_bridge.scss`, so a card is the same shape in both frameworks.

This is what makes an unmodified `npx shadcn add button` render on-system.

```html
<!-- correct: follows light/dark automatically -->
<div class="bg-surface-1 text-foreground-body-text">…</div>

<!-- wrong: fights the token layer -->
<div class="bg-white text-black dark:bg-slate-900 dark:text-white">…</div>
```

Enabling dark mode is a class or attribute on a wrapper — `.dark`, `[data-theme="dark"]` or `[data-bs-theme="dark"]` all work.

## shadcn/ui

`@ucsd/tokens/shadcn` binds shadcn's variable contract — `--background`, `--primary`, `--destructive`, `--ring`, `--radius`, the chart and sidebar slots — to UCSD semantic tokens. With it imported, components installed straight from shadcn render on UCSD colours in both modes, unedited.

Do **not** keep the `:root` / `.dark` colour block `npx shadcn init` writes into your CSS. Delete it and import this instead. Every slot here points at a semantic token that already re-aliases in dark mode, so a second block would pin one mode in place.

The mapping is hand-written in `packages/tokens/formats/shadcn-theme.mjs` — which UCSD token backs which shadcn slot is a design decision, the same way `_bridge.scss` is for Bootstrap. A few worth knowing:

| shadcn slot | UCSD token | Why |
|---|---|---|
| `--primary` | `color.component.btn.primary` | The primary button fill (Yellow). DESIGN.md: "button-primary is the affirmative action." |
| `--secondary` | `color.component.btn.secondary` | The secondary button fill (Blue). |
| `--accent` | `color.surface.2` | Hover/active surface for ghost buttons, dropdowns, sidebar nav. NOT a feedback color — DESIGN.md: "using error as an accent because it looks good is a bug." |
| `--card` | `color.surface.1` | DESIGN.md lists cards under White. A card is differentiated by border and padding, not by a surface change or shadow. |
| `--link` | `color.component.link` | DESIGN.md: "Standard links → Blue." shadcn's link variant reads `text-primary` (Yellow) — override to `text-link`. |
| `--ring` | `color.theme.secondary` | Change the token if you must. Never remove the ring. |

### Classes that need a call-site override

shadcn hardcodes three things our token layer can't fix:

1. **`text-white` on destructive buttons/badges.** Our theme removes Tailwind's palette, so that class compiles to nothing. Override: `className="text-destructive-foreground"`.

2. **`text-primary` on link variants.** `--primary` is Yellow (the button fill), so `text-primary` renders invisible yellow text. Override: `className="text-link"`.

3. **`bg-white` on the slider thumb.** Same story as `text-white`, on a child element. Override on the root: `className="[&_[data-slot=slider-thumb]]:bg-background"`.

```tsx
<Button variant="destructive" className="text-destructive-foreground">Withdraw</Button>
<Button variant="link" className="text-link">Read more</Button>
<Slider className="[&_[data-slot=slider-thumb]]:bg-background" />
```

That is the complete list. `demo/` renders two dozen vendored components and `npm test` fails if any other class stops resolving.

## Rules specific to this stack

1. **Don't use Tailwind's default palette.** `bg-blue-500`, `text-slate-700`, `bg-white` are not UCSD colours. They don't merely look wrong — the colour namespace is reset, so they generate no CSS at all and the element is simply unstyled.
2. **Don't use arbitrary values for colour or spacing** — `bg-[#00629b]`, `p-[17px]`. If no token fits, say so rather than inventing one.
3. **Arbitrary values are fine for genuine one-offs** that aren't colour or spacing — `grid-cols-[200px_1fr]`, `max-w-[--ucsd-container-prose]`.
4. **Breakpoints are UCSD's.** `sm: md: lg: xl: xxl:` come from the `breakpoint.*` scale and match Bootstrap exactly. Note `xxl:`, not `2xl:` — Tailwind's name is reset, so `2xl:` utilities silently never generate. Never `min-[850px]:`.
5. **Never write `max-w-prose`.** Tailwind hard-codes it to 65ch and that wins over `container.prose` (70ch) — `@utility` can't override it either. Write `max-w-[--ucsd-container-prose]`.
6. **Compose with `cn()`**, the standard `clsx` + `tailwind-merge` helper, so consumer classes can override.

Rules 1, 4 and 5 are caught by `npm run validate`.

## Component conventions

- Keep the `cva` variant structure. Add UCSD variants rather than replacing the base.
- Variant names match the design system, not Tailwind: `variant="primary" | "secondary" | "tertiary" | "danger"`.
- Keep the Radix primitive underneath. It carries focus management, keyboard handling and ARIA that hand-rolled replacements reliably lose.
- Keep `focus-visible:ring-*`. Focus styling is a requirement, not decoration.

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-button " +
  "transition-colors focus-visible:outline-none focus-visible:ring-[3px] " +
  "focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-component-btn-primary text-component-btn-label-primary",
        secondary: "bg-component-btn-secondary text-component-btn-label-secondary",
        tertiary:  "bg-component-btn-tertiary text-component-btn-label-tertiary",
        danger:    "bg-system-error text-surface-1",
      },
      size: { sm: "h-8 px-3", md: "h-9 px-4", lg: "h-11 px-6" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
```

`text-button` carries the role's size, line-height and weight together, so there is no `text-sm font-semibold` to keep in sync.

`size.md` is `h-9` — 36px on the UCSD 4px step, just under the WCAG 2.2 target-size floor of 44px. Don't go below it for primary actions; `sm` (32px) is for dense secondary controls only.

## Next.js notes

- Import `@ucsd/tokens/full` once in the root layout's global stylesheet, not per route.
- Self-host Brix Sans and Refrigerator Deluxe via `next/font`. Both are **licensed** faces, not Google Fonts — confirm the web licence before shipping.
- Server Components by default; `"use client"` only where you need interactivity. Most primitives need it, most layout does not.
- Set the initial theme before paint (an inline script in `<head>`) or you get a flash of the wrong mode.

## Plain React, Vite, and other SPAs

Everything above applies except the Next.js notes. If you aren't using Tailwind at all, import `@ucsd/tokens/css` and use `var(--ucsd-*)` directly — see `docs/using/other.md`.
