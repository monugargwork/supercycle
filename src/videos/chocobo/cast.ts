// The Golden Chocobo reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, STORE, GARAGE, CON, clamp01, smooth, mark, TOP, TABLE, SLAB_Y, BRICK, TOWER, PLACE8, PLACE9, SLAM1, WHIP1, cageX, caseAt, towerAt, henAt, beamAt, doorB,
  NOD5, SLIDE5, FROWN6, LIFT7, SHAKE9, LOUPE11, SLAB11, TEN11, DOOR13, SIT13, SHAKE14, STEP15, LAY15, LIT16, CONFIRM4, POST4,
} from "./story";
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
export type Stage = { places: Place[]; fx: FxPlace[] };

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
  buyer: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#15131a", shades: true, tie: "#6a1a2a", skin: "#e8b896" } as Outfit,
  seller: { jacket: "#24407a", pants: "#4a4f63", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#d9a47a", tie: "#9a9aa2" } as Outfit,
  dA: { jacket: "#3f9a55", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#5a3b2a", skin: "#c99067" } as Outfit,
  dB: { jacket: "#f2c84a", pants: "#3b5b9a", boots: "#2a201a", hat: "beanie", cap: "#7b5ac9", glasses: true, skin: "#ecd0b6" } as Outfit,
  dC: { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#f5c9a0", build: "stout" } as Outfit,
  keeper: { jacket: "#3f7a4c", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#bdbdc4", glasses: true, skin: "#f2c4a4", buttons: "#f6f2e6" } as Outfit,
  creator: { jacket: "#1d1b22", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#d8322f", skin: "#c99067" } as Outfit,
  w1: { jacket: "#c25a7a", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#c99067" } as Outfit,
  w2: { jacket: "#2aa39a", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#e2453c", skin: "#f5c9a0" } as Outfit,
  w3: { jacket: "#f08a3c", pants: "#3b5b9a", boots: "#4a3426", hat: "hair", hair: "#8a5a34", skin: "#ecd0b6", glasses: true } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { buyer: 2, seller: 3, dA: 4, dB: 5, dC: 6, keeper: 7, creator: 8, w1: 10, w2: 11, w3: 12 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[chocobo] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const St = (x: number, y: number, z: number) => at(STORE, x, y, z);
const Ga = (x: number, y: number, z: number) => at(GARAGE, x, y, z);
const Co = (x: number, y: number, z: number) => at(CON, x, y, z);
const SLAB_H = 0.26;
/** the graded Golden Chocobo: upright facing +z (the window), or its back when the lens is behind it; flat = lying on a counter */
const slabCard = (out: Stage, cam: CamInfo, p: V3, o: { gleam?: number; flash?: number; flat?: boolean; h?: number } = {}) => {
  const h = o.h ?? SLAB_H, gl = o.gleam !== undefined && o.gleam > 0 && o.gleam < 1 ? q(o.gleam, 24) : -1, fl = o.flash ? q(o.flash, 6) : 0;
  if (!o.flat && cam.pos.z < p[2] - 0.02) { card(out, "slabBack", 380, 600, (pp) => art.slabBack(pp), p[0], p[1], p[2] - 0.004, h * 0.633, h, { face: Math.PI }); return; }
  card(out, `slab|${gl}|${fl}`, 380, 600, (pp) => art.slabReal(pp, 380, 600, "chocobo_gold", { gleam: gl, flash: fl }), p[0], p[1], p[2], h * 0.633, h, o.flat ? { flat: true } : { face: 0 });
};
const pulse = (f: number, a: number, b: number) => (f >= a && f < b ? Math.sin((Math.PI * (f - a)) / (b - a)) : 0);
/** a world point to hold something at, eased between keyed points [[frame, point], ...] */
const track = (f: number, keys: [number, V3][]): V3 => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (f < keys[i][0]) return lerp3(keys[i - 1][1], keys[i][1], smooth((f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return keys[keys.length - 1][1];
};

/** the back room: the slab in its cage, the hen, the feathers, the receipt pad (things that sit there in every back-room shot) */
const backRoom = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const cx = cageX(id, f), sl = St(cx, SLAB_Y, TABLE[1]);
  const gleam = id === 2 ? (f - 104) / 16 : id === 3 ? (f - 200) / 26 : id === 17 ? (f - 2095) / 18 : -1;
  const flash = id === 3 && f >= 395 && f < 406 ? 1 - (f - 395) / 11 : 0;
  slabCard(out, cam, sl, { gleam, flash });
  if (id === 1 && f >= WHIP1) glowAt(out, "cage", St(cx, TOP + 0.25, TABLE[1]), 0.9 * Math.min(1, (f - WHIP1) / 4), "255,214,120");
  card(out, "receipt", 200, 260, (p) => art.receiptPad(p), ...St(2.5, TOP + 0.004, -5.82), 0.15, 0.2, { flat: true, rot: 0.15 });
  // the hen on her crate (S17: she hops onto the table, pecks the cage, clucks)
  const h = henAt(id, f), hp = St(h.p[0], h.p[1], h.p[2]);
  const key = `hen|${h.open}|${q(h.tilt, 8)}|${h.peck}|${(f % 97) < 4}`;
  card(out, key, 400, 400, (p) => art.hen(p, { open: h.open, tilt: h.tilt, peck: h.peck, blink: (f % 97) < 4 }), hp[0], hp[1] + 0.19, hp[2], 0.38, 0.38, { rot: 0 });
  // three golden feathers puffed up at the reveal: rise, then flutter down onto the table, where they stay
  const FE: [number, number, number][] = [[-0.08, 0.05, 0.2], [0.07, -0.04, 1.1], [0.12, 0.06, 2.3]];
  FE.forEach(([dx, dz, ph], i) => {
    if (id === 1 && f < WHIP1) return;
    const t = id === 1 ? (f - WHIP1) / FPS : id === 2 ? (f - WHIP1) / FPS : 99;
    const up = Math.min(t, 0.25), y0 = TOP + 0.15 + 1.4 * up - 2.8 * up * up, fall = Math.max(0, t - 0.25) * 0.3, y = Math.max(TOP + 0.006, y0 + 0.17 - fall);
    const sway = y > TOP + 0.01 ? 0.06 * Math.sin(t * 5 + ph) : 0, P = St(B0 + dx + sway + (i - 1) * 0.12, y, TABLE[1] + 0.22 + dz);
    if (y <= TOP + 0.007) card(out, "feather", 120, 300, (p) => art.feather(p), P[0], P[1], P[2], 0.03, 0.075, { flat: true, rot: ph });
    else card(out, "feather", 120, 300, (p) => art.feather(p), P[0], P[1], P[2], 0.03, 0.075, { rot: 0.8 * Math.sin(t * 4 + ph) });
  });
};
const B0 = 2.05;

/** the seller and the buyer at their marks behind the deal table (S01, S05, S09) */
const dealers = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const pS = mark("store", "seller"), pB = mark("store", "buyer");
  // seller: whips the cloth in S01; nods and slides the cage in S05; shakes hands in S09
  const sNod = id === 5 ? 0.12 * pulse(f, 610, 626) : 0;
  const sExpr = id === 1 ? (f >= WHIP1 ? "grin" : "smile") : id === 9 ? "grin" : "smile";
  const foS: FrontOpts = { mode: "stand", expr: sExpr, facing: 1, look: 1, headTilt: sNod, armOff: 1 };
  front(out, cam, "seller", ...pS, foS, f, [WHIP1]);
  const restS = restHand(cam, "seller", pS, foS, 1);
  let hS = restS;
  if (id === 1) hS = track(f, [[WHIP1 - 14, restS], [WHIP1 - 4, St(B0, TOP + 0.62, TABLE[1])], [WHIP1, St(B0, TOP + 0.62, TABLE[1])], [WHIP1 + 6, St(1.62, 1.35, -6.2)], [WHIP1 + 18, restS]]);
  if (id === 5) { const cx = cageX(5, f); hS = track(f, [[SLIDE5[0] - 10, restS], [SLIDE5[0], St(cx - 0.17, TOP + 0.12, TABLE[1])], [SLIDE5[1], St(cx - 0.17, TOP + 0.12, TABLE[1])], [SLIDE5[1] + 8, restS]]); if (f >= SLIDE5[0] && f < SLIDE5[1]) hS = St(cx - 0.18, TOP + 0.12, TABLE[1]); }
  const shake = (f: number) => St(2.42, 1.22 + 0.025 * Math.sin((f - SHAKE9) * 1.1) * (f >= SHAKE9 && f < SHAKE9 + 14 ? 1 : 0), -6.37);
  if (id === 9) hS = track(f, [[SHAKE9 - 12, restS], [SHAKE9 - 2, shake(f)], [1080, shake(f)], [1094, restS]]);
  arm3d(out, cam, "seller", pS, foS, 1, hS, f);
  // buyer: slams the briefcase (S01), grins, shakes hands (S09)
  const k = caseAt(id, f), cr = id === 1 && f < SLAM1 + 6 ? 0.22 : 0;
  const foB: FrontOpts = { mode: "stand", expr: (id === 1 && f < SLAM1 + 4) || id === 5 && f < 626 ? "stern" : "grin", facing: -1, look: -1, crouch: cr, armOff: -1, headTilt: id === 5 ? 0.1 * pulse(f, 626, 640) : 0 };
  front(out, cam, "buyer", ...pB, foB, f, [SLAM1 + 4, 626]);
  const restB = restHand(cam, "buyer", pB, foB, -1), handle = St(2.55, TOP + k.dy + 0.085, -6.285);
  let hB = restB;
  if (id === 1) hB = f < SLAM1 + 3 ? handle : track(f, [[SLAM1 + 3, handle], [SLAM1 + 14, restB]]);
  if (id === 9) hB = track(f, [[SHAKE9 - 12, restB], [SHAKE9 - 2, shake(f)], [1080, shake(f)], [1094, restB]]);
  arm3d(out, cam, "buyer", pB, foB, -1, hB, f);
};
/** the three players behind the play table, phones at their chests (S06-S10) */
const players = (out: Stage, cam: CamInfo, f: number, id: number) => {
  (["dA", "dB", "dC"] as const).forEach((w, i) => {
    const p = mark("store", w), reading = id === 6 && f < FROWN6;
    let expr: FrontOpts["expr"] = reading ? "neutral" : "stern", tilt = reading ? 0.14 : 0, gape: number | undefined;
    if (id === 7 && w === "dA") { expr = f >= 770 ? "nervous" : "stern"; tilt = f >= 770 ? -0.12 : 0; }
    if (id === 9) { expr = f >= 950 ? "shock" : "stern"; gape = f >= 950 ? 0.35 * smooth((f - 950) / 6) : undefined; tilt = f >= 950 ? -0.08 : 0; }
    if (id === 10 && w === "dB") { expr = f >= 1186 ? "dazed" : "stern"; tilt = f >= 1127 ? -0.16 * smooth((f - 1127) / 12) : 0; }
    if (id === 10 && w !== "dB") expr = "nervous";
    const fo: FrontOpts = { mode: "stand", expr, facing: 0, headTilt: tilt, armOff: 2, gape, crouch: id === 7 && w === "dA" ? 0.06 : 0 };
    front(out, cam, w, ...p, fo, f, [FROWN6, 770, 950, 1186]);
    const ch = chestAt(cam, w, p, fo, 0.42, 0.16);
    if (id === 7 && w === "dA") {
      const hold = track(f, [[LIFT7[0], ch], [LIFT7[1], St(0.5, 1.36, -1.78)]]);
      arm3d(out, cam, w, p, fo, 1, hold, f); arm3d(out, cam, w, p, fo, -1, restHand(cam, w, p, fo, -1), f);
      tcardFx(out, "plain", [hold[0], hold[1] + 0.045, hold[2] + 0.01], 0.1, { img: "chocobo_plain", rot: f >= 770 ? 0.12 : 0 });
      return;
    }
    for (const sd of [-1, 1] as const) arm3d(out, cam, w, p, fo, sd, [ch[0] + sd * 0.05, ch[1] - 0.03, ch[2]], f);
    card(out, "phone0", 160, 300, (pp) => art.phoneBack(pp, 0), ch[0], ch[1] + 0.03, ch[2] + 0.01, 0.07, 0.13);
    void i;
  });
};
/** the shopkeeper stacking bricks onto the tower (S08, S09): carton -> top of the stack, one trip per placement */
const keeperBricks = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const p = mark("store", "keeper"), t = towerAt(id, f), topY = TOP + t.n * BRICK[1];
  const trips = id === 8 ? PLACE8.map((x) => [x, 1] as [number, number]) : PLACE9;
  const cartonP = St(2.4, 0.95, -0.95), stackP = (n: number) => St(TOWER[0] + 0.04, TOP + n * BRICK[1] + 0.035, TOWER[1] + 0.02);
  let hand: V3 | null = null, carry = 0;
  let n0 = id === 8 ? 0 : 5;
  for (const [t0, c] of trips) {
    const go = id === 8 ? 14 : 8;
    if (f >= t0 - go && f < t0) { hand = lerp3(cartonP, stackP(n0 + c), smooth((f - t0 + go) / go)); carry = c; break; }
    if (f >= t0 && f < t0 + 4) { hand = stackP(n0 + c); break; }
    n0 += c;
  }
  const low = clamp01((1.25 - (hand ? hand[1] : topY)) / 0.5);
  const fo: FrontOpts = { mode: "stand", expr: id === 9 ? "pained" : "neutral", facing: -1, look: -1, crouch: hand ? 0.38 * low : 0, armOff: -1 };
  front(out, cam, "keeper", ...p, fo, f);
  const H = arm3d(out, cam, "keeper", p, fo, -1, hand ?? restHand(cam, "keeper", p, fo, -1), f);
  if (carry) card(out, `brick${carry}`, 256, 64 * carry, (pp) => { for (let i = 0; i < carry; i++) { pp.g.save(); pp.g.translate(0, i * 64); art.brickSide(pp); pp.g.restore(); } }, H[0], H[1] - 0.012 * carry, H[2] + 0.02, BRICK[0], BRICK[1] * carry);
  if (t.landing > 0 && f >= t.landing && f < t.landing + 5) burst(out, f, t.landing, ...St(TOWER[0], topY, TOWER[1] + 0.05), 0.18, 5, "#ffffff");
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place;
  if (place === "store") backRoom(out, cam, f, id);
  switch (id) {
    case 1: case 2: case 3: case 5: dealers(out, cam, f, id); break;
    case 4: { // his POV: the phone in his hand, the post; the buyer across the table
      const pB = mark("store", "buyer"), foB: FrontOpts = { mode: "stand", expr: "grin", facing: -1, look: -1 };
      front(out, cam, "buyer", ...pB, foB, f);
      const ph = St(1.86, 1.13, -6.2), on = smooth((f - POST4) / 8), under = smooth((f - 548) / 8), confirm = clamp01((f - CONFIRM4) / 8), likes = Math.max(0, Math.round((f - 490) * 137));
      seg3d(out, cam, St(1.74, 0.9, -6.4), St(1.86, 1.06, -6.21), 0.018, "#1d1a22");
      card(out, `post|${q(on, 12)}|${q(under, 12)}|${q(confirm, 12)}|${Math.round(likes / 97)}`, 300, 620, (p) => art.socialPost(p, { on, under, confirm, likes }), ph[0], ph[1], ph[2], 0.075, 0.155);
      break;
    }
    case 6: case 7: case 10: dealers(out, cam, f, 6); players(out, cam, f, id); break;
    case 8: players(out, cam, f, id); keeperBricks(out, cam, f, id); break;
    case 9: players(out, cam, f, id); keeperBricks(out, cam, f, id); dealers(out, cam, f, id); break;
    case 11: case 12: { // the counter: the raw card and the slab; the loupe; the map above
      const p = mark("store", "keeper11"), loupe = id === 11 && f >= LOUPE11[0] - 10 && f < SLAB11[1] + 14;
      const fo: FrontOpts = { mode: "stand", expr: id === 12 || f >= TEN11 ? "smile" : "neutral", facing: 0, look: loupe ? 0 : undefined, headTilt: loupe ? 0.16 : 0, armOff: 1, crouch: loupe ? 0.12 : 0 };
      front(out, cam, "keeper", ...p, fo, f, [TEN11]);
      const rest = restHand(cam, "keeper", p, fo, 1);
      const hand = id === 11 ? track(f, [[LOUPE11[0] - 10, rest], [LOUPE11[0], St(-2.73, 1.02, -3.1)], [LOUPE11[1], St(-2.72, 1.02, -3.08)], [SLAB11[0] + 8, St(-2.28, 1.0, -3.18)], [SLAB11[1], St(-2.28, 1.0, -3.18)], [SLAB11[1] + 14, rest]]) : rest;
      const H = arm3d(out, cam, "keeper", p, fo, 1, hand, f);
      card(out, "raw", 300, 420, (pp) => art.pennySleeve(pp), ...St(-2.75, 0.957, -3.1), 0.066, 0.092, { flat: true, rot: 0.06 });
      slabCard(out, cam, St(-2.28, 0.959, -3.1), { flat: true, flash: id === 11 && f >= TEN11 && f < TEN11 + 12 ? 1 - (f - TEN11) / 12 : 0, gleam: id === 11 ? (f - 1340) / 20 : -1 });
      if (loupe) card(out, "loupe", 300, 300, (pp) => { pp.ell(150, 150, 128, 128, "rgba(220,240,255,0.18)", 0); pp.ell(150, 150, 128, 128, null, 22); pp.ell(150, 150, 118, 118, null, 0); pp.g.strokeStyle = "#c9a24a"; pp.g.lineWidth = 14; pp.g.beginPath(); pp.g.arc(150, 150, 124, 0, 7); pp.g.stroke(); pp.ell(110, 105, 40, 18, "rgba(255,255,255,0.55)", 0, 0, 360, -30); }, H[0], H[1] - 0.02, H[2], 0.05, 0.05, { flat: true, soft: true });
      if (id === 11) glowAt(out, "lamp", St(-2.6, 0.97, -3.12), 0.6, "255,226,160");
      break;
    }
    case 13: { // the garage: he opens car B's door, then sits on the plastic-wrapped seat
      const th = doorB(f), edge = Ga(1.8 + 1.05 * Math.sin(th), 0.8, 0.95 - 1.05 * Math.cos(th));
      if (f < SIT13[0] - 16) {
        const u = clamp01((f - DOOR13[0]) / (DOOR13[1] - DOOR13[0] + 2)), p = Ga(2.15 + 0.55 * u, 0, -0.3 - 0.35 * u);
        const fo: FrontOpts = { mode: "stand", expr: "smile", facing: -1, look: -1, armOff: -1 };
        front(out, cam, "keeper", ...p, fo, f);
        arm3d(out, cam, "keeper", p, fo, -1, f >= DOOR13[0] - 8 && f < DOOR13[1] + 2 ? edge : restHand(cam, "keeper", p, fo, -1), f);
      } else {
        const u = smooth((f - SIT13[0] + 16) / 16), p = lerp3(Ga(2.7, 0, -0.65), mark("garage", "keeper_side"), u);
        if (u < 1) side(out, cam, "keeper", ...p, -0.3, 1.27, { mode: "march", phase: ((f / FPS) * 1.1) % 1, stride: 0.6, expr: "smile" }, f);
        else {
          const fo: FrontOpts = { mode: "stand", expr: f >= 1661 ? "grin" : "smile", facing: -1, look: -1, armOff: -1 };
          front(out, cam, "keeper", ...p, fo, f, [1661]);
          arm3d(out, cam, "keeper", p, fo, -1, f >= 1652 ? Ga(1.95, 0.85, 0.32) : restHand(cam, "keeper", p, fo, -1), f);
        }
        if (f >= 1652 && f < 1680) sparkle(out, f, 1652, ...Ga(1.5, 0.62, 0.2), 0.22, 18);
      }
      break;
    }
    case 14: case 15: { // MagicCon: the creator (REC light), the seller, the handshake; the balance
      const rec = Math.floor(f / 15) % 2 === 0;
      const pS = mark("con", "seller");
      const foS: FrontOpts = { mode: "stand", expr: "smile", facing: -1, look: -1, armOff: -1, headTilt: id === 14 && f > 1800 ? 0.06 * Math.sin(f * 0.2) : 0 };
      front(out, cam, "seller", ...pS, foS, f);
      const hs = Co(0, 1.05 + (f >= SHAKE14 && f < SHAKE14 + 14 ? 0.025 * Math.sin((f - SHAKE14) * 1.1) : 0), 0.06);
      const shaking = id === 14 && f >= SHAKE14 - 10 && f < 1800;
      arm3d(out, cam, "seller", pS, foS, -1, shaking ? hs : restHand(cam, "seller", pS, foS, -1), f);
      for (const [w, m] of [["w1", "a1"], ["w2", "a2"], ["w3", "a3"]] as const) front(out, cam, w, ...mark("con", m), { mode: "stand", expr: "smile", facing: 0 }, f);
      if (id === 14 || f < STEP15[0]) {
        const pC = mark("con", "creator"), foC: FrontOpts = { mode: "stand", expr: "grin", facing: 1, look: 1, armOff: 2, headTilt: f > 1800 ? 0.06 * Math.sin(f * 0.2 + 1.5) : 0 };
        front(out, cam, "creator", ...pC, foC, f);
        arm3d(out, cam, "creator", pC, foC, 1, shaking ? hs : restHand(cam, "creator", pC, foC, 1), f);
        const S = shoulderAt(cam, "creator", pC, foC, -1), camH: V3 = [S[0] - 0.22, S[1] + 0.16, S[2] + 0.12];
        arm3d(out, cam, "creator", pC, foC, -1, camH, f);
        card(out, `vlog${rec}`, 160, 300, (p) => art.vlogCam(p, rec), camH[0], camH[1] + 0.05, camH[2], 0.08, 0.15);
      } else if (f < STEP15[1]) {
        const u = smooth((f - STEP15[0]) / (STEP15[1] - STEP15[0])), p = lerp3(mark("con", "creator"), mark("con", "creator15"), u);
        side(out, cam, "creator", ...p, 0.3, -0.72, { mode: "march", phase: ((f / FPS) * 1.2) % 1, stride: 0.5, expr: "neutral" }, f);
      } else {
        const p = mark("con", "creator15"), be = beamAt(15, f), pan = Co(0.25 - 0.25 * Math.cos(be), TOP + 0.37 - 0.25 * Math.sin(be) - 0.23, -1.05);
        const fo: FrontOpts = { mode: "stand", expr: f >= 1916 ? "smile" : "neutral", facing: 1, look: 1, armOff: 1, crouch: 0.12 };
        front(out, cam, "creator", ...p, fo, f, [1916]);
        const rest = restHand(cam, "creator", p, fo, 1), onPan: V3 = [pan[0], pan[1] + 0.04, pan[2]];
        const hand = track(f, [[LAY15[0], holdHand(cam, "creator", p, fo, 1)], [LAY15[1], onPan], [LAY15[1] + 2, onPan], [LAY15[1] + 14, rest]]);
        arm3d(out, cam, "creator", p, fo, 1, f < LAY15[1] + 2 ? hand : track(f, [[LAY15[1] + 2, onPan], [LAY15[1] + 14, rest]]), f);
        const cp = f < LAY15[1] ? hand : onPan;
        card(out, `vlog${rec}`, 160, 300, (pp) => art.vlogCam(pp, rec), cp[0], cp[1] + 0.035, cp[2], 0.045, 0.085);
      }
      break;
    }
    case 16: case 17: { // later: the buyer alone with his cage; the phone face up; S17 the store pressed against the glass
      const pb = mark("store", "buyer_seat");
      front(out, cam, "buyer", ...pb, { mode: "sit", chair: 0.88, expr: "neutral", facing: -1, look: -1 }, f);
      card(out, `phoneFlat${f >= LIT16 ? 1 : 0}`, 300, 620, (p) => art.phoneFlat(p, f >= LIT16 ? 1 : 0), ...St(2.6, TOP + 0.006, -5.8), 0.075, 0.155, { flat: true, rot: -0.2 });
      if (f >= LIT16 && f < LIT16 + 10) glowAt(out, "phone", St(2.6, TOP + 0.03, -5.8), 0.25 * (1 - (f - LIT16) / 10), "200,230,255");
      if (id === 17) {
        for (const [w, m, e] of [["w1", "w1", "dazed"], ["w2", "w2", "shock"], ["w3", "w3", "stern"], ["dA", "dA17", "stern"], ["dB", "dB17", "dazed"], ["dC", "dC17", "nervous"], ["keeper", "keeper17", "smile"]] as const) {
          const p = mark("store", m), x = p[0];
          front(out, cam, w, ...p, { mode: "stand", expr: e, facing: x < 2.3 ? 1 : -1, look: x < 2.3 ? 1 : -1, headTilt: 0.06 }, f);
        }
      }
      break;
    }
  }
  return out;
};
