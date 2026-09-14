## Components

Component *implementations* are not shared across frameworks and are not described here — a `.btn` in Bootstrap 5 and a `<Button>` in a React app can never share code. What they share is the token binding below and the behaviour contract in the skill's accessibility reference.

Write idiomatic code for whichever stack you are in. Correctness comes from binding to the right tokens, not from matching markup.

### Buttons

One primary action per screen. `btn-primary` is the affirmative action; `btn-secondary` carries everything else.

Every button fill has a matching label token — `color.component.btn.primary` with `color.component.btn.label-primary`, and the same for secondary. Use them as a pair; mixing a fill from one variant with a label from another is how contrast failures happen.

Every interactive control has a visible hover state, a visible focus ring drawn from `color.theme.secondary`, and a disabled state that is legibly disabled rather than merely faded. Interactive controls meet the WCAG target-size minimum — never reduce it to fit a layout.

Label buttons with the verb for what happens: "Apply now", "Download the form". Never "Click here", never "Learn more" as the only label on a page with several of them.

Button labels are rendered in uppercase through the component style. Do not rely on authors to manually capitalize button text.

#### Secondary Button

Use for prominent standalone calls to action that should feel lighter than a filled button. Follow the font size, line height, font family, etc. guidelines from the typography section of this design.md document.

```html
<a class="btn-secondary" href="#">
  Click me
</a>
.btn-secondaryk {
  display: inline-block;

  color: #182b49;
  background: transparent;
  text-transform: uppercase;
  text-decoration: none;

  padding: 0 0 0;
  border: 0;
  border-bottom: 1px solid #00629b;

  cursor: pointer;

  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.btn-secondary:hover {
  color: #00629b;
}

.btn-secondary:focus-visible {
  outline: 3px solid #ffcd00;
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-secondary {
    transition: none;
  }
}
```

Use this treatment only for prominent calls to action. Do not use it for ordinary inline links, navigation items, or dense groups of actions.

### Forms

Every input has a visible, persistent label. Placeholder text is not a label — it disappears exactly when the user needs it, and it fails contrast at the sizes it is typically used.

Errors appear next to the field they concern, in text, using the `color.system.bg-error` and `color.system.foreground-error` pair. Color alone never carries the message: a red border with no text is invisible to a screen reader and to a red-green colorblind user. Validate on blur and on submit, not on every keystroke.

Help text sits below the field, in a muted text token, and stays visible.

### Navigation

Navigation is a landmark, uses real links, and marks the current page programmatically as well as visually. Dropdowns are keyboard-operable and close on `Escape`.

### Status and feedback

Status colors always appear as a `color.system.bg-*` background with its matching `color.system.foreground-*` half. Alerts carry an icon *and* text, never color alone. Toasts are for transient confirmations; anything the user must act on belongs on the page.

### Adding a component

The semantic layer is a curated, closed set. A new component binds to existing semantic tokens; it does not get its own token block by reflex. Component tokens exist only where a component genuinely needs a knob the semantic layer should not carry — and they alias semantics, never primitives, so they inherit dark mode for free.

## Tiles with Links

When generating a UC San Diego Tiles with Links module, use the established UC San Diego CMS module pattern. Do not substitute a generic card grid, feature grid, or custom tile implementation.

The Tiles with Links module does not use eyebrow text.

The introductory content begins with the module heading, followed by optional supporting copy. Do not add an eyebrow, kicker, label, or overline unless a documented module variant explicitly includes one.

The module must use Bootstrap 5 conventions together with the established UC San Diego module classes.

There is no minimum or maximum number of tiles.

### Module background and optional header content

The Tiles with Links module supports three approved module background treatments:

- White
- Sand
- Navy

Apply the selected background treatment to the constrained module panel inside
the page container. Do not apply the module background to the full viewport.

Do not use navy tiles on a navy module background — do not place a solid-color tile on a module background of the same color. Tile colors must remain visually distinct from the module background so that individual tiles read as separate interactive elements.

The module header may include:

- a headline that take up one or two lines
- a blurb
- a module-level button.

All three are optional, but a blurb should never appear without a headline.

The module must still render correctly when any or all of these elements are
omitted.

When present:

- the headline appears above the tile grid;
- the module-level button appears in the header area and uses an approved UC San Diego button treatment;
- the header content and tile grid share the same constrained module panel and horizontal alignment.

When omitted:

- do not insert placeholder content;
- do not add an eyebrow, kicker, overline, or substitute heading;
- do not reserve empty space for the missing element;
- allow the tile grid to move up naturally within the module.

For navy module backgrounds, use the appropriate inverse text and control
treatments so that headings, supporting text, links, and buttons maintain
required contrast.

#### Blurb

The blurb is optional supporting copy that appears directly beneath the module
headline and above the tile grid.

Use it to briefly explain the purpose of the module or provide context for the
links that follow.

#### Visual contract

The Tiles with Links module is a constrained panel inside the page content
area. It is not a full-width color band.

The module must preserve the following visual relationships:

- The entire module is centered within the page's standard content container.
- The module background is applied to the constrained module panel, not to
  the full viewport width.
- The introductory row and the tile grid share the same left and right edges.
- The module includes substantial internal padding around both the introductory
  content and the tiles.
- The module heading and description appear on the left side of the introductory
  row.
- An optional module-level action appears on the right side of the same row.
- The tile grid appears below the introductory row.
- Standard desktop presentation is three equal-width tiles per row.
- Tile gutters are consistent across rows and columns.
- Tiles have the established rounded-corner treatment.
- Tile labels are centered horizontally and vertically within the tile.
- Image tiles use a navy readability overlay treatment of `rgba(24, 43, 73, .5)` to preserve text
  readability.
- Solid-color tiles use only approved UC San Diego tile background treatments.

Do not make the module background bleed from edge to edge across the viewport
unless a separate documented variant explicitly calls for that treatment.

#### Structure

The outer section identifies the module and provides semantic grouping.

The constrained module panel sits inside the Bootstrap container.

The canonical hierarchy is:

- `<section class="jumbotron-tile-links" data-module="tiles-with-links">`
- `.container`
- `.tile-module-*`
- introductory `.row`
- tile `.row.tiles-row`
- responsive tile columns
- `.wrapper`
- `.background-image`
- `<h3><a>...</a></h3>`

The selected module surface is expressed with the appropriate
`tile-module-*` class on the constrained module panel, not on the full-width
outer section.

The introductory row:

- uses Bootstrap `.row`;
- places heading and description in `.col-md-8.text-indent`;
- places an optional module-level action in `.col-md-4`;
- uses Bootstrap 5 alignment utilities such as `.text-md-end`.

The tile grid:

- appears in a separate `.row.tiles-row`;
- uses `.col-md-4` for the standard three-column desktop layout;
- gives every individual tile a `.wrapper`;
- uses `.background-image` for both image and solid-color tile backgrounds;
- places each tile label in an `<h3>` containing the destination link.

### Bootstrap 5 requirements

Use Bootstrap 5 markup and utilities.

Do not use Bootstrap 3 patterns that have been removed or superseded.

- Do not use `.jumbotron` as a Bootstrap component.
- Use `.text-md-end` or another appropriate Bootstrap 5 alignment utility
  instead of `.text-md-right` or `.text-lg-right`.
- Do not use `.btn-default`.
- Use an approved UC San Diego button treatment together with the appropriate
  Bootstrap 5 `.btn` classes.
- When an `<a>` performs navigation, style the `<a>` itself as the button.
  Do not place a `<button>` inside an `<a>`.
- Use the Bootstrap 5 grid for responsive tile layout rather than legacy
  float-based or Bootstrap 3 layout techniques.

### Canonical Bootstrap 5 example

```html
<section
  aria-labelledby="tiles-with-links-heading"
  class="jumbotron-tile-links"
  data-module="tiles-with-links"
>
  <div class="container">

    <div class="tile-module-sand">

      <div class="row align-items-start g-4">
        <div class="col-md-8 text-indent">
          <h2 id="tiles-with-links-heading">Tiles with Links</h2>
          <p>
            Features text over tiles that can use imagery or approved solid
            colors. Tiles are arranged in rows of three on larger viewports.
          </p>
        </div>

        <div class="col-md-4 text-md-end">
          <a
            class="btn btn-lg btn-primary"
            href="tiles-with-links/index.html"
          >
            More Tiles with Links Examples
          </a>
        </div>
      </div>

      <div class="row tiles-row g-4">

        <div class="col-md-4">
          <div class="wrapper">
            <img
              alt=""
              class="background-image"
              src="../_images/image-library/cta/cta-aerial-view-scripps-pier.jpg"
            >
            <h3>
              <a href="tiles-with-links/index.html">
                Text is required
              </a>
            </h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="wrapper">
            <img
              alt=""
              class="background-image"
              src="../_images/image-library/cta/cta-conference-room.jpg"
            >
            <h3>
              <a href="tiles-with-links/index.html">
                Filter applied over images
              </a>
            </h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="wrapper">
            <img
              alt=""
              class="background-image"
              src="../_images/image-library/cta/cta-geisel-looking-up.jpg"
            >
            <h3>
              <a href="tiles-with-links/index.html">
                For readability
              </a>
            </h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="wrapper tile-blue-bg">
            <div class="background-image"></div>
            <h3>
              <a href="tiles-with-links/index.html">
                Four tile color options
              </a>
            </h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="wrapper tile-blue-bg">
            <div class="background-image"></div>
            <h3>
              <a href="tiles-with-links/index.html">
                Also available
              </a>
            </h3>
          </div>
        </div>

        <div class="col-md-4">
          <div class="wrapper tile-blue-bg">
            <div class="background-image"></div>
            <h3>
              <a href="tiles-with-links/index.html">
                Three background colors
              </a>
            </h3>
          </div>
        </div>

      </div>

    </div>

  </div>
</section>
```

### Hover behavior

Tiles use the established UC San Diego scale interaction on hover.

The entire `.wrapper` scales, including its background, overlay, label, and
rounded corners. Do not animate only the background image.

Use the canonical interaction:

```css
.jumbotron-tile-links .wrapper {
  transition: transform .2s linear;
}

.jumbotron-tile-links .wrapper:hover {
  transform: scale(1.1);
}
```

The tile remains in its existing grid position while scaling visually above
its surrounding content.

Do not substitute a lift, shadow, background-only zoom, or another hover
effect for this interaction.


Also add keyboard-focus and reduced-motion handling **in the implementation**, even though those aren't present in the legacy CSS:

```css
.jumbotron-tile-links .wrapper:focus-within {
  transform: scale(1.1);
}

@media (prefers-reduced-motion: reduce) {
  .jumbotron-tile-links .wrapper {
    transition: none;
  }

  .jumbotron-tile-links .wrapper:hover,
  .jumbotron-tile-links .wrapper:focus-within {
    transform: none;
  }
}
```

## Hero

When generating a UC San Diego Hero module, use the established UC San Diego
CMS hero pattern. Do not substitute a generic marketing hero, split-screen
banner, card-based introduction, or custom slideshow.

The Hero module must use Bootstrap 5 conventions together with the established
UC San Diego module anatomy.

The hero is a full-width visual module. Its image or approved background may
extend across the viewport, while the hero's written content remains aligned
to the standard page container.

The hero may contain one or more slides.

The Hero module does not use eyebrow text unless a separately documented
variant explicitly includes it.

### Hero content

A hero slide may include:

- a headline;
- an optional deliberate headline break;
- a blurb;
- a module-level button.

The blurb and button are optional.

Hero headlines may occupy one or two lines.

The headline may be:

- left aligned; or
- center aligned.

Left-aligned headlines may use a deliberate headline break to divide the
headline into two phrases.

Do not add an eyebrow, kicker, overline, category label, or other text above
the hero headline unless a separately documented variant explicitly includes
one.

When optional content is omitted:

- do not insert placeholder content;
- do not reserve empty space for the missing element;
- allow the remaining content to retain its natural spacing.

### Headline

The hero headline is the primary display heading within the hero.

Use the established `type.h1` treatment.

Hero headlines use sentence case. Do not automatically transform hero
headlines to uppercase.

Hero headlines may occupy one or two lines.

A two-line headline may:

- wrap naturally; or
- use a deliberate semantic line break when the content calls for it.

Example:

```html
<h1>
  Hero Examples
  <br>
  <span>Left Headline with Break</span>
</h1>
```

The text after the break remains part of the same semantic heading.

Do not create a second heading merely to produce a second visual line.

Do not force a deliberate line break simply because a headline naturally
wraps.

### Blurb

The blurb is optional supporting copy that appears beneath the hero headline.

Use the normal body-text treatment appropriate to the hero's light or dark
text mode.

Do not enlarge hero blurbs into a special display-text size.

Use the established normal body role for supporting hero copy.

Keep hero blurbs concise enough that they do not dominate the visual area.

Do not:

- use the blurb as an eyebrow or kicker;
- repeat the headline in different words;
- use multiple long paragraphs;
- place the blurb above the headline.

### Button

A hero may contain an optional module-level button beneath the headline or
blurb.

Use an approved UC San Diego button treatment.

Button labels use the established button typography and uppercase treatment.

When an `<a>` performs navigation, style the `<a>` itself as the button.

Do not place a `<button>` inside an `<a>`.

Button hover behavior depends on the surface behind the button. Do not apply a
single hover color blindly to every hero variant.

### Visual contract

The Hero module must preserve the following visual relationships:

- The hero visual treatment extends across the full module width.
- Hero text remains constrained to the standard page container.
- Written content appears within the hero rather than in a separate panel
  underneath it.
- Hero content may be left aligned or center aligned.
- Headlines may occupy one or two lines.
- Headline, blurb, and button remain grouped as one content block.
- Text and controls must maintain sufficient contrast against the complete
  area behind them.
- The hero remains visually substantial enough to function as the primary
  introductory module.
- Previous and next controls appear at the lateral edges of a multi-slide
  hero.
- Previous and next controls remain visually outside the written-content
  region.
- Pagination and playback controls remain visually below the written-content
  region.
- Pagination indicators and play/pause appear together inside one unified
  bottom-center control capsule.
- Carousel controls must never overlap the headline, blurb, or button at any
  viewport size.

Do not constrain the hero image itself to a card-sized panel inside the page
container.

Do not convert the established hero into a two-column image-and-text layout
unless a separately documented variant explicitly uses that composition.

---

### Canonical hero variants

The UC San Diego Hero module has six canonical presentation variants.

Generated implementations should select from these established variants rather
than inventing new hero compositions.

The six canonical variants are:

1. Image with light text and optional headline break
2. Blue Orb grit background with light text
3. Yellow grit background with dark text
4. Navy grit background with light text
5. Image with text box
6. Image with gradient

These variants share the same Hero module anatomy.

They differ in background, text treatment, and optional style treatment.

Do not interpret them as unrelated hero components.

Do not invent a seventh visual treatment merely for variety.

#### Variant 1: Image with light text

Use an uploaded or approved hero image with light hero text.

The headline may be:

- left aligned; or
- center aligned.

A left-aligned headline may use a deliberate headline break.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

Example:

```html
<div class="carousel-item active">
  <div class="hero-media hero-image-light">

    <img
      src="hero-image.jpg"
      alt=""
    >

    <div class="container">
      <div class="hero-content">

        <h1 class="rt-text-light">
          Hero Examples
          <br>
          <span>Left Headline with Break</span>
        </h1>

        <p class="rt-text-light">
          Concise supporting copy.
        </p>

        <a
          class="btn btn-primary"
          href="#"
        >
          Primary action
        </a>

      </div>
    </div>

  </div>
</div>
```

If the image requires additional readability treatment, use a separately
documented canonical variant rather than inventing an arbitrary overlay.

#### Variant 2: Blue Orb grit background

Use the approved UC San Diego Blue Orb grit background.

Use light text.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

This is a pre-canned branded background, not an uploaded-image modification.

Do not replace the established Blue Orb grit asset with an arbitrary blue
gradient or custom abstract background.

#### Variant 3: Yellow grit background

Use the approved UC San Diego yellow grit background.

Use dark text.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

This is a pre-canned branded background.

Do not use a button color that visually matches the yellow module background.

#### Variant 4: Navy grit background

Use the approved UC San Diego navy grit background.

Use light text.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

This is a pre-canned branded background.

Do not use a navy button on the navy grit background.

#### Variant 5: Image with text box

Use this variant when an uploaded hero image needs a contained background
behind the written content for readability.

Place the headline, blurb, and button together inside one established hero
text box.

The text box may use any of the following approved treatments:

- Blue
- Navy
- Translucent Blue
- Translucent Navy

Approved values correspond to the current component color treatments:

- Blue: `#00629b`
- Navy: `#182b49`
- Translucent Blue: `rgba(0, 98, 155, 0.8)`
- Translucent Navy: `rgba(24, 43, 73, 0.8)`

The headline may occupy one or two lines.

A two-line headline may wrap naturally or use a deliberate semantic line break.

Keep the blurb concise so the box does not become excessively large.

Do not:

- create separate boxes around the headline, blurb, and button;
- use an unapproved box color;
- allow the box to become a large general-purpose content panel;
- combine the text-box treatment with the gradient treatment;
- force a single-line headline when two lines are appropriate.

Example classes may include:

```html
<div class="hero-text-box hero-text-box-blue">
```

```html
<div class="hero-text-box hero-text-box-navy">
```

```html
<div class="hero-text-box hero-text-box-blue-translucent">
```

```html
<div class="hero-text-box hero-text-box-navy-translucent">
```

#### Variant 6: Image with gradient

Use this variant when an uploaded hero image needs additional contrast beneath
the text while retaining an uninterrupted image treatment.

Apply the established gentle navy/blue gradient beneath the written content.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

Do not:

- replace the documented gradient with an arbitrary uniformly dark full-image
  overlay;
- make the gradient visually dominate the image;
- combine the gradient with the text-box treatment.

---

### Grit-background button colors

The approved button colors on grit-background hero variants are:

- Yellow
- Turquoise
- Orange
- Gold
- Navy

A button color may be used only when it remains visually distinct from the
module background.

Do not use a button whose color effectively matches the hero background.

For example:

- do not use yellow on the yellow grit background;
- do not use navy on the navy grit background.

Blue is not one of the approved grit-background button treatments.

#### Grit button hover behavior

Hover states must remain visually distinct from the grit background.

Do not choose a hover color that disappears into a similarly colored portion
of the grit treatment.

#### Blue Orb grit background

For yellow, orange, or gold buttons on the Blue Orb background:

- hover background: Turquoise
- hover text: Navy

For a turquoise button on the Blue Orb background:

- hover background: Yellow
- hover text: Navy

Do not use navy as the hover background on the Blue Orb treatment when it
visually disappears into the dark portion of the grit artwork.

#### Yellow grit background

Use an approved contrasting button color such as Navy.

The hover state must remain distinct from the yellow module background.

Do not transition the button to yellow.

#### Navy grit background

Do not use a navy button.

Approved button colors include:

- Yellow
- Turquoise
- Orange
- Gold

Hover colors must remain visually distinct from the navy module background.

---

### Text-box button hover behavior

Text-box button hover behavior depends on the box surface.

#### Blue and Translucent Blue text boxes

A yellow primary button on:

- Blue
- Translucent Blue

uses:

- normal background: Yellow
- normal text: Navy
- hover background: Navy
- hover text: White

Example:

```css
.hero-text-box-blue .btn-primary:hover,
.hero-text-box-blue .btn-primary:focus,
.hero-text-box-blue-translucent .btn-primary:hover,
.hero-text-box-blue-translucent .btn-primary:focus {
  background: #182b49;
  color: #fff;
}
```

#### Navy and Translucent Navy text boxes

A yellow primary button on:

- Navy
- Translucent Navy

must not hover to navy because the button would visually disappear into the
box.

Use:

- normal background: Yellow
- normal text: Navy
- hover background: Turquoise
- hover text: Navy

Example:

```css
.hero-text-box-navy .btn-primary:hover,
.hero-text-box-navy .btn-primary:focus,
.hero-text-box-navy-translucent .btn-primary:hover,
.hero-text-box-navy-translucent .btn-primary:focus {
  background: #00c6d7;
  color: #182b49;
}
```

The same principle applies to other navy-backed hero treatments.

Never create a hover state where the button background matches the surface
behind it.

---

### Headline alignment

Hero headlines support:

- left alignment;
- center alignment.

Hero headlines may occupy one or two lines.

Left-aligned headlines may use a deliberate semantic headline break.

Do not create multiple heading elements merely to produce multiple visual
lines.

---

### Optional hero fields

A slide may contain:

- headline + blurb + button;
- headline + blurb;
- headline + button;
- headline only;
- background imagery without written content.

Do not insert substitute text when a field is intentionally omitted.

Do not reserve empty space for omitted fields.

A button requires a valid destination.

---

### Hero image requirements

Uploaded hero images should use a consistent hero proportion.

The established CMS reference uses approximately:

```text
1440 × 530
```

When multiple slides use uploaded imagery, keep dimensions and proportions
consistent so the hero does not visibly change height between slides.

Choose imagery with the expected text location in mind.

Avoid:

- important faces directly underneath written content;
- text embedded within the image;
- visually busy areas directly behind written content;
- image regions that cause the chosen text treatment to fail contrast.

When the image is decorative and all meaningful information is present in the
visible hero text, use an empty image `alt` value.

---

### Content limits

The Hero establishes the page's primary message rather than serving as a large
content container.

Use rich imagery and concise supporting text.

Do not use oversized body text to make the hero appear more dramatic.

Use the established normal body treatment for the blurb.

Keep supporting copy short.

Use the hero button to direct users to detailed content.

For normal production pages, prefer a small number of slides.

Do not create a large carousel merely because the component technically
supports many slides.

---

### Structure

The hero media spans the full module width.

The written content remains constrained inside the standard page container.

The canonical multi-slide hierarchy is:

- `<section class="hero-homepage">`
- Bootstrap 5 `.carousel`
- `.carousel-inner`
- `.carousel-item`
- hero media or approved grit background
- `.container`
- hero content block
- headline
- optional blurb
- optional button
- previous control
- next control
- unified `.hero-carousel-controls`
  - `.carousel-indicators`
  - play/pause control

For a static one-slide hero, carousel navigation and pagination are omitted.

For a multi-slide hero, preserve the complete carousel control structure.

---

### Carousel control layout

Carousel controls must never overlap the written hero content.

The layout must reserve distinct spatial regions for:

1. previous-arrow control;
2. written hero content;
3. next-arrow control;
4. bottom pagination/playback controls.

Do not simply position controls over the content and assume there will be
enough space.

#### Side arrow gutters

Reserve dedicated transparent gutters at the left and right edges of the hero
for previous and next controls.

Written content must be inset far enough that neither the visible chevron nor
its interactive target can overlap:

- the headline;
- the blurb;
- the button.

This requirement applies at all viewport sizes.

On smaller screens, increase or preserve the content inset rather than moving
the arrows on top of the content.

Example:

```css
.hero-content > .container {
  padding-left: 96px;
  padding-right: 96px;
}
```

Responsive implementations may reduce these values when necessary, but the
content must remain completely outside the arrow target areas.

#### Bottom control safe area

Reserve enough bottom padding inside each hero slide for the unified
pagination/playback capsule.

The headline, blurb, and button must not extend behind or underneath the
bottom controls.

This requirement applies at desktop, tablet, and mobile sizes.

---

### Previous and next controls

Multi-slide heroes use the established UC San Diego previous and next
chevrons.

The visible arrows:

- appear near the left and right edges of the hero;
- are vertically centered;
- use a compact thick-chevron shape;
- use a light semi-transparent treatment;
- include a subtle dark shadow;
- have no visible circle;
- have no pill background;
- have no visible square or rectangular button surface.

Do not use Bootstrap's default carousel arrow artwork.

Use Bootstrap 5 for behavior, but provide the established UC San Diego
chevron treatment.

The visible arrow is intentionally smaller than its interactive target.

A suitable visual treatment is approximately:

```css
.hero-carousel-chevron {
  display: block;

  width: 18px;
  height: 18px;

  border-top: 6px solid rgba(255,255,255,.68);
  border-right: 6px solid rgba(255,255,255,.68);

  filter: drop-shadow(
    0 1px 1px rgba(24,43,73,.4)
  );
}

.hero-carousel-chevron-prev {
  transform: rotate(-135deg);
}

.hero-carousel-chevron-next {
  transform: rotate(45deg);
}
```

The button itself may use a substantially larger transparent hit target.

Example:

```css
.carousel-control-prev,
.carousel-control-next {
  width: 72px;
  min-width: 72px;

  border: 0;
  background: transparent;

  opacity: 1;
}
```

Do not enlarge the visible chevron merely to increase its click target.

---

### Pagination and playback control group

A multi-slide hero uses one unified bottom-center control group containing:

- pagination indicators;
- play/pause.

These controls must visually read as one interface element.

The group:

- is horizontally centered;
- appears near the bottom edge of the hero;
- uses a fully rounded capsule shape;
- uses a black background at 50% transparency;
- keeps pagination and play/pause vertically centered;
- uses compact internal spacing.

Use:

```css
background: rgba(0, 0, 0, .5);
```

Do not use an opaque navy capsule.

Do not place pagination and play/pause into separate floating containers.

Do not give play/pause its own additional circular or pill-shaped background.

---

## Pagination

Pagination uses circular indicators.

Each pagination control must have an interactive target of:

```text
14px × 14px
```

The visible circle remains smaller than the interactive target.

Use approximately:

```text
10px × 10px visible circle
```

with:

```text
1px white outline
```

for inactive indicators.

The active indicator uses a solid white fill.

There must be exactly:

```text
2px
```

between each 14×14 pagination target.

The 14×14 target must not be reduced merely to make the visible controls more
compact.

Use a pseudo-element or equivalent technique so the button remains 14×14
while the visual dot remains small.

Example:

```css
.hero-carousel-controls .carousel-indicators {
  position: static;

  display: flex;
  align-items: center;
  gap: 2px;

  margin: 0;
}

.hero-carousel-controls
.carousel-indicators
[data-bs-target] {
  position: relative;

  width: 14px;
  height: 14px;

  margin: 0;
  padding: 0;

  border: 0;
  background: transparent;

  opacity: 1;
}

.hero-carousel-controls
.carousel-indicators
[data-bs-target]::after {
  content: "";

  position: absolute;
  left: 50%;
  top: 50%;

  width: 10px;
  height: 10px;

  border: 1px solid #fff;
  border-radius: 50%;

  background: transparent;

  transform: translate(-50%, -50%);
}

.hero-carousel-controls
.carousel-indicators
.active::after {
  background: #fff;
}
```

Do not use Bootstrap's default rectangular carousel indicators.

---

### Play and pause

Automatically advancing hero carousels provide a persistent play/pause
control.

The control appears inside the same bottom-center capsule as pagination.

It appears after the pagination indicators.

It does not receive its own background container.

When the carousel is playing:

- show the pause symbol;
- the accessible name indicates that activation pauses the carousel.

When the carousel is paused:

- show the play symbol;
- the accessible name indicates that activation resumes the carousel.

Update both the visible state and accessible name.

Do not restart automatic rotation merely because a user manually changes
slides after explicitly pausing the carousel.

---

### Canonical control-group styling

A suitable implementation is:

```css
.hero-carousel-controls {
  position: absolute;
  left: 50%;
  bottom: 20px;
  z-index: 8;

  display: flex;
  align-items: center;
  gap: 7px;

  padding: 4px 8px;
  border-radius: 999px;

  background: rgba(0, 0, 0, .5);

  transform: translateX(-50%);
}

.hero-carousel-controls .carousel-indicators {
  position: static;

  display: flex;
  align-items: center;
  gap: 2px;

  margin: 0;
}

.hero-carousel-toggle {
  position: static;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 18px;
  min-height: 18px;

  padding: 0;

  border: 0;
  background: transparent;

  color: #fff;
}
```

---

### Bootstrap 5 requirements

Use Bootstrap 5 carousel markup and attributes.

Do not reproduce Bootstrap 3 carousel syntax.

Translate legacy behavior as follows:

- `.item` → `.carousel-item`
- `data-ride="carousel"` → `data-bs-ride="carousel"`
- `data-slide="prev"` → `data-bs-slide="prev"`
- `data-slide="next"` → `data-bs-slide="next"`
- `data-slide-to` → `data-bs-slide-to`
- `data-target` → `data-bs-target`

Use `<button>` elements for:

- previous;
- next;
- pagination;
- play/pause.

Use Bootstrap 5 for carousel mechanics.

Do not use Bootstrap's default visual treatment for:

- previous/next arrows;
- pagination indicators.

Preserve the documented UC San Diego appearance instead.

Do not add `tabindex="0"` to static headings or paragraphs merely to make them
keyboard focusable.

---

### Canonical Bootstrap 5 example

```html
<section
  class="hero-homepage"
  aria-label="Featured content"
>
  <div
    id="heroCarousel"
    class="carousel slide"
    data-bs-ride="carousel"
  >

    <div class="carousel-inner">

      <div class="carousel-item active">
        <div class="hero-media hero-image-light">

          <img
            src="hero-image.jpg"
            alt=""
          >

          <div class="hero-content">
            <div class="container">

              <div class="hero-copy rt-text-light">

                <h1>
                  Hero headline
                  <br>
                  <span>Optional second line</span>
                </h1>

                <p>
                  Concise supporting copy.
                </p>

                <a
                  class="btn btn-primary"
                  href="#"
                >
                  Primary action
                </a>

              </div>

            </div>
          </div>

        </div>
      </div>

    </div>

    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#heroCarousel"
      data-bs-slide="prev"
    >
      <span
        class="
          hero-carousel-chevron
          hero-carousel-chevron-prev
        "
        aria-hidden="true"
      ></span>

      <span class="visually-hidden">
        Previous slide
      </span>
    </button>

    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#heroCarousel"
      data-bs-slide="next"
    >
      <span
        class="
          hero-carousel-chevron
          hero-carousel-chevron-next
        "
        aria-hidden="true"
      ></span>

      <span class="visually-hidden">
        Next slide
      </span>
    </button>

    <div class="hero-carousel-controls">

      <div class="carousel-indicators">

        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>

        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>

      </div>

      <button
        class="hero-carousel-toggle"
        type="button"
        aria-label="Pause carousel"
        aria-pressed="false"
      >
        <span
          class="hero-carousel-pause"
          aria-hidden="true"
        >
          Ⅱ
        </span>

        <span
          class="hero-carousel-play"
          aria-hidden="true"
          hidden
        >
          ▶
        </span>
      </button>

    </div>

  </div>
</section>
```

---

### Motion

Carousel transitions should be restrained and must not compete with the hero
content.

Respect `prefers-reduced-motion`.

When reduced motion is requested:

- remove or minimize animated transitions;
- do not introduce zoom or parallax;
- preserve carousel navigation controls;
- preserve pagination;
- preserve play/pause functionality.

---

### Accessibility

The Hero module must remain operable using:

- keyboard;
- pointer;
- touch;
- assistive technology.

For multi-slide heroes:

- expose the carousel as a clearly named region;
- provide accessible names for previous and next controls;
- provide accessible names for pagination indicators;
- provide an accessible name for play/pause;
- indicate the active pagination item;
- preserve 14×14 pagination targets;
- ensure controls have visible focus states;
- keep static headings and blurbs out of the tab order;
- ensure automatic rotation can be paused;
- ensure written content and controls never overlap;
- ensure all text maintains required contrast throughout the complete
  background area behind it.

The visual grouping of pagination and playback controls does not merge their
individual accessible functions.

The page must retain a logical semantic heading hierarchy regardless of which
carousel slide is visible.

---

### Generation rules

When an established UC San Diego Hero module is requested or applicable,
reproduce its documented layout envelope, control anatomy, visual treatments,
and interaction behavior.

Do not merely imitate its general visual appearance.

When selecting a Hero presentation, choose one of the six documented
canonical variants:

- image with light text;
- Blue Orb grit background;
- yellow grit background;
- navy grit background;
- image with text box;
- image with gradient.

For text-box heroes, choose only:

- Blue;
- Navy;
- Translucent Blue;
- Translucent Navy.

For grit-background heroes, permitted button colors are:

- Yellow;
- Turquoise;
- Orange;
- Gold;
- Navy;

provided the button color does not match or visually disappear into the module
background.

For Hero modules specifically:

- preserve the full-width visual treatment;
- preserve the constrained written-content container;
- allow headlines to occupy one or two lines;
- keep headline, blurb, and button grouped;
- use normal body typography for blurbs;
- preserve left or center alignment when specified;
- preserve deliberate headline breaks when specified;
- preserve documented contrast treatments;
- reserve dedicated side gutters for previous and next controls;
- reserve dedicated bottom space for pagination and playback;
- never overlap carousel controls with written content;
- use compact custom UC San Diego chevrons;
- keep the visible arrow smaller than its interactive target;
- use the unified bottom-center pagination/playback capsule;
- use `rgba(0, 0, 0, .5)` for the capsule background;
- use 14×14 pagination click targets;
- use approximately 10×10 visible pagination circles;
- use a 1px white ring for inactive pagination indicators;
- use a solid white active pagination indicator;
- use exactly 2px between pagination targets;
- keep play/pause inside the same capsule;
- use Bootstrap 5 carousel behavior;
- preserve established UC San Diego button treatments;
- use surface-aware button hover colors.

Do not:

- substitute a generic split hero;
- convert the hero image into a rounded card;
- add an eyebrow or kicker without a documented variant;
- invent additional hero variants;
- use oversized blurb typography;
- omit carousel pagination from a multi-slide hero;
- reduce pagination click targets below the documented size;
- allow arrows to overlap written content;
- allow pagination/playback controls to overlap written content;
- render play/pause as a separately floating button;
- use Bootstrap's default rectangular pagination indicators;
- use Bootstrap's default previous/next icon artwork;
- place arrows inside visible circles, squares, or pills;
- use a button hover color that matches the surface behind it;
- use navy hover on a navy surface;
- use navy hover when it visually disappears into the Blue Orb grit
  background;
- use obsolete Bootstrap 3 carousel markup;
- invent new background treatments;
- make static hero text keyboard focusable;
- change the established hero anatomy merely for visual variety.

Do not:

- substitute a generic split hero;
- convert the hero image into a rounded card;
- add an eyebrow or kicker without a documented variant;
- omit carousel pagination from a multi-slide hero;
- separate the play/pause control from the pagination indicators;
- render the play/pause control as an independently floating button;
- use Bootstrap's default rectangular carousel indicators;
- use Bootstrap's default carousel arrow artwork;
- render previous or next arrows inside circles, pills, squares or other
  visible button containers;
- substitute a thin line icon for the established thick chevron;
- omit pause functionality from an automatically advancing carousel;
- use obsolete Bootstrap 3 carousel markup;
- invent new background treatments;
- apply multiple hero style modifications merely for visual effect;
- make static hero text keyboard focusable;
- change the hero anatomy merely for visual variety.

## Call to Action

Use the Call to Action module to pair a concise message with one clear action.

The module may combine text with an image, video, or approved UC San Diego grit background.

Do not create a generic card or two-column marketing component when the Call to Action pattern is appropriate.

The Call to Action module follows the established UC San Diego CMS pattern and should preserve its recognizable proportions, spacing, image treatment, typography, and button behavior.

### Purpose

A Call to Action should focus on one idea and one primary next step.

Typical uses include:

- introducing a program;
- directing visitors to an important resource;
- promoting a service;
- highlighting an opportunity;
- encouraging contact or participation;
- pairing explanatory text with a relevant image or video.

Do not use a Call to Action as a substitute for:

- a general-purpose content grid;
- a list of unrelated links;
- a navigation menu;
- a news listing;
- a multi-action promotional card.

If several equal actions must be presented together, consider another module such as Tiles with Links.

### Call to Action content

A standard Call to Action may contain:

- image, video, or approved grit background;
- headline;
- supporting copy;
- one CTA button.

The image or video may be positioned beside the written content depending on the selected variant.

The button is optional when the content does not require an explicit next step, but most Call to Action implementations should contain one clear action.

Do not add multiple competing CTA buttons to a single module.

### Headline

Use the heading level appropriate to the page hierarchy.

For a typical standalone Call to Action within a page, use an `h2`.

Use the `type.h2` typography role.

The headline:

- should normally fit within approximately 25 characters per line;
- should not exceed approximately two lines;
- should be sentence case;
- should describe the purpose of the action clearly.

Do not uppercase the entire headline.

Do not shrink typography merely to force an overly long headline into the module.

Do not substitute decorative display text for the documented heading role.

### Supporting copy

Supporting copy appears beneath the headline.

Use standard body typography.

Keep the text focused on the single purpose of the module.

Approximately 100 words or fewer is recommended.

The traditional CMS pattern allows approximately 8–9 lines of supporting content.

Keep formatting simple.

Avoid:

- long nested lists;
- multiple subheadings;
- several unrelated paragraphs;
- multiple calls to action;
- oversized lead text.

### Button

The Call to Action button appears beneath the supporting copy.

Use the established button component.

Button labels should be short, action-oriented, and rendered using the component's uppercase styling.

Examples:

```text
MEET THE STAFF
```

```text
EXPLORE PROGRAMS
```

```text
LEARN MORE
```

```text
GET STARTED
```

The source text does not need to be written in uppercase if the button component applies uppercase styling through CSS.

Do not place a `<button>` inside an `<a>`.

Navigation actions should use an anchor styled as a button.

## Image requirements

Images displayed beside CTA content use the established approximate source dimensions:

```text
550 × 370 pixels
```

Use an image with an appropriate composition for the available landscape area.

Images must:

- retain their natural aspect ratio;
- remain responsive;
- use `max-width: 100%`;
- use `height: auto`;
- have rounded corners;
- use a `14px` border radius.

Do not stretch images.

Do not distort their aspect ratio.

Do not use arbitrary fixed-height cropping when the canonical image treatment allows the image to retain its natural dimensions.

### Canonical image styling

Use:

```css
.cta-module img {
  border-radius: 14px;
  max-width: 100%;
  height: auto;
}
```

When the image appears in a sand-background CTA, preserve the established inset treatment:

```css
.jumbotron-sand img {
  border-radius: 14px;
  margin: 25px 0;
  max-width: 100%;
  height: auto;
}
```

The image margin creates visible sand space above and below the image.

Do not create an additional gray frame, matte, placeholder surface, or background around the image.

The visible area surrounding an inset image must come from the module background itself.

### Image corners

All photographic CTA images use rounded corners.

Use:

```css
border-radius: 14px;
```

This applies regardless of whether the image:

- appears on the left;
- appears on the right;
- uses no overlay;
- uses an approved image overlay.

Any overlay applied to an image must be clipped to the exact same rounded image boundary.

Do not allow an overlay to extend beyond the image and create a visible rectangular box.

A suitable relationship is:

```css
.cta-media-frame {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.cta-media-frame img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 14px;
}
```

If the image does not require an overlay, an additional wrapper is not required solely to create the rounded corners.

### Canonical Call to Action variants

The Call to Action component supports the following canonical variants.

#### 1. Left Image — Dark Style

The image appears on the left.

The written content appears on the right.

The module uses the sand background treatment.

The image uses no overlay.

The image is inset vertically into the sand module background.

Use:

```css
.jumbotron-sand img {
  border-radius: 14px;
  margin: 25px 0;
  max-width: 100%;
  height: auto;
}
```

The module structure should preserve this relationship:

```text
┌──────────────────────────────────────────────────────────────┐
│  ╭──────────────────────╮     Headline                     │
│  │                      │                                  │
│  │        Image         │     Supporting copy              │
│  │                      │                                  │
│  ╰──────────────────────╯     CTA button                   │
└──────────────────────────────────────────────────────────────┘
                 Sand background
```

The sand background must remain visible around the inset image.

Do not place the image inside a gray box.

Do not use an additional background color behind the image.

Do not make the image flush with the top or bottom of the sand panel.

#### 2. Right Image — Light Style — Overlay 1

The written content appears on the left.

The image appears on the right.

Use the documented Overlay 1 treatment.

The image retains:

```css
border-radius: 14px;
```

The overlay must be clipped to the rounded image.

Do not allow the overlay surface to extend outside the image boundary.

A suitable implementation is:

```css
.cta-overlay-1 .cta-media-frame {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.cta-overlay-1 .cta-media-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events: none;
}
```

The exact approved overlay color or opacity should come from the design-system token or documented CTA implementation.

Do not invent additional overlay treatments.

#### 3. Right Image — Light Style — Overlay 2

The written content appears on the left.

The image appears on the right.

Use the documented Overlay 2 treatment.

As with Overlay 1:

- image corners remain `14px`;
- the overlay follows the exact same rounded boundary;
- no visible rectangular overlay may extend beyond the image;
- no gray frame is added behind the image.

Overlay 2 is a distinct approved treatment, not an arbitrary opacity variation generated for visual variety.

#### 4. Yellow Grit Background

This variant does not require a photograph.

Use the approved UC San Diego yellow grit background.

Written content appears directly on the grit surface.

Use dark text with sufficient contrast.

The content should include:

- headline;
- supporting copy;
- optional CTA button.

Do not place a decorative photo beside the grit treatment.

Do not combine the grit background with a separate image unless another documented module explicitly permits it.

Do not create new grit colors.

#### 5. Grit Circles Background

This variant uses the approved UC San Diego blue/circle grit treatment.

Written content appears directly on the grit surface.

Use light text where required for contrast.

The content may include:

- headline;
- supporting copy;
- CTA button.

Use surface-aware button behavior.

A button's hover state must remain visually distinct from the background behind it.

For a dark or blue grit surface, do not change the button on hover to a color that disappears into the background.

#### 6. Video Embed

A Call to Action may substitute a video embed for the image.

The video occupies the media side of the module.

Written content occupies the opposite side.

Use a responsive video container.

The video should visually follow the same general media proportions as the image variants.

Where rounded media treatment is used, clip the video to the same `14px` radius.

A suitable implementation is:

```css
.cta-video-frame {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  aspect-ratio: 550 / 370;
}

.cta-video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```

The embedded video must have an accessible title.

Do not autoplay video with sound.

### Visual contract

The Call to Action module must preserve the following visual characteristics:

- content constrained to the standard page container;
- two-column relationship for image/video variants;
- approximately equal media and content columns on desktop;
- rounded media corners;
- `14px` media radius;
- responsive media;
- simple content hierarchy;
- one prominent headline;
- concise supporting text;
- one primary CTA;
- substantial but controlled whitespace;
- vertically balanced media and written content;
- documented UC San Diego surfaces and colors.

The module should feel like a single composition.

Do not style the image and written content as two unrelated cards.

Do not add borders around each column.

Do not add shadows unless the documented pattern explicitly requires them.

Do not wrap the entire module in an arbitrary rounded card.

### Layout

Image and video variants use a Bootstrap grid.

A canonical desktop structure is:

```html
<section class="cta-module jumbotron-sand">
  <div class="container">
    <div class="row align-items-center">

      <div class="col-md-6">
        <figure>
          <img
            class="img-fluid"
            src="IMAGE_SOURCE"
            alt="IMAGE_DESCRIPTION"
          >
        </figure>
      </div>

      <div class="col-md-6">
        <h2>Call to Action Headline</h2>

        <p>
          Supporting copy for the Call to Action.
        </p>

        <p>
          <a class="btn btn-primary" href="#">
            Call to Action
          </a>
        </p>
      </div>

    </div>
  </div>
</section>
```

The image may be moved to the right by reversing the column order.

Do not use absolute positioning to construct the primary two-column layout.

Use the Bootstrap grid.

### Figure behavior

Images may be wrapped in `<figure>`.

Do not allow default figure margins to accidentally alter the documented module spacing.

If `<figure>` is used, normalize its margin as needed:

```css
.cta-module figure {
  margin: 0;
}
```

The intentional image spacing should come from the documented module/image rules rather than browser-default figure margins.

### Sand-background treatment

When the CTA uses the dark/sand style, apply the sand surface to the module panel.

The photograph remains visibly inset within this sand surface.

The sand area surrounding the image is intentional.

Use the documented sand surface token rather than an arbitrary beige.

The image does not receive a separate gray background.

Correct:

```text
Sand module
  └── Rounded image with vertical inset
```

Incorrect:

```text
Sand module
  └── Gray image box
        └── Rounded image
```

### Image overlays

Only use documented overlay variants.

An image overlay:

- sits directly over the image;
- follows the image's exact size;
- uses the same `14px` rounded corners;
- is clipped to the image;
- does not alter module dimensions;
- does not create a visible background outside the photo.

A suitable pattern is:

```css
.cta-media-frame {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.cta-media-frame img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
}

.cta-media-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events: none;
}
```

Do not create an overlay by assigning a colored background to an oversized wrapper.

### Background behavior

The Call to Action may use the documented:

- white/light surface;
- sand/dark-style surface;
- Yellow Grit;
- Grit Circles treatment.

Do not arbitrarily alternate background colors for decoration.

Use a background because it belongs to the selected canonical variant.

### Button behavior

Buttons must use established design-system button treatments.

The button's default and hover colors must maintain sufficient contrast against the surface behind the button.

On a light or sand surface, the standard primary button may use the established yellow treatment.

On dark or blue grit surfaces, use surface-aware hover behavior.

Do not allow a button to become visually indistinguishable from its surrounding surface on hover.

Do not introduce undocumented button colors merely for visual variety.

### Optional fields

The supporting copy and CTA button may be omitted when appropriate.

Omitted elements create no empty placeholders.

For example:

- no blurb → headline is followed directly by the button;
- no button → content ends after the supporting copy.

Do not reserve blank vertical space for omitted content.

The image or other media should not be omitted from an image-specific variant.

If no media is required, use an appropriate grit-background variant instead.

### Content limits

Keep the module concise.

Recommended limits:

- headline: approximately 25 characters per line;
- headline: approximately two lines maximum;
- supporting copy: approximately 100 words maximum;
- supporting copy: approximately 8–9 lines in the traditional desktop layout;
- CTA buttons: one.

These are content-design guidelines rather than reasons to alter typography.

Do not shrink fonts to accommodate excessive copy.

Edit the content instead.

### Responsive behavior

On smaller screens, the two-column CTA becomes a stacked layout.

Media should normally appear before the written content unless content requirements specify otherwise.

Images remain:

- responsive;
- `max-width: 100%`;
- `height: auto`;
- `14px` rounded.

Preserve reasonable inset spacing around sand-background images.

Do not remove rounded corners on mobile.

Do not horizontally scroll the module.

Do not allow overlays to separate from their images during responsive stacking.

### Bootstrap 5 requirements

Use Bootstrap 5 grid and responsive utilities.

Canonical column behavior may use:

```html
<div class="row align-items-center">
  <div class="col-md-6">...</div>
  <div class="col-md-6">...</div>
</div>
```

Use:

```html
class="img-fluid"
```

or equivalent responsive behavior.

Do not reproduce obsolete Bootstrap 3 implementation details merely because they appear in the legacy CMS source.

Translate legacy classes where appropriate.

Examples:

```text
.img-responsive → .img-fluid
.btn-default → current documented button component
```

Bootstrap supplies layout mechanics.

The design system supplies the visual appearance.

Do not use Bootstrap defaults as the final visual treatment where the design system defines a different appearance.

### Accessibility

Images that communicate information must have meaningful alternative text.

Decorative images use:

```html
alt=""
```

Do not use placeholder alternative text such as:

```text
Important: add image description
```

in production.

Video embeds must include an accessible title.

CTA links must have understandable link text.

Avoid vague button labels such as:

```text
CLICK HERE
```

unless the surrounding context makes the destination unmistakable.

Keyboard focus must remain visible.

Color contrast must meet the project's accessibility requirements.

Do not rely on an image overlay alone to communicate information.

### Structure

A canonical sand-background, left-image CTA may use:

```html
<section
  class="jumbotron-sand cta-module"
  data-module="call-to-action"
>
  <div class="container">
    <div class="row align-items-center">

      <div class="col-md-6">
        <figure>
          <img
            class="img-fluid"
            src="IMAGE_SOURCE"
            alt="IMAGE_DESCRIPTION"
          >
        </figure>
      </div>

      <div class="col-md-6">
        <h2>
          Call to Action Headline
        </h2>

        <p>
          Supporting copy for the Call to Action.
        </p>

        <p>
          <a
            class="btn btn-primary"
            href="DESTINATION"
          >
            Call to Action
          </a>
        </p>
      </div>

    </div>
  </div>
</section>
```

Canonical image styling:

```css
.jumbotron-sand img {
  border-radius: 14px;
  margin: 25px 0;
  max-width: 100%;
  height: auto;
}
```

### Generation rules

When generating a Call to Action:

- use one of the documented canonical variants;
- preserve the established two-column composition for media variants;
- keep content within the standard container;
- use Bootstrap 5 grid mechanics;
- use the appropriate heading level;
- use the documented typography roles;
- keep supporting copy concise;
- use no more than one primary CTA;
- use approximately `550 × 370` source imagery where practical;
- make images responsive;
- use `14px` rounded image corners;
- preserve the `25px 0` image margin for the sand-background inset treatment;
- allow the module background itself to show around inset images;
- clip image overlays to the rounded image boundary;
- ensure video embeds are responsive and accessible;
- use only documented grit backgrounds;
- use surface-aware button hover behavior;
- remove omitted optional fields without placeholders.

Do not:

- create generic marketing cards instead of the CTA pattern;
- add gray image frames;
- place a gray background behind CTA imagery;
- add a separate decorative matte around images;
- use square image corners;
- allow overlays to extend beyond images;
- stretch or distort images;
- arbitrarily crop images with fixed-height containers when natural responsive dimensions are appropriate;
- add more than one competing CTA;
- add multiple unrelated messages;
- introduce undocumented overlays;
- invent new grit backgrounds;
- use arbitrary background colors;
- add shadows for decoration;
- create a mega-card treatment around the entire module;
- shrink typography to accommodate excessive content;
- use Bootstrap 3 classes or interaction patterns when Bootstrap 5 equivalents exist.

The Call to Action should remain recognizable as the established UC San Diego CMS pattern while using the current design-system typography, colors, spacing, accessibility requirements, Bootstrap 5 behavior, and component styling.

## News With Images

When generating a UC San Diego News With Images module, use the established UC San Diego CMS news pattern. Do not substitute a generic card grid, blog-card layout, marketing-card component, or custom editorial grid.

The News With Images module presents a small, curated group of recent stories using an image, publication date, headline, and descriptive link text.

The module must use Bootstrap 5 conventions together with the established UC San Diego module anatomy.

The standard module contains three news items.

### Purpose

Use News With Images when a page needs to highlight a small group of recent news stories, announcements, articles, or editorial content.

Typical uses include:

* recent campus news;
* departmental news;
* related stories;
* research news;
* institutional announcements;
* externally published stories from an approved UC San Diego source.

Do not use News With Images as a substitute for:

* a general-purpose card grid;
* a navigation module;
* Tiles with Links;
* a Call to Action;
* a list of unrelated resources;
* a large searchable news archive.

If more than three stories need to be displayed, use a dedicated news listing or archive pattern rather than continually extending this module.

### Module background

The News With Images module uses a constrained Sand panel within the page's standard content container.

Use:

* Sand: `#F5F0E6`

The Sand surface provides subtle grouping without giving the module the visual weight of a Navy or Blue branded section.

The module background must not extend edge to edge across the viewport.

The module must remain centered within the page's standard content container.

Do not:

* use a full-width Sand band for this module;
* use Navy, Blue, Yellow, or expressive accent colors as interchangeable module backgrounds;
* place each news item on a separate colored card;
* add default drop shadows;
* add decorative gradients or textures.

### Module header

The module header contains:

* an `h2` module heading;
* an optional module-level text link aligned opposite the heading.

The standard presentation places the heading at the left and the module-level action at the right on larger viewports.

Example:

```html
<div class="news-heading-row">
  <div>
    <h2 id="news-heading">AI news from UC San Diego</h2>
  </div>

  <div class="view-all-link">
    <a class="text-link" href="/news/">
      View all news
    </a>
  </div>
</div>
```

The module-level action is a text link, not a filled button.

Use it for actions such as:

* View all news
* More news
* See all stories

Do not add an eyebrow, kicker, overline, category label, or decorative rule above the module heading.

### Module heading

Use the `type.h2` typography role.

The heading uses:

* Font family: Refrigerator Deluxe
* Font size: `40px`
* Line height: `40px`
* Font weight: `900`
* Letter spacing: `0.5px`
* Color: Navy `#182B49`

Example:

```css
.news-heading-row h2 {
  font-family: var(--ucsd-font-display);
  font-size: 40px;
  line-height: 40px;
  font-weight: 900;
  letter-spacing: .5px;
  color: var(--ucsd-color-foreground-h2-heading);
  margin: 0;
}
```

Do not substitute Brix Sans for the module heading.

Do not uppercase the heading.

### Module-level text link

The module-level action uses the UC San Diego text-link treatment rather than `btn-primary` or `btn-secondary`.

The text link uses:

* Navy label text;
* Brix Sans;
* `15px` font size;
* `20px` line height;
* font weight `900`;
* `1.4px` letter spacing;
* uppercase text;
* a `1px` UC San Diego Blue underline;
* no background;
* no border radius.

The underline must use UC San Diego Blue `#00629B`.

Example:

```css
.news-heading-row .text-link {
  display: inline-block;
  color: #182b49;
  font-family: var(--ucsd-font-body);
  font-size: 15px;
  line-height: 20px;
  font-weight: 900;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  text-decoration: none;
  border-bottom: 1px solid #00629b;
}

.news-heading-row .text-link:hover {
  color: #00629b;
  border-bottom-color: #00629b;
}

.news-heading-row .text-link:focus-visible {
  outline: 3px solid #ffcd00;
  outline-offset: 4px;
}
```

Do not use a Navy underline.

Do not style this module-level action as a filled secondary button.

### Visual contract

The News With Images module must preserve the following visual relationships:

* The entire module is centered within the standard page container.
* The Sand module surface is constrained to that container rather than spanning the viewport.
* The module includes substantial internal padding.
* The heading and module-level action occupy the same introductory row.
* The heading aligns to the left.
* The module-level text link aligns to the right on desktop.
* Three news items appear in one equal-width row on standard desktop viewports.
* News-item gutters are consistent.
* Every news image uses the same aspect ratio.
* The date appears immediately below the image and above the headline.
* The headline appears below the date.
* Descriptive link text appears beneath the headline.
* Items align consistently even when headline lengths differ.
* News items do not use a default box shadow.
* News items do not appear as floating SaaS-style cards.
* Content leads; borders, shadows, and decorative chrome remain minimal.

### News grid

The standard desktop presentation contains three equal-width news items.

Use three columns at desktop widths.

The grid collapses responsively:

* desktop: three columns;
* medium viewports: two columns;
* small/mobile viewports: one column.

Example:

```css
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ucsd-space-lg);
}

@media (max-width: 991px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
```

A Bootstrap 5 implementation may instead use:

```html
<div class="row g-4">
  <div class="col-md-6 col-lg-4">...</div>
  <div class="col-md-6 col-lg-4">...</div>
  <div class="col-md-6 col-lg-4">...</div>
</div>
```

Prefer the Bootstrap 5 grid when implementing the module inside the UC San Diego Bootstrap package.

### News item

Each news item contains:

1. image;
2. publication date;
3. headline;
4. descriptive destination text.

The entire news item may be one navigation link.

Canonical anatomy:

```html
<a class="news-panel" href="/news/story/">
  <img
    src="/images/story.jpg"
    alt="Descriptive image alternative text"
  >

  <div class="news-panel-heading">
    <time
      class="panel-news-date"
      datetime="2026-09-09"
    >
      September 9, 2026
    </time>

    <h3 class="panel-news-title">
      Example news headline
    </h3>
  </div>

  <div class="news-panel-body">
    Read about the example story
  </div>
</a>
```

If the whole news item is linked, do not place additional nested `<a>` elements inside it.

Do not use `alt` on the `<a>` element. The `alt` attribute is for images, not links.

### News images

News images use the established UC San Diego News With Images proportion:

* Width reference: `388px`
* Height reference: `246px`
* Aspect ratio: `388 / 246`

Use:

```css
.news-panel img {
  display: block;
  width: 100%;
  aspect-ratio: 388 / 246;
  object-fit: cover;
}
```

Images must:

* fill the available card width;
* use a consistent aspect ratio;
* use `object-fit: cover`;
* use meaningful alternative text when the image conveys information;
* use `alt=""` when the image is entirely decorative and its content is already fully represented by adjacent text.

Do not:

* allow mixed image heights within a single module;
* stretch images;
* distort image proportions;
* use unrelated decorative stock imagery;
* put text over the news images;
* use arbitrary image ratios within the same module.

### Image corner treatment

Use the standard medium-radius treatment:

```css
.news-panel img {
  border-radius: var(--ucsd-radius-md);
}
```

Do not add excessive rounding.

The image may carry the radius without placing the entire news item inside a rounded card.

### Publication date

The publication date appears immediately beneath the image and above the headline.

Use a semantic `<time>` element whenever the date is known.

Example:

```html
<time
  class="panel-news-date"
  datetime="2026-09-09"
>
  September 9, 2026
</time>
```

Date typography:

* Brix Sans;
* `15px`;
* `20px` line height;
* weight `400`;
* uppercase;
* Navy.

Example:

```css
.panel-news-date {
  display: block;
  margin: 0 0 .35rem;
  font-family: var(--ucsd-font-body);
  font-size: 15px;
  line-height: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: #182b49;
}
```

Do not use low-contrast gray merely to make the date appear secondary.

### News headline

Each news item uses an `h3` for its headline when the module heading is an `h2`.

Headline typography:

* Brix Sans;
* `24px`;
* `28px` line height;
* weight `900`;
* Navy.

Example:

```css
.panel-news-title {
  margin: 0;
  font-family: var(--ucsd-font-body);
  font-size: 24px;
  line-height: 28px;
  font-weight: 900;
  color: #182b49;
}
```

On desktop, the headline area may use a minimum height to keep the bottom links visually aligned across all three items.

Example:

```css
.panel-news-title {
  min-height: 88px;
}
```

Remove the minimum height when news items stack vertically on small screens:

```css
@media (max-width: 767px) {
  .panel-news-title {
    min-height: 0;
  }
}
```

Keep headlines concise.

Prefer headlines that occupy approximately two to four lines at the standard desktop width.

Do not truncate meaningful headlines with ellipses solely to force identical heights.

### Descriptive story link text

The text beneath each headline must describe the destination.

Do not repeat generic link text such as:

* Read more
* Learn more
* Read the story
* Click here

Repeated generic links are ambiguous when a user navigates by links or encounters the links outside their visual context.

Use concise, story-specific labels such as:

* `Read about the Imagination Advantage`
* `Read about the NSF NAIRR Operations Center`
* `Read about Summer of Learning by Doing`

Keep this text concise enough to occupy approximately one or two lines on desktop.

Do not repeat the complete headline when a shorter unique phrase provides an equally clear accessible name.

The link treatment uses:

* Brix Sans;
* `15px`;
* `20px` line height;
* weight `900`;
* approximately `1.1px` letter spacing;
* uppercase;
* Navy;
* visible underline.

Example:

```css
.news-panel-body {
  margin-top: auto;
  padding:
    var(--ucsd-space-md)
    var(--ucsd-space-sm)
    0;

  font-family: var(--ucsd-font-body);
  font-size: 15px;
  line-height: 20px;
  font-weight: 900;
  letter-spacing: 1.1px;
  text-transform: uppercase;

  color: #182b49;

  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

### Whole-item interaction

When the entire news item is linked, the complete item is the interactive target.

Use:

```css
.news-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: #182b49;
  text-decoration: none;
  background: transparent;
}
```

On hover, reinforce the headline as the destination:

```css
.news-panel:hover .panel-news-title {
  text-decoration: underline;
}
```

Do not:

* lift the item vertically;
* add a hover shadow;
* scale the card;
* zoom the image;
* change the entire item to a saturated background color.

The News With Images module is editorial content, not Tiles with Links. It should not inherit the Tiles scale interaction.

### Keyboard focus

Every linked news item must have a clearly visible keyboard focus indicator.

Use:

```css
.news-panel:focus-visible {
  outline: 3px solid #ffcd00;
  outline-offset: 5px;
}
```

The module-level View All link must also have a visible focus indicator.

Do not remove browser focus styling without replacing it with an equally visible treatment.

### Module panel

The module is a constrained panel inside the page container.

Canonical treatment:

```css
.jumbotron-news {
  padding-block: var(--ucsd-space-xxxl);
}

.jumbotron-news > .container {
  background: var(--ucsd-color-surface-2);
  padding: var(--ucsd-space-xxl);
  border-radius: var(--ucsd-radius-md);
}
```

This produces a Sand content panel surrounded by the page's normal canvas.

Do not allow the Sand surface to bleed to the edges of the browser viewport.

### Header layout

Desktop:

```css
.news-heading-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: start;
  gap: var(--ucsd-space-lg);
  margin-bottom: var(--ucsd-space-xl);
}

.news-heading-row .view-all-link {
  text-align: right;
  padding-top: .35rem;
}
```

At smaller breakpoints, allow the action to move below the heading:

```css
@media (max-width: 767px) {
  .news-heading-row {
    display: block;
  }

  .news-heading-row .view-all-link {
    margin-top: var(--ucsd-space-md);
    text-align: left;
  }
}
```

Do not force the View All link to remain right aligned when doing so causes crowding or overlap.

### Structure

The outer section identifies the module and provides semantic grouping.

The canonical hierarchy is:

* `<section class="jumbotron-news" data-module="news-with-images">`
* `.container`
* `.news-heading-row`
* module `<h2>`
* optional `.view-all-link`
* `.news-grid` or Bootstrap `.row`
* individual `.news-panel`
* `<img>`
* `.news-panel-heading`
* `<time class="panel-news-date">`
* `<h3 class="panel-news-title">`
* `.news-panel-body`

The module heading must be associated with the section using `aria-labelledby`.

Example:

```html
<section
  class="jumbotron-news"
  data-module="news-with-images"
  aria-labelledby="news-heading"
>
```

Do not use `aria-label` when an existing visible heading can provide the accessible name through `aria-labelledby`.

### Canonical Bootstrap 5 example

```html
<section
  class="jumbotron-news"
  data-module="news-with-images"
  aria-labelledby="news-heading"
>
  <div class="container">

    <div class="news-heading-row">
      <div>
        <h2 id="news-heading">
          AI news from UC San Diego
        </h2>
      </div>

      <div class="view-all-link">
        <a
          class="text-link"
          href="/news/"
        >
          View all news
        </a>
      </div>
    </div>

    <div class="row g-4">

      <div class="col-md-6 col-lg-4">
        <a
          class="news-panel"
          href="/news/story-one/"
        >
          <img
            src="/images/story-one.jpg"
            alt="Description of the story image"
          >

          <div class="news-panel-heading">
            <time
              class="panel-news-date"
              datetime="2026-09-09"
            >
              September 9, 2026
            </time>

            <h3 class="panel-news-title">
              The Imagination Advantage:
              A Conversation with Cassandra Vieten
            </h3>
          </div>

          <div class="news-panel-body">
            Read about the Imagination Advantage
          </div>
        </a>
      </div>

      <div class="col-md-6 col-lg-4">
        <a
          class="news-panel"
          href="/news/story-two/"
        >
          <img
            src="/images/story-two.jpg"
            alt="Description of the story image"
          >

          <div class="news-panel-heading">
            <time
              class="panel-news-date"
              datetime="2026-09-01"
            >
              September 1, 2026
            </time>

            <h3 class="panel-news-title">
              Strengthening America's AI Ecosystem
              with the Launch of the NSF NAIRR
              Operations Center
            </h3>
          </div>

          <div class="news-panel-body">
            Read about the NSF NAIRR Operations Center
          </div>
        </a>
      </div>

      <div class="col-md-6 col-lg-4">
        <a
          class="news-panel"
          href="/news/story-three/"
        >
          <img
            src="/images/story-three.jpg"
            alt="Description of the story image"
          >

          <div class="news-panel-heading">
            <time
              class="panel-news-date"
              datetime="2026-08-31"
            >
              August 31, 2026
            </time>

            <h3 class="panel-news-title">
              A Summer of Learning by Doing
            </h3>
          </div>

          <div class="news-panel-body">
            Read about Summer of Learning by Doing
          </div>
        </a>
      </div>

    </div>

  </div>
</section>
```

### Canonical CSS

```css
.jumbotron-news {
  padding-block: var(--ucsd-space-xxxl);
}

.jumbotron-news > .container {
  background: var(--ucsd-color-surface-2);
  padding: var(--ucsd-space-xxl);
  border-radius: var(--ucsd-radius-md);
}

/* Header */

.news-heading-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: start;
  gap: var(--ucsd-space-lg);
  margin-bottom: var(--ucsd-space-xl);
}

.news-heading-row h2 {
  margin: 0;

  font-family: var(--ucsd-font-display);
  font-size: 40px;
  line-height: 40px;
  font-weight: 900;
  letter-spacing: .5px;

  color: var(--ucsd-color-foreground-h2-heading);
}

.news-heading-row .view-all-link {
  padding-top: .35rem;
  text-align: right;
}

/* Module-level text link */

.news-heading-row .text-link {
  display: inline-block;

  color: var(--ucsd-color-theme-primary);

  font-family: var(--ucsd-font-body);
  font-size: 15px;
  line-height: 20px;
  font-weight: 900;
  letter-spacing: 1.4px;

  text-transform: uppercase;
  text-decoration: none;

  border-bottom:
    1px solid
    var(--ucsd-color-component-btn-secondary);
}

.news-heading-row .text-link:hover {
  color: var(--ucsd-color-component-btn-secondary);
  border-bottom-color:
    var(--ucsd-color-component-btn-secondary);
}

.news-heading-row .text-link:focus-visible {
  outline:
    3px solid
    var(--ucsd-color-theme-secondary);
  outline-offset: 4px;
}

/* News grid */

.news-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: var(--ucsd-space-lg);
}

/* News item */

.news-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;

  color: var(--ucsd-color-theme-primary);
  background: transparent;
  text-decoration: none;
}

.news-panel:hover .panel-news-title {
  text-decoration: underline;
}

.news-panel:focus-visible {
  outline:
    3px solid
    var(--ucsd-color-theme-secondary);
  outline-offset: 5px;
}

/* Image */

.news-panel img {
  display: block;
  width: 100%;
  aspect-ratio: 388 / 246;
  object-fit: cover;

  border-radius: var(--ucsd-radius-md);
  background: var(--ucsd-color-surface-5);
}

/* Story content */

.news-panel-heading {
  padding:
    var(--ucsd-space-md)
    var(--ucsd-space-sm)
    0;
}

.panel-news-date {
  display: block;
  margin: 0 0 .35rem;

  font-family: var(--ucsd-font-body);
  font-size: 15px;
  line-height: 20px;
  font-weight: 400;

  text-transform: uppercase;

  color: var(--ucsd-color-theme-primary);
}

.panel-news-title {
  min-height: 88px;
  margin: 0;

  font-family: var(--ucsd-font-body);
  font-size: 24px;
  line-height: 28px;
  font-weight: 900;

  color: var(--ucsd-color-theme-primary);
}

.news-panel-body {
  margin-top: auto;

  padding:
    var(--ucsd-space-md)
    var(--ucsd-space-sm)
    0;

  font-family: var(--ucsd-font-body);
  font-size: 15px;
  line-height: 20px;
  font-weight: 900;
  letter-spacing: 1.1px;

  text-transform: uppercase;

  color: var(--ucsd-color-theme-primary);

  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

/* Responsive */

@media (max-width: 991px) {
  .news-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .news-heading-row {
    grid-template-columns: 1fr auto;
  }
}

@media (max-width: 767px) {
  .news-heading-row {
    display: block;
  }

  .news-heading-row h2 {
    font-size: 34px;
    line-height: 34px;
  }

  .news-heading-row .view-all-link {
    margin-top: var(--ucsd-space-md);
    text-align: left;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .panel-news-title {
    min-height: 0;
  }
}
```

### Bootstrap 5 requirements

Use Bootstrap 5 markup and utilities.

Do not reproduce obsolete Bootstrap 3 implementation details from legacy CMS examples.

In particular:

* do not depend on Bootstrap 3's `.jumbotron` component;
* do not use `.col-xs-*`;
* do not use `.text-right`;
* use `.text-md-end` when Bootstrap alignment utilities are appropriate;
* do not use `.panel`, `.panel-default`, `.panel-heading`, or `.panel-body` as Bootstrap components;
* use semantic UC San Diego module classes instead;
* use `.row`, `.g-4`, `.col-md-6`, and `.col-lg-4` when using the Bootstrap grid;
* use real links for navigation;
* do not place a `<button>` inside an `<a>`.

Legacy UC San Diego class names may inform the module's visual ancestry, but new implementations must use Bootstrap 5 conventions.

### Accessibility

The News With Images module must meet the following requirements:

* The outer section has an accessible name through `aria-labelledby`.
* The visible module heading is an `h2` when appropriate to the page hierarchy.
* Story headlines use `h3` beneath that module heading.
* Publication dates use semantic `<time datetime="">` markup.
* Images have meaningful `alt` text when informative.
* Decorative images use `alt=""`.
* Linked news items have visible keyboard focus.
* Link purpose can be determined from the accessible name and surrounding content.
* Repeated generic labels such as `Read more` or `Read the story` are not used.
* Module-level link text is descriptive.
* Link and focus treatments do not rely on color alone.
* Text maintains WCAG-compliant contrast against the Sand surface.
* Heading order remains logical when the module is placed within a page.
* Responsive reflow does not change the semantic reading order.

If the complete news item is one link, do not create nested links inside the item.

### Content guidance

Use exactly three stories in the standard News With Images module.

For each story:

* use a concise headline;
* provide a publication date;
* provide one representative image;
* provide concise, descriptive destination text;
* keep the destination text to approximately two lines or fewer when practical.

Prefer:

`Read about the NSF NAIRR Operations Center`

over:

`Read Strengthening America's AI Ecosystem with the Launch of the NSF NAIRR Operations Center`

The shorter version remains unique and descriptive while preserving the visual rhythm of the module.

Do not shorten labels until they become ambiguous.

### Do not

Do not:

* turn News With Images into a generic card deck;
* make the module full viewport width;
* make each story a white floating card on Sand;
* add card shadows by default;
* add decorative eyebrow text;
* use more than three stories merely because additional grid space is available;
* use inconsistent image ratios;
* place category badges over the images;
* use a Tiles with Links scale interaction;
* use generic repeated link labels;
* truncate headlines with ellipses by default;
* introduce arbitrary accent colors;
* use a filled button for the module-level `View all news` action;
* use Brix Sans for the module H2 in place of Refrigerator Deluxe;
* omit visible keyboard focus;
* use legacy Bootstrap 3 grid or panel behavior in new implementations.

The target is a restrained editorial module: one clear heading, three consistently structured stories, strong photography, plain metadata, and recognizable UC San Diego interaction styling.
