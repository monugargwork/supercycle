// The sets of the Roush reel (the high street with the bus stop, cafe, cinema and plaza; her creator room; the resale shop; the dock), built once
// (static scenery batched per material) plus the moving pieces as their own objects. People and FX are flat cards placed by cast.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import * as A2 from "./art2";
import { V3, obj, ORIGIN, STP, RMP, MKP, DKP, SCREEN } from "./story";

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
  phoneC: Canvas; phone: THREE.Group; herPhoneC: Canvas; herPhone: THREE.Mesh;
  lid: THREE.Group; base: THREE.Group; tower: THREE.Group[]; drawer: THREE.Mesh; toutSign: THREE.Group; listings: THREE.Group[]; carton: THREE.Group;
};

const stucco2 = (key: string, base: string) => ctex("stuc2" + key, 512, 512, (g, r) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 20, "255,255,255", 0.08, 110); blot(g, r, 512, 512, 14, "120,80,50", 0.05, 110); });
const stripes = (a: string, b: string) => ctex("stripes" + a + b, 256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 64); } });
const paintWall = (key: string, base: string) => ctex("wall" + key, 512, 512, (g, r) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 14, "255,255,255", 0.06, 120); blot(g, r, 512, 512, 10, "80,70,60", 0.04, 120); });
const oakFloor = () => ctex("oakFloor", 512, 512, (g, r) => { for (let i = 0; i < 8; i++) { g.fillStyle = jit(r, "#e2b884", 0.05, 3, 0.1); g.fillRect(0, i * 64, 512, 64); g.fillStyle = "#b8865a"; g.fillRect(0, i * 64 + 61, 512, 3); for (let k = 0; k < 2; k++) g.fillRect(((i * 173 + k * 256) % 512), i * 64, 3, 64); } });
const marble = () => ctex("marble", 512, 512, (g, r) => { g.fillStyle = "#f6f1e8"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(200,180,150,0.35)"; g.lineWidth = 2; for (let i = 0; i < 9; i++) { g.beginPath(); let x = r() * 512, y = 0; g.moveTo(x, y); while (y < 512) { x += (r() - 0.5) * 40; y += 30; g.lineTo(x, y); } g.stroke(); } g.fillStyle = "rgba(160,140,110,0.4)"; g.fillRect(0, 0, 512, 2); g.fillRect(0, 0, 2, 512); });
const pavers = (key: string, a: string, b: string) => ctex("pavers" + key, 512, 512, (g, r) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) { g.fillStyle = jit(r, (i + j) % 3 ? a : b, 0.04, 2, 0.1); g.fillRect(i * 128 + (j % 2) * 64, j * 64, 126, 62); g.fillRect(i * 128 + (j % 2) * 64 - 512, j * 64, 126, 62); } });
const ribs = (base: string) => ctex("ribs" + base, 256, 256, (g) => { g.fillStyle = base; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(40,60,90,0.25)"; g.fillRect(x, 0, 6, 256); g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(x + 6, 0, 4, 256); } });
const canvasMat2 = (w: number, h: number): Canvas => canvasMat(w, h);

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const lamC = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 }); // decals unlit: full reference brightness
  const basicC = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.02 : 0 });
  const tex = (key: string, W: number, H: number, draw: (p: Pen) => void) => ctex(key, W, H, (g) => draw(new Pen(g)));
  const glassMat = (op = 0.18) => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
  const white = C("#f6f3ec"), cream = C("#fbf3dc"), red = C("#d8322f"), gold = C("#e2b032"), oak = C("#c98a4e"), green = C("#2f8a55"), steel = C("#9fb0c4");
  const sky = (key: string) => basicC(tex("sky" + key, 512, 512, (p) => A2.skyPanel(p, 512, 512)));
  const tree = (b: Batch, x: number, z: number, s = 1) => { box(b, C("#c9643a"), x - 0.5, 0, z - 0.5, x + 0.5, 0.45, z + 0.5); cyl(b, C("#8a5a34"), x, 0.45, z, 0.1, 0.08, 2.0 * s, 10); for (const [dx, dy, dz, r] of [[0, 2.6, 0, 1.0], [0.6, 2.3, 0.2, 0.7], [-0.6, 2.35, -0.1, 0.75], [0.1, 3.2, -0.1, 0.7]]) sph(b, C(r > 0.9 ? "#4fa548" : "#5ab54a"), x + dx * s, dy * s, z + dz * s, r * s); };
  const lampPost = (b: Batch, x: number, z: number) => { cyl(b, C("#2f6a5a"), x, 0, z, 0.08, 0.06, 4.6, 10); box(b, C("#2f6a5a"), x - 0.25, 4.6, z - 0.25, x + 0.25, 4.7, z + 0.25); sph(b, C("#fff3c4"), x, 4.45, z, 0.22); sph(b, C("#d8322f"), x, 3.2, z + 0.25, 0.28, 0.7); for (const d of [-0.2, 0.2]) sph(b, C("#f2c23a"), x + d, 3.35, z + 0.3, 0.1); };

  // ===================== THE STREET =====================
  SETL = "street";
  const S = STP, st = G("street", ORIGIN.street);
  let b = new Batch();
  up(b, lam("pave", () => ({ map: pavers("pave", "#efe0c4", "#e2cfae") })), -60, 60, 0, 5, 0, 2);
  up(b, lam("plazaP", () => ({ map: pavers("plaza", "#f2d2a8", "#e8bf8e") })), S.plaza[0], S.plaza[1], S.plaza[2], 0, 0.001, 2);
  box(b, C("#e6e0d4"), -60, 0, 5, 60, 0.12, 5.25);
  up(b, lam("road", () => ({ map: rep(asphalt("road", "#6a6874"), 1, 1) })), -60, 60, 5.25, 12, 0, 6);
  for (let x = -58; x < 60; x += 4) box(b, C("#f4f1ea"), x, 0, 8.55, x + 2, 0.006, 8.7);
  for (let i = 0; i < 7; i++) box(b, C("#f4f1ea"), -6.5 + i * 0.6, 0, 5.4, -6.2 + i * 0.6, 0.007, 11.8);
  box(b, C("#e6e0d4"), -60, 0, 12, 60, 0.12, 12.25); up(b, lam("pave2", () => ({ map: pavers("pave2", "#efe0c4", "#e2cfae") })), -60, 60, 12.25, 15, 0.12, 2);
  const pastel = ["#f6c86a", "#8fd0f2", "#f2a878", "#bfe8a8", "#f28ab0", "#fbecc8", "#a8d8e8"];
  // the far side: houses facing the road
  for (let i = 0; i < 12; i++) { const x0 = -58 + i * 10, h = 6 + (i % 3) * 1.5; box(b, lam("fh" + i, () => ({ map: stucco2("fh" + i, pastel[(i + 3) % 7]) })), x0, 0, 38, x0 + 9.6, h, 44, 2);
    slab(b, C("#d0623a"), x0 + 4.8, h + 0.6, 41, 9.9, 0.15, 6.6, 0, 0); for (let w = x0 + 1.2; w < x0 + 9; w += 2.2) for (const yy of [1.2, 3.8]) box(b, C("#5fa8dc"), w, yy, 37.97, w + 1.1, yy + 1.4, 38.0); }
  up(b, lam("park", () => ({ map: grassHD() })), -60, 60, 15, 38, 0.12, 4);
  for (let i = 0; i < 10; i++) tree(b, -50 + i * 11 + (i % 2) * 3, 20 + (i % 3) * 5, 1.2);
  // the shop row (z 0 faces +z), with a gap for the plaza (its buildings set back to z -14)
  const front = (x0: number, x1: number, h: number, col: string, z0 = 0, key = "") => {
    box(b, lam("sh" + key + col, () => ({ map: stucco2("sh" + key + col, col) })), x0, 0, z0 - 6, x1, h, z0, 2);
    box(b, cream, x0 - 0.05, h, z0 - 6.05, x1 + 0.05, h + 0.3, z0 + 0.12);
    for (let w = x0 + 0.9; w < x1 - 1.0; w += 2.0) { box(b, white, w - 0.08, 3.6, z0, w + 1.18, 5.0, z0 + 0.06); box(b, C("#6fb8e8"), w, 3.7, z0 + 0.06, w + 1.1, 4.9, z0 + 0.075); box(b, C("#ffffff"), w - 0.1, 3.55, z0, w + 1.2, 3.62, z0 + 0.22); }
  };
  const row: [number, number, number, string, string, string][] = [[-60, -44, 7, "#f6c86a", "FLOWERS", "#2f9a55"], [-44, -32, 8, "#8fd0f2", "BOOKS", "#3f78d8"], [-14, -6, 7.5, "#f2a878", "BAKERY", "#d8322f"],
    [-6, -1.8, 7, "#bfe8a8", "PHONES", "#2f9a9a"], [-1.8, 3.0, 7.2, "#fbecc8", "NEWS", "#f2a33a"], [3.0, 9.0, 8, "#f28ab0", "CAFE", "#d8322f"], [9.0, 13.0, 7, "#a8d8e8", "TOYS", "#f2785a"], [23, 34, 7.5, "#f6c86a", "MUSIC", "#8a4fc4"], [34, 60, 8, "#bfe8a8", "SHOES", "#3f78d8"]];
  const signs: [number, number, string, string][] = [];
  for (const [x0, x1, h, col, nm, sc] of row) { front(x0, x1, h, col); signs.push([(x0 + x1) / 2, Math.min(4.0, x1 - x0 - 0.6), nm, sc]);
    box(b, C("#5fa8dc"), x0 + 0.5, 0.3, -0.02, x1 - 0.5, 2.6, 0.03); box(b, white, x0 + 0.4, 2.6, 0, x1 - 0.4, 2.7, 0.08);
    box(b, lam("awn" + sc, () => ({ map: stripes(sc, "#ffffff") })), x0 + 0.3, 2.75, 0, x1 - 0.3, 2.82, 1.4); }
  for (const [x0, x1, h, col] of [[-32, -24, 9, "#f28ab0"], [-24, -20, 12, "#fbecc8"], [-20, -14, 8, "#8fd0f2"]] as [number, number, number, string][]) front(x0, x1, h, col, -14, "p");
  box(b, C("#e2b884"), -22.6, 12, -16.6, -21.4, 14.5, -15.4); sph(b, C("#d8322f"), -22, 15.0, -16, 0.9, 0.7);
  box(b, white, -32.2, 0, -14, -32, 7, 0); box(b, white, -14, 0, -14, -13.8, 7.5, 0); // plaza flank walls
  box(b, lam("plazaSideL", () => ({ map: stucco2("psl", "#f6c86a") })), -38, 0, -14, -32.2, 7, -6); box(b, lam("plazaSideR", () => ({ map: stucco2("psr", "#f2a878") })), -13.8, 0, -14, -8, 7.5, -6);
  // the fountain, planters, flags
  const [fx, fz] = S.fountain;
  cyl(b, C("#e6dccb"), fx, 0, fz, 2.2, 2.2, 0.55, 28); cyl(b, C("#5fb8ec"), fx, 0.5, fz, 2.0, 2.0, 0.06, 28); cyl(b, C("#e6dccb"), fx, 0.55, fz, 0.35, 0.3, 1.2, 14); cyl(b, C("#e6dccb"), fx, 1.7, fz, 0.9, 0.9, 0.18, 20); cyl(b, C("#bfe6f8"), fx, 1.85, fz, 0.18, 0.05, 0.9, 10);
  for (const [x, z] of [[-30, -2], [-16.2, -10], [-30, -11]]) { box(b, C("#c9643a"), x - 0.7, 0, z - 0.4, x + 0.7, 0.55, z + 0.4); for (let k = 0; k < 4; k++) sph(b, C(k % 2 ? "#d8322f" : "#f2c23a"), x - 0.5 + k * 0.33, 0.62, z, 0.18); }
  for (let i = 0; i < 14; i++) { const x = -31 + i * 1.2; box(b, C(["#d8322f", "#f2c23a", "#3f78d8", "#2f9a55"][i % 4]), x, 4.3 - 0.25 * Math.sin((i / 13) * Math.PI), -6.6, x + 0.5, 4.6 - 0.25 * Math.sin((i / 13) * Math.PI), -6.55); }
  // the listings board: two posts, a cork panel, the header
  const [bx, by, bz] = S.board, [bw, bh] = S.board_size;
  for (const s2 of [-1, 1]) box(b, C("#8a5a34"), bx + s2 * (bw / 2 + 0.06) - 0.06, 0, bz - 0.06, bx + s2 * (bw / 2 + 0.06) + 0.06, by + bh / 2 + 0.5, bz + 0.06);
  box(b, C("#8a5a34"), bx - bw / 2 - 0.1, by - bh / 2 - 0.08, bz - 0.04, bx + bw / 2 + 0.1, by + bh / 2 + 0.08, bz);
  box(b, lam("corkP", () => ({ map: ctex("corkP", 256, 256, (g, r) => { g.fillStyle = "#e3c79a"; g.fillRect(0, 0, 256, 256); blot(g, r, 256, 256, 30, "150,100,60", 0.12, 20); }) })), bx - bw / 2, by - bh / 2, bz, bx + bw / 2, by + bh / 2, bz + 0.02);
  // the bus stop
  const [sx0, sx1, sz0, sz1] = S.stop, SH = S.stop_h;
  for (const x of [sx0, sx1]) for (const z of [sz0, sz1]) cyl(b, C("#2f8a55"), x, 0, z, 0.05, 0.05, SH, 8);
  box(b, C("#4fb0e8"), sx0 - 0.1, SH, sz0 - 0.1, sx1 + 0.1, SH + 0.1, sz1 + 0.15);
  cyl(b, C("#2f8a55"), sx1 + 0.6, 0, sz1, 0.04, 0.04, 2.7, 8);
  // the cafe's two bar-height tables
  for (const x of [4.6, 7.4]) { cyl(b, steel, x, 0, 3.4, 0.03, 0.03, 1.05, 8); cyl(b, white, x, 1.05, 3.4, 0.35, 0.35, 0.04, 16); cyl(b, steel, x, 0, 3.4, 0.25, 0.25, 0.02, 12); }
  // the cinema
  const [cx0, cx1] = S.cinema, [dx0, dx1] = S.cin_door;
  box(b, lam("cin", () => ({ map: stucco2("cin", "#fbecc8") })), cx0, 0, -6, cx1, 8.5, 0, 2); box(b, red, cx0 - 0.05, 8.5, -6.05, cx1 + 0.05, 8.9, 0.15);
  box(b, red, cx0, 0, 0, cx1, 0.35, 0.08); box(b, red, cx0, 2.9, 0, cx1, 3.0, 0.1);
  box(b, C("#5fa8dc"), dx0, 0.35, 0, dx1, 2.7, 0.03); box(b, gold, dx0 - 0.08, 0.35, 0, dx0, 2.75, 0.07); box(b, gold, dx1, 0.35, 0, dx1 + 0.08, 2.75, 0.07); box(b, gold, (dx0 + dx1) / 2 - 0.03, 0.35, 0, (dx0 + dx1) / 2 + 0.03, 2.7, 0.06);
  box(b, gold, S.poster[0] - S.poster_size[0] / 2 - 0.08, S.poster[1] - S.poster_size[1] / 2 - 0.08, 0, S.poster[0] + S.poster_size[0] / 2 + 0.08, S.poster[1] + S.poster_size[1] / 2 + 0.08, 0.05);
  box(b, C("#d8322f"), 21.0, 1.0, 0, 22.4, 2.4, 0.05);
  // the tout's stand
  const [tx0, tx1, tz0, tz1] = S.stand;
  for (const x of [tx0 + 0.05, tx1 - 0.05]) for (const z of [tz0 + 0.05, tz1 - 0.05]) cyl(b, steel, x, 0, z, 0.02, 0.02, S.stand_h, 6);
  box(b, red, tx0, S.stand_h - 0.04, tz0, tx1, S.stand_h, tz1); box(b, red, tx0, S.stand_h - 0.4, tz1 - 0.005, tx1, S.stand_h - 0.04, tz1);
  // lamp posts and trees along the kerb
  for (const x of [-12, -3.6, 11.0, 25, 40]) lampPost(b, x, 4.6);
  for (const x of [-8.5, 2.2, 24.5, 30]) tree(b, x, 4.1, 0.9);
  for (const [x, z, r, col] of [[-80, 140, 50, "#8cc46e"], [-10, 160, 60, "#9acb72"], [70, 150, 52, "#7cb862"]] as [number, number, number, string][]) sph(b, C(col), x, -r * 0.55, z, r, 0.6);
  b.build(st);
  // decals: shop signs, the cinema's marquee/poster/closed sign, the stop's ad and timetable, the board header
  for (const [x, w, nm, sc] of signs) plane(w, 0.62, lamC(tex("shop" + nm, 900, 140, (p) => A2.shopSign(p, 900, 140, nm, sc))), st, x, 3.2, 0.012);
  plane(6.0, 1.3, lamC(tex("marq", 1200, 260, (p) => A2.marquee(p, 1200, 260))), st, (cx0 + cx1) / 2, 4.2, 0.016);
  plane(S.poster_size[0], S.poster_size[1], lamC(tex("film", 440, 640, (p) => A2.filmPoster(p, 440, 640))), st, S.poster[0], S.poster[1], 0.056);
  plane(1.0, 0.4, lamC(tex("tix", 500, 200, (p) => A2.shopSign(p, 500, 200, "TICKETS", "#3f78d8"))), st, 21.7, 2.0, 0.056);
  plane(0.42, 0.18, lamC(tex("closed", 420, 180, (p) => A2.closedSign(p, 420, 180))), st, (dx0 + dx1) / 2 - 0.4, 1.55, 0.04);
  plane(1.4, 1.75, basicC(tex("beachAd", 560, 700, (p) => A2.beachAd(p, 560, 700))), st, -0.4, 1.2, sz0 + 0.02);
  plane(0.5, 0.7, lamC(tex("tt", 300, 420, (p) => A2.timetable(p, 300, 420))), st, 0.95, 1.4, sz0 + 0.02);
  plane(sx1 - sx0, SH - 0.2, glassMat(0.15), st, 0, SH / 2, sz0);
  plane(0.5, 0.36, lamC(tex("busflag", 500, 360, (p) => A2.shopSign(p, 500, 360, "BUS", "#2f8a55"))), st, sx1 + 0.6, 2.5, sz1 + 0.05);
  plane(bw * 0.6, 0.26, lamC(tex("forsale", 800, 160, (p) => A2.boardHeader(p, 800, 160))), st, bx, by + bh / 2 - 0.16, bz + 0.03);
  // the listings: eight papers, each a group pivoting about its vertical centre line (front / REMOVED back)
  const listings: THREE.Group[] = [];
  for (let i = 0; i < 8; i++) { const c = i % 4, r = Math.floor(i / 4), lg = new THREE.Group(); lg.position.set(bx - bw / 2 + 0.3 + c * ((bw - 0.6) / 3), by + 0.18 - r * 0.6, bz + 0.035); st.add(lg);
    plane(0.4, 0.5, lamC(tex("lst" + i, 400, 500, (p) => A2.listing(p, 400, 500, i, false))), lg, 0, 0, 0.004);
    plane(0.4, 0.5, lamC(tex("lstB" + i, 400, 500, (p) => A2.listing(p, 400, 500, i, true))), lg, 0, 0, -0.004, Math.PI); listings.push(lg); }
  // the tout's flip sign on its pivot
  const toutSign = new THREE.Group(); toutSign.position.set(S.sign[0], S.sign[1], S.sign[2]); st.add(toutSign);
  { mesh(new THREE.BoxGeometry(0.02, 0.5, 0.02), steel, st, S.sign[0], S.stand_h + 0.05, S.sign[2] - 0.02);
    plane(S.sign_size[0], S.sign_size[1], lamC(tex("toutF", 500, 360, (p) => A2.toutSign(p, 500, 360, false))), toutSign, 0, 0, 0.006);
    plane(S.sign_size[0], S.sign_size[1], lamC(tex("toutB", 500, 360, (p) => A2.toutSign(p, 500, 360, true))), toutSign, 0, 0, -0.006, Math.PI); }
  // the viewer's phone: a coral case and the live screen (faces his eyes: normal PH.n)
  const PH = S.phone, phone = new THREE.Group(); st.add(phone); phone.position.set(...(PH.c as V3));
  { const Y = V(...(PH.up as V3)).normalize(), Z = V(...(PH.n as V3)).normalize(), X = V(0, 0, 0).crossVectors(Y, Z).normalize(); phone.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z)); } // screen +z, up +y
  const [SW, SHh] = SCREEN.canvas, phoneC = canvasMat2(SW, SHh);
  mesh(new THREE.BoxGeometry(PH.w + 0.006, PH.h + 0.006, 0.009), C("#f2785a"), phone, 0, 0, -0.005);
  plane(PH.w, PH.h, new THREE.MeshBasicMaterial({ map: phoneC.tex }), phone, 0, 0, 0.0005);

  // ===================== HER ROOM =====================
  SETL = "room";
  const R = RMP, rm = G("room", ORIGIN.room);
  b = new Batch();
  const [rx0, rx1, rz0, rz1] = R.room, RH = R.h;
  up(b, lam("oakF", () => ({ map: oakFloor() })), rx0, rx1, rz0, rz1, 0, 1.2);
  const pinkW = lam("pinkW", () => ({ map: paintWall("pink", "#f8c6d6") }));
  box(b, pinkW, rx0 - 0.15, 0, rz0 - 0.15, rx1 + 0.15, RH, rz0, 2); box(b, pinkW, rx0 - 0.15, 0, rz0, rx0, RH, rz1, 2); box(b, pinkW, rx1, 0, rz0, rx1 + 0.15, RH, rz1, 2);
  box(b, cream, rx0 + 0.01, 0, rz0, rx1 - 0.01, 0.95, rz0 + 0.03); box(b, cream, rx0, 0, rz0 + 0.02, rx0 + 0.03, 0.935, rz1); box(b, cream, rx1 - 0.03, 0, rz0 + 0.02, rx1, 0.935, rz1);
  box(b, white, rx0 + 0.02, 0.957, rz0 + 0.01, rx1 - 0.02, 1.0, rz0 + 0.045);
  cyl(b, C("#9ad8c0"), 0, 0, 0.3, 1.6, 1.6, 0.012, 32);
  // the counter (standing height): white, pink front, gold edge, a cutting mat
  const [kx0, kx1, kz0, kz1] = R.counter, TOP = R.top;
  box(b, white, kx0, 0, kz0, kx1, TOP - 0.03, kz1); box(b, gold, kx0 - 0.02, TOP - 0.03, kz0 - 0.02, kx1 + 0.02, TOP, kz1 + 0.02); box(b, C("#f28ab0"), kx0 + 0.04, 0.08, kz1, kx1 - 0.04, TOP - 0.08, kz1 + 0.012);
  box(b, C("#5ab88a"), -0.55, TOP, -0.22, 0.4, TOP + 0.004, 0.26);
  // the left wall: floor-to-ceiling shelves packed with sealed boxes; plushies on top
  for (let i = 0; i < 6; i++) box(b, oak, rx0, 0.3 + i * 0.4, -2.6, rx0 + 0.34, 0.33 + i * 0.4, 2.4);
  for (const z of [-2.6, -0.1, 2.4]) box(b, oak, rx0 + 0.006, 0, z - 0.03, rx0 + 0.328, 2.45, z + 0.03);
  const pbs: [number, number, number, number, number][] = [];
  for (let i = 0; i < 5; i++) for (let k = 0; k < 14; k++) { const z = -2.5 + k * 0.34 + (k > 6 ? 0.1 : 0), h = 0.26 + ((i * 7 + k * 3) % 3) * 0.03; if (z > 2.3) continue; box(b, C(["#d8322f", "#3f78d8", "#f2c23a", "#2f9a55", "#f2785a", "#8a4fc4", "#4fb0e8"][(i * 3 + k) % 7]), rx0 + 0.04, 0.33 + i * 0.4, z, rx0 + 0.3, 0.33 + i * 0.4 + h, z + 0.28); pbs.push([z + 0.14, 0.33 + i * 0.4 + h / 2, h, (i * 3 + k) % 7, i]); }
  for (let k = 0; k < 6; k++) { const z = -2.2 + k * 0.8; sph(b, C(["#f2c23a", "#f28ab0", "#4fb0e8", "#2f9a55", "#f2785a", "#f6f1e8"][k]), rx0 + 0.18, 2.47 + 0.15, z, 0.16); sph(b, C(["#f2c23a", "#f28ab0", "#4fb0e8", "#2f9a55", "#f2785a", "#f6f1e8"][k]), rx0 + 0.18, 2.47 + 0.36, z, 0.11); }
  // the right wall: the window (frame), a plant
  const [, wz0, wz1, wy0, wy1] = R.window;
  box(b, white, rx1 - 0.06, wy0 - 0.06, wz0 - 0.06, rx1, wy0, wz1 + 0.06); box(b, white, rx1 - 0.06, wy1, wz0 - 0.06, rx1, wy1 + 0.06, wz1 + 0.06); box(b, white, rx1 - 0.06, wy0, wz0 - 0.06, rx1, wy1, wz0); box(b, white, rx1 - 0.06, wy0, wz1, rx1, wy1, wz1 + 0.06); box(b, white, rx1 - 0.05, wy0, -0.02, rx1, wy1, 0.02);
  box(b, white, rx1 - 0.25, wy0 - 0.1, wz0 - 0.1, rx1 - 0.06, wy0 - 0.06, wz1 + 0.1);
  box(b, C("#e2b884"), 2.3, 0, 1.6, 2.7, 0.45, 2.0); for (const [dx, dy, dz, r] of [[0, 0.75, 0, 0.32], [0.18, 0.95, 0.1, 0.24], [-0.15, 1.0, -0.1, 0.22]]) sph(b, C("#4fa548"), 2.5 + dx, dy, 1.8 + dz, r);
  // the rig: tripod + camera, ring light on its stand
  const [tpx, tpz] = R.tripod, TH = R.tri_h;
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.3, lx = tpx + Math.cos(a) * 0.32, lz = tpz + Math.sin(a) * 0.32, L = Math.hypot(0.32, TH - 0.1);
    const g = new THREE.CylinderGeometry(0.012, 0.012, L, 6); g.translate(0, L / 2, 0); b.add(g, C("#2a2c33"), new THREE.Matrix4().compose(V(lx, 0, lz), new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), V(tpx - lx, TH - 0.1, tpz - lz).normalize()), V(1, 1, 1))); }
  box(b, C("#f4f1ea"), tpx - 0.07, TH - 0.06, tpz - 0.05, tpx + 0.07, TH + 0.04, tpz + 0.05); cyl(b, C("#2a2c33"), tpx, TH - 0.01, tpz - 0.05, 0.03, 0.03, 0.05, 12, new THREE.Euler(Math.PI / 2, 0, 0));
  const [rgx, rgz] = R.ring; cyl(b, C("#2a2c33"), rgx, 0, rgz, 0.15, 0.02, 0.03, 10); cyl(b, C("#2a2c33"), rgx, 0, rgz, 0.012, 0.012, 1.45, 6);
  // the lid stand: a small clear block on the counter
  box(b, C("#d8eef8"), R.stand[0] - 0.08, TOP + 0.004, R.stand[1] - 0.04, R.stand[0] + 0.08, TOP + 0.016, R.stand[1] + 0.04);
  b.build(rm);
  { const c = new THREE.Mesh(new THREE.PlaneGeometry(rx1 - rx0, rz1 - rz0), lam("ceilR", () => ({ color: "#fbf7ec" }))); c.rotation.x = Math.PI / 2; c.position.set(0, RH - 0.002, (rz0 + rz1) / 2); rm.add(c);
    for (const z of [-1.4, 1.2]) { const lp = mesh(new THREE.CircleGeometry(0.3, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, 1.15, 1.0) }), rm, 0, RH - 0.006, z); lp.rotation.x = Math.PI / 2; } }
  // decals: shelf box faces, posters, the calendar, the cork board, the window's sky, the ring light
  for (const [z, y, h, k] of pbs) plane(0.26, h * 0.9, lamC(tex("pb" + k, 260, 300, (p) => A2.productBox(p, 260, 300, k))), rm, rx0 + 0.305, y, z, Math.PI / 2);
  for (const [i, x] of [[0, -0.55], [1, 0.25], [2, 1.0]] as [number, number][]) { mesh(new THREE.BoxGeometry(0.56, 0.74, 0.02), oak, rm, x - 0.1, 1.95, rz0 + 0.012); plane(0.5, 0.68, lamC(tex("post" + i, 400, 540, (p) => A2.poster(p, 400, 540, i))), rm, x - 0.1, 1.95, rz0 + 0.024); }
  plane(R.cal_size[0], R.cal_size[1], lamC(tex("cal", 560, 760, (p) => A2.calendar(p, 560, 760))), rm, R.calendar[0], R.calendar[1], rz0 + 0.012);
  plane(R.cork_size[0], R.cork_size[1], lamC(tex("cork", 900, 660, (p) => A2.corkEmpty(p, 900, 660))), rm, R.cork[0], R.cork[1], rz0 + 0.012);
  plane(wz1 - wz0, wy1 - wy0, sky("room"), rm, rx1 - 0.008, (wy0 + wy1) / 2, (wz0 + wz1) / 2, -Math.PI / 2);
  { const rl = plane(0.5, 0.5, new THREE.MeshBasicMaterial({ map: tex("ring", 256, 256, (p) => A2.ringGlow(p, 256)), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }), rm, rgx, 1.6, rgz); rl.rotation.y = -0.4; }
  // the box: the base (turns about y in S12) and the lid (moves in S01, then stands)
  const [BW, BH, BD] = R.box_size;
  const inside = tex("inside", 760, 560, (p) => { const g = p.g; g.fillStyle = "#24359a"; g.fillRect(0, 0, 760, 560); g.fillStyle = "#2f4fc4"; g.fillRect(24, 24, 712, 512);
    A2.scan(g, "magikarp_ar", 60, 70, 300, 418); A2.scan(g, "umbreon_pe", 400, 70, 300, 418); g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(0, 0, 760, 12); });
  const sideM = lamC(tex("bside", 760, 180, (p) => A2.boxSide(p, 760, 180))), backM = lamC(tex("bback", 760, 180, (p) => A2.boxBack(p, 760, 180))), endM = lamC(tex("bend", 560, 180, (p) => A2.boxSide(p, 560, 180)));
  const base = new THREE.Group(); base.position.set(R.box[0], TOP + 0.006, R.box[1]); rm.add(base);
  mesh(new THREE.BoxGeometry(BW, BH, BD), [endM, endM, lamC(inside), C("#24359a"), sideM, backM], base, 0, BH / 2, 0);
  const lidFaceT = tex("lidFace", 1140, 840, (p) => A2.lidFace(p, 1140, 840));
  const lidM = [C("#f2c23a"), C("#f2c23a"), lamC(lidFaceT), C("#24359a"), C("#f2c23a"), C("#f2c23a")];
  const lid = new THREE.Group(); rm.add(lid); mesh(new THREE.BoxGeometry(BW + 0.006, R.lid_h, BD + 0.006), lidM, lid, 0, 0, 0);
  // her phone (S14-S15): a live screen, held by the cast at her chest (posed in world.placeProps)
  const herPhoneC = canvasMat2(720, 1476);
  const herPhone = new THREE.Mesh(new THREE.PlaneGeometry(0.078, 0.16), new THREE.MeshBasicMaterial({ map: herPhoneC.tex, side: THREE.DoubleSide })); rm.add(herPhone); herPhone.visible = false;
  mesh(new THREE.BoxGeometry(0.084, 0.166, 0.008), C("#f28ab0"), herPhone, 0, 0, -0.005);

  // ===================== THE RESALE SHOP =====================
  SETL = "market";
  const K = MKP, mk = G("market", ORIGIN.market);
  b = new Batch();
  const [mx0, mx1, mz0, mz1] = K.room, MH = K.h;
  up(b, lam("marble", () => ({ map: marble() })), mx0, mx1, mz0, mz1, 0, 1.2);
  const wallW = lam("mkW", () => ({ map: paintWall("mk", "#fbf7ec") }));
  box(b, wallW, mx0 - 0.15, 0, mz0 - 0.15, mx1 + 0.15, MH, mz0, 2); box(b, wallW, mx0 - 0.15, 0, mz0, mx0, MH, mz1, 2); box(b, wallW, mx1, 0, mz0, mx1 + 0.15, MH, mz1, 2);
  box(b, gold, mx0 + 0.01, 0, mz0, mx1 - 0.01, 0.12, mz0 + 0.03); box(b, gold, mx0 + 0.01, 2.9, mz0, mx1 - 0.01, 2.96, mz0 + 0.03);
  // back wall: glass shelves of sneakers and sealed boxes
  for (let i = 0; i < 4; i++) box(b, C("#d8eef8"), -3.6, 0.45 + i * 0.55, mz0, 3.6, 0.47 + i * 0.55, mz0 + 0.4);
  const shelfItems: [number, number, number][] = [];
  for (let i = 0; i < 4; i++) for (let k = 0; k < 12; k++) { const x = -3.4 + k * 0.6, y = 0.47 + i * 0.55; box(b, C(["#f2785a", "#4fb0e8", "#f4f1ea", "#2f9a55", "#f2c23a", "#2f4fc4"][(i + k) % 6]), x, y, mz0 + 0.06, x + 0.42, y + 0.24, mz0 + 0.34); shelfItems.push([x + 0.21, y + 0.12, (i + k) % 6]); }
  // left wall window
  box(b, gold, mx0, 1.0, -1.6, mx0 + 0.06, 1.06, 1.6); box(b, gold, mx0, 2.6, -1.6, mx0 + 0.06, 2.66, 1.6);
  // the counter, the till, the jar
  const [ux0, ux1, uz0, uz1] = K.counter, UT = K.top;
  box(b, white, ux0, 0, uz0, ux1, UT - 0.03, uz1); box(b, gold, ux0 - 0.02, UT - 0.03, uz0 - 0.02, ux1 + 0.02, UT, uz1 + 0.02); box(b, gold, ux0 + 0.02, 0.4, uz1, ux1 - 0.02, 0.5, uz1 + 0.012);
  box(b, C("#2a2c33"), K.till[0] - 0.18, UT, K.till[1] - 0.15, K.till[0] + 0.18, UT + 0.12, K.till[1] + 0.12); box(b, C("#4fb0e8"), K.till[0] - 0.12, UT + 0.12, K.till[1] - 0.1, K.till[0] + 0.12, UT + 0.3, K.till[1] - 0.06);
  // the plinths
  const [pw, ph, pd] = K.plinth;
  for (const [x, z] of [K.plinthL, K.plinthR]) { box(b, white, x - pw / 2, 0, z - pd / 2, x + pw / 2, ph, z + pd / 2); box(b, gold, x - pw / 2 - 0.02, ph - 0.03, z - pd / 2 - 0.02, x + pw / 2 + 0.02, ph, z + pd / 2 + 0.02); }
  b.build(mk);
  { const c = new THREE.Mesh(new THREE.PlaneGeometry(mx1 - mx0, mz1 - mz0), lam("ceilM", () => ({ color: "#ffffff" }))); c.rotation.x = Math.PI / 2; c.position.set(0, MH - 0.002, 0); mk.add(c);
    for (const x of [-2.5, 0, 2.5]) for (const z of [-2.5, 0, 2.5]) { const lp = mesh(new THREE.CircleGeometry(0.14, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.3, 1.1) }), mk, x, MH - 0.006, z); lp.rotation.x = Math.PI / 2; } }
  for (const [x, y, k] of shelfItems) plane(0.42, 0.24, lamC(tex("snk" + k, 420, 240, (p) => A2.sneakerBox(p, 420, 240, k))), mk, x, y, mz0 + 0.346);
  plane(2.4, 0.5, new THREE.MeshBasicMaterial({ map: tex("resale", 1200, 250, (p) => A2.goldSign(p, 1200, 250, "RESALE")), transparent: true, alphaTest: 0.3 }), mk, 0, 3.2, mz0 + 0.012);
  plane(3.2, 1.6, sky("mk"), mk, mx0 + 0.008, 1.83, 0, Math.PI / 2);
  { const jar = new THREE.Group(); jar.position.set(K.jar[0], UT, K.jar[1]); mk.add(jar);
    mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 20, 1, true), new THREE.MeshBasicMaterial({ color: "#bfe6f8", transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide }), jar, 0, 0.1, 0);
    mesh(new THREE.TorusGeometry(0.08, 0.005, 6, 24), C("#ffffff"), jar, 0, 0.2, 0).rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.005, 20), C("#d9eef8"), jar, 0, 0.004, 0);
    plane(0.2, 0.07, lamC(tex("jarTag", 400, 140, (p) => A2.jarTag(p, 400, 140))), jar, 0, 0.1, 0.083); }
  plane(0.26, 0.1, lamC(tex("tagRetail", 400, 150, (p) => A2.priceTag(p, 400, 150, "$179.99", "#ffffff", "#1d1b22"))), mk, K.plinthL[0], ph - 0.12, K.plinthL[1] + pd / 2 + 0.006);
  plane(0.3, 0.11, lamC(tex("tagResale", 400, 150, (p) => A2.priceTag(p, 400, 150, "$2,262", "#d8322f", "#ffffff"))), mk, K.plinthR[0], ph - 0.12, K.plinthR[1] + pd / 2 + 0.006);
  const drawer = mesh(new THREE.BoxGeometry(0.3, 0.06, 0.2), C("#3a3d46"), mk, K.till[0], UT + 0.03, K.till[1] + 0.04);
  // the boxes: one at retail on the left plinth, twelve for the tower (posed per frame)
  const boxMats = [endM, endM, lamC(lidFaceT), C("#24359a"), sideM, sideM];
  { const one = mesh(new THREE.BoxGeometry(BW, K.bx, BD), boxMats, mk, K.plinthL[0], ph + K.bx / 2 + 0.002, K.plinthL[1]); void one; }
  const tower: THREE.Group[] = Array.from({ length: K.n }, (_, i) => { const g = new THREE.Group(); g.position.set(K.plinthR[0], ph + 0.002 + i * K.bx, K.plinthR[1]); g.rotation.y = 0.06 * Math.sin(i * 2.7); mk.add(g);
    mesh(new THREE.BoxGeometry(BW, K.bx - 0.002, BD), boxMats, g, 0, K.bx / 2, 0); g.visible = false; return g; });

  // ===================== THE DOCK =====================
  SETL = "dock";
  const D = DKP, dk = G("dock", ORIGIN.dock);
  b = new Batch();
  up(b, lam("dockF", () => ({ map: concrete("dockF", "#e8dcc6") })), -30, 30, -4.98, 30, 0, 2);
  up(b, lam("hallF", () => ({ map: concrete("hallF", "#d9c9a8") })), -2, 2, -14, -5.2, 0.001, 2);
  const clad = lam("clad", () => ({ map: rep(ribs("#8fd0f2"), 1, 1) }));
  const WZ = D.wall_z, [ddx0, ddx1, ddh] = D.door;
  box(b, clad, -14, 0, WZ - 0.3, ddx0, 7, WZ, 2); box(b, clad, ddx1, 0, WZ - 0.3, 14, 7, WZ, 2); box(b, clad, ddx0, ddh, WZ - 0.3, ddx1, 7, WZ, 2);
  box(b, cream, -14.05, 7, WZ - 0.35, 14.05, 7.3, WZ + 0.1); box(b, C("#d8322f"), ddx0 - 0.15, 0, WZ, ddx0, ddh + 0.15, WZ + 0.08); box(b, C("#d8322f"), ddx1, 0, WZ, ddx1 + 0.15, ddh + 0.15, WZ + 0.08); box(b, C("#d8322f"), ddx0, ddh, WZ, ddx1, ddh + 0.15, WZ + 0.08);
  box(b, C("#c7cbd2"), ddx0, ddh + 0.15, WZ + 0.08, ddx1, ddh + 0.6, WZ + 0.5);
  // the hall inside: walls, racks, cartons
  box(b, cream, -2.3, 0, -14.3, 2.3, 4, -14); box(b, cream, -2.3, 0, -14, -2, 4, WZ - 0.3); box(b, cream, 2, 0, -14, 2.3, 4, WZ - 0.3); box(b, cream, -2.3, 3.2, -14, 2.3, 3.5, WZ - 0.3);
  for (const x of [-1.8, 1.5]) for (let i = 0; i < 4; i++) { box(b, C("#f2783a"), x, 0.6 + i * 0.7, -13, x + 0.3, 0.64 + i * 0.7, -6); for (let z = -12.8; z < -6.3; z += 0.6) box(b, C("#c99a62"), x + 0.02, 0.64 + i * 0.7, z, x + 0.28, 0.64 + i * 0.7 + 0.4, z + 0.5); }
  // pallets of cartons either side, the forklift, the van
  for (const [x, z] of [[-4.5, -3.6], [-6.2, -3.6], [4.2, -3.6], [5.9, -3.2]]) { box(b, oak, x - 0.6, 0, z - 0.5, x + 0.6, 0.14, z + 0.5); for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) box(b, C("#c99a62"), x - 0.58 + i * 0.6, 0.14, z - 0.48 + j * 0.5, x + 0.0 + i * 0.6 - 0.02, 0.14 + 0.45, z + 0.0 + j * 0.5 - 0.02); }
  box(b, C("#f2c23a"), -8.4, 0.25, -1.4, -6.8, 1.4, -0.2); box(b, C("#2a2c33"), -8.3, 1.4, -1.3, -7.4, 2.4, -0.3); box(b, C("#5b6170"), -6.85, 0, -1.2, -6.75, 2.4, -0.4);
  for (const [x, z] of [[-8.1, -1.4], [-7.0, -1.4], [-8.1, -0.2], [-7.0, -0.2]]) cyl(b, C("#26242b"), x, 0.25, z, 0.25, 0.25, 0.14, 12, new THREE.Euler(Math.PI / 2, 0, 0));
  box(b, C("#f4f1ea"), 5.6, 0.35, -1.0, 7.6, 2.6, 4.0); box(b, C("#f4f1ea"), 5.7, 0.35, 4.0, 7.5, 1.9, 5.4); box(b, C("#5fa8dc"), 5.75, 1.3, 4.6, 7.45, 1.85, 5.42); box(b, C("#3f78d8"), 5.58, 1.2, -1.0, 5.6, 1.5, 4.0);
  for (const z of [0.0, 4.6]) for (const x of [5.6, 7.6]) cyl(b, C("#26242b"), x, 0.38, z, 0.38, 0.38, 0.22, 14, new THREE.Euler(0, 0, Math.PI / 2));
  // the shipping table
  const [ax0, ax1, az0, az1] = D.table, AT = D.top;
  box(b, steel, ax0, AT - 0.04, az0, ax1, AT, az1); for (const x of [ax0 + 0.04, ax1 - 0.08]) for (const z of [az0 + 0.04, az1 - 0.08]) box(b, steel, x, 0, z, x + 0.04, AT - 0.04, z + 0.04);
  box(b, C("#d8322f"), 0.35, AT, 0.9, 0.55, AT + 0.12, 1.0); box(b, C("#f4f1ea"), -0.6, AT, 0.88, -0.36, AT + 0.14, 1.08);
  // the town behind, trees
  for (let i = 0; i < 6; i++) { const x0 = -40 + i * 13; box(b, lam("dkb" + i, () => ({ map: stucco2("dkb" + i, pastel[i % 7]) })), x0, 0, -30, x0 + 11, 9 + (i % 3) * 3, -22, 2); }
  for (const x of [-11, 10, 13]) tree(b, x, 3.5, 1.1);
  b.build(dk);
  plane(4.2, 0.7, lamC(tex("odist", 1500, 250, (p) => A2.shopSign(p, 1500, 250, "OFFICIAL DISTRIBUTION", "#2f8a55"))), dk, 0, ddh + 1.1, WZ + 0.012);
  // the carton (a prop the courier carries: posed by world.placeProps)
  const carton = new THREE.Group(); dk.add(carton);
  { const [cw2, ch2, cd2] = D.carton_size, cf = lamC(tex("cartonF", 500, 360, (p) => A2.cartonFace(p, 500, 360)));
    mesh(new THREE.BoxGeometry(cw2, ch2, cd2), [cf, cf, cf, cf, cf, cf], carton, 0, 0, 0);
    plane(0.34, 0.24, lamC(tex("label", 680, 480, (p) => A2.label(p, 680, 480))), carton, 0, 0.0, cd2 / 2 + 0.004); }

  // transparent things draw no ink
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void sign; void lamp; void car; void wheels; void grassHD; void roofHD; void beam; void brick; void stoneHD; void rep; void palm; void bush; void water;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, phoneC, phone, herPhoneC, herPhone, lid, base, tower, drawer, toutSign, listings, carton };
};

/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
