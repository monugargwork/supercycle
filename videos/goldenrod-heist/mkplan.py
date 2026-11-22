"""Generator of plan.json for the Goldenrod heist reel. The plan is the source of truth: change it here, then
python3 videos/goldenrod-heist/mkplan.py && python3 scripts/plan_check.py videos/goldenrod-heist/plan.json"""
import json, os, math
def k(f, pos, look, fov, glide=None, cut=False, push=0.002, punch=None, blur=6, focus=None, why=""):
    d = dict(f=f, pos=[round(v, 3) for v in pos], look=[round(v, 3) for v in look], fov=fov, roll=0, push=push, blur=blur, why=why)
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    if focus: d["focus"] = [round(v, 3) for v in focus]
    return d

# ---------------- the highway route (set-local metres; the van drives the right lane) ----------------
CTRL = [(-200, 0), (-40, 0), (-18, 5), (0, 18), (14, 38), (30, 56), (55, 70), (90, 77), (150, 80)]
def _cr(p0, p1, p2, p3, t):
    return tuple(0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t * t + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t ** 3) for i in range(2))
_P = [CTRL[0]] + CTRL + [CTRL[-1]]; ROUTE = []
for i in range(1, len(_P) - 2):
    n = max(1, int(math.dist(_P[i], _P[i + 1]) / 2.0))
    for j in range(n): ROUTE.append(_cr(_P[i - 1], _P[i], _P[i + 1], _P[i + 2], j / n))
ROUTE.append(CTRL[-1]); ROUTE = [[round(x, 2), round(z, 2)] for x, z in ROUTE]
_D = [0.0]
for a, b in zip(ROUTE, ROUTE[1:]): _D.append(_D[-1] + math.dist(a, b))
LANE = 1.75
def along(s, lane=LANE):
    """point (x, z) at distance s along the route, shifted to the right lane, and the unit tangent"""
    s = max(0, min(_D[-1] - 1e-6, s)); i = max(0, next(j for j in range(len(_D) - 1) if _D[j + 1] >= s))
    u = (s - _D[i]) / (_D[i + 1] - _D[i]); a, b = ROUTE[i], ROUTE[i + 1]; tx, tz = b[0] - a[0], b[1] - a[1]; L = math.hypot(tx, tz); tx, tz = tx / L, tz / L
    return [a[0] + u * (b[0] - a[0]) - tz * lane, a[1] + u * (b[1] - a[1]) + tx * lane], [tx, tz]
def glide_u(x):
    x = max(0, min(1, x)); return x * x * x * (x * (6 * x - 15) + 10)

# van schedules (the build reads the same numbers): road distance d along the route
STOP_D = 153.0                       # the stop sign
DRIVE10 = dict(f=[761, 900], d=[88.0, STOP_D])     # S10: glide (the camera tracks with the same easing)
GO14 = dict(f0=1262, d0=STOP_D, a=1.5, vmax=22.0)  # S14: d = d0 + a t^2 (t s after f0), capped at vmax
def d14(f):
    t = max(0, (f - GO14["f0"]) / 30); tm = GO14["vmax"] / (2 * GO14["a"])
    return GO14["d0"] + (GO14["a"] * t * t if t < tm else GO14["a"] * tm * tm + GO14["vmax"] * (t - tm))
def d10(f): return DRIVE10["d"][0] + (DRIVE10["d"][1] - DRIVE10["d"][0]) * glide_u((f - DRIVE10["f"][0]) / (DRIVE10["f"][1] - DRIVE10["f"][0]))
PINGS = [1407, 1417, 1427, 1438, 1447]   # the phone touches a tower on these words
TOWERS = []
for i, f in enumerate(PINGS):
    (x, z), (tx, tz) = along(d14(f), 0); side = -1 if i % 2 else 1
    TOWERS.append([round(x - tz * 11 * side, 2), round(z + tx * 11 * side, 2)])
SPEEDCAM = [-52.5, 5.2]; STOPSIGN = [-44.2, 4.8]

# ---------------- layouts (set-local metres; the build reads these) ----------------
SW = 0.15   # sidewalk top
SHOP = dict(front=0.0, wall=0.25, room=[-5.75, 5.75, -8.0, -0.25], ceil=3.2, bldg_h=4.6,
            door=[-0.55, 0.55], door_h=2.2, pane_z=-0.12, windows=[[-5.2, -0.9], [0.9, 5.2]], win_y=[0.5, 2.6],
            sign=[0.0, 3.55, 0.07], sign_size=[5.2, 1.5], town=[2.4, 2.05, 3.5], town_size=[1.6, 0.8], sidewalk=[0.0, 4.0], sw_y=SW, road=[4.0, 12.0],
            lamps=[[-7.0, 3.7], [7.0, 3.7]], van=[-3.8, 5.4], van_yaw=0.0,
            case_x=-2.4, case_z=[-3.2, -4.6, -6.0, -7.4], case_len=1.0, case_dep=0.6, case_base=0.82, case_top=1.12,
            thief_x=-2.95, counter=[2.2, 2.8, -6.2, -3.6], counter_y=1.0, register=[2.5, 1.0, -4.4], till=[1.95, -4.4],
            backdoor=[0.3, 1.3], backdoor_h=2.1, trailer=[-2.6, -0.4, -16.8, -12.6], trailer_floor=0.5, trailer_roof=2.7,
            lock=[-1.5, 1.35, -12.53], cutter_b=[-2.0, -12.05], lot_lamp=[0.8, 2.6, -8.15], rooster=[2.4, 2.47, 3.5],
            hook={"A": [0.05, 0.95], "B": [-1.0, 1.7], "C": [0.95, 1.8], "D": [1.8, 2.6]}, glass_hit=[0.0, 1.25, -0.1],
            inside={"A": [1.3, -2.4], "B": [-1.0, -1.5], "C": [0.9, -1.9], "D": [-1.7, -0.9]},
            plateA=[[-1.5, -12.3], [0.8, -8.6]], plateC=[[0.8, -8.6], [-0.5, -12.2]])
ROAD = dict(route=ROUTE, lane=LANE, width=7.0, stop_d=STOP_D, stopsign=STOPSIGN, speedcam=SPEEDCAM, towers=TOWERS, tower_h=24.0,
            drive10=DRIVE10, go14=GO14, pings=PINGS, lakes=[[-24.0, -26.0, 15.0, 8.0], [6.0, -30.0, 11.0, 9.0]],
            farm=[-86.0, -22.0], walk=[[-66.5, 4.9], [-65.3, 4.9], [-64.1, 4.9]], walk_dx=2.4)
RENT = dict(room=[-3.2, 3.2, -2.4, 3.6], h=2.8, counter=[-1.8, -0.6, -0.95, -0.35], counter_y=1.05,
            clerk=[-1.2, -1.15], cust=[-1.05, -0.12], queue=[[-0.25, -0.75], [0.4, -1.35], [1.05, -1.9]],
            paper=[-1.15, 1.052, -0.7], paper_size=[0.32, 0.45], stamp_at=[-1.07, 1.06, -0.86], sign_at=[-1.2, 1.06, -0.55],
            archive_x=-3.2, drawers=[8, 4], drawer_w=0.5, drawer_h=0.55, archive_z=[-2.0, 2.0], drawer2026=[3, 2], clerk_arch=[-2.35, 0.35])
POL = dict(room=[-3.0, 3.0, -2.5, 3.0], h=2.8, board=[-0.95, 1.6, 0.95, 2.15], board_z=-2.44,
           slots={"cctv": [-0.62, 1.82], "rental": [-0.15, 1.82], "gps": [0.32, 1.82], "phone": [-0.62, 1.3], "prints": [-0.15, 1.3]},
           map=[1.05, 1.55], map_size=[0.9, 1.1], pin_justice=[1.13, 1.17], pin_twin=[0.98, 1.95], det_z=-2.16,
           desk=[-0.85, 0.85, 0.3, 0.9], desk_y=1.02, sarge=[0.0, 0.1], folders=[[-0.47, 0.45], [-0.235, 0.45], [0.0, 0.45], [0.235, 0.45], [0.47, 0.45]])
JUS = dict(street=[6.0, 13.0], sidewalk=[4.5, 6.0], house=[-8.0, 2.0, -9.0, -1.0], house_h=2.8, door_x=-3.2,
           garage=[2.0, 6.6, -7.5, -1.0], garage_h=2.6, gdoor=[2.4, 6.2], gdoor_h=2.2, drive=[2.4, 6.2, -1.0, 6.0],
           van=[3.3, 2.3], van_yaw=math.pi / 2, hedge=[-6.4, -3.8, 0.0, 0.8], hedge_h=1.0, tree=[-7.05, 2.4],
           jsign=[-11.0, 5.2], jsign_yaw=-0.52, cars=[[5.2, 8.6], [-0.6, 8.6]], cars_from=[26.0, 32.0],
           seeker=[-6.55, 2.75], hider=[-5.0, -0.4], cop1=[[7.2, 2.4], [5.2, -1.9]], slab_box=[5.45, 0.55, -2.6])

def vanpt(d): (x, z), _ = along(d); return [x, z]
V10a, V10b = vanpt(DRIVE10["d"][0]), vanpt(STOP_D)
WIN = lambda v: [v[0] + 0.9, 1.45, v[1] - 1.0]          # the driver's window (left side, heading +x)
CAMOFF = lambda v: [v[0] + 0.9, 1.55, v[1] - 5.0]        # the tracking camera beside it

P = {
 "fps": 30, "frames": 2370, "voice_end": 2336,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 6, "out": 52, "text": "2:00 AM", "style": 3, "from": "top"},
  {"f": 298, "out": 342, "text": "TWIN LAKES, WISCONSIN", "style": 3, "from": "top"},
  {"f": 680, "out": 724, "text": "$310,000+", "style": 3, "from": "top"},
  {"f": 952, "out": 1008, "text": "CHRYSLER PACIFICA", "style": 3, "from": "top"},
  {"f": 1808, "out": 1852, "text": "JUSTICE, ILLINOIS", "style": 3, "from": "top"}],
 "cards": {"cases": "neo_lugia, neo_typhlosion, neo_hooh, neo_pichu (Johto: Goldenrod City), zard_base, blastoise, venusaur, pikachu, fs_dragonite, fs_zapdos",
           "slabs": "lc_gengar, dx_latios_star, neo_lugia, zard_base (case 2 and the garage)", "sticker": "neo_lugia slab with the GOLDENROD price sticker (S20)"},
 "shop": SHOP, "road": ROAD, "rent": RENT, "pol": POL, "jus": JUS,
 "sets": {
  "shop": {"origin": [0, 0, 0], "axes": "+z toward the street; the storefront on z 0, the shop behind it (z -8..0), the back lot and trailer beyond (z < -8)",
   "light": "night", "sun": [-35, 30], "open_sides": "+z street, the aisle inside",
   "objects": [
    {"id": "front", "build": "new: brick storefront x -6..6, 4.6 m, door 1.1 x 2.2 (glass pane, aluminium frame), two shop windows; neighbours either side", "pos": [0, 2.3, -0.12], "size": [12, 4.6, 0.25]},
    {"id": "sign", "build": "new: lit sign band 5.2 x 1.5 m: GOLDENROD CITY / COLLECTIBLES (plain bold lettering), POKÉMON · TCG · GRADED CARDS", "pos": SHOP["sign"], "size": [5.2, 1.5, 0.1]},
    {"id": "town", "build": "new: green road sign 1.6 x 0.8 on two posts: TWIN LAKES / WISCONSIN (the rooster perches on it at dawn)", "pos": SHOP["town"], "size": [1.6, 0.8, 0.05]},
    {"id": "cases", "build": "new: four glass display cases in a row down the left aisle (1.5 m long, 0.6 deep, wood base to 0.82, glass box to 1.12, LED strip); real scans and slabs inside; the glass tops shatter (rigid-body shards)", "pos": [-2.4, 0.56, -4.4], "size": [0.6, 1.12, 7.0]},
    {"id": "counter", "build": "new: counter along the right aisle with a cash register (drawer slides out); booster boxes on the shelves behind", "pos": [2.5, 0.5, -4.9], "size": [0.6, 1.0, 2.6]},
    {"id": "trailer", "build": "new: white enclosed cargo trailer 2.2 x 4.2 x 2.2 on two axles, rear barn doors with a hasp and a brass padlock (bolt cutters snap it: rigid-body fall); stacked boxes inside", "pos": [-1.5, 1.6, -12.7], "size": [2.2, 2.2, 4.2]},
    {"id": "van", "build": "new: white minivan 5.2 x 2.0 x 1.78 (sliding doors, dark glass, RENTAL barcode stickers on the rear side windows and the rear window, plate frame RENT-A-CAR), lights", "pos": [-3.4, 0.9, 5.4], "size": [5.2, 1.78, 2.0]}],
   "marks": {"A": SHOP["hook"]["A"], "B": SHOP["hook"]["B"]}},
  "road": {"origin": [400, 0, 0], "axes": "the highway from x -200 along +x, bending north (+z) after x -40; fields, two lakes, cell towers",
   "light": "night", "sun": [-20, 26], "open_sides": "all",
   "objects": [
    {"id": "road", "build": "new: two-lane asphalt ribbon 7 m wide along the route (dashed centre line, white edges)", "pos": [0, 0, 0], "size": [350, 0, 7]},
    {"id": "stop", "build": "new: octagonal STOP sign on a post", "pos": [STOPSIGN[0], 1.9, STOPSIGN[1]], "size": [0.75, 0.75, 0.04]},
    {"id": "speedcam", "build": "new: roadside speed camera: grey post 2.5 m, camera box with a flash lens toward the oncoming lane", "pos": [SPEEDCAM[0], 1.25, SPEEDCAM[1]], "size": [0.3, 2.5, 0.3]},
    {"id": "towers", "build": f"new: five lattice cell towers {24} m (tapered frame, antenna panels, a top lamp that lights on the ping)", "pos": [TOWERS[0][0], 12, TOWERS[0][1]], "size": [2, 24, 2]},
    {"id": "trail", "build": "new: the GPS memory: a gold emissive ribbon 1.2 m wide drawn on the right lane behind the van", "pos": [0, 0.04, 0], "size": [1.2, 0, 1]}],
   "marks": {}},
  "rent": {"origin": [800, 0, 0], "axes": "the counter across x, the clerk behind it (z -1.15), customers on the +z side; the archive drawers on the -x wall",
   "light": "day", "sun": [-40, 45], "open_sides": "+z",
   "objects": [
    {"id": "counter", "build": "new: rental counter 1.2 x 0.6, top y 1.05; a monitor, a key tray; CAR RENTAL letters and a key board on the back wall; the queue lines up along its right end toward the back", "pos": [-1.2, 0.52, -0.65], "size": [1.2, 1.05, 0.6]},
    {"id": "paper", "build": "new: RENTAL AGREEMENT (1.5x A4 so it reads): VEHICLE WHITE MINIVAN, a signature line, the APPROVED stamp", "pos": RENT["paper"], "size": [0.32, 0.002, 0.45]},
    {"id": "archive", "build": "new: wall of 32 grey archive drawers (8 x 4) labelled by year 1999..2026; the 2026 drawer slides out", "pos": [-3.15, 1.2, 0], "size": [0.1, 2.2, 4.0]}],
   "marks": {"clerk": RENT["clerk"], "A": RENT["cust"]}},
  "pol": {"origin": [1200, 0, 0], "axes": "the evidence board on the back wall z -2.44; the booking desk in the front (z 0.5..1.0) facing +z",
   "light": "day", "sun": [-30, 45], "open_sides": "+z",
   "objects": [
    {"id": "board", "build": "new: cork board 2.55 x 1.2 m with five evidence slots and a portrait map of the WI/IL line (Twin Lakes, Justice, the gold route); red string", "pos": [0.33, 1.55, -2.46], "size": [2.55, 1.2, 0.03]},
    {"id": "desk", "build": "new: booking counter 1.7 x 0.5, top 1.02; five charge folders with mugshots (generic faces), stamps CHARGED / ARRESTED / WANTED", "pos": [0, 0.51, 0.75], "size": [1.7, 1.02, 0.5]}],
   "marks": {"det": [-0.44, POL["det_z"]], "sarge": POL["sarge"]}},
  "jus": {"origin": [1600, 0, 0], "axes": "the street along x at z 6..13; the ranch house and garage face +z; the van in the driveway",
   "light": "golden", "sun": [-50, 14], "open_sides": "+z",
   "objects": [
    {"id": "house", "build": "new: ranch house x -8..2 with a gable roof, front door, windows; attached two-car garage x 2..6.6 with a sectional door that rolls up (loot on shelves inside)", "pos": [-1.0, 1.4, -5.0], "size": [14.6, 2.8, 8.0]},
    {"id": "van", "build": "reuse the white minivan, parked nose-in on the driveway", "pos": [3.3, 0.9, 2.3], "size": [2.0, 1.78, 5.2]},
    {"id": "jsign", "build": "new: wooden welcome sign VILLAGE OF JUSTICE (scales of justice carved) on two posts", "pos": [-11.0, 1.3, 5.2], "size": [1.7, 1.0, 0.08]},
    {"id": "cars", "build": "new: two police cruisers (white/navy, red-blue lightbar, emissive and flashing)", "pos": [-2.0, 0.7, 9.0], "size": [4.6, 1.5, 1.9]},
    {"id": "hedge", "build": "new: box hedge 2.6 x 0.8 x 1.0 in front of the house; a maple on the lawn", "pos": [-5.1, 0.5, 0.4], "size": [2.6, 1.0, 0.8]}],
   "marks": {"hider": JUS["hider"], "seeker": JUS["seeker"]}}},
 "cast": {
  "A": {"look": ["dark slate knit balaclava (eye holes)", "black hoodie"], "items": ["sledgehammer", "duffel", "buffet plate", "pen"], "views": ["front", "side walking", "driver"]},
  "B": {"look": ["balaclava", "green jacket"], "items": ["bolt cutters", "duffel"], "views": ["front"]},
  "C": {"look": ["balaclava", "maroon hoodie"], "items": ["claw hammer", "duffel", "empty buffet plate"], "views": ["front", "side walking"]},
  "D": {"look": ["balaclava", "grey jacket"], "items": ["crowbar", "cash"], "views": ["front", "side walking"]},
  "clerk": {"look": ["yellow polo with RENTAL on the chest", "dark hair"], "items": ["rubber stamp", "licence", "folder"], "views": ["front"]},
  "det": {"look": ["brown jacket", "tie", "grey hair"], "items": ["evidence sheets"], "views": ["front"]},
  "sarge": {"look": ["navy police uniform", "badge", "cap"], "items": ["folder", "rubber stamp"], "views": ["front"]},
  "cop": {"look": ["navy uniform", "cap", "badge"], "items": ["slab (S20)"], "views": ["front", "side"]},
  "rooster": {"look": ["white rooster, red comb"], "items": [], "views": ["side"]}},
 "scenes": []}

S = P["scenes"]
def scene(**kw): S.append(kw)
H = SHOP; HK = H["hook"]
def head(m, y0=0.0): return [m[0], y0 + 1.55, m[1]]
CASE = [[H["case_x"], H["case_top"], z] for z in H["case_z"]]

scene(id="S01", hero=True, f=[0, 120], set="shop", light="night",
  vo="Hai giờ sáng, bốn người đeo mặt nạ đập vỡ cửa kính một tiệm thẻ Pokémon,",
  gloss="Two in the morning, four masked men smash the glass door of a Pokémon card shop,",
  spine=1, viewer="From inside the dark shop: a sledgehammer through the glass door, four masks outside.",
  **{"in": {"type": "open on the act"}, "out": {"type": "glide", "to": "S02"}},
  build="new: the shop interior at night (case LEDs on), the glass door with its pane; outside the sidewalk under a sodium lamp.",
  blocking="A on the sidewalk 1 m from the door (hook A), B, C, D behind him (hook marks), all front view; after the smash they step in to the inside marks.",
  action="f0-40 A plants his feet, the sledgehammer hanging; f40-50 wind-up over his right shoulder, held f50-56; f60 contact on the glass (2 f before 'đập' f62): the pane bursts into ~40 rigid-body shards flying in toward the lens; f60-110 shards fall, skid and settle on the tile floor (they stay for the whole reel); f68-112 A, then B, C, D step through the empty frame into the shop; the camera pulls back and up into the aisle, the lit cases come into the foreground on 'tiệm thẻ Pokémon'.",
  acting="A: effort squint on the wind-up, a grin after; the others crouch-ready.",
  cams=[k(0, [0.15, 1.15, -2.3], [0.08, 1.35, 0.8], 50, push=0.0025, blur=6, focus=[0.05, 1.4, 0.95], why="through the glass door at the four masks"),
        k(72, [-0.9, 2.6, -7.0], [-1.2, 1.0, -1.5], 50, glide=40, push=0.0015, blur=4, focus=[-0.2, 1.3, -1.6], why="pull back into the shop as they come in")],
  kicks=[[60, 1.0]], marks=[{"who": w, "at": HK[w], "view": "front", "pose": "hook: A wind-up f40-56, strike f60; all step in f68-112", "expr": "effort -> grin"} for w in "ABCD"],
  subjects=[{"n": "A head", "p": head(HK["A"], SW), "f": [0, 66]}, {"n": "glass hit", "p": H["glass_hit"], "f": [0, 66]}, {"n": "B in", "p": head(H["inside"]["B"]), "f": [112, 119]}],
  physics="door shards: ~40 thin glass plates (2-12 cm, 2.5 kg/m2) released at f60 from the pane, velocity 1.5-3.5 m/s inward (-z) + spread, cannon-es 240 Hz against the floor; restitution 0.2, friction 0.6; they come to rest by f100.",
  light_mood="night blue; a warm sodium lamp outside, the case LEDs inside.", sound="silence and a hum; a swish f52; a huge glass crash f60 (the score hits); shard tinkles f66-100; footsteps on glass f70-110.",
  after="The door frame is empty; shards lie on the floor inside (S04, S05, S23).")

scene(id="S02", f=[120, 205], set="shop", light="night",
  vo="mang theo kìm cộng lực, và một chiếc xe đi thuê.",
  gloss="carrying bolt cutters, and a rented car.",
  spine=1, viewer="Bolt cutters snap in B's hands; outside, a white minivan idles at the curb.",
  **{"in": {"type": "glide", "from": "S01"}, "out": {"type": "glide", "to": "S03"}},
  build="reuse the shop; the van parked at the curb, hazard lights.",
  blocking="B at his inside mark facing +z with the bolt cutters; A, C, D spread to the cases (inside marks).",
  action="f132-146 B lifts the bolt cutters to chest height and opens the handles, f150 he snaps them shut (jaws clack on 'kìm' f144-158); f160-200 the camera travels out through the empty door frame to the street: the white minivan idles at the curb, exhaust puffs, the RENTAL barcode sticker on its rear side window; f185 and f195 the hazard lights blink on 'xe đi thuê'.",
  acting="B: a menacing grin.",
  cams=[k(120, [-0.35, 1.45, -3.6], [-1.0, 1.35, -1.5], 38, glide=20, push=0.002, blur=10, focus=[-1.0, 1.45, -1.5], why="B and the bolt cutters"),
        k(150, [3.4, 1.9, 15.5], [-3.8, 1.0, 5.6], 46, glide=54, push=0.002, blur=4, focus=[-3.8, 1.0, 5.4], why="out the door to the van")],
  kicks=[[150, 0.4]], marks=[{"who": "B", "at": H["inside"]["B"], "view": "front", "pose": "bolt cutters up f132, snap f150", "expr": "grin"}],
  subjects=[{"n": "B head", "p": head(H["inside"]["B"]), "f": [120, 160]}, {"n": "van", "p": [-3.8, 1.0, 5.4], "f": [195, 204]}],
  physics="the cutter jaws: 3 f close, a 1 f rebound.", light_mood="night; the van's lights.", sound="a metallic clack f150; engine idle and a hazard tick f185, f195.",
  after="The van idles at the curb.")

scene(id="S03", f=[205, 345], set="shop", light="night",
  vo="Tiệm Goldenrod City Collectibles, thị trấn Twin Lakes, bang Wisconsin.",
  gloss="Goldenrod City Collectibles, in the village of Twin Lakes, Wisconsin.",
  spine=2, viewer="The lit sign GOLDENROD CITY COLLECTIBLES and the TWIN LAKES road sign; the sleepy main street.",
  **{"in": {"type": "glide", "from": "S02"}, "out": {"type": "glide", "to": "S04", "note": "travel back in through the right shop window"}},
  build="reuse: the storefront, the sign band, the TWIN LAKES sign, lamps, neighbours.",
  blocking="Nobody outside (the four are inside, seen as shadows in the window).",
  action="f205-250 the camera rises from the van up the storefront to the sign as it is named (f224-275); f290-345 it keeps rising over the street, the TWIN LAKES sign in frame on 'Twin Lakes' (f293); title TWIN LAKES, WISCONSIN.",
  acting="none.",
  cams=[k(205, [1.3, 2.4, 13.6], [0.6, 2.6, 0.0], 56, glide=45, push=0.0015, blur=3, focus=[0.6, 2.8, 0.0], why="the sign"),
        k(300, [-1.15, 2.45, 3.4], [-2.0, 1.35, -2.6], 50, glide=45, push=0.001, blur=4, focus=[-2.4, 1.1, -3.2], why="down to the window: the cases inside")],
  kicks=[], marks=[], subjects=[{"n": "sign", "p": H["sign"], "f": [240, 304]}, {"n": "town sign", "p": H["town"], "f": [240, 304]}, {"n": "case 1", "p": CASE[0], "f": [335, 344]}],
  physics="none.", light_mood="night; the sign glows warm gold.", sound="a night breeze, a far dog; the sign's neon buzz.",
  after="Unchanged.")

scene(id="S04", hero=True, f=[345, 398], set="shop", light="night",
  vo="Bốn tủ kính vỡ tan.",
  gloss="Four glass cases shattered.",
  spine=2, viewer="Four tools, four case tops, one per word.",
  **{"in": {"type": "glide", "from": "S03", "note": "through the right shop window"}, "out": {"type": "hold", "to": "S05"}},
  build="reuse the four cases (glass tops intact until struck).",
  blocking="A, B, C, D at the four cases (thief_x, the case z), front view, tools raised.",
  action="wind-ups 6 f before each strike; strikes f350 (A, 'Bốn' f352), f363 (B, 'tủ' f365), f369 (C, 'kính' f371), f377 (D, 'vỡ' f379): each glass top bursts into ~14 rigid-body shards that fall onto the cards and the floor; the LED strips flicker once.",
  acting="each: effort, then a grin.",
  cams=[k(345, [-1.3, 2.4, -0.5], [-3.0, 0.8, -5.3], 52, glide=14, push=0.002, blur=4, focus=CASE[1], why="the row of four cases")],
  kicks=[[350, 0.6], [363, 0.6], [369, 0.6], [377, 0.8]],
  marks=[{"who": w, "at": [H["thief_x"], H["case_z"][i]], "view": "front", "pose": "strike its case", "expr": "effort -> grin"} for i, w in enumerate("ABCD")],
  subjects=[{"n": f"case {i+1}", "p": CASE[i], "f": [372, 397]} for i in range(4)],
  physics="case shards: 14 per case, 2-8 cm, from the top at the strike point, down and outward 0.5-2 m/s; collide with the case base and the floor; rest by +40 f.",
  light_mood="night; LED glare in the glass.", sound="four glass crashes f350, f363, f369, f377, each a tone higher.",
  after="Four cases open, glass on the cards and the floor.")

scene(id="S05", f=[398, 512], set="shop", light="night",
  vo="Thẻ Pokémon, thẻ đã chấm điểm, đồ sưu tầm, tiền mặt,",
  gloss="Pokémon cards, graded cards, collectibles, cash,",
  spine=2, viewer="Each thing named goes into a bag: cards, slabs, sealed boxes, the till's cash.",
  **{"in": {"type": "hold", "from": "S04"}, "out": {"type": "glide", "to": "S06", "note": "out through the back door"}},
  build="reuse the cases (contents removed per word), the counter and register (the drawer slides out).",
  blocking="A, B, C at their cases with duffels in their left hands; D walks from case 4 to the till (f430-470).",
  action="f400-422 A scoops the raw cards of case 1 into his duffel ('Thẻ Pokémon' f398); f432-456 B lifts the slabs of case 2 into his ('thẻ đã chấm điểm'); f466-490 C takes the sealed boxes of case 3 ('đồ sưu tầm'); f480 the camera turns to the counter; f493 D pulls the register drawer (ka-ching, it slides out) and stuffs the cash ('tiền mặt' f493-504). Each bag bulges as it fills.",
  acting="busy, quick; D greedy.",
  cams=[k(398, [-1.3, 2.4, -0.6], [-3.0, 0.82, -5.3], 50, glide=20, push=0.0018, blur=4, focus=CASE[1], why="the sweep down the row"),
        k(470, [-0.4, 2.0, -1.6], [2.3, 1.05, -4.6], 44, glide=30, push=0.002, blur=6, focus=H["register"], why="D at the till")],
  kicks=[[493, 0.4]], marks=[{"who": "D", "at": H["till"], "view": "front", "pose": "walks to the till f430-470, yanks the drawer f493", "expr": "grin"}],
  subjects=[{"n": "case 1", "p": CASE[0], "f": [398, 470]}, {"n": "register", "p": H["register"], "f": [500, 511]}],
  physics="the drawer slides out 30 cm in 4 f with a bounce.", light_mood="night.", sound="card shuffles f405, slab clacks f440, box thumps f475, the ka-ching f493.",
  after="The cases and the till are empty.")

LOCK = H["lock"]
scene(id="S06", f=[512, 600], set="shop", light="night",
  vo="xong còn tranh thủ vét luôn chiếc xe moóc sau tiệm,",
  gloss="then they even cleaned out the trailer behind the shop,",
  spine=2, viewer="Out back, bolt cutters snap the trailer's padlock; the doors swing open on stacked boxes.",
  **{"in": {"type": "glide", "from": "S05", "note": "through the back door"}, "out": {"type": "hold", "to": "S07"}},
  build="new: the back lot (gravel, a lamp over the back door), the cargo trailer with its padlock.",
  blocking="B at cutter_b facing the doors (front view), cutters on the shackle.",
  action="f530-548 B squeezes the handles; f552 ('vét' f552) the shackle snaps: the lock drops, bounces twice on the gravel and stays; f562-590 B swings both doors open (100 deg, heavy, a small bounce at the stop) on the boxes stacked inside.",
  acting="B: strain -> grin.",
  cams=[k(512, [0.9, 1.6, -8.6], [-1.6, 1.15, -12.4], 40, glide=34, push=0.002, blur=8, focus=LOCK, why="the padlock"),
        k(556, [0.9, 1.55, -8.6], [-1.6, 0.6, -12.3], 40, glide=18, push=0.0015, blur=8, focus=[-1.55, 0.3, -10.3], why="follow the lock down")],
  kicks=[[552, 0.5]], marks=[{"who": "B", "at": H["cutter_b"], "view": "front", "pose": "cutters on the lock, squeeze f530-552, opens the doors f562", "expr": "strain -> grin"}],
  subjects=[{"n": "lock", "p": LOCK, "f": [512, 560]}, {"n": "B head", "p": head(H["cutter_b"]), "f": [512, 599]}],
  physics="padlock (0.35 kg) + shackle halves: cannon-es from f552, falling 1.35 m to the gravel, restitution 0.3; doors: hinged, eased 100 deg with a 3 deg bounce.",
  light_mood="night; the warm lamp over the back door.", sound="a squeal and a sharp SNAP f552; the lock thuds f566, f574; door hinges creak f562-590.",
  after="The lock lies on the gravel; the trailer stands open.")

scene(id="S07", f=[600, 674], set="shop", light="night",
  vo="như khách buffet quay lại lấy đĩa thứ hai.",
  gloss="like a buffet guest going back for a second plate.",
  spine=2, viewer="A carries boxes out on a big buffet plate; C heads back in holding up an empty one.",
  **{"in": {"type": "hold", "from": "S06"}, "out": {"type": "dissolve", "to": "S08", "n": 6, "note": "minutes later, the street"}},
  build="new: two big round white plates (60 cm); booster boxes piled on A's.",
  blocking="A walks from plateA[0] to plateA[1] carrying the full plate in both arms; C walks from plateC[0] (the back door) to plateC[1] holding the empty plate up.",
  action="f600-650 A crosses toward camera-right with four booster boxes piled on his plate; f612-660 C crosses the other way, lifts his empty plate up beside his face on 'đĩa thứ hai' (f643), a napkin tucked into his collar.",
  acting="A: satisfied; C: eager.",
  cams=[k(600, [3.4, 1.6, -8.7], [-0.15, 1.15, -11.0], 44, glide=22, push=0.002, blur=6, focus=[0.0, 1.3, -9.8], why="the two plates cross")],
  kicks=[], marks=[{"who": "A", "at": H["plateA"][0], "view": "front", "pose": "walks with the full plate", "expr": "smile"}, {"who": "C", "at": H["plateC"][0], "view": "front", "pose": "walks, plate up f643", "expr": "grin"}],
  subjects=[{"n": "C head", "p": head(H["plateC"][1]), "f": [640, 673]}],
  physics="none.", light_mood="night.", sound="a cheesy lounge bossa sting f600-674; a plate 'ting' f643.",
  after="The plates go on with them.")

VAN0 = [H["van"][0], 1.0, H["van"][1]]
scene(id="S08", f=[674, 728], set="shop", light="night",
  vo="Hơn ba trăm mười nghìn đô biến mất trước khi gà",
  gloss="More than three hundred and ten thousand dollars vanished before the rooster",
  spine=3, viewer="The loaded van pulls away from the broken shop: $310,000+.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S07"}, "out": {"type": "dissolve", "to": "S09", "n": 8, "note": "dawn, same frame"}},
  build="reuse the street; the van (sits lower, loaded).",
  blocking="The four inside the van (not seen).",
  action="f680 the van pulls out: accelerates 5 m/s2 along +x, an exhaust puff at f680; by f728 it is leaving frame right; title $310,000+ f680-724.",
  acting="none.",
  cams=[k(674, [10.5, 1.3, 10.5], [-1.4, 1.4, 3.6], 46, push=0.0015, blur=3, focus=[0.0, 1.4, 1.0], why="the van leaves the broken shop")],
  kicks=[], marks=[], subjects=[{"n": "van", "p": VAN0, "f": [674, 690]}, {"n": "van", "p": VAN0, "f": [690, 700]}],
  physics="van: kinematic, x = x0 + 2.5 t^2.", light_mood="night.", sound="engine rev f680, tyres; a ka-ching f682 (the total).",
  after="The curb is empty.")

scene(id="S09", f=[728, 761], set="shop", light="golden",
  vo="gáy.",
  gloss="crowed.",
  spine=3, viewer="Dawn on the empty street; a rooster on the TWIN LAKES sign crows.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S08"}, "out": {"type": "dissolve", "to": "S10", "n": 8, "note": "back to the night drive"}},
  build="new: a rooster (side view card) perched on the town sign.",
  blocking="The rooster on the sign top, facing -x.",
  action="f738-752 the rooster stretches up, beak open, crowing on 'gáy' (f749); the camera pushes in.",
  acting="the rooster: chest out.",
  cams=[k(728, [10.5, 1.3, 10.5], [2.4, 2.3, 3.5], 36, push=0.007, blur=4, focus=H["rooster"], why="the rooster at dawn")],
  kicks=[], marks=[{"who": "rooster", "at": [H["rooster"][0], H["rooster"][2]], "view": "side", "pose": "crows f738-752", "expr": "-"}],
  subjects=[{"n": "rooster", "p": H["rooster"], "f": [728, 760]}],
  physics="none.", light_mood="dawn: gold low sun.", sound="a rooster crow f740 (meme 'Chicken' if it fits, else a synthesized crow).",
  after="Morning.")

scene(id="S10", f=[761, 900], set="road", light="night",
  vo="Kế hoạch hoàn hảo: mặt nạ kín mít, ra tay giữa đêm, không ai thấy mặt.",
  gloss="A perfect plan: masks on tight, strike at midnight, nobody sees a face.",
  spine=3, viewer="Driving home in the dark, the masked driver taps his mask; a speed camera flashes and he waves.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S09"}, "out": {"type": "hold", "to": "S11"}},
  build="new: the highway (fields, utility poles, the speed camera on the far shoulder, the moon).",
  blocking="A drives (front card in the driver's seat, seen through the open driver window).",
  action="the van glides along the straight (d 88 -> 153, easing in and out) and the camera tracks beside the driver's window; f797 ('mặt nạ') A taps his mask; f848 ('giữa đêm') the moon rides over the roof; f870 the speed camera flashes white ('không ai thấy mặt' f865) and A waves at it, smug; f890-900 the van brakes to a stop at the stop sign.",
  acting="A: smug grin, a wink.",
  cams=[k(761, CAMOFF(V10a), WIN(V10a), 40, push=0.0, blur=6, focus=WIN(V10a), why="tracking beside the driver"),
        k(761, CAMOFF(V10b), WIN(V10b), 40, glide=139, push=0.0, blur=6, focus=WIN(V10b), why="same offset at the stop")],
  kicks=[[870, 0.3]], marks=[{"who": "A", "at": [V10a[0] + 0.9, V10a[1] - 0.4], "view": "front", "pose": "driving; taps the mask f797; waves f872", "expr": "grin"}],
  subjects=[{"n": "driver window", "p": WIN(V10b), "f": [890, 899]}],
  physics="van: kinematic on the route (the same smootherstep as the camera).", light_mood="night; the moon, dashboard glow on the masks.", sound="road hum, a smug synth bass; a camera flash 'pzzt' + shutter f870.",
  after="The van waits at the stop sign.")

V11 = vanpt(STOP_D); REAR = [V11[0] - 2.62, 1.32, V11[1]]
scene(id="S11", f=[900, 1052], set="road", light="night",
  vo="Chỉ có một vấn đề nhỏ. Họ đi bằng một chiếc Chrysler Pacifica màu trắng. Xe thuê.",
  gloss="There was just one small problem. They drove a white Chrysler Pacifica. A rental.",
  spine=4, viewer="The white minivan at the stop sign, seen whole; the RENTAL sticker on its rear window.",
  **{"in": {"type": "hold", "from": "S10"}, "out": {"type": "dissolve", "to": "S12", "n": 8, "note": "back to the rental counter"}},
  build="reuse the van (brake lights on), the stop sign.",
  blocking="A at the wheel (hidden from the rear).",
  action="f900-934 stillness, brake lights glowing ('Chỉ có một vấn đề nhỏ'); f936-990 the camera swings round the van to its rear three-quarter (title CHRYSLER PACIFICA f952-1008, 'màu trắng' f1007); f1016-1050 push into the rear window: a RENTAL barcode sticker and the RENT-A-CAR plate frame on 'Xe thuê' (f1024).",
  acting="none.",
  cams=[k(900, CAMOFF(V11), WIN(V11), 40, glide=10, push=0.001, blur=6, focus=WIN(V11), why="the stop"),
        k(936, [V11[0] - 8.0, 1.7, V11[1] - 5.3], [V11[0] - 0.6, 1.0, V11[1]], 50, glide=50, push=0.0015, blur=4, focus=[V11[0], 1.0, V11[1]], why="the whole van"),
        k(1016, [V11[0] - 4.6, 1.45, V11[1] - 0.75], REAR, 30, glide=26, push=0.004, blur=10, focus=REAR, why="the RENTAL sticker")],
  kicks=[], marks=[], subjects=[{"n": "van", "p": [V11[0], 1.0, V11[1]], "f": [980, 1010]}, {"n": "sticker", "p": REAR, "f": [1040, 1051]}],
  physics="none.", light_mood="night; red brake light on the asphalt.", sound="engine idle; a soft 'dun' f1007; a barcode beep f1026.",
  after="Unchanged.")

R = RENT
scene(id="S12", f=[1052, 1105], set="rent", light="day",
  vo="Có hồ sơ thuê hẳn hoi.",
  gloss="With a proper rental record.",
  spine=4, viewer="The rental agreement signed and stamped APPROVED.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S11"}, "out": {"type": "cut", "to": "S13"}},
  build="new: the rental office; the RENTAL AGREEMENT on the counter (VEHICLE: WHITE MINIVAN).",
  blocking="A at the counter (out of frame but his arm and pen in), the clerk behind with the stamp.",
  action="f1060-1084 A's pen writes the signature on the line; f1084-1090 the clerk's stamp comes down and lands APPROVED on 'hẳn hoi' (f1088); the paper jumps 2 mm.",
  acting="—",
  cams=[k(1052, [-0.55, 2.15, -0.35], [-1.14, 1.05, -0.72], 32, push=0.0025, blur=10, focus=R["paper"], why="the contract")],
  kicks=[[1088, 0.5]], marks=[{"who": "A", "at": R["cust"], "view": "front", "pose": "signs f1060-1084", "expr": "neutral"}, {"who": "clerk", "at": R["clerk"], "view": "front", "pose": "stamps f1088", "expr": "neutral"}],
  subjects=[{"n": "paper", "p": R["paper"], "f": [1052, 1104]}],
  physics="the stamp: 4 f down, 2 f squash.", light_mood="office day light.", sound="pen scratch f1060-1084; a stamp THUNK f1088.",
  after="The signed, stamped agreement.")

QH = [head(q) for q in R["queue"]]
scene(id="S13", f=[1105, 1206], set="rent", light="day",
  vo="Khoan đã, đi ăn trộm mà thuê xe có giấy tờ đàng hoàng?",
  gloss="Wait, going to rob a shop in a rented car with proper paperwork?",
  spine=4, viewer="The customer is a man in a balaclava, with three masked friends queueing; the clerk checks his licence.",
  **{"in": {"type": "cut", "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 8, "note": "back to the night road"}},
  build="reuse the office; the queue of three masked men behind A.",
  blocking="Clerk behind the counter; A at the counter; B, C, D queue to the right.",
  action="f1105 cut on 'Khoan đã': the clerk blinks at A; f1150-1170 he raises A's driver's licence beside his own face, eyes go from the licence to the mask and back (f1176, f1190); the queue shuffles one step on 'đàng hoàng' (f1187).",
  acting="Clerk: deadpan -> suspicious; A: a polite smile under the mask.",
  cams=[k(1105, [-2.7, 1.55, 2.4], [-0.65, 1.25, -1.0], 44, cut=True, push=0.0008, blur=6, focus=head(R["cust"]), why="the masked customer and the queue")],
  kicks=[], marks=[{"who": "clerk", "at": R["clerk"], "view": "front", "pose": "licence up f1150", "expr": "neutral -> suspicious"}, {"who": "A", "at": R["cust"], "view": "front", "pose": "standing", "expr": "smile"}],
  subjects=[{"n": "clerk head", "p": head(R["clerk"]), "f": [1105, 1205]}, {"n": "A head", "p": head(R["cust"]), "f": [1105, 1205]}, {"n": "D head", "p": QH[2], "f": [1105, 1205]}],
  physics="none.", light_mood="flat office light.", sound="a record scratch + Huh (meme) f1105; a printer whirr; a slow 'hmm' f1176.",
  after="—")

def W14(f): return vanpt(d14(f))
AER_L = [-22.0, 0.0, 12.0]; AER_P = [-64.0, 86.0, -15.0]
scene(id="S14", hero=True, f=[1206, 1463], set="road", light="night",
  vo="Bạn thấy đấy, mặt nạ che được khuôn mặt, nhưng chiếc xe thuê nhớ từng con đường nó đi qua, còn chiếc điện thoại trong túi nhớ từng cột sóng nó chạm vào.",
  gloss="You see, a mask hides a face, but a rental car remembers every road it took, and the phone in your pocket remembers every tower it touched.",
  spine=5, viewer="The masked face, then from above: the route lights up gold behind the van, and towers ping as the phone passes.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S13"}, "out": {"type": "dissolve", "to": "S15", "n": 8}},
  build="reuse the highway; new: the gold trail ribbon, the cell towers with top lamps and ping rings, the phone pulse on the van.",
  blocking="A at the wheel.",
  action="f1206-1262 the van waits at the stop sign, the masked driver in the window ('mặt nạ che được khuôn mặt' f1239-1271); f1262 it pulls away (1.5 m/s2 up to 22 m/s); f1272-1372 the camera cranes up to an aerial; f1318-1350 'nhớ từng con đường' a gold trail floods along the road it came by, up to the van, and keeps drawing behind it; f1407, f1417, f1427, f1438, f1447 the van passes a tower: a blue ring pulses off the van (the phone) and the tower's top lamp lights and stays lit.",
  acting="A: calm at the wheel.",
  cams=[k(1206, CAMOFF(V11), WIN(V11), 40, push=0.0015, blur=6, focus=WIN(V11), why="the mask"),
        k(1272, AER_P, AER_L, 54, glide=100, push=0.0, blur=0, focus=AER_L, why="crane up: the trail and the towers")],
  kicks=[], marks=[{"who": "A", "at": V11, "view": "front", "pose": "driving", "expr": "neutral"}],
  subjects=[{"n": "window", "p": WIN(V11), "f": [1206, 1262]}] + [{"n": f"tower {i+1}", "p": [t[0], 12, t[1]], "f": [1380, 1462]} for i, t in enumerate(TOWERS)] + [{"n": "van", "p": [W14(1460)[0], 1, W14(1460)[1]], "f": [1455, 1462]}],
  physics="van: kinematic along the route (d = 153 + 1.5 t^2).", light_mood="night; the gold trail and blue pings glow.", sound="a warm 'you see' pad; a rising shimmer as the trail floods f1318; a sonar 'blip' per tower f1407-1447.",
  after="Five towers lit, the gold trail along the road.")

JH = JUS
scene(id="S15", f=[1463, 1573], set="jus", light="night",
  vo="Đeo mặt nạ mà mang điện thoại, khác gì chơi trốn tìm mà cầm loa.",
  gloss="Wearing a mask but carrying a phone is like playing hide-and-seek holding a megaphone.",
  spine=5, viewer="A masked man hides behind a hedge holding a megaphone; it rings, and the seeker at the tree turns round.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S14"}, "out": {"type": "dissolve", "to": "S16", "n": 8}},
  build="new: the front yard in Justice at night (hedge, maple, porch light).",
  blocking="Seeker (cop) at the tree facing it (side view), counting; A crouched behind the hedge, megaphone at his mouth.",
  action="f1463-1530 the seeker counts, face to the trunk; f1529 ('trốn tìm') A ducks lower; f1550 ('cầm loa') the megaphone rings: rings of sound burst out, leaves on the hedge shiver; f1556 the seeker turns to front view and stares straight at the hedge.",
  acting="A: wide eyes; seeker: deadpan.",
  cams=[k(1463, [-3.9, 1.5, 9.0], [-6.1, 1.0, 1.2], 44, push=0.0008, blur=6, focus=[-5.0, 1.15, -0.4], why="hedge and tree")],
  kicks=[[1550, 0.5]], marks=[{"who": "A", "at": JH["hider"], "view": "front", "pose": "crouched, megaphone", "expr": "nervous -> shock"}, {"who": "cop", "at": JH["seeker"], "view": "side -> front", "pose": "counting, turns f1556", "expr": "neutral"}],
  subjects=[{"n": "A head", "p": [JH["hider"][0], 1.2, JH["hider"][1]], "f": [1463, 1572]}, {"n": "seeker head", "p": head(JH["seeker"]), "f": [1463, 1572]}],
  physics="hedge leaves: a 2 cm shiver 12 f.", light_mood="night; the porch light warm.", sound="crickets; counting murmur; Yo Phone Ringing (meme) blasted f1550.",
  after="Caught.")

PO = POL; SL = PO["slots"]; BZ = PO["board_z"]
def slot3(n): return [SL[n][0], SL[n][1], BZ]
PIN_J = [PO["pin_justice"][0], PO["pin_justice"][1], BZ]
PIN_ORDER = ["cctv", "rental", "gps", "phone", "prints"]; PIN_F = [1600, 1622, 1656, 1685, 1720]
scene(id="S16", f=[1573, 1736], set="pol", light="day",
  vo="Cảnh sát gom camera, hồ sơ thuê xe, dữ liệu định vị, lịch sử điện thoại, cả dấu vân tay,",
  gloss="Police gathered the cameras, the rental record, location data, phone history, even fingerprints,",
  spine=6, viewer="The detective pins five pieces of evidence, one per word.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S15"}, "out": {"type": "glide", "to": "S17"}},
  build="new: the squad room; the cork board with five slots and the map; a stack of evidence sheets in his left arm.",
  blocking="Detective in front of the board (det_z), side-stepping to each slot.",
  action="he pins: f1600 the CCTV still (four masks at the glass door), f1622 the rental agreement (APPROVED), f1656 the GPS printout (the gold route), f1685 the phone record (tower list), f1720 the fingerprint card; a red string links each to the last.",
  acting="Detective: focused, a small nod per pin.",
  cams=[k(1573, [0.36, 1.5, 2.8], [0.36, 1.58, BZ], 50, push=0.0006, blur=6, focus=[0.0, 1.6, BZ], why="the board")],
  kicks=[], marks=[{"who": "det", "at": [SL[n][0] + 0.2, PO["det_z"]], "f": PIN_F[i], "view": "front", "pose": f"pins {n}", "expr": "stern"} for i, n in enumerate(PIN_ORDER)],
  subjects=[{"n": n, "p": slot3(n), "f": [PIN_F[i], 1735]} for i, n in enumerate(PIN_ORDER)] + [{"n": "map", "p": [PO["map"][0], PO["map"][1], BZ], "f": [1573, 1735]}],
  physics="each sheet: 6 f from his chest to the slot, a 1 cm flutter on the pin.", light_mood="office day, a desk lamp.", sound="a pin 'tock' per item f1600-1720; a typewriter-ish tick bed.",
  after="Five items on the board linked by string.")

scene(id="S17", f=[1736, 1800], set="pol", light="day",
  vo="rồi lần thẳng đến một ngôi nhà ở thị trấn",
  gloss="and traced it straight to a house in the village of",
  spine=6, viewer="The red string runs from the evidence to a pin on the map: Justice.",
  **{"in": {"type": "glide", "from": "S16"}, "out": {"type": "through-object", "to": "S18", "n": 8, "note": "push into the map pin, dissolve to the house"}},
  build="reuse the board; the string from the prints to the Justice pin.",
  blocking="Detective steps aside right of the board.",
  action="f1740-1766 the detective draws the red string taut from the prints card to the map and pushes the red pin into JUSTICE on 'lần thẳng' (f1747-1764); f1772-1800 the camera pushes into the pin.",
  acting="Detective: a satisfied tap.",
  cams=[k(1736, [0.75, 1.5, 0.5], [0.85, 1.4, BZ], 44, glide=24, push=0.002, blur=8, focus=PIN_J, why="string to the map"),
        k(1772, [1.13, 1.2, -1.6], PIN_J, 30, glide=28, push=0.004, blur=10, focus=PIN_J, why="into the pin")],
  kicks=[[1764, 0.3]], marks=[{"who": "det", "at": [1.25, PO["det_z"]], "view": "front", "pose": "pins Justice f1764", "expr": "smile"}],
  subjects=[{"n": "pin", "p": PIN_J, "f": [1760, 1799]}],
  physics="the string pulls straight.", light_mood="day.", sound="string twang f1764; a whoosh into the pin f1790.",
  after="Justice pinned.")

JV = [JH["van"][0], 1.0, JH["van"][1]]
scene(id="S18", f=[1800, 1857], set="jus", light="golden",
  vo="Justice, bang Illinois.",
  gloss="Justice, Illinois.",
  spine=6, viewer="Dawn: two police cruisers roll up to a ranch house; the white minivan sits in its driveway.",
  **{"in": {"type": "through-object", "n": 8, "from": "S17"}, "out": {"type": "cut", "to": "S19"}},
  build="reuse: the house, garage, driveway with the van; new: two cruisers with flashing lightbars.",
  blocking="Cop1 and cop2 in the cars (not seen).",
  action="f1800-1840 the cruisers roll in from +x and stop at their marks (ease out), lightbars flashing red/blue; title JUSTICE, ILLINOIS f1808-1852.",
  acting="none.",
  cams=[k(1800, [14.0, 4.0, 21.0], [2.0, 1.0, 1.0], 46, push=0.0015, blur=3, focus=JV, why="house, van, police")],
  kicks=[], marks=[], subjects=[{"n": "van", "p": JV, "f": [1800, 1856]}, {"n": "garage", "p": [4.3, 1.2, -1.0], "f": [1800, 1856]}],
  physics="cars: kinematic, ease-out stops.", light_mood="dawn gold; red-blue flashes.", sound="sirens wind down, tyres f1835; birds.",
  after="Cruisers parked out front.")

scene(id="S19", f=[1857, 1921], set="jus", light="golden",
  vo="Vâng, thị trấn tên là Công Lý.",
  gloss="Yes, the town is literally called Justice.",
  spine=6, viewer="The wooden VILLAGE OF JUSTICE sign, police lights glowing behind.",
  **{"in": {"type": "cut", "from": "S18"}, "out": {"type": "glide", "to": "S20"}},
  build="reuse the welcome sign.",
  blocking="nobody.",
  action="f1857-1921 a slow push onto the sign; on 'Công Lý' (f1899) a bright 'ding' and the sign's carved scales catch the light.",
  acting="none.",
  cams=[k(1857, [-14.4, 1.45, 11.2], [-11.0, 1.4, 5.2], 38, cut=True, push=0.003, blur=8, focus=[-11.0, 1.4, 5.2], why="the sign")],
  kicks=[], marks=[], subjects=[{"n": "sign", "p": [JH["jsign"][0], 1.45, JH["jsign"][1]], "f": [1857, 1920]}],
  physics="none.", light_mood="dawn gold.", sound="a bright bell 'ding' f1899.",
  after="—")

SLABUP = [5.25, 1.15, -1.72]
scene(id="S20", f=[1921, 2016], set="jus", light="golden",
  vo="Bên trong là hàng Pokémon của chính tiệm Goldenrod.",
  gloss="Inside was Pokémon stock from Goldenrod itself.",
  spine=6, viewer="The garage door rolls up on shelves of slabs and boxes; an officer lifts a slab with a GOLDENROD price sticker.",
  **{"in": {"type": "glide", "from": "S19"}, "out": {"type": "dissolve", "to": "S21", "n": 8}},
  build="reuse the garage; loot on shelves (slabs, booster boxes, the duffels); new: a slab with the GOLDENROD CITY COLLECTIBLES price sticker.",
  blocking="Cop1 walks from cop1[0] to cop1[1] inside the garage, lifts a slab from the box.",
  action="f1925-1958 the door rolls up into the ceiling; f1940-1970 cop1 walks in; f1972-1984 he lifts a slab from the box; f1984-2016 the slab at his chest, the sticker GOLDENROD CITY COLLECTIBLES reads on 'Goldenrod' (f1991).",
  acting="cop1: grim -> a small told-you-so smile.",
  cams=[k(1921, [8.4, 1.7, 5.2], [5.0, 1.15, -2.3], 42, glide=36, push=0.0015, blur=6, focus=[5.0, 1.15, -2.3], why="the garage opens"),
        k(1974, [5.45, 1.3, 0.05], SLABUP, 30, glide=18, push=0.003, blur=12, focus=SLABUP, why="the sticker")],
  kicks=[], marks=[{"who": "cop", "at": JH["cop1"][1], "view": "front", "pose": "walks in f1940-1970, lifts the slab f1972", "expr": "stern -> smile"}],
  subjects=[{"n": "garage", "p": [5.0, 1.1, -2.3], "f": [1921, 1970]}, {"n": "slab", "p": SLABUP, "f": [1995, 2015]}],
  physics="door: segments roll up and back along the ceiling.", light_mood="dawn outside, a bare bulb inside.", sound="garage motor rattle f1925-1958; a 'ding' f1991.",
  after="The slab in his hands.")

DESKP = [[x, PO["desk_y"] + 0.006, z] for x, z in PO["folders"]]
scene(id="S21", f=[2016, 2159], set="pol", light="day",
  vo="Năm người đàn ông bị buộc tội. Hai người đã bị bắt. Ba người vẫn đang bị truy nã, và lần này",
  gloss="Five men were charged. Two have been arrested. Three are still wanted, and this time",
  spine=7, viewer="Five charge folders slam down; two get ARRESTED, three get WANTED.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S20"}, "out": {"type": "cut", "to": "S22"}},
  build="reuse the squad room; the booking counter with five folders (mugshots of generic faces, a red CHARGED band).",
  blocking="Sergeant behind the counter (sarge mark), side-stepping.",
  action="f2020-2053 he slaps the last of five CHARGED folders onto the row on 'buộc tội' (f2053); f2086, f2092 two ARRESTED stamps (folders 1-2) on 'bị bắt'; f2128, f2134, f2140 three WANTED stamps (folders 3-5) on 'truy nã'.",
  acting="Sergeant: brisk, stern.",
  cams=[k(2016, [0.0, 2.5, 2.45], [0.0, 1.0, 0.45], 50, push=0.0006, blur=6, focus=[0, 1.03, 0.72], why="the five folders")],
  kicks=[[2053, 0.5], [2086, 0.3], [2092, 0.3], [2128, 0.3], [2134, 0.3], [2140, 0.3]],
  marks=[{"who": "sarge", "at": PO["sarge"], "view": "front", "pose": "slams f2053, stamps f2086-2140", "expr": "stern"}],
  subjects=[{"n": f"folder {i+1}", "p": p, "f": [2056, 2158]} for i, p in enumerate(DESKP)],
  physics="each folder: lands flat, slides 1 cm; stamps: 3 f down.", light_mood="office day.", sound="a folder slap f2053; stamp thunks f2086, f2092 (deep), f2128-2140 (higher).",
  after="2 ARRESTED, 3 WANTED.")

RW = ROAD["walk"]
scene(id="S22", f=[2159, 2210], set="road", light="golden",
  vo="chắc họ sẽ đi bộ.",
  gloss="they'll probably go on foot.",
  spine=7, viewer="Three of them trudge along the highway shoulder at dawn.",
  **{"in": {"type": "cut", "from": "S21"}, "out": {"type": "dissolve", "to": "S23", "n": 8}},
  build="reuse the highway at dawn (no van).",
  blocking="B, C, D walk in a line along the shoulder (walk marks) heading +x, side view.",
  action="f2159-2210 they trudge 2.4 m, heads down, duffels on their backs; a truck's horn far away.",
  acting="glum.",
  cams=[k(2159, [-63.6, 1.4, 11.2], [-64.3, 1.05, 4.9], 44, push=0.002, blur=4, focus=[-64.3, 1.1, 4.9], why="on foot")],
  kicks=[], marks=[{"who": w, "at": RW[i], "view": "side walking +x", "pose": "trudge", "expr": "sad"} for i, w in enumerate("BCD")],
  subjects=[{"n": "walker 2", "p": [RW[1][0] + 1.2, 1.5, RW[1][1]], "f": [2159, 2209]}],
  physics="none.", light_mood="dawn gold.", sound="footsteps on gravel; Sad Violin (meme, short) f2165.",
  after="—")

scene(id="S23", f=[2210, 2258], set="shop", light="day",
  vo="Đập kính chỉ mất vài giây.",
  gloss="Smashing glass takes a few seconds.",
  spine=7, viewer="Next morning: the empty door frame and the shards still on the floor.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S22"}, "out": {"type": "dissolve", "to": "S24", "n": 8}},
  build="reuse the storefront in daylight; the door shards where they settled in S01.",
  blocking="nobody.",
  action="f2210-2258 a low push through the empty door frame onto the shards.",
  acting="none.",
  cams=[k(2210, [0.35, 0.75, 2.7], [0.0, 0.45, -1.2], 44, push=0.004, blur=8, focus=[0.0, 0.05, -1.1], why="the shards stay")],
  kicks=[], marks=[], subjects=[{"n": "shards", "p": [0.0, 0.05, -1.1], "f": [2210, 2257]}],
  physics="none (the S01 bake's final resting poses).", light_mood="morning day.", sound="a single glass tinkle f2230; street birds.",
  after="—")

RA = RENT
DR = [RA["archive_x"], 0.1 + (RA["drawer2026"][1] + 0.5) * RA["drawer_h"], RA["archive_z"][0] + (RA["drawer2026"][0] + 0.5) * RA["drawer_w"]]
scene(id="S24", f=[2258, 2370], set="rent", light="day",
  vo="Còn hồ sơ thuê xe thì lưu lại rất lâu.",
  gloss="But a rental record stays on file for a very long time.",
  spine=7, viewer="The clerk files the agreement in the 2026 drawer of a wall of years.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S23"}, "out": {"type": "end"}},
  build="reuse the archive wall (drawers 1999..2026).",
  blocking="Clerk at clerk_arch facing the wall (front view).",
  action="f2262-2290 the clerk slides the agreement folder into the open 2026 drawer; f2300 he shuts it (thunk, 'lưu' f2304); f2306-2370 the camera pulls back over the whole wall of years.",
  acting="Clerk: tidy, satisfied.",
  cams=[k(2258, [-1.7, 1.6, -1.15], [-2.84, 1.43, DR[2]], 36, push=0.002, blur=10, focus=DR, why="the 2026 drawer"),
        k(2306, [1.6, 1.7, 2.9], [-3.2, 1.25, -0.1], 46, glide=56, push=0.001, blur=4, focus=[-3.2, 1.25, 0.0], why="the wall of years")],
  kicks=[[2300, 0.3]], marks=[{"who": "clerk", "at": RA["clerk_arch"], "view": "front", "pose": "files the folder, shuts the drawer f2300", "expr": "smile"}],
  subjects=[{"n": "drawer", "p": DR, "f": [2258, 2300]}, {"n": "wall", "p": [-3.2, 1.25, 0.0], "f": [2340, 2369]}],
  physics="the drawer: slides shut, stops hard.", light_mood="office day.", sound="a drawer roll and a THUNK f2300; the theme's last chord.",
  after="End.")

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(S), "scenes")
