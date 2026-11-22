// Goldenrod heist drawings (canvas): the shop sign and the town sign, case contents seen from above (real scans, slabs, sealed
// boxes), tools (sledgehammer, bolt cutters, crowbar, claw hammer), duffels, buffet plates, cash, the rooster, the rental sticker and
// plate frame, the rental agreement, the licence, the evidence sheets (CCTV still, GPS log, phone record, prints), the WI/IL map,
// the charge folders with stamps, the slab with the GOLDENROD price sticker, the VILLAGE OF JUSTICE sign, archive labels.
// Plain lettering only, no logos. Every card drawn is a REAL scan.
import { Pen } from "../../engine/toon";
import { TCG_IMG } from "./art";

export const font = (g: CanvasRenderingContext2D, w: number, px: number, fam = 'Arial, "Helvetica Neue", sans-serif') => { g.font = `${w} ${px}px ${fam}`; };
export const scan = (g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number, r = 0.045) => {
  const im = TCG_IMG[name];
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, w * r); g.clip();
  if (im) g.drawImage(im, x, y, w, h); else { g.fillStyle = "#c9a24a"; g.fillRect(x, y, w, h); }
  g.restore();
};
/** the art window of a real scan (for box fronts), cropped from the scan itself */
const scanArt = (g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number) => {
  const im = TCG_IMG[name]; if (!im) { g.fillStyle = "#c9a24a"; g.fillRect(x, y, w, h); return; }
  const sx = im.width * 0.09, sy = im.height * 0.11, sw = im.width * 0.82, sh = im.height * 0.4;
  g.drawImage(im, sx, sy, sw, sh, x, y, w, h);
};
export const lt = (g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, col: string, w = 700, align: CanvasTextAlign = "left", maxW?: number) => {
  font(g, w, px); g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; if (maxW) g.fillText(s, x, y, maxW); else g.fillText(s, x, y);
};
const INK = "#1d1b22";
const rrect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw = 2) => {
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
};
export const stampMark = (g: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, txt: string, col: string, rot: number, alpha = 0.92) => {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = Math.max(4, h * 0.09);
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, h * 0.16); g.stroke(); lt(g, txt, 0, 2, h * 0.56, col, 900, "center", w - h * 0.3); g.restore();
};
/** a stamp landing: k 0..1 (big and faint -> settled) */
const stampIn = (g: CanvasRenderingContext2D, k: number, cx: number, cy: number, w: number, h: number, txt: string, col: string, rot: number) => {
  if (k <= 0) return; const s = 1 + 0.5 * (1 - Math.min(1, k)); g.save(); g.translate(cx, cy); g.scale(s, s); stampMark(g, 0, 0, w, h, txt, col, rot, Math.min(1, k * 1.2)); g.restore();
};
export const plainSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, Math.min(W, H) * 0.12, bg, border || undefined, 8);
  lt(g, txt, W / 2, sub ? H * 0.42 : H / 2 + 2, H * (sub ? 0.4 : 0.55), fg, 900, "center", W - 30);
  if (sub) lt(g, sub, W / 2, H * 0.78, H * 0.2, fg, 700, "center", W - 30);
};
export const letters = (p: Pen, W: number, H: number, txt: string, col: string, px: number) => { lt(p.g, txt, W / 2, H / 2, px, col, 900, "center", W - 20); };

// ---------------- the street ----------------
/** the lit sign band, 1300 x 375 (5.2 x 1.5 m): two lines of gold lettering on a dark plum band */
export const storeSign = (p: Pen) => {
  const g = p.g, W = 1300, H = 375; rrect(g, 4, 4, W - 8, H - 8, 26, "#2a1838", "#c9a24a", 10);
  rrect(g, 22, 22, W - 44, H - 44, 18, "#3a2050");
  g.save(); g.shadowColor = "rgba(255,210,90,0.9)"; g.shadowBlur = 18;
  lt(g, "GOLDENROD CITY", W / 2, 118, 128, "#ffd45a", 900, "center", W - 90);
  lt(g, "COLLECTIBLES", W / 2, 236, 104, "#ffe08a", 900, "center", W - 160); g.restore();
  lt(g, "POKÉMON · TCG · GRADED CARDS", W / 2, 322, 40, "#f4e7c4", 700, "center");
};
export const townSign = (p: Pen) => {
  const g = p.g; rrect(g, 4, 4, 392, 192, 18, "#1f6f43", "#f4f1ea", 8);
  lt(g, "TWIN LAKES", 200, 82, 70, "#f4f1ea", 900, "center", 360); lt(g, "WISCONSIN", 200, 148, 38, "#f4f1ea", 700, "center");
};
export const stopSign = (p: Pen) => {
  const g = p.g, c = 128, r = 120; g.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + (i * Math.PI) / 4; g.lineTo(c + r * Math.cos(a), c + r * Math.sin(a)); } g.closePath();
  g.fillStyle = "#c8242a"; g.fill(); g.strokeStyle = "#f4f1ea"; g.lineWidth = 9; g.stroke(); lt(g, "STOP", c, c + 4, 74, "#f4f1ea", 900, "center");
};
/** the rental barcode sticker, 300 x 140 */
export const rentalSticker = (p: Pen) => {
  const g = p.g; rrect(g, 4, 4, 292, 132, 10, "#f8f6ef", "#2f5fb4", 6); lt(g, "RENTAL", 150, 34, 38, "#2f5fb4", 900, "center");
  g.fillStyle = INK; let x = 40; for (let i = 0; x < 260; i++) { const w = [3, 5, 2, 7, 3, 2, 4][i % 7]; g.fillRect(x, 62, w, 52); x += w + [3, 2, 4, 2, 3][i % 5]; }
  lt(g, "FLEET 4471", 150, 124, 16, INK, 700, "center");
};
export const plateFrame = (p: Pen) => {
  const g = p.g; rrect(g, 4, 4, 392, 196, 16, "#2a2c33"); rrect(g, 24, 30, 352, 140, 8, "#f4f1ea", INK, 4);
  lt(g, "ILLINOIS", 200, 52, 22, "#2f5fb4", 900, "center"); lt(g, "RX 4471", 200, 112, 70, "#1d2a44", 900, "center");
  lt(g, "RENT-A-CAR", 200, 186, 22, "#f4f1ea", 900, "center");
};
/** the rooster, 300 x 300 side view facing left; crow 0..1 = neck up and beak open */
export const rooster = (p: Pen, crow: number) => {
  const g = p.g, k = Math.min(1, crow); g.lineJoin = "round"; g.strokeStyle = INK; g.lineWidth = 7;
  // tail
  for (const [a, col] of [[-0.5, "#2f6a3a"], [-0.2, "#1d4a2a"], [0.15, "#2f6a3a"]] as [number, string][]) { g.save(); g.translate(200, 170); g.rotate(a); g.fillStyle = col; g.beginPath(); g.ellipse(40, -40, 26, 62, 0.4, 0, 7); g.fill(); g.stroke(); g.restore(); }
  g.fillStyle = "#f4efe2"; g.beginPath(); g.ellipse(160, 190, 70, 52, 0, 0, 7); g.fill(); g.stroke(); // body
  const nx = 112 - 6 * k, ny = 118 - 30 * k; // neck and head
  g.beginPath(); g.moveTo(130, 160); g.quadraticCurveTo(100, 140, nx, ny + 10); g.lineTo(nx + 30, ny + 16); g.quadraticCurveTo(140, 140, 170, 160); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(nx + 8, ny, 26, 24, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#d8322f"; g.beginPath(); g.moveTo(nx - 8, ny - 18); for (let i = 0; i < 4; i++) { g.quadraticCurveTo(nx - 4 + i * 9, ny - 44, nx + 2 + i * 9, ny - 20); } g.closePath(); g.fill(); g.stroke(); // comb
  g.beginPath(); g.ellipse(nx - 6, ny + 30, 8, 13, 0, 0, 7); g.fill(); g.stroke(); // wattle
  g.fillStyle = "#f2b13a"; const op = 10 * k; // beak
  g.beginPath(); g.moveTo(nx - 14, ny - 4); g.lineTo(nx - 40, ny + 2 - op); g.lineTo(nx - 14, ny + 6); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(nx - 14, ny + 6); g.lineTo(nx - 36, ny + 10 + op); g.lineTo(nx - 14, ny + 12); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = INK; g.beginPath(); g.arc(nx + 2, ny - 4, 4.5, 0, 7); g.fill();
  g.strokeStyle = "#f2b13a"; g.lineWidth = 8; for (const x of [150, 175]) { g.beginPath(); g.moveTo(x, 236); g.lineTo(x - 4, 280); g.lineTo(x - 18, 290); g.moveTo(x - 4, 280); g.lineTo(x + 10, 290); g.stroke(); }
};

// ---------------- inside the shop ----------------
const SLAB_LABEL: Record<string, [string, string]> = {
  lc_gengar: ["2002 LEGENDARY COLL.", "GENGAR #11"], dx_latios_star: ["2005 EX DEOXYS", "LATIOS GOLD STAR"],
  neo_lugia: ["2000 NEO GENESIS", "LUGIA #9 HOLO"], zard_base: ["1999 BASE SET", "CHARIZARD #4"], neo_typhlosion: ["2000 NEO GENESIS", "TYPHLOSION #17"],
  neo_hooh: ["2001 NEO REVELATION", "HO-OH #7"],
};
/** a graded slab (W:H = 0.62): clear case, a red-bordered label with the card's lines and a grade, the real scan in the well;
 *  sticker = the shop's price sticker on the case (GOLDENROD CITY COLLECTIBLES) */
export const slab = (p: Pen, W: number, H: number, img: string, grade = "10", sticker = "") => {
  const g = p.g, s = W / 100, L = SLAB_LABEL[img] ?? ["POKÉMON", img.toUpperCase()];
  rrect(g, 2 * s, 2 * s, W - 4 * s, H - 4 * s, 6 * s, "rgba(214,232,244,0.98)", INK, 2.4 * s);
  rrect(g, 7 * s, 7 * s, W - 14 * s, 0.2 * H, 2 * s, "#f8f6ef", "#c23a32", 2 * s);
  lt(g, L[0], 11 * s, 7 * s + 0.065 * H, 6.4 * s, INK, 800, "left", 64 * s); lt(g, L[1], 11 * s, 7 * s + 0.135 * H, 6.4 * s, INK, 800, "left", 64 * s);
  lt(g, grade, W - 14 * s, 7 * s + 0.1 * H, 15 * s, "#c23a32", 900, "center");
  const cw = W - 22 * s, ch = cw * 1.395; scan(g, img, 11 * s, 0.27 * H, cw, Math.min(ch, H * 0.69));
  if (sticker) { rrect(g, W * 0.52, H * 0.84, W * 0.44, H * 0.12, 2 * s, "#ffd84a", INK, 1.2 * s); lt(g, "GOLDENROD", W * 0.74, H * 0.874, 5.2 * s, "#7a2f3a", 900, "center", W * 0.4); lt(g, sticker, W * 0.74, H * 0.925, 5.4 * s, INK, 900, "center", W * 0.4); }
};
const CASE_CARDS = [["neo_lugia", "neo_typhlosion", "neo_hooh", "neo_pichu", "pikachu", "zard_base", "blastoise", "venusaur"],
  ["lc_gengar", "dx_latios_star", "neo_lugia", "zard_base", "neo_typhlosion", "neo_hooh"], [], ["fs_dragonite", "fs_zapdos", "pikachu", "neo_pichu", "venusaur", "blastoise", "neo_hooh", "zard_base"]];
/** a case's contents seen from above (canvas 1000 x 600 = 1.0 x 0.6 m shelf, +x along the canvas width = case length);
 *  left = how much was taken (0..1); case 0 raw cards, 1 slabs, 2 sealed boxes, 3 more cards */
export const caseContents = (p: Pen, k: number, left: number) => {
  const g = p.g; g.fillStyle = "#1d2a44"; g.fillRect(0, 0, 1000, 600); g.fillStyle = "rgba(255,255,255,0.06)"; for (let i = 0; i < 1000; i += 40) g.fillRect(i, 0, 2, 600);
  if (k === 2) { const n = Math.round(6 * (1 - left)); for (let i = 0; i < n; i++) boxTop(g, 40 + (i % 3) * 320, 50 + Math.floor(i / 3) * 280, 290, 240, ["neo_lugia", "neo_hooh", "neo_typhlosion"][i % 3]); return; }
  const list = CASE_CARDS[k], keep = Math.round(list.length * (1 - left));
  if (k === 1) { for (let i = 0; i < keep; i++) { const x = 40 + (i % 3) * 320, y = 30 + Math.floor(i / 3) * 290; g.save(); g.translate(x + 140, y + 130); g.rotate(-Math.PI / 2); g.translate(-125, -150); slab(new Pen(g), 250, 300, list[i]); g.restore(); } return; }
  for (let i = 0; i < keep; i++) { const x = 30 + (i % 4) * 240, y = 40 + Math.floor(i / 4) * 280; g.save(); g.translate(x + 105, y + 125); g.rotate(-Math.PI / 2 + (i % 2 ? 0.04 : -0.03)); scan(g, list[i], -105, -146, 210, 292); g.restore(); }
};
const boxTop = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, art: string) => {
  rrect(g, x, y, w, h, 10, "#24315a", INK, 5); scanArt(g, art, x + 14, y + 14, w - 28, h * 0.55);
  lt(g, "BOOSTER BOX", x + w / 2, y + h * 0.74, h * 0.12, "#ffd45a", 900, "center", w - 20); lt(g, "36 PACKS", x + w / 2, y + h * 0.88, h * 0.08, "#f4f1ea", 700, "center");
};
/** the front of a sealed booster box (for the 3D boxes), 300 x 200 */
export const boxFront = (p: Pen, art: string) => boxTop(p.g, 4, 4, 292, 192, art);
/** cash: a strapped bundle, 200 x 110 */
export const cash = (p: Pen) => {
  const g = p.g; for (let i = 0; i < 3; i++) { rrect(g, 8 + i * 4, 30 - i * 8, 180, 70, 6, i % 2 ? "#8fd18a" : "#7cc47a", INK, 4); }
  g.fillStyle = "#f4e7c4"; g.fillRect(84, 14, 28, 80); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(84, 14, 28, 80);
};
/** a black duffel, 300 x 200; fill 0..1 = how full (it bulges) */
export const duffel = (p: Pen, fill: number) => {
  const g = p.g, b = 26 * fill; g.strokeStyle = INK; g.lineWidth = 7;
  g.fillStyle = "#24252c"; g.beginPath(); g.moveTo(26, 150 + b * 0.2); g.quadraticCurveTo(20, 70 - b, 80, 62 - b); g.lineTo(220, 62 - b); g.quadraticCurveTo(280, 70 - b, 274, 150 + b * 0.2); g.quadraticCurveTo(150, 176, 26, 150 + b * 0.2); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "#5a5d68"; g.lineWidth = 6; g.beginPath(); g.moveTo(70, 70 - b); g.lineTo(230, 70 - b); g.stroke();
  g.strokeStyle = INK; g.lineWidth = 9; g.beginPath(); g.moveTo(100, 64 - b); g.quadraticCurveTo(150, 4 - b, 200, 64 - b); g.stroke();
};
/** tools drawn with the grip at the left end (0, H/2) and the business end at the right */
export const sledge = (p: Pen) => { const g = p.g; g.strokeStyle = INK; g.lineWidth = 6; rrect(g, 6, 52, 420, 20, 9, "#c9a26a", INK, 6); rrect(g, 400, 14, 96, 96, 10, "#3a3d46", INK, 7); g.fillStyle = "#6a6e78"; g.fillRect(408, 22, 14, 80); };
export const cutters = (p: Pen, open: number) => {
  const g = p.g, a = 0.22 * open; g.strokeStyle = INK; g.lineWidth = 6;
  for (const s of [-1, 1]) { g.save(); g.translate(330, 60); g.rotate(s * a); rrect(g, -324, -12 + s * 14, 300, 22, 10, "#c8242a", INK, 6); rrect(g, -30, -10 + s * 6, 160, 18, 6, "#5a5d68", INK, 6); g.restore(); }
  g.fillStyle = "#2a2c33"; g.beginPath(); g.arc(330, 60, 14, 0, 7); g.fill();
};
export const crowbar = (p: Pen) => { const g = p.g; g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(14, 46); g.lineTo(380, 46); g.quadraticCurveTo(420, 46, 410, 20); g.stroke(); g.strokeStyle = "#c8242a"; g.lineWidth = 14; g.beginPath(); g.moveTo(14, 46); g.lineTo(380, 46); g.stroke(); };
export const clawHammer = (p: Pen) => { const g = p.g; rrect(g, 6, 40, 250, 18, 8, "#8a5a34", INK, 6); rrect(g, 236, 14, 34, 70, 6, "#5a5d68", INK, 6); g.fillStyle = "#5a5d68"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(270, 20); g.quadraticCurveTo(320, 10, 330, 40); g.lineTo(312, 40); g.quadraticCurveTo(300, 28, 270, 36); g.closePath(); g.fill(); g.stroke(); };
/** a big round buffet plate seen at a low angle, 400 x 300; boxes = how many booster boxes are piled on it */
export const plate = (p: Pen, boxes: number) => {
  const g = p.g; g.strokeStyle = INK; g.lineWidth = 6;
  for (let i = 0; i < boxes; i++) { const y = 196 - i * 52, x = 92 + (i % 2 ? 14 : -6); rrect(g, x, y - 48, 216, 52, 6, ["#24315a", "#3a2050", "#24315a", "#5a2a2a"][i % 4], INK, 5); lt(g, "BOOSTER BOX", x + 108, y - 22, 22, "#ffd45a", 900, "center"); }
  g.fillStyle = "#f8f6ef"; g.beginPath(); g.ellipse(200, 222, 190, 46, 0, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "#c9ccd2"; g.lineWidth = 4; g.beginPath(); g.ellipse(200, 218, 140, 30, 0, 0, 7); g.stroke();
};
export const napkin = (p: Pen) => { const g = p.g; g.fillStyle = "#f8f6ef"; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(10, 10); g.lineTo(110, 10); g.lineTo(60, 110); g.closePath(); g.fill(); g.stroke(); };
export const megaphone = (p: Pen) => {
  const g = p.g; g.strokeStyle = INK; g.lineWidth = 6;
  g.fillStyle = "#f2c84a"; g.beginPath(); g.moveTo(60, 60); g.lineTo(240, 10); g.lineTo(240, 150); g.lineTo(60, 100); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.ellipse(240, 80, 14, 70, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#2a2c33"; g.beginPath(); g.roundRect(14, 56, 50, 48, 8); g.fill(); g.stroke(); g.beginPath(); g.roundRect(70, 100, 22, 50, 6); g.fill(); g.stroke();
};
export const soundRing = (p: Pen, u: number) => { const g = p.g; g.strokeStyle = `rgba(255,236,120,${1 - u})`; g.lineWidth = 14; for (const r of [0.35, 0.7, 1]) { g.beginPath(); g.arc(20, 150, 120 * r * (0.6 + 0.6 * u), -0.7, 0.7); g.stroke(); } };

// ---------------- the rental office ----------------
/** the RENTAL AGREEMENT, 640 x 900; sig 0..1 = the signature written so far, stamp 0..1 */
export const contract = (p: Pen, sig: number, stamp: number) => {
  const g = p.g; g.fillStyle = "#fbf9f2"; g.fillRect(0, 0, 640, 900); g.strokeStyle = "#c9ccd2"; g.lineWidth = 3; g.strokeRect(2, 2, 636, 896);
  rrect(g, 30, 30, 580, 90, 8, "#2f5fb4"); lt(g, "RENTAL AGREEMENT", 320, 76, 48, "#f4f1ea", 900, "center");
  const rows: [string, string][] = [["VEHICLE", "WHITE MINIVAN"], ["MAKE / MODEL", "CHRYSLER PACIFICA"], ["PLATE", "RX 4471"], ["PICK-UP", "RETURN"], ["MILEAGE OUT", "18,204"], ["RENTER ID", "ON FILE"]];
  rows.forEach(([a, b], i) => { const y = 170 + i * 70; lt(g, a, 44, y, 26, "#5a5d68", 700); lt(g, b, 600, y, 30, INK, 900, "right"); g.fillStyle = "#d9dce2"; g.fillRect(44, y + 26, 556, 3); });
  lt(g, "SIGNATURE", 44, 640, 26, "#5a5d68", 700); g.fillStyle = INK; g.fillRect(44, 740, 556, 4);
  if (sig > 0) { g.strokeStyle = "#1d3a8a"; g.lineWidth = 7; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); const n = Math.round(60 * Math.min(1, sig));
    for (let i = 0; i <= n; i++) { const t = i / 60, x = 70 + 480 * t, y = 712 - 30 * Math.sin(t * 19) * Math.exp(-t * 1.2) - 12 * Math.sin(t * 7); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke(); }
  stampIn(g, stamp, 450, 560, 300, 110, "APPROVED", "#1f8a4c", -0.14);
};
export const SIG_TIP = (sig: number): [number, number] => { const t = Math.min(1, sig); return [(70 + 480 * t) / 640, (712 - 30 * Math.sin(t * 19) * Math.exp(-t * 1.2) - 12 * Math.sin(t * 7)) / 900]; };
/** a generic face for photos (no likeness): head, hair, eyes, mouth */
const face = (g: CanvasRenderingContext2D, cx: number, cy: number, r: number, i: number) => {
  const skins = ["#e8b896", "#d9a07a", "#f2c8a8", "#a8714f", "#f2c4a4"], hairs = ["#2a201a", "#5a3b2a", "#15131a", "#8a5a34", "#a9adb5"];
  g.fillStyle = "#3a3d46"; g.beginPath(); g.ellipse(cx, cy + r * 1.7, r * 1.4, r * 0.9, 0, Math.PI, 0); g.fill();
  g.fillStyle = skins[i % 5]; g.strokeStyle = INK; g.lineWidth = r * 0.08; g.beginPath(); g.ellipse(cx, cy, r * 0.82, r, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = hairs[i % 5]; g.beginPath(); g.ellipse(cx, cy - r * 0.55, r * 0.86, r * 0.5, 0, Math.PI, 0); g.fill();
  g.fillStyle = INK; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * r * 0.32, cy - r * 0.05, r * 0.08, 0, 7); g.fill(); }
  g.lineWidth = r * 0.07; g.beginPath(); g.moveTo(cx - r * 0.25, cy + r * 0.45); g.lineTo(cx + r * 0.25, cy + r * 0.45 + (i % 2 ? r * 0.04 : -r * 0.03)); g.stroke();
};
/** the driver's licence, 340 x 214 */
export const licence = (p: Pen) => {
  const g = p.g; rrect(g, 4, 4, 332, 206, 16, "#eaf2f8", INK, 5); rrect(g, 4, 4, 332, 44, 16, "#2f5fb4"); lt(g, "DRIVER LICENSE", 170, 27, 22, "#f4f1ea", 900, "center");
  rrect(g, 20, 62, 110, 132, 6, "#c9d8e8", INK, 3); g.save(); g.beginPath(); g.rect(20, 62, 110, 132); g.clip(); face(g, 75, 118, 34, 0); g.restore();
  for (let i = 0; i < 4; i++) { g.fillStyle = "#5a5d68"; g.fillRect(148, 76 + i * 30, 150 - i * 20, 10); }
};
export const keyBoard = (p: Pen) => { const g = p.g; rrect(g, 4, 4, 392, 292, 14, "#8a5a34", INK, 6); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const x = 40 + c * 60, y = 50 + r * 86; g.fillStyle = "#c9ccd2"; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); rrect(g, x - 12, y + 10, 24, 34, 6, ["#f2c84a", "#2f5fb4", "#d8322f"][(r + c) % 3], INK, 3); } };
export const monitor = (p: Pen) => { const g = p.g; g.fillStyle = "#14223f"; g.fillRect(0, 0, 400, 260); rrect(g, 20, 20, 360, 40, 6, "#2f5fb4"); lt(g, "RESERVATIONS", 200, 40, 22, "#f4f1ea", 900, "center"); for (let i = 0; i < 5; i++) { g.fillStyle = i === 2 ? "#ffd45a" : "#5a6a8a"; g.fillRect(30, 80 + i * 34, 340, 18); } };
export const drawerLabel = (p: Pen, year: number) => { const g = p.g; rrect(g, 4, 4, 192, 92, 6, "#f8f6ef", INK, 4); lt(g, String(year), 100, 40, 40, INK, 900, "center"); lt(g, "AGREEMENTS", 100, 76, 16, "#5a5d68", 700, "center"); };
export const folderCover = (p: Pen) => { const g = p.g; rrect(g, 4, 4, 312, 432, 8, "#e9c87a", INK, 5); lt(g, "AGREEMENT", 160, 60, 34, "#7a5a14", 900, "center"); };

// ---------------- the police station ----------------
const sheet = (g: CanvasRenderingContext2D, W: number, H: number, title: string, col: string) => { g.fillStyle = "#fbf9f2"; g.fillRect(0, 0, W, H); g.strokeStyle = "#c9ccd2"; g.lineWidth = 3; g.strokeRect(2, 2, W - 4, H - 4); rrect(g, 14, 14, W - 28, 50, 6, col); lt(g, title, W / 2, 40, 28, "#f4f1ea", 900, "center", W - 40); };
/** evidence sheets, 400 x 300 each */
export const cctvStill = (p: Pen) => {
  const g = p.g; g.fillStyle = "#0e1424"; g.fillRect(0, 0, 400, 300);
  g.fillStyle = "#26324e"; g.fillRect(120, 40, 160, 240); g.strokeStyle = "#6a7aa0"; g.lineWidth = 6; g.strokeRect(120, 40, 160, 240);
  for (let i = 0; i < 4; i++) { const x = 70 + i * 86, y = 150 + (i % 2) * 14; g.fillStyle = "#3c4054"; g.beginPath(); g.ellipse(x, y, 26, 30, 0, 0, 7); g.fill(); g.fillStyle = "#1c1822"; g.fillRect(x - 22, y - 8, 44, 14); g.fillStyle = "#ffffff"; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(x + s * 9, y - 1, 6, 5, 0, 0, 7); g.fill(); } g.fillStyle = "#22232b"; g.fillRect(x - 30, y + 30, 60, 70); }
  g.fillStyle = "rgba(255,255,255,0.05)"; for (let y = 0; y < 300; y += 4) g.fillRect(0, y, 400, 1);
  lt(g, "CAM 1  02:00:14", 16, 22, 20, "#ffd45a", 900); lt(g, "REC", 360, 22, 18, "#ff4a4a", 900, "center");
};
export const gpsSheet = (p: Pen) => {
  const g = p.g; sheet(g, 400, 300, "GPS LOG · RX 4471", "#c9861a"); g.fillStyle = "#e9efe0"; g.fillRect(24, 76, 352, 206);
  g.strokeStyle = "#c9ccd2"; g.lineWidth = 8; g.beginPath(); g.moveTo(40, 120); g.lineTo(360, 140); g.moveTo(200, 76); g.lineTo(220, 282); g.stroke();
  g.strokeStyle = "#e2a21a"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(60, 100); g.bezierCurveTo(140, 110, 170, 200, 250, 210); g.lineTo(340, 262); g.stroke();
  for (const [x, y] of [[60, 100], [340, 262]]) { g.fillStyle = "#d8322f"; g.beginPath(); g.arc(x, y, 10, 0, 7); g.fill(); }
};
export const phoneSheet = (p: Pen) => {
  const g = p.g; sheet(g, 400, 300, "PHONE RECORDS", "#2f5fb4");
  const rows = ["01:12  TOWER 1408  WI", "01:31  TOWER 1417  WI", "01:58  TOWER 1427  WI", "02:24  TOWER 1438  IL", "02:51  TOWER 1447  IL"];
  rows.forEach((r, i) => { const y = 96 + i * 38; if (i === 2) { g.fillStyle = "#fff0a0"; g.fillRect(20, y - 16, 360, 32); } lt(g, r, 30, y, 22, INK, 700); });
};
export const printsCard = (p: Pen) => {
  const g = p.g; sheet(g, 400, 300, "FINGERPRINTS", "#5a5d68");
  for (let i = 0; i < 4; i++) { const cx = 70 + i * 88, cy = 180; g.strokeStyle = "#3a3d46"; g.lineWidth = 3; for (let r = 6; r < 40; r += 6) { g.beginPath(); g.ellipse(cx, cy, r * 0.8, r, 0.1 * i, 0.2, 6.0); g.stroke(); } }
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(158, 180, 46, 0, 7); g.globalAlpha = 0.18; g.fill(); g.globalAlpha = 1; lt(g, "MATCH", 158, 254, 26, "#d8322f", 900, "center");
};
/** the rental agreement as pinned evidence (a copy of the signed, stamped page), 400 x 300 */
export const rentalCopy = (p: Pen) => { const g = p.g; g.save(); g.scale(400 / 640, 300 / 900 * 1.6); contract(new Pen(g), 1, 1); g.restore(); g.strokeStyle = "#c9ccd2"; g.lineWidth = 3; g.strokeRect(2, 2, 396, 296); };
/** the WI/IL map, 900 x 1100 portrait: the state line, Lake Michigan, Twin Lakes (top) and Justice (bottom), the gold route */
export const MAP_PINS = { twin: [0.48, 0.24] as [number, number], justice: [0.58, 0.85] as [number, number] };
export const policeMap = (p: Pen) => {
  const g = p.g, W = 900, H = 1100; g.fillStyle = "#eef0e2"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#a8cbe8"; g.beginPath(); g.moveTo(W, 0); g.lineTo(760, 0); g.bezierCurveTo(700, 300, 760, 600, 740, H); g.lineTo(W, H); g.closePath(); g.fill(); // Lake Michigan
  lt(g, "LAKE MICHIGAN", 830, 520, 30, "#5a7aa0", 700, "center"); g.save(); g.translate(830, 520); g.restore();
  g.setLineDash([22, 14]); g.strokeStyle = "#7a5a8a"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 330); g.lineTo(745, 330); g.stroke(); g.setLineDash([]);
  lt(g, "WISCONSIN", 300, 150, 52, "#7a5a8a", 900, "center"); lt(g, "ILLINOIS", 300, 470, 52, "#7a5a8a", 900, "center");
  g.strokeStyle = "#c9ccd2"; g.lineWidth = 14; g.beginPath(); g.moveTo(60, 700); g.lineTo(700, 760); g.moveTo(520, 0); g.lineTo(560, H); g.stroke();
  g.fillStyle = "#d9c9a8"; g.beginPath(); g.ellipse(640, 840, 70, 50, 0, 0, 7); g.fill(); lt(g, "CHICAGO", 640, 840, 24, "#7a6a4a", 900, "center");
  g.fillStyle = "#a8cbe8"; for (const [x, y] of [[400, 250], [450, 280]]) { g.beginPath(); g.ellipse(x, y, 26, 16, 0.3, 0, 7); g.fill(); }
  g.strokeStyle = "#e2a21a"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(MAP_PINS.twin[0] * W, MAP_PINS.twin[1] * H); g.bezierCurveTo(470, 450, 600, 600, MAP_PINS.justice[0] * W, MAP_PINS.justice[1] * H); g.stroke();
  lt(g, "TWIN LAKES", MAP_PINS.twin[0] * W, MAP_PINS.twin[1] * H - 54, 36, INK, 900, "center"); lt(g, "JUSTICE", MAP_PINS.justice[0] * W - 10, MAP_PINS.justice[1] * H + 56, 40, "#c8242a", 900, "center");
};
export const cork = () => (g: CanvasRenderingContext2D, r: () => number) => { g.fillStyle = "#c99a62"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 2600; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,240,200,0.18)" : "rgba(80,50,20,0.18)"; g.fillRect(r() * 512, r() * 256, 3, 3); } };
/** a charge folder, 440 x 600 (portrait): the mugshot, a red CHARGED band; mark 0 none, 1 ARRESTED, 2 WANTED; k = the stamp landing */
export const chargeFolder = (p: Pen, i: number, mark: number, k: number) => {
  const g = p.g; rrect(g, 4, 4, 432, 592, 10, "#e9c87a", INK, 5);
  rrect(g, 40, 40, 360, 300, 6, "#c9d8e8", INK, 4); g.save(); g.beginPath(); g.rect(40, 40, 360, 300); g.clip(); for (let y = 60; y < 340; y += 40) { g.fillStyle = "rgba(60,70,90,0.25)"; g.fillRect(40, y, 360, 2); } face(g, 220, 180, 90, i + 1); g.restore();
  rrect(g, 30, 372, 380, 72, 6, "#c8242a"); lt(g, "CHARGED", 220, 410, 50, "#f4f1ea", 900, "center");
  lt(g, `CASE 26-0${i + 1}  ·  BURGLARY`, 220, 486, 26, INK, 700, "center");
  if (mark === 1) stampIn(g, k, 220, 300, 380, 130, "ARRESTED", "#1d2a44", -0.18);
  if (mark === 2) stampIn(g, k, 220, 300, 360, 130, "WANTED", "#c8242a", 0.16);
};

// ---------------- Justice ----------------
export const welcomeSign = (p: Pen) => {
  const g = p.g, W = 700, H = 420; rrect(g, 6, 6, W - 12, H - 12, 30, "#7a4a2a", INK, 10); rrect(g, 30, 30, W - 60, H - 60, 20, "#9a6a3e");
  lt(g, "VILLAGE OF", W / 2, 110, 54, "#f4e7c4", 900, "center"); lt(g, "JUSTICE", W / 2, 205, 120, "#ffe08a", 900, "center", W - 90); lt(g, "ILLINOIS", W / 2, 296, 40, "#f4e7c4", 700, "center");
  // the scales of justice, carved
  g.strokeStyle = "#f4e7c4"; g.lineWidth = 7; const cx = W / 2, cy = 352; g.beginPath(); g.moveTo(cx, cy - 26); g.lineTo(cx, cy + 22); g.moveTo(cx - 70, cy - 20); g.lineTo(cx + 70, cy - 20); g.stroke();
  for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 70, cy + 2, 18, 0, Math.PI); g.stroke(); }
};
export const policeDoor = (p: Pen) => { const g = p.g; g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 400, 160); g.fillStyle = "#1d2a44"; g.fillRect(0, 100, 400, 60); lt(g, "POLICE", 200, 60, 70, "#1d2a44", 900, "center"); };
