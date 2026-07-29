# Quickstart

## Prerequisites

A React project with Tailwind CSS v4 and a `components.json`
(run `npx shadcn init` if you don't have one).

## 1. Register the `@gears` registry

Add to your `components.json`:

```json
{
  "registries": {
    "@gears": "https://constructorfabric.github.io/gears-web/uikit/r/{name}.json"
  }
}
```

## 2. Install components

```bash
npx shadcn add @gears/theme
npx shadcn add @gears/button @gears/dialog
```

The CLI copies the sources into your project, installs npm dependencies, and adds
the theme CSS variables. The code is yours — edit it freely. To re-brand, override
the variables installed by `@gears/theme`.

Dark mode: set `data-theme="dark"` on `<html>`; without it the theme follows
`prefers-color-scheme` (opt out with `data-theme="light"`).

## 3. Let agents use the kit (optional)

The kit works with the official shadcn MCP server — agents can list `@gears`
components, read their docs, and install them.

Claude Code:

```bash
claude mcp add shadcn -- npx shadcn@latest mcp
```

Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```

Both read the registries from your project's `components.json`.

## Updating

Updates are explicit: `npx shadcn diff` shows how a registry item differs from
your local copy; apply changes deliberately.
