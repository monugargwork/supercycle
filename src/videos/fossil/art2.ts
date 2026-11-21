// Drawings for the Fossil sheet reel: the uncut sheet (front grid of the REAL Fossil holo scans, card backs, the damage
// layers), the wallpaper it matches, the 1999 calendar, the TV news, the lot board, the store signs, the condition report,
// the lottery ticket, toy boxes. Plain lettering only, no logos.
import { Pen, INK } from "../../engine/toon";
import { TCG_IMG, rr, text } from "./art";
import { SHEET } from "./story";

const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const font = (g: CanvasRenderingContext2D, w: number, px: number) => { g.font = `${w} ${px}px "Arial Black", Arial, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; };

// sheet canvas: 2 px per mm (72 x 102 cm -> 1440 x 2040)
export const SHW = 1440, SHH = 2040;
const CW = 126, CH = 176, MX = 27, MY = 52;
/** cell (r, c) -> canvas rect */
const cellRect = (r: number, c: number) => [MX + c * CW, MY + r * CH, CW, CH] as const;
/** canvas px of a sheet-local point (x across, z down; centre 0,0) */
export const sheetPx = (x: number, z: number): [number, number] => [(x / 0.72 + 0.5) * SHW, (z / 1.02 + 0.5) * SHH];

/** the front of the sheet: 121 real holo scans in print order, thin white gutters, trim marks; `wreck` adds the damage */
export const sheetFront = (g: CanvasRenderingContext2D, wreck: boolean) => {
  g.fillStyle = "#f4f1e8"; g.fillRect(0, 0, SHW, SHH);
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) {
    const [x, y, w, h] = cellRect(r, c), im = TCG_IMG[SHEET.holos[(r * 11 + c) % 15]];
    if (im) g.drawImage(im, x + 1, y + 1, w - 2, h - 2); else { g.fillStyle = "#e8c43a"; g.fillRect(x + 1, y + 1, w - 2, h - 2); }
  }
  // trim marks in the margins
  g.strokeStyle = "rgba(30,30,40,0.6)"; g.lineWidth = 2;
  for (let c = 0; c <= 11; c++) { const x = MX + c * CW; g.beginPath(); g.moveTo(x, 6); g.lineTo(x, MY - 10); g.moveTo(x, SHH - 6); g.lineTo(x, SHH - MY + 10); g.stroke(); }
  for (let r = 0; r <= 11; r++) { const y = MY + r * CH; g.beginPath(); g.moveTo(4, y); g.lineTo(MX - 6, y); g.moveTo(SHW - 4, y); g.lineTo(SHW - MX + 6, y); g.stroke(); }
  if (!wreck) return;
  // 27 years: yellowed paper, a grey film of dust in the margins
  g.fillStyle = "rgba(196,170,110,0.16)"; g.fillRect(0, 0, SHW, SHH);
  // scratches across row 2 (cols 2-4) and a few more
  const scr = (x0: number, y0: number, x1: number, y1: number, w: number) => {
    g.lineCap = "round"; g.strokeStyle = "rgba(60,50,40,0.55)"; g.lineWidth = w + 2; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + 10, (y0 + y1) / 2 - 8, x1, y1); g.stroke();
    g.strokeStyle = "rgba(255,255,250,0.95)"; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + 10, (y0 + y1) / 2 - 8, x1, y1); g.stroke();
  };
  const [sx, sy] = sheetPx(-0.12, -0.26);
  scr(sx - 190, sy - 34, sx + 180, sy + 30, 9); scr(sx - 140, sy + 12, sx + 150, sy + 52, 6); scr(sx - 70, sy - 56, sx + 110, sy - 20, 5);
  for (let i = 0; i < 14; i++) { const x = hh(i, 1) * SHW, y = hh(i, 2) * SHH, a = hh(i, 3) * 6.28, l = 30 + 60 * hh(i, 4); scr(x, y, x + l * Math.cos(a), y + l * Math.sin(a), 1.6); }
  // glue blob on row 6 (col 8): amber, glossy, with a drip
  const [gx, gy] = sheetPx(0.19, 0.088);
  g.fillStyle = "rgba(196,130,30,0.82)"; g.beginPath(); g.ellipse(gx, gy, 84, 62, 0.4, 0, 6.28); g.fill();
  g.beginPath(); g.ellipse(gx + 30, gy + 60, 22, 40, 0.2, 0, 6.28); g.fill();
  g.strokeStyle = "rgba(120,80,20,0.7)"; g.lineWidth = 4; g.beginPath(); g.ellipse(gx, gy, 70, 52, 0.4, 0, 6.28); g.stroke();
  g.fillStyle = "rgba(255,250,220,0.85)"; g.beginPath(); g.ellipse(gx - 22, gy - 18, 18, 9, 0.4, 0, 6.28); g.fill();
  g.fillStyle = "rgba(214,160,52,0.4)"; g.beginPath(); g.ellipse(sheetPx(-0.25, 0.4)[0], sheetPx(-0.25, 0.4)[1], 34, 24, 1, 0, 6.28); g.fill();
  // crease across rows 8-9: a light ridge beside a dark valley, with a web of small wrinkles
  const [cx, cy] = sheetPx(-0.15, 0.27);
  const crease = (dx: number, dy: number, w: number) => {
    for (const [o, col] of [[-5, "rgba(255,255,255,0.9)"], [5, "rgba(30,20,20,0.75)"]] as const) {
      g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(cx - 330 + dx, cy - 90 + dy + o); g.lineTo(cx - 60 + dx, cy - 10 + dy + o); g.lineTo(cx + 260 + dx, cy + 70 + dy + o); g.stroke();
    }
  };
  crease(0, 0, 9); crease(40, 46, 4); crease(-20, -40, 3.5);
  // dust film and brown age spots
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(110,85,50,${0.08 + 0.1 * hh(i, 7)})`; g.beginPath(); g.arc(hh(i, 8) * SHW, hh(i, 9) * SHH, 6 + 18 * hh(i, 10), 0, 6.28); g.fill(); }
  // the torn corner (top left): the paper is missing there, a ragged edge
  g.fillStyle = "#0000"; g.save(); g.globalCompositeOperation = "destination-out"; g.beginPath(); g.moveTo(0, 0); g.lineTo(150, 0);
  for (let i = 0; i <= 8; i++) g.lineTo(150 - i * 18 + (i % 2 ? 9 : -6), i * 26 + (i % 2 ? 6 : 0)); g.lineTo(0, 230); g.closePath(); g.fill(); g.restore();
};
/** the back of the sheet: rows of generic card backs (blue swirl, no logo); `wreck` adds the torn chunk and dirt */
export const sheetBack = (g: CanvasRenderingContext2D, wreck: boolean) => {
  g.fillStyle = "#f2efe6"; g.fillRect(0, 0, SHW, SHH);
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) {
    const [x, y, w, h] = cellRect(10 - c >= 0 ? r : r, 10 - c);
    const gr = g.createRadialGradient(x + w * 0.45, y + h * 0.45, 4, x + w / 2, y + h / 2, h * 0.7); gr.addColorStop(0, "#3a7fd0"); gr.addColorStop(0.6, "#1d4f9a"); gr.addColorStop(1, "#13306a");
    g.fillStyle = gr; g.fillRect(x + 1, y + 1, w - 2, h - 2);
    g.strokeStyle = "rgba(120,180,255,0.35)"; g.lineWidth = 6; g.beginPath(); for (let k = 0; k < 40; k++) { const a = k * 0.4, rad = 4 + k * 1.3; const px = x + w / 2 + rad * Math.cos(a), py = y + h / 2 + rad * Math.sin(a) * 1.2; if (k) g.lineTo(px, py); else g.moveTo(px, py); } g.stroke();
    g.fillStyle = "rgba(255,210,60,0.55)"; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * 0.18, h * 0.08, 0, 0, 6.28); g.fill();
  }
  if (!wreck) return;
  g.fillStyle = "rgba(160,140,100,0.22)"; g.fillRect(0, 0, SHW, SHH);
  for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(90,70,40,${0.1 + 0.15 * hh(i, 17)})`; g.beginPath(); g.arc(hh(i, 18) * SHW, hh(i, 19) * SHH, 8 + 30 * hh(i, 20), 0, 6.28); g.fill(); }
  // the torn chunk (same corner as the front: canvas top left = the sheet's top-left corner); torn fibres around a hole
  g.fillStyle = "#e9e2cf";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(380, 0); for (let i = 0; i <= 12; i++) g.lineTo(380 - i * 30 + (i % 2 ? 14 : -10), i * 34 + (i % 3 ? 8 : -4)); g.lineTo(0, 420); g.closePath(); g.fill();
  g.strokeStyle = "rgba(120,100,70,0.6)"; g.lineWidth = 3; g.stroke();
  g.save(); g.globalCompositeOperation = "destination-out"; g.beginPath(); g.moveTo(0, 0); g.lineTo(150, 0);
  for (let i = 0; i <= 8; i++) g.lineTo(150 - i * 18 + (i % 2 ? 9 : -6), i * 26 + (i % 2 ? 6 : 0)); g.lineTo(0, 230); g.closePath(); g.fill(); g.restore();
};
/** the holo gleam band (additive, on black): a soft diagonal rainbow streak, 512 x 64 */
export const gleamBand = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, 512, 64);
  const gr = g.createLinearGradient(196, 0, 316, 0);
  gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.3, "#5a3a8a"); gr.addColorStop(0.45, "#8adfff"); gr.addColorStop(0.5, "#ffffff"); gr.addColorStop(0.55, "#ffe07a"); gr.addColorStop(0.7, "#ff7ac8"); gr.addColorStop(1, "rgba(0,0,0,1)");
  g.fillStyle = gr; g.fillRect(196, 0, 120, 64);
};
/** the old wallpaper: the same grid as the sheet, in faded card colours: yellow borders, coloured art boxes, cream text boxes (that's the joke) */
export const wallpaper = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#e9dfc4"; g.fillRect(0, 0, 512, 512);
  const cw = 512 / 6, ch = 512 / 4;
  const art = ["#9c86b8", "#86a8c8", "#c89a7a", "#9cb884", "#c8b070", "#b88aa0"];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const x = c * cw, y = r * ch;
    g.fillStyle = "#d8c070"; g.fillRect(x + 2, y + 2, cw - 4, ch - 4);
    g.fillStyle = art[(r * 6 + c * 5) % 6]; g.fillRect(x + 8, y + 18, cw - 16, ch * 0.42);
    g.fillStyle = "#efe6cc"; g.fillRect(x + 8, y + ch * 0.62, cw - 16, ch * 0.28);
    g.fillStyle = "rgba(90,70,50,0.35)"; g.fillRect(x + 12, y + ch * 0.66, cw - 30, 4); g.fillRect(x + 12, y + ch * 0.75, cw - 40, 4);
  }
  g.fillStyle = "rgba(233,223,196,0.35)"; g.fillRect(0, 0, 512, 512);
  g.fillStyle = "rgba(120,100,70,0.08)"; for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(hh(i, 31) * 512, hh(i, 32) * 512, 20 + 40 * hh(i, 33), 0, 6.28); g.fill(); }
};
/** the wall calendar, 260 x 360: a big year, a month grid; `flip` 0..1 lifts the top page */
export const calendar = (p: Pen, year: number) => {
  const g = p.g;
  p.poly(rr(6, 20, 254, 354, 6), "#fbf8ef", 5);
  p.poly(rr(6, 20, 254, 110, 6), year >= 2026 ? "#3a6fb0" : "#c9473c", 5);
  font(g, 900, 72); g.fillStyle = "#fff"; g.fillText(String(year), 130, 68);
  g.fillStyle = "rgba(40,30,40,0.7)";
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.fillRect(24 + c * 32, 132 + r * 42, 22, 26);
  p.ell(130, 18, 9, 9, "#9a9aa2", 4);
};
/** the TV news, 600 x 360: a crowd shoving at a card-shop shelf, cards flying (t = frame) */
export const tvNews = (p: Pen, t: number) => {
  const g = p.g;
  g.fillStyle = "#cfe0f0"; g.fillRect(0, 0, 600, 360);
  g.fillStyle = "#8a5a34"; g.fillRect(40, 60, 520, 16); g.fillRect(40, 150, 520, 16);
  for (let i = 0; i < 12; i++) { g.fillStyle = ["#e8c43a", "#3a7fd0", "#d8322f", "#5aa64a"][i % 4]; g.fillRect(52 + i * 42, 22, 30, 38); g.fillRect(52 + i * 42, 112, 30, 38); }
  for (let i = 0; i < 9; i++) {
    const x = 60 + i * 62 + 12 * Math.sin(t * 0.7 + i * 1.9), y = 250 + 10 * Math.sin(t * 0.9 + i);
    p.ell(x, y + 70, 34, 60, ["#7b5ac9", "#3f9a55", "#c9473c", "#2f6fc4"][i % 4], 4);
    p.ell(x, y, 26, 26, ["#f5c9a0", "#c99067", "#ecd0b6"][i % 3], 4);
    p.stroke([[x + 10, y + 30], [x + 34 + 10 * Math.sin(t + i), y - 40]], 6, INK);
  }
  for (let i = 0; i < 6; i++) { const k = ((t * 0.04 + i / 6) % 1), x = 120 + i * 70 + 60 * k, y = 120 - 140 * k + 200 * k * k; g.save(); g.translate(x, y); g.rotate(k * 6 + i); g.fillStyle = "#e8c43a"; g.fillRect(-12, -16, 24, 32); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(-12, -16, 24, 32); g.restore(); }
  g.fillStyle = "#d8322f"; g.fillRect(0, 312, 600, 48); font(g, 900, 30); g.fillStyle = "#fff"; g.fillText("POKEMON FEVER", 300, 337);
  g.fillStyle = "rgba(255,255,255,0.08)"; for (let y = 0; y < 360; y += 6) g.fillRect(0, y, 600, 2);
};
/** the lot board, 880 x 380 (dark board, cream lettering) */
export const lotBoard = (p: Pen, a: boolean, b: boolean) => {
  const g = p.g;
  p.poly(rr(6, 6, 874, 374, 14), "#1f2a24", 8);
  g.strokeStyle = "#c9a24a"; g.lineWidth = 4; g.strokeRect(24, 24, 832, 332);
  g.fillStyle = "#f1e6cc"; font(g, 900, 46); g.fillText("CULLENS OF SURREY", 440, 78);
  font(g, 700, 34); g.fillText("LOT 1 · UNCUT FOSSIL HOLO SHEET · 1999", 440, 146);
  g.fillStyle = "#c9a24a"; g.fillRect(140, 182, 600, 3);
  font(g, 900, 40); g.fillStyle = "#f1e6cc"; g.fillText("ESTIMATE", 440, 228);
  font(g, 900, 66); g.fillStyle = "#ffd76a";
  if (a) g.fillText(b ? "£6,000 - £10,000" : "£6,000", 440, 300);
};
/** the KB TOYS hanging sign, 800 x 200, plain block lettering */
export const kbSign = (p: Pen) => { const g = p.g; p.poly(rr(6, 6, 794, 194, 18), "#fbf8ef", 8); font(g, 900, 120); g.fillStyle = "#d8322f"; g.fillText("KB TOYS", 400, 104); };
/** the PROMOTION header strip, 700 x 120 */
export const promoHeader = (p: Pen) => { const g = p.g; p.poly(rr(6, 6, 694, 114, 12), "#d8322f", 6); font(g, 900, 72); g.fillStyle = "#fff"; g.fillText("PROMOTION", 350, 62); };
/** the condition report on its clipboard, 300 x 400; `stamp` 0..1 */
export const report = (p: Pen, stamp: number) => {
  const g = p.g;
  p.poly(rr(10, 10, 290, 390, 12), "#8a5a34", 6); p.poly(rr(26, 40, 274, 378, 4), "#fbf8ef", 4); p.poly(rr(110, 18, 190, 52, 6), "#b9bec6", 4);
  font(g, 900, 22); g.fillStyle = "#241726"; g.fillText("CONDITION REPORT", 150, 74);
  g.fillStyle = "rgba(36,23,38,0.55)"; for (let i = 0; i < 11; i++) g.fillRect(44, 104 + i * 22, 140 + 70 * hh(i, 41), 6);
  if (stamp > 0) { g.save(); g.globalAlpha = Math.min(1, stamp); g.translate(160, 300); g.rotate(-0.22); g.strokeStyle = "#d8322f"; g.lineWidth = 7; g.strokeRect(-110, -32, 220, 64); font(g, 900, 30); g.fillStyle = "#d8322f"; g.fillText("CHECKED", 0, 2); g.restore(); }
};
/** a lottery ticket, 200 x 110 */
export const lottery = (p: Pen) => { const g = p.g; p.poly(rr(6, 6, 194, 104, 8), "#ffe38a", 5); font(g, 900, 26); g.fillStyle = "#d8322f"; g.fillText("XỔ SỐ", 100, 34); g.fillStyle = "#241726"; font(g, 900, 30); g.fillText("27 06 99", 100, 74); };
/** a toy box face, 256 x 256 (bright, plain printing) */
export const toyBox = (g: CanvasRenderingContext2D, k: number) => {
  const cols = [["#2f6fc4", "#ffd23a"], ["#d8322f", "#fff3c4"], ["#3f9a55", "#ffe38a"], ["#ff8a3c", "#2a2c33"], ["#7b5ac9", "#bfe7ff"]][k % 5];
  g.fillStyle = cols[0]; g.fillRect(0, 0, 256, 256);
  g.fillStyle = cols[1]; g.beginPath(); g.arc(128, 120, 64, 0, 6.28); g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.fillRect(24, 206, 208, 28);
  g.strokeStyle = "rgba(20,20,30,0.6)"; g.lineWidth = 8; g.strokeRect(4, 4, 248, 248);
};
/** a sweat drop, 64 x 96 */
export const sweat = (p: Pen) => { p.poly([[32, 6], [56, 58], [32, 90], [8, 58]], "#9fd8ff", 4); p.ell(26, 56, 6, 10, "#ffffff", 0); };
/** a dust mote / sifting dust, 64 x 64 soft */
export const mote = (p: Pen) => { const g = p.g, gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, "rgba(232,222,200,0.9)"); gr.addColorStop(1, "rgba(232,222,200,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); };
/** the loose fan blade, 200 x 80 */
export const fanBlade = (p: Pen) => p.poly([[10, 40], [60, 8], [190, 22], [196, 48], [70, 72]], "#c9d6e2", 5);
/** a rubber-band twang (curved lines), 200 x 120 */
export const twang = (p: Pen, t: number) => { for (let i = 0; i < 3; i++) p.arc(100, 60, 40 + 22 * i + 40 * t, 20 + 8 * i, 200, 340, 5); };
void text;
