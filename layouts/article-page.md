# Layout: Article Page

Dated editorial with attribution. A content page plus a byline, a publication date, and sharing.

**Use for:** news posts, announcements, blog entries, research stories.
**Don't use for:** evergreen reference content — a policy page with a date on it reads as expired the following year (→ `content-page.md`).

---

## Regions

```
┌─ shared chrome + breadcrumb ────────────────────────────────┐
│  <main id="main">   container.base                          │
│                                                             │
│   h1  (in .ucsd-page-title)                                 │
│   byline · <time> · category  ← article header, above body  │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ lead image (optional, container.base wide)            │ │
│   └───────────────────────────────────────────────────────┘ │
│   ┌─────────────────────────────────┬───────────────────┐   │
│   │ article  .ucsd-prose            │ aside (optional)  │   │
│   │ capped at container.prose       │ share · contact   │   │
│   └─────────────────────────────────┴───────────────────┘   │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ related articles (2–3)                                │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

Same grid and prose rules as `content-page.md` — the difference is the header metadata and the sidebar's purpose (sharing/contact, not navigation).

## Rules

- Publication date is always a machine-readable `<time datetime="…">`.
- Show an updated date **only** when the article was materially revised, and label it "Updated" — otherwise it reads as churn.
- Lead image may exceed the prose measure but not `container.base`. Captions sit inside the prose measure.
- Author is optional; when the author is an office rather than a person, use the office name — not "Staff".
- No sharing widgets that load third-party scripts. Plain links with `?utm_` params.

## Content model

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✔ | The `<h1>` |
| `summary` | text | ✔ | Standfirst; also meta description and the listing blurb |
| `publishedAt` | datetime | ✔ | Drives `<time datetime>` and listing sort |
| `updatedAt` | datetime | | Display only when materially revised |
| `author` | reference or string | | Person or office |
| `category` | enum | ✔ | Drives listing facets |
| `leadImage` | media | | `alt` required unless decorative; caption + credit optional |
| `body` | rich text | ✔ | `.ucsd-prose`, same allowed elements as content page |
| `relatedArticles` | reference (0–3) | | Usually auto-derived from category |

## Accessibility

- Wrap in `<article>`; the header metadata goes in a `<header>` inside it.
- The date must be in the accessible name of nothing — it's supplementary. Don't fold it into the heading link.
- Lead image credit is not alt text. Alt describes the image; the credit is visible text.
- Related-article links use the article title, never "Read more".

## Reference markup — Bootstrap 5

```html
<main id="main" class="container my-5">
  <article>
    <header class="mb-4">
      <p class="text-body-secondary">
        <span class="badge text-bg-secondary">Research</span>
        <time datetime="2026-07-14">14 July 2026</time>
        · By Office of Research Affairs
      </p>
      <figure class="figure">
        <img class="img-fluid rounded" src="/lead.jpg" alt="Researchers in a coastal field station laboratory.">
        <figcaption class="figure-caption">Photo: UC San Diego</figcaption>
      </figure>
    </header>

    <div class="row g-5">
      <div class="col-12 col-lg-8 ucsd-prose">
        <p class="lead">Standfirst paragraph.</p>
        <p>…</p>
      </div>
      <aside class="col-12 col-lg-3 offset-lg-1">
        <h2 class="h6">Share</h2>
        <ul class="list-unstyled"><li><a href="#">Email this story</a></li></ul>
      </aside>
    </div>
  </article>
</main>
```
