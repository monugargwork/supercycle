# Fossil sheet in the loft: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/fossil-sheet-loft/plan.json` (0 errors; the "fast" warnings are deliberate: the snaps between flashes in S17, the swing to the TV in S10, the travels in S04, S13, S15, S18).
All positions are set-local metres (y up). The landing and the loft share one frame: the loft boards are at y 2.62, right above the landing ceiling (2.5), and the hatch at z -1 joins them. 30 fps, 2290 frames (VO ends f2275). 20 scenes (the beat sheet's S13 split into the counter S14 and the press S15; the loft pull is its own S06).

## Transitions
Two hard cuts: the tube going down the hatch (S06 to S07, a match on the action) and the valuer's "Khoan đã" (S12). Time jumps dissolve (the loft 2026, the 1999 store twice, the photo corner, the last loft shot); two through-object dissolves: the shut hatch seam into the loft (S01 to S02) and the Gengar on the damaged sheet into the same Gengar on a fresh one at the press (S14 to S15).

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f212 | f250 | 1999 - 2026 |
| f1262 | f1322 | 1999 |
| f1525 | f1562 | FOSSIL |
| f2098 | f2150 | 29 · 11 · 2026 |

## Sets

### landing
- Origin in the shared world: [0, 0, 0]. Axes: +z toward the stairs (the lens side), the back wall z -3; the hatch in the ceiling at z -1, the loft right above.
- Light: day; sun az/el [60, 40]. Open camera sides: +z.
- Marks [x, z]: relative [0, -0.92]; owner_floor [-0.55, 0.1]; partner [0.75, 1.3]; partner_wall [1, 1.28]; owner_bag [0.58, -0.05].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| hall | new: upstairs hall x -1.3..1.3, z -3..3, ceiling 2.5 with the hatch opening; carpet, faded grid wallpaper (beige with pale yellow-bordered panels), white skirting, a radiator on the right wall | [0, 1.25, 0] | [2.6, 2.5, 6] |
| hatch | new: opening 84 x 70 cm with a white frame lip; the door (2 cm board) hinged along its left edge x -0.42, opens up to vertical; a pull cord from its free edge | [0, 2.5, -1] | [0.84, 0.02, 0.7] |
| stepladder | new: wooden A-frame stepladder, 4 steps (top step y 0.7, cap y 1.25), spreader cords | [0, 0.62, -0.75] | [0.5, 1.25, 0.7] |
| doorway | new: doorway in the left wall z 1.2..2.0, 2.0 m high, into the living room (x -5..-1.3): sofa, a CRT-era flat TV on the far wall | [-1.3, 1, 1.6] | [0.1, 2, 0.8] |
| tv | new: TV 1.0 x 0.6 m on a low cabinet, facing +x; the screen shows the news: a crowd shoving at a card-shop shelf (drawn, moving) | [-4.62, 1.05, 1.6] | [0.06, 0.6, 1] |
| bag | new: black bin bag (lumpy sphere-ish sack 0.5 m, tied neck open), clear-out junk beside it: a box marked KHO | [0.95, 0, -0.2] | [0.5, 0.55, 0.5] |
| paint_tin | new: paint tin (cylinder r 9 cm, h 12 cm, wire handle) | [0.2, 0, 0.95] | [0.18, 0.12, 0.18] |

### loft
- Origin in the shared world: [0, 0, 0]. Axes: same frame as the landing: boards at y 2.62, ridge along z at x 0 (y 4.4), gables at z -3.6 and 2.4.
- Light: day; sun az/el [40, 25]. Open camera sides: +z (inside the roof).
- Marks [x, z]: pop [0, -1.05]; partner_pull [0, -1.22].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| roof | new: pitched roof x -2.6..2.6 (knee walls 0.28 m), rafters every 0.45 m, felt between, insulation between the joists, boards over them | [0, 3.5, -0.6] | [5.2, 1.8, 6] |
| tube | the sheet, rolled (r 4.5 cm, 72 cm long, axis along x), a rubber band; it rests against the lights box | [0, 2.665, -1.655] | [0.72, 0.09, 0.09] |
| lights | new: cardboard box of Christmas lights (38 x 22 x 28 cm), flaps open, a green cable hanging out | [-0.05, 2.73, -1.84] | [0.38, 0.22, 0.28] |
| fan | new: 1990s standing fan 1.1 m: round base, pole, motor, wire cage (r 20 cm) with one bent bar, three blades, one hanging loose out of the gap, the cord knotted round the pole | [0.45, 2.62, -2] | [0.4, 1.1, 0.3] |
| post | new: roof post 9 x 9 cm from the boards to the ridge purlin; a nail with rusty scissors (y 3.02); a 1999 calendar nailed above (26 x 36 cm, y 3.35) | [-0.25, 3.4, -2.25] | [0.09, 1.6, 0.09] |
| frame | new: empty gilt picture frame 36 x 30 cm leaning on the lights box | [-0.45, 2.62, -1.95] | [0.36, 0.3, 0.03] |
| junk | new: a suitcase (x -0.85, z -2.5), a lampshade (x 1.0, z -2.4), the gable window (50 x 40 cm, z -3.6) with a dusty light shaft | [0, 3, -2.6] | [2, 1, 1] |

### auction
- Origin in the shared world: [40, 0, 0]. Axes: the back wall z -5 (lot board) faces +z; the valuation counter on the left (x -2.6), the photo corner on the right (x 2.4), the saleroom chairs in the middle.
- Light: day; sun az/el [70, 45]. Open camera sides: +z.
- Marks [x, z]: valuer [-2.6, -3.15]; owner [-3.55, -1.95]; photog [3.05, -1.95]; auctioneer [0, -4.65].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: hall x -5..5, z -5..4, 3.4 m high, oak floor, sage-green walls, white ceiling with pendant lamps | [0, 1.7, -0.5] | [10, 3.4, 9] |
| counter | new: valuation table 1.6 x 1.2 m (top y 0.9), green baize mat, a desk lamp, a loupe | [-2.6, 0.45, -2.4] | [1.6, 0.9, 1.2] |
| easel | new: wooden studio easel holding the sheet upright (centre y 1.35), two softboxes on stands, a camera on a tripod, a red rope on two brass stands, a clipboard stand with the condition report | [2.4, 1.35, -3.75] | [0.72, 1.02, 0.02] |
| rostrum | new: oak rostrum (top 1.2), gavel block | [0, 0.6, -4.35] | [0.9, 1.2, 0.5] |
| lot_board | new: dark lot board, cream lettering: CULLENS OF SURREY / LOT 1 / UNCUT FOSSIL HOLO SHEET 1999 / ESTIMATE £6,000 - £10,000 (lines flip on) | [0, 2.35, -4.95] | [2.2, 0.95, 0.04] |
| chairs | new: two rows of four bentwood chairs | [0, 0.45, -2.2] | [2.4, 0.9, 1.4] |

### store
- Origin in the shared world: [80, 0, 0]. Axes: the back wall z -4 (promotion board) faces +z, shelves along the left wall, the counter on the right.
- Light: golden; sun az/el [120, 35]. Open camera sides: +z.
- Marks [x, z]: relative [-2.15, -1.6]; relative15 [-0.4, -3.15]; kid1 [0.15, -3]; kid2 [0.85, -3.05].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: shop x -3..3, z -4..2.5, 3 m high, chequered floor, yellow walls, strip lights | [0, 1.5, -0.75] | [6, 3, 6.5] |
| shelves | new: metal shelving along x -2.95..-2.55, four shelves of toy boxes (bright, plain printing) | [-2.75, 1, -1.65] | [0.4, 2, 4.3] |
| promo | new: cork promotion board 1.0 x 1.5 m on the back wall, a red header strip PROMOTION, the pristine sheet pinned at its corners | [0.5, 1.6, -3.96] | [1, 1.5, 0.03] |
| sign | new: hanging sign KB TOYS (plain red block lettering on white, 1.6 x 0.4 m) on two chains | [0, 2.55, -2.2] | [1.6, 0.4, 0.04] |
| counter | new: shop counter 1.4 x 0.6 (top 1.0) with a till | [1.9, 0.5, -0.8] | [1.4, 1, 0.6] |

### press
- Origin in the shared world: [120, 0, 0]. Axes: the press on the left feeds +x onto the guillotine bed; the back wall z -4.
- Light: golden; sun az/el [100, 40]. Open camera sides: +z.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: print shop x -4..4, z -4..3, 3.4 m high, concrete floor, grey-blue walls, a skylight | [0, 1.7, -0.5] | [8, 3.4, 7] |
| press | new: offset press body 2.4 x 1.3 x 1.2 m (green-grey, panels, gauges), two steel rollers at its +x face (y 1.02 and 1.12) that turn; the next sheet half out | [-1.3, 0.65, -2] | [2.4, 1.3, 1.2] |
| guillotine | new: guillotine: steel bed 1.1 x 1.2 (top 1.0), two side posts, a top beam, the blade bar (1.25 x 0.15) that drops on the cut line z -1.58 | [0.75, 1, -2] | [1.1, 0.75, 1.2] |
| tray | new: catch tray in front of the bed (y 0.75) with loose cut cards | [0.75, 0.75, -1.15] | [1, 0.08, 0.4] |

## Cast

- **relative:** red KB Toys staff vest with a name badge, white shirt, cap, young. Items: the rolled sheet, rubber band, toy boxes. Views: front, side.
- **owner:** lilac cardigan, round glasses, dark hair, lottery ticket in her pocket. Items: the tube. Views: front, side, sitting on the floor.
- **partner:** green T-shirt, jeans, short dark hair. Items: paint tin, the sheet, torch. Views: front, side, head and shoulders in the hatch.
- **valuer:** tweed jacket, round glasses, grey hair, bow tie. Items: loupe, rubber stamp. Views: front.
- **photographer:** black tee, black jeans, beanie. Items: tripod camera. Views: front.
- **auctioneer:** navy suit, red tie, grey hair. Items: gavel. Views: front.
- **kids:** kid build: orange tee + cap; blue tee. Items: none. Views: front.
- **heads:** three family members 2003 / 2011 / 2019: a man in a cap, a teen with headphones, a woman with a bun. Items: none. Views: head and shoulders in the hatch.

## Scenes

### S01 ★ · 0:00.0-0:06.9 · f0-f206 · "Có người cuộn một tờ thẻ Pokémon chưa cắt, nhét lên gác mái, rồi bỏ quên nó lâu hơn tuổi đời của nhiều người đang xem video này."
- Gloss: Someone rolled up an uncut sheet of Pokémon cards, shoved it into the loft, and forgot it for longer than many of you watching have been alive.
- Spine link: 1. Viewer must get: A sheet of cards goes up into the loft and the hatch slams on it.
- In: open on the act. Out: through-object 6 f (push into the shut hatch seam, dissolve to the loft above).
- Set: landing. Light: golden.
- Build: new: the landing, the hatch with its hinged door and pull cord, the stepladder; the tube (pristine sheet rolled) with a rubber band.
- Blocking: The relative (red vest) on the stepladder at [0, -0.92], feet on the top step y 0.7, front view, head just under the open hatch.
  - relative at [0, -0.92], front; band, shove, cord yank; stern -> squeeze -> smile.
- Action, against the words: f0-40 tube at his chest; f40-54 he stretches the rubber band over it; f55 SNAP (band on 'cắt'). f58-66 lifts it overhead, f67 shoves it up through the hatch ('nhét'): it flies 25 cm up and drops out of sight onto the boards; roll f70-96 heard, a clank on the fan f97. f100-108 he reaches up for the pull cord and yanks it; the door tips past vertical and falls shut f108-122 (gravity, accelerating), SLAM f122 ('quên'): dust sifts down from the seams onto his cap, he squeezes his eyes and coughs f126-150. f130-206 the camera rises past him to the shut hatch.
- Acting: determined -> squeeze (dust) -> satisfied smile f160.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [0.85, 1.05, 1.45] | [0, 1.95, -0.95] | 50 | 0.15 | 6 | low on the ladder, the hatch above |
| 130 | glide 60 f | [0.3, 1.7, 0.15] | [0, 2.48, -1] | 44 | 0.3 | 8 | rise toward the shut hatch |

- Kicks (7 f): f122 strength 1.
- Physics & FX: tube toss: launched up at 2.2 m/s at f67, lands on the boards (unseen). Door: hinged at x -0.42, falls from 95 deg with gravity (angular, I = m L^2/3), slam f122, one 3 deg rebound. Dust: 40 motes fall from the seams, drift, settle by f190.
- Light & mood: golden 1999, warm bulb on the landing; a cold grey square of loft light in the open hatch until it shuts.
- Sound: rubber band twang f55; whoosh f66; thud + roll f70-96; fan clank f97; cord creak f104; SLAM f122 + Instagram Thud meme; cough f128.
- After-state: The hatch is shut; dust settles on the landing carpet.

### S02 · 0:06.9-0:08.5 · f206-f256 · "Hai mươi bảy năm."
- Gloss: Twenty-seven years.
- Spine link: 1. Viewer must get: Time passes in the loft.
- In: through-object 6 f. Out: locked.
- Set: loft. Light: day.
- Build: new: the loft with the tube against the lights box, the fan, the post with the calendar, the scissors, the empty frame.
- Blocking: nobody.
- Action, against the words: Locked frame. The calendar's pages flip on their own from 1999 to 2026 (f212-250, a page every 1.4 f, pages fluttering off and gone); the dust layer on the tube and the boards greys over. Title 1999 - 2026 f212.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 206 | open | [-0.05, 3.12, -0.3] | [0.1, 2.85, -2] | 54 | 0.1 | 4 | the locked loft frame |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: cold grey day from the gable window, a dusty light shaft.
- Sound: calendar flutter rising; a clock tick sped up.
- After-state: Calendar on 2026.

### S03 · 0:08.5-0:12.8 · f256-f384 · "Nó sống chung với bụi, với nhện, và với cái quạt hỏng mà không ai dám vứt."
- Gloss: It lived with the dust, the spiders, and a broken fan nobody dares throw away.
- Spine link: 1. Viewer must get: Dust, a spider, the fan nobody dares touch.
- In: locked. Out: push.
- Set: loft. Light: day.
- Build: the same frame; the hatch door opens and shuts for three heads.
- Blocking: Three heads pop up through the hatch at [0, -1.05] (feet y 1.25 on the ladder): f344-354 man in a cap, f356-366 teen with headphones, f368-380 woman with a bun.
  - heads at [0, -1.05], front; pop up, duck; nervous.
- Action, against the words: f285-300 a dust puff drifts across the tube ('bụi'); f305-330 a spider drops on its thread from the rafter to just above the tube ('nhện' f311) and hangs, swaying; f339-343 the fan's loose blade creaks and swings ('quạt hỏng'). Each head: the door swings up 8 f, the head rises, eyes the fan, the blade twitches, the head ducks back down and the door drops (f344-380, 'không ai dám vứt').
- Acting: heads: nervous, eyes on the fan.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 256 | open | [-0.05, 3.12, -0.3] | [0.1, 2.85, -2] | 54 | 0.12 | 4 | same frame |

- Kicks (7 f): none.
- Physics & FX: the loose blade: a pendulum on its hub pin (swing 18 deg, damped).
- Light & mood: same.
- Sound: dust whisper; spider zip f305; fan creak f340; three door clunks; Suspicious Sound meme f356.
- After-state: —

### S04 · 0:12.8-0:17.0 · f384-f510 · "Không ai cắt. Không ai đóng khung. Không ai nhớ nó tồn tại."
- Gloss: Nobody cut it. Nobody framed it. Nobody remembered it existed.
- Spine link: 1. Viewer must get: Three things left undone.
- In: push. Out: dissolve 6 f (back to the wide frame, 2026).
- Set: loft. Light: day.
- Build: the scissors (rusty, open, on the nail), the empty frame, the cobweb over the tube.
- Blocking: nobody.
- Action, against the words: f386-410 the camera glides to the rusty scissors on the nail ('cắt' f412); f420-446 to the empty frame ('khung' f446); f456-490 down to the tube as the last strands of web close over it ('tồn tại' f495).
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 384 | open | [-0.05, 3.12, -0.3] | [0.1, 2.85, -2] | 54 | 0 | 4 |  |
| 386 | glide 24 f | [-0.12, 3.08, -1.45] | [-0.25, 2.95, -2.2] | 34 | 0.2 | 10 | the scissors nobody used |
| 420 | glide 34 f | [-0.3, 2.95, -1.25] | [-0.45, 2.77, -1.95] | 36 | 0.2 | 10 | the frame nobody filled |
| 456 | glide 30 f | [0.15, 2.92, -1.1] | [0, 2.665, -1.655] | 34 | 0.25 | 10 | the web seals the tube |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: same.
- Sound: three soft low notes, one per 'không ai'.
- After-state: The tube under a web.

### S05 · 0:17.0-0:18.7 · f510-f560 · "Rồi nhà dọn kho."
- Gloss: Then the family cleared out the storage.
- Spine link: 2. Viewer must get: 2026: someone comes up.
- In: dissolve 6 f. Out: locked.
- Set: loft. Light: day.
- Build: same loft, 2026: heavier dust.
- Blocking: The partner's head pops up at [0, -1.05] f540, a torch beam ahead of it.
  - partner at [0, -1.05], front; head up through the hatch; neutral -> shock.
- Action, against the words: f526 a thump under the door, f533 ('kho') it swings open to vertical and bangs on its stop; dust bursts up in the light; f536 a torch beam sweeps the boards; f540 the partner's head rises, he spots the tube.
- Acting: partner: curious -> eyebrows up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 510 | open | [-0.05, 3.12, -0.3] | [0.1, 2.85, -2] | 54 | 0.15 | 4 | the wide frame, 2026 |

- Kicks (7 f): f533 strength 0.6.
- Physics & FX: door: pushed up from below, swings 90 deg in 6 f, bounces 4 deg on its stop.
- Light & mood: grey day plus a torch cone.
- Sound: thump f526, door bang f533, dust puff, torch click f536.
- After-state: Hatch open.

### S06 · 0:18.7-0:20.0 · f560-f600 · "Có người kéo nó ra,"
- Gloss: Someone pulls it out,
- Spine link: 2. Viewer must get: He takes the tube down.
- In: locked. Out: cut (match on the tube going down the hole).
- Set: loft. Light: day.
- Build: same.
- Blocking: The partner climbs a rung higher (feet y 1.6, at [0, -1.22]), crouched over the rim.
  - partner at [0, -1.22], front; reach, drag, duck; effort -> grin.
- Action, against the words: f562-574 he rises a rung; f576-586 ('kéo' f580) his arm reaches the tube and drags it off the boards, the web tearing in strands; f588-598 he ducks down through the hatch with it ('ra' f594).
- Acting: effort -> grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 560 | open | [-0.05, 3.12, -0.3] | [0.1, 2.85, -2] | 54 | 0.2 | 4 |  |
| 562 | glide 20 f | [0.35, 3.05, -0.35] | [0, 2.85, -1.45] | 46 | 0.2 | 8 | in on the pull |

- Kicks (7 f): none.
- Physics & FX: web strands snap and hang; dust cloud where the tube lay, a clean stripe left on the boards.
- Light & mood: same.
- Sound: web snaps, a scrape.
- After-state: A clean stripe on the boards where the tube lay (stays in S19).

### S07 · 0:20.0-0:21.5 · f600-f645 · "mở cuộn,"
- Gloss: unrolls it,
- Spine link: 2. Viewer must get: On the landing floor, the sheet rolls out.
- In: cut. Out: push.
- Set: landing. Light: day.
- Build: the landing in 2026: the stepladder under the hatch, the clear-out bag; the paint tin.
- Blocking: The owner sits on the carpet at [-0.55, 0.1] beside the far end of the sheet; the partner stands at [0.75, 1.3] with the paint tin.
  - owner at [-0.55, 0.1], front; sit on the floor, push the roll; neutral.
  - partner at [0.75, 1.3], front; hold the tin, drop it; neutral.
- Action, against the words: f600-612 the tube is already on the carpet at the far end; f616-620 she gives it a push ('cuộn' f620): it rolls toward the lens, unrolling, to full length by f638; the near end springs back up into a 15 cm curl f638-642; f641 the partner drops the paint tin on the curl: it lands f645 and flattens it.
- Acting: owner curious; partner bored.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 600 | open | [0.85, 1.85, 2.4] | [0.05, 0.25, 0.5] | 50 | 0.15 | 5 | high over the landing floor |

- Kicks (7 f): f645 strength 0.4.
- Physics & FX: roll: pushed at 1.9 m/s, rolling friction brings it to the end; tin: dropped from 0.85 m with 0.8 m/s toward -x, lands on the curl f645, rocks 2 f.
- Light & mood: 2026 day, white ceiling light.
- Sound: paper unrolling rasp f620-638, tin clunk f645.
- After-state: The sheet flat on the carpet, the tin on its near end.

### S08 ★ · 0:21.5-0:26.5 · f645-f795 · "và nhìn: trầy xước, dính keo, nhăn nhúm, mặt sau còn rách một mảng."
- Gloss: and looks: scratched, stained with glue, creased, and a chunk torn off the back.
- Spine link: 2. Viewer must get: It's a wreck.
- In: push. Out: glide.
- Set: landing. Light: day.
- Build: the sheet's damage layers: a scratch across row 2, a glue blob on row 6, a crease across rows 8-9, the torn back corner (top left).
- Blocking: Owner still on the floor at the top-left corner.
  - owner at [-0.55, 0.1], front; lift the corner; pained.
- Action, against the words: f645-660 low macro on the scratch ('trầy xước' f653-673); f676 glide to the glue blob ('dính keo' f687); f706 to the crease ('nhăn nhúm' f716); f745 to the top-left corner: the owner lifts it f752-764 ('mặt sau' f741), it folds back and shows the torn back ('rách' f767), she lets go f788.
- Acting: owner: lips pressed, wincing at each spot.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 645 | open | [0.08, 0.424, 0.61] | [-0.07, 0.004, 0.29] | 34 | 0.2 | 12 | the scratch |
| 676 | glide 26 f | [0.36, 0.384, 0.938] | [0.24, 0.004, 0.638] | 34 | 0.2 | 12 | the glue |
| 706 | glide 26 f | [0, 0.404, 1.12] | [-0.1, 0.004, 0.82] | 34 | 0.2 | 12 | the crease |
| 740 | glide 22 f | [-0.05, 0.75, 0.75] | [-0.31, 0.124, 0.09] | 38 | 0.2 | 10 | the torn back |

- Kicks (7 f): none.
- Physics & FX: the corner: a fold along the diagonal 18 cm in, lifted to 120 deg and let fall (paper flutter, settles 6 f).
- Light & mood: same.
- Sound: a sad violin sting under the list (Meme Violin Sad Violin, low).
- After-state: The sheet as it was, damage showing.

### S09 ★ · 0:26.5-0:29.3 · f795-f880 · ""Giấy dán tường hả? Vứt đi cho rộng chỗ.""
- Gloss: "Wallpaper? Bin it, we need the space."
- Spine link: 2. Viewer must get: It looks exactly like the wallpaper, so he bins it.
- In: glide. Out: glide.
- Set: landing. Light: day.
- Build: the right wall's wallpaper (same faded grid); the bin bag.
- Blocking: The partner at [1.0, 1.28], beside the sheet's right edge; the owner gets up and stands at [-0.4, 0.3].
  - partner at [1, 1.28], front; press to the wall, shrug, toss; neutral -> smirk.
- Action, against the words: f795-811 he lifts the sheet off the floor and presses it flat to the right wall: it matches the wallpaper ('Giấy dán tường' f799-815); he looks from it to the lens, shrugs ('hả' f821). f834 ('Vứt đi') he peels it off; it rolls up loosely in his hands f836-846; f848 he tosses it: it arcs across and drops upright into the bin bag f860 ('chỗ').
- Acting: partner: deadpan, shrug, toss.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 795 | open | [-0.65, 1.45, 2.3] | [1.15, 1.2, 0.55] | 46 | 0.2 | 6 | the sheet on the wall |
| 840 | glide 20 f | [-0.45, 1.4, 2.1] | [1, 0.85, 0.2] | 46 | 0.2 | 6 | follow the toss to the bag |

- Kicks (7 f): f860 strength 0.3.
- Physics & FX: the toss: a tube of 0.25 kg thrown at (−1.3, 2.0, −1.8) m/s, lands upright in the bag neck, wobbles.
- Light & mood: same.
- Sound: paper slap on the wall f811; HUH? no: a flat 'bruh' beat f821 (BRUH meme); toss whoosh f848, rustle in the bag f860.
- After-state: The tube sticks up out of the bin bag.

### S10 · 0:29.3-0:35.0 · f880-f1050 · "May thay, người chủ để ý thấy cả thế giới đang phát điên vì thẻ Pokémon, nên ôm nó đi hỏi,"
- Gloss: Luckily the owner noticed the whole world going mad for Pokémon cards, so she hugged it and took it to ask,
- Spine link: 3. Viewer must get: She saves it; the TV shows the card craze.
- In: glide. Out: dissolve 6 f.
- Set: landing. Light: day.
- Build: the doorway and the living-room TV.
- Blocking: The owner dashes from [-0.4, 0.3] to [0.58, -0.05] f885-897, pulls the tube out of the bag; then turns to the TV.
  - owner at [0.58, -0.05], front; dash, yank, stare, hug; shock -> stern.
- Action, against the words: f885-897 ('May thay') she dashes and yanks the tube out of the bag f900; f925-955 the camera swings to the doorway: the TV news shows a crowd shoving at a card-shop shelf, cards flying ('phát điên' f972-985); f1000-1020 back to her: she hugs the tube to her chest ('ôm' f1028).
- Acting: owner: alarm -> stare at the TV -> tight hug, determined.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 880 | open | [-0.45, 1.4, 2.1] | [0.75, 1, -0.1] | 46 | 0.2 | 6 | she grabs it |
| 925 | glide 40 f | [0.3, 1.45, 2.5] | [-3.6, 1.1, 1.6] | 40 | 0.2 | 6 | through the doorway to the TV |
| 1000 | glide 24 f | [-0.2, 1.5, 1.9] | [0.58, 1.15, -0.05] | 40 | 0.3 | 10 | the hug |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: same; the TV glows.
- Sound: dash footsteps; bag rustle f900; TV crowd roar f960-1000; a hug squeeze.
- After-state: She holds the tube.

### S11 · 0:35.0-0:37.8 · f1050-f1135 · "chắc là với vẻ mặt của người vừa dò vé số."
- Gloss: probably with the face of someone checking a lottery ticket.
- Spine link: 3. Viewer must get: At the valuation counter, lottery face.
- In: dissolve 6 f. Out: cut.
- Set: auction. Light: day.
- Build: the auction house counter.
- Blocking: Owner at [-3.55, -1.95] (front-left of the counter), the valuer behind it at [-2.6, -3.15], the tube on the mat.
  - owner at [-3.55, -1.95], front; put down, squeeze; pained.
  - valuer at [-2.6, -3.15], front; stand; neutral.
- Action, against the words: f1052-1080 she sets the tube on the mat and steps back; f1100-1130 she squeezes her eyes shut, peeks, a sweat drop ('dò vé số' f1110); a lottery ticket sticks out of her cardigan pocket.
- Acting: owner: squeeze -> one-eye peek; valuer neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1050 | open | [-2.95, 1.45, 0.15] | [-3.45, 1.35, -2.05] | 40 | 0.3 (punch 0.6 for 14 f) | 10 | her lottery face |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: auction house day.
- Sound: room tone; a drum roll tick under the peek.
- After-state: —

### S12 · 0:37.8-0:41.5 · f1135-f1245 · "Khoan đã, ai lại có nguyên một tờ thẻ chưa cắt nằm trong nhà?"
- Gloss: Wait, who has a whole uncut sheet lying around at home?
- Spine link: 4. Viewer must get: The valuer can't believe it.
- In: cut. Out: dissolve 8 f (flashback, 1999).
- Set: auction. Light: day.
- Build: loupe on the counter.
- Blocking: valuer at his mark, close.
  - valuer at [-2.6, -3.15], front; freeze, lean; shock -> stern.
- Action, against the words: f1140 ('Khoan') he freezes mid-reach for the loupe, eyes go wide; f1160-1230 slow push on his face as he leans in to the lens.
- Acting: valuer: shock -> narrowed suspicion.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1135 | open | [-2.45, 1.55, -1.75] | [-2.6, 1.6, -3.15] | 34 | 0.4 | 12 | his face |

- Kicks (7 f): f1140 strength 0.5.
- Physics & FX: none.
- Light & mood: same.
- Sound: record scratch f1140 (cut), Huh meme f1142.
- After-state: —

### S13 · 0:41.5-0:46.3 · f1245-f1390 · "Hóa ra, một người thân từng làm cho chuỗi đồ chơi KB Toys suốt những năm chín mươi."
- Gloss: It turns out a relative worked for the KB Toys chain all through the nineties.
- Spine link: 4. Viewer must get: 1999: the relative in his KB Toys vest.
- In: dissolve 8 f. Out: dissolve 6 f.
- Set: store. Light: golden.
- Build: the store, 1999.
- Blocking: The relative at [-2.15, -1.6] by the shelves, front view.
  - relative at [-2.15, -1.6], front; stack a box; whistle.
- Action, against the words: f1250-1300 he lifts a toy box and slides it onto the top shelf; f1339 ('KB Toys') the camera tilts up to the hanging KB TOYS sign; title 1999 f1262.
- Acting: relative: cheerful, a whistle.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1245 | open | [-0.8, 1.45, 0.4] | [-2.2, 1.35, -1.7] | 42 | 0.2 | 8 | the relative at work |
| 1330 | glide 36 f | [-0.3, 1.4, 0.6] | [-0.4, 2.35, -2.2] | 42 | 0.2 | 6 | up to the sign |

- Kicks (7 f): none.
- Physics & FX: box set down with a 1 cm settle.
- Light & mood: golden 1999, strip lights.
- Sound: shop chatter, a till ding f1300, whistle.
- After-state: —

### S14 ★ · 0:46.3-0:52.6 · f1390-f1578 · "Và đây không phải giấy dán tường. Đây là tờ thẻ hologram bộ Fossil,"
- Gloss: And this isn't wallpaper. This is a holographic Fossil card sheet,
- Spine link: 5. Viewer must get: Flattened under the lamp, the holos shine.
- In: dissolve 6 f. Out: through-object 8 f (dive into the Gengar, dissolve to the same card on the fresh sheet).
- Set: auction. Light: day.
- Build: the sheet on the baize (damaged), the desk lamp on.
- Blocking: The valuer at [-2.6, -3.15], crouched over the far edge; the owner at her mark.
  - valuer at [-2.6, -3.15], front; unroll, lamp; neutral -> grin.
  - owner at [-3.55, -1.95], front; watch; nervous -> shock.
- Action, against the words: f1395-1418 ('không phải giấy dán tường') he rolls the tube out across the mat toward the lens; f1420 he switches the lamp on; f1498 ('hologram') a gleam sweeps the foil across all 121 cards; title FOSSIL f1525; f1540-1575 the camera dives into one Gengar.
- Acting: valuer: careful -> delighted; owner: one eye open -> both.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1390 | open | [-1.75, 1.6, -0.85] | [-2.6, 0.95, -2.45] | 42 | 0.15 | 6 | the unroll on the mat |
| 1470 | glide 26 f | [-2.6, 1.75, -1.2] | [-2.6, 0.9, -2.45] | 40 | 0.2 | 6 | over the whole sheet for the gleam |
| 1540 | glide 34 f | [-2.6, 1.071, -2.388] | [-2.6, 0.906, -2.488] | 28 | 0.4 | 10 | into the Gengar |

- Kicks (7 f): none.
- Physics & FX: the roll: pushed at 1.4 m/s, unrolls to full length f1418.
- Light & mood: day + the lamp's warm pool.
- Sound: unroll rasp, lamp click f1420, shimmer + Wowww meme f1498.
- After-state: Sheet flat on the mat.

### S15 ★ · 0:52.6-0:55.0 · f1578-f1650 · "y như lúc vừa ra khỏi máy in, trước khi bị chặt thành từng lá."
- Gloss: exactly as it came off the press, before it was chopped into single cards.
- Spine link: 5. Viewer must get: Off the press; the guillotine cuts it into cards.
- In: through-object 8 f. Out: dissolve 6 f.
- Set: press. Light: golden.
- Build: the press, rollers turning, the guillotine, the tray of cut cards.
- Blocking: nobody (the machines).
- Action, against the words: f1578-1600 pull back from the same Gengar on a perfect sheet lying on the guillotine bed; the rollers turn and the next sheet slides out ('máy in' f1585); f1606-1614 the blade rises; f1617 ('chặt') it drops: the last row is cut off and the strip of 11 cards slides off the bed into the tray, knocking loose cards that skid and settle by f1640.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1578 | open | [0.75, 1.171, -1.988] | [0.75, 1.006, -2.088] | 28 | 0 | 10 |  |
| 1580 | glide 34 f | [1.9, 1.55, -0.15] | [0.6, 0.95, -1.7] | 44 | 0.2 | 6 | the press and the guillotine |

- Kicks (7 f): f1617 strength 0.9.
- Physics & FX: blade: 1 f drop from y 1.55 to 1.01, 2 f rebound; strip: slides 22 cm and tips into the tray; 9 loose cards skid (mu 0.35) and rest.
- Light & mood: golden 1999, skylight.
- Sound: press clatter loop, roller hiss, CHOP f1617 (Punch Hit), cards slapping.
- After-state: Cut cards in the tray.

### S16 · 0:55.0-0:59.2 · f1650-f1775 · "Những tờ như thế từng được in riêng cho một đợt khuyến mãi của KB Toys."
- Gloss: Sheets like that were printed specially for a KB Toys promotion.
- Spine link: 5. Viewer must get: The promo board in the 1999 store.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: store. Light: golden.
- Build: the promo board with the pristine sheet pinned.
- Blocking: Two kids at their marks look up at the board; the relative beside it.
  - kid1 at [0.15, -3], front; point up; shock.
  - kid2 at [0.85, -3.05], front; look up; grin.
  - relative at [-0.4, -3.15], front; tap the header; grin.
- Action, against the words: f1660-1700 push up to the board; kids point at it f1700 ('khuyến mãi' f1728); the relative taps the PROMOTION header f1746 ('KB Toys').
- Acting: kids: shock -> grin; relative proud.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1650 | open | [0.4, 1.3, -0.3] | [0.45, 1.6, -3.9] | 46 | 0.2 | 6 | the promo board |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden 1999.
- Sound: kids 'ooh' (Kids Cheering, short) f1700.
- After-state: —

### S17 · 0:59.2-1:05.0 · f1775-f1950 · "Giờ thì tờ giấy suýt bị vứt ấy được chụp cận từng vết xước như minh tinh, kèm hẳn biên bản tình trạng."
- Gloss: Now the paper that nearly got binned is shot close-up, scratch by scratch, like a film star, with its own condition report.
- Spine link: 6. Viewer must get: A photo shoot for a wreck.
- In: dissolve 6 f. Out: glide.
- Set: auction. Light: day.
- Build: the photo corner: the easel with the sheet, softboxes, tripod camera, red rope, the report on its stand.
- Blocking: The photographer at [3.05, -1.95] by the tripod; the valuer stamps the report.
  - photographer at [3.05, -1.95], front; shoot; stern.
- Action, against the words: f1780-1830 wide of the set-up; f1842 ('chụp') FLASH; f1850 push on the scratch, FLASH f1859; glue, FLASH f1873; crease, FLASH f1886 ('minh tinh'); f1900-1930 glide to the report: a rubber stamp comes down f1923 ('biên bản') leaving CONDITION REPORT in red.
- Acting: photographer: crouched, serious.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1775 | open | [2.55, 1.55, -0.25] | [2.45, 1.3, -3.6] | 44 | 0.15 | 4 | the shoot |
| 1848 | glide 8 f | [2.33, 1.63, -2.99] | [2.28, 1.61, -3.74] | 30 | 0.3 | 10 | the scratch, close |
| 1868 | glide 8 f | [2.64, 1.282, -2.99] | [2.59, 1.262, -3.74] | 30 | 0.3 | 10 | the glue |
| 1882 | glide 8 f | [2.3, 1.1, -2.99] | [2.25, 1.08, -3.74] | 30 | 0.3 | 10 | the crease |
| 1900 | glide 20 f | [3, 1.45, -2.35] | [3.25, 1.12, -3.6] | 38 | 0.2 | 10 | the condition report |

- Kicks (7 f): f1923 strength 0.4.
- Physics & FX: stamp: down in 2 f, up in 4.
- Light & mood: day + softbox glow; flashes white 2 f.
- Sound: Camera shutter meme on each flash (f1842, 1859, 1873, 1886); stamp thunk f1923.
- After-state: Report stamped.

### S18 · 1:05.0-1:09.5 · f1950-f2085 · "Nhà đấu giá Cullens of Surrey định giá từ sáu đến mười nghìn bảng Anh."
- Gloss: The auction house Cullens of Surrey estimates six to ten thousand pounds.
- Spine link: 6. Viewer must get: £6,000 - £10,000.
- In: glide. Out: glide.
- Set: auction. Light: day.
- Build: the lot board, the chairs.
- Blocking: The owner seated in the front row (seat 2).
  - owner at [0.3, -2.6], front, seated; sit; neutral -> shock (gape).
- Action, against the words: f1955-1990 travel across to the lot board: CULLENS OF SURREY / LOT 1 / UNCUT FOSSIL HOLO SHEET 1999 lit; f2036 ('sáu') ESTIMATE £6,000 flips on; f2056 ('mười') - £10,000 flips on; f2062 the owner's jaw drops.
- Acting: owner: gape 0.6.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1950 | open | [3, 1.45, -2.35] | [3.25, 1.12, -3.6] | 38 | 0 | 6 |  |
| 1955 | glide 44 f | [0.75, 1.25, 0.2] | [0, 1.95, -4.9] | 44 | 0.2 (punch 0.6 for 12 f) | 6 | the lot board over the owner |

- Kicks (7 f): f2036 strength 0.3; f2056 strength 0.5.
- Physics & FX: none.
- Light & mood: same.
- Sound: board flap f2036, f2056 + Kaching f2056.
- After-state: Board shows the estimate.

### S19 · 1:09.5-1:12.5 · f2085-f2175 · "Chủ nhật, hai mươi chín tháng mười một, búa sẽ gõ."
- Gloss: Sunday, 29 November, the hammer will fall.
- Spine link: 6. Viewer must get: The date; the gavel is ready.
- In: glide. Out: dissolve 8 f (back to the loft).
- Set: auction. Light: day.
- Build: rostrum, gavel.
- Blocking: The auctioneer behind the rostrum.
  - auctioneer at [0, -4.65], front; gavel up, hold; stern.
- Action, against the words: f2090-2120 glide to the auctioneer; title 29 · 11 · 2026 f2098; f2140-2150 he raises the gavel and holds it at the top ('búa sẽ gõ' f2147-2164): a beat of stillness, it does not fall.
- Acting: auctioneer: stern, eyebrows up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2085 | open | [0.75, 1.25, 0.2] | [0, 1.95, -4.9] | 44 | 0 | 6 |  |
| 2090 | glide 30 f | [0.45, 1.5, -2.85] | [0, 1.85, -4.6] | 38 | 0.2 (punch 0.5 for 14 f) | 10 | the auctioneer, gavel up |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: same.
- Sound: room hush; one held note; a heartbeat thump f2164.
- After-state: Gavel held up.

### S20 · 1:12.5-1:16.3 · f2175-f2290 · "Còn cái quạt hỏng thì vẫn nằm trên gác. Biết đâu đấy."
- Gloss: And the broken fan is still up in the loft. Who knows.
- Spine link: 7. Viewer must get: Maybe the fan is worth something too.
- In: dissolve 8 f. Out: end.
- Set: loft. Light: day.
- Build: the loft, 2026: the clean stripe where the tube lay, the fan.
- Blocking: The partner's head up through the hatch at [0, -1.05] from f2185.
  - partner at [0, -1.05], front; head up, eyes on the fan; stern -> grin.
- Action, against the words: f2180-2200 the hatch door swings up, the partner's head rises, eyes on the fan ('quạt hỏng' f2201); f2240 ('gác') the loose blade finally drops off: it hits the boards, bounces twice and rests; f2252 ('Biết đâu') he squints at it; push to the end.
- Acting: partner: suspicious squint, then a small grin f2268.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2175 | open | [0.05, 3.05, -0.3] | [0.3, 2.95, -1.95] | 50 | 0.25 (punch 0.5 for 14 f) | 6 | the fan and his head |

- Kicks (7 f): f2240 strength 0.4.
- Physics & FX: blade (60 g): falls 0.8 m from the cage, bounces twice (restitution 0.3), rests flat.
- Light & mood: grey day.
- Sound: door bang f2182; blade clank f2242 + rattle; Suspicious Sound meme f2252.
- After-state: End on the fan.

