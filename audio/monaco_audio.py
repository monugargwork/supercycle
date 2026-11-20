# Sound for the Monaco auction reel: an original synthesized score (a stately saleroom waltz-pizz under the hook and the lots ->
# a golden harbour pad -> the bidding pizz -> a music-box flashback for 2006 -> a warm low cellar pad that thins as the boxes rip
# -> the music box again for mum, ending on a warm chord), SFX on the picture's event frames (mirrors src/videos/monaco/story.ts and
# plan.json), and a few of the user's meme sounds (public/monaco/memes/*.mp3), all under the untouched voice: music ducked under
# speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/monaco/mix.wav (48 kHz stereo, exact length) + stems.   python3 monaco_audio.py ../public/monaco/voice.wav ../public/monaco/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2280
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "monaco", "memes")

def S(*xs):
    n = max(len(x) for x in xs); out = np.zeros(n)
    for x in xs: out[: len(x)] += x
    return out

def thud(f0=70, dur=0.35, r=R, click=0.4):
    t = tt(dur)
    y = np.sin(TAU * f0 * t * (1 + 0.6 * np.exp(-t / 0.03))) * np.exp(-t / 0.09)
    y += lp(r.standard_normal(len(t)), 1200) * np.exp(-t / 0.02) * click
    return fades(y, 0.0005, 0.03)

def noise_burst(dur, lo, hi, r=R, att=0.005, dec=0.08):
    t = tt(dur)
    return fades(bp(r.standard_normal(len(t)), lo, hi) * (1 - np.exp(-t / att)) * np.exp(-t / dec), 0.001, 0.02)

def chime(fs, r=R, gap=0.07):
    out = np.zeros(ns(1.6 + gap * len(fs)))
    for i, f in enumerate(fs):
        g = glock(f, 0.6, r, 1.5); out[ns(i * gap): ns(i * gap) + len(g)] += g
    return out

def click(r=R):
    return S(noise_burst(0.03, 2000, 8000, r, 0.0005, 0.006), thud(1400, 0.02, r, 0.2) * 0.3)

def flick(r=R):
    return noise_burst(0.08, 2500, 9000, r, 0.002, 0.02)

def crowd(dur, r, cheer=False):
    t = tt(dur)
    y = bp(colored(len(t), r, 0.4), 300 if cheer else 250, 3200 if cheer else 1800) * (1 + 0.35 * np.sin(TAU * 0.6 * t))
    if cheer: y *= np.minimum(1, t / 0.15) * np.exp(-np.maximum(0, t - 1.2) / 1.0)
    return fades(y * 0.4, 0.05, 0.4)

def meme(name, secs=None, fade=0.05):
    """decode one of the user's meme mp3s (mono, 48 kHz), optionally trimmed to its first `secs` seconds"""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(MEMES, name), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.float32).astype(np.float64)
    if secs: y = y[: ns(secs)]
    y = fades(y, 0.003, fade)
    return y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.1  # roughly level-matched; the mix sets the bus level

# ================================================================ score
B = 60.0 / 96

def score():
    mus = np.zeros((2, N)); r = rng(11)
    C = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 55]]  # Am F G Em
    def pizz(t0, t1, root=0, g=0.8, half=False, sn=False):
        step = B / 2 if half else B; bass = [33, 40, 41, 40, 43, 40, 38, 40]
        for i in range(int((t1 - t0) / step)):
            t = t0 + i * step
            place(mus, pan(pluck(m2f(bass[i % 8] + 12 + root), 0.8, r, 0.6 if not half else 0.35, 0.4), -0.15), t, g)
            if i % 2: place(mus, pan(snare(0.3, r, 0.2), 0.2) if sn else pan(brush(0.45, r), 0.3), t, 0.4 * g)
            if i % 4 == 2: [place(mus, pan(vibes(m2f(m + root), 0.35, r, 1.0, damp=0.35), 0.25), t + step / 2, 0.35 * g) for m in C[(i // 4) % 4][1:]]
    def padrun(t0, t1, g=0.6, warm=600, up=0):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(4 * B, t1 - t); place(mus, pad([m2f(m + up) for m in C[k % 4][1:]], d, 0.28, r, att=0.3, rel=0.5, warm=warm), t, g); t += 4 * B; k += 1
    def box(t0, t1, g=0.6, up=12):
        t = t0; k = 0
        while t < t1 - 0.4:
            ch = C[(k // 8) % 4]; place(mus, pan(musicbox(m2f(ch[1:][k % 3] + up), 0.35, r, 1.0), 0.3 * np.sin(k)), t, 0.32 * g / 0.6)
            if k % 8 == 0: place(mus, pad([m2f(m) for m in ch[1:]], min(8 * B / 2, t1 - t), 0.25, r, att=0.4, rel=0.6, warm=800), t, g)
            t += B / 2; k += 1
    # the hook: timpani + cymbal on the gavel, then the saleroom pizz; a timpani under the box thump
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(3), 0.8); place(mus, widen(cymbal(0.7, r, 2.2), r), fr(3), 0.3)
    pizz(fr(10), fr(270), 0, 0.6)
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(257), 0.7)
    padrun(fr(276), fr(400), 0.6, 900)                             # the harbour, golden
    pizz(fr(396), fr(660), 2, 0.6, half=True)                      # 70 lots, the gentlemen
    for i, m in enumerate([69, 72, 76, 81]): place(mus, pan(brass(m2f(m), 0.5, 0.7, r, kind="stab"), 0.1), fr(630) + 0.05 * i, 0.4)
    padrun(fr(661), fr(960), 0.55, 700)                            # the box, under glass
    for i, m in enumerate([60, 64, 67, 72]): place(mus, pan(brass(m2f(m), 0.8, 0.8, r, kind="stab"), 0.0), fr(941) + 0.08 * i, 0.55)   # fanfare for the crown
    pizz(fr(964), fr(1080), 0, 0.6, sn=True)
    box(fr(1118), fr(1190), 0.6)                                   # 2006 flashback
    padrun(fr(1187), fr(1519), 0.5, 800); pizz(fr(1390), fr(1515), 0, 0.5, half=True)
    padrun(fr(1519), fr(1636), 0.45, 500, -12)                     # wait...
    padrun(fr(1633), fr(1840), 0.55, 600)                          # the cellar
    padrun(fr(1836), fr(1996), 0.5, 400, -12)                      # the boxes rip: hollow
    pizz(fr(1996), fr(2060), 0, 0.6, half=True, sn=True)           # the scramble
    box(fr(2063), fr(2196), 0.6)                                   # mum
    padrun(fr(2196), fr(2280), 0.6, 900)
    for i, m in enumerate([57, 64, 69, 72, 76]): place(mus, pan(vibes(m2f(m), 0.5, r, 2.0, damp=0.2), 0.1), fr(2262) + 0.06 * i, 0.5)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.3

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.35, d=0.6: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    gavel = lambda f0, g=1.0: P(S(thud(140, 0.3, r, 1.0), clink(r, 900, 0.2), wood_crack(r) * 0.6), fr(f0), g)
    steps = lambda a, n, gap=8, g=0.3, p=0.2: [P(thud(200, 0.08, r, 0.4), fr(a + gap * k), g, p) for k in range(n)]
    room = lambda a, b, g=0.25: P(widen(crowd(fr(b - a), r), r), fr(a), g)
    # S01 the gavel, the murmur, the diamond, the watch tick, footsteps, the thump
    gavel(3, 1.0); room(0, 276, 0.18); P(chime([m2f(96), m2f(100)], r, 0.05), fr(80), 0.3)
    for k in range(10): P(clink(r, 3600, 0.01) * 0.4, fr(105 + 4 * k), 0.2, 0.2)
    steps(185, 6, 9, 0.3, 0.3); P(S(thud(70, 0.5, r, 1.0), noise_burst(0.2, 300, 2500, r, 0.005, 0.08)), fr(257), 1.0)
    # S02-S03 out the window: gulls, water, a horn; back in
    W(fr(290), 0.35, 1.0); P(widen(fades(bp(colored(ns(fr(120)), r, 0.6), 200, 1200) * 0.25, 0.3, 0.4), r), fr(280), 0.3)
    for f0 in [300, 330, 352]: P(pan(fades(np.sin(TAU * (1800 + 400 * np.sin(TAU * 7 * tt(0.25))) * tt(0.25)) * np.exp(-tt(0.25) / 0.1), 0.01, 0.05), 0.4), fr(f0), 0.08)
    P(fades(np.sin(TAU * 110 * tt(1.2)) * 0.4 + np.sin(TAU * 165 * tt(1.2)) * 0.2, 0.15, 0.4), fr(360), 0.12)
    W(fr(420), 0.35, 0.9)
    # S04 paddles up in unison
    W(fr(630), 0.4, 0.3); P(S(*[click(r) for _ in range(3)]), fr(631), 0.5)
    # S05 footsteps, the door click, the gleam, the crown, the spot
    steps(676, 3, 8, 0.25); P(S(click(r), clink(r, 2200, 0.03)), fr(716), 0.6); P(chime([m2f(91), m2f(96), m2f(100)], r, 0.06), fr(866), 0.3)
    P(clink(r, 1500, 0.05), fr(935), 0.4); P(S(thud(400, 0.06, r, 0.6), click(r)), fr(941), 0.6)
    # S06 flaps
    for f0 in (989, 1032):
        for k in range(6): P(click(r), fr(f0) + 0.03 * k, 0.35, -0.1)
    # S07 chair scrape + clatter
    P(noise_burst(0.25, 400, 3000, r, 0.01, 0.1), fr(1084), 0.5); P(S(thud(160, 0.2, r, 0.8), wood_crack(r) * 0.5), fr(1096), 0.8)
    # S08 kitchen: sizzle, bowl slide, coin roll
    P(widen(fades(bp(colored(ns(fr(68)), r, 0.2), 2000, 8000) * 0.12, 0.1, 0.2), r), fr(1118), 0.25)
    P(noise_burst(0.35, 500, 3000, r, 0.02, 0.15), fr(1125), 0.3); P(fades(bp(colored(ns(0.9), r, 0.4), 3000, 7000) * 0.2 * (1 + np.sin(TAU * 18 * tt(0.9))), 0.01, 0.2), fr(1150), 0.3)
    # S09 the spot clunk, the gleam
    P(S(thud(400, 0.06, r, 0.6), click(r)), fr(1219), 0.6); P(chime([m2f(93), m2f(98)], r, 0.06), fr(1300), 0.3)
    # S10 ten little ticks as the scooters pass
    for k in range(10): P(clink(r, 2000 + 120 * k, 0.03), fr(1462 + 3.6 * k), 0.25, 0.1)
    # S11 footsteps, bottle clink
    steps(1528, 3, 8, 0.25, 0.3); P(clink(r, 1800, 0.08), fr(1600), 0.45)
    # S13 the cork squeak, POP, two cork bounces, the pour
    P(creak(0.25, r, 900, 700), fr(1722), 0.3); P(S(thud(600, 0.05, r, 1.0), noise_burst(0.08, 1000, 6000, r, 0.001, 0.03)), fr(1733), 0.9)
    for f0 in (1754, 1760): P(clink(r, 1300, 0.02), fr(f0), 0.3)
    P(fades(bp(colored(ns(fr(22)), r, 0.3), 300, 1500) * 0.35 * (1 + 0.5 * np.sin(TAU * 9 * tt(fr(22)))), 0.03, 0.08), fr(1746), 0.5)
    # S15 seventeen rips, accelerating, and the year ticks
    open_at = [1866 + round(6.6 * n) for n in range(17)]
    for f0 in open_at: P(fades(bp(colored(ns(0.22), r, 0.2), 1500, 9000) * np.exp(-tt(0.22) / 0.08), 0.002, 0.04), fr(f0), 0.45, 0.3 * np.sin(f0))
    for k in range(20): P(click(r), fr(1840 + 7.25 * k), 0.15)
    P(chime([m2f(96), m2f(100), m2f(103)], r, 0.06), fr(1988), 0.35)
    # S16 the scramble: a bidding hubbub, paddle whooshes
    P(widen(crowd(fr(40), r, cheer=True), r), fr(2022), 0.4)
    for k in range(12): W(fr(2024 + 2 * k), 0.12, 0.2)
    # S17 wrap crinkle, the snatch, footsteps, the thunk on the cupboard
    P(noise_burst(0.3, 3000, 9000, r, 0.01, 0.1), fr(2122), 0.3); W(fr(2134), 0.35, 0.3); steps(2150, 3, 7, 0.25, -0.2); P(thud(180, 0.15, r, 0.6), fr(2176), 0.5)
    # S18 door creak, footsteps
    P(creak(0.5, r, 300, 200), fr(2198), 0.35); steps(2202, 4, 8, 0.25, 0.3)
    return out

# ================================================================ meme sounds (the user's folder), only where they are the joke
MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (257, "Instagram Thud.mp3", None, 0.7),
    (1084, "Huh5544.mp3", None, 0.9),
    (1494, "Wowwwwwwwwwwwwwwwww.mp3", 1.8, 0.5),
    (1525, "Suspicious Sound.mp3", 2.0, 0.7),
    (1733, "Kaching Sound FX.mp3", None, 0.0),
    (1985, "Meme Violin Sad Violin.mp3", 2.2, 0.45),
    (2244, "Romantic.mp3", 2.5, 0.5),
]

def memes():
    out = np.zeros((2, N))
    for f0, name, secs, g in MEME_CUES:
        if g <= 0: continue
        place(out, pan(meme(name, secs, 0.08 if secs else 0.03), 0.0), fr(f0), g)
    return out

# ================================================================ mix
def main(voice_path, out_path):
    v, sr = read_wav(voice_path); assert sr == SR
    v = st(v)[:, :N]; v = np.pad(v, ((0, 0), (0, N - v.shape[1])))
    mus, fx, mm = score(), sfx(), memes()
    hop = SR // 100
    def env_duck(sig, db):
        m = sig.mean(0); nb = len(m) // hop
        e = np.sqrt((m[: nb * hop].reshape(nb, hop) ** 2).mean(1)); on = np.clip((20 * np.log10(e + 1e-6) + 40) / 10, 0, 1)
        g = np.zeros_like(on); a, rl = 1 - np.exp(-1 / 4.0), 1 - np.exp(-1 / 30.0)
        for i in range(1, len(on)): g[i] = g[i - 1] + (a if on[i] > g[i - 1] else rl) * (on[i] - g[i - 1])
        return dbg(db * np.interp(np.arange(len(m)) / hop, np.arange(nb), g))
    vl = integrated(v)
    mus = mus * dbg((vl - 15) - integrated(mus))
    fx = fx * dbg((vl - 10) - integrated(fx))
    mm = mm * dbg((vl - 4) - integrated(mm))           # the memes sit just under the voice: they are the jokes
    duck = np.minimum(env_duck(v, -7), env_duck(mm, -6)) # music dips under speech and under each meme
    mix = v + mus * duck[None, :] + fx + mm * env_duck(v, -3)[None, :]
    mix = mix * dbg(-14 - integrated(mix))
    if true_peak(mix) > -1.0: lim = dbg(-1.0); mix = np.tanh(mix / lim) * lim
    write_wav(out_path, mix, 16)
    for nm, x in [("music", mus), ("sfx", fx), ("memes", mm)]: write_wav(out_path.replace(".wav", f"_{nm}.wav"), x, 16)
    print("mix", out_path, "LUFS", round(integrated(mix), 2), "TP", round(true_peak(mix), 2), "len", mix.shape[1] / SR)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
