# Monaco auction: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/monaco-auction/plan.json` (0 errors; three fast travels are intentional: into the window in S03, the swing to the audience in S04, the crane over the scooters in S10).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2280 frames (VO ends f2266). The saleroom and the quay share one frame: the quay is the outside of the saleroom's harbour wall, and both are built in every saleroom/quay shot so the camera can pass through the window.

## Transitions
One hard cut (into S07, the shout). Place changes in the saleroom travel (out through the window and back in, glides between the stage, the audience and the aisle); time jumps dissolve (the 2006 flashback S08 and back, S17, S18); the box-to-cubby match into the cellar is a through-object dissolve.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f335 | f392 | 17 · 11 · 2026 |
| f478 | f515 | 70 LOTS |
| f1124 | f1180 | 2006 |
| f1330 | f1384 | €18,000 - €20,000 |
| f1492 | f1514 | X10 |
| f2198 | f2216 | 2026 |

## Sets

### saleroom
- Origin in the shared world: [0, 0, 0]. Axes: +x toward the harbour wall (x 6), the stage at the back wall z -6 faces +z, the audience toward +z.
- Light: day; sun az/el [70, 50]. Open camera sides: +z (the room), the harbour windows at x 6.
- Marks [x, z]: auctioneer [-2, -5]; porter [0.55, -4.9]; porter_v [1, -4.25]; waiter [1.95, -4.25]; minh [-0.9, -2.2].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: cream panelled walls (white dado 1 m, gold mouldings) x -6..6, z -6..6, 4.5 m high, red carpet, white ceiling with two chandeliers | [0, 2.25, 0] | [12, 4.5, 12] |
| windows | new: three tall windows in the x 6 wall (1.6 x 2.4 m, sills at y 1.0) at z -2.6, 1.4, 4.4: real openings onto the quay | [6, 2.2, -2.6] | [0.2, 2.4, 1.6] |
| stage | adapt:stage (oak, top y 0.3) | [0, 0.15, -4.9] | [8, 0.3, 2.2] |
| rostrum | reuse:rostrum + sound block (top y 1.45) | [-2, 0.875, -4.6] | [0.9, 1.15, 0.5] |
| lot_table | new: oak table draped in dark-red velvet, top y 1.08 | [-0.4, 0.69, -4.45] | [1.8, 0.78, 0.5] |
| yacht | new: model yacht 45 cm (white hull, blue stripe, cabin, mast) on two brass cradles | [-1, 1.2, -4.45] | [0.45, 0.3, 0.12] |
| diamond | new: cut diamond (octahedron, 5 cm) on a navy cushion | [-0.45, 1.13, -4.45] | [0.14, 0.1, 0.14] |
| watch | new: gold watch on a black stand, tag €2,500,000 | [0, 1.16, -4.45] | [0.1, 0.16, 0.06] |
| box | new: the booster display box (see box): built box, printed faces, REAL Rayquaza δ art, shrink-wrap gloss layer | [0.4, 1.22, -4.55] | [0.2, 0.28, 0.11] |
| vitrine | new: white plinth 50 x 100 x 50 cm, glass hood 32 x 40 x 24 cm with brass edges, front door hinged on its left edge | [1.4, 1.5, -4.6] | [0.32, 0.4, 0.24] |
| crown | new: small gold crown (lathe band + 5 points + red stones), 12 cm, set on the vitrine top in S05 | [1.4, 1.76, -4.6] | [0.12, 0.08, 0.12] |
| slab_stand | new: white plinth 36 x 100 cm, acrylic foot; reuse:slabReal with the REAL Poncho Pikachu, GEM MT 10 | [2.4, 1.47, -4.6] | [0.19, 0.3, 0.012] |
| lot_board | new: dark lot board on the back wall, gold text: LOT 1 / ESTIMATE ... (flips in S06) | [1.4, 2.9, -5.94] | [1.5, 0.8, 0.04] |
| lots70 | new: two-tier display table along the harbour wall (x 5.0-5.7, z -0.8..5.6), 70 small lots (mini slabs and sealed packs, real scans), numbered tags 1-70 on its front edge | [5.35, 0.9, 2.4] | [0.7, 0.3, 6.4] |
| chairs | new: 18 gilt chairs, red seats (seat y 0.46), backs toward +z | [-1.3, 0.45, -1.2] | [4.6, 0.9, 2.6] |
| scooters | new: ten red step-through scooters (wheels, footboard, seat, handlebar, front shield) parked down the aisle x 2.3 from S10 on, each with a €1,900 tag | [2.3, 0.55, 0.2] | [0.6, 1.1, 7.8] |

### quay
- Origin in the shared world: [0, 0, 0]. Axes: same frame as the saleroom: the façade is the outside of its x 6 wall, the quay runs along z, the harbour at x > 16.
- Light: golden; sun az/el [150, 30]. Open camera sides: +x.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| facade | new: cream stucco façade x 6..6.4, z -16..16, 13 m tall, cornices, windows (three real openings), gold lettering HÔTEL DES VENTES DE MONTE-CARLO at y 4.6 | [6.2, 6.5, 0] | [0.4, 13, 32] |
| quay | new: stone quay x 6..16 with a stone edge, palms at z -10, -3, 7 | [11, 0, 0] | [10, 0, 60] |
| water | reuse:water (y -0.4) to the horizon | [200, -0.4, 0] | [380, 0, 400] |
| yachts | new: four moored yachts 9-14 m (white hulls, blue stripe, cabins, masts) | [20, 0.6, 0] | [3, 3, 30] |
| hills | new: hazy green hills with pale houses behind the town (far, -x) | [-260, 40, 0] | [40, 80, 600] |

### cellar
- Origin in the shared world: [0, 0, -80]. Axes: the rack wall at z -2.6 faces +z; bottles on the left half (x -1.3..-0.05), sealed boxes on the right (x 0.05..1.3).
- Light: golden; sun az/el [120, 40]. Open camera sides: +z.
- Marks [x, z]: somm [-1.05, -2.15].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| vault | new: stone vault x -3..3, z -2.8..4.5, 3 m high, stone floor | [0, 1.5, 0.8] | [6, 3, 7.3] |
| rack | new: oak rack 2.6 x 2.25 m: 4 x 6 bottle cubbies (bottles neck-out) and 3 x 6 box cubbies (one box each) | [0, 1.2, -2.6] | [2.6, 2.25, 0.4] |
| year_plate | new: brass year plate 60 x 20 cm on the rack top, rolling digits | [0.68, 2.47, -2.58] | [0.6, 0.2, 0.02] |
| barrel | new: oak barrel table (r 0.3, top y 0.95), a glass on it | [-0.55, 0.47, -1.8] | [0.6, 0.95, 0.6] |

### kitchen
- Origin in the shared world: [-60, 0, 0]. Axes: the back wall z -2.5 faces +z; door in the right wall (x 2.2).
- Light: golden; sun az/el [120, 30]. Open camera sides: +z.
- Marks [x, z]: kid [-0.25, -1.12]; mom [0.15, -0.75]; minh_in [2.4, -0.4]; minh [0.45, -0.45].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: kitchen x -2.2..2.2, z -2.5..2, 2.7 m high: tiled floor, green half-tiled walls, a window above the stove | [0, 1.35, -0.25] | [4.4, 2.7, 4.5] |
| table | new: wooden table 110 x 70 cm, top y 0.75, two stools | [-0.35, 0.375, -0.6] | [1.1, 0.75, 0.7] |
| cupboard | new: tall painted cupboard 80 x 175 x 45 cm, two doors (top y 1.75): the box ends up on top | [-1.55, 0.875, -2.22] | [0.8, 1.75, 0.45] |
| stove | new: two-burner stove on a counter, a pot | [1.3, 0.45, -2.2] | [1, 0.9, 0.55] |
| props | new: noodle bowl, a tin labelled ĂN SÁNG tipped over with coins, the box (2006) | [-0.5, 0.89, -0.5] | [0.2, 0.28, 0.11] |

## Cast

- **auctioneer:** black suit, red tie, grey hair, stout. Items: gavel. Views: front.
- **porter:** white jacket, black tie, black trousers, dark hair. Items: the box, the crown. Views: front, side.
- **waiter:** black waistcoat, white shirt, bow tie, slick hair. Items: wine bottle, the cork. Views: front.
- **gentlemen g0-g17:** dark suits (navy, charcoal, black, brown), mixed hair, two with glasses. Items: numbered paddles. Views: front, seated.
- **minh:** navy suit, brown hair, moustache. Items: paddle, flowers (S18). Views: front, side.
- **kid:** blue tee, red cap, kid build. Items: none. Views: front, seated.
- **mom:** green dress, dark hair (2006) / grey hair (2026). Items: the box. Views: front, side.

## Scenes

### S01 ★ · 0:00.0-0:09.2 · f0-f276 · "Ở Monaco, nơi người ta đấu giá du thuyền, kim cương và những chiếc đồng hồ đắt hơn cả căn nhà, có người vừa đặt lên bàn đấu giá một hộp thẻ Pokémon chưa bóc."
- Gloss: In Monaco, where they auction yachts, diamonds and watches pricier than a house, someone just put an unopened Pokémon box on the auction table.
- Spine link: 1. Viewer must get: Luxury lots, then a Pokémon box among them.
- In: open on the act. Out: travel (pull back out through the harbour window).
- Set: saleroom. Light: day.
- Build: adapt:stage, reuse:rostrum; new: velvet lot table with the yacht model, the diamond on a cushion, the watch with its tag; new: the box.
- Blocking: Auctioneer front at his mark, gavel up from frame 0. Porter enters behind the table from x 1.8 walking -x (side view, box at his chest), reaches his mark f236, front view.
  - auctioneer at [-2, -5], front; gavel strike f3; stern -> grin.
  - porter at [0.55, -4.9], side -> front; carry, lower, thump f257; proud.
- Action, against the words: f0-2 gavel held up; f3 strike (1 f before 'Monaco'): the yacht rocks on its cradles. f30-90 glide along the table: diamond (sparkle f80 'kim'), watch (tag €2,500,000, glint f118 'đồng hồ'). f185-236 the porter walks in; f240-256 he lowers the box; f257 thump on 'bóc': the diamond cushion and the watch hop, a dust puff.
- Acting: Auctioneer stern, then a satisfied grin; porter proud.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [-1.5, 1.85, -1.55] | [-1.5, 1.4, -4.5] | 50 | 0.2 | 4 | gavel and yacht |
| 30 | glide 60 f | [-0.2, 1.6, -2.6] | [-0.2, 1.18, -4.45] | 42 | 0.15 | 8 | glide along the lots |
| 150 | glide 45 f | [1.9, 1.55, -3.3] | [0.4, 1.2, -4.55] | 36 | 0.2 (punch 0.6 for 14 f) | 8 | the box arrives |

- Kicks (7 f): f3 strength 1; f257 strength 0.8.
- Physics & FX: gavel: 1 f down, 3 f rebound. Yacht: rocks 4 deg, damped. Thump: the box drops 2 cm in 1 f; diamond cushion and watch hop (0.25 m/s), settle.
- Light & mood: day, warm chandelier light.
- Sound: gavel crack f3; murmur; diamond ting f80; watch tick; footsteps f185-236; heavy thump f257 + Instagram Thud meme.
- After-state: The box sits on the velvet at the table's back edge.

### S02 · 0:09.2-0:13.2 · f276-f396 · "Hôtel des Ventes de Monte-Carlo, chiều thứ Ba, mười bảy tháng mười một."
- Gloss: Hôtel des Ventes de Monte-Carlo, Tuesday afternoon, 17 November.
- Spine link: 2. Viewer must get: Where and when.
- In: travel. Out: travel.
- Set: quay. Light: golden.
- Build: new: the façade with its lettering, the quay, palms, yachts, water, hills.
- Blocking: nobody.
- Action, against the words: f276-316 the camera pulls back from the box out through the window (z -2.6); f320-365 it cranes up and out over the moored yachts until the façade lettering sits upper middle. Title 17 · 11 · 2026 f335.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 276 | open | [1.9, 1.55, -3.3] | [0.4, 1.2, -4.55] | 36 | 0 | 4 | start where S01 ends |
| 277 | glide 40 f | [10, 3.1, -1.3] | [0.4, 1.2, -4.55] | 40 | 0 | 2 | out through the window |
| 320 | glide 45 f | [26, 9, 4] | [6, 4.4, -1.5] | 44 | 0.12 | 2 | the façade and the harbour |

- Kicks (7 f): none.
- Physics & FX: yachts bob 3 cm on the swell.
- Light & mood: golden afternoon.
- Sound: room tone falls away; gulls, water slap, a far horn.
- After-state: —

### S03 · 0:13.2-0:17.3 · f396-f520 · "Lần đầu tiên nơi này mở hẳn một phiên Pokémon, bảy mươi lô hàng."
- Gloss: For the first time this house holds a whole Pokémon sale: seventy lots.
- Spine link: 2. Viewer must get: A full sale of 70 Pokémon lots.
- In: travel. Out: glide.
- Set: quay. Light: day.
- Build: new: the 70-lot display table with numbered tags (real scans on mini slabs, sealed packs).
- Blocking: nobody.
- Action, against the words: f396-446 fly back in through the window; f446-476 turn to the display table; f480-518 track along it, tags 1 → 70 passing. Title 70 LOTS f478.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 396 | open | [26, 9, 4] | [6, 4.4, -1.5] | 44 | 0 | 2 |  |
| 397 | glide 48 f | [8.2, 2.3, -2.6] | [0, 1.5, -2.6] | 44 | 0 | 2 | into the window |
| 446 | glide 40 f | [4.5, 1.5, -1.9] | [5.4, 1, 1.8] | 42 | 0 | 6 | turn to the lots |
| 487 | glide 32 f | [4.4, 1.45, 1.4] | [5.35, 1, 4.6] | 42 | 0.1 | 6 | track along the 70 lots |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: day inside.
- Sound: whoosh in; room tone; soft ticks as tags pass.
- After-state: —

### S04 · 0:17.3-0:22.0 · f520-f661 · "Hãy hình dung những quý ông áo vest ngồi nghiêm trang, chuẩn bị giơ bảng vì Pikachu."
- Gloss: Picture gentlemen in suits sitting solemnly, ready to raise their paddles for Pikachu.
- Spine link: 2. Viewer must get: Serious money, cartoon mouse.
- In: glide. Out: glide.
- Set: saleroom. Light: day.
- Build: new: 18 gilt chairs; gentlemen seated with paddles on their laps.
- Blocking: 18 gentlemen seated at SEATS, front view; Minh at seat 3.
  - gentlemen at [0.7, -2.2], front; all 18 seats (plan.seats): seated, paddle on lap -> up f630; stern.
- Action, against the words: f520-610 stern faces, paddles low; one adjusts his tie f572. f630 (2 f before 'Pikachu') all 18 paddles snap up at once and hold; f640 a few grins.
- Acting: stern, then the paddles up with straight faces.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 520 | open | [3.2, 1.6, -0.6] | [4.5, 1, 2.5] | 42 | 0 | 4 |  |
| 521 | glide 55 f | [2, 1.55, -3] | [-1.6, 1.05, -1] | 44 | 0.15 (punch 0.6 for 18 f) | 5 | the audience from the stage |

- Kicks (7 f): f630 strength 0.5.
- Physics & FX: paddles up in 3 f, 2 f overshoot.
- Light & mood: day.
- Sound: hushed room; a cough; paddle whoosh f630 in unison + a comic sting.
- After-state: Paddles back down by S05.

### S05 ★ · 0:22.0-0:32.1 · f661-f964 · "Lô chính là một hộp ba mươi sáu gói thẻ bộ EX Espèces Delta tiếng Pháp, năm hai nghìn không trăm lẻ sáu, còn nguyên màng niêm phong, nằm trong lồng kính như vương miện hoàng gia."
- Gloss: The main lot: a box of 36 packs of the French EX Espèces Delta set, from 2006, still in its seal, in a glass case like a royal crown.
- Spine link: 3. Viewer must get: The box, its set and year, sealed, treated like royalty.
- In: glide. Out: tilt.
- Set: saleroom. Light: day.
- Build: new: vitrine with the hinged door, the crown on a cushion on the lot table, the spotlight.
- Blocking: Porter behind the table at his mark (crouches), lifts the box, walks to porter_v (f676-700), sets it in the vitrine, closes the door; later lifts the crown onto the vitrine top.
  - porter at [0.55, -4.9], front; lift, carry, place, crown; careful -> proud.
- Action, against the words: f661-676 the porter lifts the box; f676-700 carries it to the vitrine; f702 sets it inside; f716 swings the door shut (click). f722-900 macro: front printing ESPÈCES DELTA / 36 BOOSTERS (f750), down to 2006 (f809), a gleam slides across the wrap on 'niêm phong' (f866-880). f905-935 pull back; the porter sets the crown on top f935; f941 a spotlight snaps on.
- Acting: porter careful, then proud.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 661 | open | [1.05, 1.75, -2] | [1.05, 1.35, -4.55] | 44 | 0.12 | 6 | porter, table and vitrine |
| 722 | glide 28 f | [1.4, 1.46, -4] | [1.4, 1.44, -4.6] | 30 | 0.12 | 12 | macro on the box through the glass |
| 790 | glide 30 f | [1.33, 1.38, -4.2] | [1.42, 1.36, -4.6] | 28 | 0.15 | 12 | down the printing to 2006 |
| 905 | glide 30 f | [1.4, 1.7, -2.55] | [1.4, 1.52, -4.6] | 40 | 0.2 (punch 0.6 for 16 f) | 6 | the crown and the spotlight |

- Kicks (7 f): f716 strength 0.3; f941 strength 0.4.
- Physics & FX: door: 0.5 s swing, a 2-deg rebound. Crown set down with a 1 cm settle.
- Light & mood: day; the spotlight adds a warm cone f941.
- Sound: soft footsteps; glass door click f716; shimmer on the gleam f866; trumpet fanfare sting f941.
- After-state: Box sealed in the vitrine, crown on top, spot on.

### S06 · 0:32.1-0:36.0 · f964-f1081 · "Giá ước tính, một trăm ba mươi đến một trăm tám mươi nghìn euro."
- Gloss: Estimate: 130,000 to 180,000 euros.
- Spine link: 3. Viewer must get: The number.
- In: tilt. Out: cut.
- Set: saleroom. Light: day.
- Build: the lot board on the back wall.
- Blocking: nobody.
- Action, against the words: f964-994 tilt up from the vitrine to the board; f989 ESTIMATE €130,000 flaps on; f1032 '- €180,000' joins it; the lights on the board blink once.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 964 | open | [1.4, 1.9, -1.2] | [1.4, 2.15, -5] | 40 | 0.15 (punch 0.5 for 14 f) | 4 | board above the vitrine |

- Kicks (7 f): f1032 strength 0.4.
- Physics & FX: flap tiles.
- Light & mood: day.
- Sound: flap clatter f989, f1032; a low hum.
- After-state: Board shows the estimate.

### S07 · 0:36.0-0:37.3 · f1081-f1118 · ""Một trăm tám mươi nghìn?"
- Gloss: 'A hundred and eighty thousand?'
- Spine link: 3. Viewer must get: One of them can't believe it.
- In: cut. Out: dissolve 6 f (flashback to 2006).
- Set: saleroom. Light: day.
- Build: Minh's chair tips over.
- Blocking: Minh at seat 3 stands up f1084, arms flung up; neighbours g2 and g4 turn to him.
  - minh at [-0.9, -2.2], front; sit -> leap up, arms up; shock + gape.
- Action, against the words: f1084 Minh shoots up (crouch to stand in 4 f), arms up, gape; his chair tips back f1086-1096 and slaps the floor f1096 (bounce, settles).
- Acting: Minh outraged-amazed; neighbours shocked.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1081 | open | [-0.8, 1.25, -3.9] | [-0.9, 1.5, -2.2] | 42 | 0.3 (punch 0.8 for 14 f) | 10 | low, he rises into the lens |

- Kicks (7 f): f1096 strength 0.6.
- Physics & FX: chair: hinges on its back legs, rotates 90 deg under gravity in 10 f, bounces 6 deg, settles.
- Light & mood: day.
- Sound: chair scrape f1084, clatter f1096; 'Huh' meme f1084.
- After-state: Chair lies on its back (seen again in S16? no: S16 is in the cellar).

### S08 · 0:37.3-0:39.6 · f1118-f1187 · "Hồi đó tôi mua hộp này bằng tiền ăn sáng!""
- Gloss: 'Back then I bought this box with my breakfast money!'
- Spine link: 3. Viewer must get: It was a kid's box once, bought with breakfast money.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: kitchen. Light: golden.
- Build: new: kitchen; the box (new, glossy), a noodle bowl, the ĂN SÁNG tin tipped over, coins.
- Blocking: Kid seated behind the table facing the lens; mum at the stove.
  - kid at [-0.25, -1.12], front; sit, push bowl, hug box; grin.
  - mom at [1.3, -1.75], front; stir; neutral.
- Action, against the words: f1125-1140 the kid pushes the bowl away (it slides 15 cm); f1145 he hugs the box with both arms, grinning; a coin rolls off the table f1150 and spins out on the floor. Title 2006.
- Acting: kid beaming; mum stirring, back to her pot (front view, looking at the pot).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1118 | open | [-0.35, 1.25, 1.1] | [-0.35, 0.95, -0.9] | 42 | 0.2 | 8 | kid, box, tin, bowl |

- Kicks (7 f): none.
- Physics & FX: bowl slides with friction; coin rolls and spins down.
- Light & mood: golden 2006 morning.
- Sound: kitchen sizzle; coin roll + spin; kid giggle.
- After-state: —

### S09 · 0:39.6-0:46.3 · f1187-f1390 · "Bên cạnh là một lá Pikachu khoác áo poncho Rayquaza, PSA mười điểm, mười tám đến hai mươi nghìn euro."
- Gloss: Next to it, a Pikachu wearing a Rayquaza poncho, PSA 10, 18,000 to 20,000 euros.
- Spine link: 4. Viewer must get: The second star lot, graded perfect.
- In: dissolve 6 f. Out: glide.
- Set: saleroom. Light: day.
- Build: reuse:slabReal with the REAL Poncho Pikachu on the slab stand; a second spotlight.
- Blocking: nobody.
- Action, against the words: f1219 (on 'Pikachu') the spotlight over the slab stand snaps on; f1240-1270 macro on the card (the poncho on 'Rayquaza' f1262); a gleam crosses the slab f1300 ('PSA'); f1320 pull back to medium. Title €18,000 - €20,000 f1330.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1187 | open | [2.2, 1.6, -2.5] | [2.2, 1.45, -4.6] | 40 | 0.15 | 6 | vitrine and the slab stand |
| 1236 | glide 30 f | [2.4, 1.5, -4.05] | [2.4, 1.47, -4.6] | 34 | 0.15 | 12 | macro on the card |
| 1318 | glide 26 f | [2.32, 1.56, -3.35] | [2.4, 1.4, -4.6] | 38 | 0.15 | 8 | room for the title |

- Kicks (7 f): f1219 strength 0.3.
- Physics & FX: none.
- Light & mood: day + spot.
- Sound: spot clunk f1219; shimmer f1300; a little Pikachu-ish squeak? no: a soft 'ding'.
- After-state: Spot stays on the slab.

### S10 · 0:46.3-0:50.6 · f1390-f1519 · "Một chú chuột điện mặc đồ hóa trang, đắt hơn chiếc xe máy của bạn chừng mười lần."
- Gloss: An electric mouse in costume, about ten times pricier than your motorbike.
- Spine link: 4. Viewer must get: Ten scooters = one slab.
- In: glide. Out: glide.
- Set: saleroom. Light: day.
- Build: new: ten scooters down the aisle with €1,900 tags.
- Blocking: Gentlemen seated; those by the aisle turn their heads.
  - gentlemen at [0.7, -2.2], front; all 18 seats (plan.seats): seated; neutral/smile.
- Action, against the words: f1390-1460 scooter 1 parked below the slab stand, its tag swinging; f1462-1500 the camera cranes up and back over the stage: nine more scooters in a row down the aisle; their tags swing as the camera passes; f1494 ('mười lần') the last one comes into frame. Title X10.
- Acting: aisle gentlemen glance at the scooters.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1390 | open | [3.2, 1.35, -2] | [2.4, 0.85, -3.6] | 40 | 0.15 | 8 | scooter and slab |
| 1456 | glide 46 f | [2.6, 3.5, -4.9] | [2.3, 0.5, 1.4] | 46 | 0.1 | 2 | crane: ten in a row |

- Kicks (7 f): none.
- Physics & FX: tags swing (pendulum, damped).
- Light & mood: day.
- Sound: scooter horn beep f1410 (meme-ish), ten little ticks f1462-1494.
- After-state: The scooters stay in the aisle.

### S11 · 0:50.6-0:54.4 · f1519-f1633 · "Khoan, sao một hộp bìa cứng lại được đối xử như rượu vang quý?"
- Gloss: Wait, why is a cardboard box treated like a fine wine?
- Spine link: 5. Viewer must get: The question: why so precious?
- In: glide. Out: dissolve 8 f (through-object: the box → a rack cubby).
- Set: saleroom. Light: day.
- Build: waiter with a wine bottle.
- Blocking: Waiter at his mark beside the vitrine, front view.
  - waiter at [1.95, -4.25], side -> front; present the bottle; stern.
- Action, against the words: f1530 the waiter steps in (side, 4 steps) to his mark; f1590-1603 he lifts a wine bottle onto his forearm, label out, next to the vitrine ('rượu vang' f1603); push in on 'quý'.
- Acting: waiter grave, eyebrows up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1519 | open | [1.7, 1.65, -1.9] | [1.7, 1.6, -4.5] | 38 | 0.2 (punch 0.6 for 18 f) | 6 | vitrine and the waiter |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: day.
- Sound: footsteps; a bottle clink f1600; 'Suspicious Sound' meme f1525.
- After-state: —

### S12 · 0:54.4-0:56.6 · f1633-f1698 · "Hóa ra, nó chính là rượu vang."
- Gloss: Turns out, it IS wine.
- Spine link: 5. Viewer must get: Boxes sit in a wine rack.
- In: dissolve 8 f. Out: glide.
- Set: cellar. Light: golden.
- Build: new: the cellar, the rack (bottles, sealed boxes), year plate 2006, barrel.
- Blocking: the sommelier (the waiter) at his mark by the rack.
  - waiter at [-1.05, -2.15], front; stand; smile_closed.
- Action, against the words: f1633-1645 hold on one boxed cubby; f1645-1690 pull back: bottles on the left, boxes on the right. Year plate 2006.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1633 | open | [0.65, 1.42, -2] | [0.65, 1.42, -2.62] | 30 | 0 | 10 | one boxed cubby |
| 1645 | glide 48 f | [0, 1.4, 4.3] | [0, 1.22, -2.6] | 46 | 0.1 | 3 | the whole rack |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden, warm candle-ish.
- Sound: cellar hush, drip.
- After-state: —

### S13 · 0:56.6-0:60.0 · f1698-f1799 · "Mỗi chai ngon bị mở là một chai biến mất mãi mãi."
- Gloss: Every good bottle that's opened is one bottle gone forever.
- Spine link: 5. Viewer must get: Open = gone.
- In: glide. Out: glide.
- Set: cellar. Light: golden.
- Build: bottle, cork, glass on the barrel.
- Blocking: sommelier at his mark, front.
  - waiter at [-1.05, -2.15], front; pull bottle, pop, pour; smile -> grin.
- Action, against the words: f1700-1716 he pulls a bottle from cubby (col 1, row 3); f1733 the cork pops (2 f before 'mở'), flies up, bounces on the floor twice, stays; f1746-1768 he pours into the glass on the barrel; the slot stays dark and empty.
- Acting: sommelier pleased, then a sip-face.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1698 | open | [-0.6, 1.55, 0.7] | [-0.85, 1.35, -2.2] | 44 | 0.18 | 6 | sommelier, rack, barrel |

- Kicks (7 f): f1733 strength 0.4.
- Physics & FX: cork: launched 3 m/s up-left, two bounces, rests on the floor.
- Light & mood: golden.
- Sound: squeak f1725, POP f1733, cork clicks f1752 f1760, glug pour f1746-1768.
- After-state: Empty slot; cork on the floor.

### S14 · 0:60.0-1:01.2 · f1799-f1836 · "Hộp thẻ cũng vậy."
- Gloss: Card boxes too.
- Spine link: 5. Viewer must get: The boxes are bottles.
- In: glide. Out: locked.
- Set: cellar. Light: golden.
- Build: —
- Blocking: —
- Action, against the words: f1799-1830 pan right to the 18 sealed boxes.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1799 | open | [0.68, 1.45, 1.3] | [0.68, 1.25, -2.6] | 44 | 0.05 | 2 | the box half |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden.
- Sound: a soft wrap crinkle.
- After-state: —

### S15 ★ · 1:01.2-1:06.5 · f1836-f1996 · "Hai mươi năm qua, cứ mỗi đứa trẻ không kìm được tay mà xé màng, thế giới lại mất đi một hộp."
- Gloss: For twenty years, every time a kid couldn't keep their hands off and tore the wrap, the world lost one box.
- Spine link: 5. Viewer must get: The sealed boxes disappear one opened box at a time.
- In: locked. Out: push.
- Set: cellar. Light: golden.
- Build: boxes with a lid that flips and a wrap that tears; shreds on the floor.
- Blocking: —
- Action, against the words: f1840-1985 the year plate rolls 2006 → 2026. From f1866 every ~6.6 f a box rips open (open_order/open_at): wrap shreds burst out and flutter down, the lid flips up and stays; the shreds pile up on the floor below the rack. One box (last_box) stays sealed and gleams f1988.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1836 | open | [0.68, 1.45, 1.3] | [0.68, 1.25, -2.6] | 44 | 0.08 | 2 | locked frame, state changing |

- Kicks (7 f): none.
- Physics & FX: shreds: light paper, fall at 0.6 m/s with flutter, rest on the floor (y 0.01).
- Light & mood: golden.
- Sound: 17 rips accelerating, paper flutters; digit ticks; a sad trombone-ish note at the end? no: a single shimmer on the last box f1988.
- After-state: 17 open boxes, a floor of shreds, one sealed box.

### S16 · 1:06.5-1:08.8 · f1996-f2063 · "Thứ càng ít, càng có người muốn giành."
- Gloss: The scarcer it is, the more people fight for it.
- Spine link: 5. Viewer must get: Scarcity makes the scramble.
- In: push. Out: dissolve 8 f (back to 2006).
- Set: cellar. Light: golden.
- Build: numbered paddles thrust in from below the frame.
- Blocking: bidders below the frame (only their paddles).
- Action, against the words: f1996-2020 push to the last sealed box; f2024-2058 paddles (12) jab up from the bottom of the frame on all sides, jostling, 'giành' f2049 all at once.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1996 | open | [0.65, 1.15, -0.9] | [0.65, 1.04, -2.6] | 38 | 0.2 (punch 0.6 for 14 f) | 6 | the last box |

- Kicks (7 f): f2049 strength 0.5.
- Physics & FX: paddles up 4 f, wobble.
- Light & mood: golden.
- Sound: crowd clamour rising f2024, paddle whooshes; 'Gogogogogo'? no: a bidding hubbub.
- After-state: —

### S17 ★ · 1:08.8-1:13.2 · f2063-f2196 · "Vậy nên, nếu hồi bé bạn từng bị mẹ cấm bóc hộp thẻ vì sợ bừa nhà,"
- Gloss: So if, as a kid, your mum stopped you opening the box because of the mess,
- Spine link: 6. Viewer must get: Mum saved the box.
- In: dissolve 8 f. Out: dissolve 8 f (twenty years later).
- Set: kitchen. Light: golden.
- Build: the kitchen again (2006); the box on the table.
- Blocking: Kid seated; mum standing at her mark beside the table; she walks to the cupboard f2150-2170.
  - kid at [-0.25, -1.12], front; reach -> sulk; grin -> pained.
  - mom at [0.15, -0.75], front -> side -> front; snatch, walk, shelve; stern -> smile_closed.
- Action, against the words: f2110-2132 the kid's hand goes to the wrap; f2134 ('cấm') mum snatches the box up; f2150-2170 she walks it to the cupboard; f2172-2180 sets it on top ('bừa nhà' f2176), dusts her hands. Kid sulks.
- Acting: kid eager -> pained sulk; mum stern -> satisfied.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2063 | open | [-0.7, 1.45, 1.9] | [-0.75, 1.15, -1.2] | 50 | 0.12 | 5 | table, mum and the cupboard |

- Kicks (7 f): f2134 strength 0.4.
- Physics & FX: box carried; set down with a 1 cm settle.
- Light & mood: golden.
- Sound: wrap crinkle f2128; mum's 'tsk' f2134; footsteps; thunk f2176.
- After-state: The box on top of the cupboard.

### S18 ★ · 1:13.2-1:16.0 · f2196-f2280 · "thì hôm nay, hãy về nhà và xin lỗi mẹ."
- Gloss: then today, go home and apologise to your mum.
- Spine link: 6. Viewer must get: The sealed box survived; say sorry.
- In: dissolve 8 f. Out: end.
- Set: kitchen. Light: day.
- Build: the kitchen in 2026 (the box still on the cupboard, sealed, dusty); flowers.
- Blocking: Mum (grey hair) at her mark; Minh walks in from the door to his mark f2200-2232.
  - mom at [0.15, -0.75], front; stand, point up; smile.
  - minh at [0.45, -0.45], side -> front; walk in, bow; nervous -> smile.
- Action, against the words: f2200-2232 Minh walks in holding flowers; f2240-2262 he bows ('xin lỗi' f2246); mum smiles and points up at the cupboard f2250; f2256-2280 tilt up to the box, a gleam on the wrap f2266.
- Acting: Minh sheepish; mum amused.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2196 | open | [0.1, 1.45, 1.9] | [0.1, 1.15, -1.2] | 50 | 0.12 | 5 | same frame, 20 years later |
| 2250 | glide 30 f | [-0.9, 1.6, 0.6] | [-1.45, 1.82, -2.2] | 40 | 0.2 | 6 | tilt to the sealed box |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: day 2026.
- Sound: door creak f2198; footsteps; a warm closing chord; 'Romantic' meme f2246.
- After-state: End on the sealed box.

