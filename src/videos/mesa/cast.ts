// The Mira Mesa reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN, Expr } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, GYo, BEo, clamp01, smooth, easeOut, GYMP, BEACHP,
  TILT1, GLANCE1, BOLT1, DOOR1, SHOP2, LAY2, EASEL2, WALK4, LIFT4, TAKE4, UP4, GLANCE5, BOLT5, DOOR6, LAUGH6, DROPFACE7, DOOR8, LIMP8, PAIN8, SEDAN8, FREEZE9,
  HAND10, BACK10, WALK11, GIVE11, BACK11, RAISE11, PIN14, SHRUG14, GUARD15, WOMAN16, TAKE16, EASEL16, BILLS16, ROUND17, PRESS17, TAPE17, TALK17, RUN18,
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
const IDX: Record<Who, number> = { dad: 3, girl: 4, stranger: 5, woman: 6, cop: 7, guard: 8, mum: 9, dad2: 10, kid2: 11, stranger2: 12, v1: 13, v2: 14, v3: 15, v4: 16, v5: 17, v6: 18 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[mesa] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Gm = (x: number, y: number, z: number) => at(GYo, x, y, z);
const Bm = (x: number, y: number, z: number) => at(BEo, x, y, z);
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const talkOpen = (f: number, a: number, b: number) => f >= a && f < b && Math.floor((f - a) / 5) % 2 === 1;
const P = GYMP, TOPY = P.table_y, BP = BEACHP;
const mk = (m: number[]): V3 => Gm(m[0], 0, m[1]);
const mkB = (m: number[]): V3 => Bm(m[0], 0, m[1]);
/** a walk between two marks (side view), then standing */
const walkTo = (out: Stage, cam: CamInfo, who: Who, A: V3, B: V3, f: number, a: number, b: number, so: SideOpts = {}) => {
  const u = ramp(f, a, b), p = lerp3(A, B, smooth(u)), dx = B[0] - A[0], dz = B[2] - A[2];
  side(out, cam, who, ...p, dx, dz, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "neutral", ...so }, f);
  return p;
};
/** move along a polyline at constant speed (linear in time: a run doesn't ease) */
const pathAt = (pts: V3[], u: number) => {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[2] - pts[i][2])), T = L.reduce((x, y) => x + y, 0);
  let d = clamp01(u) * T, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; }
  const A = pts[i], B = pts[i + 1]; return { p: lerp3(A, B, Math.min(1, d / L[i])), dir: [B[0] - A[0], 0, B[2] - A[2]] as V3 };
};

// ---- the booth: hands, the case ----
const PALM = (): V3 => Gm(-0.33, 1.1, 0.93);                    // the father's open palm over the table, waiting
const HANDOVER = (): V3 => Gm(P.handover[0], P.handover[1], P.handover[2]);
const EASEL = (): V3 => Gm(P.easel[0], TOPY + 0.094, P.easel[2] + 0.01);
/** the stranger (or anyone) holding a case up at eye level with both hands */
const holdUp = (out: Stage, cam: CamInfo, who: Who, p: V3, fo: FrontOpts, f: number, key: "heroCase" | "replicaCase", tilt = 0, drop = 0.05) => {
  const c = chestAt(cam, who, p, fo, drop, 0.2), r = cam.right;
  arm3d(out, cam, who, p, fo, -1, [c[0] - r.x * 0.05, c[1] - 0.05, c[2] - r.z * 0.05], f); arm3d(out, cam, who, p, fo, 1, [c[0] + r.x * 0.05, c[1] - 0.05, c[2] + r.z * 0.05], f);
  out.props[key] = { p: c, ry: faceTo(cam, c[0], c[2]), rz: tilt };
  return c;
};
const rest2 = (out: Stage, cam: CamInfo, who: Who, p: V3, fo: FrontOpts, f: number) => { arm3d(out, cam, who, p, fo, -1, restHand(cam, who, p, fo, -1), f); arm3d(out, cam, who, p, fo, 1, restHand(cam, who, p, fo, 1), f); };
const speed = (out: Stage, cam: CamInfo, p: V3, dir: V3, f: number, s = 1) => {
  const L = Math.hypot(dir[0], dir[2]) || 1, back: V3 = [p[0] - (dir[0] / L) * 0.55 * s, p[1] + 1.0 * s, p[2] - (dir[2] / L) * 0.55 * s];
  const sx = (dir[0] * cam.right.x + dir[2] * cam.right.z) < 0 ? -1 : 1;
  fxc(out, `speed${f % 3}`, 400, 200, (pp) => art2.speedLines(pp, 400, 200, f % 3), back, 0.9 * s, 0.45 * s, { soft: true, rot: sx < 0 ? Math.PI : 0 });
};
/** the stranger sprints along a path (side view, fast legs), the case clutched at his side */
const runner = (out: Stage, cam: CamInfo, f: number, pts: V3[], a: number, b: number, withCase = true, s = 1) => {
  if (f < a || f > b) return null;
  const { p, dir } = pathAt(pts, (f - a) / (b - a));
  if (near(cam, p, 0.9)) return p;
  side(out, cam, "stranger", ...p, dir[0], dir[2], { mode: "march", phase: walkPhase(f, 3.2), stride: 1.15, expr: "grin" }, f);
  speed(out, cam, p, dir, f, s);
  if (withCase) out.props.heroCase = { p: [p[0], p[1] + 1.12, p[2]], ry: faceTo(cam, p[0], p[2]), rz: 0.3 };
  return p;
};
const RUNPATH = (): V3[] => [mk(P.stranger), Gm(0.6, 0, 3.6), mk(P.door_in), mk(P.door_out), Gm(4.2, 0, 13.0)];
/** dad at his mark behind the table, palm open over it (waiting to get the card back) */
const dadPalm = (out: Stage, cam: CamInfo, f: number, expr: Expr, swaps: number[] = [], extra: Partial<FrontOpts> = {}) => {
  const p = mk(P.dad); if (near(cam, p)) return;
  const fo: FrontOpts = { mode: "stand", expr, armOff: 2, ...extra };
  front(out, cam, "dad", ...p, fo, f, swaps);
  arm3d(out, cam, "dad", p, fo, 1, PALM(), f); arm3d(out, cam, "dad", p, fo, -1, restHand(cam, "dad", p, fo, -1), f);
};
const girlAt = (out: Stage, cam: CamInfo, f: number, expr: Expr, swaps: number[] = [], extra: Partial<FrontOpts> = {}) => {
  const p = mk(P.girl); if (near(cam, p)) return null;
  const fo: FrontOpts = { mode: "stand", expr, armOff: 2, ...extra }; front(out, cam, "girl", ...p, fo, f, swaps); return { p, fo };
};
const dadAt = (out: Stage, cam: CamInfo, f: number, expr: Expr, swaps: number[] = [], extra: Partial<FrontOpts> = {}) => {
  const p = mk(P.dad); if (near(cam, p)) return null;
  const fo: FrontOpts = { mode: "stand", expr, armOff: 2, ...extra }; front(out, cam, "dad", ...p, fo, f, swaps); return { p, fo };
};

// ---- the hall: vendors behind every other table, shoppers browsing ----
const VEND: Who[] = ["v1", "v2", "v3", "v4", "v5", "v6"];
const AISLE: [number, number, Who][] = [[-6.2, 3.4, "v5"], [5.6, 2.8, "v6"], [-2.4, 2.8, "v1"], [3.8, -1.4, "v4"], [-5.0, -4.4, "v3"], [6.2, -4.6, "v2"]];
const crowd = (out: Stage, cam: CamInfo, f: number, id: number, skip: number[] = []) => {
  P.tables.forEach(([cx, cz], i) => { if (skip.includes(i)) return; const p = Gm(cx, 0, cz - 0.42); if (!near(cam, p)) front(out, cam, VEND[i % 6], ...p, { mode: "stand", expr: "smile", look: (i % 3) - 1 }, f); });
  if (id === 10) return;
  AISLE.forEach(([x, z, w], i) => { const p = Gm(x, 0, z); if (!near(cam, p)) front(out, cam, w, ...p, { mode: "stand", expr: i % 2 ? "smile" : "neutral", look: (i % 3) - 1 }, f); });
};
/** the guard at his post (S15 on) */
const guardPost = (out: Stage, cam: CamInfo, f: number) => { const p = mk(P.guard); if (!near(cam, p)) front(out, cam, "guard", ...p, { mode: "stand", expr: "stern", look: -0.5 }, f); };

// ---- S01: the hook ----
const s01 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 1);
  const shock = f >= 150;
  dadPalm(out, cam, f, shock ? "shock" : "smile", [150], shock ? { gape: 0.35 } : {});
  const g = girlAt(out, cam, f, shock ? "shock" : "smile", [152]); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
  if (f < BOLT1) {
    const p = mk(P.stranger), fo: FrontOpts = { mode: "stand", expr: f >= GLANCE1 ? "grin" : "smile", look: f >= GLANCE1 ? 1 : 0, armOff: 2 };
    front(out, cam, "stranger", ...p, fo, f, [GLANCE1]);
    const tilt = 0.25 * Math.sin(ramp(f, TILT1[0], TILT1[0] + 20) * Math.PI) - 0.25 * Math.sin(ramp(f, TILT1[1], TILT1[1] + 20) * Math.PI);
    holdUp(out, cam, "stranger", p, fo, f, "heroCase", tilt);
  } else runner(out, cam, f, RUNPATH(), BOLT1, DOOR1 + 16 + 28);
};
// ---- S02: the morning ----
const s02 = (out: Stage, cam: CamInfo, f: number) => {
  if (f < 330) { walkTo(out, cam, "v1", Gm(4.6, 0, 14.5), mk(P.door_out), f, SHOP2[0], SHOP2[1], { expr: "smile" }); walkTo(out, cam, "v4", Gm(-1.5, 0, 15.2), Gm(1.6, 0, 9.0), f, SHOP2[0] + 8, SHOP2[1], { expr: "smile" }); }
  crowd(out, cam, f, 2);
  // dad lays top-loaders into the tray, one at a time
  const d = dadAt(out, cam, f, "smile");
  if (d) { let hand = restHand(cam, "dad", d.p, d.fo, 1);
    for (let i = 0; i < 3; i++) { const t0 = LAY2[i], slot = Gm(-0.42 + 0.14 * i, TOPY + 0.1, 1.04); if (f >= t0 - 10 && f < t0 + 10) { const u = f < t0 ? smooth((f - t0 + 10) / 10) : 1 - smooth((f - t0) / 10); hand = lerp3(restHand(cam, "dad", d.p, d.fo, 1), slot, u);
        if (f < t0) fxc(out, `lay${i}`, 350, 500, (pp) => art2.toploader(pp, 350, 500, ["pika151", "eevee", "abra"][i]), [hand[0], hand[1] + 0.03, hand[2]], 0.063, 0.09); } }
    arm3d(out, cam, "dad", d.p, d.fo, 1, hand, f); arm3d(out, cam, "dad", d.p, d.fo, -1, restHand(cam, "dad", d.p, d.fo, -1), f); }
  // the girl sets the Bubble Mew on the easel
  const g = girlAt(out, cam, f, "smile");
  if (g) { if (f < EASEL2[1]) { const hold = chestAt(cam, "girl", g.p, g.fo, 0.35, 0.16), k = smooth(ramp(f, EASEL2[0], EASEL2[1])), c = lerp3(hold, EASEL(), k);
      out.props.heroCase = { p: c, ry: faceTo(cam, c[0], c[2]) }; const r = cam.right;
      arm3d(out, cam, "girl", g.p, g.fo, -1, [c[0] - r.x * 0.045, c[1] - 0.03, c[2] - r.z * 0.045], f); arm3d(out, cam, "girl", g.p, g.fo, 1, [c[0] + r.x * 0.045, c[1] - 0.03, c[2] + r.z * 0.045], f); }
    else rest2(out, cam, "girl", g.p, g.fo, f); }
};
// ---- S03-S04: the card, the hand-over ----
const strangerWalkUp = (out: Stage, cam: CamInfo, f: number) => {
  if (f < WALK4[0]) return false;
  if (f < WALK4[1]) { walkTo(out, cam, "stranger", Gm(-2.6, 0, 3.4), mk(P.stranger), f, WALK4[0], WALK4[1], { expr: "smile" }); return true; }
  return false;
};
const s03 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 3);
  const d = dadAt(out, cam, f, "smile"); if (d) rest2(out, cam, "dad", d.p, d.fo, f);
  const g = girlAt(out, cam, f, "smile", [], { look: 0.6 }); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
  strangerWalkUp(out, cam, f);
};
const DADSTEP = (): V3 => Gm(0.12, 0, 0.6);
const s04 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 4);
  const g = girlAt(out, cam, f, "smile", [], { look: -0.6 }); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
  // the stranger: walks up, takes the case at TAKE4, lifts it to his eyes
  const sp = mk(P.stranger), sfo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2, look: -0.4 };
  if (!strangerWalkUp(out, cam, f)) {
    front(out, cam, "stranger", ...sp, sfo, f);
    if (f < TAKE4 - 8) rest2(out, cam, "stranger", sp, sfo, f);
    else if (f < UP4[0]) { arm3d(out, cam, "stranger", sp, sfo, -1, lerp3(restHand(cam, "stranger", sp, sfo, -1), HANDOVER(), smooth(ramp(f, TAKE4 - 8, TAKE4))), f); arm3d(out, cam, "stranger", sp, sfo, 1, restHand(cam, "stranger", sp, sfo, 1), f); }
    else { const k = smooth(ramp(f, UP4[0], UP4[1])), up = chestAt(cam, "stranger", sp, sfo, 0.05, 0.2), c = lerp3(HANDOVER(), up, k), r = cam.right;
      arm3d(out, cam, "stranger", sp, sfo, -1, [c[0] - r.x * 0.05, c[1] - 0.05, c[2] - r.z * 0.05], f); arm3d(out, cam, "stranger", sp, sfo, 1, k > 0.5 ? [c[0] + r.x * 0.05, c[1] - 0.05, c[2] + r.z * 0.05] : restHand(cam, "stranger", sp, sfo, 1), f);
      out.props.heroCase = { p: c, ry: faceTo(cam, c[0], c[2]) }; }
  }
  // dad: steps to the easel, lifts the case, steps back, holds it out; after the take his palm stays open
  const home = mk(P.dad);
  if (f < LIFT4 - 4) { walkTo(out, cam, "dad", home, DADSTEP(), f, 586, LIFT4 - 4, { expr: "smile" }); return; }
  if (f < 604) { const fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 }; front(out, cam, "dad", ...DADSTEP(), fo, f);
    const c = f < LIFT4 ? EASEL() : lerp3(EASEL(), chestAt(cam, "dad", DADSTEP(), fo, 0.4, 0.16), smooth(ramp(f, LIFT4, 604)));
    arm3d(out, cam, "dad", DADSTEP(), fo, 1, lerp3(restHand(cam, "dad", DADSTEP(), fo, 1), c, smooth(ramp(f, LIFT4 - 4, LIFT4))), f); arm3d(out, cam, "dad", DADSTEP(), fo, -1, restHand(cam, "dad", DADSTEP(), fo, -1), f);
    if (f >= LIFT4) out.props.heroCase = { p: c, ry: faceTo(cam, c[0], c[2]) }; return; }
  if (f < 616) { const p = walkTo(out, cam, "dad", DADSTEP(), home, f, 604, 616, { expr: "smile", reach: 0.7 }); out.props.heroCase = { p: [p[0], 1.1, p[2] + 0.2], ry: faceTo(cam, p[0], p[2] + 0.2) }; return; }
  const fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 }; front(out, cam, "dad", ...home, fo, f);
  if (f < TAKE4) { const c = lerp3(chestAt(cam, "dad", home, fo, 0.4, 0.16), HANDOVER(), smooth(ramp(f, 616, TAKE4 - 4))); arm3d(out, cam, "dad", home, fo, 1, c, f); out.props.heroCase = { p: c, ry: faceTo(cam, c[0], c[2]) }; }
  else arm3d(out, cam, "dad", home, fo, 1, lerp3(HANDOVER(), PALM(), smooth(ramp(f, TAKE4, TAKE4 + 8))), f);
  arm3d(out, cam, "dad", home, fo, -1, restHand(cam, "dad", home, fo, -1), f);
};
// ---- S05-S07: gone; the joke; the doors ----
const s05 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 5);
  dadPalm(out, cam, f, f >= BOLT5 + 10 ? "nervous" : "smile", [BOLT5 + 10]);
  const g = girlAt(out, cam, f, f >= BOLT5 + 6 ? "shock" : "smile", [BOLT5 + 6]); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
  if (f < BOLT5) { const p = mk(P.stranger), fo: FrontOpts = { mode: "stand", expr: f >= GLANCE5 ? "grin" : "smile", look: f >= GLANCE5 ? 1 : -0.3, armOff: 2 }; front(out, cam, "stranger", ...p, fo, f, [GLANCE5]); holdUp(out, cam, "stranger", p, fo, f, "heroCase"); }
  else runner(out, cam, f, RUNPATH().slice(0, 3), BOLT5, DOOR6);
};
const s06 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 6);
  const laughing = f >= LAUGH6[0] && f < LAUGH6[1];
  dadPalm(out, cam, f, laughing ? "laugh" : "smile", [LAUGH6[0], LAUGH6[1]]);
  const g = girlAt(out, cam, f, "nervous", [], { look: -0.8 }); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
  if (f < DOOR6) runner(out, cam, f, RUNPATH().slice(0, 3), BOLT5, DOOR6);
  else runner(out, cam, f, RUNPATH().slice(2, 4), DOOR6, DOOR6 + 14);
};
const s07 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 7);
  dadPalm(out, cam, f, f >= DROPFACE7 ? "nervous" : "smile", [DROPFACE7]);
  const g = girlAt(out, cam, f, "sad"); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
};
// ---- S08-S09: the chase, the limp; the freeze ----
const limpPos = (f: number): { p: V3; dir: V3 } => {
  if (f < LIMP8[0]) return pathAt([mk(P.door_in), mk(P.door_out)], ramp(f, DOOR8 - 4, LIMP8[0]));
  // a limp: progress comes in uneven lurches (a short step on the bad heel, a long hop on the good leg)
  const T = LIMP8[1] - LIMP8[0], x = Math.min(f, LIMP8[1]) - LIMP8[0], cyc = 16, n = Math.floor(x / cyc), r = (x % cyc) / cyc;
  const step = (n + (r < 0.35 ? 0.2 * smooth(r / 0.35) : 0.2 + 0.8 * smooth((r - 0.35) / 0.65))) * cyc / T;
  return pathAt([mk(P.door_out), mk(P.dad_out)], Math.min(1, step));
};
const s08 = (out: Stage, cam: CamInfo, f: number) => {
  // the thief, far off, reaches the sedan and is gone behind it (f1040)
  if (f < 1040) { const p = lerp3(Gm(2.4, 0, 19.2), mk(P.thief_lot), ramp(f, 991, 1040)); if (!near(cam, p)) side(out, cam, "stranger", ...p, 1, 1.4, { mode: "march", phase: walkPhase(f, 3.2), stride: 1.1, expr: "grin" }, f); }
  if (f < DOOR8 - 4) return;
  const { p, dir } = limpPos(f), stopped = f >= PAIN8[1];
  if (near(cam, p)) return;
  if (!stopped) {
    const x = f - LIMP8[0], r = ((x % 16) + 16) % 16 / 16, dip = f >= LIMP8[0] && r < 0.35 ? -0.035 * Math.sin((r / 0.35) * Math.PI) : 0;
    side(out, cam, "dad", p[0], p[1] + dip, p[2], dir[0], dir[2], { mode: "march", phase: walkPhase(f, 1.9), stride: 0.55, expr: f >= PAIN8[0] ? "pained" : "stern" }, f);
  } else { const fo: FrontOpts = { mode: "stand", expr: "pained", crouch: 0.12, armOff: 2, headTilt: 0.1 }; front(out, cam, "dad", ...p, fo, f, [PAIN8[1]]); rest2(out, cam, "dad", p, fo, f); }
  const heel: V3 = [p[0], 0.12, p[2]];
  for (const [f0, s] of [[PAIN8[0], 0.42], [PAIN8[1], 0.7]] as [number, number][]) if (f >= f0 && f < f0 + 18) fxc(out, `pain${s}${Math.round(((f - f0) / 18) * 18)}`, 300, 300, (pp) => art2.painStar(pp, 300, (f - f0) / 18), heel, s, s, { soft: true });
};
const s09 = (out: Stage, cam: CamInfo, f: number) => {
  void f; const p = mk(P.dad_out), fo: FrontOpts = { mode: "stand", expr: "pained", crouch: 0.12, armOff: 2, headTilt: 0.1 };
  front(out, cam, "dad", ...p, fo, FREEZE9); rest2(out, cam, "dad", p, fo, FREEZE9);
};
// ---- S10: hand-overs all over the hall ----
const PAIRS: { t: number; table: number; vendor: Who; shopper: Who; sp: number[]; card: string }[] = [
  { t: 0, table: 0, vendor: "v2", shopper: "v1", sp: P.shop1, card: "sprigatito" }, { t: 1, table: 4, vendor: "v3", shopper: "v5", sp: P.shop2, card: "pawmi" }, { t: 2, table: 3, vendor: "v4", shopper: "v6", sp: P.shop3, card: "fuecoco" }];
const s10 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 10, PAIRS.map((q) => q.table));
  const d = dadAt(out, cam, f, "smile"); if (d) rest2(out, cam, "dad", d.p, d.fo, f);
  const g = girlAt(out, cam, f, "smile"); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
  for (const q of PAIRS) {
    const [cx, cz] = P.tables[q.table], vp = Gm(cx, 0, cz - 0.42), sp = mk(q.sp), vfo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 }, sfo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 };
    if (near(cam, vp) || near(cam, sp)) continue;
    front(out, cam, q.vendor, ...vp, vfo, f); front(out, cam, q.shopper, ...sp, sfo, f);
    const t0 = HAND10[q.t], t1 = BACK10[q.t], mid = Gm((cx + q.sp[0]) / 2, 1.1, (cz + q.sp[1]) / 2), sh = chestAt(cam, q.shopper, sp, sfo, 0.1, 0.2);
    let cpos: V3, vH: V3 = restHand(cam, q.vendor, vp, vfo, 1), sH: V3 = restHand(cam, q.shopper, sp, sfo, -1);
    if (f < t0 - 10) { cpos = Gm(cx - 0.3, TOPY + 0.05, cz + 0.05); }
    else if (f < t0) { cpos = lerp3(Gm(cx - 0.3, TOPY + 0.08, cz + 0.05), mid, smooth(ramp(f, t0 - 10, t0))); vH = cpos; }
    else if (f < t0 + 10) { cpos = mid; vH = mid; sH = mid; }
    else if (f < t1 - 10) { cpos = lerp3(mid, sh, smooth(ramp(f, t0 + 10, t0 + 20))); sH = cpos; }
    else if (f < t1) { cpos = lerp3(sh, mid, smooth(ramp(f, t1 - 10, t1))); sH = cpos; vH = f > t1 - 4 ? cpos : vH; }
    else { cpos = lerp3(mid, Gm(cx - 0.3, TOPY + 0.08, cz + 0.05), smooth(ramp(f, t1, t1 + 12))); vH = f < t1 + 12 ? cpos : vH; }
    arm3d(out, cam, q.vendor, vp, vfo, 1, vH, f); arm3d(out, cam, q.vendor, vp, vfo, -1, restHand(cam, q.vendor, vp, vfo, -1), f);
    arm3d(out, cam, q.shopper, sp, sfo, -1, sH, f); arm3d(out, cam, q.shopper, sp, sfo, 1, restHand(cam, q.shopper, sp, sfo, 1), f);
    fxc(out, `tlp${q.card}`, 350, 500, (pp) => art2.toploader(pp, 350, 500, q.card), [cpos[0], cpos[1] + 0.045, cpos[2]], 0.063, 0.09, { rot: f > t0 + 20 && f < t1 - 10 ? 0.15 * Math.sin(f * 0.08) : 0 });
  }
};
// ---- S11-S12: the beach, the phone ----
const family = (out: Stage, cam: CamInfo, f: number, lookAt: V3 | null) => {
  for (const [w, m] of [["mum", BP.mum], ["kid2", BP.kid2]] as [Who, number[]][]) { const p = mkB(m), lk = lookAt ? Math.sign((lookAt[0] - p[0]) * cam.right.x + (lookAt[2] - p[2]) * cam.right.z) * 0.8 : 0;
    const fo: FrontOpts = { mode: "stand", expr: "smile", look: lk, armOff: 2 }; front(out, cam, w, ...p, fo, f); rest2(out, cam, w, p, fo, f); }
};
const PHONE_B = (): V3 => Bm(BP.phone[0], BP.phone[1], BP.phone[2]);
const phoneCard = (out: Stage, cam: CamInfo, p: V3) => fxc(out, "phoneBack", 160, 320, (pp) => art2.phoneBack(pp, 160, 320), p, 0.074, 0.15);
const s11 = (out: Stage, cam: CamInfo, f: number) => {
  family(out, cam, f, null);
  const home = mkB(BP.dad2), hand = mkB(BP.dad2_hand), s2 = mkB(BP.stranger2), sfo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 };
  front(out, cam, "stranger2", ...s2, sfo, f);
  const lift = smooth(ramp(f, RAISE11, RAISE11 + 12)), sH = lerp3(chestAt(cam, "stranger2", s2, sfo, 0.45, 0.16), PHONE_B(), lift);
  if (f >= GIVE11) { arm3d(out, cam, "stranger2", s2, sfo, 1, sH, f); arm3d(out, cam, "stranger2", s2, sfo, -1, lift > 0.5 ? sH : restHand(cam, "stranger2", s2, sfo, -1), f); phoneCard(out, cam, [sH[0], sH[1] + 0.05, sH[2]]); }
  else rest2(out, cam, "stranger2", s2, sfo, f);
  if (f < WALK11[1]) { const p = walkTo(out, cam, "dad2", home, hand, f, WALK11[0], WALK11[1], { expr: "smile", reach: 0.6 }); phoneCard(out, cam, [p[0], 1.15, p[2] + 0.25]); return; }
  if (f < BACK11[0]) { const fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 }; front(out, cam, "dad2", ...hand, fo, f);
    const give = Bm(BP.dad2_hand[0] + 0.02, 1.18, (BP.dad2_hand[1] + BP.stranger2[1]) / 2 + 0.05); arm3d(out, cam, "dad2", hand, fo, 1, give, f); arm3d(out, cam, "dad2", hand, fo, -1, restHand(cam, "dad2", hand, fo, -1), f);
    if (f < GIVE11) phoneCard(out, cam, [give[0], give[1] + 0.05, give[2]]); return; }
  if (f < BACK11[1]) { walkTo(out, cam, "dad2", hand, home, f, BACK11[0], BACK11[1], { expr: "smile" }); return; }
  const fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 }; front(out, cam, "dad2", ...home, fo, f); rest2(out, cam, "dad2", home, fo, f);
};
const s12 = (out: Stage, cam: CamInfo, f: number) => {
  const s2 = mkB(BP.stranger2), pov = f < 1526;
  family(out, cam, f, pov ? null : s2);
  { const p = mkB(BP.dad2), lk = pov ? 0 : Math.sign((s2[0] - p[0]) * cam.right.x + (s2[2] - p[2]) * cam.right.z) * 0.8, fo: FrontOpts = { mode: "stand", expr: "smile", look: lk, armOff: 2 }; front(out, cam, "dad2", ...p, fo, f); rest2(out, cam, "dad2", p, fo, f); }
  if (pov) {   // the camera is the holder's eyes: the phone in front, his two arms coming up from below the frame
    const F = cam.fwd, R = cam.right, U = cam.up, c = cam.pos, ph: V3 = [c.x + F.x * 0.3, c.y + F.y * 0.3 - 0.01, c.z + F.z * 0.3];
    fxc(out, `phoneFrame${Math.round(ramp(f, 1504, 1516) * 8)}`, 592, 1200, (pp) => art2.phoneFrame(pp, 592, 1200, ramp(f, 1504, 1516)), ph, 0.074, 0.15);
    const J = frontPts(C.stranger2, { seed: IDX.stranger2 + 1 });
    for (const sd of [-1, 1]) { const A: V3 = [c.x + F.x * 0.12 + R.x * sd * 0.14 - U.x * 0.3, c.y + F.y * 0.12 - U.y * 0.3, c.z + F.z * 0.12 + R.z * sd * 0.14 - U.z * 0.3];
      const Bh: V3 = [ph[0] + R.x * sd * 0.036 - U.x * 0.03, ph[1] - U.y * 0.03, ph[2] + R.z * sd * 0.036 - U.z * 0.03]; seg3d(out, cam, A, Bh, J.armW * SU * 0.6, J.armCol, 0); }
    if (f >= 1520 && f < 1524) out.fx.push({ key: "flash", cw: 64, ch: 64, draw: (pp) => { pp.g.fillStyle = "#ffffff"; pp.g.fillRect(0, 0, 64, 64); }, x: ph[0] + F.x * 0.01, y: ph[1], z: ph[2] + F.z * 0.01, w: 0.06, h: 0.12, soft: true });
    return;
  }
  const sfo: FrontOpts = { mode: "stand", expr: "neutral", armOff: 2 }; front(out, cam, "stranger2", ...s2, sfo, f);
  const ph = PHONE_B(); arm3d(out, cam, "stranger2", s2, sfo, 1, ph, f); arm3d(out, cam, "stranger2", s2, sfo, -1, ph, f); phoneCard(out, cam, [ph[0], ph[1] + 0.04, ph[2]]);
};
// ---- S13-S16: the empty easel, the flyer, the guard, the replica ----
const s13 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 13);
  const d = dadAt(out, cam, f, "sad", [], { headTilt: 0.18 }); if (d) rest2(out, cam, "dad", d.p, d.fo, f);
  const g = girlAt(out, cam, f, "sad", [], { look: -0.3 }); if (g) rest2(out, cam, "girl", g.p, g.fo, f);
};
const COPBACK = (): V3 => Gm(-1.15, 0, 7.2);
const s14 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 14);
  const cp = mk(P.cop), flyerP = Gm(P.flyer[0] + 0.1, P.flyer[1], P.flyer[2] - 0.03), off = PIN14[1] + 6;
  if (f < off) { const fo: FrontOpts = { mode: "stand", expr: "neutral", armOff: 2, look: -0.7 }; if (near(cam, cp)) return; front(out, cam, "cop", ...cp, fo, f);
    const u = smooth(ramp(f, PIN14[0] - 10, PIN14[0]));
    const hand = f >= PIN14[1] ? [flyerP[0], flyerP[1] + 0.005 * (f % 2), flyerP[2]] as V3 : lerp3(restHand(cam, "cop", cp, fo, -1), flyerP, u);
    arm3d(out, cam, "cop", cp, fo, -1, hand, f); arm3d(out, cam, "cop", cp, fo, 1, restHand(cam, "cop", cp, fo, 1), f);
    if (f < PIN14[0]) fxc(out, "flyerHeld", 300, 388, (pp) => art2.flyer(pp, 300, 388), [hand[0], hand[1] + 0.05, hand[2] - 0.02], 0.2, 0.26); return; }
  if (f < off + 12) { walkTo(out, cam, "cop", cp, COPBACK(), f, off, off + 12, { expr: "neutral" }); return; }
  const fo: FrontOpts = { mode: "stand", expr: f >= SHRUG14 + 4 ? "sad" : "neutral", armOff: 2, look: -0.6 }, p = COPBACK(); if (near(cam, p)) return; front(out, cam, "cop", ...p, fo, f, [SHRUG14 + 4]);
  const sh = smooth(ramp(f, SHRUG14, SHRUG14 + 8)) * (1 - smooth(ramp(f, SHRUG14 + 24, SHRUG14 + 34))), r = cam.right;
  for (const sd of [-1, 1] as const) { const h = restHand(cam, "cop", p, fo, sd); arm3d(out, cam, "cop", p, fo, sd, [h[0] + r.x * sd * 0.12 * sh, h[1] + 0.18 * sh, h[2] + r.z * sd * 0.12 * sh], f); }
};
const s15 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 15);
  if (f < GUARD15[1]) walkTo(out, cam, "guard", Gm(4.8, 0, 7.4), mk(P.guard), f, GUARD15[0] - 4, GUARD15[1], { expr: "stern" });
  else guardPost(out, cam, f);
};
const s16 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 16); guardPost(out, cam, f);
  const wp = mk(P.woman), H2 = Gm(-0.7, 1.06, 1.02), DG = Gm(0.04, 1.0, 0.74), PASS = [TAKE16 + 6, TAKE16 + 18];
  // the woman: walks up with the replica, holds it out to dad
  if (f < WOMAN16[1]) { const p = walkTo(out, cam, "woman", Gm(-2.4, 0, 2.6), wp, f, WOMAN16[0] - 8, WOMAN16[1], { expr: "smile", reach: 0.6 }); out.props.replicaCase = { p: [p[0], 1.12, p[2] + 0.2], ry: faceTo(cam, p[0], p[2] + 0.2) }; }
  else if (!near(cam, wp)) { const fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2, look: 0.6 }; front(out, cam, "woman", ...wp, fo, f);
    const hand = f < TAKE16 + 2 ? lerp3(chestAt(cam, "woman", wp, fo, 0.4, 0.16), H2, smooth(ramp(f, WOMAN16[1], TAKE16 - 4))) : lerp3(H2, restHand(cam, "woman", wp, fo, 1), smooth(ramp(f, TAKE16 + 2, TAKE16 + 12)));
    arm3d(out, cam, "woman", wp, fo, 1, hand, f); arm3d(out, cam, "woman", wp, fo, -1, restHand(cam, "woman", wp, fo, -1), f);
    if (f < TAKE16) out.props.replicaCase = { p: hand, ry: faceTo(cam, hand[0], hand[2]) }; }
  // dad: takes it, passes it to the girl
  const d = dadAt(out, cam, f, f >= TAKE16 ? "relief" : "smile", [TAKE16]);
  if (d) { let hnd = restHand(cam, "dad", d.p, d.fo, -1);
    if (f >= TAKE16 - 8 && f < PASS[1] + 4) { hnd = f < TAKE16 ? lerp3(restHand(cam, "dad", d.p, d.fo, -1), H2, smooth(ramp(f, TAKE16 - 8, TAKE16))) : f < PASS[0] ? H2 : lerp3(H2, DG, smooth(ramp(f, PASS[0], PASS[1])));
      if (f >= TAKE16 && f < PASS[1]) out.props.replicaCase = { p: hnd, ry: faceTo(cam, hnd[0], hnd[2]) }; }
    arm3d(out, cam, "dad", d.p, d.fo, -1, hnd, f); arm3d(out, cam, "dad", d.p, d.fo, 1, restHand(cam, "dad", d.p, d.fo, 1), f); }
  // the girl: takes it from dad, holds it, sets it on the easel
  const g = girlAt(out, cam, f, f >= PASS[1] - 4 ? "laugh" : "smile", [PASS[1] - 4], { look: -0.5 });
  if (g) { if (f < PASS[1] - 6 || f >= EASEL16[1] + 6) rest2(out, cam, "girl", g.p, g.fo, f);
    else { const hold = chestAt(cam, "girl", g.p, g.fo, 0.35, 0.16), c = f < PASS[1] ? DG : f < EASEL16[0] ? lerp3(DG, hold, smooth(ramp(f, PASS[1], PASS[1] + 8))) : lerp3(hold, EASEL(), smooth(ramp(f, EASEL16[0], EASEL16[1]))), r = cam.right;
      arm3d(out, cam, "girl", g.p, g.fo, -1, [c[0] - r.x * 0.045, c[1] - 0.03, c[2] - r.z * 0.045], f); arm3d(out, cam, "girl", g.p, g.fo, 1, [c[0] + r.x * 0.045, c[1] - 0.03, c[2] + r.z * 0.045], f);
      if (f >= PASS[1] && f < EASEL16[1]) out.props.replicaCase = { p: c, ry: faceTo(cam, c[0], c[2]) }; } }
  // bills drop into the jar
  BILLS16.forEach((t0, i) => { if (f >= t0 - 8 && f < t0 + 4) { const u = ramp(f, t0 - 8, t0 + 4), jp = Gm(P.jar[0], TOPY + 0.35 - 0.3 * u * u, P.jar[2]); fxc(out, `billD${i}`, 470, 200, (pp) => art2.bill(pp, 470, 200), jp, 0.08, 0.034, { rot: 0.4 * Math.sin(f * 0.7 + i) }); } });
};
// ---- S17-S19: her sign; the runner; the crane ----
const ROUND = (): V3[] => [mk(P.girl), Gm(1.15, 0, 0.72), Gm(1.15, 0, 1.55), mk(P.girl_front)];
const s17 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 17); guardPost(out, cam, f);
  const d = dadAt(out, cam, f, "smile"); if (d) rest2(out, cam, "dad", d.p, d.fo, f);
  if (f < ROUND17[1]) { const { p, dir } = pathAt(ROUND(), smooth(ramp(f, ROUND17[0], ROUND17[1]))); side(out, cam, "girl", ...p, dir[0], dir[2], { mode: "march", phase: walkPhase(f, 2.6), stride: 0.6, expr: "smile" }, f);
    fxc(out, "signHeld", 500, 300, (pp) => art2.lookSign(pp, 500, 300, 0), [p[0], 0.85, p[2]], 0.3, 0.18); return; }
  const p = mk(P.girl_front), pressing = f < PRESS17[1] + 4, fo: FrontOpts = { mode: "stand", expr: f >= TALK17[0] && talkOpen(f, TALK17[0], TALK17[1]) ? "relief_open" : "smile", crouch: pressing ? 0.35 : 0, armOff: 2, look: pressing ? 0 : 0 };
  if (near(cam, p)) return;
  front(out, cam, "girl", ...p, fo, f, [TALK17[0]]);
  if (pressing) { const S = P.sign_front, r = cam.right;
    for (const sd of [-1, 1] as const) { const tape = TAPE17[sd < 0 ? 0 : 1], k = f < PRESS17[0] ? 0 : 1, x = S[0] + sd * 0.2, h = Gm(x, S[1] + 0.12, S[2] + 0.02);
      arm3d(out, cam, "girl", p, fo, sd, f >= tape - 3 && f < tape + 3 ? [h[0] + r.x * 0.02, h[1] - 0.12, h[2]] : lerp3(restHand(cam, "girl", p, fo, sd), h, k), f); }
    if (f < PRESS17[0]) fxc(out, "signHeld2", 500, 300, (pp) => art2.lookSign(pp, 500, 300, 0), Gm(S[0], S[1] + 0.1, S[2] + 0.12), 0.5, 0.3); }
  else rest2(out, cam, "girl", p, fo, f);
};
const s18 = (out: Stage, cam: CamInfo, f: number) => runner(out, cam, f, [Gm(-12, 0, 32), Gm(16, 0, 32)], RUN18[0], RUN18[1], false, 1.6);
const s19 = (out: Stage, cam: CamInfo, f: number) => {
  crowd(out, cam, f, 19); guardPost(out, cam, f);
  const d = dadAt(out, cam, f, "smile"); if (d) rest2(out, cam, "dad", d.p, d.fo, f);
  const p = mk(P.girl_front), fo: FrontOpts = { mode: "stand", expr: "smile", armOff: 2 }; if (!near(cam, p)) { front(out, cam, "girl", ...p, fo, f); rest2(out, cam, "girl", p, fo, f); }
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const S: Record<number, (o: Stage, c: CamInfo, f: number) => void> = { 1: s01, 2: s02, 3: s03, 4: s04, 5: s05, 6: s06, 7: s07, 8: s08, 9: s09, 10: s10, 11: s11, 12: s12, 13: s13, 14: s14, 15: s15, 16: s16, 17: s17, 18: s18, 19: s19 };
  S[id](out, cam, f);
  return out;
};
void art; void tier; void tcardFx; void glowAt; void fxPuff; void SKIN; void shoulderAt; void burst; void sparkle; void FPS; void easeOut; void lerpN; void holdHand; void SEDAN8; void DOOR1; void EASEL2;
