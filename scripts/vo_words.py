"""Approved voiceover -> word timings that match the approved script, plus the timed line table.

  python3 scripts/vo_words.py videos/<slug>/voice.mp3 videos/<slug>/script.md videos/<slug>/

Writes <outdir>/voice.wav (48 kHz mono), <outdir>/words.json ([{"w","s","e"}] in seconds, the script's spelling)
and prints one line per sentence: start-end s, frames at 30 fps, pause after, every word with its onset frame.
Needs: pip install faster-whisper --break-system-packages ; ffmpeg.
Whisper gets float32 PCM (decoding the mp3 directly has failed before); words it missed are interpolated.
"""
import json, os, re, subprocess, sys, difflib, unicodedata
import numpy as np

voice, script_md, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(outdir, exist_ok=True)
wav = os.path.join(outdir, "voice.wav")
if os.path.abspath(voice) != os.path.abspath(wav):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", voice, "-ac", "1", "-ar", "48000", wav], check=True)
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", voice, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                     check=True, capture_output=True).stdout
audio = np.frombuffer(pcm, np.float32)

from faster_whisper import WhisperModel
segs, _ = WhisperModel("large-v3", compute_type="int8").transcribe(audio, language="vi", word_timestamps=True)
raw = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]

para = max(open(script_md, encoding="utf-8").read().split("\n"), key=len).strip()  # the paragraph = the longest line
norm = lambda w: re.sub(r"[^\w]", "", unicodedata.normalize("NFC", w).lower())
S = para.split()
R = [r for r in raw if norm(r["w"])]
sm = difflib.SequenceMatcher(None, [norm(w) for w in S], [norm(r["w"]) for r in R], autojunk=False)
out = [None] * len(S)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): out[i1 + k] = {"w": S[i1 + k], "s": R[j1 + k]["s"], "e": R[j1 + k]["e"]}
    elif tag in ("replace", "delete"):
        if j2 > j1: t0, t1 = R[j1]["s"], R[j2 - 1]["e"]
        else:
            t0 = R[j1 - 1]["e"] if j1 > 0 else 0
            t1 = R[j1]["s"] if j1 < len(R) else t0 + 0.2
        n = i2 - i1
        for k in range(n): out[i1 + k] = {"w": S[i1 + k], "s": round(t0 + (t1 - t0) * k / n, 3), "e": round(t0 + (t1 - t0) * (k + 1) / n, 3)}
        print("check:", tag, S[i1:i2], "heard", [r["w"] for r in R[j1:j2]])
    else:
        print("check: extra in audio", [r["w"] for r in R[j1:j2]], "at", R[j1]["s"])
assert all(out)
json.dump(out, open(os.path.join(outdir, "words.json"), "w"), ensure_ascii=False)
print(len(out), "words, VO ends at", out[-1]["e"], "s =", round(out[-1]["e"] * 30), "f")

sent, cur = [], []
for w in out:
    cur.append(w)
    if re.search(r'[.?!]["”]?$', w["w"]): sent.append(cur); cur = []
if cur: sent.append(cur)
for i, s in enumerate(sent):
    nxt = sent[i + 1][0]["s"] if i + 1 < len(sent) else None
    pause = round(nxt - s[-1]["e"], 2) if nxt else 0
    print(f'{i + 1:2d} {s[0]["s"]:6.2f}-{s[-1]["e"]:6.2f} f{round(s[0]["s"] * 30):4d}-{round(s[-1]["e"] * 30):4d} p{pause:4.2f} | '
          + " ".join(f'{w["w"]}[{round(w["s"] * 30)}]' for w in s))
