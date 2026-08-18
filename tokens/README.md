# tokens/ — source of truth

Two halves, and the split is the point.

## `figma/` — owned by the designer

**Do not hand-edit.** Written by `npm run sync:figma` from the Figma export in `figma-export/`. A hand edit is silently overwritten by the next sync, and will have caused Figma and code to disagree in the meantime.

To change a value: change it in Figma, export, sync, review the PR.

| File | Figma collection | Tier |
|---|---|---|
| `brand.json` | `colors-brand` | The raw brand palette. Literal values; the bottom of the stack. |
| `primitive.json` | `colors-primitive` | 50–900 ramps. The `-500` steps alias `brand`. |
| `semantic.light.json` / `semantic.dark.json` | `colors-semantic` | What components bind to. Every value aliases a primitive. |
| `layout.json` | `layout` | Radius and the spacing scale. |
| `typography.json` | `typography` | Type roles — h1, body/small, button — with size, line-height, weight, family. |

## `code/` — owned by engineering

Hand-written, and the sync never touches it. These exist because **Figma Variables support only Color, Number, String and Boolean** — there is no shadow type and no easing type, so they cannot be design variables at all.

| File | Why it is here |
|---|---|
| `layout.json` | Breakpoints are a Bootstrap contract, not a design decision. Containers have no Figma equivalent. The derived radius steps Bootstrap's component API needs sit here too. |
| `effects.json` | Shadows live in Figma as **effect styles**, not variables; easings have no variable type at all. If the designer changes a shadow, transcribe it here by hand. |

## `known-issues.json`

Defects in the Figma file that are accepted for now, so the gate can stay green while design fixes them upstream. A debt ledger, not a mute button — `scripts/validate-tokens.mjs` fails if an entry stops matching, so a fixed issue must be deleted from the file.

## `bridge-exceptions.json`

Published tokens that deliberately bind into **no** framework surface (no Bootstrap variable, Tailwind namespace, or shadcn slot) and ship only as `var(--ucsd-*)`. `scripts/audit-bridges.mjs` fails when a published token is neither bound nor listed here — that is how a new Figma token is forced to get a downstream home — and, like `known-issues.json`, it fails on stale entries too.

## The tier rule

```
brand  →  primitive  →  semantic  →  your component
         (ramps)      (light/dark)
```

Components bind to **semantic** only. A component pointing at `palette.*` or `brand.*` hard-codes a brand decision and breaks dark mode, and the validation gate rejects it. See [`../docs/token-naming-contract.md`](../docs/token-naming-contract.md).
