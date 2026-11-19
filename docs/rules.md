# Story reels: the rulebook

One page of rules every reel follows. Where an older note disagrees, this page wins. When the user repeats a reaction, it gets promoted here; when he rejects something, it goes in `taste/rejected.md`.

## 1. Logic and physics come first
- Logic and physics beat everything else; pixel-perfect design comes second. What a character sees on a screen must make sense from where it faces.
- Cartoon exaggeration must still be possible for the body and the world. A mouth can gape, but it stays on the face (no jaw past the chin, nothing reaching the floor).
- Every prop is carried from where it was to where it goes. Nothing pops in or out, and things that fall come to rest and stay there for later shots.
- Anything that falls, breaks, is thrown, tips, slides or bounces gets a rigid-body bake with believable mass (cannon-es, fixed 240 Hz step, baked and sampled per frame).
- A held screen is only seen from its owner's side (POV), never turned to face the viewer.
- One shared world: maps, signs and routes agree with the 3D sets.
- Minor detail mismatches don't matter and aren't worth flagging. Flag only what changes the story.

## 2. Characters
- They are the prebuilt flat 2D toon cards (bean body, round head, ink outline) billboarded in the 3D world. A full-3D rig was tried and rejected.
- They are stick figures: arms and legs are plain lines, with no hands, fingers, feet or shoes, even in close-ups. A limb just ends, and contact with a prop is the line's end touching it.
- Limbs never stretch or shrink; the arm is about 0.47 m. To reach something, the body moves (steps closer, bends, crouches, sits, lies down). `arm3d` warns `arm short by …` when a pose cheats.
- Expressions come from the face artwork (`Expr`). The jaw drop is `FrontOpts.gape` (0..1).

## 3. Real cards
- Every reel uses real TCG card scans (e.g. Pokémon), relevant to that story. Never drawn stand-in cards.
- Take a scan from the shared library (`library/cards/`, `python3 scripts/card.py find …`) when it has the right card; otherwise fetch it with `card.py add`, which stores it there for later reels. `card.py use <reel> …` copies scans into `public/<reel>/cards/` and writes `videos/<slug>/cards/SOURCES.txt`.
- Sources go in `videos/<slug>/cards/SOURCES.txt`. Hosts that work from the cloud shell: `images.pokemontcg.io` and `cdn6966.templcdn.com` (pokumon.com).

## 4. Direction
- Every detail of every scene is specified, camera positions included. `plan.json` is the source of truth; `story.ts` reads its camera keys, glides, pushes, kicks, depth of field, dissolves and titles. Numbers are never retyped in code.
- Act, don't illustrate: every line gets a verb, a cause, a consequence and weight.
- The camera travels and rarely cuts. Time jumps dissolve (4-10 f); hard cuts are for punches (3 or fewer per reel).
- 2-3 hero moments get the full treatment; everything else is clear and in motion.
- The full grammar is in the `story-reel-director` skill.

## 5. Frame and text
- 9:16 safe area: the subject inside it at all times (`scripts/plan_check.py`).
- House titles: Enzo `Title2`, Bolota Bold, red box, in the zone at 13-23 % of the frame height. Keep key action out of that zone while a title is up.
  - Bolota lacks Ơ Ư Ầ Ệ Ỉ Ớ, so titles use digits and plain Latin only.
  - Title2 exit animations linger about 20 f after `out`: end titles early enough that they don't ghost over a face or a plate.
- Channel logo: the static Supercycle logo (`public/brand/supercycle_logo.png`, `src/brand/Logo.tsx`) sits top right on every reel from the Fanatics reel on (older reels stay without it), at x 771-1023, y 118-268 of the 1080x1920 frame (71-95 % across, 6-14 % down). Small overlaps are fine; only move things when what is under the logo would be completely hidden.
- Captions: Inter Regular, white with a black outline, in the band at 70-76 % of the frame height, hand-chunked per phrase. They're on by default in every reel (stills, previews and the main render); `{"captions":false}` turns them off.
- Diegetic text belongs on real objects (boards, labels, screens). No floating labels or 3D number cards.
- Sparkles and FX never cover a card face.

## 6. Look and build
- Stay on three.js + Remotion (Blender was considered and parked).
- Shadows are light or absent; characters cast no shadows. Interiors get ceilings that cast no shadow, so no sky shows through.
- A camera never sits inside geometry, and coplanar surfaces never flicker (raise one plane).
- 30 fps. The composition is 1080x1920; renders come out at exactly 4/3 of that, 1440x2560.

## 7. Working with the user
- No waiting when he says "don't wait for my permission". Otherwise ask before anything expensive or hard to undo.
- When he asks how long a render takes, answer with the time for a render in the cloud.
- His notes come as a Frame.io CSV (frame numbers at 30 fps). Each note is mapped to a scene ID in `videos/<slug>/notes.md`, with what changed and why.
- Small fixes never mean a full re-render: re-render the chunks that changed (`REDO=`), or give him a transparent overlay of only the changed frames (`PATCH=1`).
