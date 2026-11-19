# Sound for the Golden Chocobo private sale reel: an original synthesized score (a low noir pad in the back room with a timpani on the
# briefcase slam and a bright shimmer on the reveal -> a light pizzicato in the store -> a climbing pizz for the cash tower -> a calm
# music box for the grading counter, the map and the garage -> a busy convention pulse -> a thin held pad for the ending), SFX on the
# picture's event frames (plan.json / src/videos/chocobo/story.ts), and a few of the user's meme sounds (public/chocobo/memes/*.mp3),
# all under the untouched voice: music ducked under speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/chocobo/mix.wav (48 kHz stereo, exact length) + stems.   python3 chocobo_audio.py ../public/chocobo/voice.wav ../public/chocobo/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2275
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "chocobo", "memes")

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
    # the hook: a low noir pad, timpani + cymbal on the slam, a shimmer of glock on the reveal
    place(mus, pad([m2f(m) for m in [45, 52, 57]], fr(100), 0.3, r, att=0.2, rel=0.3, warm=450), 0.0, 0.6)
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(27), 0.9); place(mus, widen(cymbal(0.7, r, 2.2), r), fr(27), 0.3)
    for i, m in enumerate([72, 76, 79, 84, 88, 91]): place(mus, pan(glock(m2f(m), 0.5, r, 1.4), 0.2 * np.sin(i)), fr(82) + i * 0.05, 0.4)
    calm(fr(137), fr(430), 0.55)                                   # the label macro
    padrun(fr(430), fr(655), 0.5, 600)                             # the post, the seller
    pizz(fr(655), fr(928), 0, 0.6)                                 # the store
    pizz(fr(928), fr(1000), 2, 0.8, half=True, sn=True)            # the tower climbs
    padrun(fr(1000), fr(1100), 0.5, 500)
    calm(fr(1202), fr(1694), 0.65)                                 # the reason: counter, map, garage
    for i, m in enumerate(range(60, 86, 2)): place(mus, pan(vibes(m2f(m), 0.3, r, 0.8, damp=0.3), 0.3 * np.sin(i)), fr(1420 + 2 * i), 0.3)
    pizz(fr(1694), fr(1951), 0, 0.55, sn=True)                     # MagicCon
    padrun(fr(1951), fr(2275), 0.45, 450, -12)                     # the private room, the stare
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
    # S01 the briefcase slam, latches, the cloth whip
    W(fr(23), 0.35, 0.5); P(S(thud(70, 0.4, r, 1.0), noise_burst(0.12, 300, 3000, r, 0.003, 0.05)), fr(27), 1.0); P(click(r), fr(31), 0.5); P(click(r), fr(33), 0.5)
    W(fr(80), 0.4, 0.4); P(chime([m2f(96), m2f(100), m2f(103)], r, 0.05), fr(82), 0.3)
    # S03 a twinkle on the name, a tick on 47/77, a ding on 10
    P(chime([m2f(88), m2f(91)], r, 0.06), fr(194), 0.25); P(clink(r, 2600, 0.03), fr(298), 0.3); P(glock(m2f(96), 0.5, r, 1.4), fr(395), 0.5)
    # S04 likes popping, the confirm chime
    for k in range(8): P(click(r), fr(492 + 9 * k), 0.15, 0.2)
    P(chime([m2f(84), m2f(91)], r, 0.08), fr(572), 0.4)
    # S05 the cage slide (wood scrape)
    P(noise_burst(0.5, 300, 2500, r, 0.03, 0.2), fr(630), 0.35)
    # S06 store chatter
    P(widen(crowd(fr(1100 - 655), r), r), fr(655), 0.12)
    # S08/S09 bricks set down, then slapped on
    for f0 in [820, 840, 860, 880, 905]: P(S(thud(260, 0.08, r, 0.5), noise_burst(0.05, 1500, 5000, r, 0.002, 0.02)), fr(f0), 0.45)
    for f0 in [945, 955, 965, 975, 985]: P(S(thud(120, 0.18, r, 0.9), noise_burst(0.08, 800, 4000, r, 0.002, 0.04)), fr(f0), 0.7)
    P(S(thud(160, 0.06, r, 0.3), noise_burst(0.06, 1000, 4000, r, 0.002, 0.02)), fr(1010), 0.35)
    # S10 a record-scratch stop (synth)
    P(fades(bp(colored(ns(0.25), r, 0.2), 600, 4000) * np.linspace(1, 0.2, ns(0.25)), 0.005, 0.05), fr(1106), 0.5)
    # S11 the lamp click, the ding on 10
    P(click(r), fr(1268), 0.4); P(glock(m2f(96), 0.5, r, 1.4), fr(1381), 0.5)
    # S12 the power-down of the bulbs
    P(thud(55, 0.5, r, 0.2), fr(1506), 0.5)
    # S13 the door clunk, the plastic crinkle
    P(S(thud(90, 0.25, r, 0.8), clink(r, 700, 0.05)), fr(1630), 0.7)
    for k in range(10): P(noise_burst(0.06, 3000, 10000, r, 0.002, 0.02), fr(1652) + 0.045 * k, 0.35, 0.2)
    # S14 convention murmur, a camera beep
    P(widen(crowd(fr(1951 - 1694), r), r), fr(1694), 0.2); P(glock(m2f(100), 0.15, r, 0.3), fr(1700), 0.25)
    # S15 the clink on the pan, the creak
    P(clink(r, 1800, 0.06), fr(1910), 0.5); P(creak(0.3, r, 400, 250), fr(1912), 0.35)
    # S16 an empty room, a clock tick
    for k in range(4): P(clink(r, 3000, 0.01), fr(1960 + 30 * k), 0.12)
    # S17 the peck on the cage bar
    P(clink(r, 2400, 0.08), fr(2250), 0.5)
    return out

# ================================================================ meme sounds (the user's folder), only where they are the joke
MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (33, "Kaching Sound FX.mp3", None, 0.7),
    (121, "Chicken On Tree Screaming.mp3", 0.9, 0.7),
    (487, "Phone Alert.mp3", 1.0, 0.5),
    (772, "Huh5544.mp3", None, 0.9),
    (985, "Instagram Thud.mp3", None, 0.7),
    (1447, "Wowwwwwwwwwwwwwwwww.mp3", 1.6, 0.6),
    (2074, "Suspicious Sound.mp3", 2.0, 0.7),
    (2256, "Chicken On Tree Screaming.mp3", 0.9, 0.8),
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
