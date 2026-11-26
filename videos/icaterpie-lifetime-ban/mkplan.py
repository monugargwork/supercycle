"""Generator of plan.json for the iCaterpie reel. The plan is the source of truth: change it here, then
python3 videos/icaterpie-lifetime-ban/mkplan.py && python3 scripts/plan_check.py videos/icaterpie-lifetime-ban/plan.json"""
import json, os
def k(f, pos, look, fov, glide=None, cut=False, push=0.0006, why=""):
    d = dict(f=f, pos=pos, look=look, fov=fov, roll=0, push=push, blur=0, why=why)  # quality bar: no blur of any kind
    if glide: d["glide"] = glide
    if cut: d["cut"] = True
    return d

# ---------------- layout (set-local metres; the build reads these) ----------------
PIAZZA = dict(
    ground=[-12, 12, -14, 14],
    hall=dict(z=-6.0, x=[-4.6, 4.6], h=7.4, door=[0.5, 2.5], door_h=3.0, box_y=[3.0, 3.38], sign=[1.5, 3.78], sign_size=[3.0, 0.5],
              clock=[1.5, 5.6], clock_r=0.7, turret=[0.6, 2.4, 7.4, 9.6], inside_z=-9.0),
    board=dict(c=[-1.0, -3.0], face=[-1.75, -0.25, 0.6, 2.6], header=[2.62, 2.97], post_top=2.97),
    sheet=[-1.25, 1.22, -2.955], sheet_size=[0.6, 0.8], corner=[-1.25, 1.585, -2.95],
    tpc=[-1.0, 2.17, -2.955], tpc_size=[0.9, 0.58], ann=[-0.55, 1.02, -2.955], ann_size=[0.44, 0.58],
    bin=[-2.15, -2.65], bin_r=0.2, bin_h=0.74,
    tear=[-0.55, -2.68],            # his mark at the board (tears / pins)
    staff=[2.85, -5.45], staff_in=[4.2, -5.0],
    sit=[0.3, -2.55],               # him on his suitcase, the shut door behind (S09, S19)
    sign=[2.65, -1.25],             # the signpost
    cafe=dict(z=-4.0, x=[3.2, 8.2], h=3.6, awning_out=1.5),
    t1=[4.2, -2.45], t2=[5.35, -1.0], t3=[3.15, -0.35], table_y=0.74, table_r=0.38,
    him_t1=[3.78, -2.45], str_t1=[4.62, -2.45],
    scale=[-3.2, 1.0], beam_y=1.5, arm=0.9, pan_drop=0.62,
    houses_front=9.0, houses_left=-6.2, houses_right=8.6)
WORLDS = dict(room=[-6, 6, -6, 6], h=6.0, window=[-5.5, 5.5, 0.6, 5.4], table=[0.0, -1.5], table_len=1.2, table_w=0.7, table_y=0.74,
              him=[-0.82, -1.5], opp=[0.82, -1.5], judge=[0.1, -2.25], back_tables=[[-2.6, -3.6], [2.6, -3.6]])

P = PIAZZA
SY = 0.0
HIM_BOARD = [P["tear"][0], 1.55, P["tear"][1]]
SHUT = [1.5, 1.5, P["hall"]["z"]]
CLOCK = [P["hall"]["clock"][0], P["hall"]["clock"][1], P["hall"]["z"] + 0.06]
STAFF_HEAD = [P["staff"][0], 1.55, P["staff"][1]]
SIGNH = [P["hall"]["sign"][0], P["hall"]["sign"][1], P["hall"]["z"] + 0.05]
HIM_T1 = [P["him_t1"][0], 1.25, P["him_t1"][1]]
CARD = [3.93, 1.42, -2.12]          # the Caterpie card held up toward the lens (S02)
TROPH = [4.3, 0.95, -2.5]
SITH = [P["sit"][0], 1.2, P["sit"][1]]
SC = P["scale"]
NEAR_PAN = [SC[0], 0.9, SC[1] + P["arm"]]; FAR_PAN = [SC[0], 0.9, SC[1] - P["arm"]]
MASTER = dict(pos=[0.4, 3.3, 7.0], look=[0.4, 3.1, -4.0], fov=50)
W = WORLDS
EYE11 = [-1.1, 1.62, -1.25]; PHONE11 = [-1.12, 1.43, -1.62]

PLAN = {
 "fps": 30, "frames": 2360, "voice_end": 2330,
 "coords": "metres, y up, ground y=0; cams/marks/objects are SET-LOCAL, world = set origin + local",
 "titles": [
  {"f": 178, "out": 236, "text": "ALESSANDRO CREMASCOLI", "style": 3, "from": "top"},
  {"f": 600, "out": 636, "text": "SAN FRANCISCO", "style": 3, "from": "top"},
  {"f": 866, "out": 924, "text": "16 · 10", "style": 3, "from": "top"}],
 "cards": {"hero": "caterpie151 (Scarlet & Violet 151 Caterpie 010): his nickname, held up to the lens in S02",
           "table": ["caterpie151", "pika151", "sprigatito", "fuecoco", "quaxly", "pawmi", "zard151", "eevee", "pikachu"]},
 "piazza": PIAZZA, "worlds": WORLDS,
 "sets": {
  "piazza": {"origin": [0, 0, 0], "axes": "the civic hall's façade on z -6 faces +z; the board in front of it, left; the café on the right (front z -4, x 3.2..8.2); +z toward the lens",
   "light": "day", "sun": [-35, 42], "open_sides": "sky",
   "objects": [
    {"id": "ground", "build": "new: warm cobbles x -12..12, z -14..14", "pos": [0, 0, 0], "size": [24, 0, 28]},
    {"id": "hall", "build": "new: civic hall façade 9.2 m wide x 7.4 m: cream stucco, terracotta cornice and pilasters, two upper windows with green shutters and flower boxes; arched door 2 x 3 m with a lit tournament room inside (tables, players, banner); the clock (r 0.7 m) at y 5.6; a bell turret to 9.6 m", "pos": [0, 3.7, -6.0], "size": [9.2, 7.4, 0.4]},
    {"id": "shutter", "build": "new: red rolling shutter in the door (ribbed canvas), rolls into a box above the door; bottom bar with a hasp; a padlock (S08 on) and the hanging sign CẤM VĨNH VIỄN", "pos": SHUT, "size": [2.0, 3.0, 0.05]},
    {"id": "sign", "build": "new: sign above the door POKÉMON · GIẢI ĐẤU CHÍNH THỨC (plain lettering, not a logo)", "pos": SIGNH, "size": [3.0, 0.5, 0.04]},
    {"id": "board", "build": "new: the town notice board 1.5 x 2 m on two oak posts, cork face, header MẠNG XÃ HỘI; dressed with old flyers; the official frame THE POKÉMON COMPANY · THÔNG BÁO CHÍNH THỨC (empty all reel) at the top", "pos": [-1.0, 1.6, -3.0], "size": [1.5, 2.37, 0.1]},
    {"id": "sheet", "build": "new: the post: a sheet 60 x 80 cm (oversized A1) on one pin: a judge doodle in a striped shirt, complaint lines in marker, the name in red under a black censor bar; tears off leaving a corner on the pin", "pos": P["sheet"], "size": [0.6, 0.8, 0.002]},
    {"id": "ann", "build": "new: the announcement 44 x 58 cm (S08 on): TÔI BỊ CẤM VĨNH VIỄN KHỎI MỌI GIẢI ĐẤU CHÍNH THỨC — iCaterpie", "pos": P["ann"], "size": [0.44, 0.58, 0.002]},
    {"id": "bin", "build": "new: green litter bin r 20 cm, 74 cm", "pos": [P["bin"][0], 0.37, P["bin"][1]], "size": [0.4, 0.74, 0.4]},
    {"id": "cafe", "build": "new: one-storey café front x 3.2..8.2 on z -4: terracotta wall, red-and-white striped awning 1.5 m deep, CAFFÈ lettering, window with cakes, door, lemon trees in pots; three round tables with chairs; Italian-flag bunting from the hall to the café", "pos": [5.7, 1.8, -4.0], "size": [5.0, 3.6, 0.3]},
    {"id": "signpost", "build": "new: wooden signpost with arrows STAZIONE, NICE 300 km, ROMA, MILANO", "pos": [P["sign"][0], 1.3, P["sign"][1]], "size": [0.9, 2.6, 0.1]},
    {"id": "scale", "build": "adapt:balance (Mudkip S15): a brass public scale, pivot post 1.5 m at (-3.2, 1.0), beam 1.8 m along z, two pans on chains; iron weights CẤM CẢ ĐỜI and NÊU TÊN TRỌNG TÀI (S14 on)", "pos": [SC[0], 0.8, SC[1]], "size": [0.7, 1.6, 2.2]},
    {"id": "houses", "build": "new: house fronts on the other three sides (ochre, terracotta, pale yellow), green shutters, balconies with flowers, a scooter, a fountain at (-3.8, 3.6), lamp posts; blue sky with inked clouds above the roofs", "pos": [0, 4, 0], "size": [24, 8, 28]}],
   "marks": {"tear": P["tear"], "staff": P["staff"], "sit": P["sit"], "him_t1": P["him_t1"], "str_t1": P["str_t1"]}},
  "worlds": {"origin": [60, 0, 0], "axes": "the window wall (Golden Gate) on z -6; match table A across x at z -1.5; the lens at +z",
   "light": "day", "sun": [25, 45], "open_sides": "window",
   "objects": [
    {"id": "room", "build": "new: convention hall x -6..6, z -6..6, 6 m; warm cream walls, teal carpet, a ceiling with light panels; banners WORLDS 2026 and SAN FRANCISCO", "pos": [0, 3, 0], "size": [12, 6, 12]},
    {"id": "window", "build": "new: glass wall 11 x 4.8 m with mullions; outside: the red Golden Gate Bridge, the blue bay, green hills, a cloudy blue sky (painted panorama behind the glass)", "pos": [0, 3.0, -6.0], "size": [11, 4.8, 0.05]},
    {"id": "tableA", "build": "new: match table 1.2 x 0.7 m, white cloth, two playmats with real cards laid out (his Caterpie line on his side), a table number plate 12", "pos": [0, 0.37, -1.5], "size": [1.2, 0.74, 0.7]},
    {"id": "back", "build": "new: two more match tables with players behind (z -3.6), a spectator rail", "pos": [0, 0.37, -3.6], "size": [7, 0.74, 0.7]}],
   "marks": {"him": W["him"], "opp": W["opp"], "judge": W["judge"]}}},
 "cast": {
  "him": {"look": ["leaf-green jacket (Caterpie green)", "sky-blue jeans", "yellow cap with a red button"], "items": ["the post sheet", "marker", "Caterpie card", "sticker suitcase"], "views": ["front", "front seated", "side walking"]},
  "staff": {"look": ["red polo STAFF", "blue trousers"], "items": ["hook pole", "padlock", "sign"], "views": ["front"]},
  "judge": {"look": ["white shirt with black stripes", "JUDGE on the chest"], "items": [], "views": ["front"]},
  "opp": {"look": ["orange hoodie"], "items": ["cards"], "views": ["front seated"]},
  "friend": {"look": ["sky-blue sweater", "glasses"], "items": ["phone"], "views": ["front", "side walking"]},
  "crowd": {"look": ["coral, mustard, teal, lime, pink, violet-blue outfits"], "items": ["phones"], "views": ["front", "side walking"]},
  "patrons": {"look": ["two café regulars"], "items": [], "views": ["front seated"]}},
 "scenes": []}

S = PLAN["scenes"]
def scene(**kw): S.append(kw)
B = P["board"]

scene(id="S01", hero=True, f=[0, 148], set="piazza", light="day",
  vo="Một người đàn ông xóa bài đăng của mình sau sáu tiếng, và mất luôn hai mươi lăm năm cuộc đời.",
  gloss="A man deletes his post after six hours, and loses twenty-five years of his life.",
  spine=1, viewer="He rips his post off the town board; behind him the tournament hall's shutter slams down.",
  **{"in": {"type": "open on the act"}, "out": {"type": "dissolve", "to": "S02", "n": 8, "note": "back to who he is"}},
  build="new: the piazza: the board with the post sheet, the bin, the civic hall with the open door and the clock; the staff with the hook pole beside the door.",
  blocking="Him at the tear mark (right of the sheet, facing +z); the staff at the staff mark beside the door, hook pole up at the shutter's bottom bar.",
  action="f0-12 he glances at the sheet; f12-17 his left arm (screen left) reaches the sheet's right edge; f17 the rip (2 f before 'xóa' f19): the sheet tears off under the pin, the top corner stays pinned; f18-30 he crumples it into a ball; f32-48 he tosses it left into the bin (arc, lands f48, the bin rocks); f92 the staff hooks the shutter's bar and pulls: the shutter rattles down f100-136 and slams on 'đời' f137 (dust puff at the sill); he turns his head to it, shocked.",
  acting="Him: stern -> shock on the slam. Staff: neutral.",
  cams=[k(0, [-0.45, 1.7, 2.3], [-0.75, 1.25, -3.0], 44, push=0.0007, why="him tearing the post off the board"),
        k(80, [0.9, 2.9, 6.8], [1.0, 2.4, -4.5], 48, glide=44, push=0.0005, why="pull back: the board and the hall's shutter coming down")],
  kicks=[[17, 0.35], [137, 1.0]],
  marks=[{"who": "him", "at": P["tear"], "view": "front", "pose": "reach f12, rip f17, crumple, toss f32-48", "expr": "stern -> shock"},
         {"who": "staff", "at": P["staff"], "view": "front", "pose": "hook pole up; pulls f92-136", "expr": "neutral"}],
  subjects=[{"n": "him head", "p": HIM_BOARD, "f": [0, 147]}, {"n": "sheet", "p": P["sheet"], "f": [0, 16]},
            {"n": "shutter", "p": SHUT, "f": [110, 147]}, {"n": "staff head", "p": STAFF_HEAD, "f": [110, 147]}],
  physics="the paper ball: ballistic arc from his hand into the bin (lands f48), the bin rocks ±3 deg twice. Shutter: falls under the pole's pull, the last 0.4 m in free fall, 2 small bounces.",
  light_mood="bright noon sun on cream stucco.", sound="paper rip f17; crumple; a tin 'tunk' f48; the shutter's rattle f100-136 and a heavy slam f137 (a bass hit); the score's first note.",
  after="The torn corner stays on the pin; the paper ball stays in the bin.")

scene(id="S02", f=[148, 370], set="piazza", light="day",
  vo="Anh là Alessandro Cremascoli, biệt danh iCaterpie, người Ý, hai lần vô địch quốc gia môn thẻ bài Pokémon.",
  gloss="He is Alessandro Cremascoli, nicknamed iCaterpie, Italian, twice national champion of the Pokémon card game.",
  spine=2, viewer="At his café table: the name, the Caterpie card held up, two national trophies.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S01"}, "out": {"type": "dissolve", "to": "S03", "n": 8}},
  build="reuse the café terrace (T1): two gold trophies (plates VÔ ĐỊCH QUỐC GIA), an espresso, his deck box; bunting overhead.",
  blocking="Him seated at T1 (him_t1), facing +z, head toward the lens.",
  action="f150-230 he sips the espresso (cup to mouth f190-205); f236-248 his right arm lifts the real Caterpie card toward the lens on 'iCaterpie' (f250): it fills ~45% of the frame width f252-300; f300-330 the camera pulls back to the two trophies on 'hai lần' (f301); a gleam crosses each trophy f306 and f314.",
  acting="Him: smile, a proud grin on the card.",
  cams=[k(148, [4.3, 1.5, 1.6], [4.2, 1.0, -2.6], 42, why="him at his café table"),
        k(234, [3.95, 1.45, -1.27], CARD, 30, glide=20, push=0.0006, why="the Caterpie card fills the frame"),
        k(300, [4.3, 1.6, 0.9], [4.15, 1.15, -2.5], 40, glide=26, why="the two trophies")],
  kicks=[], marks=[{"who": "him", "at": P["him_t1"], "view": "front seated", "pose": "sips f190-205; card up f236-300", "expr": "smile -> grin"}],
  subjects=[{"n": "him head", "p": HIM_T1, "f": [148, 225]}, {"n": "card", "p": CARD, "f": [252, 298]}, {"n": "trophies", "p": TROPH, "f": [330, 369]}],
  physics="none.", light_mood="warm sun under the striped awning.", sound="café murmur, a cup clink f205; a bright pluck motif; a 'ting' per trophy gleam.",
  after="The card back in his deck box.")

scene(id="S03", f=[370, 535], set="piazza", light="day",
  vo="Hai mươi lăm năm, anh đi khắp nước Ý dạy người lạ cách chơi, dựng nên cả một cộng đồng.",
  gloss="For twenty-five years he travelled all over Italy teaching strangers how to play, building a whole community.",
  spine=2, viewer="His suitcase covered in city stickers; he teaches a stranger; the camera pulls back on a terrace full of players.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S02"}, "out": {"type": "dissolve", "to": "S04", "n": 10}},
  build="reuse the terrace; the sticker suitcase (ROMA, NAPOLI, TORINO, VENEZIA, MILANO, BOLOGNA, FIRENZE); the stranger at T1; four players at T2 and T3 with real cards.",
  blocking="Him walks in from the right with the suitcase past the signpost to T1; the stranger already seated at str_t1; players at T2/T3 (off frame until the pull back).",
  action="f372-446 he wheels the suitcase from (5.6, -1.4) left past the signpost to T1 (stickers readable); f446-452 parks it and sits; f458-474 he lays a real card on the table in front of the stranger ('dạy' f451), points at it f475; the stranger nods f480; f488-535 the camera rises and pulls back: T2 and T3 full of players ('cộng đồng' f521).",
  acting="Him: friendly, explaining. Stranger: puzzled -> smile.",
  cams=[k(370, [4.3, 1.5, 2.6], [4.0, 1.15, -1.6], 44, why="him and the sticker suitcase"),
        k(446, [4.25, 1.5, 1.2], [4.2, 0.95, -2.4], 40, glide=20, why="teaching the stranger"),
        k(488, [4.5, 3.1, 5.8], [4.3, 1.2, -1.8], 46, glide=44, why="pull back: the terrace full of players")],
  kicks=[], marks=[{"who": "him", "at": P["him_t1"], "view": "side walking -> front seated", "pose": "walks f372-446, sits f452, lays a card f458-474", "expr": "smile"},
                   {"who": "stranger", "at": P["str_t1"], "view": "front seated", "pose": "nods f480", "expr": "neutral -> smile"}],
  subjects=[{"n": "him head", "p": [4.3, 1.55, -1.5], "f": [390, 430]}, {"n": "stranger head", "p": [P["str_t1"][0], 1.25, P["str_t1"][1]], "f": [455, 530]}],
  physics="suitcase wheels roll (spin = distance / r).", light_mood="sunny.", sound="suitcase wheels on cobbles; card snap f474; the community grows: more voices, laughter f500-535.",
  after="The terrace full.")

scene(id="S04", f=[535, 640], set="worlds", light="day",
  vo="Hơn một tháng sau giải vô địch thế giới ở San Francisco,",
  gloss="More than a month after the World Championships in San Francisco,",
  spine=3, viewer="Worlds in San Francisco: the Golden Gate in the window; a judge rules at his table.",
  **{"in": {"type": "dissolve", "n": 10, "from": "S03"}, "out": {"type": "dissolve", "to": "S05", "n": 8, "note": "a month later"}},
  build="new: the Worlds hall, the window wall with the Golden Gate, table A, back tables.",
  blocking="Him seated at the left end (facing the opponent), the opponent at the right end, the judge standing behind the table.",
  action="f540-575 cards played (one slides onto his mat f560); f586-600 the judge raises his right arm (a ruling); f600 he frowns, arms folded; f612 the judge points at his mat; f625 he throws up his hands.",
  acting="Judge: stern. Him: stern -> annoyed. Opponent: nervous.",
  cams=[k(535, [0.2, 2.7, 4.6], [0.0, 2.2, -5.5], 50, why="the hall and the Golden Gate"),
        k(566, [0.05, 1.75, 3.5], [0.0, 1.0, -1.7], 48, glide=34, why="the table, the judge")],
  kicks=[], marks=[{"who": "him", "at": W["him"], "view": "front seated, head to +x", "pose": "plays; folds arms f600; hands up f625", "expr": "stern"},
                   {"who": "opp", "at": W["opp"], "view": "front seated, head to -x", "pose": "plays", "expr": "nervous"},
                   {"who": "judge", "at": W["judge"], "view": "front", "pose": "arm up f586-600, points f612", "expr": "stern"}],
  subjects=[{"n": "him head", "p": [W["him"][0], 1.25, W["him"][1]], "f": [580, 639]}, {"n": "judge head", "p": [W["judge"][0], 1.55, W["judge"][1]], "f": [580, 639]},
            {"n": "opp head", "p": [W["opp"][0], 1.25, W["opp"][1]], "f": [580, 639]}],
  physics="card slide with friction.", light_mood="bright hall, sun through the window.", sound="hall hubbub, a card slide f560, a judge's whistle-free 'tsk'; shuffle sounds.",
  after="-")

scene(id="S05", f=[640, 739], set="piazza", light="day",
  vo="anh lên mạng viết một bài than phiền về một trọng tài ở giải đó.",
  gloss="he went online and wrote a post complaining about a judge at that event.",
  spine=3, viewer="He pins a sheet on the town board and writes his complaint, a striped-shirt judge doodle on top.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S04"}, "out": {"type": "glide", "to": "S06"}},
  build="reuse the board (no sheet before f656); the shutter open; passers-by in the back.",
  blocking="Him walks in from the right carrying the blank sheet to the tear mark.",
  action="f640-654 he walks in with the blank sheet (held at the chest); f656-660 he pins it (pin pressed f660); f662-735 he writes with a marker: the judge doodle on 'trọng tài' (f703-716), complaint lines (each line ~10 f, the marker squeaks).",
  acting="Him: frown, determined.",
  cams=[k(640, [-0.6, 1.7, 1.9], [-0.85, 1.2, -3.0], 42, why="the board, him arriving"),
        k(690, [-0.85, 1.6, 1.0], [-1.0, 1.0, -3.0], 40, glide=34, why="the writing")],
  kicks=[], marks=[{"who": "him", "at": P["tear"], "view": "front", "pose": "walks in f640-654, pins f660, writes f662-735", "expr": "stern"}],
  subjects=[{"n": "him head", "p": HIM_BOARD, "f": [656, 738]}, {"n": "sheet", "p": P["sheet"], "f": [660, 738]}],
  physics="the sheet hangs from one pin (a slight sway after pinning).", light_mood="sunny.", sound="a pin thunk f660; marker squeaks f662-735; distant scooter.",
  after="The sheet hangs on the board, written.")

scene(id="S06", f=[739, 799], set="piazza", light="day",
  vo="Và anh gọi thẳng tên người ấy.",
  gloss="And he called that person out by name.",
  spine=3, viewer="He writes the judge's name in red; a black censor bar slams over it.",
  **{"in": {"type": "glide", "from": "S05"}, "out": {"type": "dissolve", "to": "S07", "n": 6}},
  build="reuse the sheet: the name line at its bottom.",
  blocking="Him at the tear mark, his arm at the sheet.",
  action="f745-768 his marker writes the name in big red letters (we never see it legibly: scribble shapes); f770 a black censor bar slams over it (2 f squash) on 'tên' (f774); he underlines it twice f778-790.",
  acting="Him: stern.",
  cams=[k(739, [-1.05, 1.35, -1.2], [-1.2, 1.12, -2.95], 38, glide=20, why="the name on the sheet")],
  kicks=[[770, 0.4]], marks=[{"who": "him", "at": P["tear"], "view": "front", "pose": "writes the name f745-768", "expr": "stern"}],
  subjects=[{"n": "name", "p": [-1.25, 0.98, -2.95], "f": [760, 798]}],
  physics="none.", light_mood="sunny.", sound="Censor Beep (meme) f772; marker squeaks.", after="The name under the censor bar.")

scene(id="S07", f=[799, 859], set="piazza", light="day",
  vo="Sáu tiếng sau, anh xóa bài.",
  gloss="Six hours later, he deleted the post.",
  spine=3, viewer="The clock spins six hours while the town streams past the post and photographs it; then he tears it down.",
  **{"in": {"type": "dissolve", "n": 6, "from": "S06"}, "out": {"type": "dissolve", "to": "S08", "n": 8, "note": "16 Oct"}},
  build="reuse the master wide: the clock, the open door, the board with the sheet.",
  blocking="Passers-by stream left-right in front of the board (time-lapse); him back at the tear mark from f832.",
  action="f800-836 the clock's hands spin from 13:00 to 19:00 (the minute hand six turns); five passers-by cross fast, three stop and raise phones: flashes f806, f815, f824; f832 he steps back to the board; f841 he rips the sheet off (2 f before 'xóa' f843); the corner stays.",
  acting="Passers-by: curious. Him: grim.",
  cams=[k(799, MASTER["pos"], MASTER["look"], MASTER["fov"], push=0.0006, why="the clock, the board and the town: six hours")],
  kicks=[[841, 0.3]], marks=[{"who": "him", "at": P["tear"], "view": "front", "pose": "arrives f832, rips f841", "expr": "stern"}],
  subjects=[{"n": "clock", "p": CLOCK, "f": [799, 858]}, {"n": "board", "p": [-1.0, 1.6, -3.0], "f": [799, 858]}],
  physics="the clock hands: kinematic.", light_mood="sunny (the light stays bright).", sound="a fast clock tick-whirr f800-836; Camera shutter (meme) x3; the rip f841.",
  after="Only the torn corner on the pin.")

scene(id="S08", hero=True, f=[859, 1107], set="piazza", light="day",
  vo="Ngày mười sáu tháng mười, khi đang chuẩn bị lên đường dự giải ở Nice, anh báo tin: mình đã bị cấm vĩnh viễn khỏi mọi giải đấu chính thức của Pokémon.",
  gloss="On October 16, as he was getting ready to travel to the event in Nice, he announced: he had been permanently banned from all official Pokémon events.",
  spine=4, viewer="With his NICE-tagged suitcase he pins his announcement; the staff slam the hall's shutter, padlock it and hang CẤM VĨNH VIỄN.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S07"}, "out": {"type": "glide", "to": "S09"}},
  build="reuse the piazza; the suitcase with a NICE luggage tag; the announcement sheet; the padlock and the sign.",
  blocking="Him wheels the suitcase in from the right to the tear mark; the staff at the door.",
  action="f862-930 he wheels the suitcase from (1.9, -2.3) to the tear mark; f945-962 the NICE tag swings on the handle ('Nice' f958); f975-995 he takes the announcement from his jacket and pins it (pin f998, 'báo tin' f982-988); f1003-1020 the staff pulls the shutter down, it slams on 'cấm' f1022; f1030-1036 the staff snaps the padlock shut ('vĩnh viễn' f1036); f1044-1058 he hangs the sign CẤM VĨNH VIỄN on the shutter's hasp; f1062-1095 the camera rises to the sign above the door: POKÉMON · GIẢI ĐẤU CHÍNH THỨC.",
  acting="Him: tired, sad. Staff: neutral, businesslike.",
  cams=[k(859, [1.1, 2.0, 4.6], [0.4, 1.6, -3.5], 46, why="him and the suitcase crossing to the board"),
        k(940, [0.0, 1.45, 0.9], [-0.3, 0.9, -2.6], 40, glide=22, why="the NICE tag, the announcement pinned"),
        k(1004, [1.6, 2.5, 4.6], [2.0, 2.0, -5.5], 46, glide=26, why="the shutter slams, the padlock, the sign"),
        k(1060, [1.3, 2.9, 0.8], [1.5, 3.3, -6.0], 40, glide=30, why="the sign over the shut door")],
  kicks=[[1022, 1.0], [1036, 0.3]],
  marks=[{"who": "him", "at": P["tear"], "view": "side walking -> front", "pose": "wheels f862-930; pins f998", "expr": "sad"},
         {"who": "staff", "at": P["staff"], "view": "front", "pose": "pulls f1003-1020, padlock f1030-1036, sign f1044-1058", "expr": "neutral"}],
  subjects=[{"n": "him head", "p": HIM_BOARD, "f": [940, 1000]}, {"n": "ann", "p": P["ann"], "f": [1000, 1003]},
            {"n": "shutter", "p": SHUT, "f": [1032, 1060]}, {"n": "staff head", "p": STAFF_HEAD, "f": [1032, 1058]}, {"n": "sign", "p": SIGNH, "f": [1080, 1106]}],
  physics="the luggage tag: pendulum on its strap; the shutter as in S01; the padlock shackle snaps 1 cm.",
  light_mood="morning sun.", sound="suitcase wheels; a pin thunk f998; the shutter rattle and slam f1022 (bass hit); the padlock click f1036; the sign's chain jingle f1050.",
  after="The shutter stays down, padlocked, the sign on it, until the end.")

scene(id="S09", hero=True, f=[1107, 1258], set="piazza", light="day",
  vo="\"Tôi suy sụp. Pokémon đúng nghĩa là cuộc đời tôi. Tôi không thể ngừng khóc.\"",
  gloss="\"I'm devastated. Pokémon is literally my life. I can't stop crying.\"",
  spine=4, viewer="He slumps onto his suitcase before the shut door, looks at his Caterpie card, and cries.",
  **{"in": {"type": "glide", "from": "S08"}, "out": {"type": "cut", "to": "S10"}},
  build="reuse; the suitcase moved to the sit mark (he wheels it there f1100-1110, off camera during the glide).",
  blocking="Him seated on the suitcase at the sit mark, the shut door behind him.",
  action="f1110-1128 he slumps down onto the suitcase ('suy sụp' f1120); f1147-1160 he takes the Caterpie card out and holds it in front of him, head bowed to it ('cuộc đời tôi' f1186-1199); f1212-1252 tears drip from his eyes onto the cobbles (a drop every 6 f each side), small dark dots stay.",
  acting="Him: sad -> crying (sad, eyes squeezed).",
  cams=[k(1107, [1.1, 1.4, 2.2], [0.8, 1.0, -5.0], 42, glide=30, why="him on the suitcase, the padlocked door behind"),
        k(1160, [0.55, 1.15, -1.15], [0.3, 1.0, -2.55], 38, glide=34, why="the card in his hands, his face"),
        k(1215, [0.9, 1.35, 0.4], [0.5, 1.1, -3.0], 42, glide=30, why="the tears, the door behind")],
  kicks=[], marks=[{"who": "him", "at": P["sit"], "view": "front seated", "pose": "slumps f1110-1128; card f1147-1210; cries f1212-1252", "expr": "sad"}],
  subjects=[{"n": "him head", "p": SITH, "f": [1125, 1158]}, {"n": "card in hand", "p": [0.32, 1.02, -2.4], "f": [1180, 1210]}, {"n": "him face", "p": SITH, "f": [1240, 1257]}],
  physics="tear drops fall under gravity from the eyes to the cobbles.", light_mood="sunny but still.", sound="a soft piano line (synth), no meme; a quiet sniff f1215.",
  after="Tear dots on the cobbles.")

scene(id="S10", f=[1258, 1346], set="piazza", light="day",
  vo="Khoan đã, bài đã xóa rồi mà vẫn bị phạt?",
  gloss="Wait, the post was deleted and he was still punished?",
  spine=5, viewer="His friend stares at the torn corner on the board and shrugs.",
  **{"in": {"type": "cut", "from": "S09"}, "out": {"type": "cut", "to": "S11"}},
  build="reuse the board: the torn corner, the announcement.",
  blocking="Friend standing in front of the board at (-1.1, -1.3), facing +z.",
  action="f1258 Huh; f1262-1290 the friend points back at the torn corner; f1300-1325 scratches his head; f1334 shrugs on 'phạt?'.",
  acting="Friend: puzzled.",
  cams=[k(1258, [-0.8, 1.6, 2.6], [-1.15, 0.92, -2.9], 42, why="the friend and the torn corner")],
  kicks=[], marks=[{"who": "friend", "at": [-1.1, -1.3], "view": "front", "pose": "points f1262; scratches f1300; shrugs f1334", "expr": "nervous"}],
  subjects=[{"n": "friend head", "p": [-1.1, 1.55, -1.3], "f": [1258, 1345]}, {"n": "corner", "p": P["corner"], "f": [1258, 1345]}],
  physics="none.", light_mood="sunny.", sound="Huh (meme) f1258.", after="-")

scene(id="S11", f=[1346, 1476], set="piazza", light="day",
  vo="Hóa ra, trên mạng, nút xóa chỉ xóa được trên màn hình của bạn.",
  gloss="It turns out that online, the delete button only deletes from your own screen.",
  spine=6, viewer="From the friend's eyes: on his phone, the full post (a photo); behind the phone, the bare board.",
  **{"in": {"type": "cut", "from": "S10"}, "out": {"type": "dissolve", "to": "S12", "n": 8}},
  build="the friend's phone (canvas: PHOTOS, the photo of the sheet with the censored name, 13:42).",
  blocking="Camera at the friend's eyes; the phone in his hands in front.",
  action="f1350-1390 he swipes through three photos of the sheet (each a different angle: they're other people's shares); f1394 'nút xóa': the thumbnail strip shows 37 copies; f1440-1470 the phone tilts a little toward the board: the photo's sheet lines up with the torn corner.",
  acting="none (POV).",
  cams=[k(1346, EYE11, [-1.15, 1.22, -3.0], 56, push=0.0003, why="the phone, the bare board behind")],
  kicks=[], marks=[],
  subjects=[{"n": "phone", "p": PHONE11, "f": [1346, 1475]}, {"n": "corner", "p": P["corner"], "f": [1346, 1475]}],
  physics="none (screen content).", light_mood="sunny.", sound="swipe whooshes; a soft phone tap.", after="-")

scene(id="S12", hero=True, f=[1476, 1660], set="piazza", light="day",
  vo="Bài đăng giống như ly nước đổ ra sàn: bạn lau được vũng nước, nhưng người khác đã kịp nhìn thấy đôi giày ướt.",
  gloss="A post is like a glass of water spilled on the floor: you can mop up the puddle, but others have already seen the wet shoes.",
  spine=6, viewer="He knocks over a glass, mops the puddle clean, but the friend who walked through it leaves a trail of wet prints, and the café patrons point.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S11"}, "out": {"type": "cut", "to": "S13"}},
  build="reuse the terrace T1/T2: a tall water glass, a napkin; the patrons at T2.",
  blocking="Him seated at T1; the friend walks across the terrace right to left; two patrons seated at T2.",
  action="f1500-1506 his right arm gestures and knocks the glass ('ly nước' f1508); it tips off the near edge and falls (rigid body), hits the cobbles f1519 ('đổ' f1519): a splash, a puddle spreads to r 0.32 m by f1530; the glass rolls and rests; f1522-1546 the friend walks through the puddle (one step in it f1533); f1548-1556 he stands, f1558-1584 crouches and wipes with the napkin: the puddle shrinks to nothing ('lau' f1558); f1584-1650 the wet prints the friend left run across the cobbles to where he stands; the patrons look down at the prints, then point at his dripping legs ('nhìn thấy' f1627, 'giày ướt' f1641).",
  acting="Him: oops -> relieved (puddle gone) -> nervous. Friend: oblivious -> embarrassed. Patrons: grin, pointing.",
  cams=[k(1476, [4.15, 1.8, 1.9], [4.05, 1.0, -2.2], 46, why="the table, the glass, the terrace"),
        k(1590, [3.4, 1.75, 2.1], [3.3, 0.85, -1.7], 48, glide=34, why="the wet prints to the friend, the patrons pointing")],
  kicks=[[1519, 0.4]],
  marks=[{"who": "him", "at": P["him_t1"], "view": "front seated -> crouch", "pose": "knocks f1506; mops f1558-1584", "expr": "shock -> relief -> nervous"},
         {"who": "friend", "at": [2.7, -1.7], "view": "side walking", "pose": "walks f1522-1580 through the puddle", "expr": "neutral -> nervous"},
         {"who": "patrons", "at": P["t2"], "view": "front seated", "pose": "look down f1600; point f1627", "expr": "grin"}],
  subjects=[{"n": "him head", "p": HIM_T1, "f": [1476, 1550]}, {"n": "puddle", "p": [3.95, 0.0, -1.95], "f": [1520, 1580]}],
  physics="the glass: cannon-es cylinder, tipped from the table edge, 240 Hz bake; the splash a 6 f FX; the puddle a flat decal that grows then shrinks under the napkin; prints a fading decal per step.",
  light_mood="sunny terrace.", sound="glass knock f1506, a clink-splash f1519; footsteps; squeaky napkin f1558-1584; a wet squelch per step; patrons' giggle.",
  after="A dry spot where the puddle was; the wet prints fade by f1660.")

scene(id="S13", f=[1660, 1735], set="piazza", light="day",
  vo="Sáu tiếng, đủ để bất kỳ ai chụp lại.",
  gloss="Six hours is enough for anyone to take a picture.",
  spine=6, viewer="From the post's own view on the board: five people raise their phones and flash.",
  **{"in": {"type": "cut", "from": "S12"}, "out": {"type": "dissolve", "to": "S14", "n": 10}},
  build="reuse the piazza looking +z from the board's face: the crowd, the house fronts, the fountain.",
  blocking="Five passers-by in front of the board (z -1.5..-0.2), facing the board (the lens), phones held up, screens to them.",
  action="f1662-1700 they gather; flashes from their phones at f1702, f1712, f1718, f1723, f1729 ('chụp lại' f1723).",
  acting="Crowd: curious, gossiping.",
  cams=[k(1660, [-1.0, 1.75, -2.82], [-1.0, 0.95, 3.0], 56, cut=True, push=0.0008, why="the post's view: the crowd snapping it")],
  kicks=[], marks=[{"who": "crowd", "at": [-1.0, 0.6], "view": "front", "pose": "phones up, flash", "expr": "grin / shock"}],
  subjects=[{"n": "c1 head", "p": [-1.6, 1.55, 0.6], "f": [1680, 1734]}, {"n": "c5 head", "p": [-0.4, 1.55, 0.6], "f": [1680, 1734]}],
  physics="none.", light_mood="sunny.", sound="Camera shutter (meme) on each flash.", after="-")

scene(id="S14", hero=True, f=[1735, 1863], set="piazza", light="day",
  vo="Cộng đồng chia làm hai phe. Một bên nói, cấm cả đời là quá nặng.",
  gloss="The community split into two camps. One side says a lifetime ban is too heavy.",
  spine=7, viewer="The crowd splits to the two pans of a public scale; the near side drops the CẤM CẢ ĐỜI weight on its pan and it slams down.",
  **{"in": {"type": "dissolve", "n": 10, "from": "S13"}, "out": {"type": "glide", "to": "S15"}},
  build="reuse; the scale stands at (-3.2, 1.0); the two iron weights on the cobbles by the pans.",
  blocking="Six people in a group beside the scale; three walk to the near pan, three to the far pan.",
  action="f1740-1778 the group splits (three walk toward the lens, three away); f1800-1838 two of the near side lift the CẤM CẢ ĐỜI weight (both arms) and drop it on the near pan f1840; f1845 ('quá nặng') the pan slams to the ground, the beam tilts hard; the far pan rises; they throw up their arms.",
  acting="Near side: indignant. Far side: arms folded.",
  cams=[k(1735, [-1.4, 2.5, 6.4], [-3.3, 1.2, 0.8], 48, why="the crowd by the scale"),
        k(1795, [-2.7, 1.95, 5.4], [-3.5, 0.85, 1.6], 44, glide=30, why="the near pan and the heavy weight")],
  kicks=[[1845, 0.8]],
  marks=[{"who": "crowd", "at": SC, "view": "side walking -> front", "pose": "split f1740-1778; lift f1800-1838", "expr": "stern"}],
  subjects=[{"n": "near pan", "p": NEAR_PAN, "f": [1800, 1862]}, {"n": "n1 head", "p": [SC[0] - 0.6, 1.55, SC[1] + 1.25], "f": [1818, 1862]}],
  physics="the beam: a damped pendulum about the pivot; the weight lands with no bounce (iron), the pan hits the ground stop.",
  light_mood="sunny.", sound="footsteps; a grunt on the lift; a heavy CLANG f1845 (Instagram Thud under it).", after="The near pan on the ground.")

scene(id="S15", f=[1863, 1974], set="piazza", light="day",
  vo="Bên kia nói, lẽ ra anh không nên nêu tên trọng tài trên mạng.",
  gloss="The other side says he should never have named the judge online.",
  spine=7, viewer="The far side puts NÊU TÊN TRỌNG TÀI on their pan and the beam swings back to level.",
  **{"in": {"type": "glide", "from": "S14"}, "out": {"type": "dissolve", "to": "S16", "n": 8}},
  build="reuse.",
  blocking="Far side at the far pan.",
  action="f1880-1922 two of the far side lift their weight; f1925 it lands on the far pan; f1928-1960 the beam swings back to level, overshoots once and settles; both sides glare at each other f1960-1974.",
  acting="Far side: stern. Near side: annoyed.",
  cams=[k(1863, [-2.0, 2.3, 3.6], [-3.2, 1.3, -0.1], 44, glide=36, why="the far side and their weight"),
        k(1932, [-1.0, 2.6, 6.6], [-3.1, 1.3, 0.8], 48, glide=26, why="the scale level, the two camps")],
  kicks=[[1925, 0.4]],
  marks=[{"who": "crowd", "at": SC, "view": "front", "pose": "lift f1880-1922", "expr": "stern"}],
  subjects=[{"n": "far pan", "p": FAR_PAN, "f": [1890, 1973]}, {"n": "near pan", "p": NEAR_PAN, "f": [1950, 1973]}],
  physics="beam: damped pendulum back to level (period 1.1 s, damping 0.35).", light_mood="sunny.", sound="a second clang f1925; a creak as the beam rises.", after="The scale level, both weights on it.")

scene(id="S16", f=[1974, 2089], set="piazza", light="day",
  vo="Còn The Pokémon Company, đến giờ vẫn chưa nói một lời nào.",
  gloss="And The Pokémon Company, to this day, has not said a single word.",
  spine=8, viewer="The official frame at the top of the board stays empty; a crow lands on it and caws.",
  **{"in": {"type": "dissolve", "n": 8, "from": "S15"}, "out": {"type": "glide", "to": "S17"}},
  build="reuse the board: the empty official frame THE POKÉMON COMPANY · THÔNG BÁO CHÍNH THỨC.",
  blocking="Nobody; a crow.",
  action="f1974-2040 slow push on the empty frame; f2030-2048 a crow flies in from the right and lands on the frame's top edge ('chưa nói' f2048); f2058 it caws; it cocks its head.",
  acting="Crow: deadpan.",
  cams=[k(1974, [-0.85, 2.2, 0.6], [-1.0, 2.12, -3.0], 38, push=0.0009, why="the empty official frame")],
  kicks=[], marks=[], subjects=[{"n": "tpc frame", "p": P["tpc"], "f": [1974, 2088]}],
  physics="the crow: flap-glide in, a 2 f squash on landing.", light_mood="sunny.", sound="silence under the VO (the score drops out); Crow (meme) f2058.", after="The crow stays.")

scene(id="S17", f=[2089, 2185], set="piazza", light="day",
  vo="Nên mọi lý do ta biết, đều chỉ là lời kể của anh.",
  gloss="So every reason we know is only his own account.",
  spine=8, viewer="Down the board to his announcement: the only source, signed iCaterpie.",
  **{"in": {"type": "glide", "from": "S16"}, "out": {"type": "glide", "to": "S18"}},
  build="reuse the announcement sheet.",
  blocking="Nobody.",
  action="f2089-2130 the camera glides down from the empty frame to his sheet; f2150-2175 a slow push to the signature '— iCaterpie' ('lời kể của anh' f2155-2173).",
  acting="none.",
  cams=[k(2089, [-0.45, 1.25, -0.6], [-0.55, 1.05, -2.95], 36, glide=40, push=0.0012, why="his announcement, the only source")],
  kicks=[], marks=[], subjects=[{"n": "ann", "p": P["ann"], "f": [2130, 2184]}],
  physics="none.", light_mood="sunny.", sound="a single soft piano note.", after="-")

scene(id="S18", f=[2185, 2243], set="piazza", light="day",
  vo="Bài đăng ấy sống được sáu tiếng.",
  gloss="That post lived six hours.",
  spine=9, viewer="The torn corner on its pin, then up to the clock.",
  **{"in": {"type": "glide", "from": "S17"}, "out": {"type": "glide", "to": "S19"}},
  build="reuse.",
  blocking="Nobody in frame.",
  action="f2185-2208 the torn corner (a breeze flutters it); f2208-2240 tilt up to the clock: its hands sweep 13:00 -> 19:00 once more ('sáu tiếng' f2222).",
  acting="none.",
  cams=[k(2185, [-1.05, 1.6, -0.9], [-1.25, 1.56, -2.95], 36, glide=24, why="the torn corner"),
        k(2194, [0.4, 2.6, 0.8], CLOCK, 38, glide=46, why="the clock: six hours")],
  kicks=[], marks=[], subjects=[{"n": "corner", "p": P["corner"], "f": [2190, 2204]}, {"n": "clock", "p": CLOCK, "f": [2236, 2242]}],
  physics="the corner flutters (sine).", light_mood="sunny.", sound="a clock tick.", after="-")

scene(id="S19", f=[2243, 2360], set="piazza", light="day",
  vo="Còn lệnh cấm, theo lời anh, là mãi mãi.",
  gloss="And the ban, by his account, is forever.",
  spine=9, viewer="Pull back to the whole square: the padlocked door, him on his suitcase, the clock spinning on and on.",
  **{"in": {"type": "glide", "from": "S18"}, "out": {"type": "end"}},
  build="reuse the master wide; the scale with both weights at the left edge.",
  blocking="Him seated on the suitcase at the sit mark.",
  action="f2243-2300 the camera pulls back and down to the master wide; the clock's hands spin faster and faster (days go by) from f2260 ('mãi mãi' f2311-2330); the clouds drift; he stays sitting; the sign sways once.",
  acting="Him: sad, still.",
  cams=[k(2243, [0.4, 3.3, 7.4], [0.4, 3.0, -4.0], 50, glide=60, push=0.0004, why="the square: the shut door, him, the clock forever")],
  kicks=[], marks=[{"who": "him", "at": P["sit"], "view": "front seated", "pose": "sits", "expr": "sad"}],
  subjects=[{"n": "him head", "p": SITH, "f": [2300, 2359]}, {"n": "clock", "p": CLOCK, "f": [2300, 2359]}, {"n": "shutter", "p": SHUT, "f": [2300, 2359]}],
  physics="clock hands kinematic, accelerating.", light_mood="sunny, the clouds drifting.", sound="the theme's last phrase, a clock tick that speeds up and fades.", after="End.")

# quality bar: a character is a subject head AND feet, so the check fails any shot that cuts a body (screen POVs excepted)
for sc in S:
    extra = []
    for sj in sc.get("subjects", []):
        if sj["n"].endswith("head"):
            p = sj["p"]
            extra.append({"n": sj["n"].replace("head", "feet"), "p": [p[0], 0.02, p[2]], "f": sj["f"]})
    sc.setdefault("subjects", []).extend(extra)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.json")
json.dump(PLAN, open(out, "w"), ensure_ascii=False, indent=1)
print("wrote", out, len(S), "scenes")
