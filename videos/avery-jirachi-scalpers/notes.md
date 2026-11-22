# Jirachi: notes

Composition `JirachiReel` · code `src/videos/jirachi/` · assets `public/jirachi/`

## Build log (v1, 22 Nov 2026)
- VO `6 - Scalpers.mp3` saved as `voice.mp3`; script unchanged from `script.md`. `vo_words.py`: 272 words, VO ends 74.0 s = f2221; reel 2250 f. Every `check:` line was a number or a spelling (at "để tang" whisper hallucinated a repeated phrase; the timing table is clean).
- The user asked for the whole reel without stopping ("start this without stopping until you have a render command"), so beats went straight to direction and build with no beat review.
- Tone: a child died. No jokes, no meme sounds; light carries the feeling (the hospital room greys after his death, S05; the family room dims as the curtains close, S13; the ending is golden). No likenesses of the family or the artist; the phone post shows short plain lines with the family's meaning, not invented quotes.
- Plan: `mkplan.py` -> `plan.json` (17 scenes, 1 hard cut into S09 "Khoan đã", 0 check errors; the box on the caption band for a moment in S07 is the only warning). `direction.md`, `plan_view.jpg` regenerated.
- Cards (new in the library): `jirachi_sir` (30th Celebration 155/128 Jirachi ex SIR, illus. Akira Egawa, pokellector scan) and the commons `c30_vulpix`, `c30_tropius`, `c30_cherubi`, `c30_volbeat` for the pack fan. No pack art was found: the pack is plain foil with "30" lettering. The hero card is drawn at 1.5x real size so it reads beside the big cartoon heads.
- New pieces (worth adding to library/INDEX.md after review): the seller's desk (monitor with a live listing page: typed title, counting price, grid of listings, 90% banner and small print, SOLD page, ENDED tiles; ring light; photo easel with the card in a top loader; 10 cash stacks that slide and a keeper that hops into the donation box), the hospital room (bed, IV pole, cabinet, stool with the phone on a mini tripod, flipping calendar, bin that fills), the family room (table, memorial candle, Avery's chair with his beanie, shelf with a framed photo drawn from the same toon kid, sliding curtains, mum's phone POV with a typed post and a POST tap), the studio (tilted drawing board, the painting that lifts into the window light). `looks.ts` holds the cast outfits (shared with the framed photo).
- Engine (additive): a `sad` expression in `src/engine/toon.ts` (downcast eyes, inner brows up, small frown); no older reel uses it.
- Grief dimming is a CSS brightness/saturation filter on the 3D layer per scene (`lightAt` in story.ts, from the plan's `dim` / `dim_ramp`).
- Captions: `mkcaptions.py` (63 phrases, longest 28 characters). Sound: `audio/jirachi_audio.py` (soft pads and a music-box theme, quiet SFX, no memes; -14.7 LUFS, TP -2.2).
- Sweep fixes before v1: every character camera pulled back 1.5-2x (the big cartoon heads filled the frame and hid the card); monitor pages redesigned into the centre column the over-the-shoulder camera sees; cash stacks were standing on edge (bundle dims read in the wrong order); the card faces are unlit (MeshBasic) so they read under the ring light; the ring light moved left of the card so it no longer blocks S09; the parents' "pained" face read as angry (new `sad`); Avery's card held lower so it never covers his jaw drop and stays clear of the captions; S02 framed under the titles; S16 pulled back so the price fits.
- Flicker check: `[coplanar] 0`, 0 flicker runs over 350 frames.

### Open
- Seen only as sweep stills: check the slap, the stacks sliding back, the keeper's hop, the curtains and the painting lift in motion.
- The dad draws the curtains facing the room (the toon cards always face the lens).
