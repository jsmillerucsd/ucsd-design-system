# Architecture & Decisions

Why this repo is shaped the way it is. Each decision records the alternative rejected, so a future maintainer can tell an intentional choice from an accident.

---

## Context

**Decorator V5** is UCSD's current web design system: Bootstrap 3, jQuery, Glyphicons, Roboto + Teko, distributed as CSS/JS from `cdn.ucsd.edu/developer/decorator/5.0.2/`, with page templates for homepage / blank slate / two-column / three-column.

Constraints driving the replacement:

1. Bootstrap 3 is long past end of life — no security patches, no flexbox/grid, jQuery-dependent.
2. New work targets **Next.js and shadcn/Tailwind** as well as Bootstrap, and the system must serve both without forking the brand.
3. It must also drive **CMS page layouts** — content pages, landing pages, listings.
4. It must be readable by **LLM coding agents**, which are now a primary consumer of design system documentation.
5. The existing branding skill points an agent at a kitchen-sink **URL**, which is lossy, slow, and silently rots.

---

## D1. Tokens are the shared layer, not components

**Decision.** Ship one token source. Ship *separate* component implementations per framework.

**Rejected: a universal component library** (web components, or a React lib wrapped for every framework). Wrapping never produces idiomatic code in the host framework, doubles the API surface, and fights each framework's own conventions. Bootstrap developers want `.btn`; React developers want `<Button>`. Giving each what they expect costs less than making both use a compromise.

**Consequence.** "Consistency" is a build property: every target compiles from the same `tokens.json`, so drift requires actively bypassing the build.

---

## D2. Bootstrap 5 and Tailwind/shadcn are both permanent

**Decision.** Both are first-class, indefinitely. Bootstrap 5 is not a migration waystation.

**Why.** UCSD has a long tail of small server-rendered apps and CMS templates where a `<link>` tag is the right answer and a Node build step is not. Forcing them to Tailwind is a tax with no benefit. Meanwhile Next.js systems genuinely benefit from shadcn's composability.

**Consequence.** Every semantic token must be expressible as a Bootstrap 5 Sass variable *and* a Tailwind `@theme` entry. In practice this constrains the token set toward simple scalars, which is a healthy discipline anyway. Breakpoints must match Bootstrap's exactly (see naming contract).

---

## D3. W3C DTCG as the token format

**Decision.** `$value` / `$type` / `$description` JSON.

**Rejected: Style Dictionary's legacy format** (locks us to one build tool) and **Tokens Studio's native dialect** (locks us to one vendor). DTCG is read by Style Dictionary v4, Tokens Studio, and Figma tooling, so we can swap any one of them without touching the source of truth.

---

## D4. shadcn *registry*, not an npm React component package

**Decision.** Publish `registry.json` + component sources; teams run `npx shadcn add https://design.ucsd.edu/r/button.json`.

**Rejected: `@ucsd/react` as a versioned component package.** A versioned component library makes the design system team the bottleneck for every product's edge case, and every consumer eventually needs a variant we didn't anticipate. The registry model gives teams code they own and can modify, while we still own the starting point and the tokens underneath it.

**Bonus.** shadcn ships a registry MCP server, so agents can already enumerate and pull our components with no custom tooling from us.

**Not built yet.** This is the decision, not the state. `design.ucsd.edu/r/` does not resolve and there is no `packages/registry/` — the stub was removed rather than left to imply otherwise. Sequenced as Phase 5 in [`figma.md`](figma.md). Until it exists, React teams use `@ucsd/tokens` with shadcn's own components; see [`using/nextjs.md`](using/nextjs.md).

---

## D5. The skill is generated, and self-contained

**Decision.** `SKILL.md` is a short hand-written router. Everything else in the skill is generated: `references/generated/` holds the token reference built from `tokens.json`, plus **copies of the agent-relevant docs** (`using/*`, `accessibility`, `migration`, `layouts`), taken at build time from their single home under `docs/`.

**Why copies rather than links.** The guides need to serve a human landing on the repo *and* an agent that may have the skill without the repo. Authoring them twice would drift; linking from the skill breaks the moment it is published standalone. Copying at build time gives one authored source and a self-contained skill, and CI's staleness check over `skills/` catches a stale copy for free. Relative links are flattened to repo paths on the way in, since a link that resolves in `docs/` resolves nowhere in the Skills Library.

**Rejected: the current approach** — a skill that points at `developer.ucsd.edu` URLs. That requires a network fetch per use, burns context on HTML chrome, gives the model no way to verify its output, and goes stale invisibly the moment the site changes.

**Rejected: a fully hand-written skill.** It drifts within one sprint, and a confidently stale hex code is worse than no documentation.

**Why committed rather than gitignored.** The skill must work for anyone who clones the Skills Library with no build step. CI fails if regenerating produces a diff, so committed-and-generated stays honest.

---

## D6. Progressive disclosure in the skill

`SKILL.md` stays under ~150 lines: what the system is, how to choose a stack, the hard rules, and a table of contents. Detail lives in `references/generated/`, loaded only when relevant.

**Why.** Skill frontmatter is always in context; the body loads on trigger; references load on demand. A 2,000-line SKILL.md would consume context on every unrelated task and, past a certain length, models start skimming it. The router pattern keeps the always-on cost near zero.

---

## D7. Layouts are specs, not code

**Decision.** `docs/layouts/*.md` are prose specs with reference markup, not a template package.

**Why.** The CMS, Next.js apps, and static pages all render layouts differently, but they must agree on *anatomy* — which regions exist, what's allowed in each, what the content model fields are, which landmarks are required. That agreement is prose plus a skeleton, not a shared runtime.

---

## D8. One repo

**Decision.** Tokens, packages, layouts, docs and the skill in one repo, npm workspaces.

**Rejected: separate repos per package.** Cross-repo version coordination for a system this size costs more than it saves. One repo means one PR can change a token, its Bootstrap mapping, its docs and the skill together — atomically reviewable.

**Rejected: pnpm.** Not installed on target machines; npm workspaces is sufficient and is one less prerequisite.

---

## D9. Sync is one-way and lands as a pull request

Covered in [`figma.md`](figma.md) §0 and §7. Recorded here because it is the decision most likely to be re-litigated: someone will eventually propose bidirectional sync so engineers can push values back to Figma. The answer is no — it creates a merge-conflict surface between two systems with incompatible conflict models, and in every reported case it ends with a human manually reconciling both.

---

## D10. `DESIGN.md` is the agent front door — generated, not authored

**Decision.** Ship a root [`DESIGN.md`](../DESIGN.md) in Google's [DESIGN.md format](https://github.com/google-labs-code/design.md) as the canonical file we hand any coding agent. Its YAML frontmatter is **generated** from the built tokens; its prose is **hand-written** in `docs/design-md/`. `tokens/` remains the source of truth for values.

**Why another LLM surface.** `SKILL.md` and `llms.txt` each only work if the tool already knows to look for them. DESIGN.md is the zero-config convention — Stitch, Cursor, Copilot, v0, or a contractor with a clone all pick it up with no setup. It is also the first artifact in this repo that states what UCSD should *feel* like, which is the thing that decides whether generated output is on-brand or merely on-palette.

**Rejected: DESIGN.md as the source of truth for values.** This is the obvious reading — the format has a token schema and a linter, and most of the ~14,000 DESIGN.md files on GitHub are the only design artifact their project has. It does not survive contact with this repo:

- The format **has no modes concept** ([#13](https://github.com/google-labs-code/design.md/issues/13), open). It cannot express our light/dark semantic layer, which D9's Figma contract requires and `validate-tokens.mjs` enforces.
- It has **one flat colour map**, collapsing the primitive/semantic/component tiers that make a rebrand a one-line change.
- It would create a **second place a value can be edited**, which is precisely what D9's one-way sync exists to prevent.

The format's authors say the same thing. Its [PHILOSOPHY.md](https://github.com/google-labs-code/design.md/blob/main/PHILOSOPHY.md) states that token values "serve as context and are not rendering instructions," and that the format is explicitly "not trying to reinvent the decades long work established by languages and tools that came before us." The maintainer rejected a PR adding a `design.md import` command on the grounds that DESIGN.md "is meant to capture the intent behind the design and this can't be done statically" — the risk being that "the intent process isn't skipped because tokens were captured." Generating the frontmatter while hand-writing the prose is the shape that respects that.

**Rejected: adding DESIGN.md alongside the existing surfaces unchanged.** That would have made a third copy of the hard rules. Instead the rules now live once, in `docs/design-md/08-dos-and-donts.md`, and reach `llms.txt` and the skill by extraction. This also fixed a latent bug: `llms.txt`'s core rules were a hand-typed literal that could silently disagree with `SKILL.md`, and nothing in CI would have caught it.

**Consequence — the drift rule.** Prose in `docs/design-md/` may name tokens but must never contain their values. Values exist only in generated frontmatter, so the generated half cannot go stale and the hand-written half has no numbers that could. `generate-design-md.mjs` fails the build on a literal hex or dimension outside a code fence. (This is the convention worked out in [#16](https://github.com/google-labs-code/design.md/issues/16), which is the same drift concern applied to the format itself.)

**Known cost.** The spec is at `alpha` and the CLI at `0.4.0`; expect breaking changes. Exposure is near zero *because* the file is generated — a spec bump is an edit to one script, not a migration. CI gates on lint **errors** only; ~35 warnings are expected and permanent, and are enumerated in `.github/workflows/ci.yml`.

---

## D11. The designer's token names win

**Decision.** The sync adopts the Figma file's structure and names as-is. Normalisation is mechanical only: lowercase, spaces to hyphens, and collapsing a leaf that repeats its group (`navy/navy-500` → `navy.500`).

**Context.** This repo was scaffolded with an invented vocabulary — `color.action.primary`, `space.4`, `text.md` — before anyone had seen the real Figma file. The real file turned out to be *more* structured than the guess: four colour tiers rather than three (`colors-brand` → `colors-primitive` ramps → `colors-semantic` light/dark), and a full 50–900 ramp per hue.

**Rejected: a translation layer** mapping his names onto ours (`foreground/body-text` → `color.text.default`). It reads better in the abstract and is a liability in practice — every rename is a place the two vocabularies can drift, and the mapping has to be maintained by whoever least understands both sides. Figma is the source of truth; a source of truth you rename on the way in isn't one.

**Rejected: asking him to rename in Figma.** His component library is already bound to these names. The cost is a rebinding project; the benefit is cosmetic.

**Consequence.** Some names are not what an engineer would choose. Typography is role-based (`type.h1`) rather than scale-based, which this document's own naming contract calls an anti-pattern; spacing is t-shirt sized rather than numeric. Both are coherent, both are what the design library is built on, and `_bridge.scss` absorbs the mismatch where Bootstrap needs numeric keys. The placeholder values that shipped before the first sync were also simply wrong — the real palette has colours we never had (`core/gold`, `accent/magenta`, `accent/citron`) and our `gold` was in fact his `yellow`.

---

## Open questions

| # | Question | Blocks | Default if unanswered |
|---|---|---|---|
| 1 | Which **CMS**? (Drupal / headless / other) | `layouts/` content-model mapping | Write layouts CMS-agnostically with a mapping table per platform |
| 2 | ~~Figma plan tier?~~ **Answered: Professional.** | — | Settled. Variable modes work, and Figma's native DTCG export handles the sync with no plugin or licence ([figma.md §3](figma.md)). The file must sit in a Project, not Drafts. **Code Connect is Organization/Enterprise-only, so it is off the table**; the component naming convention carries that weight instead. |
| 3 | Keep **Teko** as the display face? | `font.family.display` | Carry it forward from Decorator V5 |
| 4 | Icon strategy — Glyphicons are dead | Icon tokens + component | Bootstrap Icons (BS5-native, MIT, ~2,000 glyphs) |
| 5 | Where does this repo live — new GitHub repo, or inside the Skills Library? | CI publish target | Standalone repo; CI copies `skills/` into the Skills Library on release |
| 6 | Is there an existing UCSD Tailwind/shadcn user to pilot with? | Phase 5 priority | Sequence after Bootstrap |
