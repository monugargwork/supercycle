# Sound for the Jirachi (Avery the Poke Kid) reel: an original, gentle synthesized score (a soft pad and a slow music-box/vibes
# theme for Avery, a cold low pad under the seller, silence on "Khoan đã", strings-like pads for the family, the theme resolving at
# the end), quiet SFX on the picture's event frames (mirrors src/videos/jirachi/story.ts and plan.json). No meme sounds: a child
# died. All under the untouched voice: music ducked under speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/jirachi/mix.wav (48 kHz stereo, exact length) + stems.   python3 jirachi_audio.py ../public/jirachi/voice.wav ../public/jirachi/mix.wav
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
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "jirachi", "memes")

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
B = 60.0 / 72

def score():
    mus = np.zeros((2, N)); r = rng(11)
    C = [[45, 52, 57, 60], [41, 48, 53, 57], [36, 43, 48, 52], [43, 50, 55, 59]]  # Am F C G
    def padrun(t0, t1, g=0.6, warm=600, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(4 * B, t1 - t); place(mus, pad([m2f(m + up) for m in chords[k % 4][1:]], d, 0.28, r, att=0.6, rel=0.9, warm=warm), t, g); t += 4 * B; k += 1
    THEME = [69, 72, 76, 74, 72, 69, 67, 69, 72, 71, 69, 64]
    def theme(t0, t1, g=0.5, inst=vibes, up=0):
        t = t0; k = 0
        while t < t1 - 0.5:
            place(mus, pan(inst(m2f(THEME[k % len(THEME)] + up), 0.45, r, 2.0), 0.2 * np.sin(k)), t, g); t += B; k += 1
    def low(t0, t1, g=0.5):
        place(mus, pad([m2f(33), m2f(40)], t1 - t0, 0.3, r, att=1.0, rel=1.0, warm=300), t0, g)
    padrun(fr(0), fr(206), 0.45, 450, -12); low(fr(0), fr(206), 0.4)          # the seller: cold and low
    place(mus, pan(vibes(m2f(57), 0.5, r, 3.0, damp=0.3), 0), fr(160), 0.4)   # a low note under the name
    padrun(fr(200), fr(660), 0.5, 900); theme(fr(206), fr(655), 0.42, musicbox)  # Avery's theme
    place(mus, pad([m2f(57), m2f(64), m2f(69), m2f(72)], 3.0, 0.3, r, att=0.4, rel=1.5, warm=1200), fr(571), 0.5)  # the pull
    place(mus, pan(vibes(m2f(45), 0.4, r, 4.0, damp=0.15), 0), fr(700), 0.45)  # his death: one low note
    padrun(fr(764), fr(1170), 0.42, 450, -12); low(fr(764), fr(1165), 0.35)   # the listings, the money
    place(mus, pad([m2f(36), m2f(43)], 3.5, 0.3, r, att=0.2, rel=1.5, warm=250), fr(1276), 0.5)  # after the cut: one cello-like note
    padrun(fr(1312), fr(1830), 0.5, 700, 0, [[45, 52, 57, 60], [41, 48, 53, 57], [38, 45, 50, 53], [40, 47, 52, 56]])  # the family
    padrun(fr(1810), fr(1890), 0.4, 400, -12)
    padrun(fr(1888), fr(2090), 0.5, 1000); theme(fr(1940), fr(2085), 0.4, musicbox, 0)  # the artist
    place(mus, pan(vibes(m2f(57), 0.5, r, 3.0, damp=0.3), 0), fr(2120), 0.35)
    padrun(fr(2145), fr(2250), 0.55, 1100); theme(fr(2150), fr(2240), 0.45, musicbox)
    for i, m in enumerate([57, 64, 69, 72, 76]): place(mus, pan(vibes(m2f(m), 0.45, r, 2.4, damp=0.2), 0.1), fr(2216) + 0.08 * i, 0.45)
    wet = convolve_st(mus, make_ir(2.2, 3, hf=0.55))[:, :N]
    return mus * 0.8 + wet * 0.35

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    tear = lambda f0, g=0.45: P(fades(bp(colored(ns(0.28), r, 0.2), 1500, 9000) * np.exp(-tt(0.28) / 0.09), 0.002, 0.04), fr(f0), g, 0.1)
    crinkle = lambda f0, d=0.5, g=0.2: P(fades(bp(colored(ns(d), r, 0.3), 3000, 9000) * (0.6 + 0.4 * np.sin(TAU * 13 * tt(d))), 0.01, 0.1), fr(f0), g)
    keys = lambda a, b, g=0.18: [P(click(r), fr(a) + k * 0.11, g, 0.15) for k in range(int((fr(b) - fr(a)) / 0.11))]
    ping = lambda f0, g=0.15: P(chime([m2f(91), m2f(96)], r, 0.04), fr(f0), g, 0.2)
    slide = lambda f0, d=0.5, g=0.35: P(fades(bp(colored(ns(d), r, 0.4), 600, 4000) * np.exp(-tt(d) / (d * 0.6)), 0.01, 0.1), fr(f0), g)
    # S01 the slap, wrappers, price ticks, keys
    W(fr(24), 0.25, 0.4); P(S(thud(220, 0.12, r, 0.9), noise_burst(0.06, 2000, 7000, r, 0.001, 0.02)), fr(29), 0.8); crinkle(31, 0.8, 0.15)
    for k in range(8): P(click(r), fr(91 + 3 * k), 0.12)
    keys(134, 199)
    # S02-S04 the hospital room: a soft monitor beep, foil, tears, cards
    for f0 in range(220, 650, 60): P(fades(np.sin(TAU * 1100 * tt(0.08)), 0.005, 0.03), fr(f0), 0.04, -0.3)
    for f0 in [414, 440, 468]: tear(f0); W(fr(f0 + 6), 0.12, 0.3)
    for f0 in [430, 456, 484]: P(noise_burst(0.1, 800, 3000, r, 0.005, 0.04), fr(f0), 0.15)   # into the bin
    crinkle(530, 0.6, 0.2); tear(548, 0.55)
    for k in range(4): P(noise_burst(0.06, 2500, 8000, r, 0.002, 0.02), fr(552 + 4 * k), 0.18)
    P(chime([m2f(93), m2f(98), m2f(100)], r, 0.07), fr(578), 0.25)
    # S06-S08 notifications, bundles sliding, the drop, clicks
    for k in range(12): ping(800 + round(44 / 12 * k), 0.08)
    slide(886, 0.6, 0.3); slide(929, 0.7, 0.4); P(thud(260, 0.1, r, 0.5), fr(948), 0.3); P(S(thud(150, 0.15, r, 0.6), noise_burst(0.12, 400, 2500, r, 0.005, 0.05)), fr(990), 0.5)
    P(click(r), fr(1058), 0.3); P(click(r), fr(1120), 0.2); P(click(r), fr(1143), 0.2)
    # S10-S14 the family: a clock, typing, the post, curtain rings, the phone set down; the error blips
    for k in range(int(fr(1810 - 1312))): P(click(r) * 0.4, fr(1312) + k, 0.08, -0.4)
    keys(1400, 1450, 0.1); keys(1556, 1580, 0.1); P(widen(whoosh(0.4, r, peak=0.15), r), fr(1586), 0.15)
    for k in range(10): P(clink(r, 2500 + 90 * k, 0.03), fr(1758 + 3 * k), 0.08, 0.2)
    P(thud(300, 0.08, r, 0.4), fr(1796), 0.35)
    for k in range(12): P(fades(np.sin(TAU * 330 * tt(0.07)), 0.003, 0.02), fr(1846 + 3 * k), 0.06, 0.2)
    # S15 brush strokes; S17 foil and the tear
    for k in range(6): P(fades(bp(colored(ns(0.3), r, 0.2), 1500, 6000) * 0.5, 0.05, 0.15), fr(1905 + 21 * k), 0.08)
    crinkle(2170, 0.6, 0.2); tear(2201, 0.55); P(chime([m2f(93), m2f(98), m2f(100)], r, 0.07), fr(2220), 0.22)
    return out

# ================================================================ mix
def main(voice_path, out_path):
    v, sr = read_wav(voice_path); assert sr == SR
    v = st(v)[:, :N]; v = np.pad(v, ((0, 0), (0, N - v.shape[1])))
    mus, fx = score(), sfx(); mm = np.zeros((2, N))
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
    duck = env_duck(v, -7)                               # music dips under speech
    mix = v + mus * duck[None, :] + fx + mm * env_duck(v, -3)[None, :]
    mix = mix * dbg(-14 - integrated(mix))
    if true_peak(mix) > -1.0: lim = dbg(-1.0); mix = np.tanh(mix / lim) * lim
    write_wav(out_path, mix, 16)
    for nm, x in [("music", mus), ("sfx", fx)]: write_wav(out_path.replace(".wav", f"_{nm}.wav"), x, 16)
    print("mix", out_path, "LUFS", round(integrated(mix), 2), "TP", round(true_peak(mix), 2), "len", mix.shape[1] / SR)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
