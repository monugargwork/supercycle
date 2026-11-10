// The sets of the attic Pokémon reel, built once: static scenery merged per material (Batch), plus the moving pieces as
// their own objects (loft hatch + cord + sliding ladder, the binder stack with its dust, an openable binder, the CRT and the
// flat screen, parcels, the newspaper, the price board, the attic glow). Painted textures follow the bridge recipe.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "./geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick } from "./paint";
import { Pen } from "./toon";
import { untone } from "./shade";
import { NOINK } from "./ink";
import { binderPage, crtPage, newspaper, priceBoard } from "./art";
import { STUDY, SCHOOL, AUCTION, INSERT, CEIL, AFLOOR, HATCH, LADDER_TOP, LADDER_BOT, BINDER, STACK_AT, V3 } from "./story";

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


/** a binder lying flat, spine toward +z: cover, page block, spine, white spine label (canvas text) */
const BCOL = ["#24407a", "#c23a32", "#2f8a4c", "#3b4f9e", "#6b3f8f", "#2f8a4c"];
const spineTex = (txt: string, col: string) => ctex("spine" + txt + col, 512, 112, (g) => {
  g.fillStyle = col; g.fillRect(0, 0, 512, 112);
  g.fillStyle = "#f6f2e6"; g.fillRect(120, 22, 272, 68);
  g.fillStyle = "#2a2733"; g.font = "800 44px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 256, 58);
});
const binderMesh = (col: string, txt: string) => {
  const g = new THREE.Group(), { w, h, d } = BINDER;
  const cover = lam("bind" + col, () => ({ color: col })), pages = lam("pages", () => ({ color: "#f4f0e2" }));
  const c = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.18, d), cover); c.position.y = h * 0.09; g.add(c);
  const c2 = c.clone(); c2.position.y = h * 0.91; g.add(c2);
  const pg = new THREE.Mesh(new THREE.BoxGeometry(w - 0.012, h * 0.66, d - 0.014), pages); pg.position.set(0.004, h * 0.5, -0.004); g.add(pg);
  const sp = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), lam("spineM" + txt + col, () => ({ map: spineTex(txt, col) }))); sp.position.set(0, h / 2, d / 2 - 0.006); g.add(sp);
  return g;
};
/** a binder whose front cover swings open about the spine (left edge): `cover` rotation.z 0 closed .. ~3 open */
const openBinder = () => {
  const g = new THREE.Group(), { w, h, d } = BINDER, col = "#2f8a4c";
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.18, d), lam("bind" + col, () => ({ color: col }))); base.position.y = h * 0.09; g.add(base);
  const page = new THREE.Mesh(new THREE.BoxGeometry(w - 0.01, h * 0.55, d - 0.01), [
    lam("pages", () => ({ color: "#f4f0e2" })), lam("pages", () => ({ color: "#f4f0e2" })),
    lam("pageTop", () => ({ map: ctex("binderPage", 600, 640, (gg) => binderPage(new Pen(gg))) })), lam("pages", () => ({ color: "#f4f0e2" })),
    lam("pages", () => ({ color: "#f4f0e2" })), lam("pages", () => ({ color: "#f4f0e2" })),
  ]);
  page.position.y = h * 0.18 + h * 0.275; g.add(page);
  const hinge = new THREE.Group(); hinge.position.set(-w / 2, h * 0.82, 0); g.add(hinge);
  const cover = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.18, d), lam("bind" + col, () => ({ color: col }))); cover.position.set(w / 2, h * 0.09, 0); hinge.add(cover);
  const lab = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 0.002, d * 0.22), lam("binderLab", () => ({ color: "#f6f2e6" }))); lab.position.set(w / 2, h * 0.18 + 0.001, 0); hinge.add(lab);
  return { g, hinge };
};
const canvasMat = (w: number, h: number) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return { tex, g: cv.getContext("2d")!, key: "" };
};
/** slab helper: an axis box with a rotation (radians) about z, centred at (cx, cy, cz) */
const slab = (b: Batch, m: THREE.Material, cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, rz = 0) =>
  b.add(new THREE.BoxGeometry(sx, sy, sz), m, new THREE.Matrix4().compose(V(cx, cy, cz), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, rz)), V(1, 1, 1)));

type Canvas = { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string };
export type Sets = {
  groups: Record<string, THREE.Group>;
  hatch: THREE.Group; cord: THREE.Object3D; ladder: THREE.Group; glow: THREE.MeshBasicMaterial; glowMesh: THREE.Mesh;
  stack: THREE.Group; dust: THREE.MeshBasicMaterial; binders: THREE.Group[];
  book: { g: THREE.Group; hinge: THREE.Group };
  crt: THREE.Group; flat: THREE.Group; crtScreen: Canvas; parcels: THREE.Mesh[]; paper: THREE.Mesh;
  ball: THREE.Mesh; board: Canvas;
};

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const planks = lam("planksHD", () => ({ map: rep(planksHD(), 1, 1) }));

  // ===== HOUSE: hallway below, attic above (origin) =====
  const house = G("house", [0, 0, 0]);
  let b = new Batch();
  up(b, planks, -2.6, 2.6, -2.1, 3.6, 0, 4);
  const hw = lam("hallWall", () => ({ map: rep(stucco("hall", "#dcc9a2"), 1, 1) }));
  box(b, hw, -2.6, 0, -2.3, 2.6, CEIL, -2.1, 3); box(b, hw, -2.8, 0, -2.3, -2.6, CEIL, 3.6, 3);
  box(b, lam("skirt", () => ({ color: "#f2efe6" })), -2.6, 0, -2.1, 2.6, 0.12, -2.06); box(b, lam("skirt", () => ({ color: "#f2efe6" })), -2.6, 0, -2.1, -2.56, 0.12, 3.6);
  box(b, lam("hallDoor", () => ({ color: "#8a5a34" })), -2.6, 0, 0.6, -2.55, 2.05, 1.5); box(b, M.hub(), -2.56, 1.0, 1.35, -2.52, 1.06, 1.42);
  box(b, lam("frame1", () => ({ color: "#6e4a30" })), 0.9, 1.3, -2.1, 1.7, 1.9, -2.06); box(b, lam("pic2", () => ({ color: "#8fc0a2" })), 0.98, 1.38, -2.06, 1.62, 1.82, -2.04);
  box(b, lam("radiator", () => ({ color: "#f3f1ec" })), -1.6, 0.15, -2.1, -0.6, 0.75, -2.0);
  // ceiling = attic floor, with the hatch hole
  const { x0, x1, z0, z1 } = HATCH;
  for (const [a0, a1, c0, c1] of [[-2.6, 2.6, -2.1, z0], [-2.6, 2.6, z1, 3.6], [-2.6, x0, z0, z1], [x1, 2.6, z0, z1]] as const) {
    box(b, lam("ceilUnder", () => ({ color: "#efe9dc" })), a0, CEIL, c0, a1, AFLOOR - 0.02, c1);
    up(b, planks, a0, a1, c0, c1, AFLOOR, 3);
  }
  for (const [a0, a1, c0, c1] of [[x0 - 0.05, x1 + 0.05, z0 - 0.05, z0], [x0 - 0.05, x1 + 0.05, z1, z1 + 0.05], [x0 - 0.05, x0, z0, z1], [x1, x1 + 0.05, z0, z1]] as const)
    box(b, M.white(), a0, CEIL - 0.03, c0, a1, CEIL, c1);
  // toy box (lid propped open) by the left wall
  const toyM = lam("toybox", () => ({ color: "#3f7fc9" }));
  box(b, toyM, -2.2, 0, 0.45, -1.5, 0.45, 1.0); box(b, lam("toyIn", () => ({ color: "#1f3f66" })), -2.15, 0.3, 0.5, -1.55, 0.44, 0.95);
  slab(b, toyM, -1.85, 0.62, 0.43, 0.7, 0.36, 0.04, 0); // lid standing up at the back
  for (const [x, z, c] of [[-1.95, 0.7, "#f2c84a"], [-1.7, 0.82, "#e2453c"]] as const) box(b, lam("toy" + c, () => ({ color: c })), x - 0.07, 0.44, z - 0.07, x + 0.07, 0.52, z + 0.07);
  // attic: gable roof along z (ridge at x 0), rafters, back gable with a round window, clutter
  const roofM = lam("atticRoof", () => ({ color: "#b98e62", side: THREE.DoubleSide }));
  for (const s of [-1, 1]) {
    b.add(quad(V(s * 3.0, AFLOOR, 3.6), V(0, 4.7, 3.6), V(0, 4.7, -2.1), V(s * 3.0, AFLOOR, -2.1), 4, 4), roofM);
    for (let z = -2.0; z < 3.6; z += 0.6) slab(b, lam("rafter", () => ({ map: beam() })), s * 1.5, AFLOOR + 1.0, z, 3.55, 0.12, 0.08, s * -0.597);
  }
  box(b, lam("ridge", () => ({ map: beam() })), -0.07, 4.55, -2.1, 0.07, 4.7, 3.6);
  const gab = lam("gable", () => ({ color: "#a37a52", side: THREE.DoubleSide }));
  b.add(tri(V(-3.0, AFLOOR, -2.1), V(3.0, AFLOOR, -2.1), V(0, 4.7, -2.1)), gab);
  for (const [x, z, w, h, d] of [[-1.9, -1.4, 0.6, 0.45, 0.5], [-1.5, -1.6, 0.5, 0.35, 0.45], [-1.85, -1.3, 0.45, 0.3, 0.4], [1.9, -1.5, 0.7, 0.4, 0.5], [-2.1, 0.9, 0.5, 0.3, 0.6]] as const)
    box(b, lam("cardboard", () => ({ map: cardboard() })), x - w / 2, AFLOOR + (x === -1.85 ? 0.45 : 0), z - d / 2, x + w / 2, AFLOOR + h + (x === -1.85 ? 0.45 : 0), z + d / 2);
  box(b, lam("suitcase", () => ({ color: "#7a3f2a" })), 1.4, AFLOOR, -1.9, 2.1, AFLOOR + 0.22, -1.4);
  cyl(b, lam("rugRoll", () => ({ color: "#9c2f3a" })), -2.3, AFLOOR + 0.12, 1.9, 0.12, 0.12, 1.4, 12, new THREE.Euler(Math.PI / 2, 0, 0));
  b.build(house);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.8, 1.2) }));
  win.position.set(0, 3.55, -2.08); house.add(win);
  house.add(new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.04, 8, 32).translate(0, 3.55, -2.07), twoToneLam("#6e4a30")));
  // the hatch: a panel hinged along its back edge (rotation.x 0 closed, PI/2 hanging open), with a pull cord
  const hatch = new THREE.Group(); hatch.position.set(0, CEIL, z0); house.add(hatch);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 - 0.01, AFLOOR - CEIL, z1 - z0 - 0.01), [M.white(), M.white(), planks, M.white(), M.white(), M.white()]);
  panel.position.set(0, (AFLOOR - CEIL) / 2, (z1 - z0) / 2); hatch.add(panel);
  const cord = new THREE.Group(); cord.position.set(0, 0, z1 - z0 - 0.06); hatch.add(cord);
  const string = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.5, 6).translate(0, -0.25, 0), twoToneLam("#e9e1cf")); cord.add(string);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8).translate(0, -0.52, 0), twoToneLam("#c23a32")); cord.add(knob);
  // the sliding loft ladder (built along +y from its foot, then aimed from LADDER_BOT to LADDER_TOP)
  const ladder = new THREE.Group(); house.add(ladder);
  const L = Math.hypot(LADDER_TOP[1] - LADDER_BOT[1], LADDER_TOP[2] - LADDER_BOT[2]);
  const lb = new Batch(), lw = lam("ladderWood", () => ({ color: "#c79b62" }));
  for (const s of [-1, 1]) box(lb, lw, s * 0.22 - 0.025, 0, -0.03, s * 0.22 + 0.025, L, 0.03);
  for (let y = 0.25; y < L; y += 0.3) box(lb, lw, -0.2, y - 0.02, -0.04, 0.2, y + 0.02, 0.04);
  lb.build(ladder);
  // the binder stack (six lying flat, spines to the camera; the top one carries the £300 price sticker) + its dust shell
  const stack = new THREE.Group(); root.add(stack); // parented to the scene: it travels from the attic to the auction counter
  const binders: THREE.Group[] = [];
  BCOL.forEach((c, i) => {
    const m = binderMesh(c, ["BASE", "JUNGLE", "FOSSIL", "ROCKET", "NEO", "SKYRIDGE"][i]);
    m.position.set(0.01 * Math.sin(i * 2.3), i * BINDER.h, 0.008 * Math.cos(i * 1.7)); m.rotation.y = 0.03 * Math.sin(i * 3.1);
    stack.add(m); binders.push(m);
  });
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.05), new THREE.MeshBasicMaterial({ map: ctex("price300", 256, 116, (g) => {
    g.fillStyle = "#fff36a"; g.fillRect(0, 0, 256, 116); g.strokeStyle = "#2a2733"; g.lineWidth = 6; g.strokeRect(3, 3, 250, 110);
    g.fillStyle = "#2a2733"; g.font = "900 72px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("£300", 128, 62);
  }) }));
  tag.rotation.x = -Math.PI / 2; tag.position.set(0.04, 6 * BINDER.h + 0.002, 0.06); stack.add(tag);
  const dust = new THREE.MeshBasicMaterial({ color: new THREE.Color("#b7b0a2"), transparent: true, opacity: 0, depthWrite: false });
  const shell = new THREE.Mesh(new THREE.BoxGeometry(BINDER.w + 0.012, 6 * BINDER.h + 0.006, BINDER.d + 0.012), dust);
  shell.position.y = 3 * BINDER.h; shell.layers.set(NOINK); stack.add(shell);
  stack.position.set(...STACK_AT);
  // the warm light that floods out of the open hatch at the end
  const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 2.2, 0.9), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), glow); glowMesh.rotation.x = Math.PI / 2; glowMesh.position.set(0, AFLOOR + 0.25, 0); house.add(glowMesh);
  // the football the son dribbles out
  const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 2), twoToneLam("#f4f1ea")); house.add(ball);

  // ===== STUDY =====
  const study = G("study", STUDY);
  b = new Batch();
  up(b, planks, -3, 3, -2.6, 3.4, 0, 4);
  const sw = lam("studyWall", () => ({ map: rep(stucco("study", "#cfdcc0"), 1, 1) }));
  box(b, sw, -3, 0, -2.8, 3, 2.7, -2.6, 3);
  box(b, sw, -3.2, 0, -2.8, -3, 2.7, 0.2, 3); box(b, sw, -3.2, 0, 1.3, -3, 2.7, 3.4, 3); box(b, sw, -3.2, 2.1, 0.2, -3, 2.7, 1.3, 3);
  box(b, lam("doorFrame", () => ({ color: "#f2efe6" })), -3.05, 0, 0.12, -2.95, 2.16, 0.2); box(b, lam("doorFrame", () => ({ color: "#f2efe6" })), -3.05, 0, 1.3, -2.95, 2.16, 1.38);
  box(b, lam("doorFrame", () => ({ color: "#f2efe6" })), -3.05, 2.08, 0.12, -2.95, 2.16, 1.38);
  // the landing outside the door: floor, a far wall with a picture, so the doorway shows a house, not sky
  up(b, planks, -4.6, -3.2, -0.6, 2.2, 0, 1);
  box(b, lam("landingWall", () => ({ color: "#e3d6b8" })), -4.8, 0, -0.6, -4.6, 2.7, 2.2); box(b, lam("landingWall", () => ({ color: "#e3d6b8" })), -4.8, 2.6, -0.6, -3.2, 2.8, 2.2);
  box(b, lam("doorFrame", () => ({ color: "#f2efe6" })), -4.6, 1.2, 0.45, -4.58, 1.7, 1.05); box(b, lam("landingPic", () => ({ color: "#6f9bc4" })), -4.58, 1.26, 0.51, -4.56, 1.64, 0.99);
  box(b, M.white(), -2.5, 0.95, -2.62, -1.1, 2.2, -2.58); box(b, lam("studySky", () => ({ color: "#9cc8ec" })), -2.42, 1.03, -2.63, -1.18, 2.12, -2.6);
  box(b, M.white(), -1.83, 1.03, -2.63, -1.77, 2.12, -2.6);
  // bookshelf with a row of binders (the son's hand will creep toward these)
  const shelfM = lam("shelf", () => ({ color: "#7a4f33" }));
  box(b, shelfM, 1.0, 0, -2.6, 1.05, 2.0, -2.25); box(b, shelfM, 2.45, 0, -2.6, 2.5, 2.0, -2.25); box(b, shelfM, 1.0, 0, -2.62, 2.5, 2.0, -2.58);
  for (const y of [0.05, 0.55, 1.05, 1.55, 1.95]) box(b, shelfM, 1.0, y, -2.6, 2.5, y + 0.04, -2.25);
  for (let i = 0; i < 9; i++) { const c = BCOL[i % 6]; box(b, lam("bind" + c, () => ({ color: c })), 1.1 + i * 0.065, 1.09, -2.55, 1.16 + i * 0.065, 1.41, -2.3); }
  for (let i = 0; i < 6; i++) box(b, lam("book" + i, () => ({ color: ["#c9a24a", "#5a6f8f", "#9c2f3a"][i % 3] })), 1.1 + i * 0.09, 0.59, -2.5, 1.17 + i * 0.09, 0.85, -2.3);
  // desk (faces +z: he sits behind it, toward the camera) and chair
  const deskM = lam("desk", () => ({ color: "#8a5a34" }));
  box(b, deskM, -0.95, 0.71, -0.55, 0.75, 0.76, 0.15);
  for (const [x, z] of [[-0.9, -0.5], [0.7, -0.5], [-0.9, 0.1], [0.7, 0.1]] as const) box(b, deskM, x - 0.03, 0, z - 0.03, x + 0.03, 0.71, z + 0.03);
  box(b, deskM, -0.95, 0.35, 0.1, 0.75, 0.71, 0.15);
  box(b, lam("chair", () => ({ color: "#3f5a7a" })), -0.25, 0.45, -1.25, 0.25, 0.5, -0.85); box(b, lam("chair", () => ({ color: "#3f5a7a" })), -0.25, 0.5, -1.3, 0.25, 1.1, -1.25);
  box(b, M.dark(), 0.18, 0.76, -0.52, 0.26, 0.78, -0.42); // mouse
  box(b, lam("lampBase", () => ({ color: "#2a3a63" })), 0.45, 0.76, -0.45, 0.6, 0.79, -0.3); cyl(b, lam("lampBase", () => ({ color: "#2a3a63" })), 0.52, 0.79, -0.38, 0.012, 0.012, 0.35, 6);
  box(b, lam("rugS", () => ({ map: carpet() })), -1.4, 0.003, -1.6, 1.4, 0.008, 1.2, 1);
  b.build(study);
  // the 90s beige CRT and the 2010s flat screen, same spot on the desk, screen turned toward his chair
  const crtScreen = canvasMat(512, 400);
  const crt = new THREE.Group(); crt.position.set(-0.5, 0.76, -0.2); crt.rotation.y = -0.58; study.add(crt);
  const beige = twoToneLam("#d9cfb4");
  const cBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.42), beige); cBody.position.set(0, 0.2, 0.02); crt.add(cBody);
  const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.2), beige); cBack.position.set(0, 0.19, 0.3); crt.add(cBack);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.26), new THREE.MeshBasicMaterial({ map: crtScreen.tex })); scr.position.set(0, 0.21, -0.191); scr.rotation.y = Math.PI; crt.add(scr);
  const cBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.3), beige); cBase.position.set(0, 0.015, 0.05); crt.add(cBase);
  const flat = new THREE.Group(); flat.position.copy(crt.position); flat.rotation.y = crt.rotation.y; study.add(flat);
  const fBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.34, 0.03), twoToneLam("#26242b")); fBody.position.set(0, 0.33, 0); flat.add(fBody);
  const fScr = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.3), new THREE.MeshBasicMaterial({ color: new THREE.Color("#5a86b8") })); fScr.position.set(0, 0.33, -0.017); fScr.rotation.y = Math.PI; flat.add(fScr);
  const fStand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.05), twoToneLam("#26242b")); fStand.position.set(0, 0.08, 0.02); flat.add(fStand);
  const fFoot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.015, 0.16), twoToneLam("#26242b")); fFoot.position.set(0, 0.008, 0.02); flat.add(fFoot);
  // parcels by the desk (how many show depends on the shot)
  const parcels: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const w = 0.55 - 0.04 * (i % 2), h = 0.34, d = 0.45;
    const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lam("cardboard", () => ({ map: cardboard() })));
    p.position.set(-0.85 + 0.03 * Math.sin(i * 2.1), h / 2 + i * h, -1.45 + 0.03 * Math.cos(i * 1.3)); p.rotation.y = 0.12 * Math.sin(i * 2.7);
    study.add(p); parcels.push(p);
  }
  // the newspaper lying on the desk (15 years later)
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.004, 0.3), [M.white(), M.white(), new THREE.MeshBasicMaterial({ map: ctex("paper6000", 840, 600, (g) => newspaper(new Pen(g))) }), M.white(), M.white(), M.white()]);
  paper.position.set(0.12, 0.762, -0.3); paper.rotation.y = 0.1; study.add(paper);
  const book = openBinder(); study.add(book.g); book.g.position.set(-0.08, 0.76, -0.22);

  // ===== SCHOOL YARD (late 90s) =====
  const school = G("school", SCHOOL);
  b = new Batch();
  up(b, M.asphalt(), -12, 12, -7, 2.0, 0, 6);
  up(b, M.walk(), -12, 12, 2.0, 4.0, 0.02, 3);
  up(b, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), -30, 30, 4.0, 30, 0.01, 6);
  up(b, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), -30, -12, -30, 4, 0.01, 6); up(b, lam("grassHD", () => ({ map: rep(grassHD(), 1, 1) })), 12, 30, -30, 4, 0.01, 6);
  box(b, lam("brick", () => ({ map: rep(brick(), 1, 1) })), -12, 0, -7.6, 12, 5.0, -7, 3);
  for (const x of [-9, -5.5, -2, 4.5, 8]) { box(b, M.white(), x - 1.05, 1.45, -7.02, x + 1.05, 3.35, -6.98); box(b, M.glass(), x - 0.95, 1.55, -7.04, x + 0.95, 3.25, -6.97); }
  box(b, lam("schoolDoor", () => ({ color: "#c23a32" })), 0.6, 0, -7.03, 2.2, 2.3, -6.96);
  for (let i = 0; i < 6; i++) box(b, M.line(), -4.6 + (i % 2) * 0.55, 0.003, -3.5 + Math.floor(i / 2) * 0.55 + (i % 2) * 0, -4.1 + (i % 2) * 0.55, 0.008, -3.0 + Math.floor(i / 2) * 0.55);
  box(b, lam("bench", () => ({ color: "#7a4f33" })), 2.0, 0.42, -2.0, 3.6, 0.47, -1.6); for (const x of [2.1, 3.5]) box(b, M.dark(), x - 0.04, 0, -1.95, x + 0.04, 0.42, -1.65);
  // fence: posts, rails, chain-link mesh
  for (let x = -10; x <= 10; x += 2) cyl(b, M.pole(), x, 0, 2.0, 0.035, 0.035, 1.3, 8);
  cyl(b, M.pole(), -10, 1.25, 2.0, 0.025, 0.025, 20, 8, new THREE.Euler(0, 0, -Math.PI / 2));
  cyl(b, M.pole(), -10, 0.1, 2.0, 0.02, 0.02, 20, 8, new THREE.Euler(0, 0, -Math.PI / 2));
  for (const [x, z] of [[-5, 6], [6.5, 7], [12, 9]] as const) { cyl(b, M.trunk(), x, 0, z, 0.16, 0.12, 2.0, 8); sph(b, M.bush(), x, 2.6, z, 1.2); }
  b.build(school);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 1.2), new THREE.MeshBasicMaterial({ map: rep(ctex("chainlink", 128, 128, (g) => {
    g.strokeStyle = "rgba(120,126,138,1)"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 64); g.lineTo(64, 0); g.lineTo(128, 64); g.lineTo(64, 128); g.closePath(); g.stroke();
  }), 60, 3.6), transparent: true, alphaTest: 0.4, side: THREE.DoubleSide }));
  mesh.position.set(0, 0.65, 2.0); school.add(mesh);
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.42, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color("#6f9fcf") }));
  puddle.rotation.x = -Math.PI / 2; puddle.scale.set(1.3, 0.8, 1); puddle.position.set(0.5, 0.006, -1.05); school.add(puddle);

  // ===== EWBANK'S AUCTION ROOM =====
  const auction = G("auction", AUCTION);
  b = new Batch();
  up(b, lam("carpet", () => ({ map: carpet() })), -6, 6, -5.2, 7, 0, 2);
  const panelM = lam("aucPanel", () => ({ color: "#2f5446" })), creamM = lam("aucCream", () => ({ map: rep(stucco("auc", "#efe4c8"), 1, 1) }));
  box(b, panelM, -6, 0, -5.4, 6, 1.1, -5.2); box(b, creamM, -6, 1.1, -5.4, 6, 4.2, -5.2, 3);
  for (const s of [-1, 1]) { box(b, panelM, s * 6, 0, -5.4, s * 6 + s * 0.2, 1.1, 7); box(b, creamM, s * 6, 1.1, -5.4, s * 6 + s * 0.2, 4.2, 7, 3); }
  box(b, panelM, -6, 0, 7, 6, 1.1, 7.2); box(b, creamM, -6, 1.1, 7, 6, 4.2, 7.2, 3);
  box(b, lam("aucDoor", () => ({ color: "#5a3b2a" })), 5.98, 0, 4.0, 6.02, 2.3, 5.2);
  // rostrum, the Skyridge binder on its stand, a rope line
  const woodM = lam("rostrum", () => ({ color: "#6e4428" }));
  box(b, woodM, -0.45, 0, -4.75, 0.45, 1.12, -4.3); box(b, lam("rostrumTop", () => ({ color: "#8a5a34" })), -0.5, 1.12, -4.8, 0.5, 1.17, -4.25);
  box(b, woodM, 0.75, 0, -4.55, 1.25, 0.95, -4.05);
  box(b, lam("bind#2f8a4c", () => ({ color: "#2f8a4c" })), 0.84, 0.95, -4.35, 1.16, 1.27, -4.28);
  box(b, lam("binderLab", () => ({ color: "#f6f2e6" })), 0.92, 1.08, -4.28, 1.08, 1.14, -4.27);
  // valuation counter by the entrance (front right)
  box(b, lam("counter", () => ({ color: "#7a4f33" })), 2.0, 0, 2.55, 4.0, 0.95, 2.95); box(b, lam("counterTop", () => ({ color: "#d9d1c3" })), 1.95, 0.95, 2.5, 4.05, 1.0, 3.0);
  for (const x of [-4.5, -2.5, 2.5, 4.5]) { box(b, lam("frame1", () => ({ color: "#6e4a30" })), x - 0.5, 1.6, -5.2, x + 0.5, 2.5, -5.16); box(b, lam("paint" + x, () => ({ color: ["#c9a24a", "#5a86b8", "#9c5a3a", "#5fae5a"][(x + 4.5) / 2 | 0] })), x - 0.42, 1.68, -5.16, x + 0.42, 2.42, -5.14); }
  b.build(auction);
  const name = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 0.5), new THREE.MeshBasicMaterial({ map: letters("EWBANK'S", "", "#d8b25a"), transparent: true }));
  name.position.set(-0.2, 3.5, -5.18); auction.add(name);
  const board = canvasMat(1024, 400);
  const bm = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.55), new THREE.MeshBasicMaterial({ map: board.tex })); bm.position.set(-1.3, 2.45, -5.17); auction.add(bm);
  auction.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 0.05).translate(-1.3, 2.45, -5.2), twoToneLam("#1d1b22")));

  // ===== TABLE (top-down macro for the explanation) =====
  const table = G("table", INSERT);
  b = new Batch();
  up(b, lam("tableTop", () => ({ map: rep(planksHD(), 1, 1) })), -1.5, 1.5, -1.5, 1.5, 0, 1.2);
  b.build(table);

  for (const g of [house, study, school, auction, table]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { groups, hatch, cord, ladder, glow, glowMesh, stack, dust, binders, book, crt, flat, crtScreen, parcels, paper, ball, board };
};
