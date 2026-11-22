// The Lucas reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import * as S from "./story";
import { FPS, SHOTS, V3, at, HO, HA, SR, SP, clamp01, smooth, easeOut, pop, HOME, HALL, STREET, SHOP } from "./story";
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
const IDX: Record<Who, number> = { lucas: 1, lucasShades: 1, fiance: 2, dealer: 3, dealerShades: 3, clerk: 4, f1: 5, f2: 6, f3: 7, q0: 8, q1: 9, q2: 10, q3: 11, q4: 12, q5: 13, q6: 14 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[lucas] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
import { fxStars } from "../../engine/toon";
const Hw = (x: number, y: number, z: number) => at(HO, x, y, z);
const Aw = (x: number, y: number, z: number) => at(HA, x, y, z);
const Rw = (x: number, y: number, z: number) => at(SR, x, y, z);
const Pw = (x: number, y: number, z: number) => at(SP, x, y, z);
// seat heights in head-heights above the soles (an adult head-height is ~0.51 m)
const SEAT_CHAIR = 0.9;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const flat = (out: Stage, key: string, draw: (p: Pen) => void, p: V3, s: number, rot = 0, h = s) => card(out, key, 200, Math.round(200 * h / s), draw, p[0], p[1], p[2], s, h, { flat: true, rot });
/** a pack in hand (billboard, the real-art front) */
const packFx = (out: Stage, k: number, p: V3, h = 0.12, rot = 0) => card(out, `pack|${k % 4}`, 220, 360, (pp) => art2.packFront(pp, k), p[0], p[1], p[2], h * 0.61, h, { rot });
/** a point on the card's mouth, in the world */
const mouthAt = (cam: CamInfo, who: Who, at3: V3, fo: FrontOpts): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [, sy] = J.shoulder(1);
  const w = cardWorld(cam, at3[0], at3[1], at3[2], [300 + 3 * J.u * (fo.facing ?? 0), sy - 0.42 * J.HH]);
  return [w[0] - cam.fwd.x * 0.06, w[1], w[2] - cam.fwd.z * 0.06];
};
const eyeAt = (cam: CamInfo, who: Who, at3: V3, fo: FrontOpts, side: number): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [, sy] = J.shoulder(1);
  const w = cardWorld(cam, at3[0], at3[1], at3[2], [300 + side * 18 * J.u, sy - 0.75 * J.HH]);
  return [w[0] - cam.fwd.x * 0.1, w[1], w[2] - cam.fwd.z * 0.1];
};

// ---- the weighing (S01, S02, S08, S11): 24 packs, a stack to weigh (right), a weighed stack (left), the pan ----
export const PACKS = 24;
const GRAMS = [21.38, 21.12, 22.94, 21.4, 21.07, 22.61];
type Cycle = { t: number; i: number };
/** weigh cycles per scene and how many packs were weighed before the scene */
const CYCLES: Record<number, { done0: number; cyc: number[] }> = { 1: { done0: 6, cyc: S.WEIGH1 }, 2: { done0: 9, cyc: S.WEIGH2 }, 11: { done0: 6, cyc: S.WEIGH11 } };
export type Weigh = { done: number; pan: number | null; grams: number | null; held: { k: number; p: "todo" | "pan" | "done" | "lamp"; u: number; to: "pan" | "done" | "lamp" | "todo" } | null; armR: [string, string, number] | null; armL: [string, string, number] | null; lamp: number; loupe: number };
/** the state of the weighing at frame f: what is on the pan, which pack is in which hand, where each hand is going */
export const weighAt = (id: number, f: number): Weigh => {
  const w: Weigh = { done: 0, pan: null, grams: null, held: null, armR: null, armL: null, lamp: 0, loupe: 0 };
  if (id === 8) {
    w.done = PACKS - 1; w.pan = PACKS - 1; w.grams = 21.66;
    const [a, b] = S.LAST8;
    if (f >= a - 6 && f < a) w.armL = ["rest", "pan", (f - a + 6) / 6];
    else if (f >= a && f < b) { w.pan = null; w.held = { k: PACKS - 1, p: "pan", u: (f - a) / (b - a), to: "done" }; w.armL = ["pan", "done", (f - a) / (b - a)]; }
    else if (f >= b) { w.pan = null; w.done = PACKS; w.armL = ["done", "rest", clamp01((f - b) / 6)]; w.grams = null; }
    return w;
  }
  const c = CYCLES[id]; if (!c) return w;
  w.done = c.done0;
  for (const t of c.cyc) {
    const i = w.done, d = f - t;
    if (d < 0) break;
    if (d < 5) { w.armR = ["rest", "todo", d / 5]; break; }
    if (d < 11) { w.held = { k: i, p: "todo", u: (d - 5) / 6, to: "pan" }; w.armR = ["todo", "pan", (d - 5) / 6]; break; }
    w.pan = i; w.grams = GRAMS[i % GRAMS.length];
    if (d < 16) { w.armR = ["pan", "rest", (d - 11) / 5]; break; }
    if (d < 18) break;
    if (d < 22) { w.armL = ["rest", "pan", (d - 18) / 4]; break; }
    if (d < 28) { w.pan = null; w.held = { k: i, p: "pan", u: (d - 22) / 6, to: "done" }; w.armL = ["pan", "done", (d - 22) / 6]; break; }
    w.pan = null; w.done = i + 1;
    if (d < 33) { w.armL = ["done", "rest", (d - 28) / 5]; break; }
  }
  // the alchemist: a pack to the lamp and the loupe at the eye (S01 f208 on; S02 back to the stack f268-282; S11 from the freeze push)
  const L0 = id === 1 ? S.LAMP1[0] : id === 11 ? 1462 : -1;
  if (L0 > 0 && f >= L0) {
    const d = f - L0, k = w.done;
    if (d < 5) w.armR = ["rest", "todo", d / 5];
    else { w.held = { k, p: "todo", u: clamp01((d - 5) / 13), to: "lamp" }; w.armR = ["todo", "lamp", clamp01((d - 5) / 13)]; }
    w.armL = ["rest", "loupe", clamp01((d - 6) / 12)]; w.loupe = clamp01((d - 6) / 12);
    w.lamp = id === 1 ? clamp01((f - S.GOLD1) / 10) : 0.6;
  }
  if (id === 2 && f < 282) { // the lamp pack goes back onto the stack, the loupe down
    const u = clamp01((f - 268) / 12);
    w.held = { k: w.done, p: "lamp", u, to: "todo" }; w.armR = ["lamp", "todo", u]; w.armL = ["loupe", "rest", u]; w.loupe = 1 - u; w.lamp = 1 - u;
    if (u >= 1) { w.held = null; w.armR = ["todo", "rest", 1]; }
  }
  return w;
};
/** set-local spots on the table */
const TODO_TOP = (n: number): V3 => [HOME.todo[0], HOME.table_y + 0.004 + 0.0085 * n, HOME.todo[2]];
const DONE_TOP = (n: number): V3 => [HOME.done[0], HOME.table_y + 0.004 + 0.0085 * n, HOME.done[2]];
const PAN: V3 = [HOME.scale[0], HOME.table_y + 0.031, HOME.scale[2] - 0.008];
const LAMP_PT: V3 = [0.26, 1.24, -1.36];
const spot = (s: string, w: Weigh, dealerP: V3, cam: CamInfo, fo: FrontOpts, side: number): V3 => {
  if (s === "todo") return Hw(...TODO_TOP(PACKS - w.done)); if (s === "done") return Hw(...DONE_TOP(w.done)); if (s === "pan") return Hw(...PAN);
  if (s === "lamp") return Hw(...LAMP_PT); if (s === "loupe") { const e = eyeAt(cam, "dealer", dealerP, fo, -1); return [e[0], e[1] - 0.07, e[2]]; }
  return restHand(cam, "dealer", dealerP, fo, side);
};
const DEALER_FO = (id: number, f: number, w: Weigh): FrontOpts => ({ mode: "sit", chair: SEAT_CHAIR, armOff: 2, look: 0,
  expr: id === 11 && f >= S.FREEZE11 ? "stern" : w.loupe > 0.5 ? "stern" : id === 8 ? "neutral" : "smile_closed",
  prop: id === 8 && f >= 1172 ? ["hold", "phone"] : null });
const dealerSeated = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = Hw(HOME.dealer[0], 0, HOME.dealer[1]), w = weighAt(id, f), fo = DEALER_FO(id, f, w);
  if (id === 8 && f >= 1172) { fo.armOff = -1; }
  front(out, cam, "dealer", ...P, fo, f, id === 8 ? [1172, S.TAP8] : []);
  const armTo = (a: [string, string, number] | null, side: -1 | 1) => {
    if (!a) return arm3d(out, cam, "dealer", P, fo, side, restHand(cam, "dealer", P, fo, side), f);
    const A = spot(a[0], w, P, cam, fo, side), B = spot(a[1], w, P, cam, fo, side), u = smooth(a[2]);
    const lift = Math.sin(Math.PI * u) * 0.06;
    return arm3d(out, cam, "dealer", P, fo, side, [lerpN(A[0], B[0], u), lerpN(A[1], B[1], u) + lift, lerpN(A[2], B[2], u)], f);
  };
  let hR: V3 | null = null, hL: V3 | null = null;
  if (!(id === 8 && f >= 1172)) hR = armTo(w.armR, 1);
  hL = armTo(w.armL, -1);
  if (w.held) { const hh2 = w.held.to === "done" || w.held.p === "pan" ? hL : hR; if (hh2) packFx(out, w.held.k, [hh2[0], hh2[1] + 0.045, hh2[2] + 0.01], w.held.to === "lamp" || w.held.p === "lamp" ? 0.15 : 0.11, 0.1); }
  if (w.loupe > 0 && hL) card(out, "loupe", 200, 200, (pp) => art2.loupe(pp), hL[0] + 0.02, hL[1] + 0.05, hL[2] + 0.02, 0.11, 0.11);
  if (w.lamp > 0.05) { const lp = Hw(...LAMP_PT); glowAt(out, "alch", [lp[0], lp[1], lp[2] + 0.02], 0.34 * w.lamp, "255,214,90"); if (id === 1) sparkle(out, f, S.GOLD1, lp[0] + 0.1, lp[1] + 0.12, lp[2] + 0.04, 0.09, 18); }
  if (id === 8 && f >= S.TAP8 - 3 && f < S.TAP8 + 4) burst(out, f, S.TAP8, P[0] - 0.1, 1.25, P[2] + 0.2, 0.08, 5, "#ffffff");
};
/** the dealer walks in through the door (S01 f16-62): side view along -x behind the table, then steps forward and sits */
const dealerIn = (out: Stage, cam: CamInfo, f: number) => {
  const [w0, w1] = S.WALK1;
  if (f < w0) return;
  const A = Hw(1.6, 0, -2.2), B = Hw(HOME.dealer[0], 0, -2.0), M = Hw(HOME.dealer[0], 0, HOME.dealer[1]);
  if (f < w1) { const u = (f - w0) / (w1 - w0), p = lerp3(A, B, u); side(out, cam, "dealer", ...p, -1, 0, { mode: "march", phase: walkPhase(f, 1.4), stride: 0.55, expr: "smile_closed" }, f); return; }
  const u = smooth(ramp(f, w1, S.SIT1[0] + 6));
  front(out, cam, "dealer", ...lerp3(B, M, u), { mode: f < S.SIT1[0] + 6 ? "stroll" : "sit", chair: SEAT_CHAIR, phase: walkPhase(f, 1.4), expr: "smile_closed" }, f, [w1]);
};
/** Lucas standing at his home mark */
const lucasHome = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = Hw(HOME.lucas[0], 0, HOME.lucas[1]);
  if (id === 9) {
    const read = f >= S.READ9, shock = f >= S.GAPE9;
    const fo: FrontOpts = { mode: "stand", expr: shock ? "shock" : "neutral", gape: shock ? q(Math.min(0.7, 0.7 * (f - S.GAPE9) / 4), 20) : undefined, prop: read ? ["hold", "phone"] : null, look: 0 };
    front(out, cam, "lucas", ...P, fo, f, [S.READ9, S.GAPE9]);
    if (f >= S.BUZZ9 && f < S.BUZZ9 + 12 && !read) burst(out, f, S.BUZZ9, P[0] + 0.25, 0.95, P[2] + 0.1, 0.16, 8, "#ffffff");
    return;
  }
  const expr = id === 8 ? (f >= S.PAID8 ? "grin" : "neutral") : id === 2 ? (f >= 300 ? "dazed" : "neutral") : "neutral";
  front(out, cam, "lucas", ...P, { mode: "stand", expr, look: 1 }, f, id === 8 ? [S.PAID8] : id === 2 ? [300] : []);
};
const lucasTubs = (out: Stage, cam: CamInfo, f: number) => {
  const [a, b] = S.WALK3, A = Hw(HOME.lucas[0], 0, HOME.lucas[1]), B = Hw(HOME.lucas_bins[0], 0, HOME.lucas_bins[1]);
  if (f < b) { side(out, cam, "lucas", ...lerp3(A, B, smooth(ramp(f, a, b))), 1, 0, { mode: f >= a ? "march" : "stand", phase: walkPhase(f, 1.4), stride: 0.6, expr: "smile" }, f); }
  else {
    const amazed = f >= S.RISE3[3] + 4 && f < 604;
    front(out, cam, "lucas", ...B, { mode: "stand", expr: amazed ? "shock" : f >= S.RISE3[0] ? "grin" : "smile", gape: amazed ? 0.35 : undefined, look: 1 }, f, [b, S.RISE3[0], S.RISE3[3] + 4, 604]);
  }
  const F = Hw(HOME.fiance[0], 0, HOME.fiance[1]), pointing = f >= S.PAT3[0] && f < S.PAT3[1] + 20;
  const fo: FrontOpts = { mode: "stand", expr: "grin", look: 1, armOff: pointing ? 1 : undefined };
  front(out, cam, "fiance", ...F, fo, f, [S.PAT3[0]]);
  if (pointing) { const sh = shoulderAt(cam, "fiance", F, fo, 1), tub = Hw(HOME.bins[2][0], 0.6, HOME.bins[2][1]), d = v3(tub).sub(v3(sh)).normalize().multiplyScalar(0.46 * smooth(ramp(f, S.PAT3[0], S.PAT3[0] + 6)) + 0.01);
    arm3d(out, cam, "fiance", F, fo, 1, [sh[0] + d.x, sh[1] + d.y, sh[2] + d.z], f); }
};
const chorus = (out: Stage, cam: CamInfo, f: number) => {
  const who: Who[] = ["f1", "f2", "f3"];
  HOME.chorus.forEach(([x, z], i) => {
    const P = Hw(x, 0, z), laughing = f >= S.LAUGH4 && f < S.WAVE4[1], eat = f >= S.CANDY4[0];
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: laughing ? "laugh" : eat ? "grin" : "smile", armOff: eat ? 1 : undefined,
      wave: i === 1 && f >= S.WAVE4[0] && f < S.WAVE4[1] ? 0.5 + 0.5 * Math.sin((f - S.WAVE4[0]) * 0.5) : undefined, headTilt: laughing ? 0.08 * Math.sin((f - S.LAUGH4) * 0.6 + i) : 0 };
    front(out, cam, who[i], ...P, fo, f, [S.LAUGH4, S.CANDY4[0]]);
    if (eat) {
      const u = smooth(ramp(f, S.CANDY4[0] + i * 2, S.CANDY4[1] - 2 + i)), H0 = holdHand(cam, who[i], P, fo, 1, 0.12), M = mouthAt(cam, who[i], P, fo);
      const Hn = arm3d(out, cam, who[i], P, fo, 1, lerp3(H0, M, u), f);
      if (u < 1) card(out, "candyB" + (i % 3), 60, 60, (pp) => pp.ell(30, 30, 22, 22, ["#e2453c", "#f2c84a", "#2f9a55"][i % 3], 4), Hn[0], Hn[1] + 0.02, Hn[2] + 0.01, 0.035, 0.035);
    }
  });
};
/** the card-show queue: everyone shuffles forward twice; Lucas last, his truck behind him */
export const queueShift = (f: number) => -0.3 * smooth(ramp(f, S.SHUF5[0], S.SHUF5[0] + 12)) - 0.3 * smooth(ramp(f, S.SHUF5[1], S.SHUF5[1] + 12));
const queue = (out: Stage, cam: CamInfo, f: number) => {
  const sh = queueShift(f), moving = S.SHUF5.some((t) => f >= t && f < t + 12);
  const who: Who[] = ["q0", "q1", "q2", "q3", "q4", "q5", "q6"];
  HALL.queue.forEach(([x, z], i) => side(out, cam, who[i], ...Aw(x + sh, 0, z), -1, 0, { mode: moving ? "march" : "stand", phase: walkPhase(f + i * 3, 1.2), stride: 0.4, expr: i % 3 ? "neutral" : "dazed" }, f));
  side(out, cam, "lucas", ...Aw(HALL.lucas[0] + sh, 0, HALL.lucas[1]), -1, 0, { mode: moving ? "march" : "stand", phase: walkPhase(f, 1.2), stride: 0.4, expr: "dazed", reach: 0 }, f);
};
/** Lucas at the wheel (S12): seated inside the hatchback, his head in the side window */
export const carX = (f: number) => { const [a, b] = STREET.drive, [x0, x1] = STREET.drive_x; return lerpN(x0, x1, glideU((f - a) / (b - a))); };
const glideU = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const driver = (out: Stage, cam: CamInfo, f: number) => {
  front(out, cam, "lucas", ...Rw(carX(f) + 0.25, 0.12, STREET.car_z - 0.35), { mode: "sit", chair: SEAT_CHAIR, expr: "stern", look: -1 }, f);
};
/** the lot (S13): shades, envelope for the box */
const lotScene = (out: Stage, cam: CamInfo, f: number) => {
  const u = smooth(ramp(f, S.STEP13[0], S.STEP13[1])), walking = f >= S.STEP13[0] && f < S.STEP13[1];
  const LP = Rw(lerpN(STREET.lucas[0], STREET.lucas_meet[0], u), 0, STREET.lucas[1]), DP = Rw(lerpN(STREET.dealer[0], STREET.dealer_meet[0], u), 0, STREET.dealer[1]);
  const lo: FrontOpts = { mode: walking ? "stroll" : "stand", phase: walkPhase(f, 1.2), expr: f >= 1790 ? "sad" : "stern", armOff: 2, look: 1 };
  const dn: FrontOpts = { mode: walking ? "stroll" : "stand", phase: walkPhase(f + 7, 1.2), expr: "stern", armOff: 2, look: -1 };
  front(out, cam, "lucasShades", ...LP, lo, f, [1790]); front(out, cam, "dealerShades", ...DP, dn, f);
  const mid: V3 = Rw((STREET.lucas_meet[0] + STREET.dealer_meet[0]) / 2, 1.08, STREET.lucas[1] + 0.12);
  // the envelope: Lucas's right hand -> held out -> the dealer's left hand -> thumbed -> his pocket
  const lHold = holdHand(cam, "lucasShades", LP, lo, 1, 0.1), dRest = restHand(cam, "dealerShades", DP, dn, -1);
  let env: V3 | null = null, lucR: V3, dealL: V3;
  if (f < S.OFFER13[0]) { env = lHold; lucR = lHold; dealL = dRest; }
  else if (f < S.TAKE13) { env = lerp3(lHold, mid, smooth(ramp(f, S.OFFER13[0], S.OFFER13[1]))); lucR = env; dealL = lerp3(dRest, mid, smooth(ramp(f, S.TAKE13 - 6, S.TAKE13))); }
  else if (f < S.THUMB13[1] + 2) { const dh = holdHand(cam, "dealerShades", DP, dn, -1, 0.14); env = lerp3(mid, dh, smooth(ramp(f, S.TAKE13, S.TAKE13 + 5))); dealL = env; lucR = lerp3(mid, restHand(cam, "lucasShades", LP, lo, 1), smooth(ramp(f, S.TAKE13, S.TAKE13 + 8))); }
  else { const pk = restHand(cam, "dealerShades", DP, dn, -1), dh = holdHand(cam, "dealerShades", DP, dn, -1, 0.14); dealL = lerp3(dh, pk, smooth(ramp(f, S.THUMB13[1] + 2, S.THUMB13[1] + 8))); env = f < S.THUMB13[1] + 8 ? dealL : null; lucR = restHand(cam, "lucasShades", LP, lo, 1); }
  // the box: in the dealer's arms (his right hand only once the left takes the envelope) -> pushed into Lucas's arms
  const dChest = chestAt(cam, "dealerShades", DP, dn, 0.5, 0.16), lChest = chestAt(cam, "lucasShades", LP, lo, 0.5, 0.16);
  const bu = smooth(ramp(f, S.BOX13[0], S.BOX13[1])), boxP = lerp3(dChest, lChest, bu);
  const r = cam.right, off = 0.17;
  const dR = arm3d(out, cam, "dealerShades", DP, dn, 1, f < S.BOX13[1] - 4 ? [boxP[0] + r.x * off, boxP[1], boxP[2] + r.z * off] : restHand(cam, "dealerShades", DP, dn, 1), f); void dR;
  const dLeftOnBox = f < S.OFFER13[1] || (f >= S.BOX13[0] && f < S.BOX13[1] - 4);
  arm3d(out, cam, "dealerShades", DP, dn, -1, dLeftOnBox && f >= S.BOX13[0] ? [boxP[0] - r.x * off, boxP[1], boxP[2] - r.z * off] : f < S.OFFER13[0] - 8 ? [boxP[0] - r.x * off, boxP[1], boxP[2] - r.z * off] : dealL, f);
  const lucasOnBox = f >= S.BOX13[1] - 6;
  arm3d(out, cam, "lucasShades", LP, lo, 1, lucasOnBox ? [boxP[0] + r.x * off, boxP[1], boxP[2] + r.z * off] : lucR, f);
  arm3d(out, cam, "lucasShades", LP, lo, -1, lucasOnBox ? [boxP[0] - r.x * off, boxP[1], boxP[2] - r.z * off] : restHand(cam, "lucasShades", LP, lo, -1), f);
  out.props.box = { p: [boxP[0] - SR[0], boxP[1] - 0.12 - SR[1], boxP[2] - SR[2]], ry: 0 };
  if (env) { const th = f >= S.THUMB13[0] && f < S.THUMB13[1] ? 0.15 * Math.sin((f - S.THUMB13[0]) * 1.6) : 0; card(out, "envelope", 460, 220, (pp) => art2.envelopeFace(pp), env[0], env[1] + 0.03, env[2] + 0.02, 0.24, 0.115, { rot: th }); }
};
/** the shop (S14) */
const shopScene = (out: Stage, cam: CamInfo, f: number) => {
  const [a, b] = S.WALK14, A = Pw(SHOP.lucas_in[0], 0, SHOP.lucas_in[1]), B = Pw(SHOP.lucas[0], 0, SHOP.lucas[1]);
  const boxOn: V3 = Pw(SHOP.box[0], SHOP.counter_y, SHOP.box[2]);
  const nervous = f >= S.SUSP14 + 4;
  const lo: FrontOpts = { mode: "stand", expr: nervous ? "nervous" : "neutral", look: -1, armOff: 2 };
  let boxP: V3;
  if (f < b) {
    const p = lerp3(A, B, smooth(ramp(f, a, b)));
    side(out, cam, "lucas", ...p, -1, 0, { mode: f >= a ? "march" : "stand", phase: walkPhase(f, 1.4), stride: 0.55, expr: "neutral", reach: 1 }, f);
    boxP = [p[0] - 0.32, 1.02, p[2]];
  } else {
    front(out, cam, "lucas", ...B, lo, f, [b, S.SUSP14 + 4]);
    const c0 = chestAt(cam, "lucas", B, lo, 0.55, 0.2); boxP = lerp3(c0, [boxOn[0], boxOn[1] + 0.13, boxOn[2]], smooth(ramp(f, b, S.SET14 + 4)));
    const r = cam.right, onBox = f < S.SET14 + 8;
    const idA: V3 = [Pw(...(SHOP.idcard as V3))[0], SHOP.counter_y + 0.015, Pw(...(SHOP.idcard as V3))[2]];
    const slideU = smooth(ramp(f, S.ID14[0] + 4, S.ID14[1]));
    arm3d(out, cam, "lucas", B, lo, 1, onBox ? [boxP[0] + r.x * 0.17, boxP[1], boxP[2] + r.z * 0.17] : restHand(cam, "lucas", B, lo, 1), f);
    const lh = f >= S.ID14[0] - 6 && f < S.ID14[1] + 6 ? lerp3(restHand(cam, "lucas", B, lo, -1), idA, Math.sin(Math.PI * clamp01((f - S.ID14[0] + 6) / (S.ID14[1] - S.ID14[0] + 12)))) : restHand(cam, "lucas", B, lo, -1);
    arm3d(out, cam, "lucas", B, lo, -1, onBox ? [boxP[0] - r.x * 0.17, boxP[1], boxP[2] - r.z * 0.17] : lh, f);
    void slideU;
    if (nervous) card(out, "sweat", 120, 160, (pp) => { pp.ell(60, 90, 26, 40, "#bfe6ff", 5); }, B[0] - 0.14, 1.72, B[2] + 0.05, 0.05, 0.07);
  }
  out.props.shopbox = { p: [boxP[0] - SP[0], boxP[1] - 0.13 - SP[1], boxP[2] - SP[2]], ry: 0 };
  // the clerk: takes the slid ID, scans it, stares, writes the check
  const K = Pw(SHOP.clerk[0], 0, SHOP.clerk[1]), susp = f >= S.SUSP14, atBox = f >= S.LOOKBOX14[0] && f < S.LOOKBOX14[1];
  const ko: FrontOpts = { mode: "stand", expr: susp ? "stern" : "neutral", look: atBox ? 1 : susp ? 1 : 0, armOff: 2, headTilt: susp && !atBox ? 0.06 : 0 };
  front(out, cam, "clerk", ...K, ko, f, [S.SUSP14, S.LOOKBOX14[0], S.LOOKBOX14[1]]);
  const idStart = Pw(...(SHOP.idcard as V3)), idNear = Pw(SHOP.check[0] + 0.1, SHOP.counter_y, SHOP.check[2] + 0.05), scanTop = Pw(SHOP.scanner[0], SHOP.counter_y + 0.1, SHOP.scanner[2]);
  let idP: V3 | null = null; let kR = restHand(cam, "clerk", K, ko, 1), kL = restHand(cam, "clerk", K, ko, -1);
  if (f >= S.ID14[0] && f < S.ID14[1]) idP = lerp3(idStart, idNear, easeOut(ramp(f, S.ID14[0] + 3, S.ID14[1])));
  else if (f >= S.ID14[1] && f < S.SCAN14[1] + 10) { const up2 = lerp3(idNear, scanTop, smooth(ramp(f, S.ID14[1], S.SCAN14[0]))); idP = f < S.SCAN14[0] ? up2 : [scanTop[0] + 0.03 * Math.sin((f - S.SCAN14[0]) * 0.5), scanTop[1], scanTop[2]]; kL = idP; }
  else if (f >= S.SCAN14[1] + 10) idP = idNear;
  if (idP) { const lying = f < S.ID14[1] || f >= S.SCAN14[1] + 10; if (lying) flat(out, "idcard", (pp) => art2.idCard(pp), [idP[0], SHOP.counter_y + 0.0035 + SP[1], idP[2]], 0.086, 0, 0.054); else card(out, "idcardV", 340, 214, (pp) => art2.idCard(pp), idP[0], idP[1], idP[2], 0.086, 0.054); }
  if (f >= S.SCAN14[0] && f < S.SCAN14[1]) { const u = (f - S.SCAN14[0]) / (S.SCAN14[1] - S.SCAN14[0]); glowAt(out, "laser", [scanTop[0], scanTop[1] - 0.04, scanTop[2] + 0.01 - 0.03 + 0.06 * u], 0.1, "255,40,40"); }
  // writing the check
  if (f >= S.WRITE14[0] - 8 && f < S.WRITE14[1] + 8) {
    const ck = Pw(...(SHOP.check as V3)), n = clamp01((f - S.WRITE14[0]) / (S.WRITE14[1] - S.WRITE14[0]));
    const pen: V3 = [ck[0] - 0.06 + 0.11 * n, ck[1] + 0.02 + 0.006 * Math.sin(f * 1.7), ck[2] + 0.005];
    kR = f < S.WRITE14[0] ? lerp3(restHand(cam, "clerk", K, ko, 1), pen, smooth(ramp(f, S.WRITE14[0] - 8, S.WRITE14[0]))) : f < S.WRITE14[1] ? pen : lerp3(pen, restHand(cam, "clerk", K, ko, 1), smooth(ramp(f, S.WRITE14[1], S.WRITE14[1] + 8)));
    if (f < S.WRITE14[1] + 2) seg3d(out, cam, [kR[0] - 0.01, kR[1] + 0.07, kR[2] + 0.02], [kR[0], kR[1] - 0.012, kR[2]], 0.007, "#2f5fb4");
  }
  arm3d(out, cam, "clerk", K, ko, 1, kR, f); arm3d(out, cam, "clerk", K, ko, -1, kL, f);
};
/** the couple at the table (S16 pizza, S18 rock candy) */
const couple = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const L = Hw(HOME.lucas_seat[0], 0, HOME.lucas_seat[1]), F = Hw(HOME.fiance_seat[0], 0, HOME.fiance_seat[1]);
  if (id === 16) {
    const turned = f >= S.TURN16;
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: turned ? "sad" : "smile_closed", facing: turned ? -1 : 0, look: turned ? -1 : 0, armOff: -1 };
    front(out, cam, "fiance", ...F, fo, f, [S.TURN16]);
    const sl = lerp3(Hw(HOME.pizza[0] + 0.08, HOME.table_y + 0.03, HOME.pizza[2]), holdHand(cam, "fiance", F, fo, -1, 0.14), smooth(ramp(f, S.SLICE16, S.SLICE16 + 14)));
    const hf = arm3d(out, cam, "fiance", F, fo, -1, sl, f);
    card(out, "sliceF", 200, 220, (pp) => art2.slice(pp, f >= S.SLICE16 + 14 ? 1 : 0), hf[0], hf[1] + 0.05, hf[2] + 0.01, 0.12, 0.13, { rot: 0.3 });
    const lo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: "sad", look: 1, armOff: 1, headTilt: f >= S.LOWER16 ? 0.05 * Math.sin((f - S.LOWER16) * 0.25) : 0 };
    front(out, cam, "lucas", ...L, lo, f, [S.LOWER16]);
    const down: V3 = Hw(HOME.lucas_seat[0] + 0.18, HOME.table_y + 0.01, -1.3), held = holdHand(cam, "lucas", L, lo, 1, 0.14);
    const hl = arm3d(out, cam, "lucas", L, lo, 1, lerp3(held, down, smooth(ramp(f, S.LOWER16, S.LOWER16 + 14))), f);
    if (f < S.LOWER16 + 14) card(out, "sliceL", 200, 220, (pp) => art2.slice(pp, 1), hl[0], hl[1] + 0.05, hl[2] + 0.01, 0.12, 0.13, { rot: -0.3 });
    else flat(out, "sliceDown", (pp) => art2.slice(pp, 0), [down[0], down[1] + 0.002, down[2]], 0.12, 0.4);
    return;
  }
  // S18
  const bite = f >= S.BITE18, shock = f >= S.BITE18 + 2;
  const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: shock ? "shock" : "smile_closed", gape: shock ? 0.4 : undefined, look: shock ? -1 : 0, facing: shock ? -1 : 0, armOff: undefined };
  front(out, cam, "fiance", ...F, fo, f, [S.BITE18 + 2]);
  flat(out, "sliceDown", (pp) => art2.slice(pp, 0), Hw(HOME.lucas_seat[0] + 0.18, HOME.table_y + 0.012, -1.3), 0.12, 0.4);
  const lo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: bite ? "pained" : f >= S.MOUTH18 ? "smile" : "smile_closed", armOff: -1, headTilt: bite ? 0.06 * Math.exp(-(f - S.BITE18) / 8) * Math.sin((f - S.BITE18) * 1.5) : 0 };
  front(out, cam, "lucas", ...L, lo, f, [S.MOUTH18, S.BITE18]);
  const bowl: V3 = Hw(HOME.candy[0], HOME.table_y + 0.14, HOME.candy[2]), M = mouthAt(cam, "lucas", L, lo);
  let h: V3;
  if (f < S.GRAB18 - 8) h = restHand(cam, "lucas", L, lo, -1);
  else if (f < S.GRAB18) h = lerp3(restHand(cam, "lucas", L, lo, -1), bowl, smooth(ramp(f, S.GRAB18 - 8, S.GRAB18)));
  else h = lerp3(bowl, [M[0] - cam.right.x * 0.03, M[1] - 0.1, M[2] - cam.right.z * 0.03], smooth(ramp(f, S.GRAB18, S.MOUTH18)));
  const H2 = arm3d(out, cam, "lucas", L, lo, -1, h, f);
  if (f >= S.GRAB18) card(out, `rock|${bite}`, 120, 300, (pp) => art2.rockCandy(pp, bite ? 1 : 0), H2[0], H2[1] + 0.07, H2[2] + 0.015, 0.05, 0.125, { rot: -0.25 });
  if (bite) {
    const hd = eyeAt(cam, "lucas", L, lo, 0);
    burst(out, f, S.BITE18, M[0], M[1] + 0.02, M[2] + 0.01, 0.3, 7, "#ffffff");
    const u = q((f - S.BITE18) % 24 / 24, 24);
    if (f < S.BITE18 + 40) card(out, `stars${u}`, 400, 200, (pp) => fxStars(pp, u), hd[0], hd[1] + 0.22, hd[2], 0.5, 0.25);
    // the crystal chip: pops up-left, falls to the table, one bounce, rests
    const t = (f - S.BITE18) / FPS, x0 = M[0], y0 = M[1] + 0.08, ty = HOME.table_y + 0.004 + HO[1];
    let cx = x0 - 0.5 * Math.min(t, 0.55), cy = y0 + 1.2 * t - 4.9 * t * t;
    const tl = (1.2 + Math.sqrt(1.44 + 19.6 * (y0 - ty))) / 9.8;
    if (t > tl) { const t2 = t - tl, v = 0.35 * (9.8 * tl - 1.2); cy = Math.max(ty, ty + v * t2 - 4.9 * t2 * t2); cx = x0 - 0.5 * Math.min(tl, 0.55) - 0.15 * Math.min(t2, 0.12); }
    const cz = M[2] + 0.25 * Math.min(t, tl) ;
    if (cy <= ty + 0.0005 && t > tl + 0.05) flat(out, "chip", (pp) => art2.chip(pp), [cx, ty + 0.002, cz], 0.025, 0.5);
    else card(out, "chipA", 40, 40, (pp) => art2.chip(pp), cx, cy, cz, 0.025, 0.025, { rot: t * 12 });
  }
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place;
  if (place === "home") {
    if (id === 1) { if (f < S.SIT1[0] + 6) dealerIn(out, cam, f); else dealerSeated(out, cam, f, id); }
    if (id === 2 || id === 8 || id === 11) dealerSeated(out, cam, f, id);
    if (id === 1 || id === 2 || id === 8 || id === 9) lucasHome(out, cam, f, id);
    if (id === 3) lucasTubs(out, cam, f);
    if (id === 4) chorus(out, cam, f);
    if (id === 16 || id === 18) couple(out, cam, f, id);
    // the lamp's warm glow
    const lb = Hw(...(HOME.lamp_head as V3));
    glowAt(out, "lampbulb", [lb[0] + 0.01, lb[1] - 0.05, lb[2]], 0.16, "255,214,150");
  }
  if (place === "hall" && id === 5) queue(out, cam, f);
  if (place === "street") {
    if (id === 12) driver(out, cam, f);
    if (id === 13) lotScene(out, cam, f);
    const lh = Rw(STREET.lamp[0], 5.8, STREET.lamp[1] + 1.3); glowAt(out, "sodium", lh, 1.6, "255,170,70");
  }
  if (place === "shop") shopScene(out, cam, f);
  return out;
};
