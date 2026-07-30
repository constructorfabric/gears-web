# UI Kit Gear

The standard React component base for Constructor Fabric front-end templates.
FrontX and Studio assemble interfaces from templates built on it; templates may
mix in other components, and other companies can plug their own kits into their
own templates.

- Stack: React 19 + Base UI + CSS Modules + CVA
- Self-contained styles: the package ships compiled CSS — consumers need no
  CSS framework or build plugins
- Customization: basic branding via CSS-variable tokens; deep changes = fork

The kit is developed here as `@gears-web/ui-kit` (private, unpublished) and
will move to its final home once
[gears-frontx#495](https://github.com/constructorfabric/gears-frontx/issues/495)
settles where published runtime libraries live.

See [docs/DESIGN.md](docs/DESIGN.md) for the full design and
[QUICKSTART.md](QUICKSTART.md) for consumer setup.

## Layout

```text
ui-kit/            npm package @gears-web/ui-kit (components, theme, build)
demo/              planned Vite app: every component live (kitchen sink)
docs/              design doc, usage guides
ai/                llms.txt, agent usage rules
scripts/           verify-consumer.sh — pack-install acceptance check
QUICKSTART.md      consumer setup
```

## Development

```bash
cd ui-kit
pnpm install
pnpm build        # tsup: dist/index.{js,cjs,d.ts} + dist/index.css + dist/theme.css
pnpm lint         # eslint + tsc
pnpm test         # vitest
```
