// Timeline of the Roush reel (the early Night UPC), timed to the Vietnamese voice (public/roush/words.json, 76.9 s).
// Everything a camera needs (keys, glides, pushes, kicks, dissolves) is read from plan.json, the direction's source of truth
// (videos/natalie-roush-upc/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: STREET (bus stop, cafe, cinema, plaza and the listings board, one set), ROOM (her creator room), MARKET (the resale shop), DOCK.
import plan from "../../../videos/natalie-roush-upc/plan.json";
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
export const STo = ORIGIN.street, RMo = ORIGIN.room, MKo = ORIGIN.market, DKo = ORIGIN.dock;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const STP = plan.street, RMP = plan.room, MKP = plan.market, DKP = plan.dock, SCREEN = plan.screen;
export const GRIP1 = [0, 20], LIFT1 = [24, 44], STAND1 = [44, 60], TADA1 = 62, SPARK1 = 40;                 // S01 the lid
export const PULSE2 = 123;                                                                                 // S02 the button
export const WAVE3 = [215, 240], POINT3 = [330, 360];                                                      // S03
export const REACH5 = [630, 652], LIFT5 = [652, 672], GLEAM5 = [700, 730];                                 // S05 the Magikarp
export const TAP6 = 884;                                                                                   // S06 the tap
export const DROP7 = Array.from({ length: plan.market.n }, (_, i) => 905 + 6 * i), TAG7 = 975;            // S07 the tower
export const TILL8 = 1030, COIN8 = [1040, 1058], PLINK8 = 1060;                                            // S08 the coin
export const BUZZ9 = 1097, DOWN9 = [1100, 1110], UP9 = 1112, SIGN9 = [1127, 1140];                         // S09 the plaza
export const WALK11 = [1315, 1372], SET11 = [1372, 1390];                                                  // S11 the dock
export const HANDS12 = [1462, 1470], TURN12 = [1470, 1496];                                                // S12 the box turns
export const TIN13 = [1560, 1575], FLIP13 = [1668, 1680];                                                  // S13 the cinema
export const TYPE15 = [1735, 1760], SEND15 = 1762;                                                         // S15 her reply
export const FLIP17 = Array.from({ length: 8 }, (_, i) => 1952 + 18 * i);                                  // S17 the listings
export const SHUT20 = 2242;
/** the lid: on the base (S01 before the lift), in her hands, or in its stand */
export const lidState = (id: number, f: number): "on" | "lift" | "stand" => (id === 1 ? (f < LIFT1[0] ? "on" : f < STAND1[1] ? "lift" : "stand") : "stand");
/** the box's turn about y (0 = front out; PI = its bare back toward the lens) */
export const boxTurn = (id: number, f: number) => { const sc = SHOTS[id - 1]; if (sc.place !== "room") return 0; if (id < 12) return 0; if (id > 12) return Math.PI; return Math.PI * smooth((f - TURN12[0]) / (TURN12[1] - TURN12[0])); };
/** what the viewer's phone screen shows */
export type Screen = { mode: "video" | "gone" | "gallery"; pulse: number; press: number; scroll: number; shutter: number };
export const screenAt = (id: number, f: number): Screen => {
  const pulse = id === 2 ? Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - PULSE2) / 10)) * Math.PI)) : 0;
  const press = id === 6 && f >= TAP6 && f < TAP6 + 5 ? 1 : 0;
  if (id === 18) return { mode: "gone", pulse: 0, press: 0, scroll: 0, shutter: 0 };
  if (id >= 20) return { mode: "gallery", pulse: 0, press: 0, scroll: clamp01((f - 2228) / 40), shutter: f >= SHUT20 && f < SHUT20 + 5 ? 1 - (f - SHUT20) / 5 : 0 };
  return { mode: "video", pulse, press, scroll: 0, shutter: 0 };
};
/** the tower of boxes in the resale shop: how far each box is above its rest height (null = not dropped in yet) */
export const towerBox = (id: number, f: number, i: number): number | null => {
  if (id < 7) return null; if (id > 7) return 0;
  const f0 = DROP7[i]; if (f < f0) return null;
  const t = (f - f0) / FPS, tf = Math.sqrt((2 * 0.7) / 9.8);
  if (t < tf) return 0.7 - 4.9 * t * t;
  return hop(f, f0 + tf * FPS, 0.45) * 0.05;
};
/** the coin from the till to the jar: [x along the counter 0..1, drop 0..1] or null */
export const coinAt = (id: number, f: number): [number, number] | null => {
  if (id !== 8 && id < 9) return null; if (id > 8) return null;
  if (f < COIN8[0]) return null; if (f < COIN8[1]) return [(f - COIN8[0]) / (COIN8[1] - COIN8[0]), 0];
  return [1, clamp01((f - COIN8[1]) / 3)];
};
/** a flip about a hinge, 0 -> PI, eased over n frames */
export const flipAt = (f: number, f0: number, n = 6) => Math.PI * smooth((f - f0) / n);
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
export const SHOWN: Record<string, string[]> = { street: ["street"], room: ["room"], market: ["market"], dock: ["dock"] };
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
/** the lid (room-local): on the base, lifted in her hands, or upright in its stand. Returns its centre and its tilt about x
 *  (0 = lying face up; PI/2 - 0.15 = standing, face toward the lens, leaning back a little) */
export const LID_UP = Math.PI / 2 - 0.15;
export const lidPose = (id: number, f: number): { p: V3; rx: number } => {
  const B = RMP.box, T = RMP.top, H = RMP.box_size[1], S = RMP.stand, hh = RMP.box_size[2] / 2;
  const on: V3 = [B[0], T + H + RMP.lid_h / 2 + 0.002, B[1]], up: V3 = [B[0], T + 0.42, B[1] + 0.06], st: V3 = [S[0], T + 0.012 + hh * Math.cos(0.15), S[1] - hh * Math.sin(0.15) * 0.5];
  const s = lidState(id, f);
  if (s === "on") return { p: on, rx: 0 };
  if (s === "stand") return { p: st, rx: LID_UP };
  if (f < LIFT1[1]) { const u = smooth((f - LIFT1[0]) / (LIFT1[1] - LIFT1[0])); return { p: [on[0], on[1] + (up[1] - on[1]) * u, on[2] + (up[2] - on[2]) * u], rx: LID_UP * 0.6 * u }; }
  const u = smooth((f - STAND1[0]) / (STAND1[1] - STAND1[0]));
  return { p: [up[0] + (st[0] - up[0]) * u, up[1] + (st[1] - up[1]) * u, up[2] + (st[2] - up[2]) * u], rx: LID_UP * (0.6 + 0.4 * u) };
};
