// The sets of the Retford reel (the estate with the unit, the road and the police station; the kid's room; the control room; the Manchester yard; the court front; the courtroom) and the van, built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { scan, plainSign, letters as lettersArt, itemArt, callerId, monitorFeed, signBoard, bladeSign, grandOpening, calendar, windowLettering, openNeon, clockFace, chalkboard, cameraSign,
  productFace, shelfWall, pegboard, poster, lining, pocket, giftPaper, spoonTray, bill as billArt } from "./art2";
import { V3, obj, ORIGIN, UP, VANP, KIDP, CTRLP, YARDP, COURTP, ROOMP } from "./story";
import * as A2 from "./art2";
import { LOOKS } from "./looks";

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
const parkedCar = (b: Batch, x: number, z: number, col: string) => {
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
  van: THREE.Group; vanDoors: THREE.Group[]; plate: Canvas; vanCal: Canvas; calPage: THREE.Mesh; calPageC: Canvas; tail: THREE.MeshBasicMaterial;
  plug: THREE.Group; bricks: THREE.Mesh[]; holeOut: THREE.Mesh; holeIn: THREE.Mesh; patch: THREE.Mesh; tunnel: THREE.Mesh; plugRing: Canvas;
  hammer: THREE.Mesh; strobe: THREE.MeshBasicMaterial; cctvHead: THREE.Group; recMat: THREE.MeshBasicMaterial; roadRec: THREE.MeshBasicMaterial[];
  panel: THREE.MeshBasicMaterial; bulbs: THREE.MeshBasicMaterial[]; door: THREE.Group; rackGap: THREE.Mesh; carry: THREE.Group[];
  cover: THREE.Group; label: Canvas; peel: THREE.Mesh; peelC: Canvas; newLabel: THREE.Mesh;
  map: Canvas; mons: Canvas[];
  car: THREE.Group; barMats: THREE.MeshBasicMaterial[]; drop: THREE.Group; stack: THREE.Group; cDoors: THREE.Group[];
  courtDoors: THREE.Group[]; tv: Canvas;
};
const woodTex = (key: string, base: string, dark: string) => ctex("wood" + key, 512, 512, (g, r) => {
  for (let i = 0; i < 8; i++) { g.fillStyle = jit(r, base, 0.05, 3, 0.1); g.fillRect(0, i * 64, 512, 64); g.fillStyle = dark; g.fillRect(0, i * 64 + 61, 512, 3); }
  for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(60,35,20,0.07)"; g.fillRect(r() * 512, r() * 512, 40 + r() * 80, 2); }
});
const paintWall = (key: string, base: string) => ctex("wall" + key, 512, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 14, "255,255,255", 0.06, 120); blot(g, r, 512, 512, 10, "80,70,60", 0.04, 120);
});
const skyline = (key: string, base: string) => ctex("sky" + key, 256, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 256, 512);
  for (let y = 12; y < 512; y += 22) for (let x = 12; x < 244; x += 26) { g.fillStyle = r() > 0.4 ? "rgba(255,240,200,0.55)" : "rgba(40,80,140,0.25)"; g.fillRect(x, y, 14, 12); }
});
/** blue sky with puffy white inked clouds (quality bar: every window) */
const cloudSky = (key: string, top = "#3f86e0", bot = "#bfe0fb") => ctex("cloudSky" + key, 512, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  const puff = (cx: number, cy: number, s: number) => {
    const bl = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.25, 0.75], [-0.4, -0.35, 0.75], [0.45, -0.3, 0.65]];
    g.fillStyle = "#3a4a6a"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s + 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#ffffff"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); g.fill(); }
  };
  puff(130, 150, 46); puff(380, 110, 38); puff(300, 330, 30);
});
const brickT = (key: string, pale = false) => ctex("brk" + key, 512, 512, (g) => A2.bricks(new Pen(g), 512, 512, pale, 14));
const cardTexture = (name: string) => ctex("card" + name, 600, 838, (g) => { g.clearRect(0, 0, 600, 838); scan(g, name, 0, 0, 600, 838); });
const glow = (r: number, g2: number, b2: number) => new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g2, b2) });
/** a thin cylinder between two points (wires, rails, ladder tubes) */
const rod = (b: Batch, m: THREE.Material, a: V3, c: V3, r: number, seg = 6) => {
  const A = V(...a), Cc = V(...c), L = A.distanceTo(Cc), g = new THREE.CylinderGeometry(r, r, L, seg); g.translate(0, L / 2, 0);
  b.add(g, m, new THREE.Matrix4().compose(A, new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), Cc.clone().sub(A).normalize()), V(1, 1, 1)));
};
const tree = (b: Batch, x: number, z: number, s = 1, cols = ["#3fa048", "#4fb050"]) => {
  cyl(b, C("#7a4a2a"), x, 0, z, 0.18 * s, 0.13 * s, 2.4 * s, 8);
  for (const [dx, dy, dz, r, k] of [[0, 3.0, 0, 1.3, 0], [0.7, 2.6, 0.3, 0.9, 1], [-0.6, 2.7, -0.2, 1.0, 1], [0.1, 3.7, -0.1, 0.9, 0]]) sph(b, C(cols[k]), x + dx * s, dy * s, z + dz * s, r * s);
};

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const lamC = (tex: THREE.Texture, transparent = false) => lam("lc" + tex.uuid + transparent, () => ({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 }));
  const basicC = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.02 : 0 });
  const tex = (key: string, W: number, H: number, draw: (p: Pen) => void) => ctex(key, W, H, (g) => draw(new Pen(g)));
  const glassMat = (op = 0.18, col = "#d8eef8") => new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
  const ink = C("#2a2c33"), white = C("#f6f3ec"), cream = C("#fbf3dc"), oak = C("#b5703c"), oakD = C("#8a5230"), brass = C("#d4a84a");
  const sky = (k: string) => new THREE.MeshBasicMaterial({ map: cloudSky(k) });
  const ceilingAt = (g: THREE.Group, x0: number, x1: number, z0: number, z1: number, h: number, col: string) => {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lam("ceil" + col, () => ({ color: col }))); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, h - 0.002, (z0 + z1) / 2); g.add(c);
  };
  const cartonM = lam("carton", () => ({ map: ctex("cartonS", 256, 192, (g) => A2.carton(new Pen(g), 256, 192)) })), cartonTop = lam("cartonT", () => ({ map: ctex("cartonT", 256, 256, (g) => A2.carton(new Pen(g), 256, 256, true)) }));
  const cartonMesh = (parent: THREE.Object3D) => { const [cw, ch, cd] = UP.carton; const m = mesh(new THREE.BoxGeometry(cw, ch, cd), [cartonM, cartonM, cartonTop, cartonTop, cartonM, cartonM], parent); return m; };
  const frameCard = (parent: THREE.Object3D, nm: string, x: number, y: number, z: number, h: number, ry = 0) => {
    const g2 = new THREE.Group(); g2.position.set(x, y, z); g2.rotation.y = ry; parent.add(g2);
    mesh(new THREE.BoxGeometry(h * 0.716 + 0.05, h + 0.05, 0.015), C("#2a2c33"), g2, 0, 0, -0.012);
    mesh(new THREE.PlaneGeometry(h * 0.716, h), new THREE.MeshBasicMaterial({ map: cardTexture(nm), transparent: true, alphaTest: 0.5 }), g2, 0, 0, 0.002);
    mesh(new THREE.BoxGeometry(0.02, h * 0.5, 0.12), C("#2a2c33"), g2, 0, -h * 0.25, -0.07).rotation.x = -0.4; // the easel's leg
  };

  // ===================== THE VAN (one model, placed per scene; nose +x, right side +z, wheels on y 0) =====================
  SETL = "van";
  const van = new THREE.Group(); root.add(van);
  const tail = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 0.12, 0.1) });
  const plate = canvasMat(600, 140); const vanCal = canvasMat(200, 220);
  const vanDoors: THREE.Group[] = [];
  let calPage: THREE.Mesh; const calPageC = canvasMat(200, 220);
  {
    const vb = new Batch(), body = C("#f6f5f0"), trim = C("#2f3440"), seat = C("#3a4a8a"), lad = C("#f2902f"), floor = C("#8a8f9a");
    // the cargo box (hollow: floor, roof, sides, bulkhead), then the cab
    box(vb, floor, -2.6, 0.35, -0.98, 0.9, 0.5, 0.98); box(vb, body, -2.6, 2.22, -1.0, 0.9, 2.3, 1.0);
    box(vb, body, -2.6, 0.35, 0.94, 0.9, 2.22, 1.0); box(vb, body, -2.6, 0.35, -1.0, 0.9, 2.22, -0.94); box(vb, body, 0.85, 0.5, -0.94, 0.9, 2.22, 0.94);
    box(vb, C("#e8e4da"), -2.55, 0.5, 0.9, 0.84, 2.2, 0.94); box(vb, C("#e8e4da"), -2.55, 0.5, -0.94, 0.84, 2.2, -0.9);   // the inner lining
    box(vb, body, 0.9, 0.35, -1.0, 2.6, 0.5, 1.0);                                 // cab floor / sill
    box(vb, body, 2.05, 0.5, -1.0, 2.6, 1.15, 1.0);                                // the nose (bonnet)
    box(vb, body, 0.9, 0.5, 0.95, 2.05, 1.15, 1.0); box(vb, body, 0.9, 0.5, -1.0, 2.05, 1.15, -0.95);   // the cab doors (lower)
    box(vb, body, 0.9, 1.98, -1.0, 2.08, 2.06, 1.0);                               // the cab roof
    for (const z of [-1.0, 0.94]) { box(vb, body, 0.9, 1.15, z, 0.98, 1.98, z + 0.06); slab(vb, body, 2.3, 1.58, z + 0.03, 0.06, 0.9, 0.06, 0.5, 0); } // B and A pillars
    box(vb, trim, 1.85, 0.95, -0.92, 2.2, 1.18, 0.92);                             // the dash
    box(vb, seat, 1.15, 0.5, -0.85, 1.6, 0.92, -0.15); box(vb, seat, 1.15, 0.5, 0.15, 1.6, 0.92, 0.85);   // seat bases (empty: nobody sits)
    box(vb, seat, 1.0, 0.92, -0.85, 1.12, 1.55, -0.15); box(vb, seat, 1.0, 0.92, 0.15, 1.12, 1.55, 0.85);
    box(vb, trim, -2.62, 0.3, -1.01, 2.63, 0.42, 1.01);                            // bumpers / rubbing strip
    box(vb, glow(2.6, 2.4, 2.0), 2.6, 0.82, -0.9, 2.64, 0.98, -0.62); box(vb, glow(2.6, 2.4, 2.0), 2.6, 0.82, 0.62, 2.64, 0.98, 0.9);   // headlamps
    // the orange roof ladder
    for (const z of [-0.5, 0.5]) rod(vb, lad, [-2.4, 2.42, z], [0.6, 2.42, z], 0.025);
    for (let x = -2.3; x <= 0.5; x += 0.35) rod(vb, lad, [x, 2.42, -0.5], [x, 2.42, 0.5], 0.018);
    for (const x of [-2.2, 0.4]) for (const z of [-0.5, 0.5]) rod(vb, lad, [x, 2.3, z], [x, 2.42, z], 0.02);
    // wheels
    for (const x of [-1.75, 1.75]) for (const z of [-0.88, 0.88]) { cyl(vb, M.tyre(), x, 0.36, z - 0.13 * Math.sign(z) - 0.0, 0.36, 0.36, 0.26, 16, new THREE.Euler(Math.PI / 2, 0, 0)); }
    // the steering wheel (right-hand drive)
    vb.add(new THREE.TorusGeometry(0.19, 0.02, 6, 20).rotateY(Math.PI / 2).rotateZ(-0.5).translate(1.62, 1.25, 0.48), ink);
    // a few cartons and the sledgehammer in the cargo bay
    for (const [x, z, y] of [[0.5, -0.6, 0.5], [0.5, -0.2, 0.5], [0.5, -0.6, 0.8], [0.1, -0.6, 0.5]]) box(vb, cartonM, x - 0.15, y, z - 0.2, x + 0.15, y + 0.3, z + 0.2);
    vb.build(van);
    const hm = new THREE.Group(); hm.position.set(-1.7, 0.53, 0.24); hm.rotation.y = 0.5; van.add(hm);
    mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.9, 8).rotateZ(Math.PI / 2), C("#c98a3e"), hm, 0, 0, 0); mesh(new THREE.BoxGeometry(0.1, 0.1, 0.22), C("#5f6c86"), hm, 0.46, 0.02, 0);
    // glass: windscreen, side windows (transparent, no ink)
    const ws = mesh(new THREE.PlaneGeometry(1.85, 0.95), glassMat(0.12), van, 2.3, 1.58, 0); ws.rotation.set(0, Math.PI / 2, 0); ws.rotateX(-0.5);
    for (const z of [-0.975, 0.975]) plane(1.0, 0.8, glassMat(0.14), van, 1.48, 1.56, z);
    // the dent in the sliding side door (right side, +z), seams, the tail lamps, the plate
    const dent = mesh(new THREE.CircleGeometry(0.16, 20), new THREE.MeshBasicMaterial({ color: "#c9ccd4", transparent: true, opacity: 0.9, depthWrite: false }), van, -0.9, 1.05, 1.004); dent.scale.set(1.3, 0.8, 1);
    plane(0.02, 1.6, C("#9aa0aa"), van, -0.2, 1.3, 1.004); plane(0.02, 1.6, C("#9aa0aa"), van, -1.5, 1.3, 1.004);
    for (const z of [-0.88, 0.88]) mesh(new THREE.BoxGeometry(0.03, 0.3, 0.1), tail, van, -2.63, 1.05, z);
    plane(0.52, 0.12, basicC(plate.tex), van, -2.69, 0.56, 0, -Math.PI / 2);
    // the rear doors, hinged at the rear corners
    for (const s of [-1, 1]) { const d = new THREE.Group(); d.position.set(-2.6, 0, s * 1.0); van.add(d); vanDoors.push(d);
      mesh(new THREE.BoxGeometry(0.05, 1.8, 0.99), body, d, -0.025, 1.38, -s * 0.495); mesh(new THREE.PlaneGeometry(0.7, 0.5), glassMat(0.3, "#5a6688"), d, -0.052, 1.85, -s * 0.5).rotation.y = -Math.PI / 2; }
    // the tear-off calendar on the dash (S05): a block, the live top page, and a page that falls
    const cg = new THREE.Group(); cg.position.set(2.12, 1.18, 0.06); cg.rotation.y = -Math.PI / 2 + 0.15; van.add(cg);
    mesh(new THREE.BoxGeometry(0.11, 0.03, 0.08), C("#2f5fb4"), cg, 0, 0.015, 0);
    const cp = mesh(new THREE.PlaneGeometry(0.1, 0.11), new THREE.MeshBasicMaterial({ map: vanCal.tex }), cg, 0, 0.085, 0.0); cp.rotation.x = -0.25;
    calPage = mesh(new THREE.PlaneGeometry(0.1, 0.11), new THREE.MeshBasicMaterial({ map: calPageC.tex, side: THREE.DoubleSide }), van, 0, -5, 0);
  }

  // ===================== THE UNIT, THE ESTATE, THE ROAD, THE POLICE STATION =====================
  SETL = "unit";
  const unit = G("unit", ORIGIN.unit);
  let b = new Batch();
  const [bx0, bx1, bz0, bz1] = UP.bld, BH = UP.h, WT = UP.wall_t, [hx, hy, hz] = UP.hole, HR = UP.hole_r;
  const cladB = lam("cladB", () => ({ map: siding("cladB", "#8fc4ec") })), cladC = lam("cladC", () => ({ map: siding("cladC", "#f6e6c0") })), cladR = lam("cladR", () => ({ map: siding("cladR", "#e2786a") }));
  const brickM = lam("brickU", () => ({ map: brickT("U") })), roofM = C("#c9643a"), concreteM = lam("concU", () => ({ map: concrete("concU", "#d9d1c3") }));
  // ground: the yard, the pavements, the road, the lay-by, grass all round
  up(b, lam("grassU", () => ({ color: "#5fb04a" })), -140, 90, -90, 60, -0.012, 8);
  up(b, M.asphalt(), UP.yard[0], UP.yard[1], UP.yard[2], UP.yard[3], 0, 4);
  up(b, concreteM, -140, 90, UP.pave[0], UP.pave[1], 0, 2);
  up(b, lam("asphaltR", () => ({ map: asphalt("asphaltR", "#6a6872") })), -140, 90, UP.road[0], UP.road[1], 0, 6);
  up(b, concreteM, -140, 90, UP.road[1], UP.road[1] + 2.0, 0, 2);
  { const [lx0, lx1, lz0, lz1] = UP.layby; up(b, M.lot(), lx0, lx1, lz0, lz1, 0, 4); for (let x = lx0 + 0.5; x < lx1; x += 2.6) box(b, M.line(), x, 0, lz0 + 0.3, x + 0.1, 0.006, lz0 + 4.5); }
  for (let x = -138; x < 88; x += 6) box(b, M.line(), x, 0, 7.42, x + 3, 0.006, 7.58);   // centre dashes
  for (const z of [UP.road[0], UP.road[1]]) box(b, C("#e6e0d4"), -140, 0, z - 0.12, 90, 0.1, z + 0.12);   // kerbs
  // the unit: front cladding with openings (shutter, window, door), brick side wall with the square opening the holed panels cover
  const [sx0, sx1, , sy1] = UP.shutter, [wx0, wx1, wy0, wy1] = UP.window, [dx0, dx1, , dy1] = UP.door, FZ = bz1;
  box(b, cladB, bx0, 0, FZ - 0.2, sx0, BH, FZ, 2); box(b, cladB, sx0, sy1, FZ - 0.2, sx1, BH, FZ, 2); box(b, cladB, sx1, 0, FZ - 0.2, wx0, BH, FZ, 2);
  box(b, cladB, wx0, 0, FZ - 0.2, wx1, wy0, FZ, 2); box(b, cladB, wx0, wy1, FZ - 0.2, wx1, BH, FZ, 2); box(b, cladB, wx1, 0, FZ - 0.2, dx0, BH, FZ, 2);
  box(b, cladB, dx0, dy1, FZ - 0.2, dx1, BH, FZ, 2); box(b, cladB, dx1, 0, FZ - 0.2, bx1, BH, FZ, 2);
  box(b, C("#f6e6c0"), bx0 - 0.02, 3.62, FZ, bx1 + 0.02, 3.7, FZ + 0.03);   // a cream band
  const ho = [hz - 0.46, hz + 0.46, hy - 0.46, hy + 0.46];
  box(b, brickM, bx1 - WT, 0, bz0, bx1, BH, ho[0], 1); box(b, brickM, bx1 - WT, 0, ho[1], bx1, BH, FZ - 0.2, 1);
  box(b, brickM, bx1 - WT, 0, ho[0], bx1, ho[2], ho[1], 1); box(b, brickM, bx1 - WT, ho[3], ho[0], bx1, BH, ho[1], 1);
  box(b, cladC, bx0, 0, bz0, bx0 + 0.2, BH, FZ - 0.2, 2); box(b, cladC, bx0 + 0.2, 0, bz0, bx1 - WT, BH, bz0 + 0.2, 2);
  box(b, roofM, bx0 - 0.25, BH, bz0 - 0.25, bx1 + 0.25, BH + 0.16, FZ + 0.3);
  box(b, C("#f6e6c0"), bx0 - 0.3, BH - 0.08, FZ + 0.0, bx1 + 0.3, BH + 0.02, FZ + 0.34);   // the fascia (bulbs hang under it)
  // the shutter (closed), the window frame and its display shelf, the door frame
  box(b, lam("shutter", () => ({ map: rep(ribbed(), 1, 4) })), sx0, 0, FZ - 0.14, sx1, sy1, FZ - 0.08);
  box(b, C("#1f4fa8"), wx0 - 0.06, wy0 - 0.06, FZ - 0.02, wx1 + 0.06, wy0, FZ + 0.06); box(b, C("#1f4fa8"), wx0 - 0.06, wy1, FZ - 0.02, wx1 + 0.06, wy1 + 0.06, FZ + 0.06);
  box(b, C("#1f4fa8"), wx0 - 0.06, wy0, FZ - 0.02, wx0, wy1, FZ + 0.06); box(b, C("#1f4fa8"), wx1, wy0, FZ - 0.02, wx1 + 0.06, wy1, FZ + 0.06);
  box(b, C("#a8282e"), wx0, wy0, FZ - 0.7, wx1, wy0 + 0.04, FZ - 0.22); box(b, C("#a8282e"), wx0, 1.36, FZ - 0.7, wx1, 1.4, FZ - 0.4);
  box(b, C("#1f4fa8"), dx0 - 0.06, 0, FZ - 0.02, dx0, dy1 + 0.06, FZ + 0.06); box(b, C("#1f4fa8"), dx1, 0, FZ - 0.02, dx1 + 0.06, dy1 + 0.06, FZ + 0.06); box(b, C("#1f4fa8"), dx0, dy1, FZ - 0.02, dx1, dy1 + 0.06, FZ + 0.06);
  // the sign board
  box(b, C("#1f4fa8"), UP.sign[0] - UP.sign_size[0] / 2, UP.sign[1] - UP.sign_size[1] / 2, FZ, UP.sign[0] + UP.sign_size[0] / 2, UP.sign[1] + UP.sign_size[1] / 2, FZ + 0.05);
  // inside: floor, three racks of cartons (the first one by the hole is the stolen stock), ceiling lights
  up(b, concreteM, bx0 + 0.2, bx1 - WT, bz0 + 0.2, FZ - 0.2, 0, 2);
  const [rx0, rx1, rz0, rz1] = UP.rack, SH = UP.shelves, [cw, chh, cd] = UP.carton;
  const rackOrange = C("#f2902f"), rackBlue = C("#2f5fb4");
  const rackAt = (x0: number, x1: number, gapAt?: [number, number]) => {
    for (let z = rz0; z <= rz1 + 1e-6; z += (rz1 - rz0) / 5) for (const x of [x0, x1 - 0.06]) box(b, rackOrange, x, 0, z - 0.03, x + 0.06, 2.0, z + 0.03);
    for (const y of SH) for (const x of [x0, x1 - 0.05]) box(b, rackBlue, x, y - 0.06, rz0, x + 0.05, y, rz1);
    for (const y of SH) box(b, C("#c9ccd4"), x0 + 0.05, y - 0.03, rz0 + 0.03, x1 - 0.05, y - 0.01, rz1 - 0.03);
    for (const y of SH) for (let z = rz0 + 0.05; z + cw <= rz1; z += cw + 0.03) for (const x of [x0 + 0.08, x1 - 0.08 - cd]) {
      if (gapAt && x > x0 + 0.3 && Math.abs(y - gapAt[0]) < 1e-3 && Math.abs(z + cw / 2 - gapAt[1]) < cw / 2 + 0.02) continue;
      box(b, cartonM, x, y, z, x + cd, y + chh, z + cw);
    }
  };
  const gapY = SH[2], gapZ = UP.B_rack[1];
  rackAt(rx0, rx1, [gapY, gapZ]); rackAt(0.4, 1.2); rackAt(-2.6, -1.8);
  b.build(unit);
  ceilingAt(unit, bx0 + 0.2, bx1 - WT, bz0 + 0.2, FZ - 0.2, BH - 0.01, "#f6efe0");
  for (const z of [-8, -5, -2]) for (const x of [-3, 1, 4.6]) { const lp = plane(1.4, 0.3, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.5, 1.2) }), unit, x, BH - 0.03, z); lp.rotation.x = Math.PI / 2; }
  // the carton B takes: sits in the gap until he lifts it (posed by world.ts)
  const rackGap = cartonMesh(unit); rackGap.position.set(rx1 - 0.08 - cd / 2, gapY + chh / 2, gapZ);
  const carry: THREE.Group[] = [0, 1, 2].map(() => { const g2 = new THREE.Group(); unit.add(g2); cartonMesh(g2); g2.visible = false; return g2; });
  // the hole: holed brick panels outside and inside, the round tunnel, the plug (a brick disc with its ring of drilled holes), loose bricks, the repair
  const holeOut = plane(0.92, 0.92, lamC(tex("holedO", 512, 512, (p) => A2.holedBricks(p, 512, 512 * HR / 0.92)), true), unit, bx1 + 0.004, hy, hz, Math.PI / 2);
  const holeIn = plane(0.92, 0.92, lamC(tex("holedI", 512, 512, (p) => A2.holedBricks(p, 512, 512 * HR / 0.92)), true), unit, bx1 - WT - 0.004, hy, hz, -Math.PI / 2);
  const tunnel = mesh(new THREE.CylinderGeometry(HR, HR, WT, 28, 1, true), lam("lm1", () => ({ color: "#b85a3a", side: THREE.BackSide })), unit, bx1 - WT / 2, hy, hz); tunnel.rotation.z = Math.PI / 2;
  const patch = plane(0.92, 0.92, lamC(tex("patch", 512, 512, (p) => A2.patchedBricks(p, 512, 512 * HR / 0.92))), unit, bx1 + 0.004, hy, hz, Math.PI / 2);
  const plugRing = canvasMat(512, 512);
  const plug = new THREE.Group(); unit.add(plug);   // pivot at the hole's inner bottom edge; the disc hangs off it
  { const d = mesh(new THREE.CylinderGeometry(HR - 0.01, HR - 0.01, WT - 0.01, 28), [lamC(brickT("plugSide")), lam("lm2", () => ({ map: plugRing.tex })), lamC(brickT("plugIn"))], plug, WT / 2, HR, 0);
    d.rotation.z = -Math.PI / 2; }
  const bricks: THREE.Mesh[] = [0, 1, 2, 3].map(() => mesh(new THREE.BoxGeometry(0.21, 0.065, 0.1), lamC(brickT("loose")), unit, 0, -3, 0));
  // the alarm bell box and its cable to the first pole
  const strobe = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.4, 1.0) });
  { const bb = new Batch(); const [bx, by, bz] = UP.bell;
    box(bb, C("#d8322f"), bx - 0.02, by - 0.23, bz - 0.18, bx + 0.1, by + 0.23, bz + 0.18);
    bb.add(new THREE.SphereGeometry(0.13, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-Math.PI / 2).translate(bx + 0.1, by + 0.04, bz), C("#f2c23a"));
    box(bb, ink, bx - 0.01, by + 0.23, bz - 0.01, bx + 0.01, BH, bz + 0.01); box(bb, ink, bx - 0.01, BH + 0.17, bz - 0.01, bx + 0.01, BH + 0.19, FZ + 0.3);
    rod(bb, ink, [bx, BH + 0.18, FZ + 0.3], [UP.poles_x[0], UP.wire_y, UP.pole_z], 0.012);
    bb.build(unit);
    plane(0.34, 0.44, lamC(tex("alarmBox", 340, 440, (p) => A2.alarmBox(p, 340, 440))), unit, bx + 0.102, by, bz, Math.PI / 2);
    mesh(new THREE.BoxGeometry(0.06, 0.08, 0.1), strobe, unit, bx + 0.13, by + 0.26, bz - 0.12); }
  // Christmas bulbs under the fascia, a wreath on the door, the sign face, the window of real cards
  const bulbs = ["#ff4a3a", "#ffd23a", "#4ae06a", "#4ab0ff"].map((c) => { const k = new THREE.Color(c).multiplyScalar(2.2); return new THREE.MeshBasicMaterial({ color: k }); });
  for (let i = 0, x = bx0 + 0.15; x < bx1; x += 0.36, i++) mesh(new THREE.SphereGeometry(0.035, 8, 6), bulbs[i % 4], unit, x, BH - 0.12 - 0.04 * Math.abs(Math.sin(i * 0.9)), FZ + 0.32);
  plane(UP.sign_size[0] - 0.08, UP.sign_size[1] - 0.06, lamC(tex("unitSign", 1600, 170, (p) => A2.unitSign(p, 1600, 170))), unit, UP.sign[0], UP.sign[1], FZ + 0.056);
  plane(wx1 - wx0, wy1 - wy0, glassMat(0.1), unit, (wx0 + wx1) / 2, (wy0 + wy1) / 2, FZ - 0.1);
  plane(wx1 - wx0, 1.6, lamC(tex("winBack", 400, 400, (p) => { const g = p.g; g.fillStyle = "#fbe8c0"; g.fillRect(0, 0, 400, 400); g.fillStyle = "#d8322f"; g.fillRect(0, 300, 400, 100); })), unit, (wx0 + wx1) / 2, 1.45, FZ - 0.72);
  ["zard151", "umbreon_pe", "bubble_mew", "pika151", "blast151", "venu151"].forEach((n, i) => frameCard(unit, n, wx0 + 0.3 + (i % 3) * 0.5, i < 3 ? 1.58 : 0.92, FZ - 0.5, 0.3));
  // the door (hinged at its left edge, swings in), its bell, the wreath
  const door = new THREE.Group(); door.position.set(dx0, 0, FZ - 0.08); unit.add(door);
  { const dw = dx1 - dx0, fr = C("#1f4fa8"); mesh(new THREE.BoxGeometry(0.06, dy1, 0.05), fr, door, 0.03, dy1 / 2, 0); mesh(new THREE.BoxGeometry(0.06, dy1, 0.05), fr, door, dw - 0.03, dy1 / 2, 0);
    mesh(new THREE.BoxGeometry(dw, 0.08, 0.05), fr, door, dw / 2, dy1 - 0.04, 0); mesh(new THREE.BoxGeometry(dw, 0.22, 0.05), fr, door, dw / 2, 0.11, 0);
    mesh(new THREE.PlaneGeometry(dw - 0.12, dy1 - 0.3), glassMat(0.14), door, dw / 2, 0.22 + (dy1 - 0.3) / 2, 0);
    mesh(new THREE.BoxGeometry(0.03, 0.2, 0.06), brass, door, dw - 0.12, 1.05, 0.05);
    const wr = mesh(new THREE.TorusGeometry(0.16, 0.05, 8, 18), C("#2f8a4a"), door, dw / 2, 1.65, 0.05); void wr; mesh(new THREE.SphereGeometry(0.05, 8, 6), C("#d8322f"), door, dw / 2, 1.5, 0.08);
    plane(0.4, 0.12, basicC(tex("doorOpen", 400, 120, (p) => A2.plainSign(p, 400, 120, "OPEN", "#fbf3dc", "#c0323c", "", "#c0323c"))), door, dw / 2, 1.25, 0.03); }
  mesh(new THREE.ConeGeometry(0.05, 0.07, 12), brass, unit, dx0 + 0.85, dy1 - 0.08, FZ - 0.3);
  // the yard: fence, the lamp post with its camera (the head is its own group), a CCTV sign
  b = new Batch();
  const fenceM = C("#2f8a4a");
  for (let z = UP.yard[2]; z <= UP.yard[3] - 1.5; z += 0.25) box(b, fenceM, UP.yard[1] - 0.03, 0, z, UP.yard[1] + 0.02, 2.1 + 0.08 * (Math.round(z * 4) % 2), z + 0.06);
  for (let x = UP.yard[0] + 0.3; x <= UP.yard[1]; x += 0.25) box(b, fenceM, x, 0, UP.yard[2] - 0.02, x + 0.06, 2.1, UP.yard[2] + 0.03);
  const [px, pz] = UP.post;
  cyl(b, C("#2f8a4a"), px, 0, pz, 0.1, 0.07, UP.post_h, 10); box(b, C("#2f8a4a"), px - 1.4, UP.post_h - 0.1, pz - 0.04, px, UP.post_h, pz + 0.04);
  box(b, C("#2f8a4a"), px - 0.3, UP.cctv[1] - 0.03, pz - 0.03, px, UP.cctv[1] + 0.03, pz + 0.03);
  b.build(unit);
  mesh(new THREE.BoxGeometry(0.5, 0.1, 0.24), glow(2.6, 1.5, 0.5), unit, px - 1.35, UP.post_h - 0.14, pz);
  plane(0.5, 0.36, lamC(tex("cctvSign", 500, 360, (p) => A2.cctvSign(p, 500, 360))), unit, px, 2.6, pz + 0.12);
  const recMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 0.25, 0.2) });
  const cctvHead = new THREE.Group(); cctvHead.position.set(...(UP.cctv as V3)); unit.add(cctvHead);
  { const hous = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.32, 18), white, cctvHead, 0, 0, 0); hous.rotation.x = Math.PI / 2;
    mesh(new THREE.BoxGeometry(0.18, 0.015, 0.36), white, cctvHead, 0, 0.085, 0.02);
    const lens = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.014, 18), C("#14161c"), cctvHead, 0, 0, 0.163); lens.rotation.x = Math.PI / 2;
    const gl = mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.004, 14), new THREE.MeshBasicMaterial({ color: "#4f78c8" }), cctvHead, 0.008, 0.008, 0.172); gl.rotation.x = Math.PI / 2;
    mesh(new THREE.SphereGeometry(0.016, 10, 8), recMat, cctvHead, 0.05, 0.05, 0.14); }
  // the estate: neighbour units, the town sign, poles and the alarm line east to the station, lamp posts, hedges, trees, hills, a church
  b = new Batch();
  for (const [x0, x1, m] of [[-22, -8, cladC], [-38, -24, cladR], [17, 31, cladR], [33, 45, cladC]] as [number, number, THREE.Material][]) {
    box(b, m, x0, 0, -12, x1, 5.2, -0.6, 2); box(b, roofM, x0 - 0.2, 5.2, -12.2, x1 + 0.2, 5.34, -0.4);
    box(b, lam("shutter", () => ({ map: rep(ribbed(), 1, 4) })), x0 + 1.5, 0, -0.62, x0 + 5.0, 3.6, -0.56); }
  { const [tx, tz] = UP.town_sign; for (const dx of [-0.7, 0.7]) cyl(b, C("#8a8f9a"), tx + dx, 0, tz, 0.04, 0.04, 1.2, 8); box(b, white, tx - 0.85, 1.15, tz - 0.03, tx + 0.85, 2.15, tz + 0.01); }
  for (const x of UP.poles_x) { cyl(b, C("#7a5030"), x, 0, UP.pole_z, 0.13, 0.11, 7.0, 10); box(b, C("#7a5030"), x - 0.05, UP.wire_y - 0.05, UP.pole_z - 0.6, x + 0.05, UP.wire_y + 0.05, UP.pole_z + 0.6); }
  for (let i = 0; i + 1 < UP.poles_x.length; i++) for (const dz of [-0.45, 0.45]) rod(b, ink, [UP.poles_x[i], UP.wire_y + 0.06, UP.pole_z + dz], [UP.poles_x[i + 1], UP.wire_y + 0.06, UP.pole_z + dz], 0.012);
  const [st0, st1, sz0, sz1] = UP.station, STH = UP.station_h;
  rod(b, ink, [UP.poles_x[UP.poles_x.length - 1], UP.wire_y + 0.06, UP.pole_z], [st0 + 2.0, STH - 0.3, sz0], 0.014);
  for (let x = -130; x < 80; x += 22) { cyl(b, C("#5b6170"), x, 0, UP.road[1] + 1.2, 0.08, 0.06, 6.0, 8); box(b, C("#5b6170"), x, 5.9, UP.road[1] + 1.2 - 1.6, x + 0.08, 6.0, UP.road[1] + 1.2); }
  for (let x = -138; x < 88; x += 2.2) if ((x < UP.layby[0] - 1 || x > UP.layby[1] + 1) && (x < UP.station[0] - 1 || x > UP.station[1] + 1)) sph(b, C(x % 4.4 < 2.2 ? "#3d8f45" : "#4fa548"), x, 0.55, 19.6, 1.0, 0.8);
  for (const [x, z, s] of [[-30, 26, 1.4], [-12, 30, 1.2], [20, 28, 1.5], [36, 24, 1.1], [-60, 22, 1.3], [-26, -20, 1.5], [24, -22, 1.3], [-4, -24, 1.6], [70, 30, 1.4]]) tree(b, x, z, s);
  for (const [x, z, r, hgt] of [[-80, -90, 60, 16], [10, -110, 70, 22], [90, -95, 55, 14], [-30, 110, 60, 18], [60, 120, 70, 20]]) sph(b, C("#58a84a"), x, -2, z, r, hgt / r);
  // the foreground of the wide (S04): a red phone box, a post box, a bare winter tree on the verge
  { const red = C("#d8322f"); box(b, red, -6.0, 0, 23.0, -5.1, 2.5, 23.9); box(b, red, -6.1, 2.5, 22.9, -5.0, 2.7, 24.0); box(b, C("#fbf3dc"), -5.98, 2.2, 23.92, -5.12, 2.38, 23.95);
    for (const k of [0.2, 0.5, 0.8, 1.1, 1.4, 1.7]) box(b, C("#bfe6f8"), -5.92, 0.3 + k * 1.2, 23.91, -5.18, 0.34 + k * 1.2, 23.93);
    cyl(b, red, 2.2, 0, 22.5, 0.25, 0.25, 1.2, 14); sph(b, red, 2.2, 1.2, 22.5, 0.25, 0.5);
    cyl(b, C("#7a4a2a"), 6.5, 0, 23.5, 0.22, 0.14, 4.5, 8); for (const [dx, dz] of [[1.2, 0.3], [-1.0, 0.4], [0.4, -1.1], [-0.6, -0.8]]) rod(b, C("#7a4a2a"), [6.5, 3.0, 23.5], [6.5 + dx, 4.6, 23.5 + dz], 0.06); }
  box(b, C("#e6dcc4"), -46, 0, -60, -40, 9, -54); b.add(new THREE.ConeGeometry(2.2, 10, 4).translate(-43, 14, -57), C("#8a8f9a"));
  // the police station (hollow front office) across the road
  box(b, brickM, st0, 0, sz0, UP.st_window[0], STH, sz0 + 0.25, 1); box(b, brickM, UP.st_window[0], 0, sz0, UP.st_window[1], UP.st_window[2], sz0 + 0.25, 1);
  box(b, brickM, UP.st_window[0], UP.st_window[3], sz0, UP.st_window[1], STH, sz0 + 0.25, 1); box(b, brickM, UP.st_window[1], 0, sz0, UP.st_door[0], STH, sz0 + 0.25, 1);
  box(b, brickM, UP.st_door[0], 2.3, sz0, UP.st_door[1], STH, sz0 + 0.25, 1); box(b, brickM, UP.st_door[1], 0, sz0, st1, STH, sz0 + 0.25, 1);
  box(b, brickM, st0, 0, sz0 + 0.25, st0 + 0.25, STH, sz1); box(b, brickM, st1 - 0.25, 0, sz0 + 0.25, st1, STH, sz1); box(b, brickM, st0 + 0.25, 0, sz1 - 0.25, st1 - 0.25, STH, sz1);
  box(b, roofM, st0 - 0.2, STH, sz0 - 0.2, st1 + 0.2, STH + 0.18, sz1 + 0.2); box(b, C("#2f5fb4"), UP.st_door[0], 0, sz0 + 0.1, UP.st_door[1], 2.3, sz0 + 0.16);
  up(b, lam("stFloor", () => ({ map: woodTex("st", "#c98a4e", "rgba(90,50,20,0.45)") })), st0 + 0.25, st1 - 0.25, sz0 + 0.25, sz1 - 0.25, 0, 2);
  box(b, lam("stWall", () => ({ map: paintWall("st", "#fbe8c0") })), st0 + 0.3, 0, sz1 - 0.3, st1 - 0.3, STH - 0.05, sz1 - 0.25);
  box(b, oak, UP.st_window[0] + 0.2, 0, sz0 + 1.4, UP.st_window[1] - 0.2, 1.0, sz0 + 1.9);
  box(b, C("#e6e0d4"), UP.st_panel[0] - 0.3, UP.st_panel[1] - 0.25, sz1 - 0.34, UP.st_panel[0] + 0.3, UP.st_panel[1] + 0.25, sz1 - 0.3);
  b.build(unit);
  ceilingAt(unit, st0 + 0.25, st1 - 0.25, sz0 + 0.25, sz1 - 0.25, STH - 0.02, "#fbf3e2");
  plane(UP.st_window[1] - UP.st_window[0], UP.st_window[3] - UP.st_window[2], glassMat(0.12), unit, (UP.st_window[0] + UP.st_window[1]) / 2, (UP.st_window[2] + UP.st_window[3]) / 2, sz0 + 0.02, Math.PI);
  plane(1.6, 0.4, lamC(tex("policeSign", 640, 160, (p) => A2.policeSign(p, 640, 160))), unit, (UP.st_door[0] + UP.st_door[1]) / 2 - 0.4, 3.2, sz0 - 0.004, Math.PI);
  mesh(new THREE.BoxGeometry(0.3, 0.36, 0.3), glow(0.3, 0.7, 2.8), unit, UP.st_lamp[0], UP.st_lamp[1], UP.st_lamp[2]);
  const panel = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.4, 0.05, 0.05) });
  mesh(new THREE.SphereGeometry(0.07, 12, 8), panel, unit, UP.st_panel[0], UP.st_panel[1] + 0.1, sz1 - 0.38);
  plane(0.5, 0.16, lamC(tex("panelLbl", 400, 128, (p) => A2.plainSign(p, 400, 128, "ALARMS", "#2f5fb4", "#ffffff"))), unit, UP.st_panel[0], UP.st_panel[1] - 0.12, sz1 - 0.345, Math.PI);
  plane(0.9, 0.6, lamC(tex("stPoster", 450, 300, (p) => A2.plainSign(p, 450, 300, "NOTTS POLICE", "#1f4fa8", "#ffffff", "RETFORD"))), unit, UP.st_panel[0] + 2.2, 1.9, sz1 - 0.31, Math.PI);
  // the town sign face, the gantry signs, the road cameras
  plane(1.64, 0.94, lamC(tex("townSign", 820, 470, (p) => A2.townSign(p, 820, 470))), unit, UP.town_sign[0], 1.65, UP.town_sign[1] + 0.015);
  const roadRec: THREE.MeshBasicMaterial[] = [];
  { const gb = new Batch(), gm = C("#8a8f9a");
    for (const [gx] of UP.gantries as [number, string][]) { for (const z of [UP.road[0] - 0.6, UP.road[1] + 0.6]) cyl(gb, gm, gx, 0, z, 0.16, 0.16, 6.6, 10); box(gb, gm, gx - 0.15, 6.3, UP.road[0] - 0.7, gx + 0.15, 6.6, UP.road[1] + 0.7); }
    for (const x of UP.road_cams) { cyl(gb, C("#5b6170"), x, 0, UP.road_cam_z, 0.08, 0.06, 5.0, 8); box(gb, white, x - 0.14, 4.9, UP.road_cam_z - 0.32, x + 0.14, 5.1, UP.road_cam_z - 0.02); }
    gb.build(unit); }
  (UP.gantries as [number, string][]).forEach(([gx, nm], i) => { for (const [z, side] of [[5.75, 1], [9.25, -1]] as [number, number][]) plane(3.2, 1.3, lamC(tex("gantry" + i, 960, 390, (p) => A2.gantrySign(p, 960, 390, nm as string, i === 0 ? "A1(M)" : "M62"))), unit, gx + 0.17 * side, 5.55, z, side > 0 ? Math.PI / 2 : -Math.PI / 2); });
  for (const x of UP.road_cams) { const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.05, 0.05) }); roadRec.push(m); mesh(new THREE.SphereGeometry(0.04, 8, 6), m, unit, x + 0.16, 5.0, UP.road_cam_z - 0.2); }

  // ===================== THE KID'S ROOM =====================
  SETL = "kidroom";
  const KP = KIDP, kr = G("kidroom", ORIGIN.kidroom);
  b = new Batch();
  const [kx0, kx1, kz0, kz1] = KP.room, KH = KP.h;
  up(b, lam("kidFloor", () => ({ map: woodTex("kid", "#d9a066", "rgba(90,50,20,0.4)") })), kx0, kx1, kz0, kz1, 0, 2);
  const kw = lam("kidWall", () => ({ map: paintWall("kid", "#9fd4f2") }));
  box(b, kw, kx0 - 0.1, 0, kz0 - 0.1, KP.window[0], KH, kz0, 2); box(b, kw, KP.window[1], 0, kz0 - 0.1, kx1 + 0.1, KH, kz0, 2);
  box(b, kw, KP.window[0], 0, kz0 - 0.1, KP.window[1], KP.window[2], kz0, 2); box(b, kw, KP.window[0], KP.window[3], kz0 - 0.1, KP.window[1], KH, kz0, 2);
  box(b, kw, kx0 - 0.1, 0, kz0, kx0, KH, kz1, 2); box(b, kw, kx1, 0, kz0, kx1 + 0.1, KH, kz1, 2);
  box(b, white, kx0, 0.9, kz0, kx1, 0.96, kz0 + 0.02); box(b, white, kx0, 0, kz0, kx1, 0.1, kz0 + 0.025);
  const [dkx0, dkx1, dkz0, dkz1] = KP.desk, DY = KP.desk_y;
  box(b, oak, dkx0, DY - 0.04, dkz0, dkx1, DY, dkz1); for (const x of [dkx0 + 0.03, dkx1 - 0.07]) for (const z of [dkz0 + 0.03, dkz1 - 0.07]) box(b, oakD, x, 0, z, x + 0.04, DY - 0.04, z + 0.04);
  cyl(b, C("#2f5fb4"), 0.48, DY, 0.12, 0.04, 0.04, 0.1, 12); for (const [dx, col] of [[-0.012, "#f2c23a"], [0.012, "#d8322f"]] as [number, string][]) cyl(b, C(col), 0.48 + dx, DY + 0.06, 0.12, 0.006, 0.006, 0.14, 6);
  box(b, C("#f2c23a"), -0.5, DY, 0.12, -0.2, DY + 0.006, 0.16); box(b, C("#e8a0b8"), 0.3, DY, 0.2, 0.36, DY + 0.015, 0.23);
  box(b, oak, kx1 - 0.42, 0, -1.6, kx1 - 0.02, 1.6, 0.2); for (const y of [0.4, 0.8, 1.2]) box(b, oakD, kx1 - 0.42, y, -1.6, kx1 - 0.02, y + 0.03, 0.2);
  for (let i = 0; i < 9; i++) box(b, C(["#d8322f", "#2f5fb4", "#f2c23a", "#2f9a55"][i % 4]), kx1 - 0.38, 0.43 + 0.4 * (i % 3), -1.5 + 0.18 * Math.floor(i / 3) * 2, kx1 - 0.08, 0.72 + 0.4 * (i % 3), -1.38 + 0.18 * Math.floor(i / 3) * 2);
  box(b, C("#e8784a"), -1.3, 0, 0.6, 1.3, 0.008, 2.2);
  b.build(kr);
  ceilingAt(kr, kx0, kx1, kz0, kz1, KH, "#fbf3e2");
  plane(KP.window[1] - KP.window[0], KP.window[3] - KP.window[2], sky("kidWin"), kr, (KP.window[0] + KP.window[1]) / 2, (KP.window[2] + KP.window[3]) / 2, kz0 - 0.05);
  for (let i = 0; i < 3; i++) plane(0.55, 0.75, lamC(tex("kposter" + i, 330, 450, (p) => A2.kidPoster(p, 330, 450, i))), kr, [0.5, 1.4, -2.0][i], 1.75, kz0 + 0.005 + (i === 2 ? 0 : 0));
  for (let i = 0; i < 9; i++) { const fl = mesh(new THREE.ConeGeometry(0.07, 0.14, 3), C(["#d8322f", "#f2c23a", "#2f9a55"][i % 3]), kr, kx0 + 0.4 + i * 0.5, 2.38, kz0 + 0.1); fl.rotation.x = Math.PI; }
  // the notebook: the page block, the cover (hinged at its left edge) with its label, the peeled label, the new label on its backing sheet
  const [nbx, nbz] = KP.book, [nbw, nbd] = KP.book_size;
  const nb = new THREE.Group(); nb.position.set(nbx, DY, nbz); kr.add(nb);
  mesh(new THREE.BoxGeometry(nbw, 0.01, nbd), C("#fffdf4"), nb, 0, 0.005, 0);
  { const pg = plane(nbw - 0.004, nbd - 0.004, lamC(tex("nbPageR", 400, 540, (p) => A2.nbPage(p, 400, 540, "MINH", 2))), nb, 0, 0.0104, 0); pg.rotation.x = -Math.PI / 2; }
  const cover = new THREE.Group(); cover.position.set(-nbw / 2, 0.0125, 0); nb.add(cover);
  { const c1 = mesh(new THREE.BoxGeometry(nbw, 0.003, nbd), C("#d8322f"), cover, nbw / 2, 0, 0); void c1;
    const top = plane(nbw, nbd, lamC(tex("nbCover", 400, 540, (p) => A2.nbCover(p, 400, 540))), cover, nbw / 2, 0.0018, 0); top.rotation.x = -Math.PI / 2;
    const ins = plane(nbw - 0.004, nbd - 0.004, lamC(tex("nbPageL", 400, 540, (p) => A2.nbPage(p, 400, 540, "MINH", 5))), cover, nbw / 2, -0.0018, 0); ins.rotation.x = Math.PI / 2; ins.rotation.z = Math.PI; }
  const label = canvasMat(330, 150);
  { const lb = plane(0.11, 0.05, lam("lm3", () => ({ map: label.tex, transparent: true, alphaTest: 0.05 })), cover, nbw / 2 + 0.01, 0.0022, -0.03); lb.rotation.x = -Math.PI / 2; }
  const peelC = canvasMat(330, 150);
  const peel = plane(0.11, 0.05, lam("lm4", () => ({ map: peelC.tex, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide })), kr, 0, -3, 0);
  { const bs = plane(0.16, 0.09, C("#e8e4da"), kr, 0.38, DY + 0.004, -0.05); bs.rotation.x = -Math.PI / 2; }
  const newLabel = plane(0.11, 0.05, lam("lm5", () => ({ map: tex("labelAN", 330, 150, (p) => A2.nbLabel(p, 330, 150, "AN")), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide })), kr, 0.38, DY + 0.006, -0.05);
  newLabel.rotation.x = -Math.PI / 2;

  // ===================== THE CONTROL ROOM =====================
  SETL = "ctrl";
  const CP = CTRLP, cr = G("ctrl", ORIGIN.ctrl);
  b = new Batch();
  const [cx0, cx1, cz0, cz1] = CP.room, CH = CP.h;
  up(b, lam("ctrlCarpet", () => ({ color: "#3f78c8" })), cx0, cx1, cz0, cz1, 0, 2);
  const cwM = lam("ctrlWall", () => ({ map: paintWall("ctrl", "#fbe8c0") }));
  box(b, cwM, cx0 - 0.1, 0, cz0 - 0.1, cx1 + 0.1, CH, cz0, 2); box(b, cwM, cx0 - 0.1, 0, cz0, cx0, CH, cz1, 2); box(b, cwM, cx1, 0, cz0, cx1 + 0.1, CH, cz1, 2);
  box(b, C("#2f5fb4"), cx0, 0, cz0, cx1, 0.12, cz0 + 0.02);
  const [mpx0, mpx1, mpy0, mpy1] = CP.map; box(b, ink, mpx0 - 0.05, mpy0 - 0.05, cz0, mpx1 + 0.05, mpy1 + 0.05, cz0 + 0.05);
  const [mnx0, mnx1, mny0, mny1] = CP.mons, [gc, gr] = CP.mon_grid; box(b, ink, mnx0 - 0.04, mny0 - 0.04, cz0, mnx1 + 0.04, mny1 + 0.04, cz0 + 0.05);
  const [csx0, csx1, csz0, csz1] = CP.console; box(b, C("#e6e0d4"), csx0, 0, csz0, csx1, CP.console_y, csz1); box(b, ink, csx0 + 0.1, CP.console_y, csz0 + 0.1, csx0 + 0.6, CP.console_y + 0.02, csz0 + 0.3); box(b, ink, csx1 - 0.7, CP.console_y, csz0 + 0.1, csx1 - 0.2, CP.console_y + 0.02, csz0 + 0.3);
  for (const [x, z] of [[-3.1, 2.5], [3.1, 2.8]]) { cyl(b, C("#d8322f"), x, 0, z, 0.2, 0.16, 0.4, 12); sph(b, C("#3fa048"), x, 0.8, z, 0.45); }
  b.build(cr);
  ceilingAt(cr, cx0, cx1, cz0, cz1, CH, "#fbf3e2");
  for (const z of [-1.5, 1.5]) { const lp = plane(1.6, 0.4, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.45, 1.3) }), cr, 0, CH - 0.01, z); lp.rotation.x = Math.PI / 2; }
  const map = canvasMat(1600, 1000); plane(mpx1 - mpx0, mpy1 - mpy0, basicC(map.tex), cr, (mpx0 + mpx1) / 2, (mpy0 + mpy1) / 2, cz0 + 0.054);
  const mons: Canvas[] = [];
  for (let r = 0; r < gr; r++) for (let c = 0; c < gc; c++) { const w = (mnx1 - mnx0) / gc, h = (mny1 - mny0) / gr, m = canvasMat(640, 360); mons.push(m);
    plane(w - 0.05, h - 0.05, basicC(m.tex), cr, mnx0 + w * (c + 0.5), mny1 - h * (r + 0.5), cz0 + 0.054); }
  plane(0.8, 0.3, lamC(tex("ctrlPlaque", 800, 300, (p) => A2.plainSign(p, 800, 300, "CONTROL ROOM", "#1f4fa8", "#ffffff", "NOTTINGHAMSHIRE"))), cr, -2.9, 2.6, cz0 + 0.004);

  // ===================== THE STORAGE YARD (Manchester) =====================
  SETL = "yard";
  const YP = YARDP, yd = G("yard", ORIGIN.yard);
  b = new Batch();
  up(b, lam("yardConc", () => ({ map: concrete("yardC", "#e2d8c4") })), -40, 40, -40, YP.fence_z, 0, 3);
  up(b, M.asphalt(), -40, 40, YP.fence_z, 30, 0, 4);
  const ctex2 = (col: string) => lam("cont" + col, () => ({ map: ctex("cont" + col, 512, 256, (g) => A2.corrugated(new Pen(g), 512, 256, col)) }));
  const cols = ["#e8782f", "#4fb0e8", "#2f9a55", "#d8322f", "#f2c23a"];
  const container = (x0: number, z0: number, along: "z" | "x", col: string, y0 = 0) => { const m = ctex2(col); if (along === "z") box(b, m, x0, y0, z0, x0 + 2.44, y0 + 2.6, z0 + 6.06, 0); else box(b, m, x0, y0, z0, x0 + 6.06, y0 + 2.6, z0 + 2.44, 0); };
  const [ox0, ox1, oz0, oz1] = YP.box, OH = YP.box_h, om = ctex2("#e8782f");
  box(b, om, ox0, 0, oz0, ox1, 0.12, oz1); box(b, om, ox0, OH - 0.1, oz0, ox1, OH, oz1); box(b, om, ox0, 0.12, oz0, ox0 + 0.06, OH - 0.1, oz1); box(b, om, ox1 - 0.06, 0.12, oz0, ox1, OH - 0.1, oz1); box(b, om, ox0 + 0.06, 0.12, oz0, ox1 - 0.06, OH - 0.1, oz0 + 0.06);
  for (const [x, z, y] of [[ox0 + 0.3, oz0 + 0.3, 0.12], [ox0 + 0.75, oz0 + 0.3, 0.12], [ox0 + 0.3, oz0 + 0.3, 0.42], [ox1 - 0.6, oz0 + 0.3, 0.12], [ox0 + 0.3, oz0 + 0.8, 0.12]]) box(b, cartonM, x, y, z, x + 0.4, y + 0.3, z + 0.3);
  let ci = 0; for (const x of [-9.0, -6.2, 3.6, 6.4]) { container(x, -6.06, "z", cols[ci++ % 5]); if (x < -6 || x > 6) container(x, -6.06, "z", cols[(ci + 2) % 5], 2.6); }
  for (const x of [-16, -9.5, 2.5, 9]) container(x, -16, "x", cols[ci++ % 5]);
  for (const z of [-3, 3.5]) container(-17, z, "z", cols[ci++ % 5]);
  for (const z of [-4, 2.4]) container(22, z, "z", cols[ci++ % 5]);
  for (let x = -20; x <= 12; x += 2.5) if (Math.abs(x) > YP.gate[1] - 0.1) { box(b, C("#5b6170"), x - 0.04, 0, YP.fence_z - 0.04, x + 0.04, 2.4, YP.fence_z + 0.04); }
  box(b, C("#2f9a55"), -13.0, 0, 5.5, -10.0, 2.6, 8.0); box(b, white, -13.0, 2.6, 5.4, -10.0, 2.7, 8.1);
  for (const [x, z] of [[-12, 6], [11, -8]]) { cyl(b, C("#5b6170"), x, 0, z, 0.12, 0.1, 9, 8); box(b, white, x - 0.6, 8.8, z - 0.2, x + 0.6, 9.2, z + 0.2); }
  box(b, C("#c99a62"), YP.pallet[0] - 0.6, 0, YP.pallet[1] - 0.5, YP.pallet[0] + 0.6, 0.14, YP.pallet[1] + 0.5);
  { const s1 = lam("skyM1", () => ({ map: skyline("M1", "#e8a08a") })), s2 = lam("skyM2", () => ({ map: skyline("M2", "#d88a8a") })), s3 = lam("skyM3", () => ({ map: skyline("M3", "#f2b48a") }));
    for (const [x, w, h, m] of [[-60, 12, 40, s1], [-40, 9, 70, s2], [-22, 10, 52, s3], [-6, 8, 110, s2], [8, 11, 60, s1], [26, 9, 82, s3], [44, 12, 48, s2], [62, 10, 64, s1]] as [number, number, number, THREE.Material][]) box(b, m, x - w / 2, 0, -95, x + w / 2, h, -86, 8); }
  for (const [x, z] of [[-24, 18], [22, 20], [-6, 26]]) tree(b, x, z, 1.3);
  b.build(yd);
  { const fm = new THREE.MeshBasicMaterial({ map: rep(ctex("mesh", 64, 64, (g) => { g.clearRect(0, 0, 64, 64); g.strokeStyle = "#5b6170"; g.lineWidth = 3; g.strokeRect(0, 0, 64, 64); }), 30, 2), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide });
    for (const [x0, x1] of [[-20, YP.gate[0]], [YP.gate[1], 12]]) plane(x1 - x0, 2.3, fm, yd, (x0 + x1) / 2, 1.15, YP.fence_z); }
  plane(2.6, 0.5, lamC(tex("yardSign", 1040, 200, (p) => A2.officeSign(p, 1040, 200, "SELF STORAGE YARD", "#e8782f"))), yd, -11.5, 2.0, 8.02);
  const cDoors: THREE.Group[] = [];
  for (const s of [-1, 1]) { const d = new THREE.Group(); d.position.set(s < 0 ? ox0 : ox1, 0, oz1); yd.add(d); cDoors.push(d);
    const w = (ox1 - ox0) / 2; mesh(new THREE.BoxGeometry(w, OH, 0.05), om, d, -s * w / 2, OH / 2, 0.03); for (const k2 of [0.3, 0.7]) mesh(new THREE.CylinderGeometry(0.02, 0.02, OH - 0.2, 6), C("#5b6170"), d, -s * w * k2, OH / 2, 0.07); }
  // the police car (body nose +x) and its light bar
  const car = new THREE.Group(); yd.add(car);
  const barMats = [new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.5, 3.0) }), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.5, 3.0) })];
  { const cb = new Batch(); box(cb, white, -2.3, 0.35, -0.88, 2.3, 1.0, 0.88); box(cb, white, -1.3, 1.0, -0.8, 0.9, 1.5, 0.8); box(cb, C("#2a2c33"), -2.32, 0.3, -0.9, 2.32, 0.4, 0.9);
    for (const x of [-1.5, 1.5]) for (const z of [-0.8, 0.8]) cyl(cb, M.tyre(), x, 0.34, z - 0.1 * Math.sign(z), 0.34, 0.34, 0.22, 14, new THREE.Euler(Math.PI / 2, 0, 0)); cb.build(car);
    for (const z of [-0.885, 0.885]) plane(4.5, 0.3, lamC(tex("checks", 1200, 80, (p) => A2.policeCheck(p, 1200, 80))), car, 0, 0.72, z, z > 0 ? 0 : Math.PI);
    for (const z of [-0.81, 0.81]) plane(2.0, 0.42, glassMat(0.5, "#5a6688"), car, -0.2, 1.25, z);
    mesh(new THREE.BoxGeometry(0.3, 0.1, 1.1), C("#2a2c33"), car, -0.2, 1.55, 0); mesh(new THREE.BoxGeometry(0.26, 0.1, 0.45), barMats[0], car, -0.2, 1.6, -0.27); mesh(new THREE.BoxGeometry(0.26, 0.1, 0.45), barMats[1], car, -0.2, 1.6, 0.27);
    plane(0.9, 0.18, lamC(tex("carPol", 500, 100, (p) => A2.plainSign(p, 500, 100, "POLICE", "#ffffff", "#1f4fa8"))), car, 0.6, 1.05, 0.89); }
  // the dropped carton (S11-S12) and the recovered stack (S12)
  const drop = new THREE.Group(); yd.add(drop); cartonMesh(drop);
  const stack = new THREE.Group(); stack.position.set(YP.stack[0], 0, YP.stack[1]); yd.add(stack);
  { const sb = new Batch(); box(sb, C("#c99a62"), -0.85, 0, -0.45, 0.85, 0.14, 0.45); let n = 0;
    for (let lv = 0; lv < 4 && n < 26; lv++) for (let i = 0; i < 4 && n < 26; i++) for (let j = 0; j < 2 && n < 26; j++) { const lx = -0.8 + i * 0.41 + 0.2 * (lv === 3 ? 1 : 0), ly = 0.14 + lv * 0.31, lz = -0.43 + j * 0.44; box(sb, cartonM, lx, ly, lz, lx + 0.4, ly + 0.3, lz + 0.42); n++; }
    sb.build(stack);
    const tp = new THREE.MeshBasicMaterial({ map: rep(ctex("ptape", 256, 32, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#1d1b22" : "#f2d23a"; g.fillRect(i * 32, 0, 32, 32); } }), 4, 1), side: THREE.DoubleSide });
    for (const [x, z, ry] of [[0, 0.62, 0], [0, -0.62, 0], [1.05, 0, Math.PI / 2], [-1.05, 0, Math.PI / 2]] as [number, number, number][]) plane(ry ? 1.24 : 2.1, 0.08, tp, stack, x, 0.9, z, ry);
    for (const [x, z] of [[-1.05, -0.62], [1.05, -0.62], [-1.05, 0.62], [1.05, 0.62]]) mesh(new THREE.ConeGeometry(0.15, 0.6, 10), C("#f2782f"), stack, x, 0.3, z); }

  // ===================== THE COURT FRONT (Mansfield) =====================
  SETL = "court";
  const CO = COURTP, ct = G("court", ORIGIN.court);
  b = new Batch();
  const [fx0, fx1] = CO.front, FH = CO.h, [cdx0, cdx1, cdy] = CO.door;
  const cbrick = lam("brickC", () => ({ map: brickT("C") })), stone = C("#f2e6cc");
  up(b, lam("plaza", () => ({ map: concrete("plaza", "#ead9bc") })), -20, 20, 0.5, 14, 0, 1.2);
  up(b, M.asphalt(), -40, 40, 14, 24, 0, 5); up(b, lam("grassC", () => ({ color: "#5fb04a" })), -60, 60, -30, 60, -0.012, 8);
  box(b, cbrick, fx0, 0, -0.4, cdx0, FH, 0, 1); box(b, cbrick, cdx1, 0, -0.4, fx1, FH, 0, 1); box(b, cbrick, cdx0, cdy + 0.6, -0.4, cdx1, FH, 0, 1);
  for (const y of [3.2, 5.6, 8.8]) box(b, stone, fx0 - 0.03, y, 0, fx1 + 0.03, y + 0.22, 0.06);
  box(b, cbrick, fx0, 0, -14, fx0 + 0.3, FH, -0.4); box(b, cbrick, fx1 - 0.3, 0, -14, fx1, FH, -0.4); box(b, C("#c9643a"), fx0 - 0.2, FH, -14.2, fx1 + 0.2, FH + 0.25, 0.25);
  box(b, stone, cdx0 - 0.4, cdy + 0.6, 0, cdx1 + 0.4, cdy + 0.75, 1.6); box(b, stone, cdx0 - 0.35, 0, 0, cdx0 - 0.25, cdy + 0.6, 1.5); box(b, stone, cdx1 + 0.25, 0, 0, cdx1 + 0.35, cdy + 0.6, 1.5);
  box(b, stone, cdx0 - 1.0, 0, 0.02, cdx1 + 1.0, 0.12, 0.5);
  box(b, C("#2a2c33"), CO.board[0] - CO.board_size[0] / 2 - 0.04, CO.board[1] - CO.board_size[1] / 2 - 0.04, 0, CO.board[0] + CO.board_size[0] / 2 + 0.04, CO.board[1] + CO.board_size[1] / 2 + 0.04, 0.045);
  { const [spx, spz] = CO.signpost; cyl(b, C("#f4f1ea"), spx, 0, spz, 0.06, 0.06, 2.9, 10); for (let y = 0.2; y < 2.6; y += 0.5) cyl(b, C("#1a1a1a"), spx, y, spz, 0.062, 0.062, 0.25, 10); sph(b, C("#1a1a1a"), spx, 2.92, spz, 0.08); }
  for (const x of [-6.5, -4.2, 4.2, 6.5]) { box(b, C("#c9a46a"), x - 0.5, 0, 1.6, x + 0.5, 0.5, 2.6); sph(b, C("#d8322f"), x - 0.2, 0.6, 2.1, 0.25); sph(b, C("#f2c23a"), x + 0.2, 0.6, 2.0, 0.22); sph(b, C("#3fa048"), x, 0.62, 2.3, 0.24); }
  for (const [x, z] of [[-10.5, 6], [10.5, 7], [-13, 12], [13, 11]]) tree(b, x, z, 1.4, ["#e8782f", "#f2c23a"]);
  for (const [x, z, c] of [[-7, 16.5, "#d8322f"], [-1, 16.5, "#2f5fb4"], [6, 16.5, "#f2c23a"]] as [number, number, string][]) parkedCar(b, x, z, c);
  for (let i = 0; i < 6; i++) { const x0 = -24 + i * 8; box(b, lam("hs" + i, () => ({ map: stucco("hs" + i, ["#f6e2b0", "#f2a878", "#cfe6ff", "#f6e2b0", "#e8c0a0", "#d9ecd0"][i]) })), x0, 0, 26, x0 + 7.2, 6.5, 32); box(b, C("#c9643a"), x0 - 0.1, 6.5, 25.8, x0 + 7.3, 7.0, 32.2); }
  b.build(ct);
  for (let r = 0; r < 3; r++) for (const x of [-6.6, -5.0, -3.4, 3.4, 5.0, 6.6]) plane(1.0, 1.4, sky("ctw" + r + x), ct, x, [1.6, 4.4, 7.2][r], 0.004);
  plane(cdx1 - cdx0, cdy + 0.6, glassMat(0.2, "#bfe0f2"), ct, 0, (cdy + 0.6) / 2, -0.3);
  plane(9.2, 0.5, lamC(tex("courtLet", 1840, 100, (p) => A2.courtLetters(p, 1840, 100)), true), ct, 0, 6.5, 0.01);
  plane(CO.board_size[0], CO.board_size[1], lamC(tex("notice", 900, 700, (p) => A2.noticeSheet(p, 900, 700))), ct, CO.board[0], CO.board[1], 0.05);
  plane(CO.board_size[0], CO.board_size[1], glassMat(0.12), ct, CO.board[0], CO.board[1], 0.06);
  { const [spx, spz] = CO.signpost;
    for (const [y, txt, right, ry] of [[2.5, "RETFORD 20", true, 0], [2.15, "MANSFIELD CENTRE", false, 0.4], [1.8, "NOTTINGHAM 14", false, -0.6]] as [number, string, boolean, number][]) {
      const g2 = new THREE.Group(); g2.position.set(spx, y, spz); g2.rotation.y = ry; ct.add(g2);
      mesh(new THREE.PlaneGeometry(1.2, 0.24), lam("arm" + txt, () => ({ map: tex("arm" + txt, 600, 120, (p) => A2.fingerArm(p, 600, 120, txt, right)), side: THREE.DoubleSide })), g2, right ? 0.62 : -0.62, 0, 0); } }
  const courtDoors: THREE.Group[] = [];
  for (const s of [-1, 1]) { const d = new THREE.Group(); d.position.set(s < 0 ? cdx0 : cdx1, 0, -0.12); ct.add(d); courtDoors.push(d);
    const w = (cdx1 - cdx0) / 2; mesh(new THREE.BoxGeometry(w, cdy, 0.05), glassMat(0.25, "#bfe0f2"), d, -s * w / 2, cdy / 2, 0);
    for (const yy of [0.05, cdy - 0.05]) mesh(new THREE.BoxGeometry(w, 0.1, 0.06), C("#2a2c33"), d, -s * w / 2, yy, 0); mesh(new THREE.BoxGeometry(0.06, cdy, 0.06), C("#2a2c33"), d, -s * (w - 0.03), cdy / 2, 0); }

  // ===================== THE COURTROOM =====================
  SETL = "courtroom";
  const RP = ROOMP, rm = G("courtroom", ORIGIN.courtroom);
  b = new Batch();
  const [rx0b, rx1b, rz0b, rz1b] = RP.room, RH = RP.h;
  up(b, lam("crCarpet", () => ({ color: "#2f8a4a" })), rx0b, rx1b, rz0b, rz1b, 0, 2);
  const panelM = lam("crPanel", () => ({ map: woodTex("cr", "#b5703c", "rgba(90,50,20,0.5)") })), crWall = lam("crWall", () => ({ map: paintWall("cr", "#fbf3dc") }));
  for (const [x0, z0, x1, z1] of [[rx0b - 0.1, rz0b - 0.1, rx1b + 0.1, rz0b], [rx0b - 0.1, rz0b, rx0b, rz1b], [rx1b, rz0b, rx1b + 0.1, rz1b]]) { box(b, panelM, x0, 0, z0, x1, 1.6, z1, 1); box(b, crWall, x0, 1.6, z0, x1, RH, z1, 2); }
  box(b, C("#8a5230"), rx0b, 1.6, rz0b, rx1b, 1.68, rz0b + 0.04);
  box(b, oak, 1.3, 0, rz0b, 4.0, 1.2, rz0b + 1.3); box(b, oakD, 1.3, 1.2, rz0b, 4.0, 1.26, rz0b + 1.35);   // the bench (empty, no chairs)
  box(b, oak, -3.2, 0, -2.6, -1.4, 0.95, -2.0);                                                        // the clerk's desk (standing height)
  const [dkX0, dkX1, dkZ0, dkZ1] = RP.dock;
  box(b, oakD, dkX0, 0, dkZ0, dkX1, 0.15, dkZ1); box(b, oak, dkX0, 0.15, dkZ1 - 0.06, dkX1, 0.6, dkZ1); box(b, oak, dkX0, 0.15, dkZ0, dkX0 + 0.06, 0.6, dkZ1 - 0.06); box(b, oak, dkX1 - 0.06, 0.15, dkZ0, dkX1, 0.6, dkZ1 - 0.06);
  for (const x of [dkX0, dkX1 - 0.04]) for (const z of [dkZ0, dkZ1 - 0.04]) box(b, brass, x, 0.6, z, x + 0.04, RP.dock_h + 0.45, z + 0.04);
  box(b, ink, RP.tv[0] - RP.tv_size[0] / 2 - 0.04, RP.tv[1] - RP.tv_size[1] / 2 - 0.04, rz0b, RP.tv[0] + RP.tv_size[0] / 2 + 0.04, RP.tv[1] + RP.tv_size[1] / 2 + 0.04, rz0b + 0.05);
  b.build(rm);
  ceilingAt(rm, rx0b, rx1b, rz0b, rz1b, RH, "#fbf3e2");
  for (const z of [-2.2, 0.4, 3.0]) plane(1.1, 1.8, sky("crw" + z), rm, rx0b + 0.006, 2.6, z, Math.PI / 2);
  for (const [z0, z1, x] of [[dkZ0, dkZ1, dkX0 + 0.005], [dkZ0, dkZ1, dkX1 - 0.005]] as [number, number, number][]) plane(z1 - z0, RP.dock_h + 0.45 - 0.6, glassMat(0.14), rm, x, 0.6 + (RP.dock_h - 0.15) / 2, (z0 + z1) / 2, Math.PI / 2);
  plane(dkX1 - dkX0, RP.dock_h - 0.15, glassMat(0.12), rm, (dkX0 + dkX1) / 2, 0.6 + (RP.dock_h - 0.15) / 2, dkZ1 + 0.004);
  const tv = canvasMat(1530, 864); plane(RP.tv_size[0], RP.tv_size[1], basicC(tv.tex), rm, RP.tv[0], RP.tv[1], rz0b + 0.054);
  plane(1.0, 0.3, lamC(tex("crPlaque", 800, 240, (p) => A2.plainSign(p, 800, 240, "COURT 2", "#2f5fb4", "#ffffff"))), rm, 2.65, 2.2, rz0b + 0.004);

  // transparent things draw no ink
  for (const g of [...Object.values(groups), van]) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void sign; void bush; void palm; void lamp; void wheels; void grassHD; void planksHD; void roofHD; void beam; void brick; void water; void stoneHD; void LOOKS; void white;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, van, vanDoors, plate, vanCal, calPage: calPage!, calPageC, tail, plug, bricks, holeOut, holeIn, patch, tunnel, plugRing, hammer: null as unknown as THREE.Mesh, strobe, cctvHead, recMat, roadRec, panel, bulbs, door, rackGap, carry,
    cover, label, peel, peelC, newLabel, map, mons, car, barMats, drop, stack, cDoors, courtDoors, tv };
};
const bill2 = (p: Pen) => billArt(p, 470, 200);
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
void callerId; void monitorFeed; void itemArt; void spoonTray; void VANP;
