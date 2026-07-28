# Layout: Landing Page

An entry point whose job is to **route people onward**, not to hold the information itself.

**Use for:** site homepages, department and program entry pages, campaign pages.
**Don't use for:** anything a person reads top to bottom (→ `content-page.md`). If someone needs to *read* the page rather than *choose* from it, it isn't a landing page.

---

## Regions

A landing page is an ordered stack of full-width sections. There is **no sidebar** and no breadcrumb.

```
┌─ shared chrome (masthead / nav) ────────────────────────────┐
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ HERO                        required, exactly one     ║  │
│  ║ h1 · summary · 1–2 CTAs · optional image              ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ SECTION  .ucsd-section                                │  │
│  │ one of: card grid · feature · stats · CTA band ·      │  │
│  │         highlight list · embedded listing             │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ SECTION  (repeat — 2 to 6 total)                      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ CLOSING CTA  optional but recommended                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

Note the hero replaces `.ucsd-page-title` — a landing page carries its `<h1>` in the hero, so the standard title band is **omitted**. This is the only pattern where that's true.

## Section types

Authors compose from this closed set. A closed set is what stops landing pages from becoming freeform page-builders that nobody can maintain.

| Type | Contents | Constraints |
|---|---|---|
| `cardGrid` | 2–4 cards, each with heading, blurb, link | 3 is the default. 5+ wants a listing page. |
| `feature` | Image + text, alternating sides | Max 3 consecutive, or it reads as a slideshow |
| `stats` | 2–4 number + label pairs | Numbers need a unit or context; a bare "12,000" says nothing |
| `ctaBand` | Heading + 1–2 buttons on `surface.inverse` | Max 2 per page including the closing CTA |
| `highlightList` | Short linked list, e.g. "Popular pages" | Max 8 items |
| `embeddedListing` | Latest N items from a listing page | Always ends with a "View all" link |

**Section budget: 2–6.** Below 2 it should be a content page; above 6 nobody scrolls that far.

## Grid & rhythm

- Sections are full-bleed background, `container.base` content.
- Vertical rhythm: `.ucsd-section` (`space.16`). Use `.ucsd-section--sm` (`space.10`) only for a run of short sections.
- Alternate `surface.default` / `surface.subtle` between adjacent sections to separate them. Never use a horizontal rule for this.
- Card grids: 1 col `< md`, 2 col `md`, 3–4 col `≥ lg`.

## Hero rules

- Exactly one `<h1>`.
- Max **two** CTAs, one visually primary. Three CTAs is not a choice, it's a shrug.
- Background image must keep AA contrast for the overlaid text — use a scrim, and test both modes. If you can't hit contrast, put the text beside the image, not on it.
- No carousel. It is a resolved question: they suppress engagement past slide one and are an a11y liability.
- Hero height is content-driven. Don't set `100vh` — it hides that the page scrolls.

## Content model

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✔ | The `<h1>`, rendered in the hero |
| `summary` | text | ✔ | 1–2 sentences. Also the meta description. |
| `heroImage` | media | | Needs `alt`; decorative → `alt=""`. Supply a focal point for cropping. |
| `heroCtas` | list (0–2) | | `{ label, href, style: primary\|secondary }` |
| `sections` | ordered list (2–6) | ✔ | Discriminated union over the section types above |
| `section.type` | enum | ✔ | One of the six. Enforce in the CMS. |
| `section.heading` | string | ✔ | Each section needs an `<h2>` — it's the page's outline |
| `section.background` | enum | | `default` \| `subtle` \| `inverse` |
| `closingCta` | object (0–1) | | `{ heading, label, href }` |

Model `sections` as a repeating discriminated union, not a free rich-text field. The constraint is the feature: it's what keeps landing pages consistent without policing them.

## Accessibility

- Every section needs a heading, referenced by `aria-labelledby` on the `<section>`. Screen-reader users navigate by that outline.
- Heading order: hero `<h1>` → each section `<h2>` → within-section `<h3>`. Never skip.
- Stats: the number and its label must be one accessible unit — don't leave a `48` floating with no context.
- `ctaBand` on `surface.inverse` must use `text.inverse`; check both modes.
- Decorative hero images: `alt=""` and `aria-hidden="true"`, never a filename as alt text.

## Reference markup — Bootstrap 5

```html
<main id="main">
  <section class="ucsd-section bg-body-tertiary" aria-labelledby="hero-h">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-12 col-lg-6">
          <h1 id="hero-h" class="display-4">Graduate Division</h1>
          <p class="lead">Programs, funding and support for 8,000 graduate students.</p>
          <a class="btn btn-primary btn-lg" href="/apply">Apply</a>
          <a class="btn btn-outline-secondary btn-lg" href="/programs">Browse programs</a>
        </div>
        <div class="col-12 col-lg-6">
          <img class="img-fluid rounded" src="/hero.jpg" alt="">
        </div>
      </div>
    </div>
  </section>

  <section class="ucsd-section" aria-labelledby="explore-h">
    <div class="container">
      <h2 id="explore-h">Explore</h2>
      <div class="row g-4 mt-2">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <h3 class="card-title h5"><a href="/funding">Funding</a></h3>
              <p class="card-text">Fellowships, assistantships and travel grants.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="ucsd-section bg-dark text-white" aria-labelledby="cta-h">
    <div class="container text-center">
      <h2 id="cta-h">Ready to apply?</h2>
      <a class="btn btn-primary btn-lg mt-3" href="/apply">Start your application</a>
    </div>
  </section>
</main>
```

## Do / Don't

| Do | Don't |
|---|---|
| Keep to 2–6 sections | Build a 12-section page nobody scrolls |
| One `<h2>` per section | Use styled `<div>`s as headings |
| Alternate section backgrounds | Separate sections with `<hr>` |
| Two CTAs maximum in the hero | Offer five equally-weighted choices |
| Let hero height follow content | Set `100vh` and hide the scroll affordance |
| Link onward to real content | Duplicate the content page's text here |
