#!/bin/bash
# Render a story reel on this Mac. Claude writes the code; you run this with the command Claude gives you.
#
#   scripts/render.command <Composition> <output name>
#   e.g.  scripts/render.command MudkipReel Mudkip_v2
#
# - Pulls the latest version from GitHub first.
# - Output: Story Reels/Drafts/<output name>.mp4, or Story Reels/Final Render/ when the name ends in _final.
# - 1440x2560 (4/3 of the 1080x1920 composition), captions burned in, Mac GPU (ANGLE/Metal), 3 frames at a time.
# - Renders in 10-second chunks and keeps them, so after a small fix only the changed chunks are redone:
#     REDO=7,8 scripts/render.command MudkipReel Mudkip_v3   → re-renders chunks 7 and 8 (60–80 s), reuses the rest
#     REDO=all scripts/render.command …                       → starts fresh
#   If the length or settings change, it starts fresh by itself. A stopped render resumes where it left off.
# - PATCH=1: a transparent ProRes 4444 .mov (no sound) that only shows the frames the reel lists in PATCH_FRAMES,
#   to lay over the previous version in an editor. Everything else in it is empty.
# Options (env vars): CONC=3, GL=angle, END=n (first n frames only, for tests), SCALE (tests only).
set -eo pipefail
cd "$(dirname "$0")/.."
source scripts/common.sh

COMP="$1"; NAME="$2"
[ -n "$COMP" ] && [ -n "$NAME" ] || fail "Usage: scripts/render.command <Composition> <output name>   e.g. scripts/render.command MudkipReel Mudkip_v2"

pull_latest
ensure_deps

CHUNK=${CHUNK:-300}; CONC=${CONC:-3}; GL=${GL:-angle}
SCALE=${SCALE:-1.3333333333333333}   # exactly 4/3: 1080x1920 -> 1440x2560 (1.3333 gives a non-integer height). Override only for quick tests.
if [[ "$NAME" == *_final ]]; then OUTDIR="../Final Render"; else OUTDIR="../Drafts"; fi
mkdir -p "$OUTDIR"
command -v caffeinate >/dev/null && { caffeinate -dimsu -w $$ & }  # keep the Mac awake while rendering

FREE_MB=$(df -m . | awk 'NR==2{print $4}')
(( FREE_MB >= 2000 )) || fail "Only ${FREE_MB} MB of disk free. Free up at least 3 GB and try again."

START=$(date +%s)
WORK="../Drafts/.work/$COMP"; rm -rf "$WORK/bundle"; mkdir -p "$WORK"
echo "▶ Preparing $COMP…"
npx remotion bundle src/index.ts --out-dir="$WORK/bundle" --log=error >/dev/null || fail "Couldn't build the project. Tell Claude what this window says."

if [ -n "${PATCH:-}" ]; then
  OUT="$OUTDIR/$NAME.mov"
  npx remotion render "$WORK/bundle" "$COMP" "$OUT" --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le \
    --image-format=png --scale=$SCALE --concurrency="$CONC" --gl="$GL" --timeout=120000 --muted \
    --props='{"captions":true,"patch":true,"audio":false}' --log=warn || fail "Patch render failed. Tell Claude what this window says."
  echo "✅ Done in $(( ($(date +%s) - START) / 60 )) min → $OUT. Put it on the track above the previous version, starting at 0:00."
  # Flicker report on the finished video (single stills can't show flicker): look at every run it lists before sending.
PY_BIN=python3; [ -x ../.venv/bin/python ] && PY_BIN=../.venv/bin/python
CUTS=$("$PY_BIN" - "$REEL" <<'PY' 2>/dev/null
import sys, re, json
st = open(f"src/videos/{sys.argv[1]}/story.ts").read()
plan = json.load(open(re.search(r'import plan from "\.\./\.\./\.\./(videos/[^"]+)"', st).group(1)))
print(",".join(str(s["f"][0]) for s in plan["scenes"] if s["in"]["type"] in ("cut", "dissolve")))
PY
)
echo "▶ Flicker check…"; "$PY_BIN" scripts/flicker.py "$OUT" ${CUTS:+--cuts "$CUTS"} --report "$OUTDIR/$NAME.flicker.txt" || echo "⚠️  Flicker found (listed above, saved next to the video). Tell Claude before sending this version."
command -v open >/dev/null && open "$OUTDIR"; exit 0
fi

PROPS='{"captions":true}'
RENDER=(--props="$PROPS" --gl="$GL" --concurrency="$CONC" --scale=$SCALE --image-format=png --color-space=bt709 --timeout=120000 --log=warn)
TAGS=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)
TOTAL=$(npx remotion compositions "$WORK/bundle" --props="$PROPS" 2>/dev/null | awk -v c="$COMP" '$1==c{print $4}')
[[ "$TOTAL" =~ ^[0-9]+$ ]] || fail "Couldn't find a composition called '$COMP'."
TOTAL=${END:-$TOTAL}

CACHE="../Drafts/.chunks/$COMP"; mkdir -p "$CACHE"   # kept between renders; delete once the reel is final
SIG="$TOTAL $CHUNK $SCALE $PROPS png-bt709"
if [ "${REDO:-}" = "all" ] || [ "$(cat "$CACHE/settings" 2>/dev/null)" != "$SIG" ]; then rm -f "$CACHE"/part_*.mp4; fi
echo "$SIG" > "$CACHE/settings"
# Cached chunks are only reused on purpose: if the reel's code or assets changed since they were made, say which chunks to redo
# (REDO=7,8 or REDO=all). Otherwise a new version would silently keep old frames (Monaco v2 nearly shipped v1's glitches).
RL=$(echo "${COMP%Reel}" | tr '[:upper:]' '[:lower:]'); PATHS="src/videos/$RL src/engine src/enzo src/brand public/$RL"   # only what this reel's frames depend on
CODE=$(for d in $PATHS; do git rev-parse "HEAD:$d" 2>/dev/null; done | tr '\n' '-')$(git status --porcelain $PATHS | md5 -q 2>/dev/null || true)
if ls "$CACHE"/part_*.mp4 >/dev/null 2>&1 && [ -z "${REDO:-}" ] && [ "$(cat "$CACHE/code" 2>/dev/null)" != "$CODE" ]; then
  fail "The code changed since the cached chunks of $COMP were rendered. Run again with REDO=<chunks that changed> (10 s each) or REDO=all."
fi
echo "$CODE" > "$CACHE/code"
if [ -n "${REDO:-}" ] && [ "$REDO" != "all" ]; then
  for c in ${REDO//,/ }; do
    [[ "$c" =~ ^[0-9]+$ ]] || fail "REDO takes chunk numbers like 7,8 (chunk 1 = 0–10 s)."
    rm -f "$(printf "%s/part_%03d.mp4" "$CACHE" $((c - 1)))"
  done
fi

# The reel's sound is its mixed track public/<reel>/mix.wav, played from frame 0 (MudkipReel -> public/mudkip/mix.wav).
# Rendering the audio through Remotion would step through every frame of the 3D scene, so the file is used directly.
REEL=$(echo "${COMP%Reel}" | tr '[:upper:]' '[:lower:]')
AUDIO="${AUDIO:-public/$REEL/mix.wav}"
if [ ! -f "$AUDIO" ]; then
  AUDIO="$WORK/audio.wav"
  npx remotion render "$WORK/bundle" "$COMP" "$AUDIO" --codec=wav --props="$PROPS" --log=warn || fail "Audio render failed."
fi

i=0; N=$(( (TOTAL + CHUNK - 1) / CHUNK )); DONE=0
for ((s=0; s<TOTAL; s+=CHUNK)); do
  e=$(( s + CHUNK - 1 )); (( e >= TOTAL )) && e=$(( TOTAL - 1 ))
  part=$(printf "%s/part_%03d.mp4" "$CACHE" $i); i=$((i+1))
  if [ -f "$part" ]; then echo "  chunk $i/$N kept"; continue; fi
  echo "▶ Chunk $i/$N  (frames $s-$e of $TOTAL)"
  rm -f "$WORK/chunk.mp4"
  npx remotion render "$WORK/bundle" "$COMP" "$WORK/chunk.mp4" --frames=$s-$e --muted "${RENDER[@]}" --crf=14 --x264-preset=slow \
    || fail "Chunk $i failed. Run the same command again to resume from here."
  [ -s "$WORK/chunk.mp4" ] || fail "Chunk $i produced no video. Run the same command again to resume from here."
  mv "$WORK/chunk.mp4" "$part"; DONE=$((DONE+1))
done

echo "▶ Joining chunks and adding audio…"
OUT="$OUTDIR/$NAME.mp4"
for ((k=0; k<N; k++)); do printf "file '%s/part_%03d.mp4'\n" "$(cd "$CACHE" && pwd)" $k; done > "$WORK/parts.txt"
npx remotion ffmpeg -y -loglevel error -f concat -safe 0 -i "$WORK/parts.txt" -i "$AUDIO" \
  -map 0:v -map 1:a -c:v copy "${TAGS[@]}" -c:a aac -b:a 320k -shortest -movflags +faststart "$OUT" || fail "Joining failed."
[ -s "$OUT" ] || fail "The video was not created."
rm -rf "$WORK"
echo "✅ Done in $(( ($(date +%s) - START) / 60 )) min ($DONE of $N chunks rendered, the rest reused) → $OUT ($(du -h "$OUT" | cut -f1))"
# Flicker report on the finished video (single stills can't show flicker): look at every run it lists before sending.
PY_BIN=python3; [ -x ../.venv/bin/python ] && PY_BIN=../.venv/bin/python
CUTS=$("$PY_BIN" - "$REEL" <<'PY' 2>/dev/null
import sys, re, json
st = open(f"src/videos/{sys.argv[1]}/story.ts").read()
plan = json.load(open(re.search(r'import plan from "\.\./\.\./\.\./(videos/[^"]+)"', st).group(1)))
print(",".join(str(s["f"][0]) for s in plan["scenes"] if s["in"]["type"] in ("cut", "dissolve")))
PY
)
echo "▶ Flicker check…"; "$PY_BIN" scripts/flicker.py "$OUT" ${CUTS:+--cuts "$CUTS"} --report "$OUTDIR/$NAME.flicker.txt" || echo "⚠️  Flicker found (listed above, saved next to the video). Tell Claude before sending this version."
command -v open >/dev/null && open "$OUTDIR"
echo "You can close this window."
