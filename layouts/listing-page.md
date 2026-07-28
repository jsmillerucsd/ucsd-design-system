# Layout: Listing Page

An index of repeating items of one type, with a way to narrow them down.

**Use for:** news, events, people/directory, programs, courses, resources.
**Don't use for:** a handful of links (put them in a content page), or mixed item types (make separate listings).

---

## Regions

```
┌─ shared chrome + page title + breadcrumb ───────────────────┐
│  <main id="main">   container.base                          │
│  ┌───────────────┬───────────────────────────────────────┐  │
│  │ filters       │  result count + sort                  │  │
│  │ (optional)    ├───────────────────────────────────────┤  │
│  │ facets        │  ┌─────────────────────────────────┐  │  │
│  │ ~1/4          │  │ item                            │  │  │
│  │               │  ├─────────────────────────────────┤  │  │
│  │               │  │ item  (card or row)             │  │  │
│  │               │  └─────────────────────────────────┘  │  │
│  │               │  pagination                           │  │
│  └───────────────┴───────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

| Region | Required | Notes |
|---|---|---|
| Filters / facets | No | Add only above ~20 items. Below that they're clutter. |
| Result summary | **Yes** | "24 results" — and the active filters, as removable chips |
| Results | **Yes** | Card grid or row list. Pick one per listing and keep it. |
| Pagination | Conditional | Required above one page. Numbered, not infinite scroll. |
| Empty state | **Yes** | Must exist and must offer a way out — clear filters, or a suggestion |

## Rules

- **Server-render the first page.** Listings are the most-linked, most-crawled pages on a university site; a client-only listing is invisible to search.
- **Filters go in the URL** as query params. A filtered listing must be linkable and back-button-safe.
- **Cards vs rows:** cards when a thumbnail carries meaning (people, events); rows when scanning many items matters (courses, policies).
- **Page size 10–25.** Ship a real pagination control; infinite scroll strands keyboard users and hides the footer.
- **Sort** defaults to the most useful order for the type — date desc for news, upcoming-first for events, alpha for people.

## Content model

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✔ | The `<h1>` |
| `itemType` | enum | ✔ | Which content type this lists — drives the card shape |
| `facets` | list | | `{ field, label, type: checkbox\|select\|dateRange }` |
| `defaultSort` | enum | ✔ | |
| `pageSize` | int | ✔ | 10–25 |
| `emptyStateText` | text | ✔ | Author-editable. Do not hard-code "No results." |

Per item, at minimum: `title`, `url`, `summary`, plus a type-specific field (`date` for news/events, `role` + `photo` for people).

## Accessibility

- Filters are `<form>` with a real submit; don't rely on change-events alone.
- Announce result changes in an `aria-live="polite"` region — otherwise a screen-reader user filters and hears nothing.
- Pagination is `<nav aria-label="Pagination">`, current page marked `aria-current="page"`.
- Each item's link text must make sense out of context. Never "Read more" ×20 — use the item title as the link.
- The results container is a list (`<ul>`/`<li>`), so assistive tech announces "list, 24 items".

## Reference markup — Bootstrap 5

```html
<main id="main" class="container my-5">
  <div class="row g-5">
    <aside class="col-12 col-lg-3">
      <form aria-label="Filter results">
        <fieldset class="mb-4">
          <legend class="h6">Category</legend>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="cat-1" name="category" value="research">
            <label class="form-check-label" for="cat-1">Research</label>
          </div>
        </fieldset>
        <button class="btn btn-primary" type="submit">Apply filters</button>
      </form>
    </aside>

    <div class="col-12 col-lg-9">
      <p class="text-body-secondary" role="status" aria-live="polite">24 results</p>

      <ul class="list-unstyled row g-4">
        <li class="col-12 col-md-6">
          <article class="card h-100">
            <div class="card-body">
              <p class="text-body-secondary small mb-1">
                <time datetime="2026-07-14">14 July 2026</time>
              </p>
              <h2 class="card-title h5"><a href="/news/grant">Campus receives $4M research grant</a></h2>
              <p class="card-text">…</p>
            </div>
          </article>
        </li>
      </ul>

      <nav aria-label="Pagination">
        <ul class="pagination">
          <li class="page-item active" aria-current="page"><span class="page-link">1</span></li>
          <li class="page-item"><a class="page-link" href="?page=2">2</a></li>
        </ul>
      </nav>
    </div>
  </div>
</main>
```

## Do / Don't

| Do | Don't |
|---|---|
| Put filter state in the URL | Keep it in component state only |
| Server-render page 1 | Ship an empty shell that fetches on mount |
| Use the item title as link text | Repeat "Read more" for every item |
| Numbered pagination | Infinite scroll |
| Write a real empty state | Render a blank area |
