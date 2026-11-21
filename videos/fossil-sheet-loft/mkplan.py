"""Generator of plan.json for the Fossil sheet in the loft reel (the plan is the source of truth: change it here, then
python3 videos/fossil-sheet-loft/mkplan.py && python3 scripts/plan_check.py videos/fossil-sheet-loft/plan.json)."""
import json, os
def k(f, pos, look, fov, glide=None, cut=False, push=0.002, punch=None, blur=6, focus=None, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=blur, why=why)
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    if focus: d["focus"] = focus
    return d
def A(p, d): return [round(p[i] + d[i], 4) for i in range(3)]

# ---- the sheet: 11 x 11 real Fossil holos (the 15 repeating in print order), 72 x 102 cm; local x across, local z down the
# sheet (row 0 = top = local -z); cell (r, c) centre below. On a table / floor the top row lies away from the lens.
SHEET = {"size": [0.72, 1.02], "cols": 11, "rows": 11, "card": [0.063, 0.088], "margin": [0.0135, 0.026], "tube_r": 0.045,
         "holos": ["fs_aerodactyl", "fs_articuno", "fs_ditto", "fs_dragonite", "fs_gengar", "fs_haunter", "fs_hitmonlee", "fs_hypno",
                   "fs_kabutops", "fs_lapras", "fs_magneton", "fs_moltres", "fs_muk", "fs_raichu", "fs_zapdos"]}
def cell(r, c): return [round(-0.3465 + (c + 0.5) * 0.063, 4), 0, round(-0.484 + (r + 0.5) * 0.088, 4)]
ZOOM = [4, 5]                                  # the Gengar the camera dives into (S13 -> S14): (4*11+5) % 15 = 4
DMG = {"scratch": [-0.12, 0, -0.26], "glue": [0.19, 0, 0.088], "crease": [-0.15, 0, 0.27], "corner": [-0.36, 0, -0.51]}

# ---- house: the landing (below) and the loft (above) share one frame; the hatch is the way between
CEIL, LOFT = 2.5, 2.62
H = dict(hatch=[0.0, -1.0], hatch_x=[-0.42, 0.42], hatch_z=[-1.35, -0.65], ladder=[0.0, -0.75], rel=[0.0, 0.7, -0.92],
         tube=[0.0, 2.665, -1.655], lights=[-0.05, 2.73, -1.84], fan=[0.45, LOFT, -2.0], fan_cage=[0.45, 3.48, -2.0], post=[-0.25, -2.25],
         calendar=[-0.25, 3.22, -2.2], scissors=[-0.25, 2.95, -2.2], frame=[-0.62, LOFT, -2.22], blade_rest=[0.52, LOFT + 0.01, -1.82],
         pop=[0.0, 1.25, -1.05], partner_pull=[0.0, 1.45, -1.25],
         floor_sheet=[0.05, 0.004, 0.55], owner_floor=[-0.68, 0.12], partner=[0.95, 0.75], tin_land=[0.25, 0.0, 0.95],
         wall_sheet=[1.288, 1.35, 0.6], partner_wall=[1.0, 1.15], bag=[0.95, 0.0, -0.2], owner_bag=[0.58, -0.05], tv=[-4.62, 1.4, 1.6])
WD = {k2: A(H["floor_sheet"], v) for k2, v in DMG.items()}           # damage spots on the landing floor sheet (world)
# ---- auction house (Cullens)
AU = dict(table=[-2.6, -2.4], table_size=[1.6, 1.2], top=0.9, sheet=[-2.6, 0.906, -2.4], valuer=[-2.6, -3.15], owner=[-3.55, -1.95],
          lamp=[-3.05, 0.9, -2.95], easel=[2.4, 1.35, -3.75], photog=[2.85, -1.95], valuer_rep=[3.75, -3.7], tripod=[2.4, -1.9], soft=[[1.35, -3.0], [3.45, -3.0]],
          rope=[[1.95, -3.15], [2.85, -3.15]], report=[3.25, 1.12, -3.6], rostrum=[0.0, -4.35], auctioneer=[0.0, -4.65],
          board=[0.0, 2.35, -4.95], seats=[[x, z] for z in (-2.6, -1.8) for x in (-0.9, -0.3, 0.3, 0.9)], owner_seat=6)
ZOOMW = A(AU["sheet"], cell(*ZOOM))
EZ = lambda d: [round(AU["easel"][0] + d[0], 4), round(AU["easel"][1] - d[2], 4), -3.74]   # a sheet point on the easel (upright)
# ---- KB Toys store, 1999
ST = dict(board=[0.5, 1.6, -3.96], sheet=[0.5, 1.55, -3.93], sign=[0.0, 2.55, -2.2], rel=[-2.25, -1.6], shelf_top=[-2.62, 1.5, -1.6],
          kids=[[0.15, -3.0], [0.85, -3.05]], rel15=[-0.05, -3.55], till=[1.9, -0.8])
# ---- print shop, 1999
PR = dict(press=[-1.3, -2.0], rollers_x=-0.05, bed=[0.75, 1.0, -2.0], sheet=[0.75, 1.006, -2.0], blade_z=-1.58, tray=[0.75, 0.75, -1.15], gantry=[0.15, 1.35])
ZOOMP = A(PR["sheet"], cell(*ZOOM))

P = {
 "fps": 30, "frames": 2290, "voice_end": 2275,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 212, "out": 250, "text": "1999 - 2026", "style": 3, "from": "top"},
  {"f": 1262, "out": 1322, "text": "1999", "style": 3, "from": "top"},
  {"f": 1525, "out": 1562, "text": "FOSSIL", "style": 3, "from": "top"},
  {"f": 2098, "out": 2150, "text": "29 · 11 · 2026", "style": 3, "from": "top"}],
 "sheet": SHEET, "zoom": ZOOM, "damage": DMG, "house": H, "auction": AU, "store": ST, "press": PR,
 "cards": {"holos": "Fossil 1-15 holos (pokemontcg.io base3 1-15): the sheet grid, the fresh press sheet, the cut cards, the promo board",
           "tv": ["fs_gengar", "fs_zapdos", "fs_moltres"]},
 "sets": {
  "landing": {"origin": [0, 0, 0], "axes": "+z toward the stairs (the lens side), the back wall z -3; the hatch in the ceiling at z -1, the loft right above",
   "light": "day", "sun": [60, 40], "open_sides": "+z",
   "objects": [
    {"id": "hall", "build": "new: upstairs hall x -1.3..1.3, z -3..3, ceiling 2.5 with the hatch opening; carpet, faded grid wallpaper (beige with pale yellow-bordered panels), white skirting, a radiator on the right wall", "pos": [0, 1.25, 0], "size": [2.6, 2.5, 6]},
    {"id": "hatch", "build": "new: opening 84 x 70 cm with a white frame lip; the door (2 cm board) hinged along its left edge x -0.42, opens up to vertical; a pull cord from its free edge", "pos": [0, CEIL, -1.0], "size": [0.84, 0.02, 0.7]},
    {"id": "stepladder", "build": "new: wooden A-frame stepladder, 4 steps (top step y 0.7, cap y 1.25), spreader cords", "pos": [0, 0.62, -0.75], "size": [0.5, 1.25, 0.7]},
    {"id": "doorway", "build": "new: doorway in the left wall z 1.2..2.0, 2.0 m high, into the living room (x -5..-1.3): sofa, a CRT-era flat TV on the far wall", "pos": [-1.3, 1.0, 1.6], "size": [0.1, 2.0, 0.8]},
    {"id": "tv", "build": "new: TV 1.0 x 0.6 m on a low cabinet, facing +x; the screen shows the news: a crowd shoving at a card-shop shelf (drawn, moving)", "pos": H["tv"], "size": [0.06, 0.6, 1.0]},
    {"id": "bag", "build": "new: black bin bag (lumpy sphere-ish sack 0.5 m, tied neck open), clear-out junk beside it: a box marked KHO", "pos": H["bag"], "size": [0.5, 0.55, 0.5]},
    {"id": "paint_tin", "build": "new: paint tin (cylinder r 9 cm, h 12 cm, wire handle)", "pos": H["tin_land"], "size": [0.18, 0.12, 0.18]}],
   "marks": {"relative": [0.0, -0.92], "owner_floor": H["owner_floor"], "partner": H["partner"], "partner_wall": H["partner_wall"], "owner_bag": H["owner_bag"]}},
  "loft": {"origin": [0, 0, 0], "axes": "same frame as the landing: boards at y 2.62, ridge along z at x 0 (y 4.4), gables at z -3.6 and 2.4",
   "light": "day", "sun": [40, 25], "open_sides": "+z (inside the roof)",
   "objects": [
    {"id": "roof", "build": "new: pitched roof x -2.6..2.6 (knee walls 0.28 m), rafters every 0.45 m, felt between, insulation between the joists, boards over them", "pos": [0, 3.5, -0.6], "size": [5.2, 1.8, 6.0]},
    {"id": "tube", "build": "the sheet, rolled (r 4.5 cm, 72 cm long, axis along x), a rubber band; it rests against the lights box", "pos": H["tube"], "size": [0.72, 0.09, 0.09]},
    {"id": "lights", "build": "new: cardboard box of Christmas lights (38 x 22 x 28 cm), flaps open, a green cable hanging out", "pos": H["lights"], "size": [0.38, 0.22, 0.28]},
    {"id": "fan", "build": "new: 1990s standing fan 1.1 m: round base, pole, motor, wire cage (r 20 cm) with one bent bar, three blades, one hanging loose out of the gap, the cord knotted round the pole", "pos": H["fan"], "size": [0.4, 1.1, 0.3]},
    {"id": "post", "build": "new: roof post 9 x 9 cm from the boards to the ridge purlin; a nail with rusty scissors (y 3.02); a 1999 calendar nailed above (26 x 36 cm, y 3.35)", "pos": [H["post"][0], 3.4, H["post"][1]], "size": [0.09, 1.6, 0.09]},
    {"id": "frame", "build": "new: empty gilt picture frame 36 x 30 cm leaning on the lights box", "pos": H["frame"], "size": [0.36, 0.3, 0.03]},
    {"id": "junk", "build": "new: a suitcase (x -0.85, z -2.5), a lampshade (x 1.0, z -2.4), the gable window (50 x 40 cm, z -3.6) with a dusty light shaft", "pos": [0, 3.0, -2.6], "size": [2, 1, 1]}],
   "marks": {"pop": [H["pop"][0], H["pop"][2]], "partner_pull": [H["partner_pull"][0], H["partner_pull"][2]]}},
  "auction": {"origin": [40, 0, 0], "axes": "the back wall z -5 (lot board) faces +z; the valuation counter on the left (x -2.6), the photo corner on the right (x 2.4), the saleroom chairs in the middle",
   "light": "day", "sun": [70, 45], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: hall x -5..5, z -5..4, 3.4 m high, oak floor, sage-green walls, white ceiling with pendant lamps", "pos": [0, 1.7, -0.5], "size": [10, 3.4, 9]},
    {"id": "counter", "build": "new: valuation table 1.6 x 1.2 m (top y 0.9), green baize mat, a desk lamp, a loupe", "pos": [AU["table"][0], 0.45, AU["table"][1]], "size": [1.6, 0.9, 1.2]},
    {"id": "easel", "build": "new: wooden studio easel holding the sheet upright (centre y 1.35), two softboxes on stands, a camera on a tripod, a red rope on two brass stands, a clipboard stand with the condition report", "pos": AU["easel"], "size": [0.72, 1.02, 0.02]},
    {"id": "rostrum", "build": "new: oak rostrum (top 1.2), gavel block", "pos": [AU["rostrum"][0], 0.6, AU["rostrum"][1]], "size": [0.9, 1.2, 0.5]},
    {"id": "lot_board", "build": "new: dark lot board, cream lettering: CULLENS OF SURREY / LOT 1 / UNCUT FOSSIL HOLO SHEET 1999 / ESTIMATE £6,000 - £10,000 (lines flip on)", "pos": AU["board"], "size": [2.2, 0.95, 0.04]},
    {"id": "chairs", "build": "new: two rows of four bentwood chairs", "pos": [0, 0.45, -2.2], "size": [2.4, 0.9, 1.4]}],
   "marks": {"valuer": AU["valuer"], "valuer_rep": AU["valuer_rep"], "owner": AU["owner"], "photog": AU["photog"], "auctioneer": AU["auctioneer"]}},
  "store": {"origin": [80, 0, 0], "axes": "the back wall z -4 (promotion board) faces +z, shelves along the left wall, the counter on the right",
   "light": "golden", "sun": [120, 35], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: shop x -3..3, z -4..2.5, 3 m high, chequered floor, yellow walls, strip lights", "pos": [0, 1.5, -0.75], "size": [6, 3, 6.5]},
    {"id": "shelves", "build": "new: metal shelving along x -2.95..-2.55, four shelves of toy boxes (bright, plain printing)", "pos": [-2.75, 1.0, -1.65], "size": [0.4, 2.0, 4.3]},
    {"id": "promo", "build": "new: cork promotion board 1.0 x 1.5 m on the back wall, a red header strip PROMOTION, the pristine sheet pinned at its corners", "pos": ST["board"], "size": [1.0, 1.5, 0.03]},
    {"id": "sign", "build": "new: hanging sign KB TOYS (plain red block lettering on white, 1.6 x 0.4 m) on two chains", "pos": ST["sign"], "size": [1.6, 0.4, 0.04]},
    {"id": "counter", "build": "new: shop counter 1.4 x 0.6 (top 1.0) with a till", "pos": [ST["till"][0], 0.5, ST["till"][1]], "size": [1.4, 1.0, 0.6]}],
   "marks": {"relative": ST["rel"], "relative15": ST["rel15"], "valuer_rep": AU["valuer_rep"], "kid1": ST["kids"][0], "kid2": ST["kids"][1]}},
  "press": {"origin": [120, 0, 0], "axes": "the press on the left feeds +x onto the guillotine bed; the back wall z -4",
   "light": "golden", "sun": [100, 40], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: print shop x -4..4, z -4..3, 3.4 m high, concrete floor, grey-blue walls, a skylight", "pos": [0, 1.7, -0.5], "size": [8, 3.4, 7]},
    {"id": "press", "build": "new: offset press body 2.4 x 1.3 x 1.2 m (green-grey, panels, gauges), two steel rollers at its +x face (y 1.02 and 1.12) that turn; the next sheet half out", "pos": [PR["press"][0], 0.65, PR["press"][1]], "size": [2.4, 1.3, 1.2]},
    {"id": "guillotine", "build": "new: guillotine: steel bed 1.1 x 1.2 (top 1.0), two side posts, a top beam, the blade bar (1.25 x 0.15) that drops on the cut line z -1.58", "pos": PR["bed"], "size": [1.1, 0.75, 1.2]},
    {"id": "tray", "build": "new: catch tray in front of the bed (y 0.75) with loose cut cards", "pos": PR["tray"], "size": [1.0, 0.08, 0.4]}],
   "marks": {}}},
 "cast": {
  "relative": {"look": ["red KB Toys staff vest with a name badge", "white shirt", "cap", "young"], "items": ["the rolled sheet", "rubber band", "toy boxes"], "views": ["front", "side"]},
  "owner": {"look": ["lilac cardigan", "round glasses", "dark hair", "lottery ticket in her pocket"], "items": ["the tube"], "views": ["front", "side", "sitting on the floor"]},
  "partner": {"look": ["green T-shirt", "jeans", "short dark hair"], "items": ["paint tin", "the sheet", "torch"], "views": ["front", "side", "head and shoulders in the hatch"]},
  "valuer": {"look": ["tweed jacket", "round glasses", "grey hair", "bow tie"], "items": ["loupe", "rubber stamp"], "views": ["front"]},
  "photographer": {"look": ["black tee", "black jeans", "beanie"], "items": ["tripod camera"], "views": ["front"]},
  "auctioneer": {"look": ["navy suit", "red tie", "grey hair"], "items": ["gavel"], "views": ["front"]},
  "kids": {"look": ["kid build: orange tee + cap; blue tee"], "items": [], "views": ["front"]},
  "heads": {"look": ["three family members 2003 / 2011 / 2019: a man in a cap, a teen with headphones, a woman with a bun"], "items": [], "views": ["head and shoulders in the hatch"]}},
 "scenes": []}

S = P["scenes"]
def scene(**kw): S.append(kw)
LOFTW = [-0.15, 3.4, 0.95]                           # the locked loft frame (S02-S05, S19)
LOFTL = [0.1, 2.98, -1.9]

scene(id="S01", hero=True, f=[0, 206], set="landing", light="golden",
  vo="Có người cuộn một tờ thẻ Pokémon chưa cắt, nhét lên gác mái, rồi bỏ quên nó lâu hơn tuổi đời của nhiều người đang xem video này.",
  gloss="Someone rolled up an uncut sheet of Pokémon cards, shoved it into the loft, and forgot it for longer than many of you watching have been alive.",
  spine=1, viewer="A sheet of cards goes up into the loft and the hatch slams on it.",
  **{"in": {"type": "open on the act"}, "out": {"type": "through-object", "n": 6, "to": "S02", "note": "push into the shut hatch seam, dissolve to the loft above"}},
  build="new: the landing, the hatch with its hinged door and pull cord, the stepladder; the tube (pristine sheet rolled) with a rubber band.",
  blocking="The relative (red vest) on the stepladder at [0, -0.92], feet on the top step y 0.7, front view, head just under the open hatch.",
  action="f0-40 tube at his chest; f40-54 he stretches the rubber band over it; f55 SNAP (band on 'cắt'). f58-66 lifts it overhead, f67 shoves it up through the hatch ('nhét'): it flies 25 cm up and drops out of sight onto the boards; roll f70-96 heard, a clank on the fan f97. f100-108 he reaches up for the pull cord and yanks it; the door tips past vertical and falls shut f108-122 (gravity, accelerating), SLAM f122 ('quên'): dust sifts down from the seams onto his cap, he squeezes his eyes and coughs f126-150. f130-206 the camera rises past him to the shut hatch.",
  acting="determined -> squeeze (dust) -> satisfied smile f160.",
  cams=[k(0, [0.85, 1.05, 1.45], [0.0, 1.95, -0.95], 50, push=0.0015, blur=6, focus=[0.0, 1.9, -0.92], why="low on the ladder, the hatch above"),
        k(130, [0.75, 1.95, -0.25], [0.12, 2.49, -1.0], 44, glide=60, push=0.003, blur=8, focus=[0.0, 2.5, -1.0], why="rise toward the shut hatch")],
  kicks=[[122, 1.0]], marks=[{"who": "relative", "at": [0.0, -0.92], "view": "front", "pose": "band, shove, cord yank", "expr": "stern -> squeeze -> smile"}],
  subjects=[{"n": "relative head", "p": [0.0, 2.3, -0.92], "f": [0, 120]}, {"n": "tube", "p": [0.0, 1.85, -0.85], "f": [0, 60]}, {"n": "hatch", "p": [0.0, 2.5, -1.0], "f": [100, 205]}],
  physics="tube toss: launched up at 2.2 m/s at f67, lands on the boards (unseen). Door: hinged at x -0.42, falls from 95 deg with gravity (angular, I = m L^2/3), slam f122, one 3 deg rebound. Dust: 40 motes fall from the seams, drift, settle by f190.",
  light_mood="golden 1999, warm bulb on the landing; a cold grey square of loft light in the open hatch until it shuts.",
  sound="rubber band twang f55; whoosh f66; thud + roll f70-96; fan clank f97; cord creak f104; SLAM f122 + Instagram Thud meme; cough f128.",
  after="The hatch is shut; dust settles on the landing carpet.")

scene(id="S02", f=[206, 256], set="loft", light="day", vo="Hai mươi bảy năm.", gloss="Twenty-seven years.",
  spine=1, viewer="Time passes in the loft.", **{"in": {"type": "through-object", "n": 6, "from": "S01"}, "out": {"type": "locked", "to": "S03"}},
  build="new: the loft with the tube against the lights box, the fan, the post with the calendar, the scissors, the empty frame.",
  blocking="nobody.", action="Locked frame. The calendar's pages flip on their own from 1999 to 2026 (f212-250, a page every 1.4 f, pages fluttering off and gone); the dust layer on the tube and the boards greys over. Title 1999 - 2026 f212.",
  acting="none", cams=[k(206, LOFTW, LOFTL, 54, push=0.001, blur=4, focus=[0.0, 2.75, -1.7], why="the locked loft frame")],
  kicks=[], marks=[], subjects=[{"n": "tube", "p": H["tube"], "f": [206, 255]}, {"n": "calendar", "p": H["calendar"], "f": [206, 255]}],
  physics="none.", light_mood="cold grey day from the gable window, a dusty light shaft.", sound="calendar flutter rising; a clock tick sped up.", after="Calendar on 2026.")

scene(id="S03", f=[256, 384], set="loft", light="day", vo="Nó sống chung với bụi, với nhện, và với cái quạt hỏng mà không ai dám vứt.",
  gloss="It lived with the dust, the spiders, and a broken fan nobody dares throw away.", spine=1, viewer="Dust, a spider, the fan nobody dares touch.",
  **{"in": {"type": "locked", "from": "S02"}, "out": {"type": "push", "to": "S04"}},
  build="the same frame; the hatch door opens and shuts for three heads.", blocking="Three heads pop up through the hatch at [0, -1.05] (feet y 1.25 on the ladder): f344-354 man in a cap, f356-366 teen with headphones, f368-380 woman with a bun.",
  action="f285-300 a dust puff drifts across the tube ('bụi'); f305-330 a spider drops on its thread from the rafter to just above the tube ('nhện' f311) and hangs, swaying; f339-343 the fan's loose blade creaks and swings ('quạt hỏng'). Each head: the door swings up 8 f, the head rises, eyes the fan, the blade twitches, the head ducks back down and the door drops (f344-380, 'không ai dám vứt').",
  acting="heads: nervous, eyes on the fan.", cams=[k(256, LOFTW, LOFTL, 54, push=0.0012, blur=4, focus=[0.0, 2.75, -1.7], why="same frame")],
  kicks=[], marks=[{"who": "heads", "at": [H["pop"][0], H["pop"][2]], "view": "front", "pose": "pop up, duck", "expr": "nervous"}],
  subjects=[{"n": "tube", "p": H["tube"], "f": [256, 340]}, {"n": "fan cage", "p": H["fan_cage"], "f": [330, 383]}],
  physics="the loose blade: a pendulum on its hub pin (swing 18 deg, damped).", light_mood="same.", sound="dust whisper; spider zip f305; fan creak f340; three door clunks; Suspicious Sound meme f356.", after="—")

scene(id="S04", f=[384, 510], set="loft", light="day", vo="Không ai cắt. Không ai đóng khung. Không ai nhớ nó tồn tại.",
  gloss="Nobody cut it. Nobody framed it. Nobody remembered it existed.", spine=1, viewer="Three things left undone.",
  **{"in": {"type": "push", "from": "S03"}, "out": {"type": "dissolve", "n": 6, "to": "S05", "note": "back to the wide frame, 2026"}},
  build="the scissors (rusty, open, on the nail), the empty frame, the cobweb over the tube.", blocking="nobody.",
  action="f386-410 the camera glides to the rusty scissors on the nail ('cắt' f412); f420-446 to the empty frame ('khung' f446); f456-490 down to the tube as the last strands of web close over it ('tồn tại' f495).",
  acting="none", cams=[k(384, LOFTW, LOFTL, 54, push=0, blur=4),
        k(386, [-0.12, 3.08, -1.45], H["scissors"], 34, glide=24, push=0.002, blur=10, focus=H["scissors"], why="the scissors nobody used"),
        k(420, [-0.3, 2.95, -1.25], A(H["frame"], [0, 0.15, 0]), 36, glide=34, push=0.002, blur=10, focus=A(H["frame"], [0, 0.15, 0]), why="the frame nobody filled"),
        k(456, [0.15, 2.92, -1.1], H["tube"], 34, glide=30, push=0.0025, blur=10, focus=H["tube"], why="the web seals the tube")],
  kicks=[], marks=[], subjects=[{"n": "scissors", "p": H["scissors"], "f": [410, 418]}, {"n": "frame", "p": A(H["frame"], [0, 0.15, 0]), "f": [444, 452]}, {"n": "tube", "p": H["tube"], "f": [486, 509]}],
  physics="none.", light_mood="same.", sound="three soft low notes, one per 'không ai'.", after="The tube under a web.")

scene(id="S05", f=[510, 560], set="loft", light="day", vo="Rồi nhà dọn kho.", gloss="Then the family cleared out the storage.",
  spine=2, viewer="2026: someone comes up.", **{"in": {"type": "dissolve", "n": 6, "from": "S04"}, "out": {"type": "locked", "to": "S06"}},
  build="same loft, 2026: heavier dust.", blocking="The partner's head pops up at [0, -1.05] f540, a torch beam ahead of it.",
  action="f526 a thump under the door, f533 ('kho') it swings open to vertical and bangs on its stop; dust bursts up in the light; f536 a torch beam sweeps the boards; f540 the partner's head rises, he spots the tube.",
  acting="partner: curious -> eyebrows up.", cams=[k(510, LOFTW, LOFTL, 54, push=0.0015, blur=4, focus=[0.0, 2.75, -1.4], why="the wide frame, 2026")],
  kicks=[[533, 0.6]], marks=[{"who": "partner", "at": [H["pop"][0], H["pop"][2]], "view": "front", "pose": "head up through the hatch", "expr": "neutral -> shock"}],
  subjects=[{"n": "partner head", "p": [0.0, 2.95, -1.05], "f": [542, 559]}, {"n": "tube", "p": H["tube"], "f": [510, 559]}],
  physics="door: pushed up from below, swings 90 deg in 6 f, bounces 4 deg on its stop.", light_mood="grey day plus a torch cone.", sound="thump f526, door bang f533, dust puff, torch click f536.", after="Hatch open.")

scene(id="S06", f=[560, 600], set="loft", light="day", vo="Có người kéo nó ra,", gloss="Someone pulls it out,",
  spine=2, viewer="He takes the tube down.", **{"in": {"type": "locked", "from": "S05"}, "out": {"type": "cut", "to": "S07", "note": "match on the tube going down the hole"}},
  build="same.", blocking="The partner climbs a rung higher (feet y 1.45, at [0, -1.25]), side view facing the tube (-z), crouched over the rim.",
  action="f562-574 he rises a rung; f576-586 ('kéo' f580) his arm reaches the tube and drags it off the boards, the web tearing in strands; f588-598 he ducks down through the hatch with it ('ra' f594).",
  acting="effort -> grin.", cams=[k(560, LOFTW, LOFTL, 54, push=0.002, blur=4, focus=[0.0, 2.8, -1.4]),
        k(562, [1.95, 3.15, -1.3], [-0.1, 2.85, -1.45], 44, glide=20, push=0.002, blur=8, focus=[0.0, 2.75, -1.45], why="in on the pull")],
  kicks=[], marks=[{"who": "partner", "at": [H["partner_pull"][0], H["partner_pull"][2]], "view": "front", "pose": "reach, drag, duck", "expr": "effort -> grin"}],
  subjects=[{"n": "tube", "p": H["tube"], "f": [560, 586]}],
  physics="web strands snap and hang; dust cloud where the tube lay, a clean stripe left on the boards.", light_mood="same.", sound="web snaps, a scrape.", after="A clean stripe on the boards where the tube lay (stays in S19).")

scene(id="S07", f=[600, 645], set="landing", light="day", vo="mở cuộn,", gloss="unrolls it,",
  spine=2, viewer="On the landing floor, the sheet rolls out.", **{"in": {"type": "cut", "from": "S06"}, "out": {"type": "push", "to": "S08"}},
  build="the landing in 2026: the stepladder under the hatch, the clear-out bag; the paint tin.", blocking="The owner sits on the carpet at [-0.55, 0.1] beside the far end of the sheet; the partner stands at [0.75, 1.3] with the paint tin.",
  action="f600-612 the tube is already on the carpet at the far end; f616-620 she gives it a push ('cuộn' f620): it rolls toward the lens, unrolling, to full length by f638; the near end springs back up into a 15 cm curl f638-642; f641 the partner drops the paint tin on the curl: it lands f645 and flattens it.",
  acting="owner curious; partner bored.", cams=[k(600, [0.25, 2.0, 2.25], [-0.05, 0.15, 0.45], 54, push=0.0015, blur=5, focus=[0.05, 0.0, 0.55], why="high over the landing floor")],
  kicks=[[645, 0.4]], marks=[{"who": "owner", "at": H["owner_floor"], "view": "front", "pose": "sit on the floor, push the roll", "expr": "neutral"},
                            {"who": "partner", "at": H["partner"], "view": "front", "pose": "hold the tin, drop it", "expr": "neutral"}],
  subjects=[{"n": "sheet", "p": H["floor_sheet"], "f": [620, 644]}, {"n": "owner head", "p": [-0.55, 0.85, 0.1], "f": [600, 644]}],
  physics="roll: pushed at 1.9 m/s, rolling friction brings it to the end; tin: dropped from 0.85 m with 0.8 m/s toward -x, lands on the curl f645, rocks 2 f.",
  light_mood="2026 day, white ceiling light.", sound="paper unrolling rasp f620-638, tin clunk f645.", after="The sheet flat on the carpet, the tin on its near end.")

scene(id="S08", hero=True, f=[645, 795], set="landing", light="day", vo="và nhìn: trầy xước, dính keo, nhăn nhúm, mặt sau còn rách một mảng.",
  gloss="and looks: scratched, stained with glue, creased, and a chunk torn off the back.", spine=2, viewer="It's a wreck.",
  **{"in": {"type": "push", "from": "S07"}, "out": {"type": "glide", "to": "S09"}},
  build="the sheet's damage layers: a scratch across row 2, a glue blob on row 6, a crease across rows 8-9, the torn back corner (top left).",
  blocking="Owner still on the floor at the top-left corner.",
  action="f645-660 low macro on the scratch ('trầy xước' f653-673); f676 glide to the glue blob ('dính keo' f687); f706 to the crease ('nhăn nhúm' f716); f745 to the top-left corner: the owner lifts it f752-764 ('mặt sau' f741), it folds back and shows the torn back ('rách' f767), she lets go f788.",
  acting="owner: lips pressed, wincing at each spot.",
  cams=[k(645, A(WD["scratch"], [0.15, 0.42, 0.32]), WD["scratch"], 34, push=0.002, blur=12, focus=WD["scratch"], why="the scratch"),
        k(676, A(WD["glue"], [0.12, 0.38, 0.3]), WD["glue"], 34, glide=26, push=0.002, blur=12, focus=WD["glue"], why="the glue"),
        k(706, A(WD["crease"], [0.1, 0.4, 0.3]), WD["crease"], 34, glide=26, push=0.002, blur=12, focus=WD["crease"], why="the crease"),
        k(740, [-0.05, 0.75, 0.85], A(WD["corner"], [0.0, 0.12, 0.05]), 40, glide=22, push=0.002, blur=10, focus=A(WD["corner"], [0.0, 0.1, 0.05]), why="the torn back")],
  kicks=[], marks=[{"who": "owner", "at": H["owner_floor"], "view": "front", "pose": "lift the corner", "expr": "pained"}],
  subjects=[{"n": "scratch", "p": WD["scratch"], "f": [655, 672]}, {"n": "glue", "p": WD["glue"], "f": [702, 705]}, {"n": "crease", "p": WD["crease"], "f": [732, 739]}, {"n": "corner", "p": A(WD["corner"], [0, 0.1, 0.05]), "f": [764, 794]}],
  physics="the corner: a fold along the diagonal 18 cm in, lifted to 120 deg and let fall (paper flutter, settles 6 f).", light_mood="same.", sound="a sad violin sting under the list (Meme Violin Sad Violin, low).", after="The sheet as it was, damage showing.")

scene(id="S09", hero=True, f=[795, 880], set="landing", light="day", vo="\"Giấy dán tường hả? Vứt đi cho rộng chỗ.\"",
  gloss="\"Wallpaper? Bin it, we need the space.\"", spine=2, viewer="It looks exactly like the wallpaper, so he bins it.",
  **{"in": {"type": "glide", "from": "S08"}, "out": {"type": "glide", "to": "S10"}},
  build="the right wall's wallpaper (same faded grid); the bin bag.", blocking="The partner at [1.0, 1.28], beside the sheet's right edge; the owner gets up and stands at [-0.4, 0.3].",
  action="f795-811 he lifts the sheet off the floor and presses it flat to the right wall: it matches the wallpaper ('Giấy dán tường' f799-815); he looks from it to the lens, shrugs ('hả' f821). f834 ('Vứt đi') he peels it off; it rolls up loosely in his hands f836-846; f848 he tosses it: it arcs across and drops upright into the bin bag f860 ('chỗ').",
  acting="partner: deadpan, shrug, toss.", cams=[k(795, [-1.1, 1.45, 0.8], [1.29, 1.3, 0.78], 46, glide=24, push=0.002, blur=6, focus=[1.2, 1.3, 0.65], why="the sheet on the wall"),
        k(840, [-0.9, 1.45, 1.25], [0.95, 0.8, -0.2], 46, glide=20, push=0.002, blur=6, focus=[0.95, 0.6, -0.2], why="follow the toss to the bag")],
  kicks=[[860, 0.3]], marks=[{"who": "partner", "at": H["partner_wall"], "view": "front", "pose": "press to the wall, shrug, toss", "expr": "neutral -> smirk"}],
  subjects=[{"n": "wall sheet", "p": H["wall_sheet"], "f": [812, 833]}, {"n": "bag", "p": A(H["bag"], [0, 0.55, 0]), "f": [856, 879]}],
  physics="the toss: a tube of 0.25 kg thrown at (−1.3, 2.0, −1.8) m/s, lands upright in the bag neck, wobbles.", light_mood="same.", sound="paper slap on the wall f811; HUH? no: a flat 'bruh' beat f821 (BRUH meme); toss whoosh f848, rustle in the bag f860.", after="The tube sticks up out of the bin bag.")

scene(id="S10", f=[880, 1050], set="landing", light="day", vo="May thay, người chủ để ý thấy cả thế giới đang phát điên vì thẻ Pokémon, nên ôm nó đi hỏi,",
  gloss="Luckily the owner noticed the whole world going mad for Pokémon cards, so she hugged it and took it to ask,", spine=3, viewer="She saves it; the TV shows the card craze.",
  **{"in": {"type": "glide", "from": "S09"}, "out": {"type": "dissolve", "n": 6, "to": "S11"}},
  build="the doorway and the living-room TV.", blocking="The owner dashes from [-0.4, 0.3] to [0.58, -0.05] f885-897, pulls the tube out of the bag; then turns to the TV.",
  action="f885-897 ('May thay') she dashes and yanks the tube out of the bag f900; f925-955 the camera swings to the doorway: the TV news shows a crowd shoving at a card-shop shelf, cards flying ('phát điên' f972-985); f1000-1020 back to her: she hugs the tube to her chest ('ôm' f1028).",
  acting="owner: alarm -> stare at the TV -> tight hug, determined.",
  cams=[k(880, [-0.9, 1.45, 1.25], [0.75, 1.0, -0.1], 46, push=0.002, blur=6, focus=[0.6, 1.0, -0.1], why="she grabs it"),
        k(925, [0.4, 1.45, 1.95], [-4.6, 1.4, 1.6], 40, glide=40, push=0.002, blur=6, focus=[-4.6, 1.05, 1.6], why="through the doorway to the TV"),
        k(1000, [-0.2, 1.5, 1.9], [0.58, 1.15, -0.05], 40, glide=24, push=0.003, blur=10, focus=[0.58, 1.2, -0.05], why="the hug")],
  kicks=[], marks=[{"who": "owner", "at": H["owner_bag"], "view": "front", "pose": "dash, yank, stare, hug", "expr": "shock -> stern"}],
  subjects=[{"n": "owner head", "p": [0.58, 1.6, -0.05], "f": [890, 920]}, {"n": "tv", "p": H["tv"], "f": [956, 995]}, {"n": "owner head", "p": [0.58, 1.6, -0.05], "f": [1025, 1049]}],
  physics="none.", light_mood="same; the TV glows.", sound="dash footsteps; bag rustle f900; TV crowd roar f960-1000; a hug squeeze.", after="She holds the tube.")

scene(id="S11", f=[1050, 1135], set="auction", light="day", vo="chắc là với vẻ mặt của người vừa dò vé số.",
  gloss="probably with the face of someone checking a lottery ticket.", spine=3, viewer="At the valuation counter, lottery face.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S10"}, "out": {"type": "cut", "to": "S12"}},
  build="the auction house counter.", blocking="Owner at [-3.55, -1.95] (front-left of the counter), the valuer behind it at [-2.6, -3.15], the tube on the mat.",
  action="f1052-1080 she sets the tube on the mat and steps back; f1100-1130 she squeezes her eyes shut, peeks, a sweat drop ('dò vé số' f1110); a lottery ticket sticks out of her cardigan pocket.",
  acting="owner: squeeze -> one-eye peek; valuer neutral.", cams=[k(1050, [-2.95, 1.45, 0.15], [-3.45, 1.35, -2.05], 40, push=0.003, punch=[0.006, 14], blur=10, focus=[-3.55, 1.5, -1.95], why="her lottery face")],
  kicks=[], marks=[{"who": "owner", "at": AU["owner"], "view": "front", "pose": "put down, squeeze", "expr": "pained"}, {"who": "valuer", "at": AU["valuer"], "view": "front", "pose": "stand", "expr": "neutral"}],
  subjects=[{"n": "owner head", "p": [-3.55, 1.55, -1.95], "f": [1060, 1134]}], physics="none.", light_mood="auction house day.", sound="room tone; a drum roll tick under the peek.", after="—")

scene(id="S12", f=[1135, 1245], set="auction", light="day", vo="Khoan đã, ai lại có nguyên một tờ thẻ chưa cắt nằm trong nhà?",
  gloss="Wait, who has a whole uncut sheet lying around at home?", spine=4, viewer="The valuer can't believe it.",
  **{"in": {"type": "cut", "from": "S11"}, "out": {"type": "dissolve", "n": 8, "to": "S13", "note": "flashback, 1999"}},
  build="loupe on the counter.", blocking="valuer at his mark, close.",
  action="f1140 ('Khoan') he freezes mid-reach for the loupe, eyes go wide; f1160-1230 slow push on his face as he leans in to the lens.",
  acting="valuer: shock -> narrowed suspicion.", cams=[k(1135, [-2.45, 1.55, -1.75], [-2.6, 1.6, -3.15], 34, push=0.004, blur=12, focus=[-2.6, 1.6, -3.15], why="his face")],
  kicks=[[1140, 0.5]], marks=[{"who": "valuer", "at": AU["valuer"], "view": "front", "pose": "freeze, lean", "expr": "shock -> stern"}],
  subjects=[{"n": "valuer head", "p": [-2.6, 1.6, -3.15], "f": [1135, 1244]}], physics="none.", light_mood="same.", sound="record scratch f1140 (cut), Huh meme f1142.", after="—")

scene(id="S13", f=[1245, 1390], set="store", light="golden", vo="Hóa ra, một người thân từng làm cho chuỗi đồ chơi KB Toys suốt những năm chín mươi.",
  gloss="It turns out a relative worked for the KB Toys chain all through the nineties.", spine=4, viewer="1999: the relative in his KB Toys vest.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S12"}, "out": {"type": "dissolve", "n": 6, "to": "S14"}},
  build="the store, 1999.", blocking="The relative at [-2.15, -1.6] by the shelves, front view.",
  action="f1250-1300 he lifts a toy box and slides it onto the top shelf; f1339 ('KB Toys') the camera tilts up to the hanging KB TOYS sign; title 1999 f1262.",
  acting="relative: cheerful, a whistle.", cams=[k(1245, [-0.8, 1.45, 0.4], [-2.2, 1.35, -1.7], 42, push=0.002, blur=8, focus=[-2.15, 1.4, -1.6], why="the relative at work"),
        k(1330, [-0.3, 1.4, 0.6], [-0.4, 2.35, -2.2], 42, glide=36, push=0.002, blur=6, focus=ST["sign"], why="up to the sign")],
  kicks=[], marks=[{"who": "relative", "at": ST["rel"], "view": "front", "pose": "stack a box", "expr": "whistle"}],
  subjects=[{"n": "relative head", "p": [-2.15, 1.6, -1.6], "f": [1265, 1330]}, {"n": "sign", "p": ST["sign"], "f": [1360, 1389]}],
  physics="box set down with a 1 cm settle.", light_mood="golden 1999, strip lights.", sound="shop chatter, a till ding f1300, whistle.", after="—")

scene(id="S14", hero=True, f=[1390, 1578], set="auction", light="day", vo="Và đây không phải giấy dán tường. Đây là tờ thẻ hologram bộ Fossil,",
  gloss="And this isn't wallpaper. This is a holographic Fossil card sheet,", spine=5, viewer="Flattened under the lamp, the holos shine.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S13"}, "out": {"type": "through-object", "n": 8, "to": "S15", "note": "dive into the Gengar, dissolve to the same card on the fresh sheet"}},
  build="the sheet on the baize (damaged), the desk lamp on.", blocking="The valuer at [-2.6, -3.15], crouched over the far edge; the owner at her mark.",
  action="f1395-1418 ('không phải giấy dán tường') he rolls the tube out across the mat toward the lens; f1420 he switches the lamp on; f1498 ('hologram') a gleam sweeps the foil across all 121 cards; title FOSSIL f1525; f1540-1575 the camera dives into one Gengar.",
  acting="valuer: careful -> delighted; owner: one eye open -> both.", cams=[
        k(1390, [-1.75, 1.6, -0.85], [-2.6, 0.95, -2.45], 42, push=0.0015, blur=6, focus=AU["sheet"], why="the unroll on the mat"),
        k(1470, [-2.6, 2.1, -1.45], [-2.6, 0.9, -2.5], 40, glide=26, push=0.002, blur=6, focus=AU["sheet"], why="over the whole sheet for the gleam"),
        k(1540, A(ZOOMW, [0.0, 0.165, 0.1]), ZOOMW, 28, glide=34, push=0.004, blur=10, focus=ZOOMW, why="into the Gengar")],
  kicks=[], marks=[{"who": "valuer", "at": AU["valuer"], "view": "front", "pose": "unroll, lamp", "expr": "neutral -> grin"}, {"who": "owner", "at": AU["owner"], "view": "front", "pose": "watch", "expr": "nervous -> shock"}],
  subjects=[{"n": "sheet", "p": AU["sheet"], "f": [1420, 1540]}, {"n": "gengar", "p": ZOOMW, "f": [1560, 1577]}],
  physics="the roll: pushed at 1.4 m/s, unrolls to full length f1418.", light_mood="day + the lamp's warm pool.", sound="unroll rasp, lamp click f1420, shimmer + Wowww meme f1498.", after="Sheet flat on the mat.")

scene(id="S15", hero=True, f=[1578, 1650], set="press", light="golden", vo="y như lúc vừa ra khỏi máy in, trước khi bị chặt thành từng lá.",
  gloss="exactly as it came off the press, before it was chopped into single cards.", spine=5, viewer="Off the press; the guillotine cuts it into cards.",
  **{"in": {"type": "through-object", "n": 8, "from": "S14"}, "out": {"type": "dissolve", "n": 6, "to": "S16"}},
  build="the press, rollers turning, the guillotine, the tray of cut cards.", blocking="nobody (the machines).",
  action="f1578-1600 pull back from the same Gengar on a perfect sheet lying on the guillotine bed; the rollers turn and the next sheet slides out ('máy in' f1585); f1606-1614 the blade rises; f1617 ('chặt') it drops: the last row is cut off and the strip of 11 cards slides off the bed into the tray, knocking loose cards that skid and settle by f1640.",
  acting="none", cams=[k(1578, A(ZOOMP, [0.0, 0.165, 0.1]), ZOOMP, 28, push=0, blur=10, focus=ZOOMP),
        k(1580, [1.9, 1.95, -0.15], [0.65, 0.92, -1.68], 48, glide=34, push=0.002, blur=6, focus=[0.75, 1.0, -1.7], why="the press and the guillotine")],
  kicks=[[1617, 0.9]], marks=[], subjects=[{"n": "bed", "p": PR["bed"], "f": [1606, 1649]}, {"n": "tray", "p": PR["tray"], "f": [1620, 1649]}],
  physics="blade: 1 f drop from y 1.55 to 1.01, 2 f rebound; strip: slides 22 cm and tips into the tray; 9 loose cards skid (mu 0.35) and rest.", light_mood="golden 1999, skylight.", sound="press clatter loop, roller hiss, CHOP f1617 (Punch Hit), cards slapping.", after="Cut cards in the tray.")

scene(id="S16", f=[1650, 1775], set="store", light="golden", vo="Những tờ như thế từng được in riêng cho một đợt khuyến mãi của KB Toys.",
  gloss="Sheets like that were printed specially for a KB Toys promotion.", spine=5, viewer="The promo board in the 1999 store.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S15"}, "out": {"type": "dissolve", "n": 6, "to": "S17"}},
  build="the promo board with the pristine sheet pinned.", blocking="Two kids at their marks look up at the board; the relative beside it.",
  action="f1660-1700 push up to the board; kids point at it f1700 ('khuyến mãi' f1728); the relative taps the PROMOTION header f1746 ('KB Toys').",
  acting="kids: shock -> grin; relative proud.", cams=[k(1650, [0.45, 1.75, -0.6], [0.45, 1.55, -3.9], 46, push=0.002, blur=6, focus=ST["sheet"], why="the promo board")],
  kicks=[], marks=[{"who": "kid1", "at": ST["kids"][0], "view": "front", "pose": "point up", "expr": "shock"}, {"who": "kid2", "at": ST["kids"][1], "view": "front", "pose": "look up", "expr": "grin"},
                   {"who": "relative", "at": ST["rel15"], "view": "front", "pose": "tap the header", "expr": "grin"}],
  subjects=[{"n": "promo sheet", "p": ST["sheet"], "f": [1650, 1774]}], physics="none.", light_mood="golden 1999.", sound="kids 'ooh' (Kids Cheering, short) f1700.", after="—")

scene(id="S17", f=[1775, 1950], set="auction", light="day", vo="Giờ thì tờ giấy suýt bị vứt ấy được chụp cận từng vết xước như minh tinh, kèm hẳn biên bản tình trạng.",
  gloss="Now the paper that nearly got binned is shot close-up, scratch by scratch, like a film star, with its own condition report.", spine=6, viewer="A photo shoot for a wreck.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S16"}, "out": {"type": "glide", "to": "S18"}},
  build="the photo corner: the easel with the sheet, softboxes, tripod camera, red rope, the report on its stand.", blocking="The photographer at [3.05, -1.95] by the tripod; the valuer stamps the report.",
  action="f1780-1830 wide of the set-up; f1842 ('chụp') FLASH; f1850 push on the scratch, FLASH f1859; glue, FLASH f1873; crease, FLASH f1886 ('minh tinh'); f1900-1930 glide to the report: a rubber stamp comes down f1923 ('biên bản') leaving CONDITION REPORT in red.",
  acting="photographer: crouched, serious.", cams=[
        k(1775, [2.55, 1.55, -0.25], [2.45, 1.3, -3.6], 44, push=0.0015, blur=4, focus=AU["easel"], why="the shoot"),
        k(1848, A(EZ(DMG["scratch"]), [0.05, 0.02, 0.75]), EZ(DMG["scratch"]), 30, glide=8, push=0.003, blur=10, focus=EZ(DMG["scratch"]), why="the scratch, close"),
        k(1868, A(EZ(DMG["glue"]), [0.05, 0.02, 0.75]), EZ(DMG["glue"]), 30, glide=8, push=0.003, blur=10, focus=EZ(DMG["glue"]), why="the glue"),
        k(1882, A(EZ(DMG["crease"]), [0.05, 0.02, 0.75]), EZ(DMG["crease"]), 30, glide=8, push=0.003, blur=10, focus=EZ(DMG["crease"]), why="the crease"),
        k(1900, [3.0, 1.45, -2.35], AU["report"], 38, glide=20, push=0.002, blur=10, focus=AU["report"], why="the condition report")],
  kicks=[[1923, 0.4]], marks=[{"who": "photographer", "at": AU["photog"], "view": "front", "pose": "shoot", "expr": "stern"}],
  subjects=[{"n": "easel sheet", "p": AU["easel"], "f": [1780, 1840]}, {"n": "report", "p": AU["report"], "f": [1925, 1949]}],
  physics="stamp: down in 2 f, up in 4.", light_mood="day + softbox glow; flashes white 2 f.", sound="Camera shutter meme on each flash (f1842, 1859, 1873, 1886); stamp thunk f1923.", after="Report stamped.")

scene(id="S18", f=[1950, 2085], set="auction", light="day", vo="Nhà đấu giá Cullens of Surrey định giá từ sáu đến mười nghìn bảng Anh.",
  gloss="The auction house Cullens of Surrey estimates six to ten thousand pounds.", spine=6, viewer="£6,000 - £10,000.",
  **{"in": {"type": "glide", "from": "S17"}, "out": {"type": "glide", "to": "S19"}},
  build="the lot board, the chairs.", blocking="The owner seated in the front row (seat 2).",
  action="f1955-1990 travel across to the lot board: CULLENS OF SURREY / LOT 1 / UNCUT FOSSIL HOLO SHEET 1999 lit; f2036 ('sáu') ESTIMATE £6,000 flips on; f2056 ('mười') - £10,000 flips on; f2062 the owner's jaw drops.",
  acting="owner: gape 0.6.", cams=[k(1950, [3.0, 1.45, -2.35], AU["report"], 38, push=0, blur=6),
        k(1955, [0.9, 1.6, 1.6], [0.0, 1.9, -4.9], 40, glide=44, push=0.002, punch=[0.006, 12], blur=6, focus=AU["board"], why="the lot board over the owner")],
  kicks=[[2036, 0.3], [2056, 0.5]], marks=[{"who": "owner", "at": AU["seats"][AU["owner_seat"]], "view": "front, seated", "pose": "sit", "expr": "neutral -> shock (gape)"}],
  subjects=[{"n": "board", "p": AU["board"], "f": [2000, 2084]}, {"n": "owner head", "p": [0.3, 1.25, -2.6], "f": [2050, 2084]}],
  physics="none.", light_mood="same.", sound="board flap f2036, f2056 + Kaching f2056.", after="Board shows the estimate.")

scene(id="S19", f=[2085, 2175], set="auction", light="day", vo="Chủ nhật, hai mươi chín tháng mười một, búa sẽ gõ.",
  gloss="Sunday, 29 November, the hammer will fall.", spine=6, viewer="The date; the gavel is ready.",
  **{"in": {"type": "glide", "from": "S18"}, "out": {"type": "dissolve", "n": 8, "to": "S20", "note": "back to the loft"}},
  build="rostrum, gavel.", blocking="The auctioneer behind the rostrum.",
  action="f2090-2120 glide to the auctioneer; title 29 · 11 · 2026 f2098; f2140-2150 he raises the gavel and holds it at the top ('búa sẽ gõ' f2147-2164): a beat of stillness, it does not fall.",
  acting="auctioneer: stern, eyebrows up.", cams=[k(2085, [0.9, 1.6, 1.6], [0.0, 1.9, -4.9], 40, push=0, blur=6),
        k(2090, [0.55, 1.55, -1.9], [0.0, 1.75, -4.6], 40, glide=30, push=0.002, blur=10, focus=[0.0, 1.8, -4.65], why="the auctioneer, gavel up")],
  kicks=[], marks=[{"who": "auctioneer", "at": AU["auctioneer"], "view": "front", "pose": "gavel up, hold", "expr": "stern"}],
  subjects=[{"n": "auctioneer head", "p": [0.0, 1.95, -4.65], "f": [2125, 2174]}], physics="none.", light_mood="same.", sound="room hush; one held note; a heartbeat thump f2164.", after="Gavel held up.")

scene(id="S20", f=[2175, 2290], set="loft", light="day", vo="Còn cái quạt hỏng thì vẫn nằm trên gác. Biết đâu đấy.",
  gloss="And the broken fan is still up in the loft. Who knows.", spine=7, viewer="Maybe the fan is worth something too.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S19"}, "out": {"type": "end"}},
  build="the loft, 2026: the clean stripe where the tube lay, the fan.", blocking="The partner's head up through the hatch at [0, -1.05] from f2185.",
  action="f2180-2200 the hatch door swings up, the partner's head rises, eyes on the fan ('quạt hỏng' f2201); f2240 ('gác') the loose blade finally drops off: it hits the boards, bounces twice and rests; f2252 ('Biết đâu') he squints at it; push to the end.",
  acting="partner: suspicious squint, then a small grin f2268.", cams=[k(2175, [-0.15, 3.4, 0.95], [0.3, 3.05, -1.95], 46, push=0.003, punch=[0.005, 14], blur=6, focus=[0.4, 3.1, -1.9], why="the fan and his head")],
  kicks=[[2240, 0.4]], marks=[{"who": "partner", "at": [H["pop"][0], H["pop"][2]], "view": "front", "pose": "head up, eyes on the fan", "expr": "stern -> grin"}],
  subjects=[{"n": "fan cage", "p": H["fan_cage"], "f": [2180, 2289]}, {"n": "blade rest", "p": H["blade_rest"], "f": [2245, 2289]}],
  physics="blade (60 g): falls 0.8 m from the cage, bounces twice (restitution 0.3), rests flat.", light_mood="grey day.", sound="door bang f2182; blade clank f2242 + rattle; Suspicious Sound meme f2252.", after="End on the fan.")

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(S), "scenes")
