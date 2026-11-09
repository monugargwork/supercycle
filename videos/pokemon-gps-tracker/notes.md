# Pokémon GPS tracker: notes log

- 6 Nov: voiceover received (73.6 s, ElevenLabs), aligned to the script (words.json); beat sheet written.

## 2026-11-06 · note 2: "map animations done badly; he watches his phone but the screen faces the viewer, no logic"
- Taste: logic and physics above everything. A held screen is only ever seen from its owner's side.
- His phone in every shot of him now shows its back (case, camera, faint screen glow on the rim). The screen is only shown in his own view (POV): the phone between his two hands, his lap soft below.
- One town map in world metres (art.ts ROADS/BUILT/STORES/ROUTE) drives the phone, the route sheet and the final map, so they agree with the 3D street: main road z 0, the cross road down at x -70 (a real LEFT turn on the map now; the old map showed a right turn), the hook Walmart where the set has it.
- Shot 6 dives into the screen: the map zooms from 4 to 22 px/m and lands on the exact patch of town the top-down aerial (shot 7) shows; the dot is where the truck is; same speed (0.27 m/f).
- Shot 8: his view, the dot stops at Target then Walmart; pins drop with "Target · 9:10" / "Walmart · 10:30"; phone clock races (time-lapse). The wall clock and the phone share one clock (story.ts clockMin), set to the morning so it agrees with her route sheet (was 22:40 at night, deliveries in the day: contradiction). Window now daylight. He puts his tea on the side table before lifting the phone.
- Shot 15: her route sheet's line matches the recorded route on his phone (same map, same place on the card, same camera push); his forefinger traces it to the last store, pin "Thẻ về đây".
- Shot 20: no phone at the end; the crane's view becomes a map of the same street and zooms out until he is one small green dot.

## 2026-11-06 · note 3: "hands too detailed; these are stickman characters, lines for arms and legs, nothing more"
- Taste: the cast are stick figures. Arms and legs are plain lines; no hands, no fingers, ever, even in close POV shots.
- POV phone shots: the hands, fingertips, thumbs and cuffs are gone. Two plain stick-arm lines (his arm colour) come up from below and end on the phone's sides; in shot 15 one arm line's tip traces the route.
- Seated legs: new toon option `chair` (seat height in head-heights). Thighs short toward camera, knees at the seat edge, shins straight down, feet on the floor. Kub in the armchair uses chair 1.1 with his card on the floor at the seat front (Lv(0, 0, -0.8)).

## 2026-11-09 · Frame.io round on "GPS Creep.mp4" (v1)
- f43 / f564 "too many shadows / no shadows needed": character cards no longer cast shadows in golden light (only the soft contact blob under the feet); golden shadow colour lifted (shade 0.15 -> 0.34); hook sun raised (el 10 -> 22) so shadows are shorter.
- f65 "tracker teleported, make him apply it by hand": new 3D stick arm (cast.ts arm3d: the card's own arm is switched off with toon `armOff`, a two-segment line runs from his shoulder to a world point). He holds the box at his side, crouches (new toon `crouch`), half-steps in, his arm carries it under the bumper, holds, click, lets go, stands and grins. The tracker object follows his hand (stage().track).
- f311 all blue: shot 3's camera was inside the parked truck. Moved outside (z 3.6 -> 6.3).
- f564 "why the cup? keep the phone from the start": tea and side-table cup removed, phone in hand from f560, tea-sip sound removed from the mix.
- f731 aerial glitch: z-fighting stripes where the cross road met the walk/lot planes; cross road lifted to y 0.2 and the camera near plane is 1 m on high aerials.
- f1032 "needs to get better": the pen falls, she crouches and leans in, cut to her shocked face on "phát hiện", back on the box: her arm reaches in, wiggles it, pulls it free on YANK; then she holds it up in her left hand, clipboard still in her right.
- f1500 glitch: shot 14's opening camera was inside the truck body; now in front of her.
- f2031 "what is this lol": the ankle monitor was a strap with arm-like ends floating between the legs. Now a small box on a strap clamped round his stick leg at the ankle (strap halves swing shut), framed tighter (fov 26); the white flash disc removed.
- Taste: every prop must be carried by a hand from where it was to where it goes. Never let a camera sit inside geometry (check the truck in every street shot).
