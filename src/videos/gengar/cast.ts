// The Gengar reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxSplash, fxShadow, fxContact, fxRing, Outfit, FrontOpts, SideOpts, SKIN } from "../../engine/toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, HAo, CNo, CFo, DKo, clamp01, smooth, easeOut, hop, HALLP, CENP, CAFP, DESKP,
  WIND1, SLAM1, WALK2, REACH2, FLICK2, LIFT2, FW3, BIDS4, PULLS5, TOP5, WIND6, SLAM6, SPOT7, POP8, FREEZE9, WALK9, BILL9, POINT9,
  FAN10, TUCK10, IOU10, MEGA11, THUMP11, ENV11, STAMP11, SHOCK12, BTN13, RAISE14, DOWN14, PHONE14, PAID14, POP14, DRIFT15,
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
const IDX: Record<Who, number> = { auct: 3, clerk: 4, spokes: 5, b1: 6, b2: 7, b3: 8, c1: 9, c2: 10, c3: 11, c4: 12, waiter: 13, borrower: 14, lender: 15, writer: 16 };

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
  if (d > L) { H = add3(S, [v.x, v.y, v.z], (L - 1e-3) / d); if (d > L + 0.02) console.warn(`[gengar] f${f} ${who} arm short by ${(d - L).toFixed(2)} m`); }
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
const Hm = (x: number, y: number, z: number) => at(HAo, x, y, z);
const Cm = (x: number, y: number, z: number) => at(CNo, x, y, z);
const Fm = (x: number, y: number, z: number) => at(CFo, x, y, z);
const Dm = (x: number, y: number, z: number) => at(DKo, x, y, z);
// seat heights in head-heights above the soles (an adult head-height is ~0.51 m)
const SEAT_STOOL = 1.25, SEAT_CHAIR = 0.92;
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
const ramp = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const flat = (out: Stage, key: string, draw: (p: Pen) => void, p: V3, s: number, rot = 0, cw = 200, ch = 200, h?: number) => card(out, key, cw, ch, draw, p[0], p[1], p[2], s, h ?? s, { flat: true, rot });
const H = HALLP, CN = CENP, CF = CAFP, DK = DESKP, SY = H.stage_y;
const fxc = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, p: V3, w: number, h: number, extra: Partial<FxPlace> = {}) => card(out, key, cw, ch, draw, p[0], p[1], p[2], w, h, extra);
const near = (cam: CamInfo, P: V3, d = 0.45) => cam.pos.distanceTo(new THREE.Vector3(P[0], P[1] + 1.3, P[2])) < d;
const talkOpen = (f: number, a: number, b: number) => f >= a && f < b && Math.floor((f - a) / 5) % 2 === 1;
/** the up vector of a billboard card turned by rot (screen space), as a world direction */
const cardUp = (cam: CamInfo, rot: number): V3 => { const r = cam.right, u = cam.up, s = -Math.sin(rot), c = Math.cos(rot); return [r.x * s + u.x * c, r.y * s + u.y * c, r.z * s + u.z * c]; };

// ---------------- the auctioneer (S01, S04, S06) and the spokesman (S13) ----------------
const AUCT = (): V3 => Hm(H.auct[0], SY, H.auct[1]);
const BLOCK = (): V3 => Hm(H.block[0], H.block[1] + 0.03, H.block[2]);
const auctioneer = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = AUCT(), [w0, w1] = id === 6 ? WIND6 : WIND1, T = id === 6 ? SLAM6 : SLAM1;
  const after = id !== 4 && f >= T;
  const fo: FrontOpts = { mode: "stand", expr: after ? "laugh" : id === 4 && f > 700 ? "smile" : "grin", armOff: -1 };
  front(out, cam, "auct", ...P, fo, f, id === 4 ? [] : [T]);
  // the gavel head lands on the block; the hand holds the handle 10 cm to the left of the head (screen)
  const r = cam.right, B = BLOCK(), off = (k: number): V3 => [B[0] - r.x * 0.1, B[1] + 0.035 + k, B[2] - r.z * 0.1];
  const rest = off(0.12), top = off(0.3), hit = off(0);
  let hand: V3;
  if (id === 4) hand = off(0.1 + 0.03 * Math.sin(f * 0.2));
  else if (f < w0) hand = rest; else if (f < w0 + 3) hand = lerp3(rest, top, smooth((f - w0) / 3)); else if (f < w1) hand = top;
  else if (f < T) hand = lerp3(top, hit, (f - w1) / (T - w1)); else if (f < T + 5) hand = hit; else hand = lerp3(hit, rest, smooth((f - T - 5) / 10));
  const Hd = arm3d(out, cam, "auct", P, fo, -1, hand, f);
  fxc(out, "gavel", 260, 110, (pp) => art2.gavel(pp), [Hd[0] + r.x * 0.06, Hd[1], Hd[2] + r.z * 0.06], 0.15, 0.064);
  if (f >= T && f < T + 6 && id !== 4) burst(out, f, T, B[0], B[1] + 0.04, B[2], 0.25, 6, "#fff3b0");
};
const spokesman = (out: Stage, cam: CamInfo, f: number) => {
  const P = AUCT(), talk = talkOpen(f, 1962, 2024) || talkOpen(f, 2034, 2046);
  const fo: FrontOpts = { mode: "stand", expr: talk ? "relief_open" : "smile", armOff: -1 };
  front(out, cam, "spokes", ...P, fo, f, [BTN13 + 2]);
  const btn = Hm(-1.15, H.rostrum_y + 0.025, -2.84), up: V3 = [btn[0], btn[1] + 0.1, btn[2] - 0.04];
  const hand = f < BTN13 - 6 ? restHand(cam, "spokes", P, fo, -1) : f < BTN13 ? lerp3(up, btn, smooth((f - BTN13 + 6) / 6)) : f < BTN13 + 6 ? btn : lerp3(btn, up, smooth((f - BTN13 - 6) / 8));
  arm3d(out, cam, "spokes", P, fo, -1, hand, f);
};

// ---------------- the clerk (S02 the tag, S05 the pole) ----------------
const TAG_EDGE = (): V3 => Hm(H.tag_top[0] + H.tag_size[0] * 0.84, H.tag_top[1] - H.tag_len - H.tag_size[1] * 0.55, H.tag_top[2] + 0.004);
const clerkTag = (out: Stage, cam: CamInfo, f: number) => {
  const A = Hm(H.clerk_in[0], SY, H.clerk_in[1]), B = Hm(H.clerk_tag[0], SY, H.clerk_tag[1]);
  if (f < WALK2[0]) return;
  if (f < WALK2[1]) { const u = ramp(f, WALK2[0], WALK2[1]); side(out, cam, "clerk", ...lerp3(A, B, u), -1, 0, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "neutral" }, f); return; }
  const shock = f >= LIFT2;
  const fo: FrontOpts = { mode: "stand", expr: shock ? "shock" : "neutral", gape: shock ? Math.min(0.4, (f - LIFT2) / 8 * 0.4) : undefined, look: f < LIFT2 ? -1 : 0, headTilt: shock ? -0.12 : 0, armOff: 1 };
  front(out, cam, "clerk", ...B, fo, f, [WALK2[1], LIFT2]);
  const E = TAG_EDGE(), rest = restHand(cam, "clerk", B, fo, 1);
  const hand = f < REACH2 - 6 ? rest : f < REACH2 ? lerp3(rest, E, smooth((f - REACH2 + 6) / 6)) : f < FLICK2 ? E : f < FLICK2 + 3 ? lerp3(E, [E[0] - cam.right.x * 0.04, E[1], E[2] - cam.right.z * 0.04], (f - FLICK2) / 3) : lerp3(E, rest, smooth((f - FLICK2 - 3) / 10));
  arm3d(out, cam, "clerk", B, fo, 1, hand, f);
};
/** the pending marker's height on the pole (set-local y): eased per haul, a small overshoot at the top */
export const markerY = (id: number, f: number) => {
  const y0 = 1.0, y1 = SY + H.new / H.mark_k;
  if (id < 5) return y0;
  if (id > 5 || f >= TOP5 + 12) return y1;
  let k = 0;
  PULLS5.forEach((t) => { k += smooth(ramp(f, t, t + 12)) / PULLS5.length; });
  const over = f >= TOP5 ? 0.012 * Math.sin((f - TOP5) * 0.5) * Math.exp(-(f - TOP5) / 5) : 0;
  return y0 + (y1 - y0) * k + over;
};
const clerkPole = (out: Stage, cam: CamInfo, f: number) => {
  const P = Hm(H.clerk_pole[0], SY, H.clerk_pole[1]);
  const done = f >= TOP5;
  const fo: FrontOpts = { mode: "stand", expr: done ? "smile" : f >= PULLS5[0] ? "pained" : "neutral", look: 1, armOff: done ? undefined : 2 };
  front(out, cam, "clerk", ...P, fo, f, [PULLS5[0], TOP5]);
  if (done) return;
  const cx = H.pole[0] - 0.08, cz = H.pole[1] + 0.01;
  // hand over hand: one hand pulls down from 1.8 to 1.35 m while the other climbs back up
  const j = Math.max(0, PULLS5.findIndex((t) => f < t + 14)), t0 = PULLS5[Math.max(0, j)] ?? PULLS5[0], u = f < PULLS5[0] ? 0 : smooth(ramp(f, t0, t0 + 12));
  const hi = 1.8, lo = 1.36, a = lerpN(hi, lo, u), b2 = lerpN(lo, hi, u), even = j % 2 === 0;
  arm3d(out, cam, "clerk", P, fo, -1, Hm(cx, even ? a : b2, cz), f);
  arm3d(out, cam, "clerk", P, fo, 1, Hm(cx + 0.005, even ? b2 : a, cz), f);
};

// ---------------- S03 fireworks around the slab (never over the card) ----------------
const fireworks = (out: Stage, f: number) => {
  const S = Hm(H.slab[0], H.slab[1], H.slab[2]), spots: [number, number, number, string][] = [[-0.16, 0.07, -0.12, "#ffd23a"], [0.15, 0.13, -0.14, "#ff6bd5"], [0.17, -0.05, -0.12, "#6bd5ff"]];
  FW3.forEach((t, i) => { const [dx, dy, dz, col] = spots[i]; burst(out, f, t, S[0] + dx * 1.4, S[1] + dy * 1.3, S[2] + dz, 0.26, 14, col); burst(out, f, t + 3, S[0] + dx * 1.4, S[1] + dy * 1.3, S[2] + dz - 0.01, 0.16, 10, "#ffffff"); sparkle(out, f, t + 5, S[0] + dx * 1.6, S[1] + dy * 1.5, S[2] + dz, 0.14, 14); });
};

// ---------------- S04 the bidders ----------------
const BIDDERS: Who[] = ["b1", "b2", "b3"], PADDLE_N = [17, 42, 88];
const bidders = (out: Stage, cam: CamInfo, f: number) => {
  BIDDERS.forEach((who, i) => {
    const [x, z] = H.bidders[i], P = Hm(x, 0, z);
    let k = 0;
    BIDS4.forEach((t, n) => { if (n % 3 !== i) return; const d = f - t; const v = d < 0 ? 0 : d < 3 ? d / 3 : d < 5 ? 1 : d < 9 ? 1 - (d - 5) / 4 : 0; k = Math.max(k, v); });
    const expr = i === 1 && f >= BIDS4[31] ? "grin" : f > 700 ? "nervous" : "stern";
    const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: expr as FrontOpts["expr"], armOff: -1 };
    front(out, cam, who, ...P, fo, f, [700, BIDS4[31]]);
    const low = holdHand(cam, who, P, fo, -1, 0.12), sh = shoulderAt(cam, who, P, fo, -1), high: V3 = [sh[0] - cam.right.x * 0.12, sh[1] + 0.4, sh[2] - cam.fwd.z * 0.1];
    const Hd = arm3d(out, cam, who, P, fo, -1, lerp3(low, high, smooth(k)), f);
    fxc(out, `paddle${i}`, 300, 470, (pp) => art2.paddle(pp, PADDLE_N[i]), [Hd[0], Hd[1] + 0.1, Hd[2]], 0.13, 0.2);
  });
};

// ---------------- the champagne table (S08, S09, S14) ----------------
const COLL: Who[] = ["c1", "c2", "c3", "c4"];
const BOTTLE_ROT = 0.5;
/** where each cork comes to rest on the floor (world), and its flight from the neck at POP */
const corkRest = (i: number): V3 => Hm(H.coll[Math.min(3, i)][0] + [-0.35, 0.2, -0.15, 0.4, -0.1][i], 0.012, [2.8, 3.1, 2.6, 2.95, 2.75][i]);
const corkFly = (out: Stage, f: number, t0: number, tip: V3, i: number) => {
  const R = corkRest(i), draw = (pp: Pen) => art2.cork(pp);
  if (f < t0) return;
  const t = (f - t0) / FPS, vy = 3.4, vz = (R[2] - tip[2]) / 1.15, vx = (R[0] - tip[0]) / 1.15;
  // flight to the first floor contact (~1.0 s), then two small hops toward the rest point
  const T1 = (vy + Math.sqrt(vy * vy + 19.6 * (tip[1] - 0.012))) / 9.8;
  let p: V3;
  if (t < T1) p = [tip[0] + vx * t * (1.15 / T1) * 0.85, tip[1] + vy * t - 4.9 * t * t, tip[2] + vz * t * (1.15 / T1) * 0.85];
  else { const g = (t - T1); const land: V3 = [tip[0] + vx * 1.15 * 0.85, 0.012, tip[2] + vz * 1.15 * 0.85], u = clamp01(g / 0.6); p = [lerpN(land[0], R[0], easeOut(u)), 0.012 + Math.max(0, hop(f, t0 + Math.round(T1 * FPS), 1.2)), lerpN(land[2], R[2], easeOut(u))]; }
  if (t >= T1 + 0.6 && p[1] < 0.02) { flat(out, `corkF${i}`, draw, R, 0.05, i * 1.3, 64, 64); return; }
  card(out, "cork", 64, 64, draw, p[0], p[1], p[2], 0.05, 0.05, { rot: t * 14 + i });
};
/** corks lying where they landed (after S08; the fifth after the S14 pop) */
const corksDown = (out: Stage, n: number) => { for (let i = 0; i < n; i++) flat(out, `corkF${i}`, (pp) => art2.cork(pp), corkRest(i), 0.05, i * 1.3, 64, 64); };
const bottleAt = (out: Stage, cam: CamInfo, hand: V3, rot: number, popped: boolean, key: string): V3 => {
  const u = cardUp(cam, rot), c: V3 = [hand[0] + u[0] * 0.05, hand[1] + u[1] * 0.05, hand[2] + u[2] * 0.05];
  fxc(out, `bottle${key}|${popped}`, 120, 420, (pp) => art2.bottle(pp, popped), c, 0.1, 0.35, { rot });
  return [c[0] + u[0] * 0.17, c[1] + u[1] * 0.17, c[2] + u[2] * 0.17];
};
const party = (out: Stage, cam: CamInfo, f: number, id: number) => {
  COLL.forEach((who, i) => {
    const [x, z] = H.coll[i], P = Hm(x, 0, z);
    const frozen = id === 9 && f >= FREEZE9 && f < FREEZE9 + 60;
    const pointing = id === 9 && f >= POINT9 - 4;
    const expr = id === 8 ? (f >= POP8 ? "laugh" : "grin") : frozen ? "laugh" : pointing ? "nervous" : f >= 1352 ? "nervous" : "laugh";
    const look = id === 9 && f >= 1352 && f < POINT9 - 4 ? (i < 2 ? 1 : 1) : pointing ? (i === 3 ? -1 : 1) : 0;
    const fo: FrontOpts = { mode: "stand", expr: expr as FrontOpts["expr"], look, armOff: 2 };
    front(out, cam, who, ...P, fo, frozen ? FREEZE9 : f, [POP8, 1352, POINT9 - 4]);
    // left arm: the bottle (tilted up, the neck toward the lens side)
    const rest = holdHand(cam, who, P, fo, 1, 0.16), up: V3 = [rest[0], rest[1] + 0.18, rest[2] + 0.06];
    const lift = id === 8 ? smooth(ramp(f, 1240, 1250)) : 1;
    const hb = arm3d(out, cam, who, P, fo, 1, lerp3(rest, up, lift), f);
    const rot = -BOTTLE_ROT * (i % 2 ? 1 : 0.7);
    const popped = id > 8 || f >= POP8;
    const tip = bottleAt(out, cam, hb, rot, popped, String(i));
    if (id === 8) {
      corkFly(out, f, POP8, tip, i);
      if (f >= POP8 && f < POP8 + 10) { const u = (f - POP8) / 10; fxc(out, `foam${Math.round(u * 10)}`, 300, 300, (pp) => fxSplash(pp, u), [tip[0], tip[1] + 0.05, tip[2]], 0.22, 0.22); }
    }
    // right arm: hangs, then points at a neighbour on 'ai trả?'
    if (pointing) {
      const tgt = COLL[(i + 1) % 4], [tx, tz] = H.coll[(i + 1) % 4], sh = shoulderAt(cam, who, P, fo, -1), T = Hm(tx, 1.45, tz);
      const d = [T[0] - sh[0], T[1] - sh[1], T[2] - sh[2]], n = Math.hypot(d[0], d[1], d[2]) || 1, k = smooth(ramp(f, POINT9 - 4, POINT9 + 2));
      const aim: V3 = [sh[0] + (d[0] / n) * 0.45, sh[1] + (d[1] / n) * 0.45, sh[2] + (d[2] / n) * 0.45];
      arm3d(out, cam, who, P, fo, -1, lerp3(restHand(cam, who, P, fo, -1), aim, k), f); void tgt;
    } else arm3d(out, cam, who, P, fo, -1, restHand(cam, who, P, fo, -1), f);
  });
  if (id === 9) corksDown(out, 4);
  // the waiter and the bill (S09)
  if (id === 9) {
    const A = Hm(H.waiter_in[0], 0, H.waiter_in[1]), B = Hm(H.waiter[0], 0, H.waiter[1]);
    const b0 = Hm(H.bill[0] + 0.22, H.table_y + 0.004, H.bill[2] + 0.1), b1 = Hm(H.bill[0], H.table_y + 0.004, H.bill[2]);
    const bu = smooth(ramp(f, BILL9[0], BILL9[1])), BP = lerp3(b0, b1, bu);
    if (f >= WALK9[0] && f < WALK9[1]) side(out, cam, "waiter", ...lerp3(A, B, ramp(f, WALK9[0], WALK9[1])), -1, -0.4, { mode: "march", phase: walkPhase(f, 2), stride: 0.7, expr: "smile" }, f);
    else if (f >= WALK9[1]) {
      const fo: FrontOpts = { mode: "stand", expr: "smile", armOff: -1 };
      front(out, cam, "waiter", ...B, fo, f);
      const hand: V3 = f < BILL9[1] + 2 ? [BP[0] + 0.06, BP[1] + 0.01, BP[2] + 0.04] : lerp3([b1[0] + 0.06, b1[1] + 0.01, b1[2] + 0.04], restHand(cam, "waiter", B, fo, -1), smooth((f - BILL9[1] - 2) / 10));
      arm3d(out, cam, "waiter", B, fo, -1, hand, f);
    }
    if (f >= BILL9[0] - 26) flat(out, "bill", (pp) => art2.billFolder(pp), f >= BILL9[0] ? BP : b0, 0.24, 0, 360, 240, 0.16);
  }
};
const lateCollector = (out: Stage, cam: CamInfo, f: number) => {
  corksDown(out, f >= POP14 + 40 ? 5 : 4);
  const P = Hm(H.c1_late[0], 0, H.c1_late[1]);
  const pov = near(cam, P, 0.5);
  const phoneUp = f >= PHONE14[0] && f < 2298;
  const expr = f >= PAID14 ? "grin" : f >= DOWN14[0] ? "neutral" : "grin";
  const fo: FrontOpts = { mode: "stand", expr: expr as FrontOpts["expr"], armOff: 2 };
  if (!pov) front(out, cam, "c1", ...P, fo, f, [DOWN14[0], PAID14]);
  // left arm: the bottle: raised to pop, lowered to the chest, raised again and popped
  const rest = holdHand(cam, "c1", P, fo, 1, 0.16), up: V3 = [rest[0], rest[1] + 0.2, rest[2] + 0.06];
  const k = f < RAISE14[0] ? 0 : f < RAISE14[1] ? smooth(ramp(f, RAISE14[0], RAISE14[1])) : f < DOWN14[0] ? 1 : f < DOWN14[1] ? 1 - smooth(ramp(f, DOWN14[0], DOWN14[1])) : f < 2298 ? 0 : smooth(ramp(f, 2298, 2308));
  const hb = pov ? lerp3(rest, up, k) : arm3d(out, cam, "c1", P, fo, 1, lerp3(rest, up, k), f);
  const popped = f >= POP14, tip = pov ? hb : bottleAt(out, cam, hb, -0.4, popped, "L");
  if (!pov) { corkFly(out, f, POP14, tip, 4); if (f >= POP14 && f < POP14 + 10) { const u = (f - POP14) / 10; fxc(out, `foam${Math.round(u * 10)}`, 300, 300, (pp) => fxSplash(pp, u), [tip[0], tip[1] + 0.05, tip[2]], 0.22, 0.22); } }
  // right arm: the phone, up to his eyes' line from PHONE14, down after the check
  const PH = Hm(2.06, 1.28, 1.02), low = restHand(cam, "c1", P, fo, -1);
  const pk = f < PHONE14[0] ? 0 : f < PHONE14[1] ? smooth(ramp(f, PHONE14[0], PHONE14[1])) : f < 2298 ? 1 : 1 - smooth(ramp(f, 2298, 2306));
  const ph = lerp3(low, PH, pk);
  if (!pov) arm3d(out, cam, "c1", P, fo, -1, [ph[0], ph[1] - 0.05, ph[2]], f);
  out.props.phone = { p: ph, vis: phoneUp || (f >= 2298 && pk > 0.05) };
};

// ---------------- the café (S10, S11) ----------------
const BORR = (): V3 => Fm(CF.borrower[0], 0, CF.borrower[1]), LEND = (): V3 => Fm(CF.lender[0], 0, CF.lender[1]);
const CTY = CF.table_y;
/** the IOU's set-local position and its ghost bob */
export const iouPose = (id: number, f: number) => {
  const a: V3 = [-0.22, CTY + 0.003, -0.62], b: V3 = [CF.iou[0], CF.iou[1], CF.iou[2]];
  if (id === 10 && f < IOU10[0]) return { p: a, ghost: 1 };
  if (id === 10 && f < IOU10[1]) { const u = smooth(ramp(f, IOU10[0], IOU10[1])); return { p: lerp3(a, [b[0], b[1] + 0.02 * u, b[2]], u), ghost: 1 }; }
  const settle = id === 11 ? smooth(ramp(f, 1675, 1690)) : 0, hover = (0.02 + 0.006 * Math.sin(f * 0.21)) * (1 - settle);
  return { p: [b[0], b[1] + hover, b[2]] as V3, ghost: 1 - settle };
};
/** the envelope: in his hoodie, pulled out (S11 f1622-1636), slapped on the table and slid across */
const envPose = (out: Stage, cam: CamInfo, f: number, id: number, chest: V3): V3 | null => {
  if (id !== 11 || f < 1622) return null;
  const a = Fm(CF.env_from[0], CTY + 0.016, CF.env_from[1]), b = Fm(CF.env_to[0], CTY + 0.016, CF.env_to[1]);
  if (f < ENV11[0]) return lerp3(chest, a, smooth(ramp(f, 1622, ENV11[0])));
  const u = ramp(f, ENV11[0], ENV11[1]); return lerp3(a, b, 1 - (1 - u) * (1 - u));
};
const cafe = (out: Stage, cam: CamInfo, f: number, id: number) => {
  const P = BORR(), Q = LEND();
  // the borrower
  const loud = id === 11 && f >= MEGA11[0] && f < MEGA11[1] + 4;
  const bexpr = id === 10 ? "grin" : loud ? "laugh" : f < 1640 ? "grin" : "smile";
  const fo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: bexpr as FrontOpts["expr"], look: 1, armOff: 2 };
  front(out, cam, "borrower", ...P, fo, f, [MEGA11[0], 1640]);
  const chest = chestAt(cam, "borrower", P, fo, 0.5, 0.12);
  // outer (right) arm: the cash fan (S10), the megaphone and the thump (S11)
  if (id === 10) {
    const hi: V3 = [chest[0] - cam.right.x * 0.1, chest[1] + 0.3, chest[2]];
    const k = f < TUCK10[0] ? 1 : 1 - smooth(ramp(f, TUCK10[0], TUCK10[1]));
    const hd = arm3d(out, cam, "borrower", P, fo, -1, lerp3(chest, hi, k), f);
    if (f < TUCK10[1]) fxc(out, "cashfan", 300, 200, (pp) => art2.cashFan(pp), [hd[0], hd[1] + 0.06 * k, hd[2] + 0.02], 0.2 * Math.max(0.3, k), 0.133 * Math.max(0.3, k), { rot: 0.15 * Math.sin(f * 0.15) * k });
  } else {
    const shR = shoulderAt(cam, "borrower", P, fo, 1), mp: V3 = [shR[0] - cam.right.x * 0.04 - cam.fwd.x * 0.12, shR[1] + 0.12, shR[2] - cam.right.z * 0.04 - cam.fwd.z * 0.12];
    const tbl = Fm(-0.22, CTY + 0.02, -0.64), tup: V3 = [tbl[0], tbl[1] + 0.2, tbl[2]], rest = restHand(cam, "borrower", P, fo, -1);
    let hand: V3;
    if (f < MEGA11[0]) hand = rest; else if (f < MEGA11[0] + 5) hand = lerp3(rest, mp, smooth((f - MEGA11[0]) / 5)); else if (f < MEGA11[1]) hand = mp;
    else if (f < THUMP11 - 4) hand = lerp3(mp, tup, smooth((f - MEGA11[1]) / (THUMP11 - 4 - MEGA11[1]))); else if (f < THUMP11) hand = lerp3(tup, tbl, (f - THUMP11 + 4) / 4);
    else if (f < THUMP11 + 4) hand = tbl; else hand = lerp3(tbl, rest, smooth((f - THUMP11 - 4) / 10));
    const hd = arm3d(out, cam, "borrower", P, fo, -1, hand, f);
    if (f >= MEGA11[0] && f < MEGA11[1] + 2) {
      fxc(out, "mega", 260, 160, (pp) => art2.megaphone(pp), [hd[0] + cam.right.x * 0.1 - cam.fwd.x * 0.02, hd[1] + 0.03, hd[2] + cam.right.z * 0.1 - cam.fwd.z * 0.02], 0.2, 0.123, { rot: 0.08 });
      for (let n = 0; n < 5; n++) { const t0 = MEGA11[0] + 6 + n * 6, u = (f - t0) / 10; if (u < 0 || u >= 1) continue; fxc(out, `ring${Math.round(u * 10)}`, 300, 300, (pp) => fxRing(pp, u), [hd[0] + cam.right.x * (0.2 + 0.25 * u), hd[1] + 0.03, hd[2] + cam.right.z * (0.2 + 0.25 * u)], 0.12 + 0.3 * u, 0.12 + 0.3 * u, { soft: true }); }
    }
    if (f >= THUMP11 && f < THUMP11 + 6) burst(out, f, THUMP11, tbl[0], tbl[1] + 0.03, tbl[2], 0.18, 6, "#fff3b0");
  }
  // inner (left) arm: the IOU slide (S10), the envelope (S11)
  let lh: V3 = restHand(cam, "borrower", P, fo, 1);
  if (id === 10 && f >= IOU10[0] - 6 && f < IOU10[1] + 4) { const ip = iouPose(10, f).p, w = Fm(ip[0] - 0.1, ip[1] + 0.01, ip[2]); lh = f < IOU10[0] ? lerp3(lh, w, smooth((f - IOU10[0] + 6) / 6)) : w; }
  else if (id === 10 && f >= IOU10[1] + 4) lh = lerp3(Fm(CF.iou[0] - 0.1, CTY + 0.02, CF.iou[2]), lh, smooth((f - IOU10[1] - 4) / 10));
  const ep = envPose(out, cam, f, id, chest);
  if (ep && f < ENV11[1] + 2) lh = [ep[0] - 0.1, ep[1] + 0.01, ep[2]];
  else if (ep && f < ENV11[1] + 14) lh = lerp3([ep[0] - 0.1, ep[1] + 0.01, ep[2]], lh, smooth((f - ENV11[1] - 2) / 12));
  arm3d(out, cam, "borrower", P, fo, 1, lh, f);
  out.props.env = ep ? { p: ep } : { p: [0, -50, 0], vis: false };
  // the lender: stern, leans back at the shout, takes the envelope, smiles at the stamp
  const lexpr = id === 10 ? "stern" : f >= STAMP11 + 3 ? "smile" : loud ? "shock" : "stern";
  const lfo: FrontOpts = { mode: "sit", chair: SEAT_CHAIR, expr: lexpr as FrontOpts["expr"], look: -1, tilt: loud ? 0.08 : 0, armOff: -1 };
  front(out, cam, "lender", ...Q, lfo, f, [MEGA11[0] + 4, STAMP11 + 3]);
  const lrest = restHand(cam, "lender", Q, lfo, -1);
  const take = ep && f >= ENV11[1] ? [ep[0] + 0.1, ep[1] + 0.01, ep[2]] as V3 : null;
  arm3d(out, cam, "lender", Q, lfo, -1, take ? lerp3(lrest, take, smooth(ramp(f, ENV11[1], ENV11[1] + 6))) : lrest, f);
};

// ---------------- the writer (S12) ----------------
const writer = (out: Stage, cam: CamInfo, f: number) => {
  const P = Dm(DK.seller[0], 0, DK.seller[1]);
  if (near(cam, P, 0.9)) return;
  front(out, cam, "writer", ...P, { mode: "sit", chair: SEAT_STOOL, expr: f >= SHOCK12 ? "shock" : "neutral", tilt: f > 1760 ? 0.05 : 0 }, f, [SHOCK12]);
};

// ---------------- the census spotlight (S07) and the night ending (S15) ----------------
const spotlight = (out: Stage, f: number, id: number) => {
  if (id === 7 && f >= SPOT7) { const S = Cm(CN.slab[0], CN.slab[1], CN.slab[2]); fxc(out, "cone", 200, 600, (pp) => art.spotCone(pp), [S[0], 2.15, S[2]], 0.9, 2.2, { soft: true }); }
  if (id === 15) { const S = Hm(H.slab[0], H.slab[1], H.slab[2]); fxc(out, "cone", 200, 600, (pp) => art.spotCone(pp), [S[0], 2.4, S[2] - 0.05], 0.9, 2.4, { soft: true });
    // the ghost tag drifts by in the dark behind the slab
    const u = ramp(f, DRIFT15[0], DRIFT15[1]); if (u > 0 && u < 1) { const a = Math.sin(Math.PI * u); fxc(out, `ghostT${Math.round(a * 10)}`, 320, 180, (pp) => { pp.g.globalAlpha = 0.75 * a; art2.tagGhost(pp, 1); pp.g.globalAlpha = 1; }, [S[0] - 0.45 + 0.9 * u, S[1] + 0.12 + 0.03 * Math.sin(u * 12), S[2] - 0.35], 0.16, 0.09, { soft: true }); } }
};

export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [], props: {} };
  LNAME = SHOTS[id - 1].light; SUN = cam.sun.clone();
  if (id === 1 || id === 6) auctioneer(out, cam, f, id);
  if (id === 4) { auctioneer(out, cam, f, 4); bidders(out, cam, f); }
  if (id === 2) clerkTag(out, cam, f);
  if (id === 3) fireworks(out, f);
  if (id === 5) clerkPole(out, cam, f);
  if (id === 8 || id === 9) party(out, cam, f, id);
  if (id === 10 || id === 11) cafe(out, cam, f, id);
  if (id === 12) writer(out, cam, f);
  if (id === 13) spokesman(out, cam, f);
  if (id === 14) lateCollector(out, cam, f);
  spotlight(out, f, id);
  return out;
};
void art; void IDX; void tier; void tcardFx; void glowAt; void faceTo; void fxPuff; void SKIN; void Dm;
