## Elevation & Depth

Depth is **structural, not atmospheric**. Hierarchy comes from surface change and space first, from borders second, and from shadow last.

`elevation.*` is a short ladder from flat to a high float, tuned as a navy-tinted shadow rather than neutral gray so it sits in the palette instead of muddying it. The ladder is short deliberately — a system with many elevation steps ends up using them decoratively.

Use the ladder for things that genuinely float above the page and can be dismissed: menus, popovers, dialogs, toasts. The rule of thumb is that if it can't be dismissed, it probably isn't elevated.

**Cards are not elevated by default.** A card is a surface change and a padding contract. Reach for `color.surface.2` and let space do the grouping. A page of drop-shadowed cards is the single most common way generated UI drifts off-brand: it reads as a SaaS dashboard, and it flattens the actual hierarchy by giving every region the same visual weight.

In dark mode, shadow carries much less information because there is less luminance range beneath it. Depth there comes primarily from the surface ramp — raised surfaces genuinely lighten. Don't compensate by deepening shadows.

No glassmorphism, no backdrop blur, no glow, no inner shadow, no gradient used to imply depth. The reference building has real shadows because it has real mass; nothing here should simulate depth it doesn't structurally have.
