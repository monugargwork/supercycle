// The sets of the Jirachi reel (the seller's room, the hospital room, the family room, the studio), built once (static scenery batched per material) plus the moving pieces as their own objects.
// Cards, people, spot cones and FX are flat cards placed by cast.ts; the props they move are posed by world.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { donationLabel, bundleTop, bundleSide, pack, photoFrame, pinboard, scan } from "./art2";
import { V3, obj, ORIGIN, ROOM, WARD, HOME, STUDIO } from "./story";
import { AVERY_LOOK } from "./looks";

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
  screen: Canvas; phone: Canvas; cal: Canvas;
  easelCard: THREE.Group; ring: THREE.Group; bundles: THREE.Mesh[];
  binPile: THREE.Mesh; cabCard: THREE.Group; ivBag: THREE.Mesh; tripodPhone: Canvas; packsCab: THREE.Group;
  curtL: THREE.Mesh; curtR: THREE.Mesh; phoneMesh: THREE.Group; candleFlame: THREE.Mesh;
  painting: THREE.Group;
};
export const DESK_Y = 0.76;

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
/** a real card as a texture: the scan inside rounded corners (the card's own corners) */
const cardTexture = (name: string) => ctex("card" + name, 360, 504, (g) => { g.clearRect(0, 0, 360, 504); scan(g, name, 0, 0, 360, 504); });
const backTex = () => ctex("cardBack", 90, 126, (g) => { g.fillStyle = "#1f3f8f"; g.beginPath(); g.roundRect(0, 0, 90, 126, 5); g.fill(); g.fillStyle = "#e9a83a"; g.beginPath(); g.ellipse(45, 63, 22, 30, 0, 0, Math.PI * 2); g.fill(); });
/** the card in a clear top loader, at 1.5x real size so it reads beside the big cartoon heads (card 9.5 x 13.2 cm, loader 11.4 x 15.3); origin at the card's centre, facing +z */
const loadedCard = (parent: THREE.Object3D, name: string) => {
  const g = new THREE.Group(); parent.add(g);
  const fm = new THREE.MeshBasicMaterial({ map: cardTexture(name), transparent: true, alphaTest: 0.5, color: new THREE.Color(0.95, 0.95, 0.95) }); // lit by the ring light / the room: always readable
  const f = mesh(new THREE.PlaneGeometry(0.095, 0.132), fm, g, 0, 0, 0.0012);
  const b = mesh(new THREE.PlaneGeometry(0.095, 0.132), new THREE.MeshLambertMaterial({ map: backTex() }), g, 0, 0, -0.0012); b.rotation.y = Math.PI;
  const shell = mesh(new THREE.BoxGeometry(0.114, 0.153, 0.008), new THREE.MeshBasicMaterial({ color: "#e8f4ff", transparent: true, opacity: 0.16, depthWrite: false }), g, 0, 0.006, 0);
  shell.renderOrder = 3; void f;
  return g;
};

export const buildSets = (root: THREE.Object3D): Sets => {
  const groups: Record<string, THREE.Group> = {};
  const G = (name: string, o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); groups[name] = g; return g; };
  const plane = (w: number, h: number, m: THREE.Material, parent: THREE.Object3D, x: number, y: number, z: number, ry = 0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, parent, x, y, z); o.rotation.y = ry; return o; };
  const basic = (tex: THREE.Texture) => new THREE.MeshBasicMaterial({ map: tex });
  /** room shell: floor, four walls (outside the room, inner faces at +-hx / +-hz), ceiling (casts no shadow) */
  const shell = (g: THREE.Group, hx: number, hz: number, h: number, floorM: THREE.Material, wallM: THREE.Material, ceil: string) => {
    const sb = new Batch();
    up(sb, floorM, -hx, hx, -hz, hz, 0, 1);
    box(sb, wallM, -hx - 0.1, 0, -hz - 0.1, hx + 0.1, h, -hz, 2); box(sb, wallM, -hx - 0.1, 0, hz, hx + 0.1, h, hz + 0.1, 2);
    box(sb, wallM, -hx - 0.1, 0, -hz, -hx, h, hz, 2); box(sb, wallM, hx, 0, -hz, hx + 0.1, h, hz, 2);
    sb.build(g, false);
    const c = new THREE.Mesh(new THREE.PlaneGeometry(2 * hx, 2 * hz), lam("ceil" + ceil, () => ({ color: ceil }))); c.rotation.x = Math.PI / 2; c.position.set(0, h - 0.002, 0); c.castShadow = false; c.receiveShadow = false; g.add(c);
  };
  /** a window: a lit sky panel 6 mm proud of the wall with a white frame and a cross bar; n = the wall's inward normal (x or z axis) */
  const windowOn = (b: Batch, g: THREE.Group, axis: "x" | "z", at: number, n: number, c: number, y0: number, y1: number, w: number, tex: THREE.Texture, frame: THREE.Material) => {
    const pm = new THREE.MeshBasicMaterial({ map: tex }), d = 0.006 * n;
    const pane = plane(w, y1 - y0, pm, g, axis === "x" ? at + d : c, (y0 + y1) / 2, axis === "x" ? c : at + d, axis === "x" ? (n > 0 ? Math.PI / 2 : -Math.PI / 2) : (n > 0 ? 0 : Math.PI));
    pane.castShadow = false; pane.receiveShadow = false;
    const t = 0.05, dep = 0.06 * n;
    const bx = (a0: number, a1: number, yy0: number, yy1: number) => axis === "x" ? box(b, frame, Math.min(at, at + dep), yy0, a0, Math.max(at, at + dep), yy1, a1) : box(b, frame, a0, yy0, Math.min(at, at + dep), a1, yy1, Math.max(at, at + dep));
    bx(c - w / 2 - t, c + w / 2 + t, y0 - t, y0); bx(c - w / 2 - t, c + w / 2 + t, y1, y1 + t);
    bx(c - w / 2 - t, c - w / 2, y0, y1); bx(c + w / 2, c + w / 2 + t, y0, y1); bx(c - 0.012, c + 0.012, y0, y1);
  };
  const white = C("#f3f1ec"), steel = C("#c9ccd2"), ink = C("#2a2c33");

  // ===== THE SELLER'S ROOM =====
  SETL = "room";
  const room = G("room", ORIGIN.room);
  shell(room, 2.4, 2.4, 2.6, lam("roomFloor", () => ({ map: rep(woodTex("room", "#8a6a4a", "rgba(40,25,15,0.5)"), 3, 3) })), lam("roomWall", () => ({ map: paintWall("room", "#8fa0b8") })), "#d8dce4");
  let b = new Batch();
  const D = ROOM.desk; // x0 x1 z0 z1
  box(b, ink, D[0], DESK_Y - 0.04, D[2], D[1], DESK_Y, D[3]);
  box(b, ink, D[0] + 0.02, 0, D[2] + 0.05, D[0] + 0.06, DESK_Y - 0.04, D[3] - 0.05); box(b, ink, D[1] - 0.06, 0, D[2] + 0.05, D[1] - 0.02, DESK_Y - 0.04, D[3] - 0.05);
  box(b, C("#3a3d46"), D[0] + 0.06, 0.3, D[2] + 0.05, D[1] - 0.06, 0.34, D[2] + 0.08);
  // the seller's stool
  const [sx, sz] = ROOM.seller;
  cyl(b, C("#3a3d46"), sx, 0, sz, 0.02, 0.02, 0.6, 10); cyl(b, C("#2f3240"), sx, 0.6, sz, 0.17, 0.17, 0.05, 20); cyl(b, C("#3a3d46"), sx, 0, sz, 0.2, 0.2, 0.02, 16);
  // photo easel
  const [ex, , ez] = ROOM.stand;
  box(b, ink, ex - 0.07, DESK_Y, ez - 0.04, ex + 0.07, DESK_Y + 0.012, ez + 0.04); box(b, ink, ex - 0.065, DESK_Y + 0.012, ez + 0.02, ex + 0.065, DESK_Y + 0.024, ez + 0.04);
  slab(b, ink, ex, DESK_Y + 0.09, ez - 0.03, 0.014, 0.17, 0.008, 0, -0.18);
  // keyboard + mouse
  const [kx, , kz] = ROOM.keyboard;
  box(b, C("#1f2128"), kx - 0.21, DESK_Y, kz - 0.07, kx + 0.21, DESK_Y + 0.02, kz + 0.07); box(b, C("#3a3d46"), kx - 0.19, DESK_Y + 0.02, kz - 0.055, kx + 0.19, DESK_Y + 0.026, kz + 0.055);
  sph(b, C("#1f2128"), kx + 0.3, DESK_Y + 0.012, kz, 0.03, 0.4);
  // donation box: open cardboard, label on the front
  const [bx0, , bz0] = ROOM.box, [bw, bh, bd] = ROOM.box_size, card = C("#c99a62");
  box(b, card, bx0 - bw / 2, DESK_Y, bz0 - bd / 2, bx0 + bw / 2, DESK_Y + 0.01, bz0 + bd / 2);
  box(b, card, bx0 - bw / 2, DESK_Y, bz0 + bd / 2 - 0.006, bx0 + bw / 2, DESK_Y + bh, bz0 + bd / 2); box(b, card, bx0 - bw / 2, DESK_Y, bz0 - bd / 2, bx0 + bw / 2, DESK_Y + bh, bz0 - bd / 2 + 0.006);
  box(b, card, bx0 - bw / 2, DESK_Y, bz0 - bd / 2 + 0.006, bx0 - bw / 2 + 0.006, DESK_Y + bh, bz0 + bd / 2 - 0.006); box(b, card, bx0 + bw / 2 - 0.006, DESK_Y, bz0 - bd / 2 + 0.006, bx0 + bw / 2, DESK_Y + bh, bz0 + bd / 2 - 0.006);
  plane(0.22, 0.11, new THREE.MeshLambertMaterial({ map: ctex("donation", 400, 200, (g) => donationLabel(new Pen(g))) }), room, bx0, DESK_Y + bh * 0.55, bz0 + bd / 2 + 0.004);
  // shelves of stock
  for (const y of [0.9, 1.35, 1.8]) box(b, C("#e9e4d6"), 1.6, y - 0.02, -2.38, 2.35, y, -2.05);
  const stockCols = ["#2f5fb4", "#c23a32", "#e7a43a", "#2f9a55", "#7a3fb4"];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const x = 1.66 + i * 0.17, y = 0.9 + r * 0.45; box(b, C(stockCols[(i + r) % 5]), x, y, -2.32, x + 0.14, y + 0.2 + 0.03 * ((i + r) % 2), -2.12); }
  windowOn(b, room, "x", -2.4, 1, -0.6, 1.0, 2.1, 1.1, skyPanel("roomDusk", "#3a4a7a", "#e7a07a", true), white);
  b.build(room);
  // monitor (the listing page is a live canvas)
  const screen = canvasMat(1024, 608);
  const mon = new THREE.Group(); mon.position.set(...(ROOM.monitor as V3)); mon.rotation.y = ROOM.mon_yaw; room.add(mon);
  const [mw, mh] = ROOM.screen;
  mesh(new THREE.BoxGeometry(mw + 0.04, mh + 0.04, 0.03), ink, mon, 0, 0, -0.016);
  const scr = mesh(new THREE.PlaneGeometry(mw, mh), new THREE.MeshBasicMaterial({ map: screen.tex }), mon, 0, 0, 0.0035); scr.castShadow = false;
  mesh(new THREE.BoxGeometry(0.05, ROOM.monitor[1] - mh / 2 - DESK_Y, 0.03), ink, mon, 0, -(ROOM.monitor[1] - DESK_Y) / 2 - mh / 4, -0.05);
  mesh(new THREE.BoxGeometry(0.24, 0.012, 0.16), ink, mon, 0, DESK_Y - ROOM.monitor[1] + 0.006, -0.05);
  // ring light: a lit torus on a thin stand, aimed at the card
  const ring = new THREE.Group(); ring.position.set(...(ROOM.ring as V3)); room.add(ring);
  const rr0 = new THREE.Group(); ring.add(rr0); rr0.rotation.y = Math.atan2(ROOM.card[0] - ROOM.ring[0], ROOM.card[2] - ROOM.ring[2]);
  const tor = mesh(new THREE.TorusGeometry(0.15, 0.014, 10, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.55, 1.45) }), rr0); tor.castShadow = false;
  mesh(new THREE.CylinderGeometry(0.008, 0.008, ROOM.ring[1] - DESK_Y), ink, ring, 0, -(ROOM.ring[1] - DESK_Y) / 2 - 0.15 * 0, 0);
  mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.012, 16), ink, ring, 0, DESK_Y - ROOM.ring[1] + 0.006, 0);
  // the card on the easel (shown from the slap on)
  const easelCard = loadedCard(room, "jirachi_sir"); easelCard.position.set(...(ROOM.card as V3)); easelCard.rotation.x = -0.18;
  // cash bundles: 10 stacks of 2 (origin at each stack's bottom centre)
  const [cw, cd, chh] = ROOM.bundle, topM = new THREE.MeshLambertMaterial({ map: ctex("bundleTop", 256, 112, (g) => bundleTop(new Pen(g))) }), sideM = new THREE.MeshLambertMaterial({ map: ctex("bundleSide", 256, 64, (g) => bundleSide(new Pen(g))) });
  const bgeo = new THREE.BoxGeometry(cw, chh * 2, cd); bgeo.translate(0, chh, 0);
  const bundles = ROOM.bundles.map(() => mesh(bgeo, [sideM, sideM, topM, sideM, sideM, sideM], room));

  // ===== THE HOSPITAL ROOM =====
  SETL = "ward";
  const ward = G("ward", ORIGIN.ward);
  shell(ward, 2.5, 2.5, 2.7, lam("vinyl", () => ({ map: rep(vinyl(), 4, 4) })), lam("wardWall", () => ({ map: paintWall("ward", "#cfe3d4") })), "#eef2f0");
  b = new Batch();
  box(b, C("#b9c9bd"), -2.5, 0.86, -2.5, 2.5, 0.92, -2.44); // handrail
  const BD = WARD.bed, MT = WARD.mattress;
  for (const x of [BD[0] + 0.05, BD[1] - 0.05]) for (const z of [BD[2] + 0.05, BD[3] - 0.05]) cyl(b, steel, x, 0, z, 0.02, 0.02, 0.36, 8);
  box(b, steel, BD[0], 0.34, BD[2], BD[1], 0.42, BD[3]);
  box(b, white, BD[0] + 0.02, 0.42, BD[2] + 0.02, BD[1] - 0.02, MT, BD[3] - 0.02);
  box(b, steel, BD[0] - 0.05, 0.34, BD[2] + 0.02, BD[0], 1.0, BD[3] - 0.02); box(b, steel, BD[1], 0.34, BD[2] + 0.02, BD[1] + 0.05, 0.75, BD[3] - 0.02);
  box(b, C("#5a8fc9"), -0.35, MT, BD[2] + 0.01, BD[1] - 0.01, MT + 0.035, BD[3] - 0.01); // blanket over the foot end
  box(b, C("#fbfaf6"), BD[0] + 0.06, MT, BD[2] + 0.12, BD[0] + 0.45, MT + 0.12, BD[3] - 0.12); // pillow
  // IV pole
  const [ivx, ivz] = WARD.iv;
  cyl(b, steel, ivx, 0, ivz, 0.012, 0.012, 1.9, 8);
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; slab(b, steel, ivx + 0.1 * Math.cos(a), 0.03, ivz + 0.1 * Math.sin(a), 0.2, 0.02, 0.02, 0, 0); }
  box(b, steel, ivx - 0.12, 1.86, ivz - 0.006, ivx + 0.12, 1.875, ivz + 0.006);
  // cabinet
  const [cx0, cz0] = WARD.cabinet, CT = WARD.cab_top;
  box(b, C("#e9e4d6"), cx0 - 0.225, 0, cz0 - 0.2, cx0 + 0.225, CT, cz0 + 0.2); box(b, C("#c9c4b6"), cx0 - 0.2, 0.36, cz0 + 0.2, cx0 + 0.2, 0.38, cz0 + 0.205);
  box(b, C("#c23a32"), cx0 - 0.2, CT, cz0 - 0.15, cx0 - 0.02, CT + 0.045, cz0 + 0.1); // his binder lying on it
  // stool + mini tripod for the phone
  const [stx, stz] = WARD.stool;
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; slab(b, steel, stx + 0.1 * Math.cos(a), 0.3, stz + 0.1 * Math.sin(a), 0.02, 0.6, 0.02, 0.12 * Math.cos(a), 0.12 * Math.sin(a)); }
  cyl(b, C("#7a8a9a"), stx, 0.6, stz, 0.15, 0.15, 0.03, 20);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5; slab(b, ink, stx + 0.035 * Math.cos(a), 0.69, stz + 0.035 * Math.sin(a), 0.006, 0.15, 0.006, 0.3 * Math.cos(a), 0.3 * Math.sin(a)); }
  box(b, ink, stx - 0.015, 0.76, stz - 0.015, stx + 0.015, 0.785, stz + 0.015);
  // waste bin (open), wrappers pile inside
  const [bix, biz] = WARD.bin;
  windowOn(b, ward, "x", 2.5, -1, WARD.window[1], 0.95, 2.15, 1.2, skyPanel("wardDay", "#9cc8ee", "#e8f2f8"), white);
  for (const [x, z] of [[-1.0, 0.0], [1.0, 0.0]]) box(b, lam("panel", () => ({ color: "#ffffff", emissive: "#bfc8c4" })), x - 0.3, 2.66, z - 0.3, x + 0.3, 2.695, z + 0.3);
  b.build(ward);
  const binM = new THREE.MeshLambertMaterial({ color: "#f3f3f0", side: THREE.DoubleSide });
  mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.3, 20, 1, true), binM, ward, bix, 0.15, biz); mesh(new THREE.CircleGeometry(0.11, 20), binM, ward, bix, 0.004, biz).rotation.x = -Math.PI / 2;
  const binPile = mesh(new THREE.SphereGeometry(0.11, 14, 10), C("#f2c84a"), ward, bix, 0.0, biz); binPile.scale.set(1, 0.6, 1);
  const ivBag = mesh(new THREE.BoxGeometry(0.1, 0.16, 0.03), new THREE.MeshLambertMaterial({ color: "#d8eef8" }), ward, ivx + 0.1, 1.76, ivz);
  const tripodPhone = canvasMat(160, 300);
  { const ph = new THREE.Group(); ph.position.set(...(WARD.phone as V3)); ward.add(ph);
    mesh(new THREE.BoxGeometry(0.075, 0.15, 0.009), ink, ph);
    plane(0.072, 0.146, new THREE.MeshLambertMaterial({ map: tripodPhone.tex }), ph, 0, 0, 0.0052); }
  const cal = canvasMat(300, 420);
  plane(0.3, 0.42, new THREE.MeshLambertMaterial({ map: cal.tex }), ward, WARD.calendar[0], WARD.calendar[1], WARD.calendar[2] + 0.006);
  const packTex = ctex("packFront", 220, 360, (g) => pack(new Pen(g)));
  const packsCab = new THREE.Group(); ward.add(packsCab);
  for (let i = 0; i < 3; i++) { const pk = mesh(new THREE.BoxGeometry(0.075, 0.12, 0.008), [C("#e7a43a"), C("#e7a43a"), C("#e7a43a"), C("#e7a43a"), new THREE.MeshLambertMaterial({ map: packTex }), C("#e7a43a")], packsCab, cx0 + 0.12, CT + 0.005 + i * 0.009, cz0 + 0.02 * i); pk.rotation.set(-Math.PI / 2, 0, 0.3 * i - 0.2); }
  const cabCard = loadedCard(ward, "jirachi_sir"); cabCard.position.set(WARD.card_cab[0], WARD.card_cab[1] + 0.078, WARD.card_cab[2]); cabCard.rotation.x = -0.12;
  mesh(new THREE.BoxGeometry(0.06, 0.012, 0.04), ink, ward, WARD.card_cab[0], WARD.card_cab[1] + 0.006, WARD.card_cab[2] - 0.004);

  // ===== THE FAMILY ROOM =====
  SETL = "home";
  const home = G("home", ORIGIN.home);
  shell(home, 2.5, 2.5, 2.6, lam("homeFloor", () => ({ map: rep(woodTex("home", "#b07c50", "rgba(70,40,20,0.45)"), 3, 3) })), lam("homeWall", () => ({ map: paintWall("home", "#efe0c4") })), "#f4ead6");
  b = new Batch();
  const [tx, tz] = HOME.table, [tw, td] = HOME.table_size, TY = HOME.table_y, oak = C("#9a6a40");
  box(b, oak, tx - tw / 2, TY - 0.04, tz - td / 2, tx + tw / 2, TY, tz + td / 2);
  for (const x of [tx - tw / 2 + 0.06, tx + tw / 2 - 0.06]) for (const z of [tz - td / 2 + 0.06, tz + td / 2 - 0.06]) box(b, oak, x - 0.03, 0, z - 0.03, x + 0.03, TY - 0.04, z + 0.03);
  const chair = (x: number, z: number, face: number) => { // face: the direction the sitter faces (yaw); back on the far side
    const m = C("#7a5030"), c = Math.cos(face), s = Math.sin(face);
    box(b, m, x - 0.21, 0.42, z - 0.21, x + 0.21, 0.46, z + 0.21);
    for (const [dx, dz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) box(b, m, x + dx - 0.02, 0, z + dz - 0.02, x + dx + 0.02, 0.42, z + dz + 0.02);
    const bx1 = x - s * 0.2, bz1 = z - c * 0.2; // the back, behind the sitter
    if (Math.abs(s) > 0.5) box(b, m, bx1 - 0.02, 0.46, bz1 - 0.2, bx1 + 0.02, 0.95, bz1 + 0.2); else box(b, m, bx1 - 0.2, 0.46, bz1 - 0.02, bx1 + 0.2, 0.95, bz1 + 0.02);
  };
  chair(HOME.mum[0], HOME.mum[1] + 0.02, 0); chair(HOME.dad[0], HOME.dad[1] + 0.02, 0); chair(HOME.chair_av[0], HOME.chair_av[1], -Math.PI / 2); chair(-0.95, -1.0, Math.PI / 2);
  // shelf with his things
  const [shx, shy, shz] = HOME.shelf;
  box(b, C("#7a5030"), shx - 0.4, shy - 0.025, -2.5, shx + 0.4, shy, shz + 0.12);
  box(b, C("#c23a32"), shx + 0.12, shy, -2.46, shx + 0.17, shy + 0.3, -2.22); // binder standing
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; slab(b, ink, shx + 0.3 + 0.03 * Math.cos(a), shy + 0.06, -2.3 + 0.03 * Math.sin(a), 0.006, 0.13, 0.006, 0.3 * Math.cos(a), 0.3 * Math.sin(a)); }
  box(b, ink, shx + 0.28, shy + 0.12, -2.32, shx + 0.32, shy + 0.2, -2.28);
  // window + curtain rod
  const [wx, wy, wz] = HOME.window, ww = HOME.window_w;
  windowOn(b, home, "z", -2.5, 1, wx, wy - 0.55, wy + 0.55, ww, skyPanel("homeDusk", "#4a5a8a", "#f0a870"), white);
  box(b, C("#5a3b2a"), wx - 0.95, wy + 0.68, -2.42, wx + 0.95, wy + 0.71, -2.39);
  b.build(home);
  const frame = plane(0.2, 0.253, new THREE.MeshBasicMaterial({ map: ctex("photoFrame", 300, 380, (g) => photoFrame(new Pen(g), AVERY_LOOK)), color: new THREE.Color(0.85, 0.82, 0.78) }), home, shx - 0.17, shy + 0.13, -2.36);
  frame.rotation.x = -0.12; frame.position.z = -2.33;
  const curtM = lam("curtain", () => ({ color: "#a0423a" }));
  const curtL = mesh(new THREE.BoxGeometry(0.56, 1.32, 0.03), curtM, home, wx - 0.8, wy, -2.36), curtR = mesh(new THREE.BoxGeometry(0.56, 1.32, 0.03), curtM, home, wx + 0.8, wy, -2.355);
  // his beanie folded on his chair
  const bean = mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), C("#3f6fd8"), home, HOME.chair_av[0] - 0.03, 0.46, HOME.chair_av[1]); bean.scale.set(1, 0.7, 1);
  // memorial candle: glass, wax, flame
  const [ccx, , ccz] = HOME.candle;
  mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.07, 16), C("#fbf3e0"), home, ccx, TY + 0.035, ccz);
  const glass = mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.1, 16, 1, true), new THREE.MeshBasicMaterial({ color: "#ffe8c0", transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }), home, ccx, TY + 0.05, ccz); glass.renderOrder = 3;
  const candleFlame = mesh(new THREE.SphereGeometry(0.012, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 2.2, 0.8) }), home, ccx, TY + 0.09, ccz); candleFlame.scale.set(1, 1.8, 1); candleFlame.castShadow = false;
  // mum's phone (S11 her screen; S13 face down on the table)
  const phone = canvasMat(300, 620);
  const phoneMesh = new THREE.Group(); home.add(phoneMesh);
  mesh(new THREE.BoxGeometry(0.075, 0.155, 0.008), ink, phoneMesh);
  plane(0.071, 0.147, new THREE.MeshBasicMaterial({ map: phone.tex }), phoneMesh, 0, 0, 0.0046);

  // ===== THE STUDIO =====
  SETL = "studio";
  const studio = G("studio", ORIGIN.studio);
  shell(studio, 2.5, 2.5, 2.7, lam("studioFloor", () => ({ map: rep(woodTex("studio", "#d8b88a", "rgba(120,90,60,0.35)"), 3, 3) })), lam("studioWall", () => ({ map: paintWall("studio", "#f3f1ea") })), "#fbfaf6");
  b = new Batch();
  const [bdx, bdy, bdz] = STUDIO.board, [bw2, bh2] = STUDIO.board_size;
  for (const x of [bdx - 0.32, bdx + 0.32]) { box(b, C("#5a4a3a"), x - 0.025, 0, bdz - 0.2, x + 0.025, bdy - 0.18, bdz - 0.15); box(b, C("#5a4a3a"), x - 0.025, 0, bdz + 0.15, x + 0.025, bdy - 0.25, bdz + 0.2); }
  box(b, C("#e9e4d6"), bdx + 0.4, 0.72, bdz - 0.25, bdx + 0.8, 0.76, bdz + 0.15); // side table
  for (const x of [bdx + 0.43, bdx + 0.77]) box(b, C("#5a4a3a"), x - 0.02, 0, bdz - 0.05, x + 0.02, 0.72, bdz - 0.01);
  cyl(b, C("#9cc8ee"), bdx + 0.5, 0.76, bdz - 0.1, 0.04, 0.04, 0.11, 14);
  for (let i = 0; i < 4; i++) slab(b, C(["#c23a32", "#2f5fb4", "#e7a43a", "#2f9a55"][i]), bdx + 0.49 + 0.012 * i, 0.9, bdz - 0.1, 0.006, 0.2, 0.006, 0.12 * (i - 1.5), 0.05);
  cyl(b, white, bdx + 0.66, 0.76, bdz, 0.1, 0.1, 0.01, 20);
  const [wsx, wsy] = STUDIO.window;
  windowOn(b, studio, "z", -2.5, 1, wsx, wsy - 0.6, wsy + 0.6, 1.3, skyPanel("studioDay", "#8cc0ee", "#eaf4fb"), white);
  box(b, white, wsx - 0.75, wsy - 0.66, -2.5, wsx + 0.75, wsy - 0.62, -2.32);
  for (const dx of [-0.45, 0, 0.45]) { cyl(b, C("#c9744a"), wsx + dx, wsy - 0.62, -2.41, 0.06, 0.08, 0.12, 12); sph(b, C("#4fa548"), wsx + dx, wsy - 0.42, -2.41, 0.11); }
  b.build(studio);
  plane(0.9, 0.6, new THREE.MeshLambertMaterial({ map: ctex("pinboard", 600, 400, (g) => pinboard(new Pen(g))) }), studio, STUDIO.pinboard[0], STUDIO.pinboard[1], -2.494);
  const boardG = new THREE.Group(); boardG.position.set(bdx, bdy, bdz); boardG.rotation.x = -STUDIO.tilt; studio.add(boardG);
  mesh(new THREE.BoxGeometry(bw2, bh2, 0.025), C("#e3d2b0"), boardG, 0, 0, -0.0125);
  const painting = new THREE.Group(); studio.add(painting);
  const paintTex = ctex("painting", 512, 680, (g) => { g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 512, 680); scan(g, "jirachi_sir", 40, 40, 432, 600, 0.02); });
  mesh(new THREE.BoxGeometry(0.34, 0.45, 0.003), [C("#fbf8f0"), C("#fbf8f0"), C("#fbf8f0"), C("#fbf8f0"), new THREE.MeshLambertMaterial({ map: paintTex }), C("#fbf8f0")], painting);

  // shells and room fittings: transparent things draw no ink and cast no shadow
  for (const g of [room, ward, home, studio]) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) { m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; } else m.receiveShadow = true; });
  for (const o of [...bundles, easelCard, cabCard, painting, phoneMesh, curtL, curtR]) o.traverse((c) => { const m = c as THREE.Mesh; if (m.isMesh && !(m.material as THREE.Material).transparent) { m.castShadow = true; m.receiveShadow = true; } });
  void quad; void tri; void boxGeo; void untone; void glassM; void sign; void M; void local; void bush; void palm; void lamp; void car; void wheels;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, screen, phone, cal, easelCard, ring, bundles, binPile, cabCard, ivBag, tripodPhone, packsCab, curtL, curtR, phoneMesh, candleFlame, painting };
};
/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};
const glassM = () => new THREE.MeshBasicMaterial({ color: "#d8eef8", transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide });
