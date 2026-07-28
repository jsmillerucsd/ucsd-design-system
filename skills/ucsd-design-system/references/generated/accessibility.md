<!-- COPY of docs/accessibility.md — do not edit here. Edit the source and run `npm run build`. -->

# Accessibility

UC San Diego is a public institution; WCAG 2.2 AA is a legal obligation, not a quality bar. The rules below are the ones that get broken most often in practice.

## Every page

- [ ] One `<h1>`. No skipped levels (`h2` → `h4` is a defect).
- [ ] Skip link as the first focusable element, targeting `<main id="main">`.
- [ ] Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`. Multiple `<nav>`s each need `aria-label`.
- [ ] `<html lang="en">`.
- [ ] `<title>` says where the user is, most specific first.
- [ ] Zooms to 400% without horizontal scrolling or clipped content.
- [ ] Nothing conveyed by colour alone.

## Focus

The most commonly broken requirement.

```css
/* never this */
:focus { outline: none; }

/* if you must restyle, always replace */
:focus-visible {
  outline: 3px solid var(--ucsd-color-border-focus);
  outline-offset: 2px;
}
```

The focus indicator must have 3:1 contrast against **both** the component and its background, and must not be clipped by an ancestor's `overflow: hidden`. Focus order follows visual order. Never use positive `tabindex`.

## Contrast (WCAG 1.4.3, 1.4.11)

| Content | Minimum |
|---|---|
| Body text | 4.5:1 |
| Large text (≥24px, or ≥19px bold) | 3:1 |
| UI component boundaries, icons, focus rings | 3:1 |

The token pairs are checked in CI in both modes, so `text.default` on `surface.default` is safe. What isn't checked: **text over images**. Use a scrim, or move the text beside the image.

## Target size (WCAG 2.2, 2.5.8)

Interactive targets are at least 24×24px, and 44×44px for anything primary or touch-first. `button.min-height` is 44px for this reason — don't lower it. Adjacent targets need spacing so they aren't mis-tapped.

## Forms

- Every input has a `<label for>`. **A placeholder is not a label** — it disappears on input and usually fails contrast.
- Required fields marked in text, not colour or an unexplained asterisk.
- Errors: identify the field in the message, describe the fix, and move focus to the first error on submit.
- Associate hints and errors with `aria-describedby`.
- Group related controls in `<fieldset>` with a `<legend>` (radios, checkbox sets, address blocks).
- Never validate on blur alone — it fires while a keyboard user is still tabbing through.

## Images & icons

- Every `<img>` has `alt`. Decorative → `alt=""` (empty, not missing).
- Alt describes purpose, not appearance. A photo credit is not alt text.
- Decorative icons: `aria-hidden="true"`. Icon-only controls need an accessible name.
- Text in images is a last resort; if unavoidable, repeat it in the alt.

## Interactive components

Prefer native elements — `<button>`, `<a>`, `<details>`, `<dialog>`. They come with keyboard behaviour, focus handling and roles you would otherwise have to rebuild.

- `<a>` navigates; `<button>` acts. `<div onclick>` is neither and is not keyboard reachable.
- Modals: trap focus, restore focus to the trigger on close, close on Escape.
- Dropdowns/menus: arrow keys move within, Escape closes, focus returns to the trigger.
- Accordions: the trigger is a `<button>` with `aria-expanded`.
- Tabs: arrow keys switch, `aria-selected` on the active tab.

Bootstrap's JS components and shadcn's Radix primitives handle most of this. Hand-rolled replacements reliably lose it.

## Motion

Respect `prefers-reduced-motion` — the theme already ships a global reduction. Nothing may flash more than 3× per second. Don't auto-play video with sound. Anything auto-advancing needs a pause control.

## Dynamic content

- Announce results and status changes with `aria-live="polite"`. A filtered listing that updates silently is unusable with a screen reader.
- `aria-live="assertive"` only for genuine errors — it interrupts.
- Move focus to new content after a route change in an SPA, or the user stays at the old position.

## Tables

`<caption>`, `<th scope="col|row">`, no layout tables. Wide tables get a scroll container that is keyboard-reachable:

```html
<div role="region" aria-labelledby="t-cap" tabindex="0" class="table-responsive">
  <table class="table">
    <caption id="t-cap">Application deadlines by program</caption>
    …
  </table>
</div>
```

## Checking your work

The validator catches the mechanical subset (missing alt, suppressed focus, literal colours):

```bash
node skills/ucsd-design-system/scripts/validate.mjs <files>
```

It cannot judge alt text quality, focus order, or whether a live region says something useful. Those need a human with a keyboard and a screen reader. Automated checks find roughly a third of real issues — never report a page as accessible on the strength of a passing linter.
