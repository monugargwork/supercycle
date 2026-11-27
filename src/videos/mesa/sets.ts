// The sets of the Mira Mesa reel (the Mira Mesa High gym with the school front, plaza and parking lot outside it; the beach promenade), built once
// (static scenery batched per material) plus the moving pieces as their own objects. People and FX are flat cards placed by cast.ts. Positions come from plan.json.
// Import note: water and stoneHD come from the engine paint module.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, quad, tri } from "../../engine/geo";
import { ctex, rep, grassHD, planksHD, roofHD, beam, jit, brick, water, stoneHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { scan, plainSign, letters as lettersArt, caseArt, toploader, priceTag, firstShow, lookSign, maple, courtLines, blockWall, scoreboard, banner, corkBoard, flyer, rulesBoard, meter, poleSign,
  bill as billArt } from "./art2";
import { V3, obj, ORIGIN, GYMP, BEACHP } from "./story";

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
  easelC: Canvas; easelCase: THREE.Mesh; tag: THREE.Group; stackTL: THREE.Mesh[]; doorL: THREE.Group; doorR: THREE.Group; sedan: THREE.Group;
  heroCase: THREE.Group; replicaCase: THREE.Group; jar: THREE.Group; meterC: Canvas; jarBills: THREE.Mesh[]; frontSign: THREE.Mesh; signsAll: THREE.Mesh[];
  flyer: THREE.Mesh; flap: THREE.Group; rules: THREE.Group;
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
  const white = C("#f6f3ec"), oak = C("#c98a4e"), oakD = C("#9a6236"), cream = C("#fbf3dc"), red = C("#d8322f"), steel = C("#9fb0c4");
  const windowOn = (b: Batch, g: THREE.Group, axis: "x" | "z", at: number, n: number, c: number, y0: number, y1: number, w: number, skyTex: THREE.Texture, frame: THREE.Material) => {
    const d = 0.006 * n;
    plane(w, y1 - y0, new THREE.MeshBasicMaterial({ map: skyTex }), g, axis === "x" ? at + d : c, (y0 + y1) / 2, axis === "x" ? c : at + d, axis === "x" ? (n > 0 ? Math.PI / 2 : -Math.PI / 2) : (n > 0 ? 0 : Math.PI));
    const t = 0.06, dep = 0.06 * n;
    const bx = (a0: number, a1: number, yy0: number, yy1: number) => axis === "x" ? box(b, frame, Math.min(at, at + dep), yy0, a0, Math.max(at, at + dep), yy1, a1) : box(b, frame, a0, yy0, Math.min(at, at + dep), a1, yy1, Math.max(at, at + dep));
    bx(c - w / 2 - t, c + w / 2 + t, y0 - t, y0); bx(c - w / 2 - t, c + w / 2 + t, y1, y1 + t); bx(c - w / 2 - t, c - w / 2, y0, y1); bx(c + w / 2, c + w / 2 + t, y0, y1); bx(c - 0.02, c + 0.02, y0, y1);
  };
  const ceilingAt = (g: THREE.Group, x0: number, x1: number, z0: number, z1: number, h: number, col: string) => {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), lam("ceil" + col, () => ({ color: col }))); c.rotation.x = Math.PI / 2; c.position.set((x0 + x1) / 2, h - 0.002, (z0 + z1) / 2); g.add(c);
  };
  /** a car with its length along z (nose +z), centre (x, z) */
  const carZ = (b: Batch, x: number, z: number, col: string) => {
    const m = lam("car" + col, () => ({ color: col }));
    box(b, m, x - 0.88, 0.35, z - 2.2, x + 0.88, 1.0, z + 2.2); box(b, m, x - 0.8, 1.0, z - 1.0, x + 0.8, 1.52, z + 1.1);
    box(b, M.glass(), x - 0.82, 1.03, z - 0.9, x + 0.82, 1.45, z + 1.0);
    box(b, C("#fff3c4"), x - 0.7, 0.62, z + 2.2, x - 0.4, 0.78, z + 2.23); box(b, C("#fff3c4"), x + 0.4, 0.62, z + 2.2, x + 0.7, 0.78, z + 2.23);
    for (const dz of [-1.4, 1.4]) for (const dx of [-0.85, 0.85]) cyl(b, M.tyre(), x + dx - 0.12 * Math.sign(dx), 0.36, z + dz, 0.36, 0.36, 0.24, 14, new THREE.Euler(0, 0, Math.PI / 2));
  };
  const cardsOn = (parent: THREE.Object3D, names: string[], x0: number, x1: number, z0: number, z1: number, y: number, cols = 5) => {
    const rows = Math.ceil(names.length / cols), cw = Math.min(0.063, ((x1 - x0) / cols) * 0.8), chh = cw * 1.395;
    names.forEach((n, i) => { const c = i % cols, r = Math.floor(i / cols), x = x0 + ((c + 0.5) / cols) * (x1 - x0), z = z0 + ((r + 0.5) / rows) * (z1 - z0);
      const m = plane(cw, chh, basicC(cardTexture(n), true), parent, x, y, z); m.rotation.x = -Math.PI / 2; });
  };

  // ===================== THE GYM (inside), the school front, the plaza, the lot =====================
  SETL = "gym";
  const P = GYMP, gym = G("gym", ORIGIN.gym);
  const [rx0, rx1, rz0, rz1] = P.room, RH = P.h, FZ = P.front_z, FZ1 = FZ + P.wall_t, TOPY = P.table_y, [dx0, dx1] = P.doors, DH = P.door_h;
  let b = new Batch();
  up(b, lam("maple", () => ({ map: ctex("maple", 512, 512, (g, r) => maple(g, r)) })), rx0, rx1, rz0, rz1, 0, 1);
  const wallM = lam("gymWall", () => ({ map: ctex("block", 512, 512, (g, r) => blockWall(g, r)) })), stuccoM = lam("gymStucco", () => ({ map: stucco("gymFront", "#fbecc8") }));
  box(b, wallM, rx0 - 0.15, 0, rz0 - 0.15, rx1 + 0.15, RH, rz0, 2);                                  // back wall
  box(b, wallM, rx0 - 0.15, 0, rz0, rx0, RH, FZ, 2); box(b, wallM, rx1, 0, rz0, rx1 + 0.15, RH, FZ, 2);   // side walls
  // the front wall: block inside (z 8.0..8.15), stucco outside (z 8.15..8.3), the door opening x 1.0..3.0, 2.4 m
  const FM = FZ + 0.15;
  box(b, wallM, rx0 - 0.15, 0, FZ, dx0 - 0.08, RH, FM, 2); box(b, wallM, dx1 + 0.08, 0, FZ, rx1 + 0.15, RH, FM, 2); box(b, wallM, dx0 - 0.08, DH + 0.08, FZ, dx1 + 0.08, RH, FM, 2);
  box(b, stuccoM, -24, 0, FM, dx0 - 0.08, RH + 0.5, FZ1, 2); box(b, stuccoM, dx1 + 0.08, 0, FM, 24, RH + 0.5, FZ1, 2); box(b, stuccoM, dx0 - 0.08, DH + 0.08, FM, dx1 + 0.08, RH + 0.5, FZ1, 2);
  const frameR = C("#c0323c");
  box(b, frameR, dx0 - 0.08, 0, FZ - 0.02, dx0, DH + 0.08, FZ1 + 0.03); box(b, frameR, dx1, 0, FZ - 0.02, dx1 + 0.08, DH + 0.08, FZ1 + 0.03); box(b, frameR, dx0, DH, FZ - 0.02, dx1, DH + 0.08, FZ1 + 0.03);
  // the red band inside (all walls) and outside (the trim at 3.0 m), the parapet cap, the gym roof
  box(b, red, rx0, 1.15, rz0 + 0.02, rx0 + 0.025, 1.32, FZ - 0.02); box(b, red, rx1 - 0.025, 1.15, rz0 + 0.02, rx1, 1.32, FZ - 0.02); box(b, red, rx0 + 0.02, 1.15, rz0, rx1 - 0.02, 1.32, rz0 + 0.025);
  box(b, red, rx0 + 0.02, 1.15, FZ - 0.025, dx0 - 0.1, 1.32, FZ); box(b, red, dx1 + 0.1, 1.15, FZ - 0.025, rx1 - 0.02, 1.32, FZ);
  box(b, red, -24, 3.0, FZ1, 24, 3.22, FZ1 + 0.05); box(b, cream, -24.05, RH + 0.5, FM - 0.05, 24.05, RH + 0.68, FZ1 + 0.12);
  box(b, C("#d9cbb0"), rx0 - 0.2, RH, rz0 - 0.2, rx1 + 0.2, RH + 0.45, FM - 0.06);
  // the school wings either side, red tile roofs
  const wingM = lam("wing", () => ({ map: stucco("wing", "#f6e2b8") }));
  for (const [x0, x1] of [[-30, -9.2], [9.2, 30]]) { box(b, wingM, x0, 0, -4, x1, 4.2, FM - 0.08); slab(b, C("#d0623a"), (x0 + x1) / 2, 4.55, 4.3, x1 - x0 + 0.6, 0.12, 4.2, 0, -0.32); slab(b, C("#d0623a"), (x0 + x1) / 2, 4.55, -1.2, x1 - x0 + 0.6, 0.12, 6.4, 0, 0.22);
    for (let x = x0 + 1.6; x < x1 - 1; x += 3.2) windowOn(b, gym, "z", FM - 0.08, 1, x, 1.2, 2.9, 1.6, cloudSky("wingWin", "#7fb6ea", "#d6ecfb"), white); }
  // high windows on both side walls, the ceiling trusses
  const sk = cloudSky("gymWin");
  for (const zc of [-4.8, -1.6, 1.6, 4.8]) { windowOn(b, gym, "x", rx0, 1, zc, 4.4, 5.7, 2.4, sk, white); windowOn(b, gym, "x", rx1, -1, zc, 4.4, 5.7, 2.4, sk, white); }
  for (let z = rz0 + 1.5; z < FZ; z += 3) { box(b, steel, rx0, 6.05, z - 0.06, rx1, 6.2, z + 0.06); for (let x = rx0 + 1.5; x < rx1; x += 3) box(b, steel, x - 0.03, 6.2, z - 0.03, x + 0.03, RH - 0.01, z + 0.03); }
  // folded bleachers: seven stepped oak tiers with red risers against the left wall
  const [bx0, , bz0, bz1] = P.bleachers;
  for (let i = 0; i < 7; i++) { const x1b = bx0 + 0.18 * (7 - i), y0 = i * 0.37; box(b, oak, bx0 + 0.01, y0, bz0, x1b, y0 + 0.3, bz1, 1); box(b, red, bx0 + 0.01, y0 + 0.3, bz0 + 0.01, x1b - 0.012, y0 + 0.37, bz1 - 0.01); }
  // the basketball backboard (raised) on the back wall
  box(b, white, -5.95, 3.4, rz0 + 0.02, -5.85, 3.5, rz0 + 0.62); box(b, white, -6.8, 3.5, rz0 + 0.55, -5.0, 4.6, rz0 + 0.62);
  cyl(b, C("#f2783a"), -5.9, 3.62, rz0 + 0.88, 0.25, 0.25, 0.03, 20);
  // ---- the vendor tables ----
  const cloth = (col: string) => lam("cloth" + col, () => ({ map: ctex("cloth" + col, 256, 256, (g, r) => { g.fillStyle = col; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"; g.fillRect(i * 28 + r() * 6, 0, 14, 256); } }) }));
  const table = (cx: number, cz: number, col: string) => {
    box(b, cloth(col), cx - 0.9, 0, cz - 0.25, cx + 0.9, TOPY, cz + 0.25, 1);
    box(b, oakD, cx - 0.55, TOPY, cz - 0.05, cx + 0.15, TOPY + 0.035, cz + 0.2); box(b, C("#a8282e"), cx - 0.535, TOPY + 0.035, cz - 0.035, cx + 0.135, TOPY + 0.04, cz + 0.185);
  };
  const bcols = ["#f2a33a", "#2f9a55", "#d8322f", "#2f9a9a", "#f2c23a", "#e85a9a", "#3f78d8", "#2fae5a", "#f2785a"], signs = ["CARDS", "SLABS", "SEALED", "VINTAGE", "BINDERS", "SINGLES", "JAPANESE", "GRADED", "TRADES"];
  const boothCards = ["sprigatito", "fuecoco", "quaxly", "pawmi", "pikachu_xy", "fennekin", "froakie", "chespin", "charmander", "squirtle", "bulbasaur", "eevee"];
  P.tables.forEach(([cx, cz], i) => {
    table(cx, cz, bcols[i]);
    cyl(b, steel, cx + 0.75, 0, cz - 0.5, 0.025, 0.025, 2.3, 8);
    for (let k = 0; k < 3; k++) box(b, C(["#f2c23a", "#3f78d8", "#d8322f"][(i + k) % 3]), cx + 0.3 + k * 0.17, TOPY, cz - 0.15, cx + 0.45 + k * 0.17, TOPY + 0.1, cz + 0.12);
    box(b, C(["#2f5fb4", "#d8322f", "#2f9a55"][i % 3]), cx - 0.85, TOPY, cz - 0.2, cx - 0.62, TOPY + 0.05, cz + 0.12);
  });
  // our booth: sky-blue cloth, tray, cash tin
  const [tx0, tx1, tz0, tz1] = P.case_tray;
  box(b, cloth("#5fb6ec"), P.booth[0], 0, P.booth[2], P.booth[1], TOPY, P.booth[3], 1);
  box(b, oakD, tx0, TOPY, tz0, tx1, TOPY + 0.04, tz1); box(b, C("#a8282e"), tx0 + 0.015, TOPY + 0.04, tz0 + 0.015, tx1 - 0.015, TOPY + 0.045, tz1 - 0.015);
  box(b, red, P.tin[0] - 0.1, TOPY, P.tin[2] - 0.06, P.tin[0] + 0.1, TOPY + 0.07, P.tin[2] + 0.06);
  // ---- outside: the plaza, the lot, cars, palms, a flagpole, flower beds, the light pole, hills ----
  up(b, lam("plaza", () => ({ map: concrete("plaza", "#ecdcc0") })), -30, 30, FZ1, P.plaza[1], 0, 2);
  box(b, C("#e6e0d4"), -30, 0, P.plaza[1], 30, 0.13, P.plaza[1] + 0.2);
  up(b, lam("lotA", () => ({ map: asphalt("lotM", "#7c7884") })), -40, 40, P.plaza[1] + 0.2, P.lot[1] + 30, 0, 6);
  for (const zr of [15.6, 24.4]) for (let x = -14; x <= 16; x += 2.8) box(b, C("#f4f1ea"), x - 0.05, 0, zr - 2.6, x + 0.05, 0.008, zr + 2.6);
  const carCols = ["#d8322f", "#f2c23a", "#4fb0e8", "#f4f1ea", "#2f9a55", "#f2785a", "#3f78d8"];
  [-11.2, -8.4, -2.8, 0, 2.8, 5.6, 11.2, 14.0].forEach((x, i) => carZ(b, x + 1.4, 15.6, carCols[i % carCols.length]));
  [-8.4, -5.6, 0, 5.6, 8.4, 11.2].forEach((x, i) => carZ(b, x + 1.4, 24.4, carCols[(i + 3) % carCols.length]));
  for (const [x, z, s] of [[-4.2, 9.8, 1], [6.4, 9.9, 2], [-12, 10, 3], [14, 10.2, 4]] as [number, number, number][]) palm(b, x, 0, z, 6.5 + s * 0.3, s);
  for (const [x0, x1] of [[-8.5, -1.6], [4.0, 8.5]]) { box(b, C("#c9643a"), x0, 0, FZ1 + 0.2, x1, 0.35, FZ1 + 1.1); for (let x = x0 + 0.5; x < x1; x += 0.9) bush(b, x, 0.3, FZ1 + 0.65, 0.55); }
  cyl(b, steel, -6.0, 0, 11.0, 0.07, 0.05, 8.5, 10); sph(b, C("#f2c23a"), -6.0, 8.55, 11.0, 0.12);
  cyl(b, C("#5b6170"), 1.0, 0, 20.0, 0.1, 0.08, 7.5, 10); box(b, C("#5b6170"), 0.9, 7.4, 19.6, 1.1, 7.5, 20.6); box(b, C("#fff3c4"), 0.8, 7.25, 20.4, 1.2, 7.4, 20.9);
  for (const [x, z, r, col] of [[-60, 110, 34, "#8cc46e"], [-10, 125, 40, "#e2c48a"], [45, 115, 36, "#7cb862"], [95, 130, 42, "#e8cf98"], [-100, 128, 38, "#9acb72"]] as [number, number, number, string][]) sph(b, C(col), x, -r * 0.55, z, r, 0.6);
  b.build(gym);
  ceilingAt(gym, rx0, rx1, rz0, FZ, RH, "#f4ead6");
  for (let z = rz0 + 3; z < FZ; z += 3) for (let x = rx0 + 3; x < rx1; x += 4) { const lp = mesh(new THREE.CircleGeometry(0.32, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, 1.15, 1.0) }), gym, x, 5.95, z); lp.rotation.x = Math.PI / 2; }

  // ---- dressing (canvas faces) ----
  const courtTex = tex("court", 2048, 1707, (p) => courtLines(p, 2048, 1707)); courtTex.wrapS = courtTex.wrapT = THREE.ClampToEdgeWrapping;
  { const c = plane(18, 15, new THREE.MeshLambertMaterial({ map: courtTex, transparent: true, alphaTest: 0.3, depthWrite: false }), gym, 0, 0.004, 0.5); c.rotation.x = -Math.PI / 2; c.renderOrder = 0.2; }
  plane(3.2, 1.4, basicC(tex("score", 1280, 560, (p) => scoreboard(p, 1280, 560))), gym, P.scoreboard[0], P.scoreboard[1], rz0 + 0.008);
  plane(4.2, 0.7, lamC(tex("bnMM", 1500, 250, (p) => banner(p, 1500, 250, "MIRA MESA", "#d8322f", "#fbf3dc"))), gym, 0, 5.75, rz0 + 0.012);
  plane(5.2, 0.95, lamC(tex("bnShow", 1600, 290, (p) => banner(p, 1600, 290, "CARD SHOW TODAY", "#3f86e0", "#ffffff", "BUY · SELL · TRADE"))), gym, 1.4, 2.75, rz0 + 0.012);
  plane(1.8, 1.08, lamC(tex("board", 900, 540, (p) => corkBoard(p, 900, 540))), gym, P.board[0], P.board[1], FZ - 0.012, Math.PI);
  { const fr = mesh(new THREE.BoxGeometry(1.7, 1.18, 0.03), oak, gym, P.board[0], P.board[1], FZ - 0.006); void fr; }
  plane(4.4, 0.44, basicC(tex("letMM", 2200, 220, (p) => lettersArt(p, 2200, 220, "MIRA MESA HIGH SCHOOL", "#c0323c", 170)), true), gym, P.letters[0], P.letters[1], FZ1 + 0.012);
  plane(2.6, 0.8, lamC(tex("bnShowOut", 1300, 400, (p) => banner(p, 1300, 400, "CARD SHOW", "#3f86e0", "#ffffff", "TODAY · GYM"))), gym, P.banner[0], P.banner[1], FZ1 + 0.014);
  plane(1.0, 0.62, lamC(tex("schoolFlag", 500, 310, (p) => { const g = p.g; g.fillStyle = "#d8322f"; g.fillRect(0, 0, 500, 310); lettersArt(p, 500, 310, "MM", "#fbf3dc", 220); })), gym, -5.48, 7.9, 11.0).material = new THREE.MeshLambertMaterial({ map: tex("schoolFlag", 500, 310, () => undefined), side: THREE.DoubleSide });
  // pole signs and the booth cards
  P.tables.forEach(([cx, cz], i) => {
    plane(1.0, 0.38, lamC(tex("pole" + i, 780, 300, (p) => poleSign(p, 780, 300, signs[i], bcols[(i + 4) % 9]))), gym, cx + 0.75, 2.05, cz - 0.47);
    cardsOn(gym, [0, 1, 2, 3, 4].map((k) => boothCards[(i * 3 + k) % boothCards.length]), cx - 0.53, cx + 0.13, cz - 0.03, cz + 0.18, TOPY + 0.043, 5);
  });
  cardsOn(gym, ["pika151", "zard151", "blast151", "venu151", "eevee", "jigglypuff", "meowth", "diglett", "magikarp", "abra"], tx0 + 0.02, tx1 - 0.02, tz0 + 0.02, tz1 - 0.02, TOPY + 0.047, 5);
  { const gt = plane(tx1 - tx0 - 0.02, tz1 - tz0 - 0.02, glassMat(0.12), gym, (tx0 + tx1) / 2, TOPY + 0.06, (tz0 + tz1) / 2); gt.rotation.x = -Math.PI / 2; }
  // the FIRST SHOW! tent sign (two leaning cards)
  { const t = new THREE.Group(); t.position.set(P.tent[0], TOPY, P.tent[2]); gym.add(t);
    const ft = lamC(tex("firstShow", 340, 200, (p) => firstShow(p, 340, 200)));
    const a = plane(0.24, 0.14, ft, t, 0, 0.068, 0.02); a.rotation.x = -0.28; const c2 = plane(0.24, 0.14, ft, t, 0, 0.068, -0.02, Math.PI); c2.rotation.x = 0.28; }
  // the easel: two slanted legs, a ledge; the case on it (live canvas: the Mew, nothing or the replica); the price tag on its string
  const easel = new THREE.Group(); easel.position.set(P.easel[0], TOPY, P.easel[2]); gym.add(easel);
  for (const s2 of [-1, 1]) { const leg = mesh(new THREE.BoxGeometry(0.012, 0.17, 0.012), oak, easel, s2 * 0.035, 0.08, -0.01); leg.rotation.x = 0.22; leg.rotation.z = -s2 * 0.12; }
  { const back = mesh(new THREE.BoxGeometry(0.01, 0.15, 0.01), oak, easel, 0, 0.07, -0.05); back.rotation.x = -0.45; mesh(new THREE.BoxGeometry(0.11, 0.012, 0.025), oak, easel, 0, 0.022, 0.012); }
  const easelC = canvasMat2(720, 1000);
  const easelCase = plane(0.095, 0.132, new THREE.MeshBasicMaterial({ map: easelC.tex, transparent: true, alphaTest: 0.05 }), easel, 0, 0.094, 0.004); easelCase.rotation.x = -0.2;
  const tag = new THREE.Group(); tag.position.set(0.05, 0.155, 0.0); easel.add(tag);
  { mesh(new THREE.BoxGeometry(0.0015, 0.06, 0.0015), C("#f4f1ea"), tag, 0, -0.03, 0.003); const tg = plane(0.056, 0.035, lamC(tex("tag", 320, 200, (p) => priceTag(p, 320, 200)), true), tag, 0.022, -0.07, 0.004); (tg.material as THREE.Material).side = THREE.DoubleSide; }
  // the stand of three top-loaders (each its own mesh: they get knocked off)
  const tlStand = mesh(new THREE.BoxGeometry(0.12, 0.02, 0.05), C("#cfe6f2"), gym, P.stack[0], TOPY + 0.01, P.stack[2]); void tlStand;
  const stackTL: THREE.Mesh[] = ["charmander", "squirtle", "bulbasaur"].map((n, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.107), new THREE.MeshBasicMaterial({ map: tex("tl" + n, 350, 500, (p) => toploader(p, 350, 500, n)), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }));
    m.position.set(P.stack[0] - 0.035 + 0.035 * i, TOPY + 0.07, P.stack[2] - 0.01 + 0.008 * i); m.rotation.set(-0.2, 0, 0); gym.add(m); return m; });
  // the fundraiser jar (S16 on): glass cylinder, the meter card, bills inside
  const jar = new THREE.Group(); jar.position.set(P.jar[0], TOPY, P.jar[2]); gym.add(jar); jar.visible = false;
  mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 20, 1, true), glassMat(0.22), jar, 0, 0.08, 0); mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.02, 20), C("#f2c23a"), jar, 0, 0.17, 0);
  const meterC = canvasMat2(300, 420); plane(0.12, 0.17, new THREE.MeshBasicMaterial({ map: meterC.tex }), jar, 0.15, 0.085, 0.0).rotation.y = -0.25;
  const jarBills: THREE.Mesh[] = [0, 1, 2].map((i) => { const m = plane(0.08, 0.034, new THREE.MeshBasicMaterial({ map: tex("bill20", 470, 200, (p) => billArt(p, 470, 200)), side: THREE.DoubleSide }), jar, 0, 0.03 + 0.025 * i, 0.01 - 0.01 * i); m.rotation.set(0.2, 0.6 * i, 0.3); m.visible = false; return m; });
  // her sign on the table front (S17 on) and the same sign on every table (S19)
  const lookMat = (k: number) => new THREE.MeshBasicMaterial({ map: tex("look" + k, 500, 300, (p) => lookSign(p, 500, 300, k)) });
  const frontSign = plane(0.5, 0.3, lookMat(0), gym, P.sign_front[0], P.sign_front[1], P.booth[3] + 0.006); frontSign.visible = false;
  const signsAll = P.tables.map(([cx, cz], i) => { const m = plane(0.5, 0.3, lookMat(1 + (i % 3)), gym, cx, 0.42, cz + 0.256); m.visible = false; return m; });
  // the notice board's flyer (S14 on) and its loose corner
  const flyerTex = tex("flyer", 600, 776, (p) => flyer(p, 600, 776));
  const flyerM = plane(0.34, 0.44, new THREE.MeshBasicMaterial({ map: flyerTex }), gym, P.flyer[0], P.flyer[1], FZ - 0.016, Math.PI); flyerM.visible = false;
  const flap = new THREE.Group(); flap.position.set(P.flyer[0] + 0.17, P.flyer[1] - 0.22, FZ - 0.017); flap.rotation.y = Math.PI; gym.add(flap); flap.visible = false;
  { const fl = plane(0.07, 0.07, new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.DoubleSide }), flap, 0.035, 0.035, 0); void fl; }
  // the vendor rules A-frame (S15 on)
  const rules = new THREE.Group(); rules.position.set(P.rules[0], 0, P.rules[1]); rules.rotation.y = Math.PI - 0.35; gym.add(rules); rules.visible = false;
  { for (const s2 of [-1, 1]) { const leg = mesh(new THREE.BoxGeometry(0.72, 1.12, 0.03), oak, rules, 0, 0.56, s2 * 0.12); leg.rotation.x = s2 * 0.2; }
    const face = plane(0.62, 0.9, basicC(tex("rules", 620, 900, (p) => rulesBoard(p, 620, 900))), rules, 0, 0.62, 0.252); face.rotation.x = 0.2; }
  // the double doors: red steel leaves, a tall glass window each, chrome push bars; hinged at x 1.0 and 3.0, swing outward
  const leaf = (hx: number, dir: number) => {
    const g2 = new THREE.Group(); g2.position.set(hx, 0, FZ + 0.15); gym.add(g2);
    const w = (dx1 - dx0) / 2 - 0.01;
    mesh(new THREE.BoxGeometry(w, DH - 0.02, 0.05), C("#d8322f"), g2, (dir * w) / 2, DH / 2, 0);
    for (const zz of [-0.0265, 0.0265]) plane(0.3, 1.1, new THREE.MeshBasicMaterial({ color: "#cfeaf8", transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }), g2, dir * w * 0.5, 1.5, zz);
    mesh(new THREE.BoxGeometry(w * 0.8, 0.05, 0.06), C("#dfe6ee"), g2, dir * w * 0.5, 1.05, -0.07);
    mesh(new THREE.BoxGeometry(w * 0.8, 0.05, 0.06), C("#dfe6ee"), g2, dir * w * 0.5, 1.05, 0.07);
    return g2;
  };
  const doorL = leaf(dx0, 1), doorR = leaf(dx1, -1);
  // the black sedan (posed per shot): glossy black body, a lighter roof highlight, tinted windows, chrome trim, wheels
  const sedan = new THREE.Group(); sedan.position.set(P.sedan[0], 0, P.sedan[1]); gym.add(sedan);
  { const blk = new THREE.MeshLambertMaterial({ color: "#1c1d24" }), hi = new THREE.MeshBasicMaterial({ color: "#5a6478" }), win = new THREE.MeshLambertMaterial({ color: "#2a3448" });
    mesh(new THREE.BoxGeometry(1.8, 0.62, 4.7), blk, sedan, 0, 0.66, 0); mesh(new THREE.BoxGeometry(1.62, 0.5, 2.3), blk, sedan, 0, 1.22, -0.15);
    mesh(new THREE.BoxGeometry(1.64, 0.4, 2.0), win, sedan, 0, 1.2, -0.15); mesh(new THREE.BoxGeometry(1.5, 0.02, 1.9), hi, sedan, 0, 1.475, -0.15);
    mesh(new THREE.BoxGeometry(1.82, 0.04, 4.72), C("#cfd6de"), sedan, 0, 0.72, 0);
    for (const s2 of [-1, 1]) { mesh(new THREE.BoxGeometry(0.3, 0.12, 0.02), C("#fff3c4"), sedan, s2 * 0.6, 0.78, 2.36); mesh(new THREE.BoxGeometry(0.3, 0.12, 0.02), C("#d8322f"), sedan, s2 * 0.6, 0.8, -2.36); }
    for (const dz of [-1.45, 1.45]) for (const s2 of [-1, 1]) { const w = mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16), C("#1a1a1e"), sedan, s2 * 0.82, 0.34, dz); w.rotation.z = Math.PI / 2; const h = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.25, 12), C("#b9bec6"), sedan, s2 * 0.82, 0.34, dz); h.rotation.z = Math.PI / 2; } }
  // the held cases (the Bubble Mew, the replica): a thin acrylic block with the live canvas on its face
  const heldCase = (key: string, replica: boolean) => { const g2 = new THREE.Group(); gym.add(g2); g2.visible = false;
    mesh(new THREE.BoxGeometry(0.095, 0.132, 0.008), glassMat(0.3), g2, 0, 0, -0.005);
    plane(0.095, 0.132, new THREE.MeshBasicMaterial({ map: tex(key, 720, 1000, (p) => caseArt(p, 720, 1000, "bubble_mew", replica)), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }), g2, 0, 0, 0); return g2; };
  const heroCase = heldCase("caseHero", false), replicaCase = heldCase("caseReplica", true);

  // ===================== THE BEACH PROMENADE (the phone analogy) =====================
  SETL = "beach";
  const Bp = BEACHP, beach = G("beach", ORIGIN.beach);
  b = new Batch();
  const [px0, px1, pz0, pz1] = Bp.prom, RZ = Bp.rail_z, SY = Bp.sand_y;
  up(b, lam("pavers", () => ({ map: concrete("pavers", "#f2dcc0") })), -30, 30, RZ + 0.1, pz1 + 10, 0, 1);
  box(b, lam("seawall", () => ({ map: stucco("seawall", "#f2e2c4") })), -30, SY, RZ - 0.12, 30, -0.002, RZ + 0.1, 2);
  up(b, lam("sand", () => ({ map: ctex("sand", 256, 256, (g, r) => { g.fillStyle = "#f2d9a0"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.25)" : "rgba(160,120,60,0.15)"; g.fillRect(r() * 256, r() * 256, 2, 2); } }) })), -60, 60, Bp.sea_z, RZ - 0.12, SY, 3);
  up(b, lam("sea", () => ({ map: water() })), -400, 400, -500, Bp.sea_z, SY - 0.06, 12);
  for (let i = 0; i < 4; i++) box(b, C("#ffffff"), -60, SY - 0.06, Bp.sea_z - 1.5 - i * 3.2, 60, SY - 0.04, Bp.sea_z - 1.2 - i * 3.2);
  // the rail: posts every 1.5 m, two white rails
  for (let x = -21; x <= 21; x += 1.5) cyl(b, white, x, 0, RZ, 0.035, 0.035, Bp.rail_y, 8);
  box(b, white, -21.2, Bp.rail_y - 0.05, RZ - 0.03, 21.2, Bp.rail_y, RZ + 0.03); box(b, white, -21.2, 0.52, RZ - 0.025, 21.2, 0.56, RZ + 0.025);
  // the pier: a plank deck on posts going out to sea, rails, a red-roofed shack at the end
  const [pr0, pr1] = Bp.pier;
  box(b, lam("pierDeck", () => ({ map: planksHD() })), pr0, -0.18, -70, pr1, -0.02, RZ - 0.14, 2);
  for (let z = RZ - 2; z > -70; z -= 4) for (const x of [pr0 + 0.2, pr1 - 0.2]) cyl(b, oakD, x, SY - 0.1, z, 0.13, 0.13, -0.18 - SY + 0.1, 10);
  for (const x of [pr0, pr1 - 0.06]) box(b, white, x, 0.9, -70, x + 0.06, 0.96, RZ - 0.14);
  box(b, C("#f4f1ea"), pr0 + 0.4, -0.02, -66, pr1 - 0.4, 2.4, -61); slab(b, C("#d8322f"), (pr0 + pr1) / 2, 2.7, -63.5, pr1 - pr0, 0.12, 6.2, 0, 0);
  // palms, an ice-cream cart under a striped canopy, planters, pastel buildings behind the promenade
  for (const [x, z, s] of [[-5.2, 1.6, 2], [4.6, 3.6, 5], [-8.5, 4.8, 7], [9.0, 1.2, 9]] as [number, number, number][]) palm(b, x, 0, z, 6.2 + (s % 3) * 0.4, s);
  box(b, C("#fbf3dc"), -3.6, 0.25, 3.5, -2.6, 1.05, 4.1); box(b, C("#4fb0e8"), -3.62, 0.25, 4.1, -2.58, 1.05, 4.12);
  for (const [x, z] of [[-3.55, 3.55], [-2.65, 3.55], [-3.55, 4.05], [-2.65, 4.05]]) cyl(b, white, x, 1.05, z, 0.02, 0.02, 0.9, 6);
  box(b, lam("canopy", () => ({ map: stripes("#d8322f", "#ffffff") })), -3.8, 1.95, 3.3, -2.4, 2.02, 4.3);
  for (const [x, z] of [[-3.4, 3.4], [-2.8, 3.4]]) cyl(b, C("#1d1b22"), x, 0, z, 0.15, 0.15, 0.04, 12, new THREE.Euler(Math.PI / 2, 0, 0));
  for (const x of [2.4, 6.8]) { box(b, C("#c9643a"), x - 0.6, 0, 5.2, x + 0.6, 0.5, 5.8); bush(b, x, 0.45, 5.5, 0.55); }
  const pastel = ["#f2a878", "#8fd0f2", "#f6e2b0", "#f28ab0", "#bfe8a8", "#f6c86a"];
  for (let i = 0; i < 7; i++) { const x = -24 + i * 7.2, h = 6 + (i % 3) * 2.5; box(b, lam("bld" + i, () => ({ map: stucco2("bld" + i, pastel[i % 6]) })), x - 3.2, 0, 10, x + 3.2, h, 16, 2);
    box(b, cream, x - 3.3, h, 9.9, x + 3.3, h + 0.25, 16.1); for (let w = x - 2.2; w < x + 2.4; w += 1.5) for (let yy = 1.2; yy < h - 1; yy += 2.1) box(b, C("#5fa8dc"), w - 0.4, yy, 9.97, w + 0.4, yy + 1.1, 10.0); }
  for (const [x, z, r, col] of [[-180, -160, 60, "#7cb862"], [-90, -200, 46, "#e2c48a"]] as [number, number, number, string][]) sph(b, C(col), x, SY - r * 0.6, z, r, 0.55);
  b.build(beach);

  // transparent things draw no ink
  for (const g of Object.values(groups)) g.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const ms = Array.isArray(m.material) ? m.material : [m.material];
    if (ms.every((x) => x.transparent)) m.layers.set(NOINK); m.castShadow = false; m.receiveShadow = false; });
  void quad; void tri; void boxGeo; void untone; void local; void obj; void sign; void lamp; void car; void wheels; void grassHD; void roofHD; void beam; void brick; void stoneHD; void rep;
  void scan; void plainSign; void woodTex; void paintWall; void checker; void redBrick; void staves; void skyline; void cardTexture; void lookSign; void meter;
  { const rep2 = coplanarReport(); console.warn(`[coplanar] ${rep2.length} coplanar overlaps`); for (const l of rep2.slice(0, 40)) console.warn(l); }
  return { groups, easelC, easelCase, tag, stackTL, doorL, doorR, sedan, heroCase, replicaCase, jar, meterC, jarBills, frontSign, signsAll, flyer: flyerM, flap, rules };
};

/** redraw a live canvas only when its key changes */
export const redraw = (c: Canvas, key: string, draw: (p: Pen) => void) => {
  if (key === c.key) return;
  c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
};

