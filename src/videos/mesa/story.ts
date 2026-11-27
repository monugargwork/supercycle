// Timeline of the Mira Mesa reel (Bubble Mew), timed to the Vietnamese voice (public/mesa/words.json, 82.5 s).
// Everything a camera needs (keys, glides, pushes, kicks, dissolves) is read from plan.json, the direction's source of truth
// (videos/mira-mesa-bubble-mew/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: GYM (the Mira Mesa High gym with the school front, plaza and parking lot outside, one set), BEACH (the phone analogy).
import plan from "../../../videos/mira-mesa-bubble-mew/plan.json";
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
export const GYo = ORIGIN.gym, BEo = ORIGIN.beach;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const TILT1 = [20, 60], GLANCE1 = 100, BOLT1 = 103, DROP1 = 106, DOOR1 = 185;                                   // S01 the hook
export const SHOP2 = [240, 320], LAY2 = [350, 372, 394], EASEL2 = [400, 412];                                         // S02 setting up
export const GLEAM3 = 475, TAG3 = 530;                                                                                // S03 the Bubble Mew
export const WALK4 = [570, 600], LIFT4 = 596, TAKE4 = 629, UP4 = [630, 650];                                          // S04 the hand-over
export const GLANCE5 = 685, BOLT5 = 700, DROP5 = 703;                                                                 // S05 gone
export const DOOR6 = 790, LAUGH6 = [800, 836];                                                                        // S06 the joke
export const DROPFACE7 = 960;                                                                                         // S07 the doors settle
export const DOOR8 = 995, LIMP8 = [1000, 1068], PAIN8 = [1045, 1076], SEDAN8 = [1050, 1125];                          // S08 the chase
export const FREEZE9 = 1129;
export const HAND10 = [1250, 1270, 1290], BACK10 = [1350, 1370, 1388];                                                // S10 hand-overs everywhere
export const WALK11 = [1395, 1432], GIVE11 = 1440, BACK11 = [1446, 1480], RAISE11 = 1484;                              // S11 the phone
export const SHUTTER12 = 1520;
export const PIN14 = [1740, 1755], SHRUG14 = 1855;                                                                    // S14 the flyer
export const GUARD15 = [1908, 1930];                                                                                  // S15 the guard
export const WOMAN16 = [2004, 2018], TAKE16 = 2030, EASEL16 = [2056, 2070], BILLS16 = [2096, 2110, 2124];              // S16 replica, jar
export const ROUND17 = [2181, 2200], PRESS17 = [2203, 2222], TAPE17 = [2212, 2220], TALK17 = [2225, 2306];            // S17 her sign
export const RUN18 = [2347, 2398];
export const GYMP = plan.gym, BEACHP = plan.beach;
/** where the stranger runs: from his mark to just inside the doors, then out onto the plaza */
export const RUN = { S01: [BOLT1, DOOR1], S05: [BOLT5, DOOR6] };
/** the double doors' opening (radians) for shot id at frame f: pushed open, then a spring closer swings them shut with a small rebound */
const swing = (f: number, f0: number) => { if (f < f0) return 0; const t = (f - f0) / FPS, open = Math.min(1, (f - f0) / 5); return 1.35 * open * Math.exp(-t / 0.7) * Math.abs(Math.cos(Math.min(t, 3) * Math.PI / 1.4)); };
export const doorAngle = (id: number, f: number) => {
  if (id === 2) return 1.55;                       // the morning: propped open
  if (id === 1) return swing(f, DOOR1);
  if (id === 6 || id === 7) return swing(f, DOOR6);
  if (id === 8 || id === 9) return swing(f, DOOR8);
  return 0;
};
/** what stands on the easel: the Bubble Mew, nothing, or the replica */
export const easelHolds = (id: number, f: number): "mew" | "none" | "replica" => {
  if (id === 1) return "none";
  if (id === 2) return f >= EASEL2[1] ? "mew" : "none";
  if (id === 3) return "mew";
  if (id === 4) return f < LIFT4 ? "mew" : "none";
  if (id === 16) return f >= EASEL16[1] ? "replica" : "none";
  if (id >= 17) return "replica";
  return "none";
};
/** the three top-loaders knocked off the table: the frame they fall (null = still standing in their stand) */
export const stackFall = (id: number): number | null => id === 1 ? DROP1 : id === 5 ? DROP5 : id >= 6 && id <= 9 ? -999 : null;
/** a pendulum: the price tag on its string after a nudge at f0 (radians) */
export const tagSwing = (id: number, f: number) => {
  const nudges: Record<number, number[]> = { 1: [DROP1], 3: [TAG3], 4: [LIFT4], 5: [DROP5], 13: [1568, 1630], 16: [EASEL16[1]] };
  let a = 0; for (const f0 of nudges[id] ?? []) { if (f < f0) continue; const t = (f - f0) / FPS; a += 0.5 * Math.exp(-t / 1.4) * Math.sin((t * 2 * Math.PI) / 0.5); }
  return id === 13 ? a + 0.08 * Math.sin(f * 0.21) : a;
};
/** the black sedan: parked in its bay until S08, where it backs out and drives off to the left; gone after */
export const sedanAt = (id: number, f: number): { dx: number; dz: number; ry: number } | null => {
  if (id < 8) return { dx: 0, dz: 0, ry: 0 };
  if (id === 8 && f < SEDAN8[0]) return { dx: 0, dz: 0, ry: 0 };
  if (id === 8 || id === 9) {
    const ff = id === 9 ? FREEZE9 : f, t = (ff - SEDAN8[0]) / FPS;
    if (t < 1.2) { const u = t / 1.2; return { dx: 0, dz: -2.6 * u * u * (3 - 2 * u), ry: -0.9 * u * u }; }
    const t2 = t - 1.2; return { dx: -(1.6 * t2 * t2 + 2.0 * t2), dz: -2.6 - 0.3 * t2, ry: -Math.PI / 2 + 0.67 * Math.exp(-t2 * 2) };
  }
  return null;
};
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
export const SHOWN: Record<string, string[]> = { gym: ["gym"], beach: ["beach"] };
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
