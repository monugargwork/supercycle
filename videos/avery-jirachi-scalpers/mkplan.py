"""Generator of plan.json for the Jirachi (Avery the Poke Kid) reel. The plan is the source of truth: change it here, then
python3 videos/avery-jirachi-scalpers/mkplan.py && python3 scripts/plan_check.py videos/avery-jirachi-scalpers/plan.json"""
import json, os
def k(f, pos, look, fov, glide=None, cut=False, push=0.002, punch=None, blur=6, focus=None, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=blur, why=why)
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    if punch: d["punch"] = punch
    if focus: d["focus"] = focus
    return d

# ---------------- layout (set-local metres; the build reads these) ----------------
DESK_Y = 0.76
ROOM = dict(desk=[-1.0, 1.2, -2.35, -1.6], seller=[-0.15, -1.45], stand=[-0.55, DESK_Y, -1.8], card=[-0.55, 0.835, -1.8],
            ring=[-0.25, 1.06, -2.15], monitor=[0.35, 1.08, -2.2], screen=[0.64, 0.38], mon_yaw=-0.22, keyboard=[0.35, 0.77, -1.92],
            box=[1.0, DESK_Y, -1.78], box_size=[0.26, 0.2, 0.18],
            bundles=[[0.0 + 0.17 * c, -1.765 + 0.1 * r] for r in range(2) for c in range(5)], bundle=[0.16, 0.07, 0.022], stack=2,
            keeper=4)                                    # the stack that ends in the box (col 4, row 0)
MON = ROOM["monitor"]
TITLE_PT = [MON[0] - 0.02, MON[1] + 0.02, MON[2] + 0.02]      # the listing title line on the screen
PRICE_PT = [MON[0] + 0.12, MON[1] - 0.04, MON[2] + 0.02]
WARD = dict(bed=[-1.0, 1.0, -2.4, -1.45], mattress=0.55, avery=[0.0, -1.32], chair=1.05, stool=[0.35, -0.45], phone=[0.35, 0.86, -0.45],
            iv=[-1.3, -1.7], cabinet=[1.35, -2.1], cab_top=0.62, card_cab=[1.3, 0.62, -2.08], calendar=[1.15, 1.55, -2.47],
            bin=[0.62, -1.05], window=[2.5, -0.8])
HOME = dict(table=[0.0, -1.0], table_size=[1.3, 0.8], table_y=0.75, mum=[-0.35, -1.62], dad=[0.35, -1.66], dad_win=[0.35, -2.05],
            chair_av=[0.95, -1.0], candle=[0.6, 0.75, -0.85], window=[0.35, 1.55, -2.45], window_w=1.0, shelf=[-1.45, 1.22, -2.33],
            phone=[-0.35, 0.95, -1.3])
STUDIO = dict(board=[0.0, 1.1, -1.5], board_size=[0.7, 0.5], tilt=0.55, painting=[0.0, 1.11, -1.49], artist=[-0.36, -1.18],
              window=[0.7, 1.5, -2.45], pinboard=[-1.3, 1.5, -2.45], lifted=[-0.05, 1.42, -1.05])
CAM_SCREEN = dict(pos=[0.16, 1.18, -1.25], look=[0.35, 1.07, -2.2])      # behind the seller's right shoulder: the screen seen from his side
CAM_DESK_HI = dict(pos=[2.1, 1.6, -1.25], look=[0.5, 0.85, -1.75])     # the locked frame on the bundles (S07)
CAM_WARD = dict(pos=[0.5, 1.35, 1.9], look=[0.4, 0.95, -1.6])             # the locked hospital-room frame (S03, S05)
CAM_HOME = dict(pos=[0.2, 1.45, 1.7], look=[0.15, 1.15, -1.5])

P = {
 "fps": 30, "frames": 2250, "voice_end": 2221,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 92, "out": 150, "text": "$20,000", "style": 3, "from": "top"},
  {"f": 236, "out": 300, "text": "AVERY GARCIA · 12", "style": 3, "from": "top"},
  {"f": 330, "out": 376, "text": "AVERY THE POKE KID", "style": 3, "from": "top"},
  {"f": 668, "out": 740, "text": "18 · 09 · 2026", "style": 3, "from": "top"},
  {"f": 886, "out": 926, "text": "90%", "style": 3, "from": "top"},
  {"f": 982, "out": 1030, "text": "10%", "style": 3, "from": "top"},
  {"f": 1940, "out": 2000, "text": "AKIRA EGAWA", "style": 3, "from": "top"}],
 "cards": {"jirachi_sir": "30th Celebration 155/128 Jirachi ex SIR, illus. Akira Egawa (pokellector scan): the hero card everywhere",
           "pack": ["c30_vulpix", "c30_tropius", "c30_cherubi", "c30_volbeat"]},
 "room": ROOM, "ward": WARD, "home": HOME, "studio": STUDIO,
 "sets": {
  "room": {"origin": [0, 0, 0], "axes": "the desk against the back wall z -2.4 faces +z; the seller sits in front of it facing +z (the room)",
   "light": "golden", "sun": [40, 35], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: bedroom shell x -2.4..2.4, z -2.4..2.4, 2.6 m, grey-blue walls, wood floor, ceiling (no shadows), window with blinds in the -x wall", "pos": [0, 1.3, 0], "size": [4.8, 2.6, 4.8]},
    {"id": "desk", "build": "new: black desk top y 0.76 on two leg panels, x -1.0..1.2, z -2.35..-1.6", "pos": [0.1, 0.38, -1.975], "size": [2.2, 0.76, 0.75]},
    {"id": "stand", "build": "new: small black photo easel (two legs, ledge) holding the Jirachi in a clear top loader (7.6 x 10.2 cm, card 6.3 x 8.8)", "pos": ROOM["stand"], "size": [0.1, 0.12, 0.06]},
    {"id": "ring", "build": "new: ring light (white torus r 0.15, emissive) on a thin stand, aimed at the card", "pos": ROOM["ring"], "size": [0.3, 0.3, 0.03]},
    {"id": "monitor", "build": "new: monitor 64 x 38 cm screen (canvas: the listing page), black bezel, stand on the desk, turned 13 deg toward the seller", "pos": MON, "size": [0.68, 0.42, 0.04]},
    {"id": "keyboard", "build": "new: keyboard 42 x 14 cm, mouse", "pos": ROOM["keyboard"], "size": [0.42, 0.02, 0.14]},
    {"id": "bundles", "build": "new: 10 stacks of 2 cash bundles (each 16 x 7 x 2.2 cm, green notes, paper band) = 20 x $1,000", "pos": [0.34, 0.8, -1.715], "size": [0.84, 0.045, 0.17]},
    {"id": "donation_box", "build": "new: open cardboard donation box 26 x 20 x 18 cm, printed label KIDS CANCER FUND", "pos": ROOM["box"], "size": ROOM["box_size"]},
    {"id": "shelves", "build": "new: wall shelves (x 1.6..2.3) of sealed booster boxes and top loaders: the seller's stock", "pos": [1.95, 1.4, -2.2], "size": [0.7, 1.6, 0.35]}],
   "marks": {"seller": ROOM["seller"]}},
  "ward": {"origin": [40, 0, 0], "axes": "the bed along the back wall z -2.4; Avery sits on its front edge facing +z; his phone on a tripod on a stool in front of him",
   "light": "day", "sun": [-50, 30], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: hospital room x -2.5..2.5, z -2.5..2.5, 2.7 m, pale green walls with a handrail, speckled vinyl floor, ceiling with light panels, window in the +x wall", "pos": [0, 1.35, 0], "size": [5, 2.7, 5]},
    {"id": "bed", "build": "new: hospital bed x -1.0..1.0, z -2.4..-1.45: steel frame, white mattress top y 0.55, blue blanket, pillow at -x, head rail", "pos": [0, 0.3, -1.925], "size": [2.0, 0.6, 0.95]},
    {"id": "stool", "build": "new: round stool top y 0.62 holding a mini tripod and Avery's phone (back to us, screen and camera toward him)", "pos": [0.35, 0.31, -0.45], "size": [0.3, 0.62, 0.3]},
    {"id": "iv", "build": "new: IV pole 1.9 m, five-foot base, a fluid bag", "pos": [-1.3, 0.95, -1.7], "size": [0.4, 1.9, 0.4]},
    {"id": "cabinet", "build": "new: bedside cabinet 45 x 60 x 40 cm: a stack of packs, a binder, later the Jirachi in its top loader", "pos": [1.35, 0.31, -2.1], "size": [0.45, 0.62, 0.4]},
    {"id": "calendar", "build": "new: wall calendar 30 x 42 cm, flips THANG 4 -> 6 -> 8, then 18 / THANG 9", "pos": WARD["calendar"], "size": [0.3, 0.42, 0.01]},
    {"id": "bin", "build": "new: white waste bin r 13 cm, 30 cm: torn wrappers fill it", "pos": [0.62, 0.15, -1.05], "size": [0.26, 0.3, 0.26]}],
   "marks": {"avery": WARD["avery"]}},
  "home": {"origin": [80, 0, 0], "axes": "the table in the middle; the parents sit behind it facing +z; window on the back wall behind the father",
   "light": "golden", "sun": [30, 25], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: kitchen-dining room x -2.5..2.5, z -2.5..2.5, 2.6 m, warm cream walls, wood floor, ceiling, window (1.0 x 1.1 m) with two curtains that slide shut", "pos": [0, 1.3, 0], "size": [5, 2.6, 5]},
    {"id": "table", "build": "new: wooden table 130 x 80 cm, top y 0.75; four chairs; a memorial candle in a glass", "pos": [0, 0.375, -1.0], "size": [1.3, 0.75, 0.8]},
    {"id": "chair_av", "build": "new: Avery's chair at the right end, his blue beanie folded on the seat", "pos": [0.95, 0.45, -1.0], "size": [0.42, 0.9, 0.42]},
    {"id": "shelf", "build": "new: wall shelf 80 cm: framed photo of Avery grinning with a card (drawn), his red binder, his phone mini tripod", "pos": HOME["shelf"], "size": [0.8, 0.3, 0.25]},
    {"id": "phone", "build": "new: mum's phone 7.5 x 15.5 cm (canvas screen: a plain post), seen only from her side", "pos": HOME["phone"], "size": [0.075, 0.155, 0.01]}],
   "marks": {"mum": HOME["mum"], "dad": HOME["dad"], "dad_win": HOME["dad_win"]}},
  "studio": {"origin": [120, 0, 0], "axes": "the drawing table faces +z under the back-wall window; the artist stands at its left",
   "light": "day", "sun": [-30, 40], "open_sides": "+z",
   "objects": [
    {"id": "room", "build": "new: studio x -2.5..2.5, z -2.5..2.5, 2.7 m, white walls, pale wood floor, ceiling, window with plants, pinboard of sketches", "pos": [0, 1.35, 0], "size": [5, 2.7, 5]},
    {"id": "board", "build": "new: drawing table, the board tilted 32 deg, 70 x 50 cm; the painting on it is the REAL Jirachi art (scan, 32 x 45 cm); brush jar, palette", "pos": STUDIO["board"], "size": [0.7, 0.05, 0.5]}],
   "marks": {"artist": STUDIO["artist"]}}},
 "cast": {
  "seller": {"look": ["grey hoodie", "black cap", "dark trousers"], "items": ["the top-loaded Jirachi"], "views": ["front, seated"]},
  "avery": {"look": ["kid build", "light-blue hospital gown", "blue beanie"], "items": ["booster packs", "the Jirachi"], "views": ["front, seated on the bed edge"]},
  "mum": {"look": ["maroon cardigan", "dark hair"], "items": ["phone"], "views": ["front, seated"]},
  "dad": {"look": ["green sweater", "short dark hair", "glasses"], "items": [], "views": ["front, seated / standing"]},
  "artist": {"look": ["white smock", "black bob", "round glasses"], "items": ["brush", "the painting"], "views": ["front, standing"]}},
 "scenes": []}

S = P["scenes"]
def scene(**kw): S.append(kw)
R0, W0, H0, A0 = ROOM, WARD, HOME, STUDIO
SELLER_HEAD = [R0["seller"][0], 1.35, R0["seller"][1]]
AVERY_HEAD = [W0["avery"][0], 1.18, W0["avery"][1]]
CARD = R0["card"]

scene(id="S01", hero=True, f=[0, 206], set="room", light="golden",
  vo="Một người bán trên eBay rao một lá Jirachi giá hai mươi nghìn đô la, và gắn nó với tên một cậu bé vừa qua đời.",
  gloss="A seller on eBay lists a Jirachi for twenty thousand dollars, and ties it to the name of a boy who just died.",
  spine=1, viewer="A seller puts a huge price on a card, and a dead boy's name on the listing.",
  **{"in": {"type": "open on the act"}, "out": {"type": "dissolve", "to": "S02", "n": 8, "note": "push into the title line on the monitor, through-object dissolve into the hospital room"}},
  build="new: the seller's room, desk, photo easel, ring light, monitor with the listing page, keyboard, bundles, donation box.",
  blocking="Seller seated on a stool at his mark facing +z, the top-loaded Jirachi raised in his right hand (screen left) from f0.",
  action="f0-24 hand up with the card (wind-up, held f20-28); f29 slap: the top loader lands on the easel ledge 1 f before 'rao' (f31); the ring light rocks 3 deg on its stand (damped, 20 f); two torn wrappers on the desk edge flutter off and settle on the floor by f60. f60-100 glide to the monitor; f91-113 the price field counts $0 -> $20,000 on 'hai mươi nghìn đô la'; f134-199 the title types JIRACHI SIR · AVERY THE POKE KID letter by letter, the name landing on 'tên một cậu bé' (f155-172).",
  acting="Seller smug grin on the slap; satisfied while typing (seen only through the screen).",
  cams=[k(0, [-1.35, 1.3, -0.15], [-0.32, 1.0, -1.7], 44, push=0.002, blur=6, focus=CARD, why="the slap: card and seller"),
        k(60, CAM_SCREEN["pos"], CAM_SCREEN["look"], 36, glide=40, push=0.0015, blur=8, focus=PRICE_PT, why="to the listing as the price counts"),
        k(150, [0.28, 1.1, -1.72], [TITLE_PT[0], TITLE_PT[1], TITLE_PT[2]], 30, glide=46, push=0.004, blur=8, focus=TITLE_PT, why="push on the name being typed")],
  kicks=[[29, 0.8]], marks=[{"who": "seller", "at": R0["seller"], "view": "front", "pose": "seated, right arm slaps the card onto the easel f29", "expr": "grin"}],
  subjects=[{"n": "seller head", "p": SELLER_HEAD, "f": [0, 40]}, {"n": "card", "p": CARD, "f": [0, 40]},
            {"n": "price", "p": PRICE_PT, "f": [95, 140]}, {"n": "title", "p": TITLE_PT, "f": [170, 205]}],
  physics="Slap: the top loader drops 3 cm onto the ledge in 2 f and stops dead. Ring light: rocks 3 deg, damped spring 20 f. Two wrappers (paper, 4 g): flutter down 0.76 m in about 28 f with side drift, rest flat on the floor and stay.",
  light_mood="golden: warm desk lamp evening, the monitor glow and the ring light are emissive.",
  sound="hand whoosh f24; plastic slap f29; wrapper rustle f30-55; price ticks f91-113; key clicks f134-199; a low piano note under the name f160.",
  after="The card stays on the easel; the wrappers stay on the floor; the listing stays on the screen.")

scene(id="S02", f=[206, 384], set="ward", light="day",
  vo="Cậu bé đó là Avery Garcia, mười hai tuổi, cộng đồng gọi là Avery the Poke Kid.",
  gloss="That boy is Avery Garcia, twelve years old, the community calls him Avery the Poke Kid.",
  spine=2, viewer="Meet Avery: a cheerful kid filming himself in a hospital room.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S01"}, "out": {"type": "glide", "to": "S03"}},
  build="new: the hospital room (bed, IV pole, cabinet, stool with the phone on a tripod, calendar, bin, window).",
  blocking="Avery sits on the bed's front edge at his mark facing his phone (+z). A stack of three packs beside him on the blanket.",
  action="f212-240 he waves to his phone camera (wave cycle, 2 waves); f250 he picks up a pack and shows it to the phone (held at chest, f262-370).",
  acting="Big open smile; a blink on each change.",
  cams=[k(206, [0.4, 1.12, 1.25], [0.1, 0.95, -1.4], 40, push=0.0015, blur=6, focus=AVERY_HEAD, why="the boy in his room"),
        k(250, [0.12, 1.02, 0.25], [0.0, 0.98, -1.32], 34, glide=70, push=0.002, blur=10, focus=AVERY_HEAD, why="closer for his name")],
  kicks=[], marks=[{"who": "avery", "at": W0["avery"], "view": "front", "pose": "seated on the bed edge; waves f212-240, holds up a pack f262-370", "expr": "smile_closed -> grin"}],
  subjects=[{"n": "avery head", "p": AVERY_HEAD, "f": [206, 383]}],
  physics="none.", light_mood="soft day light from the window (+x), cool white ceiling panels.",
  sound="room tone, a monitor's soft beep every 2 s, a gentle piano phrase begins.",
  after="Avery holds the pack.")

scene(id="S03", f=[384, 493], set="ward", light="day",
  vo="Avery quay video bóc thẻ Pokémon trong suốt hành trình chữa bệnh.",
  gloss="Avery filmed pack-opening videos throughout his treatment.",
  spine=2, viewer="He did this again and again, month after month.",
  **{"in": {"type": "glide", "from": "S02"}, "out": {"type": "glide", "to": "S04"}},
  build="reuse the hospital room; the calendar flips; the bin fills.",
  blocking="Avery at his mark. Locked frame.",
  action="Three openings: tears at f414, f440, f468; each wrapper tossed toward the bin (arc 12 f) and it drops in; the calendar page flips on each tear (THANG 4 -> 6 -> 8); the bin's pile rises.",
  acting="Excited each time.",
  cams=[k(384, CAM_WARD["pos"], CAM_WARD["look"], 46, glide=36, push=0.0008, blur=3, focus=[0.3, 1.0, -1.5], why="locked frame: same room, months pass")],
  kicks=[], marks=[{"who": "avery", "at": W0["avery"], "view": "front", "pose": "tear, toss, tear, toss", "expr": "grin"}],
  subjects=[{"n": "avery head", "p": AVERY_HEAD, "f": [420, 492]}, {"n": "calendar", "p": W0["calendar"], "f": [420, 492]}, {"n": "bin", "p": [0.62, 0.3, -1.05], "f": [420, 492]}],
  physics="wrappers: thrown arcs into the bin, they stay there.", light_mood="day.",
  sound="three paper tears f414, f440, f468; calendar flaps; piano continues.", after="Three wrappers in the bin; calendar on THANG 8.")

scene(id="S04", hero=True, f=[493, 657], set="ward", light="day",
  vo="Trong video cuối cùng, Avery bóc được một lá Jirachi minh họa hiếm từ bộ kỷ niệm ba mươi năm.",
  gloss="In his final video, Avery pulled a rare illustration Jirachi from the 30th anniversary set.",
  spine=2, viewer="The Jirachi: his last pull, his joy.",
  **{"in": {"type": "glide", "from": "S03"}, "out": {"type": "dissolve", "to": "S05", "n": 10}},
  build="new: 30th Celebration pack (foil, '30' lettering, no logo) with a tear strip; five cards: four commons, the Jirachi SIR last.",
  blocking="Avery at his mark, the pack in both hands at chest height.",
  action="f530-546 he pinches the top; f548 tear on 'bóc': the strip flies off and lands on the blanket; f552-566 he slides the cards out and flips through the commons (one every 4 f); f569-575 the Jirachi comes up on 'Jirachi' (f571): a holo gleam sweeps it f578-592; f575-595 his jaw drops (gape 0.7) then a huge grin; f600-620 he raises it toward his phone and holds it there.",
  acting="Concentration, then disbelief, then pure joy.",
  cams=[k(493, [0.3, 1.05, -0.25], [0.02, 1.0, -1.3], 34, glide=40, push=0.002, blur=10, focus=AVERY_HEAD, why="close, from beside his phone"),
        k(566, [0.25, 1.04, -0.55], [0.02, 1.02, -1.3], 30, glide=20, push=0.002, punch=[0.006, 20], blur=12, focus=[0.02, 1.0, -1.25], why="push on the pull"),
        k(600, [0.28, 1.06, -0.62], [0.03, 1.1, -1.28], 30, glide=24, push=0.0015, blur=12, focus=[0.03, 1.12, -1.22], why="the card held up to the phone")],
  kicks=[], marks=[{"who": "avery", "at": W0["avery"], "view": "front", "pose": "tears the pack f548, Jirachi out f571, holds it up f600", "expr": "neutral -> shock (gape) -> grin"}],
  subjects=[{"n": "avery head", "p": AVERY_HEAD, "f": [493, 656]}, {"n": "card", "p": [0.03, 1.08, -1.22], "f": [575, 656]}],
  physics="tear strip: flies 20 cm, lands on the blanket and stays; empty wrapper dropped on the blanket f566 and stays.",
  light_mood="day; the card's gleam is the only sparkle (never over the art: it sweeps as a band across the foil).",
  sound="foil crinkle f530; tear f548; card slides f552-566; a soft rising shimmer f571; a held warm chord.", after="Avery holds the Jirachi up to his phone.")

scene(id="S05", f=[657, 764], set="ward", light="day", dim=0.62,
  vo="Ngày mười tám tháng chín, Avery qua đời vì ung thư tuyến tụy.",
  gloss="On September 18, Avery died of pancreatic cancer.",
  spine=3, viewer="The same room, empty; he is gone.",
  **{"in": {"type": "dissolve", "n": 10, "from": "S04"}, "out": {"type": "dissolve", "to": "S06", "n": 8}},
  build="reuse the hospital room: the bed made and empty, the blanket folded; the phone dark on its tripod; the Jirachi in its top loader standing on the cabinet; the calendar on 18 / THANG 9; the IV pole bare.",
  blocking="No one. Locked frame, then a slow glide to the cabinet.",
  action="Stillness. f700-764 slow glide toward the cabinet: the Jirachi in its top loader and the calendar above it.",
  acting="none.",
  cams=[k(657, CAM_WARD["pos"], CAM_WARD["look"], 46, push=0.0006, blur=3, focus=[0.3, 1.0, -1.5], why="same frame, empty"),
        k(700, [0.95, 1.2, -0.2], [1.25, 0.92, -2.1], 38, glide=64, push=0.0012, blur=8, focus=W0["card_cab"], why="to his card on the cabinet")],
  kicks=[], marks=[],
  subjects=[{"n": "card on cabinet", "p": [1.3, 0.69, -2.08], "f": [740, 763]}, {"n": "calendar", "p": W0["calendar"], "f": [657, 690]}],
  physics="none.", light_mood="the same day light, dimmed and cooler (grey): the light law of grief.",
  sound="room tone only; the monitor beep is gone; one low piano note f700.", after="The card waits on the cabinet.")

scene(id="S06", f=[764, 844], set="room", light="golden",
  vo="Chỉ trong tuần sau đó, các tin rao bắt đầu xuất hiện.",
  gloss="Within the following week, the listings started appearing.",
  spine=3, viewer="Listings multiply.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S05"}, "out": {"type": "glide", "to": "S07"}},
  build="reuse the room; the monitor page becomes a grid of 12 listing tiles (the Jirachi photo, a price, the name in the title).",
  blocking="Seller off frame left (POV over his shoulder).",
  action="f800-844 tiles pop in one by one (every 3-4 f), each with the same Jirachi photo, prices $4,999 to $20,000.",
  acting="none.",
  cams=[k(764, CAM_SCREEN["pos"], CAM_SCREEN["look"], 38, push=0.0025, blur=8, focus=MON, why="the screen fills")],
  kicks=[], marks=[], subjects=[{"n": "monitor", "p": MON, "f": [764, 843]}],
  physics="none.", light_mood="golden evening, monitor glow.", sound="notification pings on each tile f800-844.", after="The grid is full.")

B = R0["bundles"]
scene(id="S07", hero=True, f=[844, 1045], set="room", light="golden",
  vo="Một gian hàng hứa quyên chín mươi phần trăm cho từ thiện, nhưng tin rao ban đầu chỉ ghi mười phần trăm cho một quỹ ung thư trẻ em.",
  gloss="One shop promised to donate 90% to charity, but the original listing only said 10% for a children's cancer fund.",
  spine=4, viewer="Promise 90, give 10: the money slides back to the seller.",
  **{"in": {"type": "glide", "from": "S06"}, "out": {"type": "glide", "to": "S08"}},
  build="reuse the bundles and the donation box; the monitor shows a banner 90% TO CHARITY, then the small print '10% to a kids cancer fund'.",
  blocking="Seller seated at his mark, bottom-left of frame.",
  action="f870-886 the monitor banner 90% TO CHARITY lights up; f886-910 all 10 stacks slide 0.06 m toward the donation box on 'chín mươi' (f889); f929-952 nine stacks slide back 0.34 m toward the seller on 'nhưng' (f929), decelerating with friction, the last two bump; f970 the banner shrinks to the small print; f980-992 the one stack left by the box tips over its rim and drops in on 'mười' (f984). The seller's grin.",
  acting="Seller pleased; eyes follow the money back to himself.",
  cams=[k(844, CAM_SCREEN["pos"], CAM_SCREEN["look"], 38, push=0.0015, blur=6, focus=MON, why="the banner"),
        k(858, CAM_DESK_HI["pos"], CAM_DESK_HI["look"], 44, glide=40, push=0.0012, blur=4, focus=[0.5, 0.8, -1.75], why="locked frame on the money")],
  kicks=[[984, 0.4]], marks=[{"who": "seller", "at": R0["seller"], "view": "front", "pose": "seated, watching the money", "expr": "grin"}],
  subjects=[{"n": "bundles", "p": [0.34, 0.8, -1.715], "f": [880, 1040]}, {"n": "box", "p": [1.0, 0.86, -1.78], "f": [880, 1040]}],
  physics="Bundles: kinematic slides, ease-out with friction (0.8 m/s start, 4 m/s^2 decel); the keeper stack hops 0.26 m in x over the 0.2 m rim (ballistic, 12 f), lands in the box with a 1 cm bounce.",
  light_mood="golden; the monitor glow.", sound="paper slides f886, f929; soft thud of bundles bumping f948; the drop into cardboard f990.",
  after="Nine stacks sit in front of the seller; one stack is in the box.")

scene(id="S08", f=[1045, 1170], set="room", light="golden",
  vo="Trong khi những lá Jirachi cùng loại chỉ bán vài chục đến vài trăm đô.",
  gloss="Meanwhile the same Jirachi cards only sell for tens to a few hundred dollars.",
  spine=4, viewer="The real price is $65-$240.",
  **{"in": {"type": "glide", "from": "S07"}, "out": {"type": "cut", "to": "S09"}},
  build="reuse the monitor: a SOLD page: three sold tiles of the same card ($65, $125, $240) and the seller's $20,000 tile.",
  blocking="POV over the seller's shoulder.",
  action="f1058 the page switches to SOLD; f1120 the $65 tile lights on 'vài chục'; f1143 the $240 tile lights on 'vài trăm'; f1156 the $20,000 tile pulses red.",
  acting="none.",
  cams=[k(1045, CAM_SCREEN["pos"], CAM_SCREEN["look"], 36, glide=30, push=0.002, blur=8, focus=MON, why="the sold prices")],
  kicks=[], marks=[], subjects=[{"n": "monitor", "p": MON, "f": [1075, 1169]}],
  physics="none.", light_mood="golden.", sound="mouse click f1058; two soft ticks f1120, f1143.", after="Sold page up.")

scene(id="S09", f=[1170, 1312], set="room", light="golden",
  vo="Khoan đã, họ đang bán một lá bài, hay đang bán nỗi đau của một gia đình?",
  gloss="Wait, are they selling a card, or selling a family's grief?",
  spine=4, viewer="The card, then the boy's name on the listing.",
  **{"in": {"type": "cut", "from": "S08"}, "out": {"type": "dissolve", "to": "S10", "n": 8}},
  build="reuse the card on the easel under the ring light; the monitor's listing title AVERY THE POKE KID behind.",
  blocking="Seller out of frame (right).",
  action="Hard cut on 'Khoan đã' (f1170). The card sharp in the ring light; f1262-1282 rack focus to the monitor title (AVERY THE POKE KID) on 'nỗi đau' (f1276); the card goes soft.",
  acting="none.",
  cams=[k(1170, [-1.4, 1.05, -0.45], [-0.25, 0.95, -1.95], 34, cut=True, push=0.0018, blur=14, focus=CARD, why="the card"),
        k(1262, [-1.4, 1.05, -0.45], [-0.25, 0.95, -1.95], 34, glide=20, push=0.0018, blur=14, focus=TITLE_PT, why="rack focus to the name")],
  kicks=[], marks=[], subjects=[{"n": "card", "p": CARD, "f": [1170, 1311]}, {"n": "title", "p": TITLE_PT, "f": [1170, 1311]}],
  physics="none.", light_mood="golden; the ring light makes a white catchlight on the top loader.",
  sound="music drops out on the cut; a single low cello note f1276.", after="as before.")

scene(id="S10", f=[1312, 1386], set="home", light="golden",
  vo="Bố mẹ Avery lên tiếng trên Instagram.",
  gloss="Avery's parents spoke up on Instagram.",
  spine=5, viewer="The parents, at home, beside his empty chair.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S09"}, "out": {"type": "dissolve", "to": "S11", "n": 6, "note": "through the phone: into her screen"}},
  build="new: the family room: table, candle, Avery's empty chair with his beanie, shelf, window with curtains.",
  blocking="Mum seated at her mark holding her phone; dad seated at his mark, his left arm resting on her shoulder.",
  action="f1320-1386 mum types; slow push in on the two of them.",
  acting="Both sad (pained), quiet.",
  cams=[k(1312, CAM_HOME["pos"], CAM_HOME["look"], 42, push=0.0025, blur=5, focus=[0.0, 1.15, -1.6], why="the family room")],
  kicks=[], marks=[{"who": "mum", "at": H0["mum"], "view": "front", "pose": "seated, phone in both hands", "expr": "pained"},
                   {"who": "dad", "at": H0["dad"], "view": "front", "pose": "seated, arm on her shoulder", "expr": "pained"}],
  subjects=[{"n": "mum head", "p": [H0["mum"][0], 1.32, H0["mum"][1]], "f": [1312, 1385]}, {"n": "dad head", "p": [H0["dad"][0], 1.32, H0["dad"][1]], "f": [1312, 1385]}],
  physics="none; the candle flame flickers.", light_mood="golden dusk, low and warm; candle glow.",
  sound="room tone, a clock ticking; strings, very soft.", after="Mum holds her phone.")

scene(id="S11", f=[1386, 1610], set="home", light="golden",
  vo="Gia đình không liên quan, cũng không nhận được gì từ bất kỳ lá bài nào bán dưới tên hay hình ảnh của Avery. Họ xin người bán gỡ tin xuống.",
  gloss="The family is not involved and receives nothing from any card sold under Avery's name or image. They asked sellers to take the listings down.",
  spine=5, viewer="Her post, in plain words; she posts it.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S10"}, "out": {"type": "dissolve", "to": "S12", "n": 6}},
  build="reuse mum's phone: a plain post (no logo): a small avatar, lines that appear as she types: 'We are not involved.' / 'We receive nothing.' / 'Please take these listings down.', a POST button.",
  blocking="Her POV (mum not drawn); her finger (a plain stick line from below frame) taps POST.",
  action="f1400-1450 line 1 types; f1455-1530 line 2; f1556-1580 line 3 on 'gỡ tin'; f1585 her stick finger taps POST on 'gỡ' (contact 1 f before); the button darkens, the post goes up (a soft slide).",
  acting="none.",
  cams=[k(1386, [-0.35, 1.29, -1.62], [-0.35, 0.95, -1.3], 30, push=0.0015, blur=6, focus=H0["phone"], why="her screen, from her eyes")],
  kicks=[], marks=[], subjects=[{"n": "phone", "p": H0["phone"], "f": [1386, 1609]}],
  physics="none.", light_mood="the screen glow on a golden dusk.", sound="soft key taps; the post 'whoosh' f1586.", after="The post is up.")

scene(id="S12", f=[1610, 1720], set="home", light="golden",
  vo="Họ viết, điều này không tôn vinh trái tim hào phóng của Avery.",
  gloss="They wrote, this does not honor Avery's generous heart.",
  spine=5, viewer="His things: who he was.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S11"}, "out": {"type": "glide", "to": "S13"}},
  build="reuse the shelf: the framed photo (drawn: Avery grinning, holding a card up), his red binder, his mini tripod.",
  blocking="Parents off frame.",
  action="f1610-1720 slow glide along the shelf to the photo; it ends on his grin on 'Avery' (f1703).",
  acting="none.",
  cams=[k(1610, [-0.75, 1.38, -0.5], [-1.5, 1.3, -2.3], 38, push=0.0015, blur=8, focus=H0["shelf"], why="his shelf"),
        k(1650, [-1.05, 1.36, -1.25], [-1.62, 1.36, -2.3], 32, glide=60, push=0.002, blur=10, focus=[-1.62, 1.36, -2.3], why="to his photo")],
  kicks=[], marks=[], subjects=[{"n": "photo", "p": [-1.62, 1.36, -2.3], "f": [1610, 1719]}],
  physics="none.", light_mood="golden dusk; the frame's glass catches the window light.", sound="strings continue, a gentle rise.", after="as before.")

scene(id="S13", f=[1720, 1810], set="home", light="golden", dim_ramp=[1730, 1790, 0.55],
  vo="Họ đang để tang con trai, và chỉ xin được yên.",
  gloss="They are mourning their son, and only ask to be left in peace.",
  spine=5, viewer="They close the world out.",
  **{"in": {"type": "glide", "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 8}},
  build="reuse the family room; the curtains slide shut; the candle's glow grows as the room dims.",
  blocking="Dad stands (f1728-1738), steps back to the window (dad_win, f1738-1752), turns front, draws both curtains closed (f1758-1790). Mum lays the phone face down on the table on 'yên' (f1796).",
  action="as blocking; the room light drops to 55 % as the curtains close; the candle glow is the brightest thing.",
  acting="Quiet, slow; dad's eyes down.",
  cams=[k(1720, [0.15, 1.5, 1.2], [0.05, 1.2, -1.7], 46, glide=40, push=0.0015, blur=5, focus=[0.1, 1.2, -1.8], why="the family, the window")],
  kicks=[], marks=[{"who": "dad", "at": H0["dad_win"], "view": "front", "pose": "stands, steps back, draws the curtains", "expr": "pained"},
                   {"who": "mum", "at": H0["mum"], "view": "front", "pose": "lays the phone face down f1796", "expr": "pained"}],
  subjects=[{"n": "mum head", "p": [H0["mum"][0], 1.32, H0["mum"][1]], "f": [1760, 1809]}, {"n": "dad head", "p": [H0["dad_win"][0], 1.65, H0["dad_win"][1]], "f": [1760, 1809]}],
  physics="curtains: slide with ease-in-out, sway 2 cm and settle.", light_mood="golden dims to 55 %; candle.",
  sound="curtain rings f1758-1790; the phone set down f1796; the music holds one chord.", after="Curtains closed, phone face down.")

scene(id="S14", f=[1810, 1888], set="room", light="golden",
  vo="Gian hàng kia sau đó gỡ các tin rao từ thiện.",
  gloss="That shop then took the charity listings down.",
  spine=6, viewer="The listings end; the seller sweats.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S13"}, "out": {"type": "dissolve", "to": "S15", "n": 8}},
  build="reuse the monitor grid: tiles grey out with ENDED one by one.",
  blocking="Seller at his mark (seen from the front at the end).",
  action="f1846-1880 tiles grey out ENDED one per 3 f, starting on 'gỡ' (f1850); f1856-1882 glide to the seller: his grin goes nervous, a sweat drop.",
  acting="smug -> nervous.",
  cams=[k(1810, CAM_SCREEN["pos"], CAM_SCREEN["look"], 38, push=0.002, blur=8, focus=MON, why="the listings end"),
        k(1846, [0.45, 1.25, -0.45], [-0.12, 1.22, -1.45], 36, glide=40, push=0.002, blur=10, focus=SELLER_HEAD, why="the seller")],
  kicks=[], marks=[{"who": "seller", "at": R0["seller"], "view": "front", "pose": "seated", "expr": "nervous"}],
  subjects=[{"n": "monitor", "p": MON, "f": [1810, 1850]}, {"n": "seller head", "p": SELLER_HEAD, "f": [1878, 1887]}],
  physics="none.", light_mood="golden.", sound="error blips per tile f1846-1880.", after="ENDED tiles.")

scene(id="S15", f=[1888, 2087], set="studio", light="day",
  vo="Còn họa sĩ vẽ lá Jirachi, Akira Egawa, chỉ nói rằng mình muốn tranh vẽ mang lại hạnh phúc cho mọi người.",
  gloss="And the artist who drew the Jirachi, Akira Egawa, only said she wants her art to bring happiness to people.",
  spine=6, viewer="The art was made to make people happy.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S14"}, "out": {"type": "dissolve", "to": "S16", "n": 8, "note": "push into the painting, match on the same art in the listing photo"}},
  build="new: the studio; the REAL Jirachi art on the tilted board; brush, jar, palette, plants in the window light.",
  blocking="Artist stands at her mark, brush in her right hand (screen left) touching the painting's left edge.",
  action="f1900-2030 small brush strokes (the hand moves along the edge, 3 strokes); f2036-2060 she lifts the painting off the board up beside her into the window light on 'hạnh phúc' (f2053) and smiles at it.",
  acting="Calm focus, then a gentle smile.",
  cams=[k(1888, [0.95, 1.45, 0.6], [-0.2, 1.25, -1.4], 40, push=0.0015, blur=6, focus=A0["painting"], why="the artist and the painting"),
        k(2030, [0.15, 1.45, 0.05], [-0.06, 1.42, -1.05], 34, glide=28, push=0.002, blur=8, focus=A0["lifted"], why="the painting in the light"),
        k(2062, [-0.05, 1.43, -0.5], [-0.05, 1.42, -1.05], 26, glide=24, push=0.006, blur=6, focus=A0["lifted"], why="push into the art")],
  kicks=[], marks=[{"who": "artist", "at": A0["artist"], "view": "front", "pose": "painting, then lifts the painting f2036-2060", "expr": "neutral -> smile"}],
  subjects=[{"n": "artist head", "p": [A0["artist"][0], 1.6, A0["artist"][1]], "f": [1888, 2020]}, {"n": "painting", "p": A0["painting"], "f": [1888, 2020]},
            {"n": "painting lifted", "p": A0["lifted"], "f": [2062, 2086]}],
  physics="none.", light_mood="bright day, sunlight from the window.", sound="brush strokes; a music-box phrase f2053.", after="She holds the painting up.")

scene(id="S16", f=[2087, 2145], set="room", light="golden",
  vo="Người bán đặt giá hai mươi nghìn đô.",
  gloss="The seller set the price at twenty thousand dollars.",
  spine=6, viewer="The same art, with a price.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S15"}, "out": {"type": "dissolve", "to": "S17", "n": 10}},
  build="reuse the listing page (the seller's own listing, $20,000).",
  blocking="POV.",
  action="f2120-2140 the price $20,000 on 'hai mươi nghìn đô' pulses once.",
  acting="none.",
  cams=[k(2087, [0.3, 1.1, -1.72], [0.33, 1.08, -2.2], 30, push=0.003, blur=8, focus=MON, why="the price")],
  kicks=[], marks=[], subjects=[{"n": "monitor", "p": MON, "f": [2087, 2144]}],
  physics="none.", light_mood="golden, cold monitor light.", sound="the monitor hum; music thins to one note.", after="$20,000.")

scene(id="S17", hero=True, f=[2145, 2250], set="ward", light="golden",
  vo="Còn Avery, chỉ cần được mở nó ra.",
  gloss="And Avery only needed to open it.",
  spine=6, viewer="All he wanted was to open it.",
  **{"in": {"type": "dissolve", "n": 10, "from": "S16"}, "out": {"type": "end"}},
  build="reuse the hospital room in golden light (the flashback); a fresh pack.",
  blocking="Avery at his mark, the pack in both hands; seen from his phone's spot.",
  action="f2170-2198 he pinches the top; f2201 tear on 'mở' (f2203); f2208-2216 the Jirachi slides up; f2216 his face lights up (grin), gleam on the card f2220-2234; holds it up toward the lens to the end.",
  acting="Anticipation, then joy.",
  cams=[k(2145, [0.3, 1.0, -0.58], [0.0, 1.0, -1.32], 32, push=0.0018, blur=10, focus=AVERY_HEAD, why="from his phone's spot"),
        k(2205, [0.28, 1.02, -0.66], [0.02, 1.07, -1.3], 30, glide=30, push=0.0012, blur=12, focus=[0.03, 1.12, -1.22], why="his joy, the card")],
  kicks=[], marks=[{"who": "avery", "at": W0["avery"], "view": "front", "pose": "tears f2201, holds the card up", "expr": "smile_closed -> grin"}],
  subjects=[{"n": "avery head", "p": AVERY_HEAD, "f": [2145, 2249]}],
  physics="tear strip lands on the blanket.", light_mood="golden flashback light through the window.",
  sound="foil tear f2201; the warm theme resolves; silence on the last frame.", after="End on his grin and the card.")

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(P, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(S), "scenes")
