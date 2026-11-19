# Fanatics: notes

Composition `FanaticsReel` · code `src/videos/fanatics/` · assets `public/fanatics/`

## Build log (v1, 19 Nov 2026)
- Script 2 of `tcg topics w scripts.pdf`; VO 77.1 s (2312 f), reel 2325 f. Beats approved by the user, direction straight to build ("go").
- Plan: `mkplan.py` -> `plan.json` (15 scenes, 2 hard cuts, 0 check errors; the hook's whip pan along the hall wall is a known fast-glide warning). The sold-wall corner sits 0.6 m nearer the stage than first planned (shift applied in `mkplan.py`) to shorten that pan.
- Captions: `mkcaptions.py` (hand-chunked phrases). Sound: `audio/fanatics_audio.py` (-14.7 LUFS, TP -1.8).
- New props (art.ts, worth adding to library/INDEX.md after review): sale `ticket` + `heroTicket` (corner fold showing a stamp on the back), `stampMark`, `bidBoard` (bids/hammer/premium/total), `wallCalendar`, `rubberStamp`, `steamCurl`, `frontPage` (EN/FR/VI), `stakeSign` + `soldRider`, `plaque`, `phoneBack`, `binderCover`, `levelFace`, `closedTag`, `spotCone`.
- Stand-ins: Gempire ties $108,000 / $336,000 to no named card; tickets show Base Set Mewtwo / Base Set Charizard.
- Sweep fixes before v1: hook camera pulled back; S02 paddles smaller and further; S03 camera looks down onto the papers; S06 aimed at the fold; S10 framed on the shredder; the yanked sign leans and lands away from the agent; museum visitors moved into frame, back visitors' phones lifted above the case; a fence piece beside the sold sign removed.

| Time | Note | Scene | What changed |
|---|---|---|---|
| (chat, 19 Nov) | "use this static logo at top on each video at this position" (future edits incl. this one, not older ones) | all | Supercycle logo added top right (`src/brand/Logo.tsx`, `public/brand/supercycle_logo.png`, x 771-1023 / y 118-268). New reels are now scaffolded from this reel so they carry it. Hook and stage cameras raised and the wall lettering moved left so the date plate and lettering stay clear of the logo. |
