# Sound for the iCaterpie reel: an original synthesized underscore (a tense low pulse for the hook, warm Italian mandolin-style
# plucks for the café and the community, a neutral bed for Worlds, a tense pad for the post, fast clock ticks for the six hours, a soft
# vibes and music-box line for the ban and the quote, light comic plucks for the 'you see' café, pizzicato with tuba hits for the scale,
# silence under the crow, a minor music-box sign-off with a clock that speeds up), SFX on the picture's event frames (mirrors
# src/videos/caterpie/story.ts and plan.json), and the user's meme sounds where the sound is the joke: the censor beep on the name,
# camera shutters on the photos, huh on 'Khoan đã', a laugh for the patrons, a thud under the scale's slam, the crow's caw.
# Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/caterpie/mix.wav (48 kHz stereo, exact length) + stems.   python3 caterpie_audio.py ../public/caterpie/voice.wav ../public/caterpie/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2360
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "caterpie", "memes")

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
    def plucks(t0, t1, g=0.5, up=0, chords=C, beat=B, trem=False):
        t = t0; k = 0
        while t < t1 - 0.2:
            ch = chords[(k // 8) % len(chords)]; m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12 + up
            place(mus, pan(pluck(m2f(m), 0.55 if k % 2 == 0 else 0.4, r, 0.5), 0.25 * np.sin(k * 1.3)), t, g)
            if trem: place(mus, pan(pluck(m2f(m), 0.3, r, 0.3, bright=0.7), 0.25 * np.sin(k * 1.3)), t + beat / 4, g * 0.7)   # mandolin tremolo
            if k % 4 == 0: place(mus, pan(pluck(m2f(ch[0] - 12 + up), 0.6, r, 0.8, bright=0.3), 0), t, g * 0.9)
            t += beat / 2; k += 1
    def padrun(t0, t1, g=0.5, warm=700, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(8 * B, t1 - t); place(mus, pad([m2f(m + up) for m in chords[k % 4][1:]], d, 0.28, r, att=0.4, rel=0.8, warm=warm), t, g); t += 8 * B; k += 1
    def box(t0, notes, gap, g=0.35):
        for i, m in enumerate(notes): place(mus, pan(musicbox(m2f(m), 0.6, r, 1.4), 0.2 * np.sin(i)), t0 + i * gap, g)
    def vib(t0, t1, notes, g=0.4, step=B):
        t = t0; k = 0
        while t < t1 - 0.2: place(mus, pan(vibes(m2f(notes[k % len(notes)]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, g); t += step; k += 1
    # S01 the hook: a low tense pulse, the slam
    padrun(fr(0), fr(148), 0.5, 380, -12, Am)
    for k in range(int(fr(137) / (B / 2))): place(mus, pan(pluck(m2f(45 - 12), 0.5, r, 0.4, bright=0.2), 0), k * B / 2, 0.35)
    place(mus, timpani(m2f(33), 0.9, r, 2.0), fr(137), 0.6)
    # S02-S03 the café, the community: warm plucks with a mandolin tremolo
    plucks(fr(150), fr(535), 0.45, 0, C, B, True); padrun(fr(150), fr(535), 0.25, 1100)
    # S04 Worlds: a brighter bed
    plucks(fr(535), fr(640), 0.38, 2); padrun(fr(535), fr(640), 0.3, 1400, 12)
    # S05-S06 the post: tense
    padrun(fr(640), fr(799), 0.45, 420, -12, Am); vib(fr(645), fr(799), [57, 60, 64, 60], 0.25, B)
    # S07 six hours: a rising pad under the clock
    padrun(fr(799), fr(859), 0.4, 600, 0, [[45, 52, 57, 64]])
    # S08 the ban: soft vibes in A minor, the slam
    vib(fr(866), fr(1100), [69, 72, 76, 72, 67, 71, 74, 71], 0.32, B); padrun(fr(866), fr(1107), 0.32, 500, -12, Am)
    place(mus, timpani(m2f(33), 0.9, r, 2.2), fr(1022), 0.55)
    # S09 the quote: a music-box line, slow
    box(fr(1112), [69, 72, 76, 74, 72, 71, 69, 67, 69, 72, 71, 69], 0.42, 0.32); padrun(fr(1107), fr(1258), 0.3, 450, -12, Am)
    # S10 Khoan đã: the music stops (the Huh is the sound); S11-S13 light comic plucks
    plucks(fr(1350), fr(1735), 0.36, 0, C, B * 0.9)
    # S14-S15 the scale: pizzicato and tuba hits on the slams
    plucks(fr(1735), fr(1974), 0.34, -2, C, B * 0.85)
    place(mus, brass(m2f(36), 0.9, 0.9, r, kind="tuba", scoop=-30), fr(1845), 0.45); place(mus, brass(m2f(43), 0.7, 0.8, r, kind="tuba", scoop=-20), fr(1925), 0.35)
    # S16 the crow: silence, one low note; S17-S19 the sign-off
    place(mus, pad([m2f(45), m2f(52)], 3.6, 0.2, r, att=0.8, rel=1.2, warm=400), fr(1980), 0.25)
    padrun(fr(2089), fr(2360), 0.32, 500, -12, Am)
    box(fr(2190), [69, 72, 76, 74, 72, 69, 64, 69], 0.36, 0.35)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.25

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    murmur = lambda f0, f1, g=0.1: P(crowd(fr(f1) - fr(f0), r), fr(f0), g)
    rip = lambda f0, g=0.4: P(fades(bp(colored(ns(0.35), r, 0.6), 1500, 9000) * (0.6 + 0.4 * np.sign(np.sin(TAU * 38 * tt(0.35)))) * np.exp(-tt(0.35) / 0.12), 0.003, 0.05), fr(f0), g, -0.2)
    squeak = lambda f0, d=0.18, g=0.06: P(fades(np.sin(TAU * np.cumsum(2200 + 600 * np.sin(TAU * 9 * tt(d))) / SR) * 0.3 * np.exp(-tt(d) / d), 0.01, 0.03), fr(f0), g, -0.2)
    pin = lambda f0, g=0.3: P(S(thud(260, 0.06, r, 0.9), click(r)), fr(f0), g, -0.2)
    wheels = lambda f0, f1, g=0.08: P(fades(rattle(fr(f1) - fr(f0), r, 26), 0.1, 0.2), fr(f0), g, 0.2)
    def shutter(f0, f1, g=0.3):
        P(fades(rattle(fr(f1) - fr(f0), r, 55, heavy=True), 0.05, 0.02), fr(f0), g * 0.6, 0.3)
        P(S(thud(55, 0.5, r, 1.0), clink(r, 900, 0.3), noise_burst(0.3, 300, 3000, r, 0.002, 0.12)), fr(f1), g * 2.2, 0.3)
    tick = lambda f0, g=0.08: P(click(r), fr(f0), g, 0.1)
    # S01 the rip, the crumple, the bin, the shutter
    murmur(0, 148, 0.08); rip(17); P(rattle(0.35, r, 60), fr(19), 0.12); P(S(clink(r, 1300, 0.12), thud(160, 0.1, r, 0.6)), fr(48), 0.35, -0.5)
    shutter(100, 137, 0.35)
    # S02 café: murmur, the cup, the trophies
    murmur(150, 535, 0.08); P(bird_chirps(12.0, r, 0.3), fr(150), 0.08); P(clink(r, 2400, 0.1), fr(205), 0.18, -0.2)
    P(chime([m2f(91)], r), fr(306), 0.15); P(chime([m2f(96)], r), fr(314), 0.15)
    # S03 suitcase wheels, the card on the table
    wheels(372, 446); P(S(click(r), noise_burst(0.04, 2000, 6000, r, 0.001, 0.02)), fr(474), 0.25)
    # S04 Worlds: hubbub, the card slide
    murmur(535, 640, 0.14); P(fades(bp(colored(ns(0.3), r, 0.4), 600, 4000) * np.exp(-tt(0.3) / 0.2), 0.01, 0.05), fr(560), 0.25)
    # S05-S06 the pin, the marker
    pin(660)
    for f0 in range(662, 735, 7): squeak(f0)
    for f0 in range(745, 766, 6): squeak(f0, 0.2, 0.08)
    # S07 the clock spins six hours (fast ticks), the rip
    for f0 in range(800, 837, 2): tick(f0, 0.07)
    rip(841)
    # S08 wheels, the pin, the shutter, the padlock, the chain
    wheels(862, 930); pin(998); shutter(1003, 1022, 0.35); P(S(click(r), clink(r, 2600, 0.08)), fr(1036), 0.4, 0.3)
    for k in range(4): P(clink(r, 3000 + 300 * k, 0.06), fr(1048 + 3 * k), 0.08, 0.2)
    # S09 a sniff
    P(fades(bp(colored(ns(0.25), r, 0.3), 800, 5000) * np.exp(-tt(0.25) / 0.1), 0.02, 0.05), fr(1215), 0.08)
    # S11 swipes
    for f0 in [1350, 1370, 1390]: W(fr(f0 + 4), 0.1, 0.3)
    # S12 the glass, the splash, steps, the squelch, the napkin
    murmur(1476, 1660, 0.08); P(clink(r, 2100, 0.1), fr(1506), 0.3, 0.1)
    P(S(clink(r, 1700, 0.15), noise_burst(0.35, 400, 6000, r, 0.002, 0.15)), fr(1519), 0.4, 0.1)
    for k in range(6): P(stroll_step(r), fr(1522 + 10 * k), 0.18, 0.3)
    P(fades(bp(colored(ns(0.25), r, 0.5), 300, 2500) * np.exp(-tt(0.25) / 0.1), 0.01, 0.05), fr(1533), 0.25)
    for k in range(4): P(fades(bp(colored(ns(0.12), r, 0.5), 400, 2000) * np.exp(-tt(0.12) / 0.06), 0.01, 0.03), fr(1545 + 10 * k), 0.1)
    for f0 in range(1560, 1584, 6): squeak(f0, 0.15, 0.05)
    # S14-S15 footsteps, the clangs, the creak
    for k in range(8): P(stroll_step(r), fr(1742 + 5 * k), 0.15, 0.2 * np.sin(k))
    P(S(clink(r, 500, 0.4), thud(70, 0.4, r, 1.0)), fr(1845), 0.5); P(S(clink(r, 600, 0.35), thud(80, 0.3, r, 0.8)), fr(1925), 0.4)
    P(creak(0.9, r, 120, 200), fr(1930), 0.12)
    # S18-S19 the clock: ticks, then faster and faster, fading
    for f0 in range(2208, 2241, 4): tick(f0, 0.07)
    t = fr(2262); k = 0
    while t < fr(2350): place(out, pan(click(r), 0.1), t, 0.08 * (1 - (t - fr(2262)) / (fr(2350) - fr(2262)))); t += max(0.05, 0.25 - 0.012 * k); k += 1
    return out

def memes():
    out = np.zeros((2, N))
    cues = [("censor.mp3", 772, 0.5, None), ("camera.mp3", 806, 0.25, 0.4), ("camera.mp3", 815, 0.25, 0.4), ("camera.mp3", 824, 0.25, 0.4),
            ("huh.mp3", 1258, 0.55, None), ("laugh.mp3", 1630, 0.3, 1.2), ("thud.mp3", 1845, 0.4, 0.8), ("crow.mp3", 2058, 0.55, None)]
    cues += [("camera.mp3", f0, 0.4, 0.5) for f0 in [1702, 1712, 1718, 1723, 1729]]
    for name, f0, g, secs in cues:
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
