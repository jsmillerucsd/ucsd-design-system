<!-- COPY of docs/using/other.md — do not edit here. Edit the source and run `npm run build`. -->

# Building with anything else

Vue, Svelte, Angular, web components, HTML email, a CMS template, a canvas or chart library — anywhere the token layer is useful but Bootstrap and Tailwind aren't.

The through-line: **`@ucsd/tokens` ships plain CSS custom properties.** Nothing about them is framework-specific. For the rules and the full token list, read `DESIGN.md`.

## CSS custom properties — the universal path

```bash
npm install @ucsd/tokens
```

```js
import "@ucsd/tokens/css";
```

or, with no bundler, copy `tokens.css` from `node_modules/@ucsd/tokens/dist/css/` into your static assets.

Then use them anywhere CSS reaches:

```css
.promo {
  background: var(--ucsd-color-surface-2);
  color: var(--ucsd-color-foreground-body-text);
  padding: var(--ucsd-space-large);
  border-radius: var(--ucsd-radius-rounded-2);
  border: 1px solid var(--ucsd-color-foreground-card-border);
}
```

Naming is mechanical: token path `color.component.btn.primary` → `--ucsd-color-component-btn-primary`. Dark mode comes along for free — the stylesheet defines both modes, activated by `.dark`, `[data-theme="dark"]` or `[data-bs-theme="dark"]` on any ancestor.

### Fonts always need the fallback stack

Brix Sans and Refrigerator Deluxe are **licensed** faces. On any machine that doesn't have them — which is most, until the web licence is confirmed — a bare family name falls back to the browser's default *serif*. Always pair the family with its stack:

```css
body   { font-family: var(--ucsd-type-body-font-family), var(--ucsd-type-fallback-sans); }
h1, h3 { font-family: var(--ucsd-type-h1-font-family),   var(--ucsd-type-fallback-display); }
```

`fallback.display` leads with a condensed face, so headings set in Refrigerator Deluxe keep roughly their intended width. The Bootstrap and Tailwind targets compile these in automatically; only raw CSS has to write them.

Scoped styles work as-is. Vue SFC `<style scoped>`, Svelte `<style>`, and Shadow DOM all inherit custom properties from the host document, so a web component picks up UCSD theming without importing anything itself.

## JavaScript, for canvas and charts

Some things can't read CSS — canvas, WebGL, chart libraries that want a colour string, React Native.

```js
import tokens from "@ucsd/tokens";

tokens["color.component.btn.secondary"];  // "#00629b"
tokens["space.md-16"];                    // "16px"
```

Fully typed — `tokens.d.ts` ships with the package, so the key list autocompletes.

**Caveat: these are resolved light-mode values.** Unlike the CSS path they do not follow dark mode. If the thing you're styling needs to respond to the theme, read the computed custom property instead:

```js
const primary = getComputedStyle(document.documentElement)
  .getPropertyValue("--ucsd-color-theme-primary").trim();
```

## HTML email

Email clients are the one place custom properties don't work — Outlook and several webmail clients strip them.

Use `@ucsd/tokens/json` (or the JS export) at **build time** to inline literal values, rather than shipping `var()` and hoping:

```js
import tokens from "@ucsd/tokens";
const bg = tokens["color.surface.1"];  // inline this into the template
```

Email is also the one context where the no-literals rule bends — the literal has to be inlined somewhere. Generate it from the tokens; don't retype it.

## Sass, without Bootstrap

```scss
@use "@ucsd/tokens/scss" as tokens;

.promo { background: tokens.$ucsd-color-surface-2; }
```

These are compile-time literals, not `var()` references — which means **they do not follow dark mode**. Use the Sass export only when you genuinely need a value at compile time (a colour function, a map). For anything that renders, prefer the CSS custom properties.

## A CMS template

Start from a pattern in `docs/layouts/README.md` — it gives you the region map, the required landmarks, and the content-model fields. Then render it with whichever of the above fits your platform; most CMS templates end up on the Bootstrap CDN path, since there's usually no Node build step available.

## What to reach for

| You have | Use |
|---|---|
| Any framework with a stylesheet | `@ucsd/tokens/css` + `var(--ucsd-*)` |
| Canvas, charts, React Native | `@ucsd/tokens` JS export |
| Something theme-reactive in JS | `getComputedStyle` on the custom property |
| HTML email | JSON/JS export, inlined at build time |
| Sass without Bootstrap | `@ucsd/tokens/scss` — compile-time only, no dark mode |
| A CMS page template | A `layouts/` pattern + the CDN bundle |
