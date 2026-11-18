import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {add, BOX_RED, clamp, E, FONT, lerp, M, ramp, textW, tf, ViewCtx} from './lib';
import {Box, L} from './lib3';

/* ═══════════════ deterministic random ═══════════════ */
export const rnd = (i: number, k = 0) => {
  const x = Math.sin(i * 127.1 + k * 311.7 + 74.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ═══════════════ held-card 3D tilt: ONE slow diagonal rotation, no position change ═══════════════ */
/** Rotates around a diagonal axis by up to `a` degrees, eased over [t0, t1]. `back` returns to flat by t1. */
export const tilt = (t: number, t0: number, t1: number, dir = 0, a = 4.5, back = false): Partial<M> => {
  const p = E.inOutSine(clamp((t - t0) / Math.max(0.01, t1 - t0)));
  const amt = back ? Math.sin(Math.PI * p) : p;
  const th = ((45 + dir * 90) * Math.PI) / 180;
  return {rx: a * Math.sin(th) * amt, ry: a * Math.cos(th) * amt};
};

/* ═══════════════ subtle gold dust on reveals ═══════════════ */
export const GoldDust: React.FC<{t: number; t0: number; x: number; y: number; w: number; h: number; n?: number; seed?: number}> =
  ({t, t0, x, y, w, h, n = 34, seed = 1}) => {
    if (t < t0 || t > t0 + 2.4) return null;
    return (
      <>
        {Array.from({length: n}, (_, i) => {
          const k = i + seed * 100;
          const ts = t0 + rnd(k, 1) * 0.55;
          const life = 1.0 + rnd(k, 2) * 0.8;
          const p = (t - ts) / life;
          if (p <= 0 || p >= 1) return null;
          // spawn mostly around the card's rim
          const edge = rnd(k, 3);
          const along = rnd(k, 4);
          let px: number, py: number;
          if (edge < 0.5) { px = x - w / 2 + along * w; py = y - h / 2 + (rnd(k, 5) < 0.5 ? 0 : h) + (rnd(k, 6) - 0.5) * 60; }
          else { px = x - w / 2 + (rnd(k, 5) < 0.5 ? 0 : w) + (rnd(k, 6) - 0.5) * 60; py = y - h / 2 + along * h; }
          const e = E.outCubic(p);
          px += (rnd(k, 7) - 0.5) * 50 * e;
          py -= (35 + rnd(k, 8) * 95) * e;
          const sz = 3 + rnd(k, 9) * 5;
          const tw = 0.65 + 0.35 * Math.sin(t * (9 + rnd(k, 10) * 8) + k);
          const o = Math.pow(Math.sin(Math.PI * p), 1.3) * tw * 0.75;
          return (
            <div key={i} style={{position: 'absolute', left: px - sz * 2, top: py - sz * 2, width: sz * 4, height: sz * 4, borderRadius: '50%', opacity: o,
              mixBlendMode: 'screen', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(255,246,210,1) 0%, rgba(255,214,110,0.75) 22%, rgba(255,170,40,0.22) 45%, rgba(255,170,40,0) 70%)'}} />
          );
        })}
      </>
    );
  };

/* ═══════════════ image cache (preloaded once, then used synchronously by canvases) ═══════════════ */
const IMG: Record<string, HTMLImageElement> = {};
/** a preloaded image (after usePreload has released the render), for canvas effects in other files */
export const getImg = (s: string): HTMLImageElement | undefined => IMG[s];
export const usePreload = (srcs: string[]) => {
  const [h] = React.useState(() => delayRender('preload ' + srcs.length));
  const [ready, setReady] = React.useState(() => srcs.every((s) => IMG[s]));
  React.useEffect(() => {
    if (ready) return;
    let left = srcs.length;
    const done = () => { if (--left <= 0) setReady(true); };
    srcs.forEach((s) => {
      if (IMG[s]) { done(); return; }
      const im = new Image();
      im.onload = () => { IMG[s] = im; done(); };
      im.onerror = () => { console.error('PRELOAD FAIL', s); done(); };
      im.src = staticFile(`a/${s}`);
    });
  }, []);
  // release the render only after a re-render with the images available has committed
  React.useEffect(() => { if (ready) continueRender(h); }, [ready, h]);
  return ready;
};

/* ═══════════════ particle morph: source art BREAKS INTO particles → particles fly → form the card ═══════════════ */
type Rect = [number, number, number, number]; // cx, cy, w, h (stage coords)
type Cell = {x: number; y: number; nx: number; ny: number; r: number; g: number; b: number};
type Part = {s: number; d: number; dep: number; fl: number; c1x: number; c1y: number; c2x: number; c2y: number};
type Prep = {sc: Cell[]; dc: Cell[]; parts: Part[]; sDep: Float32Array; dArr: Float32Array; cs: number; cd: number; end: number};
const PREP: Record<string, Prep> = {};

const sample = (src: string, rect: Rect, cell: number): Cell[] => {
  const im = IMG[src];
  const cols = Math.max(4, Math.round(rect[2] / cell)), rows = Math.max(4, Math.round(rect[3] / cell));
  const cv = document.createElement('canvas'); cv.width = cols; cv.height = rows;
  const cx = cv.getContext('2d')!; cx.imageSmoothingQuality = 'high';
  cx.drawImage(im, 0, 0, cols, rows);
  const px = cx.getImageData(0, 0, cols, rows).data;
  const out: Cell[] = [];
  const cw = rect[2] / cols, ch = rect[3] / rows;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const o = (j * cols + i) * 4;
    if (px[o + 3] < 110) continue;
    out.push({x: rect[0] - rect[2] / 2 + (i + 0.5) * cw, y: rect[1] - rect[3] / 2 + (j + 0.5) * ch, nx: i / (cols - 1), ny: j / (rows - 1), r: px[o], g: px[o + 1], b: px[o + 2]});
  }
  return out;
};

const prepare = (key: string, src: string, sr: Rect, dst: string, dr: Rect, cell: number, seed: number): Prep => {
  if (PREP[key]) return PREP[key];
  const sc = sample(src, sr, cell), dc = sample(dst, dr, cell);
  const order = (a: Cell[], k: number) => a.map((c, i) => ({i, key: c.ny * 0.78 + c.nx * 0.22 + (rnd(i, k) - 0.5) * 0.12})).sort((p, q) => p.key - q.key).map((o) => o.i);
  const so = order(sc, seed), dO = order(dc, seed + 7);
  const P = Math.max(sc.length, dc.length);
  const sDep = new Float32Array(sc.length).fill(99), dArr = new Float32Array(dc.length).fill(0);
  const parts: Part[] = [];
  const scx = sr[0], scy = sr[1], dcx = dr[0], dcy = dr[1];
  let end = 0;
  for (let k = 0; k < P; k++) {
    const s = so[Math.floor((k * sc.length) / P)], d = dO[Math.floor((k * dc.length) / P)];
    const S = sc[s], D = dc[d];
    const sweep = S.ny * 0.7 + S.nx * 0.3;
    const dep = 0.52 * sweep + rnd(k, seed + 1) * 0.07;
    const fl = 0.6 + rnd(k, seed + 2) * 0.28;
    const b1 = 0.18 + rnd(k, seed + 3) * 0.42, b2 = 0.15 + rnd(k, seed + 4) * 0.35;
    parts.push({s, d, dep, fl,
      c1x: S.x + (S.x - scx) * b1 + (rnd(k, seed + 5) - 0.5) * 130, c1y: S.y + (S.y - scy) * b1 - 30 - rnd(k, seed + 6) * 110,
      c2x: D.x + (D.x - dcx) * b2 + (rnd(k, seed + 8) - 0.5) * 120, c2y: D.y + (D.y - dcy) * b2 + (rnd(k, seed + 9) - 0.5) * 120});
    sDep[s] = Math.min(sDep[s], dep);
    dArr[d] = Math.max(dArr[d], dep + fl);
    end = Math.max(end, dep + fl);
  }
  return (PREP[key] = {sc, dc, parts, sDep, dArr, cs: sr[2] / Math.round(sr[2] / cell), cd: dr[2] / Math.round(dr[2] / cell), end});
};

/** Total duration of a morph (seconds) — scenes use it to know when the real card takes over. */
export const MORPH_DUR = 1.5;

export const ParticleMorph: React.FC<{t: number; t0: number; src: string; sr: Rect; dst: string; dr: Rect; cell?: number; seed?: number; sRad?: number; dRad?: number}> =
  ({t, t0, src, sr, dst, dr, cell = 5.5, seed = 3, sRad = 0.012, dRad = 0.045}) => {
    const ref = React.useRef<HTMLCanvasElement>(null);
    const tl = t - t0;
    const active = tl >= 0 && tl <= MORPH_DUR;
    const M = 300, B = 2;
    const x0 = Math.min(sr[0] - sr[2] / 2, dr[0] - dr[2] / 2) - M, y0 = Math.min(sr[1] - sr[3] / 2, dr[1] - dr[3] / 2) - M;
    const x1 = Math.max(sr[0] + sr[2] / 2, dr[0] + dr[2] / 2) + M, y1 = Math.max(sr[1] + sr[3] / 2, dr[1] + dr[3] / 2) + M;
    const W = x1 - x0, H = y1 - y0;
    const key = `${src}|${dst}|${sr.join(',')}|${dr.join(',')}|${cell}|${seed}`;
    let fS = 0, fD = 0;
    if (active && IMG[src] && IMG[dst]) {
      const pr = prepare(key, src, sr, dst, dr, cell, seed);
      const sc = MORPH_DUR / Math.max(0.01, pr.end);
      fS = clamp(tl / (0.55 * sc)); fD = clamp((tl - 0.75 * sc) / (0.6 * sc));
    }
    React.useLayoutEffect(() => {
      const cv = ref.current;
      if (!cv || !active || !IMG[src] || !IMG[dst]) return;
      const pr = prepare(key, src, sr, dst, dr, cell, seed);
      const k = MORPH_DUR / Math.max(0.01, pr.end); // stretch the whole choreography to MORPH_DUR
      const T = tl / k;
      const cx = cv.getContext('2d')!;
      cx.setTransform(B, 0, 0, B, -x0 * B, -y0 * B);
      cx.clearRect(x0, y0, W, H);
      cx.imageSmoothingQuality = 'high';
      // 1) remaining source art (cells not yet departed), crisp, clipped to its surviving cells
      const cs = pr.cs, cd = pr.cd;
      let anyS = false;
      cx.save(); cx.beginPath();
      for (let i = 0; i < pr.sc.length; i++) if (pr.sDep[i] > T) { const c = pr.sc[i]; cx.rect(c.x - cs / 2, c.y - cs / 2, cs, cs); anyS = true; }
      if (anyS) { cx.clip(); rr(cx, sr, sRad); cx.clip(); cx.drawImage(IMG[src], sr[0] - sr[2] / 2, sr[1] - sr[3] / 2, sr[2], sr[3]); }
      cx.restore();
      // 2) card cells that particles have already landed on
      let anyD = false;
      cx.save(); cx.beginPath();
      for (let i = 0; i < pr.dc.length; i++) if (pr.dArr[i] <= T) { const c = pr.dc[i]; cx.rect(c.x - cd / 2, c.y - cd / 2, cd, cd); anyD = true; }
      if (anyD) { cx.clip(); rr(cx, dr, dRad); cx.clip(); cx.drawImage(IMG[dst], dr[0] - dr[2] / 2, dr[1] - dr[3] / 2, dr[2], dr[3]); }
      cx.restore();
      // 3) particles in flight
      for (const p of pr.parts) {
        const u = (T - p.dep) / p.fl;
        if (u <= 0 || u >= 1) continue;
        const e = E.inOutCubic(u), q = 1 - e;
        const S = pr.sc[p.s], D = pr.dc[p.d];
        const x = q * q * q * S.x + 3 * q * q * e * p.c1x + 3 * q * e * e * p.c2x + e * e * e * D.x;
        const y = q * q * q * S.y + 3 * q * q * e * p.c1y + 3 * q * e * e * p.c2y + e * e * e * D.y;
        const lift = Math.sin(Math.PI * u);
        const r = lerp(S.r, D.r, e) + (255 - lerp(S.r, D.r, e)) * 0.18 * lift;
        const g = lerp(S.g, D.g, e) + (255 - lerp(S.g, D.g, e)) * 0.18 * lift;
        const b = lerp(S.b, D.b, e) + (255 - lerp(S.b, D.b, e)) * 0.18 * lift;
        const sz = lerp(cs, cd, e) * (1 - 0.42 * lift);
        cx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        cx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
    });
    if (!active) return null;
    return (
      <>
        {/* shadows hand over from the art to the card */}
        <div style={{position: 'absolute', left: sr[0] - sr[2] / 2, top: sr[1] - sr[3] / 2, width: sr[2], height: sr[3], opacity: 1 - fS, borderRadius: sRad * sr[2],
          boxShadow: `0 ${sr[2] * 0.05}px ${sr[2] * 0.12}px rgba(0,0,0,0.5), 0 ${sr[2] * 0.012}px ${sr[2] * 0.03}px rgba(0,0,0,0.35)`}} />
        <div style={{position: 'absolute', left: dr[0] - dr[2] / 2, top: dr[1] - dr[3] / 2, width: dr[2], height: dr[3], opacity: fD, borderRadius: dRad * dr[2],
          boxShadow: `0 ${dr[2] * 0.05}px ${dr[2] * 0.12}px rgba(0,0,0,0.5), 0 ${dr[2] * 0.012}px ${dr[2] * 0.03}px rgba(0,0,0,0.35)`}} />
        <canvas ref={ref} width={Math.round(W * B)} height={Math.round(H * B)} style={{position: 'absolute', left: x0, top: y0, width: W, height: H}} />
      </>
    );
  };
/* ═══════════════ particle GATHER: art breaks → particles spiral into one glowing point → burst out → form the card ═══════════════
   Timeline (seconds from t0): departures sweep the art 0–0.5 · all particles are in the core by GATHER_B · burst · card complete by GATHER_DUR. */
export const GATHER_B = 1.12;
export const GATHER_DUR = 2.0;
type GPart = {s: number; d: number; dep: number; arr: number; land: number; th0: number; r0: number; rc: number; ph: number; spin: number; sw: number; b1: number};
type GPrep = {sc: Cell[]; dc: Cell[]; parts: GPart[]; sDep: Float32Array; dArr: Float32Array; cs: number; cd: number; gx: number; gy: number};
const GPREP: Record<string, GPrep> = {};
const prepGather = (key: string, src: string, sr: Rect, dst: string, dr: Rect, cell: number, seed: number, gx: number, gy: number): GPrep => {
  if (GPREP[key]) return GPREP[key];
  const sc = sample(src, sr, cell), dc = sample(dst, dr, cell);
  // pair source & destination cells by angle around the core so streams don't cross too much
  const ang = (c: Cell) => Math.atan2(c.y - gy, c.x - gx);
  const so = sc.map((c, i) => ({i, k: ang(c) + (rnd(i, seed) - 0.5) * 0.5})).sort((a, b) => a.k - b.k).map((o) => o.i);
  const dO = dc.map((c, i) => ({i, k: ang(c) + (rnd(i, seed + 7) - 0.5) * 0.5})).sort((a, b) => a.k - b.k).map((o) => o.i);
  const P = Math.max(sc.length, dc.length);
  const sDep = new Float32Array(sc.length).fill(99), dArr = new Float32Array(dc.length).fill(99);
  let dMax = 1;
  for (const c of dc) dMax = Math.max(dMax, Math.hypot(c.x - gx, c.y - gy));
  const parts: GPart[] = [];
  for (let k = 0; k < P; k++) {
    const s = so[Math.floor((k * sc.length) / P)], d = dO[Math.floor((k * dc.length) / P)];
    const S = sc[s], D = dc[d];
    const dep = 0.46 * (S.ny * 0.75 + S.nx * 0.25) + rnd(k, seed + 1) * 0.06;          // top-down break sweep
    const arr = Math.min(GATHER_B - 0.04, dep + 0.42 + rnd(k, seed + 2) * 0.16);        // reaches the core before the burst
    const dn = Math.hypot(D.x - gx, D.y - gy) / dMax;
    const land = GATHER_B + 0.3 + 0.42 * dn + rnd(k, seed + 3) * 0.08;                  // centre lands first → card forms outward
    parts.push({s, d, dep, arr, land, th0: Math.atan2(S.y - gy, S.x - gx), r0: Math.hypot(S.x - gx, S.y - gy),
      rc: 4 + Math.pow(rnd(k, seed + 4), 0.7) * 30, ph: rnd(k, seed + 5) * Math.PI * 2, spin: 1.5 + rnd(k, seed + 6) * 0.9,
      sw: (rnd(k, seed + 8) - 0.5) * 0.9, b1: 0.75 + rnd(k, seed + 9) * 0.5});
    sDep[s] = Math.min(sDep[s], dep);
    dArr[d] = Math.min(dArr[d], land);
  }
  return (GPREP[key] = {sc, dc, parts, sDep, dArr, cs: sr[2] / Math.round(sr[2] / cell), cd: dr[2] / Math.round(dr[2] / cell), gx, gy});
};

export const ParticleGather: React.FC<{t: number; t0: number; src: string; sr: Rect; dst: string; dr: Rect; core?: [number, number]; cell?: number; seed?: number; sRad?: number; dRad?: number; glow?: number}> =
  ({t, t0, src, sr, dst, dr, core, cell = 5.5, seed = 3, sRad = 0.012, dRad = 0.045, glow = 1}) => {
    const ref = React.useRef<HTMLCanvasElement>(null);
    const T = t - t0;
    const active = T >= 0 && T <= GATHER_DUR;
    const gx = core ? core[0] : (sr[0] + dr[0]) / 2, gy = core ? core[1] : (sr[1] + dr[1]) / 2;
    const M = 360, B = 2;
    const x0 = Math.min(sr[0] - sr[2] / 2, dr[0] - dr[2] / 2) - M, y0 = Math.min(sr[1] - sr[3] / 2, dr[1] - dr[3] / 2) - M;
    const x1 = Math.max(sr[0] + sr[2] / 2, dr[0] + dr[2] / 2) + M, y1 = Math.max(sr[1] + sr[3] / 2, dr[1] + dr[3] / 2) + M;
    const W = x1 - x0, H = y1 - y0;
    const key = `G|${src}|${dst}|${sr.join(',')}|${dr.join(',')}|${cell}|${seed}|${gx},${gy}`;
    React.useLayoutEffect(() => {
      const cv = ref.current;
      if (!cv || !active || !IMG[src] || !IMG[dst]) return;
      const pr = prepGather(key, src, sr, dst, dr, cell, seed, gx, gy);
      const cx = cv.getContext('2d')!;
      cx.setTransform(B, 0, 0, B, -x0 * B, -y0 * B);
      cx.clearRect(x0, y0, W, H);
      cx.imageSmoothingQuality = 'high';
      const cs = pr.cs, cd = pr.cd;
      // 1) the art that hasn't broken yet
      let any = false;
      cx.save(); cx.beginPath();
      for (let i = 0; i < pr.sc.length; i++) if (pr.sDep[i] > T) { const c = pr.sc[i]; cx.rect(c.x - cs / 2, c.y - cs / 2, cs, cs); any = true; }
      if (any) { cx.clip(); rr(cx, sr, sRad); cx.clip(); cx.drawImage(IMG[src], sr[0] - sr[2] / 2, sr[1] - sr[3] / 2, sr[2], sr[3]); }
      cx.restore();
      // 2) the card cells particles have landed on
      any = false;
      cx.save(); cx.beginPath();
      for (let i = 0; i < pr.dc.length; i++) if (pr.dArr[i] <= T) { const c = pr.dc[i]; cx.rect(c.x - cd / 2, c.y - cd / 2, cd, cd); any = true; }
      if (any) { cx.clip(); rr(cx, dr, dRad); cx.clip(); cx.drawImage(IMG[dst], dr[0] - dr[2] / 2, dr[1] - dr[3] / 2, dr[2], dr[3]); }
      cx.restore();
      // 3) core glow (under the particles) — grows as particles pile in, flares at the burst, then fades
      let inCore = 0;
      for (const p of pr.parts) if (T >= p.arr && T < GATHER_B) inCore++;
      const fill = inCore / pr.parts.length;
      const flare = Math.exp(-Math.pow((T - GATHER_B) / 0.07, 2));
      const after = T > GATHER_B ? Math.exp(-(T - GATHER_B) / 0.22) : 0;
      const I = glow * Math.min(1, fill * 1.15 + flare * 0.9 + after * 0.6);
      if (I > 0.01) {
        cx.save(); cx.globalCompositeOperation = 'lighter';
        const R = 60 + 110 * fill + 160 * flare;
        const g = cx.createRadialGradient(gx, gy, 0, gx, gy, R);
        g.addColorStop(0, `rgba(255,250,232,${0.95 * I})`); g.addColorStop(0.25, `rgba(255,224,150,${0.55 * I})`); g.addColorStop(1, 'rgba(255,190,80,0)');
        cx.fillStyle = g; cx.beginPath(); cx.arc(gx, gy, R, 0, Math.PI * 2); cx.fill();
        cx.restore();
      }
      // shockwave ring at the burst (thin, quick)
      const sw = (T - GATHER_B) / 0.42;
      if (sw > 0 && sw < 1) {
        const e = E.outCubic(sw);
        cx.save(); cx.globalCompositeOperation = 'lighter';
        cx.strokeStyle = `rgba(255,236,190,${0.55 * (1 - sw) * glow})`; cx.lineWidth = 7 * (1 - sw) + 1;
        cx.beginPath(); cx.arc(gx, gy, 30 + 620 * e, 0, Math.PI * 2); cx.stroke();
        cx.restore();
      }
      // 4) particles
      const HOT = [255, 236, 196];
      for (const p of pr.parts) {
        if (T < p.dep || T >= p.land) continue;
        const S = pr.sc[p.s], D = pr.dc[p.d];
        let x: number, y: number, r: number, g: number, b: number, sz: number;
        if (T < p.arr) {
          // spiral inward
          const u = (T - p.dep) / (p.arr - p.dep), e = E.inOutCubic(u);
          const rad = lerp(p.r0, p.rc, e), th = p.th0 + p.spin * e;
          x = gx + rad * Math.cos(th); y = gy + rad * Math.sin(th) - 40 * Math.sin(Math.PI * u) * (1 - p.rc / 40);
          const h = 0.75 * E.inQuad(u);
          r = lerp(S.r, HOT[0], h); g = lerp(S.g, HOT[1], h); b = lerp(S.b, HOT[2], h);
          sz = cs * (1 - 0.5 * e);
        } else if (T < GATHER_B) {
          // churn inside the core; it tightens just before the burst
          const press = 1 - 0.45 * E.inCubic(clamp((T - (GATHER_B - 0.3)) / 0.3));
          const th = p.th0 + p.spin + p.ph + 7 * (T - p.arr);
          const rad = p.rc * press;
          x = gx + rad * Math.cos(th); y = gy + rad * Math.sin(th);
          r = HOT[0]; g = HOT[1]; b = HOT[2]; sz = cs * 0.5;
        } else {
          // burst out along a curved path and land on the card
          const u = (T - GATHER_B) / (p.land - GATHER_B), e = E.outCubic(u), q = 1 - e;
          const dx = D.x - gx, dy = D.y - gy;
          const c1x = gx + dx * p.b1 - dy * p.sw, c1y = gy + dy * p.b1 + dx * p.sw;
          const c2x = D.x + dx * 0.1, c2y = D.y + dy * 0.1;
          const sx = gx + p.rc * 0.55 * Math.cos(p.ph), sy = gy + p.rc * 0.55 * Math.sin(p.ph);
          x = q * q * q * sx + 3 * q * q * e * c1x + 3 * q * e * e * c2x + e * e * e * D.x;
          y = q * q * q * sy + 3 * q * q * e * c1y + 3 * q * e * e * c2y + e * e * e * D.y;
          const h = E.inOutSine(u);
          r = lerp(HOT[0], D.r, h); g = lerp(HOT[1], D.g, h); b = lerp(HOT[2], D.b, h);
          sz = lerp(cs * 0.5, cd, E.inQuad(u));
        }
        cx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        cx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
    });
    if (!active) return null;
    const fS = clamp(T / 0.6), fD = clamp((T - (GATHER_B + 0.35)) / 0.5);
    return (
      <>
        <div style={{position: 'absolute', left: sr[0] - sr[2] / 2, top: sr[1] - sr[3] / 2, width: sr[2], height: sr[3], opacity: 1 - fS, borderRadius: sRad * sr[2],
          boxShadow: `0 ${sr[2] * 0.05}px ${sr[2] * 0.12}px rgba(0,0,0,0.5), 0 ${sr[2] * 0.012}px ${sr[2] * 0.03}px rgba(0,0,0,0.35)`}} />
        <div style={{position: 'absolute', left: dr[0] - dr[2] / 2, top: dr[1] - dr[3] / 2, width: dr[2], height: dr[3], opacity: fD, borderRadius: dRad * dr[2],
          boxShadow: `0 ${dr[2] * 0.05}px ${dr[2] * 0.12}px rgba(0,0,0,0.5), 0 ${dr[2] * 0.012}px ${dr[2] * 0.03}px rgba(0,0,0,0.35)`}} />
        <canvas ref={ref} width={Math.round(W * B)} height={Math.round(H * B)} style={{position: 'absolute', left: x0, top: y0, width: W, height: H}} />
      </>
    );
  };

/* ═══════════════ particle REARRANGE (v3): the art breaks into pixels, the pixels travel and settle into the card ═══════════════
   Simple on purpose: no ball, no burst, no colour sorting. Each pixel moves to the matching spot on the card. */
export const REARR_DUR = 2.1;
type RPart = {s: number; d: number; dep: number; land: number; c1x: number; c1y: number; c2x: number; c2y: number};
type RPrep = {sc: Cell[]; dc: Cell[]; parts: RPart[]; sDep: Float32Array; dArr: Float32Array; cs: number; cd: number};
const RPREP: Record<string, RPrep> = {};
const prepRearr = (key: string, src: string, sr: Rect, dst: string, dr: Rect, cell: number, seed: number): RPrep => {
  if (RPREP[key]) return RPREP[key];
  const sc = sample(src, sr, cell), dc = sample(dst, dr, cell);
  // simple: each pixel goes to the matching spot on the card (same relative position), no colour sorting
  const k = (c: Cell, i: number, sd: number) => Math.round(c.ny * 400) + c.nx * 0.99 + (rnd(i, sd) - 0.5) * 0.002;
  const so = sc.map((c, i) => ({i, k: k(c, i, seed)})).sort((a, b) => a.k - b.k).map((o) => o.i);
  const dO = dc.map((c, i) => ({i, k: k(c, i, seed + 7)})).sort((a, b) => a.k - b.k).map((o) => o.i);
  const P = Math.max(sc.length, dc.length);
  const sDep = new Float32Array(sc.length).fill(99), dArr = new Float32Array(dc.length).fill(99);
  const parts: RPart[] = [];
  for (let q = 0; q < P; q++) {
    const s = so[Math.floor((q * sc.length) / P)], d = dO[Math.floor((q * dc.length) / P)];
    const S = sc[s], D = dc[d];
    const dep = 0.5 * (S.ny * 0.8 + S.nx * 0.2) + rnd(q, seed + 1) * 0.08;   // the art comes apart top-down
    const land = dep + 1.05 + rnd(q, seed + 2) * 0.35;                     // every pixel travels a full, slow trip
    // a small, loose drift on the way so it reads as pixels moving, not a cross-fade
    const dx = D.x - S.x, dy = D.y - S.y;
    const ox = (rnd(q, seed + 3) - 0.5) * 70, oy = (rnd(q, seed + 4) - 0.5) * 70;
    parts.push({s, d, dep, land,
      c1x: S.x + dx * 0.3 + ox, c1y: S.y + dy * 0.3 + oy,
      c2x: S.x + dx * 0.7 + ox * 0.6, c2y: S.y + dy * 0.7 + oy * 0.6});
    sDep[s] = Math.min(sDep[s], dep);
    dArr[d] = Math.min(dArr[d], land);
  }
  return (RPREP[key] = {sc, dc, parts, sDep, dArr, cs: sr[2] / Math.round(sr[2] / cell), cd: dr[2] / Math.round(dr[2] / cell)});
};
export const ParticleRearrange: React.FC<{t: number; t0: number; src: string; sr: Rect; dst: string; dr: Rect; cell?: number; seed?: number; sRad?: number; dRad?: number}> =
  ({t, t0, src, sr, dst, dr, cell = 5.5, seed = 3, sRad = 0.012, dRad = 0.045}) => {
    const ref = React.useRef<HTMLCanvasElement>(null);
    const T = t - t0;
    const active = T >= 0 && T <= REARR_DUR;
    const M = 220, B = 2;
    const x0 = Math.min(sr[0] - sr[2] / 2, dr[0] - dr[2] / 2) - M, y0 = Math.min(sr[1] - sr[3] / 2, dr[1] - dr[3] / 2) - M;
    const x1 = Math.max(sr[0] + sr[2] / 2, dr[0] + dr[2] / 2) + M, y1 = Math.max(sr[1] + sr[3] / 2, dr[1] + dr[3] / 2) + M;
    const W = x1 - x0, H = y1 - y0;
    const key = `R|${src}|${dst}|${sr.join(',')}|${dr.join(',')}|${cell}|${seed}`;
    React.useLayoutEffect(() => {
      const cv = ref.current;
      if (!cv || !active || !IMG[src] || !IMG[dst]) return;
      const pr = prepRearr(key, src, sr, dst, dr, cell, seed);
      const cx = cv.getContext('2d')!;
      cx.setTransform(B, 0, 0, B, -x0 * B, -y0 * B);
      cx.clearRect(x0, y0, W, H);
      cx.imageSmoothingQuality = 'high';
      const cs = pr.cs, cd = pr.cd;
      let any = false;
      cx.save(); cx.beginPath();
      for (let i = 0; i < pr.sc.length; i++) if (pr.sDep[i] > T) { const c = pr.sc[i]; cx.rect(c.x - cs / 2, c.y - cs / 2, cs, cs); any = true; }
      if (any) { cx.clip(); rr(cx, sr, sRad); cx.clip(); cx.drawImage(IMG[src], sr[0] - sr[2] / 2, sr[1] - sr[3] / 2, sr[2], sr[3]); }
      cx.restore();
      any = false;
      cx.save(); cx.beginPath();
      for (let i = 0; i < pr.dc.length; i++) if (pr.dArr[i] <= T) { const c = pr.dc[i]; cx.rect(c.x - cd / 2, c.y - cd / 2, cd, cd); any = true; }
      if (any) { cx.clip(); rr(cx, dr, dRad); cx.clip(); cx.drawImage(IMG[dst], dr[0] - dr[2] / 2, dr[1] - dr[3] / 2, dr[2], dr[3]); }
      cx.restore();
      for (const p of pr.parts) {
        if (T < p.dep || T >= p.land) continue;
        const u = (T - p.dep) / (p.land - p.dep), e = E.inOutCubic(u), q = 1 - e;
        const S = pr.sc[p.s], D = pr.dc[p.d];
        const x = q * q * q * S.x + 3 * q * q * e * p.c1x + 3 * q * e * e * p.c2x + e * e * e * D.x;
        const y = q * q * q * S.y + 3 * q * q * e * p.c1y + 3 * q * e * e * p.c2y + e * e * e * D.y;
        const h = E.inOutSine(clamp((u - 0.3) / 0.6));
        const sz = lerp(cs, cd, e) * (1 - 0.18 * Math.sin(Math.PI * u));
        cx.fillStyle = `rgb(${lerp(S.r, D.r, h) | 0},${lerp(S.g, D.g, h) | 0},${lerp(S.b, D.b, h) | 0})`;
        cx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
    });
    if (!active) return null;
    const fS = clamp(T / 0.7), fD = clamp((T - 1.1) / 0.8);
    return (
      <>
        <div style={{position: 'absolute', left: sr[0] - sr[2] / 2, top: sr[1] - sr[3] / 2, width: sr[2], height: sr[3], opacity: 1 - fS, borderRadius: sRad * sr[2],
          boxShadow: `0 ${sr[2] * 0.05}px ${sr[2] * 0.12}px rgba(0,0,0,0.5), 0 ${sr[2] * 0.012}px ${sr[2] * 0.03}px rgba(0,0,0,0.35)`}} />
        <div style={{position: 'absolute', left: dr[0] - dr[2] / 2, top: dr[1] - dr[3] / 2, width: dr[2], height: dr[3], opacity: fD, borderRadius: dRad * dr[2],
          boxShadow: `0 ${dr[2] * 0.05}px ${dr[2] * 0.12}px rgba(0,0,0,0.5), 0 ${dr[2] * 0.012}px ${dr[2] * 0.03}px rgba(0,0,0,0.35)`}} />
        <canvas ref={ref} width={Math.round(W * B)} height={Math.round(H * B)} style={{position: 'absolute', left: x0, top: y0, width: W, height: H}} />
      </>
    );
  };

const rr = (cx: CanvasRenderingContext2D, r: Rect, rad: number) => {
  const x = r[0] - r[2] / 2, y = r[1] - r[3] / 2, w = r[2], h = r[3], k = rad * w;
  cx.beginPath(); cx.moveTo(x + k, y); cx.arcTo(x + w, y, x + w, y + h, k); cx.arcTo(x + w, y + h, x, y + h, k); cx.arcTo(x, y + h, x, y, k); cx.arcTo(x, y, x + w, y, k); cx.closePath();
};

/* ═══════════════ titles v2: four measured styles, no squash ═══════════════
   1 tight + thin white stroke · 2 = 1 + matched-width subtitle · 3 black panel + dashed ring · 4 dashed ring
   All values in units of ink height G = 0.72·fontSize (Bolota), measured from the client's mockup. */
export type Cue = {t: number; lines: string[]; sub?: string; style?: 1 | 2 | 3 | 4; mode?: 'type' | 'rise'; from?: 'left' | 'right' | 'top' | 'none';
  /** optional: how many characters are typed at time t (e.g. words synced to the VO). The box keeps its final size. */
  typed?: (t: number) => number};
export type TOut = {t: number; mode: 'left' | 'right' | 'up' | 'drop'};
export const TIGHT = {padT: 0.185, padB: 0.2, padX: 0.323, gap: 0.062, ls: 0.01};
export const RING = {padT: 0.368, padB: 0.386, padX: 0.825, gap: 0.12, ls: 0.006, inset: 0.158, sw: 0.053, dash: 0.175, dgap: 0.158, panel: 0.22};
const ACC_UP = /[ÀÁẢÃÂẦẤẨẪĂẰẮẲẴÈÉẺẼÊỀẾỂỄÌÍỈĨÒÓỎÕÔỒỐỔỖƠỜỚỞỠÙÚỦŨƯỪỨỬỮỲÝỶỸẬẶỆỘỢỰ]/;
const ACC_DN = /[ẠẶẬẸỆỊỌỘỢỤỰỴ]/;
type Lay = {w: number; h: number; rows: {text: string; S: number; y: number}[]; G: number; st: number; ls: number};
const layout = (c: Cue, S: number): Lay => {
  const st = c.style ?? 1;
  const sp = st >= 3 ? RING : TIGHT;
  const G = 0.72 * S;
  const adv = (txt: string, sz: number) => textW(txt, sz, 700) + txt.length * sz * sp.ls;
  const rows: Lay['rows'] = [];
  let y = sp.padT * G, w = 0;
  // Vietnamese capitals: marks above reach 0.90 em (caps 0.70), dots below sit under the baseline. Give each row
  // that carries them its own headroom / footroom so rows never collide with each other or the box edge.
  const UP = (sz: number, t: string) => (ACC_UP.test(t) ? 0.3 * 0.72 * sz : 0), DN = (sz: number, t: string) => (ACC_DN.test(t) ? 0.2 * 0.72 * sz : 0);
  c.lines.forEach((l, k) => { if (k) y += sp.gap * G; y += UP(S, l); rows.push({text: l, S, y}); y += G + DN(S, l); w = Math.max(w, adv(l, S)); });
  if (c.sub && st === 2) {
    const S2 = Math.min(S * (w / adv(c.sub, S)), 0.62 * S);
    y += sp.gap * G + UP(S2, c.sub); rows.push({text: c.sub, S: S2, y}); y += 0.72 * S2 + DN(S2, c.sub); w = Math.max(w, adv(c.sub, S2));
  }
  return {w: w + 2 * sp.padX * G, h: y + sp.padB * G, rows, G, st, ls: sp.ls};
};
const fit = (c: Cue, want: number) => { const w = layout(c, want).w; return w > L.MAXW ? (want * L.MAXW) / w : want; };
export const titleLay = (c: Cue, want = L.TMAX) => layout(c, fit(c, want));
const curIdx = (cues: Cue[], t: number) => { let i = 0; for (let k = 0; k < cues.length; k++) if (t >= cues[k].t) i = k; return i; };
const SWAP = 0.42;
export const titleHAt2 = (t: number, cues: Cue[]) => {
  if (!cues.length) return 0;
  const i = curIdx(cues, t);
  const h = titleLay(cues[i]).h;
  return i === 0 ? h : lerp(titleLay(cues[i - 1]).h, h, ramp(t, cues[i].t, SWAP, E.inOutCubic));
};

export const Deco: React.FC<{st: number; W: number; H: number; G: number; o: number}> = ({st, W, H, G, o}) => {
  if (o <= 0.001) return null;
  if (st === 1 || st === 2) return <div style={{position: 'absolute', inset: 0, border: `${Math.max(2, 0.031 * G)}px solid white`, opacity: o}} />;
  const sw = Math.max(2.5, RING.sw * G), ins = RING.inset * G + sw / 2, pin = RING.panel * G;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      {st === 3 && <div style={{position: 'absolute', left: pin, top: pin, right: pin, bottom: pin, background: '#050505'}} />}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <rect x={ins} y={ins} width={Math.max(0, W - 2 * ins)} height={Math.max(0, H - 2 * ins)} fill="none" stroke="white" strokeWidth={sw}
          strokeDasharray={`${RING.dash * G} ${RING.dgap * G}`} />
      </svg>
    </div>
  );
};

const Rows: React.FC<{lay: Lay; H: number; dy: number; o: number; chars: number}> = ({lay, H, dy, o, chars}) => {
  if (o <= 0.001) return null;
  let left = chars;
  const offY = (H - lay.h) / 2;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${dy}px)`, opacity: o}}>
      {lay.rows.map((r, k) => {
        const s = r.text.slice(0, Math.max(0, left)); left -= r.text.length;
        return (
          <div key={k} style={{position: 'absolute', left: 0, right: 0, top: offY + r.y - 0.04 * r.S, height: r.S, display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative', fontFamily: FONT, fontWeight: 700, fontSize: r.S, lineHeight: `${r.S}px`, color: 'white', whiteSpace: 'pre', letterSpacing: r.S * lay.ls}}>
              <span style={{visibility: 'hidden'}}>{r.text}</span>
              <span style={{position: 'absolute', left: 0, top: 0}}>{s}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Title2: React.FC<{t: number; cues: Cue[]; y: number; out?: TOut}> = ({t, cues, y, out}) => {
  if (!cues.length || t < cues[0].t) return null;
  const i = curIdx(cues, t);
  const cur = cues[i], cl = titleLay(cur);
  const u = t - cur.t;
  let W = cl.w, H = cl.h, boxO = 1, clipB = 0, chars = 999, slideX = 0, slideY = 0, slideO = 1;
  let rows: React.ReactNode;
  let deco: React.ReactNode;
  if (i === 0) {
    const mode = cur.mode ?? 'type';
    let dy = 0;
    if (mode === 'type') {
      // the box glides in slowly while its text types on inside it
      const total = cl.rows.map((r) => r.text).join('').length;
      chars = cur.typed ? cur.typed(t) : Math.floor(Math.max(0, u - 0.18) * 32);
      boxO = 0.55 + 0.45 * E.outQuad(clamp(chars / total));
      const from = cur.from ?? 'left';
      const p = ramp(t, cur.t, 1.0, E.outQuint);
      if (from === 'left' || from === 'right') slideX = (from === 'left' ? -1 : 1) * 900 * (1 - p);
      else if (from === 'top') slideY = -260 * (1 - p);
      slideO = ramp(t, cur.t, 0.3, E.linear);
    } else {
      clipB = 1 - ramp(t, cur.t, 0.36, E.outCubic);
      dy = (1 - ramp(t, cur.t + 0.05, 0.38, E.outCubic)) * H * 0.75;
    }
    rows = <Rows lay={cl} H={H} dy={dy} o={1} chars={chars} />;
    deco = <Deco st={cl.st} W={W} H={H} G={cl.G} o={1} />;
  } else {
    // text change: box glides to the new size; old words slide up & out, new words slide up & in. No squash.
    const pl = titleLay(cues[i - 1]);
    const pw = ramp(t, cur.t, SWAP, E.inOutCubic);
    W = lerp(pl.w, cl.w, pw); H = lerp(pl.h, cl.h, pw);
    const po = ramp(t, cur.t, 0.22, E.inCubic);
    const pi = ramp(t, cur.t + 0.13, 0.4, E.outCubic);
    const df = ramp(t, cur.t, 0.32, E.inOutCubic);
    rows = (
      <>
        <Rows lay={pl} H={H} dy={-H * 0.6 * po} o={1 - po} chars={999} />
        <Rows lay={cl} H={H} dy={H * 0.6 * (1 - pi)} o={clamp(pi * 1.6)} chars={cur.typed ? cur.typed(t) : 999} />
      </>
    );
    deco = pl.st === cl.st ? <Deco st={cl.st} W={W} H={H} G={lerp(pl.G, cl.G, pw)} o={1} /> : (
      <>
        <Deco st={pl.st} W={W} H={H} G={pl.G} o={1 - df} />
        <Deco st={cl.st} W={W} H={H} G={cl.G} o={df} />
      </>
    );
  }
  let ex: Partial<M> = {};
  if (out && t > out.t) {
    const d = out.mode === 'up' ? 0.9 : out.mode === 'drop' ? 0.5 : 1.05;
    const p = ramp(t, out.t, d, out.mode === 'drop' ? E.inCubic : E.inOutCubic);
    if (p >= 1) return null;
    if (out.mode === 'up') ex = {y: -240 * p, o: 1 - E.inQuad(p)};
    else if (out.mode !== 'drop') ex = {x: (out.mode === 'left' ? -1 : 1) * 1300 * p};
    if (out.mode === 'drop') { const q = p; return (
      <div style={{position: 'absolute', left: 540 - W / 2, top: y, width: W, height: H, clipPath: `inset(0 0 ${q * 100}% 0)`}}>
        <div style={{position: 'absolute', inset: 0, background: BOX_RED, boxShadow: '0 10px 28px rgba(0,0,0,.3)'}} />
        {deco}
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', transform: `translateY(${-q * H * 0.5}px)`}}>{rows}</div>
      </div>
    ); }
  }
  const b = add(ex, {x: slideX, y: slideY, o: slideO});
  return (
    <div style={{position: 'absolute', left: 540 - W / 2, top: y, width: W, height: H, transform: tf(b), opacity: b.o,
      clipPath: clipB > 0 ? `inset(${clipB * 100}% 0 0 0)` : undefined}}>
      <div style={{position: 'absolute', inset: 0, background: BOX_RED, opacity: boxO, boxShadow: '0 10px 28px rgba(0,0,0,.3)'}} />
      <div style={{position: 'absolute', inset: 0, opacity: boxO}}>{deco}</div>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>{rows}</div>
    </div>
  );
};

/** Small tight-style tag (style 1 look) that types on; anchored at its left edge. */
export const Tag2: React.FC<{t: number; tIn: number; text: string; x: number; y: number; size?: number; m?: Partial<M>}> = ({t, tIn, text, x, y, size = 46, m = {}}) => {
  if (t < tIn) return null;
  const lay = layout({t: 0, lines: [text], style: 1}, size);
  const chars = Math.floor((t - tIn) * 40);
  const b = add(m);
  return (
    <div style={{position: 'absolute', left: x + (b.x ?? 0), top: y + (b.y ?? 0) - lay.h / 2, width: lay.w, height: lay.h, opacity: b.o}}>
      <div style={{position: 'absolute', inset: 0, background: BOX_RED, opacity: 0.32 + 0.68 * clamp(chars / text.length), boxShadow: '0 8px 20px rgba(0,0,0,.35)'}} />
      <Deco st={1} W={lay.w} H={lay.h} G={lay.G} o={1} />
      <Rows lay={lay} H={lay.h} dy={0} o={1} chars={chars} />
    </div>
  );
};

/* ═══════════════ Stage v2: title + fixed gap + content as one centred group ═══════════════ */
/** The stage transform (content box → screen): screenX = tx + x·s, screenY = ty + y·s. */
export const stageXf = (t: number, cues: Cue[], box: Box, maxS = 1.6, release?: number) => {
  const rel = release !== undefined ? 1 - ramp(t, release, 0.9, E.inOutCubic) : 1;
  const Ht = titleHAt2(t, cues) * rel;
  const gap = (cues.length ? L.GAP : 0) * rel;
  const bw = box[2] - box[0], bh = box[3] - box[1];
  const avail = L.BOT - L.TOP;
  const s = Math.min(L.MAXW / bw, (avail - Ht - gap) / bh, maxS);
  const G = Ht + gap + bh * s;
  const top = L.TOP + (avail - G) / 2;
  const ty = top + Ht + gap - box[1] * s;
  const tx = 540 - ((box[0] + box[2]) / 2) * s;
  return {s, top, tx, ty};
};
export const Stage2: React.FC<{t: number; cues: Cue[]; box: Box; out?: TOut; maxS?: number; release?: number; children: React.ReactNode}> =
  ({t, cues, box, out, maxS = 1.6, release, children}) => {
    const {s, top, tx, ty} = stageXf(t, cues, box, maxS, release);
    return (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          perspective: 2300 / s, perspectiveOrigin: `${(540 - tx) / s}px ${(960 - ty) / s}px`}}>
          <ViewCtx.Provider value={{ox: (540 - tx) / s, oy: (960 - ty) / s, d: 2300 / s, lx: -620 / s, ly: -1050 / s, lz: 1500 / s}}>
            {children}
          </ViewCtx.Provider>
        </div>
        {cues.length > 0 && <Title2 t={t} cues={cues} y={top} out={out} />}
      </>
    );
  };
