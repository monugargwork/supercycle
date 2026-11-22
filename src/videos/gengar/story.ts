// Timeline of the Gengar reel, timed to the Vietnamese voice (public/gengar/words.json, 79.6 s).
// Everything a camera needs (keys, glides, pushes, kicks, depth of field, dissolves) is read from plan.json, the direction's
// source of truth (videos/gengar-unpaid/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: HALL (Fanatics Collect: the stage, the lot plinth, the champagne table), CENSUS (the Latios wall), CAFE (the you-see terrace), DESK (the writer at night).
import plan from "../../../videos/gengar-unpaid/plan.json";
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
export const HAo = ORIGIN.hall, CNo = ORIGIN.census, CFo = ORIGIN.cafe, DKo = ORIGIN.desk;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const WIND1 = [70, 76], SLAM1 = 79, TAG1 = 80;                                  // S01 the gavel, the tag drops
export const WALK2 = [104, 140], REACH2 = 150, FLICK2 = 156, SPIN2 = [156, 182], GHOST2 = [196, 236], LIFT2 = 262, FADE2 = [278, 292]; // S02
export const GLEAM3 = [440, 470], FW3 = [474, 480, 486], GRADE3 = 535;                  // S03 the slab
/** S04: the 32 bids, accelerating from f640 to f744; the board lands on $576,000 at f750 */
export const BIDS4: number[] = Array.from({ length: 32 }, (_, i) => Math.round(640 + 104 * (1 - (1 - i / 31) ** 1.7)));
export const LAND4 = 750;
export const PULLS5 = [790, 804, 818, 832, 846, 860, 874, 888], TOP5 = 905;              // S05 the cord, hand over hand
export const CLIMB6 = [1062, 1092], WIND6 = [1084, 1090], SLAM6 = 1094, TAG6 = 1095;    // S06 the Latios
export const SPOT7 = 1204, GLEAM7 = [1208, 1222];                                       // S07 the best one
export const TILT8 = [1240, 1250], POP8 = 1252;                                         // S08 the corks
export const FREEZE9 = 1285, WALK9 = [1310, 1336], BILL9 = [1336, 1356], POINT9 = 1391; // S09 the bill, the pointing
export const FAN10 = [1412, 1468], TUCK10 = [1470, 1484], IOU10 = [1490, 1508];         // S10 the cash, the ghost note
export const MEGA11 = [1548, 1582], THUMP11 = 1590, ENV11 = [1636, 1668], SOLID11 = [1675, 1700], STAMP11 = 1707; // S11
export const ROWS12 = [1840, 1856, 1872, 1888, 1904], NOMONEY12 = 1913, SHOCK12 = 1810; // S12 rows ghost off
export const BTN13 = 2030;                                                              // S13 the board clears
export const BIG14 = 2100, RAISE14 = [2130, 2150], DOWN14 = [2183, 2200], PHONE14 = [2206, 2220], SCROLL14 = [2236, 2286], PAID14 = 2294, POP14 = 2312; // S14
export const DRIFT15 = [2340, 2405];                                                    // S15 the ghost drifts by
export const HALLP = plan.hall, CENP = plan.census, CAFP = plan.cafe, DESKP = plan.desk;
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
/** room light per frame: 1 = the preset; scenes may dim (S02 next morning, S12 night, S15 the dark hall) */
export const lightAt = (id: number, f: number): { k: number; sat: number } => {
  const sc = plan.scenes[id - 1] as { dim?: number; dim_ramp?: number[]; sat?: number };
  if (sc.dim) return { k: sc.dim, sat: sc.sat ?? 0.85 };
  if (sc.dim_ramp) { const [a, b, k] = sc.dim_ramp, u = smooth((f - a) / (b - a)); return { k: 1 + (k - 1) * u, sat: 1 - 0.25 * u }; }
  return { k: 1, sat: 1 };
};

export type Light = "day" | "golden";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  sunAz: (plan.sets[s.set as SetName].sun as number[])[0], sunEl: (plan.sets[s.set as SetName].sun as number[])[1] }));
/** sets built and shown per place */
export const SHOWN: Record<string, string[]> = { hall: ["hall"], census: ["census"], cafe: ["cafe"], desk: ["desk"] };
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
