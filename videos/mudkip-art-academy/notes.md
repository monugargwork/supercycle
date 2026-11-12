# Mudkip Art Academy: notes

## Build round 1 (11 Nov 2026)
Direction and build done in one pass, on the user's instruction ("create the direction and continue the edit and dont wait for my permission").

- Build: `build/src/videos/mudkip/` (composition `MudkipReel`, 2250 f, 30 fps). The timeline reads `plan.json` directly: camera keys, glides, pushes, kicks, depth of field, dissolves and titles are never retyped in code.
- Real cards only (standing rule): Art Academy Mudkip, raincoat Pikachu, 1997 No.1 Trainer, Base Set Charizard, eight Scarlet & Violet commons on the factory line, eight XY (2014) commons in the shop. Sources in `cards/SOURCES.txt`.
- Sound: `build/audio/mudkip_audio.py` (score, SFX on the plan's frames, a few meme sounds where they are the joke: Kaching, Emoji Laugh, Huh, Instagram Thud, Sad Violin).

### Changed while building (plan.json updated each time, check re-run)
| Scene | What changed | Why |
|---|---|---|
| S01 | The sack is held behind and above his head, not over his face | Arms are a fixed 0.47 m: he cannot hold it higher, and it must not hide his face |
| S02 | dC points toward the cash desk (screen right), not dA to the left | The desk is on that side of the room |
| S03 | The lens hangs over the belt looking down the line | In 9:16 the cards left the frame sideways from any side angle |
| S05 | The handheld's lid is open 145 degrees; the desk is deeper | So the console reads from the front in S04 and no floor shows in the top-down view |
| S05 -> S06 | The match cuts across the desk: after it the lens is on our side | From his side the card would be upside down for us in the pull-back |
| S08-S18 | The locked frame is 50 degrees wide; columns are 22 cm wide; desk top at 1.47 m | To fit the auctioneer, the board and two columns side by side, with the gavel hand visible above the desk |
| S12, S18 | The attendant stands behind the line of the columns | In front of them his head hid the slab |
| S04-S06 | A seated character's 3D arms now start at the drawn shoulders (`frontPts` knows about sitting); he holds the block up under his chin | The arms came out of his cheeks, and at chest height the block was hidden behind the parcel |
| S15 | The balance has unequal arms (2.5 m and 7.5 m) and runs away from the lens | So a villa-sized villa fits a 9:16 frame and rises 3.9 m when the pan drops 1.3 m |
| S16 | A loupe on the label's grade, not a tally counter | A counter was too small to read once the frame widened for the 100 cards |
| S17 | A gust blows the 97 loose cards away, not two forearms | Arms sweeping the table would have hit the three slabs too |

### Open
- Not yet seen in motion: only check stills were rendered in the cloud (every ~47 frames plus the beats). Timing of glides and the physics arcs want a look in the first full render.
- S18's glide to the cushion is fast (about 63 px per frame at 720p).
