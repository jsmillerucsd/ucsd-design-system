# Migrating Decorator V5 → UCSD Design System

Decorator V5 is Bootstrap **3**. This system is Bootstrap **5**. That's two majors: the grid changed from floats to flexbox, jQuery is gone, and many class names changed. Treat a page conversion as a rewrite of the markup, not a stylesheet swap.

## Coexistence rule

Old and new may coexist **per page**, never within one page. Bootstrap 3 and 5 define overlapping class names with different meanings — loading both produces layouts that are subtly wrong in ways that are very hard to debug. Migrate whole pages.

## Class mapping

### Grid

| Decorator V5 (BS3) | UCSD (BS5) |
|---|---|
| `.col-xs-6` | `.col-6` |
| `.col-sm-6` `.col-md-6` `.col-lg-6` | unchanged |
| `.col-md-offset-2` | `.offset-md-2` |
| `.col-md-push-*` / `.col-md-pull-*` | `.order-md-*` |
| `.row` with float clearing | `.row` is flexbox; `.clearfix` usually unnecessary |
| Gutter via padding | `.g-*` gap utilities |

`xs` is not a suffix in Bootstrap 5 — it's the unprefixed default. `.col-xs-6` silently does nothing.

### Components

| Decorator V5 (BS3) | UCSD (BS5) |
|---|---|
| `.panel` `.panel-default` | `.card` |
| `.panel-heading` | `.card-header` |
| `.panel-body` | `.card-body` |
| `.panel-footer` | `.card-footer` |
| `.btn-default` | `.btn-secondary` or `.btn-outline-secondary` |
| `.btn-xs` | `.btn-sm` (no `xs` size) |
| `.img-responsive` | `.img-fluid` |
| `.img-circle` | `.rounded-circle` |
| `.well` | `.card` or a `bg-body-tertiary` block |
| `.page-header` | `.ucsd-page-title` |
| `.list-inline > li` | `.list-inline-item` on each `<li>` |
| `.form-group` | `.mb-3` (or a grid row) |
| `.control-label` | `.form-label` |
| `.form-control-static` | `.form-control-plaintext` |
| `.form-horizontal` | `.row` + `.col-form-label` |
| `.input-lg` `.input-sm` | `.form-control-lg` `.form-control-sm` |
| `.help-block` | `.form-text` |
| `.has-error` | `.is-invalid` + `.invalid-feedback` |
| `.checkbox` / `.radio` wrappers | `.form-check` + `.form-check-input` / `.form-check-label` |
| `.navbar-toggle` | `.navbar-toggler` |
| `.navbar-right` | `.ms-auto` |
| `.hidden-xs` `.visible-xs` | `.d-none .d-sm-block` etc. |
| `.pull-left` / `.pull-right` | `.float-start` / `.float-end` |
| `.text-muted` | `.text-body-secondary` |
| `.label` | `.badge` |
| `.badge` (pill counter) | `.badge.rounded-pill` |
| `.thumbnail` | `.card` |
| `.dl-horizontal` | `.row` on `<dl>` + `.col-*` on `<dt>`/`<dd>` |

### Utilities & direction

Bootstrap 5 uses logical properties. `left/right` became `start/end`:

`.ml-*` → `.ms-*` · `.mr-*` → `.me-*` · `.pl-*` → `.ps-*` · `.pr-*` → `.pe-*` · `.text-left` → `.text-start` · `.text-right` → `.text-end`

### Icons

Glyphicons were removed in Bootstrap 4 and the font is not shipped. Replace with [Bootstrap Icons](https://icons.getbootstrap.com/):

```html
<!-- was -->  <span class="glyphicon glyphicon-search"></span>
<!-- now -->  <i class="bi bi-search" aria-hidden="true"></i>
```

An icon that is the only content of a control needs an accessible name — `aria-label` on the control, or visually-hidden text.

### JavaScript

Bootstrap 5 has **no jQuery dependency** and no jQuery plugin API.

```js
// was
$('#myModal').modal('show');
$('[data-toggle="tooltip"]').tooltip();

// now
bootstrap.Modal.getOrCreateInstance(document.getElementById('myModal')).show();
document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach((el) => new bootstrap.Tooltip(el));
```

All `data-toggle`, `data-target`, `data-dismiss`, `data-parent` attributes gain a `bs` infix: `data-bs-toggle`, `data-bs-target`, `data-bs-dismiss`, `data-bs-parent`.

## Colour and spacing

Decorator V5 pages hard-code hex values. Replace every one with a token:

| Literal | Token |
|---|---|
| `#00629b` | `var(--ucsd-color-action-primary)` — or `--ucsd-color-brand-blue` for the footer band |
| `#182b49` | `var(--ucsd-color-action-secondary)` / `--ucsd-color-brand-navy` |
| `#ffcd00` | `var(--ucsd-color-brand-gold)` |

Full list: `generated/tokens.md`. Run the validator to find them all.

## Carried-forward details

Three things Decorator V5 got right and people routinely get wrong. Preserve them:

- The site footer is UCSD **Blue** (`#00629b`), not navy.
- The white page-title band has **no gold rule** beneath it.
- Active navbar items are dark blue — not a yellow underline.

## Suggested order

1. Inventory pages; group by template (homepage / two-column / three-column / blank slate).
2. Convert one page per template as a reference. Get it reviewed.
3. Batch the rest against those references.
4. Run the validator on every converted page:
   ```bash
   node skills/ucsd-design-system/scripts/validate.mjs "path/**/*.html"
   ```
5. Remove the Decorator CDN link only when a page has **no** Bootstrap 3 classes left.
