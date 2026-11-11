"""direction.md from plan.json (numbers are never typed twice): python3 scripts/plan_md.py videos/<slug>/plan.json [head.md] > direction.md"""
import sys
from plan_lib import load
plan = load(sys.argv[1]); o = []
v = lambda a: "[" + ", ".join(f"{x:g}" for x in a) + "]"
tc = lambda f: f"{int(f / 30) // 60}:{(f / 30) % 60:04.1f}"
if len(sys.argv) > 2: o.append(open(sys.argv[2], encoding="utf-8").read().rstrip() + "\n")
o.append("## Titles (house Title2, Bolota Bold, top of frame)\n\n| in | out | text |\n|---|---|---|")
for t in plan["titles"]: o.append(f'| f{t["f"]} | f{t["out"]} | {t["text"]} |')
o.append("\n## Sets\n")
for name, s in plan["sets"].items():
    o.append(f'### {name}\n- Origin in the shared world: {v(s["origin"])}. Axes: {s["axes"]}.\n- Light: {s["light"]}; sun az/el {v(s["sun"])}. Open camera sides: {s["open_sides"]}.')
    if s["marks"]: o.append("- Marks [x, z]: " + "; ".join(f"{k} {v(p)}" for k, p in s["marks"].items()) + ".")
    o.append("\n| id | build | centre [x, y, z] | size [x, y, z] m |\n|---|---|---|---|")
    for ob in s["objects"]: o.append(f'| {ob["id"]} | {ob["build"]} | {v(ob["pos"])} | {v(ob["size"])} |')
    o.append("")
o.append("## Cast\n")
for k, c in plan["cast"].items(): o.append(f'- **{k}:** {", ".join(c["look"])}. Items: {", ".join(c["items"]) or "none"}. Views: {", ".join(c["views"])}.')
o.append("\n## Scenes\n")
for s in plan["scenes"]:
    a, b = s["f"]; star = " ★" if s.get("hero") else ""
    tr = lambda t: t["type"] + (f' {t["n"]} f' if "n" in t else "") + (f' ({t["note"]})' if "note" in t else "")
    o.append(f'### {s["id"]}{star} · {tc(a)}-{tc(b)} · f{a}-f{b} · "{s["vo"]}"')
    o.append(f'- Gloss: {s["gloss"]}\n- Spine link: {s["spine"]}. Viewer must get: {s["viewer"]}\n- In: {tr(s["in"])}. Out: {tr(s["out"])}.\n- Set: {s["set"]}. Light: {s["light"]}.\n- Build: {s["build"]}\n- Blocking: {s["blocking"]}')
    for m in s["marks"]: o.append(f'  - {m["who"]} at {v(m["at"])}, {m["view"]}; {m["pose"]}; {m["expr"]}.')
    o.append(f'- Action, against the words: {s["action"]}\n- Acting: {s["acting"]}\n- Camera keys:\n\n| f | move | pos | look | fov | push %/f | blur px | why |\n|---|---|---|---|---|---|---|---|')
    for i, k in enumerate(s["cams"]):
        mv = "open" if i == 0 else ("cut" if k.get("cut") else f'glide {k.get("glide", 24)} f')
        pu = f'{k.get("push", 0) * 100:g}' + (f' (punch {k["punch"][0] * 100:g} for {k["punch"][1]} f)' if k.get("punch") else "")
        o.append(f'| {k["f"]} | {mv} | {v(k["pos"])} | {v(k["look"])} | {k["fov"]} | {pu} | {k.get("blur", 0)} | {k["why"]} |')
    ks = "; ".join(f"f{f} strength {g:g}" for f, g in s["kicks"]) or "none"
    o.append(f'\n- Kicks (7 f): {ks}.\n- Physics & FX: {s["physics"]}\n- Light & mood: {s["light_mood"]}\n- Sound: {s["sound"]}\n- After-state: {s["after"]}\n')
print("\n".join(o))
