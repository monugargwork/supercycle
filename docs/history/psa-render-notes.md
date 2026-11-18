# PSA Truck Theft reel: render on your PC

The reel is 62.8 s, vertical 1080x1920 at 30 fps. Final export is 2K (1440x2560).
It is made with the **cartoon-3d-short** skill (three.js inside Remotion).
The voice, music and SFX are already mixed into `public/psa/mix.wav`, so your render comes out **with sound**. There's no muxing step.

## 1. One-time setup
You need Node 18+ and ffmpeg. Then run:
```
npm install
```
The first render downloads Remotion's headless Chrome by itself.

## 2. Render the final 2K video
```
npx remotion render src/index.ts PsaReel out/psa_reel.mp4 --codec h264 --crf 16 --scale 1.3333 --concurrency 3 --gl angle --timeout 120000
```
- `--gl angle` uses your GPU. This is what makes it fast, much more than the core count.
  - With a GPU it takes roughly 10–30 minutes.
  - On a CPU-only machine use `--gl swangle`. It works, but it's slow (hours).
- On the M1 MacBook Air, use `--concurrency 2` so it doesn't throttle.
- For a quick 1080p preview, drop `--scale 1.3333`.
- To render a section only, add `--frames=0-300`.

## 3. Preview / tweak in the browser
```
npx remotion studio
```
Then pick the **PsaReel** composition.

## Where things live
| Path | What |
|---|---|
| `src/videos/psa/story.ts` | Timeline: every shot, camera move, depth of field and impact, timed to the voice (frame numbers) |
| `src/videos/psa/cast.ts` | Who is in each shot, poses, expressions, pop-up effects (numbers, stamps, envelopes, badges) |
| `src/videos/psa/sets.ts` | The 3D sets: Santa Ana street + grading facility, delivery truck, collector's house, server room, card shop, alley |
| `src/videos/psa/art.ts` | 2D drawings: slabs, original creature cards, calendar, monitor, icons |
| `src/videos/psa/toon.ts` | Character drawing kit (masks, sunglasses, FBI jackets, police cap, held items added) |
| `public/psa/` | `voice.wav` (your ElevenLabs VO), `words.json` (word timings), `mix.wav` (final sound) |
| `audio/psa_audio.py` | Rebuilds `mix.wav`: `python audio/psa_audio.py public/psa/voice.wav public/psa/mix.wav` (needs numpy + scipy) |

If you change shot timings in `story.ts`, re-run the audio script so the SFX still land on the right frames (event frames are listed at the top of `story.ts`).

## Using real slab photos
- Put up to 4 slab photos in `public/psa/cards/` as `slab1.png` … `slab4.png` (or `.jpg`).
- They replace the drawn slabs everywhere, with an outline so they match the art style.
- Use only images you have the rights to use.

## Notes
- Brands are kept generic on purpose.
  - The truck has no FedEx livery.
  - The slabs have a red label but no PSA logo.
  - The card art uses our own creatures, not real Pokémon art.
  - Signs use icons instead of words.
- On-screen text is only numbers plus "THÁNG 10 / 13", so it works with the Vietnamese VO.
- Temp space: each render bundles `public/` (small here, ~20 MB), so disk use stays low.
