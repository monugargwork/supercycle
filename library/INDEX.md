# Move library: what we have and where it lives

New reels start from the newest reel folder (`src/videos/mudkip/`). The modules below are copied into each reel folder, so a fix made in one reel has to be carried into the base by hand. Tags in the direction: `reuse:<name>`, `adapt:<name>` (say what changes), `new` (say how it's built). Anything `new` that works gets a row here after the reel.

## Engine (same in every reel folder)
| Module | What |
|---|---|
| `toon.ts` | The flat cartoon characters. Includes: <ul><li>`Outfit`s and `Expr`essions</li><li>`frontPts`, which places the body and knows about sitting</li><li>`bodyFront` / `bodySide`</li><li>`FrontOpts.gape`, the jaw drop</li><li>FX sprites: `fxPuff`, `fxStars`, `fxRing`, `fxBurst`, `fxSplash`, `fxContact` and more</li></ul> |
| `cast.ts` | Staging per scene (`stage()` cases), 3D arms with a fixed length (`arm3d`, which warns when short), held props, the doubters chorus (`doubters()`) |
| `story.ts` | Reads `plan.json`: `SHOTS`, `XFADE` dissolves, `camAt`, `dofAt`, `KICKS`, `TITLES`, beat constants. Helpers `glide`, `smooth`, `easeOut`, `pop` |
| `sets.ts`, `world.ts` | Set builders (`buildSets`), moving pieces per frame (`pose()`), placed props (`placeProps()`) |
| `art.ts` | Canvas-drawn props and boards (list below) |
| `paint.ts` | Textures: wood, stone, cobble, brick, roof, grass, water, clouds (HD versions too) |
| `lights.ts`, `grade.ts` | Light presets (day, golden and more) and the colour grade per preset |
| `ink.ts`, `shade.ts`, `cardshade.ts`, `lensblur.ts` | Ink outlines, two-tone shading, card shading, depth-of-field blur |
| `Reel.tsx` | The composition: shots and dissolves, the flash, titles, captions, audio, and `PATCH_FRAMES` for overlay renders |
| `captions.ts` | Hand-chunked caption phrases timed from `words.json` |
| `src/enzo/` | Enzo's `Title2` titles (Bolota Bold, red box) and fonts |

## Props and boards (`art.ts`)
| Name | Built in | What |
|---|---|---|
| `slabReal` / `SLAB_ART` / `SLAB_GRADE` / `SLAB_TXT` | Mudkip | PSA-style graded slab around a real card scan, with a readable label and grade |
| `priceBoardW` | Mudkip | Auction price board whose value counts up; it widens ("wings") for big numbers |
| `datePlate`, `numeral`, `paddle` | Mudkip | Date plate, big numerals, bidder paddles |
| `consoleLower` / `consoleUpper`, `scribble` | Mudkip | Two-screen handheld console whose screens draw live; drawing strokes |
| `pack`, `packStrip`, `tornPile`, `blankCard` | Mudkip | Booster packs, a pack strip, torn wrappers, blank card stock |
| `loupeGlass`, `confetti`, `gust` | Mudkip | Loupe on a label, confetti, a gust that blows loose cards away |
| `padlock`, `shards`, `poof`, `sparkle` | PSA | Brass padlock with a separate shackle (hammer break with physics in `psa/physics.ts`), shards, smoke puffs, sparkles |
| `povPhone`, `townMapFull`, `routeSheet`, `mapPin` | GPS | A phone map seen from the holder's POV; one shared town map and route |
| `newspaper`, `crtPage`, `binderPage`, `cardHeap`, `cobweb`, `lightShaft` | Attic | Headline paper, CRT page, binder of cards, a heap of cards, cobwebs, attic light shafts |

## Moves
| Move | Reel / where | Notes |
|---|---|---|
| Hammer breaks a lock, with debris that stays | PSA (`psa/physics.ts`, `cast.ts`) | Wind-up, hold, strike on the word; the lock bounces twice and stays on the asphalt |
| Cash-sack slam hook | Mudkip S01 | The sack stays behind and above the head (arm length), never over the face |
| Balance scale (cards vs. villa) | Mudkip S15 (`cast.balance`) | Unequal arms along the view axis so it fits 9:16 |
| Reaction flip of the doubters chorus | Mudkip S02 / S09 / S19 | The same three faces go from laughing to shrugging to jaw drop (`gape`) |
| Card match across a desk | Mudkip S05 to S06 | The lens crosses to our side so the card isn't upside down |
| Locked frame with the state changing | Mudkip S08-S14 (auction board) | Same composition while the board, paddles and gavel advance |

## Scripts
| Script | What |
|---|---|
| `scripts/vo_words.py` | VO to `words.json` plus the timed line table (whisper large-v3, aligned to the script) |
| `scripts/plan_check.py`, `plan_view.py`, `plan_md.py`, `plan_lib.py` | Safe-area check, top-down blocking sheet, direction.md, the camera maths shared with story.ts |
| `scripts/stills.mjs`, `sheet.py`, `sbs_sheet.py`, `short_qa.py` | Check stills (`COMP=<Comp>`), contact sheets, side-by-side sheets, frame QA |
| `audio/*_audio.py`, `dsp.py`, `instruments.py`, `sfx_gen.py` | Synthesized score and SFX, plus the mix with ducking and loudness |
| `scripts/render.command`, `Open Studio.command` | Mac launchers that pull first: chunked renders with `REDO=`, transparent overlays with `PATCH=1` |
