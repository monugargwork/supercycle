#!/bin/zsh
# Mudkip v2 = v1 with only the jaw-drop frames re-rendered and spliced back in, frame-exact; audio copied from v1 untouched.
#   patch A: frames 1650-1683 (S15 lawn jaw + the dissolve into S16)
#   patch B: frames 2200-2249 (S19 three jaws, to the end)
set -e
cd "$(dirname "$0")/.."
[ -f ~/.zprofile ] && source ~/.zprofile >/dev/null 2>&1
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" >/dev/null 2>&1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
V1="out/Mudkip v1.mp4"; OUT="out/Mudkip v2.mp4"
[ -f "$V1" ] || { echo "Missing $V1"; exit 1; }
R=(--codec h264 --crf 4 --scale 1.3333 --concurrency 3 --gl angle --timeout 120000 --muted --props='{"captions":true}')
echo "== render patch A (34 frames)"; caffeinate -i npx remotion render src/index.ts MudkipReel out/patch_a.mp4 --frames=1650-1683 "${R[@]}"
echo "== render patch B (50 frames)"; caffeinate -i npx remotion render src/index.ts MudkipReel out/patch_b.mp4 --frames=2200-2249 "${R[@]}"
echo "== splice"
FF=(npx remotion ffmpeg -hide_banner -loglevel error)
P=(-fps_mode passthrough -c:v png -compression_level 1 -f image2pipe -)
{ "${FF[@]}" -i "$V1" -frames:v 1650 "${P[@]}"
  "${FF[@]}" -i out/patch_a.mp4 "${P[@]}"
  "${FF[@]}" -i "$V1" -vf trim=start_frame=1684:end_frame=2200 "${P[@]}"
  "${FF[@]}" -i out/patch_b.mp4 "${P[@]}"; } | \
  "${FF[@]}" -y -f image2pipe -framerate 30 -c:v png -i - -i "$V1" -map 0:v -map 1:a \
    -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
echo; echo "Done: $(pwd)/$OUT"
