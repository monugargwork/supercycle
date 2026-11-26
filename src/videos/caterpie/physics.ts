// Rigid-body physics (cannon-es), baked once per render tab at a fixed 240 Hz step and sampled per video frame, so every
// frame is a pure function of the frame number. The S12 water glass: knocked at the table's front edge, it tips off, falls
// 0.74 m to the cobbles, bounces and rolls to rest.
import * as CANNON from "cannon-es";
import { FPS, V3, PZ, KNOCK12 } from "./story";

export type Pose = { p: V3; q: [number, number, number, number] };
const STEP = 1 / 240, SUB = Math.round(1 / FPS / STEP);
export const GLASS_START: V3 = [PZ.t1[0] - 0.12, PZ.table_y + 0.065, PZ.t1[1] + 0.3];
let GLASS: Pose[] | null = null;
const bake = (): Pose[] => {
  const w = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  w.defaultContactMaterial.friction = 0.35; w.defaultContactMaterial.restitution = 0.25;
  (w.solver as CANNON.GSSolver).iterations = 20;
  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() }); ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0); w.addBody(ground);
  // the round table top as a thin static cylinder
  const top = new CANNON.Body({ mass: 0, shape: new CANNON.Cylinder(PZ.table_r, PZ.table_r, 0.03, 24) }); top.position.set(PZ.t1[0], PZ.table_y - 0.015, PZ.t1[1]); w.addBody(top);
  // the glass: 0.25 kg with water, r 4 cm, 13 cm tall; knocked toward the lens (+z) and spun
  const g = new CANNON.Body({ mass: 0.25, shape: new CANNON.Cylinder(0.037, 0.037, 0.13, 14), linearDamping: 0.05, angularDamping: 0.2 });
  g.position.set(...GLASS_START); g.velocity.set(0.25, 0, 1.0); g.angularVelocity.set(7.0, 0, -1.5); w.addBody(g);
  const out: Pose[] = [];
  const rec = () => out.push({ p: [g.position.x, g.position.y, g.position.z], q: [g.quaternion.x, g.quaternion.y, g.quaternion.z, g.quaternion.w] });
  rec(); for (let k = 0; k < 200; k++) { for (let s = 0; s < SUB; s++) w.step(STEP); rec(); }
  return out;
};
/** the glass this frame (S12): standing until the knock, then the baked track */
export const glassAt = (f: number): Pose => {
  if (f < KNOCK12) return { p: GLASS_START, q: [0, 0, 0, 1] };
  GLASS ??= bake();
  return GLASS[Math.min(GLASS.length - 1, f - KNOCK12)];
};
/** where the water lands (first frame the glass is near the ground) */
export const splashAt = (): { f: number; p: V3 } => {
  GLASS ??= bake();
  for (let i = 0; i < GLASS.length; i++) if (GLASS[i].p[1] < 0.06) return { f: KNOCK12 + i, p: [GLASS[i].p[0], 0, GLASS[i].p[2]] };
  return { f: KNOCK12 + 13, p: [GLASS_START[0], 0, GLASS_START[2] + 0.2] };
};
