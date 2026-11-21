// Timeline of the Fossil sheet in the loft reel, timed to the Vietnamese voice (public/fossil/words.json, 75.8 s).
// Everything a camera needs (keys, glides, pushes, kicks, depth of field, dissolves) is read from plan.json, the direction's
// source of truth (videos/fossil-sheet-loft/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: LANDING + LOFT (one frame, the hatch joins them), AUCTION (counter, photo corner, saleroom), STORE (1999), PRESS (1999).
import plan from "../../../videos/fossil-sheet-loft/plan.json";
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
export const HOUSE = ORIGIN.landing, AUC = ORIGIN.auction, STORE = ORIGIN.store, PRESS = ORIGIN.press;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };
export const H = plan.house as unknown as Record<string, number[]> & { hatch_x: number[]; hatch_z: number[] };
export const AU = plan.auction as unknown as Record<string, number[]> & { seats: number[][]; soft: number[][]; rope: number[][]; owner_seat: number; top: number; table_size: number[] };
export const STO = plan.store as unknown as Record<string, number[]> & { kids: number[][] };
export const PR = plan.press as unknown as Record<string, number[]> & { rollers_x: number; blade_z: number };
export const SHEET = plan.sheet as { size: number[]; cols: number; rows: number; card: number[]; margin: number[]; tube_r: number; holos: string[] };
export const DMG = plan.damage as Record<string, number[]>;
export const ZOOM = plan.zoom as number[];
export const CEIL = 2.5, LOFT = 2.62;
/** a cell's centre on the sheet, sheet-local (x across, z down the sheet, top row at -z) */
export const cellAt = (r: number, c: number): V3 => [-0.3465 + (c + 0.5) * 0.063, 0, -0.484 + (r + 0.5) * 0.088];

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const BAND1 = [40, 55], SHOVE1 = 67, CORD1 = [100, 108], SLAM1 = 122;           // S01
export const CAL2 = [212, 250];                                                         // S02 calendar 1999 -> 2026
export const DUST3 = 285, SPIDER3 = [305, 330], CREAK3 = 339, POPS3 = [344, 356, 368];   // S03
export const OPEN5 = 533, HEAD5 = 540;                                                  // S05
export const RISE6 = [562, 574], PULL6 = [576, 586], DUCK6 = [588, 598];                 // S06
export const PUSH7 = 620, ROLLED7 = 638, TIN7 = 641, TINLAND7 = 645;                    // S07
export const LIFT8 = [752, 764], DROP8 = 788;                                           // S08 torn corner
export const WALL9 = [795, 811], PEEL9 = 834, ROLLUP9 = [836, 846], TOSS9 = [848, 860];  // S09
export const DASH10 = [881, 897], YANK10 = 900, HUG10 = 1028;                           // S10
export const SETDOWN11 = [1052, 1072], PEEK11 = 1110;                                   // S11
export const FREEZE12 = 1140;                                                           // S12
export const STACK13 = [1250, 1300];                                                    // S13
export const UNROLL14 = [1395, 1418], LAMP14 = 1420, GLEAM14 = 1498;                    // S14
export const NEXT15 = 1585, BLADEUP15 = [1606, 1614], CHOP15 = 1617;                    // S15
export const POINT16 = 1700, TAP16 = 1746;                                              // S16
export const FLASHES = [1842, 1859, 1873, 1886], STAMP17 = 1923;                        // S17
export const EST18 = [2036, 2056], GAPE18 = 2062;                                       // S18
export const RAISE19 = [2140, 2150];                                                    // S19
export const DOOR20 = 2180, BLADE20 = 2240, SQUINT20 = 2252;                            // S20
/** the calendar's year (S02 onward) */
export const yearAt = (f: number, id: number) => id < 2 ? 1999 : id > 2 ? 2026 : 1999 + Math.round(27 * clamp01((f - CAL2[0]) / (CAL2[1] - CAL2[0])));
/** dust on the tube and boards, 0 (1999) .. 1 (2026) */
export const dustAt = (f: number, id: number) => id < 2 ? 0 : id > 5 ? 1 : id === 2 ? clamp01((f - CAL2[0]) / (CAL2[1] - CAL2[0])) * 0.85 : 0.9 + 0.1 * clamp01((f - 256) / 200);
/** the lot board's lines (S18-S19) */
export const boardAt = (f: number, id: number) => ({ a: id > 18 || (id === 18 && f >= EST18[0]), b: id > 18 || (id === 18 && f >= EST18[1]) });
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};

export type Light = "day" | "golden";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  sunAz: (plan.sets[s.set as SetName].sun as number[])[0], sunEl: (plan.sets[s.set as SetName].sun as number[])[1] }));
/** sets built and shown per place (the landing and the loft share the hatch: both are up) */
export const SHOWN: Record<string, string[]> = { landing: ["landing", "loft"], loft: ["landing", "loft"], auction: ["auction"], store: ["store"], press: ["press"] };
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
