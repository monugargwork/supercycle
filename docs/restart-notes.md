# Restart notes (decisions so far, nothing built yet)

Running list for the clean restart of the story-reel workflow. Add to it; build nothing until the user says.

## Decided
- 2026-11-10 · Stay on three.js + Remotion (Blender considered and parked).
- 2026-11-10 · **Characters go fully 3D.** No more flat 2D cards turned to face the camera: that is why hands could not grab, props teleported and a held phone's screen faced the viewer.
  - Stick-figure look kept: bean body, round head, plain line limbs with real joints. No hands, no fingers.
  - Faces stay hand-drawn 2D artwork on the head, swapped per expression.
  - Toon shading + ink outlines so it still reads as the same flat cartoon style.
  - Hands lock onto props (grab, carry, hand over, let go); characters can turn, show side/back, sit, crouch, walk with planted feet.

## Rules learned from PSA + GPS (for the one-page rulebook)
- Logic and physics above everything; pixel detail second.
- Every prop is carried by a hand from where it was to where it goes. Nothing pops in or out.
- A held screen is only ever seen from its owner's side (POV).
- One shared world: maps, signs and routes agree with the 3D sets.
- Light or no shadows; no character shadows.
- Never let a camera sit inside geometry; no flickering coplanar surfaces.
- Captions: Inter Regular, white with black outline, lower middle, burned into the main render.
- User renders on his Mac; Claude gives the exact command. Render-time questions: answer for a cloud render.
- Notes arrive as a Frame.io CSV (frame numbers at 30 fps).

## Proposed (not yet agreed)
- One-page rulebook replacing all older, conflicting rules.
- Rewrite the story-reel-director skill around the rulebook (prop timeline, POV logic, grey-box pass first). Script skill stays.
- Clean starter project: 3D stick-figure rig, prop timeline enforced in code, automatic pre-render check (camera in geometry, z-fighting, safe area, frame jumps), lighter shadows, motion blur, optional 60 fps.
- Free low-poly model packs (Kenney, Quaternius, Poly Pizza) restyled to match, instead of box-built sets.
- Theatre.js timeline editor so the user can nudge cameras and timing himself.
- Review loop: grey-box animatic first, Remotion Studio previews on the Mac, fast low-res drafts.
- Fresh chat per reel, kicked off from the rulebook.
