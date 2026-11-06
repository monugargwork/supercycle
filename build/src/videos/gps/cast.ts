// The GPS-tracker reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, fxBurst, fxPuff, fxNote, fxShadow, fxContact, Outfit, Expr, FrontOpts, SideOpts, SKIN } from "./toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, SHOP, LIVING, POLICE, COURT, INSERT, clamp01, smooth, easeOut, pop, SNAP, TRACK_SPOT, TUG, GRAB, SIP, PHONE_UP, NOD, NOD2,
  PIN1, PIN2, TRUCK_STOP, PEN_DROP, FIND, YANK, SLAP, ADMIT, LOCK_CLICK, TICK1, TICK2, ENGINE, GAVEL, STAMP1, BILLS, STAMP2, ANKLE, blinkOn, truckPose,
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
const glowAt = (out: Stage, key: string, p: V3, s: number) => out.fx.push({ key: "glow" + key, cw: 128, ch: 128, draw: (pp) => art.glow(pp), x: p[0], y: p[1], z: p[2], w: s, h: s, soft: true });
const phoneCard = (out: Stage, p: V3, w: number, mode: art.MapMode, k: number, blink: boolean, pins = 0, finger = -1, flat = false) => {
  const kq = q(k, 90), fq = finger < 0 ? -1 : q(finger, 90);
  out.fx.push({ key: `phone|${mode}|${kq}|${blink}|${pins}|${fq}`, cw: 600, ch: 1100, draw: (pp) => art.phoneMap(pp, mode, kq, blink, pins, fq), x: p[0], y: p[1], z: p[2], w, h: w * 11 / 6, flat });
};

/** everything with a face or an effect in shot `id` at frame f */
export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light;
  SUN = cam.sun;
  const blink = blinkOn(f);
  switch (id) {
    case 1: { // the hook: he looks both ways, the box leaps onto the steel; the driver comes out of the store
      if (f < 104) {
        const look = f >= 49 && f < 62 ? (f < 55 ? -1 : 1) : 0;
        front(out, cam, "kub", -3.85, 0.15, 4.45, { mode: "stand", expr: f < SNAP ? "nervous" : "grin", facing: 1, look, prop: f < SNAP - 3 ? ["hold", "tracker"] : null, tilt: f < SNAP ? 0.06 : 0 }, f, [SNAP]);
      } else {
        const u = (f - 104) / 30;
        side(out, cam, "kub", -3.85 - 1.1 * u, 0.15, 4.45 + 0.2 * u, -1, 0, { mode: "march", phase: walkPhase(f, 0.8), stride: 0.55, expr: "grin" }, f);
      }
      burst(out, f, SNAP, ...TRACK_SPOT, 0.38, 7, "#ffffff");
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
    case 6: { // calm in his armchair: tea, then the phone
      const [x, , z] = Lv(0, 0, -1.15);
      const prop = f < PHONE_UP - 6 ? (["hold", "teacup"] as const) : (["hold", "phoneMap"] as const);
      front(out, cam, "kub", x, 0.45, z, { mode: "sit", expr: f >= SIP && f < SIP + 14 ? "relief" : "smile_closed", facing: 1, prop: [prop[0], prop[1]], headTilt: f >= SIP && f < SIP + 14 ? -0.12 : 0 }, f, [SIP]);
      if (f >= PHONE_UP - 6) phoneCard(out, Lv(0.18, 0.86, -0.42), 0.16, "live", (f - 610) / 220, blink);
      break;
    }
    case 7: { // aerial: the truck turns left, its tracker blinking green
      if (blink) glowAt(out, "aer", truckWorld(7, f, [-3.22, 0.6, 3.72]), 2.2);
      break;
    }
    case 8: { // the knowing nod; then the locked frame: phone in the foreground, the wall clock behind
      const [x, , z] = Lv(0, 0, -1.15), nod = (f0: number) => (f >= f0 && f < f0 + 10 ? -0.14 * Math.sin(((f - f0) / 10) * Math.PI) : 0);
      front(out, cam, "kub", x, 0.45, z, { mode: "sit", expr: "smile", facing: 1, look: f >= 795 ? 1 : 0, prop: ["hold", "phoneMap"], headTilt: nod(NOD) + nod(NOD2) }, f);
      if (f >= 795) phoneCard(out, Lv(0.632, 0.928, 0.252), 0.12, "pins", (f - 795) / 23, blink, f >= PIN2 ? 2 : f >= PIN1 ? 1 : 0);
      break;
    }
    case 9: { // 18 June: she walks to the back, drops her pen, finds the box, holds it up
      if (f >= 990 && f < 1028) { const u = (f - 990) / 38; side(out, cam, "driver", 4.8 - 8.55 * u, 0.15, 4.95, -1, 0, { mode: "march", phase: walkPhase(f, 1), stride: 0.8, expr: "whistle" }, f); }
      else if (f >= 1028 && f < 1102) front(out, cam, "driver", -3.75, 0.15, 4.95, { mode: f >= PEN_DROP + 6 ? "sit" : "stand", expr: f >= FIND ? "shock" : "neutral", facing: -1, prop: f < PEN_DROP ? ["hold", "clipboard"] : null }, f, [FIND]);
      else if (f >= 1102) front(out, cam, "driver", -4.15, 0.15, 4.85, { mode: "stand", expr: f < 1118 ? "shock" : "stern", facing: 1, prop: ["hold", blink ? "trackerLit" : "tracker"], tilt: 0.06 }, f, [1118]);
      if (f >= PEN_DROP && f < 1102) { // the pen falls and bounces under the bumper
        const t = f - PEN_DROP, y = t < 8 ? 1.0 - 0.83 * (t / 8) ** 2 : 0.17 + 0.08 * Math.max(0, Math.sin(((t - 8) / 6) * Math.PI)) * Math.exp(-(t - 8) / 8);
        card(out, "pen", 240, 40, (p) => art.pen(p), -3.55 + 0.012 * Math.min(t, 14), y + 0.01, 4.55, 0.16, 0.027, { rot: t * 0.5 });
      }
      if (f >= 1040 && f < YANK && blink) glowAt(out, "find", [TRACK_SPOT[0] - 0.03, TRACK_SPOT[1] - 0.02, TRACK_SPOT[2]], 0.12);
      burst(out, f, YANK, ...TRACK_SPOT, 0.4, 7, "#ffffff");
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
    case 15: { // match: his phone, the same route; his fingertip follows the dot to the store
      const k = (f - 1648) / 66;
      phoneCard(out, I(40, 0.004, 0), 0.3, "route", k, blink, 0, k - 0.03, true);
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
    case 18: { // the ankle monitor clacks shut; the same green blink
      front(out, cam, "kub", ...Ct(1.0, 0, 0.6), { mode: "stand", expr: f > ANKLE ? "dazed" : "nervous", facing: -1, look: f > ANKLE + 20 ? 0 : -1 }, f, [ANKLE + 1]);
      front(out, cam, "officer", ...Ct(1.85, 0, 0.15), { mode: "stand", expr: "stern", facing: -1 }, f);
      const k = q(clamp01((f - (ANKLE - 6)) / 6), 12), on = f > ANKLE + 3 && blinkOn(f, ANKLE + 3);
      card(out, `ankle${k}|${on}`, 360, 220, (p) => art.ankleMonitor(p, k, on), ...Ct(1.0, 0.17, 0.66), 0.2, 0.122);
      burst(out, f, ANKLE, ...Ct(1.0, 0.18, 0.7), 0.2, 5, "#ffffff");
      break;
    }
    case 19: { // he shuffles home; the camera cranes up until he is the dot
      const x = -14.0 - 0.45 * ((f - 2096) / 30);
      side(out, cam, "kub", x, 0.15, 8.6, -1, 0, { mode: "march", phase: walkPhase(f, 0.7), stride: 0.45, expr: "dazed" }, f);
      const on = blinkOn(f);
      card(out, "ankleW" + on, 360, 220, (p) => art.ankleMonitor(p, 1, on), x, 0.28, 8.66, 0.14, 0.085);
      if (on) glowAt(out, "him", [x, 0.4, 8.7], Math.max(0.15, (cam.pos.y - 1) * 0.045));
      break;
    }
    case 20: phoneCard(out, I(80, 0.004, 0), 0.3, "him", (f - 2150) / 400, blink, 0, -1, true); break;
  }
  return out;
};
