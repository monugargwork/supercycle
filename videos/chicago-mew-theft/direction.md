# Chicago (Old Skool TCG): direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/chicago-mew-theft/plan.json` (0 errors; the warnings are feet touching the caption band and two brisk glides).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2440 frames (VO ends f2410). Three places: the shop (interior and the street outside it, one set, so the camera can fly through the window and the door), the house (the analogy), the jacket lining (the insert of the four cards).
Character shots are fitted by `scripts/plan_fit.py`: the closest lens at the chosen view direction that keeps every listed subject (heads at the crown, feet on the floor) inside the safe area with a 5 % margin.

## Tone
A dry true-crime fable with sight gags. Generic cartoon people, no likenesses (the owner is not drawn as Nick Bruni; the thief was never described). His phone number is a fictional 555 number. No arrest is shown, because none was reported.

## Quality bar (25 Nov 2026)
No blur, no shadows, bright warm palettes (cream walls, warm oak, tomato-red and cream tiles, sky blue), blue sky with clouds in every window and outdoor shot, dressed sets (shelves full of sealed product, framed real cards, posters, a pegboard of packs), medium-wide cameras with every character head-to-feet in frame, real card scans and real slab photos.

## Visual laws
- Every theft leaves a gap in the box that stays; the spoon tray in the analogy gets the same gap.
- The owner's attention is his eye-line: stern on hands near the goods, warm on the seller.
- Being recorded is the red REC lamp (on the ceiling camera and on the monitor).

## Transitions
One hard cut (S17, the handshake to the camera lens on "Tiệm"). Travels: S01 out through the window to the street, S02 back in, S20 to S21 in through the door glass and back out. Dissolves for changes of place (the jacket, the house) and time (the officer's arrival, his exit).

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f300 | f372 | CHICAGO |
| f1124 | f1182 | $6,700 |

## Sets

### shop
- Origin in the shared world: [0, 0, 0]. Axes: the counter crosses the room at z -1.45..-0.95; the back wall of shelves at z -3.8; the front wall (window, door) at z 5.4 faces the street (+z).
- Light: day; sun az/el [-35, 45]. Open camera sides: +z.
- Marks [x, z]: owner_reg [1.55, -1.62]; owner_pay [1.2, -1.58]; owner_left [0.6, -1.58]; owner_phone [2, -1.62]; man [0.98, -0.82]; man_door [1.9, 5.1]; man_walk [1.15, 6.8]; kid [-0.35, -0.72]; teen [-2.2, 2.75]; woman [2.75, 1.9]; woman_reg [1.9, -0.78]; teal [-2.45, -1.45]; cop [1.75, -0.8]; case_stand [-2.52, -1.7].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: shop x -3.4..3.4, z -3.8..5.4, 3.4 m; checkered floor tiles 50 cm (cream / tomato red), cream walls with a red dado band, cream ceiling with two light panels | [0, 1.7, 0.8] | [6.8, 3.4, 9.2] |
| counter | new: glass display counter x -1.0..2.2, z -1.45..-0.95, top y 0.98: warm oak base, a glass top section over cards and packs on red felt, brass trim | [0.6, 0.49, -1.2] | [3.2, 0.98, 0.5] |
| box | new: the box of new stock, cardboard 50 x 24 x 11 cm, open with the four flaps folded out; NEW ARRIVALS on a strip of tape; two rows of five items standing in it (front row real scans in toploaders and the Red RGB Mew in a magnetic case, the PSA 8 Psyduck slab; back row on a 4.5 cm riser with the PSA 10 gold Mew and the CGC M Charizard); a white shop price sticker on each | [0.55, 1.04, -1.15] | [0.5, 0.11, 0.24] |
| register | new: cash register 36 x 32 cm: body, keypad, a screen on a stalk facing the owner, a cash drawer that slides out toward the owner | [1.55, 0.98, -1.3] | [0.36, 0.2, 0.32] |
| phone | new: counter phone base with a corded handset and a caller-ID screen tilted toward the owner: INCOMING 3:12 PM (773) 555-0142 | [2, 0.98, -1.25] | [0.2, 0.08, 0.18] |
| monitor | new: customer monitor 52 x 32 cm hanging from the ceiling on a pole, facing +z: four live camera views (counter, box, door, aisle), REC dot and the time | [2, 2.3, -1.45] | [0.52, 0.32, 0.04] |
| cctv | new: ceiling camera on a wall bracket: white bullet housing 26 cm, sun hood, black lens, a red REC lamp that blinks | [3.05, 3.12, 0.4] | [0.26, 0.1, 0.1] |
| shelves | new: back wall shelving x -3.3..3.3, five shelves of sealed product (booster boxes, tins, collection boxes in bright colours), OLD SKOOL TCG letters above, framed real cards, wall clock at 4:00, chalkboard TODAY WED | [0, 1.35, -3.6] | [6.6, 2.4, 0.35] |
| case | new: tall locked glass case on the left wall x -3.35..-2.9, z -2.6..-0.8, 2.0 m: oak frame, glass door hinged at z -2.6, four glass shelves with real cards on stands; brass padlock | [-3.12, 1, -1.7] | [0.45, 2, 1.8] |
| table | new: play table x -2.8..-1.6, z 1.4..2.4, top 0.75, green play mats, binders, two stools | [-2.2, 0.375, 1.9] | [1.2, 0.75, 1] |
| pegboard | new: pegboard on the right wall z 0.4..3.4 with hanging booster packs; sign SMILE! YOU ARE ON CAMERA by the camera | [3.38, 1.4, 1.9] | [0.04, 1.6, 3] |
| front | new: front wall z 5.4..5.6: shop window x -2.9..0.9, y 0.6..2.7 (painted lettering SINGLES · SLABS · SEALED, an OPEN neon, the window calendar NOV with SEP and OCT torn off), glass door x 1.4..2.4 with a brass bell | [0, 1.7, 5.5] | [6.8, 3.4, 0.2] |
| facade | new: red-brick two-storey facade x -3.6..3.6, 7.4 m: sign board OLD SKOOL TCG over the window and door, a projecting blade sign OLD SKOOL / TCG, GRAND OPENING banner under the sign, upper windows, a cornice, a wooden water tower on the roof; neighbours a laundromat (blue awning) and a café (red-and-white striped awning); far skyline | [0, 3.7, 5.6] | [7.2, 7.4, 0.3] |
| street | new: sidewalk z 5.6..8.8 (concrete slabs), curb, asphalt street z 8.8..18 with a yellow line, a lamp post, a red hydrant, a planter tree, a bike rack, a blue newspaper box, a parked yellow taxi | [0, 0, 11.8] | [24, 0.1, 12.4] |

### house
- Origin in the shared world: [80, 0, 0]. Axes: the front door in the back wall z -3; the dining table in the middle; the kitchen doorway in the right wall; the lens at +z.
- Light: day; sun az/el [30, 45]. Open camera sides: +z.
- Marks [x, z]: host_door [-1.35, -2.35]; guest_door [-0.75, -3.4]; guest_in [-0.65, -2.25]; guest_tbl [0.35, -1.25]; host_walk [2.6, -1.3].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: dining room x -3..3, z -3..4.5, 2.9 m; warm yellow walls, oak floor, a rug, a cloudy-sky window x 0.8..2.4, picture frames, a sideboard, a plant | [0, 1.45, 0.75] | [6, 2.9, 7.5] |
| door | new: front door x -1.25..-0.25 in the back wall, red, opens inward on a hinge at x -1.25; a porch, a blue sky and a hedge beyond | [-0.75, 1.05, -3] | [1, 2.1, 0.05] |
| table | new: dining table x -0.2..1.4, z -0.95..-0.15, top 0.76, white cloth; a cake on a stand, two plates, a silver tray of six spoons at the front edge | [0.6, 0.38, -0.55] | [1.6, 0.76, 0.8] |
| gift | new: one of his sealed booster boxes gift-wrapped in red paper with a gold ribbon and bow, 30 x 20 x 10 cm | [-0.75, 1.1, -3.3] | [0.3, 0.1, 0.2] |

### jacket
- Origin in the shared world: [160, 0, 0]. Axes: the open jacket lining stands in the plane z 0, facing +z (his eyes); the lens at +z.
- Light: day; sun az/el [0, 50]. Open camera sides: +z.

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| lining | new: the inside of the camel jacket: red satin lining 42 x 62 cm with stitching, the camel front edge and lapel on the left, four clear vinyl inner pockets and a small cash pocket | [0, 1.3, 0] | [0.42, 0.62, 0.02] |
| cards | real: the Red RGB Mew scan in a magnetic one-touch case, the PSA 8 Psyduck, PSA 10 gold Mew and CGC 10 M Charizard slab photos (library/slabs), each with its white OLD SKOOL price sticker; three $100 bills in the cash pocket | [0, 1.34, 0.01] | [0.2, 0.32, 0.01] |

## Cast

- **owner:** green OLD SKOOL staff tee, red cap, glasses. Items: $100 bills, phone handset, the box. Views: front, side walking.
- **man:** camel jacket, blue jeans, dark hair, no disguise. Items: three sealed booster boxes, $100 bills, his phone. Views: front, side walking.
- **kid:** yellow hoodie. Items: none. Views: front.
- **teen:** sky-blue tee, cap. Items: binder. Views: front.
- **woman:** red jacket, dark hair. Items: booster pack. Views: front.
- **teal:** teal jacket, glasses. Items: none. Views: front.
- **cop:** light-blue shirt, blue trousers, checkered cap band, gold badge. Items: notepad, pen. Views: front.

## Scenes

### S01 ★ · 0:00.0-0:07.6 · f0-f229 · "Một người đàn ông bán thẻ Pokémon cho chủ tiệm, nhận ba trăm đô, rồi đứng ngay đó, lấy trộm của chính cái tiệm vừa trả tiền cho mình."
- Gloss: A man sold Pokémon cards to a shop owner, took three hundred dollars, then, standing right there, stole from the very shop that had just paid him.
- Spine link: 1. Viewer must get: Paid with one hand, stealing with the other, without moving a step.
- In: open on the act. Out: travel (the camera pulls back out through the shop window to the street; the shop sign lands on 'tiệm').
- Set: shop. Light: day.
- Build: new: the counter, the box of new stock, the register, the three booster boxes he sold (stacked on the counter), $100 bills.
- Blocking: Man at the man mark in front of the counter facing it; owner across the counter at owner_pay, counting bills; from f100 the owner steps right to the register (owner_reg) and taps keys, eyes down.
  - man at [0.98, -0.82], front; right palm up f0-96, left arm into the box f128-157; smile -> grin.
  - owner at [1.2, -1.58], front; counts bills f0-92; steps to the register f100-122; smile.
- Action, against the words: f0 the owner's arm already over the counter with the bills; f80, f85, f89 three $100 bills slap down into the man's open palm (2 f before 'ba' f82, 'trăm' f87, 'đô' f91), each a small kick; f96-104 he closes his hand, grins; f100-122 the owner steps to the register; f121 'đứng ngay đó' his feet stay planted; f128-140 his far arm (screen left) drops into the box; f142 ('lấy') it grips the PSA 8 Psyduck by the top edge; f142-150 lifts it 15 cm clear; f150-157 it travels to his chest and slips behind the jacket on 'trộm' (f157); the box keeps the gap; f160-229 the camera pulls back and rises out through the window to the street: the OLD SKOOL TCG sign lands on 'tiệm' (f183).
- Acting: Man: polite smile -> sly grin, eyes sliding to the owner and back. Owner: friendly, busy, never looks up.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [1.52, 1.383, 3.087] | [0.78, 0.477, -1.108] | 44 | 0.04 | 0 | the cash and the box together, both men full body |
| 124 | glide 20 f | [-0.556, 1.622, 3.255] | [0.656, 0.525, -0.971] | 40 | 0.1 | 0 | his far hand and the box, the man full body |
| 162 | glide 62 f | [0.25, 2.9, 18] | [0, 3.6, 5.4] | 50 | 0 | 0 | pull out through the window: the shop sign on 'tiệm' |

- Kicks (7 f): f80 strength 0.35; f85 strength 0.35; f89 strength 0.5.
- Physics & FX: bills: light, each lands with a 2-frame flutter and lies flat on the stack. The slab: kinematic in his hand.
- Light & mood: bright day, warm shop light.
- Sound: shop murmur; three paper slaps f80/85/89 with a soft ka-ching on f91; a sly pluck f142; a cloth swish f157; a whoosh out through the window f165-200; street air.
- After-state: One more gap in the box (the Psyduck); the bills in his hand.

### S02 · 0:07.6-0:13.3 · f229-f398 · "Tiệm Old Skool TCG của Nick Bruni ở Chicago mới mở cửa được hai tháng."
- Gloss: Nick Bruni's Old Skool TCG in Chicago had been open just two months.
- Spine link: 2. Viewer must get: A brand-new shop in Chicago: the sign, the GRAND OPENING banner still up.
- In: glide. Out: travel (into the shop through the window).
- Set: shop. Light: day.
- Build: the street, the facade with the sign board, the blade sign, the GRAND OPENING banner, the window calendar (NOV, SEP and OCT torn off), the water tower, the far skyline.
- Blocking: A woman walks by on the sidewalk f240-330 (side view, left to right); the shop's customers are seen inside through the window.
  - woman at [-3.5, 5.6], side; walks by f240-330; neutral.
- Action, against the words: f229-300 slow push on the storefront; f300 title CHICAGO; f333-376 'mới mở cửa được hai tháng': glide down to the window: the GRAND OPENING banner sags a little in the breeze, the window calendar shows NOV with the stubs of SEP and OCT; f376-398 the camera travels toward the window.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 229 | open | [0.25, 2.9, 18] | [0, 3.6, 5.4] | 50 | 0.08 | 0 | the storefront, the sign and the water tower in one tall frame |
| 330 | glide 36 f | [-0.8, 1.75, 9.4] | [-0.95, 1.85, 5.4] | 44 | 0.08 | 0 | the banner and the window calendar |
| 378 | glide 20 f | [-0.3, 1.65, 6.4] | [-0.2, 1.4, 2.8] | 50 | 0 | 0 | toward the window |

- Kicks (7 f): none.
- Physics & FX: the banner: a gentle sine sag (2 cm at 0.5 Hz).
- Light & mood: bright day, blue sky with clouds.
- Sound: street ambience, a passing car f260, a bus air brake far off f320; the score enters.
- After-state: Unchanged.

### S03 · 0:13.3-0:15.2 · f398-f457 · "Chiều thứ Tư, tiệm đông khách."
- Gloss: Wednesday afternoon, the shop was busy.
- Spine link: 2. Viewer must get: Inside: busy, 4 p.m., Wednesday.
- In: glide (through the window). Out: glide.
- Set: shop. Light: day.
- Build: the interior dressed: shelves of sealed product, posters, the clock at 4:00, the TODAY WED chalkboard, the play table, the pegboard.
- Blocking: Owner at the register; kid at the counter front (kid mark) looking into the glass; teen at the play table with a binder; woman at the pegboard; teal man at the glass case.
  - kid at [-0.35, -0.72], front; browsing; neutral.
  - teen at [-2.2, 2.75], front; browsing; neutral.
  - woman at [2.75, 1.9], front; browsing; neutral.
  - teal at [-2.45, -1.45], front; browsing; neutral.
  - owner at [1.55, -1.62], front; at the register; smile.
- Action, against the words: f398-430 the camera glides in over the window ledge into the room; the clock's minute hand on 12, hour on 4; the customers browse (the teen turns a binder page f420, the woman lifts a pack f430).
- Acting: Customers: absorbed. Owner: busy, smiling.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 398 | open | [0.9, 1.724, 3.535] | [0.533, 0.798, -1.704] | 54 | 0.08 | 0 | the busy shop, the counter and the clock |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm day interior.
- Sound: shop chatter, a binder page, a register beep far.
- After-state: Unchanged.

### S04 · 0:15.2-0:18.4 · f457-f552 · "Người đàn ông gọi điện trước, hẹn mang hàng tới bán."
- Gloss: The man had phoned ahead, arranging to bring product to sell.
- Spine link: 2. Viewer must get: The phone rings with his number; then he walks in with sealed boxes.
- In: glide. Out: glide.
- Set: shop. Light: day.
- Build: the counter phone (caller ID: INCOMING 3:12 PM, (773) 555-0142), the glass door with its bell.
- Blocking: Owner at owner_phone, picks up the handset; the man comes in through the door (man_door) carrying three booster boxes against his chest and walks to the counter (arrives f590 in S05).
  - owner at [2, -1.62], front; handset to his ear f484-540; smile.
  - man at [1.9, 5.1], front walking; walks in with the boxes f514-590; smile.
- Action, against the words: f462 the phone rings (the screen lights, the handset rattles in its cradle, 2 rings); f484 the owner lifts the handset to his ear; f503 'hẹn' he nods; f512 the door opens (swings in 70 deg over 10 f), the bell jingles; f514-590 the man walks in toward the counter, boxes held at his chest.
- Acting: Owner: friendly on the phone, nods. Man: easy smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 457 | open | [2.05, 1.36, -1.66] | [2, 0.95, -1.29] | 30 | 0.06 | 0 | the caller ID: his number |
| 494 | glide 32 f | [1.895, 1.209, 0.743] | [1.895, 0.735, 5.25] | 50 | 0.06 | 0 | from the counter: the door opens, he walks in with the boxes |

- Kicks (7 f): none.
- Physics & FX: the handset: two rattles in the cradle per ring (1 mm).
- Light & mood: warm day interior.
- Sound: phone ring x2 (f462, f478); handset lift click f484; door bell jingle f512; footsteps.
- After-state: The man is inside with the boxes.

### S05 · 0:18.4-0:21.2 · f552-f635 · "Cạnh quầy thu ngân là một hộp hàng mới về."
- Gloss: Beside the register sat a box of newly arrived stock.
- Spine link: 3. Viewer must get: The open box of priced cards right beside the register.
- In: glide. Out: glide.
- Set: shop. Light: day.
- Build: the box of new stock with ten items and price stickers.
- Blocking: Owner hangs up and goes back to the register; the man arrives at the man mark f590 and sets the stack of boxes on the counter (stack) f590-600.
  - man at [0.98, -0.82], front; sets the stack down f590-600; smile.
- Action, against the words: f552-600 the camera glides along the counter from the register to the box; f600-635 push in: two rows of real cards, each with its sticker ($4,000 on the Red RGB Mew); f592 the stack lands on the counter with a soft thud.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 552 | open | [1.25, 1.42, -0.15] | [1.4, 1.08, -1.3] | 40 | 0.06 | 0 | the register |
| 578 | glide 40 f | [0.62, 1.36, -0.3] | [0.62, 1.08, -1.16] | 38 | 0.12 | 0 | the box beside the register, the stickers |

- Kicks (7 f): none.
- Physics & FX: the stack: set down, a 1 cm settle.
- Light & mood: warm.
- Sound: handset hang-up click f556; a soft cardboard thud f592; a glassy shimmer on the push f605.
- After-state: The stack sits on the counter right of the box.

### S06 · 0:21.2-0:24.1 · f635-f723 · "Tay anh ta thò vào. Một lá biến mất."
- Gloss: His hand went in. One card vanished.
- Spine link: 3. Viewer must get: While the owner serves someone else, his hand dips in and the Red RGB Mew is gone; the gap stays.
- In: glide. Out: glide.
- Set: shop. Light: day.
- Build: as before; the woman now at the register paying (woman_reg).
- Blocking: Man at the man mark, looking around the shop; owner at the register facing the woman.
  - man at [0.98, -0.82], front; left arm into the box f638-700; whistle.
  - owner at [1.55, -1.62], front; serving; smile.
  - woman at [1.9, -0.78], front; paying; smile.
- Action, against the words: f638-650 his far arm (screen left) slides over the box rim; f651 ('thò vào') it dips in; f672 grips the Red RGB Mew's case; f672-684 lifts it out; f684-700 to his chest and behind the jacket ('biến mất' f692-704); the slot is empty from f684.
- Acting: Man: whistling innocence, eyes up at the ceiling. Owner: chatting with the woman, eyes on her.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 635 | open | [0.131, 1.523, 3.664] | [1.133, 0.499, -1.05] | 44 | 0.08 | 0 | the man and the box, the owner busy with the woman |

- Kicks (7 f): f651 strength 0.25.
- Physics & FX: the case: kinematic in his hand.
- Light & mood: warm.
- Sound: Suspicious Sound (meme) f648; a cloth swish f700.
- After-state: One gap in the front row (the Red RGB Mew).

### S07 · 0:24.1-0:26.7 · f723-f800 · "Rồi anh ta bán hàng cho Bruni, cầm tiền."
- Gloss: Then he sold his product to Bruni and took the money.
- Spine link: 3. Viewer must get: The deal: the drawer pops, three bills into his palm.
- In: glide. Out: glide.
- Set: shop. Light: day.
- Build: the register drawer, $100 bills.
- Blocking: Woman leaves (walks off right f723-760); owner steps from the register to owner_pay f730-745.
  - owner at [1.2, -1.58], front; drawer f748, bills f776-786; smile.
  - man at [0.98, -0.82], front; palm up f770-790; smile.
- Action, against the words: f748 the owner taps the register; f752 the drawer shoots out with a ka-ching; f756-768 he takes three bills; f776, f781, f786 he slaps them one by one into the man's palm ('cầm tiền' f776-789).
- Acting: Owner: pleased with the deal. Man: friendly nod.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 723 | open | [2.437, 1.28, 3.049] | [1.211, 0.495, -1.228] | 42 | 0.12 | 0 | the deal across the counter, the register, the bills |

- Kicks (7 f): f752 strength 0.4.
- Physics & FX: the drawer: slides 16 cm in 3 f and bounces 1 cm.
- Light & mood: warm.
- Sound: register key f748; Kaching (meme) f752; three paper slaps f776/781/786.
- After-state: He holds $300; the drawer is shut again (f794).

### S08 ★ · 0:26.7-0:29.8 · f800-f895 · "Xong quay lại cái hộp, thêm ba lá nữa."
- Gloss: Then he turned back to the box and took three more.
- Spine link: 3. Viewer must get: One, two, three slabs into his jacket; four gaps now.
- In: glide. Out: through-object 8 f (push into his jacket, dissolve into the lining).
- Set: shop. Light: day.
- Build: as before.
- Blocking: Owner turns away to shelve the booster boxes (carries the stack to the back shelves, f805-890, side view walking); the man stays at the man mark.
  - man at [0.98, -0.82], front; three lifts f846-885; smirk.
  - owner at [1.55, -1.62], side walking; shelves the stack f805-890; neutral.
- Action, against the words: f804-815 he tucks the cash into his jacket; f822 ('quay lại') turns his eyes to the box; f846-856 the Psyduck slab out, into the jacket; f863-873 the gold Mew; f875-885 the M Charizard ('thêm ba lá nữa': f849, f866, f878); each lift 12 cm, each into the jacket; f886-895 the camera pushes into his jacket.
- Acting: Man: quick and calm, a tiny smirk. Owner: back turned.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 800 | open | [0.181, 1.468, 3.478] | [0.648, 0.518, -0.965] | 40 | 0.12 | 0 | him and the box, the owner going to the shelves |
| 882 | glide 13 f | [0.92, 1.3, -0.3] | [0.94, 1.25, -0.84] | 34 | 0 | 0 | into his jacket |

- Kicks (7 f): f849 strength 0.2; f866 strength 0.2; f878 strength 0.3.
- Physics & FX: the slabs: kinematic in his hand.
- Light & mood: warm.
- Sound: three quick plucks f849/866/878 rising; a swish each into the jacket.
- After-state: Four gaps in the box; his jacket holds four cards and $300.

### S09 ★ · 0:29.8-0:37.3 · f895-f1118 · "Một lá Mew kỷ niệm ba mươi năm giá bốn nghìn đô, một lá Psyduck chấm điểm giá một nghìn tám, thêm Mew và Charizard."
- Gloss: A 30th-anniversary Mew worth four thousand dollars, a graded Psyduck worth eighteen hundred, plus a Mew and a Charizard.
- Spine link: 4. Viewer must get: The four real cards in his jacket, each with the shop's price sticker.
- In: through-object 8 f. Out: glide.
- Set: jacket. Light: day.
- Build: the jacket lining with four clear pockets: Red RGB Mew (magnetic case, sticker $4,000), PSA 8 Psyduck ($1,800), PSA 10 gold Mew ($150), CGC 10 M Charizard ($750); three $100 bills in the cash pocket.
- Blocking: Nobody (his view into his own jacket).
- Action, against the words: f895-980 the Red RGB Mew fills the frame ('Mew kỷ niệm ba mươi năm' f911-940; the sticker $4,000 on 'bốn nghìn đô' f962-975); f982-1062 glide to the Psyduck slab (PSA 8 label, sticker $1,800 on f1045-1056); f1066-1118 glide to the gold Mew and the M Charizard side by side ('thêm Mew và Charizard' f1068-1099); a white gleam crosses each case as it arrives.
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 895 | open | [-0.055, 1.43, 0.36] | [-0.055, 1.43, 0] | 30 | 0.06 | 0 | the Red RGB Mew, $4,000 |
| 982 | glide 30 f | [0.055, 1.43, 0.4] | [0.055, 1.43, 0] | 30 | 0.06 | 0 | the PSA 8 Psyduck, $1,800 |
| 1064 | glide 32 f | [0, 1.255, 0.68] | [0, 1.255, 0] | 30 | 0.04 | 0 | the gold Mew and the M Charizard (each 41% of the width) |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: the jacket's own warm light; each case sharp and bright.
- Sound: a soft sparkle per card (f905, f990, f1070); a price 'tick' on each sticker (f965, f1048).
- After-state: Unchanged.

### S10 · 0:37.3-0:39.6 · f1118-f1188 · "Tổng cộng sáu nghìn bảy trăm đô."
- Gloss: Six thousand seven hundred dollars in total.
- Spine link: 4. Viewer must get: All four cards together: $6,700.
- In: glide. Out: dissolve 8 f.
- Set: jacket. Light: day.
- Build: as S09.
- Blocking: Nobody.
- Action, against the words: f1118-1150 pull back to all four cards and the bills; f1124 title $6,700 (lands on 'sáu nghìn bảy trăm' f1145-1162).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1118 | open | [0, 1.4, 0.9] | [0, 1.4, 0] | 30 | 0.06 | 0 | all four cards under the $6,700 title |

- Kicks (7 f): f1146 strength 0.4.
- Physics & FX: none.
- Light & mood: warm.
- Sound: a cash-register ka-ching f1146 on the title.
- After-state: Unchanged.

### S11 · 0:39.6-0:44.5 · f1188-f1336 · "Chủ tiệm đứng cách đó vài bước. Camera treo ngay đó, ai nhìn cũng thấy."
- Gloss: The owner stood a few steps away. A camera hung right there, in plain sight.
- Spine link: 5. Viewer must get: The owner was a few floor tiles away; a camera with a red REC lamp, and a monitor showing the box.
- In: dissolve 8 f. Out: glide.
- Set: shop. Light: day.
- Build: the ceiling camera (REC lamp), the customer monitor with four views (the box view shows him at the counter).
- Blocking: Man at the man mark (the S08 moment, cards already gone); owner at the register.
  - man at [0.98, -0.82], front; standing at the box; smirk.
  - owner at [1.55, -1.62], front; at the register; neutral.
- Action, against the words: f1188-1243 high wide: the owner at the register, the man at the box, the floor tiles between them ('vài bước' f1226-1236); f1246-1290 glide up to the ceiling camera: its REC lamp blinks (15 f on / 15 f off); f1295-1323 glide to the monitor: four views, the counter view shows the man and the box ('ai nhìn cũng thấy').
- Acting: Owner: busy at the register. Man: casual.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1188 | open | [2.099, 2.702, 2.159] | [1.257, 0.355, -1.218] | 50 | 0.06 | 0 | a few steps apart, the floor tiles between them |
| 1248 | glide 42 f | [1.85, 2.3, 1.95] | [3.02, 3.08, 0.38] | 36 | 0.08 | 0 | the ceiling camera, REC |
| 1294 | glide 26 f | [1.75, 2.1, 0.15] | [2, 2.28, -1.45] | 34 | 0.08 | 0 | the monitor: anyone can see |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm.
- Sound: a low drone; Camera shutter (meme) f1262 as the REC lamp comes into frame; a monitor hum.
- After-state: Unchanged.

### S12 · 0:44.5-0:49.8 · f1336-f1495 · "Khoan, ai lại đi trộm trước mặt chủ, dưới ống kính, sau khi vừa gọi điện hẹn hẳn hoi?"
- Gloss: Wait, who steals right in front of the owner, under the lens, after phoning ahead to book the visit?
- Spine link: 5. Viewer must get: Three reasons he should have been caught: the owner's face, the lens, his own number.
- In: glide. Out: dissolve 8 f.
- Set: shop. Light: day.
- Build: as before.
- Blocking: Man at the man mark; owner at owner_left, facing the man across the counter.
  - man at [0.98, -0.82], front; frozen; smirk.
  - owner at [0.6, -1.58], front; standing; smile.
- Action, against the words: f1336 'Khoan': everything freezes (the customers stop mid-move), a record scratch; f1351-1397 'trước mặt chủ': the owner's face across the counter, a metre from the box; f1405-1428 'dưới ống kính': the view from right under the ceiling camera down onto the man and the box (the camera's hood in the top of frame); f1432-1484 'gọi điện hẹn hẳn hoi': the caller-ID screen, his number.
- Acting: Owner: friendly, oblivious. Man: frozen mid-smirk.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1336 | open | [1.75, 2.1, 0.15] | [2, 2.28, -1.45] | 32 | 0 | 0 | hold: the freeze |
| 1350 | glide 38 f | [1.237, 1.282, 3.288] | [0.62, 0.499, -1.108] | 42 | 0.1 | 0 | right in front of the owner |
| 1402 | glide 24 f | [2.75, 2.95, 0.25] | [0.85, 1.05, -1] | 44 | 0.08 | 0 | under the lens |
| 1436 | glide 26 f | [2.05, 1.36, -1.66] | [2, 0.95, -1.29] | 30 | 0.08 | 0 | his own number on the caller ID |

- Kicks (7 f): f1336 strength 0.6.
- Physics & FX: none.
- Light & mood: warm; the freeze holds.
- Sound: record scratch + Huh (meme) f1336; three soft hits on 'chủ' f1397, 'kính' f1422, 'hoi' f1478.
- After-state: Unchanged.

### S13 · 0:49.8-0:54.1 · f1495-f1624 · "Bạn thấy đấy, chủ tiệm canh hàng, chứ không canh người vừa bán hàng cho mình."
- Gloss: You see, the owner watches the goods, not the person who just sold to him.
- Spine link: 6. Viewer must get: His eyes follow the kid's hands at the glass; to the seller he gives a smile and a handshake.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: shop. Light: day.
- Build: as before; calm.
- Blocking: Owner at owner_left; kid at the kid mark bending to the glass; man at the man mark.
  - owner at [0.6, -1.58], front; eyes on the kid f1500-1560, handshake f1590-1615; stern -> smile.
  - kid at [-0.35, -0.72], front; bends to the glass; neutral.
  - man at [0.98, -0.82], front; handshake; smile.
- Action, against the words: f1500-1560 the kid leans to the glass with a finger near it; the owner's eyes narrow and follow the kid's hand ('canh hàng' f1545); f1563 he turns his eyes to the man and smiles; f1590-1615 they shake hands across the counter (2 shakes).
- Acting: Owner: stern on the kid -> warm on the seller. Kid: curious. Man: friendly.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1495 | open | [0.314, 1.04, 3.121] | [0.314, 0.455, -1.04] | 46 | 0.06 | 0 | calm wide: the owner between the kid and the seller |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm, calm.
- Sound: a soft music-box theme; a suspicious 'hmm' sting f1545; a warm chord on the handshake f1590.
- After-state: Unchanged.

### S14 · 0:54.1-0:56.9 · f1624-f1708 · "Người đó giống như khách đến chơi nhà mang theo quà."
- Gloss: He's like a guest who comes to visit bringing a gift.
- Spine link: 6. Viewer must get: A guest at the door with a gift, welcomed in.
- In: dissolve 8 f. Out: glide.
- Set: house. Light: day.
- Build: the house: the front door, the porch outside, the dining room; the gift (a booster box wrapped in red with a gold bow).
- Blocking: Host (the owner's look) by the door at host_door; guest (the man's look) on the porch at guest_door holding the gift.
  - owner at [-1.35, -2.35], front; opens the door f1628, takes the gift f1688; grin.
  - man at [-0.75, -3.4], front; holds the gift; steps in f1650-1680; smile.
- Action, against the words: f1628-1642 the host opens the door (it swings in 80 deg); the guest stands on the porch with the gift held out; f1650-1680 he steps in to guest_in; f1688-1698 the host takes the gift ('quà' f1694), beaming.
- Acting: Host: delighted. Guest: charming.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1624 | open | [-0.813, 1.071, 1.602] | [-0.813, 0.597, -2.917] | 46 | 0.08 | 0 | the door, the guest with the gift |

- Kicks (7 f): none.
- Physics & FX: the door: hinged, eased open with a small bounce.
- Light & mood: warm home, daylight through the window.
- Sound: a doorbell ding-dong f1624; the door creak f1630; a happy 'ooh' chord f1694.
- After-state: The host holds the gift.

### S15 · 0:56.9-0:58.8 · f1708-f1765 · "Chẳng ai đi theo khách để đếm thìa."
- Gloss: Nobody follows a guest around counting the spoons.
- Spine link: 6. Viewer must get: The host turns his back; the spoon tray by the guest ends with one empty slot.
- In: glide. Out: dissolve 8 f.
- Set: house. Light: day.
- Build: the table with the cake, the plates and the spoon tray (six spoons).
- Blocking: Guest at guest_tbl behind the table; host walks away to the kitchen doorway (side view, to the right) carrying the gift, f1708-1750.
  - man at [0.35, -1.25], front; spoon f1736-1757; smile.
  - owner at [2.6, -1.3], side walking; walks to the kitchen; smile.
- Action, against the words: f1708-1750 the host walks off toward the kitchen, never looking back; f1736-1748 the guest's arm reaches the tray and lifts a spoon; f1750-1757 it goes into his jacket ('đếm thìa' f1750-1755); the tray keeps one empty slot.
- Acting: Guest: angelic smile. Host: humming, happy.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1708 | open | [0.035, 1.412, 2.998] | [0.31, 0.573, -0.94] | 42 | 0.12 | 0 | the guest and the spoon tray, the host walking away |

- Kicks (7 f): f1755 strength 0.2.
- Physics & FX: the spoon: kinematic.
- Light & mood: warm.
- Sound: a happy hum; a tiny spoon clink f1745; Hehe Boiiiiiii (meme, soft) f1756.
- After-state: One empty slot in the spoon tray.

### S16 · 0:58.8-1:04.9 · f1765-f1947 · "Chính Bruni cũng nhận: bình thường, anh không bao giờ để một hộp thẻ giá trị như thế nằm ngoài."
- Gloss: Bruni himself admits: normally he would never leave such a valuable box of cards out.
- Spine link: 6. Viewer must get: The owner looks at the four gaps, then carries the box to the locked glass case where it belongs.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: shop. Light: day.
- Build: the box with four gaps; the glass case with its hinged door and padlock.
- Blocking: Owner at owner_left behind the box; then he walks with the box around the left end of the counter to case_stand.
  - owner at [0.6, -1.58], front then side walking; head scratch, lifts the box, walks to the case; sad.
- Action, against the words: f1765-1812 he looks down at the four gaps, scratches his head; f1830-1842 he lifts the box with both arms; f1842-1895 he walks left behind the counter, around its end and to the case (side view); f1896-1906 the case door swings open; f1906-1918 he sets the box on the shelf; f1920 the door shuts; f1926 the padlock snaps shut ('ngoài' f1928).
- Acting: Owner: sheepish, a sigh.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1765 | open | [0.45, 1.45, 0.25] | [0.55, 1.15, -1.25] | 40 | 0.08 | 0 | the four gaps, the owner behind |
| 1832 | glide 40 f | [2.673, 1.08, -1.697] | [-1.948, 0.265, -1.697] | 58 | 0.06 | 0 | he carries the box to the case |

- Kicks (7 f): f1926 strength 0.3.
- Physics & FX: the case door: hinged at its back edge, swings 100 deg and back; the padlock shackle snaps down 1 cm.
- Light & mood: warm.
- Sound: a sigh; footsteps; the case door squeak f1896, click f1920; padlock snap f1926.
- After-state: The box is locked in the glass case (four gaps).

### S17 · 1:04.9-1:09.6 · f1947-f2089 · "Nhưng niềm tin có một nhược điểm: nó không có camera. Tiệm thì có."
- Gloss: But trust has one weakness: it has no camera. The shop does.
- Spine link: 7. Viewer must get: The handshake (trust) — cut — the camera lens recording.
- In: dissolve 8 f. Out: glide.
- Set: shop. Light: day.
- Build: as before.
- Blocking: Owner at owner_left and the man at the man mark, shaking hands across the counter.
  - owner at [0.6, -1.58], front; handshake; smile.
  - man at [0.98, -0.82], front; handshake; smile.
- Action, against the words: f1950-2040 the handshake, slow pumps every 20 f, both smiling; slow push; f2047 hard cut on 'Tiệm' to the ceiling camera lens, the REC lamp blinking on.
- Acting: Owner: warm. Man: warm.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1947 | open | [0.795, 1.007, 3.518] | [0.795, 0.511, -1.2] | 40 | 0.06 | 0 | the handshake: trust |
| 2047 | cut | [2.6, 2.82, -0.05] | [3.05, 3.1, 0.4] | 32 | 0.2 | 0 | the shop's camera |

- Kicks (7 f): f2047 strength 0.5.
- Physics & FX: none.
- Light & mood: warm; the cut is crisp.
- Sound: warm pad; Camera shutter (meme) on the cut f2047; a REC beep.
- After-state: Unchanged.

### S18 · 1:09.6-1:11.1 · f2089-f2132 · "Bruni báo cảnh sát ngay,"
- Gloss: Bruni called the police right away,
- Spine link: 7. Viewer must get: The owner on the phone to the police.
- In: glide. Out: dissolve 6 f (the officer arrives).
- Set: shop. Light: day.
- Build: as before.
- Blocking: Owner at owner_phone, the handset at his ear.
  - owner at [2, -1.62], front; handset to his ear; stern.
- Action, against the words: f2092-2104 he lifts the handset and dials; f2113 'cảnh sát' he speaks, urgent.
- Acting: Owner: urgent, serious.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2089 | open | [2.706, 1.263, 2.571] | [1.989, 0.535, -1.495] | 42 | 0.08 | 0 | the owner calls the police |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm.
- Sound: three dial beeps f2096-2102; a ringing tone.
- After-state: Unchanged.

### S19 · 1:11.1-1:13.6 · f2132-f2207 · "đưa luôn số điện thoại người đàn ông đã gọi tới."
- Gloss: and handed over the number the man had called from.
- Spine link: 7. Viewer must get: He shows the officer the caller ID; she writes the number down.
- In: dissolve 6 f. Out: dissolve 8 f.
- Set: shop. Light: day.
- Build: the officer's notepad: the number written stroke by stroke.
- Blocking: Officer at the cop mark in front of the counter; owner at owner_phone, pointing at the phone.
  - cop at [1.75, -0.8], front; writes on the notepad f2160-2196; neutral.
  - owner at [2, -1.62], front; points at the phone; stern.
- Action, against the words: f2140-2160 the owner points at the caller-ID screen; f2160-2196 the officer writes (773) 555-0142 on her notepad ('số điện thoại' f2151-2162, 'gọi tới' f2186-2193); f2180-2207 glide to the notepad.
- Acting: Owner: firm. Officer: businesslike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2132 | open | [2.952, 1.281, 3.135] | [1.869, 0.491, -1.21] | 42 | 0.08 | 0 | the owner points, the officer writes |
| 2178 | glide 24 f | [1.72, 1.42, -0.25] | [1.78, 1.13, -0.74] | 32 | 0.08 | 0 | the number on her notepad |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm.
- Sound: pen scratches f2160-2196; a firm low note.
- After-state: The number is on the notepad.

### S20 · 1:13.6-1:16.7 · f2207-f2300 · "Hắn ra về với bốn lá bài và ba trăm đô."
- Gloss: He walked away with four cards and three hundred dollars.
- Spine link: 7. Viewer must get: Out on the sidewalk, smug: pats the jacket, fans the $300.
- In: dissolve 8 f (back to the afternoon: he leaves). Out: travel (the camera flies back into the shop through the door glass).
- Set: shop. Light: day.
- Build: the street.
- Blocking: Man comes out of the door (man_door outside) and walks toward the lens to man_walk.
  - man at [1.15, 6.8], front walking then standing; pats the jacket f2248-2262, fans the cash f2268-2290; grin.
- Action, against the words: f2208 the door opens, bell; f2210-2246 he walks out to man_walk (front view walking); f2248-2262 he pats his jacket twice ('bốn lá bài' f2240-2256); f2268-2290 he fans the three $100 bills by his face ('ba trăm đô' f2274-2285).
- Acting: Man: smug grin.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2207 | open | [1.176, 1.101, 10.84] | [1.508, 0.768, 6.099] | 44 | 0.06 | 0 | he walks out toward us, the shop door behind |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright day, blue sky.
- Sound: door bell f2208; street; a smug brass bounce f2280.
- After-state: He stands on the sidewalk with his loot.

### S21 ★ · 1:16.7-1:21.3 · f2300-f2440 · "Và để lại gương mặt trên camera, cùng số điện thoại của chính mình."
- Gloss: And left behind his face on camera, and his very own phone number.
- Spine link: 7. Viewer must get: Inside, the monitor holds his face; outside, his own phone rings and he freezes.
- In: travel. Out: end.
- Set: shop. Light: day.
- Build: the monitor shows one frozen view: his face at the counter, REC, NOV 18 4:07 PM; his own phone (cast prop) with a ringing screen.
- Blocking: Man at man_walk on the sidewalk.
  - man at [1.15, 6.8], front; phone out f2380, freeze f2398; grin -> shock.
- Action, against the words: f2300-2340 the camera flies past him through the door glass to the monitor: his face frozen on it ('gương mặt trên camera' f2327-2350); f2353-2392 the camera flies back out through the door to him; f2371 ('số điện thoại') his own phone rings in his jacket; f2380 he pulls it out; f2398 he looks at it and freezes ('chính mình' f2396-2410): shock, a sweat drop; hold to the end.
- Acting: Man: grin -> shock.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2300 | open | [1.85, 2.08, 0.2] | [2, 2.28, -1.45] | 32 | 0.08 | 0 | his face on the monitor |
| 2350 | glide 50 f | [0.845, 0.842, 11.16] | [1.15, 0.536, 6.8] | 40 | 0.12 | 0 | his own phone rings |

- Kicks (7 f): f2398 strength 0.6.
- Physics & FX: the phone: buzz jitter 2 mm while ringing.
- Light & mood: bright day.
- Sound: Yo Phone Ringing (meme) f2371-2420; a record-stop f2398; the theme's last note.
- After-state: End on his frozen face and the ringing phone.

