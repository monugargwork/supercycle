# Fossil: notes

Composition `FossilReel` · code `src/videos/fossil/` · assets `public/fossil/`

## Kickoff (21 Nov 2026)
- VO `1 - Uncut 1999.mp3` saved as `voice.mp3`; script unchanged from `script.md`. `vo_words.py`: 266 words, 75.8 s = 2275 f; every `check:` line was a number or name spelled differently (no real mismatch).
- The Mac had no Python with faster-whisper: made `~/.venvs/storyreels` (faster-whisper, numpy). Run `~/.venvs/storyreels/bin/python scripts/vo_words.py …`.
- `beats.md` written (18 scenes, 1 cut, 3 ★: hook, wreck + wallpaper, press + guillotine). Waiting for the OK on the beats.

## Build log (v1, 21 Nov 2026)
- Beats approved as written ("no changes, continue"). Plan: `mkplan.py` -> `plan.json` (20 scenes: the beat sheet's S13 split into the counter S14 and the press S15, and the loft pull got its own S06; 2 hard cuts: the tube going down the hatch S06->S07, the valuer's "Khoan đã" S12; 0 check errors; the "fast" warnings are the flash snaps in S17, the swing to the TV in S10 and the travels). `direction.md`, `plan_view.jpg` regenerated.
- Cards (new in the library): the 15 Fossil holos `fs_*` (base3 1-15, pokemontcg.io). The sheet is 11 x 11 in print order (the 15 repeating); the real sheet's layout isn't in the source. `psyduck` is in CATALOG.md but its file is missing from `library/cards/base3/`.
- New pieces (worth adding to library/INDEX.md after review):
  - the **sheet rig** (`sets.ts` makeSheet/poseSheet): one deformable mesh with a front (real scans), a back (generic blue backs, no logo), a holo gleam layer; it rolls into a tube from its bottom edge (front inside, turns 4 mm apart), curls at its end, folds at its top-left corner; wreck textures add scratches, glue, crease, age, the torn chunk;
  - the landing + loft in one frame with a working hatch (hinged door, pull cord), a stepladder; the loft with roof, rafters, gable window, the 1990s fan with a loose blade (pendulum, drops in S20), a flipping 1999-2026 calendar, dust that greys in and leaves a clean stripe;
  - the auction house (valuation counter with lamp, photo corner with easel, softboxes, tripod camera, red rope, condition report; saleroom with a flipping lot board); the 1999 KB Toys store (shelves of toy boxes, hanging sign, promotion board); the 1999 print shop (press with turning rollers, guillotine whose blade cuts the last row off: a clipping plane, the strip tips into the tray).
- Captions: `mkcaptions.py` (63 phrases). Sound: `audio/fossil_audio.py` (-14.7 LUFS, TP -1.3). Memes: Instagram Thud (slam), Suspicious Sound (heads, the fan), Sad Violin (the damage), BRUH (wallpaper), Huh (Khoan đã), Wowww (the gleam), Punch Hit (the chop), Kids Cheering (promo), Camera shutter x4 (flashes), Kaching (£10,000).
- The Mac had no Python with numpy/faster-whisper/Pillow/scipy: they live in `~/.venvs/storyreels` (use its python for `vo_words.py`, `plan_view.py`, the sound script).
- Sweep fixes before v1: interiors were dark (room shells no longer cast shadows); the locked loft frame pulled back so tube, box, fan, calendar and scissors share it; the empty frame moved clear of the lights box; the S06 pull is a side view (he faces the tube); landing, wall, TV, press, promo, saleroom and loft-ending cameras pulled back or re-aimed; the TV wall-mounted and the sofa out of the sightline; the wallpaper redrawn in the sheet's faded card colours (the "wallpaper?" joke); damage marks made stronger; the torn-corner lift turned over to 140 deg so the back faces the lens; the owner moved to the near row in the saleroom; the guillotine blade parked up until the chop.
- Stand-ins: everyone is generic (the owner is unnamed in the source); the store sign is plain "KB TOYS" lettering; the board reads CULLENS OF SURREY in plain type. The estimate is what's shown; the sale (29 Nov) hasn't happened.

### Open
- Seen only as sweep stills: check the hatch slam, the unroll, the toss into the bag and the chop in motion.
