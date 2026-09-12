## Typography

Two faces, both from the UCSD brand library.

- **Brix Sans** is the working face, carried by `type.body.*`, `type.h3` and `type.button`. All body copy, all UI, all labels. Neutral, high legibility at small sizes, unremarkable in the way a working face should be.
- **Refrigerator Deluxe** is the display face, carried by `type.h1`, `type.h2` and `type.eyebrow`. Condensed and tall. **Headings and hero type only — never body copy, never anything set at a reading size.** Its whole value is scale contrast; used small it is simply hard to read.

Both are licensed faces, not open webfonts. Confirm the web licence before shipping either.

Eyebrow text is always rendered in uppercase through the component style.
Do not rely on authors to manually capitalize eyebrow content.
Use the eyebrow role for short contextual labels that sit above a heading,
such as audience, category, section type, or content context.

### Font fallbacks

Because Brix Sans and Refrigerator Deluxe are licensed faces, generated and prototype implementations must include fallback font stacks for environments where the UC San Diego brand fonts are unavailable.

Use the following fallback order:

- **Refrigerator Deluxe** → **Teko** → a condensed sans-serif system fallback.
- **Brix Sans** → **Source Sans** → **Roboto** → a general sans-serif system fallback.

The fallback order is part of the typography contract. Do not substitute a different fallback simply because another font is available.

Use the same fallback stack anywhere a typography role uses the corresponding brand face so that headings, body text, buttons, labels and other UI remain consistent when the licensed font cannot load.

Recommended CSS stacks:

```css
font-family: "Refrigerator Deluxe", "Teko", "Arial Narrow", Arial, sans-serif;
font-family: "Brix Sans", "Source Sans", "Roboto", Arial, Helvetica, sans-serif;
```

Fallbacks should preserve the intended role of the primary face as closely as possible, but they do not redefine the typography tokens. The UC San Diego brand font remains the preferred face whenever it is available.

### The roles

Type is organised by **role**, not by an abstract scale: `type.h1`, `type.h2`, `type.h2-small`, `type.h3`, `type.subheading`, `type.eyebrow`, `type.button`, and `type.body` at small, medium and large.

The role names echo HTML tags, but the mapping is not automatic. Pick the role by the visual weight the content needs, then choose the heading *element* for the document outline independently — a section heading on a dense listing page may want `h3` styling under an `<h2>`.

Every role carries its size **and** its line height. They cannot be mismatched, and you should never set a line height by hand.

**Trust modest steps.** The ramp is close-spaced by design. A section heading roughly half again the size of body text is doing enough work; the pull toward a hero heading several times body size is a marketing-site reflex that reads as loud here.

**Weight does the rest.** Each role carries its own weight, running regular through heavy. Use at most two weights in a single view. Bold is an emphasis tool, not a heading default.

### Reading

Long-form content is constrained to `container.prose`, a measure chosen for readability rather than to fill the viewport. Content pages, article bodies and any sustained prose use it. Resist widening it to balance a layout; a full-width paragraph is harder to read at every viewport size.
