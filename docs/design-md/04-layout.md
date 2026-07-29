## Layout

One spacing scale, based on a four-unit step, used for margin, padding and gap alike. There is no separate inset/stack split — one scale referenced everywhere is what keeps two frameworks from drifting a pixel apart.

Spacing steps are t-shirt sized — `space.small` through `space.4x-large`. Bootstrap's numeric utilities map onto them, so `.p-4` and `space.large` are the same value reached two ways.

**Breakpoints are Bootstrap 5's**, matched exactly by `breakpoint.*`. This is not a preference — Bootstrap utilities and Tailwind variants both compile from these values, and a mismatch produces bugs that take days to find. Never invent a breakpoint, and never write a media query against a value that isn't in the scale.

Mobile-first. Layouts stack in source order at the narrow end and gain columns as space allows. If a design only works from the widest breakpoint down, it isn't finished.

### Containers

`container.*` carries the max content widths the layouts use: a readable prose measure, plus narrow, base and wide. Pick the container by what the region *contains* — sustained reading takes the prose measure regardless of how much horizontal room is available.

Full-bleed regions are for structural bands (a page header, a section with its own background), not for content. Text that runs the full width of a large display is a defect.

### Composition

Regions are separated by space and by surface change, in that order of preference. Reach for a border when space alone genuinely doesn't communicate the grouping, and for a shadow only when something actually floats above the page.

Vertical rhythm is generous. The system's density target is closer to a university publication than to a dashboard — when in doubt between two spacing steps, take the larger one.

Page anatomy — which regions exist, what a CMS author may place in each, how each degrades at the narrow end, and the required landmarks — is specified per pattern in `layouts/`, not here.
