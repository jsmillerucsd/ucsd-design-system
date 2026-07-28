<!-- COPY of docs/migration.md — do not edit here. Edit the source and run `npm run build`. -->

# Migrating Decorator V5 → UCSD Design System

Decorator V5 is Bootstrap **3**, served from `cdn.ucsd.edu/developer/decorator/5.0.2/` with jQuery, Glyphicons, and templates for homepage / blank slate / two-column / three-column. This system is Bootstrap **5**.

That's two majors: the grid moved from floats to flexbox, `xs` stopped being a suffix, jQuery is gone along with its plugin API, Glyphicons were removed, and many class names changed.

**A page conversion is a rewrite of the markup, not a stylesheet swap.** Budget accordingly — the common failure is estimating this as a CSS change.

## Coexistence rule

Old and new may coexist **per page**, never within one page. Bootstrap 3 and 5 define overlapping class names with different meanings; loading both produces layouts that are subtly wrong and very hard to debug.

The unit of migration is therefore a page, and a site can run mixed for as long as it needs to.

## Approach

**1. Inventory.** List every page grouped by which Decorator template it uses, recording custom CSS/JS and who owns the content. Most sites discover here that a handful of templates cover 90% of pages.

**2. Convert one page per template** as a reference:

| Decorator V5 template | New pattern |
|---|---|
| homepage | `docs/layouts/landing-page.md` |
| two-column | `docs/layouts/content-page.md` |
| three-column | `docs/layouts/listing-page.md` |
| blank slate | `docs/layouts/content-page.md` with the sidebar and title band off |

Get these reviewed properly — by design, by an accessibility reviewer, and by whoever owns the content. Everything downstream copies them, so an error here multiplies.

**3. Batch the rest** against the reference conversions.

**4. Validate every page.**

```bash
npm run validate "site/**/*.html"
```

**5. Remove the Decorator CDN link** only once a page has no Bootstrap 3 classes left. The validator's `bootstrap3-legacy` rule is the gate.

### Using an agent for the conversion

This is a good task for one — the mapping is mechanical and large:

> Convert this page from Decorator V5 to the UCSD Design System. Read `DESIGN.md` for the rules and tokens, and follow `docs/migration.md` for the class mapping. Pick the layout pattern that matches. Run `npm run validate` and fix everything it reports before showing me the result.

Review the output. The mapping is mechanical; **judgment calls are not** — whether a `.well` should be a card or a plain section, whether a three-column page is really a listing, whether the alt text a human wrote is still accurate. Those need a person.

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

Full list: `DESIGN.md`, or `generated/tokens.md` for primitives and component tokens. Run the validator to find them all.

## Carried-forward details

Three things Decorator V5 got right and people routinely get wrong. Preserve them:

- The site footer is UCSD **Blue**, not navy.
- The white page-title band has **no gold rule** beneath it.
- Active navbar items are dark blue — not a yellow underline.

## What improves

Worth stating, because migrations need a reason beyond "the old one is old":

| | Decorator V5 | New |
|---|---|---|
| Bootstrap | 3 (end of life, no security patches) | 5.3 |
| jQuery | Required | None |
| Dark mode | Not expressible — the old skill explicitly refuses to advise on it | Native, free with semantic tokens |
| Versioning | Mutable CDN path; consumers can't pin | Immutable versioned URLs + a major-line alias |
| Other frameworks | Bootstrap only | Tokens work in Tailwind, shadcn, Vue, Svelte, email |
| Brand changes | Hand-edited CSS | Change in Figma → PR → every target |
| Agent support | A skill pointing at a kitchen-sink URL | `DESIGN.md` generated from the tokens, plus a validator |
| Accessibility | Not systematically enforced | Contrast checked in CI; validator catches the mechanical subset |
