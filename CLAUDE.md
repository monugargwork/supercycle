# Story reels (3D cartoon) — read this first

This is the Remotion project for the user's animated story reels: Vietnamese voiceover stories about TCG collecting, told with flat 2D cartoon characters in an inked three.js world.
- Compositions are 1080×1920 at 30 fps; renders come out at 1440×2560.
- This repo (`monugargwork/supercycle`, **public**) is the **single master copy** of the code, assets, rules, taste and each reel's history. Renders never go in here.
- Enzo's main-channel reels are a separate project (`monugargwork/Enzo`, folder `~/Downloads/Enzo Projects/enzo-remotion`); only Enzo's `Title2` titles and fonts are shared (`src/enzo/`).
- **Where you are:** usually a Claude Code session opened on the Mac folder `~/Movies/Story Reels/story-reels` (this repo, cloned), the same way the user works on Enzo. Sometimes a cloud session on the GitHub repo. Either way the repo is the truth.

## Before any work, read
1. `docs/rules.md`, the rulebook. Logic and physics first; stick-figure cards; real TCG cards; every detail directed, cameras included.
2. `docs/production-flow.md`, the per-reel loop: script, VO, direction, build, check, render, review, fixes.
3. `docs/sources.md`, the sources we edit with: the four loved reference reels (`~/Downloads/reference`), the meme-sound library (`~/Downloads/meme sounds`), the ElevenLabs voice, where real card scans come from, fonts, the original kit, Frame.io reviews.
4. `library/INDEX.md`, the moves, props and helpers we have and where they live.
5. `taste/rejected.md`. Never pitch these again.
6. `videos/<slug>/notes.md` (plus `plan.json`, `direction.md`) for the reel you're working on.

Workflow skills in this repo (`.claude/skills/`, also typed as commands): `/story-kickoff` for a new reel, `/story-feedback` for a round of notes, `/story-final` for an approved reel.
Account skills they call: `vn-news-script` (the script), `story-reel-director` (beats, plan, direction), `cartoon-3d-short` (the look; the original kit is in `templates/`, `references/` and `SKILL.md`).

## Hard rules
- **Logic and physics above everything**; pixel-perfect design second. Exaggeration stays physically possible.
- **Characters** are the prebuilt 2D toon stick figures: plain line limbs, no hands or feet, fixed limb length.
- **Real TCG card scans** in every reel, fetched fresh and relevant to the story. Never drawn stand-ins.
- **Captions** on every reel, burned in and on by default (stills and previews show them too); write `captions.ts` for each reel. **Channel logo** (Supercycle, top right) on every reel from Fanatics on; small overlaps with it are fine.
- **`plan.json` is the source of truth** for cameras and timing. Numbers are never retyped in code, and the plan is updated when the build changes something.
- **Commit and push after every change**, in batches (about 60 files, well under 100 MB per push). A session on the Mac works directly in this folder and never leaves uncommitted changes; end every session with `notes.md` updated and pushed. A cloud session pushes too (then `git update-ref refs/remotes/origin/main HEAD`), and the Mac launchers pull before every preview and render. If a push from the Mac is refused (403), the Keychain token doesn't cover this repo yet: tell the user to add `supercycle` to that GitHub token's repository access.
- **Renders run on the Mac** for now (Lambda is parked until the user's AWS access is fixed). Claude gives the exact command and the user runs it; Claude runs it only when asked. On the Mac, Claude checks its own work with stills on the GPU, as contact sheets (`scripts/sweep.command`, about a second a frame, 9 frames per sheet). In a cloud session there is no GPU: stills only, about 20 s each.
- When the user asks how long a render takes, answer with the time for a cloud render.
- **Small fixes never mean a full re-render.** Use `REDO=<chunks>` (10 s each), or a transparent overlay of only the changed frames (`PATCH=1`, which needs `PATCH_FRAMES` in the reel's `Reel.tsx`).
- **Every user note** (they arrive as Frame.io CSVs, frames at 30 fps) gets a row in `videos/<slug>/notes.md` with what changed and why. Repeated reactions get promoted into `docs/rules.md`; rejections go into `taste/rejected.md`.
- When a doc in `docs/` changes, update its mirror in the claude.ai Project "enzo stories" (`claude/<same name>.md`) too.

## Saving credits
- **One session per reel**: the user keeps a whole reel (kickoff, build, every feedback round, final) in a single session, and the user switches model and effort by hand. Claude never starts extra sessions for a reel's stages and never changes levels on its own.
- **Look at sheets, not stills**: check with `scripts/sweep.command` (9 frames per image); open a single full still only to inspect a detail.
- **Read `direction.md`, not raw `plan.json`** (71 KB). Change the plan through its generator script (`mkplan.py`), then regenerate `direction.md`.
- **Don't read the engine** (`src/engine/`) unless the scene needs an engine change; the per-reel files and `library/INDEX.md` are enough.
- **Mechanical side jobs** (finding card scans, copying assets, renaming exports) can go to a subagent on a cheaper model (`sonnet` or `haiku`).

## Layout
| Path | What |
|---|---|
| `src/index.ts`, `src/Root.tsx` | Register the compositions: `MonacoReel`, `ChocoboReel`, `FanaticsReel`, `MudkipReel`, `AtticReel`, `GpsReel`, `PsaReel` (each with a `…Captions` comp), `BridgeShort`, `CharTest` |
| `src/engine/` | The shared engine (toon characters, ink, shading, paint, lights, grade, lens blur, geometry). New reels import it; changes must be additive |
| `src/videos/<reel>/` | One folder per reel: that reel's story, sets, cast, art, captions and `Reel.tsx` (see `library/INDEX.md`). The newest base is `fanatics/` (it carries the channel logo; older reels stay without it). Attic, GPS, PSA and Bridge still hold their own engine copies |
| `src/enzo/` | Enzo's `Title2` titles and the Bolota font loader |
| `public/<reel>/` | Each reel's assets: `voice.wav`, `words.json`, `mix.wav`, `cards/` (real scans), `memes/` |
| `public/fonts/` | Fonts |
| `audio/` | Synthesized score and SFX, plus the mix per reel (`<reel>_audio.py`) |
| `scripts/` | Mac launchers (`render.command`, `Open Studio.command`, `sweep.command`), `new_reel.sh` (scaffolds a reel), `card.py` (the card library), plan tools (`plan_*.py`), `vo_words.py`, stills and sheets |
| `library/cards/` | Every real card scan fetched so far, stored once and listed in `CATALOG.md`; reels copy from here |
| `videos/<slug>/` | Each reel's story and history: `script.md`, `facts.md`, `voice.*`, `words.json`, `beats.md`, `plan.json` (+ its generator), `direction.md`, `plan_view.jpg`, `notes.md`, `cards/SOURCES.txt` |
| `docs/`, `library/`, `taste/` | Rules, flow, move library, rejections; `docs/history/` has older notes |
| `SKILL.md`, `templates/`, `references/` | The original cartoon-3d-short kit (mromidev/claude-animated-shorts) and its reference reports |

| Reel | Composition | Video folder | Status |
|---|---|---|---|
| Monaco auction (sealed Delta Species box) | `MonacoReel` (2280 f) | `videos/monaco-auction/` | v1 built and rendered on the Mac (20 Nov 2026) |
| Golden Chocobo private sale | `ChocoboReel` (2275 f) | `videos/golden-chocobo/` | v1 built, ready to render (19 Nov 2026) |
| Fanatics unpaid Pikachu | `FanaticsReel` (2325 f) | `videos/fanatics-unpaid-pikachu/` | v1 built, ready to render (19 Nov 2026) |
| Mudkip Art Academy | `MudkipReel` (2250 f) | `videos/mudkip-art-academy/` | v1 reviewed; jaw-drop fix delivered as a patch overlay (18 Nov 2026) |
| Attic Pokémon millions | `AtticReel` | `videos/attic-pokemon-millions/` | v2 rendered on the Mac |
| Pokémon GPS tracker | `GpsReel` | `videos/pokemon-gps-tracker/` | done |
| PSA truck heist | `PsaReel` | `videos/psa-heist/` | done |

## Commands
- New reel: `scripts/new_reel.sh <slug> <Name>` (story folder at once; the build once `plan.json` exists). Cards: `python3 scripts/card.py find|add|use …`.
- Check a reel: `scripts/sweep.command MudkipReel 60 333,1501` (every 60 frames plus beats → `out/MudkipReel/sweep/sheet_*.jpg`, frames listed in `sheets.txt`); only some frames: `scripts/sweep.command MudkipReel 0 333,1501`. Single stills: on the Mac `scripts/stills.command MudkipReel 120,640,1500` (→ `out/MudkipReel/chk_<f>.jpg`); in the cloud `COMP=MudkipReel node scripts/stills.mjs out/mudkip/x_ 120,640,1500`. Contact sheet: `python3 scripts/sheet.py out.jpg 3 files…`.
- Preview on the Mac: double-click `scripts/Open Studio.command` (it pulls first).
- Render on the Mac (the user runs it; Claude gives the exact line; `out/` and the render folders are never committed):
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

The one-time `Connect to GitHub.command` (a copy of `scripts/Connect to GitHub.command`, left in `Story Reels/`) made the clone and set pushes to use the GitHub token in the Mac's Keychain; double-clicking it again just updates. Node: the Mac's own, else nvm's, else `~/Downloads/Enzo Projects/.node/bin` (`scripts/common.sh` finds it). The old folder `~/Movies/psa-reel` holds the renders made before the move (`out/`).
