## Colors

The palette is navy and blue carried forward from the university's identity, with gold as the single high-energy accent and a warm neutral ramp underneath. It is a restrained palette on purpose: the interest in a UCSD page should come from structure and typography, not from color.

Colors are organised by **role, not by hue**. Bind to what a color is *for*, never to what it looks like.

- **`color.surface.*`** — container backgrounds, from the page canvas through raised and sunken variants. `surface.default` is the page.
- **`color.text.*`** — foreground text, from `default` through `muted` and `subtle`, plus the link pair. Reach down the ramp for de-emphasis; never reach for a lower-contrast surface color to fake it.
- **`color.border.*`** — strokes and dividers. `border.focus` is reserved for the focus ring and must never be repurposed as a decorative stroke.
- **`color.action.*`** — interactive fills and their hover/active states. This is what a button is.
- **`color.status.*`** — feedback only: info, success, warning, danger. Each has a `-subtle` background and a `-strong` foreground, designed to be used as a pair. Status colors carry meaning; using danger as an accent because it looks good is a bug.
- **`color.brand.*`** — deliberately tiny, and reserved for immovable brand marks: logo, wordmark, seal. If you are reaching for a brand token to style a button, you want `color.action.primary`.

**Gold is an accent, not a surface.** It carries the least text-legible contrast in the palette and reads as emphasis precisely because it is scarce. Large gold fields cheapen it and usually fail contrast. It earns its place on a focus ring against dark surfaces, and in small marks of emphasis.

### Dark mode

Dark mode is **a re-alias of these same semantic tokens**, not a second palette and not a set of new tokens. Every semantic color has a value in both modes, and CI fails if one is missing.

The practical consequence for anyone writing code: use semantic tokens and dark mode is already correct. Do not write `dark:` color overrides, do not branch on theme in component code, and do not introduce a parallel dark color. If something looks wrong in dark mode, the fix belongs in the token's dark alias, not in the component.

Two roles are deliberately *not* symmetrical between modes — links and primary actions both lighten in dark mode, because the light-mode values fail contrast against dark surfaces. That asymmetry is intentional and is enforced by the contrast gate rather than left to judgment.
