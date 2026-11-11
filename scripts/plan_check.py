"""Math-only check of a reel plan (no renders): python3 scripts/plan_check.py videos/<slug>/plan.json
Projects every scene's subjects through the camera at 5-frame steps and checks the 9:16 safe area (6 % sides, bottom 12 %,
below the title zone 13-23 % while a house title is up; caption band 70-76 % is a warning), plus coverage, In/Out, cut count,
camera speed of glides and required fields."""
import sys, math
from plan_lib import *
plan = load(sys.argv[1]); S = plan["scenes"]; bad = 0; warn = 0
REQ = ["id","f","set","light","vo","gloss","spine","viewer","in","out","build","blocking","action","acting","cams","kicks","marks","physics","light_mood","sound","after"]
for i, s in enumerate(S):
    for r in REQ:
        if r not in s or s[r] in ("", None, "TBD"): print("MISSING", s["id"], r); bad += 1
    if i and S[i-1]["f"][1] != s["f"][0]: print("GAP", S[i-1]["id"], s["id"]); bad += 1
    if s["cams"][0]["f"] != s["f"][0]: print("FIRST KEY", s["id"]); bad += 1
    if s["set"] not in plan["sets"]: print("SET?", s["id"]); bad += 1
if S[0]["f"][0] != 0 or S[-1]["f"][1] != plan["frames"]: print("COVERAGE"); bad += 1
cuts = sum(1 for s in S if s["in"]["type"] == "cut")
print("hard cuts:", cuts, "(aim <= 3)")
for s in S:
    worst = {}
    for f in range(s["f"][0], s["f"][1], 5):
        c = cam_at(s, f); tu = title_up(plan, f)
        for sj in s.get("subjects", []):
            if not (sj["f"][0] <= f <= sj["f"][1]): continue
            x, y, z = project(c, sj["p"])
            msg = None
            if x is None: msg = "BEHIND LENS"
            elif not (6 <= x <= 94): msg = f"x {x:.0f}%"
            elif y > 88: msg = f"low y {y:.0f}%"
            elif y < (23 if tu else 4): msg = f"high y {y:.0f}%" + (" (title up)" if tu else "")
            elif 70 <= y <= 76: worst.setdefault(("w", sj["n"]), (f, f"caption band y {y:.0f}%"))
            if msg: worst.setdefault(("e", sj["n"]), (f, msg))
    for (lv, n), (f, msg) in worst.items():
        print(("FAIL" if lv == "e" else "warn"), s["id"], n, "f%d" % f, msg)
        if lv == "e": bad += 1
        else: warn += 1
    # glide speed: screen travel of the look point per frame, at 720 px wide
    for f in range(s["f"][0] + 1, s["f"][1]):
        a, b = cam_at(s, f - 1), cam_at(s, f)
        x0, y0, _ = project(a, b["look"]); x1, y1, _ = project(b, b["look"])
        if x0 is None: continue
        v = math.hypot((x1 - x0) * 7.2, (y1 - y0) * 12.8)
        if v > 60: print("fast", s["id"], "f%d" % f, "%.0f px/f (needs motion blur or a longer glide)" % v); warn += 1; break
print("errors", bad, "warnings", warn)
sys.exit(1 if bad else 0)
