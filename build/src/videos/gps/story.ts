// Timeline of the Pokémon GPS-tracker reel, timed to the Vietnamese voice (public/gps/words.json). Sets live far apart
// in one scene: the store street (origin, the PSA street re-dressed as a big-box store), Kubasta's house front (HOME),
// his living room (LIVING), the store aisle / stockroom (SHOP), the police station (POLICE) and the courtroom (COURT).
// Direction: supercycle repo videos/pokemon-gps-tracker/beats.md. One visual law: the tracker's green blink.
export const FPS = 30;
export const TOTAL = 2209; // 73.6 s (voice ends 73.2 s)
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
export const SHOP: V3 = [0, 0, 400];
export const LIVING: V3 = [800, 0, 0];
export const POLICE: V3 = [-800, 0, 0];
export const COURT: V3 = [0, 0, 800];
export const OFFICE: V3 = [-400, 0, 0];
export const ALLEY: V3 = [0, 0, -400];
export const at = (o: V3, x: number, y: number, z: number): V3 => [o[0] + x, o[1] + y, o[2] + z];

// ---------------- beats (frames, from the aligned voice) ----------------
export const SNAP = 63;                 // "gắn": the magnet box clacks onto the truck
export const TRACK_SPOT: V3 = [-3.22, 0.47, 3.72]; // under the rear bumper (truck local = world while parked at x 0)
export const TUG = [377, 430] as const;  // two campers fight over one chair
export const GRAB = [446, 476] as const; // four hands on one box; it squirts up at GRAB[1]
export const SIP = 584;                 // Kubasta sips his tea
export const PHONE_UP = 604;            // "một chiếc điện thoại"
export const TURN = [748, 764] as const; // aerial: the truck turns left
export const NOD = 780, NOD2 = 869;
export const PIN1 = 818, PIN2 = 839;    // the dot stops at store pins
export const TRUCK_STOP = 972;          // 18 June: the truck brakes at the store
export const PEN_DROP = 1032, FIND = 1053, YANK = 1100;
export const SLAP = 1162;               // "thẳng": the box slapped onto the police desk
export const ADMIT = 1226;
export const LOCK_CLICK = 1467;         // "bí mật": the restock schedule locked away
export const TICK1 = 1547, TICK2 = 1570, ENGINE = 1600;
export const GAVEL = 1786;              // "tội"
export const STAMP1 = 1862, BILLS = [1887, 1894, 1902, 1910, 1918] as const, STAMP2 = 1927;
export const ANKLE = 2050;              // "đeo": the ankle monitor clacks shut
export const blinkOn = (f: number, f0 = -999) => f >= f0 && ((f - f0) % 30) < 9; // the tracker LED: once a second
// ---- the morning he follows on his phone (shots 6-8): one clock and one van position for the wall clock, his phone and the aerial
export const POV6 = 632;                // cut to his own view of the phone
export const POV8 = [805, 858] as const;
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** minutes since midnight: 8:52 at home, a time-lapse to 9:10 (Target, PIN1) and 10:30 (Walmart, PIN2): the route sheet's times */
export const clockMin = (f: number) => {
  if (f < POV8[0]) return 532 + (f - 560) * 0.012;
  if (f < PIN1) return lerp(532 + 245 * 0.012, 550, smooth((f - POV8[0]) / (PIN1 - POV8[0])));
  if (f < 826) return 550;
  if (f < PIN2) return lerp(550, 630, smooth((f - 826) / (PIN2 - 826)));
  return 630 + (f - PIN2) * 0.012;
};
export const clockStr = (m: number) => `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
/** the van's distance (m) along her route (art.ROUTE): along the main road toward the cross road, then store to store */
export const vanD = (f: number) => {
  if (f < 790) return 61 - 0.27 * (728 - f);
  if (f < PIN1) return lerp(87, 167, smooth((f - POV8[0]) / (PIN1 - POV8[0])));
  if (f < 826) return 167;
  return lerp(167, 297, smooth((f - 826) / (PIN2 - 826)));
};

// ---------------- truck ----------------
/** truck pose: hook/crowd parked at x 0; aerial drive with a left turn into the cross road at x -70; 18 June drive-in */
export const CROSS_X = -70;
export const truckPose = (id: number, f: number): { x: number; z: number; yaw: number; dip: number } => {
  if (id === 7) { // aerial: heading -x along the main road, then a left turn into +z
    const R = 4.5, x0 = -61, xT = CROSS_X + R, zLane = 3.2; // same speed as the dot on his phone (0.27 m/f)
    if (f < TURN[0]) { const u = (f - 728) / (TURN[0] - 728); return { x: x0 + (xT - x0) * u, z: zLane, yaw: Math.PI, dip: 0 }; }
    if (f < TURN[1]) { const u = (f - TURN[0]) / (TURN[1] - TURN[0]), a = (u * Math.PI) / 2; return { x: xT - R * Math.sin(a), z: zLane + R * (1 - Math.cos(a)), yaw: Math.PI + a, dip: 0 }; }
    const u = f - TURN[1]; return { x: CROSS_X, z: zLane + R + u * 0.3, yaw: 1.5 * Math.PI, dip: 0 };
  }
  if (id >= 9 && id <= 14) { // 18 June: drives in from -x and brakes
    const x = f >= TRUCK_STOP ? 0 : -45 * (1 - easeOut((f - 925) / (TRUCK_STOP - 925))), b = f - TRUCK_STOP;
    return { x, z: 0, yaw: 0, dip: b > 0 && b < 20 ? -0.012 * Math.sin(b * 0.7) * Math.exp(-b / 7) : 0 };
  }
  return { x: 0, z: 0, yaw: 0, dip: 0 };
};

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Place = "street" | "home" | "living" | "shop" | "police" | "court" | "office" | "alley";
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 178, light: "golden", place: "street", sunAz: 140, sunEl: 22 },
  { id: 2, a: 178, b: 290, light: "golden", place: "street", sunAz: 140, sunEl: 22 },
  { id: 3, a: 290, b: 440, light: "golden", place: "street", sunAz: 140, sunEl: 22 },
  { id: 4, a: 440, b: 495, light: "day", place: "shop", sunAz: 140, sunEl: 62 },
  { id: 5, a: 495, b: 560, light: "golden", place: "home", sunAz: 30, sunEl: 9 },
  { id: 6, a: 560, b: 728, light: "golden", place: "living", sunAz: 120, sunEl: 40 },
  { id: 7, a: 728, b: 772, light: "golden", place: "street", sunAz: 40, sunEl: 55 },
  { id: 8, a: 772, b: 895, light: "golden", place: "living", sunAz: 120, sunEl: 40 },
  { id: 9, a: 895, b: 1135, light: "day", place: "street", sunAz: 110 },
  { id: 10, a: 1135, b: 1195, light: "day", place: "police", sunAz: 140, sunEl: 62 },
  { id: 11, a: 1195, b: 1278, light: "day", place: "police", sunAz: 140, sunEl: 62 },
  { id: 12, a: 1278, b: 1385, light: "day", place: "police", sunAz: 150, sunEl: 62 },
  { id: 13, a: 1385, b: 1485, light: "golden", place: "shop", sunAz: 120, sunEl: 30 },
  { id: 14, a: 1485, b: 1630, light: "day", place: "street", sunAz: 120 },
  { id: 15, a: 1630, b: 1745, light: "golden", place: "street", sunAz: 120, sunEl: 40 },
  { id: 16, a: 1745, b: 1846, light: "day", place: "court", sunAz: 140, sunEl: 55 },
  { id: 17, a: 1846, b: 1968, light: "day", place: "court", sunAz: 140, sunEl: 55 },
  { id: 18, a: 1968, b: 2096, light: "day", place: "court", sunAz: 140, sunEl: 55 },
  { id: 19, a: 2096, b: 2168, light: "day", place: "street", sunAz: 120 },
  { id: 20, a: 2168, b: TOTAL, light: "day", place: "street", sunAz: 120 },
];
/** crossfades (frames): place changes travel by dissolving through matched frames (phone <-> aerial, sheet <-> phone) */
export const XFADE: Record<number, number> = { 4: 8, 5: 10, 6: 10, 7: 10, 8: 10, 9: 8, 10: 6, 11: 8, 13: 6, 14: 8, 15: 12, 19: 8, 20: 16 };
export const FLASH_AT = -100;
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
const Lv = (x: number, y: number, z: number) => at(LIVING, x, y, z);
const S = (x: number, y: number, z: number) => at(SHOP, x, y, z);
const P = (x: number, y: number, z: number) => at(POLICE, x, y, z);
const C = (x: number, y: number, z: number) => at(COURT, x, y, z);
/** the paper / phone inserts live on a bare plinth far off the street (top-down macro, see sets.ts INSERT) */
export const INSERT: V3 = [0, 0.2, -300];
const I = (x: number, y: number, z: number) => at(INSERT, x, y, z);
/** the aerial (shot 7) looks straight down the way the phone map does; the phone's last frame shows this exact patch of town */
export const AER_LOOK: V3 = [CROSS_X + 3, 0, 9], AER_POS: V3 = [CROSS_X + 3, 46, 17];
/** POV push in shot 6: a slow drift, then from f690 a dive until the screen fills the frame at f728 (k 0.643) */
const povPush = (f: number) => {
  const k690 = Math.exp(-0.0008 * (690 - POV6));
  if (f < 690) return Math.exp(-0.0008 * (f - POV6));
  return k690 * (0.643 / k690) ** glide((f - 690) / 38);
};

const CAMS: Record<number, Key[]> = {
  // hook: low at the rear bumper; the clack; then rise and pull back to the store as the driver walks out
  1: [
    { f: 0, s: (f) => dolly([-7.4, 0.9, 3.0], [-3.5, 0.8, 4.15], pushK(f, 0, 0.0025, 0.006, 20), { fov: 40, roll: -0.02 }) },
    { f: 96, dur: 60, s: (f) => dolly([-13.5, 5.2, -4.5], [3.0, 1.8, 9.4], pushK(f, 96, 0.0012), { fov: 50, roll: 0.02 }) },
  ],
  // the store sign and its temperature board climbing ("cơn sốt")
  2: [{ f: 178, s: (f) => dolly([-12.5, 2.0, 3.0], [-4.5, 4.4, 12.0], pushK(f, 178, 0.0025, 0.006, 24), { fov: 50 }) }],
  // camping crowd, the chair tug-of-war, push toward the doors
  3: [
    { f: 290, s: (f) => dolly([-1.0, 1.8, 6.3], [2.4, 1.0, 11.6], pushK(f, 290, 0.002), { fov: 48 }) }, // outside the parked truck (was inside it)
    { f: 370, dur: 26, s: (f) => dolly([4.0, 1.45, 7.0], [6.9, 1.1, 10.7], pushK(f, 370, 0.0025, 0.006, 20), { fov: 40, roll: -0.03 }) },
    { f: 418, dur: 22, s: (f) => dolly([6.4, 1.7, 9.2], [7.1, 1.6, 13.4], pushK(f, 418, 0.004), { fov: 42 }) },
  ],
  // inside: four hands on one box, it squirts up and the camera tilts after it
  4: [
    { f: 440, s: (f) => dolly(S(3.4, 1.75, -3.2), S(5.5, 1.5, -7.3), pushK(f, 440, 0.003), { fov: 44 }) },
    { f: 474, dur: 18, s: () => ({ pos: S(3.6, 1.8, -3.4), look: S(5.6, 4.2, -7.0), fov: 46, roll: 0.03 }) },
  ],
  // house front: the KUBASTA mailbox, push toward the lit window
  5: [{ f: 495, s: (f) => dolly(H(4.2, 1.45, 9.6), H(2.2, 1.35, 5.0), pushK(f, 495, 0.004), { fov: 44 }) }],
  // living room: calm in his armchair, the tea, he lifts the phone (its back to us); then HIS view: the screen between his hands,
  // the dot crawling; the camera dives into the screen and the map becomes the town (shot 7)
  6: [
    { f: 560, s: (f) => dolly(Lv(1.6, 1.35, 2.6), Lv(0, 0.95, -1.0), pushK(f, 560, 0.002), { fov: 44 }) },
    { f: 600, dur: 30, s: (f) => dolly(Lv(0.7, 1.2, 0.6), Lv(0, 1.0, -1.0), pushK(f, 600, 0.002), { fov: 38 }) },
    { f: POV6, cut: true, s: (f) => dolly(I(120, 0.95, 0.047), I(120, 0, 0.027), povPush(f), { fov: 34 }) },
  ],
  // aerial over the town: the truck (blinking green) turns left into the cross road
  7: [{ f: 728, s: (f) => dolly(AER_POS, AER_LOOK, pushK(f, 728, 0.002), { fov: 40 }) }], // top-down like the map: map-up = world -z
  // back with him: the knowing nod (phone back to us, wall clock behind); his view: the dot stops at two stores as his phone's
  // clock races (time-lapse); back on him, the wall clock moved on too, the second nod
  8: [
    { f: 772, s: (f) => dolly(Lv(1.3, 1.25, 1.6), Lv(0, 1.05, -1.0), pushK(f, 772, 0.003, 0.006, 16), { fov: 40 }) },
    { f: POV8[0], cut: true, s: (f) => dolly(I(120, 0.95, 0.047), I(120, 0, 0.027), pushK(f, POV8[0], 0.0008), { fov: 34 }) },
    { f: POV8[1], cut: true, s: (f) => dolly(Lv(1.0, 1.2, 1.0), Lv(0, 1.05, -1.0), pushK(f, POV8[1], 0.002), { fov: 40 }) },
  ],
  // 18 June: wide as the truck pulls in; low insert under the bumper; she holds the box into the lens
  9: [
    { f: 895, s: (f) => dolly([-12.5, 1.6, -4.5], [-1.0, 1.8, 4.0], pushK(f, 895, 0.0015), { fov: 46 }) },
    { f: 990, dur: 30, s: (f) => dolly([-7.4, 1.35, 1.2], [-3.7, 1.0, 4.6], pushK(f, 990, 0.002), { fov: 42 }) },
    { f: 1040, cut: true, s: (f) => dolly([-3.9, 0.22, 2.55], [-3.22, 0.45, 3.72], pushK(f, 1040, 0.003, 0.008, 20), { fov: 30 }) },
    { f: FIND, cut: true, s: (f) => dolly([-6.1, 0.85, 4.7], [-3.7, 1.05, 4.1], pushK(f, FIND, 0.004, 0.008, 14), { fov: 34 }) }, // her face as she sees it
    { f: 1076, cut: true, s: (f) => dolly([-3.9, 0.22, 2.55], [-3.22, 0.45, 3.72], pushK(f, 1040, 0.003), { fov: 30 }) },     // back on the box: her arm comes in
    { f: 1102, cut: true, s: (f) => dolly([-5.6, 0.85, 3.6], [-4.15, 1.45, 4.85], pushK(f, 1102, 0.004), { fov: 40, roll: 0.04 }) },
  ],
  // police desk: the slap
  10: [{ f: 1135, s: (f) => dolly(P(1.6, 1.6, 3.6), P(-0.15, 1.25, -1.0), pushK(f, 1135, 0.003, 0.007, 16), { fov: 50 }) }],
  // interview room: the admission, then the still hold
  11: [{ f: 1195, s: (f) => dolly(P(13.4, 1.45, 2.3), P(11, 0.95, -0.6), pushK(f, 1195, 0.0025), { fov: 42 }) }],
  // "Khoan": the officer leans into a low wide lens, the old man small behind
  12: [
    { f: 1278, cut: true, s: (f) => dolly(P(11.85, 1.15, 3.15), P(11.6, 1.45, 0.9), pushK(f, 1278, 0.0025, 0.006, 24), { fov: 54, roll: -0.05 }) },
  ],
  // stockroom: the schedule goes in the drawer, click
  13: [{ f: 1385, s: (f) => dolly(S(-4.2, 1.55, -1.6), S(-7.2, 1.0, -4.0), pushK(f, 1385, 0.003, 0.006, 20), { fov: 42 }) }],
  // the driver's route sheet, top-down macro; she ticks a store and its time
  14: [
    { f: 1485, s: (f) => dolly([5.2, 1.6, 8.8], [4.6, 1.35, 5.0], pushK(f, 1485, 0.002), { fov: 42 }) }, // in front of her (was inside the truck)
    { f: 1512, cut: true, s: (f) => dolly(I(0, 0.95, 0.02), I(0, 0, 0), pushK(f, 1512, 0.0008), { fov: 34 }) },
  ],
  // match: the route line becomes the line on his phone map
  15: [{ f: 1630, s: (f) => dolly(I(40, 0.95, 0.02), I(40, 0, 0), pushK(f, 1512, 0.0008), { fov: 34 }) }], // continues shot 14's push: the route lines match
  // court: the gavel
  16: [
    { f: 1745, s: (f) => dolly(C(2.4, 1.9, 4.4), C(0.4, 1.6, -4.2), pushK(f, 1745, 0.003, 0.008, 20), { fov: 46 }) },
  ],
  // locked on the bench: stamp, five bills, stamp
  17: [{ f: 1846, cut: true, s: (f) => dolly(C(0.95, 3.0, -2.6), C(0.95, 1.5, -3.8), pushK(f, 1846, 0.0012), { fov: 50 }) }],
  // the ankle monitor: low insert, then up to his face
  18: [
    { f: 1968, s: (f) => dolly(C(1.75, 0.32, 1.9), C(1.1, 0.12, 0.62), pushK(f, 1968, 0.002, 0.006, 20), { fov: 26 }) },
    { f: 2062, dur: 26, s: (f) => dolly(C(2.1, 1.4, 2.4), C(1.0, 1.45, 0.6), pushK(f, 2062, 0.003), { fov: 38 }) },
  ],
  // outside: he shuffles along; crane straight up until the town is the map
  19: [
    { f: 2096, s: (f) => dolly([-12.0, 1.3, 5.6], [-15.0, 0.6, 8.6], pushK(f, 2096, 0.002), { fov: 36 }) },
    { f: 2112, dur: 56, s: (f) => dolly([-15.5, 60, 9.0], [-15.5, 0, 8.4], pushK(f, 2112, 0.0008), { fov: 40 }) },
  ],
  // the town is the map now: the slow green dot is him
  20: [{ f: 2168, s: () => dolly(I(80, 0.95, 0.02), I(80, 0, 0), 1, { fov: 34 }) }], // the map itself zooms out (cast.ts)
};
/** impact kicks: the clack, the slap, the gavel, the ankle clack */
export const KICKS: [number, number][] = [[SNAP, 0.9], [YANK, 0.7], [SLAP, 0.8], [LOCK_CLICK, 0.3], [GAVEL, 1.0], [STAMP1, 0.4], [STAMP2, 0.5], [ANKLE, 0.9]];
const kickAt = (f: number) => {
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
  { f: 0, cInf: 12, focus: () => TRACK_SPOT },
  { f: 96, dur: 50, cInf: 0 },
  { f: 178, cInf: 5, focus: () => [-5.8, 4.6, 11.6] },
  { f: 290, cInf: 0 },
  { f: 370, dur: 26, cInf: 9, focus: () => [6.9, 1.2, 10.6] },
  { f: 440, cInf: 10, focus: () => S(5.5, 1.5, -6.4) },
  { f: 495, cInf: 9, focus: () => H(2.9, 1.15, 6.9) },
  { f: 560, cInf: 9, focus: () => Lv(0, 1.1, -1.0) },
  { f: 600, dur: 30, cInf: 10, focus: () => Lv(0, 1.1, -1.0) },
  { f: POV6, cInf: 0 },
  { f: 728, cInf: 0 },
  { f: 772, cInf: 10, focus: () => Lv(0, 1.2, -1.0) },
  { f: POV8[0], cInf: 0 },
  { f: POV8[1], cInf: 10, focus: () => Lv(0, 1.2, -1.0) },
  { f: 895, cInf: 0 },
  { f: 990, dur: 30, cInf: 8, focus: () => [-3.7, 1.0, 4.6] },
  { f: 1040, cInf: 15, focus: () => TRACK_SPOT },
  { f: FIND, cInf: 10, focus: () => [-3.7, 1.1, 4.1] },
  { f: 1076, cInf: 12, focus: () => TRACK_SPOT },
  { f: 1102, cInf: 12, focus: () => [-4.15, 1.45, 4.85] },
  { f: 1135, cInf: 9, focus: () => P(0, 1.1, -0.9) },
  { f: 1195, cInf: 9, focus: () => P(11, 1.0, -0.6) },
  { f: 1278, cInf: 12, focus: () => P(11.75, 1.55, 1.55) },
  { f: 1385, cInf: 10, focus: () => S(-7.2, 1.0, -4.0) },
  { f: 1485, cInf: 9, focus: () => [4.6, 1.4, 5.0] },
  { f: 1512, dur: 24, cInf: 0 },
  { f: 1745, cInf: 8, focus: () => C(0.2, 1.9, -4.2) },
  { f: 1846, cInf: 6, focus: () => C(0.95, 1.55, -3.75) },
  { f: 1968, cInf: 12, focus: () => C(1.08, 0.12, 0.62) },
  { f: 2062, dur: 26, cInf: 10, focus: () => C(1.0, 1.5, 0.6) },
  { f: 2096, cInf: 10, focus: () => [-15, 0.6, 8.6] },
  { f: 2112, dur: 50, cInf: 0 },
  { f: 2168, cInf: 0 },
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
