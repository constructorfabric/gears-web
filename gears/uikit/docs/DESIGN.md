# UI Kit Gear — Design

Status: in development (see issue #7)
Target: MVP in 1–2 weeks, 3–4 contributors

> **Revision notes.**
> 1. The original design distributed the kit as a shadcn-style source registry;
>    it was changed to an npm package — the audience is Constructor Fabric
>    ecosystem templates, not white-label vendors (see issue #7).
> 2. The kit was then slated to move into the gears-frontx monorepo, but the
>    move is blocked on [gears-frontx#495](https://github.com/constructorfabric/gears-frontx/issues/495)
>    (where do published runtime libraries live in the FrontX architecture).
>    The MVP is built here in gears-web, unpublished, and moves later. The
>    styling stack changed with that review: **CSS Modules instead of
>    Tailwind**, Base UI confirmed over Radix.

## Problem

Front-end templates in the Constructor Fabric ecosystem — from which FrontX and
Studio assemble interfaces — each build their UI layer from scratch. There is no
standard component base for templates, and nothing AI agents can rely on to
generate screens consistently.

## Goals

- A curated set of React components covering a typical admin application,
  shipped as an npm package (gears-web-phase name `@gears-web/ui-kit`).
- The **standard component base for fabric templates**: one version everywhere,
  fixes and design updates propagate via a dependency bump.
- Self-contained styling: the package ships its own compiled CSS; consumers
  need no CSS framework, preprocessor, or build plugins.
- AI-ready: agents generate screens from the kit using its bundled docs.
- Curate, don't write: behavior comes from Base UI (headless, tested upstream);
  styles are authored as CSS Modules, translated from shadcn/ui's design.

## Non-goals (MVP)

- White-label theming APIs. Basic branding = overriding CSS-variable tokens;
  deep customization = fork the kit or build the template on another kit.
  Other companies plug their own kits into their own templates.
- Framework-agnostic components (React is a hard requirement).
- `data-table`, date-picker, charts, page layout templates, form validation
  integration (RHF/zod), i18n helpers.
- Storybook (the demo app and usage docs carry the documentation role).
- Migrating existing products. `insight-front` is a potential future consumer,
  out of scope for MVP.

## Architecture and distribution

The gear follows the telemetry gear layout:

```text
gears/uikit/
├── ui-kit/                  npm package (gears-web phase: @gears-web/ui-kit)
│   ├── src/
│   │   ├── components/      button/, dialog/, ... (component.tsx + component.module.css)
│   │   ├── styles/          theme.css — CSS variables, light/dark
│   │   └── index.ts         public exports
│   ├── LICENSE, NOTICE      Apache-2.0 + shadcn/ui MIT attribution, travel with the package
│   └── package.json         tsup build (CJS+ESM+dts), private during gears-web phase
├── demo/                    planned Vite app: every component live (kitchen sink)
├── docs/                    design and usage guides (this document)
├── ai/                      llms.txt, agent usage rules
├── scripts/                 verify-consumer.sh — pack-install acceptance check
└── QUICKSTART.md            consumer setup
```

- Component stack: **React 19 + Base UI + CSS Modules + CVA**. No Tailwind,
  no Radix (architects' decision; see revision notes).
- Build: **tsup** — `format: ['cjs', 'esm']`, dts, sourcemaps,
  react/react-dom/jsx-runtime externalized. tsup is the gears-frontx
  convention, adopted now so the move does not change the build or the styles
  pipeline.
- CSS pipeline: each component styles itself via a `*.module.css` file; the
  bundler inlines hashed class-name maps into the JS and extracts all CSS into
  a single `dist/index.css`, exported as **`./styles.css`**. Design tokens are
  a plain-CSS file exported as **`./theme.css`**. A consumer imports both once:

  ```ts
  import '@gears-web/ui-kit/theme.css';
  import '@gears-web/ui-kit/styles.css';
  ```

  No Tailwind `@source`, no content globs, no PostCSS requirements — the
  styles pipeline is identical for any consumer and any host repository.
- Publishing: the package stays **`private: true` and unpublished for the whole
  gears-web phase** — publishing into a final scope would pre-empt the
  gears-frontx#495 decision. While unpublished, the name is a local identifier;
  renaming at move time costs one line. Consumers are exercised via `pnpm pack`
  (works on private packages; only `publish` is blocked).

### Theme

A single `theme.css` exported as `@gears-web/ui-kit/theme.css`: semantic-level
CSS variables (colors, radii), light/dark via `data-theme` /
`prefers-color-scheme`. The MVP visual base is the neutral shadcn style;
branding happens by overriding the variables on the consumer side. Component
CSS consumes only these variables — the theme file is the single seam between
the kit's styles and the consumer's brand.

### npm scope — narrowed

The gears-web-phase name is settled: `@gears-web/ui-kit`, matching the sibling
telemetry gear. The final published name depends on the gears-frontx#495
outcome and is decided at move time.

### Versioning — open point

Semver; what counts as breaking (prop removal, class-name/markup changes that
affect overrides), how templates pin the kit, and upgrade cadence are to be
settled with template owners before first publish.

## Component set (MVP, ~18 components)

Priority: a typical admin application can be assembled end to end.

| Group    | Components |
|----------|------------|
| Forms    | `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `label`, `field` (label + error + hint wrapper) |
| Overlays | `dialog`, `dropdown-menu`, `tooltip`, `toast` (sonner) |
| Structure| `card`, `tabs`, `badge`, `separator`, `skeleton` |
| Data     | `table` (primitive markup) |

Behavior and accessibility come from Base UI primitives (`@base-ui/react`,
stable 1.x); variant logic is CVA; styles are CSS Modules translated from
shadcn/ui's Tailwind design (MIT). Reference implementation for Base UI
wrapping conventions: Constructor's internal `react-kit`
(gitlab.constr.dev/frontend/react-kit) — per-component entries, colocated
tests and docs, `render`-prop polymorphism. A composite `data-table` (sorting + cursor pagination
per DNA conventions `{ items, page_info }`) is deliberately deferred to the
next iteration.

### Licensing

The package carries its own `LICENSE` (Apache-2.0) and `NOTICE` (shadcn/ui MIT
attribution for the translated styles and design tokens), following the
telemetry gear pattern — attribution travels with the kit and requires no root
file changes in any host repository.

## AI layer

- `ai/llms.txt` — a map of the kit for agents: component list with links to
  usage docs; shipped in the package so agents find it in `node_modules`.
- A short usage doc per component (templated): when to use it, anti-patterns,
  1–2 composition examples.
- Three composition "recipes" in the docs: a CRUD page with a table, a settings
  form, a confirmation dialog. These anchor agent-driven screen generation.
- A dedicated MCP server is out of MVP scope.

## Testing and acceptance

- **Unit tests are written along with components** (revised from "none in
  MVP"): a render + interaction smoke per component with vitest + jsdom +
  testing-library. Rationale: gears-frontx CI gates `test:unit` with coverage
  on every PR — paying this cost incrementally now is cheaper than writing a
  suite for 18 components at move time. Versions are pinned to the exact ones
  the gears-frontx `lint:deps` gate enforces (vitest 4.1.4, jsdom 26.1.0,
  @testing-library/react 16.3.2).
- **Demo app (kitchen sink)** — every component in every state (variants,
  sizes, disabled, errors, dark theme) on one or two pages. Built in CI; also
  the playground where the acceptance agent builds its screen.
- **Acceptance criteria:**
  1. CI packs the package (`pnpm pack`), installs the tarball into a clean Vite
     project, and builds a page using its components.
  2. An agent assembles a CRUD screen from kit components from a single prompt,
     using the package's bundled docs.

## Risks

1. **The kit dictates the consumer stack** (React). Acceptable for ecosystem
   templates; other companies bring their own kits.
2. **Fork is the only deep-customization path** — a fork diverges wholesale and
   receives no updates. Accepted trade-off: forks are expected to be rare, and
   the standard optimizes for consistency across templates.
3. **Authored styles replace curated styles.** With CSS Modules the styling
   layer is written (translated from shadcn/ui), not copied — the largest
   share of MVP effort and the place visual bugs will live. The kitchen-sink
   demo exists to catch them.
4. **The move waits on gears-frontx#495** — "one version everywhere" is
   deferred until the kit has a citable home and gets published.

## Delivery plan (small sequential PRs)

1. Gear skeleton + tsup/CSS Modules build proven end to end + CI.
2. Tokens/theme + first batch of components (forms).
3. Remaining components.
4. AI docs + demo app.
