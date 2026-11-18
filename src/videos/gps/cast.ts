// The GPS-tracker reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, frontPts, fxBurst, fxPuff, fxNote, fxShadow, fxContact, Outfit, Expr, FrontOpts, SideOpts, SKIN } from "./toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, SHOP, LIVING, POLICE, COURT, INSERT, clamp01, smooth, easeOut, pop, SNAP, TRACK_SPOT, TUG, GRAB, SIP, PHONE_UP, NOD, NOD2,
  PIN1, PIN2, TRUCK_STOP, PEN_DROP, FIND, YANK, SLAP, ADMIT, LOCK_CLICK, TICK1, TICK2, ENGINE, GAVEL, STAMP1, BILLS, STAMP2, ANKLE, blinkOn, truckPose, POV6, POV8, vanD, clockMin, clockStr, AER_LOOK,
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
export type Stage = { places: Place[]; fx: FxPlace[]; track?: V3 }; // track: where the tracker is when a hand carries it

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
  kub: { jacket: "#8a6a4a", pants: "#5b5f6e", boots: "#4a3426", hat: "hair", hair: "#ecebe8", glasses: true, moustache: "#ecebe8", skin: "#f2c4a4", build: "stout" } as Outfit,
  driver: { jacket: "#6a4fb0", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#3a2a20", skin: "#c99067" } as Outfit,
  officer: { jacket: "#2a3a63", pants: "#1f2b4a", boots: "#15131a", hat: "police", cap: "#1f2b4a", badge: "#f0c64a", moustache: "#4a3020", skin: "#c99067", build: "stout" } as Outfit,
  judge: { jacket: "#1d1b22", pants: "#1d1b22", boots: "#15131a", hat: "hair", hair: "#9a9aa2", glasses: true, skin: "#ecd0b6", build: "stout" } as Outfit,
  clerk: { jacket: "#2f6fc4", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#5a3b2a", skin: "#f5c9a0" } as Outfit,
  camper1: { jacket: "#e2453c", pants: "#3b3f52", boots: "#4a3426", hat: "beanie", cap: "#2f7fbf", skin: "#f5c9a0" } as Outfit,
  camper2: { jacket: "#3f9a55", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#f2c84a", skin: "#c99067" } as Outfit,
  camper3: { jacket: "#f08a3c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "hair", hair: "#5a3b2a", skin: "#ecd0b6" } as Outfit,
  tugA: { jacket: "#2aa39a", pants: "#3b3f52", boots: "#2a201a", hat: "cap", cap: "#e2453c", skin: "#f5c9a0" } as Outfit,
  tugB: { jacket: "#c25a7a", pants: "#3b3f52", boots: "#2a201a", hat: "hair", hair: "#2a201a", skin: "#c99067" } as Outfit,
  shopA: { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#2a201a", hat: "beanie", cap: "#2a2733", skin: "#ecd0b6" } as Outfit,
  shopB: { jacket: "#d7463e", pants: "#3b5b9a", boots: "#4a3426", hat: "hair", hair: "#8a5a34", skin: "#f5c9a0" } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { kub: 1, driver: 2, officer: 3, judge: 4, clerk: 5, camper1: 6, camper2: 7, camper3: 8, tugA: 9, tugB: 10, shopA: 11, shopB: 12 };

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
const S = (x: number, y: number, z: number) => at(SHOP, x, y, z);
const Lv = (x: number, y: number, z: number) => at(LIVING, x, y, z);
const P = (x: number, y: number, z: number) => at(POLICE, x, y, z);
const Ct = (x: number, y: number, z: number) => at(COURT, x, y, z);
const I = (x: number, y: number, z: number) => at(INSERT, x, y, z);
/** body centre of the truck in its local frame (path points are body centres) */
const TC: V3 = [0.3, 0, 3.2];
/** truck-local point -> world, for a truck pose */
export const truckWorld = (id: number, f: number, l: V3): V3 => {
  const t = truckPose(id, f), c = Math.cos(t.yaw), s = Math.sin(t.yaw), dx = l[0] - TC[0], dz = l[2] - TC[2];
  const px = id === 7 ? t.x : t.x + TC[0], pz = id === 7 ? t.z : t.z + TC[2];
  return [px + dx * c + dz * s, l[1], pz - dx * s + dz * c];
};
// ---- stick limbs in the 3D world: an arm that really reaches an object (the card's own arm is switched off with armOff) ----
/** world position of a front card's design-unit point (card standing at x, y, z, facing the camera) */
const cardWorld = (cam: CamInfo, x: number, y: number, z: number, [u, v]: [number, number]): V3 => {
  const yaw = Math.atan2(cam.pos.x - x, cam.pos.z - z), X = (u - 300) * SU, Y = (975 - v) * SU;
  return [x + X * Math.cos(yaw), y + Y, z - X * Math.sin(yaw)];
};
const v3 = (a: V3) => new THREE.Vector3(...a);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
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
/** a stick arm from the card's shoulder to a world point, with a soft elbow bending outward (side -1 = screen left) */
const arm3d = (out: Stage, cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: -1 | 1, hand: V3) => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), S = cardWorld(cam, at[0], at[1], at[2], J.shoulder(side));
  const m = lerp3(S, hand, 0.5), out2 = cam.right.clone().multiplyScalar(0.06 * side);
  const El: V3 = [m[0] + out2.x, m[1] + 0.03, m[2] + out2.z];
  seg3d(out, cam, S, El, J.armW * SU, J.armCol); seg3d(out, cam, El, hand, J.armW * SU, J.armCol, J.hand * 2 * SU);
};
/** where the card's hand rests (arm hanging) and a hold point in front of its belly, in the world */
const restHand = (cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: number): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [sx, sy] = J.shoulder(side);
  return cardWorld(cam, at[0], at[1], at[2], [sx + side * 6 * J.u, sy + 0.92 * J.HH]);
};
const holdHand = (cam: CamInfo, who: Who, at: V3, fo: FrontOpts, side: number, toLens = 0.08): V3 => {
  const J = frontPts(C[who], { ...fo, seed: IDX[who] + 1 }), [sx, sy] = J.shoulder(side);
  const w = cardWorld(cam, at[0], at[1], at[2], [sx + side * 16 * J.u, sy + 0.62 * J.HH]); // beside the body, so the arm shows
  return [w[0] - cam.fwd.x * toLens, w[1], w[2] - cam.fwd.z * toLens];
};
const glowAt = (out: Stage, key: string, p: V3, s: number) => out.fx.push({ key: "glow" + key, cw: 128, ch: 128, draw: (pp) => art.glow(pp), x: p[0], y: p[1], z: p[2], w: s, h: s, soft: true });
/** his view of his own phone (POV card filling the frame at the insert plinth slot x) */
const povCard = (out: Stage, x: number, m: art.PovMap) => {
  const k = `pov|${q(m.t.cx, 4)}|${q(m.t.cz, 4)}|${q(m.t.s, 40)}|${m.dot ? q(m.dot[0], 4) + "," + q(m.dot[1], 4) : "-"}|${m.blink}|${q(m.trail, 4)}|${m.route ?? "-"}|${m.pins.map((p) => q(p.k, 30)).join(",")}|${m.time}|${m.finger === undefined ? "-" : q(m.finger, 2)}`;
  out.fx.push({ key: k, cw: 720, ch: 1280, draw: (pp) => art.povPhone(pp, m), x: I(x, 0, 0)[0], y: I(x, 0.004, 0)[1], z: I(x, 0, 0)[2], w: 0.36, h: 0.64, flat: true });
};
const MAP_SCREEN_C = { ax: (art.SCREEN[0] + art.SCREEN[2]) / 2, ay: (art.SCREEN[1] + art.SCREEN[3]) / 2 };

/** everything with a face or an effect in shot `id` at frame f */
export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light;
  SUN = cam.sun;
  const blink = blinkOn(f);
  switch (id) {
    case 1: { // the hook: he looks both ways, crouches, reaches under the bumper and presses the box on: click; then grins and goes
      if (f < 104) {
        const cr = f < 26 ? 0 : f < 48 ? 0.75 * smooth((f - 26) / 22) : f < 68 ? 0.75 : 0.75 * (1 - smooth((f - 68) / 14));
        const at: V3 = [-3.85 + 0.12 * (cr / 0.75), 0.15, 4.45 - 0.25 * (cr / 0.75)];   // a half step in toward the bumper as he crouches
        const look = f < 10 ? 1 : f < 20 ? -1 : f < 26 ? 1 : f < SNAP + 4 ? -1 : 0;
        const fo: FrontOpts = { mode: "stand", expr: f < SNAP ? "nervous" : "grin", facing: 1, look, crouch: cr, armOff: f < 80 ? -1 : undefined };
        front(out, cam, "kub", ...at, fo, f, [SNAP]);
        if (f < 80) { // his left arm carries the box from his belly to the bumper, holds it there, lets go
          const H0 = holdHand(cam, "kub", at, fo, -1), spot = TRACK_SPOT as V3;
          let hand: V3;
          if (f < 28) hand = H0;
          else if (f < 56) { const k = smooth((f - 28) / 28); hand = lerp3(H0, spot, k); hand[1] -= 0.12 * Math.sin(Math.PI * k); }
          else if (f < 68) hand = spot;
          else hand = lerp3(spot, restHand(cam, "kub", at, fo, -1), smooth((f - 68) / 12));
          arm3d(out, cam, "kub", at, fo, -1, hand);
          if (f < SNAP) out.track = [hand[0] - cam.fwd.x * 0.04, hand[1] + 0.02, hand[2] - cam.fwd.z * 0.04]; // the box in front of the hand
        }
      } else {
        const u = (f - 104) / 30;
        side(out, cam, "kub", -3.73 - 1.1 * u, 0.15, 4.2 + 0.2 * u, -1, 0, { mode: "march", phase: walkPhase(f, 0.8), stride: 0.55, expr: "grin" }, f);
      }
      burst(out, f, SNAP, ...TRACK_SPOT, 0.3, 6, "#ffffff");
      if (f >= SNAP && blinkOn(f, SNAP + 6)) glowAt(out, "hook", [TRACK_SPOT[0] - 0.03, TRACK_SPOT[1] - 0.02, TRACK_SPOT[2]], 0.12);
      if (f >= 104) { const u = clamp01((f - 104) / 74); side(out, cam, "driver", 7.1 - 2.0 * u, 0.15, 12.6 - 6.8 * u, -0.28, -0.96, { mode: "march", phase: walkPhase(f, 0.9), stride: 0.75, expr: "whistle" }, f); }
      break;
    }
    case 2: {
      front(out, cam, "camper3", -4.2, 0.15, 10.6, { mode: "stand", expr: "dazed", facing: 1, look: 1, prop: ["hold", "coffee"] }, f);
      break;
    }
    case 3: { // camping crowd; the chair tug-of-war
      front(out, cam, "camper1", -3.0, 0.6, 10.4, { mode: "sit", expr: "dazed", facing: 1 }, f);
      front(out, cam, "camper2", 0.0, 0.6, 10.5, { mode: "sit", expr: "neutral", facing: -1, prop: ["hold", "coffee"] }, f);
      front(out, cam, "camper3", 2.3, 0.15, 10.9, { mode: "stand", expr: "dazed", facing: 1, prop: ["hold", "phone"] }, f);
      const tug = f >= TUG[0] && f < TUG[1], j = tug ? Math.sin((f - TUG[0]) * 0.9) : 0;
      front(out, cam, "tugA", 6.2 + 0.06 * j, 0.15, 10.7, { mode: "stand", expr: tug ? "pained" : "stern", facing: 1, prop: ["press", 1], tilt: -0.08 * (1 + j) }, f, [], true);
      front(out, cam, "tugB", 7.6 + 0.06 * j, 0.15, 10.7, { mode: "stand", expr: tug ? "pained" : "stern", facing: 1, prop: ["press", 1], tilt: -0.08 * (1 - j) }, f);
      break;
    }
    case 4: { // four hands on one box; it squirts up
      const grab = f >= GRAB[0];
      front(out, cam, "clerk", S(5.3, 0, -7.0)[0], 0, S(5.3, 0, -7.0)[2], { mode: "stand", expr: grab ? "shock" : "smile", facing: 1, prop: grab ? null : ["press", 0.7] }, f, [GRAB[0]]);
      front(out, cam, "shopA", S(4.75, 0, -6.05)[0], 0, S(4.75, 0, -6.05)[2], { mode: "stand", expr: "pained", facing: 1, prop: ["press", 1], tilt: f >= GRAB[1] ? 0.12 : -0.06 }, f);
      front(out, cam, "shopB", S(5.85, 0, -6.05)[0], 0, S(5.85, 0, -6.05)[2], { mode: "stand", expr: "pained", facing: 1, prop: ["press", 1], tilt: f >= GRAB[1] ? 0.12 : -0.06 }, f, [], true);
      burst(out, f, GRAB[1], ...S(5.3, 1.1, -6.05), 0.6, 8, "#ffffff");
      break;
    }
    case 5: break; // the house front: the KUBASTA mailbox (sets.ts)
    case 6: { // calm in his armchair: tea; he puts the cup on the side table and lifts the phone (its back to us, screen to him);
      // then his own view: the screen between his hands, the dot crawling along the main road; the dive into the map
      if (f < POV6) { // the phone in his hand from the start (its back to us), he looks at it
        const [x, , z] = Lv(0, 0, -0.8);
        front(out, cam, "kub", x, 0, z, { mode: "sit", chair: 1.1, expr: "smile", facing: 1, prop: ["hold", "phoneBack"], headTilt: 0.08 }, f);
      } else {
        const u = smooth((f - 690) / 38), d = vanD(f), dot = art.alongD(art.ROUTE, d), s0 = 4, s1 = 22, s = s0 * (s1 / s0) ** u;
        // the dive keeps the dot on screen: its screen offset slides from the overview's to the aerial's
        const ox = (dot[0] + 45) * s0 * (1 - u) + (dot[0] - AER_LOOK[0]) * s1 * u, oz = (dot[1] - 60) * s0 * (1 - u) + (dot[1] - AER_LOOK[2]) * s1 * u;
        povCard(out, 120, { t: { cx: dot[0] - ox / s, cz: dot[1] - oz / s, s, ...MAP_SCREEN_C }, dot, blink, trail: d, pins: [], time: clockStr(clockMin(f)), tag: "Theo dõi trực tiếp" });
      }
      break;
    }
    case 7: { // aerial: the truck turns left, its tracker blinking green
      if (blink) glowAt(out, "aer", truckWorld(7, f, [-3.22, 0.6, 3.72]), 2.2);
      break;
    }
    case 8: { // the knowing nod; his view: the dot stops at Target, then Walmart, his phone clock racing; back on him, the clock moved on
      if (f < POV8[0] || f >= POV8[1]) {
        const [x, , z] = Lv(0, 0, -0.8), nod = (f0: number) => (f >= f0 && f < f0 + 10 ? -0.14 * Math.sin(((f - f0) / 10) * Math.PI) : 0);
        front(out, cam, "kub", x, 0, z, { mode: "sit", chair: 1.1, expr: "smile", facing: 1, prop: ["hold", "phoneBack"], headTilt: 0.08 + nod(NOD) + nod(NOD2) }, f);
      } else {
        const d = vanD(f), pk = (f0: number) => clamp01((f - f0) / 12);
        povCard(out, 120, { t: { cx: -108, cz: 75, s: 2.6, ...MAP_SCREEN_C }, dot: art.alongD(art.ROUTE, d), blink, trail: d,
          pins: [{ d: art.ROUTE_STOP[1], k: pk(PIN1), chip: "Target · 9:10" }, { d: art.ROUTE_STOP[2], k: pk(PIN2), chip: "Walmart · 10:30" }], time: clockStr(clockMin(f)), tag: "Theo dõi trực tiếp" });
      }
      break;
    }
    case 9: { // 18 June: she walks to the back, her pen falls, she crouches and looks under; she sees the box; her arm reaches in, pulls it off
      const DR: V3 = [-3.75, 0.15, 4.95];
      if (f >= 990 && f < 1028) { const u = (f - 990) / 38; side(out, cam, "driver", 4.8 - 8.55 * u, 0.15, 4.95, -1, 0, { mode: "march", phase: walkPhase(f, 1), stride: 0.8, expr: "whistle" }, f); }
      else if (f >= 1028 && f < 1102) {
        const cr = f < PEN_DROP + 4 ? 0 : 0.85 * smooth((f - PEN_DROP - 4) / 12), at: V3 = [DR[0] + 0.05 * (cr / 0.85), 0.15, DR[2] - 0.85 * (cr / 0.85)];
        const reaching = f >= 1076;
        const fo: FrontOpts = { mode: "stand", expr: f >= FIND ? "shock" : f >= PEN_DROP ? "neutral" : "neutral", facing: -1, look: f >= PEN_DROP ? -1 : 0, crouch: cr, prop: ["hold", "clipboard"], armOff: reaching ? -1 : undefined };
        front(out, cam, "driver", ...at, fo, f, [FIND]);
        if (reaching) { // her arm comes in, takes the box, wiggles it and pulls it free on YANK; the box goes with her hand
          const spot = TRACK_SPOT as V3, H0 = restHand(cam, "driver", at, fo, -1);
          let hand: V3;
          if (f < 1090) hand = lerp3(H0, spot, smooth((f - 1076) / 14));
          else if (f < YANK) { const w = f >= YANK - 12 ? 0.012 * Math.sin((f - (YANK - 12)) * 2.4) : 0; hand = [spot[0] + w, spot[1], spot[2]]; }
          else hand = lerp3(spot, holdHand(cam, "driver", at, fo, -1), smooth((f - YANK) / 6));
          arm3d(out, cam, "driver", at, fo, -1, hand);
          if (f >= YANK) out.track = [hand[0] - cam.fwd.x * 0.04, hand[1] + 0.02, hand[2] - cam.fwd.z * 0.04];
        }
      } else if (f >= 1102) { // up on her feet: the box held up into the lens in her left hand, the clipboard still in her right
        const at: V3 = [-4.15, 0.15, 4.85], fo: FrontOpts = { mode: "stand", expr: f < 1118 ? "shock" : "stern", facing: 1, prop: ["hold", "clipboard"], armOff: -1 };
        front(out, cam, "driver", ...at, fo, f, [1118]);
        const hand = holdHand(cam, "driver", at, fo, -1, 0.22); hand[1] += 0.12;
        arm3d(out, cam, "driver", at, fo, -1, hand);
        out.track = [hand[0] - cam.fwd.x * 0.04, hand[1] + 0.03, hand[2] - cam.fwd.z * 0.04];
      }
      if (f >= PEN_DROP && f < 1102) { // the pen falls and bounces by the bumper
        const t = f - PEN_DROP, y = t < 8 ? 1.0 - 0.83 * (t / 8) ** 2 : 0.17 + 0.08 * Math.max(0, Math.sin(((t - 8) / 6) * Math.PI)) * Math.exp(-(t - 8) / 8);
        card(out, "pen", 240, 40, (p) => art.pen(p), -3.55 + 0.012 * Math.min(t, 14), y + 0.01, 4.55, 0.16, 0.027, { rot: t * 0.5 });
      }
      if (f >= 1040 && f < YANK && blink) glowAt(out, "find", [TRACK_SPOT[0] - 0.03, TRACK_SPOT[1] - 0.02, TRACK_SPOT[2]], 0.12);
      break;
    }
    case 10: { // the police desk: she slaps it down
      front(out, cam, "officer", ...P(0.3, 0, -1.95), { mode: "stand", expr: f > SLAP ? "shock" : "neutral", facing: -1 }, f, [SLAP + 1]);
      side(out, cam, "driver", ...P(-0.55, 0, -0.1), 0, -1, { mode: "stand", expr: "stern" }, f);
      const t = f - (SLAP - 5), y = t < 5 ? 1.45 - 0.31 * (Math.max(0, t) / 5) ** 2 : 1.14 + (t < 10 ? 0.02 * Math.sin(((t - 5) / 5) * Math.PI) : 0);
      card(out, "slapBox", 300, 200, (p) => { p.poly(art.rr(40, 60, 260, 150, 14), "#1f1d24", 6); p.ell(210, 105, 12, 12, blink ? "#5dff7a" : "#1d4a28", 0); }, ...P(-0.3, y + 0.03, -0.95), 0.2, 0.133);
      burst(out, f, SLAP, ...P(-0.3, 1.2, -0.95), 0.55, 7, "#ffffff");
      break;
    }
    case 11: case 12: { // the interview room: he admits it; then the officer leans into the lens
      const [kx, , kz] = P(11, 0, -1.2);
      front(out, cam, "kub", kx, 0.47, kz, { mode: "sit", expr: f >= ADMIT ? "smile_closed" : "nervous", facing: 1, headTilt: f >= ADMIT ? 0.1 : 0 }, f, [ADMIT]);
      card(out, "bag" + blink, 300, 380, (p) => art.evidenceBag(p, blink), ...P(11, 0.92, -0.25), 0.22, 0.28);
      if (id === 11) side(out, cam, "officer", ...P(12.55, 0, 0.4), -1, 0, { mode: "stand", expr: "stern" }, f);
      else front(out, cam, "officer", ...P(11.75, 0, 1.55), { mode: "stand", expr: "dazed", facing: -1, tilt: -0.1, headTilt: 0.12 }, f, [1300]);
      break;
    }
    case 13: { // stockroom: the restock schedule goes in the drawer, click
      front(out, cam, "clerk", ...S(-6.75, 0, -3.35), { mode: "stand", expr: f >= LOCK_CLICK ? "smile_closed" : "stern", facing: -1, look: -1, prop: f < 1452 ? ["hold", "clipboard"] : ["press", 1] }, f, [LOCK_CLICK]);
      sparkle(out, f, LOCK_CLICK, ...S(-7.27, 1.06, -4.0), 0.3, 12);
      break;
    }
    case 14: { // her route sheet: the store, the time; the engine starts
      if (f < 1512) front(out, cam, "driver", 4.6, 0.15, 5.0, { mode: "stand", expr: "neutral", facing: -1, look: 1, prop: ["hold", "clipboard"] }, f);
      else {
        const sh = f >= ENGINE && f < ENGINE + 14 ? 0.004 * Math.sin((f - ENGINE) * 2.2) : 0;
        const t1 = q((f - TICK1) / 8, 16), t2 = q((f - TICK2) / 10, 20);
        card(out, `sheet${t1}|${t2}`, 600, 1100, (p) => art.routeSheet(p, t1, t2), ...I(sh, 0.004, 0), 0.3, 0.55, { flat: true });
        const pk = f < TICK1 - 6 ? clamp01((f - 1520) / 20) : 1, px = f < TICK2 - 4 ? -0.11 : 0.1, pz = -0.21 + 0.03 * (1 - pk);
        card(out, "penTop", 240, 40, (p) => art.pen(p), ...I(px + 0.06 + sh, 0.012, pz + 0.05), 0.16, 0.027, { flat: true, rot: -0.7 });
      }
      break;
    }
    case 15: { // match: her route line becomes the recorded route on his phone; his fingertip traces it to where the cards go
      const k = smooth((f - 1648) / 64), fin = art.ROUTE_STOP[4] * k;
      povCard(out, 40, { t: { ...art.ROUTE_T }, dot: art.ROUTE[art.ROUTE.length - 1], blink, trail: 0, route: 999, finger: fin,
        pins: [{ d: art.ROUTE_STOP[4], k: clamp01((f - 1712) / 12), chip: "Thẻ về đây", cards: true }], time: "19:20", tag: "Lộ trình hôm nay" });
      break;
    }
    case 16: case 17: { // court: the gavel; then the stamps and the five bills
      const gk = f < 1767 ? 0.8 : f < GAVEL ? 0 : 1;
      const stampK = (f0: number) => (f >= f0 - 4 && f < f0 + 6 ? (f < f0 ? 0.2 : 1) : 0.6);
      const jp = id === 16 ? (["gavel", gk] as const) : (["press", Math.min(stampK(STAMP1), stampK(STAMP2))] as const);
      front(out, cam, "judge", ...Ct(0, 0.5, -4.45), { mode: "stand", expr: "stern", facing: 1, prop: [jp[0], jp[1]] }, f, [GAVEL]);
      if (id === 16) {
        front(out, cam, "kub", ...Ct(1.0, 0, 0.6), { mode: "stand", expr: f > GAVEL ? "shock" : "nervous", facing: -1, tilt: f > GAVEL && f < GAVEL + 8 ? -0.1 : 0 }, f, [GAVEL + 1]);
        burst(out, f, GAVEL, ...Ct(0.47, 1.62, -3.76), 0.55, 7, "#fff3b0");
      } else {
        const s1 = q((f - STAMP1) / 5, 10), s2 = q((f - STAMP2) / 5, 10);
        card(out, `judg${s1}|${s2}`, 400, 520, (p) => art.judgment(p, s1, s2), ...Ct(0.75, 1.535, -3.74), 0.24, 0.31, { flat: true, rot: 0.04 });
        BILLS.forEach((b, i) => {
          if (f < b - 5) return;
          const t = Math.min(1, (f - (b - 5)) / 5), y = 1.9 - (1.9 - 1.56 - i * 0.004) * t * t;
          card(out, "bill" + i, 240, 110, (p) => art.bill(p), ...Ct(1.2 + 0.02 * i, y, -3.73 - 0.01 * i), 0.2, 0.092, { flat: true, rot: 0.3 * (i % 2 ? 1 : -1) + 0.1 * i });
        });
        burst(out, f, STAMP1, ...Ct(0.75, 1.6, -3.74), 0.35, 6, "#ffd0c0"); burst(out, f, STAMP2, ...Ct(0.75, 1.6, -3.74), 0.35, 6, "#ffd0c0");
      }
      break;
    }
    case 18: { // the ankle monitor clamps shut round his (stick) leg; the same green blink
      const at = Ct(1.0, 0, 0.6), fo: FrontOpts = { mode: "stand", expr: f > ANKLE ? "dazed" : "nervous", facing: -1, look: f > ANKLE + 20 ? 0 : -1 };
      front(out, cam, "kub", ...at, fo, f, [ANKLE + 1]);
      front(out, cam, "officer", ...Ct(1.85, 0, 0.15), { mode: "stand", expr: "stern", facing: -1 }, f);
      const J = frontPts(C.kub, { ...fo, seed: IDX.kub + 1 }), [ax, ay] = J.ankle(1), w = cardWorld(cam, at[0], at[1], at[2], [ax, ay - 0.08 * J.HH]);
      const k = q(clamp01((f - (ANKLE - 6)) / 6), 12), on = f > ANKLE + 3 && blinkOn(f, ANKLE + 3);
      card(out, `ankle${k}|${on}`, 360, 280, (p) => art.ankleMonitor(p, k, on), w[0] - cam.fwd.x * 0.03, w[1], w[2] - cam.fwd.z * 0.03, 0.09, 0.07);
      break;
    }
    case 19: { // he shuffles home; the camera cranes up until he is the dot
      const x = -14.0 - 0.45 * ((f - 2096) / 30);
      side(out, cam, "kub", x, 0.15, 8.6, -1, 0, { mode: "march", phase: walkPhase(f, 0.7), stride: 0.45, expr: "dazed" }, f);
      const on = blinkOn(f);
      card(out, "ankleW" + on, 360, 280, (p) => art.ankleMonitor(p, 1, on), x, 0.24, 8.66, 0.07, 0.054);
      if (on) glowAt(out, "him", [x, 0.4, 8.7], Math.max(0.15, (cam.pos.y - 1) * 0.045));
      break;
    }
    case 20: { // the crane's view became a map of the same street; it zooms out: one slow green dot, him
      const x = -14.0 - 0.45 * ((f - 2096) / 30), s = 27.8 * (2.4 / 27.8) ** smooth((f - 2172) / 37);
      card(out, `town|${q(x, 40)}|${q(s, 20)}|${blink}`, 720, 1280, (p) => art.townMapFull(p, { cx: -15.5, cz: 8.4, s, ax: 360, ay: 640 }, [x, 8.6], blink), ...I(80, 0.004, 0), 0.36, 0.64, { flat: true });
      break;
    }
  }
  return out;
};
