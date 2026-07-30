# Quickstart

## Prerequisites

A React 19 project with a bundler that handles CSS imports (Vite, webpack,
etc. — any modern default works). No CSS framework or plugins required.

## 1. Install

While the package is unpublished (gears-web phase), install it from a tarball:

```bash
# in gears/uikit/ui-kit
pnpm build && pnpm pack

# in your project
pnpm add ./gears-web-ui-kit-0.1.0.tgz
```

After the kit is published, this becomes a regular `pnpm add`.

## 2. Wire up styles

Import once, e.g. in your entry module:

```ts
import '@gears-web/ui-kit/theme.css'; // design tokens (CSS variables)
import '@gears-web/ui-kit/styles.css'; // compiled component styles
```

Dark mode: set `data-theme="dark"` on `<html>`; without it the theme follows
`prefers-color-scheme` (opt out with `data-theme="light"`).

## 3. Use components

> Component exports land with the first component batch; today the package
> ships the theme and the `Button` pipeline prototype.

```tsx
import { Button } from '@gears-web/ui-kit';

<Button variant="outline" size="sm">
  Save
</Button>;
```

To re-brand, override the CSS variables from `theme.css` in your own styles.
For deep customization, fork the kit or build your template on another kit.

## 4. Let agents use the kit (optional, planned)

The package will ship `llms.txt` and per-component usage docs for agents. Not
available yet — this section becomes actionable when the AI-docs PR lands.

## Updating

```bash
pnpm up @gears-web/ui-kit
```

(After the kit is published.) Fixes and design updates arrive with the new
version; see the changelog for breaking changes.
