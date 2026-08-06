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
 * Pairs are kept adjacent because shadcn uses them as pairs; a fill from one row
 * with a label from another is how contrast failures get in.
 */
const MAP = [
  ['section', 'Surfaces'],
  ['background', 'color.surface.1'],
  ['foreground', 'color.foreground.body-text'],

  // A shadcn Card is surface.1 with a border, NOT surface.2 — DESIGN.md is explicit
  // that a card is a surface change and a padding contract, and shadcn's own card
  // already carries the border. Using surface.2 here would double the treatment.
  ['card', 'color.surface.1'],
  ['card-foreground', 'color.foreground.body-text'],
  ['popover', 'color.surface.1'],
  ['popover-foreground', 'color.foreground.body-text'],

  ['section', 'Controls'],
  // shadcn's `primary` is the default button fill, so it takes the button token
  // rather than color.theme.primary. Same reasoning as $primary in _bridge.scss:
  // the theme tokens are brand marks and are not all usable as interactive fills.
  ['primary', 'color.component.btn-secondary'],
  ['primary-foreground', 'color.component.btn-label-secondary'],
  ['secondary', 'color.component.btn-tertiary'],
  ['secondary-foreground', 'color.component.btn-label-tertiary'],
  ['muted', 'color.surface.2'],
  ['muted-foreground', 'color.component.menu'],
  ['accent', 'color.system.bg-information'],
  ['accent-foreground', 'color.system.foreground-information'],
  ['destructive', 'color.system.error'],
  ['destructive-foreground', 'color.surface.1'],

  ['section', 'Lines and focus'],
  ['border', 'color.foreground.card-border'],
  ['input', 'color.foreground.subcard-border'],
  // WCAG 2.2 §2.4.11/2.4.13. Change the token, never remove the ring.
  ['ring', 'color.theme.secondary'],

  ['section', 'Charts — five distinguishable on-brand hues, in recommended order'],
  ['chart-1', 'color.theme.secondary'],
  ['chart-2', 'color.theme.accent'],
  ['chart-3', 'color.theme.primary'],
  ['chart-4', 'color.component.btn-turqoise'],
  ['chart-5', 'color.component.btn-orange'],

  ['section', 'Sidebar — its own slot set; omitting these breaks the component outright'],
  ['sidebar', 'color.surface.2'],
  ['sidebar-foreground', 'color.foreground.body-text'],
  ['sidebar-primary', 'color.theme.primary'],
  ['sidebar-primary-foreground', 'color.foreground.heading-light'],
  ['sidebar-accent', 'color.system.bg-information'],
  ['sidebar-accent-foreground', 'color.system.foreground-information'],
  ['sidebar-border', 'color.foreground.card-border'],
  ['sidebar-ring', 'color.theme.secondary'],
];

/**
 * The corner radius shadcn components read directly as `var(--radius)`.
 *
 * The `--radius-sm/md/lg/xl` steps that `rounded-md` and friends compile against are
 * deliberately NOT set here — theme.css already bridges them from the same UCSD
 * scale. Two sources for one value is how the frameworks drift apart.
 */
const RADIUS = 'radius.rounded-2';

/** Slot rows only, with the `section` separators dropped. */
const slots = MAP.filter(([slot]) => slot !== 'section');

/** Every UCSD token path this bridge depends on. Consumed by the build's guard. */
export const shadcnTokenPaths = [...slots.map(([, path]) => path), RADIUS];

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
      '}',
      '',
    ].join('\n');
  },
};
