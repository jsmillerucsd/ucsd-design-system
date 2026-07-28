# Layout: Bare Page

Shared chrome, empty `<main>`. The escape hatch.

**Use for:** applications and dashboards, multi-step forms, embedded tools, anything whose interior is genuinely bespoke.
**Don't use for:** content that would fit an existing pattern. Reaching for this because a pattern is "almost right" is how a design system stops meaning anything — fix the pattern instead, or say why it can't be fixed.

---

## What you get

- Skip link, masthead, site nav, footer — required and unmodified.
- `<main id="main">` with no interior structure.
- All tokens, all components, all utilities.

## What you still owe

The chrome is given; the rest is on you. Non-negotiable inside `<main>`:

1. Exactly one `<h1>`, and no skipped heading levels below it.
2. Visible focus on every interactive element.
3. Keyboard operability for everything reachable by mouse — including anything custom.
4. Tokens only. No raw hex, no raw px spacing. Run the validator.
5. Named landmarks if you add `<nav>` or `<aside>` regions.
6. A page `<title>` that says where the user is.

## Reference markup — Bootstrap 5

```html
<a class="ucsd-skip-link" href="#main">Skip to main content</a>

<header>
  <div class="ucsd-masthead">
    <div class="container">
      <a href="https://ucsd.edu"><img class="ucsd-masthead__wordmark" src="/wordmark.svg" alt="UC San Diego"></a>
    </div>
  </div>
  <nav class="navbar navbar-expand-lg" aria-label="Main">…</nav>
</header>

<main id="main">
  <h1 class="visually-hidden">Grant Application Portal</h1>
  <!-- bespoke interior -->
</main>

<footer class="ucsd-footer">
  <div class="container">…</div>
</footer>
```

`visually-hidden` on the `<h1>` is legitimate when the app's interface makes the context obvious visually — but the heading must exist.

## Before you use this

Ask: is the interior really bespoke, or does it just need a region the closest pattern doesn't have yet? If it's the latter, extend that pattern — the whole point of the layout set is that pages made by different teams still feel like one site.
