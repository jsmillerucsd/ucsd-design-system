/**
 * The sidebar-08 block, rendered unmodified.
 *
 * This is a different kind of evidence from shadcn.html. That page is a tour of
 * components I arranged; this is a whole application shell that shadcn ships as a
 * unit — `npx shadcn@latest add sidebar-08` — laid out, composed and classed
 * entirely by them. Nobody here chose which token goes where.
 *
 * It exercises parts of the bridge the component tour cannot: the `--sidebar-*`
 * slot family (its own surface, border, accent and ring, separate from the page
 * chrome), the collapsible rail, the mobile off-canvas sheet, and nested dropdown
 * and tooltip surfaces layered over each other.
 *
 * The only thing added is the mode toggle, which is mounted as a separate root
 * outside the block so the block's own tree stays untouched.
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';

import Page from './blocks/sidebar-08/page';
import { Button } from './components/ui/button';

/** Demo furniture — not part of sidebar-08. */
function ModeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
      <a
        href="./shadcn.html"
        className="text-body-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Component tour
      </a>
      <Button variant="outline" size="sm" aria-pressed={dark} onClick={() => setDark((d) => !d)}>
        {dark ? 'Light mode' : 'Dark mode'}
      </Button>
    </div>
  );
}

if (typeof document !== 'undefined') {
  createRoot(document.getElementById('root')!).render(<Page />);
  createRoot(document.getElementById('controls')!).render(<ModeToggle />);
}

export { Page, ModeToggle };
