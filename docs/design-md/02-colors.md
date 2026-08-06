## Colors

The palette is navy and blue carried forward from the university's identity, with gold as the single high-energy accent and a warm neutral ramp underneath. It is a restrained palette on purpose: the interest in a UCSD page should come from structure and typography, not from color.

Colors are organised by **role, not by hue**. Bind to what a color is *for*, never to what it looks like.

- **`color.theme.*`** — the brand marks themselves: primary, secondary, accent. Reserved for identity. If you are reaching for one to style a button, you want `color.component.*`.
- **`color.surface.*`** — what sits behind content, numbered `surface.1` through `surface.5`. `surface.1` is the content surface, `surface.2` is raised, and the darker steps are the chrome bands a page header or footer sits on.
- **`color.foreground.*`** — text, rules and borders: the heading roles, body text, dividers and card borders. Reach down the ramp for de-emphasis; never fake it with a lower-contrast surface.
- **`color.component.*`** — what a control is actually made of. Each button fill has a matching label token, and the two are designed to be used as a pair.
- **`color.system.*`** — feedback messaging: success, warning, error, information. Each has a `bg-` and a `foreground-` half, again meant as a pair. These carry meaning; using error as an accent because it looks good is a bug.
- **`color.status.*`** — standalone state marks: good, warning, critical.

**Gold is an accent, not a surface.** It carries the least text-legible contrast in the palette and reads as emphasis precisely because it is scarce. Large gold fields cheapen it and usually fail contrast. It earns its place on a focus ring against dark surfaces, and in small marks of emphasis.

### Dark mode

Dark mode is **a re-alias of these same semantic tokens**, not a second palette and not a set of new tokens. Every semantic color has a value in both modes, and CI fails if one is missing.

The practical consequence for anyone writing code: use semantic tokens and dark mode is already correct. Do not write `dark:` color overrides, do not branch on theme in component code, and do not introduce a parallel dark color. If something looks wrong in dark mode, the fix belongs in the token's dark alias, not in the component.

Two roles are deliberately *not* symmetrical between modes — links and primary actions both lighten in dark mode, because the light-mode values fail contrast against dark surfaces. That asymmetry is intentional and is enforced by the contrast gate rather than left to judgment.
