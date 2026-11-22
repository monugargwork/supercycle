# Lucas (big collection): direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/lucas-big-collection/plan.json` (0 errors; the scale and the tubs touch the caption band for a moment; S07 and S12 have fast glides by design: a tilt down to the phone, the tracking drive).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2430 frames (VO ends f2391). Four sets: home (living room), the card-show hall, the LA boulevard + lot, the card shop. Places change by dissolve; one hard cut (S11 "Khoan").

## Tone
Comedy of frustration; memes only where the sound is the joke. Screens only from their owner's side (POV), the owner not drawn in POV shots.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f26 | f70 | 45 PHÚT |
| f76 | f108 | 120 PHÚT |
| f300 | f344 | LUCAS DERUYTER |
| f612 | f664 | $16,000 |
| f804 | f852 | 90 PHÚT |
| f1048 | f1096 | 30 · 09 |
| f1210 | f1246 | ~$17,000 |
| f1636 | f1690 | $3,500 |
| f2006 | f2048 | 8 THÁNG |

## Sets

### home
- Origin in the shared world: [0, 0, 0]. Axes: back wall z -2.6 (door at its right, clock, calendar); the dining table in the middle; the sofa along the -x wall; open side +z.
- Light: golden; sun az/el [35, 30]. Open camera sides: +z.
- Marks [x, z]: dealer [0.45, -1.55]; lucas [-0.55, -0.5]; lucas_bins [1.5, -0.45]; fiance [1.45, 0.55]; lucas_seat [0, -1.55]; fiance_seat [0.72, -1.55].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: living-dining room x -2.6..2.6, z -2.6..2.6, 2.6 m, sage walls, oak floor, ceiling (no shadows), window in the front wall | [0, 1.3, 0] | [5.2, 2.6, 5.2] |
| door | new: front door 0.9 x 2.05 m in the back wall, hinged at x 2.05, swings in (+z); frame, knob | [1.6, 1.025, -2.58] | [0.9, 2.05, 0.05] |
| clock | new: wall clock r 16 cm, white face, ink ticks, two hands that spin (time-lapse) | [0.95, 1.86, -2.585] | [0.32, 0.32, 0.03] |
| calendar | new: wall calendar 30 x 42 cm, pages tear off (THÁNG 6..9, THỨ HAI, 8 more months) | [-0.35, 1.6, -2.585] | [0.3, 0.42, 0.01] |
| table | new: dining table 140 x 80 cm, top y 0.75, four legs; two chairs behind it | [0.35, 0.375, -1] | [1.4, 0.75, 0.8] |
| scale | new: borrowed jewellery scale 12 x 12 x 2.4 cm, steel pan, hinged lid open, LCD readout on the front (grams, live canvas) | [0.45, 0.75, -1.24] | [0.12, 0.024, 0.12] |
| lamp | new: desk lamp: round base, two-bone arm, cone shade aimed at the scale, emissive bulb | [-0.08, 0.75, -1.3] | [0.14, 0.45, 0.14] |
| packs | new: two stacks of sealed booster packs (to weigh / weighed), each pack 7 x 12 x 0.8 cm with a real card-art front | [0.86, 0.75, -1.12] | [0.08, 0.1, 0.13] |
| bins | new: three clear-blue plastic storage tubs 42 x 34 x 58 cm with snap lids, full of sealed packs | [2.1, 0.17, -0.55] | [0.42, 0.34, 1.88] |
| sofa | new: three-seat sofa along the -x wall, seat y 0.45; coffee table 50 x 80 cm with a candy bowl | [-2.15, 0.4, 0.6] | [0.8, 0.85, 2] |
| phone | new: Lucas's phone 7.5 x 15.5 cm (live canvas screen), lies on the table or is held | [-0.12, 0.75, -0.82] | [0.075, 0.008, 0.155] |
| laptop | new: laptop 32 x 22 cm, screen tilted back 105 deg facing Lucas's seat (live canvas: the post) | [0, 0.75, -1.12] | [0.32, 0.22, 0.22] |
| pizza | new: open pizza box 40 x 40 cm, a pizza with two slices gone | [0.36, 0.75, -1] | [0.4, 0.05, 0.4] |
| candy | new: glass bowl of rock-candy sticks (blue crystal clusters on wooden sticks) | [-0.28, 0.75, -0.98] | [0.16, 0.16, 0.16] |

### hall
- Origin in the shared world: [40, 0, 0]. Axes: a convention hall; vendor tables along the back wall z -3.6; the queue runs along z 0.5 toward the WE BUY booth at x -5 (people face -x).
- Light: day; sun az/el [-30, 50]. Open camera sides: +z.
- Marks [x, z]: lucas [1.35, 0.5].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: hall x -7..7, z -5..5, 4.5 m, grey-blue carpet, pale walls, ceiling with light panels | [0, 2.25, 0] | [14, 4.5, 10] |
| booth | new: buying booth: table with a cloth, a cash box, a hanging sign WE BUY · CASH | [-5, 0.4, 0.5] | [0.8, 0.8, 2] |
| tables | new: six vendor tables with blue cloths, glass display cases of cards, standing banners | [0, 0.45, -3.6] | [12, 0.9, 0.8] |
| banner | new: hanging banner CARD SHOW (cloth 4 x 0.8 m) | [2.6, 3.7, -4.94] | [4, 0.8, 0.02] |
| clock | new: big wall clock r 40 cm whose hands spin 90 minutes | [-1.8, 3, -4.98] | [0.8, 0.8, 0.04] |
| truck | new: hand truck with the three tubs strapped on it | [1.95, 0.55, 0.5] | [0.5, 1.1, 0.6] |

### street
- Origin in the shared world: [80, 0, 0]. Axes: a Los Angeles boulevard along x (lanes z -4..4), a sign gantry LOS ANGELES at x 0, the parking lot x 37..60 at its end.
- Light: golden; sun az/el [-70, 12]. Open camera sides: +z.
- Marks [x, z]: lucas [44.6, 1.4]; dealer [47.4, 1.4].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| road | new: asphalt road x -70..60, lane lines, kerbs, sidewalks z +-4..+-7, palms, street lamps, stucco shop fronts | [0, 0, 0] | [130, 0.1, 14] |
| gantry | new: steel sign gantry over the road at x 0 with a green sign LOS ANGELES / 10 W | [0, 5.6, 0] | [0.4, 1.4, 8] |
| car_l | new: Lucas's blue hatchback (box body, glass, four wheels), drives +x, then parks | [41, 0.7, 0] | [4.2, 1.5, 1.8] |
| car_d | new: the dealer's black SUV parked facing -x, headlights on | [51, 0.8, 0] | [4.6, 1.7, 1.9] |
| lamp | new: one sodium lamp post over the lot (emissive head) | [46, 3, -3.4] | [0.3, 6, 0.3] |
| envelope | new: thick paper envelope 23 x 11 x 2 cm, bills poking out | [45.9, 1.05, 1.5] | [0.23, 0.11, 0.02] |
| box | new: cardboard box 40 x 26 x 30 cm, open top, the bought-back packs inside | [46.4, 1, 1.5] | [0.4, 0.26, 0.3] |

### shop
- Origin in the shared world: [160, 0, 0]. Axes: a card shop: the counter along x at z -0.95, the clerk behind it facing +z, shelves of sealed product behind him.
- Light: day; sun az/el [40, 45]. Open camera sides: +z.
- Marks [x, z]: clerk [-0.25, -1.55]; lucas [0.75, -0.25].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: shop x -3..3, z -3..3, 2.8 m, cream walls, tiled floor, ceiling with panels, sign WE BUY CARDS | [0, 1.4, 0] | [6, 2.8, 6] |
| counter | new: glass-front counter 3.0 x 0.6 m, top y 0.95, cards in the case | [0, 0.475, -0.95] | [3, 0.95, 0.6] |
| scanner | new: ID scanner 12 x 8 x 6 cm with a red glass window (laser line on a scan) | [-0.28, 0.95, -0.9] | [0.12, 0.06, 0.08] |
| check | new: a check 18 x 8 cm on the counter (live canvas: the misspelt name written in) | [-0.02, 0.952, -0.88] | [0.18, 0.002, 0.08] |
| shelves | new: wall shelves of sealed booster boxes behind the counter | [0, 1.4, -2.8] | [4, 1.8, 0.35] |

## Cast

- **lucas:** blue flannel shirt, jeans, short brown hair. Items: phone, rock candy, envelope, box of packs. Views: front, side walking, seated.
- **fiance:** mint sweater, long auburn hair. Items: pizza slice. Views: front standing / seated.
- **dealer:** black jacket, black cap, goatee, shades in the lot. Items: packs, loupe, phone, box. Views: front seated, side walking, front standing.
- **clerk:** red shop polo, dark hair, glasses. Items: ID card, pen. Views: front standing.
- **chorus:** three friends: orange hoodie, purple tee, green jacket. Items: candy. Views: front seated on the sofa.
- **queue:** seven card-show buyers, varied coats, some with boxes. Items: none. Views: side, facing -x.

## Scenes

### S01 ★ · 0:00.0-0:08.9 · f0-f268 · "Một người mua đến trễ bốn mươi lăm phút, rồi ngồi suốt hai tiếng, cân từng gói thẻ Pokémon trên chiếc cân nữ trang của người khác, như nhà giả kim đang thử vàng."
- Gloss: A buyer shows up forty-five minutes late, then sits for two hours weighing every Pokémon pack on someone else's jewellery scale, like an alchemist testing gold.
- Spine link: 1. Viewer must get: A late buyer weighs every pack on a tiny scale for hours.
- In: open on the act. Out: glide.
- Set: home. Light: golden.
- Build: new: the living room (door, clock, calendar, table, scale, lamp, two pack stacks).
- Blocking: Dealer bursts through the door f10, walks (side view, -x) behind the table to his chair f16-54, sits f56-66 at his mark facing +z.
  - dealer at [0.45, -1.55], side walking -> front seated; walk in f16-54, sit f56, weigh f107-200, pack to the lamp f208; smile_closed -> stern.
- Action, against the words: f0-10 the clock over the door already reads 45 min late (hands spin through 45 min f0-50, title 45 PHÚT); f10-16 the door flies open and slams the wall on 'trễ' (f20): kick, a framed photo by the door rattles; f56-66 he drops into the chair; f70 sets the borrowed scale square; f77-106 the clock spins two hours on 'suốt hai tiếng' (title 120 PHÚT); f107-200 three weigh cycles: pack from the right stack onto the pan, readout ticks (21.4 g, 21.1 g, 22.9 g), pack onto the left stack; f208-262 he lifts a pack against the lamp, a loupe at his eye, the scale's readout glows gold on 'vàng' (f250).
- Acting: Dealer unhurried, smug, squinting; never looks up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [0.7, 1.45, 2.1] | [1.05, 1.3, -1.9] | 44 | 0.12 | 4 | the door bursts open under the clock |
| 46 | glide 30 f | [0.55, 1.38, 1.65] | [0.8, 1.18, -1.5] | 40 | 0.15 | 6 | he sits, the clock spins two hours |
| 108 | glide 28 f | [0.55, 1.12, 0.62] | [0.5, 0.98, -1.3] | 32 | 0.15 | 10 | weighing, pack by pack |
| 204 | glide 24 f | [0.32, 1.18, 0.55] | [0.35, 1.2, -1.4] | 30 | 0 | 10 | the alchemist at the lamp |

- Kicks (7 f): f16 strength 0.9.
- Physics & FX: Door: swings 0 -> 100 deg in 5 f, hits the stop, bounces back 12 deg and settles 95 deg by f30 (damped spring). Packs: carried, set down flat; the stacks grow / shrink by one each cycle.
- Light & mood: golden evening: warm lamp, the scale's LCD and the lamp bulb emissive.
- Sound: door slam f16 (Instagram Thud); clock ticking fast f0-50 and f77-106; scale beep each weigh f118, f150, f182; a mystic shimmer on 'vàng' f250.
- After-state: The packs move from the right stack to the left stack; the dealer stays at the table.

### S02 · 0:08.9-0:11.4 · f268-f342 · "Người đứng nhìn là Lucas DeRuyter."
- Gloss: The man standing watching is Lucas DeRuyter.
- Spine link: 1. Viewer must get: Lucas, arms down, watches it happen.
- In: glide. Out: glide.
- Set: home. Light: golden.
- Build: reuse the room.
- Blocking: Lucas stands at his mark, front view, the dealer seated at the table in the background.
  - lucas at [-0.55, -0.5], front; standing, arms down; neutral -> dazed.
- Action, against the words: f271 the camera swings off the dealer to Lucas; f286 'đứng nhìn' Lucas blinks slowly, a tired half-smile; the dealer keeps weighing behind him (one more cycle f290-330).
- Acting: Lucas: patient, tired (neutral -> dazed).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 268 | open | [0.32, 1.18, 0.55] | [0.35, 1.2, -1.4] | 30 | 0 | 10 | hold on the dealer |
| 272 | glide 36 f | [0.15, 1.5, 2] | [-0.3, 1.3, -0.8] | 38 | 0.18 | 8 | to Lucas watching |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden.
- Sound: scale beep f300; a soft bass note under his name.
- After-state: Lucas at his mark.

### S03 · 0:11.4-0:21.8 · f342-f654 · "Ba thùng nhựa đồ Pokémon của bà vợ sắp cưới, trong đó có vài chục gói thẻ chưa bóc: Base Set, Jungle, Fossil, Rocket. Trị giá khoảng mười sáu nghìn đô."
- Gloss: Three plastic tubs of his fiancée's Pokémon stuff, with a few dozen sealed packs inside: Base Set, Jungle, Fossil, Rocket. Worth about sixteen thousand dollars.
- Spine link: 2. Viewer must get: Her childhood collection: tubs of sealed packs, worth $16,000.
- In: glide. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: new: three clear-blue tubs with lids, packs inside, four hero packs with real card art (Base Charizard, Jungle Scyther, Fossil Aerodactyl, Rocket Dark Charizard).
- Blocking: Lucas walks (side view, +x) from his mark to beside the tubs f346-378; his fiancée stands by the tubs at her mark, front view.
  - lucas at [1.5, -0.45], side walking -> front; walks f346-378, stands by the tubs; smile -> shock.
  - fiance at [1.45, 0.55], front; standing, pats tub 3 f400-418; grin.
- Action, against the words: f359, f367, f374 the three lids snap off one after another and land leaning on the tubs; f398-420 on 'bà vợ sắp cưới' she grins and pats tub 3; f430-490 the camera rises over the open tubs: rows of sealed packs; on each set name one pack rises out of the middle tub and stands on its rim: BASE SET f495, JUNGLE f522, FOSSIL f545, ROCKET f566; f612-645 the four packs glint once each on 'mười sáu nghìn đô' (title $16,000).
- Acting: Fiancée proud and happy; Lucas amazed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 342 | open | [0.15, 1.5, 2] | [-0.3, 1.3, -0.8] | 38 | 0 | 8 | hold |
| 346 | glide 44 f | [0.95, 1.45, 2.3] | [1.65, 0.95, -0.5] | 40 | 0.15 | 6 | Lucas to the tubs, the fiancée |
| 428 | glide 40 f | [1.85, 1.95, 0.65] | [2.08, 0.42, -0.6] | 36 | 0.15 | 6 | over the open tubs: the packs |
| 600 | glide 28 f | [1.65, 1.75, 1] | [2, 0.6, -0.55] | 40 | 0.2 | 6 | the value |

- Kicks (7 f): f359 strength 0.4.
- Physics & FX: Lids (0.6 kg): pop up 6 cm, tip back and slide down to lean against each tub's side, rest.
- Light & mood: golden.
- Sound: three plastic snaps f359, f367, f374; a whoosh per rising pack; Wowww on the last pack f570.
- After-state: The tubs stay open; the four packs stand on the rim.

### S04 · 0:21.8-0:25.3 · f654-f760 · "Ai cũng bảo, bán đồ Pokémon cũ thì dễ như ăn kẹo."
- Gloss: Everyone said selling old Pokémon stuff is as easy as eating candy.
- Spine link: 3. Viewer must get: Friends on the sofa: easy money.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: home. Light: golden.
- Build: new: sofa, coffee table with a candy bowl.
- Blocking: Three friends seated on the sofa, front view.
  - chorus at [-2.1, 0.6], front seated; laugh, candy to mouth f746; laugh -> grin.
- Action, against the words: f668 they all laugh on 'cũng bảo'; f683-720 the middle one waves it off; f730-746 each takes a candy from the bowl and pops it in on 'kẹo' (f746).
- Acting: Laughing, smug, carefree.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 654 | open | [0.2, 1.2, 1.9] | [-2, 0.95, 0.6] | 40 | 0.2 | 6 | the chorus, low and close |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden.
- Sound: Emoji Laugh f668; candy crunch f748.
- After-state: They chew.

### S05 · 0:25.3-0:29.4 · f760-f882 · "Thế là Lucas xếp hàng một tiếng rưỡi ở hội chợ thẻ bài,"
- Gloss: So Lucas queued for an hour and a half at a card show,
- Spine link: 3. Viewer must get: He waits in a long queue to sell; the clock spins 90 minutes.
- In: dissolve 8 f. Out: dissolve 6 f.
- Set: hall. Light: day.
- Build: new: the card-show hall: queue, booth, vendor tables, banner, big clock; Lucas's hand truck with the tubs.
- Blocking: Seven buyers and Lucas in a line along z 0.5 facing -x (side view); Lucas last, his hand truck behind him.
  - lucas at [1.35, 0.5], side facing -x; waits, shuffles f800, f830, phone out f862; dazed.
- Action, against the words: f780-860 the clock spins 90 minutes (title 90 PHÚT); f800, f830 the line shuffles forward 0.3 m each time (two steps), Lucas drags the truck after; f862 he pulls out his phone.
- Acting: Lucas bored, sighing.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 760 | open | [4.8, 2, 5.2] | [-0.4, 1.6, -1] | 46 | 0.15 | 4 | the long line under the clock |
| 848 | glide 30 f | [3.2, 1.6, 2.7] | [1.2, 1.35, 0.4] | 36 | 0.2 | 8 | Lucas takes his phone out |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: flat convention-hall day light.
- Sound: crowd murmur; clock ticks f780-860; shuffles.
- After-state: Lucas holds his phone.

### S06 · 0:29.4-0:34.1 · f882-f1024 · "nhắn cho cả chục người làm video. Ai cũng hứa mua. Rồi biến mất, như chưa từng quen."
- Gloss: messaged a dozen video creators. Every one promised to buy. Then vanished, as if they'd never met.
- Spine link: 3. Viewer must get: A dozen promises on his phone, then every one of them ghosts him.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: hall. Light: day.
- Build: new: Lucas's phone (POV): a chat list of 12 creators.
- Blocking: POV from Lucas's eyes (he is not drawn).
- Action, against the words: f884-912 twelve messages send, rows tick one by one; f918-948 green replies pop in on every row: I'LL BUY IT!; f965-1012 one by one the avatars turn into little ghosts and the rows grey out to 'Seen'.
- Acting: none (POV).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 882 | open | [1.5, 1.73, 0.6] | [1, 1.2, 0.5] | 26 | 0.12 | 6 | his phone, from his eyes |
| 960 | glide 24 f | [1.43, 1.65, 0.57] | [1, 1.2, 0.5] | 22 | 0.15 | 6 | closer on the ghosts |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: day; the phone screen is emissive.
- Sound: message whoosh x12; Discord Notification per reply f918-948; a Crow caw f1000.
- After-state: Every chat says Seen.

### S07 · 0:34.1-0:38.3 · f1024-f1150 · "Mãi đến cuối tháng chín, mới có một tay buôn thẻ ở Los Angeles trả lời."
- Gloss: Not until the end of September did a card dealer in Los Angeles reply.
- Spine link: 4. Viewer must get: Months pass; at last one dealer answers.
- In: dissolve 8 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse the calendar (pages tear off), the phone lying on the table.
- Blocking: Nobody in frame.
- Action, against the words: f1030-1062 calendar pages tear off: THÁNG 6, 7, 8, landing on THÁNG 9 with 30 circled (title 30 · 09); f1085 glide down to the phone on the table; f1124 it buzzes and lights: LA DEALER · 'I'll take all of it. Coming tomorrow.'
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1024 | open | [-0.3, 1.55, -0.4] | [-0.35, 1.6, -2.585] | 34 | 0.15 | 6 | the calendar |
| 1076 | glide 48 f | [-0.05, 1.22, -0.4] | [-0.12, 0.76, -0.82] | 30 | 0.18 | 8 | the phone lights up |

- Kicks (7 f): none.
- Physics & FX: Calendar pages (paper, 3 g): peel from the top, flutter down out of frame.
- Light & mood: golden.
- Sound: paper tears x3; phone buzz f1124 (Phone Alert).
- After-state: The phone shows the dealer's reply.

### S08 · 0:38.3-0:41.6 · f1150-f1247 · "Cân xong, anh ta chuyển khoản gần mười bảy nghìn đô."
- Gloss: Done weighing, he transferred almost seventeen thousand dollars.
- Spine link: 4. Viewer must get: He finishes, sends the money, Lucas grins.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse the hook set-up; the dealer's phone; Lucas's phone on the table.
- Blocking: Dealer seated at his mark; Lucas standing at his mark.
  - dealer at [0.45, -1.55], front seated; last pack f1151, taps phone f1189; neutral.
  - lucas at [-0.55, -0.5], front; standing; neutral -> grin f1211.
- Action, against the words: f1151-1166 the dealer lifts the last pack off the scale onto the done stack; f1189 he taps his phone ('chuyển khoản'); f1211 Lucas's phone on the table lights TRANSFER RECEIVED and Lucas grins (title ~$17,000).
- Acting: Dealer flat; Lucas relieved grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1150 | open | [-0.05, 1.45, 2.5] | [-0.1, 1.1, -1.1] | 42 | 0.15 | 6 | both men and the table |
| 1198 | glide 22 f | [-0.1, 1.25, 0.45] | [-0.25, 1, -0.75] | 34 | 0.2 | 8 | the money lands |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden.
- Sound: Kaching f1211.
- After-state: Paid; the packs are the dealer's.

### S09 · 0:41.6-0:44.5 · f1247-f1336 · "Thứ Hai tuần sau, anh ta đòi lại tiền,"
- Gloss: The next Monday, he demanded the money back,
- Spine link: 5. Viewer must get: Days later, a message: he wants his money back. Lucas's jaw drops.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse; the calendar now reads THỨ HAI.
- Blocking: Lucas standing at his mark, phone in hand (front view, holding it up to read).
  - lucas at [-0.55, -0.5], front; holds phone up; neutral -> shock f1295.
- Action, against the words: f1250 the phone buzzes in his hand; f1262 he lifts it to read; f1295 on 'đòi lại tiền' his jaw drops (gape 0.7) and holds.
- Acting: Calm -> shock.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1247 | open | [-0.2, 1.5, 1.6] | [-0.5, 1.4, -0.6] | 36 | 0.2 (punch 0.6 for 20 f) | 8 | push on the shock |

- Kicks (7 f): f1295 strength 0.5.
- Physics & FX: none.
- Light & mood: golden.
- Sound: Phone Alert f1250; record scratch hit f1295.
- After-state: He reads on.

### S10 · 0:44.5-0:47.2 · f1336-f1415 · "vì tưởng mình mua được bản in hiếm Shadowless."
- Gloss: because he thought he'd bought the rare Shadowless print.
- Spine link: 5. Viewer must get: His reason, on the phone: he thought these were Shadowless.
- In: dissolve 6 f. Out: cut.
- Set: home. Light: golden.
- Build: reuse the phone (POV): the dealer's message with a photo of the real Base Set Charizard.
- Blocking: POV from Lucas's eyes (not drawn).
- Action, against the words: f1340 the message is open: a photo of the Base Set Charizard; f1360-1372 the words 'Thought these were SHADOWLESS. Refund.' type in, SHADOWLESS in red on 'Shadowless' (f1368).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1336 | open | [-0.52, 1.56, -0.42] | [-0.53, 1.2, -0.82] | 26 | 0.15 | 6 | the message from his eyes |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden; screen emissive.
- Sound: typing ticks; Realization Sound f1368.
- After-state: The refund demand.

### S11 · 0:47.2-0:50.9 · f1415-f1528 · "Khoan, cân từng gói suốt hai tiếng, giờ mới nghĩ ra à?"
- Gloss: Wait, he weighed every pack for two hours, and only now thought of it?
- Spine link: 5. Viewer must get: Replay: the two hours of weighing. He had every chance to check.
- In: cut. Out: dissolve 8 f.
- Set: home. Light: golden.
- Build: reuse the hook frame in memory light (grey-warm).
- Blocking: Dealer seated weighing at his mark.
  - dealer at [0.45, -1.55], front seated; weighing, then loupe; stern.
- Action, against the words: f1415 hard cut on 'Khoan'; f1430-1470 the clock behind him spins two hours again, a pack on and off the scale twice; f1480-1512 push in on his squint with the loupe; f1511 on 'à?' he freezes mid-squint.
- Acting: Dealer: absorbed, oblivious.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1415 | open | [0.55, 1.38, 1.65] | [0.8, 1.18, -1.5] | 40 | 0.2 | 6 | the same frame as the hook |
| 1472 | glide 34 f | [0.4, 1.32, 0.35] | [0.4, 1.3, -1.45] | 30 | 0.3 | 10 | push on the squint |

- Kicks (7 f): f1415 strength 0.6.
- Physics & FX: none.
- Light & mood: the hook's light, dimmed 0.82 and desaturated: a memory.
- Sound: Huh f1415; fast ticking f1430-1470; a held beat f1511.
- After-state: Freeze on the squint.

### S12 ★ · 0:50.9-0:55.4 · f1528-f1662 · "Thế là Lucas lái xe xuyên Los Angeles, ôm một phong bì ba nghìn rưỡi đô tiền mặt,"
- Gloss: So Lucas drove across Los Angeles, holding an envelope of three and a half thousand dollars in cash,
- Spine link: 6. Viewer must get: He drives across LA at dusk with the cash.
- In: dissolve 8 f. Out: dissolve 6 f.
- Set: street. Light: golden.
- Build: new: the boulevard: road, palms, lamps, shop fronts, the LOS ANGELES gantry; Lucas's hatchback with Lucas at the wheel.
- Blocking: Lucas seated in the driver's seat (front view through the side window).
  - lucas at [-30, -1.6], front seated in the car; driving; stern.
- Action, against the words: f1530-1658 the hatchback drives from x -30 to x +30 (smootherstep: pulls away, cruises, slows), passing under the LOS ANGELES sign at f1594 ('Los Angeles' f1581); the camera tracks alongside, low, palms sweeping past in the foreground; title $3,500 f1636.
- Acting: Lucas grim, both hands on the wheel.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1528 | open | [-33, 1.3, 12.5] | [-29.5, 2.6, -1.6] | 36 | 0 | 4 | the car pulls away |
| 1530 | glide 128 f | [27, 1.3, 12.5] | [30.5, 2.6, -1.6] | 36 | 0 | 4 | track the car under the sign |

- Kicks (7 f): none.
- Physics & FX: none (the car follows the glide curve; wheels spin at the matching rate).
- Light & mood: golden dusk over LA, pink sky, dimmed 0.86; lamps lit.
- Sound: engine hum, city traffic; a low synth pulse.
- After-state: The car reaches the lot.

### S13 ★ · 0:55.4-1:00.5 · f1662-f1814 · "ra một bãi đỗ xe như phim buôn lậu, chỉ để mua lại chính số thẻ mình vừa bán."
- Gloss: to a parking lot like a smuggling movie, just to buy back the very cards he had just sold.
- Spine link: 6. Viewer must get: A shady handover under one lamp: his cash for his own cards.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: street. Light: golden.
- Build: new: the lot (lines, one sodium lamp), both cars nose to nose, headlights on; envelope; box of packs.
- Blocking: Lucas (shades, envelope) at his mark, the dealer (shades, box in both hands) at his; both front view; they step together f1700-1722.
  - lucas at [45.45, 1.4], front; envelope out f1736, takes box f1766; stern -> sad.
  - dealer at [46.55, 1.4], front; takes envelope f1751, hands box f1766; stern.
- Action, against the words: f1700-1722 both step in to their meet marks; f1736-1748 Lucas holds the envelope out; f1751 the dealer takes it (on 'mua lại'), thumbs the bills f1754-1764; f1766-1780 he pushes the box into Lucas's arms ('số thẻ'); f1790-1812 Lucas hugs the box, the dealer pockets the envelope.
- Acting: Both stone-faced in sunglasses; Lucas glum.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1662 | open | [46, 0.55, 7.2] | [46, 1.3, 0.6] | 38 | 0.15 | 4 | low wide: two cars, two men, one lamp |
| 1730 | glide 28 f | [46, 1.1, 5.4] | [46, 1.2, 1.4] | 36 | 0.2 | 10 | the exchange |
| 1784 | glide 24 f | [45.6, 1.3, 3.9] | [45.7, 1.3, 1.4] | 32 | 0.2 | 10 | Lucas with his own cards |

- Kicks (7 f): f1751 strength 0.4.
- Physics & FX: Envelope (0.1 kg) and box (2 kg) are carried; nothing falls.
- Light & mood: dusk, dimmed 0.8; the sodium lamp and both cars' headlights glow.
- Sound: Suspicious Sound f1713; car idle; paper rustle f1754.
- After-state: Lucas has the box back.

### S14 · 1:00.5-1:06.5 · f1814-f1996 · "Rồi đem đến một tiệm khác. Tiệm quét căn cước, nghi anh đi bán đồ ăn cắp, rồi viết sai tên anh trên tấm séc."
- Gloss: Then took it to another shop. The shop scanned his ID, suspected he was selling stolen goods, then wrote his name wrong on the check.
- Spine link: 7. Viewer must get: Another shop treats him like a thief and misspells his name on the check.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: shop. Light: day.
- Build: new: the card shop: counter with glass case, ID scanner, shelves, WE BUY CARDS sign, the check.
- Blocking: Lucas walks in (side view, -x) carrying the box f1816-1846, sets it on the counter f1847; the clerk stands behind the counter.
  - lucas at [0.75, -0.25], side walking -> front; box on the counter f1847, ID across f1859; neutral -> nervous.
  - clerk at [-0.25, -1.55], front; scans ID f1874, stares f1894, writes f1947; neutral -> stern.
- Action, against the words: f1859 Lucas slides his ID card across; f1874-1886 the clerk passes it over the scanner: a red laser line sweeps, beep ('quét căn cước'); f1894 on 'nghi' the clerk narrows his eyes at Lucas, then at the box (f1914) and back (f1926); Lucas sweats; f1940 top-down on the check: the clerk's pen writes 'Lukas DeRiter' f1947-1980 on 'viết sai tên anh'.
- Acting: Clerk suspicious, stern; Lucas nervous.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1814 | open | [1.7, 1.55, 2.3] | [0.5, 1.15, -0.8] | 40 | 0.15 | 4 | Lucas brings the box in |
| 1862 | glide 20 f | [0.35, 1.3, 0.65] | [-0.15, 1.05, -0.95] | 32 | 0.2 | 8 | the ID under the scanner |
| 1886 | glide 22 f | [0.2, 1.5, 1.7] | [0.1, 1.35, -0.8] | 36 | 0.2 | 8 | suspicion: both faces |
| 1936 | glide 26 f | [0, 1.32, -0.42] | [-0.02, 0.952, -0.88] | 32 | 0.2 | 8 | the misspelt name |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: flat shop day light.
- Sound: door chime f1816; box thump f1847; Computer Error Sound f1880; pen scratch f1947-1980; Huh5544? no: a single Bruh f1983.
- After-state: The check with the wrong name.

### S15 · 1:06.5-1:08.4 · f1996-f2052 · "Tổng cộng tám tháng."
- Gloss: Eight months in total.
- Spine link: 7. Viewer must get: Eight months, page by page.
- In: dissolve 8 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse the calendar.
- Blocking: Nobody.
- Action, against the words: f2000-2044 eight pages tear off the calendar one after another (every 5-6 f) on 'tám tháng' (title 8 THÁNG).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1996 | open | [-0.3, 1.55, -0.55] | [-0.35, 1.6, -2.585] | 32 | 0.3 | 6 | the calendar |

- Kicks (7 f): none.
- Physics & FX: Pages flutter down.
- Light & mood: golden.
- Sound: eight paper rips, a Sad Violin phrase starts f2010.
- After-state: Eight months gone.

### S16 · 1:08.4-1:13.2 · f2052-f2196 · "Bên bữa pizza, vợ sắp cưới của anh nói: "Lẽ ra mình không nên làm chuyện này.""
- Gloss: Over pizza, his fiancée said: "We shouldn't have done this."
- Spine link: 8. Viewer must get: Over pizza, she regrets it.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse the table; open pizza box.
- Blocking: Lucas and his fiancée seated side by side behind the table, front view.
  - fiance at [0.72, -1.55], front seated; slice f2063, turns f2113; smile_closed -> sad.
  - lucas at [0, -1.55], front seated; slice, lowers it f2150; sad.
- Action, against the words: f2063 she lifts a slice, it droops; f2113 she turns to him ('nói'), sad; f2125-2188 her line (VO); Lucas lowers his slice f2150 and nods slowly.
- Acting: Both tired, a small rueful smile from her.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2052 | open | [0.36, 1.32, 1.7] | [0.36, 1.05, -1.3] | 38 | 0.15 | 6 | the two of them over pizza |
| 2112 | glide 30 f | [0.7, 1.3, 0.55] | [0.62, 1.22, -1.5] | 32 | 0.15 | 10 | her line |

- Kicks (7 f): none.
- Physics & FX: The slice droops (cheese sag).
- Light & mood: golden, warm lamp.
- Sound: the violin phrase continues softly; room tone.
- After-state: They sit.

### S17 · 1:13.2-1:17.5 · f2196-f2326 · "Còn Lucas viết rằng, chẳng số tiền nào đáng để trải qua chuyện đó."
- Gloss: And Lucas wrote that no amount of money is worth going through that.
- Spine link: 8. Viewer must get: Lucas writes his verdict.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse the laptop (POV over his eyes): a plain post page.
- Blocking: POV from Lucas's seat (not drawn).
- Action, against the words: f2216-2310 the line types letter by letter: 'No amount of money is worth going through that.'; f2316 POST is clicked (button presses).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2196 | open | [0.06, 1.3, -1.73] | [0, 0.95, -1.14] | 30 | 0.18 | 6 | his screen from his seat |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden; screen emissive.
- Sound: keyboard clicks f2216-2310; a click f2316.
- After-state: Posted.

### S18 ★ · 1:17.5-1:21.0 · f2326-f2430 · "Dễ như ăn kẹo. Kẹo đá."
- Gloss: Easy as eating candy. Rock candy.
- Spine link: 9. Viewer must get: He bites a rock candy and nearly breaks a tooth: it was never easy.
- In: dissolve 6 f. Out: end.
- Set: home. Light: golden.
- Build: reuse; the bowl of rock-candy sticks.
- Blocking: Lucas and the fiancée seated; Lucas takes a stick from the bowl.
  - lucas at [0, -1.55], front seated; candy to mouth f2350, bite f2381; smile -> pained.
  - fiance at [0.72, -1.55], front seated; flinches f2383; neutral -> shock.
- Action, against the words: f2330 'Dễ' he takes a rock-candy stick; f2350 'kẹo' it goes to his mouth, smug little smile; f2362 'Kẹo'; f2381 'đá' he bites: CRACK, kick, stars around his head, eyes squeeze shut (pained), a crystal chip flies off and lands on the table; the fiancée flinches (shock). Hold to the end.
- Acting: Smug -> pain; her shock.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2326 | open | [0.36, 1.32, 1.5] | [0.36, 1.15, -1.4] | 36 | 0.15 | 6 | both at the table |
| 2362 | glide 16 f | [0.05, 1.36, 0.45] | [0.05, 1.32, -1.5] | 30 | 0.2 (punch 0.8 for 16 f) | 10 | push on the bite |

- Kicks (7 f): f2381 strength 1.
- Physics & FX: The crystal chip (2 g): pops off up-left at 1.2 m/s, falls to the table, bounces once, rests.
- Light & mood: golden.
- Sound: crunch / Bone Crack f2381; a cartoon 'boing' tail; music out.
- After-state: End on his pained face.

