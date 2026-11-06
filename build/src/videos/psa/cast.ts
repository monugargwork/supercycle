// The PSA reel's cast and 2D effects as lit flat cards in the 3D sets (pool/actor/fx machinery from the bridge short).
// stage(id, f, cam) returns everything with a face or an effect for shot `id` at frame f: a pure function of f.
import * as THREE from "three";
import { Pen, bodyFront, bodySide, fxBurst, fxPuff, fxNote, fxShadow, fxContact, Outfit, Expr, FrontOpts, SideOpts, SKIN } from "./toon";
import * as art from "./art";
import {
  FPS, SHOTS, V3, at, HOME, OFFICE, SHOP, ALLEY, clamp01, smooth, easeOut, pop, truckX, LOCK_POP, PULL, palletX, SUV_STOP, MAILBOX_OPEN, LIST,
  COUNT_AT, COUNT3K, POKE_AT, MONEY_AT, XSTAMP, CERT_GLOW, PRESS, ENV_OUT, ENV_HIT, SCAN, ALARM, SMASH, LABEL_OFF, LABEL_GONE, SWAP, PHONE_OK,
  DOSSIER, BADGES, suvX, LOCK_HANG, LOCK_REST, SCAN_BEAM, DESK_TOP, LIST_X, LIST_Z0, LIST_LEN, LIST_W, TECH13, BTN13,
  THIEF15, CLERK15, SLIDE15, SLAB15, DEAL_X,
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
  driver: { jacket: "#3f86c4", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#2f5f9a", skin: "#f5c9a0" } as Outfit,
  thief: { jacket: "#2e2b38", pants: "#3b3f52", boots: "#1f1c24", hat: "beanie", cap: "#26232e", mask: true, skin: SKIN } as Outfit,
  collector: { jacket: "#f08a2c", pants: "#3b5b9a", boots: "#f4f1ea", hat: "hair", hair: "#3a2a20", skin: "#f5c9a0" } as Outfit,
  tech: { jacket: "#f3f3ef", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#2a201a", glasses: true, tie: "#d8322f", skin: "#ecd0b6" } as Outfit,
  officer: { jacket: "#2a3a63", pants: "#1f2b4a", boots: "#15131a", hat: "police", cap: "#1f2b4a", badge: "#f0c64a", moustache: "#4a3020", skin: "#c99067", build: "stout" } as Outfit,
  agentA: { jacket: "#1f2233", pants: "#1f2233", boots: "#15131a", hat: "hair", hair: "#1a1820", shades: true, chest: "FBI", skin: SKIN } as Outfit,
  agentB: { jacket: "#1f2233", pants: "#1f2233", boots: "#15131a", hat: "hair", hair: "#5a3b2a", shades: true, chest: "FBI", skin: "#c99067" } as Outfit,
  clerk: { jacket: "#5a3a6e", pants: "#2e2a36", boots: "#2a201a", hat: "hair", hair: "#8a8f9c", tie: "#e8c45a", moustache: "#8a8f9c", skin: "#ffe2c2", build: "stout" } as Outfit,
  buyer: { jacket: "#8a6a44", pants: "#3b3f52", boots: "#2a201a", hat: "beanie", cap: "#55525e", shades: true, skin: "#ecd0b6" } as Outfit,
  walker1: { jacket: "#c25a7a", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#5a3b2a", skin: "#f5c9a0" } as Outfit,
  walker2: { jacket: "#5d7a3a", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#e2453c", skin: "#c99067" } as Outfit,
};
type Who = keyof typeof C;
const IDX: Record<Who, number> = { driver: 1, thief: 2, collector: 3, tech: 4, officer: 5, agentA: 6, agentB: 7, clerk: 8, buyer: 9, walker1: 10, walker2: 11 };

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
const vn = (n: number) => Math.round(n).toLocaleString("de-DE"); // Vietnamese grouping: 6.451
const faceTo = (cam: CamInfo, x: number, z: number) => Math.atan2(cam.pos.x - x, cam.pos.z - z);
const walkers = (out: Stage, cam: CamInfo, f: number) => {
  const x1 = -26 + 1.25 * (f / FPS), x2 = 14 - 1.1 * (f / FPS);
  side(out, cam, "walker1", x1, 0.15, 8.4, 1, 0, { mode: "march", phase: walkPhase(f, 0.8), stride: 0.78, expr: "smile" }, f);
  side(out, cam, "walker2", x2, 0.15, -8.2, -1, 0, { mode: "march", phase: walkPhase(f + 9, 0.75), stride: 0.73, expr: "neutral" }, f);
};
/** where the thief stands to swing at the padlock (screen-left of it, in the shot-4 medium) */
const THX = -3.45, THZ = 2.55;
const easeIn = (u: number) => clamp01(u) ** 2.2;
/** shot 15: the slab in the thief's hand and the clerk's scanner tip (shop-local) */
const SCAN_TIP: V3 = [CLERK15[0] - 0.2, 1.11, CLERK15[1] + 0.02];
/** a billboard card stretched between two world points (screen-aligned), e.g. a laser */
const beam = (out: Stage, cam: CamInfo, key: string, cw: number, ch: number, draw: (p: Pen) => void, a: V3, b: V3, thick: number) => {
  const w = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  out.fx.push({ key, cw, ch, draw, x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, z: (a[2] + b[2]) / 2, w, h: thick, soft: true, axis: [a, b] });
};
const slabDraw = (k: art.Kind, o: Parameters<typeof art.slab>[4] = {}, W = 620, H = 1000) => (p: Pen) => art.slab(p, W, H, k, o);

/** everything with a face or an effect in shot `id` at frame f */
export const stage = (id: number, f: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  LNAME = SHOTS[id - 1].light;
  SUN = cam.sun;
  const cr = (fw: number, upk: number, rt: number): V3 => [cam.pos.x + cam.fwd.x * fw + cam.up.x * upk + cam.right.x * rt,
    cam.pos.y + cam.fwd.y * fw + cam.up.y * upk + cam.right.y * rt, cam.pos.z + cam.fwd.z * fw + cam.up.z * upk + cam.right.z * rt];
  switch (id) {
    case 1: {
      walkers(out, cam, f); // the date is the house title (Reel.tsx)
      break;
    }
    case 2: walkers(out, cam, f); break;
    case 3: {
      const u = clamp01((f - 233) / 37), x = 4.9 + 2.1 * u;
      if (f < 233) front(out, cam, "driver", 4.9, 0, 1.3, { mode: "stand", expr: "smile", facing: 1 }, f);
      else side(out, cam, "driver", x, 0, 1.3 - 0.4 * u, 1, -0.2, { mode: "march", phase: walkPhase(f), stride: 0.9, expr: "whistle" }, f);
      for (let k = 0; k < 3; k++) { const ph = ((f - 236 - k * 9) / 26); if (ph > 0 && ph < 1) card(out, `note${k}`, 200, 200, (p) => fxNote(p, k), x + 0.45 + ph * 0.3, 1.85 + ph * 0.7, 1.1 - 0.2 * u, 0.28, 0.28, { rot: 0.3 * Math.sin(ph * 6) }); }
      break;
    }
    case 4: {
      // sneaks up to the truck's back, raises a hammer and smashes the 3D padlock (world.ts animates the lock)
      const u = smooth((f - 270) / 14), x = -6.3 + (THX - -6.3) * u, z = 0.9 + (THZ - 0.9) * u;
      if (f < 284) side(out, cam, "thief", x, 0, z, 1, 0.6, { mode: "march", phase: walkPhase(f, 1.6), stride: 0.85, expr: "lick" }, f);
      else {
        const hk = f < 287 ? 0 : f < LOCK_POP ? easeIn((f - 287) / (LOCK_POP - 287)) : f < 300 ? 1 : 1 - 0.55 * smooth((f - 300) / 16);
        front(out, cam, "thief", THX, 0, THZ, { mode: "stand", expr: f < LOCK_POP ? "lick" : f < 304 ? "laugh" : "grin", facing: 1, look: 1, prop: ["hammer", q(hk, 24)] }, f, [LOCK_POP]);
      }
      burst(out, f, LOCK_POP, LOCK_HANG[0] - 0.08, LOCK_HANG[1] + 0.02, LOCK_HANG[2], 0.55, 7, "#ffd27a");
      if (f >= LOCK_POP && f < LOCK_POP + 9) { const u2 = q((f - LOCK_POP) / 9, 18); card(out, `spk${u2}`, 400, 400, (p) => art.sparkle(p, u2), LOCK_HANG[0] - 0.1, LOCK_HANG[1] + 0.03, LOCK_HANG[2], 0.5, 0.5); }
      break;
    }
    case 5: {
      const px = palletX(f);
      if (f < PULL[0]) front(out, cam, "thief", -3.9, 0, 3.6, { mode: "stand", expr: "grin", facing: 1, look: 1 }, f);
      else {
        const tx = Math.min(px - 1.5, -3.75), moving = px - 1.5 < -3.75 && (f < PULL[1] || (f > 388 && f < 422));
        side(out, cam, "thief", tx, 0, 3.25, -1, 0, { mode: moving ? "march" : "stand", phase: walkPhase(f, 1.2), stride: 0.8, reach: -0.9, expr: "grin" }, f);
      }
      break;
    }
    case 6: {
      const H = (x: number, y: number, z: number) => at(HOME, x, y, z);
      const reach = smooth((f - 446) / 8) - smooth((f - 462) / 8);
      const expr: Expr = f < MAILBOX_OPEN + 3 ? "smile_closed" : f < 468 ? "shock" : "pained";
      const [x, , z] = H(2.15, 0, 6.95);
      front(out, cam, "collector", x, 0, z, { mode: "stand", expr, facing: 1, look: 1, prop: reach > 0.02 ? ["press", q(reach, 20)] : null }, f, [MAILBOX_OPEN + 3, 468]);
      if (f >= MAILBOX_OPEN + 2) { // a lonely fly comes out of the empty mailbox
        const u = (f - MAILBOX_OPEN - 2) / 24, [mx, my, mz] = H(2.9 + 0.18 * Math.sin(u * 9) * Math.min(1, u * 2), 1.2 + 0.32 * Math.min(1, u) + 0.05 * Math.sin(u * 17), 7.12 + 0.45 * Math.min(1, u * 1.5));
        card(out, `fly${q(u * 3 % 1, 8)}`, 200, 200, (p) => art.fly(p, u), mx, my, mz, 0.09, 0.09);
      }
      break;
    }
    case 7: {
      const O = (x: number, y: number, z: number) => at(OFFICE, x, y, z);
      const [ex, , ez] = O(-6.6, 0, 0.4);
      front(out, cam, "tech", ex, 0, ez, { mode: "stand", expr: f < COUNT_AT ? "stern" : "nervous", facing: 0, prop: ["hold", "notepad"] }, f, [COUNT_AT]);
      // the list lies on the desk: its top edge is held at the far end, the paper roll rolls toward the camera
      // across the desk top and slows to a stop (seen from the top-view camera)
      const k = 1 - (1 - smooth((f - LIST[0]) / (LIST[1] - LIST[0]))) ** 1.6, L = LIST_LEN;
      if (f >= LIST[0]) {
        const kk = Math.max(0.03, q(k, 60)), [lx, ly, lz0] = O(LIST_X, DESK_TOP + 0.004, LIST_Z0);
        card(out, `list${kk}`, 400, 1200, (p) => { p.g.scale(1, 1 / kk); p.clip(art.rr(0, 0, 400, 1200 * kk, 1), () => art.listScroll(p, 22)); }, lx, ly, lz0 + (L * kk) / 2, LIST_W, L * kk, { flat: true });
        card(out, "listRoll", 400, 90, (p) => { p.poly(art.rr(10, 12, 390, 78, 33), "#f3efe2", 9); p.ell(30, 45, 16, 30, "#d8d2c0", 6); }, lx, ly + 0.03, lz0 + L * kk + 0.03, LIST_W + 0.04, 0.09, { flat: true });
      }
      break;
    }
    case 8: {
      const O = (x: number, y: number, z: number) => at(OFFICE, x, y, z);
      for (let i = 0; i < 24; i++) {
        const c = i % 6, r = Math.floor(i / 6), [x, y, z] = O(-10 + c * 1.42, 0.95 + r * 1.1, 9.58);
        const poke = hh(i, 4) < 0.46, lit = f >= POKE_AT + (c + r) % 4 * 2;
        const dim = lit && !poke, lift = lit && poke ? 0.08 * pop(f, POKE_AT + ((c + r) % 4) * 2, 6) : 0;
        card(out, `wall${i % art.NSLAB}${dim ? "d" : ""}`, 372, 600, (p) => { art.slab(p, 372, 600, (i % art.NSLAB) as art.Kind); if (dim) { p.g.globalCompositeOperation = "source-atop"; p.g.fillStyle = "rgba(40,45,70,0.55)"; p.g.fillRect(0, 0, 372, 600); p.g.globalCompositeOperation = "source-over"; } },
          x, y + lift, z, 0.6, 0.96, { face: Math.PI });
        if (poke) sparkle(out, f, POKE_AT + 2 + ((c * 3 + r) % 5) * 2, x, y + 0.3, z - 0.1, 0.5);
      }
      break;
    }
    case 9: {
      front(out, cam, "officer", -5.4, 0, 4.4, { mode: "stand", expr: f < MONEY_AT ? "stern" : "shock", facing: 1, prop: ["hold", "notepad"] }, f, [MONEY_AT]);
      break;
    }
    case 10: {
      if (f >= SUV_STOP - 1 && f < SUV_STOP + 12) {
        const u = q((f - SUV_STOP + 1) / 13, 20);
        for (const dx of [-1.5, 1.5]) card(out, `puff${u}`, 300, 300, (p) => fxPuff(p, u), suvX(f) + dx + 0.6, 0.35, -1.6, 1.3, 1.3, { soft: true });
      }
      for (const [who, x0, d] of [["agentA", 10.9, 0], ["agentB", 13.3, 6]] as const) {
        const f0 = 796 + d;
        if (f < f0) continue;
        const u = smooth((f - f0) / 22);
        front(out, cam, who, x0 - 0.2 * u, 0, -1.35 + 0.95 * u, { mode: u < 1 ? "stroll" : "stand", phase: walkPhase(f, 1), expr: "stern", facing: who === "agentA" ? -1 : 1 }, f);
      }
      break;
    }
    case 11: {
      break;
    }
    case 12: {
      const O = (x: number, y: number, z: number) => at(OFFICE, x, y, z);
      const [x, y, z] = O(-3, 1.7, -5), glow = f < CERT_GLOW ? 0 : 0.55 + 0.45 * Math.sin((f - CERT_GLOW) * 0.35);
      card(out, `hero${q(glow, 10)}`, 868, 1400, slabDraw(0, { glow }, 868, 1400), x, y + 0.03 * Math.sin(f * 0.08), z, 0.62, 1.0,
        { face: faceTo(cam, x, z) + 0.14 * Math.sin((f - 980) * 0.05) });
      sparkle(out, f, 990, x + 0.3, y + 0.42, z + 0.05, 0.45); sparkle(out, f, CERT_GLOW, x + 0.26, y + 0.42, z + 0.1, 0.5); sparkle(out, f, 1032, x - 0.28, y - 0.2, z + 0.05, 0.4);
      break;
    }
    case 13: {
      const O = (x: number, y: number, z: number) => at(OFFICE, x, y, z);
      const k = smooth((f - (PRESS - 7)) / 6) - smooth((f - (PRESS + 6)) / 8);
      const [tx, , tz] = O(TECH13[0], 0, TECH13[1]);
      front(out, cam, "tech", tx, 0, tz, { mode: "stand", expr: f < PRESS ? "stern" : "grin", facing: 1, look: 1, prop: ["press", q(k, 20)] }, f, [PRESS]);
      burst(out, f, PRESS, ...O(BTN13[0], BTN13[1] + 0.06, BTN13[2]), 0.55, 6, "#ffd0c0");
      if (f >= ENV_OUT) for (let e = 0; e < 3; e++) {
        const u = clamp01((f - ENV_OUT - e * 3) / 13);
        if (u <= 0) continue;
        const a = O(-11.5, 3.2 + 0.6 * (e - 1), 0.8 * (e - 1)), b = cr(0.4, 0.3 * (e - 1), 0.4 * (e - 1));
        const p3 = a.map((v, i) => v + (b[i] - v) * u * u) as V3;
        card(out, "env", 400, 300, (p) => art.envelope(p), ...p3, 0.6, 0.45, { rot: -0.2 + 0.2 * e });
      }
      break;
    }
    case 14: {
      for (const [e, hit, tx] of [[0, ENV_HIT[0], -10], [1, ENV_HIT[1], 9]] as const) {
        const f0 = 1245 + e * 9, u = clamp01((f - f0) / (hit - f0));
        if (f < hit) {
          const a: V3 = [-2 + 3 * e, 3.6, 4], b: V3 = [tx, 1.8, -12.6];
          const p3: V3 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + 1.2 * Math.sin(Math.PI * u), a[2] + (b[2] - a[2]) * u];
          card(out, "env", 400, 300, (p) => art.envelope(p), ...p3, 0.9, 0.68, { rot: e ? 0.25 : -0.25 });
        } else {
          burst(out, f, hit, tx, 2.0, -12.4, 2.2, 9);
          const s = pop(f, hit + 2, 7);
          card(out, "exclaim", 300, 300, (p) => art.exclaim(p), tx, 4.3, -12.4, 1.3 * s, 1.3 * s);
        }
      }
      break;
    }
    case 15: {
      const S = (x: number, y: number, z: number) => at(SHOP, x, y, z);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
        const [x, y, z] = S(-5.25 + c * 1.5, [1.3, 2.15, 3.0][r] + 0.36, -7.66);
        card(out, `shelf${(c + r) % art.NSLAB}`, 372, 600, slabDraw(((c + r) % art.NSLAB) as art.Kind, {}, 372, 600), x, y, z, 0.38, 0.6, { face: 0 });
      }
      for (let i = 0; i < 6; i++) { // slabs lying in the glass counter
        const [x, y, z] = S(-2.4 + i * 0.95, 0.515, -2.2);
        card(out, `case${(i + 2) % art.NSLAB}`, 372, 600, slabDraw(((i + 2) % art.NSLAB) as art.Kind, {}, 372, 600), x, y, z, 0.32, 0.52, { flat: true, rot: (i % 2 ? 0.08 : -0.06) });
      }
      const alarm = f >= ALARM;
      const [hx, , hz] = S(THIEF15[0], 0, THIEF15[1]), [cx, , cz] = S(CLERK15[0], 0, CLERK15[1]);
      const onGlass = f >= SLIDE15[0];
      front(out, cam, "thief", hx, 0, hz, { mode: "stand", expr: alarm ? "shock" : "smile", facing: 1, look: 1, prop: onGlass ? null : ["hold", "slab"] }, f, [ALARM]);
      front(out, cam, "clerk", cx, 0, cz, { mode: "stand", expr: alarm ? "shock" : f >= SCAN ? "stern" : "neutral", facing: 1, look: 1, prop: f >= 1318 ? ["hold", "scanner"] : null }, f, [SCAN, ALARM], true);
      // he slides the slab across the glass top to the clerk; it lies there for the scan (seen from the top view)
      if (onGlass) {
        const u = smooth((f - SLIDE15[0]) / (SLIDE15[1] - SLIDE15[0]));
        const sx = THIEF15[0] + 0.25 + (SLAB15[0] - THIEF15[0] - 0.25) * u, sz = -1.76 + (SLAB15[2] + 1.76) * u;
        card(out, "glassSlab", 868, 1400, slabDraw(0, {}, 868, 1400), ...S(sx, SLAB15[1], sz), 0.32, 0.52, { flat: true, rot: 0.05 * (1 - u) });
      }
      // the scan: the red laser fan comes in from the clerk's scanner and sweeps across the label
      const LABEL_Z = SLAB15[2] - 0.2;
      if (f >= SCAN_BEAM[0] && f < SCAN_BEAM[1]) {
        const u = q((f - SCAN_BEAM[0]) / (SCAN_BEAM[1] - SCAN_BEAM[0]), 24), lx = SLAB15[0] - 0.12 + 0.24 * u;
        beam(out, cam, `laser${u}`, 800, 240, (p) => art.laser(p, u), S(lx, SLAB15[1] + 0.006, LABEL_Z), S(...SCAN_TIP), 0.42);
      }
      // the cancelled number: the label blinks red on the glass
      if (f >= SCAN_BEAM[1] && f < ALARM + 6 && Math.floor((f - SCAN_BEAM[1]) / 3) % 2 === 0)
        card(out, "redglow", 256, 256, (p) => { const g = p.g, gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, "rgba(255,40,40,0.8)"); gr.addColorStop(1, "rgba(255,40,40,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); },
          ...S(SLAB15[0], SLAB15[1] + 0.008, LABEL_Z), 0.42, 0.3, { flat: true, soft: true });
      if (alarm) {
        const s = pop(f, ALARM + 1, 6);
        card(out, "exclaimC", 300, 300, (p) => art.exclaim(p), ...S(CLERK15[0] + 0.05, 2.75, CLERK15[1] + 0.05), 0.75 * s, 0.75 * s);
        card(out, "exclaimT", 300, 300, (p) => art.exclaim(p), ...S(THIEF15[0] + 0.05, 2.35, THIEF15[1] + 0.05), 0.55 * s, 0.55 * s, { rot: -0.2 });
        burst(out, f, ALARM, ...S(3.6, 3.75, -7.6), 1.6, 10, "#ffb0a0");
      }
      break;
    }
    case 16: {
      const A = (x: number, y: number, z: number) => at(ALLEY, x, y, z);
      const k = f < SMASH - 6 ? 0 : f < SMASH ? smooth((f - SMASH + 6) / 6) : f < SMASH + 8 ? 1 : 1 - smooth((f - SMASH - 8) / 8);
      const hold = f >= 1422;
      const expr: Expr = f < SMASH ? "grin" : f < 1422 ? "laugh" : f < 1446 ? "shock" : "pained";
      const [tx, , tz] = A(0.25, 0, -1.9);
      front(out, cam, "thief", tx, 0, tz, { mode: "stand", expr, facing: 1, look: 1, prop: hold ? ["hold", "rawcard"] : ["hammer", q(k, 20)] }, f, [SMASH, 1422, 1446]);
      const [cx, , cz] = A(1.3, 0, -1.4);
      if (f < SMASH) card(out, "flatslab", 372, 600, slabDraw(1, {}, 372, 600), cx, 0.765, cz, 0.36, 0.58, { flat: true, rot: 0.35 });
      else if (!hold) card(out, "flatraw", 300, 420, (p) => art.card(p, 1, 10, 10, 290, 410), cx, 0.765, cz, 0.25, 0.35, { flat: true, rot: 0.35 });
      if (f >= SMASH && f < SMASH + 18) { const u = q((f - SMASH) / 18, 30); card(out, `shards${u}`, 600, 600, (p) => art.shards(p, u), cx, 0.95, cz, 1.3, 1.3); }
      burst(out, f, SMASH, cx, 0.9, cz, 1.2, 7);
      if (f >= LABEL_OFF && f < LABEL_GONE + 2) { // the grade label floats away and vanishes
        const u = easeOut((f - LABEL_OFF) / (LABEL_GONE - LABEL_OFF));
        card(out, "label", 500, 200, (p) => art.label(p, 500, 200), cx + 0.35 * u, 0.9 + 1.9 * u, cz - 0.4 * u, 0.5, 0.2, { rot: 0.5 * Math.sin(u * 7) });
      }
      if (f >= LABEL_GONE - 4 && f < LABEL_GONE + 10) { const u = q((f - LABEL_GONE + 4) / 14, 20); card(out, `poof${u}`, 400, 400, (p) => art.poof(p, u), cx + 0.35, 2.8, cz - 0.4, 0.8, 0.8, { soft: true }); }
      break;
    }
    case 17: {
      const A = (x: number, y: number, z: number) => at(ALLEY, x, y, z);
      const reach = 0.55 + 0.45 * smooth((f - 1478) / 12);
      const [tx, , tz] = A(DEAL_X, 0, -2.2), [bx, , bz] = A(-DEAL_X, 0, -2.2);
      side(out, cam, "thief", tx, 0, tz, -1, 0, { mode: "push", pose: q(reach, 20), expr: f < SWAP ? "smile" : "grin" }, f);
      side(out, cam, "buyer", bx, 0, bz, 1, 0, { mode: "push", pose: q(reach, 20), expr: f < SWAP ? "lick" : "smile" }, f);
      // hand position of the side 'push' pose: shoulder 0.05 m + reach (0.55 + 0.45 pose) x head height, at 1.11 m
      const hand = DEAL_X - (0.05 + (0.55 + 0.45 * reach) * 0.48), sw = smooth((f - SWAP + 4) / 8);
      card(out, "dealcard", 300, 420, (p) => art.card(p, 1, 10, 10, 290, 410), ...A(hand * (1 - 2 * sw), 1.17, -2.17), 0.13, 0.18);
      card(out, "dealcash", 400, 220, (p) => { for (let i = 0; i < 3; i++) p.poly(art.rr(20 + i * 6, 40 - i * 10, 380 + i * 6, 180 - i * 10, 10), "#8fd18a", 8); p.ell(200, 110, 34, 34, "#5aa55a", 6); },
        ...A(-hand * (1 - 2 * sw), 1.13, -2.13), 0.22, 0.12);
      break;
    }
    case 18: {
      const H = (x: number, y: number, z: number) => at(HOME, x, y, z);
      const ok = f >= PHONE_OK;
      front(out, cam, "collector", ...H(0, 0, 1.0), { mode: "stand", expr: ok ? "grin" : "neutral", facing: 0, look: ok ? 0 : 0.6, prop: ["hold", ok ? "phoneOk" : "phone"] }, f, [PHONE_OK]);
      if (ok) {
        const s = pop(f, PHONE_OK, 7);
        card(out, "checkBig", 300, 300, (p) => art.check(p, 300), ...H(0.42, 2.12, 1.15), 0.5 * s, 0.5 * s);
        sparkle(out, f, PHONE_OK, ...H(0.42, 2.12, 1.2), 0.9);
      }
      break;
    }
    case 19: {
      const H = (x: number, y: number, z: number) => at(HOME, x, y, z);
      front(out, cam, "collector", ...H(0, 0, 1.0), { mode: "stand", expr: f < 1800 ? "relief" : "smile_closed", facing: 0, prop: ["hold", "slabS"] }, f, [1800]);
      sparkle(out, f, 1640, ...H(0.25, 1.95, 1.2), 0.5);
      const spots: [V3, "check" | "truck" | "house"][] = [[H(-1.0, 3.15, 0.9), "check"], [H(0, 3.6, 0.9), "truck"], [H(1.0, 3.15, 0.9), "house"]];
      spots.forEach(([p3, kind], i) => {
        if (f < BADGES[i]) return;
        const s = pop(f, BADGES[i], 7);
        card(out, `badge${kind}`, 300, 300, (p) => art.badge(p, kind), ...p3, 0.85 * s, 0.85 * s);
        sparkle(out, f, BADGES[i], p3[0], p3[1], p3[2] + 0.05, 0.9);
      });
      if (f >= BADGES[0] + 6) { // dotted travel line behind the badges
        const k = q(clamp01((f - BADGES[0] - 6) / (BADGES[2] - BADGES[0] + 8)), 30);
        card(out, `trail${k}`, 1200, 500, (p) => art.trail(p, [[200, 310], [600, 130], [1000, 310]], k), ...H(0, 3.3, 0.85), 3.0, 1.25);
      }
      break;
    }
  }
  return out;
};
export { SKIN };
