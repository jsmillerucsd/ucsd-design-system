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

### Hero

When generating a UC San Diego Hero module, use the established UC San Diego
CMS hero pattern. Do not substitute a generic marketing hero, split-screen
banner, card-based introduction, or custom slideshow.

The Hero module must use Bootstrap 5 conventions together with the established
UC San Diego module anatomy.

The hero is a full-width visual module. Its image or approved background may
extend across the viewport, while the hero's text content remains aligned to
the standard page container.

The hero may contain one or more slides.

The Hero module does not use eyebrow text unless a separately documented
variant explicitly includes it.

### Hero content

A hero slide may include:

- a headline;
- a headline break;
- a blurb;
- a module-level button.

The blurb and button are optional.

The headline may be left aligned or center aligned.

Left-aligned headlines may use a headline break to divide the headline into
two lines or phrases.

Do not add an eyebrow, kicker, overline, category label, or other text above
the hero headline unless a separately documented hero variant explicitly
includes one.

When optional content is omitted:

- do not insert placeholder content;
- do not reserve empty vertical space for the missing element;
- allow the remaining hero content to retain its natural spacing.

#### Headline

The hero headline is the primary page-level display heading.

Use the established `type.h1` treatment.

Hero headlines use sentence case. Do not automatically transform hero
headlines to uppercase.

A left-aligned hero headline may contain a deliberate headline break.

Use a semantic line break within the heading when the content calls for the
established two-line treatment:

```html
<h1>
  Hero Examples
  <br>
  <span>Left Headline with Break</span>
</h1>
```

The text after the break remains part of the same semantic heading. Do not
create a second heading merely to achieve the visual line break.

Do not force a headline break simply because the headline wraps naturally.

#### Blurb

The blurb is optional supporting copy that appears beneath the hero headline.

Use it to provide a concise explanation or context for the hero's primary
message.

Keep hero blurbs short enough that they do not dominate the visual area or
obscure excessive portions of the hero media.

Use normal body-text treatment appropriate to the hero's light or dark text
mode.

Do not:

- use the blurb as an eyebrow or kicker;
- repeat the headline in different words;
- use multiple long paragraphs;
- place the blurb above the headline.

#### Button

A hero may contain an optional module-level button beneath the blurb or
headline.

Use an approved UC San Diego button treatment.

Button labels use the established button typography and uppercase treatment.

When an `<a>` performs navigation, style the `<a>` itself as the button. Do
not place a `<button>` inside an `<a>`.

The button hover state follows the documented global button hover rules.

### Visual contract

The Hero module must preserve the following visual relationships:

- The hero visual treatment extends across the full module width.
- Hero text is constrained to the standard page container.
- Text is vertically positioned within the hero rather than appearing in a
  separate panel below it.
- Hero content may be left aligned or center aligned.
- Text and controls must maintain sufficient contrast against the complete
  portion of the background behind them.
- The hero remains visually substantial enough to function as the primary
  introductory module.
- Headline, blurb, and button remain grouped as one content block.
- Carousel controls remain visually separate from the hero content block.
- Previous and next controls appear at the left and right edges of a
  multi-slide hero and are vertically centered.
- Previous and next controls use the established large chevron treatment.
- Pagination indicators and the play/pause control appear together inside one
  unified control group near the bottom center of a multi-slide hero.
- The unified carousel control group uses a dark navy rounded capsule
  containing the pagination indicators followed by the play/pause control.
- The active pagination indicator is filled white.
- Inactive pagination indicators are transparent with a white outline.
- The play/pause control appears inside the same capsule as the pagination
  indicators rather than as a separate floating button.
- A play/pause control is provided when slides advance automatically.

Do not constrain the hero image itself to a card-sized panel inside the page
container.

Do not convert the established hero into a two-column image-and-text layout
unless a separately documented hero variant explicitly uses that composition.

Do not visually separate the play/pause control from the pagination
indicators.

Do not substitute generic Bootstrap arrow graphics for the established UC San
Diego carousel chevrons.

### Canonical hero variants

The UC San Diego Hero module has seven canonical presentation variants.

Generated implementations should select from these established variants rather
than inventing new hero compositions.

The seven canonical variants are:

1. Image with light text and optional headline break
2. Blue Orb pre-canned background with light text
3. Yellow pre-canned background with dark text
4. Navy pre-canned background with light text
5. Image with dark text
6. Image with translucent text box
7. Image with gradient

These variants share the same Hero module anatomy. They differ in background,
text treatment, and optional style modification.

Do not interpret these as seven unrelated hero components.

#### Variant 1: Image with light text

Use an uploaded or approved hero image with light hero text.

The headline may be:

- left aligned; or
- center aligned.

A left-aligned headline may use the optional headline-break treatment.

A centered headline does not use a headline break.

The slide may include:

- headline;
- blurb;
- button.

Each text field is optional.

Example structure:

```html
<div class="carousel-item active">
  <div class="hero-media">

    <img
      src="hero-image.jpg"
      alt=""
    >

    <div class="container">
      <div class="hero-content hero-content-start">

        <h1 class="rt-text-light">
          Hero Examples
          <br>
          <span>Left Headline with Break</span>
        </h1>

        <p class="rt-text-light">
          Concise supporting copy.
        </p>

        <a
          class="btn btn-lg btn-primary"
          href="#"
        >
          Primary action
        </a>

      </div>
    </div>

  </div>
</div>
```

Do not apply an additional text box, dark-text treatment, or gradient unless
that documented variant is being used.

#### Variant 2: Blue Orb with light text

Use the approved UC San Diego Blue Orb pre-canned hero background.

Use light text.

The slide may include:

- headline;
- blurb;
- button.

Use only approved button treatments.

Do not substitute an arbitrary blue gradient, stock illustration, or custom
abstract background for the established Blue Orb treatment.

This is a pre-canned background variant, not an uploaded-image style
modification.

#### Variant 3: Yellow with dark text

Use the approved UC San Diego yellow pre-canned hero background.

Use dark text.

Do not use a yellow button on the yellow background because the control must
remain visually distinguishable from the hero surface.

Choose an approved contrasting button treatment.

The slide may include:

- headline;
- blurb;
- button.

This is a pre-canned background variant, not an uploaded-image style
modification.

#### Variant 4: Navy with light text

Use the approved UC San Diego navy pre-canned hero background.

Use light text.

The slide may include:

- headline;
- blurb;
- button.

Use an approved contrasting button treatment.

This is a pre-canned background variant, not an uploaded-image style
modification.

#### Variant 5: Image with dark text

Use this variant when an uploaded hero image is sufficiently light behind the
content area to support dark text.

Use the established dark hero text treatment.

The slide may include:

- headline;
- blurb;
- button.

Dark text is a style modification available to uploaded-image slides.

Do not use dark text when portions of the content area do not maintain
sufficient contrast.

Do not combine the dark-text treatment with another hero style modification.

#### Variant 6: Image with translucent text box

Use this variant when an uploaded hero image is too visually complex to
provide consistent contrast behind the hero content.

Place the headline, blurb and button together inside the established hero text
box.

The text box may use the approved dark-blue or light-blue treatment and the
documented opacity option.

Keep the blurb concise so the box does not grow excessively large.

The text box is a style modification available to uploaded-image slides.

Do not:

- create separate boxes around individual text elements;
- allow the box to grow into a large content panel;
- combine the text box with the gradient or dark-text style modification.

#### Variant 7: Image with gradient

Use this variant when an uploaded hero image needs additional contrast behind
the text while retaining an uninterrupted image treatment.

Apply the established gentle blue gradient beneath the hero content.

The slide may include:

- headline;
- blurb;
- button.

The gradient is a style modification available to uploaded-image slides.

Do not:

- replace the documented gradient with a uniformly dark full-image overlay;
- make the gradient visually dominate the image;
- combine the gradient with the text-box or dark-text style modification.

### Uploaded images versus pre-canned backgrounds

Hero slides have two background-source types:

#### Uploaded image

An uploaded-image slide may use exactly one of the following style
modifications:

- no modification;
- dark text;
- translucent text box;
- gradient.

Do not combine style modifications.

#### Pre-canned background

Approved pre-canned backgrounds are:

- Blue Orb with light text;
- Yellow with dark text;
- Navy with light text.

Style modifications are not applied to pre-canned backgrounds.

Do not recreate these backgrounds approximately with custom CSS when the
approved asset or established implementation is available.

### Button options on pre-canned backgrounds

Pre-canned hero backgrounds support the established hero button treatments.

When translating legacy examples to the current design system, use only button
colors that remain approved by the current UC San Diego token and component
rules.

Do not blindly preserve a legacy button color if it is no longer part of the
current design system.

The button must remain visually distinct from the hero background.

In particular, do not use the yellow button treatment on the yellow
pre-canned hero background.

### Headline alignment

Hero headlines support two alignment modes:

- left aligned;
- centered.

Left-aligned headlines may use a deliberate headline break.

Centered headlines do not use the headline-break option.

The headline break is a content-layout option, not a separate typography
role.

Do not simulate a headline break by creating multiple headings.

### Optional hero fields

Hero slide text fields are optional.

A slide may contain:

- headline + blurb + button;
- headline + blurb;
- headline + button;
- headline only;
- imagery or an approved pre-canned background without text.

Do not insert substitute text when a field is intentionally omitted.

Do not reserve empty space for omitted fields.

A button requires a destination.

### Hero image requirements

Uploaded hero images should use the established hero image proportion.

The legacy CMS reference uses:

```text
1440 × 530
```

When multiple slides use uploaded images, keep the images at the same
dimensions and aspect ratio so the hero does not change height between
slides.

Choose imagery with the expected text location in mind.

Avoid:

- important faces underneath the hero text area;
- text embedded in the image;
- visually busy areas directly behind hero text;
- images whose light or dark regions make the selected text treatment fail
  contrast.

### Content limits

The Hero establishes the page's primary message rather than serving as a large
content container.

Use rich imagery and a small amount of supporting text.

Keep hero copy concise. As a practical upper bound, aim for approximately
thirty words of supporting content rather than trying to communicate detailed
information inside the slide.

Use the hero button to direct users to a page containing the complete
information.

For production sites, prefer one to three hero slides.

Do not create a large carousel simply because the component supports multiple
slides. Important information should not depend on users reaching a later
slide.

### Structure

The outer hero section identifies the module and provides semantic grouping.

The hero media spans the full module width.

The content container remains constrained within the full-width hero.

The canonical hierarchy is:

- `<section class="hero-homepage">`
- Bootstrap 5 `.carousel`
- `.carousel-inner`
- `.carousel-item`
- hero media or approved pre-canned background
- `.container`
- hero content block
- headline
- optional blurb
- optional button
- previous control with UC San Diego chevron
- next control with UC San Diego chevron
- unified `.hero-carousel-controls`
  - `.carousel-indicators`
  - play/pause control

For a static one-slide hero, carousel controls and pagination are omitted.

For a multi-slide hero, preserve the complete carousel control structure.

The pagination indicators and play/pause control are siblings inside one
shared bottom-center carousel-control container.

Do not position the play/pause button independently from the pagination
indicators.

### Previous and next arrow treatment

Multi-slide heroes use the established UC San Diego previous and next
chevrons.

The arrows:

- are positioned at the left and right edges of the hero;
- are vertically centered within the hero;
- use a large, thick chevron shape;
- use a light, semi-opaque white or pale-blue treatment;
- use a subtle dark shadow so the chevron remains visible over both light and
  dark imagery;
- have no circular background;
- have no pill background;
- have no visible rectangular button background;
- do not use a thin line-arrow icon;
- do not use Bootstrap's default carousel icon artwork.

The arrow itself should read as a substantial chevron rather than a small icon.

The clickable button area may be larger than the visible chevron to provide an
appropriate pointer and touch target.

The larger hit area must remain visually transparent.

The visual treatment should resemble:

```text
‹                                  ›
```

with each symbol rendered as a thick chevron rather than as a typographic
less-than or greater-than character.

#### Arrow implementation

Use Bootstrap 5 button behavior while replacing the default icon artwork with
the established chevron treatment.

A suitable implementation is:

```html
<button
  class="carousel-control-prev"
  type="button"
  data-bs-target="#heroCarousel"
  data-bs-slide="prev"
>
  <span
    class="hero-carousel-chevron hero-carousel-chevron-prev"
    aria-hidden="true"
  ></span>
  <span class="visually-hidden">Previous slide</span>
</button>

<button
  class="carousel-control-next"
  type="button"
  data-bs-target="#heroCarousel"
  data-bs-slide="next"
>
  <span
    class="hero-carousel-chevron hero-carousel-chevron-next"
    aria-hidden="true"
  ></span>
  <span class="visually-hidden">Next slide</span>
</button>
```

The visual chevron may be constructed with CSS:

```css
.carousel-control-prev,
.carousel-control-next {
  width: 8%;
  min-width: 64px;

  border: 0;
  background: transparent;

  opacity: 1;
}

.hero-carousel-chevron {
  display: block;

  width: 32px;
  height: 32px;

  border-top: 11px solid rgba(255, 255, 255, .68);
  border-right: 11px solid rgba(255, 255, 255, .68);

  filter: drop-shadow(0 2px 1px rgba(24, 43, 73, .45));
}

.hero-carousel-chevron-prev {
  transform: rotate(-135deg);
}

.hero-carousel-chevron-next {
  transform: rotate(45deg);
}
```

Adjust dimensions only as needed to reproduce the established UC San Diego
chevron proportion.

Do not fall back to:

```html
<span class="carousel-control-next-icon"></span>
```

or:

```html
<span class="carousel-control-prev-icon"></span>
```

because Bootstrap's default carousel icons do not reproduce the established
UC San Diego hero controls.

### Carousel control group

A multi-slide hero uses one unified bottom-center control group for pagination
and play/pause.

The control group:

- is horizontally centered near the bottom of the hero;
- uses a dark navy background;
- uses a fully rounded pill or capsule shape;
- contains all pagination indicators in a single horizontal row;
- places the play/pause control to the right of the pagination indicators;
- keeps indicators and play/pause vertically centered;
- uses compact, consistent spacing;
- remains visually distinct from the hero background.

The control group should read as one interface element.

Do not render the pagination dots as one floating element and the play/pause
button as another.

Do not give the play/pause button its own separate circular or pill-shaped
background.

Do not add a large gap between the final pagination indicator and the
play/pause control.

The visual relationship should resemble:

```text
╭──────────────────────────────────────╮
│ ○  ●  ○  ○  ○  ○  ○      Ⅱ       │
╰──────────────────────────────────────╯
```

The number of pagination indicators must equal the number of slides.

#### Control group styling

Use the established visual treatment:

```css
.hero-carousel-controls {
  position: absolute;
  left: 50%;
  bottom: 20px;
  z-index: 8;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 8px 14px;
  border-radius: 999px;

  background: #182b49;
  transform: translateX(-50%);
}

.hero-carousel-controls .carousel-indicators {
  position: static;

  display: flex;
  align-items: center;
  gap: 8px;

  margin: 0;
}

.hero-carousel-controls .carousel-indicators [data-bs-target] {
  width: 18px;
  height: 18px;
  margin: 0;

  border: 2px solid #fff;
  border-radius: 50%;

  background: transparent;
  opacity: 1;
}

.hero-carousel-controls .carousel-indicators .active {
  background: #fff;
}

.hero-carousel-toggle {
  position: static;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 24px;
  min-height: 24px;
  padding: 0;

  border: 0;
  background: transparent;
  color: #fff;
}
```

Do not use Bootstrap's default indicator rectangles.

The indicators must use the established circular-dot treatment.

### Bootstrap 5 requirements

Use Bootstrap 5 carousel markup and attributes.

Do not reproduce Bootstrap 3 carousel syntax.

Replace legacy patterns as follows:

- `.item` → `.carousel-item`
- `data-ride="carousel"` → `data-bs-ride="carousel"`
- `data-slide="prev"` → `data-bs-slide="prev"`
- `data-slide="next"` → `data-bs-slide="next"`
- `data-slide-to` → `data-bs-slide-to`
- `data-target` → `data-bs-target`
- Bootstrap 3 glyphicon controls → the documented UC San Diego chevron
  treatment using Bootstrap 5 carousel behavior.

Use `<button>` elements for carousel indicators and carousel controls.

Bootstrap 5 behavior does not require Bootstrap's default visual treatment.

Use Bootstrap 5 for carousel mechanics while preserving the established UC San
Diego visual treatment for arrows, pagination and playback controls.

Do not add `tabindex="0"` to headings or paragraphs solely to make static text
keyboard focusable.

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
        <div class="hero-media">

          <img
            src="hero-image.jpg"
            alt=""
          >

          <div class="container">
            <div class="hero-content">

              <h1 class="rt-text-light">
                Hero headline
                <br>
                <span>Headline with break</span>
              </h1>

              <p class="rt-text-light">
                A concise supporting blurb appears beneath the headline.
              </p>

              <a
                class="btn btn-lg btn-primary"
                href="#"
              >
                Primary action
              </a>

            </div>
          </div>

        </div>
      </div>

      <div class="carousel-item">
        <div class="hero-media hero-background-navy">

          <div class="container">
            <div class="hero-content">

              <h1 class="rt-text-light">
                Second hero slide
              </h1>

              <p class="rt-text-light">
                Supporting copy is optional.
              </p>

              <a
                class="btn btn-lg btn-primary"
                href="#"
              >
                Primary action
              </a>

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
        class="hero-carousel-chevron hero-carousel-chevron-prev"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Previous slide</span>
    </button>

    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#heroCarousel"
      data-bs-slide="next"
    >
      <span
        class="hero-carousel-chevron hero-carousel-chevron-next"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Next slide</span>
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

### Pagination

Multi-slide heroes use circular pagination indicators inside the unified
bottom-center carousel-control group.

The indicators:

- represent every slide in the carousel;
- clearly distinguish the active slide;
- use a circular shape;
- use a white outline for inactive slides;
- use a solid white fill for the active slide;
- remain visible against the navy control-group background;
- are interactive controls rather than decorative dots;
- have accessible labels identifying the slide they activate.

Pagination indicators and play/pause belong to the same dark navy capsule.

Do not position the pagination indicators independently from the play/pause
control.

Do not use Bootstrap's default rectangular indicator appearance.

Do not hide pagination visually while leaving it available only to assistive
technology.

Do not use pagination on a hero containing only one slide.

### Previous and next controls

Multi-slide heroes provide previous and next controls at the left and right
edges of the hero.

Controls must:

- remain vertically centered within the hero;
- use the established large chevron visual treatment;
- use a light semi-transparent color;
- include a subtle dark shadow for visibility;
- have no visible surrounding circle, pill or rectangle;
- have accessible names;
- use Bootstrap 5 button-based carousel behavior;
- remain independent of the headline and button content;
- remain outside the bottom-center pagination/playback control group.

The interactive button area may extend beyond the visible chevron to provide
a sufficiently large target.

Do not position previous or next controls inside the hero text block.

Do not use Bootstrap's default previous and next icon artwork.

Do not place the arrows inside circular buttons.

Do not place the arrows on dark translucent squares or pills.

### Play and pause

Automatically advancing hero carousels provide a persistent play/pause
control.

The play/pause control is part of the same dark navy bottom-center capsule as
the pagination indicators.

It appears immediately after the pagination indicators.

It does not receive its own separate background, circle, capsule, or floating
container.

When the carousel is playing:

- show the pause symbol;
- the control's accessible name indicates that activating it will pause the
  carousel.

When the carousel is paused:

- show the play symbol;
- the control's accessible name indicates that activating it will resume the
  carousel.

Update both the visible control state and its accessible name.

Do not restart automatic rotation merely because the user manually changes
slides after explicitly pausing the carousel.

### Motion

Carousel transitions should be restrained and must not compete with the hero
content.

Respect `prefers-reduced-motion`.

When reduced motion is requested:

- remove or minimize animated transitions;
- do not introduce additional zoom, parallax, or decorative motion;
- preserve all navigation and carousel controls.

### Accessibility

The Hero module must remain operable with keyboard, pointer, touch and
assistive technology.

For multi-slide heroes:

- expose the carousel as a clearly named region;
- provide accessible names for previous, next, play/pause and pagination
  controls;
- indicate the active pagination item;
- keep previous and next buttons large enough to provide an appropriate
  interactive target even though only the chevron itself is visible;
- maintain the visual grouping of pagination and playback controls without
  merging their individual accessible functions;
- do not place static headings or blurbs in the tab order;
- ensure controls have visible focus states;
- ensure all text maintains required contrast throughout the complete
  background area behind it;
- do not make automatic rotation impossible to pause.

The page must retain a logical heading hierarchy regardless of which slide is
currently visible.

Avoid creating multiple competing page-level headings solely because the
carousel contains multiple slides. Choose semantic heading elements according
to the document outline while applying the appropriate hero typography role.

### Generation rules

When an established UC San Diego Hero module is requested or applicable,
reproduce its documented layout envelope, carousel anatomy, control behavior,
control grouping, arrow treatment, and established classes. Do not merely
imitate its general visual appearance.

When selecting a Hero presentation, choose one of the documented canonical
variants:

- image with light text;
- Blue Orb with light text;
- yellow background with dark text;
- navy background with light text;
- image with dark text;
- image with translucent text box;
- image with gradient.

Do not invent an eighth visual treatment merely for variety.

For an uploaded-image slide, use no more than one documented style
modification.

Pre-canned backgrounds do not receive uploaded-image style modifications.

For Hero modules specifically:

- preserve the full-width visual treatment;
- preserve the constrained content container;
- keep headline, blurb and button grouped;
- preserve left or center alignment when specified;
- preserve deliberate headline breaks when specified;
- preserve the documented text-contrast treatment;
- preserve previous and next controls on multi-slide heroes;
- use the established large, thick, light-colored chevron treatment for
  previous and next controls;
- vertically center previous and next chevrons at the lateral edges of the
  hero;
- preserve the subtle arrow shadow;
- keep the arrow button background visually transparent;
- preserve the unified bottom-center pagination and play/pause control group;
- render pagination indicators and play/pause inside one dark navy rounded
  capsule;
- use circular pagination indicators;
- render the active pagination indicator as solid white;
- render inactive pagination indicators as white outlines;
- keep the play/pause control inside the same capsule as the pagination;
- use Bootstrap 5 carousel behavior and markup;
- preserve established UC San Diego button treatments;
- preserve documented photographic and pre-canned background options;
- use only documented style modifications.

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
