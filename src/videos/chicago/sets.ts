// The sets of the Chicago reel (the Old Skool TCG shop with its facade and the street, the house, the jacket lining), built once (static scenery batched per material) plus the moving pieces as their own objects.
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
import { V3, obj, ORIGIN, SHOPP, HOUSEP, JACKP } from "./story";

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
  box: THREE.Group; items: THREE.Mesh[]; itemC: Canvas[];
  drawer: THREE.Mesh; handset: THREE.Group; stack: THREE.Group; door: THREE.Group; caseDoor: THREE.Group; shackle: THREE.Mesh;
  monitor: Canvas; lcd: Canvas; recMat: THREE.MeshBasicMaterial; banner: THREE.Mesh;
  houseDoor: THREE.Group; gift: THREE.Group; tray: Canvas; spoon: THREE.Mesh; jItems: Canvas[];
};
export const TY = 0.76;

const woodTex = (key: string, base: string, dark: string) => ctex("wood" + key, 512, 512, (g, r) => {
  for (let i = 0; i < 8; i++) { g.fillStyle = jit(r, base, 0.05, 3, 0.1); g.fillRect(0, i * 64, 512, 64); g.fillStyle = dark; g.fillRect(0, i * 64 + 61, 512, 3); }
  for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(60,35,20,0.07)"; g.fillRect(r() * 512, r() * 512, 40 + r() * 80, 2); }
});
const paintWall = (key: string, base: string) => ctex("wall" + key, 512, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 14, "255,255,255", 0.06, 120); blot(g, r, 512, 512, 10, "80,70,60", 0.04, 120);
});
/** the shop floor: 50 cm checkered tiles, cream and tomato red (one texture = 2 x 2 tiles = 1 m) */
const checker = () => ctex("checker", 512, 512, (g, r) => {
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = jit(r, (i + j) % 2 ? "#e2604e" : "#f6ead0", 0.03, 2, 0.08); g.fillRect(i * 256, j * 256, 256, 256); }
  g.fillStyle = "rgba(120,70,50,0.35)"; for (const k of [0, 256]) { g.fillRect(k, 0, 3, 512); g.fillRect(0, k, 512, 3); }
});
/** Chicago red brick with cream mortar (one texture = 1 m) */
const redBrick = (key: string, base: string) => ctex("rbrick" + key, 512, 512, (g, r) => {
  g.fillStyle = "#efe0c4"; g.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 14; row++) for (let i = -1; i < 5; i++) {
    const x = i * 128 + (row % 2) * 64, y = row * 36.57; g.fillStyle = jit(r, base, 0.08, 4, 0.12); g.fillRect(x + 3, y + 3, 122, 30);
  }
});
const stucco2 = (key: string, base: string) => ctex("stuc2" + key, 512, 512, (g, r) => { g.fillStyle = base; g.fillRect(0, 0, 512, 512); blot(g, r, 512, 512, 20, "255,255,255", 0.08, 110); blot(g, r, 512, 512, 14, "120,80,50", 0.05, 110); });
const staves = () => ctex("staves", 512, 256, (g, r) => { for (let i = 0; i < 16; i++) { g.fillStyle = jit(r, "#b8743e", 0.06, 3, 0.1); g.fillRect(i * 32, 0, 30, 256); } g.fillStyle = "#5a3a22"; for (const y of [40, 128, 216]) g.fillRect(0, y, 512, 8); });
const skyline = (key: string, base: string) => ctex("sky" + key, 256, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 256, 512);
  for (let y = 12; y < 512; y += 22) for (let x = 12; x < 244; x += 26) { g.fillStyle = r() > 0.4 ? "rgba(255,255,255,0.45)" : "rgba(40,80,140,0.25)"; g.fillRect(x, y, 14, 12); }
});
/** blue sky with puffy white inked clouds (quality bar: every window and outdoor shot) */
const cloudSky = (key: string, top = "#3f86e0", bot = "#bfe0fb") => ctex("cloudSky" + key, 512, 512, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  const puff = (cx: number, cy: number, s: number) => {
    const bl = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.25, 0.75], [-0.4, -0.35, 0.75], [0.45, -0.3, 0.65]];
    g.fillStyle = "#3a4a6a"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s + 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#ffffff"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); g.fill(); }
  };
  puff(130, 150, 46); puff(380, 110, 38); puff(300, 330, 30);
});
const stripes = (a: string, b: string) => ctex("stripes" + a + b, 256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 32, 0, 32, 64); } });
const cardTexture = (name: string) => ctex("card" + name, 600, 838, (g) => { g.clearRect(0, 0, 600, 838); scan(g, name, 0, 0, 600, 838); });
const canvasMat2 = (w: number, h: number): Canvas => canvasMat(w, h);

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const lamC = (tex: THREE.Texture, transparent = false) => new THREE.MeshLambertMaterial({ map: tex, transparent, alphaTest: transparent ? 0.5 : 0 });
  const basicC = (tex: THREE.Texture, transparent = false) => new THREE.MeshBasicMaterial({ map: tex, transparent, alphaTest: transparent ? 0.02 : 0 });
  const tex = (key: string, W: number, H: number, draw: (p: Pen) => void) => ctex(key, W, H, (g) => draw(new Pen(g)));
  const glassMat = (op = 0.18) => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
  const white = C("#f6f3ec"), ink = C("#2a2c33"), oak = C("#b5703c"), oakD = C("#8a5230"), brass = C("#d4a84a"), cream = C("#fbf3dc");
  const frameCard = (parent: THREE.Object3D, nm: string, x: number, y: number, z: number, h: number, ry = 0) => {
    const g2 = new THREE.Group(); g2.position.set(x, y, z); g2.rotation.y = ry; parent.add(g2);
    mesh(new THREE.BoxGeometry(h * 0.716 + 0.08, h + 0.08, 0.02), C("#b8862a"), g2, 0, 0, -0.012);
    mesh(new THREE.PlaneGeometry(h * 0.716 + 0.04, h + 0.04), cream, g2, 0, 0, -0.0005);
    mesh(new THREE.PlaneGeometry(h * 0.716, h), new THREE.MeshBasicMaterial({ map: cardTexture(nm), transparent: true, alphaTest: 0.5 }), g2, 0, 0, 0.002);
  };
  const windowOn = (b: Batch, g: THREE.Group, axis: "x" | "z", at: number, n: number, c: number, y0: number, y1: number, w: number, skyTex: THREE.Texture, frame: THREE.Material) => {
    const d = 0.006 * n;
    plane(w, y1 - y0, new THREE.MeshBasicMaterial({ map: skyTex }), g, axis === "x" ? at + d : c, (y0 + y1) / 2, axis === "x" ? c : at + d, axis === "x" ? (n > 0 ? Math.PI / 2 : -Math.PI / 2) : (n > 0 ? 0 : Math.PI));
    const t = 0.05, dep = 0.06 * n;
    const bx = (a0: number, a1: number, yy0: number, yy1: number) => axis === "x" ? box(b, frame, Math.min(at, at + dep), yy0, a0, Math.max(at, at + dep), yy1, a1) : box(b, frame, a0, yy0, Math.min(at, at + dep), a1, yy1, Math.max(at, at + dep));
    bx(c - w / 2 - t, c + w / 2 + t, y0 - t, y0); bx(c - w / 2 - t, c + w / 2 + t, y1, y1 + t); bx(c - w / 2 - t, c - w / 2, y0, y1); bx(c + w / 2, c + w / 2 + t, y0, y1);
  };
  const ceilingAt = (g: THREE.Group, x0: number, x1: number, z0: number, z1: number, h: number, col: string) => {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lam("ceil" + col, () => ({ color: col }))); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, h - 0.002, (z0 + z1) / 2); g.add(c);
  };

  // ===================== THE SHOP (interior, facade, street) =====================
  SETL = "shop";
  const P = SHOPP, shop = G("shop", ORIGIN.shop);
  const [rx0, rx1, rz0, rz1] = P.room, RH = P.h, FZ = P.front_z, TOPY = P.counter_y;
  let b = new Batch();
  up(b, lam("checker", () => ({ map: checker() })), rx0, rx1, rz0, FZ, 0, 1);
  const wallM = lam("shopWall", () => ({ map: paintWall("shop", "#fff1d2") })), brickM = lam("brickShop", () => ({ map: redBrick("shop", "#b8432f") }));
  box(b, wallM, rx0 - 0.1, 0, rz0 - 0.1, rx1 + 0.1, RH, rz0, 2);            // back wall
  box(b, wallM, rx0 - 0.1, 0, rz0, rx0, RH, FZ, 2); box(b, wallM, rx1, 0, rz0, rx1 + 0.1, RH, FZ, 2); // side walls
  const dado = C("#c0323c");
  box(b, dado, rx0, 0.88, rz0 + 0.4, rx0 + 0.02, 0.98, FZ - 0.05); box(b, dado, rx1 - 0.02, 0.88, rz0 + 0.4, rx1, 0.98, FZ - 0.05);
  // the front wall, brick both sides, with the window and door openings
  const [wx0, wx1, wy0, wy1] = P.window, [dx0, dx1, , dy1] = P.door, FZ1 = FZ + 0.2;
  box(b, brickM, -3.7, 0, FZ, wx0, RH, FZ1, 1); box(b, brickM, wx0, 0, FZ, wx1, wy0, FZ1, 1); box(b, brickM, wx0, wy1, FZ, wx1, RH, FZ1, 1);
  box(b, brickM, wx1, 0, FZ, dx0, RH, FZ1, 1); box(b, brickM, dx0, dy1, FZ, dx1, RH, FZ1, 1); box(b, brickM, dx1, 0, FZ, 3.7, RH, FZ1, 1);
  // window frame (green) and sill
  const frameG = C("#2f7a4a");
  box(b, frameG, wx0, wy0 - 0.06, FZ - 0.02, wx1, wy0, FZ1 + 0.06); box(b, frameG, wx0, wy1, FZ - 0.01, wx1, wy1 + 0.05, FZ1 + 0.03);
  box(b, frameG, wx0 - 0.05, wy0, FZ - 0.01, wx0, wy1, FZ1 + 0.03); box(b, frameG, wx1, wy0, FZ - 0.01, wx1 + 0.05, wy1, FZ1 + 0.03);
  box(b, frameG, dx0 - 0.05, 0, FZ - 0.01, dx0, dy1 + 0.05, FZ1 + 0.03); box(b, frameG, dx1, 0, FZ - 0.01, dx1 + 0.05, dy1 + 0.05, FZ1 + 0.03); box(b, frameG, dx0, dy1, FZ - 0.01, dx1, dy1 + 0.05, FZ1 + 0.03);
  // the upper storey, cornice, upper windows; the neighbours
  box(b, brickM, -3.7, RH, FZ, 3.7, 6.0, FZ1, 1); box(b, cream, -3.75, 6.0, FZ - 0.05, 3.75, 6.3, FZ1 + 0.18); box(b, cream, -3.72, 3.36, FZ1, 3.72, 3.44, FZ1 + 0.08);
  box(b, brickM, -3.7, RH, rz0 - 0.1, -3.5, 6.0, FZ); box(b, brickM, 3.5, RH, rz0 - 0.1, 3.7, 6.0, FZ); // side walls of the upper storey (seen from the street at an angle)
  box(b, C("#c9643a"), -3.7, 6.0, rz0 - 0.1, 3.7, 6.05, FZ - 0.05);   // the roof
  for (const x of [-0.6, 1.4]) { box(b, cream, x - 0.55, 3.95, FZ1, x + 0.55, 4.02, FZ1 + 0.06); box(b, cream, x - 0.6, 5.42, FZ1, x + 0.6, 5.52, FZ1 + 0.1); }
  // the water tower on the roof: four legs, a staved tank, a cone roof
  const [wtx, , wtz] = [-1.5, 0, 2.2];
  for (const [ox, oz] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) cyl(b, oakD, wtx + ox, 6.05, wtz + oz, 0.06, 0.06, 0.75, 8);
  box(b, oakD, wtx - 0.9, 6.75, wtz - 0.9, wtx + 0.9, 6.82, wtz + 0.9);
  cyl(b, lam("staves", () => ({ map: staves() })), wtx, 6.82, wtz, 1.0, 1.0, 1.3, 24);
  b.add(new THREE.ConeGeometry(1.12, 0.6, 24).translate(wtx, 8.12 + 0.3, wtz), C("#6a4a2e"));
  // neighbours: a laundromat (left) and a café (right)
  const laundM = lam("laund", () => ({ map: stucco2("laund", "#f6e2b0") })), cafeM = lam("cafeN", () => ({ map: stucco2("cafeN", "#f2a878") }));
  box(b, laundM, -12, 0, FZ - 6, -3.7, 5.2, FZ + 0.1); box(b, cafeM, 3.7, 0, FZ - 6, 12, 7.0, FZ + 0.1);
  box(b, C("#2f9ad8"), -11.5, 2.5, FZ + 0.1, -4.2, 2.62, FZ + 1.2); // laundromat awning (flat slab, the stripes go on the café)
  box(b, C("#2f7a4a"), -10.5, 0.4, FZ + 0.1, -5.0, 2.3, FZ + 0.16); box(b, C("#2f7a4a"), 4.4, 0.4, FZ + 0.1, 10.5, 2.4, FZ + 0.16);
  box(b, cream, -12.05, 5.2, FZ - 6, -3.7, 5.4, FZ + 0.2); box(b, cream, 3.7, 7.0, FZ - 6, 12.05, 7.2, FZ + 0.2);
  // the far skyline (light blue towers behind the roofs)
  const sky1 = lam("skyA", () => ({ map: skyline("A", "#8fb8e2") })), sky2 = lam("skyB", () => ({ map: skyline("B", "#a8c8ec") })), sky3 = lam("skyC", () => ({ map: skyline("C", "#6f9ad0") }));
  for (const [x, w, h, m] of [[-38, 10, 46, sky2], [-24, 8, 62, sky1], [-12, 9, 38, sky2], [-2, 7, 84, sky3], [9, 10, 55, sky1], [22, 8, 70, sky2], [34, 11, 42, sky1]] as [number, number, number, THREE.Material][]) box(b, m, x - w / 2, 0, -70, x + w / 2, h, -62, 8);
  // the sidewalk, the curb, the street
  up(b, lam("walk", () => ({ map: concrete() })), -12, 12, FZ1, P.walk[1], 0, 2);
  box(b, C("#e6e0d4"), -12, 0, P.walk[1], 12, 0.12, P.walk[1] + 0.2);
  up(b, lam("asphaltS", () => ({ map: asphalt("asphaltS", "#6f6c78") })), -14, 14, P.walk[1] + 0.2, P.street[1] + 6, 0, 6);
  box(b, C("#f2c84a"), -14, 0, 13.4, 14, 0.006, 13.55);
  // street furniture: lamp post, hydrant, planter tree, bike rack, newspaper box, a parked taxi
  const pole2 = C("#2f6a4a");
  cyl(b, pole2, 3.3, 0, 8.4, 0.08, 0.06, 4.2, 10); box(b, pole2, 3.0, 4.15, 8.32, 3.6, 4.25, 8.48); sph(b, C("#fff3c4"), 3.3, 4.45, 8.4, 0.2);
  cyl(b, C("#d8322f"), -2.6, 0, 8.3, 0.12, 0.12, 0.55, 12); sph(b, C("#d8322f"), -2.6, 0.58, 8.3, 0.13); cyl(b, C("#d8322f"), -2.6, 0.35, 8.16, 0.05, 0.05, 0.12, 8, new THREE.Euler(Math.PI / 2, 0, 0));
  box(b, C("#b8743e"), -5.2, 0, 7.4, -4.2, 0.5, 8.4); cyl(b, C("#7a4a2a"), -4.7, 0.5, 7.9, 0.09, 0.07, 1.8, 8); sph(b, C("#3fa048"), -4.7, 2.7, 7.9, 0.9); sph(b, C("#4fb050"), -4.3, 3.0, 8.0, 0.6);
  for (const x of [-1.2, -0.7]) { cyl(b, C("#2f5fb4"), x, 0, 8.25, 0.025, 0.025, 0.8, 8); cyl(b, C("#2f5fb4"), x + 0.4, 0, 8.25, 0.025, 0.025, 0.8, 8); box(b, C("#2f5fb4"), x, 0.78, 8.23, x + 0.4, 0.83, 8.27); }
  box(b, C("#2f5fb4"), 3.0, 0, 6.0, 3.45, 1.1, 6.4); box(b, C("#bfe6f8"), 3.05, 0.65, 6.405, 3.4, 0.95, 6.41);
  { const tx = 7.0, tz = 10.0, ty = C("#f2c23a"); box(b, ty, tx - 2.2, 0.35, tz - 0.85, tx + 2.2, 1.0, tz + 0.85); box(b, ty, tx - 1.2, 1.0, tz - 0.78, tx + 0.9, 1.55, tz + 0.78);
    box(b, M.glass(), tx - 1.1, 1.03, tz - 0.8, tx + 0.8, 1.5, tz + 0.8); box(b, C("#fbf3dc"), tx - 0.3, 1.55, tz - 0.2, tx + 0.2, 1.72, tz + 0.2);
    box(b, C("#1d1b22"), tx - 2.2, 0.62, tz + 0.851, tx + 2.2, 0.68, tz + 0.86);
    for (const ox of [-1.4, 1.4]) for (const oz of [-0.85, 0.85]) cyl(b, M.tyre(), tx + ox, 0.36, tz + oz - 0.12 * Math.sign(oz), 0.36, 0.36, 0.24, 14, new THREE.Euler(Math.PI / 2, 0, 0)); }

  // ---- inside: the back wall shelving, the counter, the case, the play table ----
  box(b, oakD, rx0 + 0.1, 0, rz0, rx1 - 0.1, 2.5, rz0 + 0.33);          // the shelving carcass (its face is the canvas)
  const [cx0, cx1, cz0, cz1] = P.counter;
  box(b, oak, cx0, 0, cz0, cx1, 0.62, cz1, 0.5);                          // counter base
  box(b, oakD, cx0, 0, cz1 - 0.02, cx1, 0.1, cz1 + 0.02);                // kick plate
  box(b, oak, 0.25, 0.62, cz0, cx1, TOPY, cz1, 0.5);                       // the solid right part (the box, the register, the phone sit on it)
  box(b, brass, 0.25 - 0.01, TOPY - 0.012, cz0 - 0.01, cx1 + 0.01, TOPY + 0.004, cz1 + 0.01);
  // the glass display part (left): an oak frame, a red felt bed with real cards, glass front and top
  box(b, oak, cx0, 0.62, cz0, cx0 + 0.04, TOPY, cz1); box(b, oak, 0.21, 0.62, cz0, 0.25, TOPY, cz1); box(b, oak, cx0, 0.62, cz0, 0.25, TOPY, cz0 + 0.04);
  box(b, brass, cx0 - 0.01, TOPY - 0.006, cz1 - 0.02, 0.25, TOPY + 0.008, cz1 + 0.01);
  box(b, C("#a8282e"), cx0 + 0.04, 0.62, cz0 + 0.04, 0.21, 0.66, cz1 - 0.02);
  // the register: body, keypad, screen stalk (the drawer is its own mesh)
  const [rgx, , rgz] = P.register;
  box(b, C("#c0323c"), rgx - 0.18, TOPY, rgz - 0.15, rgx + 0.18, TOPY + 0.13, rgz + 0.15);
  box(b, C("#2a2c33"), rgx - 0.15, TOPY + 0.13, rgz - 0.02, rgx + 0.15, TOPY + 0.16, rgz + 0.12);
  box(b, C("#2a2c33"), rgx - 0.015, TOPY + 0.13, rgz - 0.12, rgx + 0.015, TOPY + 0.3, rgz - 0.09); box(b, C("#2a2c33"), rgx - 0.12, TOPY + 0.28, rgz - 0.13, rgx + 0.12, TOPY + 0.39, rgz - 0.11);
  // the phone base
  const [phx, , phz] = P.phone;
  box(b, C("#f2e6cc"), phx - 0.1, TOPY, phz - 0.08, phx + 0.1, TOPY + 0.05, phz + 0.08);
  // the glass case: posts, top, base, glass shelves (transparent), the back panel
  const [kx0, kx1, kz0, kz1] = P.case, KH = P.case_h;
  for (const z of [kz0, kz1 - 0.05]) for (const x of [kx0, kx1 - 0.05]) box(b, oak, x, 0.0, z, x + 0.05, KH, z + 0.05);
  box(b, oak, kx0, 0, kz0, kx1, 0.3, kz1); box(b, oak, kx0, KH, kz0 - 0.01, kx1 + 0.02, KH + 0.06, kz1 + 0.01); box(b, C("#a8282e"), kx0 + 0.01, 0.3, kz0 + 0.05, kx0 + 0.03, KH, kz1 - 0.05);
  // the play table and stools
  const [tbx0, tbx1, tbz0, tbz1] = P.table, TB = P.table_y;
  box(b, oak, tbx0, TB - 0.05, tbz0, tbx1, TB, tbz1); for (const x of [tbx0 + 0.06, tbx1 - 0.1]) for (const z of [tbz0 + 0.06, tbz1 - 0.1]) box(b, oakD, x, 0, z, x + 0.04, TB - 0.05, z + 0.04);
  box(b, C("#2f9a55"), tbx0 + 0.08, TB, tbz0 + 0.1, tbx0 + 0.55, TB + 0.004, tbz1 - 0.1); box(b, C("#2f9a55"), tbx1 - 0.55, TB, tbz0 + 0.1, tbx1 - 0.08, TB + 0.004, tbz1 - 0.1);
  for (const [x, z, col] of [[-2.35, 1.75, "#d8322f"], [-2.1, 2.05, "#2f5fb4"], [-1.95, 1.65, "#f2c23a"]] as [number, number, string][]) box(b, C(col), x - 0.12, TB + 0.004, z - 0.15, x + 0.12, TB + 0.05, z + 0.15);
  for (const [x, z] of [[-1.35, 1.9], [-3.05, 1.9]]) { cyl(b, C("#d8322f"), x, 0.44, z, 0.18, 0.18, 0.05, 16); cyl(b, ink, x, 0, z, 0.025, 0.025, 0.44, 8); }
  // the monitor pole and housing, the ceiling camera bracket
  const [mnx, mny, mnz] = P.monitor, [mnw, mnh] = P.monitor_size;
  box(b, ink, mnx - 0.015, mny + mnh / 2, mnz - 0.04, mnx + 0.015, RH, mnz - 0.01); box(b, ink, mnx - mnw / 2 - 0.02, mny - mnh / 2 - 0.02, mnz - 0.06, mnx + mnw / 2 + 0.02, mny + mnh / 2 + 0.02, mnz - 0.004);
  const [ccx, ccy, ccz] = P.cctv;
  box(b, white, rx1 - 0.06, ccy - 0.08, ccz - 0.08, rx1, ccy + 0.08, ccz + 0.08); box(b, white, ccx + 0.02, ccy - 0.02, ccz - 0.02, rx1 - 0.06, ccy + 0.02, ccz + 0.02);
  // ceiling light panels, the welcome mat
  box(b, C("#c0323c"), 1.4, 0, 4.6, 2.4, 0.012, 5.2);
  b.build(shop);
  ceilingAt(shop, rx0, rx1, rz0, FZ, RH, "#fbf3e2");
  for (const z of [-2.0, 1.0, 3.8]) { const lp = plane(1.6, 0.5, new THREE.MeshBasicMaterial({ color: new THREE.Color(1.15, 1.12, 1.02) }), shop, 0, RH - 0.006, z); lp.rotation.x = Math.PI / 2; }

  // ---- dressing (canvas faces) ----
  plane(rx1 - rx0 - 0.3, 2.4, lamC(tex("shelfWall", 2048, 760, (p) => shelfWall(p, 2048, 760))), shop, 0, 1.25, rz0 + 0.335);
  plane(2.6, 0.32, basicC(tex("letShop", 1600, 200, (p) => lettersArt(p, 1600, 200, "OLD SKOOL TCG", "#c0323c", 160)), true), shop, 1.1, 2.95, rz0 + 0.004);
  plane(0.42, 0.42, lamC(tex("clock", 256, 256, (p) => clockFace(p, 256)), true), shop, P.clock[0], P.clock[1], rz0 + 0.006);
  frameCard(shop, "zard_lc", -2.5, 2.92, rz0 + 0.03, 0.42); frameCard(shop, "evo_mzard", 3.0, 2.92, rz0 + 0.03, 0.42);
  plane(0.9, 0.62, lamC(tex("chalk", 600, 420, (p) => chalkboard(p, 600, 420))), shop, rx0 + 0.006, P.dayboard[1], P.dayboard[2], Math.PI / 2);
  plane(0.7, 1.0, lamC(tex("posterBST", 420, 600, (p) => poster(p, 420, 600, "BUY SELL TRADE", "CARDS · SLABS · SEALED", "#2f5fb4", "#fbf3dc"))), shop, rx0 + 0.006, 1.8, 2.7, Math.PI / 2);
  frameCard(shop, "mewtwo", rx0 + 0.03, 1.8, 3.8, 0.5, Math.PI / 2); frameCard(shop, "pikachu", rx0 + 0.03, 1.8, 4.6, 0.5, Math.PI / 2);
  plane(3.0, 1.6, lamC(tex("peg", 1500, 800, (p) => pegboard(p, 1500, 800))), shop, rx1 - 0.006, 1.4, 1.9, -Math.PI / 2);
  plane(0.6, 0.32, lamC(tex("camSign", 600, 320, (p) => cameraSign(p, 600, 320))), shop, rx1 - 0.006, 2.25, -0.4, -Math.PI / 2);
  plane(0.7, 1.0, lamC(tex("posterTour", 420, 600, (p) => poster(p, 420, 600, "TOURNAMENT", "EVERY WED 6PM", "#d8322f", "#fbf3dc"))), shop, rx1 - 0.006, 1.7, 4.2, -Math.PI / 2);
  // the counter's display bed: real cards on the felt, under the glass front and top
  { const bed = new THREE.Group(); bed.position.set((cx0 + 0.21) / 2, 0.665, (cz0 + cz1) / 2); bed.rotation.x = -Math.PI / 2; shop.add(bed);
    ["zard_base", "blastoise", "cel_mew", "ds_rayquaza", "mewtwo", "pikachu"].forEach((n, i) => { const m = plane(0.09, 0.126, basicC(cardTexture(n), true), bed, -0.5 + 0.18 * (i % 6) + 0.05, (i % 2 ? -0.06 : 0.08), 0.002); m.rotation.z = 0.04 * (i % 3 - 1); }); }
  plane(1.17, 0.32, glassMat(0.14), shop, (cx0 + 0.21) / 2, 0.8, cz1 + 0.004); { const gt = plane(1.17, 0.46, glassMat(0.12), shop, (cx0 + 0.21) / 2, TOPY - 0.004, (cz0 + cz1) / 2); gt.rotation.x = -Math.PI / 2; }
  plane(0.26, 0.09, lamC(tex("regKeys", 260, 90, (p) => { const g = p.g; g.fillStyle = "#2a2c33"; g.fillRect(0, 0, 260, 90); for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) { g.fillStyle = j === 7 ? "#2fae5a" : "#f2e6cc"; g.fillRect(8 + j * 31, 8 + i * 20, 25, 15); } })), shop, rgx, TOPY + 0.161, rgz + 0.05).rotation.x = -Math.PI / 2;
  { const scr = plane(0.22, 0.09, basicC(tex("regScr", 220, 90, (p) => { const g = p.g; g.fillStyle = "#1a3a2a"; g.fillRect(0, 0, 220, 90); g.fillStyle = "#7cf0a0"; g.font = "800 40px Arial"; g.fillText("$300.00", 18, 60); })), shop, rgx, TOPY + 0.335, rgz - 0.134, Math.PI); void scr; }
  const drawer = mesh(new THREE.BoxGeometry(0.32, 0.07, 0.26), C("#2a2c33"), shop, rgx, TOPY + 0.04, rgz - 0.005);
  // the caller ID screen, tilted toward the owner (and up)
  const lcd = canvasMat2(400, 200);
  { const g2 = new THREE.Group(); g2.position.set(phx, TOPY + 0.085, phz - 0.06); g2.rotation.y = Math.PI; shop.add(g2); const tilt = new THREE.Group(); tilt.rotation.x = -1.05; g2.add(tilt);
    mesh(new THREE.BoxGeometry(0.15, 0.08, 0.02), C("#2a2c33"), tilt, 0, 0, -0.011); plane(0.12, 0.06, basicC(lcd.tex), tilt, 0, 0, 0.0005); }
  const handset = new THREE.Group(); shop.add(handset);
  mesh(new THREE.BoxGeometry(0.2, 0.035, 0.045), C("#f2e6cc"), handset, 0, 0, 0); mesh(new THREE.BoxGeometry(0.05, 0.05, 0.055), C("#f2e6cc"), handset, -0.085, -0.01, 0); mesh(new THREE.BoxGeometry(0.05, 0.05, 0.055), C("#f2e6cc"), handset, 0.085, -0.01, 0);
  // the monitor screen and the ceiling camera (bullet housing aimed at the counter, lens, REC lamp)
  const monitor = canvasMat2(1040, 640); plane(mnw, mnh, basicC(monitor.tex), shop, mnx, mny, mnz);
  const recMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.0, 0.25, 0.2) });
  { const cam = new THREE.Group(); cam.position.set(ccx, ccy, ccz); shop.add(cam); cam.lookAt(new THREE.Vector3(...(P.cctv_aim as V3)).add(new THREE.Vector3(...ORIGIN.shop)));
    const hous = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.26, 18), white, cam, 0, 0, 0.0); hous.rotation.x = Math.PI / 2;
    const hood = mesh(new THREE.BoxGeometry(0.13, 0.012, 0.3), white, cam, 0, 0.062, 0.02); void hood;
    const lens = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.012, 18), C("#14161c"), cam, 0, 0, 0.133); lens.rotation.x = Math.PI / 2;
    const gl = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.004, 14), new THREE.MeshBasicMaterial({ color: "#4f78c8" }), cam, 0.006, 0.006, 0.141); gl.rotation.x = Math.PI / 2;
    mesh(new THREE.SphereGeometry(0.011, 10, 8), recMat, cam, 0.035, 0.035, 0.12); }
  // the glass door (hinged at its left edge) and its bell
  const door = new THREE.Group(); door.position.set(dx0, 0, FZ + 0.1); shop.add(door);
  { const fr = C("#2f7a4a"), dw = dx1 - dx0; mesh(new THREE.BoxGeometry(0.06, dy1, 0.05), fr, door, 0.03, dy1 / 2, 0); mesh(new THREE.BoxGeometry(0.06, dy1, 0.05), fr, door, dw - 0.03, dy1 / 2, 0);
    mesh(new THREE.BoxGeometry(dw, 0.08, 0.05), fr, door, dw / 2, dy1 - 0.04, 0); mesh(new THREE.BoxGeometry(dw, 0.25, 0.05), fr, door, dw / 2, 0.125, 0);
    mesh(new THREE.PlaneGeometry(dw - 0.12, dy1 - 0.33), glassMat(0.16), door, dw / 2, 0.25 + (dy1 - 0.33) / 2, 0);
    mesh(new THREE.BoxGeometry(0.03, 0.22, 0.06), brass, door, dw - 0.12, 1.05, 0.05);
    mesh(new THREE.PlaneGeometry(0.42, 0.12), basicC(tex("doorOpen", 420, 120, (p) => plainSign(p, 420, 120, "OPEN", "#fbf3dc", "#c0323c", "", "#c0323c"))), door, dw / 2, 1.5, 0.03); }
  mesh(new THREE.ConeGeometry(0.05, 0.07, 12), brass, shop, dx0 + 0.2, dy1 - 0.06, FZ - 0.05);
  // the window: glass, lettering on the glass, the OPEN neon, the calendar
  plane(wx1 - wx0, wy1 - wy0, glassMat(0.12), shop, (wx0 + wx1) / 2, (wy0 + wy1) / 2, FZ + 0.1);
  plane(2.6, 0.5, basicC(tex("winLet", 1300, 250, (p) => windowLettering(p, 1300, 250)), true), shop, (wx0 + wx1) / 2 + 0.3, 1.0, FZ + 0.112);
  plane(0.62, 0.3, new THREE.MeshBasicMaterial({ map: tex("neon", 420, 200, (p) => openNeon(p, 420, 200)), transparent: true, alphaTest: 0.02, color: new THREE.Color(1.6, 1.6, 1.6) }), shop, -2.25, 1.95, FZ + 0.04);
  plane(0.42, 0.6, lamC(tex("cal", 420, 600, (p) => calendar(p, 420, 600))), shop, -1.45, 1.45, FZ + 0.04);
  // the facade: sign board, the vertical sign, the GRAND OPENING banner, upper windows (sky reflections), the neighbours' signs
  const [sgx, sgy, sgz] = P.sign;
  { const sb = new Batch(); box(sb, C("#8a2a2a"), sgx - 2.7, sgy - 0.3, FZ1, sgx + 2.7, sgy + 0.3, sgz - 0.01); sb.build(shop); }
  plane(5.4, 0.6, lamC(tex("signBoard", 1800, 200, (p) => signBoard(p, 1800, 200))), shop, sgx, sgy, sgz);
  plane(0.8, 2.6, lamC(tex("blade", 300, 975, (p) => bladeSign(p, 300, 975))), shop, P.blade[0], P.blade[1], FZ1 + 0.05);
  const banner = plane(3.4, 0.4, new THREE.MeshLambertMaterial({ map: tex("grand", 1700, 200, (p) => grandOpening(p, 1700, 200)), side: THREE.DoubleSide }), shop, P.banner[0], P.banner[1], P.banner[2]);
  for (const x of [-0.6, 1.4]) plane(1.0, 1.35, new THREE.MeshBasicMaterial({ map: cloudSky("upWin" + x) }), shop, x, 4.7, FZ1 + 0.003);
  plane(3.6, 0.5, lamC(tex("laundSign", 1200, 170, (p) => plainSign(p, 1200, 170, "LAUNDROMAT", "#fbf3dc", "#2f5fb4", "", "#2f5fb4"))), shop, -7.8, 3.3, FZ + 0.12);
  plane(3.0, 0.5, lamC(tex("cafeSign", 1000, 170, (p) => plainSign(p, 1000, 170, "CAFE · TACOS", "#fbf3dc", "#c0323c", "", "#c0323c"))), shop, 7.4, 3.6, FZ + 0.12);
  { const aw = mesh(new THREE.BoxGeometry(6.6, 0.04, 1.2), lamC(rep(stripes("#d8322f", "#fbf3dc"), 7, 1)), shop, 7.45, 2.8, FZ + 0.68); aw.rotation.x = 0.35; }
  for (const x of [-7.8, 7.4]) plane(5.4, 1.85, new THREE.MeshBasicMaterial({ map: cloudSky("nWin" + x, "#5f9ae8", "#cfe8fb") }), shop, x, 1.35, FZ + 0.165);

  // ---- the box of new stock: cardboard with the flaps folded out, a riser, ten items (canvas each) ----
  const BX = (P.box[0] + P.box[1]) / 2, BZ = (P.box[2] + P.box[3]) / 2, bw = P.box[1] - P.box[0], bd = P.box[3] - P.box[2], bh = P.box_h;
  const boxG = new THREE.Group(); boxG.position.set(BX, TOPY, BZ); shop.add(boxG);
  { const cb = lam("cardboard2", () => ({ color: "#c99a62" })), cbD = lam("cardboardD", () => ({ color: "#a87a46" })), t = 0.006;
    mesh(new THREE.BoxGeometry(bw, 0.006, bd), cbD, boxG, 0, 0.003, 0);
    mesh(new THREE.BoxGeometry(bw, bh, t), cb, boxG, 0, bh / 2, bd / 2 - t / 2); mesh(new THREE.BoxGeometry(bw, bh, t), cb, boxG, 0, bh / 2, -bd / 2 + t / 2);
    mesh(new THREE.BoxGeometry(t, bh, bd - 2 * t), cb, boxG, -bw / 2 + t / 2, bh / 2, 0); mesh(new THREE.BoxGeometry(t, bh, bd - 2 * t), cb, boxG, bw / 2 - t / 2, bh / 2, 0);
    mesh(new THREE.BoxGeometry(bw - 2 * t, P.riser, bd / 2 - t), cbD, boxG, 0, P.riser / 2 + 0.006, -bd / 4);
    for (const [sx, sz, w, d, rx, rz] of [[0, 1, bw, 0.08, 1.15, 0], [0, -1, bw, 0.08, -1.15, 0], [1, 0, 0.08, bd, 0, -1.15], [-1, 0, 0.08, bd, 0, 1.15]] as number[][]) {   // flaps folded out and down over the walls
      const fl = mesh(new THREE.BoxGeometry(w, 0.004, d), cb, boxG, sx * (bw / 2 + 0.018), bh - 0.035, sz * (bd / 2 + 0.018)); fl.rotation.set(rx, 0, rz); }
    const tape = mesh(new THREE.PlaneGeometry(0.3, 0.05), lamC(tex("tapeNew", 600, 100, (p) => plainSign(p, 600, 100, "NEW ARRIVALS", "#f2c23a", "#c0323c"))), boxG, 0, bh * 0.5, bd / 2 + 0.03); tape.rotation.x = -0.42; void tape; }
  const items: THREE.Mesh[] = [], itemC: Canvas[] = [];
  P.items.forEach((it, i) => {
    const kind = it[1] as string, isSlab = kind === "slab", h = P.slab[1], w = isSlab ? h * 0.59 : kind === "case" ? h * 0.7 : h * 0.66;
    const c = canvasMat2(360, Math.round(360 * h / w)); itemC.push(c);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: c.tex, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }));
    const row = i < 5 ? P.rows.front : P.rows.back, y = (i < 5 ? 0 : P.riser) + 0.006 + h / 2;
    m.position.set(P.slot_x[i % 5] - BX, y, row - BZ); m.rotation.x = -P.lean; boxG.add(m); items.push(m);
  });
  // the stack of three sealed booster boxes he sells
  const stack = new THREE.Group(); shop.add(stack);
  for (let i = 0; i < 3; i++) { const top = lamC(tex("bbTop" + i, 300, 200, (p) => productFace(p, 300, 200, i * 2 + 1))), side = lamC(tex("bbSide" + i, 300, 100, (p) => productFace(p, 300, 100, i * 2 + 1, "36 PACKS")));
    mesh(new THREE.BoxGeometry(0.3, 0.095, 0.2), [side, side, top, side, side, side], stack, 0, 0.0475 + i * 0.097, 0).rotation.y = 0.05 * (i - 1); }
  // the glass case door (hinged at its back edge z0, swings into the room) and its padlock
  const [cd0, cd1] = P.case_door, L2 = cd1 - cd0;
  const caseDoor = new THREE.Group(); caseDoor.position.set(kx1 + 0.012, 0, cd0); shop.add(caseDoor);
  { mesh(new THREE.BoxGeometry(0.03, KH - 0.32, 0.03), oak, caseDoor, 0, 0.3 + (KH - 0.32) / 2, L2 - 0.015);
    mesh(new THREE.BoxGeometry(0.03, 0.04, L2), oak, caseDoor, 0, KH - 0.04, L2 / 2); mesh(new THREE.BoxGeometry(0.03, 0.04, L2), oak, caseDoor, 0, 0.32, L2 / 2);
    const gp = mesh(new THREE.PlaneGeometry(L2 - 0.03, KH - 0.4), glassMat(0.14), caseDoor, 0.002, 0.3 + (KH - 0.32) / 2, (L2 - 0.03) / 2); gp.rotation.y = Math.PI / 2;
    mesh(new THREE.BoxGeometry(0.05, 0.06, 0.035), brass, caseDoor, 0.03, 1.0, L2 - 0.03); }
  for (const [z0, z1] of [[kz0 + 0.05, cd0], [cd1, kz1 - 0.05]]) { const gp = plane(z1 - z0, KH - 0.34, glassMat(0.14), shop, kx1 + 0.01, 0.3 + (KH - 0.34) / 2, (z0 + z1) / 2, Math.PI / 2); void gp; }
  { const fb = new Batch(); box(fb, oak, kx1 - 0.01, 0.3, cd1, kx1 + 0.03, KH, cd1 + 0.04); box(fb, brass, kx1 + 0.03, 0.97, cd1 + 0.005, kx1 + 0.05, 1.03, cd1 + 0.035); fb.build(shop); }
  const shackle = mesh(new THREE.TorusGeometry(0.016, 0.004, 6, 12, Math.PI), C("#d8dde4"), shop, kx1 + 0.045, 1.04, cd1 - 0.02);
  // the case's shelves (glass) and contents: real cards on little stands
  { const cs = new Batch(); for (const y of [0.7, 1.0, 1.35, 1.7]) box(cs, glassMat(0.2), kx0 + 0.04, y, kz0 + 0.05, kx1 - 0.04, y + 0.012, kz1 - 0.05); cs.build(shop); }
  ["zard_base", "blastoise", "mewtwo", "cel_mew", "zard_lc", "ds_rayquaza", "pikachu", "cel_mew_gold"].forEach((n, i) => { const y = [0.712, 1.362, 1.712][i % 3], z = kz0 + 0.25 + (i % 4) * 0.4;
    if (i % 3 === 1 && i > 3) return; const m = plane(0.1, 0.14, basicC(cardTexture(n), true), shop, kx0 + 0.2, y + 0.08, z, Math.PI / 2); m.rotation.z = 0; });

  // ===================== THE HOUSE (the analogy) =====================
  SETL = "house";
  const HP = HOUSEP, house = G("house", ORIGIN.house);
  const [hx0, hx1, hz0, hz1] = HP.room, HH2 = HP.h, [hd0, hd1] = HP.door;
  b = new Batch();
  up(b, lam("houseFloor", () => ({ map: woodTex("house", "#c98a4e", "rgba(90,50,20,0.45)") })), hx0, hx1, hz0, hz1, 0, 2);
  const hw = lam("houseWall", () => ({ map: paintWall("house", "#f8d27a") }));
  box(b, hw, hx0 - 0.1, 0, hz0 - 0.15, hd0, HH2, hz0, 2); box(b, hw, hd1, 0, hz0 - 0.15, hx1 + 0.1, HH2, hz0, 2); box(b, hw, hd0, 2.1, hz0 - 0.15, hd1, HH2, hz0, 2);
  box(b, hw, hx0 - 0.1, 0, hz0, hx0, HH2, hz1, 2);
  box(b, hw, hx1, 0, hz0, hx1 + 0.1, HH2, -1.0, 2); box(b, hw, hx1, 0, 0.0, hx1 + 0.1, HH2, hz1, 2); box(b, hw, hx1, 2.1, -1.0, hx1 + 0.1, HH2, 0.0, 2);
  box(b, C("#fbf3dc"), hd0 - 0.08, 0, hz0 - 0.16, hd0, 2.18, hz0 + 0.02); box(b, C("#fbf3dc"), hd1, 0, hz0 - 0.16, hd1 + 0.08, 2.18, hz0 + 0.02); box(b, C("#fbf3dc"), hd0 - 0.08, 2.1, hz0 - 0.16, hd1 + 0.08, 2.18, hz0 + 0.02);
  box(b, C("#fbf3dc"), hx0, 0, hz0, hx1, 0.1, hz0 + 0.02); // skirting
  // outside the door: porch, lawn, hedge, a picket fence
  box(b, C("#d9c7a5"), hd0 - 0.6, 0, hz0 - 1.4, hd1 + 0.6, 0.06, hz0 - 0.15);
  up(b, lam("lawn", () => ({ color: "#5fb04a" })), -8, 8, -14, hz0 - 0.15, 0, 4);
  for (const [x, z, r] of [[-2.2, -5.5, 0.9], [-0.7, -6.0, 1.0], [0.9, -5.6, 0.9], [2.4, -6.2, 1.1]]) sph(b, C("#3fa048"), x, r * 0.8, z, r);
  for (let i = 0; i < 18; i++) box(b, white, -4.5 + i * 0.5, 0, -7.5, -4.4 + i * 0.5, 1.0, -7.45);
  for (const [x, z, r] of [[-5, -12, 2.2], [4, -13, 2.6], [0, -16, 3.0]]) { cyl(b, C("#7a4a2a"), x, 0, z, 0.2, 0.16, 3, 8); sph(b, C("#4fa548"), x, 3.8, z, r); }
  // the table, cloth, cake on a stand, plates; a sideboard; a plant; the kitchen glimpse
  const [tx0, tx1, tz0, tz1] = HP.table, TYH = HP.table_y;
  for (const x of [tx0 + 0.05, tx1 - 0.09]) for (const z of [tz0 + 0.05, tz1 - 0.09]) box(b, oakD, x, 0, z, x + 0.04, TYH - 0.03, z + 0.04);
  box(b, C("#fbfaf6"), tx0 - 0.04, TYH - 0.2, tz0 - 0.04, tx1 + 0.04, TYH, tz1 + 0.04);
  cyl(b, white, 1.0, TYH, -0.6, 0.03, 0.03, 0.12, 10); cyl(b, white, 1.0, TYH + 0.12, -0.6, 0.17, 0.17, 0.012, 24);
  cyl(b, C("#f6c8d8"), 1.0, TYH + 0.132, -0.6, 0.13, 0.13, 0.11, 24); cyl(b, C("#fbf3dc"), 1.0, TYH + 0.242, -0.6, 0.135, 0.13, 0.015, 24); sph(b, C("#d8322f"), 1.0, TYH + 0.28, -0.6, 0.025);
  for (const [x, z] of [[0.15, -0.65], [0.7, -0.35]]) cyl(b, white, x, TYH, z, 0.1, 0.1, 0.01, 20);
  box(b, oak, -2.95, 0, 1.2, -2.5, 0.85, 2.6); box(b, C("#2f9a55"), -2.9, 0.85, 1.6, -2.6, 0.87, 2.2);
  cyl(b, C("#c9643a"), 2.5, 0, 2.6, 0.2, 0.26, 0.5, 16); sph(b, C("#3fa048"), 2.5, 0.95, 2.6, 0.42); sph(b, C("#2f8a40"), 2.7, 1.25, 2.65, 0.3);
  box(b, white, 3.3, 0, -1.2, 3.9, 1.8, -0.6); box(b, oak, 3.3, 0, 0.2, 4.4, 0.9, 0.8); box(b, hw, hx1 + 0.1, 0, -1.6, 4.5, HH2, -1.5); box(b, hw, 4.4, 0, -1.6, 4.5, HH2, 1.0);
  box(b, C("#2f5fb4"), -1.6, 0, 0.4, 1.8, 0.008, 2.2); // the rug
  { const [chx, chz] = HP.chair; box(b, oak, chx - 0.22, 0.42, chz - 0.2, chx + 0.22, 0.46, chz + 0.2); box(b, oak, chx - 0.22, 0.46, chz - 0.23, chx + 0.22, 1.0, chz - 0.19);
    for (const dx of [-0.2, 0.17]) for (const dz of [-0.18, 0.15]) box(b, oakD, chx + dx, 0, chz + dz, chx + dx + 0.03, 0.42, chz + dz + 0.03); }
  windowOn(b, house, "z", hz0, 1, (HP.window[0] + HP.window[1]) / 2, 1.0, 2.3, HP.window[1] - HP.window[0], cloudSky("houseWin"), C("#fbf3dc"));
  b.build(house);
  ceilingAt(house, hx0, hx1, hz0, hz1, HH2, "#fbf3e2");
  frameCard(house, "pikachu", -2.1, 1.7, hz0 + 0.03, 0.4); frameCard(house, "blastoise", hx0 + 0.03, 1.7, 1.9, 0.4, Math.PI / 2);
  const houseDoor = new THREE.Group(); houseDoor.position.set(hd0, 0, hz0 - 0.07); house.add(houseDoor);
  { const dw = hd1 - hd0; mesh(new THREE.BoxGeometry(dw - 0.02, 2.08, 0.05), C("#c0323c"), houseDoor, dw / 2, 1.04, 0);
    for (const [y, h2] of [[0.55, 0.7], [1.5, 0.7]]) mesh(new THREE.BoxGeometry(dw - 0.3, h2, 0.012), C("#a8282e"), houseDoor, dw / 2, y, 0.03);
    mesh(new THREE.SphereGeometry(0.03, 10, 8), brass, houseDoor, dw - 0.12, 1.0, 0.05); }
  const tray = canvasMat2(480, 300);
  { const t = plane(0.32, 0.2, new THREE.MeshBasicMaterial({ map: tray.tex, transparent: true, alphaTest: 0.05 }), house, HP.tray[0], HP.tray[1] + 0.002, HP.tray[2]); t.rotation.x = -Math.PI / 2; }
  const spoon = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.17), new THREE.MeshBasicMaterial({ map: tex("spoon1", 60, 256, (p) => { const g = p.g; g.fillStyle = "#f8fbff"; g.strokeStyle = "#7f8ca0"; g.lineWidth = 4; g.beginPath(); g.ellipse(30, 40, 22, 36, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.roundRect(24, 74, 12, 176, 6); g.fill(); g.stroke(); }), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }));
  house.add(spoon);
  const gift = new THREE.Group(); house.add(gift);
  { const gp = lamC(tex("gift", 300, 200, (p) => giftPaper(p, 300, 200))); mesh(new THREE.BoxGeometry(0.3, 0.1, 0.2), gp, gift, 0, 0, 0);
    const bowM = C("#f2c23a"); for (const s2 of [-1, 1]) { const lp = mesh(new THREE.SphereGeometry(0.045, 12, 8), bowM, gift, s2 * 0.035, 0.07, 0); lp.scale.set(1, 0.6, 0.45); } }

  // ===================== THE JACKET LINING (insert) =====================
  SETL = "jacket";
  const JP = JACKP, jacket = G("jacket", ORIGIN.jacket);
  const [pw, ph] = JP.panel_size;
  mesh(new THREE.BoxGeometry(pw + 0.04, ph + 0.04, 0.02), C("#a86a28"), jacket, JP.panel[0], JP.panel[1], -0.012);
  plane(pw, ph, new THREE.MeshBasicMaterial({ map: tex("lining", 680, 1000, (p) => lining(p, 680, 1000)) }), jacket, JP.panel[0], JP.panel[1], 0.0);
  const jItems: Canvas[] = [];
  const kinds: Record<string, [string, number]> = { rgb_mew_r: ["case", 4000], slab_psyduck: ["slab", 1800], slab_mew: ["slab", 150], slab_zard: ["slab", 750] };
  Object.entries(JP.pockets).forEach(([n, at]) => {
    const [kind] = kinds[n], h = JP.slab_h * (kind === "case" ? 0.86 : 1), w = kind === "case" ? h * 0.7 : h * (n === "slab_zard" ? 0.602 : n === "slab_mew" ? 0.584 : 0.588);
    const c = canvasMat2(720, Math.round(720 * h / w)); jItems.push(c);
    plane(w, h, new THREE.MeshBasicMaterial({ map: c.tex, transparent: true, alphaTest: 0.05 }), jacket, at[0], at[1], 0.004);
    plane(w + 0.016, h * 0.86, new THREE.MeshBasicMaterial({ map: tex("pocket" + n, 300, 400, (p) => pocket(p, 300, 400)), transparent: true, depthWrite: false }), jacket, at[0], at[1] - h * 0.13, 0.008);
  });
  { const [cx2, cy2] = JP.cash; for (let i = 0; i < 3; i++) { const bm = plane(0.156, 0.066, new THREE.MeshBasicMaterial({ map: tex("billJ", 470, 200, (p) => { const g = p.g; g.save(); g.scale(470 / 470, 1); g.restore(); bill2(p); }) }), jacket, cx2 - 0.02 + i * 0.02, cy2 + 0.03 + i * 0.006, 0.003 + i * 0.0005); bm.rotation.z = 0.12 - i * 0.1; }
    plane(0.22, 0.09, new THREE.MeshBasicMaterial({ map: tex("pocketCash", 300, 120, (p) => pocket(p, 300, 120)), transparent: true, depthWrite: false }), jacket, cx2, cy2, 0.008); }

  // transparent things draw no ink
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void sign; void bush; void palm; void lamp; void car; void wheels; void stucco; void grassHD; void planksHD; void roofHD; void beam; void brick; void water; void stoneHD; void slab; void sph;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, box: boxG, items, itemC, drawer, handset, stack, door, caseDoor, shackle, monitor, lcd, recMat, banner, houseDoor, gift, tray, spoon, jItems };
};
const bill2 = (p: Pen) => billArt(p, 470, 200);
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
void callerId; void monitorFeed; void itemArt; void spoonTray;
