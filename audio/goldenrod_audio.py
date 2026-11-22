# Sound for the Goldenrod heist reel: an original synthesized underscore (a sneaky pizzicato caper in A minor for the break-in,
# a lounge vibes sting for the buffet plates, a smug synth bass for the night drive, a warm 'you see' pad with a shimmer for the gold
# trail, procedural plucks for the investigation, a dawn pad for Justice, a music-box sign-off), SFX on the picture's event frames
# (mirrors src/videos/goldenrod/story.ts and plan.json): glass crashes, bolt cutters, the padlock, engines, the speed-camera flash,
# pen and stamps, sonar blips per tower, pins, sirens, the garage door, the drawer; and a few of the user's meme sounds where the
# sound is the joke: ka-ching on the till and the total, a screaming chicken for the rooster, huh on 'Khoan đã', a ringing phone
# through the megaphone, realization on the JUSTICE sign, a sad violin for the walk. Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/goldenrod/mix.wav (48 kHz stereo, exact length) + stems.   python3 goldenrod_audio.py ../public/goldenrod/voice.wav ../public/goldenrod/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2370
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "goldenrod", "memes")

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
B = 60.0 / 120

def score():
    mus = np.zeros((2, N)); r = rng(11)
    Am = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 56]]   # Am F G E
    C = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]
    def caper(t0, t1, g=0.5, up=0):
        """sneaky pizzicato: a walking bass on the beat, staccato off-beat chords, a brush on 2 and 4"""
        t = t0; k = 0
        while t < t1 - 0.15:
            ch = Am[(k // 8) % 4]
            place(mus, pan(pluck(m2f(ch[[0, 1, 2, 1][k % 4]] - 12 + up), 0.5, r, 0.6, bright=0.25), -0.1), t, g)
            if k % 2: place(mus, pan(pluck(m2f(ch[3] + up), 0.35, r, 0.25), 0.3), t + B / 2, g * 0.55)
            if k % 4 in (1, 3): place(mus, brush(0.25, r), t, g * 0.35)
            t += B; k += 1
    def padrun(t0, t1, g=0.5, warm=700, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(8 * B, t1 - t); place(mus, pad([m2f(m + up) for m in chords[k % 4][1:]], d, 0.28, r, att=0.4, rel=0.8, warm=warm), t, g); t += 8 * B; k += 1
    def box(t0, notes, gap, g=0.35):
        for i, m in enumerate(notes): place(mus, pan(musicbox(m2f(m), 0.6, r, 1.4), 0.2 * np.sin(i)), t0 + i * gap, g)
    padrun(fr(0), fr(60), 0.35, 300, -12, Am)                                   # S01 the wait before the smash
    place(mus, timpani(m2f(33), 1.4, r), fr(60), 0.6); place(mus, cymbal(1.6, r), fr(60), 0.35)
    caper(fr(64), fr(600), 0.5)                                                  # S01-S06 the break-in caper
    t = fr(600); k = 0                                                           # S07 the buffet: a lounge vibes sting
    while t < fr(672):
        place(mus, pan(vibes(m2f([69, 72, 76, 79, 77, 74, 72, 71][k % 8]), 0.4, r, 1.2), 0.2 * np.sin(k)), t, 0.45); t += B / 2; k += 1
    place(mus, brass(m2f(57), 0.5, 0.7, r, kind="tuba", scoop=-30), fr(676), 0.35)   # S08 the getaway
    caper(fr(680), fr(728), 0.45, 2)
    box(fr(731), [76, 79, 84, 88], 0.12, 0.3)                                    # S09 dawn
    t = fr(762); k = 0                                                           # S10 the smug drive: low synth bass
    while t < fr(892):
        place(mus, pan(pluck(m2f([33, 33, 36, 38, 33, 33, 40, 38][k % 8]), 0.55, r, 0.9, bright=0.5), 0), t, 0.5); place(mus, brush(0.2, r), t + B / 2, 0.18); t += B / 2; k += 1
    padrun(fr(900), fr(1052), 0.35, 400, -12, Am)                                # S11 the small problem
    padrun(fr(1060), fr(1105), 0.3, 900)                                         # S12 the paperwork
    padrun(fr(1120), fr(1206), 0.3, 600, 0, Am)                                  # S13
    padrun(fr(1214), fr(1463), 0.45, 1100)                                       # S14 'you see' warm pad
    box(fr(1318), [72, 76, 79, 84, 88, 91], 0.06, 0.25)
    padrun(fr(1470), fr(1573), 0.25, 350, -12, Am)                               # S15 the hiding
    t = fr(1580); k = 0                                                          # S16-S17 the investigation
    while t < fr(1798):
        place(mus, pan(pluck(m2f([57, 60, 64, 60, 59, 62, 64, 62][k % 8]), 0.35, r, 0.35), 0.25 * np.sin(k)), t, 0.32); t += B / 2; k += 1
    padrun(fr(1580), fr(1798), 0.3, 500, -12, Am)
    padrun(fr(1806), fr(2016), 0.4, 1200)                                        # S18-S20 dawn in Justice
    place(mus, brass(m2f(64), 0.5, 0.7, r, kind="tuba", scoop=-10), fr(1991), 0.3)
    padrun(fr(2020), fr(2159), 0.38, 450, -12, Am)                               # S21 charged, arrested, wanted
    padrun(fr(2215), fr(2370), 0.35, 800)                                        # S23-S24 the seconds and the years
    box(fr(2300), [69, 72, 76, 81, 79, 76, 72, 69], 0.2, 0.4)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.25

# ================================================================ sfx (synthesized)
def glass(r, big=1.0, dur=1.4):
    """a glass crash: a sharp broadband burst plus a spray of tiny high tinkles that thin out"""
    out = np.zeros(ns(dur))
    b = noise_burst(0.35, 2500, 12000, r, 0.001, 0.09 * big); out[: len(b)] += b * 1.2
    th = thud(90, 0.25, r, 0.8) * 0.6 * big; out[: len(th)] += th
    for i in range(int(30 * big)):
        t0 = 0.02 + (r.random() ** 1.6) * (dur - 0.3); c = clink(r, 3000 + 6000 * r.random(), 0.05 + 0.08 * r.random()); i0 = ns(t0); out[i0: i0 + len(c)] += c[: len(out) - i0] * (0.3 + 0.4 * r.random())
    return fades(out, 0.0005, 0.2)

def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    tock = lambda f0, g=0.3, p=0.0: P(S(thud(700, 0.05, r, 0.5), click(r)), fr(f0), g, p)
    stamp = lambda f0, g=0.5: P(S(thud(140, 0.18, r, 0.8), noise_burst(0.05, 1500, 6000, r, 0.001, 0.02)), fr(f0), g)
    engine = lambda f0, f1, g=0.12, f=55: P(fades(lp(np.sin(TAU * f * tt(fr(f1) - fr(f0))) + 0.4 * np.sin(TAU * 2 * f * tt(fr(f1) - fr(f0))) + 0.3 * colored(ns(fr(f1) - fr(f0)), r, 0.6), 600), 0.2, 0.3), fr(f0), g)
    # S01 a hum, the swish, THE crash, footsteps on glass
    t = tt(2.0); P(fades(np.sin(TAU * 60 * t) * 0.3 + 0.1 * colored(len(t), r, 0.8), 0.3, 0.3), 0, 0.05)
    W(fr(58), 0.35, 0.4); P(widen(glass(r, 1.6, 1.8), r), fr(60), 0.75)
    for k in range(8): P(S(stroll_step(r), clink(r, 4000 + 400 * k, 0.04) * 0.4), fr(70 + 5 * k), 0.25, 0.2 * np.sin(k))
    # S02 the cutters clack, idle engine, hazard ticks
    P(S(clink(r, 1800, 0.08), thud(600, 0.05, r, 0.6)), fr(150), 0.45); engine(160, 345, 0.06)
    for f0 in [185, 195]: P(click(r), fr(f0), 0.2, -0.3)
    # S03 night breeze, the sign's buzz
    P(breeze(4.6, r, 0.5), fr(205), 0.1); t = tt(4.0); P(fades(np.sin(TAU * 120 * t) * 0.15 * (1 + 0.3 * np.sin(TAU * 3 * t)), 0.3, 0.5), fr(220), 0.05)
    # S04 four case crashes, each a little higher
    for i, f0 in enumerate([350, 363, 369, 377]): P(widen(glass(rng(40 + i), 0.9, 1.1), r), fr(f0), 0.55)
    # S05 shuffles, slab clacks, box thumps, the drawer
    P(noise_burst(0.3, 1500, 6000, r, 0.01, 0.1), fr(405), 0.2); P(clink(r, 1500, 0.1), fr(440), 0.3); P(clink(r, 1300, 0.1), fr(446), 0.25)
    P(thud(120, 0.2, r, 0.5), fr(475), 0.3); P(S(rattle(0.2, r, 50), thud(200, 0.08, r, 0.6)), fr(493), 0.3)
    # S06 the squeeze, the SNAP, the lock hits the gravel twice, door hinges
    P(creak(0.5, r, 500, 900), fr(530), 0.15); P(S(clink(r, 2400, 0.12), noise_burst(0.06, 2000, 9000, r, 0.0005, 0.02)), fr(552), 0.6)
    for f0 in [566, 574]: P(S(thud(260, 0.08, r, 0.4), noise_burst(0.1, 800, 3000, r, 0.002, 0.04)), fr(f0), 0.3)
    P(creak(0.9, r, 200, 420), fr(562), 0.25)
    # S07 a plate 'ting'
    P(clink(r, 3200, 0.3), fr(643), 0.35, 0.2)
    # S08 the van revs away
    t = tt(1.8); P(fades(lp(np.sin(TAU * np.cumsum(55 + 70 * np.minimum(1, t / 1.2)) / SR) + 0.3 * colored(len(t), r, 0.5), 800) * np.minimum(1, t / 0.1), 0.02, 0.4), fr(680), 0.3)
    # S09 morning birds
    P(bird_chirps(1.2, r, 0.4), fr(730), 0.1)
    # S10 road hum, the speed camera's flash + shutter
    engine(761, 900, 0.1, 48); P(S(noise_burst(0.05, 3000, 10000, r, 0.0005, 0.01), thud(2000, 0.03, r, 0.3)), fr(870), 0.4); t = tt(0.3); P(fades(np.sin(TAU * 3200 * t) * np.exp(-t / 0.1), 0.001, 0.05), fr(870), 0.08)
    # S11 idle, the dun, a barcode beep
    engine(900, 1052, 0.06, 40); P(thud(80, 0.5, r, 0.2), fr(1007), 0.3); t = tt(0.12); P(fades(np.sin(TAU * 2600 * t), 0.002, 0.02), fr(1026), 0.12)
    # S12 the pen, the stamp; S13 a printer whirr
    t = tt(0.8); P(fades(bp(r.standard_normal(len(t)), 2500, 7000) * (0.5 + 0.5 * np.abs(np.sin(TAU * 4 * t))), 0.02, 0.1), fr(1060), 0.12); stamp(1088, 0.55)
    t = tt(1.4); P(fades(bp(r.standard_normal(len(t)), 300, 1500) * (0.6 + 0.4 * np.sin(TAU * 12 * t)), 0.1, 0.2), fr(1130), 0.06)
    # S14 the van pulls away, a shimmer as the trail floods, a sonar blip per tower
    engine(1262, 1380, 0.07, 50); W(fr(1330), 0.25, 1.0)
    for f0 in [1407, 1417, 1427, 1438, 1447]: t = tt(0.5); P(fades(np.sin(TAU * 1320 * t) * np.exp(-t / 0.12), 0.002, 0.1), fr(f0), 0.18)
    # S15 crickets
    t = tt(3.6); P(fades(bp(r.standard_normal(len(t)), 4000, 6000) * (np.sin(TAU * 18 * t) > 0.6), 0.2, 0.3), fr(1466), 0.04)
    # S16-S17 a pin per item, the string twang, the whoosh into the pin
    for f0 in [1600, 1622, 1656, 1685, 1720]: tock(f0, 0.3)
    t = tt(0.6); P(fades(np.sin(TAU * 196 * t) * np.exp(-t / 0.2), 0.002, 0.1), fr(1764), 0.2); W(fr(1795), 0.25, 0.6)
    # S18 sirens winding down, tyres; S19 the bell; S20 the garage door
    t = tt(1.6); P(fades(np.sin(TAU * np.cumsum(700 + 250 * np.sin(TAU * 1.4 * t)) / SR) * np.exp(-t / 0.9), 0.05, 0.3) * 0.4, fr(1800), 0.12)
    P(noise_burst(0.6, 300, 1500, r, 0.05, 0.25), fr(1835), 0.15); P(bird_chirps(3.0, r, 0.3), fr(1820), 0.08)
    P(chime([m2f(96), m2f(103)], r, 0.05), fr(1899), 0.25)
    P(fades(rattle(1.1, r, 30) * 0.8 + lp(colored(ns(1.1), r, 0.6), 500) * 0.3, 0.05, 0.2), fr(1925), 0.3); P(chime([m2f(91)], r), fr(1991), 0.18)
    # S21 the folder slap and the stamps
    P(S(noise_burst(0.08, 600, 3000, r, 0.002, 0.03), thud(160, 0.12, r, 0.5)), fr(2053), 0.5)
    for f0 in [2086, 2092]: stamp(f0, 0.5)
    for f0 in [2128, 2134, 2140]: stamp(f0, 0.4)
    # S22 gravel steps; S23 one tinkle; S24 the drawer rolls and THUNKs
    for k in range(6): P(stroll_step(r), fr(2160 + 8 * k), 0.22, 0.2)
    P(clink(r, 5200, 0.2), fr(2230), 0.2); P(rattle(0.3, r, 30), fr(2294), 0.15); P(S(thud(110, 0.25, r, 0.9), clink(r, 700, 0.1)), fr(2300), 0.55)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Kaching Sound FX.mp3", 493, 0.45, None), ("Kaching Sound FX.mp3", 682, 0.45, None), ("Chicken On Tree Screaming.mp3", 740, 0.4, 1.6),
                              ("Huh5544.mp3", 1105, 0.6, None), ("Yo Phone Ringing -Chino.mp3", 1550, 0.45, 1.7), ("Realization Sound.mp3", 1895, 0.4, None),
                              ("Meme Violin Sad Violin.mp3", 2163, 0.4, 2.2)]:
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
