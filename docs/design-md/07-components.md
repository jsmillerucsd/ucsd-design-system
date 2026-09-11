## Components

Component *implementations* are not shared across frameworks and are not described here — a `.btn` in Bootstrap 5 and a `<Button>` in a React app can never share code. What they share is the token binding below and the behaviour contract in the skill's accessibility reference.

Write idiomatic code for whichever stack you are in. Correctness comes from binding to the right tokens, not from matching markup.

### Buttons

One primary action per screen. `btn-primary` is the affirmative action; `btn-secondary` carries everything else.

Every button fill has a matching label token — `color.component.btn.primary` with `color.component.btn.label-primary`, and the same for secondary and tertiary. Use them as a pair; mixing a fill from one variant with a label from another is how contrast failures happen.

Every interactive control has a visible hover state, a visible focus ring drawn from `color.theme.secondary`, and a disabled state that is legibly disabled rather than merely faded. Interactive controls meet the WCAG target-size minimum — never reduce it to fit a layout.

Label buttons with the verb for what happens: "Apply now", "Download the form". Never "Click here", never "Learn more" as the only label on a page with several of them.

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

When generating a UC San Diego Tiles with Links module, use the established
UC San Diego CMS module pattern. Do not substitute a generic card grid,
feature grid, or custom tile implementation.

The module must use Bootstrap 5 conventions together with the established
UC San Diego module classes.

#### Structure

- The section uses `jumbotron-tile-links`.
- The selected section surface is expressed with the appropriate
  `tile-module-*` class.
- Set `data-module="tiles-with-links"`.
- The module uses a Bootstrap `.container`.
- Introductory content appears in a Bootstrap `.row`.
- The heading and description occupy `.col-md-8.text-indent`.
- An optional module-level action occupies `.col-md-4`.
- Align the optional action with Bootstrap 5 utilities such as
  `.text-md-end`; do not use the removed Bootstrap 3 `.text-*-right`
  utilities.
- The tile collection appears in a separate `.row.tiles-row`.
- Each tile occupies a responsive Bootstrap column.
- Use `.col-md-4` for the standard three-tile desktop layout.
- Every individual tile uses `.wrapper`.
- Image tiles contain an `<img class="background-image">`.
- Solid-color tiles contain `<div class="background-image"></div>` and an
  approved `tile-*-bg` class.
- Each tile label is an `<h3>` containing the tile's link.
- Image tiles use the established UC San Diego overlay treatment when
  necessary to maintain readable text.
- Use the established UC San Diego module classes rather than recreating
  their appearance with unrelated custom components.

#### Bootstrap 5 requirements

Use Bootstrap 5 markup and utilities.

Do not use Bootstrap 3 patterns that have been removed or superseded.

- Do not use `.jumbotron` as a Bootstrap component. Section spacing and
  surface treatment come from the UC San Diego module class and Bootstrap 5
  spacing utilities where needed.
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
  class="jumbotron-tile-links tile-module-sand py-5"
  data-module="tiles-with-links"
>
  <div class="container">

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
</section>
