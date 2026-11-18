import React from 'react';
import {Img, staticFile, getInputProps} from 'remotion';
import {add, clamp, E, lerp, M, ramp, spr, textW, tf, FONT, BOX_RED} from './lib';

/* ───────────── motion verbs (v3) ───────────── */
type Side = 'left' | 'right' | 'top' | 'bottom';
const sv = (s: Side) => ({x: s === 'left' ? -1 : s === 'right' ? 1 : 0, y: s === 'top' ? -1 : s === 'bottom' ? 1 : 0});

/** Smooth slide out (ease-in-out, no blur pop). */
export const slideOut = (t: number, t0: number, side: Side, o: {dist?: number; dur?: number; rot?: number} = {}): Partial<M> => {
  if (t <= t0) return {};
  const v = sv(side);
  const p = ramp(t, t0, o.dur ?? 0.78, E.inOutCubic);
  const d = o.dist ?? 1300;
  return {x: v.x * d * p, y: v.y * d * p, ry: -v.x * (o.rot ?? 16) * p, rx: v.y * (o.rot ?? 10) * p};
};
/** Gravity drop out of frame. */
export const dropOut = (t: number, t0: number, o: {dur?: number; spin?: number} = {}): Partial<M> => {
  if (t <= t0) return {};
  const p = ramp(t, t0, o.dur ?? 0.55, E.inCubic);
  return {y: 1500 * p, rz: (o.spin ?? 8) * p, rx: -14 * p};
};
/** Rise in from below (hand-held feel): spring up with a slight back tilt. */
export const riseUp = (t: number, t0: number, o: {dist?: number; f?: number; z?: number} = {}): Partial<M> => {
  if (t < t0) return {o: 0};
  const p = spr(t, t0, o.f ?? 1.3, o.z ?? 0.84);
  return {y: (o.dist ?? 1150) * (1 - p), rx: 22 * (1 - p), o: clamp((t - t0) / 0.06)};
};
/** Recede: push back into depth + dim. */
export const recede = (t: number, t0: number, dur = 0.5): Partial<M> & {dimv: number} => {
  const p = ramp(t, t0, dur, E.inOutCubic);
  return {s: lerp(1, 0.86, p), y: -20 * p, dimv: 0.55 * p};
};

/* ───────────── Title: auto-sized box, type / rise / swap ───────────── */
export type TCue = {t: number; lines: string[]; sub?: string; mode?: 'type' | 'rise'};
// legacy measure (used by Tag)
const PADX = 0.34, PADT = 0.17, PADB = 0.11, LH = 1.04;
const measure = (lines: string[], size: number) => {
  const w = Math.max(...lines.map((l) => textW(l, size) + l.length * size * 0.01));
  return {w: w + size * PADX * 2, h: lines.length * size * LH + size * (PADT + PADB)};
};
const typed = (s: string, n: number) => s.slice(0, Math.max(0, n));
const MAXW = 970;

/* Title styles 1–6 measured from the client mockup (all values in units of ink height G = 0.72·fontSize).
   1 tight + thin white stroke · 2 = 1 + matched-width subtitle · 3 black inset panel + dashed ring
   4 dashed ring · 5 solid ring · 6 = 2 without stroke */
let _st = 0;
export const titleStyle = () => {
  if (!_st) { try { _st = Number((getInputProps() as any).titleStyle) || 1; } catch { _st = 1; } }
  return _st;
};
const SPEC = {
  tight: {padT: 0.185, padB: 0.2, padX: 0.323, gap: 0.062, ls: 0.01},
  ring: {padT: 0.368, padB: 0.386, padX: 0.825, gap: 0.12, ls: 0.006, inset: 0.158, sw: 0.053, dash: 0.175, dgap: 0.158, panel: 0.22},
};
type Row = {text: string; S: number; y: number};
export const tLayout = (lines: string[], sub: string | undefined, S: number) => {
  const st = titleStyle();
  const G = 0.72 * S;
  const sp = st >= 3 && st <= 5 ? SPEC.ring : SPEC.tight;
  const adv = (txt: string, sz: number) => textW(txt, sz, 700) + txt.length * sz * sp.ls;
  const rows: Row[] = [];
  let y = sp.padT * G;
  let w = 0;
  lines.forEach((l, k) => { if (k) y += sp.gap * G; rows.push({text: l, S, y}); y += G; w = Math.max(w, adv(l, S)); });
  if (sub && (st === 2 || st === 6)) {
    const S2 = Math.min(S * (w / adv(sub, S)), 0.62 * S);
    y += sp.gap * G;
    rows.push({text: sub, S: S2, y});
    y += 0.72 * S2;
    w = Math.max(w, adv(sub, S2));
  }
  return {w: w + 2 * sp.padX * G, h: y + sp.padB * G, rows, G, st, sp};
};
const fitFor = (lines: string[], sub: string | undefined, size: number) => {
  const w = tLayout(lines, sub, size).w;
  return w > MAXW ? size * MAXW / w : size;
};

const TitleBox: React.FC<{W: number; H: number; G: number; o: number}> = ({W, H, G, o}) => {
  const st = titleStyle();
  const sp = SPEC.ring;
  const base: React.CSSProperties = {position: 'absolute', inset: 0, background: BOX_RED, opacity: o, boxShadow: '0 10px 28px rgba(0,0,0,.3)'};
  if (st === 1 || st === 2) return <div style={{...base, border: `${Math.max(2, 0.031 * G)}px solid white`, boxSizing: 'border-box'}} />;
  if (st === 6) return <div style={base} />;
  const sw = Math.max(2.5, sp.sw * G), ins = sp.inset * G + sw / 2, pin = sp.panel * G;
  return (
    <div style={base}>
      {st === 3 && <div style={{position: 'absolute', left: pin, top: pin, right: pin, bottom: pin, background: '#050505'}} />}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={ins} y={ins} width={Math.max(0, W - 2 * ins)} height={Math.max(0, H - 2 * ins)} fill="none" stroke="white" strokeWidth={sw}
          strokeDasharray={st === 5 ? undefined : `${sp.dash * G} ${sp.dgap * G}`} />
      </svg>
    </div>
  );
};

export const Title: React.FC<{
  t: number; cues: TCue[]; y: number; x?: number; size?: number; out?: {t: number; mode: 'collapse' | 'left' | 'right' | 'up'};
  m?: Partial<M>; small?: boolean;
}> = ({t, cues, y, x = 540, size: want = 92, out, m = {}}) => {
  if (!cues.length || t < cues[0].t) return null;
  let i = 0;
  for (let k = 0; k < cues.length; k++) if (t >= cues[k].t) i = k;
  const cur = cues[i];
  const size = fitFor(cur.lines, cur.sub, want);
  const cm = tLayout(cur.lines, cur.sub, size);
  let lay = cm;
  let W = cm.w, H = cm.h, sy = 1, sx = 1, boxO = 1, chars = 999, clipB = 0, textDY = 0;
  const u = t - cur.t;
  if (i === 0) {
    if ((cur.mode ?? 'type') === 'type') {
      const total = cm.rows.map((r) => r.text).join('').length;
      chars = Math.floor(u * 38);
      const pt = clamp(chars / total);
      boxO = 0.32 + 0.68 * E.outQuad(pt);
      sx = lerp(0.95, 1, ramp(t, cur.t, 0.25, E.outCubic));
    } else {
      const p = ramp(t, cur.t, 0.34, E.outCubic);
      clipB = 1 - p;
      textDY = (1 - ramp(t, cur.t + 0.04, 0.34, E.outCubic)) * H * 0.7;
    }
  } else {
    // swap: squash to a bar, morph width, reopen with the new text
    const prev = cues[i - 1];
    const pm = tLayout(prev.lines, prev.sub, fitFor(prev.lines, prev.sub, want));
    const pw = ramp(t, cur.t, 0.34, E.inOutCubic);
    W = lerp(pm.w, cm.w, pw); H = lerp(pm.h, cm.h, pw);
    if (u < 0.13) { sy = 1 - 0.86 * E.inCubic(u / 0.13); lay = pm; }
    else { sy = 0.14 + 0.86 * E.outBack(clamp((u - 0.13) / 0.26)); chars = Math.floor((u - 0.13) * 60); }
  }
  // exit
  let ex: Partial<M> = {};
  if (out && t > out.t) {
    const p = ramp(t, out.t, out.mode === 'collapse' ? 0.22 : 0.6, out.mode === 'collapse' ? E.inCubic : E.inOutCubic);
    if (out.mode === 'collapse') { sy *= 1 - p; boxO *= 1 - E.inQuad(p); }
    else if (out.mode === 'up') ex = {y: -700 * p};
    else ex = {x: (out.mode === 'left' ? -1 : 1) * 1300 * p};
    if (p >= 1) return null;
  }
  const b = add(m, ex);
  let left = chars;
  // rows are laid out for the layout's own box; keep them centred in the (possibly morphing) box
  const offY = (H - lay.h) / 2;
  return (
    <div style={{position: 'absolute', left: x - W / 2, top: y, width: W, height: H, transform: tf(b), opacity: b.o}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 50%',
        clipPath: clipB > 0 ? `inset(${clipB * 100}% 0 0 0)` : undefined}}>
        <TitleBox W={W} H={H} G={lay.G} o={boxO} />
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${textDY}px)`}}>
          {lay.rows.map((r, k) => {
            const s = typed(r.text, left); left -= r.text.length;
            return (
              <div key={k} style={{position: 'absolute', left: 0, right: 0, top: offY + r.y - 0.04 * r.S, height: r.S, display: 'flex', justifyContent: 'center'}}>
                <div style={{position: 'relative', fontFamily: FONT, fontWeight: 700, fontSize: r.S, lineHeight: `${r.S}px`, color: 'white', whiteSpace: 'pre',
                  letterSpacing: r.S * lay.sp.ls}}>
                  <span style={{visibility: 'hidden'}}>{r.text}</span>
                  <span style={{position: 'absolute', left: 0, top: 0}}>{s}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Small type-on tag that rides a card (top_10 style). Anchored at its left edge. */
export const Tag: React.FC<{t: number; tIn: number; text: string; x: number; y: number; m?: Partial<M>; size?: number; tOut?: number}> =
  ({t, tIn, text, x, y, m = {}, size = 40, tOut}) => {
    if (t < tIn) return null;
    const chars = Math.floor((t - tIn) * 40);
    const pt = clamp(chars / text.length);
    const {w, h} = measure([text], size);
    let sy = 1, o = 1;
    if (tOut !== undefined && t > tOut) { const p = ramp(t, tOut, 0.2, E.inCubic); sy = 1 - p; o = 1 - p; }
    const b = add(m);
    return (
      <div style={{position: 'absolute', left: x + (b.x ?? 0), top: y + (b.y ?? 0) - h / 2, width: w, height: h, opacity: (b.o ?? 1) * o,
        transform: `scale(${lerp(0.94, 1, ramp(t, tIn, 0.22, E.outCubic))}, ${sy})`, transformOrigin: '0% 50%'}}>
        <div style={{position: 'absolute', inset: 0, background: BOX_RED, border: '3px solid white', boxSizing: 'border-box', opacity: 0.35 + 0.65 * pt,
          boxShadow: '0 8px 20px rgba(0,0,0,.35)'}} />
        <div style={{position: 'absolute', left: size * PADX, top: size * PADT, fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: `${size * LH}px`,
          color: 'white', whiteSpace: 'pre', letterSpacing: size * 0.01, transform: `translateY(${size * 0.1}px)`}}>{text.slice(0, chars)}</div>
      </div>
    );
  };

/* ───────────── Logo intro (ProRes alpha → PNG frames), holds last frame ───────────── */
export const INTRO_AT = 6.84;
const INTRO_FRAMES = 302;
export const IntroLayer: React.FC<{t: number; end: number; at?: number}> = ({t, end, at = INTRO_AT}) => {
  if (t < at) return null;
  const f = Math.min(INTRO_FRAMES, Math.max(1, Math.floor((t - at) * 60) + 1));
  const o = 1 - ramp(t, end - 0.55, 0.4, E.inOutCubic);
  if (f === 1 || o <= 0) return null;
  return <Img src={staticFile(`intro/f_${String(f).padStart(4, '0')}.png`)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, opacity: o}} />;
};

/* ───────────── Stage: title + fixed gap + content as ONE centred group ───────────── */
export const L = {TOP: 262, BOT: 1700, MAXW: 970, GAP: 48, TMAX: 160};
const titleH = (c: TCue) => tLayout(c.lines, c.sub, fitFor(c.lines, c.sub, L.TMAX)).h;
/** Title height at time t, morphing smoothly across swaps exactly like the Title box does. */
export const titleHAt = (t: number, cues: TCue[]) => {
  if (!cues.length) return 0;
  let i = 0;
  for (let k = 0; k < cues.length; k++) if (t >= cues[k].t) i = k;
  const h = titleH(cues[i]);
  if (i === 0) return h;
  return lerp(titleH(cues[i - 1]), h, ramp(t, cues[i].t, 0.34, E.inOutCubic));
};
export type Box = [number, number, number, number];
export const lerpBox = (a: Box, b: Box, p: number): Box => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p), lerp(a[3], b[3], p)];

export const Stage: React.FC<{t: number; cues: TCue[]; box: Box; out?: {t: number; mode: 'collapse' | 'left' | 'right' | 'up'}; maxS?: number; release?: number; children: React.ReactNode}> =
  ({t, cues, box, out, maxS = 1.6, release, children}) => {
    const rel = release !== undefined ? 1 - ramp(t, release, 0.9, E.inOutCubic) : 1;
    const Ht = (cues.length ? titleHAt(t, cues) : 0) * rel;
    const gap = (cues.length ? L.GAP : 0) * rel;
    const bw = box[2] - box[0], bh = box[3] - box[1];
    const avail = L.BOT - L.TOP;
    const s = Math.min(L.MAXW / bw, (avail - Ht - gap) / bh, maxS);
    const G = Ht + gap + bh * s;
    const top = L.TOP + (avail - G) / 2;
    const ty = top + Ht + gap - box[1] * s;
    const tx = 540 - ((box[0] + box[2]) / 2) * s;
    return (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          perspective: 2300 / s, perspectiveOrigin: `${(540 - tx) / s}px ${(960 - ty) / s}px`}}>
          {children}
        </div>
        {cues.length > 0 && <Title t={t} cues={cues} y={top} size={L.TMAX} out={out} />}
      </>
    );
  };
