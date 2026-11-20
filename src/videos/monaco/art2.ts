// Monaco reel drawings (canvas): the booster display box's printed faces and shrink-wrap, the lot board, the cellar year plate,
// the 70-lot tag strip, price tags, the breakfast tin label, the façade lettering, flowers, the wine bottle, the scooter tag.
// Plain lettering only (no logos); the box's art window is the REAL Rayquaza δ scan.
import { Pen, INK } from "../../engine/toon";
import { TCG_IMG, rr, text } from "./art";

const font = (g: CanvasRenderingContext2D, w: number, px: number, fam = '"Arial Black", Arial, sans-serif') => { g.font = `${w} ${px}px ${fam}`; };
const scan = (g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number, r = 0.045) => {
  const im = TCG_IMG[name];
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, w * r); g.clip();
  if (im) g.drawImage(im, x, y, w, h); else { g.fillStyle = "#c9a24a"; g.fillRect(x, y, w, h); }
  g.restore();
};

/** the box front, 400 x 560 (20 x 28 cm): deep teal-to-violet print, EX badge, the real Rayquaza δ art, banners */
export const boxFront = (p: Pen, dusty = false) => {
  const g = p.g, W = 400, H = 560;
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#123e5c"); gr.addColorStop(0.55, "#2a2f73"); gr.addColorStop(1, "#4a1f5e");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(120,220,255,0.25)"; g.lineWidth = 3;
  for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(200, 300, 60 + i * 34, 0, Math.PI * 2); g.stroke(); }
  // EX badge
  p.poly(rr(24, 22, 150, 92, 14), "#d8322f", 5);
  text(p, "EX", 87, 59, 52, "#ffffff", INK, 0, 900);
  // title banner
  p.poly(rr(18, 104, 382, 160, 10), "#f2c84a", 5);
  text(p, "ESPÈCES DELTA", 200, 133, 38, "#1d1a22", INK, 0, 900);
  // art window: the real card
  p.poly(rr(70, 176, 330, 512 - 30, 10), "#0c1a2a", 5);
  scan(g, "ds_rayquaza", 82, 188, 236, 324 - 30);
  // bottom banner
  p.poly(rr(18, 492, 382, 546, 10), "#ffffff", 5);
  text(p, "36 BOOSTERS", 140, 520, 30, "#1d1a22", INK, 0, 900);
  p.poly(rr(262, 500, 372, 540, 8), "#2a2f73", 0);
  text(p, "2006", 317, 521, 30, "#f2c84a", INK, 0, 900);
  text(p, "FRANÇAIS", 330, 59, 20, "#bfe7ff", INK, 0, 800);
  if (dusty) { g.fillStyle = "rgba(200,190,170,0.18)"; g.fillRect(0, 0, W, H); }
};
/** the box's side / top faces, 200 x 560: a band of the same print with the set name running up it */
export const boxSide = (p: Pen) => {
  const g = p.g, gr = g.createLinearGradient(0, 0, 0, 560); gr.addColorStop(0, "#123e5c"); gr.addColorStop(1, "#4a1f5e");
  g.fillStyle = gr; g.fillRect(0, 0, 200, 560);
  g.save(); g.translate(100, 280); g.rotate(-Math.PI / 2); text(p, "ESPÈCES DELTA · 36", 0, 0, 34, "#f2c84a", INK, 0, 900); g.restore();
  g.fillStyle = "#d8322f"; g.fillRect(0, 0, 200, 22); g.fillRect(0, 538, 200, 22);
};
/** shrink-wrap: transparent with glossy streaks and a crimped seam; gleam 0..1 = a bright band crossing it */
export const wrapGloss = (p: Pen, gleam = -1) => {
  const g = p.g, W = 256, H = 360;
  g.clearRect(0, 0, W, H);
  g.fillStyle = "rgba(255,255,255,0.10)"; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.beginPath(); g.moveTo(20, H); g.lineTo(48, H); g.lineTo(150, 0); g.lineTo(122, 0); g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.beginPath(); g.moveTo(170, H); g.lineTo(180, H); g.lineTo(256, 120); g.lineTo(256, 96); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 8); g.lineTo(W, 8); g.stroke();
  if (gleam > 0 && gleam < 1) {
    const x = -0.6 * W + 2.2 * W * gleam, gr = g.createLinearGradient(x - 60, 0, x + 60, H * 0.5);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,0.85)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
};
/** torn wrap: only ragged strips left at the edges */
export const wrapTorn = (p: Pen) => {
  const g = p.g, W = 256, H = 360;
  g.clearRect(0, 0, W, H);
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.beginPath(); g.moveTo(0, H); g.lineTo(0, 120); g.lineTo(26, 160); g.lineTo(14, 210); g.lineTo(40, 260); g.lineTo(22, 320); g.lineTo(60, H); g.fill();
  g.beginPath(); g.moveTo(W, H); g.lineTo(W, 200); g.lineTo(230, 240); g.lineTo(244, 300); g.lineTo(210, H); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 3; g.stroke();
};
/** the lot board, 1500 x 800: dark panel, gold frame, LOT 1, ESTIMATE lines that flap on */
export const lotBoard = (p: Pen, a: boolean, b: boolean) => {
  const g = p.g;
  p.poly(rr(10, 10, 1490, 790, 24), "#1b1f2b", 10);
  g.strokeStyle = "#c9a24a"; g.lineWidth = 10; g.strokeRect(40, 40, 1420, 720);
  text(p, "LOT 1", 750, 150, 110, "#e9cf86", INK, 0, 900);
  text(p, "DISPLAY EX ESPÈCES DELTA · 2006", 750, 280, 58, "#cfd6e4", INK, 0, 800);
  if (a) { text(p, "ESTIMATE", 750, 420, 70, "#cfd6e4", INK, 0, 900); text(p, b ? "€130,000 - €180,000" : "€130,000", 750, 580, 120, "#ffd23a", INK, 0, 900); }
  else text(p, "· · ·", 750, 520, 120, "#59607a", INK, 0, 900);
};
/** the cellar year plate, 600 x 200: brass with a dark window of four digits */
export const yearPlate = (p: Pen, year: number) => {
  p.poly(rr(6, 6, 594, 194, 26), "#c9a24a", 8);
  p.poly(rr(110, 40, 490, 160, 12), "#2a1f1a", 5);
  text(p, String(year), 300, 104, 110, "#ffe9a8", INK, 0, 900);
};
/** the 70-lot table's tag strip (front edge), 4096 x 64: LOT 1 ... LOT 70 in two runs (tier A 1-35 here) */
export const tagStrip = (p: Pen, from: number, n: number) => {
  const g = p.g; g.fillStyle = "#f6f1e3"; g.fillRect(0, 0, 4096, 64);
  for (let i = 0; i < n; i++) { const x = (i + 0.5) * (4096 / n); g.fillStyle = "#1d1a22"; g.fillRect(x - 46, 8, 92, 48); text(p, String(from + i), x, 33, 34, "#ffffff", INK, 0, 900); }
};
/** a little paper price tag with a string hole, 300 x 140 */
export const priceTag = (p: Pen, s: string, bg = "#fbf7ec") => {
  const g = p.g; p.poly([[30, 10], [290, 10], [290, 130], [30, 130], [6, 70]], bg, 5);
  p.ell(30, 70, 7, 7, "#7a6a5a", 0); font(g, 900, s.length > 8 ? 34 : 50); g.fillStyle = "#1d1a22"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 165, 72);
};
/** the tin's label, 400 x 160: ĂN SÁNG (Arial has every Vietnamese glyph) */
export const tinLabel = (p: Pen) => {
  const g = p.g; g.fillStyle = "#e2453c"; g.fillRect(0, 0, 400, 160); g.fillStyle = "#fbf7ec"; g.fillRect(0, 40, 400, 80);
  font(g, 900, 58, "Arial, sans-serif"); g.fillStyle = "#1d1a22"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ĂN SÁNG", 200, 82);
};
/** façade lettering on transparent, 3000 x 160 */
export const lettering = (p: Pen) => {
  const g = p.g; font(g, 900, 120, "Georgia, 'Times New Roman', serif"); g.textAlign = "center"; g.textBaseline = "middle";
  g.lineWidth = 10; g.strokeStyle = "#e9c46a"; g.strokeText("HÔTEL DES VENTES DE MONTE-CARLO", 1500, 84);
  g.fillStyle = "#1d2a4a"; g.fillText("HÔTEL DES VENTES DE MONTE-CARLO", 1500, 84);
};
/** a bouquet, 300 x 420: paper cone, round blooms */
export const flowers = (p: Pen) => {
  p.poly([[110, 410], [190, 410], [270, 170], [30, 170]], "#f4efe2", 5);
  const cols = ["#e2453c", "#f2c84a", "#ff8fb1", "#e2453c", "#c56bff", "#ff8fb1", "#f2c84a"];
  [[150, 120], [90, 140], [210, 140], [120, 70], [180, 70], [60, 190], [240, 190]].forEach(([x, y], i) => { p.ell(x, y, 38, 38, cols[i], 5); p.ell(x, y, 12, 12, "#fff3b0", 0); });
  for (const [x, y] of [[70, 230], [230, 230]]) p.ell(x, y, 26, 14, "#4fa548", 4);
};
/** a wine bottle side-on, 120 x 420 (dark green, cream label) */
export const bottle = (p: Pen, corked = true) => {
  p.poly([[40, 410], [80, 410], [92, 200], [70, 150], [70, 40], [50, 40], [50, 150], [28, 200]], "#1f4a2e", 5);
  p.poly(rr(34, 250, 86, 330, 6), "#f4efe2", 3);
  text(p, "1996", 60, 290, 18, "#5a2a2a", INK, 0, 900);
  if (corked) p.poly(rr(48, 18, 72, 44, 4), "#c9a06a", 4); else p.poly(rr(48, 36, 72, 44, 2), "#7a1f2a", 0);
};
export const cork = (p: Pen) => { p.poly(rr(10, 10, 54, 90, 8), "#c9a06a", 5); p.stroke([[18, 30], [46, 30]], 3, "#8a6a40"); };
/** a wine stream (pour), 40 x 200 */
export const stream = (p: Pen) => { const g = p.g; const gr = g.createLinearGradient(0, 0, 0, 200); gr.addColorStop(0, "#7a1f2a"); gr.addColorStop(1, "#a8323f"); g.fillStyle = gr; g.fillRect(14, 0, 12, 200); };
/** a wine glass with fill 0..1, 160 x 260 */
export const wineGlass = (p: Pen, fill: number) => {
  const g = p.g;
  if (fill > 0) { g.save(); g.beginPath(); g.moveTo(30, 30); g.quadraticCurveTo(80, 190, 130, 30); g.closePath(); g.clip(); g.fillStyle = "#8a2433"; g.fillRect(0, 130 - 100 * fill, 160, 200); g.restore(); }
  g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(30, 30); g.quadraticCurveTo(80, 190, 130, 30); g.stroke();
  g.beginPath(); g.moveTo(80, 140); g.lineTo(80, 230); g.moveTo(40, 240); g.lineTo(120, 240); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(44, 44, 8, 50);
};
/** a scrap of torn shrink-wrap, 64 x 64 */
export const shred = (p: Pen, k: number) => {
  const g = p.g; g.fillStyle = "rgba(235,245,255,0.85)"; g.strokeStyle = "rgba(120,140,170,0.9)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(8, 10 + 6 * k); g.lineTo(56, 6); g.lineTo(50, 40 + 8 * k); g.lineTo(24, 56); g.lineTo(6, 36); g.closePath(); g.fill(); g.stroke();
};
/** a coin, 64 x 64 */
export const coin = (p: Pen) => { p.ell(32, 32, 26, 26, "#e9c46a", 5); p.ell(32, 32, 14, 14, "#d4a83a", 0); };
