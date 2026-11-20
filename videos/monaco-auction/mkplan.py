"""Generator of plan.json for the Monaco auction reel (the plan is the source of truth: change it here, then
python3 videos/monaco-auction/mkplan.py && python3 scripts/plan_check.py videos/monaco-auction/plan.json)."""
import json, os
def k(f, pos, look, fov, glide=None, cut=False, push=0.002, punch=None, blur=6, focus=None, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=blur, why=why)
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    if focus: d["focus"] = focus
    return d

ST = 0.3                                     # stage top
BOX = [0.25, 1.08 + 0.14, -4.55]              # the box on the lot table (centre)
VIT = [1.4, 1.44, -4.6]                      # the box inside the vitrine (centre)
SLAB = [2.4, 1.47, -4.6]                     # the Poncho Pikachu slab on its stand
SEATS = [[x, z] for z in (-2.2, -1.2, -0.2) for x in (-3.3, -2.5, -1.7, -0.9, -0.1, 0.7)]   # 18 gentlemen; Minh = seat 3 (x -0.9, row 1)
SCOOT = [[2.3, -3.4 + 0.8 * i] for i in range(10)]
CUBBY = [[0.25 + 0.4 * c, 0.3 + 0.37 * r] for r in range(6) for c in range(3)]   # box cubbies (x, y of the box base), 18
LAST = 7                                     # the box left sealed (col 1, row 2)
OPEN_ORDER = [i for i in [12, 3, 16, 0, 9, 5, 14, 1, 11, 17, 4, 8, 2, 15, 6, 10, 13] if i != LAST]
OPEN_AT = [1866 + round(6.6 * n) for n in range(len(OPEN_ORDER))]
KIT = dict(table=[-0.35, -0.6], kid=[-0.15, -1.15], box=[-0.05, 0.75 + 0.14, -0.8], bowl=[-0.45, 0.75, -0.7], mom=[0.42, -0.8], mom26=[0.25, -0.85], shelf=[0.85, 1.75, -2.15], cup=[1.0, -2.22], stove=[-1.3, -2.2], momshelf=[0.7, -1.82])

P = {
 "fps": 30, "frames": 2280, "voice_end": 2266,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 335, "out": 392, "text": "17 · 11 · 2026", "style": 3, "from": "top"},
  {"f": 478, "out": 515, "text": "70 LOTS", "style": 3, "from": "top"},
  {"f": 1124, "out": 1180, "text": "2006", "style": 3, "from": "top"},
  {"f": 1330, "out": 1384, "text": "€18K - €20K", "style": 3, "from": "top"},
  {"f": 1492, "out": 1514, "text": "X10", "style": 3, "from": "top"},
  {"f": 2198, "out": 2216, "text": "2026", "style": 3, "from": "top"}],
 "cards": {"ds_rayquaza": "EX Delta Species 13 Rayquaza δ (pokemontcg.io): the box's cover art",
   "pika_poncho_ray": "JP XY-P 231 Poncho-wearing Pikachu, Rayquaza poncho, 2016 (scrydex scan): the PSA 10 slab",
   "lots": ["ds_metagross_star", "ds_latias", "ds_mewtwo", "pika_rain", "zard_base", "blastoise", "venusaur", "ds_rayquaza"]},
 "box": {"size": [0.2, 0.28, 0.11], "text": ["ESPÈCES DELTA", "36 BOOSTERS", "2006"], "art": "ds_rayquaza"},
 "seats": SEATS, "minh_seat": 3, "scooters": SCOOT, "cubbies": CUBBY, "last_box": LAST, "open_order": OPEN_ORDER, "open_at": OPEN_AT,
 "kitchen": KIT,
 "sets": {
  "saleroom": {"origin": [0, 0, 0], "axes": "+x toward the harbour wall (x 6), the stage at the back wall z -6 faces +z, the audience toward +z",
   "light": "day", "sun": [70, 50], "open_sides": "+z (the room), the harbour windows at x 6",
   "objects": [
    {"id": "room", "build": "new: cream panelled walls (white dado 1 m, gold mouldings) x -6..6, z -6..6, 4.5 m high, red carpet, white ceiling with two chandeliers", "pos": [0, 2.25, 0], "size": [12, 4.5, 12]},
    {"id": "windows", "build": "new: three tall windows in the x 6 wall (1.6 x 2.4 m, sills at y 1.0) at z -2.6, 1.4, 4.4: real openings onto the quay", "pos": [6, 2.2, -2.6], "size": [0.2, 2.4, 1.6]},
    {"id": "stage", "build": "adapt:stage (oak, top y 0.3)", "pos": [0, 0.15, -4.9], "size": [8, 0.3, 2.2]},
    {"id": "rostrum", "build": "reuse:rostrum + sound block (top y 1.45)", "pos": [-2.0, 0.875, -4.6], "size": [0.9, 1.15, 0.5]},
    {"id": "lot_table", "build": "new: oak table draped in dark-red velvet, top y 1.08", "pos": [-0.35, 0.69, -4.45], "size": [1.9, 0.78, 0.5]},
    {"id": "pedestal", "build": "new: white column 24 cm wide, 1.45 m tall, velvet cushion holding the crown until S05", "pos": [0.9, 0.875, -4.62], "size": [0.24, 1.15, 0.24]},
    {"id": "yacht", "build": "new: model yacht 45 cm (white hull, blue stripe, cabin, mast) on two brass cradles", "pos": [-1.0, 1.2, -4.45], "size": [0.45, 0.3, 0.12]},
    {"id": "diamond", "build": "new: cut diamond (octahedron, 5 cm) on a navy cushion", "pos": [-0.45, 1.13, -4.45], "size": [0.14, 0.1, 0.14]},
    {"id": "watch", "build": "new: gold watch on a black stand, tag €2,500,000", "pos": [0.0, 1.16, -4.45], "size": [0.1, 0.16, 0.06]},
    {"id": "box", "build": "new: the booster display box (see box): built box, printed faces, REAL Rayquaza δ art, shrink-wrap gloss layer", "pos": BOX, "size": [0.2, 0.28, 0.11]},
    {"id": "vitrine", "build": "new: white plinth 50 x 100 x 50 cm, glass hood 32 x 40 x 24 cm with brass edges, front door hinged on its left edge", "pos": [1.4, 1.5, -4.6], "size": [0.32, 0.4, 0.24]},
    {"id": "crown", "build": "new: small gold crown (lathe band + 5 points + red stones), 12 cm, set on the vitrine top in S05", "pos": [1.4, 1.76, -4.6], "size": [0.12, 0.08, 0.12]},
    {"id": "slab_stand", "build": "new: white plinth 36 x 100 cm, acrylic foot; reuse:slabReal with the REAL Poncho Pikachu, GEM MT 10", "pos": SLAB, "size": [0.19, 0.3, 0.012]},
    {"id": "lot_board", "build": "new: dark lot board on the back wall, gold text: LOT 1 / ESTIMATE ... (flips in S06)", "pos": [1.4, 2.9, -5.94], "size": [1.5, 0.8, 0.04]},
    {"id": "lots70", "build": "new: two-tier display table along the harbour wall (x 5.0-5.7, z -0.8..5.6), 70 small lots (mini slabs and sealed packs, real scans), numbered tags 1-70 on its front edge", "pos": [5.35, 0.9, 2.4], "size": [0.7, 0.3, 6.4]},
    {"id": "chairs", "build": "new: 18 gilt chairs, red seats (seat y 0.46), backs toward +z", "pos": [-1.3, 0.45, -1.2], "size": [4.6, 0.9, 2.6]},
    {"id": "scooters", "build": "new: ten red step-through scooters (wheels, footboard, seat, handlebar, front shield) parked down the aisle x 2.3 from S10 on, each with a €1,900 tag", "pos": [2.3, 0.55, 0.2], "size": [0.6, 1.1, 7.8]}],
   "marks": {"auctioneer": [-2.0, -5.0], "porter": [0.4, -4.9], "porter_v": [1.0, -4.3], "waiter": [1.95, -4.25], "minh": [-0.9, -2.2]}},
  "quay": {"origin": [0, 0, 0], "axes": "same frame as the saleroom: the façade is the outside of its x 6 wall, the quay runs along z, the harbour at x > 16",
   "light": "golden", "sun": [150, 30], "open_sides": "+x",
   "objects": [
    {"id": "facade", "build": "new: cream stucco façade x 6..6.4, z -16..16, 13 m tall, cornices, windows (three real openings), gold lettering HÔTEL DES VENTES DE MONTE-CARLO at y 4.6", "pos": [6.2, 6.5, 0], "size": [0.4, 13, 32]},
    {"id": "quay", "build": "new: stone quay x 6..16 with a stone edge, palms at z -10, -3, 7", "pos": [11, 0, 0], "size": [10, 0, 60]},
    {"id": "water", "build": "reuse:water (y -0.4) to the horizon", "pos": [200, -0.4, 0], "size": [380, 0, 400]},
    {"id": "yachts", "build": "new: four moored yachts 9-14 m (white hulls, blue stripe, cabins, masts)", "pos": [20, 0.6, 0], "size": [3, 3, 30]},
    {"id": "hills", "build": "new: hazy green hills with pale houses behind the town (far, -x)", "pos": [-260, 40, 0], "size": [40, 80, 600]}],
   "marks": {}},
  "cellar": {"origin": [0, 0, -80], "axes": "the rack wall at z -2.6 faces +z; bottles on the left half (x -1.3..-0.05), sealed boxes on the right (x 0.05..1.3)",
   "light": "golden", "sun": [120, 40], "open_sides": "+z",
   "objects": [
    {"id": "vault", "build": "new: stone vault x -3..3, z -2.8..4.5, 3 m high, stone floor", "pos": [0, 1.5, 0.8], "size": [6, 3, 7.3]},
    {"id": "rack", "build": "new: oak rack 2.6 x 2.25 m: 4 x 6 bottle cubbies (bottles neck-out) and 3 x 6 box cubbies (one box each)", "pos": [0, 1.2, -2.6], "size": [2.6, 2.25, 0.4]},
    {"id": "year_plate", "build": "new: brass year plate 60 x 20 cm on the rack top, rolling digits", "pos": [0.68, 2.47, -2.58], "size": [0.6, 0.2, 0.02]},
    {"id": "barrel", "build": "new: oak barrel table (r 0.3, top y 0.95), a glass on it", "pos": [-0.55, 0.47, -1.8], "size": [0.6, 0.95, 0.6]}],
   "marks": {"somm": [-1.05, -2.15]}},
  "kitchen": {"origin": [-60, 0, 0], "axes": "the back wall z -2.5 faces +z; door in the right wall (x 2.2)",
   "light": "golden", "sun": [120, 30], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: kitchen x -2.2..2.2, z -2.5..2, 2.7 m high: tiled floor, green half-tiled walls, a window above the stove", "pos": [0, 1.35, -0.25], "size": [4.4, 2.7, 4.5]},
    {"id": "table", "build": "new: wooden table 110 x 70 cm, top y 0.75, two stools", "pos": [KIT["table"][0], 0.375, KIT["table"][1]], "size": [1.1, 0.75, 0.7]},
    {"id": "cupboard", "build": "new: tall painted cupboard 80 x 175 x 45 cm, two doors (top y 1.75): the box ends up on top", "pos": [KIT["cup"][0], 0.875, KIT["cup"][1]], "size": [0.8, 1.75, 0.45]},
    {"id": "stove", "build": "new: two-burner stove on a counter, a pot", "pos": [KIT["stove"][0], 0.45, KIT["stove"][1]], "size": [1.0, 0.9, 0.55]},
    {"id": "props", "build": "new: noodle bowl, a tin labelled ĂN SÁNG tipped over with coins, the box (2006)", "pos": KIT["box"], "size": [0.2, 0.28, 0.11]}],
   "marks": {"kid": KIT["kid"], "mom": KIT["mom"], "minh_in": [2.4, -0.4], "minh": [0.75, -0.45]}}},
 "cast": {
  "auctioneer": {"look": ["black suit", "red tie", "grey hair", "stout"], "items": ["gavel"], "views": ["front"]},
  "porter": {"look": ["white jacket", "black tie", "black trousers", "dark hair"], "items": ["the box", "the crown"], "views": ["front", "side"]},
  "waiter": {"look": ["black waistcoat", "white shirt", "bow tie", "slick hair"], "items": ["wine bottle", "the cork"], "views": ["front"]},
  "gentlemen g0-g17": {"look": ["dark suits (navy, charcoal, black, brown)", "mixed hair", "two with glasses"], "items": ["numbered paddles"], "views": ["front, seated"]},
  "minh": {"look": ["navy suit", "brown hair", "moustache"], "items": ["paddle", "flowers (S18)"], "views": ["front", "side"]},
  "kid": {"look": ["blue tee", "red cap", "kid build"], "items": [], "views": ["front, seated"]},
  "mom": {"look": ["green dress", "dark hair (2006) / grey hair (2026)"], "items": ["the box"], "views": ["front", "side"]}},
 "scenes": []}

S = P["scenes"]
def scene(**kw): S.append(kw)

scene(id="S01", hero=True, f=[0, 276], set="saleroom", light="day",
  vo="Ở Monaco, nơi người ta đấu giá du thuyền, kim cương và những chiếc đồng hồ đắt hơn cả căn nhà, có người vừa đặt lên bàn đấu giá một hộp thẻ Pokémon chưa bóc.",
  gloss="In Monaco, where they auction yachts, diamonds and watches pricier than a house, someone just put an unopened Pokémon box on the auction table.",
  spine=1, viewer="Luxury lots, then a Pokémon box among them.",
  **{"in": {"type": "open on the act"}, "out": {"type": "travel", "to": "S02", "note": "pull back out through the harbour window"}},
  build="adapt:stage, reuse:rostrum; new: velvet lot table with the yacht model, the diamond on a cushion, the watch with its tag; new: the box.",
  blocking="Auctioneer front at his mark, gavel up from frame 0. Porter enters behind the table from x 1.8 walking -x (side view, box at his chest), reaches his mark f236, front view.",
  action="f0-2 gavel held up; f3 strike (1 f before 'Monaco'): the yacht rocks on its cradles. f30-90 glide along the table: diamond (sparkle f80 'kim'), watch (tag €2,500,000, glint f118 'đồng hồ'). f185-236 the porter walks in; f240-256 he lowers the box; f257 thump on 'bóc': the diamond cushion and the watch hop, a dust puff.",
  acting="Auctioneer stern, then a satisfied grin; porter proud.",
  cams=[k(0, [-1.5, 1.85, -1.55], [-1.5, 1.4, -4.5], 50, push=0.002, blur=4, focus=[-1.3, 1.4, -4.6], why="gavel and yacht"),
        k(30, [-0.2, 1.6, -2.6], [-0.2, 1.18, -4.45], 42, glide=60, push=0.0015, blur=8, focus=[-0.25, 1.15, -4.45], why="glide along the lots"),
        k(150, [2.3, 1.75, -2.5], [0.25, 1.25, -4.55], 40, glide=45, push=0.002, punch=[0.006, 14], blur=8, focus=BOX, why="the box arrives")],
  kicks=[[3, 1.0], [257, 0.8]], marks=[{"who": "auctioneer", "at": [-2.0, -5.0], "view": "front", "pose": "gavel strike f3", "expr": "stern -> grin"},
                                       {"who": "porter", "at": [0.55, -4.9], "view": "side -> front", "pose": "carry, lower, thump f257", "expr": "proud"}],
  subjects=[{"n": "auctioneer head", "p": [-2.0, 2.1, -5.0], "f": [0, 25]}, {"n": "yacht", "p": [-1.0, 1.2, -4.45], "f": [0, 25]},
            {"n": "watch", "p": [0.0, 1.16, -4.45], "f": [95, 140]}, {"n": "box", "p": BOX, "f": [210, 275]}],
  physics="gavel: 1 f down, 3 f rebound. Yacht: rocks 4 deg, damped. Thump: the box drops 2 cm in 1 f; diamond cushion and watch hop (0.25 m/s), settle.",
  light_mood="day, warm chandelier light.", sound="gavel crack f3; murmur; diamond ting f80; watch tick; footsteps f185-236; heavy thump f257 + Instagram Thud meme.",
  after="The box sits on the velvet at the table's back edge.")

scene(id="S02", f=[276, 396], set="quay", light="golden", vo="Hôtel des Ventes de Monte-Carlo, chiều thứ Ba, mười bảy tháng mười một.",
  gloss="Hôtel des Ventes de Monte-Carlo, Tuesday afternoon, 17 November.", spine=2, viewer="Where and when.",
  **{"in": {"type": "travel", "from": "S01"}, "out": {"type": "travel", "to": "S03"}},
  build="new: the façade with its lettering, the quay, palms, yachts, water, hills.", blocking="nobody.",
  action="f276-316 the camera pulls back from the box out through the window (z -2.6); f320-365 it cranes up and out over the moored yachts until the façade lettering sits upper middle. Title 17 · 11 · 2026 f335.",
  acting="none", cams=[k(276, [2.3, 1.75, -2.5], [0.25, 1.25, -4.55], 40, push=0, blur=4, focus=BOX, why="start where S01 ends"),
        k(277, [10.0, 2.9, -1.8], [0.25, 1.25, -4.55], 40, glide=40, push=0, blur=2, focus=[6, 2, -2.6], why="out through the window"),
        k(320, [30, 2.4, 8], [6, 4.2, -1.0], 50, glide=45, push=0.0012, blur=2, focus=[6, 4.6, -1.5], why="the façade and the harbour")],
  kicks=[], marks=[], subjects=[{"n": "lettering", "p": [6.45, 4.6, 0], "f": [365, 395]}],
  physics="yachts bob 3 cm on the swell.", light_mood="golden afternoon.", sound="room tone falls away; gulls, water slap, a far horn.",
  after="—")

scene(id="S03", f=[396, 520], set="quay", light="day", vo="Lần đầu tiên nơi này mở hẳn một phiên Pokémon, bảy mươi lô hàng.",
  gloss="For the first time this house holds a whole Pokémon sale: seventy lots.", spine=2, viewer="A full sale of 70 Pokémon lots.",
  **{"in": {"type": "travel", "from": "S02"}, "out": {"type": "glide", "to": "S04"}},
  build="new: the 70-lot display table with numbered tags (real scans on mini slabs, sealed packs).", blocking="nobody.",
  action="f396-446 fly back in through the window; f446-476 turn to the display table; f480-518 track along it, tags 1 → 70 passing. Title 70 LOTS f478.",
  acting="none", cams=[k(396, [30, 2.4, 8], [6, 4.2, -1.0], 50, push=0, blur=2),
        k(397, [8.2, 2.3, -2.6], [0, 1.5, -2.6], 44, glide=48, push=0, blur=2, focus=[0, 1.5, -2.6], why="into the window"),
        k(446, [4.5, 1.5, -1.9], [5.4, 1.0, 1.8], 42, glide=40, push=0, blur=6, focus=[5.3, 1.0, 0.8], why="turn to the lots"),
        k(487, [4.4, 1.45, 1.4], [5.35, 1.0, 4.6], 42, glide=32, push=0.001, blur=6, focus=[5.3, 1.0, 3.0], why="track along the 70 lots")],
  kicks=[], marks=[], subjects=[{"n": "lots", "p": [5.3, 1.0, 3.6], "f": [500, 519]}],
  physics="none.", light_mood="day inside.", sound="whoosh in; room tone; soft ticks as tags pass.", after="—")

scene(id="S04", f=[520, 661], set="saleroom", light="day", vo="Hãy hình dung những quý ông áo vest ngồi nghiêm trang, chuẩn bị giơ bảng vì Pikachu.",
  gloss="Picture gentlemen in suits sitting solemnly, ready to raise their paddles for Pikachu.", spine=2, viewer="Serious money, cartoon mouse.",
  **{"in": {"type": "glide", "from": "S03"}, "out": {"type": "glide", "to": "S05"}},
  build="new: 18 gilt chairs; gentlemen seated with paddles on their laps.", blocking="18 gentlemen seated at SEATS, front view; Minh at seat 3.",
  action="f520-610 stern faces, paddles low; one adjusts his tie f572. f630 (2 f before 'Pikachu') all 18 paddles snap up at once and hold; f640 a few grins.",
  acting="stern, then the paddles up with straight faces.",
  cams=[k(520, [4.4, 1.45, 1.4], [5.35, 1.0, 4.6], 42, push=0, blur=4),
        k(521, [4.5, 1.7, -3.6], [-1.5, 1.0, -0.8], 44, glide=55, push=0.0015, punch=[0.006, 18], blur=5, focus=[-1.2, 1.2, -1.6], why="the audience from the stage")],
  kicks=[[630, 0.5]], marks=[{"who": "gentlemen", "at": [0.7, -2.2], "view": "front", "pose": "all 18 seats (plan.seats): seated, paddle on lap -> up f630", "expr": "stern"}],
  subjects=[{"n": "row 1 near", "p": [0.7, 1.3, -2.2], "f": [580, 660]}, {"n": "row 3 far", "p": [-3.3, 1.3, -0.2], "f": [580, 660]}],
  physics="paddles up in 3 f, 2 f overshoot.", light_mood="day.", sound="hushed room; a cough; paddle whoosh f630 in unison + a comic sting.", after="Paddles back down by S05.")

scene(id="S05", hero=True, f=[661, 964], set="saleroom", light="day",
  vo="Lô chính là một hộp ba mươi sáu gói thẻ bộ EX Espèces Delta tiếng Pháp, năm hai nghìn không trăm lẻ sáu, còn nguyên màng niêm phong, nằm trong lồng kính như vương miện hoàng gia.",
  gloss="The main lot: a box of 36 packs of the French EX Espèces Delta set, from 2006, still in its seal, in a glass case like a royal crown.", spine=3, viewer="The box, its set and year, sealed, treated like royalty.",
  **{"in": {"type": "glide", "from": "S04"}, "out": {"type": "tilt", "to": "S06"}},
  build="new: vitrine with the hinged door, the crown on a cushion on the lot table, the spotlight.",
  blocking="Porter behind the table at his mark (crouches), lifts the box, walks to porter_v (f676-700), sets it in the vitrine, closes the door; later lifts the crown onto the vitrine top.",
  action="f661-676 the porter lifts the box; f676-700 carries it to the vitrine; f702 sets it inside; f716 swings the door shut (click). f722-900 macro: front printing ESPÈCES DELTA / 36 BOOSTERS (f750), down to 2006 (f809), a gleam slides across the wrap on 'niêm phong' (f866-880). f905-935 pull back; the porter sets the crown on top f935; f941 a spotlight snaps on.",
  acting="porter careful, then proud.",
  cams=[k(661, [1.05, 1.75, -2.0], [1.05, 1.35, -4.55], 44, glide=30, push=0.0012, blur=6, focus=[0.8, 1.3, -4.6], why="porter, table and vitrine"),
        k(722, [1.4, 1.46, -3.85], [1.4, 1.44, -4.6], 32, glide=28, push=0.0012, blur=12, focus=VIT, why="macro on the box through the glass"),
        k(790, [1.36, 1.40, -4.0], [1.41, 1.37, -4.6], 30, glide=30, push=0.0015, blur=12, focus=[1.4, 1.36, -4.55], why="down the printing to 2006"),
        k(905, [1.4, 1.7, -2.55], [1.4, 1.52, -4.6], 40, glide=30, push=0.002, punch=[0.006, 16], blur=6, focus=VIT, why="the crown and the spotlight")],
  kicks=[[716, 0.3], [941, 0.4]], marks=[{"who": "porter", "at": [0.55, -4.9], "view": "front", "pose": "lift, carry, place, crown", "expr": "careful -> proud"}],
  subjects=[{"n": "box", "p": VIT, "f": [700, 720]}, {"n": "vitrine", "p": VIT, "f": [940, 963]}, {"n": "crown", "p": [1.4, 1.76, -4.6], "f": [940, 963]}],
  physics="door: 0.5 s swing, a 2-deg rebound. Crown set down with a 1 cm settle.", light_mood="day; the spotlight adds a warm cone f941.",
  sound="soft footsteps; glass door click f716; shimmer on the gleam f866; trumpet fanfare sting f941.", after="Box sealed in the vitrine, crown on top, spot on.")

scene(id="S06", f=[964, 1081], set="saleroom", light="day", vo="Giá ước tính, một trăm ba mươi đến một trăm tám mươi nghìn euro.",
  gloss="Estimate: 130,000 to 180,000 euros.", spine=3, viewer="The number.",
  **{"in": {"type": "tilt", "from": "S05"}, "out": {"type": "cut", "to": "S07"}},
  build="the lot board on the back wall.", blocking="nobody.",
  action="f964-994 tilt up from the vitrine to the board; f989 ESTIMATE €130,000 flaps on; f1032 '- €180,000' joins it; the lights on the board blink once.",
  acting="none", cams=[k(964, [1.4, 1.9, -1.2], [1.4, 2.15, -5.0], 40, glide=30, push=0.0015, punch=[0.005, 14], blur=4, focus=[1.4, 2.9, -5.94], why="board above the vitrine")],
  kicks=[[1032, 0.4]], marks=[], subjects=[{"n": "board", "p": [1.4, 2.9, -5.94], "f": [995, 1080]}, {"n": "vitrine", "p": VIT, "f": [995, 1080]}],
  physics="flap tiles.", light_mood="day.", sound="flap clatter f989, f1032; a low hum.", after="Board shows the estimate.")

scene(id="S07", f=[1081, 1118], set="saleroom", light="day", vo="\"Một trăm tám mươi nghìn?",
  gloss="'A hundred and eighty thousand?'", spine=3, viewer="One of them can't believe it.",
  **{"in": {"type": "cut", "from": "S06"}, "out": {"type": "dissolve", "n": 6, "to": "S08", "note": "flashback to 2006"}},
  build="Minh's chair tips over.", blocking="Minh at seat 3 stands up f1084, arms flung up; neighbours g2 and g4 turn to him.",
  action="f1084 Minh shoots up (crouch to stand in 4 f), arms up, gape; his chair tips back f1086-1096 and slaps the floor f1096 (bounce, settles).",
  acting="Minh outraged-amazed; neighbours shocked.",
  cams=[k(1081, [-0.8, 1.25, -3.9], [-0.9, 1.5, -2.2], 42, cut=True, push=0.003, punch=[0.008, 14], blur=10, focus=[-0.9, 1.6, -2.2], why="low, he rises into the lens")],
  kicks=[[1096, 0.6]], marks=[{"who": "minh", "at": [-0.9, -2.2], "view": "front", "pose": "sit -> leap up, arms up", "expr": "shock + gape"}],
  subjects=[{"n": "minh head", "p": [-0.9, 1.9, -2.2], "f": [1088, 1117]}],
  physics="chair: hinges on its back legs, rotates 90 deg under gravity in 10 f, bounces 6 deg, settles.", light_mood="day.",
  sound="chair scrape f1084, clatter f1096; 'Huh' meme f1084.", after="Chair lies on its back (seen again in S16? no: S16 is in the cellar).")

scene(id="S08", f=[1118, 1187], set="kitchen", light="golden", vo="Hồi đó tôi mua hộp này bằng tiền ăn sáng!\"",
  gloss="'Back then I bought this box with my breakfast money!'", spine=3, viewer="It was a kid's box once, bought with breakfast money.",
  **{"in": {"type": "dissolve", "n": 6}, "out": {"type": "dissolve", "n": 6, "to": "S09"}},
  build="new: kitchen; the box (new, glossy), a noodle bowl, the ĂN SÁNG tin tipped over, coins.", blocking="Kid seated behind the table facing the lens; mum at the stove.",
  action="f1125-1140 the kid pushes the bowl away (it slides 15 cm); f1145 he hugs the box with both arms, grinning; a coin rolls off the table f1150 and spins out on the floor. Title 2006.",
  acting="kid beaming; mum stirring, back to her pot (front view, looking at the pot).",
  cams=[k(1118, [-0.35, 1.25, 1.1], [-0.35, 0.95, -0.9], 42, push=0.002, blur=8, focus=[-0.35, 1.0, -0.8], why="kid, box, tin, bowl")],
  kicks=[], marks=[{"who": "kid", "at": KIT["kid"], "view": "front", "pose": "sit, push bowl, hug box", "expr": "grin"}, {"who": "mom", "at": [-1.3, -1.75], "view": "front", "pose": "stir", "expr": "neutral"}],
  subjects=[{"n": "kid head", "p": [-0.25, 1.25, -1.12], "f": [1118, 1186]}, {"n": "box", "p": KIT["box"], "f": [1118, 1186]}],
  physics="bowl slides with friction; coin rolls and spins down.", light_mood="golden 2006 morning.", sound="kitchen sizzle; coin roll + spin; kid giggle.", after="—")

scene(id="S09", f=[1187, 1390], set="saleroom", light="day", vo="Bên cạnh là một lá Pikachu khoác áo poncho Rayquaza, PSA mười điểm, mười tám đến hai mươi nghìn euro.",
  gloss="Next to it, a Pikachu wearing a Rayquaza poncho, PSA 10, 18,000 to 20,000 euros.", spine=4, viewer="The second star lot, graded perfect.",
  **{"in": {"type": "dissolve", "n": 6}, "out": {"type": "glide", "to": "S10"}},
  build="reuse:slabReal with the REAL Poncho Pikachu on the slab stand; a second spotlight.", blocking="nobody.",
  action="f1219 (on 'Pikachu') the spotlight over the slab stand snaps on; f1240-1270 macro on the card (the poncho on 'Rayquaza' f1262); a gleam crosses the slab f1300 ('PSA'); f1320 pull back to medium. Title €18,000 - €20,000 f1330.",
  acting="none", cams=[k(1187, [2.2, 1.6, -2.5], [2.2, 1.45, -4.6], 40, push=0.0015, blur=6, focus=[2.2, 1.45, -4.6], why="vitrine and the slab stand"),
        k(1236, [2.4, 1.5, -4.05], [2.4, 1.47, -4.6], 34, glide=30, push=0.0015, blur=12, focus=SLAB, why="macro on the card"),
        k(1318, [2.32, 1.56, -3.35], [2.4, 1.4, -4.6], 38, glide=26, push=0.0015, blur=8, focus=SLAB, why="room for the title")],
  kicks=[[1219, 0.3]], marks=[], subjects=[{"n": "slab", "p": SLAB, "f": [1220, 1389]}],
  physics="none.", light_mood="day + spot.", sound="spot clunk f1219; shimmer f1300; a little Pikachu-ish squeak? no: a soft 'ding'.", after="Spot stays on the slab.")

scene(id="S10", f=[1390, 1519], set="saleroom", light="day", vo="Một chú chuột điện mặc đồ hóa trang, đắt hơn chiếc xe máy của bạn chừng mười lần.",
  gloss="An electric mouse in costume, about ten times pricier than your motorbike.", spine=4, viewer="Ten scooters = one slab.",
  **{"in": {"type": "glide", "from": "S09"}, "out": {"type": "glide", "to": "S11"}},
  build="new: ten scooters down the aisle with €1,900 tags.", blocking="Gentlemen seated; those by the aisle turn their heads.",
  action="f1390-1460 scooter 1 parked below the slab stand, its tag swinging; f1462-1500 the camera cranes up and back over the stage: nine more scooters in a row down the aisle; their tags swing as the camera passes; f1494 ('mười lần') the last one comes into frame. Title X10.",
  acting="aisle gentlemen glance at the scooters.",
  cams=[k(1390, [3.2, 1.35, -2.0], [2.4, 0.85, -3.6], 40, glide=30, push=0.0015, blur=8, focus=[2.3, 0.8, -3.4], why="scooter and slab"),
        k(1456, [2.6, 3.5, -4.9], [2.3, 0.5, 1.4], 46, glide=46, push=0.001, blur=2, focus=[2.3, 0.6, 0.4], why="crane: ten in a row")],
  kicks=[], marks=[{"who": "gentlemen", "at": [0.7, -2.2], "view": "front", "pose": "all 18 seats (plan.seats): seated", "expr": "neutral/smile"}],
  subjects=[{"n": "scooter 1", "p": [2.3, 0.7, -3.4], "f": [1400, 1455]}, {"n": "scooter 10", "p": [2.3, 0.7, 3.8], "f": [1496, 1518]}],
  physics="tags swing (pendulum, damped).", light_mood="day.", sound="scooter horn beep f1410 (meme-ish), ten little ticks f1462-1494.", after="The scooters stay in the aisle.")

scene(id="S11", f=[1519, 1633], set="saleroom", light="day", vo="Khoan, sao một hộp bìa cứng lại được đối xử như rượu vang quý?",
  gloss="Wait, why is a cardboard box treated like a fine wine?", spine=5, viewer="The question: why so precious?",
  **{"in": {"type": "glide", "from": "S10"}, "out": {"type": "dissolve", "n": 8, "to": "S12", "note": "through-object: the box → a rack cubby"}},
  build="waiter with a wine bottle.", blocking="Waiter at his mark beside the vitrine, front view.",
  action="f1530 the waiter steps in (side, 4 steps) to his mark; f1590-1603 he lifts a wine bottle onto his forearm, label out, next to the vitrine ('rượu vang' f1603); push in on 'quý'.",
  acting="waiter grave, eyebrows up.",
  cams=[k(1519, [1.7, 1.65, -1.9], [1.7, 1.6, -4.5], 38, glide=30, push=0.002, punch=[0.006, 18], blur=6, focus=[1.6, 1.45, -4.5], why="vitrine and the waiter")],
  kicks=[], marks=[{"who": "waiter", "at": [1.95, -4.25], "view": "side -> front", "pose": "present the bottle", "expr": "stern"}],
  subjects=[{"n": "vitrine", "p": VIT, "f": [1519, 1632]}, {"n": "waiter head", "p": [1.95, 2.0, -4.25], "f": [1560, 1632]}],
  physics="none.", light_mood="day.", sound="footsteps; a bottle clink f1600; 'Suspicious Sound' meme f1525.", after="—")

scene(id="S12", f=[1633, 1698], set="cellar", light="golden", vo="Hóa ra, nó chính là rượu vang.",
  gloss="Turns out, it IS wine.", spine=5, viewer="Boxes sit in a wine rack.",
  **{"in": {"type": "dissolve", "n": 8}, "out": {"type": "glide", "to": "S13"}},
  build="new: the cellar, the rack (bottles, sealed boxes), year plate 2006, barrel.", blocking="the sommelier (the waiter) at his mark by the rack.",
  action="f1633-1645 hold on one boxed cubby; f1645-1690 pull back: bottles on the left, boxes on the right. Year plate 2006.",
  acting="none", cams=[k(1633, [0.65, 1.42, -2.0], [0.65, 1.42, -2.62], 30, push=0, blur=10, focus=[0.65, 1.42, -2.55], why="one boxed cubby"),
        k(1645, [0.0, 1.4, 4.3], [0.0, 1.22, -2.6], 46, glide=48, push=0.001, blur=3, focus=[0, 1.2, -2.6], why="the whole rack")],
  kicks=[], marks=[{"who": "waiter", "at": [-1.05, -2.15], "view": "front", "pose": "stand", "expr": "smile_closed"}],
  subjects=[{"n": "rack L", "p": [-1.2, 1.2, -2.6], "f": [1690, 1697]}, {"n": "rack R", "p": [1.2, 1.2, -2.6], "f": [1690, 1697]}],
  physics="none.", light_mood="golden, warm candle-ish.", sound="cellar hush, drip.", after="—")

scene(id="S13", f=[1698, 1799], set="cellar", light="golden", vo="Mỗi chai ngon bị mở là một chai biến mất mãi mãi.",
  gloss="Every good bottle that's opened is one bottle gone forever.", spine=5, viewer="Open = gone.",
  **{"in": {"type": "glide", "from": "S12"}, "out": {"type": "glide", "to": "S14"}},
  build="bottle, cork, glass on the barrel.", blocking="sommelier at his mark, front.",
  action="f1700-1716 he pulls a bottle from cubby (col 1, row 3); f1733 the cork pops (2 f before 'mở'), flies up, bounces on the floor twice, stays; f1746-1768 he pours into the glass on the barrel; the slot stays dark and empty.",
  acting="sommelier pleased, then a sip-face.",
  cams=[k(1698, [-0.6, 1.55, 0.7], [-0.85, 1.35, -2.2], 44, glide=30, push=0.0018, blur=6, focus=[-0.95, 1.3, -2.3], why="sommelier, rack, barrel")],
  kicks=[[1733, 0.4]], marks=[{"who": "waiter", "at": [-1.05, -2.15], "view": "front", "pose": "pull bottle, pop, pour", "expr": "smile -> grin"}],
  subjects=[{"n": "somm head", "p": [-1.05, 2.0, -2.15], "f": [1698, 1798]}, {"n": "empty slot", "p": [-0.84, 1.27, -2.55], "f": [1720, 1798]}],
  physics="cork: launched 3 m/s up-left, two bounces, rests on the floor.", light_mood="golden.", sound="squeak f1725, POP f1733, cork clicks f1752 f1760, glug pour f1746-1768.", after="Empty slot; cork on the floor.")

scene(id="S14", f=[1799, 1836], set="cellar", light="golden", vo="Hộp thẻ cũng vậy.", gloss="Card boxes too.", spine=5, viewer="The boxes are bottles.",
  **{"in": {"type": "glide", "from": "S13"}, "out": {"type": "locked", "to": "S15"}},
  build="—", blocking="—", action="f1799-1830 pan right to the 18 sealed boxes.", acting="none",
  cams=[k(1799, [0.68, 1.45, 1.3], [0.68, 1.25, -2.6], 44, glide=30, push=0.0005, blur=2, focus=[0.68, 1.25, -2.6], why="the box half")],
  kicks=[], marks=[], subjects=[{"n": "boxes", "p": [0.68, 1.2, -2.6], "f": [1830, 1835]}], physics="none.", light_mood="golden.", sound="a soft wrap crinkle.", after="—")

scene(id="S15", hero=True, f=[1836, 1996], set="cellar", light="golden",
  vo="Hai mươi năm qua, cứ mỗi đứa trẻ không kìm được tay mà xé màng, thế giới lại mất đi một hộp.",
  gloss="For twenty years, every time a kid couldn't keep their hands off and tore the wrap, the world lost one box.", spine=5, viewer="The sealed boxes disappear one opened box at a time.",
  **{"in": {"type": "locked", "from": "S14"}, "out": {"type": "push", "to": "S16"}},
  build="boxes with a lid that flips and a wrap that tears; shreds on the floor.", blocking="—",
  action="f1840-1985 the year plate rolls 2006 → 2026. From f1866 every ~6.6 f a box rips open (open_order/open_at): wrap shreds burst out and flutter down, the lid flips up and stays; the shreds pile up on the floor below the rack. One box (last_box) stays sealed and gleams f1988.",
  acting="none", cams=[k(1836, [0.68, 1.45, 1.3], [0.68, 1.25, -2.6], 44, push=0.0008, blur=2, focus=[0.68, 1.25, -2.6], why="locked frame, state changing")],
  kicks=[], marks=[], subjects=[{"n": "year", "p": [0.68, 2.47, -2.58], "f": [1840, 1990]}, {"n": "boxes", "p": [0.68, 1.2, -2.6], "f": [1836, 1995]}],
  physics="shreds: light paper, fall at 0.6 m/s with flutter, rest on the floor (y 0.01).", light_mood="golden.",
  sound="17 rips accelerating, paper flutters; digit ticks; a sad trombone-ish note at the end? no: a single shimmer on the last box f1988.", after="17 open boxes, a floor of shreds, one sealed box.")

scene(id="S16", f=[1996, 2063], set="cellar", light="golden", vo="Thứ càng ít, càng có người muốn giành.",
  gloss="The scarcer it is, the more people fight for it.", spine=5, viewer="Scarcity makes the scramble.",
  **{"in": {"type": "push", "from": "S15"}, "out": {"type": "dissolve", "n": 8, "to": "S17", "note": "back to 2006"}},
  build="numbered paddles thrust in from below the frame.", blocking="bidders below the frame (only their paddles).",
  action="f1996-2020 push to the last sealed box; f2024-2058 paddles (12) jab up from the bottom of the frame on all sides, jostling, 'giành' f2049 all at once.",
  acting="none", cams=[k(1996, [0.65, 1.12, -0.45], [0.65, 1.0, -2.6], 44, glide=26, push=0.002, punch=[0.006, 14], blur=6, focus=[0.65, 1.04, -2.55], why="the last box")],
  kicks=[[2049, 0.5]], marks=[], subjects=[{"n": "last box", "p": [0.65, 1.04, -2.55], "f": [2022, 2062]}],
  physics="paddles up 4 f, wobble.", light_mood="golden.", sound="crowd clamour rising f2024, paddle whooshes; 'Gogogogogo'? no: a bidding hubbub.", after="—")

scene(id="S17", hero=True, f=[2063, 2196], set="kitchen", light="golden", vo="Vậy nên, nếu hồi bé bạn từng bị mẹ cấm bóc hộp thẻ vì sợ bừa nhà,",
  gloss="So if, as a kid, your mum stopped you opening the box because of the mess,", spine=6, viewer="Mum saved the box.",
  **{"in": {"type": "dissolve", "n": 8}, "out": {"type": "dissolve", "n": 8, "to": "S18", "note": "twenty years later"}},
  build="the kitchen again (2006); the box on the table.", blocking="Kid seated; mum standing at her mark beside the table; she walks to the cupboard f2150-2170.",
  action="f2110-2132 the kid's hand goes to the wrap; f2134 ('cấm') mum snatches the box up; f2150-2170 she walks it to the cupboard; f2172-2180 sets it on top ('bừa nhà' f2176), dusts her hands. Kid sulks.",
  acting="kid eager -> pained sulk; mum stern -> satisfied.",
  cams=[k(2063, [0.35, 1.45, 1.9], [0.35, 1.15, -1.2], 54, push=0.0004, blur=5, focus=[-0.5, 1.1, -0.9], why="table, mum and the cupboard")],
  kicks=[[2134, 0.4]], marks=[{"who": "kid", "at": KIT["kid"], "view": "front", "pose": "reach -> sulk", "expr": "grin -> pained"},
                              {"who": "mom", "at": KIT["mom"], "view": "front -> side -> front", "pose": "snatch, walk, shelve", "expr": "stern -> smile_closed"}],
  subjects=[{"n": "box", "p": KIT["box"], "f": [2063, 2133]}, {"n": "cupboard top", "p": [0.85, 1.89, -2.15], "f": [2176, 2195]}],
  physics="box carried; set down with a 1 cm settle.", light_mood="golden.", sound="wrap crinkle f2128; mum's 'tsk' f2134; footsteps; thunk f2176.", after="The box on top of the cupboard.")

scene(id="S18", hero=True, f=[2196, 2280], set="kitchen", light="day", vo="thì hôm nay, hãy về nhà và xin lỗi mẹ.",
  gloss="then today, go home and apologise to your mum.", spine=6, viewer="The sealed box survived; say sorry.",
  **{"in": {"type": "dissolve", "n": 8}, "out": {"type": "end"}},
  build="the kitchen in 2026 (the box still on the cupboard, sealed, dusty); flowers.", blocking="Mum (grey hair) at her mark; Minh walks in from the door to his mark f2200-2232.",
  action="f2200-2232 Minh walks in holding flowers; f2240-2262 he bows ('xin lỗi' f2246); mum smiles and points up at the cupboard f2250; f2256-2280 tilt up to the box, a gleam on the wrap f2266.",
  acting="Minh sheepish; mum amused.",
  cams=[k(2196, [0.3, 1.45, 1.9], [0.3, 1.15, -1.2], 50, push=0.0012, blur=5, focus=[0, 1.2, -0.7], why="same frame, 20 years later"),
        k(2250, [1.9, 1.6, 0.3], [0.85, 1.85, -2.15], 40, glide=30, push=0.002, blur=6, focus=[0.85, 1.89, -2.15], why="tilt to the sealed box")],
  kicks=[], marks=[{"who": "mom", "at": KIT["mom26"], "view": "front", "pose": "stand, point up", "expr": "smile"}, {"who": "minh", "at": [0.75, -0.45], "view": "side -> front", "pose": "walk in, bow", "expr": "nervous -> smile"}],
  subjects=[{"n": "minh head", "p": [0.75, 2.0, -0.45], "f": [2232, 2250]}, {"n": "box", "p": [0.85, 1.89, -2.15], "f": [2275, 2279]}],
  physics="none.", light_mood="day 2026.", sound="door creak f2198; footsteps; a warm closing chord; 'Romantic' meme f2246.", after="End on the sealed box.")

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(S), "scenes")
