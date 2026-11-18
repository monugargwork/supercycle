# Shared by the Mac launchers in this folder. Sourced from the project root, not run on its own.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
# Node: use the Mac's own, else nvm's, else the copy that came with the Enzo setup.
if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" >/dev/null 2>&1
fi
if ! command -v node >/dev/null 2>&1 && [ -x "$HOME/Downloads/Enzo Projects/.node/bin/node" ]; then
  export PATH="$HOME/Downloads/Enzo Projects/.node/bin:$PATH"
fi

fail() { echo; echo "❌ $*"; echo "Press any key to close."; read -n1; exit 1; }

# Every preview and render starts from the latest version on GitHub (the master copy).
pull_latest() {
  if ! command -v git >/dev/null 2>&1 || [ ! -d .git ]; then
    echo "⚠️  This folder isn't linked to GitHub yet (run 'Connect to GitHub.command' once). Using the files on this Mac."
    return 0
  fi
  echo "▶ Getting the latest version from GitHub…"
  if git pull --ff-only --quiet; then
    echo "   Using: $(git log -1 --format='%h · %s' | cut -c1-90)"
  else
    echo "⚠️  Couldn't update from GitHub (offline, or files were changed on this Mac). Using the files on this Mac; tell Claude if this keeps happening."
  fi
}

# Install the project's tools the first time, and again whenever package-lock.json changes.
ensure_deps() {
  command -v npm >/dev/null || fail "Node.js is not installed. Install the LTS version from https://nodejs.org, then double-click this file again."
  if [ ! -d node_modules ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
    echo "▶ Installing project tools (first time takes a few minutes)…"
    npm install --no-audit --no-fund || fail "Installing the project tools failed. Tell Claude what this window says."
  fi
}
