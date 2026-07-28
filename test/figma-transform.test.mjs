/**
 * Tests for the Figma -> DTCG transform.
 *
 * The sync had never been executed when it was first written, and a review found
 * four logic bugs in it. These tests exercise the transform against a synthetic
 * API payload so the mapping is verified without a Figma account or Enterprise plan.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { transform, toHex, slug, formatFloat } from '../scripts/lib/figma-transform.mjs';

/** Minimal builder for a `meta` payload shaped like the Figma Variables API. */
function meta({ collections, variables }) {
  return {
    variableCollections: Object.fromEntries(collections.map((c) => [c.id, c])),
    variables: Object.fromEntries(variables.map((v) => [v.id, v])),
  };
}

const PRIMITIVES = {
  id: 'C1', name: '1. Primitives',
  defaultModeId: 'm0', modes: [{ modeId: 'm0', name: 'Value' }],
};
const SEMANTIC = {
  id: 'C2', name: '2. Semantic',
  defaultModeId: 'mL', modes: [{ modeId: 'mL', name: 'Light' }, { modeId: 'mD', name: 'Dark' }],
};
const COMPONENT = {
  id: 'C3', name: '3. Component',
  defaultModeId: 'm0', modes: [{ modeId: 'm0', name: 'Value' }],
};

const blue500 = {
  id: 'V1', name: 'palette/blue/500', variableCollectionId: 'C1', resolvedType: 'COLOR',
  valuesByMode: { m0: { r: 0, g: 0.384, b: 0.608, a: 1 } },
};
const blue300 = {
  id: 'V2', name: 'palette/blue/300', variableCollectionId: 'C1', resolvedType: 'COLOR',
  valuesByMode: { m0: { r: 0.4, g: 0.639, b: 0.788, a: 1 } },
};
const actionPrimary = {
  id: 'V3', name: 'color/action/primary', variableCollectionId: 'C2', resolvedType: 'COLOR',
  description: 'Primary interactive fill.',
  valuesByMode: {
    mL: { type: 'VARIABLE_ALIAS', id: 'V1' },
    mD: { type: 'VARIABLE_ALIAS', id: 'V2' },
  },
};

describe('helpers', () => {
  test('toHex drops a fully opaque alpha channel', () => {
    assert.equal(toHex({ r: 0, g: 0.384, b: 0.608, a: 1 }), '#00629b');
  });

  test('toHex keeps a partial alpha channel', () => {
    assert.equal(toHex({ r: 1, g: 1, b: 1, a: 0.5 }), '#ffffff80');
  });

  test('slug normalises spaces and punctuation', () => {
    assert.equal(slug('Dark Mode'), 'dark-mode');
    assert.equal(slug('  Light  '), 'light');
  });

  test('formatFloat units by type', () => {
    assert.equal(formatFloat(16, 'dimension'), '16px');
    assert.equal(formatFloat(0, 'dimension'), '0');
    assert.equal(formatFloat(200, 'duration'), '200ms');
    assert.equal(formatFloat(600, 'fontWeight'), 600);
  });
});

describe('file routing matches the committed tokens/ layout', () => {
  // The original bug: filenames were derived from the token root, producing
  // semantic/radius.json alongside the existing semantic/layout.json, so every
  // non-colour token ended up defined twice.
  const payload = meta({
    collections: [PRIMITIVES, SEMANTIC, COMPONENT],
    variables: [
      blue500, blue300, actionPrimary,
      { id: 'V4', name: 'radius/md', variableCollectionId: 'C2', resolvedType: 'FLOAT', valuesByMode: { mL: 4, mD: 4 } },
      { id: 'V5', name: 'space/4', variableCollectionId: 'C2', resolvedType: 'FLOAT', valuesByMode: { mL: 16, mD: 16 } },
      { id: 'V6', name: 'text/md/size', variableCollectionId: 'C2', resolvedType: 'FLOAT', valuesByMode: { mL: 16, mD: 16 } },
      { id: 'V7', name: 'breakpoint/md', variableCollectionId: 'C2', resolvedType: 'FLOAT', valuesByMode: { mL: 768, mD: 768 } },
      { id: 'V8', name: 'button/radius', variableCollectionId: 'C3', resolvedType: 'FLOAT', valuesByMode: { m0: 4 } },
    ],
  });
  const { files, problems } = transform(payload);

  test('no problems for a well-formed file', () => {
    assert.deepEqual(problems, []);
  });

  test('writes only the files the build already globs', () => {
    assert.deepEqual([...files.keys()].sort(), [
      'component/button.json',
      'primitive/color.json',
      'semantic/color/dark.json',
      'semantic/color/light.json',
      'semantic/layout.json',
      'semantic/space.json',
      'semantic/typography.json',
    ]);
  });

  test('radius and breakpoint share semantic/layout.json', () => {
    const layout = files.get('semantic/layout.json');
    assert.equal(layout.radius.md.$value, '4px');
    assert.equal(layout.breakpoint.md.$value, '768px');
  });

  test('aliases are preserved as references, not flattened to literals', () => {
    assert.equal(files.get('semantic/color/light.json').color.action.primary.$value, '{palette.blue.500}');
    assert.equal(files.get('semantic/color/dark.json').color.action.primary.$value, '{palette.blue.300}');
  });

  test('descriptions carry through', () => {
    assert.equal(
      files.get('semantic/color/light.json').color.action.primary.$description,
      'Primary interactive fill.',
    );
  });

  test('non-colour semantics take the default mode only, not one file per mode', () => {
    assert.ok(!files.has('semantic/layout.dark.json'));
    assert.equal(files.get('semantic/space.json').space['4'].$value, '16px');
  });
});

describe('problems are reported instead of crashing or writing', () => {
  test('a dangling alias is collected, not thrown', () => {
    const payload = meta({
      collections: [SEMANTIC],
      variables: [{
        id: 'V9', name: 'color/text/default', variableCollectionId: 'C2', resolvedType: 'COLOR',
        valuesByMode: {
          mL: { type: 'VARIABLE_ALIAS', id: 'DOES_NOT_EXIST' },
          mD: { type: 'VARIABLE_ALIAS', id: 'DOES_NOT_EXIST' },
        },
      }],
    });
    // Must not throw.
    const { problems } = transform(payload);
    assert.ok(problems.some((p) => p.includes('alias points at unknown variable DOES_NOT_EXIST')));
  });

  test('a semantic colour authored as a literal is rejected', () => {
    const payload = meta({
      collections: [SEMANTIC],
      variables: [{
        id: 'VA', name: 'color/text/default', variableCollectionId: 'C2', resolvedType: 'COLOR',
        valuesByMode: { mL: { r: 0, g: 0, b: 0, a: 1 }, mD: { r: 1, g: 1, b: 1, a: 1 } },
      }],
    });
    const { problems } = transform(payload);
    assert.ok(problems.some((p) => p.includes('must alias a primitive')));
  });

  test('an unmapped token root is an error, not a stray new file', () => {
    const payload = meta({
      collections: [SEMANTIC],
      variables: [{
        id: 'VB', name: 'opacity/50', variableCollectionId: 'C2', resolvedType: 'FLOAT',
        valuesByMode: { mL: 0.5, mD: 0.5 },
      }],
    });
    const { files, problems } = transform(payload);
    assert.equal(files.size, 0);
    assert.ok(problems.some((p) => p.includes('unmapped root "opacity"')));
  });

  test('mode names that do not slug to light/dark are rejected', () => {
    const oddModes = {
      id: 'C2', name: '2. Semantic', defaultModeId: 'mL',
      modes: [{ modeId: 'mL', name: 'Light Mode' }, { modeId: 'mD', name: 'Dark Mode' }],
    };
    const payload = meta({
      collections: [oddModes, PRIMITIVES],
      variables: [blue500, { ...actionPrimary, valuesByMode: { mL: { type: 'VARIABLE_ALIAS', id: 'V1' }, mD: { type: 'VARIABLE_ALIAS', id: 'V1' } } }],
    });
    const { files, problems } = transform(payload);
    assert.ok(!files.has('semantic/color/light mode.json'), 'must not write a filename with a space');
    assert.ok(problems.some((p) => p.includes('is not supported')));
  });

  test('a single-mode semantic collection gets a clear message', () => {
    const oneMode = {
      id: 'C2', name: '2. Semantic', defaultModeId: 'mL', modes: [{ modeId: 'mL', name: 'Light' }],
    };
    const payload = meta({
      collections: [oneMode, PRIMITIVES],
      variables: [blue500, {
        id: 'VC', name: 'color/action/primary', variableCollectionId: 'C2', resolvedType: 'COLOR',
        valuesByMode: { mL: { type: 'VARIABLE_ALIAS', id: 'V1' } },
      }],
    });
    const { problems } = transform(payload);
    assert.ok(problems.some((p) => p.includes('need both a Light and a Dark mode')));
  });

  test('repeated structural problems are collapsed to one line', () => {
    const payload = meta({
      collections: [SEMANTIC],
      variables: ['a', 'b', 'c'].map((k, i) => ({
        id: `VD${i}`, name: `opacity/${k}`, variableCollectionId: 'C2', resolvedType: 'FLOAT',
        valuesByMode: { mL: 0.5, mD: 0.5 },
      })),
    });
    const { problems } = transform(payload);
    const unmapped = problems.filter((p) => p.includes('unmapped root'));
    assert.equal(unmapped.length, 3, 'one per distinct variable name, not one per mode');
    assert.equal(new Set(problems).size, problems.length, 'no duplicates');
  });
});
