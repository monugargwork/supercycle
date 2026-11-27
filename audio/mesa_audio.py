# Sound for the Mira Mesa reel (Bubble Mew): an original synthesized underscore (bright plucks in C for the show and the school
# morning, sneaky pizzicato in A minor for the hand-over and the run, a chase beat for the limp, a tape-stop freeze on "Khoan",
# calm vibes for the "you see" and a ukulele-like pluck for the beach, a sad pad for the empty easel, a firm low line for the police,
# a warm hopeful theme for the replica and her sign, a resolving last chord), SFX on the picture's event frames (mirrors
# src/videos/mesa/story.ts and plan.json), and a few of the user's meme sounds where the sound is the joke: suspicious on his glance,
# the run cue on the bolt, a laugh for "I thought he was joking", huh on "Khoan", a light bone crack on "đau thêm", the camera
# shutter on the photo, the sad violin on the empty easel, ka-ching into the jar, the runner jingle at the end.
# Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/mesa/mix.wav (48 kHz stereo, exact length) + stems.   python3 mesa_audio.py ../public/mesa/voice.wav ../public/mesa/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2510
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "mesa", "memes")

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
    def box(t0, notes, gap, g=0.35):
        for i, m in enumerate(notes): place(mus, pan(musicbox(m2f(m), 0.6, r, 1.4), 0.2 * np.sin(i)), t0 + i * gap, g)
    def drums(t0, t1, g=0.35, beat=B / 2):
        t = t0; k = 0
        while t < t1 - 0.1:
            place(mus, pan(snare(0.6, r) if k % 2 else timpani(m2f(41), 0.5, r, 0.3), 0.1), t, g * (0.7 if k % 2 else 1)); t += beat; k += 1
    plucks(fr(0), fr(103), 0.36, 0, C)                                         # S01 the friendly show...
    plucks(fr(103), fr(224), 0.42, 0, Am, accel=0.3)                           # ...and the bolt
    plucks(fr(234), fr(586), 0.4, 2)                                           # S02-S03 the morning, the booth, bright
    box(fr(462), [84, 88, 91, 96], 0.08, 0.3)                                  # the Bubble Mew
    plucks(fr(586), fr(655), 0.32, 0, Am)                                      # S04 the hand-over, curious
    plucks(fr(700), fr(938), 0.38, 0, Am)                                      # S05-S06 gone; the joke
    padrun(fr(938), fr(991), 0.3, 500, -12, Am)                                # S07 the doors settle
    plucks(fr(991), fr(1129), 0.42, 0, Am, accel=0.35); drums(fr(1000), fr(1076), 0.25)   # S08 the chase, stops on the pain
    t = fr(1229); k = 0                                                        # S10 the calm "you see": vibes
    while t < fr(1393):
        place(mus, pan(vibes(m2f([72, 76, 79, 76, 74, 77, 81, 77][k % 8]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, 0.38); t += B; k += 1
    padrun(fr(1229), fr(1393), 0.3, 900)
    plucks(fr(1393), fr(1568), 0.34, 5, C, inst=pluck, beat=B * 0.9)            # S11-S12 the beach, a ukulele-like pluck
    padrun(fr(1568), fr(1693), 0.4, 400, -12, Am)                             # S13 the empty easel, sad
    padrun(fr(1693), fr(1906), 0.36, 320, -12, Am)                            # S14 the police: low and firm
    for f0 in [1755, 1774]: place(mus, brass(m2f(45), 0.8, 0.7, r, kind="tuba"), fr(f0), 0.3)
    plucks(fr(1906), fr(2002), 0.34, 0, C)                                     # S15 the guard, the rules
    padrun(fr(2002), fr(2347), 0.4, 1200, 0, C)                                # S16-S17 the replica, her sign: warm, hopeful
    t = fr(2179); k = 0
    while t < fr(2347):
        place(mus, pan(vibes(m2f([76, 79, 84, 79, 77, 81, 84, 81][k % 8]), 0.45, r, 1.6), 0.15 * np.sin(k)), t, 0.32); t += B; k += 1
    plucks(fr(2347), fr(2401), 0.4, 0, Am, accel=0.5)                          # S18 the runner
    padrun(fr(2401), fr(2510), 0.42, 1400, 12, C)                              # S19 the crane: resolves
    box(fr(2462), [72, 76, 79, 84], 0.12, 0.35)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.25

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    murmur = lambda f0, f1, g=0.1: P(crowd(fr(f1) - fr(f0), r), fr(f0), g)
    steps = lambda a, b, every=9, g=0.2, p=0.3: [P(stroll_step(r), fr(f), g, p) for f in range(a, b, every)]
    clatter = lambda f0, g=0.3: [P(click(r), fr(f0) + k * 0.05, g * (1 - 0.2 * k), -0.2) for k in range(4)]
    bang = lambda f0, g=0.5: P(S(thud(110, 0.3, r, 0.8), clink(r, 900, 0.15) * 0.5), fr(f0), g, 0.2)
    # S01 the hall, the bolt, the top-loaders, the doors
    murmur(0, 224, 0.1); W(fr(103), 0.35, 0.6); clatter(118); steps(104, 185, 6, 0.22, 0.2); bang(185)
    # S02 outside: air, a far school bell, steps; the hall as we enter
    P(breeze(3.6, r, 0.6), fr(224), 0.12); P(bird_chirps(3.4, r, 0.3), fr(228), 0.1); P(chime([m2f(79), m2f(76)], r, 0.4), fr(240), 0.12)
    steps(240, 320, 10, 0.12, -0.3); murmur(330, 991, 0.08)
    for f0 in [350, 372, 394]: P(click(r), fr(f0), 0.15)
    # S03 the price tick; S04 the case click
    P(click(r), fr(530), 0.2); P(click(r), fr(629), 0.25)
    # S05 silence under the pause, the whoosh, the clatter
    W(fr(700), 0.35, 0.5); clatter(714); steps(704, 790, 6, 0.18, 0.3)
    # S06 the doors bang off-screen; S07 their last creaks
    bang(790, 0.45); P(creak(0.5, r, 300, 600), fr(940), 0.15); P(creak(0.4, r, 280, 520), fr(958), 0.1)
    # S08 the doors, limping steps, the car engine and a tyre chirp
    bang(995, 0.4); P(breeze(4.5, r, 0.6), fr(995), 0.1)
    for f0 in range(1000, 1068, 16): P(stroll_step(r), fr(f0), 0.22, 0.1); P(stroll_step(r), fr(f0 + 6), 0.14, 0.1)
    t = tt(2.6); eng = (lp(colored(len(t), r, 0.6), 220) + 0.3 * np.sin(TAU * (38 + 14 * np.minimum(1, t / 1.5)) * t)) * np.minimum(1, t / 0.3) * np.minimum(1, (2.6 - t) / 0.6)
    P(fades(eng, 0.05, 0.4) * 0.6, fr(1050), 0.35, 0.3); P(noise_burst(0.3, 1500, 5000, r, 0.01, 0.12), fr(1090), 0.15, 0.2)
    # S09 the freeze: a record scratch
    t = tt(0.4); P(fades(np.sin(TAU * np.cumsum(np.linspace(900, 80, len(t))) / SR) * np.exp(-t / 0.18) + 0.3 * bp(r.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.1), 0.003, 0.08), fr(1129), 0.3)
    # S10 sleeve clicks; S11-S12 the seaside
    murmur(1229, 1393, 0.08)
    for f0 in [1250, 1270, 1290, 1350, 1370, 1388]: P(click(r), fr(f0), 0.12, 0.3)
    P(breeze(5.8, r, 0.8), fr(1393), 0.16); P(bird_chirps(5.5, r, 0.6), fr(1395), 0.14); steps(1395, 1480, 10, 0.12, -0.2)
    # S13-S19 the hall; the pushpin; the guard's steps; marker squeak; rustles; tape rips; the runner whoosh
    murmur(1568, 2347, 0.07); P(click(r), fr(1755), 0.35); steps(1904, 1930, 8, 0.2, 0.3)
    P(noise_burst(0.3, 2500, 7000, r, 0.02, 0.1), fr(1960), 0.08)
    for f0 in [2096, 2110, 2124]: P(noise_burst(0.15, 1500, 6000, r, 0.01, 0.06), fr(f0), 0.12)
    for f0 in [2212, 2220]: P(noise_burst(0.22, 1200, 8000, r, 0.005, 0.07), fr(f0), 0.2)
    W(fr(2362), 0.3, 0.6); murmur(2401, 2510, 0.07)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Suspicious Sound.mp3", 92, 0.32, 1.6), ("Gogogogogo.mp3", 104, 0.32, 1.4), ("Suspicious Sound.mp3", 680, 0.32, 1.6),
                              ("Emoji Laugh.mp3", 805, 0.3, 1.5), ("Huh5544.mp3", 1131, 0.5, None), ("Bone Crack.mp3", 1076, 0.28, None),
                              ("Meme Violin Sad Violin.mp3", 1580, 0.25, 3.5), ("Kaching Sound FX.mp3", 2135, 0.32, None), ("Runner Game.mp3", 2350, 0.3, 1.6)]:
        place(out, pan(meme(name, secs), 0.0), fr(f0), g)
    t = tt(0.12); place(out, pan(fades(bp(R.standard_normal(len(t)), 2000, 9000) * np.exp(-t / 0.03), 0.001, 0.03) * 0.3, 0.0), fr(1520), 0.5)  # the phone's shutter
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
