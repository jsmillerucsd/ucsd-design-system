# UCSD Design Tokens — full reference

> **GENERATED FILE — do not edit.** Produced by `scripts/generate-skill-references.mjs`
> from `packages/tokens/dist/tokens.json`. To change a value, change it in Figma
> and run the sync; see `docs/figma-pipeline.md`.

Semantic tokens: **103** · component: **12** · primitives: **46**

## How to reference a token

| Target | Syntax | Example |
|---|---|---|
| Plain CSS / any framework | `var(--ucsd-<path>)` | `var(--ucsd-color-action-primary)` |
| Bootstrap 5 Sass | `$ucsd-<path>` | `$ucsd-color-action-primary` |
| Tailwind / shadcn | utility class | `bg-action-primary` |
| JS / React | `tokens['<path>']` | `tokens['color.action.primary']` |

## Semantic tokens

These are the tokens you should be using. They carry intent, and they change
with light/dark mode automatically.

### `breakpoint`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `breakpoint.sm` | `--ucsd-breakpoint-sm` | `sm:` variants | `576px` | — |
| `breakpoint.md` | `--ucsd-breakpoint-md` | `md:` variants | `768px` | — |
| `breakpoint.lg` | `--ucsd-breakpoint-lg` | `lg:` variants | `992px` | — |
| `breakpoint.xl` | `--ucsd-breakpoint-xl` | `xl:` variants | `1200px` | — |
| `breakpoint.xxl` | `--ucsd-breakpoint-xxl` | `xxl:` variants | `1400px` | — |

### `color.action`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.action.primary` | `--ucsd-color-action-primary` | `bg-action-primary` `text-action-primary` `border-action-primary` | `#00629b` | `#66a3c9` | — |
| `color.action.primary-hover` | `--ucsd-color-action-primary-hover` | `bg-action-primary-hover` `text-action-primary-hover` `border-action-primary-hover` | `#00507f` | `#99c1db` | — |
| `color.action.primary-active` | `--ucsd-color-action-primary-active` | `bg-action-primary-active` `text-action-primary-active` `border-action-primary-active` | `#003d62` | `#cce0ed` | — |
| `color.action.secondary` | `--ucsd-color-action-secondary` | `bg-action-secondary` `text-action-secondary` `border-action-secondary` | `#182b49` | `#dddde1` | — |
| `color.action.secondary-hover` | `--ucsd-color-action-secondary-hover` | `bg-action-secondary-hover` `text-action-secondary-hover` `border-action-secondary-hover` | `#0f1b2e` | `#ffffff` | — |
| `color.action.secondary-active` | `--ucsd-color-action-secondary-active` | `bg-action-secondary-active` `text-action-secondary-active` `border-action-secondary-active` | `#0f1b2e` | `#ffffff` | — |
| `color.action.disabled` | `--ucsd-color-action-disabled` | `bg-action-disabled` `text-action-disabled` `border-action-disabled` | `#c4c4ca` | `#243a54` | — |

### `color.border`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.border.default` | `--ucsd-color-border-default` | `bg-border-default` `text-border-default` `border-border-default` | `#c4c4ca` | `#243a54` | — |
| `color.border.subtle` | `--ucsd-color-border-subtle` | `bg-border-subtle` `text-border-subtle` `border-border-subtle` | `#dddde1` | `#1d3153` | — |
| `color.border.strong` | `--ucsd-color-border-strong` | `bg-border-strong` `text-border-strong` `border-border-strong` | `#75757f` | `#75757f` | — |
| `color.border.focus` | `--ucsd-color-border-focus` | `bg-border-focus` `text-border-focus` `border-border-focus` | `#00629b` | `#ffcd00` | Focus ring. Must hit 3:1 against adjacent surfaces. |

### `color.brand`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.brand.navy` | `--ucsd-color-brand-navy` | `bg-brand-navy` `text-brand-navy` `border-brand-navy` | `#182b49` | `#182b49` | — |
| `color.brand.blue` | `--ucsd-color-brand-blue` | `bg-brand-blue` `text-brand-blue` `border-brand-blue` | `#00629b` | `#3384b7` | — |
| `color.brand.gold` | `--ucsd-color-brand-gold` | `bg-brand-gold` `text-brand-gold` `border-brand-gold` | `#ffcd00` | `#ffcd00` | — |

### `color.status`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.status.info` | `--ucsd-color-status-info` | `bg-status-info` `text-status-info` `border-status-info` | `#00629b` | `#66a3c9` | — |
| `color.status.info-subtle` | `--ucsd-color-status-info-subtle` | `bg-status-info-subtle` `text-status-info-subtle` `border-status-info-subtle` | `#e6f0f6` | `#001827` | — |
| `color.status.info-strong` | `--ucsd-color-status-info-strong` | `bg-status-info-strong` `text-status-info-strong` `border-status-info-strong` | `#003d62` | `#cce0ed` | — |
| `color.status.success` | `--ucsd-color-status-success` | `bg-status-success` `text-status-success` `border-status-success` | `#007a33` | `#007a33` | — |
| `color.status.success-subtle` | `--ucsd-color-status-success-subtle` | `bg-status-success-subtle` `text-status-success-subtle` `border-status-success-subtle` | `#e3f1e8` | `#005b26` | — |
| `color.status.success-strong` | `--ucsd-color-status-success-strong` | `bg-status-success-strong` `text-status-success-strong` `border-status-success-strong` | `#005b26` | `#e3f1e8` | — |
| `color.status.warning` | `--ucsd-color-status-warning` | `bg-status-warning` `text-status-warning` `border-status-warning` | `#e8a200` | `#e8a200` | — |
| `color.status.warning-subtle` | `--ucsd-color-status-warning-subtle` | `bg-status-warning-subtle` `text-status-warning-subtle` `border-status-warning-subtle` | `#fdf3e0` | `#8a6100` | — |
| `color.status.warning-strong` | `--ucsd-color-status-warning-strong` | `bg-status-warning-strong` `text-status-warning-strong` `border-status-warning-strong` | `#8a6100` | `#fdf3e0` | — |
| `color.status.danger` | `--ucsd-color-status-danger` | `bg-status-danger` `text-status-danger` `border-status-danger` | `#c8102e` | `#c8102e` | — |
| `color.status.danger-subtle` | `--ucsd-color-status-danger-subtle` | `bg-status-danger-subtle` `text-status-danger-subtle` `border-status-danger-subtle` | `#fbe7ea` | `#960c22` | — |
| `color.status.danger-strong` | `--ucsd-color-status-danger-strong` | `bg-status-danger-strong` `text-status-danger-strong` `border-status-danger-strong` | `#960c22` | `#fbe7ea` | — |

### `color.surface`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.surface.default` | `--ucsd-color-surface-default` | `bg-surface-default` `text-surface-default` `border-surface-default` | `#ffffff` | `#0f1b2e` | Page and card background. |
| `color.surface.subtle` | `--ucsd-color-surface-subtle` | `bg-surface-subtle` `text-surface-subtle` `border-surface-subtle` | `#f7f7f8` | `#182b49` | Alternating sections, table stripes. |
| `color.surface.raised` | `--ucsd-color-surface-raised` | `bg-surface-raised` `text-surface-raised` `border-surface-raised` | `#ffffff` | `#1d3153` | Surfaces above the page: modals, popovers, dropdowns. |
| `color.surface.sunken` | `--ucsd-color-surface-sunken` | `bg-surface-sunken` `text-surface-sunken` `border-surface-sunken` | `#eeeef0` | `#000000` | Wells, inset panels, code blocks. |
| `color.surface.inverse` | `--ucsd-color-surface-inverse` | `bg-surface-inverse` `text-surface-inverse` `border-surface-inverse` | `#182b49` | `#f7f7f8` | Dark bands on a light page: footer, hero. |

### `color.text`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.text.default` | `--ucsd-color-text-default` | `bg-text-default` `text-text-default` `border-text-default` | `#1a1a1d` | `#f7f7f8` | — |
| `color.text.muted` | `--ucsd-color-text-muted` | `bg-text-muted` `text-text-muted` `border-text-muted` | `#5a5a63` | `#c4c4ca` | Secondary text. AA on surface.default. |
| `color.text.subtle` | `--ucsd-color-text-subtle` | `bg-text-subtle` `text-text-subtle` `border-text-subtle` | `#75757f` | `#9a9aa3` | Tertiary. Large text / non-essential only. |
| `color.text.inverse` | `--ucsd-color-text-inverse` | `bg-text-inverse` `text-text-inverse` `border-text-inverse` | `#ffffff` | `#0f1b2e` | Text on surface.inverse. |
| `color.text.link` | `--ucsd-color-text-link` | `bg-text-link` `text-text-link` `border-text-link` | `#00629b` | `#66a3c9` | — |
| `color.text.link-hover` | `--ucsd-color-text-link-hover` | `bg-text-link-hover` `text-text-link-hover` `border-text-link-hover` | `#003d62` | `#99c1db` | — |

### `container`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `container.prose` | `--ucsd-container-prose` | `max-w-prose` | `70ch` | — |
| `container.narrow` | `--ucsd-container-narrow` | `max-w-narrow` | `768px` | — |
| `container.base` | `--ucsd-container-base` | `max-w-base` | `1140px` | — |
| `container.wide` | `--ucsd-container-wide` | `max-w-wide` | `1320px` | — |

### `elevation`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `elevation.0` | `--ucsd-elevation-0` | `shadow-0` | `none` | — |
| `elevation.1` | `--ucsd-elevation-1` | `shadow-1` | `0 1px 2px 0 rgba(24, 43, 73, 0.08)` | — |
| `elevation.2` | `--ucsd-elevation-2` | `shadow-2` | `0 2px 6px 0 rgba(24, 43, 73, 0.10)` | — |
| `elevation.3` | `--ucsd-elevation-3` | `shadow-3` | `0 6px 16px 0 rgba(24, 43, 73, 0.12)` | — |
| `elevation.4` | `--ucsd-elevation-4` | `shadow-4` | `0 12px 32px 0 rgba(24, 43, 73, 0.16)` | — |

### `font`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `font.family.sans` | `--ucsd-font-family-sans` | `font-sans` | `Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` | — |
| `font.family.display` | `--ucsd-font-family-display` | `font-display` | `Teko, Roboto, sans-serif` | Condensed display face. Headings and hero type only — never body copy. |
| `font.family.mono` | `--ucsd-font-family-mono` | `font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | — |
| `font.weight.regular` | `--ucsd-font-weight-regular` | `font-regular` | `400` | — |
| `font.weight.medium` | `--ucsd-font-weight-medium` | `font-medium` | `500` | — |
| `font.weight.semibold` | `--ucsd-font-weight-semibold` | `font-semibold` | `600` | — |
| `font.weight.bold` | `--ucsd-font-weight-bold` | `font-bold` | `700` | — |

### `motion`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `motion.duration.fast` | `--ucsd-motion-duration-fast` | — | `120ms` | — |
| `motion.duration.base` | `--ucsd-motion-duration-base` | — | `200ms` | — |
| `motion.duration.slow` | `--ucsd-motion-duration-slow` | — | `320ms` | — |
| `motion.easing.standard` | `--ucsd-motion-easing-standard` | — | `cubic-bezier(0.2, 0, 0, 1)` | — |
| `motion.easing.enter` | `--ucsd-motion-easing-enter` | — | `cubic-bezier(0, 0, 0, 1)` | — |
| `motion.easing.exit` | `--ucsd-motion-easing-exit` | — | `cubic-bezier(0.3, 0, 1, 1)` | — |

### `radius`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `radius.none` | `--ucsd-radius-none` | `rounded-none` | `0` | — |
| `radius.sm` | `--ucsd-radius-sm` | `rounded-sm` | `2px` | — |
| `radius.md` | `--ucsd-radius-md` | `rounded-md` | `4px` | — |
| `radius.lg` | `--ucsd-radius-lg` | `rounded-lg` | `8px` | — |
| `radius.xl` | `--ucsd-radius-xl` | `rounded-xl` | `16px` | — |
| `radius.pill` | `--ucsd-radius-pill` | `rounded-pill` | `999px` | — |
| `radius.circle` | `--ucsd-radius-circle` | `rounded-circle` | `50%` | — |

### `space`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `space.0` | `--ucsd-space-0` | `p-0` `m-0` `gap-0` | `0` | — |
| `space.1` | `--ucsd-space-1` | `p-1` `m-1` `gap-1` | `4px` | — |
| `space.2` | `--ucsd-space-2` | `p-2` `m-2` `gap-2` | `8px` | — |
| `space.3` | `--ucsd-space-3` | `p-3` `m-3` `gap-3` | `12px` | — |
| `space.4` | `--ucsd-space-4` | `p-4` `m-4` `gap-4` | `16px` | — |
| `space.5` | `--ucsd-space-5` | `p-5` `m-5` `gap-5` | `20px` | — |
| `space.6` | `--ucsd-space-6` | `p-6` `m-6` `gap-6` | `24px` | — |
| `space.7` | `--ucsd-space-7` | `p-7` `m-7` `gap-7` | `28px` | — |
| `space.8` | `--ucsd-space-8` | `p-8` `m-8` `gap-8` | `32px` | — |
| `space.10` | `--ucsd-space-10` | `p-10` `m-10` `gap-10` | `40px` | — |
| `space.12` | `--ucsd-space-12` | `p-12` `m-12` `gap-12` | `48px` | — |
| `space.16` | `--ucsd-space-16` | `p-16` `m-16` `gap-16` | `64px` | — |
| `space.20` | `--ucsd-space-20` | `p-20` `m-20` `gap-20` | `80px` | — |
| `space.24` | `--ucsd-space-24` | `p-24` `m-24` `gap-24` | `96px` | — |

### `text`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `text.xs.size` | `--ucsd-text-xs-size` | `text-xs` | `12px` | — |
| `text.xs.line-height` | `--ucsd-text-xs-line-height` | paired with `text-xs` | `16px` | — |
| `text.sm.size` | `--ucsd-text-sm-size` | `text-sm` | `14px` | — |
| `text.sm.line-height` | `--ucsd-text-sm-line-height` | paired with `text-sm` | `20px` | — |
| `text.md.size` | `--ucsd-text-md-size` | `text-md` | `16px` | — |
| `text.md.line-height` | `--ucsd-text-md-line-height` | paired with `text-md` | `24px` | — |
| `text.lg.size` | `--ucsd-text-lg-size` | `text-lg` | `18px` | — |
| `text.lg.line-height` | `--ucsd-text-lg-line-height` | paired with `text-lg` | `28px` | — |
| `text.xl.size` | `--ucsd-text-xl-size` | `text-xl` | `20px` | — |
| `text.xl.line-height` | `--ucsd-text-xl-line-height` | paired with `text-xl` | `28px` | — |
| `text.2xl.size` | `--ucsd-text-2xl-size` | `text-2xl` | `24px` | — |
| `text.2xl.line-height` | `--ucsd-text-2xl-line-height` | paired with `text-2xl` | `32px` | — |
| `text.3xl.size` | `--ucsd-text-3xl-size` | `text-3xl` | `30px` | — |
| `text.3xl.line-height` | `--ucsd-text-3xl-line-height` | paired with `text-3xl` | `36px` | — |
| `text.4xl.size` | `--ucsd-text-4xl-size` | `text-4xl` | `36px` | — |
| `text.4xl.line-height` | `--ucsd-text-4xl-line-height` | paired with `text-4xl` | `40px` | — |
| `text.5xl.size` | `--ucsd-text-5xl-size` | `text-5xl` | `48px` | — |
| `text.5xl.line-height` | `--ucsd-text-5xl-line-height` | paired with `text-5xl` | `52px` | — |

## Component tokens

Only where a component needs a knob the semantic layer should not carry.

| Token | CSS variable | Resolves to | Value |
|---|---|---|---|
| `button.radius` | `--ucsd-button-radius` | `{radius.md}` | `4px` |
| `button.padding-x` | `--ucsd-button-padding-x` | `{space.4}` | `16px` |
| `button.padding-y` | `--ucsd-button-padding-y` | `{space.2}` | `8px` |
| `button.gap` | `--ucsd-button-gap` | `{space.2}` | `8px` |
| `button.min-height` | `--ucsd-button-min-height` | `—` | `44px` |
| `button.primary.bg` | `--ucsd-button-primary-bg` | `{color.action.primary}` | `#00629b` |
| `button.primary.bg-hover` | `--ucsd-button-primary-bg-hover` | `{color.action.primary-hover}` | `#00507f` |
| `button.primary.fg` | `--ucsd-button-primary-fg` | `{color.text.inverse}` | `#ffffff` |
| `button.secondary.bg` | `--ucsd-button-secondary-bg` | `{color.surface.default}` | `#ffffff` |
| `button.secondary.bg-hover` | `--ucsd-button-secondary-bg-hover` | `{color.surface.subtle}` | `#f7f7f8` |
| `button.secondary.fg` | `--ucsd-button-secondary-fg` | `{color.action.secondary}` | `#182b49` |
| `button.secondary.border` | `--ucsd-button-secondary-border` | `{color.border.strong}` | `#75757f` |

## Primitives — DO NOT USE DIRECTLY

Listed only so you can recognise them. Referencing a primitive from a component
hard-codes a brand decision and breaks dark mode. Always use a semantic token.

<details><summary>Primitive palette</summary>

| Token | Value |
|---|---|
| `palette.white` | `#ffffff` |
| `palette.black` | `#000000` |
| `palette.blue.50` | `#e6f0f6` |
| `palette.blue.100` | `#cce0ed` |
| `palette.blue.200` | `#99c1db` |
| `palette.blue.300` | `#66a3c9` |
| `palette.blue.400` | `#3384b7` |
| `palette.blue.500` | `#00629b` |
| `palette.blue.600` | `#00507f` |
| `palette.blue.700` | `#003d62` |
| `palette.blue.800` | `#002b45` |
| `palette.blue.900` | `#001827` |
| `palette.navy.500` | `#3a5578` |
| `palette.navy.600` | `#2c4463` |
| `palette.navy.700` | `#243a54` |
| `palette.navy.800` | `#1d3153` |
| `palette.navy.900` | `#182b49` |
| `palette.navy.950` | `#0f1b2e` |
| `palette.gold.100` | `#fff7d1` |
| `palette.gold.300` | `#ffe066` |
| `palette.gold.400` | `#ffd633` |
| `palette.gold.500` | `#ffcd00` |
| `palette.gold.600` | `#d9ae00` |
| `palette.gold.700` | `#b38f00` |
| `palette.sand.500` | `#e8e3d3` |
| `palette.stone.500` | `#b6b1a9` |
| `palette.aqua.500` | `#00c6d7` |
| `palette.neutral.50` | `#f7f7f8` |
| `palette.neutral.100` | `#eeeef0` |
| `palette.neutral.200` | `#dddde1` |
| `palette.neutral.300` | `#c4c4ca` |
| `palette.neutral.400` | `#9a9aa3` |
| `palette.neutral.500` | `#75757f` |
| `palette.neutral.600` | `#5a5a63` |
| `palette.neutral.700` | `#44444b` |
| `palette.neutral.800` | `#2c2c31` |
| `palette.neutral.900` | `#1a1a1d` |
| `palette.green.100` | `#e3f1e8` |
| `palette.green.500` | `#007a33` |
| `palette.green.700` | `#005b26` |
| `palette.amber.100` | `#fdf3e0` |
| `palette.amber.500` | `#e8a200` |
| `palette.amber.700` | `#8a6100` |
| `palette.red.100` | `#fbe7ea` |
| `palette.red.500` | `#c8102e` |
| `palette.red.700` | `#960c22` |

</details>
