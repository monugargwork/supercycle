# Sound for the Pokémon GPS-tracker reel: an original synthesized score (sneaky pizzicato caper in D minor -> calm
# explanation pad from "Hóa ra" -> court tension, gavel, a wry tuba for the ankle monitor -> playful button) and SFX on
# the picture's event frames (mirrors src/videos/gps/story.ts), mixed under the untouched voice: music ducked under
# speech, SFX bed, -14 LUFS, true peak < -1 dBTP. Output: public/gps/mix.wav (48 kHz stereo, exact length) + stems.
import sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, modal, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack

FPS = 30
TOTAL = 2209
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)

# ================================================================ score
BPM = 120.0
B = 60.0 / BPM
PIVOT = fr(1389)        # "Hóa ra": the explanation
COURT = fr(1745)        # court
GAVEL = fr(1786)
ANKLE = fr(2050)

def score():
    mus = np.zeros((2, N))
    r = rng(11)
    # ---- A: caper (0 .. pivot): walking pizz bass, brushes, vibes stabs, sneaky glock motif ----
    bass = [38, 45, 41, 45, 43, 45, 46, 45, 38, 45, 41, 45, 43, 41, 40, 37]
    for i in range(int(PIVOT / B)):
        t = i * B
        if t > PIVOT - 0.3: break
        quiet = 29.5 < t < 31.0      # a breath before 18 June
        g = 0.45 if quiet else 0.9
        place(mus, pan(pluck(m2f(bass[i % 16]), 0.85, r, 0.9, 0.35), -0.15), t, g)
        if i % 2 == 1: place(mus, pan(brush(0.55, r), 0.3), t, 0.7 * g)
        place(mus, pan(brush(0.25, r, 0.2), 0.35), t + B / 2, 0.5 * g)
        if i % 4 == 2 and t > 2.5:
            for m in [62, 65, 69]: place(mus, pan(vibes(m2f(m), 0.45, r, 1.0, damp=0.35), 0.25), t + B / 2, 0.5 * g)
    motif = [(0, 74), (0.5, 77), (1.0, 76), (1.25, 74), (1.5, 73), (2.0, 74)]
    for t0 in [1.6, 20.0, 22.0, 24.3, 34.0]:
        for dt, m in motif: place(mus, pan(glock(m2f(m), 0.5, r, 1.2), 0.1), t0 + dt, 0.45)
    # sting on the discovery ("phát hiện") and the slap
    place(mus, pan(timpani(m2f(38), 0.7, r, 1.6), 0), fr(1053), 0.7)
    place(mus, widen(cymbal(0.4, r, 1.6), r), fr(1162), 0.3)
    # ---- B: explanation (pivot .. court): pad + music-box arpeggio ----
    chords = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 61]]
    t, ci = PIVOT + 0.15, 0
    while t < COURT - 0.6:
        ch = chords[ci % 4]; dur = min(4 * B * 2, COURT - t)
        place(mus, pad([m2f(m) for m in ch[1:]], dur, 0.3, r, att=0.4, rel=0.6, warm=700), t, 0.8)
        place(mus, pan(pluck(m2f(ch[0] - 12), 0.7, r, 1.6, 0.25), -0.1), t, 0.7)
        for k in range(16):
            if t + k * B / 2 > COURT - 0.6: break
            m = ch[1:][k % 3] + 12 + (12 if k % 8 >= 4 else 0)
            place(mus, pan(musicbox(m2f(m), 0.35, r, 1.0), 0.3 * np.sin(k)), t + k * B / 2, 0.4)
        t += 8 * B; ci += 1
    # ---- C: court: low drone, snare roll into the gavel, timpani + cymbal on it ----
    place(mus, pad([m2f(m) for m in [38, 45, 50]], ANKLE - COURT - 0.2, 0.32, r, att=0.6, rel=0.5, warm=500), COURT, 0.7)
    for k in range(int(1.0 * 24)): place(mus, pan(snare(0.2 + 0.5 * k / 24, r, 0.2, snappy=0.8, buzz=True), 0.1), GAVEL - 1.0 + k / 24, 0.45)
    place(mus, pan(timpani(m2f(38), 0.9, r, 2.0), 0), GAVEL, 0.9); place(mus, widen(cymbal(0.6, r, 2.2), r), GAVEL, 0.35)
    # the wry tuba: down three steps onto the ankle clack
    for i, m in enumerate([43, 42, 41, 38]):
        place(mus, pan(brass(m2f(m), 0.42 if i < 3 else 0.9, 0.7, r, kind="tuba", fall=-30 if i == 3 else 0), -0.1), ANKLE - 1.1 + i * 0.36, 0.6)
    # ---- D: tag (after the ankle): the sneaky motif one last time, slower, ending on a button ----
    for dt, m in motif: place(mus, pan(glock(m2f(m), 0.55, r, 1.4), 0.1), ANKLE + 1.6 + dt * 1.3, 0.45)
    for i in range(int((DUR - ANKLE - 1.2) / B)):
        place(mus, pan(pluck(m2f(bass[i % 16]), 0.85, r, 0.9, 0.35), -0.15), ANKLE + 1.2 + i * B, 0.6)
    place(mus, pan(pluck(m2f(38), 0.9, r, 1.2, 0.3), -0.1), DUR - 0.9, 0.9); place(mus, pan(glock(m2f(86), 0.5, r, 1.2), 0.2), DUR - 0.9, 0.5)
    ir = make_ir(1.6, 3, hf=0.6)
    wet = convolve_st(mus, ir)[:, :N]
    return mus * 0.85 + wet * 0.3


# ================================================================ sfx
def S(*xs):
    """sum of mono sounds of different lengths"""
    n = max(len(x) for x in xs); out = np.zeros(n)
    for x in xs: out[: len(x)] += x
    return out

def thud(f0=70, dur=0.35, r=R, click=0.4):
    t = tt(dur)
    y = np.sin(TAU * f0 * t * (1 + 0.6 * np.exp(-t / 0.03))) * np.exp(-t / 0.09)
    y += lp(r.standard_normal(len(t)), 1200) * np.exp(-t / 0.02) * click
    return fades(y, 0.0005, 0.03)

def beep(f, dur=0.09, wave="sine", vol=1.0):
    t = tt(dur)
    s = np.sin(TAU * f * t) if wave == "sine" else np.sign(np.sin(TAU * f * t)) * 0.5
    return fades(s * vol, 0.003, 0.02)

def chime(fs, r=R, gap=0.07):
    out = np.zeros(ns(1.6 + gap * len(fs)))
    for i, f in enumerate(fs):
        g = glock(f, 0.6, r, 1.5)
        out[ns(i * gap): ns(i * gap) + len(g)] += g
    return out

def noise_burst(dur, lo, hi, r=R, att=0.005, dec=0.08):
    t = tt(dur)
    return fades(bp(r.standard_normal(len(t)), lo, hi) * (1 - np.exp(-t / att)) * np.exp(-t / dec), 0.001, 0.02)

def engine(dur, r=R, f0=38.0, f1=26.0):
    t = tt(dur)
    f = f0 + (f1 - f0) * t / dur
    ph = phase(f)
    y = np.sign(np.sin(ph)) * 0.3 + np.sin(2 * ph) * 0.4 + lp(r.standard_normal(len(t)), 300) * 0.5
    return lp(y, 500) * (0.8 + 0.2 * np.sin(TAU * 7 * t))

def siren(dur, r=R):
    t = tt(dur)
    f = 700 + 350 * (0.5 + 0.5 * np.sin(TAU * 0.9 * t))
    y = np.sin(phase(f)) + 0.3 * np.sin(2 * phase(f))
    return fades(lp(y, 3000) * 0.6, 0.15, 0.4)

def screech(dur, r=R):
    t = tt(dur)
    f = 2400 - 700 * t / dur
    y = np.sin(phase(f + 40 * r.standard_normal(len(t)).cumsum() / SR)) * 0.5 + bp(r.standard_normal(len(t)), 1500, 5000) * 0.6
    return fades(y * np.minimum(1, t / 0.05) * (1 - t / dur) ** 0.5, 0.01, 0.05)

def buzz_fly(dur, r=R):
    t = tt(dur)
    f = 210 + 25 * np.sin(TAU * 3 * t)
    y = np.sign(np.sin(phase(f))) * (0.6 + 0.4 * np.sin(TAU * 1.7 * t)) * 0.25
    return fades(bp(y, 300, 4000), 0.05, 0.1)

def slide_up(dur, f0=500, f1=1800):
    t = tt(dur)
    f = f0 * (f1 / f0) ** (t / dur)
    return fades(np.sin(phase(f)) * 0.5 * (1 + 0.15 * np.sin(TAU * 6 * t)), 0.02, 0.08)

def rustle(dur, r=R):
    t = tt(dur)
    flicks = np.zeros(len(t))
    for k in range(int(dur * 18)):
        i = int(r.uniform(0, len(t) - 2000)); flicks[i: i + 1500] += np.exp(-np.arange(1500) / 200) * r.uniform(0.3, 1)
    return bp(r.standard_normal(len(t)), 2000, 9000) * flicks * 0.6

def sfx():
    out = np.zeros((2, N))
    r = rng(23)
    P = lambda x, t, g=1.0, p=0.0: place(out, pan(x, p) if np.ndim(x) == 1 else x, t, g)
    W = lambda t, g=0.35, d=0.6: P(widen(whoosh(d, r, peak=d * 0.45), r), t - d * 0.45, g)
    # evening street + crickets (hook, crowd), day street (18 June, the route, the walk home)
    for a, b, crick in [(0, 14.7, True), (29.8, 37.8, False), (49.5, 54.3, False), (69.9, 72.3, False)]:
        amb = lp(colored(ns(b - a), r, 1.0), 600) * 0.12
        P(widen(fades(amb, 0.3, 0.3), r), a)
        for k in range(int((b - a) * (1.6 if crick else 0.8))):
            tb = a + r.uniform(0, b - a - 0.3)
            if crick: tch = tt(0.18); P(fades(np.sin(TAU * 4300 * tch) * (0.5 + 0.5 * np.sign(np.sin(TAU * 60 * tch))) * 0.03, 0.005, 0.03), tb, 1, r.uniform(-0.7, 0.7))
            else: f = r.uniform(2800, 4200); tch = tt(0.12); P(fades(np.sin(phase(f * (1 + 0.3 * np.sin(TAU * 18 * tch)))) * 0.05, 0.005, 0.03), tb, 1, r.uniform(-0.7, 0.7))
    # hook: tiptoe, the magnet CLACK, LED blips once a second
    for k in range(3): P(pluck(m2f(62 + (k % 2) * 3), 0.5, r, 0.3, 0.8), fr(8) + k * 0.4, 0.3)
    W(fr(58), 0.25, 0.2)
    P(S(clink(r, 2100, 0.2), thud(160, 0.15, r, 1.0)), fr(63), 0.9, -0.1)
    for f0 in range(69, 178, 30): P(beep(2400, 0.03, "sine", 0.25), fr(f0), 0.3, -0.1)
    W(fr(120), 0.3, 0.8)
    # the fever board ticking up, the crowd murmur, the chair squeaks, the box POP
    for k in range(9): P(beep(1500 + 60 * k, 0.025, "square", 0.25), fr(196 + 9 * k), 0.35, -0.3)
    mur = bp(colored(ns(5.0), r, 0.5), 250, 1800) * 0.25 * (1 + 0.3 * np.sin(TAU * 0.7 * tt(5.0)))
    P(widen(fades(mur, 0.4, 0.4), r), fr(300), 0.6)
    for k in range(6): P(noise_burst(0.12, 1200, 4000, r, 0.005, 0.05), fr(378) + k * 0.28, 0.4, 0.3)
    W(fr(436), 0.3, 0.6)
    P(S(thud(220, 0.12, r, 0.6), noise_burst(0.2, 2000, 7000, r, 0.002, 0.06)), fr(476), 0.6); P(slide_up(0.4, 600, 1800), fr(476), 0.3)
    # house, tea sip, phone unlock, dot blips; the aerial whoosh; pins ding; wall clock tick
    W(fr(495), 0.3, 0.7); P(noise_burst(0.4, 300, 1500, r, 0.05, 0.2), fr(584), 0.3)
    P(chime([m2f(84), m2f(88)], r, 0.06), fr(604), 0.4)
    for f0 in range(640, 895, 30): P(beep(2400, 0.03, "sine", 0.22), fr(f0), 0.3, 0.2)
    W(fr(728), 0.35, 0.9); W(fr(772), 0.3, 0.7)
    P(engine(1.4, r, 34, 30) * 0.4, fr(735), 0.35)
    for f0 in [818, 839]: P(chime([m2f(91)], r), fr(f0), 0.45)
    for k in range(10): P(thud(1800, 0.02, r, 0.2) * 0.4, fr(800) + k * 0.4, 0.25, -0.4)
    # 18 June: the truck in, brake, door, steps, pen tink, discovery blip, yank POP
    W(fr(895), 0.3, 0.7)
    P(fades(engine(fr(972) - fr(925) + 0.4, r), 0.3, 0.2), fr(925) - 0.3, 0.7)
    P(noise_burst(0.7, 3000, 10000, r, 0.01, 0.25), fr(970), 0.45, -0.2); P(thud(60, 0.4, r), fr(972), 0.6)
    P(thud(90, 0.3, r, 0.8), fr(988), 0.6, 0.2)
    for k in range(6): P(thud(140, 0.12, r, 0.6) * 0.5, fr(992) + k * 0.5, 0.45, 0.25)
    P(S(clink(r, 3400, 0.12), clink(r, 4200, 0.1)), fr(1040), 0.4); P(clink(r, 3000, 0.1), fr(1046), 0.25)
    for f0 in range(1053, 1100, 30): P(beep(2400, 0.035, "sine", 0.4), fr(f0), 0.45)
    P(S(thud(260, 0.12, r, 0.9), clink(r, 1900, 0.15)), fr(1100), 0.8); P(slide_up(0.25, 700, 1600), fr(1100), 0.25)
    # police: door, the SLAP; interview room hum; "Khoan" record-scratch-ish whoosh
    W(fr(1135), 0.3, 0.6); P(S(thud(110, 0.25, r, 1.0), noise_burst(0.15, 1500, 6000, r, 0.002, 0.05)), fr(1162), 0.9)
    hum = lp(colored(ns(fr(1385) - fr(1195)), r, 1.2), 250) * 0.12 + 0.03 * np.sin(TAU * 60 * tt(fr(1385) - fr(1195)))
    P(widen(fades(hum, 0.2, 0.2), r), fr(1195), 0.6)
    W(fr(1278), 0.35, 0.4)
    # stockroom: drawer slide + lock click; route sheet: pen ticks, engine starts
    W(fr(1385), 0.3, 0.6); P(rattle(0.35, r, 30.0), fr(1452), 0.4); P(S(clink(r, 2600, 0.08), thud(900, 0.04, r, 0.3)), fr(1467), 0.7)
    P(noise_burst(0.15, 2000, 7000, r, 0.005, 0.05), fr(1547), 0.4); P(noise_burst(0.3, 2000, 7000, r, 0.01, 0.1), fr(1570), 0.4)
    P(fades(engine(1.2, r, 30, 42), 0.05, 0.4), fr(1600), 0.6)
    W(fr(1630), 0.3, 0.7)
    for f0 in range(1650, 1745, 30): P(beep(2400, 0.03, "sine", 0.22), fr(f0), 0.3)
    P(chime([m2f(91), m2f(96)], r, 0.05), fr(1712), 0.45)
    # court: murmur, the GAVEL, stamps, five bills, the ankle CLACK + first blip
    P(widen(fades(bp(colored(ns(1.4), r, 0.5), 250, 1800) * 0.2, 0.3, 0.4), r), fr(1745), 0.5)
    P(S(thud(140, 0.3, r, 1.0), clink(r, 900, 0.2)), fr(1786), 1.0)
    for f0 in [1862, 1927]: P(thud(120, 0.18, r, 0.9), fr(f0), 0.7)
    for f0 in [1887, 1894, 1902, 1910, 1918]: P(rustle(0.18, r), fr(f0) - 0.05, 0.45, 0.3)
    P(S(clink(r, 1800, 0.18), thud(200, 0.15, r, 1.0)), fr(2050), 0.9)
    for f0 in range(2053, 2209, 30): P(beep(2400, 0.035, "sine", 0.35), fr(f0), 0.4)
    W(fr(2112), 0.35, 1.4); W(fr(2168), 0.3, 0.8)
    return out


# ================================================================ mix
def main(voice_path, out_path):
    v, sr = read_wav(voice_path)
    assert sr == SR
    v = st(v)[:, :N]
    v = np.pad(v, ((0, 0), (0, N - v.shape[1])))
    mus, fx = score(), sfx()
    # speech envelope -> duck the music ~7 dB under the voice (40 ms attack, 300 ms release)
    hop = SR // 100
    m = v.mean(0); nb = len(m) // hop
    e = np.sqrt((m[: nb * hop].reshape(nb, hop) ** 2).mean(1))
    on = np.clip((20 * np.log10(e + 1e-6) + 40) / 10, 0, 1)
    g = np.zeros_like(on); a, rl = 1 - np.exp(-1 / 4.0), 1 - np.exp(-1 / 30.0)
    for i in range(1, len(on)):
        k = a if on[i] > g[i - 1] else rl
        g[i] = g[i - 1] + k * (on[i] - g[i - 1])
    duck = dbg(-7 * np.interp(np.arange(len(m)) / hop, np.arange(nb), g))
    # levels: voice untouched; music sits ~16 dB under speech before ducking; sfx ~10 dB under
    vl = integrated(v)
    mus = mus * dbg((vl - 15) - integrated(mus))
    fx = fx * dbg((vl - 9) - integrated(fx))
    mix = v + mus * duck[None, :] + fx
    mix = mix * dbg(-14 - integrated(mix))
    tp = true_peak(mix)
    if tp > -1.0:
        # soft limit peaks above -1 dBTP
        lim = dbg(-1.0)
        mix = np.tanh(mix / lim) * lim
    write_wav(out_path, mix, 16)
    write_wav(out_path.replace(".wav", "_music.wav"), mus, 16)
    write_wav(out_path.replace(".wav", "_sfx.wav"), fx, 16)
    print("mix", out_path, "LUFS", round(integrated(mix), 2), "TP", round(true_peak(mix), 2), "len", mix.shape[1] / SR)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
