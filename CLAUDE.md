# Story reels (3D cartoon) — read this first

This is the Remotion project for the user's animated story reels: Vietnamese voiceover stories about TCG collecting, told with flat 2D cartoon characters in an inked three.js world.
- Compositions are 1080×1920 at 30 fps; renders come out at 1440×2560.
- This repo (`monugargwork/supercycle`, **public**) is the **single master copy** of the code, assets, rules, taste and each reel's history. Renders never go in here.
- Enzo's main-channel reels are a separate project (`monugargwork/Enzo`); only Enzo's `Title2` titles and fonts are shared (`src/enzo/`).

## Before any work, read
1. `docs/rules.md`, the rulebook. Logic and physics first; stick-figure cards; real TCG cards; every detail directed, cameras included.
2. `docs/production-flow.md`, the per-reel loop: script, VO, direction, build, check, render, review, fixes.
3. `library/INDEX.md`, the moves, props and helpers we have and where they live.
4. `taste/rejected.md`. Never pitch these again.
5. `videos/<slug>/notes.md` (plus `plan.json`, `direction.md`) for the reel you're working on.

Skills: `vn-news-script` (the script), `story-reel-director` (beats, plan, direction), `cartoon-3d-short` (the look; the original kit is in `templates/`, `references/` and `SKILL.md`).

## Hard rules
- **Logic and physics above everything**; pixel-perfect design second. Exaggeration stays physically possible.
- **Characters** are the prebuilt 2D toon stick figures: plain line limbs, no hands or feet, fixed limb length.
- **Real TCG card scans** in every reel, fetched fresh and relevant to the story. Never drawn stand-ins.
- **Captions** are burned into the main render (`{"captions":true}`).
- **`plan.json` is the source of truth** for cameras and timing. Numbers are never retyped in code, and the plan is updated when the build changes something.
- **Commit and push after every change.** Push in batches (about 60 files, well under 100 MB per push). After pushing, run `git update-ref refs/remotes/origin/main HEAD`.
- **The Mac folder is a GitHub clone.** Never write code into it directly: push, and its launchers pull before every preview and render.
- **Renders run on the Mac** for now (Lambda is parked until the user's AWS access is fixed). Claude writes the code and gives the exact command; the user runs it. The cloud has no GPU, so check stills only there.
- When the user asks how long a render takes, answer with the time for a cloud render.
- **Small fixes never mean a full re-render.** Use `REDO=<chunks>` (10 s each), or a transparent overlay of only the changed frames (`PATCH=1`, which needs `PATCH_FRAMES` in the reel's `Reel.tsx`).
- **Every user note** (they arrive as Frame.io CSVs, frames at 30 fps) gets a row in `videos/<slug>/notes.md` with what changed and why. Repeated reactions get promoted into `docs/rules.md`; rejections go into `taste/rejected.md`.
- When a doc in `docs/` changes, update its mirror in the claude.ai Project "enzo stories" (`claude/<same name>.md`) too.

## Layout
| Path | What |
|---|---|
| `src/index.ts`, `src/Root.tsx` | Register the compositions: `MudkipReel`, `AtticReel`, `GpsReel`, `PsaReel` (each with a `…Captions` comp), `BridgeShort`, `CharTest` |
| `src/videos/<reel>/` | One folder per reel: engine copy plus that reel's story, sets, cast and art (see `library/INDEX.md`). The newest base is `mudkip/` |
| `src/enzo/` | Enzo's `Title2` titles and the Bolota font loader |
| `public/<reel>/` | Each reel's assets: `voice.wav`, `words.json`, `mix.wav`, `cards/` (real scans), `memes/` |
| `public/fonts/` | Fonts |
| `audio/` | Synthesized score and SFX, plus the mix per reel (`<reel>_audio.py`) |
| `scripts/` | Mac launchers (`render.command`, `Open Studio.command`), plan tools (`plan_*.py`), `vo_words.py`, stills and sheets |
| `videos/<slug>/` | Each reel's story and history: `script.md`, `facts.md`, `voice.*`, `words.json`, `beats.md`, `plan.json` (+ its generator), `direction.md`, `plan_view.jpg`, `notes.md`, `cards/SOURCES.txt` |
| `docs/`, `library/`, `taste/` | Rules, flow, move library, rejections; `docs/history/` has older notes |
| `SKILL.md`, `templates/`, `references/` | The original cartoon-3d-short kit (mromidev/claude-animated-shorts) and its reference reports |

| Reel | Composition | Video folder | Status |
|---|---|---|---|
| Mudkip Art Academy | `MudkipReel` (2250 f) | `videos/mudkip-art-academy/` | v1 reviewed; jaw-drop fix delivered as a patch overlay (18 Nov 2026) |
| Attic Pokémon millions | `AtticReel` | `videos/attic-pokemon-millions/` | v2 rendered on the Mac |
| Pokémon GPS tracker | `GpsReel` | `videos/pokemon-gps-tracker/` | done |
| PSA truck heist | `PsaReel` | `videos/psa-heist/` | done |

## Commands
- Check stills (cloud): `COMP=MudkipReel node scripts/psa-stills.mjs out/mudkip/x_ 120,640,1500`. Contact sheet: `python3 scripts/sheet.py out.jpg 3 files…`.
- Preview on the Mac: double-click `scripts/Open Studio.command` (it pulls first).
- Render on the Mac (the user runs it; Claude gives the exact line):
  `cd ~/Movies/"Story Reels"/story-reels && scripts/render.command <Composition> <Name>_v<n>`
  - After a fix: `REDO=7,8 scripts/render.command …` re-renders only chunks 7-8 (60-80 s); `REDO=all` starts fresh.
  - A transparent overlay of only the changed frames: `PATCH=1 scripts/render.command <Composition> <Name>_patch`, which writes a `.mov`.
  - A name ending in `_final` goes to `Final Render/`, otherwise to `Drafts/`.
- Type check: `npm run tsc`. Reel.tsx has known R3F typing errors; ignore those.

## Mac folders
`~/Movies/Story Reels/` contains:
- `story-reels/`: this repo, cloned;
- `Drafts/`: `<Name>_v1.mp4`, … (chunk cache in `Drafts/.chunks/`);
- `Final Render/`: `<Name>_final.mp4`.

The one-time `Connect to GitHub.command` (a copy of `scripts/Connect to GitHub.command`, left in `Story Reels/`) made the clone; double-clicking it again just updates. The old folder `~/Movies/psa-reel` holds the renders made before the move (`out/`).
