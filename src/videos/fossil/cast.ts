// The Monaco auction reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, SALE, CELLAR, KITCH, clamp01, smooth, easeOut, pop, mark, obj, hop,
  GAVEL1, WALK1, THUMP1, PADDLES4, LIFT5, CARRY5, PLACE5, DOOR5, CROWN5, SPOT5, LEAP7, CHAIR7, PUSH8, HUG8, SPOT9, GLEAM9,
  WALK11, BOTTLE11, PULL13, POP13, POUR13, OPEN_ORDER, OPEN_AT, JAB16, REACH17, SNATCH17, WALK17, SHELF17, WALK18, BOW18, POINT18,
  SEATS, MINH_SEAT, SCOOT, KIT, BOXS,
} from "./story";
import * as art2 from "./art2";
import { boxCubby, bottleCubby, PULLED, STAGE_Y, TABLE_Y, PLINTH_Y } from "./sets";
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
const C = {
  auctioneer: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#9a9aa2", tie: "#c23a32", skin: "#f2c4a4", build: "stout" } as Outfit,
  porter: { jacket: "#f4f1ea", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#2a201a", tie: "#1d1b22", skin: "#e8b896", buttons: "#c9a24a" } as Outfit,
  waiter: { jacket: "#7a2a3a", pants: "#26242b", boots: "#15131a", hat: "hair", hair: "#15131a", tie: "#1d1b22", skin: "#f5c9a0", buttons: "#f6f2e6" } as Outfit,
  minh: { jacket: "#24407a", pants: "#24407a", boots: "#15131a", hat: "hair", hair: "#5a3b2a", moustache: "#4a3020", skin: "#e8b896", tie: "#c9a24a" } as Outfit,
  kid: { jacket: "#3f7fc9", pants: "#3b3f52", boots: "#f4f1ea", hat: "cap", cap: "#e2453c", skin: "#e8b896", build: "kid" } as Outfit,
  mom: { jacket: "#3f9a55", pants: "#3f9a55", boots: "#5a3b2a", hat: "hair", hair: "#2a201a", dress: "#3f9a55", skin: "#ecd0b6" } as Outfit,
  momOld: { jacket: "#3f9a55", pants: "#3f9a55", boots: "#5a3b2a", hat: "hair", hair: "#d9d6d0", dress: "#3f9a55", skin: "#ecd0b6", glasses: true } as Outfit,
  g0: { jacket: "#2a2c33", pants: "#2a2c33", boots: "#15131a", hat: "hair", hair: "#ecebe8", skin: "#f2c4a4", tie: "#7a1f2a", build: "stout" } as Outfit,
  g1: { jacket: "#1f2b4a", pants: "#1f2b4a", boots: "#15131a", hat: "hair", hair: "#2a201a", skin: "#c99067", tie: "#3f7fc9" } as Outfit,
  g2: { jacket: "#3a2f2a", pants: "#3a2f2a", boots: "#15131a", hat: "hair", hair: "#8a5a34", skin: "#f5c9a0", tie: "#c9a24a", glasses: true } as Outfit,
  g4: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#9a9aa2", skin: "#ecd0b6", tie: "#c23a32" } as Outfit,
  g5: { jacket: "#2f3e5c", pants: "#2f3e5c", boots: "#15131a", hat: "hair", hair: "#e8c46a", skin: "#f5c9a0", tie: "#2f8a4c" } as Outfit,
  g6: { jacket: "#3b3f52", pants: "#3b3f52", boots: "#15131a", hat: "hair", hair: "#15131a", skin: "#c99067", tie: "#e2453c", build: "stout" } as Outfit,
};
type Who = keyof typeof C;
const GENTS: Who[] = ["g0", "g1", "g2", "minh", "g4", "g5", "g6", "g1", "g5", "g0", "g2", "g4", "g4", "g6", "g0", "g2", "g5", "g1"];
const IDX: Record<Who, number> = { auctioneer: 9, porter: 2, waiter: 6, minh: 3, kid: 4, mom: 5, momOld: 5, g0: 10, g1: 11, g2: 12, g4: 13, g5: 14, g6: 15 };

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
const Sa = (x: number, y: number, z: number) => at(SALE, x, y, z);
const Ce = (x: number, y: number, z: number) => at(CELLAR, x, y, z);
const Ki = (x: number, y: number, z: number) => at(KITCH, x, y, z);
const toLocal = (o: V3, p: V3): number[] => [p[0] - o[0], p[1] - o[1], p[2] - o[2]];
const [BW, BH] = BOXS;
const SLAB_H = 0.3;
const PLAN_OBJ = (id: string) => obj("saleroom", id).p;
/** a graded slab with the real card in it: upright facing +z by default (face), or a billboard */
const slabFx = (out: Stage, img: string, p: V3, o: { h?: number; bill?: boolean; gleam?: number; yaw?: number } = {}) => {
  const h = o.h ?? SLAB_H, gl = o.gleam !== undefined && o.gleam > 0 && o.gleam < 1 ? q(o.gleam, 24) : -1;
  card(out, `slab|${img}|${gl}`, 380, 600, (pp) => art.slabReal(pp, 380, 600, img, { gleam: gl }), p[0], p[1], p[2], h * 0.633, h, o.bill ? {} : { face: o.yaw ?? 0 });
};
const spot = (out: Stage, p: V3, h = 2.4) => card(out, "spot", 300, 600, (pp) => art.spotCone(pp), p[0], p[1], p[2], h * 0.45, h, { soft: true });
const tagFx = (out: Stage, s: string, p: V3, w: number, rot = 0) => card(out, `ptag|${s}`, 300, 140, (pp) => art2.priceTag(pp, s), p[0], p[1], p[2], w, w * 0.467, { rot });
const SEAT_CHAIR = 0.9; // seat 0.46 m in head-heights

/** the auctioneer at the rostrum; the gavel strikes at GAVEL1 in the hook */
const auctioneer = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const pa = mark("saleroom", "auctioneer", STAGE_Y);
  let g = 1;
  if (id === 1) { if (f < GAVEL1) g = 0; else if (f < GAVEL1 + 6) g = 1 - 0.3 * Math.sin((Math.PI * (f - GAVEL1)) / 6); }
  const expr = id === 1 && f >= GAVEL1 && f < 120 ? "grin" : id === 4 && f > PADDLES4 ? "smile" : "stern";
  front(out, cam, "auctioneer", ...pa, { mode: "stand", expr, facing: 1, look: 1, prop: ["gavel", q(g, 20)] }, f, [GAVEL1]);
  if (id === 1) burst(out, f, GAVEL1, ...Sa(-1.7, 1.48, -4.6), 0.4, 7);
};
/** the 70 small lots on the two tiers (real scans in mini slabs, facing the room = -x) */
const LOT_IMGS = ["ds_metagross_star", "ds_latias", "ds_mewtwo", "pika_rain", "zard_base", "blastoise", "venusaur", "ds_latias", "ds_mewtwo", "ds_metagross_star"];
const lots70 = (out: Stage) => {
  for (let i = 0; i < 70; i++) {
    const tier = i < 35 ? 0 : 1, j = i % 35, z = -0.8 + (j + 0.5) * (6.4 / 35);
    const x = tier ? 5.5 : 5.15, y = (tier ? 0.98 : 0.8) + 0.075;
    slabFx(out, LOT_IMGS[(i * 7) % LOT_IMGS.length], Sa(x, y, z), { h: 0.14, yaw: -Math.PI / 2 });
  }
};
/** the seated gentlemen with their paddles (Minh's seat handled by the caller when he jumps up) */
const gentlemen = (out: Stage, cam: CamInfo, f: number, id: number, skip = -1) => {
  SEATS.forEach(([x, z], i) => {
    if (i === skip) return;
    const who = GENTS[i], P = Sa(x, 0, z), up = id === 4 ? smooth((f - PADDLES4 - (i % 3)) / 3) : 0;
    const turn = id === 7 && Math.abs(i - MINH_SEAT) === 1 ? (i < MINH_SEAT ? 1 : -1) : 0;
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: id === 7 && turn ? "shock" : id === 4 && f > PADDLES4 + 10 && i % 5 === 1 ? "grin" : "stern", facing: turn as -1 | 0 | 1, look: turn, armOff: 1 };
    front(out, cam, who, ...P, fo, f, id === 7 && turn ? [LEAP7 + 2] : []);
    const S = shoulderAt(cam, who, P, fo, 1), lap = holdHand(cam, who, P, fo, 1, 0.1);
    const hand: V3 = lerp3(lap, [S[0] + 0.05, S[1] + 0.42, S[2]], up);
    const H = arm3d(out, cam, who, P, fo, 1, hand, f);
    card(out, `paddle${(i * 13 + 7) % 90}`, 300, 480, (pp) => art.paddle(pp, (i * 13 + 7) % 90), H[0], H[1] + 0.06 + 0.04 * up, H[2] + 0.02, 0.14, 0.22);
  });
};
/** where the hero box is (set-local), before/after the scenes that move it */
const BOXT: V3 = [0.25, TABLE_Y, -4.55], VITB: V3 = [1.4, PLINTH_Y, -4.6], CROWN_PED: V3 = [0.9, 1.45, -4.62], CROWN_TOP: V3 = [1.4, PLINTH_Y + 0.4 + 0.012, -4.6];

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place, P = out.props;
  // ---- saleroom defaults (the quay shots see in through the windows) ----
  if (place === "saleroom" || place === "quay") {
    P.hero = { p: id > 5 || (id === 5 && f >= PLACE5) ? VITB : BOXT };
    P.crown = { p: id > 5 ? CROWN_TOP : CROWN_PED };
    P.chair = { p: [SEATS[MINH_SEAT][0], 0, SEATS[MINH_SEAT][1] + 0.22], rx: id > 7 ? Math.PI / 2 : 0 };
    P.yacht = { p: [PLAN_OBJ("yacht")[0], TABLE_Y, PLAN_OBJ("yacht")[2]], rz: id === 1 ? 0.07 * Math.sin((f - GAVEL1) * 0.5) * Math.exp(-(f - GAVEL1) / 18) * (f >= GAVEL1 ? 1 : 0) : 0 };
    const hp = id === 1 ? hop(f, THUMP1, 0.25) : 0;
    P.diamond = { p: [PLAN_OBJ("diamond")[0], TABLE_Y + hp, PLAN_OBJ("diamond")[2]] }; P.watch = { p: [PLAN_OBJ("watch")[0], TABLE_Y + hop(f, THUMP1 + 1, 0.2) * (id === 1 ? 1 : 0), PLAN_OBJ("watch")[2]] };
    auctioneer(out, cam, f, id);
    slabFx(out, "pika_poncho_ray", Sa(2.4, PLINTH_Y + 0.03 + SLAB_H / 2, -4.6), { gleam: id === 9 ? (f - GLEAM9) / 18 : -1 });
    if (id > 5 || (id === 5 && f >= SPOT5)) spot(out, Sa(1.4, 2.9, -4.6));
    if (id > 9 || (id === 9 && f >= SPOT9)) spot(out, Sa(2.4, 2.9, -4.6));
    if (id <= 4 || id >= 9) lots70(out);
    if (id >= 3 && id !== 7 && id <= 11) gentlemen(out, cam, f, id);
    if (id >= 10) SCOOT.forEach(([x, z], i) => tagFx(out, "€1,900", Sa(x + 0.27, 1.0, z - 0.58), 0.13, 0.15 * Math.sin(f * 0.18 + i) * Math.exp(-Math.max(0, f - 1462 - 4 * i) / 30)));
  }
  switch (id) {
    case 1: { // the porter carries the box in behind the table and thumps it down
      const m = mark("saleroom", "porter", STAGE_Y), start = Sa(1.8, STAGE_Y, -4.9);
      if (f < WALK1[1]) {
        const u = clamp01((f - WALK1[0]) / (WALK1[1] - WALK1[0])), x = start[0] + (m[0] - start[0]) * u;
        if (f >= WALK1[0] - 40) {
          side(out, cam, "porter", x, STAGE_Y, m[2], -1, 0, { mode: f < WALK1[0] ? "stand" : "march", phase: walkPhase(f, 1.0), stride: 0.55, reach: 1, expr: "smile" }, f);
          P.hero = { p: toLocal(SALE, [x - 0.3, STAGE_Y + 1.05, m[2] + 0.05]) };
        } else P.hero = { p: BOXT, vis: false };
      } else {
        const cr = 0.35 * smooth((f - WALK1[1]) / 10), fo: FrontOpts = { mode: "stand", expr: f >= THUMP1 ? "grin" : "smile", facing: 0, armOff: 2, crouch: cr };
        front(out, cam, "porter", ...m, fo, f, [THUMP1]);
        const carry: V3 = Sa(m[0] - 0.05, STAGE_Y + 1.05, m[2] + 0.2), down: V3 = Sa(BOXT[0], BOXT[1], BOXT[2]);
        const k = f < 240 ? 0 : f < THUMP1 ? ((f - 240) / (THUMP1 - 240)) ** 2 : 1, B = lerp3(carry, down, k);
        P.hero = { p: toLocal(SALE, B) };
        for (const sd of [-1, 1] as const) arm3d(out, cam, "porter", m, fo, sd, [B[0] + sd * 0.1, B[1] + 0.14, B[2]], f);
        if (f >= THUMP1 && f < THUMP1 + 10) { const u = q((f - THUMP1) / 10, 10); card(out, `puff${u}`, 400, 400, (pp) => fxPuff(pp, u), down[0], down[1] + 0.03, down[2] + 0.08, 0.3, 0.3); }
        if (f >= 80 && f < 94) sparkle(out, f, 80, ...Sa(-0.45, TABLE_Y + 0.1, -4.4), 0.12, 14);
      }
      break;
    }
    case 2: case 3: break;
    case 4: break;
    case 5: { // lift, carry, place, shut the door, then the crown
      const m0 = mark("saleroom", "porter", STAGE_Y), mv = mark("saleroom", "porter_v", STAGE_Y);
      const walking = f >= CARRY5[0] && f < CARRY5[1];
      const u = clamp01((f - CARRY5[0]) / (CARRY5[1] - CARRY5[0])), pos: V3 = lerp3(m0, mv, u);
      if (walking) {
        side(out, cam, "porter", ...pos, mv[0] - m0[0], mv[2] - m0[2], { mode: "march", phase: walkPhase(f, 1.0), stride: 0.5, reach: 1, expr: "neutral" }, f);
        P.hero = { p: toLocal(SALE, [pos[0] + 0.3, STAGE_Y + 1.05, pos[2] + 0.05]) };
      } else {
        const here = f < CARRY5[0] ? m0 : mv, cr = f < CARRY5[0] ? 0.35 * (1 - smooth((f - LIFT5) / 10)) : f >= 890 && f < CROWN5 + 4 ? 0.15 : 0;
        const fo: FrontOpts = { mode: "stand", expr: f >= CROWN5 ? "grin" : "neutral", facing: f < CARRY5[0] ? 0 : 1, look: f < CARRY5[0] ? 0 : 1, armOff: 2, crouch: cr };
        front(out, cam, "porter", ...here, fo, f, [CARRY5[1], CROWN5]);
        const rest = [restHand(cam, "porter", here, fo, -1), restHand(cam, "porter", here, fo, 1)];
        if (f < CARRY5[0]) { // lift from the table to the chest
          const B = lerp3(Sa(...BOXT), Sa(m0[0] - 0.05, STAGE_Y + 1.05, m0[2] + 0.2), smooth((f - LIFT5) / 12)); P.hero = { p: toLocal(SALE, B) };
          for (const sd of [-1, 1] as const) arm3d(out, cam, "porter", here, fo, sd, [B[0] + sd * 0.1, B[1] + 0.14, B[2]], f);
        } else if (f < PLACE5 + 6) { // into the vitrine
          const B = lerp3(Sa(mv[0] + 0.15, STAGE_Y + 1.15, mv[2] - 0.05), Sa(...VITB), smooth((f - CARRY5[1]) / (PLACE5 - CARRY5[1]))); P.hero = { p: toLocal(SALE, B) };
          for (const sd of [-1, 1] as const) arm3d(out, cam, "porter", here, fo, sd, [B[0] + sd * 0.1, B[1] + 0.14, B[2] + 0.02], f);
        } else if (f < DOOR5 + 8) { // swing the door shut with the right hand
          const k = smooth((f - DOOR5 + 8) / 8), a = -1.9 * (1 - k), hx = 1.24 + 0.3 * Math.cos(a), hz = -4.48 - 0.3 * Math.sin(a);
          arm3d(out, cam, "porter", here, fo, 1, Sa(hx, 1.5, hz + 0.02), f); arm3d(out, cam, "porter", here, fo, -1, rest[0], f);
        } else if (f >= 880 && f < CROWN5 + 10) { // crown: pedestal -> vitrine top
          const C0 = Sa(...CROWN_PED), C1 = Sa(...CROWN_TOP), mid: V3 = [(C0[0] + C1[0]) / 2, C1[1] + 0.12, (C0[2] + C1[2]) / 2];
          const k = clamp01((f - 895) / (CROWN5 - 895)), Cp = f < 895 ? C0 : k < 0.5 ? lerp3(C0, mid, smooth(k * 2)) : lerp3(mid, C1, smooth(k * 2 - 1));
          if (f >= 895) P.crown = { p: toLocal(SALE, f >= CROWN5 ? C1 : Cp) };
          const tgt: V3 = f < 895 ? lerp3(rest[1], [C0[0], C0[1] + 0.04, C0[2]], smooth((f - 880) / 12)) : f < CROWN5 + 2 ? [Cp[0], Cp[1] + 0.04, Cp[2]] : lerp3([C1[0], C1[1] + 0.04, C1[2]], rest[1], smooth((f - CROWN5 - 2) / 8));
          arm3d(out, cam, "porter", here, fo, 1, tgt, f); arm3d(out, cam, "porter", here, fo, -1, rest[0], f);
        } else for (const sd of [-1, 1] as const) arm3d(out, cam, "porter", here, fo, sd, rest[sd < 0 ? 0 : 1], f);
      }
      if (id === 5 && f >= CROWN5) P.crown = { p: CROWN_TOP };
      if (f >= SPOT5 && f < SPOT5 + 14) sparkle(out, f, SPOT5, ...Sa(1.52, 1.82, -4.55), 0.14, 14);
      break;
    }
    case 6: break;
    case 7: { // Minh leaps up; his chair tips back
      gentlemen(out, cam, f, id, MINH_SEAT);
      const [x, z] = SEATS[MINH_SEAT], Pm = Sa(x, 0, z), up = smooth((f - LEAP7) / 4);
      const fo: FrontOpts = up < 0.5 ? { mode: "sit", chair: SEAT_CHAIR, expr: "nervous", armOff: 2 } : { mode: "stand", expr: "shock", gape: 0.7 * smooth((f - LEAP7 - 2) / 5), armOff: 2, look: 0 };
      front(out, cam, "minh", ...Pm, fo, f, [LEAP7]);
      for (const sd of [-1, 1] as const) { const S = shoulderAt(cam, "minh", Pm, fo, sd); arm3d(out, cam, "minh", Pm, fo, sd, lerp3(restHand(cam, "minh", Pm, fo, sd), [S[0] + sd * 0.4, S[1] + 0.18, S[2] + 0.05], up), f); }
      const t = (f - CHAIR7[0]) / (CHAIR7[1] - CHAIR7[0]), rx = f < CHAIR7[0] ? 0 : f < CHAIR7[1] ? (Math.PI / 2) * t * t : Math.PI / 2 - 0.1 * Math.abs(Math.sin((f - CHAIR7[1]) * 0.7)) * Math.exp(-(f - CHAIR7[1]) / 5);
      P.chair = { p: [x, 0, z + 0.22], rx };
      if (f >= CHAIR7[1] && f < CHAIR7[1] + 10) { const u = q((f - CHAIR7[1]) / 10, 10); card(out, `puff${u}`, 400, 400, (pp) => fxPuff(pp, u), ...Sa(x, 0.1, z + 0.7), 0.35, 0.35); }
      break;
    }
    case 9: break;
    case 10: break;
    case 11: { // the waiter walks in and presents a bottle beside the vitrine
      const m = mark("saleroom", "waiter", STAGE_Y);
      if (f < WALK11[1]) {
        const u = clamp01((f - WALK11[0]) / (WALK11[1] - WALK11[0])), x = m[0] + 1.1 * (1 - u);
        if (f >= WALK11[0]) side(out, cam, "waiter", x, STAGE_Y, m[2], -1, 0, { mode: "march", phase: walkPhase(f, 1.0), stride: 0.5, expr: "stern" }, f);
      } else {
        const fo: FrontOpts = { mode: "stand", expr: f >= 1600 ? "stern" : "neutral", facing: -1, look: -1, armOff: 2, headTilt: f >= 1600 ? -0.06 : 0 };
        front(out, cam, "waiter", ...m, fo, f, [1600]);
        const S = shoulderAt(cam, "waiter", m, fo, -1), rest = restHand(cam, "waiter", m, fo, -1);
        const hold: V3 = [S[0] - 0.3, S[1] - 0.12, S[2] + 0.12], H = arm3d(out, cam, "waiter", m, fo, -1, lerp3(rest, hold, smooth((f - BOTTLE11) / 10)), f);
        arm3d(out, cam, "waiter", m, fo, 1, restHand(cam, "waiter", m, fo, 1), f);
        card(out, "bottle1", 120, 420, (pp) => art2.bottle(pp), H[0] - 0.02, H[1] + 0.1, H[2] + 0.02, 0.085, 0.3, { rot: f >= BOTTLE11 ? 0.25 : 0 });
        if (f >= 1600) card(out, "napkin", 128, 128, (pp) => { pp.poly([[10, 10], [118, 10], [90, 118], [38, 118]], "#fbf7ec", 5); }, H[0] + 0.02, H[1] - 0.02, H[2] + 0.03, 0.09, 0.09);
      }
      break;
    }
    case 12: case 13: case 14: case 15: case 16: { // the cellar
      const m = mark("cellar", "somm");
      const fo: FrontOpts = { mode: "stand", expr: id === 13 && f >= POP13 ? "grin" : "smile_closed", facing: 1, look: 1, armOff: id === 13 ? 1 : undefined };
      if (id <= 13) front(out, cam, "waiter", ...m, fo, f, [POP13]);
      const slot: V3 = (() => { const [x, y] = bottleCubby(PULLED[0], PULLED[1]); return [x - 0.075, y + 0.07, -2.66]; })();
      const glassP: V3 = Ce(-0.55, 0.95 + 0.065, -1.75);
      if (id === 13) {
        const rest = restHand(cam, "waiter", m, fo, 1), neck = Ce(slot[0], slot[1], -2.48), chest = holdHand(cam, "waiter", m, fo, 1, 0.12), pour: V3 = [glassP[0] - 0.05, glassP[1] + 0.22, glassP[2]];
        const hand: V3 = f < PULL13[0] ? lerp3(rest, neck, smooth((f - 1698) / 4)) : f < PULL13[1] ? lerp3(neck, chest, smooth((f - PULL13[0]) / (PULL13[1] - PULL13[0]))) : f < POUR13[0] - 4 ? chest : f < POUR13[1] + 8 ? lerp3(chest, pour, smooth((f - POUR13[0] + 4) / 6)) : lerp3(pour, chest, smooth((f - POUR13[1] - 8) / 8));
        const H = arm3d(out, cam, "waiter", m, fo, 1, hand, f);
        // the bottle: in its slot until pulled, then in his hand (upright, tipped over the glass while pouring)
        const tilt = f >= POUR13[0] - 2 && f < POUR13[1] + 6 ? 1.9 : 0;
        P.bottle = f < PULL13[0] ? { p: slot } : { p: toLocal(CELLAR, [H[0], H[1] + 0.05, H[2]]), rx: -Math.PI / 2, rz: -tilt };
        if (f >= POUR13[0] && f < POUR13[1]) card(out, "stream", 40, 200, (pp) => art2.stream(pp), glassP[0] + 0.01, glassP[1] + 0.1, glassP[2] + 0.01, 0.012, 0.16);
        // the cork: out of the neck on POP13, two bounces, stays on the floor
        if (f >= POP13) {
          const t = (f - POP13) / FPS, c0: V3 = [chest[0], chest[1] + 0.2, chest[2]], vx = 0.9, vy = 2.6, g = 9.8;
          let y = c0[1] + vy * t - 0.5 * g * t * t, x = c0[0] + vx * t; const z = c0[2] + 0.4 * t;
          if (y <= 0.01) { y = 0.01 + Math.abs(0.25 * Math.sin((t - 0.68) * 9)) * Math.exp(-(t - 0.68) * 4); x = Math.min(x, c0[0] + vx * 0.9); }
          card(out, "cork", 64, 100, (pp) => art2.cork(pp), x, y + 0.02, Math.min(z, c0[2] + 0.36), 0.025, 0.04, { rot: t * 14 });
          if (f < POP13 + 7) burst(out, f, POP13, c0[0], c0[1] + 0.05, c0[2], 0.25, 7, "#ffffff");
        }
      }
      const fill = id < 13 ? 0 : id > 13 ? 0.7 : clamp01((f - POUR13[0]) / (POUR13[1] - POUR13[0])) * 0.7;
      card(out, `glass${q(fill, 20)}`, 160, 260, (pp) => art2.wineGlass(pp, fill), glassP[0], glassP[1], glassP[2], 0.08, 0.13);
      if (id >= 14) P.bottle = { p: toLocal(CELLAR, Ce(-0.4, 0.95 + 0.12, -1.85)), rx: -Math.PI / 2 };
      // shreds of torn wrap: burst from each box as it opens, flutter down, rest on the floor
      if (id >= 15) OPEN_ORDER.forEach((bi, n) => {
        const t0 = OPEN_AT[n], bc = boxCubby(bi);
        for (let s = 0; s < 4; s++) {
          const seed = bi * 7 + s, x0 = bc[0] + (hh(seed) - 0.5) * 0.18, y0 = bc[1] + BH * (0.4 + 0.5 * hh(seed, 2)), t = id > 15 ? 99 : (f - t0) / FPS;
          if (t < 0) continue;
          const fall = Math.min(y0 - 0.012, 0.65 * t + 0.4 * t * t), y = y0 - fall, landed = y <= 0.013;
          const x = x0 + 0.06 * Math.sin(t * 7 + seed) * (landed ? 0 : 1) + (hh(seed, 3) - 0.5) * 0.3 * Math.min(1, t), z = -2.36 + 0.35 * hh(seed, 4) * Math.min(1, t * 1.5);
          card(out, `shred${s % 3}`, 64, 64, (pp) => art2.shred(pp, s % 3), ...Ce(x, landed ? 0.013 : y, z), 0.06, 0.06, landed ? { flat: true, rot: seed } : { rot: t * 6 + seed });
        }
        if (id === 15 && f >= t0 && f < t0 + 6) burst(out, f, t0, ...Ce(bc[0], bc[1] + BH * 0.6, -2.42), 0.22, 6, "#ffffff");
      });
      if (id === 16) { // paddles crowd in around the last box from below the frame
        for (let i = 0; i < 12; i++) {
          const t0 = JAB16[0] + i * 2, a = smooth((f - t0) / 4), all = f >= JAB16[1] ? 0.06 * Math.sin((f - JAB16[1]) * 1.4) * Math.exp(-(f - JAB16[1]) / 6) : 0;
          if (a <= 0) continue;
          const sd = i % 2 ? 1 : -1, x = 0.65 + sd * (0.15 + 0.17 * hh(i, 5)), z = -1.95 + 0.2 * hh(i, 6), y = 0.45 + (0.3 + 0.32 * hh(i, 7)) * a + all + 0.02 * Math.sin(f * 0.6 + i);
          if (Math.abs(x - 0.65) < 0.16 && y > 0.72) continue; // never in front of the box itself
          card(out, `paddle${(i * 17 + 3) % 90}`, 300, 480, (pp) => art.paddle(pp, (i * 17 + 3) % 90), ...Ce(x, y, z), 0.13, 0.21, { rot: 0.25 * (hh(i, 8) - 0.5) });
        }
      }
      break;
    }
    case 8: case 17: case 18: { // the kitchen
      const kidAt = Ki(KIT.kid[0], 0, KIT.kid[1]), boxT: V3 = [KIT.box[0], 0.75, KIT.box[2]], shelf: V3 = KIT.shelf as V3;
      const bowl0: V3 = [KIT.bowl[0], 0.75, KIT.bowl[2]];
      P.bowl = { p: id === 8 ? lerp3([bowl0[0] + 0.32, 0.75, bowl0[2]], bowl0, smooth((f - PUSH8) / 12)) : bowl0 };
      if (id === 8 || id === 17) {
        const sulk = id === 17 && f >= SNATCH17;
        const fo: FrontOpts = { mode: "sit", chair: 0.95, expr: id === 8 ? (f >= HUG8 ? "grin" : "smile") : sulk ? "pained" : "grin", armOff: 2, headTilt: sulk ? 0.12 : 0 };
        front(out, cam, "kid", ...kidAt, fo, f, id === 8 ? [HUG8] : [SNATCH17 + 2]);
        const B = Ki(...boxT), rest = [restHand(cam, "kid", kidAt, fo, -1), restHand(cam, "kid", kidAt, fo, 1)];
        for (const sd of [-1, 1] as const) {
          let h = rest[sd < 0 ? 0 : 1];
          if (id === 8) {
            if (sd < 0 && f >= PUSH8 - 6 && f < PUSH8 + 14) h = lerp3(h, Ki(bowl0[0] + 0.35, 0.82, bowl0[2] - 0.02), smooth((f - PUSH8 + 6) / 6) * (1 - smooth((f - PUSH8 - 8) / 6)));
            if (f >= HUG8) h = lerp3(h, [B[0] + sd * (BW / 2 + 0.01), B[1] + 0.12, B[2]], smooth((f - HUG8) / 6));
          } else if (f >= REACH17 && f < SNATCH17) h = sd > 0 ? lerp3(h, [B[0] + 0.04, B[1] + BH - 0.02, B[2] + 0.04], smooth((f - REACH17) / 10)) : h;
          arm3d(out, cam, "kid", kidAt, fo, sd, h, f);
        }
        if (id === 8 && f >= 1150) { // a coin rolls off the table and spins out on the floor
          const t = (f - 1150) / FPS, x = KIT.table[0] + 0.55 + 0.25 * t, y = Math.max(0.012, 0.76 - 4.9 * Math.max(0, t - 0.2) ** 2);
          card(out, "coin", 64, 64, (pp) => art2.coin(pp), ...Ki(x, y, -0.3), 0.025, 0.025, y <= 0.013 ? { flat: true } : { rot: t * 20 });
        }
      }
      if (id === 8) { // mum at the stove, stirring
        const mm = Ki(KIT.stove[0], 0, -1.75), fo: FrontOpts = { mode: "stand", expr: "smile_closed", facing: 1, look: 1, armOff: 1 };
        front(out, cam, "mom", ...mm, fo, f);
        arm3d(out, cam, "mom", mm, fo, 1, Ki(KIT.stove[0] + 0.22 + 0.04 * Math.sin(f * 0.4), 1.02, KIT.stove[1] + 0.04 * Math.cos(f * 0.4)), f);
        P.kitBox = { p: boxT };
      }
      if (id === 17) {
        const m0 = Ki(KIT.mom[0], 0, KIT.mom[1]), way = Ki(0.3, 0, -1.55), m1 = Ki(KIT.momshelf[0], 0, KIT.momshelf[1]);
        if (f >= WALK17[0] && f < WALK17[1]) {
          const u = clamp01((f - WALK17[0]) / (WALK17[1] - WALK17[0])), a = u < 0.4 ? lerp3(m0, way, u / 0.4) : lerp3(way, m1, (u - 0.4) / 0.6), d = u < 0.4 ? [way[0] - m0[0], way[2] - m0[2]] : [m1[0] - way[0], m1[2] - way[2]];
          side(out, cam, "mom", ...a, d[0], d[1], { mode: "march", phase: walkPhase(f, 1.1), stride: 0.5, reach: 1, expr: "stern" }, f);
          P.kitBox = { p: toLocal(KITCH, [a[0] + 0.28 * Math.sign(d[0] || 1), 1.0, a[2] + 0.05]) };
        } else {
          const here = f < WALK17[0] ? m0 : m1, after = f >= WALK17[1];
          const fo: FrontOpts = { mode: "stand", expr: f < SNATCH17 - 4 ? "neutral" : after && f > SHELF17 + 4 ? "smile_closed" : "stern", facing: after ? 1 : -1, look: after ? 1 : -1, armOff: 2, crouch: !after && f >= SNATCH17 - 6 && f < SNATCH17 + 6 ? 0.2 : 0 };
          front(out, cam, "mom", ...here, fo, f, [SNATCH17, SHELF17 + 4]);
          const rest = [restHand(cam, "mom", here, fo, -1), restHand(cam, "mom", here, fo, 1)];
          let B: V3;
          if (!after) {
            const chest = chestAt(cam, "mom", here, fo, 0.45, 0.18);
            B = f < SNATCH17 ? Ki(...boxT) : lerp3(Ki(...boxT), [chest[0], chest[1] - BH / 2, chest[2]], smooth((f - SNATCH17) / 6));
            const grab = f >= SNATCH17 - 6;
            for (const sd of [-1, 1] as const) arm3d(out, cam, "mom", here, fo, sd, grab ? [B[0] + sd * (BW / 2 + 0.005), B[1] + BH * 0.6, B[2]] : rest[sd < 0 ? 0 : 1], f);
          } else {
            const top = Ki(shelf[0], shelf[1], shelf[2]), lift: V3 = [top[0] - 0.12, 1.25, top[2] + 0.2];
            B = f < SHELF17 - 4 ? lerp3(lift, [top[0] - 0.05, top[1] + 0.05, top[2]], smooth((f - WALK17[1]) / (SHELF17 - 4 - WALK17[1]))) : f < SHELF17 ? lerp3([top[0] - 0.05, top[1] + 0.05, top[2]], top, (f - SHELF17 + 4) / 4) : top;
            for (const sd of [-1, 1] as const) arm3d(out, cam, "mom", here, fo, sd, f < SHELF17 + 3 ? [B[0] + sd * (BW / 2 + 0.005), B[1] + BH * 0.5, B[2]] : lerp3([B[0] + sd * 0.1, B[1] + 0.1, B[2]], rest[sd < 0 ? 0 : 1], smooth((f - SHELF17 - 3) / 8)), f);
          }
          P.kitBox = { p: toLocal(KITCH, B) };
        }
      }
      if (id === 18) {
        P.kitBox = { p: shelf };
        const mm = Ki(KIT.mom26[0], 0, KIT.mom26[1]), pt = f >= POINT18 ? smooth((f - POINT18) / 8) : 0;
        const fo: FrontOpts = { mode: "stand", expr: f >= BOW18[0] + 6 ? "smile" : "neutral", facing: 1, look: 1, armOff: 1 };
        front(out, cam, "momOld", ...mm, fo, f, [BOW18[0] + 6]);
        const S = shoulderAt(cam, "momOld", mm, fo, 1);
        arm3d(out, cam, "momOld", mm, fo, 1, lerp3(restHand(cam, "momOld", mm, fo, 1), [S[0] + 0.22, S[1] + 0.38, S[2] - 0.1], pt), f);
        const m0 = Ki(2.4, 0, -0.4), m1 = mark("kitchen", "minh");
        if (f < WALK18[1]) {
          const u = clamp01((f - WALK18[0]) / (WALK18[1] - WALK18[0])), a = lerp3(m0, m1, u);
          if (f >= WALK18[0]) { side(out, cam, "minh", ...a, m1[0] - m0[0], m1[2] - m0[2], { mode: "march", phase: walkPhase(f, 1.0), stride: 0.5, reach: 1, expr: "nervous" }, f); card(out, "flowers", 300, 420, (pp) => art2.flowers(pp), a[0] - 0.3, 1.1, a[2] + 0.05, 0.2, 0.28); }
        } else {
          const bow = f >= BOW18[0] ? smooth((f - BOW18[0]) / 6) * (1 - smooth((f - BOW18[1]) / 8)) : 0;
          const fo2: FrontOpts = { mode: "stand", expr: f >= BOW18[1] ? "smile" : "nervous", facing: -1, look: -1, armOff: -1, crouch: 0.25 * bow, headTilt: 0.25 * bow };
          front(out, cam, "minh", ...m1, fo2, f, [BOW18[1]]);
          const S2 = shoulderAt(cam, "minh", m1, fo2, -1), hold: V3 = [S2[0] - 0.28, S2[1] - 0.15 - 0.1 * bow, S2[2] + 0.1];
          const H = arm3d(out, cam, "minh", m1, fo2, -1, hold, f);
          card(out, "flowers", 300, 420, (pp) => art2.flowers(pp), H[0] - 0.04, H[1] + 0.06, H[2] + 0.03, 0.2, 0.28, { rot: 0.3 });
        }
      }
      break;
    }
  }
  return out;
};
