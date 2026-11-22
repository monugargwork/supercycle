# Sound for the Gengar reel: an original synthesized underscore (a bouncy pluck ostinato for the auction that speeds up with the
# bids, an eerie low pad and a theremin-like glide for the ghost, music-box sparkle for the slab, a party brass hit for the champagne,
# calm vibes for the café 'you see', a low drone for the erased sales, a music-box sign-off for Gengar), SFX on the picture's event
# frames (mirrors src/videos/gengar/story.ts and plan.json), and a few of the user's meme sounds where the sound is the joke: ka-ching
# on the hammers and on the stamp, kids cheering on the corks, huh on 'Khoan đã', suspicious on 'ai trả?', the computer error on
# 'không nhận được tiền', the payment sound on 'đã trả', hehe boi on Gengar's grin. Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/gengar/mix.wav (48 kHz stereo, exact length) + stems.   python3 gengar_audio.py ../public/gengar/voice.wav ../public/gengar/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2420
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "gengar", "memes")

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

def score():
    mus = np.zeros((2, N)); r = rng(11)
    C = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]  # C Am F G
    Am = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 55]]
    def plucks(t0, t1, g=0.5, up=0, chords=C, inst=pluck, beat=B, accel=0.0):
        t = t0; k = 0
        while t < t1 - 0.2:
            ch = chords[(k // 8) % len(chords)]; m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12 + up
            place(mus, pan(inst(m2f(m), 0.55 if k % 2 == 0 else 0.4, r, 0.5), 0.25 * np.sin(k * 1.3)), t, g)
            if k % 4 == 0: place(mus, pan(pluck(m2f(ch[0] - 12 + up), 0.6, r, 0.8, bright=0.3), 0), t, g * 0.9)
            step = beat / 2 * (1 - accel * min(1, (t - t0) / max(0.1, t1 - t0)))
            t += step; k += 1
    def padrun(t0, t1, g=0.5, warm=700, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(8 * B, t1 - t); place(mus, pad([m2f(m + up) for m in chords[k % 4][1:]], d, 0.28, r, att=0.4, rel=0.8, warm=warm), t, g); t += 8 * B; k += 1
    def theremin(t0, t1, f0, f1, g=0.3):
        d = t1 - t0; t = tt(d); f = f0 * (f1 / f0) ** (t / d) * (1 + 0.025 * np.sin(TAU * 5.5 * t))
        y = np.sin(TAU * np.cumsum(f) / SR) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.5)
        place(mus, pan(fades(y, 0.05, 0.3) * 0.5, -0.1), t0, g)
    def box(t0, notes, gap, g=0.35):
        for i, m in enumerate(notes): place(mus, pan(musicbox(m2f(m), 0.6, r, 1.4), 0.2 * np.sin(i)), t0 + i * gap, g)
    plucks(fr(0), fr(100), 0.45)                                               # S01 the auction strut
    padrun(fr(100), fr(298), 0.45, 380, -12, Am); theremin(fr(196), fr(292), 330, 880, 0.32)   # S02 next morning, the ghost
    padrun(fr(298), fr(562), 0.35, 900); box(fr(440), [84, 88, 91, 96], 0.12); box(fr(474), [91, 96, 100], 0.1, 0.25)   # S03 the slab
    plucks(fr(562), fr(757), 0.45, 2, accel=0.45)                             # S04 the bids speed up
    plucks(fr(757), fr(933), 0.42, 0); place(mus, brass(m2f(55), 1.0, 0.6, r, kind="tuba", scoop=-40), fr(845), 0.3)   # S05 the pole
    plucks(fr(933), fr(1106), 0.45, 2)                                        # S06 the Latios
    padrun(fr(1106), fr(1224), 0.45, 1500, 12)                                # S07 the gallery (choir-ish)
    t = fr(1252); k = 0                                                       # S08 the party hit
    while t < fr(1285):
        place(mus, brass(m2f([60, 64, 67, 72][k % 4]), B * 0.45, 0.8, r, kind="tuba", scoop=-10), t, 0.4); place(mus, snare(0.6, r), t + B / 2, 0.35); t += B / 2; k += 1
    padrun(fr(1300), fr(1412), 0.35, 450, -12, Am)                            # S09 tense after the freeze
    t = fr(1416); k = 0                                                       # S10-S11 the café: calm vibes
    while t < fr(1728):
        place(mus, pan(vibes(m2f([72, 76, 79, 76, 74, 77, 81, 77][k % 8]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, 0.42); t += B; k += 1
    padrun(fr(1416), fr(1728), 0.38, 900)
    padrun(fr(1728), fr(1957), 0.5, 320, -12, [[45, 52, 57, 60], [44, 51, 56, 59], [41, 48, 53, 57], [40, 47, 52, 56]])   # S12 the drone
    plucks(fr(1957), fr(2186), 0.4, 0)                                        # S13-S14
    padrun(fr(2186), fr(2310), 0.35, 600)                                     # the hesitation and the check
    place(mus, brass(m2f(72), 0.6, 0.8, r, kind="tuba", scoop=-12), fr(2312), 0.35)
    box(fr(2340), [69, 72, 76, 75, 72, 69, 64], 0.22, 0.4)                    # S15 Gengar's sign-off
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.25

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    keys = lambda a, b, g=0.18: [P(click(r), fr(a) + k * 0.11, g, 0.15) for k in range(int((fr(b) - fr(a)) / 0.11))]
    slide = lambda f0, d=0.5, g=0.35: P(fades(bp(colored(ns(d), r, 0.4), 600, 4000) * np.exp(-tt(d) / (d * 0.6)), 0.01, 0.1), fr(f0), g)
    gavel = lambda f0, g=0.8: P(S(wood_crack(r) * 0.6, thud(180, 0.2, r, 0.9)), fr(f0), g, -0.2)
    pop = lambda f0, g=0.6, p=0.0: (P(S(thud(300, 0.08, r, 1.0), noise_burst(0.1, 1000, 7000, r, 0.001, 0.04)), fr(f0), g, p),
                                    P(fades(bp(colored(ns(1.4), r, 0.2), 3000, 10000) * np.exp(-tt(1.4) / 0.5), 0.01, 0.3), fr(f0) + 0.03, g * 0.25, p))
    murmur = lambda f0, f1, g=0.1: P(crowd(fr(f1) - fr(f0), r), fr(f0), g)
    # S01 the board ticks, the gavel, the tag
    murmur(0, 100, 0.12)
    for k in range(8): P(click(r), fr(8 * k + 2), 0.08, -0.2)
    gavel(79); P(clink(r, 2600, 0.1), fr(82), 0.12, 0.3)
    # S02 footsteps, the flick, the spin whirr, the string pop
    for k in range(6): P(stroll_step(r), fr(104 + 6 * k), 0.25, 0.4)
    P(flick(r), fr(156), 0.35); t = tt(0.85); P(fades(bp(r.standard_normal(len(t)), 1500, 5000) * (0.5 + 0.5 * np.sin(TAU * np.linspace(18, 3, len(t)) * t)) * np.exp(-t / 0.4), 0.01, 0.1), fr(157), 0.12)
    P(S(thud(900, 0.04, r, 0.4)), fr(262), 0.2)
    # S03 fireworks pops and crackle, the gold ting
    for f0 in [474, 480, 486]: P(S(thud(70, 0.3, r, 0.5), noise_burst(0.5, 2500, 9000, r, 0.002, 0.2) * 0.6), fr(f0), 0.3, 0.2)
    P(chime([m2f(96)], r), fr(535), 0.2)
    # S04 paddles and counter flaps
    murmur(562, 757, 0.14)
    BIDS = [round(640 + 104 * (1 - (1 - i / 31) ** 1.7)) for i in range(32)]
    for i, f0 in enumerate(BIDS): P(noise_burst(0.06, 800, 4000, r, 0.002, 0.02), fr(f0), 0.12, 0.3 * np.sin(i)); P(click(r), fr(f0) + 0.05, 0.1, 0.4)
    # S05 the cord, hand over hand
    for f0 in [790, 804, 818, 832, 846, 860, 874, 888]: P(creak(0.25, r, 300, 500), fr(f0), 0.12, 0.3); P(click(r), fr(f0 + 10), 0.08, 0.3)
    P(clink(r, 1600, 0.15), fr(905), 0.2, 0.3)
    # S06 ticks, the gavel
    murmur(933, 1106, 0.12)
    for k in range(10): P(click(r), fr(1062 + 3 * k), 0.07, -0.2)
    gavel(1094)
    # S07 the gallery: row whooshes, the spotlight
    for k in range(5): W(fr(1114 + 10 * k), 0.08, 0.35)
    P(S(thud(110, 0.25, r, 0.8), clink(r, 700, 0.15)), fr(1204), 0.4); P(chime([m2f(84), m2f(91)], r, 0.08), fr(1208), 0.18)
    # S08 four corks and the fizz
    murmur(1224, 1285, 0.16)
    for i in range(4): pop(1252 + (i % 2), 0.45, -0.4 + 0.27 * i)
    for i in range(4): P(thud(900, 0.03, r, 0.3), fr(1252 + 31 + 3 * i), 0.1, 0.3)
    # S09 the freeze (a tape-stop), the waiter, the bill
    t = tt(0.45); P(fades(np.sin(TAU * np.cumsum(np.linspace(600, 60, len(t))) / SR) * np.exp(-t / 0.2), 0.005, 0.1), fr(1285), 0.18)
    for k in range(5): P(stroll_step(r), fr(1312 + 5 * k), 0.2, 0.5)
    slide(1338, 0.4, 0.35)
    # S10 the street, a café clink, the note slide
    P(breeze(10.5, r, 0.6), fr(1412), 0.12); P(bird_chirps(10.0, r, 0.3), fr(1416), 0.1); P(clink(r, 2200, 0.12), fr(1430), 0.2, 0.3); slide(1490, 0.4, 0.3)
    # S11 the megaphone (feedback squeal + a distorted bed), cups rattle, the thump, the envelope, the paper going solid
    t = tt(0.5); P(fades(np.sin(TAU * 2800 * t) * np.minimum(1, t / 0.2) * 0.4, 0.01, 0.1), fr(1550), 0.08)
    t = tt(1.0); P(fades(np.tanh(6 * bp(r.standard_normal(len(t)), 400, 2500)) * 0.25 * (0.6 + 0.4 * np.sin(TAU * 7 * t)), 0.02, 0.2), fr(1556), 0.05)
    for f0 in [1556, 1564, 1572]: P(rattle(0.15, r, 40), fr(f0), 0.12)
    P(S(push_thump(r), thud(120, 0.2, r, 0.8)), fr(1590), 0.55); P(rattle(0.3, r, 40), fr(1591), 0.18)
    slide(1636, 0.9, 0.35); P(S(thud(220, 0.12, r, 0.3), noise_burst(0.08, 300, 1500, r, 0.004, 0.04)), fr(1690), 0.3)
    P(S(thud(140, 0.18, r, 0.8), noise_burst(0.05, 1500, 6000, r, 0.001, 0.02)), fr(1707), 0.5)
    # S12 typing, a whoosh per erased row
    keys(1734, 1780, 0.09)
    for f0 in [1840, 1856, 1872, 1888, 1904]: W(fr(f0 + 8), 0.12, 0.6)
    # S13 the button, the board clack, the ding
    P(S(thud(160, 0.12, r, 0.5), click(r)), fr(2030), 0.4); P(noise_burst(0.12, 1500, 6000, r, 0.002, 0.05), fr(2032), 0.2); P(chime([m2f(91), m2f(96)], r, 0.06), fr(2034), 0.2)
    # S14 the big number, phone taps, the pop
    murmur(2048, 2326, 0.06)
    P(chime([m2f(84), m2f(88), m2f(91), m2f(96)], r, 0.05), fr(2100), 0.22)
    for k in range(4): P(click(r), fr(2240 + 12 * k), 0.12, 0.2)
    pop(2312, 0.55, 0.1)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Kaching Sound FX.mp3", 81, 0.5, None), ("Kaching Sound FX.mp3", 750, 0.4, None), ("Kaching Sound FX.mp3", 1097, 0.4, None),
                              ("Kids Cheering.mp3", 1254, 0.45, 2.0), ("Huh5544.mp3", 1287, 0.6, None), ("Suspicious Sound.mp3", 1393, 0.45, 2.4),
                              ("Kaching Sound FX.mp3", 1707, 0.45, None), ("Computer Error Sound.mp3", 1913, 0.4, None), ("Mobile Payment.mp3", 2294, 0.5, None),
                              ("Hehe Boiiiiiii.mp3", 2384, 0.4, None)]:
        place(out, pan(meme(name, secs), 0.0), fr(f0), g)
    return out

# ================================================================ mix
def main(voice_path, out_path):
    v, sr = read_wav(voice_path); assert sr == SR
    v = st(v)[:, :N]; v = np.pad(v, ((0, 0), (0, N - v.shape[1])))
    mus, fx = score(), sfx(); mm = memes()
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
