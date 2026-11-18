import * as THREE from "three";
import { poseAt, CHAR_FRAMES } from "../src/videos/char/anim";
import { DIM } from "../src/videos/char/rig";
const bad: string[] = [];
for (let f = 0; f < CHAR_FRAMES; f++) {
  const P = poseAt(f), loc = (p: number[]) => new THREE.Vector3(p[0], p[1], p[2]).applyQuaternion(P.q).add(new THREE.Vector3(...P.pelvis));
  const chk: [string, number[], number[], number][] = [["armL", [DIM.shoulder[0], DIM.shoulder[1], 0], P.handL, 0.5], ["armR", [-DIM.shoulder[0], DIM.shoulder[1], 0], P.handR, 0.5], ["legL", [DIM.hip[0], DIM.hip[1], 0], P.footL, 0.62], ["legR", [-DIM.hip[0], DIM.hip[1], 0], P.footR, 0.62]];
  for (const [n, r, t, L] of chk) { const d = loc(r).distanceTo(new THREE.Vector3(...t)); if (d > L + 0.002) bad.push(`f${f} ${n} ${(d - L).toFixed(3)}`); }
}
console.log(bad.length ? bad.join("\n") : "all limbs within reach");
