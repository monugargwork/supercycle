#!/bin/bash
# A still sweep as contact sheets, so Claude checks a whole reel from a few images instead of one image per frame.
#   scripts/sweep.command MudkipReel                 -> every 60 frames
#   scripts/sweep.command MudkipReel 30 333,1501     -> every 30 frames, plus frames 333 and 1501 (beats, hero moments)
#   scripts/sweep.command MudkipReel 0 333,1501,1502 -> only the listed frames (a feedback round's changed frames)
# Writes out/<Comp>/sweep/sheet_01.jpg, … (3x3 tiles of 360x640, read left to right, top to bottom)
# and out/<Comp>/sweep/sheets.txt, which lists the frames on each sheet.
cd "$(dirname "$0")/.." || exit 1
source scripts/common.sh
ensure_deps
COMP="${1:?Usage: scripts/sweep.command <Composition> [step, 0 = none] [extra frames]}"; STEP="${2:-60}"; EXTRA="$3"
command -v ffmpeg >/dev/null || fail "ffmpeg is missing (brew install ffmpeg)."
DIR="out/$COMP/sweep"; rm -rf "$DIR"; mkdir -p "$DIR"
SPEC="$EXTRA"; [ "$STEP" != "0" ] && SPEC="every:$STEP${EXTRA:+,$EXTRA}"
[ -n "$SPEC" ] || fail "Nothing to render: give a step or a list of frames."
COMP="$COMP" REMOTION_GL=angle node scripts/stills.mjs "$DIR/f_" "$SPEC" 0.5 | grep -v "^\[warning\]" || exit 1

# 9 stills per sheet, in frame order
: > "$DIR/sheets.txt"; n=0; sheet=0
mapfile_frames=$(cat "$DIR/f_frames.txt")
batch=()
flush() {
  [ ${#batch[@]} -eq 0 ] && return
  sheet=$((sheet + 1)); name=$(printf "sheet_%02d.jpg" "$sheet"); list="$DIR/.list"; : > "$list"
  for f in "${batch[@]}"; do echo "file '$PWD/$DIR/f_$f.jpg'" >> "$list"; done
  ffmpeg -loglevel error -y -f concat -safe 0 -i "$list" -vf "scale=360:640,tile=3x3:color=0x222222" -frames:v 1 -q:v 3 "$DIR/$name"
  echo "$name: ${batch[*]}" >> "$DIR/sheets.txt"; batch=()
}
for f in $mapfile_frames; do batch+=("$f"); [ ${#batch[@]} -eq 9 ] && flush; done
flush; rm -f "$DIR/.list"
echo; cat "$DIR/sheets.txt"
