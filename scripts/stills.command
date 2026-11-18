#!/bin/bash
# Check stills on the Mac GPU (about a second each):
#   scripts/stills.command MudkipReel 120,640,1500        -> out/MudkipReel/chk_<frame>.jpg (half size)
# Optional third argument: the post-effects resolution factor (default 0.5; 1 = full quality).
cd "$(dirname "$0")/.." || exit 1
source scripts/common.sh
ensure_deps
COMP="${1:?Usage: scripts/stills.command <Composition> <frame,frame,…>}"; FRAMES="${2:?frames like 120,640}"
mkdir -p "out/$COMP"
COMP="$COMP" REMOTION_GL=angle node scripts/stills.mjs "out/$COMP/chk_" "$FRAMES" "${3:-0.5}"
