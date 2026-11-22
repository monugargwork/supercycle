// Rigid-body physics (cannon-es), baked once per render tab at a fixed 240 Hz step and sampled per video frame, so every frame
// is a pure function of the frame number (Remotion renders frames out of order, across tabs). Set-local shop coordinates.
//   doorShards: the glass door pane smashed by the sledgehammer (S01), flying in and settling on the floor (seen again in S04, S05, S23)
//   caseShards: the four case tops (S04), falling onto the cards and the floor
//   lockTracks: the trailer padlock and its shackle after the bolt cutters snap it (S06)
import * as CANNON from "cannon-es";
import { FPS, V3, SHOPP, SMASH1, STRIKE4, SNAP6 } from "./story";

export type Pose = { p: V3; q: [number, number, number, number] };
type Track = Pose[];
export type Shard = { size: [number, number, number]; track: Track };
const STEP = 1 / 240, SUB = Math.round(1 / FPS / STEP);
const rnd = (i: number, k: number) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };

const bake = (setup: (w: CANNON.World) => CANNON.Body[], n: number): Track[] => {
  const w = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  w.defaultContactMaterial.friction = 0.6; w.defaultContactMaterial.restitution = 0.2;
  (w.solver as CANNON.GSSolver).iterations = 14;
  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() }); ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); w.addBody(ground);
  const bodies = setup(w), tracks: Track[] = bodies.map(() => []);
  const rec = () => bodies.forEach((b, i) => tracks[i].push({ p: [b.position.x, b.position.y, b.position.z], q: [b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w] }));
  rec();
  for (let k = 0; k < n; k++) { for (let s = 0; s < SUB; s++) w.step(STEP); rec(); }
  return tracks;
};
export const sample = (t: Track, i: number) => t[Math.max(0, Math.min(t.length - 1, i))];
const plateBody = (w: CANNON.World, sx: number, sy: number, sz: number, p: V3, v: V3, av: V3, mass: number) => {
  const b = new CANNON.Body({ mass, linearDamping: 0.08, angularDamping: 0.2, shape: new CANNON.Box(new CANNON.Vec3(sx / 2, sy / 2, sz / 2)) });
  b.position.set(...p); b.velocity.set(...v); b.angularVelocity.set(...av); w.addBody(b); return b;
};

// ---- the door pane: ~40 plates over x -0.5..0.5, y 0.1..2.15, at z pane_z, thrown inward (-z) from the strike point ----
let DOOR: Shard[] | null = null;
export const doorShards = (): Shard[] => DOOR ??= (() => {
  const S = SHOPP, [hx, hy] = [S.glass_hit[0], S.glass_hit[1]], sizes: [number, number, number][] = [], starts: V3[] = [];
  const cols = 9, rows = 13;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c; if (rnd(i, 1) < 0.2) continue;
    const w = 1.0 / cols * (0.6 + 0.35 * rnd(i, 2)), h = 2.05 / rows * (0.55 + 0.4 * rnd(i, 3));
    sizes.push([w, h, 0.006]); starts.push([-0.5 + (c + 0.5) / cols + (rnd(i, 4) - 0.5) * 0.04, 0.1 + (r + 0.5) * 2.05 / rows, S.pane_z]);
  }
  const tracks = bake((w) => starts.map((p, i) => {
    const dx = p[0] - hx, dy = p[1] - hy, d = Math.hypot(dx, dy) + 0.15, k = 1 / d;
    const v: V3 = [dx * k * (0.6 + 0.8 * rnd(i, 5)), 0.6 * rnd(i, 6) + dy * k * 0.4, -(1.2 + 2.4 * rnd(i, 7)) * Math.min(1.6, 0.5 + 0.6 * k)];
    return plateBody(w, ...sizes[i], p, v, [(rnd(i, 8) - 0.5) * 14, (rnd(i, 9) - 0.5) * 10, (rnd(i, 10) - 0.5) * 14], 0.015 + 0.06 * sizes[i][0] * sizes[i][1] * 10);
  }), 150);
  return tracks.map((t, i) => ({ size: sizes[i], track: t }));
})();
export const doorShardsAt = (f: number) => (f < SMASH1 ? null : doorShards().map((s) => ({ size: s.size, pose: sample(s.track, f - SMASH1) })));

// ---- the four case tops: 14 plates each from the strike point, onto the shelf (y 0.86) and the floor ----
let CASES: Shard[][] | null = null;
export const caseShards = (): Shard[][] => CASES ??= SHOPP.case_z.map((zc, ci) => {
  const S = SHOPP, x0 = S.case_x - S.case_dep / 2, x1 = S.case_x + S.case_dep / 2, z0 = zc - S.case_len / 2, z1 = zc + S.case_len / 2, top = S.case_top;
  const sizes: [number, number, number][] = [], starts: V3[] = [];
  for (let i = 0; i < 14; i++) { const j = ci * 100 + i; sizes.push([0.05 + 0.1 * rnd(j, 1), 0.006, 0.05 + 0.12 * rnd(j, 2)]); starts.push([x0 + 0.05 + (x1 - x0 - 0.1) * rnd(j, 3), top + 0.004, z0 + 0.08 + (z1 - z0 - 0.16) * rnd(j, 4)]); }
  const tr = bake((w) => {
    const base = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3((x1 - x0) / 2, 0.43, (z1 - z0) / 2)) }); base.position.set(S.case_x, 0.43, zc); w.addBody(base);
    return starts.map((p, i) => { const j = ci * 100 + i, out = p[0] - S.case_x; return plateBody(w, ...sizes[i], p, [out * 3 + (rnd(j, 5) - 0.3) * 1.2, -0.4 - rnd(j, 6), (p[2] - zc) * 2.2], [(rnd(j, 7) - 0.5) * 16, (rnd(j, 8) - 0.5) * 8, (rnd(j, 9) - 0.5) * 16], 0.02); });
  }, 90);
  return tr.map((t, i) => ({ size: sizes[i], track: t }));
});
export const caseShardsAt = (ci: number, f: number) => (f < STRIKE4[ci] ? null : caseShards()[ci].map((s) => ({ size: s.size, pose: sample(s.track, f - STRIKE4[ci]) })));

// ---- the trailer padlock (8 x 10 x 3 cm brass, 0.35 kg) and its shackle (60 g), dropped from the hasp ----
let LOCK: Track[] | null = null;
export const lockTracks = () => LOCK ??= bake((w) => {
  const S = SHOPP, [tx0, tx1, tz0, tz1] = S.trailer;
  const tr = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3((tx1 - tx0) / 2, 1.1, (tz1 - tz0) / 2)) }); tr.position.set((tx0 + tx1) / 2, S.trailer_floor + 1.1, (tz0 + tz1) / 2); w.addBody(tr);
  const body = plateBody(w, 0.13, 0.16, 0.05, [S.lock[0], S.lock[1], S.lock[2] + 0.02], [0.25, 0.3, 0.55], [2, 1, 6], 0.35);
  const sh = plateBody(w, 0.1, 0.08, 0.02, [S.lock[0], S.lock[1] + 0.12, S.lock[2] + 0.02], [-0.4, 1.0, 0.7], [8, 3, -5], 0.06);
  return [body, sh];
}, 110);
export const lockAt = (f: number) => { const t = lockTracks(); return f < SNAP6 ? null : t.map((x) => sample(x, f - SNAP6)); };
