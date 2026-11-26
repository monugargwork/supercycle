---
name: story-kickoff
description: Start a new 3D animated story reel (Vietnamese VO, Pokémon/TCG story, three.js + Remotion). Use when the user sends a news story or article, a script, an approved voiceover, says "new reel" / "next edit", or types /story-kickoff.
---

# Kickoff: a new story reel

Read first: `CLAUDE.md`, `docs/rules.md`, `docs/production-flow.md`, `docs/sources.md`, `library/INDEX.md`, `taste/rejected.md`, and the `notes.md` of the two most recent reels (the table in `CLAUDE.md`).

## 1. Where are we?
- **A story or article, no script yet:** run `scripts/new_reel.sh <slug> <Name>` (it makes `videos/<slug>/`), then use the `vn-news-script` skill. Confirm the facts with a second source, then write `videos/<slug>/script.md` and `facts.md` (a short English slug). Hand him only the paragraph. Stop there until he records the voiceover.
- **An approved voiceover:** save it as `videos/<slug>/voice.mp3` (with the script, if he sends one). Run `python3 scripts/vo_words.py videos/<slug>/voice.mp3 videos/<slug>/script.md videos/<slug>/` and check every `check:` line.

## 2. Direct (skill `story-reel-director`)
1. Look again at the loved reference reels for the grammar (`docs/sources.md` §1; never copy them). Then write `beats.md`, and list the real TCG cards the story needs. Look in the library first (`python3 scripts/card.py find …`); fetch only what's missing with `card.py add`, which keeps it there for later reels.
2. Wait for his OK on the beats, unless he said "don't wait for my permission".
3. Write `plan.json` with a generator script next to it (as `videos/mudkip-art-academy/mkplan.py` does). Every scene, mark and camera key goes in it. Change it only through the generator, and read `direction.md` rather than the raw JSON.
4. Check and document it: `scripts/plan_check.py` (aim for 0 errors), `plan_view.py` and `plan_md.py` (which writes `direction.md`).

## 3. Build
1. `scripts/new_reel.sh <slug> <Name>` sets up the build in one go: the per-reel files of the newest reel copied to `src/videos/<name>/` with exports renamed and paths pointed at this reel, `audio/<name>_audio.py`, `public/<name>/` with the voice and words, and both compositions registered in `src/Root.tsx`. The engine stays in `src/engine/` and is imported, not copied; read it only if a scene needs an engine change, and keep any change additive.
2. Cards: `python3 scripts/card.py use <name> <card>[:<alias>] …` copies the scans into `public/<name>/cards/` and writes `SOURCES.txt`.
3. Memes into `public/<name>/memes/` (from `~/Downloads/meme sounds`), then build `mix.wav` with the sound script.
4. Do mechanical jobs (fetching card scans, copying meme sounds, renaming exports) inline: no subagents (they burn credits). Only if one is truly unavoidable, `haiku` or `sonnet` at medium effort.
5. Reuse before inventing. Tag every move `reuse:` / `adapt:` / `new` (from `library/INDEX.md`).

## 4. Check, then hand over
1. Sweep as contact sheets: `scripts/sweep.command <Reel>Reel 60 <beat frames>` on the Mac (every 60 frames plus every beat, 9 per sheet in `out/<Reel>Reel/sweep/`). Look at the sheets, and open a single still only for a detail. In the cloud: `scripts/stills.mjs` with `every:60`, then `scripts/sheet.py`.
2. Flicker check: `scripts/flickcheck.command <Reel>Reel` (the `[coplanar]` count must be 0; look at every run it lists). Stills can't show flicker.
3. Fix what breaks the rules, and log what changed in `videos/<slug>/notes.md`.
4. Commit and push. Then give him the render line (it ends with a flicker report on the video; read it):
   ```
   cd ~/Movies/"Story Reels"/story-reels && scripts/render.command <Reel>Reel <Name>_v1
   ```
5. Add the reel's row to the table in `CLAUDE.md`.
