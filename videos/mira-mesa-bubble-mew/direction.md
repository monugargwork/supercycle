# Mira Mesa (Bubble Mew): direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/mira-mesa-bubble-mew/plan.json` (0 errors; the warnings are feet touching the caption band and the S01 whip after the runner).
All positions are set-local metres (y up); a set's world position is its origin plus the local position. 30 fps, 2510 frames (VO ends f2476). Two places: the gym (the Mira Mesa High card show, with the school front, plaza and parking lot outside it in the same set, so the camera can pass through the doors) and the beach promenade (the phone analogy).
Character shots are fitted by `scripts/plan_fit.py`: the closest lens at the chosen view direction that keeps every listed subject (heads at the crown, feet on the floor) inside the safe area with a 5 % margin.

## Tone
A gentle true-crime story with a hopeful end. Generic cartoon people, no likenesses (the family is never named or drawn after the real people; the thief was never described). The sedan is a generic black sedan (the police photos are not ours). No arrest is shown, because none was reported. Nobody sits; every gag is one simple motion.

## Quality bar (25 Nov 2026)
No blur, no shadows, bright palettes (maple floor, cream walls, red trim, sky-blue cloth, blue sky with clouds in every window and outdoor shot), dressed sets (ten booths with real cards, banners, scoreboard, bleachers), medium-wide cameras with every character head-to-feet in frame, the real Bubble Mew scan large and sharp.

## Visual laws
- Trust is the open hand: the father's palm stays open over the table after the card is gone.
- The loss stays: the empty easel with its swinging tag in every booth shot after S05 (until the replica, S16).
- Attention is eye-line: in the analogy every eye is on the phone, none on its holder.

## Transitions
Three hard cuts (S09, the freeze on "Khoan"; S12, the phone POV; S18, the far lot). Travels: S02 in through the doors, S08 out through them, S14 across the hall. Dissolves for the time jumps (S01 to the morning, S10, S13, S19) and the move to the beach (S11).

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f40 | f100 | $3,000+ |
| f268 | f330 | SAN DIEGO |
| f470 | f528 | BUBBLE MEW |

## Sets

### gym
- Origin in the shared world: [0, 0, 0]. Axes: centre court at the origin; the front wall with the double doors at z 8.0..8.3 opens onto the plaza and the parking lot (+z); the back wall (scoreboard) at z -7; bleachers on the left wall (-x).
- Light: day; sun az/el [-30, 50]. Open camera sides: +z outside; inside every side (the room is 18 x 15 m).
- Marks [x, z]: dad [-0.38, 0.6]; girl [0.42, 0.72]; stranger [-0.58, 1.34]; girl_front [0.42, 1.55]; woman [-1, 1.4]; door_in [2, 7.55]; door_out [2, 8.7]; dad_out [3, 11.4]; thief_lot [2.9, 22]; guard [2, 7.35]; cop [-1.6, 7.75]; shop1 [-4.2, 1.6]; shop2 [2.1, -2.35]; shop3 [-2.6, -2.35].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: gym x -9..9, z -7..8, 6.5 m: warm maple floor in 9 cm boards with painted court lines (red centre circle with MM, white lines, a blue key at each end), cream block walls with a red band at 1.2 m, a row of high windows with blue sky and clouds on both side walls (y 4.4..5.8), a ceiling with steel trusses and round lights | [0, 3.25, 0.5] | [18, 6.5, 15] |
| back wall | new: scoreboard (HOME 0 GUEST 0, red digits on a dark-green face, 3.2 x 1.4 m) at y 4.6, a MIRA MESA banner (red with cream letters) over it, a CARD SHOW TODAY banner (sky blue) at y 2.6, a basketball backboard raised high (4.0 m) on the left | [0, 3.5, -6.95] | [16, 4, 0.1] |
| bleachers | new: folded wooden bleachers against the left wall x -9..-7.8, z -5.5..5.5, 2.6 m tall: seven stepped tiers of warm oak with red risers (folded, nobody sits) | [-8.4, 1.3, 0] | [1.2, 2.6, 11] |
| booth | new: their vendor table x -0.9..0.9, z 0.75..1.25, top 0.76 (standing height table, folding steel legs), a sky-blue cloth with a skirt to the floor; on it: a glass-top display tray x -0.55..0.15 with ten real cards on red felt, the wooden easel at x 0.34 holding the Bubble Mew in a magnetic one-touch case with a white price tag $3,200 on a string, a stand of three top-loaders at the front-left corner (by the customer's hip), a red cash tin, a cardboard tent sign FIRST SHOW! (hand-lettered) | [0, 0.38, 1] | [1.8, 0.76, 0.5] |
| booths | new: nine more vendor tables (same build, cloths in orange, green, red, teal, yellow) in rows at z 1.0, -3.0 and -5.6, each with a display tray of real cards, a banner sign on a pole (CARDS, SLABS, SEALED, VINTAGE, BINDERS), binders and booster boxes | [0, 0.38, -2.5] | [16, 0.76, 7] |
| doors | new: double doors x 1.0..3.0 in the front wall, 2.4 m, red steel leaves with a tall glass window each and a chrome push bar, hinged at x 1.0 and x 3.0, swinging outward on spring hinges (a damped swing that settles); the bright plaza beyond | [2, 1.2, 8.15] | [2, 2.4, 0.06] |
| board | new: cork notice board 1.6 x 1.0 m in an oak frame on the front wall inside, x -3.3..-1.7, with school notices (BAKE SALE FRI, CLUB FAIR) and, from S14, the police flyer HAVE YOU SEEN THIS CAR? with a photo-style print of a black sedan and SDPD | [-2.5, 1.75, 7.98] | [1.6, 1, 0.04] |
| rules | new: an A-frame easel board 0.7 x 1.0 by the doors at x 3.9, z 7.0 (from S15): VENDOR RULES / 1 ONE CARD AT A TIME / 2 HOLD THE EDGE / 3 STAFF NEARBY | [3.9, 0.9, 7] | [0.7, 1, 0.5] |
| facade | new: the gym's front outside z 8.3: cream stucco, a red trim band at 3.0 m, MIRA MESA HIGH SCHOOL in red letters over the doors, a CARD SHOW TODAY banner on the wall, a flagpole, two palms, flower beds; side school wings with red-tile roofs either side, hills far behind | [0, 3, 8.3] | [24, 6.5, 0.2] |
| lot | new: the plaza (concrete, z 8.3..12), a curb, the parking lot (asphalt, white bay lines, z 12..36) with bright parked cars (red, yellow, sky blue, white) and the black sedan in a bay at x 8.5, z 20 (glossy black with highlights, tinted windows), a light pole, hills and blue sky with clouds | [0, 0, 22] | [40, 0.1, 28] |

### beach
- Origin in the shared world: [120, 0, 0]. Axes: the promenade runs along x; the rail at z -2.25 faces the ocean (-z); the pier on the right going out to sea; the lens at +z.
- Light: day; sun az/el [25, 52]. Open camera sides: all.
- Marks [x, z]: mum [-0.72, -1.45]; dad2 [-0.05, -1.55]; kid2 [0.58, -1.4]; stranger2 [0.08, 2].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| promenade | new: a seaside promenade x -9..9, z -2..6: warm concrete pavers, a white steel rail at z -2.25 (posts every 1.5 m, two rails, top at 1.05), palms, a striped ice-cream cart, a bench-free planter wall; sand below the rail, then the blue ocean with white wave lines and a wooden pier on posts at x 5.5..8.5 | [0, 0, 2] | [18, 1.1, 8] |
| phone | new: the family's phone, 7.4 x 15 cm, coral case; in the POV shot the camera sits just behind it: the bezel frames the shot, the screen is open (the real scene seen through it) with a camera UI: grid, a yellow focus square on the faces, a white shutter button | [0.08, 1.5, 1.72] | [0.074, 0.15, 0.01] |

## Cast

- **dad:** royal-blue and white baseball tee, red cap, glasses, khaki shorts. Items: the Bubble Mew case. Views: front, side walking (limp).
- **girl:** yellow hoodie, blue jeans, dark hair. Items: top-loaders, the replica, her sign. Views: front.
- **stranger:** maroon hoodie, blue jeans, blue cap. Items: the Bubble Mew case. Views: front, side running.
- **woman:** red jacket, dark hair. Items: the replica case. Views: front.
- **vendors:** bright tees: teal, orange, green, pink. Items: top-loaders. Views: front.
- **cop:** light-blue shirt, blue trousers, cap, gold badge. Items: the flyer. Views: front.
- **guard:** yellow SECURITY shirt, blue trousers, cap. Items: none. Views: front, side walking.
- **mum:** pink top, sun hat colours. Items: none. Views: front.
- **dad2:** sky-blue holiday shirt, sunglasses on his head. Items: the phone. Views: front, side walking.
- **kid2:** green tee. Items: none. Views: front.
- **stranger2:** orange tee, sunglasses. Items: the phone. Views: front.

## Scenes

### S01 ★ · 0:00.0-0:07.5 · f0-f224 · "Một người đàn ông cầm lá bài hơn ba nghìn đô trên tay, rồi chạy mất, ngay trong buổi bán thẻ đầu tiên của hai cha con."
- Gloss: A man held a card worth over three thousand dollars in his hand, then ran off, right at the father and daughter's first card sale.
- Spine link: 1. Viewer must get: A stranger admiring the card at their table, then gone in a flash toward the doors; father and daughter left staring.
- In: open on the act. Out: dissolve 10 f (time jump back to the morning).
- Set: gym. Light: day.
- Build: the gym, their booth (easel empty, the case in his hands), the top-loader stand, the double doors.
- Blocking: Stranger at the stranger mark in front of the table, holding the case up at eye level; dad behind the table at the dad mark with his right palm open over the table (waiting to get it back); girl at the girl mark. From f103 the stranger runs to the doors (door_in) and out (door_out).
  - stranger at [-0.58, 1.34], front then side running; case held up f0-102; sprint f103-170; smile -> grin.
  - dad at [-0.38, 0.6], front; right palm open over the table; smile -> shock.
  - girl at [0.42, 0.72], front; standing by the tent sign; smile -> shock.
- Action, against the words: f0-96 he tilts the case to the light, admiring (two small tilts, f20 and f60); dad's palm stays open; f44 title $3,000+ ('hơn ba nghìn đô' f44-67); f100 his eyes slide to the doors; f103 ('chạy' f103) he spins and bolts: one-frame turn to the side view, a sprint at 4.5 m/s toward the doors with speed lines; his hip clips the table's left corner as he spins: the three top-loaders slide off and fall to the floor (f106-124) and lie there; f185 he hits the doors' push bar, they fly open; f137-183 'ngay trong buổi bán thẻ đầu tiên của hai cha con': the camera settles back on dad and girl behind their table, the FIRST SHOW! sign between them, faces from smile to shock (f150).
- Acting: Stranger: polite admiring smile -> sly glance -> sprint. Dad: proud smile, palm out -> frozen. Girl: beaming -> shock.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [2.505, 1.814, 4.821] | [-0.118, 0.986, 0.933] | 44 | 0.05 | 0 | the stranger with the card at their table, all three full body |
| 104 | glide 26 f | [-0.9, 1.6, -1.8] | [1.6, 1, 6] | 50 | 0 | 0 | whip after him: the run to the doors |
| 150 | glide 30 f | [0.931, 1.469, 6.381] | [-0.05, 0.675, 0.819] | 42 | 0.12 | 0 | father and daughter at their first booth, faces falling |

- Kicks (7 f): f103 strength 0.5; f185 strength 0.35.
- Physics & FX: the three top-loaders: knocked off the corner at f106 with ~1.2 m/s, they tip and fall 0.76 m (light, a small flutter), land flat by f124 and stay. The doors: spring hinges, open to 80 deg and swing back with a damped swing.
- Light & mood: bright midday through the high windows.
- Sound: hall murmur; a sly pluck f100; a whoosh + Gogogogogo-style run cue f103; toploader clatter f118-124; the doors' bang f185; a suspense sting f150.
- After-state: The top-loaders lie on the floor; the easel is empty.

### S02 · 0:07.5-0:14.3 · f224-f428 · "Cô bé mười hai tuổi, ở San Diego, lần đầu bày sạp ở một hội thẻ tại trường trung học Mira Mesa."
- Gloss: The 12-year-old girl in San Diego was setting up her first booth at a card show at Mira Mesa High School.
- Spine link: 2. Viewer must get: That morning: a school in sunny San Diego, a CARD SHOW banner; inside, father and daughter setting out their first booth.
- In: dissolve 10 f. Out: glide.
- Set: gym. Light: day.
- Build: the school front: cream stucco, MIRA MESA HIGH SCHOOL letters, CARD SHOW TODAY banner, palms, flagpole, the plaza and lot; the doors propped open; the booth before the show (easel with the Mew, stack upright).
- Blocking: Outside: two shoppers walk in through the doors f240-320 (side view). Inside: girl at the girl mark lays top-loaders into the tray; dad at the dad mark sets the case on the easel.
  - girl at [0.42, 0.72], front; lays top-loaders f350-394; smile.
  - dad at [-0.38, 0.6], front; case onto the easel f400-412; smile.
- Action, against the words: f224-300 wide on the school front; title SAN DIEGO f268; f300-400 the camera travels in through the open doors and across the gym floor to the booth ('Mira Mesa' f377-400 as it passes the letters); f340-420 the girl sets out cards (one top-loader at a time, f350, f372, f394); dad places the case on the easel f400-412.
- Acting: Girl: excited, careful. Dad: proud.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 224 | open | [-1.4, 3.2, 25.5] | [1, 3, 8.3] | 54 | 0.06 | 0 | the school front, the banner, palms, blue sky |
| 330 | glide 40 f | [2, 1.75, 11] | [2, 1.5, 6] | 50 | 0 | 0 | toward the open doors |
| 372 | glide 46 f | [0.679, 1.58, 5.916] | [-0.038, 0.672, 0.815] | 46 | 0.08 | 0 | in across the floor to the booth |

- Kicks (7 f): none.
- Physics & FX: the doors are propped open (hooked back at 90 deg).
- Light & mood: bright morning sun, blue sky with clouds.
- Sound: outdoor air, a far school bell f240; the score enters (bright plucks); the hall murmur as we enter.
- After-state: The booth is set: the Mew on the easel, the stack upright.

### S03 · 0:14.3-0:19.5 · f428-f586 · "Hôm ấy sạp có một lá Bubble Mew hiếm, một trong những lá đắt nhất trong gian hàng."
- Gloss: That day the booth had a rare Bubble Mew, one of the most expensive cards on the table.
- Spine link: 2. Viewer must get: The real Bubble Mew, big and sharp, with its $3,200 tag.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: the easel and the case (real scan), the price tag on its string.
- Blocking: Dad and girl behind the table.
  - girl at [0.42, 0.72], front; standing; smile.
  - dad at [-0.38, 0.6], front; standing; smile.
- Action, against the words: f428-460 glide down to the easel; f460-545 the Bubble Mew fills the frame (~50% of the width, title BUBBLE MEW f470); a gleam crosses the case f475; f530 the tag turns to us on its string ($3,200, 'đắt nhất' f530); f545-586 pull back: the girl beams behind it.
- Acting: Girl: proud.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 428 | open | [0.34, 1.28, 1.42] | [0.34, 0.84, 1.02] | 30 | 0.05 | 0 | the Bubble Mew on its easel |
| 548 | glide 34 f | [0.466, 1.382, 4.751] | [0.039, 0.808, 0.688] | 40 | 0.08 | 0 | the card and the proud girl |

- Kicks (7 f): none.
- Physics & FX: the tag: hangs on a 6 cm string, a small pendulum (period 0.5 s) after the turn.
- Light & mood: bright; the card sharp and unlit (true colours).
- Sound: a music-box sparkle on the card f462; a soft price tick f530.
- After-state: Unchanged.

### S04 · 0:19.5-0:21.8 · f586-f655 · "Người cha đưa lá bài cho một người lạ xem."
- Gloss: The father handed the card to a stranger to look at.
- Spine link: 3. Viewer must get: Open hand to open hand across the table: the father passes the case to a stranger.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: as before.
- Blocking: Stranger walks up to the stranger mark f586-600 (front view walking) and leans in; dad lifts the case off the easel and holds it across; the stranger takes it and holds it up.
  - stranger at [-0.58, 1.34], front; walks up, takes the case f629; smile.
  - dad at [-0.38, 0.6], front; passes the case f596-629, palm open after; smile.
  - girl at [0.42, 0.72], front; standing; smile.
- Action, against the words: f596 'đưa' dad lifts the case off the easel (the tag swings); f600-620 carries it across to the hand-over point; f629 'người lạ' the stranger takes it; f630-650 he lifts it to eye level; dad's palm stays open over the table, waiting.
- Acting: Stranger: polite, eager. Dad: friendly. Girl: watching the card.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 586 | open | [2.383, 1.544, 5.264] | [-0.116, 0.662, 0.935] | 42 | 0.1 | 0 | the hand-over across the table, all three full body |

- Kicks (7 f): none.
- Physics & FX: the tag swings when the case leaves the easel (period 0.5 s, damped).
- Light & mood: bright.
- Sound: a soft card-case click f629.
- After-state: The stranger holds the case; the easel is empty; dad's palm is open over the table.

### S05 ★ · 0:21.8-0:25.3 · f655-f758 · "Và nó biến mất khỏi tay ông."
- Gloss: And it vanished from his hand.
- Spine link: 3. Viewer must get: A beat of stillness, a sly glance, and the stranger is gone: the father's open hand on empty air.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: as before.
- Blocking: As S04; from f700 the stranger runs to the doors.
  - stranger at [-0.58, 1.34], front then side running; case up; bolts f700; smile -> grin.
  - dad at [-0.38, 0.6], front; palm open; smile frozen.
- Action, against the words: f655-698 the pause after 'Và': the stranger looks at the card, then his eyes slide to the doors (f685); f700 ('biến' f702) he bolts: gone from the frame in 6 f with speed lines and a dust puff; his hip clips the table corner: the three top-loaders slide off and fall (f704-722); the empty easel's tag swings; dad's palm stays open on empty air, his smile frozen.
- Acting: Stranger: sly. Dad: smile frozen, palm open.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 655 | open | [2.393, 1.563, 6.044] | [-0.129, 0.754, 0.872] | 38 | 0.15 (punch 0.6 for 20 f) | 0 | closer: the case, the open palm, his glance |

- Kicks (7 f): f700 strength 0.55.
- Physics & FX: the top-loaders fall as in S01 and stay on the floor.
- Light & mood: bright; the beat of stillness holds.
- Sound: silence under the pause f660-698; a whoosh f700; clatter f714-722.
- After-state: The stranger is running for the doors; the top-loaders on the floor; the easel empty.

### S06 · 0:25.3-0:31.3 · f758-f938 · "Ông kể: "Tôi tưởng anh ta đùa. Tôi tưởng anh ta chạy hai bước rồi quay lại.""
- Gloss: He recalls: "I thought he was joking. I thought he'd run two steps and come back."
- Spine link: 3. Viewer must get: Seen from the doors: the father laughs, palm still out, waiting for the joke to end, while the stranger runs past us and out.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: as before; the doors.
- Blocking: Dad and girl behind the table; the stranger runs from the table to the doors (arrives f790) and out.
  - dad at [-0.38, 0.6], front; palm open; laugh -> smile.
  - girl at [0.42, 0.72], front; looks up at him; nervous.
  - stranger at [2, 7.55], side running; sprints toward and past the lens to the doors f758-790; grin.
- Action, against the words: f758-790 the stranger sprints toward the lens and past it (the doors are behind the lens); f790 the bang of the push bar off-screen, the light on the floor flickers as the doors swing; f800-830 dad laughs ('đùa' f821), palm still open; f849-900 'chạy hai bước rồi quay lại': dad keeps smiling at the doors, waiting; the girl looks up at him, worried.
- Acting: Dad: laughing, easy -> expectant. Girl: worried.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 758 | open | [1.811, 1.19, 5.575] | [-0.096, 0.654, 0.853] | 44 | 0.06 | 0 | from the doors back at the booth: the father laughing at us, the stranger running past the lens |

- Kicks (7 f): f790 strength 0.3.
- Physics & FX: the doors: open to 80 deg in 5 f at f790, then a damped swing (period 1.3 s) toward shut.
- Light & mood: bright.
- Sound: footsteps fading; the doors' bang f790; dad's laugh (Emoji Laugh meme, soft) f805.
- After-state: The stranger is gone; the doors are swinging.

### S07 · 0:31.3-0:33.0 · f938-f991 · "Anh ta không quay lại."
- Gloss: He didn't come back.
- Spine link: 3. Viewer must get: The doors swing shut and settle. Nobody comes back.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: the doors.
- Blocking: Nobody in the doorway; dad in the foreground at the booth.
  - dad at [-0.38, 0.6], front; standing; nervous.
- Action, against the words: f938-975 the doors' last small swings, settling shut at f975; locked frame; f960 dad's smile drops.
- Acting: Dad: smile -> dawning worry.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 938 | open | [2.501, 1.374, 0.978] | [2.01, 1.129, 8.001] | 36 | 0.2 | 0 | locked on the empty doors |

- Kicks (7 f): none.
- Physics & FX: the doors settle shut (amplitude under 1 deg by f975).
- Light & mood: bright, still.
- Sound: the doors' last creaks f940, f958; then hall murmur only.
- After-state: The doors are shut.

### S08 ★ · 0:33.0-0:37.6 · f991-f1129 · "Ông đuổi theo, nhưng gót chân đang đau, và còn đau thêm."
- Gloss: He chased him, but his heel was already hurt, and it hurt even more.
- Spine link: 4. Viewer must get: The father limps out after him; pain flashes at his heel, then worse; far off a black sedan pulls out of the lot.
- In: glide (the camera follows him out through the doors). Out: glide.
- Set: gym. Light: day.
- Build: the plaza, the lot, the black sedan.
- Blocking: Dad pushes out through the doors (door_out) f1000 and limps along the plaza to dad_out; the stranger far away near the sedan (thief_lot), gone behind it by f1040; the sedan pulls out of its bay and drives off left f1050-1125.
  - dad at [3, 11.4], side walking (limp); limps out f1000-1068; stops f1076; stern -> pained.
- Action, against the words: f995 the doors burst open outward; f1000-1068 dad limps out (side view: a short step with the bad leg, a long hop with the good one, the body dips on each bad step; 'đuổi theo' f1003-1015); f1045 'đau' a red pain star pops at his heel; f1073-1080 'còn đau thêm': a bigger star, he stops dead and winces (expr pained), one hand flying back toward the heel; f1050-1125 the sedan reverses out of its bay and drives off to the left.
- Acting: Dad: determined -> pained.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 991 | open | [3.814, 1.428, 3.202] | [1.925, 1.042, 8.393] | 46 | 0 | 0 | he bursts out through the doors |
| 1020 | glide 26 f | [1.6, 1.5, 8.5] | [2.8, 0.6, 12] | 58 | 0.04 | 0 | outside: his limp, the sedan in the lot |

- Kicks (7 f): f1045 strength 0.3; f1076 strength 0.55.
- Physics & FX: the doors swing outward on his push and back (damped). The sedan: eases out of the bay (0.4 m/s back, then 4 m/s forward, out of frame left by f1125).
- Light & mood: bright noon outside.
- Sound: doors f995; limping steps; a pain 'ow' hit f1045 and a bigger one f1076 (Bone Crack meme, light); a car engine and tyre chirp f1052-1120.
- After-state: Dad stands on the plaza, hurt; the sedan is gone.

### S09 · 0:37.6-0:41.0 · f1129-f1229 · "Khoan, sao chỉ vì một lá bài mà phải chạy?"
- Gloss: Wait, why run over a single card?
- Spine link: 5. Viewer must get: Everything freezes on the hurt father in the empty lot: why go to such lengths for one card?
- In: cut. Out: dissolve 8 f.
- Set: gym. Light: day.
- Build: as before.
- Blocking: Dad at dad_out, frozen mid-wince.
  - dad at [3, 11.4], front; frozen wince; pained.
- Action, against the words: f1129 'Khoan': freeze, a record scratch; slow push in on dad's face; f1186 'phải chạy' a tiny shrug of the camera (roll 3 deg back to 0).
- Acting: Dad: frozen, pained.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1129 | open | [5, 1.4, 16.2] | [3, 0.9, 11.4] | 40 | 0.05 | 0 | hold on the frozen father |

- Kicks (7 f): f1129 strength 0.6.
- Physics & FX: none.
- Light & mood: bright; the freeze holds.
- Sound: record scratch + Huh (meme) f1129.
- After-state: Unchanged.

### S10 · 0:41.0-0:46.4 · f1229-f1393 · "Bạn thấy đấy, ở hội thẻ, đưa bài cho người khác xem là chuyện bình thường nhất trần đời."
- Gloss: You see, at a card show, handing your card to someone to look at is the most normal thing in the world.
- Spine link: 5. Viewer must get: All over the hall, cards pass from vendors' hands to strangers' hands and back.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: gym. Light: day.
- Build: the hall in full swing (before the theft): the other booths with vendors and shoppers.
- Blocking: At three booths a vendor hands a top-loader across to a shopper (shop1 at the x -4.4 table, shop2 and shop3 at the row-2 tables); each shopper looks and hands it back.
  - vendors at [-4.2, 1.6], front; hand-overs f1250-1390; smile.
- Action, against the words: f1240-1290 the three hand-overs, staggered (f1250, f1270, f1290, 'đưa bài' f1286-1304); f1300-1350 the shoppers tilt the cards; f1350-1390 they hand them back, vendors smiling ('bình thường' f1346).
- Acting: Everyone relaxed and friendly.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1229 | open | [-5.67, 5.59, 6.22] | [-1.49, -0.5, -1.03] | 50 | 0.02 | 0 | high wide: hand-overs all over the hall |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm, calm.
- Sound: a calm vibraphone 'you see' theme; card-sleeve clicks f1250, f1270, f1290.
- After-state: Unchanged.

### S11 · 0:46.4-0:50.0 · f1393-f1500 · "Giống đưa điện thoại nhờ người lạ chụp giúp tấm ảnh:"
- Gloss: It's like handing a stranger your phone to take a photo for you:
- Spine link: 5. Viewer must get: At the seaside a family hands its phone to a passer-by for a photo.
- In: dissolve 8 f. Out: cut.
- Set: beach. Light: day.
- Build: the promenade, rail, ocean, pier, palms; the phone.
- Blocking: Mum and kid at the rail; dad2 walks from the rail to the stranger2 mark, hands over the phone (f1440), walks back to pose (f1480).
  - dad2 at [-0.05, -1.55], side walking, then front; hands over the phone f1440; smile.
  - stranger2 at [0.08, 2], front; phone up f1482; smile.
- Action, against the words: f1395-1430 dad2 walks to the passer-by holding the phone out; f1440 'nhờ người lạ' hands it over; f1445-1480 walks back to the rail; f1482-1500 the family squeezes together; the passer-by raises the phone ('chụp' f1439).
- Acting: Family: cheerful. Passer-by: obliging.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1393 | open | [-3.849, 1.41, 7.368] | [0.296, 0.482, -0.428] | 44 | 0.06 | 0 | the family, the passer-by and the phone, the sea behind |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright seaside sun, blue sky, sparkling sea.
- Sound: gulls, waves; a light ukulele pluck theme.
- After-state: The phone is in the passer-by's hands.

### S12 · 0:50.0-0:52.3 · f1500-f1568 · "ai cũng nhìn vào máy, chẳng ai nhìn người cầm."
- Gloss: everyone looks at the camera, nobody looks at the person holding it.
- Spine link: 5. Viewer must get: Through the phone: three smiles at the lens. From the side: not one of them looks at the man holding it.
- In: cut. Out: dissolve 8 f.
- Set: beach. Light: day.
- Build: the phone frame (POV), the family posing.
- Blocking: Family posing at the rail; stranger2 holding the phone at eye height.
  - mum at [-0.72, -1.45], front; posing; smile.
  - stranger2 at [0.08, 2], front; phone up; neutral.
- Action, against the words: f1500-1525 POV through the phone: the bezel frames three smiling faces, a yellow focus square locks on them ('nhìn vào máy' f1490-1499); f1528-1568 glide round to the side: the family frozen in their pose, every eye on the phone, the man holding it stands with a blank face ('chẳng ai nhìn người cầm' f1507-1541).
- Acting: Family: big frozen smiles. Passer-by: neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1500 | open | [0.08, 1.52, 2.08] | [-0.05, 1.25, -1.5] | 40 | 0.06 | 0 | through the phone: three smiles |
| 1526 | glide 30 f | [-11.072, 1.314, 2.162] | [0.112, 0.519, 0.19] | 46 | 0.08 | 0 | side: every eye on the phone, none on the holder |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright.
- Sound: Camera shutter (meme) f1520; waves.
- After-state: Unchanged.

### S13 · 0:52.3-0:56.4 · f1568-f1693 · "Niềm tin ở đó rẻ, nên mất cũng nhanh."
- Gloss: Trust there is cheap, so it's lost just as fast.
- Spine link: 5. Viewer must get: Back at the booth: the empty easel, its tag still swinging, and a sad girl.
- In: dissolve 8 f. Out: glide.
- Set: gym. Light: day.
- Build: the booth after the theft: the easel empty, the tag on its string; the top-loaders picked up.
- Blocking: Girl at the girl mark looking down at the easel; dad beside her, head down.
  - girl at [0.42, 0.72], front; looks at the easel; sad.
  - dad at [-0.38, 0.6], front; head down; sad.
- Action, against the words: f1568-1620 glide to the empty easel; the tag turns slowly on its string; f1624 'nên mất' push in on the empty easel; f1637 'nhanh' the tag swings once more.
- Acting: Girl: sad. Dad: sad, head down.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1568 | open | [0.607, 1.528, 4.701] | [0.043, 0.813, 0.688] | 40 | 0.1 | 0 | the girl and the empty easel |
| 1622 | glide 24 f | [0.34, 1.32, 1.5] | [0.34, 0.84, 1.02] | 32 | 0.12 | 0 | push in: the empty easel and its tag |

- Kicks (7 f): none.
- Physics & FX: the tag: a slow pendulum on its string.
- Light & mood: bright but quiet.
- Sound: Meme Violin Sad Violin (soft) f1580.
- After-state: Unchanged.

### S14 · 0:56.4-1:03.5 · f1693-f1906 · "Cảnh sát San Diego vào cuộc, công bố hình chiếc xe sedan đen mà họ nghi là của nghi phạm. Chưa ai bị bắt."
- Gloss: San Diego police stepped in and released photos of the black sedan they believe belongs to the suspect. No one has been arrested.
- Spine link: 6. Viewer must get: An officer pins up a flyer with the black sedan's photo; nobody is caught.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: the notice board; the flyer HAVE YOU SEEN THIS CAR? with the black sedan photo, SDPD.
- Blocking: Officer at the cop mark facing the board (front view), pins the flyer f1740-1760; then steps aside.
  - cop at [-1.6, 7.75], front; pins the flyer f1740-1760; shrug f1855; neutral.
- Action, against the words: f1693-1735 the camera travels from the booth across the hall to the notice board; f1740 the officer presses the flyer to the cork; f1755 the pin goes in (a tap; 'công bố hình' f1737-1768); f1774 'xe sedan đen': push on the photo; f1853 'Chưa ai bị bắt': the officer steps back and shrugs; the flyer's loose corner lifts in the draft from the doors.
- Acting: Officer: businesslike -> a small shrug.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1693 | open | [-1.907, 1.533, 2.339] | [-2.29, 0.956, 7.819] | 44 | 0.06 | 0 | the officer and the notice board |
| 1772 | glide 26 f | [-1.95, 1.64, 6.6] | [-1.95, 1.62, 7.98] | 34 | 0.1 | 0 | the black sedan on the flyer |
| 1840 | glide 24 f | [-1.907, 1.533, 2.339] | [-2.29, 0.956, 7.819] | 44 | 0.06 | 0 | no arrest: the shrug, the flyer corner lifting |

- Kicks (7 f): f1755 strength 0.3.
- Physics & FX: the flyer corner: lifts 3 cm and drops back (a slow sine, 0.6 Hz) from f1853.
- Light & mood: bright.
- Sound: a pushpin tap f1755; a low firm note; a deflated trombone 'wah' f1860.
- After-state: The flyer stays on the board for the rest of the reel.

### S15 · 1:03.5-1:06.7 · f1906-f2002 · "Ban tổ chức thêm bảo vệ và siết quy định cho người bán."
- Gloss: The organisers added security and tightened the rules for vendors.
- Spine link: 6. Viewer must get: A guard in a SECURITY shirt takes his post at the doors; the VENDOR RULES board.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: the guard, the A-frame rules board.
- Blocking: Guard walks in from the doors to the guard mark f1908-1930 (side view), turns to face the hall, arms folded.
  - guard at [2, 7.35], side walking then front; walks in f1908-1930, arms folded; stern.
- Action, against the words: f1908-1930 the guard walks in and plants himself ('bảo vệ' f1931); f1945-1990 glide to the rules board ('siết quy định' f1951-1963); each rule line reads.
- Acting: Guard: stern, watchful.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1906 | open | [3.599, 1.676, 0.183] | [2.564, 0.895, 7.543] | 46 | 0.08 | 0 | the guard at the doors, the rules board |
| 1950 | glide 28 f | [4.65, 1.2, 4.9] | [3.9, 1, 7] | 40 | 0.08 | 0 | the rules |

- Kicks (7 f): f1931 strength 0.25.
- Physics & FX: none.
- Light & mood: bright.
- Sound: footsteps; a firm brass stab f1931; a marker squeak f1960.
- After-state: The guard and the rules board stay.

### S16 · 1:06.7-1:12.6 · f2002-f2179 · "Có người tặng hai cha con một bản sao lá bài, và một quỹ gây tiền được mở để bù một phần."
- Gloss: Someone gave the father and daughter a replica of the card, and a fundraiser was opened to cover part of it.
- Spine link: 6. Viewer must get: A kind collector gives the girl a replica; a jar's hand-drawn meter fills to a third.
- In: glide. Out: glide.
- Set: gym. Light: day.
- Build: the replica in a case with a REPLICA sticker; the fundraiser jar with a hand-drawn thermometer card (GOAL 1/3).
- Blocking: Woman walks up to the woman mark (front-left of the table) f2004-2018 holding the replica and hands it to dad (f2030); dad passes it to the girl (f2036-2048); she sets it on the easel (f2056-2070).
  - woman at [-1, 1.4], front; holds out the replica f2018; smile.
  - girl at [0.42, 0.72], front; takes it f2030, easel f2056-2070; smile.
  - dad at [-0.38, 0.6], front; standing; smile.
- Action, against the words: f2018 'tặng' the woman holds the replica out to dad; f2030 he takes it, touched; f2036-2048 he passes it to the girl, beaming; f2056-2070 she stands it on the easel ('bản sao lá bài' f2047-2061); f2088-2140 glide to the jar: bills drop in (f2096, f2110, f2124) and the thermometer fills to a third ('bù một phần' f2129-2138).
- Acting: Woman: warm. Girl: surprised -> beaming. Dad: grateful.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2002 | open | [2.637, 1.516, 6.488] | [-0.289, 0.64, 0.984] | 42 | 0.08 | 0 | the gift across the table |
| 2086 | glide 26 f | [0.14, 1.06, 1.62] | [0.15, 0.88, 0.86] | 32 | 0.08 | 0 | the jar and its meter |

- Kicks (7 f): none.
- Physics & FX: the bills: drop into the jar (light, a flutter), settle inside.
- Light & mood: warm, bright.
- Sound: a warm chord f2030; three paper rustles f2096/2110/2124; Kaching (meme, soft) f2135.
- After-state: The replica stands on the easel; the jar holds the bills.

### S17 · 1:12.6-1:18.2 · f2179-f2347 · "Cô bé nói: "Con chỉ muốn chắc rằng chuyện này không xảy ra với ai khác.""
- Gloss: The girl says: "I just want to make sure this doesn't happen to anyone else."
- Spine link: 7. Viewer must get: She tapes her own sign to the front of the table: LOOK WITH YOUR EYES.
- In: glide. Out: cut.
- Set: gym. Light: day.
- Build: her sign: white card 50 x 30 cm, hand-lettered LOOK WITH YOUR EYES in red and blue marker, two strips of tape.
- Blocking: Girl walks round to the front of the table (girl_front) f2181-2200 and presses the sign to the cloth f2203-2222; then turns to us.
  - girl at [0.42, 1.55], front; presses the sign f2203-2222; speaks f2225-2306; smile.
- Action, against the words: f2181-2200 she walks round; f2203 ('Con') she presses the sign flat on the table front; f2212, f2220 two strips of tape; f2225-2306 she faces the lens and says her line (mouth moving), a little lean in; f2300 'khác' she nods.
- Acting: Girl: determined, calm.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2179 | open | [-1.182, 0.778, 6.668] | [-0.051, 0.588, 1.347] | 38 | 0.1 | 0 | low: the girl and her sign |

- Kicks (7 f): f2203 strength 0.2.
- Physics & FX: none.
- Light & mood: warm, bright.
- Sound: tape rips f2212, f2220; a gentle hopeful theme.
- After-state: Her sign is taped to the front of the table for the rest of the reel.

### S18 · 1:18.2-1:20.0 · f2347-f2401 · "Kẻ trộm chạy rất nhanh."
- Gloss: The thief ran very fast.
- Spine link: 7. Viewer must get: Far away across the lot, a tiny figure sprints out of sight.
- In: cut. Out: dissolve 8 f.
- Set: gym. Light: day.
- Build: the plaza and lot, the hills.
- Blocking: The thief, tiny, sprints along the far edge of the lot from x -10 to x 14 at z 32.
  - stranger at [2, 32], side running; sprint; grin.
- Action, against the words: f2347-2398 he crosses the frame in a blur of legs with speed lines ('chạy rất nhanh' f2362-2375).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2347 | open | [-1, 2, 11] | [1.5, 1.2, 32] | 46 | 0.08 | 0 | the far lot: the tiny runner |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright noon.
- Sound: a comic whoosh f2360; Runner Game (meme) f2350.
- After-state: He is gone.

### S19 · 1:20.0-1:23.7 · f2401-f2510 · "Nhưng người nhìn xa hơn, lại là cô bé."
- Gloss: But the one who saw further was the girl.
- Spine link: 7. Viewer must get: Crane up from the girl beside her sign: the same sign now hangs on every table in the hall.
- In: dissolve 8 f. Out: end.
- Set: gym. Light: day.
- Build: every table front carries a LOOK WITH YOUR EYES sign.
- Blocking: Girl at girl_front by her sign; vendors behind their tables.
  - girl at [0.42, 1.55], front; standing by her sign; smile.
- Action, against the words: f2401-2440 on the girl, smiling; f2440-2505 crane up and back over the whole hall: her sign on every table ('nhìn xa hơn' f2416-2430, 'cô bé' f2467); hold.
- Acting: Girl: proud, calm.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2401 | open | [-0.129, 0.856, 4.146] | [0.337, 0.669, 1.505] | 40 | 0.08 | 0 | the girl and her sign |
| 2436 | glide 64 f | [4, 5.6, 6.6] | [-0.8, 0.3, -1.2] | 56 | 0.04 | 0 | crane up: her sign on every table |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: bright, uplifting.
- Sound: the theme resolves; a last warm chord f2467.
- After-state: End.

