"""Generator of plan.json for the Lucas (big collection, "easy as candy") reel. The plan is the source of truth: change it here, then
python3 videos/lucas-big-collection/mkplan.py && python3 scripts/plan_check.py videos/lucas-big-collection/plan.json"""
import json, os
def k(f, pos, look, fov, glide=None, cut=False, push=0.002, punch=None, blur=6, focus=None, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=blur, why=why)
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    if focus: d["focus"] = focus
    return d

# ---------------- layout (set-local metres; the build reads these) ----------------
TY = 0.75
HOME = dict(half=2.6, h=2.6, table=[0.35, -1.0], table_size=[1.4, 0.8], table_y=TY,
            dealer=[0.45, -1.55], lucas=[-0.55, -0.5], lucas_bins=[1.5, -0.45], fiance=[1.45, 0.55],
            lucas_seat=[0.0, -1.55], fiance_seat=[0.72, -1.55],
            scale=[0.45, TY, -1.24], lamp=[-0.08, TY, -1.3], lamp_head=[0.12, 1.16, -1.25],
            todo=[0.86, TY, -1.12], done=[0.02, TY, -1.08], dealer_box=[-0.2, 0, -1.9],
            phone=[-0.12, TY, -0.82], pizza=[0.36, TY, -1.0], laptop=[0.0, TY, -1.12], candy=[-0.28, TY, -0.98],
            door=[1.15, 2.05], door_h=2.05, clock=[0.95, 1.86, -2.585], clock_r=0.16, calendar=[-0.35, 1.6, -2.585],
            bins=[[2.1, -1.2], [2.1, -0.55], [2.1, 0.1]], bin_size=[0.42, 0.34, 0.58],
            sofa=[-2.55, -1.75, -0.4, 1.6], seat_y=0.45, chorus=[[-2.1, 0.0], [-2.1, 0.6], [-2.1, 1.2]],
            coffee=[-1.25, 0.6], coffee_size=[0.5, 0.8], coffee_y=0.42, bowl2=[-1.2, 0.42, 0.6])
HALL = dict(hx=7.0, hz=5.0, h=4.5, booth=[-5.0, 0.5], queue=[[-4.0 + 0.75 * i, 0.5] for i in range(7)], lucas=[1.35, 0.5], truck=[1.95, 0.5],
            clock=[-1.8, 3.0, -4.98], clock_r=0.4, banner=[2.6, 3.7, -4.94], phone=[1.0, 1.2, 0.5], eye=[1.35, 1.62, 0.5])
STREET = dict(road=[-70, 70], lane=4.0, drive=[1530, 1658], drive_x=[-30.0, 30.0], car_z=-1.6, gantry=0.0,
              lot=[37, 60, -4, 6], car_l=[41.0, 0.0], car_d=[51.0, 0.0], lucas=[44.6, 1.4], dealer=[47.4, 1.4],
              lucas_meet=[45.45, 1.4], dealer_meet=[46.55, 1.4], lamp=[46.0, -3.4])
SHOP = dict(half=3.0, h=2.8, counter=[-1.5, 1.5, -1.25, -0.65], counter_y=0.95, clerk=[-0.25, -1.55], lucas=[0.75, -0.25], lucas_in=[2.3, 0.2],
            scanner=[-0.28, 0.95, -0.9], box=[0.55, 0.95, -0.86], check=[-0.02, 0.952, -0.88], idcard=[0.18, 0.95, -0.82])
H, HA, ST, SH = HOME, HALL, STREET, SHOP
DEALER_HEAD = [H["dealer"][0], 1.45, H["dealer"][1]]
LUCAS_HEAD = [H["lucas"][0], 1.62, H["lucas"][1]]
SCALE_PT = [H["scale"][0], TY + 0.05, H["scale"][2]]
CLOCK = H["clock"]

P = {
 "fps": 30, "frames": 2430, "voice_end": 2391,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 26, "out": 70, "text": "45 PHÚT", "style": 3, "from": "top"},
  {"f": 76, "out": 108, "text": "120 PHÚT", "style": 3, "from": "top"},
  {"f": 300, "out": 344, "text": "LUCAS DERUYTER", "style": 3, "from": "top"},
  {"f": 612, "out": 664, "text": "$16,000", "style": 3, "from": "top"},
  {"f": 804, "out": 852, "text": "90 PHÚT", "style": 3, "from": "top"},
  {"f": 1048, "out": 1096, "text": "30 · 09", "style": 3, "from": "top"},
  {"f": 1210, "out": 1246, "text": "~$17,000", "style": 3, "from": "top"},
  {"f": 1636, "out": 1690, "text": "$3,500", "style": 3, "from": "top"},
  {"f": 2006, "out": 2048, "text": "8 THÁNG", "style": 3, "from": "top"}],
 "cards": {"packs": {"BASE SET": "zard_base", "JUNGLE": "jg_scyther", "FOSSIL": "fs_aerodactyl", "ROCKET": "tr_dark_zard"},
           "shadowless": "zard_base", "note": "pack fronts carry the real card art of each set's mascot (crop of the real scan) under plain lettering, no logos"},
 "home": HOME, "hall": HALL, "street": STREET, "shop": SHOP,
 "sets": {
  "home": {"origin": [0, 0, 0], "axes": "back wall z -2.6 (door at its right, clock, calendar); the dining table in the middle; the sofa along the -x wall; open side +z",
   "light": "golden", "sun": [35, 30], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: living-dining room x -2.6..2.6, z -2.6..2.6, 2.6 m, sage walls, oak floor, ceiling (no shadows), window in the front wall", "pos": [0, 1.3, 0], "size": [5.2, 2.6, 5.2]},
    {"id": "door", "build": "new: front door 0.9 x 2.05 m in the back wall, hinged at x 2.05, swings in (+z); frame, knob", "pos": [1.6, 1.025, -2.58], "size": [0.9, 2.05, 0.05]},
    {"id": "clock", "build": "new: wall clock r 16 cm, white face, ink ticks, two hands that spin (time-lapse)", "pos": CLOCK, "size": [0.32, 0.32, 0.03]},
    {"id": "calendar", "build": "new: wall calendar 30 x 42 cm, pages tear off (THÁNG 6..9, THỨ HAI, 8 more months)", "pos": H["calendar"], "size": [0.3, 0.42, 0.01]},
    {"id": "table", "build": "new: dining table 140 x 80 cm, top y 0.75, four legs; two chairs behind it", "pos": [0.35, 0.375, -1.0], "size": [1.4, 0.75, 0.8]},
    {"id": "scale", "build": "new: borrowed jewellery scale 12 x 12 x 2.4 cm, steel pan, hinged lid open, LCD readout on the front (grams, live canvas)", "pos": H["scale"], "size": [0.12, 0.024, 0.12]},
    {"id": "lamp", "build": "new: desk lamp: round base, two-bone arm, cone shade aimed at the scale, emissive bulb", "pos": H["lamp"], "size": [0.14, 0.45, 0.14]},
    {"id": "packs", "build": "new: two stacks of sealed booster packs (to weigh / weighed), each pack 7 x 12 x 0.8 cm with a real card-art front", "pos": H["todo"], "size": [0.08, 0.1, 0.13]},
    {"id": "bins", "build": "new: three clear-blue plastic storage tubs 42 x 34 x 58 cm with snap lids, full of sealed packs", "pos": [2.1, 0.17, -0.55], "size": [0.42, 0.34, 1.88]},
    {"id": "sofa", "build": "new: three-seat sofa along the -x wall, seat y 0.45; coffee table 50 x 80 cm with a candy bowl", "pos": [-2.15, 0.4, 0.6], "size": [0.8, 0.85, 2.0]},
    {"id": "phone", "build": "new: Lucas's phone 7.5 x 15.5 cm (live canvas screen), lies on the table or is held", "pos": H["phone"], "size": [0.075, 0.008, 0.155]},
    {"id": "laptop", "build": "new: laptop 32 x 22 cm, screen tilted back 105 deg facing Lucas's seat (live canvas: the post)", "pos": H["laptop"], "size": [0.32, 0.22, 0.22]},
    {"id": "pizza", "build": "new: open pizza box 40 x 40 cm, a pizza with two slices gone", "pos": H["pizza"], "size": [0.4, 0.05, 0.4]},
    {"id": "candy", "build": "new: glass bowl of rock-candy sticks (blue crystal clusters on wooden sticks)", "pos": H["candy"], "size": [0.16, 0.16, 0.16]}],
   "marks": {"dealer": H["dealer"], "lucas": H["lucas"], "lucas_bins": H["lucas_bins"], "fiance": H["fiance"], "lucas_seat": H["lucas_seat"], "fiance_seat": H["fiance_seat"]}},
  "hall": {"origin": [40, 0, 0], "axes": "a convention hall; vendor tables along the back wall z -3.6; the queue runs along z 0.5 toward the WE BUY booth at x -5 (people face -x)",
   "light": "day", "sun": [-30, 50], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: hall x -7..7, z -5..5, 4.5 m, grey-blue carpet, pale walls, ceiling with light panels", "pos": [0, 2.25, 0], "size": [14, 4.5, 10]},
    {"id": "booth", "build": "new: buying booth: table with a cloth, a cash box, a hanging sign WE BUY · CASH", "pos": [-5.0, 0.4, 0.5], "size": [0.8, 0.8, 2.0]},
    {"id": "tables", "build": "new: six vendor tables with blue cloths, glass display cases of cards, standing banners", "pos": [0, 0.45, -3.6], "size": [12, 0.9, 0.8]},
    {"id": "banner", "build": "new: hanging banner CARD SHOW (cloth 4 x 0.8 m)", "pos": HA["banner"], "size": [4.0, 0.8, 0.02]},
    {"id": "clock", "build": "new: big wall clock r 40 cm whose hands spin 90 minutes", "pos": HA["clock"], "size": [0.8, 0.8, 0.04]},
    {"id": "truck", "build": "new: hand truck with the three tubs strapped on it", "pos": [HA["truck"][0], 0.55, HA["truck"][1]], "size": [0.5, 1.1, 0.6]}],
   "marks": {"lucas": HA["lucas"]}},
  "street": {"origin": [80, 0, 0], "axes": "a Los Angeles boulevard along x (lanes z -4..4), a sign gantry LOS ANGELES at x 0, the parking lot x 37..60 at its end",
   "light": "golden", "sun": [-70, 12], "open_sides": "+z",
   "objects": [
    {"id": "road", "build": "new: asphalt road x -70..60, lane lines, kerbs, sidewalks z +-4..+-7, palms, street lamps, stucco shop fronts", "pos": [0, 0, 0], "size": [130, 0.1, 14]},
    {"id": "gantry", "build": "new: steel sign gantry over the road at x 0 with a green sign LOS ANGELES / 10 W", "pos": [0, 5.6, 0], "size": [0.4, 1.4, 8.0]},
    {"id": "car_l", "build": "new: Lucas's blue hatchback (box body, glass, four wheels), drives +x, then parks", "pos": [ST["car_l"][0], 0.7, ST["car_l"][1]], "size": [4.2, 1.5, 1.8]},
    {"id": "car_d", "build": "new: the dealer's black SUV parked facing -x, headlights on", "pos": [ST["car_d"][0], 0.8, ST["car_d"][1]], "size": [4.6, 1.7, 1.9]},
    {"id": "lamp", "build": "new: one sodium lamp post over the lot (emissive head)", "pos": [ST["lamp"][0], 3.0, ST["lamp"][1]], "size": [0.3, 6.0, 0.3]},
    {"id": "envelope", "build": "new: thick paper envelope 23 x 11 x 2 cm, bills poking out", "pos": [45.9, 1.05, 1.5], "size": [0.23, 0.11, 0.02]},
    {"id": "box", "build": "new: cardboard box 40 x 26 x 30 cm, open top, the bought-back packs inside", "pos": [46.4, 1.0, 1.5], "size": [0.4, 0.26, 0.3]}],
   "marks": {"lucas": ST["lucas"], "dealer": ST["dealer"]}},
  "shop": {"origin": [160, 0, 0], "axes": "a card shop: the counter along x at z -0.95, the clerk behind it facing +z, shelves of sealed product behind him",
   "light": "day", "sun": [40, 45], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: shop x -3..3, z -3..3, 2.8 m, cream walls, tiled floor, ceiling with panels, sign WE BUY CARDS", "pos": [0, 1.4, 0], "size": [6, 2.8, 6]},
    {"id": "counter", "build": "new: glass-front counter 3.0 x 0.6 m, top y 0.95, cards in the case", "pos": [0, 0.475, -0.95], "size": [3.0, 0.95, 0.6]},
    {"id": "scanner", "build": "new: ID scanner 12 x 8 x 6 cm with a red glass window (laser line on a scan)", "pos": SH["scanner"], "size": [0.12, 0.06, 0.08]},
    {"id": "check", "build": "new: a check 18 x 8 cm on the counter (live canvas: the misspelt name written in)", "pos": SH["check"], "size": [0.18, 0.002, 0.08]},
    {"id": "shelves", "build": "new: wall shelves of sealed booster boxes behind the counter", "pos": [0, 1.4, -2.8], "size": [4.0, 1.8, 0.35]}],
   "marks": {"clerk": SH["clerk"], "lucas": SH["lucas"]}}},
 "cast": {
  "lucas": {"look": ["blue flannel shirt", "jeans", "short brown hair"], "items": ["phone", "rock candy", "envelope", "box of packs"], "views": ["front", "side walking", "seated"]},
  "fiance": {"look": ["mint sweater", "long auburn hair"], "items": ["pizza slice"], "views": ["front standing / seated"]},
  "dealer": {"look": ["black jacket", "black cap", "goatee", "shades in the lot"], "items": ["packs", "loupe", "phone", "box"], "views": ["front seated", "side walking", "front standing"]},
  "clerk": {"look": ["red shop polo", "dark hair", "glasses"], "items": ["ID card", "pen"], "views": ["front standing"]},
  "chorus": {"look": ["three friends: orange hoodie, purple tee, green jacket"], "items": ["candy"], "views": ["front seated on the sofa"]},
  "queue": {"look": ["seven card-show buyers, varied coats, some with boxes"], "items": [], "views": ["side, facing -x"]}},
 "scenes": []}

S = P["scenes"]
def scene(**kw): S.append(kw)
HOOK_WIDE = dict(pos=[0.7, 1.45, 2.1], look=[1.05, 1.3, -1.9])
HOOK_DEAL = dict(pos=[0.55, 1.38, 1.65], look=[0.8, 1.18, -1.5])

scene(id="S01", hero=True, f=[0, 268], set="home", light="golden",
  vo="Một người mua đến trễ bốn mươi lăm phút, rồi ngồi suốt hai tiếng, cân từng gói thẻ Pokémon trên chiếc cân nữ trang của người khác, như nhà giả kim đang thử vàng.",
  gloss="A buyer shows up forty-five minutes late, then sits for two hours weighing every Pokémon pack on someone else's jewellery scale, like an alchemist testing gold.",
  spine=1, viewer="A late buyer weighs every pack on a tiny scale for hours.",
  **{"in": {"type": "open on the act"}, "out": {"type": "glide", "to": "S02"}},
  build="new: the living room (door, clock, calendar, table, scale, lamp, two pack stacks).",
  blocking="Dealer bursts through the door f10, walks (side view, -x) behind the table to his chair f16-54, sits f56-66 at his mark facing +z.",
  action="f0-10 the clock over the door already reads 45 min late (hands spin through 45 min f0-50, title 45 PHÚT); f10-16 the door flies open and slams the wall on 'trễ' (f20): kick, a framed photo by the door rattles; f56-66 he drops into the chair; f70 sets the borrowed scale square; f77-106 the clock spins two hours on 'suốt hai tiếng' (title 120 PHÚT); f107-200 three weigh cycles: pack from the right stack onto the pan, readout ticks (21.4 g, 21.1 g, 22.9 g), pack onto the left stack; f208-262 he lifts a pack against the lamp, a loupe at his eye, the scale's readout glows gold on 'vàng' (f250).",
  acting="Dealer unhurried, smug, squinting; never looks up.",
  cams=[k(0, HOOK_WIDE["pos"], HOOK_WIDE["look"], 44, push=0.0012, blur=4, focus=[1.4, 1.3, -2.3], why="the door bursts open under the clock"),
        k(46, HOOK_DEAL["pos"], HOOK_DEAL["look"], 40, glide=30, push=0.0015, blur=6, focus=DEALER_HEAD, why="he sits, the clock spins two hours"),
        k(108, [0.55, 1.12, 0.62], [0.5, 0.98, -1.3], 32, glide=28, push=0.0015, blur=10, focus=SCALE_PT, why="weighing, pack by pack"),
        k(204, [0.32, 1.18, 0.55], [0.35, 1.2, -1.4], 30, glide=24, push=0.0, blur=10, focus=[0.3, 1.25, -1.35], why="the alchemist at the lamp")],
  kicks=[[16, 0.9]], marks=[{"who": "dealer", "at": H["dealer"], "view": "side walking -> front seated", "pose": "walk in f16-54, sit f56, weigh f107-200, pack to the lamp f208", "expr": "smile_closed -> stern"}],
  subjects=[{"n": "door", "p": [1.6, 1.2, -2.5], "f": [0, 30]}, {"n": "clock", "p": CLOCK, "f": [0, 30]}, {"n": "dealer head", "p": DEALER_HEAD, "f": [70, 200]},
            {"n": "scale", "p": SCALE_PT, "f": [120, 200]}],
  physics="Door: swings 0 -> 100 deg in 5 f, hits the stop, bounces back 12 deg and settles 95 deg by f30 (damped spring). Packs: carried, set down flat; the stacks grow / shrink by one each cycle.",
  light_mood="golden evening: warm lamp, the scale's LCD and the lamp bulb emissive.",
  sound="door slam f16 (Instagram Thud); clock ticking fast f0-50 and f77-106; scale beep each weigh f118, f150, f182; a mystic shimmer on 'vàng' f250.",
  after="The packs move from the right stack to the left stack; the dealer stays at the table.")

scene(id="S02", f=[268, 342], set="home", light="golden",
  vo="Người đứng nhìn là Lucas DeRuyter.", gloss="The man standing watching is Lucas DeRuyter.",
  spine=1, viewer="Lucas, arms down, watches it happen.",
  **{"in": {"type": "glide", "from": "S01"}, "out": {"type": "glide", "to": "S03"}},
  build="reuse the room.", blocking="Lucas stands at his mark, front view, the dealer seated at the table in the background.",
  action="f271 the camera swings off the dealer to Lucas; f286 'đứng nhìn' Lucas blinks slowly, a tired half-smile; the dealer keeps weighing behind him (one more cycle f290-330).",
  acting="Lucas: patient, tired (neutral -> dazed).",
  cams=[k(268, [0.32, 1.18, 0.55], [0.35, 1.2, -1.4], 30, push=0.0, blur=10, focus=[0.3, 1.25, -1.35], why="hold on the dealer"),
        k(272, [0.15, 1.5, 2.0], [-0.3, 1.3, -0.8], 38, glide=36, push=0.0018, blur=8, focus=LUCAS_HEAD, why="to Lucas watching")],
  kicks=[], marks=[{"who": "lucas", "at": H["lucas"], "view": "front", "pose": "standing, arms down", "expr": "neutral -> dazed"}],
  subjects=[{"n": "lucas head", "p": LUCAS_HEAD, "f": [300, 341]}],
  physics="none.", light_mood="golden.", sound="scale beep f300; a soft bass note under his name.", after="Lucas at his mark.")

BIN_TOP = [2.1, 0.36, -0.55]
scene(id="S03", f=[342, 654], set="home", light="golden",
  vo="Ba thùng nhựa đồ Pokémon của bà vợ sắp cưới, trong đó có vài chục gói thẻ chưa bóc: Base Set, Jungle, Fossil, Rocket. Trị giá khoảng mười sáu nghìn đô.",
  gloss="Three plastic tubs of his fiancée's Pokémon stuff, with a few dozen sealed packs inside: Base Set, Jungle, Fossil, Rocket. Worth about sixteen thousand dollars.",
  spine=2, viewer="Her childhood collection: tubs of sealed packs, worth $16,000.",
  **{"in": {"type": "glide", "from": "S02"}, "out": {"type": "dissolve", "to": "S04", "n": 6}},
  build="new: three clear-blue tubs with lids, packs inside, four hero packs with real card art (Base Charizard, Jungle Scyther, Fossil Aerodactyl, Rocket Dark Charizard).",
  blocking="Lucas walks (side view, +x) from his mark to beside the tubs f346-378; his fiancée stands by the tubs at her mark, front view.",
  action="f359, f367, f374 the three lids snap off one after another and land leaning on the tubs; f398-420 on 'bà vợ sắp cưới' she grins and pats tub 3; f430-490 the camera rises over the open tubs: rows of sealed packs; on each set name one pack rises out of the middle tub and stands on its rim: BASE SET f495, JUNGLE f522, FOSSIL f545, ROCKET f566; f612-645 the four packs glint once each on 'mười sáu nghìn đô' (title $16,000).",
  acting="Fiancée proud and happy; Lucas amazed.",
  cams=[k(342, [0.15, 1.5, 2.0], [-0.3, 1.3, -0.8], 38, push=0.0, blur=8, focus=LUCAS_HEAD, why="hold"),
        k(346, [0.95, 1.45, 2.3], [1.65, 0.95, -0.5], 40, glide=44, push=0.0015, blur=6, focus=BIN_TOP, why="Lucas to the tubs, the fiancée"),
        k(428, [1.85, 1.95, 0.65], [2.08, 0.42, -0.6], 36, glide=40, push=0.0015, blur=6, focus=BIN_TOP, why="over the open tubs: the packs"),
        k(600, [1.65, 1.75, 1.0], [2.0, 0.6, -0.55], 40, glide=28, push=0.002, blur=6, focus=BIN_TOP, why="the value")],
  kicks=[[359, 0.4]], marks=[{"who": "lucas", "at": H["lucas_bins"], "view": "side walking -> front", "pose": "walks f346-378, stands by the tubs", "expr": "smile -> shock"},
                            {"who": "fiance", "at": H["fiance"], "view": "front", "pose": "standing, pats tub 3 f400-418", "expr": "grin"}],
  subjects=[{"n": "tubs", "p": BIN_TOP, "f": [380, 653]}, {"n": "fiance head", "p": [H["fiance"][0], 1.6, H["fiance"][1]], "f": [380, 420]}],
  physics="Lids (0.6 kg): pop up 6 cm, tip back and slide down to lean against each tub's side, rest.",
  light_mood="golden.", sound="three plastic snaps f359, f367, f374; a whoosh per rising pack; Wowww on the last pack f570.", after="The tubs stay open; the four packs stand on the rim.")

CHORUS_PT = [-2.1, 1.1, 0.6]
scene(id="S04", f=[654, 760], set="home", light="golden",
  vo="Ai cũng bảo, bán đồ Pokémon cũ thì dễ như ăn kẹo.", gloss="Everyone said selling old Pokémon stuff is as easy as eating candy.",
  spine=3, viewer="Friends on the sofa: easy money.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S03"}, "out": {"type": "dissolve", "to": "S05", "n": 8}},
  build="new: sofa, coffee table with a candy bowl.", blocking="Three friends seated on the sofa, front view.",
  action="f668 they all laugh on 'cũng bảo'; f683-720 the middle one waves it off; f730-746 each takes a candy from the bowl and pops it in on 'kẹo' (f746).",
  acting="Laughing, smug, carefree.",
  cams=[k(654, [0.2, 1.2, 1.9], [-2.0, 0.95, 0.6], 40, push=0.002, blur=6, focus=CHORUS_PT, why="the chorus, low and close")],
  kicks=[], marks=[{"who": "chorus", "at": H["chorus"][1], "view": "front seated", "pose": "laugh, candy to mouth f746", "expr": "laugh -> grin"}],
  subjects=[{"n": "chorus", "p": CHORUS_PT, "f": [654, 759]}],
  physics="none.", light_mood="golden.", sound="Emoji Laugh f668; candy crunch f748.", after="They chew.")

HALL_LUCAS = [HA["lucas"][0], 1.62, HA["lucas"][1]]
scene(id="S05", f=[760, 882], set="hall", light="day",
  vo="Thế là Lucas xếp hàng một tiếng rưỡi ở hội chợ thẻ bài,", gloss="So Lucas queued for an hour and a half at a card show,",
  spine=3, viewer="He waits in a long queue to sell; the clock spins 90 minutes.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S04"}, "out": {"type": "dissolve", "to": "S06", "n": 6}},
  build="new: the card-show hall: queue, booth, vendor tables, banner, big clock; Lucas's hand truck with the tubs.",
  blocking="Seven buyers and Lucas in a line along z 0.5 facing -x (side view); Lucas last, his hand truck behind him.",
  action="f780-860 the clock spins 90 minutes (title 90 PHÚT); f800, f830 the line shuffles forward 0.3 m each time (two steps), Lucas drags the truck after; f862 he pulls out his phone.",
  acting="Lucas bored, sighing.",
  cams=[k(760, [4.8, 2.0, 5.2], [-0.4, 1.6, -1.0], 46, push=0.0015, blur=4, focus=[0.0, 1.5, 0.5], why="the long line under the clock"),
        k(848, [3.2, 1.6, 2.7], [1.2, 1.35, 0.4], 36, glide=30, push=0.002, blur=8, focus=HALL_LUCAS, why="Lucas takes his phone out")],
  kicks=[], marks=[{"who": "lucas", "at": HA["lucas"], "view": "side facing -x", "pose": "waits, shuffles f800, f830, phone out f862", "expr": "dazed"}],
  subjects=[{"n": "clock", "p": HA["clock"], "f": [780, 840]}, {"n": "lucas head", "p": HALL_LUCAS, "f": [760, 881]}],
  physics="none.", light_mood="flat convention-hall day light.", sound="crowd murmur; clock ticks f780-860; shuffles.", after="Lucas holds his phone.")

PHONE_H = HA["phone"]
scene(id="S06", f=[882, 1024], set="hall", light="day",
  vo="nhắn cho cả chục người làm video. Ai cũng hứa mua. Rồi biến mất, như chưa từng quen.",
  gloss="messaged a dozen video creators. Every one promised to buy. Then vanished, as if they'd never met.",
  spine=3, viewer="A dozen promises on his phone, then every one of them ghosts him.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S05"}, "out": {"type": "dissolve", "to": "S07", "n": 8}},
  build="new: Lucas's phone (POV): a chat list of 12 creators.", blocking="POV from Lucas's eyes (he is not drawn).",
  action="f884-912 twelve messages send, rows tick one by one; f918-948 green replies pop in on every row: I'LL BUY IT!; f965-1012 one by one the avatars turn into little ghosts and the rows grey out to 'Seen'.",
  acting="none (POV).",
  cams=[k(882, [1.5, 1.73, 0.6], PHONE_H, 26, push=0.0012, blur=6, focus=PHONE_H, why="his phone, from his eyes"),
        k(960, [1.43, 1.65, 0.57], PHONE_H, 22, glide=24, push=0.0015, blur=6, focus=PHONE_H, why="closer on the ghosts")],
  kicks=[], marks=[], subjects=[{"n": "phone", "p": PHONE_H, "f": [882, 1023]}],
  physics="none.", light_mood="day; the phone screen is emissive.", sound="message whoosh x12; Discord Notification per reply f918-948; a Crow caw f1000.", after="Every chat says Seen.")

PHONE_T = [H["phone"][0], TY + 0.01, H["phone"][2]]
scene(id="S07", f=[1024, 1150], set="home", light="golden",
  vo="Mãi đến cuối tháng chín, mới có một tay buôn thẻ ở Los Angeles trả lời.",
  gloss="Not until the end of September did a card dealer in Los Angeles reply.",
  spine=4, viewer="Months pass; at last one dealer answers.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S06"}, "out": {"type": "dissolve", "to": "S08", "n": 6}},
  build="reuse the calendar (pages tear off), the phone lying on the table.", blocking="Nobody in frame.",
  action="f1030-1062 calendar pages tear off: THÁNG 6, 7, 8, landing on THÁNG 9 with 30 circled (title 30 · 09); f1085 glide down to the phone on the table; f1124 it buzzes and lights: LA DEALER · 'I'll take all of it. Coming tomorrow.'",
  acting="none.",
  cams=[k(1024, [-0.3, 1.55, -0.4], H["calendar"], 34, push=0.0015, blur=6, focus=H["calendar"], why="the calendar"),
        k(1076, [-0.05, 1.22, -0.4], PHONE_T, 30, glide=48, push=0.0018, blur=8, focus=PHONE_T, why="the phone lights up")],
  kicks=[], marks=[], subjects=[{"n": "calendar", "p": H["calendar"], "f": [1024, 1080]}, {"n": "phone", "p": PHONE_T, "f": [1110, 1149]}],
  physics="Calendar pages (paper, 3 g): peel from the top, flutter down out of frame.",
  light_mood="golden.", sound="paper tears x3; phone buzz f1124 (Phone Alert).", after="The phone shows the dealer's reply.")

scene(id="S08", f=[1150, 1247], set="home", light="golden",
  vo="Cân xong, anh ta chuyển khoản gần mười bảy nghìn đô.", gloss="Done weighing, he transferred almost seventeen thousand dollars.",
  spine=4, viewer="He finishes, sends the money, Lucas grins.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S07"}, "out": {"type": "dissolve", "to": "S09", "n": 6}},
  build="reuse the hook set-up; the dealer's phone; Lucas's phone on the table.",
  blocking="Dealer seated at his mark; Lucas standing at his mark.",
  action="f1151-1166 the dealer lifts the last pack off the scale onto the done stack; f1189 he taps his phone ('chuyển khoản'); f1211 Lucas's phone on the table lights TRANSFER RECEIVED and Lucas grins (title ~$17,000).",
  acting="Dealer flat; Lucas relieved grin.",
  cams=[k(1150, [-0.05, 1.45, 2.5], [-0.1, 1.1, -1.1], 42, push=0.0015, blur=6, focus=[0.0, 1.1, -1.1], why="both men and the table"),
        k(1198, [-0.1, 1.25, 0.45], [-0.25, 1.0, -0.75], 34, glide=22, push=0.002, blur=8, focus=PHONE_T, why="the money lands")],
  kicks=[], marks=[{"who": "dealer", "at": H["dealer"], "view": "front seated", "pose": "last pack f1151, taps phone f1189", "expr": "neutral"},
                  {"who": "lucas", "at": H["lucas"], "view": "front", "pose": "standing", "expr": "neutral -> grin f1211"}],
  subjects=[{"n": "lucas head", "p": LUCAS_HEAD, "f": [1150, 1196]}, {"n": "phone", "p": PHONE_T, "f": [1215, 1246]}],
  physics="none.", light_mood="golden.", sound="Kaching f1211.", after="Paid; the packs are the dealer's.")

scene(id="S09", f=[1247, 1336], set="home", light="golden",
  vo="Thứ Hai tuần sau, anh ta đòi lại tiền,", gloss="The next Monday, he demanded the money back,",
  spine=5, viewer="Days later, a message: he wants his money back. Lucas's jaw drops.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S08"}, "out": {"type": "dissolve", "to": "S10", "n": 6}},
  build="reuse; the calendar now reads THỨ HAI.", blocking="Lucas standing at his mark, phone in hand (front view, holding it up to read).",
  action="f1250 the phone buzzes in his hand; f1262 he lifts it to read; f1295 on 'đòi lại tiền' his jaw drops (gape 0.7) and holds.",
  acting="Calm -> shock.",
  cams=[k(1247, [-0.2, 1.5, 1.6], [-0.5, 1.4, -0.6], 36, push=0.002, punch=[0.006, 20], blur=8, focus=LUCAS_HEAD, why="push on the shock")],
  kicks=[[1295, 0.5]], marks=[{"who": "lucas", "at": H["lucas"], "view": "front", "pose": "holds phone up", "expr": "neutral -> shock f1295"}],
  subjects=[{"n": "lucas head", "p": LUCAS_HEAD, "f": [1247, 1335]}],
  physics="none.", light_mood="golden.", sound="Phone Alert f1250; record scratch hit f1295.", after="He reads on.")

PHONE_EYE = [H["lucas"][0], 1.55, H["lucas"][1] + 0.02]
PHONE_HELD = [H["lucas"][0] + 0.02, 1.2, H["lucas"][1] - 0.32]
scene(id="S10", f=[1336, 1415], set="home", light="golden",
  vo="vì tưởng mình mua được bản in hiếm Shadowless.", gloss="because he thought he'd bought the rare Shadowless print.",
  spine=5, viewer="His reason, on the phone: he thought these were Shadowless.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S09"}, "out": {"type": "cut", "to": "S11"}},
  build="reuse the phone (POV): the dealer's message with a photo of the real Base Set Charizard.", blocking="POV from Lucas's eyes (not drawn).",
  action="f1340 the message is open: a photo of the Base Set Charizard; f1360-1372 the words 'Thought these were SHADOWLESS. Refund.' type in, SHADOWLESS in red on 'Shadowless' (f1368).",
  acting="none.",
  cams=[k(1336, [H["lucas"][0] + 0.03, 1.56, H["lucas"][1] + 0.08], PHONE_HELD, 26, push=0.0015, blur=6, focus=PHONE_HELD, why="the message from his eyes")],
  kicks=[], marks=[], subjects=[{"n": "phone", "p": PHONE_HELD, "f": [1336, 1414]}],
  physics="none.", light_mood="golden; screen emissive.", sound="typing ticks; Realization Sound f1368.", after="The refund demand.")

scene(id="S11", f=[1415, 1528], set="home", light="golden", dim=0.82,
  vo="Khoan, cân từng gói suốt hai tiếng, giờ mới nghĩ ra à?", gloss="Wait, he weighed every pack for two hours, and only now thought of it?",
  spine=5, viewer="Replay: the two hours of weighing. He had every chance to check.",
  **{"in": {"type": "cut", "from": "S10"}, "out": {"type": "dissolve", "to": "S12", "n": 8}},
  build="reuse the hook frame in memory light (grey-warm).", blocking="Dealer seated weighing at his mark.",
  action="f1415 hard cut on 'Khoan'; f1430-1470 the clock behind him spins two hours again, a pack on and off the scale twice; f1480-1512 push in on his squint with the loupe; f1511 on 'à?' he freezes mid-squint.",
  acting="Dealer: absorbed, oblivious.",
  cams=[k(1415, HOOK_DEAL["pos"], HOOK_DEAL["look"], 40, cut=True, push=0.002, blur=6, focus=DEALER_HEAD, why="the same frame as the hook"),
        k(1472, [0.4, 1.32, 0.35], [0.4, 1.3, -1.45], 30, glide=34, push=0.003, blur=10, focus=[0.35, 1.32, -1.45], why="push on the squint")],
  kicks=[[1415, 0.6]], marks=[{"who": "dealer", "at": H["dealer"], "view": "front seated", "pose": "weighing, then loupe", "expr": "stern"}],
  subjects=[{"n": "dealer head", "p": DEALER_HEAD, "f": [1415, 1527]}, {"n": "clock", "p": CLOCK, "f": [1430, 1465]}],
  physics="none.", light_mood="the hook's light, dimmed 0.82 and desaturated: a memory.", sound="Huh f1415; fast ticking f1430-1470; a held beat f1511.", after="Freeze on the squint.")

DR = ST["drive"]; DX = ST["drive_x"]
scene(id="S12", hero=True, f=[1528, 1662], set="street", light="golden", dim=0.86,
  vo="Thế là Lucas lái xe xuyên Los Angeles, ôm một phong bì ba nghìn rưỡi đô tiền mặt,",
  gloss="So Lucas drove across Los Angeles, holding an envelope of three and a half thousand dollars in cash,",
  spine=6, viewer="He drives across LA at dusk with the cash.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S11"}, "out": {"type": "dissolve", "to": "S13", "n": 6}},
  build="new: the boulevard: road, palms, lamps, shop fronts, the LOS ANGELES gantry; Lucas's hatchback with Lucas at the wheel.",
  blocking="Lucas seated in the driver's seat (front view through the side window).",
  action="f1530-1658 the hatchback drives from x -30 to x +30 (smootherstep: pulls away, cruises, slows), passing under the LOS ANGELES sign at f1594 ('Los Angeles' f1581); the camera tracks alongside, low, palms sweeping past in the foreground; title $3,500 f1636.",
  acting="Lucas grim, both hands on the wheel.",
  cams=[k(1528, [DX[0] - 3.0, 1.3, 12.5], [DX[0] + 0.5, 2.6, ST["car_z"]], 36, push=0.0, blur=4, focus=[DX[0], 1.2, ST["car_z"]], why="the car pulls away"),
        k(1530, [DX[1] - 3.0, 1.3, 12.5], [DX[1] + 0.5, 2.6, ST["car_z"]], 36, glide=DR[1] - DR[0], push=0.0, blur=4, focus=[DX[1], 1.2, ST["car_z"]], why="track the car under the sign")],
  kicks=[], marks=[{"who": "lucas", "at": [DX[0], ST["car_z"]], "view": "front seated in the car", "pose": "driving", "expr": "stern"}],
  subjects=[{"n": "car", "p": [0.0, 1.0, ST["car_z"]], "f": [1593, 1595]}, {"n": "sign", "p": [0.0, 5.6, -1.0], "f": [1590, 1595]}],
  physics="none (the car follows the glide curve; wheels spin at the matching rate).",
  light_mood="golden dusk over LA, pink sky, dimmed 0.86; lamps lit.", sound="engine hum, city traffic; a low synth pulse.", after="The car reaches the lot.")

MEET = [46.0, 1.15, 1.4]
scene(id="S13", hero=True, f=[1662, 1814], set="street", light="golden", dim=0.8,
  vo="ra một bãi đỗ xe như phim buôn lậu, chỉ để mua lại chính số thẻ mình vừa bán.",
  gloss="to a parking lot like a smuggling movie, just to buy back the very cards he had just sold.",
  spine=6, viewer="A shady handover under one lamp: his cash for his own cards.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 8}},
  build="new: the lot (lines, one sodium lamp), both cars nose to nose, headlights on; envelope; box of packs.",
  blocking="Lucas (shades, envelope) at his mark, the dealer (shades, box in both hands) at his; both front view; they step together f1700-1722.",
  action="f1700-1722 both step in to their meet marks; f1736-1748 Lucas holds the envelope out; f1751 the dealer takes it (on 'mua lại'), thumbs the bills f1754-1764; f1766-1780 he pushes the box into Lucas's arms ('số thẻ'); f1790-1812 Lucas hugs the box, the dealer pockets the envelope.",
  acting="Both stone-faced in sunglasses; Lucas glum.",
  cams=[k(1662, [46.0, 0.55, 7.2], [46.0, 1.3, 0.6], 38, push=0.0015, blur=4, focus=MEET, why="low wide: two cars, two men, one lamp"),
        k(1730, [46.0, 1.1, 5.4], [46.0, 1.2, 1.4], 36, glide=28, push=0.002, blur=10, focus=MEET, why="the exchange"),
        k(1784, [45.6, 1.3, 3.9], [45.7, 1.3, 1.4], 32, glide=24, push=0.002, blur=10, focus=[45.45, 1.5, 1.4], why="Lucas with his own cards")],
  kicks=[[1751, 0.4]], marks=[{"who": "lucas", "at": ST["lucas_meet"], "view": "front", "pose": "envelope out f1736, takes box f1766", "expr": "stern -> sad"},
                             {"who": "dealer", "at": ST["dealer_meet"], "view": "front", "pose": "takes envelope f1751, hands box f1766", "expr": "stern"}],
  subjects=[{"n": "meet", "p": MEET, "f": [1662, 1784]}, {"n": "lucas head", "p": [ST["lucas_meet"][0], 1.62, ST["lucas_meet"][1]], "f": [1800, 1813]}],
  physics="Envelope (0.1 kg) and box (2 kg) are carried; nothing falls.",
  light_mood="dusk, dimmed 0.8; the sodium lamp and both cars' headlights glow.", sound="Suspicious Sound f1713; car idle; paper rustle f1754.", after="Lucas has the box back.")

SHOP_C = [SH["clerk"][0], 1.6, SH["clerk"][1]]
scene(id="S14", f=[1814, 1996], set="shop", light="day",
  vo="Rồi đem đến một tiệm khác. Tiệm quét căn cước, nghi anh đi bán đồ ăn cắp, rồi viết sai tên anh trên tấm séc.",
  gloss="Then took it to another shop. The shop scanned his ID, suspected he was selling stolen goods, then wrote his name wrong on the check.",
  spine=7, viewer="Another shop treats him like a thief and misspells his name on the check.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S13"}, "out": {"type": "dissolve", "to": "S15", "n": 8}},
  build="new: the card shop: counter with glass case, ID scanner, shelves, WE BUY CARDS sign, the check.",
  blocking="Lucas walks in (side view, -x) carrying the box f1816-1846, sets it on the counter f1847; the clerk stands behind the counter.",
  action="f1859 Lucas slides his ID card across; f1874-1886 the clerk passes it over the scanner: a red laser line sweeps, beep ('quét căn cước'); f1894 on 'nghi' the clerk narrows his eyes at Lucas, then at the box (f1914) and back (f1926); Lucas sweats; f1940 top-down on the check: the clerk's pen writes 'Lukas DeRiter' f1947-1980 on 'viết sai tên anh'.",
  acting="Clerk suspicious, stern; Lucas nervous.",
  cams=[k(1814, [1.7, 1.55, 2.3], [0.5, 1.15, -0.8], 40, push=0.0015, blur=4, focus=[0.6, 1.1, -0.6], why="Lucas brings the box in"),
        k(1862, [0.35, 1.3, 0.65], [-0.15, 1.05, -0.95], 32, glide=20, push=0.002, blur=8, focus=SH["scanner"], why="the ID under the scanner"),
        k(1886, [0.2, 1.5, 1.7], [0.1, 1.35, -0.8], 36, glide=22, push=0.002, blur=8, focus=SHOP_C, why="suspicion: both faces"),
        k(1936, [0.0, 1.32, -0.42], SH["check"], 32, glide=26, push=0.002, blur=8, focus=SH["check"], why="the misspelt name")],
  kicks=[], marks=[{"who": "lucas", "at": SH["lucas"], "view": "side walking -> front", "pose": "box on the counter f1847, ID across f1859", "expr": "neutral -> nervous"},
                  {"who": "clerk", "at": SH["clerk"], "view": "front", "pose": "scans ID f1874, stares f1894, writes f1947", "expr": "neutral -> stern"}],
  subjects=[{"n": "clerk head", "p": SHOP_C, "f": [1906, 1935]}, {"n": "check", "p": SH["check"], "f": [1950, 1995]}],
  physics="none.", light_mood="flat shop day light.", sound="door chime f1816; box thump f1847; Computer Error Sound f1880; pen scratch f1947-1980; Huh5544? no: a single Bruh f1983.", after="The check with the wrong name.")

CAL = H["calendar"]
scene(id="S15", f=[1996, 2052], set="home", light="golden",
  vo="Tổng cộng tám tháng.", gloss="Eight months in total.",
  spine=7, viewer="Eight months, page by page.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S14"}, "out": {"type": "dissolve", "to": "S16", "n": 6}},
  build="reuse the calendar.", blocking="Nobody.",
  action="f2000-2044 eight pages tear off the calendar one after another (every 5-6 f) on 'tám tháng' (title 8 THÁNG).",
  acting="none.",
  cams=[k(1996, [-0.3, 1.55, -0.55], CAL, 32, push=0.003, blur=6, focus=CAL, why="the calendar")],
  kicks=[], marks=[], subjects=[{"n": "calendar", "p": CAL, "f": [1996, 2051]}],
  physics="Pages flutter down.", light_mood="golden.", sound="eight paper rips, a Sad Violin phrase starts f2010.", after="Eight months gone.")

SEAT_L = [H["lucas_seat"][0], 1.3, H["lucas_seat"][1]]; SEAT_F = [H["fiance_seat"][0], 1.28, H["fiance_seat"][1]]
scene(id="S16", f=[2052, 2196], set="home", light="golden",
  vo="Bên bữa pizza, vợ sắp cưới của anh nói: \"Lẽ ra mình không nên làm chuyện này.\"",
  gloss="Over pizza, his fiancée said: \"We shouldn't have done this.\"",
  spine=8, viewer="Over pizza, she regrets it.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S15"}, "out": {"type": "dissolve", "to": "S17", "n": 6}},
  build="reuse the table; open pizza box.", blocking="Lucas and his fiancée seated side by side behind the table, front view.",
  action="f2063 she lifts a slice, it droops; f2113 she turns to him ('nói'), sad; f2125-2188 her line (VO); Lucas lowers his slice f2150 and nods slowly.",
  acting="Both tired, a small rueful smile from her.",
  cams=[k(2052, [0.36, 1.32, 1.7], [0.36, 1.05, -1.3], 38, push=0.0015, blur=6, focus=[0.36, 1.1, -1.4], why="the two of them over pizza"),
        k(2112, [0.7, 1.3, 0.55], [0.62, 1.22, -1.5], 32, glide=30, push=0.0015, blur=10, focus=SEAT_F, why="her line")],
  kicks=[], marks=[{"who": "fiance", "at": H["fiance_seat"], "view": "front seated", "pose": "slice f2063, turns f2113", "expr": "smile_closed -> sad"},
                  {"who": "lucas", "at": H["lucas_seat"], "view": "front seated", "pose": "slice, lowers it f2150", "expr": "sad"}],
  subjects=[{"n": "fiance head", "p": SEAT_F, "f": [2052, 2195]}, {"n": "lucas head", "p": SEAT_L, "f": [2052, 2110]}],
  physics="The slice droops (cheese sag).", light_mood="golden, warm lamp.", sound="the violin phrase continues softly; room tone.", after="They sit.")

LAP = [H["laptop"][0], TY + 0.2, H["laptop"][2] - 0.02]
scene(id="S17", f=[2196, 2326], set="home", light="golden",
  vo="Còn Lucas viết rằng, chẳng số tiền nào đáng để trải qua chuyện đó.",
  gloss="And Lucas wrote that no amount of money is worth going through that.",
  spine=8, viewer="Lucas writes his verdict.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S16"}, "out": {"type": "dissolve", "to": "S18", "n": 6}},
  build="reuse the laptop (POV over his eyes): a plain post page.", blocking="POV from Lucas's seat (not drawn).",
  action="f2216-2310 the line types letter by letter: 'No amount of money is worth going through that.'; f2316 POST is clicked (button presses).",
  acting="none.",
  cams=[k(2196, [H["lucas_seat"][0] + 0.06, 1.3, H["lucas_seat"][1] - 0.18], LAP, 30, push=0.0018, blur=6, focus=LAP, why="his screen from his seat")],
  kicks=[], marks=[], subjects=[{"n": "laptop", "p": LAP, "f": [2196, 2325]}],
  physics="none.", light_mood="golden; screen emissive.", sound="keyboard clicks f2216-2310; a click f2316.", after="Posted.")

scene(id="S18", hero=True, f=[2326, 2430], set="home", light="golden",
  vo="Dễ như ăn kẹo. Kẹo đá.", gloss="Easy as eating candy. Rock candy.",
  spine=9, viewer="He bites a rock candy and nearly breaks a tooth: it was never easy.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S17"}, "out": {"type": "end"}},
  build="reuse; the bowl of rock-candy sticks.", blocking="Lucas and the fiancée seated; Lucas takes a stick from the bowl.",
  action="f2330 'Dễ' he takes a rock-candy stick; f2350 'kẹo' it goes to his mouth, smug little smile; f2362 'Kẹo'; f2381 'đá' he bites: CRACK, kick, stars around his head, eyes squeeze shut (pained), a crystal chip flies off and lands on the table; the fiancée flinches (shock). Hold to the end.",
  acting="Smug -> pain; her shock.",
  cams=[k(2326, [0.36, 1.32, 1.5], [0.36, 1.15, -1.4], 36, push=0.0015, blur=6, focus=SEAT_L, why="both at the table"),
        k(2362, [0.05, 1.36, 0.45], [0.05, 1.32, -1.5], 30, glide=16, push=0.002, punch=[0.008, 16], blur=10, focus=SEAT_L, why="push on the bite")],
  kicks=[[2381, 1.0]], marks=[{"who": "lucas", "at": H["lucas_seat"], "view": "front seated", "pose": "candy to mouth f2350, bite f2381", "expr": "smile -> pained"},
                             {"who": "fiance", "at": H["fiance_seat"], "view": "front seated", "pose": "flinches f2383", "expr": "neutral -> shock"}],
  subjects=[{"n": "lucas head", "p": SEAT_L, "f": [2326, 2429]}],
  physics="The crystal chip (2 g): pops off up-left at 1.2 m/s, falls to the table, bounces once, rests.",
  light_mood="golden.", sound="crunch / Bone Crack f2381; a cartoon 'boing' tail; music out.", after="End on his pained face.")

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(S), "scenes")
