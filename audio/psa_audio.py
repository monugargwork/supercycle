# Sound for the PSA truck-theft reel: an original synthesized score (sneaky pizzicato heist in D minor -> calm
# explanation -> warm F major ending) and SFX on the picture's event frames (mirrors src/videos/psa/story.ts), mixed
# under the untouched voice: music ducked under speech, SFX bed, final loudness -14 LUFS, true peak < -1 dBTP.
# Output: public/psa/mix.wav (48 kHz stereo, exact length) + stems.
import sys
import numpy as np
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, fades, place, pan, widen, make_ir, convolve_st, integrated,
                 true_peak, dbg, read_wav, write_wav, modal, phase, st)
from instruments import m2f, pluck, vibes, glock, musicbox, snare, brush, cymbal, timpani, pad, triangle, brass
from sfx_gen import whoosh, clink, rattle, wood_crack

FPS = 30
TOTAL = 1884
DUR = TOTAL / FPS
fr = lambda f: f / FPS
R = rng(7)
N = ns(DUR)


# ================================================================ score
BPM = 120.0
B = 60.0 / BPM          # 0.5 s beat
PIVOT = fr(860)         # flash: "Nhưng ..."
END_A = fr(1615)        # warm ending

def score():
    mus = np.zeros((2, N))
    r = rng(11)
    # ---- A: heist (0 .. pivot): walking pizz bass, brushes, vibes stabs, sneaky glock motif ----
    bass = [38, 45, 41, 45, 43, 45, 46, 45, 38, 45, 41, 45, 43, 41, 40, 37]          # D minor walk with C# lead-back
    nb = int(PIVOT / B)
    for i in range(nb):
        t = i * B
        if t > PIVOT - 0.3:
            break
        place(mus, pan(pluck(m2f(bass[i % 16] - 12 + 12), 0.85, r, 0.9, 0.35), -0.15), t, 0.9)
        if i % 2 == 1:
            place(mus, pan(brush(0.55, r), 0.3), t, 0.7)
        place(mus, pan(brush(0.25, r, 0.2), 0.35), t + B / 2, 0.5)
        if i % 4 == 2 and t > 3.4:
            for m in [62, 65, 69]:   # Dm stab off the beat
                place(mus, pan(vibes(m2f(m), 0.45, r, 1.0, damp=0.35), 0.25), t + B / 2, 0.55)
    # sneaky motif while the thief works (9 .. 15 s) and again for the police (23 .. 27.5 s)
    motif = [(0, 74), (0.5, 77), (1.0, 76), (1.25, 74), (1.5, 73), (2.0, 74)]
    for t0 in [9.0, 11.0, 13.0, 23.0, 25.0]:
        for dt, m in motif:
            place(mus, pan(glock(m2f(m), 0.5, r, 1.2), 0.1), t0 + dt, 0.45)
    # build into the FBI arrival: snare roll 25.3 -> 26.2, timpani + cymbal on the stop
    for k in range(int(0.9 * 24)):
        place(mus, pan(snare(0.2 + 0.5 * k / 21, r, 0.2, snappy=0.8, buzz=True), 0.1), 25.3 + k / 24, 0.5)
    place(mus, pan(timpani(m2f(38), 0.9, r, 2.0), 0), fr(787), 0.9)
    place(mus, widen(cymbal(0.6, r, 2.2), r), fr(787), 0.45)
    # swell into the flash
    sw = np.zeros(ns(1.2)); tsw = tt(1.2)
    sw += colored(len(sw), r, 0.5) * (tsw / 1.2) ** 3
    place(mus, widen(bp(sw, 2000, 12000), r), PIVOT - 1.2, 0.35)
    # ---- B: explanation (pivot .. 53.9): pad + music-box arpeggio, slower bass ----
    chords = [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 61]]   # Dm Bb C A
    t = PIVOT + 0.25
    ci = 0
    while t < END_A - 0.3:
        ch = chords[ci % 4]
        dur = min(4 * B * 2, END_A - t)
        place(mus, pad([m2f(m) for m in ch[1:]], dur, 0.32, r, att=0.4, rel=0.6, warm=700), t, 0.8)
        place(mus, pan(pluck(m2f(ch[0] - 12), 0.7, r, 1.6, 0.25), -0.1), t, 0.7)
        place(mus, pan(pluck(m2f(ch[0] - 12), 0.55, r, 1.2, 0.25), -0.1), t + 4 * B, 0.6)
        for k in range(16):
            if t + k * B / 2 > END_A - 0.3:
                break
            m = ch[1:][k % 3] + 12 + (12 if k % 8 >= 4 else 0)
            place(mus, pan(musicbox(m2f(m), 0.35, r, 1.0), 0.3 * np.sin(k)), t + k * B / 2, 0.42)
        if ci % 2 == 1:
            for k in range(8):
                place(mus, pan(brush(0.3, r, 0.25), 0.3), t + k * B + B / 2, 0.4)
        t += 8 * B
        ci += 1
    # comic sad tuba when the grade label vanishes ("cũng biến mất theo")
    for i, m in enumerate([43, 42, 41, 40]):
        place(mus, pan(brass(m2f(m), 0.42 if i < 3 else 0.9, 0.7, r, kind="tuba", fall=-30 if i == 3 else 0), -0.1), 48.55 + i * 0.36, 0.6)
    # ---- C: warm ending (53.9 .. end), F major ----
    endc = [[41, 57, 60, 64, 69], [46, 58, 62, 65, 69], [48, 55, 60, 64, 67], [41, 57, 60, 65, 69]]   # Fmaj7 Bb/F C F
    t = END_A
    for i, ch in enumerate(endc):
        dur = 2.2 if i < 3 else DUR - t
        place(mus, pad([m2f(m) for m in ch[1:]], dur, 0.38, r, att=0.5, rel=1.2 if i == 3 else 0.6, warm=1100), t, 0.85)
        place(mus, pan(pluck(m2f(ch[0] - 12), 0.75, r, 2.0, 0.3), -0.1), t, 0.75)
        t += dur
    mel = [(0.0, 72), (0.5, 76), (1.0, 79), (2.2, 77), (2.7, 74), (3.2, 72), (4.4, 76), (4.9, 79), (5.4, 81), (6.6, 84)]
    for dt, m in mel:
        place(mus, pan(glock(m2f(m), 0.45, r, 1.8), 0.15), END_A + 0.3 + dt, 0.5)
    place(mus, pan(triangle(0.5, r, 2.0), 0.3), DUR - 1.0, 0.5)
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
    # street ambience (0 .. 13.8, 23 .. 28.7, 41.5 .. 43.4): distant traffic + birds
    for a, b in [(0, 13.8), (23.0, 28.7), (28.7, 32.6), (41.4, 43.4)]:
        amb = lp(colored(ns(b - a), r, 1.0), 600) * 0.12
        P(widen(fades(amb, 0.3, 0.3), r), a)
        for k in range(int((b - a) * 0.8)):
            tb = a + r.uniform(0, b - a - 0.3); f = r.uniform(2800, 4200); tch = tt(0.12)
            P(fades(np.sin(phase(f * (1 + 0.3 * np.sin(TAU * 18 * tch)))) * 0.05, 0.005, 0.03), tb, 1, r.uniform(-0.7, 0.7))
    # calendar page pop + tear away
    W(fr(6), 0.3, 0.5)                                       # date title glides in
    # truck: engine in, brake hiss, idle, cab door, footsteps, whistle
    P(fades(engine(fr(151) - fr(103) + 0.4, r), 0.3, 0.2), fr(103) - 0.3, 0.7)
    P(fades(engine(fr(232) - fr(151), r, 26, 24) * 0.5, 0.05, 0.3), fr(151), 0.5)
    P(noise_burst(0.7, 3000, 10000, r, 0.01, 0.25), fr(149), 0.45, -0.2)
    P(thud(60, 0.4, r), fr(151), 0.6)
    W(fr(185), 0.3, 0.7)
    P(thud(90, 0.3, r, 0.8), fr(232), 0.7, 0.2)
    for k in range(4):
        P(thud(140, 0.12, r, 0.6) * 0.5, fr(236) + k * 0.5, 0.5, 0.25)
    for dt, m in [(0, 79), (0.22, 83), (0.44, 86), (0.75, 84)]:
        t = tt(0.2); P(fades(np.sin(TAU * m2f(m) * t) * 0.3, 0.02, 0.05), fr(238) + dt, 0.6, 0.3)
    # thief: tiptoes, lock snap, lock clatter, roll-up door, pallet jack, sparkles
    for k in range(5):
        P(pluck(m2f(62 + (k % 2) * 3), 0.5, r, 0.3, 0.8), fr(271) + k * 0.13, 0.35)
    W(fr(290), 0.35, 0.3)                                   # hammer swing
    P(S(clink(r, 2600, 0.25), clink(r, 3900, 0.2), clink(r, 5200, 0.18)), fr(292), 1.0); P(thud(180, 0.2, r, 1.0), fr(292), 0.7)   # metal smash
    for k, f0 in enumerate([308, 312, 317]):               # lock + shackle hit the road and bounce
        P(clink(r, 1700 + 500 * k, 0.15), fr(f0), 0.55 - 0.12 * k, -0.2)
    P(rattle(0.65, r, 40.0), fr(333), 0.55); W(fr(340), 0.2, 0.5)
    rl = lp(rattle(1.3, r, 25.0, heavy=True), 2500)
    P(rl, fr(345), 0.45)
    rl2 = lp(rattle(1.0, r, 22.0, heavy=True), 2200)     # dragged away
    P(rl2, fr(390), 0.35, -0.3)
    # mailbox: creak + clank, fly buzz, deflated "womp"
    W(fr(415), 0.3, 0.6)
    P(S(thud(220, 0.18, r, 0.5), clink(r, 1400, 0.15)), fr(456), 0.6, 0.3)
    P(buzz_fly(0.9, r), fr(458), 0.35, 0.3)
    # office: paper unroll swish, count-up ticks, ding + burst; 3.000 count; sparkle cascade
    W(fr(478), 0.3, 0.6)
    unroll = bp(colored(ns(2.0), r, 0.2), 1500, 7000) * np.sin(np.pi * np.linspace(0, 1, ns(2.0))) ** 1.5 * 0.35
    P(widen(unroll, r), fr(485), 0.6)
    for f0, n in [(548, 16), (635, 14)]:
        for k in range(n):
            P(beep(1800 + 40 * k, 0.025, "sine", 0.5), fr(f0 + k), 0.5, 0.2)
        P(chime([m2f(84), m2f(88)], r), fr(f0 + n), 0.55); P(widen(whoosh(0.4, r, peak=0.05, f_lo=800, f_hi=4000), r), fr(f0), 0.35)
    for k in range(6):
        P(glock(m2f(84 + [0, 4, 7, 12, 16, 19][k]), 0.45, r, 0.9), fr(671) + k * 0.06, 0.4, -0.4 + 0.16 * k)
    # police + money + SUV
    W(fr(698), 0.3, 0.6)
    P(widen(siren(fr(772) - fr(696) + 0.6, r), r), fr(696), 0.28)
    P(chime([m2f(91), m2f(96)], r, 0.05), fr(748), 0.5); P(noise_burst(0.3, 3000, 9000, r, 0.002, 0.1), fr(748), 0.35)
    P(screech(0.55, r), fr(771), 0.45, 0.35); P(thud(55, 0.5, r, 0.9), fr(787), 0.9, 0.3)
    for k, dt in enumerate([0.3, 0.55]):
        P(thud(110, 0.25, r, 0.9), fr(796) + dt + 0.2 * k, 0.55, 0.3 - 0.2 * k)
    for k in range(4):
        P(thud(150, 0.1, r, 0.7) * 0.6, fr(800) + k * 0.45, 0.45, 0.2)
    # flash: impact boom + reverse air
    P(widen(cymbal(0.5, r, 1.6), r), fr(860), 0.25); P(thud(45, 0.9, r, 0.3), fr(860), 0.7)
    # slab hero shimmer + cert glow chime
    sh = S(*[np.pad(glock(m2f(m), 0.35, r, 1.2), (ns(0.05 * i), 0)) for i, m in enumerate([84, 88, 91, 96, 100])])
    P(widen(sh, r), fr(984), 0.45); P(chime([m2f(96), m2f(100), m2f(103)], r, 0.06), fr(1021), 0.5)
    # server room: hum + blips, button, voided rows, envelopes out
    hum = lp(colored(ns(fr(1245) - fr(1048)), r, 1.2), 250) * 0.15 + 0.03 * np.sin(TAU * 60 * tt(fr(1245) - fr(1048)))
    P(widen(fades(hum, 0.2, 0.2), r), fr(1048), 0.7)
    for k in range(14):
        P(beep(r.choice([1200, 1500, 1800, 2400]), 0.05, "sine", 0.3), fr(1050) + r.uniform(0, 6.4), 0.35, r.uniform(-0.6, 0.6))
    W(fr(1118), 0.3, 0.7)
    P(S(thud(70, 0.5, r, 1.0), clink(r, 1100, 0.1)), fr(1168), 0.9)
    for row in range(9):
        P(beep(520 - 30 * row, 0.12, "square", 0.35), fr(1176 + row * 6), 0.4, 0.1)
    for e in range(3):
        W(fr(1234 + 3 * e), 0.35, 0.5)
    # envelopes land on the market and the auction house
    for hit in [1259, 1280]:
        P(S(thud(160, 0.15, r, 0.5), 0.6 * glock(m2f(91), 0.5, r, 0.6)), fr(hit), 0.6, -0.3 if hit == 1259 else 0.3)
        P(beep(880, 0.08, "square", 0.25), fr(hit + 3), 0.4); P(beep(880, 0.08, "square", 0.25), fr(hit + 7), 0.4)
    # shop: scanner beep, alarm
    tl = tt(fr(1343) - fr(1326)); P(fades(np.sin(TAU * (1400 + 500 * np.sin(TAU * 6 * tl)) * tl) * 0.18, 0.02, 0.03), fr(1326), 0.45, 0.2)   # laser sweep
    P(beep(1850, 0.12, "sine", 0.6), fr(1343), 0.55, 0.2)
    for k in range(3): P(beep(320, 0.1, "square", 0.4), fr(1347) + k * 0.13, 0.4, 0.2)   # rejected
    al = np.concatenate([beep(880 if k % 2 == 0 else 660, 0.2, "square", 0.5) for k in range(8)])
    P(widen(al, r), fr(1359), 0.4); P(thud(60, 0.5, r, 0.8), fr(1359), 0.7)
    # alley: hammer smash, glass, label slide-up + poof
    W(fr(1380), 0.3, 0.6); W(fr(1394), 0.25, 0.3)
    P(S(wood_crack(r)[:ns(0.6)] * 0.5, thud(90, 0.4, r, 1.0)), fr(1398), 0.8)
    for k in range(10):
        P(clink(r, r.uniform(3500, 7000), 0.12, 1.2), fr(1398) + r.uniform(0, 0.35), 0.45, r.uniform(-0.5, 0.5))
    P(slide_up(fr(1459) - fr(1413), 450, 1700), fr(1413), 0.35)
    P(noise_burst(0.4, 600, 4000, r, 0.01, 0.12), fr(1455), 0.45)
    # alley deal: cash rustle
    P(rustle(0.6, r), fr(1496), 0.45)
    # phone check: UI chime
    P(chime([m2f(84), m2f(91)], r, 0.09), fr(1588), 0.55)
    # ending: dossier flap, badges, trail
    P(noise_burst(0.2, 800, 5000, r, 0.002, 0.05), fr(1732), 0.5); P(glock(m2f(84), 0.5, r, 1.0), fr(1732), 0.4)
    for f0, m in zip([1785, 1843, 1861], [84, 88, 91]):
        P(chime([m2f(m), m2f(m + 12)], r, 0.05), fr(f0), 0.5)
    # glide whooshes (centre of each camera glide) and cut swooshes
    for f0 in [65, 467, 551, 673, 750, 935, 1118, 1237, 1273, 1365, 1416, 1506, 1582, 1717, 1790]:
        W(fr(f0), 0.16, 0.6)
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
