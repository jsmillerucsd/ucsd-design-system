## Do's and Don'ts

These are not style preferences. Each one, violated, breaks dark mode, rebranding, or accessibility.

- **Don't** write a raw hex color, or a raw pixel value for spacing or radius. Use a semantic token — `var(--ucsd-*)` in CSS, `$ucsd-*` in Sass, or the mapped Tailwind utility. If no token covers what you need, say so rather than inventing a value.
- **Don't** reference a primitive (`palette.*`) from a component. Primitives are the paint box; components bind to semantic tokens. A primitive reference hard-codes a brand decision and breaks dark mode.
- **Don't** hand-write dark-mode color overrides. Dark mode is a re-alias of the same semantic tokens and is already correct if you used them. No `dark:` color variants, no theme branching in component code, no second palette.
- **Don't** invent a breakpoint. The `breakpoint.*` scale matches Bootstrap 5 exactly so that Bootstrap utilities and Tailwind variants agree; a custom media query silently desynchronises them.
- **Don't** use Bootstrap 3 classes — they are errors, not legacy style. `panel*` is now `card`, `btn-default` is `btn-secondary`, `col-xs-*` is `col-*`, `img-responsive` is `img-fluid`, and `glyphicon` is Bootstrap Icons.
- **Don't** remove a focus indicator. `outline: none` without an equally visible replacement is an accessibility defect, not a design choice.
- **Don't** carry meaning in color alone. Every status, error and state needs text or an icon alongside it.
- **Don't** put a drop shadow on a card. Cards are a surface change and a padding contract; shadow is for things that float and can be dismissed.
- **Don't** use the display face below heading sizes, and don't use the pill radius on a primary button. Both read as consumer-app signals.
- **Do** use one `<h1>` per page, a skip link, and real landmark elements.
- **Do** give every input a visible persistent label. A placeholder is not a label.
- **Do** keep one primary action per screen.
- **Do** meet the target-size floor on interactive controls, even when it costs you the layout you wanted.
- **Do** prefer space and surface change over borders, and borders over shadows, when separating regions.
- **Do** trust the modest end of the type ramp. The pull toward a much larger heading is a marketing-site reflex.
- **Do** let pages end. Vertical white space is correct, not underfilled.
