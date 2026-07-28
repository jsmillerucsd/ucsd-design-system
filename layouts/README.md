# Layouts — page patterns

The page-level half of the design system. Components answer *"what does a button look like?"*; layouts answer *"what is a content page, and what may an author put on one?"*

Primary consumer is the **CMS**: these patterns become page templates that content authors pick from. They're also the starting point for Next.js routes and static pages, so a landing page looks the same whoever built it and in whatever stack.

## Why these are specs, not a template package

The CMS, Next.js apps and static pages all *render* differently, but they must agree on **anatomy** — which regions exist, what's allowed in each, what the content-model fields are, which landmarks are required. That agreement is prose plus a reference skeleton. A shared runtime template would only work for whichever stack it was written in.

So each pattern file gives you: the region map, the rules, the CMS field list, and reference markup in **both** Bootstrap 5 and Tailwind. Copy the one you need.

## The patterns

| Pattern | Use for | Decorator V5 equivalent |
|---|---|---|
| [`content-page.md`](content-page.md) | Long-form informational pages — policies, about, how-to, program detail. The workhorse. | two-column |
| [`landing-page.md`](landing-page.md) | Marketing / entry pages that route people onward. Stacked sections, no sidebar. | homepage |
| [`listing-page.md`](listing-page.md) | Indexes of repeating items — news, events, people, programs. Filter + results. | three-column |
| [`article-page.md`](article-page.md) | Dated editorial with a byline — news posts, announcements. | two-column |
| [`bare-page.md`](bare-page.md) | Chrome only, empty main. Apps, dashboards, one-off pages. | blank slate |

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

Rules that hold for **every** pattern:

1. Exactly one `<h1>`, in `.ucsd-page-title`. Never skip heading levels below it.
2. `<main id="main">` is the skip-link target and the only `<main>`.
3. Landmarks: `<header>`, `<nav aria-label="…">` (labelled — there is always more than one), `<main>`, `<footer>`.
4. Page chrome is fixed. A site may change navigation contents, never the masthead or footer structure.
5. Section rhythm uses `.ucsd-section` / `.ucsd-section--sm`, not ad-hoc margins.
6. Content width comes from a `container.*` token. Long-form text is capped at `container.prose` (~70ch) — measure is a readability requirement, not a preference.

## Writing a new pattern

Copy the section order from [`content-page.md`](content-page.md). A pattern is not done until it has a content model table — that's the part the CMS team implements against, and the part that's most often missing.

Before adding one, check whether an existing pattern with a different region toggled on would do. Five patterns people understand beats twelve nobody can choose between.
