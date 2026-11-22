// Timeline of the Gengar reel, timed to the Vietnamese voice (public/goldenrod/words.json, 79.6 s).
// Everything a camera needs (keys, glides, pushes, kicks, depth of field, dissolves) is read from plan.json, the direction's
// source of truth (videos/goldenrod-heist/plan.json, written by mkplan.py): numbers are never retyped here.
// Sets: SHOP (Goldenrod: street, aisle, back lot), ROAD (the highway), RENT (the rental office), POL (the police station), JUS (the house in Justice).
import plan from "../../../videos/goldenrod-heist/plan.json";
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
export const SHo = ORIGIN.shop, RDo = ORIGIN.road, RNo = ORIGIN.rent, POo = ORIGIN.pol, JUo = ORIGIN.jus;
/** a mark from the plan: the character's feet in the world */
export const mark = (set: SetName, who: string, y = 0): V3 => { const m = (plan.sets[set].marks as Record<string, number[]>)[who]; return at(ORIGIN[set], m[0], y, m[1]); };
/** an object's centre from the plan, in the world */
export const obj = (set: SetName, id: string): { p: V3; s: V3 } => { const o = plan.sets[set].objects.find((x) => x.id === id)!; return { p: at(ORIGIN[set], o.pos[0], o.pos[1], o.pos[2]), s: o.size as V3 }; };

// ---------------- beats (frames; the plan's scene cards give the same numbers in words) ----------------
export const WIND1 = [40, 50], HOLD1 = 56, SMASH1 = 60, ENTER1 = [68, 112];          // S01 the sledgehammer through the door
export const LIFT2 = [132, 146], SNAP2 = 150, HAZ2 = [185, 195];                    // S02 bolt cutters, the van's hazards
export const STRIKE4 = [350, 363, 369, 377];                                        // S04 one case per word
export const TAKE5 = { A: [400, 422], B: [432, 456], C: [466, 490] }, WALK5 = [404, 468], TILL5 = 493; // S05 the sweep
export const SQUEEZE6 = [530, 548], SNAP6 = 552, DOORS6 = [562, 590];               // S06 the trailer
export const WALKA7 = [600, 650], WALKC7 = [612, 660], PLATE7 = 643;                 // S07 the buffet plates
export const GO8 = 680;                                                             // S08 the van pulls away
export const CROW9 = [738, 752];                                                    // S09 the rooster
export const TAP10 = 797, FLASH10 = 870, WAVE10 = [872, 886];                       // S10 the drive
export const SIGN12 = [1060, 1084], STAMP12 = 1088;                                 // S12 the contract
export const LICENCE13 = [1150, 1170], LOOKS13 = [1176, 1190], SHUFFLE13 = 1187;   // S13 the masked customer
export const FLOOD14 = [1318, 1350];                                                // S14 the trail floods in
export const DUCK15 = 1529, RING15 = 1550, TURN15 = 1556;                           // S15 hide and seek
export const PINS16 = [1600, 1622, 1656, 1685, 1720];                               // S16 evidence
export const PIN17 = 1764;                                                          // S17 Justice pinned
export const ROLL18 = [[1800, 1838], [1806, 1846]];                                 // S18 the cruisers
export const DING19 = 1899;                                                         // S19 the sign
export const GDOOR20 = [1925, 1958], WALK20 = [1940, 1970], LIFT20 = [1972, 1984], DING20 = 1991; // S20 the garage
export const SLAM21 = 2053, ARREST21 = [2086, 2092], WANTED21 = [2128, 2134, 2140]; // S21 the booking desk
export const FILE24 = [2262, 2290], SHUT24 = 2300;                                  // S24 the archive
export const SHOPP = plan.shop, ROADP = plan.road, RENTP = plan.rent, POLP = plan.pol, JUSP = plan.jus;
/** a hop after an impact: launched at v0 m/s at f0, falls under gravity, two small rattles */
export const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / FPS, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
/** room light per frame: 1 = the preset; scenes may dim */
export const lightAt = (id: number, f: number): { k: number; sat: number } => {
  const sc = plan.scenes[id - 1] as { dim?: number; sat?: number }; void f;
  if (sc.dim) return { k: sc.dim, sat: sc.sat ?? 0.85 };
  return { k: 1, sat: 1 };
};

// ---------------- the highway route and the van (same maths as mkplan.py) ----------------
const RT = ROADP.route as number[][];
const RD: number[] = [0]; for (let i = 1; i < RT.length; i++) RD.push(RD[i - 1] + Math.hypot(RT[i][0] - RT[i - 1][0], RT[i][1] - RT[i - 1][1]));
export const ROUTE_LEN = RD[RD.length - 1];
/** set-local (x, z) at distance s along the route, shifted by lane metres to the right, and the unit tangent */
export const along = (s: number, lane = ROADP.lane): { x: number; z: number; tx: number; tz: number } => {
  const d = Math.max(0, Math.min(ROUTE_LEN - 1e-6, s));
  let i = 0; while (i < RD.length - 2 && RD[i + 1] < d) i++;
  const u = (d - RD[i]) / (RD[i + 1] - RD[i]), a = RT[i], b = RT[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), tx = (b[0] - a[0]) / L, tz = (b[1] - a[1]) / L;
  return { x: a[0] + u * (b[0] - a[0]) - tz * lane, z: a[1] + u * (b[1] - a[1]) + tx * lane, tx, tz };
};
export const d10 = (f: number) => { const D = ROADP.drive10; return D.d[0] + (D.d[1] - D.d[0]) * glide((f - D.f[0]) / (D.f[1] - D.f[0])); };
export const d14 = (f: number) => {
  const G = ROADP.go14, t = Math.max(0, (f - G.f0) / FPS), tm = G.vmax / (2 * G.a);
  return G.d0 + (t < tm ? G.a * t * t : G.a * tm * tm + G.vmax * (t - tm));
};
/** the van this frame: set, local position, yaw (nose along +x at yaw 0), braking, speed (m/s) */
export type VanPose = { set: SetName; x: number; z: number; yaw: number; brake: boolean; v: number; hazard: boolean } | null;
const yawOf = (tx: number, tz: number) => Math.atan2(-tz, tx);
export const vanAt = (id: number, f: number): VanPose => {
  const S = SHOPP, J = JUSP;
  if (id >= 1 && id <= 7) return { set: "shop", x: S.van[0], z: S.van[1], yaw: 0, brake: false, v: 0, hazard: id === 2 && ((f >= HAZ2[0] && f < HAZ2[0] + 6) || (f >= HAZ2[1] && f < HAZ2[1] + 6)) };
  if (id === 8) { const t = Math.max(0, (f - GO8) / FPS); return { set: "shop", x: S.van[0] + 2.5 * t * t, z: S.van[1], yaw: 0, brake: false, v: 5 * t, hazard: false }; }
  if (id === 10 || id === 11 || id === 14) {
    const d = id === 10 ? d10(f) : id === 11 ? ROADP.stop_d : d14(f), p = along(d), dd = id === 10 ? d10(f + 1) - d : id === 14 ? d14(f + 1) - d : 0;
    return { set: "road", x: p.x, z: p.z, yaw: yawOf(p.tx, p.tz), brake: id === 11 || (id === 10 && f > 880) || (id === 14 && f < ROADP.go14.f0), v: dd * FPS, hazard: false };
  }
  if (id >= 15 && id <= 20) return { set: "jus", x: J.van[0], z: J.van[1], yaw: J.van_yaw, brake: false, v: 0, hazard: false };
  return null;
};

export type Light = "day" | "golden" | "night";
export type Place = SetName;
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = plan.scenes.map((s, i) => ({ id: i + 1, a: s.f[0], b: s.f[1], light: s.light as Light, place: s.set as Place,
  sunAz: (plan.sets[s.set as SetName].sun as number[])[0], sunEl: (plan.sets[s.set as SetName].sun as number[])[1] }));
/** sets built and shown per place */
export const SHOWN: Record<string, string[]> = { shop: ["shop"], road: ["road"], rent: ["rent"], pol: ["pol"], jus: ["jus"] };
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
