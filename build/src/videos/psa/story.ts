// Timeline of the PSA truck-theft reel, timed to the Vietnamese voice (public/psa/words.json). Five sets live far apart
// in one scene: the Santa Ana street with the grading facility (origin), the collector's house (HOME), the grading
// office / server room (OFFICE), the card shop / auction counter (SHOP) and a back alley (ALLEY). Camera grammar from
// the skill: smootherstep glides 18-40 f, every hold creeps in, cuts on big jumps, flip-sign kicks on impacts.
export const FPS = 30;
export const TOTAL = 1884; // 62.8 s (voice ends 62.59 s)
export type V3 = [number, number, number];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
export const pop = (f: number, f0: number, n = 8) => { // 0 -> overshoot 1.15 -> 1
  const u = (f - f0) / n;
  if (u <= 0) return 0;
  if (u >= 2) return 1;
  return u < 1 ? 1.15 * Math.sin((u * Math.PI) / 2) : 1 + 0.15 * Math.cos(((u - 1) * Math.PI) / 2);
};

// ---------------- set origins ----------------
export const HOME: V3 = [400, 0, 0];
export const OFFICE: V3 = [-400, 0, 0];
export const SHOP: V3 = [0, 0, 400];
export const ALLEY: V3 = [0, 0, -400];
export const at = (o: V3, x: number, y: number, z: number): V3 => [o[0] + x, o[1] + y, o[2] + z];

// ---------------- story objects (shared by world.ts, cast.ts and the sound timeline) ----------------
/** the delivery truck: rear at x = TRUCK_X - 3 */
export const TRUCK_STOP = 151;
export const truckX = (f: number) => (f >= TRUCK_STOP ? 0 : -45 * (1 - easeOut((f - 103) / (TRUCK_STOP - 103))));
export const DOOR_UP = [333, 352] as const; // rear roll-up door
export const doorK = (f: number) => (f < 300 ? 0 : smooth((f - DOOR_UP[0]) / (DOOR_UP[1] - DOOR_UP[0])));
export const LOCK_POP = 292; // hammer hits the padlock
/** padlock: hanging point on the truck, where the body comes to rest on the road, where the snapped shackle lands */
export const LOCK_HANG: V3 = [-3.17, 0.84, 3.2];
/** where the baked physics (physics.ts) settles the padlock body; shot 11 frames it */
export const LOCK_REST: V3 = [-4.016, 0.055, 2.545];
export const SCAN_BEAM = [1326, 1343] as const;
export const PULL = [345, 384] as const; // pallets pulled out of the truck
export const palletX = (f: number) => -1.2 - 6.2 * smooth((f - PULL[0]) / (PULL[1] - PULL[0])) - 6.5 * smooth((f - 388) / 34); // pulled out, then dragged away
export const SUV_STOP = 787;
export const suvX = (f: number) => (f >= SUV_STOP ? 12 : 12 + 30 * (1 - easeOut((f - 772) / (SUV_STOP - 772))));
export const MAILBOX_OPEN = 456;
export const LIST = [485, 545] as const; // the list unrolls
export const COUNT_AT = 548; // "6.451"
export const COUNT3K = 635; // "3.000"
export const POKE_AT = 671; // the creature-card half lights up
export const MONEY_AT = 748; // "$1.000.000"
export const XSTAMP = 933; // red X over the padlock ("không phải ổ khóa")
export const CERT_GLOW = 1021;
export const PRESS = 1168; // the big red button
export const voidK = (row: number, f: number) => smooth((f - (1176 + row * 6)) / 10); // rows turn red one by one
export const ENV_OUT = 1232;
export const ENV_HIT = [1259, 1280] as const; // marketplace, auction house
export const SCAN = 1340, ALARM = 1359;
/** shot 7: the list lies on the desk (office-local); its far edge is fixed, the roll travels toward +z */
export const DESK_TOP = 0.8, LIST_X = -7.61, LIST_Z0 = -0.38, LIST_LEN = 1.45, LIST_W = 0.4;
/** shot 13: the tech stands beside his desk; the red button sits on a stand at his right hand (0.42 m, 0.95 m up) */
export const TECH13: [number, number] = [-6.6, 1.1], BTN13: V3 = [-6.42, 0.95, 0.72];
/** shot 15: thief at the counter front, clerk behind it, the slab slid onto the glass between them */
export const THIEF15: [number, number] = [-0.4, -1.32], CLERK15: [number, number] = [0.4, -3.0];
export const SLIDE15 = [1314, 1323] as const, SLAB15: V3 = [-0.1, 1.048, -2.02];
/** shot 17: thief and buyer stand close enough for their hands to meet */
export const DEAL_X = 0.6;
export const SMASH = 1398, LABEL_OFF = 1413, LABEL_GONE = 1459;
export const SWAP = 1500; // card for cash in the alley
export const PHONE_OK = 1588;
export const DOSSIER = 1732, BADGES = [1785, 1843, 1861] as const;

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Place = "street" | "home" | "office" | "shop" | "alley";
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 103, light: "day", place: "street", sunAz: 120 },
  { id: 2, a: 103, b: 229, light: "day", place: "street", sunAz: 125 },
  { id: 3, a: 229, b: 270, light: "day", place: "street", sunAz: 110 },
  { id: 4, a: 270, b: 331, light: "day", place: "street", sunAz: 110 },
  { id: 5, a: 331, b: 415, light: "day", place: "street", sunAz: 120 },
  { id: 6, a: 415, b: 478, light: "day", place: "home", sunAz: 120 },
  { id: 7, a: 478, b: 620, light: "day", place: "office", sunAz: 140, sunEl: 62 },
  { id: 8, a: 620, b: 698, light: "day", place: "office", sunAz: 160, sunEl: 62 },
  { id: 9, a: 698, b: 772, light: "day", place: "street", sunAz: 120 },
  { id: 10, a: 772, b: 860, light: "day", place: "street", sunAz: 110 },
  { id: 11, a: 860, b: 980, light: "day", place: "street", sunAz: 130 },
  { id: 12, a: 980, b: 1048, light: "day", place: "office", sunAz: 150, sunEl: 60 },
  { id: 13, a: 1048, b: 1245, light: "day", place: "office", sunAz: 140, sunEl: 62 },
  { id: 14, a: 1245, b: 1302, light: "day", place: "street", sunAz: 150 },
  { id: 15, a: 1302, b: 1380, light: "day", place: "shop", sunAz: 140, sunEl: 62 },
  { id: 16, a: 1380, b: 1465, light: "golden", place: "alley", sunAz: 12, sunEl: 9 },
  { id: 17, a: 1465, b: 1529, light: "golden", place: "alley", sunAz: 20, sunEl: 9 },
  { id: 18, a: 1529, b: 1615, light: "golden", place: "home", sunAz: 35, sunEl: 10 },
  { id: 19, a: 1615, b: TOTAL, light: "golden", place: "home", sunAz: 30, sunEl: 10 },
];
/** crossfades (frames) at place changes; a white flash on the pivot ("Nhưng") */
export const XFADE: Record<number, number> = { 6: 8, 7: 8, 9: 8, 16: 8, 18: 8 };
export const FLASH_AT = 860;
export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

// ---------------- camera ----------------
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
const mixC = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
const run = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mixC(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
/** push-in factor since f0 (~rate per frame), raised to `punch` for n frames with soft edges */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 30) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
const H = (x: number, y: number, z: number) => at(HOME, x, y, z);
const O = (x: number, y: number, z: number) => at(OFFICE, x, y, z);
const S = (x: number, y: number, z: number) => at(SHOP, x, y, z);
const A = (x: number, y: number, z: number) => at(ALLEY, x, y, z);

export const PALLET_END = -7.4; // pallet 1 centre x after the pull (pallet 2 sits 1.3 m further in)

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly([-36, 30, -34], [2, 3, 13], pushK(f, 0, 0.002), { fov: 42 }) },
    { f: 30, dur: 70, s: (f) => dolly([-14, 6.5, -16], [3, 3.2, 12], pushK(f, 30, 0.0015), { fov: 42, roll: 0.04 }) },
  ],
  2: [
    { f: 103, s: (f) => { const x = Math.max(truckX(f), -30); return { pos: [x - 12.5, 1.5, -3.2], look: [x + 1.5, 1.9, 3.4], fov: 40, roll: -0.02 }; } },
    { f: 168, dur: 34, s: (f) => dolly([-1.0, 3.3, -12.6], [1.7, 3.5, 10], pushK(f, 168, 0.0016), { fov: 58, roll: 0.02 }) },
  ],
  3: [{ f: 229, s: (f) => dolly([1.5, 1.6, -5.4], [6.2, 1.3, 1.4], pushK(f, 229, 0.003), { fov: 42 }) }],
  4: [
    { f: 270, s: (f) => dolly([-11.5, 1.6, -3.6], [-4.6, 1.0, 2.6], pushK(f, 270, 0.003), { fov: 42 }) },
    { f: 284, cut: true, s: (f) => dolly([-6.4, 1.25, 2.55], [-3.35, 0.92, 2.95], pushK(f, 284, 0.003, 0.007, 16), { fov: 40, roll: 0.03 }) },
    { f: 299, dur: 22, s: (f) => dolly([-6.1, 1.05, 2.15], [-3.85, 0.25, 2.75], pushK(f, 299, 0.003), { fov: 40, roll: -0.02 }) },
  ],
  5: [
    { f: 331, s: (f) => dolly([-12.5, 2.4, -2.4], [-3.6, 1.5, 3.2], pushK(f, 331, 0.002), { fov: 44 }) },
    { f: 380, dur: 34, s: (f) => dolly([-10.5, 2.4, -6.2], [-13.2, 1.1, 3.2], pushK(f, 380, 0.0012), { fov: 48, roll: -0.02 }) },
  ],
  6: [
    { f: 411, s: (f) => dolly(H(1.6, 1.45, 12.4), H(2.45, 1.2, 7.0), pushK(f, 411, 0.0025), { fov: 42 }) },
    { f: 450, dur: 8, s: (f) => dolly(H(1.9, 1.4, 11.3), H(2.5, 1.3, 7.0), pushK(f, 450, 0.003), { fov: 42, roll: 0.04 }) },
    { f: 459, cut: true, s: (f) => dolly(H(2.6, 1.5, 8.5), H(2.9, 1.17, 7.0), pushK(f, 459, 0.004), { fov: 40, roll: -0.03 }) },
  ],
  7: [
    { f: 474, s: (f) => dolly(O(-0.5, 2.0, 3.4), O(-7.3, 0.95, 0.2), pushK(f, 474, 0.0025), { fov: 46 }) },
    // top view of the desk: list centred low in frame, the 6.451 title sits in the clear top band
    { f: 492, dur: 26, s: (f) => dolly(O(LIST_X, 3.45, 1.05), O(LIST_X, DESK_TOP, 0.05), pushK(f, 492, 0.0016, 0.004, 24), { fov: 44, roll: 0.0 }) },
  ],
  8: [
    { f: 620, s: (f) => dolly(O(-6.5, 3.75, 2.4), O(-6.5, 3.75, 9.9), pushK(f, 620, 0.0015), { fov: 50 }) },
    { f: 668, dur: 26, s: (f) => dolly(O(-6.2, 3.3, 4.3), O(-6.6, 3.3, 9.9), pushK(f, 668, 0.003), { fov: 48, roll: 0.04 }) },
  ],
  9: [
    { f: 694, s: (f) => dolly([-10.5, 1.6, -3.4], [-5.4, 1.45, 4.4], pushK(f, 694, 0.0025), { fov: 42 }) },
    { f: 740, dur: 20, s: (f) => dolly([-8.6, 1.9, -1.6], [-5.4, 2.0, 4.4], pushK(f, 740, 0.003), { fov: 44, roll: -0.04 }) },
  ],
  10: [
    { f: 772, s: (f) => dolly([2.6, 0.8, 1.2], [12.4, 1.5, -1.6], pushK(f, 772, 0.002, 0.006, 26), { fov: 40, roll: 0.05 }) },
  ],
  11: [
    { f: 860, s: (f) => dolly([-5.37, 0.62, 1.0], [-4.02, 0.08, 2.55], pushK(f, 860, 0.0022, 0.005, 30), { fov: 38 }) },
    { f: 925, dur: 20, s: (f) => dolly([-5.07, 0.55, 1.45], [-4.02, 0.12, 2.55], pushK(f, 925, 0.003), { fov: 36, roll: 0.05 }) },
  ],
  12: [
    { f: 980, s: (f) => dolly(O(-1.3, 1.8, -3.5), O(-3, 1.7, -5), pushK(f, 980, 0.0025, 0.005, 26), { fov: 42, roll: -0.03 }) },
  ],
  13: [
    { f: 1048, s: (f) => dolly(O(7, 2.7, 0.2), O(-11, 2.9, 0), pushK(f, 1048, 0.002), { fov: 46 }) },
    { f: 1100, dur: 36, s: (f) => dolly(O(-2.6, 1.85, 2.2), O(-7.4, 1.25, -0.1), pushK(f, 1100, 0.0025, 0.006, 24), { fov: 42 }) },
    { f: 1172, cut: true, s: (f) => dolly(O(-3.7, 3.05, 0.9), O(-11.73, 3.12, 0.05), pushK(f, 1172, 0.0015), { fov: 44, roll: 0.02 }) },
    { f: 1226, dur: 22, s: (f) => dolly(O(-4.2, 2.6, 0.2), O(-9.5, 3.0, 0), pushK(f, 1226, 0.003), { fov: 50 }) },
  ],
  14: [
    { f: 1245, s: (f) => dolly([-8.5, 4.6, 7.6], [-9.5, 2.4, -13], pushK(f, 1245, 0.0022), { fov: 50 }) },
    { f: 1262, dur: 22, s: (f) => dolly([10.5, 4.4, 7.0], [8.8, 2.4, -13], pushK(f, 1262, 0.0025), { fov: 48, roll: 0.03 }) },
  ],
  15: [
    { f: 1302, s: (f) => dolly(S(1.4, 1.75, 4.2), S(0, 1.35, -1.8), pushK(f, 1302, 0.0025), { fov: 46 }) },
    { f: 1324, cut: true, s: (f) => dolly(S(SLAB15[0], 1.98, -1.66), S(SLAB15[0], SLAB15[1], -2.06), pushK(f, 1324, 0.003, 0.006, 20), { fov: 38 }) },
    { f: ALARM, cut: true, s: (f) => dolly(S(0.2, 1.75, 2.8), S(0, 1.55, -2.0), pushK(f, ALARM, 0.003, 0.006, 22), { fov: 46, roll: 0.05 }) },
  ],
  16: [
    { f: 1376, s: (f) => dolly(A(2.7, 1.45, 2.3), A(0.9, 0.95, -1.4), pushK(f, 1376, 0.0025), { fov: 40 }) },
    { f: 1405, dur: 22, s: (f) => dolly(A(2.3, 1.7, 1.6), A(1.1, 1.5, -1.4), pushK(f, 1405, 0.0025), { fov: 40, roll: -0.04 }) },
  ],
  17: [
    { f: 1465, s: (f) => dolly(A(0.2, 1.55, 3.4), A(0, 1.3, -2.2), pushK(f, 1465, 0.0025), { fov: 38 }) },
    { f: 1496, dur: 20, s: (f) => dolly(A(0.3, 1.45, 1.7), A(0, 1.3, -2.2), pushK(f, 1496, 0.003), { fov: 36, roll: 0.04 }) },
  ],
  18: [
    { f: 1525, s: (f) => dolly(H(1.0, 1.62, 4.6), H(0, 1.45, 1.0), pushK(f, 1525, 0.0025), { fov: 36 }) },
    { f: 1572, dur: 20, s: (f) => dolly(H(0.6, 1.62, 3.4), H(0, 1.55, 1.0), pushK(f, 1572, 0.003, 0.006, 24), { fov: 36, roll: -0.03 }) },
  ],
  19: [
    { f: 1615, s: (f) => dolly(H(-0.6, 1.5, 6.4), H(0, 1.55, 1.0), pushK(f, 1615, 0.0022), { fov: 40 }) },
    { f: 1700, dur: 34, s: (f) => dolly(H(0.5, 1.75, 5.6), H(0.2, 2.0, 1.0), pushK(f, 1700, 0.0018), { fov: 42, roll: 0.03 }) },
    { f: 1770, dur: 40, s: (f) => dolly(H(0, 2.2, 7.4), H(0, 2.5, 1.0), pushK(f, 1770, 0.0012), { fov: 46 }) },
  ],
};

// impacts: [time in frames, strength]; the image offset flips sign every frame and decays over 7 f
const KICKS: [number, number][] = [[TRUCK_STOP, 0.5], [LOCK_POP, 0.7], [SUV_STOP, 0.9], [PRESS, 0.6], [ALARM, 1.0], [SMASH, 1.1]];
export const kickAt = (f: number) => {
  let a = 0;
  for (const [f0, g] of KICKS) { const n = f - f0; if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5; }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(CAMS[id], f), a = kickAt(f);
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a;
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};

// ---------------- lens ----------------
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 0 },
  { f: 103, cInf: 6, focus: (f) => [truckX(f) + 1, 1.8, 2.0] },
  { f: 168, dur: 34, cInf: 0 },
  { f: 229, cInf: 9 },
  { f: 270, cInf: 6, focus: () => [-4.6, 1.0, 2.6] },
  { f: 284, cInf: 10, focus: () => [-3.3, 0.9, 2.9] },
  { f: 299, dur: 22, cInf: 10, focus: () => [-3.9, 0.15, 2.7] },
  { f: 331, cInf: 0 },
  { f: 415, cInf: 10, focus: () => H(2.2, 1.5, 6.95) },
  { f: 459, cInf: 12, focus: () => H(2.9, 1.15, 7.1) },
  { f: 478, cInf: 7, focus: () => O(-6.4, 1.5, 0.4) },
  { f: 492, dur: 26, cInf: 6, focus: () => O(LIST_X, DESK_TOP, 0.2) },
  { f: 620, cInf: 5 },
  { f: 698, cInf: 10, focus: () => [-5.4, 1.6, 4.4] },
  { f: 772, cInf: 8, focus: () => [12, 1.6, -0.8] },
  { f: 860, cInf: 15 },
  { f: 980, cInf: 16, focus: () => O(-3, 1.7, -5) },
  { f: 1048, cInf: 0 },
  { f: 1100, dur: 36, cInf: 10, focus: () => O(-6.6, 1.5, 1.1) },
  { f: 1172, cInf: 5 },
  { f: 1245, cInf: 0 },
  { f: 1302, cInf: 10, focus: () => S(-0.2, 1.5, -1.6) },
  { f: 1324, cInf: 14, focus: () => S(SLAB15[0], SLAB15[1], -2.2) },
  { f: ALARM, cInf: 10, focus: () => S(-0.2, 1.5, -1.6) },
  { f: 1380, cInf: 12, focus: () => A(0.8, 1.1, -1.6) },
  { f: 1465, cInf: 12, focus: () => A(0, 1.4, -2.2) },
  { f: 1529, cInf: 13, focus: () => H(0, 1.5, 1.0) },
  { f: 1615, cInf: 9, focus: () => H(0, 1.6, 1.0) },
  { f: 1770, dur: 40, cInf: 5, focus: () => H(0, 2.2, 1.0) },
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
