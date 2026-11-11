// The attic Pokémon reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxNote, fxShadow, fxContact, Outfit, Expr, FrontOpts, SideOpts, SKIN } from "./toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, STUDY, SCHOOL, AUCTION, INSERT, clamp01, smooth, easeOut, pop, AFLOOR, CEIL, HATCH, LADDER_TOP, LADDER_BOT, STACK_AT, BINDER,
  PAT, HATCH_SLAM, SWAP, TAKE, SHINE, SCHEME, CLICKS, BRUH, QUIT, CLICK2, SHUT8, CAW, SPIT, CORD, PLONK, OPEN, JAW, BEND, DROP, SWAP2, STORE, SWAT, GAVEL, CHEER, GLOW, NOD, dustAt,
} from "./story";
import { NOINK } from "./ink";
import { cardShade, blobMaterial, CARD_K } from "./cardshade";

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
/** moving set pieces the cast drives: the binder stack (where it is, which way it faces, the top binder lifted/tilted),
 *  the openable binder (where, how open) */
export type Stage = { places: Place[]; fx: FxPlace[]; stack?: { p: V3; ry?: number; lift?: number; tilt?: number } | null; book?: { p: V3; open: number; ry?: number } | null; tbook?: { p: V3; open: number; ry?: number; s?: number } | null };

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
const C = {
  painter: { jacket: "#f3f1ec", pants: "#f3f1ec", boots: "#4a3426", hat: "cap", cap: "#3d5a8a", moustache: "#8a8a92", skin: "#f2c4a4", build: "stout", buttons: "#c9c3b4" } as Outfit,
  old: { jacket: "#8a6a4a", pants: "#e9e4d8", boots: "#4a3426", hat: "hair", hair: "#ecebe8", glasses: true, moustache: "#ecebe8", skin: "#f2c4a4", build: "stout" } as Outfit,
  son: { jacket: "#e2453c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "cap", cap: "#2f7fbf", skin: "#f5c9a0", build: "kid" } as Outfit,
  kidA: { jacket: "#3f9a55", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#5a3b2a", skin: "#c99067", build: "kid" } as Outfit,
  kidB: { jacket: "#f2c84a", pants: "#3b5b9a", boots: "#2a201a", hat: "beanie", cap: "#7b5ac9", skin: "#ecd0b6", build: "kid" } as Outfit,
  kidC: { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#f5c9a0", build: "kid" } as Outfit,
  valuer: { jacket: "#7a4f33", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#5a3b2a", glasses: true, tie: "#2f5446", skin: "#ecd0b6" } as Outfit,
  staffA: { jacket: "#2a3a63", pants: "#1f2b4a", boots: "#15131a", hat: "hair", hair: "#c9a24a", tie: "#c23a32", skin: "#f5c9a0" } as Outfit,
  staffB: { jacket: "#5a5f6e", pants: "#3b3f52", boots: "#15131a", hat: "hair", hair: "#2a201a", tie: "#2f7fbf", skin: "#c99067", build: "stout" } as Outfit,
  auctioneer: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#9a9aa2", tie: "#c23a32", skin: "#f2c4a4", build: "stout" } as Outfit,
  b1: { jacket: "#c25a7a", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#c99067" } as Outfit,
  b2: { jacket: "#2aa39a", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#e2453c", skin: "#f5c9a0" } as Outfit,
  b3: { jacket: "#f08a3c", pants: "#3b5b9a", boots: "#4a3426", hat: "hair", hair: "#8a5a34", skin: "#ecd0b6", glasses: true } as Outfit,
  b4: { jacket: "#3b4f9e", pants: "#1f2b4a", boots: "#15131a", hat: "hair", hair: "#ecebe8", skin: "#f2c4a4", build: "stout", tie: "#f2c84a" } as Outfit,
  b5: { jacket: "#6b3f8f", pants: "#3b3f52", boots: "#2a201a", hat: "beanie", cap: "#2f8a4c", skin: "#c99067" } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { painter: 1, old: 1, son: 2, kidA: 3, kidB: 4, kidC: 5, valuer: 6, staffA: 7, staffB: 8, auctioneer: 9, b1: 10, b2: 11, b3: 12, b4: 13, b5: 14 };

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
  if (LNAME === "day") {
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
const St = (x: number, y: number, z: number) => at(STUDY, x, y, z);
const Sc = (x: number, y: number, z: number) => at(SCHOOL, x, y, z);
const Au = (x: number, y: number, z: number) => at(AUCTION, x, y, z);
const I = (x: number, y: number, z: number) => at(INSERT, x, y, z);
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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[attic] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
/** the two sides of the binder stack (hands go here to carry it), in screen-right terms */
const stackSides = (cam: CamInfo, p: V3, yUp = 0.2): [V3, V3] => {
  const r = cam.right, w = BINDER.w / 2 + 0.01;
  return [[p[0] + r.x * w, p[1] + yUp, p[2] + r.z * w], [p[0] - r.x * w, p[1] + yUp, p[2] - r.z * w]];
};
/** the jaw-drop gag: a long open mouth from the chin to the floor, laid over the front card */
const jaw = (out: Stage, cam: CamInfo, who: Who, at: V3, fo: FrontOpts, k: number) => {
  if (k <= 0) return;
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [, sy] = J.shoulder(1), chin = cardWorld(cam, at[0], at[1], at[2], [300, sy - 0.1 * J.HH]);
  const len = Math.max(0.05, (chin[1] - at[1]) * k), skin = C[who].skin ?? SKIN;
  card(out, `jaw|${skin}|${q(k, 10)}`, 200, 600, (p) => art.jawDrop(p, skin), chin[0] - cam.fwd.x * 0.06, chin[1] - len / 2, chin[2] - cam.fwd.z * 0.06, 0.15, len);
};
const glowAt = (out: Stage, key: string, p: V3, s: number, col = "255,214,120") => out.fx.push({ key: "glow" + key + col, cw: 128, ch: 128, draw: (pp) => art.glow(pp, col), x: p[0], y: p[1], z: p[2], w: s, h: s, soft: true });
const tcardFx = (out: Stage, key: string, p: V3, h: number, o: { bent?: number; holo?: boolean; scuff?: boolean; k?: number; rot?: number; img?: string } = {}) =>
  card(out, `tc|${key}|${q(o.bent ?? 0, 10)}|${!!o.holo}|${!!o.scuff}|${o.img ?? ""}`, 260, 360, (pp) => art.tcard(pp, (o.k ?? 0) as art.Kind, 10, 10, 250, 350, o), p[0], p[1], p[2], h * 0.72, h, { rot: o.rot ?? 0 });

// ---------------- per-shot staging ----------------
const TB_DROP = 1407, TB_LAND = 1414; // S14: the binder falls onto the table, lands on the beat
const HOOK_AT = (f: number): V3 => [0.18, f < 100 ? 1.5 + 0.12 * smooth(f / 20) : 1.62 - 1.1 * smooth((f - 100) / 20), 0.05];
/** the hatch scene in the attic (hook and shot 8): he comes up with the stack, slides it onto the boards, pats it, sinks */
const atticPlace = (out: Stage, cam: CamInfo, f: number, f0: number, who: Who, pats: boolean, sc = 1) => {
  const t = (f - f0) * sc, y = t < 100 ? 1.5 + 0.12 * smooth(t / 20) : 1.62 - 1.1 * smooth((t - 100) / 20), at: V3 = [0.18, y, 0.05];
  if (t >= 122) return;
  const fo: FrontOpts = { mode: "stand", expr: t < 60 ? "smile" : pats && t >= PAT[0] - 4 && t < PAT[1] + 14 ? "grin" : "smile_closed", facing: 1, look: 1, armOff: t < 100 ? (1 as const) : undefined };
  const fo2: FrontOpts = { ...fo, armOff: undefined };
  // stack: held at his chest, slid onto the boards 24..56
  const edge: V3 = [0.5, AFLOOR, 0.28], k = smooth((t - 22) / 32), sp: V3 = lerp3(edge, STACK_AT, k);
  out.stack = { p: sp, ry: 0 };
  front(out, cam, who, ...at, { ...fo2, armOff: t < 100 ? 2 : undefined }, f);
  if (t < 100) {
    // both arms on the stack's sides while it moves; then the right one rests on the boards, the left pats the top twice
    const [sR, sL] = stackSides(cam, sp, 0.2);
    const patY = (pf: number) => Math.max(0, 1 - Math.abs(t - pf) / 4);
    const topP: V3 = [STACK_AT[0] - cam.right.x * 0.04, STACK_AT[1] + 6 * BINDER.h + 0.02 + 0.07 * (pats ? patY(PAT[0]) + patY(PAT[1]) : 0), STACK_AT[2]];
    const hand1 = t < 58 ? sR : pats ? lerp3(sR, topP, smooth((t - 58) / 10)) : lerp3(sR, restHand(cam, who, at, fo, 1), smooth((t - 58) / 12));
    const hand2 = t < 58 ? sL : lerp3(sL, [at[0] - cam.right.x * 0.3, AFLOOR + 0.02, at[2] + 0.25], smooth((t - 58) / 12));
    arm3d(out, cam, who, at, fo, 1, hand1, f); arm3d(out, cam, who, at, { ...fo, armOff: -1 }, -1, hand2, f);
  }
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  switch (id) {
    case 1: { // the hook: up through the hatch with the stack, onto the boards, two pats on the £300 binder, he sinks; fifteen years of dust
      atticPlace(out, cam, f, 0, "painter", true);
      if (f >= 122) out.stack = { p: STACK_AT };
      burst(out, f, HATCH_SLAM, 0.0, AFLOOR + 0.08, 0.15, 0.9, 10, "#d9d1c0");
      if (f >= 140) { // time-lapse: a web grows from the stack to the rafter, a spider drops, the window light swings round
        const k = smooth((f - 140) / 44);
        card(out, `web${q(k, 20)}`, 400, 400, (p) => art.cobweb(p, k), STACK_AT[0] + 0.28, AFLOOR + 0.55, STACK_AT[2] - 0.2, 0.6, 0.6, { face: faceTo(cam, STACK_AT[0], STACK_AT[2]) });
        const sy = 4.1 - 0.75 * smooth((f - 158) / 22);
        card(out, "spider", 120, 400, (p) => art.spider(p), 0.42, sy, -0.35, 0.09, 0.3);
        card(out, "shaft", 300, 800, (p) => art.lightShaft(p), 0.25 + 0.5 * smooth((f - 140) / 50), 3.1, -1.2, 1.1, 2.2, { soft: true, rot: 0.55 - 0.7 * smooth((f - 140) / 50) });
      }
      break;
    }
    case 2: { // the yard: son and a friend trade (the card changes hands on "đổi"); dad walks up outside the fence
      const fs: FrontOpts = { mode: "stand", expr: "grin", facing: 1, look: 1 }, fa: FrontOpts = { mode: "stand", expr: "laugh", facing: -1, look: -1 };
      const pS = Sc(-0.25, 0, 0.75), pA = Sc(0.4, 0, 0.6);
      const mid: V3 = lerp3(pS, pA, 0.5), meet: V3 = [mid[0] - cam.fwd.x * 0.1, 0.95, mid[2] - cam.fwd.z * 0.1];
      const reach = smooth((f - 236) / 16) * (1 - smooth((f - 284) / 14));
      front(out, cam, "son", ...pS, { ...fs, armOff: 1 }, f); front(out, cam, "kidA", ...pA, { ...fa, armOff: -1 }, f);
      const hS = arm3d(out, cam, "son", pS, fs, 1, lerp3(restHand(cam, "son", pS, fs, 1), meet, reach), f);
      const hA = arm3d(out, cam, "kidA", pA, fa, -1, lerp3(restHand(cam, "kidA", pA, fa, -1), meet, reach), f);
      const cp = f < SWAP ? hS : hA;
      if (f >= 230) tcardFx(out, "swap", [cp[0] - cam.fwd.x * 0.03, cp[1] + 0.05, cp[2] - cam.fwd.z * 0.03], 0.13, { holo: true, rot: f < SWAP ? 0.2 : -0.2, img: "zard_base" });
      if (f >= 272) { const u = smooth((f - 272) / 34); if (u < 1) side(out, cam, "painter", ...Sc(2.6 - 1.8 * u, 0, 1.2 - 0.25 * u), -1, -0.1, { mode: "march", phase: walkPhase(f, 0.9), stride: 0.65, expr: "smile" }, f); else front(out, cam, "painter", ...Sc(0.8, 0, 0.95), { mode: "stand", expr: "smile", facing: -1, look: -1 }, f); }
      break;
    }
    case 3: { // side by side in the yard: the son shows him the card, dad takes it and holds it up to the light; the scheme
      const pS = Sc(-0.35, 0, 0.9), pD = Sc(0.35, 0, 0.95);
      const fs: FrontOpts = { mode: "stand", expr: f < TAKE ? "grin" : "neutral", facing: -1, look: -1, armOff: -1 };
      const fd: FrontOpts = { mode: "stand", expr: f < SHINE ? "smile" : f < SCHEME ? "relief_open" : "grin", facing: 1, look: f >= SCHEME ? -1 : 1, headTilt: f >= SCHEME ? 0.08 : 0, crouch: 0.15, armOff: 1 };
      front(out, cam, "son", ...pS, fs, f, [TAKE]);
      front(out, cam, "painter", ...pD, fd, f, [SHINE, SCHEME]);
      const between: V3 = [(pS[0] + pD[0]) / 2 - cam.fwd.x * 0.15, 1.0, (pS[2] + pD[2]) / 2 - cam.fwd.z * 0.15], up: V3 = [pD[0] - 0.2 - cam.fwd.x * 0.12, 1.5, pD[2] - 0.1 - cam.fwd.z * 0.12];
      const hS = arm3d(out, cam, "son", pS, fs, -1, f < TAKE + 4 ? lerp3(restHand(cam, "son", pS, fs, -1), between, smooth((f - 313) / 12)) : lerp3(between, restHand(cam, "son", pS, fs, -1), smooth((f - TAKE - 4) / 10)), f);
      const dHand = f < TAKE ? lerp3(restHand(cam, "painter", pD, fd, 1), between, smooth((f - 322) / 16)) : lerp3(between, up, smooth((f - TAKE) / 20));
      const hD = arm3d(out, cam, "painter", pD, fd, 1, dHand, f);
      const cp = f < TAKE ? hS : hD;
      tcardFx(out, "take", [cp[0] - cam.fwd.x * 0.03, cp[1] + 0.07, cp[2] - cam.fwd.z * 0.03], f >= TAKE + 10 ? 0.19 : 0.14, { holo: true, rot: 0.05, img: "zard_base" });
      sparkle(out, f, SHINE - 2, cp[0] - cam.fwd.x * 0.06, cp[1] + 0.09, cp[2] - cam.fwd.z * 0.06, 0.5, 16);
      break;
    }
    case 4: case 7: case 16: { // the study, late 90s: at the desk; clicking (4, 7); storing a card and closing the binder (16)
      const at = St(0, 0, -0.78), fo: FrontOpts = { mode: "sit", chair: 1.0, expr: id === 16 ? "smile_closed" : "smile", facing: 0, look: id === 16 ? 0 : -1, headTilt: id === 16 ? 0.1 : 0, armOff: id === 16 ? 2 : 1 };
      if (id === 4 && f >= 496) break; // the screen insert: he is behind the camera
      front(out, cam, "painter", ...at, fo, f);
      if (id !== 16) {
        const press = [...CLICKS, CLICK2].some((c) => f >= c - 2 && f < c + 2);
        arm3d(out, cam, "painter", at, fo, 1, St(0.22, 0.8 - (press ? 0.012 : 0), -0.47), f);
      } else {
        const open = f < 1694 ? 3.0 : 3.0 * (1 - smooth((f - 1694) / 14));
        out.book = { p: St(0.1, 0.76, -0.5), open };
        const page = St(0.12, 0.83, -0.5), edge = St(0.1 - BINDER.w / 2 + BINDER.w * Math.cos(open), 0.81 + BINDER.w * Math.sin(open), -0.5); // the hinge is on the binder's left edge
        const rR = restHand(cam, "painter", at, fo, 1), rL = restHand(cam, "painter", at, fo, -1);
        // right hand: the card into a pocket, back, then rests flat on the shut cover; left hand: lifts the cover past upright and lets it fall
        const top = St(0.12, 0.83, -0.5);
        const hand = f < 1690 ? lerp3(rR, page, smooth((f - 1674) / 14)) : f < 1700 ? lerp3(page, rR, smooth((f - 1690) / 8)) : lerp3(rR, top, smooth((f - 1700) / 9));
        const h = arm3d(out, cam, "painter", at, fo, 1, hand, f);
        arm3d(out, cam, "painter", at, fo, -1, f < 1694 ? lerp3(rL, edge, smooth((f - 1684) / 10)) : f < 1701 ? edge : lerp3(edge, rL, smooth((f - 1701) / 8)), f);
        if (f < 1690) tcardFx(out, "store", [h[0], h[1] + 0.03, h[2]], 0.1, { holo: true, rot: 0.3, img: "zard_lc" });
      }
      break;
    }
    case 5: { // the doorway: the son and two friends, deadpan; dad hugging a binder at his desk
      const at = St(0, 0, -0.78), fo: FrontOpts = { mode: "sit", chair: 1.0, expr: "smile_closed", facing: 0, headTilt: 0.1, armOff: -1 };
      front(out, cam, "painter", ...at, { ...fo, armOff: 2 }, f);
      const cy = chestAt(cam, "painter", at, fo, 0.5, 0.14)[1], bp: V3 = [at[0] - cam.fwd.x * 0.22, cy, at[2] - cam.fwd.z * 0.22];
      out.book = { p: [bp[0], bp[1] - 0.12, bp[2]], open: 0, ry: faceTo(cam, bp[0], bp[2]) }; // the binder's origin is its middle
      arm3d(out, cam, "painter", at, { ...fo, armOff: 1 }, 1, add3(bp, [cam.right.x * 0.15, -0.05, cam.right.z * 0.15]), f);
      arm3d(out, cam, "painter", at, fo, -1, add3(bp, [-cam.right.x * 0.15, -0.05, -cam.right.z * 0.15]), f);
      const dz: FrontOpts = { mode: "stand", expr: "neutral", facing: 0 };
      front(out, cam, "kidA", ...St(-2.7, 0, 0.75), dz, f, [BRUH - 6]); front(out, cam, "son", ...St(-2.5, 0, 1.0), { ...dz, expr: "stern" }, f, [BRUH - 6]); front(out, cam, "kidB", ...St(-2.75, 0, 1.25), dz, f, [BRUH - 6]);
      break;
    }
    case 6: { // the hallway: the son drops his cards in the toy box; bored, he goes off kicking his football
      const at: V3 = [-1.35, 0, 1.1];
      if (f < QUIT) {
        const fo: FrontOpts = { mode: "stand", expr: f < 650 ? "neutral" : "dazed", facing: -1, look: -1, armOff: -1 };
        front(out, cam, "son", ...at, fo, f);
        const over: V3 = [-1.8, 0.62, 0.78], h = arm3d(out, cam, "son", at, fo, -1, f < 652 ? holdHand(cam, "son", at, fo, -1) : lerp3(holdHand(cam, "son", at, fo, -1), over, smooth((f - 652) / 8)), f);
        if (f < 662) tcardFx(out, "stack", [h[0], h[1] + 0.04, h[2]], 0.11, { scuff: true, img: "pikachu" });
      } else {
        const u = (f - QUIT) / 30;
        side(out, cam, "son", -1.35 + 1.5 * u, 0, 1.1 + 0.15 * u, 1, 0.1, { mode: "march", phase: walkPhase(f, 1.1), stride: 0.55, expr: "whistle" }, f);
      }
      for (let i = 0; i < 4; i++) { // the cards tumble into the box
        const t = f - 662 - i * 2; if (t < 0 || t > 10) continue;
        tcardFx(out, `fall${i}`, [-1.8 + 0.03 * i, 0.62 - 0.17 * Math.min(1, t / 7) ** 2, 0.78], 0.1, { k: i, rot: t * 0.4 + i, img: ["squirtle", "machop", "diglett", "magikarp", "onix", "meowth"][i % 6] });
      }
      break;
    }
    case 8: { // up the ladder with the stack (side view), then the attic: onto the boards, he sinks, the hatch shuts
      if (f < 790) {
        const t = smooth((f - 738) / 50), foot = lerp3(LADDER_BOT, LADDER_TOP, 0.62 * t);
        side(out, cam, "painter", foot[0], foot[1], foot[2], 0, -1, { mode: "march", phase: walkPhase(f, 0.8), stride: 0.4, reach: 1, expr: "smile" }, f);
        out.stack = { p: [foot[0], foot[1] + 0.95, foot[2] - 0.32] };
      } else {
        // the same move as the hook, 2.5x quicker: he is down and gone before the hatch shuts on SHUT8
        atticPlace(out, cam, f, 784, "painter", false, 2.5);
        if (f >= 784 + 122 / 2.5) out.stack = { p: STACK_AT };
        burst(out, f, SHUT8, 0.0, AFLOOR + 0.06, 0.15, 0.6, 8, "#d9d1c0");
      }
      break;
    }
    case 9: { // fifteen years later: reading at the desk with his tea; the paper; he spits on "sáu nghìn"
      const at = St(0, 0, -0.78), fo: FrontOpts = { mode: "sit", chair: 1.0, expr: f < 988 ? "neutral" : f < SPIT ? "dazed" : "shock", facing: 0, headTilt: f < 988 ? 0.12 : 0, armOff: 1 };
      if (f >= 932 && f < 988) break; // the paper insert
      front(out, cam, "old", ...at, fo, f, [988, SPIT]);
      const J9 = frontPts(C.old, { ...fo, seed: IDX.old + 1 }), mouth = cardWorld(cam, ...at, [300, J9.shoulder(1)[1] - 0.3 * J9.HH]), sip = f >= 975 && f < SPIT + 6;
      const cupP: V3 = sip ? [mouth[0] + cam.right.x * 0.07 - cam.fwd.x * 0.08, mouth[1] - 0.03, mouth[2] + cam.right.z * 0.07 - cam.fwd.z * 0.08] : St(0.3, 0.8, -0.45);
      const h = arm3d(out, cam, "old", at, fo, 1, f < 970 ? St(0.3, 0.8, -0.45) : lerp3(St(0.3, 0.8, -0.45), cupP, smooth((f - 970) / 6)), f);
      card(out, "cup", 160, 140, (p) => { p.poly(art.rr(30, 30, 120, 120, 18), "#fbf7ec", 6); p.ell(128, 70, 18, 22, null, 6); p.ell(75, 32, 44, 8, "#b8743a", 4); }, h[0], h[1] + 0.03, h[2], 0.09, 0.08);
      if (f >= SPIT && f < SPIT + 14) { const u = q((f - SPIT) / 14, 20); card(out, `spray${u}`, 400, 300, (p) => art.teaSpray(p, u), mouth[0] - cam.right.x * 0.2 - cam.fwd.x * 0.1, mouth[1] - 0.05, mouth[2] - cam.right.z * 0.2 - cam.fwd.z * 0.1, 0.5, 0.38, { rot: 0 }); }
      break;
    }
    case 10: { // the hallway: he reaches up, yanks the cord; the hatch drops, the ladder slides down; he scrambles up
      if (f < 1050) {
        const at: V3 = [0.25, 0, 0.45], fo: FrontOpts = { mode: "stand", expr: f < CORD ? "stern" : "grin", facing: -1, look: -1, lift: f < CORD ? 0.06 : 0, armOff: -1 };
        front(out, cam, "old", ...at, fo, f, [CORD]);
        const knob: V3 = [0, CEIL - 1.0, HATCH.z1 - 0.06];
        arm3d(out, cam, "old", at, fo, -1, f < 1031 ? lerp3(restHand(cam, "old", at, fo, -1), knob, smooth((f - 1028) / 3)) : f < CORD + 2 ? [knob[0], knob[1] - 0.12 * smooth((f - 1031) / 3), knob[2]] : restHand(cam, "old", at, fo, -1), f);
      } else {
        const t = smooth((f - 1050) / 16), foot = lerp3(LADDER_BOT, LADDER_TOP, 0.75 * t);
        side(out, cam, "old", foot[0], foot[1], foot[2], 0, -1, { mode: "march", phase: walkPhase(f, 1.8), stride: 0.4, expr: "grin" }, f);
      }
      burst(out, f, CORD + 6, 0.0, CEIL - 0.1, 0.0, 0.9, 10, "#d9d1c0");
      break;
    }
    case 11: { // Ewbank's: in through the door with the stack, onto the counter; jaws drop
      const pv = Au(3.35, 0, 2.25), fv: FrontOpts = { mode: "stand", expr: f >= JAW ? "shock" : f >= OPEN ? "relief_open" : "neutral", facing: 0, look: f < PLONK ? 1 : 0 };
      const staff: [Who, V3, FrontOpts][] = [["valuer", pv, fv], ["staffB", Au(4.05, 0, 1.95), { mode: "stand", expr: f >= JAW ? "shock" : "neutral", facing: -1 }]];
      const kj = smooth((f - JAW) / 5);
      for (const [w, p, fo] of staff) { front(out, cam, w, ...p, fo, f, [JAW]); jaw(out, cam, w, p, fo, kj); }
      const top: V3 = Au(3.45, 1.0, 2.72);
      if (f < 1128) {
        const u = smooth((f - 1072) / 56), p = Au(5.6 - 1.65 * u, 0, 4.6 - 1.4 * u);
        side(out, cam, "old", ...p, -0.76, -0.65, { mode: "march", phase: walkPhase(f, 0.8), stride: 0.5, reach: 1, expr: "smile" }, f);
        out.stack = { p: [p[0] - 0.76 * 0.3, 1.0, p[2] - 0.65 * 0.3], ry: Math.atan2(-0.76, -0.65) };
      } else {
        // after the plonk he steps back and to the left (a short side walk), so the stack is clear for the open and the jaws
        const a0 = Au(3.55, 0, 3.08), a1 = Au(2.65, 0, 3.5), ks = smooth((f - PLONK - 4) / 12), at = lerp3(a0, a1, ks), fo: FrontOpts = { mode: "stand", expr: f >= JAW ? "grin" : "smile", facing: 0, armOff: -1 };
        if (ks > 0 && ks < 1) side(out, cam, "old", ...at, a1[0] - a0[0], a1[2] - a0[2], { mode: "march", phase: walkPhase(f, 0.8), stride: 0.4, expr: "smile" }, f);
        else front(out, cam, "old", ...at, { ...fo, armOff: f < PLONK + 4 ? 2 : undefined }, f);
        const held = chestAt(cam, "old", at, fo, 0.6, 0.2), sp = lerp3([held[0], held[1] - 0.2, held[2]], top, smooth((f - 1132) / (PLONK - 1132)));
        out.stack = { p: sp };
        if (f < PLONK + 4) { const [sR, sL] = stackSides(cam, sp, 0.2); arm3d(out, cam, "old", at, { ...fo, armOff: 1 }, 1, sR, f); arm3d(out, cam, "old", at, fo, -1, sL, f); }
      }
      if (f >= OPEN) sparkle(out, f, OPEN, top[0], top[1] + 0.45, top[2], 0.5, 18);
      break;
    }
    case 12: { // the listener's beat: the valuer lifts the top binder and eyes it, then the camera
      const pv = Au(3.35, 0, 2.25), fo: FrontOpts = { mode: "stand", expr: f < 1262 ? "stern" : "dazed", facing: 0, look: f < 1262 ? 1 : 0, headTilt: f < 1262 ? 0.06 : 0, armOff: 1 };
      front(out, cam, "valuer", ...pv, fo, f, [1262]);
      const lift = smooth((f - 1222) / 14) * (1 - smooth((f - 1286) / 10));
      out.stack = { p: Au(3.45, 1.0, 2.72), lift: 0.02 * lift, tilt: 0.2 * lift };
      const tp: V3 = Au(3.45 + cam.right.x * 0.16, 1.0 + 6 * BINDER.h + 0.02 * lift - 0.03, 2.6);
      arm3d(out, cam, "valuer", pv, fo, 1, lift > 0.02 ? tp : restHand(cam, "valuer", pv, fo, 1), f);
      break;
    }
    case 13: case 14: { // the table, top-down: the heap of loose cards; his binder lands beside it, opens, a gleam runs across
      const hk = smooth((f - 1306) / 18), x = -0.5 + 0.5 * hk - (id === 14 ? 0.05 * smooth((f - 1410) / 20) : 0);
      card(out, "heap", 700, 700, (p) => art.cardHeap(p), ...I(x, 0.004, id === 14 ? -0.17 : -0.02), 0.3, 0.3, { flat: true, rot: 0.1 });
      if (id === 14 && f >= TB_DROP) {
        // the real 3D binder falls onto the table (gravity, one small bounce, a puff of dust), then its cover swings up toward
        // the lens and flops over to the left (hinge on its left edge), showing the full Skyridge page; a gleam runs across the sleeves
        const t = (f - TB_DROP) / 30, fall = Math.max(0, 0.3 - 0.5 * 9.8 * t * t), bounce = f >= TB_LAND && f < TB_LAND + 8 ? 0.018 * Math.sin(((f - TB_LAND) / 8) * Math.PI) : 0;
        const y = f < TB_LAND ? fall : bounce, open = Math.PI * smooth((f - 1432) / 18);
        out.tbook = { p: I(0.02, y, 0.07), open, s: 0.8 };
        burst(out, f, TB_LAND, ...I(0.02, 0.02, 0.07), 0.42, 9, "#efe6cf");
        if (f >= 1500 && f < 1542) { const u = q(smooth((f - 1500) / 40), 30), top = BINDER.h * 0.8 * 0.73 + 0.003;
          out.fx.push({ key: `gleam${u}`, cw: 400, ch: 400, draw: (p) => art.gleamBand(p, u), x: I(0.02, 0, 0.07)[0], y: I(0, top, 0)[1], z: I(0, 0, 0.07)[2], w: 0.23, h: 0.25, flat: true, soft: true } as FxPlace); }
      }
      break;
    }
    case 15: { // the yard, locked: a corner bent, a card dropped in the puddle, a card traded away
      const pa = Sc(-0.55, 0, -1.6), pb = Sc(0.05, 0, -1.45), pc = Sc(0.65, 0, -1.6);
      const fa: FrontOpts = { mode: "stand", expr: f >= BEND ? "grin" : "smile", facing: 1, armOff: 1 }, fb: FrontOpts = { mode: "stand", expr: f >= DROP ? "shock" : "smile", facing: 0, armOff: 1 };
      const fc: FrontOpts = { mode: "stand", expr: "laugh", facing: -1, armOff: -1 };
      front(out, cam, "kidA", ...pa, fa, f, [BEND]); front(out, cam, "kidB", ...pb, fb, f, [DROP]); front(out, cam, "kidC", ...pc, fc, f);
      const ha = arm3d(out, cam, "kidA", pa, fa, 1, holdHand(cam, "kidA", pa, fa, 1, 0.12), f);
      tcardFx(out, "bend", [ha[0] - cam.fwd.x * 0.03, ha[1] + 0.07, ha[2] - cam.fwd.z * 0.03], 0.16, { k: 1, bent: smooth((f - BEND + 4) / 5), scuff: true, img: "bulbasaur" });
      const mid: V3 = lerp3(pb, pc, 0.5), meet: V3 = [mid[0] - cam.fwd.x * 0.12, 0.85, mid[2] - cam.fwd.z * 0.12], rk = smooth((f - 1638) / 10) * (1 - smooth((f - 1660) / 10));
      const hb = arm3d(out, cam, "kidB", pb, fb, 1, f < DROP + 10 ? holdHand(cam, "kidB", pb, fb, 1, 0.12) : lerp3(restHand(cam, "kidB", pb, fb, 1), meet, rk), f);
      const hc = arm3d(out, cam, "kidC", pc, fc, -1, lerp3(holdHand(cam, "kidC", pc, fc, -1, 0.12), meet, rk), f);
      if (f < DROP - 4) tcardFx(out, "dropC", [hb[0] - cam.fwd.x * 0.03, hb[1] + 0.07, hb[2] - cam.fwd.z * 0.03], 0.15, { k: 2, img: "squirtle" });
      else if (f < DROP + 8) { const t = (f - (DROP - 4)) / 8, y = hb[1] + 0.07 - (hb[1] + 0.07) * Math.min(1, t * t); tcardFx(out, "dropF", [Sc(0.4, 0, -1.1)[0], Math.max(0.02, y), Sc(0, 0, -1.1)[2]], 0.15, { k: 2, rot: t * 2, img: "squirtle" }); }
      else card(out, "soggy", 260, 360, (p) => art.tcard(p, 2, 10, 10, 250, 350, { scuff: true, img: "squirtle" }), ...Sc(0.4, 0.012, -1.1), 0.11, 0.15, { flat: true, rot: 0.6 });
      burst(out, f, DROP + 4, ...Sc(0.4, 0.08, -1.1), 0.5, 10, "#9fd0f2");
      const swapP = f < SWAP2 ? hc : hb;
      if (f >= 1630) tcardFx(out, "swapB", [swapP[0] - cam.fwd.x * 0.03, swapP[1] + 0.07, swapP[2] - cam.fwd.z * 0.03], 0.15, { k: 3, img: "charmander" });
      break;
    }
    case 17: { // the shelf: the son's arm creeps up to a binder; dad swats it away
      const ps = St(1.6, 0, -2.0), pd = St(1.0, 0, -1.85);
      const fs: FrontOpts = { mode: "stand", expr: f < SWAT ? "grin" : "pained", facing: 0, look: f < SWAT ? 0 : -1, lift: f < SWAT ? 0.08 : 0, armOff: -1 };
      const fd: FrontOpts = { mode: "stand", expr: f < SWAT - 10 ? "smile" : "stern", facing: 0, look: 1, armOff: 1 };
      front(out, cam, "son", ...ps, fs, f, [SWAT]); front(out, cam, "painter", ...pd, fd, f, [SWAT - 10]);
      const binder: V3 = St(1.48, 1.14, -2.28), creep = smooth((f - 1728) / 36), back = smooth((f - SWAT) / 6);
      const hs = arm3d(out, cam, "son", ps, fs, -1, lerp3(lerp3(restHand(cam, "son", ps, fs, -1), binder, creep), restHand(cam, "son", ps, fs, -1), back), f);
      const hit = f < SWAT ? lerp3(restHand(cam, "painter", pd, fd, 1), hs, smooth((f - (SWAT - 8)) / 8)) : lerp3(hs, restHand(cam, "painter", pd, fd, 1), smooth((f - SWAT) / 10));
      arm3d(out, cam, "painter", pd, fd, 1, hit, f);
      burst(out, f, SWAT, hs[0] - cam.fwd.x * 0.05, hs[1], hs[2] - cam.fwd.z * 0.05, 0.25, 6);
      break;
    }
    case 18: case 19: { // the rostrum and the room
      const room = id === 19 && f >= 2005;
      if (!room) {
        const fa: FrontOpts = { mode: "stand", expr: f >= GAVEL ? "grin" : "stern", facing: 0, prop: ["gavel", f < GAVEL - 8 ? 0.2 : f < GAVEL ? 1 : Math.max(0, 1 - (f - GAVEL) / 8)] };
        front(out, cam, "auctioneer", ...Au(0, 0, -4.95), fa, f, [GAVEL]);
        burst(out, f, GAVEL, ...Au(0.25, 1.2, -4.5), 0.5, 8);
        // the crowd in profile, facing the rostrum
        const crowd: [Who, number, number][] = [["b1", -2.1, -2.5], ["b2", -1.45, -2.25], ["old", -0.85, -2.6], ["b4", 0.85, -2.3], ["b5", 1.5, -2.6]];
        for (const [w, x, z] of crowd) side(out, cam, w, ...Au(x, 0, z), 0, -1, { mode: "stand", expr: f >= GAVEL ? "shock" : "neutral" }, f);
      } else { // from the front: they erupt on "thành công nhất"
        const crowd: [Who, number, number, number][] = [["b1", -1.0, 0.6, 0], ["b2", -0.45, 1.3, 1], ["old", 0.05, 0.25, 2], ["b4", 0.6, 1.2, 3], ["b5", 1.05, 0.55, 4], ["b3", 0.15, 2.0, 5]];
        for (const [w, x, z, i] of crowd) {
          const t = f - CHEER - i * 2, jump = t >= 0 ? 0.18 * Math.abs(Math.sin(t * 0.32)) * Math.exp(-t / 50) : 0;
          front(out, cam, w, ...Au(x, jump, z), { mode: "stand", expr: f < CHEER ? (w === "old" ? "shock" : "relief_open") : w === "old" ? "grin" : "laugh", facing: 0, wave: f >= CHEER ? 1 : 0 }, f, [CHEER]);
        }
      }
      break;
    }
    case 20: { // dusk: he opens the hatch, gold floods down; the attic, the clean patch where the binders sat, a nod
      if (f < 2200) {
        const at: V3 = [0.3, 0, 0.55], fo: FrontOpts = { mode: "stand", expr: f < GLOW ? "smile" : "relief_open", facing: -1, look: -1, headTilt: f >= GLOW ? -0.12 : 0, armOff: f < GLOW + 4 ? -1 : undefined };
        front(out, cam, "old", ...at, fo, f, [GLOW]);
        const knob: V3 = [0, CEIL - 1.0, HATCH.z1 - 0.06];
        if (f < GLOW + 4) arm3d(out, cam, "old", at, fo, -1, f < 2140 ? lerp3(restHand(cam, "old", at, fo, -1), knob, smooth((f - 2122) / 12)) : [knob[0], knob[1] - 0.12, knob[2]], f);
        if (f >= GLOW) card(out, "goldShaft", 300, 800, (p) => art.lightShaft(p, "255,214,120"), 0.05, 1.3, 0.15, 1.4 * smooth((f - GLOW) / 14), 2.6, { soft: true });
      } else {
        const at: V3 = [-0.1, AFLOOR, -0.75];
        front(out, cam, "old", ...at, { mode: "sit", expr: f < NOD ? "smile_closed" : "grin", facing: 1, look: 1, headTilt: f >= NOD && f < NOD + 10 ? -0.14 * Math.sin(((f - NOD) / 10) * Math.PI) : 0 }, f, [NOD]);
        card(out, "patch", 400, 400, (p) => { const g = p.g; g.fillStyle = "rgba(183,176,162,0.85)"; g.beginPath(); g.ellipse(200, 200, 196, 170, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = "rgba(255,220,140,0.9)"; g.fillRect(118, 112, 164, 176); }, STACK_AT[0], AFLOOR + 0.006, STACK_AT[2], 0.55, 0.55, { flat: true });
        glowAt(out, "patch", [STACK_AT[0], AFLOOR + 0.12, STACK_AT[2]], 0.7);
      }
      break;
    }
  }
  return out;
};
