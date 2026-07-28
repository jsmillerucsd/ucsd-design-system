# Layouts & the CMS

Design systems usually stop at components, and then every team invents its own page structure. Since this system also has to drive **CMS templates**, the page level is a first-class part of it.

The patterns themselves live in [`../layouts/`](../layouts/README.md). This document is about how they fit the rest of the system and how to extend them.

---

## The three levels

| Level | Answers | Lives in | Changes |
|---|---|---|---|
| **Tokens** | What does UCSD look like? | `tokens/` | Often — synced from Figma |
| **Components** | What is a button, card, alert? | `packages/` | Sometimes |
| **Layouts** | What is a content page? What may an author put on one? | `layouts/` | Rarely — and each change is a CMS migration |

Layouts change least and cost most to change, because a layout change means re-authoring existing content. Design them conservatively and resist adding new ones.

## Why specs rather than a template package

The CMS, Next.js apps and static pages all render differently. What they must share is **anatomy**: which regions exist, what's allowed in each, the content-model fields, the required landmarks. That's prose plus a reference skeleton.

A shared runtime template would only serve whichever stack it was built for, and would put the design system team in the path of every CMS release. The spec approach keeps the contract portable and the teams independent.

## The content model is the real deliverable

Each pattern carries a content-model table. **That table is the part the CMS team builds against**, and it's the part most often left out of design-system documentation — which is why CMS templates usually drift from the design system within a release or two.

Two rules that carry most of the weight:

- **Constrain in the model, not in CSS.** "Maximum 3 related items" belongs in the content type, where an author gets feedback while writing. Enforced in CSS, it fails silently and the author never learns.
- **Prefer a discriminated union to free rich text** for composed pages. The landing page's `sections` list is a union over six section types, not a page-builder. The constraint is the feature: it's what keeps pages consistent without anyone policing them.

## Rendering a pattern

1. Pick the pattern. If none fits, re-read them — the answer is usually `content-page` with a region turned off.
2. Take the shared chrome from [`layouts/README.md`](../layouts/README.md). Never re-derive the masthead or footer.
3. Copy the reference markup for your stack (each pattern has Bootstrap 5; several have Tailwind).
4. Map the content model to your CMS's field types.
5. Run the validator over the result:
   ```bash
   node skills/ucsd-design-system/scripts/validate.mjs path/to/template.html
   ```

## Adding or changing a pattern

A new pattern needs: a real use case that two or more teams have, a content model, an accessibility section, and reference markup for at least Bootstrap 5. Same review as a token change — one design, one engineering approval.

Changing an existing pattern is a **breaking change** if it adds a required field or removes a region, because published content has to be migrated. Ship those with a migration note, and batch them.

## Open question

⟡ **Which CMS?** The patterns are written CMS-agnostically, with content models expressed in neutral field types. Once the platform is settled, add a mapping table per pattern (field → that platform's field type) and, if the platform supports it, ship the content types as installable config. Tracked as open question 1 in [`architecture.md`](architecture.md).
