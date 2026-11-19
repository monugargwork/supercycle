---
name: story-kickoff
description: Start a new 3D animated story reel (Vietnamese VO, Pokémon/TCG story, three.js + Remotion). Use when the user sends a news story or article, a script, an approved voiceover, says "new reel" / "next edit", or types /story-kickoff.
---

# Kickoff: a new story reel

Start each reel in a new session, at high effort for direction and the build.

Read first: `CLAUDE.md`, `docs/rules.md`, `docs/production-flow.md`, `docs/sources.md`, `library/INDEX.md`, `taste/rejected.md`, and the `notes.md` of the two most recent reels (the table in `CLAUDE.md`).

## 1. Where are we?
- **A story or article, no script yet:** use the `vn-news-script` skill. Confirm the facts with a second source, then write `videos/<slug>/script.md` and `facts.md` (a short English slug). Hand him only the paragraph. Stop there until he records the voiceover.
- **An approved voiceover:** save it as `videos/<slug>/voice.mp3` (with the script, if he sends one). Run `python3 scripts/vo_words.py videos/<slug>/voice.mp3 videos/<slug>/script.md videos/<slug>/` and check every `check:` line.

## 2. Direct (skill `story-reel-director`)
1. Look again at the loved reference reels for the grammar (`docs/sources.md` §1; never copy them). Then write `beats.md`, and list the real TCG cards the story needs. Fetch fresh scans into `videos/<slug>/cards/`, with sources in `SOURCES.txt`.
2. Wait for his OK on the beats, unless he said "don't wait for my permission".
3. Write `plan.json` with a generator script next to it (as `videos/mudkip-art-academy/mkplan.py` does). Every scene, mark and camera key goes in it. Change it only through the generator, and read `direction.md` rather than the raw JSON.
4. Check and document it: `scripts/plan_check.py` (aim for 0 errors), `plan_view.py` and `plan_md.py` (which writes `direction.md`).

## 3. Build
1. Copy the per-reel files of the newest reel folder (`src/videos/mudkip/`: `Reel.tsx`, `story.ts`, `sets.ts`, `cast.ts`, `world.ts`, `art.ts`, `captions.ts`) to `src/videos/<reel>/` and rename the exports. The engine stays in `src/engine/` and is imported, not copied; read it only if a scene needs an engine change, and keep any change additive. Point `story.ts` at `../../../videos/<slug>/plan.json`.
2. Register `<Reel>Reel` (1080x1920) and `<Reel>Captions` in `src/Root.tsx`.
3. Put the assets in `public/<reel>/`: `voice.wav`, `words.json`, `cards/`, `memes/` (from `~/Downloads/meme sounds`). Copy the sound script to `audio/<reel>_audio.py` and build `mix.wav`.
4. Mechanical jobs (fetching card scans, copying meme sounds, renaming exports) can go to a subagent on a cheaper model.
5. Reuse before inventing. Tag every move `reuse:` / `adapt:` / `new` (from `library/INDEX.md`).

## 4. Check, then hand over
1. Sweep as contact sheets: `scripts/sweep.command <Reel>Reel 60 <beat frames>` on the Mac (every 60 frames plus every beat, 9 per sheet in `out/<Reel>Reel/sweep/`). Look at the sheets, and open a single still only for a detail. In the cloud: `scripts/stills.mjs` with `every:60`, then `scripts/sheet.py`.
2. Fix what breaks the rules, and log what changed in `videos/<slug>/notes.md`.
3. Commit and push. Then give him the render line:
   ```
   cd ~/Movies/"Story Reels"/story-reels && scripts/render.command <Reel>Reel <Name>_v1
   ```
4. Add the reel's row to the table in `CLAUDE.md`.
