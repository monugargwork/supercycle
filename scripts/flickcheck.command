#!/bin/bash
# Flicker check BEFORE a render: single stills can't show flicker (z-fighting, popping shadows, swimming outlines), so this
# renders five consecutive frames every STEP frames (plus any extra frames given) and measures pixels that pop away and back.
#   scripts/flickcheck.command MonacoReel            -> five frames in a row every 30 frames (~7 min on the Mac GPU)
#   scripts/flickcheck.command MonacoReel 0 797,1689 -> only five-frame runs around those frames (a feedback round's spots)
# Writes out/<Comp>/flick/f_<n>.jpg and report.txt; exits 1 and lists the runs if anything flickers (fix before rendering).
# After a render, check the whole video too:  python3 scripts/flicker.py ../Drafts/<Name>.mp4 --cuts <cut and dissolve frames>
cd "$(dirname "$0")/.." || exit 1
source scripts/common.sh
ensure_deps
COMP="${1:?Usage: scripts/flickcheck.command <Composition> [step, 0 = none] [extra frames]}"; STEP="${2:-30}"; EXTRA="$3"
DIR="out/$COMP/flick"; rm -rf "$DIR"; mkdir -p "$DIR"
FR=$(python3 - "$COMP" "$STEP" "$EXTRA" <<'PY'
import sys, re, glob, json, os
comp, step, extra = sys.argv[1], int(sys.argv[2]), sys.argv[3]
# the reel's plan: its story.ts imports it
name = comp.replace("Reel", "").lower()
st = open(f"src/videos/{name}/story.ts").read()
plan = json.load(open(re.search(r'import plan from "\.\./\.\./\.\./(videos/[^"]+)"', st).group(1)))
total = plan["frames"]
cuts = [s["f"][0] for s in plan["scenes"] if s["in"]["type"] in ("cut", "dissolve")]
centres = list(range(step // 2, total - 1, step)) if step > 0 else []
centres += [int(x) for x in extra.split(",") if x]
fr = sorted({f + d for c in centres for f in [c] for d in (-2, -1, 0, 1, 2) if 0 <= f + d < total and all(abs(f - k) > 5 for k in cuts)})
print(",".join(map(str, fr)))
open(os.path.join("out", comp, "flick", "cuts.txt"), "w").write(",".join(map(str, cuts)))
PY
)
[ -n "$FR" ] || fail "No frames to check."
COMP="$COMP" REMOTION_GL=angle node scripts/stills.mjs "$DIR/f_" "$FR" 0.5 | grep -E "coplanar\]" | sort -u
PY_BIN=python3; [ -x ../.venv/bin/python ] && PY_BIN=../.venv/bin/python
"$PY_BIN" scripts/flicker.py "$DIR" --report "$DIR/report.txt" --cuts "$(cat "$DIR/cuts.txt")"
