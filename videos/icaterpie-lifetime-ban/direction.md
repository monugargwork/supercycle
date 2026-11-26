# iCaterpie lifetime ban: direction (stage 2)

Generated from `plan.json` by `scripts/plan_md.py`; change numbers in `mkplan.py`, never here. Blocking sheet: `plan_view.jpg`. Check: `python3 scripts/plan_check.py videos/icaterpie-lifetime-ban/plan.json` (0 errors; the warnings are brief caption-band touches and the S18 tilt to the clock).
All positions are set-local metres (y up); world = set origin + local. 30 fps, 2360 frames (VO ends f2330). Two places: the Italian piazza (the board, the civic hall with the clock and the red shutter, the café terrace, the scale) and the Worlds hall in San Francisco.

## Tone
A sober cautionary tale with dry sight gags. Generic cartoon people, no likenesses; the judge is never named or shown legibly (a censor bar). His claims stay his ("theo lời anh"): The Pokémon Company is an empty frame, not a villain. Screens only from their owner's side (the friend's phone POV).

## Quality bar (25 Nov 2026)
No blur, no shadows, bright warm palettes (cream stucco, terracotta, red-and-white awning, leaf green, sky blue), a cloudy blue sky over the square and in the Worlds window, dressed sets, medium-wide cameras with every character head-to-feet, a real card scan (Caterpie, 151) filling the frame when named.

## Visual law
The internet is the piazza's notice board: posting = pinning, deleting = tearing off, which leaves a corner on the pin. Copies live in other people's phones. Official events are the hall behind the board; its shutter comes down for the ban. The Pokémon Company is an empty official frame.

## Transitions
Hard cuts: S10 ("Khoan đã"), the S11 phone POV, the S13 board's-eye view. Dissolves for time jumps and place changes; glides inside the square.

## Titles (house Title2, Bolota Bold, top of frame)

| in | out | text |
|---|---|---|
| f178 | f236 | ALESSANDRO CREMASCOLI |
| f600 | f636 | SAN FRANCISCO |
| f866 | f924 | 16 · 10 |

## Sets

### piazza
- Origin in the shared world: [0, 0, 0]. Axes: the civic hall's façade on z -6 faces +z; the board in front of it, left; the café on the right (front z -4, x 3.2..8.2); +z toward the lens.
- Light: day; sun az/el [-35, 42]. Open camera sides: sky.
- Marks [x, z]: tear [-0.55, -2.68]; staff [2.85, -5.45]; sit [0.3, -2.55]; him_t1 [3.78, -2.45]; str_t1 [4.62, -2.45].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| ground | new: warm cobbles x -12..12, z -14..14 | [0, 0, 0] | [24, 0, 28] |
| hall | new: civic hall façade 9.2 m wide x 7.4 m: cream stucco, terracotta cornice and pilasters, two upper windows with green shutters and flower boxes; arched door 2 x 3 m with a lit tournament room inside (tables, players, banner); the clock (r 0.7 m) at y 5.6; a bell turret to 9.6 m | [0, 3.7, -6] | [9.2, 7.4, 0.4] |
| shutter | new: red rolling shutter in the door (ribbed canvas), rolls into a box above the door; bottom bar with a hasp; a padlock (S08 on) and the hanging sign CẤM VĨNH VIỄN | [1.5, 1.5, -6] | [2, 3, 0.05] |
| sign | new: sign above the door POKÉMON · GIẢI ĐẤU CHÍNH THỨC (plain lettering, not a logo) | [1.5, 3.78, -5.95] | [3, 0.5, 0.04] |
| board | new: the town notice board 1.5 x 2 m on two oak posts, cork face, header MẠNG XÃ HỘI; dressed with old flyers; the official frame THE POKÉMON COMPANY · THÔNG BÁO CHÍNH THỨC (empty all reel) at the top | [-1, 1.6, -3] | [1.5, 2.37, 0.1] |
| sheet | new: the post: a sheet 60 x 80 cm (oversized A1) on one pin: a judge doodle in a striped shirt, complaint lines in marker, the name in red under a black censor bar; tears off leaving a corner on the pin | [-1.25, 1.22, -2.955] | [0.6, 0.8, 0.002] |
| ann | new: the announcement 44 x 58 cm (S08 on): TÔI BỊ CẤM VĨNH VIỄN KHỎI MỌI GIẢI ĐẤU CHÍNH THỨC — iCaterpie | [-0.55, 1.02, -2.955] | [0.44, 0.58, 0.002] |
| bin | new: green litter bin r 20 cm, 74 cm | [-2.15, 0.37, -2.65] | [0.4, 0.74, 0.4] |
| cafe | new: one-storey café front x 3.2..8.2 on z -4: terracotta wall, red-and-white striped awning 1.5 m deep, CAFFÈ lettering, window with cakes, door, lemon trees in pots; three round tables with chairs; Italian-flag bunting from the hall to the café | [5.7, 1.8, -4] | [5, 3.6, 0.3] |
| signpost | new: wooden signpost with arrows STAZIONE, NICE 300 km, ROMA, MILANO | [2.65, 1.3, -1.25] | [0.9, 2.6, 0.1] |
| scale | adapt:balance (Mudkip S15): a brass public scale, pivot post 1.5 m at (-3.2, 1.0), beam 1.8 m along z, two pans on chains; iron weights CẤM CẢ ĐỜI and NÊU TÊN TRỌNG TÀI (S14 on) | [-3.2, 0.8, 1] | [0.7, 1.6, 2.2] |
| houses | new: house fronts on the other three sides (ochre, terracotta, pale yellow), green shutters, balconies with flowers, a scooter, a fountain at (-3.8, 3.6), lamp posts; blue sky with inked clouds above the roofs | [0, 4, 0] | [24, 8, 28] |

### worlds
- Origin in the shared world: [60, 0, 0]. Axes: the window wall (Golden Gate) on z -6; match table A across x at z -1.5; the lens at +z.
- Light: day; sun az/el [25, 45]. Open camera sides: window.
- Marks [x, z]: him [-0.82, -1.5]; opp [0.82, -1.5]; judge [0.1, -2.25].

| id | build | centre [x, y, z] | size [x, y, z] m |
|---|---|---|---|
| room | new: convention hall x -6..6, z -6..6, 6 m; warm cream walls, teal carpet, a ceiling with light panels; banners WORLDS 2026 and SAN FRANCISCO | [0, 3, 0] | [12, 6, 12] |
| window | new: glass wall 11 x 4.8 m with mullions; outside: the red Golden Gate Bridge, the blue bay, green hills, a cloudy blue sky (painted panorama behind the glass) | [0, 3, -6] | [11, 4.8, 0.05] |
| tableA | new: match table 1.2 x 0.7 m, white cloth, two playmats with real cards laid out (his Caterpie line on his side), a table number plate 12 | [0, 0.37, -1.5] | [1.2, 0.74, 0.7] |
| back | new: two more match tables with players behind (z -3.6), a spectator rail | [0, 0.37, -3.6] | [7, 0.74, 0.7] |

## Cast

- **him:** leaf-green jacket (Caterpie green), sky-blue jeans, yellow cap with a red button. Items: the post sheet, marker, Caterpie card, sticker suitcase. Views: front, front seated, side walking.
- **staff:** red polo STAFF, blue trousers. Items: hook pole, padlock, sign. Views: front.
- **judge:** white shirt with black stripes, JUDGE on the chest. Items: none. Views: front.
- **opp:** orange hoodie. Items: cards. Views: front seated.
- **friend:** sky-blue sweater, glasses. Items: phone. Views: front, side walking.
- **crowd:** coral, mustard, teal, lime, pink, violet-blue outfits. Items: phones. Views: front, side walking.
- **patrons:** two café regulars. Items: none. Views: front seated.

## Scenes

### S01 ★ · 0:00.0-0:04.9 · f0-f148 · "Một người đàn ông xóa bài đăng của mình sau sáu tiếng, và mất luôn hai mươi lăm năm cuộc đời."
- Gloss: A man deletes his post after six hours, and loses twenty-five years of his life.
- Spine link: 1. Viewer must get: He rips his post off the town board; behind him the tournament hall's shutter slams down.
- In: open on the act. Out: dissolve 8 f (back to who he is).
- Set: piazza. Light: day.
- Build: new: the piazza: the board with the post sheet, the bin, the civic hall with the open door and the clock; the staff with the hook pole beside the door.
- Blocking: Him at the tear mark (right of the sheet, facing +z); the staff at the staff mark beside the door, hook pole up at the shutter's bottom bar.
  - him at [-0.55, -2.68], front; reach f12, rip f17, crumple, toss f32-48; stern -> shock.
  - staff at [2.85, -5.45], front; hook pole up; pulls f92-136; neutral.
- Action, against the words: f0-12 he glances at the sheet; f12-17 his left arm (screen left) reaches the sheet's right edge; f17 the rip (2 f before 'xóa' f19): the sheet tears off under the pin, the top corner stays pinned; f18-30 he crumples it into a ball; f32-48 he tosses it left into the bin (arc, lands f48, the bin rocks); f92 the staff hooks the shutter's bar and pulls: the shutter rattles down f100-136 and slams on 'đời' f137 (dust puff at the sill); he turns his head to it, shocked.
- Acting: Him: stern -> shock on the slam. Staff: neutral.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 0 | open | [-0.45, 1.7, 2.3] | [-0.75, 1.25, -3] | 44 | 0.07 | 0 | him tearing the post off the board |
| 80 | glide 44 f | [0.9, 2.9, 6.8] | [1, 2.4, -4.5] | 48 | 0.05 | 0 | pull back: the board and the hall's shutter coming down |

- Kicks (7 f): f17 strength 0.35; f137 strength 1.
- Physics & FX: the paper ball: ballistic arc from his hand into the bin (lands f48), the bin rocks ±3 deg twice. Shutter: falls under the pole's pull, the last 0.4 m in free fall, 2 small bounces.
- Light & mood: bright noon sun on cream stucco.
- Sound: paper rip f17; crumple; a tin 'tunk' f48; the shutter's rattle f100-136 and a heavy slam f137 (a bass hit); the score's first note.
- After-state: The torn corner stays on the pin; the paper ball stays in the bin.

### S02 · 0:04.9-0:12.3 · f148-f370 · "Anh là Alessandro Cremascoli, biệt danh iCaterpie, người Ý, hai lần vô địch quốc gia môn thẻ bài Pokémon."
- Gloss: He is Alessandro Cremascoli, nicknamed iCaterpie, Italian, twice national champion of the Pokémon card game.
- Spine link: 2. Viewer must get: At his café table: the name, the Caterpie card held up, two national trophies.
- In: dissolve 8 f. Out: dissolve 8 f.
- Set: piazza. Light: day.
- Build: reuse the café terrace (T1): two gold trophies (plates VÔ ĐỊCH QUỐC GIA), an espresso, his deck box; bunting overhead.
- Blocking: Him seated at T1 (him_t1), facing +z, head toward the lens.
  - him at [3.78, -2.45], front seated; sips f190-205; card up f236-300; smile -> grin.
- Action, against the words: f150-230 he sips the espresso (cup to mouth f190-205); f236-248 his right arm lifts the real Caterpie card toward the lens on 'iCaterpie' (f250): it fills ~45% of the frame width f252-300; f300-330 the camera pulls back to the two trophies on 'hai lần' (f301); a gleam crosses each trophy f306 and f314.
- Acting: Him: smile, a proud grin on the card.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 148 | open | [4.3, 1.5, 1.6] | [4.2, 1, -2.6] | 42 | 0.06 | 0 | him at his café table |
| 234 | glide 20 f | [3.95, 1.45, -1.27] | [3.93, 1.42, -2.12] | 30 | 0.06 | 0 | the Caterpie card fills the frame |
| 300 | glide 26 f | [4.3, 1.6, 0.9] | [4.15, 1.15, -2.5] | 40 | 0.06 | 0 | the two trophies |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: warm sun under the striped awning.
- Sound: café murmur, a cup clink f205; a bright pluck motif; a 'ting' per trophy gleam.
- After-state: The card back in his deck box.

### S03 · 0:12.3-0:17.8 · f370-f535 · "Hai mươi lăm năm, anh đi khắp nước Ý dạy người lạ cách chơi, dựng nên cả một cộng đồng."
- Gloss: For twenty-five years he travelled all over Italy teaching strangers how to play, building a whole community.
- Spine link: 2. Viewer must get: His suitcase covered in city stickers; he teaches a stranger; the camera pulls back on a terrace full of players.
- In: dissolve 8 f. Out: dissolve 10 f.
- Set: piazza. Light: day.
- Build: reuse the terrace; the sticker suitcase (ROMA, NAPOLI, TORINO, VENEZIA, MILANO, BOLOGNA, FIRENZE); the stranger at T1; four players at T2 and T3 with real cards.
- Blocking: Him walks in from the right with the suitcase past the signpost to T1; the stranger already seated at str_t1; players at T2/T3 (off frame until the pull back).
  - him at [3.78, -2.45], side walking -> front seated; walks f372-446, sits f452, lays a card f458-474; smile.
  - stranger at [4.62, -2.45], front seated; nods f480; neutral -> smile.
- Action, against the words: f372-446 he wheels the suitcase from (5.6, -1.4) left past the signpost to T1 (stickers readable); f446-452 parks it and sits; f458-474 he lays a real card on the table in front of the stranger ('dạy' f451), points at it f475; the stranger nods f480; f488-535 the camera rises and pulls back: T2 and T3 full of players ('cộng đồng' f521).
- Acting: Him: friendly, explaining. Stranger: puzzled -> smile.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 370 | open | [4.3, 1.5, 2.6] | [4, 1.15, -1.6] | 44 | 0.06 | 0 | him and the sticker suitcase |
| 446 | glide 20 f | [4.25, 1.5, 1.2] | [4.2, 0.95, -2.4] | 40 | 0.06 | 0 | teaching the stranger |
| 488 | glide 44 f | [4.5, 3.1, 5.8] | [4.3, 1.2, -1.8] | 46 | 0.06 | 0 | pull back: the terrace full of players |

- Kicks (7 f): none.
- Physics & FX: suitcase wheels roll (spin = distance / r).
- Light & mood: sunny.
- Sound: suitcase wheels on cobbles; card snap f474; the community grows: more voices, laughter f500-535.
- After-state: The terrace full.

### S04 · 0:17.8-0:21.3 · f535-f640 · "Hơn một tháng sau giải vô địch thế giới ở San Francisco,"
- Gloss: More than a month after the World Championships in San Francisco,
- Spine link: 3. Viewer must get: Worlds in San Francisco: the Golden Gate in the window; a judge rules at his table.
- In: dissolve 10 f. Out: dissolve 8 f (a month later).
- Set: worlds. Light: day.
- Build: new: the Worlds hall, the window wall with the Golden Gate, table A, back tables.
- Blocking: Him seated at the left end (facing the opponent), the opponent at the right end, the judge standing behind the table.
  - him at [-0.82, -1.5], front seated, head to +x; plays; folds arms f600; hands up f625; stern.
  - opp at [0.82, -1.5], front seated, head to -x; plays; nervous.
  - judge at [0.1, -2.25], front; arm up f586-600, points f612; stern.
- Action, against the words: f540-575 cards played (one slides onto his mat f560); f586-600 the judge raises his right arm (a ruling); f600 he frowns, arms folded; f612 the judge points at his mat; f625 he throws up his hands.
- Acting: Judge: stern. Him: stern -> annoyed. Opponent: nervous.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 535 | open | [0.2, 2.7, 4.6] | [0, 2.2, -5.5] | 50 | 0.06 | 0 | the hall and the Golden Gate |
| 566 | glide 34 f | [0.05, 1.75, 3.5] | [0, 1, -1.7] | 48 | 0.06 | 0 | the table, the judge |

- Kicks (7 f): none.
- Physics & FX: card slide with friction.
- Light & mood: bright hall, sun through the window.
- Sound: hall hubbub, a card slide f560, a judge's whistle-free 'tsk'; shuffle sounds.
- After-state: -

### S05 · 0:21.3-0:24.6 · f640-f739 · "anh lên mạng viết một bài than phiền về một trọng tài ở giải đó."
- Gloss: he went online and wrote a post complaining about a judge at that event.
- Spine link: 3. Viewer must get: He pins a sheet on the town board and writes his complaint, a striped-shirt judge doodle on top.
- In: dissolve 8 f. Out: glide.
- Set: piazza. Light: day.
- Build: reuse the board (no sheet before f656); the shutter open; passers-by in the back.
- Blocking: Him walks in from the right carrying the blank sheet to the tear mark.
  - him at [-0.55, -2.68], front; walks in f640-654, pins f660, writes f662-735; stern.
- Action, against the words: f640-654 he walks in with the blank sheet (held at the chest); f656-660 he pins it (pin pressed f660); f662-735 he writes with a marker: the judge doodle on 'trọng tài' (f703-716), complaint lines (each line ~10 f, the marker squeaks).
- Acting: Him: frown, determined.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 640 | open | [-0.6, 1.7, 1.9] | [-0.85, 1.2, -3] | 42 | 0.06 | 0 | the board, him arriving |
| 690 | glide 34 f | [-0.85, 1.6, 1] | [-1, 1, -3] | 40 | 0.06 | 0 | the writing |

- Kicks (7 f): none.
- Physics & FX: the sheet hangs from one pin (a slight sway after pinning).
- Light & mood: sunny.
- Sound: a pin thunk f660; marker squeaks f662-735; distant scooter.
- After-state: The sheet hangs on the board, written.

### S06 · 0:24.6-0:26.6 · f739-f799 · "Và anh gọi thẳng tên người ấy."
- Gloss: And he called that person out by name.
- Spine link: 3. Viewer must get: He writes the judge's name in red; a black censor bar slams over it.
- In: glide. Out: dissolve 6 f.
- Set: piazza. Light: day.
- Build: reuse the sheet: the name line at its bottom.
- Blocking: Him at the tear mark, his arm at the sheet.
  - him at [-0.55, -2.68], front; writes the name f745-768; stern.
- Action, against the words: f745-768 his marker writes the name in big red letters (we never see it legibly: scribble shapes); f770 a black censor bar slams over it (2 f squash) on 'tên' (f774); he underlines it twice f778-790.
- Acting: Him: stern.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 739 | open | [-1.05, 1.35, -1.2] | [-1.2, 1.12, -2.95] | 38 | 0.06 | 0 | the name on the sheet |

- Kicks (7 f): f770 strength 0.4.
- Physics & FX: none.
- Light & mood: sunny.
- Sound: Censor Beep (meme) f772; marker squeaks.
- After-state: The name under the censor bar.

### S07 · 0:26.6-0:28.6 · f799-f859 · "Sáu tiếng sau, anh xóa bài."
- Gloss: Six hours later, he deleted the post.
- Spine link: 3. Viewer must get: The clock spins six hours while the town streams past the post and photographs it; then he tears it down.
- In: dissolve 6 f. Out: dissolve 8 f (16 Oct).
- Set: piazza. Light: day.
- Build: reuse the master wide: the clock, the open door, the board with the sheet.
- Blocking: Passers-by stream left-right in front of the board (time-lapse); him back at the tear mark from f832.
  - him at [-0.55, -2.68], front; arrives f832, rips f841; stern.
- Action, against the words: f800-836 the clock's hands spin from 13:00 to 19:00 (the minute hand six turns); five passers-by cross fast, three stop and raise phones: flashes f806, f815, f824; f832 he steps back to the board; f841 he rips the sheet off (2 f before 'xóa' f843); the corner stays.
- Acting: Passers-by: curious. Him: grim.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 799 | open | [0.4, 3.3, 7] | [0.4, 3.1, -4] | 50 | 0.06 | 0 | the clock, the board and the town: six hours |

- Kicks (7 f): f841 strength 0.3.
- Physics & FX: the clock hands: kinematic.
- Light & mood: sunny (the light stays bright).
- Sound: a fast clock tick-whirr f800-836; Camera shutter (meme) x3; the rip f841.
- After-state: Only the torn corner on the pin.

### S08 ★ · 0:28.6-0:36.9 · f859-f1107 · "Ngày mười sáu tháng mười, khi đang chuẩn bị lên đường dự giải ở Nice, anh báo tin: mình đã bị cấm vĩnh viễn khỏi mọi giải đấu chính thức của Pokémon."
- Gloss: On October 16, as he was getting ready to travel to the event in Nice, he announced: he had been permanently banned from all official Pokémon events.
- Spine link: 4. Viewer must get: With his NICE-tagged suitcase he pins his announcement; the staff slam the hall's shutter, padlock it and hang CẤM VĨNH VIỄN.
- In: dissolve 8 f. Out: glide.
- Set: piazza. Light: day.
- Build: reuse the piazza; the suitcase with a NICE luggage tag; the announcement sheet; the padlock and the sign.
- Blocking: Him wheels the suitcase in from the right to the tear mark; the staff at the door.
  - him at [-0.55, -2.68], side walking -> front; wheels f862-930; pins f998; sad.
  - staff at [2.85, -5.45], front; pulls f1003-1020, padlock f1030-1036, sign f1044-1058; neutral.
- Action, against the words: f862-930 he wheels the suitcase from (1.9, -2.3) to the tear mark; f945-962 the NICE tag swings on the handle ('Nice' f958); f975-995 he takes the announcement from his jacket and pins it (pin f998, 'báo tin' f982-988); f1003-1020 the staff pulls the shutter down, it slams on 'cấm' f1022; f1030-1036 the staff snaps the padlock shut ('vĩnh viễn' f1036); f1044-1058 he hangs the sign CẤM VĨNH VIỄN on the shutter's hasp; f1062-1095 the camera rises to the sign above the door: POKÉMON · GIẢI ĐẤU CHÍNH THỨC.
- Acting: Him: tired, sad. Staff: neutral, businesslike.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 859 | open | [1.1, 2, 4.6] | [0.4, 1.6, -3.5] | 46 | 0.06 | 0 | him and the suitcase crossing to the board |
| 940 | glide 22 f | [0, 1.45, 0.9] | [-0.3, 0.9, -2.6] | 40 | 0.06 | 0 | the NICE tag, the announcement pinned |
| 1004 | glide 26 f | [1.6, 2.5, 4.6] | [2, 2, -5.5] | 46 | 0.06 | 0 | the shutter slams, the padlock, the sign |
| 1060 | glide 30 f | [1.3, 2.9, 0.8] | [1.5, 3.3, -6] | 40 | 0.06 | 0 | the sign over the shut door |

- Kicks (7 f): f1022 strength 1; f1036 strength 0.3.
- Physics & FX: the luggage tag: pendulum on its strap; the shutter as in S01; the padlock shackle snaps 1 cm.
- Light & mood: morning sun.
- Sound: suitcase wheels; a pin thunk f998; the shutter rattle and slam f1022 (bass hit); the padlock click f1036; the sign's chain jingle f1050.
- After-state: The shutter stays down, padlocked, the sign on it, until the end.

### S09 ★ · 0:36.9-0:41.9 · f1107-f1258 · ""Tôi suy sụp. Pokémon đúng nghĩa là cuộc đời tôi. Tôi không thể ngừng khóc.""
- Gloss: "I'm devastated. Pokémon is literally my life. I can't stop crying."
- Spine link: 4. Viewer must get: He slumps onto his suitcase before the shut door, looks at his Caterpie card, and cries.
- In: glide. Out: cut.
- Set: piazza. Light: day.
- Build: reuse; the suitcase moved to the sit mark (he wheels it there f1100-1110, off camera during the glide).
- Blocking: Him seated on the suitcase at the sit mark, the shut door behind him.
  - him at [0.3, -2.55], front seated; slumps f1110-1128; card f1147-1210; cries f1212-1252; sad.
- Action, against the words: f1110-1128 he slumps down onto the suitcase ('suy sụp' f1120); f1147-1160 he takes the Caterpie card out and holds it in front of him, head bowed to it ('cuộc đời tôi' f1186-1199); f1212-1252 tears drip from his eyes onto the cobbles (a drop every 6 f each side), small dark dots stay.
- Acting: Him: sad -> crying (sad, eyes squeezed).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1107 | open | [1.1, 1.4, 2.2] | [0.8, 1, -5] | 42 | 0.06 | 0 | him on the suitcase, the padlocked door behind |
| 1160 | glide 34 f | [0.55, 1.15, -1.15] | [0.3, 1, -2.55] | 38 | 0.06 | 0 | the card in his hands, his face |
| 1215 | glide 30 f | [0.9, 1.35, 0.4] | [0.5, 1.1, -3] | 42 | 0.06 | 0 | the tears, the door behind |

- Kicks (7 f): none.
- Physics & FX: tear drops fall under gravity from the eyes to the cobbles.
- Light & mood: sunny but still.
- Sound: a soft piano line (synth), no meme; a quiet sniff f1215.
- After-state: Tear dots on the cobbles.

### S10 · 0:41.9-0:44.9 · f1258-f1346 · "Khoan đã, bài đã xóa rồi mà vẫn bị phạt?"
- Gloss: Wait, the post was deleted and he was still punished?
- Spine link: 5. Viewer must get: His friend stares at the torn corner on the board and shrugs.
- In: cut. Out: cut.
- Set: piazza. Light: day.
- Build: reuse the board: the torn corner, the announcement.
- Blocking: Friend standing in front of the board at (-1.1, -1.3), facing +z.
  - friend at [-1.1, -1.3], front; points f1262; scratches f1300; shrugs f1334; nervous.
- Action, against the words: f1258 Huh; f1262-1290 the friend points back at the torn corner; f1300-1325 scratches his head; f1334 shrugs on 'phạt?'.
- Acting: Friend: puzzled.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1258 | open | [-0.8, 1.6, 2.6] | [-1.15, 0.92, -2.9] | 42 | 0.06 | 0 | the friend and the torn corner |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: sunny.
- Sound: Huh (meme) f1258.
- After-state: -

### S11 · 0:44.9-0:49.2 · f1346-f1476 · "Hóa ra, trên mạng, nút xóa chỉ xóa được trên màn hình của bạn."
- Gloss: It turns out that online, the delete button only deletes from your own screen.
- Spine link: 6. Viewer must get: From the friend's eyes: on his phone, the full post (a photo); behind the phone, the bare board.
- In: cut. Out: dissolve 8 f.
- Set: piazza. Light: day.
- Build: the friend's phone (canvas: PHOTOS, the photo of the sheet with the censored name, 13:42).
- Blocking: Camera at the friend's eyes; the phone in his hands in front.
- Action, against the words: f1350-1390 he swipes through three photos of the sheet (each a different angle: they're other people's shares); f1394 'nút xóa': the thumbnail strip shows 37 copies; f1440-1470 the phone tilts a little toward the board: the photo's sheet lines up with the torn corner.
- Acting: none (POV).
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1346 | open | [-1.1, 1.62, -1.25] | [-1.15, 1.22, -3] | 56 | 0.03 | 0 | the phone, the bare board behind |

- Kicks (7 f): none.
- Physics & FX: none (screen content).
- Light & mood: sunny.
- Sound: swipe whooshes; a soft phone tap.
- After-state: -

### S12 ★ · 0:49.2-0:55.3 · f1476-f1660 · "Bài đăng giống như ly nước đổ ra sàn: bạn lau được vũng nước, nhưng người khác đã kịp nhìn thấy đôi giày ướt."
- Gloss: A post is like a glass of water spilled on the floor: you can mop up the puddle, but others have already seen the wet shoes.
- Spine link: 6. Viewer must get: He knocks over a glass, mops the puddle clean, but the friend who walked through it leaves a trail of wet prints, and the café patrons point.
- In: dissolve 8 f. Out: cut.
- Set: piazza. Light: day.
- Build: reuse the terrace T1/T2: a tall water glass, a napkin; the patrons at T2.
- Blocking: Him seated at T1; the friend walks across the terrace right to left; two patrons seated at T2.
  - him at [3.78, -2.45], front seated -> crouch; knocks f1506; mops f1558-1584; shock -> relief -> nervous.
  - friend at [2.7, -1.7], side walking; walks f1522-1580 through the puddle; neutral -> nervous.
  - patrons at [5.35, -1], front seated; look down f1600; point f1627; grin.
- Action, against the words: f1500-1506 his right arm gestures and knocks the glass ('ly nước' f1508); it tips off the near edge and falls (rigid body), hits the cobbles f1519 ('đổ' f1519): a splash, a puddle spreads to r 0.32 m by f1530; the glass rolls and rests; f1522-1546 the friend walks through the puddle (one step in it f1533); f1548-1556 he stands, f1558-1584 crouches and wipes with the napkin: the puddle shrinks to nothing ('lau' f1558); f1584-1650 the wet prints the friend left run across the cobbles to where he stands; the patrons look down at the prints, then point at his dripping legs ('nhìn thấy' f1627, 'giày ướt' f1641).
- Acting: Him: oops -> relieved (puddle gone) -> nervous. Friend: oblivious -> embarrassed. Patrons: grin, pointing.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1476 | open | [4.15, 1.8, 1.9] | [4.05, 1, -2.2] | 46 | 0.06 | 0 | the table, the glass, the terrace |
| 1590 | glide 34 f | [3.4, 1.75, 2.1] | [3.3, 0.85, -1.7] | 48 | 0.06 | 0 | the wet prints to the friend, the patrons pointing |

- Kicks (7 f): f1519 strength 0.4.
- Physics & FX: the glass: cannon-es cylinder, tipped from the table edge, 240 Hz bake; the splash a 6 f FX; the puddle a flat decal that grows then shrinks under the napkin; prints a fading decal per step.
- Light & mood: sunny terrace.
- Sound: glass knock f1506, a clink-splash f1519; footsteps; squeaky napkin f1558-1584; a wet squelch per step; patrons' giggle.
- After-state: A dry spot where the puddle was; the wet prints fade by f1660.

### S13 · 0:55.3-0:57.8 · f1660-f1735 · "Sáu tiếng, đủ để bất kỳ ai chụp lại."
- Gloss: Six hours is enough for anyone to take a picture.
- Spine link: 6. Viewer must get: From the post's own view on the board: five people raise their phones and flash.
- In: cut. Out: dissolve 10 f.
- Set: piazza. Light: day.
- Build: reuse the piazza looking +z from the board's face: the crowd, the house fronts, the fountain.
- Blocking: Five passers-by in front of the board (z -1.5..-0.2), facing the board (the lens), phones held up, screens to them.
  - crowd at [-1, 0.6], front; phones up, flash; grin / shock.
- Action, against the words: f1662-1700 they gather; flashes from their phones at f1702, f1712, f1718, f1723, f1729 ('chụp lại' f1723).
- Acting: Crowd: curious, gossiping.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1660 | open | [-1, 1.75, -2.82] | [-1, 0.95, 3] | 56 | 0.08 | 0 | the post's view: the crowd snapping it |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: sunny.
- Sound: Camera shutter (meme) on each flash.
- After-state: -

### S14 ★ · 0:57.8-1:02.1 · f1735-f1863 · "Cộng đồng chia làm hai phe. Một bên nói, cấm cả đời là quá nặng."
- Gloss: The community split into two camps. One side says a lifetime ban is too heavy.
- Spine link: 7. Viewer must get: The crowd splits to the two pans of a public scale; the near side drops the CẤM CẢ ĐỜI weight on its pan and it slams down.
- In: dissolve 10 f. Out: glide.
- Set: piazza. Light: day.
- Build: reuse; the scale stands at (-3.2, 1.0); the two iron weights on the cobbles by the pans.
- Blocking: Six people in a group beside the scale; three walk to the near pan, three to the far pan.
  - crowd at [-3.2, 1], side walking -> front; split f1740-1778; lift f1800-1838; stern.
- Action, against the words: f1740-1778 the group splits (three walk toward the lens, three away); f1800-1838 two of the near side lift the CẤM CẢ ĐỜI weight (both arms) and drop it on the near pan f1840; f1845 ('quá nặng') the pan slams to the ground, the beam tilts hard; the far pan rises; they throw up their arms.
- Acting: Near side: indignant. Far side: arms folded.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1735 | open | [-1.4, 2.5, 6.4] | [-3.3, 1.2, 0.8] | 48 | 0.06 | 0 | the crowd by the scale |
| 1795 | glide 30 f | [-2.7, 1.95, 5.4] | [-3.5, 0.85, 1.6] | 44 | 0.06 | 0 | the near pan and the heavy weight |

- Kicks (7 f): f1845 strength 0.8.
- Physics & FX: the beam: a damped pendulum about the pivot; the weight lands with no bounce (iron), the pan hits the ground stop.
- Light & mood: sunny.
- Sound: footsteps; a grunt on the lift; a heavy CLANG f1845 (Instagram Thud under it).
- After-state: The near pan on the ground.

### S15 · 1:02.1-1:05.8 · f1863-f1974 · "Bên kia nói, lẽ ra anh không nên nêu tên trọng tài trên mạng."
- Gloss: The other side says he should never have named the judge online.
- Spine link: 7. Viewer must get: The far side puts NÊU TÊN TRỌNG TÀI on their pan and the beam swings back to level.
- In: glide. Out: dissolve 8 f.
- Set: piazza. Light: day.
- Build: reuse.
- Blocking: Far side at the far pan.
  - crowd at [-3.2, 1], front; lift f1880-1922; stern.
- Action, against the words: f1880-1922 two of the far side lift their weight; f1925 it lands on the far pan; f1928-1960 the beam swings back to level, overshoots once and settles; both sides glare at each other f1960-1974.
- Acting: Far side: stern. Near side: annoyed.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1863 | open | [-2, 2.3, 3.6] | [-3.2, 1.3, -0.1] | 44 | 0.06 | 0 | the far side and their weight |
| 1932 | glide 26 f | [-1, 2.6, 6.6] | [-3.1, 1.3, 0.8] | 48 | 0.06 | 0 | the scale level, the two camps |

- Kicks (7 f): f1925 strength 0.4.
- Physics & FX: beam: damped pendulum back to level (period 1.1 s, damping 0.35).
- Light & mood: sunny.
- Sound: a second clang f1925; a creak as the beam rises.
- After-state: The scale level, both weights on it.

### S16 · 1:05.8-1:09.6 · f1974-f2089 · "Còn The Pokémon Company, đến giờ vẫn chưa nói một lời nào."
- Gloss: And The Pokémon Company, to this day, has not said a single word.
- Spine link: 8. Viewer must get: The official frame at the top of the board stays empty; a crow lands on it and caws.
- In: dissolve 8 f. Out: glide.
- Set: piazza. Light: day.
- Build: reuse the board: the empty official frame THE POKÉMON COMPANY · THÔNG BÁO CHÍNH THỨC.
- Blocking: Nobody; a crow.
- Action, against the words: f1974-2040 slow push on the empty frame; f2030-2048 a crow flies in from the right and lands on the frame's top edge ('chưa nói' f2048); f2058 it caws; it cocks its head.
- Acting: Crow: deadpan.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 1974 | open | [-0.85, 2.2, 0.6] | [-1, 2.12, -3] | 38 | 0.09 | 0 | the empty official frame |

- Kicks (7 f): none.
- Physics & FX: the crow: flap-glide in, a 2 f squash on landing.
- Light & mood: sunny.
- Sound: silence under the VO (the score drops out); Crow (meme) f2058.
- After-state: The crow stays.

### S17 · 1:09.6-1:12.8 · f2089-f2185 · "Nên mọi lý do ta biết, đều chỉ là lời kể của anh."
- Gloss: So every reason we know is only his own account.
- Spine link: 8. Viewer must get: Down the board to his announcement: the only source, signed iCaterpie.
- In: glide. Out: glide.
- Set: piazza. Light: day.
- Build: reuse the announcement sheet.
- Blocking: Nobody.
- Action, against the words: f2089-2130 the camera glides down from the empty frame to his sheet; f2150-2175 a slow push to the signature '— iCaterpie' ('lời kể của anh' f2155-2173).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2089 | open | [-0.45, 1.25, -0.6] | [-0.55, 1.05, -2.95] | 36 | 0.12 | 0 | his announcement, the only source |

- Kicks (7 f): none.
- Physics & FX: none.
- Light & mood: sunny.
- Sound: a single soft piano note.
- After-state: -

### S18 · 1:12.8-1:14.8 · f2185-f2243 · "Bài đăng ấy sống được sáu tiếng."
- Gloss: That post lived six hours.
- Spine link: 9. Viewer must get: The torn corner on its pin, then up to the clock.
- In: glide. Out: glide.
- Set: piazza. Light: day.
- Build: reuse.
- Blocking: Nobody in frame.
- Action, against the words: f2185-2208 the torn corner (a breeze flutters it); f2208-2240 tilt up to the clock: its hands sweep 13:00 -> 19:00 once more ('sáu tiếng' f2222).
- Acting: none.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2185 | open | [-1.05, 1.6, -0.9] | [-1.25, 1.56, -2.95] | 36 | 0.06 | 0 | the torn corner |
| 2194 | glide 46 f | [0.4, 2.6, 0.8] | [1.5, 5.6, -5.94] | 38 | 0.06 | 0 | the clock: six hours |

- Kicks (7 f): none.
- Physics & FX: the corner flutters (sine).
- Light & mood: sunny.
- Sound: a clock tick.
- After-state: -

### S19 · 1:14.8-1:18.7 · f2243-f2360 · "Còn lệnh cấm, theo lời anh, là mãi mãi."
- Gloss: And the ban, by his account, is forever.
- Spine link: 9. Viewer must get: Pull back to the whole square: the padlocked door, him on his suitcase, the clock spinning on and on.
- In: glide. Out: end.
- Set: piazza. Light: day.
- Build: reuse the master wide; the scale with both weights at the left edge.
- Blocking: Him seated on the suitcase at the sit mark.
  - him at [0.3, -2.55], front seated; sits; sad.
- Action, against the words: f2243-2300 the camera pulls back and down to the master wide; the clock's hands spin faster and faster (days go by) from f2260 ('mãi mãi' f2311-2330); the clouds drift; he stays sitting; the sign sways once.
- Acting: Him: sad, still.
- Camera keys:

| f | move | pos | look | fov | push %/f | blur px | why |
|---|---|---|---|---|---|---|---|
| 2243 | open | [0.4, 3.3, 7.4] | [0.4, 3, -4] | 50 | 0.04 | 0 | the square: the shut door, him, the clock forever |

- Kicks (7 f): none.
- Physics & FX: clock hands kinematic, accelerating.
- Light & mood: sunny, the clouds drifting.
- Sound: the theme's last phrase, a clock tick that speeds up and fades.
- After-state: End.

