# Building with Bootstrap 5

UCSD's Bootstrap 5 theme is Bootstrap with the UCSD tokens compiled in. **Everything in Bootstrap's own documentation applies.** This file covers only what's UCSD-specific.

## Setup

**No build step** — one link tag, tokens included:

```html
<link rel="stylesheet" href="https://cdn.ucsd.edu/ucsd/2/ucsd-bootstrap.min.css">
<script src="https://cdn.ucsd.edu/ucsd/2/bootstrap.bundle.min.js" defer></script>
```

Pin the major line (`/2/`) for auto-patching, or an exact version (`/2.1.0/`) if you need byte-stability.

**With Sass** — gives you Bootstrap's full variable API on UCSD tokens:

```scss
@import "@ucsd/bootstrap/scss";
```

To trim the bundle, copy `packages/bootstrap/scss/ucsd-bootstrap.scss` and delete the component imports you don't use. Keep the order — functions → tokens → bridge → variables → maps → mixins.

## What the theme changes

| Bootstrap default | UCSD |
|---|---|
| `$primary` #0d6efd | `color.action.primary` (UCSD Blue) |
| `$secondary` grey | `color.action.secondary` (UCSD Navy) |
| System font stack | Roboto; headings in Teko (`font.family.display`) |
| `$spacer` 1rem, keys 0–5 | UCSD `space` scale, keys 0–24 — `.p-4` is 16px |
| `$border-radius` .375rem | `radius.md` (4px) |
| `$focus-ring-width` .25rem | 3px, colour `color.border.focus` |
| Link decoration on hover | Always underlined — a policy choice, don't remove |

Breakpoints are unchanged: 576 / 768 / 992 / 1200 / 1400.

## Dark mode

Native Bootstrap 5.3 colour modes, wired to UCSD tokens:

```html
<html data-bs-theme="dark">
```

Use Bootstrap's semantic utilities (`bg-body`, `text-body-secondary`, `border-secondary`) or UCSD tokens (`var(--ucsd-color-surface-default)`). Both follow the mode. **Hard-coded colours will not** — that's the main reason the no-literal-colour rule exists.

## UCSD-only classes

These have no Bootstrap equivalent. Full definitions in `packages/bootstrap/scss/_ucsd.scss`.

| Class | Use |
|---|---|
| `.ucsd-skip-link` | First element in `<body>`, targets `#main`. Required on every page. |
| `.ucsd-masthead` | UCSD identity band above site nav. Required, never restyled. |
| `.ucsd-masthead__wordmark` | The wordmark image inside it |
| `.ucsd-footer` | Site footer. UCSD **Blue**, not navy — a persistent Decorator V5 misreading. |
| `.ucsd-page-title` | White band holding the `<h1>`. **No gold rule** — also a common error. |
| `.ucsd-prose` | Long-form body wrapper. Caps measure, handles vertical rhythm. |
| `.ucsd-section` / `--sm` | Landing-page section rhythm |

## Recipes

**Button.** `btn-primary` for the single main action, `btn-outline-secondary` for the rest. Never two `btn-primary` side by side.

```html
<button type="button" class="btn btn-primary">Save</button>
<button type="button" class="btn btn-outline-secondary">Cancel</button>
```

**Card.** The link wraps the heading — do not make the whole card a link.

```html
<div class="card h-100">
  <div class="card-body">
    <h3 class="card-title h5"><a href="/x">Funding</a></h3>
    <p class="card-text">…</p>
  </div>
</div>
```

**Alert.** `role="alert"` only for content that appears in response to an action. Static advisory copy gets `role="note"` or no role — a page full of `role="alert"` is announced as a page full of emergencies.

**Form field.** Every input needs a `<label for>`. Placeholders are not labels.

```html
<div class="mb-3">
  <label for="email" class="form-label">Email address</label>
  <input type="email" class="form-control" id="email" aria-describedby="email-help" required>
  <div id="email-help" class="form-text">We'll only use this to contact you about your application.</div>
</div>
```

**Icons.** Glyphicons are gone (Bootstrap 3 only). Use [Bootstrap Icons](https://icons.getbootstrap.com/). Decorative icons get `aria-hidden="true"`; an icon that *is* the control needs an accessible name.

## Common mistakes

- Writing Bootstrap 3 class names — `panel`, `btn-default`, `col-xs-*`, `img-responsive`. See `migration.md`.
- Overriding theme colours with inline styles or a raw hex. Use the token.
- `outline: none` on focus with no replacement.
- Using `.container-fluid` for text content — long-form copy needs `.ucsd-prose` to cap the measure.
- Nesting `.container` inside `.container`. Full-bleed background, contained content: put the background on the section and a `.container` inside it.
