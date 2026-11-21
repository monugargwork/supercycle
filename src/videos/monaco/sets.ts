// The sets of the Monaco auction reel, built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { boxFront, boxSide, wrapGloss, wrapTorn, lotBoard, yearPlate, tagStrip, priceTag, tinLabel, lettering, coin } from "./art2";
import { SALE, CELLAR, KITCH, V3, obj, ORIGIN, BOXS, SEATS, MINH_SEAT, SCOOT, KIT } from "./story";

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
// ---- coplanar-face audit (anti z-fighting): every box and floor quad is recorded; buildSets warns about any two faces
// that lie in the same plane, face the same way and overlap: the GPU can't tell which is in front, so they flicker as the camera
// moves (the Monaco v1 "glitch"). Fix by moving one face 2-5 mm (or trimming the box), never by ignoring the warning.
type Face = { ax: number; c: number; dir: number; r: [number, number, number, number]; set: string; id: number; where: string };
const FACES: Face[] = []; let SETL = "", BOXN = 0;
const INSET = [0, 4, 8, 1, 5, 9, 2, 6, 3, 7].map((i) => 0.0005 + i * 0.00045); // ten insets 0.5-4.6 mm, each 0.45 mm apart
const recBox = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, where: string) => {
  const id = ++BOXN, lo = [x0, y0, z0], hi = [x1, y1, z1];
  for (let ax = 0; ax < 3; ax++) {
    const u = (ax + 1) % 3, v = (ax + 2) % 3, r: [number, number, number, number] = [lo[u], hi[u], lo[v], hi[v]];
    if (hi[u] - lo[u] < 1e-6 || hi[v] - lo[v] < 1e-6) continue;
    FACES.push({ ax, c: lo[ax], dir: -1, r, set: SETL, id, where }, { ax, c: hi[ax], dir: 1, r, set: SETL, id, where });
  }
};
const near = (a: number, b: number) => Math.abs(a - b) < 4e-4;
/** would a box lo..hi put a face in the plane of an existing same-facing face of this set, overlapping it? */
const clashes = (lo: THREE.Vector3, hi: THREE.Vector3) => {
  const L = [lo.x, lo.y, lo.z], H = [hi.x, hi.y, hi.z];
  for (const f of FACES) {
    if (f.set !== SETL) continue;
    const c = f.dir > 0 ? H[f.ax] : L[f.ax]; if (!near(c, f.c)) continue;
    const u = (f.ax + 1) % 3, v = (f.ax + 2) % 3;
    if (Math.min(H[u], f.r[1]) - Math.max(L[u], f.r[0]) > 1e-4 && Math.min(H[v], f.r[3]) - Math.max(L[v], f.r[2]) > 1e-4) return true;
  }
  return false;
};
export const coplanarReport = (): string[] => {
  const out: string[] = [], key = (f: Face) => `${f.set}|${f.ax}|${f.dir}|${Math.round(f.c * 2000)}`, bins = new Map<string, Face[]>();
  for (const f of FACES) { const k = key(f); const l = bins.get(k); if (l) l.push(f); else bins.set(k, [f]); }
  for (const l of bins.values()) for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) {
    const a = l[i], b = l[j]; if (a.id === b.id || !near(a.c, b.c) || (a.ax === 1 && a.dir < 0 && Math.abs(a.c) < 1e-3)) continue; // bottoms resting on the floor are never seen
    const ou = Math.min(a.r[1], b.r[1]) - Math.max(a.r[0], b.r[0]), ov = Math.min(a.r[3], b.r[3]) - Math.max(a.r[2], b.r[2]);
    if (ou > 1e-4 && ov > 1e-4) out.push(`[coplanar] ${a.set}: ${"xyz"[a.ax]}=${a.c.toFixed(3)} (${a.dir > 0 ? "+" : "-"}) ${a.where} / ${b.where}, overlap ${(ou * 100).toFixed(0)}x${(ov * 100).toFixed(0)} cm`);
  }
  return out;
};
const where = () => { const l = (new Error().stack ?? "").split("\n")[3] ?? ""; const m = l.match(/:(\d+):\d+\)?$/); return m ? "sets.ts:" + m[1] : "?"; };
const box = (b: Batch, m: THREE.Material, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, tile = 0) => {
  const lo = V(Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)), hi = V(Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1));
  // every box is pulled in by a few tenths of a millimetre to 3 mm (never on a floor-standing bottom), choosing the first inset
  // whose faces don't line up with any face already built in this set, so no two faces ever share a plane
  const L0 = lo.clone(), H0 = hi.clone();
  for (let t = 0; t < INSET.length; t++) {
    const k = INSET[(BOXN + t) % INSET.length], e = [H0.x - L0.x, H0.y - L0.y, H0.z - L0.z].map((d) => Math.min(k, d / 5));
    lo.set(L0.x + e[0], L0.y > 1e-4 ? L0.y + e[1] : L0.y, L0.z + e[2]); hi.set(H0.x - e[0], H0.y - e[1], H0.z - e[2]);
    if (!clashes(lo, hi)) break;
  }
  recBox(lo.x, lo.y, lo.z, hi.x, hi.y, hi.z, where());
  b.add(boxGeo(lo, hi, tile), m);
};
const up = (b: Batch, m: THREE.Material, x0: number, x1: number, z0: number, z1: number, y: number, tile: number) => {
  FACES.push({ ax: 1, c: y, dir: 1, r: [Math.min(z0, z1), Math.max(z0, z1), Math.min(x0, x1), Math.max(x0, x1)], set: SETL, id: ++BOXN, where: where() });
  b.add(quad(V(x0, y, z1), V(x1, y, z1), V(x1, y, z0), V(x0, y, z0), (x1 - x0) / tile, (z1 - z0) / tile), m);
};
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
/** a booster display box: origin at the centre of its base; lid hinged at the back top edge; shrink-wrap shell */
export type BoxRig = { g: THREE.Group; lid: THREE.Group; wrap: THREE.Mesh; wrapFront: Canvas; key: string; body: THREE.Mesh; mats: THREE.Material[][] };
export type Sets = {
  groups: Record<string, THREE.Group>;
  board: Canvas; year: Canvas; door: THREE.Group;
  hero: BoxRig; kitBox: BoxRig; cellar: BoxRig[];
  crown: THREE.Group; chair: THREE.Group; yacht: THREE.Group; diamond: THREE.Group; watch: THREE.Group;
  bottle: THREE.Group; bowl: THREE.Group; scooters: THREE.Group; yachts: THREE.Group[];
};
export const STAGE_Y = 0.3, TABLE_Y = 1.08, PLINTH_Y = 1.3;
/** cellar rack: box cubby c (0..2), r (0..5) -> base centre (local); bottle cubby (0..3, 0..5) -> centre (local) */
export const boxCubby = (i: number): V3 => { const c = i % 3, r = Math.floor(i / 3); return [0.25 + 0.4 * c, 0.12 + 0.37 * r, -2.62]; };
export const bottleCubby = (c: number, r: number): V3 => [-1.3 + 0.3125 * (c + 0.5), 0.1 + 0.37 * r + 0.185, -2.6];
export const PULLED = [1, 3]; // the bottle the sommelier pulls in S13 (col, row)

const glassM = () => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide });

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const lamC = (col: string) => lam("tt" + col, () => ({ color: col }));
  const gold = C("#d4a83a"), oak = C("#8a5a34"), white = C("#f3f1ec"), velvet = C("#7a1f2a");

  // the booster display box (shared by the saleroom, the cellar and the kitchen)
  const [BW, BH, BD] = BOXS;
  const frontTex = ctex("boxFront", 400, 560, (g) => boxFront(new Pen(g))), sideTex = ctex("boxSide", 200, 560, (g) => boxSide(new Pen(g)));
  const frontM = new THREE.MeshLambertMaterial({ map: frontTex }), sideM = new THREE.MeshLambertMaterial({ map: sideTex }), darkM = lamC("#1b1f3a");
  const frontDim = new THREE.MeshLambertMaterial({ map: frontTex, color: "#7a7480" }), sideDim = new THREE.MeshLambertMaterial({ map: sideTex, color: "#7a7480" });
  const wrapSideM = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.12, depthWrite: false });
  const makeBox = (parent: THREE.Object3D): BoxRig => {
    const g = new THREE.Group(); parent.add(g);
    const sealedMats = [sideM, sideM, darkM, darkM, frontM, sideM], openMats = [sideDim, sideDim, darkM, darkM, frontDim, sideDim];
    const body = mesh(new THREE.BoxGeometry(BW, BH - 0.02, BD), sealedMats, g, 0, (BH - 0.02) / 2, 0);
    const lid = new THREE.Group(); lid.position.set(0, BH - 0.02, -BD / 2); g.add(lid);
    // the lid overhangs the body by a clear 6 mm: a 2 mm step drew its outline as flickering dashes
    mesh(new THREE.BoxGeometry(BW + 0.012, 0.02, BD + 0.012), [sideM, sideM, sideM, darkM, sideM, sideM], lid, 0, 0.01, BD / 2);
    const wf = canvasMat(256, 360); wf.tex.colorSpace = THREE.SRGBColorSpace;
    const wfM = new THREE.MeshBasicMaterial({ map: wf.tex, transparent: true, depthWrite: false });
    const ws = wrapSideM.clone();
    const wrap = mesh(new THREE.BoxGeometry(BW + 0.018, BH + 0.008, BD + 0.018), [ws, ws, ws, ws, wfM, ws], g, 0, BH / 2, 0);
    wrap.renderOrder = 4; wrap.layers.set(NOINK); // no ink on a shell 3 mm off the box: its outline flickers against the box's
    return { g, lid, wrap, wrapFront: wf, key: "", body, mats: [sealedMats, openMats] };
  };

  // ===== SALEROOM =====
  SETL = "saleroom";
  const sale = G("saleroom", SALE);
  let b = new Batch();
  up(b, lam("carpet", () => ({ map: carpet() })), -6, 5.8, -6, 6, 0, 2);
  const cream = lam("saleCream", () => ({ map: rep(stucco("sale", "#f1e6cc"), 1, 1) })), dado = C("#f7f3ea");
  const wall = (x0: number, x1: number, z0: number, z1: number) => { box(b, dado, x0, 0, z0, x1, 1.0, z1); box(b, cream, x0, 1.0, z0, x1, 4.5, z1, 3); };
  wall(-6, 5.8, -6.2, -6); wall(-6, 5.8, 6, 6.2); wall(-6.2, -6, -6, 6);
  // the harbour wall (inner skin x 5.8-6.0) with three window openings (z c +-0.8, y 1.0-3.4)
  const WIN = [-2.6, 1.4, 4.4], WH = [1.0, 3.4];
  const holed = (x0: number, x1: number, m: THREE.Material, zA: number, zB: number, yTop: number) => {
    let z = zA;
    for (const c of WIN) { if (c - 0.8 > zA && c + 0.8 < zB) { box(b, m, x0, 0, z, x1, yTop, c - 0.8); box(b, m, x0, 0, c - 0.8, x1, WH[0], c + 0.8); box(b, m, x0, WH[1], c - 0.8, x1, yTop, c + 0.8); z = c + 0.8; } }
    box(b, m, x0, 0, z, x1, yTop, zB);
  };
  holed(5.8, 6.0, cream, -6, 6, 4.5);
  for (const c of WIN) { // white window frames and a cross muntin (clear of the camera's path through the S02/S03 window)
    box(b, white, 5.78, WH[0] - 0.06, c - 0.86, 6.42, WH[0], c + 0.86); box(b, white, 5.78, WH[1], c - 0.86, 6.42, WH[1] + 0.06, c + 0.86);
    box(b, white, 5.78, WH[0], c - 0.86, 6.42, WH[1], c - 0.8); box(b, white, 5.78, WH[0], c + 0.8, 6.42, WH[1], c + 0.86);
    box(b, white, 6.18, WH[0], c - 0.012, 6.22, WH[1], c + 0.012); box(b, white, 6.18, 2.6 - 0.012, c - 0.8, 6.22, 2.6 + 0.012, c + 0.8);
  }
  for (const y of [1.0, 3.2]) { box(b, gold, -6, y - 0.03, -5.99, 5.8, y + 0.03, -5.96); box(b, gold, -5.99, y - 0.03, -6, -5.96, y + 0.03, 6); }
  // stage, rostrum, lot table
  box(b, oak, -4, 0, -6, 4, STAGE_Y - 0.03, -3.8); box(b, C("#a0703f"), -4.03, STAGE_Y - 0.03, -6, 4.03, STAGE_Y, -3.77);
  const ro = local("saleroom", "rostrum");
  box(b, C("#6e4428"), ro.p[0] - 0.45, STAGE_Y, ro.p[2] - 0.25, ro.p[0] + 0.45, 1.40, ro.p[2] + 0.25); box(b, C("#8a5a34"), ro.p[0] - 0.5, 1.40, ro.p[2] - 0.3, ro.p[0] + 0.5, 1.45, ro.p[2] + 0.3);
  box(b, gold, ro.p[0] - 0.3, 0.9, ro.p[2] + 0.25, ro.p[0] + 0.3, 1.1, ro.p[2] + 0.26);
  cyl(b, C("#c79b62"), ro.p[0] + 0.3, 1.45, ro.p[2], 0.07, 0.07, 0.03, 16);
  const lt = local("saleroom", "lot_table");
  box(b, velvet, lt.p[0] - 0.9, STAGE_Y, lt.p[2] - 0.25, lt.p[0] + 0.9, TABLE_Y - 0.02, lt.p[2] + 0.25); box(b, C("#8e2a36"), lt.p[0] - 0.92, TABLE_Y - 0.02, lt.p[2] - 0.27, lt.p[0] + 0.92, TABLE_Y, lt.p[2] + 0.27);
  box(b, gold, lt.p[0] - 0.92, TABLE_Y - 0.12, lt.p[2] + 0.27, lt.p[0] + 0.92, TABLE_Y - 0.1, lt.p[2] + 0.275);
  // vitrine plinth, slab stand
  box(b, white, 1.15, STAGE_Y, -4.85, 1.65, PLINTH_Y, -4.35); box(b, gold, 1.13, PLINTH_Y - 0.03, -4.87, 1.67, PLINTH_Y, -4.33);
  const pd = local("saleroom", "pedestal"); box(b, white, pd.p[0] - 0.1, STAGE_Y, pd.p[2] - 0.1, pd.p[0] + 0.1, 1.42, pd.p[2] + 0.1); box(b, velvet, pd.p[0] - 0.12, 1.42, pd.p[2] - 0.12, pd.p[0] + 0.12, 1.45, pd.p[2] + 0.12);
  box(b, white, 2.22, STAGE_Y, -4.78, 2.58, PLINTH_Y, -4.42); box(b, C("#e9eef2"), 2.34, PLINTH_Y, -4.64, 2.46, PLINTH_Y + 0.03, -4.56);
  // vitrine hood: brass edges + glass back/sides/top (the front is the door)
  const vx0 = 1.24, vx1 = 1.56, vy0 = PLINTH_Y, vy1 = PLINTH_Y + 0.4, vz0 = -4.72, vz1 = -4.48, e = 0.008;
  for (const [x, z] of [[vx0, vz0], [vx1, vz0], [vx0, vz1], [vx1, vz1]]) box(b, gold, x - e, vy0, z - e, x + e, vy1, z + e);
  for (const y of [vy0, vy1]) { box(b, gold, vx0, y - e, vz0 - e, vx1, y + e, vz0 + e); box(b, gold, vx0, y - e, vz1 - e, vx1, y + e, vz1 + e); box(b, gold, vx0 - e, y - e, vz0, vx0 + e, y + e, vz1); box(b, gold, vx1 - e, y - e, vz0, vx1 + e, y + e, vz1); }
  // gilt chairs (Minh's is its own object: it tips over)
  const red = C("#b22a35");
  const chairAt = (bb: Batch, x: number, z: number, dx = 0, dz = 0) => {
    const X = x + dx, Z = z + dz;
    box(bb, red, X - 0.22, 0.42, Z - 0.22, X + 0.22, 0.47, Z + 0.22);
    for (const [ax, az] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) box(bb, gold, X + ax - 0.02, 0, Z + az - 0.02, X + ax + 0.02, 0.42, Z + az + 0.02);
    box(bb, gold, X - 0.21, 0.47, Z + 0.18, X - 0.17, 0.95, Z + 0.22); box(bb, gold, X + 0.17, 0.47, Z + 0.18, X + 0.21, 0.95, Z + 0.22);
    box(bb, red, X - 0.17, 0.58, Z + 0.19, X + 0.17, 0.9, Z + 0.215); box(bb, gold, X - 0.21, 0.9, Z + 0.18, X + 0.21, 0.95, Z + 0.22);
  };
  SEATS.forEach(([x, z], i) => { if (i !== MINH_SEAT) chairAt(b, x, z); });
  // the 70-lot display table along the harbour wall, two tiers
  box(b, C("#efe6d2"), 5.0, 0, -0.8, 5.7, 0.8, 5.6); box(b, C("#efe6d2"), 5.35, 0.8, -0.8, 5.7, 0.98, 5.6);
  // chandeliers (gold ring + glowing bulbs)
  for (const [x, z] of [[-1.5, -2.5], [-1.5, 2.0]]) { box(b, gold, x - 0.01, 3.7, z - 0.01, x + 0.01, 4.5, z + 0.01); cyl(b, gold, x, 3.65, z, 0.5, 0.5, 0.05, 24); }
  b.build(sale);
  const bulbM = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.9, 1.3) });
  for (const [x, z] of [[-1.5, -2.5], [-1.5, 2.0]]) for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; mesh(new THREE.SphereGeometry(0.05, 10, 8), bulbM, sale, x + 0.5 * Math.cos(a), 3.75, z + 0.5 * Math.sin(a)); }
  // vitrine glass panes (back, sides, top) and the hinged front door
  const gm = glassM();
  plane(vx1 - vx0, 0.4, gm, sale, (vx0 + vx1) / 2, vy0 + 0.2, vz0); plane(vz1 - vz0, 0.4, gm, sale, vx0, vy0 + 0.2, (vz0 + vz1) / 2, Math.PI / 2); plane(vz1 - vz0, 0.4, gm, sale, vx1, vy0 + 0.2, (vz0 + vz1) / 2, Math.PI / 2);
  const top = plane(vx1 - vx0, vz1 - vz0, gm, sale, (vx0 + vx1) / 2, vy1, (vz0 + vz1) / 2); top.rotation.x = -Math.PI / 2;
  const door = new THREE.Group(); door.position.set(vx0, vy0, vz1); sale.add(door);
  plane(vx1 - vx0, 0.4, gm, door, (vx1 - vx0) / 2, 0.2, 0.002);
  mesh(new THREE.BoxGeometry(0.012, 0.4, 0.012), gold, door, vx1 - vx0, 0.2, 0.004); mesh(new THREE.SphereGeometry(0.01, 8, 6), gold, door, vx1 - vx0 - 0.02, 0.2, 0.012);
  // the lot board
  const board = canvasMat(1500, 800), bo = local("saleroom", "lot_board");
  mesh(new THREE.PlaneGeometry(bo.s[0], bo.s[1]), new THREE.MeshBasicMaterial({ map: board.tex }), sale, ...bo.p);
  // the 70-lot tag strips (front edges of the two tiers, facing -x)
  const strip = (from: number, x: number, y: number) => { const t = ctex("tags" + from, 4096, 64, (g) => tagStrip(new Pen(g), from, 35)); plane(6.4, 0.06, new THREE.MeshBasicMaterial({ map: t }), sale, x, y, 2.4, -Math.PI / 2); };
  strip(1, 4.995, 0.74); strip(36, 5.345, 0.94);
  // watch tag (static) and the moving lots: yacht, diamond, watch
  const yacht = new THREE.Group(); yacht.position.set(...local("saleroom", "yacht").p); yacht.position.y = TABLE_Y; sale.add(yacht);
  const hull = new THREE.Shape(); hull.moveTo(-0.22, 0.06); hull.lineTo(0.2, 0.06); hull.lineTo(0.24, 0.12); hull.lineTo(-0.24, 0.12); hull.lineTo(-0.22, 0.06);
  const hg = new THREE.ExtrudeGeometry(hull, { depth: 0.08, bevelEnabled: false }); hg.translate(0, 0, -0.04);
  mesh(hg, lamC("#f6f4ee"), yacht); mesh(new THREE.BoxGeometry(0.46, 0.012, 0.082), lamC("#2f5fa8"), yacht, 0, 0.1, 0);
  mesh(new THREE.BoxGeometry(0.16, 0.05, 0.06), lamC("#f6f4ee"), yacht, -0.02, 0.145, 0); mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22), lamC("#c9a06a"), yacht, 0.02, 0.28, 0);
  for (const x of [-0.12, 0.12]) mesh(new THREE.BoxGeometry(0.02, 0.06, 0.08), gold, yacht, x, 0.03, 0);
  const diamond = new THREE.Group(); diamond.position.set(...local("saleroom", "diamond").p); diamond.position.y = TABLE_Y; sale.add(diamond);
  mesh(new THREE.BoxGeometry(0.13, 0.04, 0.13), lamC("#22305e"), diamond, 0, 0.02, 0);
  const gem = mesh(new THREE.OctahedronGeometry(0.03), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.8, 2.0) }), diamond, 0, 0.075, 0); gem.scale.set(1, 1.2, 1);
  const watch = new THREE.Group(); watch.position.set(...local("saleroom", "watch").p); watch.position.y = TABLE_Y; sale.add(watch);
  mesh(new THREE.BoxGeometry(0.06, 0.09, 0.04), lamC("#1d1b22"), watch, 0, 0.045, 0);
  const face = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 24), lamC("#d4a83a"), watch, 0, 0.1, 0.022); face.rotation.x = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.004, 24).rotateX(Math.PI / 2), lamC("#fbf7ec"), watch, 0, 0.1, 0.03);
  const wtag = ctex("tagWatch", 300, 140, (g) => priceTag(new Pen(g), "€2,500,000")); plane(0.12, 0.056, new THREE.MeshBasicMaterial({ map: wtag, transparent: true, alphaTest: 0.5 }), watch, 0.08, 0.03, 0.03);
  // the hero box, the crown, Minh's chair
  const hero = makeBox(sale);
  const crown = new THREE.Group(); sale.add(crown);
  const cg = new THREE.CylinderGeometry(0.05, 0.045, 0.035, 24, 1, true); mesh(cg, new THREE.MeshLambertMaterial({ color: "#e0b23c", side: THREE.DoubleSide }), crown, 0, 0.0175, 0);
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; mesh(new THREE.ConeGeometry(0.012, 0.035, 8), lamC("#e0b23c"), crown, 0.05 * Math.cos(a), 0.05, 0.05 * Math.sin(a)); mesh(new THREE.SphereGeometry(0.007, 8, 6), lamC("#c2203a"), crown, 0.051 * Math.cos(a + 0.6), 0.016, 0.051 * Math.sin(a + 0.6)); }
  mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 20), velvet, crown, 0, -0.01, 0);
  const chair = new THREE.Group(); const ms = SEATS[MINH_SEAT]; chair.position.set(ms[0], 0, ms[1] + 0.22); sale.add(chair);
  SETL = "chair"; const cb = new Batch(); chairAt(cb, 0, -0.22); cb.build(chair); SETL = "saleroom";
  // ten scooters down the aisle (S10 on)
  const scooters = new THREE.Group(); sale.add(scooters);
  const sb = new Batch(), sred = C("#d8322f"), tyre = C("#26242b"), chrome = C("#c9ccd2");
  for (const [x, z] of SCOOT) {
    for (const dz of [-0.55, 0.5]) cyl(sb, tyre, x - 0.04, 0.2, z + dz, 0.2, 0.2, 0.08, 16, new THREE.Euler(0, 0, Math.PI / 2));
    box(sb, sred, x - 0.14, 0.2, z - 0.45, x + 0.14, 0.32, z + 0.45); box(sb, sred, x - 0.17, 0.32, z + 0.05, x + 0.17, 0.66, z + 0.62);
    box(sb, C("#1d1b22"), x - 0.15, 0.66, z + 0.1, x + 0.15, 0.72, z + 0.58); box(sb, sred, x - 0.16, 0.2, z - 0.62, x + 0.16, 0.92, z - 0.5);
    box(sb, chrome, x - 0.02, 0.9, z - 0.6, x + 0.02, 1.12, z - 0.56); box(sb, chrome, x - 0.3, 1.1, z - 0.6, x + 0.3, 1.13, z - 0.56); box(sb, C("#fff3b0"), x - 0.06, 0.8, z - 0.63, x + 0.06, 0.88, z - 0.62);
  }
  sb.build(scooters);
  scooters.userData.noShadow = true; // close-up crane in S10: shadow acne crawled on the seats

  // ===== QUAY (outside the harbour wall) =====
  const quay = G("quay", SALE);
  b = new Batch();
  const fac = lam("facade", () => ({ map: rep(stucco("fac", "#f0dfba"), 1, 1) })), facD = C("#e6d1a6");
  // outer skin x 6.0-6.4 with the three real openings; beyond the room it is solid, 13 m tall
  holed(6.0, 6.4, fac, -16, 16, 13);
  for (const y of [4.0, 8.4, 12.6]) box(b, facD, 6.4, y, -16.2, 6.7, y + 0.35, 16.2);
  box(b, C("#7a5a4a"), 3, 12.95, -16.4, 6.8, 13.4, 16.4); box(b, fac, -14, 0, -16, 6.0, 13, -15.6); box(b, fac, -14, 0, 15.6, 6.0, 13, 16);
  const glassD = C("#3d5f7a");
  for (const z of [-13.4, -10.4, -7.4, 7.4, 10.4, 13.4]) box(b, glassD, 6.4, WH[0], z - 0.7, 6.42, WH[1], z + 0.7);
  for (const y of [5.2, 9.4]) for (let z = -13.4; z <= 13.5; z += 3) { box(b, glassD, 6.4, y, z - 0.6, 6.42, y + 2.2, z + 0.6); box(b, white, 6.4, y - 0.08, z - 0.7, 6.47, y, z + 0.7); }
  up(b, lam("quayStone", () => ({ map: rep(stoneHD(), 1, 1) })), 6.4, 16, -40, 40, 0, 3); box(b, C("#cfc3aa"), 15.7, -0.4, -40, 16.1, 0.08, 40);
  for (const z of [-10, -3, 7]) palm(b, 8.2, 0, z, 6.5, z);
  for (const [x, z, s] of [[-230, -60, 70], [-260, 40, 90], [-220, 150, 60], [-280, -180, 80]]) { const g = new THREE.SphereGeometry(s, 20, 12); g.scale(1, 0.6, 1); g.translate(x, 0, z); b.add(g, C("#7d9a7a")); }
  b.build(quay);
  const wmesh = mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshLambertMaterial({ map: rep(water(), 60, 60), color: "#4f8fc0" }), quay, 416, -0.4, 0); wmesh.rotation.x = -Math.PI / 2;
  const letTex = ctex("lettering", 3000, 160, (g) => lettering(new Pen(g)));
  plane(9.4, 0.5, new THREE.MeshBasicMaterial({ map: letTex, transparent: true, alphaTest: 0.3 }), quay, 6.72, 4.75, 0, Math.PI / 2);
  const yachts = [[18.6, -9, 12], [21.5, -1, 14], [18.8, 7, 10], [22, 14, 12]].map(([x, z, L]) => {
    const g = new THREE.Group(); g.position.set(x, -0.4, z); quay.add(g);
    const s = new THREE.Shape(); s.moveTo(-L / 2, 0); s.lineTo(L / 2 - 1.2, 0); s.lineTo(L / 2, 1.4); s.lineTo(-L / 2, 1.4); s.lineTo(-L / 2, 0);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 3, bevelEnabled: false }); geo.translate(0, 0, -1.5); geo.rotateY(Math.PI / 2);
    mesh(geo, lamC("#f6f4ee"), g); mesh(new THREE.BoxGeometry(3.04, 0.25, L * 0.92).translate(0, 1.05, 0.3), lamC("#2f5fa8"), g);
    mesh(new THREE.BoxGeometry(2.4, 1.2, L * 0.4), lamC("#f6f4ee"), g, 0, 2.0, -L * 0.05); mesh(new THREE.BoxGeometry(2.42, 0.4, L * 0.38), lamC("#3d5f7a"), g, 0, 2.2, -L * 0.05);
    mesh(new THREE.CylinderGeometry(0.06, 0.08, L * 0.8), lamC("#e9e4d8"), g, 0, 1.4 + L * 0.4, L * 0.08);
    return g;
  });

  // ===== CELLAR =====
  SETL = "cellar";
  const cel = G("cellar", CELLAR);
  b = new Batch();
  const st = lam("cellarStone", () => ({ map: rep(stoneHD("cellarS", ["#a89a86", "#9d8f7b", "#b3a590", "#94877a"], "#6e6356"), 1, 1) }));
  up(b, st, -3, 3, -2.8, 4.6, 0, 1.5);
  box(b, st, -3, 0, -3.0, 3, 3, -2.8, 1.5); box(b, st, -3.2, 0, -2.8, -3, 3, 4.6, 1.5); box(b, st, 3, 0, -2.8, 3.2, 3, 4.6, 1.5); box(b, st, -3.2, 0, 4.6, 3.2, 3, 4.8, 1.5);
  for (let z = -2.6; z < 4.6; z += 1.4) box(b, C("#4a3426"), -3, 2.85, z - 0.08, 3, 3.0, z + 0.08);
  const rk = C("#6e4a30");
  box(b, rk, -1.34, 0, -2.8, 1.34, 0.1, -2.4); box(b, rk, -1.34, 2.32, -2.8, 1.34, 2.38, -2.4);
  for (let r = 1; r < 6; r++) box(b, rk, -1.3, 0.1 + 0.37 * r - 0.01, -2.8, 1.3, 0.1 + 0.37 * r + 0.01, -2.4);
  for (let c = 0; c <= 4; c++) { const x = -1.3 + 0.3125 * c; box(b, rk, x - 0.015, 0.1, -2.8, x + 0.015, 2.32, -2.4); }
  for (let c = 0; c <= 3; c++) { const x = 0.05 + 0.4 * c; box(b, rk, x - 0.015, 0.1, -2.8, x + 0.015, 2.32, -2.4); }
  box(b, C("#2a1f1a"), -1.3, 0.1, -2.82, 1.3, 2.32, -2.8);
  const bot = C("#1f4a2e"), foil = C("#7a1f2a");
  for (let c = 0; c < 4; c++) for (let r = 0; r < 6; r++) {
    if (c === PULLED[0] && r === PULLED[1]) continue;
    const [x, y] = bottleCubby(c, r);
    for (const dx of [-0.075, 0.075]) for (const dy of [-0.06, 0.07]) {
      cyl(b, bot, x + dx, y + dy, -2.78, 0.045, 0.045, 0.24, 12, new THREE.Euler(Math.PI / 2, 0, 0));
      cyl(b, bot, x + dx, y + dy, -2.54, 0.016, 0.016, 0.1, 8, new THREE.Euler(Math.PI / 2, 0, 0)); cyl(b, foil, x + dx, y + dy, -2.45, 0.018, 0.018, 0.03, 8, new THREE.Euler(Math.PI / 2, 0, 0));
    }
  }
  cyl(b, C("#7a5230"), -0.55, 0, -1.8, 0.28, 0.3, 0.95, 18); for (const y of [0.15, 0.8]) cyl(b, C("#3a3540"), -0.55, y, -1.8, 0.305, 0.305, 0.04, 18);
  for (const x of [-2.6, 2.6]) { box(b, C("#2a2420"), x - 0.08, 1.8, -2.78, x + 0.08, 2.1, -2.7); }
  b.build(cel);
  for (const x of [-2.6, 2.6]) mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.6, 0.7) }), cel, x, 2.0, -2.66);
  // the pulled bottle's 4 slots: 3 stay, the front-left one is the one he takes (its own object)
  const bottle = new THREE.Group(); cel.add(bottle);
  { const [x, y] = bottleCubby(PULLED[0], PULLED[1]); const bb = new Batch();
    for (const dx of [-0.075, 0.075]) for (const dy of [-0.06, 0.07]) { if (dx < 0 && dy > 0) continue; cyl(bb, bot, x + dx, y + dy, -2.78, 0.045, 0.045, 0.24, 12, new THREE.Euler(Math.PI / 2, 0, 0)); cyl(bb, bot, x + dx, y + dy, -2.54, 0.016, 0.016, 0.1, 8, new THREE.Euler(Math.PI / 2, 0, 0)); }
    bb.build(cel);
    mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 12).rotateX(Math.PI / 2), lamC("#1f4a2e"), bottle, 0, 0, -0.12);
    mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.1, 8).rotateX(Math.PI / 2), lamC("#1f4a2e"), bottle, 0, 0, 0.05);
    bottle.position.set(x - 0.075, y + 0.07, -2.66);
  }
  const year = canvasMat(600, 200), yp = local("cellar", "year_plate");
  mesh(new THREE.PlaneGeometry(yp.s[0], yp.s[1]), new THREE.MeshLambertMaterial({ map: year.tex }), cel, ...yp.p);
  const cellar = Array.from({ length: 18 }, (_, i) => { const r = makeBox(cel); const p = boxCubby(i); r.g.position.set(p[0], p[1], p[2] + 0.12); r.g.scale.setScalar(0.8); return r; });

  // ===== KITCHEN =====
  SETL = "kitchen";
  const kit = G("kitchen", KITCH);
  b = new Batch();
  up(b, lam("kTiles", () => ({ map: tiles() })), -2.2, 2.2, -2.5, 2.1, 0, 1);
  const ktile = C("#7fb79a"), kwall = lam("kCream", () => ({ map: rep(stucco("kit", "#f3e7c4"), 1, 1) }));
  const kw = (x0: number, x1: number, z0: number, z1: number, yb = 0) => { box(b, ktile, x0, yb, z0, x1, Math.max(yb, 1.2), z1); box(b, kwall, x0, Math.max(yb, 1.2), z0, x1, 2.7, z1, 2); };
  // back wall with the window above the stove (x 0.9-1.7, y 1.3-2.1)
  const [wx0, wx1] = [KIT.stove[0] - 0.4, KIT.stove[0] + 0.4];
  box(b, ktile, -2.2, 0, -2.7, 2.2, 1.2, -2.5); box(b, kwall, -2.2, 1.2, -2.7, wx0, 2.7, -2.5); box(b, kwall, wx1, 1.2, -2.7, 2.2, 2.7, -2.5); box(b, kwall, wx0, 1.2, -2.7, wx1, 1.3, -2.5); box(b, kwall, wx0, 2.1, -2.7, wx1, 2.7, -2.5);
  kw(-2.4, -2.2, -2.5, 2.1); kw(2.2, 2.4, -2.5, -0.9); kw(2.2, 2.4, 0.1, 2.1); box(b, kwall, 2.2, 2.1, -0.9, 2.4, 2.7, 0.1);
  box(b, C("#7a4f33"), 2.18, 0, -0.95, 2.22, 2.12, -0.9); box(b, C("#7a4f33"), 2.18, 0, 0.1, 2.22, 2.12, 0.15); box(b, C("#7a4f33"), 2.18, 2.08, -0.95, 2.22, 2.14, 0.15);
  box(b, C("#2a2a33"), 2.4, 0, -1.2, 3.4, 2.4, 0.4); // the dark hall beyond the door
  const [tx, tz] = KIT.table, wood = C("#a0703f");
  box(b, wood, tx - 0.55, 0.71, tz - 0.35, tx + 0.55, 0.75, tz + 0.35);
  for (const [ax, az] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) box(b, C("#7a5230"), tx + ax - 0.025, 0, tz + az - 0.025, tx + ax + 0.025, 0.71, tz + az + 0.025);
  cyl(b, C("#c23a32"), KIT.kid[0], 0, KIT.kid[1] + 0.05, 0.16, 0.16, 0.45, 14);
  const [cx, cz] = KIT.cup, cupM = C("#5f9fb8");
  box(b, cupM, cx - 0.4, 0, cz - 0.225, cx + 0.4, 1.75, cz + 0.225); box(b, C("#3d7a92"), cx - 0.002, 0.1, cz + 0.225, cx + 0.002, 1.65, cz + 0.23);
  for (const sd of [-1, 1]) cyl(b, gold, cx + sd * 0.06, 0.95, cz + 0.24, 0.015, 0.015, 0.03, 8, new THREE.Euler(Math.PI / 2, 0, 0));
  const [sx, sz] = KIT.stove;
  box(b, white, sx - 0.5, 0, sz - 0.275, sx + 0.5, 0.88, sz + 0.275); box(b, C("#5a5a62"), sx - 0.5, 0.88, sz - 0.275, sx + 0.5, 0.9, sz + 0.275);
  for (const dx of [-0.22, 0.22]) cyl(b, C("#1d1b22"), sx + dx, 0.9, sz, 0.1, 0.1, 0.02, 16);
  cyl(b, C("#b9bec6"), sx + 0.22, 0.92, sz, 0.13, 0.13, 0.16, 18);
  b.build(kit);
  mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.4, 1.0) }), kit, KIT.stove[0], 1.7, -2.6);
  // bowl, tin, coins (the tin's label is the one canvas)
  const bowl = new THREE.Group(); kit.add(bowl);
  const bg = new THREE.SphereGeometry(0.08, 18, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); mesh(bg, new THREE.MeshLambertMaterial({ color: "#f6f4ee", side: THREE.DoubleSide }), bowl, 0, 0.08, 0);
  const soup = mesh(new THREE.CircleGeometry(0.07, 18), lamC("#e9b25a"), bowl, 0, 0.065, 0); soup.rotation.x = -Math.PI / 2;
  const tin = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.13, 18), [new THREE.MeshLambertMaterial({ map: ctex("tinLabel", 400, 160, (g) => tinLabel(new Pen(g))) }), lamC("#c9ccd2"), lamC("#c9ccd2")], kit, tx + 0.42, 0.81, tz + 0.12);
  tin.rotation.set(0, 0.5, Math.PI / 2);
  const coinM = new THREE.MeshLambertMaterial({ map: ctex("coin", 64, 64, (g) => coin(new Pen(g))) });
  for (const [dx, dz] of [[0.25, 0.22], [0.2, 0.26], [0.3, 0.3], [0.15, 0.2], [0.33, 0.18]]) { const c = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.003, 12), coinM, kit, tx + dx, 0.752, tz + dz); c.rotation.y = dx * 10; }
  const kitBox = makeBox(kit);

  for (const g of [sale, quay, cel, kit]) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  // transparent glass and shrink-wrap draw no ink and cast no shadow (a shell 3 mm off a surface shadows and outlines itself
  // unstably: it flickers); the brass edges and the box carry the outlines
  scooters.traverse((o) => { o.userData.noShadow = true; });
  for (const g of [sale, quay, cel, kit]) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material]; if (m.userData.noShadow) { m.castShadow = false; m.receiveShadow = false; } if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } });
  for (const [g, x0, x1, z0, z1, y, col] of [[sale, -6, 5.8, -6, 6, 4.48, "#f3ead6"], [kit, -2.2, 2.2, -2.5, 2.1, 2.68, "#efe4c6"], [cel, -3, 3, -2.8, 4.6, 2.84, "#3a2a22"]] as const) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lamC(col)); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; g.add(c);
  }
  void SALE; void NOINK; void untone; void V; void boxGeo; void quad; void tri; void jit; void brick; void grassHD; void planksHD; void roofHD; void beam;
  { const rep = coplanarReport(); console.warn(`[coplanar] ${rep.length} coplanar overlaps`); for (const l of rep.slice(0, 40)) console.warn(l); }
  return { groups, board, year, door, hero, kitBox, cellar, crown, chair, yacht, diamond, watch, bottle, bowl, scooters, yachts };
};
/** redraw a box's wrap front for its state */
export const drawWrap = (r: BoxRig, state: "sealed" | "torn", gleam = -1) => {
  const key = state + (gleam > 0 && gleam < 1 ? Math.round(gleam * 24) : -1);
  if (r.key === key) return; r.key = key;
  const g = r.wrapFront.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 256, 360);
  r.body.material = r.mats[state === "sealed" ? 0 : 1];
  if (state === "sealed") wrapGloss(new Pen(g), gleam > 0 && gleam < 1 ? Math.round(gleam * 24) / 24 : -1); else wrapTorn(new Pen(g));
  r.wrapFront.tex.needsUpdate = true;
  (r.wrap.material as THREE.Material[]).forEach((m, i) => { if (i !== 4) (m as THREE.MeshBasicMaterial).visible = state === "sealed"; });
};
