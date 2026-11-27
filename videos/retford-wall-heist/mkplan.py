"""Generator of plan.json for the Retford wall-heist reel. The plan is the source of truth: change it here, then
python3 videos/retford-wall-heist/mkplan.py && python3 scripts/plan_check.py videos/retford-wall-heist/plan.json"""
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
def body(m, h=1.82, w=0.28):   # crown, feet and the head's width
    y = h - 0.22; return [[m[0], h, m[1]], [m[0], 0.02, m[1]], [m[0] - w, y, m[1]], [m[0] + w, y, m[1]]]
HEAD = lambda m, h=1.82: [m[0], h, m[1]]
KIDH = 1.34

# ---------------- layout (set-local metres; the build reads these) ----------------
# UNIT: the Retford trade unit on an industrial estate, its side yard, the estate road (runs along x), the police station down
# the road (+x) and the A-road west (-x) with the two gantry signs. Origin at the centre of
# its front wall line; the front wall is z 0 (facing +z, the road); the side wall with the hole is x 6 (facing +x, the yard).
UNIT = dict(
    bld=[-6.0, 6.0, -10.0, 0.0], h=5.0, wall_t=0.25,
    hole=[6.0, 0.95, -4.0], hole_r=0.45, ring_n=22,         # the ring of drilled holes around the plug; the last one at f28
    door=[2.0, 3.0, 0.0, 2.3], window=[0.15, 1.75, 0.7, 2.1], shutter=[-4.6, -1.2, 0.0, 3.4],
    sign=[0.0, 4.15, 0.06], sign_size=[7.0, 0.75],
    rack=[3.4, 4.2, -8.2, -1.2], shelves=[0.12, 0.52, 0.92, 1.32, 1.72], carton=[0.4, 0.3, 0.3],
    bell=[6.04, 3.4, -2.0], post=[14.2, -0.6], post_h=6.2, cctv=[13.9, 5.35, -0.6],
    yard=[6.0, 15.0, -11.0, 0.0], road=[4.0, 11.0], lane_w=5.75, lane_e=9.25, pave=[0.0, 4.0],
    poles_x=[6.6, 18.6, 30.6, 42.6, 54.6], pole_z=3.5, wire_y=6.0,
    station=[55.0, 65.0, 13.0, 20.0], station_h=4.6, st_window=[56.6, 59.6, 0.9, 2.3], st_door=[61.0, 62.2], st_lamp=[61.6, 2.75, 12.85],
    st_panel=[57.4, 1.85, 19.9],
    town_sign=[-3.0, 3.3], layby=[-5.0, 8.0, 13.0, 19.0],
    gantries=[[-18.0, "SOUTH YORKSHIRE"], [-58.0, "MANCHESTER"]], road_cams=[-8.0, -30.0, -44.0, -72.0, -88.0], road_cam_z=12.4,
    # marks [x, z] at the feet
    A_drill=[6.85, -4.75], A_wait=[7.05, -4.75], A_load=[9.4, -6.8], B_rack=[4.68, -2.6], B_hole=[5.3, -3.6],
    A_freeze=[7.0, -4.75], B_freeze=[7.5, -3.2], officer=[58.6, 15.4], kid_walk=[6.5, 3.2], kid_door=[2.5, 0.55])
U = UNIT
VAN = dict(L=5.2, W=2.0, H=2.3, cab=0.9, rear=-2.6,
           yard=[12.2, -6.0, 90.0], layby=[1.2, 16.4, 270.0], plate="TK18 RVW", plate_under="YD68 PQX")   # [x, z, heading deg]: 0 = nose +x, 90 = nose +z
def van_world(v, lx, ly, lz):
    """a point in the van's own frame (nose +x, right side +z, floor of the road y 0) to the set's frame"""
    h = math.radians(v[2]); c, s = math.cos(h), math.sin(h)
    return [v[0] + lx * c - lz * s, ly, v[1] + lx * s + lz * c]
# the van's route out of the yard and west along the estate road (S08): dense samples [f, x, z, heading]
def _route():
    keys = [(885, 12.2, -6.0), (899, 12.2, 1.0), (909, 10.4, 4.6), (917, 6.6, 5.75)]
    pts = []
    for f in range(827, 995):
        if f <= keys[0][0]: x, z = keys[0][1], keys[0][2]
        elif f >= keys[-1][0]: x, z = keys[-1][1] - 1.0 * (f - keys[-1][0]), U["lane_w"]
        else:
            for a, b in zip(keys, keys[1:]):
                if a[0] <= f <= b[0]:
                    u = (f - a[0]) / (b[0] - a[0]); u = u * u * (3 - 2 * u) if a is keys[0] else u
                    x, z = a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u; break
        pts.append([f, round(x, 3), round(z, 3)])
    out = []
    for i, (f, x, z) in enumerate(pts):
        j = min(len(pts) - 1, i + 3); dx, dz = pts[j][1] - x, pts[j][2] - z
        h = math.degrees(math.atan2(dz, dx)) if math.hypot(dx, dz) > 1e-3 else (out[-1][3] if out else 90.0)
        out.append([f, x, z, round(h, 2)])
    return out
ROUTE = _route()
def van_at(f):
    for r in ROUTE:
        if r[0] == f: return [r[1], r[2], r[3]]
    return VAN["yard"] if f < ROUTE[0][0] else ROUTE[-1][1:]

KID = dict(room=[-2.4, 2.4, -2.2, 3.0], h=2.7, desk=[-0.6, 0.6, -0.3, 0.3], desk_y=0.86, book=[0.05, -0.06], book_size=[0.2, 0.27],
           kid=[0.0, -0.42], window=[-1.6, -0.2, 1.0, 2.2])
CTRL = dict(room=[-3.5, 3.5, -3.0, 4.0], h=3.0, map=[-2.0, 0.4, 0.9, 2.4], mons=[0.75, 2.85, 0.75, 2.55], mon_grid=[2, 3], console=[0.6, 2.9, -2.45, -2.05], console_y=0.98,
            officer=[0.42, -2.25], aide=[-2.6, -1.4],
            # where the route is drawn on the map screen (canvas units 0..1 of its width / height): Retford -> South Yorkshire -> Manchester
            route=[[0.9, 0.55], [0.7, 0.66], [0.52, 0.7], [0.32, 0.55], [0.12, 0.42]], towns=[["RETFORD", 0.9, 0.55], ["SOUTH YORKSHIRE", 0.56, 0.78], ["MANCHESTER", 0.12, 0.42]])
YARD = dict(box=[-1.6, 0.84, -6.06, 0.0], box_h=2.6, gate=[-4.0, 4.0], fence_z=10.0, van=[-0.38, 3.6, 90.0],
            car_from=[16.0, 8.6], car_stop=[-1.2, 8.6], car_turn=[1337, 1352],
            C1=[2.7, -0.3], C2=[1.9, 1.7], cop1_from=[2.6, 7.6], cop1=[3.7, 3.2], cop2_from=[1.6, 7.6], cop2=[0.95, 5.0],
            hammer=[-0.62, 0.58, 1.9], stack=[3.7, 5.2], det=[4.9, 5.9], pallet=[1.2, 0.8])
COURT = dict(front=[-8.0, 8.0], h=9.0, door=[-1.2, 1.2, 2.6], board=[-3.8, 1.5, 0.05], board_size=[0.9, 0.7], signpost=[4.3, 6.2],
             men=[[-2.2, 3.0], [-1.45, 4.7], [-0.7, 3.0], [0.05, 4.7], [0.8, 3.0], [1.55, 4.7]],
             out=[[-0.7, 2.4], [0.0, 2.7], [0.7, 2.4]], out_from=[0.0, 0.75], goL=[-7.0, 3.2], goC=[-4.0, 9.0], goR=[3.3, 5.3], backR=[-7.0, 7.0])
ROOM = dict(room=[-4.0, 4.0, -4.0, 4.0], h=4.2, tv=[-1.8, 2.35, -3.98], tv_size=[1.7, 0.96], dock=[0.6, 3.3, -1.7, -0.4], dock_h=1.15,
            dock_men=[[1.15, -1.05], [1.95, -1.05], [2.75, -1.05]])

P = {
 "fps": 30, "frames": 2425, "voice_end": 2392,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 55, "out": 88, "text": "1:00 AM", "style": 3, "from": "top"},
  {"f": 112, "out": 140, "text": "26", "style": 3, "from": "top"},
  {"f": 366, "out": 398, "text": "12/2025", "style": 3, "from": "top"},
  {"f": 1708, "out": 1765, "text": "11 THANG SAU", "style": 3, "from": "top"}],
 "cards": {"window": ["zard151", "umbreon_pe", "bubble_mew", "pika151", "blast151", "venu151"]},
 "unit": UNIT, "van": VAN, "van_route": ROUTE, "kid": KID, "ctrl": CTRL, "yard": YARD, "court": COURT, "room": ROOM,
 "sets": {
  "unit": {"origin": [0, 0, 0], "axes": "the unit's front wall is z 0 (faces +z, the estate road along x); the side wall with the hole is x 6 (faces +x, the side yard); the police station is down the road at x 55..65 across it; the road runs west (-x) under the two gantry signs",
   "light": "night", "sun": [-40, 35], "open_sides": "+x, +z",
   "objects": [
    {"id": "unit", "build": "new: trade unit x -6..6, z -10..0, 5 m: cream-and-sky-blue ribbed cladding on the front, red brick on the side wall (x 6) with a 25 cm wall; a shallow red roof; inside a warm-lit warehouse with a concrete floor, ceiling lights and racks of cartons", "pos": [0, 2.5, -5], "size": [12, 5, 10]},
    {"id": "hole", "build": "new: the breach in the side wall: a brick plug 90 cm across in a ring of 22 drilled holes (dark dots); on f32 it tips inward about its bottom edge and lands flat on the warehouse floor, four loose bricks hop and settle; the round tunnel through the wall shows brick ends. Bricked up with paler new bricks in S17", "pos": U["hole"], "size": [0.9, 0.9, 0.25]},
    {"id": "front", "build": "new: the front wall: a roller shutter x -4.6..-1.2 (closed), a display window x 0.15..1.75 with six real card scans on easels on a red felt shelf, a glass door x 2..3 with a brass bell inside and a Christmas wreath; a sign board TRADING CARDS over the front; a string of warm Christmas bulbs along the fascia", "pos": [0, 2, 0.05], "size": [12, 4.5, 0.1]},
    {"id": "racks", "build": "new: steel racks x 3.4..4.2 z -8.2..-1.2 (orange uprights, blue beams), five levels of brown cartons 40 x 30 x 30 cm stencilled TRADING CARDS / FRAGILE; more racks deeper in", "pos": [3.8, 1.0, -4.7], "size": [0.8, 2.0, 7.0]},
    {"id": "bell", "build": "new: the alarm bell box on the side wall: red steel box 36 x 46 x 12 cm with a round bell dome and a blue strobe lamp, a hammer that rattles; its cable climbs the wall to the roof edge and runs to the first pole", "pos": U["bell"], "size": [0.12, 0.46, 0.36]},
    {"id": "post", "build": "new: the yard's lamp post (6.2 m, green) with an orange sodium lamp head and a white CCTV camera on an arm: housing 30 cm, sun hood, a black lens, a red REC lamp; the head swivels", "pos": [12.6, 3.1, -0.6], "size": [0.3, 6.2, 0.3]},
    {"id": "van", "build": "new: white panel van 5.2 x 2.0 x 2.3 m: orange roof ladder, a dent in the sliding side door (right side), rear doors that open, a hollow cab (dash, wheel, windscreen); a printed number plate taped over the real one at the back, one tape corner lifting (TK18 RVW over YD68 PQX)", "pos": [8.7, 1.15, -4.2], "size": [5.2, 2.3, 2.0]},
    {"id": "road", "build": "new: the estate road along x (z 4..11): asphalt, white dashes, kerbs, pavements; telephone poles at z 3.5 every 12 m carrying the alarm line east to the police station; the A-road west with two blue gantry signs (SOUTH YORKSHIRE at x -18, MANCHESTER at x -58) and five road cameras on poles; lamp posts with warm sodium light; hedges, fields, distant hills", "pos": [0, 0, 7.5], "size": [400, 0.1, 7]},
    {"id": "station", "build": "new: the police station across the road at x 55..65, z 13..20: red brick, a blue POLICE lamp over the door, a lit window (x 56.6..59.6) into the front office: a desk officer standing, an alarm panel whose red lamp flashes from f229", "pos": [60, 2.3, 16.5], "size": [10, 4.6, 7]},
    {"id": "estate", "build": "new: neighbour units (cladding in cream, sky blue, red), a RETFORD town sign (white with black letters) on the pavement in front of the unit, a lay-by car park across the road (x -5..8, z 13..19) where the van waits by day, hedges and trees, a church spire far off", "pos": [0, 2, 0], "size": [60, 4, 40]}],
   "marks": {k2: U[k2] for k2 in ["A_drill", "A_load", "B_rack", "B_hole", "A_freeze", "B_freeze", "officer", "kid_walk", "kid_door"]}},
  "kidroom": {"origin": [400, 0, 0], "axes": "the kid stands behind a tall desk facing +z (the lens); the window in the back wall",
   "light": "day", "sun": [30, 45], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: a kid's room x -2.4..2.4, z -2.2..3, 2.7 m: sky-blue walls with a white dado, a window with blue sky and clouds, posters, a bookshelf with toys and binders, a bunting string, wood floor, a rug", "pos": [0, 1.35, 0.4], "size": [4.8, 2.7, 5.2]},
    {"id": "desk", "build": "new: a tall standing desk x -0.6..0.6, z -0.3..0.3, top 0.86: warm oak, a pencil pot, a ruler, an eraser", "pos": [0, 0.43, 0], "size": [1.2, 0.86, 0.6]},
    {"id": "book", "build": "new: a school notebook 20 x 27 cm lying on the desk: a red cover hinged at its left edge (spine along z), a white name label MINH; a second label AN on a backing sheet; inside, lined pages with MINH written in the same wobbly hand at the top of every page", "pos": [0.05, 0.866, -0.06], "size": [0.2, 0.01, 0.27]}],
   "marks": {"kid": KID["kid"]}},
  "ctrl": {"origin": [600, 0, 0], "axes": "the screens are on the back wall z -3, facing +z; the lens at +z",
   "light": "day", "sun": [20, 40], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: police control room x -3.5..3.5, z -3..4, 3 m: warm cream walls, blue carpet, ceiling lights, a clock, a POLICE crest-free plaque, plants", "pos": [0, 1.5, 0.5], "size": [7, 3, 7]},
    {"id": "map", "build": "new: a big wall screen 2.4 x 1.5 m at x -2..0.4: a map of northern England (green land, blue motorways), RETFORD, SOUTH YORKSHIRE, MANCHESTER; a red route draws itself west as camera dots light up along it", "pos": [-0.8, 1.65, -2.98], "size": [2.4, 1.5, 0.05]},
    {"id": "mons", "build": "new: six monitors (2 x 3) at x 0.75..2.85: each shows a road camera view with the same white van (orange roof ladder, dent in the side door) and a CAM number", "pos": [1.8, 1.65, -2.98], "size": [2.1, 1.8, 0.05]},
    {"id": "console", "build": "new: a standing-height console desk with keyboards and phones", "pos": [1.75, 0.49, -2.25], "size": [2.3, 0.98, 0.4]}],
   "marks": {"officer": CTRL["officer"], "aide": CTRL["aide"]}},
  "yard": {"origin": [800, 0, 0], "axes": "an open shipping container's doors face +z at z 0; the van is backed up to it; the yard gate in the fence at z 10 (x -4..4); the city behind -z",
   "light": "golden", "sun": [-55, 14], "open_sides": "+x, +z",
   "objects": [
    {"id": "containers", "build": "new: rows of shipping containers (orange, sky blue, green, red, 6.06 x 2.44 x 2.6 m, corrugated sides, door bars), stacked two high in places; the open one at x -1.6..0.84, z -6.06..0 with both doors swung open, cartons inside", "pos": [-0.38, 1.3, -3.03], "size": [2.44, 2.6, 6.06]},
    {"id": "van", "build": "reuse: the van, backed up to the container (rear at z 1.0), rear doors open; inside: cartons and a sledgehammer lying on the floor", "pos": [-0.38, 1.15, 3.6], "size": [2.0, 2.3, 5.2]},
    {"id": "car", "build": "new: police car (white, blue-and-yellow checks along the side, a blue light bar that flashes) that swings across the gate f1337-1352", "pos": [0.8, 0.75, 8.6], "size": [4.6, 1.5, 1.8]},
    {"id": "yard", "build": "new: concrete yard, a steel mesh fence with a gate, floodlight masts, a yard office cabin, a pallet stack, Manchester towers far behind under a pink-orange dawn sky with clouds", "pos": [0, 0, 0], "size": [60, 3, 40]}],
   "marks": {k2: YARD[k2] for k2 in ["C1", "C2", "cop1", "cop2", "det", "stack"]}},
  "court": {"origin": [1000, 0, 0], "axes": "the court front is z 0 (faces +z, the plaza); the doors at x -1.2..1.2; the signpost on the plaza at x 4.3",
   "light": "day", "sun": [-30, 42], "open_sides": "+z",
   "objects": [
    {"id": "front", "build": "new: Mansfield court front x -8..8, 9 m: red brick with cream stone bands, a tall glass entrance x -1.2..1.2 with a canopy, the letters MANSFIELD MAGISTRATES' COURT, windows in rows", "pos": [0, 4.5, -0.2], "size": [16, 9, 0.4]},
    {"id": "board", "build": "new: a glass-fronted notice board 90 x 70 cm on the wall left of the doors: the daily list with one sheet PLEA HEARING / NOTTINGHAM CROWN COURT / 15 DEC (no names)", "pos": COURT["board"], "size": [0.9, 0.7, 0.05]},
    {"id": "signpost", "build": "new: a black-and-white finger post with three arms: RETFORD (pointing +x), MANSFIELD CENTRE, NOTTINGHAM", "pos": [4.3, 1.4, 6.2], "size": [0.1, 2.8, 0.1]},
    {"id": "plaza", "build": "new: paved plaza with two low steps at the door, planters with red flowers, autumn trees (orange and yellow), bollards, a bench nobody uses, parked cars at the kerb, houses opposite", "pos": [0, 0, 6], "size": [30, 0.2, 14]}],
   "marks": {"signpost": COURT["signpost"]}},
  "courtroom": {"origin": [1200, 0, 0], "axes": "the wall TV is on the back wall z -4 at x -1.8; the glass dock at x 0.6..3.3; the lens at +z",
   "light": "day", "sun": [10, 40], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: courtroom x -4..4, z -4..4, 4.2 m: warm oak panelling, cream walls above, green carpet, tall windows with blue sky, the bench (empty) and a clerk's desk", "pos": [0, 2.1, 0], "size": [8, 4.2, 8]},
    {"id": "tv", "build": "new: wall TV 1.7 x 0.96 m: a video link in three tiles, two men in prison-grey sweatshirts against cell walls with a barred window, one man at home in front of a bookshelf", "pos": ROOM["tv"], "size": [1.7, 0.96, 0.05]},
    {"id": "dock", "build": "new: the glass dock x 0.6..3.3, z -1.7..-0.4: an oak base 0.4 m, glass panels to 1.15 m, three men standing in it", "pos": [1.95, 0.58, -1.05], "size": [2.7, 1.15, 1.3]}],
   "marks": {}}},
 "cast": {
  "A": {"look": ["green hoodie up", "beanie", "eye mask", "black trousers"], "items": ["cordless drill", "cartons"], "views": ["side", "front"]},
  "B": {"look": ["rust-orange hoodie up", "beanie", "eye mask", "black trousers"], "items": ["cartons"], "views": ["front", "side walking"]},
  "officer": {"look": ["hi-vis yellow jacket", "police cap"], "items": [], "views": ["front"]},
  "cop1": {"look": ["hi-vis yellow jacket", "police cap"], "items": [], "views": ["front", "side walking"]},
  "cop2": {"look": ["hi-vis yellow jacket", "police cap"], "items": [], "views": ["front", "side walking"]},
  "det": {"look": ["camel coat", "red scarf", "DETECTIVE lanyard", "short dark hair"], "items": [], "views": ["front"]},
  "C1": {"look": ["teal jacket", "tan trousers", "cap"], "items": ["carton"], "views": ["front", "side walking"]},
  "C2": {"look": ["red jacket", "blue jeans", "hair"], "items": ["carton"], "views": ["front"]},
  "kid": {"look": ["yellow school jumper", "blue trousers"], "items": ["notebook"], "views": ["front"]},
  "kid2": {"look": ["red coat", "bobble hat"], "items": [], "views": ["side walking", "front"]},
  "men": {"look": ["six plain suits: blue, brown, green, maroon, tan, teal; generic faces, no names"], "items": [], "views": ["front", "side walking"]}},
 "scenes": []}

SC = P["scenes"]
def scene(**kw): SC.append(kw)
HOLE = U["hole"]; HR = U["hole_r"]
HOLEP = [[HOLE[0], HOLE[1] + HR, HOLE[2]], [HOLE[0], HOLE[1] - HR, HOLE[2] - HR], [HOLE[0], HOLE[1] - HR, HOLE[2] + HR]]
BELL = U["bell"]; CCTV = U["cctv"]
VY = VAN["yard"]
VANP = [van_world(VY, x, y, z) for x, y, z in [(-2.6, 2.3, -1.0), (2.6, 2.3, 1.0), (-2.6, 0.02, 1.0), (2.6, 0.02, -1.0)]]

scene(id="S01", hero=True, f=[0, 110], set="unit", light="night",
  vo="Họ khoan xuyên một bức tường lúc một giờ sáng",
  gloss="They drilled through a wall at one in the morning",
  spine=1, viewer="A wall at night, the last drill hole, and the brick plug crashing in: they are through.",
  **{"in": {"type": "open on the act"}, "out": {"type": "travel", "to": "S02", "note": "the camera dollies through the hole into the warehouse"}},
  build="new: the side wall with the ring of 22 drilled holes and the plug; A's cordless drill (yellow body, black grip, 20 cm bit).",
  blocking="A at A_drill, side view facing the wall (-x), drill held level at the ring's last hole (lower right, nearest him); f40 he steps back to A_wait.",
  action="f0 the drill already turning in the last hole (a dust plume spits from it every 3 f); f20-28 the bit breaks through (a puff inside the ring); f28 the last dot is dark: the ring is closed; f29-31 he pulls the drill out; f32 ('tường') the plug tips inward about its bottom edge, falls 90 deg in 8 f and slams flat on the warehouse floor (f40), four loose bricks hop and settle by f60; warm light floods out of the round hole; f40-52 A steps back; f55 title 1:00 AM; f70-110 the camera pushes to the hole.",
  acting="A: effort squint while drilling, a satisfied nod on the crash.",
  cams=[kf(0, body(U["A_drill"]) + HOLEP + [[6.0, 2.2, -4.0]], az=24, el=-6, fov=44, push=0.0008, why="the wall, the ring of holes and A with the drill, full body"),
        k(76, [8.2, 1.05, -4.0], [5.0, 0.98, -4.0], 44, glide=34, push=0.0, why="square up to the hole: warm light inside")],
  kicks=[[32, 0.9], [40, 0.6]],
  marks=[{"who": "A", "at": U["A_drill"], "view": "side, facing -x", "pose": "drilling f0-29; steps back f40-52 to A_wait", "expr": "stern -> grin"}],
  subjects=[{"n": "A head", "p": HEAD(U["A_drill"]), "f": [0, 60]}, {"n": "hole", "p": HOLE, "f": [0, 109]}],
  physics="the plug: hinged fall about its bottom edge (rigid, 60 kg), lands flat with a 2 cm bounce; four loose bricks (2.5 kg each) hop and settle (analytic bounces, restitution 0.3); dust puffs.",
  light_mood="rich blue night, moon and clouds; warm sodium lamp on the yard; warm interior light through the hole.",
  sound="drill whine f0-29; a crunch f20; a heavy masonry crash f40; brick clatter f44-60; a low string hit on f32.",
  after="The plug lies flat inside; the hole stays open until S17.")

scene(id="S02", f=[110, 178], set="unit", light="night",
  vo="để khuân đi hai mươi sáu hộp thẻ Pokémon",
  gloss="to carry off twenty-six boxes of Pokémon cards",
  spine=1, viewer="Inside: racks of cartons; B lifts one off and passes it out through the hole.",
  **{"in": {"type": "travel", "from": "S01"}, "out": {"type": "cut", "to": "S03"}},
  build="the warehouse: racks of cartons (TRADING CARDS / FRAGILE), the plug lying on the floor, ceiling lights.",
  blocking="B at B_rack (front view) lifts a carton from the third shelf f116-128, walks to B_hole f130-146 and pushes it into the hole f146-160.",
  action="f110-116 the camera passes through the hole (along z -4); f112 title 26; f116-128 B slides a carton off the rack; f130-146 B carries it to the hole; f146-160 he pushes it into the tunnel; f160-178 the carton slides out through the tunnel.",
  acting="B: quick, careful, eyes on the hole.",
  cams=[k(110, [5.25, 1.0, -4.0], [3.0, 0.95, -3.7], 46, glide=8, push=0.0, why="through the hole"),
        k(124, [4.95, 1.6, -0.35], [5.0, 1.0, -3.3], 56, glide=20, push=0.0006, why="inside: B, the racks of cartons, the hole")],
  kicks=[],
  marks=[{"who": "B", "at": U["B_rack"], "view": "front", "pose": "lifts a carton f116-128; walks to B_hole f130-146; pushes it into the hole f146-160", "expr": "nervous"}],
  subjects=[{"n": "B head", "p": HEAD(U["B_hole"]), "f": [148, 176]}],
  physics="the carton: kinematic in his hands.", light_mood="warm warehouse light, the hole a dark-blue circle of night.", sound="cardboard scrape f118; footsteps; a soft thud as the carton slides into the tunnel f150.",
  after="A gap on the third shelf.")

scene(id="S03", f=[178, 254], set="unit", light="night",
  vo="và chuông báo động réo thẳng về đồn cảnh sát",
  gloss="and the alarm bell rang straight through to the police station",
  spine=1, viewer="The bell rattles; its line runs pole to pole to the police station, where a red lamp flashes and the officer turns.",
  **{"in": {"type": "cut", "from": "S02"}, "out": {"type": "travel", "to": "S04", "note": "the camera flies back along the road to the wide of the estate"}},
  build="the bell box and its cable, the telephone poles and the line, the police station and its lit window.",
  blocking="Officer at the officer mark inside the station, front view; turns his eyes to the panel at f236.",
  action="f181 ('chuông') the bell hammer rattles (2 mm shake, 6 Hz), the blue strobe flashes; f188-214 the camera climbs the cable to the roof edge and the first pole; f214-236 it races east along the line, pole to pole; f229 the station's alarm-panel lamp flashes red (on 6 f / off 6 f); f236 the officer's eyes snap to it.",
  acting="Officer: calm -> alert.",
  cams=[k(178, [8.5, 3.15, -0.7], [BELL[0], BELL[1], BELL[2]], 34, cut=True, push=0.0008, why="the bell rattles"),
        k(200, [9.2, 6.4, 0.8], [6.6, 6.0, 3.5], 44, glide=16, push=0.0, why="up the cable to the line"),
        k(214, [36.0, 7.0, 1.6], [48.0, 6.0, 3.5], 46, glide=18, push=0.0, why="along the line, pole to pole"),
        k(228, [58.4, 1.85, 9.4], [58.3, 1.45, 15.0], 42, glide=16, push=0.0008, why="the station window: the red lamp and the officer")],
  kicks=[[181, 0.4]],
  marks=[{"who": "officer", "at": U["officer"], "view": "front", "pose": "standing at the desk; eyes to the panel f236", "expr": "neutral -> shock"}],
  subjects=[{"n": "bell", "p": BELL, "f": [182, 196]}, {"n": "officer head", "p": HEAD(U["officer"]), "f": [244, 253]}],
  physics="none.", light_mood="night; the station window warm, the blue POLICE lamp, the red alarm lamp.", sound="the alarm bell (synth bell, continuous from f181 under everything to f670, ducked); a whoosh along the line f214-236; a beep-beep from the panel f229.",
  after="The bell keeps ringing (heard) until S07.")

scene(id="S04", f=[254, 415], set="unit", light="night",
  vo="Đó là một kho hàng ở thị trấn Retford, nước Anh, rạng sáng cuối tháng mười hai năm ngoái.",
  gloss="It was a warehouse in the town of Retford, England, before dawn at the end of last December.",
  spine=1, viewer="The whole place at once: RETFORD sign, the TRADING CARDS unit with its window of cards, Christmas lights, the van in the side yard.",
  **{"in": {"type": "travel", "from": "S03"}, "out": {"type": "dissolve", "to": "S05", "n": 8, "note": "days earlier"}},
  build="the estate wide: the RETFORD town sign, the unit's sign and window, Christmas bulbs and the wreath, the side yard with the van and the lamp post with the camera.",
  blocking="A and B small in the side yard, carrying cartons from the hole to the van.",
  action="f254-300 the camera flies back from the station and settles on the wide; f300-415 slow push; f368 title 12/2025 ('tháng mười hai' f372); the Christmas bulbs twinkle (each bulb 30 f on, 4 f dim); A walks hole -> van with a carton f300-340, B f350-390.",
  acting="none.",
  cams=[kf(254, [[U["sign"][0] - 3.5, U["sign"][1] + 0.4, 0.06], [U["sign"][0] + 3.5, U["sign"][1] - 0.4, 0.06], [VY[0], 2.3, VY[1]], [VY[0], 0.02, VY[1] + 2.6], [U["town_sign"][0], 2.4, U["town_sign"][1]], [U["town_sign"][0], 0.02, U["town_sign"][1]], [2.5, 0.02, 0.0]], az=-12, el=-7, fov=56, d_max=70.0, glide=44, push=0.0001, why="the wide: town sign, unit, yard, van")],
  kicks=[],
  marks=[{"who": "A", "at": U["A_load"], "view": "side walking", "pose": "hole -> van with a carton f300-340", "expr": "neutral"}],
  subjects=[{"n": "sign", "p": U["sign"], "f": [300, 414]}, {"n": "van", "p": [VY[0], 1.2, VY[1]], "f": [300, 414]}, {"n": "town sign", "p": [U["town_sign"][0], 1.6, U["town_sign"][1]], "f": [300, 414]}],
  physics="none.", light_mood="rich blue night; warm windows and bulbs.", sound="night air, a far dog, the bell under it; a soft music-box Christmas sting f372.",
  after="Unchanged.")

LAY = VAN["layby"]
CAB = van_world(LAY, 1.05, 1.55, -0.05); CABLOOK = van_world(LAY, 8.0, 0.62, 0.2)
scene(id="S05", f=[415, 548], set="unit", light="day",
  vo="Theo cảnh sát, cả nhóm đã nhắm vào nơi này suốt nhiều ngày.",
  gloss="According to police, the group had been targeting the place for days.",
  spine=2, viewer="From the van across the road: the shop, and the dashboard calendar tearing 22, 23, 24 DEC.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S04"}, "out": {"type": "cut", "to": "S06"}},
  build="the van in the lay-by opposite (nose toward the unit), its cab: dash, wheel, a tear-off desk calendar on the dash; the unit by day (cards in the window, wreath).",
  blocking="Nobody in frame (the cab is empty: we look out from it); a customer walks into the shop f430-470.",
  action="f415-548 locked through the windscreen; the calendar's top page tears off and drops into the footwell at f455 (22 -> 23), f490 (23 -> 24), f522 (24 -> 26: the night of the break-in; 25 is torn with 24); each page lifts at its top corner, flips and flutters down in 10 f.",
  acting="none.",
  cams=[k(415, CAB, CABLOOK, 50, push=0.0002, why="through the windscreen: the shop across the road, the calendar on the dash")],
  kicks=[],
  marks=[],
  subjects=[{"n": "shop door", "p": [2.5, 1.2, 0.0], "f": [415, 547]}, {"n": "calendar", "p": van_world(LAY, 2.12, 1.25, 0.06), "f": [415, 547]}],
  physics="calendar pages: light, a curl and flutter (scripted sine fall).", light_mood="bright winter day, blue sky with clouds.", sound="a ticking clock under it; a paper tear on each page f455, f490, f522.",
  after="The calendar reads 26 DEC.")

AF, BF = U["A_freeze"], U["B_freeze"]
scene(id="S06", f=[548, 671], set="unit", light="night",
  vo="Khoan, chuẩn bị nhiều ngày mà vẫn bị chuông báo động bắt quả tang?",
  gloss="Wait, days of preparation and they still got caught red-handed by the alarm?",
  spine=2, viewer="The two of them frozen by the hole with cartons in their arms, the bell ringing above, red light washing over them.",
  **{"in": {"type": "cut", "from": "S05"}, "out": {"type": "tilt", "to": "S07"}},
  build="as S01 after the breach; the bell box ringing.",
  blocking="A at A_freeze and B at B_freeze, front view, each holding a carton at the chest; frozen.",
  action="f548 hard cut ('Khoan'): both frozen mid-step, eyes wide to the lens; f600-645 slow push; f631-670 ('bắt quả tang') the red strobe on the bell box flashes and washes the frame red (8 f on / 8 f off).",
  acting="A and B: nervous, a sweat drop each; frozen.",
  cams=[kf(548, body(AF) + body(BF) + HOLEP + [[BELL[0], BELL[1] + 0.3, BELL[2]]], az=78, el=-6, fov=46, push=0.001, cut=True, why="frozen at the hole, the bell above")],
  kicks=[[548, 0.6], [631, 0.4]],
  marks=[{"who": "A", "at": AF, "view": "front", "pose": "carton at the chest, frozen", "expr": "nervous"}, {"who": "B", "at": BF, "view": "front", "pose": "carton at the chest, frozen", "expr": "shock"}],
  subjects=[{"n": "A head", "p": HEAD(AF), "f": [548, 670]}, {"n": "B head", "p": HEAD(BF), "f": [548, 670]}, {"n": "bell", "p": BELL, "f": [548, 670]}],
  physics="none.", light_mood="night; the red strobe.", sound="record scratch + Huh (meme) f548; the bell louder; a sting f631.",
  after="Unchanged.")

scene(id="S07", hero=True, f=[671, 827], set="unit", light="night",
  vo="Hóa ra, chuông chưa phải rắc rối lớn nhất. Camera mới là rắc rối lớn.",
  gloss="Turns out the bell wasn't the biggest problem. The camera was the big problem.",
  spine=3, viewer="The bell is small; up on the lamp post the camera is big, its REC lamp blinks on and it swivels to watch the van being loaded.",
  **{"in": {"type": "tilt", "from": "S06"}, "out": {"type": "glide", "to": "S08"}},
  build="the lamp post with the CCTV camera (REC lamp, swivel head), the van in the yard with its side door open.",
  blocking="A at A_load carries a carton from the hole to the van's side door and back (side view walking), f700-760 and f770-820.",
  action="f671-700 the camera tilts from the bell; f700-740 it pans and tilts up the lamp post to the camera head; f754 ('Camera') the REC lamp blinks on (15 f on / 15 f off from here to S10) and the head swivels 40 deg down toward the van (f756-772); f780-827 the camera pulls back and down to show the post, its camera and the van being loaded under it.",
  acting="A: busy, never looks up.",
  cams=[k(671, [9.6, 1.6, -6.4], [BELL[0], BELL[1], BELL[2]], 40, glide=20, push=0.0008, why="the small bell"),
        k(700, [10.3, 2.4, -6.8], [CCTV[0], CCTV[1], CCTV[2]], 36, glide=36, push=0.0012, why="up the post to the camera: it is the big one"),
        kf(782, body(U["A_load"]) + VANP + [[CCTV[0], CCTV[1] + 0.35, CCTV[2]], HOLE], az=8, el=-8, fov=50, glide=36, push=0.0006, why="the camera watching the van being loaded")],
  kicks=[[754, 0.5]],
  marks=[{"who": "A", "at": U["A_load"], "view": "side walking", "pose": "hole -> van door with a carton, and back", "expr": "neutral"}],
  subjects=[{"n": "bell", "p": BELL, "f": [671, 700]}, {"n": "cctv", "p": CCTV, "f": [730, 780]}, {"n": "A head", "p": HEAD(U["A_load"]), "f": [815, 826]}, {"n": "van", "p": [VY[0], 1.2, VY[1]], "f": [815, 826]}],
  physics="none.", light_mood="night; the sodium lamp; the REC lamp's red dot.", sound="the bell fades under; a low drone; Camera shutter (meme) f754; a servo whirr on the swivel f756.",
  after="The camera keeps watching (REC) through S08.")

def follow(f, back=10.0, side=4.0, hgt=4.2, ahead=7.0, fov=46, glide=22):
    x, z, h = van_at(f); a = math.radians(h); dx, dz = math.cos(a), math.sin(a)
    pos = [x - dx * back - dz * side, hgt, z - dz * back + dx * side]
    look = [x + dx * ahead, 1.4, z + dz * ahead]
    return k(f, pos, look, fov, glide=glide, push=0.0, why="follow the van west")
PLATE = van_world(VY, -2.69, 0.56, 0.0)
scene(id="S08", hero=True, f=[827, 994], set="unit", light="night",
  vo="Chiếc xe tải chở hộp thẻ mang biển số nhái, chạy về phía nam Yorkshire rồi vòng sang Manchester.",
  gloss="The van carrying the boxes wore cloned plates and headed south toward Yorkshire, then swung over to Manchester.",
  spine=3, viewer="A printed plate taped over the real one; the van pulls out and runs west under SOUTH YORKSHIRE, then MANCHESTER; every road camera's red lamp blinks as it passes.",
  **{"in": {"type": "glide", "from": "S07"}, "out": {"type": "dissolve", "to": "S09", "n": 8, "note": "match: the taped plate becomes the notebook's name label"}},
  build="the taped plate (TK18 RVW printed on paper over YD68 PQX, a lifting corner of tape), the van's tail lights; the road west, the gantries, the road cameras.",
  blocking="Nobody on foot (A and B in the van).",
  action="f827-860 glide down to the back of the van; f860-890 insert on the plate ('biển số nhái' f872-890): the tape corner flutters; f885 the van pulls forward out of the yard, turns west onto the road (f897-915) and runs at 30 m/s; f915-994 the camera follows behind and above; each road camera's REC lamp lights as the van passes it; the gantries: SOUTH YORKSHIRE overhead at f936 ('nam Yorkshire'), MANCHESTER at f976.",
  acting="none.",
  cams=[k(827, [PLATE[0], 0.8, PLATE[2] - 1.45], PLATE, 32, glide=30, push=0.0010, why="the taped plate")] +
       [follow(f) for f in range(906, 994, 8)],
  kicks=[[872, 0.3]],
  marks=[],
  subjects=[{"n": "plate", "p": PLATE, "f": [862, 884]}],
  physics="the van: kinematic along the plan's van_route; a 2 cm body roll in the turn.", light_mood="night; warm sodium lamps along the road; the van's red tail lights.", sound="van engine start f880, revs, tyre hiss; a whoosh under each gantry f936, f976; a REC beep for each camera.",
  after="The van has gone west.")

K_ = KID; KD = K_["kid"]; BOOK = [K_["book"][0], K_["desk_y"] + 0.006, K_["book"][1]]
scene(id="S09", f=[994, 1207], set="kidroom", light="day",
  vo="Bạn thấy đấy, biển số nhái giống như đổi tên trên bìa vở: bìa đổi rồi, nhưng chữ viết bên trong vẫn là của bạn.",
  gloss="You see, a cloned plate is like changing the name on a notebook cover: the cover's changed, but the handwriting inside is still yours.",
  spine=3, viewer="A kid swaps the name label on his notebook; inside, his old name is at the top of every page.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S08"}, "out": {"type": "dissolve", "to": "S10", "n": 8}},
  build="the kid's room; the tall desk; the notebook with its MINH label, the AN label on a backing sheet.",
  blocking="Kid at the kid mark behind the desk, front view.",
  action="f994-1040 calm medium on the kid at the desk; f1040 glide to the notebook; f1051 ('đổi tên') he peels the MINH label off (it curls up from its left edge over 10 f and lifts away in his hand); f1066-1094 he presses the AN label on ('bìa vở' f1070, 'bìa đổi rồi' f1094); f1124 ('nhưng') he opens the cover (hinged at the spine, 180 deg over 12 f); f1135-1190 the pages: MINH at the top of every page in the same wobbly hand ('chữ viết bên trong vẫn là của bạn'); f1180-1207 back to him: a guilty grin.",
  acting="Kid: sly -> proud -> caught-out grin.",
  cams=[kf(994, body(KD, KIDH) + [[-0.6, 0.86, 0.3], [0.6, 0.86, 0.3]], az=0, el=-10, fov=42, push=0.0006, why="calm: the kid at the desk with the notebook"),
        k(1040, [0.05, 1.45, 0.5], [0.05, 0.87, -0.07], 30, glide=18, push=0.0006, why="the label"),
        k(1132, [-0.05, 1.7, 0.78], [-0.05, 0.87, -0.06], 32, glide=16, push=0.0008, why="the pages: MINH on every one"),
        kf(1180, body(KD, KIDH) + [[-0.6, 0.86, 0.3], [0.6, 0.86, 0.3]], az=0, el=-10, fov=42, glide=20, push=0.0006, why="him: caught out")],
  kicks=[],
  marks=[{"who": "kid", "at": KD, "view": "front", "pose": "peels the label f1051-1062, sticks the new one f1066-1094, opens the cover f1124-1136", "expr": "smile -> grin -> nervous"}],
  subjects=[{"n": "kid head", "p": HEAD(KD, KIDH), "f": [994, 1036]}, {"n": "book", "p": BOOK, "f": [1050, 1180]}],
  physics="the label: a curl (scripted); the cover: hinged.", light_mood="warm day light through the window.", sound="soft vibes theme; a sticky peel f1051; a pat f1094; a page flop f1124; a little 'uh-oh' pluck f1157.",
  after="The notebook is open; it says AN on the cover and MINH inside.")

C_ = CTRL; OFF = C_["officer"]
MAPC = [(C_["map"][0] + C_["map"][1]) / 2, (C_["map"][2] + C_["map"][3]) / 2, -2.97]
MAN_END = [C_["map"][0] + C_["route"][-1][0] * (C_["map"][1] - C_["map"][0]), C_["map"][3] - C_["route"][-1][1] * (C_["map"][3] - C_["map"][2]), -2.97]
scene(id="S10", f=[1207, 1322], set="ctrl", light="day",
  vo="Camera vẫn thấy chiếc xe rẽ ở đâu, qua những con đường nào.",
  gloss="The cameras still saw where the van turned, which roads it took.",
  spine=3, viewer="A wall of monitors, every one showing the same dented van with the orange ladder; the route draws itself across the map to Manchester.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S09"}, "out": {"type": "dissolve", "to": "S11", "n": 8}},
  build="the control room; the map screen; six monitors with the van.",
  blocking="Officer at the officer mark, front view, pointing at the map; an aide by the left wall with a mug.",
  action="f1207-1300 the monitors light one by one (every 12 f) as the van reaches each camera; the red route grows from RETFORD west to MANCHESTER in step ('rẽ ở đâu' f1249-1265, 'con đường nào' f1286-1304); f1290 the officer points at MANCHESTER; f1290-1322 push into the route's end.",
  acting="Officer: focused, a nod.",
  cams=[kf(1207, body(OFF) + [[C_["map"][0], C_["map"][3], -2.97], [C_["mons"][1], C_["mons"][3], -2.97], [C_["map"][0], C_["map"][2], -2.97]], az=0, el=-6, fov=48, push=0.0006, why="the monitors and the map, the officer full body"),
        k(1290, [MAN_END[0] + 0.3, MAN_END[1] - 0.05, -1.25], MAN_END, 34, glide=28, push=0.001, why="the route ends at Manchester")],
  kicks=[],
  marks=[{"who": "officer", "at": OFF, "view": "front", "pose": "points at the map f1290-1322", "expr": "stern"}, {"who": "aide", "at": C_["aide"], "view": "front", "pose": "holds a mug", "expr": "neutral"}],
  subjects=[{"n": "officer head", "p": HEAD(OFF), "f": [1207, 1285]}, {"n": "map", "p": MAPC, "f": [1207, 1285]}],
  physics="none.", light_mood="warm interior; the screens glow.", sound="soft data blips per monitor; a rising arpeggio as the route draws; a lock-on beep f1300.",
  after="The route is drawn.")

Y_ = YARD; YV = Y_["van"]
YVANP = [van_world(YV, x, y, z) for x, y, z in [(-2.6, 2.3, -1.0), (2.6, 2.3, 1.0), (-2.6, 0.02, 1.0)]]
C1, C2 = Y_["C1"], Y_["C2"]
HAM = Y_["hammer"]
scene(id="S11", hero=True, f=[1322, 1553], set="yard", light="golden",
  vo="Cảnh sát chặn nó ở một bãi chứa đồ tại Manchester. Hai người bị bắt ngay lúc đang bốc hộp xuống, cùng một cây búa tạ trong xe.",
  gloss="Police stopped it at a storage yard in Manchester. Two men were arrested right as they were unloading the boxes, along with a sledgehammer in the van.",
  spine=4, viewer="Dawn at the yard: two men carrying cartons into a container; a police car swings across the gate; they freeze; a carton drops; the sledgehammer in the van.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S10"}, "out": {"type": "glide", "to": "S12"}},
  build="the yard: containers, the open one, the van backed up with its rear doors open, the gate; the police car; the sledgehammer.",
  blocking="C1 and C2 carry cartons van -> container (C1 at C1, C2 at C2, front view); cop1 and cop2 get out of the car (f1365) and walk to their marks (f1370-1430).",
  action="f1322-1337 the men carry cartons; f1337 ('chặn') the police car swings in from the right and stops across the gate (f1337-1352), the light bar flashes blue; f1365 the doors open, the officers walk in; f1438 ('bắt') both men freeze (shock); f1440 C2's carton drops from his chest, lands at f1452, bounces twice and settles on its side by f1470 (closed); f1500 glide into the van's open back: the sledgehammer on the floor ('búa tạ' f1510).",
  acting="C1, C2: busy -> shock. Officers: firm.",
  cams=[kf(1322, body(C1) + body(C2) + YVANP + [[Y_["car_stop"][0] - 2.3, 1.6, Y_["car_stop"][1]], [Y_["car_stop"][0] + 2.3, 1.6, Y_["car_stop"][1]]], az=80, el=-8, fov=50, push=0.0005, why="the yard: van, container, the men, the gate behind"),
        kf(1420, body(C1) + body(C2) + body(Y_["cop1"]) + body(Y_["cop2"]), az=75, el=-6, fov=46, glide=24, push=0.001, why="the arrest"),
        k(1498, [YV[0] + 0.05, 1.3, 0.25], HAM, 34, glide=16, push=0.0008, why="the sledgehammer in the van")],
  kicks=[[1352, 0.5], [1438, 0.6], [1452, 0.4]],
  marks=[{"who": "C1", "at": C1, "view": "front", "pose": "carton at the chest", "expr": "neutral -> shock"}, {"who": "C2", "at": C2, "view": "front", "pose": "carton at the chest; drops it f1440", "expr": "neutral -> shock"},
         {"who": "cop1", "at": Y_["cop1"], "view": "side walking then front", "pose": "walks in f1370-1430", "expr": "stern"}, {"who": "cop2", "at": Y_["cop2"], "view": "side walking then front", "pose": "walks in f1370-1430", "expr": "stern"}],
  subjects=[{"n": "C1 head", "p": HEAD(C1), "f": [1322, 1495]}, {"n": "C2 head", "p": HEAD(C2), "f": [1322, 1495]}, {"n": "hammer", "p": HAM, "f": [1515, 1552]}],
  physics="the car: kinematic slide-and-swing with a 3 cm body pitch on the stop; the carton: drop 1.1 m (g), two bounces (restitution 0.3), a 90 deg tip onto its side.",
  light_mood="pink-orange dawn, long warm light, blue sky with clouds; blue flashes from the light bar.", sound="siren whoop f1337; tyre skid f1340-1352; car doors f1365; footsteps; a cardboard thud f1452, f1460; a steel 'ting' on the hammer f1510.",
  after="The dropped carton lies on its side by C2 through S12.")

DET = Y_["det"]; STK = Y_["stack"]
scene(id="S12", f=[1553, 1706], set="yard", light="golden",
  vo="Thám tử phụ trách nói, chỉ trong vài giờ, họ đã bắt hai nghi phạm và lấy lại số hàng bị mất.",
  gloss="The detective in charge said that within a few hours they had arrested two suspects and recovered the stolen goods.",
  spine=4, viewer="The detective beside the recovered stack of 26 cartons as the sun rises over the containers.",
  **{"in": {"type": "glide", "from": "S11"}, "out": {"type": "dissolve", "to": "S13", "n": 8, "note": "eleven months later"}},
  build="the recovered stack (26 cartons on a pallet, police tape round it), the detective; the sun disc low over the containers.",
  blocking="Detective at det, front view; cop1 behind at the car.",
  action="f1553-1600 glide out of the van to the detective and the stack; f1588 ('chỉ trong vài giờ') she taps her watch; f1650 she nods at the stack ('lấy lại'); the sun climbs 2 deg over the scene.",
  acting="Detective: brisk, satisfied.",
  cams=[kf(1553, body(DET) + [[STK[0] - 0.7, 1.55, STK[1]], [STK[0] + 0.7, 0.02, STK[1]]], az=-20, el=-6, fov=44, glide=34, push=0.0007, why="the detective and the recovered stack")],
  kicks=[],
  marks=[{"who": "det", "at": DET, "view": "front", "pose": "taps her watch f1588; nods at the stack f1650", "expr": "stern -> smile"}],
  subjects=[{"n": "det head", "p": HEAD(DET), "f": [1590, 1705]}, {"n": "stack", "p": [STK[0], 0.8, STK[1]], "f": [1590, 1705]}],
  physics="none.", light_mood="golden morning sun, warm.", sound="birds; a radio crackle; a warm brass chord on 'lấy lại' f1685.",
  after="Unchanged.")

CO = COURT; MEN = CO["men"]
scene(id="S13", f=[1706, 1900], set="court", light="day",
  vo="Mười một tháng sau, sáu người đàn ông bị buộc tội âm mưu trộm cắp ra tòa ở Mansfield.",
  gloss="Eleven months later, six men charged with conspiracy to commit burglary appeared in court in Mansfield.",
  spine=5, viewer="The Mansfield court in autumn sun, six men in suits waiting in front of the doors.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 6, "note": "through the doors"}},
  build="the court front, the plaza, autumn trees, the six men.",
  blocking="Six men at the six men marks, front view, standing apart in a loose line.",
  action="f1706-1780 the camera cranes down from the lettering to the doors; f1708 title 11 THANG SAU; f1765 ('sáu người') the six are all in frame; slow push to f1900; one adjusts his tie f1810, one checks his watch f1850.",
  acting="The six: tense, neutral.",
  cams=[k(1706, [0.0, 7.6, 21.0], [0.0, 5.6, 0.0], 44, push=0.0, why="the court's lettering"),
        kf(1762, sum([body(m) for m in MEN], []) + [[-1.2, 2.6, 0.0], [1.2, 2.6, 0.0]], az=0, el=-6, fov=46, glide=46, push=0.0006, why="the six in front of the doors")],
  kicks=[],
  marks=[{"who": f"man{i + 1}", "at": m, "view": "front", "pose": "standing", "expr": "neutral"} for i, m in enumerate(MEN)],
  subjects=[{"n": "man1 head", "p": HEAD(MEN[0]), "f": [1810, 1899]}, {"n": "man6 head", "p": HEAD(MEN[5]), "f": [1810, 1899]}],
  physics="falling leaves (light, sine flutter).", light_mood="crisp autumn sun, blue sky with clouds.", sound="town ambience, a bus far off; a low serious piano.",
  after="Unchanged.")

RM = ROOM; TV = RM["tv"]; DM = RM["dock_men"]
scene(id="S14", f=[1900, 1946], set="courtroom", light="day",
  vo="Hai người bị tạm giam.",
  gloss="Two were remanded in custody.",
  spine=5, viewer="The wall TV's video link: two of the men in prison grey; three more in the glass dock.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S13"}, "out": {"type": "cut", "to": "S15"}},
  build="the courtroom, the dock, the wall TV.",
  blocking="Three men in the dock (front view).",
  action="f1900-1912 the courtroom; f1912-1946 push onto the TV's two prison tiles ('tạm giam' f1920).",
  acting="Dock men: still.",
  cams=[kf(1900, sum([body(m) for m in DM], []) + [[TV[0] - 0.85, TV[1] + 0.48, TV[2]], [TV[0] + 0.85, TV[1] - 0.48, TV[2]]], az=0, el=-4, fov=48, push=0.0004, why="the TV and the dock"),
        k(1912, [TV[0] - 0.25, TV[1] - 0.05, -0.9], [TV[0] - 0.25, TV[1], TV[2]], 30, glide=22, push=0.0008, why="the two prison tiles")],
  kicks=[[1920, 0.3]],
  marks=[{"who": f"man{i + 1}", "at": m, "view": "front", "pose": "standing in the dock", "expr": "neutral"} for i, m in enumerate(DM)],
  subjects=[{"n": "tv", "p": TV, "f": [1900, 1945]}],
  physics="none.", light_mood="warm courtroom light.", sound="a gavel-free hush; a low bass note f1920.",
  after="Unchanged.")

OUT = CO["out"]
scene(id="S15", f=[1946, 2143], set="court", light="day",
  vo="Bốn người được tại ngoại, với điều kiện không liên lạc với nhau, và không được bén mảng tới một cửa hàng thẻ bài ở Retford.",
  gloss="Four were bailed, on condition that they don't contact each other and don't go near a trading card shop in Retford.",
  spine=5, viewer="Three come out, glance at each other and walk off three different ways; one sets off toward the RETFORD sign, stops, turns round.",
  **{"in": {"type": "cut", "from": "S14"}, "out": {"type": "glide", "to": "S16"}},
  build="the court front, the signpost with its RETFORD arm.",
  blocking="Three men come out of the doors (from out_from) to the out marks f1950-1990; they glance at each other f1995-2005; f2008 they turn away: L walks to goL, C to goC, R to goR (the signpost) f2010-2075; R stops at f2082 ('tới'), turns round and walks to backR f2090-2140.",
  action="as blocking; the doors swing open f1948 and shut f1995.",
  acting="The three: awkward glances, then each looks away; R: a double take at the sign.",
  cams=[kf(1946, sum([body(m) for m in OUT], []) + [[-1.2, 2.6, 0.0], [CO["signpost"][0], 2.8, CO["signpost"][1]], [CO["signpost"][0], 0.02, CO["signpost"][1]]], az=-6, el=-6, fov=50, push=0.0004, cut=True, why="the doors, the three men, the RETFORD sign")],
  kicks=[[2082, 0.3]],
  marks=[{"who": "L", "at": OUT[0], "view": "front then side walking", "pose": "walks off left", "expr": "nervous"}, {"who": "C", "at": OUT[1], "view": "front then side walking", "pose": "walks off toward the lens and left", "expr": "neutral"},
         {"who": "R", "at": OUT[2], "view": "front then side walking", "pose": "walks to the signpost, stops f2082, turns back f2090", "expr": "neutral -> shock"}],
  subjects=[{"n": "R head", "p": HEAD(CO["goR"]), "f": [2075, 2095]}, {"n": "signpost", "p": [CO["signpost"][0], 2.6, CO["signpost"][1]], "f": [1946, 2142]}],
  physics="the doors: hinged.", light_mood="autumn sun.", sound="door swish f1948; footsteps; a record-skip 'nope' pluck on the turn f2085.",
  after="All three gone their separate ways.")

BRD = CO["board"]
scene(id="S16", f=[2143, 2225], set="court", light="day",
  vo="Tất cả mới bị cáo buộc, chưa ai bị kết án.",
  gloss="All of them are only accused; none has been convicted.",
  spine=5, viewer="The notice board: PLEA HEARING, NOTTINGHAM CROWN COURT, 15 DEC. No names.",
  **{"in": {"type": "glide", "from": "S15"}, "out": {"type": "dissolve", "to": "S17", "n": 8}},
  build="the notice board and its sheet.",
  blocking="Nobody.",
  action="f2143-2170 glide to the board; slow push; stillness.",
  acting="none.",
  cams=[k(2143, [BRD[0] + 0.15, BRD[1] - 0.05, 2.1], BRD, 36, glide=26, push=0.0008, why="the board: allegations only")],
  kicks=[],
  marks=[],
  subjects=[{"n": "board", "p": BRD, "f": [2175, 2224]}],
  physics="none.", light_mood="calm autumn sun.", sound="quiet; one soft piano note f2172.",
  after="Unchanged.")

KW, KDR = U["kid_walk"], U["kid_door"]
scene(id="S17", f=[2225, 2425], set="unit", light="day",
  vo="Họ khoan xuyên được bức tường. Nhưng giờ, cánh cửa của cái tiệm ấy, họ không được phép đến gần.",
  gloss="They got through the wall. But now, the door of that shop, they aren't allowed to come near.",
  spine=6, viewer="The wall's patched ring of paler bricks; round the corner, the shop door with real cards in the window opens for a kid and the bell rings.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S16"}, "out": {"type": "end"}},
  build="the side wall with the bricked-up ring; the front by day: cards in the window, wreath, the door with its bell; a kid customer.",
  blocking="Kid2 walks from kid_walk to kid_door f2262-2292 (side view), pushes the door f2295 and steps in f2300-2320.",
  action="f2225-2262 hold on the patched ring ('bức tường' f2255); f2262-2300 glide round the corner to the front door; f2295 ('cánh cửa') the door swings in, the bell jingles; f2320-2425 pull back to the wide: the sign, the window of real cards, the door ajar; hold to the end.",
  acting="Kid2: excited.",
  cams=[k(2225, [8.6, 1.3, -2.4], HOLE, 40, push=0.0008, why="the patched ring"),
        k(2262, [5.2, 1.5, 5.4], [2.0, 1.25, 0.0], 44, glide=40, push=0.0008, why="the door and the window of cards"),
        k(2322, [2.8, 2.6, 13.5], [1.6, 2.2, 0.0], 50, glide=56, push=0.0004, why="the wide: the shop, its door")],
  kicks=[],
  marks=[{"who": "kid2", "at": KDR, "view": "side walking then front", "pose": "walks to the door f2262-2292, pushes it f2295, steps in", "expr": "grin"}],
  subjects=[{"n": "hole", "p": HOLE, "f": [2228, 2260]}, {"n": "door", "p": [2.5, 1.2, 0.0], "f": [2300, 2424]}, {"n": "window", "p": [0.95, 1.4, 0.0], "f": [2300, 2424]}],
  physics="the door: hinged, eased.", light_mood="bright winter sun, blue sky with clouds.", sound="a winter street; the door bell jingle f2295; the theme's last warm chord.",
  after="End on the shop door.")

# quality bar: a character subject is its head AND its feet, so the check fails any shot that cuts a body (inserts excepted)
for sc in SC:
    extra = []
    for sj in sc.get("subjects", []):
        if sj["n"].endswith("head") and not sj.get("nofeet"):
            p = sj["p"]; extra.append({"n": sj["n"].replace("head", "feet"), "p": [p[0], 0.02, p[2]], "f": sj["f"]})
    sc.setdefault("subjects", []).extend(extra)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(SC), "scenes")
