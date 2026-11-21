#!/usr/bin/env python3
"""Flicker / glitch finder: single stills can't show flicker, this measures it.

  python3 scripts/flicker.py <video.mp4 | folder of consecutive frames f_<n>.jpg> [--report out.txt] [--cuts 1081,1633]

For every frame (on a small grey copy) it counts the pixels that pop: the frames before and after agree, but this frame jumps
away from both in the same direction. Smooth motion (pans, glides, walking) scores ~0 because a moving edge makes the two
neighbours disagree; flicker (a shadow or a surface that pops on and off, z-fighting, swimming shadow edges) scores high. It then flags runs of
frames whose score is far above the local level. Scene cuts and dissolves are skipped with --cuts (frames to ignore +-2).
Exit code 1 if anything is flagged, so a render can be refused.
"""
import os, subprocess, sys, glob
import numpy as np

W, H = 135, 240
LIMIT = 0.3   # % of the frame popping away and back in solid patches; calibrated on Monaco v1 (glitchy) vs Attic v2 and the fixed Monaco

def frames_from_video(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    return a, list(range(len(a)))

def frames_from_dir(d):
    fs = sorted(glob.glob(os.path.join(d, "f_*.jpg")), key=lambda p: int(os.path.basename(p)[2:-4]))
    idx = [int(os.path.basename(p)[2:-4]) for p in fs]
    out = []
    for p in fs:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
        out.append(np.frombuffer(raw, np.uint8).reshape(H, W).astype(np.float32))
    return np.array(out), idx

def main():
    src = sys.argv[1]; args = sys.argv[2:]
    rep = args[args.index("--report") + 1] if "--report" in args else None
    cuts = [int(x) for x in args[args.index("--cuts") + 1].split(",")] if "--cuts" in args else []
    F, idx = frames_from_dir(src) if os.path.isdir(src) else frames_from_video(src)
    n = len(F)
    score = np.zeros(n)
    for i in range(1, n - 1):
        if idx[i + 1] - idx[i] != 1 or idx[i] - idx[i - 1] != 1: continue  # only true consecutive triples
        a, b, c = F[i - 1], F[i], F[i + 1]
        # a flicker pixel: its neighbours agree with each other, and the middle frame jumps away from both in the same direction
        # (a moving edge doesn't count: there the two neighbours disagree)
        pop = (np.abs(a - c) < 8) & (np.abs(b - a) > 18) & (np.abs(b - c) > 18) & (np.sign(b - a) == np.sign(b - c))
        # solid patches only (3x3 here = ~24x24 px of the frame): z-fighting and popping shadows flip whole areas, while the
        # ink lines' sub-pixel crawl during a dolly (ordinary line aliasing, present in every reel) is thin and is not counted
        er = pop.copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1): er &= np.roll(np.roll(pop, dy, 0), dx, 1)
        pop = er
        score[i] = np.mean(pop) * 100
    skip = set()
    for c in cuts:
        for k in range(c - 3, c + 6): skip.add(k)
    flagged = [(idx[i], score[i]) for i in range(n) if score[i] > LIMIT and idx[i] not in skip]
    lines = []
    # group into runs
    runs, cur = [], []
    for f, s in flagged:
        if cur and f - cur[-1][0] > 8: runs.append(cur); cur = []
        cur.append((f, s))
    if cur: runs.append(cur)
    # a glitch persists (z-fighting, a popping shadow): keep runs of 2+ frames, or a single frame only if it is strong
    runs = [r for r in runs if len(r) >= 2 or max(x for _, x in r) >= 2.0]
    for r in runs:
        a, b, worst = r[0][0], r[-1][0], max(s for _, s in r)
        lines.append(f"flicker f{a}-f{b} ({len(r)} frames hit, worst {worst:.1f}% of pixels)")
    lines.append(f"{len(runs)} flicker runs; median score {np.median(score[1:-1]):.2f}%, frames checked {n}")
    print("\n".join(lines))
    if rep: open(rep, "w").write("\n".join(lines) + "\n")
    sys.exit(1 if runs else 0)

if __name__ == "__main__":
    main()
