# Page layouts

Before writing a page, pick a pattern. Full specs — region maps, content models, reference markup for Bootstrap 5 and Tailwind — are in the repo's `layouts/` directory. This is the chooser.

## Pick one

| Pattern | Use when | Key constraint |
|---|---|---|
| **content-page** | Long-form informational content: policy, about, how-to, program detail | Body capped at `container.prose` (~70ch). Optional section-nav sidebar. |
| **landing-page** | An entry point that routes people onward | 2–6 stacked sections from a closed set. Hero replaces the title band. No sidebar, no breadcrumb. |
| **listing-page** | An index of repeating items: news, events, people, programs | Filters in the URL. Server-render page 1. Numbered pagination. |
| **article-page** | Dated editorial with a byline | Content page + publication metadata. Only for genuinely dated content. |
| **bare-page** | Apps, dashboards, bespoke interiors | Chrome only. Justify before using — usually `content-page` with a region off will do. |

**If a person reads the page top to bottom, it's a content page. If they choose from it, it's a landing page.** That single question resolves most cases.

## Shared chrome — every pattern

```
skip link  →  .ucsd-masthead  →  site nav  →  .ucsd-page-title  →  breadcrumb
           →  <main id="main">  ← the pattern goes here →  .ucsd-footer
```

Landing pages omit `.ucsd-page-title` and breadcrumb — their hero carries the `<h1>`.

Rules for all patterns:

1. Exactly one `<h1>`, and no skipped heading levels.
2. `<main id="main">` is the skip-link target and the only `<main>`.
3. Every `<nav>` is labelled — there is always more than one.
4. Masthead and footer structure are fixed. Sites change nav contents, not the chrome.
5. Vertical rhythm via `.ucsd-section` / `.ucsd-section--sm`, not ad-hoc margins.
6. Width from a `container.*` token; long-form text capped at `container.prose`.

## CMS work

Each pattern's spec carries a **content model table** — the fields, types and cardinality a CMS needs. That table is the contract; build against it rather than inferring fields from the markup.

Two rules worth repeating:

- **Constrain in the content model, not in CSS.** "Max 3 related items" belongs in the content type where the author gets feedback, not in a stylesheet where it fails silently.
- **Composed pages use a discriminated union, not free rich text.** A landing page's sections are a typed list over six section types. That constraint is what keeps pages consistent.

## Full specs

In the repo: `layouts/README.md` (index + chrome), then `layouts/<pattern>.md`. If you don't have the repo checked out, the rules above plus the token reference are enough to build a compliant page — ask for the pattern file if you need the exact content model.
