## Typography

Two faces, both from the UCSD brand library.

- **Brix Sans** is the working face, carried by `type.body.*`, `type.h2` and `type.button`. All body copy, all UI, all labels. Neutral, high legibility at small sizes, unremarkable in the way a working face should be.
- **Refrigerator Deluxe** is the display face, carried by `type.h1`, `type.h3` and `type.eyebrow`. Condensed and tall. **Headings and hero type only — never body copy, never anything set at a reading size.** Its whole value is scale contrast; used small it is simply hard to read.

Both are licensed faces, not open webfonts. Confirm the web licence before shipping either.

### The roles

Type is organised by **role**, not by an abstract scale: `type.h1`, `type.h2`, `type.h2-small`, `type.h3`, `type.subheading`, `type.eyebrow`, `type.button`, and `type.body` at small, medium and large.

The role names echo HTML tags, but the mapping is not automatic. Pick the role by the visual weight the content needs, then choose the heading *element* for the document outline independently — a section heading on a dense listing page may want `h3` styling under an `<h2>`.

Every role carries its size **and** its line height. They cannot be mismatched, and you should never set a line height by hand.

**Trust modest steps.** The ramp is close-spaced by design. A section heading roughly half again the size of body text is doing enough work; the pull toward a hero heading several times body size is a marketing-site reflex that reads as loud here.

**Weight does the rest.** Each role carries its own weight, running regular through heavy. Use at most two weights in a single view. Bold is an emphasis tool, not a heading default.

### Reading

Long-form content is constrained to `container.prose`, a measure chosen for readability rather than to fill the viewport. Content pages, article bodies and any sustained prose use it. Resist widening it to balance a layout; a full-width paragraph is harder to read at every viewport size.
