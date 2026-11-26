"""Fit a camera to its subjects (math only): the closest lens that keeps every point inside the 9:16 safe area
(6 % sides, 4 % top or 23 % under a title, bottom 12 %), for a given view direction and fov.
  from plan_fit import fit
  pos, look = fit(points, az=-10, el=-8, fov=44, title=False, margin=1.0)
az: compass angle of the view in degrees (0 = looking toward -z, +90 = toward -x); el: pitch (negative looks down).
Points are [x, y, z] set-local. The look point is re-centred on the subjects' screen box, then the distance is minimised."""
import math
from plan_lib import project

def _dir(az, el):
    a, e = math.radians(az), math.radians(el)
    return [-math.sin(a) * math.cos(e), math.sin(e), -math.cos(a) * math.cos(e)]

def _ok(cam, pts, top, margin):
    for p in pts:
        x, y, _ = project(cam, p)
        if x is None or not (6 + margin <= x <= 94 - margin) or not (top + margin <= y <= 88 - margin): return False
    return True

def fit(pts, az=0.0, el=-6.0, fov=44.0, title=False, margin=1.0, d_max=40.0):
    d = _dir(az, el); top = 23 if title else 4
    look = [sum(p[i] for p in pts) / len(pts) for i in range(3)]
    r = [-d[2], 0, d[0]]; rl = math.hypot(r[0], r[2]) or 1; r = [r[0] / rl, 0, r[2] / rl]
    t = math.tan(math.radians(fov) / 2); ty = (top + 88) / 2; dist = d_max / 3
    for _ in range(8):   # alternate: re-centre the look point on the subjects' screen box at this distance, then find the closest distance
        for _ in range(4):
            cam = dict(pos=[look[i] - d[i] * dist for i in range(3)], look=look, fov=fov)
            pr = [project(cam, p)[:2] for p in pts]
            if any(x is None for x, _ in pr): break
            xs, ys = zip(*pr); cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
            look = [look[i] + r[i] * (cx - 50) / 50 * dist * t * 9 / 16 for i in range(3)]
            look[1] -= (cy - ty) / 50 * dist * t
        lo, hi = 0.3, d_max
        for _ in range(40):
            mid = (lo + hi) / 2
            cam = dict(pos=[look[i] - d[i] * mid for i in range(3)], look=look, fov=fov)
            if _ok(cam, pts, top, margin): hi = mid
            else: lo = mid
        dist = hi
    pos = [round(look[i] - d[i] * hi, 3) for i in range(3)]
    return pos, [round(v, 3) for v in look]

if __name__ == "__main__":
    print(fit([[0.98, 1.75, -0.82], [0.98, 0.02, -0.82], [1.2, 1.75, -1.58]], az=10, el=-6, fov=44))
