// The Gengar reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, PZo, WOo, clamp01, smooth, easeOut, PZ, WO,
  REACH1, RIP1, BALL1, SIP2, CARD2, WALK3, SIT3, LAY3, NOD3, SLIDE4, RULE4, FOLD4, POINT4, HANDS4, WALK5, PIN5, WRITE5, DOODLE5, NAME6, CENSOR6,
  SPIN7, FLASH7, BACK7, RIP7, WALK8, ANN8, PULL8, LOCK8, SIGN8, SLUMP9, CARD9, CRY9, POINT10, SCRATCH10, SHRUG10, KNOCK12, SPLASH12, WALK12, STEP12,
  STAND12, MOP12, LOOK12, POINT12, FLASH13, SPLIT14, LIFT14, DROP14, LIFT15, DROP15, CROW16, CAW16, PULL1,
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
export type PropK = { p: number[]; ry?: number; rx?: number; rz?: number; vis?: boolean; q?: number[]; tag?: number };
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
const IDX: Record<Who, number> = { him: 3, staff: 4, judge: 5, opp: 6, friend: 7, stranger: 8, c1: 9, c2: 10, c3: 11, c4: 12, c5: 13, c6: 14, pat1: 15, pat2: 16, kid: 17 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[caterpie] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Pm = (x: number, y: number, z: number) => at(PZo, x, y, z);
const Wm = (x: number, y: number, z: number) => at(WOo, x, y, z);
const SEAT_CHAIR = 0.92;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const flat = (out: Stage, key: string, draw: (p: Pen) => void, p: V3, s: number, rot = 0, cw = 200, ch = 200, h?: number) => card(out, key, cw, ch, draw, p[0], p[1], p[2], s, h ?? s, { flat: true, rot });
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const talkOpen = (f: number, a: number, b: number) => f >= a && f < b && Math.floor((f - a) / 5) % 2 === 1;
const HL = PZ.hall, DOORX = [HL.door[0], HL.door[1]], FZ = HL.z;

// ---------------- shared state of the moving set pieces (world.ts poses them, the cast holds on to them) ----------------
/** the shutter's bottom edge (y): 3.0 = open (rolled up), 0 = shut */
export const shutterY = (id: number, f: number) => {
  const top = HL.door_h;
  const fall = (t0: number, t1: number, slam: number) => {
    if (f < t0) return top;
    if (f < t1) return top - (top - 0.6) * smooth(ramp(f, t0, t1));
    if (f < slam) { const u = (f - t1) / (slam - t1); return 0.6 * (1 - u * u); }
    const t = f - slam; return t < 6 ? 0.02 * Math.abs(Math.sin((t / 6) * Math.PI)) * (1 - t / 6) : 0;
  };
  if (id === 1) return fall(PULL1[0] + 6, PULL1[1] - 9, PULL1[1]);
  if (id === 8) return fall(PULL8[0], PULL8[1] - 7, PULL8[1]);
  return id >= 9 && id !== 13 ? 0 : top;
};
/** how much of the post is on the sheet this frame (S05 writing, S06 the name) */
export const sheetState = (id: number, f: number): { vis: boolean; o: art2.SheetO } => {
  const full = { title: 1, doodle: 1, lines: 1, name: 1, censor: 1 };
  if (id === 1) return { vis: f < RIP1, o: full };
  if (id === 7) return { vis: f < RIP7, o: full };
  if (id === 5) {
    if (f < PIN5) return { vis: false, o: {} };
    const title = ramp(f, WRITE5[0], 680), l1 = ramp(f, 680, 700) * 0.5, dd = ramp(f, DOODLE5[0], DOODLE5[1]), l2 = ramp(f, 718, WRITE5[1]) * 0.5;
    return { vis: true, o: { title, doodle: dd, lines: l1 + l2, name: 0, censor: 0 } };
  }
  if (id === 6) return { vis: true, o: { ...full, name: ramp(f, NAME6[0], NAME6[1]), censor: f < CENSOR6 ? 0 : clamp01((f - CENSOR6) / 3) } };
  return { vis: false, o: {} };
};
/** the marker's point on the sheet (canvas px of the 900 x 1200 sheet) while he writes */
const penPx = (id: number, f: number): [number, number] | null => {
  if (id === 5) {
    if (f >= WRITE5[0] && f < 680) return [60 + 800 * ramp(f, WRITE5[0], 680), 74];
    if (f >= 680 && f < 700) { const u = ramp(f, 680, 700) * 4, i = Math.min(3, Math.floor(u)); return [480 + 380 * (u - i), 300 + 52 * i]; }
    if (f >= DOODLE5[0] && f < DOODLE5[1]) { const u = ramp(f, DOODLE5[0], DOODLE5[1]); return [240 + 80 * Math.sin(u * 9), 300 + 260 * u]; }
    if (f >= 718 && f < WRITE5[1]) { const u = ramp(f, 718, WRITE5[1]) * 4, i = Math.min(3, Math.floor(u)); return [60 + 800 * (u - i), 640 + 52 * i]; }
  }
  if (id === 6 && f >= NAME6[0] && f < NAME6[1]) { const u = ramp(f, NAME6[0], NAME6[1]); return [200 + 620 * u, 920 + 14 * Math.sin(f)]; }
  return null;
};
const sheetWorld = ([u, v]: [number, number]): V3 => Pm(PZ.sheet[0] - PZ.sheet_size[0] / 2 + (u / 900) * PZ.sheet_size[0], PZ.sheet[1] + PZ.sheet_size[1] / 2 - (v / 1200) * PZ.sheet_size[1], PZ.sheet[2] + 0.02);
/** the clock: minutes since midnight */
export const clockMin = (id: number, f: number) => {
  if (id === 1) return 1140;
  if (id === 5) return 780 + (f - 640) / 30;
  if (id === 6) return 785;
  if (id === 7) return 780 + 360 * smooth(ramp(f, SPIN7[0], SPIN7[1]));
  if (id === 8 || id === 9) return 580 + (f - 859) / 30;
  if (id === 18) return 780 + 360 * smooth(ramp(f, 2208, 2240));
  if (id === 19) { const t = Math.max(0, f - 2260); return 1140 + 0.6 * t * t; }
  if (id >= 10 && id <= 12) return 590;
  if (id >= 14) return 980 + (f - 1735) / 30;
  return 610;
};
/** the scale's beam angle (rad, + = the near end down) */
const TMAX = Math.asin((PZ.beam_y - 0.03 - PZ.pan_drop) / PZ.arm);
export const beamAt = (id: number, f: number) => {
  if (id === 14) return f < DROP14 ? 0.02 * Math.sin(f * 0.08) : TMAX * Math.min(1, ((f - DROP14) / 5) ** 2);
  if (id === 15) { if (f < DROP15) return TMAX; const t = (f - DROP15) / 30; return TMAX * Math.exp(-2.2 * t) * Math.cos(2 * Math.PI * t / 1.1); }
  if (id >= 16) return 0;
  return 0.02 * Math.sin(f * 0.08);
};
/** a pan's centre top (world): s = +1 near (+z), -1 far */
export const panAt = (id: number, f: number, s: number): V3 => {
  const th = beamAt(id, f), [sx, sz] = PZ.scale;
  return Pm(sx, PZ.beam_y - s * Math.sin(th) * PZ.arm - PZ.pan_drop + 0.025, sz + s * Math.cos(th) * PZ.arm);
};
const CRATE = 0.3; // the weights wait on low wooden crates, so a crouching lifter can reach their handles
const W1_GROUND: V3 = [PZ.scale[0] + PZ.w1_ground[0], CRATE, PZ.scale[1] + PZ.w1_ground[1]], W2_GROUND: V3 = [PZ.scale[0] + PZ.w2_ground[0], CRATE, PZ.scale[1] + PZ.w2_ground[1]];

// ---------------- small drawings ----------------
const phoneBack = (p: Pen) => { p.poly([[20, 10], [130, 10], [130, 250], [20, 250]], "#2f5fd0", 8); p.ell(52, 44, 16, 16, "#1d1b22", 5); p.ell(52, 44, 7, 7, "#6a8ad8", 0); };
const sheetSmall = (p: Pen) => { p.g.save(); p.g.scale(1 / 3, 1 / 3); art2.postSheet(p); p.g.restore(); };
const annSmall = (p: Pen) => { p.g.fillStyle = "#fffdf6"; p.g.fillRect(0, 0, 220, 290); p.g.save(); p.g.scale(1 / 3, 1 / 3); art2.annSheet(p); p.g.restore(); };
const flashAt = (out: Stage, f: number, f0: number, P: V3) => { if (f >= f0 && f < f0 + 5) { const u = (f - f0) / 5; out.fx.push({ key: `flash${Math.round(u * 5)}`, cw: 128, ch: 128, draw: (pp) => art.glow(pp, "255,255,255"), x: P[0], y: P[1], z: P[2], w: 0.5 * (1 - u) + 0.15, h: 0.5 * (1 - u) + 0.15, soft: true }); burst(out, f, f0, P[0], P[1], P[2], 0.35, 4, "#ffffff"); } };
const cardInHand = (out: Stage, key: string, p: V3, h: number, img: string) => tcardFx(out, key, p, h, { img });

// ---------------- him at the board: the rip (S01, S07) ----------------
const TEAR: V3 = [PZ.tear[0], 0, PZ.tear[1]];
const SHEET_EDGE: V3 = Pm(PZ.sheet[0] + PZ.sheet_size[0] / 2 - 0.02, PZ.sheet[1] + 0.05, PZ.sheet[2] + 0.02);
const BIN_TOP: V3 = Pm(PZ.bin[0], PZ.bin_h + 0.05, PZ.bin[1]);
const ripper = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const rip = id === 1 ? RIP1 : RIP7, r0 = rip - 5;
  let P: V3 = Pm(TEAR[0], 0, TEAR[2]);
  if (id === 7) { if (f < BACK7) return; if (f < BACK7 + 8) { const A = Pm(0.6, 0, -2.4); side(out, cam, "him", ...lerp3(A, P, ramp(f, BACK7, BACK7 + 8)), -1, -0.3, { mode: "march", phase: walkPhase(f, 3), stride: 0.9, expr: "stern" }, f); return; } }
  const shock = id === 1 && f >= PULL1[1];
  const fo: FrontOpts = { mode: "stand", expr: shock ? "shock" : "stern", look: id === 1 && f > 110 ? 1 : -1, armOff: -1 };
  front(out, cam, "him", ...P, fo, f, shock ? [PULL1[1]] : []);
  const rest = restHand(cam, "him", P, fo, -1), chest = chestAt(cam, "him", P, fo, 0.5, 0.18);
  let hand: V3 = rest, ball = false, sheetK = 0;
  if (f >= r0 && f < rip) hand = lerp3(rest, SHEET_EDGE, smooth(ramp(f, r0, rip)));
  else if (f >= rip && f < rip + 6) { hand = lerp3(SHEET_EDGE, chest, smooth(ramp(f, rip, rip + 6))); sheetK = 1 - ramp(f, rip, rip + 13); }
  else if (f >= rip + 6 && (id === 7 || f < BALL1[0])) { hand = chest; sheetK = Math.max(0, 1 - ramp(f, rip, rip + 13)); ball = sheetK < 0.35; }
  else if (id === 1 && f >= BALL1[0] && f < BALL1[0] + 3) { hand = lerp3(chest, add3(chest, [-0.25, 0.15, 0]), ramp(f, BALL1[0], BALL1[0] + 3)); ball = true; }
  else if (id === 1 && f >= BALL1[0] + 3) hand = lerp3(add3(chest, [-0.25, 0.15, 0]), rest, smooth(ramp(f, BALL1[0] + 3, BALL1[0] + 14)));
  const Hd = arm3d(out, cam, "him", P, fo, -1, hand, f);
  arm3d(out, cam, "him", P, { ...fo, armOff: 1 }, 1, restHand(cam, "him", P, fo, 1), f);
  if (sheetK > 0.35) fxc(out, `crum${Math.round(sheetK * 6)}`, 300, 400, (pp) => sheetSmall(pp), [Hd[0], Hd[1], Hd[2] + 0.03], 0.6 * sheetK, 0.8 * sheetK, { rot: (1 - sheetK) * 0.8 });
  if (ball) fxc(out, "ball", 160, 160, (pp) => art2.paperBall(pp), [Hd[0], Hd[1], Hd[2] + 0.04], 0.12, 0.12);
  if (f >= rip && f < rip + 4) burst(out, f, rip, SHEET_EDGE[0], SHEET_EDGE[1], SHEET_EDGE[2] + 0.02, 0.3, 4, "#ffffff");
  // the throw: a ballistic arc from the release point into the bin (lands f48), where it stays
  if (id === 1 && f >= BALL1[0] + 3 && f < BALL1[1]) {
    const A = add3(chest, [-0.25, 0.15, 0]), u = ramp(f, BALL1[0] + 3, BALL1[1]), p = lerp3(A, BIN_TOP, u); p[1] += 0.45 * Math.sin(Math.PI * u);
    fxc(out, "ball", 160, 160, (pp) => art2.paperBall(pp), p, 0.12, 0.12, { rot: u * 6 });
  }
};
/** the staff pulls the shutter down with his hook pole (S01, S08); the padlock and the sign (S08) */
const STAFF: V3 = [PZ.staff[0], 0, PZ.staff[1]], HASP: V3 = [DOORX[1] - 0.03, 1.0, FZ + 0.03], SIGN_HOOK: V3 = [1.6, 1.62, FZ + 0.01];
const staff = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const t0 = id === 1 ? PULL1[0] : PULL8[0] - 12, slam = id === 1 ? PULL1[1] : PULL8[1];
  // S08: after the slam he steps in to the hasp, locks it, steps left and hangs the sign
  let P: V3 = Pm(...STAFF);
  const LOCKP = Pm(2.65, 0, -5.75), SIGNP = Pm(1.95, 0, -5.7);
  if (id === 8 && f >= slam + 2) {
    if (f < LOCK8 - 8) P = lerp3(P, LOCKP, smooth(ramp(f, slam + 2, LOCK8 - 8)));
    else if (f < SIGN8[0] - 6) P = LOCKP; else if (f < SIGN8[0]) P = lerp3(LOCKP, SIGNP, smooth(ramp(f, SIGN8[0] - 6, SIGN8[0]))); else P = f < SIGN8[1] + 20 ? SIGNP : lerp3(SIGNP, Pm(4.4, 0, -5.2), ramp(f, SIGN8[1] + 20, SIGN8[1] + 60));
  }
  if (id === 9) P = Pm(4.4, 0, -5.2);
  if (id >= 9) return;
  const fo: FrontOpts = { mode: "stand", expr: "neutral", look: -1, armOff: -1 };
  front(out, cam, "staff", ...P, fo, f);
  const rest = restHand(cam, "staff", P, fo, -1), sY = shutterY(id, f);
  let hand: V3 = rest;
  const hook: V3 = Pm(DOORX[1] - 0.3, Math.max(0.07, sY + 0.03), FZ + 0.03);
  if (f >= t0 - 8 && f < slam - 9) {
    // the pole: from his hand (raised) up to the hook in the shutter's bar
    const up = shoulderAt(cam, "staff", P, fo, -1), H0: V3 = [up[0] - 0.12, up[1] + 0.25 - 0.55 * ramp(f, t0, slam - 9), up[2] - 0.1];
    hand = f < t0 ? lerp3(rest, H0, smooth(ramp(f, t0 - 8, t0))) : H0;
    const Hd = arm3d(out, cam, "staff", P, fo, -1, hand, f);
    seg3d(out, cam, Hd, hook, 0.025, "#8a5a34");
  } else if (id === 8 && f >= LOCK8 - 8 && f < LOCK8 + 4) {
    hand = HASP; arm3d(out, cam, "staff", P, fo, -1, hand, f);
    if (f < LOCK8) out.props.padlock = { p: add3(HASP, [0, -0.06, 0.03]) };
  } else if (id === 8 && f >= SIGN8[0] && f < SIGN8[1] + 4) {
    hand = f < SIGN8[1] ? SIGN_HOOK : lerp3(SIGN_HOOK, rest, ramp(f, SIGN8[1], SIGN8[1] + 4)); arm3d(out, cam, "staff", P, fo, -1, hand, f);
    if (f < SIGN8[1]) out.props.banSign = { p: add3(SIGN_HOOK, [0, -0.17 + 0.0 * ramp(f, SIGN8[0], SIGN8[1]), 0.02]), rz: 0.15 * (1 - ramp(f, SIGN8[0], SIGN8[1])) };
  } else arm3d(out, cam, "staff", P, fo, -1, rest, f);
  arm3d(out, cam, "staff", P, { ...fo, armOff: 1 }, 1, restHand(cam, "staff", P, fo, 1), f);
  if (f >= slam && f < slam + 8) { const u = (f - slam) / 8; fxc(out, `puff${Math.round(u * 8)}`, 300, 300, (pp) => fxPuff(pp, u), Pm(1.5, 0.12, FZ + 0.12), 2.2, 0.6, { soft: true }); }
};
/** padlock and sign states that the staff is not holding */
const lockAndSign = (out: Stage, f: number, id: number) => {
  const locked = (id === 8 && f >= LOCK8) || (id >= 9 && id !== 13);
  if (!out.props.padlock) out.props.padlock = locked ? { p: add3(HASP, [0, -0.06, 0.03]), rx: 0 } : { p: [0, -50, 0], vis: false };
  const hung = (id === 8 && f >= SIGN8[1]) || (id >= 9 && id !== 13);
  if (!out.props.banSign) out.props.banSign = hung ? { p: add3(SIGN_HOOK, [0, -0.17, 0.02]), rz: id === 19 ? 0.04 * Math.sin((f - 2243) * 0.12) * Math.exp(-(f - 2243) / 50) : 0 } : { p: [0, -50, 0], vis: false };
};
/** the two players inside the open tournament room */
const insiders = (out: Stage, cam: CamInfo, f: number) => {
  for (const [who, x, fc] of [["c5", 1.15, 1], ["c6", 1.85, -1]] as [Who, number, -1 | 1][]) front(out, cam, who, ...Pm(x, 0, -7.25), { mode: "sit", chair: SEAT_CHAIR, expr: "smile", facing: fc }, f);
};

// ---------------- the café (S02, S03, S12) ----------------
const HIMT1 = (): V3 => Pm(PZ.him_t1[0], 0, PZ.him_t1[1]);
const CUP_REST: V3 = [PZ.t1[0] - 0.08, PZ.table_y, PZ.t1[1] + 0.2];
const cafe2 = (out: Stage, cam: CamInfo, f: number) => {
  const P = HIMT1(), fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: f >= CARD2[0] + 6 && f < CARD2[1] ? "grin" : talkOpen(f, 160, 186) ? "relief_open" : "smile", armOff: 2 };
  front(out, cam, "him", ...P, fo, f, [CARD2[0] + 6]);
  // the sip: his right arm (screen left) takes the cup to his mouth and back
  const mouth = add3(chestAt(cam, "him", P, fo, -0.25, 0.2), [0, 0, 0]), cup = Pm(...CUP_REST);
  let ch: V3 = cup, cp: V3 = cup;
  if (f >= SIP2[0] - 8 && f < SIP2[0]) ch = lerp3(restHand(cam, "him", P, fo, -1), cup, smooth(ramp(f, SIP2[0] - 8, SIP2[0])));
  else if (f >= SIP2[0] && f < SIP2[1]) { cp = lerp3(cup, mouth, smooth(ramp(f, SIP2[0], SIP2[0] + 6) - ramp(f, SIP2[1] - 6, SIP2[1]))); ch = cp; }
  else if (f >= SIP2[1] && f < SIP2[1] + 8) ch = lerp3(cup, restHand(cam, "him", P, fo, -1), smooth(ramp(f, SIP2[1], SIP2[1] + 8)));
  else ch = restHand(cam, "him", P, fo, -1);
  arm3d(out, cam, "him", P, fo, -1, ch, f);
  out.props.cup = { p: [cp[0], cp[1] - (f >= SIP2[0] && f < SIP2[1] ? 0.03 : 0), cp[2]] };
  // the card: his left arm (screen right) lifts the real Caterpie card toward the lens
  const CARD: V3 = Pm(3.93, 1.42, -2.12), rest = restHand(cam, "him", P, fo, 1);
  const k = smooth(ramp(f, CARD2[0], CARD2[0] + 12)) * (1 - smooth(ramp(f, CARD2[1], CARD2[1] + 10)));
  const Hd = arm3d(out, cam, "him", P, fo, 1, lerp3(rest, CARD, k), f);
  if (k > 0.05) cardInHand(out, "cat2", [Hd[0], Hd[1] + 0.02, Hd[2] + 0.01], 0.16, "caterpie151");
  if (f >= 306 && f < 320) sparkle(out, f, 306, PZ.t1[0] + 0.05, PZ.table_y + 0.22, PZ.t1[1] - 0.1, 0.2, 10);
  if (f >= 314 && f < 328) sparkle(out, f, 314, PZ.t1[0] + 0.25, PZ.table_y + 0.22, PZ.t1[1] - 0.06, 0.2, 10);
  out.props.trophies = { p: [0, 0, 0] };
};
const SUIT_PARK3: V3 = Pm(PZ.him_t1[0] - 0.55, 0, PZ.him_t1[1] - 0.25);
const terrace = (out: Stage, cam: CamInfo, f: number, noT3 = false) => {
  // the community: players at T2 and T3, a kid watching (S12: the patrons sit at T3 instead)
  for (const [who, t, s, ex] of [["c1", PZ.t2, -1, "laugh"], ["c2", PZ.t2, 1, "smile"], ["c3", PZ.t3, -1, "grin"], ["c4", PZ.t3, 1, "smile"]] as [Who, number[], -1 | 1, FrontOpts["expr"]][]) if (!(noT3 && t === PZ.t3))
    front(out, cam, who, ...Pm(t[0] + s * 0.5, 0, t[1]), { mode: "sit", chair: SEAT_CHAIR, expr: ex, facing: (-s) as -1 | 1 }, f);
  front(out, cam, "kid", ...Pm(PZ.t2[0] + 0.05, 0, PZ.t2[1] + 0.6), { mode: "stand", expr: "grin" }, f);
  for (const [t, i] of [[PZ.t2, 0], [PZ.t3, 1]] as [number[], number][]) if (!(noT3 && i === 1)) for (let n = 0; n < 4; n++) flat(out, `tcf${i}${n}`, (pp) => art.tcard(pp, 0, 10, 10, 250, 350, { img: ["pika151", "eevee", "sprigatito", "quaxly", "fuecoco", "pawmi", "charmander", "squirtle"][i * 4 + n] }), Pm(t[0] - 0.18 + n * 0.12, PZ.table_y + 0.003, t[1] + (n % 2 ? 0.1 : -0.1)), 0.09, 0, 260, 360, 0.125);
};
const cafe3 = (out: Stage, cam: CamInfo, f: number) => {
  terrace(out, cam, f);
  const S = Pm(PZ.str_t1[0], 0, PZ.str_t1[1]);
  front(out, cam, "stranger", ...S, { mode: "sit", chair: SEAT_CHAIR, expr: f >= NOD3 ? "smile" : "neutral", facing: -1, headTilt: f >= NOD3 && f < NOD3 + 12 ? 0.08 * Math.sin((f - NOD3) * 0.6) : 0 }, f);
  const A = Pm(5.8, 0, -1.3), B = Pm(3.6, 0, -1.55), Cc = HIMT1();
  if (f < WALK3[1]) {
    const P = f < 420 ? lerp3(A, B, ramp(f, WALK3[0], 420)) : lerp3(B, add3(Cc, [0, 0, 0.25]), ramp(f, 420, WALK3[1]));
    const dir = f < 420 ? [-1, -0.1] : [0.2, -1];
    side(out, cam, "him", ...P, dir[0], dir[1], { mode: "march", phase: walkPhase(f, 2), stride: 0.75, expr: "smile" }, f);
    const d = Math.hypot(dir[0], dir[1]), bx = P[0] - (dir[0] / d) * 0.45, bz = P[2] - (dir[1] / d) * 0.45;
    out.props.suitcase = { p: [bx, 0, bz], ry: Math.atan2(dir[1], -dir[0]) * 0 + (f < 420 ? 0 : Math.PI / 2), rz: 0 };
    return;
  }
  out.props.suitcase = { p: SUIT_PARK3, ry: 0 };
  const P = Cc, fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: talkOpen(f, 455, 500) ? "relief_open" : "smile", facing: 1, armOff: 1 };
  front(out, cam, "him", ...P, fo, f);
  const CARDT: V3 = Pm(PZ.t1[0] - 0.02, PZ.table_y + 0.004, PZ.t1[1] + 0.05);
  const rest = restHand(cam, "him", P, fo, 1);
  let hand = rest;
  if (f >= LAY3[0] && f < LAY3[1]) hand = lerp3(add3(rest, [0, 0.15, 0]), CARDT, smooth(ramp(f, LAY3[0], LAY3[1])));
  else if (f >= LAY3[1] && f < LAY3[1] + 16) hand = add3(CARDT, [0.02, 0.06 + 0.02 * Math.sin(f), 0]);
  else if (f >= LAY3[1] + 16) hand = lerp3(add3(CARDT, [0.02, 0.06, 0]), rest, smooth(ramp(f, LAY3[1] + 16, LAY3[1] + 26)));
  const Hd = arm3d(out, cam, "him", P, fo, 1, hand, f);
  if (f >= LAY3[0] && f < LAY3[1]) cardInHand(out, "cat3", [Hd[0], Hd[1] + 0.01, Hd[2] + 0.01], 0.13, "caterpie151");
  if (f >= LAY3[1]) flat(out, "tcat3", (pp) => art.tcard(pp, 0, 10, 10, 250, 350, { img: "caterpie151" }), CARDT, 0.1, 0.3, 260, 360, 0.14);
};
// S12: the glass, the puddle, the friend's wet prints, the patrons pointing
import { glassAt, splashAt } from "./physics";
const T3 = PZ.t3, PAT: [Who, V3][] = [["pat1", Pm(T3[0] - 0.5, 0, T3[1])], ["pat2", Pm(T3[0] + 0.5, 0, T3[1])]];
const WALKA = (): V3 => Pm(5.3, 0, -1.95), WALKB = (): V3 => Pm(4.3, 0, 0.3);
const cafe12 = (out: Stage, cam: CamInfo, f: number) => {
  const sp = splashAt(), Pd = Pm(sp.p[0], 0.004, sp.p[2]);
  // the puddle: grows after the splash, shrinks under the napkin
  const grow = ramp(f, sp.f, sp.f + 11), mop = ramp(f, MOP12[0], MOP12[1]), R = 0.64 * grow * (1 - mop);
  if (R > 0.02) flat(out, `pud${Math.round(R * 50)}`, (pp) => art2.puddle(pp), Pd, R, 0, 256, 256);
  if (f >= sp.f && f < sp.f + 8) { const u = (f - sp.f) / 8; fxc(out, `spl${Math.round(u * 8)}`, 400, 400, (pp) => fxSplash(pp, u), [Pd[0], 0.12, Pd[2]], 0.55, 0.55); }
  // him: talks, knocks the glass, stands, crouches and mops
  const P0 = HIMT1(), MOPP = Pm(sp.p[0] + 0.35, 0, sp.p[2] - 0.05);
  if (f < STAND12) {
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: f >= KNOCK12 + 2 ? "shock" : talkOpen(f, 1478, 1500) ? "relief_open" : "smile", armOff: 1 };
    front(out, cam, "him", ...P0, fo, f, [KNOCK12 + 2]);
    const G0 = Pm(PZ.t1[0] - 0.12, PZ.table_y + 0.06, PZ.t1[1] + 0.3), rest = restHand(cam, "him", P0, fo, 1), up = add3(rest, [0.15, 0.35, 0.05]);
    const hand = f < KNOCK12 - 8 ? lerp3(rest, up, 0.5 + 0.5 * Math.sin(f * 0.3)) : f < KNOCK12 ? lerp3(up, G0, ramp(f, KNOCK12 - 8, KNOCK12)) : lerp3(G0, rest, smooth(ramp(f, KNOCK12, KNOCK12 + 12)));
    arm3d(out, cam, "him", P0, fo, 1, hand, f);
  } else if (f < MOP12[0]) {
    side(out, cam, "him", ...lerp3(P0, MOPP, ramp(f, STAND12, MOP12[0])), 0.6, 1, { mode: "march", phase: walkPhase(f, 2), stride: 0.5, expr: "nervous" }, f);
  } else {
    const fo: FrontOpts = { mode: "stand", crouch: f < MOP12[1] + 6 ? 1 : 1 - ramp(f, MOP12[1] + 6, MOP12[1] + 14), expr: f >= MOP12[1] ? (f >= 1600 ? "nervous" : "relief") : "stern", armOff: -1 };
    front(out, cam, "him", ...MOPP, fo, f);
    const n = (f - MOP12[0]) * 0.45, Np: V3 = f < MOP12[1] ? [Pd[0] + 0.12 * Math.cos(n) * (1 - mop * 0.5), 0.02, Pd[2] + 0.08 * Math.sin(n)] : add3(restHand(cam, "him", MOPP, fo, -1), [0, 0, 0]);
    const Hd = arm3d(out, cam, "him", MOPP, fo, -1, Np, f);
    if (f < MOP12[1] + 20) flat(out, "napkin", (pp) => art2.napkin(pp), [Hd[0], Math.max(0.01, Hd[1] - 0.01), Hd[2]], 0.16, n * 0.2, 200, 160, 0.13);
  }
  // the glass (baked), shown wherever it is
  const g = glassAt(f); out.props.glass = { p: g.p, q: g.q } as PropK;
  out.props.cup = { p: Pm(PZ.t1[0] + 0.12, PZ.table_y, PZ.t1[1] + 0.05) };
  // the friend walks through the puddle and on; wet prints from his step in the water to where he stops
  const A = WALKA(), B = WALKB(), M: V3 = [Pd[0], 0, Pd[2]];
  // leg 1: along the café front into the puddle (the step at STEP12); leg 2: turns toward the lens and walks on
  const leg = (g: number): { p: V3; d: [number, number] } => g < STEP12 ? { p: lerp3(A, M, ramp(g, WALK12[0], STEP12)), d: [-1, 0] } : { p: lerp3(M, B, ramp(g, STEP12, WALK12[1])), d: [B[0] - M[0], B[2] - M[2]] };
  if (f < WALK12[0]) { /* not here yet */ }
  else if (f < WALK12[1]) { const L = leg(f); side(out, cam, "friend", ...L.p, L.d[0], L.d[1], { mode: "march", phase: walkPhase(f, 2), stride: 0.75, expr: "neutral" }, f); }
  else { const fo: FrontOpts = { mode: "stand", expr: f >= POINT12 + 4 ? "nervous" : "neutral", look: f >= LOOK12 ? 1 : 0 }; front(out, cam, "friend", ...B, fo, f, [POINT12 + 4]);
    for (let i = 0; i < 3; i++) { const t0 = 1590 + i * 17, u = ((f - t0) % 34) / 10; if (f >= t0 && u < 1) fxc(out, `drip${Math.round(u * 10)}`, 64, 64, (pp) => art2.tearDrop(pp), [B[0] + (i - 1) * 0.08, 0.12 * (1 - u * u), B[2] + 0.05], 0.035, 0.035); } }
  // wet prints from the puddle to where he stands, one per step (0.38 m), alternating left/right; they fade by f1660
  const L2 = Math.hypot(B[0] - M[0], B[2] - M[2]), ux = (B[0] - M[0]) / L2, uz = (B[2] - M[2]) / L2, n = Math.floor(L2 / 0.38);
  for (let i = 1; i <= n; i++) {
    const tStep = STEP12 + (i * 0.38 / L2) * (WALK12[1] - STEP12); if (f < tStep) break;
    const fade = 1 - ramp(f - tStep, 80, 125); if (fade <= 0.02) continue;
    const sx = (i % 2 ? 0.08 : -0.08), q: V3 = [M[0] + ux * i * 0.38 - uz * sx, 0.003, M[2] + uz * i * 0.38 + ux * sx];
    flat(out, `wet${i % 2}${Math.round(fade * 6)}`, (pp) => { pp.g.globalAlpha = fade; art2.wetPrint(pp); pp.g.globalAlpha = 1; }, q, 0.3, Math.atan2(ux, uz), 128, 128, 0.2);
  }
  // the patrons at T2: grin, look down at the prints, point at the friend
  PAT.forEach(([who, Pp], i) => {
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: f >= POINT12 ? "laugh" : f >= LOOK12 ? "grin" : "smile", facing: i ? -1 : 1, headTilt: f >= LOOK12 && f < POINT12 ? 0.12 : 0, armOff: i ? -1 : 1 };
    front(out, cam, who, ...Pp, fo, f);
    const s = (i ? -1 : 1) as -1 | 1, rest = restHand(cam, who, Pp, fo, s);
    const sh = shoulderAt(cam, who, Pp, fo, s), B2 = WALKB(), dv = [B2[0] - sh[0], 0.3 - sh[1], B2[2] - sh[2]], dl = Math.hypot(dv[0], dv[1], dv[2]), aim: V3 = add3(sh, [dv[0] / dl, dv[1] / dl, dv[2] / dl], 0.44);
    arm3d(out, cam, who, Pp, fo, s, f >= POINT12 ? lerp3(rest, aim, smooth(ramp(f, POINT12, POINT12 + 6))) : rest, f);
  });
};

// ---------------- the Worlds hall (S04) ----------------
const worlds = (out: Stage, cam: CamInfo, f: number) => {
  const H = Wm(WO.him[0], 0, WO.him[1]), O = Wm(WO.opp[0], 0, WO.opp[1]), J = Wm(WO.judge[0], 0, WO.judge[1]);
  const fold = f >= FOLD4 && f < HANDS4, hands = f >= HANDS4;
  const hfo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: f >= FOLD4 ? "stern" : "neutral", facing: 1, armOff: 2 };
  front(out, cam, "him", ...H, hfo, f);
  for (const s of [-1, 1] as (-1 | 1)[]) {
    const rest = restHand(cam, "him", H, hfo, s), ch = chestAt(cam, "him", H, hfo, 0.42, 0.14), up = add3(shoulderAt(cam, "him", H, hfo, s), [s * -0.18 * cam.right.x, 0.36, 0]);
    const hand = hands ? lerp3(ch, up, smooth(ramp(f, HANDS4, HANDS4 + 6))) : fold ? lerp3(rest, add3(ch, [s * 0.05 * cam.right.x, 0, 0]), smooth(ramp(f, FOLD4, FOLD4 + 6))) : rest;
    arm3d(out, cam, "him", H, hfo, s, hand, f);
  }
  const ofo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: "nervous", facing: -1, armOff: -1 };
  front(out, cam, "opp", ...O, ofo, f);
  const omat = Wm(0.18, WO.table_y + 0.02, WO.table[1]), orest = restHand(cam, "opp", O, ofo, -1);
  const oh = f >= SLIDE4 - 10 && f < SLIDE4 + 10 ? lerp3(orest, omat, Math.sin(Math.PI * ramp(f, SLIDE4 - 10, SLIDE4 + 10))) : orest;
  const OH = arm3d(out, cam, "opp", O, ofo, -1, oh, f);
  if (f >= SLIDE4 - 10 && f < SLIDE4 + 2) cardInHand(out, "opc", [OH[0], OH[1] + 0.01, OH[2]], 0.1, "zard151");
  const jfo: FrontOpts = { mode: "stand", expr: "stern", armOff: -1 };
  front(out, cam, "judge", ...J, jfo, f);
  const jr = restHand(cam, "judge", J, jfo, -1), jup = add3(shoulderAt(cam, "judge", J, jfo, -1), [0, 0.44, 0]), jpt = Wm(-0.3, WO.table_y + 0.15, WO.table[1]);
  const jh = f >= RULE4[0] && f < POINT4 ? lerp3(jr, jup, smooth(ramp(f, RULE4[0], RULE4[0] + 6))) : f >= POINT4 ? lerp3(jup, jpt, smooth(ramp(f, POINT4, POINT4 + 6))) : jr;
  arm3d(out, cam, "judge", J, jfo, -1, jh, f);
  // the back tables and the spectators at the rail
  WO.back_tables.forEach(([tx, tz], i) => { for (const s of [-1, 1] as (-1 | 1)[]) front(out, cam, (["c3", "c4", "c5", "c6"] as Who[])[i * 2 + (s > 0 ? 1 : 0)], ...Wm(tx + s * 0.82, 0, tz), { mode: "sit", chair: SEAT_CHAIR, expr: "stern", facing: (-s) as -1 | 1 }, f); });
  for (const [who, x] of [["c1", -1.4], ["c2", 0.9], ["kid", 2.1], ["friend", -3.6]] as [Who, number][]) front(out, cam, who, ...Wm(x, 0, -5.0), { mode: "stand", expr: "smile" }, f);
};

// ---------------- the board (S05, S06): he pins the sheet and writes ----------------
const writer = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const WM = Pm(-0.8, 0, -2.66);
  if (id === 5 && f < WALK5[1]) { side(out, cam, "him", ...lerp3(Pm(0.4, 0, -2.5), WM, ramp(f, WALK5[0], WALK5[1])), -1, -0.15, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "stern" }, f); fxc(out, "blank", 300, 400, (pp) => { pp.g.fillStyle = "#fffdf6"; pp.g.fillRect(0, 0, 300, 400); }, Pm(lerpN(0.4, -0.8, ramp(f, WALK5[0], WALK5[1])) - 0.2, 1.0, -2.45), 0.36, 0.48); return; }
  const px = penPx(id, f), target = px ? sheetWorld(px) : null;
  // he side-steps so the marker stays within reach: his body 0.32 m right of the pen
  let bx = target ? Math.min(-0.8, Math.max(-1.12, target[0] + 0.32)) : -0.8;
  // he steps aside so we can read what he wrote: the end of S05, after the name in S06 (the censor bar lands on a clear view)
  const ASIDE = -0.62;
  if (id === 5 && f >= WRITE5[1]) bx = lerpN(-0.8, ASIDE, smooth(ramp(f, WRITE5[1], WRITE5[1] + 4)));
  if (id === 6 && f < NAME6[0]) bx = lerpN(ASIDE, -1.0, smooth(ramp(f, 739, NAME6[0])));
  if (id === 6 && f >= NAME6[1]) bx = lerpN(-0.82, ASIDE, smooth(ramp(f, NAME6[1], NAME6[1] + 6)));
  const P: V3 = Pm(bx, 0, -2.66);
  const fo: FrontOpts = { mode: "stand", expr: "stern", look: -1, armOff: -1 };
  front(out, cam, "him", ...P, fo, f);
  const rest = restHand(cam, "him", P, fo, -1), PIN = Pm(PZ.sheet[0], PZ.sheet[1] + PZ.sheet_size[1] / 2 - 0.03, PZ.sheet[2] + 0.02);
  let hand: V3 = rest;
  if (id === 5 && f < PIN5 + 2) hand = lerp3(rest, PIN, smooth(ramp(f, WALK5[1], PIN5)));
  else if (target) hand = target;
  else if (id === 6 && f >= NAME6[1]) hand = lerp3(sheetWorld([820, 920]), rest, smooth(ramp(f, NAME6[1], NAME6[1] + 6)));
  else if (id === 6 && f < NAME6[0]) hand = lerp3(rest, sheetWorld([200, 920]), smooth(ramp(f, 739, NAME6[0])));
  else if (id === 5 && f >= WRITE5[1]) hand = lerp3(sheetWorld([860, 796]), rest, smooth(ramp(f, WRITE5[1], WRITE5[1] + 4)));
  else if (id === 5 && f >= 700 && f < DOODLE5[0]) hand = lerp3(sheetWorld([860, 456]), sheetWorld([240, 300]), smooth(ramp(f, 700, DOODLE5[0])));
  else if (id === 5 && f >= DOODLE5[1] && f < 718) hand = lerp3(sheetWorld([240, 560]), sheetWorld([60, 640]), smooth(ramp(f, DOODLE5[1], 718)));
  const Hd = arm3d(out, cam, "him", P, fo, -1, hand, f);
  arm3d(out, cam, "him", P, { ...fo, armOff: 1 }, 1, restHand(cam, "him", P, fo, 1), f);
  if (!(id === 5 && f < PIN5)) fxc(out, "marker", 240, 100, (pp) => art2.marker(pp), [Hd[0] + 0.03, Hd[1] - 0.01, Hd[2] + 0.02], 0.11, 0.046, { rot: 2.6 });
  if (id === 5 && f >= PIN5 && f < PIN5 + 4) burst(out, f, PIN5, PIN[0], PIN[1], PIN[2] + 0.01, 0.2, 4, "#ffffff");
  if (id === 6 && f >= CENSOR6 && f < CENSOR6 + 5) burst(out, f, CENSOR6, ...sheetWorld([510, 925]), 0.5, 5, "#ffffff");
};
/** passers-by crossing the square (S05-S08 background, S07 the six-hour stream) */
const stream = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const W: Who[] = ["c1", "c2", "c3", "c4", "c5"];
  if (id === 7) {
    W.forEach((who, i) => {
      const z = -1.9 + (i % 3) * 0.45, dir = i % 2 ? 1 : -1, t0 = SPIN7[0] + i * 5, dur = 22, stop = i < 3 ? FLASH7[i] : -1;
      if (f < t0) return;
      const x0 = dir > 0 ? -3.2 : 3.2, x1 = -x0, k = ramp(f, t0, t0 + dur);
      if (stop > 0 && f >= stop - 4 && f < stop + 6) { const P = Pm(-1.2 + (i - 1) * 0.5, 0, z); front(out, cam, who, ...P, { mode: "stand", expr: "grin", armOff: 2 }, f); const ph = add3(chestAt(cam, who, P, { mode: "stand" }, -0.1, 0.25), [0, 0, 0]);
        for (const s of [-1, 1] as (-1 | 1)[]) arm3d(out, cam, who, P, { mode: "stand", armOff: 2 }, s, add3(ph, [s * 0.04 * cam.right.x, -0.04, s * 0.04 * cam.right.z]), f);
        fxc(out, "pback", 150, 260, (pp) => phoneBack(pp), ph, 0.075, 0.13); flashAt(out, f, stop, add3(ph, [0, 0.04, 0.02])); return; }
      if (k >= 1) return;
      side(out, cam, who, ...Pm(lerpN(x0, x1, k), 0, z), dir, 0, { mode: "march", phase: walkPhase(f, 3.5), stride: 1.1, expr: "smile" }, f);
    });
    return;
  }
  // a calm background passer-by
  const k = ((f * 0.012) % 1), P = Pm(lerpN(3.4, -3.4, k), 0, -4.6);
  side(out, cam, "c2", ...P, -1, 0, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "smile" }, f);
};

// ---------------- 16 Oct (S08) and the quote (S09) ----------------
const SIT: V3 = [PZ.sit[0], 0, PZ.sit[1]], SUIT_SIT: V3 = [PZ.sit[0], 0, PZ.sit[1] - 0.1];
const ANN_PIN = (): V3 => Pm(PZ.ann[0], PZ.ann[1] + PZ.ann_size[1] / 2 - 0.03, PZ.ann[2] + 0.02);
const leaving = (out: Stage, cam: CamInfo, f: number) => {
  const A = Pm(1.9, 0, -2.3), M = Pm(-0.2, 0, -2.66);
  if (f < WALK8[1]) {
    const P = lerp3(A, M, ramp(f, WALK8[0], WALK8[1])); side(out, cam, "him", ...P, -1, -0.17, { mode: "march", phase: walkPhase(f, 1.8), stride: 0.65, expr: "sad" }, f);
    out.props.suitcase = { p: [P[0] + 0.45, 0, P[2] + 0.05], ry: 0, tag: Math.sin(f * 0.4) * 0.3 } as PropK; return;
  }
  out.props.suitcase = { p: [M[0] + 0.5, 0, M[2] + 0.08], ry: 0, tag: f < 962 ? 0.35 * Math.sin((f - WALK8[1]) * 0.35) * Math.exp(-(f - WALK8[1]) / 20) : 0 } as PropK;
  const fo: FrontOpts = { mode: "stand", expr: "sad", look: -1, armOff: -1 };
  front(out, cam, "him", ...M, fo, f);
  const rest = restHand(cam, "him", M, fo, -1), ch = chestAt(cam, "him", M, fo, 0.45, 0.15), PIN = ANN_PIN();
  let hand: V3 = rest, held = false;
  if (f >= ANN8[0] && f < ANN8[0] + 8) { hand = lerp3(rest, ch, smooth(ramp(f, ANN8[0], ANN8[0] + 8))); held = true; }
  else if (f >= ANN8[0] + 8 && f < ANN8[1]) { hand = lerp3(ch, PIN, smooth(ramp(f, ANN8[0] + 8, ANN8[1]))); held = true; }
  else if (f >= ANN8[1] && f < ANN8[1] + 10) hand = lerp3(PIN, rest, smooth(ramp(f, ANN8[1], ANN8[1] + 10)));
  const Hd = arm3d(out, cam, "him", M, fo, -1, hand, f);
  arm3d(out, cam, "him", M, { ...fo, armOff: 1 }, 1, restHand(cam, "him", M, fo, 1), f);
  if (held) fxc(out, "annH", 220, 290, (pp) => annSmall(pp), [Hd[0], Hd[1] - 0.2, Hd[2] + 0.02], 0.3, 0.4);
  if (f >= ANN8[1] && f < ANN8[1] + 4) burst(out, f, ANN8[1], PIN[0], PIN[1], PIN[2] + 0.01, 0.2, 4, "#ffffff");
};
const sitter = (out: Stage, cam: CamInfo, f: number, id: number) => {
  out.props.suitcase = { p: SUIT_SIT, ry: 0 };
  const P = Pm(...SIT);
  if (near(cam, P, 0.5)) return;
  const slump = id === 9 ? ramp(f, SLUMP9[0], SLUMP9[1]) : 1, crying = (id === 9 && f >= CRY9[0]) || id === 19;
  const fo: FrontOpts = slump < 1 ? { mode: "stand", crouch: slump, expr: "sad", armOff: 2 } : { mode: "sit", chair: SEAT_CHAIR, expr: "sad", headTilt: id === 9 && f >= CARD9[0] && f < CARD9[1] ? 0.12 : 0.05, armOff: 2 };
  front(out, cam, "him", ...P, fo, f, crying ? [] : []);
  const card = id === 9 && f >= CARD9[0] && f < CARD9[1] + 8, ch = chestAt(cam, "him", P, fo, 0.55, 0.2);
  for (const s of [-1, 1] as (-1 | 1)[]) { const rest = restHand(cam, "him", P, fo, s), k = card ? smooth(ramp(f, CARD9[0], CARD9[0] + 10)) * (1 - ramp(f, CARD9[1], CARD9[1] + 8)) : 0;
    arm3d(out, cam, "him", P, fo, s, lerp3(rest, add3(ch, [s * 0.045 * cam.right.x, -0.06, s * 0.045 * cam.right.z]), k), f); }
  if (card && f < CARD9[1]) cardInHand(out, "cat9", add3(ch, [0, 0.02, 0.01]), 0.15, "caterpie151");
  // tears: a drop every 6 frames from each eye, falling to the cobbles; the dots stay
  const eyeL = add3(chestAt(cam, "him", P, fo, -0.62, 0.12), [-0.06 * cam.right.x, 0, -0.06 * cam.right.z]), eyeR = add3(eyeL, [0.12 * cam.right.x, 0, 0.12 * cam.right.z]);
  if (crying) for (const [e, i] of [[eyeL, 0], [eyeR, 1]] as [V3, number][]) for (let t0 = CRY9[0] + i * 3; t0 <= f; t0 += 6) {
    const t = (f - t0) / 30, y = e[1] - 4.9 * t * t; if (y < 0.02) continue;
    fxc(out, `tear`, 64, 64, (pp) => art2.tearDrop(pp), [e[0] + (i ? 0.02 : -0.02) * cam.right.x, y, e[2] + 0.01], 0.03, 0.03);
  }
  if (crying || id > 9) { const n = id === 9 ? Math.floor((f - CRY9[0]) / 6) : 7; for (let i = 0; i < Math.min(n, 7); i++) flat(out, `wd${i}`, (pp) => art2.wetDot(pp), Pm(SIT[0] - 0.12 + 0.04 * i, 0.003, SIT[2] + 0.12 + 0.03 * (i % 3)), 0.05, i, 64, 64, 0.035); }
};

// ---------------- the turn (S10), the board's view (S13) ----------------
const friend10 = (out: Stage, cam: CamInfo, f: number) => {
  const P = Pm(-0.6, 0, -1.3), fo: FrontOpts = { mode: "stand", expr: f >= SHRUG10 ? "dazed" : "nervous", look: f < SCRATCH10[0] ? -1 : 0, armOff: 2 };
  front(out, cam, "friend", ...P, fo, f, [SHRUG10]);
  const restL = restHand(cam, "friend", P, fo, -1), restR = restHand(cam, "friend", P, fo, 1);
  const pt = add3(shoulderAt(cam, "friend", P, fo, -1), [-0.15, 0.12, -0.4]), head = add3(chestAt(cam, "friend", P, fo, -0.95, 0.05), [0.1 * cam.right.x, 0, 0.1 * cam.right.z]);
  const shrugL = add3(shoulderAt(cam, "friend", P, fo, -1), [-0.28 * cam.right.x, 0.12, -0.28 * cam.right.z]), shrugR = add3(shoulderAt(cam, "friend", P, fo, 1), [0.28 * cam.right.x, 0.12, 0.28 * cam.right.z]);
  let L = restL, R = restR;
  if (f >= POINT10 && f < 1292) L = lerp3(restL, pt, smooth(ramp(f, POINT10, POINT10 + 6)) * (1 - ramp(f, 1286, 1292)));
  if (f >= SCRATCH10[0] && f < SCRATCH10[1]) R = add3(head, [0.02 * Math.sin(f * 1.3), 0.015 * Math.sin(f * 1.7), 0]);
  if (f >= SHRUG10) { const k = smooth(ramp(f, SHRUG10, SHRUG10 + 5)); L = lerp3(restL, shrugL, k); R = lerp3(restR, shrugR, k); }
  arm3d(out, cam, "friend", P, fo, -1, L, f); arm3d(out, cam, "friend", P, fo, 1, R, f);
};
const crowd13 = (out: Stage, cam: CamInfo, f: number) => {
  (["c1", "c2", "c3", "c4", "c5"] as Who[]).forEach((who, i) => {
    const P = Pm(-1.8 + i * 0.4, 0, 1.3 + (i % 2) * 0.35), fo: FrontOpts = { mode: "stand", expr: (["grin", "shock", "laugh", "grin", "nervous"] as FrontOpts["expr"][])[i], armOff: 2 };
    front(out, cam, who, ...P, fo, f);
    const up = f >= 1662 + i * 6 ? smooth(ramp(f, 1662 + i * 6, 1672 + i * 6)) : 0, ph = chestAt(cam, who, P, fo, -0.15, 0.28);
    for (const s of [-1, 1] as (-1 | 1)[]) arm3d(out, cam, who, P, fo, s, lerp3(restHand(cam, who, P, fo, s), add3(ph, [s * 0.04 * cam.right.x, -0.05, s * 0.04 * cam.right.z]), up), f);
    if (up > 0.3) { fxc(out, "pback", 150, 260, (pp) => phoneBack(pp), [ph[0], ph[1] - 0.02, ph[2]], 0.075, 0.13); flashAt(out, f, FLASH13[i], [ph[0] - 0.02 * cam.right.x, ph[1] + 0.03, ph[2] + 0.02]); }
  });
};

// ---------------- the scale (S14, S15) ----------------
const SC = PZ.scale;
const team = (t: number[][], who: Who[]): [Who, V3][] => t.map((p, i) => [who[i], Pm(SC[0] + p[0], 0, SC[1] + p[1])]);
const NEAR = team(PZ.near_team, ["c1", "c2", "c3"]), FAR = team(PZ.far_team, ["c4", "c5", "c6"]);
const CLUSTER = (i: number): V3 => Pm(SC[0] + 1.6 + (i % 3) * 0.4, 0, SC[1] + 0.6 + (i < 3 ? 0.3 : -0.3));
/** the two lifters carry a weight between them: crouch to grab, rise, carry onto the pan */
const lift = (out: Stage, cam: CamInfo, f: number, team: [Who, V3][], [a, b]: number[], drop: number, ground: V3, panTop: V3, expr: FrontOpts["expr"], high: boolean) => {
  const u = ramp(f, a, b), grab = ramp(f, a, a + 8), rise = ramp(f, a + 10, a + 24), carry = ramp(f, a + 24, drop - 2);
  const inLift = f >= a && f < drop + 4;
  const upY = Math.max(ground[1], panTop[1]) + 0.12;
  const wp: V3 = f < a + 10 ? ground : f < a + 24 ? [ground[0], lerpN(ground[1], upY, smooth(rise)), ground[2]] : f < drop ? lerp3([ground[0], upY, ground[2]], [panTop[0], panTop[1] + 0.03 + 0.09 * (1 - carry), panTop[2]], smooth(carry)) : panTop;
  const off: V3 = [panTop[0] - ground[0], 0, panTop[2] - ground[2]], kc = f >= a + 24 ? (f < drop ? smooth(carry) : 1) : 0;
  void u;
  team.forEach(([who, P0], i) => {
    if (i === 2) { front(out, cam, who, ...P0, { mode: "stand", expr }, f); return; }
    const P: V3 = f >= drop + 4 ? P0 : add3(P0, off, kc * (inLift ? 1 : 0));
    const crouch = f >= a && f < a + 10 ? grab * 0.9 : f >= a + 10 && f < a + 24 ? 0.9 * (1 - rise) : 0;
    const fo: FrontOpts = { mode: "stand", crouch, expr: inLift ? "pained" : expr, armOff: 2 };
    front(out, cam, who, ...P, fo, f);
    const vx = P[0] - wp[0], vz = P[2] - wp[2], vl = Math.hypot(vx, vz) || 1, hold: V3 = [wp[0] + (vx / vl) * 0.17, wp[1] + 0.2, wp[2] + (vz / vl) * 0.17];
    for (const s of [-1, 1] as (-1 | 1)[]) arm3d(out, cam, who, P, fo, s, inLift ? add3(hold, [0, s * 0.02, 0]) : restHand(cam, who, P, fo, s), f);
  });
  return wp;
};
const scale = (out: Stage, cam: CamInfo, f: number, id: number) => {
  // the split: a cluster to the right of the scale walks apart to the two pans
  const all = [...NEAR, ...FAR];
  if (id === 14 && f < SPLIT14[1]) {
    all.forEach(([who, P], i) => { const k = ramp(f, SPLIT14[0] + i * 3, SPLIT14[1] - 6 + i), A = CLUSTER(i), Q = lerp3(A, P, smooth(k));
      if (k <= 0 || k >= 1) front(out, cam, who, ...(k <= 0 ? A : P), { mode: "stand", expr: "stern", facing: i < 3 ? 0 : 0 }, f);
      else side(out, cam, who, ...Q, P[0] - A[0], P[2] - A[2], { mode: "march", phase: walkPhase(f, 2), stride: 0.6, expr: "stern" }, f); });
    out.props.w1 = { p: W1_GROUND.map((v, i) => v + PZo[i]) }; out.props.w2 = { p: W2_GROUND.map((v, i) => v + PZo[i]) };
    return;
  }
  const nearPan = panAt(id, f, 1), farPan = panAt(id, f, -1);
  let w1: V3 = Pm(...W1_GROUND), w2: V3 = Pm(...W2_GROUND);
  if (id === 14) w1 = lift(out, cam, f, NEAR, LIFT14, DROP14, Pm(...W1_GROUND), nearPan, f >= DROP14 + 5 ? "shock" : "stern", false);
  else lift(out, cam, f, NEAR, [99999, 99999], 99999, Pm(...W1_GROUND), nearPan, id === 15 && f >= DROP15 + 30 ? "stern" : "nervous", false);
  if (id >= 15) { w1 = nearPan; }
  if (id === 15) w2 = lift(out, cam, f, FAR, LIFT15, DROP15, Pm(...W2_GROUND), farPan, f >= DROP15 + 30 ? "stern" : "stern", true);
  else lift(out, cam, f, FAR, [99999, 99999], 99999, Pm(...W2_GROUND), farPan, "stern", false);
  if (id > 15) { w1 = nearPan; w2 = farPan; }
  if (id === 14 && f >= DROP14 + 5) { if (f < DROP14 + 13) { const u = (f - DROP14 - 5) / 8; fxc(out, `pf${Math.round(u * 8)}`, 300, 300, (pp) => fxPuff(pp, u), [nearPan[0], 0.1, nearPan[2]], 1.0, 0.4, { soft: true }); } }
  out.props.w1 = { p: w1 }; out.props.w2 = { p: w2 };
};
/** the weights when no one is around them (every other shot): on the ground before the debate, on the pans after */
const weightsIdle = (out: Stage, f: number, id: number) => {
  if (out.props.w1) return;
  const after = id >= 16;
  out.props.w1 = { p: after ? panAt(id, f, 1) : Pm(...W1_GROUND) }; out.props.w2 = { p: after ? panAt(id, f, -1) : Pm(...W2_GROUND) };
};

// ---------------- the crow (S16 on) ----------------
const CROW_PERCH: V3 = [-0.95, PZ.board.post_top + 0.08, PZ.board.c[1] - 0.05];
const crow = (out: Stage, f: number, id: number) => {
  if (id < 16 || id === 13) return;
  let p = Pm(...CROW_PERCH), pose = 0;
  if (id === 16 && f < CROW16[1]) { if (f < CROW16[0]) return; const u = ramp(f, CROW16[0], CROW16[1]); p = lerp3(Pm(0.9, 3.6, -2.4), p, smooth(u)); p[1] += 0.25 * Math.sin(Math.PI * u); pose = Math.floor(f / 3) % 2; }
  const caw = id === 16 && f >= CAW16 && f < CAW16 + 8;
  fxc(out, `crow${pose}${caw}`, 300, 260, (pp) => art2.crow(pp, pose, caw), [p[0], p[1] + 0.15, p[2]], 0.36, 0.31);
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place;
  if (place === "piazza") { insiders(out, cam, f); }
  if (id === 1) { ripper(out, cam, f, 1); staff(out, cam, f, 1); }
  if (id === 2) cafe2(out, cam, f);
  if (id === 3) cafe3(out, cam, f);
  if (id === 4) worlds(out, cam, f);
  if (id === 5 || id === 6) { writer(out, cam, f, id); stream(out, cam, f, id); }
  if (id === 7) { stream(out, cam, f, 7); ripper(out, cam, f, 7); }
  if (id === 8) { leaving(out, cam, f); staff(out, cam, f, 8); }
  if (id === 9 || id === 19 || (id >= 10 && id <= 18 && id !== 12 && id !== 13)) sitter(out, cam, f, id);
  if (id === 10) friend10(out, cam, f);
  if (id === 12) { cafe12(out, cam, f); terrace(out, cam, f, true); }
  if (id === 13) crowd13(out, cam, f);
  if (id === 14 || id === 15) scale(out, cam, f, id);
  if (place === "piazza") { lockAndSign(out, f, id); weightsIdle(out, f, id); crow(out, f, id); }
  return out;
};
void IDX; void tier; void glowAt; void faceTo; void SKIN; void easeOut; void v3; void holdHand; void fxBurst; void fxRing; void bodyFront; void bodySide; void fxShadow; void fxContact; void NOINK; void cardShade; void blobMaterial; void CARD_K; void LOOKS; void lidAt; void hexOf; void CONTACT; void TAIL; void toSrgb;
