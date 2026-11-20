#!/usr/bin/env python3
"""The shared library of real TCG card scans (library/cards/<set>/<name>.png, listed in library/cards/CATALOG.md).
Check the library before searching the web; add every new scan to it.

  python3 scripts/card.py find charizard base            rows whose text has all the words
  python3 scripts/card.py add gengar base3 5             fetch https://images.pokemontcg.io/base3/5_hires.png (else 5.png)
  python3 scripts/card.py add mudkip_aa xyp-jp U067 --url https://… --card "2015 JP XY-P Art Academy Mudkip"
  python3 scripts/card.py use gengar zard_base pikachu   copy into public/gengar/cards/ (name:alias saves under another name)
"""
import os, re, shutil, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, "library", "cards")
CAT = os.path.join(LIB, "CATALOG.md")
HEAD = "| name | card | set | no | source | used in |\n|---|---|---|---|---|---|\n"
SETS = {"base1": "Base Set", "base2": "Jungle", "base3": "Fossil", "base4": "Base Set 2", "base5": "Team Rocket",
        "base6": "Legendary Collection", "neo1": "Neo Genesis", "ecard3": "Skyridge", "xy1": "XY", "sv1": "Scarlet & Violet", "ex11": "EX Delta Species"}

def load():
    rows = []
    lines = open(CAT, encoding="utf-8").read().splitlines()
    start = next(i for i, l in enumerate(lines) if l.startswith("|---")) + 1
    for line in lines[start:]:
        c = [x.strip() for x in line.strip().strip("|").split("|")]
        if len(c) == 6: rows.append(dict(zip(["name", "card", "set", "no", "source", "used"], c)))
    return rows

def save(rows):
    lines = open(CAT, encoding="utf-8").read().splitlines()
    intro = lines[:next(i for i, l in enumerate(lines) if l.startswith("| name"))]
    while intro and not intro[-1].strip(): intro.pop()
    with open(CAT, "w", encoding="utf-8") as f:
        f.write("\n".join(intro) + "\n\n" + HEAD)
        for r in sorted(rows, key=lambda r: (r["set"], r["name"])):
            f.write(f"| {r['name']} | {r['card']} | {r['set']} | {r['no']} | {r['source']} | {r['used']} |\n")

def path(r): return os.path.join(LIB, r["set"], r["name"] + ".png")

def find(words):
    for r in load():
        t = " ".join(r.values()).lower()
        if all(w.lower() in t for w in words): print(f"{r['name']:<14} {r['card']:<48} {os.path.relpath(path(r), ROOT)}  [{r['used']}]")

def add(args):
    name, st, no = args[0], args[1], args[2]
    url = args[args.index("--url") + 1] if "--url" in args else None
    card = args[args.index("--card") + 1] if "--card" in args else f"{SETS.get(st, st)} {name.split('_')[0].title()} {no}"
    rows = load()
    if any(r["name"] == name for r in rows): sys.exit(f"{name} is already in the library (python3 scripts/card.py find {name})")
    tries = [url] if url else [f"https://images.pokemontcg.io/{st}/{no}_hires.png", f"https://images.pokemontcg.io/{st}/{no}.png"]
    r = {"name": name, "card": card, "set": st, "no": no, "source": "", "used": ""}
    os.makedirs(os.path.dirname(path(r)), exist_ok=True)
    for u in tries:
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=30).read()
            if len(data) < 5000: raise ValueError("too small to be a scan")
            open(path(r), "wb").write(data); r["source"] = u; break
        except Exception as e: print(f"  {u}: {e}")
    if not r["source"]: sys.exit("could not fetch the scan")
    rows.append(r); save(rows); print(f"added {name}: {os.path.relpath(path(r), ROOT)}  ({r['card']}, {r['source']})")

def use(args):
    reel, names = args[0], args[1:]
    rows = {r["name"]: r for r in load()}
    dst = os.path.join(ROOT, "public", reel, "cards"); os.makedirs(dst, exist_ok=True)
    slug = None
    for d in sorted(os.listdir(os.path.join(ROOT, "videos"))):
        n = os.path.join(ROOT, "videos", d, "notes.md")
        if os.path.exists(n) and f"public/{reel}/" in open(n, encoding="utf-8").read(): slug = d
    src_txt = os.path.join(ROOT, "videos", slug, "cards", "SOURCES.txt") if slug else None
    for spec in names:
        name, alias = (spec.split(":") + [spec])[:2]
        if name not in rows: sys.exit(f"{name} is not in the library: add it first (python3 scripts/card.py add …)")
        r = rows[name]; shutil.copyfile(path(r), os.path.join(dst, alias + ".png"))
        used = [u for u in r["used"].split(", ") if u]
        tag = reel if alias == name else f"{reel} (as {alias})"
        if tag not in used: used.append(tag); r["used"] = ", ".join(used)
        if src_txt and alias not in open(src_txt, encoding="utf-8").read():
            with open(src_txt, "a", encoding="utf-8") as f: f.write(f"{alias + '.png':<18}{r['card']:<50}{r['source']}\n")
        print(f"{alias}.png <- {os.path.relpath(path(r), ROOT)}")
    save(list(rows.values()))
    if not src_txt: print("(no videos/<slug>/notes.md mentions public/%s/: SOURCES.txt not updated)" % reel)

if __name__ == "__main__":
    cmd, rest = (sys.argv[1], sys.argv[2:]) if len(sys.argv) > 1 else ("", [])
    {"find": find, "add": add, "use": use}.get(cmd, lambda _: print(__doc__))(rest)
