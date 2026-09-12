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
