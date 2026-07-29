# UI Kit Gear

A shadcn-style component registry for the Gears ecosystem. Consumers pull component
sources into their own codebase with the shadcn CLI and own the code — white-label
by editing tokens and components in place.

- Stack: React 19 + Base UI + Tailwind 4 + CVA
- Distribution: static registry JSON on GitHub Pages, `npx shadcn add @gears/<item>`
- AI-first: works with the official shadcn MCP server out of the box

See [docs/DESIGN.md](docs/DESIGN.md) for the full design and
[QUICKSTART.md](QUICKSTART.md) for consumer setup.

## Layout

```
registry/          component sources — the source of truth
├── ui/            component .tsx files
├── tokens/        theme.css — CSS variables, light/dark
└── registry.json  registry item descriptions
demo/              Vite app: every component live (kitchen sink)
docs/              design doc, usage guides
ai/                llms.txt, agent usage rules
```

## Development

```bash
pnpm install
pnpm build        # generates dist/r/*.json from registry/registry.json
```

The registry is published to GitHub Pages by CI on every push to `main`.
