#!/bin/zsh
# Fast check stills on the Mac GPU: ./scripts/stills.command 42,468,1335   -> out/psa/chk_<frame>.jpg (half size)
cd "$(dirname "$0")/.."
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
REMOTION_GL=angle node scripts/psa-stills.mjs out/psa/chk_ "${1:-42,468,561,600,662,1168,1199,1335,1491}" 0.5
