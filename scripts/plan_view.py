"""Top-down blocking sheet from a reel plan: python3 scripts/plan_view.py videos/<slug>/plan.json out.jpg
One panel per scene: set objects as boxes, marks with names, each camera key as a numbered position with its view cone and look line,
glides as arrows between keys. x right, z down (so the lens usually sits at the bottom of a panel)."""
import sys, math
from PIL import Image, ImageDraw, ImageFont
from plan_lib import *
plan = load(sys.argv[1]); S = plan["scenes"]
W, H, COLS = 520, 520, 5
rows = (len(S) + COLS - 1) // COLS
img = Image.new("RGB", (W * COLS, H * rows + 40), "#f6f3ea"); d = ImageDraw.Draw(img)
def font(n):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"):
        try: return ImageFont.truetype(p, n)
        except Exception: pass
    return ImageFont.load_default()
F1, F2 = font(15), font(11)
d.text((12, 10), "Top-down blocking: boxes = set objects, dots = marks, numbered triangles = camera keys (cone = field of view), arrows = glides", fill="#222", font=F1)
for i, s in enumerate(S):
    ox, oy = (i % COLS) * W, (i // COLS) * H + 40
    pts = []
    for k in s["cams"]: pts += [(k["pos"][0], k["pos"][2]), (k["look"][0], k["look"][2])]
    for m in s["marks"]: pts.append(tuple(m["at"]))
    for sj in s.get("subjects", []): pts.append((sj["p"][0], sj["p"][2]))
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts); z0, z1 = min(p[1] for p in pts), max(p[1] for p in pts)
    span = max(x1 - x0, z1 - z0, 0.6) * 1.25; cx, cz = (x0 + x1) / 2, (z0 + z1) / 2; sc = (W - 60) / span
    T = lambda x, z: (ox + W / 2 + (x - cx) * sc, oy + H / 2 + 14 + (z - cz) * sc)
    d.rectangle([ox + 4, oy + 4, ox + W - 4, oy + H - 4], outline="#b9b2a0", fill="#fffdf6")
    for o in plan["sets"][s["set"]]["objects"]:
        (px, py, pz), (sx, sy, sz) = o["pos"], o["size"]
        if sx > span * 1.5 or sz > span * 1.5: continue
        a, b = T(px - sx / 2, pz - sz / 2), T(px + sx / 2, pz + sz / 2)
        d.rectangle([a[0], a[1], b[0], b[1]], outline="#8a6a3a", fill="#ead9b8"); d.text((a[0] + 2, a[1] + 1), o["id"], fill="#6a4a1a", font=F2)
    for m in s["marks"]:
        p = T(*m["at"]); d.ellipse([p[0] - 6, p[1] - 6, p[0] + 6, p[1] + 6], fill="#2f6fc4"); d.text((p[0] + 8, p[1] - 7), m["who"], fill="#1a3a6a", font=F2)
    prev = None
    for n, k in enumerate(s["cams"]):
        p, l = T(k["pos"][0], k["pos"][2]), T(k["look"][0], k["look"][2])
        ang = math.atan2(l[1] - p[1], l[0] - p[0]); hw = math.atan(math.tan(math.radians(k["fov"]) / 2) * 9 / 16); L = math.hypot(l[0] - p[0], l[1] - p[1])
        if L < 8: d.rectangle([p[0] - 14, p[1] - 14, p[0] + 14, p[1] + 14], outline="#c23a32", width=2)   # looking straight down
        else:
            for sgn in (-1, 1): d.line([p, (p[0] + L * 1.1 * math.cos(ang + sgn * hw), p[1] + L * 1.1 * math.sin(ang + sgn * hw))], fill="#e2a09a", width=1)
            d.line([p, l], fill="#c23a32", width=2)
        d.ellipse([p[0] - 9, p[1] - 9, p[0] + 9, p[1] + 9], fill="#c23a32"); d.text((p[0] - 4, p[1] - 7), str(n + 1), fill="#fff", font=F2)
        if prev and (abs(prev[0] - p[0]) + abs(prev[1] - p[1])) > 6: d.line([prev, p], fill="#444", width=1)
        prev = p
    hero = " ★" if s.get("hero") else ""
    d.text((ox + 10, oy + 8), f'{s["id"]}{hero}  f{s["f"][0]}-{s["f"][1]}  {s["set"]}  in: {s["in"]["type"]}', fill="#111", font=F1)
    d.text((ox + 10, oy + 26), s["gloss"][:74], fill="#555", font=F2)
img.save(sys.argv[2], quality=88); print("wrote", sys.argv[2], img.size)
