// The sets of the Golden Chocobo reel (the store + back room, the garage, MagicCon), built once: static scenery merged per material (Batch), plus the moving pieces
// as their own objects (bid board, date plate, wall calendar, office door, the three newspaper bundles, the street's stake signs).
// Tickets, stamps, steam, the level and the slab are flat cards placed by cast.ts. Positions come from plan.json.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { worldMap, seatFace, brickSide, brassTag, boardSign } from "./art";
import { STORE, GARAGE, CON, V3, ORIGIN, TABLE, TOP, TOWER, BRICK, HEN } from "./story";

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



const canvasMat = (w: number, h: number) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return { tex, g: cv.getContext("2d")!, key: "" };
};
/** an axis box with a rotation about z (and x), centred at (cx, cy, cz) */
const slab = (b: Batch, m: THREE.Material, cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, rz = 0, rx = 0) =>
  b.add(new THREE.BoxGeometry(sx, sy, sz), m, new THREE.Matrix4().compose(V(cx, cy, cz), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, rz)), V(1, 1, 1)));
const C = (col: string) => lam("c" + col, () => ({ color: col }));
const mesh = (g: THREE.BufferGeometry, m: THREE.Material | THREE.Material[], parent: THREE.Object3D, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); parent.add(o); return o; };
type Canvas = { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string };
export type Sets = {
  groups: Record<string, THREE.Group>;
  map: Canvas; cage: THREE.Group; cloth: THREE.Group; brief: THREE.Group; lid: THREE.Group; tower: THREE.Group; bricks: THREE.Mesh[];
  doorB: THREE.Group; beam: THREE.Group; pans: THREE.Group[];
};
const ctexPen = (key: string, w: number, h: number, draw: (p: Pen) => void) => ctex(key, w, h, (g) => draw(new Pen(g)));
const woodFloor = () => ctex("woodFloor", 512, 512, (g, r) => {
  for (let y = 0; y < 512; y += 64) { g.fillStyle = jit(r, "#b0814f", 0.05, 3, 0.1); g.fillRect(0, y, 512, 64); g.fillStyle = "rgba(60,36,20,0.5)"; g.fillRect(0, y + 61, 512, 3); g.fillRect(((y * 7) % 400) + 40, y, 3, 64); }
});
const peg = () => ctex("pegboard", 256, 256, (g) => { g.fillStyle = "#c9a878"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(60,40,20,0.55)"; for (let x = 16; x < 256; x += 32) for (let y = 16; y < 256; y += 32) { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); } });
const blueCarpet = () => ctex("blueCarpet", 256, 256, (g, r) => { g.fillStyle = "#2f4f8a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"; g.fillRect(r() * 256, r() * 256, 2, 2); } });

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const basic = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent });
  const legs = (b: Batch, m: THREE.Material, x0: number, x1: number, z0: number, z1: number, h: number, r = 0.025) => { for (const x of [x0 + 0.05, x1 - 0.05]) for (const z of [z0 + 0.05, z1 - 0.05]) cyl(b, m, x, 0, z, r, r, h, 8); };
  const oak = C("#8a5a34"), oakD = C("#6e4428"), brass = C("#d0a442");

  // ===================== THE STORE + THE BACK ROOM =====================
  const store = G("store", STORE);
  let b = new Batch();
  up(b, lam("woodFloor", () => ({ map: rep(woodFloor(), 1, 1) })), -4.5, 4.5, -4.0, 5, 0, 2);
  up(b, C("#9c9a84"), -0.2, 3.6, -7.8, -4.2, 0.002, 1);
  const teal = C("#2f7a74"), cream = lam("storeCream", () => ({ map: rep(stucco("store", "#f1e6c8"), 1, 1) })), olive = C("#7d7a52"), oliveD = C("#5f5c3c");
  const wall2 = (x0: number, x1: number, y0: number, y1: number) => { if (y0 < 1.0) box(b, teal, x0, y0, -4.2, x1, Math.min(1.0, y1), -4.0); if (y1 > 1.0) box(b, cream, x0, Math.max(1.0, y0), -4.2, x1, y1, -4.0, 3); };
  wall2(-4.5, 1.6, 0, 3.2); wall2(3.0, 4.5, 0, 3.2); wall2(1.6, 3.0, 0, 1.0); wall2(1.6, 3.0, 1.9, 3.2);
  for (const sd of [-1, 1]) { const x = sd * 4.5; box(b, teal, x, 0, -4.0, x + sd * 0.2, 1.0, 5); box(b, cream, x, 1.0, -4.0, x + sd * 0.2, 3.2, 5, 3); }
  // the window frame (both faces) and its sill
  for (const z of [-4.0, -4.2]) { const dz = z < -4.1 ? -0.03 : 0.03; box(b, oak, 1.55, 0.95, z, 3.05, 1.0, z + dz); box(b, oak, 1.55, 1.9, z, 3.05, 1.95, z + dz); box(b, oak, 1.55, 0.95, z, 1.6, 1.95, z + dz); box(b, oak, 3.0, 0.95, z, 3.05, 1.95, z + dz); }
  box(b, oak, 1.5, 0.96, -4.0, 3.1, 1.0, -3.86);
  // back room walls (olive, a darker dado)
  const bw = (x0: number, z0: number, x1: number, z1: number) => { box(b, oliveD, x0, 0, z0, x1, 0.9, z1); box(b, olive, x0, 0.9, z0, x1, 2.6, z1); };
  bw(-0.2, -7.8, 0, -4.2); bw(3.4, -7.8, 3.6, -4.2); bw(-0.2, -7.8, 3.6, -7.6);
  // the deal table, two chairs, the crate, the sound block, cartons
  const [tx, tz] = TABLE;
  box(b, oak, tx - 0.45, TOP - 0.04, tz - 0.35, tx + 0.45, TOP, tz + 0.35); legs(b, oakD, tx - 0.45, tx + 0.45, tz - 0.35, tz + 0.35, TOP - 0.04);
  const chair = (x: number, z: number) => { box(b, oak, x - 0.21, 0.42, z - 0.21, x + 0.21, 0.46, z + 0.21); legs(b, oakD, x - 0.21, x + 0.21, z - 0.21, z + 0.21, 0.42, 0.018); box(b, oak, x - 0.21, 0.46, z - 0.23, x + 0.21, 0.95, z - 0.19); };
  chair(1.55, -6.55); chair(3.0, -7.0);
  box(b, C("#a07850"), HEN[0] - 0.15, 0, HEN[1] - 0.15, HEN[0] + 0.15, 0.35, HEN[1] + 0.15); box(b, C("#7a5838"), HEN[0] - 0.155, 0.12, HEN[1] - 0.155, HEN[0] + 0.155, 0.16, HEN[1] + 0.155);
  cyl(b, C("#c79b62"), 1.92, TOP, -5.74, 0.07, 0.07, 0.03, 16);
  const cardM = lam("cardboard", () => ({ map: cardboard() }));
  box(b, cardM, 0.1, 0, -7.55, 0.75, 0.55, -6.95); box(b, cardM, 0.15, 0.55, -7.5, 0.7, 1.0, -7.05); box(b, cardM, 0.8, 0, -7.55, 1.3, 0.45, -7.1);
  // the play table (playmats, decks), the stool and the carton of bricks, the counter and its arm lamp
  box(b, C("#e9e3d2"), 0.4, TOP - 0.04, -1.85, 2.0, TOP, -0.95); legs(b, C("#5b6170"), 0.4, 2.0, -1.85, -0.95, TOP - 0.04, 0.03);
  box(b, C("#2a3a6a"), 0.5, TOP, -1.8, 1.05, TOP + 0.003, -1.45); box(b, C("#6a2a3a"), 0.5, TOP, -1.38, 1.05, TOP + 0.003, -1.02);
  for (const [x, z, c] of [[1.15, -1.7, "#d8322f"], [1.25, -1.15, "#3f7fc9"], [0.7, -1.62, "#2a2c33"]] as const) box(b, C(c), x - 0.035, TOP, z - 0.05, x + 0.035, TOP + 0.03, z + 0.05);
  cyl(b, C("#5b6170"), 2.4, 0, -0.95, 0.15, 0.15, 0.6, 12); box(b, cardM, 2.25, 0.6, -1.1, 2.55, 0.9, -0.8);
  box(b, C("#3a3f52"), -3.3, 0, -3.3, -1.7, 0.95, -2.7); box(b, C("#9fd0f2"), -3.25, 0.15, -2.705, -1.75, 0.85, -2.69);
  box(b, C("#2a2c33"), -3.3, 0.93, -3.3, -1.7, 0.95, -2.7);
  cyl(b, C("#2a2c33"), -3.05, 0.95, -3.2, 0.06, 0.06, 0.02, 12); box(b, C("#2a2c33"), -3.06, 0.95, -3.21, -3.04, 1.38, -3.19); box(b, C("#2a2c33"), -3.06, 1.36, -3.21, -2.82, 1.38, -3.19);
  // shelves of booster boxes (left wall) and posters
  for (let r = 0; r < 4; r++) { box(b, oak, -4.5, 0.5 + r * 0.55, -3.5, -4.15, 0.53 + r * 0.55, 3.5); for (let i = 0; i < 14; i++) box(b, C(["#d8322f", "#3f7fc9", "#f2c84a", "#3f9a55", "#7b5ac9", "#f08a3c"][(i + r) % 6]), -4.48, 0.53 + r * 0.55, -3.4 + i * 0.5, -4.2, 0.83 + r * 0.55, -3.0 + i * 0.5); }
  for (const [x, c] of [[-0.6, "#5a86b8"], [0.4, "#c9a24a"], [3.7, "#9c5a3a"]] as const) { box(b, oak, x - 0.35, 1.6, -4.0, x + 0.35, 2.5, -3.97); box(b, C(c), x - 0.3, 1.65, -3.97, x + 0.3, 2.45, -3.95); }
  b.build(store);
  // window glass, the lamp, the map, the store sign
  const glass = mesh(new THREE.PlaneGeometry(1.4, 0.9), new THREE.MeshBasicMaterial({ color: "#cfe6f2", transparent: true, opacity: 0.1, depthWrite: false }), store, 2.3, 1.45, -4.1); glass.renderOrder = 3; glass.layers.set(NOINK);
  mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.9), twoToneLam("#1d1b22"), store, tx, 2.15, tz);
  const shade = mesh(new THREE.CylinderGeometry(0.05, 0.22, 0.17, 20, 1, true), lam("lampShade", () => ({ color: "#2f6a4a", side: THREE.DoubleSide })), store, tx, 1.7, tz);
  void shade; mesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 2.4, 1.3) }), store, tx, 1.64, tz);
  mesh(new THREE.ConeGeometry(0.07, 0.09, 14, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.0, 1.2), side: THREE.DoubleSide }), store, -2.86, 1.33, -3.2).rotation.x = Math.PI;
  const map = canvasMat(1200, 800); plane(1.2, 0.8, new THREE.MeshBasicMaterial({ map: map.tex }), store, -2.5, 2.1, -3.985);
  plane(2.2, 0.28, basic(ctexPen("storeSign", 1600, 200, (p) => boardSign(p, "GAME & CARD STORE", "#d8322f", "#fff3c4"))), store, 1.0, 2.75, -3.98);
  // the cage: base disc, 12 bars (a gap faces +z), a top ring, four arcs of the dome, a ring on top, the perch post
  const cage = new THREE.Group(); store.add(cage);
  const brassM = twoToneLam("#d0a442");
  mesh(new THREE.CylinderGeometry(0.185, 0.19, 0.025, 28), brassM, cage, 0, 0.0125, 0);
  for (let i = 0; i < 12; i++) { const a = ((i + 0.5) / 12) * Math.PI * 2; mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.42, 6), brassM, cage, 0.17 * Math.cos(a), 0.235, 0.17 * Math.sin(a)); }
  const ring = mesh(new THREE.TorusGeometry(0.17, 0.006, 6, 32), brassM, cage, 0, 0.445, 0); ring.rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) { const arc = mesh(new THREE.TorusGeometry(0.17, 0.004, 5, 20, Math.PI), brassM, cage, 0, 0.445, 0); arc.rotation.y = (i / 4) * Math.PI + Math.PI / 8; }
  const top = mesh(new THREE.TorusGeometry(0.03, 0.006, 6, 16), brassM, cage, 0, 0.64, 0); void top;
  mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.08, 6), brassM, cage, 0, 0.065, -0.01);
  // the velvet cloth (a cone with a tassel), posed per frame
  const cloth = new THREE.Group(); store.add(cloth);
  mesh(new THREE.LatheGeometry([[0.0, 0.0], [0.24, 0.0], [0.235, 0.04], [0.215, 0.3], [0.205, 0.46], [0.18, 0.56], [0.12, 0.63], [0.04, 0.66], [0.0, 0.665]].map(([x, y]) => new THREE.Vector2(x, y)), 24), lam("velvet", () => ({ color: "#7a1e2e", side: THREE.DoubleSide })), cloth, 0, 0, 0);
  mesh(new THREE.SphereGeometry(0.03, 10, 8), twoToneLam("#d0a442"), cloth, 0, 0.67, 0);
  // the briefcase: base (cash inside) + lid hinged on the back edge
  const brief = new THREE.Group(); brief.position.set(2.55, TOP, -6.12); store.add(brief);
  const leather = twoToneLam("#1d1b22"), cashTop = lam("cashTop", () => ({ map: ctexPen("cashTop", 256, 192, (p) => { for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const g = p.g; g.save(); g.translate(c * 128, r * 64); brickSide(p); g.restore(); } }) }));
  mesh(new THREE.BoxGeometry(0.4, 0.06, 0.3), leather, brief, 0, 0.03, 0); mesh(new THREE.BoxGeometry(0.37, 0.004, 0.27), cashTop, brief, 0, 0.061, 0);
  for (const x of [-0.12, 0.12]) mesh(new THREE.BoxGeometry(0.03, 0.02, 0.01), brassM, brief, x, 0.055, 0.152);
  mesh(new THREE.BoxGeometry(0.1, 0.02, 0.015), leather, brief, 0, 0.07, -0.158);
  const lid = new THREE.Group(); lid.position.set(0, 0.06, -0.15); brief.add(lid);
  mesh(new THREE.BoxGeometry(0.4, 0.045, 0.3), leather, lid, 0, 0.0225, 0.15); mesh(new THREE.BoxGeometry(0.37, 0.004, 0.27), twoToneLam("#4a2a2a"), lid, 0, -0.001, 0.15);
  // the cash tower: 28 strapped bricks, shown per frame
  const tower = new THREE.Group(); tower.position.set(TOWER[0], TOP, TOWER[1]); store.add(tower);
  const side = lam("brickSide", () => ({ map: ctexPen("brickSide", 256, 64, (p) => brickSide(p)) })), topM = lam("brickTop", () => ({ color: "#86c47a" }));
  const bricks = Array.from({ length: 28 }, (_, i) => { const m = mesh(new THREE.BoxGeometry(BRICK[0], BRICK[1], BRICK[2]), [side, side, topM, topM, side, side], tower, 0.004 * Math.sin(i * 2.7), BRICK[1] / 2 + i * BRICK[1], 0.003 * Math.cos(i * 1.9)); m.rotation.y = 0.04 * Math.sin(i * 3.3); return m; });

  // ===================== THE GARAGE =====================
  const garage = G("garage", GARAGE);
  b = new Batch();
  up(b, M.walk(), -6, 6, -3.2, 8, 0, 2);
  box(b, lam("peg", () => ({ map: rep(peg(), 1, 1) })), -6, 0, -3.4, 6, 3.0, -3.2, 2);
  for (const sd of [-1, 1]) box(b, C("#b9bec6"), sd * 6, 0, -3.2, sd * 6 + sd * 0.2, 3.0, 8);
  for (let i = 0; i < 6; i++) box(b, C(["#d8322f", "#3f7fc9", "#5b6170"][i % 3]), -3 + i * 1.1, 1.4, -3.2, -2.6 + i * 1.1, 1.9, -3.15);
  const yellow = C("#f2c230"), dark = C("#2c2a33"), glassM = M.glass();
  const seatW = lam("seatW", () => ({ map: ctexPen("seatW", 256, 256, (p) => seatFace(p, false)) })), seatP = lam("seatP", () => ({ map: ctexPen("seatP", 256, 256, (p) => seatFace(p, true)) }));
  const carAt = (cx: number, sx: number, seat: THREE.Material) => {
    const X = (x: number) => cx + sx * x, bx = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, m: THREE.Material) => box(b, m, X(x0), y0, z0, X(x1), y1, z1);
    bx(-0.8, 0.3, -1.9, 0.8, 0.42, 1.9, yellow); bx(-0.8, 0.42, 0.95, 0.8, 0.85, 1.9, yellow); bx(-0.8, 0.42, -1.9, 0.8, 0.95, -1.0, yellow);
    bx(-0.8, 0.42, -1.0, -0.74, 0.88, 0.95, yellow); bx(0.74, 0.42, -1.0, 0.8, 0.88, -0.12, yellow);
    bx(-0.78, 1.35, -1.0, 0.78, 1.42, 0.7, yellow);
    for (const [z0, z1] of [[0.72, 0.82], [-0.16, -0.08], [-1.0, -0.9]]) for (const x of [-0.8, 0.74]) bx(x, 0.88, z0, x + 0.06, 1.36, z1, yellow);
    slab(b, glassM, cx, 1.12, 0.84, 1.5, 0.5, 0.03, 0, -0.5);
    bx(-0.76, 0.95, -1.9, 0.76, 1.3, -1.86, glassM);
    bx(-0.7, 0.72, 0.75, 0.7, 0.9, 0.95, dark);
    for (const s0 of [0.05, -0.7]) { bx(s0, 0.42, -0.05, s0 + 0.65, 0.55, 0.5, seat); bx(s0, 0.55, -0.17, s0 + 0.65, 1.15, -0.05, seat); }
    for (const x of [-0.55, 0.55]) bx(x - 0.14, 0.55, 1.9, x + 0.14, 0.7, 1.92, C("#fff6c8"));
    bx(-0.4, 0.45, 1.9, 0.4, 0.62, 1.915, dark);
    for (const x of [-0.8, 0.8]) for (const z of [-1.25, 1.25]) { cyl(b, M.tyre(), X(x) - 0.12 * sx * Math.sign(x), 0.3, z, 0.3, 0.3, 0.24, 16, new THREE.Euler(0, 0, Math.PI / 2)); }
  };
  carAt(-1.0, -1, seatW); carAt(1.0, 1, seatP);
  b.build(garage);
  mesh(new THREE.BoxGeometry(0.12, 0.05, 2.4), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.7, 1.75, 1.8) }), garage, 0, 2.95, 0);
  const doorMesh = (parent: THREE.Group, sx: number) => {
    mesh(new THREE.BoxGeometry(0.06, 0.46, 1.05), twoToneLam("#f2c230"), parent, -sx * 0.03, 0.65, -0.525);
    mesh(new THREE.BoxGeometry(0.03, 0.4, 0.9), new THREE.MeshLambertMaterial({ color: "#9fd0f2", transparent: true, opacity: 0.45 }), parent, -sx * 0.03, 1.08, -0.5);
    mesh(new THREE.BoxGeometry(0.03, 0.04, 0.1), twoToneLam("#2c2a33"), parent, sx * 0.005, 0.8, -0.85);
  };
  const doorA = new THREE.Group(); doorA.position.set(-1.8, 0, 0.95); doorA.rotation.y = 1.05; garage.add(doorA); doorMesh(doorA, -1);
  const doorB = new THREE.Group(); doorB.position.set(1.8, 0, 0.95); garage.add(doorB); doorMesh(doorB, 1);

  // ===================== MAGICCON =====================
  const con = G("con", CON);
  b = new Batch();
  up(b, lam("blueCarpet", () => ({ map: rep(blueCarpet(), 1, 1) })), -8, 8, -6, 6, 0, 2); up(b, C("#c9ccd2"), -8, 8, 0.9, 1.5, 0.003, 1);
  box(b, C("#1d1b22"), -1.5, 0, -1.9, 1.5, 2.4, -1.8);
  for (const [x, c] of [[-1.0, "#f2c84a"], [0.0, "#5a86b8"], [1.0, "#c25a7a"]] as const) { box(b, brass, x - 0.32, 1.3, -1.8, x + 0.32, 2.1, -1.78); box(b, C(c), x - 0.27, 1.35, -1.78, x + 0.27, 2.05, -1.76); }
  box(b, C("#24407a"), -0.8, 0, -1.5, 0.8, TOP, -0.9); box(b, C("#2f5aa0"), -0.82, TOP - 0.01, -1.52, 0.82, TOP, -0.88);
  for (const x of [-1.7, 1.7]) cyl(b, C("#9a9aa2"), x, 0, -2.2, 0.03, 0.03, 3.4, 8);
  for (const [x, z, c] of [[-4.6, -3.5, "#3f9a55"], [4.6, -3.8, "#d8322f"], [-4.2, -6, "#7b5ac9"], [4.0, -6.2, "#f08a3c"]] as const) { box(b, C("#1d1b22"), x - 1.2, 0, z - 0.1, x + 1.2, 2.2, z); box(b, C(c), x - 0.8, 0, z + 0.4, x + 0.8, TOP, z + 1.0); }
  // the balance: base, post (pivot at y 0.37)
  box(b, brass, 0.16, TOP, -1.11, 0.34, TOP + 0.03, -0.99); cyl(b, brass, 0.25, TOP + 0.03, -1.05, 0.01, 0.01, 0.34, 8);
  b.build(con);
  plane(3.2, 0.6, basic(ctexPen("banner", 1600, 200, (p) => boardSign(p, "MAGICCON ATLANTA", "#1d1b22", "#f2c84a"))), con, 0, 2.95, -2.2);
  const beam = new THREE.Group(); beam.position.set(0.25, TOP + 0.37, -1.05); con.add(beam);
  mesh(new THREE.BoxGeometry(0.5, 0.014, 0.014), brassM, beam, 0, 0, 0);
  const pans = [-1, 1].map((sd) => {
    const g = new THREE.Group(); con.add(g);
    mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.012, 20), brassM, g, 0, 0, 0);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2, cx = 0.035 * Math.cos(a), cz = 0.035 * Math.sin(a); const ch = mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.23, 4), twoToneLam("#9a8a5a"), g, cx, 0.115, cz); ch.rotation.set(-cz * 0.6, 0, cx * 0.6); }
    plane(0.1, 0.04, basic(ctexPen("tag" + sd, 200, 80, (p) => brassTag(p, sd < 0 ? "REAL" : "FAKE"))), g, 0, -0.012, 0.08);
    return g;
  });

  for (const g of [store, garage, con]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  glass.castShadow = false;
  for (const [g, x0, x1, z0, z1, y, col] of [[store, -4.5, 4.5, -4.0, 5, 3.2, "#efe6cf"], [store, -0.2, 3.6, -7.8, -4.2, 2.6, "#5f5c3c"], [garage, -6, 6, -3.2, 8, 3.0, "#d9dde2"], [con, -8, 8, -6, 6, 4.2, "#2a2c33"]] as const) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), twoToneLam(col)); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; g.add(c);
  }
  return { groups, map, cage, cloth, brief, lid, tower, bricks, doorB, beam, pans };
};
