import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn's standard class merger. Every vendored component imports it, and it is
 * what lets a call site override a component's own classes without editing the
 * component — the escape hatch docs/using/nextjs.md rule 6 points at.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
