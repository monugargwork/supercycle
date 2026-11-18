// Timeline of the attic Pokémon reel, timed to the Vietnamese voice (public/attic/words.json, 77.1 s).
// Sets live far apart in one scene: the painter's house (hallway + attic above, origin), his study (STUDY), the late-90s
// school yard (SCHOOL), Ewbank's auction room (AUCTION) and a top-down table (INSERT) for the "you see" explanation.
// Direction: supercycle repo videos/attic-pokemon-millions/beats.md. Visual laws: untouched = shine; time = dust.
export const FPS = 30;
export const TOTAL = 2360; // 78.7 s: the voice ends at 76.8 s, then the last meme and the nod
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
export const STUDY: V3 = [60, 0, 0];
export const SCHOOL: V3 = [0, 0, 60];
export const AUCTION: V3 = [-60, 0, 0];
export const INSERT: V3 = [0, 0.2, -300];
export const at = (o: V3, x: number, y: number, z: number): V3 => [o[0] + x, o[1] + y, o[2] + z];

// ---------------- house geometry shared by sets / cast / world ----------------
export const CEIL = 2.6;                 // hallway ceiling = attic floor underside
export const AFLOOR = 2.66;              // attic floor top
export const HATCH = { x0: -0.45, x1: 0.45, z0: -0.35, z1: 0.35 }; // the loft hatch hole (hinge along z0)
export const LADDER_TOP: V3 = [0, CEIL, 0.05], LADDER_BOT: V3 = [0, 0, 1.0]; // the sliding loft ladder, deployed
export const STACK_AT: V3 = [0.68, AFLOOR, 0.0]; // where the binder stack sits on the attic floor
export const BINDER = { w: 0.3, h: 0.065, d: 0.32 }; // a binder lying flat (x width, y thickness, z depth)

// ---------------- beats (frames, from words.json) ----------------
export const PAT = [88, 96] as const;    // "ba trăm bảng": two pats on the £300 binder
export const HATCH_SLAM = 125;           // "quên"
export const SWAP = 266;                 // "đổi": a card flips between the kids
export const TAKE = 338, SHINE = 361, SCHEME = 433; // dad takes the card; holo flash on "đẹp"; grin on "đáng tiền"
export const CLICKS = [500, 514, 530] as const;    // "mua trọn từng bộ một"
export const BRUH = 607, QUIT = 673, CLICK2 = 713;
export const SHUT8 = 832, CAW = 841;
export const SPIT = 996;                 // "sáu nghìn"
export const CORD = 1034;                // he yanks the hatch cord
export const PLONK = 1150, OPEN = 1162, JAW = 1180; // binders on the counter; the valuer opens one; jaws drop on "há hốc"
export const BEND = 1605, DROP = 1628, SWAP2 = 1651; // kids: bend, drop in the puddle, trade
export const STORE = 1699, SWAT = 1772;
export const ROLL1 = [1874, 1915] as const, GAVEL = 1921; // board £300 -> £97,500, gavel on "bảng"
export const ROLL2 = [1958, 2005] as const, CHEER = 2037; // board -> £1,560,000; the room erupts on "thành công"
export const GLOW = 2150, NOD = 2270;

/** the price board: what it shows at frame f */
export const boardValue = (f: number) => {
  const r = (a: number, b: number, k: number) => Math.round(a + (b - a) * k);
  if (f < ROLL1[0]) return 300;
  if (f < ROLL1[1] + 1) { const k = smooth((f - ROLL1[0]) / (ROLL1[1] - ROLL1[0])); return Math.round(r(300, 97500, k * k) / 50) * 50; }
  if (f < ROLL2[0]) return 97500;
  const k = smooth((f - ROLL2[0]) / (ROLL2[1] - ROLL2[0]));
  return Math.round(r(97500, 1560000, k * k) / 1000) * 1000;
};
/** how much dust has settled in the attic (0 clean .. 1 fifteen years) */
export const dustAt = (f: number) => (f < 140 ? 0 : f < 190 ? smooth((f - 140) / 46) : f < 840 ? 0 : f < 2111 ? smooth((f - 840) / 22) : 1 - smooth((f - 2150) / 30));

export type Light = "day" | "golden";
export type Place = "house" | "study" | "school" | "auction" | "table";
export type ShotDef = { id: number; a: number; b: number; light: Light; place: Place; sunAz?: number; sunEl?: number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 193, light: "day", place: "house", sunAz: -40, sunEl: 40 },
  { id: 2, a: 193, b: 313, light: "day", place: "school" },
  { id: 3, a: 313, b: 457, light: "day", place: "school" },
  { id: 4, a: 457, b: 551, light: "day", place: "study" },
  { id: 5, a: 551, b: 619, light: "day", place: "study" },
  { id: 6, a: 619, b: 685, light: "day", place: "house" },
  { id: 7, a: 685, b: 733, light: "day", place: "study" },
  { id: 8, a: 733, b: 862, light: "day", place: "house", sunAz: -40, sunEl: 40 },
  { id: 9, a: 862, b: 1028, light: "day", place: "study" },
  { id: 10, a: 1028, b: 1068, light: "day", place: "house" },
  { id: 11, a: 1068, b: 1210, light: "day", place: "auction" },
  { id: 12, a: 1210, b: 1303, light: "day", place: "auction" },
  { id: 13, a: 1303, b: 1403, light: "day", place: "table" },
  { id: 14, a: 1403, b: 1567, light: "day", place: "table" },
  { id: 15, a: 1567, b: 1672, light: "day", place: "school" },
  { id: 16, a: 1672, b: 1712, light: "day", place: "study" },
  { id: 17, a: 1712, b: 1808, light: "day", place: "study" },
  { id: 18, a: 1808, b: 1933, light: "day", place: "auction" },
  { id: 19, a: 1933, b: 2111, light: "day", place: "auction" },
  { id: 20, a: 2111, b: 2360, light: "golden", place: "house", sunAz: -40, sunEl: 30 },
];
/** crossfades: time jumps dissolve (back to the 90s, 15 years later), place changes soften */
export const XFADE: Record<number, number> = { 2: 12, 4: 8, 6: 6, 8: 6, 9: 12, 10: 6, 11: 8, 13: 8, 15: 8, 16: 6, 18: 8, 20: 12 };
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
const St = (x: number, y: number, z: number) => at(STUDY, x, y, z);
const Sc = (x: number, y: number, z: number) => at(SCHOOL, x, y, z);
const Au = (x: number, y: number, z: number) => at(AUCTION, x, y, z);
const I = (x: number, y: number, z: number) => at(INSERT, x, y, z);

const CAMS: Record<number, Key[]> = {
  // hook, in the attic: his head and shoulders up through the hatch, the binders slid onto the boards, two pats on the £300 one,
  // he sinks, the hatch slams; then fifteen years of dust in the same locked frame
  1: [
    { f: 0, s: (f) => dolly([0.95, 3.35, 2.25], [0.38, 2.98, 0.05], pushK(f, 0, 0.0025, 0.006, 20), { fov: 42 }) },
    { f: 104, dur: 20, s: (f) => dolly([1.0, 3.45, 2.4], [0.4, 2.9, 0.0], pushK(f, 104, 0.002), { fov: 46 }) },
    { f: 140, dur: 40, s: (f) => dolly([1.15, 3.4, 2.2], [0.6, 2.95, -0.15], pushK(f, 140, 0.0015), { fov: 40 }) },
  ],
  // late 90s, the school yard: two kids trade, a card flips between them; dad walks up outside the fence
  2: [
    { f: 193, s: (f) => dolly(Sc(0.3, 1.05, -2.6), Sc(0.1, 0.9, 0.7), pushK(f, 193, 0.002, 0.005, 20), { fov: 38 }) },
    { f: 278, dur: 30, s: (f) => dolly(Sc(0.5, 1.2, -2.9), Sc(0.4, 1.05, 0.8), pushK(f, 278, 0.002), { fov: 42 }) },
  ],
  // over the fence: he takes the card, lifts it to the light (flash on "đẹp"), slow grin on "đáng tiền"
  3: [
    { f: 313, s: (f) => dolly(Sc(0.05, 1.15, -1.9), Sc(0.0, 1.2, 0.9), pushK(f, 313, 0.002), { fov: 38 }) },
    { f: 390, dur: 36, s: (f) => dolly(Sc(0.15, 1.45, -1.2), Sc(0.15, 1.5, 0.9), pushK(f, 390, 0.003, 0.008, 18), { fov: 34 }) },
  ],
  // study, late 90s: at the desk with the beige CRT; cut to the screen for the three purchases
  4: [
    { f: 457, s: (f) => dolly(St(-0.1, 1.3, 2.4), St(-0.38, 1.05, -0.6), pushK(f, 457, 0.002), { fov: 42 }) },
    { f: 496, cut: true, s: (f) => dolly(St(0.18, 0.97, -1.24), St(-0.395, 0.97, -0.36), pushK(f, 496, 0.0015), { fov: 32 }) },
  ],
  // the doorway: low and wide, the son and his two friends stare; dad in the foreground hugging a binder
  5: [{ f: 551, s: (f) => dolly(St(2.8, 1.5, -0.7), St(-1.05, 1.0, -0.12), pushK(f, 551, 0.0015, 0.004, 14), { fov: 54 }) }],
  // hallway: the son drops his cards in the toy box and goes off with a football
  6: [{ f: 619, s: (f) => dolly([1.8, 1.0, 3.4], [-0.9, 0.75, 0.9], pushK(f, 619, 0.002), { fov: 44 }) }],
  // the study again, locked like shot 4: the parcel stack is taller than him now
  7: [{ f: 685, s: (f) => dolly(St(-0.1, 1.45, 2.6), St(-0.38, 1.15, -0.6), pushK(f, 685, 0.002), { fov: 46 }) }],
  // up the ladder with the binders, then the attic: on the boards, hatch shut, dust motes, nobody comes
  8: [
    { f: 733, s: (f) => dolly([2.3, 1.15, 3.3], [0.1, 1.45, 0.6], pushK(f, 733, 0.002), { fov: 46 }) },
    { f: 790, cut: true, s: (f) => dolly([0.95, 3.35, 2.25], [0.38, 2.98, 0.05], pushK(f, 790, 0.002), { fov: 42 }) },
  ],
  // fifteen years later, same study framing: flat screen, older him, tea; the newspaper on the desk; the spit
  9: [
    { f: 862, s: (f) => dolly(St(-0.1, 1.3, 2.4), St(-0.38, 1.05, -0.6), pushK(f, 862, 0.002), { fov: 42 }) },
    { f: 932, cut: true, s: (f) => dolly(St(0.12, 1.98, -0.22), St(0.12, 0.76, -0.2), pushK(f, 932, 0.001), { fov: 40 }) }, // over his shoulder, wide enough for the whole page (Frame.io v1: zoom out)
    { f: 988, cut: true, s: (f) => dolly(St(0.9, 1.2, 1.2), St(0.0, 1.15, -1.0), pushK(f, 988, 0.003, 0.01, 10), { fov: 38 }) },
  ],
  // hallway: he yanks the cord, the hatch drops, the ladder slides down, he scrambles up
  10: [{ f: 1028, s: (f) => dolly([2.3, 1.2, 3.4], [0.2, 1.55, 0.5], pushK(f, 1028, 0.003), { fov: 50 }) }],
  // Ewbank's: he staggers in with the binder tower, plonks it down; the valuer opens one; every jaw drops to the floor
  11: [
    { f: 1068, s: (f) => dolly(Au(1.8, 1.6, 6.6), Au(3.2, 1.1, 2.4), pushK(f, 1068, 0.0015), { fov: 46 }) },
    { f: 1170, dur: 14, s: (f) => dolly(Au(2.2, 1.45, 6.2), Au(3.25, 1.15, 2.4), pushK(f, 1170, 0.002, 0.008, 12), { fov: 48 }) },
  ],
  // the listener's beat: a plain kids' binder on the counter, the valuer's look
  12: [{ f: 1210, s: (f) => dolly(Au(3.6, 2.3, 4.3), Au(3.4, 1.3, 2.4), pushK(f, 1210, 0.0015), { fov: 34 }) }],
  // "you see": top-down on a warm table; the heap of loose cards, then his binder page
  13: [{ f: 1303, s: (f) => dolly(I(0, 0.95, 0.02), I(0, 0, 0), pushK(f, 1303, 0.0008), { fov: 34 }) }],
  14: [{ f: 1403, s: (f) => dolly(I(0, 0.95, 0.02), I(0, 0, 0), pushK(f, 1303, 0.0005), { fov: 34 }) }],
  // the yard, locked: bent, dropped in the puddle, traded away
  15: [{ f: 1567, s: (f) => dolly(Sc(0.1, 1.1, 1.6), Sc(0.1, 0.85, -1.5), pushK(f, 1567, 0.0015), { fov: 48 }) }],
  // the study: one card into a sleeve, the binder closed, gently
  16: [{ f: 1672, s: (f) => dolly(St(0.6, 1.3, 1.3), St(0.05, 0.95, -0.55), pushK(f, 1672, 0.003), { fov: 38 }) }],
  // the shelf: the son's arm creeps up to a binder, dad swats it away
  17: [{ f: 1712, s: (f) => dolly(St(0.3, 1.15, 1.6), St(1.25, 1.0, -1.8), pushK(f, 1712, 0.0025, 0.007, 12), { fov: 40 }) }],
  // the rostrum: the price board rolls from £300 to £97,500, gavel on "bảng"
  18: [{ f: 1808, s: (f) => dolly(Au(-0.5, 2.3, 1.6), Au(-0.6, 1.85, -4.8), pushK(f, 1808, 0.0012, 0.006, 14), { fov: 46 }) }],
  // the whole room: the board runs to £1.56m and they erupt
  19: [
    { f: 1933, s: (f) => dolly(Au(-1.3, 2.3, -1.75), Au(-1.3, 2.45, -5.17), pushK(f, 1933, 0.001), { fov: 46 }) },
    { f: 2005, cut: true, s: (f) => dolly(Au(0.3, 1.55, -3.8), Au(0.0, 1.15, 0.6), pushK(f, 2005, 0.002, 0.006, 14), { fov: 50 }) },
  ],
  // dusk, the hallway: he opens the hatch and gold light floods down; then up in the attic among the shining binders
  20: [
    { f: 2111, s: (f) => dolly([1.5, 0.7, 3.0], [0.0, 1.9, 0.2], pushK(f, 2111, 0.002), { fov: 48 }) },
    { f: 2200, cut: true, s: (f) => dolly([1.0, 3.45, 2.4], [0.3, 3.1, -0.4], pushK(f, 2200, 0.002, 0.005, 16), { fov: 44 }) },
  ],
};
/** impact kicks: the hatch slam, the plonk, the jaws, the swat, the gavel */
export const KICKS: [number, number][] = [[HATCH_SLAM, 0.9], [SHUT8, 0.35], [SPIT, 0.5], [CORD + 4, 0.6], [PLONK, 0.6], [JAW + 6, 1.0], [SWAT, 0.7], [GAVEL, 1.0], [CHEER, 0.5], [1414, 0.35]];
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
  { f: 0, cInf: 9, focus: () => [0.5, 2.95, 0.0] },
  { f: 140, dur: 30, cInf: 7, focus: () => [STACK_AT[0], 2.8, 0] },
  { f: 193, cInf: 8, focus: () => Sc(0.1, 1.0, 0.8) },
  { f: 313, cInf: 9, focus: () => Sc(-0.1, 1.45, 2.3) },
  { f: 457, cInf: 7, focus: () => St(-0.1, 1.0, -0.9) },
  { f: 496, cInf: 0 },
  { f: 551, cInf: 5, focus: () => St(-2.6, 1.1, 0.7) },
  { f: 619, cInf: 7, focus: () => [-1.0, 0.8, 1.0] },
  { f: 685, cInf: 6, focus: () => St(-0.1, 1.0, -0.9) },
  { f: 733, cInf: 7, focus: () => [0, 1.6, 0.6] },
  { f: 790, cInf: 9, focus: () => [0.5, 2.95, 0.0] },
  { f: 862, cInf: 7, focus: () => St(-0.1, 1.0, -0.9) },
  { f: 932, cInf: 0 },
  { f: 988, cInf: 9, focus: () => St(0, 1.2, -1.0) },
  { f: 1028, cInf: 6, focus: () => [0.5, 1.6, 0.8] },
  { f: 1068, cInf: 5, focus: () => Au(3.3, 1.2, 2.5) },
  { f: 1210, cInf: 10, focus: () => Au(3.4, 1.3, 2.6) },
  { f: 1303, cInf: 0 },
  { f: 1567, cInf: 7, focus: () => Sc(0, 0.9, -1.4) },
  { f: 1672, cInf: 10, focus: () => St(-0.1, 0.8, -0.4) },
  { f: 1712, cInf: 9, focus: () => St(1.6, 1.1, -1.6) },
  { f: 1808, cInf: 5, focus: () => Au(-0.2, 1.7, -4.4) },
  { f: 1933, cInf: 2, focus: () => Au(-1.3, 2.45, -5.17) },
  { f: 2005, cInf: 5, focus: () => Au(0, 1.4, 0.3) },
  { f: 2111, cInf: 6, focus: () => [0.4, 1.6, 0.8] },
  { f: 2200, cInf: 7, focus: () => [0.2, 3.1, -0.5] },
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
