// The Roush reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN, Expr } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, STo, RMo, MKo, DKo, clamp01, smooth, easeOut, STP, RMP, MKP, DKP, lidPose, coinAt,
  TADA1, LIFT1, STAND1, SPARK1, WAVE3, POINT3, REACH5, LIFT5, GLEAM5, TILL8, PLINK8, BUZZ9, UP9, SIGN9, WALK11, SET11, HANDS12, TURN12, TIN13, FLIP13,
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
const IDX: Record<Who, number> = { creator: 3, viewer: 4, seller: 5, courier: 6, tinman: 7, tout: 8, v1: 13, v2: 14, v3: 15, v4: 16, v5: 17, v6: 18, v7: 19 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[roush] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const Sm = (x: number, y: number, z: number) => at(STo, x, y, z), Rm = (x: number, y: number, z: number) => at(RMo, x, y, z);
const Mm = (x: number, y: number, z: number) => at(MKo, x, y, z), Dm = (x: number, y: number, z: number) => at(DKo, x, y, z);
const R = RMP, ST = STP, MK = MKP, DK = DKP;
/** a walk between two marks (side view), then standing */
const walkTo = (out: Stage, cam: CamInfo, who: Who, A: V3, B: V3, f: number, a: number, b: number, so: SideOpts = {}) => {
  const u = ramp(f, a, b), p = lerp3(A, B, smooth(u)), dx = B[0] - A[0], dz = B[2] - A[2];
  side(out, cam, who, ...p, dx, dz, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "neutral", ...so }, f);
  return p;
};
const rest2 = (out: Stage, cam: CamInfo, who: Who, p: V3, fo: FrontOpts, f: number) => { arm3d(out, cam, who, p, fo, -1, restHand(cam, who, p, fo, -1), f); arm3d(out, cam, who, p, fo, 1, restHand(cam, who, p, fo, 1), f); };
/** both hands on an object's two ends (its centre c, half-width w along the camera's right) */
const both = (out: Stage, cam: CamInfo, who: Who, p: V3, fo: FrontOpts, c: V3, w: number, f: number, dy = 0) => {
  const r = cam.right; arm3d(out, cam, who, p, fo, -1, [c[0] - r.x * w, c[1] + dy, c[2] - r.z * w], f); arm3d(out, cam, who, p, fo, 1, [c[0] + r.x * w, c[1] + dy, c[2] + r.z * w], f);
};
const person = (out: Stage, cam: CamInfo, who: Who, p: V3, f: number, fo: FrontOpts, swaps: number[] = []) => { if (near(cam, p)) return null; front(out, cam, who, ...p, { mode: "stand", armOff: 2, ...fo }, f, swaps); return { p, fo: { mode: "stand", armOff: 2, ...fo } as FrontOpts }; };
/** someone holding a phone at chest height in one hand (its back toward the lens), the other arm resting */
const phoneHolder = (out: Stage, cam: CamInfo, who: Who, p: V3, f: number, fo: FrontOpts, col = "#f2785a", buzzOn = false, swaps: number[] = []) => {
  const s = person(out, cam, who, p, f, fo, swaps); if (!s) return;
  const h = chestAt(cam, who, p, s.fo, 0.38, 0.2), r = cam.right, ph: V3 = [h[0] + r.x * 0.06, h[1] + 0.02, h[2] + r.z * 0.06];
  arm3d(out, cam, who, p, s.fo, 1, [ph[0] + r.x * 0.03, ph[1] - 0.04, ph[2] + r.z * 0.03], f); arm3d(out, cam, who, p, s.fo, -1, restHand(cam, who, p, s.fo, -1), f);
  fxc(out, "pback" + col, 160, 320, (pp) => art2.phoneBack(pp, 160, 320, col), ph, 0.075, 0.15);
  if (buzzOn) fxc(out, `buzz${f % 2}`, 400, 200, (pp) => art2.buzz(pp, 400, 200, f % 2), [ph[0], ph[1] + 0.02, ph[2]], 0.28, 0.14, { soft: true });
};

// ---- her room ----
const HERP = (): V3 => Rm(R.her[0], 0, R.her[1]);
const lidWorld = (id: number, f: number): V3 => { const l = lidPose(id, f).p; return Rm(l[0], l[1], l[2]); };
const BOXC = (): V3 => Rm(R.box[0], R.top + 0.06, R.box[1]);
const s01 = (out: Stage, cam: CamInfo, f: number) => {
  const p = HERP(), fo: FrontOpts = { expr: f >= TADA1 ? "grin" : f >= LIFT1[0] ? "smile" : "smile", crouch: f < STAND1[1] ? 0.12 : 0 };
  const s = person(out, cam, "creator", p, f, fo, [TADA1]); if (!s) return;
  if (f < STAND1[1] + 2) both(out, cam, "creator", p, s.fo, lidWorld(1, f), 0.17, f);
  else { const k = smooth(ramp(f, TADA1 - 2, TADA1 + 8)), r = cam.right;
    for (const sd of [-1, 1] as const) { const S2 = restHand(cam, "creator", p, s.fo, sd), up: V3 = [S2[0] + r.x * sd * 0.18, S2[1] + 0.5, S2[2] + r.z * sd * 0.18]; arm3d(out, cam, "creator", p, s.fo, sd, lerp3(S2, up, k), f); } }
  if (f >= SPARK1 && f < SPARK1 + 14) { const c = BOXC(); out.fx.push({ key: `spk${q((f - SPARK1) / 14, 30)}`, cw: 400, ch: 400, draw: (pp) => art.sparkle(pp, (f - SPARK1) / 14), x: c[0], y: c[1] + 0.15, z: c[2] + 0.1, w: 0.4, h: 0.4 }); }
};
const herRest = (out: Stage, cam: CamInfo, f: number, fo: FrontOpts = {}) => { const s = person(out, cam, "creator", HERP(), f, { expr: "smile", ...fo }); if (s) rest2(out, cam, "creator", s.p, s.fo, f); return s; };
const s03 = (out: Stage, cam: CamInfo, f: number) => {
  const p = HERP(), s = person(out, cam, "creator", p, f, { expr: "smile" }); if (!s) return;
  const r = cam.right, S1 = restHand(cam, "creator", p, s.fo, 1);
  let hand = S1;
  if (f >= WAVE3[0] - 6 && f < WAVE3[1] + 6) { const k = smooth(ramp(f, WAVE3[0] - 6, WAVE3[0])) * (1 - smooth(ramp(f, WAVE3[1], WAVE3[1] + 6))), w = 0.06 * Math.sin((f - WAVE3[0]) * 0.5);
    hand = lerp3(S1, [S1[0] + r.x * (0.2 + w), S1[1] + 0.62, S1[2] + r.z * (0.2 + w)], k); }
  if (f >= POINT3[0] - 6 && f < POINT3[1] + 6) { const k = smooth(ramp(f, POINT3[0] - 6, POINT3[0])) * (1 - smooth(ramp(f, POINT3[1], POINT3[1] + 6))), L = lidWorld(3, f); hand = lerp3(S1, lerp3(chestAt(cam, "creator", p, s.fo, 0.2, 0.1), L, 0.45), k); }
  arm3d(out, cam, "creator", p, s.fo, 1, hand, f); arm3d(out, cam, "creator", p, s.fo, -1, restHand(cam, "creator", p, s.fo, -1), f);
};
/** S05: two cards out of the box, one in each hand, held up */
const cardHold = (cam: CamInfo, p: V3, fo: FrontOpts, sd: -1 | 1): V3 => { const S2 = shoulderAt(cam, "creator", p, fo, sd), r = cam.right; return [S2[0] + r.x * sd * 0.24 - cam.fwd.x * 0.12, S2[1] + 0.2, S2[2] + r.z * sd * 0.24 - cam.fwd.z * 0.12]; };
const s05 = (out: Stage, cam: CamInfo, f: number) => {
  const p = HERP(), fo: FrontOpts = { expr: f >= LIFT5[1] ? "grin" : f >= LIFT5[0] ? "shock" : "smile", crouch: f >= REACH5[0] && f < LIFT5[0] ? 0.15 : 0 };
  const s = person(out, cam, "creator", p, f, fo, [LIFT5[0], LIFT5[1]]);
  const c = BOXC(), r = cam.right;
  for (const sd of [-1, 1] as const) {
    const inBox: V3 = [c[0] + r.x * sd * 0.08, c[1] + 0.02, c[2] + r.z * sd * 0.08];
    let hand: V3 = s ? restHand(cam, "creator", p, s.fo, sd) : inBox, held = false;
    if (s) { if (f >= REACH5[0] && f < LIFT5[0]) hand = lerp3(restHand(cam, "creator", p, s.fo, sd), inBox, smooth(ramp(f, REACH5[0], REACH5[0] + 12)));
      else if (f >= LIFT5[0]) { hand = lerp3(inBox, cardHold(cam, p, s.fo, sd), smooth(ramp(f, LIFT5[0], LIFT5[1]))); held = true; }
      arm3d(out, cam, "creator", p, s.fo, sd, hand, f); }
    if (held) { const gl = f >= GLEAM5[0] && f < GLEAM5[1] ? 1 : 0; void gl; fxc(out, "magikarp", 600, 838, (pp) => art2.heldCard(pp, 600, 838, "magikarp_ar"), [hand[0], hand[1] + 0.05, hand[2]], 0.063, 0.088); }
  }
};
const s10 = (out: Stage, cam: CamInfo, f: number) => { const s = person(out, cam, "creator", HERP(), f, { expr: "smile", blink: 0 }); if (s) rest2(out, cam, "creator", s.p, s.fo, f); };
const s12 = (out: Stage, cam: CamInfo, f: number) => {
  const p = HERP(), s = person(out, cam, "creator", p, f, { expr: "neutral", crouch: f >= HANDS12[0] && f < TURN12[1] + 4 ? 0.12 : 0 }); if (!s) return;
  if (f >= HANDS12[0] - 8 && f < TURN12[1] + 8) { const k = smooth(ramp(f, HANDS12[0] - 8, HANDS12[0])) * (1 - smooth(ramp(f, TURN12[1], TURN12[1] + 8))), c = BOXC(), r = cam.right;
    for (const sd of [-1, 1] as const) arm3d(out, cam, "creator", p, s.fo, sd, lerp3(restHand(cam, "creator", p, s.fo, sd), [c[0] + r.x * sd * 0.19, c[1], c[2] + r.z * sd * 0.19], k), f); }
  else rest2(out, cam, "creator", p, s.fo, f);
};
/** her phone in front of her chest, screen toward her eyes (plan: S15's POV point) */
export const HERPHONE = (): V3 => Rm(R.her[0], 1.2, R.her[1] + 0.38);
const s14 = (out: Stage, cam: CamInfo, f: number) => {
  const p = HERP(), s = person(out, cam, "creator", p, f, { expr: "neutral" }); const ph = HERPHONE(), bob = 0.008 * Math.abs(Math.sin(f * 0.5));
  out.props.herPhone = { p: [ph[0], ph[1] + bob, ph[2]] };
  if (s) both(out, cam, "creator", p, s.fo, [ph[0], ph[1] + bob, ph[2]], 0.045, f, -0.04);
};
const s15 = (out: Stage, cam: CamInfo, f: number) => { const ph = HERPHONE(); out.props.herPhone = { p: ph }; void f; void cam;
  // her two arms rise from below the lens to the phone's sides
  const r = cam.right, c = new THREE.Vector3(...ph), J = frontPts(C.creator, { seed: IDX.creator + 1 });
  for (const sd of [-1, 1]) seg3d(out, cam, [ph[0] + r.x * sd * 0.2, ph[1] - 0.25, ph[2] - 0.12], [c.x + r.x * sd * 0.042, c.y - 0.03, c.z + r.z * sd * 0.042], J.armW * SU, J.armCol, J.hand * 2 * SU); };
const s16 = (out: Stage, cam: CamInfo, f: number) => { herRest(out, cam, f, { expr: "neutral" }); };

// ---- the viewer's phone POV: his arms come up from below the lens to the phone's sides ----
const povArms = (out: Stage, cam: CamInfo) => {
  const PH = ST.phone, c = Sm(PH.c[0], PH.c[1], PH.c[2]), J = frontPts(C.viewer, { seed: IDX.viewer + 1 }), up = PH.up as number[];
  for (const sd of [-1, 1]) { const e: V3 = [c[0] - sd * PH.w * 0.52, c[1] - up[1] * PH.h * 0.15, c[2] - up[2] * PH.h * 0.15];
    seg3d(out, cam, [e[0] - sd * 0.14, e[1] - 0.3, e[2] - 0.2], e, J.armW * SU, J.armCol, J.hand * 2 * SU); }
};
const pov = (out: Stage, cam: CamInfo, f: number) => { povArms(out, cam); void f; };

// ---- the resale shop ----
const s07 = (out: Stage, cam: CamInfo, f: number) => { const s = person(out, cam, "seller", Mm(MK.seller[0], 0, MK.seller[1]), f, { expr: "grin" }); if (s) rest2(out, cam, "seller", s.p, s.fo, f); };
const s08 = (out: Stage, cam: CamInfo, f: number) => {
  const sp = Mm(MK.seller[0], 0, MK.seller[1]), tap = f >= TILL8 - 10 && f < TILL8 + 8;
  const s = person(out, cam, "seller", sp, f, { expr: "grin", crouch: tap ? 0.18 : 0 });
  if (s) { const till = Mm(MK.till[0], MK.top + 0.14, MK.till[1]); arm3d(out, cam, "seller", sp, s.fo, 1, tap ? lerp3(restHand(cam, "seller", sp, s.fo, 1), till, smooth(ramp(f, TILL8 - 10, TILL8 - 2))) : restHand(cam, "seller", sp, s.fo, 1), f); arm3d(out, cam, "seller", sp, s.fo, -1, restHand(cam, "seller", sp, s.fo, -1), f); }
  const h = person(out, cam, "creator", Mm(MK.her[0], 0, MK.her[1]), f, { expr: f >= PLINK8 ? "smile_closed" : "smile", look: f < PLINK8 ? 0.6 : 0 }, [PLINK8]); if (h) rest2(out, cam, "creator", h.p, h.fo, f);
  const c = coinAt(8, f);
  if (c) { const x = MK.till[0] + (MK.jar[0] - MK.till[0]) * c[0], z = MK.till[1] + (MK.jar[1] - MK.till[1]) * c[0], y = MK.top + 0.035 + (c[1] > 0 ? 0.2 - 0.25 * c[1] : 0.2 * (c[0] > 0.9 ? 1 : 0));
    fxc(out, "coin", 128, 128, (pp) => art2.coin(pp, 128), Mm(x, c[1] > 0 ? MK.top + 0.22 - 0.18 * c[1] : MK.top + 0.035, z), 0.07, 0.07, { rot: f * 0.4 }); void y; }
  if (f >= PLINK8) fxc(out, "coinIn", 128, 128, (pp) => art2.coin(pp, 128), Mm(MK.jar[0], MK.top + 0.04, MK.jar[1]), 0.06, 0.06);
};

// ---- the plaza ----
const CROWD: Who[] = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];
const PCOL = ["#f2785a", "#4fb0e8", "#2f9a55", "#f2c23a", "#e85a9a", "#3f78d8", "#d8322f"];
const s09 = (out: Stage, cam: CamInfo, f: number) => {
  ST.crowd.forEach((m, i) => {
    const p = Sm(m[0], 0, m[1]), isAsk = m[0] === ST.asker[0] && m[1] === ST.asker[1];
    const shocked = f >= UP9, fo: FrontOpts = { expr: f >= UP9 ? (isAsk ? "stern" : "shock") : "neutral", gape: shocked && !isAsk ? 0.5 * smooth(ramp(f, UP9, UP9 + 4)) : 0, look: f >= SIGN9[0] + 4 && !isAsk ? (m[0] < ST.asker[0] ? 1 : -1) * 0.7 : 0 };
    if (!isAsk) { phoneHolder(out, cam, CROWD[i], p, f, fo, PCOL[i], f >= BUZZ9 && f < BUZZ9 + 14, [UP9]); return; }
    const s = person(out, cam, CROWD[i], p, f, fo, [UP9]); if (!s) return;
    const low = chestAt(cam, CROWD[i], p, s.fo, 0.55, 0.18), high: V3 = [low[0], low[1] + 0.75, low[2]], k = smooth(ramp(f, SIGN9[0], SIGN9[1])), c = lerp3(low, high, k);
    both(out, cam, CROWD[i], p, s.fo, c, 0.17, f, -0.08);
    fxc(out, "placard", 500, 320, (pp) => art2.placard(pp, 500, 320), c, 0.5, 0.32);
  });
};
const s17 = (out: Stage, cam: CamInfo, f: number) => {
  const [bx, , bz] = ST.board;
  for (const [i, dx] of [[0, -1.6], [1, 1.6]] as [number, number][]) { const s = person(out, cam, i ? "v5" : "v2", Sm(bx + dx, 0, bz + 0.8), f, { expr: i ? "neutral" : "shock", look: -Math.sign(dx) * 0.6 }); if (s) rest2(out, cam, i ? "v5" : "v2", s.p, s.fo, f); }
};

// ---- the dock ----
const s11 = (out: Stage, cam: CamInfo, f: number) => {
  const A = Dm(DK.courier_from[0], 0, DK.courier_from[1]), B = Dm(DK.courier[0], 0, DK.courier[1]), k = smooth(ramp(f, WALK11[0], WALK11[1])), p = lerp3(A, B, k);
  const walking = f >= WALK11[0] && f < WALK11[1], fo: FrontOpts = { mode: walking ? "march" : "stand", phase: walkPhase(f, 2), expr: "smile", armOff: 2, crouch: f >= SET11[0] && f < SET11[1] + 6 ? 0.2 * Math.sin(Math.PI * ramp(f, SET11[0], SET11[1] + 6)) : 0 };
  if (near(cam, p)) return;
  front(out, cam, "courier", ...p, fo, f);
  const top: V3 = Dm(DK.carton[0], DK.top + DK.carton_size[1] / 2 + 0.004, DK.carton[1]);
  let c: V3 = chestAt(cam, "courier", p, fo, 0.5, 0.24);
  if (f >= SET11[0]) c = lerp3(chestAt(cam, "courier", p, fo, 0.5, 0.24), top, smooth(ramp(f, SET11[0], SET11[1])));
  if (f < SET11[1] + 2) { both(out, cam, "courier", p, fo, c, 0.26, f); out.props.carton = { p: c }; }
  else { out.props.carton = { p: top }; rest2(out, cam, "courier", p, fo, f); }
};

// ---- the cinema ----
const s13 = (out: Stage, cam: CamInfo, f: number) => {
  const tp = Sm(ST.tinman[0], 0, ST.tinman[1]), s = person(out, cam, "tinman", tp, f, { expr: f >= TIN13[0] ? "grin" : "smile" });
  if (s) { const low = chestAt(cam, "tinman", tp, s.fo, 0.45, 0.18), rr = cam.right, high: V3 = [low[0] - rr.x * 0.3, low[1] + 0.3, low[2] - rr.z * 0.3], c = lerp3(low, high, smooth(ramp(f, TIN13[0], TIN13[1])));
    both(out, cam, "tinman", tp, s.fo, c, 0.16, f); fxc(out, "tin", 400, 400, (pp) => art2.filmTin(pp, 400), c, 0.36, 0.36);
    if (f >= TIN13[1] && f < TIN13[1] + 14) out.fx.push({ key: `spkT${q((f - TIN13[1]) / 14, 30)}`, cw: 400, ch: 400, draw: (pp) => art.sparkle(pp, (f - TIN13[1]) / 14), x: c[0] + 0.15, y: c[1] + 0.2, z: c[2] + 0.05, w: 0.35, h: 0.35 }); }
  const op = Sm(ST.tout[0], 0, ST.tout[1]), flipping = f >= FLIP13[0] - 8 && f < FLIP13[1] + 4;
  const t = person(out, cam, "tout", op, f, { expr: "grin", look: f < FLIP13[0] ? -0.6 : 0 }, [FLIP13[0]]);
  if (t) { const sg = Sm(ST.sign[0] + 0.24, ST.sign[1], ST.sign[2] - 0.02); arm3d(out, cam, "tout", op, t.fo, 1, flipping ? lerp3(restHand(cam, "tout", op, t.fo, 1), sg, smooth(ramp(f, FLIP13[0] - 8, FLIP13[0]))) : restHand(cam, "tout", op, t.fo, 1), f); arm3d(out, cam, "tout", op, t.fo, -1, restHand(cam, "tout", op, t.fo, -1), f); }
};

// ---- the street wide ----
const s21 = (out: Stage, cam: CamInfo, f: number) => {
  const vp = Sm(ST.view[0], 0, ST.view[1]), s = person(out, cam, "viewer", vp, f, { expr: "neutral" });
  if (s) { const PH = ST.phone, c = Sm(PH.c[0], PH.c[1], PH.c[2]); both(out, cam, "viewer", vp, s.fo, c, 0.045, f, -0.02); }
  ST.walkers.forEach((m, i) => phoneHolder(out, cam, CROWD[(i + 1) % 7], Sm(m[0], 0, m[1]), f, { expr: i % 2 ? "smile" : "neutral" }, PCOL[(i + 2) % 7]));
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const none = () => undefined;
  const S: Record<number, (o: Stage, c: CamInfo, f: number) => void> = {
    1: s01, 2: pov, 3: s03, 4: (o, c, ff) => herRest(o, c, ff), 5: s05, 6: pov, 7: s07, 8: s08, 9: s09, 10: s10, 11: s11, 12: s12, 13: s13, 14: s14, 15: s15,
    16: s16, 17: s17, 18: pov, 19: none, 20: pov, 21: s21 };
  S[id](out, cam, f);
  return out;
};
void art; void tier; void fxPuff; void SKIN; void easeOut; void holdHand; void glowAt; void tcardFx; void blob; void fxBurst; void fxSplash; void fxRing;
