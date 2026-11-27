"""Generator of plan.json for the Mira Mesa (Bubble Mew) reel. The plan is the source of truth: change it here, then
python3 videos/mira-mesa-bubble-mew/mkplan.py && python3 scripts/plan_check.py videos/mira-mesa-bubble-mew/plan.json"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "scripts"))
from plan_fit import fit
def kf(f, pts, az, el, fov, title=False, margin=5.0, **kw):
    """a camera key fitted to its subjects: the closest lens at this view direction that keeps them all in the safe area"""
    pos, look = fit(pts, az=az, el=el, fov=fov, title=title, margin=margin)
    return k(f, pos, look, fov, **kw)
def body(m, kid=False):   # crown, feet and the head's width (the cards are ~55 cm wide); a kid's crown is lower
    top = 1.45 if kid else 1.82; y = top - 0.22
    return [[m[0], top, m[1]], [m[0], 0.02, m[1]], [m[0] - 0.26, y, m[1]], [m[0] + 0.26, y, m[1]], [m[0], y, m[1] - 0.26], [m[0], y, m[1] + 0.26]]
def k(f, pos, look, fov, glide=None, cut=False, push=0.0006, punch=None, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=0, why=why)  # quality bar (25 Nov 2026): no blur of any kind
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    return d

# ---------------- layout (set-local metres; the build reads these) ----------------
# GYM: one set for the Mira Mesa High gym and the school front / parking lot outside it. Origin on the gym floor at centre court;
# the front wall with the double doors is z 8.0..8.3, the lot is +z. The back wall (scoreboard, banners) is z -7. y up.
TY = 0.76   # vendor table top
GYM = dict(
    room=[-9.0, 9.0, -7.0, 8.0], h=6.5, front_z=8.0, wall_t=0.3, doors=[1.0, 3.0], door_h=2.4,
    booth=[-0.9, 0.9, 0.75, 1.25], table_y=TY,
    easel=[0.34, TY, 1.02], case_tray=[-0.55, 0.15, 0.95, 1.2], stack=[-0.8, TY, 1.12], tin=[-0.2, TY, 0.84], tent=[0.66, TY, 0.88], jar=[-0.2, TY, 0.84],
    sign_front=[0.0, 0.55, 1.262], handover=[-0.42, 1.13, 1.0],
    # the other booths: [cx, cz] of each table (all 1.8 x 0.5, vendor behind at -z)
    tables=[[-4.4, 1.0], [4.4, 1.0], [-6.8, -3.0], [-2.4, -3.0], [2.0, -3.0], [6.4, -3.0], [-4.4, -5.6], [0.0, -5.6], [4.4, -5.6]],
    board=[-2.5, 1.75, 7.98], board_size=[1.6, 1.0], rules=[3.9, 7.0], scoreboard=[0.0, 4.6, -6.98], bleachers=[-9.0, -7.8, -5.5, 5.5],
    plaza=[8.3, 12.0], lot=[12.0, 36.0], sedan=[8.5, 20.0], letters=[2.0, 3.35, 8.32], banner=[-1.0, 2.6, 8.33],
    # marks [x, z] at the feet
    dad=[-0.38, 0.6], girl=[0.42, 0.72], stranger=[-0.58, 1.34], girl_front=[0.42, 1.55], woman=[-0.2, 1.42],
    door_in=[2.0, 7.55], door_out=[2.0, 8.7], dad_out=[2.4, 10.4], thief_lot=[6.6, 18.6], guard=[2.0, 7.35], cop=[-1.6, 7.75], flyer=[-1.95, 1.62, 7.98],
    shop1=[-4.2, 1.6], shop2=[2.1, -2.35], shop3=[-2.6, -2.35])
BEACH = dict(prom=[-9.0, 9.0, -2.0, 6.0], rail_z=-2.25, rail_y=1.05, pier=[5.5, 8.5], sand_y=-1.4, sea_z=-12.0,
             mum=[-0.72, -1.45], dad2=[-0.05, -1.55], kid2=[0.58, -1.4], stranger2=[0.08, 2.0], dad2_hand=[0.05, 1.45], phone=[0.08, 1.5, 1.72])
G = GYM; B = BEACH
DAD, GIRL, STR = G["dad"], G["girl"], G["stranger"]
HEAD = lambda m, kid=False: [m[0], 1.45 if kid else 1.82, m[1]]
EASEL = [G["easel"][0], TY + 0.09, G["easel"][2]]
TABLE = [[-0.9, TY, 1.25], [0.9, TY, 1.25], [-0.9, 0.02, 1.25], [0.9, 0.02, 1.25]]
DOORS = [[1.0, 2.45, 8.0], [3.0, 2.45, 8.0], [1.0, 0.02, 8.0], [3.0, 0.02, 8.0]]
TITLE_SD = 268

P = {
 "fps": 30, "frames": 2510, "voice_end": 2476,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 40, "out": 100, "text": "$3,000+", "style": 3, "from": "top"},
  {"f": TITLE_SD, "out": 330, "text": "SAN DIEGO", "style": 3, "from": "top"},
  {"f": 470, "out": 528, "text": "BUBBLE MEW", "style": 3, "from": "top"}],
 "cards": {"hero": "bubble_mew (Paldean Fates Mew ex 232/091, the 'Bubble Mew', in a magnetic one-touch case, tag $3,200)",
           "tray": ["pika151", "zard151", "blast151", "venu151", "eevee", "jigglypuff", "meowth", "psyduck", "magikarp", "abra"],
           "stack": ["charmander", "squirtle", "bulbasaur"], "booths": ["sprigatito", "fuecoco", "quaxly", "pawmi", "pikachu_xy", "fennekin", "froakie", "chespin"]},
 "gym": GYM, "beach": BEACH,
 "sets": {
  "gym": {"origin": [0, 0, 0], "axes": "centre court at the origin; the front wall with the double doors at z 8.0..8.3 opens onto the plaza and the parking lot (+z); the back wall (scoreboard) at z -7; bleachers on the left wall (-x)",
   "light": "day", "sun": [-30, 50], "open_sides": "+z outside; inside every side (the room is 18 x 15 m)",
   "objects": [
    {"id": "room", "build": "new: gym x -9..9, z -7..8, 6.5 m: warm maple floor in 9 cm boards with painted court lines (red centre circle with MM, white lines, a blue key at each end), cream block walls with a red band at 1.2 m, a row of high windows with blue sky and clouds on both side walls (y 4.4..5.8), a ceiling with steel trusses and round lights", "pos": [0, 3.25, 0.5], "size": [18, 6.5, 15]},
    {"id": "back wall", "build": "new: scoreboard (HOME 0 GUEST 0, red digits on a dark-green face, 3.2 x 1.4 m) at y 4.6, a MIRA MESA banner (red with cream letters) over it, a CARD SHOW TODAY banner (sky blue) at y 2.6, a basketball backboard raised high (4.0 m) on the left", "pos": [0, 3.5, -6.95], "size": [16, 4, 0.1]},
    {"id": "bleachers", "build": "new: folded wooden bleachers against the left wall x -9..-7.8, z -5.5..5.5, 2.6 m tall: seven stepped tiers of warm oak with red risers (folded, nobody sits)", "pos": [-8.4, 1.3, 0], "size": [1.2, 2.6, 11]},
    {"id": "booth", "build": "new: their vendor table x -0.9..0.9, z 0.75..1.25, top 0.76 (standing height table, folding steel legs), a sky-blue cloth with a skirt to the floor; on it: a glass-top display tray x -0.55..0.15 with ten real cards on red felt, the wooden easel at x 0.34 holding the Bubble Mew in a magnetic one-touch case with a white price tag $3,200 on a string, a stand of three top-loaders at the front-left corner (by the customer's hip), a red cash tin, a cardboard tent sign FIRST SHOW! (hand-lettered)", "pos": [0, 0.38, 1.0], "size": [1.8, 0.76, 0.5]},
    {"id": "booths", "build": "new: nine more vendor tables (same build, cloths in orange, green, red, teal, yellow) in rows at z 1.0, -3.0 and -5.6, each with a display tray of real cards, a banner sign on a pole (CARDS, SLABS, SEALED, VINTAGE, BINDERS), binders and booster boxes", "pos": [0, 0.38, -2.5], "size": [16, 0.76, 7]},
    {"id": "doors", "build": "new: double doors x 1.0..3.0 in the front wall, 2.4 m, red steel leaves with a tall glass window each and a chrome push bar, hinged at x 1.0 and x 3.0, swinging outward on spring hinges (a damped swing that settles); the bright plaza beyond", "pos": [2.0, 1.2, 8.15], "size": [2.0, 2.4, 0.06]},
    {"id": "board", "build": "new: cork notice board 1.6 x 1.0 m in an oak frame on the front wall inside, x -3.3..-1.7, with school notices (BAKE SALE FRI, CLUB FAIR) and, from S14, the police flyer HAVE YOU SEEN THIS CAR? with a photo-style print of a black sedan and SDPD", "pos": [-2.5, 1.75, 7.98], "size": [1.6, 1.0, 0.04]},
    {"id": "rules", "build": "new: an A-frame easel board 0.7 x 1.0 by the doors at x 3.9, z 7.0 (from S15): VENDOR RULES / 1 ONE CARD AT A TIME / 2 HOLD THE EDGE / 3 STAFF NEARBY", "pos": [3.9, 0.9, 7.0], "size": [0.7, 1.0, 0.5]},
    {"id": "facade", "build": "new: the gym's front outside z 8.3: cream stucco, a red trim band at 3.0 m, MIRA MESA HIGH SCHOOL in red letters over the doors, a CARD SHOW TODAY banner on the wall, a flagpole, two palms, flower beds; side school wings with red-tile roofs either side, hills far behind", "pos": [0, 3.0, 8.3], "size": [24, 6.5, 0.2]},
    {"id": "lot", "build": "new: the plaza (concrete, z 8.3..12), a curb, the parking lot (asphalt, white bay lines, z 12..36) with bright parked cars (red, yellow, sky blue, white) and the black sedan in a bay at x 8.5, z 20 (glossy black with highlights, tinted windows), a light pole, hills and blue sky with clouds", "pos": [0, 0, 22], "size": [40, 0.1, 28]}],
   "marks": {k: G[k] for k in ["dad", "girl", "stranger", "girl_front", "woman", "door_in", "door_out", "dad_out", "thief_lot", "guard", "cop", "shop1", "shop2", "shop3"]}},
  "beach": {"origin": [120, 0, 0], "axes": "the promenade runs along x; the rail at z -2.25 faces the ocean (-z); the pier on the right going out to sea; the lens at +z",
   "light": "day", "sun": [25, 52], "open_sides": "all",
   "objects": [
    {"id": "promenade", "build": "new: a seaside promenade x -9..9, z -2..6: warm concrete pavers, a white steel rail at z -2.25 (posts every 1.5 m, two rails, top at 1.05), palms, a striped ice-cream cart, a bench-free planter wall; sand below the rail, then the blue ocean with white wave lines and a wooden pier on posts at x 5.5..8.5", "pos": [0, 0, 2], "size": [18, 1.1, 8]},
    {"id": "phone", "build": "new: the family's phone, 7.4 x 15 cm, coral case; in the POV shot the camera sits just behind it: the bezel frames the shot, the screen is open (the real scene seen through it) with a camera UI: grid, a yellow focus square on the faces, a white shutter button", "pos": B["phone"], "size": [0.074, 0.15, 0.01]}],
   "marks": {k: B[k] for k in ["mum", "dad2", "kid2", "stranger2"]}}},
 "cast": {
  "dad": {"look": ["royal-blue and white baseball tee", "red cap", "glasses", "khaki shorts"], "items": ["the Bubble Mew case"], "views": ["front", "side walking (limp)"]},
  "girl": {"look": ["yellow hoodie", "blue jeans", "dark hair"], "items": ["top-loaders", "the replica", "her sign"], "views": ["front"]},
  "stranger": {"look": ["maroon hoodie", "blue jeans", "blue cap"], "items": ["the Bubble Mew case"], "views": ["front", "side running"]},
  "woman": {"look": ["red jacket", "dark hair"], "items": ["the replica case"], "views": ["front"]},
  "vendors": {"look": ["bright tees: teal, orange, green, pink"], "items": ["top-loaders"], "views": ["front"]},
  "cop": {"look": ["light-blue shirt", "blue trousers", "cap", "gold badge"], "items": ["the flyer"], "views": ["front"]},
  "guard": {"look": ["yellow SECURITY shirt", "blue trousers", "cap"], "items": [], "views": ["front", "side walking"]},
  "mum": {"look": ["pink top", "sun hat colours"], "items": [], "views": ["front"]},
  "dad2": {"look": ["sky-blue holiday shirt", "sunglasses on his head"], "items": ["the phone"], "views": ["front", "side walking"]},
  "kid2": {"look": ["green tee"], "items": [], "views": ["front"]},
  "stranger2": {"look": ["orange tee", "sunglasses"], "items": ["the phone"], "views": ["front"]}},
 "scenes": []}

SC = P["scenes"]
def scene(**kw): SC.append(kw)
TRIO = body(DAD) + body(GIRL, True) + body(STR) + TABLE

scene(id="S01", hero=True, f=[0, 224], set="gym", light="day",
  vo="Một người đàn ông cầm lá bài hơn ba nghìn đô trên tay, rồi chạy mất, ngay trong buổi bán thẻ đầu tiên của hai cha con.",
  gloss="A man held a card worth over three thousand dollars in his hand, then ran off, right at the father and daughter's first card sale.",
  spine=1, viewer="A stranger admiring the card at their table, then gone in a flash toward the doors; father and daughter left staring.",
  **{"in": {"type": "open on the act"}, "out": {"type": "dissolve", "to": "S02", "n": 10, "note": "time jump back to the morning"}},
  build="the gym, their booth (easel empty, the case in his hands), the top-loader stand, the double doors.",
  blocking="Stranger at the stranger mark in front of the table, holding the case up at eye level; dad behind the table at the dad mark with his right palm open over the table (waiting to get it back); girl at the girl mark. From f103 the stranger runs to the doors (door_in) and out (door_out).",
  action="f0-96 he tilts the case to the light, admiring (two small tilts, f20 and f60); dad's palm stays open; f44 title $3,000+ ('hơn ba nghìn đô' f44-67); f100 his eyes slide to the doors; f103 ('chạy' f103) he spins and bolts: one-frame turn to the side view, a sprint at 4.5 m/s toward the doors with speed lines; his hip clips the table's left corner as he spins: the three top-loaders slide off and fall to the floor (f106-124) and lie there; f185 he hits the doors' push bar, they fly open; f137-183 'ngay trong buổi bán thẻ đầu tiên của hai cha con': the camera settles back on dad and girl behind their table, the FIRST SHOW! sign between them, faces from smile to shock (f150).",
  acting="Stranger: polite admiring smile -> sly glance -> sprint. Dad: proud smile, palm out -> frozen. Girl: beaming -> shock.",
  cams=[kf(0, TRIO, az=34, el=-10, fov=44, title=True, push=0.0005, why="the stranger with the card at their table, all three full body"),
        kf(104, body(STR) + body(G["door_in"]) + DOORS + [[0.9, TY, 1.25]], az=160, el=-8, fov=50, glide=26, push=0.0, why="whip after him: the run to the doors"),
        kf(150, body(DAD) + body(GIRL, True) + TABLE, az=10, el=-8, fov=42, glide=30, push=0.0012, why="father and daughter at their first booth, faces falling")],
  kicks=[[103, 0.5], [185, 0.35]],
  marks=[{"who": "stranger", "at": STR, "view": "front then side running", "pose": "case held up f0-102; sprint f103-170", "expr": "smile -> grin"},
         {"who": "dad", "at": DAD, "view": "front", "pose": "right palm open over the table", "expr": "smile -> shock"},
         {"who": "girl", "at": GIRL, "view": "front", "pose": "standing by the tent sign", "expr": "smile -> shock"}],
  subjects=[{"n": "stranger head", "p": HEAD(STR), "f": [0, 100]}, {"n": "dad head", "p": HEAD(DAD), "f": [0, 100]}, {"n": "girl head", "p": HEAD(GIRL, True), "f": [0, 100], "kid": True},
            {"n": "doors", "p": [2.0, 1.2, 8.0], "f": [130, 150]}, {"n": "dad head", "p": HEAD(DAD), "f": [180, 223]}, {"n": "girl head", "p": HEAD(GIRL, True), "f": [180, 223], "kid": True}],
  physics="the three top-loaders: knocked off the corner at f106 with ~1.2 m/s, they tip and fall 0.76 m (light, a small flutter), land flat by f124 and stay. The doors: spring hinges, open to 80 deg and swing back with a damped swing.",
  light_mood="bright midday through the high windows.", sound="hall murmur; a sly pluck f100; a whoosh + Gogogogogo-style run cue f103; toploader clatter f118-124; the doors' bang f185; a suspense sting f150.",
  after="The top-loaders lie on the floor; the easel is empty.")

scene(id="S02", f=[224, 428], set="gym", light="day",
  vo="Cô bé mười hai tuổi, ở San Diego, lần đầu bày sạp ở một hội thẻ tại trường trung học Mira Mesa.",
  gloss="The 12-year-old girl in San Diego was setting up her first booth at a card show at Mira Mesa High School.",
  spine=2, viewer="That morning: a school in sunny San Diego, a CARD SHOW banner; inside, father and daughter setting out their first booth.",
  **{"in": {"type": "dissolve", "n": 10, "from": "S01"}, "out": {"type": "glide", "to": "S03"}},
  build="the school front: cream stucco, MIRA MESA HIGH SCHOOL letters, CARD SHOW TODAY banner, palms, flagpole, the plaza and lot; the doors propped open; the booth before the show (easel with the Mew, stack upright).",
  blocking="Outside: two shoppers walk in through the doors f240-320 (side view). Inside: girl at the girl mark lays top-loaders into the tray; dad at the dad mark sets the case on the easel.",
  action="f224-300 wide on the school front; title SAN DIEGO f268; f300-400 the camera travels in through the open doors and across the gym floor to the booth ('Mira Mesa' f377-400 as it passes the letters); f340-420 the girl sets out cards (one top-loader at a time, f350, f372, f394); dad places the case on the easel f400-412.",
  acting="Girl: excited, careful. Dad: proud.",
  cams=[k(224, [3.2, 2.2, 26.0], [2.0, 3.3, 8.3], 50, push=0.0006, why="the school front, the banner, palms, blue sky"),
        k(330, [2.0, 1.75, 11.0], [2.0, 1.5, 6.0], 50, glide=40, push=0.0, why="toward the open doors"),
        kf(372, body(DAD) + body(GIRL, True) + TABLE, az=8, el=-10, fov=46, glide=46, push=0.0008, why="in across the floor to the booth")],
  kicks=[], marks=[{"who": "girl", "at": GIRL, "view": "front", "pose": "lays top-loaders f350-394", "expr": "smile"}, {"who": "dad", "at": DAD, "view": "front", "pose": "case onto the easel f400-412", "expr": "smile"}],
  subjects=[{"n": "letters", "p": G["letters"], "f": [224, 300]}, {"n": "banner", "p": G["banner"], "f": [224, 300]}, {"n": "dad head", "p": HEAD(DAD), "f": [415, 427]}, {"n": "girl head", "p": HEAD(GIRL, True), "f": [415, 427], "kid": True}],
  physics="the doors are propped open (hooked back at 90 deg).", light_mood="bright morning sun, blue sky with clouds.", sound="outdoor air, a far school bell f240; the score enters (bright plucks); the hall murmur as we enter.",
  after="The booth is set: the Mew on the easel, the stack upright.")

scene(id="S03", f=[428, 586], set="gym", light="day",
  vo="Hôm ấy sạp có một lá Bubble Mew hiếm, một trong những lá đắt nhất trong gian hàng.",
  gloss="That day the booth had a rare Bubble Mew, one of the most expensive cards on the table.",
  spine=2, viewer="The real Bubble Mew, big and sharp, with its $3,200 tag.",
  **{"in": {"type": "glide", "from": "S02"}, "out": {"type": "glide", "to": "S04"}},
  build="the easel and the case (real scan), the price tag on its string.",
  blocking="Dad and girl behind the table.",
  action="f428-460 glide down to the easel; f460-545 the Bubble Mew fills the frame (~50% of the width, title BUBBLE MEW f470); a gleam crosses the case f475; f530 the tag turns to us on its string ($3,200, 'đắt nhất' f530); f545-586 pull back: the girl beams behind it.",
  acting="Girl: proud.",
  cams=[k(428, [0.32, 0.98, 1.58], [0.32, 0.86, 1.1], 30, glide=32, push=0.0005, why="the Bubble Mew on its easel"),
        kf(548, body(DAD) + body(GIRL, True) + [EASEL], az=6, el=-8, fov=40, glide=34, push=0.0008, why="the card and the proud girl")],
  kicks=[], marks=[{"who": "girl", "at": GIRL, "view": "front", "pose": "standing", "expr": "smile"}, {"who": "dad", "at": DAD, "view": "front", "pose": "standing", "expr": "smile"}],
  subjects=[{"n": "mew", "p": EASEL, "f": [470, 545], "nofeet": True}, {"n": "girl head", "p": HEAD(GIRL, True), "f": [575, 585], "kid": True}],
  physics="the tag: hangs on a 6 cm string, a small pendulum (period 0.5 s) after the turn.", light_mood="bright; the card sharp and unlit (true colours).", sound="a music-box sparkle on the card f462; a soft price tick f530.",
  after="Unchanged.")

scene(id="S04", f=[586, 655], set="gym", light="day",
  vo="Người cha đưa lá bài cho một người lạ xem.",
  gloss="The father handed the card to a stranger to look at.",
  spine=3, viewer="Open hand to open hand across the table: the father passes the case to a stranger.",
  **{"in": {"type": "glide", "from": "S03"}, "out": {"type": "glide", "to": "S05"}},
  build="as before.",
  blocking="Stranger walks up to the stranger mark f586-600 (front view walking) and leans in; dad lifts the case off the easel and holds it across; the stranger takes it and holds it up.",
  action="f596 'đưa' dad lifts the case off the easel (the tag swings); f600-620 carries it across to the hand-over point; f629 'người lạ' the stranger takes it; f630-650 he lifts it to eye level; dad's palm stays open over the table, waiting.",
  acting="Stranger: polite, eager. Dad: friendly. Girl: watching the card.",
  cams=[kf(586, TRIO, az=30, el=-10, fov=42, glide=24, push=0.001, why="the hand-over across the table, all three full body")],
  kicks=[], marks=[{"who": "stranger", "at": STR, "view": "front", "pose": "walks up, takes the case f629", "expr": "smile"}, {"who": "dad", "at": DAD, "view": "front", "pose": "passes the case f596-629, palm open after", "expr": "smile"},
                   {"who": "girl", "at": GIRL, "view": "front", "pose": "standing", "expr": "smile"}],
  subjects=[{"n": "stranger head", "p": HEAD(STR), "f": [600, 654]}, {"n": "dad head", "p": HEAD(DAD), "f": [600, 654]}],
  physics="the tag swings when the case leaves the easel (period 0.5 s, damped).", light_mood="bright.", sound="a soft card-case click f629.",
  after="The stranger holds the case; the easel is empty; dad's palm is open over the table.")

scene(id="S05", hero=True, f=[655, 758], set="gym", light="day",
  vo="Và nó biến mất khỏi tay ông.",
  gloss="And it vanished from his hand.",
  spine=3, viewer="A beat of stillness, a sly glance, and the stranger is gone: the father's open hand on empty air.",
  **{"in": {"type": "glide", "from": "S04"}, "out": {"type": "glide", "to": "S06"}},
  build="as before.",
  blocking="As S04; from f700 the stranger runs to the doors.",
  action="f655-698 the pause after 'Và': the stranger looks at the card, then his eyes slide to the doors (f685); f700 ('biến' f702) he bolts: gone from the frame in 6 f with speed lines and a dust puff; his hip clips the table corner: the three top-loaders slide off and fall (f704-722); the empty easel's tag swings; dad's palm stays open on empty air, his smile frozen.",
  acting="Stranger: sly. Dad: smile frozen, palm open.",
  cams=[kf(655, body(DAD) + body(STR) + [[-0.9, TY, 1.25], [0.9, TY, 1.25]], az=26, el=-8, fov=38, glide=20, push=0.0015, punch=[0.006, 20], why="closer: the case, the open palm, his glance")],
  kicks=[[700, 0.55]],
  marks=[{"who": "stranger", "at": STR, "view": "front then side running", "pose": "case up; bolts f700", "expr": "smile -> grin"}, {"who": "dad", "at": DAD, "view": "front", "pose": "palm open", "expr": "smile frozen"}],
  subjects=[{"n": "dad head", "p": HEAD(DAD), "f": [655, 757]}, {"n": "stranger head", "p": HEAD(STR), "f": [655, 698]}],
  physics="the top-loaders fall as in S01 and stay on the floor.", light_mood="bright; the beat of stillness holds.", sound="silence under the pause f660-698; a whoosh f700; clatter f714-722.",
  after="The stranger is running for the doors; the top-loaders on the floor; the easel empty.")

scene(id="S06", f=[758, 938], set="gym", light="day",
  vo="Ông kể: \"Tôi tưởng anh ta đùa. Tôi tưởng anh ta chạy hai bước rồi quay lại.\"",
  gloss="He recalls: \"I thought he was joking. I thought he'd run two steps and come back.\"",
  spine=3, viewer="The father laughs, palm still out, waiting for the joke to end, while the stranger bursts out through the doors.",
  **{"in": {"type": "glide", "from": "S05"}, "out": {"type": "glide", "to": "S07"}},
  build="as before; the doors.",
  blocking="Dad and girl behind the table; the stranger runs from the table to the doors (arrives f790) and out.",
  action="f758-790 the stranger sprints across the floor, small in the background; f790 he slams the push bar, the doors fly open and he's out; the doors swing; f800-830 dad laughs ('đùa' f821), palm still open; f849-900 'chạy hai bước rồi quay lại': dad keeps smiling at the doors, waiting; the girl looks up at him, worried.",
  acting="Dad: laughing, easy -> expectant. Girl: worried.",
  cams=[kf(758, body(DAD) + body(GIRL, True) + DOORS + TABLE, az=168, el=-6, fov=48, glide=30, push=0.0006, why="from the booth's side toward the doors: the father laughing, the stranger leaving")],
  kicks=[[790, 0.3]],
  marks=[{"who": "dad", "at": DAD, "view": "front", "pose": "palm open", "expr": "laugh -> smile"}, {"who": "girl", "at": GIRL, "view": "front", "pose": "looks up at him", "expr": "nervous"},
         {"who": "stranger", "at": G["door_in"], "view": "side running", "pose": "sprint to the doors f758-790", "expr": "grin"}],
  subjects=[{"n": "dad head", "p": HEAD(DAD), "f": [758, 937]}, {"n": "girl head", "p": HEAD(GIRL, True), "f": [758, 937], "kid": True}, {"n": "doors", "p": [2.0, 1.2, 8.0], "f": [780, 937]}],
  physics="the doors: open to 80 deg in 5 f at f790, then a damped swing (period 1.3 s) toward shut.", light_mood="bright.", sound="footsteps fading; the doors' bang f790; dad's laugh (Emoji Laugh meme, soft) f805.",
  after="The stranger is gone; the doors are swinging.")

scene(id="S07", f=[938, 991], set="gym", light="day",
  vo="Anh ta không quay lại.",
  gloss="He didn't come back.",
  spine=3, viewer="The doors swing shut and settle. Nobody comes back.",
  **{"in": {"type": "glide", "from": "S06"}, "out": {"type": "glide", "to": "S08"}},
  build="the doors.",
  blocking="Nobody in the doorway; dad in the foreground at the booth.",
  action="f938-975 the doors' last small swings, settling shut at f975; locked frame; f960 dad's smile drops.",
  acting="Dad: smile -> dawning worry.",
  cams=[kf(938, DOORS + [[2.0, 2.6, 8.0]], az=176, el=-2, fov=36, glide=22, push=0.002, why="locked on the empty doors")],
  kicks=[], marks=[{"who": "dad", "at": DAD, "view": "front", "pose": "standing", "expr": "nervous"}],
  subjects=[{"n": "doors", "p": [2.0, 1.2, 8.0], "f": [960, 990]}],
  physics="the doors settle shut (amplitude under 1 deg by f975).", light_mood="bright, still.", sound="the doors' last creaks f940, f958; then hall murmur only.",
  after="The doors are shut.")

scene(id="S08", hero=True, f=[991, 1129], set="gym", light="day",
  vo="Ông đuổi theo, nhưng gót chân đang đau, và còn đau thêm.",
  gloss="He chased him, but his heel was already hurt, and it hurt even more.",
  spine=4, viewer="The father limps out after him; pain flashes at his heel, then worse; far off a black sedan pulls out of the lot.",
  **{"in": {"type": "glide", "from": "S07", "note": "the camera follows him out through the doors"}, "out": {"type": "glide", "to": "S09"}},
  build="the plaza, the lot, the black sedan.",
  blocking="Dad pushes out through the doors (door_out) f1000 and limps along the plaza to dad_out; the stranger far away near the sedan (thief_lot), gone behind it by f1040; the sedan pulls out of its bay and drives off left f1050-1125.",
  action="f995 the doors burst open outward; f1000-1068 dad limps out (side view: a short step with the bad leg, a long hop with the good one, the body dips on each bad step; 'đuổi theo' f1003-1015); f1045 'đau' a red pain star pops at his heel; f1073-1080 'còn đau thêm': a bigger star, he stops dead and winces (expr pained), one hand flying back toward the heel; f1050-1125 the sedan reverses out of its bay and drives off to the left.",
  acting="Dad: determined -> pained.",
  cams=[kf(991, body(G["door_out"]) + DOORS, az=160, el=-4, fov=46, glide=20, push=0.0, why="he bursts out through the doors"),
        kf(1020, body(G["dad_out"]) + body(G["door_out"]) + [[G["sedan"][0] - 2.0, 1.4, G["sedan"][1]], [G["sedan"][0] + 2.2, 0.1, G["sedan"][1]]], az=-150, el=-6, fov=50, glide=34, push=0.0008, why="outside: his limp, the sedan in the lot")],
  kicks=[[1045, 0.3], [1076, 0.55]],
  marks=[{"who": "dad", "at": G["dad_out"], "view": "side walking (limp)", "pose": "limps out f1000-1068; stops f1076", "expr": "stern -> pained"}],
  subjects=[{"n": "dad head", "p": HEAD(G["dad_out"]), "f": [1050, 1128]}, {"n": "sedan", "p": [G["sedan"][0], 0.8, G["sedan"][1]], "f": [1060, 1090]}],
  physics="the doors swing outward on his push and back (damped). The sedan: eases out of the bay (0.4 m/s back, then 4 m/s forward, out of frame left by f1125).", light_mood="bright noon outside.", sound="doors f995; limping steps; a pain 'ow' hit f1045 and a bigger one f1076 (Bone Crack meme, light); a car engine and tyre chirp f1052-1120.",
  after="Dad stands on the plaza, hurt; the sedan is gone.")

scene(id="S09", f=[1129, 1229], set="gym", light="day",
  vo="Khoan, sao chỉ vì một lá bài mà phải chạy?",
  gloss="Wait, why run over a single card?",
  spine=5, viewer="Everything freezes on the hurt father in the empty lot: why go to such lengths for one card?",
  **{"in": {"type": "glide", "from": "S08"}, "out": {"type": "dissolve", "to": "S10", "n": 8}},
  build="as before.",
  blocking="Dad at dad_out, frozen mid-wince.",
  action="f1129 'Khoan': freeze, a record scratch; slow push in on dad's face; f1186 'phải chạy' a tiny shrug of the camera (roll 3 deg back to 0).",
  acting="Dad: frozen, pained.",
  cams=[kf(1129, body(G["dad_out"]), az=-160, el=-4, fov=40, glide=24, push=0.0005, why="hold on the frozen father")],
  kicks=[[1129, 0.6]],
  marks=[{"who": "dad", "at": G["dad_out"], "view": "front", "pose": "frozen wince", "expr": "pained"}],
  subjects=[{"n": "dad head", "p": HEAD(G["dad_out"]), "f": [1129, 1228]}],
  physics="none.", light_mood="bright; the freeze holds.", sound="record scratch + Huh (meme) f1129.",
  after="Unchanged.")

shops = body(G["shop1"]) + body(G["shop2"]) + body(G["shop3"])
scene(id="S10", f=[1229, 1393], set="gym", light="day",
  vo="Bạn thấy đấy, ở hội thẻ, đưa bài cho người khác xem là chuyện bình thường nhất trần đời.",
  gloss="You see, at a card show, handing your card to someone to look at is the most normal thing in the world.",
  spine=5, viewer="All over the hall, cards pass from vendors' hands to strangers' hands and back.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S09"}, "out": {"type": "dissolve", "to": "S11", "n": 8}},
  build="the hall in full swing (before the theft): the other booths with vendors and shoppers.",
  blocking="At three booths a vendor hands a top-loader across to a shopper (shop1 at the x -4.4 table, shop2 and shop3 at the row-2 tables); each shopper looks and hands it back.",
  action="f1240-1290 the three hand-overs, staggered (f1250, f1270, f1290, 'đưa bài' f1286-1304); f1300-1350 the shoppers tilt the cards; f1350-1390 they hand them back, vendors smiling ('bình thường' f1346).",
  acting="Everyone relaxed and friendly.",
  cams=[kf(1229, shops + [[-4.4, TY, 0.75], [2.0, TY, -3.25]], az=12, el=-22, fov=50, push=0.0008, why="high wide: hand-overs all over the hall")],
  kicks=[], marks=[{"who": "vendors", "at": G["shop1"], "view": "front", "pose": "hand-overs f1250-1390", "expr": "smile"}],
  subjects=[{"n": "shop1 head", "p": HEAD(G["shop1"]), "f": [1240, 1392]}, {"n": "shop2 head", "p": HEAD(G["shop2"]), "f": [1240, 1392]}],
  physics="none.", light_mood="warm, calm.", sound="a calm vibraphone 'you see' theme; card-sleeve clicks f1250, f1270, f1290.",
  after="Unchanged.")

FAM = body(B["mum"]) + body(B["dad2"]) + body(B["kid2"], True)
scene(id="S11", f=[1393, 1500], set="beach", light="day",
  vo="Giống đưa điện thoại nhờ người lạ chụp giúp tấm ảnh:",
  gloss="It's like handing a stranger your phone to take a photo for you:",
  spine=5, viewer="At the seaside a family hands its phone to a passer-by for a photo.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S10"}, "out": {"type": "cut", "to": "S12"}},
  build="the promenade, rail, ocean, pier, palms; the phone.",
  blocking="Mum and kid at the rail; dad2 walks from the rail to the stranger2 mark, hands over the phone (f1440), walks back to pose (f1480).",
  action="f1395-1430 dad2 walks to the passer-by holding the phone out; f1440 'nhờ người lạ' hands it over; f1445-1480 walks back to the rail; f1482-1500 the family squeezes together; the passer-by raises the phone ('chụp' f1439).",
  acting="Family: cheerful. Passer-by: obliging.",
  cams=[kf(1393, FAM + body(B["stranger2"]), az=-62, el=-6, fov=48, push=0.0008, why="the family, the passer-by and the phone, the sea behind")],
  kicks=[], marks=[{"who": "dad2", "at": B["dad2"], "view": "side walking, then front", "pose": "hands over the phone f1440", "expr": "smile"}, {"who": "stranger2", "at": B["stranger2"], "view": "front", "pose": "phone up f1482", "expr": "smile"}],
  subjects=[{"n": "dad2 head", "p": HEAD(B["dad2"]), "f": [1393, 1499]}, {"n": "stranger2 head", "p": HEAD(B["stranger2"]), "f": [1393, 1499]}],
  physics="none.", light_mood="bright seaside sun, blue sky, sparkling sea.", sound="gulls, waves; a light ukulele pluck theme.",
  after="The phone is in the passer-by's hands.")

PH = B["phone"]
scene(id="S12", f=[1500, 1568], set="beach", light="day",
  vo="ai cũng nhìn vào máy, chẳng ai nhìn người cầm.",
  gloss="everyone looks at the camera, nobody looks at the person holding it.",
  spine=5, viewer="Through the phone: three smiles at the lens. From the side: not one of them looks at the man holding it.",
  **{"in": {"type": "cut", "from": "S11"}, "out": {"type": "dissolve", "to": "S13", "n": 8}},
  build="the phone frame (POV), the family posing.",
  blocking="Family posing at the rail; stranger2 holding the phone at eye height.",
  action="f1500-1525 POV through the phone: the bezel frames three smiling faces, a yellow focus square locks on them ('nhìn vào máy' f1490-1499); f1528-1568 glide round to the side: the family frozen in their pose, every eye on the phone, the man holding it stands with a blank face ('chẳng ai nhìn người cầm' f1507-1541).",
  acting="Family: big frozen smiles. Passer-by: neutral.",
  cams=[k(1500, [PH[0], PH[1] + 0.02, PH[2] + 0.36], [-0.05, 1.25, -1.5], 40, cut=True, push=0.0006, why="through the phone: three smiles"),
        kf(1526, FAM + body(B["stranger2"]), az=-80, el=-4, fov=46, glide=30, push=0.0008, why="side: every eye on the phone, none on the holder")],
  kicks=[], marks=[{"who": "mum", "at": B["mum"], "view": "front", "pose": "posing", "expr": "smile"}, {"who": "stranger2", "at": B["stranger2"], "view": "front", "pose": "phone up", "expr": "neutral"}],
  subjects=[{"n": "dad2 face", "p": HEAD(B["dad2"]), "f": [1500, 1525]}, {"n": "stranger2 head", "p": HEAD(B["stranger2"]), "f": [1550, 1567]}, {"n": "mum head", "p": HEAD(B["mum"]), "f": [1550, 1567]}],
  physics="none.", light_mood="bright.", sound="Camera shutter (meme) f1520; waves.",
  after="Unchanged.")

scene(id="S13", f=[1568, 1693], set="gym", light="day",
  vo="Niềm tin ở đó rẻ, nên mất cũng nhanh.",
  gloss="Trust there is cheap, so it's lost just as fast.",
  spine=5, viewer="Back at the booth: the empty easel, its tag still swinging, and a sad girl.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S12"}, "out": {"type": "glide", "to": "S14"}},
  build="the booth after the theft: the easel empty, the tag on its string; the top-loaders picked up.",
  blocking="Girl at the girl mark looking down at the easel; dad beside her, head down.",
  action="f1568-1620 glide to the empty easel; the tag turns slowly on its string; f1624 'nên mất' push in on the empty easel; f1637 'nhanh' the tag swings once more.",
  acting="Girl: sad. Dad: sad, head down.",
  cams=[kf(1568, body(DAD) + body(GIRL, True) + [EASEL], az=8, el=-10, fov=40, glide=28, push=0.001, why="the girl and the empty easel"),
        k(1622, [0.32, 1.0, 1.75], [0.32, 0.86, 1.1], 32, glide=24, push=0.0012, why="push in: the empty easel and its tag")],
  kicks=[], marks=[{"who": "girl", "at": GIRL, "view": "front", "pose": "looks at the easel", "expr": "sad"}, {"who": "dad", "at": DAD, "view": "front", "pose": "head down", "expr": "sad"}],
  subjects=[{"n": "girl head", "p": HEAD(GIRL, True), "f": [1580, 1620], "kid": True}, {"n": "easel", "p": EASEL, "f": [1650, 1692], "nofeet": True}],
  physics="the tag: a slow pendulum on its string.", light_mood="bright but quiet.", sound="Meme Violin Sad Violin (soft) f1580.",
  after="Unchanged.")

BOARD = [[-3.3, 2.25, 7.98], [-1.7, 2.25, 7.98], [-3.3, 1.25, 7.98], [-1.7, 1.25, 7.98]]
scene(id="S14", f=[1693, 1906], set="gym", light="day",
  vo="Cảnh sát San Diego vào cuộc, công bố hình chiếc xe sedan đen mà họ nghi là của nghi phạm. Chưa ai bị bắt.",
  gloss="San Diego police stepped in and released photos of the black sedan they believe belongs to the suspect. No one has been arrested.",
  spine=6, viewer="An officer pins up a flyer with the black sedan's photo; nobody is caught.",
  **{"in": {"type": "glide", "from": "S13"}, "out": {"type": "glide", "to": "S15"}},
  build="the notice board; the flyer HAVE YOU SEEN THIS CAR? with the black sedan photo, SDPD.",
  blocking="Officer at the cop mark facing the board (front view), pins the flyer f1740-1760; then steps aside.",
  action="f1693-1735 the camera travels from the booth across the hall to the notice board; f1740 the officer presses the flyer to the cork; f1755 the pin goes in (a tap; 'công bố hình' f1737-1768); f1774 'xe sedan đen': push on the photo; f1853 'Chưa ai bị bắt': the officer steps back and shrugs; the flyer's loose corner lifts in the draft from the doors.",
  acting="Officer: businesslike -> a small shrug.",
  cams=[kf(1693, body(G["cop"]) + BOARD, az=176, el=-6, fov=44, glide=40, push=0.0006, why="the officer and the notice board"),
        k(1772, [-1.95, 1.64, 6.6], [-1.95, 1.62, 7.98], 34, glide=26, push=0.001, why="the black sedan on the flyer"),
        kf(1840, body(G["cop"]) + BOARD, az=176, el=-6, fov=44, glide=24, push=0.0006, why="no arrest: the shrug, the flyer corner lifting")],
  kicks=[[1755, 0.3]],
  marks=[{"who": "cop", "at": G["cop"], "view": "front", "pose": "pins the flyer f1740-1760; shrug f1855", "expr": "neutral"}],
  subjects=[{"n": "cop head", "p": HEAD(G["cop"]), "f": [1730, 1765]}, {"n": "flyer", "p": G["flyer"], "f": [1790, 1835], "nofeet": True}, {"n": "cop head", "p": HEAD(G["cop"]), "f": [1862, 1905]}],
  physics="the flyer corner: lifts 3 cm and drops back (a slow sine, 0.6 Hz) from f1853.", light_mood="bright.", sound="a pushpin tap f1755; a low firm note; a deflated trombone 'wah' f1860.",
  after="The flyer stays on the board for the rest of the reel.")

scene(id="S15", f=[1906, 2002], set="gym", light="day",
  vo="Ban tổ chức thêm bảo vệ và siết quy định cho người bán.",
  gloss="The organisers added security and tightened the rules for vendors.",
  spine=6, viewer="A guard in a SECURITY shirt takes his post at the doors; the VENDOR RULES board.",
  **{"in": {"type": "glide", "from": "S14"}, "out": {"type": "glide", "to": "S16"}},
  build="the guard, the A-frame rules board.",
  blocking="Guard walks in from the doors to the guard mark f1908-1930 (side view), turns to face the hall, arms folded.",
  action="f1908-1930 the guard walks in and plants himself ('bảo vệ' f1931); f1945-1990 glide to the rules board ('siết quy định' f1951-1963); each rule line reads.",
  acting="Guard: stern, watchful.",
  cams=[kf(1906, body(G["guard"]) + DOORS + [[3.9, 1.45, 7.0], [3.9, 0.02, 7.0]], az=172, el=-6, fov=46, glide=22, push=0.0008, why="the guard at the doors, the rules board"),
        k(1950, [3.55, 1.25, 5.65], [3.9, 1.05, 7.0], 36, glide=28, push=0.0008, why="the rules")],
  kicks=[[1931, 0.25]],
  marks=[{"who": "guard", "at": G["guard"], "view": "side walking then front", "pose": "walks in f1908-1930, arms folded", "expr": "stern"}],
  subjects=[{"n": "guard head", "p": HEAD(G["guard"]), "f": [1930, 1945]}, {"n": "rules", "p": [3.9, 1.05, 7.0], "f": [1975, 2001], "nofeet": True}],
  physics="none.", light_mood="bright.", sound="footsteps; a firm brass stab f1931; a marker squeak f1960.",
  after="The guard and the rules board stay.")

scene(id="S16", f=[2002, 2179], set="gym", light="day",
  vo="Có người tặng hai cha con một bản sao lá bài, và một quỹ gây tiền được mở để bù một phần.",
  gloss="Someone gave the father and daughter a replica of the card, and a fundraiser was opened to cover part of it.",
  spine=6, viewer="A kind collector gives the girl a replica; a jar's hand-drawn meter fills to a third.",
  **{"in": {"type": "glide", "from": "S15"}, "out": {"type": "glide", "to": "S17"}},
  build="the replica in a case with a REPLICA sticker; the fundraiser jar with a hand-drawn thermometer card (GOAL 1/3).",
  blocking="Woman walks up to the woman mark f2004-2018 holding the replica; the girl takes it (f2030) and sets it on the easel (f2056-2070); dad beside.",
  action="f2018 'tặng' the woman holds the replica out; f2030 the girl takes it with both hands, beaming; f2056-2070 she stands it on the easel ('bản sao lá bài' f2047-2061); f2088-2140 glide to the jar: bills drop in (f2096, f2110, f2124) and the thermometer fills to a third ('bù một phần' f2129-2138).",
  acting="Woman: warm. Girl: surprised -> beaming. Dad: grateful.",
  cams=[kf(2002, body(G["woman"]) + body(GIRL, True) + body(DAD) + TABLE, az=28, el=-8, fov=42, push=0.0008, why="the gift across the table"),
        k(2086, [-0.14, 1.08, 1.62], [-0.2, 0.9, 0.84], 34, glide=26, push=0.0008, why="the jar and its meter")],
  kicks=[], marks=[{"who": "woman", "at": G["woman"], "view": "front", "pose": "holds out the replica f2018", "expr": "smile"}, {"who": "girl", "at": GIRL, "view": "front", "pose": "takes it f2030, easel f2056-2070", "expr": "smile"},
                   {"who": "dad", "at": DAD, "view": "front", "pose": "standing", "expr": "smile"}],
  subjects=[{"n": "girl head", "p": HEAD(GIRL, True), "f": [2010, 2080], "kid": True}, {"n": "woman head", "p": HEAD(G["woman"]), "f": [2010, 2050]}, {"n": "jar", "p": [-0.2, 0.9, 0.84], "f": [2120, 2178], "nofeet": True}],
  physics="the bills: drop into the jar (light, a flutter), settle inside.", light_mood="warm, bright.", sound="a warm chord f2030; three paper rustles f2096/2110/2124; Kaching (meme, soft) f2135.",
  after="The replica stands on the easel; the jar holds the bills.")

scene(id="S17", f=[2179, 2347], set="gym", light="day",
  vo="Cô bé nói: \"Con chỉ muốn chắc rằng chuyện này không xảy ra với ai khác.\"",
  gloss="The girl says: \"I just want to make sure this doesn't happen to anyone else.\"",
  spine=7, viewer="She tapes her own sign to the front of the table: LOOK WITH YOUR EYES.",
  **{"in": {"type": "glide", "from": "S16"}, "out": {"type": "cut", "to": "S18"}},
  build="her sign: white card 50 x 30 cm, hand-lettered LOOK WITH YOUR EYES in red and blue marker, two strips of tape.",
  blocking="Girl walks round to the front of the table (girl_front) f2181-2200 and presses the sign to the cloth f2203-2222; then turns to us.",
  action="f2181-2200 she walks round; f2203 ('Con') she presses the sign flat on the table front; f2212, f2220 two strips of tape; f2225-2306 she faces the lens and says her line (mouth moving), a little lean in; f2300 'khác' she nods.",
  acting="Girl: determined, calm.",
  cams=[kf(2179, body(G["girl_front"], True) + [[-0.25, 0.6, 1.262], [0.25, 0.25, 1.262]] + TABLE, az=-12, el=4, fov=40, glide=24, push=0.001, why="low: the girl and her sign")],
  kicks=[[2203, 0.2]],
  marks=[{"who": "girl", "at": G["girl_front"], "view": "front", "pose": "presses the sign f2203-2222; speaks f2225-2306", "expr": "smile"}],
  subjects=[{"n": "girl head", "p": HEAD(G["girl_front"], True), "f": [2200, 2346], "kid": True}, {"n": "sign", "p": G["sign_front"], "f": [2225, 2346], "nofeet": True}],
  physics="none.", light_mood="warm, bright.", sound="tape rips f2212, f2220; a gentle hopeful theme.",
  after="Her sign is taped to the front of the table for the rest of the reel.")

scene(id="S18", f=[2347, 2401], set="gym", light="day",
  vo="Kẻ trộm chạy rất nhanh.",
  gloss="The thief ran very fast.",
  spine=7, viewer="Far away across the lot, a tiny figure sprints out of sight.",
  **{"in": {"type": "cut", "from": "S17"}, "out": {"type": "dissolve", "to": "S19", "n": 8}},
  build="the plaza and lot, the hills.",
  blocking="The thief, tiny, sprints along the far edge of the lot from x -10 to x 14 at z 32.",
  action="f2347-2398 he crosses the frame in a blur of legs with speed lines ('chạy rất nhanh' f2362-2375).",
  acting="none.",
  cams=[k(2347, [-1.0, 2.0, 11.0], [1.5, 1.2, 32.0], 46, cut=True, push=0.0008, why="the far lot: the tiny runner")],
  kicks=[], marks=[{"who": "stranger", "at": [2.0, 32.0], "view": "side running", "pose": "sprint", "expr": "grin"}],
  subjects=[{"n": "runner", "p": [1.5, 1.0, 32.0], "f": [2365, 2380], "nofeet": True}],
  physics="none.", light_mood="bright noon.", sound="a comic whoosh f2360; Runner Game (meme) f2350.",
  after="He is gone.")

ALLSIGNS = [[t[0], 0.4, t[1] + 0.27] for t in G["tables"]] + [[0.0, 0.4, 1.27]]
scene(id="S19", f=[2401, 2510], set="gym", light="day",
  vo="Nhưng người nhìn xa hơn, lại là cô bé.",
  gloss="But the one who saw further was the girl.",
  spine=7, viewer="Crane up from the girl beside her sign: the same sign now hangs on every table in the hall.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S18"}, "out": {"type": "end"}},
  build="every table front carries a LOOK WITH YOUR EYES sign.",
  blocking="Girl at girl_front by her sign; vendors behind their tables.",
  action="f2401-2440 on the girl, smiling; f2440-2505 crane up and back over the whole hall: her sign on every table ('nhìn xa hơn' f2416-2430, 'cô bé' f2467); hold.",
  acting="Girl: proud, calm.",
  cams=[kf(2401, body(G["girl_front"], True) + [G["sign_front"]], az=-10, el=-4, fov=40, push=0.0008, why="the girl and her sign"),
        k(2436, [3.0, 9.5, 9.0], [-0.8, 0.4, -1.6], 54, glide=64, push=0.0004, why="crane up: her sign on every table")],
  kicks=[], marks=[{"who": "girl", "at": G["girl_front"], "view": "front", "pose": "standing by her sign", "expr": "smile"}],
  subjects=[{"n": "girl head", "p": HEAD(G["girl_front"], True), "f": [2401, 2434], "kid": True}],
  physics="none.", light_mood="bright, uplifting.", sound="the theme resolves; a last warm chord f2467.",
  after="End.")

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
