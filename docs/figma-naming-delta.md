# Figma fixes for the designer

Two categories: things that break emitted tokens, and things that fail the validation gate. Everything else is cosmetic and handled by the sync.

## 1. Broken tokens (fix these first)

| Where | Problem | Fix |
|---|---|---|
| `typography` > `body` > `font-weight` | Value is `"String value"` (Figma's default placeholder) | Set to `regular` or `400` |
| `typography` > `h1` > `background` | A color variable living in the typography collection | Delete it. Type metrics only. If h1 needs a background, it belongs in `colors-semantic` |

## 2. Name inconsistencies

The sync lowercases and hyphenates automatically, so these don't break the build. But they make the Figma file read inconsistently. Fix while the library is young.

| Collection | Current | Rename to |
|---|---|---|
| `colors-brand` | `neutral/cool gray` | `neutral/cool-gray` |
| `colors-primitive` | `neutral/gray/Gray-50` | `neutral/gray/gray-50` |
| `colors-primitive` | `neutral/gray/Gray-950` | `neutral/gray/gray-950` |
| `colors-semantic` | `foreground/heading light` | `foreground/heading-light` |
| `layout` | `spacing/extra large` | `spacing/extra-large` |
| `layout` | `spacing/2X large` | `spacing/2x-large` |
| `layout` | `spacing/3x large` | `spacing/3x-large` |
| `layout` | `spacing/4X large` | `spacing/4x-large` |
| `typography` | `h2 small` | `h2-small` |

Convention: lowercase, hyphenated, no spaces. Also normalise font-weight values to lowercase (`heavy` not `Heavy`, `bold` not `Bold`).

## 3. Aliasing defects

These semantic tokens are bound to raw hex values instead of aliasing a primitive. They work today but break on rebrand.

| Token | Current | Fix |
|---|---|---|
| `color.foreground.card-border` | Raw transparent white | Bind to a `colors-primitive` variable, or delete the token if transparent is the intent |
| `color.foreground.surface-text-bg` | Raw `#f3f4f6` / `#ffffff` (not in UCSD palette) | Rebind to `neutral/gray/gray-50` or another primitive |

## 4. Dark-mode contrast failures

All four fail WCAG 2.2 AA (needs 4.5:1).

| Token (dark mode) | Ratio | Fix |
|---|---|---|
| `color.foreground.body-text` on `color.surface.2` | 4.00:1 | Lighten body-text to `gray-300`, or darken surface-2 |
| `color.component.btn-label-tertiary` on `color.component.btn-tertiary` | 3.25:1 | Darken the tertiary fill, or use a dark label |
| `color.component.menu` on `color.surface.1` | 3.70:1 | Lighten menu to `gray-400` or above |
| `color.system.foreground-information` on `color.system.bg-information` | 2.79:1 | Darken `bg-information` in dark mode (success/warning/error pairs already do this) |

## After fixing

Re-export the changed collections (right-click each collection, Export modes) and send the ZIPs. We run the sync, review the diff, and open a PR. The validation gate checks aliases, mode parity, and contrast automatically.
