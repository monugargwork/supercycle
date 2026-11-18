#!/bin/bash
# One-time setup: makes ~/Movies/Story Reels/story-reels a copy of the GitHub repo (github.com/monugargwork/supercycle),
# so every preview and render pulls the latest version first. The repo is public, so no token is needed.
# - Reuses the tools already installed in ~/Movies/psa-reel (copied, not moved), so psa-reel keeps working.
# - Safe to run again: if the folder is already linked, it just updates it.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
BASE="$HOME/Movies/Story Reels"
DIR="$BASE/story-reels"
REPO="https://github.com/monugargwork/supercycle.git"

finish() { echo; echo "$1"; echo; echo "Press any key to close."; read -n1; exit "${2:-0}"; }
fail() { finish "❌ $1" 1; }

mkdir -p "$BASE/Drafts" "$BASE/Final Render" && cd "$BASE" || fail "Couldn't open $BASE."

# 1. git comes with Apple's free Command Line Tools.
if ! xcode-select -p >/dev/null 2>&1; then
  xcode-select --install >/dev/null 2>&1
  fail "macOS needs its free developer tools for this (they include git). Click Install in the window that just opened, wait until it finishes, then double-click this file again."
fi
command -v git >/dev/null || fail "git isn't available yet. Finish installing the Command Line Tools, then double-click this file again."

# 2. Already linked? Just update.
if [ -d "$DIR/.git" ]; then
  echo "▶ Already linked to GitHub. Getting the latest version…"
  git -C "$DIR" pull --ff-only || fail "Couldn't update. Tell Claude what this window says."
  finish "✅ Up to date: $(git -C "$DIR" log -1 --format='%h · %s' | cut -c1-80)"
fi
[ -e "$DIR" ] && fail "A 'story-reels' folder that isn't linked to GitHub is in the way. Move it to the Bin, then double-click this file again."

# 3. Download from GitHub (about 300 MB: code, cards, voices, music).
echo "▶ Downloading the project from GitHub…"
git clone "$REPO" "$DIR" || { rm -rf "$DIR"; fail "The download from GitHub didn't work. Check the internet connection, then double-click this file again."; }
chmod +x "$DIR"/scripts/*.command 2>/dev/null

# 4. Project tools: start from psa-reel's copy (instant on APFS), then bring them up to date.
cd "$DIR" || fail "Couldn't open the new folder."
if [ -d "$HOME/Movies/psa-reel/node_modules" ] && [ ! -e node_modules ]; then
  echo "▶ Copying the installed tools from psa-reel…"
  cp -Rc "$HOME/Movies/psa-reel/node_modules" node_modules 2>/dev/null || cp -R "$HOME/Movies/psa-reel/node_modules" node_modules
fi
source scripts/common.sh
if command -v npm >/dev/null; then
  echo "▶ Bringing the project tools up to date…"
  npm install --no-audit --no-fund || echo "⚠️  npm install had a problem. 'Open Studio' will try again."
else
  echo "⚠️  Node.js isn't installed. Install the LTS version from https://nodejs.org before opening Studio."
fi

open "$DIR/scripts" 2>/dev/null
finish "✅ Linked to GitHub. 'Movies/Story Reels/story-reels' now always updates from GitHub.
   To preview: double-click scripts/Open Studio.command (the folder just opened).
   Renders go to 'Story Reels/Drafts' and 'Story Reels/Final Render'.
   ~/Movies/psa-reel is untouched; keep it for its old renders in out/."
