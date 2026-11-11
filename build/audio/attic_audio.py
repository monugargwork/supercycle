# Sound for the attic Pokémon reel: an original synthesized score (warm music-box hook -> bouncy late-90s pizzicato ->
# a hush for the forgotten years -> a riser into Ewbank's -> calm explanation -> brass for the auction -> warm coda),
# SFX on the picture's event frames (mirrors src/videos/attic/story.ts), and the user's meme sounds on their beats
# (public/attic/memes/*.mp3, decoded with ffmpeg), all under the untouched voice: music ducked under speech, -14 LUFS,
# true peak < -1 dBTP. Output: public/attic/mix.wav (48 kHz stereo, exact length) + stems.
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
MEMES = os.path.join(os.path.dirname(__file__), "..", "public", "attic", "memes")

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
    C = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]]  # C, Am, F, G
    # ---- hook (0 .. 6.4 s): warm music box over a soft pad, a hush on the dust ----
    for k in range(int(6.2 / (B / 2))):
        ch = C[(k // 8) % 4]
        place(mus, pan(musicbox(m2f(ch[1 + k % 3] + 24), 0.4, r, 1.2), 0.3 * np.sin(k)), k * B / 2, 0.45 if k < 36 else 0.25)
    place(mus, pad([m2f(m) for m in [60, 64, 67]], 6.3, 0.25, r, att=0.6, rel=1.0, warm=700), 0.0, 0.6)
    # ---- late 90s (6.4 .. 28.7 s): bouncy pizz bass, brushes, glock hook ----
    t0, t1 = fr(193), fr(855)
    bass = [36, 43, 45, 43, 41, 48, 43, 47]
    for i in range(int((t1 - t0) / B)):
        t = t0 + i * B; g = 0.5 if t > fr(733) else 0.85
        place(mus, pan(pluck(m2f(bass[i % 8]), 0.8, r, 0.8, 0.4), -0.15), t, g)
        if i % 2: place(mus, pan(brush(0.5, r), 0.3), t, 0.6 * g)
        if i % 4 == 2: [place(mus, pan(vibes(m2f(m), 0.4, r, 1.0, damp=0.35), 0.25), t + B / 2, 0.45 * g) for m in C[(i // 4) % 4][1:]]
    hook = [(0, 76), (0.5, 79), (1.0, 81), (1.5, 79), (2.0, 76), (2.5, 72)]
    for ta in [fr(200), fr(460), fr(690)]:
        for dt, m in hook: place(mus, pan(glock(m2f(m), 0.5, r, 1.2), 0.1), ta + dt * B, 0.4)
    # the forgotten years (28.7 .. 34.3 s): thin pad, a ticking clock
    place(mus, pad([m2f(m) for m in [57, 60, 64]], fr(1028) - fr(862), 0.22, r, att=0.8, rel=0.6, warm=600), fr(862), 0.6)
    for k in range(int((fr(990) - fr(866)) / 0.5)): place(mus, pan(clink(r, 3200, 0.03) * 0.3, -0.4), fr(866) + k * 0.5, 0.4)
    # ---- the climb to Ewbank's (34.3 .. 40.3 s): driving pizz + snare, a cymbal on the jaw drop ----
    for i in range(int((fr(1180) - fr(1028)) / (B / 2))):
        t = fr(1028) + i * B / 2
        place(mus, pan(pluck(m2f(43 + (i // 8) % 2 * 2), 0.9, r, 0.4, 0.5), -0.1), t, 0.7)
        if i % 2 == 1: place(mus, pan(snare(0.3 + 0.4 * i / 40, r, 0.2), 0.2), t, 0.4)
    place(mus, pan(timpani(m2f(43), 0.9, r, 2.0), 0), fr(1186), 0.8); place(mus, widen(cymbal(0.6, r, 2.2), r), fr(1186), 0.4)
    # ---- explanation (43.4 .. 57 s): pad + music box ----
    t = fr(1303)
    while t < fr(1800):
        ch = C[int((t - fr(1303)) / (8 * B)) % 4]
        place(mus, pad([m2f(m) for m in ch[1:]], min(8 * B, fr(1805) - t), 0.28, r, att=0.4, rel=0.6, warm=700), t, 0.7)
        for k in range(16):
            if t + k * B / 2 > fr(1800): break
            place(mus, pan(musicbox(m2f(ch[1:][k % 3] + 12 + (12 if k % 8 >= 4 else 0)), 0.35, r, 1.0), 0.3 * np.sin(k)), t + k * B / 2, 0.35)
        t += 8 * B
    # ---- the auction (60.3 .. 70.4 s): snare roll into the gavel, brass fanfare on the total ----
    for k in range(int(1.4 * 24)): place(mus, pan(snare(0.15 + 0.5 * k / 34, r, 0.2, snappy=0.8, buzz=True), 0.1), fr(1921) - 1.4 + k / 24, 0.4)
    place(mus, pan(timpani(m2f(36), 0.9, r, 2.0), 0), fr(1921), 0.9); place(mus, widen(cymbal(0.7, r, 2.4), r), fr(1921), 0.35)
    fan = [(0, 60, 0.4), (0.4, 64, 0.4), (0.8, 67, 0.4), (1.2, 72, 1.4)]
    for dt, m, d in fan: place(mus, pan(brass(m2f(m), d, 0.75, r, kind="horn" if m > 62 else "tuba"), 0.1), fr(2037) + dt, 0.6)
    place(mus, widen(cymbal(0.7, r, 2.6), r), fr(2037) + 1.2, 0.35)
    # ---- coda (70.4 s ..): the hook melody slow on the music box, a warm button ----
    for i, (dt, m) in enumerate(hook): place(mus, pan(musicbox(m2f(m + 12), 0.45, r, 1.6), 0.2), fr(2120) + dt * 1.6 * B, 0.45)
    place(mus, pad([m2f(m) for m in [60, 64, 67, 72]], DUR - fr(2111), 0.25, r, att=1.0, rel=1.2, warm=800), fr(2111), 0.6)
    place(mus, pan(glock(m2f(84), 0.6, r, 1.6), 0.2), fr(2300), 0.5)
    wet = convolve_st(mus, make_ir(1.6, 3, hf=0.6))[:, :N]
    return mus * 0.85 + wet * 0.3

# ================================================================ sfx (synthesized)
def sfx():
    out = np.zeros((2, N)); r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.35, d=0.6: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    # hook: the stack slides on the boards, the hatch SLAM, dust
    P(noise_burst(0.5, 300, 2500, r, 0.05, 0.25), fr(26), 0.4); P(thud(180, 0.15, r, 0.6), fr(54), 0.5)
    for pf in [88, 96]: P(thud(240, 0.08, r, 0.5), fr(pf), 0.35)
    P(S(thud(85, 0.4, r, 1.0), noise_burst(0.6, 400, 3000, r, 0.01, 0.3)), fr(125), 0.9)
    # yard: kids' chatter, the card flick; the sparkle; scheme
    P(widen(fades(bp(colored(ns(8.5), r, 0.4), 500, 3500) * 0.18, 0.4, 0.4), r), fr(193), 0.5)
    P(flick(r), fr(262), 0.5); P(flick(r), fr(336), 0.5); P(chime([m2f(91), m2f(96), m2f(100)], r, 0.05), fr(359), 0.5)
    # study: mouse clicks, keyboard; parcels thump
    W(fr(457), 0.25, 0.5)
    for c in [500, 514, 530, 713]: P(click(r), fr(c), 0.6, 0.2)
    # hallway: cards into the toy box, the football bounce
    for k in range(4): P(flick(r), fr(662 + 2 * k), 0.35, -0.3)
    for k in range(4): P(thud(150, 0.1, r, 0.5), fr(673) + 0.35 * k, 0.4 * 0.8 ** k, 0.2)
    # ladder climb, stack slides, the hatch shuts
    for k in range(5): P(creak(0.25, r, 140, 210), fr(740) + k * 0.33, 0.25)
    P(noise_burst(0.5, 300, 2500, r, 0.05, 0.25), fr(800), 0.35); P(thud(90, 0.3, r, 0.8), fr(832), 0.6)
    # 15 years later: paper rustle, the tea SPIT
    P(noise_burst(0.4, 1500, 7000, r, 0.02, 0.15), fr(935), 0.3)
    P(S(noise_burst(0.35, 600, 5000, r, 0.005, 0.12), thud(300, 0.05, r, 0.3)), fr(996), 0.7)
    # the cord yank, hatch drops, ladder slides down and lands; scramble
    P(noise_burst(0.1, 800, 3000, r, 0.002, 0.04), fr(1034), 0.4); P(S(thud(120, 0.3, r, 0.9), creak(0.3, r, 90, 60)), fr(1042), 0.7)
    P(rattle(0.35, r, 40.0), fr(1042), 0.5); P(thud(140, 0.2, r, 0.8), fr(1052), 0.6)
    for k in range(6): P(thud(200, 0.08, r, 0.4), fr(1052) + k * 0.15, 0.4)
    # Ewbank's: door, steps, the PLONK
    P(thud(100, 0.3, r, 0.6), fr(1070), 0.5)
    for k in range(7): P(thud(150, 0.12, r, 0.5) * 0.5, fr(1076) + k * 0.4, 0.4)
    P(S(thud(110, 0.3, r, 1.0), noise_burst(0.12, 800, 4000, r, 0.002, 0.04)), fr(1150), 0.8)
    P(chime([m2f(93), m2f(98)], r, 0.05), fr(1162), 0.4)
    # table: the heap slides, the binder lands and opens, the gleam
    P(noise_burst(0.6, 1500, 8000, r, 0.05, 0.25), fr(1306), 0.4); P(thud(160, 0.15, r, 0.6), fr(1414), 0.7); W(fr(1432), 0.25, 0.4)
    P(chime([m2f(88), m2f(93), m2f(98), m2f(103)], r, 0.06), fr(1500), 0.45)
    # yard gags: splash; storing: sleeve slide, cover shut; the swat
    P(S(noise_burst(0.3, 400, 3000, r, 0.005, 0.1)), fr(1632), 0.5)
    P(noise_burst(0.2, 3000, 9000, r, 0.01, 0.06), fr(1686), 0.35); P(thud(200, 0.1, r, 0.5), fr(1706), 0.5)
    # the auction: murmur, GAVEL, the room erupts
    P(widen(crowd(fr(2005) - fr(1808), r), r), fr(1808), 0.5)
    P(S(thud(140, 0.3, r, 1.0), clink(r, 900, 0.2)), fr(1921), 1.0)
    P(widen(crowd(3.0, r, True), r), fr(2037), 0.9)
    # the end: the hatch drops open, a warm shimmer
    P(S(thud(120, 0.3, r, 0.9), creak(0.3, r, 90, 60)), fr(2150), 0.6)
    P(chime([m2f(84), m2f(88), m2f(91), m2f(96)], r, 0.08), fr(2152), 0.5)
    return out

# ================================================================ meme sounds (the user's folder) on their beats
MEME_CUES = [  # (frame, file, trim seconds or None, gain)
    (125, "Instagram Thud.mp3", None, 0.9),
    (438, "Hehe Boiiiiiii.mp3", None, 0.8),
    (500, "Kaching Sound FX.mp3", None, 0.7), (514, "Kaching Sound FX.mp3", None, 0.7), (530, "Kaching Sound FX.mp3", None, 0.8),
    (612, "BRUH.mp3", None, 1.0),
    (676, "Game Death Sound.mp3", None, 0.8),
    (716, "Mobile Payment.mp3", None, 0.8),
    (848, "Crow Sound Caw.mp3", None, 0.9),
    (1012, "Realization Sound.mp3", 2.0, 0.8),
    # (1050, "Gogogogogo.mp3", 1.2, 0.7),  # removed: Frame.io v1 note at 35.7 s ("irrelevant")
    (1066, "Cinemaitc Suspense Riser.mp3", None, 0.0),  # placeholder (trimmed tail placed below)
    (1186, "Instagram Thud.mp3", None, 0.8), (1191, "Wowwwwwwwwwwwwwwwww.mp3", None, 0.9),
    (1293, "Huh5544.mp3", None, 1.0),
    (1603, "Bone Crack.mp3", None, 0.9),
    (1631, "Quack.mp3.mp3", None, 0.9),
    (1697, "Romantic.mp3", 1.3, 0.7),
    (1772, "Slap31.mp3", None, 1.0),
    (1921, "Kaching Sound FX.mp3", None, 0.8),
    (2040, "Kids Cheering.mp3", 3.0, 0.4),
    (2099, "EAGLE RAHHH.mp3", None, 0.8),
    (2304, "Hehe Boiiiiiii.mp3", None, 0.6),
]

def memes():
    out = np.zeros((2, N))
    for f0, name, secs, g in MEME_CUES:
        if g <= 0: continue
        place(out, pan(meme(name, secs, 0.08 if secs else 0.03), 0.0), fr(f0), g)
    # the suspense riser: its last 4 s land on the jaw drop
    rz = meme("Cinemaitc Suspense Riser.mp3")
    tail = fades(rz[-ns(4.0):], 0.4, 0.02)
    place(out, pan(tail, 0.0), fr(1186) - 4.0, 0.55)
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
