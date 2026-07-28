# tokens/ — source of truth

**Do not hand-edit these files.** They are written by `npm run sync:figma` from Figma Variables. A hand edit will be silently overwritten by the next sync, and will have already caused Figma and code to disagree in the meantime.

To change a value: change it in Figma, run the sync, review the PR.

## Layout

```
tokens/
├── primitive/          Tier 1 — the paint box. Never referenced by a component.
│   └── color.json
├── semantic/           Tier 2 — what components bind to. Always aliases.
│   ├── color/
│   │   ├── light.json     ← Light mode
│   │   └── dark.json      ← Dark mode, same paths re-aliased
│   ├── space.json
│   ├── typography.json
│   └── layout.json        radius · elevation · motion · breakpoint · container
└── component/          Tier 3 — per-component knobs. Add only on demonstrated need.
    └── button.json
```

Format is [W3C DTCG](https://tr.designtokens.org/) — `$value` / `$type` / `$description`.

## The two rules CI enforces

1. **Semantic tokens are aliases, never literals.** `"{palette.blue.500}"`, not `"#00629b"`. Flattening a token file destroys the ability to theme or rebrand.
2. **Every semantic token exists in both modes.** A token present in `light.json` and absent from `dark.json` fails the build.

Full rules: [`../docs/token-naming-contract.md`](../docs/token-naming-contract.md).

## Current values are placeholders

Everything here is a reasonable-looking placeholder so the build and the docs have something to chew on. `palette.blue.500` (`#00629b`) is the one value confirmed against Decorator V5. **Verify the rest against `brand.ucsd.edu`, and expect the first Figma sync to replace all of it.**
