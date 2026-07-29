/**
 * Tests for the design-system validator.
 *
 * The validator is what an agent uses to check its own output, so a silent
 * regression here means bad code ships believing it was verified. These tests
 * assert both directions: that violations are caught, and that compliant code
 * is NOT flagged (false positives train people to ignore the tool).
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const VALIDATOR = path.join(HERE, '..', 'skills', 'ucsd-design-system', 'scripts', 'validate.mjs');
const fixture = (n) => path.join(HERE, 'fixtures', n);

async function validate(file) {
  try {
    const { stdout } = await run(process.execPath, [VALIDATOR, file]);
    return { code: 0, out: stdout };
  } catch (e) {
    return { code: e.code, out: e.stdout ?? '' };
  }
}

describe('noncompliant fixture', async () => {
  const { code, out } = await validate(fixture('noncompliant.html'));

  test('exits non-zero', () => {
    assert.equal(code, 1);
  });

  for (const rule of [
    'bootstrap3-legacy',
    'no-literal-color',
    'no-literal-dimension',
    'no-primitive-reference',
    'focus-visible',
    'img-alt',
    'nonstandard-breakpoint',
    'unknown-color',
  ]) {
    test(`flags ${rule}`, () => {
      assert.ok(out.includes(`[${rule}]`), `expected [${rule}] in:\n${out}`);
    });
  }

  test('suggests the spacing token for padding, not the type token', () => {
    // 16px is both space.large and radius.lg — the suggestion must be category-aware.
    assert.match(out, /padding: 16px .*--ucsd-space-large/);
    assert.doesNotMatch(out, /padding: 16px .*--ucsd-radius-lg/);
  });

  test('suggests the radius token for border-radius', () => {
    assert.match(out, /border-radius: 12px .*--ucsd-radius-default/);
  });

  test('does not match a legacy class name inside a longer hyphenated class', () => {
    // ".custom-panel" must not trip the Bootstrap 3 "panel" rule.
    assert.doesNotMatch(out, /"panel".*custom/);
  });

  test('ranks the brand colour above its narrower uses for #00629b', () => {
    // #00629b is theme.secondary, btn-secondary, link and two system tokens. A raw
    // hex in someone's CSS is almost always reaching for the brand colour itself.
    assert.match(out, /#00629b is a token value — use var\(--ucsd-color-theme-secondary\)/);
  });

  test('reports every legacy class on a line, not just the first', () => {
    for (const cls of ['well', 'page-header', 'control-label']) {
      assert.ok(out.includes(`"${cls}" is a Bootstrap 3 class`), `missing ${cls} in:\n${out}`);
    }
  });

  test('resolves 3-digit hex shorthand against 6-digit token values', () => {
    // #fff must map to a token, not be dismissed as "not in the palette".
    assert.match(out, /#fff is a token value/);
    assert.doesNotMatch(out, /#fff is not in the palette/);
  });
});

describe('path filtering', () => {
  // A substring test for "dist" would skip these entirely and report them clean —
  // the worst failure mode for a tool an agent uses to check its own work.
  test('does not skip files whose path merely contains "dist"', async () => {
    const { promises: fsp } = await import('node:fs');
    const tmp = fixture('district-map.html');
    await fsp.copyFile(fixture('noncompliant.html'), tmp);
    try {
      const { code, out } = await validate(tmp);
      assert.equal(code, 1, `expected findings in a "district" path, got:\n${out}`);
      assert.match(out, /bootstrap3-legacy/);
    } finally {
      await fsp.rm(tmp, { force: true });
    }
  });
});

describe('compliant fixture', async () => {
  const { code, out } = await validate(fixture('compliant.html'));

  test('exits zero with no findings', () => {
    assert.equal(code, 0, `expected clean, got:\n${out}`);
  });

  test('does not flag var() token usage', () => {
    assert.doesNotMatch(out, /no-literal/);
  });
});
