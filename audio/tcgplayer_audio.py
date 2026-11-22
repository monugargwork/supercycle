# Sound for the TCGplayer reel: an original synthesized comedic underscore (a bouncy pizzicato/pluck ostinato under the seller,
# a bright brassy party groove for HQ, a low sad pad for Syracuse, a calm vibes 'you see' for the market, a corporate pad for Ron),
# SFX on the picture's event frames (mirrors src/videos/tcgplayer/story.ts and plan.json), and a few of the user's meme sounds
# where the sound is the joke: a ka-ching on the billion, a bruh, a sitcom laugh on 'phim hài', a huh on 'Khoan', a thud for the
# sack, a notification for the message, the sad violin at the end. Music ducked under speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/tcgplayer/mix.wav (48 kHz stereo, exact length) + stems.   python3 tcgplayer_audio.py ../public/tcgplayer/voice.wav ../public/tcgplayer/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2360
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "tcgplayer", "memes")

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
    def plucks(t0, t1, g=0.5, up=0, chords=C, inst=pluck):
        t = t0; k = 0
        while t < t1 - 0.2:
            ch = chords[(k // 8) % len(chords)]; m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8]] + 12 + up
            place(mus, pan(inst(m2f(m), 0.55 if k % 2 == 0 else 0.4, r, 0.5), 0.25 * np.sin(k * 1.3)), t, g)
            if k % 4 == 0: place(mus, pan(pluck(m2f(ch[0] - 12 + up), 0.6, r, 0.8, bright=0.3), 0), t, g * 0.9)
            t += B / 2; k += 1
    def padrun(t0, t1, g=0.5, warm=700, up=0, chords=C):
        t = t0; k = 0
        while t < t1 - 0.3:
            d = min(8 * B, t1 - t); place(mus, pad([m2f(m + up) for m in chords[k % 4][1:]], d, 0.28, r, att=0.4, rel=0.8, warm=warm), t, g); t += 8 * B; k += 1
    def party(t0, t1, g=0.5):
        t = t0; k = 0
        while t < t1 - 0.2:
            place(mus, brass(m2f([60, 64, 67, 72][k % 4]), B * 0.45, 0.7, r, kind="trumpet" if False else "tuba", scoop=-10), t, g * 0.6)
            place(mus, snare(0.5, r), t + B / 2, g * 0.5)
            t += B; k += 1
    plucks(fr(0), fr(352), 0.45)                                              # the seller, deadpan
    party(fr(352), fr(560), 0.5); padrun(fr(352), fr(560), 0.35, 1200, 12)     # HQ party
    plucks(fr(616), fr(900), 0.42, -3, [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 55]])   # complaints (minor)
    padrun(fr(900), fr(1069), 0.5, 350, -12, [[45, 52, 57, 60], [41, 48, 53, 57], [38, 45, 50, 53], [40, 47, 52, 56]])  # Syracuse
    plucks(fr(1069), fr(1297), 0.4, 0)
    padrun(fr(1297), fr(1422), 0.4, 500, -12)                                # Khoan: low and tense
    t = fr(1430); k = 0                                                      # the market: calm vibes
    while t < fr(1700):
        place(mus, pan(vibes(m2f([72, 76, 79, 76, 74, 77, 81, 77][k % 8]), 0.45, r, 1.6), 0.2 * np.sin(k)), t, 0.42); t += B; k += 1
    padrun(fr(1430), fr(1702), 0.4, 900)
    padrun(fr(1702), fr(1994), 0.45, 1400, 0, [[48, 55, 60, 64], [53, 60, 65, 69], [55, 62, 67, 71], [48, 55, 60, 64]])  # Ron's corporate pad
    plucks(fr(1994), fr(2209), 0.4, 2)
    padrun(fr(2209), fr(2290), 0.35, 600, -12)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.25

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.3, d=0.5: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    keys = lambda a, b, g=0.18: [P(click(r), fr(a) + k * 0.11, g, 0.15) for k in range(int((fr(b) - fr(a)) / 0.11))]
    slide = lambda f0, d=0.5, g=0.35: P(fades(bp(colored(ns(d), r, 0.4), 600, 4000) * np.exp(-tt(d) / (d * 0.6)), 0.01, 0.1), fr(f0), g)
    stamp = lambda f0, g=0.7: P(S(thud(140, 0.18, r, 0.8), noise_burst(0.05, 1500, 6000, r, 0.001, 0.02)), fr(f0), g)
    # S01 counter ticks, popper, confetti, stamp
    for k in range(14): P(click(r), fr(2 + 3 * k), 0.08, -0.2)
    P(S(noise_burst(0.12, 800, 6000, r, 0.001, 0.05), thud(400, 0.06, r, 0.9)), fr(101), 0.6); P(fades(bp(colored(ns(1.2), r, 0.3), 3000, 9000) * np.exp(-tt(1.2) / 0.5), 0.01, 0.2), fr(103), 0.12)
    W(fr(140), 0.2, 0.3); stamp(144, 0.8)
    # S02 tiles pop
    for f0 in [273, 276, 279, 282, 292, 295, 298, 301]: P(click(r), fr(f0), 0.15, 0.2)
    P(chime([m2f(84), m2f(88), m2f(91)], r, 0.06), fr(312), 0.18)
    # S03 lever clunk, split-flap clatter; S04 fireworks, party horn
    P(S(thud(90, 0.25, r, 0.7), clink(r, 900, 0.1)), fr(389), 0.6)
    for k in range(int(fr(480 - 392) / 0.035)): P(noise_burst(0.02, 2500, 8000, r, 0.0005, 0.006), fr(392) + k * 0.035, 0.07, 0.1 * np.sin(k))
    P(clink(r, 1800, 0.2), fr(480), 0.3)
    for f0 in [508, 515, 522]: P(S(thud(60, 0.4, r, 0.5), noise_burst(0.6, 2000, 9000, r, 0.002, 0.25) * 0.6), fr(f0), 0.45, 0.3)
    P(brass(m2f(67), 0.5, 0.7, r, kind="tuba", scoop=-30), fr(540), 0.3)
    # S05 plate scrape; S06 coins, error buzz, power-down
    slide(600, 0.35, 0.3)
    for f0 in [636, 641, 646]: P(clink(r, 3200, 0.12), fr(f0 + 12), 0.35, 0.3)
    P(fades(np.sign(np.sin(TAU * 180 * tt(0.35))) * 0.3, 0.005, 0.05), fr(672), 0.18); P(fades(np.sin(TAU * np.linspace(800, 200, ns(0.3)) * tt(0.3)), 0.005, 0.1), fr(700), 0.12)
    # S07 the drop whistle and slam
    t = tt(0.7); P(fades(np.sin(TAU * np.cumsum(np.linspace(1800, 500, len(t))) / SR) * 0.4, 0.02, 0.05), fr(844), 0.2)
    P(S(thud(110, 0.3, r, 0.9), noise_burst(0.1, 500, 3000, r, 0.002, 0.05)), fr(866), 0.8)
    # S08 street, shutter
    P(fades(bp(colored(ns(5.6), r, 0.5), 200, 2000) * 0.4, 0.3, 0.6), fr(900), 0.1)
    P(rattle(0.75, r, 40, heavy=True), fr(972), 0.35); P(S(thud(120, 0.3, r, 0.8), clink(r, 600, 0.2)), fr(994), 0.55)
    # S09 the throw; S10 plane lands, distant whoosh
    W(fr(1090), 0.25, 0.5); W(fr(1112), 0.15, 0.4); P(noise_burst(0.05, 1500, 5000, r, 0.002, 0.02), fr(1117), 0.2); W(fr(1150), 0.08, 0.8)
    # S11 stamps
    stamp(1200); stamp(1226); stamp(1255, 0.5); P(chime([m2f(91)], r), fr(1257), 0.15)
    # S12 counter ticks, kettle hiss
    for k in range(15): P(click(r), fr(1312 + 3 * k), 0.07, -0.2)
    P(fades(bp(colored(ns(0.9), r, 0.2), 4000, 9000) * np.minimum(1, tt(0.9) / 0.2), 0.05, 0.2), fr(1386), 0.18)
    # S13 market murmur, coins, castors, knock, register
    P(fades(bp(colored(ns(9.3), r, 0.4), 250, 1800) * 0.3, 0.5, 0.8), fr(1422), 0.1)
    for f0 in [1517, 1522, 1527]: P(clink(r, 2800, 0.12), fr(f0 + 12), 0.3, -0.2)
    P(rattle(1.6, r, 18), fr(1600), 0.15); P(S(thud(160, 0.18, r, 0.6), noise_burst(0.05, 800, 3000, r, 0.002, 0.03)), fr(1646), 0.5)
    P(chime([m2f(96), m2f(100)], r, 0.05), fr(1690), 0.2)
    # S14 chair creaks, steps, nameplate flip
    P(creak(0.4, r), fr(1795), 0.2)
    for k in range(5): P(thud(200, 0.06, r, 0.3), fr(1802 + 6 * k), 0.12, 0.3)
    for k in range(5): P(thud(200, 0.06, r, 0.3), fr(1817 + 6 * k), 0.12, -0.3)
    P(creak(0.3, r), fr(1844), 0.2); W(fr(1850), 0.15, 0.25)
    # S15 typing
    keys(2075, 2140, 0.1); keys(2145, 2190, 0.1)
    return out

def memes():
    out = np.zeros((2, N))
    for name, f0, g, secs in [("Kaching Sound FX.mp3", 46, 0.55, None), ("Kaching Sound FX.mp3", 480, 0.45, None), ("BRUH.mp3", 610, 0.6, None),
                              ("Emoji Laugh.mp3", 768, 0.5, None), ("Huh5544.mp3", 1299, 0.6, None), ("Instagram Thud.mp3", 2237, 0.6, None),
                              ("Discord Notification.mp3", 2198, 0.5, None), ("Meme Violin Sad Violin.mp3", 2268, 0.45, None)]:
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
