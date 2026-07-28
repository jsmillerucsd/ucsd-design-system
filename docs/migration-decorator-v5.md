# Migrating off Decorator V5

The programme-level view. For the class-by-class mapping table, see [`skills/ucsd-design-system/references/migration.md`](../skills/ucsd-design-system/references/migration.md) — that file is the reference both humans and coding agents use, so it's kept in one place.

---

## What you're actually migrating

Decorator V5 is Bootstrap **3**, served from `cdn.ucsd.edu/developer/decorator/5.0.2/`, with jQuery, Glyphicons, and page templates for homepage / blank slate / two-column / three-column.

Two major versions separate it from Bootstrap 5:

- The grid moved from floats to flexbox, and `xs` stopped being a suffix.
- jQuery was dropped entirely, along with the jQuery plugin API.
- Glyphicons were removed and the font is no longer shipped.
- Many class names changed (`panel`→`card`, `btn-default`→`btn-secondary`, and the whole `left/right`→`start/end` logical-property rename).

**A page conversion is a markup rewrite, not a stylesheet swap.** Budget accordingly — the common failure is estimating this as a CSS change.

## Coexistence

Old and new may coexist **per page**, never within one page. Bootstrap 3 and 5 define overlapping class names with different meanings; loading both produces layouts that are subtly wrong and very hard to debug.

So the unit of migration is a page, and a site can run mixed for as long as it needs to.

## Approach

**1. Inventory.** List every page, grouped by which Decorator template it uses. Record: template, whether it has custom CSS/JS, and who owns the content. Most sites discover here that a handful of templates cover 90% of pages.

**2. Convert one page per template.** Four reference conversions — one each for homepage, two-column, three-column, blank slate — mapped to the new patterns:

| Decorator V5 template | New pattern |
|---|---|
| homepage | `layouts/landing-page.md` |
| two-column | `layouts/content-page.md` |
| three-column | `layouts/listing-page.md` |
| blank slate | `layouts/bare-page.md` |

Get these reviewed properly — by design, by an accessibility reviewer, and by whoever owns the content. Everything downstream copies them, so an error here multiplies.

**3. Batch the rest** against the reference conversions.

**4. Validate every page.**

```bash
node skills/ucsd-design-system/scripts/validate.mjs "site/**/*.html"
```

**5. Remove the Decorator CDN link** only once a page has no Bootstrap 3 classes left. The validator's `bootstrap3-legacy` rule is the gate.

## Using an agent for the conversion

This is a good task for one — the mapping is mechanical and large. Point it at the skill:

> Convert this page from Decorator V5 to the UCSD Design System. Use the `ucsd-design-system` skill. Follow `references/migration.md` for class mapping and pick the layout pattern that matches. Run the validator and fix everything it reports before showing me the result.

Review the output. The mapping is mechanical; **judgment calls are not** — whether a `.well` should be a card or a plain section, whether a three-column page is really a listing, whether the alt text a human wrote is still accurate. Those need a person.

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
| Agent support | A skill pointing at a kitchen-sink URL | Self-contained skill, generated from the tokens, with a validator |
| Accessibility | Not systematically enforced | Contrast checked in CI; validator catches the mechanical subset |
