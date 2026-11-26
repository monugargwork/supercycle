# -*- coding: utf-8 -*-
"""Hand-chunked captions for the iCaterpie reel, timed from public/caterpie/words.json -> src/videos/caterpie/captions.ts.
python3 videos/icaterpie-lifetime-ban/mkcaptions.py"""
import json, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
W = json.load(open(os.path.join(R, "public/caterpie/words.json"), encoding="utf-8"))
P = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "phrases.txt"), encoding="utf-8").read().strip().split("|")
clean = lambda x: x.strip(",.:?!\"").lower()
i, spans = 0, []
for ph in P:
    n = len(ph.split()); ws = W[i:i + n]
    assert [clean(w["w"]) for w in ws] == [clean(x) for x in ph.split()], (ph, [w["w"] for w in ws])
    spans.append((ws[0]["s"], ws[-1]["e"], ph)); i += n
assert i == len(W), (i, len(W))
rows = []
for j, (s, e, ph) in enumerate(spans):
    a = round(s * 30); b = round(e * 30) + 6
    if j + 1 < len(spans): b = min(b, round(spans[j + 1][0] * 30))
    show = ph if ph.endswith(("?\"", "!\"", "?")) else ph.rstrip(".,:")
    rows.append(f"  [{a}, {b}, {json.dumps(show, ensure_ascii=False)}],")
open(os.path.join(R, "src/videos/caterpie/captions.ts"), "w", encoding="utf-8").write(
    "/** Vietnamese captions, hand-chunked phrases timed from the aligned voiceover (public/caterpie/words.json): [first frame, end frame, text].\n"
    " *  Written by videos/icaterpie-lifetime-ban/mkcaptions.py. */\nexport const CAPTIONS: [number, number, string][] = [\n" + "\n".join(rows) + "\n];\n")
print(len(rows), "captions, longest", max(len(p) for p in P))
