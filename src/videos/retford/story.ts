// Timeline of the Chicago reel (Old Skool TCG), timed to the Vietnamese voice (public/retford/words.json, 80.3 s).
// Everything a camera needs (keys, glides, pushes, kicks, dissolves) is read from plan.json, the direction's source of truth
// (videos/retford-wall-heist/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: UNIT (the estate, the road, the station), KIDROOM, CTRL, YARD, COURT, COURTROOM.
import plan from "../../../videos/retford-wall-heist/plan.json";
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
export const UNo = ORIGIN.unit, KIo = ORIGIN.kidroom, CTo = ORIGIN.ctrl, YAo = ORIGIN.yard, COo = ORIGIN.court, RMo = ORIGIN.courtroom;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const UP = plan.unit, VANP = plan.van, KIDP = plan.kid, CTRLP = plan.ctrl, YARDP = plan.yard, COURTP = plan.court, ROOMP = plan.room;
export const DRILL1 = [0, 29], RING1 = 28, TIP1 = 32, LAND1 = 40, STEP1 = [40, 52];                    // S01 the breach
export const LIFT2 = [116, 128], WALK2 = [130, 146], PUSH2 = [146, 160];                               // S02 a carton out through the hole
export const BELL3 = 181, PANEL3 = 229, TURN3 = 236;                                                   // S03 the alarm reaches the station
export const LOADA4 = [300, 340], LOADB4 = [350, 390];                                                 // S04 loading in the wide
export const TEAR5 = [455, 490, 522];                                                                  // S05 the calendar pages
export const FREEZE6 = 548, RED6 = [631, 671];                                                         // S06 frozen, red strobe
export const REC7 = 754, SWIVEL7 = [756, 772], LOAD7 = [[700, 760], [770, 820]];                       // S07 the camera wakes up
export const PEEL9 = [1051, 1062], STICK9 = [1066, 1094], OPEN9 = [1124, 1136];                        // S09 the notebook
export const MON10 = 1215, MONSTEP10 = 12, ROUTE10 = [1215, 1300], POINT10 = 1290;                     // S10 the control room
export const STOP11 = YARDP.car_turn, DOORS11 = 1365, WALK11 = [1370, 1430], FREEZE11 = 1438, DROP11 = 1440, LAND11 = 1452; // S11
export const TAP12 = 1588, NOD12 = 1650;
export const OUT15 = [1950, 1990], GLANCE15 = [1995, 2005], AWAY15 = [2010, 2075], STOPR15 = 2082, BACK15 = [2090, 2140]; // S15
export const WALK17 = [2262, 2292], DOOR17 = 2295, IN17 = [2300, 2320];                                // S17
export const REC_PERIOD = 30;
export const recOn = (f: number) => Math.floor(f / (REC_PERIOD / 2)) % 2 === 0;
/** the van's route (plan.van_route, dense [f, x, z, heading deg]); outside S08 it stands where the scene puts it */
const ROUTE = plan.van_route as number[][];
export const vanRoute = (f: number): [number, number, number] => {
  if (f <= ROUTE[0][0]) return [ROUTE[0][1], ROUTE[0][2], ROUTE[0][3]];
  const i = Math.min(ROUTE.length - 1, Math.max(0, Math.floor(f) - ROUTE[0][0])), r = ROUTE[i], n = ROUTE[Math.min(ROUTE.length - 1, i + 1)], u = f - Math.floor(f);
  return [r[1] + (n[1] - r[1]) * u, r[2] + (n[2] - r[2]) * u, r[3] + (n[3] - r[3]) * u];
};
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
export const lightAt = (_id: number, _f: number): { k: number; sat: number } => ({ k: 1, sat: 1 }); // quality bar: no dims

export type Light = "day" | "golden" | "night";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  sunAz: (((s as { sun?: number[] }).sun ?? plan.sets[s.set as SetName].sun) as number[])[0], sunEl: (((s as { sun?: number[] }).sun ?? plan.sets[s.set as SetName].sun) as number[])[1] }));
/** sets built and shown per place */
export const SHOWN: Record<string, string[]> = { unit: ["unit"], kidroom: ["kidroom"], ctrl: ["ctrl"], yard: ["yard"], court: ["court"], courtroom: ["courtroom"] };
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
