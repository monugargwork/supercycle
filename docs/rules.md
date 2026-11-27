# Story reels: the rulebook

One page of rules every reel follows. Where an older note disagrees, this page wins. When the user repeats a reaction, it gets promoted here; when he rejects something, it goes in `taste/rejected.md`.

## 0. The quality bar (client verdict, 25 Nov 2026)
The client found the first nine reels unprofessional. Their four complaints:
- colours dull;
- very little detail;
- TCG cards blurred and unrecognisable;
- cameras so tight that characters and main subjects get cut off.

The characters were explicitly approved: keep them exactly as they are. These rules come first, ahead of anything below:
- **The four reference reels (`~/Downloads/reference`) are the bar.** Copy their look; don't invent our own. Every check sheet is judged next to a reference frame. Their average saturation is 25-39; ours was 20-26.
- **Only what we can do perfectly.** Leave out anything that can't be done perfectly; no half measures.
- **Always vertical (9:16).** Sets and layouts are designed for the tall frame: subjects stack top to bottom or front to back, never side by side as if for landscape. (Goldenrod S2 put the shop sign and the town sign side by side, and both got cut.)
- **No blur of any kind.** No depth of field, no lens blur, no defocus: every frame sharp edge to edge. Remove DOF from the base reel and the plans.
- **No shadows at all.** No cast shadows from characters, props or sets; they came out inaccurate. Ground things by contact: feet exactly on the floor, props resting on surfaces.
- **Bright, aesthetic colours like the references.** The colour choices were bad, not only the saturation. Use sky blue, grass green, warm wood, cream, red-and-white stripes, strong primaries under bright sun.
  - Build each set's palette from colours sampled from the reference reels. Greys, near-black navy and muddy or desaturated purples are banned (`taste/rejected.md`).
  - Daylight or warm interiors by default. A night story is rich blue with warm practical lights, never grey-blue.
  - The grade adds no blue tint.
- **Blue skies with clouds** behind every outdoor shot: a blue gradient with puffy white inked clouds, built in code so every shot and reel matches.
- **Detail everywhere.** No empty walls, bare floors or flat-colour backgrounds. Every set is dressed: shelves full of product, posters, signs, wood/tile/carpet textures, and distant buildings or landscape behind.
- **Cameras much wider.** About 80% of shots were cropped too tight.
  - Medium-wide is the default: characters full body, with the set around them.
  - Every new location opens on a wide shot.
  - Close-ups at most about 1 shot in 4, only where the moment needs one (a reaction, a card reveal).
  - Every shot lists its main subjects in `plan.json`, and no subject, character head or body may be cut by the frame edge. The check must fail the shot, not rely on someone noticing.
- **Cards sharp and recognisable.**
  - Use the largest scan available (aim for 1000 px or more on the long side; the old scans were about 600x825). Draw it at at least twice its on-screen size, with mipmaps on, in a material that keeps its true colours.
  - When the voiceover names a card, it fills at least 40% of the frame width for 1.5 s or more, sharp and brightly lit.
- **Real slabs, never drawn ones.**
  - Use a real photo of the exact slab (auction lot pages, PSA/CGC cert lookups, eBay listings), cut out cleanly and placed as a flat object with a glass shine.
  - If only a label must change (grade, cert number, card name), edit the real photo with Grok Imagine. The CLI is signed in on the Mac: `~/.grok/bin/grok -p "…" --tools image_edit --always-approve --max-turns 4`.
  - The prompt names exactly what may change and forbids everything else. Zoom in and check every letter against the real card and label; replace Grok's watermark corner with pixels from the original photo; redo if any text is smeared.
  - Each Grok run uses the user's plan, so only run it for slabs that need it.
- **Never use Higgsfield** in this project: it is expensive. Only the user asks for it.
- **Python image tools:** `~/Downloads/Enzo Projects/.venv-tools/bin/python` (Pillow, OpenCV, numpy) for palette, saturation and resolution checks.
- **Pilot first:** rework one reel (Goldenrod) to these rules, show before / after / reference side by side, and roll out to the other reels only after the user approves.

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
- Limbs never stretch or shrink; the arm is about 0.47 m. To reach something, the body moves (steps closer, bends, crouches). `arm3d` warns `arm short by …` when a pose cheats.
- Expressions come from the face artwork (`Expr`). The jaw drop is `FrontOpts.gape` (0..1).
- **Nobody sits (iCaterpie review, 27 Nov 2026).** The seated front card can't be animated sitting down, standing up or acting from a seat: it reads as a person standing stiffly in front of a chair. So no chairs, stools, café tables with seated people, match tables, suitcases or benches to sit on. Stage people standing: at a bar-height table or counter, at a stall, against a wall, walking. A sad or tired beat is shown with the face, a slump of the head, the light, the set, not by sitting.

## 3. Real cards
- Every reel uses real TCG card scans (e.g. Pokémon), relevant to that story. Never drawn stand-in cards.
- Take a scan from the shared library (`library/cards/`, `python3 scripts/card.py find …`) when it has the right card; otherwise fetch it with `card.py add`, which stores it there for later reels. `card.py use <reel> …` copies scans into `public/<reel>/cards/` and writes `videos/<slug>/cards/SOURCES.txt`.
- Sources go in `videos/<slug>/cards/SOURCES.txt`. Hosts that work from the cloud shell: `images.pokemontcg.io` and `cdn6966.templcdn.com` (pokumon.com).

## 4. Direction
- Every detail of every scene is specified, camera positions included. `plan.json` is the source of truth; `story.ts` reads its camera keys, glides, pushes, kicks, dissolves and titles (no depth of field: section 0). Numbers are never retyped in code.
- Act, don't illustrate: every line gets a verb, a cause, a consequence and weight.
- The camera travels and rarely cuts. Time jumps dissolve (4-10 f); hard cuts are for punches (3 or fewer per reel).
- 2-3 hero moments get the full treatment; everything else is clear and in motion.
- **Only gags we can animate well (iCaterpie review, 27 Nov 2026).** A metaphor machine with several moving parts driven by the cast (a public scale with pans, chains, weights carried by two people and a swinging beam) came out badly. Before a gag goes in the beats, ask: can it be done with one simple motion, by one person, with a prop we've already made work? If it needs multi-person carrying, chains or linkages, coupled swinging parts, or people crouching to lift things, cut it or swap it for a simpler sight gag (a sign, a stamp, one object falling, a reaction). When in doubt, the simpler gag wins.
- The full grammar is in the `story-reel-director` skill.

## 5. Frame and text
- 9:16 safe area: every listed subject fully inside it at all times (`scripts/plan_check.py`); see section 0 for camera width.
- House titles: Enzo `Title2`, Bolota Bold, red box, in the zone at 13-23 % of the frame height. Keep key action out of that zone while a title is up.
  - Bolota lacks Ơ Ư Ầ Ệ Ỉ Ớ, so titles use digits and plain Latin only.
  - Title2 exit animations linger about 20 f after `out`: end titles early enough that they don't ghost over a face or a plate.
- Channel logo: the static Supercycle logo (`public/brand/supercycle_logo.png`, `src/brand/Logo.tsx`) sits top right on every reel from the Fanatics reel on (older reels stay without it), at x 771-1023, y 118-268 of the 1080x1920 frame (71-95 % across, 6-14 % down). Small overlaps are fine; only move things when what is under the logo would be completely hidden.
- Captions: Inter Regular, white with a black outline, in the band at 70-76 % of the frame height, hand-chunked per phrase. They're on by default in every reel (stills, previews and the main render); `{"captions":false}` turns them off.
- Diegetic text belongs on real objects (boards, labels, screens). No floating labels or 3D number cards.
- Sparkles and FX never cover a card face.

## 6. Look and build
- Stay on three.js + Remotion (Blender was considered and parked).
- No shadows at all (section 0). Interiors still get ceilings, so no sky shows through.
- A camera never sits inside geometry, and coplanar surfaces never flicker (raise one plane).
- **No flicker (the Monaco v1 "glitch", 21 Nov 2026).** Two faces in one plane (a panel on a wall, a rim on a plinth top, a shelf against a back board) z-fight: the GPU can't tell which is in front, and the winner changes frame to frame as the camera moves. Stills can't show it. So:
  - Sets build boxes with the audited `box()` helper (the Monaco `sets.ts`): every box is pulled in by its own 0.5-4.6 mm, chosen so no face lands in the plane of another, and the build prints `[coplanar] N coplanar overlaps`. N must be 0.
  - Transparent shells (glass, shrink-wrap) draw no ink and cast no shadow; a lid or trim overhangs by at least 5 mm, never 1-2 mm.
  - Camera near plane 0.12 m (not 0.05) for depth precision; interiors have a ceiling.
  - Check before rendering with `scripts/flickcheck.command <Comp>`, and read the flicker report every render prints. Fast camera moves can register as short runs: look at those frames and pass them only if they are motion.
- 30 fps. The composition is 1080x1920; renders come out at exactly 4/3 of that, 1440x2560.

## 7. Working with the user
- No waiting when he says "don't wait for my permission". Otherwise ask before anything expensive or hard to undo.
- When he asks how long a render takes, answer with the time for a render in the cloud.
- His notes come as a Frame.io CSV (frame numbers at 30 fps). Each note is mapped to a scene ID in `videos/<slug>/notes.md`, with what changed and why.
- Small fixes never mean a full re-render: re-render the chunks that changed (`REDO=`), or give him a transparent overlay of only the changed frames (`PATCH=1`).
