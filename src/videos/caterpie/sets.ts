// The sets of the Gengar reel (the Fanatics Collect hall, the census gallery, the café terrace, the writer's desk), built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import * as A2 from "./art2";
import { V3, obj, ORIGIN, PZ, WO } from "./story";
import { cobbleHD, facadeHD } from "../../engine/paint";

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
  sheetC: Canvas; sheet: THREE.Mesh; corner: THREE.Mesh; ann: THREE.Mesh;
  shutter: THREE.Mesh; shutterTex: THREE.Texture; shutterBar: THREE.Mesh; padlock: THREE.Group; banSign: THREE.Group;
  clockC: Canvas; bin: THREE.Group;
  beam: THREE.Group; pans: THREE.Group[]; weights: THREE.Group[];
  suitcase: THREE.Group; tag: THREE.Mesh; glass: THREE.Mesh; trophies: THREE.Group[]; cup: THREE.Group;
  phoneC: Canvas; phone: THREE.Group;
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
const cardTexture = (name: string) => ctex("card" + name, 600, 838, (g) => { g.clearRect(0, 0, 600, 838); A2.scan(g, name, 0, 0, 600, 838); });
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
  const art = (key: string, W: number, H: number, draw: (p: Pen) => void) => ctex("a2" + key, W, H, (g) => draw(new Pen(g)));
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

    const P = PZ, Wd = WO;
  const red = C("#d8322f"), terra = C("#c8643a"), cream = C("#f6e7c4"), green = C("#2f8a55"), stone = C("#e8dcc2"), gold = C("#e2b33a"), leafG = C("#4fa548");
  /** a house front: a box body and a painted façade (windows, louvred shutters) on its face; face +z/-z/+x/-x */
  const house = (g: THREE.Group, b: Batch, face: "+x" | "-x" | "+z" | "-z", c: number, a0: number, a1: number, h: number, wall: string, shutter: string, key: string, door = true) => {
    const w = a1 - a0, depth = 1.2, mat = lam("hb" + wall, () => ({ color: wall }));
    if (face === "+z") box(b, mat, a0, 0, c - depth, a1, h, c); else if (face === "-z") box(b, mat, a0, 0, c, a1, h, c + depth);
    else if (face === "+x") box(b, mat, c - depth, 0, a0, c, h, a1); else box(b, mat, c, 0, a0, c + depth, h, a1);
    const tex = facadeHD(key, w, h, { wall, shutter, door }), m = new THREE.MeshLambertMaterial({ map: tex });
    const mid = (a0 + a1) / 2, o = 0.004;
    const pl = face === "+z" ? plane(w, h, m, g, mid, h / 2, c + o, 0) : face === "-z" ? plane(w, h, m, g, mid, h / 2, c - o, Math.PI) : face === "+x" ? plane(w, h, m, g, c + o, h / 2, mid, Math.PI / 2) : plane(w, h, m, g, c - o, h / 2, mid, -Math.PI / 2);
    pl.castShadow = false;
    // a terracotta cornice that overhangs the face by 25 cm
    const k = 0.25;
    if (face === "+z") box(b, terra, a0 - 0.05, h, c - depth, a1 + 0.05, h + 0.22, c + k); else if (face === "-z") box(b, terra, a0 - 0.05, h, c - k, a1 + 0.05, h + 0.22, c + depth);
    else if (face === "+x") box(b, terra, c - depth, h, a0 - 0.05, c + k, h + 0.22, a1 + 0.05); else box(b, terra, c - k, h, a0 - 0.05, c + depth, h + 0.22, a1 + 0.05);
  };
  const flowerBox = (b: Batch, x: number, y: number, z: number, w: number) => {
    box(b, terra, x - w / 2, y, z, x + w / 2, y + 0.18, z + 0.22);
    for (let i = 0; i < 6; i++) { const px = x - w / 2 + 0.08 + (i * (w - 0.16)) / 5; sph(b, leafG, px, y + 0.26, z + 0.11, 0.1); sph(b, i % 2 ? red : C("#f2c84a"), px + 0.03, y + 0.34, z + 0.16, 0.055); }
  };
  const pot = (b: Batch, x: number, z: number, lemon = true) => {
    cyl(b, terra, x, 0, z, 0.2, 0.27, 0.5, 16); cyl(b, oak, x, 0.5, z, 0.04, 0.035, 0.6, 8);
    sph(b, leafG, x, 1.35, z, 0.42); sph(b, C("#3d8f45"), x + 0.2, 1.55, z + 0.05, 0.3); sph(b, C("#5ab04e"), x - 0.18, 1.6, z - 0.05, 0.28);
    if (lemon) for (const [dx, dy, dz] of [[0.25, 1.3, 0.25], [-0.2, 1.45, 0.3], [0.05, 1.7, 0.32], [0.3, 1.6, -0.1]]) sph(b, C("#ffd93a"), x + dx, dy, z + dz, 0.06, 1.15);
  };

  // ===== THE PIAZZA =====
  SETL = "piazza";
  const pz = G("piazza", ORIGIN.piazza), Hl = P.hall;
  let b = new Batch();
  { const [gx0, gx1, gz0, gz1] = P.ground; up(b, lam("cobble", () => ({ map: rep(cobbleHD(), 1, 1) })), gx0, gx1, gz0, gz1, 0, 8); }
  // --- the civic hall: façade with the door opening, pilasters, string course, cornice, upper windows with green shutters, the turret
  const fz = Hl.z, [dx0, dx1] = Hl.door, DH = Hl.door_h, hallM = lam("hallWall", () => ({ map: rep(stucco("hall", "#f6e3b8"), 1, 1) }));
  box(b, hallM, Hl.x[0], 0, fz - 0.4, dx0, Hl.h, fz, 2); box(b, hallM, dx1, 0, fz - 0.4, Hl.x[1], Hl.h, fz, 2); box(b, hallM, dx0, DH, fz - 0.4, dx1, Hl.h, fz, 2);
  for (const x of [-4.5, -2.5, 0.25, 2.75, 4.5]) box(b, cream, x - 0.14, 0, fz, x + 0.14, Hl.h - 0.3, fz + 0.09);
  box(b, cream, Hl.x[0] - 0.05, 3.95, fz, Hl.x[1] + 0.05, 4.12, fz + 0.14);          // string course
  box(b, terra, Hl.x[0] - 0.1, Hl.h - 0.3, fz - 0.4, Hl.x[1] + 0.1, Hl.h, fz + 0.3); // cornice
  box(b, C("#e9d3a8"), Hl.x[0], 0, fz, Hl.x[1], 0.45, fz + 0.05);                    // base plinth
  box(b, cream, dx0 - 0.16, 0, fz, dx0 - 0.002, DH + 0.18, fz + 0.12); box(b, cream, dx1 + 0.002, 0, fz, dx1 + 0.16, DH + 0.18, fz + 0.12); // door jambs
  box(b, cream, dx0 - 0.16, DH, fz + 0.002, dx1 + 0.16, DH + 0.18, fz + 0.12);
  const winU = (x: number, y0: number) => {
    box(b, C("#3f78c4"), x - 0.42, y0, fz + 0.001, x + 0.42, y0 + 1.25, fz + 0.012);
    box(b, cream, x - 0.5, y0 - 0.08, fz, x + 0.5, y0, fz + 0.1); box(b, cream, x - 0.5, y0 + 1.25, fz, x + 0.5, y0 + 1.36, fz + 0.1);
    for (const s of [-1, 1]) box(b, green, x + s * 0.47, y0, fz + 0.02, x + s * 0.83, y0 + 1.25, fz + 0.06);
    box(b, C("#f6efe0"), x - 0.02, y0, fz + 0.013, x + 0.02, y0 + 1.25, fz + 0.03);
    flowerBox(b, x, y0 - 0.26, fz + 0.1, 0.9);
  };
  winU(-3.5, 4.55); winU(-1.4, 4.55); winU(3.75, 4.55);
  for (const x of [-3.5, -1.4]) { box(b, C("#3f78c4"), x - 0.38, 1.35, fz + 0.001, x + 0.38, 2.85, fz + 0.012); for (const s of [-1, 1]) box(b, green, x + s * 0.43, 1.35, fz + 0.02, x + s * 0.76, 2.85, fz + 0.06); box(b, cream, x - 0.46, 2.85, fz, x + 0.46, 2.98, fz + 0.1); }
  { const [tx0, tx1, ty0, ty1] = Hl.turret; box(b, hallM, tx0, ty0, fz - 0.4, tx1, ty1 - 0.6, fz + 0.05); box(b, terra, tx0 - 0.1, ty1 - 0.7, fz - 0.5, tx1 + 0.1, ty1 - 0.55, fz + 0.15);
    box(b, C("#3a4a7a"), tx0 + 0.45, ty0 + 0.25, fz + 0.051, tx1 - 0.45, ty1 - 0.85, fz + 0.06); cyl(b, gold, (tx0 + tx1) / 2, ty0 + 0.5, fz + 0.07, 0.22, 0.12, 0.42, 14);
    const cone = new THREE.ConeGeometry(1.3, 1.1, 4); cone.rotateY(Math.PI / 4); cone.translate((tx0 + tx1) / 2, ty1 - 0.55 + 0.55, fz - 0.17); b.add(cone, lam("roofT", () => ({ map: roofHD("#c8643a") }))); }
  // the clock's stone surround
  cyl(b, cream, Hl.clock[0], Hl.clock[1], fz, Hl.clock_r + 0.12, Hl.clock_r + 0.12, 0.06, 32, new THREE.Euler(Math.PI / 2, 0, 0));
  // the tournament room behind the door (seen while the shutter is up): floor, walls, ceiling, a match table, a banner
  { const iz = Hl.inside_z; up(b, lam("inFloor", () => ({ map: rep(woodTex("in", "#b8844e", "rgba(60,35,15,0.4)"), 2, 2) })), dx0 - 0.3, dx1 + 0.3, iz, fz - 0.4, 0.001, 1);
    const inW = lam("inWall", () => ({ color: "#fff1d0" }));
    box(b, inW, dx0 - 0.4, 0, iz - 0.1, dx1 + 0.4, DH + 0.3, iz); box(b, inW, dx0 - 0.4, 0, iz, dx0 - 0.3, DH + 0.3, fz - 0.4); box(b, inW, dx1 + 0.3, 0, iz, dx1 + 0.4, DH + 0.3, fz - 0.4);
    box(b, C("#fff7e4"), dx0 - 0.4, DH + 0.3, iz, dx1 + 0.4, DH + 0.4, fz - 0.4);
    box(b, C("#ffffff"), 1.0, 0, -7.9, 2.0, 0.74, -7.5); }
  // the shutter's box above the door and its guide channels
  box(b, C("#b22a28"), dx0 - 0.05, Hl.box_y[0], fz + 0.02, dx1 + 0.05, Hl.box_y[1], fz + 0.3);
  for (const x of [dx0 + 0.005, dx1 - 0.045]) box(b, C("#8a1f1f"), x, 0, fz - 0.06, x + 0.04, DH, fz + 0.02);
  pot(b, -0.05, fz + 0.45, false); pot(b, 3.6, fz + 0.45, false);
  // --- the notice board: two oak posts, the frame, the header plank, a little roof
  { const [fx0, fx1, fy0, fy1] = P.board.face, bz = P.board.c[1];
    box(b, oak, fx0 - 0.1, 0, bz - 0.1, fx0, P.board.post_top, bz - 0.02); box(b, oak, fx1, 0, bz - 0.1, fx1 + 0.1, P.board.post_top, bz - 0.02);
    box(b, C("#6e4428"), fx0 - 0.03, fy0 - 0.05, bz - 0.09, fx1 + 0.03, fy1 + 0.02, bz - 0.006);
    box(b, oak, fx0 - 0.14, P.board.header[0], bz - 0.1, fx1 + 0.14, P.board.header[1], bz + 0.012);
    box(b, terra, fx0 - 0.22, P.board.post_top, bz - 0.3, fx1 + 0.22, P.board.post_top + 0.08, bz + 0.18); }
  // --- the bin
  const binG = new THREE.Group(); binG.position.set(P.bin[0], 0, P.bin[1]); pz.add(binG);
  { const bb = new Batch(); cyl(bb, C("#2f8a55"), 0, 0, 0, P.bin_r * 0.9, P.bin_r, P.bin_h, 18); cyl(bb, C("#256e44"), 0, P.bin_h, 0, P.bin_r + 0.02, P.bin_r + 0.02, 0.04, 18); cyl(bb, C("#1d1b22"), 0, P.bin_h + 0.002, 0, P.bin_r - 0.02, P.bin_r - 0.02, 0.041, 18); bb.build(binG, false); }
  // --- the café: one storey, terracotta, the striped awning, CAFFÈ, the window with cakes, the door; three tables; lemon trees
  { const C0 = P.cafe, cz = C0.z, [cx0, cx1] = C0.x;
    box(b, lam("cafeWall", () => ({ map: rep(stucco("cafe", "#e48a5a"), 1, 1) })), cx0, 0, cz - 0.4, cx1, C0.h, cz, 2);
    box(b, cream, cx0 - 0.05, C0.h - 0.2, cz - 0.4, cx1 + 0.05, C0.h, cz + 0.12);
    box(b, green, 3.9, 0, cz + 0.001, 4.9, 2.3, cz + 0.05); box(b, C("#f2c84a"), 4.75, 1.05, cz + 0.05, 4.8, 1.2, cz + 0.08);
    box(b, green, 5.3, 0.6, cz + 0.001, 7.6, 2.4, cz + 0.06);
    box(b, cream, 5.3, 0.55, cz, 7.6, 0.62, cz + 0.2);
    for (const [x, col] of [[5.7, "#f2c84a"], [6.2, "#e86aa0"], [6.7, "#8a5a34"], [7.2, "#ffffff"]] as [number, string][]) { cyl(b, C("#ffffff"), x, 0.62, cz + 0.1, 0.16, 0.16, 0.02, 16); cyl(b, C(col), x, 0.64, cz + 0.1, 0.12, 0.12, 0.12, 16); }
    for (const [tx, tz] of [P.t1, P.t2, P.t3]) {
      cyl(b, C("#f4efe4"), tx, P.table_y - 0.03, tz, P.table_r, P.table_r, 0.03, 28); cyl(b, ink, tx, 0.02, tz, 0.025, 0.025, P.table_y - 0.05, 10); cyl(b, ink, tx, 0, tz, 0.22, 0.22, 0.02, 20);
    }
    pot(b, cx0 + 0.3, cz + 0.5); pot(b, cx1 - 0.4, cz + 0.5); }
  // --- chairs at the café tables (seat y 0.46): left and right of each table
  for (const [tx, tz] of [P.t1, P.t2, P.t3]) for (const s of [-1, 1]) { const cx = tx + s * 0.5; cyl(b, C("#2f5fd0"), cx, 0.43, tz, 0.2, 0.2, 0.03, 20);
    for (const a of [0.6, 2.2, 3.8, 5.4]) cyl(b, ink, cx + Math.cos(a) * 0.14, 0, tz + Math.sin(a) * 0.14, 0.012, 0.012, 0.43, 6);
    box(b, C("#2f5fd0"), cx + s * 0.17, 0.46, tz - 0.18, cx + s * 0.2, 0.9, tz + 0.18); }
  // --- the houses around the square, behind the café, the corner left of the hall
  house(pz, b, "+z", -6.2, -9.5, -4.62, 8.6, "#f2c46a", "#2f8a55", "backL", true);
  house(pz, b, "+z", -4.4, 8.2, 11.5, 6.4, "#f6d9a8", "#3f78c4", "backR", false);
  box(b, lam("hb#f4e0a0", () => ({ color: "#f4e0a0" })), 4.62, 0, -6.4, 8.2, 6.8, -4.42); box(b, terra, 4.6, 6.8, -6.5, 8.3, 7.0, -4.3);
  house(pz, b, "+x", -6.2, -5.8, -0.2, 8.2, "#e8a050", "#2f8a55", "left1"); house(pz, b, "+x", -6.2, -0.2, 5.6, 7.0, "#f0d0a0", "#c0323c", "left2"); house(pz, b, "+x", -6.2, 5.6, 11.0, 8.8, "#e88a7a", "#2f8a55", "left3");
  house(pz, b, "-x", 8.6, -4.4, 1.8, 7.6, "#f2c46a", "#3f78c4", "right1"); house(pz, b, "-x", 8.6, 1.8, 8.0, 8.4, "#e8a050", "#2f8a55", "right2");
  house(pz, b, "-z", 9.0, -6.2, -1.0, 8.0, "#f0d0a0", "#2f8a55", "front1"); house(pz, b, "-z", 9.0, -1.0, 4.2, 9.2, "#f2c46a", "#c0323c", "front2"); house(pz, b, "-z", 9.0, 4.2, 8.6, 7.4, "#e88a7a", "#3f78c4", "front3");
  for (const [x, z] of [[-6.08, -3.2], [-6.08, 2.4], [8.48, -1.2], [-3.6, 8.88], [1.6, 8.88]] as [number, number][]) { const fx = Math.abs(x) > 6 && Math.abs(z) < 8.8; if (fx) flowerBox(b, x + (x < 0 ? 0.0 : -0.22), 3.2, z - 0.45, 0.9); }
  // --- the fountain
  { const [ftx, ftz] = [4.6, 5.6]; cyl(b, stone, ftx, 0, ftz, 1.25, 1.25, 0.5, 32); cyl(b, C("#58a8f0"), ftx, 0.5, ftz, 1.1, 1.1, 0.005, 32);
    cyl(b, stone, ftx, 0.5, ftz, 0.14, 0.12, 0.9, 14); cyl(b, stone, ftx, 1.4, ftz, 0.45, 0.5, 0.12, 24); cyl(b, C("#58a8f0"), ftx, 1.52, ftz, 0.4, 0.4, 0.005, 24); cyl(b, stone, ftx, 1.52, ftz, 0.06, 0.04, 0.35, 10); }
  // --- the red scooter by the left houses
  { const [sx, sz] = [-5.2, -2.6], sc = C("#d8322f"); box(b, sc, sx - 0.12, 0.25, sz - 0.6, sx + 0.12, 0.55, sz + 0.5); box(b, sc, sx - 0.16, 0.45, sz - 0.7, sx + 0.16, 0.75, sz - 0.25); box(b, C("#6e4428"), sx - 0.14, 0.75, sz - 0.65, sx + 0.14, 0.82, sz - 0.2);
    box(b, sc, sx - 0.1, 0.25, sz + 0.45, sx + 0.1, 1.05, sz + 0.58); box(b, ink, sx - 0.32, 1.02, sz + 0.5, sx + 0.32, 1.06, sz + 0.56);
    for (const z of [sz - 0.55, sz + 0.62]) cyl(b, C("#1d1b22"), sx - 0.06, 0.22, z, 0.22, 0.22, 0.12, 16, new THREE.Euler(0, 0, Math.PI / 2)); }
  // --- lamp posts
  for (const [x, z] of [[-2.9, -4.6], [6.4, 1.2], [-5.4, 6.4]] as [number, number][]) { cyl(b, C("#1d2a5a"), x, 0, z, 0.08, 0.05, 3.6, 10); box(b, C("#1d2a5a"), x - 0.16, 3.6, z - 0.16, x + 0.16, 3.65, z + 0.16); sph(b, C("#fff6d0"), x, 3.82, z, 0.16, 1.3); }
  // --- the signpost
  { const [sx, sz] = P.sign; cyl(b, oak, sx, 0, sz, 0.06, 0.05, 2.6, 10); }
  // --- the public scale: its post and foot (the beam and the pans move)
  { const [scx, scz] = P.scale; cyl(b, C("#c9a24a"), scx, 0, scz, 0.35, 0.35, 0.08, 24); cyl(b, C("#c9a24a"), scx, 0.08, scz, 0.06, 0.05, P.beam_y - 0.08, 12);
    for (const w of [P.w1_ground, P.w2_ground]) box(b, oak, scx + w[0] - 0.24, 0, scz + w[1] - 0.2, scx + w[0] + 0.24, 0.3, scz + w[1] + 0.2); } // the crates the weights wait on
  // --- distant hills with cypress trees (seen above the roofs)
  for (const [x, z, r, h] of [[-30, -70, 30, 16], [10, -80, 34, 20], [45, -66, 26, 14], [-50, 60, 30, 14], [30, 70, 30, 15]] as number[][]) { sph(b, C("#6fb85a"), x, -2, z, r, h / r);
    for (let i = 0; i < 5; i++) { const cx2 = x - r * 0.5 + i * r * 0.25, cz2 = z + (z < 0 ? r * 0.35 : -r * 0.35); const cone = new THREE.ConeGeometry(0.9, 7, 8); cone.translate(cx2, h * 0.75 + 2, cz2); b.add(cone, C("#2f7a3a")); } }
  b.build(pz);
  // planes with pictures on them (no coplanar boxes: each sits 3-5 mm proud of its backing)
  const boardFaceT = art("boardFace", 1500, 2000, (p) => { p.g.scale(2, 2); A2.boardFace(p); });
  { const [fx0, fx1, fy0, fy1] = P.board.face, bz = P.board.c[1];
    plane(fx1 - fx0, fy1 - fy0, lamC(boardFaceT), pz, (fx0 + fx1) / 2, (fy0 + fy1) / 2, bz - 0.002).castShadow = false;
    plane(fx1 - fx0 + 0.26, P.board.header[1] - P.board.header[0] - 0.02, lamC(art("boardHead", 1600, 360, (p) => A2.boardHeader(p))), pz, (fx0 + fx1) / 2, (P.board.header[0] + P.board.header[1]) / 2, bz + 0.016).castShadow = false; }
  plane(Hl.sign_size[0], Hl.sign_size[1], lamC(art("hallSign", 1800, 300, (p) => A2.hallSign(p))), pz, Hl.sign[0], Hl.sign[1], fz + 0.13).castShadow = false;
  const clockC = canvasMat2(512, 512); { const cm = mesh(new THREE.CircleGeometry(Hl.clock_r, 48), basicC(clockC.tex), pz, Hl.clock[0], Hl.clock[1], fz + 0.064); cm.castShadow = false; }
  plane(2.2, 0.44, lamC(art("cafeSign", 1200, 240, (p) => A2.cafeSign(p))), pz, 5.0, 3.32, P.cafe.z + 0.125).castShadow = false;
  { const aw = mesh(new THREE.BoxGeometry(P.cafe.x[1] - P.cafe.x[0] + 0.2, 0.03, P.cafe.awning_out), lamC(rep(stripes("#d8322f", "#fbf3dc"), 10, 1)), pz, (P.cafe.x[0] + P.cafe.x[1]) / 2, 2.82, P.cafe.z + P.cafe.awning_out / 2 + 0.02); aw.rotation.x = 0.3;
    const val = mesh(new THREE.BoxGeometry(P.cafe.x[1] - P.cafe.x[0] + 0.2, 0.22, 0.02), lamC(rep(stripes("#d8322f", "#fbf3dc"), 10, 1)), pz, (P.cafe.x[0] + P.cafe.x[1]) / 2, 2.5, P.cafe.z + P.cafe.awning_out * 0.96); void val; }
  // a cake-shop window pane behind the cakes (warm interior)
  plane(2.2, 1.7, basicC(skyPanel("cafeIn", "#f6d28a", "#fff3d0")), pz, 6.45, 1.5, P.cafe.z + 0.008).castShadow = false;
  // the inside banner of the tournament room
  plane(2.0, 0.5, lamC(art("inBanner", 1800, 300, (p) => A2.hallSign(p))), pz, 1.5, 2.55, Hl.inside_z + 0.005).castShadow = false;
  // signpost arrows (two-sided)
  { const [sx, sz] = P.sign, ar: [string, string, boolean, number][] = [["STAZIONE", "#2f5fd0", false, 2.4], ["NICE", "#d8322f", false, 2.12], ["ROMA", "#2f8a55", true, 1.84], ["MILANO", "#e2a23a", true, 1.56]];
    for (const [t, col, left, y] of ar) { const m = basicC(art("arrow" + t, 700, 140, (p) => A2.arrow(p, t, col, left)), true); m.side = THREE.DoubleSide; const a = plane(0.9, 0.18, m, pz, sx + (left ? -0.4 : 0.4), y, sz + 0.06); a.castShadow = false; } }
  // Italian-flag bunting over the square: little triangles on strings
  { const bt = new Batch(), cols = [C("#2f9a55"), C("#fbf6e8"), C("#d8322f")];
    const lines: [V3, V3][] = [[[-6.1, 6.2, -4.6], [8.5, 5.9, -3.2]], [[-6.1, 6.0, 2.5], [8.5, 6.0, 4.0]]];
    lines.forEach(([A, Bp], li) => { const n = 40; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, sag = 0.45 * Math.sin(Math.PI * u), x = A[0] + (Bp[0] - A[0]) * u, y = A[1] + (Bp[1] - A[1]) * u - sag, z = A[2] + (Bp[2] - A[2]) * u;
      const dx = (Bp[0] - A[0]) / n * 0.4, dz = (Bp[2] - A[2]) / n * 0.4; const g3 = new THREE.BufferGeometry(); g3.setAttribute("position", new THREE.Float32BufferAttribute([x - dx, y, z - dz, x + dx, y, z + dz, x, y - 0.2, z], 3)); g3.computeVertexNormals();
      bt.add(g3, (cols[(i + li) % 3] as THREE.MeshLambertMaterial)); } });
    bt.build(pz, false); pz.children.slice(-3).forEach((o) => { const m = (o as THREE.Mesh).material as THREE.MeshLambertMaterial; m.side = THREE.DoubleSide; }); }
  // --- moving pieces ---
  // the shutter: a plane scaled to its open height; the slats texture slides with it; the bottom bar with its hasp
  const shutterTexT = art("shutter", 512, 512, (p) => A2.shutterTex(p)); shutterTexT.wrapS = shutterTexT.wrapT = THREE.RepeatWrapping;
  const shutter = mesh(new THREE.PlaneGeometry(dx1 - dx0 - 0.04, 1), new THREE.MeshBasicMaterial({ map: shutterTexT }), pz, (dx0 + dx1) / 2, DH / 2, fz - 0.03); shutter.castShadow = false;
  const shutterBar = mesh(new THREE.BoxGeometry(dx1 - dx0 - 0.03, 0.07, 0.05), C("#8a1f1f"), pz, (dx0 + dx1) / 2, 0.035, fz - 0.03);
  const padlock = new THREE.Group(); pz.add(padlock);
  { mesh(new THREE.BoxGeometry(0.11, 0.09, 0.045), gold, padlock, 0, 0, 0); const sh = mesh(new THREE.TorusGeometry(0.035, 0.009, 8, 16, Math.PI), C("#b9bec6"), padlock, 0, 0.045, 0); sh.name = "shackle"; mesh(new THREE.CircleGeometry(0.012, 12), C("#1d1b22"), padlock, 0, -0.01, 0.0235); }
  const banSign = new THREE.Group(); pz.add(banSign);
  { mesh(new THREE.BoxGeometry(0.6, 0.3, 0.012), C("#fffdf6"), banSign, 0, 0, -0.007); plane(0.6, 0.3, basicC(art("banSign", 600, 320, (p) => A2.banSign(p)), true), banSign, 0, 0, 0.0005).castShadow = false; }
  // the post sheet, the torn corner, the announcement
  const sheetC = canvasMat2(900, 1200);
  const sheet = mesh(new THREE.PlaneGeometry(P.sheet_size[0], P.sheet_size[1]), basicC(sheetC.tex), pz, P.sheet[0], P.sheet[1], P.sheet[2] + 0.006); sheet.castShadow = false;
  const corner = mesh(new THREE.PlaneGeometry(0.22, 0.147), basicC(art("corner", 240, 160, (p) => A2.tornCorner(p)), true), pz, P.corner[0], P.corner[1] - 0.02, P.corner[2] + 0.004); corner.castShadow = false;
  const ann = mesh(new THREE.PlaneGeometry(P.ann_size[0], P.ann_size[1]), basicC(art("ann", 1320, 1740, (p) => { p.g.scale(2, 2); A2.annSheet(p); })), pz, P.ann[0], P.ann[1], P.ann[2] + 0.006); ann.castShadow = false;
  // the scale: the beam (turns about x at the pivot), two pans on chains (stay level), two iron weights
  const [scx, scz] = P.scale, beam = new THREE.Group(); beam.position.set(scx, P.beam_y, scz); pz.add(beam);
  mesh(new THREE.BoxGeometry(0.07, 0.07, 2 * P.arm + 0.1), C("#c9a24a"), beam, 0, 0, 0); mesh(new THREE.SphereGeometry(0.08, 16, 12), C("#c9a24a"), beam, 0, 0, 0);
  const pans = [1, -1].map((s) => { const g2 = new THREE.Group(); pz.add(g2); g2.userData.s = s;
    for (const a of [0, 2.1, 4.2]) { const ch = mesh(new THREE.CylinderGeometry(0.006, 0.006, P.pan_drop, 6), C("#8a8f98"), g2, Math.cos(a) * 0.2, -P.pan_drop / 2, Math.sin(a) * 0.2); ch.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); }
    mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.05, 28), C("#c9a24a"), g2, 0, -P.pan_drop, 0); return g2; });
  const weightTex = [art("w1", 400, 360, (p) => A2.ironWeight(p, ["CẤM", "CẢ ĐỜI"])), art("w2", 400, 360, (p) => A2.ironWeight(p, ["NÊU TÊN", "TRỌNG TÀI"]))];
  const weights = weightTex.map((t) => { const g2 = new THREE.Group(); pz.add(g2);
    mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.26, 4, 1), C("#3f4a6a"), g2, 0, 0.13, 0).rotation.y = Math.PI / 4;
    mesh(new THREE.TorusGeometry(0.06, 0.016, 8, 16, Math.PI), C("#5f6b8a"), g2, 0, 0.26, 0);
    const m = lamC(t, true); plane(0.36, 0.32, m, g2, 0, 0.14, 0.15).castShadow = false; const p2 = plane(0.36, 0.32, m, g2, 0.15, 0.14, 0, Math.PI / 2); p2.castShadow = false; return g2; });
  // the sticker suitcase (rolls on two wheels), its NICE tag
  const suitcase = new THREE.Group(); pz.add(suitcase);
  const sideT = art("suitcase", 600, 420, (p) => A2.suitcaseSide(p)), tagM = lamC(art("ltag", 300, 180, (p) => A2.luggageTag(p)), true);
  { mesh(new THREE.BoxGeometry(0.6, 0.42, 0.22), [C("#a82a32"), C("#a82a32"), C("#a82a32"), C("#a82a32"), lamC(sideT), lamC(sideT)], suitcase, 0, 0.25, 0);
    mesh(new THREE.BoxGeometry(0.03, 0.34, 0.03), C("#2a2c33"), suitcase, -0.2, 0.62, 0); mesh(new THREE.BoxGeometry(0.03, 0.34, 0.03), C("#2a2c33"), suitcase, 0.2, 0.62, 0); mesh(new THREE.BoxGeometry(0.44, 0.03, 0.04), C("#2a2c33"), suitcase, 0, 0.79, 0);
    for (const x of [-0.24, 0.24]) mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 14), C("#1d1b22"), suitcase, x, 0.04, -0.09).rotation.x = Math.PI / 2; }
  const tag = mesh(new THREE.PlaneGeometry(0.15, 0.09), tagM, suitcase, 0.27, 0.62, 0.115); tag.castShadow = false; (tag.material as THREE.Material).side = THREE.DoubleSide;
  // the water glass (S12, a rigid body), the espresso cup, the two trophies on T1
  const glass = mesh(new THREE.CylinderGeometry(0.04, 0.034, 0.13, 18), new THREE.MeshLambertMaterial({ color: "#bfe6ff" }), pz, 0, 0, 0); glass.castShadow = false;
  mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.004, 18), new THREE.MeshLambertMaterial({ color: "#58a8f0" }), glass, 0, 0.03, 0).name = "water";
  const cup = new THREE.Group(); pz.add(cup); mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.008, 18), white, cup, 0, 0.004, 0); mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.055, 16), white, cup, 0, 0.036, 0); mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.003, 16), C("#5a3420"), cup, 0, 0.062, 0);
  const trophies = [0, 1].map((i) => { const g2 = new THREE.Group(); g2.position.set(P.t1[0] + 0.05 + i * 0.2, P.table_y, P.t1[1] - 0.14 + i * 0.04); pz.add(g2);
    mesh(new THREE.BoxGeometry(0.11, 0.06, 0.11), C("#6e4428"), g2, 0, 0.03, 0); mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.07, 10), gold, g2, 0, 0.095, 0);
    mesh(new THREE.CylinderGeometry(0.07, 0.035, 0.11, 20, 1, true), new THREE.MeshLambertMaterial({ color: "#f2c84a", side: THREE.DoubleSide }), g2, 0, 0.185, 0);
    for (const s of [-1, 1]) { const hn = mesh(new THREE.TorusGeometry(0.03, 0.007, 8, 14, Math.PI), gold, g2, s * 0.075, 0.19, 0); hn.rotation.z = s * Math.PI / 2; }
    plane(0.08, 0.035, lamC(art("tplate", 300, 130, (p) => { p.g.fillStyle = "#f2c84a"; p.g.fillRect(0, 0, 300, 130); A2.lt(p.g, "VÔ ĐỊCH", 150, 42, 44, "#5a3a12", 900, "center", 280); A2.lt(p.g, "QUỐC GIA", 150, 96, 40, "#5a3a12", 900, "center", 280); })), g2, 0, 0.03, 0.0565).castShadow = false; return g2; });
  // the friend's phone (S11): seen only from his side
  const phoneC = canvasMat2(540, 1080), phone = new THREE.Group(); pz.add(phone);
  mesh(new THREE.BoxGeometry(0.075, 0.15, 0.009), C("#2f5fd0"), phone, 0, 0, -0.005); plane(0.07, 0.142, basicC(phoneC.tex), phone, 0, 0, 0.0002).castShadow = false;

  // ===== THE WORLDS HALL (San Francisco) =====
  SETL = "worlds";
  const wd = G("worlds", ORIGIN.worlds), [wx0, wx1, wz0, wz1] = Wd.room, WH = Wd.h;
  b = new Batch();
  up(b, lam("wCarpet", () => ({ map: rep(carpetT("w", "#2f9a9a"), 6, 6) })), wx0, wx1, wz0, wz1, 0, 1);
  const wWall = lam("wWall", () => ({ map: paintWall("w", "#fff1d6") }));
  box(b, wWall, wx0 - 0.1, 0, wz0, wx0, WH, wz1, 2); box(b, wWall, wx1, 0, wz0, wx1 + 0.1, WH, wz1, 2); box(b, wWall, wx0 - 0.1, 0, wz1, wx1 + 0.1, WH, wz1 + 0.1, 2);
  { const [ax0, ax1, ay0, ay1] = Wd.window; box(b, wWall, wx0, 0, wz0 - 0.1, wx1, ay0, wz0, 2); box(b, wWall, wx0, ay1, wz0 - 0.1, wx1, WH, wz0, 2); box(b, wWall, wx0, ay0, wz0 - 0.1, ax0, ay1, wz0, 2); box(b, wWall, ax1, ay0, wz0 - 0.1, wx1, ay1, wz0, 2);
    for (let x = ax0; x <= ax1 + 1e-6; x += (ax1 - ax0) / 5) box(b, white, x - 0.05, ay0, wz0, x + 0.05, ay1, wz0 + 0.08); box(b, white, ax0, ay0 + (ay1 - ay0) * 0.62, wz0, ax1, ay0 + (ay1 - ay0) * 0.62 + 0.08, wz0 + 0.08); }
  for (const x of [-3, 0, 3]) for (const z of [-3, 0, 3]) box(b, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.55, 1.4) }), x - 0.6, WH - 0.04, z - 0.6, x + 0.6, WH - 0.01, z + 0.6);
  // match table A (cloth to the floor), two chairs; the back tables with chairs
  const tbl = (tx: number, tz: number) => { box(b, C("#fbf8f0"), tx - Wd.table_len / 2, 0, tz - Wd.table_w / 2, tx + Wd.table_len / 2, Wd.table_y, tz + Wd.table_w / 2); box(b, C("#2f5fd0"), tx - Wd.table_len / 2 - 0.004, Wd.table_y - 0.12, tz + Wd.table_w / 2, tx + Wd.table_len / 2 + 0.004, Wd.table_y - 0.06, tz + Wd.table_w / 2 + 0.008);
    for (const s of [-1, 1]) { const cx = tx + s * 0.82; box(b, C("#1d2a6a"), cx - 0.2, 0.42, tz - 0.2, cx + 0.2, 0.46, tz + 0.2); box(b, C("#1d2a6a"), cx + s * 0.18, 0.46, tz - 0.2, cx + s * 0.21, 0.9, tz + 0.2); for (const dx of [-0.17, 0.15]) for (const dz of [-0.17, 0.15]) box(b, C("#8a8f98"), cx + dx, 0, tz + dz, cx + dx + 0.02, 0.42, tz + dz + 0.02); } };
  tbl(Wd.table[0], Wd.table[1]); for (const [tx, tz] of Wd.back_tables) tbl(tx, tz);
  for (const x of [-5.4, 5.4]) { cyl(b, terra, x, 0, -4.8, 0.25, 0.3, 0.55, 16); sph(b, leafG, x, 1.1, -4.8, 0.5); sph(b, C("#3d8f45"), x + 0.2, 1.45, -4.7, 0.35); }
  box(b, C("#c9a24a"), -5.6, 0.95, -4.4, 5.6, 1.0, -4.36); for (let x = -5.5; x <= 5.5; x += 1.1) box(b, C("#c9a24a"), x - 0.02, 0, -4.4, x + 0.02, 0.95, -4.36);
  b.build(wd);
  { const c2 = new THREE.Mesh(new THREE.PlaneGeometry(wx1 - wx0, wz1 - wz0), lam("wCeil", () => ({ color: "#fbf3e2" }))); c2.rotation.x = Math.PI / 2; c2.position.set(0, WH - 0.002, 0); wd.add(c2); }
  { const [ax0, ax1, ay0, ay1] = Wd.window; plane(ax1 - ax0 + 0.2, ay1 - ay0 + 0.2, basicC(art("gg", 2048, 900, (p) => A2.goldenGate(p))), wd, (ax0 + ax1) / 2, (ay0 + ay1) / 2, wz0 - 0.05).castShadow = false; }
  for (const [x, a, bb2, col] of [[-4.5, "WORLDS", "2026", "#d8322f"], [4.5, "SAN", "FRANCISCO", "#2f5fd0"]] as [number, string, string, string][]) plane(0.9, 2.46, lamC(art("wb" + a, 600, 1640, (p) => A2.banner(p, a, bb2, col)), true), wd, x, 3.7, wz0 + 0.3).castShadow = false;
  { const ty = Wd.table_y + 0.004, [tx, tz] = Wd.table;
    const m1 = plane(0.55, 0.32, lamC(art("matA", 1200, 700, (p) => A2.playmat(p, ["caterpie151", "pika151", "eevee", "sprigatito", "pawmi", "quaxly"], "#3a8a3a"))), wd, tx - 0.3, ty, tz); m1.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    const m2 = plane(0.55, 0.32, lamC(art("matB", 1200, 700, (p) => A2.playmat(p, ["zard151", "fuecoco", "charmander", "squirtle", "bulbasaur", "pikachu"], "#c0503a"))), wd, tx + 0.3, ty, tz); m2.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    const tn = plane(0.12, 0.085, lamC(art("tno", 200, 140, (p) => A2.tableNo(p))), wd, tx, ty + 0.05, tz + 0.2); tn.castShadow = false;
    for (const [bx, bz] of Wd.back_tables) { const m3 = plane(0.55, 0.32, lamC(art("matA", 1200, 700, (p) => A2.playmat(p, [], "#3a8a3a"))), wd, bx - 0.3, ty, bz); m3.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); const m4 = plane(0.55, 0.32, lamC(art("matC", 1200, 700, (p) => A2.playmat(p, [], "#3f78c4"))), wd, bx + 0.3, ty, bz); m4.rotation.set(-Math.PI / 2, 0, Math.PI / 2); } }

  // no shadows anywhere (quality bar); transparent things draw no ink
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; m.castShadow = false; m.receiveShadow = false; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) m.layers.set(NOINK); });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void M; void sign; void bush; void palm; void lamp; void car; void wheels; void grassHD; void planksHD; void beam; void brick; void water; void stoneHD; void glassMat; void steel; void brass; void windowOn; void shellXZ; void cardTexture; void banner; void red; void nightCity; void asphalt; void concrete; void glassTex; void ribbed; void truckSide; void cardboard; void tiles; void rackTex; void siding; void carpet; void letters; void trunkTex; void paving; void twoToneLam; void slab; void canvasMat;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, sheetC, sheet, corner, ann, shutter, shutterTex: shutterTexT, shutterBar, padlock, banSign, clockC, bin: binG, beam, pans, weights, suitcase, tag, glass, trophies, cup, phoneC, phone };
};
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
