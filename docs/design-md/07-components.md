## Components

Component *implementations* are not shared across frameworks and are not described here — a `.btn` in Bootstrap 5 and a `<Button>` in a React app can never share code. What they share is the token binding below and the behaviour contract in the skill's accessibility reference.

Write idiomatic code for whichever stack you are in. Correctness comes from binding to the right tokens, not from matching markup.

### Buttons

One primary action per screen. `btn-primary` is the affirmative action; `btn-secondary` carries everything else.

Every button fill has a matching label token — `color.component.btn.primary` with `color.component.btn.label-primary`, and the same for secondary. Use them as a pair; mixing a fill from one variant with a label from another is how contrast failures happen.

Every interactive control has a visible hover state, a visible focus ring drawn from `color.theme.secondary`, and a disabled state that is legibly disabled rather than merely faded. Interactive controls meet the WCAG target-size minimum — never reduce it to fit a layout.

Label buttons with the verb for what happens: "Apply now", "Download the form". Never "Click here", never "Learn more" as the only label on a page with several of them.

Button labels are rendered in uppercase through the component style. Do not rely on authors to manually capitalize button text.

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

### Tiles with Links

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

#### Bootstrap 5 requirements

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

#### Canonical Bootstrap 5 example

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

#### Hover behavior

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

## Canonical hero variants

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

### Variant 1: Image with light text

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

### Variant 2: Blue Orb grit background

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

### Variant 3: Yellow grit background

Use the approved UC San Diego yellow grit background.

Use dark text.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

This is a pre-canned branded background.

Do not use a button color that visually matches the yellow module background.

### Variant 4: Navy grit background

Use the approved UC San Diego navy grit background.

Use light text.

The headline may occupy one or two lines.

The slide may include:

- headline;
- blurb;
- button.

This is a pre-canned branded background.

Do not use a navy button on the navy grit background.

### Variant 5: Image with text box

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

### Variant 6: Image with gradient

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

## Grit-background button colors

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

### Grit button hover behavior

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

## Text-box button hover behavior

Text-box button hover behavior depends on the box surface.

### Blue and Translucent Blue text boxes

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

### Navy and Translucent Navy text boxes

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

## Headline alignment

Hero headlines support:

- left alignment;
- center alignment.

Hero headlines may occupy one or two lines.

Left-aligned headlines may use a deliberate semantic headline break.

Do not create multiple heading elements merely to produce multiple visual
lines.

---

## Optional hero fields

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

## Hero image requirements

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

## Content limits

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

## Structure

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

## Carousel control layout

Carousel controls must never overlap the written hero content.

The layout must reserve distinct spatial regions for:

1. previous-arrow control;
2. written hero content;
3. next-arrow control;
4. bottom pagination/playback controls.

Do not simply position controls over the content and assume there will be
enough space.

### Side arrow gutters

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

### Bottom control safe area

Reserve enough bottom padding inside each hero slide for the unified
pagination/playback capsule.

The headline, blurb, and button must not extend behind or underneath the
bottom controls.

This requirement applies at desktop, tablet, and mobile sizes.

---

## Previous and next controls

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

## Pagination and playback control group

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
24px × 24px
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

between each 24×24 pagination target.

The 24×24 target must not be reduced merely to make the visible controls more
compact.

Use a pseudo-element or equivalent technique so the button remains 24×24
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

  width: 24px;
  height: 24px;

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

## Play and pause

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

## Canonical control-group styling

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

## Bootstrap 5 requirements

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

## Canonical Bootstrap 5 example

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

## Motion

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

## Accessibility

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
- preserve 24×24 pagination targets;
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

## Generation rules

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
- use 24×24 pagination click targets;
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
