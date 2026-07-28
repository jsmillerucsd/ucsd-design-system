/**
 * Contract tests for the root DESIGN.md.
 *
 * DESIGN.md is the file we hand to agents that know nothing else about this repo,
 * so the things that must hold are: it says the same thing the tokens say, it
 * never leaks a primitive, it still carries dark mode despite the format having no
 * modes concept, and its prose contains no values that could go stale.
 *
 * Parsing goes through the format's own linter rather than a YAML dependency, so
 * these tests fail if our output stops being parseable by the tool everyone else
 * uses — which is the actual risk, the spec being at `alpha`.
 *
 * Requires `npm run build` first.
 */

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from '@google/design.md/linter';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(REPO, 'packages', 'tokens', 'dist');

let raw, report, ds, manifest, darkManifest;

before(async () => {
  const read = (p) => fs.readFile(p, 'utf8').catch(() => {
    throw new Error(`${path.relative(REPO, p)} missing — run \`npm run build\` first.`);
  });
  raw = await read(path.join(REPO, 'DESIGN.md'));
  manifest = JSON.parse(await read(path.join(DIST, 'tokens.json')));
  darkManifest = JSON.parse(await read(path.join(DIST, 'tokens.dark.json')));
  report = lint(raw);
  ds = report.designSystem;
});

/** `color.action.primary` -> `action-primary`; mirrors colorKey() in the generator. */
const colorKey = (p) => p.slice('color.'.length).replaceAll('.', '-');
const semanticColors = (m) => m.filter((t) => t.tier === 'semantic' && t.path.startsWith('color.'));

describe('the spec is satisfied', () => {
  test('lints with zero errors', () => {
    const errors = report.findings.filter((f) => f.severity === 'error');
    assert.deepEqual(errors, [], `DESIGN.md has lint errors:\n${JSON.stringify(errors, null, 2)}`);
  });

  test('sections appear in the order the spec fixes', () => {
    const headings = [...raw.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    assert.deepEqual(headings, [
      'Overview',
      'Colors',
      'Typography',
      'Layout',
      'Elevation & Depth',
      'Shapes',
      'Components',
      "Do's and Don'ts",
    ]);
  });

  test('every rounded value is a legal Dimension', () => {
    // radius.circle is a percentage, which the linter rejects at error level. It is
    // filtered out by the generator; this pins that it stays filtered, and that no
    // other non-px/em/rem radius sneaks in from a future Figma sync.
    for (const [k, v] of ds.rounded) {
      assert.equal(v.type, 'dimension', `rounded.${k} did not parse as a dimension`);
      assert.match(v.unit, /^(px|em|rem)$/, `rounded.${k} has unit "${v.unit}"`);
    }
    assert.ok(!ds.rounded.has('circle'), 'radius.circle is a percentage and must stay filtered out');
  });
});

describe('it says what the tokens say', () => {
  test('every semantic colour reaches DESIGN.md with the same value', () => {
    for (const t of semanticColors(manifest)) {
      const got = ds.colors.get(colorKey(t.path));
      assert.ok(got, `${t.path} is missing from DESIGN.md colors`);
      assert.equal(got.hex.toLowerCase(), String(t.value).toLowerCase(), `${t.path} disagrees`);
    }
  });

  test('the whole type ramp is present', () => {
    const steps = new Set(
      manifest.filter((t) => /^text\.[^.]+\.size$/.test(t.path)).map((t) => t.path.split('.')[1]),
    );
    assert.deepEqual(new Set(ds.typography.keys()), steps);
  });

  test('the spacing scale is present', () => {
    const scale = manifest.filter((t) => t.path.startsWith('space.')).map((t) => t.path.slice(6));
    assert.deepEqual([...ds.spacing.keys()].sort(), scale.sort());
  });
});

describe('tier discipline survives the projection', () => {
  test('no primitive leaks into DESIGN.md', () => {
    // The hard rule is that components never bind to palette.*. The cheapest way to
    // hold an agent to it is to not put primitives in the file it reads.
    const leaked = [...ds.colors.keys()].filter((k) => k.startsWith('palette'));
    assert.deepEqual(leaked, []);

    for (const t of manifest.filter((x) => x.tier === 'primitive' && x.type === 'color')) {
      assert.ok(
        !raw.includes(`"${t.path}"`) && !raw.includes(`{colors.${t.path}}`),
        `primitive ${t.path} is referenced in DESIGN.md`,
      );
    }
  });

  test('the primary alias resolves to the action colour, not an invented one', () => {
    // Without a bare `primary`, the missing-primary rule warns that agents will
    // auto-generate one — so we alias it rather than let that happen.
    const expected = manifest.find((t) => t.path === 'color.action.primary').value;
    assert.equal(ds.colors.get('primary').hex.toLowerCase(), expected.toLowerCase());
  });

  test('components bind by reference, not by literal', () => {
    assert.deepEqual([...ds.components.keys()].sort(), [
      'button-primary',
      'button-primary-hover',
      'button-secondary',
      'button-secondary-hover',
    ]);
    // Literal hexes inside the components block would mean the binding was flattened
    // and a rebrand would no longer reach the component.
    const componentsBlock = raw.slice(raw.indexOf('components:'), raw.indexOf('breakpoints:'));
    assert.doesNotMatch(componentsBlock, /(backgroundColor|textColor|borderColor):\s*"#/);
  });
});

describe('dark mode survives a format that has no modes', () => {
  test('every semantic colour has a dark value', () => {
    // Mirrors the mode-parity gate in scripts/validate-tokens.mjs. The DESIGN.md spec
    // cannot express modes (google-labs-code/design.md#13), so we carry them in a
    // custom `modes` key — and pin that it stays complete.
    const dark = ds.unknownKeyValues?.modes?.dark?.colors ?? {};
    for (const t of semanticColors(darkManifest)) {
      const key = colorKey(t.path);
      assert.ok(key in dark, `${t.path} is missing from modes.dark.colors`);
      assert.equal(String(dark[key]).toLowerCase(), String(t.value).toLowerCase());
    }
  });

  test('light and dark cover the same roles', () => {
    const dark = new Set(Object.keys(ds.unknownKeyValues?.modes?.dark?.colors ?? {}));
    const light = new Set([...ds.colors.keys()].filter((k) => k !== 'primary'));
    assert.deepEqual([...light].filter((k) => !dark.has(k)), []);
  });
});

describe('the custom keys the base schema lacks', () => {
  test('breakpoints, containers, elevation and motion are all carried', () => {
    for (const key of ['breakpoints', 'containers', 'elevation', 'motion']) {
      assert.ok(ds.unknownKeys.includes(key), `custom key "${key}" is missing`);
    }
  });

  test('breakpoints match Bootstrap exactly', () => {
    // Same value pinned in build-outputs.test.mjs. Repeated here because an agent
    // reading only DESIGN.md would otherwise have no way to be right about this.
    assert.deepEqual(ds.unknownKeyValues.breakpoints, {
      sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1400px',
    });
  });
});

describe('prose cannot go stale', () => {
  test('the body carries no literal token values', () => {
    // The drift defence: values live only in the generated frontmatter, so the
    // hand-written half has no numbers that could fall out of date. Enforced at
    // build time too — this catches a hand-edit of DESIGN.md itself.
    const body = raw.slice(raw.indexOf('\n---', 3) + 4).replace(/^```[\s\S]*?^```/gm, '');
    const found = [
      ...body.matchAll(/#[0-9a-fA-F]{3,8}\b/g),
      ...body.matchAll(/\b\d+(?:\.\d+)?(?:px|rem|em)\b/g),
    ].map((m) => m[0]);
    assert.deepEqual([...new Set(found)], [], 'prose must name tokens, never their values');
  });

  test('the generated block is marked as generated', () => {
    assert.match(raw, /^---\n# GENERATED BLOCK/);
  });
});
