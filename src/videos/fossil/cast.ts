// The Fossil sheet reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, HOUSE, AUC, STORE, PRESS, clamp01, smooth, easeOut, pop, mark, obj, hop, H, AU, STO, PR, DMG, LOFT, CEIL,
  BAND1, SHOVE1, CORD1, SLAM1, DUST3, SPIDER3, CREAK3, POPS3, OPEN5, HEAD5, RISE6, PULL6, DUCK6, PUSH7, ROLLED7, TIN7, TINLAND7,
  LIFT8, DROP8, WALL9, PEEL9, ROLLUP9, TOSS9, DASH10, YANK10, HUG10, PEEK11, FREEZE12, STACK13, UNROLL14, LAMP14, GLEAM14,
  NEXT15, BLADEUP15, CHOP15, POINT16, TAP16, FLASHES, STAMP17, GAPE18, RAISE19, DOOR20, BLADE20, SQUINT20, dustAt,
} from "./story";
import * as art2 from "./art2";
import { SL, SW, R0 } from "./sets";
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
/** the hero sheet this frame: group position + rotation (world), and its shape */
export type SheetK = { p: V3; r?: [number, number, number]; q?: THREE.Quaternion; pose: { a: number; curl?: number; fold?: number; wreck?: boolean; gleam?: number; band?: boolean; dust?: number }; vis?: boolean };
export type Stage = { places: Place[]; fx: FxPlace[]; props: Record<string, PropK>; sheet?: SheetK; cordEnd?: V3 };

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
  relative: { jacket: "#d8322f", pants: "#3b3f52", boots: "#2a2c33", hat: "cap", cap: "#d8322f", skin: "#f5c9a0", badge: "#f6f2e6", buttons: "#f6f2e6" } as Outfit,
  owner: { jacket: "#a98fd0", pants: "#4a4f6a", boots: "#5a3b2a", hat: "hair", hair: "#3a2a20", glasses: true, skin: "#ecd0b6" } as Outfit,
  partner: { jacket: "#3f9a6a", pants: "#3b5b9a", boots: "#2a2c33", hat: "hair", hair: "#2a201a", skin: "#e8b896" } as Outfit,
  valuer: { jacket: "#8a6a4a", pants: "#5a4a3a", boots: "#3a2a22", hat: "hair", hair: "#c9c6c0", glasses: true, tie: "#c23a32", skin: "#f2c4a4", build: "stout" } as Outfit,
  photog: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "cap", cap: "#2a2c33", skin: "#c99067" } as Outfit,
  auctioneer: { jacket: "#24407a", pants: "#24407a", boots: "#15131a", hat: "hair", hair: "#9a9aa2", tie: "#c23a32", skin: "#f2c4a4" } as Outfit,
  kid1: { jacket: "#f08a2c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "cap", cap: "#2f6fc4", skin: "#f5c9a0", build: "kid" } as Outfit,
  kid2: { jacket: "#2f6fc4", pants: "#3b3f52", boots: "#f4f1ea", hat: "hair", hair: "#2a201a", skin: "#c99067", build: "kid" } as Outfit,
  head1: { jacket: "#5a6a3a", pants: "#3b3f52", boots: "#2a2c33", hat: "cap", cap: "#8a5a34", skin: "#e8b896", moustache: "#4a3020" } as Outfit,
  head2: { jacket: "#d8322f", pants: "#3b3f52", boots: "#2a2c33", hat: "hair", hair: "#15131a", skin: "#f5c9a0", shades: true } as Outfit,
  head3: { jacket: "#3f7fc9", pants: "#3b3f52", boots: "#2a2c33", hat: "hair", hair: "#5a3b2a", skin: "#ecd0b6" } as Outfit,
  bid1: { jacket: "#2a2c33", pants: "#2a2c33", boots: "#15131a", hat: "hair", hair: "#ecebe8", skin: "#f2c4a4", tie: "#7a1f2a" } as Outfit,
  bid2: { jacket: "#7a4a2a", pants: "#3a2f2a", boots: "#15131a", hat: "hair", hair: "#8a5a34", skin: "#f5c9a0", glasses: true } as Outfit,
  bid3: { jacket: "#3b5b9a", pants: "#3b3f52", boots: "#15131a", hat: "hair", hair: "#15131a", skin: "#c99067" } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { relative: 2, owner: 5, partner: 3, valuer: 9, photog: 6, auctioneer: 10, kid1: 4, kid2: 11, head1: 12, head2: 13, head3: 14, bid1: 15, bid2: 16, bid3: 17 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[fossil] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Ho = (x: number, y: number, z: number) => at(HOUSE, x, y, z);
const Au = (x: number, y: number, z: number) => at(AUC, x, y, z);
const St = (x: number, y: number, z: number) => at(STORE, x, y, z);
const v3a = (a: number[]): V3 => [a[0], a[1], a[2]];
const lerpQ = (a: THREE.Quaternion, b: THREE.Quaternion, k: number) => a.clone().slerp(b, clamp01(k));
const QI = new THREE.Quaternion(), QUP = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
/** wall orientation: sheet x -> world +z, normal -> world -x, down the sheet -> world -y */
const QWALL = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0)));
/** the group position that puts a tube (a = 0) centre at P for a rotation q */
const tubeAt = (P: V3, q: THREE.Quaternion, pose: SheetK["pose"]): SheetK => {
  const o = new THREE.Vector3(0, R0, -SL / 2).applyQuaternion(q);
  return { p: [P[0] - o.x, P[1] - o.y, P[2] - o.z], q, pose: { ...pose, a: 0 } };
};
/** a sheet-local point through a group transform */
const sheetPt = (k: SheetK, x: number, y: number, z: number): V3 => { const v = new THREE.Vector3(x, y, z).applyQuaternion(k.q ?? QI); return [k.p[0] + v.x, k.p[1] + v.y, k.p[2] + v.z]; };
const TUBE_REST: V3 = v3a(H.tube);
const loftTube = (wreck: boolean, dust: number, band: boolean) => tubeAt(TUBE_REST, QI, { a: 0, wreck, dust, band });
const web = (out: Stage, k: number, p: V3, s: number) => { if (k <= 0.02) return; const kk = q(k, 20); card(out, `web${kk}`, 400, 400, (pp) => art.cobweb(pp, kk), p[0], p[1], p[2], s, s, { face: 0, soft: true }); };
const motes = (out: Stage, f: number, f0: number, n: number, seam: (i: number) => V3, life = 70) => {
  const t = (f - f0) / FPS; if (t < 0 || f > f0 + life) return;
  for (let i = 0; i < n; i++) { const s = seam(i), d = t * (0.6 + 0.5 * hh(i, 3)); const y = s[1] - (0.12 * d + 0.35 * d * d); if (y < 0.05) continue;
    card(out, "mote", 64, 64, (pp) => art2.mote(pp), s[0] + 0.05 * Math.sin(t * 3 + i), y, s[2] + 0.04 * Math.cos(t * 2 + i), 0.035, 0.035, { soft: true }); }
};
const hatchSeam = (i: number): V3 => { const u = hh(i, 1), side = i % 4, [x0, x1] = H.hatch_x, [z0, z1] = H.hatch_z;
  return side === 0 ? [x0 + (x1 - x0) * u, CEIL - 0.01, z0] : side === 1 ? [x0 + (x1 - x0) * u, CEIL - 0.01, z1] : side === 2 ? [x0, CEIL - 0.01, z0 + (z1 - z0) * u] : [x1, CEIL - 0.01, z0 + (z1 - z0) * u]; };
/** a head popping up through the hatch: feet y from below the boards to just high enough for the head and shoulders */
const popY = (f: number, f0: number, len = 12) => { const u = f - f0; if (u < 0 || u > len) return -1; return 0.85 + 0.6 * (u < 4 ? smooth(u / 4) : u < len - 3 ? 1 : 1 - smooth((u - len + 3) / 3)); };

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const P = out.props;
  switch (id) {
    case 1: { // 1999: band, shove, cord, slam
      const m = Ho(...(H.rel as V3)), expr = f < BAND1[1] ? "stern" : f < SHOVE1 ? "grin" : f < SLAM1 ? "smile" : f < 150 ? "pained" : "smile_closed";
      const fo: FrontOpts = { mode: "stand", expr, armOff: 2, look: f >= CORD1[0] - 4 && f < SLAM1 ? -1 : 0, headTilt: f >= CORD1[0] && f < SLAM1 ? -0.1 : 0 };
      front(out, cam, "relative", ...m, fo, f, [BAND1[1], SLAM1]);
      const chest = chestAt(cam, "relative", m, fo, 0.42, 0.2), over: V3 = [0, 2.42, -0.95];
      let T: V3, rx = 0;
      if (f < 58) T = chest;
      else if (f < SHOVE1) T = lerp3(chest, over, smooth((f - 58) / (SHOVE1 - 58)));
      else { const t = (f - SHOVE1) / FPS, tl = 0.408; if (t < tl) T = [0, 2.42 + 2.6 * t - 4.9 * t * t, -0.95 - 1.16 * t]; else { const u = easeOut((f - SHOVE1 - 12) / 17), z = -1.423 + (TUBE_REST[2] + 1.423) * u; T = [0, TUBE_REST[1], z]; rx = -(z + 1.423) / R0; } }
      out.sheet = tubeAt(T, new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, 0)), { a: 0, band: f >= BAND1[1] });
      const rest = [restHand(cam, "relative", m, fo, -1), restHand(cam, "relative", m, fo, 1)];
      for (const sd of [-1, 1] as const) {
        let hand: V3 = rest[sd < 0 ? 0 : 1];
        if (f < SHOVE1 + 2) hand = [T[0] + sd * 0.2, T[1] - 0.02, T[2] + 0.03];
        else if (f < CORD1[0] - 6) hand = lerp3([over[0] + sd * 0.2, over[1], over[2]], rest[sd < 0 ? 0 : 1], smooth((f - SHOVE1 - 2) / 10));
        if (sd < 0 && f >= CORD1[0] - 6 && f < CORD1[1] + 4) { const grab: V3 = [H.hatch_x[0] + 0.02, 2.42, -1.0], pull: V3 = [H.hatch_x[0] + 0.02, 2.24, -1.0];
          hand = f < CORD1[0] ? lerp3(rest[0], grab, smooth((f - CORD1[0] + 6) / 6)) : lerp3(grab, pull, smooth((f - CORD1[0]) / (CORD1[1] - CORD1[0]))); out.cordEnd = hand; }
        arm3d(out, cam, "relative", m, fo, sd, hand, f);
      }
      if (f >= BAND1[1] && f < BAND1[1] + 6) { const u = q((f - BAND1[1]) / 6, 10); card(out, `twang${u}`, 200, 120, (pp) => art2.twang(pp, u), T[0] + 0.12, T[1] + 0.08, T[2] + 0.06, 0.18, 0.11); }
      motes(out, f, SLAM1, 40, hatchSeam, 80);
      if (f >= SLAM1 && f < SLAM1 + 10) { const u = q((f - SLAM1) / 10, 10); card(out, `puff${u}`, 400, 400, (pp) => fxPuff(pp, u), 0, CEIL - 0.08, -0.62, 0.5, 0.3); }
      break;
    }
    case 2: case 3: case 4: case 5: case 6: { // the loft, 1999 -> 2026
      const d = dustAt(f, id), wreck = id >= 2;
      out.sheet = loftTube(wreck, d, true);
      const wk = id === 2 ? 0.15 + 0.35 * clamp01((f - 212) / 38) : id === 3 ? 0.5 : id === 4 ? 0.5 + 0.5 * clamp01((f - 456) / 34) : 1;
      if (!(id === 6 && f >= PULL6[0] + 2)) web(out, wk, [TUBE_REST[0] + 0.05, TUBE_REST[1] + 0.09, TUBE_REST[2] + 0.07], 0.42);
      web(out, Math.min(1, wk + 0.3), [0.25, 3.0, -1.93], 0.38);
      if (id >= 3 && id <= 5) { const yb = id === 3 ? (f < SPIDER3[0] ? 3.95 : 3.95 - 0.85 * smooth((f - SPIDER3[0]) / (SPIDER3[1] - SPIDER3[0]))) : 3.1;
        const sway = 0.015 * Math.sin(f * 0.15); card(out, "spider", 120, 400, (pp) => art.spider(pp), 0.18 + sway, yb + 0.21, -1.75, 0.13, 0.45, { face: 0 }); }
      if (id === 3 && f >= DUST3 && f < DUST3 + 18) { const u = q((f - DUST3) / 18, 12); card(out, `puff${u}`, 400, 400, (pp) => fxPuff(pp, u), TUBE_REST[0] - 0.2 + 0.4 * u, TUBE_REST[1] + 0.12, TUBE_REST[2] + 0.1, 0.35, 0.25, { soft: true }); }
      if (id === 3) POPS3.forEach((p0, i) => { const y = popY(f, p0); if (y < 0) return; const who = (["head1", "head2", "head3"] as Who[])[i];
        front(out, cam, who, H.pop[0], y, H.pop[2], { mode: "stand", expr: "nervous", facing: 1, look: 1 }, f); });
      if (id === 5 && f >= HEAD5) { const y = 0.85 + 0.55 * smooth((f - HEAD5) / 6); front(out, cam, "partner", H.pop[0], y, H.pop[2], { mode: "stand", expr: f >= HEAD5 + 8 ? "shock" : "neutral", facing: 1, look: 1 }, f, [HEAD5 + 8]); }
      if (id === 5 && f >= OPEN5 + 3) glowAt(out, "torch", [0.08, 2.85, -1.35], 0.6, "255,240,200");
      if (id === 6) { // he rises a rung, reaches over the rim, drags the tube to him and ducks down with it (side view, facing -z)
        const z0 = f < PULL6[1] ? -1.25 : -1.25 + 0.27 * smooth((f - PULL6[1]) / 6), y0 = f < RISE6[1] ? 1.4 + 0.05 * smooth((f - RISE6[0]) / 12) : f < DUCK6[0] ? 1.45 : 1.45 - 0.9 * smooth((f - DUCK6[0]) / (DUCK6[1] - DUCK6[0]));
        side(out, cam, "partner", 0, y0, z0, 0, -1, { mode: "stand", reach: 1, expr: f >= PULL6[1] ? "grin" : "stern" }, f);
        const hold: V3 = [0, y0 + 1.22, z0 - 0.24];
        if (f >= PULL6[0]) { const k = smooth((f - PULL6[0]) / (PULL6[1] - PULL6[0])), T = lerp3(TUBE_REST, hold, k); out.sheet = tubeAt(T, QI, { a: 0, wreck: true, dust: 1, band: true }); }
        if (f >= PULL6[0] && f < PULL6[0] + 14) { const u = q((f - PULL6[0]) / 14, 10); card(out, `puff${u}`, 400, 400, (pp) => fxPuff(pp, u), TUBE_REST[0], TUBE_REST[1] + 0.05, TUBE_REST[2], 0.4, 0.3, { soft: true }); }
      }
      break;
    }
    case 7: case 8: { // the landing floor: unroll, the tin, the damage, the torn corner
      const om = Ho(H.owner_floor[0], 0, H.owner_floor[1]);
      const fo: FrontOpts = { mode: "sit", chair: 0.06, expr: id === 7 ? "neutral" : "pained", armOff: 2, look: 1 };
      front(out, cam, "owner", ...om, fo, f, id === 8 ? [653, 687, 716, 767] : []);
      const a = id === 8 || f >= ROLLED7 ? SL : f < PUSH7 ? 0 : SL * easeOut((f - PUSH7) / (ROLLED7 - PUSH7));
      const curl = id === 7 && f >= ROLLED7 && f < TINLAND7 ? smooth((f - ROLLED7) / 4) : 0;
      const fold = id === 8 ? (f < LIFT8[0] ? 0 : f < LIFT8[1] ? 2.45 * smooth((f - LIFT8[0]) / (LIFT8[1] - LIFT8[0])) : f < DROP8 ? 2.45 : 2.45 * (1 - clamp01((f - DROP8) / 6) ** 2)) : 0;
      out.sheet = { p: v3a(H.floor_sheet), q: QI, pose: { a, curl, fold, wreck: true } };
      const rest = [restHand(cam, "owner", om, fo, -1), restHand(cam, "owner", om, fo, 1)];
      let rh = rest[1];
      if (id === 7 && f >= PUSH7 - 8 && f < PUSH7 + 6) rh = lerp3(rest[1], Ho(-0.28, 0.06, 0.04), smooth((f - PUSH7 + 8) / 6) * (1 - smooth((f - PUSH7) / 6)));
      if (id === 8 && f >= LIFT8[0] - 6 && f < DROP8) { const w = 0.1414, k = Math.SQRT1_2, X = -0.36 + w * k - w * Math.cos(fold) * k, Z = -0.51 + w * k - w * Math.cos(fold) * k, Y = w * Math.sin(fold);
        const tip = Ho(H.floor_sheet[0] + X, Y + 0.01, H.floor_sheet[2] + Z); rh = f < LIFT8[0] ? lerp3(rest[1], tip, smooth((f - LIFT8[0] + 6) / 6)) : tip; }
      arm3d(out, cam, "owner", om, fo, -1, rest[0], f); arm3d(out, cam, "owner", om, fo, 1, rh, f);
      // the partner with the paint tin
      const pm = Ho(H.partner[0], 0, H.partner[1]), pf: FrontOpts = { mode: "stand", expr: "neutral", armOff: -1, look: -1 };
      front(out, cam, "partner", ...pm, pf, f);
      const ph = holdHand(cam, "partner", pm, pf, -1, 0.05), land = v3a(H.tin_land);
      let tp: V3 = [ph[0], ph[1] - 0.14, ph[2]], rz = 0;
      if (id === 8 || f >= TINLAND7) { tp = [land[0], 0.004, land[2]]; rz = id === 7 ? 0.1 * Math.sin((f - TINLAND7) * 1.6) * Math.exp(-(f - TINLAND7) / 3) : 0; }
      else if (f >= TIN7) { const u = (f - TIN7) / (TINLAND7 - TIN7); tp = [ph[0] + (land[0] - ph[0]) * u, (ph[1] - 0.14) * (1 - u * u) + 0.004 * u * u, ph[2] + (land[2] - ph[2]) * u]; rz = 0.5 * u; }
      arm3d(out, cam, "partner", pm, pf, -1, id === 7 && f < TIN7 ? [tp[0], tp[1] + 0.14, tp[2]] : restHand(cam, "partner", pm, pf, -1), f);
      P.tin = { p: tp, rz };
      break;
    }
    case 9: { // press to the wall: it matches; peel, roll, toss into the bag
      const pm = Ho(H.partner_wall[0], 0, H.partner_wall[1]);
      const fo: FrontOpts = { mode: "stand", expr: f < 818 ? "neutral" : f < PEEL9 ? "smile_closed" : "stern", armOff: 2, look: -1, crouch: f < WALL9[0] + 6 ? 0.2 : 0 };
      front(out, cam, "partner", ...pm, fo, f, [818, PEEL9]);
      const floor: SheetK = { p: v3a(H.floor_sheet), q: QI, pose: { a: SL, wreck: true } }, wallK: SheetK = { p: v3a(H.wall_sheet), q: QWALL, pose: { a: SL, wreck: true } };
      let K: SheetK;
      if (f < WALL9[1]) { const k = smooth((f - WALL9[0]) / (WALL9[1] - WALL9[0])); K = { p: lerp3(floor.p, wallK.p, k), q: lerpQ(QI, QWALL, k), pose: { a: SL, wreck: true } }; }
      else if (f < ROLLUP9[0]) K = wallK;
      else if (f < TOSS9[0]) K = { ...wallK, pose: { a: SL * (1 - smooth((f - ROLLUP9[0]) / (ROLLUP9[1] - ROLLUP9[0]))), wreck: true } };
      else {
        const S0 = sheetPt(wallK, 0, R0, -SL / 2), E: V3 = [H.bag[0], 0.74, H.bag[2]], u = clamp01((f - TOSS9[0]) / (TOSS9[1] - TOSS9[0]));
        const T: V3 = f < TOSS9[1] ? [S0[0] + (E[0] - S0[0]) * u, S0[1] + (E[1] - S0[1]) * u + 0.45 * Math.sin(Math.PI * u), S0[2] + (E[2] - S0[2]) * u] : E;
        const wob = f >= TOSS9[1] ? 0.12 * Math.sin((f - TOSS9[1]) * 1.3) * Math.exp(-(f - TOSS9[1]) / 5) : 0;
        K = tubeAt(T, lerpQ(QWALL, QUP, u).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(wob, 0, 0))), { a: 0, wreck: true });
      }
      out.sheet = K;
      const rest = [restHand(cam, "partner", pm, fo, -1), restHand(cam, "partner", pm, fo, 1)];
      const e1 = sheetPt(K, SW / 2, 0, -0.22), e2 = sheetPt(K, SW / 2, 0, 0.22);
      let hl = rest[0], hr = rest[1];
      if (f >= WALL9[0] - 4 && f < ROLLUP9[0]) { hl = e1; hr = e2; }
      else if (f >= ROLLUP9[0] && f < TOSS9[0] + 3) { const c = sheetPt(K, SW / 2 - 0.02, R0, K.pose.a - SL / 2); hl = c; hr = [c[0], c[1] - 0.12, c[2]]; }
      arm3d(out, cam, "partner", pm, fo, -1, hl, f); arm3d(out, cam, "partner", pm, fo, 1, hr, f);
      front(out, cam, "owner", -0.5, 0, 1.8, { mode: "stand", expr: f >= PEEL9 ? "shock" : "neutral", look: 1 }, f, [PEEL9]);
      P.tin = { p: [0.45, 0.004, 1.3] };
      break;
    }
    case 10: { // she dashes, yanks it out of the bag, the TV, the hug
      const m0 = Ho(-0.5, 0, 1.8), m1 = Ho(H.owner_bag[0], 0, H.owner_bag[1]);
      const inBag: SheetK = tubeAt([H.bag[0], 0.74, H.bag[2]], QUP, { a: 0, wreck: true });
      if (f < DASH10[1]) { const u = clamp01((f - DASH10[0]) / (DASH10[1] - DASH10[0])), a = lerp3(m0, m1, u);
        if (f < DASH10[0]) front(out, cam, "owner", ...m0, { mode: "stand", expr: "shock", look: 1 }, f);
        else side(out, cam, "owner", ...a, m1[0] - m0[0], m1[2] - m0[2], { mode: "march", phase: walkPhase(f, 2.0), stride: 0.8, reach: 1, expr: "shock" }, f);
        out.sheet = inBag;
      } else {
        const hug = f >= HUG10, fo: FrontOpts = { mode: "stand", expr: f < 925 ? "stern" : f < HUG10 ? "neutral" : "stern", armOff: 2, look: f >= 925 && f < 1010 ? -1 : 0, facing: f >= 925 && f < 1010 ? -1 : 0 };
        front(out, cam, "owner", ...m1, fo, f, [925, 1010, HUG10]);
        const chest = chestAt(cam, "owner", m1, fo, 0.5, hug ? 0.1 : 0.2);
        const top = sheetPt(inBag, SW / 2, R0, -SL / 2);
        let K: SheetK;
        if (f < YANK10) K = inBag;
        else { const k = smooth((f - YANK10) / 10); K = tubeAt(lerp3([H.bag[0], 0.74, H.bag[2]], chest, k), lerpQ(QUP, QI, k), { a: 0, wreck: true }); }
        out.sheet = K;
        const rest = [restHand(cam, "owner", m1, fo, -1), restHand(cam, "owner", m1, fo, 1)];
        const T = f < YANK10 ? top : sheetPt(K, 0, R0, -SL / 2);
        const hr: V3 = f < YANK10 - 4 ? rest[1] : f < YANK10 ? lerp3(rest[1], top, smooth((f - YANK10 + 4) / 4)) : [T[0] + 0.15, T[1], T[2] + 0.04];
        const hl: V3 = f < YANK10 + 8 ? rest[0] : [T[0] - 0.15, T[1], T[2] + 0.04];
        arm3d(out, cam, "owner", m1, fo, -1, hl, f); arm3d(out, cam, "owner", m1, fo, 1, hr, f);
      }
      P.tin = { p: [0.45, 0.004, 1.3] };
      break;
    }
    case 11: case 12: case 14: { // the valuation counter
      const om = Au(AU.owner[0], 0, AU.owner[1]), vm = Au(AU.valuer[0], 0, AU.valuer[1]);
      const oexpr = id === 11 ? (f >= PEEK11 - 10 ? "pained" : "nervous") : id === 14 ? (f >= GLEAM14 ? "shock" : "nervous") : "nervous";
      front(out, cam, "owner", ...om, { mode: "stand", expr: oexpr, look: 1, gape: id === 14 && f >= GLEAM14 ? 0.4 : 0 }, f, [PEEK11 - 10, GLEAM14]);
      if (id === 11) { card(out, "lottery", 200, 110, (pp) => art2.lottery(pp), ...Au(AU.owner[0] + 0.1, 1.08, AU.owner[1] + 0.06), 0.11, 0.06, { rot: 0.3 });
        if (f >= PEEK11) card(out, "sweat", 64, 96, (pp) => art2.sweat(pp), ...Au(AU.owner[0] + 0.22, 1.75 - 0.002 * (f - PEEK11), AU.owner[1] + 0.05), 0.05, 0.075); }
      const vexpr = id === 12 ? (f >= FREEZE12 + 35 ? "stern" : f >= FREEZE12 ? "shock" : "neutral") : id === 14 ? (f >= GLEAM14 ? "grin" : "neutral") : "neutral";
      const crouch = id === 14 && f < LAMP14 + 6 ? 0.35 : id === 12 ? 0.12 * smooth((f - 1160) / 40) : 0;
      const vfo: FrontOpts = { mode: "stand", expr: vexpr, armOff: 2, crouch, gape: id === 12 && f >= FREEZE12 && f < FREEZE12 + 35 ? 0.35 : 0 };
      front(out, cam, "valuer", ...vm, vfo, f, [FREEZE12, FREEZE12 + 35, GLEAM14]);
      const a = id < 14 || f < UNROLL14[0] ? 0 : SL * easeOut((f - UNROLL14[0]) / (UNROLL14[1] - UNROLL14[0]));
      const K: SheetK = { p: Au(...(AU.sheet as V3)), q: QI, pose: { a, wreck: true, gleam: id === 14 ? (f - GLEAM14) / 34 : -1 } };
      out.sheet = K;
      const rest = [restHand(cam, "valuer", vm, vfo, -1), restHand(cam, "valuer", vm, vfo, 1)];
      let hr = rest[1], hl = rest[0];
      if (id === 14 && f >= UNROLL14[0] - 6 && f < UNROLL14[0] + 8) hr = lerp3(rest[1], sheetPt(K, 0.05, R0 * 1.6, a - SL / 2), smooth((f - UNROLL14[0] + 6) / 6) * (1 - smooth((f - UNROLL14[0] - 2) / 6)));
      if (id === 14 && f >= LAMP14 - 8 && f < LAMP14 + 6) hl = lerp3(rest[0], Au(AU.lamp[0] + 0.01, AU.top + 0.25, AU.lamp[2] + 0.02), smooth((f - LAMP14 + 8) / 6) * (1 - smooth((f - LAMP14) / 6)));
      if (id === 12) { hr = lerp3(rest[1], Au(AU.valuer[0] + 0.3, AU.top + 0.03, AU.valuer[1] + 0.35), f < FREEZE12 ? smooth((f - 1135) / 5) : 1); card(out, "loupe", 200, 200, (pp) => art.loupeGlass(pp), hr[0], hr[1] + 0.02, hr[2], 0.06, 0.06); }
      arm3d(out, cam, "valuer", vm, vfo, -1, hl, f); arm3d(out, cam, "valuer", vm, vfo, 1, hr, f);
      if (id === 14 && f >= LAMP14) glowAt(out, "lamp", Au(AU.lamp[0] + 0.15, AU.top + 0.1, AU.lamp[2] + 0.2), 0.9, "255,214,140");
      if (id === 14 && f >= GLEAM14 && f < GLEAM14 + 16) sparkle(out, f, GLEAM14, ...Au(AU.sheet[0] + 0.3, AU.top + 0.08, AU.sheet[2] + 0.4), 0.12, 16);
      break;
    }
    case 13: case 16: { // KB Toys, 1999
      if (id === 13) {
        const m = St(STO.rel[0], 0, STO.rel[1]), fo: FrontOpts = { mode: "stand", expr: "whistle", armOff: 2, facing: -1, look: -1 };
        front(out, cam, "relative", ...m, fo, f);
        const chest = chestAt(cam, "relative", m, fo, 0.45, 0.18), shelf = St(STO.shelf_top[0] - 0.08, STO.shelf_top[1] + 0.12, STO.shelf_top[2] - 0.07);
        const k = smooth((f - STACK13[0] - 10) / (STACK13[1] - STACK13[0] - 10)), B = f < STACK13[1] ? lerp3(chest, shelf, k) : shelf;
        P.toy = { p: [B[0] - STORE[0], B[1] - 0.12 - STORE[1], B[2] - STORE[2]] };
        const rest = [restHand(cam, "relative", m, fo, -1), restHand(cam, "relative", m, fo, 1)];
        for (const sd of [-1, 1] as const) arm3d(out, cam, "relative", m, fo, sd, f < STACK13[1] + 4 ? [B[0] + sd * 0.15, B[1], B[2] + 0.05] : lerp3([B[0] + sd * 0.15, B[1], B[2] + 0.05], rest[sd < 0 ? 0 : 1], smooth((f - STACK13[1] - 4) / 8)), f);
      } else {
        P.toy = { p: [STO.shelf_top[0] - 0.08, STO.shelf_top[1], STO.shelf_top[2] - 0.07] };
        STO.kids.forEach(([x, z], i) => { const who: Who = i ? "kid2" : "kid1", m = St(x, 0, z), pt = i === 0 ? smooth((f - POINT16) / 6) : 0;
          const fo: FrontOpts = { mode: "stand", expr: i === 0 ? (f >= POINT16 ? "shock" : "neutral") : f >= POINT16 + 10 ? "grin" : "smile", armOff: i === 0 ? 1 : undefined, look: i ? -1 : 1, headTilt: -0.15 };
          front(out, cam, who, ...m, fo, f, [POINT16]);
          if (i === 0) { const S = shoulderAt(cam, who, m, fo, 1); arm3d(out, cam, who, m, fo, 1, lerp3(restHand(cam, who, m, fo, 1), [S[0] + 0.05, S[1] + 0.32, S[2] - 0.25], pt), f); } });
        const rm = St(STO.rel15[0], 0, STO.rel15[1]), fo: FrontOpts = { mode: "stand", expr: "grin", armOff: 1, facing: 1, look: 1 };
        front(out, cam, "relative", ...rm, fo, f);
        const tap = f >= TAP16 - 8 && f < TAP16 + 10 ? smooth((f - TAP16 + 8) / 6) * (1 - smooth((f - TAP16 - 4) / 6)) : 0;
        arm3d(out, cam, "relative", rm, fo, 1, lerp3(restHand(cam, "relative", rm, fo, 1), St(0.0, 1.55, -3.92), tap), f);
      }
      break;
    }
    case 15: { // the press: cards in the tray (skid after the chop)
      for (let i = 0; i < 9; i++) { const sk = f >= CHOP15 + 3 ? easeOut((f - CHOP15 - 3) / 14) : 0;
        const x = PR.tray[0] - 0.36 + 0.09 * i + (hh(i, 5) - 0.5) * 0.05 + sk * (hh(i, 6) - 0.5) * 0.08, z = PR.tray[2] + (hh(i, 7) - 0.5) * 0.18 + sk * 0.04 * hh(i, 8);
        card(out, `tc|tray${i}`, 260, 360, (pp) => art.tcard(pp, 0 as art.Kind, 10, 10, 250, 350, { img: ["fs_gengar", "fs_zapdos", "fs_moltres", "fs_dragonite", "fs_articuno", "fs_raichu", "fs_lapras", "fs_haunter", "fs_ditto"][i] }),
          ...at(PRESS, x, PR.tray[1] + 0.003 + 0.0006 * i, z), 0.063, 0.088, { flat: true, rot: (hh(i, 9) - 0.5) * 1.2 + sk * 0.3 }); }
      if (f >= CHOP15 && f < CHOP15 + 8) burst(out, f, CHOP15, ...at(PRESS, PR.bed[0], PR.bed[1] + 0.05, PR.blade_z + 0.02), 0.4, 8, "#ffffff");
      break;
    }
    case 17: { // the photo shoot
      const pm = Au(AU.photog[0], 0, AU.photog[1]), fo: FrontOpts = { mode: "stand", expr: "stern", armOff: 2, crouch: 0.2, facing: -1, look: -1 };
      front(out, cam, "photog", ...pm, fo, f);
      const camBody = Au(AU.tripod[0] + 0.08, 1.15, AU.tripod[1]);
      arm3d(out, cam, "photog", pm, fo, -1, camBody, f); arm3d(out, cam, "photog", pm, fo, 1, [camBody[0] + 0.02, camBody[1] + 0.05, camBody[2] + 0.04], f);
      FLASHES.forEach((ff) => AU.soft.forEach(([sx, sz]) => burst(out, f, ff, ...Au(sx, 1.9, sz + 0.1), 0.7, 4, "#ffffff")));
      const vm = Au(AU.valuer_rep[0], 0, AU.valuer_rep[1]), vfo: FrontOpts = { mode: "stand", expr: f >= STAMP17 ? "grin" : "neutral", armOff: 1, facing: -1, look: -1 };
      front(out, cam, "valuer", ...vm, vfo, f, [STAMP17]);
      const hi = Au(AU.report[0] + 0.02, AU.report[1] + 0.12, AU.report[2] + 0.18), lo = Au(AU.report[0] + 0.02, AU.report[1] - 0.04, AU.report[2] + 0.06);
      const k = f < STAMP17 - 2 ? 0 : f < STAMP17 ? (f - STAMP17 + 2) / 2 : 1 - clamp01((f - STAMP17) / 4);
      const H2 = f >= 1898 ? lerp3(hi, lo, k) : restHand(cam, "valuer", vm, vfo, 1);
      arm3d(out, cam, "valuer", vm, vfo, 1, H2, f);
      if (f >= 1898) card(out, "stamp", 200, 220, (pp) => art.rubberStamp(pp), H2[0], H2[1] - 0.03, H2[2] + 0.01, 0.07, 0.08);
      break;
    }
    case 18: case 19: { // the saleroom
      const seats = AU.seats as number[][], who: Who[] = ["bid1", "bid2", "head2", "bid3", "head1", "head3", "owner", "bid2"];
      seats.forEach(([x, z], i) => { const w = who[i], gape = w === "owner" && id === 18 ? 0.6 * smooth((f - GAPE18) / 6) : 0;
        front(out, cam, w, ...Au(x, 0, z), { mode: "sit", chair: 0.9, expr: w === "owner" && (id > 18 || f >= GAPE18) ? "shock" : "neutral", gape }, f, w === "owner" ? [GAPE18] : []); });
      const am = Au(AU.auctioneer[0], 0, AU.auctioneer[1]);
      const g = id === 19 ? 1 - smooth((f - RAISE19[0]) / (RAISE19[1] - RAISE19[0])) : 1;
      front(out, cam, "auctioneer", ...am, { mode: "stand", expr: "stern", prop: ["gavel", q(g, 20)], headTilt: id === 19 && f > RAISE19[1] ? -0.05 : 0 }, f, [RAISE19[1]]);
      break;
    }
    case 20: { // the loft, 2026: the fan
      out.sheet = { p: [0, -50, 0], pose: { a: 0 }, vis: false };
      web(out, 1, [0.25, 3.0, -1.93], 0.38);
      if (f >= DOOR20 + 2) { const y = 0.85 + 0.55 * smooth((f - DOOR20 - 2) / 8);
        front(out, cam, "partner", H.pop[0], y, H.pop[2], { mode: "stand", expr: f >= SQUINT20 + 16 ? "grin" : f >= SQUINT20 ? "stern" : "neutral", facing: 1, look: 1, headTilt: f >= SQUINT20 ? 0.08 : 0 }, f, [SQUINT20]); }
      break;
    }
  }
  return out;
};
