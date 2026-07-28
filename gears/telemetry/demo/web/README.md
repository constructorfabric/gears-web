# Telemetry Web Demo

A browser page wired to [`@gears-web/telemetry`](../../telemetry), posting to a local collector.

It consumes the package exactly as an external user would — `dependencies` on the published entry
point, no reaching into `src/`, no path aliases. If the demo compiles, the public API and the
emitted types are usable.

## Run

```sh
pnpm install
pnpm dev
```

Open <http://localhost:5173>. The port is pinned in `vite.config.ts` because the `url` in
`src/main.ts` is absolute.

`predev` builds the SDK first, so a fresh clone works in one command. The demo consumes the SDK's
`dist/`, not its source, so re-run `pnpm dev` after changing the SDK.

Two things make that reliable, and both were bugs before they were settings:

- the dependency is `link:../../telemetry`, not `file:`. Under pnpm, `file:` on a directory creates
  a **hard-linked copy** frozen at install time, so rebuilding the SDK changed nothing the page
  ran. `link:` is a live symlink. (On npm, `file:` symlinks and would have been fine — worth
  re-checking if this repo moves to npm.)
- `optimizeDeps.exclude` lists the SDK. Vite otherwise pre-bundles it into `node_modules/.vite`
  and keeps serving that copy after a rebuild.

Without both, the demo silently runs stale SDK code — which is worse than useless for a demo whose
job is to validate the SDK.

## Where the events go

`url` is set to `http://localhost:5173/api/events`. A ~20-line Vite middleware in
`vite.config.ts` accepts the POST, pretty-prints the body to the terminal and replies `204`.

That middleware stands in for the ingestion backend. The published package is transport-agnostic:
it sends whatever envelope the SDK builds to whatever `url` you configure. Swap the `url` to point
at a real collector and nothing else changes.

Records also render on the page, via a demo plugin on the `event` hook — that fires *before* the
record is queued, so the page shows the same object the collector receives.

## What the page demonstrates

| Section | Shows |
| --- | --- |
| Autocapture | Ordinary buttons, links, inputs and a form. Nothing calls the SDK; autocapture listens on `document` for `click`, `change` and `submit`. |
| Redaction | A password field and a card number. Neither value reaches a record — the field names and value shapes trip the redaction rules. |
| Opting out | A subtree carrying `data-telemetry-no-capture="false"`. Note the value is inverted; see the SDK README's *Known gaps*. |
| Element hook | A button registering a hook under `telemetryElementHookKey`, contributing service attribution and custom `data`. |
| Explicit API | `logEvent`, `identify` and `destroy`. |

## Notes

- `sessionDuration` is set to 60s rather than the 30 minute default, so a session boundary is
  observable without waiting.
- `verbose: true`, so the SDK also logs to the browser console.
- The plugin in `src/main.ts` is written inline. `context` and `record` are typed contextually —
  writing a plugin requires no type imports.
