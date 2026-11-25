# Gengar unpaid: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/gengar-unpaid/plan.json` (0 errors; the warnings are deliberate pushes/POV glides and brief caption-band touches).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2420 frames (VO ends f2389). Four places: the Fanatics Collect hall (stage, champagne table), the census gallery, the café terrace, the writer's desk.

## Tone
A market fable with a ghost joke: Gengar is a ghost type, so an unpaid sale literally ghosts away. Dry sight gags, a few meme sounds where the sound is the joke. Generic cartoon people, no likenesses; the news site is not named. Screens only from their owner's side (the writer's laptop, the collector's phone); the price board is a wall screen.

## Quality bar (25 Nov 2026)
No blur or depth of field, no shadows, bright warm palettes, cloudy blue skies in every window and outdoor shot, dressed sets, medium-wide cameras with every character head-to-feet in frame, real slab photos (CGC's own photos of the two sold slabs).

## Visual law
Unpaid = a purple see-through ghost (the tag, the pending record marker, the IOU, the erased sales rows). Paid = solid, with a green ĐÃ TRẢ stamp.

## Transitions
Hard cuts: S08 (the champagne), the S12 cut into the laptop POV and the S14 cut into the phone POV. Dissolves for every time jump or change of place (S15 dissolves in); S06 → S07 is a push into the slab (through-object dissolve).

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f335 | f392 | 2002 |
| f500 | f556 | CGC PRISTINE 10 |
| f568 | f624 | 11 · 10 · 2026 |
| f940 | f994 | 25 · 10 |
| f1118 | f1170 | 170+ |

## Sets

### hall
- Origin in the shared world: [0, 0, 0]. Axes: the stage along the back wall (z -4..-2); +z toward the champagne table and the lens.
- Light: day; sun az/el [-30, 40]. Open camera sides: +z.
- Marks [x, z]: auct [-1.35, -3.05]; clerk [0.4, -2.45]; c1 [1.8, 0.75].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: auction hall x -4.2..4.2, z -4..5.5, 4.2 m; cream walls, wine carpet, ceiling (no shadows), wall sconces | [0, 2.1, 0.75] | [8.4, 4.2, 9.5] |
| stage | new: oak stage x -3.2..3.2, z -4..-2, top y 0.3, a dark front skirt | [0, 0.15, -3] | [6.4, 0.3, 2] |
| rostrum | new: oak rostrum 70 x 40 cm, top y 1.4, a sound block and the gavel on top; FANATICS COLLECT plate on its front | [-1.35, 0.85, -2.7] | [0.7, 1.1, 0.4] |
| plinth | new: white lot plinth 50 x 50 cm, top y 1.22; a brass easel holds the slab tilted back 0.2 rad; a brass arm on its right with a tag holder (the tag drops from it on a string) | [-0.35, 0.76, -2.75] | [0.5, 0.92, 0.5] |
| slab | real slab: CGC's own cut-out photo of the exact slab (cert 4288394001, library/slabs), 20 x 33.8 cm (2.4x real, so it reads next to the people) | [-0.35, 1.43, -2.76] | [0.135, 0.215, 0.012] |
| tag | new: card tag 24 x 13.5 cm (oversized to read) on a string (15 cm): front SOLD $576,000, back CHƯA THANH TOÁN in red; spins on its string; turns into a purple see-through ghost | [-0.02, 1.5025, -2.72] | [0.16, 0.09, 0.003] |
| board | reuse:priceBoardW: the price board 170 x 64.5 cm on the back wall (canvas), amber digits, SOLD lamp; CHÍNH XÁC lamp added under it (S13) | [-0.85, 2.85, -3.94] | [1.7, 0.645, 0.04] |
| bids | new: bid counter 70 x 45 cm: LƯỢT TRẢ GIÁ and a two-digit flap count | [0.75, 2.8, -3.94] | [0.7, 0.45, 0.04] |
| pole | new: record pole 8 cm square, y 0.3..3.5, a painted scale every $100k; plate KỶ LỤC GENGAR on top; brass marker $408,000 · 06/2026; a pull cord over a pulley at the top raises the new marker | [1.7, 1.9, -2.65] | [0.08, 3.2, 0.08] |
| chairs | new: three folding chairs for the bidders (seat y 0.46) | [-0.88, 0.45, -0.95] | [1.6, 0.9, 0.8] |
| table | new: long champagne table x 1.3..3.8, z 1.15..1.65, top y 1.0, white cloth to the floor; a coupe tower and an ice bucket | [2.55, 0.5, 1.4] | [2.5, 1, 0.5] |

### census
- Origin in the shared world: [40, 0, 0]. Axes: the slab wall on the back wall z -3; the podium in front of it; the lens at +z.
- Light: day; sun az/el [20, 50]. Open camera sides: +z.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: gallery x -3..3, z -3..3, 3.2 m, navy walls, dark floor, ceiling | [0, 1.6, 0] | [6, 3.2, 6] |
| wall | new: 170 Pristine 10 Latios slabs (17 x 10, real scan, canvas) on brass rails, 3.4 x 2.0 m; a plate '170+ · PRISTINE 10' | [0, 1.55, -2.97] | [3.4, 2, 0.03] |
| podium | new: velvet podium 50 x 50 cm, top y 1.05, brass easel with the auction Latios slab (1.6x); a spotlight cone from above (lit on SPOT7) | [0, 0.525, -0.9] | [0.5, 1.05, 0.5] |

### cafe
- Origin in the shared world: [80, 0, 0]. Axes: the café front on z -2.4 faces +z; the round table in front; the lens on the street.
- Light: day; sun az/el [-40, 35]. Open camera sides: +z.
- Marks [x, z]: borrower [-0.48, -0.95]; lender [0.48, -0.95].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| front | new: café front 7 m wide x 3.6 m, a striped awning, window, door, sign CÀ PHÊ; potted plants; paving | [0, 1.8, -2.5] | [7, 3.6, 0.2] |
| table | new: round café table r 34 cm, top y 0.74, iron foot; two cups of coffee; two chairs | [0, 0.37, -0.7] | [0.68, 0.74, 0.68] |
| iou | new: IOU note 20 x 12 cm 'MAI TAO TRẢ' (ghost purple, see-through; turns solid white on SOLID11, green stamp ĐÃ TRẢ on STAMP11) | [0, 0.742, -0.6] | [0.2, 0.002, 0.12] |
| envelope | new: fat cash envelope 20 x 10 x 3 cm, slides across the table from him to her | [-0.2, 0.755, -0.78] | [0.2, 0.03, 0.1] |

### desk
- Origin in the shared world: [120, 0, 0]. Axes: the writer sits behind his desk facing +z; the laptop faces him; a night window in the -x wall.
- Light: day; sun az/el [-40, 35]. Open camera sides: +z.
- Marks [x, z]: writer [0, -1.5].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: small room x -2.4..2.4, z -2.4..2.4, 2.6 m, blue-grey walls, ceiling; a night window; shelves of binders | [0, 1.3, 0] | [4.8, 2.6, 4.8] |
| table | new: desk, top y 0.76, x -0.9..0.9, z -1.22..-0.52; a desk lamp, a mug, notes | [0, 0.38, -0.87] | [1.8, 0.76, 0.7] |
| laptop | adapt:laptop (TCGplayer reel): screen canvas = FANATICS COLLECT · LỊCH SỬ BÁN, facing the writer | [0.45, 0.76, -0.75] | [0.34, 0.24, 0.24] |

## Cast

- **auct:** black suit, red tie, grey hair. Items: gavel. Views: front.
- **clerk:** black polo with STAFF on the chest, dark trousers. Items: none. Views: front, side walking.
- **spokes:** charcoal suit, blue tie, glasses. Items: none. Views: front.
- **bidder:** three looks: teal blazer, mustard sweater, plum jacket. Items: paddle. Views: front, seated.
- **collector:** green hoodie (c1), yellow jacket, purple beanie, purple jacket, red jacket. Items: champagne bottle, phone (c1, S14). Views: front.
- **waiter:** white shirt, black vest, black tie. Items: bill folder. Views: front.
- **borrower:** orange hoodie, cap. Items: cash fan, megaphone, envelope. Views: front, seated.
- **lender:** blue shirt, glasses, dark hair. Items: none. Views: front, seated.
- **writer:** red cardigan, glasses, dark hair. Items: none. Views: front, seated.

## Scenes

### S01 ★ · 0:00.0-0:03.3 · f0-f100 · "Một lá Gengar được trả năm trăm bảy mươi sáu nghìn đô la,"
- Gloss: A Gengar card was bid to five hundred seventy-six thousand dollars,
- Spine link: 1. Viewer must get: The hammer falls: $576,000 on the Gengar.
- In: open on the act. Out: dissolve 8 f (next day, the same plinth).
- Set: hall. Light: day.
- Build: new: the hall stage, rostrum with sound block, lot plinth with the Gengar slab and the tag arm, price board, bid counter, FANATICS COLLECT letters.
- Blocking: Auctioneer behind the rostrum (auct mark, on the stage), gavel raised in his right arm (screen left) from f0.
  - auct at [-1.35, -3.05], front; standing; gavel wind-up f70-76, slam f79; grin -> squeeze.
- Action, against the words: f0-70 the board counts the last steps up to $576,000 (in time with 'năm trăm bảy mươi sáu'); f70-76 wind-up of the gavel, held at the top f73-76; f79 the gavel slams the block (2 f before 'đô' f81): the board snaps to $576,000 with the red SOLD lamp; f80 the tag drops 15 cm out of its brass holder on its string and swings (damped pendulum, 4 swings) showing SOLD $576,000; f84-100 glide down to the slab and the swinging tag.
- Acting: Auctioneer: a showman's grin; on the slam his eyes shut tight.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [-0.6, 1.7, 2.1] | [-0.6, 1.75, -3] | 46 | 0.08 | 0 | the board over the rostrum and the lot |
| 84 | glide 22 f | [-0.2, 1.5, -0.4] | [-0.2, 1.45, -2.75] | 36 | 0.1 | 0 | to the slab and the tag |

- Kicks (7 f): f79 strength 1.
- Physics & FX: tag: pendulum on a 13 cm string, released at f80 from 15 cm up: drops, snaps taut, swings ±25 deg damped (settles by f130). Gavel: 1 f strike, 2 f squash of the block.
- Light & mood: warm auction light, the board glow.
- Sound: crowd murmur; gavel crack f79; a ka-ching f81; the tag string snap f80; the score's first hit.
- After-state: The tag hangs from its string: SOLD $576,000.

### S02 ★ · 0:03.3-0:09.9 · f100-f298 · "và hôm sau, nó bị đánh dấu là chưa thanh toán. Đúng chất Pokémon hệ ma: có đó, rồi biến mất."
- Gloss: and the next day it was marked unpaid. Typical ghost-type Pokémon: there, then gone.
- Spine link: 1. Viewer must get: Next day the tag flips to CHƯA THANH TOÁN, then ghosts away.
- In: dissolve 8 f. Out: tilt (the camera comes back down from the ceiling to the slab).
- Set: hall. Light: day.
- Build: reuse the hall, empty, cooler light; the tag hanging.
- Blocking: Clerk enters from the stage right (clerk_in) f104-140 to the clerk mark beside the plinth, faces +z.
  - clerk at [0.4, -2.45], front; walks in f104-140; flicks the tag f156; looks up f262; neutral -> shock.
- Action, against the words: f104-140 the clerk walks in; f150-156 his left arm (screen right) reaches the tag's edge, f156 a flick (2 f before 'chưa' f158): the tag spins on its string 1.5 turns, slowing, and stops on its back, CHƯA THANH TOÁN in red, by f182; f196-236 'hệ ma': the tag shivers (2 mm jitter) and fades to a purple see-through ghost, its corners curling like a sheet; f243 'có đó' it hangs; f262 it slips off the string and floats up with a slow S-wobble (0.6 m/s); f278-292 'biến mất' it fades out at y 2.6; the empty string sways. The clerk looks up, shocked.
- Acting: Clerk: neutral -> shock on the lift (f262).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 100 | open | [0.15, 1.35, 1.25] | [0.12, 1.3, -2.72] | 46 | 0.06 | 0 | the plinth next day; the clerk comes in |
| 166 | glide 22 f | [-0.15, 1.5, -0.5] | [-0.15, 1.47, -2.72] | 34 | 0.08 | 0 | the slab and the tag |
| 254 | glide 30 f | [-0.1, 1.6, -0.5] | [-0.05, 2.2, -2.72] | 40 | 0 | 0 | tilt up with the ghost |

- Kicks (7 f): none.
- Physics & FX: tag spin: torsion pendulum, 1.5 turns decaying to rest on its back. Ghost: no gravity, rises 0.6 m/s with a sine side-wobble (amplitude 4 cm, 1.2 Hz), fades over 14 f.
- Light & mood: the next morning: cooler, dimmer (no crowd).
- Sound: footsteps f104-140; a flick tick f156, a spinning whirr; a ghostly theremin 'ooo' f196-290 rising; a soft pop of the string f262; silence after.
- After-state: The empty string hangs from the arm (it stays until S15).

### S03 · 0:09.9-0:18.7 · f298-f562 · "Lá Gengar ấy in năm hai nghìn không trăm lẻ hai, bộ Legendary Collection, mặt bóng lấp lánh như pháo hoa, được CGC chấm Pristine mười."
- Gloss: That Gengar was printed in 2002, Legendary Collection, its holo face sparkling like fireworks, graded Pristine 10 by CGC.
- Spine link: 2. Viewer must get: What the card is: 2002, the firework holo, CGC Pristine 10.
- In: tilt. Out: dissolve 8 f (back to the auction day).
- Set: hall. Light: day.
- Build: reuse the slab (CGC-style, gold PRISTINE 10 label).
- Blocking: Clerk gone (walked out of frame during the tilt).
- Action, against the words: f298-330 the camera comes down onto the slab; f440-470 a white gleam sweeps across the case; f474, f480, f486 three small firework bursts in the dark air beside and behind the slab (left, upper right, right), never over the card, on 'pháo hoa' f477; f515-540 push onto the label; f535 the PRISTINE 10 grade box lights gold on 'Pristine' (f535).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 298 | open | [-0.34, 1.47, -1.36] | [-0.35, 1.43, -2.76] | 30 | 0.08 | 0 | the slab |
| 512 | glide 26 f | [-0.35, 1.58, -1.87] | [-0.35, 1.55, -2.77] | 30 | 0.08 | 0 | the label: PRISTINE 10 |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: cool; the slab under the plinth light.
- Sound: a soft chime per gleam f440; three small firework pops and crackles f474-490; a gold 'ting' f535.
- After-state: Unchanged.

### S04 · 0:18.7-0:25.2 · f562-f757 · "Ngày mười một tháng mười, trên sàn Fanatics Collect, ba mươi hai lượt trả giá đẩy nó lên năm trăm bảy mươi sáu nghìn."
- Gloss: On October 11, on Fanatics Collect, thirty-two bids pushed it up to five hundred seventy-six thousand.
- Spine link: 2. Viewer must get: The auction: paddle after paddle, the counter to 32, the price to $576,000.
- In: dissolve 8 f. Out: glide.
- Set: hall. Light: day.
- Build: reuse the hall full: three seated bidders with paddles; the bid counter and the price board.
- Blocking: Bidders seated on the bidder marks facing +z; auctioneer at the rostrum pointing.
  - bidder at [-1.55, -1.2], front; seated; paddle up per bid; stern -> nervous.
  - bidder at [-0.2, -1.2], front; seated; paddle up per bid; stern -> nervous.
  - bidder at [-0.88, -0.5], front; seated; paddle up per bid; stern -> nervous.
- Action, against the words: f640-750 32 bids, accelerating: each bid one paddle snaps up (3 f) and down, the counter flips +1 and the board steps up ($200,000 -> $576,000); the last paddle (bidder 2) at f744; f750 the board lands on $576,000 on 'nghìn'; the camera rises to the board f722-752.
- Acting: Bidders: stern, then nervous as it climbs; bidder 2 grins on the last bid.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 562 | open | [-0.6, 2.4, 5.2] | [-0.6, 1.3, -2.2] | 44 | 0.06 | 0 | the bidders under the boards |
| 722 | glide 30 f | [-0.85, 2.6, 1.15] | [-0.85, 2.8, -3.94] | 40 | 0.06 | 0 | the board lands on $576,000 |

- Kicks (7 f): f750 strength 0.5.
- Physics & FX: paddles: 3 f snap up, 2 f hold, 4 f down.
- Light & mood: warm, full house.
- Sound: a rising pizzicato ostinato that speeds up with the bids; a paddle swish + a counter flap per bid; a ka-ching f750.
- After-state: The board reads $576,000.

### S05 · 0:25.2-0:31.1 · f757-f933 · "Nếu tiền về, đó là kỷ lục mới cho Gengar, vượt xa mức bốn trăm lẻ tám nghìn hồi tháng sáu."
- Gloss: If the money arrives, that's a new record for Gengar, far above the four hundred and eight thousand of June.
- Spine link: 2. Viewer must get: The record pole: $408k (June); the new $576k marker hauled far above it, still a ghost.
- In: glide. Out: dissolve 8 f (two weeks later).
- Set: hall. Light: day.
- Build: new: the record pole with the old brass marker ($408,000 · 06/2026) and the new ghost marker ($576,000, purple see-through) on the pull cord.
- Blocking: Clerk at clerk_pole beside the pole (on the stage), facing +z, both arms on the cord.
  - clerk at [1.38, -2.4], front; hauls the cord f790-905; effort -> smile.
- Action, against the words: f790-905 the clerk hauls the cord hand over hand (each pull 14 f): the ghost marker rises from y 1.0 past the old one at 'vượt xa' (f850) to its place, 67 cm above it, by f905; it wobbles once; he wipes his brow (looks up, satisfied).
- Acting: Clerk: effort squint, then a proud smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 757 | open | [1.9, 1.9, 3] | [1.65, 1.75, -2.65] | 44 | 0.08 | 0 | the clerk hauls the marker up the pole |

- Kicks (7 f): none.
- Physics & FX: marker: kinematic on the pole, eased per pull, a 1 cm overshoot at the top.
- Light & mood: warm.
- Sound: cord squeaks per pull; a pulley ratchet; a small 'whoa' brass rise f850.
- After-state: The ghost marker sits 67 cm above $408,000.

### S06 · 0:31.1-0:36.9 · f933-f1106 · "Hai tuần sau, một lá Latios Gold Star, cũng Pristine mười, bán năm trăm lẻ bốn nghìn."
- Gloss: Two weeks later, a Latios Gold Star, also Pristine 10, sold for five hundred and four thousand.
- Spine link: 3. Viewer must get: Same stage, a new lot: the Latios hammers at $504,000.
- In: dissolve 8 f. Out: through-object 8 f (push into the Latios slab, dissolve to the census wall).
- Set: hall. Light: day.
- Build: reuse the S01 frame; the Latios slab (real EX Deoxys Latios Gold Star scan, gold PRISTINE 10 label) on the easel; a new SOLD tag in the holder.
- Blocking: Auctioneer at the rostrum, gavel raised.
  - auct at [-1.35, -3.05], front; slam f1094; grin -> squeeze.
- Action, against the words: f1062-1092 the board climbs $420,000 -> $504,000; f1084-1090 wind-up, f1094 slam (3 f before 'nghìn' f1097): board $504,000 + SOLD, the new tag drops and swings; f1096-1106 push into the slab.
- Acting: Auctioneer grin, squeeze on the slam.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 933 | open | [-0.6, 1.7, 2.1] | [-0.6, 1.75, -3] | 46 | 0.06 | 0 | the same stage (locked frame) |
| 972 | glide 24 f | [-0.3, 1.47, -1.36] | [-0.35, 1.43, -2.76] | 30 | 0.06 | 0 | the Latios slab, named |
| 1050 | glide 30 f | [-0.6, 1.7, 2.1] | [-0.6, 1.75, -3] | 46 | 0 | 0 | back to the stage for the gavel |
| 1094 | glide 12 f | [-0.35, 1.45, -2.15] | [-0.35, 1.44, -2.76] | 22 | 0.4 | 0 | into the Latios |

- Kicks (7 f): f1094 strength 0.9.
- Physics & FX: the tag as in S01.
- Light & mood: warm.
- Sound: gavel crack f1094; ka-ching f1097.
- After-state: SOLD $504,000 tag on the Latios.

### S07 · 0:36.9-0:40.8 · f1106-f1224 · "Trong hơn một trăm bảy mươi lá Latios như thế, nó là lá đẹp nhất."
- Gloss: Of more than one hundred seventy Latios like that, it is the finest.
- Spine link: 3. Viewer must get: A wall of 170 identical slabs; one on the podium is the best.
- In: through-object 8 f. Out: cut.
- Set: census. Light: day.
- Build: new: the census gallery: a wall of 170 Latios slabs, the podium with the auction copy, a spotlight.
- Blocking: Nobody.
- Action, against the words: f1106-1166 the camera trucks along the wall (the rows of slabs pass); f1168-1194 it pulls back to show the podium in front of the wall; f1204 the spotlight snaps on the podium slab on 'đẹp nhất' (f1208), the wall dims 30 %; a gleam crosses the slab f1208-1222.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1106 | open | [0, 1.55, 2.7] | [0, 1.4, -2] | 46 | 0.08 | 0 | the gallery: the wall of 170 and the podium |
| 1150 | glide 40 f | [0, 1.35, 1] | [0, 1.28, -1.2] | 40 | 0.06 | 0 | the podium before the wall |
| 1196 | glide 22 f | [0, 1.27, -0.05] | [0, 1.22, -0.92] | 30 | 0.08 | 0 | the best one |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: dark gallery; the spotlight on SPOT7.
- Sound: a soft whoosh per row passed; a spotlight 'clunk' f1204; a choir 'aah' f1208.
- After-state: Spotlight stays on.

### S08 ★ · 0:40.8-0:42.8 · f1224-f1283 · "Cả thị trường mở sâm panh."
- Gloss: The whole market pops the champagne.
- Spine link: 3. Viewer must get: Everyone celebrates: four corks fly.
- In: cut. Out: hold.
- Set: hall. Light: day.
- Build: reuse the hall's champagne table: four collectors behind it, each with a bottle; a coupe tower.
- Blocking: Collectors c1-c4 behind the table on their marks, facing +z, bottles raised at 45 deg in their right arms.
  - c1 at [1.8, 0.75], front; standing; bottle pop f1252; grin -> laugh.
  - c2 at [2.3, 0.75], front; standing; bottle pop f1252; grin -> laugh.
  - c3 at [2.8, 0.75], front; standing; bottle pop f1252; grin -> laugh.
  - c4 at [3.3, 0.75], front; standing; bottle pop f1252; grin -> laugh.
- Action, against the words: Hard cut on 'Cả' (f1226); f1240-1250 thumbs-less push: the bottles tilt up; f1252 four corks pop together (1 f before 'mở' f1253): corks fly up and back (2-3 m), foam bursts from each neck (fxSplash) for 10 f; the corks hit the floor behind the table, bounce twice and stay; collectors laugh.
- Acting: Collectors: grin -> laugh.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1224 | open | [2.55, 2.05, 5.2] | [2.55, 1.25, 1] | 54 | 0.08 (punch 0.3 for 10 f) | 0 | the champagne table |

- Kicks (7 f): f1252 strength 0.8.
- Physics & FX: corks: 8 g, launched 4-5 m/s up and back from each neck, gravity, restitution 0.4 on the floor, friction 0.5; they rest and stay (seen in S09 and S14).
- Light & mood: warm party light.
- Sound: four champagne pops f1252 + fizz; Kids Cheering (meme) f1254; the party theme.
- After-state: Four corks on the floor; foam on the table.

### S09 · 0:42.8-0:47.1 · f1283-f1412 · "Khoan đã, nếu người thắng chưa trả tiền, thì sâm panh này ai trả?"
- Gloss: Hold on, if the winner hasn't paid, then who pays for this champagne?
- Spine link: 4. Viewer must get: Freeze. The bill arrives. Everyone points at someone else.
- In: hold. Out: dissolve 8 f (to the café, golden).
- Set: hall. Light: day.
- Build: reuse the table; the waiter with a leather bill folder (HÓA ĐƠN · SÂM PANH x4).
- Blocking: Waiter walks in from frame right (waiter_in) f1310-1336 to the waiter mark at the table's end.
  - waiter at [3.45, 1.78], front; walks in, slides the bill f1336-1356; smile.
- Action, against the words: f1285 'Khoan đã': the music cuts; everyone freezes mid-laugh (the one stillness, 10 f); f1336-1356 the waiter slides the folder onto the table's right end (bill mark), opens it; f1360-1385 collectors' eyes go to the bill; f1391 'ai trả?' (f1393): all four point at another collector with their right arm (c1 -> c2, c2 -> c3, c3 -> c4, c4 -> c1).
- Acting: Collectors: laugh -> frozen -> nervous; the waiter: polite smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1283 | open | [2.55, 2.05, 5.2] | [2.55, 1.25, 1] | 54 | 0.05 | 0 | the freeze |
| 1330 | glide 30 f | [3.35, 1.9, 4.7] | [3.35, 1.2, 1.3] | 46 | 0.06 | 0 | the waiter and the bill |
| 1376 | glide 18 f | [2.55, 2, 5] | [2.55, 1.25, 1] | 54 | 0.06 | 0 | everyone points |

- Kicks (7 f): none.
- Physics & FX: the folder: slides 30 cm, stops; opens on its spine.
- Light & mood: the party light stays; the music drops out.
- Sound: music cut + record stop f1285; Huh (meme) f1287; a paper slide f1340; Suspicious Sound (meme) f1393.
- After-state: The bill lies open on the table; corks on the floor.

### S10 · 0:47.1-0:51.7 · f1412-f1550 · "Bạn thấy đấy, giá đấu giá giống câu "mai tao trả" của thằng bạn vay tiền."
- Gloss: You see, an auction price is like 'I'll pay you tomorrow' from a friend who borrowed money.
- Spine link: 5. Viewer must get: A friend pockets borrowed cash and slides over a promise, a ghost note.
- In: dissolve 8 f. Out: hold.
- Set: cafe. Light: day.
- Build: new: the café terrace, round table, two coffees; a fan of banknotes; the IOU note (ghost purple, see-through).
- Blocking: Borrower seated at the borrower mark (screen left), lender at the lender mark; both face +z.
  - borrower at [-0.48, -0.95], front; seated; cash fan, tucks it, slides the IOU f1490-1508; grin.
  - lender at [0.48, -0.95], front; seated; stern.
- Action, against the words: f1412-1468 the borrower fans the cash and grins; f1470-1484 he tucks it into his hoodie; f1490-1508 his left arm slides the IOU 'MAI TAO TRẢ' across to the middle on 'mai tao trả' (f1495-1510): it is see-through purple and hovers 2 cm above the table, wobbling like a ghost; f1520-1550 push onto the note.
- Acting: Borrower: big grin; lender: flat, unconvinced.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1412 | open | [0, 1.6, 3.6] | [0, 1.4, -1] | 46 | 0.06 | 0 | the café, the two friends, the sky |
| 1500 | glide 30 f | [0, 2.1, 1.5] | [0, 0.85, -0.7] | 44 | 0.06 | 0 | the ghost note between them |

- Kicks (7 f): none.
- Physics & FX: the note: kinematic slide, then a ghost hover (2 cm, 1 Hz bob).
- Light & mood: golden late afternoon, long warm light.
- Sound: street ambience, a café clink; a calm guitar-like pluck theme; a paper slide f1490; a ghostly 'ooo' (soft) f1508.
- After-state: The ghost note sits between them.

### S11 ★ · 0:51.7-0:57.6 · f1550-f1728 · "Nghe rất to, rất chắc, nhưng phải đến khi tiền thật sự chuyển đi, lời hứa mới thành giá thật."
- Gloss: It sounds very loud, very sure, but only when the money actually moves does the promise become a real price.
- Spine link: 5. Viewer must get: Loud and sure means nothing; the money crosses the table and the promise turns real.
- In: hold. Out: dissolve 8 f (to the writer at night).
- Set: cafe. Light: day.
- Build: new: a red megaphone (held), the cash envelope; the green ĐÃ TRẢ stamp.
- Blocking: As S10.
  - borrower at [-0.48, -0.95], front; megaphone f1553-1580, thump f1590, envelope f1636-1668; grin -> earnest.
  - lender at [0.48, -0.95], front; seated; leans back f1560; takes the envelope; stern -> smile.
- Action, against the words: f1548-1553 he lifts the megaphone; f1555-1580 'rất to': he shouts into it: sound rings burst from the bell, the two cups hop 2 cm and rattle, the lender leans back; f1586-1590 'rất chắc': he slams the table with his right arm (contact f1590): cups hop again, the ghost note just wobbles (no weight); f1636-1668 'tiền thật sự chuyển đi': his left arm slides the fat cash envelope across the table to the lender's side (45 cm), it stops at her arm; f1675-1700 'lời hứa': the note settles flat onto the table and fills from see-through purple to solid white paper; f1707 the green stamp ĐÃ TRẢ thunks onto it on 'giá thật' (f1709); the lender smiles.
- Acting: Borrower: loud grin -> earnest; lender: stern -> smile at the stamp.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1550 | open | [0, 1.6, 3.2] | [0, 1.15, -0.9] | 44 | 0.08 (punch 0.3 for 10 f) | 0 | the megaphone, the thump |
| 1628 | glide 22 f | [0, 2.2, 0.9] | [0, 0.76, -0.7] | 40 | 0.06 | 0 | the envelope crosses the table |
| 1680 | glide 22 f | [0, 1.5, -0.1] | [0, 0.745, -0.6] | 30 | 0.08 | 0 | the promise turns real |

- Kicks (7 f): f1590 strength 0.7; f1707 strength 0.5.
- Physics & FX: cups: hop 2 cm (rattle) on each shout pulse and on the thump; the envelope: a kinematic slide with friction, stops dead.
- Light & mood: golden.
- Sound: megaphone feedback + a distorted shout bed f1555-1580 (under the VO); a table thump f1590 with a cup rattle; an envelope slide f1640; a solid paper 'fwump' f1690; Kaching (meme) on the stamp f1707.
- After-state: The note is solid with ĐÃ TRẢ; the envelope is on her side.

### S12 · 0:57.6-1:05.2 · f1728-f1957 · "Ngay trên sàn này, một trang tin vừa phát hiện hàng triệu đô kết quả Pokémon đã lặng lẽ biến khỏi lịch sử bán, vì không nhận được tiền."
- Gloss: On this very platform, a news site just discovered millions of dollars of Pokémon results had quietly disappeared from the sales history, because the money never came.
- Spine link: 6. Viewer must get: A writer watches sale after sale ghost off the sales history; the missing total climbs into the millions.
- In: dissolve 8 f. Out: dissolve 8 f (back to the hall).
- Set: desk. Light: day.
- Build: new: the writer's desk at night (laptop, lamp, mug); the laptop page FANATICS COLLECT · LỊCH SỬ BÁN: 8 rows (real card thumbnails, price, date, ĐÃ BÁN), a counter 'ĐÃ BIẾN MẤT'.
- Blocking: Writer seated at the writer mark facing +z, lit by the screen.
  - writer at [0, -1.5], front; seated at the desk; neutral -> shock.
- Action, against the words: f1728-1790 the writer leans in to the laptop; f1790 cut to his POV; f1840-1945 'lặng lẽ biến khỏi lịch sử bán': rows 2, 5, 3, 7, 6 turn purple see-through and float up off the page one after another (every 16 f), each leaving a grey line KHÔNG NHẬN ĐƯỢC TIỀN on 'vì không nhận được tiền' (f1913); the counter at the bottom climbs $0 -> $3,4xx,xxx ('hàng triệu đô' f1804).
- Acting: Writer: focused -> shock (f1810).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1728 | open | [0.15, 1.5, 2.3] | [0, 1, -1.5] | 46 | 0.06 | 0 | the writer at his desk, night window |
| 1790 | cut | [0.19, 1.17, -1.21] | [0.532, 0.879, -0.608] | 34 | 0.06 | 0 | his laptop, from his eyes |

- Kicks (7 f): none.
- Physics & FX: none (screen content).
- Light & mood: night: the room dim, the screen glow.
- Sound: keyboard clicks; a soft 'whoosh' per ghosted row; Computer Error Sound (meme) on 'không nhận được tiền' f1913; a low drone.
- After-state: The page has five grey gaps.

### S13 · 1:05.2-1:08.3 · f1957-f2048 · "Fanatics nói làm vậy để thông tin thị trường được chính xác."
- Gloss: Fanatics says it does this so the market information is accurate.
- Spine link: 6. Viewer must get: The spokesman blanks the price board: accurate.
- In: dissolve 8 f. Out: glide.
- Set: hall. Light: day.
- Build: reuse the rostrum and the price board; a big green button on the rostrum; a CHÍNH XÁC lamp under the board.
- Blocking: Spokesman behind the rostrum (auct mark), facing +z.
  - spokes at [-1.35, -3.05], front; talks; presses the button f2030; smile.
- Action, against the words: f1957-2020 the board shows $576,000 SOLD; the spokesman talks; f2026-2030 his right arm presses the button (contact f2030, 2 f before 'chính xác' f2032): the board clears to '—', the CHÍNH XÁC lamp lights green; he smiles.
- Acting: Spokesman: practised smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1957 | open | [-0.9, 1.7, 1.6] | [-0.9, 1.7, -3.5] | 46 | 0.06 | 0 | the spokesman under the board |

- Kicks (7 f): f2030 strength 0.4.
- Physics & FX: the button: 1 cm press.
- Light & mood: warm hall.
- Sound: a button clunk f2030, the board's clack and a clean 'ding' f2032.
- After-state: The board is blank; CHÍNH XÁC lit.

### S14 · 1:08.3-1:17.5 · f2048-f2326 · "Nên bây giờ, mỗi khi thấy một con số khổng lồ, dân sưu tầm làm thêm một việc trước khi mở sâm panh: mở trang lịch sử bán, và tìm hai chữ, đã trả."
- Gloss: So now, whenever they see a giant number, collectors do one more thing before popping the champagne: open the sales history page and look for two words: paid.
- Spine link: 7. Viewer must get: A collector sees a giant number, stops before popping, checks the sales history for ĐÃ TRẢ, then pops.
- In: glide. Out: dissolve 8 f.
- Set: hall. Light: day.
- Build: reuse the champagne table (the corks still on the floor, empty coupes); c1 (green hoodie) with a bottle and his phone (canvas: FANATICS COLLECT · LỊCH SỬ BÁN, a row with a green ĐÃ TRẢ badge).
- Blocking: c1 behind the table at c1_late, facing +z.
  - c1 at [2, 0.75], front; bottle up f2130, down f2190, phone f2206, pop f2312; grin -> neutral -> grin.
- Action, against the words: f2100 the price board (behind him, far) flips to $1,000,000 on 'con số khổng lồ' (f2107-2123); f2130-2150 he raises the bottle to pop; f2183-2200 'trước khi mở sâm panh' he stops and sets it on the table; f2206-2220 his left arm brings up his phone; f2222-2296 his POV: the sales history page, he scrolls to the $1,000,000 row and finds the green ĐÃ TRẢ badge stamping on at f2294 ('đã trả'); f2298-2310 back out; f2312 he pops the cork (contact f2312): it flies, foam, it lands by the old corks.
- Acting: c1: excited -> thoughtful -> grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2048 | open | [2.9, 1.55, 4.7] | [1, 2, -1.2] | 50 | 0.06 | 0 | him and the big board |
| 2134 | glide 24 f | [2.3, 1.6, 3.8] | [2, 1.3, 0.75] | 44 | 0.06 | 0 | the bottle held |
| 2210 | cut | [2, 1.6, 0.84] | [2.06, 1.28, 1.02] | 30 | 0.06 | 0 | his phone, from his eyes |
| 2298 | glide 12 f | [2.25, 1.6, 3.6] | [2, 1.35, 0.75] | 44 | 0.06 | 0 | the pop |

- Kicks (7 f): f2312 strength 0.6.
- Physics & FX: the cork as in S08.
- Light & mood: warm, the party over.
- Sound: a ka-ching f2104 (the giant number); a hesitant pluck f2186; phone taps; Mobile Payment (meme) on ĐÃ TRẢ f2294; a pop + fizz f2312.
- After-state: Five corks on the floor.

### S15 · 1:17.5-1:20.7 · f2326-f2420 · "Còn Gengar, vẫn đang cười."
- Gloss: And Gengar is still grinning.
- Spine link: 7. Viewer must get: The Gengar slab alone at night, its printed grin; the ghost tag drifts by.
- In: dissolve 8 f (later: the hall after closing). Out: end.
- Set: hall. Light: day.
- Build: reuse the plinth: the Gengar slab back on the easel (it came back unpaid), the empty tag string; a spotlight; the ghost tag.
- Blocking: Nobody.
- Action, against the words: f2326-2420 slow push into the card's art (Gengar's grin); f2340-2405 the ghost tag drifts across behind the slab from left to right, fading; end on the grin.
- Acting: none (the card's own grin).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2326 | open | [-0.33, 1.47, -1.8] | [-0.35, 1.45, -2.76] | 30 | 0.15 | 0 | Gengar, still grinning |

- Kicks (7 f): none.
- Physics & FX: the ghost: no gravity, sine drift.
- Light & mood: night: the hall dark, one spotlight on the plinth.
- Sound: Hehe Boiiiiiii (meme, soft) f2384; the theme's last note.
- After-state: End on the grin.

