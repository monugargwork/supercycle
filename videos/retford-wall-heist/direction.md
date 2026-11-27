# Retford wall heist: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/retford-wall-heist/plan.json` (0 errors; the warnings are feet touching the caption band and the fast travels: the line to the police station, the van's road, the push onto the courtroom TV).
All positions are set-local metres (y up). 30 fps, 2425 frames (VO ends f2392). Six places: the Retford estate (the unit, its side yard, the estate road west to the gantries and east to the police station, one set), the kid's room, the control room, the Manchester storage yard, the Mansfield court front and the courtroom.

## Tone
A dry true-crime fable with sight gags. Generic cartoon people, no likenesses or names; the business is never named or branded (TRADING CARDS). Everything is "alleged": no conviction is shown; the last word is the notice board's plea hearing.

## Quality bar (25 Nov 2026)
No blur, no shadows. Night is rich blue with warm practical lights (sodium lamps, Christmas bulbs, lit windows), never grey. Dawn at the yard is pink-orange; the court and the last scene are bright days with blue skies and clouds. Medium-wide by default, heads and feet in frame; real card scans in the shop window. Nobody sits; every gag is one motion.

## Visual laws
- Being seen = a camera's red REC lamp blinking while the van is in its view (the yard post, the road cameras, the control-room monitors).
- The alarm's reach = its cable, followed pole to pole to the station's flashing lamp.
- Time = light: night (S01-S08) → dawn (S11) → morning sun (S12) → autumn (S13-S16) → winter sun (S17); the days of watching are the dashboard calendar's torn pages.

## Transitions
Two hard cuts (S06 "Khoan", S15 out of the courtroom). Travels: through the hole and back out (S01-S02), up the cable to the station and back to the wide (S03-S04), following the van west (S08). Dissolves for time (S05, S13, S17) and for the separate places (the kid's room, the control room, the yard, the courtroom).

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f55 | f100 | 1:00 AM |
| f112 | f140 | 26 |
| f368 | f410 | 12/2025 |
| f1708 | f1765 | 11 THANG SAU |

## Sets

### unit
- Origin in the shared world: [0, 0, 0]. Axes: the unit's front wall is z 0 (faces +z, the estate road along x); the side wall with the hole is x 6 (faces +x, the side yard); the police station is down the road at x 55..65 across it; the road runs west (-x) under the two gantry signs.
- Light: night; sun az/el [-40, 35]. Open camera sides: +x, +z.
- Marks [x, z]: A_drill [6.85, -4.75]; A_load [7.2, -3.6]; B_rack [4.68, -1.7]; B_hole [5.3, -3.6]; A_freeze [7, -4.75]; B_freeze [7.5, -3.2]; officer [58.6, 15.4]; kid_walk [6.5, 3.2]; kid_door [2.5, 0.55].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| unit | new: trade unit x -6..6, z -10..0, 5 m: cream-and-sky-blue ribbed cladding on the front, red brick on the side wall (x 6) with a 25 cm wall; a shallow red roof; inside a warm-lit warehouse with a concrete floor, ceiling lights and racks of cartons | [0, 2.5, -5] | [12, 5, 10] |
| hole | new: the breach in the side wall: a brick plug 90 cm across in a ring of 22 drilled holes (dark dots); on f32 it tips inward about its bottom edge and lands flat on the warehouse floor, four loose bricks hop and settle; the round tunnel through the wall shows brick ends. Bricked up with paler new bricks in S17 | [6, 0.95, -4] | [0.9, 0.9, 0.25] |
| front | new: the front wall: a roller shutter x -4.6..-1.2 (closed), a display window x 0.15..1.75 with six real card scans on easels on a red felt shelf, a glass door x 2..3 with a brass bell inside and a Christmas wreath; a sign board TRADING CARDS over the front; a string of warm Christmas bulbs along the fascia | [0, 2, 0.05] | [12, 4.5, 0.1] |
| racks | new: steel racks x 3.4..4.2 z -8.2..-1.2 (orange uprights, blue beams), five levels of brown cartons 40 x 30 x 30 cm stencilled TRADING CARDS / FRAGILE; more racks deeper in | [3.8, 1, -4.7] | [0.8, 2, 7] |
| bell | new: the alarm bell box on the side wall: red steel box 36 x 46 x 12 cm with a round bell dome and a blue strobe lamp, a hammer that rattles; its cable climbs the wall to the roof edge and runs to the first pole | [6.04, 3.4, -2] | [0.12, 0.46, 0.36] |
| post | new: the yard's lamp post (6.2 m, green) with an orange sodium lamp head and a white CCTV camera on an arm: housing 30 cm, sun hood, a black lens, a red REC lamp; the head swivels | [12.6, 3.1, -0.6] | [0.3, 6.2, 0.3] |
| van | new: white panel van 5.2 x 2.0 x 2.3 m: orange roof ladder, a dent in the sliding side door (right side), rear doors that open, a hollow cab (dash, wheel, windscreen); a printed number plate taped over the real one at the back, one tape corner lifting (TK18 RVW over YD68 PQX) | [8.7, 1.15, -4.2] | [5.2, 2.3, 2] |
| road | new: the estate road along x (z 4..11): asphalt, white dashes, kerbs, pavements; telephone poles at z 3.5 every 12 m carrying the alarm line east to the police station; the A-road west with two blue gantry signs (SOUTH YORKSHIRE at x -18, MANCHESTER at x -58) and five road cameras on poles; lamp posts with warm sodium light; hedges, fields, distant hills | [0, 0, 7.5] | [400, 0.1, 7] |
| station | new: the police station across the road at x 55..65, z 13..20: red brick, a blue POLICE lamp over the door, a lit window (x 56.6..59.6) into the front office: a desk officer standing, an alarm panel whose red lamp flashes from f229 | [60, 2.3, 16.5] | [10, 4.6, 7] |
| estate | new: neighbour units (cladding in cream, sky blue, red), a RETFORD town sign (white with black letters) by the yard entrance at x 14.6, a lay-by car park across the road (x -5..8, z 13..19) where the van waits by day, hedges and trees, a church spire far off | [0, 2, 0] | [60, 4, 40] |

### kidroom
- Origin in the shared world: [400, 0, 0]. Axes: the kid stands behind a tall desk facing +z (the lens); the window in the back wall.
- Light: day; sun az/el [30, 45]. Open camera sides: +z.
- Marks [x, z]: kid [0, -0.42].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: a kid's room x -2.4..2.4, z -2.2..3, 2.7 m: sky-blue walls with a white dado, a window with blue sky and clouds, posters, a bookshelf with toys and binders, a bunting string, wood floor, a rug | [0, 1.35, 0.4] | [4.8, 2.7, 5.2] |
| desk | new: a tall standing desk x -0.6..0.6, z -0.3..0.3, top 0.86: warm oak, a pencil pot, a ruler, an eraser | [0, 0.43, 0] | [1.2, 0.86, 0.6] |
| book | new: a school notebook 20 x 27 cm lying on the desk: a red cover hinged at its left edge (spine along z), a white name label MINH; a second label AN on a backing sheet; inside, lined pages with MINH written in the same wobbly hand at the top of every page | [0.05, 0.866, -0.06] | [0.2, 0.01, 0.27] |

### ctrl
- Origin in the shared world: [600, 0, 0]. Axes: the screens are on the back wall z -3, facing +z; the lens at +z.
- Light: day; sun az/el [20, 40]. Open camera sides: +z.
- Marks [x, z]: officer [0.42, -2.25]; aide [-2.6, -1.4].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: police control room x -3.5..3.5, z -3..4, 3 m: warm cream walls, blue carpet, ceiling lights, a clock, a POLICE crest-free plaque, plants | [0, 1.5, 0.5] | [7, 3, 7] |
| map | new: a big wall screen 2.4 x 1.5 m at x -2..0.4: a map of northern England (green land, blue motorways), RETFORD, SOUTH YORKSHIRE, MANCHESTER; a red route draws itself west as camera dots light up along it | [-0.8, 1.65, -2.98] | [2.4, 1.5, 0.05] |
| mons | new: six monitors (2 x 3) at x 0.75..2.85: each shows a road camera view with the same white van (orange roof ladder, dent in the side door) and a CAM number | [1.8, 1.65, -2.98] | [2.1, 1.8, 0.05] |
| console | new: a standing-height console desk with keyboards and phones | [1.75, 0.49, -2.25] | [2.3, 0.98, 0.4] |

### yard
- Origin in the shared world: [800, 0, 0]. Axes: an open shipping container's doors face +z at z 0; the van is backed up to it; the yard gate in the fence at z 10 (x -4..4); the city behind -z.
- Light: golden; sun az/el [-55, 14]. Open camera sides: +x, +z.
- Marks [x, z]: C1 [-1.95, 1.4]; C2 [1.3, 1.5]; cop1 [2.4, 3]; cop2 [-2.6, 3.4]; det [4.9, 5.9]; stack [3.7, 5.2].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| containers | new: rows of shipping containers (orange, sky blue, green, red, 6.06 x 2.44 x 2.6 m, corrugated sides, door bars), stacked two high in places; the open one at x -1.6..0.84, z -6.06..0 with both doors swung open, cartons inside | [-0.38, 1.3, -3.03] | [2.44, 2.6, 6.06] |
| van | reuse: the van, backed up to the container (rear at z 1.0), rear doors open; inside: cartons and a sledgehammer lying on the floor | [-0.38, 1.15, 3.6] | [2, 2.3, 5.2] |
| car | new: police car (white, blue-and-yellow checks along the side, a blue light bar that flashes) that swings across the gate f1337-1352 | [0.8, 0.75, 8.6] | [4.6, 1.5, 1.8] |
| yard | new: concrete yard, a steel mesh fence with a gate, floodlight masts, a yard office cabin, a pallet stack, Manchester towers far behind under a pink-orange dawn sky with clouds | [0, 0, 0] | [60, 3, 40] |

### court
- Origin in the shared world: [1000, 0, 0]. Axes: the court front is z 0 (faces +z, the plaza); the doors at x -1.2..1.2; the signpost on the plaza at x 4.3.
- Light: day; sun az/el [-30, 42]. Open camera sides: +z.
- Marks [x, z]: signpost [4.3, 6.2].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| front | new: Mansfield court front x -8..8, 9 m: red brick with cream stone bands, a tall glass entrance x -1.2..1.2 with a canopy, the letters MANSFIELD MAGISTRATES' COURT, windows in rows | [0, 4.5, -0.2] | [16, 9, 0.4] |
| board | new: a glass-fronted notice board 90 x 70 cm on the wall left of the doors: the daily list with one sheet PLEA HEARING / NOTTINGHAM CROWN COURT / 15 DEC (no names) | [-2.7, 1.5, 0.05] | [0.9, 0.7, 0.05] |
| signpost | new: a black-and-white finger post with three arms: RETFORD (pointing +x), MANSFIELD CENTRE, NOTTINGHAM | [4.3, 1.4, 6.2] | [0.1, 2.8, 0.1] |
| plaza | new: paved plaza with two low steps at the door, planters with red flowers, autumn trees (orange and yellow), bollards, a bench nobody uses, parked cars at the kerb, houses opposite | [0, 0, 6] | [30, 0.2, 14] |

### courtroom
- Origin in the shared world: [1200, 0, 0]. Axes: the wall TV is on the back wall z -4 at x -1.8; the glass dock at x 0.6..3.3; the lens at +z.
- Light: day; sun az/el [10, 40]. Open camera sides: +z.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: courtroom x -4..4, z -4..4, 4.2 m: warm oak panelling, cream walls above, green carpet, tall windows with blue sky, the bench (empty) and a clerk's desk | [0, 2.1, 0] | [8, 4.2, 8] |
| tv | new: wall TV 1.7 x 0.96 m: a video link in three tiles, two men in prison-grey sweatshirts against cell walls with a barred window, one man at home in front of a bookshelf | [-1.8, 2.35, -3.98] | [1.7, 0.96, 0.05] |
| dock | new: the glass dock x 0.6..3.3, z -1.7..-0.4: an oak base 0.4 m, glass panels to 1.15 m, three men standing in it | [1.95, 0.58, -1.05] | [2.7, 1.15, 1.3] |

## Cast

- **A:** green hoodie up, beanie, eye mask, black trousers. Items: cordless drill, cartons. Views: side, front.
- **B:** rust-orange hoodie up, beanie, eye mask, black trousers. Items: cartons. Views: front, side walking.
- **officer:** hi-vis yellow jacket, police cap. Items: none. Views: front.
- **cop1:** hi-vis yellow jacket, police cap. Items: none. Views: front, side walking.
- **cop2:** hi-vis yellow jacket, police cap. Items: none. Views: front, side walking.
- **det:** camel coat, red scarf, DETECTIVE lanyard, short dark hair. Items: none. Views: front.
- **C1:** teal jacket, tan trousers, cap. Items: carton. Views: front, side walking.
- **C2:** red jacket, blue jeans, hair. Items: carton. Views: front.
- **kid:** yellow school jumper, blue trousers. Items: notebook. Views: front.
- **kid2:** red coat, bobble hat. Items: none. Views: side walking, front.
- **men:** six plain suits: blue, brown, green, maroon, tan, teal; generic faces, no names. Items: none. Views: front, side walking.

## Scenes

### S01 ★ · 0:00.0-0:03.7 · f0-f110 · "Họ khoan xuyên một bức tường lúc một giờ sáng"
- Gloss: They drilled through a wall at one in the morning
- Spine link: 1. Viewer must get: A wall at night, the last drill hole, and the brick plug crashing in: they are through.
- In: open on the act. Out: travel (the camera dollies through the hole into the warehouse).
- Set: unit. Light: night.
- Build: new: the side wall with the ring of 22 drilled holes and the plug; A's cordless drill (yellow body, black grip, 20 cm bit).
- Blocking: A at A_drill, side view facing the wall (-x), drill held level at the ring's last hole (lower right, nearest him); f40 he steps back to A_wait.
  - A at [6.85, -4.75], side, facing -x; drilling f0-29; steps back f40-52 to A_wait; stern -> grin.
- Action, against the words: f0 the drill already turning in the last hole (a dust plume spits from it every 3 f); f20-28 the bit breaks through (a puff inside the ring); f28 the last dot is dark: the ring is closed; f29-31 he pulls the drill out; f32 ('tường') the plug tips inward about its bottom edge, falls 90 deg in 8 f and slams flat on the warehouse floor (f40), four loose bricks hop and settle by f60; warm light floods out of the round hole; f40-52 A steps back; f55 title 1:00 AM; f70-110 the camera pushes to the hole.
- Acting: A: effort squint while drilling, a satisfied nod on the crash.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [8.257, 1.505, -0.236] | [6.416, 1.03, -4.371] | 44 | 0.08 | 0 | the wall, the ring of holes and A with the drill, full body |
| 76 | glide 34 f | [8.2, 1.05, -4] | [5, 0.98, -4] | 44 | 0 | 0 | square up to the hole: warm light inside |

- Kicks (7 f): f32 strength 0.9; f40 strength 0.6.
- Physics & FX: the plug: hinged fall about its bottom edge (rigid, 60 kg), lands flat with a 2 cm bounce; four loose bricks (2.5 kg each) hop and settle (analytic bounces, restitution 0.3); dust puffs.
- Light & mood: rich blue night, moon and clouds; warm sodium lamp on the yard; warm interior light through the hole.
- Sound: drill whine f0-29; a crunch f20; a heavy masonry crash f40; brick clatter f44-60; a low string hit on f32.
- After-state: The plug lies flat inside; the hole stays open until S17.

### S02 · 0:03.7-0:05.9 · f110-f178 · "để khuân đi hai mươi sáu hộp thẻ Pokémon"
- Gloss: to carry off twenty-six boxes of Pokémon cards
- Spine link: 1. Viewer must get: Inside: racks of cartons; B lifts one off and passes it out through the hole.
- In: travel. Out: follow (the camera backs out through the hole with the carton).
- Set: unit. Light: night.
- Build: the warehouse: racks of cartons (TRADING CARDS / FRAGILE), the plug lying on the floor, ceiling lights.
- Blocking: B at B_rack (front view) lifts a carton from the third shelf f116-128, walks to B_hole f130-146 and pushes it into the hole f146-160.
  - B at [4.68, -1.7], front; lifts a carton f116-128; walks to B_hole f130-146; pushes it into the hole f146-160; nervous.
- Action, against the words: f110-116 the camera passes through the hole (along z -4); f112 title 26; f116-128 B slides a carton off the rack; f130-146 B carries it to the hole; f146-160 he pushes it into the tunnel; f158-178 the camera backs out through the hole ahead of the carton.
- Acting: B: quick, careful, eyes on the hole.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 110 | open | [5.25, 1, -4] | [3, 0.95, -3.7] | 46 | 0 | 0 | through the hole |
| 122 | glide 18 f | [5.62, 1.25, -4.05] | [4.75, 0.95, -1.75] | 60 | 0.06 | 0 | turn to B and the racks of cartons |
| 158 | glide 18 f | [7.4, 1.05, -4] | [5.2, 1, -4] | 44 | 0 | 0 | back out through the hole with the carton |

- Kicks (7 f): none.
- Physics & FX: the carton: kinematic in his hands.
- Light & mood: warm warehouse light, the hole a dark-blue circle of night.
- Sound: cardboard scrape f118; footsteps; a soft thud as the carton slides into the tunnel f150.
- After-state: A gap on the third shelf.

### S03 · 0:05.9-0:08.5 · f178-f254 · "và chuông báo động réo thẳng về đồn cảnh sát"
- Gloss: and the alarm bell rang straight through to the police station
- Spine link: 1. Viewer must get: The bell rattles; its line runs pole to pole to the police station, where a red lamp flashes and the officer turns.
- In: follow. Out: travel (the camera flies back along the road to the wide of the estate).
- Set: unit. Light: night.
- Build: the bell box and its cable, the telephone poles and the line, the police station and its lit window.
- Blocking: Officer at the officer mark inside the station, front view; turns his eyes to the panel at f236.
  - officer at [58.6, 15.4], front; standing at the desk; eyes to the panel f236; neutral -> shock.
- Action, against the words: f181 ('chuông') the bell hammer rattles (2 mm shake, 6 Hz), the blue strobe flashes; f188-214 the camera climbs the cable to the roof edge and the first pole; f214-236 it races east along the line, pole to pole; f229 the station's alarm-panel lamp flashes red (on 6 f / off 6 f); f236 the officer's eyes snap to it.
- Acting: Officer: calm -> alert.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 178 | open | [8.5, 3.15, -0.7] | [6.04, 3.4, -2] | 34 | 0.08 | 0 | the bell rattles |
| 200 | glide 16 f | [9.2, 6.4, 0.8] | [6.6, 6, 3.5] | 44 | 0 | 0 | up the cable to the line |
| 214 | glide 18 f | [36, 7, 1.6] | [48, 6, 3.5] | 46 | 0 | 0 | along the line, pole to pole |
| 228 | glide 16 f | [58.4, 1.85, 9.4] | [58.3, 1.45, 15] | 42 | 0.08 | 0 | the station window: the red lamp and the officer |

- Kicks (7 f): f181 strength 0.4.
- Physics & FX: none.
- Light & mood: night; the station window warm, the blue POLICE lamp, the red alarm lamp.
- Sound: the alarm bell (synth bell, continuous from f181 under everything to f670, ducked); a whoosh along the line f214-236; a beep-beep from the panel f229.
- After-state: The bell keeps ringing (heard) until S07.

### S04 · 0:08.5-0:13.8 · f254-f415 · "Đó là một kho hàng ở thị trấn Retford, nước Anh, rạng sáng cuối tháng mười hai năm ngoái."
- Gloss: It was a warehouse in the town of Retford, England, before dawn at the end of last December.
- Spine link: 1. Viewer must get: The whole place at once: RETFORD sign, the TRADING CARDS unit with its window of cards, Christmas lights, the van in the side yard.
- In: travel. Out: dissolve 8 f (days earlier).
- Set: unit. Light: night.
- Build: the estate wide: the RETFORD town sign, the unit's sign and window, Christmas bulbs and the wreath, the side yard with the van and the lamp post with the camera.
- Blocking: A and B small in the side yard, carrying cartons from the hole to the van.
  - A at [7.2, -3.6], side walking; hole -> van with a carton f300-340; neutral.
- Action, against the words: f254-300 the camera flies back from the station and settles on the wide; f300-415 slow push; f368 title 12/2025 ('tháng mười hai' f372); the Christmas bulbs twinkle (each bulb 30 f on, 4 f dim); A walks hole -> van with a carton f300-340, B f350-390.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 254 | open | [-5.442, 6.142, 45.046] | [5.837, 0.417, -0.191] | 50 | 0.01 | 0 | the wide: town sign, unit, yard, van |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: rich blue night; warm windows and bulbs.
- Sound: night air, a far dog, the bell under it; a soft music-box Christmas sting f372.
- After-state: Unchanged.

### S05 · 0:13.8-0:18.3 · f415-f548 · "Theo cảnh sát, cả nhóm đã nhắm vào nơi này suốt nhiều ngày."
- Gloss: According to police, the group had been targeting the place for days.
- Spine link: 2. Viewer must get: From the van across the road: the shop, and the dashboard calendar tearing 22, 23, 24 DEC.
- In: dissolve 8 f. Out: cut.
- Set: unit. Light: day.
- Build: the van in the lay-by opposite (nose toward the unit), its cab: dash, wheel, a tear-off desk calendar on the dash; the unit by day (cards in the window, wreath).
- Blocking: Nobody in frame (the cab is empty: we look out from it); a customer walks into the shop f430-470.
- Action, against the words: f415-548 locked through the windscreen; the calendar's top page tears off and drops into the footwell at f455 (22 -> 23), f490 (23 -> 24), f522 (24 -> 26: the night of the break-in; 25 is torn with 24); each page lifts at its top corner, flips and flutters down in 10 f.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 415 | open | [1.15, 1.55, 15.15] | [1.4, 0.62, 8.4] | 50 | 0.02 | 0 | through the windscreen: the shop across the road, the calendar on the dash |

- Kicks (7 f): none.
- Physics & FX: calendar pages: light, a curl and flutter (scripted sine fall).
- Light & mood: bright winter day, blue sky with clouds.
- Sound: a ticking clock under it; a paper tear on each page f455, f490, f522.
- After-state: The calendar reads 26 DEC.

### S06 · 0:18.3-0:22.4 · f548-f671 · "Khoan, chuẩn bị nhiều ngày mà vẫn bị chuông báo động bắt quả tang?"
- Gloss: Wait, days of preparation and they still got caught red-handed by the alarm?
- Spine link: 2. Viewer must get: The two of them frozen by the hole with cartons in their arms, the bell ringing above, red light washing over them.
- In: cut. Out: tilt.
- Set: unit. Light: night.
- Build: as S01 after the breach; the bell box ringing.
- Blocking: A at A_freeze and B at B_freeze, front view, each holding a carton at the chest; frozen.
  - A at [7, -4.75], front; carton at the chest, frozen; nervous.
  - B at [7.5, -3.2], front; carton at the chest, frozen; shock.
- Action, against the words: f548 hard cut ('Khoan'): both frozen mid-step, eyes wide to the lens; f600-645 slow push; f631-670 ('bắt quả tang') the red strobe on the bell box flashes and washes the frame red (8 f on / 8 f off).
- Acting: A and B: nervous, a sweat drop each; frozen.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 548 | open | [14.486, 2.312, -1.751] | [6.747, 1.48, -3.396] | 46 | 0.1 | 0 | frozen at the hole, the bell above |

- Kicks (7 f): f548 strength 0.6; f631 strength 0.4.
- Physics & FX: none.
- Light & mood: night; the red strobe.
- Sound: record scratch + Huh (meme) f548; the bell louder; a sting f631.
- After-state: Unchanged.

### S07 ★ · 0:22.4-0:27.6 · f671-f827 · "Hóa ra, chuông chưa phải rắc rối lớn nhất. Camera mới là rắc rối lớn."
- Gloss: Turns out the bell wasn't the biggest problem. The camera was the big problem.
- Spine link: 3. Viewer must get: The bell is small; up on the lamp post the camera is big, its REC lamp blinks on and it swivels to watch the van being loaded.
- In: tilt. Out: glide.
- Set: unit. Light: night.
- Build: the lamp post with the CCTV camera (REC lamp, swivel head), the van in the yard with its side door open.
- Blocking: A at A_load carries a carton from the hole to the van's side door and back (side view walking), f700-760 and f770-820.
  - A at [7.2, -3.6], side walking; hole -> van door with a carton, and back; neutral.
- Action, against the words: f671-700 the camera tilts from the bell; f700-740 it pans and tilts up the lamp post to the camera head; f754 ('Camera') the REC lamp blinks on (15 f on / 15 f off from here to S10) and the head swivels 40 deg down toward the van (f756-772); f780-827 the camera pulls back and down to show the post, its camera and the van being loaded under it.
- Acting: A: busy, never looks up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 671 | open | [9.6, 1.6, -6.4] | [6.04, 3.4, -2] | 40 | 0.08 | 0 | the small bell |
| 700 | glide 36 f | [10.3, 2.4, -6.8] | [12.3, 5.35, -0.6] | 36 | 0.12 | 0 | up the post to the camera: it is the big one |
| 782 | glide 36 f | [18.435, 3.82, -18.813] | [9.318, 1.903, -3.022] | 50 | 0.06 | 0 | the camera watching the van being loaded |

- Kicks (7 f): f754 strength 0.5.
- Physics & FX: none.
- Light & mood: night; the sodium lamp; the REC lamp's red dot.
- Sound: the bell fades under; a low drone; Camera shutter (meme) f754; a servo whirr on the swivel f756.
- After-state: The camera keeps watching (REC) through S08.

### S08 ★ · 0:27.6-0:33.1 · f827-f994 · "Chiếc xe tải chở hộp thẻ mang biển số nhái, chạy về phía nam Yorkshire rồi vòng sang Manchester."
- Gloss: The van carrying the boxes wore cloned plates and headed south toward Yorkshire, then swung over to Manchester.
- Spine link: 3. Viewer must get: A printed plate taped over the real one; the van pulls out and runs west under SOUTH YORKSHIRE, then MANCHESTER; every road camera's red lamp blinks as it passes.
- In: glide. Out: dissolve 8 f (match: the taped plate becomes the notebook's name label).
- Set: unit. Light: night.
- Build: the taped plate (TK18 RVW printed on paper over YD68 PQX, a lifting corner of tape), the van's tail lights; the road west, the gantries, the road cameras.
- Blocking: Nobody on foot (A and B in the van).
- Action, against the words: f827-860 glide down to the back of the van; f860-890 insert on the plate ('biển số nhái' f872-890): the tape corner flutters; f885 the van pulls forward out of the yard, turns west onto the road (f897-915) and runs at 30 m/s; f915-994 the camera follows behind and above; each road camera's REC lamp lights as the van passes it; the gantries: SOUTH YORKSHIRE overhead at f936 ('nam Yorkshire'), MANCHESTER at f976.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 827 | open | [8.7, 0.8, -8.28] | [8.7, 0.56, -6.83] | 32 | 0.1 | 0 | the taped plate |
| 890 | glide 22 f | [4.7, 4.2, -12.394] | [8.7, 1.4, 4.606] | 46 | 0 | 0 | follow the van west |
| 898 | glide 22 f | [8.501, 4.2, -9.79] | [5.98, 1.4, 7.491] | 46 | 0 | 0 | follow the van west |
| 906 | glide 22 f | [13.348, 4.2, -4.926] | [1.571, 1.4, 7.971] | 46 | 0 | 0 | follow the van west |
| 914 | glide 22 f | [13.751, 4.2, 0.902] | [-2.933, 1.4, 6.063] | 46 | 0 | 0 | follow the van west |
| 922 | glide 22 f | [6.6, 4.2, 1.75] | [-10.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 930 | glide 22 f | [-1.4, 4.2, 1.75] | [-18.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 938 | glide 22 f | [-9.4, 4.2, 1.75] | [-26.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 946 | glide 22 f | [-17.4, 4.2, 1.75] | [-34.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 954 | glide 22 f | [-25.4, 4.2, 1.75] | [-42.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 962 | glide 22 f | [-33.4, 4.2, 1.75] | [-50.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 970 | glide 22 f | [-41.4, 4.2, 1.75] | [-58.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 978 | glide 22 f | [-49.4, 4.2, 1.75] | [-66.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |
| 986 | glide 22 f | [-57.4, 4.2, 1.75] | [-74.4, 1.4, 5.75] | 46 | 0 | 0 | follow the van west |

- Kicks (7 f): f872 strength 0.3.
- Physics & FX: the van: kinematic along the plan's van_route; a 2 cm body roll in the turn.
- Light & mood: night; warm sodium lamps along the road; the van's red tail lights.
- Sound: van engine start f880, revs, tyre hiss; a whoosh under each gantry f936, f976; a REC beep for each camera.
- After-state: The van has gone west.

### S09 · 0:33.1-0:40.2 · f994-f1207 · "Bạn thấy đấy, biển số nhái giống như đổi tên trên bìa vở: bìa đổi rồi, nhưng chữ viết bên trong vẫn là của bạn."
- Gloss: You see, a cloned plate is like changing the name on a notebook cover: the cover's changed, but the handwriting inside is still yours.
- Spine link: 3. Viewer must get: A kid swaps the name label on his notebook; inside, his old name is at the top of every page.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: kidroom. Light: day.
- Build: the kid's room; the tall desk; the notebook with its MINH label, the AN label on a backing sheet.
- Blocking: Kid at the kid mark behind the desk, front view.
  - kid at [0, -0.42], front; peels the label f1051-1062, sticks the new one f1066-1094, opens the cover f1124-1136; smile -> grin -> nervous.
- Action, against the words: f994-1040 calm medium on the kid at the desk; f1040 glide to the notebook; f1051 ('đổi tên') he peels the MINH label off (it curls up from its left edge over 10 f and lifts away in his hand); f1066-1094 he presses the AN label on ('bìa vở' f1070, 'bìa đổi rồi' f1094); f1124 ('nhưng') he opens the cover (hinged at the spine, 180 deg over 12 f); f1135-1190 the pages: MINH at the top of every page in the same wobbly hand ('chữ viết bên trong vẫn là của bạn'); f1180-1207 back to him: a guilty grin.
- Acting: Kid: sly -> proud -> caught-out grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 994 | open | [0, 1.314, 3.837] | [0, 0.606, -0.18] | 42 | 0.06 | 0 | calm: the kid at the desk with the notebook |
| 1040 | glide 18 f | [0.05, 1.45, 0.5] | [0.05, 0.87, -0.07] | 30 | 0.06 | 0 | the label |
| 1132 | glide 16 f | [-0.05, 1.7, 0.78] | [-0.05, 0.87, -0.06] | 32 | 0.08 | 0 | the pages: MINH on every one |
| 1180 | glide 20 f | [0, 1.314, 3.837] | [0, 0.606, -0.18] | 42 | 0.06 | 0 | him: caught out |

- Kicks (7 f): none.
- Physics & FX: the label: a curl (scripted); the cover: hinged.
- Light & mood: warm day light through the window.
- Sound: soft vibes theme; a sticky peel f1051; a pat f1094; a page flop f1124; a little 'uh-oh' pluck f1157.
- After-state: The notebook is open; it says AN on the cover and MINH inside.

### S10 · 0:40.2-0:44.1 · f1207-f1322 · "Camera vẫn thấy chiếc xe rẽ ở đâu, qua những con đường nào."
- Gloss: The cameras still saw where the van turned, which roads it took.
- Spine link: 3. Viewer must get: A wall of monitors, every one showing the same dented van with the orange ladder; the route draws itself across the map to Manchester.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: ctrl. Light: day.
- Build: the control room; the map screen; six monitors with the van.
- Blocking: Officer at the officer mark, front view, pointing at the map; an aide by the left wall with a mug.
  - officer at [0.42, -2.25], front; points at the map f1290-1322; stern.
  - aide at [-2.6, -1.4], front; holds a mug; neutral.
- Action, against the words: f1207-1300 the monitors light one by one (every 12 f) as the van reaches each camera; the red route grows from RETFORD west to MANCHESTER in step ('rẽ ở đâu' f1249-1265, 'con đường nào' f1286-1304); f1290 the officer points at MANCHESTER; f1290-1322 push into the route's end.
- Acting: Officer: focused, a nod.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1207 | open | [0.427, 2.103, 9.551] | [0.427, 0.83, -2.559] | 48 | 0.06 | 0 | the monitors and the map, the officer full body |
| 1290 | glide 28 f | [-1.412, 1.72, -1.25] | [-1.712, 1.77, -2.97] | 34 | 0.1 | 0 | the route ends at Manchester |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm interior; the screens glow.
- Sound: soft data blips per monitor; a rising arpeggio as the route draws; a lock-on beep f1300.
- After-state: The route is drawn.

### S11 ★ · 0:44.1-0:51.8 · f1322-f1553 · "Cảnh sát chặn nó ở một bãi chứa đồ tại Manchester. Hai người bị bắt ngay lúc đang bốc hộp xuống, cùng một cây búa tạ trong xe."
- Gloss: Police stopped it at a storage yard in Manchester. Two men were arrested right as they were unloading the boxes, along with a sledgehammer in the van.
- Spine link: 4. Viewer must get: Dawn at the yard: two men carrying cartons into a container; a police car swings across the gate; they freeze; a carton drops; the sledgehammer in the van.
- In: dissolve 8 f. Out: glide.
- Set: yard. Light: golden.
- Build: the yard: containers, the open one, the van backed up with its rear doors open, the gate; the police car; the sledgehammer.
- Blocking: C1 and C2 carry cartons van -> container (C1 at C1, C2 at C2, front view); cop1 and cop2 get out of the car (f1365) and walk to their marks (f1370-1430).
  - C1 at [-1.95, 1.4], front; carton at the chest; neutral -> shock.
  - C2 at [1.3, 1.5], front; carton at the chest; drops it f1440; neutral -> shock.
  - cop1 at [2.4, 3], side walking then front; walks in f1370-1430; stern.
  - cop2 at [-2.6, 3.4], side walking then front; walks in f1370-1430; stern.
- Action, against the words: f1322-1337 the men carry cartons; f1337 ('chặn') the police car swings in from the right and stops across the gate (f1337-1352), the light bar flashes blue; f1365 the doors open, the officers walk in; f1438 ('bắt') both men freeze (shock); f1440 C2's carton drops from his chest, lands at f1452, bounces twice and settles on its side by f1470 (closed); f1500 glide into the van's open back: the sledgehammer on the floor ('búa tạ' f1510).
- Acting: C1, C2: busy -> shock. Officers: firm.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1322 | open | [10.164, 2.96, -12.575] | [0.885, 0.352, 3.497] | 50 | 0.05 | 0 | the yard: van, container, the men, the gate behind |
| 1420 | glide 24 f | [3.797, 1.846, -11.228] | [0.14, 0.361, 2.419] | 46 | 0.1 | 0 | the arrest |
| 1498 | glide 16 f | [-0.33, 1.3, 0.25] | [-0.62, 0.58, 1.9] | 34 | 0.08 | 0 | the sledgehammer in the van |

- Kicks (7 f): f1352 strength 0.5; f1438 strength 0.6; f1452 strength 0.4.
- Physics & FX: the car: kinematic slide-and-swing with a 3 cm body pitch on the stop; the carton: drop 1.1 m (g), two bounces (restitution 0.3), a 90 deg tip onto its side.
- Light & mood: pink-orange dawn, long warm light, blue sky with clouds; blue flashes from the light bar.
- Sound: siren whoop f1337; tyre skid f1340-1352; car doors f1365; footsteps; a cardboard thud f1452, f1460; a steel 'ting' on the hammer f1510.
- After-state: The dropped carton lies on its side by C2 through S12.

### S12 · 0:51.8-0:56.9 · f1553-f1706 · "Thám tử phụ trách nói, chỉ trong vài giờ, họ đã bắt hai nghi phạm và lấy lại số hàng bị mất."
- Gloss: The detective in charge said that within a few hours they had arrested two suspects and recovered the stolen goods.
- Spine link: 4. Viewer must get: The detective beside the recovered stack of 26 cartons as the sun rises over the containers.
- In: glide. Out: dissolve 8 f (eleven months later).
- Set: yard. Light: golden.
- Build: the recovered stack (26 cartons on a pallet, police tape round it), the detective; the sun disc low over the containers.
- Blocking: Detective at det, front view; cop1 behind at the car.
  - det at [4.9, 5.9], front; taps her watch f1588; nods at the stack f1650; stern -> smile.
- Action, against the words: f1553-1600 glide out of the van to the detective and the stack; f1588 ('chỉ trong vài giờ') she taps her watch; f1650 she nods at the stack ('lấy lại'); the sun climbs 2 deg over the scene.
- Acting: Detective: brisk, satisfied.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1553 | open | [2.208, 1.253, 0.739] | [4.06, 0.684, 5.827] | 44 | 0.07 | 0 | the detective and the recovered stack |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden morning sun, warm.
- Sound: birds; a radio crackle; a warm brass chord on 'lấy lại' f1685.
- After-state: Unchanged.

### S13 · 0:56.9-1:03.3 · f1706-f1900 · "Mười một tháng sau, sáu người đàn ông bị buộc tội âm mưu trộm cắp ra tòa ở Mansfield."
- Gloss: Eleven months later, six men charged with conspiracy to commit burglary appeared in court in Mansfield.
- Spine link: 5. Viewer must get: The Mansfield court in autumn sun, six men in suits waiting in front of the doors.
- In: dissolve 8 f. Out: dissolve 6 f (through the doors).
- Set: court. Light: day.
- Build: the court front, the plaza, autumn trees, the six men.
- Blocking: Six men at the six men marks, front view, standing apart in a loose line.
  - man1 at [-2.6, 3.2], front; standing; neutral.
  - man2 at [-1.55, 3.5], front; standing; neutral.
  - man3 at [-0.5, 3.2], front; standing; neutral.
  - man4 at [0.55, 3.5], front; standing; neutral.
  - man5 at [1.6, 3.2], front; standing; neutral.
  - man6 at [2.65, 3.5], front; standing; neutral.
- Action, against the words: f1706-1780 the camera cranes down from the lettering to the doors; f1708 title 11 THANG SAU; f1765 ('sáu người') the six are all in frame; slow push to f1900; one adjusts his tie f1810, one checks his watch f1850.
- Acting: The six: tense, neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1706 | open | [0, 7.6, 21] | [0, 5.6, 0] | 44 | 0 | 0 | the court's lettering |
| 1762 | glide 46 f | [0.053, 2.398, 18.95] | [0.053, 0.731, 3.092] | 46 | 0.06 | 0 | the six in front of the doors |

- Kicks (7 f): none.
- Physics & FX: falling leaves (light, sine flutter).
- Light & mood: crisp autumn sun, blue sky with clouds.
- Sound: town ambience, a bus far off; a low serious piano.
- After-state: Unchanged.

### S14 · 1:03.3-1:04.9 · f1900-f1946 · "Hai người bị tạm giam."
- Gloss: Two were remanded in custody.
- Spine link: 5. Viewer must get: The wall TV's video link: two of the men in prison grey; three more in the glass dock.
- In: dissolve 6 f. Out: cut.
- Set: courtroom. Light: day.
- Build: the courtroom, the dock, the wall TV.
- Blocking: Three men in the dock (front view).
  - man1 at [1.15, -1.05], front; standing in the dock; neutral.
  - man2 at [1.95, -1.05], front; standing in the dock; neutral.
  - man3 at [2.75, -1.05], front; standing in the dock; neutral.
- Action, against the words: f1900-1912 the courtroom; f1912-1946 push onto the TV's two prison tiles ('tạm giam' f1920).
- Acting: Dock men: still.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1900 | open | [0.467, 1.789, 12.089] | [0.467, 0.841, -1.469] | 48 | 0.04 | 0 | the TV and the dock |
| 1912 | glide 22 f | [-2.05, 2.3, -0.9] | [-2.05, 2.35, -3.98] | 30 | 0.08 | 0 | the two prison tiles |

- Kicks (7 f): f1920 strength 0.3.
- Physics & FX: none.
- Light & mood: warm courtroom light.
- Sound: a gavel-free hush; a low bass note f1920.
- After-state: Unchanged.

### S15 · 1:04.9-1:11.4 · f1946-f2143 · "Bốn người được tại ngoại, với điều kiện không liên lạc với nhau, và không được bén mảng tới một cửa hàng thẻ bài ở Retford."
- Gloss: Four were bailed, on condition that they don't contact each other and don't go near a trading card shop in Retford.
- Spine link: 5. Viewer must get: Three come out, glance at each other and walk off three different ways; one sets off toward the RETFORD sign, stops, turns round.
- In: cut. Out: glide.
- Set: court. Light: day.
- Build: the court front, the signpost with its RETFORD arm.
- Blocking: Three men come out of the doors (from out_from) to the out marks f1950-1990; they glance at each other f1995-2005; f2008 they turn away: L walks to goL, C to goC, R to goR (the signpost) f2010-2075; R stops at f2082 ('tới'), turns round and walks to backR f2090-2140.
  - L at [-0.7, 2.4], front then side walking; walks off left; nervous.
  - C at [0, 2.7], front then side walking; walks off toward the lens and left; neutral.
  - R at [0.7, 2.4], front then side walking; walks to the signpost, stops f2082, turns back f2090; neutral -> shock.
- Action, against the words: as blocking; the doors swing open f1948 and shut f1995.
- Acting: The three: awkward glances, then each looks away; R: a double take at the sign.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1946 | open | [0.541, 2.256, 18.158] | [2.135, 0.654, 2.999] | 50 | 0.04 | 0 | the doors, the three men, the RETFORD sign |

- Kicks (7 f): f2082 strength 0.3.
- Physics & FX: the doors: hinged.
- Light & mood: autumn sun.
- Sound: door swish f1948; footsteps; a record-skip 'nope' pluck on the turn f2085.
- After-state: All three gone their separate ways.

### S16 · 1:11.4-1:14.2 · f2143-f2225 · "Tất cả mới bị cáo buộc, chưa ai bị kết án."
- Gloss: All of them are only accused; none has been convicted.
- Spine link: 5. Viewer must get: The notice board: PLEA HEARING, NOTTINGHAM CROWN COURT, 15 DEC. No names.
- In: glide. Out: dissolve 8 f.
- Set: court. Light: day.
- Build: the notice board and its sheet.
- Blocking: Nobody.
- Action, against the words: f2143-2170 glide to the board; slow push; stillness.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2143 | open | [-2.55, 1.45, 1.35] | [-2.7, 1.5, 0.05] | 36 | 0.08 | 0 | the board: allegations only |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: calm autumn sun.
- Sound: quiet; one soft piano note f2172.
- After-state: Unchanged.

### S17 · 1:14.2-1:20.8 · f2225-f2425 · "Họ khoan xuyên được bức tường. Nhưng giờ, cánh cửa của cái tiệm ấy, họ không được phép đến gần."
- Gloss: They got through the wall. But now, the door of that shop, they aren't allowed to come near.
- Spine link: 6. Viewer must get: The wall's patched ring of paler bricks; round the corner, the shop door with real cards in the window opens for a kid and the bell rings.
- In: dissolve 8 f. Out: end.
- Set: unit. Light: day.
- Build: the side wall with the bricked-up ring; the front by day: cards in the window, wreath, the door with its bell; a kid customer.
- Blocking: Kid2 walks from kid_walk to kid_door f2262-2292 (side view), pushes the door f2295 and steps in f2300-2320.
  - kid2 at [2.5, 0.55], side walking then front; walks to the door f2262-2292, pushes it f2295, steps in; grin.
- Action, against the words: f2225-2262 hold on the patched ring ('bức tường' f2255); f2262-2300 glide round the corner to the front door; f2295 ('cánh cửa') the door swings in, the bell jingles; f2320-2425 pull back to the wide: the sign, the window of real cards, the door ajar; hold to the end.
- Acting: Kid2: excited.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2225 | open | [8.6, 1.3, -2.4] | [6, 0.95, -4] | 40 | 0.08 | 0 | the patched ring |
| 2262 | glide 40 f | [5.2, 1.5, 5.4] | [2, 1.25, 0] | 44 | 0.08 | 0 | the door and the window of cards |
| 2322 | glide 56 f | [2.8, 2.6, 13.5] | [1.6, 2.2, 0] | 50 | 0.04 | 0 | the wide: the shop, its door |

- Kicks (7 f): none.
- Physics & FX: the door: hinged, eased.
- Light & mood: bright winter sun, blue sky with clouds.
- Sound: a winter street; the door bell jingle f2295; the theme's last warm chord.
- After-state: End on the shop door.

