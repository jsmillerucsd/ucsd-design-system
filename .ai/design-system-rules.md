# UCSD Design System — rules for AI code assistants

Mirror of `skills/ucsd-design-system/SKILL.md` for tools that read `.ai/` (Cursor, Copilot).
GENERATED — do not edit. Source of truth is the SKILL.md.

Full token reference: `../skills/ucsd-design-system/references/generated/tokens.md`

## Hard rules
1. No raw hex colours. No raw px for spacing/radius. Use `var(--ucsd-*)`, `$ucsd-*`, or the Tailwind utility.
2. Never reference `palette.*` from a component — it breaks dark mode and rebranding.
3. Semantic tokens carry intent: `color-action-primary`, not `palette-blue-500`.
4. Bootstrap 5 only. Bootstrap 3 classes (`panel`, `btn-default`, `glyphicon`, `col-xs-*`) are errors.
5. Dark mode comes free from semantic tokens. Don't hand-write colour overrides.
6. Run `node skills/ucsd-design-system/scripts/validate.mjs <files>` on what you produce.
