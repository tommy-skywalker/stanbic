#!/usr/bin/env bash
# Rebuild the app and sync it to the preview directory (~/Downloads/stanbic-dist),
# which the preview tools can read (macOS sandboxes them out of ~/Documents).
set -e
cd "$(dirname "$0")"
node node_modules/vite/bin/vite.js build
rm -rf ~/Downloads/stanbic-dist
cp -R dist ~/Downloads/stanbic-dist
echo "✓ Built and synced to ~/Downloads/stanbic-dist — reload the preview."
