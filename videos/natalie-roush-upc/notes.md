# Natalie Roush (Night UPC): notes

Composition `RoushReel` (to be built) · code `src/videos/roush/` · assets `public/roush/`

## Build log (v1, 27 Nov 2026)
- VO "Generated Audio November 27, 2026 - 5_59PM.wav" saved as `voice_src.wav`; script unchanged from `script.md`. `vo_words.py`: 272 words, speech ends 76.44 s = f2293; reel 2330 f.
- `check:` lines were digits and spellings (2.200, 30, 179, 11, 320, 12, Rouse/Roush, lễ/lẻ, đỉnh/định), except one: whisper dropped "tới vé chợ đen." (interpolated into the 0.9 s pause). Re-transcribed 52.5-59 s and set them by hand: 54.94 / 55.08 / 55.22 / 55.42, ending 55.58 s.
- Cards: `umbreon_pe` (library); `magikarp_ar` (sv2 203) fetched into the library.
- `beats.md` written (17 scenes, 2 cuts); waiting for the user's OK.
- Beats approved by the user ("Beats OK, build").
- Plan: `mkplan.py` → `plan.json` (21 scenes, 2 hard cuts, 0 errors; warnings: two fast glides at f543/f712, her feet in the caption band at S16's first frame). Four sets: the high street (bus stop, cafe, cinema, plaza with the FOR SALE board, one set), her creator room, the resale shop, the dock. `direction.md`, `plan_view.jpg`.
- Build scaffolded from Mesa (`BASE=mesa scripts/new_reel.sh natalie-roush-upc Roush`): `src/videos/roush/` (story, sets, cast, world, art2 rewritten; looks), `audio/roush_audio.py`, `RoushReel` / `RoushCaptions` in Root.tsx. Captions from `captions.txt` via `mkcaptions.py` (63 phrases).
- Cards: `magikarp_ar` (held up, ~45 % of the frame width f730-773), `umbreon_pe` (the lid's window). Memes: Kaching (tower, coin), Discord pings (plaza), Huh (WHERE FROM?), Suspicious (the '?'), Hehe (the tout), Computer Error (deleted), Camera shutter (gallery, end), Wow (Magikarp). Mix -14.7 LUFS, TP -2.2.
- Sweep fixes: fitted wides landed outside the sets in 9:16 (room 12 m back, plaza camera inside a house, final street 42 m out) → layouts tightened (plinths, counter, cinema stand, crowd, walkers), room/shop extended to the lens, far houses moved to z 38 behind a park; S01/S03 cameras set by hand; tripod and ring light moved out of the centre line; seller moved clear of the tower; all decals unlit (signs, posters, calendar, cork, lid and box art were dull under Lambert); the Magikarp raised beside her face and the push aimed at its real position (logged from the engine); the film tin held at his side, not over his face; Khoan orbit widened so her head stays in frame.
- Flicker check: `[coplanar]` 0 (after fixing two shelf/dado faces); three short runs f555, f704, f1514 are camera pushes (looked at the frames: smooth motion), passed.
