// The sets of the Mudkip Art Academy reel, built once: static scenery merged per material (Batch), plus the moving pieces as
// their own objects (money sack and bundles, lot columns, price board and date plate, press head, handheld console, parcel and
// the block of 100 cards, the balance with its pans and the villa, the loupe). Positions come from plan.json where they matter.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "./geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick } from "./paint";
import { Pen } from "./toon";
import { untone } from "./shade";
import { NOINK } from "./ink";
import { tcard, numeral, loupeGlass } from "./art";
import { AUCTION, FACTORY, ROOM, SHOP, LAWN, TABLE, V3, obj, ORIGIN } from "./story";

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
  sack: THREE.Group; sackBody: THREE.Mesh; bundles: THREE.Mesh[]; colA: THREE.Mesh; colB: THREE.Mesh; numA: THREE.Mesh; numB: THREE.Mesh;
  board: Canvas; date: Canvas; cushion: THREE.Mesh;
  press: THREE.Group; beltTex: THREE.Texture;
  console: THREE.Group; lower: Canvas; upper: Canvas; stylus: THREE.Mesh; parcel: THREE.Group; block: THREE.Mesh;
  beam: THREE.Group; panNear: THREE.Group; panFar: THREE.Group; villa: THREE.Group;
  loupe: THREE.Group;
};
export const COL_W = 0.22, STAGE_Y = 0.5, DESK_TOP = 1.47;

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const planks = lam("planksHD", () => ({ map: rep(planksHD(), 1, 1) }));
  const cardM = lam("cardboard", () => ({ map: cardboard() }));

  // ===== AUCTION ROOM =====
  const auction = G("auction", AUCTION);
  let b = new Batch();
  up(b, lam("carpet", () => ({ map: carpet() })), -6, 6, -5.2, 7, 0, 2);
  const panelM = lam("aucPanel", () => ({ color: "#2f5446" })), creamM = lam("aucCream", () => ({ map: rep(stucco("auc", "#efe4c8"), 1, 1) }));
  box(b, panelM, -6, 0, -5.4, 6, 1.1, -5.2); box(b, creamM, -6, 1.1, -5.4, 6, 4.2, -5.2, 3);
  for (const s of [-1, 1]) { box(b, panelM, s * 6, 0, -5.4, s * 6 + s * 0.2, 1.1, 7); box(b, creamM, s * 6, 1.1, -5.4, s * 6 + s * 0.2, 4.2, 7, 3); }
  box(b, panelM, -6, 0, 7, 6, 1.1, 7.2); box(b, creamM, -6, 1.1, 7, 6, 4.2, 7.2, 3);
  box(b, C("#5a3b2a"), 5.98, 0, 4.0, 6.02, 2.3, 5.2);
  for (const x of [-4.5, -2.5, 2.5, 4.5]) { box(b, C("#6e4a30"), x - 0.5, 1.6, -5.2, x + 0.5, 2.5, -5.16); box(b, C(["#c9a24a", "#5a86b8", "#9c5a3a", "#5fae5a"][(x + 4.5) / 2 | 0]), x - 0.42, 1.68, -5.16, x + 0.42, 2.42, -5.14); }
  // the stage, the rostrum desk (top at DESK_TOP) with its sound block, the cash desk by the entrance
  const st = local("auction", "stage"), woodM = C("#6e4428"), topM = C("#8a5a34");
  box(b, C("#7a5230"), st.p[0] - st.s[0] / 2, 0, -5.2, st.p[0] + st.s[0] / 2, STAGE_Y - 0.04, -4.0); box(b, topM, st.p[0] - st.s[0] / 2 - 0.03, STAGE_Y - 0.04, -5.2, st.p[0] + st.s[0] / 2 + 0.03, STAGE_Y, -3.97);
  box(b, woodM, -0.95, STAGE_Y, -4.5, 0.02, DESK_TOP - 0.05, -4.2); box(b, topM, -1.0, DESK_TOP - 0.05, -4.55, 0.06, DESK_TOP, -4.15);
  cyl(b, C("#c79b62"), -0.03, DESK_TOP, -4.32, 0.07, 0.07, 0.03, 16);
  box(b, C("#7a4f33"), 2.0, 0, 2.55, 4.0, 0.95, 2.95); box(b, C("#d9d1c3"), 1.95, 0.95, 2.5, 4.05, 1.0, 3.0);
  box(b, lam("acrylic", () => ({ color: "#dfeef6" })), 3.66, 1.0, 2.74, 3.78, 1.02, 2.82);
  b.build(auction);
  const name = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.33), new THREE.MeshBasicMaterial({ map: letters("AUCTION", "", "#d8b25a"), transparent: true }));
  name.position.set(0.5, 3.7, -5.18); auction.add(name);
  const board = canvasMat(1160, 440), bo = local("auction", "board");
  mesh(new THREE.PlaneGeometry(bo.s[0], bo.s[1]), new THREE.MeshBasicMaterial({ map: board.tex, transparent: true, alphaTest: 0.5 }), auction, ...bo.p);
  const date = canvasMat(800, 200), dp = local("auction", "date_plate");
  mesh(new THREE.PlaneGeometry(dp.s[0], dp.s[1]), new THREE.MeshBasicMaterial({ map: date.tex }), auction, ...dp.p);
  // lot columns: unit-height posts scaled to their top height; light-up numerals on their fronts
  const ca = local("auction", "columnA"), cb = local("auction", "columnB"), colG = new THREE.BoxGeometry(COL_W, 1, 0.3).translate(0, 0.5, 0);
  const colA = mesh(colG, twoToneLam("#8a5a34"), auction, ca.p[0], STAGE_Y, ca.p[2]), colB = mesh(colG, twoToneLam("#8a5a34"), auction, cb.p[0], STAGE_Y, cb.p[2]);
  const numM = (s: string) => new THREE.MeshBasicMaterial({ map: ctex("numeral" + s, 220, 300, (g) => numeral(new Pen(g), s)), transparent: true });
  const numA = mesh(new THREE.PlaneGeometry(0.17, 0.232), numM("1"), auction, ca.p[0], 1, ca.p[2] + 0.153), numB = mesh(new THREE.PlaneGeometry(0.17, 0.232), numM("2"), auction, cb.p[0], 1, cb.p[2] + 0.153);
  // the money sack (squashes on impact) and its bundles; the attendant's red velvet cushion
  const sack = new THREE.Group(); auction.add(sack);
  const canvasCol = twoToneLam("#d8c49a");
  const sackBody = mesh(new THREE.SphereGeometry(0.22, 20, 14), canvasCol, sack);
  mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.12, 12), canvasCol, sack, 0, 0.24, 0); mesh(new THREE.TorusGeometry(0.075, 0.014, 6, 16).rotateX(Math.PI / 2), twoToneLam("#7a5a3a"), sack, 0, 0.2, 0);
  mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshBasicMaterial({ map: ctex("sackDollar", 128, 128, (g) => { g.fillStyle = "#3f7a3a"; g.font = "900 120px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$", 64, 70); }), transparent: true }), sack, 0, 0, 0.222);
  const bundleM = [C("#6fb86a"), C("#6fb86a"), new THREE.MeshLambertMaterial({ map: ctex("bundleTop", 128, 56, (g) => { g.fillStyle = "#8fd18a"; g.fillRect(0, 0, 128, 56); g.fillStyle = "#f6f2e6"; g.fillRect(50, 0, 28, 56); g.strokeStyle = "#3f7a3a"; g.lineWidth = 4; g.strokeRect(4, 4, 120, 48); }) }), C("#6fb86a"), C("#eaf2e0"), C("#eaf2e0")];
  const bundles: THREE.Mesh[] = []; for (let i = 0; i < 14; i++) bundles.push(mesh(new THREE.BoxGeometry(0.15, 0.025, 0.065), bundleM, auction));
  const cushion = mesh(new THREE.BoxGeometry(0.26, 0.06, 0.2), twoToneLam("#b0242c"), root);

  // ===== CARD FACTORY =====
  const factory = G("factory", FACTORY);
  b = new Batch();
  up(b, M.walk(), -9, 9, -4, 4, 0, 3);
  const sideM = lam("sidingfac", () => ({ map: rep(siding("fac", "#b9cfe0"), 2, 2) }));
  box(b, sideM, -7.2, 0, -4, -7, 5.2, 4, 3); box(b, sideM, -9, 0, -4.2, 9, 5.2, -4, 3); box(b, sideM, -9, 0, 4, 9, 5.2, 4.2, 3);
  for (const z of [-2.4, 2.4]) { box(b, M.white(), -7.02, 2.6, z - 0.8, -6.98, 4.2, z + 0.8); box(b, M.glass(), -6.97, 2.7, z - 0.7, -6.95, 4.1, z + 0.7); }
  box(b, C("#2c2a33"), -7.0, 0.7, -0.55, -6.9, 1.5, 0.55); // the slot the belt comes out of
  const steel = C("#8d949c"), yel = C("#f2c84a");
  box(b, steel, -7, 0.72, -0.44, 8, 0.82, -0.36); box(b, steel, -7, 0.72, 0.36, 8, 0.82, 0.44);
  for (let x = -6; x <= 7; x += 1.5) for (const z of [-0.4, 0.4]) box(b, steel, x - 0.04, 0, z - 0.04, x + 0.04, 0.72, z + 0.04);
  for (const z of [-0.62, 0.62]) box(b, yel, -0.08, 0, z - 0.08, 0.08, 2.3, z + 0.08);
  box(b, yel, -0.14, 2.3, -0.75, 0.14, 2.56, 0.75); box(b, C("#2c2a33"), -0.3, 2.56, -0.3, 0.3, 2.9, 0.3);
  box(b, C("#5b6170"), -4.4, 0.95, -0.6, -3.2, 2.1, 0.6); box(b, C("#3f7fc9"), -4.5, 2.1, -0.7, -3.1, 2.3, 0.7); // the blank feeder
  for (const [x, z] of [[-5.5, -2.8], [-2.5, -3.0], [2.0, -3.1]] as const) { box(b, cardM, x - 0.5, 0, z - 0.4, x + 0.5, 0.7, z + 0.4); box(b, cardM, x - 0.4, 0.7, z - 0.35, x + 0.45, 1.3, z + 0.35); }
  b.build(factory);
  const beltTex = rep(ctex("belt", 256, 64, (g) => { g.fillStyle = "#3a3d46"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#2a2c33"; g.fillRect(0, 0, 14, 64); g.fillStyle = "rgba(255,255,255,0.06)"; g.fillRect(14, 0, 6, 64); }), 20, 1);
  mesh(new THREE.BoxGeometry(15, 0.1, 0.7), [C("#3a3d46"), C("#3a3d46"), new THREE.MeshLambertMaterial({ map: beltTex }), C("#3a3d46"), C("#3a3d46"), C("#3a3d46")], factory, 0.5, 0.85, 0);
  const press = new THREE.Group(); factory.add(press); // origin = the bottom face of the head
  mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), twoToneLam("#8d949c"), press, 0, 0.15, 0); mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 12), twoToneLam("#c9ccd2"), press, 0, 1.1, 0);

  // ===== DAISUKE'S ROOM =====
  const room = G("room", ROOM);
  b = new Batch();
  up(b, planks, -3, 3, -2.6, 3.4, 0, 4);
  const sw = lam("roomWall", () => ({ map: rep(stucco("room", "#ece0c8"), 1, 1) }));
  box(b, sw, -3, 0, -2.8, 3, 2.7, -2.6, 3);
  box(b, sw, -3.2, 0, -2.8, -3, 2.7, 3.4, 3);
  box(b, M.white(), -2.5, 0.95, -2.62, -1.1, 2.2, -2.58); box(b, C("#9cc8ec"), -2.42, 1.03, -2.63, -1.18, 2.12, -2.6); box(b, M.white(), -1.83, 1.03, -2.63, -1.77, 2.12, -2.6);
  const shelfM = C("#7a4f33");
  box(b, shelfM, 1.0, 0, -2.6, 1.05, 2.0, -2.25); box(b, shelfM, 2.45, 0, -2.6, 2.5, 2.0, -2.25); box(b, shelfM, 1.0, 0, -2.62, 2.5, 2.0, -2.58);
  for (const y of [0.05, 0.55, 1.05, 1.55, 1.95]) box(b, shelfM, 1.0, y, -2.6, 2.5, y + 0.04, -2.25);
  for (let i = 0; i < 12; i++) box(b, C(["#c9a24a", "#5a6f8f", "#9c2f3a", "#3f9a55", "#e2453c"][i % 5]), 1.1 + i * 0.09, 1.09, -2.5, 1.17 + i * 0.09, 1.35 + 0.05 * (i % 3), -2.3);
  for (let i = 0; i < 5; i++) cyl(b, C(["#e2453c", "#ffcf3a", "#3f7fc9", "#3f9a55", "#c56bff"][i]), 1.2 + i * 0.22, 0.59, -2.4, 0.06, 0.06, 0.14, 12); // paint pots
  for (const [x, c] of [[-0.6, "#f2c84a"], [0.2, "#9fd0f2"], [0.9, "#f4b6c2"]] as const) { box(b, M.white(), x - 0.3, 1.5, -2.6, x + 0.3, 2.3, -2.58); box(b, C(c), x - 0.26, 1.54, -2.585, x + 0.26, 2.26, -2.57); } // his sketches on the wall
  const deskM = C("#8a5a34");
  box(b, deskM, -0.95, 0.71, -0.72, 0.75, 0.76, 0.15);
  for (const [x, z] of [[-0.9, -0.67], [0.7, -0.67], [-0.9, 0.1], [0.7, 0.1]] as const) box(b, deskM, x - 0.03, 0, z - 0.03, x + 0.03, 0.71, z + 0.03);
  box(b, deskM, -0.95, 0.35, 0.1, 0.75, 0.71, 0.15);
  box(b, C("#3f5a7a"), -0.25, 0.45, -1.25, 0.25, 0.5, -0.85); box(b, C("#3f5a7a"), -0.25, 0.5, -1.3, 0.25, 1.1, -1.25);
  box(b, C("#2a3a63"), 0.5, 0.76, -0.1, 0.65, 0.79, 0.05); cyl(b, C("#2a3a63"), 0.57, 0.79, -0.03, 0.012, 0.012, 0.35, 6);
  for (let i = 0; i < 4; i++) cyl(b, C(["#e2453c", "#3f7fc9", "#ffcf3a", "#3f9a55"][i]), -0.75 + i * 0.03, 0.76, -0.05 + i * 0.012, 0.008, 0.008, 0.16, 6, new THREE.Euler(Math.PI / 2, 0, 0.5 * i)); // pencils
  box(b, lam("rugS", () => ({ map: carpet() })), -1.4, 0.003, -1.6, 1.4, 0.008, 1.2, 1);
  b.build(room);
  // the handheld: base with the lower touch screen, lid hinged on the far (+z) edge, open 165 degrees
  const co = local("room", "console"), shell = twoToneLam("#9fc6e8"), scrG = (w: number, h: number) => new THREE.PlaneGeometry(w, h);
  const cons = new THREE.Group(); cons.position.set(...co.p); cons.position.y = 0.76; room.add(cons);
  mesh(new THREE.BoxGeometry(0.25, 0.022, 0.15), shell, cons, 0, 0.011, 0);
  const lower = canvasMat(520, 392), upper = canvasMat(680, 408);
  const lowS = mesh(scrG(0.13, 0.098), new THREE.MeshBasicMaterial({ map: lower.tex }), cons, 0, 0.0232, 0); lowS.rotation.set(-Math.PI / 2, 0, Math.PI);
  mesh(new THREE.BoxGeometry(0.144, 0.001, 0.112), twoToneLam("#26242b"), cons, 0, 0.0221, 0);
  for (const [x, z] of [[0.095, 0.0], [0.11, -0.016], [0.08, -0.016], [0.095, -0.032]] as const) mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 10), twoToneLam("#f4f1ea"), cons, x, 0.024, z);
  mesh(new THREE.BoxGeometry(0.03, 0.004, 0.01), twoToneLam("#3a3d46"), cons, -0.095, 0.024, -0.016); mesh(new THREE.BoxGeometry(0.01, 0.004, 0.03), twoToneLam("#3a3d46"), cons, -0.095, 0.024, -0.016);
  const hinge = new THREE.Group(); hinge.position.set(0, 0.022, 0.075); hinge.rotation.x = -THREE.MathUtils.degToRad(35); cons.add(hinge);
  mesh(new THREE.BoxGeometry(0.25, 0.012, 0.15), shell, hinge, 0, 0, 0.075);
  mesh(new THREE.BoxGeometry(0.184, 0.001, 0.116), twoToneLam("#26242b"), hinge, 0, 0.0061, 0.075);
  const upS = mesh(scrG(0.17, 0.102), new THREE.MeshBasicMaterial({ map: upper.tex }), hinge, 0, 0.0075, 0.075); upS.rotation.set(-Math.PI / 2, 0, Math.PI);
  const stylus = mesh(new THREE.CylinderGeometry(0.004, 0.0025, 0.16, 8).translate(0, 0.08, 0), twoToneLam("#f4f1ea"), room); // origin = the tip
  // the parcel (open, flaps folded out) and the block of 100 cards
  const pa = local("room", "parcel"), parcel = new THREE.Group(); parcel.position.set(pa.p[0], 0.76, pa.p[2]); room.add(parcel);
  b = new Batch();
  const [pw, ph, pd] = pa.s;
  box(b, cardM, -pw / 2, 0, -pd / 2, pw / 2, 0.01, pd / 2);
  box(b, cardM, -pw / 2, 0, -pd / 2, -pw / 2 + 0.008, ph, pd / 2); box(b, cardM, pw / 2 - 0.008, 0, -pd / 2, pw / 2, ph, pd / 2);
  box(b, cardM, -pw / 2, 0, -pd / 2, pw / 2, ph, -pd / 2 + 0.008); box(b, cardM, -pw / 2, 0, pd / 2 - 0.008, pw / 2, ph, pd / 2);
  slab(b, cardM, -pw / 2 - 0.07, ph - 0.035, 0, 0.16, 0.006, pd, 0.5); slab(b, cardM, pw / 2 + 0.07, ph - 0.035, 0, 0.16, 0.006, pd, -0.5);
  slab(b, cardM, 0, ph - 0.035, pd / 2 + 0.07, pw, 0.006, 0.16, 0, 0.5); slab(b, cardM, 0, ph - 0.035, -pd / 2 - 0.07, pw, 0.006, 0.16, 0, -0.5);
  b.build(parcel);
  const bs = local("room", "stack100").s, edge = new THREE.MeshLambertMaterial({ map: ctex("cardEdges", 64, 256, (g) => { g.fillStyle = "#f4f1e8"; g.fillRect(0, 0, 64, 256); g.fillStyle = "rgba(90,84,70,0.5)"; for (let y = 2; y < 256; y += 5) g.fillRect(0, y, 64, 1.4); }) });
  const topTex = ctex("blockTop", 420, 586, (g) => tcard(new Pen(g), 0, 0, 0, 420, 586, { img: "mudkip_aa" }));
  const top = new THREE.MeshLambertMaterial({ map: topTex, emissive: new THREE.Color("#ffffff"), emissiveMap: topTex, emissiveIntensity: 0.45 }); // the card reads even when he tips it into his own shadow
  const block = mesh(new THREE.BoxGeometry(bs[0], bs[1], bs[2]), [edge, edge, top, C("#f4f1e8"), edge, edge], root);

  // ===== CARD SHOP =====
  const shop = G("shop", SHOP);
  b = new Batch();
  up(b, lam("tiles", () => ({ map: rep(tiles(), 1, 1) })), -5, 5, -1.2, 6, 0, 2);
  const shopW = lam("shopWall", () => ({ map: rep(stucco("shop", "#f1d9a8"), 1, 1) }));
  box(b, shopW, -5, 0, -1.4, 5, 3.4, -1.2, 3); box(b, shopW, -5.2, 0, -1.4, -5, 3.4, 6, 3); box(b, shopW, 5, 0, -1.4, 5.2, 3.4, 6, 3);
  for (const y of [0.85, 1.35, 1.85, 2.35]) { box(b, shelfM, -2.6, y, -1.2, 2.6, y + 0.04, -0.78);
    for (let i = 0; i < 13; i++) { const x = -2.4 + i * 0.4, c = ["#e2453c", "#3f7fc9", "#ffcf3a", "#3f9a55", "#c56bff", "#f08a3c"][(i + Math.round(y * 4)) % 6]; box(b, C(c), x - 0.16, y + 0.04, -1.15, x + 0.16, y + 0.38, -0.86); box(b, C("#fbf7ec"), x - 0.1, y + 0.14, -0.861, x + 0.1, y + 0.28, -0.855); } }
  box(b, C("#7a4f33"), -0.1, 0, 0.6, 1.3, 0.9, 1.1); box(b, M.glass(), -0.04, 0.12, 1.1, 1.24, 0.82, 1.11); box(b, C("#d9d1c3"), -0.15, 0.9, 0.55, 1.35, 0.95, 1.15);
  box(b, C("#2c2a33"), 0.95, 0.95, 0.65, 1.25, 1.2, 0.95); box(b, C("#5b6170"), 0.98, 1.2, 0.68, 1.22, 1.3, 0.8); // the till
  b.build(shop);
  const shopName = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.35), new THREE.MeshBasicMaterial({ map: letters("CARD SHOP", "", "#c23a32"), transparent: true }));
  shopName.position.set(0.6, 3.0, -1.18); shop.add(shopName);

  // ===== THE LAWN: a giant balance, unequal arms (2.5 m near, 7.5 m far) =====
  const lawn = G("lawn", LAWN);
  b = new Batch();
  up(b, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), -90, 90, -90, 90, 0, 6);
  const pv = local("lawn", "scale_post").p, brass = twoToneLam("#d8a83a"), brassB = lam("brassB", () => ({ color: "#d8a83a" }));
  cyl(b, C("#b9b2a0"), pv[0], 0, pv[2], 0.75, 0.6, 0.35, 20); cyl(b, brassB, pv[0], 0.35, pv[2], 0.16, 0.11, 4.95, 14); sph(b, brassB, pv[0], 5.32, pv[2], 0.2);
  for (const [x, z, h] of [[-9, -16, 4], [6, -20, 5], [-16, -9, 4.5], [12, -12, 4], [-5, -24, 5], [16, -22, 4.5]] as const) { cyl(b, M.trunk(), x, 0, z, 0.3, 0.22, h * 0.5, 8); sph(b, M.bush(), x, h * 0.75, z, h * 0.4); }
  for (let x = -40; x <= 40; x += 2.2) bush(b, x, 0, -30 + 1.5 * Math.sin(x), 2.2);
  b.build(lawn);
  const beam = new THREE.Group(); beam.position.set(pv[0], 5.2, pv[2]); beam.rotation.order = "YXZ"; lawn.add(beam); // +x = toward the near pan
  mesh(new THREE.BoxGeometry(10, 0.16, 0.16), brass, beam, -2.5, 0, 0);
  const mkPan = (r: number, hang: number) => {
    const g = new THREE.Group(); lawn.add(g); // origin = the beam end; the dish hangs `hang` below, plumb
    mesh(new THREE.CylinderGeometry(r, r * 0.92, 0.06, 28), brass, g, 0, -hang, 0);
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5, e = V(Math.cos(a) * r * 0.95, -hang + 0.03, Math.sin(a) * r * 0.95), L = e.length();
      const c = mesh(new THREE.CylinderGeometry(0.012, 0.012, L, 6).translate(0, -L / 2, 0), brass, g); c.quaternion.setFromUnitVectors(V(0, -1, 0), e.clone().normalize()); }
    return g;
  };
  const HANG = 4.175, panNear = mkPan(local("lawn", "pan_near").s[0] / 2, HANG), panFar = mkPan(local("lawn", "pan_far").s[0] / 2, HANG);
  const villa = new THREE.Group(); panFar.add(villa); villa.position.y = -HANG + 0.03;
  b = new Batch();
  const wh = lam("villaW", () => ({ color: "#f6f3ec" })), roofD = C("#4a4f5c");
  box(b, C("#cfc7b6"), -1.5, 0, -1.2, 1.5, 0.08, 1.45); // the plot: a stone deck
  box(b, wh, -1.3, 0.08, -1.1, 1.3, 1.0, 0.5); box(b, roofD, -1.4, 1.0, -1.2, 1.4, 1.08, 0.7);
  box(b, wh, -1.2, 1.08, -1.0, 0.3, 1.9, 0.3); box(b, roofD, -1.3, 1.9, -1.1, 0.45, 1.98, 0.45);
  box(b, M.glass(), -1.1, 0.2, 0.5, 0.2, 0.9, 0.52); box(b, C("#8a5a34"), 0.55, 0.08, 0.5, 0.95, 0.9, 0.52); box(b, M.glass(), -1.0, 1.25, 0.3, 0.1, 1.8, 0.32);
  box(b, lam("pool", () => ({ color: "#3fb0e0" })), -1.2, 0.08, 0.8, 0.4, 0.11, 1.3); box(b, M.white(), -1.26, 0.08, 0.74, 0.46, 0.1, 1.36);
  palm(b, 1.05, 0.08, 0.95, 1.5, 2);
  b.build(villa);

  // ===== TABLE (top-down macro for the explanation) =====
  const table = G("table", TABLE);
  b = new Batch();
  up(b, lam("tableTop", () => ({ map: rep(planksHD(), 1, 1) })), -2, 2, -2, 2, 0, 1.2);
  up(b, lam("mat", () => ({ map: rep(ctex("cutMat", 256, 256, (g) => { g.fillStyle = "#3f8f6a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 2; g.strokeRect(0, 0, 256, 256); g.lineWidth = 1; for (let k = 64; k < 256; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); } }), 1, 1) })), -0.6, 0.6, -0.75, 0.75, 0.002, 0.1);
  b.build(table);
  const loupe = new THREE.Group(); root.add(loupe); // origin = the centre of the glass
  mesh(new THREE.TorusGeometry(0.04, 0.005, 8, 28).rotateX(Math.PI / 2), brass, loupe);
  mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.07, 8).rotateZ(Math.PI / 2), twoToneLam("#5a3b2a"), loupe, 0.08, 0, 0);
  const glass = mesh(new THREE.CircleGeometry(0.039, 28), new THREE.MeshBasicMaterial({ map: ctex("loupeGlass", 300, 300, (g) => loupeGlass(new Pen(g))), transparent: true }), loupe, 0, 0.001, 0); glass.rotation.x = -Math.PI / 2;

  for (const g of [auction, factory, room, shop, lawn, table]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  // ceilings: seen from below, but they let the key light through (no shadow), so the rooms stay lit like the open sets
  for (const [g, x0, x1, z0, z1, y, col] of [[auction, -6, 6, -5.2, 7, 4.2, "#e9dfc6"], [factory, -7, 9, -4, 4, 5.2, "#c9d6e2"], [shop, -5, 5, -1.2, 6, 3.4, "#f4e6c4"], [room, -3, 3, -2.6, 3.4, 2.7, "#f2ead8"]] as const) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), twoToneLam(col)); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; g.add(c);
  }
  for (const o of [cushion, block]) { o.castShadow = true; o.receiveShadow = true; }
  return { groups, sack, sackBody, bundles, colA, colB, numA, numB, board, date, cushion, press, beltTex, console: cons, lower, upper, stylus, parcel, block, beam, panNear, panFar, villa, loupe };
};
