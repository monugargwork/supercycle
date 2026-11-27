# Roush (the early Night UPC): direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/natalie-roush-upc/plan.json`.
All positions are set-local metres (y up). 30 fps, 2330 frames (VO ends f2293). Four places: the high street (bus stop, cafe, cinema, plaza with the listings board, one set), her creator room, the resale shop, the official dock.

## Tone
A fair, curious explainer with sight gags. She is a generic creator (no likeness); nothing shows her stealing or hiding anything. The box's origin stays a question mark. No brand logos: generic screens ("Shop", "Earns commission", "Video unavailable"), a generic RESALE shop, OFFICIAL DISTRIBUTOR on the dock.

## Quality bar (25 Nov 2026)
No blur, no shadows; bright daylight everywhere, blue skies with clouds; dressed sets; medium-wide by default, heads and feet in frame; real card scans (Umbreon on the lid, the Magikarp). Nobody sits; every gag is one motion.

## Visual laws
- The red Shop · $2,262 button: the hook and the end, drawn the same every time the phone is shown.
- The box's origin is a label: the official carton has a full one; her box has a bare patch and one question mark.
- Phone screens are only ever seen by their owner (POV).

## Transitions
Two hard cuts (S10 "Khoan", S18 the deleted video). Through-object dissolves: her tripod view to the viewer's phone (S01-S02), the phone back into her room (S02-S03), the button into the resale shop (S06-S07), her typing onto her own screen (S14-S15). Glides within a place.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f140 | f190 | $2,200 |
| f232 | f290 | NATALIE ROUSH |
| f380 | f425 | 30th |
| f500 | f548 | $179 |
| f716 | f762 | $320 |
| f946 | f988 | x12 |
| f1930 | f1985 | eBay |

## Sets

### street
- Origin in the shared world: [0, 0, 0]. Axes: shop fronts at z 0 facing +z (the road); the bus stop at x 0; the cinema at x 13..23; the plaza set back at x -32..-14.
- Light: day; sun az/el [-35, 42]. Open camera sides: +z.
- Marks [x, z]: view [0, 1.4]; tinman [15.9, 1]; tout [17.5, 0.45]; asker [-23, -2.8].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| stop | new: a bus shelter x -1.6..1.6, z 0.5..2.1: green steel posts, a glass back panel with a bright poster (a beach), a sky-blue roof 2.45 m, a timetable board, a BUS STOP flag post | [0, 1.2, 1.3] | [3.2, 2.45, 1.6] |
| phone | new: the viewer's phone: 7.8 x 16 cm, a coral case; its screen is a live canvas: the video (her room, her, the box), the title line, the grey 'Earns commission' line and the red Shop · $2,262 button; later 'Video unavailable', the screenshot gallery | [0, 1.2, 1.8] | [0.078, 0.16, 0.01] |
| shops | new: a row of shop fronts along z 0: a bakery (cream, red awning), a bookshop (sky blue), the cafe x 3..9 (red-and-white striped awning, two standing tables outside, flower boxes), a toy shop, a flower shop; upper floors with windows and balconies in cream, peach, mint; chimneys | [0, 3, -3] | [60, 6, 6] |
| cinema | new: the cinema x 13..23: a cream facade with red trim, a marquee with bulbs reading COMING SOON, a framed poster case at x 15.2 (a film poster: a mountain under a starry sky, the words COMING SOON), glass doors x 18.6..20.4 closed with a CLOSED sign, a ticket window | [18, 3.5, -1] | [10, 7, 2] |
| stand | new: the tout's little folding stand x 16.9..18.1 in front of the cinema: a red cloth, a flip sign on a pivot (front TICKETS with a chain-link icon, back x12 PRICE) | [17.5, 0.5, 1.15] | [1.2, 1, 0.5] |
| plaza | new: the plaza x -32..-14 set back to z -14: warm pavers in a circle pattern, a round fountain at (-23, -7) with water jets, planters with red and yellow flowers, string flags, a clock tower and pastel buildings behind; the listings board at x -17: a cork board 2.2 x 1.4 m on two posts, header FOR SALE, eight printed listings | [-23, 1, -7] | [18, 2, 14] |
| road | new: the road z 5..12 (asphalt, white dashes, a zebra crossing), kerbs, lamp posts with flower baskets, street trees in round planters, the far pavement, a park with trees and a row of houses at z 38; hills and blue sky with clouds behind | [0, 0, 8.5] | [120, 0.1, 7] |

### room
- Origin in the shared world: [300, 0, 0]. Axes: she stands behind the counter facing +z; her tripod camera at z 1.35 faces her; shelves on the left wall, the window on the right wall, calendar and cork board on the back wall.
- Light: day; sun az/el [25, 40]. Open camera sides: +z.
- Marks [x, z]: her [0, -0.45].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: room x -3..3, z -3..6, 2.8 m: pastel pink walls with a cream dado, a light oak floor with a round mint rug, a white ceiling with two round lamps; the left wall a floor-to-ceiling shelf packed with sealed product boxes (bright reds, blues, yellows), plushies on top; the back wall a poster wall (three framed posters), the wall calendar on SEPTEMBER, the cork board; the right wall a big window with blue sky and clouds and a plant | [0, 1.4, 1.5] | [6, 2.8, 9] |
| counter | new: a standing-height counter x -0.75..0.75, z -0.3..0.3, top 1.0: white with a pink front panel and a gold edge; a cutting mat on top | [0, 0.5, 0] | [1.5, 1, 0.6] |
| box | new: the Night UPC: base 38 x 9 x 28 cm, royal blue with gold trim; the lid 3.5 cm deep, its face a night sky with gold stars, a gold 30, the word NIGHT, a window with the real Umbreon scan, and a sticker lower left RELEASE NOV 6 · MSRP $179.99; on its back side a bare white rectangle (no shipping label) and one yellow question-mark sticker; inside: a stack of cards (real Magikarp scans on top), two booster bundles | [-0.08, 1.05, -0.12] | [0.38, 0.09, 0.28] |
| lidstand | new: a small clear acrylic stand on the counter's back right corner, the lid stands in it upright facing +z after S01 | [0.46, 1, -0.16] | [0.12, 0.05, 0.06] |
| rig | new: her filming rig: a tripod (black legs) at x -1.3 with a small white camera at 1.38 m turned to her, a ring light (a white ring on a stand) at x 1.3 | [0, 0.7, 1.05] | [2, 1.6, 0.4] |
| cork | new: a cork board 90 x 66 cm in an oak frame on the back wall left: empty except one red pushpin in the middle | [-1.75, 1.62, -2.98] | [0.9, 0.66, 0.02] |

### market
- Origin in the shared world: [600, 0, 0]. Axes: the counter along x at z -1.4..-0.8; the seller behind it; two plinths in front at z 0.4; the lens at +z.
- Light: day; sun az/el [10, 40]. Open camera sides: +z.
- Marks [x, z]: seller [-0.25, -1.7]; her [-2.05, -0.75].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| shop | new: a glossy resale shop x -4..4, z -4..9, 3.6 m: white walls with gold trim, a pale marble floor, glass display shelves of sneakers and sealed boxes along the back wall lit warm, a gold sign RESALE (generic) over the back shelves, ceiling spotlights, a big window with sky on the left wall | [0, 1.8, 0] | [8, 3.6, 8] |
| counter | new: the counter x -1.6..1.6, z -1.4..-0.8, top 1.0: white with a gold band; a till at x 0.15 (a card reader and a cash drawer); a glass jar at x -1.35 with a tag COMMISSION | [0, 0.5, -1.1] | [3.2, 1, 0.6] |
| plinths | new: two white plinths 56 x 60 x 46 cm at x -0.5 and x 0.5, z 0.4: on the left one Night box with a shelf tag $179.99; on the right the tower: twelve Night boxes drop in one at a time and stack flat, 1.44 m tall, with a red tag $2,262 on the top box | [0, 0.3, 0.4] | [1.6, 0.6, 0.46] |

### dock
- Origin in the shared world: [900, 0, 0]. Axes: the warehouse wall at z -5 faces +z, its roll-up door x -2..2 open; the shipping table in front at z 0.8..1.4; the lens at +z.
- Light: day; sun az/el [-30, 40]. Open camera sides: +z.
- Marks [x, z]: courier [0, 0.5].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| warehouse | new: a warehouse front: sky-blue ribbed cladding, a big roll-up door x -2..2 (rolled up, 3.2 m) into a warm-lit hall of racks with brown cartons, a sign OFFICIAL DISTRIBUTION over the door (plain letters, no brand), dock bumpers, pallets of shrink-wrapped cartons either side, a yellow forklift parked, a delivery van at x 6 | [0, 2.5, -5] | [16, 5, 0.4] |
| table | new: a steel shipping table x -0.7..0.7, z 0.8..1.4, top 0.95: a tape gun, a label printer | [0, 0.47, 1.1] | [1.4, 0.95, 0.6] |
| carton | new: the official carton 50 x 36 x 40 cm, brown with tape, a big white shipping label on its front face: FROM: OFFICIAL DISTRIBUTOR / TO: CREATOR / EARLY SAMPLE · NOT FOR SALE, a barcode | [0, 1.13, 1.1] | [0.5, 0.36, 0.4] |

## Cast

- **creator:** pink hoodie, light blue jeans, long blonde hair. Items: the box, two Magikarp cards, her phone. Views: front.
- **viewer:** teal tee, orange cap, blue jeans. Items: his phone. Views: POV only.
- **seller:** red hoodie, gold chain, cap, sunglasses. Items: none. Views: front.
- **courier:** brown uniform, brown cap. Items: carton. Views: front, side walking.
- **tinman:** red jacket, black trousers, slick hair. Items: a film-reel tin. Views: front.
- **tout:** tan trench coat, sunglasses, flat cap. Items: none. Views: front.
- **crowd:** seven people in bright tees: teal, orange, green, pink, sky blue, coral, yellow. Items: phones. Views: front.

## Scenes

### S01 ★ · 0:00.0-0:02.7 · f0-f80 · "Cô mở một hộp Pokémon hai tháng trước ngày bán,"
- Gloss: She opened a Pokémon box two months before its release date,
- Spine link: 1. Viewer must get: A creator at her counter lifts the lid off a night-blue box, straight to her filming camera.
- In: open on the act. Out: dissolve 8 f (through the tripod camera's view onto a phone screen).
- Set: room. Light: day.
- Build: the room, the counter, the box with its lid, the tripod camera and the ring light in the foreground.
- Blocking: Creator at HER, front view, both hands on the lid's sides.
  - creator at [0, -0.45], front; lifts the lid f24-44, sets it in the stand f44-60, palms out f62; smile -> grin.
- Action, against the words: f0-20 she grips the lid; f24-44 lifts it straight up off the base (a gold sparkle off the open box at f40); f44-60 sets it upright in the acrylic stand at the counter's back right; f60-80 she grins at her camera, both palms out (ta-da).
- Acting: Creator: excited grin, eyebrows up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [0.3, 1.5, 3.5] | [0.12, 1.05, -0.3] | 46 | 0.12 | 0 | medium-wide between the tripod and the ring light: her, the counter, the box |

- Kicks (7 f): f26 strength 0.3.
- Physics & FX: the lid: kinematic in her hands.
- Light & mood: bright day through the window; the ring light glows.
- Sound: a cardboard 'fwump' as the lid lifts f26; a sparkle chime f40.
- After-state: The lid stands in its stand for every later room shot; the open base stays on the counter.

### S02 ★ · 0:02.7-0:06.9 · f80-f208 · "rồi để ngay bên dưới video một cái nút mua giá hai nghìn hai trăm đô."
- Gloss: then put, right under the video, a buy button priced at two thousand two hundred dollars.
- Spine link: 1. Viewer must get: The same video on a viewer's phone at a bus stop; the view slides down it to a big red Shop · $2,262 button, which pulses.
- In: dissolve 8 f. Out: dissolve 8 f (into the phone's video, back into her room).
- Set: street. Light: day.
- Build: the phone in the viewer's hands (his POV), the pavement and the kerb below it.
- Blocking: Viewer at view (not seen: POV); his two arm lines come up from the bottom of frame to the phone's sides.
- Action, against the words: f80-97 on the phone: her video (the open box, her grin); f97-125 the lens slides down the screen past the title line to the button ('ngay bên dưới video'); f123 ('nút mua') the button pulses (scale 1 -> 1.08 -> 1) with a ring; f140 title $2,200; f150-208 slow push on the button.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 80 | open | [0, 1.518, 1.525] | [0, 1.2, 1.8] | 40 | 0.06 | 0 | the whole phone screen from the viewer's eyes |
| 97 | glide 28 f | [0, 1.388, 1.605] | [0, 1.184, 1.781] | 40 | 0.06 | 0 | down the screen to the button |

- Kicks (7 f): f123 strength 0.4.
- Physics & FX: none.
- Light & mood: bright sun on the pavement.
- Sound: street bed (cars, birds); a soft 'pop' on the button pulse f123; a cash-register 'ding' f140.
- After-state: The button is drawn the same way every time the phone is shown.

### S03 · 0:06.9-0:15.5 · f208-f466 · "Cô là Natalie Roush, nhà sáng tạo nội dung Pokémon, và hộp ấy là bộ Ultra-Premium kỷ niệm ba mươi năm, bản Đêm, hình Umbreon."
- Gloss: She is Natalie Roush, a Pokémon content creator, and the box is the 30th-anniversary Ultra-Premium Collection, the Night edition, with Umbreon.
- Spine link: 2. Viewer must get: The whole creator room: shelves of product, ring light, camera; then the lid in its stand: night sky, a gold 30, the real Umbreon.
- In: dissolve 8 f. Out: glide.
- Set: room. Light: day.
- Build: the room wide: shelves, posters, the window, the rig; the lid in its stand.
- Blocking: Creator at HER, front view, waving to her camera f215-240, then pointing at the lid f330-360.
  - creator at [0, -0.45], front; waves f215-240, points at the lid f330-360; smile.
- Action, against the words: f208-300 wide of the room, slow push; f215-240 she waves to her camera; f232 title NATALIE ROUSH; f300-380 glide to the lid; f330-360 she points at it; f380 title 30th; f420-466 the lid fills the frame: the Umbreon window ('Umbreon' f442).
- Acting: Creator: friendly host smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 208 | open | [1.1, 1.95, 5.4] | [-0.35, 1.25, -1.2] | 52 | 0.03 | 0 | the opening wide of her room: shelves, her at the counter, posters, the window |
| 320 | glide 60 f | [0.91, 1.21, 0.91] | [0.46, 1.15, -0.14] | 36 | 0.08 | 0 | the lid: Night, 30, Umbreon |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright, warm, the window sky blue.
- Sound: light ukulele theme; a whoosh on the glide f300.
- After-state: Unchanged.

### S04 · 0:15.5-0:20.3 · f466-f608 · "Giá bán lẻ chính thức một trăm bảy mươi chín đô, ngày mở bán sáu tháng mười một."
- Gloss: The official retail price was one hundred seventy-nine dollars, the release date the sixth of November.
- Spine link: 2. Viewer must get: The sticker on the lid: RELEASE NOV 6 · MSRP $179.99; then up to the wall calendar: still SEPTEMBER.
- In: glide. Out: dissolve 6 f.
- Set: room. Light: day.
- Build: the lid's sticker, the wall calendar (SEPTEMBER 2026, a grid of days, a red circle drawn on nothing yet).
- Blocking: Creator at HER in the background (front view), out of the push.
  - creator at [0, -0.45], front; standing; smile.
- Action, against the words: f466-540 push on the sticker ('một trăm bảy mươi chín' f499-526); f500 title $179; f528-598 tilt and glide up to the calendar behind her ('sáu tháng mười một' f563-585): SEPTEMBER, two pages before NOVEMBER.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 466 | open | [0.38, 1.095, 0.42] | [0.36, 1.045, -0.13] | 34 | 0.08 | 0 | the sticker: NOV 6, $179.99 |
| 528 | glide 70 f | [1.55, 1.62, -0.68] | [1.75, 1.72, -2.98] | 38 | 0.06 | 0 | the calendar: SEPTEMBER |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright day.
- Sound: a calendar page riffle f560 (the pages to November flutter but stay put).
- After-state: Unchanged.

### S05 · 0:20.3-0:25.8 · f608-f774 · "Trong video, cô lật ra hai lá Magikarp, và định giá một lá ba trăm hai mươi đô."
- Gloss: In the video she turned up two Magikarp, and valued one at three hundred twenty dollars.
- Spine link: 3. Viewer must get: She lifts two cards out of the box, one in each hand; the real Magikarp fills the frame.
- In: dissolve 6 f. Out: dissolve 8 f (back onto the viewer's phone).
- Set: room. Light: day.
- Build: two real Magikarp scans (sv2 203) in her hands.
- Blocking: Creator at HER, front view; f630-652 both hands into the box; f652-672 she lifts one card in each hand to shoulder height, faces toward the lens.
  - creator at [0, -0.45], front; reaches into the box f630-652; lifts a card in each hand f652-672; holds; shock -> grin.
- Action, against the words: f608-652 medium on her at the counter; f640 she reaches into the box; f652-672 lifts the two cards ('hai lá Magikarp' f653-679); f690-760 push in on the right-hand card until it fills about 55 % of the width ('ba trăm hai mươi' f717); f716 title $320.
- Acting: Creator: delighted gasp, then a proud grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 608 | open | [-0.017, 1.084, 2.486] | [-0.017, 0.841, -0.293] | 44 | 0.06 | 0 | medium-wide: her at the counter |
| 688 | glide 36 f | [0.424, 1.44, 0.12] | [0.404, 1.42, -0.33] | 30 | 0.05 | 0 | the Magikarp, big and sharp |

- Kicks (7 f): f655 strength 0.3.
- Physics & FX: the cards: kinematic in her hands.
- Light & mood: bright; a soft gleam crosses the card face f700-730.
- Sound: card slide f655; a 'wow' sparkle f680; a coin chink f717.
- After-state: She keeps holding the cards until the scene ends.

### S06 · 0:25.8-0:30.0 · f774-f900 · "Dưới video, YouTube ghi dòng chữ nhỏ: có hoa hồng, kèm nút dẫn tới một sàn"
- Gloss: Under the video, YouTube wrote in small print: earns commission, with a button leading to a marketplace
- Spine link: 4. Viewer must get: Back on the viewer's phone: the tiny grey line 'Earns commission' under the video, then the red button.
- In: dissolve 8 f. Out: dissolve 8 f (through the button into the marketplace).
- Set: street. Light: day.
- Build: the phone (POV), same screen as S02.
- Blocking: Viewer (POV).
- Action, against the words: f774-830 the screen; f830-865 the lens pushes in on 'Earns commission' ('có hoa hồng' f839-860); f870-900 slides to the button and pushes into it ('nút dẫn tới' f881); f884 the button presses in (his tap: the button darkens 4 f).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 774 | open | [0, 1.449, 1.568] | [0, 1.192, 1.79] | 40 | 0.06 | 0 | the screen: video, line, button |
| 826 | glide 30 f | [0.014, 1.286, 1.685] | [0.014, 1.18, 1.777] | 40 | 0.04 | 0 | the small print |
| 866 | glide 24 f | [0, 1.262, 1.688] | [0, 1.171, 1.767] | 40 | 0.4 | 0 | into the button |

- Kicks (7 f): f884 strength 0.3.
- Physics & FX: none.
- Light & mood: bright sun.
- Sound: street bed; a tap f884; a whoosh into the button f890.
- After-state: Unchanged.

### S07 ★ · 0:30.0-0:33.2 · f900-f997 · "bán hộp ấy với giá hơn mười hai lần giá gốc."
- Gloss: selling that box for more than twelve times its original price.
- Spine link: 4. Viewer must get: A glossy resale shop: one Night box at $179.99 on a plinth; beside it twelve boxes drop in one by one into a tower; the lens tilts up it.
- In: dissolve 8 f. Out: glide.
- Set: market. Light: day.
- Build: the shop, the counter, the two plinths, the single box with its tag, twelve boxes.
- Blocking: Seller at seller behind the counter (front view), arms folded look; nobody else.
  - seller at [-0.25, -1.7], front; standing behind the counter; grin.
- Action, against the words: f900-905 settle on the plinths; boxes drop from 0.7 m above the tower top every 6 f, f905 + 6 i (i 0..11), each lands flat with a 1 cm hop and settles; f946 title x12 ('mười hai' f947); f930-990 the lens tilts up the growing tower; f975 the $2,262 tag flaps onto the top box.
- Acting: Seller: smug smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 900 | open | [0, 0.716, 5.062] | [0, 0.4, 0.55] | 44 | 0 | 0 | the two plinths, one box |
| 930 | glide 56 f | [0, 1.094, 4.837] | [0, 1.243, 0.55] | 46 | 0.02 | 0 | tilt up the tower of twelve |

- Kicks (7 f): f971 strength 0.3.
- Physics & FX: the boxes: free fall from 0.7 m (g 9.8), a 1 cm hop on landing, rest; analytic.
- Light & mood: warm spotlights, white and gold.
- Sound: twelve thuds rising in pitch f905-971; a cash-register 'ka-ching' f975.
- After-state: The tower stays.

### S08 · 0:33.2-0:36.5 · f997-f1095 · "Cô không phải người bán, cô nhận hoa hồng."
- Gloss: She isn't the seller; she earns a commission.
- Spine link: 4. Viewer must get: The seller behind the counter by the till; she stands at the end of the counter by a jar marked COMMISSION; one gold coin slides from the till into her jar.
- In: glide. Out: dissolve 6 f.
- Set: market. Light: day.
- Build: the counter, the till, the jar with its COMMISSION tag, one gold coin.
- Blocking: Seller at seller (front view) behind the till; creator at her mark (front view) beside the counter's left end.
  - seller at [-0.25, -1.7], front; taps the till f1025-1030; grin.
  - creator at [-2.05, -0.75], front; standing by the jar; smile.
- Action, against the words: f997-1040 the seller taps the till (the drawer pops out 6 cm f1030); f1040-1058 one gold coin slides along the counter top from the till to the jar ('nhận hoa hồng' f1042) and drops in (plink) f1060; she gives a small shrug-smile.
- Acting: Seller: smug; creator: neutral, a small smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 997 | open | [-0.016, 1.652, 7.06] | [-0.87, 0.793, -1.071] | 46 | 0.04 | 0 | the counter: seller, till, her, jar |

- Kicks (7 f): none.
- Physics & FX: the coin: slides at constant speed, drops 8 cm into the jar.
- Light & mood: warm, white and gold.
- Sound: till beep f1028; the coin slide f1040-1058; a plink + ka-ching meme f1060.
- After-state: The coin stays in the jar.

### S09 · 0:36.5-0:39.6 · f1095-f1189 · "Cộng đồng nổ tung. "Hộp này ở đâu ra?""
- Gloss: The community exploded. "Where did this box come from?"
- Spine link: 5. Viewer must get: The plaza: seven people, phones in hand; every phone buzzes at once, heads snap down, then up, jaws drop; one raises a sign WHERE FROM?
- In: dissolve 6 f. Out: cut.
- Set: street. Light: day.
- Build: the plaza (fountain, flags, pavers), the crowd with phones (backs toward the lens), the asker's cardboard sign.
- Blocking: The crowd at the crowd marks, front view, phones held at chest height in one hand; the asker at asker.
  - crowd at [-24.9, -2.4], front; phones at chest; heads down f1100, up f1112; neutral -> shock.
  - asker at [-23, -2.8], front; raises the sign f1127-1140; stern.
- Action, against the words: f1097 every phone buzzes (a ring of shake lines at each phone); f1100-1110 heads tilt down to the screens; f1112 heads snap up, jaws drop (gape 0.5) ('nổ tung' f1111); f1127-1140 the asker lifts his sign WHERE FROM? over his head ('Hộp này' f1127); the others turn to him.
- Acting: The crowd: shock, then outrage; the asker: frowning.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1095 | open | [-22.988, 1.73, 10.723] | [-22.988, 0.647, -1.655] | 56 | 0.06 | 0 | the plaza crowd, full bodies, the fountain behind |

- Kicks (7 f): f1112 strength 0.6.
- Physics & FX: none.
- Light & mood: bright midday, the fountain sparkling.
- Sound: seven notification pings at once f1097; a crowd 'ohhh' f1112; 'Huh?' meme f1130.
- After-state: Unchanged.

### S10 · 0:39.6-0:43.7 · f1189-f1312 · "Khoan, hàng chưa phát hành mà đã nằm trên tay một người, là hàng gì?"
- Gloss: Wait: goods not yet released already in someone's hands, what kind of goods are they?
- Spine link: 6. Viewer must get: Hard cut: the open box on the counter, perfectly still; the lid with its NOV 6 sticker; the lens circles the box.
- In: cut. Out: dissolve 8 f.
- Set: room. Light: day.
- Build: the counter, the open box, the lid in its stand.
- Blocking: Creator at HER, frozen mid-gesture (front view).
  - creator at [0, -0.45], front; frozen; smile.
- Action, against the words: f1189 everything freezes (no blink); f1195-1300 the lens arcs 50 deg round the counter from the left to the right, low, the box centred; on 'trên tay một người' f1251 a slow push.
- Acting: Creator: frozen smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1189 | open | [-1.08, 1.55, 1.83] | [-0.08, 1.35, -0.12] | 40 | 0 | 0 | the box, frozen |
| 1200 | glide 100 f | [0.97, 1.5, 1.78] | [-0.08, 1.35, -0.12] | 40 | 0.06 | 0 | arc round the box |

- Kicks (7 f): f1189 strength 0.6.
- Physics & FX: none.
- Light & mood: the same bright room, now still.
- Sound: music cuts out f1189; a record scratch f1189; a single low clock tick every 15 f.
- After-state: Unchanged.

### S11 · 0:43.7-0:48.6 · f1312-f1458 · "Bạn thấy đấy, hãng chỉ gửi hàng sớm cho nhà sáng tạo qua kênh chính thức, có ghi rõ nguồn."
- Gloss: You see, the company only sends early product to creators through the official channel, with the source clearly stated.
- Spine link: 6. Viewer must get: A sunny warehouse dock: a courier carries a carton out of the open door and sets it on the shipping table; its big label: FROM: OFFICIAL DISTRIBUTOR / TO: CREATOR.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: dock. Light: day.
- Build: the warehouse front, the open roll-up door, the shipping table, the carton with its label.
- Blocking: Courier walks from courier_from to courier f1315-1372 (front view, carton in both hands at his chest), sets it on the table f1372-1390, steps back half a pace and gives a thumbs-free nod.
  - courier at [0, 0.5], front; walks out carrying the carton f1315-1372; sets it down f1372-1390; smile.
- Action, against the words: as blocking; f1405-1455 push in on the label ('ghi rõ nguồn' f1429-1445).
- Acting: Courier: brisk, pleasant.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1312 | open | [0, 1.536, 7.021] | [0, 0.755, -1.9] | 46 | 0.04 | 0 | the dock wide |
| 1400 | glide 40 f | [0.05, 1.25, 1.955] | [0, 1.13, 1.205] | 36 | 0.08 | 0 | the label: the source stated |

- Kicks (7 f): none.
- Physics & FX: the carton: kinematic, then resting on the table.
- Light & mood: bright clean daylight.
- Sound: a forklift beep far off; footsteps; a carton thud f1390; a tidy 'ding' f1440.
- After-state: Unchanged.

### S12 · 0:48.6-0:51.1 · f1458-f1534 · "Còn hộp này, không ai nói nó đến từ đâu."
- Gloss: But this box: nobody says where it came from.
- Spine link: 6. Viewer must get: She turns her box round on the counter: where a label would be, a bare white patch and one yellow question-mark sticker.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: room. Light: day.
- Build: the box base turning 180 deg on the counter; its back side: a bare white patch, one '?' sticker.
- Blocking: Creator at HER, front view, both hands on the box's ends f1462-1500.
  - creator at [0, -0.45], front; turns the box f1470-1496; neutral.
- Action, against the words: f1462-1470 her hands to the box; f1470-1496 she turns it 180 deg about its centre ('không ai nói' f1484); f1500-1534 push in on the bare patch and the '?' ('từ đâu' f1514).
- Acting: Creator: neutral, a small shrug.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1458 | open | [-0.325, 1.155, 2.614] | [-0.019, 0.847, -0.293] | 42 | 0.04 | 0 | medium-wide: her and the box |
| 1498 | glide 30 f | [-0.08, 1.32, 0.65] | [-0.08, 1.05, 0.03] | 34 | 0.08 | 0 | the bare patch, the question mark |

- Kicks (7 f): none.
- Physics & FX: the box: kinematic, turned in her hands, resting on the counter.
- Light & mood: bright.
- Sound: cardboard scrape f1472-1494; 'suspicious' sting f1505.
- After-state: The box shows its bare side from now on.

### S13 ★ · 0:51.1-0:56.4 · f1534-f1693 · "Giống như ai đó khoe bộ phim chưa chiếu rạp, rồi đặt cạnh nó một đường dẫn tới vé chợ đen."
- Gloss: Like someone showing off a film that hasn't opened yet, then putting next to it a link to black-market tickets.
- Spine link: 6. Viewer must get: The cinema front: a COMING SOON poster and closed doors; a man proudly holds up a film-reel tin; beside him a tout's little stand with a sign TICKETS, which he flips to x12.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: street. Light: day.
- Build: the cinema facade, marquee, poster, closed doors; the film tin; the tout's stand and its flip sign.
- Blocking: Tinman at tinman (front view) holding the tin up beside the poster with both hands; tout at tout (front view) behind his stand.
  - tinman at [15.9, 1], front; lifts the tin f1560-1575 and holds it up; grin.
  - tout at [17.5, 0.45], front; flips the sign f1668-1680; grin.
- Action, against the words: f1534-1600 the man lifts the tin f1560-1575 ('khoe bộ phim' f1561), the tin flashes; f1602-1640 glide right to the stand ('đường dẫn' f1634); the tout taps his sign; f1668-1680 he flips it on its pivot ('chợ đen' f1670-1690): x12 PRICE.
- Acting: Tinman: proud; tout: sly grin, eyebrows up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1534 | open | [17.799, 1.686, 13.398] | [17.799, 0.789, 0.58] | 48 | 0.04 | 0 | the cinema front: the man, the poster, the stand |
| 1600 | glide 40 f | [15.729, 1.27, 7.211] | [16.633, 0.702, 0.78] | 40 | 0.06 | 0 | closer on the stand and the sign |

- Kicks (7 f): f1674 strength 0.4.
- Physics & FX: the sign: a hinged flip about its vertical pivot, eased.
- Light & mood: bright sun, the marquee bulbs on.
- Sound: a film projector whirr f1560; a sly 'hehe' f1678; a cash 'ding' f1680.
- After-state: The sign shows x12.

### S14 · 0:56.4-0:57.8 · f1693-f1735 · "Cô trả lời:"
- Gloss: She answered:
- Spine link: 7. Viewer must get: Her room: she holds her phone in both hands and types.
- In: dissolve 8 f. Out: dissolve 6 f (onto her phone's screen).
- Set: room. Light: day.
- Build: the room, the counter (box with its bare side), her phone (back toward the lens).
- Blocking: Creator at HER, front view, phone at chest height in both hands.
  - creator at [0, -0.45], front; types on her phone; neutral.
- Action, against the words: f1693-1735 she types (the phone bobs 1 cm every 6 f); slow push.
- Acting: Creator: calm, focused.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1693 | open | [0.185, 1.155, 2.626] | [-0.02, 0.847, -0.294] | 42 | 0.08 | 0 | medium-wide: her with her phone |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright.
- Sound: keyboard taps.
- After-state: Unchanged.

### S15 · 0:57.8-0:59.8 · f1735-f1795 · ""Tôi chọn tự bỏ tiền mua.""
- Gloss: "I chose to spend my own money on this."
- Spine link: 7. Viewer must get: Her own view of her phone: the reply typed out, 'I chose to spend my own money on this.', and sent.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: room. Light: day.
- Build: her phone (POV): a reply box, the text typing in, the send arrow.
- Blocking: Creator (POV, not seen).
- Action, against the words: f1735-1760 the words type in ('Tôi chọn tự bỏ tiền mua' f1715-1765); f1762 the send arrow lights and the reply bubble jumps up into the thread; slow push.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1735 | open | [0, 1.427, -0.266] | [0, 1.2, -0.07] | 40 | 0.06 | 0 | her own phone, her reply |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright; the counter and the pink rug below the phone.
- Sound: typing taps; a 'whoosh' sent f1762.
- After-state: Unchanged.

### S16 · 0:59.8-1:04.0 · f1795-f1920 · "Chưa có bằng chứng nào cho thấy cô ăn cắp, hay biết nguồn gốc hộp có vấn đề."
- Gloss: There is no evidence that she stole it, or knew the box's origin was a problem.
- Spine link: 7. Viewer must get: The cork board on her wall: empty, one pushpin. No evidence.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: room. Light: day.
- Build: the cork board with one red pushpin and nothing pinned.
- Blocking: Creator at HER in the foreground, front view, phone lowered.
  - creator at [0, -0.45], front; standing, phone lowered; neutral.
- Action, against the words: f1795-1830 wide-ish from her to the board; f1830-1915 glide and push to the empty board ('bằng chứng' f1809-1820); the single pushpin.
- Acting: Creator: calm.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1795 | open | [0.386, 1.052, 3.408] | [-0.612, 0.717, -1.287] | 46 | 0.03 | 0 | her and the board behind |
| 1832 | glide 50 f | [-1.65, 1.6, -1.38] | [-1.75, 1.62, -2.98] | 38 | 0.06 | 0 | the empty board, one pin |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright.
- Sound: quiet; one soft piano note f1835.
- After-state: Unchanged.

### S17 · 1:04.0-1:11.1 · f1920-f2132 · "Nhưng eBay đã gỡ nhiều tin bán đồ Pokémon kỷ niệm ba mươi năm, với lý do: bán hàng ăn cắp không được phép."
- Gloss: But eBay has removed many listings of 30th-anniversary Pokémon items, on the grounds that selling stolen goods is not allowed.
- Spine link: 7. Viewer must get: The plaza's FOR SALE board of printed listings (30th boxes and packs); one by one each flips over to a red REMOVED back.
- In: dissolve 8 f. Out: cut.
- Set: street. Light: day.
- Build: the listings board: eight listings on pivots (front: a box picture, 30th CELEBRATION, a price; back: red REMOVED, 'stolen goods not allowed').
- Blocking: Two passers-by at the board's sides (front view) watching.
  - passerL at [-18.6, -1.2], front; standing; shock.
  - passerR at [-15.4, -1.2], front; standing; neutral.
- Action, against the words: f1920-1950 the board in the plaza; f1930 title eBay; listings flip one by one f1952 + 18 i (i 0..7), each a 6 f flip about its vertical centre line; f2040-2130 push in ('ăn cắp không được phép' f2069-2100).
- Acting: Passers-by: eyebrows up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1920 | open | [-17, 2.239, 9.384] | [-17, 1.67, -1.467] | 44 | 0.05 | 0 | the board with its listings, two passers-by |
| 2040 | glide 60 f | [-17, 1.6, 0.6] | [-17, 1.55, -2] | 40 | 0.06 | 0 | the board's REMOVED backs |

- Kicks (7 f): none.
- Physics & FX: the listings: hinged flips about their vertical centre lines.
- Light & mood: bright midday.
- Sound: a paper flip and a stamp 'thunk' on each flip; plaza bed.
- After-state: All eight show REMOVED.

### S18 · 1:11.1-1:12.1 · f2132-f2164 · "Video đã bị xóa."
- Gloss: The video has been deleted.
- Spine link: 8. Viewer must get: Hard cut: the viewer's phone: the video area grey, 'Video unavailable'; the button is gone.
- In: cut. Out: dissolve 6 f.
- Set: street. Light: day.
- Build: the phone (POV): the grey unavailable card.
- Blocking: Viewer (POV).
- Action, against the words: f2132 the screen already grey; f2140 a small 'video removed' wobble; still.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2132 | open | [0, 1.518, 1.525] | [0, 1.2, 1.8] | 40 | 0.06 | 0 | the deleted video |

- Kicks (7 f): f2132 strength 0.4.
- Physics & FX: none.
- Light & mood: bright.
- Sound: a soft 'bonk' error sound f2134; street bed.
- After-state: Unchanged.

### S19 · 1:12.1-1:14.3 · f2164-f2228 · "Chưa ai chứng minh hộp ấy bị đánh cắp."
- Gloss: Nobody has proved the box was stolen.
- Spine link: 8. Viewer must get: The box on her counter, bare side out, the yellow question mark: unanswered.
- In: dissolve 6 f. Out: dissolve 6 f.
- Set: room. Light: day.
- Build: the box (bare side, '?' sticker), the lid in its stand behind.
- Blocking: Nobody in frame (she is out of the push).
- Action, against the words: f2164-2228 slow push on the question mark.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2164 | open | [0.02, 1.36, 0.98] | [-0.08, 1.05, 0.03] | 36 | 0.1 | 0 | the question mark, held |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright, still.
- Sound: quiet; the theme returns softly.
- After-state: Unchanged.

### S20 · 1:14.3-1:15.6 · f2228-f2268 · "Nhưng cái nút mua"
- Gloss: But the buy button
- Spine link: 8. Viewer must get: The viewer's phone: his screenshot gallery, a grid of the same screenshot, each with the red Shop · $2,262 button.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: street. Light: day.
- Build: the phone (POV): a gallery grid of nine screenshots.
- Blocking: Viewer (POV).
- Action, against the words: f2228-2268 the gallery scrolls up a little (the grid keeps coming: more of the same screenshot); f2242 ('nút mua') a camera-shutter flash on the screen.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2228 | open | [0, 1.503, 1.539] | [0, 1.2, 1.8] | 40 | 0.1 | 0 | the screenshot gallery |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright.
- Sound: camera shutter f2242.
- After-state: Unchanged.

### S21 · 1:15.6-1:17.7 · f2268-f2330 · "thì ai cũng đã kịp thấy."
- Gloss: everyone had already seen.
- Spine link: 8. Viewer must get: The sunny high street: at the bus stop, outside the cafe, by the cinema, everyone is looking down at a phone.
- In: dissolve 8 f. Out: end.
- Set: street. Light: day.
- Build: the whole street wide: bus stop, cafe, cinema, people on the pavement with phones.
- Blocking: The viewer at view and six walkers at the walkers marks, front view, each looking down at a phone held at chest height.
  - viewer at [0, 1.4], front; looking down at his phone; neutral.
- Action, against the words: f2268-2330 the lens cranes up and back; every head tilted down to a phone; a shutter click f2290; hold to the end.
- Acting: Everyone: absorbed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2268 | open | [0.509, 3.369, 22.837] | [0.509, 0.526, 2.61] | 50 | 0 | 0 | the street, everyone on a phone |
| 2290 | glide 40 f | [0.5, 10.264, 24.08] | [0.5, 1.522, 2.442] | 52 | 0 | 0 | crane up and back: the whole street |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright sun, blue sky with clouds.
- Sound: street bed; a shutter click f2290; the theme's last chord.
- After-state: End.

