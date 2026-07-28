# Working from Figma

When you have a Figma frame — via Dev Mode MCP, a screenshot, or a pasted spec — the design is the **visual** answer. It is not the implementation answer.

## What Figma output is and isn't authoritative for

| Authoritative | Not authoritative |
|---|---|
| Layout structure and hierarchy | Absolute positioning (Figma exports it; almost never correct in code) |
| Which component is used where | Generated class names and div nesting |
| Variant / state selection | Raw hex and px values — map to tokens |
| Copy and content | Font stacks and fallbacks — use `font.family.*` |
| Responsive intent (via Auto Layout) | Breakpoints — use 576/768/992/1200/1400 |

## Procedure

1. **Get the variables, not the pixels.** If Dev Mode MCP is available, call `get_variable_defs` on the selection first. It returns the *token names* the designer bound, which map straight to `--ucsd-*`. This is the highest-value step and the most often skipped.
2. **Check for a Code Connect mapping.** `get_code_connect_map` tells you whether the component already exists in code. If it does, use that component — do not regenerate it from the frame.
3. **Translate remaining literals to tokens.** Any hex or px left over: look it up in `generated/tokens.md`. If a value has no token, don't invent one — flag it. An unmapped value is usually either a designer error or a genuine gap worth raising.
4. **Rebuild the layout in flow.** Auto Layout → flexbox/grid. Fixed frame widths → container tokens and responsive classes. Discard absolute positioning unless the design genuinely calls for overlay.
5. **Add what the frame can't show:** focus states, keyboard behaviour, error and empty states, loading states, reduced-motion. A static frame shows one state of many; the rest are your responsibility, not omissions by the designer.
6. **Validate.**
   ```bash
   node skills/ucsd-design-system/scripts/validate.mjs <files>
   ```

## Mapping Figma names to tokens

Designers author against the same naming contract, so names line up directly:

| Figma variable | Token | CSS |
|---|---|---|
| `color/action/primary` | `color.action.primary` | `var(--ucsd-color-action-primary)` |
| `space/4` | `space.4` | `var(--ucsd-space-4)` |
| `radius/md` | `radius.md` | `var(--ucsd-radius-md)` |

If you see a **primitive** binding in the output (`blue/500`, `palette/*`), that's a design-file defect: the designer bound a component to the paint box instead of a semantic token. Use the semantic token that matches and mention it — it will otherwise break dark mode.

## Dark mode

Figma frames usually show one mode. Don't build light-only. Use semantic tokens and both modes work; then check the dark rendering, particularly text over images and any custom-coloured surface.

## What this workflow does not replace

Dev Mode MCP answers *"what does this frame look like?"*. It does not know the system's rules, the layout patterns, or the accessibility contract. Used alone it produces plausible code full of raw hex values. Use it **with** this skill, always.
