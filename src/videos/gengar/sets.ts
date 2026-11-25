// The sets of the Gengar reel (the Fanatics Collect hall, the census gallery, the café terrace, the writer's desk), built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { scan, plainSign, letters as lettersArt, poleScale, poleTop, markerPlate, censusWall } from "./art2";
import { V3, obj, ORIGIN, HALLP, CENP, CAFP, DESKP } from "./story";

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
export type Sets = {
  groups: Record<string, THREE.Group>;
  board: Canvas; bids: Canvas; slabC: Canvas; slabG: THREE.Group;
  tagG: THREE.Group; tagFront: Canvas; tagBack: Canvas; tagMats: THREE.MeshBasicMaterial[]; tagPlanes: THREE.Mesh[]; tagString: THREE.Mesh;
  markerNew: THREE.Mesh; markerMat: THREE.MeshBasicMaterial; cordKnot: THREE.Mesh; button: THREE.Mesh;
  phone: Canvas; phoneMesh: THREE.Group;
  censusSlab: Canvas;
  cups: THREE.Group[]; iou: THREE.Mesh; iouC: Canvas; iouMat: THREE.MeshBasicMaterial; env: THREE.Mesh;
  laptop: Canvas;
};
export const TY = 0.76;

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
/** blue sky with puffy white inked clouds (quality bar: every window and outdoor shot) */
const cloudSky = (key: string, top = "#3f86e0", bot = "#bfe0fb") => ctex("cloudSky" + key, 512, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  const puff = (cx: number, cy: number, s: number) => {
    const bl = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.25, 0.75], [-0.4, -0.35, 0.75], [0.45, -0.3, 0.65]];
    g.fillStyle = "#3a4a6a"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s + 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#ffffff"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#e3ecf8"; g.fillRect(cx - 1.6 * s, cy + 0.45 * s, 3.2 * s, 0.5 * s);
  };
  puff(130, 150, 46); puff(380, 110, 38); puff(300, 330, 30);
});
/** the night outside the writer's window: rich blue, a moon, a skyline with warm lit windows */
const nightCity = () => ctex("nightCity", 512, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#1a3fa0"); gr.addColorStop(1, "#3f78d8"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#fff6d8"; g.beginPath(); g.arc(380, 90, 34, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,0.8)"; for (let i = 0; i < 30; i++) g.fillRect((i * 97) % 512, (i * 53) % 200, 3, 3);
  for (const [x, y, w] of [[0, 300, 90], [80, 250, 80], [170, 330, 70], [235, 220, 90], [330, 290, 80], [405, 260, 107]]) { g.fillStyle = "#2a4f9a"; g.fillRect(x, y, w, 512 - y); for (let yy = y + 14; yy < 500; yy += 26) for (let xx = x + 8; xx < x + w - 8; xx += 18) { g.fillStyle = (xx * yy) % 7 < 4 ? "#ffd86a" : "#3a62b0"; g.fillRect(xx, yy, 8, 12); } }
});
const cardTexture = (name: string) => ctex("card" + name, 600, 838, (g) => { g.clearRect(0, 0, 600, 838); scan(g, name, 0, 0, 600, 838); });
const banner = (key: string, txt: string, bg: string, fg: string) => ctex("banner" + key, 240, 900, (g) => {
  g.fillStyle = bg; g.beginPath(); g.moveTo(0, 0); g.lineTo(240, 0); g.lineTo(240, 830); g.lineTo(120, 900); g.lineTo(0, 830); g.closePath(); g.fill();
  g.fillStyle = fg; g.fillRect(14, 14, 212, 10); g.fillRect(14, 790, 212, 10);
  g.save(); g.translate(120, 420); g.rotate(-Math.PI / 2); g.font = "900 120px Arial Black, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 0, 760); g.restore();
});

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const lamC = (tex: THREE.Texture, transparent = false) => new THREE.MeshLambertMaterial({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 });
  const basicC = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.02 : 0 });
  const signTex = (key: string, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => ctex("sign" + key, W, H, (g) => plainSign(new Pen(g), W, H, txt, bg, fg, sub, border));
  const letterTex = (key: string, W: number, H: number, txt: string, col: string, px: number) => ctex("let" + key, W, H, (g) => lettersArt(new Pen(g), W, H, txt, col, px));
  /** a closed room x0..x1, z0..z1, h high, with a ceiling that casts no shadow */
  const shellXZ = (g: THREE.Group, x0: number, x1: number, z0: number, z1: number, h: number, floorM: THREE.Material, wallM: THREE.Material, ceil: string) => {
    const sb = new Batch();
    up(sb, floorM, x0, x1, z0, z1, 0, 1);
    box(sb, wallM, x0 - 0.1, 0, z0 - 0.1, x1 + 0.1, h, z0, 2); box(sb, wallM, x0 - 0.1, 0, z1, x1 + 0.1, h, z1 + 0.1, 2);
    box(sb, wallM, x0 - 0.1, 0, z0, x0, h, z1, 2); box(sb, wallM, x1, 0, z0, x1 + 0.1, h, z1, 2);
    sb.build(g, false);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lam("ceil" + ceil, () => ({ color: ceil }))); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, h - 0.002, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; g.add(c);
  };
  const windowOn = (b: Batch, g: THREE.Group, axis: "x" | "z", at: number, n: number, c: number, y0: number, y1: number, w: number, tex: THREE.Texture, frame: THREE.Material) => {
    const pm = new THREE.MeshBasicMaterial({ map: tex }), d = 0.006 * n;
    const pane = plane(w, y1 - y0, pm, g, axis === "x" ? at + d : c, (y0 + y1) / 2, axis === "x" ? c : at + d, axis === "x" ? (n > 0 ? Math.PI / 2 : -Math.PI / 2) : (n > 0 ? 0 : Math.PI));
    pane.castShadow = false; pane.receiveShadow = false;
    const t = 0.05, dep = 0.06 * n;
    const bx = (a0: number, a1: number, yy0: number, yy1: number) => axis === "x" ? box(b, frame, Math.min(at, at + dep), yy0, a0, Math.max(at, at + dep), yy1, a1) : box(b, frame, a0, yy0, Math.min(at, at + dep), a1, yy1, Math.max(at, at + dep));
    bx(c - w / 2 - t, c + w / 2 + t, y0 - t, y0); bx(c - w / 2 - t, c + w / 2 + t, y1, y1 + t);
    bx(c - w / 2 - t, c - w / 2, y0, y1); bx(c + w / 2, c + w / 2 + t, y0, y1);
    return pane;
  };
  const white = C("#f3f1ec"), ink = C("#2a2c33"), oak = C("#8a5a34"), brass = C("#c9a24a"), steel = C("#c9ccd2");
  const glassMat = () => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });

  // ===== THE HALL (Fanatics Collect) =====
  SETL = "hall";
  const Hh = HALLP, hall = G("hall", ORIGIN.hall), SYv = Hh.stage_y;
  const [rx0, rx1, rz0, rz1] = Hh.room;
  shellXZ(hall, rx0, rx1, rz0, rz1, Hh.h, lam("hallFloor", () => ({ map: rep(carpetT("hall", "#c0323c"), 5, 5) })), lam("hallWall", () => ({ map: paintWall("hall", "#fff3d6") })), "#fbf3e2");
  let b = new Batch();
  const [sx0, sx1, sz0, sz1] = Hh.stage;
  box(b, C("#a8562e"), sx0, 0, sz0, sx1, SYv - 0.03, sz1); box(b, C("#c98a4e"), sx0, SYv - 0.03, sz0, sx1, SYv, sz1);
  // the rostrum: body, overhanging top, the sound block, the green button
  const [qx0, qx1, qz0, qz1] = Hh.rostrum;
  box(b, oak, qx0, SYv, qz0, qx1, Hh.rostrum_y - 0.03, qz1); box(b, C("#6e4428"), qx0 - 0.03, Hh.rostrum_y - 0.03, qz0 - 0.03, qx1 + 0.03, Hh.rostrum_y, qz1 + 0.03);
  cyl(b, C("#5a3a22"), Hh.block[0], Hh.rostrum_y, Hh.block[2], 0.065, 0.065, 0.03, 18);
  // the lot plinth and the easel
  const [px0, px1, pz0, pz1] = Hh.plinth;
  box(b, white, px0, SYv, pz0, px1, Hh.plinth_y, pz1);
  box(b, brass, px0 - 0.01, Hh.plinth_y, pz0 - 0.01, px1 + 0.01, Hh.plinth_y + 0.012, pz1 + 0.01);
  // the tag arm: a brass post at the plinth's right back corner and a crossbar to the string's knot
  const [tgx, tgy, tgz] = Hh.tag_top;
  cyl(b, brass, -0.13, Hh.plinth_y + 0.012, -2.9, 0.007, 0.007, tgy + 0.03 - Hh.plinth_y - 0.012, 8);
  box(b, brass, -0.137, tgy + 0.018, -2.9, -0.123, tgy + 0.032, tgz + 0.006); box(b, brass, tgx - 0.008, tgy + 0.018, tgz - 0.006, -0.123, tgy + 0.032, tgz + 0.006);
  // the price board and the bid counter housings, the FANATICS COLLECT letters
  const [bcx, bcy, bcz] = Hh.board, [bw, bh] = Hh.board_size;
  box(b, ink, bcx - bw / 2 - 0.05, bcy - bh / 2 - 0.05, -4.0, bcx + bw / 2 + 0.05, bcy + bh / 2 + 0.05, bcz - 0.012);
  const [dcx, dcy] = Hh.bids, [dw, dh] = Hh.bids_size;
  box(b, ink, dcx - dw / 2 - 0.04, dcy - dh / 2 - 0.04, -4.0, dcx + dw / 2 + 0.04, dcy + dh / 2 + 0.04, bcz - 0.012);
  // the record pole: post, pulley, cleat, the old brass marker's bracket
  const [plx, plz] = Hh.pole;
  box(b, white, plx - 0.04, SYv, plz - 0.04, plx + 0.04, Hh.pole_top, plz + 0.04);
  cyl(b, ink, plx, SYv, plz, 0.16, 0.16, 0.04, 18);
  cyl(b, brass, plx - 0.075, Hh.pole_top - 0.04, plz, 0.035, 0.035, 0.02, 16, new THREE.Euler(0, 0, Math.PI / 2));
  box(b, brass, plx - 0.075, 1.15, plz - 0.012, plx - 0.04, 1.2, plz + 0.012);
  // the cord: down the pole's left side from the pulley to the cleat
  box(b, C("#e9d7a8"), plx - 0.083, 1.2, plz - 0.003, plx - 0.077, Hh.pole_top - 0.04, plz + 0.003);
  // bidder chairs (folding: seat, back, legs)
  for (const [cx, cz] of Hh.bidders) {
    box(b, C("#c0323c"), cx - 0.21, 0.42, cz - 0.21, cx + 0.21, 0.46, cz + 0.17);
    box(b, C("#c0323c"), cx - 0.21, 0.46, cz - 0.24, cx + 0.21, 0.9, cz - 0.21);
    for (const dx of [-0.19, 0.17]) for (const dz of [-0.2, 0.15]) box(b, C("#c9a24a"), cx + dx, 0, cz + dz, cx + dx + 0.02, 0.42, cz + dz + 0.02);
  }
  // the champagne table: cloth to the floor, a coupe tower, an ice bucket with a bottle
  const [tx0, tx1, tz0, tz1] = Hh.table, TYh = Hh.table_y;
  box(b, C("#f6f4ee"), tx0, 0, tz0, tx1, TYh, tz1);
  box(b, C("#c0323c"), tx0 - 0.01, TYh - 0.16, tz1, tx1 + 0.01, TYh - 0.04, tz1 + 0.012); box(b, C("#e7c35c"), tx0 - 0.01, TYh - 0.19, tz1 + 0.003, tx1 + 0.01, TYh - 0.16, tz1 + 0.015); // a red-and-gold skirt band
  box(b, C("#c0323c"), tx0 - 0.01, 0.06, tz1 + 0.001, tx1 + 0.01, 0.14, tz1 + 0.013); box(b, C("#e7c35c"), tx0 - 0.01, 0.14, tz1 + 0.004, tx1 + 0.01, 0.17, tz1 + 0.016);
  const [twx, , twz] = Hh.tower, coupe = C("#cfe6f0");
  for (let r = 0; r < 4; r++) { const n = 4 - r, rr0 = 0.06 * n; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2; cyl(b, coupe, twx + Math.cos(a) * rr0 * 0.55, TYh + r * 0.075, twz + Math.sin(a) * rr0 * 0.4, 0.008, 0.04, 0.07, 10); } }
  cyl(b, steel, 1.55, TYh, 1.4, 0.08, 0.1, 0.2, 18); cyl(b, C("#1f5a34"), 1.55, TYh + 0.12, 1.4, 0.04, 0.02, 0.22, 12);
  // wall sconces
  for (const x of [-3.0, 3.0]) for (const z of [-1.0, 2.5]) { box(b, brass, x < 0 ? rx0 : rx1 - 0.08, 2.5, z - 0.08, x < 0 ? rx0 + 0.08 : rx1, 2.7, z + 0.08); }
  b.build(hall);
  for (const x of [-3.0, 3.0]) for (const z of [-1.0, 2.5]) mesh(new THREE.SphereGeometry(0.07, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.9, 1.3) }), hall, x < 0 ? rx0 + 0.12 : rx1 - 0.12, 2.78, z);
  // dressing: windows on the side walls (blue sky), banners either side of the board, framed real cards, palms at the stage corners, a gold rail along the stage
  const frameCard = (parent: THREE.Object3D, nm: string, x: number, y: number, z: number, h: number, ry = 0) => {
    const g2 = new THREE.Group(); g2.position.set(x, y, z); g2.rotation.y = ry; parent.add(g2);
    mesh(new THREE.BoxGeometry(h * 0.716 + 0.08, h + 0.08, 0.02), C("#b8862a"), g2, 0, 0, -0.012);
    mesh(new THREE.PlaneGeometry(h * 0.716 + 0.04, h + 0.04), C("#fbf7ec"), g2, 0, 0, -0.0005);
    const m = mesh(new THREE.PlaneGeometry(h * 0.716, h), new THREE.MeshBasicMaterial({ map: cardTexture(nm), transparent: true, alphaTest: 0.5 }), g2, 0, 0, 0.002); m.castShadow = false;
  };
  { const wb = new Batch();
    for (const z of [-1.2, 1.6]) { windowOn(wb, hall, "x", rx0, 1, z, 1.0, 3.2, 1.3, cloudSky("hallL" + z), white); windowOn(wb, hall, "x", rx1, -1, z, 1.0, 3.2, 1.3, cloudSky("hallR" + z), white); }
    for (const x of [-3.0, 3.0]) { cyl(wb, C("#c9643a"), x, SYv, -3.6, 0.2, 0.26, 0.5, 16); sph(wb, C("#3fa048"), x, SYv + 0.95, -3.6, 0.42); sph(wb, C("#2f8a40"), x + 0.2, SYv + 1.25, -3.55, 0.3); sph(wb, C("#4fb050"), x - 0.15, SYv + 1.35, -3.65, 0.28); }
    box(wb, brass, sx0, SYv + 0.002, sz1 - 0.04, sx1, SYv + 0.03, sz1 - 0.01);
    wb.build(hall); }
  for (const [x, t, bg] of [[-2.25, "LIVE", "#c0323c"], [0.95 + 0.62, "AUCTION", "#c0323c"]] as const) { const bn = plane(0.42, 1.55, basicC(banner(t, t, bg, "#f2c84a"), true), hall, x, 2.75, -3.97); bn.castShadow = false; }
  frameCard(hall, "zard_lc", -3.2, 2.2, -3.975, 0.6); frameCard(hall, "ds_rayquaza", 2.55, 2.85, -3.975, 0.5);
  frameCard(hall, "ds_metagross_star", rx0 + 0.02, 2.0, 0.25, 0.6, Math.PI / 2); frameCard(hall, "mewtwo", rx1 - 0.02, 2.0, 0.25, 0.6, -Math.PI / 2); frameCard(hall, "zard_base", rx1 - 0.02, 2.0, 3.2, 0.6, -Math.PI / 2); frameCard(hall, "pikachu", rx0 + 0.02, 2.0, 3.2, 0.6, Math.PI / 2);
  const board = canvasMat2(1160, 440); plane(bw, bh, basicC(board.tex), hall, bcx, bcy, bcz).castShadow = false;
  const bids = canvasMat2(700, 450); plane(dw, dh, basicC(bids.tex), hall, dcx, dcy, bcz).castShadow = false;
  plane(2.2, 0.28, basicC(letterTex("fc", 1600, 200, "FANATICS COLLECT", "#b8862a", 150), true), hall, Hh.letters[0], Hh.letters[1], -3.985).castShadow = false;
  plane(0.6, 0.1, lamC(signTex("rost", 600, 100, "FANATICS COLLECT", "#1d1b22", "#e7c35c")), hall, (qx0 + qx1) / 2, 1.05, qz1 + 0.006);
  const button = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16), new THREE.MeshLambertMaterial({ color: "#2fae5a" }), hall, -1.15, Hh.rostrum_y + 0.01, -2.84);
  // the slab on its easel (tilted back)
  const slabG = new THREE.Group(); slabG.position.set(...(Hh.slab as V3)); slabG.rotation.x = -Hh.slab_tilt; hall.add(slabG);
  const [sw, sh] = Hh.slab_size, slabC = canvasMat2(1000, 1690);
  mesh(new THREE.BoxGeometry(sw * 0.9, sh * 0.95, 0.01), C("#eef3f6"), slabG, 0, 0, -0.001); // the case back (the photo's clear edges show it)
  plane(sw, sh, basicC(slabC.tex, true), slabG, 0, 0, 0.0065).castShadow = false;
  mesh(new THREE.BoxGeometry(0.012, sh * 0.9, 0.012), brass, slabG, -sw * 0.32, -0.02, -0.02); mesh(new THREE.BoxGeometry(0.012, sh * 0.9, 0.012), brass, slabG, sw * 0.32, -0.02, -0.02);
  mesh(new THREE.BoxGeometry(sw * 1.1, 0.014, 0.03), brass, slabG, 0, -sh / 2 - 0.004, 0.008);
  // the tag: a group pivoting at the string's knot; the string and the two faces hang below
  const tagG = new THREE.Group(); tagG.position.set(tgx, tgy, tgz); hall.add(tagG);
  const L = Hh.tag_len, [tw, th] = Hh.tag_size;
  const tagString = mesh(new THREE.CylinderGeometry(0.0012, 0.0012, L, 6), C("#f4ead0"), tagG, 0, -L / 2, 0);
  const tagFront = canvasMat2(320, 180), tagBack = canvasMat2(320, 180);
  const tagMats = [new THREE.MeshBasicMaterial({ map: tagFront.tex, transparent: true, alphaTest: 0.02, side: THREE.FrontSide }), new THREE.MeshBasicMaterial({ map: tagBack.tex, transparent: true, alphaTest: 0.02, side: THREE.FrontSide })];
  const tf = plane(tw, th, tagMats[0], tagG, tw * 0.36, -L - th / 2, 0.0008), tb = plane(tw, th, tagMats[1], tagG, tw * 0.36, -L - th / 2, -0.0008, Math.PI); // the back is mirrored about the hole
  tf.castShadow = tb.castShadow = false;
  // the new record marker (ghost) on the pole, and the cord knot that pulls it
  const markerMat = new THREE.MeshBasicMaterial({ map: ctex("markerNew", 420, 150, (g) => markerPlate(new Pen(g), "$576,000", "NẾU TIỀN VỀ", true)), transparent: true, opacity: 0.82, depthWrite: false, side: THREE.DoubleSide });
  const markerNew = plane(0.36, 0.13, markerMat, hall, plx + 0.04 + 0.18, 1.0, plz + 0.045); markerNew.castShadow = false;
  plane(0.36, 0.13, lamC(ctex("markerOld", 420, 150, (g) => markerPlate(new Pen(g), "$408,000", "06 · 2026", false)), true), hall, plx + 0.04 + 0.18, SYv + Hh.old / Hh.mark_k, plz + 0.04);
  plane(0.06, 3.2, lamC(ctex("poleScale", 64, 1024, (g) => poleScale(new Pen(g)))), hall, plx, SYv + 1.6, plz + 0.042);
  plane(0.6, 0.17, lamC(signTex("poleTop", 600, 170, "KỶ LỤC GENGAR", "#1d1b22", "#f2c84a", "", "#c9a24a")), hall, plx, Hh.pole_top + 0.1, plz + 0.05);
  void poleTop;
  const cordKnot = mesh(new THREE.SphereGeometry(0.012, 8, 6), C("#e9d7a8"), hall, plx - 0.08, 1.3, plz);
  // the collector's phone (S14): seen only from his side
  const phone = canvasMat2(540, 1080), phoneMesh = new THREE.Group(); hall.add(phoneMesh);
  mesh(new THREE.BoxGeometry(0.075, 0.15, 0.009), C("#16181e"), phoneMesh, 0, 0, -0.005);
  plane(0.075, 0.15, basicC(phone.tex), phoneMesh, 0, 0, 0.0002).castShadow = false;

  // ===== THE CENSUS GALLERY =====
  SETL = "census";
  const Cn = CENP, census = G("census", ORIGIN.census);
  shellXZ(census, -3, 3, -3, 3, 3.2, lam("cenFloor", () => ({ map: rep(woodTex("cen", "#a8743e", "rgba(60,35,15,0.45)"), 3, 3) })), lam("cenWall", () => ({ map: paintWall("cen", "#f3e6c4") })), "#fbf3e2");
  b = new Batch();
  const [wcx, wcy] = Cn.wall, [ww, wh] = Cn.wall_size;
  box(b, brass, wcx - ww / 2 - 0.05, wcy - wh / 2 - 0.05, -3.0, wcx + ww / 2 + 0.05, wcy + wh / 2 + 0.05, -2.985);
  const [pdx, pdz] = Cn.podium;
  box(b, C("#c0323c"), pdx - 0.25, 0, pdz - 0.25, pdx + 0.25, Cn.podium_y, pdz + 0.25); box(b, brass, pdx - 0.27, Cn.podium_y, pdz - 0.27, pdx + 0.27, Cn.podium_y + 0.02, pdz + 0.27);
  for (const x of [-2.4, 2.4]) { cyl(b, C("#c9643a"), x, 0, -2.4, 0.2, 0.26, 0.5, 16); sph(b, C("#3fa048"), x, 0.95, -2.4, 0.42); sph(b, C("#2f8a40"), x + 0.2, 1.25, -2.35, 0.3); }
  box(b, C("#c0323c"), -1.2, 0, 0.0, 1.2, 0.012, 1.8); // a red runner up to the podium
  b.build(census);
  { const cb = new Batch(); for (const z of [-1.0, 1.2]) windowOn(cb, census, "x", -3, 1, z, 1.0, 2.6, 1.0, cloudSky("cenL" + z), white); cb.build(census); }
  plane(ww, wh, basicC(ctex("censusWall", 2048, 1205, (g) => censusWall(new Pen(g)))), census, wcx, wcy, -2.975).castShadow = false; // unlit: the slab photos keep their true colours
  const censusSlab = canvasMat2(1000, 1690);
  { const g2 = new THREE.Group(); g2.position.set(...(Cn.slab as V3)); g2.rotation.x = -0.18; census.add(g2);
    mesh(new THREE.BoxGeometry(sw * 0.9, sh * 0.95, 0.01), C("#eef3f6"), g2, 0, 0, -0.001); plane(sw, sh, basicC(censusSlab.tex, true), g2, 0, 0, 0.0065).castShadow = false;
    mesh(new THREE.BoxGeometry(sw * 1.1, 0.014, 0.03), brass, g2, 0, -sh / 2 - 0.004, 0.008); mesh(new THREE.BoxGeometry(0.012, sh * 0.9, 0.012), brass, g2, 0, -0.02, -0.02); }

  // ===== THE CAFÉ TERRACE =====
  SETL = "cafe";
  const Cf = CAFP, cafe = G("cafe", ORIGIN.cafe);
  b = new Batch();
  up(b, lam("paving", () => ({ map: rep(paving(), 1, 1) })), -8, 8, -6, 6, 0, 4);
  const fz = Cf.front;
  box(b, lam("cafeWall", () => ({ map: paintWall("cafe", "#f6e2b0") })), -3.6, 0, fz - 0.2, 3.6, 2.8, fz, 2); box(b, C("#c0323c"), -3.65, 2.8, fz - 0.25, 3.65, 2.95, fz + 0.04);
  box(b, C("#2f8a55"), -2.1, 0, fz, -1.1, 2.0, fz + 0.04); // the door
  box(b, C("#2f8a55"), 0.75, 0.7, fz, 2.55, 1.9, fz + 0.04); // the window frame
  cyl(b, C("#2a2c33"), 2.9, 0, -1.4, 0.05, 0.04, 3.2, 10); sph(b, C("#fff3c4"), 2.9, 3.3, -1.4, 0.14);
  for (const [x, z, r] of [[-5.0, -6.5, 1.4], [-1.5, -7.5, 1.7], [2.5, -6.8, 1.5], [5.5, -7.2, 1.6]]) { cyl(b, C("#8a5a34"), x, 0, z, 0.15, 0.12, 2.6, 10); sph(b, C("#3fa048"), x, 3.2, z, r); sph(b, C("#4fb050"), x + 0.6, 3.6, z + 0.3, r * 0.7); }
  for (const [x, w, h, col] of [[-6.5, 2.6, 4.2, "#e8a050"], [-3.8, 2.4, 3.6, "#f0d0a0"], [3.6, 2.6, 4.4, "#a8c8e8"], [6.2, 2.4, 3.8, "#e88a7a"]] as [number, number, number, string][]) box(b, C(col), x - w / 2, 0, -5.2, x + w / 2, h, -4.2);
  // the round table, its foot; two bistro chairs
  const [ctx, ctz] = Cf.table, CTY = Cf.table_y;
  cyl(b, C("#d8d2c4"), ctx, CTY - 0.03, ctz, Cf.table_r, Cf.table_r, 0.03, 28); cyl(b, ink, ctx, 0.02, ctz, 0.025, 0.025, CTY - 0.05, 10); cyl(b, ink, ctx, 0, ctz, 0.2, 0.2, 0.02, 20);
  for (const [cx, cz] of [Cf.borrower, Cf.lender]) { cyl(b, C("#3a5a3a"), cx, 0.44, cz, 0.2, 0.2, 0.03, 20); for (const a of [0.5, 2.1, 3.7, 5.3]) cyl(b, ink, cx + Math.cos(a) * 0.14, 0, cz + Math.sin(a) * 0.14, 0.012, 0.012, 0.44, 6); box(b, C("#3a5a3a"), cx - 0.18, 0.47, cz - 0.24, cx + 0.18, 0.86, cz - 0.21); }
  // potted plants
  for (const [x, z] of [[-3.0, -1.9], [3.0, -1.9]]) { cyl(b, C("#b8644a"), x, 0, z, 0.22, 0.28, 0.45, 16); sph(b, C("#4f9a48"), x, 0.75, z, 0.38); sph(b, C("#3d8f45"), x + 0.18, 0.95, z + 0.05, 0.26); }
  b.build(cafe);
  plane(1.75, 1.15, basicC(skyPanel("cafeWin", "#c98a4e", "#f6d28a")), cafe, 1.65, 1.3, fz + 0.045).castShadow = false;
  plane(1.6, 0.36, lamC(signTex("cafe", 800, 180, "CÀ PHÊ", "#2f8a55", "#fbf3dc", "", "#f2c84a")), cafe, 0, 2.48, fz + 0.01);
  { const aw = mesh(new THREE.BoxGeometry(7.0, 0.04, 1.0), lamC(rep(stripes("#d8322f", "#fbf3dc"), 6, 1)), cafe, 0, 2.12, fz + 0.48); aw.rotation.x = 0.32; }
  const cups = Cf.cups.map(([x, z]) => { const g2 = new THREE.Group(); g2.position.set(x, CTY, z); cafe.add(g2);
    mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.008, 20), white, g2, 0, 0.004, 0); const c2 = mesh(new THREE.CylinderGeometry(0.042, 0.034, 0.07, 18), white, g2, 0, 0.043, 0); void c2;
    mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.004, 18), C("#5a3420"), g2, 0, 0.074, 0); return g2; });
  const iouC = canvasMat2(400, 240), iouMat = new THREE.MeshBasicMaterial({ map: iouC.tex, transparent: true, opacity: 0.75, depthWrite: false, side: THREE.DoubleSide });
  const iou = mesh(new THREE.PlaneGeometry(0.2, 0.12), iouMat, cafe, Cf.iou[0], Cf.iou[1], Cf.iou[2]); iou.rotation.x = -Math.PI / 2; iou.castShadow = false;
  const env = mesh(new THREE.BoxGeometry(0.2, 0.03, 0.1), [C("#e9d7a8"), C("#e9d7a8"), lamC(ctex("envTop", 200, 100, (g) => { g.fillStyle = "#e9d7a8"; g.fillRect(0, 0, 200, 100); g.strokeStyle = "#a07a4a"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(100, 55); g.lineTo(200, 0); g.stroke(); g.fillStyle = "#7cc47a"; g.fillRect(70, 0, 60, 12); })), C("#e9d7a8"), C("#e9d7a8"), C("#e9d7a8")], cafe, Cf.env_from[0], CTY + 0.015, Cf.env_from[1]);

  // ===== THE WRITER'S DESK (night) =====
  SETL = "desk";
  const D = DESKP, desk = G("desk", ORIGIN.desk);
  shellXZ(desk, -2.4, 2.4, -2.4, 2.4, 2.6, lam("deskFloor", () => ({ map: rep(woodTex("desk", "#7a5a40", "rgba(40,25,15,0.5)"), 3, 3) })), lam("deskWall", () => ({ map: paintWall("desk", "#f3dfae") })), "#fbf3e2");
  b = new Batch();
  const [dx0, dx1, dz0, dz1] = D.table;
  box(b, C("#b88a5a"), dx0, TY - 0.04, dz0, dx1, TY, dz1);
  for (const x of [dx0 + 0.05, dx1 - 0.05]) for (const z of [dz0 + 0.05, dz1 - 0.05]) box(b, oak, x - 0.025, 0, z - 0.025, x + 0.025, TY - 0.04, z + 0.025);
  cyl(b, C("#3a3d46"), D.seller[0], 0, D.seller[1], 0.02, 0.02, 0.6, 10); cyl(b, C("#2f3240"), D.seller[0], 0.6, D.seller[1], 0.17, 0.17, 0.05, 20);
  const [lmx, , lmz] = D.lamp; cyl(b, ink, lmx, TY, lmz, 0.07, 0.07, 0.02, 16); cyl(b, ink, lmx, TY + 0.02, lmz, 0.008, 0.008, 0.36, 8);
  const [mgx, , mgz] = D.mug; cyl(b, C("#d8322f"), mgx, TY, mgz, 0.04, 0.04, 0.09, 16);
  for (let i = 0; i < 3; i++) box(b, C("#f4f1ea"), -0.75 + i * 0.03, TY, -0.68 - i * 0.02, -0.53 + i * 0.03, TY + 0.003 + i * 0.002, -0.55 - i * 0.02);
  for (const y of [0.9, 1.4, 1.9]) box(b, C("#e9e4d6"), 1.0, y - 0.02, -2.38, 2.3, y, -2.1);
  const stockCols = ["#2f5fb4", "#c23a32", "#e7a43a", "#2f9a55", "#7a3fb4", "#1d2a44"];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 1.05 + i * 0.2, y = 0.9 + r * 0.5; box(b, C(stockCols[(i + r) % 6]), x, y, -2.33, x + 0.16, y + 0.24 + 0.04 * ((i + r) % 2), -2.14); }
  windowOn(b, desk, "x", -2.4, 1, D.window[2], 1.0, 2.1, D.window_w, nightCity(), white);
  b.build(desk);
  { const sh2 = mesh(new THREE.ConeGeometry(0.09, 0.12, 16, 1, true), new THREE.MeshLambertMaterial({ color: "#2a2c33", side: THREE.DoubleSide }), desk, lmx + 0.08, TY + 0.4, lmz); sh2.rotation.z = 0.6;
    mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.0, 1.3) }), desk, lmx + 0.11, TY + 0.36, lmz); }
  frameCard(desk, "zard_lc", -0.9, 1.75, -2.38, 0.45); frameCard(desk, "ds_rayquaza", 0.3, 1.75, -2.38, 0.45); frameCard(desk, "pikachu", 2.37, 1.6, 0.6, 0.45, -Math.PI / 2);
  const laptop = canvasMat2(1024, 648);
  { const [lx, , lz] = D.laptop; const lap = new THREE.Group(); lap.position.set(lx, TY, lz); lap.rotation.y = D.laptop_yaw; desk.add(lap);
    mesh(new THREE.BoxGeometry(0.34, 0.015, 0.24), C("#9aa0aa"), lap, 0, 0.0075, 0); mesh(new THREE.BoxGeometry(0.3, 0.002, 0.12), C("#5a606c"), lap, 0, 0.016, 0.03);
    const lid = new THREE.Group(); lid.position.set(0, 0.015, -0.12); lid.rotation.x = -D.screen_tilt; lap.add(lid);
    mesh(new THREE.BoxGeometry(0.35, 0.225, 0.008), C("#9aa0aa"), lid, 0, 0.1125, -0.005);
    plane(D.screen_size[0], D.screen_size[1], basicC(laptop.tex), lid, 0, 0.1125, 0.0012).castShadow = false; }

  // shells and fittings: transparent things draw no ink and cast no shadow
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } else m.receiveShadow = true; });
  for (const o of [...cups, env, slabG, tagG, phoneMesh, cordKnot]) o.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh && !(m.material as THREE.Material).transparent) { m.castShadow = true; m.receiveShadow = true; } });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void M; void sign; void bush; void palm; void lamp; void car; void wheels; void stucco; void grassHD; void planksHD; void roofHD; void beam; void brick; void water; void stoneHD; void glassMat; void scan;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, board, bids, slabC, slabG, tagG, tagFront, tagBack, tagMats, tagPlanes: [tf, tb], tagString, markerNew, markerMat, cordKnot, button, phone, phoneMesh, censusSlab, cups, iou, iouC, iouMat, env, laptop };
};
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
