# Goldenrod heist: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/goldenrod-heist/plan.json` (0 errors; the warnings are the S02/S05 travels through the door, the S10 tracking shot and a moment of case 1 at the caption band).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2370 frames (VO ends f2336). Five places: the Goldenrod shop (street, aisle, back lot), the highway, the rental office, the police station, the house in Justice.

## Tone
A caper that undoes itself: slick masked burglars, then the paperwork. Dry sight gags (the buffet plates, the masked customer, the megaphone, the JUSTICE sign, the walk) and a few meme sounds where the sound is the joke. Generic cartoon people, masked or no likenesses.

## Visual law
Memory = a gold trail: the rental's GPS route glows on the road, and every cell tower the phone touches lights up (blue ring, lamp stays lit). Identity = paper: the rental agreement is signed, pinned and filed.

## Transitions
Hard cuts: S13 (the masked customer), S19 (the JUSTICE sign), S22 (on foot). Place changes in the shop are camera journeys (through the door, up the storefront, back in through the window, out the back door); time jumps dissolve; S17 → S18 pushes into the map pin.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f6 | f52 | 2:00 AM |
| f298 | f342 | TWIN LAKES, WISCONSIN |
| f680 | f724 | $310,000+ |
| f952 | f1008 | CHRYSLER PACIFICA |
| f1808 | f1852 | JUSTICE, ILLINOIS |

## Sets

### shop
- Origin in the shared world: [0, 0, 0]. Axes: +z toward the street; the storefront on z 0, the shop behind it (z -8..0), the back lot and trailer beyond (z < -8).
- Light: night; sun az/el [-35, 30]. Open camera sides: +z street, the aisle inside.
- Marks [x, z]: A [0.05, 0.95]; B [-1, 1.7].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| front | new: brick storefront x -6..6, 4.6 m, door 1.1 x 2.2 (glass pane, aluminium frame), two shop windows; neighbours either side | [0, 2.3, -0.12] | [12, 4.6, 0.25] |
| sign | new: lit sign band 5.2 x 1.5 m: GOLDENROD CITY / COLLECTIBLES (plain bold lettering), POKÉMON · TCG · GRADED CARDS | [0, 3.55, 0.07] | [5.2, 1.5, 0.1] |
| town | new: green road sign 1.6 x 0.8 on two posts: TWIN LAKES / WISCONSIN (the rooster perches on it at dawn) | [2.9, 2.05, 3.5] | [1.6, 0.8, 0.05] |
| cases | new: four glass display cases in a row down the left aisle (1.5 m long, 0.6 deep, wood base to 0.82, glass box to 1.12, LED strip); real scans and slabs inside; the glass tops shatter (rigid-body shards) | [-2.4, 0.56, -4.4] | [0.6, 1.12, 7] |
| counter | new: counter along the right aisle with a cash register (drawer slides out); booster boxes on the shelves behind | [2.5, 0.5, -4.9] | [0.6, 1, 2.6] |
| trailer | new: white enclosed cargo trailer 2.2 x 4.2 x 2.2 on two axles, rear barn doors with a hasp and a brass padlock (bolt cutters snap it: rigid-body fall); stacked boxes inside | [-1.5, 1.6, -12.7] | [2.2, 2.2, 4.2] |
| van | new: white minivan 5.2 x 2.0 x 1.78 (sliding doors, dark glass, RENTAL barcode stickers on the rear side windows and the rear window, plate frame RENT-A-CAR), lights | [-3.4, 0.9, 5.4] | [5.2, 1.78, 2] |

### road
- Origin in the shared world: [400, 0, 0]. Axes: the highway from x -200 along +x, bending north (+z) after x -40; fields, two lakes, cell towers.
- Light: night; sun az/el [-20, 26]. Open camera sides: all.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| road | new: two-lane asphalt ribbon 7 m wide along the route (dashed centre line, white edges) | [0, 0, 0] | [350, 0, 7] |
| stop | new: octagonal STOP sign on a post | [-44.2, 1.9, 4.8] | [0.75, 0.75, 0.04] |
| speedcam | new: roadside speed camera: grey post 2.5 m, camera box with a flash lens toward the oncoming lane | [-52.5, 1.25, 5.2] | [0.3, 2.5, 0.3] |
| towers | new: five lattice cell towers 24 m (tapered frame, antenna panels, a top lamp that lights on the ping) | [-19.84, 12, 16.36] | [2, 24, 2] |
| trail | new: the GPS memory: a gold emissive ribbon 1.2 m wide drawn on the right lane behind the van | [0, 0.04, 0] | [1.2, 0, 1] |

### rent
- Origin in the shared world: [800, 0, 0]. Axes: the counter across x, the clerk behind it (z -1.15), customers on the +z side; the archive drawers on the -x wall.
- Light: day; sun az/el [-40, 45]. Open camera sides: +z.
- Marks [x, z]: clerk [-1.2, -1.15]; A [-1.05, -0.12].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| counter | new: rental counter 1.2 x 0.6, top y 1.05; a monitor, a key tray; CAR RENTAL letters and a key board on the back wall; the queue lines up along its right end toward the back | [-1.2, 0.52, -0.65] | [1.2, 1.05, 0.6] |
| paper | new: RENTAL AGREEMENT (1.5x A4 so it reads): VEHICLE WHITE MINIVAN, a signature line, the APPROVED stamp | [-1.15, 1.052, -0.7] | [0.32, 0.002, 0.45] |
| archive | new: wall of 32 grey archive drawers (8 x 4) labelled by year 1999..2026; the 2026 drawer slides out | [-3.15, 1.2, 0] | [0.1, 2.2, 4] |

### pol
- Origin in the shared world: [1200, 0, 0]. Axes: the evidence board on the back wall z -2.44; the booking desk in the front (z 0.5..1.0) facing +z.
- Light: day; sun az/el [-30, 45]. Open camera sides: +z.
- Marks [x, z]: det [-0.44, -2.16]; sarge [0, 0.28].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| board | new: cork board 2.55 x 1.2 m with five evidence slots and a portrait map of the WI/IL line (Twin Lakes, Justice, the gold route); red string | [0.33, 1.55, -2.46] | [2.55, 1.2, 0.03] |
| desk | new: booking counter 1.7 x 0.5, top 1.02; five charge folders with mugshots (generic faces), stamps CHARGED / ARRESTED / WANTED | [0, 0.51, 0.75] | [1.7, 1.02, 0.5] |

### jus
- Origin in the shared world: [1600, 0, 0]. Axes: the street along x at z 6..13; the ranch house and garage face +z; the van in the driveway.
- Light: golden; sun az/el [-50, 14]. Open camera sides: +z.
- Marks [x, z]: hider [-5, -0.4]; seeker [-7.15, 3.35].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| house | new: ranch house x -8..2 with a gable roof, front door, windows; attached two-car garage x 2..6.6 with a sectional door that rolls up (loot on shelves inside) | [-1, 1.4, -5] | [14.6, 2.8, 8] |
| van | reuse the white minivan, parked nose-in on the driveway | [3.3, 0.9, 2.3] | [2, 1.78, 5.2] |
| jsign | new: wooden welcome sign VILLAGE OF JUSTICE (scales of justice carved) on two posts | [-11, 1.3, 5.2] | [1.7, 1, 0.08] |
| cars | new: two police cruisers (white/navy, red-blue lightbar, emissive and flashing) | [-2, 0.7, 9] | [4.6, 1.5, 1.9] |
| hedge | new: box hedge 2.6 x 0.8 x 1.0 in front of the house; a maple on the lawn | [-5.1, 0.5, 0.4] | [2.6, 1, 0.8] |

## Cast

- **A:** dark slate knit balaclava (eye holes), black hoodie. Items: sledgehammer, duffel, buffet plate, pen. Views: front, side walking, driver.
- **B:** balaclava, green jacket. Items: bolt cutters, duffel. Views: front.
- **C:** balaclava, maroon hoodie. Items: claw hammer, duffel, empty buffet plate. Views: front, side walking.
- **D:** balaclava, grey jacket. Items: crowbar, cash. Views: front, side walking.
- **clerk:** yellow polo with RENTAL on the chest, dark hair. Items: rubber stamp, licence, folder. Views: front.
- **det:** brown jacket, tie, grey hair. Items: evidence sheets. Views: front.
- **sarge:** navy police uniform, badge, cap. Items: folder, rubber stamp. Views: front.
- **cop:** navy uniform, cap, badge. Items: slab (S20). Views: front, side.
- **rooster:** white rooster, red comb. Items: none. Views: side.

## Scenes

### S01 ★ · 0:00.0-0:04.0 · f0-f120 · "Hai giờ sáng, bốn người đeo mặt nạ đập vỡ cửa kính một tiệm thẻ Pokémon,"
- Gloss: Two in the morning, four masked men smash the glass door of a Pokémon card shop,
- Spine link: 1. Viewer must get: From inside the dark shop: a sledgehammer through the glass door, four masks outside.
- In: open on the act. Out: glide.
- Set: shop. Light: night.
- Build: new: the shop interior at night (case LEDs on), the glass door with its pane; outside the sidewalk under a sodium lamp.
- Blocking: A on the sidewalk 1 m from the door (hook A), B, C, D behind him (hook marks), all front view; after the smash they step in to the inside marks.
  - A at [0.05, 0.95], front; hook: A wind-up f40-56, strike f60; all step in f68-112; effort -> grin.
  - B at [-1, 1.7], front; hook: A wind-up f40-56, strike f60; all step in f68-112; effort -> grin.
  - C at [0.95, 1.8], front; hook: A wind-up f40-56, strike f60; all step in f68-112; effort -> grin.
  - D at [1.8, 2.6], front; hook: A wind-up f40-56, strike f60; all step in f68-112; effort -> grin.
- Action, against the words: f0-40 A plants his feet, the sledgehammer hanging; f40-50 wind-up over his right shoulder, held f50-56; f60 contact on the glass (2 f before 'đập' f62): the pane bursts into ~40 rigid-body shards flying in toward the lens; f60-110 shards fall, skid and settle on the tile floor (they stay for the whole reel); f68-112 A, then B, C, D step through the empty frame into the shop; the camera pulls back and up into the aisle, the lit cases come into the foreground on 'tiệm thẻ Pokémon'.
- Acting: A: effort squint on the wind-up, a grin after; the others crouch-ready.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [0.15, 1.15, -2.3] | [0.08, 1.35, 0.8] | 50 | 0.25 | 6 | through the glass door at the four masks |
| 72 | glide 40 f | [-0.9, 2.6, -7] | [-1.2, 1, -1.5] | 50 | 0.15 | 4 | pull back into the shop as they come in |

- Kicks (7 f): f60 strength 1.
- Physics & FX: door shards: ~40 thin glass plates (2-12 cm, 2.5 kg/m2) released at f60 from the pane, velocity 1.5-3.5 m/s inward (-z) + spread, cannon-es 240 Hz against the floor; restitution 0.2, friction 0.6; they come to rest by f100.
- Light & mood: night blue; a warm sodium lamp outside, the case LEDs inside.
- Sound: silence and a hum; a swish f52; a huge glass crash f60 (the score hits); shard tinkles f66-100; footsteps on glass f70-110.
- After-state: The door frame is empty; shards lie on the floor inside (S04, S05, S23).

### S02 · 0:04.0-0:06.8 · f120-f205 · "mang theo kìm cộng lực, và một chiếc xe đi thuê."
- Gloss: carrying bolt cutters, and a rented car.
- Spine link: 1. Viewer must get: Bolt cutters snap in B's hands; outside, a white minivan idles at the curb.
- In: glide. Out: glide.
- Set: shop. Light: night.
- Build: reuse the shop; the van parked at the curb, hazard lights.
- Blocking: B at his inside mark facing +z with the bolt cutters; A, C, D spread to the cases (inside marks).
  - B at [-1, -1.5], front; bolt cutters up f132, snap f150; grin.
- Action, against the words: f132-146 B lifts the bolt cutters to chest height and opens the handles, f150 he snaps them shut (jaws clack on 'kìm' f144-158); f160-200 the camera travels out through the empty door frame to the street: the white minivan idles at the curb, exhaust puffs, the RENTAL barcode sticker on its rear side window; f185 and f195 the hazard lights blink on 'xe đi thuê'.
- Acting: B: a menacing grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 120 | open | [-0.1, 1.45, -3.6] | [-1, 1.35, -1.5] | 38 | 0.2 | 10 | B and the bolt cutters |
| 150 | glide 54 f | [1.9, 1.5, 9.6] | [-3.2, 1.05, 5.4] | 40 | 0.3 | 6 | out the door to the van |

- Kicks (7 f): f150 strength 0.4.
- Physics & FX: the cutter jaws: 3 f close, a 1 f rebound.
- Light & mood: night; the van's lights.
- Sound: a metallic clack f150; engine idle and a hazard tick f185, f195.
- After-state: The van idles at the curb.

### S03 · 0:06.8-0:11.5 · f205-f345 · "Tiệm Goldenrod City Collectibles, thị trấn Twin Lakes, bang Wisconsin."
- Gloss: Goldenrod City Collectibles, in the village of Twin Lakes, Wisconsin.
- Spine link: 2. Viewer must get: The lit sign GOLDENROD CITY COLLECTIBLES and the TWIN LAKES road sign; the sleepy main street.
- In: glide. Out: glide (travel back in through the right shop window).
- Set: shop. Light: night.
- Build: reuse: the storefront, the sign band, the TWIN LAKES sign, lamps, neighbours.
- Blocking: Nobody outside (the four are inside, seen as shadows in the window).
- Action, against the words: f205-250 the camera rises from the van up the storefront to the sign as it is named (f224-275); f290-345 it keeps rising over the street, the TWIN LAKES sign in frame on 'Twin Lakes' (f293); title TWIN LAKES, WISCONSIN.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 205 | open | [1.3, 2.4, 13.6] | [0.6, 2.6, 0] | 56 | 0.15 | 3 | the sign |
| 282 | glide 56 f | [1, 7.5, 16.5] | [0.6, 2, 0] | 50 | 0.1 | 2 | up over the street |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: night; the sign glows warm gold.
- Sound: a night breeze, a far dog; the sign's neon buzz.
- After-state: Unchanged.

### S04 ★ · 0:11.5-0:13.3 · f345-f398 · "Bốn tủ kính vỡ tan."
- Gloss: Four glass cases shattered.
- Spine link: 2. Viewer must get: Four tools, four case tops, one per word.
- In: glide (through the right shop window). Out: hold.
- Set: shop. Light: night.
- Build: reuse the four cases (glass tops intact until struck).
- Blocking: A, B, C, D at the four cases (thief_x, the case z), front view, tools raised.
  - A at [-2.95, -3.2], front; strike its case; effort -> grin.
  - B at [-2.95, -4.6], front; strike its case; effort -> grin.
  - C at [-2.95, -6], front; strike its case; effort -> grin.
  - D at [-2.95, -7.4], front; strike its case; effort -> grin.
- Action, against the words: wind-ups 6 f before each strike; strikes f350 (A, 'Bốn' f352), f363 (B, 'tủ' f365), f369 (C, 'kính' f371), f377 (D, 'vỡ' f379): each glass top bursts into ~14 rigid-body shards that fall onto the cards and the floor; the LED strips flicker once.
- Acting: each: effort, then a grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 345 | open | [-1.55, 2.9, -0.45] | [-3, 0.8, -5.3] | 52 | 0.2 | 4 | the row of four cases |

- Kicks (7 f): f350 strength 0.6; f363 strength 0.6; f369 strength 0.6; f377 strength 0.8.
- Physics & FX: case shards: 14 per case, 2-8 cm, from the top at the strike point, down and outward 0.5-2 m/s; collide with the case base and the floor; rest by +40 f.
- Light & mood: night; LED glare in the glass.
- Sound: four glass crashes f350, f363, f369, f377, each a tone higher.
- After-state: Four cases open, glass on the cards and the floor.

### S05 · 0:13.3-0:17.1 · f398-f512 · "Thẻ Pokémon, thẻ đã chấm điểm, đồ sưu tầm, tiền mặt,"
- Gloss: Pokémon cards, graded cards, collectibles, cash,
- Spine link: 2. Viewer must get: Each thing named goes into a bag: cards, slabs, sealed boxes, the till's cash.
- In: hold. Out: glide (out through the back door).
- Set: shop. Light: night.
- Build: reuse the cases (contents removed per word), the counter and register (the drawer slides out).
- Blocking: A, B, C at their cases with duffels in their left hands; D walks from case 4 to the till (f430-470).
  - D at [1.95, -4.4], front; walks to the till f430-470, yanks the drawer f493; grin.
- Action, against the words: f400-422 A scoops the raw cards of case 1 into his duffel ('Thẻ Pokémon' f398); f432-456 B lifts the slabs of case 2 into his ('thẻ đã chấm điểm'); f466-490 C takes the sealed boxes of case 3 ('đồ sưu tầm'); f480 the camera turns to the counter; f493 D pulls the register drawer (ka-ching, it slides out) and stuffs the cash ('tiền mặt' f493-504). Each bag bulges as it fills.
- Acting: busy, quick; D greedy.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 398 | open | [-1.5, 2.85, -0.6] | [-3, 0.82, -5.3] | 50 | 0.18 | 4 | the sweep down the row |
| 470 | glide 30 f | [-0.4, 2, -1.6] | [2.3, 1.05, -4.6] | 44 | 0.2 | 6 | D at the till |

- Kicks (7 f): f493 strength 0.4.
- Physics & FX: the drawer slides out 30 cm in 4 f with a bounce.
- Light & mood: night.
- Sound: card shuffles f405, slab clacks f440, box thumps f475, the ka-ching f493.
- After-state: The cases and the till are empty.

### S06 · 0:17.1-0:20.0 · f512-f600 · "xong còn tranh thủ vét luôn chiếc xe moóc sau tiệm,"
- Gloss: then they even cleaned out the trailer behind the shop,
- Spine link: 2. Viewer must get: Out back, bolt cutters snap the trailer's padlock; the doors swing open on stacked boxes.
- In: glide (through the back door). Out: hold.
- Set: shop. Light: night.
- Build: new: the back lot (gravel, a lamp over the back door), the cargo trailer with its padlock.
- Blocking: B at cutter_b facing the doors (front view), cutters on the shackle.
  - B at [-1.15, -9.95], front; cutters on the lock, squeeze f530-552, opens the doors f562; strain -> grin.
- Action, against the words: f530-548 B squeezes the handles; f552 ('vét' f552) the shackle snaps: the lock drops, bounces twice on the gravel and stays; f562-590 B swings both doors open (100 deg, heavy, a small bounce at the stop) on the boxes stacked inside.
- Acting: B: strain -> grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 512 | open | [0.9, 1.55, -8.9] | [-1.35, 1.2, -10.4] | 40 | 0.2 | 8 | the padlock |
| 556 | glide 18 f | [0.9, 1.5, -8.9] | [-1.4, 0.75, -10.4] | 40 | 0.15 | 8 | follow the lock down |

- Kicks (7 f): f552 strength 0.5.
- Physics & FX: padlock (0.35 kg) + shackle halves: cannon-es from f552, falling 1.35 m to the gravel, restitution 0.3; doors: hinged, eased 100 deg with a 3 deg bounce.
- Light & mood: night; the warm lamp over the back door.
- Sound: a squeal and a sharp SNAP f552; the lock thuds f566, f574; door hinges creak f562-590.
- After-state: The lock lies on the gravel; the trailer stands open.

### S07 · 0:20.0-0:22.5 · f600-f674 · "như khách buffet quay lại lấy đĩa thứ hai."
- Gloss: like a buffet guest going back for a second plate.
- Spine link: 2. Viewer must get: A carries boxes out on a big buffet plate; C heads back in holding up an empty one.
- In: hold. Out: dissolve 6 f (minutes later, the street).
- Set: shop. Light: night.
- Build: new: two big round white plates (60 cm); booster boxes piled on A's.
- Blocking: A walks from plateA[0] to plateA[1] carrying the full plate in both arms; C walks from plateC[0] (the back door) to plateC[1] holding the empty plate up.
  - A at [-1.5, -10.3], front; walks with the full plate; smile.
  - C at [1.2, -8.6], front; walks, plate up f643; grin.
- Action, against the words: f600-650 A crosses toward camera-right with four booster boxes piled on his plate; f612-660 C crosses the other way, lifts his empty plate up beside his face on 'đĩa thứ hai' (f643), a napkin tucked into his collar.
- Acting: A: satisfied; C: eager.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 600 | open | [1.6, 1.5, -8.6] | [-0.4, 1.2, -10.5] | 42 | 0.2 | 6 | the two plates cross |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: night.
- Sound: a cheesy lounge bossa sting f600-674; a plate 'ting' f643.
- After-state: The plates go on with them.

### S08 · 0:22.5-0:24.3 · f674-f728 · "Hơn ba trăm mười nghìn đô biến mất trước khi gà"
- Gloss: More than three hundred and ten thousand dollars vanished before the rooster
- Spine link: 3. Viewer must get: The loaded van pulls away from the broken shop: $310,000+.
- In: dissolve 6 f. Out: dissolve 8 f (dawn, same frame).
- Set: shop. Light: night.
- Build: reuse the street; the van (sits lower, loaded).
- Blocking: The four inside the van (not seen).
- Action, against the words: f680 the van pulls out: accelerates 5 m/s2 along +x, an exhaust puff at f680; by f728 it is leaving frame right; title $310,000+ f680-724.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 674 | open | [10.5, 1.3, 10.5] | [-0.8, 1.4, 3.6] | 46 | 0.15 | 3 | the van leaves the broken shop |

- Kicks (7 f): none.
- Physics & FX: van: kinematic, x = x0 + 2.5 t^2.
- Light & mood: night.
- Sound: engine rev f680, tyres; a ka-ching f682 (the total).
- After-state: The curb is empty.

### S09 · 0:24.3-0:25.4 · f728-f761 · "gáy."
- Gloss: crowed.
- Spine link: 3. Viewer must get: Dawn on the empty street; a rooster on the TWIN LAKES sign crows.
- In: dissolve 8 f. Out: dissolve 8 f (back to the night drive).
- Set: shop. Light: golden.
- Build: new: a rooster (side view card) perched on the town sign.
- Blocking: The rooster on the sign top, facing -x.
  - rooster at [2.9, 3.5], side; crows f738-752; -.
- Action, against the words: f738-752 the rooster stretches up, beak open, crowing on 'gáy' (f749); the camera pushes in.
- Acting: the rooster: chest out.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 728 | open | [10.5, 1.3, 10.5] | [2.2, 1.9, 3.3] | 46 | 0.4 | 4 | the rooster at dawn |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: dawn: gold low sun.
- Sound: a rooster crow f740 (meme 'Chicken' if it fits, else a synthesized crow).
- After-state: Morning.

### S10 · 0:25.4-0:30.0 · f761-f900 · "Kế hoạch hoàn hảo: mặt nạ kín mít, ra tay giữa đêm, không ai thấy mặt."
- Gloss: A perfect plan: masks on tight, strike at midnight, nobody sees a face.
- Spine link: 3. Viewer must get: Driving home in the dark, the masked driver taps his mask; a speed camera flashes and he waves.
- In: dissolve 8 f. Out: hold.
- Set: road. Light: night.
- Build: new: the highway (fields, utility poles, the speed camera on the far shoulder, the moon).
- Blocking: A drives (front card in the driver's seat, seen through the open driver window).
  - A at [-111.094, 1.01194], front; driving; taps the mask f797; waves f872; grin.
- Action, against the words: the van glides along the straight (d 88 -> 153, easing in and out) and the camera tracks beside the driver's window; f797 ('mặt nạ') A taps his mask; f848 ('giữa đêm') the moon rides over the roof; f870 the speed camera flashes white ('không ai thấy mặt' f865) and A waves at it, smug; f890-900 the van brakes to a stop at the stop sign.
- Acting: A: smug grin, a wink.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 761 | open | [-111.094, 1.5, -1.988] | [-111.094, 1.45, 0.412] | 44 | 0 | 6 | tracking beside the driver |
| 761 | glide 139 f | [-46.125, 1.5, -1.797] | [-46.125, 1.45, 0.603] | 44 | 0 | 6 | same offset at the stop |

- Kicks (7 f): f870 strength 0.3.
- Physics & FX: van: kinematic on the route (the same smootherstep as the camera).
- Light & mood: night; the moon, dashboard glow on the masks.
- Sound: road hum, a smug synth bass; a camera flash 'pzzt' + shutter f870.
- After-state: The van waits at the stop sign.

### S11 · 0:30.0-0:35.1 · f900-f1052 · "Chỉ có một vấn đề nhỏ. Họ đi bằng một chiếc Chrysler Pacifica màu trắng. Xe thuê."
- Gloss: There was just one small problem. They drove a white Chrysler Pacifica. A rental.
- Spine link: 4. Viewer must get: The white minivan at the stop sign, seen whole; the RENTAL sticker on its rear window.
- In: hold. Out: dissolve 8 f (back to the rental counter).
- Set: road. Light: night.
- Build: reuse the van (brake lights on), the stop sign.
- Blocking: A at the wheel (hidden from the rear).
- Action, against the words: f900-934 stillness, brake lights glowing ('Chỉ có một vấn đề nhỏ'); f936-990 the camera swings round the van to its rear three-quarter (title CHRYSLER PACIFICA f952-1008, 'màu trắng' f1007); f1016-1050 push into the rear window: a RENTAL barcode sticker and the RENT-A-CAR plate frame on 'Xe thuê' (f1024).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 900 | open | [-46.125, 1.5, -1.797] | [-46.125, 1.45, 0.603] | 44 | 0.1 | 6 | the stop |
| 936 | glide 50 f | [-55.025, 1.7, -3.697] | [-47.625, 1, 1.603] | 50 | 0.15 | 4 | the whole van |
| 1016 | glide 26 f | [-51.625, 1.45, 0.853] | [-49.645, 1.32, 1.603] | 30 | 0.4 | 10 | the RENTAL sticker |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: night; red brake light on the asphalt.
- Sound: engine idle; a soft 'dun' f1007; a barcode beep f1026.
- After-state: Unchanged.

### S12 · 0:35.1-0:36.8 · f1052-f1105 · "Có hồ sơ thuê hẳn hoi."
- Gloss: With a proper rental record.
- Spine link: 4. Viewer must get: The rental agreement signed and stamped APPROVED.
- In: dissolve 8 f. Out: cut.
- Set: rent. Light: day.
- Build: new: the rental office; the RENTAL AGREEMENT on the counter (VEHICLE: WHITE MINIVAN).
- Blocking: A at the counter (out of frame but his arm and pen in), the clerk behind with the stamp.
  - A at [-1.05, -0.12], front; signs f1060-1084; neutral.
  - clerk at [-1.2, -1.15], front; stamps f1088; neutral.
- Action, against the words: f1060-1084 A's pen writes the signature on the line; f1084-1090 the clerk's stamp comes down and lands APPROVED on 'hẳn hoi' (f1088); the paper jumps 2 mm.
- Acting: —
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1052 | open | [-0.55, 1.78, -0.38] | [-1.14, 1.05, -0.72] | 40 | 0.25 | 10 | the contract |

- Kicks (7 f): f1088 strength 0.5.
- Physics & FX: the stamp: 4 f down, 2 f squash.
- Light & mood: office day light.
- Sound: pen scratch f1060-1084; a stamp THUNK f1088.
- After-state: The signed, stamped agreement.

### S13 · 0:36.8-0:40.2 · f1105-f1206 · "Khoan đã, đi ăn trộm mà thuê xe có giấy tờ đàng hoàng?"
- Gloss: Wait, going to rob a shop in a rented car with proper paperwork?
- Spine link: 4. Viewer must get: The customer is a man in a balaclava, with three masked friends queueing; the clerk checks his licence.
- In: cut. Out: dissolve 8 f (back to the night road).
- Set: rent. Light: day.
- Build: reuse the office; the queue of three masked men behind A.
- Blocking: Clerk behind the counter; A at the counter; B, C, D queue to the right.
  - clerk at [-1.2, -1.15], front; licence up f1150; neutral -> suspicious.
  - A at [-1.05, -0.12], front; standing; smile.
- Action, against the words: f1105 cut on 'Khoan đã': the clerk blinks at A; f1150-1170 he raises A's driver's licence beside his own face, eyes go from the licence to the mask and back (f1176, f1190); the queue shuffles one step on 'đàng hoàng' (f1187).
- Acting: Clerk: deadpan -> suspicious; A: a polite smile under the mask.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1105 | open | [-2.7, 1.55, 2.4] | [-0.65, 1.25, -1] | 44 | 0.08 | 6 | the masked customer and the queue |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: flat office light.
- Sound: a record scratch + Huh (meme) f1105; a printer whirr; a slow 'hmm' f1176.
- After-state: —

### S14 ★ · 0:40.2-0:48.8 · f1206-f1463 · "Bạn thấy đấy, mặt nạ che được khuôn mặt, nhưng chiếc xe thuê nhớ từng con đường nó đi qua, còn chiếc điện thoại trong túi nhớ từng cột sóng nó chạm vào."
- Gloss: You see, a mask hides a face, but a rental car remembers every road it took, and the phone in your pocket remembers every tower it touched.
- Spine link: 5. Viewer must get: The masked face, then from above: the route lights up gold behind the van, and towers ping as the phone passes.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: road. Light: night.
- Build: reuse the highway; new: the gold trail ribbon, the cell towers with top lamps and ping rings, the phone pulse on the van.
- Blocking: A at the wheel.
  - A at [-47.0254, 1.60311], front; driving; neutral.
- Action, against the words: f1206-1262 the van waits at the stop sign, the masked driver in the window ('mặt nạ che được khuôn mặt' f1239-1271); f1262 it pulls away (1.5 m/s2 up to 22 m/s); f1272-1372 the camera cranes up to an aerial; f1318-1350 'nhớ từng con đường' a gold trail floods along the road it came by, up to the van, and keeps drawing behind it; f1407, f1417, f1427, f1438, f1447 the van passes a tower: a blue ring pulses off the van (the phone) and the tower's top lamp lights and stays lit.
- Acting: A: calm at the wheel.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1206 | open | [-46.125, 1.5, -1.797] | [-46.125, 1.45, 0.603] | 44 | 0.15 | 6 | the mask |
| 1272 | glide 100 f | [-64, 86, -15] | [-22, 0, 12] | 54 | 0 | 0 | crane up: the trail and the towers |

- Kicks (7 f): none.
- Physics & FX: van: kinematic along the route (d = 153 + 1.5 t^2).
- Light & mood: night; the gold trail and blue pings glow.
- Sound: a warm 'you see' pad; a rising shimmer as the trail floods f1318; a sonar 'blip' per tower f1407-1447.
- After-state: Five towers lit, the gold trail along the road.

### S15 · 0:48.8-0:52.4 · f1463-f1573 · "Đeo mặt nạ mà mang điện thoại, khác gì chơi trốn tìm mà cầm loa."
- Gloss: Wearing a mask but carrying a phone is like playing hide-and-seek holding a megaphone.
- Spine link: 5. Viewer must get: A masked man hides behind a hedge holding a megaphone; it rings, and the seeker at the tree turns round.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: jus. Light: night.
- Build: new: the front yard in Justice at night (hedge, maple, porch light).
- Blocking: Seeker (cop) at the tree facing it (side view), counting; A crouched behind the hedge, megaphone at his mouth.
  - A at [-5, -0.4], front; crouched, megaphone; nervous -> shock.
  - cop at [-7.15, 3.35], side -> front; counting, turns f1556; neutral.
- Action, against the words: f1463-1530 the seeker counts, face to the trunk; f1529 ('trốn tìm') A ducks lower; f1550 ('cầm loa') the megaphone rings: rings of sound burst out, leaves on the hedge shiver; f1556 the seeker turns to front view and stares straight at the hedge.
- Acting: A: wide eyes; seeker: deadpan.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1463 | open | [-4, 1.55, 10.8] | [-6.3, 1, 1.4] | 44 | 0.08 | 6 | hedge and tree |

- Kicks (7 f): f1550 strength 0.5.
- Physics & FX: hedge leaves: a 2 cm shiver 12 f.
- Light & mood: night; the porch light warm.
- Sound: crickets; counting murmur; Yo Phone Ringing (meme) blasted f1550.
- After-state: Caught.

### S16 · 0:52.4-0:57.9 · f1573-f1736 · "Cảnh sát gom camera, hồ sơ thuê xe, dữ liệu định vị, lịch sử điện thoại, cả dấu vân tay,"
- Gloss: Police gathered the cameras, the rental record, location data, phone history, even fingerprints,
- Spine link: 6. Viewer must get: The detective pins five pieces of evidence, one per word.
- In: dissolve 8 f. Out: glide.
- Set: pol. Light: day.
- Build: new: the squad room; the cork board with five slots and the map; a stack of evidence sheets in his left arm.
- Blocking: Detective in front of the board (det_z), side-stepping to each slot.
  - det at [-0.42, -2.16], front; pins cctv; stern.
  - det at [0.05, -2.16], front; pins rental; stern.
  - det at [0.52, -2.16], front; pins gps; stern.
  - det at [-0.42, -2.16], front; pins phone; stern.
  - det at [0.05, -2.16], front; pins prints; stern.
- Action, against the words: he pins: f1600 the CCTV still (four masks at the glass door), f1622 the rental agreement (APPROVED), f1656 the GPS printout (the gold route), f1685 the phone record (tower list), f1720 the fingerprint card; a red string links each to the last.
- Acting: Detective: focused, a small nod per pin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1573 | open | [0.36, 1.5, 2.8] | [0.36, 1.58, -2.44] | 50 | 0.06 | 6 | the board |

- Kicks (7 f): none.
- Physics & FX: each sheet: 6 f from his chest to the slot, a 1 cm flutter on the pin.
- Light & mood: office day, a desk lamp.
- Sound: a pin 'tock' per item f1600-1720; a typewriter-ish tick bed.
- After-state: Five items on the board linked by string.

### S17 · 0:57.9-1:00.0 · f1736-f1800 · "rồi lần thẳng đến một ngôi nhà ở thị trấn"
- Gloss: and traced it straight to a house in the village of
- Spine link: 6. Viewer must get: The red string runs from the evidence to a pin on the map: Justice.
- In: glide. Out: through-object 8 f (push into the map pin, dissolve to the house).
- Set: pol. Light: day.
- Build: reuse the board; the string from the prints to the Justice pin.
- Blocking: Detective steps aside right of the board.
  - det at [1.25, -2.16], front; pins Justice f1764; smile.
- Action, against the words: f1740-1766 the detective draws the red string taut from the prints card to the map and pushes the red pin into JUSTICE on 'lần thẳng' (f1747-1764); f1772-1800 the camera pushes into the pin.
- Acting: Detective: a satisfied tap.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1736 | open | [0.75, 1.5, 0.5] | [0.85, 1.4, -2.44] | 44 | 0.2 | 8 | string to the map |
| 1772 | glide 28 f | [1.13, 1.2, -1.6] | [1.13, 1.17, -2.44] | 30 | 0.4 | 10 | into the pin |

- Kicks (7 f): f1764 strength 0.3.
- Physics & FX: the string pulls straight.
- Light & mood: day.
- Sound: string twang f1764; a whoosh into the pin f1790.
- After-state: Justice pinned.

### S18 · 1:00.0-1:01.9 · f1800-f1857 · "Justice, bang Illinois."
- Gloss: Justice, Illinois.
- Spine link: 6. Viewer must get: Dawn: two police cruisers roll up to a ranch house; the white minivan sits in its driveway.
- In: through-object 8 f. Out: cut.
- Set: jus. Light: golden.
- Build: reuse: the house, garage, driveway with the van; new: two cruisers with flashing lightbars.
- Blocking: Cop1 and cop2 in the cars (not seen).
- Action, against the words: f1800-1840 the cruisers roll in from +x and stop at their marks (ease out), lightbars flashing red/blue; title JUSTICE, ILLINOIS f1808-1852.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1800 | open | [11, 2.6, 16] | [3, 1.2, 1] | 50 | 0.15 | 3 | house, van, police |

- Kicks (7 f): none.
- Physics & FX: cars: kinematic, ease-out stops.
- Light & mood: dawn gold; red-blue flashes.
- Sound: sirens wind down, tyres f1835; birds.
- After-state: Cruisers parked out front.

### S19 · 1:01.9-1:04.0 · f1857-f1921 · "Vâng, thị trấn tên là Công Lý."
- Gloss: Yes, the town is literally called Justice.
- Spine link: 6. Viewer must get: The wooden VILLAGE OF JUSTICE sign, police lights glowing behind.
- In: cut. Out: glide.
- Set: jus. Light: golden.
- Build: reuse the welcome sign.
- Blocking: nobody.
- Action, against the words: f1857-1921 a slow push onto the sign; on 'Công Lý' (f1899) a bright 'ding' and the sign's carved scales catch the light.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1857 | open | [-14.4, 1.45, 11.2] | [-11, 1.4, 5.2] | 38 | 0.3 | 8 | the sign |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: dawn gold.
- Sound: a bright bell 'ding' f1899.
- After-state: —

### S20 · 1:04.0-1:07.2 · f1921-f2016 · "Bên trong là hàng Pokémon của chính tiệm Goldenrod."
- Gloss: Inside was Pokémon stock from Goldenrod itself.
- Spine link: 6. Viewer must get: The garage door rolls up on shelves of slabs and boxes; an officer lifts a slab with a GOLDENROD price sticker.
- In: glide. Out: dissolve 8 f.
- Set: jus. Light: golden.
- Build: reuse the garage; loot on shelves (slabs, booster boxes, the duffels); new: a slab with the GOLDENROD CITY COLLECTIBLES price sticker.
- Blocking: Cop1 walks from cop1[0] to cop1[1] inside the garage, lifts a slab from the box.
  - cop at [5.2, -1.9], front; walks in f1940-1970, lifts the slab f1972; stern -> smile.
- Action, against the words: f1925-1958 the door rolls up into the ceiling; f1940-1970 cop1 walks in; f1972-1984 he lifts a slab from the box; f1984-2016 the slab at his chest, the sticker GOLDENROD CITY COLLECTIBLES reads on 'Goldenrod' (f1991).
- Acting: cop1: grim -> a small told-you-so smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1921 | open | [8.4, 1.7, 5.2] | [5, 1.15, -2.3] | 42 | 0.15 | 6 | the garage opens |
| 1974 | glide 18 f | [5.5, 1.42, 0.1] | [5.25, 1.3, -1.72] | 30 | 0.3 | 12 | the sticker |

- Kicks (7 f): none.
- Physics & FX: door: segments roll up and back along the ceiling.
- Light & mood: dawn outside, a bare bulb inside.
- Sound: garage motor rattle f1925-1958; a 'ding' f1991.
- After-state: The slab in his hands.

### S21 · 1:07.2-1:12.0 · f2016-f2159 · "Năm người đàn ông bị buộc tội. Hai người đã bị bắt. Ba người vẫn đang bị truy nã, và lần này"
- Gloss: Five men were charged. Two have been arrested. Three are still wanted, and this time
- Spine link: 7. Viewer must get: Five charge folders slam down; two get ARRESTED, three get WANTED.
- In: dissolve 8 f. Out: cut.
- Set: pol. Light: day.
- Build: reuse the squad room; the booking counter with five folders (mugshots of generic faces, a red CHARGED band).
- Blocking: Sergeant behind the counter (sarge mark), side-stepping.
  - sarge at [0, 0.28], front; slams f2053, stamps f2086-2140; stern.
- Action, against the words: f2020-2053 he slaps the last of five CHARGED folders onto the row on 'buộc tội' (f2053); f2086, f2092 two ARRESTED stamps (folders 1-2) on 'bị bắt'; f2128, f2134, f2140 three WANTED stamps (folders 3-5) on 'truy nã'.
- Acting: Sergeant: brisk, stern.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2016 | open | [0, 2.4, 3.2] | [0, 1.08, 0.72] | 44 | 0.06 | 6 | the five folders |

- Kicks (7 f): f2053 strength 0.5; f2086 strength 0.3; f2092 strength 0.3; f2128 strength 0.3; f2134 strength 0.3; f2140 strength 0.3.
- Physics & FX: each folder: lands flat, slides 1 cm; stamps: 3 f down.
- Light & mood: office day.
- Sound: a folder slap f2053; stamp thunks f2086, f2092 (deep), f2128-2140 (higher).
- After-state: 2 ARRESTED, 3 WANTED.

### S22 · 1:12.0-1:13.7 · f2159-f2210 · "chắc họ sẽ đi bộ."
- Gloss: they'll probably go on foot.
- Spine link: 7. Viewer must get: Three of them trudge along the highway shoulder at dawn.
- In: cut. Out: dissolve 8 f.
- Set: road. Light: golden.
- Build: reuse the highway at dawn (no van).
- Blocking: B, C, D walk in a line along the shoulder (walk marks) heading +x, side view.
  - B at [-66.5, 4.9], side walking +x; trudge; sad.
  - C at [-65.3, 4.9], side walking +x; trudge; sad.
  - D at [-64.1, 4.9], side walking +x; trudge; sad.
- Action, against the words: f2159-2210 they trudge 2.4 m, heads down, duffels on their backs; a truck's horn far away.
- Acting: glum.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2159 | open | [-63.6, 1.4, 11.2] | [-64.3, 1.05, 4.9] | 44 | 0.2 | 4 | on foot |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: dawn gold.
- Sound: footsteps on gravel; Sad Violin (meme, short) f2165.
- After-state: —

### S23 · 1:13.7-1:15.3 · f2210-f2258 · "Đập kính chỉ mất vài giây."
- Gloss: Smashing glass takes a few seconds.
- Spine link: 7. Viewer must get: Next morning: the empty door frame and the shards still on the floor.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: shop. Light: day.
- Build: reuse the storefront in daylight; the door shards where they settled in S01.
- Blocking: nobody.
- Action, against the words: f2210-2258 a low push through the empty door frame onto the shards.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2210 | open | [0.35, 0.75, 2.7] | [0, 0.45, -1.2] | 44 | 0.4 | 8 | the shards stay |

- Kicks (7 f): none.
- Physics & FX: none (the S01 bake's final resting poses).
- Light & mood: morning day.
- Sound: a single glass tinkle f2230; street birds.
- After-state: —

### S24 · 1:15.3-1:19.0 · f2258-f2370 · "Còn hồ sơ thuê xe thì lưu lại rất lâu."
- Gloss: But a rental record stays on file for a very long time.
- Spine link: 7. Viewer must get: The clerk files the agreement in the 2026 drawer of a wall of years.
- In: dissolve 8 f. Out: end.
- Set: rent. Light: day.
- Build: reuse the archive wall (drawers 1999..2026).
- Blocking: Clerk at clerk_arch facing the wall (front view).
  - clerk at [-2.45, -0.25], front; files the folder, shuts the drawer f2300; smile.
- Action, against the words: f2262-2290 the clerk slides the agreement folder into the open 2026 drawer; f2300 he shuts it (thunk, 'lưu' f2304); f2306-2370 the camera pulls back over the whole wall of years.
- Acting: Clerk: tidy, satisfied.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2258 | open | [-2, 1.55, 1.15] | [-3.15, 1.4, -0.25] | 34 | 0.2 | 10 | the 2026 drawer |
| 2306 | glide 56 f | [1.6, 1.7, 2.9] | [-3.2, 1.25, -0.1] | 46 | 0.1 | 4 | the wall of years |

- Kicks (7 f): f2300 strength 0.3.
- Physics & FX: the drawer: slides shut, stops hard.
- Light & mood: office day.
- Sound: a drawer roll and a THUNK f2300; the theme's last chord.
- After-state: End.

