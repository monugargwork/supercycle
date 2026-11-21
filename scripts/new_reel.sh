#!/bin/bash
# Scaffold a new story reel in one go. Safe to run again: every step skips what already exists.
#   scripts/new_reel.sh <slug> <Name>        e.g. scripts/new_reel.sh gengar-heist Gengar
#
# Always:   videos/<slug>/ (notes.md, cards/SOURCES.txt) and public/<name>/ (cards/, memes/, voice.wav + words.json if ready)
# Once videos/<slug>/plan.json exists (after direction), also:
#   src/videos/<name>/  the per-reel files of the base reel, exports renamed (<Name>Reel, <Name>Captions, <NAME>_FRAMES),
#                       asset paths and the plan import pointed at this reel; the engine is imported from src/engine/
#   audio/<name>_audio.py   the base reel's sound script, paths pointed at this reel
#   src/Root.tsx            <Name>Reel (1080x1920) and <Name>Captions (1440x2560) registered
# The copied story, sets, cast and art are still the base reel's: the build rewrites them.
set -e
cd "$(dirname "$0")/.."
SLUG="${1:?Usage: scripts/new_reel.sh <slug> <Name>}"; NAME="${2:?Usage: scripts/new_reel.sh <slug> <Name>}"
BASE="${BASE:-monaco}"; BASE_NAME="${BASE_NAME:-Monaco}"; BASE_SLUG="${BASE_SLUG:-monaco-auction}"   # monaco: the anti-flicker box() helper and near plane
LOW=$(echo "$NAME" | tr '[:upper:]' '[:lower:]'); UP=$(echo "$NAME" | tr '[:lower:]' '[:upper:]')
BLOW=$(echo "$BASE_NAME" | tr '[:upper:]' '[:lower:]'); BUP=$(echo "$BASE_NAME" | tr '[:lower:]' '[:upper:]')
[[ "$NAME" =~ ^[A-Z][A-Za-z0-9]*$ ]] || { echo "Name must be one word starting with a capital, e.g. Gengar"; exit 1; }
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || { echo "Slug must be lowercase words with dashes, e.g. gengar-heist"; exit 1; }
say() { echo "  $*"; }

# 1. Story folder
V="videos/$SLUG"; mkdir -p "$V/cards"
[ -f "$V/notes.md" ] || { printf "# %s: notes\n\nComposition \`%sReel\` · code \`src/videos/%s/\` · assets \`public/%s/\`\n" "$NAME" "$NAME" "$LOW" "$LOW" > "$V/notes.md"; say "made $V/notes.md"; }
[ -f "$V/cards/SOURCES.txt" ] || { echo "Real card scans for the $NAME reel (from library/cards, see CATALOG.md)." > "$V/cards/SOURCES.txt"; say "made $V/cards/SOURCES.txt"; }

# 2. Assets
P="public/$LOW"; mkdir -p "$P/cards" "$P/memes"
for f in voice.wav words.json; do
  if [ -f "$V/$f" ] && ! cmp -s "$V/$f" "$P/$f"; then cp "$V/$f" "$P/$f"; say "copied $f to $P/"; fi
done

if [ ! -f "$V/plan.json" ]; then
  echo "✓ Story folder and assets ready. Run this again once $V/plan.json exists to make the build."; exit 0
fi

# 3. Build folder
S="src/videos/$LOW"
if [ ! -d "$S" ]; then
  mkdir -p "$S"
  for f in Reel.tsx story.ts sets.ts cast.ts world.ts art.ts art2.ts captions.ts; do cp "src/videos/$BASE/$f" "$S/$f"; done
  sed -i '' -E \
    -e "s/${BASE_NAME}Reel/${NAME}Reel/g; s/${BASE_NAME}Captions/${NAME}Captions/g; s/${BUP}_FRAMES/${UP}_FRAMES/g" \
    -e "s#staticFile\(\"${BLOW}/#staticFile(\"${LOW}/#g; s#staticFile\(\`${BLOW}/#staticFile(\`${LOW}/#g" \
    -e "s#public/${BLOW}/#public/${LOW}/#g; s#\[${BLOW}\]#[${LOW}]#g" \
    -e "s#videos/${BASE_SLUG}/plan.json#videos/${SLUG}/plan.json#g" "$S"/*
  say "made $S/ from src/videos/$BASE/ (exports renamed, assets and plan pointed at this reel)"
fi

# 4. Sound script
A="audio/${LOW}_audio.py"
if [ ! -f "$A" ]; then
  sed -E -e "s#\"public\", \"${BLOW}\"#\"public\", \"${LOW}\"#g; s#public/${BLOW}/#public/${LOW}/#g; s#src/videos/${BLOW}/#src/videos/${LOW}/#g" \
    -e "s#${BLOW}_audio.py#${LOW}_audio.py#g" "audio/${BLOW}_audio.py" > "$A"
  say "made $A from audio/${BLOW}_audio.py"
fi

# 5. Register the compositions
R="src/Root.tsx"
if ! grep -q "id=\"${NAME}Reel\"" "$R"; then
  python3 - "$R" "$NAME" "$LOW" "$UP" <<'EOF'
import sys
r, name, low, up = sys.argv[1:]
s = open(r).read()
imp = f'import {{ {name}Reel, {name}Captions, {up}_FRAMES }} from "./videos/{low}/Reel";\n'
last = s.rfind('\nimport ') ; end = s.index('\n', last + 1) + 1
s = s[:end] + imp + s[end:]
comps = (f'    <Composition id="{name}Reel" component={{{name}Reel}} durationInFrames={{{up}_FRAMES}} fps={{30}} width={{1080}} height={{1920}} />\n'
         f'    <Composition id="{name}Captions" component={{{name}Captions}} durationInFrames={{{up}_FRAMES}} fps={{30}} width={{1440}} height={{2560}} />\n')
i = s.rindex('  </>')
s = s[:i] + comps + s[i:]
open(r, 'w').write(s)
EOF
  say "registered ${NAME}Reel and ${NAME}Captions in $R"
fi
echo "✓ $NAME scaffolded. Next: cards (scripts/card.py use $LOW …), memes, captions, then rewrite story/sets/cast/art."
