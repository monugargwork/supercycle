// The sets of the Lucas reel (the living room, the card-show hall, the LA boulevard + lot, the card shop), built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import * as A2 from "./art2";
import { clockFace } from "./art";
import { V3, obj, ORIGIN, HOME, HALL, STREET, SHOP } from "./story";

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

const woodTex = (key: string, base: string, dark: string) => ctex("wood" + key, 512, 512, (g, r) => {
  for (let i = 0; i < 8; i++) { g.fillStyle = jit(r, base, 0.05, 3, 0.1); g.fillRect(0, i * 64, 512, 64); g.fillStyle = dark; g.fillRect(0, i * 64 + 61, 512, 3); }
  for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(60,35,20,0.07)"; g.fillRect(r() * 512, r() * 512, 40 + r() * 80, 2); }
});
const vinyl = () => ctex("vinyl", 512, 512, (g, r) => {
  g.fillStyle = "#d9ddd8"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { g.fillStyle = r() > 0.5 ? "rgba(90,100,95,0.25)" : "rgba(255,255,255,0.4)"; g.fillRect(r() * 512, r() * 512, 3, 3); }
  g.fillStyle = "rgba(90,100,95,0.35)"; g.fillRect(0, 0, 512, 2); g.fillRect(0, 0, 2, 512);
});
const paintWall = (key: string, base: string) => ctex("wall" + key, 512, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 14, "255,255,255", 0.06, 120); blot(g, r, 512, 512, 10, "80,70,60", 0.04, 120);
});
const skyPanel = (key: string, top: string, bot: string, blinds = false) => ctex("sky" + key, 256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  if (blinds) for (let y = 0; y < 256; y += 18) { g.fillStyle = "rgba(240,236,226,0.85)"; g.fillRect(0, y, 256, 11); g.fillStyle = "rgba(90,80,70,0.3)"; g.fillRect(0, y + 11, 256, 2); }
});
type Canvas = { tex: THREE.CanvasTexture; g: CanvasRenderingContext2D; key: string };
export type Sets = {
  groups: Record<string, THREE.Group>; lampG: THREE.Group; scaleG: THREE.Group;
  door: THREE.Group; clock: Canvas; cal: Canvas; lcd: Canvas; panPack: THREE.Mesh; packs: THREE.Mesh[]; heroPacks: THREE.Mesh[]; tubPacks: THREE.Group; lids: THREE.Mesh[];
  chairDealer: THREE.Group; chairsPair: THREE.Group; phone: THREE.Group; phoneCv: Canvas; laptop: THREE.Group; laptopCv: Canvas; pizza: THREE.Group; candies: THREE.Group[];
  lampBulb: THREE.Mesh; hallClock: Canvas; hallPhone: THREE.Group; hallPhoneCv: Canvas; truck: THREE.Group;
  carL: THREE.Group; carD: THREE.Group; lotBox: THREE.Group; shopBox: THREE.Group; scanWin: THREE.Mesh; checkCv: Canvas; checkMesh: THREE.Mesh;
};
const PACK_N = 24;
export { PACK_N };

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  /** room shell: floor, four walls (outside the room, inner faces at +-hx / +-hz), ceiling (casts no shadow) */
  const shell = (g: THREE.Group, hx: number, hz: number, h: number, floorM: THREE.Material, wallM: THREE.Material, ceil: string) => {
    const sb = new Batch();
    up(sb, floorM, -hx, hx, -hz, hz, 0, 1);
    box(sb, wallM, -hx - 0.1, 0, -hz - 0.1, hx + 0.1, h, -hz, 2); box(sb, wallM, -hx - 0.1, 0, hz, hx + 0.1, h, hz + 0.1, 2);
    box(sb, wallM, -hx - 0.1, 0, -hz, -hx, h, hz, 2); box(sb, wallM, hx, 0, -hz, hx + 0.1, h, hz, 2);
    sb.build(g, false);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(2 * hx, 2 * hz), lam("ceil" + ceil, () => ({ color: ceil }))); c.rotation.x = Math.PI / 2; c.position.set(0, h - 0.002, 0); c.castShadow = false; c.receiveShadow = false; g.add(c);
  };
  /** a window: a lit sky panel 6 mm proud of the wall with a white frame and a cross bar; n = the wall's inward normal */
  const windowOn = (b: Batch, g: THREE.Group, axis: "x" | "z", at: number, n: number, c: number, y0: number, y1: number, w: number, tex: THREE.Texture, frame: THREE.Material) => {
    const pm = new THREE.MeshBasicMaterial({ map: tex }), d = 0.006 * n;
    const pane = plane(w, y1 - y0, pm, g, axis === "x" ? at + d : c, (y0 + y1) / 2, axis === "x" ? c : at + d, axis === "x" ? (n > 0 ? Math.PI / 2 : -Math.PI / 2) : (n > 0 ? 0 : Math.PI));
    pane.castShadow = false; pane.receiveShadow = false;
    const t = 0.05, dep = 0.06 * n;
    const bx = (a0: number, a1: number, yy0: number, yy1: number) => axis === "x" ? box(b, frame, Math.min(at, at + dep), yy0, a0, Math.max(at, at + dep), yy1, a1) : box(b, frame, a0, yy0, Math.min(at, at + dep), a1, yy1, Math.max(at, at + dep));
    bx(c - w / 2 - t, c + w / 2 + t, y0 - t, y0); bx(c - w / 2 - t, c + w / 2 + t, y1, y1 + t);
    bx(c - w / 2 - t, c - w / 2, y0, y1); bx(c + w / 2, c + w / 2 + t, y0, y1); bx(c - 0.012, c + 0.012, y0, y1);
  };
  const canvasPlane = (cv: Canvas, w: number, h: number, parent: THREE.Object3D, x: number, y: number, z: number, lit = true) =>
    mesh(new THREE.PlaneGeometry(w, h), lit ? new THREE.MeshBasicMaterial({ map: cv.tex }) : new THREE.MeshLambertMaterial({ map: cv.tex }), parent, x, y, z);
  const white = C("#f3f1ec"), steel = C("#c9ccd2"), ink = C("#2a2c33"), oak = C("#9a6a40");
  const packFrontTex = [0, 1, 2, 3].map((k) => ctex("packFront" + k, 220, 360, (g) => A2.packFront(new Pen(g), k)));
  const packSide = (k: number) => C(A2.PACK_SETS[k % 4].col);
  /** a pack lying flat (front up) */
  const flatPack = (k: number) => new THREE.Mesh(new THREE.BoxGeometry(0.098, 0.011, 0.168), [packSide(k), packSide(k), new THREE.MeshLambertMaterial({ map: packFrontTex[k % 4] }), packSide(k), packSide(k), packSide(k)]);
  /** a pack standing (front +z) */
  const standPack = (k: number, s = 1) => new THREE.Mesh(new THREE.BoxGeometry(0.07 * s, 0.12 * s, 0.008), [packSide(k), packSide(k), packSide(k), packSide(k), new THREE.MeshLambertMaterial({ map: packFrontTex[k % 4] }), packSide(k)]);

  // ===== HOME =====
  SETL = "home";
  const home = G("home", ORIGIN.home), Hh = HOME.half;
  shell(home, Hh, Hh, HOME.h, lam("homeFloor", () => ({ map: rep(woodTex("home", "#b07c50", "rgba(70,40,20,0.45)"), 3, 3) })), lam("homeWall", () => ({ map: paintWall("home", "#b9c6a6") })), "#f1ead8");
  let b = new Batch();
  const [tx, tz] = HOME.table, [tw, td] = HOME.table_size, TY = HOME.table_y;
  box(b, oak, tx - tw / 2, TY - 0.04, tz - td / 2, tx + tw / 2, TY, tz + td / 2);
  for (const x of [tx - tw / 2 + 0.06, tx + tw / 2 - 0.06]) for (const z of [tz - td / 2 + 0.06, tz + td / 2 - 0.06]) box(b, oak, x - 0.03, 0, z - 0.03, x + 0.03, TY - 0.04, z + 0.03);
  // door frame + the dark hallway behind the door
  const [dx0, dx1] = HOME.door, DH = HOME.door_h;
  box(b, white, dx0 - 0.06, 0, -Hh, dx0, DH + 0.06, -Hh + 0.05); box(b, white, dx1, 0, -Hh, dx1 + 0.06, DH + 0.06, -Hh + 0.05); box(b, white, dx0, DH, -Hh, dx1, DH + 0.06, -Hh + 0.05);
  plane(dx1 - dx0, DH, new THREE.MeshBasicMaterial({ map: ctex("hallway", 128, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#3a3530"); gr.addColorStop(1, "#1e1a18"); g.fillStyle = gr; g.fillRect(0, 0, 128, 256); g.fillStyle = "#5a4a3a"; g.fillRect(0, 200, 128, 56); }) }), home, (dx0 + dx1) / 2, DH / 2, -Hh + 0.006);
  // sofa + coffee table
  const [sx0, sx1, sz0, sz1] = HOME.sofa, SY = HOME.seat_y, sofaM = C("#5a7fa8"), sofaD = C("#4a6a90");
  box(b, sofaD, sx0, 0, sz0, sx1, SY - 0.1, sz1); box(b, sofaM, sx0 + 0.18, SY - 0.1, sz0 + 0.14, sx1, SY, sz1 - 0.14);
  box(b, sofaM, sx0, SY - 0.1, sz0 + 0.14, sx0 + 0.18, 0.9, sz1 - 0.14); box(b, sofaD, sx0, 0, sz0, sx1 + 0.02, 0.62, sz0 + 0.14); box(b, sofaD, sx0, 0, sz1 - 0.14, sx1 + 0.02, 0.62, sz1);
  const [cx, cz] = HOME.coffee, [cw2, cd2] = HOME.coffee_size, CY = HOME.coffee_y;
  box(b, oak, cx - cw2 / 2, CY - 0.035, cz - cd2 / 2, cx + cw2 / 2, CY, cz + cd2 / 2);
  for (const x of [cx - cw2 / 2 + 0.04, cx + cw2 / 2 - 0.04]) for (const z of [cz - cd2 / 2 + 0.04, cz + cd2 / 2 - 0.04]) box(b, oak, x - 0.02, 0, z - 0.02, x + 0.02, CY - 0.035, z + 0.02);
  // window above the sofa (dusk), a rug, a framed photo by the door, a plant
  windowOn(b, home, "x", -Hh, 1, 0.6, 1.15, 2.05, 1.2, skyPanel("homeDusk", "#4a5a8a", "#f0a870"), white);
  box(b, C("#c98a4a"), 2.3, 0, 1.9, 2.5, 0.32, 2.1); sph(b, C("#4fa548"), 2.4, 0.62, 2.0, 0.28);
  b.build(home);
  const rug = mesh(new THREE.PlaneGeometry(1.6, 1.2), C("#a0423a"), home, -1.25, 0.003, 0.6); rug.rotation.x = -Math.PI / 2;
  const frame = plane(0.32, 0.26, new THREE.MeshLambertMaterial({ map: ctex("photo", 200, 160, (g) => A2.photoTex(new Pen(g))) }), home, 2.38, 1.5, -Hh + 0.008); void frame;
  // the door (hinged at x dx1, swings into the room)
  const door = new THREE.Group(); door.position.set(dx1, 0, -Hh + 0.03); home.add(door);
  mesh(new THREE.BoxGeometry(dx1 - dx0 - 0.01, DH - 0.01, 0.04), C("#8a5a34"), door, -(dx1 - dx0) / 2, DH / 2, 0.02);
  for (const [y, h2] of [[0.55, 0.6], [1.45, 0.6]]) mesh(new THREE.BoxGeometry(dx1 - dx0 - 0.2, h2, 0.012), C("#7a4a2a"), door, -(dx1 - dx0) / 2, y, 0.046);
  mesh(new THREE.SphereGeometry(0.03, 10, 8), C("#e8c45a"), door, -(dx1 - dx0) + 0.1, 1.0, 0.065);
  // wall clock
  const clock = canvasMat(256, 256), [ckx, cky, ckz] = HOME.clock as V3, CR = HOME.clock_r;
  mesh(new THREE.CylinderGeometry(CR + 0.015, CR + 0.015, 0.035, 32), ink, home, ckx, cky, ckz + 0.0175).rotation.x = Math.PI / 2;
  const clockFaceM = mesh(new THREE.CircleGeometry(CR, 32), new THREE.MeshLambertMaterial({ map: clock.tex }), home, ckx, cky, ckz + 0.0395); void clockFaceM;
  // calendar
  const cal = canvasMat(300, 420), [kx, ky, kz] = HOME.calendar as V3;
  { const cm = canvasPlane(cal, 0.3, 0.42, home, kx, ky, kz + 0.006, true); (cm.material as THREE.MeshBasicMaterial).color.setScalar(0.88); }
  // the dealer's chair (x 0.45) and the couple's two chairs (x 0.0 and 0.72)
  const chairAt = (parent: THREE.Group, x: number, z: number) => {
    const cb = new Batch(), m = C("#7a5030");
    box(cb, m, x - 0.21, 0.42, z - 0.21, x + 0.21, 0.46, z + 0.21);
    for (const [ddx, ddz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) box(cb, m, x + ddx - 0.02, 0, z + ddz - 0.02, x + ddx + 0.02, 0.42, z + ddz + 0.02);
    box(cb, m, x - 0.2, 0.46, z - 0.23, x + 0.2, 0.95, z - 0.19); cb.build(parent);
  };
  const chairDealer = new THREE.Group(); home.add(chairDealer); chairAt(chairDealer, HOME.dealer[0], HOME.dealer[1] - 0.02);
  const chairsPair = new THREE.Group(); home.add(chairsPair); chairAt(chairsPair, HOME.lucas_seat[0], HOME.lucas_seat[1] - 0.02); chairAt(chairsPair, HOME.fiance_seat[0], HOME.fiance_seat[1] - 0.02);
  // the jewellery scale: base, steel pan, open lid, LCD on the front
  const [scx, , scz] = HOME.scale, lcd = canvasMat(240, 90);
  const scaleG = new THREE.Group();
  { const sg = scaleG; sg.position.set(scx, TY, scz); sg.scale.setScalar(1.6); home.add(sg); // drawn at 1.6x real size so it reads beside the big cartoon heads
    mesh(new THREE.BoxGeometry(0.12, 0.022, 0.12), C("#3a3d46"), sg, 0, 0.011, 0);
    mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.005, 24), steel, sg, 0, 0.0245, -0.008);
    const lid = mesh(new THREE.BoxGeometry(0.12, 0.004, 0.12), C("#4a4d56"), sg, 0, 0.082, -0.066); lid.rotation.x = -1.45;
    canvasPlane(lcd, 0.07, 0.026, sg, 0, 0.011, 0.0612); }
  const panPack = flatPack(0); panPack.position.set(scx, TY + 0.0465, scz - 0.013); home.add(panPack);
  // desk lamp
  const [lx, , lz] = HOME.lamp, [hx2, hy2, hz2] = HOME.lamp_head;
  let lampBulb: THREE.Mesh; const lampG = new THREE.Group(); home.add(lampG);
  { const lb = new Batch(); cyl(lb, ink, lx, TY, lz, 0.07, 0.07, 0.02, 20); lb.build(lampG);
    const arm = (a: V3, c: V3) => { const v = V(c[0] - a[0], c[1] - a[1], c[2] - a[2]), L = v.length(); const m = mesh(new THREE.CylinderGeometry(0.008, 0.008, L, 8), ink, lampG, (a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2); m.quaternion.setFromUnitVectors(V(0, 1, 0), v.normalize()); };
    const elbow: V3 = [lx - 0.05, TY + 0.32, lz - 0.02]; arm([lx, TY + 0.02, lz], elbow); arm(elbow, [hx2, hy2 + 0.05, hz2]);
    const shade = mesh(new THREE.CylinderGeometry(0.035, 0.09, 0.11, 20, 1, true), lam("lampShade", () => ({ color: "#c23a32", side: THREE.DoubleSide })), lampG, hx2, hy2, hz2); shade.rotation.z = 0.35;
    lampBulb = mesh(new THREE.SphereGeometry(0.03, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 2.5, 1.6) }), lampG, hx2 + 0.01, hy2 - 0.04, hz2); lampBulb.castShadow = false; }
  // the 24 packs (positions per frame: world.ts)
  const packs = Array.from({ length: PACK_N }, (_, i) => { const m = flatPack(i); home.add(m); return m; });
  // three clear-blue tubs, their lids, the packs filed inside (S03), the four hero packs that rise out of tub 2
  const tubM = lam("tub", () => ({ color: "#9cc8e8" })), tubD = lam("tubD", () => ({ color: "#7fb0d6" }));
  const [bw, bh, bd] = HOME.bin_size;
  b = new Batch();
  for (const [bx, bz] of HOME.bins) {
    const t = 0.012, X0 = bx - bw / 2, X1 = bx + bw / 2, Z0 = bz - bd / 2, Z1 = bz + bd / 2, L = 0.016; // walls, an inner floor, a lip ring 16 mm proud
    box(b, tubD, X0 + t + 0.002, 0, Z0 + t + 0.002, X1 - t - 0.002, 0.02, Z1 - t - 0.002);
    box(b, tubM, X0, 0, Z0, X1, bh, Z0 + t); box(b, tubM, X0, 0, Z1 - t, X1, bh, Z1);
    box(b, tubM, X0 - 0.0015, 0, Z0 + t + 0.003, X0 + t, bh - 0.004, Z1 - t - 0.003); box(b, tubM, X1 - t, 0, Z0 + t + 0.003, X1 + 0.0015, bh - 0.004, Z1 - t - 0.003);
    box(b, tubD, X0 - L, bh - 0.032, Z0 - L, X1 + L, bh - 0.014, Z0 - 0.001); box(b, tubD, X0 - L, bh - 0.031, Z1 + 0.001, X1 + L, bh - 0.013, Z1 + L);
    box(b, tubD, X0 - L - 0.002, bh - 0.0335, Z0 - 0.0005, X0 - 0.0012, bh - 0.0155, Z1 + 0.0005); box(b, tubD, X1 + 0.0012, bh - 0.0325, Z0 - 0.0005, X1 + L + 0.002, bh - 0.0145, Z1 + 0.0005);
  }
  b.build(home);
  const lids = HOME.bins.map(() => mesh(new THREE.BoxGeometry(bw + 0.03, 0.025, bd + 0.03), lam("tubLid", () => ({ color: "#3f7fc9" })), home));
  const tubPacks = new THREE.Group(); home.add(tubPacks);
  HOME.bins.forEach(([bx, bz], ti) => { for (let L2 = 0; L2 < 2; L2++) for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const m = flatPack(c + r * 2 + ti + L2); m.scale.setScalar(0.92);
    m.position.set(bx - 0.135 + r * 0.09 + (L2 ? 0.04 : 0), 0.24 + L2 * 0.03 + 0.004 * ((c + r) % 3), bz - 0.2 + c * 0.13 + (L2 ? 0.05 : 0));
    m.rotation.set(0.12 * Math.sin(c * 2.1 + r + ti), 0.35 * Math.sin(c * 1.7 + r * 2.3 + ti), 0.1 * Math.cos(r * 1.9 + c)); tubPacks.add(m); } });
  const heroPacks = [0, 1, 2, 3].map((k) => { const m = standPack(k, 1.35); home.add(m); return m; });
  // phone (lies on the table / held for the POV), laptop, pizza box, rock-candy bowl
  const phoneCv = canvasMat(300, 620), phone = new THREE.Group(); home.add(phone);
  mesh(new THREE.BoxGeometry(0.075, 0.155, 0.008), ink, phone); canvasPlane(phoneCv, 0.071, 0.147, phone, 0, 0, 0.0046);
  const laptopCv = canvasMat(800, 500), laptop = new THREE.Group(); laptop.position.set(...(HOME.laptop as V3)); home.add(laptop);
  mesh(new THREE.BoxGeometry(0.32, 0.016, 0.22), C("#9aa0aa"), laptop, 0, 0.008, 0);
  mesh(new THREE.PlaneGeometry(0.28, 0.1), C("#3a3d46"), laptop, 0, 0.0165, -0.025).rotation.x = -Math.PI / 2;
  { const lid = new THREE.Group(); lid.position.set(0, 0.016, 0.11); lid.rotation.x = 0.26; laptop.add(lid); // hinge on the far edge; the screen faces the user (-z)
    mesh(new THREE.BoxGeometry(0.32, 0.21, 0.008), C("#9aa0aa"), lid, 0, 0.105, 0);
    const sc = canvasPlane(laptopCv, 0.29, 0.181, lid, 0, 0.108, -0.0046); sc.rotation.y = Math.PI; }
  const pizza = new THREE.Group(); pizza.position.set(...(HOME.pizza as V3)); home.add(pizza);
  { const pb = C("#e9e4d6"); mesh(new THREE.BoxGeometry(0.36, 0.02, 0.36), pb, pizza, 0, 0.01, -0.05);
    const top = mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshLambertMaterial({ map: ctex("pizza", 400, 400, (g) => A2.pizzaTop(new Pen(g))) }), pizza, 0, 0.0215, -0.05); top.rotation.x = -Math.PI / 2;
    mesh(new THREE.BoxGeometry(0.36, 0.006, 0.36), pb, pizza, 0, 0.003 + 0.0002, 0.31); }
  const candyM = lam("candy", () => ({ color: "#7fc8f2" })), stickM = C("#d9b77a");
  const [bwx, , bwz] = HOME.candy;
  { const bb = new Batch(); cyl(bb, lam("bowl", () => ({ color: "#d8eef8" })), bwx, TY, bwz, 0.05, 0.08, 0.07, 20); bb.build(home); }
  const candies = [0, 1, 2, 3].map((i) => { const g = new THREE.Group(); g.position.set(bwx + 0.03 * Math.cos(i * 1.6), TY + 0.06, bwz + 0.03 * Math.sin(i * 1.6)); g.rotation.set(0.25 * Math.sin(i * 1.6), 0, 0.25 * Math.cos(i * 1.6)); home.add(g);
    mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 6), stickM, g, 0, 0.04, 0); const c = mesh(new THREE.IcosahedronGeometry(0.028, 0), candyM, g, 0, 0.13, 0); c.scale.set(1, 1.5, 1); return g; });
  // candy bowl on the coffee table (the chorus's)
  { const bb = new Batch(); const [qx, , qz] = HOME.bowl2; cyl(bb, lam("bowl", () => ({ color: "#d8eef8" })), qx, CY, qz, 0.06, 0.09, 0.06, 20);
    for (let i = 0; i < 7; i++) sph(bb, C(["#e2453c", "#f2c84a", "#2f9a55", "#7b5ac9"][i % 4]), qx + 0.04 * Math.cos(i), CY + 0.065, qz + 0.04 * Math.sin(i), 0.02); bb.build(home); }

  // ===== HALL =====
  SETL = "hall";
  const hall = G("hall", ORIGIN.hall), HX = HALL.hx, HZ = HALL.hz;
  shell(hall, HX, HZ, HALL.h, lam("carpet", () => ({ map: rep(ctex("carpetB", 256, 256, (g, r) => { g.fillStyle = "#5a6a86"; g.fillRect(0, 0, 256, 256); blot(g, r, 256, 256, 16, "30,40,60", 0.12, 50); }), 6, 4) })), lam("hallWall", () => ({ map: paintWall("hall", "#e3e6ea") })), "#eef0f2");
  b = new Batch();
  const cloth = C("#2f5fb4"), cloth2 = C("#c23a32");
  for (let i = 0; i < 6; i++) { const x0 = -6.2 + i * 2.1; box(b, cloth, x0, 0, -3.95, x0 + 1.8, 0.76, -3.25); box(b, C("#2a2c33"), x0 + 0.15, 0.76, -3.85, x0 + 1.65, 0.9, -3.45);
    box(b, C(["#e7a43a", "#2f9a55", "#7b5ac9"][i % 3]), x0 + 0.7, 0, -4.6, x0 + 1.1, 2.0, -4.55); }
  const [bkx, bkz] = HALL.booth;
  box(b, cloth2, bkx - 0.4, 0, bkz - 1.0, bkx + 0.4, 0.78, bkz + 1.0); box(b, C("#2a2c33"), bkx - 0.15, 0.78, bkz - 0.2, bkx + 0.15, 0.88, bkz + 0.2);
  box(b, C("#5b6170"), bkx - 0.03, 0.78, bkz - 0.03, bkx + 0.03, 2.4, bkz + 0.03);
  for (const [x, z] of [[-3.5, -1.5], [3.5, -1.5], [0, 1.5], [-3.5, 2.5], [3.5, 2.5]]) box(b, lam("hpanel", () => ({ color: "#ffffff", emissive: "#c8ccd0" })), x - 0.6, HALL.h - 0.04, z - 0.6, x + 0.6, HALL.h - 0.005, z + 0.6);
  b.build(hall);
  const cardsTex = ctex("caseCards", 512, 128, (g) => { g.fillStyle = "#1f2128"; g.fillRect(0, 0, 512, 128); ["zard_base", "jg_scyther", "fs_aerodactyl", "tr_dark_zard", "pikachu"].forEach((n, i) => { A2.scan(g, n, 12 + i * 100, 14, 72, 100); }); });
  for (let i = 0; i < 6; i++) { const x0 = -6.2 + i * 2.1; const m = mesh(new THREE.PlaneGeometry(1.4, 0.36), new THREE.MeshLambertMaterial({ map: cardsTex }), hall, x0 + 0.9, 0.903, -3.65); m.rotation.x = -Math.PI / 2; }
  { const s = plane(1.4, 0.5, new THREE.MeshBasicMaterial({ map: ctex("weBuy", 560, 200, (g) => A2.signText(new Pen(g), 560, 200, ["WE BUY", "CASH"], "#2f9a55", "#ffffff")) }), hall, bkx + 0.04, 2.6, bkz, Math.PI / 2); void s; }
  plane(4.0, 0.8, new THREE.MeshLambertMaterial({ map: ctex("cardShow", 1000, 200, (g) => A2.bannerTex(new Pen(g), "CARD SHOW", "#c23a32", "#ffffff")) }), hall, HALL.banner[0], HALL.banner[1], HALL.banner[2]);
  const hallClock = canvasMat(256, 256), [hcx, hcy, hcz] = HALL.clock as V3, HR = HALL.clock_r;
  mesh(new THREE.CylinderGeometry(HR + 0.03, HR + 0.03, 0.05, 32), ink, hall, hcx, hcy, hcz + 0.025).rotation.x = Math.PI / 2;
  mesh(new THREE.CircleGeometry(HR, 32), new THREE.MeshLambertMaterial({ map: hallClock.tex }), hall, hcx, hcy, hcz + 0.0525);
  // Lucas's hand truck with the three tubs (moves with him)
  const truck = new THREE.Group(); hall.add(truck);
  { const tb = new Batch(); box(tb, ink, 0.016, 0, -0.27, 0.056, 1.25, -0.235); box(tb, ink, 0.016, 0, 0.235, 0.056, 1.25, 0.27); box(tb, ink, -0.2, 0, -0.25, 0.058, 0.028, 0.25);
    for (let i = 0; i < 3; i++) { box(tb, tubM, -0.4, 0.031 + i * 0.35, -0.29, 0.0, 0.36 + i * 0.35, 0.29); box(tb, lam("tubLid", () => ({ color: "#3f7fc9" })), -0.41, 0.36 + i * 0.35, -0.3, 0.01, 0.38 + i * 0.35, 0.3); }
    cyl(tb, C("#26242b"), 0.02, 0.1, -0.3, 0.1, 0.1, 0.05, 14, new THREE.Euler(Math.PI / 2, 0, 0)); cyl(tb, C("#26242b"), 0.02, 0.1, 0.25, 0.1, 0.1, 0.05, 14, new THREE.Euler(Math.PI / 2, 0, 0));
    tb.build(truck); }
  const hallPhoneCv = canvasMat(300, 620), hallPhone = new THREE.Group(); hall.add(hallPhone);
  mesh(new THREE.BoxGeometry(0.075, 0.155, 0.008), ink, hallPhone); canvasPlane(hallPhoneCv, 0.071, 0.147, hallPhone, 0, 0, 0.0046);

  // ===== STREET + LOT =====
  SETL = "street";
  const street = G("street", ORIGIN.street);
  b = new Batch();
  const [rx0, rx1] = STREET.road, LN = STREET.lane, LX = STREET.lot;
  up(b, M.asphalt(), rx0, LX[0], -LN, LN, 0, 8);
  up(b, M.lot(), LX[0], LX[1], LX[2], LX[3], 0, 6);
  box(b, M.curb(), rx0, 0, LN, LX[0], 0.15, LN + 0.25); box(b, M.walk(), rx0, 0, LN + 0.25, LX[0], 0.14, 16, 3);
  box(b, M.curb(), rx0, 0, -LN - 0.25, LX[0], 0.15, -LN); box(b, M.walk(), rx0, 0, -8, LX[0], 0.14, -LN - 0.25, 3);
  box(b, M.walk(), LX[0], 0, LX[3], LX[1] + 6, 0.14, 16, 3); box(b, M.walk(), LX[0], 0, -8, LX[1] + 6, 0.14, LX[2], 3);
  box(b, M.walk(), LX[1], 0, LX[2], LX[1] + 6, 0.14, LX[3], 3);
  for (let x = rx0 + 2; x < LX[0] - 2; x += 6) box(b, M.line(), x, 0.004, -0.06, x + 3, 0.012, 0.06);
  for (let x = LX[0] + 1; x < LX[1]; x += 3) box(b, M.line(), x, 0.004, LX[2] + 0.2, x + 0.1, 0.012, LX[2] + 2.6);
  for (let x = rx0 + 4; x < LX[0] - 4; x += 12) palm(b, x, 0.14, -6.2, 6.5 + (x % 3), x);
  for (let x = rx0 + 10; x < LX[0] - 4; x += 16) palm(b, x, 0.14, 5.4, 6.0, x + 7);
  for (let x = rx0 + 6; x < LX[1]; x += 24) lamp(b, x, 0.14, -4.8, 1);
  const stuccoCols = ["#e8c9a0", "#d98a6a", "#e3d6b8", "#c9a0b8", "#a8c4c0", "#e8b070"];
  for (let i = 0, x = rx0; x < LX[1] + 6; i++) {
    const w = 7 + (i % 3) * 2, h = 4 + (i % 4) * 1.6, m = lam("stucco" + i % 6, () => ({ color: stuccoCols[i % 6] }));
    box(b, m, x, 0, -14, x + w - 0.3, h, -8.3);
    box(b, lam("winLit", () => ({ color: "#ffd98a", emissive: "#d8a040" })), x + 1, 1.0, -8.31, x + w - 1.3, 2.6, -8.29);
    box(b, C("#5a3b2a"), x + 0.6, h, -9.0, x + w - 0.9, h + 0.25, -8.2);
    x += w;
  }
  // the LOS ANGELES billboard on the far sidewalk
  const BB = obj("street", "billboard"), bbl = [BB.p[0] - ORIGIN.street[0], BB.p[1], BB.p[2] - ORIGIN.street[2]];
  box(b, M.pole(), bbl[0] - 2.6, 0.14, bbl[2] - 0.15, bbl[0] - 2.3, 3.2, bbl[2] + 0.15); box(b, M.pole(), bbl[0] + 2.3, 0.14, bbl[2] - 0.15, bbl[0] + 2.6, 3.2, bbl[2] + 0.15);
  box(b, C("#2a2c33"), bbl[0] - 3.6, 3.1, bbl[2] - 0.2, bbl[0] + 3.6, 5.3, bbl[2] - 0.05);
  // the lot lamp
  const [llx, llz] = STREET.lamp;
  cyl(b, M.pole(), llx, 0, llz, 0.1, 0.08, 6.0, 10); box(b, M.pole(), llx - 0.05, 5.9, llz, llx + 0.05, 6.0, llz + 1.4);
  b.build(street);
  plane(7.0, 2.0, new THREE.MeshBasicMaterial({ map: ctex("laSign", 1400, 400, (g) => A2.signText(new Pen(g), 1400, 400, ["WELCOME TO", "LOS ANGELES"], "#1f6a3a", "#ffffff")) }), street, bbl[0], 4.2, bbl[2] - 0.044);
  const lotHead = mesh(new THREE.BoxGeometry(0.5, 0.12, 0.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 2.0, 0.8) }), street, llx, 5.86, llz + 1.3); lotHead.castShadow = false;
  /** a car as its own group (origin at the ground centre, facing +x); open side windows so the driver shows */
  const carGroup = (col: string, L: number, Hc: number, suv: boolean) => {
    const g = new THREE.Group(), cb = new Batch(), m = lam("car" + col, () => ({ color: col })), W2 = 0.9;
    box(cb, m, -L / 2, 0.35, -W2, L / 2, 1.05, W2);
    const r0 = suv ? -L / 2 + 0.3 : -L / 2 + 0.5, r1 = suv ? L / 2 - 1.1 : L / 2 - 1.3;
    box(cb, m, r0, Hc - 0.08, -W2 + 0.08, r1, Hc, W2 - 0.08);
    for (const xx of [r0, (r0 + r1) / 2 - 0.05, r1 - 0.1]) box(cb, m, xx, 1.05, -W2 + 0.08, xx + 0.1, Hc - 0.08, W2 - 0.08);
    box(cb, M.glass(), r1 - 0.05, 1.07, -W2 + 0.12, r1 + 0.02, Hc - 0.1, W2 - 0.12); // windscreen
    for (const dxw of [-L / 2 + 0.75, L / 2 - 0.75]) for (const dzw of [-W2 + 0.02, W2 - 0.18]) cyl(cb, M.tyre(), dxw, 0.36, dzw, 0.36, 0.36, 0.16, 14, new THREE.Euler(Math.PI / 2, 0, 0));
    box(cb, lam("headL", () => ({ color: "#fff6d0", emissive: "#fff0b0" })), L / 2 - 0.01, 0.75, -W2 + 0.12, L / 2 + 0.02, 0.92, -W2 + 0.4); box(cb, lam("headL", () => ({ color: "#fff6d0", emissive: "#fff0b0" })), L / 2 - 0.01, 0.75, W2 - 0.4, L / 2 + 0.02, 0.92, W2 - 0.12);
    box(cb, lam("tailL", () => ({ color: "#d8322f", emissive: "#801010" })), -L / 2 - 0.02, 0.8, -W2 + 0.1, -L / 2 + 0.01, 0.95, -W2 + 0.35); box(cb, lam("tailL", () => ({ color: "#d8322f", emissive: "#801010" })), -L / 2 - 0.02, 0.8, W2 - 0.35, -L / 2 + 0.01, 0.95, W2 - 0.1);
    cb.build(g);
    const seatM = C("#2a2c33"); mesh(new THREE.BoxGeometry(0.5, 0.5, 1.5), seatM, g, (r0 + r1) / 2 - 0.4, 1.0, 0);
    street.add(g); return g;
  };
  const carL = carGroup("#3f7fc9", 4.2, 1.6, false), carD = carGroup("#1d1b22", 4.6, 1.75, true);
  carD.position.set(STREET.car_d[0], 0, STREET.car_d[1]); carD.rotation.y = Math.PI;
  // the box of packs (S13, carried) and its twin in the shop (S14)
  const packBox = (parent: THREE.Object3D) => {
    const g = new THREE.Group(); parent.add(g); const cm = new THREE.MeshLambertMaterial({ map: ctex("cardboardB", 256, 256, (gg) => A2.cardboardTex(new Pen(gg))) });
    mesh(new THREE.BoxGeometry(0.4, 0.02, 0.3), cm, g, 0, 0.01, 0);
    mesh(new THREE.BoxGeometry(0.4, 0.26, 0.012), cm, g, 0, 0.13, 0.144); mesh(new THREE.BoxGeometry(0.4, 0.26, 0.012), cm, g, 0, 0.13, -0.144);
    mesh(new THREE.BoxGeometry(0.012, 0.26, 0.276), cm, g, 0.194, 0.13, 0); mesh(new THREE.BoxGeometry(0.012, 0.26, 0.276), cm, g, -0.194, 0.13, 0);
    for (let c = 0; c < 5; c++) for (let r = 0; r < 2; r++) { const m = standPack(c + r, 1); m.position.set(-0.15 + c * 0.075, 0.2, -0.06 + r * 0.11); m.rotation.x = -0.25; g.add(m); }
    return g;
  };
  const lotBox = packBox(street);

  // ===== SHOP =====
  SETL = "shop";
  const shop = G("shop", ORIGIN.shop), SH = SHOP.half;
  shell(shop, SH, SH, SHOP.h, lam("shopFloor", () => ({ map: rep(tiles(), 4, 4) })), lam("shopWall", () => ({ map: paintWall("shop", "#efe3c8") })), "#f6f1e4");
  b = new Batch();
  const [kx0, kx1, kz0, kz1] = SHOP.counter, KY = SHOP.counter_y;
  box(b, C("#5a3b2a"), kx0, 0, kz0, kx1, KY - 0.03, kz1 - 0.02);
  box(b, C("#3a2a20"), kx0 - 0.02, KY - 0.03, kz0 - 0.02, kx1 + 0.02, KY, kz1 + 0.02);
  for (const y of [0.9, 1.4, 1.9]) box(b, C("#e9e4d6"), -2.0, y - 0.025, -SH, 2.0, y, -SH + 0.36);
  const boxCols = ["#2f5fb4", "#c23a32", "#e7a43a", "#2f9a55", "#7a3fb4", "#2a2230"];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 10; i++) { const x = -1.92 + i * 0.39, y = 0.9 + r * 0.5; box(b, C(boxCols[(i + r * 2) % 6]), x, y, -SH + 0.04, x + 0.34, y + 0.28 + 0.03 * ((i + r) % 2), -SH + 0.32); }
  for (const [x, z] of [[-1.2, 0.0], [1.2, 0.0], [0, -2.0]]) box(b, lam("spanel", () => ({ color: "#ffffff", emissive: "#c8ccd0" })), x - 0.4, SHOP.h - 0.04, z - 0.4, x + 0.4, SHOP.h - 0.005, z + 0.4);
  // the ID scanner
  const [snx, , snz] = SHOP.scanner; box(b, ink, snx - 0.06, KY, snz - 0.04, snx + 0.06, KY + 0.06, snz + 0.04);
  b.build(shop);
  const caseTex = ctex("shopCase", 1200, 300, (g) => { g.fillStyle = "#1f2128"; g.fillRect(0, 0, 1200, 300); for (let i = 0; i < 11; i++) A2.scan(g, ["zard_base", "jg_scyther", "fs_aerodactyl", "tr_dark_zard", "pikachu"][i % 5], 30 + i * 106, 60, 84, 117); g.fillStyle = "rgba(200,230,255,0.18)"; g.fillRect(0, 0, 1200, 300); });
  plane(kx1 - kx0 - 0.2, 0.55, new THREE.MeshLambertMaterial({ map: caseTex }), shop, 0, 0.55, kz1 - 0.012);
  plane(1.6, 0.4, new THREE.MeshBasicMaterial({ map: ctex("weBuyCards", 800, 200, (g) => A2.signText(new Pen(g), 800, 200, ["WE BUY CARDS"], "#c23a32", "#ffffff")) }), shop, 0, 2.45, -SH + 0.006);
  const scanWin = mesh(new THREE.PlaneGeometry(0.09, 0.05), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.05, 0.05) }), shop, snx, KY + 0.0605, snz); scanWin.rotation.x = -Math.PI / 2;
  const checkCv = canvasMat(720, 320);
  const checkMesh = mesh(new THREE.PlaneGeometry(0.18, 0.08), new THREE.MeshLambertMaterial({ map: checkCv.tex }), shop, SHOP.check[0], SHOP.check[1], SHOP.check[2]); checkMesh.rotation.x = -Math.PI / 2;
  const shopBox = packBox(shop);

  // shells and room fittings: transparent things draw no ink and cast no shadow
  for (const g of [home, hall, street, shop]) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } else m.receiveShadow = true; });
  for (const o of [door, ...packs, panPack, ...heroPacks, ...lids, phone, laptop, carL, carD, lotBox, shopBox]) o.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh && !(m.material as THREE.Material).transparent) { m.castShadow = true; m.receiveShadow = true; } });
  void quad; void tri; void boxGeo; void untone; void glassM; void sign; void local; void bush; void car; void wheels; void slab; void clockFace; void SH;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, lampG, scaleG, door, clock, cal, lcd, panPack, packs, heroPacks, tubPacks, lids, chairDealer, chairsPair, phone, phoneCv, laptop, laptopCv, pizza, candies, lampBulb,
    hallClock, hallPhone, hallPhoneCv, truck, carL, carD, lotBox, shopBox, scanWin, checkCv, checkMesh };
};
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
const glassM = () => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide });
