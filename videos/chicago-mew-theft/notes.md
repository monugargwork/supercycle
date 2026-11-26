# Chicago: notes

Composition `ChicagoReel` · code `src/videos/chicago/` · assets `public/chicago/`

## Build log (v1, 26 Nov 2026)
- VO `Chicago shop.mp3` saved as `voice.mp3`; script as in `script.md` (the approved paragraph). `vo_words.py` (run with `../.venv/bin/python3`; the system python has no numpy): 274 words, VO ends 80.32 s = f2410; reel 2440 f. Every `check:` line was a number or a spelling (300, 4.000, 1.800, 6.700, Skool/School, thìa/thịa).
- The user asked to "edit this now using updated instructions", with no subagents and attention to scene detail. So beats went straight to direction and build with no beat review, and everything was fetched inline.
- Facts as in `facts.md` (Fox32 sequence, $6,700 total). No likenesses: the owner is a generic cartoon (not drawn as Nick Bruni), and the thief was never described. His phone number on screen is a fictional 555 number. Nobody is arrested on screen (none was reported); the ending gag is only his own phone ringing.
- Cards (all real):
  - **Red RGB Mew:** the 30th Celebration Mew R/RGB (`rgb_mew_r`). The only scan available is TCGplayer's 660x920, upscaled 2x (Lanczos + light sharpen) in `public/chicago/cards/`.
  - **Three slabs:** real listing photos in `library/slabs/`. The PSA 8 Scream Psyduck 286/SM-P, cert 159083058: the seller had greyed the cert strip, restored from their other photo of the same slab with a SIFT homography. The PSA 10 Celebrations gold Mew 025/025, cert 118194158 (the $150 "PSA 10 Celebrations Mew" read as the gold 25/25, because an 11/25 PSA 10 sells for far less). The CGC 10 Evolutions M Charizard EX 13/108.
  - **Box fillers and framed cards** are library scans. New in the library: `evo_mzard`, `cel_mew_gold`, `cel_mew`, `rgb_mew_r`.
- Plan: `mkplan.py` → `plan.json`, 21 scenes in 3 sets, 0 check errors; the 14 warnings are feet touching the caption band and brisk glides.
  - **Sets:** the shop, whose interior, facade and street are one set so the camera can fly through the window and the door glass; the house; the jacket lining.
  - **Character shots** are fitted by the new `scripts/plan_fit.py`: the closest lens at a chosen direction that keeps every subject in the safe area with a 5% margin. Heads are checked at the crown and across their width, because the cards are ~55 cm wide.
  - **Hard cuts:** one (S17, the handshake to the lens on "Tiệm").
- Direction choices:
  - **Staging along the counter:** man, box, register and owner side by side, so the cash, the box and both faces read in one tall frame. The stolen items sit in the slots nearest his right hand, so every reach is within the fixed arm length.
  - **Box state:** every theft leaves a gap that stays. The S01 hook is the S08 moment seen early, with the Red RGB Mew already gone.
  - **The haul:** the four cards are shown in his jacket lining (a POV insert), each with the shop's own price sticker, then all four under the $6,700 title.
  - **The house analogy** uses the same two characters: the guest brings a gift-wrapped booster box, and the spoon tray ends with one empty slot (rhyming with the box).
  - **His number** is set up on the caller ID (S04), paid off in S12 and S19 (the officer's notepad), and answered by his own phone ringing at the end.
- Sound: `audio/chicago_audio.py` (sneaky pizzicato for the thefts, bright plucks on the street, a music-box sparkle per card, brass on $6,700, a drone for the camera, a tape-stop freeze, vibes for the "you see", a sad pad, a smug brass exit). Memes:
  - Kaching ×3 (the hook's last bill, the register drawer, $6,700);
  - Suspicious (the first dip into the box);
  - Huh ("Khoan");
  - Hehe Boiiiiiii (the spoon);
  - Camera shutter ×2 (the REC lamp, the cut to the lens);
  - Yo Phone Ringing (his own phone);
  - Realization (his freeze).

  Mix -14.65 LUFS, TP -2.3, exactly 2440 f.
- Captions: `mkcaptions.py` (66 phrases, longest 30 characters).
- Sweep fixes before v1:
  - restaged the hook and S06-S08 along the counter (the owner was hidden behind the man);
  - lowered the box walls to 6 cm with the flaps folded down (the items sank below the rim);
  - made the fitter re-centre at the final distance and check head width;
  - deepened the shop to z 5.4 so medium-wide cameras fit inside it;
  - S04 became a view from the counter toward the door; S16's walk to the case is shot from the front-right (not through the monitor pole);
  - added a close on the spoon tray in S15, put the handset at the owner's ear (it was on his forehead) and the phone at chest height at the end;
  - raised the caller-ID screen out of the phone base and separated the handset's cradle from it;
  - made the pockets less milky; brought the vertical sign and the water tower into the street frame.

- Flicker check: the first run found 7 coplanar pairs: the house's kitchen walls, the counter's kick plate against its base, the glass case's posts against its base. All fixed, so `[coplanar] 0`. Six short runs remain over 395 frames, all passed after looking at the frames:
  - camera motion: f464-466 (the glide down to the phone), f496 (the glide toward the door), f1274-1276 (the climb to the ceiling camera), f1364-1366 (the glide after the freeze), f1454-1456 (the glide to the caller ID);
  - deliberate animation: f2384-2385 (his phone's 2-frame buzz).
- No `arm short` warnings anywhere: every reach is within the fixed arm length.

### Open
- Seen only as stills: the bills slapping into his palm, the door swings, the case door and padlock, the walk to the shelves and to the case, the handshake pumps, the phone buzz, all still to be checked in motion.
- The CGC slab photo reads GEM MINT 10; the stolen copy was a Pristine 10 (gold label). A Grok label edit was skipped because it would change the label colour, not just text.
- The Red RGB Mew scan is an upscale of a 660x920 source; it is the softest card in the jacket shots.
