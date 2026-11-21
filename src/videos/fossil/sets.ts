// The sets of the Fossil sheet reel, built once (static scenery batched per material) plus the moving pieces as their own objects.
// People and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// The hero prop is the sheet rig: one deformable mesh (roll, end curl, corner fold) with a front, a back and a holo gleam layer.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { sheetFront, sheetBack, gleamBand, wallpaper, calendar, tvNews, lotBoard, kbSign, promoHeader, report, toyBox, SHW, SHH } from "./art2";
import { HOUSE, AUC, STORE, PRESS, V3, obj, ORIGIN, H, AU, STO, PR, SHEET, CEIL, LOFT } from "./story";

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
const ceiling = (parent: THREE.Object3D, x0: number, x1: number, z0: number, z1: number, y: number, col: string) => {
  const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lam("tt" + col, () => ({ color: col }))); c.rotation.x = Math.PI / 2;
  c.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); c.castShadow = false; c.receiveShadow = false; parent.add(c); return c;
};

// ---------------- the sheet rig ----------------
/** one uncut sheet: a 72 x 102 cm mesh (x across, z down the sheet, top row at -z, front face +y) that rolls up from its
 *  bottom edge into a tube (front inside, the back outside), curls at its bottom end, and folds at its top-left corner */
export type SheetRig = { g: THREE.Group; geo: THREE.BufferGeometry; base: Float32Array; front: THREE.Mesh; back: THREE.Mesh; gleam: THREE.Mesh; gtex: THREE.Texture;
  band: THREE.Mesh; mats: { front: THREE.MeshLambertMaterial; back: THREE.MeshLambertMaterial }; key: string };
export type SheetPose = { a: number; curl?: number; fold?: number; wreck?: boolean; gleam?: number; band?: boolean; dust?: number };
export const SL = 1.02, SW = 0.72, R0 = SHEET.tube_r;
let TEX: Record<string, THREE.Texture> | null = null;
const sheetTex = () => {
  if (TEX) return TEX;
  const mk = (key: string, draw: (g: CanvasRenderingContext2D) => void) => { const t = ctex(key, SHW, SHH, (g) => draw(g)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  TEX = { front: mk("sheetF", (g) => sheetFront(g, false)), frontW: mk("sheetFW", (g) => sheetFront(g, true)), back: mk("sheetB", (g) => sheetBack(g, false)), backW: mk("sheetBW", (g) => sheetBack(g, true)) };
  return TEX;
};
const makeSheet = (parent: THREE.Object3D): SheetRig => {
  const T = sheetTex(), g = new THREE.Group(); parent.add(g);
  const geo = new THREE.PlaneGeometry(SW, SL, 24, 72); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute, base = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) { base[2 * i] = pos.getX(i); base[2 * i + 1] = pos.getZ(i); }
  const front = new THREE.MeshLambertMaterial({ map: T.front, alphaTest: 0.5, side: THREE.FrontSide });
  const back = new THREE.MeshLambertMaterial({ map: T.back, alphaTest: 0.5, side: THREE.BackSide });
  const fm = new THREE.Mesh(geo, front), bm = new THREE.Mesh(geo, back); g.add(fm, bm);
  const gtex = ctex("gleamBand", 512, 64, (gg) => gleamBand(gg)).clone(); gtex.wrapS = gtex.wrapT = THREE.ClampToEdgeWrapping; gtex.center.set(0.5, 0.5); gtex.rotation = 0.55; gtex.needsUpdate = true;
  const gm = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: gtex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4, toneMapped: false }));
  gm.layers.set(NOINK); gm.renderOrder = 3; gm.visible = false; g.add(gm);
  const band = new THREE.Mesh(new THREE.TorusGeometry(R0 + 0.002, 0.0035, 6, 28), lam("band", () => ({ color: "#c0453a" }))); band.rotation.y = Math.PI / 2; g.add(band);
  for (const m of [fm, bm]) { m.castShadow = true; m.receiveShadow = true; }
  return { g, geo, base, front: fm, back: bm, gleam: gm, gtex, band, mats: { front, back }, key: "" };
};
/** pose a sheet: a = unrolled length (0 = a tube lying at the top edge, SL = flat), curl 0..1 at the bottom end, fold (rad) of the
 *  top-left corner; the tube's centre is at z = a - SL/2, y = R0 */
export const poseSheet = (r: SheetRig, o: SheetPose) => {
  const T = sheetTex(), key = [o.a.toFixed(4), (o.curl ?? 0).toFixed(3), (o.fold ?? 0).toFixed(3)].join("|");
  r.mats.front.map = o.wreck ? T.frontW : T.front; r.mats.back.map = o.wreck ? T.backW : T.back;
  const d = o.dust ?? 0; r.mats.back.color.setRGB(1 - 0.35 * d, 1 - 0.37 * d, 1 - 0.42 * d); r.mats.front.color.setRGB(1 - 0.2 * d, 1 - 0.2 * d, 1 - 0.22 * d);
  r.band.visible = !!o.band; r.band.position.set(0, R0, o.a - SL / 2);
  const gl = o.gleam ?? -1; r.gleam.visible = gl > 0 && gl < 1; if (r.gleam.visible) { r.gtex.offset.x = 0.75 - 1.5 * gl; }
  if (key === r.key) return; r.key = key;
  const P = r.geo.attributes.position as THREE.BufferAttribute, a = Math.max(0, Math.min(SL, o.a)), c = o.curl ?? 0, fold = o.fold ?? 0;
  const zr = a - SL / 2, rc = 0.07 / Math.max(c, 1e-3), s0 = SL - 0.22, D = 0.2, k = Math.SQRT1_2;
  for (let i = 0; i < P.count; i++) {
    const x = r.base[2 * i], z = r.base[2 * i + 1], s = z + SL / 2;
    let Y = 0, Z = z, X = x;
    if (s > a) { // wound on the tube: radius shrinks 4 mm a turn so the turns never touch
      const th = (s - a) / R0, rr2 = R0 - 0.004 * (th / (2 * Math.PI)); Z = zr + rr2 * Math.sin(th); Y = R0 - rr2 * Math.cos(th);
    } else if (a >= SL - 1e-4 && s > s0 && c > 0) { const th = (s - s0) / rc; Z = s0 - SL / 2 + rc * Math.sin(th); Y = rc * (1 - Math.cos(th)); }
    if (fold && s <= a) { const u = x + SW / 2 + (z + SL / 2); if (u < D) { const w = (D - u) * k; X = x + w * k - w * Math.cos(fold) * k; Z = Z + w * k - w * Math.cos(fold) * k; Y += w * Math.sin(fold); } }
    P.setXYZ(i, X, Y + 0.0015, Z);
  }
  P.needsUpdate = true; r.geo.computeVertexNormals(); r.geo.computeBoundingSphere();
};

export type Sets = {
  groups: Record<string, THREE.Group>;
  hero: SheetRig; easel: SheetRig; promo: SheetRig; press: SheetRig; press2: SheetRig;
  door: THREE.Group; cord: THREE.Mesh; fanBlade: THREE.Group; tin: THREE.Group; ladder: THREE.Group;
  cal: Canvas; tv: Canvas; board: Canvas; report: Canvas; dust: THREE.Mesh; dustClean: THREE.Mesh;
  blade: THREE.Group; rollers: THREE.Mesh[]; strip: THREE.Mesh; lampOn: THREE.Mesh; flashes: THREE.Mesh[]; web: THREE.Group; toy: THREE.Group;
};

const canvasOf = (w: number, h: number): Canvas => { const c = canvasMat(w, h); return c; };
export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const white = C("#f3f1ec"), oak = C("#8a5a34"), dark = C("#2a2c33"), steel = C("#9aa3ad"), red = C("#d8322f");
  const wallp = lam("wallp", () => ({ map: ctex("wallpaper", 512, 512, (g) => wallpaper(g)) }));
  const carpetM = lam("carpetL", () => ({ map: ctex("carpetL", 256, 256, (g, r) => { g.fillStyle = "#8a7a9c"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"; g.fillRect(r() * 256, r() * 256, 3, 3); } }) }));
  const boards = lam("boards", () => ({ map: planksHD() }));
  const [hx0, hx1] = H.hatch_x, [hz0, hz1] = H.hatch_z;

  // ===== LANDING =====
  SETL = "landing";
  const land = G("landing", HOUSE);
  let b = new Batch();
  up(b, carpetM, -1.3, 1.3, -3, 3, 0, 1);
  const wall = (x0: number, x1: number, z0: number, z1: number, y1 = CEIL) => { box(b, white, x0, 0, z0, x1, 0.1, z1); box(b, wallp, x0, 0.1, z0, x1, y1, z1, 0.378); };
  wall(-1.3, 1.3, -3.15, -3); wall(-1.3, 1.3, 3, 3.15); wall(1.3, 1.45, -3, 3);
  // left wall with the doorway (z 1.2..2.0, 2.0 m high) into the living room
  wall(-1.45, -1.3, -3, 1.2); wall(-1.45, -1.3, 2.0, 3); box(b, wallp, -1.45, 2.0, 1.2, -1.3, CEIL, 2.0, 0.378);
  box(b, white, -1.47, 0, 1.14, -1.28, 2.06, 1.2); box(b, white, -1.47, 0, 2.0, -1.28, 2.06, 2.06); box(b, white, -1.47, 2.0, 1.2, -1.28, 2.06, 2.0);
  // radiator on the right wall
  box(b, C("#eef0f2"), 1.2, 0.2, -2.4, 1.29, 0.8, -1.4);
  // ceiling: plaster around the hatch opening, the hatch lip
  for (const [x0, x1, z0, z1] of [[-1.3, 1.3, -3, hz0], [-1.3, 1.3, hz1, 3], [-1.3, hx0, hz0, hz1], [hx1, 1.3, hz0, hz1]]) ceiling(land, x0, x1, z0, z1, CEIL, "#f2eee4");
  box(b, white, hx0 - 0.04, CEIL - 0.03, hz0 - 0.04, hx0, LOFT, hz1 + 0.04); box(b, white, hx1, CEIL - 0.03, hz0 - 0.04, hx1 + 0.04, LOFT, hz1 + 0.04);
  box(b, white, hx0, CEIL - 0.03, hz0 - 0.04, hx1, LOFT, hz0); box(b, white, hx0, CEIL - 0.03, hz1, hx1, LOFT, hz1 + 0.04);
  // the bin bag and the KHO box
  sph(b, C("#1d1b22"), H.bag[0], 0.26, H.bag[2], 0.27, 1.05); sph(b, C("#1d1b22"), H.bag[0] - 0.05, 0.5, H.bag[2] + 0.03, 0.14, 0.8);
  box(b, lam("kho", () => ({ map: ctex("kho", 256, 256, (g) => { g.fillStyle = "#c99a62"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#3a2a22"; g.font = "900 90px Arial"; g.textAlign = "center"; g.fillText("KHO", 128, 160); }) })), 0.75, 0, -2.85, 1.25, 0.45, -2.45);
  // living room through the doorway: floor, walls, sofa, TV cabinet
  up(b, lam("lvfloor", () => ({ map: planksHD() })), -5, -1.45, -0.5, 3, 0, 1.2);
  box(b, C("#c7d8cf"), -5.15, 0, -0.5, -5, CEIL, 3); box(b, C("#c7d8cf"), -5, 0, -0.65, -1.45, CEIL, -0.5); box(b, C("#c7d8cf"), -5, 0, 3, -1.45, CEIL, 3.15);
  ceiling(land, -5, -1.45, -0.5, 3, CEIL, "#f2eee4");
  box(b, C("#7a5a3a"), -4.95, 0, 1.0, -4.6, 0.5, 2.2);
  box(b, C("#4a6a8a"), -3.4, 0, -0.45, -2.6, 0.45, 0.85); box(b, C("#4a6a8a"), -3.4, 0.45, -0.45, -3.15, 0.85, 0.85);
  b.build(land);
  // the TV (screen canvas redrawn per frame)
  const tv = canvasOf(600, 360); const tvM = new THREE.MeshBasicMaterial({ map: tv.tex });
  { const t = new THREE.Group(); land.add(t); t.position.set(H.tv[0], H.tv[1], H.tv[2]); t.rotation.y = Math.PI / 2;
    mesh(new THREE.BoxGeometry(1.06, 0.66, 0.05), C("#1d1b22"), t, 0, 0, -0.03); mesh(new THREE.PlaneGeometry(1.0, 0.6), tvM, t, 0, 0, 0.002); }
  // the stepladder: two front legs, two back legs, four steps, a cap
  const ladder = new THREE.Group(); land.add(ladder); ladder.position.set(H.ladder[0], 0, H.ladder[1]);
  { const lb = new Batch(), wd = C("#b98e62"); SETL = "ladder";
    for (const sx of [-0.22, 0.22]) { slab(lb, wd, sx, 0.625, -0.05, 0.04, 1.28, 0.03, 0, -0.42); slab(lb, wd, sx * 0.95, 0.6, -0.42, 0.035, 1.24, 0.03, 0, 0.36); }
    for (let i = 0; i < 4; i++) { const y = 0.18 + i * 0.174, z = 0.2 - 0.53 * (y / 1.25); box(lb, wd, -0.24, y - 0.02, z - 0.14, 0.24, y, z + 0.0); }
    box(lb, wd, -0.2, 1.22, -0.3, 0.2, 1.26, -0.12); lb.build(ladder); SETL = "landing"; }
  // the hatch door: hinged along x = hx0 at the lip top; a pull cord hangs from its free edge
  const door = new THREE.Group(); land.add(door); door.position.set(hx0, LOFT + 0.003, (hz0 + hz1) / 2);
  mesh(new THREE.BoxGeometry(hx1 - hx0 + 0.06, 0.02, hz1 - hz0 + 0.06), [C("#b98e62"), C("#b98e62"), C("#b98e62"), white, C("#b98e62"), C("#b98e62")], door, (hx1 - hx0) / 2, 0.01, 0);
  const cord = mesh(new THREE.CylinderGeometry(0.004, 0.004, 1, 6), C("#e9e2cf"), land, 0, 0, 0);

  // ===== LOFT =====
  SETL = "loft";
  const loft = G("loft", HOUSE);
  b = new Batch();
  for (const [x0, x1, z0, z1] of [[-2.6, 2.6, -3.6, hz0], [-2.6, 2.6, hz1, 2.4], [-2.6, hx0, hz0, hz1], [hx1, 2.6, hz0, hz1]]) box(b, boards, x0, CEIL + 0.012, z0, x1, LOFT, z1, 1.2);
  // roof: two slopes of felt between rafters, the ridge, gables
  const RID = 4.4, KN = LOFT + 0.28, felt = lam("felt", () => ({ color: "#5a4a44", side: THREE.DoubleSide })), raf = C("#a8784a");
  const slope = Math.atan2(RID - KN, 2.6), sl = Math.hypot(2.6, RID - KN);
  for (const sd of [-1, 1]) {
    slab(b, felt, sd * 1.3, (RID + KN) / 2 + 0.04, -0.6, sl + 0.05, 0.02, 6.0, sd * -slope);
    for (let z = -3.5; z <= 2.3; z += 0.45) slab(b, raf, sd * 1.3, (RID + KN) / 2 - 0.03, z, sl, 0.1, 0.05, sd * -slope);
    box(b, C("#6e5a4a"), sd > 0 ? 2.55 : -2.65, LOFT, -3.6, sd > 0 ? 2.65 : -2.55, KN, 2.4);
  }
  box(b, raf, -0.06, RID - 0.1, -3.6, 0.06, RID + 0.02, 2.4);
  const gable = C("#7a6a5a");
  for (const z of [-3.66, 2.4]) for (let i = 0; i < 6; i++) { const y0 = LOFT + i * 0.32, y1 = y0 + 0.32, hw = 2.6 * (1 - Math.max(0, (y1 - KN) / (RID - KN))); if (y0 < RID) box(b, gable, -Math.max(0.05, hw), y0, z, Math.max(0.05, hw), Math.min(y1, RID), z + 0.06); }
  // the post with the calendar and the scissors' nail
  box(b, raf, H.post[0] - 0.045, LOFT, H.post[1] - 0.045, H.post[0] + 0.045, RID - 0.1, H.post[1] + 0.045);
  // the lights box: open cardboard box with lights spilling
  const L0 = H.lights, cb = lam("cbox", () => ({ map: ctex("cbox", 256, 256, (g, r) => { g.fillStyle = "#c99a62"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(90,60,30,0.2)"; for (let i = 0; i < 20; i++) g.fillRect(r() * 256, r() * 256, 40, 3); }) }));
  box(b, cb, L0[0] - 0.19, LOFT, L0[2] - 0.14, L0[0] + 0.19, LOFT + 0.22, L0[2] + 0.14);
  slab(b, cb, L0[0], LOFT + 0.25, L0[2] + 0.19, 0.38, 0.005, 0.12, 0, -0.9); slab(b, cb, L0[0] - 0.23, LOFT + 0.26, L0[2], 0.12, 0.005, 0.28, 0.9, 0);
  for (let i = 0; i < 7; i++) sph(b, C(["#e2453c", "#5aa64a", "#2f6fc4", "#ffd23a"][i % 4]), L0[0] - 0.12 + i * 0.04, LOFT + 0.225 + 0.01 * Math.sin(i), L0[2] + 0.02 * Math.cos(i * 2), 0.012, 1.4);
  // the empty frame leaning on the box
  { const F = H.frame, gm = C("#c9a24a"), lean = -0.18; for (const [dx, dy, w, h] of [[0, 0.02, 0.36, 0.04], [0, 0.28, 0.36, 0.04], [-0.16, 0.15, 0.04, 0.3], [0.16, 0.15, 0.04, 0.3]]) slab(b, gm, F[0] + dx, F[1] + dy * Math.cos(lean), F[2] + 0.06 - dy * Math.sin(-lean), w, h, 0.025, 0, lean); }
  // suitcase, lampshade
  box(b, C("#7a3a2a"), -1.15, LOFT, -2.6, -0.55, LOFT + 0.42, -2.4); box(b, C("#c9a24a"), -0.9, LOFT + 0.42, -2.52, -0.8, LOFT + 0.47, -2.48);
  cyl(b, C("#e8dcc0"), 1.0, LOFT, -2.4, 0.2, 0.12, 0.28, 16);
  // the fan: base, pole, motor, cage rings and bars, hub
  { const F = H.fan, gr = C("#d9dde0"), dk = C("#5b6170"), cy0 = H.fan_cage[1];
    cyl(b, dk, F[0], LOFT, F[2], 0.16, 0.14, 0.04, 20); cyl(b, gr, F[0], LOFT + 0.04, F[2], 0.016, 0.016, cy0 - LOFT - 0.1, 10);
    cyl(b, dk, F[0], cy0 - 0.08, F[2] - 0.06, 0.07, 0.07, 0.14, 14, new THREE.Euler(Math.PI / 2, 0, 0));
    const ring = (rad: number, z: number) => { const t = new THREE.TorusGeometry(rad, 0.005, 6, 36); b.add(t, gr, new THREE.Matrix4().makeTranslation(F[0], cy0, F[2] + z)); };
    ring(0.2, 0.05); ring(0.2, -0.05); ring(0.08, 0.075);
    for (let i = 0; i < 16; i++) { if (i === 3) continue; const a = (i / 16) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a); slab(b, gr, F[0] + ca * 0.14, cy0 + sa * 0.14, F[2] + 0.06, 0.004, 0.13, 0.004, a - Math.PI / 2, 0); }
    for (let i = 0; i < 2; i++) { const a = 0.6 + i * 2.1; slab(b, C("#c9d6e2"), F[0] + Math.cos(a) * 0.09, cy0 + Math.sin(a) * 0.09, F[2], 0.15, 0.06, 0.006, a, 0.3); }
    sph(b, dk, F[0], cy0, F[2] + 0.01, 0.03, 0.6); }
  // the gable window and its glow
  box(b, raf, 0.08, 3.28, -3.6, 0.62, 3.32, -3.54); box(b, raf, 0.08, 3.68, -3.6, 0.62, 3.72, -3.54);
  b.build(loft);
  mesh(new THREE.PlaneGeometry(0.5, 0.36), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.45, 1.7) }), loft, 0.35, 3.5, -3.595);
  ceiling(loft, -2.6, 2.6, -3.6, 2.4, RID + 0.06, "#3a302c");
  // the loose blade (pendulum on the hub pin, drops in S20)
  const fanBlade = new THREE.Group(); loft.add(fanBlade); fanBlade.position.set(H.fan[0], H.fan_cage[1], H.fan[2] + 0.02);
  mesh(new THREE.BoxGeometry(0.06, 0.16, 0.006), C("#c9d6e2"), fanBlade, 0, -0.1, 0);
  // the calendar (canvas: the year flips)
  const cal = canvasOf(260, 360); mesh(new THREE.PlaneGeometry(0.26, 0.36), new THREE.MeshLambertMaterial({ map: cal.tex, transparent: true, alphaTest: 0.3 }), loft, H.calendar[0], H.calendar[1], H.post[1] + 0.047);
  // the rusty scissors on their nail (open blades)
  { const sc = new THREE.Group(); loft.add(sc); sc.position.set(H.scissors[0], H.scissors[1], H.post[1] + 0.05);
    const rust = C("#8a4a2a"); for (const sd of [-1, 1]) { mesh(new THREE.BoxGeometry(0.012, 0.12, 0.004), rust, sc, sd * 0.02, -0.06, 0).rotation.z = sd * 0.25; mesh(new THREE.TorusGeometry(0.018, 0.004, 6, 14), rust, sc, sd * 0.03, 0.02, 0); } }
  // dust on the boards (opacity grows), and the clean stripe left by the tube
  const dustTex = (stripe: boolean) => ctex("loftDust" + stripe, 512, 512, (g, r) => {
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(214,206,190,${0.15 + 0.3 * r()})`; g.fillRect(r() * 512, r() * 512, 2 + 4 * r(), 2 + 4 * r()); }
    if (stripe) { const [x, y] = [(H.tube[0] + 1.0) / 2.0 * 512, (H.tube[2] + 2.6) / 2.0 * 512]; g.clearRect(x - 92, y - 9, 184, 18); }
  });
  const dustP = (stripe: boolean) => { const m = mesh(new THREE.PlaneGeometry(2.0, 2.0), new THREE.MeshBasicMaterial({ map: dustTex(stripe), transparent: true, depthWrite: false, opacity: 0, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }), loft, 0, LOFT + 0.001, -1.6); m.rotation.x = -Math.PI / 2; m.layers.set(NOINK); return m; };
  const dust = dustP(false), dustClean = dustP(true);
  // the cobweb between the fan and the box (a flat web card in the world, grows)
  const web = new THREE.Group(); loft.add(web); web.position.set(H.tube[0] + 0.12, LOFT + 0.12, H.tube[2] - 0.02);

  // ===== AUCTION HOUSE =====
  SETL = "auction";
  const auc = G("auction", AUC);
  b = new Batch();
  up(b, lam("aucfloor", () => ({ map: planksHD() })), -5, 5, -5, 4, 0, 1.4);
  const sage = lam("sage", () => ({ map: rep(stucco("sage", "#b9c9b0"), 1, 1) }));
  const wallA = (x0: number, x1: number, z0: number, z1: number) => { box(b, white, x0, 0, z0, x1, 0.12, z1); box(b, sage, x0, 0.12, z0, x1, 3.4, z1, 3); };
  wallA(-5, 5, -5.15, -5); wallA(-5.15, -5, -5, 4); wallA(5, 5.15, -5, 4); wallA(-5, 5, 4, 4.15);
  ceiling(auc, -5, 5, -5, 4, 3.4, "#f3f0e8");
  // the counter: table, baize, lamp
  { const [tx, tz] = AU.table, [tw, td] = AU.table_size, T = AU.top;
    box(b, oak, tx - tw / 2, T - 0.05, tz - td / 2, tx + tw / 2, T - 0.01, tz + td / 2);
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(b, oak, tx + dx * (tw / 2 - 0.06) - 0.03, 0, tz + dz * (td / 2 - 0.06) - 0.03, tx + dx * (tw / 2 - 0.06) + 0.03, T - 0.05, tz + dz * (td / 2 - 0.06) + 0.03);
    box(b, C("#2f6a4a"), tx - 0.6, T - 0.01, tz - 0.56, tx + 0.6, T + 0.002, tz + 0.56);
    const lp = AU.lamp; cyl(b, dark, lp[0], T + 0.002, lp[2], 0.08, 0.08, 0.02, 16); cyl(b, dark, lp[0], T + 0.02, lp[2], 0.01, 0.01, 0.38, 8); }
  const lampOn = mesh(new THREE.ConeGeometry(0.1, 0.12, 18, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.85, 0.55), side: THREE.DoubleSide }), auc, AU.lamp[0] + 0.08, AU.top + 0.42, AU.lamp[2] + 0.05);
  lampOn.rotation.z = 0.5;
  // photo corner: easel, softboxes, tripod camera, rope, report stand
  { const E = AU.easel; for (const sd of [-1, 1]) slab(b, oak, E[0] + sd * 0.32, 0.95, E[2] - 0.03, 0.04, 1.9, 0.04, sd * 0.06, 0); slab(b, oak, E[0], 0.92, E[2] - 0.35, 0.04, 1.9, 0.04, 0, -0.35);
    box(b, oak, E[0] - 0.4, 0.8, E[2] - 0.02, E[0] + 0.4, 0.84, E[2] + 0.06);
    for (const [sx, sz] of AU.soft) { cyl(b, dark, sx, 0, sz, 0.015, 0.015, 1.7, 8); }
    const [px, pz] = AU.tripod; for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; slab(b, dark, px + 0.12 * Math.cos(a), 0.55, pz + 0.12 * Math.sin(a), 0.02, 1.12, 0.02, 0.2 * Math.cos(a), -0.2 * Math.sin(a)); }
    box(b, dark, px - 0.08, 1.1, pz - 0.06, px + 0.08, 1.2, pz + 0.06); cyl(b, C("#3a3f4a"), px, 1.15, pz - 0.06, 0.035, 0.035, 0.09, 14, new THREE.Euler(-Math.PI / 2, 0, 0));
    for (const [rx, rz] of AU.rope) { cyl(b, C("#c9a24a"), rx, 0, rz, 0.12, 0.12, 0.03, 16); cyl(b, C("#c9a24a"), rx, 0.03, rz, 0.02, 0.02, 0.9, 10); sph(b, C("#c9a24a"), rx, 0.95, rz, 0.04); }
    const [r0, r1] = AU.rope; for (let i = 0; i < 10; i++) { const u0 = i / 10, u1 = (i + 1) / 10, y0 = 0.9 - 0.18 * Math.sin(Math.PI * u0), y1 = 0.9 - 0.18 * Math.sin(Math.PI * u1); const a = V(r0[0] + (r1[0] - r0[0]) * u0, y0, r0[1]), c2 = V(r0[0] + (r1[0] - r0[0]) * u1, y1, r1[1]); const g2 = new THREE.CylinderGeometry(0.02, 0.02, a.distanceTo(c2), 8); g2.translate(0, a.distanceTo(c2) / 2, 0); b.add(g2, red, new THREE.Matrix4().compose(a, new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), c2.clone().sub(a).normalize()), V(1, 1, 1))); }
    const R = AU.report; cyl(b, dark, R[0], 0, R[2], 0.012, 0.012, R[1] - 0.15, 8); }
  const flashes = AU.soft.map(([sx, sz]) => { const m = mesh(new THREE.BoxGeometry(0.5, 0.6, 0.12), [C("#1d1b22"), C("#1d1b22"), C("#1d1b22"), C("#1d1b22"), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, 1.2, 1.15) }), C("#1d1b22")], auc, sx, 1.9, sz); m.lookAt(AUC[0] + AU.easel[0], 1.4, AUC[2] + AU.easel[2]); return m; });
  // saleroom: rostrum, chairs
  { const [rx, rz] = AU.rostrum; box(b, C("#6e4428"), rx - 0.45, 0, rz - 0.25, rx + 0.45, 1.15, rz + 0.25); box(b, oak, rx - 0.5, 1.15, rz - 0.3, rx + 0.5, 1.2, rz + 0.3);
    for (const [cx, cz] of AU.seats) { box(b, C("#7a4a2a"), cx - 0.21, 0.42, cz - 0.2, cx + 0.21, 0.46, cz + 0.2); for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(b, C("#5a3a22"), cx + dx * 0.18 - 0.015, 0, cz + dz * 0.17 - 0.015, cx + dx * 0.18 + 0.015, 0.42, cz + dz * 0.17 + 0.015); box(b, C("#5a3a22"), cx - 0.21, 0.46, cz + 0.17, cx + 0.21, 0.92, cz + 0.2); } }
  b.build(auc);
  const board = canvasOf(880, 380); mesh(new THREE.PlaneGeometry(2.2, 0.95), new THREE.MeshLambertMaterial({ map: board.tex }), auc, AU.board[0], AU.board[1], -4.995);
  const rep2 = canvasOf(300, 400); { const m = mesh(new THREE.PlaneGeometry(0.3, 0.4), new THREE.MeshLambertMaterial({ map: rep2.tex, alphaTest: 0.3 }), auc, AU.report[0], AU.report[1], AU.report[2]); m.rotation.x = -0.25; }

  // ===== STORE (1999) =====
  SETL = "store";
  const sto = G("store", STORE);
  b = new Batch();
  up(b, lam("chequer", () => ({ map: ctex("chequer", 256, 256, (g) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = (i + j) % 2 ? "#f2efe6" : "#c94a3c"; g.fillRect(i * 64, j * 64, 64, 64); } }) })), -3, 3, -4, 2.5, 0, 1.2);
  const yel = lam("storeWall", () => ({ map: rep(stucco("yel", "#f4d870"), 1, 1) }));
  for (const [x0, x1, z0, z1] of [[-3, 3, -4.15, -4], [-3.15, -3, -4, 2.5], [3, 3.15, -4, 2.5], [-3, 3, 2.5, 2.65]]) box(b, yel, x0, 0, z0, x1, 3, z1, 3);
  ceiling(sto, -3, 3, -4, 2.5, 3, "#f6f3ea");
  for (const z of [-3.2, -1.6, 0.0]) { mesh(new THREE.BoxGeometry(1.6, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.5, 1.4) }), sto, 0, 2.97, z); }
  // shelves of toy boxes
  const boxMats = [0, 1, 2, 3, 4].map((k) => lam("toy" + k, () => ({ map: ctex("toy" + k, 256, 256, (g) => toyBox(g, k)) })));
  for (let s = 0; s < 4; s++) { const y = 0.1 + s * 0.48; box(b, steel, -2.95, y - 0.03, -3.8, -2.55, y, 0.5);
    for (let i = 0; i < 9; i++) { const z0 = -3.75 + i * 0.47, hgt = 0.22 + 0.16 * ((i * 7 + s * 3) % 4) / 3; if (s === 3 && i === 4) continue; box(b, boxMats[(i + s * 2) % 5], -2.92, y, z0, -2.6, y + hgt, z0 + 0.4); } }
  box(b, steel, -2.97, 0, -3.82, -2.94, 2.0, 0.52);
  // counter + till
  { const [tx, tz] = STO.till; box(b, C("#2f6fc4"), tx - 0.7, 0, tz - 0.3, tx + 0.7, 1.0, tz + 0.3); box(b, dark, tx - 0.18, 1.0, tz - 0.15, tx + 0.18, 1.18, tz + 0.15); }
  // promotion board
  { const P = STO.board; box(b, C("#c99a62"), P[0] - 0.5, P[1] - 0.75, -4.0, P[0] + 0.5, P[1] + 0.75, -3.96); }
  b.build(sto);
  { const m = mesh(new THREE.PlaneGeometry(0.85, 0.15), new THREE.MeshLambertMaterial({ map: ctex("promoH", 700, 120, (g) => promoHeader(new Pen(g))), alphaTest: 0.3 }), sto, STO.board[0], STO.board[1] + 0.66, -3.955); void m; }
  { const sg = new THREE.Group(); sto.add(sg); sg.position.set(...(STO.sign as V3));
    mesh(new THREE.BoxGeometry(1.6, 0.4, 0.04), [white, white, white, white, new THREE.MeshLambertMaterial({ map: ctex("kbSign", 800, 200, (g) => kbSign(new Pen(g))) }), white], sg, 0, 0, 0);
    for (const sd of [-0.7, 0.7]) mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.25, 6), steel, sg, sd, 0.32, 0); }

  // ===== PRESS (1999) =====
  SETL = "press";
  const pre = G("press", PRESS);
  b = new Batch();
  up(b, lam("pconc", () => ({ map: concrete("pconc", "#b9b6ad") })), -4, 4, -4, 3, 0, 2);
  const pw = C("#9fb0bd");
  for (const [x0, x1, z0, z1] of [[-4, 4, -4.15, -4], [-4.15, -4, -4, 3], [4, 4.15, -4, 3], [-4, 4, 3, 3.15]]) box(b, pw, x0, 0, z0, x1, 3.4, z1);
  ceiling(pre, -4, 4, -4, 3, 3.4, "#dfe3e6");
  { const [px, pz] = PR.press, pg = C("#5f7a72"); box(b, pg, px - 1.2, 0, pz - 0.6, px + 1.2, 1.3, pz + 0.6); box(b, C("#4a5f58"), px - 1.0, 1.3, pz - 0.5, px + 0.6, 1.75, pz + 0.5);
    for (let i = 0; i < 3; i++) cyl(b, C("#f3f1ec"), px - 0.6 + i * 0.35, 1.0, pz + 0.6, 0.07, 0.07, 0.02, 16, new THREE.Euler(Math.PI / 2, 0, 0));
    box(b, steel, px + 1.2, 0.95, pz - 0.5, px + 1.25, 1.04, pz + 0.5); }
  { const B = PR.bed, [g0, g1] = PR.gantry; box(b, steel, B[0] - 0.55, 0, B[2] - 0.6, B[0] + 0.55, B[1] - 0.004, B[2] + 0.6);
    for (const gx of [g0, g1]) box(b, C("#5b6170"), gx - 0.05, B[1], PR.blade_z - 0.06, gx + 0.05, 1.8, PR.blade_z + 0.04); box(b, C("#5b6170"), g0 - 0.05, 1.8, PR.blade_z - 0.06, g1 + 0.05, 1.9, PR.blade_z + 0.04);
    const T = PR.tray; box(b, steel, T[0] - 0.5, T[1] - 0.06, T[2] - 0.2, T[0] + 0.5, T[1], T[2] + 0.2); box(b, steel, T[0] - 0.5, 0, T[2] - 0.03, T[0] - 0.46, T[1] - 0.06, T[2] + 0.03); box(b, steel, T[0] + 0.46, 0, T[2] - 0.03, T[0] + 0.5, T[1] - 0.06, T[2] + 0.03); }
  b.build(pre);
  mesh(new THREE.PlaneGeometry(1.4, 1.0), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.4, 1.5) }), pre, 0, 3.395, -1.5).rotation.x = Math.PI / 2;
  const rollers = [1.02, 1.12].map((y) => { const m = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 20), lam("roller", () => ({ map: ctex("roller", 64, 256, (g) => { g.fillStyle = "#c9ccd2"; g.fillRect(0, 0, 64, 256); g.fillStyle = "#8a909a"; for (let i = 0; i < 8; i++) g.fillRect(0, i * 32, 64, 6); }) })), pre, PR.rollers_x, y, PR.press[1]); m.rotation.x = Math.PI / 2; return m; });
  const blade = new THREE.Group(); pre.add(blade); blade.position.set(PR.bed[0], 1.55, PR.blade_z);
  mesh(new THREE.BoxGeometry(1.25, 0.15, 0.03), [steel, steel, steel, steel, C("#c9ccd2"), steel], blade, 0, 0.075, 0);
  // the cut strip (row 10 of a pristine sheet) and its texture slice
  const stripTex = sheetTex().front.clone(); stripTex.repeat.set(1, 1 / 11 * 0.94); stripTex.offset.set(0, (52 / 2040)); stripTex.needsUpdate = true;
  const strip = mesh(new THREE.PlaneGeometry(SW - 0.027, 0.088), new THREE.MeshLambertMaterial({ map: stripTex }), pre, 0, 0, 0); strip.rotation.x = -Math.PI / 2;

  const toy = new THREE.Group(); sto.add(toy); mesh(new THREE.BoxGeometry(0.3, 0.26, 0.38), boxMats[3], toy, 0, 0.13, 0);
  // ===== the sheet rigs =====
  const hero = makeSheet(root), easel = makeSheet(auc), promo = makeSheet(sto), press = makeSheet(pre), press2 = makeSheet(pre);
  easel.g.position.set(AU.easel[0], AU.easel[1], -3.74); easel.g.rotation.x = Math.PI / 2;
  promo.g.position.set(STO.sheet[0], STO.sheet[1], -3.935); promo.g.rotation.x = Math.PI / 2;
  press.g.position.set(PR.sheet[0], PR.sheet[1], PR.sheet[2]);
  press2.g.rotation.y = Math.PI / 2;
  poseSheet(easel, { a: SL, wreck: true }); poseSheet(promo, { a: SL }); poseSheet(press, { a: SL }); poseSheet(press2, { a: SL });
  // the paint tin
  const tin = new THREE.Group(); land.add(tin);
  mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 20), [C("#c9ccd2"), C("#e9e2cf"), C("#c9ccd2")], tin, 0, 0.06, 0);
  mesh(new THREE.TorusGeometry(0.09, 0.003, 4, 20, Math.PI), C("#5b6170"), tin, 0, 0.12, 0);

  // room shells cast no shadow (the walls behind the lens would put every interior in shade); the props and the sheets do
  for (const g of Object.values(groups)) g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = false; o.receiveShadow = true; } });
  for (const o of [ladder, tin, toy, fanBlade, door, hero.g, easel.g, promo.g, press.g, press2.g]) o.traverse((c) => { if ((c as THREE.Mesh).isMesh && !(c as THREE.Mesh).layers.isEnabled(NOINK)) c.castShadow = true; });
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material]; if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } });
  // ceilings cast no shadow (interiors stay lit by the sun through the open side)
  { const rep = coplanarReport(); console.warn(`[coplanar] ${rep.length} coplanar overlaps`); for (const l of rep.slice(0, 40)) console.warn(l); }
  void untone; void quad; void tri; void jit; void brick; void grassHD; void roofHD; void beam; void water; void stoneHD; void calendar; void tvNews; void lotBoard; void report; void obj; void ORIGIN; void local;
  return { groups, hero, easel, promo, press, press2, door, cord, fanBlade, tin, ladder, cal, tv, board, report: rep2, dust, dustClean, blade, rollers, strip, lampOn, flashes, web, toy };
};
