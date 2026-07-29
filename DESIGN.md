---
# GENERATED BLOCK — do not edit.
# Values come from Figma via tokens/ and packages/tokens/dist/tokens.json.
# Edit the prose in docs/design-md/, then run `npm run build`.
version: alpha
name: UC San Diego
description: "Design system for UC San Diego. Bootstrap 5 and Tailwind/shadcn are both first-class targets; they share tokens, not markup."
colors:
  # Semantic roles only. Primitives are withheld deliberately — components must
  # never bind to a raw palette value. Dark mode is a re-alias of these same
  # tokens; see `modes` at the end of this block.
  primary: "{colors.theme-primary}"
  component-bg-progress-bar: "#d4d5d5"
  component-btn-label-primary: "#182b49"
  component-btn-label-secondary: "#ffffff"
  component-btn-label-tertiary: "#ffffff"
  component-btn-primary: "#ffcd00"
  component-btn-secondary: "#00629b"
  component-btn-tertiary: "#182b49"
  component-icon: "#182b49"
  component-link: "#00629b"
  component-menu: "#747678"
  component-menu-bottom-nav: "#6a6b6d"
  foreground-body-text: "#6a6b6d"
  foreground-body-text-focus: "#182b49"
  foreground-card-border: "rgba(255, 255, 255, 0)"
  foreground-divider: "#647185"
  foreground-eyebrow: "#182b49"
  foreground-heading-1: "#182b49"
  foreground-heading-2: "#182b49"
  foreground-heading-3: "#182b49"
  foreground-heading-light: "#ffffff"
  foreground-subcard-border: "#182b49"
  foreground-subheading: "#182b49"
  foreground-surface-text-bg: "#f3f4f6"
  status-critical: "#bd1900"
  status-good: "#109b00"
  status-warning: "#fc8900"
  surface-1: "#ffffff"
  surface-2: "#fbf9f5"
  surface-background: "#182b49"
  system-bg-error: "#f8e8e6"
  system-bg-information: "#e6eff5"
  system-bg-success: "#e7f5e6"
  system-bg-warning: "#fff3e6"
  system-error: "#bd1900"
  system-foreground-error: "#ac1700"
  system-foreground-information: "#00629b"
  system-foreground-success: "#0b6e00"
  system-foreground-warning: "#975200"
  system-information: "#00629b"
  system-success: "#109b00"
  system-success-small-text: "#0a8902"
  system-warning: "#fc8900"
  theme-accent: "#ffcd00"
  theme-primary: "#182b49"
  theme-secondary: "#00629b"
typography:
  "body":
    fontFamily: "Brix Sans"
  "body-large":
    fontSize: "24px"
    lineHeight: "29px"
    letterSpacing: "0px"
  "body-medium":
    fontSize: "18px"
    lineHeight: "23px"
    letterSpacing: "0px"
  "body-small":
    fontSize: "12px"
    lineHeight: "17px"
    letterSpacing: "0px"
  "button":
    fontFamily: "Brix Sans"
    fontSize: "14px"
    lineHeight: "17px"
    fontWeight: 700
    letterSpacing: "0px"
  "eyebrow":
    fontFamily: "Refrigerator Deluxe"
    fontSize: "8px"
    lineHeight: "10px"
    fontWeight: 800
    letterSpacing: "0.800000011920929px"
  "h1":
    fontFamily: "Refrigerator Deluxe"
    fontSize: "24px"
    lineHeight: "29px"
    fontWeight: 800
    letterSpacing: "-0.20000000298023224px"
  "h2":
    fontFamily: "Brix Sans"
    fontSize: "18px"
    lineHeight: "22px"
    fontWeight: 500
    letterSpacing: "0px"
  "h2-small":
    fontFamily: "Brix Sans"
    fontSize: "12px"
    lineHeight: "18px"
    fontWeight: 700
    letterSpacing: "0px"
  "h3":
    fontFamily: "Refrigerator Deluxe"
    fontSize: "14px"
    lineHeight: "17px"
    fontWeight: 800
    letterSpacing: "0.800000011920929px"
  "subheading":
    fontFamily: "Brix Sans"
    fontSize: "12px"
    lineHeight: "15px"
    fontWeight: 700
    letterSpacing: "1.75px"
spacing:
  "2x-large": "32px"
  "3x-large": "40px"
  "4x-large": "48px"
  extra-large: "24px"
  extra-small: "4px"
  large: "16px"
  medium: "12px"
  small: "8px"
rounded:
  default: "12px"
  none: "0px"
  sm: "4px"
  lg: "16px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.component-btn-primary}"
    textColor: "{colors.component-btn-label-primary}"
    rounded: "{rounded.default}"
    typography: "{typography.button}"
  button-secondary:
    backgroundColor: "{colors.component-btn-secondary}"
    textColor: "{colors.component-btn-label-secondary}"
    rounded: "{rounded.default}"
    typography: "{typography.button}"
  button-tertiary:
    backgroundColor: "{colors.component-btn-tertiary}"
    textColor: "{colors.component-btn-label-tertiary}"
    rounded: "{rounded.default}"
    typography: "{typography.button}"
breakpoints:
  sm: "576px"
  md: "768px"
  lg: "992px"
  xl: "1200px"
  xxl: "1400px"
containers:
  prose: "70ch"
  narrow: "768px"
  base: "1140px"
  wide: "1320px"
elevation:
  "0": "none"
  "1": "0 1px 2px 0 rgba(24, 43, 73, 0.08)"
  "2": "0 2px 6px 0 rgba(24, 43, 73, 0.10)"
  "3": "0 6px 16px 0 rgba(24, 43, 73, 0.12)"
  "4": "0 12px 32px 0 rgba(24, 43, 73, 0.16)"
motion:
  duration:
    fast: "120ms"
    base: "200ms"
    slow: "320ms"
  easing:
    standard: "cubic-bezier(0.2, 0, 0, 1)"
    enter: "cubic-bezier(0, 0, 0, 1)"
    exit: "cubic-bezier(0.3, 0, 1, 1)"
modes:
  dark:
    colors:
      component-bg-progress-bar: "#d4d5d5"
      component-btn-label-primary: "#182b49"
      component-btn-label-secondary: "#162742"
      component-btn-label-tertiary: "#ffffff"
      component-btn-primary: "#ffcd00"
      component-btn-secondary: "#5496bc"
      component-btn-tertiary: "#5496bc"
      component-icon: "#f5f0e6"
      component-link: "#5496bc"
      component-menu: "#747678"
      component-menu-bottom-nav: "#909193"
      foreground-body-text: "#a1a2a4"
      foreground-body-text-focus: "#f5f0e6"
      foreground-card-border: "#747678"
      foreground-divider: "#959dab"
      foreground-eyebrow: "#f5f0e6"
      foreground-heading-1: "#f5f0e6"
      foreground-heading-2: "#f5f0e6"
      foreground-heading-3: "#f5f0e6"
      foreground-heading-light: "#f5f0e6"
      foreground-subcard-border: "#747678"
      foreground-subheading: "#f5f0e6"
      foreground-surface-text-bg: "#ffffff"
      status-critical: "#bd1900"
      status-good: "#109b00"
      status-warning: "#fc8900"
      surface-1: "#1d1d1d"
      surface-2: "#404142"
      surface-background: "#182b49"
      system-bg-error: "#ac1700"
      system-bg-information: "#5496bc"
      system-bg-success: "#0b6e00"
      system-bg-warning: "#975200"
      system-error: "#d77566"
      system-foreground-error: "#f8e8e6"
      system-foreground-information: "#e6eff5"
      system-foreground-success: "#e7f5e6"
      system-foreground-warning: "#fff3e6"
      system-information: "#5496bc"
      system-success: "#40af33"
      system-success-small-text: "#40af33"
      system-warning: "#fc8900"
      theme-accent: "#ffcd00"
      theme-primary: "#182b49"
      theme-secondary: "#00629b"
---

<!--
  DESIGN.md — the file to hand any coding agent building for UC San Diego.

  The YAML above is GENERATED from the design tokens; the prose below is written by
  hand in docs/design-md/. Regenerate with `npm run build`. CI fails if this file is
  stale, and if prose ever restates a token value.

  Full token reference (light + dark, with CSS/Sass/Tailwind syntax):
    skills/ucsd-design-system/references/generated/tokens.md
-->

# UC San Diego Design System

## Overview

<!-- REVIEW: brand voice. This section is an engineering draft and needs sign-off from
     the UX designer and against brand.ucsd.edu before it drives production work.
     Everything else in DESIGN.md is derived from tokens; this is the one section that
     is a judgment call, and it is the section that most determines output quality. -->

The reference is **Geisel Library**: board-formed concrete and glass, cantilevered, structural, entirely unornamented. Nothing on that building is decoration. The form is the structure, the structure is legible from a distance, and it has read as confidently itself for fifty years without being restyled.

That is the register for UC San Diego on the web. Institutional confidence without corporate gloss. Structure you can see. No ornament that isn't doing work.

**Who is reading.** Prospective students deciding where to spend four years, current students trying to complete a task, faculty and researchers, staff, and the public. Most of them arrived from a search result with a specific question. Very few of them are browsing.

**What that implies.** Pages are read, not skimmed for conversion. Content leads; chrome recedes. Generous vertical rhythm and a real reading measure matter more than density. A page that ends two-thirds of the way down the viewport is finished, not underfilled.

**The emotional target** is *credible and unhurried*. A public research university has nothing to prove and nothing to sell in the way a product landing page does. Confidence here reads as restraint: one clear action per screen, plain language, no urgency devices.

**What this is not.** Not a startup landing page — no gradient meshes, no glassmorphism, no floating testimonial cards, no animated counters. Not a consumer app — no playful illustration, no mascot voice, no rounded-everything friendliness. Not a brochure — the marks of print (full-bleed hero photography carrying no information, decorative rules, drop caps) don't transfer.

The single most common failure mode is a generated page that is technically on-palette and tonally wrong: UCSD blue applied to a SaaS marketing layout. When a choice isn't covered by a token or a rule below, resolve it toward the building — structural, plain, and durable.

## Colors

The palette is navy and blue carried forward from the university's identity, with gold as the single high-energy accent and a warm neutral ramp underneath. It is a restrained palette on purpose: the interest in a UCSD page should come from structure and typography, not from color.

Colors are organised by **role, not by hue**. Bind to what a color is *for*, never to what it looks like.

- **`color.theme.*`** — the brand marks themselves: primary, secondary, accent. Reserved for identity. If you are reaching for one to style a button, you want `color.component.*`.
- **`color.surface.*`** — what sits behind content. `surface.background` is the outer chrome band, `surface.1` is the content surface, `surface.2` is raised.
- **`color.foreground.*`** — text, rules and borders: the heading roles, body text, dividers and card borders. Reach down the ramp for de-emphasis; never fake it with a lower-contrast surface.
- **`color.component.*`** — what a control is actually made of. Each button fill has a matching label token, and the two are designed to be used as a pair.
- **`color.system.*`** — feedback messaging: success, warning, error, information. Each has a `bg-` and a `foreground-` half, again meant as a pair. These carry meaning; using error as an accent because it looks good is a bug.
- **`color.status.*`** — standalone state marks: good, warning, critical.

**Gold is an accent, not a surface.** It carries the least text-legible contrast in the palette and reads as emphasis precisely because it is scarce. Large gold fields cheapen it and usually fail contrast. It earns its place on a focus ring against dark surfaces, and in small marks of emphasis.

### Dark mode

Dark mode is **a re-alias of these same semantic tokens**, not a second palette and not a set of new tokens. Every semantic color has a value in both modes, and CI fails if one is missing.

The practical consequence for anyone writing code: use semantic tokens and dark mode is already correct. Do not write `dark:` color overrides, do not branch on theme in component code, and do not introduce a parallel dark color. If something looks wrong in dark mode, the fix belongs in the token's dark alias, not in the component.

Two roles are deliberately *not* symmetrical between modes — links and primary actions both lighten in dark mode, because the light-mode values fail contrast against dark surfaces. That asymmetry is intentional and is enforced by the contrast gate rather than left to judgment.

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

## Elevation & Depth

Depth is **structural, not atmospheric**. Hierarchy comes from surface change and space first, from borders second, and from shadow last.

`elevation.*` is a short ladder from flat to a high float, tuned as a navy-tinted shadow rather than neutral gray so it sits in the palette instead of muddying it. The ladder is short deliberately — a system with many elevation steps ends up using them decoratively.

Use the ladder for things that genuinely float above the page and can be dismissed: menus, popovers, dialogs, toasts. The rule of thumb is that if it can't be dismissed, it probably isn't elevated.

**Cards are not elevated by default.** A card is a surface change and a padding contract. Reach for `color.surface.raised` and let space do the grouping. A page of drop-shadowed cards is the single most common way generated UI drifts off-brand — it reads as a SaaS dashboard, and it flattens the actual hierarchy by giving every region the same visual weight.

In dark mode, shadow carries much less information because there is less luminance range beneath it. Depth there comes primarily from the surface ramp — raised surfaces genuinely lighten. Don't compensate by deepening shadows.

No glassmorphism, no backdrop blur, no glow, no inner shadow, no gradient used to imply depth. The reference building has real shadows because it has real mass; nothing here should simulate depth it doesn't structurally have.

## Shapes

The shape language is **squared-off**. `radius.*` runs from none through a small set of steps, plus a pill and a circle. The working steps sit at the tight end of that range: enough softening to look intentional on a screen, not enough to read as friendly.

Buttons, inputs, cards and containers share the same modest radius. Consistency here is most of the effect — mixing radii within a view is more noticeable than the specific value chosen.

The pill radius is reserved for genuinely pill-shaped objects: tags, chips, status badges. A pill-shaped primary button is a consumer-app signal and reads wrong in this system. The circle radius is for avatars and icon buttons.

Corners are the *only* softening in the system. There are no decorative shapes: no blob backgrounds, no angled section dividers, no rounded-corner overlays on photography, no abstract glyphs in the margins.

Borders are hairlines. A border's job is to separate, not to draw attention — when a border becomes visible as a design element, the separation should probably have been done with space or a surface change instead.

Photography is rectangular and full-bleed within its region. It is not rounded, not masked to a shape, and not overlaid with a gradient scrim unless text genuinely sits on it and needs the contrast.

## Components

Component *implementations* are not shared across frameworks and are not described here — a `.btn` in Bootstrap 5 and a `<Button>` in the shadcn registry can never share code. What they share is the token binding below and the behaviour contract in the skill's accessibility reference.

Write idiomatic code for whichever stack you are in. Correctness comes from binding to the right tokens, not from matching markup.

### Buttons

One primary action per screen. `button-primary` is the affirmative action; `button-secondary` carries everything else; a third, quieter treatment handles tertiary actions. A screen with three primary buttons has no primary button.

Every button fill has a matching label token — `color.component.btn-primary` with `color.component.btn-label-primary`, and the same for secondary and tertiary. Use them as a pair; mixing a fill from one variant with a label from another is how contrast failures happen.

Every interactive control has a visible hover state, a visible focus ring drawn from `color.theme.secondary`, and a disabled state that is legibly disabled rather than merely faded. Interactive controls meet the WCAG target-size minimum — never reduce it to fit a layout.

Label buttons with the verb for what happens: "Apply now", "Download the form". Never "Click here", never "Learn more" as the only label on a page with several of them.

### Forms

Every input has a visible, persistent label. Placeholder text is not a label — it disappears exactly when the user needs it, and it fails contrast at the sizes it is typically used.

Errors appear next to the field they concern, in text, using the `color.system.bg-error` and `color.system.foreground-error` pair. Color alone never carries the message: a red border with no text is invisible to a screen reader and to a red-green colorblind user. Validate on blur and on submit, not on every keystroke.

Help text sits below the field, in a muted text token, and stays visible.

### Navigation

Navigation is a landmark, uses real links, and marks the current page programmatically as well as visually. Dropdowns are keyboard-operable and close on `Escape`.

### Status and feedback

Status colors always appear as a `-subtle` background with its matching `-strong` foreground. Alerts carry an icon *and* text, never color alone. Toasts are for transient confirmations; anything the user must act on belongs on the page.

### Adding a component

The semantic layer is a curated, closed set. A new component binds to existing semantic tokens; it does not get its own token block by reflex. Component tokens exist only where a component genuinely needs a knob the semantic layer should not carry — and they alias semantics, never primitives, so they inherit dark mode for free.

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
