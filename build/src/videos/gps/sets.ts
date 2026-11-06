// The sets of the GPS-tracker reel (the PSA street re-dressed as a big-box store, plus living room, police, court), built once: static scenery merged per material (Batch), plus the moving pieces as
// their own objects (truck + roll-up door, pallets, police car, SUV, mailbox door, server LEDs, red button, database
// monitor, shop alarm). Painted textures follow the bridge recipe: flat storybook fills, soft blotches, seams painted in.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "./geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick } from "./paint";
import { Pen } from "./toon";
import { untone } from "./shade";
import { iconSign, monitor, creature, rr as rrect, Kind } from "./art";
import { HOME, OFFICE, SHOP, ALLEY, LIVING, POLICE, COURT, INSERT, CROSS_X, TRACK_SPOT, V3 } from "./story";

// ---------------- painted textures ----------------
const U = (r: () => number, a: number, b: number) => a + (b - a) * r();
const blot = (g: CanvasRenderingContext2D, r: () => number, W: number, H: number, n: number, rgb: string, a: number, s: number) => {
  for (let i = 0; i < n; i++) {
    const x = U(r, 0, W), y = U(r, 0, H), rad = U(r, 0.3, 1) * s, gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - rad, y - rad, 2 * rad, 2 * rad);
  }
};
export const asphalt = (key = "asphalt", base = "#5f5d66") => ctex(key, 1024, 1024, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 1024, 1024);
  blot(g, r, 1024, 1024, 40, "40,38,48", 0.18, 160); blot(g, r, 1024, 1024, 25, "150,145,150", 0.08, 140);
  for (let i = 0; i < 2600; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.18)"; g.fillRect(U(r, 0, 1024), U(r, 0, 1024), 2, 2); }
  g.strokeStyle = "rgba(30,28,36,0.45)"; g.lineWidth = 2;
  for (let i = 0; i < 5; i++) { let x = U(r, 0, 1024), y = U(r, 0, 1024); g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += U(r, -40, 40); y += U(r, 10, 50); g.lineTo(x, y); } g.stroke(); }
});
/** concrete slabs with dark seams every tile (one texture = 2 x 2 slabs) */
export const concrete = (key = "concrete", base = "#d9d1c3") => ctex(key, 512, 512, (g, r) => {
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = jit(r, base, 0.04, 3, 0.1); g.fillRect(i * 256, j * 256, 256, 256); }
  blot(g, r, 512, 512, 18, "120,110,95", 0.08, 90);
  g.fillStyle = "rgba(70,62,58,0.55)";
  for (const k of [0, 256]) { g.fillRect(k, 0, 3, 512); g.fillRect(0, k, 512, 3); }
});
export const stucco = (key: string, base: string) => ctex("stucco" + key, 512, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  blot(g, r, 512, 512, 22, "255,255,255", 0.09, 110); blot(g, r, 512, 512, 18, "110,85,60", 0.06, 110);
  for (let i = 0; i < 900; i++) { g.fillStyle = "rgba(90,70,50,0.08)"; g.fillRect(U(r, 0, 512), U(r, 0, 512), 2, 2); }
});
const glassTex = () => ctex("glass", 256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#9fd0f2"); gr.addColorStop(1, "#3f78b4");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath(); g.moveTo(40, 256); g.lineTo(110, 256); g.lineTo(220, 0); g.lineTo(150, 0); g.fill();
  g.beginPath(); g.moveTo(140, 256); g.lineTo(160, 256); g.lineTo(256, 30); g.lineTo(256, 0); g.fill();
  g.fillStyle = "rgba(30,40,60,0.6)"; g.fillRect(0, 0, 256, 6); g.fillRect(0, 250, 256, 6); g.fillRect(0, 0, 6, 256); g.fillRect(250, 0, 6, 256);
});
const ribbed = () => ctex("rollup", 256, 256, (g) => {
  g.fillStyle = "#c7cbd2"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) { g.fillStyle = "rgba(60,64,76,0.45)"; g.fillRect(0, y, 256, 3); g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(0, y + 3, 256, 2); }
});
const truckSide = () => ctex("truckSide", 1024, 512, (g, r) => {
  g.fillStyle = "#f4f2ee"; g.fillRect(0, 0, 1024, 512);
  blot(g, r, 1024, 512, 10, "150,140,130", 0.07, 160);
  g.fillStyle = "#2f7fbf"; g.fillRect(0, 330, 1024, 46); g.fillStyle = "#f2a33a"; g.fillRect(0, 388, 1024, 18);
  g.fillStyle = "rgba(60,60,70,0.35)"; for (let x = 0; x < 1024; x += 128) g.fillRect(x, 0, 3, 512);
  g.fillStyle = "rgba(60,60,70,0.5)"; g.fillRect(0, 0, 1024, 5); g.fillRect(0, 507, 1024, 5);
});
const cardboard = () => ctex("cardboard", 256, 256, (g, r) => {
  g.fillStyle = "#c99a62"; g.fillRect(0, 0, 256, 256); blot(g, r, 256, 256, 8, "90,60,30", 0.08, 70);
  g.fillStyle = "#e9d7a8"; g.fillRect(112, 0, 32, 256); g.fillStyle = "rgba(90,60,30,0.5)"; g.fillRect(0, 0, 256, 4); g.fillRect(0, 0, 4, 256);
});
const tiles = () => ctex("tiles", 512, 512, (g, r) => {
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = jit(r, (i + j) % 2 ? "#c9d1d9" : "#d6dde4", 0.03, 2, 0.1); g.fillRect(i * 128, j * 128, 128, 128); }
  g.fillStyle = "rgba(70,80,95,0.5)"; for (let k = 0; k < 512; k += 128) { g.fillRect(k, 0, 3, 512); g.fillRect(0, k, 512, 3); }
});
const rackTex = () => ctex("rack", 256, 512, (g) => {
  g.fillStyle = "#2b313d"; g.fillRect(0, 0, 256, 512);
  for (let y = 16; y < 512; y += 40) {
    g.fillStyle = "#3a4252"; g.fillRect(14, y, 228, 30);
    g.fillStyle = "#1c2129"; for (let x = 24; x < 170; x += 10) g.fillRect(x, y + 8, 5, 14);
    g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(14, y, 228, 3);
  }
  g.fillStyle = "#151920"; g.fillRect(0, 0, 10, 512); g.fillRect(246, 0, 10, 512);
});
const siding = (key: string, base: string) => ctex("siding" + key, 512, 512, (g, r) => {
  for (let y = 0; y < 512; y += 32) { g.fillStyle = jit(r, base, 0.03, 2, 0.08); g.fillRect(0, y, 512, 32); g.fillStyle = "rgba(40,50,70,0.35)"; g.fillRect(0, y + 29, 512, 3); g.fillStyle = "rgba(255,255,255,0.2)"; g.fillRect(0, y, 512, 2); }
});
const carpet = () => ctex("carpet", 256, 256, (g, r) => { g.fillStyle = "#9c2f3a"; g.fillRect(0, 0, 256, 256); blot(g, r, 256, 256, 12, "60,10,20", 0.12, 60); });
/** lit storefront lettering on a transparent canvas (plain bold type, not a logo) */
const letters = (big: string, small: string, col: string) => ctex("letters" + big + small, 1600, 200, (g) => {
  g.fillStyle = col; g.textBaseline = "middle";
  let x = 40;
  if (big) { g.font = "900 150px Arial Black, Arial, sans-serif"; g.fillText(big, x, 104); x += g.measureText(big).width + 40; }
  g.font = `700 ${big ? 78 : 110}px Arial, sans-serif`;
  const w = g.measureText(small).width;
  if (!big) x = (1600 - w) / 2;
  g.fillText(small, x, 108);
});
const signTex = (kind: "slab" | "laptop" | "gavel", bg: string) => ctex("sign" + kind + bg, 600, 300, (g) => iconSign(new Pen(g), kind, bg));
const trunkTex = () => ctex("palmTrunk", 128, 256, (g) => {
  g.fillStyle = "#a07850"; g.fillRect(0, 0, 128, 256);
  for (let y = 0; y < 256; y += 22) { g.fillStyle = "rgba(70,45,25,0.5)"; g.fillRect(0, y, 128, 5); g.fillStyle = "rgba(255,230,190,0.18)"; g.fillRect(0, y + 6, 128, 3); }
});

// ---------------- materials ----------------
const M = {
  asphalt: () => lam("asphalt", () => ({ map: rep(asphalt(), 1, 1) })),
  lot: () => lam("lot", () => ({ map: asphalt("lotA", "#8a8790") })),
  walk: () => lam("walk", () => ({ map: concrete() })),
  curb: () => lam("curb", () => ({ color: "#e6e0d4" })),
  white: () => lam("white", () => ({ color: "#f3f1ec" })),
  dark: () => lam("dark", () => ({ color: "#2c2a33" })),
  tyre: () => lam("tyre", () => ({ color: "#26242b" })),
  hub: () => lam("hub", () => ({ color: "#b9bec6" })),
  glass: () => lam("glass", () => ({ map: glassTex() })),
  line: () => lam("line", () => ({ color: "#f1e9cf" })),
  yline: () => lam("yline", () => ({ color: "#f2c84a" })),
  wood: () => lam("wood", () => ({ map: beam() })),
  leaf: () => { const m = lam("leaf", () => ({ color: "#4fa548", side: THREE.DoubleSide })); return m; },
  leaf2: () => lam("leaf2", () => ({ color: "#3d8f45", side: THREE.DoubleSide })),
  bush: () => lam("bush", () => ({ color: "#5aa64a" })),
  trunk: () => lam("trunk", () => ({ map: trunkTex() })),
  pole: () => lam("pole", () => ({ color: "#5b6170" })),
};
const sign = (tex: THREE.Texture) => new THREE.MeshBasicMaterial({ map: tex, toneMapped: true });

/** cached two-tone Lambert colour (for the separate meshes that are not batched) */
const twoToneLam = (col: string) => lam("tt" + col, () => ({ color: col }));

// ---------------- small builders ----------------
const box = (b: Batch, m: THREE.Material, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, tile = 0) =>
  b.add(boxGeo(V(Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)), V(Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)), tile), m);
const up = (b: Batch, m: THREE.Material, x0: number, x1: number, z0: number, z1: number, y: number, tile: number) =>
  b.add(quad(V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0), (x1 - x0) / tile, (z1 - z0) / tile), m);
const cyl = (b: Batch, m: THREE.Material, x: number, y: number, z: number, r0: number, r1: number, h: number, seg = 14, rot?: THREE.Euler) => {
  const g = new THREE.CylinderGeometry(r1, r0, h, seg); g.translate(0, h / 2, 0);
  const mx = new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromEuler(rot ?? new THREE.Euler()), V(1, 1, 1));
  b.add(g, m, mx);
};
const sph = (b: Batch, m: THREE.Material, x: number, y: number, z: number, r: number, sy = 1) => {
  const g = new THREE.SphereGeometry(r, 16, 12); g.scale(1, sy, 1); g.translate(x, y, z); b.add(g, m);
};
const bush = (b: Batch, x: number, y: number, z: number, s = 1) => {
  for (const [dx, dy, dz, r] of [[0, 0.45, 0, 0.6], [0.5, 0.35, 0.15, 0.45], [-0.48, 0.38, -0.1, 0.48], [0.1, 0.75, -0.1, 0.42]]) sph(b, M.bush(), x + dx * s, y + dy * s, z + dz * s, r * s);
};
/** palm: curved ringed trunk + 9 arching fronds (double-sided ribbons) */
const palm = (b: Batch, x: number, y: number, z: number, h: number, seed = 1) => {
  const lean = 0.25 + 0.2 * Math.sin(seed * 3.1), dir = seed * 1.7;
  const n = 6, pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push(V(x + Math.cos(dir) * lean * u * u * h * 0.25, y + h * u, z + Math.sin(dir) * lean * u * u * h * 0.25)); }
  for (let i = 0; i < n; i++) {
    const a = pts[i], c = pts[i + 1], r0 = 0.24 - 0.09 * (i / n), r1 = 0.24 - 0.09 * ((i + 1) / n);
    const g = new THREE.CylinderGeometry(r1, r0, a.distanceTo(c), 10); g.translate(0, a.distanceTo(c) / 2, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), c.clone().sub(a).normalize());
    b.add(g, M.trunk(), new THREE.Matrix4().compose(a, q, V(1, 1, 1)));
  }
  const top = pts[n];
  sph(b, M.trunk(), top.x, top.y, top.z, 0.32, 0.8);
  for (let k = 0; k < 9; k++) {
    const az = (k / 9) * Math.PI * 2 + seed, L = 3.0 + 0.5 * Math.sin(k * 2.3 + seed), lift = 0.55 + 0.25 * Math.sin(k * 1.7);
    const S = 10, pos: number[] = [], idx: number[] = [];
    for (let i = 0; i <= S; i++) {
      const u = i / S, d = L * u, yy = lift * Math.sin(Math.PI * u * 0.8) * 1.6 - 1.7 * u * u, w = 0.42 * Math.sin(Math.PI * Math.min(1, u * 1.15)) + 0.02;
      const cx = top.x + Math.cos(az) * d, cz = top.z + Math.sin(az) * d, px = -Math.sin(az) * w, pz = Math.cos(az) * w;
      pos.push(cx + px, top.y + yy + 0.05 * w, cz + pz, cx - px, top.y + yy + 0.05 * w, cz - pz);
      if (i) { const o = (i - 1) * 2; idx.push(o, o + 2, o + 1, o + 1, o + 2, o + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    b.add(g, k % 2 ? M.leaf() : M.leaf2());
  }
};
const lamp = (b: Batch, x: number, y: number, z: number, armDir: number) => {
  cyl(b, M.pole(), x, y, z, 0.09, 0.07, 6.2, 10);
  box(b, M.pole(), x, y + 6.0, z - 0.05, x + armDir * 1.6, y + 6.12, z + 0.05);
  box(b, M.dark(), x + armDir * 1.3, y + 5.75, z - 0.2, x + armDir * 1.9, y + 6.0, z + 0.2);
};
/** parked car along x: centre (x, z), colour, heading sign */
const car = (b: Batch, x: number, z: number, col: string) => {
  const m = lam("car" + col, () => ({ color: col }));
  box(b, m, x - 2.2, 0.35, z - 0.9, x + 2.2, 1.05, z + 0.9);
  box(b, m, x - 1.2, 1.05, z - 0.82, x + 0.9, 1.6, z + 0.82);
  box(b, M.glass(), x - 1.1, 1.08, z - 0.84, x + 0.8, 1.52, z + 0.84);
  for (const dx of [-1.4, 1.4]) for (const dz of [-0.85, 0.85]) cyl(b, M.tyre(), x + dx, 0.36, z + dz - 0.12 * Math.sign(dz), 0.36, 0.36, 0.24, 14, new THREE.Euler(Math.PI / 2, 0, 0));
};
const wheels = (b: Batch, xs: number[], zs: number[], r: number) => {
  for (const x of xs) for (const z of zs) {
    cyl(b, M.tyre(), x, r, z - 0.16, r, r, 0.32, 16, new THREE.Euler(Math.PI / 2, 0, 0));
    cyl(b, M.hub(), x, r, z + Math.sign(z) * 0.18 - 0.03, r * 0.45, r * 0.45, 0.06, 12, new THREE.Euler(Math.PI / 2, 0, 0));
  }
};

/** x offset of the grading facility group */
export const FAC_X = 10;

export type Sets = {
  groups: Record<string, THREE.Group>;
  truck: THREE.Group; door: THREE.Mesh; pallets: THREE.Group; palletB: THREE.Group; jack: THREE.Mesh;
  police: THREE.Group; policeLights: [THREE.MeshBasicMaterial, THREE.MeshBasicMaterial];
  suv: THREE.Group; mailDoor: THREE.Object3D;
  leds: THREE.InstancedMesh; ledCount: number; button: THREE.MeshBasicMaterial; screen: { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string };
  alarm: THREE.MeshBasicMaterial;
  boxFlaps: THREE.Group;
  /** the padlock on the truck: body (with the left shackle stub) and the snapped-off shackle arc */
  lock: THREE.Group; shackle: THREE.Group;
  board: { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string }; clock: { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string };
  tugChair: THREE.Group; tracker: THREE.Group; led: THREE.MeshBasicMaterial; drawer: THREE.Group; hotBox: THREE.Group;
};

// ---------------- the sets ----------------
export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };

  // ===== STREET (origin) =====
  const street = G("street", [0, 0, 0]);
  let b = new Batch();
  up(b, M.asphalt(), -260, 260, -6, 6, 0, 8);
  for (const s of [-1, 1]) {
    const zc = s * 6, zw = s * 11;
    box(b, M.curb(), -260, 0, Math.min(zc, zc + s * 0.25), 260, 0.15, Math.max(zc, zc + s * 0.25));
    up(b, M.walk(), -260, 260, Math.min(zc + s * 0.25, zw), Math.max(zc + s * 0.25, zw), 0.15, 3);
    up(b, M.lot(), -260, 260, Math.min(zw, s * 300), Math.max(zw, s * 300), 0.14, 10);
  }
  for (let x = -250; x < 250; x += 6) box(b, M.line(), x, 0.005, -0.08, x + 3, 0.012, 0.08);
  // grading facility, rebuilt from the reference photo: single-storey retail units; the grading unit (x -16..0) has a
  // red wrap-around fascia with plain white lettering, a black frame and a full-height black-mullioned glass front,
  // a low hedge, a lawn strip with a floodlight and a walkway to the door; a white "cards & collectibles" unit next door.
  // Built in its own group shifted +10 m in x, so the red sign sits right behind the parked truck (frame.io note, 7.4 s).
  const facG = new THREE.Group(); facG.position.x = FAC_X; street.add(facG);
  const fb = new Batch();
  const blackP = lam("facBlack", () => ({ color: "#2a2930" })), redF = new THREE.MeshBasicMaterial({ color: untone("#1f63b6") }), whiteF = lam("facWhite", () => ({ color: "#f1eee8" }));
  box(fb, blackP, -16, 0.15, 13.6, 0, 5.9, 27);
  box(fb, lam("nbWall", () => ({ color: "#3a3940" })), -30, 0.15, 13.6, -16, 5.9, 27);
  box(fb, lam("fac", () => ({ map: rep(stucco("fac", "#e6d6bc"), 1, 1) })), 0.4, 0.15, 13.6, 24, 5.4, 27, 4);
  box(fb, redF, -16, 4.2, 12.9, 0.4, 5.95, 13.6);      // fascia front
  box(fb, redF, -0.2, 4.2, 12.9, 0.4, 5.95, 19);        // fascia return around the corner
  box(fb, whiteF, -30, 4.2, 13.0, -16.02, 5.8, 13.6);
  for (const [x0, x1] of [[-15, -0.6], [-29, -16.8]]) {
    box(fb, M.glass(), x0, 0.55, 13.5, x1, 4.15, 13.58);
    box(fb, M.dark(), x0, 0.15, 13.45, x1, 0.6, 13.6);
    const n = Math.round((x1 - x0) / 1.75);
    for (let k = 0; k <= n; k++) { const x = x0 + ((x1 - x0) * k) / n; box(fb, M.dark(), x - 0.05, 0.55, 13.42, x + 0.05, 4.15, 13.56); }
    box(fb, M.dark(), x0, 2.95, 13.42, x1, 3.05, 13.56); box(fb, M.dark(), x0, 4.1, 13.42, x1, 4.2, 13.56);
  }
  box(fb, M.dark(), -3.7, 0.15, 13.4, -3.6, 2.95, 13.56); box(fb, M.dark(), -2.1, 0.15, 13.4, -2.0, 2.95, 13.56); // door frame
  for (const x of [1.5, 6.5, 11.5, 16.5, 21]) box(fb, M.glass(), x, 1.2, 13.52, x + 2.6, 3.4, 13.62);
  up(fb, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), -30, 24, 11, 13.6, 0.16, 5);
  up(fb, M.walk(), -3.7, -2.0, 11, 13.6, 0.17, 1.6);
  for (let x = -15; x < -4; x += 0.55) sph(fb, lam("hedge", () => ({ color: "#3f7a3c" })), x, 0.42, 13.15, 0.42, 0.75);
  for (let x = -1.6; x < -0.4; x += 0.55) sph(fb, lam("hedge", () => ({ color: "#3f7a3c" })), x, 0.42, 13.15, 0.42, 0.75);
  box(fb, M.dark(), -13.4, 0.16, 11.7, -13.0, 0.42, 12.0); // floodlight
  fb.build(facG);
  for (const [tex, col, x, w] of [[letters("Walmart", "Supercenter", "#ffffff"), "w", -8, 9.6], [letters("", "PHARMACY", "#1f63b6"), "r", -23, 9.6]] as const) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.4, color: col === "w" ? new THREE.Color(1.15, 1.15, 1.15) : new THREE.Color(1, 1, 1) }));
    m.position.set(x, 5.07, col === "w" ? 12.88 : 12.98); m.rotation.y = Math.PI; m.layers.set(3); facG.add(m);
  }
  // shops across the road (front faces z = -13): marketplace (laptop) and auction house (gavel)
  box(b, lam("mkt", () => ({ map: rep(stucco("mkt", "#f4c7a0"), 1, 1) })), -16, 0.15, -25, -4, 6, -13, 4);
  box(b, M.glass(), -14.5, 0.15, -13.02, -5.5, 3.0, -12.9);
  box(b, lam("awnT", () => ({ color: "#2aa39a" })), -15, 3.2, -12.9, -5, 3.5, -11.4);
  box(b, lam("auc", () => ({ map: rep(stucco("auc", "#e4d7bd"), 1, 1) })), 2, 0.15, -25, 16, 7, -13, 4);
  box(b, lam("aucTop", () => ({ color: "#c7b28e" })), 1.7, 7, -25.3, 16.3, 7.6, -12.6);
  box(b, lam("aucDoor", () => ({ color: "#6e4a30" })), 7.6, 0.15, -13.03, 10.4, 3.2, -12.92);
  for (const x of [4, 6.6, 11.4, 14]) cyl(b, M.white(), x, 0.15, -12.3, 0.3, 0.26, 5.6);
  box(b, M.white(), 3.4, 5.75, -12.8, 14.6, 6.2, -11.8);
  // background blocks, hills
  const bgCols = ["#d9c7a6", "#c9d6df", "#e6c3b0", "#d3d0c2", "#bfcbb4"];
  for (let i = 0; i < 18; i++) {
    const s = i % 2 ? 1 : -1, x = -120 + (i >> 1) * 28 + (i % 3) * 5, z = s * (34 + (i % 4) * 9), h = 5 + ((i * 7) % 9), w = 10 + ((i * 5) % 8);
    if (z > 0 && x + w > CROSS_X - 8 && x < CROSS_X + 8) continue; // the cross road runs here
    box(b, lam("bg" + (i % 5), () => ({ map: rep(stucco("bg" + (i % 5), bgCols[i % 5]), 1, 1) })), x, 0.14, z - 5, x + w, h, z + 5, 4);
  }
  for (let i = 0; i < 9; i++) {
    const g = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(70 + (i % 3) * 25, 22 + (i % 4) * 7, 40);
    g.translate(-260 + i * 65, 0, (i % 2 ? 1 : -1) * 230);
    b.add(g, lam("hill" + (i % 2), () => ({ color: i % 2 ? "#b8a674" : "#8fae6a" })));
  }
  for (const [x, z, h, s] of [[-30, 9.3, 9, 1], [-16, 9.4, 8.5, 2], [11, 9.3, 9.5, 3], [27, 9.4, 8.8, 4], [-26, -9.4, 9, 5], [-9, -9.3, 8.4, 6], [19, -9.4, 9.2, 7], [44, 9.3, 9, 8], [-46, -9.3, 8.5, 9]] as const) palm(b, x, 0.15, z, h, s);
  for (const x of [-40, -19, 32]) lamp(b, x, 0.15, 10.3, -1);
  for (const x of [-34, 12, 38]) lamp(b, x, 0.15, -10.3, 1);
  car(b, -24, 5.05, "#d7463e"); car(b, 21, 5.05, "#3f78c4"); car(b, 33, 5.05, "#e8c34a");
  car(b, -31, -5.05, "#7bb35a"); car(b, -42, -5.05, "#e7e2d8"); car(b, 30, -5.05, "#8a5ac9");
  // cross road (the aerial left turn), dashed centre line
  up(b, M.asphalt(), CROSS_X - 6, CROSS_X + 6, 6, 200, 0.155, 8);
  for (let z = 8; z < 200; z += 6) box(b, M.line(), CROSS_X - 0.08, 0.16, z, CROSS_X + 0.08, 0.167, z + 3);
  // overnight campers in front of the store: tents (pyramid + dome), camping chairs, a cooler
  const tentCols = ["#e2453c", "#2f7fbf", "#f2c84a", "#3f9a55", "#f08a3c"];
  ([[-4.6, 12.0, 0], [-1.6, 12.1, 1], [1.5, 11.9, 2], [4.3, 12.2, 3]] as const).forEach(([x, z, k]) => {
    const tm = lam("tent" + k, () => ({ color: tentCols[k] }));
    if (k % 2 === 0) { const g = new THREE.ConeGeometry(1.15, 1.35, 4); g.rotateY(Math.PI / 4); g.translate(x, 0.15 + 0.675, z); b.add(g, tm); box(b, M.dark(), x - 0.28, 0.15, z - 0.83, x + 0.28, 0.85, z - 0.8); }
    else { sph(b, tm, x, 0.15, z, 1.05, 0.72); box(b, M.dark(), x - 0.3, 0.15, z - 1.03, x + 0.3, 0.7, z - 0.98); }
  });
  for (const [x, z, k] of [[-3.0, 10.4, 0], [0.0, 10.5, 1], [3.0, 10.3, 2]] as const) {
    const cm = lam("chair" + k, () => ({ color: tentCols[(k + 2) % 5] }));
    box(b, cm, x - 0.28, 0.55, z - 0.25, x + 0.28, 0.6, z + 0.25); box(b, cm, x - 0.28, 0.6, z + 0.22, x + 0.28, 1.1, z + 0.27);
    for (const dx of [-0.25, 0.25]) for (const dz of [-0.22, 0.22]) box(b, M.pole(), x + dx - 0.02, 0.15, z + dz - 0.02, x + dx + 0.02, 0.58, z + dz + 0.02);
  }
  box(b, lam("cooler", () => ({ color: "#3f8fd0" })), 1.0, 0.15, 10.9, 1.6, 0.55, 11.3); box(b, M.white(), 0.98, 0.55, 10.88, 1.62, 0.62, 11.32);
  // temperature board on a pole (store sign style), face toward the street
  box(b, M.pole(), -6.06, 0.15, 11.56, -5.94, 3.9, 11.68);
  box(b, M.dark(), -7.25, 3.9, 11.52, -4.75, 5.25, 11.72);
  // the inserts' plinths: a wooden desk top far off the street (route sheet at 0, phone maps at 40 and 80)
  for (const ox of [0, 40, 80]) box(b, lam("deskTop", () => ({ color: "#b07a4a" })), INSERT[0] + ox - 2, 0.14, INSERT[2] - 2, INSERT[0] + ox + 2, INSERT[1], INSERT[2] + 2);
  b.build(street);
  const boardCv = document.createElement("canvas"); boardCv.width = 512; boardCv.height = 256;
  const boardTex = new THREE.CanvasTexture(boardCv); boardTex.colorSpace = THREE.SRGBColorSpace;
  const boardM = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.15), new THREE.MeshBasicMaterial({ map: boardTex, color: new THREE.Color(1.6, 1.6, 1.6) }));
  boardM.position.set(-6.0, 4.575, 11.5); boardM.rotation.y = Math.PI; street.add(boardM);
  // the tug-of-war chair (moves) and the tracker (a matchbox-sized box with a green LED)
  const tugChair = new THREE.Group(); street.add(tugChair);
  { const bb = new Batch(), cm = lam("chairTug", () => ({ color: "#7b5ac9" }));
    box(bb, cm, -0.28, 0.4, -0.25, 0.28, 0.45, 0.25); box(bb, cm, -0.28, 0.45, 0.22, 0.28, 0.95, 0.27);
    for (const dx of [-0.25, 0.25]) for (const dz of [-0.22, 0.22]) box(bb, M.pole(), dx - 0.02, 0, dz - 0.02, dx + 0.02, 0.43, dz + 0.02);
    bb.build(tugChair); }
  const tracker = new THREE.Group(); street.add(tracker);
  tracker.add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.05), twoToneLam("#1f1d24")));
  const ledMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.1, 0.5, 0.15) });
  tracker.add(new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.008).translate(0.03, -0.013, 0.0), ledMat));
  tracker.position.set(...TRACK_SPOT);
  for (const [tex, x, y, z, w, h, ry] of [[signTex("laptop", "#2aa39a"), -10, 4.6, -12.88, 4.2, 2.1, 0], [signTex("gavel", "#f3e3c3"), 9, 6.6, -11.75, 3.4, 1.7, 0]] as const) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), sign(tex)); m.position.set(x, y, z); m.rotation.y = ry; street.add(m);
  }

  // ---- truck (moving group; local x along its length, rear face at x = -3) ----
  const truck = new THREE.Group(); street.add(truck);
  b = new Batch();
  const tside = lam("tside", () => ({ map: truckSide() })), inner = lam("tin", () => ({ color: "#8d8a86" })), cab = lam("cab", () => ({ color: "#f4f2ee" }));
  box(b, tside, -3, 0.95, 1.95, 3.6, 3.8, 2.05); box(b, tside, -3, 0.95, 4.35, 3.6, 3.8, 4.45);
  box(b, M.white(), -3, 3.7, 1.95, 3.6, 3.85, 4.45); box(b, M.white(), 3.5, 0.95, 1.95, 3.6, 3.8, 4.45);
  box(b, inner, -2.95, 0.9, 2.05, 3.5, 0.98, 4.35);
  box(b, inner, -2.9, 0.98, 2.06, 3.5, 3.69, 2.1); box(b, inner, -2.9, 0.98, 4.3, 3.5, 3.69, 4.34);
  box(b, M.dark(), -3.12, 0.9, 1.9, -2.98, 3.88, 2.06); box(b, M.dark(), -3.12, 0.9, 4.34, -2.98, 3.88, 4.5); box(b, M.dark(), -3.12, 3.7, 1.9, -2.98, 3.88, 4.5);
  box(b, M.dark(), -3.15, 0.55, 1.95, 3.7, 0.95, 4.45);
  box(b, M.dark(), -3.3, 0.5, 2.3, -3.1, 0.62, 4.1); // bumper
  box(b, cab, 3.75, 0.6, 2.0, 6.0, 3.0, 4.4); box(b, cab, 6.0, 0.6, 2.0, 6.45, 1.8, 4.4);
  box(b, M.glass(), 5.3, 1.85, 2.0, 6.02, 2.85, 4.4); box(b, M.glass(), 4.0, 1.9, 1.98, 5.25, 2.75, 4.42);
  box(b, lam("tstripe", () => ({ color: "#2f7fbf" })), 3.75, 1.2, 1.98, 6.46, 1.45, 4.42);
  box(b, M.dark(), 6.4, 0.6, 2.2, 6.55, 1.0, 4.2);
  wheels(b, [-1.7, 2.2, 5.0], [1.95, 4.45], 0.5);
  b.build(truck);
  const door = new THREE.Mesh(boxGeo(V(-3.06, 0, 2.06), V(-3.0, 1, 4.34)), lam("rollup", () => ({ map: rep(ribbed(), 1, 2) })));
  door.castShadow = door.receiveShadow = true; truck.add(door);

  // ---- pallets (two, each 2 layers x 4 boxes) + pallet jack handle ----
  const pallets = new THREE.Group(); street.add(pallets);
  const palletB = new THREE.Group(); pallets.add(palletB);
  const cb = lam("cardboard", () => ({ map: cardboard() })), wrap = lam("wrap", () => ({ color: "#b7c6cf" }));
  for (const px of [0, 1.35]) {
    b = new Batch();
    box(b, M.wood(), px - 0.6, 0, -0.5, px + 0.6, 0.15, 0.5);
    for (let l = 0; l < 2; l++) for (const [dx, dz] of [[-0.29, -0.24], [0.29, -0.24], [-0.29, 0.24], [0.29, 0.24]]) {
      box(b, cb, px + dx - 0.27, 0.15 + l * 0.6, dz - 0.23, px + dx + 0.27, 0.15 + l * 0.6 + 0.58, dz + 0.23);
    }
    box(b, wrap, px - 0.61, 1.33, -0.51, px + 0.61, 1.35, 0.51);
    b.build(px === 0 ? pallets : palletB);
  }
  const boxFlaps = new THREE.Group(); // (kept empty: every box stays closed)
  // ---- padlock: brass body + steel shackle, front faces the road side (-x); hangs from a staple on the rear sill ----
  const brass = twoToneLam("#d9a93c"), brassDk = twoToneLam("#a8781f"), steel = twoToneLam("#b9bec6"), keyM = new THREE.MeshLambertMaterial({ color: "#2a2228" });
  const lock = new THREE.Group(); street.add(lock);
  const lockIn = new THREE.Group(); lockIn.rotation.y = -Math.PI / 2; lock.add(lockIn); // local +z (front) -> world -x
  lockIn.add(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.045), brass));
  for (const y of [-0.047, 0.047]) lockIn.add(new THREE.Mesh(new THREE.BoxGeometry(0.116, 0.008, 0.05).translate(0, y, 0), brassDk));
  lockIn.add(new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.006, 12).rotateX(Math.PI / 2).translate(0, 0.006, 0.0235), keyM));
  lockIn.add(new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.018, 0.006).translate(0, -0.008, 0.0235), keyM));
  lockIn.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.02, 10).translate(-0.034, 0.055, 0), steel)); // stub of the left leg
  const shackle = new THREE.Group(); street.add(shackle);
  const shIn = new THREE.Group(); shIn.rotation.y = -Math.PI / 2; shackle.add(shIn);
  shIn.add(new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.0085, 8, 20, Math.PI).translate(0, 0.088, 0), steel));
  shIn.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.044, 10).translate(0.034, 0.066, 0), steel));
  shIn.add(new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.022, 10).translate(-0.034, 0.077, 0), steel));
  for (const g of [lock, shackle]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8).translate(0, 0.75, 0), lam("jack", () => ({ color: "#d8322f" })));
  pallets.add(jack);

  // ---- police car + SUV ----
  const policeCar = new THREE.Group(); street.add(policeCar);
  b = new Batch();
  const pw = M.white(), pk = lam("pblack", () => ({ color: "#1f2233" }));
  box(b, pk, -2.3, 0.4, -0.92, 2.3, 1.05, 0.92); box(b, pw, -1.0, 0.55, -0.94, 1.1, 1.0, 0.94);
  box(b, pw, -1.2, 1.05, -0.84, 0.95, 1.62, 0.84); box(b, M.glass(), -1.1, 1.08, -0.86, 0.85, 1.55, 0.86);
  box(b, M.dark(), -0.5, 1.62, -0.6, 0.5, 1.7, 0.6);
  wheels(b, [-1.45, 1.45], [-0.88, 0.88], 0.36);
  b.build(policeCar);
  const red = new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.25, 0.2) }), blue = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.5, 3.2) });
  for (const [m, z0, z1] of [[red, -0.58, 0], [blue, 0, 0.58]] as const) { const mesh = new THREE.Mesh(boxGeo(V(-0.4, 1.7, z0), V(0.4, 1.86, z1)), m); policeCar.add(mesh); }
  const suv = new THREE.Group(); street.add(suv);
  b = new Batch();
  const sk = lam("suv", () => ({ color: "#23232b" }));
  box(b, sk, -2.4, 0.5, -1.0, 2.4, 1.4, 1.0); box(b, sk, -2.4, 1.4, -0.95, 1.2, 2.15, 0.95);
  box(b, M.glass(), -2.2, 1.45, -0.97, 1.1, 2.05, 0.97); box(b, M.glass(), 1.0, 1.42, -0.85, 1.25, 2.08, 0.85);
  box(b, M.hub(), 2.38, 0.7, -0.75, 2.45, 1.0, 0.75);
  wheels(b, [-1.5, 1.5], [-0.95, 0.95], 0.42);
  b.build(suv);

  // ===== HOME =====
  const home = G("home", HOME);
  b = new Batch();
  up(b, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), -60, 60, -40, 6, 0, 5);
  up(b, M.walk(), -60, 60, 6, 8.5, 0.02, 3); up(b, M.asphalt(), -60, 60, 8.5, 20, 0.0, 8); up(b, M.walk(), -60, 60, 20, 23, 0.02, 3);
  up(b, M.walk(), -0.8, 0.8, -1.0, 6, 0.015, 1.6);
  const sid = lam("siding", () => ({ map: rep(siding("blue", "#9cc6e4"), 1, 1) }));
  box(b, sid, -7, 0, -14, 7, 4.6, -4, 4);
  const roofM = lam("roofH", () => ({ map: rep(roofHD("#b85a42"), 2, 2) }));
  b.add(quad(V(-7.5, 4.6, -3.4), V(7.5, 4.6, -3.4), V(7.5, 7.0, -9), V(-7.5, 7.0, -9), 3, 1.2), roofM);
  b.add(quad(V(7.5, 4.6, -14.6), V(-7.5, 4.6, -14.6), V(-7.5, 7.0, -9), V(7.5, 7.0, -9), 3, 1.2), roofM);
  b.add(tri(V(-7, 4.6, -4), V(-7, 7.0, -9), V(-7, 4.6, -14)), sid);
  b.add(tri(V(7, 4.6, -4), V(7, 4.6, -14), V(7, 7.0, -9)), sid);
  box(b, M.white(), -3.6, 0, -4, 3.6, 0.45, -1.6); box(b, M.white(), -1.1, 0, -1.6, 1.1, 0.22, -1.0);
  for (const x of [-3.35, 3.35]) box(b, M.white(), x - 0.1, 0.45, -1.85, x + 0.1, 3.3, -1.65);
  box(b, M.white(), -3.9, 3.3, -4, 3.9, 3.5, -1.4);
  box(b, lam("door", () => ({ color: "#b8423a" })), -0.6, 0.45, -4.06, 0.6, 2.6, -3.96);
  for (const x of [-4.6, 4.6]) { box(b, M.white(), x - 1.0, 1.1, -4.08, x + 1.0, 3.2, -3.98); box(b, M.glass(), x - 0.85, 1.25, -4.12, x + 0.85, 3.05, -4.06); }
  for (let x = -30; x <= 30; x += 0.5) if (Math.abs(x) > 1.3) box(b, M.white(), x - 0.06, 0, 5.55, x + 0.06, 0.95, 5.65);
  for (const [x0, x1] of [[-30, -1.3], [1.3, 30]]) for (const y of [0.3, 0.75]) box(b, M.white(), x0, y, 5.5, x1, y + 0.08, 5.52);
  cyl(b, M.wood(), 2.9, 0, 6.9, 0.06, 0.06, 1.05, 8);
  box(b, M.wood(), 2.7, 1.0, 6.55, 3.1, 1.05, 7.2); // mount board
  for (const [x, z, s] of [[-6.5, 2.2, 1.1], [6.4, 2.6, 1.0], [-9.5, -3, 1.3], [9.2, -2.5, 1.2]] as const) bush(b, x, 0, z, s);
  for (const [x, z, s] of [[-14, -6, 1], [15, -8, 2], [-20, 24, 3], [18, 25, 4]] as const) palm(b, x, 0, z, 9, s);
  cyl(b, M.trunk(), 11, 0, -12, 0.35, 0.28, 4); for (const [dx, dy, dz, r] of [[0, 5.2, 0, 2.6], [1.6, 4.6, 0.6, 1.9], [-1.5, 4.8, -0.5, 2.0], [0.4, 6.3, 0.2, 1.8]]) sph(b, M.bush(), 11 + dx, dy, -12 + dz, r);
  const nb = ["#f1d6a8", "#cfe0c4", "#f2c1b4", "#d9d2ee"];
  for (let i = 0; i < 6; i++) { const x = -30 + i * 12; box(b, lam("nb" + (i % 4), () => ({ map: rep(stucco("nb" + (i % 4), nb[i % 4]), 1, 1) })), x - 4.5, 0, 25, x + 4.5, 4.2 + (i % 2) * 1.2, 33, 4); }
  for (let i = 0; i < 6; i++) { const g = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(70, 22 + (i % 3) * 6, 40); g.translate(-160 + i * 65, 0, -200); b.add(g, lam("hill" + (i % 2), () => ({ color: i % 2 ? "#b8a674" : "#8fae6a" }))); }
  b.build(home);
  // classic rural mailbox: hollow body along z (back z 6.62, mouth z 7.2), straight sides + half-round top, dark inside
  const MB = { x: 2.9, y0: 1.05, z0: 6.62, z1: 7.2, w: 0.34, h: 0.2 }, r = MB.w / 2, L = MB.z1 - MB.z0, zc = (MB.z0 + MB.z1) / 2;
  const blueM = lam("mailbox", () => ({ color: "#3d6fb5" })), inM = new THREE.MeshLambertMaterial({ color: "#6c6778", side: THREE.BackSide });
  const shell = new THREE.Group(); home.add(shell);
  const addM = (g: THREE.BufferGeometry, m: THREE.Material) => { const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; shell.add(o); return o; };
  for (const sx of [-1, 1]) addM(new THREE.BoxGeometry(0.012, MB.h, L).translate(MB.x + sx * (r - 0.006), MB.y0 + MB.h / 2, zc), blueM);
  addM(new THREE.BoxGeometry(MB.w, 0.012, L).translate(MB.x, MB.y0 + 0.006, zc), blueM);
  const arch = new THREE.CylinderGeometry(r, r, L, 24, 1, true, Math.PI / 2, Math.PI); arch.rotateX(Math.PI / 2); arch.translate(MB.x, MB.y0 + MB.h, zc);
  addM(arch, new THREE.MeshLambertMaterial({ color: "#3d6fb5", side: THREE.FrontSide })); addM(arch.clone(), inM);
  const capS = new THREE.Shape(); capS.moveTo(-r, 0); capS.lineTo(r, 0); capS.absarc(0, MB.h, r, 0, Math.PI, false); capS.closePath();
  addM(new THREE.ExtrudeGeometry(capS, { depth: 0.012, bevelEnabled: false }).translate(MB.x, MB.y0, MB.z0), blueM);
  // inside: dark lining so the open mouth reads as empty and deep
  for (const sx of [-1, 1]) addM(new THREE.PlaneGeometry(L, MB.h).rotateY(sx * Math.PI / 2).translate(MB.x + sx * (r - 0.013), MB.y0 + MB.h / 2, zc), new THREE.MeshLambertMaterial({ color: "#6c6778" }));
  addM(new THREE.PlaneGeometry(MB.w - 0.026, L).rotateX(-Math.PI / 2).translate(MB.x, MB.y0 + 0.013, zc), new THREE.MeshLambertMaterial({ color: "#5a5566" }));
  addM(new THREE.ShapeGeometry(capS).translate(MB.x, MB.y0, MB.z0 + 0.014), new THREE.MeshLambertMaterial({ color: "#4a4656" }));
  // red flag on the side (pivoting arm + flag)
  addM(new THREE.BoxGeometry(0.018, 0.3, 0.03).translate(MB.x + r + 0.012, MB.y0 + 0.2, MB.z0 + 0.12), lam("flagArm", () => ({ color: "#d8322f" })));
  addM(new THREE.BoxGeometry(0.018, 0.1, 0.14).translate(MB.x + r + 0.012, MB.y0 + 0.31, MB.z0 + 0.18), lam("flag", () => ({ color: "#e0262a" })));
  // the door: arched plate hinged on its bottom edge at the mouth, with a pull tab
  const mailDoor = new THREE.Group(); mailDoor.position.set(MB.x, MB.y0, MB.z1); home.add(mailDoor);
  const doorS = new THREE.Shape(); doorS.moveTo(-r - 0.006, 0); doorS.lineTo(r + 0.006, 0); doorS.absarc(0, MB.h, r + 0.006, 0, Math.PI, false); doorS.closePath();
  // solid plate built from a box + a half disc (the extruded shape lost its faces and showed only its rim)
  const dm = lam("mailDoorM", () => ({ color: "#4a80c8", side: THREE.DoubleSide })), R = r + 0.006;
  const half = new THREE.CylinderGeometry(R, R, 0.014, 24, 1, false, Math.PI / 2, Math.PI); half.rotateX(Math.PI / 2); half.translate(0, MB.h, 0.007);
  for (const g of [new THREE.BoxGeometry(2 * R, MB.h, 0.014).translate(0, MB.h / 2, 0.007), half]) { const m = new THREE.Mesh(g, dm); m.castShadow = m.receiveShadow = true; mailDoor.add(m); }
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.11), new THREE.MeshBasicMaterial({ map: ctex("namePlate", 420, 110, (g) => {
    g.fillStyle = "#1f2433"; g.fillRect(0, 0, 420, 110); g.fillStyle = "#f4efe2"; g.font = "900 70px Arial Black, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("KUBASTA", 210, 58);
  }) }));
  plate.position.set(MB.x, 0.94, 7.205); home.add(plate);
  const tab = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.03).translate(0, MB.h + r - 0.04, 0.03), lam("tab", () => ({ color: "#c9ccd2" }))); mailDoor.add(tab);

  // ===== OFFICE / SERVER ROOM =====
  const office = G("office", OFFICE);
  b = new Batch();
  up(b, lam("tiles", () => ({ map: tiles() })), -12, 14, -10, 10, 0, 2.4);
  const wallM = lam("offWall", () => ({ map: rep(stucco("off", "#5d7fa6"), 1, 1) })), stripe = lam("offStripe", () => ({ color: "#e9eef4" }));
  box(b, wallM, -12.4, 0, -10.3, -12, 6.5, 10.3, 4); box(b, wallM, -12.4, 0, -10.3, 14, 6.5, -10, 4); box(b, wallM, -12.4, 0, 10, 14, 6.5, 10.3, 4);
  box(b, stripe, -11.99, 0, -10, -11.95, 0.25, 10); box(b, stripe, -12, 0, -9.99, 14, 0.25, -9.95); box(b, stripe, -12, 0, 9.95, 14, 0.25, 9.99);
  const rk = lam("rack", () => ({ map: rackTex() }));
  const rackXs: [number, number][] = [];
  for (let x = -10.5; x <= 6.5; x += 1.0) { box(b, rk, x - 0.45, 0, -9.95, x + 0.45, 2.4, -8.8); rackXs.push([x, -1]); }
  for (let x = -0.5; x <= 6.5; x += 1.0) { box(b, rk, x - 0.45, 0, 8.8, x + 0.45, 2.4, 9.95); rackXs.push([x, 1]); }
  box(b, M.dark(), -11.98, 1.15, -1.7, -11.75, 5.15, 1.7);
  box(b, lam("desk", () => ({ color: "#a8784e" })), -8.6, 0, -1.9, -7.2, 0.8, 1.9);
  box(b, M.dark(), -8.3, 0.8, -0.6, -7.9, 0.84, 0.6);
  box(b, lam("cork", () => ({ color: "#c99a62" })), -10.9, 0.35, 9.62, -2.1, 4.75, 9.95);
  box(b, M.white(), -11.0, 0.3, 9.6, -2.0, 0.38, 9.95); box(b, M.white(), -11.0, 4.72, 9.6, -2.0, 4.8, 9.95);
  b.build(office);
  const scv = document.createElement("canvas"); scv.width = 560; scv.height = 700;
  const stex = new THREE.CanvasTexture(scv); stex.colorSpace = THREE.SRGBColorSpace; stex.anisotropy = 8;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.74), new THREE.MeshBasicMaterial({ map: stex, color: new THREE.Color(1.05, 1.05, 1.05) }));
  scr.position.set(-11.73, 3.15, 0); scr.rotation.y = Math.PI / 2; office.add(scr);
  const sg = scv.getContext("2d")!; monitor(new Pen(sg), () => 0);
  const btnMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.75, 0.08, 0.08) });
  // LEDs on every rack front (blinking instances)
  const ledPos: THREE.Vector3[] = [];
  for (const [x, s] of rackXs) for (let k = 0; k < 6; k++) ledPos.push(V(x - 0.3 + (k % 3) * 0.12, 0.45 + Math.floor(k / 3) * 0.95 + (k % 2) * 0.35, s < 0 ? -8.78 : 8.78));
  const leds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: "#ffffff" }), ledPos.length);
  ledPos.forEach((p, i) => { leds.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)); leds.setColorAt(i, new THREE.Color(0.2, 2.5, 0.6)); });
  office.add(leds);

  // ===== SHOP =====
  const shop = G("shop", SHOP);
  b = new Batch();
  up(b, lam("planksHD", () => ({ map: rep(planksHD(), 1, 1) })), -8, 8, -8, 9, 0, 4);
  up(b, lam("carpet", () => ({ map: carpet() })), -2.5, 2.5, -1.2, 4, 0.01, 2);
  const sw = lam("shopWall", () => ({ map: rep(stucco("shop", "#efd2a4"), 1, 1) })), wain = lam("wain", () => ({ color: "#7a4f33" }));
  box(b, sw, -8.3, 0, -8.3, 8.3, 5.5, -8, 4); box(b, sw, -8.3, 0, -8.3, -8, 5.5, 9, 4); box(b, sw, 8, 0, -8.3, 8.3, 5.5, 9, 4);
  box(b, wain, -8, 0, -7.99, 8, 1.1, -7.92); box(b, wain, -7.99, 0, -8, -7.92, 1.1, 9); box(b, wain, 7.92, 0, -8, 7.99, 1.1, 9);
  // glass display counter (real card-shop look): wood base, dark velvet bed, metal frame, glass walls (below)
  box(b, lam("counter", () => ({ color: "#8a5a34" })), -3, 0, -2.7, 3, 0.45, -1.7);
  box(b, lam("velvet", () => ({ color: "#2d2a4a" })), -2.95, 0.45, -2.65, 2.95, 0.5, -1.75);
  const frame = lam("caseFrame", () => ({ color: "#3a3d47" }));
  for (const x of [-3, 2.95]) for (const z of [-2.7, -1.75]) box(b, frame, x, 0.45, z, x + 0.05, 1.08, z + 0.05);
  for (const z of [-2.7, -1.75]) box(b, frame, -3, 1.03, z, 3, 1.08, z + 0.05);
  for (const x of [-3, 2.95]) box(b, frame, x, 1.03, -2.7, x + 0.05, 1.08, -1.7);
  // booster-box shelf unit (left) and a second one (right): stacks of bright sealed boxes
  const boxCols = ["#e2433b", "#2f7fbf", "#f2c84a", "#7b5ac9", "#2aa39a", "#f08a3c"];
  for (const ux of [-6.6, 4.6]) {
    box(b, lam("unit", () => ({ color: "#6e4a30" })), ux, 0, -7.95, ux + 2, 3.2, -7.2);
    for (let r = 0; r < 4; r++) {
      box(b, lam("unitShelf", () => ({ color: "#5a3b26" })), ux, 0.1 + r * 0.78, -7.95, ux + 2, 0.16 + r * 0.78, -7.15);
      for (let c = 0; c < 4; c++) { const col = boxCols[(r * 4 + c + (ux > 0 ? 3 : 0)) % 6]; box(b, lam("bb" + col, () => ({ color: col })), ux + 0.08 + c * 0.47, 0.16 + r * 0.78, -7.8, ux + 0.48 + c * 0.47, 0.72 + r * 0.78, -7.3); }
    }
  }
  for (const y of [1.3, 2.15, 3.0]) box(b, lam("shelf", () => ({ color: "#6e4a30" })), -6, y, -8, 6, y + 0.07, -7.55);
  cyl(b, M.dark(), 3.6, 3.75, -7.9, 0.2, 0.2, 0.08, 14, new THREE.Euler(Math.PI / 2, 0, 0));
  box(b, lam("cabinet", () => ({ color: "#7d8794" })), -7.95, 0, -4.45, -7.3, 1.32, -3.55);
  b.build(shop);
  const drawer = new THREE.Group(); drawer.position.set(-7.3, 0.95, -4.0); shop.add(drawer);
  drawer.add(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, 0.82).translate(-0.31, 0, 0), twoToneLam("#8e98a6")));
  drawer.add(new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.22).translate(0.01, 0, 0), twoToneLam("#cfd3da")));
  drawer.add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12).rotateZ(Math.PI / 2).translate(0.01, 0.1, 0), twoToneLam("#e8c45a")));
  const hotBox = new THREE.Group(); shop.add(hotBox);
  hotBox.add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.13), twoToneLam("#e2433b")));
  hotBox.add(new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.06, 0.135).translate(0, 0.08, 0), twoToneLam("#f2c84a")));
  const alarm = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 0.1, 0.1) });
  const al = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2).translate(3.6, 3.75, -7.86), alarm); shop.add(al);
  const gs = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), sign(signTex("gavel", "#f3e3c3"))); gs.position.set(-0.5, 4.3, -7.9); shop.add(gs);
  const glass = new THREE.MeshBasicMaterial({ color: "#cfe8f5", transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
  const gc = new THREE.Mesh(boxGeo(V(-2.97, 0.5, -2.68), V(2.97, 1.04, -1.72)), glass); gc.renderOrder = 3; shop.add(gc);
  // posters of our own creatures on the back wall
  ([[-4.6, 4.3, 0, "#ffd27a"], [3.7, 4.3, 1, "#bfe7ff"], [6.4, 4.0, 3, "#ffd0ee"], [-7.0, 4.1, 2, "#d9f5b0"]] as const).forEach(([x, y, k, bg]) => {
    const t = ctex("poster" + k, 300, 420, (g) => { const p = new Pen(g); p.poly(rrect(8, 8, 292, 412, 10), bg, 10); creature(p, k as Kind, 30, 30, 270, 300); for (let i = 0; i < 3; i++) p.stroke([[40, 330 + i * 26], [260 - i * 40, 330 + i * 26]], 10, "#5a5060"); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.54), sign(t)); m.position.set(x, y, -7.89); shop.add(m);
  });

  // ===== ALLEY =====
  const alley = G("alley", ALLEY);
  b = new Batch();
  up(b, lam("alleyFloor", () => ({ map: asphalt("alleyA", "#6a6670") })), -3.2, 3.2, -90, 14, 0, 6);
  const bw = lam("brick", () => ({ map: rep(brick(), 1, 1) }));
  for (const s of [-1, 1]) box(b, bw, s * 3.2, 0, -90, s * 3.6, 10 + (s > 0 ? 2 : 0), 14, 3);
  for (const s of [-1, 1]) for (const z of [-12, -30, -50]) { box(b, M.dark(), s * 3.19, 0, z - 0.6, s * 3.15, 2.3, z + 0.6); box(b, M.glass(), s * 3.19, 4, z - 0.9, s * 3.12, 5.6, z + 0.9); }
  for (const s of [-1, 1]) cyl(b, M.pole(), s * 3.05, 0, -4 + s * 6, 0.07, 0.07, 9, 8);
  box(b, M.wood(), 0.85, 0, -1.8, 1.75, 0.75, -1.0, 0.8);
  box(b, M.wood(), 1.9, 0, -3.2, 2.9, 0.6, -2.3, 0.8); box(b, M.wood(), 2.0, 0.6, -3.1, 2.8, 1.15, -2.4, 0.8);
  box(b, lam("dumpster", () => ({ color: "#3f7d4f" })), -3.1, 0.15, -7.8, -1.6, 1.4, -6.0); box(b, M.dark(), -3.15, 1.4, -7.85, -1.55, 1.48, -5.95);
  for (const [x, z, r] of [[-2.4, -4.6, 0.45], [-1.9, -5.2, 0.38], [2.5, -9, 0.5]] as const) sph(b, M.dark(), x, r * 0.8, z, r, 0.8);
  b.build(alley);

  // ===== LIVING ROOM (Kubasta) =====
  const living = G("living", LIVING);
  b = new Batch();
  up(b, lam("planksHD", () => ({ map: rep(planksHD(), 1, 1) })), -5, 5, -3, 5, 0, 4);
  up(b, lam("rug", () => ({ map: carpet() })), -1.4, 1.4, -1.8, 0.8, 0.01, 2);
  const lw = lam("livWall", () => ({ map: rep(stucco("liv", "#e9cf9c"), 1, 1) }));
  box(b, lw, -5, 0, -3.2, 5, 3.2, -3, 4); box(b, lw, -5.2, 0, -3.2, -5, 3.2, 5, 4);
  box(b, lam("livWain", () => ({ color: "#7a4f33" })), -5, 0, -2.99, 5, 0.9, -2.93);
  box(b, M.white(), 1.0, 0.95, -3.0, 2.8, 2.35, -2.94); box(b, lam("dusk", () => ({ color: "#3a4f8a" })), 1.1, 1.05, -3.02, 2.7, 2.25, -2.95);
  box(b, M.white(), 1.87, 1.05, -2.99, 1.93, 2.25, -2.93);
  const chairM = lam("armchair", () => ({ color: "#4f7a5a" }));
  box(b, chairM, -0.5, 0.18, -1.6, 0.5, 0.45, -0.85); box(b, chairM, -0.5, 0.45, -1.62, 0.5, 1.25, -1.38);
  for (const sx of [-1, 1]) box(b, chairM, sx * 0.5 - 0.1, 0.18, -1.6, sx * 0.5 + 0.1, 0.7, -0.85);
  for (const sx of [-0.4, 0.4]) for (const sz of [-1.5, -0.95]) box(b, M.dark(), sx - 0.03, 0, sz - 0.03, sx + 0.03, 0.18, sz + 0.03);
  box(b, lam("sideTable", () => ({ color: "#8a5a34" })), 0.75, 0, -1.25, 1.2, 0.55, -0.8);
  cyl(b, M.dark(), -1.05, 0, -1.7, 0.16, 0.16, 0.04, 14); cyl(b, M.pole(), -1.05, 0.04, -1.7, 0.025, 0.025, 1.4, 8);
  box(b, lam("frame1", () => ({ color: "#6e4a30" })), -3.4, 1.3, -2.99, -2.4, 2.1, -2.95); box(b, lam("pic1", () => ({ color: "#9cc6e4" })), -3.3, 1.4, -3.0, -2.5, 2.0, -2.94);
  box(b, lam("shelfL", () => ({ color: "#6e4a30" })), -4.98, 0, -2.6, -4.6, 1.9, -1.0);
  b.build(living);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.28, 0.32, 16, 1, true).translate(-1.05, 1.5, -1.7), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.7, 0.9), side: THREE.DoubleSide }));
  living.add(shade);
  const clockCv = document.createElement("canvas"); clockCv.width = clockCv.height = 256;
  const clockTex = new THREE.CanvasTexture(clockCv); clockTex.colorSpace = THREE.SRGBColorSpace;
  const clock = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), new THREE.MeshBasicMaterial({ map: clockTex }));
  clock.position.set(-1.7, 2.2, -2.94); living.add(clock);
  living.add(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 8, 32).translate(-1.7, 2.2, -2.94), twoToneLam("#6e4a30")));

  // ===== POLICE STATION (lobby desk at x 0, interview room at x 11) =====
  const police = G("police", POLICE);
  b = new Batch();
  up(b, lam("tiles", () => ({ map: tiles() })), -7, 16, -4, 6, 0, 2.4);
  const pwM = lam("polWall", () => ({ map: rep(stucco("pol", "#c9d6e4"), 1, 1) }));
  box(b, pwM, -7, 0, -3.8, 7, 3.4, -3.6, 4); box(b, pwM, -7.2, 0, -3.8, -7, 3.4, 6, 4);
  box(b, lam("polStripe", () => ({ color: "#2a3a63" })), -7, 0, -3.59, 7, 0.9, -3.55);
  const deskM = lam("polDesk", () => ({ color: "#5a6f8f" }));
  box(b, deskM, -2.2, 0, -1.4, 2.2, 1.05, -0.65); box(b, lam("polTop", () => ({ color: "#d9d1c3" })), -2.3, 1.05, -1.5, 2.3, 1.12, -0.55);
  box(b, lam("board", () => ({ color: "#c99a62" })), 3.2, 1.0, -3.58, 5.8, 2.6, -3.52);
  for (const [x, y, c] of [[3.6, 1.6, "#fbf7ec"], [4.4, 2.0, "#fff6a8"], [5.2, 1.5, "#fbf7ec"]] as const) box(b, lam("note" + c, () => ({ color: c })), x - 0.25, y - 0.3, -3.52, x + 0.25, y + 0.3, -3.5);
  box(b, lam("bench", () => ({ color: "#7a4f33" })), -6.6, 0, 1.0, -4.2, 0.45, 1.5);
  // interview room: grey walls, table, two chairs, hanging lamp
  const iw = lam("intWall", () => ({ map: rep(stucco("int", "#9aa3ad"), 1, 1) }));
  box(b, iw, 7.6, 0, -2.8, 15, 3.2, -2.6, 4); box(b, iw, 7.6, 0, -2.8, 7.8, 3.2, 6, 4); box(b, iw, 14.8, 0, -2.8, 15, 3.2, 6, 4);
  box(b, lam("intTable", () => ({ color: "#8f96a0" })), 10.1, 0.7, -0.7, 11.9, 0.76, 0.3);
  for (const x of [10.2, 11.8]) for (const z of [-0.6, 0.2]) box(b, M.dark(), x - 0.03, 0, z - 0.03, x + 0.03, 0.7, z + 0.03);
  for (const [x, z] of [[11, -1.2], [12.5, 0.4]] as const) { box(b, M.dark(), x - 0.25, 0.42, z - 0.25, x + 0.25, 0.47, z + 0.25); for (const dx of [-0.22, 0.22]) for (const dz of [-0.22, 0.22]) box(b, M.pole(), x + dx - 0.02, 0, z + dz - 0.02, x + dx + 0.02, 0.42, z + dz + 0.02); }
  box(b, M.dark(), 10.98, 2.3, -0.24, 11.02, 3.2, -0.2);
  b.build(police);
  for (const [tex, x, y, z, w] of [[letters("POLICE", "", "#1f2b4a"), 0, 2.55, -3.54, 4.8]] as const) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 8), new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.4 })); m.position.set(x, y, z); police.add(m);
  }
  police.add(new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.26, 18, 1, true).translate(11, 2.2, -0.22), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.0, 1.5), side: THREE.DoubleSide })));

  // ===== COURTROOM =====
  const court = G("court", COURT);
  b = new Batch();
  up(b, lam("planksHD", () => ({ map: rep(planksHD(), 1, 1) })), -7, 7, -6, 6, 0, 4);
  const panel = lam("courtWall", () => ({ color: "#8a5a34" })), panelDk = lam("courtWallDk", () => ({ color: "#6e4426" }));
  box(b, panel, -7, 0, -5.8, 7, 5.5, -5.6); box(b, panelDk, -7, 0, -5.59, 7, 1.2, -5.55);
  for (let x = -6; x <= 6; x += 2) box(b, panelDk, x - 0.06, 1.2, -5.59, x + 0.06, 5.5, -5.55);
  box(b, panelDk, -2.6, 0, -5.5, 2.6, 0.5, -3.6);                       // judge's platform
  box(b, panel, -2.4, 0, -3.95, 2.4, 1.45, -3.55); box(b, panelDk, -2.5, 1.45, -4.0, 2.5, 1.52, -3.5); // bench front + top
  box(b, lam("block", () => ({ color: "#5a3420" })), 0.32, 1.52, -3.86, 0.62, 1.58, -3.66); // sound block for the gavel
  box(b, lam("tray", () => ({ color: "#c9ccd2" })), 0.9, 1.52, -3.86, 1.6, 1.55, -3.6);      // the clerk's tray
  for (const sx of [-1, 1]) { cyl(b, M.pole(), sx * 3.4, 0, -5.0, 0.04, 0.04, 3.0, 8); box(b, lam(sx < 0 ? "flagA" : "flagB", () => ({ color: sx < 0 ? "#2f5f9a" : "#c9373a" })), sx * 3.4, 2.0, -5.02, sx * 3.4 + sx * 0.9, 2.9, -4.98); }
  box(b, panelDk, 0.1, 0.9, 0.05, 1.9, 1.0, 0.15); for (const x of [0.15, 1.85]) box(b, panelDk, x - 0.05, 0, 0.05, x + 0.05, 1.0, 0.15); // the dock rail
  for (let r = 0; r < 2; r++) box(b, panel, -6, 0, 2.2 + r * 1.4, -1.5, 0.9, 2.7 + r * 1.4); // gallery pews
  b.build(court);
  const seal = new THREE.Mesh(new THREE.CircleGeometry(0.75, 40), new THREE.MeshBasicMaterial({ map: ctex("seal", 256, 256, (g) => {
    g.fillStyle = "#e8c45a"; g.beginPath(); g.arc(128, 128, 126, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#6e4426"; g.lineWidth = 10; g.beginPath(); g.arc(128, 128, 104, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 8; g.beginPath(); g.moveTo(128, 60); g.lineTo(128, 190); g.moveTo(70, 90); g.lineTo(186, 90); g.stroke(); // scales of justice
    for (const x of [70, 186]) { g.beginPath(); g.moveTo(x, 90); g.lineTo(x - 26, 140); g.lineTo(x + 26, 140); g.closePath(); g.stroke(); }
    g.beginPath(); g.moveTo(100, 196); g.lineTo(156, 196); g.stroke();
  }) }));
  seal.position.set(0, 3.5, -5.54); court.add(seal);

  // shadows: everything static casts and receives (Batch.build), moving meshes too
  for (const g of [truck, pallets, police, suv, home, office, shop, alley, street, living, court]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { groups, truck, door, pallets, palletB, jack, police: policeCar, policeLights: [red, blue], suv, mailDoor, leds, ledCount: ledPos.length, button: btnMat,
    screen: { tex: stex, g: sg, key: "" }, alarm, boxFlaps, lock, shackle,
    board: { tex: boardTex, g: boardCv.getContext("2d")!, key: "" }, clock: { tex: clockTex, g: clockCv.getContext("2d")!, key: "" },
    tugChair, tracker, led: ledMat, drawer, hotBox };
};
