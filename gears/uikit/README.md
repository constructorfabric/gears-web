# UI Kit Gear

The standard React component base for Constructor Fabric front-end templates,
shipped as the open-source npm package `@gears/ui-kit`. FrontX and Studio
assemble interfaces from templates built on it; templates may mix in other
components, and other companies can plug their own kits into their own
templates.

- Stack: React 19 + Base UI + Tailwind 4 + CVA
- Distribution: npm package; fixes and design updates arrive via a dependency bump
- Customization: basic branding via CSS-variable tokens; deep changes = fork

See [docs/DESIGN.md](docs/DESIGN.md) for the full design and
[QUICKSTART.md](QUICKSTART.md) for consumer setup.

## Layout

```text
ui-kit/            npm package @gears/ui-kit (components, theme, build)
demo/              planned Vite app: every component live (kitchen sink)
docs/              design doc, usage guides
ai/                llms.txt, agent usage rules
QUICKSTART.md      consumer setup
```

## Development

```bash
cd ui-kit
pnpm install
pnpm build        # vite lib build + type declarations into dist/
```
