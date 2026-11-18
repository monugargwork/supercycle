# Preview sheet: stills grouped by shot, with shot number, timecode, what happens, and the voice line for that shot.
import json, os
from PIL import Image, ImageDraw, ImageFont

FPS = 30
SHOTS = [(1, 0, 103, "Calendar page, aerial over Santa Ana street + grading facility"), (2, 103, 229, "Delivery truck drives in and parks; up to the facility sign"),
    (3, 229, 270, "Driver hops out and walks off whistling"), (4, 270, 331, "Thief sneaks up; lock pops open (close-up)"),
    (5, 331, 415, "Roll-up door opens, thief pulls out 2 pallets; insert: graded slabs in the box"), (6, 415, 478, "Collector waits at the mailbox; it's empty, a fly comes out"),
    (7, 478, 620, "Office: the stolen-items list unrolls; 6.451 count-up"), (8, 620, 698, "Wall of slabs; ~3.000 count-up; creature cards light up"),
    (9, 698, 772, "Police officer at the empty truck; $1.000.000 count-up"), (10, 772, 860, "Black SUV screeches in; FBI agents step out"),
    (11, 860, 980, "White flash. Broken lock on the road; red X stamp"), (12, 980, 1048, "Hero slab, cert number glows"),
    (13, 1048, 1245, "Server room: database; technician hits the red button; rows void; envelopes fly out"), (14, 1245, 1302, "Envelopes land at the marketplace + auction house"),
    (15, 1302, 1380, "Thief tries to sell; scanner beep; alarm"), (16, 1380, 1465, "Alley (sunset): smashes the case; grade label floats away"),
    (17, 1465, 1529, "Shady private deal: card for cash"), (18, 1529, 1615, "Collector checks the cert number on a phone: green check"),
    (19, 1615, 1884, "Collector with the slab; dossier; badges verified > shipped > home")]
FRAMES = [20, 80, 140, 200, 250, 280, 296, 350, 395, 440, 466, 520, 565, 650, 690, 720, 760, 800, 900, 945, 1030, 1080, 1150, 1210, 1240, 1265, 1290,
    1330, 1368, 1395, 1440, 1505, 1560, 1600, 1700, 1760, 1870]
words = json.load(open("public/psa/words.json"))
F = "/usr/share/fonts/truetype/dejavu/"
fB, fR, fS = ImageFont.truetype(F + "DejaVuSans-Bold.ttf", 26), ImageFont.truetype(F + "DejaVuSans.ttf", 20), ImageFont.truetype(F + "DejaVuSans-Bold.ttf", 18)

def wrap(d, text, font, w):
    lines, cur = [], ""
    for wd in text.split():
        t = (cur + " " + wd).strip()
        if d.textlength(t, font=font) > w and cur: lines.append(cur); cur = wd
        else: cur = t
    return lines + ([cur] if cur else [])

TW, TH, PAD, COLS = 300, 533, 24, 3
rows = []
for sid, a, b, desc in SHOTS:
    fs = [f for f in FRAMES if a <= f < b]
    vo = " ".join(w["w"] for w in words if a / FPS - 0.15 <= w["s"] < b / FPS - 0.15)
    rows.append((sid, a, b, desc, fs, vo))
blocks = []
for sid, a, b, desc, fs, vo in rows:
    W = PAD * 2 + COLS * TW + (COLS - 1) * 12
    tmp = Image.new("RGB", (W, 10)); d = ImageDraw.Draw(tmp)
    dl, vl = wrap(d, desc, fR, W - 2 * PAD), wrap(d, "VO: " + vo, fR, W - 2 * PAD)
    nrow = (len(fs) + COLS - 1) // COLS
    H = PAD + 34 + 26 * len(dl) + 26 * len(vl) + 12 + nrow * (TH + 12) + PAD
    im = Image.new("RGB", (W, H), "#f6f4ef"); d = ImageDraw.Draw(im)
    d.text((PAD, PAD), f"SHOT {sid}   {a / FPS:05.2f}s – {b / FPS:05.2f}s", font=fB, fill="#1d1a22")
    y = PAD + 34
    for l in dl: d.text((PAD, y), l, font=fR, fill="#333"); y += 26
    for l in vl: d.text((PAD, y), l, font=fR, fill="#8a2f2a"); y += 26
    y += 12
    for i, f in enumerate(fs):
        t = Image.open(f"out/psa/p_{f}.jpg").resize((TW, TH))
        x, yy = PAD + (i % COLS) * (TW + 12), y + (i // COLS) * (TH + 12)
        im.paste(t, (x, yy))
        d.rectangle([x, yy, x + 104, yy + 28], fill="#000"); d.text((x + 6, yy + 4), f"{f / FPS:05.2f}s", font=fS, fill="#fff")
    blocks.append(im)
# pages: pack blocks two columns wide, ~2600 px tall
pages, col_w = [], blocks[0].width
cols = [[], []]; hs = [0, 0]; page_h = 2700
def flush():
    if not any(cols): return
    H = max(hs); P = Image.new("RGB", (col_w * 2 + 20, H), "#d9d4ca")
    for c in range(2):
        y = 0
        for b in cols[c]: P.paste(b, (c * (col_w + 20), y)); y += b.height + 10
    pages.append(P)
for b in blocks:
    c = 0 if hs[0] <= hs[1] else 1
    if hs[c] + b.height > page_h and (cols[0] or cols[1]):
        if hs[1 - c] + b.height <= page_h: c = 1 - c
        else:
            flush(); cols[0], cols[1] = [], []; hs[0] = hs[1] = 0; c = 0
    cols[c].append(b); hs[c] += b.height + 10
flush()
os.makedirs("out/psa/preview", exist_ok=True)
for i, p in enumerate(pages): p.save(f"out/psa/preview/psa_preview_p{i + 1}.jpg", quality=85)
pages[0].save("out/psa/preview/psa_preview.pdf", save_all=True, append_images=pages[1:], resolution=150)
print(len(pages), [p.size for p in pages])
