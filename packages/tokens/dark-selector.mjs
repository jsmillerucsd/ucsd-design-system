/**
 * The one definition of "this subtree is in dark mode".
 *
 * Shared because it has to appear in two places that must never disagree: the
 * scoped custom-property block in tokens.css, and the `dark:` variant in the
 * Tailwind theme. If those drift, third-party component source that carries
 * `dark:` classes styles itself for one mode while the tokens under it switch on
 * the other.
 *
 * Bootstrap 5.3 native + shadcn + generic.
 */
export const DARK_SELECTOR = '[data-bs-theme="dark"], .dark, [data-theme="dark"]';

/** The same selectors as a Tailwind variant: matches the element and its subtree. */
export const darkVariant = () =>
  DARK_SELECTOR.split(',')
    .map((s) => s.trim())
    .flatMap((s) => [s, `${s} *`])
    .join(', ');
