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
  component-btn-gold: "#c69214"
  component-btn-label-black: "#000000"
  component-btn-label-primary: "#182b49"
  component-btn-label-secondary: "#ffffff"
  component-btn-label-white: "#ffffff"
  component-btn-navy: "#182b49"
  component-btn-orange: "#fc8900"
  component-btn-primary: "#ffcd00"
  component-btn-secondary: "#00629b"
  component-btn-turqoise: "#00c6d7"
  component-card-blue: "#00629b"
  component-card-navy: "#182b49"
  component-card-semi-transparent-blue: "rgba(0, 98, 155, 0.8)"
  component-card-semi-transparent-navy: "rgba(24, 43, 73, 0.8)"
  component-icon: "#182b49"
  component-link: "#00629b"
  component-menu: "#747678"
  foreground-body-text: "#313232"
  foreground-body-text-focus: "#182b49"
  foreground-card-border: "#d4d5d5"
  foreground-divider: "#647185"
  foreground-eyebrow: "#182b49"
  foreground-h1-heading: "#00629b"
  foreground-h2-heading: "#182b49"
  foreground-h3-heading: "#182b49"
  foreground-heading-light: "#ffffff"
  foreground-subcard-border: "#182b49"
  foreground-subheading: "#182b49"
  status-critical: "#bd1900"
  status-good: "#109b00"
  status-warning: "#fc8900"
  surface-1: "#ffffff"
  surface-2: "#f5f0e6"
  surface-3: "#00629b"
  surface-4: "#182b49"
  surface-5: "#f8f8f9"
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
  "body-sm":
    fontFamily: "'Brix Sans'"
    fontSize: "12px"
    lineHeight: "17px"
    fontWeight: 400
    letterSpacing: 0
  "body-md":
    fontFamily: "'Brix Sans'"
    fontSize: "18px"
    lineHeight: "23px"
    fontWeight: 400
    letterSpacing: -.08
  "body-mdplus":
    fontFamily: "'Brix Sans'"
    fontSize: "20px"
    lineHeight: "30px"
    fontWeight: 400
    letterSpacing: -.08
  "body-lg":
    fontFamily: "'Brix Sans'"
    fontSize: "24px"
    lineHeight: "29px"
    fontWeight: 400
    letterSpacing: 0
  "eyebrow":
    fontFamily: "'Refrigerator Deluxe'"
    fontSize: "14px"
    lineHeight: "16px"
    fontWeight: 900
    letterSpacing: .8
  "h1":
    fontFamily: "'Refrigerator Deluxe'"
    fontSize: "56px"
    lineHeight: "56px"
    fontWeight: 900
    letterSpacing: .6
  "h2":
    fontFamily: "'Brix Sans'"
    fontSize: "40px"
    lineHeight: "40px"
    fontWeight: 900
    letterSpacing: .5
  "h3":
    fontFamily: "'Refrigerator Deluxe'"
    fontSize: "24px"
    lineHeight: "24px"
    fontWeight: 900
    letterSpacing: 0
  "subheading":
    fontFamily: "'Brix Sans'"
    fontSize: "15px"
    lineHeight: "15px"
    fontWeight: 900
    letterSpacing: 1.75
  "btn-primary":
    fontFamily: "'Brix Sans'"
    fontSize: "15px"
    lineHeight: "20px"
    fontWeight: 900
    letterSpacing: 1.4
  "btn-secondary":
    fontFamily: "'Brix Sans'"
    fontSize: "15px"
    lineHeight: "20px"
    fontWeight: 900
    letterSpacing: 1.4
  "body":
    fontFamily: "'Brix Sans'"
  "mono":
    fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
  "h2-small":
    fontFamily: "'Brix Sans'"
    fontWeight: 900
    fontSize: "12px"
    lineHeight: "18px"
    letterSpacing: 0
spacing:
  "0": "0px"
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  xxxl: "64px"
rounded:
  rounded-0: "0px"
  rounded-sm: "4px"
  rounded-md: "8px"
  rounded-lg: "12px"
  rounded-circle: "100px"
components:
  btn-primary:
    backgroundColor: "{colors.component-btn-primary}"
    textColor: "{colors.component-btn-label-primary}"
    rounded: "{rounded.rounded-sm}"
    typography: "{typography.btn}"
  btn-secondary:
    backgroundColor: "{colors.component-btn-secondary}"
    textColor: "{colors.component-btn-label-secondary}"
    rounded: "{rounded.rounded-sm}"
    typography: "{typography.btn}"
breakpoints:
  sm: "576px"
  md: "768px"
  lg: "992px"
  xl: "1200px"
  xxl: "1400px"
containers:
  gutter: "24px"
  margin: "12px"
  prose: "70ch"
  narrow: "768px"
  base: "1140px"
  wide: "1320px"
icons:
  lg-16: "16px"
  lg-20: "20px"
  sm-8: "8px"
  xl-24: "24px"
grid:
  gap: "{spacing.sm}"
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
      component-btn-gold: "#d9b662"
      component-btn-label-black: "#000000"
      component-btn-label-primary: "#182b49"
      component-btn-label-secondary: "#162742"
      component-btn-label-white: "#ffffff"
      component-btn-navy: "#182b49"
      component-btn-orange: "#fc8900"
      component-btn-primary: "#ffcd00"
      component-btn-secondary: "#5496bc"
      component-btn-turqoise: "#00c6d7"
      component-card-blue: "#00629b"
      component-card-navy: "#182b49"
      component-card-semi-transparent-blue: "rgba(0, 98, 155, 0.8)"
      component-card-semi-transparent-navy: "rgba(24, 43, 73, 0.8)"
      component-icon: "#f5f0e6"
      component-link: "#5496bc"
      component-menu: "#747678"
      foreground-body-text: "#bfc0c1"
      foreground-body-text-focus: "#f5f0e6"
      foreground-card-border: "#747678"
      foreground-divider: "#959dab"
      foreground-eyebrow: "#f5f0e6"
      foreground-h1-heading: "#f5f0e6"
      foreground-h2-heading: "#f5f0e6"
      foreground-h3-heading: "#f5f0e6"
      foreground-heading-light: "#f5f0e6"
      foreground-subcard-border: "#747678"
      foreground-subheading: "#f5f0e6"
      status-critical: "#bd1900"
      status-good: "#109b00"
      status-warning: "#fc8900"
      surface-1: "#000000"
      surface-2: "#404142"
      surface-3: "#00629b"
      surface-4: "#182b49"
      surface-5: "#313232"
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

  DO NOT EDIT THIS FILE DIRECTLY. Every line is build output, and `npm run build`
  overwrites an edit made here without warning:

    values (the YAML above)   -> change in Figma, then `npm run sync:figma`
    prose  (everything below) -> edit docs/design-md/*.md, then `npm run build`

  CI fails if this file is stale, and if prose ever restates a token value.

  Full token reference (light + dark, with CSS/Sass/Tailwind syntax):
    skills/ucsd-design-system/references/generated/tokens.md
-->

# UC San Diego Design System

## Overview

This is an evolution of Decorator V5, UCSD's web design system since 2017. Decorator V5 runs on Bootstrap 3, jQuery, and Glyphicons, with Teko as the display face and Roboto for body. It serves a broad mix of pages: recruitment marketing, task tools, faculty profiles, and CMS content.

What carries forward: the UCSD color identity (navy, blue, gold), the structural page shell (masthead with wordmark, navbar with gold active indicator, breadcrumbs, Regents copyright footer), and the commitment to a shared system across campus.

What changes: Bootstrap 3 to 5, then to a token layer that also serves Tailwind and shadcn. Teko and Roboto to Refrigerator Deluxe and Brix Sans from the UCSD brand library. Dark mode, which Decorator V5 never had. And a deliberate shift in register.

**The shift.** Decorator V5's homepage is a seven-slide hero carousel with full-bleed photography and decorative background textures (grit, orbs, trident shapes). That reads as a recruitment brochure. This system pulls toward something plainer: **Geisel Library**, board-formed concrete and glass, structural, unornamented. The form is the structure. Nothing is decoration.

That is the target register: institutional confidence without corporate gloss. Structure you can see. No ornament that isn't doing work.

**Who is reading.** Prospective students, current students completing a task, faculty, researchers, staff, and the public. Most arrived from a search result with a specific question. The recruitment audience is real but is served by a handful of high-production pages, not by every page carrying marketing chrome.

**What that implies.** Content leads; chrome recedes. Generous vertical rhythm and a real reading measure matter more than density. A page that ends two-thirds of the way down the viewport is finished, not underfilled.

**The emotional target** is credible and unhurried. A public research university has nothing to sell in the way a product landing page does. Confidence reads as restraint: one clear action per screen, plain language, no urgency devices.

**What this is not.** Not a startup landing page: no gradient meshes, no glassmorphism, no floating testimonial cards, no animated counters. Not a consumer app: no playful illustration, no mascot voice, no rounded-everything friendliness. Not a brochure: the marks of print (full-bleed hero photography carrying no information, decorative rules, drop caps) don't transfer.

The single most common failure mode is a generated page that is technically on-palette and tonally wrong: UCSD blue applied to a SaaS marketing layout. When a choice isn't covered by a token or a rule below, resolve it toward the building: structural, plain, and durable.

## Colors

UC San Diego color should be applied as a structured system rather than as a set of interchangeable decorative colors.

The core palette establishes hierarchy, structure, and brand recognition. Accent colors should support the core palette rather than compete with it.

Use the official UC San Diego brand palette as the source of truth for color values and general brand intent:

https://brand.ucsd.edu/visual-brand/color/index.html

Use the UC San Diego Department Website as the primary visual reference for correct page-level application of these colors:

https://department.ucsd.edu/

Use the UC San Diego Modules Website as the primary reference for color application within CMS modules and content patterns:

https://department.ucsd.edu/modules/

When these written rules are ambiguous, use the Department Website for page-level composition and the Modules Website for module-level composition.

### Color hierarchy

Use colors according to the following hierarchy:

1. Foundational surfaces: White, Sand
2. Primary brand and structural colors: Navy, Blue
3. High-emphasis colors: Yellow, Gold
4. Expressive accent colors: Turquoise, Magenta, Citron, Orange, Green
5. Supporting neutrals: Cool Gray, Stone, Black

The majority of a page should be built from White, Sand, Navy, and UC San Diego Blue.

Accent colors should occupy substantially less visual area than the core colors.

---

### UC San Diego Navy

**Hex:** `#182B49`

**Role:** Primary dark brand color and strongest structural color.

#### Use for

- Major branded sections
- Navigation and persistent structural elements
- Feature areas
- Strong visual anchors
- Dark cards, tiles, and content modules
- Image overlays
- Backgrounds behind white text and icons

#### Rules

- Use Navy when a section should have strong visual weight or clearly communicate UC San Diego identity.
- Use white text and icons on Navy.
- Prefer Navy over Black for major branded interface surfaces.
- Alternate Navy sections with White or Sand to maintain visual rhythm.
- Do not allow large portions of a page to become one uninterrupted Navy surface.
- Do not place Navy components on Navy backgrounds unless sufficient visual separation exists.
- Use Navy for stronger structural emphasis than Blue.

---

### UC San Diego Blue

**Hex:** `#00629B`

**Role:** Primary active brand color and secondary structural color.

#### Use for

- Links
- Primary interactive elements
- Buttons
- Medium-emphasis branded sections
- Cards and tiles
- Content boxes
- Image overlays

#### Rules

- Use Blue as the default brand color for interaction.
- Prefer Blue for prominent links and controls unless another semantic treatment is required.
- Use Blue when Navy would feel too visually heavy.
- Prefer Blue or Navy before introducing an accent color.
- Maintain a clear distinction between Navy structural elements and Blue interactive elements.
- Do not replace Blue with an expressive accent color for standard interaction.

**Hierarchy:**

- Navy = strongest structural color
- Blue = primary active and interactive color

---

### UC San Diego Yellow

**Hex:** `#FFCD00`

**Role:** High-attention accent color.

#### Use for

- Calls to action
- Small areas of emphasis
- Graphic highlights
- Small branded accents
- Selected tiles or component treatments

#### Rules

- Use Yellow sparingly.
- Use Yellow when an element should receive immediate visual attention.
- Keep Yellow subordinate to Navy and Blue in the overall composition.
- Do not use Yellow as the dominant page background.
- Do not use Yellow for large areas of body content.
- Do not rely on Yellow alone to communicate meaning or state.
- Do not assume white text is accessible on Yellow.

> Yellow attracts attention; it does not provide structure.

---

### UC San Diego Gold

**Hex:** `#C69214`

**Role:** Restrained, formal brand accent.

#### Use for

- Institutional or formal treatments
- Small branded accents
- Graphic details
- Navy, Gold, and Stone compositions
- Situations where a more subdued treatment is appropriate than Yellow

#### Rules

- Use Gold sparingly.
- Do not treat Gold and Yellow as interchangeable.
- Do not use Gold as a primary interface background.
- Do not use Gold as the default color for links or primary actions.
- Prefer Blue for standard interactive controls.
- Keep Navy or Blue visually dominant when Gold is used.

---

### White

**Hex:** `#FFFFFF`

**Role:** Default content surface and primary page canvas.

#### Use for

- Standard page backgrounds
- Content-heavy sections
- Cards
- Reading surfaces
- Areas between stronger branded modules

#### Rules

- Use White as the default background unless another surface has a specific purpose.
- Use dark text on White.
- Prefer White for long-form reading and information-dense areas.
- Use White to provide breathing room between stronger branded sections.
- Do not add color unless it communicates hierarchy, interaction, grouping, emphasis, or brand identity.
- Most ordinary content should remain on White.

---

### Sand

**Hex:** `#F5F0E6`

**Role:** Primary alternate light surface.

#### Use for

- Alternate page sections
- Grouped content
- Feature sections
- Cards
- Calls to action
- Tiles
- Areas requiring subtle separation from White

#### Rules

- Use Sand to distinguish content groups without creating strong visual emphasis.
- Use dark text on Sand.
- Prefer Sand over generic gray when a warm UC San Diego neutral is appropriate.
- Do not mechanically alternate every White section with Sand.
- Use Sand only when the surface change supports meaningful grouping or page rhythm.

**Hierarchy:**

- White = normal content
- Sand = softly emphasized or grouped content

---

### Turquoise

**Hex:** `#00C6D7`

**Role:** Expressive accent color.

#### Use for

- Occasional tiles
- Graphic accents
- Illustrations
- Data visualization
- Small areas of visual variation

#### Rules

- Use Turquoise sparingly.
- Use Turquoise only when Navy or Blue already establishes UC San Diego identity in the surrounding composition.
- Do not use Turquoise as the dominant site color.
- Avoid large uninterrupted Turquoise backgrounds.
- Do not replace Blue with Turquoise for standard links, navigation, or controls.
- Do not assign Turquoise semantic meaning unless explicitly defined by the design system.

---

### Magenta

**Hex:** `#D462AD`

**Role:** Rare expressive accent.

#### Use for

- Campaigns
- Editorial graphics
- Illustrations
- Promotional treatments
- Isolated expressive moments

#### Rules

- Use Magenta sparingly.
- Do not use Magenta as a standard UI surface color.
- Do not use Magenta for normal links, buttons, navigation, or controls.
- Do not substitute Magenta for Blue.
- Ensure Navy or Blue remains visually present when Magenta plays a prominent role.
- Do not introduce Magenta into standard modules without a specific design reason.

---

### Citron

**Hex:** `#F3E500`

**Role:** Special-purpose bright accent.

#### Use for

- Illustrations
- Campaign graphics
- Data visualization
- Small graphic accents
- Distinctive branded moments

#### Rules

- Use Citron very sparingly.
- Do not use Citron as a general-purpose UI background.
- Do not use Citron for body text.
- Do not use Citron for standard navigation or interaction.
- Do not assign Citron semantic meaning unless explicitly defined by the design system.
- Maintain stronger presence of Navy or Blue in the overall composition.

---

### Orange

**Hex:** `#FC8900`

**Role:** Special-purpose warm accent.

#### Use for

- Illustrations
- Campaigns
- Editorial graphics
- Data visualization
- Small isolated accents

#### Rules

- Reserve Orange for expressive and supporting uses.
- Do not use Orange as the standard color for navigation or interaction.
- Do not allow Orange to compete with Blue for primary actions.
- Avoid large saturated Orange surfaces unless specifically required by an approved composition.
- Keep Orange subordinate to the core UC San Diego colors.

---

### Green

**Hex:** `#6E963B`

**Role:** Special-purpose supporting accent.

#### Use for

- Illustrations
- Editorial graphics
- Specialized compositions
- Data visualization
- Small accent treatments

#### Rules

- Use Green sparingly.
- Do not replace Blue with Green for standard links, buttons, or navigation.
- Do not automatically use brand Green to indicate success.
- Semantic success colors should be defined independently and meet accessibility requirements.
- Maintain Navy or Blue as the primary brand identifier when Green is prominent.

---

### Cool Gray

**Hex:** `#747678`

**Role:** Supporting neutral.

#### Use for

- Secondary text
- Metadata
- Supporting interface elements
- Subtle borders
- Disabled states
- Low-emphasis information

#### Rules

- Use Cool Gray only when reduced visual emphasis is intentional.
- Prefer Navy when a darker color can provide stronger brand identity without harming hierarchy.
- Verify sufficient contrast whenever Cool Gray is used for text.
- Do not use low-contrast gray text solely to create visual hierarchy.

---

### Stone

**Hex:** `#B6B1A9`

**Role:** Warm supporting neutral.

#### Use for

- Subtle decorative surfaces
- Borders
- Supporting backgrounds
- Formal institutional treatments
- Compositions using Navy and Gold

#### Rules

- Treat Stone as a supporting color rather than a primary brand identifier.
- Do not allow Stone to compete with Sand as the normal alternate page surface without a specific reason.
- Use Stone when a quieter or more formal neutral treatment is appropriate.

---

### Black

**Hex:** `#000000`

**Role:** Functional neutral rather than a primary UC San Diego brand color.

#### Use for

- Situations requiring maximum contrast
- Functional interface needs
- Content where Black is specifically required

#### Rules

- Prefer Navy over Black for major branded typography and interface surfaces when appropriate.
- Do not build a primarily black-and-white UC San Diego interface when Navy or Blue could establish brand identity.
- Use Black for functional reasons rather than as a dominant visual theme.

---

### Surface selection

Choose section backgrounds according to this hierarchy:

- Standard content → White
- Alternate or grouped content → Sand
- Strong branded section → Navy
- Medium-emphasis branded section → Blue
- High-attention accent → Yellow
- Occasional expressive variation → Turquoise
- Special campaign or graphic treatment → Magenta, Citron, Orange, or Green

Do not choose section colors arbitrarily.

Every background color should communicate at least one of the following:

- Hierarchy
- Grouping
- Emphasis
- Interaction
- Brand identity
- Semantic meaning

If changing the background color does not serve one of these purposes, use White.

---

### Component color rules

Being part of the UC San Diego brand palette does not mean a color should be exposed as an option on every component.

Components should provide only color variants appropriate to their function.

#### Buttons

- Blue
- Navy when explicitly required
- Yellow for approved high-emphasis CTA treatments

##### Button hover colors
If the primary button is blue or yellow, then the hover background color should be navy, and the text should be white.

Example:

.btn-primary:hover {
    background-color: #182b49;
    color: #fff;
}

If the primary background behind the button is navy, then the hover background color should be turquoise, and the text should be navy.

Example:

Example:
.btn-primary:hover {
    background-color: #00C6D7;
    color: #182b49;
    
#### Standard content sections

- White
- Sand
- Navy
- Blue when appropriate

#### Tiles

- Navy
- Blue
- Yellow
- Turquoise

#### Standard links

- Blue

#### Expressive accents

- Magenta
- Citron
- Orange
- Green

Do not expose all brand colors as arbitrary variants for every component.

---

### Core composition

Most interfaces should be composed primarily from:

- White
- Sand
- Navy
- UC San Diego Blue

Use Yellow for focused emphasis.

Use Turquoise and the remaining accent colors selectively.

Use the following hierarchy:

1. Foundational surfaces
   - White
   - Sand
2. Primary brand and structure
   - Navy
   - Blue
3. High emphasis
   - Yellow
   - Gold
4. Expressive accents
   - Turquoise
   - Magenta
   - Citron
   - Orange
   - Green
5. Supporting neutrals
   - Cool Gray
   - Stone
   - Black

Core colors should dominate the visual composition.

Accent colors should reinforce the UC San Diego visual identity, never replace it.

---

### Reference implementation: UC San Diego Department Website

Use the UC San Diego Department Website as the primary reference for proper page-level application of the color system:

https://department.ucsd.edu/

The site demonstrates how brand colors should establish hierarchy and rhythm across an entire page rather than being distributed evenly or used decoratively.

#### Overall composition

The Department Website is primarily composed from:

- White
- Sand
- UC San Diego Navy
- UC San Diego Blue

Yellow and other accent colors occupy smaller areas and provide emphasis or graphic interest.

Neutral surfaces carry most of the content, while Navy and Blue establish UC San Diego identity.

#### White as the default surface

The Department Website uses White as the primary content surface.

Use White for:

- Standard content sections
- Reading-heavy content
- Cards and informational areas
- Areas where photography or typography should receive the visual emphasis

Do not give every section a colored background.

Most ordinary content should remain on White.

#### Sand for subtle section separation

The Department Website uses Sand to differentiate light sections without introducing another saturated color.

Use Sand to:

- Separate neighboring content groups
- Create a lightly emphasized section
- Provide visual rhythm between White sections
- Support modules that need more distinction without strong brand emphasis

White and Sand should generally occupy more page area than saturated colors.

#### Navy for major structural emphasis

The Department Website uses Navy for strong branded and structural moments.

Use Navy for:

- Major branded sections
- Hero or feature areas
- Strong visual anchors
- Dark modules
- Persistent structural elements

Use white text on Navy.

Do not make every module Navy. Dark sections should be separated by lighter White or Sand surfaces.

#### Blue for active and medium-emphasis elements

The Department Website uses UC San Diego Blue for interaction and secondary branded emphasis.

Use Blue for:

- Links
- Buttons and interactive elements
- Selected content boxes
- Selected tiles
- Medium-emphasis branded surfaces
- Overlays when Navy would be unnecessarily heavy

Maintain this hierarchy:

1. Navy for strong structural emphasis
2. Blue for active or medium emphasis
3. Yellow and other accents for focused attention

#### Yellow for focused emphasis

On the Department Website, Yellow occupies a relatively small portion of the composition and is used to draw attention.

Use Yellow for:

- Calls to action
- Small graphic details
- Selected tiles
- Brand graphics
- Areas that need immediate attention

Do not use Yellow as a general section background or as a substitute for Navy or Blue.

#### Turquoise and other accents

The Department Website demonstrates that accent colors should remain secondary to the core palette.

Turquoise may be used selectively for additional variation.

Magenta, Citron, Orange, and Green should be even more selective.

Use expressive accents primarily for:

- Brand graphics
- Illustrations
- Photography treatments
- Campaign-specific elements
- Data visualization
- Occasional bounded components

Do not introduce accent colors merely to make a page appear more colorful.

#### Page rhythm

Follow the Department Website's general pattern of alternating neutral and branded surfaces.

Good examples:

`White → Sand → White → Navy → White`

`White → Navy → White → Sand → White`

Avoid sequences such as:

`Navy → Blue → Yellow → Turquoise → Navy`

Large adjacent saturated sections weaken hierarchy and reduce the visual impact of individual brand colors.

---

### Reference implementation: UC San Diego Modules Website

Use the UC San Diego Modules Website as the primary reference for proper color application within CMS modules and content patterns:

https://department.ucsd.edu/modules/

The Modules Website demonstrates that modules use constrained, predefined color combinations rather than allowing every brand color to be applied arbitrarily.

#### Module color usage

Examples include:

- Text Block → Navy background with white text
- Callout Content → Blue or Navy content boxes
- Call to Action → White or Sand background
- Tiles with Links → Blue, navy, yellow, or turquoise
- Standard content → White
- Alternate light section → Sand

Use only approved color variants for each module.

Do not expose the entire UC San Diego palette as interchangeable options for every module.

#### Module composition

When combining several modules on one page:

- Avoid placing several saturated modules directly next to one another.
- Separate dark or highly saturated modules with White or Sand where appropriate.
- Use Navy for the strongest branded moments.
- Use Blue for secondary branded emphasis.
- Use Yellow or Turquoise selectively within bounded modules.
- Keep the overall page visually dominated by White, Sand, Navy, and Blue.

---

### Photography and color

Photography should remain an important part of the composition rather than competing with excessive colored surfaces.

When text appears over photography:

- Use Blue or Navy overlays when necessary for readability.
- Ensure text maintains sufficient contrast across the entire image.
- Prefer approved overlays and treatments rather than arbitrary opacity or color combinations.
- Avoid adding unnecessary saturated backgrounds around photography.

Brand color should support photography, not overwhelm it.

---

### Page-level rule

When creating a UC San Diego departmental page, use the Department Website as the visual reference:

https://department.ucsd.edu/

Apply color in this order:

1. Begin with White as the default canvas.
2. Add Sand where light section separation is needed.
3. Introduce Navy at major branded or structural moments.
4. Use Blue for interaction and secondary branded emphasis.
5. Add Yellow or other accent colors only where focused visual emphasis is needed.

The finished page should be recognizable as UC San Diego primarily because of its consistent use of Navy, Blue, White, and Sand—not because every available brand color appears on the page.

---

### Accessibility

- All foreground and background combinations must meet the required WCAG contrast ratio for their content type.
- Never rely on color alone to communicate meaning, state, selection, error, success, or required information.
- Interactive states must include a non-color indication when needed.
- Text over images must maintain sufficient contrast across the entire text area.
- Use overlays when necessary to make text over photography consistently readable.
- Do not assume that two approved brand colors automatically form an accessible combination.
- Validate each foreground/background pairing independently.


### Additional color information

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

## Typography

Two faces, both from the UCSD brand library.

- **Brix Sans** is the working face, carried by `type.body.*`, `type.h3` and `type.btn`. All body copy, all UI, all labels. Neutral, high legibility at small sizes, unremarkable in the way a working face should be.
- **Refrigerator Deluxe** is the display face, carried by `type.h1`, `type.h2` and `type.eyebrow`. Condensed and tall. **Headings and hero type only — never body copy, never anything set at a reading size.** Its whole value is scale contrast; used small it is simply hard to read.

Both are licensed faces, not open webfonts. Confirm the web licence before shipping either.

Eyebrow text is always rendered in uppercase through the component style.
Do not rely on authors to manually capitalize eyebrow content.
Use the eyebrow role for short contextual labels that sit above a heading,
such as audience, category, section type, or content context.

### Font fallbacks

Because Brix Sans and Refrigerator Deluxe are licensed faces, generated and prototype implementations must include fallback font stacks for environments where the UC San Diego brand fonts are unavailable.

Use the following fallback order:

- **Refrigerator Deluxe** → **Teko** → a condensed sans-serif system fallback.
- **Brix Sans** → **Source Sans** → **Roboto** → a general sans-serif system fallback.

The fallback order is part of the typography contract. Do not substitute a different fallback simply because another font is available.

Use the same fallback stack anywhere a typography role uses the corresponding brand face so that headings, body text, buttons, labels and other UI remain consistent when the licensed font cannot load.

Recommended CSS stacks:

```css
font-family: "Refrigerator Deluxe", "Teko", "Arial Narrow", Arial, sans-serif;
font-family: "Brix Sans", "Source Sans", "Roboto", Arial, Helvetica, sans-serif;
```

Fallbacks should preserve the intended role of the primary face as closely as possible, but they do not redefine the typography tokens. The UC San Diego brand font remains the preferred face whenever it is available.

### The roles

Type is organised by **role**, not by an abstract scale: `type.h1`, `type.h2`, `type.h2-small`, `type.h3`, `type.subheading`, `type.eyebrow`, `type.btn`, and `type.body` at small, medium and large.

The role names echo HTML tags, but the mapping is not automatic. Pick the role by the visual weight the content needs, then choose the heading *element* for the document outline independently — a section heading on a dense listing page may want `h3` styling under an `<h2>`.

Every role carries its size **and** its line height. They cannot be mismatched, and you should never set a line height by hand.

**Trust modest steps.** The ramp is close-spaced by design. A section heading roughly half again the size of body text is doing enough work; the pull toward a hero heading several times body size is a marketing-site reflex that reads as loud here.

**Weight does the rest.** Each role carries its own weight, running regular through heavy. Use at most two weights in a single view. Bold is an emphasis tool, not a heading default.

### Reading

Long-form content is constrained to `container.prose`, a measure chosen for readability rather than to fill the viewport. Content pages, article bodies and any sustained prose use it. Resist widening it to balance a layout; a full-width paragraph is harder to read at every viewport size.

## Layout

One spacing scale, based on a four-unit step, used for margin, padding and gap alike. There is no separate inset/stack split — one scale referenced everywhere is what keeps two frameworks from drifting a pixel apart.

Spacing steps carry their pixel value in the name — `space.xxs` through `space.xxxl`. Both frameworks' numeric utilities are built on the same step, so `.p-4` in Bootstrap, `p-4` in Tailwind and `space.md` are one value reached three ways. The alignment holds across the full scale.

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

**Cards are not elevated by default.** A card is a surface change and a padding contract. Reach for `color.surface.2` and let space do the grouping. A page of drop-shadowed cards is the single most common way generated UI drifts off-brand: it reads as a SaaS dashboard, and it flattens the actual hierarchy by giving every region the same visual weight.

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

The UC San Diego Hero module has six canonical presentation variants.

Generated implementations should select from these established variants rather
than inventing new hero compositions.

The six canonical variants are:

1. Image with light text and optional headline break
2. Blue Orb pre-canned background with light text
3. Yellow pre-canned background with dark text
4. Navy pre-canned background with light text
5. Image with translucent text box
6. Image with gradient

These variants share the same Hero module anatomy. They differ in background,
text treatment, and optional style modification.

Do not interpret these as six unrelated hero components.

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

#### Variant 5: Image with translucent text box

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

#### Variant 6: Image with gradient

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
