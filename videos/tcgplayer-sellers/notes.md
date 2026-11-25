# Tcgplayer: notes

Composition `TcgplayerReel` · code `src/videos/tcgplayer/` · assets `public/tcgplayer/`

## Build log (v1, 22 Nov 2026)
- VO `8 - TCGplayer.mp3` saved as `voice.mp3`; script unchanged from `script.md` (topic 8, approved). `vo_words.py` (run with `../.venv/bin/python3`: the system python has no numpy/whisper): 276 words, VO ends 77.66 s = f2330; reel 2360 f. Every `check:` line was a number or a spelling (TCG Player, 1 tỷ, Jiven, "cáo" for "cáu").
- The user asked for the whole reel without stopping ("start this without stopping until you have a render command"), so beats went straight to direction and build with no beat review.
- Tone: a business comedy of manners. Generic cartoon people (no likenesses of Rob Bigler, Ron Jaiven or the South Dakota shop owner); the shop owner's message is the VO's paraphrase. Plain lettering only for eBay / TCGplayer (no logo art).
- Plan: `mkplan.py` -> `plan.json` (16 scenes, 6 sets, 2 hard cuts plus the S07 reaction cut, 0 check errors; warnings: the S04 cake and the S15 phone touch the caption band, S06/S15 glides are quick pushes). `direction.md`, `plan_view.jpg`.
- Cards: Magic Alpha scans new in the library (`mtg-lea`: Lightning Bolt, Serra Angel, Sol Ring, Llanowar Elves, from Scryfall) plus Base Set Charizard, Pikachu, Blastoise, Venusaur. Charizard is the listing that the TCGplayer Direct copy lands on.
- Base: the Jirachi build (`BASE=jirachi new_reel.sh`), engine imported unchanged. New pieces worth adding to library/INDEX.md after review: the workroom (packing table, laptop with a yawed lid and a live page, wall TV counter, PHÍ jar with coin hops, price-scanner screen, stamp + envelope, party popper with confetti that lands and stays), HQ (split-flap GMV board with a pull lever, eBay sign + hanging TCGplayer plate, night window canvas with fireworks/dome/plane, spinning nameplate, desk papers that take BÁC BỎ / ĐÃ SỬA stamps, party cake), the Syracuse front with a roller shutter, the market hall with a twin stall on castors, the card shop, the boardroom with a money sack drop.
- Laptop POV: a 9:16 frame can't hold a landscape screen, so the page content lives in its centre column (x 200-824) and the camera sits on the screen's normal (laptop turned toward the seller, lid tilted 0.4).
- Captions: `mkcaptions.py` (69 phrases, longest 26 characters). Sound: `audio/tcgplayer_audio.py` (pizzicato underscore, party brass, sad pad for Syracuse, vibes for the market; memes: Kaching x2, BRUH, Emoji Laugh on "phim hài", Huh on "Khoan", Discord notification, Instagram Thud on the sack, Sad Violin at the end; -14.6 LUFS, TP -2.4).
- Sweep fixes before v1: cameras pulled back (cartoon heads filled the frame); the laptop moved to his right so the plate and envelope read in front of him; the cake box replaced by an eBay toothpick flag in the slice (the box hid the plate); the HQ board digits narrowed so the $ fits; steam moved beside the head (it covered his eyes); the market camera moved to the left so the buyer and the manager stop covering the seller; the market hall deepened (the first camera sat outside the wall); the boardroom seller moved to the table's near corner so he doesn't hide the sack.

### Open
- Seen only as sweep stills: check the confetti fall, the coin hops, the Direct listing drop, the shutter, the nameplate spin and the sack drop in motion.
- S10: Rob sits at the left edge of the frame while plane 1 lands; the window is the subject there.
- The market manager pushes the twin stall from its far end, mostly out of frame on the right.
- Flicker check: `[coplanar] 0`; 2 short runs over 365 frames (f134-136 the push onto the stamp with confetti falling, f674-676 the glide to the scanner): both camera motion, passed after looking at the frames.

## v2: re-edit to the 25 Nov quality bar (25 Nov 2026)
The user asked to re-edit this reel to the new rules (`docs/rules.md` section 0).
| Rule | What changed |
|---|---|
| No blur | Lens blur and DOF off in `Reel.tsx`; every plan key has `blur: 0` (`k()` forces it). |
| No shadows | Sun casts no shadows; the contact blobs under the cast are gone. |
| Bright reference palettes, no tinted grade | The colour grade is off; the shading's violet shade side is now a warm neutral and saturation is 1.3 (`BRIGHT` in `world.ts`). Workroom: cream striped wallpaper, warm wood floor, red rug. HQ: warm wood panelling, red carpet, rich-blue night window with warm lit windows. Boardroom: cream walls, green carpet, oxblood chairs, light wood table, two windows on a cloudy sky. Market and shop moved from the golden preset to daylight (the golden light turned cream walls purple). Suits brightened (Rob royal blue, Ron tan, VIPs red/blue/green/purple). Measured mean saturation of the sweep: 50.8 vs 45.7 for the Mirror reel (same measure). |
| Blue skies with clouds | Every window now shows a blue sky with inked puffy clouds (`cloudSky`); the Syracuse street shows the day sky above the building. |
| Dressed sets | Framed real cards on the walls (workroom, HQ, shop, boardroom), bookshelf of binders and plants in HQ, a plant, boxes, desk lamp and rug in the workroom, lit windows with flower boxes, trees and a cornice at Syracuse, goods on the back market stalls, coloured panels on the hall walls. |
| Wider cameras | Cameras rebuilt medium-wide (full bodies with the set around them), wide at each new place; close-ups kept only for the stamp, the laptop/phone screens and the scanner. Every character subject is now head and feet in `plan.json`, so `plan_check.py` fails a shot that cuts a body (0 errors). |
| Sharp, recognisable cards | The Base Set scans online top out at 600x825 (pokemontcg.io and pkmncards), so the Pokémon cards are now the 151 set's 733x1024 scans (Charizard ex SIR 199, Blastoise ex SIR 200, Venusaur ex SIR 198, Pikachu 25; new in the library under `sv3pt5`). On "Magic" and "Pokémon" the laptop shows one big card (Lightning Bolt, then Charizard ex) about 60 % of the frame width. The laptop canvas is drawn at 2.5x, card textures at 732x1024. |
| Always vertical | The shop scene split into a wide (S15) and a phone POV (S16, through-object dissolve), because the camera glide into his eyes passed through his head; the market is shot from the left so the two stalls stack in depth. |
- **Bug found (base reels):** in `world.ts` a comment swallowed `cam.updateProjectionMatrix()`, so the plan's fov never reached the camera (every shot rendered at the default 40 deg). Fixed here; the same line is in `fossil`, `gengar`, `goldenrod`, `jirachi`, `lucas` and `monaco` and should be fixed when each is re-edited.
- Flicker check: `[coplanar] 0`; the same two motion runs as v1 (f134-136 the push onto the stamp with confetti, f674-676 the glide to the scanner), passed after looking at the frames.
- Render as a new version: `scripts/render.command TcgplayerReel Tcgplayer_v2`.
