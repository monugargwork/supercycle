# Sound for the Fossil sheet in the loft reel: an original synthesized score (a music box for 1999, a hollow low pad for the loft
# years, a light pizz for the clear-out, a suspense pizz at the counter, a rising pad + vibes for the holo reveal, the press pizz,
# the music box again for the KB Toys promo, the saleroom pizz with brass stabs for the estimate, a hush for the gavel, and the music
# box for the fan), SFX on the plan's event frames (mirrors src/videos/fossil/story.ts and plan.json), and a few of the user's meme
# sounds (public/fossil/memes/*.mp3), all under the untouched voice: music ducked under speech, -14 LUFS, true peak < -1 dBTP.
# Output: public/fossil/mix.wav (48 kHz stereo, exact length).   python3 fossil_audio.py ../public/fossil/voice.wav ../public/fossil/mix.wav
import os, subprocess, sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack, creak

FPS = 30
TOTAL = 2290
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "fossil", "memes")

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
B = 60.0 / 100

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
    def box(t0, t1, g=0.6, up=12):
        t = t0; k = 0
        while t < t1 - 0.4:
            ch = C[(k // 8) % 4]; place(mus, pan(musicbox(m2f(ch[1:][k % 3] + up), 0.35, r, 1.0), 0.3 * np.sin(k)), t, 0.32 * g / 0.6)
            if k % 8 == 0: place(mus, pad([m2f(m) for m in ch[1:]], min(8 * B / 2, t1 - t), 0.25, r, att=0.4, rel=0.6, warm=800), t, g)
            t += B / 2; k += 1
    box(fr(0), fr(206), 0.55)                                      # 1999: the relative and the hatch
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(122), 0.8) # the slam
    padrun(fr(206), fr(510), 0.5, 400, -12)                        # the loft years: hollow
    padrun(fr(510), fr(600), 0.5, 700)                             # 2026, the hatch opens
    pizz(fr(600), fr(645), 0, 0.5, half=True)
    padrun(fr(645), fr(795), 0.45, 450, -12)                       # the damage list
    pizz(fr(795), fr(1050), 2, 0.55, half=True)                    # wallpaper, the save, the TV
    pizz(fr(1050), fr(1245), 0, 0.5, sn=True)                      # the counter, suspense
    box(fr(1245), fr(1390), 0.55)                                  # 1999 store
    padrun(fr(1390), fr(1578), 0.55, 900)                          # the reveal
    for i, m in enumerate([69, 72, 76, 81, 84]): place(mus, pan(vibes(m2f(m), 0.5, r, 2.0, damp=0.2), 0.1), fr(1498) + 0.07 * i, 0.55)
    for i, m in enumerate([60, 64, 67, 72]): place(mus, pan(brass(m2f(m), 0.7, 0.8, r, kind="stab"), 0.0), fr(1525) + 0.06 * i, 0.45)
    pizz(fr(1578), fr(1650), 0, 0.55, half=True, sn=True)          # the press
    place(mus, pan(timpani(m2f(33), 0.9, r, 2.0), 0), fr(1617), 0.7)
    box(fr(1650), fr(1775), 0.55)                                  # the promo board
    pizz(fr(1775), fr(2085), 2, 0.5, half=True)                    # the shoot, the estimate
    for f0, ms in ((2036, [60, 64, 67]), (2056, [62, 67, 71, 74])):
        for i, m in enumerate(ms): place(mus, pan(brass(m2f(m), 0.6, 0.8, r, kind="stab"), 0.0), fr(f0) + 0.05 * i, 0.5)
    padrun(fr(2085), fr(2175), 0.45, 500, -12)                     # the gavel hush
    box(fr(2175), fr(2290), 0.5)                                   # the fan
    for i, m in enumerate([57, 64, 69, 72, 76]): place(mus, pan(vibes(m2f(m), 0.5, r, 2.0, damp=0.2), 0.1), fr(2252) + 0.06 * i, 0.45)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.3

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.35, d=0.6: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    steps = lambda a, n, gap=8, g=0.3, p=0.2: [P(thud(200, 0.08, r, 0.4), fr(a + gap * k), g, p) for k in range(n)]
    rasp = lambda a, b, g=0.35: P(fades(bp(colored(ns(fr(b - a)), r, 0.3), 1500, 7000) * 0.3 * (1 + 0.4 * np.sin(TAU * 14 * tt(fr(b - a)))), 0.02, 0.1), fr(a), g)
    room = lambda a, b, g=0.25: P(widen(crowd(fr(b - a), r), r), fr(a), g)
    # S01 the band, the shove, the roll, the fan clank, the cord, the slam, the cough
    P(fades(np.sin(TAU * (180 + 260 * np.exp(-tt(0.3) / 0.05)) * tt(0.3)) * np.exp(-tt(0.3) / 0.08), 0.001, 0.05), fr(55), 0.4)
    W(fr(66), 0.35, 0.5); P(thud(120, 0.2, r, 0.6), fr(80), 0.5); rasp(80, 96, 0.25); P(clink(r, 700, 0.15), fr(97), 0.35, 0.3)
    P(creak(0.3, r, 500, 380), fr(104), 0.3); P(S(thud(60, 0.6, r, 1.0), wood_crack(r) * 0.6, noise_burst(0.3, 200, 2000, r, 0.004, 0.1)), fr(122), 1.0)
    P(noise_burst(0.18, 300, 1800, r, 0.01, 0.06), fr(128), 0.3); P(noise_burst(0.15, 300, 1800, r, 0.01, 0.05), fr(140), 0.25)
    # S02 the calendar flutter; a sped-up clock
    for k in range(27): P(flick(r), fr(212 + 1.4 * k), 0.18, 0.3)
    for k in range(16): P(clink(r, 3200, 0.01) * 0.4, fr(210 + 3 * k), 0.12, -0.2)
    # S03 dust, the spider, the fan creak, three door clunks
    P(noise_burst(0.6, 2000, 8000, r, 0.1, 0.3), fr(285), 0.12); P(fades(np.sin(TAU * (900 - 500 * tt(0.4) / 0.4) * tt(0.4)) * 0.3, 0.01, 0.05), fr(305), 0.15)
    P(creak(0.6, r, 600, 420), fr(339), 0.35, 0.3)
    for p0 in (344, 356, 368): P(thud(220, 0.1, r, 0.5), fr(p0 - 3), 0.3); P(thud(180, 0.12, r, 0.6), fr(p0 + 12), 0.35)
    # S05 the hatch from below, the bang, the torch
    P(thud(140, 0.15, r, 0.6), fr(526), 0.4); P(S(thud(110, 0.3, r, 0.9), wood_crack(r) * 0.4), fr(533), 0.7); P(click(r), fr(536), 0.4)
    # S06 web snaps, the scrape
    for k in range(4): P(clink(r, 4000 + 300 * k, 0.005) * 0.3, fr(578 + 2 * k), 0.2); rasp(578, 590, 0.3)
    # S07 the unroll, the tin
    rasp(620, 638, 0.45); P(S(clink(r, 600, 0.15), thud(250, 0.1, r, 0.5)), fr(645), 0.55)
    # S08 the corner lift and flop
    P(noise_burst(0.25, 1500, 6000, r, 0.02, 0.1), fr(752), 0.2); P(noise_burst(0.2, 800, 4000, r, 0.005, 0.06), fr(792), 0.25)
    # S09 paper slap on the wall, the roll up, the toss, the bag
    P(noise_burst(0.12, 600, 5000, r, 0.002, 0.04), fr(811), 0.5); rasp(836, 846, 0.35); W(fr(850), 0.3, 0.5); P(noise_burst(0.4, 400, 3000, r, 0.01, 0.15), fr(860), 0.45)
    # S10 the dash, the yank, the TV crowd, the hug
    steps(882, 5, 3.5, 0.3, 0.2); P(noise_burst(0.35, 400, 3000, r, 0.01, 0.12), fr(900), 0.45); room(940, 1000, 0.35); P(noise_burst(0.2, 300, 1500, r, 0.02, 0.08), fr(1028), 0.25)
    # S11-S12 the counter: room tone, the freeze
    room(1050, 1245, 0.1); P(S(thud(300, 0.05, r, 0.5), noise_burst(0.15, 2000, 8000, r, 0.002, 0.05)), fr(1140), 0.5)
    # S13 the store: chatter, a till ding
    room(1245, 1390, 0.16); P(chime([m2f(88), m2f(93)], r, 0.08), fr(1300), 0.3)
    # S14 the unroll, the lamp, the shimmer
    rasp(1395, 1418, 0.4); P(click(r), fr(1420), 0.5); P(chime([m2f(91), m2f(96), m2f(100), m2f(103)], r, 0.05), fr(1498), 0.35)
    # S15 the press: clatter loop, roller hiss, the chop, cards slapping
    for k in range(18): P(S(thud(260, 0.05, r, 0.4), click(r) * 0.5), fr(1580 + 4 * k), 0.2, -0.2)
    P(widen(fades(bp(colored(ns(fr(70)), r, 0.4), 800, 4000) * 0.15, 0.1, 0.2), r), fr(1580), 0.3)
    P(S(thud(90, 0.4, r, 1.0), clink(r, 500, 0.1), noise_burst(0.15, 1000, 6000, r, 0.002, 0.05)), fr(1617), 0.9)
    for k in range(6): P(noise_burst(0.05, 2000, 7000, r, 0.002, 0.015), fr(1621 + 2.5 * k), 0.25, 0.1)
    # S16 store chatter
    room(1650, 1775, 0.14)
    # S17 the stamp
    P(S(thud(220, 0.1, r, 0.8), click(r)), fr(1923), 0.55)
    # S18 the board flaps, the room
    room(1950, 2175, 0.15)
    for f0 in (2036, 2056):
        for k in range(6): P(click(r), fr(f0) + 0.03 * k, 0.35, -0.1)
    # S19 the heartbeat under the held gavel
    for f0 in (2150, 2164): P(thud(55, 0.3, r, 0.2), fr(f0), 0.5)
    # S20 the hatch, the blade drops and rattles
    P(S(thud(110, 0.3, r, 0.8), wood_crack(r) * 0.3), fr(2182), 0.5); P(S(clink(r, 1100, 0.12), clink(r, 1600, 0.08)), fr(2244), 0.6)
    for k, f0 in enumerate((2251, 2256)): P(clink(r, 1300 - 100 * k, 0.04), fr(f0), 0.3)
    return out

# ================================================================ meme sounds (the user's folder), only where they are the joke
MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (122, "Instagram Thud.mp3", None, 0.6),
    (356, "Suspicious Sound.mp3", 1.6, 0.5),
    (653, "Meme Violin Sad Violin.mp3", 2.6, 0.35),
    (821, "BRUH.mp3", None, 0.8),
    (1142, "Huh5544.mp3", None, 0.9),
    (1498, "Wowwwwwwwwwwwwwwwww.mp3", 1.8, 0.5),
    (1617, "Punch Hit.mp3", None, 0.5),
    (1700, "Kids Cheering.mp3", 1.4, 0.35),
    (1842, "Camera shutter.mp3", 0.5, 0.6), (1859, "Camera shutter.mp3", 0.5, 0.55), (1873, "Camera shutter.mp3", 0.5, 0.55), (1886, "Camera shutter.mp3", 0.5, 0.6),
    (2056, "Kaching Sound FX.mp3", None, 0.6),
    (2252, "Suspicious Sound.mp3", 2.0, 0.6),
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
