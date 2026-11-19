// The sets of the Fanatics unpaid Pikachu reel, built once: static scenery merged per material (Batch), plus the moving pieces
// as their own objects (bid board, date plate, wall calendar, office door, the three newspaper bundles, the street's stake signs).
// Tickets, stamps, steam, the level and the slab are flat cards placed by cast.ts. Positions come from plan.json.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { cork, frontPage } from "./art";
import { HALL, NEWS, STREET, MUSEUM, V3, obj, ORIGIN } from "./story";

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
const local = (set: keyof typeof ORIGIN, id: string) => { const o = obj(set, id), g = ORIGIN[set]; return { p: [o.p[0] - g[0], o.p[1] - g[1], o.p[2] - g[2]] as V3, s: o.s }; };

type Canvas = { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string };
export type Sets = {
  groups: Record<string, THREE.Group>;
  board: Canvas; date: Canvas; cal: Canvas; door: THREE.Group; strips: Canvas;
  bundles: THREE.Group[]; signs: { g: THREE.Group; stake: THREE.Mesh; face: THREE.Mesh; tex: Canvas }[];
};
export const STAGE_Y = 0.5, DESK_TOP = 1.47;
/** the street: house z positions (sign i stands at x -2.3, z HOUSE_Z[i] + 2) and the x of the three streets */
export const HOUSE_Z = [0, -7, -14, -21, -28], STREET_X = [0, -11, -21];

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const signMat = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 });
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };

  // ===== THE HALL (Fanatics Collect): the stage at x 0, the sold wall at x 4.4, the office door at x 6.0 =====
  const hall = G("hall", HALL);
  let b = new Batch();
  up(b, lam("carpet", () => ({ map: carpet() })), -6, 8.5, -5.2, 7, 0, 2);
  const panelM = lam("aucPanel", () => ({ color: "#2f5446" })), creamM = lam("aucCream", () => ({ map: rep(stucco("auc", "#efe4c8"), 1, 1) }));
  const dr = local("hall", "door"), dx0 = dr.p[0] - dr.s[0] / 2, dx1 = dr.p[0] + dr.s[0] / 2, DH = 2.1;
  const wallSeg = (x0: number, x1: number) => { box(b, panelM, x0, 0, -5.4, x1, 1.1, -5.2); box(b, creamM, x0, 1.1, -5.4, x1, 4.2, -5.2, 3); };
  wallSeg(-6, dx0); wallSeg(dx1, 8.5); box(b, creamM, dx0, DH, -5.4, dx1, 4.2, -5.2, 3);
  box(b, C("#5a3b2a"), dx0 - 0.08, 0, -5.19, dx0, DH + 0.08, -5.15); box(b, C("#5a3b2a"), dx1, 0, -5.19, dx1 + 0.08, DH + 0.08, -5.15); box(b, C("#5a3b2a"), dx0 - 0.08, DH, -5.19, dx1 + 0.08, DH + 0.08, -5.15);
  box(b, C("#1d1b22"), dx0 - 0.6, 0, -7.2, dx1 + 0.6, 3, -5.4); // the dark office behind the door (no light inside)
  for (const sd of [-1, 1]) { const x = sd < 0 ? -6 : 8.5; box(b, panelM, x, 0, -5.4, x + sd * 0.2, 1.1, 7); box(b, creamM, x, 1.1, -5.4, x + sd * 0.2, 4.2, 7, 3); }
  box(b, panelM, -6, 0, 7, 8.5, 1.1, 7.2); box(b, creamM, -6, 1.1, 7, 8.5, 4.2, 7.2, 3);
  for (const x of [-4.5, -2.5, 2.25]) { box(b, C("#6e4a30"), x - 0.5, 1.6, -5.2, x + 0.5, 2.5, -5.16); box(b, C(x < -3 ? "#c9a24a" : "#5a86b8"), x - 0.42, 1.68, -5.16, x + 0.42, 2.42, -5.14); }
  const st = local("hall", "stage"), woodM = C("#6e4428"), topM = C("#8a5a34");
  box(b, C("#7a5230"), st.p[0] - st.s[0] / 2, 0, -5.2, st.p[0] + st.s[0] / 2, STAGE_Y - 0.04, -4.0); box(b, topM, st.p[0] - st.s[0] / 2 - 0.03, STAGE_Y - 0.04, -5.2, st.p[0] + st.s[0] / 2 + 0.03, STAGE_Y, -3.97);
  box(b, woodM, -0.95, STAGE_Y, -4.5, 0.02, DESK_TOP - 0.05, -4.2); box(b, topM, -1.0, DESK_TOP - 0.05, -4.55, 0.06, DESK_TOP, -4.15);
  cyl(b, C("#c79b62"), -0.03, DESK_TOP, -4.32, 0.07, 0.07, 0.03, 16);
  const ca = local("hall", "columnA"); box(b, C("#8a5a34"), ca.p[0] - 0.11, STAGE_Y, ca.p[2] - 0.15, ca.p[0] + 0.11, 1.78, ca.p[2] + 0.15);
  // the sold wall: oak frame, cork face (a canvas), the filing cabinet with its 8 cm gap, the shredder, the tube light
  const sw = local("hall", "sold_wall"), [sx, sy] = [sw.p[0], sw.p[1]], [sW, sH] = [sw.s[0], sw.s[1]];
  box(b, C("#8a5a34"), sx - sW / 2 - 0.05, sy - sH / 2 - 0.05, -5.2, sx + sW / 2 + 0.05, sy + sH / 2 + 0.05, -5.18);
  const cb = local("hall", "cabinet"), grey = C("#8d949c"), greyD = C("#5b6170");
  box(b, grey, cb.p[0] - cb.s[0] / 2, 0, cb.p[2] - cb.s[2] / 2, cb.p[0] + cb.s[0] / 2, cb.s[1], cb.p[2] + cb.s[2] / 2);
  for (let i = 0; i < 3; i++) { const y0 = 0.06 + i * 0.29; box(b, greyD, cb.p[0] - cb.s[0] / 2 + 0.04, y0 + 0.26, cb.p[2] + cb.s[2] / 2, cb.p[0] + cb.s[0] / 2 - 0.04, y0 + 0.275, cb.p[2] + cb.s[2] / 2 + 0.005); box(b, C("#c9ccd2"), cb.p[0] - 0.09, y0 + 0.18, cb.p[2] + cb.s[2] / 2, cb.p[0] + 0.09, y0 + 0.2, cb.p[2] + cb.s[2] / 2 + 0.03); }
  const sh = local("hall", "shredder");
  box(b, C("#2a2c33"), sh.p[0] - 0.2, 0, sh.p[2] - 0.15, sh.p[0] + 0.2, 0.84, sh.p[2] + 0.15); box(b, C("#1a1a20"), sh.p[0] - 0.21, 0.84, sh.p[2] - 0.16, sh.p[0] + 0.21, 0.96, sh.p[2] + 0.16);
  box(b, C("#0c0c10"), sh.p[0] - 0.14, 0.955, sh.p[2] - 0.012, sh.p[0] + 0.14, 0.962, sh.p[2] + 0.012);
  b.build(hall);
  const corkTex = ctex("cork", 1300, 1700, (g) => cork(new Pen(g)));
  plane(sW, sH, new THREE.MeshLambertMaterial({ map: corkTex }), hall, sx, sy, -5.178);
  const tube = local("hall", "tube"); mesh(new THREE.BoxGeometry(tube.s[0], tube.s[1], tube.s[2]), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.7, 1.75) }), hall, tube.p[0], 3.6, tube.p[2]);
  plane(1.3, 0.17, new THREE.MeshBasicMaterial({ map: letters("", "SOLD HISTORY", "#2f5446"), transparent: true }), hall, sx, 3.32, -5.185);
  plane(2.6, 0.33, new THREE.MeshBasicMaterial({ map: letters("FANATICS", "COLLECT", "#d8b25a"), transparent: true }), hall, 0.3, 3.75, -5.18);
  const strips = canvasMat(200, 300); plane(0.3, 0.42, new THREE.MeshBasicMaterial({ map: strips.tex }), hall, sh.p[0], 0.4, sh.p[2] + 0.152);
  const board = canvasMat(800, 900), bo = local("hall", "board");
  mesh(new THREE.PlaneGeometry(bo.s[0], bo.s[1]), new THREE.MeshBasicMaterial({ map: board.tex }), hall, ...bo.p);
  const date = canvasMat(800, 200), dp = local("hall", "date_plate");
  mesh(new THREE.PlaneGeometry(dp.s[0], dp.s[1]), new THREE.MeshBasicMaterial({ map: date.tex }), hall, ...dp.p);
  const cal = canvasMat(420, 300), cl = local("hall", "calendar");
  mesh(new THREE.PlaneGeometry(cl.s[0], cl.s[1]), new THREE.MeshLambertMaterial({ map: cal.tex }), hall, ...cl.p);
  // the office door: hinged on its left edge (origin), swings inward (-z)
  const door = new THREE.Group(); door.position.set(dx0, 0, -5.2); hall.add(door);
  mesh(new THREE.BoxGeometry(dr.s[0], DH, 0.05), twoToneLam("#7a4f33"), door, dr.s[0] / 2, DH / 2, -0.03);
  mesh(new THREE.SphereGeometry(0.035, 12, 8), twoToneLam("#d8a83a"), door, dr.s[0] - 0.1, 1.0, 0.02);
  plane(0.4, 0.12, new THREE.MeshBasicMaterial({ map: letters("", "OFFICE", "#2a201a") }), door, dr.s[0] / 2, 1.6, 0.0);

  // ===== THE NEWSSTAND =====
  const news = G("newsstand", NEWS);
  b = new Batch();
  up(b, M.asphalt(), -12, 12, 2.2, 12, 0, 6); up(b, M.walk(), -12, 12, -4, 2.2, 0.01, 2);
  const kioskM = C("#2f7a4c");
  box(b, kioskM, -1.1, 0, -1.6, 1.1, 2.4, -0.25); box(b, kioskM, -0.95, 0, -0.3, 0.95, 0.96, 0.3); box(b, C("#d9d1c3"), -0.9, 0.96, -0.3, 0.9, 1.0, 0.3);
  for (let i = 0; i < 6; i++) slab(b, C(i % 2 ? "#f4f1ea" : "#d8322f"), -0.95 + i * 0.38, 2.5, 0.25, 0.38, 0.03, 0.9, 0, 0.35); // striped awning
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) box(b, C(["#e2453c", "#3f7fc9", "#ffcf3a", "#3f9a55", "#c56bff", "#f08a3c"][(i + r) % 6]), -0.95 + i * 0.32, 1.25 + r * 0.32, -0.27, -0.7 + i * 0.32, 1.52 + r * 0.32, -0.24);
  box(b, C("#9fd0f2"), -3.5, 0, -4, 3.5, 3.4, -3.8); // shop windows behind
  b.build(news);
  const edges = new THREE.MeshLambertMaterial({ map: ctex("paperEdges", 64, 128, (g) => { g.fillStyle = "#efeae0"; g.fillRect(0, 0, 64, 128); g.fillStyle = "rgba(90,84,70,0.5)"; for (let y = 2; y < 128; y += 4) g.fillRect(0, y, 64, 1.2); }) });
  const bundles = [0, 1, 2].map((i) => {
    const g = new THREE.Group(); news.add(g);
    const top = ctex("front" + i, 600, 840, (gg) => frontPage(new Pen(gg), i as 0 | 1 | 2));
    mesh(new THREE.BoxGeometry(0.3, 0.1, 0.42), [edges, edges, new THREE.MeshLambertMaterial({ map: top }), edges, edges, edges], g, 0, 0.05, 0);
    mesh(new THREE.BoxGeometry(0.012, 0.104, 0.43), twoToneLam("#c9a06a"), g, 0.06, 0.05, 0); mesh(new THREE.BoxGeometry(0.31, 0.104, 0.012), twoToneLam("#c9a06a"), g, 0, 0.05, -0.1);
    return g;
  });

  // ===== THE STREET (the "you see" set): three streets of five houses, stake signs =====
  const street = G("street", STREET);
  b = new Batch();
  up(b, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), -60, 30, -70, 30, 0, 6);
  for (const X of STREET_X) { up(b, M.asphalt(), X - 0.5, X + 3.5, -70, 30, 0.01, 4); up(b, M.walk(), X - 1.3, X - 0.5, -70, 30, 0.012, 2); }
  const walls = ["#f2d7a8", "#bfe0d2", "#f4c4c4", "#c9d6f0", "#f6e7b0"];
  const roofM = lam("roofHD", () => ({ map: rep(roofHD("#b85a42"), 2, 2) }));
  for (const X of STREET_X) HOUSE_Z.forEach((z, i) => {
    const x0 = X - 7, x1 = X - 3, z0 = z - 2.2, z1 = z + 2.2, wm = C(walls[(i + (X < 0 ? 2 : 0)) % 5]), h = 2.8;
    box(b, wm, x0, 0, z0, x1, h, z1);
    const g = new THREE.BufferGeometry(); // gable roof along z
    const v = [x0 - 0.2, h, z0 - 0.2, x1 + 0.2, h, z0 - 0.2, (x0 + x1) / 2, h + 1.5, z0 - 0.2, x0 - 0.2, h, z1 + 0.2, x1 + 0.2, h, z1 + 0.2, (x0 + x1) / 2, h + 1.5, z1 + 0.2];
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3)); g.setIndex([0, 2, 1, 3, 4, 5, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 4]); g.computeVertexNormals();
    b.add(g, roofM);
    box(b, C("#7a4f33"), x1, 0, z - 0.45, x1 + 0.03, 2.0, z + 0.45); box(b, M.glass(), x1, 1.0, z0 + 0.5, x1 + 0.03, 2.0, z0 + 1.5); box(b, M.glass(), x1, 1.0, z1 - 1.5, x1 + 0.03, 2.0, z1 - 0.5);
    bush(b, x1 + 0.6, 0, z0 - 0.6, 0.6);
  });
  for (let k = 0; k < 8; k++) { const z = -40 - 5 * k; cyl(b, M.trunk(), 6 + 2 * Math.sin(k), 0, z, 0.25, 0.2, 2.5, 8); sph(b, M.bush(), 6 + 2 * Math.sin(k), 3.2, z, 1.6); }
  b.build(street);
  const signs = STREET_X.flatMap((X) => HOUSE_Z.map((z) => {
    const g = new THREE.Group(); g.position.set(X - 2.3, 0, z + 2); street.add(g);
    const stake = mesh(new THREE.BoxGeometry(0.05, 1, 0.05).translate(0, 0.5, 0), twoToneLam("#f4f1ea"), g);
    const tex = canvasMat(420, 290), face = mesh(new THREE.PlaneGeometry(0.7, 0.48), new THREE.MeshLambertMaterial({ map: tex.tex, side: THREE.DoubleSide }), g, 0, 1, 0.03);
    return { g, stake, face, tex };
  }));

  // ===== THE MUSEUM (dark gallery, one case) =====
  const museum = G("museum", MUSEUM);
  b = new Batch();
  up(b, C("#3a2a22"), -5, 5, -5, 5, 0, 1);
  box(b, C("#2a2a33"), -5, 0, -5.2, 5, 4, -5); for (const sd of [-1, 1]) box(b, C("#2a2a33"), sd * 5, 0, -5.2, sd * 5.2, 4, 5);
  const pl = local("museum", "plinth"); box(b, C("#f2efe8"), pl.p[0] - 0.3, 0, pl.p[2] - 0.3, pl.p[0] + 0.3, 1.1, pl.p[2] + 0.3);
  const brassM = C("#c9a24a"); for (const [x, z] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) box(b, brassM, x - 0.012, 1.1, z - 0.012, x + 0.012, 1.6, z + 0.012);
  box(b, brassM, -0.26, 1.59, -0.26, 0.26, 1.61, 0.26); box(b, brassM, -0.26, 1.1, -0.26, 0.26, 1.12, 0.26);
  box(b, C("#e9eef2"), -0.06, 1.12, -0.04, 0.06, 1.15, 0.04); // the acrylic foot of the slab stand
  for (const x of [-3.6, 3.6]) { box(b, C("#6e4a30"), x - 0.6, 1.4, -5.0, x + 0.6, 2.4, -4.96); box(b, C(x < 0 ? "#5a86b8" : "#9c5a3a"), x - 0.52, 1.48, -4.96, x + 0.52, 2.32, -4.94); }
  b.build(museum);
  const glassCase = mesh(new THREE.BoxGeometry(0.5, 0.48, 0.5), new THREE.MeshBasicMaterial({ color: "#cfe6f2", transparent: true, opacity: 0.12, depthWrite: false }), museum, 0, 1.35, 0); glassCase.renderOrder = 3;

  for (const g of [hall, news, street, museum]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  for (const [g, x0, x1, z0, z1, y, col] of [[hall, -6, 8.5, -5.2, 7, 4.2, "#e9dfc6"], [museum, -5, 5, -5, 5, 4, "#1d1b22"]] as const) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), twoToneLam(col)); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; g.add(c);
  }
  return { groups, board, date, cal, door, strips, bundles, signs };
};
