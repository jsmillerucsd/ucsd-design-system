# UCSD Design Tokens — full reference

> **GENERATED FILE — do not edit.** Produced by `scripts/generate-skill-references.mjs`
> from `packages/tokens/dist/tokens.json`. To change a value, change it in Figma
> and run the sync; see `docs/figma.md`.

Semantic tokens: **133** · component: **0** · primitives: **105**

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

### `color.component`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.component.btn-tertiary` | `--ucsd-color-component-btn-tertiary` | `bg-component-btn-tertiary` `text-component-btn-tertiary` `border-component-btn-tertiary` | `#fbf9f5` | `—` | Quiet third button fill. Aliases the raised content surface rather than a primitive, so it re-aliases in dark mode for free. |
| `color.component.btn-label-tertiary` | `--ucsd-color-component-btn-label-tertiary` | `bg-component-btn-label-tertiary` `text-component-btn-label-tertiary` `border-component-btn-label-tertiary` | `#313232` | `—` | Label for btn-tertiary. Aliases body text, so the pair inherits the already-gated `foreground.body-text on surface.2` contrast check in BOTH modes — see PAIRS in scripts/validate-tokens.mjs. |
| `color.component.btn-gold` | `--ucsd-color-component-btn-gold` | `bg-component-btn-gold` `text-component-btn-gold` `border-component-btn-gold` | `#c69214` | `#d9b662` | — |
| `color.component.btn-label-black` | `--ucsd-color-component-btn-label-black` | `bg-component-btn-label-black` `text-component-btn-label-black` `border-component-btn-label-black` | `#000000` | `#000000` | — |
| `color.component.btn-label-primary` | `--ucsd-color-component-btn-label-primary` | `bg-component-btn-label-primary` `text-component-btn-label-primary` `border-component-btn-label-primary` | `#182b49` | `#182b49` | — |
| `color.component.btn-label-secondary` | `--ucsd-color-component-btn-label-secondary` | `bg-component-btn-label-secondary` `text-component-btn-label-secondary` `border-component-btn-label-secondary` | `#ffffff` | `#162742` | — |
| `color.component.btn-label-white` | `--ucsd-color-component-btn-label-white` | `bg-component-btn-label-white` `text-component-btn-label-white` `border-component-btn-label-white` | `#ffffff` | `#ffffff` | — |
| `color.component.btn-navy` | `--ucsd-color-component-btn-navy` | `bg-component-btn-navy` `text-component-btn-navy` `border-component-btn-navy` | `#182b49` | `#182b49` | — |
| `color.component.btn-orange` | `--ucsd-color-component-btn-orange` | `bg-component-btn-orange` `text-component-btn-orange` `border-component-btn-orange` | `#fc8900` | `#fc8900` | — |
| `color.component.btn-primary` | `--ucsd-color-component-btn-primary` | `bg-component-btn-primary` `text-component-btn-primary` `border-component-btn-primary` | `#ffcd00` | `#ffcd00` | — |
| `color.component.btn-secondary` | `--ucsd-color-component-btn-secondary` | `bg-component-btn-secondary` `text-component-btn-secondary` `border-component-btn-secondary` | `#00629b` | `#5496bc` | — |
| `color.component.btn-turqoise` | `--ucsd-color-component-btn-turqoise` | `bg-component-btn-turqoise` `text-component-btn-turqoise` `border-component-btn-turqoise` | `#00c6d7` | `#00c6d7` | — |
| `color.component.icon` | `--ucsd-color-component-icon` | `bg-component-icon` `text-component-icon` `border-component-icon` | `#182b49` | `#f5f0e6` | — |
| `color.component.link` | `--ucsd-color-component-link` | `bg-component-link` `text-component-link` `border-component-link` | `#00629b` | `#5496bc` | — |
| `color.component.menu` | `--ucsd-color-component-menu` | `bg-component-menu` `text-component-menu` `border-component-menu` | `#747678` | `#747678` | — |

### `color.foreground`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.foreground.body-text` | `--ucsd-color-foreground-body-text` | `bg-foreground-body-text` `text-foreground-body-text` `border-foreground-body-text` | `#313232` | `#bfc0c1` | — |
| `color.foreground.body-text-focus` | `--ucsd-color-foreground-body-text-focus` | `bg-foreground-body-text-focus` `text-foreground-body-text-focus` `border-foreground-body-text-focus` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.card-border` | `--ucsd-color-foreground-card-border` | `bg-foreground-card-border` `text-foreground-card-border` `border-foreground-card-border` | `#d4d5d5` | `#747678` | — |
| `color.foreground.divider` | `--ucsd-color-foreground-divider` | `bg-foreground-divider` `text-foreground-divider` `border-foreground-divider` | `#647185` | `#959dab` | — |
| `color.foreground.eyebrow` | `--ucsd-color-foreground-eyebrow` | `bg-foreground-eyebrow` `text-foreground-eyebrow` `border-foreground-eyebrow` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.h1-heading` | `--ucsd-color-foreground-h1-heading` | `bg-foreground-h1-heading` `text-foreground-h1-heading` `border-foreground-h1-heading` | `#00629b` | `#f5f0e6` | — |
| `color.foreground.h2-heading` | `--ucsd-color-foreground-h2-heading` | `bg-foreground-h2-heading` `text-foreground-h2-heading` `border-foreground-h2-heading` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.h3-heading` | `--ucsd-color-foreground-h3-heading` | `bg-foreground-h3-heading` `text-foreground-h3-heading` `border-foreground-h3-heading` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.heading-light` | `--ucsd-color-foreground-heading-light` | `bg-foreground-heading-light` `text-foreground-heading-light` `border-foreground-heading-light` | `#ffffff` | `#f5f0e6` | — |
| `color.foreground.subcard-border` | `--ucsd-color-foreground-subcard-border` | `bg-foreground-subcard-border` `text-foreground-subcard-border` `border-foreground-subcard-border` | `#182b49` | `#747678` | — |
| `color.foreground.subheading` | `--ucsd-color-foreground-subheading` | `bg-foreground-subheading` `text-foreground-subheading` `border-foreground-subheading` | `#182b49` | `#f5f0e6` | — |

### `color.status`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.status.critical` | `--ucsd-color-status-critical` | `bg-status-critical` `text-status-critical` `border-status-critical` | `#bd1900` | `#bd1900` | — |
| `color.status.good` | `--ucsd-color-status-good` | `bg-status-good` `text-status-good` `border-status-good` | `#109b00` | `#109b00` | — |
| `color.status.warning` | `--ucsd-color-status-warning` | `bg-status-warning` `text-status-warning` `border-status-warning` | `#fc8900` | `#fc8900` | — |

### `color.surface`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.surface.1` | `--ucsd-color-surface-1` | `bg-surface-1` `text-surface-1` `border-surface-1` | `#ffffff` | `#000000` | — |
| `color.surface.2` | `--ucsd-color-surface-2` | `bg-surface-2` `text-surface-2` `border-surface-2` | `#fbf9f5` | `#404142` | — |
| `color.surface.3` | `--ucsd-color-surface-3` | `bg-surface-3` `text-surface-3` `border-surface-3` | `#00629b` | `#00629b` | — |
| `color.surface.4` | `--ucsd-color-surface-4` | `bg-surface-4` `text-surface-4` `border-surface-4` | `#182b49` | `#182b49` | — |
| `color.surface.5` | `--ucsd-color-surface-5` | `bg-surface-5` `text-surface-5` `border-surface-5` | `#f8f8f9` | `#313232` | — |

### `color.system`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.system.bg-error` | `--ucsd-color-system-bg-error` | `bg-system-bg-error` `text-system-bg-error` `border-system-bg-error` | `#f8e8e6` | `#ac1700` | — |
| `color.system.bg-information` | `--ucsd-color-system-bg-information` | `bg-system-bg-information` `text-system-bg-information` `border-system-bg-information` | `#e6eff5` | `#5496bc` | — |
| `color.system.bg-success` | `--ucsd-color-system-bg-success` | `bg-system-bg-success` `text-system-bg-success` `border-system-bg-success` | `#e7f5e6` | `#0b6e00` | — |
| `color.system.bg-warning` | `--ucsd-color-system-bg-warning` | `bg-system-bg-warning` `text-system-bg-warning` `border-system-bg-warning` | `#fff3e6` | `#975200` | — |
| `color.system.error` | `--ucsd-color-system-error` | `bg-system-error` `text-system-error` `border-system-error` | `#bd1900` | `#d77566` | — |
| `color.system.foreground-error` | `--ucsd-color-system-foreground-error` | `bg-system-foreground-error` `text-system-foreground-error` `border-system-foreground-error` | `#ac1700` | `#f8e8e6` | — |
| `color.system.foreground-information` | `--ucsd-color-system-foreground-information` | `bg-system-foreground-information` `text-system-foreground-information` `border-system-foreground-information` | `#00629b` | `#e6eff5` | — |
| `color.system.foreground-success` | `--ucsd-color-system-foreground-success` | `bg-system-foreground-success` `text-system-foreground-success` `border-system-foreground-success` | `#0b6e00` | `#e7f5e6` | — |
| `color.system.foreground-warning` | `--ucsd-color-system-foreground-warning` | `bg-system-foreground-warning` `text-system-foreground-warning` `border-system-foreground-warning` | `#975200` | `#fff3e6` | — |
| `color.system.information` | `--ucsd-color-system-information` | `bg-system-information` `text-system-information` `border-system-information` | `#00629b` | `#5496bc` | — |
| `color.system.success` | `--ucsd-color-system-success` | `bg-system-success` `text-system-success` `border-system-success` | `#109b00` | `#40af33` | — |
| `color.system.success-small-text` | `--ucsd-color-system-success-small-text` | `bg-system-success-small-text` `text-system-success-small-text` `border-system-success-small-text` | `#0a8902` | `#40af33` | — |
| `color.system.warning` | `--ucsd-color-system-warning` | `bg-system-warning` `text-system-warning` `border-system-warning` | `#fc8900` | `#fc8900` | — |

### `color.theme`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.theme.accent` | `--ucsd-color-theme-accent` | `bg-theme-accent` `text-theme-accent` `border-theme-accent` | `#ffcd00` | `#ffcd00` | — |
| `color.theme.primary` | `--ucsd-color-theme-primary` | `bg-theme-primary` `text-theme-primary` `border-theme-primary` | `#182b49` | `#182b49` | — |
| `color.theme.secondary` | `--ucsd-color-theme-secondary` | `bg-theme-secondary` `text-theme-secondary` `border-theme-secondary` | `#00629b` | `#00629b` | — |

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
| `radius.rounded-0` | `--ucsd-radius-rounded-0` | `rounded-rounded-0` | `0` | — |
| `radius.rounded-1` | `--ucsd-radius-rounded-1` | `rounded-rounded-1` | `5px` | — |
| `radius.rounded-2` | `--ucsd-radius-rounded-2` | `rounded-rounded-2` | `10px` | — |
| `radius.rounded-3` | `--ucsd-radius-rounded-3` | `rounded-rounded-3` | `15px` | — |
| `radius.rounded-circle` | `--ucsd-radius-rounded-circle` | `rounded-rounded-circle` | `100px` | — |
| `radius.ucsd-8px` | `--ucsd-radius-ucsd-8px` | `rounded-ucsd-8px` | `8px` | — |
| `radius.pill` | `--ucsd-radius-pill` | `rounded-pill` | `999px` | — |

### `space`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `space.2x-large` | `--ucsd-space-2x-large` | `p-2x-large` `m-2x-large` `gap-2x-large` | `45px` | — |
| `space.3x-large` | `--ucsd-space-3x-large` | `p-3x-large` `m-3x-large` `gap-3x-large` | `60px` | — |
| `space.extra-large` | `--ucsd-space-extra-large` | `p-extra-large` `m-extra-large` `gap-extra-large` | `30px` | — |
| `space.extra-small` | `--ucsd-space-extra-small` | `p-extra-small` `m-extra-small` `gap-extra-small` | `5px` | — |
| `space.large` | `--ucsd-space-large` | `p-large` `m-large` `gap-large` | `20px` | — |
| `space.medium` | `--ucsd-space-medium` | `p-medium` `m-medium` `gap-medium` | `15px` | — |
| `space.small` | `--ucsd-space-small` | `p-small` `m-small` `gap-small` | `10px` | — |
| `space.zero` | `--ucsd-space-zero` | `p-zero` `m-zero` `gap-zero` | `0` | — |

### `type`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `type.body-lg.font-weight` | `--ucsd-type-body-lg-font-weight` | `text-body-lg--font-weight` | `400` | — |
| `type.body-lg.font-size` | `--ucsd-type-body-lg-font-size` | `text-body-lg` | `24px` | — |
| `type.body-lg.line-height` | `--ucsd-type-body-lg-line-height` | paired with `text-body-lg` | `29px` | — |
| `type.body-md.font-weight` | `--ucsd-type-body-md-font-weight` | `text-body-md--font-weight` | `400` | — |
| `type.body-md.font-size` | `--ucsd-type-body-md-font-size` | `text-body-md` | `18px` | — |
| `type.body-md.line-height` | `--ucsd-type-body-md-line-height` | paired with `text-body-md` | `23px` | — |
| `type.body-sm.font-weight` | `--ucsd-type-body-sm-font-weight` | `text-body-sm--font-weight` | `400` | — |
| `type.body-sm.font-size` | `--ucsd-type-body-sm-font-size` | `text-body-sm` | `12px` | — |
| `type.body-sm.line-height` | `--ucsd-type-body-sm-line-height` | paired with `text-body-sm` | `17px` | — |
| `type.eyebrow.font-weight` | `--ucsd-type-eyebrow-font-weight` | `text-eyebrow--font-weight` | `700` | — |
| `type.eyebrow.font-family` | `--ucsd-type-eyebrow-font-family` | `font-eyebrow` | `'Refrigerator Deluxe'` | — |
| `type.eyebrow.font-size` | `--ucsd-type-eyebrow-font-size` | `text-eyebrow` | `8px` | — |
| `type.eyebrow.line-height` | `--ucsd-type-eyebrow-line-height` | paired with `text-eyebrow` | `10px` | — |
| `type.h1.font-weight` | `--ucsd-type-h1-font-weight` | `text-h1--font-weight` | `600` | — |
| `type.h1.font-family` | `--ucsd-type-h1-font-family` | `font-h1` | `'Refrigerator Deluxe'` | — |
| `type.h1.font-size` | `--ucsd-type-h1-font-size` | `text-h1` | `24px` | — |
| `type.h1.line-height` | `--ucsd-type-h1-line-height` | paired with `text-h1` | `29px` | — |
| `type.h2.font-weight` | `--ucsd-type-h2-font-weight` | `text-h2--font-weight` | `600` | — |
| `type.h2.font-family` | `--ucsd-type-h2-font-family` | `font-h2` | `'Brix Sans'` | — |
| `type.h2.font-size` | `--ucsd-type-h2-font-size` | `text-h2` | `18px` | — |
| `type.h2.line-height` | `--ucsd-type-h2-line-height` | paired with `text-h2` | `22px` | — |
| `type.h3.font-weight` | `--ucsd-type-h3-font-weight` | `text-h3--font-weight` | `900` | — |
| `type.h3.font-family` | `--ucsd-type-h3-font-family` | `font-h3` | `'Refrigerator Deluxe'` | — |
| `type.h3.font-size` | `--ucsd-type-h3-font-size` | `text-h3` | `14px` | — |
| `type.h3.line-height` | `--ucsd-type-h3-line-height` | paired with `text-h3` | `17px` | — |
| `type.subheading.font-weight` | `--ucsd-type-subheading-font-weight` | `text-subheading--font-weight` | `700` | — |
| `type.subheading.font-family` | `--ucsd-type-subheading-font-family` | `font-subheading` | `'Brix Sans'` | — |
| `type.subheading.font-size` | `--ucsd-type-subheading-font-size` | `text-subheading` | `12px` | — |
| `type.subheading.line-height` | `--ucsd-type-subheading-line-height` | paired with `text-subheading` | `15px` | — |
| `type.fallback.sans` | `--ucsd-type-fallback-sans` | — | `system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif` | For roles set in the working face (Brix Sans). |
| `type.fallback.display` | `--ucsd-type-fallback-display` | — | `'Arial Narrow', system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif` | For roles set in the condensed display face (Refrigerator Deluxe). Leads with a condensed face so headings keep roughly their intended width. |
| `type.body.font-family` | `--ucsd-type-body-font-family` | `font-body` | `'Brix Sans'` | — |
| `type.button.font-family` | `--ucsd-type-button-font-family` | `font-button` | `'Brix Sans'` | — |
| `type.button.font-size` | `--ucsd-type-button-font-size` | `text-button` | `14px` | — |
| `type.button.font-weight` | `--ucsd-type-button-font-weight` | `text-button--font-weight` | `700` | — |
| `type.button.line-height` | `--ucsd-type-button-line-height` | paired with `text-button` | `17px` | — |
| `type.h2-small.font-family` | `--ucsd-type-h2-small-font-family` | `font-h2-small` | `'Brix Sans'` | — |
| `type.h2-small.font-size` | `--ucsd-type-h2-small-font-size` | `text-h2-small` | `12px` | — |
| `type.h2-small.line-height` | `--ucsd-type-h2-small-line-height` | paired with `text-h2-small` | `18px` | — |

### `weight`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `weight.black` | `--ucsd-weight-black` | — | `900` | — |
| `weight.bold` | `--ucsd-weight-bold` | — | `700` | — |
| `weight.extra-bold` | `--ucsd-weight-extra-bold` | — | `800` | — |
| `weight.extra-light` | `--ucsd-weight-extra-light` | — | `200` | — |
| `weight.light` | `--ucsd-weight-light` | — | `300` | — |
| `weight.medium` | `--ucsd-weight-medium` | — | `500` | — |
| `weight.regular` | `--ucsd-weight-regular` | — | `400` | — |
| `weight.semi-bold` | `--ucsd-weight-semi-bold` | — | `600` | — |
| `weight.thin` | `--ucsd-weight-thin` | — | `100` | — |

## Component tokens

Only where a component needs a knob the semantic layer should not carry.

| Token | CSS variable | Resolves to | Value |
|---|---|---|---|

## Primitives — DO NOT USE DIRECTLY

Listed only so you can recognise them. Referencing a primitive from a component
hard-codes a brand decision and breaks dark mode. Always use a semantic token.

<details><summary>Primitive palette</summary>

| Token | Value |
|---|---|
| `palette.accent.orange.50` | `#fff3e6` |
| `palette.accent.orange.100` | `#fee7cc` |
| `palette.accent.orange.200` | `#fed099` |
| `palette.accent.orange.300` | `#fdb866` |
| `palette.accent.orange.400` | `#fda133` |
| `palette.accent.orange.500` | `#fc8900` |
| `palette.accent.orange.600` | `#ca6e00` |
| `palette.accent.orange.700` | `#975200` |
| `palette.accent.orange.800` | `#653700` |
| `palette.accent.orange.900` | `#321b00` |
| `palette.core.blue.50` | `#e6eff5` |
| `palette.core.blue.100` | `#b0cee0` |
| `palette.core.blue.200` | `#8ab7d1` |
| `palette.core.blue.300` | `#5496bc` |
| `palette.core.blue.400` | `#3381af` |
| `palette.core.blue.500` | `#00629b` |
| `palette.core.blue.600` | `#00598d` |
| `palette.core.blue.700` | `#00466e` |
| `palette.core.blue.800` | `#003655` |
| `palette.core.blue.900` | `#002941` |
| `palette.core.gold.50` | `#f9f4e8` |
| `palette.core.gold.100` | `#edddb6` |
| `palette.core.gold.200` | `#e5cd93` |
| `palette.core.gold.300` | `#d9b662` |
| `palette.core.gold.400` | `#d1a843` |
| `palette.core.gold.500` | `#c69214` |
| `palette.core.gold.600` | `#b48512` |
| `palette.core.gold.700` | `#8d680e` |
| `palette.core.gold.800` | `#6d500b` |
| `palette.core.gold.900` | `#533d08` |
| `palette.core.navy.50` | `#e8eaed` |
| `palette.core.navy.100` | `#b7bdc7` |
| `palette.core.navy.200` | `#959dab` |
| `palette.core.navy.300` | `#647185` |
| `palette.core.navy.400` | `#46556d` |
| `palette.core.navy.500` | `#182b49` |
| `palette.core.navy.600` | `#162742` |
| `palette.core.navy.700` | `#111f34` |
| `palette.core.navy.800` | `#0d1828` |
| `palette.core.navy.900` | `#0a121f` |
| `palette.core.yellow.50` | `#fffae6` |
| `palette.core.yellow.100` | `#fff0b0` |
| `palette.core.yellow.200` | `#ffe88a` |
| `palette.core.yellow.300` | `#ffde54` |
| `palette.core.yellow.400` | `#ffd733` |
| `palette.core.yellow.500` | `#ffcd00` |
| `palette.core.yellow.600` | `#e8bb00` |
| `palette.core.yellow.700` | `#b59200` |
| `palette.core.yellow.800` | `#8c7100` |
| `palette.core.yellow.900` | `#6b5600` |
| `palette.neutral.black` | `#000000` |
| `palette.neutral.gray.25` | `#f8f8f9` |
| `palette.neutral.gray.50` | `#f1f1f2` |
| `palette.neutral.gray.100` | `#d4d5d5` |
| `palette.neutral.gray.200` | `#bfc0c1` |
| `palette.neutral.gray.300` | `#a2a3a5` |
| `palette.neutral.gray.350` | `#a1a2a4` |
| `palette.neutral.gray.400` | `#909193` |
| `palette.neutral.gray.500` | `#747678` |
| `palette.neutral.gray.600` | `#6a6b6d` |
| `palette.neutral.gray.700` | `#525455` |
| `palette.neutral.gray.800` | `#404142` |
| `palette.neutral.gray.900` | `#313232` |
| `palette.neutral.sand.50` | `#fefefd` |
| `palette.neutral.sand.100` | `#fdfcfa` |
| `palette.neutral.sand.200` | `#fbf9f5` |
| `palette.neutral.sand.300` | `#f9f6f0` |
| `palette.neutral.sand.400` | `#f7f3eb` |
| `palette.neutral.sand.500` | `#f5f0e6` |
| `palette.neutral.sand.600` | `#c4c0b8` |
| `palette.neutral.sand.700` | `#93908a` |
| `palette.neutral.sand.800` | `#62605c` |
| `palette.neutral.sand.900` | `#31302e` |
| `palette.neutral.stone.50` | `#f8f7f6` |
| `palette.neutral.stone.100` | `#f0efee` |
| `palette.neutral.stone.200` | `#e2e0dd` |
| `palette.neutral.stone.300` | `#d3d0cb` |
| `palette.neutral.stone.400` | `#c5c1ba` |
| `palette.neutral.stone.500` | `#b6b1a9` |
| `palette.neutral.stone.600` | `#928e87` |
| `palette.neutral.stone.700` | `#6d6a65` |
| `palette.neutral.stone.800` | `#494744` |
| `palette.neutral.stone.900` | `#242322` |
| `palette.neutral.white` | `#ffffff` |
| `palette.utility.green.50` | `#e7f5e6` |
| `palette.utility.green.100` | `#b5e0b0` |
| `palette.utility.green.200` | `#91d18a` |
| `palette.utility.green.300` | `#5fbc54` |
| `palette.utility.green.400` | `#40af33` |
| `palette.utility.green.500` | `#109b00` |
| `palette.utility.green.600` | `#0f8d00` |
| `palette.utility.green.650` | `#0a8902` |
| `palette.utility.green.700` | `#0b6e00` |
| `palette.utility.green.800` | `#095500` |
| `palette.utility.green.900` | `#161e0c` |
| `palette.utility.red.50` | `#f8e8e6` |
| `palette.utility.red.100` | `#f2d1cc` |
| `palette.utility.red.200` | `#e5a399` |
| `palette.utility.red.300` | `#d77566` |
| `palette.utility.red.400` | `#ca4733` |
| `palette.utility.red.500` | `#bd1900` |
| `palette.utility.red.600` | `#ac1700` |
| `palette.utility.red.700` | `#861200` |
| `palette.utility.red.800` | `#680e00` |
| `palette.utility.red.900` | `#4f0b00` |

</details>
