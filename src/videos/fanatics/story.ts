// Timeline of the Fanatics unpaid Pikachu reel, timed to the Vietnamese voice (public/fanatics/words.json, 77.1 s).
// Everything a camera needs (keys, glides, pushes, kicks, depth of field, dissolves) is read from plan.json, the direction's
// source of truth (videos/fanatics-unpaid-pikachu/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets live far apart in one scene: HALL (the stage, the sold wall, the office door), NEWSSTAND, STREET, MUSEUM.
import plan from "../../../videos/fanatics-unpaid-pikachu/plan.json";
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
export const HALL = ORIGIN.hall, NEWS = ORIGIN.newsstand, STREET = ORIGIN.street, MUSEUM = ORIGIN.museum;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const GAVELS = [69, 325];               // S01 the hook (TOTAL snaps), S02 the hammer at 7,000,000
export const HOLD1 = 0;                        // the gavel is held up from frame 0 in the hook
export const POP1 = 118, POP5 = 693;           // the hero ticket's pin pops (S01, S05)
export const BUNDLES = [414, 428, 445];        // S03 the three bundles land
export const CAL = [[0, "9 · 2026"], [533, "10 · 2026"], [637, "11 · 2026"]] as [number, string][];
export const STAMP4 = 591;                     // S04 PAID
export const FISH5 = [712, 724, 733, 738];     // S05: stick in, flick, pressed back, new pin
export const CURL6 = [800, 830, 839];          // S06: the draught starts, stillness, full curl (CANCELLED)
export const WALK8 = [1008, 1046];             // S08 the writer walks in
export const UNPIN10 = 1490, SHRED10 = 1573, LEVEL10 = [1600, 1620, 1640];
export const RIDER12 = 1786, RISE12 = [1810, 1818, 1826, 1834];
export const YANK13 = 1886, TOSS13 = 1904;
export const SHRUG14 = [2023, 2046], WALK14 = [2050, 2088], DOOR14 = [2084, 2100];
export const FLASH15 = [2120, 2134, 2151, 2163, 2178, 2196];

// ---------------- the stage board ----------------
const roll = (f: number, a: number, b: number, f0: number, f1: number, step: number) => { const k = smooth((f - f0) / (f1 - f0)); return f >= f1 ? b : f < f0 ? a : Math.round((a + (b - a) * k * k) / step) * step; };
/** the bid board's four lines at frame f (null = dark) */
export const boardAt = (f: number) => {
  if (f < 172) return { bids: 64, hammer: 7000000, prem: 1400000, total: f >= GAVELS[0] ? 8400000 : 7000000, sold: f >= GAVELS[0] };
  return { bids: Math.round(64 * clamp01((f - 254) / 42)), hammer: f >= GAVELS[1] ? 7000000 : roll(f, 0, 6800000, 254, 300, 50000), prem: f >= 349 ? 1400000 : 0,
    total: f < GAVELS[1] ? 0 : f < 362 ? 7000000 : roll(f, 7000000, 8400000, 362, 394, 50000), sold: f >= 394 };
};
const DATES: [number, string][] = [[0, "LIVE AUCTION"], [176, "THÁNG 9 · 2026"]];
export const dateAt = (f: number) => {
  let i = 0; while (i + 1 < DATES.length && f >= DATES[i + 1][0]) i++;
  const u = clamp01((f - DATES[i][0]) / 9);
  return { text: u < 0.5 && i > 0 ? DATES[i - 1][1] : DATES[i][1], flap: i === 0 ? 1 : Math.abs(2 * u - 1) };
};
export const calAt = (f: number) => { let i = 0; while (i + 1 < CAL.length && f >= CAL[i + 1][0]) i++; const u = clamp01((f - CAL[i][0]) / 8); return { text: u < 0.5 && i > 0 ? CAL[i - 1][1] : CAL[i][1], flip: i === 0 ? 1 : u }; };
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};

// ---------------- the sold wall ----------------
export type Ticket = { id: string; pos: number[]; card: string; price: string; steam?: number; unpin?: number };
export const TICKETS = plan.tickets as Ticket[];
export const HERO = plan.hero_ticket as { pos: number[]; size: number[]; card: string; price: string };
/** a small ticket's state at frame f: on the wall (with its steam phase 0..1), or gone; outline = the pale patch it leaves (0..1) */
export const ticketAt = (t: Ticket, f: number, id: number) => {
  // the hook (S01) is a flash-forward: everything still hangs; S04/S05 come before the steam
  const s = t.steam ?? 1e9, gone = id >= 8 && f >= s + 10, phase = id >= 8 && f >= s ? clamp01((f - s) / 10) : 0;
  const fade = clamp01((f - 1430) / 32), outline = gone ? (id >= 10 || f >= 1462 ? 0 : 1 - fade) : 0;
  const unpinned = t.unpin !== undefined && (id > 10 || (id === 10 && f >= t.unpin));
  return { on: !gone && !unpinned, phase, outline, pin: gone ? (id >= 10 || f >= 1440 + (s % 7) ? 0 : 1) : 1 };
};
/** the hero ticket: y offset from its pin spot (it slides down and into the gap), visible?, stamps, corner curl 0..1 */
export const heroAt = (f: number, id: number) => {
  const fall = (f0: number) => { const t = f - f0; if (t < 0) return 0; if (t < 14) return -0.95 * (t / 14) ** 2; return -1; };
  let dy = 0, vis = true, crooked = 0;
  if (id === 1) { dy = fall(POP1 + 2); vis = dy > -0.94; }
  if (id === 5) {
    if (f >= POP5 + 1 && f < FISH5[1]) { dy = fall(POP5 + 1); vis = dy > -0.94; }
    else if (f >= FISH5[1]) { const k = clamp01((f - FISH5[1]) / (FISH5[2] - FISH5[1])); dy = -0.85 * (1 - k) + 0.12 * Math.sin(Math.PI * k); vis = true; crooked = 0.06 * k; }
  }
  if (id > 5) crooked = 0.06;
  const paid = id > 4 || (id === 4 && f >= STAMP4);
  const curl = id === 6 ? (f < CURL6[0] ? 0 : f < CURL6[1] ? 0.25 + 0.2 * Math.sin((f - CURL6[0]) * 0.45) * Math.exp(-(f - CURL6[0]) / 20) : f < CURL6[2] ? 0.42 : clamp01(0.42 + (f - CURL6[2]) / 6)) : id > 6 ? 1 : 0;
  return { dy, vis, crooked, paid, curl, outline: id === 1 ? f >= POP1 + 4 : id === 5 && f >= POP5 + 4 && f < FISH5[2] };
};
/** S12/S13 street signs: stake height of sign i (0 = the sold house) and its price label */
export const signAt = (i: number, f: number, id: number) => {
  if (i === 0) return { h: 0.75, label: "$300K", rider: id >= 13 || (id === 12 && f >= RIDER12) };
  const t0 = RISE12[i - 1], u = id < 12 ? 0 : id > 12 ? 9 : (f - t0) / 6;
  const k = u <= 0 ? 0 : u < 1 ? u * u : 1 + 0.08 * Math.sin((u - 1) * 2.4) * Math.exp(-(u - 1) * 0.9);
  return { h: 0.75 + 0.95 * k, label: u > 0.5 ? ["$450K", "$480K", "$520K", "$560K"][i - 1] : "$300K", rider: false };
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
