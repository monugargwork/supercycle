# Mudkip Art Academy: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in the plan, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/mudkip-art-academy/plan.json` (0 errors).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2250 frames.

## Timed lines
| # | VO line | gloss | frames | punch words (onset frame) | pause after |
|---|---|---|---|---|---|
| 1 | Có người vừa trả gần năm triệu đô la cho một chú Mudkip do người chơi tự vẽ. | hook | 0-119 | năm 31, đô 45, Mudkip 71, vẽ 114 | 0.36 s |
| 2 | Dân sưu tầm bật cười: "Mudkip á? Con cá bùn đó á? Charizard đâu?" | doubters | 130-265 | cười 160, Mudkip 170, cá bùn 214, Charizard 236 | 0.58 s |
| 3 | Nhưng chú Mudkip này không ra đời trong nhà máy. | turn 1 | 283-361 | không 322, máy 352 | 0.30 s |
| 4 | Hơn mười năm trước, một người tên Daisuke Ochiai vẽ nó để dự thi trong một trò chơi tập vẽ Pokémon. | origin | 370-551 | Daisuke 433, vẽ 466, thi 500, Pokémon 543 | 0.50 s |
| 5 | Bức tranh thắng giải. | origin | 566-601 | thắng 586, giải 592 | 0.08 s |
| 6 | Phần thưởng là tranh của anh được in thành thẻ bài, đúng một trăm lá, và cả một trăm lá về tay anh. | origin | 603-775 | in 659, một trăm 698, tay anh 764 | 0.12 s |
| 7 | Không cửa hàng nào bán. Không gói thẻ nào có. | origin | 779-854 | bán 809, gói 831, có 848 | 0.14 s |
| 8 | Gần hai năm trước, một lá đạt điểm mười tuyệt đối bán được bốn mươi hai nghìn đô. | step 1 | 859-998 | mười 931, bốn mươi hai 968, đô 991 | 0.24 s |
| 9 | Đắt, nhưng còn hiểu được. | step 1 | 1005-1057 | Đắt 1005 | 0.18 s |
| 10 | Tháng chín năm nay, một lá khác lên ba triệu bảy trăm hai mươi nghìn. | step 2 | 1063-1187 | chín 1076, ba triệu 1127, nghìn 1179 | 0 |
| 11 | Ba ngày sau, một chú Pikachu mặc áo mưa, cũng từ một cuộc thi vẽ như thế, bán tám triệu bốn trăm nghìn. | step 3 | 1187-1363 | Pikachu 1228, áo mưa 1250, tám triệu 1328, nghìn 1357 | 0.18 s |
| 12 | Một tháng sau, thêm một lá Mudkip lên sàn. | climax | 1368-1442 | Mudkip 1419, sàn 1435 | 0.14 s |
| 13 | Bảy mươi ba lần ra giá. | climax | 1447-1495 | bảy mươi ba 1447, giá 1486 | 0.04 s |
| 14 | Chốt ở bốn triệu tám trăm tám mươi nghìn đô. | climax | 1496-1572 | Chốt 1496, đô 1565 | 0.28 s |
| 15 | Khoan, một con cá bùn đắt hơn cả căn biệt thự? | listener's beat | 1580-1667 | Khoan 1580, đắt 1632, biệt thự 1658 | 0.26 s |
| 16 | Hóa ra, người ta không trả tiền cho con Pokémon. Mà trả cho một con số. | the pivot | 1675-1809 | Hóa ra 1675, không 1715, con số 1798 | 0.40 s |
| 17 | Một trăm lá được in ra. Đến hôm nay, chỉ ba lá được chấm điểm mười. Cả thế giới có ba. | payoff | 1821-1986 | Một trăm 1821, ba 1903, mười 1937, ba 1980 | 0.32 s |
| 18 | Cùng phiên đấu giá đó, lá Pikachu cúp vàng huyền thoại từ năm chín mươi bảy cũng lên sàn. | payoff | 1996-2134 | Pikachu 2044, cúp vàng 2056, chín mươi bảy 2098, sàn 2125 | 0.12 s |
| 19 | Ba triệu đô. Về nhì. Sau một con cá bùn. | last line | 2137-2229 | đô 2159, nhì 2181, cá bùn 2215 | end |

## Transitions
Three hard cuts (into S14, S15 and S19: the hammer, the gag, the reaction). Every date change is a dissolve; S05 to S06 goes through the handheld's screen. Inside a set the camera glides between keys.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f31 | f118 | $4.880.000 |
| f433 | f556 | DAISUKE OCHIAI |
| f680 | f708 | 100 |
| f1447 | f1493 | 73 |
| f1827 | f1861 | 100 |
| f1972 | f1986 | 3/100 |
| f2082 | f2102 | 1997 |

## Sets

### auction
- Origin in the shared world: [-60, 0, 0]. Axes: +x screen right from the room, -z = the rostrum wall (face at z -5.2), +z = the entrance and cash desk.
- Light: day; golden for the Goldin sale (S12-S14, S18-S19); sun az/el [75, 48]. Open camera sides: +z (the room) for the stage; nothing may stand between z -4.2 and the lens in the locked board frame.
- Marks [x, z]: buyer [3.15, 2.2]; dA [-2, 1.2]; dB [-1.5, 0.9]; dC [-1, 1.25]; auctioneer [-0.47, -4.8]; attendant12 [0.6, -4.8]; attendant18 [0.9, -4.8]; b1 [-0.62, -0.2]; b2 [-0.28, 0.75]; bid [0.08, -0.75]; b4 [0.5, 0.65]; b5 [0.78, -0.15]; b3 [0.12, 1.7].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| floor | reuse:carpet | [0, 0, 0.9] | [12, 0, 12.2] |
| walls | reuse:auction walls (green dado 1.1 m, cream above to 4.2 m) | [0, 2.1, -5.3] | [12, 4.2, 0.2] |
| stage | new: timber stage along the back wall | [0.8, 0.25, -4.6] | [4.4, 0.5, 1.2] |
| rostrum | adapt:rostrum (on the stage; desk top at y 1.42-1.47; a round oak sound block where the gavel lands) | [-0.465, 0.96, -4.35] | [0.97, 0.92, 0.3] |
| gavel_block | new: oak disc 12 cm, 3 cm thick | [-0.03, 1.485, -4.32] | [0.14, 0.03, 0.14] |
| columnA | new: lot column, oak post 22 x 30 cm, top height animates (1.78 -> 1.95 in S18), light-up numeral 1 on its front | [0.18, 1.14, -4.6] | [0.22, 1.28, 0.3] |
| columnB | new: second lot column, rises out of the stage in S18 (0.5 -> 1.78), then sinks to 1.45; light-up numeral 2 | [0.43, 1.14, -4.6] | [0.22, 1.28, 0.3] |
| slabA | new: PSA-style slab, 19 x 30 cm display size (about 2x life), clear case, red-bordered label GEM MT 10, the REAL card scan in the well; stands upright on the column on a 2 cm acrylic foot | [0.18, 1.94, -4.6] | [0.19, 0.3, 0.012] |
| slabB | new: same slab build with the 1997 No.1 Trainer scan, label NM-MT 8 | [0.43, 1.94, -4.6] | [0.19, 0.3, 0.012] |
| board | adapt:price board (dark panel, amber digits, $; base 0.7 m wide, two wings slide out to 1.16 m for seven-figure prices; a red SOLD lamp) | [0, 2.57, -5.17] | [1.16, 0.44, 0.05] |
| date_plate | new: split-flap date plate above the board | [0, 2.98, -5.17] | [0.8, 0.2, 0.04] |
| cash_desk | reuse:counter (top y 1.0) | [3, 0.5, 2.75] | [2, 1, 0.4] |
| hook_slab | the Mudkip slab on a small acrylic stand on the cash desk | [3.72, 1.17, 2.78] | [0.19, 0.3, 0.012] |
| sack | new: canvas money sack 44 cm, tied neck, squashes on impact; 14 cash bundles (15 x 6.5 x 2.5 cm, green band) burst out, 8 loose bills flutter | [3.15, 1.17, 2.72] | [0.44, 0.4, 0.44] |

### factory
- Origin in the shared world: [0, 0, 60]. Axes: the belt runs along +x toward the lens.
- Light: day; sun az/el [75, 48]. Open camera sides: +z and +x.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| floor | reuse:concrete | [0, 0, 0] | [24, 0, 14] |
| wall | reuse:siding wall, pale blue, with high windows | [0, 2.5, -3.1] | [24, 5, 0.2] |
| belt | new: indexing conveyor, grey rubber belt on a steel frame, end rollers; moves 0.75 m in 9 f then dwells 6 f | [0, 0.85, 0] | [10, 0.1, 0.7] |
| press | new: print press gantry (two yellow posts, cross-beam at 2.3 m, steel head 50 x 30 x 50 cm on a piston: up at y 1.9, stamps at y 0.93) | [0, 1.15, 0] | [0.7, 2.3, 1.3] |
| sheets | blank white card blanks (30 x 42 cm) ride in from -x; each leaves the press as a REAL card scan (press list) | [0, 0.905, 0] | [0.3, 0.004, 0.42] |
| belt_end | the belt carries on under the lens (no end in shot) | [5.5, 0.85, 0] | [1, 0.1, 0.7] |

### room
- Origin in the shared world: [60, 0, 0]. Axes: he sits behind the desk at -z facing +z; the door is on -x.
- Light: day (window light from screen left); sun az/el [-50, 42]. Open camera sides: +z.
- Marks [x, z]: daisuke [0, -0.78].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| shell | adapt:study (cream walls, window, shelf with art books and paint pots instead of binders; no CRT, no parcels) | [0, 1.35, 0.4] | [6, 2.7, 6] |
| desk | adapt:desk (top y 0.76, deeper: its back edge reaches him) | [-0.1, 0.38, -0.285] | [1.7, 0.76, 0.87] |
| console | new: clamshell handheld, pale blue, no logos: base 25 x 2.2 x 15 cm with the lower touch screen (13 x 9.8 cm) and round buttons; lid hinged on the far edge, open 145 deg, upper screen 17 x 10.2 cm | [0, 0.771, -0.4] | [0.25, 0.022, 0.15] |
| stylus | new: white stylus 16 cm, tip on the lower screen | [0.02, 0.8, -0.4] | [0.008, 0.16, 0.008] |
| parcel | new: open cardboard parcel 30 x 12 x 34 cm, four flaps folded out, on the desk (S06 only) | [0, 0.82, -0.38] | [0.3, 0.12, 0.34] |
| stack100 | new: the 100 printed cards as one block 14 x 7 x 19.5 cm (card edges ruled on the sides, the REAL Mudkip scan on top) | [0, 0.807, -0.38] | [0.14, 0.07, 0.195] |

### shop
- Origin in the shared world: [0, 0, -60]. Axes: the counter faces +z.
- Light: day; sun az/el [75, 48]. Open camera sides: +z.
- Marks [x, z]: keeper [0.55, 0.2]; kid [-0.35, 1.5].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| shell | new: tiled floor, back wall with four shelves of sealed booster boxes (plain coloured boxes) | [0, 1.5, -0.6] | [6, 3, 0.4] |
| counter | new: glass-fronted counter, top y 0.95, three REAL cards on little stands on top | [0.6, 0.475, 0.85] | [1.4, 0.95, 0.5] |
| pack | new: foil booster pack 9 x 15 cm in the kid's hands; the top strip tears off, five REAL cards (packs list) spill | [-0.35, 1, 1.75] | [0.09, 0.15, 0.01] |
| torn_pile | new: torn wrappers and loose cards already on the floor by his feet | [-0.8, 0.01, 1.9] | [0.5, 0, 0.5] |

### lawn
- Origin in the shared world: [0, 0, 0]. Axes: the beam runs from the near pan back to the far pan, almost along the view; unequal arms: 2.5 m near, 7.5 m far.
- Light: day; sun az/el [60, 45]. Open camera sides: +z.
- Marks [x, z]: dA [1.6, 2.4].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| grass | reuse:grassHD | [0, 0, 0] | [160, 0, 160] |
| scale_post | new: brass balance post on a stone base, pivot at y 5.2 | [0.35, 2.6, -0.1] | [0.26, 5.2, 0.26] |
| beam | new: brass beam 10 m, pivot 2.5 m from the near end; sin(tilt) runs from +0.13 (near pan up) to -0.39 (near pan on the grass) | [0.35, 5.2, -0.1] | [10, 0.16, 0.16] |
| pan_near | new: brass pan 72 cm on three chains 4.175 m long; starts at y 1.35, ends on the grass at y 0.05 | [1.05, 1.35, 2.3] | [0.72, 0.05, 0.72] |
| pan_far | new: brass pan 3.6 m carrying the villa; starts on the grass (y 0.05), ends at y 3.95 | [-1.74, 0.05, -7.3] | [3.6, 0.06, 3.6] |
| villa | new: white modern villa 2.6 x 2.0 x 2.2 m (two stacked flat-roof boxes, glass walls, a blue pool slab, one palm) | [-1.74, 1.08, -7.3] | [2.6, 2, 2.2] |
| slab | the Mudkip slab, stood on the near pan against a 2 cm foot | [1.05, 1.52, 2.3] | [0.19, 0.3, 0.012] |

### table
- Origin in the shared world: [0, 0.2, -300]. Axes: top-down; screen up is -z, screen right is +x.
- Light: day, warm desk; sun az/el [75, 60]. Open camera sides: above.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| top | reuse:planksHD table with a green cutting mat | [0, 0, 0] | [3, 0, 3] |
| slab | the Mudkip slab lying flat (S16) | [0, 0.008, -0.05] | [0.19, 0.012, 0.3] |
| cover | new: plain kraft card 16 x 9.5 cm slid over the picture | [0, 0.016, -0.055] | [0.16, 0.001, 0.095] |
| loupe | new: brass loupe, ring 8 cm with a short handle, glass magnifies the grade box 2x | [0.055, 0.03, -0.168] | [0.08, 0.012, 0.08] |
| grid | 100 REAL Mudkip cards at life size (6.2 x 8.7 cm), 10 x 10, rows shingled (pitch 7 x 6 cm) | [0, 0.004, -0.067] | [0.69, 0, 0.63] |
| cases | three PSA-style slabs at life size (8.5 x 13.5 cm) that drop onto cards (row,col) 3,2 / 5,7 / 7,4 (counted from 1) | [0, 0.012, -0.06] | [0.085, 0.012, 0.135] |

## Cast

- **buyer:** charcoal coat, grey flat cap, moustache. Items: money sack, bidder paddle. Views: front.
- **dA:** green hoodie, brown hair. Items: the slab in S15. Views: front.
- **dB:** yellow jacket, purple beanie, glasses. Items: Base Set Charizard. Views: front.
- **dC:** purple jacket, black hair, stout. Items: none. Views: front.
- **daisuke:** navy hoodie, black hair, glasses. Items: stylus, the 100-card block. Views: front.
- **keeper:** red apron over a white shirt, grey hair, stout. Items: none. Views: front.
- **kid:** orange T-shirt, blue cap, kid build. Items: booster pack. Views: front.
- **auctioneer:** black suit, red tie, grey hair, stout. Items: gavel. Views: front.
- **attendant:** dark green waistcoat, white shirt. Items: red velvet cushion with a slab. Views: front, side.
- **bidders b1-b5:** mixed jackets. Items: numbered paddles. Views: front.

## Scenes

### S01 ★ · 0:00.0-0:04.1 · f0-f124 · "Có người vừa trả gần năm triệu đô la cho một chú Mudkip do người chơi tự vẽ."
- Gloss: Someone just paid nearly five million dollars for a Mudkip a player drew himself.
- Spine link: 1. Viewer must get: A fortune was just paid for one small card.
- In: open on the act. Out: dissolve 6 f.
- Set: auction. Light: day.
- Build: reuse:cash desk; new: money sack with 14 bundles and 8 loose bills; the Mudkip slab on an acrylic stand at the right end of the desk.
- Blocking: Buyer, front view, behind the cash desk at the mark, both arms straight up holding the sack over his head from frame 0.
  - buyer at [3.15, 2.2], front; sack overhead, then slam; stern -> grin.
- Action, against the words: f0-24 wind-up held (sack at y 1.9). f25-29 he slams it down; contact f29, two frames before 'năm'. The sack squashes to 70 %, its neck pops; 14 bundles burst up and out on arcs (0.25-0.6 s), bounce once and stay on the desk and floor; 8 bills flutter down until f110. The slab on its stand hops 3 cm and settles. f58 the camera leaves him for the slab; a gleam crosses it on 'Mudkip' f71.
- Acting: Effort squint on the wind-up, wide grin after the slam, arms resting on the sack.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [3.05, 1.4, 5.5] | [3.3, 1.35, 2.5] | 46 | 0.25 (punch 0.6 for 20 f) | 6 | low and wide on the wind-up and the slam |
| 58 | glide 20 f | [3.72, 1.3, 4] | [3.72, 1.17, 2.78] | 34 | 0.2 | 10 | travel to what the money bought, during the debris |

- Kicks (7 f): f29 strength 1.
- Physics & FX: sack: 4 f fall, squash 0.7 with a 6 f recover to 0.85. Bundles: ballistic arcs under 9.8 m/s2 from the sack mouth to rest spots on the desk (9) and the carpet (5), one bounce of 8 % height, spin stops at rest. Bills: 1.1 m/s terminal fall with a 0.12 m side sway.
- Light & mood: day, sun from screen right; cool room so the green bundles pop.
- Sound: whoosh f25, heavy thud + coin clink f29, paper flutter f31-90, Kaching meme f31, gleam chime f71.
- After-state: Sack slumped on the desk, bundles and bills lying where they landed (S02 background is the other way; S13 uses the buyer again).

### S02 · 0:04.1-0:09.2 · f124-f275 · "Dân sưu tầm bật cười: "Mudkip á? Con cá bùn đó á? Charizard đâu?""
- Gloss: Collectors burst out laughing: 'Mudkip? That mud fish? Where's Charizard?'
- Spine link: 2. Viewer must get: The experts think it is a joke.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: auction. Light: day.
- Build: reuse:auction room seen toward the rostrum wall (soft). REAL Base Set Charizard in dB's hand.
- Blocking: Three collectors in a tight row, front view, low wide lens: dA left, dB middle half a step forward, dC right.
  - dA at [-2, 1.2], front; stand, head back; laugh.
  - dB at [-1.5, 0.9], front; lunge with card f232; laugh -> grin.
  - dC at [-1, 1.25], front; points off screen right; laugh.
- Action, against the words: f130 all three crack up on 'bật cười' (shoulders bounce 3 cm at 4 Hz). f170 'Mudkip á?': dC points off screen right toward the cash desk. f202 'Con cá bùn': dA throws his head back. f232-240 dB lunges 0.6 m to the lens and thrusts the Charizard out at arm's length, card square to the lens on 'Charizard' f236; holo sheen sweeps it.
- Acting: Laugh, laugh, laugh; dB switches to a smug grin for his line, leaning into the lens.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 124 | open | [-1.45, 1.05, 4.5] | [-1.5, 1.32, 1.1] | 46 | 0.2 | 6 | low wide chorus |
| 228 | glide 10 f | [-1.5, 1.15, 4.1] | [-1.5, 1.35, 1.2] | 44 | 0.2 (punch 0.6 for 16 f) | 8 | he leans into the lens with the Charizard |

- Kicks (7 f): f236 strength 0.4.
- Physics & FX: none
- Light & mood: day.
- Sound: Emoji Laugh meme f134, small laughs f170-230, card whip f234, sparkle f238.
- After-state: dB keeps the Charizard for S19.

### S03 · 0:09.2-0:12.2 · f275-f366 · "Nhưng chú Mudkip này không ra đời trong nhà máy."
- Gloss: But this Mudkip was not born in a factory.
- Spine link: 3. Viewer must get: Normal cards are stamped out by the thousand. Not this one.
- In: dissolve 8 f. Out: dissolve 12 f (time jump: over ten years back).
- Set: factory. Light: day.
- Build: new: conveyor, press, blanks in, REAL printed cards out.
- Blocking: No people. The lens hangs over the belt and looks down the line: the belt is a ribbon up the frame, the press mid-frame.
- Action, against the words: Every 15 f the belt indexes 0.75 m (9 f) and dwells (6 f); the press head drops in 2 f onto the blank under it and lifts in 4 f; the blank leaves as a printed card. Stamps at f277, 292, 307, 322 ('không'), 337, 352 ('máy'). Printed cards ride toward the lens and pass under it.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 275 | open | [3.9, 1.75, 0.12] | [0.2, 1, 0] | 44 | 0.2 | 5 | down the line, press mid-frame |
| 318 | glide 22 f | [3.4, 1.6, 0.1] | [0.7, 0.98, 0] | 42 | 0.2 | 7 | closer on the printed cards coming at us |

- Kicks (7 f): f277 strength 0.25; f292 strength 0.25; f307 strength 0.25; f322 strength 0.35; f337 strength 0.25; f352 strength 0.3.
- Physics & FX: belt index with smooth start and stop; the press head falls in 2 f and lifts in 4 f.
- Light & mood: day, cool industrial.
- Sound: motor hum, pneumatic hiss + stamp thud on each stamp frame, belt clack on each index.
- After-state: none (one-off set).

### S04 · 0:12.2-0:15.4 · f366-f462 · "Hơn mười năm trước, một người tên Daisuke Ochiai vẽ nó ..."
- Gloss: Over ten years ago, a man named Daisuke Ochiai drew it ...
- Spine link: 3. Viewer must get: One person drew it, at his desk.
- In: dissolve 12 f. Out: dissolve 6 f.
- Set: room. Light: day.
- Build: adapt:study as his room; new: console open on the desk, stylus.
- Blocking: Daisuke sits behind the desk, front view, head tilted down to the console; his right arm (3D stick arm) holds the stylus on the lower screen.
  - daisuke at [0, -0.78], front; sit, drawing; lick.
- Action, against the words: His stylus hand moves in short strokes (2-3 cm, 5 per second) over the lower screen; he pauses at f421, looks up and thinks, then back down on 'Daisuke' f433 as the title glides in.
- Acting: Tongue-out concentration (lick), a thinking look up, a small smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 366 | open | [-0.1, 1.3, 2.4] | [-0.05, 1, -0.6] | 42 | 0.2 | 7 | him at the desk, the console between us |

- Kicks (7 f): none.
- Physics & FX: none
- Light & mood: day, soft window light from the left.
- Sound: room tone, stylus taps, soft music-box theme.
- After-state: none

### S05 · 0:15.4-0:22.1 · f462-f663 · "... vẽ nó để dự thi trong một trò chơi tập vẽ Pokémon. Bức tranh thắng giải. Phần thưởng là tranh của anh được in ..."
- Gloss: ... to enter a contest in a Pokémon drawing game. The drawing won. The prize: his drawing printed ...
- Spine link: 3. Viewer must get: The picture on the card is his own drawing, and it won.
- In: dissolve 6 f. Out: through-object 8 f (push into the drawing on the lower screen; it becomes the art window of the real card).
- Set: room. Light: day.
- Build: console screens are live canvases: the lower one shows the REAL card art (the art window cropped from the scan) appearing under the stylus; the upper one shows a plain contest page, then a gold WINNER rosette.
- Blocking: Top-down over the console; the stylus and his forearm come in from the bottom right.
- Action, against the words: f466-551 the stylus scrubs across the lower screen and the drawing appears where it has been (pencil lines first, colour 20 f behind). f551 last stroke, stylus lifts. f586 'thắng': the upper screen flashes and a gold rosette stamps on; a ring of confetti bursts over the console. f634-659 push into the drawing.
- Acting: hands only
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 462 | open | [0, 1.9, -0.365] | [0, 0.77, -0.349] | 34 | 0.06 | 0 | both screens, the drawing appearing |
| 634 | glide 24 f | [0, 1.306, -0.41] | [0, 0.783, -0.4] | 34 | 0 | 0 | through-object: the drawing fills the frame |

- Kicks (7 f): f586 strength 0.5.
- Physics & FX: confetti: 24 paper bits on short arcs.
- Light & mood: day; the screens glow.
- Sound: pencil scratch loop f466-551, Realization Sound f586, chime.
- After-state: The finished drawing stays on the lower screen.

### S06 · 0:22.1-0:26.0 · f663-f779 · "... thành thẻ bài, đúng một trăm lá, và cả một trăm lá về tay anh."
- Gloss: ... as a card: exactly one hundred copies, and all one hundred went to him.
- Spine link: 4. Viewer must get: Only 100 exist and he got them all.
- In: through-object 8 f. Out: dissolve 8 f.
- Set: room. Light: day.
- Build: new: open parcel on the desk with the 100-card block inside, REAL Mudkip scan on top. The console is pushed to the desk's left end; the parcel sits at his edge of the desk, inside his reach.
- Blocking: Starts top-down on the card's art window (same picture, same place in frame as the screen; the lens is now on our side of the desk, so the card lies with its top toward him and reads upright for us). Daisuke sits behind the desk.
  - daisuke at [0, -0.78], front; sit; lift and hug the block f731-769; relief_open -> smile_closed.
- Action, against the words: f667-695 the camera lifts back and tilts up: the whole card, the block's ruled edge, the open parcel around it (he is still above the frame). f715 the camera comes down to him. f680 title '100' on 'đúng một trăm lá'. f725-737 both arms reach in and grip the block's sides; f737-751 he lifts it out of the parcel and tips its face to us; f752-769 he hugs it to his chest on 'về tay anh'.
- Acting: Open-mouthed awe, then a closed-eye grin hugging the block.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 663 | open | [0, 1.334, -0.408] | [0, 0.84, -0.4185] | 34 | 0 | 0 | match: the drawing is now the card's art |
| 667 | glide 28 f | [0, 1.6, 0.07] | [0, 0.84, -0.38] | 36 | 0.1 | 4 | pull back to the block of 100 in its parcel |
| 715 | glide 20 f | [0, 1.32, 1.75] | [0, 0.93, -0.6] | 40 | 0.2 | 7 | settle on him as he lifts it out |

- Kicks (7 f): none.
- Physics & FX: none
- Light & mood: day, warm.
- Sound: paper rustle f667, soft whoosh, glock hit on '100' f692, cardboard scrape f735.
- After-state: He keeps the block; the empty parcel stays.

### S07 · 0:26.0-0:28.6 · f779-f859 · "Không cửa hàng nào bán. Không gói thẻ nào có."
- Gloss: No shop sells it. No pack has it.
- Spine link: 4. Viewer must get: You cannot buy one anywhere.
- In: dissolve 8 f. Out: dissolve 10 f (time jump).
- Set: shop. Light: day.
- Build: new: card shop (shelves of sealed boxes, glass counter with three REAL cards on stands), foil pack, torn-wrapper pile.
- Blocking: Keeper behind the counter right of centre, front view. Kid in front of the counter on the left, front view, a pack in both hands.
  - keeper at [0.55, 0.2], front; head shake, palms out; stern.
  - kid at [-0.35, 1.5], front; rips a pack; grin -> dazed.
- Action, against the words: f786-815 the keeper shakes his head three times (head tilt +-7 deg) with both palms out. f820 glide to the kid: f829-831 he rips the top strip off on 'gói' (the strip flies up-left and falls); five real cards fan up out of the pack and drop around his feet by f850; he stares into the empty wrapper on 'có'.
- Acting: Keeper: stern, eyes closed on the shake. Kid: hopeful grin, then dazed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 779 | open | [-0.15, 1.3, 4.3] | [0.02, 1.2, 0.6] | 44 | 0.2 | 5 | shop, keeper and kid |
| 818 | glide 12 f | [-0.3, 1.1, 3.7] | [-0.33, 0.95, 1.5] | 40 | 0.3 | 8 | the pack |

- Kicks (7 f): f831 strength 0.35.
- Physics & FX: strip and cards on ballistic arcs with spin; cards land flat and stay.
- Light & mood: day, bright shop.
- Sound: door bell f781, foil rip f829, card flutter, Buzzer meme (short) f846.
- After-state: none

### S08 · 0:28.6-0:33.5 · f859-f1005 · "Gần hai năm trước, một lá đạt điểm mười tuyệt đối bán được bốn mươi hai nghìn đô."
- Gloss: Nearly two years ago, one graded a perfect ten sold for forty-two thousand dollars.
- Spine link: 5. Viewer must get: First sale: $42,000.
- In: dissolve 10 f. Out: dissolve 6 f.
- Set: auction. Light: day.
- Build: the locked board frame: date plate, price board, auctioneer on the stage behind the rostrum, the Mudkip slab on column A.
- Blocking: Auctioneer front view at his mark, gavel in hand at rest.
  - auctioneer at [-0.47, -4.8], front; gavel; stern.
- Action, against the words: f881-890 the date plate flaps to 'THÁNG 11 · 2024'. f905 glide to the slab: a gleam runs over the label's GEM MT 10 on 'điểm mười' f925-931. f948 back to the locked frame. f953-988 the board rolls $0 -> $42,000. f984 gavel up, f990 strike on 'đô'; SOLD lamp on.
- Acting: Auctioneer: stern, a nod and a small smile after the strike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 859 | open | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.05 | 3 | the locked frame: date, board, gavel, lot |
| 905 | glide 14 f | [0.18, 1.92, -3.455] | [0.18, 1.888, -4.6] | 34 | 0.2 | 9 | the grade: GEM MT 10 |
| 948 | glide 12 f | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.05 (punch 0.2 for 12 f) | 3 | back for the price and the gavel |

- Kicks (7 f): f990 strength 0.6.
- Physics & FX: gavel: 4 f up, held 2 f, 1 f down, 3 f rebound.
- Light & mood: day.
- Sound: flap clatter f881, shimmer f925, digit ticks f953-988, gavel crack f990, polite applause.
- After-state: Board holds $42,000 into S10.

### S09 · 0:33.5-0:35.4 · f1005-f1063 · "Đắt, nhưng còn hiểu được."
- Gloss: Expensive, but you can still understand it.
- Spine link: 5. Viewer must get: The experts shrug: fair enough.
- In: dissolve 6 f. Out: dissolve 8 f (time jump).
- Set: auction. Light: day.
- Build: same as S02.
- Blocking: The three collectors, same marks as S02.
  - dA at [-2, 1.2], front; shrug; neutral.
  - dB at [-1.5, 0.9], front; nod; smile.
  - dC at [-1, 1.25], front; head tilt; smile_closed.
- Action, against the words: f1005 dA raises both arms in a shrug on 'Đắt'. f1021-1045 dB nods twice. f1045 dC tilts his head and gives a closed smile on 'hiểu được'.
- Acting: Unbothered: neutral, small smiles.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1005 | open | [-1.45, 1.05, 4.5] | [-1.5, 1.32, 1.1] | 46 | 0.3 | 6 | the chorus again, same framing as S02 |

- Kicks (7 f): none.
- Physics & FX: none
- Light & mood: day.
- Sound: a soft 'hm' pizzicato.
- After-state: none

### S10 · 0:35.4-0:39.6 · f1063-f1187 · "Tháng chín năm nay, một lá khác lên ba triệu bảy trăm hai mươi nghìn."
- Gloss: This September, another one went to three million seven hundred and twenty thousand.
- Spine link: 5. Viewer must get: Same card, same frame: now $3.72 million. The board was not built for it.
- In: dissolve 8 f. Out: dissolve 8 f (three days later).
- Set: auction. Light: day.
- Build: the locked board frame; the board grows two wings.
- Blocking: Auctioneer at his mark.
  - auctioneer at [-0.47, -4.8], front; gavel; stern -> shock -> grin.
- Action, against the words: f1072-1081 the date plate flaps to 'THÁNG 9 · 2026'. f1111 the board starts rolling up from $42,000. f1127 'ba triệu': it runs out of room, both wings slam out (clunk, kick) and the digits spread to seven figures. f1175 it stops on $3,720,000. f1173 gavel up, f1179 strike on 'nghìn'. The slab hops 2 cm.
- Acting: Auctioneer: stern, then eyes wide (shock) when the wings fly out, grin on the strike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1063 | open | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.05 (punch 0.2 for 14 f) | 3 | locked: same frame, bigger number |

- Kicks (7 f): f1127 strength 0.5; f1179 strength 0.8.
- Physics & FX: wings: 5 f out with a 2-frame overshoot of 2 cm; slab hop 2 cm, 6 f.
- Light & mood: day.
- Sound: flap clatter f1072, fast digit ticks rising in pitch, metal clunk f1127, gavel f1179, gasp + applause.
- After-state: Board stays wide.

### S11 · 0:39.6-0:45.6 · f1187-f1368 · "Ba ngày sau, một chú Pikachu mặc áo mưa, cũng từ một cuộc thi vẽ như thế, bán tám triệu bốn trăm nghìn."
- Gloss: Three days later, a Pikachu in a raincoat, from the same kind of drawing contest, sold for eight million four hundred thousand.
- Spine link: 5. Viewer must get: Another contest drawing: $8.4 million.
- In: dissolve 8 f. Out: dissolve 8 f (a month later).
- Set: auction. Light: day.
- Build: the locked board frame; column A now carries the REAL raincoat Pikachu in its slab.
- Blocking: Auctioneer at his mark.
  - auctioneer at [-0.47, -4.8], front; gavel; stern -> grin.
- Action, against the words: f1195-1203 the date plate flaps to '3 NGÀY SAU'. f1213 glide to the slab: the raincoat Pikachu, gleam on 'áo mưa' f1250. f1300 back to the locked frame. f1313-1352 the board rolls $0 -> $8,400,000. f1351 gavel up, f1357 strike on 'nghìn'; slab hops.
- Acting: Auctioneer: stern -> grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1187 | open | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.05 | 3 | locked: three days later |
| 1213 | glide 14 f | [0.18, 1.92, -3.455] | [0.18, 1.888, -4.6] | 34 | 0.15 | 9 | the raincoat Pikachu |
| 1300 | glide 12 f | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.05 (punch 0.2 for 14 f) | 3 | back for $8.4M and the gavel |

- Kicks (7 f): f1357 strength 0.8.
- Physics & FX: as S10.
- Light & mood: day.
- Sound: flap f1195, rain-stick shimmer f1228, digit ticks, gavel f1357, Wowww meme (short) f1358.
- After-state: none

### S12 · 0:45.6-0:48.2 · f1368-f1447 · "Một tháng sau, thêm một lá Mudkip lên sàn."
- Gloss: A month later, one more Mudkip goes on the block.
- Spine link: 6. Viewer must get: The Mudkip from the opening comes up for sale.
- In: dissolve 8 f. Out: dissolve 4 f.
- Set: auction. Light: golden.
- Build: the stage in warm evening light; column A empty; attendant with the Mudkip slab on a red velvet cushion (26 x 6 x 20 cm).
- Blocking: Attendant walks in along the back of the stage from screen right (side view), stops behind and to the right of column A, turns front.
  - attendant at [0.6, -4.8], side -> front; carry cushion; place slab; nervous -> relief.
  - auctioneer at [-0.47, -4.8], front; wait; neutral.
- Action, against the words: f1376-1384 the date plate flaps to '1 THÁNG SAU'; the board resets to $0 (its wings stay out). f1380-1414 he walks in (0.7 m, 2 steps), cushion at chest height. f1420-1433 his left arm lifts the slab off the cushion and stands it on the column; contact f1433, two frames before 'sàn'; a gleam crosses it.
- Acting: Careful, held breath (nervous), relief after.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1368 | open | [0.05, 2.02, -1.75] | [0.05, 1.98, -5.1] | 48 | 0.05 | 4 | the stage a touch wider, room for him to walk in |

- Kicks (7 f): f1433 strength 0.25.
- Physics & FX: none
- Light & mood: golden: this sale gets its own light.
- Sound: flap f1376, footsteps on wood, soft clack f1433, riser starts.
- After-state: Mudkip slab on column A for S14 and S18.

### S13 · 0:48.2-0:49.9 · f1447-f1496 · "Bảy mươi ba lần ra giá."
- Gloss: Seventy-three bids.
- Spine link: 6. Viewer must get: The room fights over it.
- In: dissolve 4 f. Out: cut.
- Set: auction. Light: golden.
- Build: the room from the rostrum; numbered paddles (white discs 22 cm on a stick).
- Blocking: Six bidders front view in two loose rows; the buyer from S01 front centre.
  - b1 at [-0.62, -0.2], front; paddle; stern.
  - b2 at [-0.28, 0.75], front; paddle; grin.
  - buyer at [0.08, -0.75], front; paddle last; stern.
  - b4 at [0.5, 0.65], front; paddle; stern.
  - b5 at [0.78, -0.15], front; paddle; grin.
  - b3 at [0.12, 1.7], front; paddle; stern.
- Action, against the words: Paddles shoot up one after another, each up 5 f, held 6 f, down 5 f, in a wave that speeds up (11 raises in 44 f). The buyer raises his last, f1481 on 'ra giá', and keeps it up. Title '73'.
- Acting: Bidders: stern, teeth-grit grins.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1447 | open | [0.1, 1.75, -3.9] | [0.1, 1.2, 0.5] | 55 | 0.3 (punch 0.7 for 14 f) | 5 | the whole room bidding, from the rostrum |

- Kicks (7 f): f1481 strength 0.4.
- Physics & FX: none
- Light & mood: golden.
- Sound: paddle whooshes, murmur rising, riser to f1496.
- After-state: none

### S14 ★ · 0:49.9-0:52.7 · f1496-f1580 · "Chốt ở bốn triệu tám trăm tám mươi nghìn đô."
- Gloss: Hammered at four million eight hundred and eighty thousand dollars.
- Spine link: 6. Viewer must get: $4.88 million. The gavel falls.
- In: cut. Out: cut.
- Set: auction. Light: golden.
- Build: the locked board frame in golden light, board already wide.
- Blocking: Auctioneer at his mark.
  - auctioneer at [-0.47, -4.8], front; gavel held high, strike f1563; stern -> grin.
- Action, against the words: f1496 'Chốt': the gavel goes up over his shoulder in 4 f and is HELD. f1500-1559 the board rolls $1,000,000 -> $4,880,000, slowing into the last digits. f1557-1562 stillness: everything stops. f1563 strike, two frames before 'đô': crack, kick, spark burst at the block, the SOLD lamp snaps on, the slab jumps 4 cm and rattles to rest, dust falls from the board.
- Acting: Auctioneer: stern through the hold, a huge grin on the strike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1496 | open | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.08 | 3 | locked: the climax in the frame we know |

- Kicks (7 f): f1563 strength 1.
- Physics & FX: slab: launched at 0.9 m/s, falls back under gravity, two rattles of 1 cm and 0.4 cm, rests by f1578.
- Light & mood: golden; the SOLD lamp blooms red.
- Sound: riser cut to silence f1557, gavel crack f1563 with a low boom, Kaching meme f1565, crowd roar.
- After-state: Board holds $4,880,000; slab stays for S18.

### S15 ★ · 0:52.7-0:55.8 · f1580-f1675 · "Khoan, một con cá bùn đắt hơn cả căn biệt thự?"
- Gloss: Wait, a mud fish costs more than a whole villa?
- Spine link: 6. Viewer must get: The little card outweighs a villa. Literally.
- In: cut. Out: dissolve 8 f.
- Set: lawn. Light: day.
- Build: new: a giant brass balance on a lawn. The villa sits on the far pan, resting on the grass; the near pan hangs empty at chest height.
- Blocking: dA stands right of the near pan, front view, the slab in his left hand (screen left, the pan side).
  - dA at [1.6, 2.4], front; stands the slab on the pan; dazed -> shock.
- Action, against the words: f1580 'Khoan': wide, he stares at the slab in his hand; the villa sits on the far pan in the distance. f1597 the camera steps in. f1604-1622 he lifts the slab over the pan and stands it down; contact f1624. f1626-1638 the near pan drops 1.3 m, accelerating, as the camera pulls back; f1638 it hits the grass on 'đắt hơn': thud, kick, dust ring, the slab hops 6 cm. The far pan is thrown up 3.9 m: the villa leaves it by 0.4 m and lands back at f1654, pool water slopping over the side. It hangs there on 'căn biệt thự'.
- Acting: dA: dazed at the slab, then shock; his jaw drops to the grass at f1654.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1580 | open | [1.2, 1.1, 6.4] | [0.85, 1.25, 2.4] | 52 | 0.1 | 3 | the whole balance: him and the pan near, the villa far |
| 1597 | glide 14 f | [1.3, 1.25, 4.7] | [1.3, 1.3, 2.35] | 46 | 0.2 | 6 | step in: the slab goes on the pan |
| 1626 | glide 12 f | [1.2, 1.1, 6.4] | [0.85, 1.5, 2.4] | 52 | 0.15 | 3 | pull back with the drop: the villa goes up |

- Kicks (7 f): f1638 strength 1; f1654 strength 0.4.
- Physics & FX: beam: constant angular acceleration over 12 f, hard stop on the grass; villa: thrown at the far end's speed, free flight 0.4 m above the pan, lands with one 5 cm bounce; pans hang plumb on their chains.
- Light & mood: bright day, blue sky: the joke gets daylight.
- Sound: Huh meme f1582, brass creak f1626, heavy thud f1638, water splash f1644, Instagram Thud for the jaw f1654.
- After-state: none (one-off set).

### S16 · 0:55.8-1:00.7 · f1675-f1821 · "Hóa ra, người ta không trả tiền cho con Pokémon. Mà trả cho một con số."
- Gloss: It turns out people are not paying for the Pokémon. They are paying for a number.
- Spine link: 7. Viewer must get: Cover the picture: the value is in the number on the label.
- In: dissolve 8 f. Out: dissolve 6 f.
- Set: table. Light: day.
- Build: the calm set: a warm wooden table with a green cutting mat, top-down. The slab lying flat; a kraft card; a brass loupe.
- Blocking: Hands only: a stick arm comes in from the bottom right.
- Action, against the words: f1675-1682 the slab drops flat onto the mat (lands f1682, small bounce) on 'Hóa ra'. f1708-1722 the arm slides the kraft card over the picture: Mudkip is gone on 'không trả tiền'; only the label is left. f1779-1798 the arm brings the loupe over the grade box; the glass shows the 10 twice the size on 'con số' f1802.
- Acting: hands only
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1675 | open | [0, 1.1, 0.02] | [0, 0, 0] | 34 | 0.06 | 0 | top-down, calm |
| 1776 | glide 22 f | [0.02, 0.74, -0.105] | [0.02, 0, -0.125] | 34 | 0.12 | 0 | push in on the label and the loupe |

- Kicks (7 f): f1682 strength 0.25.
- Physics & FX: slab: 0.25 m drop, one 1 cm bounce.
- Light & mood: warm desk light.
- Sound: music drops to a soft pad; plastic clack f1682, paper slide f1710, brass tick f1798, Realization Sound f1802.
- After-state: none

### S17 · 1:00.7-1:06.5 · f1821-f1996 · "Một trăm lá được in ra. Đến hôm nay, chỉ ba lá được chấm điểm mười. Cả thế giới có ba."
- Gloss: One hundred were printed. To this day only three have been graded a ten. The whole world has three.
- Spine link: 7. Viewer must get: 100 exist; only 3 are perfect.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: table. Light: day.
- Build: same table, wider. 100 REAL Mudkip cards; three slab cases.
- Blocking: Hands only.
- Action, against the words: f1823-1856 the 100 cards are dealt in from the bottom edge, three per frame, each sliding to its place in a 10 x 10 spread (rows shingled); title '100'. f1903, 1910, 1917 three slab cases drop onto three of the cards (clack, clack, clack) on 'ba lá'; their 10s flash on 'mười' f1937. f1950 a gust crosses the table from the bottom of the frame (someone blows): the 97 loose cards lift and skid away up and off the table, bottom rows first, gone by f1972; the three heavy slabs stay put. f1962 the camera pushes in on them; title '3/100' on 'có ba'.
- Acting: hands only
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1821 | open | [0, 2.6, 0.03] | [0, 0, 0] | 34 | 0 | 0 | top-down on the whole spread |
| 1962 | glide 22 f | [-0.07, 1.85, -0.077] | [-0.07, 0, -0.097] | 34 | 0.12 | 0 | push in: three left |

- Kicks (7 f): f1903 strength 0.3; f1910 strength 0.3; f1917 strength 0.3.
- Physics & FX: cards: 8 f slide with ease-out and a 3 deg settle; cases: 0.5 m drop each (10 f), 4 mm bounce; gust: each loose card accelerates at 6 m/s2 from the moment the gust front reaches it (bottom rows first, 8 f bottom to top), lifting 3 cm and spinning; the slabs (30x the weight) do not move.
- Light & mood: warm desk light.
- Sound: card riffle f1823-1856, glock on '100', three clacks, shimmer f1937, a blown whoosh and paper flutter f1950-1972, low hit on '3/100' f1977.
- After-state: none

### S18 ★ · 1:06.5-1:13.1 · f1996-f2192 · "Cùng phiên đấu giá đó, lá Pikachu cúp vàng huyền thoại từ năm chín mươi bảy cũng lên sàn. Ba triệu đô. Về nhì."
- Gloss: At that same auction, the legendary gold trophy Pikachu from 1997 also went on the block. Three million dollars. Second place.
- Spine link: 8. Viewer must get: The most famous trophy card sold the same night and came second.
- In: dissolve 8 f. Out: cut.
- Set: auction. Light: golden.
- Build: the locked board frame, golden. Column B; the REAL 1997 No.1 Trainer in a slab on the red cushion; light-up numerals on both columns.
- Blocking: Auctioneer at his mark. Attendant stands at stage right behind the line of the columns, at the edge of the locked frame, the cushion at his chest; his arm reaches forward to column B.
  - auctioneer at [-0.47, -4.8], front; gavel; stern -> grin.
  - attendant at [0.9, -4.8], front; holds the cushion at his chest; his left arm stands the slab on column B; neutral.
- Action, against the words: f1996-2020 column B grinds up out of the stage beside the Mudkip (0.5 -> 1.78 m); the board resets to $0. f2022 glide to the cushion in the attendant's hands: the trophy Pikachu, gold gleam on 'cúp vàng' f2056-2067; title '1997'. f2105 back to the locked frame; f2109-2122 his arm stands the slab on column B on 'lên sàn'. f2137-2157 the board rolls to $3,080,500; f2153 gavel up, f2159 strike on 'đô'. f2163 the camera drops to the two columns. f2167-2181 'Về nhì': column B sinks to 1.45 m and column A rises to 1.95 m with a stone grind; f2181 the numerals light: 1 under the Mudkip, 2 under the trophy Pikachu.
- Acting: Auctioneer: stern -> grin. Attendant: neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1996 | open | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.04 | 3 | locked: the same night |
| 2022 | glide 24 f | [0.9, 1.85, -3.4] | [0.9, 1.72, -4.6] | 34 | 0.15 | 9 | the trophy Pikachu on its cushion |
| 2105 | glide 14 f | [0, 2.02, -1.9] | [0, 2, -5.1] | 50 | 0.02 | 3 | back: it goes on the block, the price, the gavel |
| 2163 | glide 16 f | [0.32, 1.72, -1.7] | [0.32, 1.5, -5.1] | 40 | 0.15 | 5 | down to the two columns: a podium |

- Kicks (7 f): f2020 strength 0.3; f2159 strength 0.7; f2181 strength 0.6.
- Physics & FX: columns: eased 14 f travel, 1 cm settle; dust falls from column B's top edge as it rises.
- Light & mood: golden.
- Sound: stone grind f1996-2026 and f2167-2181, shimmer f2056, digit ticks, gavel f2159, Meme Violin Sad Violin (2 s) f2167, two soft pings f2181.
- After-state: The podium stays for the end.

### S19 · 1:13.1-1:15.0 · f2192-f2250 · "Sau một con cá bùn."
- Gloss: Behind a mud fish.
- Spine link: 8. Viewer must get: The laughing experts are not laughing now.
- In: cut. Out: end.
- Set: auction. Light: golden.
- Build: same as S02, golden light.
- Blocking: The three collectors, same marks and framing as S02.
  - dA at [-2, 1.2], front; jaw drop; shock.
  - dB at [-1.5, 0.9], front; jaw drop; drops the Charizard; shock.
  - dC at [-1, 1.25], front; jaw drop; shock.
- Action, against the words: f2192 all three stare, mouths shut. f2205 on 'một con cá bùn' their jaws drop to the carpet one after another (dA f2205, dB f2209, dC f2213). f2211 the Charizard slips out of dB's hand, flutters down side to side and lands face up on the carpet at f2236. Hold to f2250.
- Acting: Stunned: shock, eyes wide.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2192 | open | [-1.5, 1.15, 4.7] | [-1.5, 0.97, 1.1] | 46 | 0.2 (punch 0.5 for 14 f) | 6 | the reaction flip, same framing as the laugh |

- Kicks (7 f): f2209 strength 0.5.
- Physics & FX: card: flutter fall, 1.2 m in 25 f with a 10 cm side sway and a slow flip; lands flat.
- Light & mood: golden.
- Sound: music stops f2192; Instagram Thud x3 on the jaws; card flutter; a single music-box note on the landing f2236.
- After-state: end

