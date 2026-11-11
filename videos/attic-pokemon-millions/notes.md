
## Build round 1 (10 Nov 2026), check-still fixes
- Hook / shot 8: the stack now starts at the hatch's front-right corner (it covered his face). Shot 8 runs the same move 2.5x quicker, so he's down before the hatch shuts on SHUT8; dust starts only after the shut.
- S05: the camera was behind the chair (showed the chair back, and dad facing away). Now it's side-on from the right: kids just inside the doorway, a landing wall behind the door (not sky), dad in the foreground hugging the binder on his chest with both arms in 3D.
- S11: after the plonk the old man side-walks left so the stack is clear for the open and the jaws. staffA cut. The valuer stands back at z 2.25.
- S12: higher camera and a smaller lift so the binder doesn't cover the valuer's face.
- S16: book position bug fixed (it was placed in world coords inside the study group). Right hand puts the card in, left hand lifts the cover and lets it fall, right hand rests on the closed cover.
- S18/S19: crowd moved back toward the rostrum (a head blocked the view), price board 1.4x0.55 so the close-up fits it, the S19 board shot is a slow push.
- S20: re-aimed (old man upper-left, patch of light lower-right).
- toon armOff: 2 = both card arms hidden (stops arms being drawn twice when both are 3D).
- Render: Remotion Lambda (scripts/lambda-attic.sh), --gl=swangle, 1440x2560, captions burned in.

## Frame.io v1 notes (11 Nov 2026), Attic v1.mp4
| Time | Note | Change |
|---|---|---|
| 0:09 (f270) | use a real TCG card | The traded card is a real Base Set Charizard scan |
| 0:14 (f426) | real card | Dad holds up the real Base Set Charizard |
| 0:17 (f519) | real cards on the eBay page | Listings show real Base Set (Charizard), Jungle (Jigglypuff) and Fossil (Psyduck) cards, bigger thumbnails |
| 0:31 (f957) | real card, zoom out, not visible | Newspaper photo is the real Charizard; insert camera higher and wider (fov 40), the whole page is in frame; paper turned the right way up for him (he sits at -z), moved clear of the mouse |
| 0:35 (f1071) | remove the meme sfx, irrelevant | Gogogogogo cut from the mix |
| 0:45 (f1350) | real cards | The loose heap is 20 real 1999-2000 commons (Base, Jungle, Fossil, Neo Genesis) |
| 0:47 (f1437) | "improve this animation" | The flat 2D binder that popped in and squashed open is replaced by a real 3D binder: it drops onto the table (gravity, small bounce, dust puff, camera kick, thud), the cover swings up toward the lens and flops over, the page is the real Skyridge holos, a soft gleam runs across |
| 0:55 (f1656) | real card | The bent, dropped and traded cards are real (Bulbasaur, Squirtle, Charmander); S16's stored card is the real Legendary Collection Charizard (the auction's top lot) |

Taste note (standing rule): every reel uses real TCG card scans, fetched fresh for that video and relevant to its story
(right sets, right era, the actual cards named in the facts). Never drawn stand-in cards. Sources in cards/SOURCES.txt
(Pokémon TCG image CDN, picked via the PokemonTCG/pokemon-tcg-data set lists; sets 1999-2003 to match "A Decade of Masters").
