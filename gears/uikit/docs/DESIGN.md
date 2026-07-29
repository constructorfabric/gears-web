# UI Kit Gear — Design

Status: proposal
Target: MVP in 1–2 weeks, 3–4 contributors

## Problem

Products across the ecosystem (internal products, external vendors building on Gears, FrontX templates) each assemble their own UI layer from scratch. There is no shared, white-label-friendly set of UI components — and no component source that AI agents can discover and use to generate screens.

## Goals

- A curated set of UI components covering a typical admin application, consumable by any React + Tailwind project.
- White-label by construction: the consumer owns the component code and the theme.
- AI-first: agents (Cursor, Claude Code, and other MCP clients) can list, read, and install components, and compose screens from them.
- Curate, don't write: MVP adapts existing open-source implementations rather than building components from scratch.

## Non-goals (MVP)

- An npm component library with a versioned public API.
- Framework-agnostic components (React + Tailwind is a hard requirement for consumers).
- date-picker, charts, page layout templates, form validation integration (RHF/zod), i18n helpers.
- Storybook (the demo app and usage docs carry the documentation role).
- Migrating existing products. `insight-front` is a potential future consumer, out of scope for MVP.

## Architecture and distribution

The gear is **not an npm library but a shadcn-style component registry**: a set of component sources that consumers pull into their own codebase with the shadcn CLI.

- Gear lives at `gears/uikit/` following the telemetry gear layout:

```
gears/uikit/
├── registry/                component sources — the source of truth
│   ├── ui/                  button.tsx, input.tsx, select.tsx, dialog.tsx ...
│   ├── tokens/              theme.css — CSS variables, light/dark
│   └── registry.json        registry item descriptions
├── demo/                    Vite app: every component live (kitchen sink)
├── docs/                    QUICKSTART, usage guides, this document
├── ai/                      llms.txt, agent usage rules
└── scripts/                 build-registry: generate r/*.json from sources
```

- Component stack: **React 19 + Base UI + Tailwind 4 + CVA**.
- Build: `npx shadcn build` generates static `r/*.json` from `registry.json` + sources. GitHub Actions publishes them to GitHub Pages on push to `main`. No runtime, no server, no npm release cycle — the only artifact is static JSON.
- Consumers configure the registry once in their `components.json`:

```json
{ "registries": { "@gears": "https://constructorfabric.github.io/gears-web/uikit/r/{name}.json" } }
```

and then:

```bash
npx shadcn add @gears/button @gears/dialog
```

The CLI copies the sources into the consumer's project, installs npm dependencies, and adds the required CSS variables. **The code then belongs to the consumer** — no dependency version, no breaking changes, white-label by editing tokens and components in place. Updates are explicit via `shadcn diff`.

### Theme

A single `tokens/theme.css`: semantic-level CSS variables (colors, radii, typography), light/dark via `data-theme` / `prefers-color-scheme`. The MVP visual base is the neutral shadcn style; there is no separate design project — branding happens by editing tokens on the consumer side.

## Component set (MVP, ~18 items)

Priority: a typical admin application can be assembled end to end.

| Group    | Components |
|----------|------------|
| Forms    | `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `label`, `field` (label + error + hint wrapper) |
| Overlays | `dialog`, `dropdown-menu`, `tooltip`, `toast` (sonner) |
| Structure| `card`, `tabs`, `badge`, `separator`, `skeleton` |
| Data     | `table` (primitive markup) |

All items are adaptations of existing code: upstream shadcn/ui and its Base UI ports (MIT). Nothing is written from scratch in the MVP. A composite `data-table` (sorting + cursor pagination per DNA conventions `{ items, page_info }`) is deliberately deferred to the next iteration.

### Licensing

gears-web is Apache 2.0; borrowed shadcn/ui and Base UI port sources are MIT. MIT is compatible but requires attribution: entries in the root `NOTICE` file and/or headers in borrowed files.

## AI layer

- `ai/llms.txt` — a map of the kit for agents: component list with links to usage docs.
- A short usage doc per component (templated): when to use it, anti-patterns, 1–2 composition examples. The same text goes into the `description`/`docs` fields of registry items, where the MCP server exposes it.
- The official shadcn MCP server is used as-is; QUICKSTART documents the configuration for Cursor and Claude Code. Agents can list `@gears` components, read their code, and install them — no custom AI code in the MVP.
- Three composition "recipes" in the docs: a CRUD page with a table, a settings form, a confirmation dialog. These anchor agent-driven screen generation.
- Later (out of MVP scope): registering the kit as a FrontX template AI bundle.

## Testing and acceptance

- **Demo app (kitchen sink)** — every component in every state (variants, sizes, disabled, errors, dark theme) on one or two pages. Built in CI; a broken component fails the build. Also serves as the playground where the acceptance agent builds its screen.
- **No unit tests in MVP** — every item is an adaptation of upstream code; interaction logic lives in Base UI, which is tested upstream. Quality is held by the demo build and the install script.
- **Acceptance criteria:**
  1. A CI script installs every registry item into a clean Vite project via `shadcn add` without errors.
  2. An agent, via the shadcn MCP server, assembles a CRUD screen from kit components from a single prompt.

## Risks

1. **The kit dictates the consumer stack** (React + Tailwind). Acceptable for all three consumer groups; "a UI kit for any framework" is explicitly not the goal.
2. **No forced updates** — a registry fix does not propagate automatically. Acceptable at current scale; `shadcn diff` mitigates.
3. **Dependency on shadcn CLI evolution** — the registry protocol is ours (static JSON), the client tool is not. The format is trivial to read with our own script if ever needed.
4. **State of Base UI ports upstream** should be verified at kickoff — which components are adaptation-ready affects the (currently zero) "write from scratch" budget.

## Delivery plan (small sequential PRs)

1. Gear skeleton + registry build script + CI/publishing.
2. Tokens/theme + first batch of components.
3. Remaining components.
4. AI layer + docs + demo app.
