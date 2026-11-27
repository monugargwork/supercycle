# Retford: notes

Composition `RetfordReel` · code `src/videos/retford/` · assets `public/retford/`

## Build log (v1, 27 Nov 2026)
- VO "Generated Audio November 27, 2026 - 1_29PM.wav" saved as `voice_src.wav`; script unchanged from `script.md`. `vo_words.py` (`../.venv/bin/python3`): 278 words, VO ends 79.74 s = f2392; reel 2425 f.
- `check:` lines were digits and spellings (1, 26, 12, Redford/Retford, đồng/đồn …), except one: whisper heard "hai." for "hàng bị mất. Mười" (56.7-58.1 s). Fixed by hand from the silence: "mất." ends 57.22 s, "Mười" starts 58.03 s (0.8 s pause).
- `beats.md` written (17 scenes); the user approved it ("Beats OK, go").
- Plan: `mkplan.py` → `plan.json` (17 scenes, 6 places: the Retford estate with its road west under the two gantries and the police station east, one set; the kid's room; the control room; the Manchester storage yard; the Mansfield court front; the courtroom). 0 check errors; warnings are feet touching the caption band and the fast travels. Three hard cuts: S03 (outside to the bell; the camera can't leave the warehouse through B at the hole), S06 ("Khoan"), S15. The van's route out of the yard is in the plan (`van_route`, dense samples) so the build and the checks follow the same path.
- Changes from the beats: S04 is the night wide with the van in the side yard (the beats had it across the road; at night it is at the hole). The RETFORD town sign stands on the pavement in front of the unit so the wide can hold it. S03 is a cut instead of a camera exit through the hole.
- Base: the Chicago build (`BASE=chicago new_reel.sh`); story, sets, cast, world, art2, looks rewritten; no engine change. Night uses the engine's `night` light; every set material is the toon `lam()` (plain Lambert went near-black at night).
- Cards: real scans in the shop window (S04 by night, S05 by day, S17): `zard151`, `blast151`, `venu151`, `pika151`, `bubble_mew` from the library; new `umbreon_pe` (Prismatic Evolutions Umbreon ex SIR 161/131, 733x1024). No card is named in the VO, so none gets the 40% hold.
- No likenesses or names: hooded burglars with eye masks, generic suits; the business is never named (the sign says TRADING CARDS); the detective is "DETECTIVE" on a lanyard. Allegations only: the last court beat is the notice board's plea hearing.
- Gags, one motion each (27 Nov rules): the plug falling in, one carton at a time, the calendar pages, the label swap, the route drawing itself, one dropped carton, the turn at the RETFORD signpost, a kid pushing the door. Nobody sits (empty van cab, standing dock, tall desk, no chairs in the courtroom).
- Captions: `mkcaptions.py` (60 phrases, longest 34 characters). Sound: `audio/retford_audio.py` (-14.8 LUFS, TP -1.2; memes: Huh on "Khoan", the camera shutter when the camera wakes, the suspense riser into the arrest, the realization sting at the signpost).
- Sweep fixes before v1 (three rounds): the van moved deeper into the yard (its pillar blocked the hook and S06) and the lamp post moved off its route; the hole panels, signs and the notice board were black at night (toon materials); S02 restaged inside (the camera was in B's face); S04 wide refitted with a phone box, post box and bare tree in front; the S05 calendar halved; the plate moved in front of the rear doors; S07, S11 and S12 cameras were looking the wrong way round; the yard cabin and an officer blocked the arrest (cabin moved, marks changed, container doors folded back); the hedge ran through the police station; the signpost arms all showed one name (shared material); the S16 notice was cropped; the court bollards filled the foreground.
- Flicker check: `[coplanar]` 0 after one fix (the court's front step against the wall). Runs left, all looked at: f134-136 (S02, the camera glides past B: motion), f1184-1186 (S09 pull back to the kid), f1304-1305 (S10 push to the map), f1555-1556 and f1574-1576 (S12, out of the van and over to the detective). The S12 glide used to pass through the van's wall and an officer: rerouted.

### Open
- Seen only as stills: the plug's fall and the loose bricks, the calendar pages, the label peel, the police car's slide, the dropped carton's bounce, the door swings; check them in motion.
- S02: B fills the frame for about 4 frames as the camera glides past him (a whip-by).
- Render as v1: `scripts/render.command RetfordReel Retford_v1`.
