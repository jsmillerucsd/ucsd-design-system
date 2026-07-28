#!/usr/bin/env node
/**
 * UCSD Design System validator.
 *
 * Checks source files for the failure modes that matter: literal values where a
 * token exists, primitives referenced from component code, Bootstrap 3 leftovers,
 * and a handful of high-signal accessibility misses.
 *
 * The point is that an agent can check its OWN output before presenting it.
 * Models comply with rules they can verify; a rule with no checker is a suggestion.
 *
 *   node skills/ucsd-design-system/scripts/validate.mjs src/**\/*.{css,scss,html,jsx,tsx}
 *
 * Exit code 1 if any error-level finding is present.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BANNED = path.join(HERE, '..', 'references', 'generated', 'banned.json');

let banned = { colors: {}, primitiveHexes: [], space: {}, radius: {}, legacyDecoratorClasses: [] };
try {
  banned = JSON.parse(await fs.readFile(BANNED, 'utf8'));
} catch {
  console.warn('! banned.json not found — run `npm run build` for full checking. Continuing with structural rules only.\n');
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: validate.mjs <files...>');
  process.exit(2);
}

const findings = [];
const add = (file, line, level, rule, msg) => findings.push({ file, line, level, rule, msg });

/** Regions where a literal hex is legitimate: the token definitions themselves. */
const isTokenSource = (f) =>
  f.includes(`${path.sep}tokens${path.sep}`) || f.endsWith('banned.json') || f.includes('dist');

// Lookarounds rather than \b: a hyphen is a non-word character, so \bpanel\b
// matches inside ".custom-panel". Class names must match whole, hyphens included.
const LEGACY_RE = new RegExp(
  `(?<![\\w-])(${banned.legacyDecoratorClasses.map((c) => c.replace(/-/g, '\\-')).join('|')})(?![\\w-])`,
);

for (const file of files) {
  let src;
  try {
    src = await fs.readFile(file, 'utf8');
  } catch {
    add(file, 0, 'error', 'io', 'could not read file');
    continue;
  }
  if (isTokenSource(file)) continue;

  src.split(/\r?\n/).forEach((raw, i) => {
    const n = i + 1;
    const line = raw.trim();
    if (!line || line.startsWith('//') || line.startsWith('*') || line.startsWith('<!--')) return;

    // 1. Literal colours
    for (const m of raw.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      const hex = m[0].toLowerCase();
      const candidates = banned.colors[hex];
      if (candidates?.length) {
        const [first, ...rest] = candidates;
        add(file, n, 'error', 'no-literal-color',
          `${m[0]} is a token value — use var(${first})`
          + (rest.length ? ` (or ${rest.map((c) => `var(${c})`).join(', ')})` : ''));
      } else if (banned.primitiveHexes?.includes(hex)) {
        add(file, n, 'error', 'no-literal-color',
          `${m[0]} is a primitive palette value. Bind to a semantic token (--ucsd-color-*) instead.`);
      } else {
        add(file, n, 'warn', 'unknown-color',
          `${m[0]} is not in the palette. Use a semantic token, or get it added to the system.`);
      }
    }

    // 2. Primitives leaking into component code
    for (const m of raw.matchAll(/--ucsd-palette-[a-z0-9-]+/g)) {
      add(file, n, 'error', 'no-primitive-reference',
        `${m[0]} is a primitive. Bind to a semantic token (--ucsd-color-*) so dark mode and rebranding keep working.`);
    }

    // 3. Literal spacing / radius. Category-aware: a padding of 16px must map to
    //    space.4, never to text.md.size, even though both are 16px.
    for (const m of raw.matchAll(/(padding|margin|gap|row-gap|column-gap|border-radius)[a-z-]*\s*:\s*([^;"']+)/gi)) {
      const map = /radius/i.test(m[1]) ? banned.radius : banned.space;
      for (const px of m[2].matchAll(/\b(\d+px)\b/g)) {
        const token = map[px[1]];
        if (token) {
          add(file, n, 'error', 'no-literal-dimension',
            `${m[1]}: ${px[1]} is a token value — use var(${token})`);
        }
      }
    }

    // 4. Bootstrap 3 / Decorator V5 leftovers
    const legacy = banned.legacyDecoratorClasses.length && raw.match(LEGACY_RE);
    if (legacy) {
      add(file, n, 'error', 'bootstrap3-legacy',
        `"${legacy[1]}" is a Bootstrap 3 class. See references/migration.md.`);
    }

    // 5. Focus suppressed with no replacement
    if (/outline\s*:\s*(none|0)\b/.test(raw) && !/focus-visible/.test(src)) {
      add(file, n, 'error', 'focus-visible',
        'outline removed with no :focus-visible replacement — fails WCAG 2.4.11.');
    }

    // 6. Invented breakpoints
    for (const m of raw.matchAll(/@media[^{]*?(\d{3,4})px/g)) {
      if (!['576', '768', '992', '1200', '1400'].includes(m[1])) {
        add(file, n, 'warn', 'nonstandard-breakpoint',
          `${m[1]}px is not a UCSD breakpoint (576/768/992/1200/1400).`);
      }
    }

    // 7. Images without alt
    if (/<img\b/.test(raw) && !/\balt\s*=/.test(raw)) {
      add(file, n, 'error', 'img-alt', '<img> without alt attribute.');
    }
  });
}

// --- report ------------------------------------------------------------------

const errors = findings.filter((f) => f.level === 'error');
const warns = findings.filter((f) => f.level === 'warn');

if (findings.length === 0) {
  console.log(`✓ ${files.length} file(s) clean.`);
  process.exit(0);
}

for (const f of findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
  const tag = f.level === 'error' ? 'ERROR' : ' WARN';
  console.log(`${tag}  ${f.file}:${f.line}  [${f.rule}] ${f.msg}`);
}

console.log(`\n${errors.length} error(s), ${warns.length} warning(s) across ${files.length} file(s).`);
process.exit(errors.length > 0 ? 1 : 0);
