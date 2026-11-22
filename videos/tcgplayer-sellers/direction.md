# TCGplayer: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/tcgplayer-sellers/plan.json` (0 errors, 0 warnings).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2360 frames (VO ends f2330). Six separate interiors/places (workroom, HQ office, Syracuse front, market hall, card shop, boardroom); places change by dissolve or a punch cut.

## Tone
A business story as a comedy of manners: dry sight gags, a few meme sounds where the sound is the joke. No likenesses of real people; the shop owner's message is the VO's paraphrase. Screens are only seen from their owner's side (his laptop over his shoulder, the shop owner's phone from his eyes); the wall TV and the GMV board are wall screens.

## Transitions
Hard cuts: S05 (the cake refused) and S12 ("Khoan"); plus the S07 reaction cut inside the scene. Dissolves for every change of place/time.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f354 | f412 | 10 · 2026 |
| f904 | f962 | 05 · 2025 |
| f1006 | f1060 | 200+ |
| f1704 | f1764 | 11 · 2026 |
| f1832 | f1886 | RON JAIVEN |
| f2050 | f2100 | SOUTH DAKOTA |
| f2113 | f2160 | 50 |

## Sets

### home
- Origin in the shared world: [0, 0, 0]. Axes: the seller sits behind his packing table facing +z (the lens); the wall TV on the back wall z -2.4 behind him.
- Light: day; sun az/el [-40, 35]. Open camera sides: +z.
- Marks [x, z]: seller [0, -1.5].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: workroom x -2.4..2.4, z -2.4..2.4, 2.6 m, sage walls, wood floor, ceiling (no shadows), window in the -x wall | [0, 1.3, 0] | [4.8, 2.6, 4.8] |
| table | new: packing table, birch top y 0.76 on four legs, x -0.9..0.9, z -1.22..-0.52; bubble mailers and top loaders on it | [0, 0.38, -0.87] | [1.8, 0.76, 0.7] |
| laptop | new: laptop 34 x 24 cm base, screen 34 x 21.5 cm (canvas: the TCGplayer page) facing the seller, tilted back 15 deg | [0.12, 0.76, -0.85] | [0.34, 0.24, 0.24] |
| tv | new: wall TV 110 x 62 cm (canvas: business news, the GMV counter), black bezel | [0, 1.78, -2.37] | [1.1, 0.62, 0.04] |
| envelope | new: kraft envelope 22 x 11 cm addressed CO QUAN LIEN BANG; rubber stamp (wood knob, red rubber) beside it; the stamp prints XIN ĐIỀU TRA | [-0.22, 0.76, -1.06] | [0.22, 0.004, 0.11] |
| coins | new: a stack of 10 gold coins (r 1.6 cm, 3 mm) = a sale's takings | [0.27, 0.76, -1.08] | [0.032, 0.03, 0.032] |
| jar | new: glass jar r 6 cm, 13 cm, paper label PHÍ, coins drop in | [0.6, 0.76, -0.98] | [0.12, 0.13, 0.12] |
| bot | new: his third-party price scanner: grey box 14 x 6 x 10 cm with a tilted top screen (canvas: PRICE BOT, then BỊ CHẶN in red) | [-0.55, 0.76, -0.98] | [0.14, 0.06, 0.1] |
| cake | new: (S05) an open white cake box labelled eBay and a slice of sponge cake on a paper plate in front of him | [-0.02, 0.76, -1.05] | [0.16, 0.06, 0.16] |
| shelves | new: shelves of card boxes and binders on the back wall (x 1.0..2.3) | [1.65, 1.3, -2.25] | [1.3, 1.8, 0.3] |

### hq
- Origin in the shared world: [40, 0, 0]. Axes: the GMV board on the back wall z -3.0 under an eBay sign; the boss's desk in front of it; the window on the night city at +x.
- Light: day; sun az/el [30, 40]. Open camera sides: +z.
- Marks [x, z]: rob_desk [-0.4, -2.42]; rob_lever [0.72, -2.5]; rob_cake [0.98, -2.45].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: glass-and-oak office x -3..3, z -3..3, 3.4 m, slate walls, grey carpet, ceiling with light panels | [0, 1.7, 0] | [6, 3.4, 6] |
| board | new: split-flap counter board 140 x 100 cm (canvas: GMV 12 THÁNG and a 10-digit dollar count), steel frame; a red-knob lever on its right side that pulls down | [-0.4, 2, -2.94] | [1.4, 1, 0.06] |
| ebay | new: big letter sign eBay (plain lettering, four colours) above the board; a smaller plate TCGplayer hangs from it on two chains | [-0.4, 2.98, -2.95] | [1, 0.32, 0.04] |
| window | new: window 140 x 160 cm on the night city (canvas: skyline, a white dome = the federal building, fireworks, paper planes) | [1.45, 1.8, -3] | [1.4, 1.6, 0.02] |
| desk | new: oak desk top y 0.76, x -1.1..0.3, z -2.15..-1.55; nameplate (canvas) at the front; letter stack, stamp pad, a program document | [-0.4, 0.38, -1.85] | [1.4, 0.76, 0.6] |
| chair | new: black executive chair behind the desk | [-0.4, 0.5, -2.5] | [0.6, 1.1, 0.6] |
| cake | new: side table with a two-tier party cake (white icing, red trim) and a cake knife (S03-S04 only) | [1.25, 0.8, -2.5] | [0.34, 0.24, 0.34] |

### syr
- Origin in the shared world: [80, 0, 0]. Axes: the building front at z -1.0 faces +z (the street); the grading room behind it; the lens on the street.
- Light: day; sun az/el [35, 30]. Open camera sides: +z.
- Marks [x, z]: w1 [-0.95, -2.45]; w2 [0, -2.45]; w3 [0.95, -2.45].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| front | new: brick front 8 m wide x 4.5 m, door opening x -1.4..1.4 up to 2.8 m; sign SYRACUSE · AUTHENTICATION CENTER above it; UNION poster on the left | [0, 2.25, -1.05] | [8, 4.5, 0.2] |
| shutter | new: ribbed steel roller shutter in the opening, rolls down f972-994 from its drum above the door | [0, 1.4, -0.92] | [2.8, 2.8, 0.04] |
| grading | new: grading room z -1..-5: three benches top y 0.86 with lamps, loupes and card trays; lit ceiling panels; a ceiling | [0, 1.4, -3] | [6, 2.8, 4] |
| street | new: pavement and asphalt in front, a kerb, a lamp post | [0, 0, 3] | [12, 0.1, 8] |

### market
- Origin in the shared world: [120, 0, 0]. Axes: two stalls along x facing +z; the seller sits behind his stall; buyers walk in front (z ~ 0).
- Light: golden; sun az/el [-35, 30]. Open camera sides: +z.
- Marks [x, z]: seller [-0.8, -1.55]; buyer [-0.65, -0.05].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| hall | new: covered market hall x -4..4, z -3..3, 3.6 m, cream walls, tiled floor, ceiling with warm lamps, bunting | [0, 1.8, 0] | [8, 3.6, 6] |
| stall | new: his stall: table x -1.4..-0.2, z -1.25..-0.6, top y 0.8, striped awning on two posts, sign SẠP CỦA BẠN; cards on tilted stands; a coin tin; his small brass pack scale | [-0.8, 0.4, -0.92] | [1.2, 0.8, 0.65] |
| twin | new: the twin stall (identical, sign BAN QUẢN LÝ, same cards) on four castors, rolls in from x 3.4 to 0.6 | [0.6, 0.4, -0.92] | [1.2, 0.8, 0.65] |

### shop
- Origin in the shared world: [160, 0, 0]. Axes: the counter faces +z; the owner stands behind it.
- Light: golden; sun az/el [-30, 30]. Open camera sides: +z.
- Marks [x, z]: owner [0, -1.4].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: small card shop x -2.4..2.4, z -2.4..2.4, 2.7 m, warm walls, shelves of sealed product, sign CARD SHOP · SOUTH DAKOTA | [0, 1.35, 0] | [4.8, 2.7, 4.8] |
| counter | new: glass-top counter x -1..1, z -1..-0.5, top y 1.0, cards in the case | [0, 0.5, -0.75] | [2, 1, 0.5] |
| phone | new: his phone 7.5 x 15.5 cm (canvas: a chat message typed and sent), seen only from his side | [0, 1.22, -1.12] | [0.075, 0.155, 0.01] |

### board
- Origin in the shared world: [200, 0, 0]. Axes: the long table runs along z; the boss at the head (far end, z -3.0) facing +z; the seller at the near end.
- Light: day; sun az/el [25, 40]. Open camera sides: +z.
- Marks [x, z]: ron [0, -3]; seller [0.05, 1.15].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: boardroom x -2.5..2.5, z -3.5..3, 3 m, dark wood panels, ceiling, the GMV board on the back wall | [0, 1.5, 0] | [5, 3, 6.5] |
| table | new: long table x -0.6..0.6, z -2.6..0.4, top y 0.75; five leather chairs, every one taken | [0, 0.375, -1.1] | [1.2, 0.75, 3] |
| sack | new: a canvas money sack 40 x 45 cm with a $ print, drops onto the table | [0, 0.75, -1.3] | [0.4, 0.45, 0.35] |

## Cast

- **seller:** mustard sweater, brown hair, glasses. Items: party popper, stamp, paper planes. Views: front, seated, front, standing (S16).
- **rob:** navy suit, red tie, grey hair. Items: stamp, cake knife, bag (market), brass scale (market). Views: front, side walking.
- **ron:** charcoal suit, blue tie, dark hair. Items: none. Views: front, side walking.
- **grader:** blue work shirt with UNION on the chest, dark trousers. Items: cardboard box. Views: front.
- **buyer:** purple jacket, cap. Items: none. Views: front.
- **owner:** red flannel, cap. Items: phone. Views: front.
- **vip:** stout, dark suit, gold tie, VIP on the chest. Items: none. Views: front, seated.

## Scenes

### S01 ★ · 0:00.0-0:05.9 · f0-f177 · "Một sàn thẻ bài vừa kiếm được một tỷ đô, và người bán trên đó ăn mừng bằng cách nhờ chính phủ điều tra nó."
- Gloss: A card marketplace just made a billion dollars, and its sellers celebrate by asking the government to investigate it.
- Spine link: 1. Viewer must get: Big money upstairs; down here a seller 'celebrates' with an investigation request.
- In: open on the act. Out: glide (the camera drops from the envelope over his shoulder onto the laptop).
- Set: home. Light: day.
- Build: new: the workroom, packing table, wall TV with the counter, envelope and rubber stamp, party popper.
- Blocking: Seller seated at his mark facing +z, the stamp raised in his right hand (screen left) from f0; the popper in his left hand.
  - seller at [0, -1.5], front; seated; popper f101, stamp slam f144; smile -> stern.
- Action, against the words: f0-46 the TV counter rolls $999,999,9xx -> $1,000,000,000, landing on 'một tỷ đô' (f46); f96-101 he lifts the popper and pulls it on 'ăn mừng' (f101): a burst and 40 confetti bits fall over the table by f135 and stay; f136-142 wind-up of the stamp (held f139-142); f144 the stamp slams on the envelope 2 f before 'điều tra' (f146): XIN ĐIỀU TRA in red appears on it; he lifts the stamp f150-160.
- Acting: Deadpan party: a flat smile on the popper, a stern face on the stamp.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [0.3, 1.32, 1.05] | [-0.02, 1.2, -1.6] | 40 | 0.18 | 6 | the seller under the TV |
| 114 | glide 30 f | [-0.05, 1.18, -0.28] | [-0.2, 0.84, -1.06] | 32 | 0.3 (punch 0.8 for 14 f) | 10 | push onto the stamp |

- Kicks (7 f): f144 strength 1.
- Physics & FX: confetti: 40 paper bits (0.3 g) launched in a cone from the popper, drift down with air drag and side flutter, lie flat on the table and floor and stay. Stamp: 4 f wind-up, held, 1 f strike, 2 f squash.
- Light & mood: warm day from the window (-x); the TV glow.
- Sound: TV news sting under the counter f0-46, a ka-ching f46; popper bang f101, confetti rustle; stamp thump f144; light comedic pizzicato underscore.
- After-state: Confetti on the table; the stamped envelope lies there.

### S02 · 0:05.9-0:11.7 · f177-f352 · "Sàn đó là TCGplayer, chợ mua bán thẻ Magic và Pokémon, con cưng của eBay."
- Gloss: That marketplace is TCGplayer, the market for Magic and Pokémon cards, eBay's darling.
- Spine link: 1. Viewer must get: What TCGplayer is: a big online card market, owned by eBay.
- In: glide. Out: dissolve 8 f (push into the 'an eBay company' badge, dissolve to the eBay sign at HQ).
- Set: home. Light: day.
- Build: reuse the laptop: the TCGplayer page: header TCGplayer, a grid of 8 real card tiles (4 Magic Alpha, 4 Pokémon Base Set) with prices; a badge 'an eBay company ♥'.
- Blocking: Seller off frame (POV over his shoulder).
- Action, against the words: f205 the page header TCGplayer lights on the name; f273 the four Magic tiles pop in on 'Magic' (one every 3 f); f292 the four Pokémon tiles on 'Pokémon'; f312 the badge 'an eBay company ♥' slides in on 'con cưng'; f330-352 push into the badge.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 177 | open | [0.1, 1.24, -1.42] | [0.12, 0.885, -0.72] | 26 | 0.15 | 8 | his laptop, from his eyes |
| 318 | glide 34 f | [0.11, 1.1, -1.18] | [0.12, 0.92, -0.72] | 22 | 0.4 | 8 | push into the eBay badge |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: day; the screen glow.
- Sound: soft clicks per tile pop f273-302; a little 'aww' chime on 'con cưng' f312.
- After-state: The page is full.

### S03 · 0:11.7-0:16.9 · f352-f508 · "Tháng mười, eBay khoe: tổng giao dịch mười hai tháng qua lần đầu vượt một tỷ đô."
- Gloss: In October eBay bragged: total transactions over the past twelve months passed one billion dollars for the first time.
- Spine link: 1. Viewer must get: The boss pulls the lever and the board lands on a billion.
- In: dissolve 8 f. Out: glide.
- Set: hq. Light: day.
- Build: new: the HQ office: GMV board with lever, eBay sign and TCGplayer plate, desk, chair, cake table, window on the night city.
- Blocking: Rob stands at rob_lever facing +z, his right arm (screen left) on the lever knob.
  - rob at [0.72, -2.5], front; standing; pulls the lever f386-392; arm spreads f482; grin.
- Action, against the words: f352-385 the board reads $987,000,000 (GMV 12 THÁNG); f386-392 he grips and pulls the lever down on 'khoe' (f389): the lever swings 50 deg; f392-479 the flaps spin, the count climbs; f480 they land on $1,000,000,000 on 'một tỷ đô' (f479-493): every flap snaps, a small dust puff off the board top; he grins and spreads his free arm.
- Acting: Proud grin, chin up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 352 | open | [0.5, 1.6, 1.6] | [0, 1.85, -2.7] | 46 | 0.15 | 4 | the board, the boss |
| 440 | glide 40 f | [0.25, 1.55, 0.6] | [-0.2, 1.85, -2.8] | 42 | 0.3 (punch 0.7 for 16 f) | 6 | push on the count |

- Kicks (7 f): f480 strength 0.6.
- Physics & FX: the lever: a damped swing to its stop (3 deg overshoot, settles in 8 f).
- Light & mood: night office, cool panels, warm board glow.
- Sound: lever clunk f389; split-flap clatter f392-479; ka-ching f480.
- After-state: The board reads $1,000,000,000.

### S04 · 0:16.9-0:18.7 · f508-f560 · "Pháo hoa. Bánh kem."
- Gloss: Fireworks. Cake.
- Spine link: 2. Viewer must get: They party.
- In: glide. Out: cut.
- Set: hq. Light: day.
- Build: reuse the HQ window (fireworks drawn on the night sky) and the cake table.
- Blocking: Rob steps from rob_lever to rob_cake (f510-524), knife in his left arm (screen right).
  - rob at [0.98, -2.45], front; steps to the cake, cuts it f540; grin.
- Action, against the words: f508-534 three fireworks bloom in the window on 'Pháo hoa' (f508, f515, f522); f536-542 he raises the knife and cuts into the cake on 'Bánh kem' (f540): the knife goes in, a slice wedge tips out 2 cm.
- Acting: Grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 508 | open | [1.25, 1.6, 0.9] | [1.35, 1.55, -2.7] | 44 | 0.2 | 4 | the window, the cake |

- Kicks (7 f): none.
- Physics & FX: the slice wedge tips 8 deg and stops.
- Light & mood: the firework colours flash on the room (window glow).
- Sound: three firework pops and crackles f508-534; a party horn f540.
- After-state: The cake is cut.

### S05 · 0:18.7-0:20.5 · f560-f616 · "Người bán thì không ai ăn bánh."
- Gloss: The sellers? Not one of them eats the cake.
- Spine link: 2. Viewer must get: He pushes the slice away.
- In: cut. Out: glide.
- Set: home. Light: day.
- Build: reuse the workroom: an open cake box (eBay on the lid) and a slice on a paper plate in front of him.
- Blocking: Seller seated at his mark, arms down.
  - seller at [0, -1.5], front; seated; pushes the plate f596-606; stern.
- Action, against the words: Hard cut on 'Người bán' (f560); f596-606 his right arm pushes the plate 18 cm away from him on 'ăn bánh' (f604-608); the plate skids and stops; his arm returns.
- Acting: Stern, unimpressed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 560 | open | [0.25, 1.22, 0.55] | [0, 1.05, -1.3] | 36 | 0.2 | 8 | the seller and the slice |

- Kicks (7 f): none.
- Physics & FX: the plate: kinematic slide 18 cm, decelerating (friction), stops dead.
- Light & mood: day.
- Sound: music cuts out on the cut; a plate scrape f600; a 'bruh' f610.
- After-state: The plate sits pushed away, untouched.

### S06 · 0:20.5-0:23.8 · f616-f715 · "Họ kêu phí cao. Kêu bị hạn chế công cụ bên thứ ba."
- Gloss: They complain about high fees. About being restricted from third-party tools.
- Spine link: 2. Viewer must get: Fees take his coins; his own tool gets blocked.
- In: glide. Out: glide.
- Set: home. Light: day.
- Build: reuse the coin stack, the PHÍ jar and the price scanner.
- Blocking: Seller seated at his mark.
  - seller at [0, -1.5], front; seated; stern -> pained.
- Action, against the words: f630-650 three coins hop one by one off the top of his stack into the PHÍ jar on 'phí cao' (f636, f641, f646): each arcs 25 cm, clinks in; f680-704 the scanner screen flips from PRICE BOT (green) to BỊ CHẶN (red) on 'hạn chế' (f672) with a red flash; it powers down on 'thứ ba' (f700).
- Acting: Eyes follow the coins; a pained look at the scanner.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 616 | open | [0.45, 1.5, 0.65] | [0.4, 0.84, -1.02] | 40 | 0.15 | 6 | the table from above his eye line |
| 662 | glide 36 f | [-0.3, 1.45, 0.5] | [-0.45, 0.86, -1] | 38 | 0.2 | 8 | to the scanner |

- Kicks (7 f): none.
- Physics & FX: coins: three ballistic hops (12 f each, 0.25 m apex), land in the jar and stay; the stack is 3 coins shorter.
- Light & mood: day.
- Sound: three coin clinks f636, f641, f646; an error buzz f672; power-down blip f700.
- After-state: Seven coins left; three in the jar; the scanner dark.

### S07 ★ · 0:23.8-0:30.0 · f715-f900 · "Và kêu một chuyện nghe như phim hài: chính TCGplayer mở gian hàng riêng, bán đè lên họ."
- Gloss: And complain about something that sounds like a comedy: TCGplayer itself opened its own shop, selling right on top of them.
- Spine link: 2. Viewer must get: The platform's own listing lands on top of his.
- In: glide. Out: dissolve 8 f.
- Set: home. Light: day.
- Build: hard cut to his face for the reaction (cut 3 of 3). reuse the laptop page: his listing (the real Base Set Charizard, $350, seller thecardnook); the Direct listing (same card, $339, a blue TCGplayer Direct seal).
- Blocking: Seller seated (POV over his shoulder, then the front for his reaction).
  - seller at [0, -1.5], front; seated; neutral -> shock (gape).
- Action, against the words: f730-800 his listing on the page, ranked #1; f820-844 the Direct listing appears above the page top on 'mở gian hàng riêng' and starts dropping; f866 it slams onto his listing on 'đè' (f866): his tile is shoved down and greys (#2); a dust puff from the tile edges; f872 hard cut to the front: his jaw drops (gape 0.6).
- Acting: Disbelief.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 715 | open | [0.1, 1.24, -1.42] | [0.12, 0.885, -0.72] | 24 | 0.15 | 8 | his listing |
| 872 | cut | [0.2, 1.4, -0.15] | [0, 1.38, -1.5] | 34 | 0.3 | 10 | his face |

- Kicks (7 f): f866 strength 1.
- Physics & FX: the Direct tile: drops with gravity (accelerating) and stops dead with 2 f of squash; his tile is shoved 40 % down and stays.
- Light & mood: day.
- Sound: a sitcom laugh track on 'phim hài' f765; a falling whistle f844-864; a slam f866.
- After-state: His listing sits under the Direct listing.

### S08 · 0:30.0-0:35.6 · f900-f1069 · "Tháng năm năm ngoái, trung tâm kiểm định ở Syracuse đóng cửa, hơn hai trăm công nhân có công đoàn mất việc."
- Gloss: In May last year the authentication center in Syracuse closed, and more than two hundred unionized workers lost their jobs.
- Spine link: 3. Viewer must get: A grading center shuts; the workers walk out with their boxes.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: syr. Light: day.
- Build: new: the Syracuse building front with the open roller door onto the lit grading room.
- Blocking: Three graders at their benches (w1-w3) at f900; they walk out (front stroll, toward the lens) to workers_out f936-968, each carrying a cardboard box.
  - grader at [-0.95, -2.45], front; at the bench, then walks out with a box; neutral -> sad.
  - grader at [0, -2.45], front; at the bench, then walks out with a box; neutral -> sad.
  - grader at [0.95, -2.45], front; at the bench, then walks out with a box; neutral -> sad.
- Action, against the words: f900-930 they work at the benches under the lamps; f932 they pick up their boxes; f936-968 they walk out through the door; f972-994 the shutter rolls down behind them on 'đóng cửa' (f976); the room light is gone; f1050 they look down on 'mất việc'.
- Acting: Neutral at work, sad outside.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 900 | open | [0.1, 1.65, 5.6] | [0, 1.55, -1.6] | 46 | 0.15 | 3 | the building, the open door |

- Kicks (7 f): f994 strength 0.4.
- Physics & FX: shutter: rolls down at 0.13 m/f, the bottom bar hits the ground f994 and bounces 1 cm.
- Light & mood: overcast day outside; the room lit warm until the shutter closes.
- Sound: street ambience; the shutter rattles down f972-994 and clangs; a sad low note f1050.
- After-state: The shutter is down; three people with boxes outside.

### S09 · 0:35.6-0:36.7 · f1069-f1100 · "Người bán gửi thư"
- Gloss: The sellers sent letters
- Spine link: 3. Viewer must get: He sends a letter flying.
- In: dissolve 8 f. Out: dissolve 6 f (follow the plane out of the window into the HQ window).
- Set: home. Light: day.
- Build: reuse the workroom: a paper plane folded from his letter.
- Blocking: Seller seated at his mark.
  - seller at [0, -1.5], front; throws the plane f1087; stern.
- Action, against the words: f1069-1084 he holds the paper plane up (right arm); f1087 throws it on 'gửi' (f1089): it flies off toward the window (-x) and out.
- Acting: Determined.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1069 | open | [0.55, 1.35, 0.95] | [-0.25, 1.3, -1.4] | 40 | 0.2 | 6 | the throw |

- Kicks (7 f): none.
- Physics & FX: the plane: a glide path, 2.4 m/s, slight climb and roll.
- Light & mood: day.
- Sound: paper whoosh f1087.
- After-state: The plane is gone.

### S10 · 0:36.7-0:39.4 · f1100-f1183 · "lên tổng giám đốc, rồi lên tận cơ quan liên bang."
- Gloss: up to the CEO, then all the way to the federal agency.
- Spine link: 3. Viewer must get: One letter lands on the boss's desk; another flies on to the federal building.
- In: dissolve 6 f. Out: glide.
- Set: hq. Light: day.
- Build: reuse the HQ office; the window now open (the lower pane tilted in); the window canvas draws plane 2 flying to the dome.
- Blocking: Rob seated at his desk (rob_desk).
  - rob at [-0.4, -2.42], front; seated; shock -> stern.
- Action, against the words: f1100-1117 plane 1 glides in from the window and lands on his desk on 'đốc' (f1117), skids to the letter stack; f1124-1140 plane 2 flies past the window outside; f1140-1166 on the canvas it shrinks toward the white dome on 'liên bang' (f1156).
- Acting: Rob: surprised, then annoyed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1100 | open | [0.5, 1.6, 2.3] | [0.45, 1.45, -2.6] | 46 | 0.06 | 4 | desk and window |

- Kicks (7 f): none.
- Physics & FX: plane 1: glides down at 2 m/s, touches the desk, skids 20 cm and stops.
- Light & mood: night office.
- Sound: paper swish f1110; a soft tap on the desk f1117; distant whoosh f1140.
- After-state: A paper plane lies on his desk.

### S11 · 0:39.4-0:43.2 · f1183-f1297 · "TCGplayer bác bỏ nhiều cáo buộc, và đã sửa vài chương trình."
- Gloss: TCGplayer rejected many of the allegations, and fixed a few programs.
- Spine link: 3. Viewer must get: Stamped: rejected, rejected; one program: fixed.
- In: glide. Out: cut.
- Set: hq. Light: day.
- Build: reuse the desk: the letter stack (top letter shows a growing red BÁC BỎ), the program sheet DIRECT that gets a green ĐÃ SỬA.
- Blocking: Rob seated at his desk, the stamp in his right arm (screen left).
  - rob at [-0.4, -2.42], front; seated; stamps f1200, f1226, f1255; neutral -> smile.
- Action, against the words: f1200 slam BÁC BỎ on the top letter on 'bác bỏ' (f1205); f1226 a second slam on 'cáo buộc' (f1231): two red stamps; f1255 he swaps to the green stamp and slams ĐÃ SỬA on the program sheet on 'sửa' (f1259); a small shrug at f1280.
- Acting: Bored efficiency; a self-satisfied smile on the green stamp.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1183 | open | [0.15, 1.55, -0.1] | [-0.38, 1, -2.1] | 40 | 0.2 | 8 | the desk top and the boss |

- Kicks (7 f): f1200 strength 0.6; f1226 strength 0.6; f1255 strength 0.5.
- Physics & FX: stamp strikes: 4 f wind-up, 1 f strike, 2 f squash.
- Light & mood: night office.
- Sound: two heavy stamp thumps f1200, f1226; a lighter one f1255 with a little 'ding'.
- After-state: Two BÁC BỎ on the letters, one ĐÃ SỬA on the program sheet.

### S12 · 0:43.2-0:47.4 · f1297-f1422 · "Khoan, sàn giàu hơn bao giờ hết, sao người bán lại cáu hơn bao giờ hết?"
- Gloss: Wait: the marketplace is richer than ever, so why are the sellers angrier than ever?
- Spine link: 3. Viewer must get: The counter climbs, and so does his temper.
- In: cut. Out: dissolve 10 f.
- Set: home. Light: day.
- Build: reuse the workroom TV (the counter climbing past $1,000,000,000).
- Blocking: Seller seated at his mark, under the TV.
  - seller at [0, -1.5], front; seated; stern -> pained.
- Action, against the words: Hard cut on 'Khoan' (f1297). f1312-1356 the TV count climbs on 'giàu hơn'; f1370-1410 his face goes stern -> angry; steam puffs from both sides of his head on 'cáu' (f1386), two more f1396, f1404.
- Acting: Stern, then fuming.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1297 | open | [0.2, 0.95, 1.2] | [0, 1.55, -1.8] | 40 | 0.3 | 4 | low angle: him and the TV |

- Kicks (7 f): none.
- Physics & FX: steam puffs rise 0.3 m and fade.
- Light & mood: day.
- Sound: a 'huh?' on 'Khoan' f1297; counter ticks; kettle hiss f1386-1410.
- After-state: He's fuming.

### S13 ★ · 0:47.4-0:56.7 · f1422-f1702 · "Bạn thấy đấy, cứ hình dung một khu chợ. Ban quản lý thu phí sạp của bạn, cấm bạn mang cân riêng, rồi tự dựng một sạp y hệt ngay bên cạnh, bán đúng món bạn bán."
- Gloss: You see, just imagine a market. The management charges your stall fee, bans you from bringing your own scale, then builds an identical stall right next to yours, selling exactly what you sell.
- Spine link: 4. Viewer must get: Fee, banned scale, a copycat stall right beside his.
- In: dissolve 10 f. Out: dissolve 8 f.
- Set: market. Light: golden.
- Build: new: the market hall, his stall and the twin stall.
- Blocking: Seller seated behind his stall. Buyer at buyer_a. The manager (Rob, armband) walks in from mgr_in (f1486-1508) to mgr_tin, then mgr_scale (f1542-1550), carries the scale off right (f1576-1592), comes back pushing the twin stall from mgr_push (f1596-1646).
  - seller at [-0.8, -1.55], front; seated behind his stall; smile -> nervous -> stern.
  - rob at [-1, -0.38], front; bag held; takes the scale f1550; pushes the twin stall; smile.
  - buyer at [-0.65, -0.05], front; browses, then steps to the twin f1681; neutral.
- Action, against the words: f1422-1480 calm market: the buyer browses his cards; f1517-1532 three coins hop from his tin into the manager's bag on 'thu phí sạp' (f1517, f1522, f1527); f1552 the manager lifts the brass scale off the stall on 'cấm' (f1548) and carries it off screen right; f1600-1646 the twin stall rolls in from the right on castors and bumps against the end of his stall on 'cạnh' (f1646): the scale-less stall shudders; f1657-1685 the twin's cards are the same cards; the buyer steps from buyer_a to buyer_b on 'bạn bán' (f1681-1695).
- Acting: Seller: smile -> nervous -> stern. Manager: polite smile throughout. Buyer: neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1422 | open | [1.8, 2.4, 3.4] | [-0.45, 0.95, -0.85] | 46 | 0.12 | 3 | the calm market, high |
| 1600 | glide 40 f | [2.2, 2.3, 3.2] | [0, 0.95, -0.85] | 46 | 0.15 | 3 | room for the twin stall |

- Kicks (7 f): f1646 strength 0.6.
- Physics & FX: coins: three ballistic hops into the bag; twin stall: 60 kg on castors, eases in at 0.06 m/f, bumps (0.6 kick) and stops; his stall shudders 1 cm.
- Light & mood: golden, warm lamps: the calm 'you see' place.
- Sound: market murmur; coin clinks f1517-1527; castors rolling f1600-1646, a wooden knock f1646; a cash-register ding f1690.
- After-state: Two identical stalls side by side; the buyer at the twin; his scale gone.

### S14 · 0:56.7-1:06.5 · f1702-f1994 · "Tháng mười một, chợ thay người quản lý. Rob Bigler rời ghế, Ron Jaiven về làm tổng quản lý và nói điều làm TCGplayer đặc biệt là đam mê của cộng đồng."
- Gloss: In November the market changed its manager. Rob Bigler left the chair, Ron Jaiven came in as general manager and said what makes TCGplayer special is the community's passion.
- Spine link: 5. Viewer must get: One boss out of the chair, the next one in; he praises the community.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: hq. Light: day.
- Build: reuse the HQ office (the cake table gone); the nameplate flips ROB BIGLER -> RON JAIVEN.
- Blocking: Rob seated at rob_desk until f1795, stands and walks out right (side view) f1800-1830; Ron walks in from the left f1816-1842 (side), sits f1844, front view from then on.
  - rob at [-0.4, -2.42], front -> side; stands f1795, walks out; neutral.
  - ron at [-0.4, -2.42], side -> front; walks in, sits f1844, talks; smile.
- Action, against the words: f1795 Rob stands on 'rời ghế' (f1800); f1800-1830 walks off right; f1816-1842 Ron walks in on 'Ron Jaiven'; f1844 sits; f1848 the nameplate flips to RON JAIVEN; f1885-1988 he speaks to the lens on 'đam mê của cộng đồng' (mouth alternates), one arm open.
- Acting: Rob: neutral; Ron: a wide salesman smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1702 | open | [-0.2, 1.55, 2] | [-0.4, 1.5, -2.4] | 44 | 0.12 | 4 | the chair, the board |
| 1860 | glide 40 f | [-0.35, 1.38, -0.2] | [-0.4, 1.38, -2.42] | 36 | 0.25 | 10 | Ron's pitch, low and close |

- Kicks (7 f): none.
- Physics & FX: the nameplate: a 180 deg flip on its hinge in 6 f.
- Light & mood: night office.
- Sound: chair creak f1795; footsteps out f1800-1830, in f1816-1842; chair creak f1844; nameplate flip f1848; a corporate synth pad under Ron's line.
- After-state: Ron in the chair.

### S15 · 1:06.5-1:13.6 · f1994-f2209 · "Lập tức, chủ một cửa hàng nhỏ ở South Dakota nhắn: vậy thì gặp năm mươi người bán nhỏ đi, đừng chỉ gặp mấy tài khoản to nhất."
- Gloss: Right away, the owner of a small shop in South Dakota messaged: then go meet fifty small sellers, don't just meet the biggest accounts.
- Spine link: 5. Viewer must get: A small shop owner answers with a message: meet fifty of us.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: shop. Light: golden.
- Build: new: the shop: counter, shelves, the sign; the owner's phone with a chat (a message typed and sent).
- Blocking: Owner stands behind the counter at his mark, phone in both arms at his chest.
  - owner at [0, -1.4], front; standing, phone at the chest; stern.
- Action, against the words: f1994-2060 he takes out his phone and starts typing on 'nhắn' (f2071); f2075-2140 line 1 'Vậy thì gặp 50 người bán nhỏ đi,' types; f2145-2190 line 2 'đừng chỉ gặp mấy tài khoản to nhất.'; f2196 SEND, the bubble flies up.
- Acting: Determined frown.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1994 | open | [0.35, 1.6, 2.1] | [0, 1.35, -1.4] | 42 | 0.15 | 5 | the small shop, the owner |
| 2066 | glide 34 f | [0, 1.66, -1.4] | [0, 1.22, -1.12] | 34 | 0.15 | 6 | his screen from his eyes |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm shop light.
- Sound: key taps; send whoosh f2196.
- After-state: Message sent.

### S16 ★ · 1:13.6-1:18.7 · f2209-f2360 · "Một tỷ đô đã về. Còn cái ghế cho người bán thì vẫn đang tìm."
- Gloss: The billion dollars has arrived. The chair for the sellers is still being searched for.
- Spine link: 6. Viewer must get: Money on the table, every chair taken, the small seller standing.
- In: dissolve 8 f. Out: end.
- Set: board. Light: day.
- Build: new: the boardroom: long table, four big-account sellers in four chairs, Ron at the head, the GMV board behind him, the money sack.
- Blocking: Ron seated at the head; the four VIPs seated; the seller stands at the near end (BOARD seller), turning his look left and right.
  - ron at [0, -3], front; seated at the head; grin.
  - vip at [-0.95, -2], front; seated x4; grin.
  - seller at [0.05, 1.15], front; standing, looks left f2263, right f2285, shrugs f2315; nervous.
- Action, against the words: f2222-2237 the money sack drops from above onto the table on 'về' (f2237): a thump, it slumps and stays; f2250-2330 glide to the seller at the table end: he looks left (f2263), right (f2285), at the lens (f2310) on 'vẫn đang tìm' — no chair for him; end on his shrug.
- Acting: VIPs and Ron grin; the seller nervous, then a shrug.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2209 | open | [0, 2.45, 3.4] | [0, 0.95, -1.3] | 44 | 0.12 | 3 | the whole table |
| 2252 | glide 40 f | [0.75, 1.5, 3.3] | [0.05, 1.3, 0.9] | 36 | 0.18 | 10 | the seller with no chair |

- Kicks (7 f): f2237 strength 0.8.
- Physics & FX: the sack: falls 0.9 m, slumps (squash 12 %), stays.
- Light & mood: cool boardroom; the board glow.
- Sound: a heavy money thud f2237 (coins jingle); silence; a sad violin f2290-2350.
- After-state: End on the seller with no chair.

