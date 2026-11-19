# Story reels: the sources we edit with

Everything outside the code that these reels are made from: where it lives, and how to use it. On the Mac, a session can open these paths directly. A cloud session reaches them only through the linked computer, or the user attaches files.

## 1. The loved reference reels (the quality bar)
- **Where:** `~/Downloads/reference/` on the Mac.
  - `How a Mirror Rigged a Horse Race.mp4`
  - `The Pink Prison Cell Experiment.mp4`
  - `Why Perfect Railroads Don't Work.mp4`
  - `Why Sailors Carried Storm Oil.mp4`
- **What:** four vertical cartoon explainers of about 64 s each. The user "absolutely loves" them. They were studied frame by frame against their voiceovers (Nov 2026), and what they teach is the **Reference grammar** in the `story-reel-director` skill:
  - the hook is an act with debris;
  - place changes travel and time changes dissolve, with only 1-7 hard cuts per reel;
  - shots framed through objects;
  - the same framing with a changing state;
  - literal sight gags;
  - invisible forces made visible;
  - everyday measuring objects;
  - a calm "you see" set;
  - reactions that carry the story;
  - light and weather as the story arc;
  - a physical catastrophe with an aftermath gag;
  - lived-in sets;
  - stylised FX with physical motion.
- **Use:** look at them before directing a new reel, for the grammar only. Never copy their stories, characters or shots.
- **Contact sheet to look at one:** `ffmpeg -i "<reel>.mp4" -vf "fps=1/2,scale=270:-1,tile=6x6" -frames:v 1 sheet.jpg`. The videos and sheets stay off this public repo.

## 2. Meme sounds
- **Where:** `~/Downloads/meme sounds/` on the Mac, about 50 mp3s.
  - Reactions: Emoji Laugh, Huh5544, BRUH, Wowww, Realization Sound, Aughhhh Tiktok, Anime Ahh, Nelly Ahh, OH SHIT! Echo, MY MAN!, Hehe Boiiiiiii, Vocalization Meme, FAAAAh.
  - Hits: Instagram Thud, Punch Hit, Slap31, Bone Crack, Doge Bonk, Chomp, Boxing Bell, Pistol-Shot.
  - Money and phones: Kaching Sound FX, Mobile Payment, Phone Alert, Discord Notification, Yo Phone Ringing, Keyboard Click, Computer Error Sound, Camera shutter.
  - Mood: Meme Violin Sad Violin, Cinemaitc Suspense Riser, Romantic, Suspicious Sound, Runner Game, Game Death Sound.
  - Gags: Buzzer, Censor Beep, Sike! That's The Wrong Number!, Gogogogogo, Cs Ok Lets Goi, EAGLE RAHHH, Crow, Chicken, Quack, Meow, Kids Cheering, Loud Fart.
- **Use:** only where the sound itself is the joke (a few per reel). Copy the ones a reel uses into `public/<reel>/memes/` and cue them in `audio/<reel>_audio.py` (`MEME_CUES`, on the plan's frames). Everything else is synthesized (`audio/sfx_gen.py`, `instruments.py`).
- The same folder sometimes holds the user's latest ElevenLabs VO exports and Frame.io CSVs (e.g. `Attic v1.csv`). Check it when he says he "put it there".

## 3. Voiceover
- ElevenLabs, voice **Trung Caha – Clear, Firm and Informative** (Vietnamese), recorded by the user from the approved script.
- About 4 syllables per second, so 220-280 syllables make about 55-70 s.
- `scripts/vo_words.py` turns it into `words.json`.

## 4. Real TCG cards
- Real scans for every reel, relevant to its story. Never drawn stand-ins.
- Hosts that work from the cloud shell: `images.pokemontcg.io` (English sets by set and number) and `cdn6966.templcdn.com` (pokumon.com, including Japanese promos).
- Every scan we fetch is kept once in `library/cards/<set>/<name>.png`, listed in `library/cards/CATALOG.md` (card, set, number, source, which reels used it). Look there first: `python3 scripts/card.py find charizard`. New scans: `card.py add <name> <set> <no>` (pokemontcg.io by default, `--url` for any other host). Into a reel: `card.py use <reel> <name>[:<alias>] …`.
- Each reel lists its cards in `videos/<slug>/cards/SOURCES.txt`. The PNGs the build loads are in `public/<reel>/cards/`.

## 5. Fonts
- Titles: **Bolota Bold** (`public/fonts/bolota-bold.ttf`, also in `~/Library/Fonts`), through Enzo's `Title2` (`src/enzo/`). It lacks Ơ Ư Ầ Ệ Ỉ Ớ, so titles use digits and plain Latin only.
- Captions: **Inter Regular** (`public/fonts/Inter-Regular.woff2`).
- Also installed on the Mac, unused so far: Phudu, Playwrite VN (both have full Vietnamese glyphs) and Brock.

## 6. The original kit
- `SKILL.md`, `templates/` and `references/` come from the free *cartoon-3d-short* skill (mromidev/claude-animated-shorts).
  - `references/STYLE_BIBLE.md` holds the script and visual formula measured from 20 shorts.
  - `references/reports/` holds measured motion, depth, textures, characters, lighting, outlines and grade.
  - `references/frames/` and `references/sheets/` hold reference frames and contact sheets.
- Use them to check the look: frames are compared against `references/frames/`.

## 7. Reviews
- The user reviews drafts on **Frame.io** (Monu's Team → project "Enzo Main Channel"; Mudkip v1 lives there) and sends the comments as a CSV export.
  - The `Frame` column is at 30 fps.
  - Each comment becomes a row in `videos/<slug>/notes.md`.

## 8. Story topics
- The user picks stories from his topic list (e.g. `Vietnam_Channel_Topics.PDF`) or sends a news article.
- The script comes first (skill `vn-news-script`), with facts checked against a second source and kept in `videos/<slug>/facts.md`.
