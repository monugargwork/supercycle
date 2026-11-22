# Jirachi (Avery the Poke Kid): direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/avery-jirachi-scalpers/plan.json` (0 errors; the S14 glide from the screen to the seller is a fast move by design, the box sits on the caption band for a moment in S07).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2250 frames (VO ends f2221). Four separate interiors (seller's room, hospital room, family room, studio), each with a ceiling; places change by dissolve (time jumps), never by travel.

## Tone
A child died. No jokes, no meme sounds. The light carries the feeling: the hospital room greys after his death, the family room dims as the curtains close, the ending is golden. Screens are only seen from their owner's side (the seller's monitor over his shoulder, mum's phone from her eyes).

## Transitions
One hard cut (into S09, "Khoan đã"). Dissolves for every change of place/time: S01→S02 through the listing title, S04→S05 (death), S15→S16 the painting matched to the listing photo, S16→S17 the flashback.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f92 | f150 | $20,000 |
| f236 | f300 | AVERY GARCIA · 12 |
| f330 | f376 | AVERY THE POKE KID |
| f668 | f740 | 18 · 09 · 2026 |
| f886 | f926 | 90% |
| f982 | f1030 | 10% |
| f1940 | f2000 | AKIRA EGAWA |

## Sets

### room
- Origin in the shared world: [0, 0, 0]. Axes: the desk against the back wall z -2.4 faces +z; the seller sits in front of it facing +z (the room).
- Light: golden; sun az/el [40, 35]. Open camera sides: +z.
- Marks [x, z]: seller [-0.15, -1.45].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: bedroom shell x -2.4..2.4, z -2.4..2.4, 2.6 m, grey-blue walls, wood floor, ceiling (no shadows), window with blinds in the -x wall | [0, 1.3, 0] | [4.8, 2.6, 4.8] |
| desk | new: black desk top y 0.76 on two leg panels, x -1.0..1.2, z -2.35..-1.6 | [0.1, 0.38, -1.975] | [2.2, 0.76, 0.75] |
| stand | new: small black photo easel (two legs, ledge) holding the Jirachi in a clear top loader (7.6 x 10.2 cm, card 6.3 x 8.8) | [-0.55, 0.76, -1.8] | [0.1, 0.12, 0.06] |
| ring | new: ring light (white torus r 0.15, emissive) on a thin stand, aimed at the card | [-0.25, 1.06, -2.15] | [0.3, 0.3, 0.03] |
| monitor | new: monitor 64 x 38 cm screen (canvas: the listing page), black bezel, stand on the desk, turned 13 deg toward the seller | [0.35, 1.08, -2.2] | [0.68, 0.42, 0.04] |
| keyboard | new: keyboard 42 x 14 cm, mouse | [0.35, 0.77, -1.92] | [0.42, 0.02, 0.14] |
| bundles | new: 10 stacks of 2 cash bundles (each 16 x 7 x 2.2 cm, green notes, paper band) = 20 x $1,000 | [0.34, 0.8, -1.715] | [0.84, 0.045, 0.17] |
| donation_box | new: open cardboard donation box 26 x 20 x 18 cm, printed label KIDS CANCER FUND | [1, 0.76, -1.78] | [0.26, 0.2, 0.18] |
| shelves | new: wall shelves (x 1.6..2.3) of sealed booster boxes and top loaders: the seller's stock | [1.95, 1.4, -2.2] | [0.7, 1.6, 0.35] |

### ward
- Origin in the shared world: [40, 0, 0]. Axes: the bed along the back wall z -2.4; Avery sits on its front edge facing +z; his phone on a tripod on a stool in front of him.
- Light: day; sun az/el [-50, 30]. Open camera sides: +z.
- Marks [x, z]: avery [0, -1.32].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: hospital room x -2.5..2.5, z -2.5..2.5, 2.7 m, pale green walls with a handrail, speckled vinyl floor, ceiling with light panels, window in the +x wall | [0, 1.35, 0] | [5, 2.7, 5] |
| bed | new: hospital bed x -1.0..1.0, z -2.4..-1.45: steel frame, white mattress top y 0.55, blue blanket, pillow at -x, head rail | [0, 0.3, -1.925] | [2, 0.6, 0.95] |
| stool | new: round stool top y 0.62 holding a mini tripod and Avery's phone (back to us, screen and camera toward him) | [0.35, 0.31, -0.45] | [0.3, 0.62, 0.3] |
| iv | new: IV pole 1.9 m, five-foot base, a fluid bag | [-1.3, 0.95, -1.7] | [0.4, 1.9, 0.4] |
| cabinet | new: bedside cabinet 45 x 60 x 40 cm: a stack of packs, a binder, later the Jirachi in its top loader | [1.35, 0.31, -2.1] | [0.45, 0.62, 0.4] |
| calendar | new: wall calendar 30 x 42 cm, flips THANG 4 -> 6 -> 8, then 18 / THANG 9 | [1.15, 1.55, -2.47] | [0.3, 0.42, 0.01] |
| bin | new: white waste bin r 13 cm, 30 cm: torn wrappers fill it | [0.62, 0.15, -1.05] | [0.26, 0.3, 0.26] |

### home
- Origin in the shared world: [80, 0, 0]. Axes: the table in the middle; the parents sit behind it facing +z; window on the back wall behind the father.
- Light: golden; sun az/el [30, 25]. Open camera sides: +z.
- Marks [x, z]: mum [-0.35, -1.62]; dad [0.35, -1.66]; dad_win [0.35, -2.05].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: kitchen-dining room x -2.5..2.5, z -2.5..2.5, 2.6 m, warm cream walls, wood floor, ceiling, window (1.0 x 1.1 m) with two curtains that slide shut | [0, 1.3, 0] | [5, 2.6, 5] |
| table | new: wooden table 130 x 80 cm, top y 0.75; four chairs; a memorial candle in a glass | [0, 0.375, -1] | [1.3, 0.75, 0.8] |
| chair_av | new: Avery's chair at the right end, his blue beanie folded on the seat | [0.95, 0.45, -1] | [0.42, 0.9, 0.42] |
| shelf | new: wall shelf 80 cm: framed photo of Avery grinning with a card (drawn), his red binder, his phone mini tripod | [-1.45, 1.22, -2.33] | [0.8, 0.3, 0.25] |
| phone | new: mum's phone 7.5 x 15.5 cm (canvas screen: a plain post), seen only from her side | [-0.35, 0.95, -1.3] | [0.075, 0.155, 0.01] |

### studio
- Origin in the shared world: [120, 0, 0]. Axes: the drawing table faces +z under the back-wall window; the artist stands at its left.
- Light: day; sun az/el [-30, 40]. Open camera sides: +z.
- Marks [x, z]: artist [-0.36, -1.18].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: studio x -2.5..2.5, z -2.5..2.5, 2.7 m, white walls, pale wood floor, ceiling, window with plants, pinboard of sketches | [0, 1.35, 0] | [5, 2.7, 5] |
| board | new: drawing table, the board tilted 32 deg, 70 x 50 cm; the painting on it is the REAL Jirachi art (scan, 32 x 45 cm); brush jar, palette | [0, 1.1, -1.5] | [0.7, 0.05, 0.5] |

## Cast

- **seller:** grey hoodie, black cap, dark trousers. Items: the top-loaded Jirachi. Views: front, seated.
- **avery:** kid build, light-blue hospital gown, blue beanie. Items: booster packs, the Jirachi. Views: front, seated on the bed edge.
- **mum:** maroon cardigan, dark hair. Items: phone. Views: front, seated.
- **dad:** green sweater, short dark hair, glasses. Items: none. Views: front, seated / standing.
- **artist:** white smock, black bob, round glasses. Items: brush, the painting. Views: front, standing.

## Scenes

### S01 ★ · 0:00.0-0:06.9 · f0-f206 · "Một người bán trên eBay rao một lá Jirachi giá hai mươi nghìn đô la, và gắn nó với tên một cậu bé vừa qua đời."
- Gloss: A seller on eBay lists a Jirachi for twenty thousand dollars, and ties it to the name of a boy who just died.
- Spine link: 1. Viewer must get: A seller puts a huge price on a card, and a dead boy's name on the listing.
- In: open on the act. Out: dissolve 8 f (push into the title line on the monitor, through-object dissolve into the hospital room).
- Set: room. Light: golden.
- Build: new: the seller's room, desk, photo easel, ring light, monitor with the listing page, keyboard, bundles, donation box.
- Blocking: Seller seated on a stool at his mark facing +z, the top-loaded Jirachi raised in his right hand (screen left) from f0.
  - seller at [-0.15, -1.45], front; seated, right arm slaps the card onto the easel f29; grin.
- Action, against the words: f0-24 hand up with the card (wind-up, held f20-28); f29 slap: the top loader lands on the easel ledge 1 f before 'rao' (f31); the ring light rocks 3 deg on its stand (damped, 20 f); two torn wrappers on the desk edge flutter off and settle on the floor by f60. f60-100 glide to the monitor; f91-113 the price field counts $0 -> $20,000 on 'hai mươi nghìn đô la'; f134-199 the title types JIRACHI SIR · AVERY THE POKE KID letter by letter, the name landing on 'tên một cậu bé' (f155-172).
- Acting: Seller smug grin on the slap; satisfied while typing (seen only through the screen).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [-1.35, 1.3, -0.15] | [-0.32, 1, -1.7] | 44 | 0.2 | 6 | the slap: card and seller |
| 60 | glide 40 f | [0.16, 1.18, -1.25] | [0.35, 1.07, -2.2] | 36 | 0.15 | 8 | to the listing as the price counts |
| 150 | glide 46 f | [0.28, 1.1, -1.72] | [0.33, 1.1, -2.18] | 30 | 0.4 | 8 | push on the name being typed |

- Kicks (7 f): f29 strength 0.8.
- Physics & FX: Slap: the top loader drops 3 cm onto the ledge in 2 f and stops dead. Ring light: rocks 3 deg, damped spring 20 f. Two wrappers (paper, 4 g): flutter down 0.76 m in about 28 f with side drift, rest flat on the floor and stay.
- Light & mood: golden: warm desk lamp evening, the monitor glow and the ring light are emissive.
- Sound: hand whoosh f24; plastic slap f29; wrapper rustle f30-55; price ticks f91-113; key clicks f134-199; a low piano note under the name f160.
- After-state: The card stays on the easel; the wrappers stay on the floor; the listing stays on the screen.

### S02 · 0:06.9-0:12.8 · f206-f384 · "Cậu bé đó là Avery Garcia, mười hai tuổi, cộng đồng gọi là Avery the Poke Kid."
- Gloss: That boy is Avery Garcia, twelve years old, the community calls him Avery the Poke Kid.
- Spine link: 2. Viewer must get: Meet Avery: a cheerful kid filming himself in a hospital room.
- In: dissolve 8 f. Out: glide.
- Set: ward. Light: day.
- Build: new: the hospital room (bed, IV pole, cabinet, stool with the phone on a tripod, calendar, bin, window).
- Blocking: Avery sits on the bed's front edge at his mark facing his phone (+z). A stack of three packs beside him on the blanket.
  - avery at [0, -1.32], front; seated on the bed edge; waves f212-240, holds up a pack f262-370; smile_closed -> grin.
- Action, against the words: f212-240 he waves to his phone camera (wave cycle, 2 waves); f250 he picks up a pack and shows it to the phone (held at chest, f262-370).
- Acting: Big open smile; a blink on each change.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 206 | open | [0.4, 1.12, 1.25] | [0.1, 0.95, -1.4] | 40 | 0.15 | 6 | the boy in his room |
| 250 | glide 70 f | [0.12, 1.02, 0.25] | [0, 0.98, -1.32] | 34 | 0.2 | 10 | closer for his name |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: soft day light from the window (+x), cool white ceiling panels.
- Sound: room tone, a monitor's soft beep every 2 s, a gentle piano phrase begins.
- After-state: Avery holds the pack.

### S03 · 0:12.8-0:16.4 · f384-f493 · "Avery quay video bóc thẻ Pokémon trong suốt hành trình chữa bệnh."
- Gloss: Avery filmed pack-opening videos throughout his treatment.
- Spine link: 2. Viewer must get: He did this again and again, month after month.
- In: glide. Out: glide.
- Set: ward. Light: day.
- Build: reuse the hospital room; the calendar flips; the bin fills.
- Blocking: Avery at his mark. Locked frame.
  - avery at [0, -1.32], front; tear, toss, tear, toss; grin.
- Action, against the words: Three openings: tears at f414, f440, f468; each wrapper tossed toward the bin (arc 12 f) and it drops in; the calendar page flips on each tear (THANG 4 -> 6 -> 8); the bin's pile rises.
- Acting: Excited each time.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 384 | open | [0.5, 1.35, 1.9] | [0.4, 0.95, -1.6] | 46 | 0.08 | 3 | locked frame: same room, months pass |

- Kicks (7 f): none.
- Physics & FX: wrappers: thrown arcs into the bin, they stay there.
- Light & mood: day.
- Sound: three paper tears f414, f440, f468; calendar flaps; piano continues.
- After-state: Three wrappers in the bin; calendar on THANG 8.

### S04 ★ · 0:16.4-0:21.9 · f493-f657 · "Trong video cuối cùng, Avery bóc được một lá Jirachi minh họa hiếm từ bộ kỷ niệm ba mươi năm."
- Gloss: In his final video, Avery pulled a rare illustration Jirachi from the 30th anniversary set.
- Spine link: 2. Viewer must get: The Jirachi: his last pull, his joy.
- In: glide. Out: dissolve 10 f.
- Set: ward. Light: day.
- Build: new: 30th Celebration pack (foil, '30' lettering, no logo) with a tear strip; five cards: four commons, the Jirachi SIR last.
- Blocking: Avery at his mark, the pack in both hands at chest height.
  - avery at [0, -1.32], front; tears the pack f548, Jirachi out f571, holds it up f600; neutral -> shock (gape) -> grin.
- Action, against the words: f530-546 he pinches the top; f548 tear on 'bóc': the strip flies off and lands on the blanket; f552-566 he slides the cards out and flips through the commons (one every 4 f); f569-575 the Jirachi comes up on 'Jirachi' (f571): a holo gleam sweeps it f578-592; f575-595 his jaw drops (gape 0.7) then a huge grin; f600-620 he raises it toward his phone and holds it there.
- Acting: Concentration, then disbelief, then pure joy.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 493 | open | [0.3, 1.05, -0.25] | [0.02, 1, -1.3] | 34 | 0.2 | 10 | close, from beside his phone |
| 566 | glide 20 f | [0.25, 1.04, -0.55] | [0.02, 1.02, -1.3] | 30 | 0.2 (punch 0.6 for 20 f) | 12 | push on the pull |
| 600 | glide 24 f | [0.28, 1.06, -0.62] | [0.03, 1.1, -1.28] | 30 | 0.15 | 12 | the card held up to the phone |

- Kicks (7 f): none.
- Physics & FX: tear strip: flies 20 cm, lands on the blanket and stays; empty wrapper dropped on the blanket f566 and stays.
- Light & mood: day; the card's gleam is the only sparkle (never over the art: it sweeps as a band across the foil).
- Sound: foil crinkle f530; tear f548; card slides f552-566; a soft rising shimmer f571; a held warm chord.
- After-state: Avery holds the Jirachi up to his phone.

### S05 · 0:21.9-0:25.5 · f657-f764 · "Ngày mười tám tháng chín, Avery qua đời vì ung thư tuyến tụy."
- Gloss: On September 18, Avery died of pancreatic cancer.
- Spine link: 3. Viewer must get: The same room, empty; he is gone.
- In: dissolve 10 f. Out: dissolve 8 f.
- Set: ward. Light: day.
- Build: reuse the hospital room: the bed made and empty, the blanket folded; the phone dark on its tripod; the Jirachi in its top loader standing on the cabinet; the calendar on 18 / THANG 9; the IV pole bare.
- Blocking: No one. Locked frame, then a slow glide to the cabinet.
- Action, against the words: Stillness. f700-764 slow glide toward the cabinet: the Jirachi in its top loader and the calendar above it.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 657 | open | [0.5, 1.35, 1.9] | [0.4, 0.95, -1.6] | 46 | 0.06 | 3 | same frame, empty |
| 700 | glide 64 f | [0.95, 1.2, -0.2] | [1.25, 0.92, -2.1] | 38 | 0.12 | 8 | to his card on the cabinet |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: the same day light, dimmed and cooler (grey): the light law of grief.
- Sound: room tone only; the monitor beep is gone; one low piano note f700.
- After-state: The card waits on the cabinet.

### S06 · 0:25.5-0:28.1 · f764-f844 · "Chỉ trong tuần sau đó, các tin rao bắt đầu xuất hiện."
- Gloss: Within the following week, the listings started appearing.
- Spine link: 3. Viewer must get: Listings multiply.
- In: dissolve 8 f. Out: glide.
- Set: room. Light: golden.
- Build: reuse the room; the monitor page becomes a grid of 12 listing tiles (the Jirachi photo, a price, the name in the title).
- Blocking: Seller off frame left (POV over his shoulder).
- Action, against the words: f800-844 tiles pop in one by one (every 3-4 f), each with the same Jirachi photo, prices $4,999 to $20,000.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 764 | open | [0.16, 1.18, -1.25] | [0.35, 1.07, -2.2] | 38 | 0.25 | 8 | the screen fills |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden evening, monitor glow.
- Sound: notification pings on each tile f800-844.
- After-state: The grid is full.

### S07 ★ · 0:28.1-0:34.8 · f844-f1045 · "Một gian hàng hứa quyên chín mươi phần trăm cho từ thiện, nhưng tin rao ban đầu chỉ ghi mười phần trăm cho một quỹ ung thư trẻ em."
- Gloss: One shop promised to donate 90% to charity, but the original listing only said 10% for a children's cancer fund.
- Spine link: 4. Viewer must get: Promise 90, give 10: the money slides back to the seller.
- In: glide. Out: glide.
- Set: room. Light: golden.
- Build: reuse the bundles and the donation box; the monitor shows a banner 90% TO CHARITY, then the small print '10% to a kids cancer fund'.
- Blocking: Seller seated at his mark, bottom-left of frame.
  - seller at [-0.15, -1.45], front; seated, watching the money; grin.
- Action, against the words: f870-886 the monitor banner 90% TO CHARITY lights up; f886-910 all 10 stacks slide 0.06 m toward the donation box on 'chín mươi' (f889); f929-952 nine stacks slide back 0.34 m toward the seller on 'nhưng' (f929), decelerating with friction, the last two bump; f970 the banner shrinks to the small print; f980-992 the one stack left by the box tips over its rim and drops in on 'mười' (f984). The seller's grin.
- Acting: Seller pleased; eyes follow the money back to himself.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 844 | open | [0.16, 1.18, -1.25] | [0.35, 1.07, -2.2] | 38 | 0.15 | 6 | the banner |
| 858 | glide 40 f | [2.1, 1.6, -1.25] | [0.5, 0.85, -1.75] | 44 | 0.12 | 4 | locked frame on the money |

- Kicks (7 f): f984 strength 0.4.
- Physics & FX: Bundles: kinematic slides, ease-out with friction (0.8 m/s start, 4 m/s^2 decel); the keeper stack hops 0.26 m in x over the 0.2 m rim (ballistic, 12 f), lands in the box with a 1 cm bounce.
- Light & mood: golden; the monitor glow.
- Sound: paper slides f886, f929; soft thud of bundles bumping f948; the drop into cardboard f990.
- After-state: Nine stacks sit in front of the seller; one stack is in the box.

### S08 · 0:34.8-0:39.0 · f1045-f1170 · "Trong khi những lá Jirachi cùng loại chỉ bán vài chục đến vài trăm đô."
- Gloss: Meanwhile the same Jirachi cards only sell for tens to a few hundred dollars.
- Spine link: 4. Viewer must get: The real price is $65-$240.
- In: glide. Out: cut.
- Set: room. Light: golden.
- Build: reuse the monitor: a SOLD page: three sold tiles of the same card ($65, $125, $240) and the seller's $20,000 tile.
- Blocking: POV over the seller's shoulder.
- Action, against the words: f1058 the page switches to SOLD; f1120 the $65 tile lights on 'vài chục'; f1143 the $240 tile lights on 'vài trăm'; f1156 the $20,000 tile pulses red.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1045 | open | [0.16, 1.18, -1.25] | [0.35, 1.07, -2.2] | 36 | 0.2 | 8 | the sold prices |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden.
- Sound: mouse click f1058; two soft ticks f1120, f1143.
- After-state: Sold page up.

### S09 · 0:39.0-0:43.7 · f1170-f1312 · "Khoan đã, họ đang bán một lá bài, hay đang bán nỗi đau của một gia đình?"
- Gloss: Wait, are they selling a card, or selling a family's grief?
- Spine link: 4. Viewer must get: The card, then the boy's name on the listing.
- In: cut. Out: dissolve 8 f.
- Set: room. Light: golden.
- Build: reuse the card on the easel under the ring light; the monitor's listing title AVERY THE POKE KID behind.
- Blocking: Seller out of frame (right).
- Action, against the words: Hard cut on 'Khoan đã' (f1170). The card sharp in the ring light; f1262-1282 rack focus to the monitor title (AVERY THE POKE KID) on 'nỗi đau' (f1276); the card goes soft.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1170 | open | [-1.4, 1.05, -0.45] | [-0.25, 0.95, -1.95] | 34 | 0.18 | 14 | the card |
| 1262 | glide 20 f | [-1.4, 1.05, -0.45] | [-0.25, 0.95, -1.95] | 34 | 0.18 | 14 | rack focus to the name |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden; the ring light makes a white catchlight on the top loader.
- Sound: music drops out on the cut; a single low cello note f1276.
- After-state: as before.

### S10 · 0:43.7-0:46.2 · f1312-f1386 · "Bố mẹ Avery lên tiếng trên Instagram."
- Gloss: Avery's parents spoke up on Instagram.
- Spine link: 5. Viewer must get: The parents, at home, beside his empty chair.
- In: dissolve 8 f. Out: dissolve 6 f (through the phone: into her screen).
- Set: home. Light: golden.
- Build: new: the family room: table, candle, Avery's empty chair with his beanie, shelf, window with curtains.
- Blocking: Mum seated at her mark holding her phone; dad seated at his mark, his left arm resting on her shoulder.
  - mum at [-0.35, -1.62], front; seated, phone in both hands; pained.
  - dad at [0.35, -1.66], front; seated, arm on her shoulder; pained.
- Action, against the words: f1320-1386 mum types; slow push in on the two of them.
- Acting: Both sad (pained), quiet.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1312 | open | [0.2, 1.45, 1.7] | [0.15, 1.15, -1.5] | 42 | 0.25 | 5 | the family room |

- Kicks (7 f): none.
- Physics & FX: none; the candle flame flickers.
- Light & mood: golden dusk, low and warm; candle glow.
- Sound: room tone, a clock ticking; strings, very soft.
- After-state: Mum holds her phone.

### S11 · 0:46.2-0:53.7 · f1386-f1610 · "Gia đình không liên quan, cũng không nhận được gì từ bất kỳ lá bài nào bán dưới tên hay hình ảnh của Avery. Họ xin người bán gỡ tin xuống."
- Gloss: The family is not involved and receives nothing from any card sold under Avery's name or image. They asked sellers to take the listings down.
- Spine link: 5. Viewer must get: Her post, in plain words; she posts it.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: home. Light: golden.
- Build: reuse mum's phone: a plain post (no logo): a small avatar, lines that appear as she types: 'We are not involved.' / 'We receive nothing.' / 'Please take these listings down.', a POST button.
- Blocking: Her POV (mum not drawn); her finger (a plain stick line from below frame) taps POST.
- Action, against the words: f1400-1450 line 1 types; f1455-1530 line 2; f1556-1580 line 3 on 'gỡ tin'; f1585 her stick finger taps POST on 'gỡ' (contact 1 f before); the button darkens, the post goes up (a soft slide).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1386 | open | [-0.35, 1.29, -1.62] | [-0.35, 0.95, -1.3] | 30 | 0.15 | 6 | her screen, from her eyes |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: the screen glow on a golden dusk.
- Sound: soft key taps; the post 'whoosh' f1586.
- After-state: The post is up.

### S12 · 0:53.7-0:57.3 · f1610-f1720 · "Họ viết, điều này không tôn vinh trái tim hào phóng của Avery."
- Gloss: They wrote, this does not honor Avery's generous heart.
- Spine link: 5. Viewer must get: His things: who he was.
- In: dissolve 6 f. Out: glide.
- Set: home. Light: golden.
- Build: reuse the shelf: the framed photo (drawn: Avery grinning, holding a card up), his red binder, his mini tripod.
- Blocking: Parents off frame.
- Action, against the words: f1610-1720 slow glide along the shelf to the photo; it ends on his grin on 'Avery' (f1703).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1610 | open | [-0.75, 1.38, -0.5] | [-1.5, 1.3, -2.3] | 38 | 0.15 | 8 | his shelf |
| 1650 | glide 60 f | [-1.05, 1.36, -1.25] | [-1.62, 1.36, -2.3] | 32 | 0.2 | 10 | to his photo |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden dusk; the frame's glass catches the window light.
- Sound: strings continue, a gentle rise.
- After-state: as before.

### S13 · 0:57.3-1:00.3 · f1720-f1810 · "Họ đang để tang con trai, và chỉ xin được yên."
- Gloss: They are mourning their son, and only ask to be left in peace.
- Spine link: 5. Viewer must get: They close the world out.
- In: glide. Out: dissolve 8 f.
- Set: home. Light: golden.
- Build: reuse the family room; the curtains slide shut; the candle's glow grows as the room dims.
- Blocking: Dad stands (f1728-1738), steps back to the window (dad_win, f1738-1752), turns front, draws both curtains closed (f1758-1790). Mum lays the phone face down on the table on 'yên' (f1796).
  - dad at [0.35, -2.05], front; stands, steps back, draws the curtains; pained.
  - mum at [-0.35, -1.62], front; lays the phone face down f1796; pained.
- Action, against the words: as blocking; the room light drops to 55 % as the curtains close; the candle glow is the brightest thing.
- Acting: Quiet, slow; dad's eyes down.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1720 | open | [0.15, 1.5, 1.2] | [0.05, 1.2, -1.7] | 46 | 0.15 | 5 | the family, the window |

- Kicks (7 f): none.
- Physics & FX: curtains: slide with ease-in-out, sway 2 cm and settle.
- Light & mood: golden dims to 55 %; candle.
- Sound: curtain rings f1758-1790; the phone set down f1796; the music holds one chord.
- After-state: Curtains closed, phone face down.

### S14 · 1:00.3-1:02.9 · f1810-f1888 · "Gian hàng kia sau đó gỡ các tin rao từ thiện."
- Gloss: That shop then took the charity listings down.
- Spine link: 6. Viewer must get: The listings end; the seller sweats.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: room. Light: golden.
- Build: reuse the monitor grid: tiles grey out with ENDED one by one.
- Blocking: Seller at his mark (seen from the front at the end).
  - seller at [-0.15, -1.45], front; seated; nervous.
- Action, against the words: f1846-1880 tiles grey out ENDED one per 3 f, starting on 'gỡ' (f1850); f1856-1882 glide to the seller: his grin goes nervous, a sweat drop.
- Acting: smug -> nervous.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1810 | open | [0.16, 1.18, -1.25] | [0.35, 1.07, -2.2] | 38 | 0.2 | 8 | the listings end |
| 1846 | glide 40 f | [0.45, 1.25, -0.45] | [-0.12, 1.22, -1.45] | 36 | 0.2 | 10 | the seller |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden.
- Sound: error blips per tile f1846-1880.
- After-state: ENDED tiles.

### S15 · 1:02.9-1:09.6 · f1888-f2087 · "Còn họa sĩ vẽ lá Jirachi, Akira Egawa, chỉ nói rằng mình muốn tranh vẽ mang lại hạnh phúc cho mọi người."
- Gloss: And the artist who drew the Jirachi, Akira Egawa, only said she wants her art to bring happiness to people.
- Spine link: 6. Viewer must get: The art was made to make people happy.
- In: dissolve 8 f. Out: dissolve 8 f (push into the painting, match on the same art in the listing photo).
- Set: studio. Light: day.
- Build: new: the studio; the REAL Jirachi art on the tilted board; brush, jar, palette, plants in the window light.
- Blocking: Artist stands at her mark, brush in her right hand (screen left) touching the painting's left edge.
  - artist at [-0.36, -1.18], front; painting, then lifts the painting f2036-2060; neutral -> smile.
- Action, against the words: f1900-2030 small brush strokes (the hand moves along the edge, 3 strokes); f2036-2060 she lifts the painting off the board up beside her into the window light on 'hạnh phúc' (f2053) and smiles at it.
- Acting: Calm focus, then a gentle smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1888 | open | [0.95, 1.45, 0.6] | [-0.2, 1.25, -1.4] | 40 | 0.15 | 6 | the artist and the painting |
| 2030 | glide 28 f | [0.15, 1.45, 0.05] | [-0.06, 1.42, -1.05] | 34 | 0.2 | 8 | the painting in the light |
| 2062 | glide 24 f | [-0.05, 1.43, -0.5] | [-0.05, 1.42, -1.05] | 26 | 0.6 | 6 | push into the art |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright day, sunlight from the window.
- Sound: brush strokes; a music-box phrase f2053.
- After-state: She holds the painting up.

### S16 · 1:09.6-1:11.5 · f2087-f2145 · "Người bán đặt giá hai mươi nghìn đô."
- Gloss: The seller set the price at twenty thousand dollars.
- Spine link: 6. Viewer must get: The same art, with a price.
- In: dissolve 8 f. Out: dissolve 10 f.
- Set: room. Light: golden.
- Build: reuse the listing page (the seller's own listing, $20,000).
- Blocking: POV.
- Action, against the words: f2120-2140 the price $20,000 on 'hai mươi nghìn đô' pulses once.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2087 | open | [0.3, 1.1, -1.72] | [0.33, 1.08, -2.2] | 30 | 0.3 | 8 | the price |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: golden, cold monitor light.
- Sound: the monitor hum; music thins to one note.
- After-state: $20,000.

### S17 ★ · 1:11.5-1:15.0 · f2145-f2250 · "Còn Avery, chỉ cần được mở nó ra."
- Gloss: And Avery only needed to open it.
- Spine link: 6. Viewer must get: All he wanted was to open it.
- In: dissolve 10 f. Out: end.
- Set: ward. Light: golden.
- Build: reuse the hospital room in golden light (the flashback); a fresh pack.
- Blocking: Avery at his mark, the pack in both hands; seen from his phone's spot.
  - avery at [0, -1.32], front; tears f2201, holds the card up; smile_closed -> grin.
- Action, against the words: f2170-2198 he pinches the top; f2201 tear on 'mở' (f2203); f2208-2216 the Jirachi slides up; f2216 his face lights up (grin), gleam on the card f2220-2234; holds it up toward the lens to the end.
- Acting: Anticipation, then joy.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2145 | open | [0.3, 1, -0.58] | [0, 1, -1.32] | 32 | 0.18 | 10 | from his phone's spot |
| 2205 | glide 30 f | [0.28, 1.02, -0.66] | [0.02, 1.07, -1.3] | 30 | 0.12 | 12 | his joy, the card |

- Kicks (7 f): none.
- Physics & FX: tear strip lands on the blanket.
- Light & mood: golden flashback light through the window.
- Sound: foil tear f2201; the warm theme resolves; silence on the last frame.
- After-state: End on his grin and the card.

