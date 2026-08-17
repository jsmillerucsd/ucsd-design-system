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
 * Namespaces NOT listed here (spacing, radius, shadow, text, font) intentionally
 * keep Tailwind's defaults as a fallback, because our scales are deliberately
 * sparse and removing them would break common utilities like `rounded-full`.
 * Those defaults are re-pointed at UCSD values instead — see BRIDGED_DEFAULTS.
 */
const RESET_NAMESPACES = ['color', 'breakpoint'];

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
  ['--radius-sm', 'radius.rounded-4'],
  ['--radius-md', 'radius.rounded-8'],
  ['--radius-lg', 'radius.rounded-12'],
  ['--radius-xl', 'radius.rounded-12'],
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
];

/** Token path prefix -> Tailwind namespace. Order matters: first match wins. */
const NAMESPACE_MAP = [
  { prefix: ['color'],      ns: 'color',      drop: 1 },
  { prefix: ['space'],      ns: 'spacing',    drop: 1 },
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

export const tailwindTheme = {
  name: 'css/ucsd-tailwind-theme',
  format: ({ dictionary }) => {
    const lines = [];
    const seen = new Set();

    const val = (t) => t.$value ?? t.value;
    const byPathValue = new Map(dictionary.allTokens.map((t) => [t.path.join('.'), t]));

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
    const bodyFace = val(byPathValue.get('type.body.font-family') ?? {});
    const fallbackFor = (token) => {
      const kind = val(token) === bodyFace ? 'sans' : 'display';
      const stack = byPathValue.get(`type.fallback.${kind}`);
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
    const byPath = new Map(dictionary.allTokens.map((t) => [t.path.join('.'), t]));
    const bridged = BRIDGED_DEFAULTS.map(([twVar, tokenPath]) => {
      const token = byPath.get(tokenPath);
      if (!token) {
        throw new Error(
          `tailwind-theme: BRIDGED_DEFAULTS maps ${twVar} to the token "${tokenPath}", ` +
            `which does not exist. Update the mapping in formats/tailwind-theme.mjs.`,
        );
      }
      return `  ${twVar}: var(--${token.name});`;
    });

    return [
      '/**',
      ' * UCSD Design System — Tailwind v4 theme.',
      ' * GENERATED by @ucsd/tokens. Do not edit.',
      ' *',
      ' * Usage:',
      ' *   @import "tailwindcss";',
      ' *   @import "@ucsd/tokens/css";       // defines --ucsd-* (light + dark)',
      ' *   @import "@ucsd/tokens/tailwind";  // maps them into Tailwind utilities',
      ' */',
      '',
      '@theme {',
      '  /* Drop Tailwind\'s own palette and breakpoints so only UCSD values exist. */',
      ...RESET_NAMESPACES.map((ns) => `  --${ns}-*: initial;`),
      '',
      '  /* Re-point the scales we deliberately keep, so Tailwind\'s own numeric',
      '     utilities (p-4, rounded-md, h-9) land on UCSD values instead of its. */',
      ...bridged,
      '',
      ...lines.sort(),
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
