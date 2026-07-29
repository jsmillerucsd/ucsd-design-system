# DESIGN.md prose sources

These files are the **hand-written** half of the root [`DESIGN.md`](../../DESIGN.md). They are concatenated, in filename order, beneath generated YAML frontmatter by `scripts/generate-design-md.mjs`.

Filename order is the [DESIGN.md spec's](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md) required section order. Renaming or reordering these files will trip the linter's `section-order` rule.

| Section | What it carries |
|---|---|
| [`01-overview.md`](01-overview.md) | The brand reference and register. **The highest-leverage file here** — and the one still awaiting design sign-off. |
| [`02-colors.md`](02-colors.md) | Colour roles, why the palette is restrained, how dark mode works |
| [`03-typography.md`](03-typography.md) | The two faces, when the display face is allowed, reading measure |
| [`04-layout.md`](04-layout.md) | Spacing scale, breakpoints, containers, composition |
| [`05-elevation.md`](05-elevation.md) | Depth as structure, and why cards aren't elevated |
| [`06-shapes.md`](06-shapes.md) | Radius language, borders, photography treatment |
| [`07-components.md`](07-components.md) | Buttons, forms, navigation, status — the token bindings |
| [`08-dos-and-donts.md`](08-dos-and-donts.md) | **The canonical rules.** `llms.txt` and the skill extract this section verbatim; nothing else restates it. |

## The one rule

**Prose names tokens. It never contains their values.**

No hex colors. No `px` / `rem` / `em` dimensions. No numeric font sizes. Write "the `color.component.btn-primary` fill" or "the largest type role" — never the number.

This is enforced: `scripts/generate-design-md.mjs` scans these files for literal values outside fenced code blocks and fails the build. Fenced code blocks are exempt, so usage examples still work.

The reason is drift. Values live in exactly one place — Figma, via `tokens/` — and reach `DESIGN.md` through the generated frontmatter. A value restated in prose is a second copy that nothing keeps honest, and a confidently stale hex is worse than no documentation. Prose that carries no values cannot go stale. See [google-labs-code/design.md#16](https://github.com/google-labs-code/design.md/issues/16), where this convention was worked out.

## Why prose at all

From the format's own [PHILOSOPHY.md](https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md):

> The prose is where the design lives. Everything else in the document exists to support it.
>
> The quality of a generated design is determined less by the precision of its values than by how clearly the intent is described.

Tokens tell an agent what our blue is. They cannot tell it that we are a public research university and not a Series B startup. That is what these files are for, and it is the part that determines whether generated output feels like UCSD or merely uses UCSD's colors.

Two things worth internalising before editing:

- **A specific reference beats a list of adjectives.** "Modern, clean, trustworthy, premium" describes a region, and a model will land in the generic centre of it. A concrete referent describes a point, and carries its own constraints.
- **Negative constraints arrive for free with a good reference.** Name the object and the model already knows what the object is not. A long rambling "don'ts" list usually means the reference was too vague to carry them.
