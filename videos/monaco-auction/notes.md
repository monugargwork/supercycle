# Monaco: notes

Composition `MonacoReel` · code `src/videos/monaco/` · assets `public/monaco/`

## Build log (v1, 20 Nov 2026)
- Script 5 of `tcg new scripts.pdf` (the NEW version); VO 75.5 s (2266 f), reel 2280 f. The user asked for the whole reel end to end ("you render it at end yourself using 3 cores"), so beats went straight to direction and build without a beat review.
- Plan: `mkplan.py` -> `plan.json` (18 scenes, 1 hard cut, 0 check errors; 3 warnings are fast travels by design: in through the window S03, the swing to the audience S04, the crane over the scooters S10). `direction.md`, `plan_view.jpg` regenerated.
- Cards (new in the library): `pika_poncho_ray` (JP XY-P 231 Poncho-wearing Pikachu, Rayquaza poncho, scrydex scan), `ds_rayquaza` (EX Delta Species 13, the box art), `ds_metagross_star`, `ds_latias`, `ds_mewtwo`; reused `pika_rain`, `zard_base`, `blastoise`, `venusaur` on the 70-lot table.
- Captions: `mkcaptions.py` (60 phrases). Sound: `audio/monaco_audio.py` (-14.6 LUFS, TP -1.1). Memes: Instagram Thud (box thump), Huh (Minh), Wowww (ten scooters), Suspicious Sound (the wine question), Sad Violin (the last sealed box), Romantic (the bow).
- New pieces (worth adding to library/INDEX.md after review): `makeBox` booster display box rig (printed faces with a real scan, lid hinge, shrink-wrap shell whose front gleams or tears, dimmed "opened" material), vitrine with a hinged glass door, gold crown, model yacht, diamond on a cushion, watch with tag, gilt chairs (one tips over), 70-lot two-tier table with tag strips, scooters, the harbour façade with real window openings shared with the saleroom (the camera passes through), moored yachts, wine cellar rack (bottles + box cubbies, pulled bottle, year plate), kitchen (cupboard, stove, tin, coins, bowl). Drawings in `art2.ts`.
- Stand-ins: the auctioneer, porter, waiter and bidders are generic; the box printing is plain lettering ("ESPÈCES DELTA · 36 BOOSTERS · 2006"), no logos. The result of the sale was not found, so the reel shows only the estimates.
- Physics is analytic (ballistic hops, a hinged chair fall, cork bounces, fluttering shreds that rest on the floor), not a cannon bake.
- Sweep fixes before v1: the box went missing from the vitrine during the S05 macro (fixed); S04 lens moved so no gentleman blocks it; S02 camera lowered so the yachts sit in the foreground; S05 macro pulled back; cellar boxes scaled 0.8 so the opened lids show, and opened boxes dim; the kitchen cupboard moved to x 1.0 so mum, the kid, the box and the cupboard share one frame; the final tilt moved to the door side so Minh no longer blocks it; S16 widened and its paddles placed either side of the last box.

- Render: `CONC=3 scripts/render.command MonacoReel Monaco_v1` → `Drafts/Monaco_v1.mp4` (1440x2560, 76.0 s, 90 MB), about 30 min on the Mac. Chunk 4 crashed the browser once (a GPU timeout on the first frame); re-running the same command resumed it and it finished.

### Open
- Seen only as sweep stills: check the window pass (S02/S03), the porter's carry, the 17 rips and the kitchen snatch in motion.
- The scooters are simple blocks; the porter crowds the left of frame in the S05 crown beat.

| Time | Note | Scene | What changed |
|---|---|---|---|

## Round 1 (Frame.io `Monaco_v1.csv`, 21 Nov 2026): "a lot of glitch in the whole video"
| Time | Comment | Scene | What changed and why |
|---|---|---|---|
| 0:26.17 (f797) | "too much glitch here please fix" | S05 macro on the box | The plinth's gold rim and its white top shared the plane y 1.30 (z-fighting band); the box lid overhung by only 2 mm (its outline broke into flickering dashes); the shrink-wrap shell 3 mm off the box drew ink and cast a shadow onto it. Fixed: audited per-box inset (no shared planes), lid overhang 6 mm, wrap and glass on NOINK with no shadows. |
| 0:56.09 (f1689) | "here glitch as well" | S12 cellar pull-back | The rack's back board and the stone wall shared z -2.8, and every shelf and divider met them face to face: whole cubbies flipped light/dark frame to frame. The cellar also had no ceiling (sky showing). Fixed: per-box inset, a ceiling at 2.84 m. |
| (whole reel) | "a lot of glitch in whole video" | all sets | Same cause everywhere: boxes built face to face (window frames in the wall openings, table tops on their drapes, chairs, stage). The set builder now records every box and floor quad, insets each by its own 0.5-4.6 mm chosen so no face lands in another's plane, and prints `[coplanar] N`: N = 0. Camera near plane 0.12 m (was 0.05) for depth precision. The shadow frustum is now frozen per shot and texel-snapped (tested: not the cause here, kept as hardening). |

**Why it got through:** the checks were single stills (sweep sheets). Flicker only exists between frames, so a still can't show it.
**Measured:** `scripts/flicker.py` (pixels that pop away and back in solid patches while the frames either side agree). Monaco v1: 12 runs, the cellar alone 250 frames at up to 15 % of the frame. Attic v2 (approved): 4 tiny runs. Fixed Monaco, five-frame runs every 30 frames: 0 at both notes; 3 short runs left at fast camera moves (window fly-in f435, glide past the porter f735, dolly-out f915), checked frame by frame and passed as motion (ink-line crawl, in every reel).
**Prevention, now in the workflow:** `scripts/flickcheck.command` before every render (kickoff and feedback skills, production flow, rules §6); every render ends with a flicker report on the video; `new_reel.sh` now scaffolds from `monaco/` so new reels get the audited `box()`. And `render.command` refuses to reuse cached chunks made from older code without a REDO: Monaco v2 would otherwise have reused v1's glitchy chunks.
**Also affected (not fixed yet):** Chocobo and Fanatics drafts score high on the meter for the same reason (their sets predate the audit).
Taste: glitches read as broken, whatever the story; a reel must be flicker-free before it is sent.

