# Sound for the Fanatics unpaid Pikachu reel: an original synthesized score (a held pad and timpani for the hook gavel -> a
# ticking auction pizzicato that climbs with the bids -> a cool office pulse at the sold wall that thins to nothing for CANCELLED
# -> a nervous pizz for the evaporating sales -> a warm guitar-like pluck for the street -> a hollow pad for the museum), SFX on
# the picture's event frames (mirrors src/videos/fanatics/story.ts and plan.json), and a few of the user's meme sounds
# (public/fanatics/memes/*.mp3), all under the untouched voice: music ducked under speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/fanatics/mix.wav (48 kHz stereo, exact length) + stems.   python3 fanatics_audio.py ../public/fanatics/voice.wav ../public/fanatics/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2325
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "fanatics", "memes")

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
B = 60.0 / 104

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
    def calm(t0, t1, g=0.6):
        t = t0; k = 0
        while t < t1 - 0.4:
            ch = C[(k // 8) % 4]; place(mus, pan(musicbox(m2f(ch[1:][k % 3] + 12), 0.35, r, 1.0), 0.3 * np.sin(k)), t, 0.32 * g / 0.6)
            if k % 8 == 0: place(mus, pad([m2f(m) for m in ch[1:]], min(8 * B / 2, t1 - t), 0.25, r, att=0.4, rel=0.6, warm=800), t, g)
            t += B / 2; k += 1
    # the hook: a held pad under the raised gavel, timpani + cymbal on the strike, then a falling glock as the ticket drops
    place(mus, pad([m2f(m) for m in [45, 52, 57]], fr(69), 0.3, r, att=0.3, rel=0.2, warm=500), 0.0, 0.6)
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(69), 0.9); place(mus, widen(cymbal(0.7, r, 2.2), r), fr(69), 0.35)
    for i, m in enumerate([84, 81, 76, 72, 69]): place(mus, pan(glock(m2f(m), 0.5, r, 1.2), 0.1), fr(118) + i * 0.09, 0.35)
    pizz(fr(176), fr(320), 0, 0.7, half=True)                       # the bids: a ticking climb
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(325), 0.8)
    pizz(fr(330), fr(405), 2, 0.75, sn=True)
    calm(fr(412), fr(528), 0.6)                                    # the papers
    padrun(fr(531), fr(800), 0.55, 500)                            # the sold wall, cool
    padrun(fr(967), fr(1300), 0.5, 700)                            # Gempire
    pizz(fr(1004), fr(1300), 0, 0.55)
    pizz(fr(1302), fr(1480), -2, 0.6, half=True)                   # gone, gone
    padrun(fr(1484), fr(1656), 0.45, 600)
    calm(fr(1660), fr(1857), 0.75)                                 # the street, golden
    for i, m in enumerate([69, 72, 76, 79]): place(mus, pan(vibes(m2f(m), 0.4, r, 1.2, damp=0.3), 0.2), fr(1810 + 8 * i), 0.5)
    padrun(fr(1857), fr(2011), 0.6, 900, 0)
    padrun(fr(2111), fr(2280), 0.5, 450, -12)                       # the museum: hollow
    place(mus, pan(musicbox(m2f(76), 0.5, r, 2.0), 0.1), fr(2300), 0.5)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.3

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.35, d=0.6: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    gavel = lambda f0, g=1.0: P(S(thud(140, 0.3, r, 1.0), clink(r, 900, 0.2), wood_crack(r) * 0.6), fr(f0), g)
    ticks = lambda a, b, g=0.3: [P(clink(r, 2600 + 900 * k / max(1, (b - a) // 2), 0.02) * 0.5, fr(a + 2 * k), g, 0.1) for k in range((b - a) // 2)]
    ping = lambda f0, g=0.4: P(clink(r, 3200, 0.06), fr(f0), g, 0.2)
    slide = lambda f0, n=14, g=0.35: P(fades(bp(colored(ns(fr(n)), r, 0.3), 1500, 6000) * 0.4, 0.01, 0.05), fr(f0), g)
    # S01
    gavel(69, 1.0); P(thud(50, 0.7, r, 0.4), fr(69), 0.8); W(fr(80), 0.3, 0.9); ping(118); slide(120); P(thud(160, 0.15, r, 0.5), fr(134), 0.4)
    # S02
    for k in range(5): P(click(r), fr(176) + 0.04 * k, 0.4, -0.1)
    for f0 in [256, 261, 266, 271, 276, 281, 286, 291, 295]: W(fr(f0 + 3), 0.18, 0.25)
    ticks(254, 296, 0.25); gavel(325, 0.9); ticks(362, 394, 0.35); P(widen(crowd(1.4, r), r), fr(254), 0.25)
    # S03 three bundles
    for f0 in [414, 428, 445]: P(S(thud(90, 0.3, r, 0.8), noise_burst(0.15, 400, 3000, r, 0.005, 0.06)), fr(f0), 0.8)
    P(chime([m2f(88), m2f(93)], r, 0.06), fr(482), 0.35)
    # S04 calendar, stamp
    P(noise_burst(0.12, 1500, 6000, r, 0.005, 0.04), fr(533), 0.4); P(S(thud(120, 0.18, r, 0.9), clink(r, 600, 0.05)), fr(591), 0.9); P(glock(m2f(91), 0.4, r, 1.0), fr(596), 0.3)
    # S05 calendar, tube buzz, the drop, the stick, the pin
    P(noise_burst(0.12, 1500, 6000, r, 0.005, 0.04), fr(637), 0.4)
    P(widen(fades(bp(colored(ns(fr(100)), r, 0.6), 100, 400) * (0.6 + 0.4 * np.sign(np.sin(TAU * 2 * tt(fr(100))))) * 0.2, 0.1, 0.2), r), fr(640), 0.3)
    ping(693); slide(694); P(thud(160, 0.15, r, 0.5), fr(708), 0.4); P(noise_burst(0.3, 300, 2500, r, 0.02, 0.12), fr(712), 0.4); P(flick(r), fr(724), 0.6); P(thud(300, 0.08, r, 0.6), fr(733), 0.5); P(click(r), fr(738), 0.5)
    # S06 the draught, the curl
    P(widen(fades(bp(colored(ns(1.2), r, 0.4), 800, 5000) * 0.15, 0.2, 0.5), r), fr(800), 0.35); P(flick(r), fr(806), 0.3); P(flick(r), fr(818), 0.3)
    P(thud(45, 0.8, r, 0.2), fr(856), 0.7)
    # S08 footsteps, pages, six hisses
    for k in range(5): P(thud(200, 0.08, r, 0.4), fr(1010 + 8 * k), 0.3, 0.2)
    for f0 in [1081, 1128]: P(noise_burst(0.2, 1500, 6000, r, 0.01, 0.08), fr(f0), 0.3)
    for f0 in [1270, 1274, 1278, 1282, 1286, 1290]: P(noise_burst(0.45, 2500, 9000, r, 0.05, 0.25), fr(f0), 0.3, 0.3 * np.sin(f0))
    # S09 two hisses, the pins
    for f0 in [1343, 1376]: P(noise_burst(0.5, 2500, 9000, r, 0.05, 0.25), fr(f0), 0.45); P(S(thud(220, 0.1, r, 0.5), clink(r, 1200, 0.05)), fr(f0 + 2), 0.4)
    ping(1440, 0.25); ping(1446, 0.25)
    # S10 pin pull, the shredder, the level's ding
    P(click(r), fr(1494), 0.4)
    sh = fades((bp(colored(ns(0.65), r, 0.5), 200, 3000) * (0.7 + 0.3 * np.sin(TAU * 38 * tt(0.65)))) * 0.5, 0.02, 0.08); P(sh, fr(1573), 0.8, -0.3)
    P(glock(m2f(96), 0.5, r, 1.4), fr(1640), 0.5)
    # S12/S13 the rider clack, the signs, the yank, the toss
    P(S(thud(400, 0.06, r, 0.7), clink(r, 1500, 0.05)), fr(1786), 0.7)
    for i, f0 in enumerate([1810, 1818, 1826, 1834]): P(S(thud(180 + 40 * i, 0.12, r, 0.4), whoosh(0.2, r, peak=0.05) * 0.4), fr(f0), 0.5)
    P(S(noise_burst(0.3, 200, 2000, r, 0.005, 0.12), thud(80, 0.2, r, 0.6)), fr(1886), 0.8); P(thud(110, 0.25, r, 0.7), fr(1904), 0.6)
    # S14 footsteps, door creak, slam, tag
    for k in range(5): P(thud(200, 0.08, r, 0.4), fr(2052 + 8 * k), 0.3, 0.3)
    P(creak(0.4, r, 300, 200), fr(2084), 0.4); P(S(thud(70, 0.4, r, 1.0), wood_crack(r) * 0.5), fr(2100), 0.9)
    for k in range(4): P(clink(r, 2400, 0.03), fr(2102 + 3 * k), 0.15)
    # S15 phone shutters (memes) are cued below; a gallery hush
    P(widen(fades(lp(colored(ns(fr(2325 - 2111)), r, 0.8), 500) * 0.15, 0.3, 0.5), r), fr(2111), 0.4)
    return out

# ================================================================ meme sounds (the user's folder), only where they are the joke
MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (72, "Kaching Sound FX.mp3", None, 0.7),
    (394, "Kaching Sound FX.mp3", None, 0.8),
    (839, "Realization Sound.mp3", 1.6, 0.6),
    (951, "Huh5544.mp3", None, 0.9),
    (2120, "Camera Shutter.mp3", 0.5, 0.5), (2151, "Camera Shutter.mp3", 0.5, 0.45), (2178, "Camera Shutter.mp3", 0.5, 0.45),
    (2300, "Suspicious Sound.mp3", 2.0, 0.8),
]

def memes():
    out = np.zeros((2, N))
    for f0, name, secs, g in MEME_CUES:
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
