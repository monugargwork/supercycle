// Character test timeline (12 s, 30 fps): idle -> walk to a box -> crouch and grab it -> lift and carry ->
// two-handed throw -> the box flies, bounces and settles (cannon-es, baked) -> he sits down and lies back on the floor.
// Every limb end is a world target; the IK keeps the limb lengths fixed, so each reach is staged by moving the body.
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { DIM, Pose, V3, Expr } from "./rig";

export const CHAR_FRAMES = 360;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const seg = (f: number, a: number, b: number) => sm((f - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpV = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const qBody = (yaw: number, bend: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(bend, yaw, 0, "YXZ"));

const YAW = Math.PI / 2;                  // facing +x the whole time
const FWD = new THREE.Vector3(1, 0, 0), LAT = new THREE.Vector3(0, 0, -1); // his forward and his left (+x local -> world -z)
const STAND = 0.53;                       // pelvis height standing: hips 0.60 up on legs 0.62 long (a hair of knee bend)
const BOX = 0.35, BOX_START: V3 = [0.38, BOX / 2, 0];
export const BOX_SIZE = BOX;
const W1: [number, number, number, number] = [30, 90, -1.6, -0.12];   // walk 1: frames, from x, to x
const W2: [number, number, number, number] = [144, 184, -0.14, 0.9];  // walk 2 (carrying)
const RELEASE = 222;

/** the pelvis x along a walk, eased in and out */
const walkX = (f: number, [a, b, x0, x1]: typeof W1) => lerp(x0, x1, sm((f - a) / (b - a)));
/** feet planted while walking: each foot stays put during its stance, swings to the next spot with a lift */
const STRIDE = 0.58;
const walkFoot = (s: number, o: number): { d: number; lift: number } => {
  const u = s / STRIDE + o, k = Math.floor(u), p = u - k, c = (k - o) * STRIDE + 0.25 * STRIDE;
  if (p < 0.5) return { d: c, lift: 0 };
  const w = (p - 0.5) / 0.5;
  return { d: c + STRIDE * sm(w), lift: 0.09 * Math.sin(Math.PI * w) };
};

/** box: where it is and how it is turned, before the throw (in hands) and after (physics bake) */
type BoxState = { p: V3; q: THREE.Quaternion };

// ---------------- body track ----------------
const pelvisX = (f: number) => {
  if (f < W1[0]) return W1[2];
  if (f <= W1[1]) return walkX(f, W1);
  if (f < W2[0]) return lerp(W1[3], -0.08, seg(f, 90, 110)) + (W2[2] + 0.08) * seg(f, 110, 140); // shifts over his feet as he squats
  if (f <= W2[1]) return walkX(f, W2);
  return W2[3] + 0.04 * seg(f, 206, 222) - 0.04 * seg(f, 230, 250) + 0.12 * seg(f, 290, 320);
};
const pelvisY = (f: number) => {
  const breathe = 0.004 * Math.sin(f * 0.12);
  let y = STAND + breathe;
  y -= 0.25 * seg(f, 90, 110) - 0.25 * seg(f, 110, 140);                 // squat for the box (pelvis 0.28)
  if ((f > W1[0] && f < W1[1]) || (f > W2[0] && f < W2[1])) y -= 0.04 * Math.min(seg(f, f < 100 ? W1[0] : W2[0], (f < 100 ? W1[0] : W2[0]) + 6), 1 - seg(f, (f < 100 ? W1[1] : W2[1]) - 6, f < 100 ? W1[1] : W2[1])); // knees a little bent while walking
  if ((f > W1[0] && f < W1[1]) || (f > W2[0] && f < W2[1])) y -= 0.015 * Math.abs(Math.sin((Math.PI * (walkX(f, f < 100 ? W1 : W2) - (f < 100 ? W1[2] : W2[2]))) / (STRIDE / 2))); // walk bob
  y -= (STAND - 0.02) * seg(f, 290, 318);                                // sit down on the floor
  y += 0.2 * seg(f, 318, 345);                                           // lying: the bean's back on the floor
  return y;
};
const bend = (f: number) => {
  let b = (45 * Math.PI / 180) * (seg(f, 90, 110) - seg(f, 110, 140)) + 0.05 * seg(f, 110, 140);
  b += -0.21 * seg(f, 186, 206) + 0.59 * seg(f, 206, 222) - 0.43 * seg(f, 222, 250);
  b += 0.06 * seg(f, 290, 305) - 0.06 * seg(f, 305, 318) - (Math.PI / 2) * seg(f, 318, 345);
  return b;
};
const exprAt = (f: number): Expr => f < 20 ? "look" : f < 98 ? "smile" : f < 140 ? "effort" : f < 186 ? "smile" : f < 222 ? "effort" : f < 300 ? "happy" : f < 320 ? "smile" : "tired";

const bodyPose = (f: number) => {
  const pelvis: V3 = [pelvisX(f), pelvisY(f), 0], q = qBody(YAW, bend(f));
  return { pelvis, q, toWorld: (p: V3): V3 => { const v = new THREE.Vector3(...p).applyQuaternion(q); return [pelvis[0] + v.x, pelvis[1] + v.y, pelvis[2] + v.z]; } };
};

// ---------------- the box in his hands ----------------
const CARRY: V3 = [0, 0.3, 0.27], OVER: V3 = [0, 0.86, 0.03], OUT: V3 = [0, 0.62, 0.38];
const heldBox = (f: number): BoxState => {
  const B = bodyPose(f), qy = qBody(YAW, 0);
  if (f < 110) return { p: BOX_START, q: qy };
  if (f < 140) { const k = seg(f, 110, 132); return { p: lerpV(BOX_START, B.toWorld(CARRY), k), q: qy }; }
  let loc = CARRY;
  if (f >= 186) loc = lerpV(CARRY, OVER, seg(f, 186, 206));
  if (f >= 206) loc = lerpV(OVER, OUT, seg(f, 206, RELEASE));
  return { p: B.toWorld(loc), q: f >= 186 ? B.q.clone() : qy };
};

// ---------------- physics bake (after the release) ----------------
const BAKE: BoxState[] = (() => {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  const mat = new CANNON.Material("m");
  world.defaultContactMaterial = new CANNON.ContactMaterial(mat, mat, { friction: 0.42, restitution: 0.32 });
  const ground = new CANNON.Body({ mass: 0, material: mat }); ground.addShape(new CANNON.Plane()); ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); world.addBody(ground);
  const wall = new CANNON.Body({ mass: 0, material: mat }); wall.addShape(new CANNON.Plane()); wall.quaternion.setFromEuler(0, -Math.PI / 2, 0); wall.position.set(3.9, 0, 0); world.addBody(wall);
  const h = BOX / 2, box = new CANNON.Body({ mass: 1.6, material: mat }); box.addShape(new CANNON.Box(new CANNON.Vec3(h, h, h)));
  const s0 = heldBox(RELEASE), s1 = heldBox(RELEASE - 1);
  box.position.set(...s0.p); box.quaternion.set(s0.q.x, s0.q.y, s0.q.z, s0.q.w);
  const v = new THREE.Vector3(...s0.p).sub(new THREE.Vector3(...s1.p)).multiplyScalar(30); // the hands' own speed...
  v.addScaledVector(FWD, 1.5).add(new THREE.Vector3(0, 1.5, 0));                          // ...plus the push of the throw
  box.velocity.set(v.x, v.y, v.z); box.angularVelocity.set(0, 0.6, -6.5);                  // tumbling forward (about his left-right axis)
  world.addBody(box);
  const out: BoxState[] = [];
  for (let f = RELEASE; f < CHAR_FRAMES; f++) {
    out.push({ p: [box.position.x, box.position.y, box.position.z], q: new THREE.Quaternion(box.quaternion.x, box.quaternion.y, box.quaternion.z, box.quaternion.w) });
    for (let i = 0; i < 8; i++) world.step(1 / 240);
  }
  return out;
})();
export const boxAt = (f: number): BoxState => (f < RELEASE ? heldBox(f) : BAKE[Math.min(BAKE.length - 1, f - RELEASE)]);

// ---------------- limbs ----------------
const ground = (p: V3): V3 => [p[0], DIM.limbR, p[2]];
export const poseAt = (f: number): Pose => {
  const B = bodyPose(f), px = B.pelvis[0];
  const box = boxAt(f);
  const latOf = (s: number, d: number, fw = 0): V3 => [B.pelvis[0] + FWD.x * fw + LAT.x * s * d, 0, B.pelvis[2] + LAT.z * s * d];
  // ---- feet ----
  let footL: V3, footR: V3;
  const standFeet = (): [V3, V3] => [ground(latOf(1, 0.1, 0.02)), ground(latOf(-1, 0.1, 0.02))];
  const walking = (W: typeof W1) => f > W[0] - 1 && f < W[1] + 1;
  if (walking(W1) || walking(W2)) {
    const W = walking(W1) ? W1 : W2, s = px - W[2];
    const wgt = Math.min(seg(f, W[0], W[0] + 6), 1 - seg(f, W[1] - 6, W[1]));
    const [sl, sr] = standFeet();
    const fl = walkFoot(s, 0), fr = walkFoot(s, 0.5);
    const wl: V3 = [W[2] + fl.d, DIM.limbR + fl.lift, LAT.z * 0.1], wr: V3 = [W[2] + fr.d, DIM.limbR + fr.lift, -LAT.z * 0.1];
    footL = lerpV(sl, wl, wgt); footR = lerpV(sr, wr, wgt);
  } else if (f >= 290) { // sitting, then lying: legs out in front along the floor
    const out = lerp(0.02, 0.5, seg(f, 292, 318));
    footL = ground(latOf(1, 0.13, out)); footR = ground(latOf(-1, 0.13, out));
  } else if (f < W1[0]) { [footL, footR] = standFeet();
  } else {
    // planted where the walk left them; while bending for the box the pelvis rocks back over them
    const x = f < W2[0] ? W1[3] + 0.02 : W2[3] + 0.02;
    footL = ground([x, 0, LAT.z * 0.1]); footR = ground([x, 0, -LAT.z * 0.1]);
  }
  // ---- arms ----
  const sh = (s: number) => B.toWorld([s * DIM.shoulder[0], DIM.shoulder[1], 0]);
  const rest = (s: number, swing = 0): V3 => { const S = sh(s); return [S[0] + 0.15 * swing + 0.02, S[1] - 0.44, S[2] + LAT.z * s * 0.06]; }; // arm hanging (reach 0.47 of 0.5)
  const boxSide = (s: number): V3 => { const c = new THREE.Vector3(...box.p), l = new THREE.Vector3(1, 0, 0).applyQuaternion(box.q).multiplyScalar(s * BOX / 2); return [c.x + l.x, c.y + l.y, c.z + l.z]; };
  let handL: V3, handR: V3, elbowPole: V3 | undefined;
  const swing = (W: typeof W1) => 0.9 * Math.sin((Math.PI * (px - W[2])) / STRIDE);
  if (f < 96 || (f >= 250 && f < 290)) {
    const sw = walking(W1) ? swing(W1) : 0;
    handL = rest(1, -sw); handR = rest(-1, sw);
  } else if (f < RELEASE) { // reaching for the box, then on its sides until the release
    const k = seg(f, 100, 110);
    handL = lerpV(rest(1), boxSide(1), k); handR = lerpV(rest(-1), boxSide(-1), k);
    elbowPole = [0, -1, 0];
  } else if (f < 250) { // follow-through after the throw, arms come back down
    const k = seg(f, RELEASE, 250), S1 = sh(1), S2 = sh(-1), fw = B.toWorld([0, 0.5, 0.35]);
    handL = lerpV([fw[0], fw[1], S1[2]], rest(1), k); handR = lerpV([fw[0], fw[1], S2[2]], rest(-1), k);
  } else { // sitting: hands on the floor beside him; lying: arms flop out to the sides
    // the hands go down only as far as the arms reach: they meet the floor as he gets low (never stretch)
    const k = seg(f, 318, 345), S1 = sh(1), S2 = sh(-1), k0 = seg(f, 292, 314);
    const sit = (s: number, S: V3): V3 => { const p = lerpV(rest(s), latOf(s, 0.22, -0.06), k0); return [p[0], Math.max(DIM.limbR, S[1] - 0.46), p[2]]; };
    const lieL = ground([S1[0], 0, S1[2] + LAT.z * 0.38]), lieR = ground([S2[0], 0, S2[2] - LAT.z * 0.38]);
    handL = lerpV(sit(1, S1), lieL, k); handR = lerpV(sit(-1, S2), lieR, k);
  }
  const kneePole: V3 | undefined = f >= 290 ? [FWD.x, 0.8, 0] : undefined;
  const kneeOut = 0.25 + 0.75 * (seg(f, 90, 108) - seg(f, 118, 140)); // knees open outward in the squat, round the box
  return { pelvis: B.pelvis, q: B.q, expr: exprAt(f), handL, handR, footL, footR, elbowPole, kneePole, kneeOut };
};

/** camera follow target: the character, widening to include the box while it flies */
export const camTarget = (f: number): V3 => {
  const raw = (g: number): V3 => {
    const c = bodyPose(Math.max(0, Math.min(CHAR_FRAMES - 1, g))).pelvis, b = boxAt(Math.max(0, Math.min(CHAR_FRAMES - 1, g))).p;
    const k = seg(g, 218, 236) - seg(g, 268, 296);
    return [lerp(c[0], (c[0] + b[0]) / 2, k), lerp(0.75, 0.6, k) - 0.3 * seg(g, 300, 345), 0];
  };
  let x = 0, y = 0, n = 0; // 21-frame average: no jerks
  for (let g = f - 10; g <= f + 10; g++) { const r = raw(g); x += r[0]; y += r[1]; n++; }
  return [x / n, y / n, 0];
};
