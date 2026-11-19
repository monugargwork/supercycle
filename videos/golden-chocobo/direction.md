# Golden Chocobo private sale: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/golden-chocobo/plan.json` (0 errors; four travels are fast on purpose: the pull back through the window, the cross to the counter, the tilt to the map, the orbit round the cage).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2275 frames (VO ends f2261).

## Timed lines
| # | VO line | frames | punch words (onset frame) |
|---|---|---|---|
| 1 | Có người vừa trả một triệu bốn trăm nghìn đô la cho một con gà vàng. | 0-98 | triệu 29, gà 82 |
| 2 | Không phải gà thật. | 100-134 | gà thật 121 |
| 3 | Là một lá bài Magic tên Golden Chocobo, trong bộ Final Fantasy, mang số seri bốn mươi bảy trên bảy mươi bảy, được PSA chấm điểm mười tuyệt đối. | 137-420 | Golden 194, bốn mươi bảy 298, mười 395 |
| 4 | Ứng dụng theo dõi giá thẻ Collectr đăng lên Instagram: một vụ bán riêng, đã xác nhận. | 430-586 | đăng 487, bán riêng 548, xác nhận 572 |
| 5 | Người bán là Adam Cai. | 590-638 | Adam 618 |
| 6 | Cộng đồng Magic lập tức nhíu mày. | 655-712 | nhíu 702 |
| 7 | "Một triệu tư? Cho con chim này à?" | 719-784 | Cho 752, à 780 |
| 8 | Bởi vì kỷ lục cũ của một lá Golden Chocobo chỉ là hai trăm năm mươi nghìn đô. | 784-920 | hai trăm 884, nghìn đô 907 |
| 9 | Giá mới nhảy gần gấp sáu lần, qua một cái bắt tay riêng tư, không đấu giá, không hóa đơn công khai. | 928-1093 | nhảy 947, sáu 970, bắt tay 1010, đấu giá 1043, hóa đơn 1070 |
| 10 | Khoan đã, gấp sáu lần chỉ sau một vụ bán? | 1106-1193 | Khoan 1106, bán 1186 |
| 11 | Hóa ra, có lý do của nó. Lá kỷ lục cũ chưa từng được chấm điểm. Lá này được PSA cho mười điểm. | 1202-1398 | chưa từng 1298, mười 1381 |
| 12 | Cả thế giới chỉ có bảy mươi bảy lá Golden Chocobo, và lá hoàn hảo thì còn ít hơn nhiều. | 1404-1552 | bảy mươi bảy 1439, hoàn hảo 1510 |
| 13 | Giống như hai chiếc xe cùng đời, nhưng một chiếc vẫn còn nguyên lớp nilon trên ghế. | 1560-1681 | chiếc 1625, nilon 1661 |
| 14 | Một nhà sáng tạo nội dung Magic kể đã gặp Adam Cai ở MagicCon Atlanta và trao đổi về vụ bán. | 1694-1876 | Adam 1772, MagicCon 1795 |
| 15 | Bằng chứng đến giờ nghiêng về phía thật. | 1882-1940 | nghiêng 1912 |
| 16 | Nhưng một vụ bán riêng thì không có búa, không có khán phòng, chỉ có một bài đăng. | 1951-2086 | búa 2011, khán phòng 2038, bài đăng 2074 |
| 17 | Và cả cộng đồng vẫn đang nhìn chằm chằm vào con gà vàng, chờ nó tự chứng minh mình đáng giá đến thế. | 2091-2261 | chằm chằm 2147, thế 2256 |

## Transitions
One hard cut (into S10, the squint). The store and its back room are one set joined by a window: the camera pulls back through it (S05 to S06) and pushes through it (S09). The garage and MagicCon are reached by 8-frame dissolves (S12 to S13 matches a lit rectangle to a windshield), and S16 dissolves back to the back room, later.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f32 | f80 | $1,400,000 |
| f298 | f345 | 47/77 |
| f380 | f424 | PSA 10 |
| f888 | f924 | $250,000 |
| f966 | f1000 | x6 |

## Sets

### store
- Origin in the shared world: [0, 0, 0]. Axes: +x screen right from the store's front; the store's back wall face at z -4.0 holds the window into the back room (x 1.6..3.0, y 1.0..1.9); the back room behind it spans x 0..3.4, z -4.2..-7.6; +z = the store floor and its open front.
- Light: day; sun az/el [70, 50]. Open camera sides: +z of the store; the back room is entered only through its window side (camera z between -4.25 and -7.4).
- Marks [x, z]: seller [1.95, -6.48]; buyer [2.65, -6.48]; buyer_seat [3, -7]; dA [0.35, -2.2]; dB [0.85, -2.25]; dC [1.3, -2.2]; keeper [2.15, -1.25]; keeper11 [-2.5, -3.45]; w1 [1.8, -3.7]; w2 [2.25, -3.75]; w3 [2.72, -3.7]; dA17 [2.02, -3.3]; dB17 [2.5, -3.3]; dC17 [1.62, -3.35]; keeper17 [2.92, -3.35].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| floor | new: wood-plank store floor; grey lino in the back room | [0, 0, 0.5] | [9, 0, 9] |
| walls | new: store walls 3.2 m (teal dado to 1.0 m, cream above) with shelves of booster boxes on the left wall and posters; back room walls 2.6 m, dull olive, ceiling | [0, 1.6, -4.1] | [9, 3.2, 0.2] |
| window | new: interior window 1.4 x 0.9 m in the back wall (sill 1.0 m), oak frame, faint blue glass | [2.3, 1.45, -4.1] | [1.4, 0.9, 0.2] |
| deal_table | new: small oak table 90 x 70 cm, top 0.76, four turned legs | [2.3, 0.38, -6] | [0.9, 0.76, 0.7] |
| lamp | new: green enamel shade (radius 22 cm) on a cord from the ceiling, warm bulb, a pool of light on the table | [2.3, 1.68, -6] | [0.44, 0.2, 0.44] |
| cage | new: brass birdcage, base disc r 17 cm, 12 vertical bars 42 cm, a dome with a ring on top, a hinged door; a perch-stand inside holds the slab upright facing +z (the window) | [2.05, 1.03, -6] | [0.34, 0.55, 0.34] |
| cloth | new: burgundy velvet cover draped over the cage (a tasselled cone), yanked off in S01 to the floor where it stays in a heap | [2.05, 1.1, -6] | [0.44, 0.62, 0.44] |
| slab | reuse:slabReal with the REAL Golden Chocobo (chocobo_gold), label: 2025 MAGIC FINAL FANTASY / TRAVELING CHOCOBO / #47/77 SERIALIZED, GEM MT 10 | [2.05, 0.99, -6] | [0.165, 0.26, 0.012] |
| briefcase | new: black leather briefcase 40 x 11 x 30 cm, brass latches, lid hinged on its back edge, the inside packed with strapped cash bricks | [2.55, 0.82, -6.12] | [0.4, 0.11, 0.3] |
| crate | new: upturned wooden crate 30 x 35 x 30 cm (the hen's perch) | [2.45, 0.175, -5.35] | [0.3, 0.35, 0.3] |
| gavel_block | new: round oak sound block (r 7 cm) with NO gavel on it | [1.92, 0.78, -5.74] | [0.14, 0.03, 0.14] |
| receipt_pad | new: receipt book, blank top sheet, a pen beside it | [2.5, 0.765, -5.82] | [0.15, 0.01, 0.2] |
| phone | new: the seller's phone (S04 his POV, S16 lying face up on the table, lit with the post) | [2.6, 0.77, -5.8] | [0.075, 0.01, 0.155] |
| boxes | new: stacked shipping cartons in the back room's corners | [0.5, 0.5, -7.1] | [0.8, 1, 0.6] |
| chair | new: two wooden chairs, the buyer's (S16-S17) in the back corner (x 3.0, z -7.0) | [3, 0.45, -7] | [0.42, 0.9, 0.42] |
| play_table | new: store play table 160 x 90 cm, top 0.76, two playmats, scattered decks | [1.2, 0.38, -1.4] | [1.6, 0.76, 0.9] |
| tower | new: the cash tower: strapped bricks 16 x 3.2 x 7 cm (green band, paper strap), 5 then 28 high (top 1.66) | [1.75, 1.21, -1.25] | [0.16, 0.9, 0.07] |
| carton | new: cardboard carton of bricks on a stool (top 0.9) beside the shopkeeper | [2.4, 0.75, -0.95] | [0.35, 0.3, 0.3] |
| counter | new: glass-front counter 160 x 60 cm, top 0.95, an arm lamp on it | [-2.5, 0.475, -3] | [1.6, 0.95, 0.6] |
| raw_card | new: the REAL Golden Chocobo scan in a thin penny sleeve, one corner whitened and soft (the old record card) | [-2.75, 0.955, -3.1] | [0.063, 0.002, 0.088] |
| slab_counter | reuse:slabReal, the same graded Golden Chocobo lying on the counter | [-2.28, 0.958, -3.1] | [0.165, 0.012, 0.26] |
| map | new: lightbox world map 120 x 80 cm on the back wall, 77 small gold bulbs (painted map, bulbs lit per frame) | [-2.5, 2.1, -3.99] | [1.2, 0.8, 0.04] |

### garage
- Origin in the shared world: [100, 0, 0]. Axes: two cars nose to +z, side by side at x -1.0 and +1.0; the strip light runs along z above.
- Light: day; sun az/el [40, 60]. Open camera sides: +z and +x.
- Marks [x, z]: keeper [2.35, 0.55]; keeper_sit [1.82, 0.42].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| floor | new: grey concrete garage floor with oil stains; pegboard back wall at z -3.2, roller door behind the lens | [0, 0, 0] | [9, 0, 9] |
| carA | new: yellow 1990s hatchback 1.6 x 1.45 x 3.8 m, driver door (outer side, x -1.8) open from the start: worn seat, a torn seam, a coffee ring | [-1, 0.7, 0] | [1.6, 1.45, 3.8] |
| carB | new: the same car, door on its outer side (x +1.8) hinged at its front edge (z 1.0); seats still wrapped in clear plastic (glossy streaks, crinkled seams) | [1, 0.7, 0] | [1.6, 1.45, 3.8] |
| strip | new: fluorescent strip light at y 2.9 | [0, 2.9, 0] | [0.12, 0.06, 2.4] |

### con
- Origin in the shared world: [200, 0, 0]. Axes: the vendor booth faces +z; banner over it; aisle along x.
- Light: day; sun az/el [60, 65]. Open camera sides: +z.
- Marks [x, z]: creator [-0.42, 0]; creator15 [-0.12, -0.72]; seller [0.42, 0]; a1 [-2.6, -3.2]; a2 [2.4, -3.6]; a3 [3.4, -2.8].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| floor | new: blue convention carpet with an aisle stripe | [0, 0, 0] | [14, 0, 10] |
| booth | new: booth back panel 3 x 2.4 m with framed card art, a draped table 160 x 60 cm (top 0.76) | [0, 1.2, -1.8] | [3, 2.4, 0.1] |
| banner | new: hanging fabric banner MAGICCON ATLANTA, 3.2 x 0.6 m | [0, 2.95, -2.2] | [3.2, 0.6, 0.02] |
| balance | new: brass jeweller's balance: base 18 x 12 cm, post 35 cm, 50 cm beam, two pans on three chains each; small brass tags REAL (left) and FAKE (right) | [0.25, 0.95, -1.05] | [0.5, 0.4, 0.12] |
| crowd | new: other booths and a few attendees far down the aisle | [0, 0.9, -5] | [12, 1.8, 2] |

## Cast

- **buyer:** dark suit, dark glasses, slicked black hair. Items: briefcase. Views: front.
- **seller:** navy blazer over a grey hoodie, short dark hair. Items: phone. Views: front.
- **dA:** green hoodie, brown hair. Items: phone, plain Traveling Chocobo. Views: front.
- **dB:** yellow jacket, purple beanie, glasses. Items: phone. Views: front.
- **dC:** purple jacket, black hair, stout. Items: phone. Views: front.
- **keeper:** green apron over a white tee, glasses, grey hair. Items: cash bricks, loupe. Views: front, side.
- **creator:** red cap, black tee. Items: vlog camera on a short grip, red REC light. Views: front, side.
- **hen:** brown hen, red comb. Items: none. Views: side.
- **crowd w1-w3:** store regulars. Items: none. Views: front.

## Scenes

### S01 ★ · 0:00.0-0:03.3 · f0-f100 · "Có người vừa trả một triệu bốn trăm nghìn đô la cho một con gà vàng."
- Gloss: Someone just paid 1.4 million dollars for a golden chicken.
- Spine link: 1. Viewer must get: A huge payment, for a 'chicken' under a cloth.
- In: open on the act. Out: follow (push in on the cage).
- Set: store. Light: day.
- Build: back room: the deal table under the lamp, the cloth-covered cage, the briefcase in the buyer's hand, the hen on her crate.
- Blocking: Seller front view at his mark behind the table (left), buyer front view at his (right), the briefcase raised in his right hand from frame 0.
  - seller at [1.95, -6.48], front; hand to the cloth, whip; smile -> grin.
  - buyer at [2.65, -6.48], front; briefcase up, slam; stern -> grin.
- Action, against the words: f0-23 the briefcase is held up (a 1 cm tremble). f23-26 it swings down; f27 it slams flat on the table (2 f before 'triệu'): the table jolts, the cloth sways. f31-37 the latches snap and the lid springs open on its back hinge: rows of strapped cash bricks. f74 the seller grabs the cloth's top; f80 (2 f before 'gà') he whips it off to screen left: gold light floods out of the cage, three loose golden feathers puff up off the cage floor and drift down (f80-120); the cloth tumbles and lands in a heap on the floor left of the table, where it stays.
- Acting: Buyer: stern, a small grin after the slam. Seller: smile, grin on the reveal.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [2.3, 1.8, -4.32] | [2.3, 1.2, -6.3] | 54 | 0.2 | 4 | the deal: both men, the table, the covered cage |
| 58 | glide 20 f | [2.12, 1.45, -4.75] | [2.08, 1.05, -6.05] | 44 | 0.3 | 6 | lean to the cage for the reveal |

- Kicks (7 f): f27 strength 1; f80 strength 0.5.
- Physics & FX: briefcase: 4 f fall, 1 f squash, a 1 cm hop; lid: spring hinge, overshoots to 105 deg and settles at 95. Cloth: thrown on a 0.5 m arc, tumbles, lands as a heap (squashed to 25 %). Feathers: flutter down at 0.3 m/s with sway.
- Light & mood: day preset; the back room is olive and dim, one warm lamp pool; gold glow from the cage after the reveal.
- Sound: low room tone; briefcase whoosh f23, slam f27, latch clacks f31, Kaching meme f33; cloth whip f80, a bright shimmer f82.
- After-state: The cloth stays in its heap; the briefcase stays open on the table (until S16).

### S02 · 0:03.3-0:04.6 · f100-f137 · "Không phải gà thật."
- Gloss: Not a real chicken.
- Spine link: 1. Viewer must get: Inside the cage: a graded card. Beside it: a real hen.
- In: follow. Out: follow (push into the slab).
- Set: store. Light: day.
- Build: the cage, the slab on its perch-stand; the hen on her crate in front of the table.
- Blocking: Hen side view on the crate, facing screen left (toward the cage).
  - hen at [2.45, -5.35], side; on the crate, head tilt, cluck; cluck.
- Action, against the words: f100-124 the camera drops and pushes between the bars' level: the slab glints (gleam f104-120). f118 the hen tilts her head; f121 ('gà thật') she clucks, beak open, a feather lifting off her back.
- Acting: Hen: head tilt, cluck.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 100 | open | [2.12, 1.45, -4.75] | [2.08, 1.05, -6.05] | 44 | 0 | 6 | continues from S01 |
| 102 | glide 22 f | [2.3, 0.88, -4.35] | [2.25, 0.76, -5.8] | 46 | 0.3 | 6 | slab and hen side by side |

- Kicks (7 f): f121 strength 0.2.
- Physics & FX: none
- Light & mood: day, lamp pool.
- Sound: Chicken meme f121 (the cluck is the joke).
- After-state: Hen stays on her crate.

### S03 · 0:04.6-0:14.3 · f137-f430 · "Là một lá bài Magic tên Golden Chocobo, trong bộ Final Fantasy, mang số seri bốn mươi bảy trên bảy mươi bảy, được PSA chấm điểm mười tuyệt đối."
- Gloss: It's a Magic card called Golden Chocobo, from the Final Fantasy set, serial number 47 of 77, graded a perfect 10 by PSA.
- Spine link: 1. Viewer must get: What it is: a serialized gold Magic card, PSA 10.
- In: follow. Out: glide.
- Set: store. Light: day.
- Build: macro on the slab through a gap in the cage bars (the bars blur in the foreground).
- Blocking: Nobody in frame.
- Action, against the words: f137-170 push to the whole slab; f175-215 closer on the card art ('Golden Chocobo' f194), a gleam crosses the case f200-226; f282-310 tilt up to the label: #47/77 on 'bốn mươi bảy' f298; GEM MT 10 on 'mười' f395 (the grade box flashes f395-405).
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 137 | open | [2.11, 1, -5.15] | [2.05, 0.99, -6] | 26 | 0.15 | 10 | the slab through the bars |
| 175 | glide 40 f | [2.07, 0.97, -5.3] | [2.05, 0.965, -6] | 20 | 0.15 | 12 | the card art |
| 282 | glide 28 f | [2.05, 1.09, -5.32] | [2.05, 1.085, -6] | 18 | 0.15 (punch 0.4 for 14 f) | 12 | the label: 47/77, GEM MT 10 |

- Kicks (7 f): f395 strength 0.3.
- Physics & FX: none
- Light & mood: day, warm lamp from above.
- Sound: a soft magic twinkle f194, a tick f298, a bright ding f395.
- After-state: none

### S04 · 0:14.3-0:19.7 · f430-f590 · "Ứng dụng theo dõi giá thẻ Collectr đăng lên Instagram: một vụ bán riêng, đã xác nhận."
- Gloss: The card-price tracking app Collectr posted on Instagram: a private sale, confirmed.
- Spine link: 2. Viewer must get: The sale is announced on social media, confirmed.
- In: glide. Out: glide.
- Set: store. Light: day.
- Build: the seller's phone in his hand, seen from his eyes (POV): a social post with the slab photo, PRIVATE SALE, $1,400,000; CONFIRMED ticks on.
- Blocking: The seller is the lens (not drawn); his arm comes up from below the frame holding the phone.
  - seller at [1.95, -6.48], POV (not drawn); phone up; -.
- Action, against the words: f430-452 the camera rises to his eye line as the phone comes up. f487 ('đăng') the post appears (slides up). f548 ('bán riêng') PRIVATE SALE is underlined. f572 ('xác nhận') a green CONFIRMED check stamps on; the like counter rolls up from f490.
- Acting: none
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 430 | open | [2.05, 1.38, -5.4] | [2.05, 1, -6] | 30 | 0 | 8 | back from the label |
| 436 | glide 24 f | [1.95, 1.52, -6.44] | [1.86, 1.12, -6.2] | 40 | 0.15 (punch 0.4 for 12 f) | 10 | his POV: the phone |

- Kicks (7 f): f572 strength 0.3.
- Physics & FX: none
- Light & mood: day; the phone screen lit.
- Sound: Phone Alert meme f487, notification pops on the likes, a confirm chime f572.
- After-state: none

### S05 · 0:19.7-0:21.8 · f590-f655 · "Người bán là Adam Cai."
- Gloss: The seller is Adam Cai.
- Spine link: 2. Viewer must get: This man is the seller; the card goes to the buyer.
- In: glide. Out: travel (pull back through the window into the store).
- Set: store. Light: day.
- Build: the back room as in S01, the cloth heap, the open briefcase.
- Blocking: Seller and buyer at their marks, front view.
  - seller at [1.95, -6.48], front; nod, slide the cage; smile.
  - buyer at [2.65, -6.48], front; nod; grin.
- Action, against the words: f610-626 the seller nods ('Adam' f618) and lowers the phone; f630-646 he slides the cage 10 cm across the table toward the buyer (x 2.05 -> 2.15); the buyer nods back.
- Acting: Seller: smile. Buyer: neutral -> grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 590 | open | [2.15, 1.75, -4.5] | [2.1, 1.25, -6.3] | 46 | 0.12 | 5 | the seller |
| 640 | glide 15 f | [2.25, 1.6, -4.5] | [2.2, 1.25, -6.3] | 46 | 0 | 4 | settle for the pull back |

- Kicks (7 f): none.
- Physics & FX: cage slide: friction, eases in 16 f.
- Light & mood: day, lamp pool.
- Sound: a wooden scrape f630-646.
- After-state: The cage stands at x 2.15 from now on.

### S06 · 0:21.8-0:24.0 · f655-f719 · "Cộng đồng Magic lập tức nhíu mày."
- Gloss: The Magic community immediately frowned.
- Spine link: 3. Viewer must get: The players out in the store don't buy it.
- In: travel. Out: glide.
- Set: store. Light: day.
- Build: the store: the play table, three players with phones behind it, the back-room window behind them (the lamp glow and the deal seen through it).
- Blocking: dA, dB, dC front view at their marks behind the play table (facing the lens, the window behind them), phones held at chest height (screens toward them).
  - dA at [0.5, -2.2], front; phone; neutral -> stern.
  - dB at [1, -2.25], front; phone; neutral -> stern.
  - dC at [1.5, -2.2], front; phone; neutral -> stern.
- Action, against the words: f655-701 the camera pulls straight back out of the back room through the window and over the play table. f702 ('nhíu mày') all three look up from their phones and frown at once.
- Acting: neutral (reading) -> stern (frown).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 655 | open | [2.25, 1.6, -4.5] | [2.2, 1.25, -6.3] | 46 | 0 | 3 | continues from S05 |
| 657 | glide 44 f | [1.85, 1.5, 1.7] | [0.9, 1.3, -2.6] | 42 | 0.15 | 4 | pull back through the window: the players |

- Kicks (7 f): f702 strength 0.2.
- Physics & FX: none
- Light & mood: day, bright store.
- Sound: store chatter, card shuffles; a low 'hmm' synth f702.
- After-state: none

### S07 · 0:24.0-0:26.1 · f719-f784 · ""Một triệu tư? Cho con chim này à?""
- Gloss: '1.4 million? For this bird?'
- Spine link: 3. Viewer must get: Players hold the same bird in their own decks for pocket money.
- In: glide. Out: glide.
- Set: store. Light: day.
- Build: close on dA; he holds up the regular Traveling Chocobo (real scan) from his deck.
- Blocking: dA front view at his mark, leaning toward the lens over the table.
  - dA at [0.5, -2.2], front; card up to the lens; stern -> nervous.
- Action, against the words: f719-744 the camera glides low and wide to dA. f745-752 he lifts the plain Traveling Chocobo up toward the lens ('Cho' f752), holds it beside his face, tilts it. f770 ('à?') head tilt, eyebrows up.
- Acting: dA: stern -> nervous (incredulous).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 719 | open | [1.85, 1.5, 1.7] | [0.9, 1.3, -2.6] | 42 | 0 | 4 | continues |
| 721 | glide 24 f | [0.66, 1.34, -1.05] | [0.54, 1.44, -2.2] | 52 | 0.2 | 10 | low and wide on dA and his card |

- Kicks (7 f): f770 strength 0.2.
- Physics & FX: none
- Light & mood: day.
- Sound: Huh meme f772.
- After-state: dA keeps his card.

### S08 · 0:26.1-0:30.9 · f784-f928 · "Bởi vì kỷ lục cũ của một lá Golden Chocobo chỉ là hai trăm năm mươi nghìn đô."
- Gloss: Because the old record for a Golden Chocobo was only 250,000 dollars.
- Spine link: 3. Viewer must get: The old record, in cash: a short stack.
- In: glide. Out: glide.
- Set: store. Light: day.
- Build: the play table: the shopkeeper at its right end with a carton of strapped bricks on a stool beside him.
- Blocking: Shopkeeper front view at his mark; the three players behind the table.
  - keeper at [2.15, -1.25], front; stack bricks; neutral.
- Action, against the words: f800-905 the shopkeeper takes bricks from the carton and stacks five, one by one (landing f820, f840, f860, f880, f905), the last on 'nghìn đô'. Each lands with a tap.
- Acting: Shopkeeper: neutral, careful. Players: stern.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 784 | open | [0.66, 1.34, -1.05] | [0.54, 1.44, -2.2] | 52 | 0 | 10 | continues |
| 786 | glide 30 f | [1.42, 1.5, 3] | [1.42, 1.2, -1.5] | 46 | 0.05 | 4 | the table, the stack, the shopkeeper |

- Kicks (7 f): f905 strength 0.15.
- Physics & FX: bricks: set down, 1 f squash.
- Light & mood: day.
- Sound: five paper taps on the frames above.
- After-state: Five bricks on the table.

### S09 ★ · 0:30.9-0:36.9 · f928-f1106 · "Giá mới nhảy gần gấp sáu lần, qua một cái bắt tay riêng tư, không đấu giá, không hóa đơn công khai."
- Gloss: The new price jumped nearly six times, through a private handshake: no auction, no public invoice.
- Spine link: 3. Viewer must get: The price leapt, and it happened behind glass, by handshake.
- In: glide. Out: cut.
- Set: store. Light: day.
- Build: the tower grows to 28 bricks; then the back-room window: the handshake over the deal table, the blank receipt pad, the sound block with no gavel.
- Blocking: Shopkeeper at his mark; through the window seller and buyer at theirs.
  - keeper at [2.15, -1.25], front; slap bricks on; pained.
  - seller at [1.95, -6.48], front; handshake; grin.
  - buyer at [2.65, -6.48], front; handshake; grin.
- Action, against the words: f940-990 the shopkeeper slaps strapped blocks of bricks onto the stack in a frantic rhythm (landing f945, f955, f965, f975, f985): the stack climbs to 28 bricks (1.66 m), towering over the players; it sways (damped, 0.05 rad) f990-1040. f992-1026 the camera rises past its top and pushes through toward the window: f1010 ('bắt tay') the seller and buyer shake hands over the table; f1043 ('không đấu giá') the empty sound block; f1070 ('không hóa đơn') the blank receipt pad.
- Acting: Shopkeeper: effort. Players: shock. Seller and buyer: grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 928 | open | [1.42, 1.5, 3] | [1.42, 1.2, -1.5] | 46 | 0 | 4 | continues |
| 938 | glide 28 f | [1.38, 1, 0.6] | [1.72, 1.32, -1.25] | 48 | 0.1 | 4 | low angle on the tower climbing |
| 994 | glide 34 f | [2.35, 1.55, -2.7] | [2.3, 1.15, -6.3] | 36 | 0.15 | 6 | past the tower, through the window: the handshake |

- Kicks (7 f): f945 strength 0.25; f965 strength 0.25; f985 strength 0.35.
- Physics & FX: tower: rigid stack, rocks on its base (damped spring, 1.4 Hz) after the last block; nothing falls.
- Light & mood: day; the back room lamp through the glass.
- Sound: five heavy slaps (Instagram Thud meme on the last f985), a riser under the climb, a muffled handshake pat f1010.
- After-state: The 28-brick tower stays on the play table.

### S10 · 0:36.9-0:40.1 · f1106-f1202 · "Khoan đã, gấp sáu lần chỉ sau một vụ bán?"
- Gloss: Wait, six times after just one sale?
- Spine link: 3. Viewer must get: Even the players stop and squint.
- In: cut. Out: glide.
- Set: store. Light: day.
- Build: dB close, the tower big in the right foreground.
- Blocking: dB front view at her mark, leaning back, looking up at the tower.
  - dB at [1, -2.25], front; lean back, look up; stern -> dazed.
- Action, against the words: f1106 ('Khoan') she freezes, eyes narrow; f1127-1160 she leans back and tilts her head up the tower (sways still settling); f1186 ('bán?') a slow head tilt.
- Acting: dB: stern (squint) -> dazed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1106 | open | [0.62, 1.22, -0.12] | [1.08, 1.45, -2.25] | 44 | 0.2 | 10 | the squint, the tower beside her |

- Kicks (7 f): f1106 strength 0.4.
- Physics & FX: none
- Light & mood: day.
- Sound: record scratch f1106 (synth), store hush.
- After-state: none

### S11 · 0:40.1-0:46.8 · f1202-f1404 · "Hóa ra, có lý do của nó. Lá kỷ lục cũ chưa từng được chấm điểm. Lá này được PSA cho mười điểm."
- Gloss: Turns out there's a reason. The old record card was never graded. This one got a 10 from PSA.
- Spine link: 4. Viewer must get: Raw versus perfect-graded: not the same thing.
- In: glide. Out: glide.
- Set: store. Light: day.
- Build: the counter under the arm lamp: the raw Golden Chocobo in a penny sleeve (whitened corner) and the PSA 10 slab side by side.
- Blocking: Shopkeeper front view behind the counter at keeper11.
  - keeper at [-2.5, -3.45], front; loupe; neutral -> smile.
- Action, against the words: f1204-1244 the camera crosses the store to the counter. f1268-1330 ('chưa từng được chấm điểm') the shopkeeper holds his loupe over the raw card's soft, whitened corner. f1334-1360 he moves it to the slab; f1381 ('mười') the slab's grade box flashes and he nods.
- Acting: Shopkeeper: neutral, a knowing smile on 'mười'.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1202 | open | [0.62, 1.22, -0.12] | [1.08, 1.45, -2.25] | 44 | 0 | 10 | continues |
| 1204 | glide 56 f | [-2.5, 1.5, -1.5] | [-2.5, 1.22, -3.2] | 40 | 0.12 | 6 | the counter and the shopkeeper |
| 1270 | glide 20 f | [-2.73, 1.22, -2.72] | [-2.75, 0.96, -3.1] | 26 | 0.15 | 10 | the raw card |
| 1334 | glide 20 f | [-2.3, 1.32, -2.62] | [-2.29, 0.96, -3.1] | 30 | 0.15 (punch 0.4 for 12 f) | 10 | the PSA 10 |

- Kicks (7 f): f1381 strength 0.3.
- Physics & FX: none
- Light & mood: day; the arm lamp's warm spot on the counter.
- Sound: lamp click f1268, a soft tick per word, a bright ding f1381.
- After-state: Both cards stay on the counter.

### S12 · 0:46.8-0:52.0 · f1404-f1560 · "Cả thế giới chỉ có bảy mươi bảy lá Golden Chocobo, và lá hoàn hảo thì còn ít hơn nhiều."
- Gloss: The whole world has only 77 Golden Chocobos, and perfect ones are far fewer.
- Spine link: 4. Viewer must get: 77 exist; only a few are perfect.
- In: glide. Out: dissolve 8 f (match: a lit gold rectangle -> the car's windshield).
- Set: store. Light: day.
- Build: the lightbox world map above the counter: 77 gold bulbs.
- Blocking: Shopkeeper below the map (head at the frame bottom), front view.
  - keeper at [-2.5, -3.45], front; stand; smile.
- Action, against the words: f1406-1438 tilt up to the map. f1420-1446 the 77 bulbs light up one after another across the continents, all lit on 'bảy mươi bảy' (f1446). f1506-1522 ('hoàn hảo') all but 3 go dark in a quick wave; the 3 brighten.
- Acting: Shopkeeper: smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1404 | open | [-2.3, 1.32, -2.62] | [-2.29, 0.96, -3.1] | 30 | 0 | 10 | continues |
| 1406 | glide 46 f | [-2.5, 2.02, -0.35] | [-2.5, 2.08, -3.99] | 44 | 0.15 (punch 0.4 for 14 f) | 3 | the map |

- Kicks (7 f): f1446 strength 0.2; f1510 strength 0.2.
- Physics & FX: none
- Light & mood: day; the bulbs glow.
- Sound: 77 tiny ticks rising in pitch f1420-1446, Wowww meme f1447; a power-down whoomp f1506.
- After-state: 3 bulbs lit.

### S13 ★ · 0:52.0-0:56.5 · f1560-f1694 · "Giống như hai chiếc xe cùng đời, nhưng một chiếc vẫn còn nguyên lớp nilon trên ghế."
- Gloss: Like two cars of the same year, but one still has the plastic on its seats.
- Spine link: 4. Viewer must get: Same object, but one is untouched: that's the premium.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: garage. Light: day.
- Build: garage: the two yellow hatchbacks, car A's door open on a worn seat; car B's door shut.
- Blocking: Shopkeeper (sleeves rolled) front view at the garage mark beside car B's door.
  - keeper at [2.35, 0.55], front; open the door, sit on the seat edge; smile -> grin.
- Action, against the words: f1560-1600 both cars, nose on. f1610-1640 the camera swings to car B's door; f1618-1630 the shopkeeper pulls it open on its front hinge ('chiếc' f1625): the seats inside still wrapped in glossy plastic. f1648-1662 he sits down sideways on the seat edge, legs out of the door: the plastic crinkles and shines on 'nilon' (f1661).
- Acting: Shopkeeper: smile -> grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1560 | open | [0, 2.05, 7.6] | [0, 0.85, 0] | 44 | 0.15 | 2 | two identical cars |
| 1606 | glide 34 f | [4.1, 1.35, 0.2] | [1.5, 0.8, 0.22] | 40 | 0.15 | 5 | car B's door, the plastic seats |

- Kicks (7 f): f1661 strength 0.2.
- Physics & FX: door: swings on its hinge (heavy: slow start, 2 small rebounds at the stop).
- Light & mood: day, cool strip light.
- Sound: door clunk f1630, plastic crinkle f1652-1666.
- After-state: Door open.

### S14 · 0:56.5-1:02.7 · f1694-f1882 · "Một nhà sáng tạo nội dung Magic kể đã gặp Adam Cai ở MagicCon Atlanta và trao đổi về vụ bán."
- Gloss: A Magic content creator says he met Adam Cai at MagicCon Atlanta and talked about the sale.
- Spine link: 5. Viewer must get: Someone met the seller in person, on camera.
- In: dissolve 8 f. Out: glide.
- Set: con. Light: day.
- Build: MagicCon show floor: the booth, the banner, attendees down the aisle.
- Blocking: Creator front view at his mark (left), facing right, his vlog camera up in his outer hand; seller at his (right), facing left.
  - creator at [-0.42, 0], front; camera up, handshake; grin.
  - seller at [0.42, 0], front; handshake; smile.
- Action, against the words: f1694-1760 the banner, then down to the two. f1768-1780 they shake hands ('Adam Cai' f1772); f1800-1870 they talk (alternating head nods); the REC light blinks all along.
- Acting: Creator: grin. Seller: smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1694 | open | [0, 1.62, 3.5] | [0, 1.62, -0.6] | 46 | 0.12 | 2 | the banner, the booth, the two |
| 1752 | glide 30 f | [0, 1.45, 3] | [0, 1.32, 0] | 42 | 0.15 | 6 | the handshake |

- Kicks (7 f): none.
- Physics & FX: none
- Light & mood: day, bright hall.
- Sound: convention crowd murmur, a camera beep f1700.
- After-state: none

### S15 · 1:02.7-1:05.0 · f1882-f1951 · "Bằng chứng đến giờ nghiêng về phía thật."
- Gloss: The evidence so far leans toward real.
- Spine link: 5. Viewer must get: Weighed up, it tips to real.
- In: glide. Out: dissolve 8 f.
- Set: con. Light: day.
- Build: the brass balance on the booth table, tags REAL (left) and FAKE (right).
- Blocking: Creator steps to the table (side view) and stands front view at creator15.
  - creator at [-0.12, -0.72], side -> front; lay the camera on the pan; neutral -> smile.
- Action, against the words: f1884-1898 he steps to the table; f1900-1910 he lays his vlog camera on the REAL pan; f1912 ('nghiêng') the beam tips: the REAL pan sinks 7 cm, the FAKE pan rises; it settles by f1930.
- Acting: Creator: neutral -> smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1882 | open | [0, 1.45, 3] | [0, 1.32, 0] | 42 | 0 | 6 | continues |
| 1884 | glide 22 f | [0.42, 1.55, -0.22] | [0.22, 0.98, -1.05] | 48 | 0.2 | 10 | the balance tips |

- Kicks (7 f): f1912 strength 0.3.
- Physics & FX: beam: damped rotation (1.2 Hz) to 0.28 rad.
- Light & mood: day.
- Sound: a brass clink f1910, a creak f1912.
- After-state: The balance stays tipped.

### S16 · 1:05.0-1:09.7 · f1951-f2091 · "Nhưng một vụ bán riêng thì không có búa, không có khán phòng, chỉ có một bài đăng."
- Gloss: But a private sale has no hammer, no hall, only a post.
- Spine link: 6. Viewer must get: Nothing official: an empty block, an empty room, one post.
- In: dissolve 8 f. Out: glide.
- Set: store. Light: day.
- Build: back room later: the seller and the briefcase gone; the buyer sits alone in the chair beside his cage; the sound block without a gavel; the phone face up on the table.
- Blocking: Buyer front view sitting at buyer_seat.
  - buyer at [2.95, -6.5], front; sit; neutral.
- Action, against the words: f1951-2020 close on the empty sound block ('búa' f2011). f2026-2050 pull back: the small room, two chairs, cartons, nobody else ('khán phòng' f2038). f2060-2080 push down to the phone on the table: it lights up with the post on 'bài đăng' (f2074).
- Acting: Buyer: neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1951 | open | [2.05, 1.2, -5.15] | [1.96, 0.8, -5.8] | 38 | 0.15 | 10 | the empty sound block |
| 2024 | glide 34 f | [2.35, 1.62, -4.32] | [2.55, 0.95, -6.6] | 52 | 0 | 3 | the empty room |
| 2058 | glide 20 f | [2.62, 1.26, -5.36] | [2.6, 0.78, -5.8] | 30 | 0.15 (punch 0.4 for 12 f) | 10 | the phone lights up |

- Kicks (7 f): f2074 strength 0.2.
- Physics & FX: none
- Light & mood: day; only the lamp pool feels lit.
- Sound: an empty room tone, a clock tick; Suspicious Sound meme f2074.
- After-state: The phone stays lit.

### S17 ★ · 1:09.7-1:15.8 · f2091-f2275 · "Và cả cộng đồng vẫn đang nhìn chằm chằm vào con gà vàng, chờ nó tự chứng minh mình đáng giá đến thế."
- Gloss: And the whole community is still staring at the golden chicken, waiting for it to prove it's worth that much.
- Spine link: 6. Viewer must get: Everyone is watching the bird, waiting.
- In: glide. Out: end.
- Set: store. Light: day.
- Build: the cage under the lamp; behind the window, the whole store pressed against the glass.
- Blocking: Crowd front view at w1-w3, dA17, dB17, dC17, keeper17 (store side, faces at the glass). Buyer seated. Hen on her crate.
  - w1 at [1.8, -3.7], front; pressed to the glass; dazed.
  - w2 at [2.25, -3.75], front; pressed to the glass; shock.
  - w3 at [2.72, -3.7], front; pressed to the glass; stern.
  - dA at [2.02, -3.3], front; pressed to the glass; stern.
  - dB at [2.5, -3.3], front; pressed to the glass; dazed.
  - dC at [1.62, -3.35], front; pressed to the glass; nervous.
  - keeper at [2.92, -3.35], front; pressed to the glass; smile.
  - hen at [2.45, -5.35], side; hop to the table, peck, cluck; cluck.
- Action, against the words: f2091-2112 close on the slab in the cage. f2112-2176 the camera circles the cage to its back: the window fills with faces, every one staring at the bird ('nhìn chằm chằm' f2138-2160). f2180-2230 a slow push toward the glass, 8 f of stillness f2228-2236. f2236-2246 the hen hops from her crate onto the table, f2250 she pecks the cage bar once (a ting), f2256 ('thế') she clucks. End.
- Acting: Crowd: dazed, shock, stern (staring). Hen: cluck.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2091 | open | [2.15, 1.02, -5.45] | [2.15, 0.99, -6] | 34 | 0.15 | 8 | the bird |
| 2112 | glide 30 f | [3.08, 1.32, -5.72] | [2.15, 1, -6] | 42 | 0 | 6 | around the cage |
| 2142 | glide 44 f | [2.25, 1.45, -6.92] | [2.28, 1.3, -4.05] | 46 | 0.08 | 4 | behind the cage: the faces at the window |
| 2196 | glide 40 f | [2.4, 1.58, -6.95] | [2.4, 0.98, -4.05] | 50 | 0.04 | 5 | slow push to the glass; the hen |

- Kicks (7 f): f2250 strength 0.15.
- Physics & FX: hen: a hop on a 0.25 m arc (12 f), lands, settles; the cage rings once when pecked.
- Light & mood: day; lamp pool on the cage, the bright store behind the glass.
- Sound: music thins to a held note; a peck 'ting' f2250, Chicken meme f2256; out.
- After-state: end

