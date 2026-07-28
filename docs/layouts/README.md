# Page layouts

Components answer *"what does a button look like?"* Layouts answer *"what is a content page, and what may an author put on one?"*

The primary consumer is the **CMS** — these patterns become the templates content authors pick from. They're also the starting point for Next.js routes and static pages, so a landing page looks the same whoever built it, in whatever stack.

## Pick a pattern

| Pattern | Use for | Decorator V5 equivalent |
|---|---|---|
| [`content-page.md`](content-page.md) | Long-form informational pages — policy, about, how-to, program detail. The workhorse. | two-column |
| [`landing-page.md`](landing-page.md) | Entry pages that route people onward. Stacked sections, no sidebar. | homepage |
| [`listing-page.md`](listing-page.md) | Indexes of repeating items — news, events, people, programs. Filter + results. | three-column |

**If a person reads the page top to bottom, it's a content page. If they choose from it, it's a landing page.** That one question resolves most cases.

**Variants** are a content page with regions toggled, not separate patterns:

- *Article* — a content page plus publication metadata (date, byline). Use it only for genuinely dated editorial; an undated "news" page is a content page.
- *Bare* — chrome only, empty `<main>`, for apps and dashboards. Justify it before reaching for it; a content page with the sidebar and title band off is almost always what you actually want.

## Why specs rather than a template package

The CMS, Next.js apps and static pages all *render* differently. What they must agree on is **anatomy** — which regions exist, what's allowed in each, the content-model fields, the required landmarks. That agreement is prose plus a reference skeleton.

A shared runtime template would only serve whichever stack it was built for, and would put the design system team in the path of every CMS release. Specs keep the contract portable and the teams independent.

So each pattern file carries: the region map, the rules, the CMS field list, and reference markup in Bootstrap 5 and Tailwind. Copy the one you need.

## Shared page chrome

Every pattern uses the same outer shell. Don't re-derive it per page.

```
┌──────────────────────────────────────────────┐
│ skip link (visible on focus)                 │
├──────────────────────────────────────────────┤
│ .ucsd-masthead        UCSD identity band     │  ← required, never modified
├──────────────────────────────────────────────┤
│ site navigation       <nav aria-label="Main">│  ← per-site
├──────────────────────────────────────────────┤
│ .ucsd-page-title      H1 + optional summary  │  ← white band, no gold rule
├──────────────────────────────────────────────┤
│ breadcrumb            <nav aria-label="Bread">│  ← all patterns except landing
├──────────────────────────────────────────────┤
│                                              │
│ <main id="main">      ← THE PATTERN GOES HERE│
│                                              │
├──────────────────────────────────────────────┤
│ .ucsd-footer          UCSD Blue, not navy    │  ← required
└──────────────────────────────────────────────┘
```

Landing pages omit `.ucsd-page-title` and the breadcrumb — their hero carries the `<h1>`.

Rules that hold for **every** pattern:

1. Exactly one `<h1>`, in `.ucsd-page-title`. Never skip heading levels below it.
2. `<main id="main">` is the skip-link target and the only `<main>`.
3. Landmarks: `<header>`, `<nav aria-label="…">` (labelled — there is always more than one), `<main>`, `<footer>`.
4. Page chrome is fixed. A site may change navigation contents, never the masthead or footer structure.
5. Section rhythm uses `.ucsd-section` / `.ucsd-section--sm`, not ad-hoc margins.
6. Content width comes from a `container.*` token. Long-form text is capped at `container.prose` — measure is a readability requirement, not a preference.

## The content model is the real deliverable

Each pattern carries a **content model table**. That table is what the CMS team builds against, and it's the part most often left out of design-system documentation — which is why CMS templates usually drift from the design system within a release or two. Build against the table, not against the markup.

Two rules carry most of the weight:

- **Constrain in the content model, not in CSS.** "Maximum 3 related items" belongs in the content type, where an author gets feedback while writing. Enforced in CSS it fails silently, and the author never learns.
- **Prefer a discriminated union to free rich text** for composed pages. A landing page's `sections` is a typed list over a closed set of section types, not a page-builder. The constraint is the feature — it's what keeps pages consistent without anyone policing them.

## Rendering a pattern

1. Pick the pattern. If none fits, re-read them — the answer is usually `content-page` with a region turned off.
2. Take the shared chrome above. Never re-derive the masthead or footer.
3. Copy the reference markup for your stack from the pattern file.
4. Map the content model to your CMS's field types.
5. Validate:
   ```bash
   npm run validate path/to/template.html
   ```

## Adding or changing a pattern

A new pattern needs a real use case that two or more teams have, a content model, an accessibility section, and reference markup for at least Bootstrap 5. Same review as a token change — one design approval, one engineering approval.

Changing an existing pattern is a **breaking change** if it adds a required field or removes a region, because published content has to be migrated. Ship those with a migration note, and batch them.

Before adding one, check whether an existing pattern with a different region toggled would do. Three patterns people understand beats twelve nobody can choose between.

## Open question

⟡ **Which CMS?** Patterns are written CMS-agnostically, with content models in neutral field types. Once the platform is settled, add a mapping table per pattern (field → that platform's field type) and, if the platform supports it, ship the content types as installable config. Tracked as open question 1 in [`../architecture.md`](../architecture.md).
