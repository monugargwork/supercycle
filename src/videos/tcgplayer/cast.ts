// The TCGplayer reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, HO, HQo, SYo, MKo, SHo, BDo, clamp01, smooth, easeOut, hop, HOMEP, HQP, SYRP, MKP, SHP, BDP,
  POP1, STAMP1, WIND1, LEVER3, STEP4, CUT4, PUSH5, REACT7, WORK8, WALK8, SAD8, THROW9, LAND10, STAMPS11, STEAM12,
  MGR13, FEE13, SCALE13, CARRY13, TWIN13, BUYER13, UP14, OUT14, IN14, SIT14, TALK14, SACK16, LOOK16,
} from "./story";
import * as art2 from "./art2";
import { TY } from "./sets";
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
const IDX: Record<Who, number> = { seller: 3, rob: 4, ron: 5, grader1: 6, grader2: 7, grader3: 8, buyer: 9, owner: 10, vip1: 11, vip2: 12, vip3: 13, vip4: 14 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[tcgplayer] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Hm = (x: number, y: number, z: number) => at(HO, x, y, z);
const Qm = (x: number, y: number, z: number) => at(HQo, x, y, z);
const Ym = (x: number, y: number, z: number) => at(SYo, x, y, z);
const Mm = (x: number, y: number, z: number) => at(MKo, x, y, z);
const Sm = (x: number, y: number, z: number) => at(SHo, x, y, z);
const Bm = (x: number, y: number, z: number) => at(BDo, x, y, z);
// seat heights in head-heights above the soles (an adult head-height is ~0.51 m)
const SEAT_STOOL = 1.25, SEAT_CHAIR = 1.02;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const flat = (out: Stage, key: string, draw: (p: Pen) => void, p: V3, s: number, rot = 0) => card(out, key, 200, 200, draw, p[0], p[1], p[2], s, s, { flat: true, rot });
const H = HOMEP, Q = HQP, Y = SYRP, MK = MKP, SP = SHP, BD = BDP;
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
/** both hands at the chest holding something at point c */
const bothHands = (out: Stage, cam: CamInfo, who: Who, P: V3, fo: FrontOpts, c: V3, f: number, off = 0.05) => {
  const r = cam.right;
  arm3d(out, cam, who, P, fo, -1, [c[0] - r.x * off, c[1], c[2] - r.z * off], f);
  arm3d(out, cam, who, P, fo, 1, [c[0] + r.x * off, c[1], c[2] + r.z * off], f);
};
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
/** a held rubber stamp: its rubber face at `foot` (world), the knob above */
const stampFx = (out: Stage, foot: V3, col: string) => fxc(out, `stampT|${col}`, 200, 280, (pp) => art2.stampTool(pp, col), [foot[0], foot[1] + 0.042, foot[2]], 0.06, 0.084);

// ---------------- the seller in his workroom ----------------
export const ENV_P = (): V3 => Hm(H.envelope[0], TY + 0.003, H.envelope[2]);
/** the cake plate's set-local z: pushed away in S05 (hand contact, then it slides on and stops) */
export const plateZ = (id: number, f: number) => {
  const z0 = H.plate[2], z1 = z0 + 0.1, z2 = z0 + 0.18;
  if (id < 5) return z0;
  if (id > 5) return z2;
  if (f < PUSH5[0]) return z0;
  if (f < PUSH5[1]) return lerpN(z0, z1, smooth(ramp(f, PUSH5[0], PUSH5[1])));
  return lerpN(z1, z2, easeOut(ramp(f, PUSH5[1], PUSH5[1] + 10)));
};
const CONF_N = 34;
/** confetti: launched from the popper's mouth at f0, drifts down, lies flat on the table or the floor and stays */
const confetti = (out: Stage, f: number, f0: number, tip: V3) => {
  for (let i = 0; i < CONF_N; i++) {
    const a = hh(i, 3) * Math.PI * 2, sp = 0.15 + 0.3 * hh(i, 5), rest: V3 = Hm(-0.75 + 1.5 * hh(i, 7), 0, -1.25 + 0.7 * hh(i, 11));
    const onTable = rest[2] - HO[2] > H.table[2] && rest[2] - HO[2] < H.table[3];
    rest[1] = onTable ? TY + 0.002 + 0.0004 * i : 0.003 + 0.0004 * i;
    const draw = (pp: Pen) => art2.confettiBit(pp, i), s = 0.034;
    const T = 30 + Math.round(18 * hh(i, 13)), u = (f - f0) / T;
    if (f < f0) continue;
    if (u >= 1) { flat(out, "conf" + (i % 6), draw, rest, s, hh(i, 17) * 6); continue; }
    const up: V3 = [tip[0] + Math.cos(a) * sp, tip[1] + 0.25 + 0.2 * hh(i, 19), tip[2] + Math.sin(a) * sp * 0.6];
    const k1 = Math.min(1, u / 0.25), k2 = clamp01((u - 0.25) / 0.75);
    const p: V3 = k2 <= 0 ? lerp3(tip, up, easeOut(k1)) : lerp3(up, rest, k2 * k2);
    p[0] += 0.03 * Math.sin(u * 14 + i) * (1 - u);
    card(out, "confA" + (i % 6), 64, 64, draw, p[0], p[1], p[2], s, s, { rot: u * 9 + i, tilt: 1.3 * u, face: i });
  }
};
const sellerHome = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = Hm(H.seller[0], 0, H.seller[1]);
  if (near(cam, P, 0.5)) { if (id === 1) confetti(out, f, POP1, [0, 0, 0]); return; } // his own eyes (POV): not drawn
  const shock = id === 7 && f >= REACT7, gape = shock ? Math.min(0.6, (f - REACT7) / 6 * 0.6) : 0;
  const expr = id === 1 ? (f < 128 ? "smile" : "stern") : id === 5 ? "stern" : id === 6 ? (f < 668 ? "stern" : "pained") : id === 7 ? (shock ? "shock" : "neutral")
    : id === 9 ? "stern" : id === 12 ? (f < 1366 ? "neutral" : "stern") : "neutral";
  const look = id === 6 ? (f < 662 ? 1 : -1) : id === 1 && f > 120 ? -1 : 0;
  const arms = id === 1 || id === 5 || id === 9;
  const fo: FrontOpts = { mode: "sit", chair: SEAT_STOOL, expr: expr as FrontOpts["expr"], look, gape: shock ? Math.round(gape * 20) / 20 : undefined, armOff: arms ? 2 : undefined };
  front(out, cam, "seller", ...P, fo, f, id === 6 ? [668] : id === 12 ? [1366] : id === 7 ? [REACT7] : id === 1 ? [128] : []);
  if (id === 12) for (const s0 of [1386, 1396, 1404]) for (const side of [-1, 1]) {
    const n = 18, u = (f - s0) / n; if (u < 0 || u >= 1) continue;
    const hd = cardWorld(cam, P[0], P[1], P[2], [300 + side * 175, 200]);
    card(out, `steam${Math.round(u * 12)}`, 200, 200, (pp) => fxPuff(pp, u), hd[0] + cam.right.x * side * 0.08 * u - cam.fwd.x * 0.15, hd[1] + 0.25 * u, hd[2] + cam.right.z * side * 0.08 * u - cam.fwd.z * 0.15, 0.2 + 0.12 * u, 0.2 + 0.12 * u);
  }
  if (id === 1) {
    // right arm (screen left): the stamp over the envelope, wind-up, slam on STAMP1, lift
    const E = ENV_P(), upP: V3 = [E[0] + 0.02, E[1] + 0.2, E[2] - 0.04], top: V3 = [E[0] + 0.02, E[1] + 0.27, E[2] - 0.05], hit: V3 = [E[0], E[1] + 0.003, E[2]];
    let foot: V3;
    if (f < WIND1[0]) foot = upP; else if (f < WIND1[0] + 3) foot = lerp3(upP, top, smooth((f - WIND1[0]) / 3)); else if (f < STAMP1) foot = f < WIND1[1] ? top : lerp3(top, hit, (f - WIND1[1]) / (STAMP1 - WIND1[1]));
    else if (f < STAMP1 + 6) foot = hit; else foot = lerp3(hit, upP, smooth((f - STAMP1 - 6) / 10));
    const hand = arm3d(out, cam, "seller", P, fo, -1, [foot[0], foot[1] + 0.07, foot[2]], f);
    stampFx(out, [hand[0], hand[1] - 0.07, hand[2]], "#d12a2a");
    // left arm: the popper, raised and pulled on POP1
    const rest = holdHand(cam, "seller", P, fo, 1, 0.12), raised: V3 = [rest[0], rest[1] + 0.2, rest[2] + 0.05];
    const hp = f < POP1 - 8 ? rest : f < POP1 ? lerp3(rest, raised, smooth((f - POP1 + 8) / 8)) : f < POP1 + 16 ? raised : lerp3(raised, rest, smooth((f - POP1 - 16) / 12));
    const H2 = arm3d(out, cam, "seller", P, fo, 1, hp, f);
    fxc(out, `popper|${f >= POP1}`, 120, 260, (pp) => art2.popper(pp, f >= POP1), [H2[0], H2[1] + 0.05, H2[2]], 0.05, 0.11, { rot: -0.35 });
    const tip: V3 = [H2[0] - cam.right.x * 0.02, H2[1] + 0.12, H2[2] - cam.right.z * 0.02];
    burst(out, f, POP1, tip[0], tip[1], tip[2], 0.3, 7, "#ffe9a0");
    confetti(out, f, POP1, tip);
  } else if (id > 1) confetti(out, 9999, 0, [0, 0, 0]);
  if (id === 5) {
    const pz = plateZ(5, f), edge = Hm(H.plate[0] - 0.02, TY + 0.03, pz - 0.085);
    const touching = f >= PUSH5[0] - 6 && f < PUSH5[1] + 2;
    const hand = touching ? (f < PUSH5[0] ? lerp3(restHand(cam, "seller", P, fo, -1), edge, smooth((f - PUSH5[0] + 6) / 6)) : edge) : f < PUSH5[0] ? restHand(cam, "seller", P, fo, -1) : lerp3(Hm(H.plate[0] - 0.02, TY + 0.03, H.plate[2] + 0.015), restHand(cam, "seller", P, fo, -1), smooth((f - PUSH5[1] - 2) / 10));
    arm3d(out, cam, "seller", P, fo, -1, hand, f); arm3d(out, cam, "seller", P, fo, 1, restHand(cam, "seller", P, fo, 1), f);
  }
  if (id === 9) {
    const up: V3 = holdHand(cam, "seller", P, fo, -1, 0.1); up[1] += 0.25;
    const T = THROW9;
    if (f < T) { const hnd = arm3d(out, cam, "seller", P, fo, -1, up, f); fxc(out, "plane", 200, 100, (pp) => art2.paperPlane(pp), [hnd[0], hnd[1] + 0.03, hnd[2]], 0.12, 0.06, { rot: 0.3 }); }
    else {
      const fol: V3 = [up[0] - 0.2, up[1] - 0.1, up[2] + 0.1];
      arm3d(out, cam, "seller", P, fo, -1, lerp3(up, fol, smooth((f - T) / 4)), f);
      const u = (f - T) / 26, w0: V3 = [up[0], up[1] + 0.03, up[2]], w1 = Hm(H.window[0] + 0.3, H.window[1] + 0.1, H.window[2]);
      if (u < 1) fxc(out, "plane", 200, 100, (pp) => art2.paperPlane(pp), [lerpN(w0[0], w1[0], u), lerpN(w0[1], w1[1], u) + 0.25 * Math.sin(Math.PI * u), lerpN(w0[2], w1[2], u)], 0.12, 0.06, { rot: 0.2 - 0.3 * u });
    }
    arm3d(out, cam, "seller", P, fo, 1, restHand(cam, "seller", P, fo, 1), f);
  }
};

// ---------------- HQ ----------------
/** the lever's swing (rad about x): 0 up, pulled toward the lens and down on LEVER3, a damped overshoot */
export const leverAngle = (id: number, f: number) => {
  if (id !== 3) return id > 3 ? 1.4 : 0;
  if (f < LEVER3[0]) return 0;
  const u = (f - LEVER3[0]) / (LEVER3[1] - LEVER3[0]);
  if (u < 1) return 1.4 * smooth(u);
  const t = f - LEVER3[1]; return 1.4 + 0.05 * Math.sin(t * 0.9) * Math.exp(-t / 4);
};
export const leverKnob = (a: number): V3 => Qm(Q.lever[0], Q.lever[1] + 0.25 * Math.cos(a), Q.lever[2] + 0.01 + 0.25 * Math.sin(a));
/** plane 1 in S10: from the window to the desk (set-local), skids, then lies there (S10-S11) */
const plane1 = (out: Stage, f: number, id: number) => {
  const rest = Qm(-0.05, TY + 0.012, -1.88);
  if (id === 11 || (id === 10 && f >= LAND10[1] + 8)) { flat(out, "planeFlat", (pp) => art2.paperPlane(pp), rest, 0.12, 2.6); return; }
  if (id !== 10 || f < LAND10[0]) return;
  const a = Qm(Q.window[0] - 0.2, Q.window[1] + 0.2, Q.window[2] + 0.1), b = Qm(0.15, TY + 0.02, -1.95);
  if (f < LAND10[1]) { const u = (f - LAND10[0]) / (LAND10[1] - LAND10[0]); fxc(out, "plane", 200, 100, (pp) => art2.paperPlane(pp), [lerpN(a[0], b[0], u), lerpN(a[1], b[1], u * u), lerpN(a[2], b[2], u)], 0.12, 0.06, { rot: 3.0 }); return; }
  const u = easeOut((f - LAND10[1]) / 8); flat(out, "planeFlat", (pp) => art2.paperPlane(pp), lerp3(b, rest, u), 0.12, 2.6);
};
const robTalk = (f: number, a: number, b: number) => f >= a && f < b && Math.floor((f - a) / 5) % 2 === 1;
const hq = (out: Stage, cam: CamInfo, f: number, id: number) => {
  plane1(out, f, id);
  if (id === 3 || id === 4) {
    const atLever = id === 3 || f < STEP4[0];
    const A = Qm(Q.rob_lever[0], 0, Q.rob_lever[1]), B = Qm(Q.rob_cake[0], 0, Q.rob_cake[1]);
    const u = id === 4 ? smooth(ramp(f, STEP4[0], STEP4[1])) : 0, P = lerp3(A, B, u);
    const walking = id === 4 && f >= STEP4[0] && f < STEP4[1];
    const fo: FrontOpts = { mode: walking ? "stroll" : "stand", phase: walkPhase(f, 1.4), expr: "grin", armOff: atLever ? -1 : 1, look: atLever ? -1 : 1 };
    front(out, cam, "rob", ...P, fo, f, id === 3 ? [480] : [CUT4 - 4]);
    if (atLever) arm3d(out, cam, "rob", P, fo, -1, leverKnob(leverAngle(id, f)), f);
    else {
      const top = Qm(Q.cake[0] - 0.06, Q.cake[1] + 0.32, Q.cake[2] + 0.06), cut = Qm(Q.cake[0] - 0.06, Q.cake[1] + 0.2, Q.cake[2] + 0.06);
      const hand = f < CUT4 - 4 ? restHand(cam, "rob", P, fo, 1) : f < CUT4 ? lerp3(restHand(cam, "rob", P, fo, 1), top, smooth((f - CUT4 + 4) / 4)) : lerp3(top, cut, smooth((f - CUT4) / 3));
      const Hd = arm3d(out, cam, "rob", P, fo, 1, hand, f);
      fxc(out, "knife", 250, 80, (pp) => art2.knife(pp), [Hd[0] + cam.right.x * 0.05, Hd[1] - 0.02, Hd[2] + cam.right.z * 0.05], 0.13, 0.04, { rot: -1.2 });
    }
    return;
  }
  // the boss at his desk (S10, S11, S14 until he gets up)
  const D = Qm(Q.rob_desk[0], 0, Q.rob_desk[1]);
  if (id === 10 || id === 11 || (id === 14 && f < UP14 + 4)) {
    const expr = id === 10 ? (f < LAND10[1] ? "neutral" : f < 1135 ? "shock" : "stern") : id === 11 ? (f < 1250 ? "neutral" : "smile") : "neutral";
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: expr as FrontOpts["expr"], armOff: id === 11 ? 2 : undefined, look: id === 10 ? 1 : 0 };
    front(out, cam, "rob", ...D, fo, f, id === 10 ? [LAND10[1], 1135] : id === 11 ? [1250] : []);
    if (id === 11) {
      const L = Qm(Q.letters[0], TY + 0.004, Q.letters[2]), Dc = Qm(Q.doc[0], TY + 0.004, Q.doc[2]);
      const slam = (t0: number, tgt: V3) => { const k = f - t0; if (k < -6) return [tgt[0], tgt[1] + 0.14, tgt[2]] as V3; if (k < -2) return [tgt[0], tgt[1] + 0.14 + 0.06 * smooth((k + 6) / 4), tgt[2]] as V3; if (k < 0) return [tgt[0], tgt[1] + 0.2 - 0.1 * (k + 2), tgt[2]] as V3; if (k < 5) return tgt; return [tgt[0], tgt[1] + 0.14 * smooth((k - 5) / 6), tgt[2]] as V3; };
      const red = f < STAMPS11[1] - 12 ? slam(STAMPS11[0], L) : slam(STAMPS11[1], L);
      const g = slam(STAMPS11[2], Dc);
      const hR = arm3d(out, cam, "rob", D, fo, -1, [red[0], red[1] + 0.07, red[2]], f); stampFx(out, [hR[0], hR[1] - 0.07, hR[2]], "#d12a2a");
      const hG = arm3d(out, cam, "rob", D, fo, 1, [g[0], g[1] + 0.07, g[2]], f); stampFx(out, [hG[0], hG[1] - 0.07, hG[2]], "#1f8a4c");
    }
    if (id !== 14) return;
  }
  if (id !== 14) return;
  // S14: Rob walks out to the right; Ron walks in from the left and sits
  if (f >= UP14 + 4 && f < OUT14[1] + 30) {
    const u = ramp(f, OUT14[0], OUT14[1]), P = lerp3(D, Qm(Q.rob_out[0], 0, Q.rob_out[1]), u);
    if (f < OUT14[0]) front(out, cam, "rob", ...D, { mode: "stand", expr: "neutral" }, f, [UP14]);
    else side(out, cam, "rob", ...P, 1, 0, { mode: "march", phase: walkPhase(f, 2), stride: 0.9, expr: "neutral" }, f);
  }
  if (f >= IN14[0] && f < IN14[1]) {
    const u = ramp(f, IN14[0], IN14[1]), P = lerp3(Qm(Q.ron_in[0], 0, Q.ron_in[1]), D, u);
    side(out, cam, "ron", ...P, 1, 0, { mode: "march", phase: walkPhase(f, 2), stride: 0.9, expr: "smile" }, f);
  } else if (f >= IN14[1]) {
    const sitting = f >= SIT14, talk = robTalk(f, TALK14[0], TALK14[1]);
    const fo: FrontOpts = { mode: sitting ? "sit" : "stand", chair: SEAT_CHAIR, expr: talk ? "relief_open" : "smile", armOff: f >= TALK14[0] ? 1 : undefined };
    front(out, cam, "ron", ...D, fo, f, [SIT14, TALK14[0]]);
    if (f >= TALK14[0]) { const sh = shoulderAt(cam, "ron", D, fo, 1), sw = 0.06 * Math.sin((f - TALK14[0]) * 0.12); arm3d(out, cam, "ron", D, fo, 1, [sh[0] + cam.right.x * 0.3, sh[1] - 0.12 + sw, sh[2] + cam.right.z * 0.3 - cam.fwd.z * 0.1], f); }
  }
};

// ---------------- Syracuse ----------------
const GRADERS: Who[] = ["grader1", "grader2", "grader3"];
/** where each grader's box is (world centre), or null while it is still on the bench */
const graders = (out: Stage, cam: CamInfo, f: number) => {
  GRADERS.forEach((who, i) => {
    const a = Ym(Y.workers_in[i][0], 0, Y.workers_in[i][1]), b = Ym(Y.workers_out[i][0], 0, Y.workers_out[i][1]);
    const t0 = WALK8[0] + 4 * i, u = smooth(ramp(f, t0, WALK8[1] + 4 * i)), P = lerp3(a, b, u);
    const walking = f >= t0 && f < WALK8[1] + 4 * i, carrying = f >= WORK8[1] + 2 * i;
    const fo: FrontOpts = { mode: walking ? "stroll" : "stand", phase: walkPhase(f + 9 * i, 1.4), expr: f >= SAD8 - 6 * i ? "sad" : "neutral", look: 0, armOff: carrying ? 2 : undefined };
    front(out, cam, who, ...P, fo, f, [SAD8 - 6 * i]);
    const key = `box${i}`;
    if (carrying) { const c = chestAt(cam, who, P, fo, 0.55, 0.2); bothHands(out, cam, who, P, fo, c, f, 0.14); out.props[key] = { p: c, ry: Math.atan2(cam.pos.x - c[0], cam.pos.z - c[2]) }; }
    else out.props[key] = { p: Ym(Y.benches[i] - 0.1, Y.bench_y + 0.12, Y.bench_z + 0.05) };
  });
};

// ---------------- the market ----------------
export const twinX = (id: number, f: number) => {
  if (id !== 13 || f < TWIN13[0]) return id > 13 ? MK.twin_to[0] : MK.twin_from[0];
  const u = ramp(f, TWIN13[0], TWIN13[1]);
  return lerpN(MK.twin_from[0], MK.twin_to[0], easeOut(u) * 0.97 + 0.03 * u) + (f >= TWIN13[1] ? -0.008 * Math.sin((f - TWIN13[1]) * 1.2) * Math.exp(-(f - TWIN13[1]) / 4) : 0);
};
const market = (out: Stage, cam: CamInfo, f: number) => {
  // the seller behind his stall
  const S0 = Mm(MK.seller[0], 0, MK.seller[1]);
  const se = f < 1520 ? "smile" : f < 1600 ? "nervous" : "stern";
  front(out, cam, "seller", ...S0, { mode: "sit", chair: SEAT_STOOL, expr: se, look: f > 1640 ? 1 : 0 }, f, [1520, 1600]);
  // the buyer
  const bu = smooth(ramp(f, BUYER13[0], BUYER13[1])), BP = lerp3(Mm(MK.buyer_a[0], 0, MK.buyer_a[1]), Mm(MK.buyer_b[0], 0, MK.buyer_b[1]), bu);
  front(out, cam, "buyer", ...BP, { mode: f >= BUYER13[0] && f < BUYER13[1] ? "stroll" : "stand", phase: walkPhase(f, 1.4), expr: "neutral", look: f < BUYER13[0] ? -1 : 1 }, f, [BUYER13[0]]);
  // the manager (Rob's suit): in, the fee, the scale, off right, back pushing the twin stall
  const wIn = Mm(MK.mgr_in[0], 0, MK.mgr_in[1]), wTin = Mm(MK.mgr_tin[0], 0, MK.mgr_tin[1]), wSc = Mm(MK.mgr_scale[0], 0, MK.mgr_scale[1]), wOff = Mm(4.4, 0, -0.3);
  let P: V3, walking = false;
  if (f < MGR13[0]) P = wIn; else if (f < MGR13[1]) { P = lerp3(wIn, wTin, smooth(ramp(f, MGR13[0], MGR13[1]))); walking = true; }
  else if (f < SCALE13[0]) P = wTin; else if (f < SCALE13[0] + 8) { P = lerp3(wTin, wSc, smooth(ramp(f, SCALE13[0], SCALE13[0] + 8))); walking = true; }
  else if (f < CARRY13[0]) P = wSc; else if (f < CARRY13[1]) { P = lerp3(wSc, wOff, ramp(f, CARRY13[0], CARRY13[1])); walking = true; }
  else { const tx = twinX(13, f); P = Mm(tx + MK.twin_w / 2 + 0.3, 0, MK.twin_to[1] + 0.05); walking = f < TWIN13[1]; }
  const pushing = f >= CARRY13[1];
  const fo: FrontOpts = { mode: walking ? "stroll" : "stand", phase: walkPhase(f, 1.4), expr: "smile", armOff: 2, look: pushing ? -1 : 0 };
  if (f >= MGR13[0] - 2) front(out, cam, "rob", ...P, fo, f, [MGR13[1]]);
  const bagHand = pushing ? null : restHand(cam, "rob", P, fo, 1);
  if (bagHand && f >= MGR13[0] - 2) { const Hb = arm3d(out, cam, "rob", P, fo, 1, bagHand, f); out.props.bag = { p: [Hb[0], Hb[1] - 0.13, Hb[2]] }; }
  else out.props.bag = { p: [0, -50, 0], vis: false };
  // the fee: three coins hop from his tin into the bag
  const tinTop = Mm(MK.tin[0], MK.stall_y + 0.045, MK.tin[2]);
  FEE13.forEach((t0, i) => {
    const key = `mkcoin${i}`, inBag = bagHand ? [bagHand[0], bagHand[1] - 0.1, bagHand[2]] as V3 : tinTop;
    if (f < t0) out.props[key] = { p: [tinTop[0] + 0.02 * (i - 1), tinTop[1] - 0.004 + 0.003 * i, tinTop[2]] };
    else if (f < t0 + 12) { const u = (f - t0) / 12; out.props[key] = { p: [lerpN(tinTop[0], inBag[0], u), lerpN(tinTop[1], inBag[1], u) + 0.3 * Math.sin(Math.PI * u), lerpN(tinTop[2], inBag[2], u)], rx: u * 9 }; }
    else out.props[key] = { p: [0, -50, 0], vis: false };
  });
  // the scale: on his stall, lifted and carried off by the manager
  const scaleRest = Mm(MK.scale[0], MK.stall_y, MK.scale[2]);
  if (f < SCALE13[1] - 2) { out.props.scale = { p: scaleRest }; if (f >= SCALE13[0] + 4) arm3d(out, cam, "rob", P, fo, -1, [scaleRest[0], scaleRest[1] + 0.09, scaleRest[2] + 0.03], f); else if (f >= MGR13[0] - 2) arm3d(out, cam, "rob", P, fo, -1, restHand(cam, "rob", P, fo, -1), f); }
  else if (!pushing) { const hd = chestAt(cam, "rob", P, fo, 0.5, 0.16); const Hh = arm3d(out, cam, "rob", P, fo, -1, hd, f); out.props.scale = { p: [Hh[0], Hh[1] - 0.09, Hh[2]] }; }
  else { out.props.scale = { p: [0, -50, 0], vis: false }; const tx = twinX(13, f), edge = Mm(tx + MK.twin_w / 2 + 0.02, MK.stall_y + 0.0, MK.twin_to[1] + 0.1); arm3d(out, cam, "rob", P, fo, -1, edge, f); arm3d(out, cam, "rob", P, fo, 1, [edge[0], edge[1], edge[2] - 0.2], f); }
};

// ---------------- the shop, the boardroom ----------------
const shopOwner = (out: Stage, cam: CamInfo, f: number) => {
  const P = Sm(SP.owner[0], 0, SP.owner[1]);
  if (near(cam, P, 1.0)) return; // the camera rounds his shoulder into his eyes: he is not drawn that close
  front(out, cam, "owner", ...P, { mode: "stand", expr: "stern", prop: ["hold", "phone"] }, f);
};
const boardroom = (out: Stage, cam: CamInfo, f: number) => {
  front(out, cam, "ron", ...Bm(BD.ron[0], 0, BD.ron[1]), { mode: "sit", chair: SEAT_CHAIR, expr: "grin" }, f);
  (["vip1", "vip2", "vip3", "vip4"] as Who[]).forEach((w, i) => { const [x, z] = BD.vips[i]; front(out, cam, w, ...Bm(x, 0, z), { mode: "sit", chair: SEAT_CHAIR, expr: f > SACK16[1] + 4 && i % 2 ? "laugh" : "grin", facing: x < 0 ? 1 : -1, look: x < 0 ? 1 : -1 }, f, [SACK16[1] + 4]); });
  const P = Bm(BD.seller[0], 0, BD.seller[1]);
  const lk = f < LOOK16[0] ? 0 : f < LOOK16[1] ? -1 : f < LOOK16[2] ? 1 : 0;
  const fo: FrontOpts = { mode: "stand", expr: "nervous", look: lk };
  front(out, cam, "seller", ...P, fo, f, LOOK16);
  if (f >= LOOK16[2] + 4) { const hd = cardWorld(cam, P[0], P[1], P[2], [380, 300]); card(out, "sweat", 120, 160, (pp) => { pp.ell(60, 90, 26, 40, "#bfe6ff", 5); }, hd[0] - cam.fwd.x * 0.1, hd[1], hd[2] - cam.fwd.z * 0.1, 0.06, 0.08); }
};
/** the money sack's set-local y offset above the table and squash (S16) */
export const sackPose = (f: number): { y: number; sq: number } => {
  if (f < SACK16[0]) return { y: 3.5, sq: 1 };
  if (f < SACK16[1]) { const u = (f - SACK16[0]) / (SACK16[1] - SACK16[0]); return { y: 1.6 * (1 - u * u), sq: 1 }; }
  const k = f - SACK16[1]; return { y: Math.max(0, hop(f, SACK16[1], 0.4)), sq: 1 - 0.12 * Math.exp(-k / 6) };
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place;
  if (place === "home") sellerHome(out, cam, f, id);
  if (place === "hq") hq(out, cam, f, id);
  if (place === "syr") graders(out, cam, f);
  if (place === "market") market(out, cam, f);
  if (place === "shop") shopOwner(out, cam, f);
  if (place === "board") boardroom(out, cam, f);
  return out;
};
/** the shop owner's eyes and phone (S15 POV) */
export const OWNER_EYE = (): V3 => Sm(SP.owner[0], 1.66, SP.owner[1]);
void art; void Sm; void IDX; void tier;
