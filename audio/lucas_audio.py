# Sound for the Lucas (big collection, "easy as candy") reel: an original, light synthesized score (a plucky walking bass and
# vibes in a major key for the comedy of frustration, a ticking time-lapse figure for the clocks, a low synth pulse for the LA drive
# and the lot, a soft sad turn for the pizza, out after the crack), SFX on the picture's event frames (mirrors
# src/videos/lucas/story.ts and plan.json) and a few meme sounds where the sound is the joke (MEME_CUES).
# Output: public/lucas/mix.wav (48 kHz stereo, exact length) + stems.   python3 lucas_audio.py ../public/lucas/voice.wav ../public/lucas/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2430
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "lucas", "memes")

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
    C = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]  # C Am F G
    def bass(t0, t1, g=0.5, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.2:
            ch = chords[(k // 4) % 4]; note = [ch[0], ch[1] - 12, ch[0] + 12, ch[1] - 12][k % 4] - 12 + up
            place(mus, pan(pluck(m2f(note), 0.7, r, 0.5, 0.35), -0.1), t, g); t += B; k += 1
    def comp(t0, t1, g=0.3, up=0, chords=C):
        t = t0 + B; k = 0
        while t < t1 - 0.3:
            ch = chords[(k // 2) % 4]
            for i, m in enumerate(ch[1:]): place(mus, pan(vibes(m2f(m + 12 + up), 0.35, r, 0.5, damp=0.35), 0.25), t + 0.01 * i, g)
            t += 2 * B; k += 1
    def ticks(t0, t1, g=0.25, rate=8):
        for k in range(int((t1 - t0) * rate)): place(mus, pan(S(noise_burst(0.02, 3000, 9000, r, 0.0005, 0.004)), 0.3 * (1 if k % 2 else -1)), t0 + k / rate, g)
    def pulse(t0, t1, g=0.4):
        t = t0; k = 0
        while t < t1 - 0.2:
            place(mus, pad([m2f(33 + (5 if (k // 8) % 2 else 0))], B * 0.5, 0.5, r, att=0.01, rel=0.12, warm=260), t, g); t += B * 0.5; k += 1
    def padrun(t0, t1, g=0.4, warm=700, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(4 * B, t1 - t); place(mus, pad([m2f(m + up) for m in chords[k % 4][1:]], d, 0.28, r, att=0.4, rel=0.8, warm=warm), t, g); t += 4 * B; k += 1
    bass(fr(0), fr(752), 0.42); comp(fr(20), fr(752), 0.26)                              # the hook, the collection, "easy"
    ticks(fr(0), fr(50), 0.2, 12); ticks(fr(77), fr(106), 0.22, 16)                       # clocks
    for i, m in enumerate([72, 76, 79, 84]): place(mus, pan(glock(m2f(m), 0.5, r, 1.6), 0.2), fr(246) + 0.07 * i, 0.3)  # gold
    bass(fr(760), fr(1020), 0.36, -2); ticks(fr(780), fr(860), 0.18, 12)                  # the card show
    padrun(fr(1024), fr(1245), 0.32, 800)                                                  # September, paid
    place(mus, pad([m2f(36), m2f(42)], 2.6, 0.3, r, att=0.05, rel=1.2, warm=300), fr(1296), 0.45)  # the refund: a sour low chord
    ticks(fr(1430), fr(1470), 0.2, 16)
    pulse(fr(1530), fr(1812), 0.42); padrun(fr(1530), fr(1812), 0.2, 350, -12)          # the drive, the lot
    bass(fr(1818), fr(1995), 0.3, -3)                                                      # the shop
    padrun(fr(2050), fr(2326), 0.34, 600, 0, [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 55]])  # pizza, the verdict
    bass(fr(2330), fr(2378), 0.4); comp(fr(2330), fr(2378), 0.25)                          # "easy as candy" ... cut on the crack
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.8 + wet * 0.25

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    beep = lambda f0, g=0.12, hz=2400: P(fades(np.sin(TAU * hz * tt(0.07)), 0.003, 0.02), fr(f0), g, 0.1)
    keys = lambda a, b, g=0.18: [P(click(r), fr(a) + k * 0.11, g, 0.15) for k in range(int((fr(b) - fr(a)) / 0.11))]
    paper = lambda f0, g=0.3: P(fades(bp(colored(ns(0.22), r, 0.2), 1500, 9000) * np.exp(-tt(0.22) / 0.07), 0.002, 0.04), fr(f0), g, 0.1)
    snap = lambda f0, g=0.4: P(S(thud(500, 0.06, r, 0.8), noise_burst(0.04, 2000, 8000, r, 0.001, 0.01)), fr(f0), g)
    # S01 the walk in, the chair, the scale, three weighs, the lamp
    for k in range(10): P(thud(120, 0.08, r, 0.3), fr(18 + 4 * k), 0.12, 0.2)
    P(thud(90, 0.25, r, 0.4), fr(60), 0.3); P(click(r), fr(70), 0.3)
    for t in [107, 139, 171, 290, 1428, 1452]: P(noise_burst(0.05, 1500, 5000, r, 0.002, 0.02), fr(t + 11), 0.15); beep(t + 12)
    P(noise_burst(0.05, 1500, 5000, r, 0.002, 0.02), fr(1151), 0.15)
    # S03 the lids burst, the packs spring out
    for t in [359, 367, 374]: snap(t, 0.45); P(thud(160, 0.12, r, 0.4), fr(t + 12), 0.2)
    for t in [495, 522, 545, 566]: W(fr(t + 4), 0.15, 0.3); P(noise_burst(0.08, 2500, 8000, r, 0.002, 0.03), fr(t), 0.12)
    for t in [612, 620, 628, 636]: P(chime([m2f(93)], r, 0.04), fr(t), 0.12, 0.2)
    P(click(r), fr(748), 0.2)                                                            # candy crunch
    # S05-S06 the hall: crowd, shuffles, sends
    P(crowd(fr(1024 - 760), r) * 0.5, fr(760), 0.25)
    for t in [800, 830]: [P(thud(140, 0.06, r, 0.3), fr(t + 3 * k), 0.08) for k in range(4)]
    for k in range(12): W(fr(884 + round(28 / 12 * k)), 0.05, 0.2)
    # S07 the calendar, S08 the tap
    for t in [1030, 1041, 1052]: paper(t)
    P(click(r), fr(1189), 0.3)
    # S10 typing; S12-S13 the car, the lot; S14 the shop; S15 pages; S17 keys; S18 the crack tail
    keys(1356, 1374, 0.1)
    P(bp(colored(ns(fr(1662 - 1528)), r, 0.6), 60, 400) * 0.6, fr(1528), 0.35)          # engine hum
    P(bp(colored(ns(fr(1814 - 1662)), r, 0.6), 50, 260) * 0.4, fr(1662), 0.25)          # idling engines
    P(fades(bp(colored(ns(0.5), r, 0.3), 2000, 7000) * (0.5 + 0.5 * np.sin(TAU * 18 * tt(0.5))), 0.01, 0.1), fr(1754), 0.25)  # thumbing bills
    P(thud(110, 0.2, r, 0.5), fr(1772), 0.25)
    P(chime([m2f(88), m2f(84)], r, 0.12), fr(1816), 0.2); P(thud(140, 0.15, r, 0.6), fr(1847), 0.35)
    for k in range(int(fr(1980 - 1947) / 0.05)): P(noise_burst(0.04, 3000, 8000, r, 0.002, 0.01), fr(1947) + k * 0.05, 0.06)
    for k in range(8): paper(2000 + round(5.5 * k), 0.25)
    keys(2216, 2310, 0.12); P(click(r), fr(2316), 0.3)
    return out

MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (14, "Instagram Thud.mp3", None, 0.7),
    (668, "Emoji Laugh.mp3", 1.6, 0.4),
    (570, "Wowwwwwwwwwwwwwwwww.mp3", 1.6, 0.35),
    (918, "Discord Notification.mp3", None, 0.35), (932, "Discord Notification.mp3", None, 0.3), (944, "Discord Notification.mp3", None, 0.3),
    (998, "Crow Sound Caw.mp3", 1.2, 0.45),
    (1124, "Phone Alert.mp3", 1.0, 0.4),
    (1211, "Kaching Sound FX.mp3", None, 0.55),
    (1250, "Phone Alert.mp3", 1.0, 0.4),
    (1368, "Realization Sound.mp3", 1.5, 0.45),
    (1415, "Huh5544.mp3", None, 0.9),
    (1713, "Suspicious Sound.mp3", 2.0, 0.55),
    (1878, "Computer Error Sound.mp3", None, 0.4),
    (1983, "BRUH.mp3", None, 0.6),
    (2008, "Meme Violin Sad Violin.mp3", 3.0, 0.3),
    (2381, "Bone Crack.mp3", None, 0.9),
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
    duck = env_duck(v, -7)                               # music dips under speech
    mix = v + mus * duck[None, :] + fx + mm * env_duck(v, -3)[None, :]
    mix = mix * dbg(-14 - integrated(mix))
    if true_peak(mix) > -1.0: lim = dbg(-1.0); mix = np.tanh(mix / lim) * lim
    write_wav(out_path, mix, 16)
    for nm, x in [("music", mus), ("sfx", fx)]: write_wav(out_path.replace(".wav", f"_{nm}.wav"), x, 16)
    print("mix", out_path, "LUFS", round(integrated(mix), 2), "TP", round(true_peak(mix), 2), "len", mix.shape[1] / SR)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
