"""Generator of plan.json for the Roush (early Night UPC) reel. The plan is the source of truth: change it here, then
python3 videos/natalie-roush-upc/mkplan.py && python3 scripts/plan_check.py videos/natalie-roush-upc/plan.json"""
import json, math, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "scripts"))
from plan_fit import fit

def k(f, pos, look, fov, glide=None, cut=False, push=0.0006, punch=None, why=""):
    d = dict(f=f, pos=[round(v, 3) for v in pos], look=[round(v, 3) for v in look], fov=fov, roll=0, push=push, blur=0, why=why)  # quality bar: no blur
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    return d
def kf(f, pts, az, el, fov, title=False, margin=5.0, d_max=40.0, **kw):
    """a camera key fitted to its subjects: the closest lens at this view direction that keeps them all in the safe area"""
    pos, look = fit(pts, az=az, el=el, fov=fov, title=title, margin=margin, d_max=d_max)
    return k(f, pos, look, fov, **kw)
def body(m, h=1.78, w=0.28):
    y = h - 0.22; return [[m[0], h, m[1]], [m[0], 0.02, m[1]], [m[0] - w, y, m[1]], [m[0] + w, y, m[1]]]
HEAD = lambda m, h=1.78: [m[0], h, m[1]]
def add(a, b, s=1.0): return [a[i] + b[i] * s for i in range(3)]
def nrm(a):
    l = math.sqrt(sum(x * x for x in a)); return [x / l for x in a]

# ---------------- layout (set-local metres; the build reads these) ----------------
# STREET: a sunny town high street along x. Shop fronts at z 0 (facing +z), pavement z 0..5, road z 5..12, the far pavement and
# houses beyond. The bus stop at x 0 (the viewer, his phone), the cafe x 3..9, the cinema x 13..23, the plaza set back at x -32..-14.
VIEW = [0.0, 1.4]
PH_C = [0.0, 1.2, 1.8]; PH_N = nrm([0.0, 0.44, -0.38]); PH_UP = nrm([0.0, 0.38, 0.44]); PH_W, PH_H = 0.078, 0.16
def phone_pt(u, v, d=0.0):
    """a point on the viewer's phone screen: u -0.5..0.5 left to right as he sees it (his right is -x), v -0.5..0.5 bottom to top"""
    return [PH_C[0] - u * PH_W, PH_C[1] + v * PH_H * PH_UP[1] + d * PH_N[1], PH_C[2] + v * PH_H * PH_UP[2] + d * PH_N[2]]
def pov(f, u, v, dist, fov=40, **kw):
    """the viewer's own view of his phone: the lens on the screen's normal through (u, v), dist metres off the glass"""
    c = phone_pt(u, v); return k(f, add(c, PH_N, dist), c, fov, **kw)
PHONE_CORNERS = [phone_pt(-0.5, 0.5), phone_pt(0.5, 0.5), phone_pt(-0.5, -0.5), phone_pt(0.5, -0.5)]
# the screen layout (canvas fractions of the phone screen; art.ts draws to the same numbers): the video, the title line, the button
SCREEN = dict(video=[0.06, 0.04, 0.94, 0.58], title=0.63, commission=0.69, button=[0.1, 0.73, 0.9, 0.82], canvas=[720, 1476])
def scr(x, y):  # canvas fraction (0,0 top-left) -> phone (u, v)
    return x - 0.5, 0.5 - y
BTN = scr(0.5, 0.775); COMM = scr(0.32, 0.69); VID = scr(0.5, 0.31)

ST = dict(shops_z=0.0, pave=[0.0, 5.0], road=[5.0, 12.0], far=[12.0, 15.0],
          stop=[-1.6, 1.6, 0.5, 2.1], stop_h=2.45, view=VIEW, phone=dict(c=PH_C, n=PH_N, up=PH_UP, w=PH_W, h=PH_H),
          cafe=[3.0, 9.0], cinema=[13.0, 23.0], cin_door=[18.6, 20.4], poster=[15.2, 1.65, 0.0], poster_size=[1.1, 1.6],
          tinman=[15.9, 1.0], stand=[16.9, 18.1, 0.9, 1.4], stand_h=1.0, tout=[17.5, 0.45], sign=[17.5, 1.32, 1.42], sign_size=[0.5, 0.36],
          plaza=[-32.0, -14.0, -14.0, 0.0], fountain=[-23.0, -7.0], board=[-17.0, 1.55, -2.0], board_size=[2.2, 1.4],
          crowd=[[-24.9, -2.4], [-23.9, -0.9], [-23.0, -2.8], [-22.0, -0.8], [-21.1, -2.3], [-25.6, -1.1], [-20.4, -1.0]],
          asker=[-23.0, -2.8],
          walkers=[[-2.0, 3.0], [2.0, 3.4], [3.2, 2.4], [-3.2, 3.4], [4.3, 3.0], [1.2, 2.2]])
# ROOM: her bright creator room. She stands behind a standing-height counter facing +z (her camera on a tripod in front of it).
RM = dict(room=[-3.0, 3.0, -3.0, 6.0], h=2.8, counter=[-0.75, 0.75, -0.3, 0.3], top=1.0, her=[0.0, -0.45],
          tripod=[-1.3, 1.25], tri_h=1.38, ring=[1.3, 1.25], box=[-0.08, -0.12], box_size=[0.38, 0.09, 0.28], lid_h=0.035,
          stand=[0.46, -0.16], calendar=[1.75, 1.72, -2.98], cal_size=[0.56, 0.76], cork=[-1.75, 1.62, -2.98], cork_size=[0.9, 0.66],
          window=[3.0, -1.2, 1.2, 0.9, 2.3], poster=[0.1, 1.9, -2.98])
BOX = [RM["box"][0], RM["top"], RM["box"][1]]
LIDSTAND = [RM["stand"][0], RM["top"], RM["stand"][1]]
# the lid's sticker (lower right of the lid face, as it stands in its stand) and the calendar
STICKER = [LIDSTAND[0] - 0.1, RM["top"] + 0.045, LIDSTAND[2] + 0.03]
# MARKET: a glossy white-and-gold resale shop. The counter along x; the seller behind it; two plinths in front: one box at
# retail on the left, the tower of twelve on the right.
MK = dict(room=[-4.0, 4.0, -4.0, 9.0], h=3.6, counter=[-1.6, 1.6, -1.4, -0.8], top=1.0, seller=[-0.25, -1.7], her=[-2.05, -0.75],
          jar=[-1.35, -1.1], till=[0.15, -1.25], plinthL=[-0.5, 0.4], plinthR=[0.5, 0.4], plinth=[0.56, 0.6, 0.46], bx=0.12, n=12)
TOWER_TOP = [MK["plinthR"][0], MK["plinth"][1] + MK["n"] * MK["bx"], MK["plinthR"][1]]
# DOCK: the official channel. A warehouse with its roll-up door open, a shipping table in front.
DK = dict(wall_z=-5.0, door=[-2.0, 2.0, 3.2], table=[-0.7, 0.7, 0.8, 1.4], top=0.95, courier_from=[0.0, -4.4], courier=[0.0, 0.5],
          carton=[0.0, 1.0], carton_size=[0.5, 0.36, 0.4], label=[0.0, 1.13, 1.205])

P = {
 "fps": 30, "frames": 2330, "voice_end": 2293,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 140, "out": 190, "text": "$2,200", "style": 3, "from": "top"},
  {"f": 232, "out": 290, "text": "NATALIE ROUSH", "style": 3, "from": "top"},
  {"f": 380, "out": 425, "text": "30th", "style": 3, "from": "top"},
  {"f": 500, "out": 548, "text": "$179", "style": 3, "from": "top"},
  {"f": 716, "out": 762, "text": "$320", "style": 3, "from": "top"},
  {"f": 946, "out": 988, "text": "x12", "style": 3, "from": "top"},
  {"f": 1930, "out": 1985, "text": "eBay", "style": 3, "from": "top"}],
 "cards": {"magikarp": "magikarp_ar", "umbreon": "umbreon_pe"},
 "street": ST, "room": RM, "market": MK, "dock": DK, "screen": SCREEN,
 "sets": {
  "street": {"origin": [0, 0, 0], "axes": "shop fronts at z 0 facing +z (the road); the bus stop at x 0; the cinema at x 13..23; the plaza set back at x -32..-14",
   "light": "day", "sun": [-35, 42], "open_sides": "+z",
   "objects": [
    {"id": "stop", "build": "new: a bus shelter x -1.6..1.6, z 0.5..2.1: green steel posts, a glass back panel with a bright poster (a beach), a sky-blue roof 2.45 m, a timetable board, a BUS STOP flag post", "pos": [0, 1.2, 1.3], "size": [3.2, 2.45, 1.6]},
    {"id": "phone", "build": "new: the viewer's phone: 7.8 x 16 cm, a coral case; its screen is a live canvas: the video (her room, her, the box), the title line, the grey 'Earns commission' line and the red Shop · $2,262 button; later 'Video unavailable', the screenshot gallery", "pos": PH_C, "size": [PH_W, PH_H, 0.01]},
    {"id": "shops", "build": "new: a row of shop fronts along z 0: a bakery (cream, red awning), a bookshop (sky blue), the cafe x 3..9 (red-and-white striped awning, two standing tables outside, flower boxes), a toy shop, a flower shop; upper floors with windows and balconies in cream, peach, mint; chimneys", "pos": [0, 3, -3], "size": [60, 6, 6]},
    {"id": "cinema", "build": "new: the cinema x 13..23: a cream facade with red trim, a marquee with bulbs reading COMING SOON, a framed poster case at x 15.2 (a film poster: a mountain under a starry sky, the words COMING SOON), glass doors x 18.6..20.4 closed with a CLOSED sign, a ticket window", "pos": [18, 3.5, -1], "size": [10, 7, 2]},
    {"id": "stand", "build": "new: the tout's little folding stand x 16.9..18.1 in front of the cinema: a red cloth, a flip sign on a pivot (front TICKETS with a chain-link icon, back x12 PRICE)", "pos": [17.5, 0.5, 1.15], "size": [1.2, 1.0, 0.5]},
    {"id": "plaza", "build": "new: the plaza x -32..-14 set back to z -14: warm pavers in a circle pattern, a round fountain at (-23, -7) with water jets, planters with red and yellow flowers, string flags, a clock tower and pastel buildings behind; the listings board at x -17: a cork board 2.2 x 1.4 m on two posts, header FOR SALE, eight printed listings", "pos": [-23, 1, -7], "size": [18, 2, 14]},
    {"id": "road", "build": "new: the road z 5..12 (asphalt, white dashes, a zebra crossing), kerbs, lamp posts with flower baskets, street trees in round planters, the far pavement, a park with trees and a row of houses at z 38; hills and blue sky with clouds behind", "pos": [0, 0, 8.5], "size": [120, 0.1, 7]}],
   "marks": {"view": VIEW, "tinman": ST["tinman"], "tout": ST["tout"], "asker": ST["asker"]}},
  "room": {"origin": [300, 0, 0], "axes": "she stands behind the counter facing +z; her tripod camera at z 1.35 faces her; shelves on the left wall, the window on the right wall, calendar and cork board on the back wall",
   "light": "day", "sun": [25, 40], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: room x -3..3, z -3..6, 2.8 m: pastel pink walls with a cream dado, a light oak floor with a round mint rug, a white ceiling with two round lamps; the left wall a floor-to-ceiling shelf packed with sealed product boxes (bright reds, blues, yellows), plushies on top; the back wall a poster wall (three framed posters), the wall calendar on SEPTEMBER, the cork board; the right wall a big window with blue sky and clouds and a plant", "pos": [0, 1.4, 1.5], "size": [6, 2.8, 9]},
    {"id": "counter", "build": "new: a standing-height counter x -0.75..0.75, z -0.3..0.3, top 1.0: white with a pink front panel and a gold edge; a cutting mat on top", "pos": [0, 0.5, 0], "size": [1.5, 1.0, 0.6]},
    {"id": "box", "build": "new: the Night UPC: base 38 x 9 x 28 cm, royal blue with gold trim; the lid 3.5 cm deep, its face a night sky with gold stars, a gold 30, the word NIGHT, a window with the real Umbreon scan, and a sticker lower left RELEASE NOV 6 · MSRP $179.99; on its back side a bare white rectangle (no shipping label) and one yellow question-mark sticker; inside: a stack of cards (real Magikarp scans on top), two booster bundles", "pos": [BOX[0], 1.05, BOX[2]], "size": [0.38, 0.09, 0.28]},
    {"id": "lidstand", "build": "new: a small clear acrylic stand on the counter's back right corner, the lid stands in it upright facing +z after S01", "pos": LIDSTAND, "size": [0.12, 0.05, 0.06]},
    {"id": "rig", "build": "new: her filming rig: a tripod (black legs) at x -1.3 with a small white camera at 1.38 m turned to her, a ring light (a white ring on a stand) at x 1.3", "pos": [0, 0.7, 1.05], "size": [2.0, 1.6, 0.4]},
    {"id": "cork", "build": "new: a cork board 90 x 66 cm in an oak frame on the back wall left: empty except one red pushpin in the middle", "pos": RM["cork"], "size": [0.9, 0.66, 0.02]}],
   "marks": {"her": RM["her"]}},
  "market": {"origin": [600, 0, 0], "axes": "the counter along x at z -1.4..-0.8; the seller behind it; two plinths in front at z 0.4; the lens at +z",
   "light": "day", "sun": [10, 40], "open_sides": "+z",
   "objects": [
    {"id": "shop", "build": "new: a glossy resale shop x -4..4, z -4..9, 3.6 m: white walls with gold trim, a pale marble floor, glass display shelves of sneakers and sealed boxes along the back wall lit warm, a gold sign RESALE (generic) over the back shelves, ceiling spotlights, a big window with sky on the left wall", "pos": [0, 1.8, 0], "size": [8, 3.6, 8]},
    {"id": "counter", "build": "new: the counter x -1.6..1.6, z -1.4..-0.8, top 1.0: white with a gold band; a till at x 0.15 (a card reader and a cash drawer); a glass jar at x -1.35 with a tag COMMISSION", "pos": [0, 0.5, -1.1], "size": [3.2, 1.0, 0.6]},
    {"id": "plinths", "build": "new: two white plinths 56 x 60 x 46 cm at x -0.5 and x 0.5, z 0.4: on the left one Night box with a shelf tag $179.99; on the right the tower: twelve Night boxes drop in one at a time and stack flat, 1.44 m tall, with a red tag $2,262 on the top box", "pos": [0, 0.3, 0.4], "size": [1.6, 0.6, 0.46]}],
   "marks": {"seller": MK["seller"], "her": MK["her"]}},
  "dock": {"origin": [900, 0, 0], "axes": "the warehouse wall at z -5 faces +z, its roll-up door x -2..2 open; the shipping table in front at z 0.8..1.4; the lens at +z",
   "light": "day", "sun": [-30, 40], "open_sides": "+z",
   "objects": [
    {"id": "warehouse", "build": "new: a warehouse front: sky-blue ribbed cladding, a big roll-up door x -2..2 (rolled up, 3.2 m) into a warm-lit hall of racks with brown cartons, a sign OFFICIAL DISTRIBUTION over the door (plain letters, no brand), dock bumpers, pallets of shrink-wrapped cartons either side, a yellow forklift parked, a delivery van at x 6", "pos": [0, 2.5, -5], "size": [16, 5, 0.4]},
    {"id": "table", "build": "new: a steel shipping table x -0.7..0.7, z 0.8..1.4, top 0.95: a tape gun, a label printer", "pos": [0, 0.47, 1.1], "size": [1.4, 0.95, 0.6]},
    {"id": "carton", "build": "new: the official carton 50 x 36 x 40 cm, brown with tape, a big white shipping label on its front face: FROM: OFFICIAL DISTRIBUTOR / TO: CREATOR / EARLY SAMPLE · NOT FOR SALE, a barcode", "pos": [0, 1.13, 1.1], "size": [0.5, 0.36, 0.4]}],
   "marks": {"courier": DK["courier"]}}},
 "cast": {
  "creator": {"look": ["pink hoodie", "light blue jeans", "long blonde hair"], "items": ["the box", "two Magikarp cards", "her phone"], "views": ["front"]},
  "viewer": {"look": ["teal tee", "orange cap", "blue jeans"], "items": ["his phone"], "views": ["POV only"]},
  "seller": {"look": ["red hoodie", "gold chain", "cap", "sunglasses"], "items": [], "views": ["front"]},
  "courier": {"look": ["brown uniform", "brown cap"], "items": ["carton"], "views": ["front", "side walking"]},
  "tinman": {"look": ["red jacket", "black trousers", "slick hair"], "items": ["a film-reel tin"], "views": ["front"]},
  "tout": {"look": ["tan trench coat", "sunglasses", "flat cap"], "items": [], "views": ["front"]},
  "crowd": {"look": ["seven people in bright tees: teal, orange, green, pink, sky blue, coral, yellow"], "items": ["phones"], "views": ["front"]}},
 "scenes": []}

SC = P["scenes"]
def scene(**kw): SC.append(kw)
HER = RM["her"]
LID_FACE = [LIDSTAND[0], RM["top"] + 0.15, LIDSTAND[2] + 0.02]
BOXP = [[BOX[0] - 0.19, RM["top"], BOX[2] + 0.14], [BOX[0] + 0.19, RM["top"] + 0.1, BOX[2] + 0.14]]

scene(id="S01", hero=True, f=[0, 80], set="room", light="day",
  vo="Cô mở một hộp Pokémon hai tháng trước ngày bán,",
  gloss="She opened a Pokémon box two months before its release date,",
  spine=1, viewer="A creator at her counter lifts the lid off a night-blue box, straight to her filming camera.",
  **{"in": {"type": "open on the act"}, "out": {"type": "dissolve", "to": "S02", "n": 8, "note": "through the tripod camera's view onto a phone screen"}},
  build="the room, the counter, the box with its lid, the tripod camera and the ring light in the foreground.",
  blocking="Creator at HER, front view, both hands on the lid's sides.",
  action="f0-20 she grips the lid; f24-44 lifts it straight up off the base (a gold sparkle off the open box at f40); f44-60 sets it upright in the acrylic stand at the counter's back right; f60-80 she grins at her camera, both palms out (ta-da).",
  acting="Creator: excited grin, eyebrows up.",
  cams=[k(0, [0.3, 1.5, 3.5], [0.12, 1.05, -0.3], 46, push=0.0012, why="medium-wide between the tripod and the ring light: her, the counter, the box")],
  kicks=[[26, 0.3]],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "lifts the lid f24-44, sets it in the stand f44-60, palms out f62", "expr": "smile -> grin"}],
  subjects=[{"n": "creator head", "p": HEAD(HER), "f": [0, 79]}, {"n": "box", "p": [BOX[0], 1.05, BOX[2]], "f": [0, 79]}],
  physics="the lid: kinematic in her hands.", light_mood="bright day through the window; the ring light glows.", sound="a cardboard 'fwump' as the lid lifts f26; a sparkle chime f40.",
  after="The lid stands in its stand for every later room shot; the open base stays on the counter.")

scene(id="S02", hero=True, f=[80, 208], set="street", light="day",
  vo="rồi để ngay bên dưới video một cái nút mua giá hai nghìn hai trăm đô.",
  gloss="then put, right under the video, a buy button priced at two thousand two hundred dollars.",
  spine=1, viewer="The same video on a viewer's phone at a bus stop; the view slides down it to a big red Shop · $2,262 button, which pulses.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S01"}, "out": {"type": "dissolve", "to": "S03", "n": 8, "note": "into the phone's video, back into her room"}},
  build="the phone in the viewer's hands (his POV), the pavement and the kerb below it.",
  blocking="Viewer at view (not seen: POV); his two arm lines come up from the bottom of frame to the phone's sides.",
  action="f80-97 on the phone: her video (the open box, her grin); f97-125 the lens slides down the screen past the title line to the button ('ngay bên dưới video'); f123 ('nút mua') the button pulses (scale 1 -> 1.08 -> 1) with a ring; f140 title $2,200; f150-208 slow push on the button.",
  acting="none.",
  cams=[pov(80, 0.0, 0.0, 0.42, why="the whole phone screen from the viewer's eyes"),
        pov(97, BTN[0], BTN[1] + 0.12, 0.27, glide=28, push=0.0006, why="down the screen to the button")],
  kicks=[[123, 0.4]],
  marks=[],
  subjects=[{"n": "button", "p": phone_pt(*BTN), "f": [125, 207]}],
  physics="none.", light_mood="bright sun on the pavement.", sound="street bed (cars, birds); a soft 'pop' on the button pulse f123; a cash-register 'ding' f140.",
  after="The button is drawn the same way every time the phone is shown.")

scene(id="S03", f=[208, 466], set="room", light="day",
  vo="Cô là Natalie Roush, nhà sáng tạo nội dung Pokémon, và hộp ấy là bộ Ultra-Premium kỷ niệm ba mươi năm, bản Đêm, hình Umbreon.",
  gloss="She is Natalie Roush, a Pokémon content creator, and the box is the 30th-anniversary Ultra-Premium Collection, the Night edition, with Umbreon.",
  spine=2, viewer="The whole creator room: shelves of product, ring light, camera; then the lid in its stand: night sky, a gold 30, the real Umbreon.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S02"}, "out": {"type": "glide", "to": "S04"}},
  build="the room wide: shelves, posters, the window, the rig; the lid in its stand.",
  blocking="Creator at HER, front view, waving to her camera f215-240, then pointing at the lid f330-360.",
  action="f208-300 wide of the room, slow push; f215-240 she waves to her camera; f232 title NATALIE ROUSH; f300-380 glide to the lid; f330-360 she points at it; f380 title 30th; f420-466 the lid fills the frame: the Umbreon window ('Umbreon' f442).",
  acting="Creator: friendly host smile.",
  cams=[k(208, [1.1, 1.95, 5.4], [-0.35, 1.25, -1.2], 52, push=0.0003, why="the opening wide of her room: shelves, her at the counter, posters, the window"),
        k(320, [LID_FACE[0] + 0.45, LID_FACE[1] + 0.06, LID_FACE[2] + 1.05], LID_FACE, 36, glide=60, push=0.0008, why="the lid: Night, 30, Umbreon")],
  kicks=[],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "waves f215-240, points at the lid f330-360", "expr": "smile"}],
  subjects=[{"n": "creator head", "p": HEAD(HER), "f": [210, 300]}, {"n": "lid", "p": LID_FACE, "f": [400, 465]}],
  physics="none.", light_mood="bright, warm, the window sky blue.", sound="light ukulele theme; a whoosh on the glide f300.",
  after="Unchanged.")

CAL = RM["calendar"]
scene(id="S04", f=[466, 608], set="room", light="day",
  vo="Giá bán lẻ chính thức một trăm bảy mươi chín đô, ngày mở bán sáu tháng mười một.",
  gloss="The official retail price was one hundred seventy-nine dollars, the release date the sixth of November.",
  spine=2, viewer="The sticker on the lid: RELEASE NOV 6 · MSRP $179.99; then up to the wall calendar: still SEPTEMBER.",
  **{"in": {"type": "glide", "from": "S03"}, "out": {"type": "dissolve", "to": "S05", "n": 6}},
  build="the lid's sticker, the wall calendar (SEPTEMBER 2026, a grid of days, a red circle drawn on nothing yet).",
  blocking="Creator at HER in the background (front view), out of the push.",
  action="f466-540 push on the sticker ('một trăm bảy mươi chín' f499-526); f500 title $179; f528-598 tilt and glide up to the calendar behind her ('sáu tháng mười một' f563-585): SEPTEMBER, two pages before NOVEMBER.",
  acting="none.",
  cams=[k(466, [STICKER[0] + 0.02, STICKER[1] + 0.05, STICKER[2] + 0.55], STICKER, 34, glide=24, push=0.0008, why="the sticker: NOV 6, $179.99"),
        k(528, [CAL[0] - 0.2, CAL[1] - 0.1, CAL[2] + 2.3], CAL, 38, glide=70, push=0.0006, why="the calendar: SEPTEMBER")],
  kicks=[],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "standing", "expr": "smile"}],
  subjects=[{"n": "sticker", "p": STICKER, "f": [480, 540]}, {"n": "calendar", "p": CAL, "f": [598, 607]}],
  physics="none.", light_mood="bright day.", sound="a calendar page riffle f560 (the pages to November flutter but stay put).",
  after="Unchanged.")

CARD_R = [0.404, 1.42, -0.33]
scene(id="S05", f=[608, 774], set="room", light="day",
  vo="Trong video, cô lật ra hai lá Magikarp, và định giá một lá ba trăm hai mươi đô.",
  gloss="In the video she turned up two Magikarp, and valued one at three hundred twenty dollars.",
  spine=3, viewer="She lifts two cards out of the box, one in each hand; the real Magikarp fills the frame.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S04"}, "out": {"type": "dissolve", "to": "S06", "n": 8, "note": "back onto the viewer's phone"}},
  build="two real Magikarp scans (sv2 203) in her hands.",
  blocking="Creator at HER, front view; f630-652 both hands into the box; f652-672 she lifts one card in each hand to shoulder height, faces toward the lens.",
  action="f608-652 medium on her at the counter; f640 she reaches into the box; f652-672 lifts the two cards ('hai lá Magikarp' f653-679); f690-760 push in on the right-hand card until it fills about 55 % of the width ('ba trăm hai mươi' f717); f716 title $320.",
  acting="Creator: delighted gasp, then a proud grin.",
  cams=[kf(608, body(HER) + BOXP, az=0, el=-5, fov=44, push=0.0006, why="medium-wide: her at the counter"),
        k(688, [CARD_R[0] + 0.02, CARD_R[1] + 0.02, CARD_R[2] + 0.45], CARD_R, 30, glide=36, push=0.0005, why="the Magikarp, big and sharp")],
  kicks=[[655, 0.3]],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "reaches into the box f630-652; lifts a card in each hand f652-672; holds", "expr": "shock -> grin"}],
  subjects=[{"n": "creator head", "p": HEAD(HER), "f": [610, 680]}, {"n": "magikarp", "p": CARD_R, "f": [730, 773]}],
  physics="the cards: kinematic in her hands.", light_mood="bright; a soft gleam crosses the card face f700-730.", sound="card slide f655; a 'wow' sparkle f680; a coin chink f717.",
  after="She keeps holding the cards until the scene ends.")

scene(id="S06", f=[774, 900], set="street", light="day",
  vo="Dưới video, YouTube ghi dòng chữ nhỏ: có hoa hồng, kèm nút dẫn tới một sàn",
  gloss="Under the video, YouTube wrote in small print: earns commission, with a button leading to a marketplace",
  spine=4, viewer="Back on the viewer's phone: the tiny grey line 'Earns commission' under the video, then the red button.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S05"}, "out": {"type": "dissolve", "to": "S07", "n": 8, "note": "through the button into the marketplace"}},
  build="the phone (POV), same screen as S02.",
  blocking="Viewer (POV).",
  action="f774-830 the screen; f830-865 the lens pushes in on 'Earns commission' ('có hoa hồng' f839-860); f870-900 slides to the button and pushes into it ('nút dẫn tới' f881); f884 the button presses in (his tap: the button darkens 4 f).",
  acting="none.",
  cams=[pov(774, 0.0, -0.08, 0.34, why="the screen: video, line, button"),
        pov(826, COMM[0], COMM[1], 0.14, glide=30, push=0.0004, why="the small print"),
        pov(866, BTN[0], BTN[1], 0.12, glide=24, push=0.004, why="into the button")],
  kicks=[[884, 0.3]],
  marks=[],
  subjects=[{"n": "commission", "p": phone_pt(*COMM), "f": [850, 865]}],
  physics="none.", light_mood="bright sun.", sound="street bed; a tap f884; a whoosh into the button f890.",
  after="Unchanged.")

PL, PR, PT = MK["plinthL"], MK["plinthR"], MK["plinth"][1]
scene(id="S07", hero=True, f=[900, 997], set="market", light="day",
  vo="bán hộp ấy với giá hơn mười hai lần giá gốc.",
  gloss="selling that box for more than twelve times its original price.",
  spine=4, viewer="A glossy resale shop: one Night box at $179.99 on a plinth; beside it twelve boxes drop in one by one into a tower; the lens tilts up it.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S06"}, "out": {"type": "glide", "to": "S08"}},
  build="the shop, the counter, the two plinths, the single box with its tag, twelve boxes.",
  blocking="Seller at seller behind the counter (front view), arms folded look; nobody else.",
  action="f900-905 settle on the plinths; boxes drop from 0.7 m above the tower top every 6 f, f905 + 6 i (i 0..11), each lands flat with a 1 cm hop and settles; f946 title x12 ('mười hai' f947); f930-990 the lens tilts up the growing tower; f975 the $2,262 tag flaps onto the top box.",
  acting="Seller: smug smile.",
  cams=[kf(900, [[PL[0] - 0.3, 0.02, PL[1] + 0.3], [PR[0] + 0.3, 0.02, PR[1] + 0.3], [PL[0], PT + 0.15, PL[1]], [PR[0], PT + 0.5, PR[1]]], az=0, el=-4, fov=44, push=0.0, margin=4.0, why="the two plinths, one box"),
        kf(930, [[PL[0] - 0.3, 0.02, PL[1] + 0.3], [PR[0] + 0.3, 0.02, PR[1] + 0.3], TOWER_TOP, [PR[0], TOWER_TOP[1] + 0.12, PR[1]]], az=0, el=2, fov=46, title=True, glide=56, push=0.0002, margin=3.0, why="tilt up the tower of twelve")],
  kicks=[[905 + 6 * 11, 0.3]],
  marks=[{"who": "seller", "at": MK["seller"], "view": "front", "pose": "standing behind the counter", "expr": "grin"}],
  subjects=[{"n": "tower", "p": TOWER_TOP, "f": [975, 996]}, {"n": "single box", "p": [PL[0], PT + 0.06, PL[1]], "f": [900, 996]}],
  physics="the boxes: free fall from 0.7 m (g 9.8), a 1 cm hop on landing, rest; analytic.", light_mood="warm spotlights, white and gold.", sound="twelve thuds rising in pitch f905-971; a cash-register 'ka-ching' f975.",
  after="The tower stays.")

JAR = [MK["jar"][0], MK["top"], MK["jar"][1]]; TILL = [MK["till"][0], MK["top"], MK["till"][1]]
scene(id="S08", f=[997, 1095], set="market", light="day",
  vo="Cô không phải người bán, cô nhận hoa hồng.",
  gloss="She isn't the seller; she earns a commission.",
  spine=4, viewer="The seller behind the counter by the till; she stands at the end of the counter by a jar marked COMMISSION; one gold coin slides from the till into her jar.",
  **{"in": {"type": "glide", "from": "S07"}, "out": {"type": "dissolve", "to": "S09", "n": 6}},
  build="the counter, the till, the jar with its COMMISSION tag, one gold coin.",
  blocking="Seller at seller (front view) behind the till; creator at her mark (front view) beside the counter's left end.",
  action="f997-1040 the seller taps the till (the drawer pops out 6 cm f1030); f1040-1058 one gold coin slides along the counter top from the till to the jar ('nhận hoa hồng' f1042) and drops in (plink) f1060; she gives a small shrug-smile.",
  acting="Seller: smug; creator: neutral, a small smile.",
  cams=[kf(997, body(MK["seller"]) + body(MK["her"]) + [JAR, TILL, [PR[0], TOWER_TOP[1], PR[1]]], az=6, el=-6, fov=46, push=0.0004, why="the counter: seller, till, her, jar")],
  kicks=[],
  marks=[{"who": "seller", "at": MK["seller"], "view": "front", "pose": "taps the till f1025-1030", "expr": "grin"}, {"who": "creator", "at": MK["her"], "view": "front", "pose": "standing by the jar", "expr": "smile"}],
  subjects=[{"n": "seller head", "p": HEAD(MK["seller"]), "f": [997, 1094]}, {"n": "creator head", "p": HEAD(MK["her"]), "f": [997, 1094]}, {"n": "jar", "p": JAR, "f": [997, 1094]}],
  physics="the coin: slides at constant speed, drops 8 cm into the jar.", light_mood="warm, white and gold.", sound="till beep f1028; the coin slide f1040-1058; a plink + ka-ching meme f1060.",
  after="The coin stays in the jar.")

CR = ST["crowd"]; ASK = ST["asker"]
scene(id="S09", f=[1095, 1189], set="street", light="day",
  vo="Cộng đồng nổ tung. \"Hộp này ở đâu ra?\"",
  gloss="The community exploded. \"Where did this box come from?\"",
  spine=5, viewer="The plaza: seven people, phones in hand; every phone buzzes at once, heads snap down, then up, jaws drop; one raises a sign WHERE FROM?",
  **{"in": {"type": "dissolve", "n": 6, "from": "S08"}, "out": {"type": "cut", "to": "S10"}},
  build="the plaza (fountain, flags, pavers), the crowd with phones (backs toward the lens), the asker's cardboard sign.",
  blocking="The crowd at the crowd marks, front view, phones held at chest height in one hand; the asker at asker.",
  action="f1097 every phone buzzes (a ring of shake lines at each phone); f1100-1110 heads tilt down to the screens; f1112 heads snap up, jaws drop (gape 0.5) ('nổ tung' f1111); f1127-1140 the asker lifts his sign WHERE FROM? over his head ('Hộp này' f1127); the others turn to him.",
  acting="The crowd: shock, then outrage; the asker: frowning.",
  cams=[kf(1095, sum([body(m) for m in CR], []) + [[ASK[0], 2.5, ASK[1]]], az=0, el=-5, fov=56, push=0.0006, margin=3.0, why="the plaza crowd, full bodies, the fountain behind")],
  kicks=[[1112, 0.6]],
  marks=[{"who": "crowd", "at": CR[0], "view": "front", "pose": "phones at chest; heads down f1100, up f1112", "expr": "neutral -> shock"}, {"who": "asker", "at": ASK, "view": "front", "pose": "raises the sign f1127-1140", "expr": "stern"}],
  subjects=[{"n": "asker head", "p": HEAD(ASK), "f": [1095, 1188]}, {"n": "left head", "p": HEAD(CR[5]), "f": [1095, 1188]}, {"n": "right head", "p": HEAD(CR[6]), "f": [1095, 1188]}],
  physics="none.", light_mood="bright midday, the fountain sparkling.", sound="seven notification pings at once f1097; a crowd 'ohhh' f1112; 'Huh?' meme f1130.",
  after="Unchanged.")

scene(id="S10", f=[1189, 1312], set="room", light="day",
  vo="Khoan, hàng chưa phát hành mà đã nằm trên tay một người, là hàng gì?",
  gloss="Wait: goods not yet released already in someone's hands, what kind of goods are they?",
  spine=6, viewer="Hard cut: the open box on the counter, perfectly still; the lid with its NOV 6 sticker; the lens circles the box.",
  **{"in": {"type": "cut", "from": "S09"}, "out": {"type": "dissolve", "to": "S11", "n": 8}},
  build="the counter, the open box, the lid in its stand.",
  blocking="Creator at HER, frozen mid-gesture (front view).",
  action="f1189 everything freezes (no blink); f1195-1300 the lens arcs 50 deg round the counter from the left to the right, low, the box centred; on 'trên tay một người' f1251 a slow push.",
  acting="Creator: frozen smile.",
  cams=[k(1189, [BOX[0] - 1.0, 1.55, BOX[2] + 1.95], [BOX[0], 1.35, BOX[2]], 40, cut=True, push=0.0, why="the box, frozen"),
        k(1200, [BOX[0] + 1.05, 1.5, BOX[2] + 1.9], [BOX[0], 1.35, BOX[2]], 40, glide=100, push=0.0006, why="arc round the box")],
  kicks=[[1189, 0.6]],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "frozen", "expr": "smile"}],
  subjects=[{"n": "box", "p": [BOX[0], 1.05, BOX[2]], "f": [1189, 1311]}],
  physics="none.", light_mood="the same bright room, now still.", sound="music cuts out f1189; a record scratch f1189; a single low clock tick every 15 f.",
  after="Unchanged.")

CAR = [DK["carton"][0], DK["top"] + 0.18, DK["carton"][1]]; LAB = [DK["label"][0], DK["label"][1], DK["label"][2]]
scene(id="S11", f=[1312, 1458], set="dock", light="day",
  vo="Bạn thấy đấy, hãng chỉ gửi hàng sớm cho nhà sáng tạo qua kênh chính thức, có ghi rõ nguồn.",
  gloss="You see, the company only sends early product to creators through the official channel, with the source clearly stated.",
  spine=6, viewer="A sunny warehouse dock: a courier carries a carton out of the open door and sets it on the shipping table; its big label: FROM: OFFICIAL DISTRIBUTOR / TO: CREATOR.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S10"}, "out": {"type": "dissolve", "to": "S12", "n": 8}},
  build="the warehouse front, the open roll-up door, the shipping table, the carton with its label.",
  blocking="Courier walks from courier_from to courier f1315-1372 (front view, carton in both hands at his chest), sets it on the table f1372-1390, steps back half a pace and gives a thumbs-free nod.",
  action="as blocking; f1405-1455 push in on the label ('ghi rõ nguồn' f1429-1445).",
  acting="Courier: brisk, pleasant.",
  cams=[kf(1312, body(DK["courier_from"]) + body(DK["courier"]) + [[-2.2, 3.4, -5.0], [2.2, 3.4, -5.0], [-0.7, 0.02, 1.4], [0.7, 0.02, 1.4]], az=0, el=-5, fov=46, push=0.0004, why="the dock wide"),
        k(1400, [LAB[0] + 0.05, LAB[1] + 0.12, LAB[2] + 0.75], LAB, 36, glide=40, push=0.0008, why="the label: the source stated")],
  kicks=[],
  marks=[{"who": "courier", "at": DK["courier"], "view": "front", "pose": "walks out carrying the carton f1315-1372; sets it down f1372-1390", "expr": "smile"}],
  subjects=[{"n": "courier head", "p": HEAD(DK["courier"]), "f": [1372, 1400]}, {"n": "label", "p": LAB, "f": [1430, 1457]}],
  physics="the carton: kinematic, then resting on the table.", light_mood="bright clean daylight.", sound="a forklift beep far off; footsteps; a carton thud f1390; a tidy 'ding' f1440.",
  after="Unchanged.")

BACKP = [BOX[0], 1.05, BOX[2] + 0.15]
scene(id="S12", f=[1458, 1534], set="room", light="day",
  vo="Còn hộp này, không ai nói nó đến từ đâu.",
  gloss="But this box: nobody says where it came from.",
  spine=6, viewer="She turns her box round on the counter: where a label would be, a bare white patch and one yellow question-mark sticker.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S11"}, "out": {"type": "dissolve", "to": "S13", "n": 8}},
  build="the box base turning 180 deg on the counter; its back side: a bare white patch, one '?' sticker.",
  blocking="Creator at HER, front view, both hands on the box's ends f1462-1500.",
  action="f1462-1470 her hands to the box; f1470-1496 she turns it 180 deg about its centre ('không ai nói' f1484); f1500-1534 push in on the bare patch and the '?' ('từ đâu' f1514).",
  acting="Creator: neutral, a small shrug.",
  cams=[kf(1458, body(HER) + BOXP, az=-6, el=-6, fov=42, push=0.0004, why="medium-wide: her and the box"),
        k(1498, [BACKP[0], 1.32, BACKP[2] + 0.62], BACKP, 34, glide=30, push=0.0008, why="the bare patch, the question mark")],
  kicks=[],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "turns the box f1470-1496", "expr": "neutral"}],
  subjects=[{"n": "creator head", "p": HEAD(HER), "f": [1458, 1495]}, {"n": "patch", "p": BACKP, "f": [1515, 1533]}],
  physics="the box: kinematic, turned in her hands, resting on the counter.", light_mood="bright.", sound="cardboard scrape f1472-1494; 'suspicious' sting f1505.",
  after="The box shows its bare side from now on.")

TIN = ST["tinman"]; TOUT = ST["tout"]; SIGN = ST["sign"]
scene(id="S13", hero=True, f=[1534, 1693], set="street", light="day",
  vo="Giống như ai đó khoe bộ phim chưa chiếu rạp, rồi đặt cạnh nó một đường dẫn tới vé chợ đen.",
  gloss="Like someone showing off a film that hasn't opened yet, then putting next to it a link to black-market tickets.",
  spine=6, viewer="The cinema front: a COMING SOON poster and closed doors; a man proudly holds up a film-reel tin; beside him a tout's little stand with a sign TICKETS, which he flips to x12.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 8}},
  build="the cinema facade, marquee, poster, closed doors; the film tin; the tout's stand and its flip sign.",
  blocking="Tinman at tinman (front view) holding the tin up beside the poster with both hands; tout at tout (front view) behind his stand.",
  action="f1534-1600 the man lifts the tin f1560-1575 ('khoe bộ phim' f1561), the tin flashes; f1602-1640 glide right to the stand ('đường dẫn' f1634); the tout taps his sign; f1668-1680 he flips it on its pivot ('chợ đen' f1670-1690): x12 PRICE.",
  acting="Tinman: proud; tout: sly grin, eyebrows up.",
  cams=[kf(1534, body(TIN) + body(TOUT) + [[ST["poster"][0], 2.55, 0.0], [ST["cin_door"][1], 2.4, 0.0]], az=0, el=-4, fov=48, push=0.0004, why="the cinema front: the man, the poster, the stand"),
        kf(1600, body(TOUT) + body(TIN) + [[SIGN[0], SIGN[1] + 0.2, SIGN[2]]], az=-8, el=-5, fov=40, glide=40, push=0.0006, why="closer on the stand and the sign")],
  kicks=[[1674, 0.4]],
  marks=[{"who": "tinman", "at": TIN, "view": "front", "pose": "lifts the tin f1560-1575 and holds it up", "expr": "grin"}, {"who": "tout", "at": TOUT, "view": "front", "pose": "flips the sign f1668-1680", "expr": "grin"}],
  subjects=[{"n": "tinman head", "p": HEAD(TIN), "f": [1534, 1692]}, {"n": "tout head", "p": HEAD(TOUT), "f": [1534, 1692]}, {"n": "sign", "p": SIGN, "f": [1640, 1692]}],
  physics="the sign: a hinged flip about its vertical pivot, eased.", light_mood="bright sun, the marquee bulbs on.", sound="a film projector whirr f1560; a sly 'hehe' f1678; a cash 'ding' f1680.",
  after="The sign shows x12.")

scene(id="S14", f=[1693, 1735], set="room", light="day",
  vo="Cô trả lời:",
  gloss="She answered:",
  spine=7, viewer="Her room: she holds her phone in both hands and types.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S13"}, "out": {"type": "dissolve", "to": "S15", "n": 6, "note": "onto her phone's screen"}},
  build="the room, the counter (box with its bare side), her phone (back toward the lens).",
  blocking="Creator at HER, front view, phone at chest height in both hands.",
  action="f1693-1735 she types (the phone bobs 1 cm every 6 f); slow push.",
  acting="Creator: calm, focused.",
  cams=[kf(1693, body(HER) + BOXP, az=4, el=-6, fov=42, push=0.0008, why="medium-wide: her with her phone")],
  kicks=[],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "types on her phone", "expr": "neutral"}],
  subjects=[{"n": "creator head", "p": HEAD(HER), "f": [1693, 1734]}],
  physics="none.", light_mood="bright.", sound="keyboard taps.",
  after="Unchanged.")

# her phone POV: her eye -> her phone in front of her chest (she faces +z; her right is -x)
HPH = [0.0, 1.2, RM["her"][1] + 0.38]; HN = nrm([0.0, 0.44, -0.38]); HUP = nrm([0.0, 0.38, 0.44])
HPOV = lambda f, dist, **kw: k(f, add(HPH, HN, dist), HPH, 40, **kw)
scene(id="S15", f=[1735, 1795], set="room", light="day",
  vo="\"Tôi chọn tự bỏ tiền mua.\"",
  gloss="\"I chose to spend my own money on this.\"",
  spine=7, viewer="Her own view of her phone: the reply typed out, 'I chose to spend my own money on this.', and sent.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S14"}, "out": {"type": "dissolve", "to": "S16", "n": 6}},
  build="her phone (POV): a reply box, the text typing in, the send arrow.",
  blocking="Creator (POV, not seen).",
  action="f1735-1760 the words type in ('Tôi chọn tự bỏ tiền mua' f1715-1765); f1762 the send arrow lights and the reply bubble jumps up into the thread; slow push.",
  acting="none.",
  cams=[HPOV(1735, 0.3, push=0.0006, why="her own phone, her reply")],
  kicks=[],
  marks=[],
  subjects=[{"n": "her phone", "p": HPH, "f": [1735, 1794]}],
  physics="none.", light_mood="bright; the counter and the pink rug below the phone.", sound="typing taps; a 'whoosh' sent f1762.",
  after="Unchanged.")

CORK = RM["cork"]
scene(id="S16", f=[1795, 1920], set="room", light="day",
  vo="Chưa có bằng chứng nào cho thấy cô ăn cắp, hay biết nguồn gốc hộp có vấn đề.",
  gloss="There is no evidence that she stole it, or knew the box's origin was a problem.",
  spine=7, viewer="The cork board on her wall: empty, one pushpin. No evidence.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S15"}, "out": {"type": "dissolve", "to": "S17", "n": 8}},
  build="the cork board with one red pushpin and nothing pinned.",
  blocking="Creator at HER in the foreground, front view, phone lowered.",
  action="f1795-1830 wide-ish from her to the board; f1830-1915 glide and push to the empty board ('bằng chứng' f1809-1820); the single pushpin.",
  acting="Creator: calm.",
  cams=[kf(1795, body(HER) + [[CORK[0] - 0.5, CORK[1] + 0.4, CORK[2]], [CORK[0] + 0.5, CORK[1] - 0.4, CORK[2]]], az=12, el=-4, fov=46, push=0.0003, why="her and the board behind"),
        k(1832, [CORK[0] + 0.1, CORK[1] - 0.02, CORK[2] + 1.6], CORK, 38, glide=50, push=0.0006, why="the empty board, one pin")],
  kicks=[],
  marks=[{"who": "creator", "at": HER, "view": "front", "pose": "standing, phone lowered", "expr": "neutral"}],
  subjects=[{"n": "creator head", "p": HEAD(HER), "f": [1795, 1825]}, {"n": "cork", "p": CORK, "f": [1880, 1919]}],
  physics="none.", light_mood="bright.", sound="quiet; one soft piano note f1835.",
  after="Unchanged.")

BRD = ST["board"]
scene(id="S17", f=[1920, 2132], set="street", light="day",
  vo="Nhưng eBay đã gỡ nhiều tin bán đồ Pokémon kỷ niệm ba mươi năm, với lý do: bán hàng ăn cắp không được phép.",
  gloss="But eBay has removed many listings of 30th-anniversary Pokémon items, on the grounds that selling stolen goods is not allowed.",
  spine=7, viewer="The plaza's FOR SALE board of printed listings (30th boxes and packs); one by one each flips over to a red REMOVED back.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S16"}, "out": {"type": "cut", "to": "S18"}},
  build="the listings board: eight listings on pivots (front: a box picture, 30th CELEBRATION, a price; back: red REMOVED, 'stolen goods not allowed').",
  blocking="Two passers-by at the board's sides (front view) watching.",
  action="f1920-1950 the board in the plaza; f1930 title eBay; listings flip one by one f1952 + 18 i (i 0..7), each a 6 f flip about its vertical centre line; f2040-2130 push in ('ăn cắp không được phép' f2069-2100).",
  acting="Passers-by: eyebrows up.",
  cams=[kf(1920, [[BRD[0] - 1.25, BRD[1] + 0.85, BRD[2]], [BRD[0] + 1.25, BRD[1] + 0.85, BRD[2]], [BRD[0] - 1.25, 0.02, BRD[2]], [BRD[0] + 1.25, 0.02, BRD[2]]] + body([BRD[0] - 1.6, BRD[2] + 0.8]) + body([BRD[0] + 1.6, BRD[2] + 0.8]), az=0, el=-3, fov=44, title=True, push=0.0005, why="the board with its listings, two passers-by"),
        k(2040, [BRD[0], BRD[1] + 0.05, BRD[2] + 2.6], BRD, 40, glide=60, push=0.0006, why="the board's REMOVED backs")],
  kicks=[],
  marks=[{"who": "passerL", "at": [BRD[0] - 1.6, BRD[2] + 0.8], "view": "front", "pose": "standing", "expr": "shock"}, {"who": "passerR", "at": [BRD[0] + 1.6, BRD[2] + 0.8], "view": "front", "pose": "standing", "expr": "neutral"}],
  subjects=[{"n": "board", "p": BRD, "f": [1920, 2131]}],
  physics="the listings: hinged flips about their vertical centre lines.", light_mood="bright midday.", sound="a paper flip and a stamp 'thunk' on each flip; plaza bed.",
  after="All eight show REMOVED.")

scene(id="S18", f=[2132, 2164], set="street", light="day",
  vo="Video đã bị xóa.",
  gloss="The video has been deleted.",
  spine=8, viewer="Hard cut: the viewer's phone: the video area grey, 'Video unavailable'; the button is gone.",
  **{"in": {"type": "cut", "from": "S17"}, "out": {"type": "dissolve", "to": "S19", "n": 6}},
  build="the phone (POV): the grey unavailable card.",
  blocking="Viewer (POV).",
  action="f2132 the screen already grey; f2140 a small 'video removed' wobble; still.",
  acting="none.",
  cams=[pov(2132, 0.0, 0.0, 0.42, cut=True, push=0.0006, why="the deleted video")],
  kicks=[[2132, 0.4]],
  marks=[],
  subjects=[{"n": "phone", "p": PH_C, "f": [2132, 2163]}],
  physics="none.", light_mood="bright.", sound="a soft 'bonk' error sound f2134; street bed.",
  after="Unchanged.")

scene(id="S19", f=[2164, 2228], set="room", light="day",
  vo="Chưa ai chứng minh hộp ấy bị đánh cắp.",
  gloss="Nobody has proved the box was stolen.",
  spine=8, viewer="The box on her counter, bare side out, the yellow question mark: unanswered.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S18"}, "out": {"type": "dissolve", "to": "S20", "n": 6}},
  build="the box (bare side, '?' sticker), the lid in its stand behind.",
  blocking="Nobody in frame (she is out of the push).",
  action="f2164-2228 slow push on the question mark.",
  acting="none.",
  cams=[k(2164, [BACKP[0] + 0.1, 1.36, BACKP[2] + 0.95], BACKP, 36, push=0.0010, why="the question mark, held")],
  kicks=[],
  marks=[],
  subjects=[{"n": "patch", "p": BACKP, "f": [2164, 2227]}],
  physics="none.", light_mood="bright, still.", sound="quiet; the theme returns softly.",
  after="Unchanged.")

scene(id="S20", f=[2228, 2268], set="street", light="day",
  vo="Nhưng cái nút mua",
  gloss="But the buy button",
  spine=8, viewer="The viewer's phone: his screenshot gallery, a grid of the same screenshot, each with the red Shop · $2,262 button.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S19"}, "out": {"type": "dissolve", "to": "S21", "n": 8}},
  build="the phone (POV): a gallery grid of nine screenshots.",
  blocking="Viewer (POV).",
  action="f2228-2268 the gallery scrolls up a little (the grid keeps coming: more of the same screenshot); f2242 ('nút mua') a camera-shutter flash on the screen.",
  acting="none.",
  cams=[pov(2228, 0.0, 0.0, 0.4, push=0.001, why="the screenshot gallery")],
  kicks=[],
  marks=[],
  subjects=[{"n": "phone", "p": PH_C, "f": [2228, 2267]}],
  physics="none.", light_mood="bright.", sound="camera shutter f2242.",
  after="Unchanged.")

WK = ST["walkers"]
scene(id="S21", f=[2268, 2330], set="street", light="day",
  vo="thì ai cũng đã kịp thấy.",
  gloss="everyone had already seen.",
  spine=8, viewer="The sunny high street: at the bus stop, outside the cafe, by the cinema, everyone is looking down at a phone.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S20"}, "out": {"type": "end"}},
  build="the whole street wide: bus stop, cafe, cinema, people on the pavement with phones.",
  blocking="The viewer at view and six walkers at the walkers marks, front view, each looking down at a phone held at chest height.",
  action="f2268-2330 the lens cranes up and back; every head tilted down to a phone; a shutter click f2290; hold to the end.",
  acting="Everyone: absorbed.",
  cams=[kf(2268, body(VIEW) + sum([body(m) for m in WK], []) + [[-1.6, 2.6, 0.5]], az=0, el=-8, fov=50, push=0.0, why="the street, everyone on a phone"),
        kf(2290, body(VIEW) + sum([body(m) for m in WK], []) + [[-1.6, 2.6, 0.5], [6.0, 4.6, 0.0], [-5.0, 4.6, 0.0]], az=0, el=-22, fov=52, glide=40, push=0.0, margin=3.0, d_max=60.0, why="crane up and back: the whole street")],
  kicks=[],
  marks=[{"who": "viewer", "at": VIEW, "view": "front", "pose": "looking down at his phone", "expr": "neutral"}],
  subjects=[{"n": "viewer head", "p": HEAD(VIEW), "f": [2268, 2329]}],
  physics="none.", light_mood="bright sun, blue sky with clouds.", sound="street bed; a shutter click f2290; the theme's last chord.",
  after="End.")

for sc in SC:
    extra = []
    for sj in sc.get("subjects", []):
        if sj["n"].endswith("head") and not sj.get("nofeet"):
            p = sj["p"]; extra.append({"n": sj["n"].replace("head", "feet"), "p": [p[0], 0.02, p[2]], "f": sj["f"]})
    sc.setdefault("subjects", []).extend(extra)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(SC), "scenes")
