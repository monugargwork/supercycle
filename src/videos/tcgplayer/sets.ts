// The sets of the TCGplayer reel (the workroom, the HQ office, Syracuse, the market, the shop, the boardroom), built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { scan, ebaySign, plainSign, posterUnion, closedSign, sackFace, boxSide, coinFace } from "./art2";
import { V3, obj, ORIGIN, HOMEP, HQP, SYRP, MKP, SHP, BDP } from "./story";

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
  laptop: Canvas; tv: Canvas; bot: Canvas; env: Canvas; homeCoins: THREE.Mesh[]; plate: THREE.Group; cakeBox: THREE.Group;
  board: Canvas; win: Canvas; name: Canvas; nameG: THREE.Group; letter: Canvas; prog: Canvas; lever: THREE.Group; cake: THREE.Group; slice: THREE.Mesh;
  shutter: THREE.Group; boxes: THREE.Group[];
  scale: THREE.Group; twin: THREE.Group; mkCoins: THREE.Mesh[]; bag: THREE.Group;
  phone: Canvas; phoneMesh: THREE.Group;
  board2: Canvas; sack: THREE.Group;
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
const skyPanel = (key: string, top: string, bot: string) => ctex("sky" + key, 256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
});
const brickT = () => ctex("brickT", 512, 512, (g, r) => {
  g.fillStyle = "#6a4a40"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) for (let x = (y / 32) % 2 ? -32 : 0; x < 512; x += 64) { g.fillStyle = jit(r, "#a5533e", 0.07, 4, 0.12); g.fillRect(x + 3, y + 3, 58, 26); }
});
const stripes = (a: string, b: string) => ctex("stripes" + a + b, 256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 64); } });
const tileFloor = () => ctex("mktiles", 512, 512, (g, r) => {
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = jit(r, (i + j) % 2 ? "#d9c7a5" : "#c7b08a", 0.03, 2, 0.1); g.fillRect(i * 128, j * 128, 128, 128); }
  g.fillStyle = "rgba(90,70,50,0.4)"; for (let k = 0; k < 512; k += 128) { g.fillRect(k, 0, 3, 512); g.fillRect(0, k, 512, 3); }
});
const ribbed2 = () => ctex("rollup2", 256, 256, (g) => {
  g.fillStyle = "#b9bec6"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) { g.fillStyle = "rgba(60,64,76,0.45)"; g.fillRect(0, y, 256, 3); g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(0, y + 3, 256, 2); }
});
const stripeWall = (key: string, a: string, b: string) => ctex("stripeW" + key, 512, 512, (g, r) => {
  for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 512); }
  blot(g, r, 512, 512, 10, "255,255,255", 0.05, 120);
});
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
const cardTexture = (name: string) => ctex("card" + name, 732, 1024, (g) => { g.clearRect(0, 0, 732, 1024); scan(g, name, 0, 0, 732, 1024); });

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const lamC = (tex: THREE.Texture, transparent = false) => new THREE.MeshLambertMaterial({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 });
  const basicC = (tex: THREE.Texture) => new THREE.MeshBasicMaterial({ map: tex });
  const signTex = (key: string, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => ctex("sign" + key, W, H, (g) => plainSign(new Pen(g), W, H, txt, bg, fg, sub, border));
  const shell = (g: THREE.Group, hx: number, hz: number, h: number, floorM: THREE.Material, wallM: THREE.Material, ceil: string) => {
    const sb = new Batch();
    up(sb, floorM, -hx, hx, -hz, hz, 0, 1);
    box(sb, wallM, -hx - 0.1, 0, -hz - 0.1, hx + 0.1, h, -hz, 2); box(sb, wallM, -hx - 0.1, 0, hz, hx + 0.1, h, hz + 0.1, 2);
    box(sb, wallM, -hx - 0.1, 0, -hz, -hx, h, hz, 2); box(sb, wallM, hx, 0, -hz, hx + 0.1, h, hz, 2);
    sb.build(g, false);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(2 * hx, 2 * hz), lam("ceil" + ceil, () => ({ color: ceil }))); c.rotation.x = Math.PI / 2; c.position.set(0, h - 0.002, 0); c.castShadow = false; c.receiveShadow = false; g.add(c);
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
  const white = C("#f3f1ec"), steel = C("#c9ccd2"), ink = C("#2a2c33"), birch = C("#d8b88a"), oak = C("#8a5a34");
  const glassMat = () => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
  const coinGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.003, 18); coinGeo.translate(0, 0.0015, 0);
  const coinM = [C("#c99a2a"), lamC(ctex("coinFace", 64, 64, (g) => coinFace(new Pen(g)))), C("#c99a2a")];
  const stool = (b: Batch, x: number, z: number) => { cyl(b, C("#3a3d46"), x, 0, z, 0.02, 0.02, 0.6, 10); cyl(b, C("#2f3240"), x, 0.6, z, 0.17, 0.17, 0.05, 20); cyl(b, C("#3a3d46"), x, 0, z, 0.2, 0.2, 0.02, 16); };

  // ===== THE WORKROOM =====
  SETL = "home";
  const H = HOMEP, home = G("home", ORIGIN.home);
  shell(home, 2.4, 2.4, 2.6, lam("homeFloor", () => ({ map: rep(woodTex("home", "#c98a4e", "rgba(90,50,20,0.45)"), 3, 3) })), lam("homeWall", () => ({ map: rep(stripeWall("home", "#f6e7bf", "#f0dcac"), 3, 2) })), "#fbf4e4");
  let b = new Batch();
  const [tx0, tx1, tz0, tz1] = H.table;
  box(b, birch, tx0, TY - 0.04, tz0, tx1, TY, tz1);
  for (const x of [tx0 + 0.05, tx1 - 0.05]) for (const z of [tz0 + 0.05, tz1 - 0.05]) box(b, oak, x - 0.025, 0, z - 0.025, x + 0.025, TY - 0.04, z + 0.025);
  stool(b, H.seller[0], H.seller[1]);
  const [lx, , lz] = H.laptop;
  // mailers and top loaders on the table
  box(b, C("#e9e4d6"), 0.55, TY, -0.75, 0.82, TY + 0.03, -0.58); box(b, C("#f2e3c4"), 0.58, TY + 0.03, -0.74, 0.8, TY + 0.05, -0.6);
  for (let i = 0; i < 4; i++) box(b, C("#e8f4ff"), -0.85 + i * 0.012, TY, -0.66 - i * 0.004, -0.75 + i * 0.012, TY + 0.003 + i * 0.003, -0.53 - i * 0.004);
  // the price scanner
  const [bx0, , bz0] = H.bot;
  box(b, C("#6a707c"), bx0 - 0.07, TY, bz0 - 0.05, bx0 + 0.07, TY + 0.06, bz0 + 0.05);
  // the PHÍ jar: glass, bottom
  const [jx, , jz] = H.jar;
  cyl(b, C("#cfe6f0"), jx, TY, jz, 0.058, 0.058, 0.006, 20);
  // TV bezel
  const [tvx, tvy, tvz] = H.tv, [tvw, tvh] = H.tv_size;
  box(b, ink, tvx - tvw / 2 - 0.03, tvy - tvh / 2 - 0.03, -2.4, tvx + tvw / 2 + 0.03, tvy + tvh / 2 + 0.03, tvz + 0.012);
  // shelves of card boxes and binders
  for (const y of [0.9, 1.4, 1.9]) box(b, C("#e9e4d6"), 1.0, y - 0.02, -2.38, 2.3, y, -2.1);
  const stockCols = ["#2f5fb4", "#c23a32", "#e7a43a", "#2f9a55", "#7a3fb4", "#1d2a44"];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 1.05 + i * 0.2, y = 0.9 + r * 0.5; box(b, C(stockCols[(i + r) % 6]), x, y, -2.33, x + 0.16, y + 0.24 + 0.04 * ((i + r) % 2), -2.14); }
  windowOn(b, home, "x", -2.4, 1, H.window[2], 1.0, 2.1, H.window_w, cloudSky("home"), white);
  // dressing: a rug, a plant by the window, shipping boxes in the corner, a desk lamp, a wainscot rail
  box(b, C("#c23a32"), -1.3, 0, -1.9, 1.3, 0.008, 0.2); box(b, C("#f2c84a"), -1.15, 0.008, -1.75, 1.15, 0.012, 0.05);
  cyl(b, C("#c9744a"), -2.0, 0, 0.6, 0.16, 0.2, 0.36, 14); sph(b, C("#4fa548"), -2.0, 0.62, 0.6, 0.3); sph(b, C("#3d8f45"), -1.9, 0.86, 0.5, 0.2);
  for (const [x, z, y0, w] of [[1.7, 1.6, 0, 0.5], [1.75, 1.6, 0.4, 0.4], [2.05, 1.1, 0, 0.45]]) box(b, C("#c99a62"), x - w / 2, y0, z - w / 2, x + w / 2, y0 + 0.4, z + w / 2);
  cyl(b, C("#2f5fb4"), -0.75, TY, -0.62, 0.07, 0.07, 0.02, 14); cyl(b, C("#2f5fb4"), -0.75, TY + 0.02, -0.62, 0.01, 0.01, 0.32, 8); cyl(b, C("#f2c84a"), -0.75, TY + 0.3, -0.62, 0.1, 0.04, 0.12, 14);
  for (const x of [-2.4, 2.4]) box(b, C("#a8703f"), x - (x < 0 ? 0 : 0.03), 0.95, -2.39, x + (x < 0 ? 0.03 : 0), 1.0, 2.39);
  box(b, C("#a8703f"), -2.39, 0.95, -2.4, 2.39, 1.0, -2.37);
  b.build(home);
  // laptop lid + screen (faces the seller, -z; tilted back)
  const laptop = canvasMat(2560, 1620); // drawn at 2.5x the page's design size: the cards stay sharp
  { const lap = new THREE.Group(); lap.position.set(lx, TY, lz); lap.rotation.y = H.laptop_yaw; home.add(lap); // local +z faces the seller
    mesh(new THREE.BoxGeometry(0.34, 0.015, 0.24), C("#9aa0aa"), lap, 0, 0.0075, 0); mesh(new THREE.BoxGeometry(0.3, 0.002, 0.12), C("#5a606c"), lap, 0, 0.016, 0.03);
    const lid = new THREE.Group(); lid.position.set(0, 0.015, -0.12); lid.rotation.x = -H.screen_tilt; lap.add(lid);
    mesh(new THREE.BoxGeometry(0.35, 0.225, 0.008), C("#9aa0aa"), lid, 0, 0.1125, -0.005);
    const sc = plane(H.screen_size[0], H.screen_size[1], basicC(laptop.tex), lid, 0, 0.1125, 0.0012); sc.castShadow = false; }
  const frameCard = (parent: THREE.Object3D, nm: string, x: number, y: number, z: number, h: number, ry = 0) => {
    const g2 = new THREE.Group(); g2.position.set(x, y, z); g2.rotation.y = ry; parent.add(g2);
    mesh(new THREE.BoxGeometry(h * 0.716 + 0.06, h + 0.06, 0.02), C("#8a5a34"), g2, 0, 0, -0.012);
    mesh(new THREE.PlaneGeometry(h * 0.716 + 0.03, h + 0.03), C("#fbf7ec"), g2, 0, 0, -0.0005);
    const m = mesh(new THREE.PlaneGeometry(h * 0.716, h), new THREE.MeshBasicMaterial({ map: cardTexture(nm), transparent: true, alphaTest: 0.5 }), g2, 0, 0, 0.002); m.castShadow = false;
  };
  frameCard(home, "zard151", -1.2, 1.65, -2.38, 0.5); frameCard(home, "mtg_serra", 1.25, 2.15, -2.38, 0.36); frameCard(home, "blast151", 2.37, 1.7, -0.6, 0.5, -Math.PI / 2); frameCard(home, "venu151", 2.37, 1.7, 0.4, 0.5, -Math.PI / 2);
  const tv = canvasMat(1024, 576);
  plane(tvw, tvh, basicC(tv.tex), home, tvx, tvy, tvz + 0.018).castShadow = false;
  const bot = canvasMat(256, 160);
  { const s = plane(0.12, 0.075, basicC(bot.tex), home, bx0, TY + 0.064, bz0); s.rotation.set(-Math.PI / 2 + 0.6, 0, 0); }
  const env = canvasMat(440, 220);
  { const e = plane(0.22, 0.11, lamC(env.tex), home, H.envelope[0], TY + 0.0025, H.envelope[2]); e.rotation.set(-Math.PI / 2, 0, 0.08); }
  const homeCoins = Array.from({ length: 10 }, () => mesh(coinGeo, coinM, home));
  { const jg = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.13, 20, 1, true), glassMat(), home, jx, TY + 0.065, jz); jg.renderOrder = 3;
    plane(0.07, 0.04, lamC(signTex("phi", 280, 160, "PHÍ", "#fbf7ec", "#c23a32", "", "#c23a32")), home, jx, TY + 0.06, jz + 0.0615); }
  // the cake plate and the open cake box (S05 on)
  const plate = new THREE.Group(); home.add(plate);
  mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.008, 24), white, plate, 0, 0.004, 0);
  mesh(new THREE.BoxGeometry(0.07, 0.035, 0.09), C("#f2d28a"), plate, 0, 0.0255, 0); mesh(new THREE.BoxGeometry(0.072, 0.014, 0.092), C("#fbf3ec"), plate, 0, 0.05, 0);
  mesh(new THREE.BoxGeometry(0.074, 0.006, 0.02), C("#e2433b"), plate, 0, 0.06, -0.03);
  // a toothpick flag in the slice: the slice came from eBay's party
  const cakeBox = new THREE.Group(); plate.add(cakeBox);
  mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.09, 6), C("#e9d7a8"), cakeBox, 0.0, 0.1, 0.0);
  { const fl = plane(0.06, 0.035, new THREE.MeshLambertMaterial({ map: ctex("ebayFlag", 240, 140, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 240, 140); g.save(); g.translate(-28, 4); g.scale(0.38, 0.5); ebaySign(new Pen(g)); g.restore(); }), side: THREE.DoubleSide }), cakeBox, 0.031, 0.128, 0); void fl; }

  // ===== HQ =====
  SETL = "hq";
  const Q = HQP, hq = G("hq", ORIGIN.hq);
  shell(hq, 3.0, 3.0, 3.4, lam("hqFloor", () => ({ map: rep(carpetT("hq", "#b8322f"), 4, 4) })), lam("hqWall", () => ({ map: rep(woodTex("hqw", "#c98a4e", "rgba(90,50,20,0.4)"), 2, 2) })), "#f6ead2");
  b = new Batch();
  const [bcx, bcy, bcz] = Q.board, [bw, bh] = Q.board_size;
  box(b, steel, bcx - bw / 2 - 0.05, bcy - bh / 2 - 0.05, -3.0, bcx + bw / 2 + 0.05, bcy + bh / 2 + 0.05, bcz + 0.02);
  const [dx0, dx1, dz0, dz1] = Q.desk;
  box(b, oak, dx0, TY - 0.05, dz0, dx1, TY, dz1); box(b, C("#6a4428"), dx0 + 0.03, 0, dz1 - 0.06, dx1 - 0.03, TY - 0.05, dz1 - 0.03);
  box(b, C("#6a4428"), dx0 + 0.03, 0, dz0 + 0.03, dx0 + 0.08, TY - 0.05, dz1 - 0.06); box(b, C("#6a4428"), dx1 - 0.08, 0, dz0 + 0.03, dx1 - 0.03, TY - 0.05, dz1 - 0.06);
  // the boss's chair
  const [rcx, rcz] = Q.rob_desk;
  box(b, C("#1d1b22"), rcx - 0.26, 0.44, rcz - 0.24, rcx + 0.26, 0.52, rcz + 0.2); box(b, C("#1d1b22"), rcx - 0.26, 0.52, rcz - 0.3, rcx + 0.26, 1.32, rcz - 0.22);
  cyl(b, ink, rcx, 0, rcz, 0.03, 0.03, 0.44, 10); cyl(b, ink, rcx, 0, rcz, 0.25, 0.25, 0.03, 16);
  // TCGplayer plate on its chains under the eBay sign
  const [px0, py0, pz0] = Q.plate;
  box(b, C("#1d2a44"), px0 - 0.45, py0 - 0.08, pz0 - 0.02, px0 + 0.45, py0 + 0.08, pz0 + 0.02);
  for (const dx of [-0.35, 0.35]) box(b, steel, px0 + dx - 0.006, py0 + 0.08, pz0 - 0.006, px0 + dx + 0.006, Q.ebay[1] - 0.12, pz0 + 0.006);
  // dressing: bookshelves of colourful binders on the left wall, plants, a cream wainscot
  for (const y of [0.5, 1.0, 1.5, 2.0]) box(b, C("#7a4a28"), -2.99, y - 0.03, -2.6, -2.62, y, -0.6);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { const z = -2.55 + i * 0.21; box(b, C(["#e2433b", "#3f6fd8", "#f2b33a", "#5aa64a", "#d36ac9"][(i + r) % 5]), -2.97, 0.5 + r * 0.5, z, -2.66, 0.5 + r * 0.5 + 0.3 + 0.05 * ((i + r) % 2), z + 0.16); }
  for (const [x, z] of [[-2.5, 0.6], [2.5, -1.2]]) { cyl(b, C("#c9744a"), x, 0, z, 0.2, 0.24, 0.44, 14); sph(b, C("#4fa548"), x, 0.8, z, 0.36); sph(b, C("#3d8f45"), x + 0.1, 1.1, z - 0.1, 0.24); }
  // ceiling light panels
  for (const x of [-1.5, 0, 1.5]) box(b, lam("hqPanel", () => ({ color: "#ffffff", emissive: "#8a93a8" })), x - 0.4, 3.36, -1.4, x + 0.4, 3.395, -0.6);
  b.build(hq);
  const board = canvasMat(1024, 732);
  plane(bw, bh, basicC(board.tex), hq, bcx, bcy, bcz + 0.036).castShadow = false;
  plane(1.0, 0.32, new THREE.MeshBasicMaterial({ map: ctex("ebaySign", 800, 256, (g) => ebaySign(new Pen(g))), transparent: true, alphaTest: 0.5 }), hq, Q.ebay[0], Q.ebay[1], -2.985);
  plane(0.86, 0.14, basicC(signTex("tcgPlate", 860, 140, "TCGplayer", "#1d2a44", "#ffffff")), hq, px0, py0, pz0 + 0.022);
  const win = canvasMat(600, 750);
  { const wb = new Batch(); windowOn(wb, hq, "z", -3.0, 1, Q.window[0], Q.window[1] - Q.window_size[1] / 2, Q.window[1] + Q.window_size[1] / 2, Q.window_size[0], win.tex, steel); wb.build(hq); }
  // the lever on the board's right side: pivot at the top, rod down to a red knob
  const lever = new THREE.Group(); lever.position.set(Q.lever[0], Q.lever[1], Q.lever[2]); hq.add(lever); // pivot; the rod points up at rest
  mesh(new THREE.BoxGeometry(0.07, 0.07, 0.05), ink, lever, 0, 0, -0.02);
  mesh(new THREE.BoxGeometry(0.02, 0.24, 0.02), steel, lever, 0, 0.12, 0.01); mesh(new THREE.SphereGeometry(0.035, 14, 10), C("#d12a2a"), lever, 0, 0.25, 0.01);
  // the nameplate (pivots on its bottom edge) and the desk papers
  frameCard(hq, "zard151", 2.97, 1.8, -1.0, 0.5, -Math.PI / 2); frameCard(hq, "mtg_serra", 2.97, 1.8, 0.0, 0.5, -Math.PI / 2);
  const name = canvasMat(512, 136);
  const nameG = new THREE.Group(); nameG.position.set(Q.nameplate[0], TY, Q.nameplate[2]); hq.add(nameG);
  { const inner = new THREE.Group(); inner.position.y = 0.04; nameG.add(inner); mesh(new THREE.BoxGeometry(0.3, 0.08, 0.03), ink, inner, 0, 0, 0);
    plane(0.29, 0.077, basicC(name.tex), inner, 0, 0, 0.0155); }
  const letter = canvasMat(300, 390), prog = canvasMat(300, 390);
  { const l = plane(0.15, 0.195, lamC(letter.tex), hq, Q.letters[0], TY + 0.0025, Q.letters[2]); l.rotation.set(-Math.PI / 2, 0, 0.05);
    const p2 = plane(0.15, 0.195, lamC(prog.tex), hq, Q.doc[0], TY + 0.003, Q.doc[2]); p2.rotation.set(-Math.PI / 2, 0, -0.08); }
  // the cake on its side table
  const cake = new THREE.Group(); hq.add(cake);
  { const [sx, sz] = Q.side, sy = Q.side_y, cb = new Batch();
    cake.add(mesh(new THREE.BoxGeometry(0.6, 0.04, 0.5), C("#e9e4d6"), cake, sx, sy - 0.02, sz)); for (const dx of [-0.26, 0.26]) mesh(new THREE.BoxGeometry(0.04, sy - 0.04, 0.4), C("#9aa0aa"), cake, sx + dx, (sy - 0.04) / 2, sz);
    mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.012, 28), white, cake, sx, sy + 0.006, sz);
    mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 28), C("#fbf7f0"), cake, sx, sy + 0.072, sz); mesh(new THREE.CylinderGeometry(0.172, 0.172, 0.018, 28), C("#e2433b"), cake, sx, sy + 0.02, sz);
    mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 24), C("#fbf7f0"), cake, sx, sy + 0.182, sz); mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.014, 24), C("#e2433b"), cake, sx, sy + 0.235, sz);
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8), C(["#3f6fd8", "#f2c84a", "#5aa64a", "#d36ac9", "#e2433b"][i]), cake, sx + 0.06 * Math.cos(a), sy + 0.27, sz + 0.06 * Math.sin(a)); }
    void cb; }
  const slice = mesh(new THREE.BoxGeometry(0.06, 0.12, 0.09), C("#f2d28a"), cake, Q.side[0] + 0.12, Q.side_y + 0.072, Q.side[1] + 0.06); slice.visible = false;

  // ===== SYRACUSE =====
  SETL = "syr";
  const Y = SYRP, syr = G("syr", ORIGIN.syr);
  b = new Batch();
  up(b, lam("syrRoad", () => ({ map: rep(asphalt("syrA"), 4, 4) })), -9, 9, 2.4, 12, 0, 4);
  up(b, lam("syrWalk", () => ({ map: rep(concrete("syrW"), 6, 2) })), -9, 9, -1.0, 2.2, 0.0, 2);
  box(b, C("#d9d1c3"), -9, 0, 2.2, 9, 0.12, 2.4);
  const brickM = lam("brickM", () => ({ map: rep(brickT(), 3, 2) })), wz = Y.wall_z, [d0, d1, dh] = Y.door;
  box(b, brickM, -4.5, 0, wz - 0.12, d0, 4.6, wz, 2); box(b, brickM, d1, 0, wz - 0.12, 4.5, 4.6, wz, 2); box(b, brickM, d0, dh, wz - 0.12, d1, 4.6, wz, 2);
  box(b, C("#3a3d46"), d0 - 0.08, 0, wz - 0.14, d0, dh + 0.08, wz + 0.03); box(b, C("#3a3d46"), d1, 0, wz - 0.14, d1 + 0.08, dh + 0.08, wz + 0.03); box(b, C("#3a3d46"), d0, dh, wz - 0.14, d1, dh + 0.08, wz + 0.03);
  // the grading room
  up(b, C("#9aa0aa"), -2.6, 2.6, -5.2, wz - 0.12, 0.001, 1);
  box(b, C("#e9e4d6"), -2.7, 0, -5.3, 2.7, 3.0, -5.2); box(b, C("#e9e4d6"), -2.7, 0, -5.2, -2.6, 3.0, wz - 0.12); box(b, C("#e9e4d6"), 2.6, 0, -5.2, 2.7, 3.0, wz - 0.12);
  box(b, C("#d9dde4"), -2.7, 2.95, -5.2, 2.7, 3.0, wz - 0.12);
  for (const x of Y.benches) {
    box(b, C("#f3f1ec"), x - 0.38, Y.bench_y - 0.04, Y.bench_z - 0.3, x + 0.38, Y.bench_y, Y.bench_z + 0.3);
    box(b, C("#5a606c"), x - 0.35, 0, Y.bench_z - 0.27, x - 0.31, Y.bench_y - 0.04, Y.bench_z + 0.27); box(b, C("#5a606c"), x + 0.31, 0, Y.bench_z - 0.27, x + 0.35, Y.bench_y - 0.04, Y.bench_z + 0.27);
    cyl(b, ink, x + 0.25, Y.bench_y, Y.bench_z - 0.2, 0.012, 0.012, 0.45, 8); box(b, ink, x + 0.1, Y.bench_y + 0.42, Y.bench_z - 0.22, x + 0.28, Y.bench_y + 0.47, Y.bench_z - 0.12);
    box(b, C("#2f5fb4"), x - 0.25, Y.bench_y, Y.bench_z - 0.15, x + 0.05, Y.bench_y + 0.03, Y.bench_z + 0.1);
  }
  for (const x of [-1.2, 0, 1.2]) box(b, lam("syrPanel", () => ({ color: "#ffffff", emissive: "#d8d2b8" })), x - 0.4, 2.9, -3.6, x + 0.4, 2.945, -2.2);
  // dressing: lit windows beside the door, flower planters, two street trees, a cornice
  for (const x of [-3.0, 2.2]) { box(b, white, x - 0.05, 1.1, wz, x + 0.85, 2.45, wz + 0.04); box(b, lam("syrWin", () => ({ color: "#ffe9a8", emissive: "#a8823a" })), x, 1.15, wz + 0.04, x + 0.8, 2.4, wz + 0.05); box(b, C("#5aa64a"), x - 0.05, 1.0, wz, x + 0.85, 1.12, wz + 0.25); for (let i = 0; i < 6; i++) sph(b, C(["#e2433b", "#f2c84a", "#d36ac9"][i % 3]), x + 0.06 + i * 0.14, 1.16, wz + 0.15, 0.06); }
  box(b, C("#e9e4d6"), -4.5, 4.45, wz, 4.5, 4.62, wz + 0.15);
  for (const x of [-3.6, 3.9]) { cyl(b, C("#8a5a34"), x, 0, 1.4, 0.09, 0.07, 2.2, 10); sph(b, C("#4fa548"), x, 2.6, 1.4, 0.75); sph(b, C("#3d8f45"), x + 0.4, 2.3, 1.2, 0.5); }
  // lamp post
  cyl(b, C("#3a3d46"), 3.2, 0, 1.9, 0.06, 0.05, 4.2, 10); box(b, C("#3a3d46"), 2.6, 4.1, 1.85, 3.25, 4.18, 1.95);
  b.build(syr);
  plane(3.4, 0.5, basicC(signTex("syrSign", 1360, 200, "SYRACUSE · AUTHENTICATION CENTER", "#1d2a44", "#f4f1ea")), syr, Y.sign[0], Y.sign[1], wz + 0.012);
  plane(0.6, 0.84, lamC(ctex("union", 400, 560, (g) => posterUnion(new Pen(g)))), syr, -2.4, 1.55, wz + 0.01);
  const shutter = new THREE.Group(); syr.add(shutter);
  { const sw = d1 - d0 + 0.1; mesh(new THREE.BoxGeometry(sw, dh, 0.03), lam("shutterM", () => ({ map: rep(ribbed2(), 2, 3) })), shutter, 0, dh / 2, wz - 0.16);
    mesh(new THREE.BoxGeometry(sw, 0.06, 0.05), C("#5a606c"), shutter, 0, 0.03, wz - 0.16);
    plane(0.9, 0.36, basicC(ctex("closedS", 400, 160, (g) => closedSign(new Pen(g)))), shutter, 0, 1.5, wz - 0.143); }
  const boxM = [lamC(ctex("boxSide", 128, 128, (g) => boxSide(new Pen(g))))];
  const boxes = [0, 1, 2].map(() => { const g2 = new THREE.Group(); syr.add(g2); mesh(new THREE.BoxGeometry(0.36, 0.24, 0.26), boxM[0], g2, 0, 0, 0); mesh(new THREE.BoxGeometry(0.34, 0.01, 0.24), C("#2f5fb4"), g2, 0, 0.125, 0); return g2; });

  // ===== THE MARKET =====
  SETL = "market";
  const MK = MKP, market = G("market", ORIGIN.market);
  shell(market, 4.0, 4.5, 3.6, lam("mkFloor", () => ({ map: rep(tileFloor(), 4, 3) })), lam("mkWall", () => ({ map: paintWall("mk", "#f0dfbf") })), "#e9d9b8");
  b = new Batch();
  const SY = MK.stall_y;
  const stallInto = (bb: Batch, x0: number, x1: number, z0: number, z1: number, castors: boolean) => {
    const lift = castors ? 0.06 : 0;
    box(bb, C("#b07c50"), x0, SY - 0.04, z0, x1, SY, z1); box(bb, C("#9a6a40"), x0 + 0.02, lift, z1 - 0.04, x1 - 0.02, SY - 0.04, z1 - 0.02);
    for (const x of [x0 + 0.03, x1 - 0.03]) { box(bb, C("#7a5030"), x - 0.025, lift, z0 + 0.02, x + 0.025, SY - 0.04, z0 + 0.07); box(bb, C("#7a5030"), x - 0.025, lift, z1 - 0.07, x + 0.025, SY - 0.04, z1 - 0.02); }
    for (const x of [x0 + 0.03, x1 - 0.03]) box(bb, C("#7a5030"), x - 0.02, SY, z0 + 0.02, x + 0.02, 2.1, z0 + 0.06);
    box(bb, lam("awn", () => ({ map: stripes("#e2433b", "#fbf7ec") })), x0 - 0.06, 2.1, z0 - 0.05, x1 + 0.06, 2.16, z1 + 0.2);
    if (castors) for (const x of [x0 + 0.06, x1 - 0.06]) for (const z of [z0 + 0.06, z1 - 0.06]) cyl(bb, ink, x, 0.03, z - 0.012, 0.03, 0.03, 0.024, 12, new THREE.Euler(Math.PI / 2, 0, 0));
    // card stands (wire easels)
    for (let i = 0; i < 4; i++) { const x = x0 + 0.17 + i * 0.27; slab(bb, ink, x, SY + 0.05, z1 - 0.18, 0.012, 0.11, 0.006, 0, -0.35); }
  };
  const [sx0, sx1, sz0, sz1] = MK.stall;
  stallInto(b, sx0, sx1, sz0, sz1, false);
  stool(b, MK.seller[0], MK.seller[1]);
  // the coin tin
  cyl(b, C("#8a93a8"), MK.tin[0], SY, MK.tin[2], 0.07, 0.07, 0.045, 20); cyl(b, C("#c99a2a"), MK.tin[0], SY + 0.04, MK.tin[2], 0.06, 0.06, 0.004, 20);
  // other stalls far off, lamps, bunting
  for (const x of [-3.4, 3.0]) { box(b, C("#9a6a40"), x - 0.5, 0, -2.9, x + 0.5, 0.8, -2.4); for (let i = 0; i < 4; i++) box(b, C(["#e2433b", "#f2c84a", "#3f6fd8", "#5aa64a"][i]), x - 0.45 + i * 0.23, 0.8, -2.85, x - 0.27 + i * 0.23, 1.0 + 0.06 * (i % 2), -2.5); }
  for (const z of [-1.8, 1.0, 3.2]) for (const x of [-3.98, 3.98]) { const s2 = Math.sign(x); box(b, C(["#e2433b", "#3f6fd8", "#f2c84a"][Math.abs(Math.round(z)) % 3]), x - (s2 > 0 ? 0.02 : 0), 1.3, z - 0.45, x + (s2 < 0 ? 0.02 : 0), 2.0, z + 0.45); }
  for (let i = 0; i < 12; i++) { const x = -3.6 + i * 0.65; box(b, C(["#e2433b", "#f2c84a", "#3f6fd8", "#5aa64a"][i % 4]), x, 2.9, -2.95 + 0.002 * i, x + 0.3, 3.1, -2.92 + 0.002 * i); }
  for (const x of [-2.0, 0, 2.0]) { cyl(b, ink, x, 3.0, -0.8, 0.006, 0.006, 0.6, 6); }
  b.build(market);
  for (const x of [-2.0, 0, 2.0]) mesh(new THREE.SphereGeometry(0.09, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.9, 1.1) }), market, x, 2.95, -0.8).castShadow = false;
  const cardFace = (parent: THREE.Object3D, nm: string, x: number, y: number, z: number) => { const m = mesh(new THREE.PlaneGeometry(0.1, 0.14), new THREE.MeshBasicMaterial({ map: cardTexture(nm), transparent: true, alphaTest: 0.5, color: new THREE.Color(0.95, 0.95, 0.95) }), parent, x, y, z); m.rotation.x = -0.35; return m; };
  const STALL_CARDS = ["zard151", "pika151", "mtg_bolt", "mtg_serra"];
  STALL_CARDS.forEach((nm, i) => cardFace(market, nm, sx0 + 0.17 + i * 0.27, SY + 0.1, sz1 - 0.16));
  plane(0.9, 0.22, basicC(signTex("myStall", 900, 220, "SẠP CỦA BẠN", "#fbf7ec", "#c23a32", "", "#c23a32")), market, (sx0 + sx1) / 2, 1.95, sz0 + 0.075);
  // the twin stall (own group, rolls along x)
  const twin = new THREE.Group(); market.add(twin);
  { const tb = new Batch(), w = MK.twin_w, z0 = sz0, z1 = sz1; SETL = "twin"; stallInto(tb, -w / 2, w / 2, z0, z1, true); tb.build(twin); SETL = "market";
    STALL_CARDS.forEach((nm, i) => cardFace(twin, nm, -w / 2 + 0.17 + i * 0.27, SY + 0.1, z1 - 0.16));
    plane(0.9, 0.22, basicC(signTex("twinStall", 900, 220, "BAN QUẢN LÝ", "#1d2a44", "#ffffff")), twin, 0, 1.95, z0 + 0.075); }
  const scale = new THREE.Group(); market.add(scale);
  { const brass = C("#c9a24a"); mesh(new THREE.BoxGeometry(0.12, 0.02, 0.08), brass, scale, 0, 0.01, 0); mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06), brass, scale, 0, 0.05, 0);
    mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.012, 20), brass, scale, 0, 0.085, 0); mesh(new THREE.BoxGeometry(0.05, 0.025, 0.004), C("#fbf7ec"), scale, 0, 0.035, 0.042); }
  const mkCoins = Array.from({ length: 3 }, () => mesh(coinGeo, coinM, market));
  const bag = new THREE.Group(); market.add(bag);
  { const m = mesh(new THREE.SphereGeometry(0.11, 16, 12), lamC(ctex("bagFace", 256, 256, (g) => sackFace(new Pen(g)))), bag, 0, 0, 0); m.scale.set(1, 1.15, 0.8); mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.05, 12), C("#a07a4a"), bag, 0, 0.13, 0); }

  // ===== THE SHOP =====
  SETL = "shop";
  const SPp = SHP, shop = G("shop", ORIGIN.shop);
  shell(shop, 2.4, 2.4, 2.7, lam("shopFloor", () => ({ map: rep(woodTex("shop", "#a07850", "rgba(60,35,20,0.45)"), 3, 3) })), lam("shopWall", () => ({ map: paintWall("shop", "#e9c9a0") })), "#f4ead6");
  b = new Batch();
  const [cx0, cx1, cz0, cz1] = SPp.counter, CY = SPp.counter_y;
  box(b, C("#6a4428"), cx0, 0, cz0, cx1, CY - 0.25, cz1); box(b, C("#2a2c33"), cx0, CY - 0.25, cz0, cx1, CY - 0.22, cz1);
  for (const x of [cx0, cx1 - 0.03]) box(b, C("#6a4428"), x, CY - 0.22, cz0, x + 0.03, CY, cz1);
  for (let i = 0; i < 7; i++) box(b, C(["#2f5fb4", "#c23a32", "#e7a43a", "#2f9a55"][i % 4]), cx0 + 0.1 + i * 0.26, CY - 0.22, cz0 + 0.12, cx0 + 0.3 + i * 0.26, CY - 0.17, cz1 - 0.12);
  for (const y of [0.9, 1.4]) box(b, C("#e9e4d6"), -2.2, y - 0.02, -2.38, 2.2, y, -2.08);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 14; i++) { const x = -2.15 + i * 0.31, y = 0.9 + r * 0.5; box(b, C(stockCols[(i + r) % 6]), x, y, -2.33, x + 0.25, y + 0.3, -2.12); }
  b.build(shop);
  { const gl = mesh(new THREE.BoxGeometry(cx1 - cx0 - 0.06, 0.006, cz1 - cz0 - 0.02), glassMat(), shop, (cx0 + cx1) / 2, CY - 0.003, (cz0 + cz1) / 2); gl.renderOrder = 3; }
  plane(1.8, 0.4, basicC(signTex("shopSign", 1080, 240, "CARD SHOP", "#1d2a44", "#f2c84a", "SOUTH DAKOTA")), shop, SPp.sign[0], SPp.sign[1], SPp.sign[2]);
  frameCard(shop, "pika151", -2.37, 1.85, -0.9, 0.46, Math.PI / 2); frameCard(shop, "mtg_bolt", -2.37, 1.85, 0.0, 0.46, Math.PI / 2); frameCard(shop, "zard151", 2.37, 1.85, -0.5, 0.46, -Math.PI / 2);
  const phone = canvasMat(300, 620);
  const phoneMesh = new THREE.Group(); shop.add(phoneMesh);
  mesh(new THREE.BoxGeometry(0.075, 0.155, 0.008), ink, phoneMesh);
  plane(0.071, 0.147, basicC(phone.tex), phoneMesh, 0, 0, 0.0046);

  // ===== THE BOARDROOM =====
  SETL = "board";
  const BD = BDP, boardroom = G("board", ORIGIN.board);
  shell(boardroom, 2.5, 3.5, 3.0, lam("bdFloor", () => ({ map: rep(carpetT("bd", "#2f7a4a"), 4, 4) })), lam("bdWall", () => ({ map: paintWall("bd", "#f2e2bf") })), "#fbf4e4");
  b = new Batch();
  const [bx_0, bx_1, bz_0, bz_1] = BD.table, BY = BD.table_y;
  box(b, C("#a8703f"), bx_0, BY - 0.05, bz_0, bx_1, BY, bz_1); box(b, C("#7a4a28"), bx_0 + 0.25, 0, bz_0 + 0.3, bx_1 - 0.25, BY - 0.05, bz_1 - 0.3);
  const leather = C("#9a2a2a");
  const bchair = (x: number, z: number, bdx: number, bdz: number) => { // (bdx, bdz): the side the back stands on
    box(b, leather, x - 0.25, 0.44, z - 0.25, x + 0.25, 0.52, z + 0.25);
    if (bdz) box(b, leather, x - 0.25, 0.52, z + bdz * 0.3 - 0.04, x + 0.25, 1.3, z + bdz * 0.3 + 0.04); else box(b, leather, x + bdx * 0.3 - 0.04, 0.52, z - 0.25, x + bdx * 0.3 + 0.04, 1.3, z + 0.25);
    cyl(b, ink, x, 0, z, 0.03, 0.03, 0.44, 8); };
  bchair(BD.ron[0], BD.ron[1], 0, -1);
  for (const [vx, vz] of BD.vips) bchair(vx, vz, vx < 0 ? -1 : 1, 0);
  box(b, C("#a8703f"), -2.5, 0, -3.5, 2.5, 1.0, -3.47); for (const x of [-2.5, 2.47]) box(b, C("#a8703f"), x, 0, -3.47, x + 0.03, 1.0, 3.0);
  windowOn(b, boardroom, "x", 2.5, -1, -0.8, 1.0, 2.4, 1.6, cloudSky("bd"), white); windowOn(b, boardroom, "x", -2.5, 1, -0.8, 1.0, 2.4, 1.6, cloudSky("bd2"), white);
  for (const [x, z] of [[-2.1, -3.1], [2.1, -3.1]]) { cyl(b, C("#c9744a"), x, 0, z, 0.2, 0.24, 0.44, 14); sph(b, C("#4fa548"), x, 0.8, z, 0.36); }
  for (const x of [-1.2, 0, 1.2]) box(b, lam("bdPanel", () => ({ color: "#ffffff", emissive: "#8a7a68" })), x - 0.35, 2.96, -2.2, x + 0.35, 2.995, -1.4);
  box(b, steel, BD.board[0] - 0.75, BD.board[1] - 0.55, -3.5, BD.board[0] + 0.75, BD.board[1] + 0.55, BD.board[2] + 0.02);
  b.build(boardroom);
  frameCard(boardroom, "blast151", -1.6, 1.9, -3.46, 0.5); frameCard(boardroom, "venu151", 1.6, 1.9, -3.46, 0.5);
  const board2 = canvasMat(1024, 732);
  plane(1.4, 1.0, basicC(board2.tex), boardroom, BD.board[0], BD.board[1], BD.board[2] + 0.036).castShadow = false;
  const sack = new THREE.Group(); boardroom.add(sack);
  { const m = mesh(new THREE.SphereGeometry(0.2, 18, 14), lamC(ctex("sackFace", 256, 256, (g) => sackFace(new Pen(g)))), sack, 0, 0.2, 0); m.scale.set(1, 1.1, 0.85); mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.09, 14), C("#a07a4a"), sack, 0, 0.44, 0); }

  // shells and fittings: transparent things draw no ink and cast no shadow
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } else m.receiveShadow = true; });
  for (const o of [...homeCoins, plate, cakeBox, lever, nameG, cake, ...boxes, scale, twin, ...mkCoins, bag, phoneMesh, sack]) o.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh && !(m.material as THREE.Material).transparent) { m.castShadow = true; m.receiveShadow = true; } });
  void quad; void tri; void boxGeo; void untone; void local; void sph; void obj; void M; void sign; void bush; void palm; void lamp; void car; void wheels; void stucco; void grassHD; void planksHD; void roofHD; void beam; void brick; void water; void stoneHD;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, laptop, tv, bot, env, homeCoins, plate, cakeBox, board, win, name, nameG, letter, prog, lever, cake, slice, shutter, boxes, scale, twin, mkCoins, bag, phone, phoneMesh, board2, sack };
};
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
