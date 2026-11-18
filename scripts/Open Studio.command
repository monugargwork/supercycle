#!/bin/bash
# Opens Remotion Studio on the latest version from GitHub. Double-click to run.
# Keep the Terminal window open while you watch; closing it stops Studio.
cd "$(dirname "$0")/.." || exit 1
source scripts/common.sh
pull_latest
ensure_deps
echo "▶ Opening Remotion Studio in your browser…"
npm run studio
