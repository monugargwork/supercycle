// The sets of the Goldenrod heist reel (the shop with its street and back lot, the highway, the rental office, the police station, the house in Justice), built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import * as A2 from "./art2";
import { V3, obj, ORIGIN, SHOPP, ROADP, RENTP, POLP, JUSP, along, ROUTE_LEN } from "./story";

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
export type Door = { g: THREE.Group; side: number };
export type Sets = {
  groups: Record<string, THREE.Group>;
  van: THREE.Group; vanBrake: THREE.MeshBasicMaterial; vanHaz: THREE.MeshBasicMaterial;
  pane: THREE.Mesh; caseTops: THREE.Mesh[]; caseFronts: THREE.Mesh[]; cases: Canvas[]; drawer: THREE.Mesh;
  shards: THREE.Mesh[]; tDoors: Door[]; lock: THREE.Group; shackle: THREE.Mesh;
  trail: THREE.Mesh; towerLamps: THREE.MeshBasicMaterial[]; flash: THREE.Mesh;
  paper: Canvas; paperMesh: THREE.Mesh; drawer26: THREE.Group;
  items: THREE.Mesh[]; strings: THREE.Mesh[]; pinJ: THREE.Mesh; folders: Canvas[]; folderMeshes: THREE.Mesh[];
  gdoor: THREE.Mesh[]; cars: THREE.Group[]; bars: THREE.MeshBasicMaterial[][];
};
export const SHARD_N = 100 + 56;
const woodTex = (key: string, base: string, dark: string) => ctex("wood" + key, 512, 512, (g, r) => {
  for (let i = 0; i < 8; i++) { g.fillStyle = jit(r, base, 0.05, 3, 0.1); g.fillRect(0, i * 64, 512, 64); g.fillStyle = dark; g.fillRect(0, i * 64 + 61, 512, 3); }
  for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(60,35,20,0.07)"; g.fillRect(r() * 512, r() * 512, 40 + r() * 80, 2); }
});
const paintWall = (key: string, base: string) => ctex("wall" + key, 512, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 14, "255,255,255", 0.06, 120); blot(g, r, 512, 512, 10, "80,70,60", 0.04, 120);
});
const carpetT = (key: string, base: string) => ctex("carpet" + key, 256, 256, (g, r) => { g.fillStyle = base; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1800; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"; g.fillRect(r() * 256, r() * 256, 2, 2); } });
const skyPanel = (key: string, top: string, bot: string, moon = false) => ctex("sky" + key, 256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  if (moon) { g.fillStyle = "#f4f1d8"; g.beginPath(); g.arc(180, 70, 26, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,0.7)"; for (let i = 0; i < 30; i++) g.fillRect((i * 97) % 256, (i * 53) % 160, 2, 2); }
});
const stripes = (a: string, b: string) => ctex("stripes" + a + b, 256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 64); } });
const paving = () => ctex("paving", 512, 512, (g, r) => {
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = jit(r, (i + j) % 2 ? "#c9b79a" : "#bba88a", 0.03, 2, 0.1); g.fillRect(i * 64, j * 64, 64, 64); }
  g.fillStyle = "rgba(90,70,50,0.45)"; for (let k = 0; k < 512; k += 64) { g.fillRect(k, 0, 2, 512); g.fillRect(0, k, 512, 2); }
});
const canvasMat2 = (w: number, h: number): Canvas => { const c = canvasMat(w, h); return c; };


const grassT = (key: string, base: string) => ctex("grass" + key, 512, 512, (g, r) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 30, "20,40,20", 0.12, 90); blot(g, r, 512, 512, 20, "180,200,140", 0.05, 80); for (let i = 0; i < 2400; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)"; g.fillRect(r() * 512, r() * 512, 2, 3); } });
const gravelT = () => ctex("gravel", 512, 512, (g, r) => { g.fillStyle = "#8a8478"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 5000; i++) { g.fillStyle = ["rgba(60,55,50,0.35)", "rgba(200,195,185,0.3)", "rgba(120,110,100,0.3)"][i % 3]; g.fillRect(r() * 512, r() * 512, 3, 3); } });
const tilesT = (key: string, a: string, b: string) => ctex("tiles" + key, 512, 512, (g, r) => {
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = jit(r, (i + j) % 2 ? a : b, 0.03, 2, 0.1); g.fillRect(i * 128, j * 128, 128, 128); }
  g.fillStyle = "rgba(70,80,95,0.4)"; for (let k = 0; k < 512; k += 128) { g.fillRect(k, 0, 2, 512); g.fillRect(0, k, 512, 2); }
});
const sidingT = (key: string, base: string) => ctex("siding" + key, 512, 512, (g, r) => { for (let y = 0; y < 512; y += 32) { g.fillStyle = jit(r, base, 0.03, 2, 0.08); g.fillRect(0, y, 512, 32); g.fillStyle = "rgba(40,50,70,0.3)"; g.fillRect(0, y + 29, 512, 3); } });
const dashT = () => ctex("dash", 64, 256, (g) => { g.clearRect(0, 0, 64, 256); g.fillStyle = "#f2d64a"; g.fillRect(0, 0, 64, 128); });

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const flatP = (w: number, d: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, rz = 0) => { const o = mesh(new THREE.PlaneGeometry(w, d), m, parent, x, y, z); o.rotation.set(-Math.PI / 2, 0, rz); o.castShadow = false; return o; };
  const lamC = (tex: THREE.Texture, transparent = false) => new THREE.MeshLambertMaterial({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 });
  const basicC = (tex: THREE.Texture, transparent = false, k = 1) => { const m = new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.02 : 0 }); m.color.setScalar(k); return m; };
  const art = (key: string, W: number, H: number, draw: (p: Pen) => void) => ctex("a2" + key, W, H, (g) => draw(new Pen(g)));
  const glow = (r: number, g: number, b: number) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b) });
  const shellXZ = (g: THREE.Group, x0: number, x1: number, z0: number, z1: number, h: number, floorM: THREE.Material, wallM: THREE.Material, ceil: string) => {
    const sb = new Batch();
    up(sb, floorM, x0, x1, z0, z1, 0, 1);
    box(sb, wallM, x0 - 0.1, 0, z0 - 0.1, x1 + 0.1, h, z0, 2); box(sb, wallM, x0 - 0.1, 0, z1, x1 + 0.1, h, z1 + 0.1, 2);
    box(sb, wallM, x0 - 0.1, 0, z0, x0, h, z1, 2); box(sb, wallM, x1, 0, z0, x1 + 0.1, h, z1, 2);
    sb.build(g, false);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lam("ceil" + ceil, () => ({ color: ceil }))); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, h - 0.002, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; g.add(c);
  };
  const white = C("#f3f1ec"), ink = C("#2a2c33"), steel = C("#b9bec6"), wood = C("#5a3a26"), alu = C("#aab0ba");
  const glassMat = (op = 0.22, col = "#d8eef8") => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
  const tree = (b: Batch, x: number, z: number, s = 1) => { cyl(b, C("#6a4a30"), x, 0, z, 0.16 * s, 0.12 * s, 2.2 * s, 8); for (const [dx, dy, dz, r] of [[0, 2.8, 0, 1.3], [0.7, 2.4, 0.3, 0.9], [-0.6, 2.5, -0.2, 1.0], [0.1, 3.4, -0.1, 0.9]]) sph(b, M.bush(), x + dx * s, dy * s, z + dz * s, r * s); };

  // ===== THE MINIVAN (one model, placed in whichever set the scene is in; nose along +x) =====
  const van = new THREE.Group(); root.add(van);
  const vanBrake = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.05, 0.05) }), vanHaz = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.45, 0.25, 0.05) });
  {
    const vb = new Batch(), body = C("#f4f4f2"), dark = C("#2f3440"), tint = C("#5a6688"), seat = C("#24262e");
    box(vb, body, -2.6, 0.32, -1.0, 2.6, 1.0, 1.0); // lower body to the beltline
    box(vb, body, 1.25, 1.0, -0.95, 2.55, 1.08, 0.95); // hood
    box(vb, dark, -2.61, 0.3, -1.01, 2.61, 0.42, 1.01); // rocker / bumper strip
    // the cabin: roof, pillars, dark glass on the rear sides and the rear; the front side windows are OPEN (the driver shows)
    box(vb, body, -2.5, 1.72, -0.96, 1.05, 1.79, 0.96);
    for (const x of [-2.5, -1.3, 0.05]) for (const z of [-0.96, 0.9]) box(vb, body, x, 1.0, z, x + 0.1, 1.72, z + 0.06);
    box(vb, body, 0.95, 1.0, -0.96, 1.07, 1.72, -0.9); box(vb, body, 0.95, 1.0, 0.9, 1.07, 1.72, 0.96);
    for (const z of [-0.955, 0.905]) { box(vb, tint, -2.42, 1.04, z + 0.004, -1.3, 1.69, z + 0.05); box(vb, tint, -1.22, 1.04, z + 0.004, 0.05, 1.69, z + 0.05); }
    box(vb, tint, -2.56, 1.04, -0.86, -2.5, 1.69, 0.86); // rear window
    slab(vb, glassTintM(), 1.55, 1.38, 0, 0.04, 0.84, 1.82, 0.85, 0); // windshield (sloped)
    box(vb, seat, -0.3, 0.9, -0.85, 0.2, 1.4, 0.85); box(vb, seat, -1.6, 0.9, -0.85, -1.1, 1.35, 0.85); // seat backs
    box(vb, C("#1c1e26"), -2.45, 1.0, -0.18, 0.95, 1.71, 0.86); box(vb, C("#1c1e26"), -2.45, 1.0, -0.86, -0.4, 1.71, -0.2); // the dark cabin behind the open windows
    box(vb, dark, 1.0, 1.0, -0.8, 1.25, 1.14, 0.8); // dash
    for (const z of [-1.012, 1.002]) box(vb, dark, -1.3, 0.45, z, -1.27, 1.1, z + 0.01); // sliding door seam
    wheelsAt(vb, [-1.7, 1.75], [-0.9, 0.9], 0.36);
    vb.build(van);
    for (const z of [-0.8, 0.8]) { mesh(new THREE.BoxGeometry(0.03, 0.12, 0.26), vanBrake, van, -2.62, 0.95, z); mesh(new THREE.BoxGeometry(0.03, 0.1, 0.16), glow(3.2, 3.0, 2.6), van, 2.62, 0.95, z); mesh(new THREE.BoxGeometry(0.03, 0.06, 0.12), vanHaz, van, 2.625, 0.82, z); mesh(new THREE.BoxGeometry(0.03, 0.06, 0.1), vanHaz, van, -2.625, 0.78, z); }
    const st = basicC(art("rental", 300, 140, A2.rentalSticker), false, 0.95);
    plane(0.34, 0.16, st, van, -2.575, 1.3, 0.2, -Math.PI / 2).castShadow = false;
    for (const z of [-1, 1]) plane(0.3, 0.14, st, van, -1.95, 1.4, z * 0.962, z > 0 ? 0 : Math.PI).castShadow = false;
    plane(0.4, 0.2, basicC(art("plate", 400, 200, A2.plateFrame), false, 0.9), van, -2.615, 0.62, 0, -Math.PI / 2).castShadow = false;
  }

  // ===== THE SHOP (Goldenrod City Collectibles, Twin Lakes) =====
  SETL = "shop";
  const S = SHOPP, shop = G("shop", ORIGIN.shop);
  let b = new Batch();
  const brickM = lam("shopBrick", () => ({ map: rep(brick(), 2, 2) })), walkM = lam("walk", () => ({ map: rep(concrete(), 1, 1) })), asphM = lam("asph", () => ({ map: rep(asphalt(), 1, 1) }));
  // ground: sidewalk, road, far verge; the floor inside; the gravel lot out back
  box(b, walkM, -30, 0, 0, 30, S.sw_y, 4.0, 2);
  up(b, asphM, -60, 60, 4.0, 12.0, 0, 6); up(b, lam("verge", () => ({ map: rep(grassT("verge", "#3f6a3a"), 1, 1) })), -60, 60, 12.0, 40, 0, 8);
  for (let x = -58; x < 58; x += 6) box(b, C("#e9e4d0"), x, 0, 7.94, x + 3, 0.012, 8.06);
  const [rx0, rx1, rz0, rz1] = S.room;
  up(b, lam("shopTile", () => ({ map: rep(tilesT("shop", "#cfd3d9", "#bfc5cc"), 1, 1) })), rx0, rx1, rz0, rz1, 0, 2);
  up(b, lam("gravel", () => ({ map: rep(gravelT(), 1, 1) })), -10, 10, -20, -8.3, 0, 4);
  // the front wall (z -0.25..0) with the door and two shop windows, up to the parapet
  const fz0 = -S.wall, fz1 = 0, H4 = S.bldg_h, [d0, d1] = S.door, [w1, w2] = S.windows, [wy0, wy1] = S.win_y;
  box(b, brickM, -6, 0, fz0, w1[0], H4, fz1, 1); box(b, brickM, w2[1], 0, fz0, 6, H4, fz1, 1);
  for (const [a, c] of [w1, w2]) { box(b, brickM, a, 0, fz0, c, wy0, fz1, 1); box(b, brickM, a, wy1, fz0, c, H4, fz1, 1); }
  box(b, brickM, w1[1], 0, fz0, d0, H4, fz1, 1); box(b, brickM, d1, 0, fz0, w2[0], H4, fz1, 1); box(b, brickM, d0, S.door_h, fz0, d1, H4, fz1, 1);
  box(b, C("#2a2c33"), -6.1, H4, -0.4, 6.1, H4 + 0.12, 0.08); // parapet cap
  // door frame (aluminium), window frames
  box(b, alu, d0, 0, -0.16, d0 + 0.05, S.door_h, -0.08); box(b, alu, d1 - 0.05, 0, -0.16, d1, S.door_h, -0.08); box(b, alu, d0, S.door_h - 0.05, -0.16, d1, S.door_h, -0.08); box(b, alu, d0 + 0.05, 0, -0.16, d1 - 0.05, 0.06, -0.08);
  for (const [a, c] of [w1, w2]) { box(b, alu, a, wy0, -0.15, c, wy0 + 0.05, -0.09); box(b, alu, a, wy1 - 0.05, -0.15, c, wy1, -0.09); box(b, alu, (a + c) / 2 - 0.025, wy0, -0.15, (a + c) / 2 + 0.025, wy1, -0.09); }
  // sign band backing, the TWIN LAKES sign posts, street lamps
  const [sgx, sgy] = S.sign, [sgw, sgh] = S.sign_size;
  box(b, C("#1d1222"), sgx - sgw / 2 - 0.08, sgy - sgh / 2 - 0.08, 0.0, sgx + sgw / 2 + 0.08, sgy + sgh / 2 + 0.08, 0.06);
  const [tsx, tsy, tsz] = S.town, [tsw, tsh] = S.town_size;
  for (const dx of [-0.6, 0.6]) box(b, steel, tsx + dx - 0.03, S.sw_y, tsz - 0.03, tsx + dx + 0.03, tsy + tsh / 2, tsz + 0.03);
  box(b, C("#1f6f43"), tsx - tsw / 2, tsy - tsh / 2, tsz - 0.05, tsx + tsw / 2, tsy + tsh / 2, tsz - 0.035);
  for (const [lx, lz] of S.lamps) { cyl(b, M.pole(), lx, S.sw_y, lz, 0.08, 0.06, 5.6, 10); box(b, M.pole(), lx - 0.04, 5.6, lz - 0.04, lx + 0.04, 5.68, lz + 1.4); box(b, M.dark(), lx - 0.18, 5.45, lz + 1.1, lx + 0.18, 5.62, lz + 1.6); }
  // neighbours (a hardware store and a diner, dark at night)
  box(b, lam("nb1", () => ({ map: rep(stucco("nb1", "#9a8a72"), 2, 2) })), -16, 0, -8, -6.05, 5.2, 0); box(b, lam("nb2", () => ({ map: rep(stucco("nb2", "#7a8aa0"), 2, 2) })), 6.05, 0, -8, 16, 3.9, 0);
  // the room: side and back walls (the back door opening), the ceiling
  box(b, C("#e3ddd0"), -6, 0, -8.25, -5.75, H4, -0.25); box(b, C("#e3ddd0"), 5.75, 0, -8.25, 6, H4, -0.25);
  const [bd0, bd1] = S.backdoor;
  box(b, brickM, -6, 0, -8.25, bd0, H4, -8.0, 1); box(b, brickM, bd1, 0, -8.25, 6, H4, -8.0, 1); box(b, brickM, bd0, S.backdoor_h, -8.25, bd1, H4, -8.0, 1);
  box(b, C("#2a2c33"), -6.05, H4 - 0.02, -8.3, 6.05, H4 + 0.06, -0.3); // the roof
  // the four cases: wood bases, aluminium corner posts and top rails, LED strips
  for (const zc of S.case_z) {
    const x0 = S.case_x - S.case_dep / 2, x1 = S.case_x + S.case_dep / 2, z0 = zc - S.case_len / 2, z1 = zc + S.case_len / 2;
    box(b, wood, x0, 0, z0, x1, S.case_base, z1);
    for (const x of [x0, x1 - 0.02]) for (const z of [z0, z1 - 0.02]) box(b, alu, x, S.case_base, z, x + 0.02, S.case_top, z + 0.02);
  }
  // the counter and the register, shelves of sealed boxes on the right wall
  const [cx0, cx1, cz0, cz1] = S.counter;
  box(b, wood, cx0, 0, cz0, cx1, S.counter_y - 0.03, cz1); box(b, C("#3a2a24"), cx0 - 0.03, S.counter_y - 0.03, cz0 - 0.03, cx1 + 0.03, S.counter_y, cz1 + 0.03);
  const [rgx, rgy, rgz] = S.register; box(b, ink, rgx - 0.12, rgy + 0.06, rgz - 0.16, rgx + 0.18, rgy + 0.24, rgz + 0.16); box(b, C("#3a3d46"), rgx - 0.18, rgy, rgz - 0.17, rgx + 0.18, rgy + 0.06, rgz + 0.17);
  for (const y of [0.6, 1.2, 1.8]) box(b, wood, 5.35, y - 0.03, -7.6, 5.75, y, -2.0);
  b.build(shop);
  const boxTex = ["neo_lugia", "neo_hooh", "neo_typhlosion"].map((a) => lamC(art("box" + a, 300, 200, (p) => A2.boxFront(p, a))));
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const y = 0.6 + r * 0.6, z = -7.4 + i * 0.6; const m = mesh(new THREE.BoxGeometry(0.3, 0.2, 0.42), [C("#24315a"), C("#24315a"), C("#24315a"), C("#24315a"), C("#24315a"), C("#24315a")], shop, 5.5, y + 0.1, z); m.rotation.y = -Math.PI / 2; plane(0.4, 0.19, boxTex[(i + r) % 3], shop, 5.348, y + 0.1, z, -Math.PI / 2); }
  // live pieces: the door pane, the sign, the town sign, lamp bulbs, case glass and contents, the till drawer
  const pane = plane(1.0, 2.05, glassMat(0.1, "#bfe0ff"), shop, 0, 0.1 + 1.025, S.pane_z); pane.renderOrder = 3;
  for (const [a, c] of [w1, w2]) plane(c - a, wy1 - wy0, glassMat(0.1, "#bfe0ff"), shop, (a + c) / 2, (wy0 + wy1) / 2, -0.12).renderOrder = 3;
  plane(sgw, sgh, basicC(art("storeSign", 1300, 375, A2.storeSign), false, 1.35), shop, sgx, sgy, 0.065).castShadow = false;
  plane(tsw, tsh, basicC(art("townSign", 400, 200, A2.townSign), false, 0.8), shop, tsx, tsy, tsz - 0.033).castShadow = false;
  for (const [lx, lz] of S.lamps) mesh(new THREE.BoxGeometry(0.3, 0.04, 0.42), glow(3.4, 2.4, 1.1), shop, lx, 5.44, lz + 1.35);
  mesh(new THREE.BoxGeometry(0.3, 0.12, 0.12), ink, shop, S.lot_lamp[0], S.lot_lamp[1], S.lot_lamp[2] - 0.06); mesh(new THREE.BoxGeometry(0.22, 0.05, 0.1), glow(3.0, 2.2, 1.2), shop, S.lot_lamp[0], S.lot_lamp[1] - 0.07, S.lot_lamp[2] - 0.08);
  const cases: Canvas[] = [], caseTops: THREE.Mesh[] = [], caseFronts: THREE.Mesh[] = [];
  S.case_z.forEach((zc) => {
    const cv = canvasMat(1000, 600); cases.push(cv);
    const cm = flatP(S.case_len, S.case_dep, basicC(cv.tex, false, 0.9), shop, S.case_x, S.case_base + 0.012, zc, Math.PI / 2); void cm;
    const gt = flatP(S.case_dep - 0.03, S.case_len - 0.03, glassMat(0.18), shop, S.case_x, S.case_top - 0.004, zc); gt.renderOrder = 3; caseTops.push(gt);
    const h = S.case_top - S.case_base - 0.01, yc = S.case_base + h / 2 + 0.005;
    const gf = plane(S.case_len - 0.03, h, glassMat(0.16), shop, S.case_x + S.case_dep / 2 - 0.006, yc, zc, Math.PI / 2); gf.renderOrder = 3; caseFronts.push(gf);
    plane(S.case_len - 0.03, h, glassMat(0.16), shop, S.case_x - S.case_dep / 2 + 0.006, yc, zc, Math.PI / 2).renderOrder = 3;
    for (const dz of [-1, 1]) plane(S.case_dep - 0.03, h, glassMat(0.16), shop, S.case_x, yc, zc + dz * (S.case_len / 2 - 0.006)).renderOrder = 3;
    for (const dx of [-1, 1]) mesh(new THREE.BoxGeometry(0.012, 0.012, S.case_len - 0.06), glow(1.6, 2.0, 2.6), shop, S.case_x + dx * (S.case_dep / 2 - 0.03), S.case_top - 0.02, zc);
  });
  const drawer = mesh(new THREE.BoxGeometry(0.34, 0.06, 0.3), C("#4a4d56"), shop, rgx + 0.0, rgy + 0.03, rgz);
  // the trailer: hollow body open at the rear, axle and wheels, the tongue; rear barn doors on hinges; boxes inside; the padlock
  b = new Batch();
  const [tx0, tx1, tz0, tz1] = S.trailer, TF = S.trailer_floor, TR = S.trailer_roof, tw = 0.05;
  box(b, white, tx0, TF, tz0, tx1, TF + 0.06, tz1); box(b, white, tx0, TR - 0.06, tz0, tx1, TR, tz1);
  box(b, white, tx0, TF, tz0, tx0 + tw, TR, tz1); box(b, white, tx1 - tw, TF, tz0, tx1, TR, tz1); box(b, white, tx0, TF, tz0, tx1, TR, tz0 + tw);
  box(b, C("#2a2c33"), tx0 - 0.01, TF - 0.12, tz0, tx1 + 0.01, TF, tz1); box(b, steel, (tx0 + tx1) / 2 - 0.05, 0.25, tz0 - 1.2, (tx0 + tx1) / 2 + 0.05, 0.35, tz0);
  wheelsAt(b, [(tz0 + tz1) / 2], [], 0, true, tx0, tx1);
  for (let i = 0; i < 8; i++) { const x = tx0 + 0.15 + (i % 3) * 0.62, y = TF + 0.06 + Math.floor(i / 3) * 0.45, z = tz0 + 0.2 + (i % 2) * 0.7; box(b, C(i % 2 ? "#c99a62" : "#b98a52"), x, y, z, x + 0.55, y + 0.42, z + 0.6); }
  b.build(shop);
  const tDoors: Door[] = [-1, 1].map((side) => {
    const g = new THREE.Group(); g.position.set(side < 0 ? tx0 : tx1, 0, tz1 + 0.025); shop.add(g);
    const w = (tx1 - tx0) / 2 - 0.005; const d = mesh(new THREE.BoxGeometry(w, TR - TF, 0.04), white, g, -side * w / 2, (TF + TR) / 2, 0); d.castShadow = true;
    mesh(new THREE.BoxGeometry(0.03, 0.5, 0.03), steel, g, -side * (w - 0.08), TF + 1.0, 0.035);
    return { g, side };
  });
  const lock = new THREE.Group(); shop.add(lock);
  mesh(new THREE.BoxGeometry(0.13, 0.16, 0.05), C("#e2b23a"), lock); mesh(new THREE.CircleGeometry(0.014, 10), C("#1d1b22"), lock, 0, -0.025, 0.0255);
  const shackle = mesh(new THREE.TorusGeometry(0.045, 0.01, 6, 12, Math.PI), steel, shop);
  // shards (door + cases), positioned per frame from the bakes
  const shardM = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 0.9, 1.15), transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false });
  const triG = [0, 1, 2].map((k) => { const g = new THREE.BufferGeometry(), a = [[-0.5, -0.5], [0.5, -0.35], [0.1, 0.5]], b = [[-0.45, 0.5], [-0.5, -0.4], [0.5, 0.1]], c = [[-0.5, -0.2], [0.45, -0.5], [0.3, 0.5]], t = [a, b, c][k];
    g.setAttribute("position", new THREE.Float32BufferAttribute([t[0][0], t[0][1], 0, t[1][0], t[1][1], 0, t[2][0], t[2][1], 0], 3)); g.computeVertexNormals(); return g; });
  const shards = Array.from({ length: SHARD_N }, (_, i) => { const m = mesh(triG[i % 3], shardM, shop); m.visible = false; m.renderOrder = 4; return m; });

  // ===== THE HIGHWAY =====
  SETL = "road";
  const R = ROADP, road = G("road", ORIGIN.road);
  b = new Batch();
  up(b, lam("field", () => ({ map: rep(grassT("field", "#3a5a34"), 1, 1) })), -240, 190, -120, 150, 0, 14);
  // the road ribbon, centre dashes, edge lines (built along the route)
  const ribbon = (w: number, y: number, lane: number, step: number, s0 = 0, s1 = ROUTE_LEN) => {
    const pos: number[] = [], uv: number[] = [], idx: number[] = []; let n = 0;
    for (let s = s0; s <= s1 + 1e-6; s += step) { const p = along(s, lane);
      pos.push(p.x + p.tz * w / 2, y, p.z - p.tx * w / 2, p.x - p.tz * w / 2, y, p.z + p.tx * w / 2); uv.push(0, s / 4, 1, s / 4); if (n) { const o = (n - 1) * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); } n++; }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  };
  { const rm = mesh(ribbon(R.width, 0.02, 0, 2), lam("roadA", () => ({ map: asphalt("roadA", "#4a4852") })), road); rm.castShadow = false; rm.receiveShadow = true;
    const dt = dashT(); dt.wrapS = dt.wrapT = THREE.RepeatWrapping; const dm = new THREE.MeshBasicMaterial({ map: dt, transparent: true, alphaTest: 0.5 }); dm.color.setScalar(0.85);
    mesh(ribbon(0.14, 0.03, 0, 1), dm, road).castShadow = false;
    for (const l of [-3.3, 3.3]) mesh(ribbon(0.12, 0.03, l, 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.75, 0.75, 0.72) }), road).castShadow = false; }
  // the gold trail (drawRange set per frame)
  const trailM = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 2.2, 0.45), transparent: true, opacity: 0.92, depthWrite: false });
  const trail = mesh(ribbon(1.3, 0.045, R.lane, 1), trailM, road); trail.castShadow = false; trail.renderOrder = 2; trail.frustumCulled = false;
  // lakes, a farm, poles along the straight, trees
  for (const [lx, lz, a2, b2] of R.lakes) { const m = mesh(new THREE.CircleGeometry(1, 40), lam("lake", () => ({ color: "#1e3a6a" })), road, lx, 0.012, lz); m.rotation.x = -Math.PI / 2; m.scale.set(a2, b2, 1); m.castShadow = false; }
  b = new Batch();
  { const [fx, fz] = R.farm; box(b, C("#e9e1cc"), fx, 0, fz, fx + 8, 3.0, fz + 6); slab(b, C("#6a2a2a"), fx + 4, 3.6, fz + 1.5, 8.6, 0.2, 3.6, 0, 0.45); slab(b, C("#6a2a2a"), fx + 4, 3.6, fz + 4.5, 8.6, 0.2, 3.6, 0, -0.45);
    box(b, C("#9a3a2a"), fx + 12, 0, fz - 2, fx + 20, 5.0, fz + 6); cyl(b, C("#c9ccd2"), fx + 22, 0, fz + 1, 1.6, 1.6, 8, 16); }
  for (let x = -196; x < -40; x += 32) { cyl(b, C("#6a5a48"), x, 0, -5.6, 0.12, 0.1, 8.5, 8); box(b, C("#6a5a48"), x - 0.06, 7.6, -6.6, x + 0.06, 7.75, -4.6); }
  for (let i = 0; i < 60; i++) { const s = 10 + i * 6.1, side = i % 2 ? 1 : -1, p = along(s, side * (9 + 14 * hh(i, 3))); if (Math.hypot(p.x - R.farm[0] - 8, p.z - R.farm[1] - 2) < 16) continue; tree(b, p.x, p.z, 0.8 + 0.6 * hh(i, 5)); }
  // the stop sign, the speed camera, the five cell towers (lattice, antennas, top lamp)
  const [ssx, ssz] = R.stopsign; box(b, steel, ssx - 0.03, 0, ssz - 0.03, ssx + 0.03, 1.7, ssz + 0.03);
  const [scx, scz] = R.speedcam; box(b, C("#5a5d68"), scx - 0.06, 0, scz - 0.06, scx + 0.06, 2.3, scz + 0.06); box(b, C("#3a3d46"), scx - 0.28, 2.25, scz - 0.16, scx + 0.18, 2.55, scz + 0.16);
  const towerLamps: THREE.MeshBasicMaterial[] = [];
  for (const [ttx, ttz] of R.towers) {
    const Ht = R.tower_h, legs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (const [sx, sz] of legs) { const a = V(ttx + sx * 1.3, 0, ttz + sz * 1.3), c = V(ttx + sx * 0.3, Ht, ttz + sz * 0.3), L = a.distanceTo(c), g = new THREE.CylinderGeometry(0.07, 0.1, L, 6); g.translate(0, L / 2, 0); b.add(g, C("#9aa0aa"), new THREE.Matrix4().compose(a, new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), c.clone().sub(a).normalize()), V(1, 1, 1))); }
    for (let k = 1; k < 6; k++) { const y = (k / 6) * Ht, r = 1.3 - (k / 6) * 1.0; box(b, C("#9aa0aa"), ttx - r, y, ttz - r, ttx + r, y + 0.1, ttz + r); }
    for (let a = 0; a < 3; a++) { const an = a * 2.09; box(b, C("#e9e4d6"), ttx + Math.cos(an) * 0.6 - 0.15, Ht - 2.4, ttz + Math.sin(an) * 0.6 - 0.15, ttx + Math.cos(an) * 0.6 + 0.15, Ht - 0.6, ttz + Math.sin(an) * 0.6 + 0.15); }
    const lm = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.08, 0.08) }); towerLamps.push(lm); mesh(new THREE.SphereGeometry(0.55, 12, 10), lm, road, ttx, Ht + 0.5, ttz);
  }
  b.build(road);
  plane(0.78, 0.78, basicC(art("stop", 256, 256, A2.stopSign), true, 0.9), road, ssx - 0.04, 2.05, ssz, -Math.PI / 2).castShadow = false;
  const flash = mesh(new THREE.SphereGeometry(0.22, 12, 10), glow(6, 6, 6), road, scx - 0.3, 2.4, scz); flash.visible = false;

  // ===== THE RENTAL OFFICE =====
  SETL = "rent";
  const RN = RENTP, rent = G("rent", ORIGIN.rent), [nx0, nx1, nz0, nz1] = RN.room;
  shellXZ(rent, nx0, nx1, nz0, nz1, RN.h, lam("rentFloor", () => ({ map: rep(tilesT("rent", "#d9dde2", "#c9ced6"), 2, 2) })), lam("rentWall", () => ({ map: paintWall("rent", "#e9eef4") })), "#f4f6f8");
  b = new Batch();
  const [kx0, kx1, kz0, kz1] = RN.counter;
  box(b, C("#2f5fb4"), kx0, 0, kz0, kx1, RN.counter_y - 0.03, kz1); box(b, C("#e9e4d6"), kx0 - 0.03, RN.counter_y - 0.03, kz0 - 0.03, kx1 + 0.03, RN.counter_y, kz1 + 0.03);
  box(b, ink, kx0 + 0.1, RN.counter_y, kz0 + 0.05, kx0 + 0.5, RN.counter_y + 0.32, kz0 + 0.09); // monitor back (screen faces the clerk)
  // the archive: a grey cabinet on the -x wall with 8 x 4 drawers
  const ax = RN.archive_x, aface = ax + 0.36, [az0, az1] = RN.archive_z, [nc, nr] = RN.drawers, dw = RN.drawer_w, dh = RN.drawer_h;
  box(b, C("#8a9098"), ax, 0, az0 - 0.06, aface - 0.02, 0.1 + nr * dh + 0.06, az1 + 0.06);
  b.build(rent);
  const years = (c: number, r: number) => (r === 0 ? 1987 + c : 2026 - (nc - 1 - c) - (r - 1) * nc); // 2026 sits at column 8, row 2 (the drawer the clerk files into)
  let drawer26 = new THREE.Group();
  for (let c = 0; c < nc; c++) for (let r = 0; r < nr; r++) {
    const g = new THREE.Group(), zc = az0 + (c + 0.5) * dw, yc = 0.1 + (r + 0.5) * dh; g.position.set(aface, yc, zc); rent.add(g);
    mesh(new THREE.BoxGeometry(0.04, dh - 0.03, dw - 0.03), C("#aab0ba"), g, 0.0, 0, 0); mesh(new THREE.BoxGeometry(0.03, 0.03, 0.16), C("#3a3d46"), g, 0.035, -0.1, 0);
    plane(0.2, 0.1, lamC(art("dl" + years(c, r), 200, 100, (p) => A2.drawerLabel(p, years(c, r)))), g, 0.0205, 0.1, 0, Math.PI / 2);
    if (c === RN.drawer2026[0] && r === RN.drawer2026[1]) { mesh(new THREE.BoxGeometry(0.42, dh - 0.08, dw - 0.06), C("#8a9098"), g, -0.21, -0.01, 0); drawer26 = g; }
  }
  plane(2.2, 0.32, basicC(art("carRental", 1400, 200, (p) => A2.letters(p, 1400, 200, "CAR RENTAL", "#2f5fb4", 150)), true), rent, -0.6, 2.25, nz0 + 0.012).castShadow = false;
  plane(0.8, 0.6, lamC(art("keys", 400, 300, A2.keyBoard)), rent, 0.9, 1.45, nz0 + 0.012);
  plane(0.36, 0.24, basicC(art("mon", 400, 260, A2.monitor)), rent, kx0 + 0.3, RN.counter_y + 0.17, kz0 + 0.046, Math.PI).castShadow = false;
  const paper = canvasMat(640, 900), [ppx, ppy, ppz] = RN.paper, [pw, pd] = RN.paper_size;
  const paperMesh = flatP(pw, pd, lamC(paper.tex), rent, ppx, ppy, ppz);

  // ===== THE POLICE STATION =====
  SETL = "pol";
  const PO = POLP, pol = G("pol", ORIGIN.pol), [px0, px1, pz0, pz1] = PO.room;
  shellXZ(pol, px0, px1, pz0, pz1, PO.h, lam("polFloor", () => ({ map: rep(tilesT("pol", "#b9c0c8", "#a9b0ba"), 2, 2) })), lam("polWall", () => ({ map: paintWall("pol", "#c8d4dc") })), "#eef0f2");
  b = new Batch();
  const [bx0, bx1, by0, by1] = PO.board, BZ = PO.board_z;
  box(b, wood, bx0 - 0.05, by0 - 0.05, pz0, bx1 + 0.05, by1 + 0.05, BZ - 0.035);
  const [ex0, ex1, ez0, ez1] = PO.desk;
  box(b, C("#5a6a7a"), ex0, 0, ez0, ex1, PO.desk_y - 0.03, ez1); box(b, C("#d9d1c3"), ex0 - 0.03, PO.desk_y - 0.03, ez0 - 0.03, ex1 + 0.03, PO.desk_y, ez1 + 0.03);
  for (let i = 0; i < 5; i++) box(b, C("#7a8a9a"), -2.9, 0, 0.6 + i * 0.45, -2.5, 1.9, 1.02 + i * 0.45); // lockers
  b.build(pol);
  { const cm = mesh(new THREE.PlaneGeometry(bx1 - bx0, by1 - by0), lamC(ctex("corkB", 512, 256, A2.cork())), pol, (bx0 + bx1) / 2, (by0 + by1) / 2, BZ - 0.03); cm.castShadow = false; }
  plane(PO.map_size[0], PO.map_size[1], lamC(art("map", 900, 1100, A2.policeMap)), pol, PO.map[0], PO.map[1], BZ - 0.025);
  plane(1.2, 0.48, basicC(art("polSign", 400, 160, A2.policeDoor), false, 0.9), pol, -1.9, 2.25, pz0 + 0.012).castShadow = false;
  const itemArt = [A2.cctvStill, A2.rentalCopy, A2.gpsSheet, A2.phoneSheet, A2.printsCard];
  const items = ["cctv", "rental", "gps", "phone", "prints"].map((n, i) => { const s2 = (PO.slots as Record<string, number[]>)[n]; const m = plane(0.4, 0.3, lamC(art("ev" + n, 400, 300, itemArt[i])), pol, s2[0], s2[1], BZ - 0.02); m.castShadow = false; return m; });
  const strM = C("#c8242a"); const strings = Array.from({ length: 6 }, () => { const m = mesh(new THREE.BoxGeometry(1, 0.008, 0.004), strM, pol); m.castShadow = false; m.visible = false; return m; });
  const pinJ = mesh(new THREE.SphereGeometry(0.018, 10, 8), C("#d8322f"), pol, PO.pin_justice[0], PO.pin_justice[1], BZ - 0.005);
  mesh(new THREE.SphereGeometry(0.016, 10, 8), C("#2f5fb4"), pol, PO.pin_twin[0], PO.pin_twin[1], BZ - 0.006);
  const folders: Canvas[] = [], folderMeshes: THREE.Mesh[] = [];
  PO.folders.forEach(([fx, fz]) => { const cv = canvasMat(440, 600); folders.push(cv); folderMeshes.push(flatP(0.22, 0.3, basicC(cv.tex, false, 0.92), pol, fx, PO.desk_y + 0.004, fz)); });

  // ===== JUSTICE =====
  SETL = "jus";
  const J = JUSP, jus = G("jus", ORIGIN.jus);
  b = new Batch();
  up(b, lam("lawn", () => ({ map: rep(grassT("lawn", "#5a8a44"), 1, 1) })), -40, 40, -24, J.sidewalk[0], 0, 6);
  box(b, walkM, -40, 0, J.sidewalk[0], 40, 0.12, J.sidewalk[1], 2); up(b, asphM, -40, 40, J.street[0], J.street[1], 0, 6); up(b, lam("lawn2", () => ({ map: rep(grassT("lawn2", "#4f7a3c"), 1, 1) })), -40, 40, J.street[1], 40, 0, 6);
  const [dx0, dx1, dz0] = J.drive; box(b, walkM, dx0, 0, dz0, dx1, 0.03, J.sidewalk[0] - 0.01, 2);
  const [hx0, hx1, hz0, hz1] = J.house, HH = J.house_h, sid = lam("siding", () => ({ map: rep(sidingT("house", "#c9b98a"), 2, 2) }));
  box(b, sid, hx0, 0, hz0, hx1, HH, hz1, 1);
  slab(b, C("#4a3a3a"), (hx0 + hx1) / 2, HH + 0.7, (hz0 + hz1) / 2 - 2.0, hx1 - hx0 + 0.6, 0.15, 4.6, 0, -0.36); slab(b, C("#4a3a3a"), (hx0 + hx1) / 2, HH + 0.7, (hz0 + hz1) / 2 + 2.0, hx1 - hx0 + 0.6, 0.15, 4.6, 0, 0.36);
  box(b, C("#6a3a2a"), J.door_x - 0.48, 0, hz1, J.door_x + 0.48, 2.1, hz1 + 0.06);
  for (const wx of [-6.4, -1.0]) { box(b, white, wx - 0.75, 0.85, hz1, wx + 0.75, 2.05, hz1 + 0.05); box(b, C("#2a3a5a"), wx - 0.68, 0.92, hz1 + 0.01, wx + 0.68, 1.98, hz1 + 0.06); }
  const [gx0, gx1, gz0, gz1] = J.garage, GH = J.garage_h, [go0, go1] = J.gdoor, GOH = J.gdoor_h;
  box(b, sid, gx0, 0, gz0, gx0 + 0.15, GH, gz1); box(b, sid, gx1 - 0.15, 0, gz0, gx1, GH, gz1); box(b, sid, gx0 + 0.15, 0, gz0, gx1 - 0.15, GH - 0.01, gz0 + 0.15);
  box(b, sid, gx0 + 0.15, 0, gz1 - 0.15, go0, GH, gz1); box(b, sid, go1, 0, gz1 - 0.15, gx1 - 0.15, GH, gz1); box(b, sid, go0, GOH, gz1 - 0.15, go1, GH, gz1);
  box(b, C("#4a3a3a"), gx0 - 0.1, GH, gz0 - 0.1, gx1 + 0.1, GH + 0.15, gz1 + 0.15);
  up(b, C("#9a9a96"), gx0 + 0.15, gx1 - 0.15, gz0 + 0.15, gz1 - 0.15, 0.02, 2);
  // loot on shelves: booster boxes and slab boxes along the back and right walls
  for (const y of [0.5, 1.1, 1.7]) box(b, wood, gx0 + 0.3, y - 0.03, gz0 + 0.15, gx1 - 0.3, y, gz0 + 0.6);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const x = gx0 + 0.4 + i * 0.42, y = 0.5 + r * 0.6; box(b, C(["#24315a", "#3a2050", "#c99a62"][(i + r) % 3]), x, y, gz0 + 0.2, x + 0.36, y + 0.24 + 0.06 * ((i + r) % 2), gz0 + 0.55); }
  const [sbx, sby, sbz] = J.slab_box; box(b, C("#c99a62"), sbx - 0.25, 0.02, sbz - 0.2, sbx + 0.25, sby, sbz + 0.2);
  // hedge, maple, mailbox, the welcome sign posts
  const [hgx0, hgx1, hgz0, hgz1] = J.hedge; box(b, M.bush(), hgx0, 0, hgz0, hgx1, J.hedge_h, hgz1); for (let i = 0; i < 6; i++) sph(b, M.bush(), hgx0 + 0.25 + i * 0.43, J.hedge_h - 0.05, (hgz0 + hgz1) / 2, 0.32);
  tree(b, J.tree[0], J.tree[1], 1.3);
  box(b, ink, 1.5, 0, 4.6, 1.56, 1.0, 4.66); box(b, C("#2f5fb4"), 1.38, 1.0, 4.5, 1.68, 1.22, 4.8);
  const [jsx, jsz] = J.jsign, jy = J.jsign_yaw;
  for (const d of [-0.75, 0.75]) { const px = jsx + d * Math.cos(jy), pz = jsz - d * Math.sin(jy); box(b, wood, px - 0.06, 0, pz - 0.06, px + 0.06, 1.9, pz + 0.06); }
  b.build(jus);
  { const sg = plane(1.7, 1.0, basicC(art("welcome", 700, 420, A2.welcomeSign), false, 0.95), jus, jsx + 0.08 * Math.sin(jy), 1.35, jsz + 0.08 * Math.cos(jy), jy); sg.castShadow = true; }
  mesh(new THREE.SphereGeometry(0.07, 10, 8), glow(3, 2.4, 1.4), jus, J.door_x + 0.7, 1.9, hz1 + 0.12);
  mesh(new THREE.SphereGeometry(0.06, 10, 8), glow(3, 2.6, 1.6), jus, (gx0 + gx1) / 2, GH - 0.12, (gz0 + gz1) / 2);
  // the slabs standing in the box (the hero one with the GOLDENROD sticker is held by the officer in S20)
  const slabTex = (img: string, st: string) => lamC(art("slab" + img + st, 310, 500, (p) => A2.slab(p, 310, 500, img, "10", st)));
  ["lc_gengar", "zard_base", "neo_hooh"].forEach((img, i) => { const m = plane(0.16, 0.26, slabTex(img, "$900"), jus, sbx - 0.14 + i * 0.13, sby + 0.08, sbz - 0.05 + i * 0.02); m.rotation.x = -0.25; });
  // the sectional garage door: 4 segments on a track (vertical in the opening, then back under the ceiling)
  const gdoor = [0, 1, 2, 3].map(() => mesh(new THREE.BoxGeometry(go1 - go0 - 0.02, GOH / 4 - 0.01, 0.045), C("#e9e4d6"), jus, (go0 + go1) / 2, 0, gz1 - 0.08));
  // police cruisers (white with a navy stripe, POLICE on the doors, red/blue lightbar)
  const bars: THREE.MeshBasicMaterial[][] = [];
  const cars = J.cars.map((_, ci) => {
    const g = new THREE.Group(); jus.add(g); const cb = new Batch(), bw = C("#f4f4f2"), nv = C("#1d2a44");
    box(cb, bw, -2.3, 0.32, -0.9, 2.3, 0.95, 0.9); box(cb, nv, -2.31, 0.55, -0.91, 2.31, 0.72, 0.91); box(cb, bw, -1.2, 0.95, -0.82, 0.9, 1.45, 0.82); box(cb, C("#2a3a5a"), -1.1, 0.98, -0.84, 0.8, 1.4, 0.84);
    wheelsAt(cb, [-1.45, 1.45], [-0.8, 0.8], 0.34); cb.build(g);
    const red = new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.2, 0.2) }), blue = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.5, 3.4) }); bars.push([red, blue]);
    mesh(new THREE.BoxGeometry(0.22, 0.1, 0.5), red, g, -0.15, 1.5, -0.3); mesh(new THREE.BoxGeometry(0.22, 0.1, 0.5), blue, g, -0.15, 1.5, 0.3);
    for (const z of [-1, 1]) plane(1.0, 0.4, basicC(art("polDoor", 400, 160, A2.policeDoor), false, 0.85), g, 0.2, 0.62, z * 0.912, z > 0 ? 0 : Math.PI).castShadow = false;
    void ci; return g;
  });

  // shells and fittings: transparent things draw no ink and cast no shadow
  for (const g of [...Object.values(groups), van]) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } else m.receiveShadow = true; });
  van.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && !(m.material as THREE.Material).transparent) m.castShadow = true; });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void sign; void bush; void palm; void lamp; void car; void wheels; void grassHD; void planksHD; void roofHD; void beam; void water; void stoneHD; void RENTP; void JUSP;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, van, vanBrake, vanHaz, pane, caseTops, caseFronts, cases, drawer, shards, tDoors, lock, shackle, trail, towerLamps, flash,
    paper, paperMesh, drawer26, items, strings, pinJ, folders, folderMeshes, gdoor, cars, bars };
};
const glassTintM = () => lam("vanGlass", () => ({ color: "#3a4458" }));
/** wheels: tyres along x at xs, on both sides z (or, for the trailer, one axle at z = xs[0] across x0..x1) */
const wheelsAt = (b: Batch, xs: number[], zs: number[], r: number, trailer = false, x0 = 0, x1 = 0) => {
  if (trailer) { for (const x of [x0 - 0.02, x1 + 0.22]) cyl(b, M.tyre(), x, 0.33, xs[0], 0.33, 0.33, 0.2, 14, new THREE.Euler(0, 0, Math.PI / 2)); return; }
  for (const x of xs) for (const z of zs) { cyl(b, M.tyre(), x, r, z - 0.12, r, r, 0.24, 14, new THREE.Euler(Math.PI / 2, 0, 0)); }
};
const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
