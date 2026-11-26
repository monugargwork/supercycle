// The Chicago reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN, Expr } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, SHo, HOo, JKo, clamp01, smooth, easeOut, hop, SHOPP, HOUSEP, JACKP,
  BILLS1, STEP1, LIFT1, HIDE1, RING4, LIFT4, WALK4, SET5, HANG5, DIP6, GRAB6, LIFT6, HIDE6, STEP7, KEY7, TAKE7, BILLS7, SHUT7, TUCK8, LIFTS8, SHELF8,
  KID13, TURN13, SHAKE13, DOOR14, STEP14, GIFT14, WALK15, SPOON15, HIDE15, SCRATCH16, LIFT16, WALK16, PUT16, LOCK16, SHAKE17, CUT17, DIAL18, POINT19, WRITE19,
  WALK20, PAT20, FAN20, RING21, PHONE21, FREEZE21,
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
const IDX: Record<Who, number> = { owner: 3, man: 4, kid: 5, teen: 6, woman: 7, teal: 8, cop: 9 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[chicago] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Hm = (x: number, y: number, z: number) => at(HOo, x, y, z);
const SEAT_CHAIR = 0.92;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const talkOpen = (f: number, a: number, b: number) => f >= a && f < b && Math.floor((f - a) / 5) % 2 === 1;
const P = SHOPP, TOPY = P.counter_y, HP = HOUSEP;
const mk = (m: number[]): V3 => Sm(m[0], 0, m[1]);
const mkH = (m: number[]): V3 => Hm(m[0], 0, m[1]);
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

// ---- the box and its items (positions in the world) ----
const BOXC = (): V3 => Sm((P.box[0] + P.box[1]) / 2, TOPY, (P.box[2] + P.box[3]) / 2);
const itemH = (i: number) => P.slab[1];
/** the top edge of item i where it stands in the box (the hand grips it there) */
const itemTop = (i: number): V3 => { const row = i < 5 ? P.rows.front : P.rows.back, y = TOPY + 0.006 + (i < 5 ? 0 : P.riser) + itemH(i); return Sm(P.slot_x[i % 5], y - 0.01, row + Math.sin(P.lean) * itemH(i) * 0.9); };
const itemCentre = (i: number): V3 => { const t = itemTop(i); return [t[0], t[1] + 0.01 - itemH(i) / 2, t[2] - Math.sin(P.lean) * itemH(i) * 0.45]; };
/** the man takes item i: reach (12 f before the lift), lift 15 cm by the top edge, carry to his chest, slip it behind the jacket */
const takeItem = (out: Stage, cam: CamInfo, f: number, i: number, lift: number[], hide: number[], body: V3, fo: FrontOpts, side: -1 | 1): V3 | null => {
  const [a, b] = lift, [, d] = hide, top = itemTop(i), up: V3 = [top[0], top[1] + 0.15, top[2] + 0.03];
  const chest = chestAt(cam, "man", body, fo, 0.5, 0.06), behind: V3 = [chest[0] + cam.fwd.x * 0.08, chest[1], chest[2] + cam.fwd.z * 0.08];
  if (f < a - 12 || f > d + 10) return null;
  const rest = restHand(cam, "man", body, fo, side);
  let hand: V3, held: V3 | null = null;
  if (f < a) hand = lerp3(rest, top, smooth((f - a + 12) / 12));
  else if (f < b) { hand = lerp3(top, up, smooth((f - a) / (b - a))); held = hand; }
  else if (f < d) { hand = lerp3(up, chest, smooth((f - b) / Math.max(1, d - b - 2))); held = f >= d - 2 ? behind : hand; }
  else hand = lerp3(chest, rest, smooth((f - d) / 10));
  arm3d(out, cam, "man", body, fo, side, hand, f);
  if (held) out.props[`item${i}`] = { p: [held[0], held[1] - itemH(i) / 2 + 0.01, held[2]], rx: -0.1 };
  return hand;
};
/** bills in an open palm (flat), n of them */
const billsFlat = (out: Stage, at: V3, n: number, key = "") => { for (let k = 0; k < n; k++) fxc(out, `billF${key}${k}`, 470, 200, (pp) => art2.bill(pp, 470, 200), [at[0] + 0.006 * k, at[1] + 0.004 * k, at[2] - 0.004 * k], 0.156, 0.066, { flat: true, rot: 0.15 * (k - 1) }); };
const billWad = (out: Stage, at: V3, key = "wad") => fxc(out, key, 470, 200, (pp) => art2.bill(pp, 470, 200), at, 0.1, 0.043, { rot: 0.3 });

// ---- the cast in the shop ----
const customers = (out: Stage, cam: CamInfo, f: number, id: number) => {
  if (id >= 16 && id <= 19) return;
  if (!near(cam, mk(P.kid))) front(out, cam, "kid", ...mk(P.kid), { mode: "stand", crouch: id === 13 ? 0.3 : 0.15, expr: id === 13 && f > KID13[0] + 20 ? "nervous" : "neutral", look: -1 }, f);
  front(out, cam, "teen", ...mk(P.teen), { mode: "stand", expr: "smile", look: 1 }, f);
  front(out, cam, "teal", ...mk(P.teal), { mode: "stand", expr: "neutral", look: -1 }, f);
  if (id === 3 || id === 4 || id === 5) front(out, cam, "woman", ...mk(P.woman), { mode: "stand", expr: "smile", look: 1 }, f);
};
/** the owner at a mark, one arm typing at the register (optional) */
const ownerAt = (out: Stage, cam: CamInfo, f: number, m: number[], expr: Expr, extra: Partial<FrontOpts> = {}, swaps: number[] = []) => {
  const p = mk(m); if (near(cam, p)) return null;
  const fo: FrontOpts = { mode: "stand", expr, ...extra };
  front(out, cam, "owner", ...p, fo, f, swaps);
  return { p, fo };
};
const typing = (out: Stage, cam: CamInfo, f: number, o: { p: V3; fo: FrontOpts }) => {
  const k = Sm(P.register[0] + 0.03 * Math.sin(f * 0.9), TOPY + 0.17 + (Math.floor(f / 4) % 2 ? 0.015 : 0), P.register[2] + 0.05);
  arm3d(out, cam, "owner", o.p, o.fo, 1, k, f);
};
const HANDOVER = (): V3 => Sm(1.08, 1.16, -1.15);
/** the cash: the owner slaps bills one by one into the man's palm (S01, S07) */
const cash = (out: Stage, cam: CamInfo, f: number, bills: number[], man: V3, manFo: FrontOpts, own: { p: V3; fo: FrontOpts } | null, start: number) => {
  const H = HANDOVER(), n = bills.filter((t) => f >= t).length, palm: V3 = [H[0], H[1], H[2]];
  if (f >= start && f < bills[2] + 8) {
    arm3d(out, cam, "man", man, manFo, 1, palm, f); billsFlat(out, [palm[0], palm[1] + 0.012, palm[2]], n, "p");
    if (own) { const next = bills.find((t) => f < t) ?? bills[2], dt = next - f, lift = dt > 0 && dt < 4 ? 0.06 * (dt / 4) : f - (bills.filter((t) => f >= t).pop() ?? -9) < 3 ? 0.0 : 0.05;
      const oh: V3 = [palm[0] + 0.05, palm[1] + 0.03 + lift, palm[2] - 0.05]; arm3d(out, cam, "owner", own.p, own.fo, -1, oh, f); billsFlat(out, [oh[0], oh[1] - 0.008, oh[2]], 3 - n, "o"); }
  } else if (f >= bills[2] + 8) {
    const hold = holdHand(cam, "man", man, manFo, 1); arm3d(out, cam, "man", man, manFo, 1, hold, f); billWad(out, [hold[0], hold[1] + 0.02, hold[2]]);
    if (own) arm3d(out, cam, "owner", own.p, own.fo, -1, restHand(cam, "owner", own.p, own.fo, -1), f);
  }
};

const s01 = (out: Stage, cam: CamInfo, f: number) => {
  const man = mk(P.man), fo: FrontOpts = { mode: "stand", expr: f < 96 ? "smile" : "grin", look: f > 100 && f < 140 ? 1 : 0, armOff: 2 };
  front(out, cam, "man", ...man, fo, f, [96]);
  let own: { p: V3; fo: FrontOpts } | null = null;
  if (f < STEP1[0]) own = ownerAt(out, cam, f, P.owner_pay, "smile", { armOff: -1 });
  else if (f < STEP1[1]) walkTo(out, cam, "owner", mk(P.owner_pay), mk(P.owner_reg), f, STEP1[0], STEP1[1], { expr: "smile" });
  else { const o = ownerAt(out, cam, f, P.owner_reg, "smile", { armOff: 1, look: -1 }); if (o) typing(out, cam, f, o); }
  // the cash lands in his right palm; he passes the wad to his left hand (f96-112), freeing the right one for the box
  const ch = chestAt(cam, "man", man, fo, 0.5, 0.12), lh = holdHand(cam, "man", man, fo, -1);
  if (f < 96) { cash(out, cam, f, BILLS1, man, fo, own, 0); arm3d(out, cam, "man", man, fo, -1, restHand(cam, "man", man, fo, -1), f); }
  else {
    const k = smooth(ramp(f, 96, 106)), rh = lerp3(HANDOVER(), ch, k), lk = f < 104 ? restHand(cam, "man", man, fo, -1) : lerp3(ch, lh, smooth(ramp(f, 106, 114)));
    arm3d(out, cam, "man", man, fo, -1, f < 104 ? lerp3(restHand(cam, "man", man, fo, -1), ch, smooth(ramp(f, 98, 104))) : lk, f);
    billWad(out, f < 106 ? [rh[0], rh[1] + 0.02, rh[2]] : [lk[0], lk[1] + 0.02, lk[2]]);
    const h = takeItem(out, cam, f, 1, LIFT1, HIDE1, man, fo, 1);
    if (!h) arm3d(out, cam, "man", man, fo, 1, f < 110 ? rh : lerp3(ch, restHand(cam, "man", man, fo, 1), smooth(ramp(f, 106, 116))), f);
    if (own) arm3d(out, cam, "owner", own.p, own.fo, -1, restHand(cam, "owner", own.p, own.fo, -1), f);
  }
  stackOn(out, "counter");
};
/** the three booster boxes he sold: carried in, on the counter, carried to the shelf by the owner, on the shelf */
const STACK_CTR = (): V3 => Sm(P.stack[0], TOPY, P.stack[2]), STACK_SHELF = (): V3 => Sm(0.45, 1.06, -3.38);
const stackOn = (out: Stage, where: "counter" | "shelf" | V3, ry = 0) => { const p = where === "counter" ? STACK_CTR() : where === "shelf" ? STACK_SHELF() : where; out.props.stack = { p, ry }; };

const s02 = (out: Stage, cam: CamInfo, f: number) => {
  if (f >= 240 && f < 330) walkTo(out, cam, "woman", Sm(-4.5, 0, 7.3), Sm(3.0, 0, 7.3), f, 240, 330, { expr: "smile" });
  customers(out, cam, f, 3); const o = ownerAt(out, cam, f, P.owner_reg, "smile", { armOff: 1 }); if (o) typing(out, cam, f, o);
};
const s03 = (out: Stage, cam: CamInfo, f: number) => { customers(out, cam, f, 3); const o = ownerAt(out, cam, f, P.owner_reg, "smile", { armOff: 1 }); if (o) typing(out, cam, f, o); };
/** S04-S05: the phone, the man walking in with the stack */
const phoneCall = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const op = mk(P.owner_phone), rest: V3 = Sm(P.phone[0], TOPY + 0.075, P.phone[2] + 0.05);
  const onEar = (id === 4 && f >= LIFT4) || (id === 5 && f < HANG5), fo: FrontOpts = { mode: "stand", expr: onEar && talkOpen(f, 490, 550) ? "relief_open" : "smile", look: -1, armOff: 1 };
  if (id === 5 && f >= HANG5 + 4) {
    if (f < 590) walkTo(out, cam, "owner", op, mk(P.owner_reg), f, HANG5 + 4, 590, { expr: "smile" });
    else ownerAt(out, cam, f, P.owner_reg, "smile");
    out.props.handset = { p: rest }; return;
  }
  if (near(cam, op)) { out.props.handset = { p: rest }; return; }
  front(out, cam, "owner", ...op, fo, f, [LIFT4]);
  const ear: V3 = [op[0] + cam.right.x * 0.25 - cam.fwd.x * 0.03, 1.5, op[2] + cam.right.z * 0.25 - cam.fwd.z * 0.03];
  let hp: V3 = rest, rz = 0;
  const ring = id === 4 && f >= RING4[0] && f < LIFT4;
  if (id === 4 && f >= LIFT4 - 6 && f < LIFT4 + 6) { const u = smooth((f - LIFT4 + 6) / 12); hp = lerp3(rest, ear, u); rz = 1.3 * u; }
  else if (onEar) { hp = ear; rz = 1.3; }
  else if (ring) hp = [rest[0], rest[1] + (f % 4 < 2 ? 0.003 : 0), rest[2]];
  out.props.handset = { p: hp, rz };
  arm3d(out, cam, "owner", op, fo, 1, onEar || (id === 4 && f >= LIFT4 - 6) ? [hp[0], hp[1] - 0.02, hp[2]] : restHand(cam, "owner", op, fo, 1), f);
  if (ring && (f - RING4[0]) % 16 < 10) fxc(out, `ring${f % 4}`, 200, 200, (pp) => art.sparkle(pp, ((f - RING4[0]) % 16) / 10), [rest[0], rest[1] + 0.12, rest[2]], 0.16, 0.16, { soft: true });
};
const walkIn = (out: Stage, cam: CamInfo, f: number) => {
  const A = Sm(P.man_door[0], 0, P.man_door[1] + 0.6), B = mk(P.man);
  if (f < WALK4[0] - 12) return;
  if (f >= WALK4[1]) return manAtCounter(out, cam, f);
  const u = smooth(ramp(f, WALK4[0], WALK4[1])), p = lerp3(A, B, u);
  if (near(cam, p, 0.8)) return;
  const fo: FrontOpts = { mode: f < WALK4[0] ? "stand" : "march", phase: walkPhase(f, 2), expr: "smile", armOff: 2 };
  front(out, cam, "man", ...p, fo, f);
  const ch = chestAt(cam, "man", p, fo, 0.55, 0.14); stackOn(out, [ch[0], ch[1] - 0.12, ch[2]]);
  const r = cam.right; arm3d(out, cam, "man", p, fo, -1, [ch[0] - r.x * 0.16, ch[1] - 0.02, ch[2] - r.z * 0.16], f); arm3d(out, cam, "man", p, fo, 1, [ch[0] + r.x * 0.16, ch[1] - 0.02, ch[2] + r.z * 0.16], f);
};
/** he stands at the counter: sets the stack down (S05), then waits */
const manAtCounter = (out: Stage, cam: CamInfo, f: number, expr: Expr = "smile") => {
  const man = mk(P.man); if (near(cam, man)) return;
  const fo: FrontOpts = { mode: "stand", expr, armOff: 2 };
  front(out, cam, "man", ...man, fo, f);
  if (f >= SET5[0] && f < SET5[1] + 6) { const S = STACK_CTR(), k = smooth(ramp(f, SET5[0], SET5[1])), ch = chestAt(cam, "man", man, fo, 0.55, 0.14), p = lerp3([ch[0], ch[1] - 0.12, ch[2]], S, k);
    stackOn(out, p); const r = cam.right; arm3d(out, cam, "man", man, fo, -1, [p[0] - r.x * 0.16, p[1] + 0.12, p[2] - r.z * 0.16], f); arm3d(out, cam, "man", man, fo, 1, [p[0] + r.x * 0.16, p[1] + 0.12, p[2] + r.z * 0.16], f); return; }
  stackOn(out, "counter");
  arm3d(out, cam, "man", man, fo, -1, restHand(cam, "man", man, fo, -1), f); arm3d(out, cam, "man", man, fo, 1, restHand(cam, "man", man, fo, 1), f);
};
const s06 = (out: Stage, cam: CamInfo, f: number) => {
  customers(out, cam, f, 6); stackOn(out, "counter");
  front(out, cam, "woman", ...mk(P.woman_reg), { mode: "stand", expr: talkOpen(f, 640, 700) ? "relief_open" : "smile", look: -1 }, f);
  const o = ownerAt(out, cam, f, P.owner_reg, talkOpen(f, 650, 715) ? "relief_open" : "smile", { look: 1 });
  void o;
  const man = mk(P.man), fo: FrontOpts = { mode: "stand", expr: "whistle", look: f > 640 ? 0.6 : 0, armOff: 2 };
  front(out, cam, "man", ...man, fo, f, [636]);
  const dipping = f >= DIP6[0] && f < GRAB6 - 12;   // the hand hovers in the box, waiting for the owner to look away
  const h = dipping ? null : takeItem(out, cam, f, 0, [GRAB6, LIFT6[1]], HIDE6, man, fo, 1);
  if (dipping) arm3d(out, cam, "man", man, fo, 1, lerp3(restHand(cam, "man", man, fo, 1), [itemTop(0)[0], itemTop(0)[1] + 0.03, itemTop(0)[2]], smooth(ramp(f, DIP6[0], DIP6[1]))), f);
  else if (!h) arm3d(out, cam, "man", man, fo, 1, restHand(cam, "man", man, fo, 1), f);
  arm3d(out, cam, "man", man, fo, -1, restHand(cam, "man", man, fo, -1), f);
};
const s07 = (out: Stage, cam: CamInfo, f: number) => {
  customers(out, cam, f, 7); stackOn(out, "counter");
  if (f < 760) walkTo(out, cam, "woman", mk(P.woman_reg), Sm(3.0, 0, 0.6), f, 723, 760, { expr: "smile" });
  let own: { p: V3; fo: FrontOpts } | null = null;
  if (f < STEP7[0]) { const o = ownerAt(out, cam, f, P.owner_reg, "smile"); void o; }
  else if (f < STEP7[1]) walkTo(out, cam, "owner", mk(P.owner_reg), mk(P.owner_pay), f, STEP7[0], STEP7[1], { expr: "smile" });
  else {
    own = ownerAt(out, cam, f, P.owner_pay, "smile", { armOff: 2 });
    if (own) { const keys = Sm(P.register[0] - 0.1, TOPY + 0.17, P.register[2] + 0.05), dr = Sm(P.register[0] - 0.05, TOPY + 0.06, P.register[2] - 0.3);
      if (f < TAKE7[1]) { const hnd = f < KEY7 ? lerp3(restHand(cam, "owner", own.p, own.fo, 1), keys, smooth(ramp(f, STEP7[1], KEY7))) : f < TAKE7[0] ? keys : dr;
        arm3d(out, cam, "owner", own.p, own.fo, 1, hnd, f); if (f >= TAKE7[0]) billsFlat(out, [dr[0], dr[1] + 0.01, dr[2]], 3, "d"); arm3d(out, cam, "owner", own.p, own.fo, -1, restHand(cam, "owner", own.p, own.fo, -1), f); own = null; }
      else arm3d(out, cam, "owner", own.p, own.fo, 1, f < SHUT7 ? restHand(cam, "owner", own.p, own.fo, 1) : dr, f); }
  }
  const man = mk(P.man), fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 };
  front(out, cam, "man", ...man, fo, f);
  arm3d(out, cam, "man", man, fo, -1, restHand(cam, "man", man, fo, -1), f);
  if (f < 766) arm3d(out, cam, "man", man, fo, 1, restHand(cam, "man", man, fo, 1), f); else cash(out, cam, f, BILLS7, man, fo, own, 766);
};
const s08 = (out: Stage, cam: CamInfo, f: number) => {
  customers(out, cam, f, 8);
  // the owner shelves the stack: walks to it, picks it up, carries it straight back to a shelf, puts it there, stays facing it
  const [p0, w0, l0, w1, put] = SHELF8, A = mk(P.owner_pay), B0 = Sm(P.stack[0] + 0.03, 0, -1.55), B = Sm(P.stack[0] + 0.03, 0, -3.02);
  if (f < p0) { ownerAt(out, cam, f, P.owner_pay, "smile"); stackOn(out, "counter"); }
  else if (f < w0) { walkTo(out, cam, "owner", A, B0, f, p0, w0); stackOn(out, "counter"); }
  else if (f < l0) { const fo2: FrontOpts = { mode: "stand", expr: "neutral", armOff: 2 }; front(out, cam, "owner", ...B0, fo2, f); const S = lerp3(STACK_CTR(), Sm(P.stack[0], 1.05, -1.5), smooth(ramp(f, w0, l0))); stackOn(out, S);
    const r = cam.right; arm3d(out, cam, "owner", B0, fo2, -1, [S[0] - r.x * 0.16, S[1] + 0.12, S[2] - r.z * 0.16], f); arm3d(out, cam, "owner", B0, fo2, 1, [S[0] + r.x * 0.16, S[1] + 0.12, S[2] + r.z * 0.16], f); }
  else if (f < w1) { const p = walkTo(out, cam, "owner", B0, B, f, l0, w1, { reach: 0.8 }); stackOn(out, [p[0], 1.02, p[2] - 0.32]); }
  else if (f < put) { side(out, cam, "owner", ...B, 0, -1, { mode: "march", phase: 0.25, reach: 1, expr: "neutral" }, f); stackOn(out, lerp3(Sm(P.stack[0], 1.02, -3.34), STACK_SHELF(), smooth(ramp(f, w1, put)))); }
  else { side(out, cam, "owner", ...B, 0, -1, { mode: "stand", expr: "neutral" }, f); stackOn(out, "shelf"); }
  // the man: tucks the cash, then three slabs into his jacket
  const man = mk(P.man); if (near(cam, man, 0.4)) return;
  const fo: FrontOpts = { mode: "stand", expr: f > 840 ? "grin" : "smile", look: f > 822 ? -0.6 : 0, armOff: 2 };
  front(out, cam, "man", ...man, fo, f, [822]);
  let busy = false;
  const ch = chestAt(cam, "man", man, fo, 0.45, 0.08), hold = holdHand(cam, "man", man, fo, 1);
  if (f < TUCK8[1] + 10) { const hnd = f < TUCK8[1] ? lerp3(hold, ch, smooth(ramp(f, TUCK8[0], TUCK8[1]))) : lerp3(ch, restHand(cam, "man", man, fo, 1), smooth(ramp(f, TUCK8[1], TUCK8[1] + 10)));
    arm3d(out, cam, "man", man, fo, 1, hnd, f); if (f < TUCK8[1] - 2) billWad(out, [hnd[0], hnd[1] + 0.02, hnd[2]]); busy = true; }
  else for (const [k, i] of [[0, 1], [1, 5], [2, 6]] as const) { const L = LIFTS8[k], h = takeItem(out, cam, f, i, L, [L[1], L[1] + 6], man, fo, 1); if (h) { busy = true; break; } }
  if (!busy) arm3d(out, cam, "man", man, fo, 1, restHand(cam, "man", man, fo, 1), f);
  arm3d(out, cam, "man", man, fo, -1, restHand(cam, "man", man, fo, -1), f);
};
/** the man and the owner simply standing (S11, S12) */
const standing = (out: Stage, cam: CamInfo, f: number, id: number, ownerMark: number[]) => {
  customers(out, cam, f, id); stackOn(out, "shelf");
  const o = ownerAt(out, cam, f, ownerMark, id === 12 ? "smile" : "neutral", { armOff: ownerMark === P.owner_reg ? 1 : undefined, look: -1 });
  if (o && ownerMark === P.owner_reg && id !== 12) typing(out, cam, f, o);
  const man = mk(P.man); if (!near(cam, man)) front(out, cam, "man", ...man, { mode: "stand", expr: "grin", look: 0.3 }, f);
};
/** the handshake across the counter (S13, S17): pumps every `per` frames */
const handshake = (out: Stage, cam: CamInfo, f: number, a: number, b: number, per: number, ownerFo: FrontOpts, manExpr: Expr = "smile") => {
  const op = mk(P.owner_left), man = mk(P.man), mfo: FrontOpts = { mode: "stand", expr: manExpr, armOff: 2 };
  front(out, cam, "owner", ...op, { ...ownerFo, armOff: 1 }, f); front(out, cam, "man", ...man, mfo, f);
  const HS = Sm(0.4, 1.13, -1.15), on = f >= a && f < b, pump = on ? 0.03 * Math.sin(((f - a) / per) * Math.PI * 2) : 0, hp: V3 = [HS[0], HS[1] + pump, HS[2]];
  arm3d(out, cam, "owner", op, ownerFo, 1, on ? hp : restHand(cam, "owner", op, ownerFo, 1), f);
  arm3d(out, cam, "man", man, mfo, -1, on ? hp : restHand(cam, "man", man, mfo, -1), f); arm3d(out, cam, "man", man, mfo, 1, restHand(cam, "man", man, mfo, 1), f);
};
const s13 = (out: Stage, cam: CamInfo, f: number) => {
  customers(out, cam, f, 13); stackOn(out, "shelf");
  const stern = f >= KID13[0] && f < TURN13;
  handshake(out, cam, f, SHAKE13[0], SHAKE13[1], 12, { mode: "stand", expr: stern ? "stern" : "smile", look: stern ? -1 : 1 }, "smile");
};
const s16 = (out: Stage, cam: CamInfo, f: number) => {
  stackOn(out, "shelf");
  const op = mk(P.owner_pay), CS = mk(P.case_stand), B = BOXC();
  if (f < LIFT16[0]) {
    const fo: FrontOpts = { mode: "stand", expr: "sad", look: 0, armOff: 1 }; front(out, cam, "owner", ...op, fo, f, [1772]);
    const head: V3 = [op[0] + cam.right.x * 0.06, 1.86 + 0.02 * Math.sin(f * 0.8), op[2]];
    arm3d(out, cam, "owner", op, fo, 1, f >= SCRATCH16[0] && f < SCRATCH16[1] ? head : restHand(cam, "owner", op, fo, 1), f);
    out.props.box = { p: B }; return;
  }
  if (f < WALK16[0]) { const fo: FrontOpts = { mode: "stand", expr: "sad", armOff: 2 }; front(out, cam, "owner", ...op, fo, f);
    const ch = chestAt(cam, "owner", op, fo, 0.5, 0.12), bp = lerp3(B, [ch[0], ch[1] - 0.08, ch[2]], smooth(ramp(f, LIFT16[0], LIFT16[1]))); out.props.box = { p: bp };
    const r = cam.right; arm3d(out, cam, "owner", op, fo, -1, [bp[0] - r.x * 0.24, bp[1] + 0.06, bp[2] - r.z * 0.24], f); arm3d(out, cam, "owner", op, fo, 1, [bp[0] + r.x * 0.24, bp[1] + 0.06, bp[2] + r.z * 0.24], f); return; }
  if (f < WALK16[1]) { const w = walkPath(out, cam, "owner", [op, Sm(-1.3, 0, -1.62), CS], f, WALK16[0], WALK16[1], { reach: 0.8, expr: "sad" });
    const L = Math.hypot(w.dir[0], w.dir[2]) || 1; out.props.box = { p: [w.p[0] + (w.dir[0] / L) * 0.3, 1.0, w.p[2] + (w.dir[2] / L) * 0.3], ry: Math.atan2(w.dir[0], w.dir[2]) + Math.PI / 2 }; return; }
  // at the case: the door opens, the box goes in, the door shuts, the padlock snaps
  side(out, cam, "owner", ...CS, -1, 0, { mode: "march", phase: 0.25, reach: f < PUT16[1] ? 1 : 0.6, expr: f >= LOCK16 ? "sad" : "neutral" }, f);
  const inside = Sm(-3.12, P.case_shelf + 0.012, -1.7), held = Sm(-2.3, 1.0, -1.7);
  out.props.box = { p: f < PUT16[0] ? held : f < PUT16[1] ? lerp3(held, inside, smooth(ramp(f, PUT16[0], PUT16[1]))) : inside, ry: Math.PI / 2 };
};
const s17 = (out: Stage, cam: CamInfo, f: number) => { customers(out, cam, f, 17); stackOn(out, "shelf"); if (f < CUT17) handshake(out, cam, f, SHAKE17[0], SHAKE17[1], 20, { mode: "stand", expr: "smile", look: 1 }); };
const s18 = (out: Stage, cam: CamInfo, f: number) => {
  stackOn(out, "shelf");
  const op = mk(P.owner_phone), fo: FrontOpts = { mode: "stand", expr: talkOpen(f, 2108, 2132) ? "relief_open" : "stern", look: -1, armOff: 2 };
  front(out, cam, "owner", ...op, fo, f);
  const rest: V3 = Sm(P.phone[0], TOPY + 0.075, P.phone[2] + 0.05), ear: V3 = [op[0] + cam.right.x * 0.25 - cam.fwd.x * 0.03, 1.5, op[2] + cam.right.z * 0.25 - cam.fwd.z * 0.03];
  const u = smooth(ramp(f, 2090, 2098)), hp = lerp3(rest, ear, u); out.props.handset = { p: hp, rz: 1.3 * u };
  arm3d(out, cam, "owner", op, fo, 1, [hp[0], hp[1] - 0.02, hp[2]], f);
  const pad = Sm(P.phone[0] - 0.04 + 0.02 * (Math.floor(f / 4) % 3), TOPY + 0.07, P.phone[2] - 0.03);
  arm3d(out, cam, "owner", op, fo, -1, f >= DIAL18[0] && f < DIAL18[1] + 4 ? pad : restHand(cam, "owner", op, fo, -1), f);
};
const s19 = (out: Stage, cam: CamInfo, f: number) => {
  stackOn(out, "shelf"); out.props.handset = { p: Sm(P.phone[0], TOPY + 0.075, P.phone[2] + 0.05) };
  const op = mk(P.owner_phone), fo: FrontOpts = { mode: "stand", expr: "stern", look: -1, armOff: 2 };
  if (!near(cam, op)) { front(out, cam, "owner", ...op, fo, f);
    const lcd = Sm(P.phone[0], TOPY + 0.07, P.phone[2] - 0.05); arm3d(out, cam, "owner", op, fo, -1, f >= POINT19[0] ? lcd : restHand(cam, "owner", op, fo, -1), f);
    arm3d(out, cam, "owner", op, fo, 1, restHand(cam, "owner", op, fo, 1), f); }
  const cp = mk(P.cop), cfo: FrontOpts = { mode: "stand", expr: "neutral", look: 0.4, armOff: 2 };
  front(out, cam, "cop", ...cp, cfo, f);
  const pad: V3 = Sm(P.cop[0] + 0.04, 1.2, P.cop[1] + 0.12), k = ramp(f, WRITE19[0], WRITE19[1]);
  fxc(out, `note${Math.round(k * 24)}`, 450, 600, (pp) => art2.notepad(pp, 450, 600, Math.round(k * 24) / 24), pad, 0.18, 0.24);
  const r = cam.right; arm3d(out, cam, "cop", cp, cfo, -1, [pad[0] - r.x * 0.07, pad[1] - 0.06, pad[2] - r.z * 0.07], f);
  const pen: V3 = [pad[0] + r.x * (-0.06 + 0.13 * k) - cam.fwd.x * 0.012, pad[1] - 0.02 + 0.006 * Math.sin(f * 1.7), pad[2] + r.z * (-0.06 + 0.13 * k) - cam.fwd.z * 0.012];
  arm3d(out, cam, "cop", cp, cfo, 1, f >= WRITE19[0] && f < WRITE19[1] + 4 ? pen : restHand(cam, "cop", cp, cfo, 1), f);
  if (f >= WRITE19[0] && f < WRITE19[1] + 4) fxc(out, "pen", 40, 200, (pp) => { pp.g.fillStyle = "#2f4a8a"; pp.g.fillRect(12, 0, 16, 180); pp.g.fillStyle = "#c9a24a"; pp.g.fillRect(12, 0, 16, 30); }, [pen[0], pen[1] + 0.04, pen[2]], 0.012, 0.09, { rot: -0.4 });
};
const s20 = (out: Stage, cam: CamInfo, f: number) => {
  const A = Sm(P.man_door[0], 0, P.man_door[1]), B = mk(P.man_walk);
  if (f < WALK20[0]) { front(out, cam, "man", ...A, { mode: "stand", expr: "grin" }, f); return; }
  if (f < WALK20[1]) { const p = lerp3(A, B, smooth(ramp(f, WALK20[0], WALK20[1]))); front(out, cam, "man", ...p, { mode: "march", phase: walkPhase(f, 2), expr: "grin" }, f); return; }
  const fo: FrontOpts = { mode: "stand", expr: "grin", armOff: 2 }; front(out, cam, "man", ...B, fo, f, [WALK20[1]]);
  const ch = chestAt(cam, "man", B, fo, 0.4, 0.1), pat = f >= PAT20[0] && f < PAT20[1] ? (Math.floor((f - PAT20[0]) / 7) % 2 ? 0.03 : 0) : 0;
  arm3d(out, cam, "man", B, fo, -1, f >= PAT20[0] && f < PAT20[1] + 4 ? [ch[0] - cam.fwd.x * pat, ch[1], ch[2] - cam.fwd.z * pat] : restHand(cam, "man", B, fo, -1), f);
  if (f >= FAN20[0]) { const r = cam.right, up = Math.min(1, ramp(f, FAN20[0], FAN20[0] + 8)), fan: V3 = [B[0] + r.x * 0.32 - cam.fwd.x * 0.12, lerpN(1.0, 1.55, up), B[2] + r.z * 0.32 - cam.fwd.z * 0.12];
    arm3d(out, cam, "man", B, fo, 1, fan, f); for (let k = 0; k < 3; k++) fxc(out, `fan${k}`, 470, 200, (pp) => art2.bill(pp, 470, 200), [fan[0] + r.x * 0.02 * k, fan[1] + 0.05 + 0.005 * k, fan[2] + r.z * 0.02 * k - cam.fwd.z * 0.003 * k], 0.156, 0.066, { rot: 1.2 - 0.25 * k }); }
  else arm3d(out, cam, "man", B, fo, 1, restHand(cam, "man", B, fo, 1), f);
};
const s21 = (out: Stage, cam: CamInfo, f: number) => {
  const B = mk(P.man_walk); if (near(cam, B)) return;
  const shock = f >= FREEZE21, fo: FrontOpts = { mode: "stand", expr: shock ? "shock" : "grin", gape: shock ? 0.5 : 0, armOff: 2 };
  front(out, cam, "man", ...B, fo, f, [FREEZE21]);
  const r = cam.right, pocket = chestAt(cam, "man", B, fo, 0.45, 0.06), up: V3 = [B[0] + r.x * 0.22 - cam.fwd.x * 0.22, 1.18, B[2] + r.z * 0.22 - cam.fwd.z * 0.22];
  const ringing = f >= RING21 && f < 2425, jit = ringing ? 0.003 * (f % 2 ? 1 : -1) : 0;
  const ph = f < PHONE21[0] ? pocket : lerp3(pocket, up, smooth(ramp(f, PHONE21[0], PHONE21[1])));
  if (f >= PHONE21[0]) { arm3d(out, cam, "man", B, fo, 1, [ph[0], ph[1] - 0.05, ph[2]], f);
    fxc(out, "hisPhone", 140, 280, (pp) => { const g = pp.g; g.fillStyle = "#2f5fb4"; g.beginPath(); g.roundRect(4, 4, 132, 272, 22); g.fill(); g.fillStyle = "#1d1b22"; g.beginPath(); g.roundRect(18, 18, 46, 70, 14); g.fill(); g.fillStyle = "#4f78c8"; g.beginPath(); g.arc(41, 40, 12, 0, 7); g.fill(); g.beginPath(); g.arc(41, 70, 12, 0, 7); g.fill(); },
      [ph[0] + r.x * jit, ph[1] + 0.03, ph[2] + r.z * jit], 0.075, 0.15); }
  else arm3d(out, cam, "man", B, fo, 1, restHand(cam, "man", B, fo, 1), f);
  arm3d(out, cam, "man", B, fo, -1, restHand(cam, "man", B, fo, -1), f);
  if (ringing && f % 10 < 6) fxc(out, `buzz${f % 10}`, 300, 300, (pp) => art.sparkle(pp, (f % 10) / 6), [ph[0], ph[1] + 0.1, ph[2]], 0.28, 0.28, { soft: true });
  if (shock) fxc(out, "sweat", 100, 140, (pp) => { const g = pp.g; g.fillStyle = "#8fd0f2"; g.strokeStyle = "#1d1b22"; g.lineWidth = 6; g.beginPath(); g.moveTo(50, 8); g.quadraticCurveTo(92, 90, 50, 132); g.quadraticCurveTo(8, 90, 50, 8); g.fill(); g.stroke(); },
    [B[0] + r.x * 0.2, 1.78 - Math.min(0.08, (f - FREEZE21) * 0.003), B[2] + r.z * 0.2 - cam.fwd.z * 0.05], 0.05, 0.07);
};

// ---- the house ----
const s14 = (out: Stage, cam: CamInfo, f: number) => {
  const host = mkH(HP.host_door), hfo: FrontOpts = { mode: "stand", expr: "grin", armOff: 2 };
  front(out, cam, "owner", ...host, hfo, f, [DOOR14[1]]);
  const A = mkH(HP.guest_door), Bp = mkH(HP.guest_in), gp = f < STEP14[0] ? A : lerp3(A, Bp, smooth(ramp(f, STEP14[0], STEP14[1])));
  const gfo: FrontOpts = { mode: f >= STEP14[0] && f < STEP14[1] ? "march" : "stand", phase: walkPhase(f, 2), expr: "smile", armOff: 2 };
  front(out, cam, "man", ...gp, gfo, f);
  const r = cam.right, gch = chestAt(cam, "man", gp, gfo, 0.5, 0.15), hch = chestAt(cam, "owner", host, hfo, 0.5, 0.15);
  const k = smooth(ramp(f, GIFT14[0], GIFT14[1])), gift = lerp3(gch, hch, k); out.props.gift = { p: gift };
  if (k < 1) { arm3d(out, cam, "man", gp, gfo, -1, [gift[0] - r.x * 0.15, gift[1], gift[2] - r.z * 0.15], f); arm3d(out, cam, "man", gp, gfo, 1, [gift[0] + r.x * 0.15, gift[1], gift[2] + r.z * 0.15], f); }
  else { arm3d(out, cam, "man", gp, gfo, -1, restHand(cam, "man", gp, gfo, -1), f); arm3d(out, cam, "man", gp, gfo, 1, restHand(cam, "man", gp, gfo, 1), f); }
  if (k > 0) { arm3d(out, cam, "owner", host, hfo, -1, [gift[0] - r.x * 0.15, gift[1], gift[2] - r.z * 0.15], f); arm3d(out, cam, "owner", host, hfo, 1, [gift[0] + r.x * 0.15, gift[1], gift[2] + r.z * 0.15], f); }
  else { arm3d(out, cam, "owner", host, hfo, -1, f < DOOR14[1] + 4 ? Hm(HP.door[0] + 0.35, 1.05, -2.62) : restHand(cam, "owner", host, hfo, -1), f); arm3d(out, cam, "owner", host, hfo, 1, f > STEP14[0] ? [host[0] + r.x * 0.45, 1.55, host[2] + r.z * 0.45] : restHand(cam, "owner", host, hfo, 1), f); }
};
const s15 = (out: Stage, cam: CamInfo, f: number) => {
  if (f < WALK15[1]) { const p = walkTo(out, cam, "owner", mkH(HP.host_mid), mkH(HP.host_walk), f, WALK15[0], WALK15[1], { reach: 0.8, expr: "smile" }); out.props.gift = { p: [p[0] + 0.3, 1.02, p[2] + 0.1] }; }
  else out.props.gift = { p: Hm(0, -5, 0), vis: false };
  const g = mkH(HP.guest_tbl), fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: "smile", look: f > SPOON15[0] - 10 && f < HIDE15[1] ? 0.5 : 0, armOff: 2 };
  front(out, cam, "man", ...g, fo, f);
  const slot = Hm(HP.tray[0] + 0.117, HP.tray[1] + 0.01, HP.tray[2]), rest = restHand(cam, "man", g, fo, 1), ch = chestAt(cam, "man", g, fo, 0.5, 0.06);
  let hand = rest;
  if (f >= SPOON15[0] - 8 && f < SPOON15[0]) hand = lerp3(rest, slot, smooth((f - SPOON15[0] + 8) / 8));
  else if (f >= SPOON15[0] && f < SPOON15[1]) { hand = lerp3(slot, [slot[0], slot[1] + 0.1, slot[2]], smooth(ramp(f, SPOON15[0], SPOON15[1]))); out.props.spoon = { p: [hand[0], hand[1] - 0.04, hand[2]], rx: -1.2 }; }
  else if (f >= SPOON15[1] && f < HIDE15[1]) { hand = lerp3([slot[0], slot[1] + 0.1, slot[2]], ch, smooth(ramp(f, SPOON15[1], HIDE15[1]))); out.props.spoon = { p: f >= HIDE15[1] - 2 ? [ch[0] + cam.fwd.x * 0.08, ch[1], ch[2] + cam.fwd.z * 0.08] : [hand[0], hand[1] - 0.04, hand[2]], rx: -0.4 }; }
  else if (f >= HIDE15[1]) hand = lerp3(ch, rest, smooth(ramp(f, HIDE15[1], HIDE15[1] + 8)));
  arm3d(out, cam, "man", g, fo, 1, hand, f); arm3d(out, cam, "man", g, fo, -1, restHand(cam, "man", g, fo, -1), f);
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  if (id === 1) s01(out, cam, f);
  if (id === 2) s02(out, cam, f);
  if (id === 3) { s03(out, cam, f); stackOn(out, Sm(0, -5, 0)); }
  if (id === 4) { customers(out, cam, f, 4); phoneCall(out, cam, f, 4); walkIn(out, cam, f); if (f < WALK4[0] - 12) stackOn(out, Sm(0, -5, 0)); }
  if (id === 5) { customers(out, cam, f, 5); phoneCall(out, cam, f, 5); walkIn(out, cam, f); }
  if (id === 6) s06(out, cam, f);
  if (id === 7) s07(out, cam, f);
  if (id === 8) s08(out, cam, f);
  if (id === 11) standing(out, cam, f, 11, P.owner_reg);
  if (id === 12) standing(out, cam, f, 12, P.owner_pay);
  if (id === 13) s13(out, cam, f);
  if (id === 14) s14(out, cam, f);
  if (id === 15) s15(out, cam, f);
  if (id === 16) s16(out, cam, f);
  if (id === 17) s17(out, cam, f);
  if (id === 18) s18(out, cam, f);
  if (id === 19) s19(out, cam, f);
  if (id === 20) { s20(out, cam, f); stackOn(out, "shelf"); }
  if (id === 21) { s21(out, cam, f); stackOn(out, "shelf"); }
  return out;
};
void art; void IDX; void tier; void tcardFx; void glowAt; void faceTo; void fxPuff; void SKIN; void shoulderAt; void burst; void sparkle; void FPS; void easeOut; void hop; void JKo; void JACKP;
