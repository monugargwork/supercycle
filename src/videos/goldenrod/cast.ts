// The Gengar reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, SHo, RDo, RNo, POo, JUo, clamp01, smooth, easeOut, glide, SHOPP, ROADP, RENTP, POLP, JUSP, vanAt,
  WIND1, HOLD1, SMASH1, ENTER1, LIFT2, SNAP2, STRIKE4, TAKE5, WALK5, TILL5, SQUEEZE6, SNAP6, DOORS6, WALKA7, WALKC7, PLATE7, CROW9,
  TAP10, FLASH10, WAVE10, SIGN12, STAMP12, LICENCE13, LOOKS13, SHUFFLE13, DUCK15, RING15, TURN15, PINS16, PIN17, WALK20, LIFT20, DING20,
  SLAM21, ARREST21, WANTED21, FILE24, SHUT24, ROADP as RP,
} from "./story";
import * as art2 from "./art2";
import { LOOKS } from "./looks";
import { NOINK } from "../../engine/ink";
import { cardShade, blobMaterial, CARD_K } from "../../engine/cardshade";

// ---------------- canvas pool ----------------
type Entry = { cv: HTMLCanvasElement; tex: THREE.CanvasTexture; w: number; h: number };
export type Req = { key: string; w: number; h: number; k: number; draw: (p: Pen) => void; tex?: THREE.CanvasTexture };
const makeEntry = (w: number, h: number): Entry => {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return { cv, tex, w, h };
};
export class Pool {
  private live = new Map<string, Entry>();
  private free: Entry[] = [];
  private reqs: Req[] = [];
  req(key: string, w: number, h: number, k: number, draw: (p: Pen) => void) {
    const r: Req = { key: `${w}x${h}|${key}`, w, h, k, draw };
    this.reqs.push(r);
    return r;
  }
  flush() {
    const want = new Map<string, Req[]>();
    for (const r of this.reqs) { const l = want.get(r.key); if (l) l.push(r); else want.set(r.key, [r]); }
    for (const [key, e] of this.live) if (!want.has(key)) { this.live.delete(key); this.free.push(e); }
    for (const [key, rs] of want) {
      let e = this.live.get(key);
      if (!e) {
        const r = rs[0], i = this.free.findIndex((x) => x.w === r.w && x.h === r.h);
        e = i >= 0 ? this.free.splice(i, 1)[0] : makeEntry(r.w, r.h);
        const g = e.cv.getContext("2d")!;
        g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, e.w, e.h); g.setTransform(r.k, 0, 0, r.k, 0, 0);
        r.draw(new Pen(g));
        e.tex.needsUpdate = true;
        this.live.set(key, e);
      }
      for (const r of rs) r.tex = e.tex;
    }
    this.reqs = [];
  }
}

// ---------------- meshes ----------------
const blank = (() => { const c = document.createElement("canvas"); c.width = c.height = 2; return new THREE.CanvasTexture(c); })();
export const SU = 0.00216; // metres per design unit (1000 units = 2.16 m)
const BODY = (() => { const g = new THREE.PlaneGeometry(600 * SU, 1000 * SU); g.translate(0, (975 - 500) * SU, 0); return g; })();
const CARD = new THREE.PlaneGeometry(1, 1);
export class Actor {
  mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; dmat: THREE.MeshDepthMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D) {
    this.mat = cardShade(new THREE.MeshLambertMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide }));
    this.dmat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(BODY, this.mat);
    this.mesh.customDepthMaterial = this.dmat;
    this.mesh.onBeforeRender = (r) => { const rt = r.getRenderTarget(); CARD_K.uPx.value = (rt ? rt.height : r.domElement.height) / 1920; };
    this.mesh.castShadow = false; this.mesh.receiveShadow = true; this.mesh.visible = false;
    this.mesh.rotation.order = "YXZ"; this.mesh.renderOrder = 1; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  bind() { const t = this.r?.tex; if (t) { this.mat.map = t; this.dmat.map = t; } }
}
export class Fx {
  mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; soft: THREE.MeshBasicMaterial; blob: THREE.MeshBasicMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D) {
    this.mat = new THREE.MeshBasicMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.soft = new THREE.MeshBasicMaterial({ map: blank, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.blob = blobMaterial(blank);
    this.mesh = new THREE.Mesh(CARD, this.mat);
    this.mesh.visible = false; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  use(soft: boolean) { this.mesh.material = soft ? this.soft : this.mat; }
  bind() {
    const t = this.r?.tex;
    if (!t) return;
    if (this.r!.key.includes("|blob|")) {
      if (t.generateMipmaps) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; }
      this.blob.map = t; this.mesh.material = this.blob; this.mesh.renderOrder = 0.5;
    } else { this.mat.map = t; this.soft.map = t; this.mesh.renderOrder = 2; }
  }
}

// ---------------- placements ----------------
export type Place = { key: string; draw: (p: Pen) => void; x: number; y: number; z: number; scale?: number; mirror?: boolean; yaw?: number; size?: [number, number, number] };
/** effect card: billboard by default; flat = lying on the ground (rot about the normal); face = fixed vertical card with that yaw */
export type FxPlace = { key: string; cw: number; ch: number; draw: (p: Pen) => void; x: number; y: number; z: number; w: number; h: number;
  flat?: boolean; rot?: number; soft?: boolean; face?: number; tilt?: number;
  /** ribbon between two world points, turned about its own axis to face the camera (true 3D, so perspective is right) */
  axis?: [V3, V3] };
export type CamInfo = { pos: THREE.Vector3; right: THREE.Vector3; fwd: THREE.Vector3; up: THREE.Vector3; sun: THREE.Vector3 };
/** moving set pieces the cast drives: the attendant's cushion, the block of 100 cards, the loupe
 */
export type PropK = { p: number[]; ry?: number; rx?: number; rz?: number; vis?: boolean };
/** props: set-LOCAL positions of the moving set pieces (hero box, crown, chair, yacht, diamond, watch, kitchen box, bottle, bowl) */
export type Stage = { places: Place[]; fx: FxPlace[]; props: Record<string, PropK> };

const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const q = (v: number, n = 120) => Math.round(v * n) / n;
const tier = (d: number): [number, number, number] =>
  d < 3.2 ? [1800, 3000, 3.0] : d < 6.5 ? [1080, 1800, 1.8] : d < 16 ? [480, 800, 0.8] : [240, 400, 0.4];
let LNAME: "day" | "golden" | "night" = "day";
const light2D = (cam: CamInfo, mirror: boolean) => {
  const sx = cam.sun.dot(cam.right) * (mirror ? -1 : 1), sy = -cam.sun.y;
  return Math.round(Math.atan2(sy, sx) / (Math.PI / 4)) * (Math.PI / 4);
};
const LID = [0.5, 1, 1, 0.5];
const lidAt = (f: number, i: number, swaps: number[] = []) => {
  for (const fs of swaps) { const k = f - fs + 3; if (k >= 0 && k < 4) return LID[k]; }
  let s = Math.round(-60 * hh(i, 9));
  for (let n = 0; s <= f && n < 400; n++) {
    const k = f - s;
    if (k >= 0 && k < 4) return LID[k];
    s += Math.round(15 + 54 * hh(i * 31 + n, 13));
  }
  return 0;
};
const fkey = (o: object) => JSON.stringify(o, (_k, v) => (typeof v === "number" ? q(v) : v));

// ---------------- the cast ----------------
const C = LOOKS;
type Who = keyof typeof C;
const IDX: Record<Who, number> = { A: 3, B: 4, C: 5, D: 6, clerk: 7, det: 8, sarge: 9, cop: 10 };

/** front-facing person at (x, y, z) */
const front = (out: Stage, cam: CamInfo, who: Who, x: number, y: number, z: number, fo: FrontOpts, f: number, swaps: number[] = [], mirror = false) => {
  const i = IDX[who], d = cam.pos.distanceTo(new THREE.Vector3(x, y + 1.2, z)), [w, h, k] = tier(d);
  const f2: FrontOpts = { blink: lidAt(f, i, swaps), ...fo, light: light2D(cam, mirror), seed: i + 1 };
  out.places.push({ key: `F|${who}|${fkey(f2)}`, x, y, z, mirror, size: [w, h, k], draw: (p) => bodyFront(p, C[who], f2) });
  blob(out, x, y, z);
};
/** side view walking/standing along world direction (dx, dz) */
const side = (out: Stage, cam: CamInfo, who: Who, x: number, y: number, z: number, dx: number, dz: number, so: SideOpts, f: number) => {
  const i = IDX[who], d = cam.pos.distanceTo(new THREE.Vector3(x, y + 1.2, z)), [w, h, k] = tier(d);
  const mirror = dx * cam.right.x + dz * cam.right.z < 0;
  const s2: SideOpts = { blink: lidAt(f, i), ...so, light: light2D(cam, mirror), seed: i + 1 };
  out.places.push({ key: `S|${who}|${fkey(s2)}`, x, y, z, mirror, size: [w, h, k], draw: (p) => bodySide(p, C[who], s2) });
  blob(out, x, y, z);
};
/** walking speed 1.6 m/s per stride unit at 2 steps/s */
const walkPhase = (f: number, rate = 1) => (((f / FPS) * rate) % 1 + 1) % 1;

const CONTACT: Record<"day" | "golden" | "night", [number, number, number]> = { day: [0.2, 0.21, 0.33], golden: [0.24, 0.2, 0.33], night: [0.12, 0.13, 0.22] };
const TAIL: [number, number, number] = [0.42, 0.44, 0.62];
const toSrgb = (v: number) => { const c = clamp01(v); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const hexOf = (c: [number, number, number], k: number) => "#" + c.map((v) => Math.round(255 * toSrgb(1 - (1 - v) * k)).toString(16).padStart(2, "0")).join("");
let SUN = new THREE.Vector3(0.5, 0.75, -0.4);
const blob = (out: Stage, x: number, y: number, z: number, sc = 1) => {
  const hl = Math.hypot(SUN.x, SUN.z) || 1, ox = -SUN.x / hl, oz = -SUN.z / hl, rot = Math.atan2(-ox, -oz);
  if (LNAME === "day" && false) { // indoors: no long sun tails, only the contact shadow
    const el = Math.asin(Math.min(0.99, Math.max(0.1, SUN.y)));
    const len = Math.min(2.4, Math.max(0.5, 1.6 / Math.tan(el))) * sc, h = len + 0.55 * sc, c = 0.3 * h, tc = hexOf(TAIL, 1);
    out.fx.push({ key: `blob|shadow|${tc}`, cw: 128, ch: 256, draw: (p) => fxShadow(p, tc), x: x + ox * c, y: y + 0.018, z: z + oz * c, w: 0.72 * sc, h, flat: true, rot });
  }
  const cc = hexOf(CONTACT[LNAME], 1);
  out.fx.push({ key: `blob|contact|${cc}`, cw: 128, ch: 128, draw: (p) => fxContact(p, cc), x: x + ox * 0.03, y: y + 0.022, z: z + oz * 0.03, w: 0.52 * sc, h: 0.4 * sc, flat: true, rot });
};

// ---------------- effect helpers ----------------
const burst = (out: Stage, f: number, f0: number, x: number, y: number, z: number, s = 1, n = 8, col = "#fff3b0") => {
  if (f < f0 || f >= f0 + n) return;
  const u = q((f - f0) / n, 30);
  out.fx.push({ key: `burst${u}${col}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, u, col), x, y, z, w: s, h: s });
};
const sparkle = (out: Stage, f: number, f0: number, x: number, y: number, z: number, s = 0.6, n = 14) => {
  if (f < f0 || f >= f0 + n) return;
  const u = q((f - f0) / n, 30);
  out.fx.push({ key: `spk${u}`, cw: 400, ch: 400, draw: (p) => art.sparkle(p, u), x, y, z, w: s, h: s });
};
const card = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, x: number, y: number, z: number, w: number, h: number, extra: Partial<FxPlace> = {}) =>
  out.fx.push({ key, cw, ch, draw, x, y, z, w, h, ...extra });
const faceTo = (cam: CamInfo, x: number, z: number) => Math.atan2(cam.pos.x - x, cam.pos.z - z);
// ---- stick limbs in the 3D world: an arm that really reaches an object (the card's own arm is switched off with armOff) ----
/** world position of a front card's design-unit point (card standing at x, y, z, facing the camera) */
const cardWorld = (cam: CamInfo, x: number, y: number, z: number, [u, v]: [number, number]): V3 => {
  const yaw = Math.atan2(cam.pos.x - x, cam.pos.z - z), X = (u - 300) * SU, Y = (975 - v) * SU;
  return [x + X * Math.cos(yaw), y + Y, z - X * Math.sin(yaw)];
};
const v3 = (a: V3) => new THREE.Vector3(...a);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const add3 = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
/** one straight limb segment A -> B as a camera-facing line card (plain line, round ends; optional ink knob at B: the hand) */
const seg3d = (out: Stage, cam: CamInfo, A: V3, B: V3, wM: number, col: string, knobM = 0) => {
  const E = cam.pos, Fw = cam.fwd, M = v3(lerp3(A, B, 0.5)), dM = M.clone().sub(E).dot(Fw);
  const onPlane = (P: V3) => { const d = v3(P).sub(E), t = dM / d.dot(Fw); return E.clone().add(d.multiplyScalar(t)); };
  const a = onPlane(A), b = onPlane(B), d = b.clone().sub(a), dx = d.dot(cam.right), dy = d.dot(cam.up), L = Math.hypot(dx, dy);
  const hM = Math.max(wM, knobM), W = L + hM, ch = 48, cw = Math.max(48, Math.min(2048, Math.round((W / hM) * ch)));
  const draw = (p: Pen) => {
    const r = ch / 2, lw = (wM / hM) * ch;
    p.stroke([[r, r], [cw - r, r]], lw, col);
    if (knobM) p.dot(cw - r, r, r * 0.98);
  };
  const mid = a.clone().add(b).multiplyScalar(0.5);
  card(out, `limb|${cw}|${col}|${knobM > 0}`, cw, ch, draw, mid.x, mid.y, mid.z, W, hM, { rot: Math.atan2(dy, dx) });
};
/** a stick arm of FIXED length from the card's shoulder to a world point (two equal bones, the elbow bends outward/down).
 *  A target out of reach is never stretched to: the arm points at it and falls short (staging must move the body closer). */
const armLen = (who: Who) => { const J = frontPts(C[who], { seed: IDX[who] + 1 }); return 0.95 * J.HH * SU; };
const shoulderAt = (cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: number) => { const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }); return cardWorld(cam, at[0], at[1], at[2], J.shoulder(side)); };
const arm3d = (out: Stage, cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: -1 | 1, hand: V3, f = 0) => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), S = cardWorld(cam, at[0], at[1], at[2], J.shoulder(side)), L = armLen(who);
  const v = v3(hand).sub(v3(S)), d = v.length();
  let H = hand;
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[goldenrod] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
  const dd = Math.min(d, L - 1e-3), h = Math.sqrt(Math.max(0, (L / 2) ** 2 - (dd / 2) ** 2));
  const dir = v.clone().normalize(), bend = cam.right.clone().multiplyScalar(side).add(new THREE.Vector3(0, -0.6, 0));
  bend.addScaledVector(dir, -bend.dot(dir)); if (bend.lengthSq() < 1e-6) bend.set(0, -1, 0); bend.normalize();
  const m = lerp3(S, H, 0.5), El: V3 = [m[0] + bend.x * h, m[1] + bend.y * h, m[2] + bend.z * h];
  seg3d(out, cam, S, El, J.armW * SU, J.armCol); seg3d(out, cam, El, H, J.armW * SU, J.armCol, J.hand * 2 * SU);
  return H;
};
/** where the card's hand rests (arm hanging) and a hold point beside its belly, in the world */
const restHand = (cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: number): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [sx, sy] = J.shoulder(side);
  return cardWorld(cam, at[0], at[1], at[2], [sx + side * 6 * J.u, sy + 0.9 * J.HH]);
};
const holdHand = (cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: number, toLens = 0.08): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [sx, sy] = J.shoulder(side);
  const w = cardWorld(cam, at[0], at[1], at[2], [sx + side * 16 * J.u, sy + 0.62 * J.HH]);
  return [w[0] - cam.fwd.x * toLens, w[1], w[2] - cam.fwd.z * toLens];
};
/** a point in front of the card's chest (both hands meet here to carry something) */
const chestAt = (cam: CamInfo, who: Who, at: V3, fo: FrontOpts, drop = 0.45, toLens = 0.16): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [, sy] = J.shoulder(1);
  const w = cardWorld(cam, at[0], at[1], at[2], [300, sy + drop * J.HH]);
  return [w[0] - cam.fwd.x * toLens, w[1], w[2] - cam.fwd.z * toLens];
};
const glowAt = (out: Stage, key: string, p: V3, s: number, col = "255,214,120") => out.fx.push({ key: "glow" + key + col, cw: 128, ch: 128, draw: (pp) => art.glow(pp, col), x: p[0], y: p[1], z: p[2], w: s, h: s, soft: true });
const tcardFx = (out: Stage, key: string, p: V3, h: number, o: { bent?: number; holo?: boolean; scuff?: boolean; k?: number; rot?: number; img?: string } = {}) =>
  card(out, `tc|${key}|${q(o.bent ?? 0, 10)}|${!!o.holo}|${!!o.scuff}|${o.img ?? ""}`, 260, 360, (pp) => art.tcard(pp, (o.k ?? 0) as art.Kind, 10, 10, 250, 350, o), p[0], p[1], p[2], h * 0.72, h, { rot: o.rot ?? 0 });

// ---------------- per-shot staging ----------------
const Sm = (x: number, y: number, z: number) => at(SHo, x, y, z);
const Rm = (x: number, y: number, z: number) => at(RDo, x, y, z);
const Nm = (x: number, y: number, z: number) => at(RNo, x, y, z);
const Pm = (x: number, y: number, z: number) => at(POo, x, y, z);
const Jm = (x: number, y: number, z: number) => at(JUo, x, y, z);
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const S = SHOPP, RN = RENTP, PO = POLP, J = JUSP;
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm3 = (a: V3): V3 => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
/** a held tool as a ribbon card from the grip (hand) along dir; len metres, thick metres; the canvas has the grip at its left end */
const tool = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, hand: V3, dir: V3, len: number, thick: number) => {
  const d = norm3(dir), b = add3(hand, d, len), m = lerp3(hand, b, 0.5);
  out.fx.push({ key, cw, ch, draw, x: m[0], y: m[1], z: m[2], w: len, h: thick, axis: [hand, b] });
  return b;
};
/** constant-speed walk along a polyline of [x, z] points between frames f0 and f1 */
const walkPath = (pts: number[][], f: number, f0: number, f1: number): { x: number; z: number; moving: boolean } => {
  const segs: number[] = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; }
  let s = clamp01((f - f0) / (f1 - f0)) * L;
  for (let i = 0; i < segs.length; i++) { if (s <= segs[i] || i === segs.length - 1) { const k = segs[i] ? Math.min(1, s / segs[i]) : 1; return { x: lerpN(pts[i][0], pts[i + 1][0], k), z: lerpN(pts[i][1], pts[i + 1][1], k), moving: f > f0 && f < f1 }; } s -= segs[i]; }
  return { x: pts[pts.length - 1][0], z: pts[pts.length - 1][1], moving: false };
};
const STEP_RATE = 2.2;

// ---------------- S01-S02: the smash and the entry ----------------
const DOOR_OUT = [0.0, 0.45], DOOR_IN = [0.05, -0.6];
const entryPath = (w: "A" | "B" | "C" | "D") => [S.hook[w], DOOR_OUT, DOOR_IN, S.inside[w]];
const ENTER_F: Record<string, [number, number]> = { A: [68, 92], B: [74, 100], C: [80, 106], D: [86, 112] };
const crewAt = (w: "A" | "B" | "C" | "D", f: number, id: number) => {
  if (id === 1 && f < ENTER_F[w][0]) { const h = S.hook[w]; return { x: h[0], z: h[1], moving: false }; }
  if (id === 1) return walkPath(entryPath(w), f, ...ENTER_F[w]);
  const m = S.inside[w]; return { x: m[0], z: m[1], moving: false };
};
const sledgeDraw = (p: Pen) => art2.sledge(p);
const hookCrew = (out: Stage, cam: CamInfo, f: number, id: number) => {
  (["A", "B", "C", "D"] as const).forEach((w) => {
    const c = crewAt(w, f, id), y = c.z > 0 ? S.sw_y : 0, P: V3 = Sm(c.x, y, c.z);
    if (near(cam, P, 0.6)) return;
    const strike = id === 1 && w === "A" && f < ENTER_F.A[0];
    const fo: FrontOpts = { mode: c.moving ? "march" : "stand", phase: c.moving ? walkPhase(f, STEP_RATE) : 0, expr: strike ? (f < SMASH1 && f >= WIND1[0] ? "pained" : f >= SMASH1 ? "grin" : "stern") : w === "B" && id === 2 && f >= SNAP2 ? "grin" : "stern", armOff: w === "A" || (w === "B" && id === 2) ? 2 : undefined, crouch: strike && f >= WIND1[0] && f < SMASH1 + 6 ? 0.12 : 0 };
    front(out, cam, w, ...P, fo, f, w === "A" ? [SMASH1] : []);
    if (w === "A") { // the sledgehammer: hanging, wound up over the shoulder, striking the glass
      const sh = shoulderAt(cam, "A", P, fo, 1), G = Sm(...(S.glass_hit as V3)), rest = restHand(cam, "A", P, fo, 1);
      let hand: V3, dir: V3;
      if (!strike || f < WIND1[0]) { hand = rest; dir = [0, -1, 0.15]; }
      else if (f < WIND1[1]) { const k = smooth(ramp(f, WIND1[0], WIND1[1])); hand = lerp3(rest, add3(sh, [0, 0.32, 0.12]), k); dir = norm3(lerp3([0, -1, 0.15], [0.05, 1, 0.6], k)); }
      else if (f < SMASH1 - 3) { hand = add3(sh, [0, 0.32, 0.12]); dir = [0.05, 1, 0.6]; }
      else { const k = f < SMASH1 ? (f - (SMASH1 - 3)) / 3 : 1, hit = add3(sh, norm3(sub3(G, sh)), 0.4); hand = lerp3(add3(sh, [0, 0.32, 0.12]), hit, k); dir = norm3(lerp3([0.05, 1, 0.6], sub3(G, hit), k)); if (f > SMASH1 + 6) { const k2 = smooth(ramp(f, SMASH1 + 6, SMASH1 + 16)); hand = lerp3(hit, rest, k2); dir = norm3(lerp3(sub3(G, hit), [0, -1, 0.15], k2)); } }
      const Hd = arm3d(out, cam, "A", P, fo, 1, hand, f); arm3d(out, cam, "A", P, fo, -1, add3(Hd, norm3(dir), 0.18), f);
      tool(out, "sledge", 500, 124, sledgeDraw, Hd, dir, 0.78, 0.19);
    }
    if (w === "B" && id === 2) { // bolt cutters, both hands at the grips, jaws up; they snap shut at SNAP2
      const ch = chestAt(cam, "B", P, fo, 0.35, 0.2), up2 = smooth(ramp(f, LIFT2[0], LIFT2[1])), grip = lerp3(add3(ch, [0, -0.25, 0]), ch, up2), open = f < LIFT2[1] ? up2 : f < SNAP2 ? 1 : f < SNAP2 + 3 ? 1 - (f - SNAP2) / 3 : 0;
      arm3d(out, cam, "B", P, fo, 1, add3(grip, cam.right.toArray() as V3, 0.06), f); arm3d(out, cam, "B", P, fo, -1, add3(grip, cam.right.toArray() as V3, -0.06), f);
      tool(out, `cut${q(open, 6)}`, 500, 120, (p) => art2.cutters(p, open), grip, norm3(lerp3([0, -1, 0], [0.15, 1, -0.3], up2)), 0.72, 0.17);
    }
  });
  if (id === 1 && f >= SMASH1 && f < SMASH1 + 8) { const G = Sm(...(S.glass_hit as V3)); burst(out, f, SMASH1, G[0], G[1], G[2] - 0.05, 0.42, 6, "#e8f6ff"); }
};

// ---------------- S04-S05: the cases ----------------
const TOOLS = { A: [500, 124, sledgeDraw, 0.78, 0.19], B: [430, 70, (p: Pen) => art2.crowbar(p), 0.62, 0.1], C: [340, 100, (p: Pen) => art2.clawHammer(p), 0.42, 0.12], D: [430, 70, (p: Pen) => art2.crowbar(p), 0.62, 0.1] } as const;
const caseCrew = (out: Stage, cam: CamInfo, f: number, id: number) => {
  (["A", "B", "C", "D"] as const).forEach((w, i) => {
    let mx = S.thief_x, mz = S.case_z[i], moving = false;
    if (id === 5 && w === "D") { const p = walkPath([[S.thief_x, S.case_z[3]], [S.thief_x, -6.7], [1.95, -6.7], [S.till[0], S.till[1]]], f, WALK5[0], WALK5[1]); mx = p.x; mz = p.z; moving = p.moving; }
    const P: V3 = Sm(mx, 0, mz), T = STRIKE4[i], target = Sm(S.case_x, S.case_top, S.case_z[i]);
    const fo: FrontOpts = { mode: moving ? "march" : "stand", phase: moving ? walkPhase(f, STEP_RATE) : 0, expr: id === 4 ? (f < T ? "pained" : "grin") : w === "D" && f >= TILL5 ? "laugh" : "stern", armOff: 2 };
    front(out, cam, w, ...P, fo, f, id === 4 ? [T] : []);
    const sh = shoulderAt(cam, w, P, fo, 1), rest = restHand(cam, w, P, fo, 1), restL = restHand(cam, w, P, fo, -1), [cw, chh, draw, len, thick] = TOOLS[w];
    if (id === 4) {
      const up3 = add3(sh, [0, 0.3, 0]), hit = add3(sh, norm3(sub3(target, sh)), 0.4);
      let hand = rest, dir: V3 = [0, -1, 0];
      if (f >= T - 8 && f < T - 2) { const k = smooth(ramp(f, T - 8, T - 2)); hand = lerp3(rest, up3, k); dir = norm3(lerp3([0, -1, 0], [0, 1, 0.2], k)); }
      else if (f >= T - 2 && f < T) { hand = lerp3(up3, hit, (f - T + 2) / 2); dir = norm3(lerp3([0, 1, 0.2], sub3(target, hit), (f - T + 2) / 2)); }
      else if (f >= T) { const k = smooth(ramp(f, T + 5, T + 14)); hand = lerp3(hit, rest, k); dir = norm3(lerp3(sub3(target, hit), [0, -1, 0], k)); }
      const Hd = arm3d(out, cam, w, P, fo, 1, hand, f); tool(out, "t" + w, cw, chh, draw, Hd, dir, len, thick);
      arm3d(out, cam, w, P, fo, -1, restL, f);
      if (f >= T && f < T + 8) burst(out, f, T, target[0], target[1] + 0.03, target[2], 0.55, 8, "#e8f6ff");
      return;
    }
    // S05: the tool in the left hand, the duffel slung at the hip; the right hand takes from the case into the bag
    const LH = arm3d(out, cam, w, P, fo, -1, restL, f); tool(out, "t" + w, cw, chh, draw, LH, [0, -1, 0.1], len, thick);
    const bag = add3(cardWorld(cam, P[0], P[1], P[2], [300, 700]), cam.right.toArray() as V3, 0.18), win = (TAKE5 as Record<string, number[]>)[w];
    let fill = 0;
    if (win) {
      const [t0, t1] = win, mid = (t0 + t1) / 2, inCase = Sm(S.case_x + 0.12, S.case_base + 0.06, S.case_z[i]);
      fill = f < mid ? 0 : 0.8;
      let hand = rest;
      if (f >= t0 && f < mid) hand = lerp3(rest, inCase, smooth(ramp(f, t0, t0 + 6)));
      else if (f >= mid && f < t1) { hand = lerp3(inCase, add3(bag, [0, 0.12, 0]), smooth(ramp(f, mid, t1 - 3))); const it = add3(hand, [0, 0.04, 0]);
        if (w === "A") tcardFx(out, "loot", it, 0.14, { img: "neo_lugia" }); else if (w === "B") fxc(out, "lootslab", 310, 500, (p) => art2.slab(p, 310, 500, "lc_gengar"), it, 0.12, 0.19); else fxc(out, "lootbox", 300, 200, (p) => art2.boxFront(p, "neo_hooh"), it, 0.24, 0.16); }
      else if (f >= t1) hand = lerp3(add3(bag, [0, 0.12, 0]), rest, smooth(ramp(f, t1, t1 + 8)));
      arm3d(out, cam, w, P, fo, 1, hand, f);
    } else if (w === "D") { // the till
      const drawerFront = Sm(S.register[0] - 0.2 - (f >= TILL5 ? 0.3 * easeOut(ramp(f, TILL5, TILL5 + 4)) : 0), S.register[1] + 0.03, S.register[2]);
      let hand = rest; fill = f >= TILL5 + 12 ? 0.6 : 0;
      if (f >= TILL5 - 8 && f < TILL5 + 4) hand = lerp3(rest, drawerFront, smooth(ramp(f, TILL5 - 8, TILL5 - 2)));
      else if (f >= TILL5 + 4 && f < TILL5 + 12) { hand = lerp3(drawerFront, add3(bag, [0, 0.12, 0]), smooth(ramp(f, TILL5 + 4, TILL5 + 11))); fxc(out, "cash", 200, 110, (p) => art2.cash(p), add3(hand, [0, 0.03, 0]), 0.16, 0.09); }
      else if (f >= TILL5 + 12) hand = lerp3(add3(bag, [0, 0.12, 0]), rest, smooth(ramp(f, TILL5 + 12, TILL5 + 20)));
      arm3d(out, cam, w, P, fo, 1, hand, f);
    } else arm3d(out, cam, w, P, fo, 1, rest, f);
    fxc(out, `duffel${q(fill, 5)}`, 300, 200, (p) => art2.duffel(p, fill), bag, 0.42, 0.28);
  });
};

// ---------------- S06-S07: the trailer ----------------
const DOOR_R = (): number => 0; // (the right door's angle is posed in world.ts; B's hand follows its handle while it is in reach)
const trailerB = (out: Stage, cam: CamInfo, f: number) => {
  const back = f >= SNAP6 + 4 ? smooth(ramp(f, SNAP6 + 4, SNAP6 + 12)) : 0, [bx, bz] = S.cutter_b, P: V3 = Sm(bx - 0.1 * back, 0, bz + 0.3 * back);
  const fo: FrontOpts = { mode: "stand", expr: f < SNAP6 ? "pained" : "grin", armOff: 2, crouch: f < SNAP6 ? 0.08 : 0 };
  front(out, cam, "B", ...P, fo, f, [SNAP6]);
  const L = Sm(...(S.lock as V3)), ch = chestAt(cam, "B", P, fo, 0.3, 0.1), dir = norm3(sub3(L, ch)), sq = smooth(ramp(f, SQUEEZE6[0], SQUEEZE6[1]));
  if (f < SNAP6 + 4) {
    const grip = add3(L, dir, -0.7); arm3d(out, cam, "B", P, fo, 1, add3(grip, cam.right.toArray() as V3, 0.05), f); arm3d(out, cam, "B", P, fo, -1, add3(grip, cam.right.toArray() as V3, -0.05), f);
    const open = f < SNAP6 ? 1 - 0.8 * sq : 0; tool(out, `cut${q(open, 6)}`, 500, 120, (p) => art2.cutters(p, open), grip, dir, 0.72, 0.17);
    if (f >= SNAP6 && f < SNAP6 + 6) burst(out, f, SNAP6, L[0], L[1], L[2] + 0.04, 0.3, 6, "#fff3b0");
  } else {
    const rest = restHand(cam, "B", P, fo, -1), LH = arm3d(out, cam, "B", P, fo, -1, rest, f); tool(out, "cut0", 500, 120, (p) => art2.cutters(p, 0), LH, [0, -1, 0.1], 0.72, 0.17);
    arm3d(out, cam, "B", P, fo, 1, restHand(cam, "B", P, fo, 1), f);
  }
  void DOOR_R; void DOORS6;
};
const plates = (out: Stage, cam: CamInfo, f: number) => {
  const a = walkPath(S.plateA, f, WALKA7[0], WALKA7[1]), c = walkPath(S.plateC, f, WALKC7[0], WALKC7[1]);
  const PA: V3 = Sm(a.x, 0, a.z), foA: FrontOpts = { mode: a.moving ? "march" : "stand", phase: walkPhase(f, STEP_RATE), expr: "smile", armOff: 2 };
  if (!near(cam, PA, 0.6)) {
    front(out, cam, "A", ...PA, foA, f); const pc = chestAt(cam, "A", PA, foA, 0.42, 0.22);
    arm3d(out, cam, "A", PA, foA, 1, add3(pc, cam.right.toArray() as V3, 0.18), f); arm3d(out, cam, "A", PA, foA, -1, add3(pc, cam.right.toArray() as V3, -0.18), f);
    fxc(out, "plate4", 400, 300, (p) => art2.plate(p, 4), add3(pc, [0, 0.12, 0]), 0.6, 0.45);
  }
  const PC: V3 = Sm(c.x, 0, c.z), up2 = f >= PLATE7 - 6 ? smooth(ramp(f, PLATE7 - 6, PLATE7)) : 0, foC: FrontOpts = { mode: c.moving ? "march" : "stand", phase: walkPhase(f + 7, STEP_RATE), expr: "grin", armOff: 2 };
  if (!near(cam, PC, 0.6)) {
    front(out, cam, "C", ...PC, foC, f); const pc = add3(chestAt(cam, "C", PC, foC, 0.42, 0.22), [0, 0.42 * up2, 0]);
    arm3d(out, cam, "C", PC, foC, 1, add3(pc, cam.right.toArray() as V3, 0.18), f); arm3d(out, cam, "C", PC, foC, -1, add3(pc, cam.right.toArray() as V3, -0.18), f);
    fxc(out, "plate0", 400, 300, (p) => art2.plate(p, 0), add3(pc, [0, 0.05, 0]), 0.6, 0.45);
    fxc(out, "napkin", 120, 120, (p) => art2.napkin(p), cardWorld(cam, PC[0], PC[1], PC[2], [300, 365]), 0.1, 0.1);
  }
};

// ---------------- the driver in the van (S10, S11, S14) ----------------
const driver = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const v = vanAt(id, f); if (!v || v.set !== "road") return;
  const lx = 0.42, lz = -0.42, c = Math.cos(v.yaw), s = Math.sin(v.yaw), P: V3 = Rm(v.x + lx * c + lz * s, 0.08, v.z - lx * s + lz * c);
  const waving = id === 10 && f >= WAVE10[0] && f < WAVE10[1], tapping = id === 10 && f >= TAP10 - 4 && f < TAP10 + 8;
  const fo: FrontOpts = { mode: "stand", expr: id === 10 && f >= TAP10 ? "grin" : "neutral", armOff: waving || tapping ? 1 : undefined };
  front(out, cam, "A", ...P, fo, f, id === 10 ? [TAP10, FLASH10] : []);
  if (waving) { const sh = shoulderAt(cam, "A", P, fo, 1); arm3d(out, cam, "A", P, fo, 1, add3(sh, [0, 0.34, 0], 1).map((x, i) => x + (i === 0 ? cam.right.x : i === 2 ? cam.right.z : 0) * 0.12 * Math.sin((f - WAVE10[0]) * 0.9)) as V3, f); }
  if (tapping) { const head = cardWorld(cam, P[0], P[1], P[2], [330, 250]); arm3d(out, cam, "A", P, fo, 1, head, f); }
};
const blueRing = (p: Pen, u: number) => { const g = p.g; g.strokeStyle = `rgba(122,210,255,${1 - u})`; g.lineWidth = 18; g.beginPath(); g.arc(128, 128, 100, 0, 7); g.stroke(); g.lineWidth = 8; g.beginPath(); g.arc(128, 128, 70, 0, 7); g.stroke(); };
const pings = (out: Stage, cam: CamInfo, f: number) => {
  RP.pings.forEach((t, i) => {
    if (f < t || f > t + 24) return; const u = (f - t) / 24, v = vanAt(14, t)!, [tx, tz] = RP.towers[i];
    out.fx.push({ key: `ring${q(u, 24)}`, cw: 256, ch: 256, draw: (p) => blueRing(p, u), x: RDo[0] + v.x, y: RDo[1] + 1.5, z: RDo[2] + v.z, w: 4 + 14 * u, h: 4 + 14 * u, soft: true });
    out.fx.push({ key: `ring${q(u, 24)}`, cw: 256, ch: 256, draw: (p) => blueRing(p, u), x: RDo[0] + tx, y: RP.tower_h + 0.5, z: RDo[2] + tz, w: 3 + 12 * u, h: 3 + 12 * u, soft: true });
  });
};

// ---------------- the rental office (S12, S13, S24) ----------------
const paperPt = (u: number, v: number): V3 => Nm(RN.paper[0] - RN.paper_size[0] / 2 + u * RN.paper_size[0], RN.paper[1] + 0.003, RN.paper[2] - RN.paper_size[1] / 2 + v * RN.paper_size[1]);
const rental = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const Pc: V3 = Nm(RN.clerk[0], 0, RN.clerk[1]), Pa: V3 = Nm(RN.cust[0], 0, RN.cust[1]);
  if (id === 12) {
    const sig = clamp01((f - SIGN12[0]) / (SIGN12[1] - SIGN12[0])), [u, v] = art2.SIG_TIP(sig), tip = paperPt(u, v);
    const foA: FrontOpts = { mode: "stand", expr: "neutral", armOff: 1 }, pen = add3(tip, [0.02, 0.1, 0.03]);
    if (!near(cam, Pa, 0.9)) front(out, cam, "A", ...Pa, foA, f);
    arm3d(out, cam, "A", Pa, foA, 1, pen, f); fxc(out, "pen", 240, 40, (p) => art.pen(p), lerp3(pen, tip, 0.5), 0.13, 0.025, { rot: -1.1 });
    const foC: FrontOpts = { mode: "stand", expr: "neutral", armOff: 1 }; front(out, cam, "clerk", ...Pc, foC, f);
    const st = Nm(...(RN.stamp_at as V3)), hi = add3(st, [0, 0.22, 0]), down = f >= STAMP12 - 4 && f < STAMP12 + 6;
    const hand = f < STAMP12 - 10 ? restHand(cam, "clerk", Pc, foC, 1) : f < STAMP12 - 4 ? lerp3(restHand(cam, "clerk", Pc, foC, 1), hi, smooth(ramp(f, STAMP12 - 10, STAMP12 - 4))) : down ? lerp3(hi, add3(st, [0, 0.1, 0]), f < STAMP12 ? (f - STAMP12 + 4) / 4 : 1) : lerp3(add3(st, [0, 0.1, 0]), hi, smooth(ramp(f, STAMP12 + 6, STAMP12 + 12)));
    const H2 = arm3d(out, cam, "clerk", Pc, foC, 1, hand, f); fxc(out, "rstamp", 200, 270, (p) => art.rubberStamp(p), add3(H2, [0, -0.05, 0]), 0.08, 0.11);
    return;
  }
  // S13: the clerk compares the licence; the masked queue
  const lic = f >= LICENCE13[0], eyes = f >= LOOKS13[0] && f < LOOKS13[1] ? 1 : f >= LOOKS13[1] ? -1 : 0;
  const foC: FrontOpts = { mode: "stand", expr: f < LICENCE13[0] ? "neutral" : "stern", look: lic ? (eyes || -1) : 0, armOff: lic ? 1 : undefined };
  front(out, cam, "clerk", ...Pc, foC, f, [1108, LICENCE13[0], LOOKS13[0], LOOKS13[1]]);
  if (lic) { const face2 = cardWorld(cam, Pc[0], Pc[1], Pc[2], [430, 300]), up2 = smooth(ramp(f, LICENCE13[0], LICENCE13[1])), hand = lerp3(restHand(cam, "clerk", Pc, foC, 1), face2, up2), H2 = arm3d(out, cam, "clerk", Pc, foC, 1, hand, f);
    fxc(out, "licence", 340, 214, (p) => art2.licence(p), add3(H2, [0, 0.07, 0]), 0.17, 0.107); }
  front(out, cam, "A", ...Pa, { mode: "stand", expr: "smile" }, f);
  const sh = f >= SHUFFLE13 ? smooth(ramp(f, SHUFFLE13, SHUFFLE13 + 8)) : 0;
  (["B", "C", "D"] as const).forEach((w, i) => { const q0 = RN.queue[i], prev = i ? RN.queue[i - 1] : RN.cust; const x = lerpN(q0[0], q0[0] + (prev[0] - q0[0]) * 0.12, sh), z = lerpN(q0[1], q0[1] + (prev[1] - q0[1]) * 0.12, sh);
    front(out, cam, w, ...Nm(x, 0, z), { mode: sh > 0 && sh < 1 ? "march" : "stand", phase: walkPhase(f, STEP_RATE), expr: "neutral" }, f); });
};
const archive = (out: Stage, cam: CamInfo, f: number) => {
  const [cx, cz] = RN.clerk_arch, P: V3 = Nm(cx, 0, cz), fo: FrontOpts = { mode: "stand", expr: f >= SHUT24 ? "smile" : "neutral", armOff: 1 };
  front(out, cam, "clerk", ...P, fo, f, [SHUT24]);
  const dz = RN.archive_z[0] + (RN.drawer2026[0] + 0.5) * RN.drawer_w, dy = 0.1 + (RN.drawer2026[1] + 0.5) * RN.drawer_h, face2 = RN.archive_x + 0.36;
  const open = f < SHUT24 - 6 ? 0.36 : f < SHUT24 ? 0.36 * (1 - (f - SHUT24 + 6) / 6) : 0, inDrawer = Nm(face2 + open - 0.2, dy + 0.05, dz), front2 = Nm(face2 + open + 0.02, dy, dz + 0.0);
  const chest = chestAt(cam, "clerk", P, fo, 0.4, 0.15);
  let hand: V3;
  if (f < FILE24[0]) hand = chest; else if (f < FILE24[1]) hand = lerp3(chest, add3(inDrawer, [0, 0.12, 0]), smooth(ramp(f, FILE24[0], FILE24[1]))); else if (f < SHUT24 - 6) hand = lerp3(add3(inDrawer, [0, 0.12, 0]), front2, smooth(ramp(f, FILE24[1], SHUT24 - 7))); else if (f < SHUT24 + 2) hand = front2; else hand = lerp3(front2, restHand(cam, "clerk", P, fo, 1), smooth(ramp(f, SHUT24 + 2, SHUT24 + 12)));
  const H2 = arm3d(out, cam, "clerk", P, fo, 1, hand, f);
  if (f < FILE24[1]) fxc(out, "folder", 320, 440, (p) => art2.folderCover(p), add3(H2, [0, -0.08, 0]), 0.2, 0.27, { rot: 0.1 });
};

// ---------------- the police station (S16, S17, S21) ----------------
const SLOT_ORDER = ["cctv", "rental", "gps", "phone", "prints"] as const;
const ITEM_ART = [art2.cctvStill, art2.rentalCopy, art2.gpsSheet, art2.phoneSheet, art2.printsCard];
const board = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const slots = PO.slots as Record<string, number[]>, BZ = PO.board_z;
  if (id === 16) {
    let i = PINS16.findIndex((t) => f < t + 4); if (i < 0) i = 4;
    const sx = (n: number) => slots[SLOT_ORDER[n]][0] + 0.4, prevX = i ? sx(i - 1) : sx(0) - 0.3, t0 = PINS16[i], k = smooth(ramp(f, t0 - 16, t0 - 8));
    const P: V3 = Pm(lerpN(prevX, sx(i), k), 0, PO.det_z), fo: FrontOpts = { mode: k > 0 && k < 1 ? "march" : "stand", phase: walkPhase(f, STEP_RATE), expr: "stern", armOff: 2 };
    front(out, cam, "det", ...P, fo, f, PINS16);
    const chest = chestAt(cam, "det", P, fo, 0.45, 0.15); arm3d(out, cam, "det", P, fo, -1, add3(chest, cam.right.toArray() as V3, -0.12), f);
    fxc(out, "stack" + (5 - i), 400, 300, (p) => { p.g.fillStyle = "#f4f1ea"; p.g.fillRect(0, 0, 400, 300); p.g.strokeStyle = "#9aa0aa"; p.g.lineWidth = 6; for (let j = 0; j < 5 - i; j++) p.g.strokeRect(6 + j * 6, 6 + j * 6, 380, 280); }, add3(chest, cam.right.toArray() as V3, -0.14), 0.22, 0.16);
    const slot: V3 = Pm(slots[SLOT_ORDER[i]][0], slots[SLOT_ORDER[i]][1], BZ + 0.03);
    let hand = add3(chest, cam.right.toArray() as V3, 0.05), show = f < t0;
    if (f >= t0 - 8 && f < t0) hand = lerp3(hand, slot, smooth(ramp(f, t0 - 8, t0)));
    else if (f >= t0) { hand = lerp3(slot, add3(chest, cam.right.toArray() as V3, 0.05), smooth(ramp(f, t0 + 2, t0 + 10))); show = false; }
    const H2 = arm3d(out, cam, "det", P, fo, 1, hand, f);
    if (show && f >= t0 - 14) fxc(out, "ev" + i, 400, 300, (p) => ITEM_ART[i](p), add3(H2, [0, 0.0, 0.02]), 0.4, 0.3, { face: 0 });
    return;
  }
  if (id === 17) {
    const P: V3 = Pm(1.25 + 0.35 * smooth(ramp(f, PIN17 + 4, PIN17 + 14)), 0, PO.det_z), fo: FrontOpts = { mode: "stand", expr: f >= PIN17 ? "smile" : "stern", armOff: 1 };
    front(out, cam, "det", ...P, fo, f, [PIN17]);
    const pinJ: V3 = Pm(PO.pin_justice[0], PO.pin_justice[1], BZ + 0.02), k = smooth(ramp(f, 1740, PIN17)), from: V3 = Pm(slots.prints[0], slots.prints[1], BZ + 0.02);
    const hand = f < PIN17 + 2 ? lerp3(from, pinJ, k) : lerp3(pinJ, restHand(cam, "det", P, fo, 1), smooth(ramp(f, PIN17 + 2, PIN17 + 12)));
    arm3d(out, cam, "det", P, fo, 1, hand, f);
    return;
  }
};
/** the red string's end this frame (S17: drawn by the detective toward the Justice pin) */
export const stringEnd = (id: number, f: number): number => (id === 17 ? smooth(ramp(f, 1740, PIN17)) : id > 17 ? 1 : 0);
const desk = (out: Stage, cam: CamInfo, f: number) => {
  const xs = PO.folders.map((p) => p[0]), stamps = [ARREST21[0], ARREST21[1], ...WANTED21];
  let i = stamps.findIndex((t) => f < t + 4); if (i < 0) i = 4;
  const targetX = f < SLAM21 + 6 ? xs[4] - 0.12 : xs[i] - 0.12, prevX = f < SLAM21 + 6 ? xs[4] - 0.12 : i ? xs[i - 1] - 0.12 : xs[4] - 0.12, k = f < SLAM21 + 6 ? 1 : smooth(ramp(f, stamps[i] - 12, stamps[i] - 6));
  const P: V3 = Pm(lerpN(prevX, targetX, k), 0, PO.sarge[1]), fo: FrontOpts = { mode: "stand", expr: "stern", armOff: 1, crouch: 0.06 };
  front(out, cam, "sarge", ...P, fo, f, [SLAM21, ...stamps]);
  const slot5: V3 = Pm(PO.folders[4][0], PO.desk_y + 0.01, PO.folders[4][1]);
  if (f < SLAM21 + 4) { // the fifth folder held up, then slapped down
    const hi = add3(slot5, [0, 0.35, -0.1]), hand = f < SLAM21 - 6 ? lerp3(restHand(cam, "sarge", P, fo, 1), hi, smooth(ramp(f, 2020, 2040))) : lerp3(hi, add3(slot5, [0, 0.02, -0.12]), ramp(f, SLAM21 - 6, SLAM21));
    const H2 = arm3d(out, cam, "sarge", P, fo, 1, hand, f); if (f < SLAM21) fxc(out, "fold5", 440, 600, (p) => art2.chargeFolder(p, 4, 0, 0), add3(H2, [0, -0.02, 0.1]), 0.22, 0.3, { tilt: -0.9, face: 0 });
    return;
  }
  const t = stamps[i], tgt: V3 = Pm(xs[i], PO.desk_y + 0.08, PO.folders[i][1]), hi = add3(tgt, [0, 0.18, -0.05]);
  const hand = f < t - 4 ? lerp3(restHand(cam, "sarge", P, fo, 1), hi, smooth(ramp(f, t - 12, t - 4))) : f < t ? lerp3(hi, tgt, (f - t + 4) / 4) : lerp3(tgt, hi, smooth(ramp(f, t + 2, t + 6)));
  const H2 = arm3d(out, cam, "sarge", P, fo, 1, hand, f); fxc(out, "rstamp", 200, 270, (p) => art.rubberStamp(p), add3(H2, [0, -0.05, 0]), 0.08, 0.11);
};

// ---------------- Justice (S15, S20) ----------------
const hideSeek = (out: Stage, cam: CamInfo, f: number) => {
  const [sx, sz] = J.seeker, Ps: V3 = Jm(sx, 0, sz);
  if (f < TURN15) side(out, cam, "cop", ...Ps, -1, -0.4, { mode: "stand", expr: "neutral", pose: 0 }, f);
  else front(out, cam, "cop", ...Ps, { mode: "stand", expr: "stern", look: 1 }, f, [TURN15]);
  const [hx, hz] = J.hider, Ph: V3 = Jm(hx, 0, hz), duck = f >= DUCK15 ? 0.1 * smooth(ramp(f, DUCK15, DUCK15 + 6)) : 0;
  const fo: FrontOpts = { mode: "stand", crouch: 0.36 + duck, expr: f >= RING15 ? "shock" : "nervous", gape: f >= RING15 ? 0.4 : undefined, look: -1, armOff: 2 };
  front(out, cam, "A", ...Ph, fo, f, [RING15]);
  const mouth = cardWorld(cam, Ph[0], Ph[1], Ph[2], [300, 330 + 0.5 * 0.8 * 400 * (0.36 + duck)]), bell = add3(mouth, cam.right.toArray() as V3, -0.3);
  arm3d(out, cam, "A", Ph, fo, -1, add3(mouth, cam.right.toArray() as V3, -0.06), f); arm3d(out, cam, "A", Ph, fo, 1, add3(mouth, [0, -0.08, 0]), f);
  fxc(out, "mega", 260, 160, (p) => art2.megaphone(p), lerp3(mouth, bell, 0.5), 0.32, 0.2, { rot: Math.PI });
  if (f >= RING15) for (const t of [RING15, RING15 + 8, RING15 + 16]) { if (f < t || f >= t + 14) continue; const u = (f - t) / 14; fxc(out, `snd${q(u, 14)}`, 300, 300, (p) => art2.soundRing(p, u), add3(bell, cam.right.toArray() as V3, -0.25 - 0.3 * u), 0.5 + 0.5 * u, 0.5 + 0.5 * u, { rot: Math.PI, soft: true }); }
};
const garageCop = (out: Stage, cam: CamInfo, f: number) => {
  const w = walkPath(J.cop1, f, WALK20[0], WALK20[1]), P: V3 = Jm(w.x, 0, w.z);
  const fo: FrontOpts = { mode: w.moving ? "march" : "stand", phase: walkPhase(f, STEP_RATE), expr: f >= DING20 ? "smile" : "stern", armOff: 2 };
  front(out, cam, "cop", ...P, fo, f, [DING20]);
  const boxP: V3 = Jm(J.slab_box[0], J.slab_box[1] + 0.05, J.slab_box[2]), chest = chestAt(cam, "cop", P, fo, 0.55, 0.25);
  let hold = boxP;
  if (f < LIFT20[0]) hold = boxP; else if (f < LIFT20[1]) hold = lerp3(boxP, chest, smooth(ramp(f, LIFT20[0], LIFT20[1]))); else hold = chest;
  const show = f >= LIFT20[0] - 4;
  if (show) { const r = cam.right.toArray() as V3; arm3d(out, cam, "cop", P, fo, 1, add3(hold, r, 0.07), f); arm3d(out, cam, "cop", P, fo, -1, add3(hold, r, -0.07), f); fxc(out, "heroSlab", 310, 500, (p) => art2.slab(p, 310, 500, "neo_lugia", "10", "$4,800"), add3(hold, [0, 0.06, 0.02]), 0.22, 0.36); }
  else { arm3d(out, cam, "cop", P, fo, 1, restHand(cam, "cop", P, fo, 1), f); arm3d(out, cam, "cop", P, fo, -1, restHand(cam, "cop", P, fo, -1), f); }
};
const walkers = (out: Stage, cam: CamInfo, f: number) => {
  (["B", "C", "D"] as const).forEach((w, i) => { const [x, z] = RP.walk[i], k = ramp(f, 2159, 2210); side(out, cam, w, ...Rm(x + RP.walk_dx * k, 0, z), 1, 0, { mode: "march", phase: walkPhase(f + i * 5, 1.6), stride: 0.55, expr: "sad" }, f); });
};
const rooster = (out: Stage, f: number) => {
  const k = f >= CROW9[0] ? Math.sin(Math.PI * clamp01((f - CROW9[0]) / (CROW9[1] - CROW9[0] + 6))) : 0, P = Sm(...(S.rooster as V3));
  fxc(out, `rooster${q(k, 8)}`, 300, 300, (p) => art2.rooster(p, k), [P[0], P[1] + 0.3, P[2]], 0.65, 0.65);
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  if (id <= 2) hookCrew(out, cam, f, id);
  if (id === 4 || id === 5) caseCrew(out, cam, f, id);
  if (id === 6) trailerB(out, cam, f);
  if (id === 7) plates(out, cam, f);
  if (id === 9) rooster(out, f);
  if (id === 10 || id === 11 || id === 14) driver(out, cam, f, id);
  if (id === 10 && f >= FLASH10 && f < FLASH10 + 6) { const [sx, sz] = RP.speedcam; burst(out, f, FLASH10, RDo[0] + sx - 0.3, 2.4, RDo[2] + sz, 1.4, 6, "#ffffff"); }
  if (id === 14) pings(out, cam, f);
  if (id === 12 || id === 13) rental(out, cam, f, id);
  if (id === 24) archive(out, cam, f);
  if (id === 16 || id === 17) board(out, cam, f, id);
  if (id === 21) desk(out, cam, f);
  if (id === 15) hideSeek(out, cam, f);
  if (id === 20) garageCop(out, cam, f);
  if (id === 22) walkers(out, cam, f);
  return out;
};
void art; void IDX; void tier; void tcardFx; void glowAt; void fxPuff; void SKIN; void glide; void JUo; void sparkle; void fxSplash; void seg3d;
