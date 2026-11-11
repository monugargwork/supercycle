// The Mudkip Art Academy reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "./toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, AUCTION, FACTORY, ROOM, SHOP, LAWN, TABLE, clamp01, smooth, easeOut, pop, mark, obj, hop, colA, colB, lotA, beamSin, villaAir,
  SLAM, LAUGH, LUNGE, STAMPS, DRAW0, DRAW1, WIN, PUSH5, LIFT6, HUG6, RIP, GAVELS, WINGS, PLACE12, BID_LAST, HOLD14, STRIKE14, SET15, DROP15, HIT15, LAND15,
  SLAB16, COVER16, LOUPE16, DEAL0, CASES, TEN, SWEEP0, PLACE18, JAWS, SLIP, FLOOR19,
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
/** moving set pieces the cast drives: the attendant's cushion, the block of 100 cards, the loupe
 */
export type Stage = { places: Place[]; fx: FxPlace[]; cushion?: { p: V3 } | null; block?: { p: V3; ry: number; rx: number } | null; loupe?: V3 | null };

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
  buyer: { jacket: "#3a3d46", pants: "#2a2c33", boots: "#15131a", hat: "cap", cap: "#8d949c", moustache: "#5a3b2a", skin: "#f2c4a4", build: "stout", buttons: "#c9c3b4" } as Outfit,
  dA: { jacket: "#3f9a55", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#5a3b2a", skin: "#c99067" } as Outfit,
  dB: { jacket: "#f2c84a", pants: "#3b5b9a", boots: "#2a201a", hat: "beanie", cap: "#7b5ac9", glasses: true, skin: "#ecd0b6" } as Outfit,
  dC: { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#f5c9a0", build: "stout" } as Outfit,
  daisuke: { jacket: "#24407a", pants: "#3b3f52", boots: "#f4f1ea", hat: "hair", hair: "#1d1a22", glasses: true, skin: "#f5c9a0" } as Outfit,
  keeper: { jacket: "#c23a32", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#9a9aa2", moustache: "#9a9aa2", skin: "#f2c4a4", build: "stout", buttons: "#f6f2e6" } as Outfit,
  kid: { jacket: "#f08a3c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "cap", cap: "#2f7fbf", skin: "#f5c9a0", build: "kid" } as Outfit,
  auctioneer: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#9a9aa2", tie: "#c23a32", skin: "#f2c4a4", build: "stout" } as Outfit,
  attendant: { jacket: "#2f5446", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#2a201a", tie: "#c9a24a", skin: "#c99067" } as Outfit,
  b1: { jacket: "#c25a7a", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#c99067" } as Outfit,
  b2: { jacket: "#2aa39a", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#e2453c", skin: "#f5c9a0" } as Outfit,
  b3: { jacket: "#f08a3c", pants: "#3b5b9a", boots: "#4a3426", hat: "hair", hair: "#8a5a34", skin: "#ecd0b6", glasses: true } as Outfit,
  b4: { jacket: "#3b4f9e", pants: "#1f2b4a", boots: "#15131a", hat: "hair", hair: "#ecebe8", skin: "#f2c4a4", build: "stout", tie: "#f2c84a" } as Outfit,
  b5: { jacket: "#6b3f8f", pants: "#3b3f52", boots: "#2a201a", hat: "beanie", cap: "#2f8a4c", skin: "#c99067" } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { buyer: 1, dA: 3, dB: 4, dC: 5, daisuke: 2, keeper: 6, kid: 7, auctioneer: 9, attendant: 8, b1: 10, b2: 11, b3: 12, b4: 13, b5: 14 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[mudkip] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Au = (x: number, y: number, z: number) => at(AUCTION, x, y, z);
const Fa = (x: number, y: number, z: number) => at(FACTORY, x, y, z);
const Ro = (x: number, y: number, z: number) => at(ROOM, x, y, z);
const Sh = (x: number, y: number, z: number) => at(SHOP, x, y, z);
const Ta = (x: number, y: number, z: number) => at(TABLE, x, y, z);
const STAGE_Y = 0.5;
const SLAB_H = 0.3, SLAB_W = 0.19;
/** a graded slab with the real card in it: upright facing +z by default (face), or lying flat, or a billboard */
const slabFx = (out: Stage, img: string, p: V3, o: { h?: number; flat?: boolean; rot?: number; bill?: boolean; gleam?: number; flash?: number } = {}) => {
  const h = o.h ?? SLAB_H, gl = o.gleam !== undefined && o.gleam > 0 && o.gleam < 1 ? q(o.gleam, 24) : -1, fl = o.flash ? q(o.flash, 4) : 0;
  card(out, `slab|${img}|${gl}|${fl}`, 380, 600, (pp) => art.slabReal(pp, 380, 600, img, { gleam: gl, flash: fl }), p[0], p[1], p[2], h * 0.633, h,
    o.flat ? { flat: true, rot: o.rot ?? 0 } : o.bill ? { rot: o.rot ?? 0 } : { face: 0, rot: o.rot ?? 0 });
};
const flatCard = (out: Stage, img: string, p: V3, h: number, rot = 0) =>
  card(out, `tcf|${img}`, 260, 360, (pp) => (img === "blank" ? art.blankCard(pp, 6, 6, 254, 354) : art.tcard(pp, 0, 6, 6, 254, 354, { img })), p[0], p[1], p[2], h * 0.716, h, { flat: true, rot });
const armOf = (who: Who) => { const J = frontPts(C[who], { seed: IDX[who] + 1 }); return { w: J.armW * SU, col: J.armCol, knob: J.hand * 2 * SU }; };

// ---- S01: the money sack, its bundles and bills ----
const SACK_UP: V3 = Au(3.15, 1.75, 1.96), SACK_DN: V3 = Au(3.15, 1.19, 2.72);
/** the sack: held up behind his head, then swung over and down onto the desk (4 f), squashed by the hit */
export const sackAt = (f: number) => {
  const k = f < 25 ? 0 : f >= SLAM ? 1 : ((f - 25) / (SLAM - 25)) ** 1.6, p = lerp3(SACK_UP, SACK_DN, k);
  p[1] += 0.35 * Math.sin(Math.PI * k) * (1 - k) + (f < 25 ? 0.008 * Math.sin(f * 1.9) : 0);
  return { p, sq: f < SLAM ? 1 : 0.7 + 0.15 * smooth((f - SLAM) / 6) };
};
const BUNDLE_REST: [number, number, number][] = [[2.25, 1.0125, 2.8], [2.5, 1.0125, 2.65], [2.72, 1.0125, 2.88], [2.85, 1.0125, 2.62], [3.45, 1.0125, 2.92], [3.5, 1.0125, 2.58], [3.96, 1.0125, 2.9],
  [3.98, 1.0125, 2.62], [2.62, 1.0375, 2.74], [2.6, 0.0125, 3.35], [3.0, 0.0125, 3.6], [3.4, 0.0125, 3.3], [3.8, 0.0125, 3.55], [2.3, 0.0125, 3.5]];
/** cash bundle i: out of the sack's mouth on an arc to its resting place, one small bounce, then it stays */
export const bundleAt = (i: number, f: number) => {
  const r = BUNDLE_REST[i], R: V3 = Au(r[0], r[1], r[2]), S: V3 = [SACK_DN[0], SACK_DN[1] + 0.2, SACK_DN[2]], T = (i < 9 ? 9 : 14) + ((i * 5) % 6), t = f - SLAM - (i % 3);
  if (t < 0) return { p: S, ry: 0, rx: 0, vis: false };
  const u = Math.min(1, t / T), H = 0.45 + 0.07 * (i % 4), p = lerp3(S, R, u);
  p[1] += 4 * H * u * (1 - u) + (t >= T && t < T + 5 ? 0.035 * Math.sin(((t - T) / 5) * Math.PI) : 0);
  return { p, ry: i * 1.3 + 5 * (1 - u), rx: 6 * (1 - u) * (i % 2 ? 1 : -1), vis: true };
};
// ---- S03: the indexing belt and the press ----
const CYC0 = STAMPS[0] - 14;
export const beltS = (f: number) => { const k = Math.floor((f - CYC0) / 15); return 0.75 * (k + smooth((f - CYC0 - 15 * k) / 9)); };
/** height of the press head's bottom face */
export const pressY = (f: number) => { for (const c of STAMPS) { const t = f - c; if (t >= -2 && t < 0) return 0.93 + 0.97 * (-t / 2) ** 2; if (t >= 0 && t <= 4) return 0.93 + 0.97 * smooth(t / 4); } return 1.9; };
// ---- S04/S05: the stylus on the lower screen ----
const LOW: V3 = [obj("room", "console").p[0], 0.7832, obj("room", "console").p[2]];
const onScreen = (sx: number, sy: number): V3 => { const u = (10 + 500 * sx) / 520, v = (34 + 324 * sy) / 392; return [LOW[0] - (u - 0.5) * 0.13, LOW[1], LOW[2] + (0.5 - v) * 0.098]; };
export const drawU = (f: number) => clamp01((f - DRAW0) / (DRAW1 - DRAW0));
/** the stylus: where its tip is, which way it leans (unit vector tip -> top), where the hand holds it; null = put away */
export const stylusAt = (id: number, f: number): { tip: V3; dir: V3; hand: V3 } | null => {
  const dir: V3 = [-0.26, 0.86, -0.44];
  let tip: V3;
  if (id === 4) { const [sx, sy] = art.scribble(0.03); tip = onScreen(sx + 0.05 * Math.sin(f * 1.05), sy + 0.04 * Math.sin(f * 1.7)); if (f >= 421 && f < 433) tip[1] += 0.03; }
  else if (id === 5) {
    if (f >= DRAW1 + 12) return null;
    const [sx, sy] = art.scribble(drawU(f)); tip = onScreen(sx, sy);
    if (f < DRAW0) tip[1] += 0.02 * (1 - smooth((f - (DRAW0 - 4)) / 4));
    if (f >= DRAW1) { const k = smooth((f - DRAW1) / 11); tip = [tip[0] - 0.34 * k, tip[1] + 0.07 * Math.sin(Math.PI * Math.min(1, k * 1.2)) + 0.03 * k, tip[2] - 0.3 * k]; }
  } else return null;
  return { tip, dir, hand: add3(tip, dir, 0.11) };
};
// ---- S15: the balance ----
export const balance = (f: number) => {
  const P = obj("lawn", "beam").p, N0 = obj("lawn", "pan_near").p, dx = N0[0] - P[0], dz = N0[2] - P[2], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, s = beamSin(f), c = Math.sqrt(1 - s * s);
  const nearEnd: V3 = [P[0] + ux * 2.5 * c, P[1] + 2.5 * s, P[2] + uz * 2.5 * c], farEnd: V3 = [P[0] - ux * 7.5 * c, P[1] - 7.5 * s, P[2] - uz * 7.5 * c];
  return { yaw: Math.atan2(-uz, ux), tilt: Math.asin(s), nearEnd, farEnd, near: [nearEnd[0], nearEnd[1] - 4.175, nearEnd[2]] as V3, far: [farEnd[0], farEnd[1] - 4.175, farEnd[2]] as V3 };
};
// ---- S17: the spread of 100 ----
const cell = (i: number): V3 => Ta(-0.315 + 0.07 * (i % 10), 0.004 + 0.0006 * i, -0.337 + 0.06 * Math.floor(i / 10));
const CASE_AT = [21, 46, 63]; // rows 3, 5, 7 / columns 2, 7, 4 (counted from 1)

/** the three collectors (S02 laugh, S09 shrug, S19 jaws) */
const doubters = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const pA = mark("auction", "dA"), pB0 = mark("auction", "dB"), pC = mark("auction", "dC");
  const lunge = id === 2 ? smooth((f - LUNGE) / 8) : 0, pB: V3 = [pB0[0], 0, pB0[2] + 0.6 * lunge];
  const laughing = id === 2 && f >= LAUGH && f < LUNGE - 4, bob = laughing ? [0, 0.03, 0.06, 0.03][Math.floor((f - LAUGH) / 2) % 4] : 0;
  let fa: FrontOpts, fb: FrontOpts, fc: FrontOpts;
  if (id === 2) {
    fa = { mode: "stand", expr: f < LAUGH ? "smile" : "laugh", facing: 1, crouch: bob, headTilt: f >= 202 && f < 232 ? -0.12 : 0 };
    fb = { mode: "stand", expr: f < LAUGH ? "smile" : f < LUNGE ? "laugh" : "grin", facing: 0, crouch: bob * (1 - lunge) + 0.12 * Math.sin(Math.PI * lunge), armOff: -1 };
    fc = { mode: "stand", expr: f < LAUGH ? "smile" : "laugh", facing: -1, crouch: laughing ? [0.03, 0.06, 0.03, 0][Math.floor((f - LAUGH) / 2) % 4] : 0, armOff: f >= 166 && f < 236 ? 1 : undefined };
  } else if (id === 9) {
    const sh = f < 1042;
    fa = { mode: "stand", expr: "neutral", facing: 1, armOff: sh ? 2 : undefined, headTilt: sh ? 0.08 : 0 };
    fb = { mode: "stand", expr: "smile", facing: 0, crouch: f >= 1021 && f < 1045 ? [0, 0.04, 0.04, 0, 0, 0][Math.floor((f - 1021) / 2) % 6] : 0, armOff: -1 };
    fc = { mode: "stand", expr: f >= 1045 ? "smile_closed" : "neutral", facing: -1, headTilt: f >= 1045 ? 0.1 : 0 };
  } else {
    fa = { mode: "stand", expr: f < JAWS[0] ? "nervous" : "shock", facing: 1 };
    fb = { mode: "stand", expr: f < JAWS[1] ? "nervous" : "shock", facing: 0, armOff: f < SLIP + 8 ? -1 : undefined };
    fc = { mode: "stand", expr: f < JAWS[2] ? "nervous" : "shock", facing: -1 };
  }
  front(out, cam, "dA", ...pA, fa, f, id === 2 ? [LAUGH] : id === 19 ? [JAWS[0]] : []);
  front(out, cam, "dB", ...pB, fb, f, id === 2 ? [LAUGH, LUNGE] : id === 19 ? [JAWS[1]] : []);
  front(out, cam, "dC", ...pC, fc, f, id === 2 ? [LAUGH] : id === 19 ? [JAWS[2]] : [1045]);
  if (id === 2 && fc.armOff) { const S = shoulderAt(cam, "dC", pC, fc, 1), k = smooth((f - 166) / 6) * (1 - smooth((f - 228) / 8)); arm3d(out, cam, "dC", pC, fc, 1, lerp3(restHand(cam, "dC", pC, fc, 1), [S[0] + 0.4, S[1] + 0.03, S[2] + 0.2], k), f); }
  if (id === 9 && fa.armOff) for (const sd of [-1, 1] as const) { const S = shoulderAt(cam, "dA", pA, fa, sd), k = smooth((f - 1005) / 6) * (1 - smooth((f - 1034) / 8)); arm3d(out, cam, "dA", pA, fa, sd, lerp3(restHand(cam, "dA", pA, fa, sd), [S[0] + sd * 0.36, S[1] + 0.16, S[2] + 0.06], k), f); }
  // the Charizard: at dB's side, thrust at the lens in S02, slipping to the carpet in S19
  const rest = holdHand(cam, "dB", pB, fb, -1, 0.1);
  if (id !== 19 || f < SLIP + 8) {
    const out2 = chestAt(cam, "dB", pB, fb, 0.3, 0.42), hand = arm3d(out, cam, "dB", pB, fb, -1, lerp3(rest, [out2[0], out2[1], out2[2]], lunge), f);
    if (id !== 19 || f < SLIP) tcardFx(out, "zard", [hand[0] - cam.fwd.x * 0.03, hand[1] + 0.07 + 0.08 * lunge, hand[2] - cam.fwd.z * 0.03], 0.14 + 0.16 * lunge, { holo: lunge > 0.6, rot: 0.12 * (1 - lunge), img: "zard" });
    if (id === 2) sparkle(out, f, LUNGE + 6, hand[0], hand[1] + 0.12, hand[2] + 0.06, 0.5, 14);
  }
  if (id === 19) {
    [["dA", pA, fa], ["dB", pB, fb], ["dC", pC, fc]].forEach(([w, p, fo], i) => jaw(out, cam, w as Who, p as V3, fo as FrontOpts, smooth((f - JAWS[i]) / 5)));
    if (f >= SLIP) { // the card flutters down: slow fall, side to side, lands flat and stays
      const t = f - SLIP, T = FLOOR19 - SLIP, u = Math.min(1, t / T), y0 = rest[1] + 0.07, land: V3 = Au(-1.4, 0.014, 1.2);
      if (u < 1) tcardFx(out, "zardFall", [rest[0] + (land[0] - rest[0]) * u + 0.1 * Math.sin(t * 0.55), y0 + (land[1] - y0) * (0.35 * u + 0.65 * u * u), rest[2] + (land[2] - rest[2]) * u], 0.14, { rot: 0.7 * Math.sin(t * 0.45), img: "zard" });
      else flatCard(out, "zard", land, 0.14, 0.5);
    }
  }
};

/** the auctioneer, the lot on column A, the gavel hits (every shot on the stage) */
const lot = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const pa = mark("auction", "auctioneer", STAGE_Y);
  let g = 1;
  for (const G of GAVELS) {
    const up0 = G === STRIKE14 ? HOLD14 : G - 6;
    if (f >= up0 && f < G) g = 1 - smooth((f - up0) / 4);
    else if (f >= G && f < G + 6) g = 1 - 0.3 * Math.sin((Math.PI * (f - G)) / 6);
  }
  const hit = GAVELS.filter((G) => f >= G).pop() ?? -999, since = f - hit;
  const expr = (id === 10 && f >= WINGS && f < 1165) ? "shock" : since >= 0 && since < 90 && SHOTS[id - 1].a <= hit ? "grin" : id === 12 ? "neutral" : "stern";
  front(out, cam, "auctioneer", ...pa, { mode: "stand", expr, facing: 0, prop: ["gavel", q(g, 20)] }, f, GAVELS);
  for (const G of GAVELS) burst(out, f, G, ...Au(-0.03, 1.54, -4.3), G === STRIKE14 ? 0.75 : 0.42, 8);
  const L = lotA(f), ca = obj("auction", "columnA").p, hp = GAVELS.reduce((s, G) => s + hop(f, G, G === STRIKE14 ? 0.9 : G === 990 ? 0 : 0.6), 0);
  if (L.on) slabFx(out, L.img, [ca[0], colA(f) + 0.02 + SLAB_H / 2 + hp, ca[2]], { gleam: id === 8 ? (f - 921) / 18 : id === 11 ? (f - 1244) / 18 : id === 12 ? (f - PLACE12) / 14 : -1, flash: id === 8 && f >= 925 && f < 948 ? 1 : 0 });
  if (id === 14) sparkle(out, f, STRIKE14 + 1, ca[0], colA(f) + 0.2, ca[2] + 0.05, 0.7, 16);
};
/** the attendant: carries a slab on the red cushion and stands it on a column */
const attendant = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const m12 = mark("auction", "attendant12", STAGE_Y), m18 = mark("auction", "attendant18", STAGE_Y), T = id === 12 ? PLACE12 : PLACE18, t0 = T - 13;
  const img = id === 12 ? "mudkip_aa" : "pika_trophy", colP = obj("auction", id === 12 ? "columnA" : "columnB").p, colTop = id === 12 ? colA(f) : colB(f);
  if (id === 12 && f < 1414) { // walks in along the back of the stage, cushion out in front
    const u = smooth((f - 1380) / 34), x = m12[0] + 0.7 * (1 - u);
    side(out, cam, "attendant", x, STAGE_Y, m12[2], -1, 0, { mode: f < 1380 ? "stand" : "march", phase: walkPhase(f, 0.9), stride: 0.5, reach: 1, expr: "nervous" }, f);
    const cp: V3 = [x - 0.36, STAGE_Y + 1.02, m12[2]];
    out.cushion = { p: cp }; slabFx(out, img, [cp[0], cp[1] + 0.03 + SLAB_H / 2, cp[2]], {});
    return;
  }
  const at = id === 12 ? m12 : m18, fo: FrontOpts = { mode: "stand", expr: id === 12 ? (f < T ? "nervous" : "relief") : "neutral", facing: -1, look: -1, armOff: 2 };
  front(out, cam, "attendant", ...at, fo, f, [T]);
  const c0 = chestAt(cam, "attendant", at, fo, 0.25, 0.2), cp: V3 = [c0[0] + 0.03, c0[1], c0[2]];
  out.cushion = { p: cp };
  arm3d(out, cam, "attendant", at, fo, 1, [cp[0] + 0.12, cp[1] - 0.02, cp[2]], f);
  const S0: V3 = [cp[0], cp[1] + 0.03 + SLAB_H / 2, cp[2]], S1: V3 = [colP[0], colTop + 0.02 + SLAB_H / 2, colP[2]], k = smooth((f - t0) / 13), back = smooth((f - T - 2) / 9);
  const kx = k ** 0.55, ky = k ** 2, sp: V3 = [S0[0] + (S1[0] - S0[0]) * kx, S0[1] + (S1[1] - S0[1]) * ky, S0[2] + (S1[2] - S0[2]) * kx]; // sideways first, then up: it never crosses his face
  const grip: V3 = [sp[0] + SLAB_W / 2, sp[1], sp[2] + 0.02], idle: V3 = [cp[0] - 0.12, cp[1] - 0.02, cp[2]];
  arm3d(out, cam, "attendant", at, fo, -1, f < t0 ? idle : f < T ? lerp3(idle, grip, Math.min(1, k * 3)) : lerp3(grip, idle, back), f);
  if (f < T) slabFx(out, img, sp, { bill: f < t0, gleam: id === 18 ? (f - 2054) / 20 : -1 });
  if (id === 18) sparkle(out, f, 2058, S0[0] + 0.1, S0[1] + 0.17, S0[2] + 0.05, 0.14, 16);
  burst(out, f, T, S1[0], S1[1] - SLAB_H / 2, S1[2] + 0.05, 0.25, 6, "#efe6cf");
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  switch (id) {
    case 1: { // the hook: the sack held up behind his head, slammed onto the cash desk; bundles and bills fly; the slab hops
      const at = mark("auction", "buyer"), sk = sackAt(f).p, fo: FrontOpts = { mode: "stand", expr: f < 25 ? "stern" : "grin", facing: 0, armOff: 2 };
      front(out, cam, "buyer", ...at, fo, f, [25, SLAM]);
      const grip = (sd: number): V3 => f < SLAM ? [sk[0] + sd * 0.19, sk[1] - 0.15, sk[2] + 0.03] : [sk[0] + sd * 0.13, sk[1] + 0.12, sk[2] - 0.14];
      for (const sd of [-1, 1] as const) arm3d(out, cam, "buyer", at, fo, sd, grip(sd), f);
      burst(out, f, SLAM, SACK_DN[0], 1.05, SACK_DN[2] + 0.1, 1.1, 9, "#efe6cf");
      for (let i = 0; i < 8 && f >= SLAM; i++) { // loose bills: thrown up, then a slow fluttering fall; they lie where they land
        const t = (f - SLAM) / 30, dx = 0.9 * Math.sin(i * 2.4), dz = 0.35 + 0.5 * Math.cos(i * 1.7), e = 1 - Math.exp(-3 * t);
        const x = SACK_DN[0] + dx * e, z = SACK_DN[2] + dz * e, onDesk = x > AUCTION[0] + 1.95 && x < AUCTION[0] + 4.05 && z < 3.0, rest = onDesk ? 1.004 : 0.004;
        const y = SACK_DN[1] + 0.25 + (1.1 + 0.1 * (i % 3)) * (1 - Math.exp(-5 * t)) - 1.0 * t;
        if (y > rest + 0.01) card(out, "bill", 240, 110, (p) => art.bill(p), x + 0.1 * Math.sin(6 * t + i), y, z, 0.2, 0.092, { rot: 3 * t + i });
        else card(out, "bill", 240, 110, (p) => art.bill(p), x, rest + 0.0004 * i, z, 0.2, 0.092, { flat: true, rot: i * 1.1 });
      }
      const hs = obj("auction", "hook_slab").p;
      slabFx(out, "mudkip_aa", [hs[0], 1.02 + SLAB_H / 2 + hop(f, SLAM, 0.75), hs[2]], { gleam: (f - 66) / 16 });
      sparkle(out, f, 71, hs[0] + 0.06, hs[1] + 0.12, hs[2] + 0.05, 0.4, 14);
      break;
    }
    case 2: case 9: case 19: doubters(out, cam, f, id); break;
    case 3: { // the factory: blanks ride in, the press prints each one, real cards ride out toward the lens
      const s = beltS(f), k = Math.floor((f - CYC0) / 15);
      for (let j = Math.ceil((-6.6 - s) / 0.75); j <= Math.floor((4.4 - s) / 0.75); j++) {
        const x = s + 0.75 * j, printed = x > 0.02 || (Math.abs(x) <= 0.02 && f >= CYC0 + 15 * k + 14);
        flatCard(out, printed ? art.TCG.press[(((-j) % 8) + 8) % 8] : "blank", Fa(x, 0.906, 0), 0.42, Math.PI / 2);
      }
      for (const c of STAMPS) if (f >= c && f < c + 10) { const u = q((f - c) / 10, 20); card(out, `puff${u}`, 400, 400, (p) => fxPuff(p, u), ...Fa(0.1, 1.05, 0.34), 0.5, 0.5, { soft: false }); }
      break;
    }
    case 4: { // his room: drawing on the handheld, a look up to think, back down
      const at = mark("room", "daisuke"), think = f >= 421 && f < 433;
      const fo: FrontOpts = { mode: "sit", chair: 1.0, expr: f < 421 ? "lick" : think ? "neutral" : "smile", facing: 0, headTilt: think ? -0.05 : 0.12, armOff: -1 };
      front(out, cam, "daisuke", ...at, fo, f, [421, 433]);
      const st = stylusAt(4, f)!; arm3d(out, cam, "daisuke", at, fo, -1, st.hand, f);
      break;
    }
    case 5: { // over the console: the stylus scrubs, the drawing appears (the screens are drawn in world.ts); WINNER and confetti
      const A = armOf("daisuke"), st = stylusAt(5, f);
      if (st) seg3d(out, cam, Ro(-0.3, 0.98, -0.74), st.hand, A.w, A.col, A.knob);
      if (f >= WIN && f < WIN + 22) { const u = q((f - WIN) / 22, 22); card(out, `confetti${u}`, 500, 500, (p) => art.confetti(p, u), ...Ro(0, 0.9, -0.3), 0.42, 0.42, { flat: true, rot: Math.PI }); }
      break;
    }
    case 6: { // the block of 100 in its parcel; he lifts it out, turns it to us and hugs it
      const at = mark("room", "daisuke"), reach = smooth((f - (LIFT6 - 6)) / 10), k = smooth((f - (LIFT6 + 6)) / 14);
      const fo: FrontOpts = { mode: "sit", chair: 1.0, expr: f < LIFT6 - 6 ? "relief_open" : f < HUG6 + 6 ? "grin" : "smile_closed", facing: 0, headTilt: f < LIFT6 - 6 ? 0.1 : 0, armOff: reach > 0 ? 2 : undefined };
      front(out, cam, "daisuke", ...at, fo, f, [LIFT6 - 6, HUG6 + 6]);
      const R0 = obj("room", "stack100").p, C6 = chestAt(cam, "daisuke", at, fo, 0.5, 0.17), p = lerp3(R0, C6, k); p[1] += 0.1 * Math.sin(Math.PI * k);
      out.block = { p, ry: 0, rx: 1.15 * smooth((f - (LIFT6 + 10)) / 10) };
      if (reach > 0) for (const sd of [-1, 1] as const) { const side3: V3 = [p[0] + sd * 0.075, p[1] + 0.01 - 0.03 * k, p[2] - 0.05 * (1 - k)]; arm3d(out, cam, "daisuke", at, fo, sd, lerp3(restHand(cam, "daisuke", at, fo, sd), side3, reach), f); }
      break;
    }
    case 7: { // the shop: the keeper shakes his head; the kid rips a pack open and finds ordinary cards
      const pk = mark("shop", "keeper"), pd = mark("shop", "kid"), shake = f >= 786 && f < 816 ? Math.round(3 * Math.sin(((f - 786) * Math.PI) / 5)) * 0.04 : 0;
      const fk: FrontOpts = { mode: "stand", expr: "stern", facing: 0, headTilt: shake, armOff: 2 };
      front(out, cam, "keeper", ...pk, fk, f);
      for (const sd of [-1, 1] as const) { const S = shoulderAt(cam, "keeper", pk, fk, sd), o = smooth((f - 782) / 6); arm3d(out, cam, "keeper", pk, fk, sd, lerp3(restHand(cam, "keeper", pk, fk, sd), [S[0] + sd * 0.3, S[1] - 0.12, S[2] + 0.28], o), f); }
      ["chespin", "fennekin", "froakie"].forEach((n, i) => card(out, `tcf|${n}`, 260, 360, (pp) => art.tcard(pp, 0, 6, 6, 254, 354, { img: n }), ...Sh(0.02 + 0.3 * i, 1.03, 0.88), 0.107, 0.15, { face: 0, tilt: -0.2 }));
      card(out, "tornPile", 700, 700, (p) => art.tornPile(p), ...Sh(-0.95, 0.012, 1.85), 0.62, 0.62, { flat: true, rot: 0.3 });
      const fd: FrontOpts = { mode: "stand", expr: f < RIP + 8 ? "grin" : "dazed", facing: 1, look: 0, armOff: 2 };
      front(out, cam, "kid", ...pd, fd, f, [RIP + 8]);
      const P = chestAt(cam, "kid", pd, fd, 0.35, 0.2), torn = f >= RIP, jerk = f >= RIP - 2 && f < RIP + 6 ? Math.sin(((f - RIP + 2) / 8) * Math.PI) : 0;
      arm3d(out, cam, "kid", pd, fd, -1, [P[0] - 0.05, P[1] - 0.03, P[2]], f);
      arm3d(out, cam, "kid", pd, fd, 1, [P[0] + 0.05 + 0.1 * jerk, P[1] + 0.02 + 0.14 * jerk, P[2]], f);
      card(out, `pack${torn}`, 180, 300, (p) => art.pack(p, torn), P[0], P[1] + 0.07, P[2] + 0.01, 0.126, 0.21);
      if (torn) { // the strip and five cards on arcs under gravity; they land flat on the tiles and stay
        const fly = (key: string, v: V3, t: number, draw: (flat: boolean, p: V3, rot: number) => void) => {
          const T = (v[1] + Math.sqrt(v[1] * v[1] + 2 * 9.8 * (P[1] + 0.15))) / 9.8, tt = Math.min(t, T);
          draw(t >= T, [P[0] + v[0] * tt, Math.max(0.012, P[1] + 0.16 + v[1] * tt - 4.9 * tt * tt), P[2] + v[2] * tt], t >= T ? key.length : tt * 9);
        };
        const t = (f - RIP) / FPS;
        fly("strip", [0.9, 2.0, 0.15], t, (flat, p, rot) => card(out, "strip", 180, 60, (pp) => art.packStrip(pp), ...p, 0.126, 0.042, flat ? { flat: true, rot: 0.7 } : { rot }));
        art.TCG.packs.slice(3, 8).forEach((n, i) => fly(n, [(i - 2) * 0.33, 1.7 + 0.25 * (i % 2), 0.3 + 0.12 * i], Math.max(0, t - 0.03 * i), (flat, p, rot) => (flat ? flatCard(out, n, [p[0], 0.012 + 0.001 * i, p[2]], 0.13, i * 1.3) : tcardFx(out, `spill${i}`, p, 0.13, { rot: rot + i, img: n }))));
      }
      break;
    }
    case 8: case 10: case 11: case 14: lot(out, cam, f, id); break;
    case 12: lot(out, cam, f, id); attendant(out, cam, f, id); break;
    case 13: { // seventy-three bids: paddles fly up across the room, the buyer's last
      const who: [Who, string, number, number[]][] = [["b1", "b1", 17, [1449, 1471]], ["b2", "b2", 42, [1455, 1476]], ["buyer", "bid", 8, [BID_LAST]], ["b4", "b4", 73, [1460, 1479]], ["b5", "b5", 31, [1465]], ["b3", "b3", 56, [1452, 1469]]];
      for (const [w, mk, n, ts] of who) {
        const at = mark("auction", mk), last = w === "buyer";
        const up = Math.max(...ts.map((t) => smooth((f - t) / 5) * (last ? 1 : 1 - smooth((f - t - 11) / 5))));
        const fo: FrontOpts = { mode: "stand", expr: w === "b2" || w === "b5" ? "grin" : "stern", facing: 0, armOff: 1 };
        front(out, cam, w, ...at, fo, f);
        const S = shoulderAt(cam, w, at, fo, 1), h = arm3d(out, cam, w, at, fo, 1, lerp3(holdHand(cam, w, at, fo, 1, 0.06), [S[0] - 0.06, S[1] + 0.4, S[2] - 0.05], up), f);
        card(out, `paddle${n}`, 300, 480, (p) => art.paddle(p, n), h[0], h[1] + 0.13, h[2] - 0.02, 0.2, 0.32);
      }
      break;
    }
    case 15: { // the balance: he stands the slab on the near pan; it drops, the villa flies up
      const at = mark("lawn", "dA"), B = balance(f);
      const fo: FrontOpts = { mode: "stand", expr: f < 1600 ? "dazed" : f < HIT15 ? "neutral" : "shock", facing: -1, look: -1, armOff: -1 };
      front(out, cam, "dA", ...at, fo, f, [1600, HIT15]);
      const onPan: V3 = [B.near[0] + 0.1, B.near[1] + 0.03 + SLAB_H / 2 + hop(f, HIT15, 1.05), B.near[2]];
      const hold = holdHand(cam, "dA", at, fo, -1, 0.1), carry: V3 = [hold[0], hold[1] + 0.1, hold[2]], k = smooth((f - 1604) / 18);
      const sp: V3 = f < SET15 ? lerp3(carry, onPan, k) : onPan; if (f < SET15) sp[1] += 0.08 * Math.sin(Math.PI * k);
      const grip: V3 = [sp[0] + SLAB_W / 2, sp[1], sp[2] + 0.02];
      arm3d(out, cam, "dA", at, fo, -1, f < SET15 ? grip : lerp3(grip, restHand(cam, "dA", at, fo, -1), smooth((f - SET15) / 8)), f);
      slabFx(out, "mudkip_aa", sp, { bill: true });
      burst(out, f, HIT15, B.near[0], 0.25, B.near[2] + 0.3, 1.6, 10, "#e9f2c8");
      if (f >= LAND15 && f < LAND15 + 16) { const u = q((f - LAND15) / 16, 16), F = balance(f).far; card(out, `splash${u}`, 800, 800, (p) => fxSplash(p, u), F[0] - 0.4, F[1] + 0.75, F[2] + 1.1, 1.7, 1.7); }
      jaw(out, cam, "dA", at, fo, smooth((f - LAND15) / 5));
      break;
    }
    case 16: { // the table: the slab drops flat; a kraft card covers the picture; a loupe sits on the grade
      const A = armOf("dA"), C0 = obj("table", "slab").p, t = f - 1675;
      const y = f < SLAB16 ? 0.25 * (1 - (t / 7) ** 2) : f < SLAB16 + 5 ? 0.01 * Math.sin(((f - SLAB16) / 5) * Math.PI) : 0;
      slabFx(out, "mudkip_aa", [C0[0], 0.2 + 0.008 + y, C0[2]], { flat: true, flash: f >= LOUPE16 ? 1 : 0, gleam: (f - 1684) / 16 });
      burst(out, f, SLAB16, C0[0], C0[1] + 0.03, C0[2], 0.5, 7, "#efe6cf");
      const E: V3 = Ta(0.36, 0.32, 0.5), cx = C0[0] + (art.SLAB_ART.cx - 0.5) * SLAB_W, cz = C0[2] + (art.SLAB_ART.cy - 0.5) * SLAB_H;
      const kc = easeOut((f - 1708) / 14), cvx = cx + 0.45 * (1 - kc);
      if (f >= 1706) card(out, "kraft", 320, 190, (p) => { p.g.fillStyle = "#c9a06a"; p.g.beginPath(); p.g.roundRect(4, 4, 312, 182, 10); p.g.fill(); p.g.strokeStyle = "#8a6a3a"; p.g.lineWidth = 5; p.g.stroke(); p.g.strokeStyle = "rgba(120,90,50,0.35)"; p.g.lineWidth = 2; for (let i = 0; i < 6; i++) { p.g.beginPath(); p.g.moveTo(20 + i * 50, 16); p.g.lineTo(34 + i * 50, 174); p.g.stroke(); } },
        cvx, 0.2 + 0.0175, cz, 0.16, 0.095, { flat: true, rot: 0.03 });
      const gx = C0[0] + (art.SLAB_GRADE.cx - 0.5) * SLAB_W, gz = C0[2] + (art.SLAB_GRADE.cy - 0.5) * SLAB_H, kl = easeOut((f - 1779) / 19), lp: V3 = [gx + 0.45 * (1 - kl), 0.2 + 0.034, gz + 0.1 * (1 - kl)];
      if (f >= 1779) out.loupe = lp;
      const away = Ta(0.5, 0.1, 0.2);
      const hand: V3 | null = f >= 1706 && f < 1724 ? [cvx + 0.085, 0.2 + 0.03, cz + 0.01] : f >= 1724 && f < 1738 ? lerp3([cx + 0.085, 0.23, cz + 0.01], away, smooth((f - 1724) / 14)) : f >= 1779 ? [lp[0] + 0.115, lp[1] + 0.01, lp[2]] : null;
      if (hand) seg3d(out, cam, E, hand, A.w, A.col, A.knob);
      break;
    }
    case 17: { // 100 dealt out; three cases drop; a gust takes the 97 loose cards, the three slabs stay
      const landed = CASES.map((L) => f >= L);
      for (let i = 0; i < 100; i++) {
        const ci = CASE_AT.indexOf(i);
        if (ci >= 0 && landed[ci]) continue; // it is inside its case now
        const T = cell(i), t0 = DEAL0 + i / 3;
        if (f < t0) continue;
        const k = easeOut((f - t0) / 8), from: V3 = Ta((i % 10 - 4.5) * 0.03, 0.06, 0.95), p = lerp3(from, T, k);
        let rot = 0.06 * (1 - k) * (i % 2 ? 1 : -1);
        if (f >= SWEEP0) { // the gust front runs up the table in 8 f; a loose card then accelerates away, lifting and spinning
          const tg = (f - SWEEP0 - ((TABLE[2] + 0.203 - T[2]) / 0.54) * 8) / FPS;
          if (tg > 0) { const d = 3 * tg * tg, dx = 1.3 * (T[0] - TABLE[0]) + 0.12 * Math.sin(i * 2.7); p[0] += dx * d * 1.4; p[2] -= d; p[1] += Math.min(0.05, 0.6 * tg) + 0.01 * Math.sin(i); rot += tg * (5 + (i % 4)) * (i % 2 ? 1 : -1); if (d > 1.3) continue; }
        }
        flatCard(out, "mudkip_aa", p, 0.0866, rot);
      }
      CASES.forEach((L, ci) => {
        const T = cell(CASE_AT[ci]), t = f - (L - 10);
        if (t < 0) return;
        const y = f < L ? 0.5 * (1 - (t / 10) ** 2) : f < L + 4 ? 0.004 * Math.sin(((f - L) / 4) * Math.PI) : 0;
        slabFx(out, "mudkip_aa", [T[0], 0.2 + 0.072 + y, T[2]], { h: 0.135, flat: true, flash: f >= TEN && f < TEN + 26 ? 1 : 0, gleam: f >= 1966 ? (f - 1972 - ci * 3) / 14 : -1 });
        burst(out, f, L, T[0], 0.29, T[2], 0.2, 6, "#efe6cf");
      });
      if (f >= SWEEP0 && f < SWEEP0 + 16) { const u = q((f - SWEEP0) / 16, 16); card(out, `gust${u}`, 400, 600, (p) => art.gust(p, u), ...Ta(0, 0.3, -0.05), 0.8, 1.2, { flat: true, soft: true }); }
      break;
    }
    case 18: { // the trophy Pikachu: column B rises, the slab on its cushion, onto the column; the price, the gavel; the podium
      lot(out, cam, f, id); attendant(out, cam, f, id);
      const cb = obj("auction", "columnB").p;
      if (f >= PLACE18) slabFx(out, "pika_trophy", [cb[0], colB(f) + 0.02 + SLAB_H / 2 + hop(f, 2159, 0.5), cb[2]], { gleam: (f - 2183) / 16 });
      if (f >= 1996 && f < 2022 && (f - 1996) % 6 < 3) card(out, `puffB${(f - 1996) % 6}`, 400, 400, (p) => fxPuff(p, ((f - 1996) % 6) / 6), cb[0], STAGE_Y + 0.05, cb[2] + 0.2, 0.3, 0.3);
      burst(out, f, 2181, obj("auction", "columnA").p[0], colA(f) - 0.3, cb[2] + 0.2, 0.3, 8);
      break;
    }
  }
  return out;
};
