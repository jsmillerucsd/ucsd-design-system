/**
 * Style Dictionary format: Tailwind v4 `@theme` block.
 *
 * Tailwind v4 only generates utilities for CSS variables in its own reserved
 * namespaces (--color-*, --spacing-*, --radius-*, --font-*, --text-*, --shadow-*).
 * A token named `--ucsd-color-action-primary` generates nothing; the same value
 * republished as `--color-action-primary` generates `bg-action-primary`,
 * `text-action-primary`, `border-action-primary`, and so on.
 *
 * Most values are emitted as `var(--ucsd-*)` on purpose: the utility then resolves
 * through tokens.css at runtime, so Tailwind classes follow dark mode automatically
 * with no `dark:` variant and no second theme block. Breakpoints are the exception
 * — see LITERAL_NAMESPACES.
 *
 * Two things this file cannot express, documented here so nobody rediscovers them:
 *
 *   - `max-w-prose` is a STATIC Tailwind utility hard-coded to 65ch. It wins over
 *     `--container-prose` no matter what we put in the theme, and `@utility` cannot
 *     override it either (both rules emit; core comes last). So `container.prose`
 *     (70ch) is unreachable through that class. `max-w-prose` is on the banned list;
 *     the documented idiom is `max-w-[--ucsd-container-prose]`.
 *   - Tailwind has ONE `font-*` utility fed by both `--font-*` (family) and
 *     `--font-weight-*`. Emitting both for a role makes the family win and silently
 *     strands the weight, so role weights ride along on `--text-<role>--font-weight`
 *     instead — see TYPE_LEAF.
 */

/**
 * Namespaces that must be emitted as literal values rather than var() references.
 *
 * Tailwind inlines breakpoint values into media query CONDITIONS, and CSS does not
 * permit custom properties there: `@media (width >= var(--ucsd-breakpoint-md))` is
 * invalid and never matches, which would silently break every `md:` / `lg:` utility.
 * Everything else lands in a property position, where var() is fine.
 */
import { darkVariant } from '../dark-selector.mjs';

const LITERAL_NAMESPACES = new Set(['breakpoint']);

/**
 * Tailwind namespaces we replace wholesale, resetting its defaults to `initial`.
 *
 * Without this, Tailwind's built-in palette stays available and `bg-blue-500`
 * compiles happily while ignoring dark mode — contradicting the documented rule
 * that only UCSD semantic colours may be used. Same for breakpoints: Tailwind's
 * default `2xl` (1536px) would survive alongside our `xxl` (1400px).
 *
 * `text`, `font` and `container` are reset AND selectively re-emitted below:
 * the type roles plus the bridged xs–2xl steps, the UCSD faces and the weight
 * ramp, and the UCSD container widths. What is not re-emitted then does not
 * compile at all — `text-5xl`, `font-serif`, `max-w-4xl` — which is the point:
 * the design defines no such sizes, faces or measures.
 *
 * `spacing`, `radius` and `shadow` are NOT reset, because their stock utilities
 * are re-pointed wholesale at UCSD values via BRIDGED_DEFAULTS (`p-4` is 16px of
 * OUR scale) and removing the namespaces would break `rounded-full`, numeric
 * gaps, and every stock shadcn class for no fidelity gain.
 */
const RESET_NAMESPACES = ['color', 'breakpoint', 'text', 'font', 'container'];

/**
 * Tailwind's own numeric/t-shirt scales, re-pointed at UCSD tokens.
 *
 * Without this, `p-4`, `rounded-md`, `h-9` and friends compile happily against
 * Tailwind's stock 4px spacing base and 0.375rem radii — off-system values that
 * look plausible and are invisible in review. Every stock shadcn component ships
 * with exactly those classes, so leaving them unbridged is the single largest
 * source of "the tokens aren't being applied".
 *
 * `--spacing` is the multiplier behind the whole numeric scale (`p-4` is
 * `calc(var(--spacing) * 4)`). At 4px it makes Tailwind `p-1`…`p-4` identical to
 * Bootstrap `.p-1`…`.p-4` — the claim DESIGN.md already makes. Beyond 4 the two
 * diverge (Bootstrap jumps 16 -> 24 -> 32, Tailwind keeps stepping by 4), which is
 * why the named steps (`p-lg-24`, `p-xxl-48`) remain the way to say it exactly.
 *
 * Radius follows _bridge.scss so a card is the same shape in both frameworks.
 *
 * Values are token PATHS, resolved against the dictionary at build time: rename a
 * token and this throws rather than emitting a dangling var().
 */
const BRIDGED_DEFAULTS = [
  ['--spacing',   'space.xxs-4'],
  // The rule for stock steps beyond the designed scale: CLAMP to the nearest
  // designed value when the result degrades gracefully (a 4xl radius rendered
  // at 12px is still a rounded corner), and let the namespace RESET kill the
  // utility when silence would look broken (text-6xl rendered at 24px reads as
  // a bug, so it does not compile at all — see RESET_NAMESPACES).
  //
  // Radius: 0/4/8/12 and circle/pill are the only corner shapes that exist
  // (DESIGN.md shapes section), so the whole stock ladder clamps onto them.
  ['--radius-xs', 'radius.rounded-4'],
  ['--radius-sm', 'radius.rounded-4'],
  ['--radius-md', 'radius.rounded-8'],
  ['--radius-lg', 'radius.rounded-12'],
  ['--radius-xl', 'radius.rounded-12'],
  ['--radius-2xl', 'radius.rounded-12'],
  ['--radius-3xl', 'radius.rounded-12'],
  ['--radius-4xl', 'radius.rounded-12'],
  // DESIGN.md: "Cards are not elevated by default" and "shadow is for things
  // that float and can be dismissed." shadcn's Card has `shadow-sm` hardcoded;
  // mapping it to elevation.0 (none) means cards render flat per the contract.
  // shadow-sm and shadow-xs both → elevation.0 to match _bridge.scss's
  // $box-shadow-sm = elevation.1 ONLY for $box-shadow (used by modals/dropdowns,
  // not by the `shadow-sm` utility). The utility and the Sass var are different
  // scales: Tailwind's shadow-sm ≈ Bootstrap's $box-shadow-sm is a naming
  // coincidence, not a contract. What matters is that `shadow-sm` on a card
  // produces no shadow, and `shadow-lg` on a dialog produces elevation.3.
  ['--shadow-2xs', 'elevation.0'],
  ['--shadow-xs', 'elevation.0'],
  ['--shadow-sm', 'elevation.0'],
  ['--shadow-md', 'elevation.2'],
  ['--shadow-lg', 'elevation.3'],
  ['--shadow-xl', 'elevation.4'],
  ['--shadow-2xl', 'elevation.4'],
  // Motion. Tailwind's stock curves are generic Material-era beziers; the UCSD
  // set is designed (tokens/code/effects.json). The mapping follows the physics:
  // ease-out decelerates into place, which is what an ENTERING surface does;
  // ease-in accelerates away, which is an EXIT. `transition` with no modifier
  // gets the standard curve and base duration in both frameworks — Bootstrap's
  // $transition-base compiles from the same two tokens.
  ['--ease-in', 'motion.easing.exit'],
  ['--ease-out', 'motion.easing.enter'],
  ['--ease-in-out', 'motion.easing.standard'],
  ['--default-transition-duration', 'motion.duration.base'],
  ['--default-transition-timing-function', 'motion.easing.standard'],
  // Stock font-weight utilities carry the same numbers as the Figma weight ramp;
  // re-pointing them makes the provenance real (a Figma weight change flows
  // through) instead of a numeric coincidence.
  ['--font-weight-thin', 'weight.thin'],
  ['--font-weight-extralight', 'weight.extra-light'],
  ['--font-weight-light', 'weight.light'],
  ['--font-weight-normal', 'weight.regular'],
  ['--font-weight-medium', 'weight.medium'],
  ['--font-weight-semibold', 'weight.semi-bold'],
  ['--font-weight-bold', 'weight.bold'],
  ['--font-weight-extrabold', 'weight.extra-bold'],
  ['--font-weight-black', 'weight.black'],
  // Tailwind's stock type scale, re-pointed at the UCSD ramp. The designed ramp
  // is sparse (12/14/18/24), so the stock steps snap to the nearest role:
  // `text-sm` lands on the 14px UI-label size (the `button` role, which is what
  // stock shadcn markup means by text-sm), `text-base`/`text-lg` on body-md,
  // `text-xl`/`text-2xl` on body-lg. Steps above 2xl are NOT bridged — the
  // namespace reset makes them compile to nothing, and the validator's banned
  // list (derived from these rows via `bridgedTextSteps`) says why.
  ['--text-xs', 'type.body-sm.font-size'],
  ['--text-xs--line-height', 'type.body-sm.line-height'],
  ['--text-sm', 'type.button.font-size'],
  ['--text-sm--line-height', 'type.button.line-height'],
  ['--text-base', 'type.body-md.font-size'],
  ['--text-base--line-height', 'type.body-md.line-height'],
  ['--text-lg', 'type.body-md.font-size'],
  ['--text-lg--line-height', 'type.body-md.line-height'],
  ['--text-xl', 'type.body-lg.font-size'],
  ['--text-xl--line-height', 'type.body-lg.line-height'],
  ['--text-2xl', 'type.body-lg.font-size'],
  ['--text-2xl--line-height', 'type.body-lg.line-height'],
];

/**
 * The stock text-* steps the rows above re-point. Exported so the validator's
 * banned list is COMPUTED as the complement of this set rather than maintained
 * as a parallel roster that goes stale the day a step is bridged.
 */
export const bridgedTextSteps = new Set(
  BRIDGED_DEFAULTS.map(([v]) => v.match(/^--text-([a-z0-9]+)$/)?.[1]).filter(Boolean),
);

/**
 * Every token path this theme binds OUTSIDE the namespace mapping — the bridged
 * defaults plus the fallback stacks that fallbackFor() appends (it throws when
 * they are missing, so listing them here cannot drift). scripts/audit-bridges.mjs
 * combines this with tailwindName() to know what the Tailwind surface covers,
 * instead of grepping the generated CSS.
 */
export const tailwindBoundPaths = new Set([
  ...BRIDGED_DEFAULTS.map(([, p]) => p),
  'type.fallback.sans',
  'type.fallback.display',
]);

/** Token path prefix -> Tailwind namespace. Order matters: first match wins. */
const NAMESPACE_MAP = [
  { prefix: ['color'],      ns: 'color',      drop: 1 },
  { prefix: ['space'],      ns: 'spacing',    drop: 1 },
  // Icon sizes ride the spacing namespace with their prefix kept (drop: 0), so
  // `size-icon-sm-8` / `w-icon-lg-16` exist. Tailwind has no icon namespace of
  // its own; spacing is what feeds the size-*/w-*/h-* utilities.
  { prefix: ['icon'],       ns: 'spacing',    drop: 0 },
  { prefix: ['radius'],     ns: 'radius',     drop: 1 },
  { prefix: ['elevation'],  ns: 'shadow',     drop: 1 },
  { prefix: ['breakpoint'], ns: 'breakpoint', drop: 1 },
  { prefix: ['container'],  ns: 'container',  drop: 1 },
];

/**
 * Typography leaf -> Tailwind namespace.
 *
 * The Figma typography collection is a set of named roles (h1, body/small, button)
 * each carrying several properties, so the mapping keys off the LAST segment and
 * uses everything between `type` and it as the utility name: `type.body.small.font-size`
 * becomes `--text-body-small`, pairing with `--text-body-small--line-height`.
 *
 * Properties with no Tailwind namespace — word-spacing, paragraph-spacing, and the
 * per-role `background` colour — are intentionally absent. They still reach code as
 * `var(--ucsd-type-*)`; they just do not generate utilities.
 *
 * Weight and tracking hang off `--text-<role>--*` rather than getting namespaces of
 * their own. `--font-weight-h1` would generate `.font-h1`, the same class the family
 * token generates, and the family would win — so the weight would silently never
 * apply. Riding on the text namespace also matches the rule in DESIGN.md: a role
 * carries its size, line height and weight together and they cannot be mismatched.
 * One class, `text-h1`, now sets all three.
 */
const TYPE_LEAF = {
  'font-size':   (n) => `--text-${n}`,
  'line-height': (n) => `--text-${n}--line-height`,
  'font-family': (n) => `--font-${n}`,
  'font-weight': (n) => `--text-${n}--font-weight`,
  'tracking':    (n) => `--text-${n}--letter-spacing`,
};

const startsWith = (path, prefix) => prefix.every((seg, i) => path[i] === seg);

/**
 * Returns the Tailwind variable name for a token, plus whether it needs a literal
 * value. Null means the token is intentionally not exposed as a utility.
 *
 * `text.md.size` / `text.md.line-height` need bespoke handling: Tailwind pairs them
 * with the `--text-<size>--line-height` convention.
 *
 * Exported so scripts/generate-skill-references.mjs can derive its documentation
 * hints from the same mapping rather than maintaining a parallel copy.
 * `token.path` is an array of segments.
 */
export function tailwindName(token) {
  const path = token.path;

  if (path[0] === 'type') {
    const make = TYPE_LEAF[path.at(-1)];
    const role = path.slice(1, -1).join('-');
    return make && role ? { name: make(role), literal: false } : null;
  }

  for (const { prefix, ns, drop } of NAMESPACE_MAP) {
    if (startsWith(path, prefix)) {
      const rest = path.slice(drop).join('-');
      if (!rest) return null;
      return { name: `--${ns}-${rest}`, literal: LITERAL_NAMESPACES.has(path[0]) };
    }
  }
  return null; // primitives and component tokens are not utilities
}

/**
 * A value that already ends in a CSS generic family needs no appended fallback —
 * that is what "complete stack" means, derived from the value rather than from
 * the role's name so a rename or a second complete-stack role keeps working.
 */
const GENERIC_FAMILIES = new Set([
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
  'ui-monospace', 'ui-sans-serif', 'ui-serif', 'ui-rounded', 'math',
]);
export const isCompleteStack = (v) =>
  GENERIC_FAMILIES.has(String(v).split(',').at(-1).trim().replace(/^['"]|['"]$/g, '').toLowerCase());

export const tailwindTheme = {
  name: 'css/ucsd-tailwind-theme',
  format: ({ dictionary }) => {
    const lines = [];
    const seen = new Set();

    const val = (t) => t.$value ?? t.value;
    const byPath = new Map(dictionary.allTokens.map((t) => [t.path.join('.'), t]));

    /**
     * Font families need a fallback stack appended, or a page renders in the
     * browser's default SERIF on every machine that has not licensed the UCSD
     * faces — which is all of them until the web licence is confirmed. Bootstrap
     * has always appended one; Tailwind did not, so the two targets degraded
     * completely differently.
     *
     * A role is "display" when its face is not the working body face. That is the
     * definition rather than a guess about the name, so a face change in Figma
     * carries through without editing this file.
     */
    const bodyFace = val(byPath.get('type.body.font-family') ?? {});
    const fallbackFor = (token) => {
      // A value that already ends in a generic family (the mono role) IS the
      // complete stack — appending a fallback would put 'Arial Narrow' after
      // 'monospace', which is never reached but is also never right.
      if (isCompleteStack(val(token))) return '';
      const kind = val(token) === bodyFace ? 'sans' : 'display';
      const stack = byPath.get(`type.fallback.${kind}`);
      if (!stack) {
        throw new Error(
          `tailwind-theme: type.fallback.${kind} is missing. Font stacks are defined ` +
            `in tokens/code/typography.json and are required — without one, text renders in serif.`,
        );
      }
      return `, var(--${stack.name})`;
    };

    for (const token of dictionary.allTokens) {
      const mapped = tailwindName(token);
      if (!mapped || seen.has(mapped.name)) continue;
      seen.add(mapped.name);

      // token.name already carries the `ucsd` prefix from the platform config.
      const value = mapped.literal ? val(token) : `var(--${token.name})`;
      const suffix = token.path.at(-1) === 'font-family' ? fallbackFor(token) : '';
      lines.push(`  ${mapped.name}: ${value}${suffix};`);

      // Tailwind's preflight sets the document font from --font-sans. Re-pointing it
      // at the working face means <body> is correct with no class on it, matching
      // Bootstrap, where $font-family-sans-serif does the same job.
      if (token.path.join('.') === 'type.body.font-family') {
        lines.push(`  --font-sans: ${value}${suffix};`);
      }
    }

    // Resolve BRIDGED_DEFAULTS against the dictionary so a token rename fails the
    // build here instead of shipping a var() that resolves to nothing.
    const mustGet = (tokenPath) => {
      const token = byPath.get(tokenPath);
      if (!token) {
        throw new Error(
          `tailwind-theme: mapped to the token "${tokenPath}", which does not ` +
            `exist. Update the mapping in formats/tailwind-theme.mjs.`,
        );
      }
      return token;
    };
    const bridged = BRIDGED_DEFAULTS.map(([twVar, tokenPath]) =>
      `  ${twVar}: var(--${mustGet(tokenPath).name});`);

    return [
      '/**',
      ' * UCSD Design System — Tailwind v4 theme.',
      ' * GENERATED by @jsmillerucsd/tokens. Do not edit.',
      ' *',
      ' * Usage:',
      ' *   @import "tailwindcss";',
      ' *   @import "@jsmillerucsd/tokens/css";       // defines --ucsd-* (light + dark)',
      ' *   @import "@jsmillerucsd/tokens/tailwind";  // maps them into Tailwind utilities',
      ' */',
      '',
      '@theme {',
      '  /* Drop Tailwind\'s own palette and breakpoints so only UCSD values exist. */',
      ...RESET_NAMESPACES.map((ns) => `  --${ns}-*: initial;`),
      '',
      '  /* Re-point the scales we deliberately keep, so Tailwind\'s own numeric',
      '     utilities (p-4, rounded-md, h-9, text-sm) land on UCSD values instead',
      '     of its. */',
      ...bridged,
      '',
      ...lines.sort(),
      '}',
      '',
      '/**',
      ' * Body copy is the body-md role (DESIGN.md typography block). Tailwind\'s',
      ' * preflight leaves <body> at the browser default, which is NOT on the ramp;',
      ' * Bootstrap compiles $font-size-base from this same token, so both targets',
      ' * put unclassed body text on the identical designed size.',
      ' */',
      '@layer base {',
      '  body {',
      `    font-size: var(--${mustGet('type.body-md.font-size').name});`,
      `    line-height: var(--${mustGet('type.body-md.line-height').name});`,
      '  }',
      '}',
      '',
      '/**',
      ' * Point `dark:` at the same selector tokens.css uses.',
      ' *',
      " * Tailwind's own `dark:` keys off prefers-color-scheme, which our token layer",
      ' * ignores entirely — so a component would style itself for the OS setting while',
      ' * the colours under it switched on the class. UCSD code should not be writing',
      ' * `dark:` colour variants at all (DESIGN.md), but third-party component source',
      ' * is full of them, and it has to agree with us or it renders for the wrong mode.',
      ' */',
      `@custom-variant dark (&:where(${darkVariant()}));`,
      '',
    ].join('\n');
  },
};
