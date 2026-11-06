// Rigid-body physics (cannon-es), baked once per render tab at a fixed 240 Hz step and sampled per video frame, so
// every frame is a pure function of the frame number (Remotion renders frames out of order, across tabs).
import * as CANNON from "cannon-es";
import { FPS, V3, LOCK_POP, LOCK_HANG } from "./story";

export type Pose = { p: V3; q: [number, number, number, number] };
type Track = Pose[];
const STEP = 1 / 240, SUB = Math.round(1 / FPS / STEP);

/** run a world from frame f0 for n frames and record each body's pose at every video frame */
const bake = (setup: (w: CANNON.World) => CANNON.Body[], n: number): Track[] => {
  const w = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  w.defaultContactMaterial.friction = 0.45;
  w.defaultContactMaterial.restitution = 0.32;
  (w.solver as CANNON.GSSolver).iterations = 20;
  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
  ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  w.addBody(ground);
  const bodies = setup(w);
  const tracks: Track[] = bodies.map(() => []);
  const rec = () => bodies.forEach((b, i) => tracks[i].push({ p: [b.position.x, b.position.y, b.position.z], q: [b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w] }));
  rec();
  for (let k = 0; k < n; k++) { for (let s = 0; s < SUB; s++) w.step(STEP); rec(); }
  return tracks;
};
const sample = (t: Track, i: number) => t[Math.max(0, Math.min(t.length - 1, i))];

// ---- the padlock hit by the hammer: body + snapped shackle, bouncing off the truck's back and the road ----
let LOCK: Track[] | null = null;
const lockTracks = () => LOCK ??= bake((w) => {
  // the truck's back as a static box so the lock can glance off the bumper
  const truck = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(4.8, 1.5, 1.27)) });
  truck.position.set(-3.12 + 4.8, 0.55 + 1.5, 3.2); w.addBody(truck);
  const bump = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.06, 0.9)) });
  bump.position.set(-3.2, 0.56, 3.2); w.addBody(bump);
  // lock body: 11 x 9 x 4.5 cm brass, ~0.35 kg; shape axes in the lock group's frame (depth x, height y, width z)
  const body = new CANNON.Body({ mass: 0.35, linearDamping: 0.05, angularDamping: 0.12 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(0.0225, 0.045, 0.055)));
  body.addShape(new CANNON.Box(new CANNON.Vec3(0.008, 0.012, 0.009)), new CANNON.Vec3(0, 0.057, 0.034)); // shackle stub
  body.position.set(LOCK_HANG[0] - 0.03, LOCK_HANG[1], LOCK_HANG[2]);
  body.velocity.set(-1.25, 0.9, -0.55);                // the hammer comes in from the thief's side
  body.angularVelocity.set(4.5, -3.0, 9.0);
  // snapped shackle arc: thin steel, ~0.06 kg, flies higher and spins faster
  const sh = new CANNON.Body({ mass: 0.06, linearDamping: 0.05, angularDamping: 0.1 });
  sh.addShape(new CANNON.Box(new CANNON.Vec3(0.009, 0.03, 0.042)), new CANNON.Vec3(0, 0.075, 0));
  sh.position.set(LOCK_HANG[0] - 0.03, LOCK_HANG[1], LOCK_HANG[2]);
  sh.velocity.set(-0.7, 2.2, 0.35);
  sh.angularVelocity.set(-14, 6, 18);
  for (const b of [body, sh]) { b.allowSleep = true; b.sleepSpeedLimit = 0.05; w.addBody(b); }
  return [body, sh];
}, 120);

/** pose of the padlock body / shackle at video frame f (null before the hit) */
export const lockPose = (f: number, which: 0 | 1): Pose | null => (f < LOCK_POP ? null : sample(lockTracks()[which], f - LOCK_POP));
/** where the padlock body ends up on the road (shot 11 frames this) */
export const lockRest = (): V3 => { const t = lockTracks()[0]; return t[t.length - 1].p; };
export const shackleRest = (): V3 => { const t = lockTracks()[1]; return t[t.length - 1].p; };
