# Sound for the Roush reel (the early Night UPC): an original synthesized underscore (a bright, curious ukulele-like pluck in C for the
# creator room and the phone, a sly pizzicato in A minor for the commission and the resale tower, a tape-stop freeze on "Khoan",
# calm vibes for the "you see" dock, a playful bounce for the cinema, a level pad for her answer and the no-proof beats, a firm low
# line for eBay, a resolving last chord), SFX on the picture's event frames (mirrors src/videos/roush/story.ts and plan.json), and a
# few of the user's meme sounds where the sound is the joke: ka-ching on the coin, Discord pings on the plaza buzz, huh on WHERE FROM,
# suspicious on the question mark, hehe on the tout's flip, the error sound on the deleted video, the camera shutter at the end.
# Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/roush/mix.wav (48 kHz stereo, exact length) + stems.   python3 roush_audio.py ../public/roush/voice.wav ../public/roush/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2330
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "roush", "memes")

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
    plucks(fr(0), fr(208), 0.4, 0, C)                                          # S01-S02 the box, the button
    box(fr(40), [84, 88, 91, 96], 0.08, 0.3); box(fr(140), [79, 84, 88], 0.07, 0.3)
    plucks(fr(208), fr(774), 0.36, 2)                                           # S03-S05 the room, the lid, the Magikarp
    box(fr(442), [84, 88, 91, 96], 0.08, 0.28); box(fr(717), [88, 91, 96], 0.07, 0.3)
    plucks(fr(774), fr(1095), 0.38, 0, Am)                                      # S06-S08 the small print, the tower, the coin: sly
    plucks(fr(1095), fr(1189), 0.42, 0, Am, accel=0.3); drums(fr(1095), fr(1189), 0.22)   # S09 the plaza explodes
    padrun(fr(1189), fr(1312), 0.22, 400, -12, Am)                              # S10 frozen: a low held pad only
    t = fr(1312); k = 0                                                         # S11-S12 the calm "you see": vibes
    while t < fr(1534):
        place(mus, pan(vibes(m2f([72, 76, 79, 76, 74, 77, 81, 77][k % 8]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, 0.36); t += B; k += 1
    padrun(fr(1312), fr(1534), 0.3, 900)
    plucks(fr(1534), fr(1693), 0.38, 5, C, beat=B * 0.9)                        # S13 the cinema: playful
    padrun(fr(1693), fr(1920), 0.34, 700, 0, C)                                 # S14-S16 her answer, no proof: level
    padrun(fr(1920), fr(2132), 0.36, 360, -12, Am)                              # S17 eBay: low and firm
    for f0 in [1952, 2024, 2096]: place(mus, brass(m2f(45), 0.8, 0.7, r, kind="tuba"), fr(f0), 0.26)
    padrun(fr(2164), fr(2330), 0.4, 1300, 0, C)                                 # S19-S21 resolves
    box(fr(2290), [72, 76, 79, 84], 0.12, 0.35)
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
    street = lambda f0, f1, g=0.12: (P(breeze(fr(f1) - fr(f0), r, 0.6), fr(f0), g), P(bird_chirps(fr(f1) - fr(f0), r, 0.4), fr(f0), g * 0.8))
    # S01 the lid lifts; a sparkle
    P(noise_burst(0.25, 300, 1800, r, 0.01, 0.1), fr(26), 0.3); P(chime([m2f(91), m2f(96)], r, 0.05), fr(40), 0.15)
    # S02 the street; the button pops
    street(80, 208); P(S(thud(600, 0.08, r, 0.2), click(r)), fr(123), 0.35); W(fr(97), 0.2, 0.4)
    W(fr(208), 0.25, 0.5); W(fr(320), 0.25, 0.6)
    # S05 the cards slide out
    P(noise_burst(0.2, 1500, 6000, r, 0.01, 0.06), fr(655), 0.2)
    # S06 the phone: a tap, the whoosh into the button
    street(774, 900); P(click(r), fr(884), 0.35); W(fr(892), 0.35, 0.6)
    # S07 twelve boxes land, rising
    for i in range(12): P(thud(90 + 9 * i, 0.25, r, 0.5), fr(905 + 6 * i + 4), 0.32, 0.15)
    # S08 the till, the coin slide and drop
    P(S(glock(m2f(96), 0.2, r, 1.0)), fr(1028), 0.15); P(noise_burst(0.6, 2500, 7000, r, 0.05, 0.4), fr(1040), 0.06); P(clink(r, 2400, 0.3), fr(1060), 0.3)
    # S09 the plaza
    street(1095, 1189, 0.1); murmur(1095, 1189, 0.12); P(crowd(1.2, r, cheer=True), fr(1112), 0.18)
    # S10 the freeze: a record scratch, the clock ticks
    t = tt(0.4); P(fades(np.sin(TAU * np.cumsum(np.linspace(900, 80, len(t))) / SR) * np.exp(-t / 0.18) + 0.3 * bp(r.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.1), 0.003, 0.08), fr(1189), 0.3)
    for f0 in range(1200, 1312, 15): P(click(r), fr(f0), 0.12)
    # S11 the dock: steps, the carton thud
    steps(1315, 1372, 9, 0.18, 0.1); P(thud(120, 0.3, r, 0.6), fr(1390), 0.3); P(chime([m2f(84), m2f(88)], r, 0.06), fr(1440), 0.12)
    # S12 the box scrapes round
    P(noise_burst(0.8, 300, 2500, r, 0.1, 0.5), fr(1472), 0.12)
    # S13 the cinema
    street(1534, 1693, 0.1); P(rattle(1.0, r) if False else noise_burst(1.0, 800, 3000, r, 0.05, 0.6), fr(1560), 0.06); P(noise_burst(0.15, 1500, 6000, r, 0.005, 0.05), fr(1672), 0.2)
    # S14-S15 typing, sent
    for f0 in range(1700, 1760, 5): P(click(r), fr(f0), 0.08, 0.1)
    W(fr(1762), 0.25, 0.35)
    # S17 the listings flip
    street(1920, 2132, 0.08)
    for i in range(8): P(S(noise_burst(0.12, 1500, 6000, r, 0.005, 0.05), thud(160, 0.15, r, 0.3) * 0.6), fr(1952 + 18 * i + 4), 0.2, -0.2 + 0.05 * i)
    # S18-S21 the street again
    street(2132, 2164, 0.1); street(2228, 2330, 0.1)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Wowwwwwwwwwwwwwwwww.mp3", 680, 0.22, 1.4), ("Kaching Sound FX.mp3", 975, 0.3, None), ("Kaching Sound FX.mp3", 1060, 0.3, None),
                              ("Discord Notification.mp3", 1097, 0.3, None), ("Discord Notification.mp3", 1100, 0.22, None), ("Discord Notification.mp3", 1104, 0.18, None),
                              ("Huh5544.mp3", 1130, 0.45, None), ("Suspicious Sound.mp3", 1505, 0.3, 1.6), ("Hehe Boiiiiiii.mp3", 1676, 0.32, 1.6),
                              ("Computer Error Sound.mp3", 2134, 0.32, None), ("Camera_shutter.mp3", 2242, 0.4, None), ("Camera_shutter.mp3", 2290, 0.3, None)]:
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
