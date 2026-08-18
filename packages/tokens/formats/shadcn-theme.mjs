/**
 * Style Dictionary format: the shadcn/ui variable bridge.
 *
 * shadcn components do not reference UCSD tokens. They reference shadcn's own
 * contract — `--background`, `--primary`, `--destructive`, `--ring`, `--radius` —
 * which `npx shadcn init` normally fills with its stock palette. Without a bridge,
 * `npx shadcn add button` produces a component that is entirely off-system and does
 * not respond to dark mode, which is precisely the "tokens aren't applied" failure.
 *
 * This is the Tailwind-side sibling of packages/bootstrap/scss/_bridge.scss, and it
 * is hand-written for the same reason: WHICH UCSD token backs which shadcn slot is a
 * design decision, not a mechanical transform. What the build adds is a guarantee
 * that every token named on the right actually exists — a typo or a Figma rename
 * fails `npm run build` instead of shipping a var() that resolves to nothing.
 *
 * Dark mode needs no second block. Each slot points at a UCSD semantic token, and
 * those re-alias under the dark selector in tokens.css, so the whole bridge follows.
 */

/**
 * shadcn slot -> UCSD token path.
 *
 * Every mapping is sourced from DESIGN.md. The line numbers in comments refer to
 * the generated DESIGN.md and are approximate (prose shifts between builds).
 *
 * Pairs are kept adjacent because shadcn uses them as pairs; a fill from one row
 * with a label from another is how contrast failures get in.
 */
const MAP = [
  ['section', 'Surfaces'],
  // DESIGN.md: surface.1 is "Default content surface and primary page canvas."
  ['background', 'color.surface.1'],
  ['foreground', 'color.foreground.body-text'],

  // DESIGN.md line 427: Cards listed under White (surface.1). A card is
  // differentiated by its border and padding, not by a surface change or
  // shadow (line 1066: "Cards are not elevated by default").
  ['card', 'color.surface.1'],
  ['card-foreground', 'color.foreground.body-text'],
  ['popover', 'color.surface.1'],
  ['popover-foreground', 'color.foreground.body-text'],

  ['section', 'Controls'],
  // DESIGN.md components block: button-primary = btn.primary (Yellow) +
  // btn.label-primary (Navy). shadcn's --primary is the default button fill.
  ['primary', 'color.component.btn.primary'],
  ['primary-foreground', 'color.component.btn.label-primary'],
  // DESIGN.md components block: button-secondary = btn.secondary (Blue) +
  // btn.label-secondary (White).
  ['secondary', 'color.component.btn.secondary'],
  ['secondary-foreground', 'color.component.btn.label-secondary'],
  // DESIGN.md: Sand (surface.2) is "Primary alternate light surface" for
  // "Areas requiring subtle separation from White." shadcn's --muted is the
  // secondary surface (table headers, tabs bg, skeleton).
  ['muted', 'color.surface.2'],
  ['muted-foreground', 'color.component.menu'],
  // DESIGN.md line 996: "using error as an accent because it looks good is a
  // bug." --accent is the hover/active surface for ghost buttons, dropdown
  // items, sidebar nav — NOT a feedback color. surface.2 (Sand) is the
  // correct neutral alternate.
  ['accent', 'color.surface.2'],
  ['accent-foreground', 'color.foreground.body-text'],
  // DESIGN.md: "Status colors always appear as a color.system.bg-* background
  // with its matching color.system.foreground-* half." shadcn's destructive/
  // success/warning are SOLID fills (not bg-* tints), so they use the solid
  // system color + a designed button label token. Warning uses label-black
  // (black on orange = 8.7:1). Success also uses label-black (black on green
  // = ~6.5:1 in both modes — white on green fails at 3.7:1).
  ['destructive', 'color.system.error'],
  ['destructive-foreground', 'color.component.btn.label-white'],
  ['success', 'color.system.success'],
  ['success-foreground', 'color.component.btn.label-black'],
  ['warning', 'color.system.warning'],
  ['warning-foreground', 'color.component.btn.label-black'],
  // DESIGN.md line 715: "Standard links → Blue." shadcn's link variant reads
  // text-primary, which would be Yellow (invisible). Exposing --link lets
  // consumers override the link variant to text-link. See docs/using/nextjs.md.
  ['link', 'color.component.link'],

  ['section', 'Lines and focus'],
  // DESIGN.md line 1082: "Borders are hairlines." card-border (#d4d5d5) is
  // the light gray used for card/input/separator borders.
  ['border', 'color.foreground.card-border'],
  ['input', 'color.foreground.card-border'],
  // DESIGN.md line 1098: "a visible focus ring drawn from color.theme.secondary."
  ['ring', 'color.theme.secondary'],

  ['section', 'Charts — five distinguishable on-brand hues, in recommended order'],
  ['chart-1', 'color.theme.secondary'],
  ['chart-2', 'color.theme.accent'],
  ['chart-3', 'color.theme.primary'],
  ['chart-4', 'color.component.btn.turqoise'],
  ['chart-5', 'color.component.btn.orange'],

  ['section', 'Sidebar — its own slot set; omitting these breaks the component outright'],
  ['sidebar', 'color.surface.2'],
  ['sidebar-foreground', 'color.foreground.body-text'],
  // DESIGN.md components block: button-primary is the affirmative action. The
  // sidebar CTA is a primary button, so it uses the same fill/label pair.
  ['sidebar-primary', 'color.component.btn.primary'],
  ['sidebar-primary-foreground', 'color.component.btn.label-primary'],
  // Same reasoning as --accent: hover surface, not a feedback color.
  ['sidebar-accent', 'color.surface.2'],
  ['sidebar-accent-foreground', 'color.foreground.body-text'],
  ['sidebar-border', 'color.foreground.card-border'],
  ['sidebar-ring', 'color.theme.secondary'],
];

/**
 * The corner radius shadcn components read directly as `var(--radius)`.
 *
 * theme.css also sets --radius (via BRIDGED_DEFAULTS) to the same token, so the
 * `rounded` utility and shadcn's `var(--radius)` agree. The --radius-sm/md/lg/xl
 * steps are likewise bridged in theme.css from the UCSD radius scale.
 */
const RADIUS = 'radius.rounded-8';

/** Slot rows only, with the `section` separators dropped. */
const slots = MAP.filter(([slot]) => slot !== 'section');

/** Motion tokens behind the accordion animation block below. */
const MOTION = ['motion.duration.base', 'motion.easing.enter', 'motion.easing.exit'];

/**
 * Every UCSD token path this bridge depends on. cssVar() throws on any entry
 * that stops resolving, and scripts/audit-bridges.mjs reads this list to know
 * what the shadcn surface covers.
 */
export const shadcnTokenPaths = [...slots.map(([, path]) => path), RADIUS, ...MOTION];

export const shadcnTheme = {
  name: 'css/ucsd-shadcn-theme',
  format: ({ dictionary }) => {
    const byPath = new Map(dictionary.allTokens.map((t) => [t.path.join('.'), t]));

    const cssVar = (tokenPath) => {
      const token = byPath.get(tokenPath);
      if (!token) {
        throw new Error(
          `shadcn-theme: mapped to the token "${tokenPath}", which does not exist. ` +
            `Update MAP in formats/shadcn-theme.mjs.`,
        );
      }
      return `var(--${token.name})`;
    };

    const width = Math.max(...slots.map(([slot]) => slot.length)) + 2;
    const pad = (s) => s.padEnd(width);

    const rootLines = MAP.flatMap(([slot, value]) =>
      slot === 'section'
        ? ['', `  /* ${value} */`]
        : [`  --${pad(slot + ':')} ${cssVar(value)};`],
    );

    const themeLines = slots.map(([slot]) => `  --color-${pad(slot + ':')} var(--${slot});`);

    return [
      '/**',
      ' * UCSD Design System — shadcn/ui bridge.',
      ' * GENERATED by @ucsd/tokens. Do not edit; change MAP in formats/shadcn-theme.mjs.',
      ' *',
      ' * Import AFTER the Tailwind theme, which resets --color-* to initial:',
      ' *   @import "tailwindcss";',
      ' *   @import "@ucsd/tokens/css";',
      ' *   @import "@ucsd/tokens/tailwind";',
      ' *   @import "@ucsd/tokens/shadcn";   // <- this file',
      ' *',
      ' * Then `npx shadcn add button` renders on UCSD colours, in both modes, unchanged.',
      ' * Do NOT add a `.dark` block: every slot points at a semantic token that already',
      ' * re-aliases in dark mode. A second block here would freeze one mode in place.',
      ' */',
      '',
      ':root {',
      ...rootLines.slice(1), // drop the leading blank from the first section marker
      '',
      '  /* Components that read the corner radius directly. The rounded-* steps are',
      '     bridged in theme.css from this same scale — do not restate them here. */',
      `  --${pad('radius:')} ${cssVar(RADIUS)};`,
      '}',
      '',
      '/* `inline` so the utilities resolve straight through to the --ucsd-* layer',
      '   rather than adding another hop. */',
      '@theme inline {',
      ...themeLines,
      '',
      '  /* shadcn\'s Accordion animates via --animate-accordion-*, which its own',
      '     setup gets from the tw-animate-css package. Provided here instead, on',
      '     the UCSD motion tokens, so the documented three imports are complete',
      '     and the curve matches the rest of the system: enter decelerates,',
      '     exit accelerates. */',
      `  --animate-accordion-down: accordion-down ${cssVar('motion.duration.base')} ${cssVar('motion.easing.enter')};`,
      `  --animate-accordion-up: accordion-up ${cssVar('motion.duration.base')} ${cssVar('motion.easing.exit')};`,
      '',
      '  @keyframes accordion-down {',
      '    from { height: 0; }',
      '    to { height: var(--radix-accordion-content-height); }',
      '  }',
      '  @keyframes accordion-up {',
      '    from { height: var(--radix-accordion-content-height); }',
      '    to { height: 0; }',
      '  }',
      '}',
      '',
      "/* The base layer shadcn's own `init` writes into globals.css. Tailwind v4's",
      '   bare `border` utility sets only border-width, so without this every',
      '   card/input/separator border falls back to currentColor (text-coloured',
      '   borders). Our docs tell consumers to DELETE the init-generated globals in',
      '   favour of this bridge, so the bridge must carry the layer. Emitted as the',
      "   compiled CSS rather than @apply so it cannot depend on utility resolution",
      '   order. */',
      '@layer base {',
      '  * {',
      '    border-color: var(--border);',
      '    outline-color: color-mix(in oklab, var(--ring) 50%, transparent);',
      '  }',
      '}',
      '',
    ].join('\n');
  },
};
