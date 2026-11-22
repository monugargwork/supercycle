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
