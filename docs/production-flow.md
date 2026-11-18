# Story reels: the per-reel loop

Work happens in a Claude Code session opened on the Mac folder `~/Movies/Story Reels/story-reels` (a clone of this repo), or in a cloud session on the repo. Each reel lives in two places in this repo:
- `videos/<slug>/` holds the story and its history: script, facts, voice, words, beats, plan, direction, notes, card sources.
- `src/videos/<reel>/` + `public/<reel>/` + `audio/<reel>_audio.py` hold the build.

Commit and push after every stage.

## 1. Script (skill `vn-news-script`)
1. The user feeds a news story or article. Confirm the facts with a second source.
2. Write one Vietnamese paragraph, 220-280 syllables (about 60 s), with an act-hook.
3. Save `videos/<slug>/script.md` and `facts.md`.

## 2. Voiceover and timing
1. The user records the approved VO (ElevenLabs) and sends it.
2. Save it as `videos/<slug>/voice.mp3`.
3. Run `python3 scripts/vo_words.py videos/<slug>/voice.mp3 videos/<slug>/script.md videos/<slug>/`. This writes `voice.wav` and `words.json` and prints the timed line table.
4. Check every `check:` line it prints: a word whisper misheard was interpolated there.

## 3. Direction (skill `story-reel-director`)
1. Write `beats.md`, the film on one page. Wait for the user's OK unless he said not to wait.
2. Write `plan.json`. Use a generator script in the video folder (see `videos/mudkip-art-academy/mkplan.py`).
3. Check and document the plan:
   - `python3 scripts/plan_check.py videos/<slug>/plan.json` checks the safe area (aim for 0 errors).
   - `python3 scripts/plan_view.py videos/<slug>/plan.json videos/<slug>/plan_view.jpg` draws the top-down blocking sheet.
   - `python3 scripts/plan_md.py videos/<slug>/plan.json videos/<slug>/head.md > videos/<slug>/direction.md` writes the readable direction.

## 4. Build
1. Copy the newest reel folder as the base (`src/videos/mudkip/` today), then rename the exports. Register the new composition in `src/Root.tsx`: `<Reel>Reel` at 1080x1920 and `<Reel>Captions`.
2. Put the assets in `public/<reel>/`:
   - `voice.wav` and `words.json`;
   - `cards/*.png`, which must be real scans;
   - `memes/`, sounds from the user's meme library (`~/Downloads/meme sounds` on the Mac);
   - `mix.wav`, built by the audio script below.
3. Hand-chunk the captions in `captions.ts`, timed from `words.json`.
4. Build the sound with `cd audio && python3 <reel>_audio.py ../public/<reel>/voice.wav ../public/<reel>/mix.wav`. Aim for about -14 LUFS, true peak under -1.

## 5. Check
1. Render stills:
   - on the Mac (a session opened on `~/Movies/Story Reels/story-reels`), use `scripts/stills.command <Reel>Reel <f1>,<f2>,…`, which writes `out/<Reel>Reel/chk_<f>.jpg` on the GPU, about a second each;
   - in a cloud session, use `COMP=<Reel>Reel node scripts/stills.mjs out/<reel>/<prefix>_ <f1>,<f2>,…`, about 20 s each.
2. Make contact sheets with `python3 scripts/sheet.py out.jpg <cols> files…`.
3. Sweep about one still every 60 frames, plus every beat and hero moment. Fix anything that breaks the rules, and log what changed in `notes.md`.
4. Full-resolution video renders in the cloud are far too slow (about 2.5 min per frame with no GPU). Renders go to the Mac.

## 6. Render (Mac)
1. Push, then give the user the command:
   ```
   cd ~/Movies/"Story Reels"/story-reels && scripts/render.command <Comp> <Name>_v<n>
   ```
2. The output lands in `Story Reels/Drafts/`, or in `Final Render/` for a name ending `_final`.
3. Lambda is parked until the user's AWS access is fixed (an explicit deny on IAM user `remotion-user`). Enzo's `.github/workflows/lambda-render.yml` and `scripts/lambda/` are the model when it comes back.

## 7. Review and fixes
1. Notes arrive as a Frame.io CSV, with frames at 30 fps. Map each one to a scene and fix it.
2. Add a row to `notes.md` (time, note, scene, what changed) and a one-line taste note. Rejections go in `taste/rejected.md`.
3. Re-render as little as possible:
   - **Changed chunks:** `REDO=7,8 scripts/render.command …` re-renders chunks 7 and 8 (60-80 s, 10 s per chunk) and reuses the rest.
   - **Overlay:** list the changed frames in the reel's `PATCH_FRAMES` (see `src/videos/mudkip/Reel.tsx`). `PATCH=1 scripts/render.command <Comp> <Name>_patch` then makes a transparent ProRes 4444 `.mov` with no sound, which the user lays over the previous version at 0:00.

## 8. After the reel is final
- Promote new moves, props and fixes into `library/INDEX.md`.
- Delete `Drafts/.chunks/<Comp>` on the Mac.
