## Typography

Two faces, carried forward from the previous system.

- **`font.family.sans`** (Roboto) is the working face. All body copy, all UI, all labels, nearly all headings. Neutral, high legibility at small sizes, unremarkable in the way a working face should be.
- **`font.family.display`** (Teko) is condensed and tall-and-narrow. **Headings and hero type only — never body copy, never UI labels, never anything set at a reading size.** Its whole value is scale contrast; used small it is simply hard to read.
- **`font.family.mono`** for code, identifiers, and technical metadata.

### The ramp

The type ramp is named by **scale**, not by HTML tag: steps run from the smallest through the largest, and an `<h1>` is not automatically the largest step on the page. A section heading on a dense listing page may sit mid-ramp; a landing page hero may sit at the top. Choose the step by the visual weight the content needs, then use the correct heading *element* for the document outline independently.

Every step carries its size **and** its line height as one token. They cannot be mismatched, and you should never set a line height by hand.

**Trust modest steps.** The ramp is close-spaced by design. A section heading roughly half again the size of body text is doing enough work; the pull toward a hero heading several times body size is a marketing-site reflex that reads as loud here.

**Weight does the rest.** `font.weight.*` runs regular through bold. Use at most two weights in a single view — typically regular for body and semibold for headings. Bold is an emphasis tool, not a heading default.

### Reading

Long-form content is constrained to `container.prose`, a measure chosen for readability rather than to fill the viewport. Content pages, article bodies and any sustained prose use it. Resist widening it to balance a layout; a full-width paragraph is harder to read at every viewport size.
