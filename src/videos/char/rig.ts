// Full-3D stick figure (character test). House rules (docs/restart-notes.md in the supercycle repo):
//  - simple: a bean body, a round head with a hand-drawn face, four limbs;
//  - limbs are plain lines (tubes) with ONE fixed length each: two equal bones (upper/lower), solved by two-bone IK;
//    no hands, no feet; a limb just ends. To reach something the body moves; the limb never stretches;
//  - the face is 2D artwork painted on the head sphere and swapped per expression.
import * as THREE from "three";
import { NOINK } from "../gps/ink";

export type V3 = [number, number, number];
export type Expr = "smile" | "effort" | "happy" | "tired" | "look";

export const DIM = {
  bodyH: 0.58, // bean height (pelvis = body bottom centre)
  headR: 0.24,
  headY: 0.8, // head centre above the pelvis (body-local)
  shoulder: [0.155, 0.42, 0] as V3,
  hip: [0.075, 0.07, 0] as V3,
  arm: [0.25, 0.25] as [number, number], // upper, lower (fixed)
  leg: [0.31, 0.31] as [number, number],
  limbR: 0.014,
};
export const ARM_LEN = DIM.arm[0] + DIM.arm[1];
export const LEG_LEN = DIM.leg[0] + DIM.leg[1];

const toonGrad = (() => {
  const d = new Uint8Array([90, 170, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat);
  t.minFilter = THREE.NearestFilter; t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
})();
export const toon = (color: THREE.ColorRepresentation, map?: THREE.Texture) =>
  new THREE.MeshToonMaterial({ color, gradientMap: toonGrad, ...(map ? { map } : {}) });

// ---------- the face, painted on an equirectangular canvas (front of the head = u 0.25, v 0.5) ----------
const FACE_W = 1024, FACE_H = 512, PXD = FACE_W / 360; // px per degree
const faceCanvas = (expr: Expr, skin: string, hair: string) => {
  const c = document.createElement("canvas"); c.width = FACE_W; c.height = FACE_H;
  const g = c.getContext("2d")!;
  g.fillStyle = skin; g.fillRect(0, 0, FACE_W, FACE_H);
  // hair cap: everything above ~30 deg latitude, with a soft wave at the brow line
  g.fillStyle = hair; g.beginPath(); g.moveTo(0, 0); g.lineTo(FACE_W, 0);
  for (let x = FACE_W; x >= 0; x -= 8) g.lineTo(x, FACE_H / 2 - 30 * PXD + 6 * Math.sin(x / 40));
  g.closePath(); g.fill();
  g.strokeStyle = "#140f18"; g.lineWidth = 7; g.beginPath();
  for (let x = 0; x <= FACE_W; x += 8) { const y = FACE_H / 2 - 30 * PXD + 6 * Math.sin(x / 40); if (x) g.lineTo(x, y); else g.moveTo(x, y); }
  g.stroke();
  const cx = FACE_W * 0.25, cy = FACE_H / 2, P = (lon: number, lat: number): [number, number] => [cx + lon * PXD, cy - lat * PXD];
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#140f18"; g.fillStyle = "#140f18";
  const line = (pts: [number, number][], w = 7) => { g.lineWidth = w; g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(P(a, b)[0], P(a, b)[1]) : g.moveTo(P(a, b)[0], P(a, b)[1]))); g.stroke(); };
  // glasses: two round rims + bridge
  for (const s of [-1, 1]) { const [x, y] = P(s * 15, 4); g.lineWidth = 6; g.beginPath(); g.ellipse(x, y, 11 * PXD, 10 * PXD, 0, 0, Math.PI * 2); g.stroke(); }
  line([[-4, 5], [4, 5]], 6);
  // eyes
  for (const s of [-1, 1]) {
    const [x, y] = P(s * 15, 4);
    if (expr === "happy" || expr === "tired") { g.lineWidth = 6; g.beginPath(); g.arc(x, y + (expr === "happy" ? 4 : -4), 6 * PXD, expr === "happy" ? Math.PI * 1.1 : Math.PI * 0.1, expr === "happy" ? Math.PI * 1.9 : Math.PI * 0.9); g.stroke(); }
    else if (expr === "effort") line([[s * 21, 6], [s * 10, 3], [s * 21, 0]], 6);
    else { const dx = expr === "look" ? 4 : 0; g.beginPath(); g.ellipse(x + dx * PXD, y, 3 * PXD, 4 * PXD, 0, 0, Math.PI * 2); g.fill(); }
  }
  // brows
  for (const s of [-1, 1]) line(expr === "effort" ? [[s * 24, 20], [s * 8, 16]] : expr === "tired" ? [[s * 24, 16], [s * 8, 19]] : [[s * 24, 19], [s * 8, 20]], 7);
  // mouth
  if (expr === "effort") { const [x, y] = P(0, -18); g.beginPath(); g.ellipse(x, y, 8 * PXD, 3 * PXD, 0, 0, Math.PI * 2); g.fill(); }
  else if (expr === "tired") line([[-7, -19], [0, -17], [7, -19]], 6);
  else { const [x, y] = P(0, -15); g.lineWidth = 6; g.beginPath(); g.arc(x, y, (expr === "happy" ? 10 : 8) * PXD, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }
  // moustache (Kubasta)
  g.fillStyle = "#f4f1ea"; const [mx, my] = P(0, -9); g.beginPath(); g.ellipse(mx, my, 12 * PXD, 2.6 * PXD, 0, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
};

/** bean silhouette (radius, height) revolved round the body axis */
const beanGeo = () => {
  const pts: THREE.Vector2[] = [];
  const H = DIM.bodyH;
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, y = t * H;
    const r = 0.19 * Math.sin(Math.PI * Math.min(1, t * 1.08) ** 0.75) * (1 - 0.22 * t) + 0.002;
    pts.push(new THREE.Vector2(i === 0 || i === 24 ? 0.0001 : r, y));
  }
  return new THREE.LatheGeometry(pts, 40);
};

export type Look = { body: string; skin: string; hair: string; arm: string; leg: string; buttons?: string };
export const KUB: Look = { body: "#8a6a4a", skin: "#f2c4a4", hair: "#f4f1ea", arm: "#4a3a2c", leg: "#3a3446", buttons: "#5e4630" };

const UPV = new THREE.Vector3(0, 1, 0);
/** a tube from a to b (unit cylinder scaled), with a round cap at a */
class Seg {
  mesh: THREE.Mesh; cap: THREE.Mesh;
  constructor(parent: THREE.Object3D, mat: THREE.Material, r: number) {
    this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 12, 1, true), mat);
    this.cap = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), mat);
    for (const m of [this.mesh, this.cap]) { m.layers.set(NOINK); parent.add(m); }
  }
  set(a: THREE.Vector3, b: THREE.Vector3) {
    const d = b.clone().sub(a), L = d.length();
    this.mesh.position.copy(a).addScaledVector(d, 0.5);
    this.mesh.scale.set(1, Math.max(L, 1e-4), 1);
    this.mesh.quaternion.setFromUnitVectors(UPV, d.normalize());
    this.cap.position.copy(a);
  }
}

/** two-bone IK with FIXED bone lengths. Returns joint and end; `short` > 0 when the target is out of reach
 *  (then the limb points at it, fully straight, and falls short: the body must move closer instead). */
export const solve2 = (A: THREE.Vector3, T: THREE.Vector3, L1: number, L2: number, pole: THREE.Vector3) => {
  const v = T.clone().sub(A), dist = v.length(), dir = v.clone().normalize();
  const d = Math.min(Math.max(dist, Math.abs(L1 - L2) + 1e-3), L1 + L2 - 1e-4);
  const a = (L1 * L1 + d * d - L2 * L2) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  const p = pole.clone().addScaledVector(dir, -pole.dot(dir));
  if (p.lengthSq() < 1e-8) p.set(0, 1, 0).addScaledVector(dir, -dir.y);
  p.normalize();
  const J = A.clone().addScaledVector(dir, a).addScaledVector(p, h), E = A.clone().addScaledVector(dir, d);
  return { J, E, short: Math.max(0, dist - (L1 + L2)) };
};

export type Pose = {
  pelvis: V3; // world position of the body bottom centre
  q: THREE.Quaternion; // body orientation (local +y = up the body, +z = facing)
  expr: Expr;
  handL: V3; handR: V3; // where each arm ends (world)
  footL: V3; footR: V3; // where each leg ends (world)
  elbowPole?: V3; kneePole?: V3; // world directions the elbows / knees bend toward (defaults from the body)
  kneeOut?: number; // how far the knees open sideways (0 = straight ahead)
};

export class StickRig {
  root = new THREE.Group();
  body: THREE.Group; head: THREE.Mesh;
  private faces = new Map<Expr, THREE.Texture>();
  private faceMat: THREE.MeshToonMaterial;
  private limbs: { up: Seg; lo: Seg; end: THREE.Mesh }[] = [];
  blob: THREE.Mesh;
  lastShort = 0; // worst reach shortfall of the last pose (m): must stay 0

  constructor(private look: Look = KUB) {
    this.body = new THREE.Group(); this.root.add(this.body);
    const bean = new THREE.Mesh(beanGeo(), toon(look.body)); this.body.add(bean);
    if (look.buttons) for (let i = 0; i < 3; i++) {
      const y = 0.16 + i * 0.11, r = 0.19 * Math.sin(Math.PI * Math.min(1, (y / DIM.bodyH) * 1.08) ** 0.75) * (1 - 0.22 * (y / DIM.bodyH));
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), toon(look.buttons)); b.position.set(0, y, r + 0.002); b.layers.set(NOINK); this.body.add(b);
    }
    for (const e of ["smile", "effort", "happy", "tired", "look"] as Expr[]) this.faces.set(e, faceCanvas(e, look.skin, look.hair));
    this.faceMat = toon("#ffffff", this.faces.get("smile"));
    this.head = new THREE.Mesh(new THREE.SphereGeometry(DIM.headR, 48, 32), this.faceMat);
    this.head.position.set(0, DIM.headY, 0); this.body.add(this.head);
    const armM = toon(look.arm), legM = toon(look.leg);
    for (let i = 0; i < 4; i++) {
      const m = i < 2 ? armM : legM;
      const end = new THREE.Mesh(new THREE.SphereGeometry(DIM.limbR, 12, 8), m); end.layers.set(NOINK); this.root.add(end);
      this.limbs.push({ up: new Seg(this.root, m, DIM.limbR), lo: new Seg(this.root, m, DIM.limbR), end });
    }
    // soft contact shadow (no cast shadows: house rule)
    const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(40,30,50,0.32)"); gr.addColorStop(1, "rgba(40,30,50,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    this.blob.rotation.x = -Math.PI / 2; this.blob.layers.set(NOINK); this.root.add(this.blob);
  }

  /** body-local point -> world, for the current body transform */
  local(p: V3) { return new THREE.Vector3(...p).applyQuaternion(this.body.quaternion).add(this.body.position); }

  pose(P: Pose) {
    this.body.position.set(...P.pelvis); this.body.quaternion.copy(P.q); this.body.updateMatrixWorld();
    this.faceMat.map = this.faces.get(P.expr)!; this.faceMat.needsUpdate = true;
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q), down = new THREE.Vector3(0, -1, 0).applyQuaternion(P.q);
    const side = new THREE.Vector3(1, 0, 0).applyQuaternion(P.q);
    let worst = 0;
    const specs: [V3, V3, [number, number], THREE.Vector3][] = [
      [[DIM.shoulder[0], DIM.shoulder[1], 0], P.handL, DIM.arm, P.elbowPole ? new THREE.Vector3(...P.elbowPole) : down.clone().multiplyScalar(0.3).addScaledVector(fwd, -1).addScaledVector(side, 0.4)],
      [[-DIM.shoulder[0], DIM.shoulder[1], 0], P.handR, DIM.arm, P.elbowPole ? new THREE.Vector3(...P.elbowPole) : down.clone().multiplyScalar(0.3).addScaledVector(fwd, -1).addScaledVector(side, -0.4)],
      [[DIM.hip[0], DIM.hip[1], 0], P.footL, DIM.leg, (P.kneePole ? new THREE.Vector3(...P.kneePole) : fwd.clone()).addScaledVector(side, P.kneeOut ?? 0.25)],
      [[-DIM.hip[0], DIM.hip[1], 0], P.footR, DIM.leg, (P.kneePole ? new THREE.Vector3(...P.kneePole) : fwd.clone()).addScaledVector(side, -(P.kneeOut ?? 0.25))],
    ];
    specs.forEach(([root, tgt, [L1, L2], pole], i) => {
      const A = this.local(root), r = solve2(A, new THREE.Vector3(...tgt), L1, L2, pole);
      worst = Math.max(worst, r.short);
      const l = this.limbs[i]; l.up.set(A, r.J); l.lo.set(r.J, r.E); l.end.position.copy(r.E);
    });
    this.lastShort = worst;
    const s = 0.75 - Math.min(0.35, P.pelvis[1] * 0.3);
    this.blob.position.set(P.pelvis[0], 0.004, P.pelvis[2]); this.blob.scale.set(s, s, 1);
  }
}
