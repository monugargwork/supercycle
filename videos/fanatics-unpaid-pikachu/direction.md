# Fanatics unpaid Pikachu: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/fanatics-unpaid-pikachu/plan.json` (0 errors; one fast pan in the hook is intentional, a whip along the wall).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2325 frames (VO ends f2312).

## Timed lines
| # | VO line | frames | punch words (onset frame) |
|---|---|---|---|
| 1 | Một lá Pikachu mặc áo mưa được bán với giá tám triệu tư đô la, rồi biến mất khỏi danh sách đã bán. | 0-165 | Pikachu 8, tám 71, biến 122 |
| 2 | Tháng chín, trên sàn Fanatics Collect, sáu mươi tư lượt trả giá, búa gõ ở bảy triệu, cộng phí thành tám triệu bốn trăm nghìn. | 172-406 | chín 185, sáu mươi tư 254, bảy 327, cộng 347, tám 370 |
| 3 | Báo chí khắp nơi đưa tin: lá Pokémon đắt thứ hai lịch sử. | 412-525 | Báo 412, đắt 482, thứ hai 497 |
| 4 | Cuối tháng mười, hồ sơ ghi rõ: đã thanh toán. | 531-624 | đã 593 |
| 5 | Rồi giữa tháng mười một, trang của nó biến mất. Rồi hiện lại. | 635-738 | biến 696, hiện 728 |
| 6 | Lần này, dữ liệu ẩn bên trong trang ghi đúng một chữ: đã hủy. | 744-868 | ẩn 785, đã 839, hủy 856 |
| 7 | Khoan, vậy rốt cuộc có ai trả tiền không? Mà đâu chỉ riêng Pikachu. | 868-1004 | Khoan 868, không 951, Mà 967 |
| 8 | Trang tin GempireCards ngồi so từng kết quả đấu giá cũ với lịch sử bán hiện tại của Fanatics, và thấy hàng triệu đô doanh số Pokémon đã lặng lẽ bốc hơi. | 1019-1297 | so 1081, thấy 1193, bốc hơi 1285 |
| 9 | Những lá từng chốt giá một trăm linh tám nghìn, ba trăm ba mươi sáu nghìn đô, giờ như chưa từng được bán. | 1302-1475 | một trăm 1345, ba trăm 1378, chưa từng 1447 |
| 10 | Fanatics giải thích: không nhận được tiền thì giao dịch bị xóa khỏi lịch sử, để thông tin thị trường được chính xác. | 1484-1652 | xóa 1575, chính xác 1639 |
| 11 | Nhưng bạn thấy đấy, giá thẻ bài cũng giống giá nhà. | 1660-1749 | nhà 1743 |
| 12 | Một căn được báo bán đắt, cả khu phố lập tức nâng giá theo. | 1749-1850 | bán 1786, nâng 1835 |
| 13 | Đến lúc con số bị xóa, cả thị trường đã kịp chạy theo một mức giá có khi chưa từng được trả. | 1857-2009 | xóa 1888, chạy 1936 |
| 14 | Có thể chỉ là lỗi dữ liệu. Fanatics chưa giải thích. | 2011-2110 | lỗi 2044, chưa 2085 |
| 15 | Và lá Pikachu áo mưa vẫn được gọi là lá đắt thứ hai thế giới, kèm một chữ nhỏ không ai đọc: đã hủy. | 2111-2312 | thứ hai 2201, chữ nhỏ 2249, đã hủy 2285 |

## Transitions
Two hard cuts (into S07, the reaction, and S15, the museum). Time jumps dissolve (S02, S04, S05, S14) and so do the two place changes the camera can't travel (the newsstand, the street); inside the hall the camera glides from scene to scene.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f100 | f150 | $8,400,000 |
| f1345 | f1372 | $108,000 |
| f1378 | f1420 | $336,000 |

## Sets

### hall
- Origin in the shared world: [0, 0, 0]. Axes: +x screen right, the back wall face at z -5.2 (stage at x 0, the sold wall at x 5, the office door at x 6.6), +z = the room and the entrance.
- Light: day; sun az/el [74.4, 48]. Open camera sides: +z; nothing between z -4.3 and the lens in the two locked frames.
- Marks [x, z]: auctioneer [-0.47, -4.8]; clerk [3.8, -4.85]; clerk10 [3.85, -4.8]; writer [3.7, -4.4]; dA [2.75, -2.9]; dB [3.02, -2.6]; dC [2.45, -2.5].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| floor | reuse:carpet | [1.2, 0, 0.9] | [15, 0, 12.2] |
| walls | adapt:auction walls (green dado 1.1 m, cream above to 4.2 m), back wall x -6..8.5 with the door opening | [1.25, 2.1, -5.3] | [14.5, 4.2, 0.2] |
| stage | reuse:Mudkip stage | [0.8, 0.25, -4.6] | [4.4, 0.5, 1.2] |
| rostrum | reuse:rostrum + oak sound block | [-0.465, 0.96, -4.35] | [0.97, 0.92, 0.3] |
| columnA | reuse:lot column (top 1.78) | [0.18, 1.14, -4.6] | [0.22, 1.28, 0.3] |
| slabA | reuse:slabReal with the REAL raincoat Pikachu, GEM MT 10 | [0.18, 1.94, -4.6] | [0.19, 0.3, 0.012] |
| board | new: bid board (dark panel, amber digits): BIDS n / HAMMER $ / PREMIUM $ / TOTAL $, red SOLD lamp | [0, 2.6, -5.17] | [0.8, 0.9, 0.05] |
| date_plate | reuse:split-flap date plate | [0, 3.25, -5.17] | [0.8, 0.2, 0.04] |
| sold_wall | new: cork board 130 x 170 cm in an oak frame, painted header SOLD HISTORY above it; 22 paper tickets 26 x 17 cm and the hero ticket 34 x 23 cm on brass push-pins (each: REAL card thumbnail, lot price, status line) | [4.4, 1.85, -5.17] | [1.3, 1.7, 0.03] |
| calendar | new: flip wall calendar 42 x 30 cm (month and year) | [4.4, 2.98, -5.18] | [0.42, 0.3, 0.02] |
| cabinet | new: grey steel filing cabinet, 3 drawers with handles; its back stands 8 cm off the wall (the gap the ticket falls into) | [4.5, 0.46, -4.845] | [0.8, 0.92, 0.55] |
| shredder | new: office shredder bin, black head with a slot on top (y 0.96), clear front window showing the strips | [3.45, 0.48, -4.97] | [0.4, 0.96, 0.3] |
| door | new: oak office door 90 x 210 cm, hinged on its left edge, brass knob with a hanging CLOSED tag, OFFICE plate; dark office behind | [6, 1.05, -5.2] | [0.9, 2.1, 0.05] |
| tube | new: fluorescent tube fixture on the wall above the calendar | [4.4, 3.45, -5.1] | [1.2, 0.08, 0.12] |
| hero_ticket | new: the hero ticket (see hero_ticket): price $8,400,000, a green PAID stamp from S04, a red CANCELLED stamp on its back corner | [4.4, 1.62, -5.15] | [0.34, 0.23, 0.002] |
| yardstick | new: 1 m wooden yardstick (S05) | [3.7, 0.9, -4.9] | [1, 0.03, 0.01] |
| level | new: 60 cm yellow spirit level with a green bubble vial (S10) | [4.45, 1.3, -5.1] | [0.6, 0.05, 0.03] |

### newsstand
- Origin in the shared world: [-60, 0, 0]. Axes: the counter faces +z (the street).
- Light: day; sun az/el [70, 50]. Open camera sides: +z.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| street | reuse:asphalt + concrete sidewalk | [0, 0, 2] | [20, 0, 10] |
| kiosk | new: green steel kiosk 2.2 x 2.4 x 1.4 m, striped awning, rack of magazines behind the counter | [0, 1.2, -0.9] | [2.2, 2.4, 1.4] |
| counter | new: counter top y 1.0 | [0, 0.5, 0] | [1.8, 1, 0.6] |
| bundles | new: three tied bundles of newspapers (40 x 28 x 10 cm), each top paper's front page: the REAL raincoat Pikachu photo and the headline (EN, FR, VI) | [0, 1.05, 0] | [0.9, 0.3, 0.35] |

### street
- Origin in the shared world: [0, 0, 200]. Axes: the street runs along -z; houses on the left (-x) at z 0, -7, -14, -21, -28 with stake signs at x -2.3; two more streets behind at x -16 and -26.
- Light: golden; sun az/el [150, 40]. Open camera sides: +z and +x.
- Marks [x, z]: agent [-1.95, 2.3].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| road | reuse:asphalt | [1.5, 0, -12] | [4, 0, 60] |
| lawns | reuse:grassHD | [-10, 0, -12] | [40, 0, 60] |
| houses | new: 15 small gable houses 4 x 4.5 m, pastel walls, a door, two windows (3 streets of 5) | [-5, 1.6, -14] | [4, 3.2, 4.5] |
| signs | new: stake signs: white board 70 x 48 cm on a white stake, price in black; rises on the stake (the sign height = the price) | [-2.3, 1, -12] | [0.7, 0.48, 0.04] |
| rider | new: red SOLD rider 70 x 20 cm that hooks under sign 0 | [-2.3, 0.68, 2] | [0.7, 0.2, 0.02] |

### museum
- Origin in the shared world: [200, 0, 0]. Axes: the case faces +z.
- Light: day; sun az/el [20, 70]. Open camera sides: +z.
- Marks [x, z]: v1 [-0.6, 0.8]; v2 [0.62, 0.75]; v3 [-0.85, -0.5]; v4 [0.88, -0.55].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: dark gallery (charcoal walls 4 m high, dark wood floor) | [0, 2, -1] | [8, 4, 8] |
| plinth | new: white plinth 60 x 110 x 60 cm | [0, 0.55, 0] | [0.6, 1.1, 0.6] |
| case | new: glass case 50 x 50 x 50 cm, brass edges | [0, 1.35, 0] | [0.5, 0.5, 0.5] |
| slab | reuse:slabReal, the REAL raincoat Pikachu, upright on an acrylic stand | [0, 1.32, 0] | [0.19, 0.3, 0.012] |
| plaque | new: brass plaque 40 x 28 cm tilted back 25 deg on the plinth front: PIKACHU / ART ACADEMY / No.2 MOST EXPENSIVE POKEMON CARD / $8,400,000 / tiny last line: cancelled | [0, 0.86, 0.32] | [0.4, 0.28, 0.01] |
| spot | new: spotlight from the ceiling: a soft cone of light down onto the case | [0, 3.9, 0] | [0.3, 0.3, 0.3] |

## Cast

- **auctioneer:** black suit, red tie, grey hair, stout. Items: gavel. Views: front.
- **clerk:** black polo, lanyard, dark hair, glasses. Items: rubber stamp, yardstick, a ticket, spirit level. Views: front, side.
- **writer:** red jacket, cap, glasses. Items: thick binder of printed results. Views: front, side.
- **dA:** green hoodie, brown hair. Items: none. Views: front.
- **dB:** yellow jacket, purple beanie, glasses. Items: none. Views: front.
- **dC:** purple jacket, black hair, stout. Items: none. Views: front.
- **agent:** navy blazer, white shirt, blonde hair. Items: SOLD rider. Views: front.
- **visitors v1-v4:** mixed coats. Items: phones held up. Views: front.

## Scenes

### S01 ★ · 0:00.0-0:05.7 · f0-f172 · "Một lá Pikachu mặc áo mưa được bán với giá tám triệu tư đô la, rồi biến mất khỏi danh sách đã bán."
- Gloss: A raincoat Pikachu sold for 8.4 million dollars, then vanished from the sold list.
- Spine link: 1. Viewer must get: A huge sale, and then its record falls off the wall.
- In: open on the act. Out: dissolve 8 f (time jump back to September).
- Set: hall. Light: day.
- Build: reuse:stage, rostrum, lot column with the REAL raincoat Pikachu slab; new: bid board; new: sold wall with the hero ticket (SOLD $8,400,000).
- Blocking: Auctioneer front view behind the rostrum at his mark, gavel raised from frame 0.
  - auctioneer at [-0.47, -4.8], front; gavel up, strike f69; stern -> grin.
- Action, against the words: f0-62 the gavel is held up (wind-up held, a 1 cm tremble). f63-68 a beat of stillness, f69 strike (2 f before 'tám'): the board's TOTAL snaps to 8,400,000 and the SOLD lamp lights; the slab hops 4 cm. f78-122 the camera travels right along the back wall to the sold wall; f118 the hero ticket's pin pops out (it pings off and drops), f120-134 the ticket slides down the cork and drops into the 8 cm gap behind the filing cabinet on 'biến mất'. A pale clean rectangle stays on the cork where it hung, the pin lies on the cabinet top.
- Acting: Auctioneer: stern, then a grin after the strike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [0.05, 2.15, -1.55] | [-0.12, 2.38, -5.1] | 46 | 0.08 | 4 | gavel, lot and board together |
| 72 | glide 54 f | [4.4, 1.7, -2.5] | [4.4, 1.7, -5.2] | 40 | 0.15 | 6 | travel along the wall to the record |
| 126 | glide 16 f | [4.4, 1.42, -2.6] | [4.4, 1.25, -5.2] | 40 | 0 | 6 | follow the ticket down |

- Kicks (7 f): f69 strength 1; f133 strength 0.3.
- Physics & FX: gavel: 1 f down, 3 f rebound. Pin: pops 3 cm out and falls onto the cabinet top (bounces twice). Ticket: slides 0.6 m down the cork face in 12 f (paper on cork: 2/3 g), tips into the gap and is gone by f134.
- Light & mood: day, warm hall.
- Sound: held breath room tone; gavel crack f69 with a low boom; Kaching meme f72; pin ping f118, paper slide f120-134, a soft thud in the gap f134.
- After-state: The pale rectangle on the cork and the pin on the cabinet (seen again in S05).

### S02 · 0:05.7-0:13.7 · f172-f412 · "Tháng chín, trên sàn Fanatics Collect, sáu mươi tư lượt trả giá, búa gõ ở bảy triệu, cộng phí thành tám triệu bốn trăm nghìn."
- Gloss: In September, on Fanatics Collect: 64 bids, the hammer at seven million, with fees 8.4 million.
- Spine link: 1. Viewer must get: How the price was made: bids, hammer, fees.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: hall. Light: day.
- Build: the locked stage frame: date plate, bid board, auctioneer, the slab on column A. Paddles rise into the bottom of the frame from bidders below the frame.
- Blocking: Auctioneer at his mark. Bidders are below the frame; only their paddles (on 25 cm handles) rise into it.
  - auctioneer at [-0.47, -4.8], front; gavel; stern -> grin.
- Action, against the words: f176-185 the date plate flaps to THÁNG 9 · 2026. f254-296 paddles flick up at the bottom of frame (left, right, centre, 9 lifts) while BIDS counts 0 -> 64. f305 the gavel rises; f325 strike (2 f before 'bảy'): HAMMER 7,000,000. f349 PREMIUM +1,400,000 lights; f362-394 TOTAL rolls up to 8,400,000; f394 the SOLD lamp.
- Acting: Auctioneer: stern; a grin after the strike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 172 | open | [0, 2.32, -1.9] | [0, 2.38, -5.1] | 50 | 0.04 | 3 | the locked stage frame |
| 340 | glide 20 f | [0, 2.6, -2.2] | [0, 2.78, -5.17] | 38 | 0.15 (punch 0.4 for 14 f) | 5 | close on the board for the fees |

- Kicks (7 f): f325 strength 0.6; f394 strength 0.4.
- Physics & FX: paddles: up in 4 f, held 6 f, down in 5 f.
- Light & mood: day.
- Sound: flap clatter f176, bid murmur, paddle whooshes, digit ticks, gavel crack f325, cash-register roll f362-394, Kaching meme f394.
- After-state: Board holds TOTAL 8,400,000.

### S03 · 0:13.7-0:17.7 · f412-f531 · "Báo chí khắp nơi đưa tin: lá Pokémon đắt thứ hai lịch sử."
- Gloss: The press everywhere reported it: the second most expensive Pokémon card in history.
- Spine link: 1. Viewer must get: Everyone now believes the number.
- In: dissolve 8 f. Out: dissolve 8 f (time jump to late October).
- Set: newsstand. Light: day.
- Build: new: kiosk, counter, three newspaper bundles with front pages.
- Blocking: No people: bundles are thrown in from the delivery van off screen left.
- Action, against the words: Three tied bundles land on the counter on arcs from screen left: f414 ('Báo'), f428 ('chí'), f445 ('đưa'), each a thud with a hop and a settle; fanned in a pile, the third on top; their front pages: PIKACHU $8.4M (EN), PIKACHU 8,4 M$ (FR), PIKACHU 8,4 TRIỆU ĐÔ (VI), each with the real raincoat Pikachu and a big No.2. f470 push in on the top page as the line lands on 'đắt thứ hai'.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 412 | open | [0.1, 2.35, 1.25] | [0, 1, 0] | 40 | 0.2 | 5 | the counter, the bundles landing |
| 468 | glide 24 f | [0.03, 1.8, 0.5] | [0.02, 1.1, 0.06] | 34 | 0.2 | 8 | the middle front page |

- Kicks (7 f): f414 strength 0.35; f428 strength 0.35; f445 strength 0.35.
- Physics & FX: bundles: ballistic arcs (0.5 m up), land, one 3 cm hop, settle; twine holds.
- Light & mood: day, bright street.
- Sound: street ambience, three paper thuds, a printing-press rumble under, a newsroom chime f482.
- After-state: none

### S04 · 0:17.7-0:21.2 · f531-f635 · "Cuối tháng mười, hồ sơ ghi rõ: đã thanh toán."
- Gloss: At the end of October the record says clearly: paid.
- Spine link: 2. Viewer must get: The record was marked paid.
- In: dissolve 8 f. Out: dissolve 6 f (time jump).
- Set: hall. Light: day.
- Build: the locked wall frame: calendar, the sold wall with every ticket and the hero ticket back on its pin (this is before it fell), the cabinet.
- Blocking: Clerk front view at his mark left of the board, a rubber stamp in his right hand.
  - clerk at [3.8, -4.85], front; stamp; neutral -> smile.
- Action, against the words: f533-541 the calendar flips to 10 · 2026. f578-586 the clerk winds the stamp back, holds it to f589, f591 thumps it onto the hero ticket (2 f before 'đã'): a green PAID stamp appears, a small ink burst. He lifts the stamp away by f600 and nods.
- Acting: Clerk: neutral, a small satisfied smile after the stamp.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 531 | open | [4.4, 1.85, -1.7] | [4.4, 1.8, -5.2] | 46 | 0.08 | 3 | the locked wall frame |
| 580 | glide 16 f | [4.25, 1.72, -3.5] | [4.3, 1.62, -5.15] | 38 | 0.2 (punch 0.5 for 12 f) | 7 | the stamp on the ticket |

- Kicks (7 f): f591 strength 0.6.
- Physics & FX: stamp: 3 f down, 1 f squash, 4 f up.
- Light & mood: day, neutral.
- Sound: calendar flip f533, office hum, stamp thump f591, a soft ding.
- After-state: PAID stamp stays on the hero ticket.

### S05 · 0:21.2-0:24.8 · f635-f744 · "Rồi giữa tháng mười một, trang của nó biến mất. Rồi hiện lại."
- Gloss: Then in mid-November its page disappeared. Then it came back.
- Spine link: 2. Viewer must get: The record vanished, then came back.
- In: dissolve 6 f. Out: glide.
- Set: hall. Light: day.
- Build: the locked wall frame; the tube light flickers (cold).
- Blocking: Clerk at his mark with the yardstick in his right hand, held down along his leg.
  - clerk at [3.8, -4.85], front; crouch with the yardstick; nervous -> relief.
- Action, against the words: f637-645 the calendar flips to 11 · 2026. f693 the hero ticket's pin pops; f694-707 it slides down and drops into the gap behind the cabinet on 'biến mất'; the pale rectangle again. f708 the clerk looks down at the gap; f712-722 he crouches and slides the yardstick into the gap; f724 he flicks: the ticket pops up out of the gap on 'hiện' (arc 0.75 m), and f733 the stick's tip presses it back onto the cork, a little crooked; f738 a new pin. He straightens up.
- Acting: Clerk: nervous when it falls, effort on the fish, relief after.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 635 | open | [4.4, 1.85, -1.7] | [4.4, 1.8, -5.2] | 46 | 0.06 | 3 | the locked wall frame |
| 694 | glide 20 f | [4.2, 1.6, -2.2] | [4.2, 1.4, -5.2] | 44 | 0 | 4 | down a little to the gap and the stick |

- Kicks (7 f): f707 strength 0.25; f733 strength 0.3.
- Physics & FX: ticket: as in S01; the pop-up is a ballistic arc with spin, damped when the stick tip meets it.
- Light & mood: day, colder: the tube flickers at f636, f650.
- Sound: calendar flip f637, tube buzz and tick, pin ping f693, paper slide, wood scrape f712-722, flick f724, pin push f738.
- After-state: The hero ticket hangs a little crooked on a new pin.

### S06 ★ · 0:24.8-0:28.9 · f744-f868 · "Lần này, dữ liệu ẩn bên trong trang ghi đúng một chữ: đã hủy."
- Gloss: This time, the hidden data inside the page says exactly one word: cancelled.
- Spine link: 2. Viewer must get: On the side nobody looks at, it now says CANCELLED.
- In: glide. Out: cut.
- Set: hall. Light: day.
- Build: macro on the hero ticket; its lower right corner curls up and shows the back, where a red CANCELLED stamp sits.
- Blocking: Nobody in frame.
- Action, against the words: f752-790 the camera pushes in on the ticket (PAID still on its face). f800 a draught (the door off screen right) lifts the loose lower-right corner, which flutters twice (f800-826). f830-838 stillness, the corner half up. f839 ('đã') the corner curls fully: the back shows a red rubber stamp CANCELLED, on 'hủy' f856 the camera punches in.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 744 | open | [4.2, 1.6, -2.2] | [4.2, 1.4, -5.2] | 44 | 0 | 4 | continues from S05 |
| 752 | glide 34 f | [4.4, 1.62, -4.2] | [4.4, 1.6, -5.15] | 30 | 0.15 | 10 | push to the ticket |
| 834 | glide 12 f | [4.48, 1.57, -4.55] | [4.48, 1.57, -5.15] | 28 | 0.2 (punch 0.6 for 16 f) | 12 | the corner: CANCELLED |

- Kicks (7 f): f856 strength 0.4.
- Physics & FX: corner: a paper flap hinged on its diagonal; draught pushes it up in two flutters (damped spring), then it curls past 150 deg and stays.
- Light & mood: day, cold; the tube flickers once at f838.
- Sound: air hiss f800, paper flutter, silence f830-838, Realization Sound meme f839, low hit f856.
- After-state: The corner stays curled, CANCELLED showing (S07, S14).

### S07 · 0:28.9-0:33.5 · f868-f1004 · "Khoan, vậy rốt cuộc có ai trả tiền không? Mà đâu chỉ riêng Pikachu."
- Gloss: Wait, so did anyone actually pay? And it's not just Pikachu.
- Spine link: 3. Viewer must get: Collectors don't know what to believe; and there are many more records.
- In: cut. Out: glide.
- Set: hall. Light: day.
- Build: the hall in front of the sold wall; the three collectors in the left foreground.
- Blocking: The three collectors stand left of the line of sight, front view, heads turned toward the wall (facing screen right).
  - dA at [2.75, -2.9], front; stand; nervous -> shock.
  - dB at [3.02, -2.6], front; lean in; nervous.
  - dC at [2.45, -2.5], front; head tilt; dazed.
- Action, against the words: f868 ('Khoan') all three freeze mid-step (nervous). f892-930 dB leans in (crouch 0.1, head tilt), dA scratches nothing: holds still; f951 ('không?') dC tilts his head, dazed. f967 ('Mà đâu chỉ riêng') the camera pulls back and up to the whole wall: dozens of tickets.
- Acting: nervous -> shock (dA), nervous (dB), dazed (dC).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 868 | open | [2, 1.45, 0.4] | [3.9, 1.5, -4.8] | 50 | 0.08 | 6 | their faces with the wall behind |
| 967 | glide 32 f | [4.3, 2, 0.2] | [4.35, 1.85, -5.2] | 46 | 0 | 2 | pull back: the whole wall |

- Kicks (7 f): f951 strength 0.2.
- Physics & FX: none
- Light & mood: day.
- Sound: music drops out f868; Huh meme f951; a soft riser f967.
- After-state: The collectors stay off to the left (out of frame).

### S08 · 0:33.5-0:43.4 · f1004-f1302 · "Trang tin GempireCards ngồi so từng kết quả đấu giá cũ với lịch sử bán hiện tại của Fanatics, và thấy hàng triệu đô doanh số Pokémon đã lặng lẽ bốc hơi."
- Gloss: GempireCards compared old auction results with Fanatics' current sales history, and found millions of dollars of Pokémon sales had quietly evaporated.
- Spine link: 3. Viewer must get: Someone checked, and many records are simply gone.
- In: glide. Out: glide.
- Set: hall. Light: day.
- Build: the sold wall wide; the writer with a thick binder (cover: AUCTION RESULTS, printed tabs).
- Blocking: The writer walks in from screen left (side view, +x) f1008-1046 to his mark, then front view, binder held open at his chest with both hands (cover to us), eyes going between the binder and the wall.
  - writer at [3.7, -4.4], side -> front; walk in, binder at chest; neutral -> shock.
- Action, against the words: f1081-1100 eyes down (binder), f1104-1125 up and right (the wall), f1128-1150 down, f1153-1176 up. f1193 ('thấy') shock. f1270-1296 on 'bốc hơi' six tickets steam off in a wave from left to right: each one curls, fades to white and rises as a steam curl, leaving its brass pin and a pale rectangle on the cork.
- Acting: Writer: focused, then shock with his jaw dropping a little (gape 0.4).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1004 | open | [4.3, 2, 0.2] | [4.35, 1.85, -5.2] | 46 | 0 | 2 | continues from S07 |
| 1012 | glide 34 f | [4.1, 1.82, -1] | [4.1, 1.72, -5.1] | 48 | 0.12 | 4 | the writer and the wall |
| 1250 | glide 24 f | [4.35, 1.95, -2.4] | [4.4, 1.95, -5.15] | 44 | 0.15 (punch 0.4 for 14 f) | 3 | the tickets steam off |

- Kicks (7 f): f1286 strength 0.3.
- Physics & FX: steam: each curl rises 0.5 m in 20 f, widening and fading; the paper shrinks to nothing in 10 f.
- Light & mood: day.
- Sound: footsteps f1008-1046, binder pages, a pencil scratch; six soft hisses f1270-1296, a kettle-whistle swell under 'bốc hơi'.
- After-state: Six pale rectangles with bare pins.

### S09 · 0:43.4-0:49.5 · f1302-f1484 · "Những lá từng chốt giá một trăm linh tám nghìn, ba trăm ba mươi sáu nghìn đô, giờ như chưa từng được bán."
- Gloss: Cards that once closed at 108,000 and 336,000 dollars now look as if they were never sold.
- Spine link: 3. Viewer must get: Big sales gone, without a trace.
- In: glide. Out: glide.
- Set: hall. Light: day.
- Build: close on two tickets side by side: Base Set Mewtwo $108,000, Base Set Charizard $336,000 (real scans).
- Blocking: Nobody in frame.
- Action, against the words: f1343 the Mewtwo ticket steams off on 'một trăm'; f1376 the Charizard ticket on 'ba trăm'. f1430-1462 ('giờ như chưa từng'): the pale rectangles darken to match the cork and the pins pop out and drop: clean cork, as if nothing ever hung there.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1302 | open | [4.35, 1.95, -2.4] | [4.4, 1.95, -5.15] | 44 | 0 | 3 | continues from S08 |
| 1310 | glide 28 f | [4.4, 2.1, -3.55] | [4.4, 2.1, -5.15] | 32 | 0.15 | 9 | the two tickets |

- Kicks (7 f): f1343 strength 0.25; f1376 strength 0.25.
- Physics & FX: pins: pop 2 cm out, fall out of frame.
- Light & mood: day.
- Sound: two hisses f1343 f1376 with a cash-register 'no sale' clunk under each; two tiny pin pings f1440 f1446.
- After-state: Clean cork where those eight tickets were.

### S10 · 0:49.5-0:55.3 · f1484-f1660 · "Fanatics giải thích: không nhận được tiền thì giao dịch bị xóa khỏi lịch sử, để thông tin thị trường được chính xác."
- Gloss: Fanatics explains: if the money isn't received, the transaction is deleted from the history, so that market information is accurate.
- Spine link: 4. Viewer must get: The rule: unpaid means removed, neatly.
- In: glide. Out: dissolve 8 f (match: the ticket's shape becomes the stake sign).
- Set: hall. Light: day.
- Build: the clerk at the board's lower left; the shredder; the spirit level.
- Blocking: Clerk front view at mark clerk10.
  - clerk at [3.85, -4.8], front; unpin, shred, level; neutral -> smile.
- Action, against the words: f1488-1500 he unpins the lower-left ticket (it carries a red UNPAID stamp). f1540-1570 he turns to the shredder and holds it over the slot; f1573 ('xóa') the shredder grabs it: it is pulled down into the slot by f1590 and strips drop behind the window. f1600-1620 he lays the spirit level along the top edge of the bottom row; its bubble slides from the left end to the centre on 'chính xác' f1640; he gives a small satisfied nod.
- Acting: Clerk: matter-of-fact (neutral), a small smile at the level.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1484 | open | [4.4, 2.1, -3.55] | [4.4, 2.1, -5.15] | 32 | 0 | 9 | continues from S09 |
| 1492 | glide 40 f | [3.75, 1.5, -1.9] | [3.65, 1.15, -5] | 46 | 0.15 | 6 | the clerk and the shredder |
| 1598 | glide 30 f | [4.4, 1.38, -4.05] | [4.45, 1.3, -5.12] | 32 | 0.15 (punch 0.4 for 14 f) | 10 | the level's bubble |

- Kicks (7 f): f1573 strength 0.3.
- Physics & FX: ticket into the slot: pulled at 0.25 m/s; strips fall in the bin.
- Light & mood: day.
- Sound: pin pull f1490, shredder grind f1573-1592, a bubble 'ding' f1640.
- After-state: The bottom-left spot is empty; the level stays on the row.

### S11 · 0:55.3-0:58.3 · f1660-f1749 · "Nhưng bạn thấy đấy, giá thẻ bài cũng giống giá nhà."
- Gloss: But you see, card prices are like house prices.
- Spine link: 5. Viewer must get: Here is the calm comparison.
- In: dissolve 8 f. Out: glide.
- Set: street. Light: golden.
- Build: the street: five houses on the left, five stake signs at the same height, all $300K.
- Blocking: The agent stands on the near lawn beside sign 0, the SOLD rider in her hand.
  - agent at [-1.95, 2.3], front; holds the rider; smile.
- Action, against the words: Golden calm. A slow push down the street.
- Acting: Agent: smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1660 | open | [-0.6, 1.7, 8.5] | [-2.6, 1, -8] | 40 | 0 | 3 | down the street, five signs |

- Kicks (7 f): none.
- Physics & FX: none
- Light & mood: golden, long shadows.
- Sound: birds, a soft guitar theme.
- After-state: none

### S12 ★ · 0:58.3-1:01.9 · f1749-f1857 · "Một căn được báo bán đắt, cả khu phố lập tức nâng giá theo."
- Gloss: One house is reported sold high, and the whole street raises its prices at once.
- Spine link: 5. Viewer must get: One big sale lifts every neighbour's price.
- In: glide. Out: glide.
- Set: street. Light: golden.
- Build: the SOLD rider hooks under sign 0 (red, SOLD $900K); the neighbours' signs rise on their stakes and their prices roll up.
- Blocking: Agent beside sign 0.
  - agent at [-1.95, 2.3], front; hooks the rider; grin.
- Action, against the words: f1776-1784 she swings the rider up, f1786 ('bán') hooks it under sign 0 with a clack: SOLD $900K. f1810, 1818, 1826, 1834 the four neighbour signs shoot up their stakes one after another (0.75 -> 1.7 m, 6 f, overshoot 8 cm, settle), each price rolling $300K -> $450K, $480K, $520K, $560K.
- Acting: Agent: grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1749 | open | [-0.6, 1.7, 8.5] | [-2.6, 1, -8] | 40 | 0 | 3 | continues |
| 1796 | glide 26 f | [0.2, 3, 11.5] | [-2.8, 1.4, -10] | 40 | 0.15 | 2 | up a little to see the wave |

- Kicks (7 f): f1786 strength 0.4; f1810 strength 0.15; f1818 strength 0.15; f1826 strength 0.15; f1834 strength 0.15.
- Physics & FX: signs: spring rise, 6 f up, 8 cm overshoot, 6 f settle; stakes stay in the ground.
- Light & mood: golden.
- Sound: rider clack f1786, four ascending boings f1810-1834 (pitched up each time).
- After-state: Neighbour signs stay high.

### S13 ★ · 1:01.9-1:07.0 · f1857-f2011 · "Đến lúc con số bị xóa, cả thị trường đã kịp chạy theo một mức giá có khi chưa từng được trả."
- Gloss: By the time the number is erased, the whole market has already chased a price that may never have been paid.
- Spine link: 5. Viewer must get: Remove the sale, and the raised prices stay.
- In: glide. Out: dissolve 8 f.
- Set: street. Light: golden.
- Build: sign 0 pulled out of the lawn; the other signs and all the signs of the two streets behind stay high.
- Blocking: Agent beside sign 0.
  - agent at [-1.95, 2.3], front; yank, toss; neutral.
- Action, against the words: f1878-1888 she grips sign 0's stake and yanks it out of the lawn on 'xóa' (a puff of dirt, a hole), f1890-1904 tosses it flat onto the lawn behind her. f1905-1990 the camera cranes up: every other sign on this street and on the two streets behind stands high.
- Acting: Agent: neutral, a shrug.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1857 | open | [0.2, 3, 11.5] | [-2.8, 1.4, -10] | 40 | 0 | 2 | continues |
| 1866 | glide 22 f | [1, 2, 7] | [-2, 1, 1.4] | 40 | 0.1 | 5 | close on the yank |
| 1904 | glide 76 f | [7, 15, 15] | [-11, 0, -12] | 46 | 0.08 | 0 | crane up: the whole market stays high |

- Kicks (7 f): f1886 strength 0.35.
- Physics & FX: the sign: pulled up 0.4 m, tossed on an arc, lands flat, one bounce; dirt puff.
- Light & mood: golden.
- Sound: dirt rip f1886, a thump f1904, a long low synth pad for the crane.
- After-state: The hole stays.

### S14 · 1:07.0-1:10.4 · f2011-f2111 · "Có thể chỉ là lỗi dữ liệu. Fanatics chưa giải thích."
- Gloss: It may only be a data error. Fanatics hasn't explained.
- Spine link: 6. Viewer must get: No answer yet.
- In: dissolve 8 f. Out: cut.
- Set: hall. Light: day.
- Build: the sold wall with its gaps, the hero ticket with its curled corner; the office door.
- Blocking: Clerk at his mark, front view; then side view walking +x to the door.
  - clerk at [3.8, -4.85], front -> side; shrug, walk to the door; neutral.
- Action, against the words: f2023-2046 ('lỗi dữ liệu') he shrugs, both arms out. f2050-2088 he walks right to the office door (side view), f2084 the door swings open (inward), f2090 he steps through into the dark, f2096-2102 the door swings shut on 'giải thích'; the CLOSED tag on the knob swings and settles by f2110.
- Acting: Clerk: neutral, shrug, avoids eye contact.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2011 | open | [4.35, 1.65, -0.9] | [4.35, 1.5, -5.2] | 44 | 0.12 | 3 | clerk, wall, door |
| 2052 | glide 30 f | [5.4, 1.6, -1.3] | [5.65, 1.4, -5.2] | 44 | 0.12 | 3 | follow him to the door |

- Kicks (7 f): f2100 strength 0.4.
- Physics & FX: door: swings on its hinge, slams, 2 small rebounds; the tag is a pendulum (2.2 Hz, damped).
- Light & mood: day.
- Sound: footsteps, door creak f2084, slam f2100, tag tick-tick.
- After-state: The door is shut.

### S15 ★ · 1:10.4-1:17.5 · f2111-f2325 · "Và lá Pikachu áo mưa vẫn được gọi là lá đắt thứ hai thế giới, kèm một chữ nhỏ không ai đọc: đã hủy."
- Gloss: And the raincoat Pikachu is still called the second most expensive card in the world, with a small word nobody reads: cancelled.
- Spine link: 6. Viewer must get: The legend stays; the truth is in the small print.
- In: cut. Out: end.
- Set: museum. Light: day.
- Build: the dark gallery, the case on its plinth, the plaque; four visitors with phones flanking it.
- Blocking: Visitors front view at their marks, turned toward the case (facing inward), phones held up at face height.
  - v1 at [-0.6, 0.8], front; phone up; smile.
  - v2 at [0.62, 0.75], front; phone up; relief_open.
  - v3 at [-0.85, -0.5], front; phone up; grin.
  - v4 at [0.88, -0.55], front; phone up; smile.
- Action, against the words: Phones flash (f2120, 2134, 2151, 2163, 2178, 2196). f2124-2200 the camera pushes in past the visitors to the card. f2200-2240 it tilts down the plinth to the plaque: No.2 MOST EXPENSIVE POKEMON CARD, $8,400,000. f2256-2290 it pushes in on the last line, tiny: 'cancelled', landing on 'đã hủy' f2285-2300. Hold.
- Acting: Visitors: smiles, a 'whoa' (relief_open).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2111 | open | [0, 1.5, 4.4] | [0, 1.22, 0] | 40 | 0.15 | 4 | the case, the flashes |
| 2124 | glide 70 f | [0, 1.42, 1.45] | [0, 1.33, 0] | 36 | 0.1 | 8 | push to the card |
| 2200 | glide 36 f | [0, 1.12, 1.25] | [0, 0.88, 0.32] | 32 | 0.1 | 8 | tilt down to the plaque |
| 2256 | glide 34 f | [0, 0.92, 0.72] | [0, 0.77, 0.36] | 26 | 0.12 | 10 | the last line: cancelled |

- Kicks (7 f): none.
- Physics & FX: none
- Light & mood: dark gallery, one warm spot on the case.
- Sound: gallery hush, phone shutters with each flash (Camera shutter), music swell then out at f2280; Suspicious Sound meme f2300.
- After-state: end

