# Mesa: notes

Composition `MesaReel` · code `src/videos/mesa/` · assets `public/mesa/`

## Build log (v1, 27 Nov 2026)
- VO `voiceover 2.wav` saved as `voice.mp3` (+ `voice.wav`); script unchanged from `script.md`. `vo_words.py` (with `../.venv/bin/python3`): 266 words, VO ends 82.52 s = f2476; reel 2510 f. Every `check:` line was a number or a spelling (3.000, 12, Miramesa, "meal" for Mew, "xe đanh" for sedan, quỷ/quỹ, buồn/bù, chảy/chạy).
- Beats approved by the user ("Beats OK, build"); then plan, build and checks in this session, no subagents.
- Facts as in `facts.md` (two 10News reports). No likenesses: the family is generic, unnamed; the thief was never described; the sedan is a generic black sedan (we don't have the police photos); no arrest shown.
- Card: "Bubble Mew" = Paldean Fates Mew ex 232/091 SIR (`bubble_mew`, new in the library). The reports don't say it was graded, so it sits in a magnetic one-touch case with a $3,200 tag (no invented grade or cert). The only scan is 733x1024, upscaled 2x (Lanczos + light sharpen) in `public/mesa/cards/`. It fills ~60 % of the frame width in S03 (f460-545) under the BUBBLE MEW title. The replica in S16 is the same scan with a REPLICA sticker. Tray and booth cards are library scans.
- Plan: `mkplan.py` → `plan.json`, 19 scenes in 2 sets (the gym with the school front, plaza and lot outside it; the beach promenade), 0 check errors; the warnings are feet touching the caption band and the S01 whip after the runner (f112). Hard cuts: S09 (Khoan, the freeze), S12 (the phone POV), S18 (the far lot).
- Direction choices:
  - **Short arms decide the blocking:** the table is 50 cm deep; dad steps to the easel to lift the case (S04), the woman hands the replica to dad, who passes it to the girl (S16), the officer stands beside the flyer to pin it (S14).
  - **The loss stays:** the empty easel with its swinging $3,200 tag in every booth shot after S05 until the replica (S16); the knocked top-loaders lie on the floor through S06-S09 and are picked up by S13.
  - **The joke, seen from the doors (S06):** dad laughs straight at the lens, palm still open, while the stranger runs past it; then the locked shot of the doors swinging shut (S07).
  - **The chase is a limp:** progress in uneven lurches (a short dip on the bad heel), pain stars on "đau" and "đau thêm", he stops; the sedan backs out of its bay beyond him and drives off (S08).
  - **The analogy:** the phone POV is a real phone frame in front of the lens with his two arms coming up from below; the side view shows every eye on the phone.
  - **Ending:** her LOOK WITH YOUR EYES sign taped to the table front (S17), then on every table in the hall for the crane (S19).
- Sound: `audio/mesa_audio.py` (bright plucks in C for the show and the morning, sneaky A-minor plucks for the hand-over and the run, a chase beat for the limp, vibes for the "you see", a ukulele-like pluck at the beach, sad pad for the empty easel, a low firm line for the police, a warm hopeful theme for the replica and her sign). Memes: Suspicious ×2 (his glances), Gogogogogo (the bolt), Emoji Laugh (the joke), Huh (Khoan), Bone Crack (đau thêm), Meme Violin (the empty easel), Kaching (into the jar), Runner Game (the far runner). Mix -14.63 LUFS, TP -1.68, exactly 2510 f.
- Captions: `mkcaptions.py` (65 phrases, longest 31 characters).
- Sweep fixes before v1: cameras behind the back wall (S01 whip, S06) and outside the building (S08's second key, S10, the S19 crane) re-keyed inside the sets; S06 re-staged from the doors (dad laughs at the lens); the S08 camera passes out through the open doorway and the doors stay held open; S09 became a hard cut (the glide passed through a palm); the sedan moved in line with the doors (bay at x 4.2, z 24.4) and the cars cleared from the school-front view; the easel's front legs crossed the card (now posts behind it); the card close-ups look down so the girl's body isn't the background; the notice board's frame covered the cork and the flyer; the officer steps aside after pinning; the jar moved off the cash tin; court keys made smaller and translucent; a shopper beside the lens moved; a palm moved out of the beach side shot; the dark knobs on the POV arms removed.
- Stills while another session was mid-edit on the Retford reel (its half-rewritten files broke the shared bundle): `scripts/stills.mjs` now takes `ENTRY=` (default unchanged), and an ignored `out/entry_mesa.tsx` registers only this reel.

### Open
- Seen only as stills: the run, the top-loaders' fall, the doors' swing and settle, the limp's lurches, the sedan backing out, the tag's pendulum, the hand-overs in S10, the bills dropping into the jar: check in motion.
- The render needs the whole project to bundle: if the Retford session's files are still mid-edit when you render, `render.command` will fail to bundle until that session commits working files.
