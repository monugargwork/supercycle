// Timeline of the Chicago reel (Old Skool TCG), timed to the Vietnamese voice (public/chicago/words.json, 80.3 s).
// Everything a camera needs (keys, glides, pushes, kicks, dissolves) is read from plan.json, the direction's source of truth
// (videos/chicago-mew-theft/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: SHOP (the interior and the street outside it, one set), HOUSE (the analogy), JACKET (the lining insert).
import plan from "../../../videos/chicago-mew-theft/plan.json";
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
export const SHo = ORIGIN.shop, HOo = ORIGIN.house, JKo = ORIGIN.jacket;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const BILLS1 = [80, 85, 89], STEP1 = [100, 122], DIP1 = [128, 140], GRAB1 = 142, LIFT1 = [142, 150], HIDE1 = [150, 157]; // S01 the hook
export const RING4 = [462, 478], LIFT4 = 484, DOOR4 = 510, WALK4 = [512, 612], SET5 = [612, 622];                         // S04-S05 the call, he walks in
export const HANG5 = 556;
export const DIP6 = [638, 651], GRAB6 = 672, LIFT6 = [672, 684], HIDE6 = [684, 700];                                     // S06 the first card
export const STEP7 = [728, 745], KEY7 = 748, DRAWER7 = 752, TAKE7 = [756, 768], BILLS7 = [776, 781, 786], SHUT7 = 794;   // S07 the deal
export const TUCK8 = [804, 815], LIFTS8: [number, number][] = [[846, 856], [863, 873], [875, 885]], SHELF8 = [805, 826, 834, 866, 878]; // S08 three more
export const GLEAM9 = [905, 990, 1070];
export const REC_PERIOD = 30;                                                                                          // the REC lamp: 15 f on, 15 f off
export const FREEZE12 = 1336;
export const KID13 = [1500, 1560], TURN13 = 1563, SHAKE13 = [1590, 1615];                                               // S13
export const DOOR14 = [1628, 1642], STEP14 = [1650, 1680], GIFT14 = [1688, 1698];                                      // S14 the guest
export const WALK15 = [1708, 1750], SPOON15 = [1736, 1748], HIDE15 = [1750, 1757];                                     // S15 the spoon
export const SCRATCH16 = [1775, 1812], LIFT16 = [1822, 1832], WALK16 = [1832, 1896], OPEN16 = [1896, 1906], PUT16 = [1906, 1918], SHUT16 = 1920, LOCK16 = 1926; // S16
export const SHAKE17 = [1950, 2040], CUT17 = 2047;
export const DIAL18 = [2092, 2104];
export const POINT19 = [2140, 2160], WRITE19 = [2160, 2196];
export const DOOR20 = 2208, WALK20 = [2210, 2246], PAT20 = [2248, 2262], FAN20 = [2268, 2290];                         // S20 he leaves
export const RING21 = 2371, PHONE21 = [2380, 2392], FREEZE21 = 2398;                                                    // S21 his phone
export const SHOPP = plan.shop, HOUSEP = plan.house, JACKP = plan.jacket;
/** the box's ten items: when each one leaves (it rises out of the box, goes to his chest and behind the jacket) */
export const TAKEN: Record<number, { id: number; lift: number[]; hide: number[] }[]> = {
  0: [{ id: 6, lift: [GRAB6, LIFT6[1]], hide: HIDE6 }],
  1: [{ id: 8, lift: LIFTS8[0], hide: [LIFTS8[0][1], LIFTS8[0][1] + 6] }, { id: 1, lift: LIFT1, hide: HIDE1 }],
  5: [{ id: 8, lift: LIFTS8[1], hide: [LIFTS8[1][1], LIFTS8[1][1] + 6] }],
  6: [{ id: 8, lift: LIFTS8[2], hide: [LIFTS8[2][1], LIFTS8[2][1] + 6] }],
};
/** is item i still in the box at shot id, frame f? (S02-S05 come before the thefts; S01 is S08's first lift seen early) */
export const inBox = (i: number, id: number, f: number) => {
  if (id >= 2 && id <= 5) return true;
  if (id === 14 || id === 15) return true;
  const t = TAKEN[i]; if (!t) return true;
  if (id === 1) { if (i === 0) return false; if (i === 1) return f < LIFT1[0]; return true; }
  for (const x of t) if (x.id === id) return f < x.lift[0];
  const first = Math.min(...t.filter((x) => x.id !== 1).map((x) => x.id));
  return id < first;
};
/** the box sits in the locked glass case from S16 (after he puts it there) through S19 */
export const boxInCase = (id: number, f: number) => (id === 16 && f >= PUT16[1]) || id === 18 || id === 19;
export const recOn = (f: number) => Math.floor(f / (REC_PERIOD / 2)) % 2 === 0;
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
export const lightAt = (_id: number, _f: number): { k: number; sat: number } => ({ k: 1, sat: 1 }); // quality bar: no dims

export type Light = "day" | "golden";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  sunAz: (plan.sets[s.set as SetName].sun as number[])[0], sunEl: (plan.sets[s.set as SetName].sun as number[])[1] }));
/** sets built and shown per place */
export const SHOWN: Record<string, string[]> = { shop: ["shop"], house: ["house"], jacket: ["jacket"] };
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
  // a scene that comes in by a glide, tilt or hold starts from where the previous scene's camera ended
  const inT = (sc.in as { type?: string }).type ?? "";
  if (id > 1 && keys[0].glide && ["glide", "tilt", "hold"].includes(inT) && f < keys[0].f + keys[0].glide) cur = mixC(run(id - 1, sc.f[0] - 1), cur, glide((f - keys[0].f) / keys[0].glide));
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
