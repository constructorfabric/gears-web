# UI Kit Gear — Design

Status: proposal (see issue #7)
Target: MVP in 1–2 weeks, 3–4 contributors

> **Revision note.** The original design distributed the kit as a shadcn-style
> source registry. After review, distribution changed to an npm package — the
> kit's audience is Constructor Fabric ecosystem templates, not white-label
> vendors. See the pivot discussion in issue #7.

## Problem

Front-end templates in the Constructor Fabric ecosystem — from which FrontX and
Studio assemble interfaces — each build their UI layer from scratch. There is no
standard component base for templates, and nothing AI agents can rely on to
generate screens consistently.

## Goals

- A curated set of React components covering a typical admin application, shipped
  as an open-source npm package (working name `@gears/ui-kit`).
- The **standard component base for fabric templates**: one version everywhere,
  fixes and design updates propagate via a dependency bump.
- AI-ready: agents generate screens from the kit using its bundled docs.
- Curate, don't write: MVP adapts existing open-source implementations
  (shadcn/ui and its Base UI ports) rather than building components from scratch.

## Non-goals (MVP)

- White-label theming APIs. Basic branding = overriding CSS-variable tokens;
  deep customization = fork the kit or build the template on another kit.
  Other companies plug their own kits into their own templates.
- Framework-agnostic components (React + Tailwind is a hard requirement).
- `data-table`, date-picker, charts, page layout templates, form validation
  integration (RHF/zod), i18n helpers.
- Storybook (the demo app and usage docs carry the documentation role).
- Migrating existing products. `insight-front` is a potential future consumer,
  out of scope for MVP.

## Architecture and distribution

The gear follows the telemetry gear layout:

```text
gears/uikit/
├── ui-kit/                  npm package @gears/ui-kit
│   ├── src/
│   │   ├── components/      button.tsx, input.tsx, dialog.tsx ...
│   │   ├── styles/          theme.css — CSS variables, light/dark
│   │   └── index.ts         public exports
│   └── package.json         vite lib build + dts, ES modules
├── demo/                    Vite app: every component live (kitchen sink)
├── docs/                    design and usage guides (this document)
├── ai/                      llms.txt, agent usage rules
└── QUICKSTART.md            consumer setup
```

- Component stack: **React 19 + Base UI + Tailwind 4 + CVA**.
- Build mirrors `@gears-web/telemetry`: vite lib mode, ES modules,
  `preserveModules` for per-component tree-shaking, `vite-plugin-dts` for types.
- Publishing to npm on release (workflow added when the first components land);
  CI builds the package on every PR.
- Templates consume it as a regular dependency and may freely mix in other
  components.

### Theme

A single `theme.css` exported as `@gears/ui-kit/theme.css`: semantic-level CSS
variables (colors, radii), light/dark via `data-theme` /
`prefers-color-scheme`. The MVP visual base is the neutral shadcn style;
branding happens by overriding the variables on the consumer side.

### Tailwind styles — open point

Components carry Tailwind utility classes, so the consumer's Tailwind build
must see the package sources:

- **Option 1 (default candidate):** the consumer adds
  `@source "../node_modules/@gears/ui-kit";` to their CSS. One line in the
  template — acceptable for a controlled audience of ecosystem templates.
- **Option 2:** ship precompiled CSS with the package. Heavier build, no
  consumer configuration; revisit if option 1 causes friction.

### Versioning — open point

Semver; what counts as breaking (prop removal, markup/class changes that affect
overrides), how templates pin the kit, and upgrade cadence are to be settled
with template owners before 1.0.

### npm scope — open point

`@gears` has no published packages, but org availability is unverified; the
existing telemetry package lives under `@gears-web`. The package stays
`"private": true` until the scope decision; renaming before first publish is
cheap.

## Component set (MVP, ~18 components)

Priority: a typical admin application can be assembled end to end.

| Group    | Components |
|----------|------------|
| Forms    | `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `label`, `field` (label + error + hint wrapper) |
| Overlays | `dialog`, `dropdown-menu`, `tooltip`, `toast` (sonner) |
| Structure| `card`, `tabs`, `badge`, `separator`, `skeleton` |
| Data     | `table` (primitive markup) |

All components are adaptations of existing code: upstream shadcn/ui and its
Base UI ports (MIT). Nothing is written from scratch in the MVP. A composite
`data-table` (sorting + cursor pagination per DNA conventions
`{ items, page_info }`) is deliberately deferred to the next iteration.

### Licensing

gears-web is Apache 2.0; borrowed shadcn/ui and Base UI port sources are MIT.
MIT is compatible but requires attribution: entries in the root `NOTICE` file
and/or headers in borrowed files.

## AI layer

- `ai/llms.txt` — a map of the kit for agents: component list with links to
  usage docs; shipped in the package so agents find it in `node_modules`.
- A short usage doc per component (templated): when to use it, anti-patterns,
  1–2 composition examples.
- Three composition "recipes" in the docs: a CRUD page with a table, a settings
  form, a confirmation dialog. These anchor agent-driven screen generation.
- The package being open source, doc indexers (e.g. context7) pick it up for
  free; a dedicated MCP server is out of MVP scope.

## Testing and acceptance

- **Demo app (kitchen sink)** — every component in every state (variants,
  sizes, disabled, errors, dark theme) on one or two pages. Built in CI against
  the package; a broken component fails the build. Also serves as the
  playground where the acceptance agent builds its screen.
- **No unit tests in MVP** — every component is an adaptation of upstream code;
  interaction logic lives in Base UI, which is tested upstream. Quality is held
  by the package build (types included) and the demo build.
- **Acceptance criteria:**
  1. CI installs the built package into a clean Vite project and builds a page
     using its components.
  2. An agent assembles a CRUD screen from kit components from a single prompt,
     using the package's bundled docs.

## Risks

1. **The kit dictates the consumer stack** (React + Tailwind). Acceptable for
   ecosystem templates; other companies bring their own kits.
2. **Fork is the only deep-customization path** — a fork diverges wholesale and
   receives no updates. Accepted trade-off: forks are expected to be rare, and
   the standard optimizes for consistency across templates.
3. **Peer-deps and semver discipline** — breaking upgrades must be coordinated
   across templates; mitigated by the versioning policy (open point above).
4. **State of Base UI ports upstream** should be verified at kickoff — which
   components are adaptation-ready affects the (currently zero) "write from
   scratch" budget.

## Delivery plan (small sequential PRs)

1. Gear skeleton + package build + CI.
2. Tokens/theme + first batch of components.
3. Remaining components.
4. AI docs + demo app; npm publishing workflow.
