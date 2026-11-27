// The Chicago reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN, Expr } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, clamp01, smooth, easeOut, hop, UNo, KIo, CTo, YAo, COo, RMo, UP, VANP, KIDP, CTRLP, YARDP, COURTP, ROOMP,
  DRILL1, TIP1, LAND1, STEP1, LIFT2, WALK2, PUSH2, TURN3, LOADA4, LOADB4, LOAD7, PEEL9, STICK9, OPEN9, POINT10, WALK11, FREEZE11, DROP11, LAND11,
  TAP12, NOD12, OUT15, GLANCE15, AWAY15, STOPR15, BACK15, WALK17, DOOR17, IN17,
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
let LNAME: "day" | "golden" = "day";
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
const IDX: Record<Who, number> = { A: 3, B: 4, officer: 5, cop1: 6, cop2: 7, aide: 8, det: 9, C1: 10, C2: 11, kid: 12, kid2: 13, m1: 14, m2: 15, m3: 16, m4: 17, m5: 18, m6: 19 };

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

const CONTACT: Record<"day" | "golden", [number, number, number]> = { day: [0.2, 0.21, 0.33], golden: [0.24, 0.2, 0.33] };
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
  return; // quality bar: no shadows, not even contact blobs (feet stand exactly on the floor)
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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[retford] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const SEAT_CHAIR = 0.92;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const talkOpen = (f: number, a: number, b: number) => f >= a && f < b && Math.floor((f - a) / 5) % 2 === 1;
/** a walk between two marks (side view), then standing */
const walkTo = (out: Stage, cam: CamInfo, who: Who, A: V3, B: V3, f: number, a: number, b: number, so: SideOpts = {}) => {
  const u = ramp(f, a, b), p = lerp3(A, B, smooth(u)), dx = B[0] - A[0], dz = B[2] - A[2];
  side(out, cam, who, ...p, dx, dz, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "neutral", ...so }, f);
  return p;
};
/** walk along a polyline at constant speed */
const walkPath = (out: Stage, cam: CamInfo, who: Who, pts: V3[], f: number, a: number, b: number, so: SideOpts = {}) => {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[2] - pts[i][2])), T = L.reduce((x, y) => x + y, 0);
  let d = smooth(ramp(f, a, b)) * T, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; }
  const A = pts[i], B = pts[i + 1], p = lerp3(A, B, Math.min(1, d / L[i]));
  side(out, cam, who, ...p, B[0] - A[0], B[2] - A[2], { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "neutral", ...so }, f);
  return { p, dir: [B[0] - A[0], 0, B[2] - A[2]] as V3 };
};

// ================= the Retford reel's staging =================
const Um = (x: number, y: number, z: number) => at(UNo, x, y, z);
const mkU = (m: number[], y = 0): V3 => Um(m[0], y, m[1]);
const mkAt = (o: V3, m: number[], y = 0): V3 => at(o, m[0], y, m[1]);
const CART = UP.carton;
/** a carton held in front of the chest by both hands (front view): the carton prop and two arms to its sides */
const holdCarton = (out: Stage, cam: CamInfo, who: Who, p: V3, fo: FrontOpts, slot: number, drop = 0.5) => {
  const ch = chestAt(cam, who, p, fo, drop, 0.2), r = cam.right;
  out.props[`carry${slot}`] = { p: ch, ry: Math.atan2(cam.fwd.x, cam.fwd.z) };
  arm3d(out, cam, who, p, fo, -1, [ch[0] - r.x * 0.19, ch[1] + 0.02, ch[2] - r.z * 0.19], 0);
  arm3d(out, cam, who, p, fo, 1, [ch[0] + r.x * 0.19, ch[1] + 0.02, ch[2] + r.z * 0.19], 0);
  return ch;
};
const restArms = (out: Stage, cam: CamInfo, who: Who, p: V3, fo: FrontOpts, f: number) => { arm3d(out, cam, who, p, fo, -1, restHand(cam, who, p, fo, -1), f); arm3d(out, cam, who, p, fo, 1, restHand(cam, who, p, fo, 1), f); };
/** a front-view person with hanging arms */
const stand = (out: Stage, cam: CamInfo, who: Who, p: V3, f: number, extra: Partial<FrontOpts> = {}, swaps: number[] = []) => {
  if (near(cam, p)) return null;
  const fo: FrontOpts = { mode: "stand", expr: "neutral", armOff: 2, ...extra }; front(out, cam, who, ...p, fo, f, swaps); return fo;
};
/** carrying a carton while walking (side view, both arms reaching forward) */
const walkCarry = (out: Stage, cam: CamInfo, who: Who, A: V3, B: V3, f: number, a: number, b: number, slot: number) => {
  const p = walkTo(out, cam, who, A, B, f, a, b, { reach: 1, expr: "stern" }), d = Math.hypot(B[0] - A[0], B[2] - A[2]) || 1;
  out.props[`carry${slot}`] = { p: [p[0] + ((B[0] - A[0]) / d) * 0.32, p[1] + 1.08, p[2] + ((B[2] - A[2]) / d) * 0.32], ry: Math.atan2(B[0] - A[0], B[2] - A[2]) };
};
const drillArt = (p: Pen) => { const g = p.g; g.fillStyle = "#f2c23a"; g.strokeStyle = "#1a1a1a"; g.lineWidth = 8;
  g.beginPath(); g.roundRect(150, 30, 220, 90, 20); g.fill(); g.stroke(); g.fillStyle = "#2a2c33"; g.beginPath(); g.roundRect(250, 110, 70, 110, 14); g.fill(); g.stroke();
  g.fillStyle = "#8a8f9a"; g.fillRect(20, 66, 135, 18); g.strokeRect(20, 66, 135, 18); };
const holeW = (): V3 => Um(UP.hole[0], UP.hole[1], UP.hole[2]);
const VAN_REAR = (): V3 => { const [x, z, h] = VANP.yard, r = (h * Math.PI) / 180; return Um(x - Math.cos(r) * 3.2, 0, z - Math.sin(r) * 3.2); };
const HOLE_OUT = (): V3 => Um(UP.hole[0] + 0.7, 0, UP.hole[2] - 0.35);

const s01 = (out: Stage, cam: CamInfo, f: number) => {
  const A = mkU(UP.A_drill), W2 = mkU(UP.A_wait), wall: V3 = Um(UP.hole[0] + 0.02, 1.1, UP.hole[2] - 0.44);
  if (f < STEP1[0]) {
    side(out, cam, "A", ...A, -1, 0, { mode: "stand", reach: 1, expr: f < TIP1 ? "stern" : "grin" }, f);
    const back = f < DRILL1[1] ? 0 : Math.min(0.12, (f - DRILL1[1]) * 0.04), h0: V3 = [A[0] - 0.4 + back, 1.13, A[2] + 0.18], h1: V3 = [wall[0] + 0.02 + back, wall[1], wall[2]];
    out.fx.push({ key: "drill", cw: 400, ch: 240, draw: drillArt, x: (h0[0] + h1[0]) / 2, y: (h0[1] + h1[1]) / 2, z: (h0[2] + h1[2]) / 2, w: 0.42, h: 0.25, axis: [h1, h0] });
    if (f < DRILL1[1] && f % 3 === 0) { const t = (f % 9) / 9; fxc(out, `dust${f % 9}`, 200, 200, (pp) => art.poof(pp, t), [wall[0] + 0.12, wall[1] - 0.05, wall[2] + 0.05], 0.18, 0.18, { soft: true }); }
  } else if (f < STEP1[1]) walkTo(out, cam, "A", A, W2, f, STEP1[0], STEP1[1], { expr: "grin" });
  else { const fo = stand(out, cam, "A", W2, f, { expr: "grin" }); if (fo) restArms(out, cam, "A", W2, fo, f); }
  if (f >= LAND1 && f < LAND1 + 14) fxc(out, `crash${f}`, 300, 300, (pp) => art.poof(pp, (f - LAND1) / 14), Um(5.25, 0.35, -4.4), 0.9, 0.9, { soft: true });
};
const s02 = (out: Stage, cam: CamInfo, f: number) => {
  const R = mkU(UP.B_rack), H = mkU(UP.B_hole), shelf: V3 = Um(UP.rack[1] - 0.08 - CART[2] / 2, UP.shelves[2] + CART[1] / 2, UP.B_rack[1]);
  if (f < WALK2[0]) {
    const fo = stand(out, cam, "B", R, f, { expr: "nervous", look: 1 }); if (!fo) return;
    if (f < LIFT2[0]) { restArms(out, cam, "B", R, fo, f); return; }
    const ch = chestAt(cam, "B", R, fo, 0.5, 0.2), u = smooth(clamp01((f - LIFT2[0]) / (LIFT2[1] - LIFT2[0]))), c = lerp3(shelf, ch, u), r = cam.right;
    out.props.carry0 = { p: c }; arm3d(out, cam, "B", R, fo, -1, [c[0] - r.x * 0.19, c[1], c[2] - r.z * 0.19], f); arm3d(out, cam, "B", R, fo, 1, [c[0] + r.x * 0.19, c[1], c[2] + r.z * 0.19], f);
  } else if (f < WALK2[1]) {
    const p = lerp3(R, H, smooth(clamp01((f - WALK2[0]) / (WALK2[1] - WALK2[0])))), fo: FrontOpts = { mode: "march", phase: walkPhase(f, 2), expr: "nervous", armOff: 2 };
    if (!near(cam, p)) { front(out, cam, "B", ...p, fo, f); holdCarton(out, cam, "B", p, fo, 0); }
  } else {
    const fo = stand(out, cam, "B", H, f, { expr: "stern", crouch: 0.25 }); if (!fo) return;
    const ch = chestAt(cam, "B", H, fo, 0.5, 0.2), hole = holeW(), u = smooth(clamp01((f - PUSH2[0]) / (PUSH2[1] - PUSH2[0]))), c = u < 1 ? lerp3(ch, [hole[0] - 0.05, hole[1], hole[2]], u) : lerp3([hole[0] - 0.05, hole[1], hole[2]], [hole[0] + 0.8, hole[1] - 0.2, hole[2]], clamp01((f - PUSH2[1]) / 12));
    out.props.carry0 = { p: c, ry: Math.PI / 2 };
    const hr = u < 1 || f < PUSH2[1] + 3 ? c : restHand(cam, "B", H, fo, 1); arm3d(out, cam, "B", H, fo, 1, [hr[0] - 0.2, hr[1], hr[2]], f); arm3d(out, cam, "B", H, fo, -1, restHand(cam, "B", H, fo, -1), f);
  }
};
const s03 = (out: Stage, cam: CamInfo, f: number) => {
  const p = mkU(UP.officer); const fo = stand(out, cam, "officer", p, f, { expr: f >= TURN3 ? "shock" : "neutral", look: f >= TURN3 ? 1 : 0 }, [TURN3]); if (fo) restArms(out, cam, "officer", p, fo, f);
};
/** the two loading the van (S04, S07): hole -> rear of the van with a carton, then back */
const loader = (out: Stage, cam: CamInfo, who: Who, f: number, legs: number[][], slot: number, wait: V3) => {
  for (const [a, b] of legs) {
    const m = Math.round((a + b) / 2);
    if (f >= a && f < m) return walkCarry(out, cam, who, HOLE_OUT(), VAN_REAR(), f, a, m, slot);
    if (f >= m && f < b) { walkTo(out, cam, who, VAN_REAR(), HOLE_OUT(), f, m, b, { expr: "neutral" }); return; }
  }
  const fo = stand(out, cam, who, wait, f, { expr: "neutral" }); if (fo) restArms(out, cam, who, wait, fo, f);
};
const s04 = (out: Stage, cam: CamInfo, f: number) => { loader(out, cam, "A", f, [LOADA4], 0, mkU(UP.A_wait)); loader(out, cam, "B", f, [LOADB4], 1, mkU(UP.B_freeze)); };
const s06 = (out: Stage, cam: CamInfo, f: number) => {
  for (const [who, m, slot, expr] of [["A", UP.A_freeze, 0, "nervous"], ["B", UP.B_freeze, 1, "shock"]] as [Who, number[], number, Expr][]) {
    const p = mkU(m), fo = stand(out, cam, who, p, f, { expr }); if (!fo) continue; holdCarton(out, cam, who, p, fo, slot);
    if (f > 560) fxc(out, `sweat${who}`, 120, 160, (pp) => { pp.g.fillStyle = "#8fd0f2"; pp.g.strokeStyle = "#1a1a1a"; pp.g.lineWidth = 6; pp.g.beginPath(); pp.g.moveTo(60, 10); pp.g.quadraticCurveTo(110, 110, 60, 150); pp.g.quadraticCurveTo(10, 110, 60, 10); pp.g.fill(); pp.g.stroke(); },
      [p[0] + cam.right.x * 0.24, 1.72, p[2] + cam.right.z * 0.24], 0.07, 0.09);
  }
};
const s07 = (out: Stage, cam: CamInfo, f: number) => loader(out, cam, "A", f, LOAD7, 0, mkU(UP.A_wait));
const s09 = (out: Stage, cam: CamInfo, f: number) => {
  const K = KIDP, p = at(KIo, K.kid[0], 0, K.kid[1]), DY = K.desk_y;
  const expr: Expr = f < STICK9[1] ? "smile" : f < 1150 ? "grin" : "nervous";
  const fo = stand(out, cam, "kid", p, f, { expr, look: 0 }, [STICK9[1], 1150]); if (!fo) { /* the lens is at the desk: the hands still act */ }
  const F: FrontOpts = fo ?? { mode: "stand", expr, armOff: 2 };
  const lab: V3 = at(KIo, K.book[0] + 0.01, DY + 0.016, K.book[1] - 0.03), drop: V3 = at(KIo, 0.3, DY + 0.004, 0.14), back: V3 = at(KIo, 0.38, DY + 0.007, -0.05);
  let h: V3 | null = null;
  if (f >= PEEL9[0] - 8 && f < PEEL9[0]) h = lerp3(restHand(cam, "kid", p, F, 1), lab, smooth((f - PEEL9[0] + 8) / 8));
  else if (f >= PEEL9[0] && f < PEEL9[1] + 4) { const u = smooth((f - PEEL9[0]) / (PEEL9[1] + 4 - PEEL9[0])); h = lerp3(lab, [drop[0], drop[1] + 0.12, drop[2]], u); out.props.peel = { p: [h[0], h[1] - 0.01, h[2]], rx: -Math.PI / 2 + 1.2 * Math.sin(u * Math.PI) }; }
  if (f >= PEEL9[1] + 4) out.props.peel = { p: drop, rx: -Math.PI / 2, rz: 0.4 };
  if (f >= STICK9[0] && f < STICK9[1] + 6) {
    const u1 = smooth(clamp01((f - STICK9[0]) / 8)), u2 = smooth(clamp01((f - STICK9[0] - 8) / (STICK9[1] - STICK9[0] - 8)));
    h = f < STICK9[0] + 8 ? lerp3([drop[0], drop[1] + 0.12, drop[2]], back, u1) : f < STICK9[1] ? lerp3(back, [lab[0], lab[1] + 0.002, lab[2]], u2) : lab;
    if (f >= STICK9[0] + 8 && f < STICK9[1]) out.props.label2 = { p: [h[0], h[1] - 0.004, h[2]], rx: -Math.PI / 2 };
  }
  if (f >= OPEN9[0] - 6 && f < OPEN9[1] + 6) { const a = Math.PI * smooth(clamp01((f - OPEN9[0]) / (OPEN9[1] - OPEN9[0]))), hx = K.book[0] - 0.1 + 0.2 * Math.cos(a);
    h = at(KIo, hx, DY + 0.014 + 0.2 * Math.sin(a), K.book[1] + 0.08); }
  if (fo) { arm3d(out, cam, "kid", p, F, 1, h ?? restHand(cam, "kid", p, F, 1), f); arm3d(out, cam, "kid", p, F, -1, restHand(cam, "kid", p, F, -1), f); }
};
const s10 = (out: Stage, cam: CamInfo, f: number) => {
  const C2p = CTRLP, p = at(CTo, C2p.officer[0], 0, C2p.officer[1]), fo = stand(out, cam, "officer", p, f, { expr: "stern", look: f >= POINT10 ? 1 : 0 });
  if (fo) { const S2 = shoulderAt(cam, "officer", p, fo, -1), tgt = at(CTo, C2p.map[0] + C2p.route[4][0] * (C2p.map[1] - C2p.map[0]), C2p.map[3] - C2p.route[4][1] * (C2p.map[3] - C2p.map[2]), -2.97);
    const d = v3(tgt).sub(v3(S2)).normalize(), k = smooth(clamp01((f - POINT10) / 8)), pt = add3(S2, [d.x, d.y, d.z], 0.44);
    arm3d(out, cam, "officer", p, fo, -1, lerp3(restHand(cam, "officer", p, fo, -1), pt, k), f); arm3d(out, cam, "officer", p, fo, 1, restHand(cam, "officer", p, fo, 1), f); }
  const a = at(CTo, C2p.aide[0], 0, C2p.aide[1]), fa = stand(out, cam, "aide", a, f, { expr: "smile", look: 1 });
  if (fa) { const hh2 = holdHand(cam, "aide", a, fa, 1); arm3d(out, cam, "aide", a, fa, 1, hh2, f); arm3d(out, cam, "aide", a, fa, -1, restHand(cam, "aide", a, fa, -1), f);
    fxc(out, "mug", 120, 140, (pp) => { pp.g.fillStyle = "#d8322f"; pp.g.strokeStyle = "#1a1a1a"; pp.g.lineWidth = 8; pp.g.beginPath(); pp.g.roundRect(14, 20, 78, 106, 10); pp.g.fill(); pp.g.stroke(); pp.g.beginPath(); pp.g.arc(96, 70, 20, -1.3, 1.3); pp.g.stroke(); }, [hh2[0], hh2[1] + 0.05, hh2[2]], 0.08, 0.095); }
};
const DROP_REST = (): V3 => at(YAo, YARDP.C2[0] + 0.4, CART[2] / 2, YARDP.C2[1] + 0.35);
const s11 = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const Y = YARDP;
  if (id === 11) for (const [who, m, slot] of [["C1", Y.C1, 0], ["C2", Y.C2, 1]] as [Who, number[], number][]) {
    const p = mkAt(YAo, m), shock = f >= FREEZE11, fo = stand(out, cam, who, p, f, { expr: shock ? "shock" : "neutral", look: shock ? 0 : (who === "C1" ? 1 : -1) }, [FREEZE11]); if (!fo) continue;
    if (who === "C2" && f >= DROP11) {
      restArms(out, cam, who, p, fo, f);
      const ch = chestAt(cam, who, p, fo, 0.5, 0.2), R = DROP_REST(), t = (f - DROP11) / (LAND11 - DROP11);
      const q: V3 = t < 1 ? [ch[0] + (R[0] - ch[0]) * t, ch[1] + (R[1] - ch[1]) * t * t, ch[2] + (R[2] - ch[2]) * t] : [R[0], R[1] + hop(f, LAND11, 0.9), R[2]];
      out.props.drop = { p: q, rz: (Math.PI / 2) * smooth(clamp01((f - LAND11) / 14)), ry: 0.4 };
    } else holdCarton(out, cam, who, p, fo, slot);
  }
  if (id === 12) out.props.drop = { p: DROP_REST(), rz: Math.PI / 2, ry: 0.4 };
  for (const [who, from, to] of [["cop1", Y.cop1_from, Y.cop1], ["cop2", Y.cop2_from, Y.cop2]] as [Who, number[], number[]][]) {
    if (id === 12 && who === "cop2") continue;
    const A = mkAt(YAo, from), B = mkAt(YAo, to);
    if (id === 11 && f < WALK11[0]) continue;
    if (id === 11 && f < WALK11[1]) { walkTo(out, cam, who, A, B, f, WALK11[0], WALK11[1], { expr: "stern" }); continue; }
    const at2 = id === 12 ? mkAt(YAo, [-2.6, 7.4]) : B, fo = stand(out, cam, who, at2, f, { expr: "stern" }); if (fo) restArms(out, cam, who, at2, fo, f);
  }
  if (id === 12) {
    const p = mkAt(YAo, Y.det), fo = stand(out, cam, "det", p, f, { expr: f > NOD12 ? "smile" : "stern", headTilt: f >= NOD12 && f < NOD12 + 10 ? 0.15 * Math.sin(((f - NOD12) / 10) * Math.PI) : 0 }, [NOD12]);
    if (fo) { const tap = f >= TAP12 && f < TAP12 + 24, wrist = holdHand(cam, "det", p, fo, -1);
      arm3d(out, cam, "det", p, fo, -1, wrist, f); arm3d(out, cam, "det", p, fo, 1, tap ? [wrist[0] + 0.02 * Math.sin(f * 1.3), wrist[1] + 0.03, wrist[2]] : restHand(cam, "det", p, fo, 1), f); }
  }
};
const MEN_W: Who[] = ["m1", "m2", "m3", "m4", "m5", "m6"];
const s13 = (out: Stage, cam: CamInfo, f: number) => COURTP.men.forEach((m, i) => { const p = mkAt(COo, m), fo = stand(out, cam, MEN_W[i], p, f, { expr: i % 2 ? "neutral" : "nervous", look: [1, -1, 0, 1, -1, 0][i] }); if (fo) restArms(out, cam, MEN_W[i], p, fo, f); });
const s14 = (out: Stage, cam: CamInfo, f: number) => ROOMP.dock_men.forEach((m, i) => { const who = (["m2", "m4", "m6"] as Who[])[i], p = mkAt(RMo, m, 0.15), fo = stand(out, cam, who, p, f, { expr: "neutral" }); if (fo) restArms(out, cam, who, p, fo, f); });
const s15 = (out: Stage, cam: CamInfo, f: number) => {
  const C = COURTP, who: Who[] = ["m2", "m4", "m6"], door = mkAt(COo, [C.out_from[0], 0.75]), ends = [C.goL, C.goC, C.goR];
  who.forEach((w, i) => {
    const O = mkAt(COo, C.out[i]);
    if (f < OUT15[0]) return;
    if (f < OUT15[1]) { const p = lerp3(door, O, smooth(clamp01((f - OUT15[0] - i * 4) / (OUT15[1] - OUT15[0] - 8)))), fo: FrontOpts = { mode: "march", phase: walkPhase(f + i * 7, 2), expr: "neutral", armOff: 2 };
      if (!near(cam, p)) { front(out, cam, w, ...p, fo, f); restArms(out, cam, w, p, fo, f); } return; }
    if (f < AWAY15[0]) { const lk = f < GLANCE15[1] ? [1, -1, -1][i] * (Math.floor((f - GLANCE15[0]) / 5) % 2 ? -1 : 1) : 0, fo = stand(out, cam, w, O, f, { expr: "nervous", look: lk }); if (fo) restArms(out, cam, w, O, fo, f); return; }
    const E = mkAt(COo, ends[i]);
    if (i < 2) { if (f < AWAY15[1]) walkTo(out, cam, w, O, E, f, AWAY15[0], AWAY15[1], { expr: "neutral" }); else { const fo = stand(out, cam, w, E, f); if (fo) restArms(out, cam, w, E, fo, f); } return; }
    if (f < AWAY15[1]) { walkTo(out, cam, w, O, E, f, AWAY15[0], AWAY15[1], { expr: "neutral" }); return; }
    if (f < BACK15[0]) { const fo = stand(out, cam, w, E, f, { expr: f >= STOPR15 ? "shock" : "neutral", look: 1 }, [STOPR15]); if (fo) restArms(out, cam, w, E, fo, f); return; }
    walkTo(out, cam, w, E, mkAt(COo, C.backR), f, BACK15[0], BACK15[1], { expr: "nervous" });
  });
};
const s17 = (out: Stage, cam: CamInfo, f: number) => {
  const A = mkU(UP.kid_walk), D = mkU(UP.kid_door), inside = Um(UP.kid_door[0], 0, -0.7);
  if (f < WALK17[0]) return;
  if (f < WALK17[1]) { walkTo(out, cam, "kid2", A, D, f, WALK17[0], WALK17[1], { expr: "grin" }); return; }
  if (f < IN17[0]) { const fo = stand(out, cam, "kid2", D, f, { expr: "grin" }); if (fo) { arm3d(out, cam, "kid2", D, fo, 1, f >= DOOR17 - 6 ? Um(UP.door[0] + 0.85, 1.0, -0.1) : restHand(cam, "kid2", D, fo, 1), f); arm3d(out, cam, "kid2", D, fo, -1, restHand(cam, "kid2", D, fo, -1), f); } return; }
  if (f < IN17[1]) walkTo(out, cam, "kid2", D, inside, f, IN17[0], IN17[1], { expr: "grin" });
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light === "golden" ? "golden" : "day"; SUN = cam.sun.clone();
  if (id === 1) s01(out, cam, f);
  if (id === 2) s02(out, cam, f);
  if (id === 3) s03(out, cam, f);
  if (id === 4) s04(out, cam, f);
  if (id === 6) s06(out, cam, f);
  if (id === 7) s07(out, cam, f);
  if (id === 9) s09(out, cam, f);
  if (id === 10) s10(out, cam, f);
  if (id === 11 || id === 12) s11(out, cam, f, id);
  if (id === 13) s13(out, cam, f);
  if (id === 14) s14(out, cam, f);
  if (id === 15) s15(out, cam, f);
  if (id === 17) s17(out, cam, f);
  return out;
};
void art2; void IDX; void tier; void tcardFx; void glowAt; void faceTo; void fxPuff; void SKIN; void burst; void sparkle; void FPS; void easeOut; void walkPath; void talkOpen; void SEAT_CHAIR; void lerpN; void ramp; void fxBurst; void fxSplash; void fxRing; void fxContact; void fxShadow;
void VANP; void TIP1; void LAND1; void DROP11;
