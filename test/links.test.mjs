/**
 * Every relative link in every committed markdown file resolves, and no doc is
 * orphaned.
 *
 * Docs get merged, renamed and moved; links rot silently when they do, and a
 * design system whose own documentation 404s has a credibility problem before
 * anyone reads a token. This is the cheapest possible guard against that.
 *
 * Orphan detection is the second half: a file nothing links to is a file nobody
 * will find, which is how the duplication this repo just removed accumulated in
 * the first place.
 */

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', 'dist']);

const posix = (p) => p.split(path.sep).join('/');

async function markdownFiles(dir = REPO) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await markdownFiles(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

const exists = (p) => fs.access(p).then(() => true, () => false);

/** Inline links, minus external URLs, anchors, and anything inside a fenced block. */
function linksIn(md) {
  const body = md.replace(/^```[\s\S]*?^```/gm, '');
  return [...body.matchAll(/\[([^\]]*)\]\((?!https?:|mailto:|#)([^)\s]+)\)/g)]
    .map((m) => ({ text: m[1], target: m[2].split('#')[0] }))
    .filter((l) => l.target);
}

let files;
before(async () => { files = await markdownFiles(); });

describe('markdown links resolve', () => {
  test('no broken relative links', async () => {
    const broken = [];
    for (const file of files) {
      const md = await fs.readFile(file, 'utf8');
      for (const { text, target } of linksIn(md)) {
        const resolved = path.resolve(path.dirname(file), target);
        if (!(await exists(resolved))) {
          broken.push(`${posix(path.relative(REPO, file))} → ${target}  [${text}]`);
        }
      }
    }
    assert.deepEqual(broken, [], `broken links:\n  ${broken.join('\n  ')}`);
  });
});

describe('no orphaned docs', () => {
  test('every docs/ page is reachable from README.md', async () => {
    // Breadth-first from the README, following links between markdown files only.
    const start = path.join(REPO, 'README.md');
    const seen = new Set([start]);
    const queue = [start];

    while (queue.length) {
      const file = queue.shift();
      const md = await fs.readFile(file, 'utf8').catch(() => null);
      if (md === null) continue;
      for (const { target } of linksIn(md)) {
        const resolved = path.resolve(path.dirname(file), target);
        if (resolved.endsWith('.md') && !seen.has(resolved) && (await exists(resolved))) {
          seen.add(resolved);
          queue.push(resolved);
        }
      }
    }

    const orphans = files
      .filter((f) => posix(path.relative(REPO, f)).startsWith('docs/'))
      .filter((f) => !seen.has(f))
      .map((f) => posix(path.relative(REPO, f)));

    assert.deepEqual(orphans, [],
      `unreachable from README.md — link them or delete them:\n  ${orphans.join('\n  ')}`);
  });
});
