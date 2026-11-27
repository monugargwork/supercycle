# Sound for the Chicago reel (Old Skool TCG): an original synthesized underscore (sneaky pizzicato plucks in A minor for the thefts,
# bright plucks for the Chicago street, a music-box sparkle per card in the jacket and a brass hit on $6,700, a low drone for the
# camera, a tape-stop freeze on "Khoan", calm vibes for the "you see" and the house, a sad pad for the admission, a smug brass bounce
# for the exit), SFX on the picture's event frames (mirrors src/videos/retford/story.ts and plan.json), and a few of the user's meme
# sounds where the sound is the joke: ka-ching on the register and on $6,700, suspicious on the first dip into the box, huh on
# "Khoan", hehe boi on the spoon, the camera shutter on the cut to the lens, his own phone ringing at the end, the realization sting.
# Music ducked under speech, -14 LUFS, TP < -1.
# Output: public/retford/mix.wav (48 kHz stereo, exact length) + stems.   python3 retford_audio.py ../public/retford/voice.wav ../public/retford/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak, stroll_step, push_thump, bird_chirps, breeze

FPS = 30
TOTAL = 2440
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
    plucks(fr(0), fr(165), 0.42, 0, Am)                                       # S01 sneaky
    plucks(fr(229), fr(398), 0.4, 2)                                           # S02 the Chicago street, bright
    plucks(fr(398), fr(635), 0.32, 0)                                          # S03-S05 the busy shop
    plucks(fr(635), fr(800), 0.4, 0, Am)                                       # S06-S07 sneaky again
    plucks(fr(800), fr(895), 0.45, 0, Am, accel=0.4)                           # S08 three more, faster
    padrun(fr(895), fr(1188), 0.4, 1400, 12)                                   # S09-S10 the jacket
    for t0 in [905, 990, 1070]: box(fr(t0), [84, 88, 91, 96], 0.07, 0.3)
    place(mus, brass(m2f(48), 1.2, 0.8, r, kind="tuba", scoop=-12), fr(1146), 0.4); place(mus, brass(m2f(60), 1.0, 0.7, r, kind="tuba"), fr(1146), 0.3)
    padrun(fr(1188), fr(1336), 0.45, 320, -12, Am)                             # S11 the camera: a low drone
    padrun(fr(1350), fr(1495), 0.3, 500, -12, Am)                              # S12 after the freeze
    t = fr(1495); k = 0                                                        # S13-S15 the calm "you see": vibes
    while t < fr(1765):
        place(mus, pan(vibes(m2f([72, 76, 79, 76, 74, 77, 81, 77][k % 8]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, 0.4); t += B; k += 1
    padrun(fr(1495), fr(1765), 0.32, 900)
    box(fr(1624), [79, 84, 88, 91], 0.1, 0.3)                                  # the guest at the door
    padrun(fr(1765), fr(1947), 0.42, 400, -12, Am)                             # S16 the admission, sad
    padrun(fr(1947), fr(2047), 0.38, 1000)                                     # S17 trust, warm (stops on the cut)
    plucks(fr(2089), fr(2207), 0.38, 0, Am)                                    # S18-S19 the police
    t = fr(2210); k = 0                                                        # S20 smug exit: brass bounce
    while t < fr(2300):
        place(mus, brass(m2f([55, 59, 62, 59][k % 4]), B * 0.45, 0.7, r, kind="tuba", scoop=-8), t, 0.32); t += B / 2; k += 1
    padrun(fr(2300), fr(2440), 0.3, 600, -12, Am)                              # S21 the face, the phone
    box(fr(2412), [69, 64, 57], 0.18, 0.35)
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
    # S01 the shop, three bills, the lift, the swish, out through the window
    murmur(0, 160, 0.1)
    for f0 in [80, 85, 89]: slap(f0)
    P(pluck(m2f(64), 0.5, r, 0.4), fr(142), 0.25); swish(157); W(fr(185), 0.25, 0.8)
    # S02 the street
    P(breeze(5.8, r, 0.6), fr(229), 0.12); P(bird_chirps(5.5, r, 0.3), fr(232), 0.1); W(fr(268), 0.18, 1.2); steps(240, 330, 10, 0.12, -0.3)
    # S03-S05 the busy shop, the phone, the door, footsteps, the stack on the counter
    murmur(398, 800, 0.08)
    ring(462, 2); P(click(r), fr(484), 0.3); bell(512); steps(514, 612, 9, 0.2, 0.2)
    P(click(r), fr(556), 0.25); P(thud(140, 0.15, r, 0.5), fr(620), 0.35)
    # S06 the swish into the jacket
    swish(700)
    # S07 the key, the drawer, three slaps
    P(click(r), fr(748), 0.3); slide(752, 0.25, 0.4); P(clink(r, 3200, 0.1), fr(754), 0.15)
    for f0 in [776, 781, 786]: slap(f0, 0.35)
    slide(794, 0.2, 0.3)
    # S08 three plucks and swishes
    murmur(800, 895, 0.08)
    for i, f0 in enumerate([849, 866, 878]): P(pluck(m2f(64 + 3 * i), 0.5, r, 0.4), fr(f0), 0.25); swish(f0 + 8, 0.2)
    # S09-S10 a price tick on each sticker
    for f0 in [965, 1048]: P(click(r), fr(f0), 0.2)
    # S12 the freeze: a record scratch, three soft hits on the reasons
    t = tt(0.4); P(fades(np.sin(TAU * np.cumsum(np.linspace(900, 80, len(t))) / SR) * np.exp(-t / 0.18) + 0.3 * bp(r.standard_normal(len(t)), 1500, 6000) * np.exp(-t / 0.1), 0.003, 0.08), fr(1336), 0.3)
    for f0 in [1397, 1422, 1478]: P(thud(90, 0.3, r, 0.4), fr(f0), 0.35)
    # S13 a warm chord on the handshake; S14 the doorbell and the creak; S15 the spoon
    P(chime([m2f(72), m2f(76), m2f(79)], r, 0.03), fr(1590), 0.18)
    P(chime([m2f(88), m2f(84)], r, 0.35), fr(1624), 0.3); P(creak(0.6, r, 250, 450), fr(1630), 0.18)
    P(clink(r, 4200, 0.12), fr(1745), 0.3)
    # S16 footsteps, the case door, the padlock
    steps(1832, 1896, 10, 0.18, -0.3); P(creak(0.35, r, 500, 900), fr(1896), 0.2); P(click(r), fr(1920), 0.3); P(S(clink(r, 1800, 0.12), click(r)), fr(1926), 0.45)
    # S17 a REC beep after the shutter
    P(np.sin(TAU * 1760 * tt(0.12)) * 0.3, fr(2052), 0.2)
    # S18 dial beeps (DTMF), the ringing tone
    for k, (a1, b1) in enumerate([(852, 1336), (770, 1336), (697, 1209)]): t = tt(0.12); P(fades((np.sin(TAU * a1 * t) + np.sin(TAU * b1 * t)) * 0.25, 0.005, 0.02), fr(2096 + 4 * k), 0.25)
    t = tt(1.0); P(fades((np.sin(TAU * 440 * t) + np.sin(TAU * 480 * t)) * 0.15, 0.01, 0.05), fr(2110), 0.12)
    # S19 pen scratches
    for f0 in range(2160, 2196, 5): P(noise_burst(0.12, 2000, 7000, r, 0.01, 0.05), fr(f0), 0.08, 0.2)
    # S20 the door bell, footsteps out, the street
    bell(2208); steps(2212, 2246, 9, 0.2); P(breeze(7.5, r, 0.6), fr(2207), 0.1); P(bird_chirps(7.0, r, 0.3), fr(2210), 0.08)
    # S21 a record stop on the freeze
    t = tt(0.5); P(fades(np.sin(TAU * np.cumsum(np.linspace(500, 40, len(t))) / SR) * np.exp(-t / 0.25), 0.005, 0.1), fr(2398), 0.25)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Kaching Sound FX.mp3", 91, 0.35, None), ("Suspicious Sound.mp3", 648, 0.4, 2.4), ("Kaching Sound FX.mp3", 752, 0.45, None),
                              ("Kaching Sound FX.mp3", 1146, 0.45, None), ("Camera shutter.mp3", 1262, 0.35, None), ("Huh5544.mp3", 1338, 0.55, None),
                              ("Hehe Boiiiiiii.mp3", 1756, 0.35, None), ("Camera shutter.mp3", 2047, 0.45, None), ("Yo Phone Ringing -Chino.mp3", 2371, 0.4, 2.3),
                              ("Realization Sound.mp3", 2398, 0.35, 1.4)]:
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
