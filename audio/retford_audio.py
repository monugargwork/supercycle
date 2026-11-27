# Sound for the Retford wall-heist reel: an original synthesized underscore (sneaky low pizzicato in A minor for the break-in, a
# tense drone for the camera, driving plucks for the road, calm vibes for the notebook, an arpeggio as the route draws, warm brass
# for the recovery, a serious piano-ish pad for the court, a warm music-box close at the shop door), SFX on the picture's event
# frames (mirrors src/videos/retford/story.ts and plan.json: drill, the brick crash, the alarm bell, the station beeps, the van, the
# siren, the dropped carton, doors), and a few of the user's meme sounds where the sound is the joke: huh on "Khoan", the camera
# shutter when the camera wakes, the suspense riser into the arrest, the realization sting on the turn at the signpost.
# Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/retford/mix.wav (48 kHz stereo, exact length) + stems.   python3 retford_audio.py ../public/retford/voice.wav ../public/retford/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2425
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "retford", "memes")

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
    plucks(fr(0), fr(254), 0.4, -12, Am)                                      # S01-S03 the break-in, low and sneaky
    padrun(fr(181), fr(415), 0.28, 500, -12, Am)                               # the alarm's drone under it
    box(fr(372), [76, 79, 84, 88, 84], 0.12, 0.25)                             # S04 December: a music-box Christmas sting
    plucks(fr(415), fr(548), 0.3, 0)                                           # S05 days of watching
    padrun(fr(671), fr(827), 0.42, 320, -12, Am)                               # S07 the camera: a low drone
    plucks(fr(827), fr(994), 0.42, 0, Am, beat=B * 0.8, accel=0.3)             # S08 the road, driving
    t = fr(994); k = 0                                                         # S09 the calm "you see": vibes
    while t < fr(1207):
        place(mus, pan(vibes(m2f([72, 76, 79, 76, 74, 77, 81, 77][k % 8]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, 0.4); t += B; k += 1
    padrun(fr(994), fr(1207), 0.3, 900)
    for i in range(12): place(mus, pan(glock(m2f([69, 72, 76, 79][i % 4] + 12 * (i // 4)), 0.5, r, 1.0), 0.3 * np.sin(i)), fr(1215) + i * 0.22, 0.22)   # S10 the route draws
    padrun(fr(1207), fr(1322), 0.3, 700, 0, Am)
    plucks(fr(1322), fr(1553), 0.4, 0, Am, accel=0.2)                          # S11 the yard, the arrest
    place(mus, brass(m2f(48), 1.2, 0.8, r, kind="tuba", scoop=-12), fr(1438), 0.35)
    padrun(fr(1553), fr(1706), 0.38, 1200)                                     # S12 recovered: warm
    place(mus, brass(m2f(60), 1.4, 0.7, r, kind="tuba"), fr(1685), 0.3); place(mus, brass(m2f(64), 1.4, 0.7, r, kind="tuba"), fr(1685), 0.25)
    padrun(fr(1706), fr(2225), 0.4, 450, -12, Am)                              # S13-S16 court: serious
    for i, m in enumerate([57, 60, 64, 62, 60, 57, 55, 57]): place(mus, pan(vibes(m2f(m), 0.6, r, 2.2), 0.1), fr(1720) + i * 2 * B, 0.25)
    padrun(fr(2225), fr(2425), 0.36, 1100)                                     # S17 the shop door, warm
    box(fr(2296), [79, 84, 88, 91], 0.1, 0.32); box(fr(2380), [72, 76, 79, 84], 0.16, 0.3)
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
    slap = lambda f0, g=0.4: P(S(noise_burst(0.07, 900, 6000, r, 0.001, 0.025), thud(240, 0.06, r, 0.6) * 0.5), fr(f0), g, 0.1)
    swish = lambda f0, g=0.25: P(fades(bp(colored(ns(0.25), r, 0.3), 1200, 6000) * np.exp(-tt(0.25) / 0.08), 0.005, 0.05), fr(f0), g, -0.1)
    steps = lambda a, b, every=9, g=0.2, p=0.3: [P(stroll_step(r), fr(f), g, p) for f in range(a, b, every)]
    def ring(f0, n=2, g=0.25):                                                    # a desk phone: 440 + 480 Hz, warbled, 2 s on
        for i in range(n):
            t = tt(1.0); y = (np.sin(TAU * 440 * t) + np.sin(TAU * 480 * t)) * (0.5 + 0.5 * np.sign(np.sin(TAU * 20 * t))) * 0.3
            P(fades(y, 0.01, 0.05), fr(f0) + i * 0.55, g, 0.2)
    bell = lambda f0, g=0.3: P(chime([m2f(91), m2f(96), m2f(91)], r, 0.06), fr(f0), g, 0.3)
    def drill(f0, f1, g=0.22):
        t = tt(fr(f1) - fr(f0)); y = np.sin(TAU * np.cumsum(820 + 40 * np.sin(TAU * 7 * t)) / SR) * 0.4 + bp(r.standard_normal(len(t)), 1500, 5000) * 0.5 * (0.6 + 0.4 * np.sign(np.sin(TAU * 11 * t)))
        P(fades(y, 0.02, 0.05), fr(f0), g, 0.25)
    def alarm(f0, f1, g=0.12):
        t = tt(fr(f1) - fr(f0)); y = (np.sin(TAU * 1250 * t) + 0.5 * np.sin(TAU * 2500 * t)) * (0.55 + 0.45 * np.sign(np.sin(TAU * 18 * t))) * 0.3
        P(fades(y, 0.02, 0.3), fr(f0), g, 0.3)
    engine = lambda f0, f1, g=0.18: P(fades(lp(colored(ns(fr(f1) - fr(f0)), r, 0.6), 400) * (1 + 0.3 * np.sin(TAU * 32 * tt(fr(f1) - fr(f0)))), 0.2, 0.4), fr(f0), g)
    # S01 the drill, the crunch, the crash, the bricks
    P(breeze(9, r, 0.4), 0, 0.08); drill(0, 29); P(noise_burst(0.2, 400, 3000, r, 0.002, 0.08), fr(20), 0.3)
    P(S(thud(55, 0.6, r, 1.0), noise_burst(0.5, 200, 4000, r, 0.003, 0.18)), fr(40), 0.75); P(thud(90, 0.25, r, 0.6), fr(44), 0.3)
    for f0 in [46, 50, 53, 58]: P(S(wood_crack(r) * 0.3, thud(260, 0.08, r, 0.8)), fr(f0), 0.22, -0.2)
    W(fr(110), 0.2, 0.5)
    # S02 cardboard, footsteps, the slide into the tunnel; S03 the bell, the line, the station beeps
    slide(118, 0.4, 0.3); steps(130, 146, 8, 0.18); slide(148, 0.5, 0.3)
    alarm(181, 720); W(fr(205), 0.25, 0.8); W(fr(222), 0.25, 0.8)
    for k in range(6): P(np.sin(TAU * 1600 * tt(0.08)) * 0.3, fr(229) + k * 0.4, 0.2, -0.2)
    # S04 night air; S05 the clock and the calendar tears
    P(breeze(5.5, r, 0.5), fr(254), 0.08); P(bird_chirps(4.4, r, 0.4), fr(415), 0.08)
    for k in range(int((fr(548) - fr(415)) / 0.5)): P(click(r), fr(415) + k * 0.5, 0.08)
    for f0 in [455, 490, 522]: P(noise_burst(0.25, 1500, 7000, r, 0.01, 0.1), fr(f0), 0.25, 0.2)
    # S06 a record scratch on "Khoan"; S07 the servo
    t = tt(0.4); P(fades(np.sin(TAU * np.cumsum(np.linspace(900, 80, len(t))) / SR) * np.exp(-t / 0.18) + 0.3 * bp(r.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.1), 0.003, 0.08), fr(548), 0.3)
    t = tt(0.55); P(fades(np.sin(TAU * np.cumsum(np.linspace(300, 520, len(t))) / SR) * 0.25, 0.02, 0.05), fr(756), 0.18)
    # S08 doors shut, the engine, whooshes under the gantries, REC beeps
    P(thud(120, 0.2, r, 0.6), fr(840), 0.3); engine(880, 994, 0.2); W(fr(936), 0.3, 0.9); W(fr(976), 0.3, 0.9)
    for f0 in [930, 950, 965, 985]: P(np.sin(TAU * 1760 * tt(0.08)) * 0.3, fr(f0), 0.12)
    # S09 the peel, the pat, the cover
    P(noise_burst(0.3, 2000, 8000, r, 0.05, 0.1), fr(1051), 0.2); P(thud(400, 0.06, r, 0.6), fr(1094), 0.25); P(noise_burst(0.2, 800, 4000, r, 0.01, 0.08), fr(1124), 0.2)
    P(pluck(m2f(55), 0.5, r, 0.4), fr(1157), 0.25)
    # S10 a blip as each monitor comes on
    for i in range(6): P(np.sin(TAU * (880 + 110 * i) * tt(0.06)) * 0.3, fr(1215 + 12 * i), 0.15)
    # S11 siren whoop, skid, doors, footsteps, the dropped carton; the hammer ting
    t = tt(1.2); P(fades(np.sin(TAU * np.cumsum(700 + 500 * np.abs(np.sin(TAU * 1.2 * t))) / SR) * 0.3, 0.02, 0.3), fr(1334), 0.25)
    P(fades(bp(colored(ns(0.5), r, 0.3), 800, 5000) * np.exp(-tt(0.5) / 0.25), 0.01, 0.1), fr(1342), 0.3)
    P(thud(160, 0.15, r, 0.5), fr(1365), 0.25); steps(1370, 1430, 9, 0.18)
    P(S(thud(110, 0.25, r, 0.7), noise_burst(0.15, 600, 3000, r, 0.002, 0.05)), fr(1452), 0.45); P(thud(130, 0.15, r, 0.5), fr(1462), 0.25)
    P(clink(r, 3600, 0.15), fr(1510), 0.3)
    # S12 birds; S13 the town; S15 the doors, footsteps; S17 the street, the door bell
    P(bird_chirps(5.0, r, 0.4), fr(1553), 0.1); P(breeze(6.0, r, 0.4), fr(1706), 0.08); P(bird_chirps(6.0, r, 0.3), fr(1710), 0.07)
    P(noise_burst(0.4, 500, 3000, r, 0.05, 0.15), fr(1948), 0.15); steps(1950, 2140, 10, 0.14)
    P(breeze(6.5, r, 0.5), fr(2225), 0.1); P(bird_chirps(6.0, r, 0.3), fr(2230), 0.08); steps(2262, 2292, 9, 0.15)
    P(chime([m2f(91), m2f(96), m2f(91), m2f(96)], r, 0.06), fr(2295), 0.32, 0.2)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Huh5544.mp3", 550, 0.55, None), ("Camera shutter.mp3", 754, 0.4, None), ("Cinemaitc Suspense Riser.mp3", 1300, 0.3, 1.4),
                              ("Realization Sound.mp3", 2084, 0.35, 1.4)]:
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
    if true_peak(mix) > -1.2: lim = dbg(-1.8); mix = np.tanh(mix / lim) * lim
    write_wav(out_path, mix, 16)
    for nm, x in [("music", mus), ("sfx", fx)]: write_wav(out_path.replace(".wav", f"_{nm}.wav"), x, 16)
    print("mix", out_path, "LUFS", round(integrated(mix), 2), "TP", round(true_peak(mix), 2), "len", mix.shape[1] / SR)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
