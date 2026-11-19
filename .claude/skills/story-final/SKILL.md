---
name: story-final
description: Finish an approved 3D story reel. Use when the user says a story reel is approved / final, or types /story-final.
---

# Final: an approved story reel

Run at medium effort. The bookkeeping (CLAUDE.md row, library and notes entries, snapshot branch, commit and push) goes to a low-effort `haiku` subagent; Claude checks it.

1. **Render** the final: `scripts/render.command <Comp> <Name>_final`. It lands in `~/Movies/Story Reels/Final Render/`. Use `REDO=` if only some chunks changed since the last draft.
2. **Learn:**
   - in `videos/<slug>/notes.md`, why each version was approved or changed;
   - new moves and props that worked get a row in `library/INDEX.md` (built in this reel);
   - rejections go into `taste/rejected.md`, and repeated reactions into `docs/rules.md`.
3. **Freeze it:**
   - mark the reel done in the table in `CLAUDE.md`;
   - its code is frozen from now on, and later reels copy from it rather than edit it. It still imports the shared engine (`src/engine/`), which only ever changes additively, so it keeps rendering the same; the snapshot branch below is the exact copy;
   - create a milestone branch `snapshot/<reel>-final`.
4. **Clean up,** after asking: `Drafts/.chunks/<Comp>` and old drafts on the Mac.
5. **Commit and push.**
