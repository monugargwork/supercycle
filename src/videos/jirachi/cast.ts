// The Jirachi reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, RO, WA, HO, ST, clamp01, smooth, easeOut, pop, mark, obj, hop, ROOM, WARD, HOME, STUDIO,
  SLAP1, WAVE2, SHOW2, TEARS3, PINCH4, TEAR4, FAN4, PULL4, GLEAM4, GAPE4, RAISE4, SLIDE_A, SLIDE_B, DROP7, TAP11,
  STAND13, STEP13, CURT13, DOWN13, STROKE15, LIFT15, PINCH17, TEAR17, PULL17, GRIN17, GLEAM17,
} from "./story";
import * as art2 from "./art2";
import { DESK_Y } from "./sets";
import { LOOKS } from "./looks";
import { TCG } from "./art";
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
const IDX: Record<Who, number> = { seller: 3, avery: 4, mum: 5, dad: 6, artist: 7 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[jirachi] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Rw = (x: number, y: number, z: number) => at(RO, x, y, z);
const Ww = (x: number, y: number, z: number) => at(WA, x, y, z);
const Hw = (x: number, y: number, z: number) => at(HO, x, y, z);
const Sw = (x: number, y: number, z: number) => at(ST, x, y, z);
const toLocal = (o: V3, p: V3): number[] => [p[0] - o[0], p[1] - o[1], p[2] - o[2]];
// seat heights in head-heights above the soles (an adult head-height is ~0.51 m, a kid's ~0.485 m)
const SEAT_STOOL = 1.25, SEAT_BED = 1.12, SEAT_CHAIR = 0.9;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
/** a pulled card in hand (billboard): the real scan, h metres tall */
const handCard = (out: Stage, img: string, p: V3, h = 0.16, rot = 0) => tcardFx(out, img, p, h, { img, rot });
const flat = (out: Stage, key: string, draw: (p: Pen) => void, p: V3, s: number, rot = 0) => card(out, key, 200, 200, draw, p[0], p[1], p[2], s, s, { flat: true, rot });
/** a paper falling from a0 to a1 over n frames with side drift; lies flat at a1 afterwards */
const flutter = (out: Stage, key: string, draw: (p: Pen) => void, f: number, f0: number, n: number, a0: V3, a1: V3, s: number, seed: number) => {
  if (f < f0) { flat(out, key, draw, a0, s, seed); return; }
  const u = clamp01((f - f0) / n);
  if (u >= 1) { flat(out, key, draw, a1, s, seed); return; }
  const k = u * u, sw = 0.05 * Math.sin(u * 9 + seed) * (1 - u);
  const p: V3 = [lerpN(a0[0], a1[0], u) + sw, lerpN(a0[1], a1[1], k), lerpN(a0[2], a1[2], u)];
  card(out, key, 200, 200, draw, p[0], p[1], p[2], s, s, { rot: 2 * Math.sin(u * 6 + seed), tilt: 1.2 * u, face: seed });
};
const wrapDraw = (k: number) => (p: Pen) => art2.wrapper(p, k);

/** the seller on his stool; in S01 he slaps the top-loaded card onto the easel */
const seller = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = Rw(ROOM.seller[0], 0, ROOM.seller[1]);
  const expr = id === 14 ? (f > 1866 ? "nervous" : "smile") : id === 1 || id === 7 ? "grin" : "smile_closed";
  const fo: FrontOpts = { mode: "sit", chair: SEAT_STOOL, expr, facing: id === 1 ? -1 : 0, look: id === 1 ? -1 : id === 7 ? 1 : 0, armOff: id === 1 ? -1 : undefined };
  front(out, cam, "seller", ...P, fo, f, id === 14 ? [1866] : []);
  if (id === 14 && f > 1870) card(out, "sweat", 120, 160, (pp) => { pp.ell(60, 90, 26, 40, "#bfe6ff", 5); }, P[0] + 0.12, P[1] + 1.42, P[2] + 0.05, 0.05, 0.07);
  if (id !== 1) return;
  const cardP = Rw(...(ROOM.card as V3)), up: V3 = [cardP[0] + 0.06, cardP[1] + 0.24, cardP[2] + 0.14];
  let hand: V3;
  if (f < 20) hand = lerp3([up[0] + 0.05, up[1] - 0.12, up[2] + 0.05], up, smooth(f / 20));
  else if (f < 27) hand = up;
  else if (f < SLAP1) hand = lerp3(up, [cardP[0], cardP[1] + 0.03, cardP[2] + 0.004], (f - 27) / 2);
  else if (f < SLAP1 + 10) hand = [cardP[0], cardP[1] + 0.03, cardP[2] + 0.004];
  else hand = lerp3([cardP[0], cardP[1] + 0.03, cardP[2] + 0.004], restHand(cam, "seller", P, fo, -1), smooth((f - SLAP1 - 10) / 14));
  const H = arm3d(out, cam, "seller", P, fo, -1, hand, f);
  if (f < SLAP1) handCard(out, "jirachi_sir", [H[0], H[1] - 0.04, H[2] + 0.01], 0.14, 0.15);
  burst(out, f, SLAP1, cardP[0], cardP[1] + 0.02, cardP[2] + 0.03, 0.22, 6, "#ffffff");
};
/** the two torn wrappers knocked off the desk by the slap: they flutter down and stay on the floor */
const roomFloor = (out: Stage, f: number, id: number) => {
  const a0: V3 = Rw(-0.25, DESK_Y + 0.003, -1.66), a1: V3 = Rw(-0.42, 0.004, -1.38), b0: V3 = Rw(-0.12, DESK_Y + 0.003, -1.64), b1: V3 = Rw(0.08, 0.004, -1.3);
  if (id === 1) { flutter(out, "wrapA", wrapDraw(0), f, SLAP1 + 1, 28, a0, a1, 0.11, 0.4); flutter(out, "wrapB", wrapDraw(1), f, SLAP1 + 3, 32, b0, b1, 0.1, 2.1); }
  else { flat(out, "wrapA", wrapDraw(0), a1, 0.11, 0.4); flat(out, "wrapB", wrapDraw(1), b1, 0.1, 2.1); }
};
/** Avery on the edge of his bed */
const AVERY_P = () => Ww(WARD.avery[0], 0, WARD.avery[1]);
const packFx = (out: Stage, p: V3, torn: boolean, h = 0.13, rot = 0) => card(out, `pack|${torn}`, 220, 360, (pp) => art2.pack(pp, torn), p[0], p[1], p[2], h * 0.61, h, { rot });
const stripFx = (out: Stage, p: V3, s = 0.08, rot = 0, isFlat = false) => card(out, "strip", 220, 44, (pp) => art2.strip(pp), p[0], p[1], p[2], s, s * 0.2, isFlat ? { flat: true, rot } : { rot });
/** both hands at the chest holding something at point c (returns the point) */
const bothHands = (out: Stage, cam: CamInfo, who: Who, P: V3, fo: FrontOpts, c: V3, f: number) => {
  const r = cam.right; const off = 0.035;
  arm3d(out, cam, who, P, fo, -1, [c[0] - r.x * off, c[1] - 0.02, c[2] - r.z * off], f);
  arm3d(out, cam, who, P, fo, 1, [c[0] + r.x * off, c[1] - 0.02, c[2] + r.z * off], f);
};
/** an opening: pinch (pA..tear), tear on `tear`, cards fanned, the Jirachi up on pull[0..1], raised toward the lens from `raise` */
const opening = (out: Stage, cam: CamInfo, f: number, P: V3, fo: FrontOpts, o: { pinch: number; tear: number; fan: number[]; pull: number[]; raise: number; gleam: number }) => {
  const c = chestAt(cam, "avery", P, fo, 0.34, 0.22);
  if (f < o.tear) { bothHands(out, cam, "avery", P, fo, c, f); packFx(out, [c[0], c[1] + 0.04, c[2]], false, 0.13, f >= o.pinch ? -0.06 : 0); return; }
  // the strip flies off to the blanket and stays
  const s0: V3 = [c[0], c[1] + 0.11, c[2]], s1: V3 = Ww(0.24, WARD.mattress + 0.037, -1.62);
  const su = clamp01((f - o.tear) / 14);
  if (su < 1) stripFx(out, [lerpN(s0[0], s1[0], su), s0[1] + 0.18 * Math.sin(Math.PI * su) * (1 - su) + (s1[1] - s0[1]) * su * su, lerpN(s0[2], s1[2], su)], 0.08, 3 * su);
  else stripFx(out, s1, 0.08, 0.6, true);
  if (f < o.fan[0]) { bothHands(out, cam, "avery", P, fo, c, f); packFx(out, [c[0], c[1] + 0.04, c[2]], true); return; }
  // the emptied wrapper drops on the blanket at fan[1]
  const w1: V3 = Ww(-0.22, WARD.mattress + 0.037, -1.58);
  if (f >= o.fan[1]) flat(out, "wrapA", wrapDraw(0), w1, 0.11, 1.1);
  const k = f < o.pull[0] ? Math.min(3, Math.floor((f - o.fan[0]) / 4)) : 4;
  const commons = TCG.packs;
  if (f < o.raise) {
    bothHands(out, cam, "avery", P, fo, c, f);
    // the stack: the current top card, the Jirachi rising out of it on the pull
    if (k < 4) handCard(out, commons[k % commons.length], [c[0], c[1] + 0.07, c[2]]);
    else {
      handCard(out, commons[3], [c[0], c[1] + 0.06, c[2] - 0.004]);
      const pu = smooth((f - o.pull[0]) / (o.pull[1] - o.pull[0]));
      handCard(out, "jirachi_sir", [c[0], c[1] + 0.07 + 0.05 * pu, c[2] + 0.004], 0.17);
    }
  } else {
    const ru = smooth((f - o.raise) / 20), lift: V3 = [c[0] - cam.fwd.x * 0.12 + cam.right.x * 0.12, c[1] + 0.1, c[2] - cam.fwd.z * 0.12 + cam.right.z * 0.12];
    const cp: V3 = [lerpN(c[0], lift[0], ru), lerpN(c[1] + 0.12, lift[1], ru), lerpN(c[2], lift[2], ru)];
    bothHands(out, cam, "avery", P, fo, [cp[0], cp[1] - 0.05, cp[2]], f);
    handCard(out, "jirachi_sir", cp, 0.17);
  }
  // the gleam: a small sparkle off the card's corner (never over the art)
  const top: V3 = f < o.raise ? [c[0], c[1] + 0.13, c[2]] : [c[0] - cam.fwd.x * 0.1, c[1] + 0.2, c[2] - cam.fwd.z * 0.1];
  sparkle(out, f, o.gleam, top[0] + cam.right.x * 0.08, top[1] + 0.07, top[2] + cam.right.z * 0.08, 0.07, 16);
};
const averyAt = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = AVERY_P();
  const base: FrontOpts = { mode: "sit", chair: SEAT_BED, armOff: 2, facing: 0 };
  if (id === 2) {
    const fo: FrontOpts = { ...base, expr: f < WAVE2[1] + 6 ? "smile" : "grin", armOff: f < SHOW2 ? undefined : 2, wave: f >= WAVE2[0] && f < WAVE2[1] ? 0.5 + 0.5 * Math.sin((f - WAVE2[0]) * 0.45) : undefined };
    front(out, cam, "avery", ...P, fo, f, [WAVE2[0], SHOW2]);
    if (f >= SHOW2) { const c = chestAt(cam, "avery", P, fo, 0.45, 0.18); const lift = smooth((f - SHOW2) / 12); const cc: V3 = [c[0], c[1] + 0.04 + 0.06 * lift, c[2]]; bothHands(out, cam, "avery", P, fo, cc, f); packFx(out, [cc[0], cc[1] + 0.04, cc[2]], false); }
    return;
  }
  if (id === 3) {
    const fo: FrontOpts = { ...base, expr: "grin" };
    front(out, cam, "avery", ...P, fo, f, TEARS3);
    const c = chestAt(cam, "avery", P, fo, 0.5, 0.18);
    const n = TEARS3.filter((t) => f >= t).length, t0 = n ? TEARS3[n - 1] : -100, dt = f - t0;
    const binTop = Ww(WARD.bin[0], 0.34, WARD.bin[1]);
    if (n && dt < 16) { // tossing the wrapper from the last tear
      const u = dt / 16; const p0: V3 = [c[0], c[1] + 0.05, c[2]];
      card(out, "wrapToss", 200, 200, wrapDraw(n), lerpN(p0[0], binTop[0], u), p0[1] + (binTop[1] - p0[1]) * u + 0.35 * Math.sin(Math.PI * u), lerpN(p0[2], binTop[2], u), 0.09, 0.09, { rot: 4 * u });
      if (dt < 4) stripFx(out, [c[0] + cam.right.x * 0.1 * dt, c[1] + 0.14 + 0.03 * dt, c[2] + cam.right.z * 0.1 * dt], 0.08, dt);
      arm3d(out, cam, "avery", P, fo, 1, lerp3([c[0], c[1], c[2]], [c[0] + cam.right.x * 0.3, c[1] + 0.15, c[2] + cam.right.z * 0.3], Math.sin(Math.PI * Math.min(1, u * 1.4))), f);
      arm3d(out, cam, "avery", P, fo, -1, restHand(cam, "avery", P, fo, -1), f);
    } else { bothHands(out, cam, "avery", P, fo, c, f); packFx(out, [c[0], c[1] + 0.04, c[2]], false); }
    return;
  }
  if (id === 4 || id === 17) {
    const o = id === 4 ? { pinch: PINCH4, tear: TEAR4, fan: FAN4, pull: PULL4, raise: RAISE4[0], gleam: GLEAM4 } : { pinch: PINCH17, tear: TEAR17, fan: [TEAR17 + 4, PULL17[0] - 1], pull: PULL17, raise: PULL17[1] + 12, gleam: GLEAM17 };
    const shock = id === 4 && f >= GAPE4[0] && f < GAPE4[1], gape = shock ? Math.sin(Math.PI * (f - GAPE4[0]) / (GAPE4[1] - GAPE4[0])) * 0.7 : 0;
    const grin = id === 4 ? f >= GAPE4[1] : f >= GRIN17;
    const fo: FrontOpts = { ...base, expr: shock ? "shock" : grin ? "grin" : f >= o.pinch ? "smile" : "smile_closed", gape: shock ? q(gape, 20) : undefined, look: 0 };
    front(out, cam, "avery", ...P, fo, f, id === 4 ? [GAPE4[0], GAPE4[1]] : [GRIN17]);
    opening(out, cam, f, P, fo, o);
  }
};
const MUM_FO = (f: number, id: number): FrontOpts => ({ mode: "sit", chair: SEAT_CHAIR, expr: "sad", look: 0, prop: id === 13 && f >= DOWN13 - 6 ? null : ["hold", "phone"], armOff: id === 13 && f >= DOWN13 - 6 ? 2 : undefined });
const family = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const M = Hw(HOME.mum[0], 0, HOME.mum[1]), mo = MUM_FO(f, id);
  front(out, cam, "mum", ...M, mo, f, id === 13 ? [DOWN13] : []);
  if (id === 13 && f >= DOWN13 - 6) { // laying the phone face down, then her hands rest beside it
    const ph = Hw(HOME.mum[0], HOME.table_y + 0.01, HOME.table[1] - 0.25);
    arm3d(out, cam, "mum", M, mo, -1, [ph[0] - 0.05, ph[1], ph[2]], f); arm3d(out, cam, "mum", M, mo, 1, [ph[0] + 0.05, ph[1], ph[2]], f);
  }
  const seated = id < 13 || f < STAND13[0] + 5;
  if (seated) {
    const D = Hw(HOME.dad[0], 0, HOME.dad[1]), fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: "sad", facing: -1, look: -1, armOff: -1 };
    front(out, cam, "dad", ...D, fo, f);
    arm3d(out, cam, "dad", D, fo, -1, shoulderAt(cam, "mum", M, mo, 1).map((v, i) => v + [0, 0.02, 0][i]) as V3, f);
    return;
  }
  // S13: stands, steps back to the window, draws both curtains
  const from = Hw(HOME.dad[0], 0, HOME.dad[1]), to = Hw(HOME.dad_win[0], 0, HOME.dad_win[1]);
  const u = smooth(ramp(f, STEP13[0], STEP13[1])), D: V3 = lerp3(from, to, u);
  const pulling = f >= CURT13[0] - 6;
  const fo: FrontOpts = { mode: f < STEP13[1] && f >= STEP13[0] ? "stroll" : "stand", phase: walkPhase(f, 1.2), expr: "sad", look: 0, armOff: pulling ? 2 : undefined };
  front(out, cam, "dad", ...D, fo, f, [STAND13[0]]);
  if (pulling) {
    const k = curtainK(f, id), [wx, wy] = HOME.window, inL = wx - 0.52 + 0.52 * k, inR = wx + 0.52 - 0.52 * k;
    arm3d(out, cam, "dad", D, fo, -1, Hw(inL, wy - 0.05, -2.33), f); arm3d(out, cam, "dad", D, fo, 1, Hw(inR, wy - 0.05, -2.33), f);
  }
};
/** curtains: 0 open .. 1 closed */
export const curtainK = (f: number, id: number) => id < 13 ? 0 : id > 13 ? 1 : smooth(ramp(f, CURT13[0], CURT13[1]));
const artist = (out: Stage, cam: CamInfo, f: number) => {
  const A = Sw(STUDIO.artist[0], 0, STUDIO.artist[1]);
  const lifted = f >= LIFT15[0];
  const fo: FrontOpts = { mode: "stand", expr: f >= 2050 ? "smile_closed" : "smile", facing: 1, look: 1, armOff: 1 };
  front(out, cam, "artist", ...A, fo, f, [2050]);
  const pk = paintingPose(f);
  if (!lifted) {
    const s = Math.sin((f - STROKE15[0]) * 0.22) * 0.07, edge = boardPoint(-0.15, s);
    const H = arm3d(out, cam, "artist", A, fo, 1, [edge[0] - 0.03, edge[1] + 0.03, edge[2] + 0.05], f);
    seg3d(out, cam, H, [H[0] + 0.035, H[1] - 0.02, H[2] - 0.04], 0.008, "#8a5a34");
  } else {
    const L: V3 = Sw(pk.p[0] - 0.17, pk.p[1] - 0.05, pk.p[2] + 0.01);
    arm3d(out, cam, "artist", A, fo, 1, L, f);
  }
};
/** a point on the tilted drawing board (board-local x, y), in the world */
const boardPoint = (x: number, y: number): V3 => { const [bx, by, bz] = STUDIO.board, t = STUDIO.tilt; return Sw(bx + x, by + y * Math.cos(t), bz - y * Math.sin(t) + 0.02); };
/** the painting: on the board, then lifted upright into the window light (set-local position, x rotation) */
export const paintingPose = (f: number): { p: V3; rx: number } => {
  const on: V3 = [STUDIO.painting[0], STUDIO.painting[1], STUDIO.painting[2] + 0.02], L = STUDIO.lifted as V3;
  const u = smooth(ramp(f, LIFT15[0], LIFT15[1]));
  return { p: [lerpN(on[0], L[0], u), lerpN(on[1], L[1], u) + 0.06 * Math.sin(Math.PI * u), lerpN(on[2], L[2], u)], rx: -STUDIO.tilt * (1 - u) };
};
/** where the cash stacks are (set-local bottom centres) and their tilt */
export const bundleAt = (i: number, id: number, f: number): { p: V3; rz: number } => {
  const [x0, z0] = ROOM.bundles[i] as number[], keeper = i === ROOM.keeper;
  const ff = id < 7 ? -1e9 : id > 7 ? 1e9 : f;
  let x = x0 + 0.06 * easeOut(ramp(ff, SLIDE_A[0], SLIDE_A[1]));
  if (!keeper) x -= 0.34 * easeOut(ramp(ff, SLIDE_B[0] + (i % 5) * 1.5, SLIDE_B[1] + (i % 5) * 1.5));
  let y = DESK_Y, z = z0, rz = 0;
  if (keeper) {
    const u = ramp(ff, DROP7[0], DROP7[1]), bx = ROOM.box[0], top = DESK_Y + 0.31;
    if (u > 0) {
      x = lerpN(x, bx, u); z = lerpN(z0, ROOM.box[2], u);
      y = u < 1 ? DESK_Y + (top - DESK_Y) * Math.sin(Math.PI * Math.min(1, u * 1.15)) * (u < 0.55 ? 1 : 1) - (u > 0.87 ? 0 : 0) : DESK_Y + 0.012;
      if (u > 0.6) y = lerpN(DESK_Y + (top - DESK_Y) * Math.sin(Math.PI * 0.69), DESK_Y + 0.012, (u - 0.6) / 0.4);
      rz = -0.5 * Math.sin(Math.PI * u);
      if (u >= 1) { y = DESK_Y + 0.012 + Math.max(0, hop(ff, DROP7[1], 0.25)); rz = 0; }
    }
  }
  return { p: [x, y, z], rz };
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  const place = SHOTS[id - 1].place;
  if (place === "room") { seller(out, cam, f, id); roomFloor(out, f, id); }
  if (place === "ward") {
    if (id !== 5) averyAt(out, cam, f, id);
    // what Avery left on the blanket (before the bed was made)
    if (id === 4 && f >= TEAR4 + 14) { /* drawn by opening() */ }
  }
  if (place === "home") {
    if (id !== 11) family(out, cam, f, id);
    if (id === 11 && f >= TAP11 - 8 && f < TAP11 + 8) { // her finger (a plain stick line from below the frame) taps POST
      const u = f < TAP11 ? smooth((f - TAP11 + 8) / 7) : 1 - smooth((f - TAP11 - 2) / 6);
      const btn = phoneButton(), from = Hw(HOME.mum[0] + 0.12, 0.7, HOME.mum[1] + 0.15);
      seg3d(out, cam, from, lerp3(lerp3(from, btn, 0.75), btn, u), 0.022, LOOKS.mum.jacket, 0.024);
    }
    // the candle flame's glow
    const cf = Hw(HOME.candle[0], HOME.table_y + 0.09, HOME.candle[2]);
    if (id !== 11) glowAt(out, "candle", cf, 0.18 + 0.02 * Math.sin(f * 0.7), "255,200,120");
  }
  if (place === "studio") artist(out, cam, f);
  return out;
};
/** the POST button on mum's phone (S11), in the world */
export const PHONE_EYE = (): V3 => Hw(HOME.mum[0], 1.29, HOME.mum[1]);
export const phoneButton = (): V3 => { const p = Hw(...(HOME.phone as V3)); return [p[0], p[1] - 0.036, p[2] - 0.043]; };
