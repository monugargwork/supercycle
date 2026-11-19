// The Fanatics unpaid Pikachu reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, HALL, NEWS, STREET, MUSEUM, clamp01, smooth, easeOut, pop, mark, obj, hop, TICKETS, HERO, ticketAt, heroAt,
  GAVELS, POP1, POP5, BUNDLES, STAMP4, FISH5, CURL6, WALK8, UNPIN10, SHRED10, LEVEL10, RIDER12, YANK13, TOSS13, SHRUG14, WALK14, DOOR14, FLASH15,
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
  auctioneer: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#9a9aa2", tie: "#c23a32", skin: "#f2c4a4", build: "stout" } as Outfit,
  clerk: { jacket: "#26242b", pants: "#3b3f52", boots: "#15131a", hat: "hair", hair: "#2a201a", glasses: true, tie: "#3f7fc9", skin: "#e8b896" } as Outfit,
  writer: { jacket: "#c23a32", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#2a2c33", glasses: true, skin: "#c99067" } as Outfit,
  dA: { jacket: "#3f9a55", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#5a3b2a", skin: "#c99067" } as Outfit,
  dB: { jacket: "#f2c84a", pants: "#3b5b9a", boots: "#2a201a", hat: "beanie", cap: "#7b5ac9", glasses: true, skin: "#ecd0b6" } as Outfit,
  dC: { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#f5c9a0", build: "stout" } as Outfit,
  agent: { jacket: "#24407a", pants: "#24407a", boots: "#15131a", hat: "hair", hair: "#e8c46a", skin: "#f5c9a0", buttons: "#f6f2e6" } as Outfit,
  v1: { jacket: "#c25a7a", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#c99067" } as Outfit,
  v2: { jacket: "#2aa39a", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#e2453c", skin: "#f5c9a0" } as Outfit,
  v3: { jacket: "#f08a3c", pants: "#3b5b9a", boots: "#4a3426", hat: "hair", hair: "#8a5a34", skin: "#ecd0b6", glasses: true } as Outfit,
  v4: { jacket: "#3b4f9e", pants: "#1f2b4a", boots: "#15131a", hat: "hair", hair: "#ecebe8", skin: "#f2c4a4", build: "stout" } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { auctioneer: 9, clerk: 2, writer: 6, dA: 3, dB: 4, dC: 5, agent: 7, v1: 10, v2: 11, v3: 12, v4: 13 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[fanatics] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Ha = (x: number, y: number, z: number) => at(HALL, x, y, z);
const Mu = (x: number, y: number, z: number) => at(MUSEUM, x, y, z);
const STAGE_Y = 0.5, SLAB_H = 0.3;
const TW = 0.26, TH = 0.17;
/** a graded slab with the real card in it: upright facing +z by default (face), or a billboard */
const slabFx = (out: Stage, img: string, p: V3, o: { h?: number; bill?: boolean; gleam?: number } = {}) => {
  const h = o.h ?? SLAB_H, gl = o.gleam !== undefined && o.gleam > 0 && o.gleam < 1 ? q(o.gleam, 24) : -1;
  card(out, `slab|${img}|${gl}`, 380, 600, (pp) => art.slabReal(pp, 380, 600, img, { gleam: gl }), p[0], p[1], p[2], h * 0.633, h, o.bill ? {} : { face: 0 });
};
/** a vertical card on the back wall (faces +z) */
const wallCard = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, rot = 0, soft = false) =>
  card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, { face: 0, rot, soft });

// ---- the sold wall: every ticket, its steam, the pale patch it leaves, the hero ticket ----
const wall = (out: Stage, f: number, id: number) => {
  for (const t of TICKETS) {
    const s = ticketAt(t, f, id), P = Ha(t.pos[0], t.pos[1], t.pos[2]);
    const status = t.unpin !== undefined ? "UNPAID" : "PAID";
    if (s.on) { const ph = q(s.phase, 10); wallCard(out, `tk|${t.id}|${ph}`, 520, 340, (p) => art.ticket(p, t.card, t.price, { status, steam: ph }), [P[0], P[1], P[2] + 0.004], TW, TH); }
    else {
      if (s.outline > 0) { const a = q(s.outline, 10); wallCard(out, `patch|${a}`, 520, 340, (p) => art.corkPatch(p, a), [P[0], P[1], P[2] + 0.002], TW, TH, 0, true); }
      if (s.pin) wallCard(out, "pin", 64, 64, (p) => art.pinDot(p), [P[0], P[1] + TH / 2 - 0.012, P[2] + 0.006], 0.022, 0.022);
    }
    if (t.steam !== undefined && id >= 8 && f >= t.steam && f < t.steam + 22) { const u = q((f - t.steam) / 22, 22); card(out, `steam${u}`, 300, 500, (p) => art.steamCurl(p, u), P[0], P[1] + 0.12 + 0.25 * u, P[2] + 0.05, 0.22, 0.37, { soft: true }); }
  }
  const h = heroAt(f, id), HP = Ha(HERO.pos[0], HERO.pos[1], HERO.pos[2]), [HW, HH] = HERO.size;
  if (h.outline) wallCard(out, "patch|1", 520, 340, (p) => art.corkPatch(p, 1), [HP[0], HP[1], HP[2] + 0.002], HW, HH, 0, true);
  if (h.vis) { const c = q(h.curl, 24); wallCard(out, `hero|${h.paid}|${c}`, 680, 460, (p) => art.heroTicket(p, h.paid, c), [HP[0], HP[1] + h.dy, HP[2] + 0.005], HW, HH, h.crooked); }
  // the popped pin: out of the cork, down onto the cabinet top, where it stays (S01, S05)
  const pop0 = id === 1 ? POP1 : id === 5 ? POP5 : -1;
  if (pop0 > 0 && f >= pop0 && (id === 1 || f < FISH5[3])) {
    const t = (f - pop0) / FPS, y0 = HP[1] + HH / 2 - 0.02, top = 0.93, y = Math.max(top, y0 + 0.4 * t - 4.9 * t * t);
    const P: V3 = [HP[0] + 0.05 * Math.min(1, t * 3), y, Math.min(HP[2] + 0.12, HP[2] + 0.6 * t)];
    card(out, "pin", 64, 64, (p) => art.pinDot(p), ...P, 0.022, 0.022, y <= top + 0.001 ? { flat: true } : {});
  }
};

/** the auctioneer, his gavel (held up from frame 0 in the hook), the Pikachu slab on column A */
const lot = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const pa = mark("hall", "auctioneer", STAGE_Y);
  let g = 1;
  const G = id === 1 ? GAVELS[0] : GAVELS[1], up0 = id === 1 ? -100 : G - 20;
  if (f < G && f >= up0) g = 1 - smooth((f - up0) / 5);
  if (id === 1 && f < G) g = f >= G - 1 ? 0.4 : 0;
  if (f >= G && f < G + 6) g = 1 - 0.3 * Math.sin((Math.PI * (f - G)) / 6);
  const expr = f >= G && f < G + 90 ? "grin" : "stern";
  front(out, cam, "auctioneer", ...pa, { mode: "stand", expr, facing: 0, prop: ["gavel", q(g, 20)] }, f, [G]);
  burst(out, f, G, ...Ha(-0.03, 1.54, -4.3), 0.5, 8);
  const ca = obj("hall", "columnA").p;
  slabFx(out, "pika_rain", [ca[0], 1.78 + 0.02 + SLAB_H / 2 + hop(f, G, 0.55), ca[2]], { gleam: id === 1 ? (f - 8) / 18 : -1 });
};
/** paddles rising into the bottom of the stage frame (S02): bidders below the frame */
const PADDLES: [number, number, number][] = [[256, -0.5, 17], [261, 0.42, 42], [266, 0.02, 8], [271, -0.25, 73], [276, 0.55, 31], [281, -0.55, 56], [286, 0.2, 12], [291, -0.1, 64], [295, 0.4, 25]];

/** the clerk standing at mark `m`, with optional 3D arms */
const clerkAt = (m: "clerk" | "clerk10") => mark("hall", m);

export const bundleAt = (i: number, f: number) => {
  const L = BUNDLES[i], rest: V3 = [[-0.22, 1.0, -0.05], [0.24, 1.0, -0.02], [0.02, 1.1, 0.08]][i] as V3, ry = [0.2, -0.25, 0.05][i];
  const t = f - (L - 10);
  if (t < 0) return { vis: false, p: rest, ry, rz: 0 };
  const u = Math.min(1, t / 10), S: V3 = [-1.7, 1.5, 0.4], p = lerp3(S, rest, u);
  p[1] += 0.5 * 4 * u * (1 - u) + (t >= 10 ? hop(f, L, 0.35) : 0);
  return { vis: true, p, ry: ry + 2 * (1 - u), rz: 0.6 * (1 - u) };
};
/** sign 0's stake in S13: yanked out of the lawn, tossed onto the lawn behind her (flat = lying there) */
export const yank13 = (f: number, id: number) => {
  if (id !== 13 || f < YANK13 - 8) return { dx: 0, dy: 0, dz: 0, rx: 0, rz: 0, flat: false };
  if (f < YANK13 + 2) { const k = smooth((f - (YANK13 - 8)) / 10); return { dx: 0, dy: 0.45 * k * k, dz: 0, rx: 0, rz: 0.1 * k, flat: false }; }
  const u = clamp01((f - YANK13 - 2) / (TOSS13 - YANK13 - 2));
  return { dx: 0.9 * u, dy: 0.45 + 0.6 * 4 * u * (1 - u) - 0.45 * u, dz: -0.9 * u, rx: -1.4 * u, rz: 0.1 + 1.2 * u, flat: u >= 1 };
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place;
  if (place === "hall") wall(out, f, id);
  switch (id) {
    case 1: case 2: { // the stage: the gavel; in S02 the paddles and the hammer
      lot(out, cam, f, id);
      if (id === 2) for (const [t0, x, n] of PADDLES) {
        const up = smooth((f - t0) / 4) * (1 - smooth((f - t0 - 10) / 5));
        if (up > 0) card(out, `paddle${n}`, 300, 480, (p) => art.paddle(p, n), ...Ha(x * 1.3, 1.05 + 0.42 * up, -3.7), 0.15, 0.24);
      }
      break;
    }
    case 3: break; // the newsstand: the bundles are set pieces (world.ts)
    case 4: { // PAID: the clerk thumps the stamp onto the hero ticket
      const at = clerkAt("clerk"), fo: FrontOpts = { mode: "stand", expr: f < STAMP4 + 4 ? "neutral" : "smile", facing: 1, look: 1, armOff: 1 };
      front(out, cam, "clerk", ...at, fo, f, [STAMP4 + 4]);
      const HP = Ha(HERO.pos[0], HERO.pos[1], HERO.pos[2]), hit: V3 = [HP[0] - 0.1, HP[1] - 0.05, HP[2] + 0.12], wind: V3 = [hit[0] - 0.08, hit[1] + 0.12, hit[2] + 0.18];
      const rest = holdHand(cam, "clerk", at, fo, 1, 0.12);
      const hand = f < 578 ? lerp3(rest, wind, smooth((f - 560) / 12)) : f < STAMP4 - 2 ? wind : f < STAMP4 ? lerp3(wind, hit, (f - STAMP4 + 2) / 2) : f < STAMP4 + 9 ? lerp3(hit, wind, smooth((f - STAMP4) / 9)) : lerp3(wind, rest, smooth((f - STAMP4 - 9) / 12));
      const H = arm3d(out, cam, "clerk", at, fo, 1, hand, f);
      card(out, "rstamp", 200, 300, (p) => art.rubberStamp(p), H[0] + 0.01, H[1] - 0.05, H[2] - 0.05, 0.08, 0.12, { rot: 0.9 });
      burst(out, f, STAMP4, HP[0] - 0.05, HP[1] - 0.06, HP[2] + 0.03, 0.18, 6, "#bfe8a0");
      break;
    }
    case 5: { // gone, and back: the clerk fishes it out of the gap with the yardstick
      const at = clerkAt("clerk"), cr = f < 708 ? 0 : 0.35 * smooth((f - 708) / 8) * (1 - smooth((f - FISH5[3]) / 8));
      const fo: FrontOpts = { mode: "stand", expr: f < POP5 ? "neutral" : f < FISH5[2] ? "nervous" : "relief", facing: 1, look: 1, crouch: cr, armOff: 1, headTilt: f >= 700 && f < FISH5[1] ? 0.15 : 0 };
      front(out, cam, "clerk", ...at, fo, f, [POP5 + 2, FISH5[2]]);
      const HP = Ha(HERO.pos[0], HERO.pos[1], HERO.pos[2]), cbx = obj("hall", "cabinet").p[0] - 0.3;
      const gap: V3 = [cbx, 0.84, -5.16 + HALL[2]], press: V3 = [HP[0] - 0.05, HP[1] - 0.04, HP[2] + 0.01], down: V3 = Ha(at[0] - HALL[0] + 0.25, 0.08, at[2] - HALL[2] + 0.1);
      const tip: V3 = f < FISH5[0] ? lerp3(down, [gap[0], 1.0, gap[2] + 0.05], smooth((f - 704) / 8)) : f < FISH5[1] ? lerp3([gap[0], 1.0, gap[2] + 0.05], gap, smooth((f - FISH5[0]) / 6)) : f < FISH5[2] ? lerp3(gap, press, smooth((f - FISH5[1]) / (FISH5[2] - FISH5[1]))) : f < FISH5[3] + 2 ? press : lerp3(press, down, smooth((f - FISH5[3] - 2) / 8));
      const sh = shoulderAt(cam, "clerk", at, fo, 1), dir = new THREE.Vector3(...tip).sub(new THREE.Vector3(...sh)).normalize();
      const hand: V3 = add3(sh, [dir.x, dir.y, dir.z], 0.4), H = arm3d(out, cam, "clerk", at, fo, 1, hand, f);
      const back = add3(tip, [-dir.x, -dir.y, -dir.z], 1.0); // a 1 m stick from its tip back past the hand
      seg3d(out, cam, back, tip, 0.018, "#c9a06a");
      void H;
      break;
    }
    case 6: break; // the macro: only the wall
    case 7: { // the collectors, turned to the wall
      const pA = mark("hall", "dA"), pB = mark("hall", "dB"), pC = mark("hall", "dC");
      const lean = smooth((f - 892) / 10);
      front(out, cam, "dA", ...pA, { mode: "stand", expr: f < 951 ? "nervous" : "shock", facing: 1, look: 1 }, f, [951]);
      front(out, cam, "dB", ...pB, { mode: "stand", expr: "nervous", facing: 1, look: 1, crouch: 0.1 * lean, headTilt: 0.1 * lean }, f);
      front(out, cam, "dC", ...pC, { mode: "stand", expr: f < 951 ? "nervous" : "dazed", facing: 1, look: 1, headTilt: f >= 951 ? -0.14 : 0 }, f, [951]);
      break;
    }
    case 8: { // GempireCards: walks in with the binder, checks it against the wall, shock as the tickets steam off
      const at = mark("hall", "writer");
      if (f < WALK8[1]) {
        const u = clamp01((f - WALK8[0]) / (WALK8[1] - WALK8[0])), x = at[0] - 1.1 * (1 - u);
        side(out, cam, "writer", x, 0, at[2], 1, 0, { mode: f < WALK8[0] ? "stand" : "march", phase: walkPhase(f, 1.0), stride: 0.6, reach: 1, expr: "neutral" }, f);
        card(out, "binder", 400, 520, (p) => art.binderCover(p), x + 0.36, 1.12, at[2] + 0.02, 0.2, 0.26);
        break;
      }
      const down = (f >= 1081 && f < 1100) || (f >= 1128 && f < 1150) || f < 1060, shock = f >= 1193;
      const fo: FrontOpts = { mode: "stand", expr: shock ? "shock" : "neutral", facing: 1, look: down ? 0 : 1, headTilt: down ? 0.14 : -0.04, armOff: 2, gape: shock ? 0.4 * smooth((f - 1193) / 6) : undefined };
      front(out, cam, "writer", ...at, fo, f, [1081, 1104, 1128, 1153, 1193]);
      const B = chestAt(cam, "writer", at, fo, 0.42, 0.18);
      card(out, "binder", 400, 520, (p) => art.binderCover(p), ...B, 0.2, 0.26);
      for (const sd of [-1, 1] as const) arm3d(out, cam, "writer", at, fo, sd, [B[0] + sd * 0.1, B[1] - 0.02, B[2]], f);
      break;
    }
    case 9: break; // the two tickets steam off (wall)
    case 10: { // unpin the UNPAID ticket, shred it, then the level on the bottom row
      const at = clerkAt("clerk10"), cr = f >= 1540 && f < 1595 ? 0.3 * smooth((f - 1540) / 10) * (1 - smooth((f - 1588) / 7)) : 0;
      const fo: FrontOpts = { mode: "stand", expr: f >= 1640 ? "smile" : "neutral", facing: f >= 1530 && f < 1595 ? -1 : 1, look: f >= 1530 && f < 1595 ? -1 : 1, crouch: cr, armOff: 2 };
      front(out, cam, "clerk", ...at, fo, f, [1530, 1595, 1640]);
      const t18 = TICKETS.find((t) => t.unpin !== undefined)!, TP = Ha(t18.pos[0], t18.pos[1], t18.pos[2]), sh = obj("hall", "shredder").p;
      const restR = restHand(cam, "clerk", at, fo, 1), restL = restHand(cam, "clerk", at, fo, -1), chest = chestAt(cam, "clerk", at, fo, 0.4, 0.15);
      const slot: V3 = [sh[0], 0.96 + 0.1, sh[2]], lv: V3 = Ha(obj("hall", "level").p[0] - HALL[0] - 0.28, 1.31, -5.12);
      // right hand: to the ticket, then to the chest (hand-over), then the level's left end, then back
      const R: V3 = f < UNPIN10 - 8 ? restR : f < UNPIN10 + 4 ? lerp3(restR, [TP[0] - 0.05, TP[1], TP[2] + 0.04], smooth((f - UNPIN10 + 8) / 8)) : f < 1530 ? lerp3([TP[0] - 0.05, TP[1], TP[2] + 0.04], chest, smooth((f - UNPIN10 - 4) / 14)) : f < 1600 ? lerp3(chest, restR, smooth((f - 1530) / 8)) : f < LEVEL10[2] + 6 ? lerp3(restR, [lv[0], lv[1] + 0.02, lv[2] + 0.04], smooth((f - 1600) / 12)) : lerp3([lv[0], lv[1] + 0.02, lv[2] + 0.04], restR, smooth((f - LEVEL10[2] - 6) / 10));
      // left hand: takes the ticket at the chest, holds it over the slot, lets the shredder pull it in
      const L: V3 = f < 1528 ? restL : f < 1545 ? lerp3(restL, chest, smooth((f - 1528) / 6)) : f < SHRED10 + 4 ? lerp3(chest, [slot[0] + 0.04, slot[1] + 0.1, slot[2] + 0.03], smooth((f - 1545) / 16)) : lerp3([slot[0] + 0.04, slot[1] + 0.1, slot[2] + 0.03], restL, smooth((f - SHRED10 - 4) / 10));
      const HR = arm3d(out, cam, "clerk", at, fo, 1, R, f), HL = arm3d(out, cam, "clerk", at, fo, -1, L, f);
      const drawT = (p: Pen) => art.ticket(p, t18.card, t18.price, { status: "UNPAID" });
      if (f >= UNPIN10 + 4 && f < 1532) card(out, "tk|unpaid", 520, 340, drawT, HR[0], HR[1] - 0.05, HR[2] + 0.02, TW, TH, { face: 0, rot: 0.1 });
      else if (f >= 1532 && f < SHRED10) card(out, "tk|unpaid", 520, 340, drawT, HL[0], HL[1] - 0.06, HL[2] + 0.02, TW, TH, { face: 0, rot: Math.PI / 2 });
      else if (f >= SHRED10 && f < SHRED10 + 18) { const k = (f - SHRED10) / 18; card(out, "tk|unpaid", 520, 340, drawT, slot[0], 0.96 + TW / 2 - 0.26 * k, slot[2], TW, TH, { face: 0, rot: Math.PI / 2 }); }
      // the level: carried in the right hand, laid on the row; its bubble slides to the centre on 'chính xác'
      if (f >= 1600) {
        const laid = f >= LEVEL10[1], lp: V3 = laid ? Ha(obj("hall", "level").p[0] - HALL[0], 1.31, -5.11) : [R[0] + 0.28, R[1], R[2] - 0.01];
        const u = f < LEVEL10[1] ? 0.08 : f < LEVEL10[2] ? 0.08 + 0.42 * smooth((f - LEVEL10[1]) / (LEVEL10[2] - LEVEL10[1])) : 0.5 + 0.02 * Math.sin((f - LEVEL10[2]) * 0.8) * Math.exp(-(f - LEVEL10[2]) / 6);
        const uq = q(u, 60); card(out, `level${uq}`, 1200, 100, (p) => art.levelFace(p, uq), ...lp, 0.6, 0.05, { face: 0 });
        if (f >= LEVEL10[2] && f < LEVEL10[2] + 14) sparkle(out, f, LEVEL10[2], lp[0], lp[1] + 0.06, lp[2] + 0.02, 0.12, 14);
      }
      break;
    }
    case 11: case 12: case 13: { // the street: the agent, the SOLD rider, the yank
      const at = mark("street", "agent"), S0 = at3(STREET, -2.3, 0, 2.0);
      const hooking = id === 12 && f >= 1770 && f < RIDER12 + 10, yanking = id === 13 && f >= YANK13 - 12 && f < TOSS13 - 6;
      const cr = hooking ? 0.4 * smooth((f - 1770) / 8) * (1 - smooth((f - RIDER12 - 2) / 8)) : yanking ? 0.35 * smooth((f - YANK13 + 12) / 6) * (1 - smooth((f - YANK13) / 6)) : 0;
      const fo: FrontOpts = { mode: "stand", expr: id === 13 ? (f > TOSS13 ? "neutral" : "stern") : f >= RIDER12 ? "grin" : "smile", facing: -1, look: -1, crouch: cr, armOff: -1 };
      front(out, cam, "agent", ...at, fo, f, [RIDER12, YANK13]);
      const rest = holdHand(cam, "agent", at, fo, -1, 0.1), y = yank13(f, id);
      let hand = rest;
      if (id <= 12) {
        const hook: V3 = [S0[0] + 0.05, 0.72, S0[2] + 0.06];
        hand = f < 1776 ? rest : f < RIDER12 ? lerp3(rest, hook, smooth((f - 1776) / (RIDER12 - 1776))) : lerp3(hook, rest, smooth((f - RIDER12 - 4) / 10));
        if (id === 11 || f < RIDER12) card(out, "rider", 420, 120, (p) => art.soldRider(p), hand[0] - 0.12, hand[1] - 0.06, hand[2] + 0.02, 0.7, 0.2, { face: 0.4 });
      }
      if (id === 13 && yanking) hand = [S0[0] + y.dx + 0.03, 0.55 + y.dy, S0[2] + y.dz + 0.04];
      if (id === 13 && f >= TOSS13 - 6) hand = lerp3([S0[0] + 0.5, 0.9, S0[2] - 0.4], rest, smooth((f - TOSS13 + 6) / 10));
      arm3d(out, cam, "agent", at, fo, -1, hand, f);
      // the rider hangs under sign 0 once hooked, and goes with it
      const riderOn = (id === 12 && f >= RIDER12) || id === 13;
      if (riderOn && !y.flat) card(out, "rider", 420, 120, (p) => art.soldRider(p), S0[0] + y.dx, 0.62 + y.dy, S0[2] + y.dz + 0.04, 0.7, 0.2, { face: 0, rot: y.rz, tilt: y.rx });
      if (id === 12) burst(out, f, RIDER12, S0[0], 0.66, S0[2] + 0.08, 0.3, 6, "#ffffff");
      if (id === 13 && f >= YANK13) { // the hole, a dirt puff, then the sign lying on the lawn
        card(out, "hole", 128, 128, (p) => art.glow(p, "60,40,25"), S0[0], 0.013, S0[2], 0.22, 0.16, { flat: true, soft: true });
        if (f < YANK13 + 10) { const u = q((f - YANK13) / 10, 10); card(out, `puff${u}`, 400, 400, (p) => fxPuff(p, u), S0[0], 0.12, S0[2] + 0.05, 0.4, 0.4); }
        if (y.flat) {
          const L: V3 = [S0[0] + 0.9, 0.02, S0[2] - 0.9];
          card(out, "sign|flat", 420, 290, (p) => art.stakeSign(p, "$300K"), L[0], 0.025, L[2], 0.7, 0.48, { flat: true, rot: 0.5 });
          card(out, "rider|flat", 420, 120, (p) => art.soldRider(p), L[0] + 0.12, 0.028, L[2] + 0.28, 0.7, 0.2, { flat: true, rot: 0.5 });
          card(out, "stake|flat", 64, 400, (p) => { p.g.fillStyle = "#f4f1ea"; p.g.fillRect(16, 0, 32, 400); }, L[0] - 0.35, 0.022, L[2] - 0.35, 0.05, 1.0, { flat: true, rot: 0.5 + Math.PI / 2 });
          if (f < TOSS13 + 10) { const u = q((f - TOSS13) / 10, 10); card(out, `puffL${u}`, 400, 400, (p) => fxPuff(p, u), L[0], 0.1, L[2], 0.5, 0.5); }
        }
      }
      break;
    }
    case 14: { // shrug, walk to the office, the door shuts, the CLOSED tag swings
      const at = clerkAt("clerk"), door = obj("hall", "door").p, dx0 = door[0] - 0.45;
      if (f < WALK14[0]) {
        const sh = smooth((f - SHRUG14[0]) / 6) * (1 - smooth((f - SHRUG14[1]) / 6));
        const fo: FrontOpts = { mode: "stand", expr: "neutral", facing: 0, armOff: sh > 0 ? 2 : undefined, headTilt: 0.08 * sh };
        front(out, cam, "clerk", ...at, fo, f, [SHRUG14[0]]);
        if (sh > 0) for (const sd of [-1, 1] as const) { const S = shoulderAt(cam, "clerk", at, fo, sd); arm3d(out, cam, "clerk", at, fo, sd, lerp3(restHand(cam, "clerk", at, fo, sd), [S[0] + sd * 0.34, S[1] + 0.1, S[2] + 0.12], sh), f); }
      } else if (f < WALK14[1] + 2) { // a path in front of the cabinet to the door, then through it
        const pts: V3[] = [at, [at[0] + 0.3, 0, -4.3 + HALL[2]], [dx0 + 0.2, 0, -4.3 + HALL[2]], [door[0], 0, -5.0 + HALL[2]], [door[0], 0, -5.7 + HALL[2]]];
        const u = clamp01((f - WALK14[0]) / (WALK14[1] - WALK14[0] + 2)) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(u)), p = lerp3(pts[i], pts[i + 1], u - i);
        const d = [pts[i + 1][0] - pts[i][0], pts[i + 1][2] - pts[i][2]];
        if (p[2] > -5.3 + HALL[2]) side(out, cam, "clerk", p[0], 0, p[2], d[0] || 0.01, d[1], { mode: "march", phase: walkPhase(f, 1.1), stride: 0.7, expr: "neutral" }, f);
      }
      const t = (f - DOOR14[1]) / FPS, sw = f < DOOR14[1] ? 0 : 0.55 * Math.sin(t * 2.2 * 2 * Math.PI) * Math.exp(-t / 0.5);
      const open = f >= DOOR14[0] && f < DOOR14[1];
      if (!open) card(out, "closedTag", 160, 120, (p) => art.closedTag(p), dx0 + 0.8, 0.88, door[2] + 0.05, 0.14, 0.105, { face: 0, rot: sw });
      break;
    }
    case 15: { // the museum: the slab in its case, the plaque, four visitors with phones, the spotlight
      const sl = obj("museum", "slab").p, pq = obj("museum", "plaque").p;
      slabFx(out, "pika_rain", [sl[0], sl[1], sl[2]], { gleam: (f - 2140) / 24 });
      card(out, "plaque", 800, 560, (p) => art.plaque(p), pq[0], pq[1], pq[2], 0.4, 0.28, { face: 0, tilt: -0.44 });
      card(out, "spot", 300, 600, (p) => art.spotCone(p), ...Mu(0, 2.55, 0), 1.3, 2.6, { soft: true });
      (["v1", "v2", "v3", "v4"] as const).forEach((w, i) => {
        const at = mark("museum", w), toward = at[0] - MUSEUM[0] < 0 ? 1 : -1, sd = toward as 1 | -1;
        const fo: FrontOpts = { mode: "stand", expr: (["smile", "relief_open", "grin", "smile"] as const)[i], facing: sd, look: sd, armOff: sd };
        front(out, cam, w, ...at, fo, f);
        const S = shoulderAt(cam, w, at, fo, sd), ph: V3 = [S[0] + sd * 0.3, S[1] + 0.12, S[2] - 0.12];
        arm3d(out, cam, w, at, fo, sd, ph, f);
        const fl = FLASH15.some((t0) => f >= t0 + i && f < t0 + i + 3 && (FLASH15.indexOf(t0) % 4) === i) ? 1 : 0;
        card(out, `phone${fl}`, 160, 300, (p) => art.phoneBack(p, fl), ph[0], ph[1] + 0.07, ph[2], 0.07, 0.13);
        if (fl) burst(out, f, f, ph[0], ph[1] + 0.09, ph[2] + 0.02, 0.25, 3, "#ffffff");
      });
      break;
    }
  }
  return out;
};
const at3 = (o: V3, x: number, y: number, z: number): V3 => [o[0] + x, o[1] + y, o[2] + z];
