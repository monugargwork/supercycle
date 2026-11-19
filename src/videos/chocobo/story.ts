// Timeline of the Fanatics unpaid Pikachu reel, timed to the Vietnamese voice (public/chocobo/words.json, 77.1 s).
// Everything a camera needs (keys, glides, pushes, kicks, depth of field, dissolves) is read from plan.json, the direction's
// source of truth (videos/golden-chocobo/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets live far apart in one scene: STORE (the game store and its back room, joined by a window), GARAGE, CON (MagicCon).
import plan from "../../../videos/golden-chocobo/plan.json";
export const FPS = 30;
export const TOTAL = plan.frames;
export type V3 = [number, number, number];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
export const pop = (f: number, f0: number, n = 8) => {
  const u = (f - f0) / n;
  if (u <= 0) return 0;
  if (u >= 2) return 1;
  return u < 1 ? 1.15 * Math.sin((u * Math.PI) / 2) : 1 + 0.15 * Math.cos(((u - 1) * Math.PI) / 2);
};
export const at = (o: V3, x: number, y: number, z: number): V3 => [o[0] + x, o[1] + y, o[2] + z];
type SetName = keyof typeof plan.sets;
export const ORIGIN = Object.fromEntries(Object.entries(plan.sets).map(([k, s]) => [k, s.origin as V3])) as Record<SetName, V3>;
export const STORE = ORIGIN.store, GARAGE = ORIGIN.garage, CON = ORIGIN.con;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
const B = plan.beats;
export const SLAM1 = B.slam, WHIP1 = B.whip;
export const TABLE = B.table as [number, number], TOP = B.top, SLAB_Y = B.slab_y, HEN = B.hen as [number, number];
export const TOWER = B.tower as [number, number], BRICK = B.brick as V3;
export const PLACE8 = B.place8 as number[], PLACE9 = B.place9 as [number, number][];
export const NOD5 = 618, SLIDE5 = [630, 646];
export const FROWN6 = 702, LIFT7 = [745, 752];
export const SHAKE9 = 1010;
export const LOUPE11 = [1268, 1330], SLAB11 = [1334, 1360], TEN11 = 1381;
export const BULBS12 = [1420, 1446], DARK12 = [1506, 1522];
export const DOOR13 = [1618, 1630], SIT13 = [1648, 1662];
export const SHAKE14 = 1772, STEP15 = [1884, 1898], LAY15 = [1900, 1910], TIP15 = 1912;
export const LIT16 = 2074;
export const HOP17 = [2236, 2246], PECK17 = 2250, CLUCK17 = 2256;
export const CLUCK2 = 121, CONFIRM4 = 572, POST4 = 487;

/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
/** the cage's x on the deal table (store-local): slid across by the seller in S05 */
export const cageX = (id: number, f: number) => id < 5 ? B.cage0 : id > 5 ? B.cage1 : B.cage0 + (B.cage1 - B.cage0) * smooth((f - SLIDE5[0]) / (SLIDE5[1] - SLIDE5[0]));
/** the velvet cloth: on the cage until the whip, then thrown left on an arc, tumbling, and a heap on the floor (store-local) */
export const clothAt = (id: number, f: number) => {
  const on = { p: [B.cage0, TOP + 0.02, TABLE[1]] as V3, rx: 0, rz: 0, squash: 1, sway: 0 };
  if (id === 1 && f < WHIP1) { const sw = f >= SLAM1 ? 0.04 * Math.sin((f - SLAM1) * 0.9) * Math.exp(-(f - SLAM1) / 8) : 0; return { ...on, sway: sw }; }
  const t = id === 1 ? (f - WHIP1) / FPS : 9, T = 0.42, end: V3 = [1.25, 0.0, TABLE[1] - 0.15];
  if (t >= T) return { p: end, rx: 0, rz: 1.2, squash: 0.25, sway: 0 };
  const u = t / T, p = [on.p[0] + (end[0] - on.p[0]) * u, on.p[1] + 0.55 * 4 * u * (1 - u) * (1 - u * 0.4) + (end[1] - on.p[1]) * u * u, on.p[2] + (end[2] - on.p[2]) * u] as V3;
  return { p, rx: 0.6 * u, rz: 1.2 * u + 2.2 * Math.sin(Math.PI * u), squash: 1 - 0.75 * u * u, sway: 0 };
};
/** the briefcase: y offset (held up, slammed), lid angle (rad, 0 = shut), visible */
export const caseAt = (id: number, f: number) => {
  if (id >= 16) return { dy: 0, lid: 0, vis: false };
  if (id > 1) return { dy: 0, lid: 1.66, vis: true };
  const dy = f < SLAM1 - 4 ? 0.2 + 0.006 * Math.sin(f * 0.7) : f < SLAM1 ? 0.2 * (1 - ((f - SLAM1 + 4) / 4) ** 2) : hop(f, SLAM1, 0.3) * 0.15;
  const u = (f - SLAM1 - 4) / 6, lid = u <= 0 ? 0 : u < 1 ? 1.83 * Math.sin((u * Math.PI) / 2) : 1.66 + 0.17 * Math.cos((u - 1) * 3) * Math.exp(-(u - 1) * 1.5);
  return { dy, lid, vis: true };
};
/** the cash tower: number of bricks standing and its sway angle (rad, about its base, around the view axis) */
export const towerAt = (id: number, f: number) => {
  if (id < 8) return { n: 0, sway: 0, landing: -1 };
  let n = 0, landing = -1;
  for (const t of PLACE8) if (id > 8 || f >= t) n++; else if (landing < 0 && f >= t - 6) landing = t;
  for (const [t, c] of PLACE9) if (id > 9 || (id === 9 && f >= t)) n += c; else if (id === 9 && landing < 0 && f >= t - 6) landing = t;
  const last = PLACE9[PLACE9.length - 1][0], tt = (f - last) / FPS;
  const sway = id === 9 && tt > 0 ? 0.05 * Math.sin(tt * 1.4 * Math.PI * 2) * Math.exp(-tt / 0.7) : id === 10 ? 0.012 * Math.sin((f - 1106) * 0.3) * Math.exp(-(f - 1106) / 20) : 0;
  return { n, sway, landing };
};
/** the lightbox map: how many of the 77 bulbs are lit, and whether the dark wave has run (then only 3 stay) */
export const bulbsAt = (id: number, f: number) => {
  if (id < 12) return { lit: 77, dark: 0 };
  const lit = Math.round(77 * clamp01((f - BULBS12[0]) / (BULBS12[1] - BULBS12[0])));
  return { lit, dark: clamp01((f - DARK12[0]) / (DARK12[1] - DARK12[0])) };
};
/** car B's door (rad, about its front hinge): shut, pulled open (heavy: slow start, two rebounds at the stop) */
export const doorB = (f: number) => {
  if (f < DOOR13[0]) return 0;
  const u = (f - DOOR13[0]) / (DOOR13[1] - DOOR13[0]);
  if (u < 1) return 1.45 * u * u;
  return 1.45 - 0.08 * Math.abs(Math.sin((u - 1) * 4)) * Math.exp(-(u - 1) * 2);
};
/** the balance beam's tilt (rad, + = the REAL pan, the left one, down) */
export const beamAt = (id: number, f: number) => {
  if (id !== 15) return id > 15 ? 0.28 : 0.0;
  const t = (f - TIP15) / FPS;
  return t < 0 ? 0.0 : 0.28 - 0.28 * Math.cos(t * 1.2 * Math.PI * 2) * Math.exp(-t / 0.35);
};
/** the hen: on her crate, or hopping onto the deal table (S17); beak open = cluck */
export const henAt = (id: number, f: number): { p: V3; open: number; tilt: number; peck: number } => {
  const crate: V3 = [HEN[0], 0.35, HEN[1]], tbl: V3 = [HEN[0] - 0.02, TOP, TABLE[1] + 0.25];
  const cl = (c: number) => (f >= c && f < c + 8 ? 1 : 0);
  if (id === 17 && f >= HOP17[0]) {
    const u = clamp01((f - HOP17[0]) / (HOP17[1] - HOP17[0]));
    const p: V3 = [crate[0] + (tbl[0] - crate[0]) * u, crate[1] + (tbl[1] - crate[1]) * u + 0.25 * 4 * u * (1 - u), crate[2] + (tbl[2] - crate[2]) * u];
    const pk = f >= PECK17 && f < PECK17 + 5 ? 1 : 0;
    return { p, open: cl(CLUCK17), tilt: 0, peck: pk };
  }
  return { p: crate, open: id === 2 ? cl(CLUCK2) : 0, tilt: id === 2 && f >= CLUCK2 - 3 ? 0.25 : 0, peck: 0 };
};

export type Light = "day" | "golden";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  ...(s.light === "golden" ? { sunAz: 150, sunEl: 34 } : s.set === "museum" ? { sunAz: 15, sunEl: 72 } : {}) }));
/** dissolves between scenes (the plan's In): time jumps dissolve, the screen-to-card match is a through-object dissolve */
export const XFADE: Record<number, number> = Object.fromEntries(plan.scenes.map((s, i) => [i + 1, (s.in as { n?: number }).n ?? 0]).filter(([, n]) => n > 0));
export const FLASH_AT = -100;
export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

// ---------------- camera (same runner as the plan check: scripts/plan_lib.py) ----------------
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type PKey = { f: number; pos: number[]; look: number[]; fov: number; roll?: number; push?: number; punch?: number[]; glide?: number; cut?: boolean; blur?: number; focus?: number[] };
const mixC = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 30) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
const keyCam = (o: V3, k: PKey, f: number): Cam => {
  const kk = pushK(f, k.f, k.push ?? 0, k.punch?.[0] ?? 0, k.punch?.[1] ?? 30), L = at(o, k.look[0], k.look[1], k.look[2]), P = at(o, k.pos[0], k.pos[1], k.pos[2]);
  return { pos: [L[0] + (P[0] - L[0]) * kk, L[1] + (P[1] - L[1]) * kk, L[2] + (P[2] - L[2]) * kk], look: L, fov: k.fov, roll: k.roll ?? 0 };
};
const run = (id: number, f: number): Cam => {
  const sc = plan.scenes[id - 1], o = ORIGIN[sc.set as SetName], keys = sc.cams as PKey[];
  let cur = keyCam(o, keys[0], f);
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? keyCam(o, k, f) : mixC(cur, keyCam(o, k, f), glide((f - k.f) / (k.glide ?? 24)));
  }
  return cur;
};
export const KICKS: [number, number][] = plan.scenes.flatMap((s) => s.kicks as [number, number][]);
const kickAt = (f: number) => {
  let a = 0;
  for (const [f0, g] of KICKS) { const n = f - f0; if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5; }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(id, f), a = kickAt(f);
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a;
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};

// ---------------- lens: every camera key carries its blur and focus ----------------
type DofKey = { f: number; dur: number; cInf: number; focus: V3 };
const DOF: DofKey[] = plan.scenes.flatMap((s) => (s.cams as PKey[]).map((k, i) => {
  const o = ORIGIN[s.set as SetName], p = k.focus ?? k.look;
  return { f: k.f, dur: i === 0 || k.cut ? 0 : k.glide ?? 24, cInf: k.blur ?? 0, focus: at(o, p[0], p[1], p[2]) };
}));
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)], k = d.dur ? glide((f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: (() => [p.focus[0] + (d.focus[0] - p.focus[0]) * k, p.focus[1] + (d.focus[1] - p.focus[1]) * k, p.focus[2] + (d.focus[2] - p.focus[2]) * k] as V3) };
};
export const TITLES = plan.titles as { f: number; out: number; text: string; style: number; from: string }[];
