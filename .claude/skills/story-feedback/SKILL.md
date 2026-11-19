---
name: story-feedback
description: Apply a round of notes on a 3D story reel. Use when the user sends a Frame.io CSV or pastes comments on a story reel (Mudkip, Attic, GPS, PSA or a newer one), says "notes on <reel>" / "next round", or types /story-feedback.
---

# Feedback round on a story reel

Run each round in a new session, at medium effort (high only if a note needs a new scene or move).

1. **Which reel:** match it to a row in `CLAUDE.md`. Read its `videos/<slug>/notes.md`, `docs/rules.md` and `taste/rejected.md`.
2. **Get the comments:** usually a Frame.io CSV, where frame numbers are at 30 fps (`Frame` column). Map each comment to a scene ID with `plan.json`.
3. **Fix the cause everywhere it occurs,** not only at the timestamp. A gag reused in another scene gets the same fix, and you say so. Logic and physics come first. If a comment is unclear, ask instead of guessing.
4. **Check** the changed frames as a contact sheet, before and after: `scripts/sweep.command <Comp> 0 <f1>,<f2>,…` (9 frames per sheet in `out/<Comp>/sweep/`). Read `direction.md` for the scene, not raw `plan.json`, and change the plan only through its generator.
5. **Write it down:**
   - in `notes.md`, a table for this round: time · comment · scene · what changed and why, plus a one-line taste note;
   - rejections go into `taste/rejected.md`;
   - a reaction he has given twice gets promoted into `docs/rules.md`, and its mirror in the claude.ai Project goes up too;
   - new or changed moves go into `library/INDEX.md`.
6. **Re-render as little as possible:**
   - for the changed 10 s chunks, give `REDO=<n,…> scripts/render.command <Comp> <Name>_v<n+1>`;
   - if he wants to lay the fix over the old version in his editor, list the changed frames in the reel's `PATCH_FRAMES` (`Reel.tsx`) and give `PATCH=1 scripts/render.command <Comp> <Name>_v<n>_patch`, a transparent ProRes 4444 `.mov`.
7. **Commit and push,** then reply with the command and one line per comment (done, or a question).
