import React from 'react';
import {Img, staticFile} from 'remotion';

/* ───────────────────────── math ───────────────────────── */
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export type Ease = (p: number) => number;
export const E = {
  linear: (p: number) => p,
  inQuad: (p: number) => p * p,
  inCubic: (p: number) => p * p * p,
  inQuart: (p: number) => p ** 4,
  outQuad: (p: number) => 1 - (1 - p) ** 2,
  outCubic: (p: number) => 1 - (1 - p) ** 3,
  outQuart: (p: number) => 1 - (1 - p) ** 4,
  outQuint: (p: number) => 1 - (1 - p) ** 5,
  outExpo: (p: number) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p)),
  inOutSine: (p: number) => -(Math.cos(Math.PI * p) - 1) / 2,
  inOutCubic: (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2),
  inOutQuart: (p: number) => (p < 0.5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2),
  inOutQuint: (p: number) => (p < 0.5 ? 16 * p ** 5 : 1 - (-2 * p + 2) ** 5 / 2),
  outBack: (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2,
  inBack: (p: number) => 2.70158 * p ** 3 - 1.70158 * p * p,
  inOutExpo: (p: number) =>
    p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? 2 ** (20 * p - 10) / 2 : (2 - 2 ** (-20 * p + 10)) / 2,
};

/** eased 0..1 progress of a window */
export const ramp = (t: number, t0: number, dur: number, ease: Ease = E.outCubic) =>
  ease(clamp((t - t0) / dur));

/** damped spring 0→1 (f = natural frequency in Hz, z = damping ratio) */
export const spr = (t: number, t0: number, f = 1.6, z = 0.78) => {
  const tau = t - t0;
  if (tau <= 0) return 0;
  const w = 2 * Math.PI * f;
  if (z >= 1) return 1 - Math.exp(-w * tau) * (1 + w * tau);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + ((z * w) / wd) * Math.sin(wd * tau));
};

/** piecewise keyframes: [time, value, easeIntoThisKey?] */
export type K = [number, number, Ease?];
export const kf = (t: number, keys: K[]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, ease = E.inOutCubic] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, ease(clamp((t - t0) / (t1 - t0 || 1e-6))));
  }
  return keys[keys.length - 1][1];
};

/* ───────────────────────── motion primitives ───────────────────────── */
export type M = {x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; o: number; blur: number};
export const M0 = (): M => ({x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, o: 1, blur: 0});
export const add = (...ms: Partial<M>[]): M => {
  const r = M0();
  for (const m of ms) {
    r.x += m.x ?? 0; r.y += m.y ?? 0; r.z += m.z ?? 0; r.rx += m.rx ?? 0; r.ry += m.ry ?? 0; r.rz += m.rz ?? 0;
    r.s *= m.s ?? 1; r.o *= m.o ?? 1; r.blur += m.blur ?? 0;
  }
  return r;
};

type Side = 'left' | 'right' | 'top' | 'bottom';
const sv = (s: Side) => ({x: s === 'left' ? -1 : s === 'right' ? 1 : 0, y: s === 'top' ? -1 : s === 'bottom' ? 1 : 0});

/** Card entrance: slides from a screen edge while swinging open in 3D (rotation lags position → organic settle). */
export const swingIn = (t: number, t0: number, side: Side, o: {dist?: number; rot?: number; f?: number; z?: number; spin?: number} = {}): Partial<M> => {
  if (t < t0) return {o: 0};
  const v = sv(side);
  const p = spr(t, t0, o.f ?? 1.2, o.z ?? 0.86);
  const pr = spr(t, t0 + 0.02, (o.f ?? 1.2) * 0.86, 0.68);
  const dist = o.dist ?? 1150;
  const rot = o.rot ?? 78;
  const spin = (o.spin ?? 0) * 360;
  return {
    x: v.x * dist * (1 - p),
    y: v.y * dist * (1 - p),
    ry: v.x * (rot + spin) * (1 - pr),
    rx: -v.y * rot * 0.7 * (1 - pr),
    o: clamp((t - t0) / 0.08),
  };
};

/** Pop entrance: scale from small with spring overshoot. */
export const popIn = (t: number, t0: number, o: {from?: number; f?: number; z?: number} = {}): Partial<M> => {
  if (t < t0) return {o: 0, s: 0};
  const p = spr(t, t0, o.f ?? 2.2, o.z ?? 0.55);
  const from = o.from ?? 0.4;
  return {s: from + (1 - from) * p, o: clamp((t - t0) / 0.1)};
};

/** Fade-rise entrance for text. */
export const riseIn = (t: number, t0: number, o: {dy?: number; dur?: number; scale?: number} = {}): Partial<M> => {
  const p = ramp(t, t0, o.dur ?? 0.42, E.outQuart);
  return {y: (o.dy ?? 26) * (1 - p), o: ramp(t, t0, (o.dur ?? 0.42) * 0.6, E.linear), s: lerp(o.scale ?? 1.06, 1, p), blur: 8 * (1 - p)};
};

/** Whip exit: accelerates off toward a side. */
export const whipOut = (t: number, t0: number, side: Side, o: {dist?: number; dur?: number; rot?: number} = {}): Partial<M> => {
  if (t <= t0) return {};
  const v = sv(side);
  const p = ramp(t, t0, o.dur ?? 0.5, E.inCubic);
  const dist = o.dist ?? 1500;
  return {x: v.x * dist * p, y: v.y * dist * p, ry: -v.x * (o.rot ?? 28) * p, rx: v.y * (o.rot ?? 20) * p};
};

/** Never-frozen idle: slow 3D sway + float. */
export const idle = (t: number, phase = 0, amp = 1): Partial<M> => ({
  ry: 3.2 * amp * Math.sin((t / 3.4) * 2 * Math.PI + phase),
  rx: 1.8 * amp * Math.sin((t / 4.1) * 2 * Math.PI + phase * 1.7 + 1),
  y: 7 * amp * Math.sin((t / 3.0) * 2 * Math.PI + phase * 0.8),
});

export const tf = (m: M) =>
  `translate3d(${m.x}px, ${m.y}px, ${m.z ?? 0}px) rotateZ(${m.rz}deg) rotateY(${m.ry}deg) rotateX(${m.rx}deg) scale(${m.s})`;

/* ───────────────────────── visual components ───────────────────────── */
export const RED = '#d8262c';
export const RED_DK = '#a8161c';
export const GOLD = '#f4c542';
export const INK = '#0b1a0d';
export const FONT = 'Bolota';
export const BOX_RED = '#b00000';

const asset = (p: string) => staticFile(`a/${p}`);

/** A card (or flippable card) placed by its centre. */
/* ───────────── physical card look (switchable) ───────────── */
export const CARD3D = false;
type Foil = 'none' | 'holo' | 'gold' | 'paper';
const foilOf = (src: string): Foil => {
  if (/vol1|artbook|banner/.test(src)) return 'paper';
  if (/dino_ultra|E\d+g|l\d_b/.test(src)) return 'gold';
  if (/goku_alt|scr_alt|scr_super|dino_alt|l\d_f/.test(src)) return 'holo';
  return 'none';
};
const D2R = Math.PI / 180;
/** facing ratio of a face toward a fixed key light (upper-left, front) */
const lightOn = (rx: number, ry: number) => {
  const nx = Math.sin(ry * D2R) * Math.cos(rx * D2R), ny = -Math.sin(rx * D2R), nz = Math.cos(ry * D2R) * Math.cos(rx * D2R);
  const L = [-0.38, -0.5, 1], ln = Math.hypot(...L);
  return {d: (nx * L[0] + ny * L[1] + nz * L[2]) / ln, nx, ny};
};
const FaceLight: React.FC<{rx: number; ry: number; foil: Foil}> = ({rx, ry, foil}) => {
  const {d, nx, ny} = lightOn(rx, ry);
  const shade = clamp((0.93 - d) * 0.85, 0, 0.42);
  // specular spot slides opposite to the tilt; strongest when the face points at the light
  const hx = 32 - nx * 260, hy = 22 + ny * 260;
  const spec = clamp((d - 0.55) * 1.6, 0, 1) * (foil === 'paper' ? 0.18 : 0.32);
  const shift = ry * 4.2 + rx * 2.6;
  return (
    <>
      {(foil === 'holo' || foil === 'gold') && (
        <div style={{position: 'absolute', inset: 0, mixBlendMode: foil === 'gold' ? 'soft-light' : 'overlay', opacity: foil === 'gold' ? 0.55 : 0.42,
          backgroundImage: foil === 'gold'
            ? 'linear-gradient(115deg, #7a5200 0%, #ffe9a3 14%, #b8860b 28%, #fff4c7 42%, #8a6100 56%, #ffe08a 70%, #a87a10 84%, #fff1b8 100%)'
            : 'linear-gradient(115deg, #ff4fa3 0%, #ffd84f 12%, #5dffb0 24%, #4fc3ff 36%, #a66bff 48%, #ff4fa3 60%, #ffd84f 72%, #5dffb0 84%, #4fc3ff 100%)',
          backgroundSize: '320% 320%', backgroundPosition: `${50 + shift}% ${50 + shift * 0.6}%`}} />
      )}
      {(foil === 'holo' || foil === 'gold') && (
        <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.55,
          background: `linear-gradient(115deg, transparent ${30 + shift * 1.4}%, rgba(255,255,255,0.32) ${42 + shift * 1.4}%, transparent ${54 + shift * 1.4}%)`}} />
      )}
      {spec > 0.01 && <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: spec,
        background: `radial-gradient(ellipse 70% 55% at ${hx}% ${hy}%, rgba(255,252,240,0.9), rgba(255,252,240,0) 70%)`}} />}
      {shade > 0.005 && <div style={{position: 'absolute', inset: 0, background: `rgba(0,8,2,${shade})`}} />}
      <div style={{position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.22)'}} />
    </>
  );
};

/* ───────────── scene lighting: a real point light, evaluated per pixel on each card face ─────────────
   ViewCtx = where the eye (CSS perspective origin) and the light sit, in the coordinates the cards are laid out in. */
export type View = {ox: number; oy: number; d: number; lx: number; ly: number; lz: number};
export const ViewCtx = React.createContext<View>({ox: 540, oy: 960, d: 2300, lx: -620, ly: -1050, lz: 1500});
export type Lit = {k?: number; shin?: number; shade?: number; tint?: [number, number, number]};
type V3 = [number, number, number];
const rotM = (rx: number, ry: number, rz: number, extraY = 0) => {
  // CSS order: rotateZ · rotateY · rotateX · rotateY(extra)  (y-down, z toward the viewer)
  const r = Math.PI / 180;
  const cz = Math.cos(rz * r), sz = Math.sin(rz * r), cy = Math.cos(ry * r), sy = Math.sin(ry * r), cx = Math.cos(rx * r), sx = Math.sin(rx * r);
  const ce = Math.cos(extraY * r), se = Math.sin(extraY * r);
  const mul = (a: number[][], b: number[][]) => a.map((row) => [0, 1, 2].map((j) => row[0] * b[0][j] + row[1] * b[1][j] + row[2] * b[2][j]));
  const Rz = [[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]], Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rx = [[1, 0, 0], [0, cx, -sx], [0, sx, cx]];
  const Re = [[ce, 0, se], [0, 1, 0], [-se, 0, ce]];
  return mul(mul(mul(Rz, Ry), Rx), Re);
};
const LGW = 40, LGH = 56;
export const LightFace: React.FC<{x: number; y: number; w: number; h: number; m: M; extraY: number; lit: Lit}> = ({x, y, w, h, m, extraY, lit}) => {
  const view = React.useContext(ViewCtx);
  const spec = React.useRef<HTMLCanvasElement>(null), shade = React.useRef<HTMLCanvasElement>(null);
  React.useLayoutEffect(() => {
    const cs = spec.current?.getContext('2d'), cd = shade.current?.getContext('2d');
    if (!cs || !cd) return;
    const R = rotM(m.rx, m.ry, m.rz, extraY);
    const N: V3 = [R[0][2], R[1][2], R[2][2]];
    const C: V3 = [x + m.x, y + m.y, m.z ?? 0];
    const Ex = view.ox, Ey = view.oy, Ez = view.d;
    const Lx = view.ox + view.lx, Ly = view.oy + view.ly, Lz = view.lz;
    const k = lit.k ?? 0.42, shin = lit.shin ?? 26, kd = lit.shade ?? 0.34;
    const tint = lit.tint ?? [255, 247, 232];
    const is = cs.createImageData(LGW, LGH), id = cd.createImageData(LGW, LGH);
    for (let j = 0; j < LGH; j++) for (let i = 0; i < LGW; i++) {
      const u = ((i + 0.5) / LGW - 0.5) * w * m.s, v = ((j + 0.5) / LGH - 0.5) * h * m.s;
      const px = C[0] + R[0][0] * u + R[0][1] * v, py = C[1] + R[1][0] * u + R[1][1] * v, pz = C[2] + R[2][0] * u + R[2][1] * v;
      let vx = Ex - px, vy = Ey - py, vz = Ez - pz; const vl = Math.hypot(vx, vy, vz); vx /= vl; vy /= vl; vz /= vl;
      let lx = Lx - px, ly = Ly - py, lz = Lz - pz; const ll = Math.hypot(lx, ly, lz); lx /= ll; ly /= ll; lz /= ll;
      let n0 = N[0], n1 = N[1], n2 = N[2];
      if (n0 * vx + n1 * vy + n2 * vz < 0) { n0 = -n0; n1 = -n1; n2 = -n2; }
      let hx = vx + lx, hy = vy + ly, hz = vz + lz; const hl = Math.hypot(hx, hy, hz); hx /= hl; hy /= hl; hz /= hl;
      const nh = Math.max(0, n0 * hx + n1 * hy + n2 * hz), nl = Math.max(0, n0 * lx + n1 * ly + n2 * lz);
      const sp = k * Math.pow(nh, shin);                       // broad gloss lobe
      const o = (j * LGW + i) * 4;
      is.data[o] = tint[0]; is.data[o + 1] = tint[1]; is.data[o + 2] = tint[2]; is.data[o + 3] = Math.min(255, sp * 255);
      id.data[o] = 0; id.data[o + 1] = 6; id.data[o + 2] = 2; id.data[o + 3] = Math.min(255, kd * Math.pow(1 - nl, 1.4) * 255);
    }
    cs.putImageData(is, 0, 0); cd.putImageData(id, 0, 0);
  });
  const st: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'};
  return (
    <>
      <canvas ref={shade} width={LGW} height={LGH} style={st} />
      <canvas ref={spec} width={LGW} height={LGH} style={{...st, mixBlendMode: 'screen'}} />
    </>
  );
};

export const Card: React.FC<{
  src: string; back?: string; flip?: number; x: number; y: number; w: number; ar?: number; m: M;
  shine?: number; shadow?: number; radius?: number; dim?: number; ring?: number; zoom?: number; zo?: string; lit?: Lit; children?: React.ReactNode;
}> = ({src, back, flip = 0, x, y, w, ar = 838 / 600, m, shine, shadow = 1, radius = 0.045, dim = 0, ring = 0, zoom = 1, zo = '50% 30%', lit, children}) => {
  const h = w * ar;
  if (m.o <= 0.001) return null;
  const r = radius * w;
  const foil = foilOf(src), bfoil = back ? foilOf(back) : 'none';
  const T = CARD3D ? (foil === 'paper' ? 0.006 : 0.012) * w : 0; // card-stock thickness
  const face = (rot: number): React.CSSProperties => ({
    position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
    transform: `rotateY(${rot}deg) translateZ(${T / 2}px)`, borderRadius: r, overflow: 'hidden',
  });
  const ryF = m.ry + flip * 180;
  const N = CARD3D ? 6 : 0;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: tf(m), opacity: m.o,
      transformStyle: 'preserve-3d', filter: m.blur > 0.05 ? `blur(${m.blur}px)` : undefined}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${flip * 180}deg)`}}>
        {/* shadow plate */}
        {(back ? [0, 180] : [0]).map((rot) => (
          <div key={rot} style={{position: 'absolute', inset: 0, borderRadius: r, transform: `rotateY(${rot}deg) translateZ(${-T / 2 - 1}px)`, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            boxShadow: `${w * 0.012}px ${w * 0.05}px ${w * 0.12}px rgba(0,0,0,${0.5 * shadow}), ${w * 0.004}px ${w * 0.012}px ${w * 0.03}px rgba(0,0,0,${0.38 * shadow})`}} />
        ))}
        {/* card-stock edge: stacked slices between the faces */}
        {Array.from({length: N}, (_, k) => {
          const z = -T / 2 + (T * (k + 0.5)) / N;
          const c = foil === 'paper' ? [236, 232, 222] : k === Math.floor(N / 2) ? [40, 40, 44] : [214, 209, 198];
          return <div key={'e' + k} style={{position: 'absolute', inset: 0, borderRadius: r, transform: `translateZ(${z}px)`, background: `rgb(${c.join(',')})`}} />;
        })}
        <div style={face(0)}>
          <Img src={asset(src)} style={{width: '100%', height: '100%', display: 'block', objectFit: 'cover', transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: zo}} />
          {CARD3D && <FaceLight rx={m.rx} ry={ryF} foil={foil} />}
          {shine !== undefined && <Shine p={shine} />}
          {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(4,14,6,${dim})`}} />}
          {lit && <LightFace x={x} y={y} w={w} h={h} m={m} extraY={flip * 180} lit={lit} />}
        </div>
        {back && (
          <div style={face(180)}>
            <Img src={asset(back)} style={{width: '100%', height: '100%', display: 'block', transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: zo}} />
            {CARD3D && <FaceLight rx={-m.rx} ry={ryF - 180} foil={bfoil} />}
            {shine !== undefined && <Shine p={shine} />}
            {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(4,14,6,${dim})`}} />}
            {lit && <LightFace x={x} y={y} w={w} h={h} m={m} extraY={flip * 180 + 180} lit={lit} />}
          </div>
        )}
      </div>
      {ring > 0.01 && <div style={{position: 'absolute', inset: -w * 0.018, borderRadius: r * 1.3, border: `${Math.max(3, w * 0.022)}px solid rgba(244,197,66,${ring})`,
        boxShadow: `0 0 ${w * 0.12}px rgba(244,197,66,${0.55 * ring})`, transform: 'translateZ(1px)'}} />}
      {children}
    </div>
  );
};

/** Diagonal light sweep, p: 0→1 across the card. */
export const Shine: React.FC<{p: number}> = ({p}) => {
  if (p <= 0 || p >= 1) return null;
  const x = lerp(-120, 220, p);
  return (
    <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none',
      background: `linear-gradient(115deg, transparent ${x - 30}%, rgba(255,250,225,0.0) ${x - 18}%, rgba(255,250,225,0.65) ${x}%, rgba(255,250,225,0.0) ${x + 18}%, transparent ${x + 30}%)`}} />
  );
};

/** Red stitched title label + optional subtitle bar (subs can swap over time). */
let _ctx: CanvasRenderingContext2D | null = null;
export const textW = (txt: string, size: number, weight = 900) => {
  if (typeof document === 'undefined') return txt.length * size * 0.66;
  _ctx = _ctx ?? document.createElement('canvas').getContext('2d');
  _ctx!.font = `700 ${size}px ${FONT}`;
  return _ctx!.measureText(txt).width;
};
/** largest size ≤ want so that text (+letterspacing, +padding) fits maxW */
export const fitSize = (txt: string, want: number, maxW: number, padEm: number, ls: number) => {
  const w = textW(txt, want) + ls * txt.length + padEm * want;
  return w <= maxW ? want : want * (maxW / w);
};

export const Label: React.FC<{
  t: number; text: React.ReactNode; tIn: number; subs?: {t: number; text: string}[]; y?: number; size?: number;
  out?: Partial<M>; m?: Partial<M>; fit?: string;
}> = ({t, text, tIn, subs = [], y = 250, size: want = 118, out = {}, m = {}, fit}) => {
  if (t < tIn) return null;
  const size = fitSize(fit ?? (typeof text === 'string' ? text : 'XXXXXXXX'), want, 1000, 0.62, 1.5);
  const pBox = ramp(t, tIn, 0.5, E.outExpo);
  const pTxt = ramp(t, tIn + 0.06, 0.5, E.outQuart);
  const base = add(out, m);
  const subH = size * 0.56;
  // which sub is active
  let curI = -1;
  subs.forEach((s, i) => { if (t >= s.t) curI = i; });
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center',
      transform: tf(base), opacity: base.o}}>
      <div style={{position: 'relative', background: RED, padding: `${size * 0.05}px ${size * 0.24}px ${size * 0.02}px`,
        transform: `scaleX(${lerp(0.82, 1, pBox)}) scaleY(${lerp(0.6, 1, pBox)})`, opacity: clamp(pBox * 2.2),
        boxShadow: '0 10px 30px rgba(0,0,0,.35)'}}>
        <div style={{position: 'absolute', inset: size * 0.065, border: `${Math.max(3, size * 0.03)}px dashed rgba(255,255,255,0.95)`, borderRadius: 2}} />
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: 'white', letterSpacing: lerp(10, 1.5, pTxt),
          whiteSpace: 'nowrap', transform: `translateY(${18 * (1 - pTxt)}px)`, opacity: pTxt, filter: `blur(${6 * (1 - pTxt)}px)`}}>
          {text}
        </div>
      </div>
      <div style={{position: 'relative', height: subH * 1.5, marginTop: size * 0.1, width: '100%', display: 'flex', justifyContent: 'center'}}>
        {subs.map((s, i) => {
          if (t < s.t) return null;
          const sz = fitSize(s.text, subH, 1000, 0.75, 1.2);
          const pin = ramp(t, s.t, 0.45, E.outQuart);
          const nextT = subs[i + 1]?.t;
          const pout = nextT !== undefined ? ramp(t, nextT, 0.3, E.inCubic) : 0;
          if (pout >= 1) return null;
          return (
            <div key={i} style={{position: 'absolute', top: (subH - sz) * 0.5, background: RED, border: '3px solid rgba(255,255,255,0.95)',
              padding: `${sz * 0.06}px ${sz * 0.3}px 0`, opacity: clamp(pin * 1.6) * (1 - pout),
              transform: `translateY(${22 * (1 - pin) - 30 * pout}px) scaleX(${lerp(0.9, 1, pin)})`, boxShadow: '0 8px 24px rgba(0,0,0,.3)'}}>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: sz, lineHeight: 1.18, color: 'white', whiteSpace: 'nowrap',
                letterSpacing: lerp(6, 1.2, pin), opacity: ramp(t, s.t + 0.05, 0.35)}}>{s.text}</div>
            </div>
          );
        })}
      </div>
      {curI === -2 && null}
    </div>
  );
};

/** Small pill tag. */
export const Chip: React.FC<{t: number; tIn: number; text: string; x: number; y: number; tone?: 'dark' | 'gold' | 'red' | 'white'; size?: number; m?: Partial<M>; swap?: {t: number; text: string; tone?: 'dark' | 'gold' | 'red' | 'white'}; anchor?: 'center' | 'left'}> =
  ({t, tIn, text, x, y, tone = 'dark', size = 34, m = {}, swap, anchor = 'center'}) => {
    if (t < tIn) return null;
    const p = spr(t, tIn, 2.1, 0.62);
    const base = add({s: lerp(0.5, 1, p), o: clamp((t - tIn) / 0.12)}, m);
    let txt = text; let tn = tone; let sw = 1;
    if (swap && t >= swap.t - 0.12) {
      const a = ramp(t, swap.t - 0.12, 0.12, E.inQuad); const b = ramp(t, swap.t, 0.2, E.outQuad);
      sw = t < swap.t ? 1 - a : b; if (t >= swap.t) { txt = swap.text; tn = swap.tone ?? tone; }
    }
    const pal = {dark: ['rgba(6,18,8,0.88)', 'white', 'rgba(255,255,255,0.55)'], gold: [GOLD, '#2a1b00', 'rgba(255,255,255,0.7)'],
      red: [RED, 'white', 'rgba(255,255,255,0.85)'], white: ['white', INK, 'rgba(0,0,0,0.0)']}[tn];
    return (
      <div style={{position: 'absolute', left: x, top: y, transformOrigin: anchor === 'left' ? '0% 50%' : '50% 50%',
        transform: `translate(${anchor === 'left' ? '0' : '-50%'},-50%) ${tf(add(base))}`, opacity: base.o}}>
        <div style={{background: pal[0], color: pal[1], border: `2.5px solid ${pal[2]}`, borderRadius: size * 0.5, padding: `${size * 0.16}px ${size * 0.62}px ${size * 0.1}px`,
          fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: 1.5, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.35)',
          transform: `scaleY(${lerp(0.6, 1, sw)})`, opacity: sw}}>{txt}</div>
      </div>
    );
  };

/** Path that draws on (dashed by default), with arrow head. */
export const DrawPath: React.FC<{id: string; d: string; p: number; dashed?: boolean; color?: string; width?: number; head?: boolean; o?: number; len?: number}> =
  ({id, d, p, dashed = true, color = 'white', width = 7, head = true, o = 1, len = 2000}) => {
    if (p <= 0 || o <= 0) return null;
    return (
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o}}>
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse">
            <path d={d} stroke="white" strokeWidth={width * 3} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} pathLength={len} />
          </mask>
          <marker id={id + 'h'} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={color} />
          </marker>
        </defs>
        <path d={d} mask={`url(#${id})`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round"
          strokeDasharray={dashed ? `${width * 2.6} ${width * 2.2}` : undefined} style={{filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.4))'}} />
        {head && p > 0.97 && (
          <path d={d} stroke="none" fill="none" markerEnd={`url(#${id}h)`} strokeWidth={width} style={{opacity: ramp(p, 0.97, 0.03)}} />
        )}
      </svg>
    );
  };

/** Corner brackets that draw around a rect (focus frame). */
export const Focus: React.FC<{x: number; y: number; w: number; h: number; p: number; o?: number; color?: string}> = ({x, y, w, h, p, o = 1, color = 'white'}) => {
  if (p <= 0) return null;
  const L = Math.min(w, h) * 0.22 * E.outQuart(clamp(p));
  const s = lerp(1.18, 1, E.outQuart(clamp(p)));
  const cx = x + w / 2; const cy = y + h / 2;
  const W = w * s; const H = h * s;
  const x0 = cx - W / 2; const y0 = cy - H / 2; const x1 = cx + W / 2; const y1 = cy + H / 2;
  const d = `M${x0},${y0 + L} L${x0},${y0} L${x0 + L},${y0} M${x1 - L},${y0} L${x1},${y0} L${x1},${y0 + L} M${x1},${y1 - L} L${x1},${y1} L${x1 - L},${y1} M${x0 + L},${y1} L${x0},${y1} L${x0},${y1 - L}`;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o * clamp(p * 3)}}>
      <path d={d} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 3px 8px rgba(0,0,0,.5))'}} />
    </svg>
  );
};

/** Emphasis envelope: 1 inside [a,b] with eased ramps. */
export const spot = (t: number, a: number, b: number, rIn = 0.3, rOut = 0.3) =>
  ramp(t, a, rIn, E.inOutCubic) * (1 - ramp(t, b, rOut, E.inOutCubic));

/** Tilted badge stuck to a card corner. */
export const Stamp: React.FC<{t: number; tIn: number; text: string; x: number; y: number; m?: Partial<M>; rot?: number; size?: number; tone?: 'red' | 'gold'}> =
  ({t, tIn, text, x, y, m = {}, rot = -12, size = 34, tone = 'red'}) => {
    if (t < tIn) return null;
    const p = popIn(t, tIn, {from: 2.2, f: 2.6, z: 0.5});
    const b = add(m);
    return (
      <div style={{position: 'absolute', left: x + b.x, top: y + b.y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p.s})`, opacity: (p.o ?? 1) * b.o}}>
        <div style={{background: tone === 'red' ? BOX_RED : GOLD, color: tone === 'red' ? 'white' : '#2a1b00', fontFamily: FONT, fontWeight: 700, fontSize: size, padding: `${size * 0.22}px ${size * 0.62}px ${size * 0.1}px`,
          border: `${size * 0.12}px solid white`, borderRadius: size * 0.3, letterSpacing: 2, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.45)'}}>{text}</div>
      </div>
    );
  };

/** Magnifier callout: dashed leader lines from a point on a card to a zoom circle showing that detail. */
export const Magnifier: React.FC<{
  id: string; t: number; tIn: number; tOut: number; src: string;
  card: {x: number; y: number; w: number; m: M}; u: number; v: number; cx: number; cy: number; r?: number; zoom?: number;
}> = ({id, t, tIn, tOut, src, card, u, v, cx, cy, r = 140, zoom = 3}) => {
  if (t < tIn || t > tOut + 0.5) return null;
  const k = card.w / 600;
  const px = card.x - card.w / 2 + u * k + card.m.x;
  const py = card.y - (card.w * 838 / 600) / 2 + v * k + card.m.y;
  const pRing = spr(t, tIn, 2.4, 0.6);
  const pLine = ramp(t, tIn + 0.08, 0.38, E.outCubic);
  const pCirc = spr(t, tIn + 0.26, 1.9, 0.6);
  const out = ramp(t, tOut, 0.32, E.inBack);
  const o = 1 - ramp(t, tOut + 0.12, 0.2, E.linear);
  const dx = px - cx; const dy = py - cy; const d = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx); const bb = Math.acos(Math.min(1, r / d));
  const T1 = [cx + r * Math.cos(a + bb), cy + r * Math.sin(a + bb)];
  const T2 = [cx + r * Math.cos(a - bb), cy + r * Math.sin(a - bb)];
  const pr = 26;
  const sc = Math.max(0, pCirc) * (1 - out);
  const drift = 0.06 * ramp(t, tIn + 0.3, tOut - tIn, E.inOutSine); // slow push inside the lens
  const z = zoom * (1 + drift);
  return (
    <>
      <DrawPath id={id + 'a'} d={`M ${px} ${py} L ${T1[0]} ${T1[1]}`} p={pLine * (1 - out)} head={false} width={5} o={o} len={1000} />
      <DrawPath id={id + 'b'} d={`M ${px} ${py} L ${T2[0]} ${T2[1]}`} p={pLine * (1 - out)} head={false} width={5} o={o} len={1000} />
      <div style={{position: 'absolute', left: px - pr, top: py - pr, width: pr * 2, height: pr * 2, borderRadius: '50%', border: '5px solid white',
        transform: `scale(${pRing * (1 - out)})`, opacity: o, boxShadow: '0 0 0 3px rgba(0,0,0,.25), 0 4px 10px rgba(0,0,0,.4)'}} />
      <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, transform: `scale(${sc})`, opacity: o}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: '#111', boxShadow: '0 16px 40px rgba(0,0,0,.55)'}}>
          <Img src={staticFile(`a/${src}`)} style={{position: 'absolute', width: 600 * z, height: 838 * z, left: r - u * z, top: r - v * z, maxWidth: 'none'}} />
        </div>
        <div style={{position: 'absolute', inset: -10, borderRadius: '50%', border: '7px solid white'}} />
        <div style={{position: 'absolute', inset: -26, borderRadius: '50%', border: '4px dashed rgba(255,255,255,0.8)', transform: `rotate(${t * 18}deg)`}} />
      </div>
    </>
  );
};

/* ───────────── Title lockup (v2): persistent, equal-width boxes, text rolls in place ───────────── */
export type Cue = {t: number; text: string; live?: (t: number) => string};
const LOCK_W = 770, LOCK_TH = 175, LOCK_SH = 99, LOCK_GAP = 21;
export const LOCK_TOP = 243;
export const LOCK_BOTTOM = LOCK_TOP + LOCK_TH + LOCK_GAP + LOCK_SH; // 538

const curCue = (cues: Cue[], t: number) => {
  let i = -1;
  for (let k = 0; k < cues.length; k++) if (t >= cues[k].t) i = k;
  return i;
};

const Roll: React.FC<{cues: Cue[]; t: number; h: number; maxSize: number; padX: number}> = ({cues, t, h, maxSize, padX}) => {
  const i = curCue(cues, t);
  if (i < 0) return null;
  const DUR = 0.52;
  const p = (t - cues[i].t) / DUR;
  const items: React.ReactNode[] = [];
  const line = (c: Cue, y: number, o: number, key: string, blur: number) => {
    const size = Math.min(maxSize, fitSize(c.text, maxSize, LOCK_W - padX * 2, 0, maxSize * 0.012));
    return (
      <div key={key} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${y}px)`, opacity: o, filter: blur > 0.1 ? `blur(${blur}px)` : undefined}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1, color: 'white', whiteSpace: 'nowrap',
          letterSpacing: size * 0.012, transform: `translateY(${size * 0.1}px)`}}>{c.live ? c.live(t) : c.text}</div>
      </div>
    );
  };
  if (i > 0 && p < 1) {
    const q = E.inCubic(clamp(p / 0.4));
    items.push(line(cues[i - 1], -h * 1.05 * q, 1, 'prev', 6 * q));
  }
  const q2 = E.outQuart(clamp((p - (i > 0 ? 0.24 : 0)) / (i > 0 ? 0.76 : 1)));
  items.push(line(cues[i], h * 1.05 * (1 - q2), clamp(q2 * 3), 'cur', 6 * (1 - q2)));
  return <>{items}</>;
};

export const Lockup: React.FC<{t: number; titles: Cue[]; subs: Cue[]; tIn: number; subIn: number; tOut: number}> = ({t, titles, subs, tIn, subIn, tOut}) => {
  if (t < tIn) return null;
  const pBox = ramp(t, tIn, 0.5, E.outExpo);
  const pSub = ramp(t, subIn, 0.45, E.outExpo);
  const out = whipOut(t, tOut, 'top', {dist: 900, dur: 0.42});
  const ti = curCue(titles, t);
  const kick = ti > 0 ? Math.sin(Math.PI * clamp((t - titles[ti].t) / 0.4)) : 0;
  const si = curCue(subs, t);
  const kick2 = si > 0 ? Math.sin(Math.PI * clamp((t - subs[si].t) / 0.4)) : 0;
  const box = (h: number): React.CSSProperties => ({position: 'relative', width: LOCK_W, height: h, background: BOX_RED, border: '3px solid white',
    boxSizing: 'border-box', overflow: 'hidden'});
  return (
    <div style={{position: 'absolute', left: (1080 - LOCK_W) / 2, top: LOCK_TOP, width: LOCK_W, transform: tf(add(out)), opacity: out.o ?? 1}}>
      <div style={{...box(LOCK_TH), transform: `scaleX(${lerp(0.0, 1, pBox) * (1 + 0.025 * kick)}) scaleY(${1 + 0.04 * kick})`, opacity: clamp(pBox * 4)}}>
        <Roll cues={titles} t={t} h={LOCK_TH} maxSize={158} padX={44} />
      </div>
      <div style={{height: LOCK_GAP}} />
      {t >= subIn && (
        <div style={{...box(LOCK_SH), transformOrigin: '50% 0%', transform: `scaleY(${pSub}) scaleX(${1 + 0.02 * kick2})`, opacity: clamp(pSub * 4)}}>
          <Roll cues={subs} t={t} h={LOCK_SH} maxSize={66} padX={18} />
        </div>
      )}
    </div>
  );
};

/** Scene push: outgoing elements accelerate off to the left (stagger by order). */
export const pushOut = (t: number, T: number, order = 0): Partial<M> => whipOut(t, T + order * 0.035, 'left', {dur: 0.5, dist: 1400});
