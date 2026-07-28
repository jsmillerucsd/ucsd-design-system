# @ucsd/registry — shadcn registry

React/Next.js components, distributed as a **shadcn registry** rather than an npm component package.

```bash
npx shadcn@latest add https://design.ucsd.edu/r/button.json
```

Teams get the source in their repo and own it.

## Why a registry instead of a versioned package

A versioned React component library makes the design system team the bottleneck for every product's edge case, and every consumer eventually needs a variant nobody anticipated. Forks and wrappers accumulate, and the "shared" library stops being shared.

The registry model gives teams code they can modify, while the design system still owns the starting point and — more importantly — the tokens underneath it. Visual consistency comes from `@ucsd/tokens`, which the copied component references; it does not depend on the component code staying identical.

Bonus: shadcn ships a registry MCP server, so coding agents can enumerate and pull UCSD components with no custom tooling from us.

## Status

**Phase 5** — not started. Scaffold only. Sequenced after the Bootstrap 5 theme; see `docs/figma-pipeline.md` §9.

## Structure when built out

```
packages/registry/
├── registry.json              index consumed by the shadcn CLI
├── button/
│   ├── button.tsx             the component
│   └── button.figma.tsx       Figma Code Connect mapping
├── card/
└── ...
```

Publishing: the docs site serves each entry at `https://design.ucsd.edu/r/<name>.json`.

## Rules for components added here

1. Tokens only — no literal colours or spacing. Use the Tailwind utilities from `@ucsd/tokens/tailwind`.
2. Keep the Radix primitive underneath. It carries focus management, keyboard handling and ARIA that hand-rolled replacements reliably lose.
3. Variant names match the design system (`primary`, `secondary`, `ghost`, `danger`), not Tailwind colour names.
4. Keep `focus-visible:ring-*`. Focus styling is a requirement.
5. Minimum interactive height 44px for primary actions (WCAG 2.2 target size).
6. Ship a Code Connect mapping so Figma Dev Mode shows this component instead of generated markup.
