#!/usr/bin/env bash
# Acceptance check #1: the packed @gears-web/ui-kit installs into a clean Vite
# project and the project builds a page that uses the kit's components and CSS.
# Run from anywhere; requires pnpm and node. Used locally and in CI.
set -euo pipefail

UIKIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../ui-kit" && pwd)"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "==> Building and packing @gears-web/ui-kit"
cd "$UIKIT_DIR"
pnpm build >/dev/null
TARBALL="$(pnpm pack --out "$WORKDIR/ui-kit.tgz" | tail -1)"

echo "==> Scaffolding a clean Vite consumer in $WORKDIR/consumer"
CONSUMER="$WORKDIR/consumer"
mkdir -p "$CONSUMER/src"
cd "$CONSUMER"

cat > package.json <<'EOF'
{
  "name": "ui-kit-consumer-check",
  "private": true,
  "type": "module",
  "scripts": { "build": "vite build" }
}
EOF

cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

cat > src/main.jsx <<'EOF'
import '@gears-web/ui-kit/theme.css';
import '@gears-web/ui-kit/styles.css';

import { Button } from '@gears-web/ui-kit';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <Button variant="outline" size="sm">
    It works
  </Button>,
);
EOF

echo "==> Installing tarball and deps"
pnpm add "$WORKDIR/ui-kit.tgz" >/dev/null
pnpm add react react-dom >/dev/null
pnpm add -D vite @vitejs/plugin-react >/dev/null

cat > vite.config.js <<'EOF'
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [react()] });
EOF

echo "==> Building the consumer"
pnpm build

echo "==> Asserting kit CSS and component made it into the bundle"
grep -rq -- '--primary' dist/assets/*.css || { echo 'FAIL: theme variables missing from bundle'; exit 1; }
grep -rqE 'button_button' dist/assets/*.css || { echo 'FAIL: component styles missing from bundle'; exit 1; }
grep -rqE 'button_variantOutline' dist/assets/*.js || { echo 'FAIL: CSS-module class map missing from JS bundle'; exit 1; }

echo "OK: consumer check passed"
