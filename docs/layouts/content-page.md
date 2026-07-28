# Layout: Content Page

The workhorse. Long-form informational content with optional supporting navigation.

**Use for:** policies, procedures, about pages, how-to guides, program and service detail, FAQ.
**Don't use for:** dated editorial (→ `article-page.md`), lists of repeating items (→ `listing-page.md`), marketing entry points (→ `landing-page.md`).

---

## Regions

```
┌─ shared chrome (masthead / nav / page title / breadcrumb) ─┐
│                                                            │
│  <main id="main">   container.base                         │
│  ┌──────────────┬───────────────────────────────────────┐  │
│  │  aside       │  article  .ucsd-prose                 │  │
│  │  (optional)  │                                       │  │
│  │  section nav │  body content                         │  │
│  │  ~1/4        │  capped at container.prose            │  │
│  │              │                                       │  │
│  │              │  ┌─────────────────────────────────┐  │  │
│  │              │  │ callout / aside blocks inline   │  │  │
│  │              │  └─────────────────────────────────┘  │  │
│  └──────────────┴───────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ related content (optional, full width)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  last updated / contact block (optional)                   │
└────────────────────────────────────────────────────────────┘
```

| Region | Required | Notes |
|---|---|---|
| `aside` — section nav | No | Sibling pages in this section. Omit for a standalone page; don't leave an empty column. |
| `article` — body | **Yes** | The reason the page exists. Wrapped in `.ucsd-prose`. |
| Related content | No | Up to 3 cards. More than 3 means it wants to be a listing page. |
| Meta footer | No | Last-updated date and/or a contact. Recommended for policy pages. |

## Grid

| Breakpoint | Behavior |
|---|---|
| `< md` (768) | Single column. Section nav collapses to an accordion **above** the body. |
| `≥ md` | Sidebar 3 cols / body 9 cols. |
| `≥ lg` (992) | Sidebar 3 / body 8, with 1 col of trailing gutter so measure stays near `container.prose`. |

Body text is capped at `container.prose` (~70ch) **regardless of breakpoint**. A full-width line of body copy at 1400px is unreadable; the cap is not negotiable.

## What may go in the body

Allowed: headings h2–h4, paragraphs, lists, tables, images with captions, callouts (`alert`), accordions, embedded video, buttons, definition lists.

Not allowed: hero blocks, full-bleed sections, card grids wider than the prose measure, carousels. If a page wants those, it's a landing page.

## Content model

What the CMS needs to store. Field names are suggestions; **types and cardinality are not.**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✔ | Renders as the single `<h1>`. Max ~70 chars. |
| `summary` | text | | 1–2 sentences under the title. Also the meta description. |
| `body` | rich text | ✔ | Maps to `.ucsd-prose`. Restrict the editor to the allowed elements above. |
| `sectionNav` | reference (many) | | Sibling pages. Usually derived from the content tree, not hand-set. |
| `relatedContent` | reference (0–3) | | Renders as cards. Enforce the cap in the CMS, not in CSS. |
| `contact` | reference (0–1) | | Name, email, phone. |
| `lastUpdated` | date | | Auto-set on publish. Display for policy/procedure content. |
| `breadcrumb` | derived | ✔ | From the content tree. Never author it by hand. |

## Accessibility

- Section nav is `<nav aria-label="Section">` — distinct from `aria-label="Main"`.
- Mark the current page in section nav with `aria-current="page"`, not colour alone.
- Body headings start at `<h2>`; the page `<h1>` is in the title band.
- Tables need `<caption>` and `<th scope>`. Long tables get a keyboard-reachable scroll container (`tabindex="0"` + `role="region"` + label).
- Related-content cards: the link wraps the heading. Never make the whole card a link with `aria-label` duplicating the heading.

## Reference markup — Bootstrap 5

```html
<main id="main" class="container my-5">
  <div class="row g-5">
    <aside class="col-12 col-md-3">
      <nav aria-label="Section">
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><a href="/a">Overview</a></li>
          <li class="list-group-item active" aria-current="page">Eligibility</li>
        </ul>
      </nav>
    </aside>

    <article class="col-12 col-md-9 col-lg-8 ucsd-prose">
      <h2>Who is eligible</h2>
      <p>…</p>

      <div class="alert alert-info" role="note">
        <strong>Note.</strong> Applications close 30 June.
      </div>
    </article>
  </div>

  <section class="ucsd-section--sm" aria-labelledby="related-h">
    <h2 id="related-h" class="h4">Related</h2>
    <div class="row g-4">
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title h6"><a href="/x">How to apply</a></h3>
            <p class="card-text">…</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
```

## Reference markup — Tailwind

```html
<main id="main" class="mx-auto max-w-[--ucsd-container-base] px-4 py-12">
  <div class="grid gap-10 md:grid-cols-12">
    <aside class="md:col-span-3">
      <nav aria-label="Section">
        <ul class="divide-y divide-border-subtle">
          <li class="py-2"><a href="/a" class="text-text-link hover:underline">Overview</a></li>
          <li class="py-2 font-semibold text-action-primary" aria-current="page">Eligibility</li>
        </ul>
      </nav>
    </aside>

    <article class="md:col-span-9 lg:col-span-8 max-w-prose">
      <h2 class="text-2xl font-semibold">Who is eligible</h2>
      <p class="mt-4 text-text-default">…</p>
    </article>
  </div>
</main>
```

## Do / Don't

| Do | Don't |
|---|---|
| Cap body at `container.prose` | Let text run the full container width |
| Omit the sidebar when there are no siblings | Render an empty sidebar column |
| Use `.ucsd-prose` and let it handle rhythm | Add per-element margin classes throughout the body |
| Cap related content at 3 | Grow it into an un-paginated list |
| Start body headings at `<h2>` | Add a second `<h1>` in the body |
