# Sound for the Mudkip Art Academy reel: an original synthesized score (a hit for the cash sack -> bouncy pizzicato for the
# laughing collectors -> a warm music box at Daisuke's desk -> a pizzicato climb that steps up with every sale -> snare roll and
# brass for the hammer -> a hush for the explanation -> a soft horn for the trophy card -> one music-box note on the last frame),
# SFX on the picture's event frames (mirrors src/videos/mudkip/story.ts and plan.json), and a few of the user's meme sounds
# (public/mudkip/memes/*.mp3), all under the untouched voice: music ducked under speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/mudkip/mix.wav (48 kHz stereo, exact length) + stems.   python3 mudkip_audio.py ../public/mudkip/voice.wav ../public/mudkip/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2250
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "mudkip", "memes")

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
B = 60.0 / 112
GAV = [990, 1179, 1357, 1563, 2159]

def score():
    mus = np.zeros((2, N)); r = rng(11)
    C = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]  # C, Am, F, G
    hook = [(0, 76), (0.5, 79), (1.0, 81), (1.5, 79), (2.0, 76), (2.5, 72)]
    def pizz(t0, t1, root=0, g=0.8, sn=False, half=False):
        step = B / 2 if half else B; bass = [36, 43, 45, 43, 41, 48, 43, 47]
        for i in range(int((t1 - t0) / step)):
            t = t0 + i * step
            place(mus, pan(pluck(m2f(bass[i % 8] + root), 0.8, r, 0.8 if not half else 0.4, 0.4), -0.15), t, g)
            if i % 2: place(mus, pan(snare(0.35, r, 0.2), 0.2) if sn else pan(brush(0.5, r), 0.3), t, 0.45 * g)
            if i % 4 == 2 and not half: [place(mus, pan(vibes(m2f(m + root), 0.4, r, 1.0, damp=0.35), 0.25), t + B / 2, 0.4 * g) for m in C[(i // 4) % 4][1:]]
    def calm(t0, t1, g=0.7):
        t = t0
        while t < t1 - 0.5:
            ch = C[int((t - t0) / (8 * B)) % 4]
            place(mus, pad([m2f(m) for m in ch[1:]], min(8 * B, t1 - t), 0.28, r, att=0.4, rel=0.6, warm=700), t, g)
            for k in range(16):
                if t + k * B / 2 > t1 - 0.3: break
                place(mus, pan(musicbox(m2f(ch[1:][k % 3] + 12 + (12 if k % 8 >= 4 else 0)), 0.35, r, 1.0), 0.3 * np.sin(k)), t + k * B / 2, 0.35 * g / 0.7)
            t += 8 * B
    # hook: a held pad under the wind-up, timpani + cymbal on the slam, the glock hook as the camera finds the slab
    place(mus, pad([m2f(m) for m in [48, 55, 60]], fr(29), 0.3, r, att=0.2, rel=0.2, warm=500), 0.0, 0.6)
    place(mus, pan(timpani(m2f(36), 0.9, r, 2.0), 0), fr(29), 0.9); place(mus, widen(cymbal(0.7, r, 2.2), r), fr(29), 0.35)
    for dt, m in hook: place(mus, pan(glock(m2f(m), 0.5, r, 1.2), 0.1), fr(62) + dt * B * 0.6, 0.4)
    pizz(fr(124), fr(272))                     # the laughing collectors
    pizz(fr(275), fr(362), 0, 0.6, half=True)  # the factory: a mechanical tick
    calm(fr(366), fr(775))                     # Daisuke's desk
    for dt, m in hook: place(mus, pan(glock(m2f(m + 12), 0.5, r, 1.2), 0.1), fr(586) + dt * B * 0.5, 0.45)   # it won
    pizz(fr(779), fr(855), 0, 0.7)             # the shop
    pizz(fr(859), fr(1000), 0, 0.6); pizz(fr(1005), fr(1060), 0, 0.5)
    pizz(fr(1063), fr(1183), 2, 0.75, sn=True); pizz(fr(1187), fr(1362), 4, 0.85, sn=True)   # every sale a step higher
    for i in range(int((fr(1496) - fr(1368)) / (B / 2))):   # the Goldin sale: driving pizz, the snare creeps in
        t = fr(1368) + i * B / 2
        place(mus, pan(pluck(m2f(43 + (i // 8) % 2 * 2), 0.9, r, 0.4, 0.5), -0.1), t, 0.7)
        if i % 2 == 1: place(mus, pan(snare(0.25 + 0.5 * i / 30, r, 0.2), 0.2), t, 0.4)
    n = int((fr(1557) - fr(1496)) * 24)        # the hammer: a snare roll, cut dead for the stillness, then the strike
    for k in range(n): place(mus, pan(snare(0.15 + 0.6 * k / n, r, 0.2, snappy=0.8, buzz=True), 0.1), fr(1496) + k / 24, 0.42)
    place(mus, pan(timpani(m2f(36), 0.9, r, 2.0), 0), fr(1563), 1.0); place(mus, widen(cymbal(0.7, r, 2.4), r), fr(1563), 0.4)
    for dt, m, d in [(0.08, 60, 0.3), (0.38, 64, 0.3), (0.68, 67, 0.9)]: place(mus, pan(brass(m2f(m), d, 0.75, r, kind="horn" if m > 62 else "tuba"), 0.1), fr(1563) + dt, 0.6)
    place(mus, pan(brass(m2f(36), 0.5, 0.8, r, kind="tuba"), 0), fr(1638), 0.7); place(mus, pan(timpani(m2f(31), 0.9, r, 1.6), 0), fr(1638), 0.9)   # the villa
    calm(fr(1675), fr(1990), 0.6)              # the explanation
    for i, (m, d) in enumerate([(60, 1.2), (64, 1.2), (67, 1.6)]): place(mus, pan(brass(m2f(m), d, 0.5, r, kind="horn"), 0.1), fr(2033) + i * 1.25, 0.4)   # the trophy card
    place(mus, pad([m2f(m) for m in [48, 55, 60, 64]], fr(2160) - fr(1996), 0.25, r, att=0.8, rel=0.4, warm=700), fr(1996), 0.6)
    place(mus, pan(timpani(m2f(36), 0.9, r, 2.0), 0), fr(2159), 0.8)
    place(mus, pan(musicbox(m2f(84), 0.5, r, 2.0), 0.1), fr(2236), 0.6)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.3

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.35, d=0.6: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    gavel = lambda f0, g=1.0: P(S(thud(140, 0.3, r, 1.0), clink(r, 900, 0.2), wood_crack(r) * 0.6), fr(f0), g)
    flap = lambda f0: [P(click(r), fr(f0) + 0.04 * k, 0.5, -0.1) for k in range(5)]
    ticks = lambda a, b, g=0.3: [P(clink(r, 2600 + 900 * k / max(1, (b - a) // 2), 0.02) * 0.5, fr(a + 2 * k), g, 0.1) for k in range((b - a) // 2)]
    # S01: the swing, the sack on the desk, coins and paper
    W(fr(27), 0.5, 0.4); P(S(thud(70, 0.45, r, 1.0), noise_burst(0.5, 300, 3000, r, 0.01, 0.25)), fr(29), 1.0)
    for k in range(9): P(thud(260, 0.06, r, 0.5), fr(38 + 2 * k + (k * 5) % 3), 0.3, 0.3 * np.sin(k))
    P(widen(fades(bp(colored(ns(1.8), r, 0.4), 1500, 7000) * 0.12, 0.05, 0.8), r), fr(31), 0.5)
    P(chime([m2f(91), m2f(96), m2f(100)], r, 0.05), fr(71), 0.45)
    # S02: the card whips out
    P(flick(r), fr(234), 0.6); P(chime([m2f(93), m2f(98)], r, 0.05), fr(238), 0.4)
    # S03: motor hum, hiss + stamp on each contact, belt clack on each index
    P(widen(fades(lp(colored(ns(fr(366 - 275)), r, 0.8), 180) * 0.5, 0.2, 0.3), r), fr(275), 0.5)
    for c in [277, 292, 307, 322, 337, 352]:
        P(noise_burst(0.12, 3000, 9000, r, 0.01, 0.05), fr(c - 3), 0.3); P(S(thud(95, 0.25, r, 0.9), clink(r, 700, 0.08)), fr(c), 0.8); P(click(r), fr(c + 4), 0.4, -0.2)
    # S04/S05: stylus taps and scratch; it wins; fists
    for k in range(14): P(click(r) * 0.5, fr(372 + 6 * k), 0.3, -0.1)
    P(widen(fades(bp(colored(ns(fr(551 - 466)), r, 0.2), 2500, 6500) * (0.6 + 0.4 * np.sin(TAU * 5 * tt(fr(551 - 466)))) * 0.1, 0.1, 0.2), r), fr(466), 0.5)
    P(chime([m2f(84), m2f(88), m2f(91), m2f(96)], r, 0.06), fr(586), 0.55);
    # S06: through the screen, the parcel, the block lifted
    W(fr(660), 0.35, 0.7); P(noise_burst(0.4, 1500, 7000, r, 0.02, 0.15), fr(668), 0.3); P(glock(m2f(96), 0.6, r, 1.4), fr(692), 0.5); P(noise_burst(0.3, 300, 2500, r, 0.03, 0.12), fr(737), 0.35)
    # S07: door bell, the foil rip, cards on the tiles
    P(chime([m2f(88), m2f(84)], r, 0.18), fr(781), 0.4); P(noise_burst(0.22, 2500, 10000, r, 0.002, 0.08), fr(829), 0.7)
    for k in range(5): P(flick(r), fr(846 + 2 * k), 0.3, 0.2 * np.sin(k))
    # the stage: flaps, shimmer, digit ticks, gavels, applause
    flap(881); P(chime([m2f(93), m2f(98), m2f(103)], r, 0.05), fr(925), 0.4); ticks(953, 988); gavel(990, 0.8); P(widen(crowd(1.4, r, True), r), fr(992), 0.35)
    flap(1072); ticks(1111, 1175, 0.35); P(S(thud(110, 0.3, r, 1.0), clink(r, 500, 0.25), rattle(0.3, r, 40.0) * 0.5), fr(1127), 0.9); gavel(1179); P(widen(crowd(1.6, r, True), r), fr(1181), 0.5)
    flap(1195); P(chime([m2f(88), m2f(91), m2f(96)], r, 0.07), fr(1246), 0.4); ticks(1313, 1352, 0.35); gavel(1357); P(widen(crowd(1.8, r, True), r), fr(1359), 0.55)
    flap(1376)
    for k in range(4): P(thud(170, 0.1, r, 0.5) * 0.6, fr(1390 + 8 * k), 0.4, 0.3)
    P(clink(r, 1400, 0.08), fr(1433), 0.5); P(chime([m2f(91), m2f(96)], r, 0.05), fr(1435), 0.35)
    P(widen(crowd(fr(1557) - fr(1447), r), r), fr(1447), 0.6)
    for f0 in [1449, 1452, 1455, 1460, 1465, 1469, 1471, 1476, 1479, 1481]: W(fr(f0 + 3), 0.3, 0.25)
    ticks(1500, 1559, 0.4); gavel(1563, 1.0); P(thud(50, 0.7, r, 0.4), fr(1563), 0.9); P(widen(crowd(3.2, r, True), r), fr(1566), 0.9)
    # S15: the brass beam, the pan on the grass, the villa lands, water
    P(creak(0.4, r, 120, 70), fr(1626), 0.6); P(S(thud(55, 0.6, r, 1.0), noise_burst(0.5, 200, 2000, r, 0.01, 0.25)), fr(1638), 1.0)
    P(rattle(0.5, r, 30.0), fr(1638), 0.5); P(S(thud(75, 0.4, r, 0.9)), fr(1654), 0.7); P(noise_burst(0.5, 500, 5000, r, 0.01, 0.2), fr(1655), 0.5)
    # S16/S17: the table
    P(S(thud(420, 0.06, r, 0.7), clink(r, 1800, 0.05)), fr(1682), 0.6); P(noise_burst(0.35, 1500, 6000, r, 0.05, 0.15), fr(1710), 0.35); P(clink(r, 2200, 0.08), fr(1798), 0.5)
    for k in range(34): P(flick(r) * 0.6, fr(1823 + k), 0.22, 0.4 * np.sin(k * 0.7))
    P(glock(m2f(96), 0.6, r, 1.4), fr(1827), 0.5)
    for f0 in [1903, 1910, 1917]: P(S(thud(380, 0.07, r, 0.8), clink(r, 1600, 0.06)), fr(f0), 0.7)
    P(chime([m2f(93), m2f(98), m2f(103)], r, 0.05), fr(1937), 0.45)
    P(widen(whoosh(0.9, r, peak=0.3), r), fr(1950) - 0.15, 0.7); P(widen(fades(bp(colored(ns(0.8), r, 0.3), 2000, 8000) * 0.12, 0.05, 0.5), r), fr(1952), 0.5)
    P(S(thud(90, 0.4, r, 0.6), glock(m2f(72), 0.5, r, 1.6)), fr(1977), 0.6)
    # S18: stone grind (column B, then the podium), shimmer, ticks, gavel, two pings
    grind = lambda a, b: P(widen(fades(lp(colored(ns(fr(b - a)), r, 0.9), 320) * (0.7 + 0.3 * np.sin(TAU * 11 * tt(fr(b - a)))) * 0.7, 0.08, 0.1), r), fr(a), 0.7)
    grind(1996, 2020); P(thud(90, 0.3, r, 0.8), fr(2020), 0.6); P(chime([m2f(84), m2f(91), m2f(96), m2f(100)], r, 0.07), fr(2056), 0.5)
    P(clink(r, 1400, 0.08), fr(2122), 0.5); ticks(2137, 2157, 0.35); gavel(2159, 0.9); grind(2167, 2181); P(thud(80, 0.3, r, 0.8), fr(2181), 0.7)
    P(glock(m2f(88), 0.5, r, 1.2), fr(2182), 0.5); P(glock(m2f(84), 0.5, r, 1.2), fr(2185), 0.5)
    # S19: the card flutters down
    P(widen(fades(bp(colored(ns(0.8), r, 0.3), 2500, 8000) * 0.08, 0.1, 0.3), r), fr(2212), 0.4); P(flick(r), fr(2236), 0.4)
    return out

# ================================================================ meme sounds (the user's folder), only where they are the joke
MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (31, "Kaching Sound FX.mp3", None, 0.8),
    (134, "Emoji Laugh.mp3", 2.6, 0.8),
    (586, "Realization Sound.mp3", 1.6, 0.6),
    (846, "Buzzer.mp3", 0.7, 0.6),
    (1358, "Wowwwwwwwwwwwwwwwww.mp3", 1.5, 0.7),
    (1565, "Kaching Sound FX.mp3", None, 0.9),
    (1582, "Huh5544.mp3", None, 1.0),
    (1654, "Instagram Thud.mp3", None, 0.9),
    (2167, "Meme Violin Sad Violin.mp3", 1.6, 0.6),
    (2205, "Instagram Thud.mp3", None, 0.9), (2209, "Instagram Thud.mp3", None, 0.8), (2213, "Instagram Thud.mp3", None, 0.8),
]

def memes():
    out = np.zeros((2, N))
    for f0, name, secs, g in MEME_CUES:
        place(out, pan(meme(name, secs, 0.08 if secs else 0.03), 0.0), fr(f0), g)
    rz = meme("Cinemaitc Suspense Riser.mp3")   # the suspense riser: its last 3.6 s end in the stillness before the hammer
    place(out, pan(fades(rz[-ns(3.6):], 0.4, 0.02), 0.0), fr(1557) - 3.6, 0.5)
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
