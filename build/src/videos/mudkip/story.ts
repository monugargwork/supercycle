// Timeline of the Mudkip Art Academy reel, timed to the Vietnamese voice (public/mudkip/words.json, 74.6 s).
// Everything a camera needs (keys, glides, pushes, kicks, depth of field, dissolves) is read from plan.json, the direction's
// source of truth (supercycle repo videos/mudkip-art-academy/plan.json): numbers are never retyped here.
// Sets live far apart in one scene: AUCTION, FACTORY, ROOM, SHOP, LAWN, TABLE.
import plan from "./plan.json";
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
export const AUCTION = ORIGIN.auction, FACTORY = ORIGIN.factory, ROOM = ORIGIN.room, SHOP = ORIGIN.shop, LAWN = ORIGIN.lawn, TABLE = ORIGIN.table;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const SLAM = 29;                        // S01: the sack hits the desk
export const LAUGH = 130, LUNGE = 232;         // S02
export const STAMPS = [277, 292, 307, 322, 337, 352]; // S03: press contacts
export const DRAW0 = 466, DRAW1 = 551, WIN = 586, PUSH5 = 634; // S05
export const LIFT6 = 731, HUG6 = 752;          // S06
export const RIP = 831;                        // S07
export const GAVELS = [990, 1179, 1357, 1563, 2159];
export const WINGS = 1127;                     // S10: the board throws out its wings
export const PLACE12 = 1433;                   // S12: the slab stands on column A
export const BID_LAST = 1481;                  // S13
export const HOLD14 = 1496, STRIKE14 = 1563;   // S14
export const SET15 = 1624, DROP15 = 1626, HIT15 = 1638, LAND15 = 1652; // S15
export const SLAB16 = 1682, COVER16 = 1722, LOUPE16 = 1798;            // S16
export const DEAL0 = 1823, CASES = [1903, 1910, 1917], TEN = 1937, SWEEP0 = 1950, SWEEP1 = 1964; // S17
export const BRISE = [1996, 2020], PLACE18 = 2122, PODIUM = [2167, 2181]; // S18
export const JAWS = [2205, 2209, 2213], SLIP = 2211, FLOOR19 = 2236;     // S19

// ---------------- the stage's moving parts ----------------
/** price board value at frame f */
export const boardValue = (f: number) => {
  const roll = (a: number, b: number, f0: number, f1: number, step: number) => { const k = smooth((f - f0) / (f1 - f0)); return f >= f1 ? b : Math.round((a + (b - a) * k * k) / step) * step; };
  if (f < 953) return 0;
  if (f < 1111) return roll(0, 42000, 953, 988, 500);
  if (f < 1187) return roll(42000, 3720000, 1111, 1175, 10000);
  if (f < 1313) return 0;
  if (f < 1368) return roll(0, 8400000, 1313, 1352, 50000);
  if (f < 1496) return 0;
  if (f < 2002) return roll(1000000, 4880000, 1500, 1559, 10000);
  if (f < 2137) return 0;
  return roll(0, 3080500, 2137, 2157, 500);
};
/** 0 = the narrow base board, 1 = both wings out (they stay out once thrown) */
export const boardWide = (f: number) => { const u = (f - WINGS) / 5; return u <= 0 ? 0 : u < 1 ? u * u : 1 + 0.035 * Math.sin((u - 1) * 3) * Math.exp(-(u - 1) * 1.6); };
export const soldLamp = (f: number) => (f >= 990 && f < 1100) || (f >= 1179 && f < 1187) || (f >= 1357 && f < 1368) || (f >= STRIKE14 && f < 2000) || f >= 2159;
const DATES: [number, string][] = [[0, "LIVE AUCTION"], [881, "THÁNG 11 · 2024"], [1072, "THÁNG 9 · 2026"], [1195, "3 NGÀY SAU"], [1376, "1 THÁNG SAU"]];
/** the flap date plate: text and the flap phase (0..1 while it flips, 1 = settled) */
export const dateAt = (f: number) => {
  let i = 0; while (i + 1 < DATES.length && f >= DATES[i + 1][0]) i++;
  const u = clamp01((f - DATES[i][0]) / 9);
  return { text: u < 0.5 && i > 0 ? DATES[i - 1][1] : DATES[i][1], flap: i === 0 ? 1 : Math.abs(2 * u - 1) };
};
/** which card is in the slab on column A, and whether it stands there */
export const lotA = (f: number) => ({ img: f >= 1187 && f < 1368 ? "pika_rain" : "mudkip_aa", on: f < 1368 || f >= PLACE12 });
export const colA = (f: number) => 1.78 + 0.17 * smooth((f - PODIUM[0]) / (PODIUM[1] - PODIUM[0]));
export const colB = (f: number) => (f < BRISE[0] ? 0.4 : 0.5 + 1.28 * smooth((f - BRISE[0]) / (BRISE[1] - BRISE[0])) - 0.33 * smooth((f - PODIUM[0]) / (PODIUM[1] - PODIUM[0])));
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
/** S15 balance: sin(tilt) of the beam (+ = near pan up) and the villa's height above its pan */
export const beamSin = (f: number) => { const u = clamp01((f - DROP15) / (HIT15 - DROP15)); return 0.13 - 0.52 * u * u; };
export const villaAir = (f: number) => { const t = (f - HIT15) / FPS; if (t < 0) return 0; const v = 2.6, T = (2 * v) / 9.8; if (t < T) return Math.max(0, v * t - 4.9 * t * t) * 1.2; const t2 = t - T; return t2 < 0.2 ? 0.05 * Math.sin((t2 / 0.2) * Math.PI) : 0; };

export type Light = "day" | "golden";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  ...(s.light === "golden" ? { sunAz: 150, sunEl: 52 } : s.set === "room" ? { sunAz: -50, sunEl: 42 } : s.set === "table" ? { sunAz: 75, sunEl: 60 } : {}) }));
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
