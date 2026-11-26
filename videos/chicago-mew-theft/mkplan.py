"""Generator of plan.json for the Chicago (Old Skool TCG) reel. The plan is the source of truth: change it here, then
python3 videos/chicago-mew-theft/mkplan.py && python3 scripts/plan_check.py videos/chicago-mew-theft/plan.json"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "scripts"))
from plan_fit import fit
def kf(f, pts, az, el, fov, title=False, margin=5.0, **kw):
    """a camera key fitted to its subjects: the closest lens at this view direction that keeps them all in the safe area"""
    pos, look = fit(pts, az=az, el=el, fov=fov, title=title, margin=margin)
    return k(f, pos, look, fov, **kw)
def body(m, crouch=0.0):   # crown, feet, and the head's width (the cards are ~55 cm wide)
    y = 1.6 - crouch; return [[m[0], 1.82 - crouch, m[1]], [m[0], 0.02, m[1]], [m[0] - 0.28, y, m[1]], [m[0] + 0.28, y, m[1]], [m[0], y, m[1] - 0.28], [m[0], y, m[1] + 0.28]]
def k(f, pos, look, fov, glide=None, cut=False, push=0.0006, punch=None, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=0, why=why)  # quality bar (25 Nov 2026): no blur of any kind
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    return d

# ---------------- layout (set-local metres; the build reads these) ----------------
# SHOP: one set for the interior and the street outside it. Origin on the shop floor; the front wall (window + door) is z 5.4..5.6,
# the street is +z, the back wall of shelves is z -3.8. y up.
TOP = 0.98   # counter top
SHOP = dict(
    room=[-3.4, 3.4, -3.8, 5.4], h=3.4, tile=0.5,
    counter=[-1.0, 2.5, -1.45, -0.95], counter_y=TOP,
    box=[0.85, 1.35, -1.27, -1.03], box_h=0.06, riser=0.045,
    rows={"front": -1.09, "back": -1.215}, slot_x=[0.91, 1.005, 1.1, 1.195, 1.29], slab=[0.075, 0.126], lean=0.12,
    # the ten items in the box: front row then back row (name, kind, price); kind slab = a real slab photo, case/top = a real scan in a case
    items=[["rgb_mew_r", "case", 4000], ["slab_psyduck", "slab", 1800], ["zard_base", "top", 650], ["pikachu", "top", 90], ["blastoise", "top", 380],
           ["slab_mew", "slab", 150], ["slab_zard", "slab", 750], ["mewtwo", "top", 120], ["zard_lc", "top", 420], ["ds_rayquaza", "top", 260]],
    stolen={"S06": [0], "S08": [1, 5, 6]},   # the slots nearest his right hand   # item indices taken in each scene (the S01 hook is S08's first one, seen earlier)
    register=[1.75, TOP, -1.3], phone=[2.15, TOP, -1.25], stack=[0.42, TOP, -1.2],
    monitor=[2.0, 2.3, -1.45], monitor_size=[0.52, 0.32], cctv=[3.05, 3.12, 0.4], cctv_aim=[1.0, 1.0, -1.1],
    clock=[-1.4, 2.92, -3.79], dayboard=[-3.39, 1.55, 0.6],
    case=[-3.35, -2.9, -2.6, -0.8], case_h=2.0, case_shelf=1.0, case_door=[-2.1, -1.3],
    table=[-2.8, -1.6, 1.4, 2.4], table_y=0.75,
    window=[-2.9, 0.9, 0.6, 2.7], door=[1.4, 2.4, 0.0, 2.4], front_z=5.4,
    sign=[0.0, 3.05, 5.72], blade=[-1.7, 4.85, 5.65], banner=[-1.0, 2.4, 5.64],
    walk=[5.6, 8.8], street=[8.8, 18.0],
    # marks [x, z] at the feet
    owner_reg=[1.75, -1.62], owner_pay=[1.4, -1.5], owner_left=[0.1, -1.55], owner_phone=[2.15, -1.62],
    man=[0.7, -0.88], man_door=[1.9, 5.1], man_walk=[1.6, 6.8],
    kid=[-0.35, -0.72], teen=[-2.2, 2.75], woman=[2.75, 1.9], woman_reg=[2.1, -0.78], teal=[-2.45, -1.45], cop=[1.95, -0.8],
    case_stand=[-2.6, -1.7])
HOUSE = dict(room=[-3.0, 3.0, -3.0, 4.5], h=2.9, door=[-1.25, -0.25], window=[0.8, 2.4],
             table=[-0.2, 1.4, -0.95, -0.15], table_y=0.76, tray=[0.3, 0.765, -0.84], kitchen=[2.95, -0.6], chair=[0.3, -1.32],
             host_door=[-1.35, -2.35], guest_door=[-0.75, -3.4], guest_in=[-0.65, -2.25], guest_tbl=[0.3, -1.32], host_walk=[2.6, -1.3], host_mid=[0.9, -1.9])
JACKET = dict(panel=[0.0, 1.3, 0.0], panel_size=[0.42, 0.62],
              pockets={"rgb_mew_r": [-0.055, 1.43], "slab_psyduck": [0.055, 1.43], "slab_mew": [-0.048, 1.255], "slab_zard": [0.048, 1.255]},
              cash=[0.0, 1.07], slab_h=0.136)
S = SHOP
def item_pos(i):
    row = "front" if i < 5 else "back"
    x = S["slot_x"][i % 5]; z = S["rows"][row]; y = TOP + 0.005 + (S["riser"] if row == "back" else 0) + S["slab"][1] / 2
    return [x, round(y, 3), z]
BOX = [1.1, TOP + 0.06, -1.15]
REG = S["register"]; PHONE = S["phone"]; MON = S["monitor"]; CCTV = S["cctv"]
HEAD = lambda m: [m[0], 1.82, m[1]]   # the crown of the head (the check must see the whole head)
BOXP = [[0.85, TOP + 0.14, -1.03], [1.35, TOP + 0.14, -1.03], [0.85, TOP, -1.03], [1.35, TOP, -1.03]]
J = JACKET["pockets"]

P = {
 "fps": 30, "frames": 2440, "voice_end": 2410,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 300, "out": 372, "text": "CHICAGO", "style": 3, "from": "top"},
  {"f": 1124, "out": 1182, "text": "$6,700", "style": 3, "from": "top"}],
 "cards": {"box": [it[0] for it in S["items"]],
           "stolen": "rgb_mew_r (30th Celebration Mew R/RGB, raw, $4,000), slab_psyduck (PSA 8 Scream Psyduck 286/SM-P, $1,800), slab_mew (PSA 10 Celebrations gold Mew 25/25, $150), slab_zard (CGC 10 Evolutions M Charizard EX 13/108, $750)",
           "framed": ["zard_lc", "mewtwo", "pikachu", "blastoise", "zard_base", "ds_rayquaza", "evo_mzard", "cel_mew"]},
 "shop": SHOP, "house": HOUSE, "jacket": JACKET,
 "sets": {
  "shop": {"origin": [0, 0, 0], "axes": "the counter crosses the room at z -1.45..-0.95; the back wall of shelves at z -3.8; the front wall (window, door) at z 5.4 faces the street (+z)",
   "light": "day", "sun": [-35, 45], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: shop x -3.4..3.4, z -3.8..5.4, 3.4 m; checkered floor tiles 50 cm (cream / tomato red), cream walls with a red dado band, cream ceiling with two light panels", "pos": [0, 1.7, 0.8], "size": [6.8, 3.4, 9.2]},
    {"id": "counter", "build": "new: glass display counter x -1.0..2.2, z -1.45..-0.95, top y 0.98: warm oak base, a glass top section over cards and packs on red felt, brass trim", "pos": [0.6, 0.49, -1.2], "size": [3.2, 0.98, 0.5]},
    {"id": "box", "build": "new: the box of new stock, cardboard 50 x 24 x 11 cm, open with the four flaps folded out; NEW ARRIVALS on a strip of tape; two rows of five items standing in it (front row real scans in toploaders and the Red RGB Mew in a magnetic case, the PSA 8 Psyduck slab; back row on a 4.5 cm riser with the PSA 10 gold Mew and the CGC M Charizard); a white shop price sticker on each", "pos": BOX, "size": [0.5, 0.11, 0.24]},
    {"id": "register", "build": "new: cash register 36 x 32 cm: body, keypad, a screen on a stalk facing the owner, a cash drawer that slides out toward the owner", "pos": REG, "size": [0.36, 0.2, 0.32]},
    {"id": "phone", "build": "new: counter phone base with a corded handset and a caller-ID screen tilted toward the owner: INCOMING 3:12 PM (773) 555-0142", "pos": PHONE, "size": [0.2, 0.08, 0.18]},
    {"id": "monitor", "build": "new: customer monitor 52 x 32 cm hanging from the ceiling on a pole, facing +z: four live camera views (counter, box, door, aisle), REC dot and the time", "pos": MON, "size": [0.52, 0.32, 0.04]},
    {"id": "cctv", "build": "new: ceiling camera on a wall bracket: white bullet housing 26 cm, sun hood, black lens, a red REC lamp that blinks", "pos": CCTV, "size": [0.26, 0.1, 0.1]},
    {"id": "shelves", "build": "new: back wall shelving x -3.3..3.3, five shelves of sealed product (booster boxes, tins, collection boxes in bright colours), OLD SKOOL TCG letters above, framed real cards, wall clock at 4:00, chalkboard TODAY WED", "pos": [0, 1.35, -3.6], "size": [6.6, 2.4, 0.35]},
    {"id": "case", "build": "new: tall locked glass case on the left wall x -3.35..-2.9, z -2.6..-0.8, 2.0 m: oak frame, a glass door z -2.1..-1.3 hinged at z -2.1 (fixed glass either side), four glass shelves with real cards on stands; brass padlock", "pos": [-3.12, 1.0, -1.7], "size": [0.45, 2.0, 1.8]},
    {"id": "table", "build": "new: play table x -2.8..-1.6, z 1.4..2.4, top 0.75, green play mats, binders, two stools", "pos": [-2.2, 0.375, 1.9], "size": [1.2, 0.75, 1.0]},
    {"id": "pegboard", "build": "new: pegboard on the right wall z 0.4..3.4 with hanging booster packs; sign SMILE! YOU ARE ON CAMERA by the camera", "pos": [3.38, 1.4, 1.9], "size": [0.04, 1.6, 3.0]},
    {"id": "front", "build": "new: front wall z 5.4..5.6: shop window x -2.9..0.9, y 0.6..2.7 (painted lettering SINGLES · SLABS · SEALED, an OPEN neon, the window calendar NOV with SEP and OCT torn off), glass door x 1.4..2.4 with a brass bell", "pos": [0, 1.7, 5.5], "size": [6.8, 3.4, 0.2]},
    {"id": "facade", "build": "new: red-brick two-storey facade x -3.6..3.6, 7.4 m: sign board OLD SKOOL TCG over the window and door, a tall vertical sign OLD SKOOL / TCG on the upper storey, GRAND OPENING banner under the sign, upper windows, a cornice, a wooden water tower on the roof; neighbours a laundromat (blue awning) and a café (red-and-white striped awning); far skyline", "pos": [0, 3.7, 5.6], "size": [7.2, 7.4, 0.3]},
    {"id": "street", "build": "new: sidewalk z 5.6..8.8 (concrete slabs), curb, asphalt street z 8.8..18 with a yellow line, a lamp post, a red hydrant, a planter tree, a bike rack, a blue newspaper box, a parked yellow taxi", "pos": [0, 0, 11.8], "size": [24, 0.1, 12.4]}],
   "marks": {k: S[k] for k in ["owner_reg", "owner_pay", "owner_left", "owner_phone", "man", "man_door", "man_walk", "kid", "teen", "woman", "woman_reg", "teal", "cop", "case_stand"]}},
  "house": {"origin": [80, 0, 0], "axes": "the front door in the back wall z -3; the dining table in the middle; the kitchen doorway in the right wall; the lens at +z",
   "light": "day", "sun": [30, 45], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: dining room x -3..3, z -3..4.5, 2.9 m; warm yellow walls, oak floor, a rug, a cloudy-sky window x 0.8..2.4, picture frames, a sideboard, a plant", "pos": [0, 1.45, 0.75], "size": [6, 2.9, 7.5]},
    {"id": "door", "build": "new: front door x -1.25..-0.25 in the back wall, red, opens inward on a hinge at x -1.25; a porch, a blue sky and a hedge beyond", "pos": [-0.75, 1.05, -3.0], "size": [1.0, 2.1, 0.05]},
    {"id": "table", "build": "new: dining table x -0.2..1.4, z -0.95..-0.15, top 0.76, white cloth; a cake on a stand, two plates, a silver tray of six spoons at the front edge", "pos": [0.6, 0.38, -0.55], "size": [1.6, 0.76, 0.8]},
    {"id": "gift", "build": "new: one of his sealed booster boxes gift-wrapped in red paper with a gold ribbon and bow, 30 x 20 x 10 cm", "pos": [-0.75, 1.1, -3.3], "size": [0.3, 0.1, 0.2]}],
   "marks": {k: HOUSE[k] for k in ["host_door", "guest_door", "guest_in", "guest_tbl", "host_walk"]}},
  "jacket": {"origin": [160, 0, 0], "axes": "the open jacket lining stands in the plane z 0, facing +z (his eyes); the lens at +z",
   "light": "day", "sun": [0, 50], "open_sides": "+z",
   "objects": [
    {"id": "lining", "build": "new: the inside of the camel jacket: red satin lining 42 x 62 cm with stitching, the camel front edge and lapel on the left, four clear vinyl inner pockets and a small cash pocket", "pos": JACKET["panel"], "size": [0.42, 0.62, 0.02]},
    {"id": "cards", "build": "real: the Red RGB Mew scan in a magnetic one-touch case, the PSA 8 Psyduck, PSA 10 gold Mew and CGC 10 M Charizard slab photos (library/slabs), each with its white OLD SKOOL price sticker; three $100 bills in the cash pocket", "pos": [0, 1.34, 0.01], "size": [0.2, 0.32, 0.01]}],
   "marks": {}}},
 "cast": {
  "owner": {"look": ["green OLD SKOOL staff tee", "red cap", "glasses"], "items": ["$100 bills", "phone handset", "the box"], "views": ["front", "side walking"]},
  "man": {"look": ["camel jacket", "blue jeans", "dark hair", "no disguise"], "items": ["three sealed booster boxes", "$100 bills", "his phone"], "views": ["front", "side walking"]},
  "kid": {"look": ["yellow hoodie"], "items": [], "views": ["front"]},
  "teen": {"look": ["sky-blue tee", "cap"], "items": ["binder"], "views": ["front"]},
  "woman": {"look": ["red jacket", "dark hair"], "items": ["booster pack"], "views": ["front"]},
  "teal": {"look": ["teal jacket", "glasses"], "items": [], "views": ["front"]},
  "cop": {"look": ["light-blue shirt", "blue trousers", "checkered cap band", "gold badge"], "items": ["notepad", "pen"], "views": ["front"]}},
 "scenes": []}

SC = P["scenes"]
def scene(**kw): SC.append(kw)
MAN = S["man"]; OWN = S["owner_reg"]
WIDE_IN = dict(pos=[0.35, 1.95, 2.9], look=[0.2, 1.15, -2.3])
STREET = dict(pos=[0.25, 3.3, 18.0], look=[0.0, 4.0, 5.4])

scene(id="S01", hero=True, f=[0, 229], set="shop", light="day",
  vo="Một người đàn ông bán thẻ Pokémon cho chủ tiệm, nhận ba trăm đô, rồi đứng ngay đó, lấy trộm của chính cái tiệm vừa trả tiền cho mình.",
  gloss="A man sold Pokémon cards to a shop owner, took three hundred dollars, then, standing right there, stole from the very shop that had just paid him.",
  spine=1, viewer="Paid with one hand, stealing with the other, without moving a step.",
  **{"in": {"type": "open on the act"}, "out": {"type": "travel", "to": "S02", "note": "the camera pulls back out through the shop window to the street; the shop sign lands on 'tiệm'"}},
  build="new: the counter, the box of new stock, the register, the three booster boxes he sold (stacked on the counter), $100 bills.",
  blocking="Man at the man mark in front of the counter facing it; owner across the counter at owner_pay, counting bills; from f100 the owner steps right to the register (owner_reg) and taps keys, eyes down.",
  action="f0 the owner's arm already over the counter with the bills; f80, f85, f89 three $100 bills slap down into the man's open palm (2 f before 'ba' f82, 'trăm' f87, 'đô' f91), each a small kick; f96-104 he closes his hand, grins; f100-122 the owner steps to the register; f121 'đứng ngay đó' his feet stay planted; f128-140 his far arm (screen left) drops into the box; f142 ('lấy') it grips the PSA 8 Psyduck by the top edge; f142-150 lifts it 15 cm clear; f150-157 it travels to his chest and slips behind the jacket on 'trộm' (f157); the box keeps the gap; f160-229 the camera pulls back and rises out through the window to the street: the OLD SKOOL TCG sign lands on 'tiệm' (f183).",
  acting="Man: polite smile -> sly grin, eyes sliding to the owner and back. Owner: friendly, busy, never looks up.",
  cams=[kf(0, body(MAN) + body(S["owner_pay"]) + BOXP, az=6, el=-12, fov=44, push=0.0004, why="the cash and the box together, both men full body"),
        kf(124, body(MAN) + BOXP, az=10, el=-14, fov=40, glide=20, push=0.001, why="his far hand and the box, the man full body"),
        k(162, STREET["pos"], STREET["look"], 50, glide=62, push=0.0, why="pull out through the window: the shop sign on 'tiệm'")],
  kicks=[[80, 0.35], [85, 0.35], [89, 0.5]],
  marks=[{"who": "man", "at": MAN, "view": "front", "pose": "right palm up f0-96, left arm into the box f128-157", "expr": "smile -> grin"},
         {"who": "owner", "at": S["owner_pay"], "view": "front", "pose": "counts bills f0-92; steps to the register f100-122", "expr": "smile"}],
  subjects=[{"n": "man head", "p": HEAD(MAN), "f": [0, 158]}, {"n": "owner head", "p": HEAD(S["owner_pay"]), "f": [0, 98]}, {"n": "box", "p": BOX, "f": [0, 160]},
            {"n": "sign", "p": S["sign"], "f": [205, 228]}],
  physics="bills: light, each lands with a 2-frame flutter and lies flat on the stack. The slab: kinematic in his hand.",
  light_mood="bright day, warm shop light.", sound="shop murmur; three paper slaps f80/85/89 with a soft ka-ching on f91; a sly pluck f142; a cloth swish f157; a whoosh out through the window f165-200; street air.",
  after="One more gap in the box (the Psyduck); the bills in his hand.")

scene(id="S02", f=[229, 398], set="shop", light="day",
  vo="Tiệm Old Skool TCG của Nick Bruni ở Chicago mới mở cửa được hai tháng.",
  gloss="Nick Bruni's Old Skool TCG in Chicago had been open just two months.",
  spine=2, viewer="A brand-new shop in Chicago: the sign, the GRAND OPENING banner still up.",
  **{"in": {"type": "glide", "from": "S01"}, "out": {"type": "travel", "to": "S03", "note": "into the shop through the window"}},
  build="the street, the facade with the sign board, the blade sign, the GRAND OPENING banner, the window calendar (NOV, SEP and OCT torn off), the water tower, the far skyline.",
  blocking="A woman walks by on the sidewalk f240-330 (side view, left to right); the shop's customers are seen inside through the window.",
  action="f229-300 slow push on the storefront; f300 title CHICAGO; f333-376 'mới mở cửa được hai tháng': glide down to the window: the GRAND OPENING banner sags a little in the breeze, the window calendar shows NOV with the stubs of SEP and OCT; f376-398 the camera travels toward the window.",
  acting="none.",
  cams=[k(229, STREET["pos"], STREET["look"], 50, push=0.0008, why="the storefront, the sign and the water tower in one tall frame"),
        k(330, [-0.8, 1.75, 9.4], [-0.95, 1.85, 5.4], 44, glide=36, push=0.0008, why="the banner and the window calendar"),
        k(378, [-0.3, 1.65, 6.4], [-0.2, 1.4, 2.8], 50, glide=20, push=0.0, why="toward the window")],
  kicks=[], marks=[{"who": "woman", "at": [-3.5, 5.6], "view": "side", "pose": "walks by f240-330", "expr": "neutral"}],
  subjects=[{"n": "sign", "p": S["sign"], "f": [229, 330]}, {"n": "water tower", "p": [-1.5, 8.6, 2.2], "f": [229, 296]}, {"n": "banner", "p": S["banner"], "f": [350, 376]}],
  physics="the banner: a gentle sine sag (2 cm at 0.5 Hz).", light_mood="bright day, blue sky with clouds.", sound="street ambience, a passing car f260, a bus air brake far off f320; the score enters.",
  after="Unchanged.")

scene(id="S03", f=[398, 457], set="shop", light="day",
  vo="Chiều thứ Tư, tiệm đông khách.",
  gloss="Wednesday afternoon, the shop was busy.",
  spine=2, viewer="Inside: busy, 4 p.m., Wednesday.",
  **{"in": {"type": "glide", "from": "S02", "note": "through the window"}, "out": {"type": "glide", "to": "S04"}},
  build="the interior dressed: shelves of sealed product, posters, the clock at 4:00, the TODAY WED chalkboard, the play table, the pegboard.",
  blocking="Owner at the register; kid at the counter front (kid mark) looking into the glass; teen at the play table with a binder; woman at the pegboard; teal man at the glass case.",
  action="f398-430 the camera glides in over the window ledge into the room; the clock's minute hand on 12, hour on 4; the customers browse (the teen turns a binder page f420, the woman lifts a pack f430).",
  acting="Customers: absorbed. Owner: busy, smiling.",
  cams=[kf(398, body(OWN) + body(S["kid"]) + [S["clock"]], az=4, el=-10, fov=54, glide=28, push=0.0008, why="the busy shop, the counter and the clock")],
  kicks=[], marks=[{"who": w, "at": S[w], "view": "front", "pose": "browsing", "expr": "neutral"} for w in ["kid", "teen", "woman", "teal"]] + [{"who": "owner", "at": OWN, "view": "front", "pose": "at the register", "expr": "smile"}],
  subjects=[{"n": "owner head", "p": HEAD(OWN), "f": [425, 456]}, {"n": "kid head", "p": HEAD(S["kid"]), "f": [425, 456]}, {"n": "clock", "p": S["clock"], "f": [425, 456]}],
  physics="none.", light_mood="warm day interior.", sound="shop chatter, a binder page, a register beep far.",
  after="Unchanged.")

scene(id="S04", f=[457, 552], set="shop", light="day",
  vo="Người đàn ông gọi điện trước, hẹn mang hàng tới bán.",
  gloss="The man had phoned ahead, arranging to bring product to sell.",
  spine=2, viewer="The phone rings with his number; then he walks in with sealed boxes.",
  **{"in": {"type": "glide", "from": "S03"}, "out": {"type": "glide", "to": "S05"}},
  build="the counter phone (caller ID: INCOMING 3:12 PM, (773) 555-0142), the glass door with its bell.",
  blocking="Owner at owner_phone, picks up the handset; the man comes in through the door (man_door) carrying three booster boxes against his chest and walks to the counter (arrives f612 in S05).",
  action="f462 the phone rings (the screen lights, the handset rattles in its cradle, 2 rings); f484 the owner lifts the handset to his ear; f503 'hẹn' he nods; f512 the door opens (swings in 70 deg over 10 f), the bell jingles; f512-612 the man walks in toward the counter, boxes held at his chest.",
  acting="Owner: friendly on the phone, nods. Man: easy smile.",
  cams=[k(457, [2.15, 1.45, -1.53], [2.15, 1.065, -1.31], 30, glide=22, push=0.0006, why="the caller ID: his number"),
        kf(494, body(S["man_door"]) + [[1.4, 2.45, 5.4], [2.4, 0.02, 5.4]], az=180, el=-6, fov=50, glide=32, push=0.0006, why="from the counter: the door opens, he walks in with the boxes")],
  kicks=[], marks=[{"who": "owner", "at": S["owner_phone"], "view": "front", "pose": "handset to his ear f484-540", "expr": "smile"},
                   {"who": "man", "at": S["man_door"], "view": "front walking", "pose": "walks in with the boxes f514-590", "expr": "smile"}],
  subjects=[{"n": "phone screen", "p": [PHONE[0], PHONE[1] + 0.05, PHONE[2]], "f": [470, 492]}, {"n": "door", "p": [1.9, 1.2, 5.4], "f": [526, 551]}],
  physics="the handset: two rattles in the cradle per ring (1 mm).", light_mood="warm day interior.", sound="phone ring x2 (f462, f478); handset lift click f484; door bell jingle f512; footsteps.",
  after="The man is inside with the boxes.")

scene(id="S05", f=[552, 635], set="shop", light="day",
  vo="Cạnh quầy thu ngân là một hộp hàng mới về.",
  gloss="Beside the register sat a box of newly arrived stock.",
  spine=3, viewer="The open box of priced cards right beside the register.",
  **{"in": {"type": "glide", "from": "S04"}, "out": {"type": "glide", "to": "S06"}},
  build="the box of new stock with ten items and price stickers.",
  blocking="Owner hangs up and goes back to the register; the man arrives at the man mark f612 and sets the stack of boxes on the counter (stack) f612-622.",
  action="f552-600 the camera glides along the counter from the register to the box; f600-635 push in: two rows of real cards, each with its sticker ($4,000 on the Red RGB Mew); f620 the stack lands on the counter beside the box with a soft thud.",
  acting="none.",
  cams=[k(552, [1.7, 1.45, -0.15], [1.75, 1.08, -1.3], 40, glide=24, push=0.0006, why="the register"),
        k(578, [1.18, 1.72, -0.2], [1.1, 1.04, -1.16], 38, glide=40, push=0.0012, why="the box beside the register, the stickers")],
  kicks=[], marks=[{"who": "man", "at": MAN, "view": "front", "pose": "sets the stack down f612-622", "expr": "smile"}],
  subjects=[{"n": "box", "p": BOX, "f": [614, 634]}, {"n": "register", "p": REG, "f": [552, 580]}],
  physics="the stack: set down, a 1 cm settle.", light_mood="warm.", sound="handset hang-up click f556; a soft cardboard thud f620; a glassy shimmer on the push f605.",
  after="The stack sits on the counter right of the box.")

scene(id="S06", f=[635, 723], set="shop", light="day",
  vo="Tay anh ta thò vào. Một lá biến mất.",
  gloss="His hand went in. One card vanished.",
  spine=3, viewer="While the owner serves someone else, his hand dips in and the Red RGB Mew is gone; the gap stays.",
  **{"in": {"type": "glide", "from": "S05"}, "out": {"type": "glide", "to": "S07"}},
  build="as before; the woman now at the register paying (woman_reg).",
  blocking="Man at the man mark, looking around the shop; owner at the register facing the woman.",
  action="f638-650 his far arm (screen left) slides over the box rim; f651 ('thò vào') it dips in; f672 grips the Red RGB Mew's case; f672-684 lifts it out; f684-700 to his chest and behind the jacket ('biến mất' f692-704); the slot is empty from f684.",
  acting="Man: whistling innocence, eyes up at the ceiling. Owner: chatting with the woman, eyes on her.",
  cams=[kf(635, body(MAN) + body(OWN) + body(S["woman_reg"]) + BOXP, az=4, el=-12, fov=46, glide=26, push=0.0008, why="the man and the box, the owner busy with the woman"),
        kf(660, body(MAN) + BOXP, az=8, el=-12, fov=40, glide=14, push=0.0006, why="closer on the lift, the man still full body")],
  kicks=[[651, 0.25]],
  marks=[{"who": "man", "at": MAN, "view": "front", "pose": "left arm into the box f638-700", "expr": "whistle"}, {"who": "owner", "at": OWN, "view": "front", "pose": "serving", "expr": "smile"},
         {"who": "woman", "at": S["woman_reg"], "view": "front", "pose": "paying", "expr": "smile"}],
  subjects=[{"n": "man head", "p": HEAD(MAN), "f": [635, 722]}, {"n": "box", "p": BOX, "f": [635, 722]}],
  physics="the case: kinematic in his hand.", light_mood="warm.", sound="Suspicious Sound (meme) f648; a cloth swish f700.",
  after="One gap in the front row (the Red RGB Mew).")

scene(id="S07", f=[723, 800], set="shop", light="day",
  vo="Rồi anh ta bán hàng cho Bruni, cầm tiền.",
  gloss="Then he sold his product to Bruni and took the money.",
  spine=3, viewer="The deal: the drawer pops, three bills into his palm.",
  **{"in": {"type": "glide", "from": "S06"}, "out": {"type": "glide", "to": "S08"}},
  build="the register drawer, $100 bills.",
  blocking="Woman leaves (walks off right f723-760); owner steps from the register to owner_pay f730-745.",
  action="f748 the owner taps the register; f752 the drawer shoots out with a ka-ching; f756-768 he takes three bills; f776, f781, f786 he slaps them one by one into the man's palm ('cầm tiền' f776-789).",
  acting="Owner: pleased with the deal. Man: friendly nod.",
  cams=[kf(723, body(MAN) + body(S["owner_pay"]) + [REG], az=16, el=-10, fov=42, glide=24, push=0.0012, why="the deal across the counter, the register, the bills")],
  kicks=[[752, 0.4]],
  marks=[{"who": "owner", "at": S["owner_pay"], "view": "front", "pose": "drawer f748, bills f776-786", "expr": "smile"}, {"who": "man", "at": MAN, "view": "front", "pose": "palm up f770-790", "expr": "smile"}],
  subjects=[{"n": "man head", "p": HEAD(MAN), "f": [723, 799]}, {"n": "owner head", "p": HEAD(S["owner_pay"]), "f": [723, 799]}],
  physics="the drawer: slides 16 cm in 3 f and bounces 1 cm.", light_mood="warm.", sound="register key f748; Kaching (meme) f752; three paper slaps f776/781/786.",
  after="He holds $300; the drawer is shut again (f794).")

scene(id="S08", hero=True, f=[800, 895], set="shop", light="day",
  vo="Xong quay lại cái hộp, thêm ba lá nữa.",
  gloss="Then he turned back to the box and took three more.",
  spine=3, viewer="One, two, three slabs into his jacket; four gaps now.",
  **{"in": {"type": "glide", "from": "S07"}, "out": {"type": "through-object", "to": "S09", "n": 8, "note": "push into his jacket, dissolve into the lining"}},
  build="as before.",
  blocking="Owner turns away to shelve the booster boxes (carries the stack to the back shelves, f805-890, side view walking); the man stays at the man mark.",
  action="f804-815 he tucks the cash into his jacket; f822 ('quay lại') turns his eyes to the box; f846-856 the Psyduck slab out, into the jacket; f863-873 the gold Mew; f875-885 the M Charizard ('thêm ba lá nữa': f849, f866, f878); each lift 12 cm, each into the jacket; f886-895 the camera pushes into his jacket.",
  acting="Man: quick and calm, a tiny smirk. Owner: back turned.",
  cams=[kf(800, body(MAN) + BOXP, az=8, el=-12, fov=40, glide=22, push=0.0012, why="him and the box, the owner going to the shelves"),
        k(882, [0.66, 1.3, -0.36], [0.68, 1.25, -0.9], 34, glide=13, push=0.0, why="into his jacket")],
  kicks=[[849, 0.2], [866, 0.2], [878, 0.3]],
  marks=[{"who": "man", "at": MAN, "view": "front", "pose": "three lifts f846-885", "expr": "smirk"}, {"who": "owner", "at": OWN, "view": "side walking", "pose": "shelves the stack f805-890", "expr": "neutral"}],
  subjects=[{"n": "man head", "p": HEAD(MAN), "f": [800, 880]}, {"n": "box", "p": BOX, "f": [800, 880]}],
  physics="the slabs: kinematic in his hand.", light_mood="warm.", sound="three quick plucks f849/866/878 rising; a swish each into the jacket.",
  after="Four gaps in the box; his jacket holds four cards and $300.")

scene(id="S09", hero=True, f=[895, 1118], set="jacket", light="day",
  vo="Một lá Mew kỷ niệm ba mươi năm giá bốn nghìn đô, một lá Psyduck chấm điểm giá một nghìn tám, thêm Mew và Charizard.",
  gloss="A 30th-anniversary Mew worth four thousand dollars, a graded Psyduck worth eighteen hundred, plus a Mew and a Charizard.",
  spine=4, viewer="The four real cards in his jacket, each with the shop's price sticker.",
  **{"in": {"type": "through-object", "n": 8, "from": "S08"}, "out": {"type": "glide", "to": "S10"}},
  build="the jacket lining with four clear pockets: Red RGB Mew (magnetic case, sticker $4,000), PSA 8 Psyduck ($1,800), PSA 10 gold Mew ($150), CGC 10 M Charizard ($750); three $100 bills in the cash pocket.",
  blocking="Nobody (his view into his own jacket).",
  action="f895-980 the Red RGB Mew fills the frame ('Mew kỷ niệm ba mươi năm' f911-940; the sticker $4,000 on 'bốn nghìn đô' f962-975); f982-1062 glide to the Psyduck slab (PSA 8 label, sticker $1,800 on f1045-1056); f1066-1118 glide to the gold Mew and the M Charizard side by side ('thêm Mew và Charizard' f1068-1099); a white gleam crosses each case as it arrives.",
  acting="none.",
  cams=[k(895, [J["rgb_mew_r"][0], J["rgb_mew_r"][1], 0.36], [J["rgb_mew_r"][0], J["rgb_mew_r"][1], 0.0], 30, push=0.0006, why="the Red RGB Mew, $4,000"),
        k(982, [J["slab_psyduck"][0], J["slab_psyduck"][1], 0.4], [J["slab_psyduck"][0], J["slab_psyduck"][1], 0.0], 30, glide=30, push=0.0006, why="the PSA 8 Psyduck, $1,800"),
        k(1064, [0.0, J["slab_mew"][1], 0.68], [0.0, J["slab_mew"][1], 0.0], 30, glide=32, push=0.0004, why="the gold Mew and the M Charizard (each 41% of the width)")],
  kicks=[],
  marks=[],
  subjects=[{"n": "rgb mew", "p": [J["rgb_mew_r"][0], J["rgb_mew_r"][1], 0], "f": [900, 980]}, {"n": "psyduck", "p": [J["slab_psyduck"][0], J["slab_psyduck"][1], 0], "f": [1000, 1062]},
            {"n": "gold mew", "p": [J["slab_mew"][0] - 0.03, J["slab_mew"][1], 0], "f": [1086, 1117]}, {"n": "charizard", "p": [J["slab_zard"][0] + 0.03, J["slab_zard"][1], 0], "f": [1086, 1117]}],
  physics="none.", light_mood="the jacket's own warm light; each case sharp and bright.", sound="a soft sparkle per card (f905, f990, f1070); a price 'tick' on each sticker (f965, f1048).",
  after="Unchanged.")

scene(id="S10", f=[1118, 1188], set="jacket", light="day",
  vo="Tổng cộng sáu nghìn bảy trăm đô.",
  gloss="Six thousand seven hundred dollars in total.",
  spine=4, viewer="All four cards together: $6,700.",
  **{"in": {"type": "glide", "from": "S09"}, "out": {"type": "dissolve", "to": "S11", "n": 8}},
  build="as S09.",
  blocking="Nobody.",
  action="f1118-1150 pull back to all four cards and the bills; f1124 title $6,700 (lands on 'sáu nghìn bảy trăm' f1145-1162).",
  acting="none.",
  cams=[k(1118, [0.0, 1.4, 0.9], [0.0, 1.4, 0.0], 30, glide=28, push=0.0006, why="all four cards under the $6,700 title")],
  kicks=[[1146, 0.4]], marks=[],
  subjects=[{"n": "rgb mew", "p": [J["rgb_mew_r"][0], J["rgb_mew_r"][1], 0], "f": [1146, 1187]}, {"n": "charizard", "p": [J["slab_zard"][0], J["slab_zard"][1], 0], "f": [1146, 1187]}],
  physics="none.", light_mood="warm.", sound="a cash-register ka-ching f1146 on the title.",
  after="Unchanged.")

scene(id="S11", f=[1188, 1336], set="shop", light="day",
  vo="Chủ tiệm đứng cách đó vài bước. Camera treo ngay đó, ai nhìn cũng thấy.",
  gloss="The owner stood a few steps away. A camera hung right there, in plain sight.",
  spine=5, viewer="The owner was a few floor tiles away; a camera with a red REC lamp, and a monitor showing the box.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S10"}, "out": {"type": "glide", "to": "S12"}},
  build="the ceiling camera (REC lamp), the customer monitor with four views (the box view shows him at the counter).",
  blocking="Man at the man mark (the S08 moment, cards already gone); owner at the register.",
  action="f1188-1243 high wide: the owner at the register, the man at the box, the floor tiles between them ('vài bước' f1226-1236); f1246-1290 glide up to the ceiling camera: its REC lamp blinks (15 f on / 15 f off); f1295-1323 glide to the monitor: four views, the counter view shows the man and the box ('ai nhìn cũng thấy').",
  acting="Owner: busy at the register. Man: casual.",
  cams=[kf(1188, body(MAN) + body(OWN), az=12, el=-24, fov=52, push=0.0006, why="a few steps apart, the floor tiles between them"),
        k(1248, [1.85, 2.3, 1.95], [3.02, 3.08, 0.38], 36, glide=42, push=0.0008, why="the ceiling camera, REC"),
        k(1294, [1.75, 2.1, 0.15], [2.0, 2.28, -1.45], 34, glide=26, push=0.0008, why="the monitor: anyone can see")],
  kicks=[],
  marks=[{"who": "man", "at": MAN, "view": "front", "pose": "standing at the box", "expr": "smirk"}, {"who": "owner", "at": OWN, "view": "front", "pose": "at the register", "expr": "neutral"}],
  subjects=[{"n": "man head", "p": HEAD(MAN), "f": [1188, 1240]}, {"n": "owner head", "p": HEAD(OWN), "f": [1188, 1240]}, {"n": "cctv", "p": CCTV, "f": [1290, 1296]}, {"n": "monitor", "p": MON, "f": [1310, 1335]}],
  physics="none.", light_mood="warm.", sound="a low drone; Camera shutter (meme) f1262 as the REC lamp comes into frame; a monitor hum.",
  after="Unchanged.")

scene(id="S12", f=[1336, 1495], set="shop", light="day",
  vo="Khoan, ai lại đi trộm trước mặt chủ, dưới ống kính, sau khi vừa gọi điện hẹn hẳn hoi?",
  gloss="Wait, who steals right in front of the owner, under the lens, after phoning ahead to book the visit?",
  spine=5, viewer="Three reasons he should have been caught: the owner's face, the lens, his own number.",
  **{"in": {"type": "glide", "from": "S11"}, "out": {"type": "dissolve", "to": "S13", "n": 8}},
  build="as before.",
  blocking="Man at the man mark; owner at owner_pay, right behind the box, facing the man across the counter.",
  action="f1336 'Khoan': everything freezes (the customers stop mid-move), a record scratch; f1351-1397 'trước mặt chủ': the owner's face across the counter, a metre from the box; f1405-1428 'dưới ống kính': the view from right under the ceiling camera down onto the man and the box (the camera's hood in the top of frame); f1432-1484 'gọi điện hẹn hẳn hoi': the caller-ID screen, his number.",
  acting="Owner: friendly, oblivious. Man: frozen mid-smirk.",
  cams=[k(1336, [1.75, 2.1, 0.15], [2.0, 2.28, -1.45], 32, push=0.0, why="hold: the freeze"),
        kf(1350, body(S["owner_pay"]) + body(MAN) + BOXP, az=6, el=-10, fov=42, glide=38, push=0.001, why="right in front of the owner"),
        k(1402, [2.75, 2.95, 0.25], [0.85, 1.05, -1.0], 44, glide=24, push=0.0008, why="under the lens"),
        k(1436, [2.15, 1.45, -1.53], [2.15, 1.065, -1.31], 30, glide=26, push=0.0008, why="his own number on the caller ID")],
  kicks=[[1336, 0.6]],
  marks=[{"who": "man", "at": MAN, "view": "front", "pose": "frozen", "expr": "smirk"}, {"who": "owner", "at": S["owner_pay"], "view": "front", "pose": "standing behind the box", "expr": "smile"}],
  subjects=[{"n": "owner head", "p": HEAD(S["owner_pay"]), "f": [1386, 1400]}, {"n": "box", "p": BOX, "f": [1424, 1434]}, {"n": "phone screen", "p": [PHONE[0], PHONE[1] + 0.05, PHONE[2]], "f": [1464, 1494]}],
  physics="none.", light_mood="warm; the freeze holds.", sound="record scratch + Huh (meme) f1336; three soft hits on 'chủ' f1397, 'kính' f1422, 'hoi' f1478.",
  after="Unchanged.")

scene(id="S13", f=[1495, 1624], set="shop", light="day",
  vo="Bạn thấy đấy, chủ tiệm canh hàng, chứ không canh người vừa bán hàng cho mình.",
  gloss="You see, the owner watches the goods, not the person who just sold to him.",
  spine=6, viewer="His eyes follow the kid's hands at the glass; to the seller he gives a smile and a handshake.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 8}},
  build="as before; calm.",
  blocking="Owner at owner_left; kid at the kid mark bending to the glass; man at the man mark.",
  action="f1500-1560 the kid leans to the glass with a finger near it; the owner's eyes narrow and follow the kid's hand ('canh hàng' f1545); f1563 he turns his eyes to the man and smiles; f1590-1615 they shake hands across the counter (2 shakes).",
  acting="Owner: stern on the kid -> warm on the seller. Kid: curious. Man: friendly.",
  cams=[kf(1495, body(S["owner_left"]) + body(S["kid"], 0.3) + body(MAN), az=0, el=-8, fov=46, push=0.0006, why="calm wide: the owner between the kid and the seller")],
  kicks=[],
  marks=[{"who": "owner", "at": S["owner_left"], "view": "front", "pose": "eyes on the kid f1500-1560, handshake f1590-1615", "expr": "stern -> smile"},
         {"who": "kid", "at": S["kid"], "view": "front", "pose": "bends to the glass", "expr": "neutral"}, {"who": "man", "at": MAN, "view": "front", "pose": "handshake", "expr": "smile"}],
  subjects=[{"n": "owner head", "p": HEAD(S["owner_left"]), "f": [1495, 1623]}, {"n": "kid head", "p": [S["kid"][0], 1.3, S["kid"][1]], "f": [1495, 1623]}, {"n": "man head", "p": HEAD(MAN), "f": [1495, 1623]}],
  physics="none.", light_mood="warm, calm.", sound="a soft music-box theme; a suspicious 'hmm' sting f1545; a warm chord on the handshake f1590.",
  after="Unchanged.")

H2 = HOUSE
scene(id="S14", f=[1624, 1708], set="house", light="day",
  vo="Người đó giống như khách đến chơi nhà mang theo quà.",
  gloss="He's like a guest who comes to visit bringing a gift.",
  spine=6, viewer="A guest at the door with a gift, welcomed in.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S13"}, "out": {"type": "dissolve", "to": "S15", "n": 6, "note": "a moment later, at the table"}},
  build="the house: the front door, the porch outside, the dining room; the gift (a booster box wrapped in red with a gold bow).",
  blocking="Host (the owner's look) by the door at host_door; guest (the man's look) on the porch at guest_door holding the gift.",
  action="f1628-1642 the host opens the door (it swings in 80 deg); the guest stands on the porch with the gift held out; f1650-1680 he steps in to guest_in; f1688-1698 the host takes the gift ('quà' f1694), beaming.",
  acting="Host: delighted. Guest: charming.",
  cams=[kf(1624, body(H2["host_door"]) + body(H2["guest_door"]) + [[-1.25, 2.15, -3.0], [-0.25, 2.15, -3.0]], az=0, el=-6, fov=46, push=0.0008, why="the door, the guest with the gift")],
  kicks=[],
  marks=[{"who": "owner", "at": H2["host_door"], "view": "front", "pose": "opens the door f1628, takes the gift f1688", "expr": "grin"},
         {"who": "man", "at": H2["guest_door"], "view": "front", "pose": "holds the gift; steps in f1650-1680", "expr": "smile"}],
  subjects=[{"n": "host head", "p": HEAD(H2["host_door"]), "f": [1624, 1707]}, {"n": "guest head", "p": HEAD(H2["guest_in"]), "f": [1680, 1707]}],
  physics="the door: hinged, eased open with a small bounce.", light_mood="warm home, daylight through the window.", sound="a doorbell ding-dong f1624; the door creak f1630; a happy 'ooh' chord f1694.",
  after="The host holds the gift.")

scene(id="S15", f=[1708, 1765], set="house", light="day",
  vo="Chẳng ai đi theo khách để đếm thìa.",
  gloss="Nobody follows a guest around counting the spoons.",
  spine=6, viewer="The host turns his back; the spoon tray by the guest ends with one empty slot.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S14"}, "out": {"type": "dissolve", "to": "S16", "n": 8}},
  build="the table with the cake, the plates and the spoon tray (six spoons).",
  blocking="Guest seated on the chair behind the table (guest_tbl); host walks from host_mid to the kitchen doorway (side view, to the right) carrying the gift, f1708-1750.",
  action="f1708-1750 the host walks off toward the kitchen, never looking back; f1736-1748 the guest's arm reaches the tray and lifts a spoon (the camera drops to the tray f1742-1754); f1750-1757 it goes into his jacket ('đếm thìa' f1750-1755); the tray keeps one empty slot.",
  acting="Guest: angelic smile. Host: humming, happy.",
  cams=[kf(1708, body(H2["guest_tbl"]) + [H2["tray"]], az=-4, el=-12, fov=42, push=0.0008, why="the guest and the spoon tray, the host walking away"),
        k(1742, [0.32, 1.22, -0.3], [0.31, 0.79, -0.86], 40, glide=12, push=0.0008, why="the spoon tray: one slot empty")],
  kicks=[[1755, 0.2]],
  marks=[{"who": "man", "at": H2["guest_tbl"], "view": "front, seated", "pose": "spoon f1736-1757", "expr": "smile"}, {"who": "owner", "at": H2["host_walk"], "view": "side walking", "pose": "walks to the kitchen", "expr": "smile"}],
  subjects=[{"n": "tray", "p": H2["tray"], "f": [1758, 1764]}, {"n": "guest head", "p": HEAD(H2["guest_tbl"]), "f": [1708, 1740]}],
  physics="the spoon: kinematic.", light_mood="warm.", sound="a happy hum; a tiny spoon clink f1745; Hehe Boiiiiiii (meme, soft) f1756.",
  after="One empty slot in the spoon tray.")

scene(id="S16", f=[1765, 1947], set="shop", light="day",
  vo="Chính Bruni cũng nhận: bình thường, anh không bao giờ để một hộp thẻ giá trị như thế nằm ngoài.",
  gloss="Bruni himself admits: normally he would never leave such a valuable box of cards out.",
  spine=6, viewer="The owner looks at the four gaps, then carries the box to the locked glass case where it belongs.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S15"}, "out": {"type": "dissolve", "to": "S17", "n": 8}},
  build="the box with four gaps; the glass case with its hinged door and padlock.",
  blocking="Owner at owner_pay behind the box; then he walks with the box behind the counter, around its left end, to case_stand.",
  action="f1765-1812 he looks down at the four gaps, scratches his head; f1830-1842 he lifts the box with both arms; f1842-1895 he walks left behind the counter, around its end and to the case (side view); f1896-1906 the case door swings open; f1906-1918 he sets the box on the shelf; f1920 the door shuts; f1926 the padlock snaps shut ('ngoài' f1928).",
  acting="Owner: sheepish, a sigh.",
  cams=[k(1765, [1.12, 1.55, -0.12], [1.18, 1.22, -1.32], 40, push=0.0008, why="the four gaps, the owner behind"),
        kf(1832, body([-0.8, -1.62]) + body(S["case_stand"]) + [[-3.35, 2.0, -2.1], [-2.9, 0.02, -1.3]], az=58, el=-12, fov=54, glide=40, push=0.0006, why="he carries the box to the case")],
  kicks=[[1926, 0.3]],
  marks=[{"who": "owner", "at": S["owner_pay"], "view": "front then side walking", "pose": "head scratch, lifts the box, walks to the case", "expr": "sad"}],
  subjects=[{"n": "box", "p": BOX, "f": [1765, 1830]}, {"n": "owner head", "p": HEAD(S["case_stand"]), "f": [1900, 1946]}, {"n": "case", "p": [-3.12, 1.2, -1.7], "f": [1900, 1946]}],
  physics="the case door: hinged at its back edge, swings 100 deg and back; the padlock shackle snaps down 1 cm.", light_mood="warm.", sound="a sigh; footsteps; the case door squeak f1896, click f1920; padlock snap f1926.",
  after="The box is locked in the glass case (four gaps).")

scene(id="S17", f=[1947, 2089], set="shop", light="day",
  vo="Nhưng niềm tin có một nhược điểm: nó không có camera. Tiệm thì có.",
  gloss="But trust has one weakness: it has no camera. The shop does.",
  spine=7, viewer="The handshake (trust) — cut — the camera lens recording.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S16"}, "out": {"type": "glide", "to": "S18"}},
  build="as before.",
  blocking="Owner at owner_left and the man at the man mark, shaking hands across the counter.",
  action="f1950-2040 the handshake, slow pumps every 20 f, both smiling; slow push; f2047 hard cut on 'Tiệm' to the ceiling camera lens, the REC lamp blinking on.",
  acting="Owner: warm. Man: warm.",
  cams=[kf(1947, body(S["owner_left"]) + body(MAN), az=0, el=-6, fov=40, push=0.0006, why="the handshake: trust"),
        k(2047, [2.6, 2.82, -0.05], [3.05, 3.1, 0.4], 32, cut=True, push=0.002, why="the shop's camera")],
  kicks=[[2047, 0.5]],
  marks=[{"who": "owner", "at": S["owner_left"], "view": "front", "pose": "handshake", "expr": "smile"}, {"who": "man", "at": MAN, "view": "front", "pose": "handshake", "expr": "smile"}],
  subjects=[{"n": "owner head", "p": HEAD(S["owner_left"]), "f": [1947, 2045]}, {"n": "man head", "p": HEAD(MAN), "f": [1947, 2045]}, {"n": "cctv", "p": CCTV, "f": [2047, 2088]}],
  physics="none.", light_mood="warm; the cut is crisp.", sound="warm pad; Camera shutter (meme) on the cut f2047; a REC beep.",
  after="Unchanged.")

scene(id="S18", f=[2089, 2132], set="shop", light="day",
  vo="Bruni báo cảnh sát ngay,",
  gloss="Bruni called the police right away,",
  spine=7, viewer="The owner on the phone to the police.",
  **{"in": {"type": "glide", "from": "S17"}, "out": {"type": "dissolve", "to": "S19", "n": 6, "note": "the officer arrives"}},
  build="as before.",
  blocking="Owner at owner_phone, the handset at his ear.",
  action="f2092-2104 he lifts the handset and dials; f2113 'cảnh sát' he speaks, urgent.",
  acting="Owner: urgent, serious.",
  cams=[kf(2089, body(S["owner_phone"]) + [PHONE], az=10, el=-10, fov=42, glide=14, push=0.0008, why="the owner calls the police")],
  kicks=[], marks=[{"who": "owner", "at": S["owner_phone"], "view": "front", "pose": "handset to his ear", "expr": "stern"}],
  subjects=[{"n": "owner head", "p": HEAD(S["owner_phone"]), "f": [2105, 2131]}],
  physics="none.", light_mood="warm.", sound="three dial beeps f2096-2102; a ringing tone.",
  after="Unchanged.")

scene(id="S19", f=[2132, 2207], set="shop", light="day",
  vo="đưa luôn số điện thoại người đàn ông đã gọi tới.",
  gloss="and handed over the number the man had called from.",
  spine=7, viewer="He shows the officer the caller ID; she writes the number down.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S18"}, "out": {"type": "dissolve", "to": "S20", "n": 8}},
  build="the officer's notepad: the number written stroke by stroke.",
  blocking="Officer at the cop mark in front of the counter; owner at owner_phone, pointing at the phone.",
  action="f2140-2160 the owner points at the caller-ID screen; f2160-2196 the officer writes (773) 555-0142 on her notepad ('số điện thoại' f2151-2162, 'gọi tới' f2186-2193); f2180-2207 glide to the notepad.",
  acting="Owner: firm. Officer: businesslike.",
  cams=[kf(2132, body(S["cop"]) + body(S["owner_phone"]) + [PHONE], az=14, el=-10, fov=42, push=0.0008, why="the owner points, the officer writes"),
        k(2178, [1.99, 1.45, -0.08], [1.99, 1.19, -0.68], 32, glide=24, push=0.0008, why="the number on her notepad")],
  kicks=[],
  marks=[{"who": "cop", "at": S["cop"], "view": "front", "pose": "writes on the notepad f2160-2196", "expr": "neutral"}, {"who": "owner", "at": S["owner_phone"], "view": "front", "pose": "points at the phone", "expr": "stern"}],
  subjects=[{"n": "cop head", "p": HEAD(S["cop"]), "f": [2132, 2175]}, {"n": "owner head", "p": HEAD(S["owner_phone"]), "f": [2132, 2175]}, {"n": "notepad", "p": [1.99, 1.2, -0.68], "f": [2200, 2206]}],
  physics="none.", light_mood="warm.", sound="pen scratches f2160-2196; a firm low note.",
  after="The number is on the notepad.")

scene(id="S20", f=[2207, 2300], set="shop", light="day",
  vo="Hắn ra về với bốn lá bài và ba trăm đô.",
  gloss="He walked away with four cards and three hundred dollars.",
  spine=7, viewer="Out on the sidewalk, smug: pats the jacket, fans the $300.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S19", "note": "back to the afternoon: he leaves"}, "out": {"type": "travel", "to": "S21", "note": "the camera flies back into the shop through the door glass"}},
  build="the street.",
  blocking="Man comes out of the door (man_door outside) and walks toward the lens to man_walk.",
  action="f2208 the door opens, bell; f2210-2246 he walks out to man_walk (front view walking); f2248-2262 he pats his jacket twice ('bốn lá bài' f2240-2256); f2268-2290 he fans the three $100 bills by his face ('ba trăm đô' f2274-2285).",
  acting="Man: smug grin.",
  cams=[kf(2207, body(S["man_walk"]) + [[1.9, 2.5, 5.4], [1.9, 0.02, 5.4]], az=-4, el=-4, fov=44, push=0.0006, why="he walks out toward us, the shop door behind")],
  kicks=[],
  marks=[{"who": "man", "at": S["man_walk"], "view": "front walking then standing", "pose": "pats the jacket f2248-2262, fans the cash f2268-2290", "expr": "grin"}],
  subjects=[{"n": "man head", "p": HEAD(S["man_walk"]), "f": [2246, 2299]}, {"n": "door", "p": [1.9, 1.2, 5.4], "f": [2207, 2240]}],
  physics="none.", light_mood="bright day, blue sky.", sound="door bell f2208; street; a smug brass bounce f2280.",
  after="He stands on the sidewalk with his loot.")

scene(id="S21", hero=True, f=[2300, 2440], set="shop", light="day",
  vo="Và để lại gương mặt trên camera, cùng số điện thoại của chính mình.",
  gloss="And left behind his face on camera, and his very own phone number.",
  spine=7, viewer="Inside, the monitor holds his face; outside, his own phone rings and he freezes.",
  **{"in": {"type": "travel", "from": "S20"}, "out": {"type": "end"}},
  build="the monitor shows one frozen view: his face at the counter, REC, NOV 18 4:07 PM; his own phone (cast prop) with a ringing screen.",
  blocking="Man at man_walk on the sidewalk.",
  action="f2300-2340 the camera flies past him through the door glass to the monitor: his face frozen on it ('gương mặt trên camera' f2327-2350); f2353-2392 the camera flies back out through the door to him; f2371 ('số điện thoại') his own phone rings in his jacket; f2380 he pulls it out; f2398 he looks at it and freezes ('chính mình' f2396-2410): shock, a sweat drop; hold to the end.",
  acting="Man: grin -> shock.",
  cams=[k(2300, [1.85, 2.08, 0.2], [2.0, 2.28, -1.45], 32, glide=40, push=0.0008, why="his face on the monitor"),
        kf(2350, body(S["man_walk"]), az=-4, el=-4, fov=40, glide=50, push=0.0012, why="his own phone rings")],
  kicks=[[2398, 0.6]],
  marks=[{"who": "man", "at": S["man_walk"], "view": "front", "pose": "phone out f2380, freeze f2398", "expr": "grin -> shock"}],
  subjects=[{"n": "monitor", "p": MON, "f": [2330, 2350]}, {"n": "man head", "p": HEAD(S["man_walk"]), "f": [2400, 2439]}],
  physics="the phone: buzz jitter 2 mm while ringing.", light_mood="bright day.", sound="Yo Phone Ringing (meme) f2371-2420; a record-stop f2398; the theme's last note.",
  after="End on his frozen face and the ringing phone.")

# quality bar: a character is a subject head AND feet, so the check fails any shot that cuts a body (inserts excepted)
for sc in SC:
    extra = []
    for sj in sc.get("subjects", []):
        if sj["n"].endswith("head") and not sj.get("nofeet"):
            p = sj["p"]; extra.append({"n": sj["n"].replace("head", "feet"), "p": [p[0], 0.02, p[2]], "f": sj["f"]})
    sc.setdefault("subjects", []).extend(extra)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(SC), "scenes")
