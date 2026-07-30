# Quickstart

## Prerequisites

A React 19 project with Tailwind CSS v4.

## 1. Install

```bash
pnpm add @gears/ui-kit
```

## 2. Wire up styles

In your main CSS file:

```css
@import 'tailwindcss';
@import '@gears/ui-kit/theme.css';
@source '../node_modules/@gears/ui-kit';
```

The `@source` line lets Tailwind see the utility classes used inside the
package; `theme.css` brings the design tokens.

Dark mode: set `data-theme="dark"` on `<html>`; without it the theme follows
`prefers-color-scheme` (opt out with `data-theme="light"`).

## 3. Use components

> Component exports land with the first component batch; today the package
> ships the theme only.

```tsx
import { Button, Dialog } from '@gears/ui-kit';
```

To re-brand, override the CSS variables from `theme.css` in your own styles.
For deep customization, fork the kit or build your template on another kit.

## 4. Let agents use the kit (optional, planned)

The package will ship `llms.txt` and per-component usage docs for agents. Not
available yet — this section becomes actionable when the AI-docs PR lands.

## Updating

```bash
pnpm up @gears/ui-kit
```

Fixes and design updates arrive with the new version; see the changelog for
breaking changes.
