"""contact sheet of check stills: python3 scripts/sheet.py out.jpg cols a.jpg b.jpg ..."""
import sys
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert("RGB") for f in files]; w, h = 360, 640
rows = (len(ims) + cols - 1) // cols; sh = Image.new("RGB", (w * cols, h * rows), "#222"); d = ImageDraw.Draw(sh)
for i, (im, f) in enumerate(zip(ims, files)):
    sh.paste(im.resize((w, h)), ((i % cols) * w, (i // cols) * h)); d.text(((i % cols) * w + 6, (i // cols) * h + 4), f.split("_")[-1], fill="#ff0")
sh.save(out, quality=85)
