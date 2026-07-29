# UCSD Design Tokens — full reference

> **GENERATED FILE — do not edit.** Produced by `scripts/generate-skill-references.mjs`
> from `packages/tokens/dist/tokens.json`. To change a value, change it in Figma
> and run the sync; see `docs/figma.md`.

Semantic tokens: **144** · component: **0** · primitives: **105**

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
| `color.component.bg-progress-bar` | `--ucsd-color-component-bg-progress-bar` | `bg-component-bg-progress-bar` `text-component-bg-progress-bar` `border-component-bg-progress-bar` | `#d4d5d5` | `#d4d5d5` | — |
| `color.component.btn-label-primary` | `--ucsd-color-component-btn-label-primary` | `bg-component-btn-label-primary` `text-component-btn-label-primary` `border-component-btn-label-primary` | `#182b49` | `#182b49` | — |
| `color.component.btn-label-secondary` | `--ucsd-color-component-btn-label-secondary` | `bg-component-btn-label-secondary` `text-component-btn-label-secondary` `border-component-btn-label-secondary` | `#ffffff` | `#162742` | — |
| `color.component.btn-label-tertiary` | `--ucsd-color-component-btn-label-tertiary` | `bg-component-btn-label-tertiary` `text-component-btn-label-tertiary` `border-component-btn-label-tertiary` | `#ffffff` | `#ffffff` | — |
| `color.component.btn-primary` | `--ucsd-color-component-btn-primary` | `bg-component-btn-primary` `text-component-btn-primary` `border-component-btn-primary` | `#ffcd00` | `#ffcd00` | — |
| `color.component.btn-secondary` | `--ucsd-color-component-btn-secondary` | `bg-component-btn-secondary` `text-component-btn-secondary` `border-component-btn-secondary` | `#00629b` | `#5496bc` | — |
| `color.component.btn-tertiary` | `--ucsd-color-component-btn-tertiary` | `bg-component-btn-tertiary` `text-component-btn-tertiary` `border-component-btn-tertiary` | `#182b49` | `#5496bc` | — |
| `color.component.icon` | `--ucsd-color-component-icon` | `bg-component-icon` `text-component-icon` `border-component-icon` | `#182b49` | `#f5f0e6` | — |
| `color.component.link` | `--ucsd-color-component-link` | `bg-component-link` `text-component-link` `border-component-link` | `#00629b` | `#5496bc` | — |
| `color.component.menu` | `--ucsd-color-component-menu` | `bg-component-menu` `text-component-menu` `border-component-menu` | `#747678` | `#747678` | — |
| `color.component.menu-bottom-nav` | `--ucsd-color-component-menu-bottom-nav` | `bg-component-menu-bottom-nav` `text-component-menu-bottom-nav` `border-component-menu-bottom-nav` | `#6a6b6d` | `#909193` | — |

### `color.foreground`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.foreground.body-text` | `--ucsd-color-foreground-body-text` | `bg-foreground-body-text` `text-foreground-body-text` `border-foreground-body-text` | `#6a6b6d` | `#a1a2a4` | — |
| `color.foreground.body-text-focus` | `--ucsd-color-foreground-body-text-focus` | `bg-foreground-body-text-focus` `text-foreground-body-text-focus` `border-foreground-body-text-focus` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.card-border` | `--ucsd-color-foreground-card-border` | `bg-foreground-card-border` `text-foreground-card-border` `border-foreground-card-border` | `rgba(255, 255, 255, 0)` | `#747678` | — |
| `color.foreground.divider` | `--ucsd-color-foreground-divider` | `bg-foreground-divider` `text-foreground-divider` `border-foreground-divider` | `#647185` | `#959dab` | — |
| `color.foreground.eyebrow` | `--ucsd-color-foreground-eyebrow` | `bg-foreground-eyebrow` `text-foreground-eyebrow` `border-foreground-eyebrow` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.heading-1` | `--ucsd-color-foreground-heading-1` | `bg-foreground-heading-1` `text-foreground-heading-1` `border-foreground-heading-1` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.heading-2` | `--ucsd-color-foreground-heading-2` | `bg-foreground-heading-2` `text-foreground-heading-2` `border-foreground-heading-2` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.heading-3` | `--ucsd-color-foreground-heading-3` | `bg-foreground-heading-3` `text-foreground-heading-3` `border-foreground-heading-3` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.heading-light` | `--ucsd-color-foreground-heading-light` | `bg-foreground-heading-light` `text-foreground-heading-light` `border-foreground-heading-light` | `#ffffff` | `#f5f0e6` | — |
| `color.foreground.subcard-border` | `--ucsd-color-foreground-subcard-border` | `bg-foreground-subcard-border` `text-foreground-subcard-border` `border-foreground-subcard-border` | `#182b49` | `#747678` | — |
| `color.foreground.subheading` | `--ucsd-color-foreground-subheading` | `bg-foreground-subheading` `text-foreground-subheading` `border-foreground-subheading` | `#182b49` | `#f5f0e6` | — |
| `color.foreground.surface-text-bg` | `--ucsd-color-foreground-surface-text-bg` | `bg-foreground-surface-text-bg` `text-foreground-surface-text-bg` `border-foreground-surface-text-bg` | `#f3f4f6` | `#ffffff` | — |

### `color.status`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.status.critical` | `--ucsd-color-status-critical` | `bg-status-critical` `text-status-critical` `border-status-critical` | `#bd1900` | `#bd1900` | — |
| `color.status.good` | `--ucsd-color-status-good` | `bg-status-good` `text-status-good` `border-status-good` | `#109b00` | `#109b00` | — |
| `color.status.warning` | `--ucsd-color-status-warning` | `bg-status-warning` `text-status-warning` `border-status-warning` | `#fc8900` | `#fc8900` | — |

### `color.surface`

| Token | CSS variable | Tailwind | Light | Dark | Use for |
| --- | --- | --- | --- | --- | --- |
| `color.surface.1` | `--ucsd-color-surface-1` | `bg-surface-1` `text-surface-1` `border-surface-1` | `#ffffff` | `#1d1d1d` | — |
| `color.surface.2` | `--ucsd-color-surface-2` | `bg-surface-2` `text-surface-2` `border-surface-2` | `#fbf9f5` | `#404142` | — |
| `color.surface.background` | `--ucsd-color-surface-background` | `bg-surface-background` `text-surface-background` `border-surface-background` | `#182b49` | `#182b49` | — |

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
| `radius.default` | `--ucsd-radius-default` | `rounded-default` | `12px` | — |
| `radius.none` | `--ucsd-radius-none` | `rounded-none` | `0` | — |
| `radius.sm` | `--ucsd-radius-sm` | `rounded-sm` | `4px` | — |
| `radius.lg` | `--ucsd-radius-lg` | `rounded-lg` | `16px` | — |
| `radius.pill` | `--ucsd-radius-pill` | `rounded-pill` | `999px` | — |

### `space`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `space.2x-large` | `--ucsd-space-2x-large` | `p-2x-large` `m-2x-large` `gap-2x-large` | `32px` | — |
| `space.3x-large` | `--ucsd-space-3x-large` | `p-3x-large` `m-3x-large` `gap-3x-large` | `40px` | — |
| `space.4x-large` | `--ucsd-space-4x-large` | `p-4x-large` `m-4x-large` `gap-4x-large` | `48px` | — |
| `space.extra-large` | `--ucsd-space-extra-large` | `p-extra-large` `m-extra-large` `gap-extra-large` | `24px` | — |
| `space.extra-small` | `--ucsd-space-extra-small` | `p-extra-small` `m-extra-small` `gap-extra-small` | `4px` | — |
| `space.large` | `--ucsd-space-large` | `p-large` `m-large` `gap-large` | `16px` | — |
| `space.medium` | `--ucsd-space-medium` | `p-medium` `m-medium` `gap-medium` | `12px` | — |
| `space.small` | `--ucsd-space-small` | `p-small` `m-small` `gap-small` | `8px` | — |

### `type`

| Token | CSS variable | Tailwind | Value | Use for |
| --- | --- | --- | --- | --- |
| `type.body.font-family` | `--ucsd-type-body-font-family` | `font-body` | `Brix Sans` | — |
| `type.body.large.font-size` | `--ucsd-type-body-large-font-size` | `text-body-large` | `24px` | — |
| `type.body.large.line-height` | `--ucsd-type-body-large-line-height` | paired with `text-body-large` | `29px` | — |
| `type.body.large.paragraph-spacing` | `--ucsd-type-body-large-paragraph-spacing` | — | `18px` | — |
| `type.body.large.tracking` | `--ucsd-type-body-large-tracking` | `tracking-body-large` | `0` | — |
| `type.body.large.word-spacing` | `--ucsd-type-body-large-word-spacing` | — | `0.1599999964237213px` | — |
| `type.body.medium.font-size` | `--ucsd-type-body-medium-font-size` | `text-body-medium` | `18px` | — |
| `type.body.medium.line-height` | `--ucsd-type-body-medium-line-height` | paired with `text-body-medium` | `23px` | — |
| `type.body.medium.paragraph-spacing` | `--ucsd-type-body-medium-paragraph-spacing` | — | `18px` | — |
| `type.body.medium.tracking` | `--ucsd-type-body-medium-tracking` | `tracking-body-medium` | `0` | — |
| `type.body.medium.word-spacing` | `--ucsd-type-body-medium-word-spacing` | — | `0.1599999964237213px` | — |
| `type.body.small.font-size` | `--ucsd-type-body-small-font-size` | `text-body-small` | `12px` | — |
| `type.body.small.line-height` | `--ucsd-type-body-small-line-height` | paired with `text-body-small` | `17px` | — |
| `type.body.small.paragraph-spacing` | `--ucsd-type-body-small-paragraph-spacing` | — | `14px` | — |
| `type.body.small.tracking` | `--ucsd-type-body-small-tracking` | `tracking-body-small` | `0` | — |
| `type.body.small.word-spacing` | `--ucsd-type-body-small-word-spacing` | — | `0.1599999964237213px` | — |
| `type.button.font-family` | `--ucsd-type-button-font-family` | `font-button` | `Brix Sans` | — |
| `type.button.font-size` | `--ucsd-type-button-font-size` | `text-button` | `14px` | — |
| `type.button.font-weight` | `--ucsd-type-button-font-weight` | `font-button` | `700` | — |
| `type.button.line-height` | `--ucsd-type-button-line-height` | paired with `text-button` | `17px` | — |
| `type.button.paragraph-spacing` | `--ucsd-type-button-paragraph-spacing` | — | `16px` | — |
| `type.button.tracking` | `--ucsd-type-button-tracking` | `tracking-button` | `0` | — |
| `type.button.word-spacing` | `--ucsd-type-button-word-spacing` | — | `0.1599999964237213px` | — |
| `type.eyebrow.font-family` | `--ucsd-type-eyebrow-font-family` | `font-eyebrow` | `Refrigerator Deluxe` | — |
| `type.eyebrow.font-size` | `--ucsd-type-eyebrow-font-size` | `text-eyebrow` | `8px` | — |
| `type.eyebrow.font-weight` | `--ucsd-type-eyebrow-font-weight` | `font-eyebrow` | `800` | — |
| `type.eyebrow.line-height` | `--ucsd-type-eyebrow-line-height` | paired with `text-eyebrow` | `10px` | — |
| `type.eyebrow.paragraph-spacing` | `--ucsd-type-eyebrow-paragraph-spacing` | — | `8px` | — |
| `type.eyebrow.tracking` | `--ucsd-type-eyebrow-tracking` | `tracking-eyebrow` | `0.800000011920929px` | — |
| `type.eyebrow.word-spacing` | `--ucsd-type-eyebrow-word-spacing` | — | `0.1599999964237213px` | — |
| `type.h1.background` | `--ucsd-type-h1-background` | — | `#182b49` | — |
| `type.h1.font-family` | `--ucsd-type-h1-font-family` | `font-h1` | `Refrigerator Deluxe` | — |
| `type.h1.font-size` | `--ucsd-type-h1-font-size` | `text-h1` | `24px` | — |
| `type.h1.font-weight` | `--ucsd-type-h1-font-weight` | `font-h1` | `800` | — |
| `type.h1.line-height` | `--ucsd-type-h1-line-height` | paired with `text-h1` | `29px` | — |
| `type.h1.paragraph-spacing` | `--ucsd-type-h1-paragraph-spacing` | — | `24px` | — |
| `type.h1.tracking` | `--ucsd-type-h1-tracking` | `tracking-h1` | `-0.20000000298023224px` | — |
| `type.h1.word-spacing` | `--ucsd-type-h1-word-spacing` | — | `0.1599999964237213px` | — |
| `type.h2.font-family` | `--ucsd-type-h2-font-family` | `font-h2` | `Brix Sans` | — |
| `type.h2.font-size` | `--ucsd-type-h2-font-size` | `text-h2` | `18px` | — |
| `type.h2.font-weight` | `--ucsd-type-h2-font-weight` | `font-h2` | `500` | — |
| `type.h2.line-height` | `--ucsd-type-h2-line-height` | paired with `text-h2` | `22px` | — |
| `type.h2.paragraph-spacing` | `--ucsd-type-h2-paragraph-spacing` | — | `16px` | — |
| `type.h2.tracking` | `--ucsd-type-h2-tracking` | `tracking-h2` | `0` | — |
| `type.h2.word-spacing` | `--ucsd-type-h2-word-spacing` | — | `0.1599999964237213px` | — |
| `type.h2-small.font-family` | `--ucsd-type-h2-small-font-family` | `font-h2-small` | `Brix Sans` | — |
| `type.h2-small.font-size` | `--ucsd-type-h2-small-font-size` | `text-h2-small` | `12px` | — |
| `type.h2-small.font-weight` | `--ucsd-type-h2-small-font-weight` | `font-h2-small` | `700` | — |
| `type.h2-small.line-height` | `--ucsd-type-h2-small-line-height` | paired with `text-h2-small` | `18px` | — |
| `type.h2-small.paragraph-spacing` | `--ucsd-type-h2-small-paragraph-spacing` | — | `16px` | — |
| `type.h2-small.tracking` | `--ucsd-type-h2-small-tracking` | `tracking-h2-small` | `0` | — |
| `type.h2-small.word-spacing` | `--ucsd-type-h2-small-word-spacing` | — | `0.1599999964237213px` | — |
| `type.h3.font-family` | `--ucsd-type-h3-font-family` | `font-h3` | `Refrigerator Deluxe` | — |
| `type.h3.font-size` | `--ucsd-type-h3-font-size` | `text-h3` | `14px` | — |
| `type.h3.font-weight` | `--ucsd-type-h3-font-weight` | `font-h3` | `800` | — |
| `type.h3.line-height` | `--ucsd-type-h3-line-height` | paired with `text-h3` | `17px` | — |
| `type.h3.paragraph-spacing` | `--ucsd-type-h3-paragraph-spacing` | — | `10px` | — |
| `type.h3.tracking` | `--ucsd-type-h3-tracking` | `tracking-h3` | `0.800000011920929px` | — |
| `type.h3.word-spacing` | `--ucsd-type-h3-word-spacing` | — | `0.1599999964237213px` | — |
| `type.subheading.font-family` | `--ucsd-type-subheading-font-family` | `font-subheading` | `Brix Sans` | — |
| `type.subheading.font-size` | `--ucsd-type-subheading-font-size` | `text-subheading` | `12px` | — |
| `type.subheading.font-weight` | `--ucsd-type-subheading-font-weight` | `font-subheading` | `700` | — |
| `type.subheading.line-height` | `--ucsd-type-subheading-line-height` | paired with `text-subheading` | `15px` | — |
| `type.subheading.paragraph-spacing` | `--ucsd-type-subheading-paragraph-spacing` | — | `14px` | — |
| `type.subheading.tracking` | `--ucsd-type-subheading-tracking` | `tracking-subheading` | `1.75px` | — |
| `type.subheading.word-spacing` | `--ucsd-type-subheading-word-spacing` | — | `0.1599999964237213px` | — |

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
| `palette.neutral.black` | `#000000` |
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
| `palette.neutral.gray.950` | `#1d1d1d` |
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
| `palette.primary.blue.50` | `#e6eff5` |
| `palette.primary.blue.100` | `#b0cee0` |
| `palette.primary.blue.200` | `#8ab7d1` |
| `palette.primary.blue.300` | `#5496bc` |
| `palette.primary.blue.400` | `#3381af` |
| `palette.primary.blue.500` | `#00629b` |
| `palette.primary.blue.600` | `#00598d` |
| `palette.primary.blue.700` | `#00466e` |
| `palette.primary.blue.800` | `#003655` |
| `palette.primary.blue.900` | `#002941` |
| `palette.primary.navy.50` | `#e8eaed` |
| `palette.primary.navy.100` | `#b7bdc7` |
| `palette.primary.navy.200` | `#959dab` |
| `palette.primary.navy.300` | `#647185` |
| `palette.primary.navy.400` | `#46556d` |
| `palette.primary.navy.500` | `#182b49` |
| `palette.primary.navy.600` | `#162742` |
| `palette.primary.navy.700` | `#111f34` |
| `palette.primary.navy.800` | `#0d1828` |
| `palette.primary.navy.900` | `#0a121f` |
| `palette.secondary.gold.50` | `#f9f4e8` |
| `palette.secondary.gold.100` | `#edddb6` |
| `palette.secondary.gold.200` | `#e5cd93` |
| `palette.secondary.gold.300` | `#d9b662` |
| `palette.secondary.gold.400` | `#d1a843` |
| `palette.secondary.gold.500` | `#c69214` |
| `palette.secondary.gold.600` | `#b48512` |
| `palette.secondary.gold.700` | `#8d680e` |
| `palette.secondary.gold.800` | `#6d500b` |
| `palette.secondary.gold.900` | `#533d08` |
| `palette.secondary.yellow.50` | `#fffae6` |
| `palette.secondary.yellow.100` | `#fff0b0` |
| `palette.secondary.yellow.200` | `#ffe88a` |
| `palette.secondary.yellow.300` | `#ffde54` |
| `palette.secondary.yellow.400` | `#ffd733` |
| `palette.secondary.yellow.500` | `#ffcd00` |
| `palette.secondary.yellow.600` | `#e8bb00` |
| `palette.secondary.yellow.700` | `#b59200` |
| `palette.secondary.yellow.800` | `#8c7100` |
| `palette.secondary.yellow.900` | `#6b5600` |
| `palette.supporting.green.50` | `#e7f5e6` |
| `palette.supporting.green.100` | `#b5e0b0` |
| `palette.supporting.green.200` | `#91d18a` |
| `palette.supporting.green.300` | `#5fbc54` |
| `palette.supporting.green.400` | `#40af33` |
| `palette.supporting.green.500` | `#109b00` |
| `palette.supporting.green.600` | `#0f8d00` |
| `palette.supporting.green.650` | `#0a8902` |
| `palette.supporting.green.700` | `#0b6e00` |
| `palette.supporting.green.800` | `#095500` |
| `palette.supporting.green.900` | `#161e0c` |
| `palette.supporting.orange.50` | `#fff3e6` |
| `palette.supporting.orange.100` | `#fee7cc` |
| `palette.supporting.orange.200` | `#fed099` |
| `palette.supporting.orange.300` | `#fdb866` |
| `palette.supporting.orange.400` | `#fda133` |
| `palette.supporting.orange.500` | `#fc8900` |
| `palette.supporting.orange.600` | `#ca6e00` |
| `palette.supporting.orange.700` | `#975200` |
| `palette.supporting.orange.800` | `#653700` |
| `palette.supporting.orange.900` | `#321b00` |
| `palette.supporting.red.50` | `#f8e8e6` |
| `palette.supporting.red.100` | `#f2d1cc` |
| `palette.supporting.red.200` | `#e5a399` |
| `palette.supporting.red.300` | `#d77566` |
| `palette.supporting.red.400` | `#ca4733` |
| `palette.supporting.red.500` | `#bd1900` |
| `palette.supporting.red.600` | `#ac1700` |
| `palette.supporting.red.700` | `#861200` |
| `palette.supporting.red.800` | `#680e00` |
| `palette.supporting.red.900` | `#4f0b00` |

</details>
