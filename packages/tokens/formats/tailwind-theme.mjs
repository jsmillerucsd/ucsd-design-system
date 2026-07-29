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
 */

/**
 * Namespaces that must be emitted as literal values rather than var() references.
 *
 * Tailwind inlines breakpoint values into media query CONDITIONS, and CSS does not
 * permit custom properties there: `@media (width >= var(--ucsd-breakpoint-md))` is
 * invalid and never matches, which would silently break every `md:` / `lg:` utility.
 * Everything else lands in a property position, where var() is fine.
 */
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
 */
const RESET_NAMESPACES = ['color', 'breakpoint'];

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
 */
const TYPE_LEAF = {
  'font-size':   (n) => `--text-${n}`,
  'line-height': (n) => `--text-${n}--line-height`,
  'font-family': (n) => `--font-${n}`,
  'font-weight': (n) => `--font-weight-${n}`,
  'tracking':    (n) => `--tracking-${n}`,
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

    for (const token of dictionary.allTokens) {
      const mapped = tailwindName(token);
      if (!mapped || seen.has(mapped.name)) continue;
      seen.add(mapped.name);

      // token.name already carries the `ucsd` prefix from the platform config.
      const value = mapped.literal ? (token.$value ?? token.value) : `var(--${token.name})`;
      lines.push(`  ${mapped.name}: ${value};`);
    }

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
      ...lines.sort(),
      '}',
      '',
    ].join('\n');
  },
};
