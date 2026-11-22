// Gengar reel drawings (canvas): the CGC-style slab around a real scan, the SOLD tag (front, back, ghost), the price board and the
// bid counter, the record pole (scale, plates, markers), the census wall of 170 Latios slabs, the IOU note, the writer's laptop page
// and the collector's phone page (FANATICS COLLECT · LỊCH SỬ BÁN), the bill folder, small props (megaphone, bottle, cork, cash, gavel).
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
export const lt = (g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, col: string, w = 700, align: CanvasTextAlign = "left", maxW?: number) => {
  font(g, w, px); g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; if (maxW) g.fillText(s, x, y, maxW); else g.fillText(s, x, y);
};
export const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const rrect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw = 2) => {
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
};
export const stampMark = (g: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, txt: string, col: string, rot: number, alpha = 0.92) => {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = Math.max(4, h * 0.09);
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, h * 0.16); g.stroke(); lt(g, txt, 0, 2, h * 0.56, col, 900, "center", w - h * 0.3); g.restore();
};
export const plainSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, Math.min(W, H) * 0.12, bg, border || undefined, 8);
  lt(g, txt, W / 2, sub ? H * 0.42 : H / 2 + 2, H * (sub ? 0.4 : 0.55), fg, 900, "center", W - 30);
  if (sub) lt(g, sub, W / 2, H * 0.78, H * 0.2, fg, 700, "center", W - 30);
};
/** plain lettering on a transparent canvas */
export const letters = (p: Pen, W: number, H: number, txt: string, col: string, px: number) => { lt(p.g, txt, W / 2, H / 2, px, col, 900, "center", W - 20); };
const GHOST = "rgba(150,96,214,", GHOST_INK = "#5a2f8a";
/** a ghost's face (two eyes and a Gengar-ish grin) at cx, cy, size s */
const ghostFace = (g: CanvasRenderingContext2D, cx: number, cy: number, s: number, a = 1) => {
  g.save(); g.globalAlpha = a; g.fillStyle = "#2a0f45";
  for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(cx + sx * 0.32 * s, cy - 0.12 * s, 0.11 * s, 0.16 * s, 0, 0, 7); g.fill(); }
  g.fillStyle = "#fff"; g.strokeStyle = "#2a0f45"; g.lineWidth = 0.05 * s;
  g.beginPath(); g.moveTo(cx - 0.42 * s, cy + 0.18 * s); g.quadraticCurveTo(cx, cy + 0.55 * s, cx + 0.42 * s, cy + 0.18 * s); g.closePath(); g.fill(); g.stroke();
  for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(cx + i * 0.15 * s, cy + 0.2 * s); g.lineTo(cx + i * 0.15 * s, cy + 0.34 * s); g.stroke(); }
  g.restore();
};

// ---------------- the CGC-style slab (W:H = 0.628) ----------------
export const SLAB_LINES: Record<string, string[]> = {
  lc_gengar: ["Pokémon (2002)", "Legendary Collection", "Gengar - Reverse Holo · 11/110"],
  dx_latios_star: ["Pokémon (2005)", "EX Deoxys", "Latios Gold Star · 106/107"],
};
/** clear case, gold PRISTINE 10 label (the card's own lines), the real scan in the well; gleam 0..1 = a shine crossing it,
 *  flash 0..1 = the grade box lit */
export const cgcSlab = (p: Pen, W: number, H: number, img: string, o: { gleam?: number; flash?: number } = {}) => {
  const g = p.g, s = W / 100, x0 = 3 * s, x1 = W - 3 * s, y0 = 3 * s, y1 = H - 3 * s, L = SLAB_LINES[img] ?? SLAB_LINES.lc_gengar;
  rrect(g, x0, y0, x1 - x0, y1 - y0, 6 * s, "rgba(214,232,244,0.98)", "#1d1b22", 2.2 * s);
  rrect(g, x0 + 3.5 * s, y0 + 3.5 * s, x1 - x0 - 7 * s, y1 - y0 - 7 * s, 4.5 * s, "rgba(236,246,252,0.95)", "rgba(120,140,160,0.8)", 0.8 * s);
  // the label: gold for a Pristine 10
  const lx0 = x0 + 7 * s, lx1 = x1 - 7 * s, ly0 = y0 + 7 * s, ly1 = y0 + 0.245 * (y1 - y0);
  const gr = g.createLinearGradient(lx0, ly0, lx1, ly1); gr.addColorStop(0, "#f6e3a1"); gr.addColorStop(0.5, "#e7c35c"); gr.addColorStop(1, "#c99a2a");
  rrect(g, lx0, ly0, lx1 - lx0, ly1 - ly0, 1.6 * s, "#7a5a14", "#1d1b22", 1.2 * s);
  g.fillStyle = gr; g.beginPath(); g.roundRect(lx0 + 1.4 * s, ly0 + 1.4 * s, lx1 - lx0 - 2.8 * s, ly1 - ly0 - 2.8 * s, 1.2 * s); g.fill();
  lt(g, "CGC", lx0 + 4 * s, ly0 + 5.2 * s, 5.2 * s, "#3a2a08", 900);
  L.forEach((t, i) => lt(g, t, lx0 + 4 * s, ly0 + 11 * s + i * 4.4 * s, 3.5 * s, "#2a1d06", i === 2 ? 800 : 700, "left", 56 * s));
  const bx = lx1 - 25 * s, by = ly0 + 3 * s, bw = 22 * s, bh = ly1 - ly0 - 6 * s;
  rrect(g, bx, by, bw, bh, 1.5 * s, o.flash ? `rgba(255,248,190,${0.5 + 0.5 * Math.min(1, o.flash)})` : "#fbf3d6", "#3a2a08", 0.8 * s);
  lt(g, "PRISTINE", bx + bw / 2, by + 4.4 * s, 3.6 * s, "#3a2a08", 900, "center", bw - 2 * s);
  lt(g, "10", bx + bw / 2, by + bh * 0.66, 11 * s, "#1d1306", 900, "center");
  // the well and the card
  const wy0 = ly1 + 3.5 * s, wy1 = y1 - 5 * s;
  rrect(g, x0 + 8 * s, wy0, x1 - x0 - 16 * s, wy1 - wy0, 3 * s, "rgba(205,224,238,0.92)", "rgba(90,110,130,0.7)", 1 * s);
  const cw = 70 * s, ch = cw / 0.716, cx0 = W / 2 - cw / 2, cy0 = (wy0 + wy1) / 2 - ch / 2;
  scan(g, img, cx0, cy0, cw, ch);
  g.save(); g.globalAlpha = 0.16; g.fillStyle = "#fff"; g.beginPath(); g.moveTo(x0 + 10 * s, y1 - 10 * s); g.lineTo(x0 + 26 * s, y1 - 10 * s); g.lineTo(x1 - 10 * s, y0 + 42 * s); g.lineTo(x1 - 10 * s, y0 + 28 * s); g.fill(); g.restore();
  if (o.gleam !== undefined && o.gleam > 0 && o.gleam < 1) {
    g.save(); g.beginPath(); g.roundRect(x0, y0, x1 - x0, y1 - y0, 6 * s); g.clip();
    const x = -0.6 * W + 2.2 * W * o.gleam, gg = g.createLinearGradient(x - 0.25 * W, 0, x + 0.25 * W, 0.4 * H);
    gg.addColorStop(0, "rgba(255,255,255,0)"); gg.addColorStop(0.5, "rgba(255,255,255,0.75)"); gg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gg; g.fillRect(0, 0, W, H); g.restore();
  }
};

// ---------------- the SOLD tag (320 x 180, hole on the left) ----------------
const tagShape = (g: CanvasRenderingContext2D, wavy = 0) => {
  g.beginPath(); g.moveTo(40, 8); g.lineTo(312, 8); g.lineTo(312, 172);
  if (wavy > 0) { for (let i = 0; i <= 8; i++) { const x = 312 - i * 34.5; g.lineTo(x, 172 + (i % 2 ? -14 : 8) * wavy); } }
  else g.lineTo(40, 172);
  g.lineTo(8, 130); g.lineTo(8, 50); g.closePath();
};
/** the tag's faces; the back is drawn with its hole on the right (it is seen from behind: the hole stays at the string).
 *  front: lot 0..1 = the flip flap from LOT n to SOLD (squash while it turns) */
export const tagFace = (p: Pen, side: "front" | "back", price = 576000, lotTxt = "LOT 11", flip = 1) => {
  const g = p.g;
  g.save(); if (side === "back") { g.translate(320, 0); g.scale(-1, 1); }
  tagShape(g); g.fillStyle = "#fbf3dc"; g.fill(); g.strokeStyle = "#1d1b22"; g.lineWidth = 6; g.stroke();
  g.fillStyle = "#c9a24a"; g.beginPath(); g.arc(36, 90, 15, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#1d1b22"; g.beginPath(); g.arc(36, 90, 6, 0, 7); g.fill();
  g.restore();
  if (side === "front") {
    const sold = flip >= 0.5, k = Math.max(0.06, Math.abs(2 * flip - 1));
    g.save(); g.translate(180, 90); g.scale(1, k); g.translate(-180, -90);
    if (sold) { lt(g, "SOLD", 180, 58, 64, "#d8322f", 900, "center", 240); lt(g, money(price), 180, 128, 50, "#1d1a22", 900, "center", 250); }
    else { lt(g, lotTxt, 180, 70, 60, "#1d1a22", 900, "center", 240); lt(g, "FANATICS COLLECT", 180, 128, 24, "#7a6a4a", 800, "center", 240); }
    g.restore();
  } else { stampMark(g, 142, 90, 250, 100, "CHƯA THANH TOÁN", "#d8322f", -0.08); }
};
/** the tag as a ghost: purple, see-through, a wavy hem, a ghost's face; k 0..1 = how far the change has gone */
export const tagGhost = (p: Pen, k: number) => {
  const g = p.g;
  g.save(); g.translate(320, 0); g.scale(-1, 1); tagShape(g, k); g.fillStyle = `rgba(${Math.round(251 - 101 * k)},${Math.round(243 - 147 * k)},${Math.round(220 - 6 * k)},1)`; g.fill(); g.strokeStyle = k > 0.5 ? GHOST_INK : "#1d1b22"; g.lineWidth = 6; g.stroke(); g.restore();
  g.save(); g.globalAlpha = 1 - 0.7 * k; stampMark(g, 142, 90, 250, 100, "CHƯA THANH TOÁN", "#d8322f", -0.08); g.restore();
  if (k > 0.4) ghostFace(g, 144, 80, 120, (k - 0.4) / 0.6);
};

// ---------------- boards ----------------
/** the price board, 1160 x 440: amber digits, SOLD lamp; v null = cleared ('—'); ok = the green CHÍNH XÁC lamp strip lit */
export const priceBoard = (p: Pen, v: number | null, sold: boolean, ok = 0) => {
  const g = p.g;
  g.fillStyle = "#1a1a20"; g.fillRect(0, 0, 1160, 440); g.fillStyle = "#3a3a44"; g.fillRect(16, 16, 1128, 408); g.fillStyle = "#121216"; g.fillRect(30, 30, 1100, 330);
  lt(g, "GIÁ HIỆN TẠI", 120, 82, 44, "#f2a33a", 700);
  g.fillStyle = sold ? "#ff3b30" : "#4a1a1a"; g.beginPath(); g.arc(1040, 82, 28, 0, 7); g.fill();
  if (sold) lt(g, "SOLD", 1040, 83, 20, "#fff", 900, "center");
  const txt = v === null ? "—" : money(v);
  font(g, 900, 170); g.fillStyle = "#ffcc4a"; g.textAlign = "center"; g.textBaseline = "middle";
  const w = g.measureText(txt).width, k = Math.min(1, 1020 / w); g.save(); g.translate(580, 232); g.scale(k, 1); g.fillText(txt, 0, 0); g.restore();
  // the CHÍNH XÁC lamp strip under the digits
  g.fillStyle = ok ? `rgba(60,${Math.round(150 + 90 * ok)},90,1)` : "#1f2a22"; g.beginPath(); g.roundRect(380, 372, 400, 52, 12); g.fill();
  lt(g, "CHÍNH XÁC", 580, 399, 34, ok ? "#ffffff" : "#3a4a3e", 900, "center");
};
/** the bid counter, 700 x 450: LƯỢT TRẢ GIÁ and a two-digit flap count (flap 0..1 squashes the digits while they turn) */
export const bidCounter = (p: Pen, n: number, flap = 1) => {
  const g = p.g; g.fillStyle = "#1a1a20"; g.fillRect(0, 0, 700, 450); g.fillStyle = "#3a3a44"; g.fillRect(14, 14, 672, 422); g.fillStyle = "#121216"; g.fillRect(28, 28, 644, 394);
  lt(g, "LƯỢT TRẢ GIÁ", 350, 84, 50, "#f2a33a", 800, "center");
  const s = String(n).padStart(2, "0");
  for (let i = 0; i < 2; i++) {
    const x = 210 + i * 280; g.fillStyle = "#24242c"; g.fillRect(x - 110, 140, 220, 250); g.fillStyle = "rgba(0,0,0,0.6)"; g.fillRect(x - 110, 262, 220, 6);
    g.save(); g.translate(x, 268); g.scale(1, Math.max(0.08, flap)); font(g, 900, 230); g.fillStyle = "#ffcc4a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s[i], 0, 0); g.restore();
  }
};

// ---------------- the record pole ----------------
/** the pole's painted scale, 64 x 1024 covering $0..$800,000 from bottom to top (y 0.3..3.5 m = 0..$800k at $250k/m) */
export const poleScale = (p: Pen) => {
  const g = p.g; g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 64, 1024);
  for (let i = 0; i <= 32; i++) { const y = 1024 - (i / 32) * 1024; g.fillStyle = "#1d1b22"; g.fillRect(i % 4 ? 40 : 18, y - 2, 64, i % 4 ? 3 : 6); }
  g.fillStyle = "#d8322f"; g.fillRect(0, 0, 8, 1024);
};
export const poleTop = (p: Pen) => plainSign(p, 600, 170, "KỶ LỤC GENGAR", "#1d1b22", "#f2c84a", "", "#c9a24a");
/** a marker plate, 420 x 150: brass for a paid record; ghost = purple see-through with a ghost's face (not paid yet) */
export const markerPlate = (p: Pen, price: string, sub: string, ghost: boolean) => {
  const g = p.g;
  if (!ghost) {
    const gr = g.createLinearGradient(0, 0, 0, 150); gr.addColorStop(0, "#f6d77a"); gr.addColorStop(1, "#b8862a");
    g.fillStyle = gr; g.beginPath(); g.moveTo(30, 6); g.lineTo(414, 6); g.lineTo(414, 144); g.lineTo(30, 144); g.lineTo(6, 75); g.closePath(); g.fill(); g.strokeStyle = "#1d1b22"; g.lineWidth = 6; g.stroke();
    lt(g, price, 222, 58, 62, "#2a1d06", 900, "center", 360); lt(g, sub, 222, 118, 34, "#3a2a08", 800, "center", 360);
  } else {
    g.fillStyle = GHOST + "0.85)"; g.beginPath(); g.moveTo(30, 6); g.lineTo(414, 6);
    for (let i = 0; i <= 8; i++) g.lineTo(414 - i * 48, 144 + (i % 2 ? -12 : 4)); g.lineTo(6, 75); g.closePath(); g.fill(); g.strokeStyle = GHOST_INK; g.lineWidth = 6; g.stroke();
    lt(g, price, 236, 56, 60, "#ffffff", 900, "center", 300); lt(g, sub, 236, 112, 30, "#f0e2ff", 800, "center", 300);
    ghostFace(g, 60, 74, 56);
  }
};

// ---------------- the census wall (2048 x 1205: 17 x 10 Latios slabs on rails) ----------------
export const censusWall = (p: Pen) => {
  const g = p.g, W = 2048, H = 1205; g.fillStyle = "#14182a"; g.fillRect(0, 0, W, H);
  const cols = 17, rows = 10, cw = 104, ch = 104 / 0.628, gx = (W - cols * cw) / (cols + 1), gy = (H - 60 - rows * ch) / (rows + 1);
  for (let r = 0; r < rows; r++) {
    const y = 60 + gy + r * (ch + gy);
    g.fillStyle = "#8a6a2a"; g.fillRect(10, y + ch + 2, W - 20, 6);
    for (let c = 0; c < cols; c++) {
      const x = gx + c * (cw + gx);
      g.save(); g.translate(x, y); cgcSlab(new Pen(g), cw, ch, "dx_latios_star"); g.restore();
    }
  }
  lt(g, "LATIOS GOLD STAR · CGC PRISTINE 10 · 170+", W / 2, 32, 40, "#e7c35c", 800, "center");
};

// ---------------- the café ----------------
/** the IOU, 400 x 240: ghost = purple see-through note hovering; solid 0..1 fills it white; stamp 0..1 lands the green ĐÃ TRẢ */
export const iouNote = (p: Pen, solid: number, stamp: number) => {
  const g = p.g, k = 1 - solid;
  g.save(); g.beginPath(); g.moveTo(10, 10); g.lineTo(390, 10); g.lineTo(390, 230);
  for (let i = 0; i <= 8; i++) g.lineTo(390 - i * 47.5, 230 + (i % 2 ? -14 : 4) * k); g.closePath();
  g.fillStyle = `rgb(${Math.round(150 + 101 * solid)},${Math.round(96 + 151 * solid)},${Math.round(214 + 26 * solid)})`; g.fill();
  g.strokeStyle = solid > 0.5 ? "#1d1b22" : GHOST_INK; g.lineWidth = 6; g.stroke(); g.restore();
  for (let i = 0; i < 3; i++) { g.fillStyle = solid > 0.5 ? "rgba(63,111,216,0.25)" : "rgba(255,255,255,0.25)"; g.fillRect(30, 150 + i * 26, 340, 3); }
  g.save(); g.translate(200, 92); g.rotate(-0.04); lt(g, "MAI TAO TRẢ", 0, 0, 58, solid > 0.5 ? "#1f3f9a" : "#ffffff", 900, "center", 360); g.restore();
  g.strokeStyle = solid > 0.5 ? "#1f3f9a" : "#f0e2ff"; g.lineWidth = 4; g.beginPath(); g.moveTo(250, 200); g.bezierCurveTo(270, 170, 285, 215, 300, 190); g.bezierCurveTo(315, 168, 325, 214, 350, 192); g.stroke();
  if (k > 0.3) ghostFace(g, 62, 176, 50, (k - 0.3) / 0.7);
  if (stamp > 0) { const s = 1 + 0.6 * (1 - Math.min(1, stamp)); g.save(); g.translate(250, 160); g.scale(s, s); stampMark(g, 0, 0, 230, 90, "ĐÃ TRẢ", "#1f8a4c", -0.12, Math.min(1, stamp)); g.restore(); }
};
export const cashFan = (p: Pen) => {
  const g = p.g;
  for (let i = 0; i < 5; i++) {
    g.save(); g.translate(150, 190); g.rotate(-0.6 + i * 0.3); g.fillStyle = i % 2 ? "#8fd18a" : "#7cc47a"; g.strokeStyle = "#1d1b22"; g.lineWidth = 5;
    g.beginPath(); g.roundRect(-36, -170, 72, 160, 8); g.fill(); g.stroke(); g.fillStyle = "#4f9a4f"; g.beginPath(); g.ellipse(0, -90, 18, 26, 0, 0, 7); g.fill(); g.restore();
  }
};
export const megaphone = (p: Pen) => {
  const g = p.g; g.strokeStyle = "#1d1b22"; g.lineWidth = 6;
  g.fillStyle = "#d8322f"; g.beginPath(); g.moveTo(60, 60); g.lineTo(240, 10); g.lineTo(240, 150); g.lineTo(60, 100); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.ellipse(240, 80, 14, 70, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#2a2c33"; g.beginPath(); g.roundRect(14, 56, 50, 48, 8); g.fill(); g.stroke(); g.beginPath(); g.roundRect(70, 100, 22, 50, 6); g.fill(); g.stroke();
};

// ---------------- the party ----------------
/** a champagne bottle, 120 x 420 (neck up); popped = no cork, foil torn */
export const bottle = (p: Pen, popped: boolean) => {
  const g = p.g; g.strokeStyle = "#1d1b22"; g.lineWidth = 6;
  g.fillStyle = "#1f5a34"; g.beginPath(); g.moveTo(44, 120); g.lineTo(76, 120); g.quadraticCurveTo(82, 190, 106, 220); g.lineTo(106, 400); g.quadraticCurveTo(60, 416, 14, 400); g.lineTo(14, 220); g.quadraticCurveTo(38, 190, 44, 120); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#f4ead0"; g.beginPath(); g.roundRect(18, 270, 84, 70, 6); g.fill(); g.stroke(); lt(g, "BRUT", 60, 305, 24, "#7a5a14", 900, "center");
  g.fillStyle = "#e2b23a"; g.beginPath(); g.moveTo(40, popped ? 70 : 40); g.lineTo(80, popped ? 70 : 40); g.lineTo(78, 170); g.lineTo(42, 170); g.closePath(); g.fill(); g.stroke();
  if (!popped) { g.fillStyle = "#d9b07a"; g.beginPath(); g.roundRect(42, 8, 36, 40, 8); g.fill(); g.stroke(); }
};
export const cork = (p: Pen) => { const g = p.g; g.fillStyle = "#d9b07a"; g.strokeStyle = "#1d1b22"; g.lineWidth = 5; g.beginPath(); g.roundRect(18, 10, 28, 30, 6); g.fill(); g.stroke(); g.fillStyle = "#c9a06a"; g.beginPath(); g.ellipse(32, 46, 16, 10, 0, 0, 7); g.fill(); g.stroke(); };
/** the bill folder lying open, 360 x 240 */
export const billFolder = (p: Pen) => {
  const g = p.g; rrect(g, 6, 6, 348, 228, 16, "#3a2016", "#1d1b22", 6);
  rrect(g, 30, 22, 300, 196, 6, "#fbf7ec", "#1d1b22", 3);
  lt(g, "HÓA ĐƠN", 180, 52, 34, "#1d1a22", 900, "center");
  lt(g, "SÂM PANH x4", 54, 104, 26, "#1d1a22", 700); lt(g, "$$$$", 306, 104, 26, "#1d1a22", 900, "right");
  g.fillStyle = "#1d1a22"; g.fillRect(54, 140, 252, 3); lt(g, "AI TRẢ?", 180, 180, 34, "#d8322f", 900, "center");
};
/** a gavel in the hand, 260 x 110 (the handle runs left, the head on the right) */
export const gavel = (p: Pen) => {
  const g = p.g; g.strokeStyle = "#1d1b22"; g.lineWidth = 6;
  g.fillStyle = "#8a5a34"; g.beginPath(); g.roundRect(10, 46, 160, 18, 8); g.fill(); g.stroke();
  g.fillStyle = "#6e4428"; g.beginPath(); g.roundRect(160, 10, 90, 90, 14); g.fill(); g.stroke(); g.fillStyle = "#c9a24a"; g.fillRect(170, 10, 10, 90); g.fillRect(230, 10, 10, 90);
};
export const paddle = (p: Pen, n: number) => {
  const g = p.g; g.strokeStyle = "#1d1b22"; g.lineWidth = 8;
  g.fillStyle = "#b98e62"; g.beginPath(); g.roundRect(136, 240, 28, 220, 10); g.fill(); g.stroke();
  g.fillStyle = "#fbf7ec"; g.beginPath(); g.ellipse(150, 140, 132, 132, 0, 0, 7); g.fill(); g.stroke();
  lt(g, String(n), 150, 148, 130, "#1d1a22", 900, "center");
};

// ---------------- screens (seen only from their owner's side) ----------------
type Row = { img: string; name: string; price: number; date: string };
export const ROWS: Row[] = [
  { img: "zard_base", name: "Charizard · Base Set", price: 336000, date: "09/10" },
  { img: "ds_metagross_star", name: "Metagross ★ · Delta Species", price: 108000, date: "06/10" },
  { img: "sky_h3", name: "Celebi · Skyridge", price: 192000, date: "03/10" },
  { img: "mewtwo", name: "Mewtwo · Base Set", price: 64000, date: "28/09" },
  { img: "zard_lc", name: "Charizard · Legendary Col.", price: 1250000, date: "21/09" },
  { img: "ds_rayquaza", name: "Rayquaza · Delta Species", price: 846000, date: "14/09" },
  { img: "pikachu", name: "Pikachu · Base Set", price: 412000, date: "07/09" },
  { img: "blastoise", name: "Blastoise · Base Set", price: 288000, date: "02/09" },
];
/** order the rows ghost away in S12, and their totals */
export const GONE_ORDER = [1, 4, 2, 6, 5];
/** the writer's laptop, 1024 x 648: the sales history; gone[i] 0..1 = row i ghosting up and away; noMoney shows the grey gaps' reason */
export const historyPage = (p: Pen, gone: number[], counter: number, noMoney: boolean) => {
  const g = p.g; g.fillStyle = "#f4f5f8"; g.fillRect(0, 0, 1024, 648);
  g.fillStyle = "#14161c"; g.fillRect(0, 0, 1024, 76); lt(g, "FANATICS COLLECT", 512, 30, 30, "#f2c84a", 900, "center"); lt(g, "LỊCH SỬ BÁN · POKÉMON", 512, 60, 20, "#c9ccd2", 700, "center");
  const X0 = 196, X1 = 828, rh = 60, y0 = 92;
  ROWS.forEach((r, i) => {
    const y = y0 + i * rh, u = gone[i] ?? 0;
    g.fillStyle = "#e3e6ec"; g.fillRect(X0, y + rh - 3, X1 - X0, 2);
    if (u > 0) { // the grey gap it leaves
      g.fillStyle = "#eceef2"; g.fillRect(X0, y + 4, X1 - X0, rh - 10);
      if (noMoney) lt(g, "KHÔNG NHẬN ĐƯỢC TIỀN", (X0 + X1) / 2, y + rh / 2 - 1, 22, "#9aa0aa", 800, "center");
    }
    if (u >= 1) return;
    g.save(); g.globalAlpha = 1 - u * 0.85; g.translate(0, -u * 90);
    if (u > 0) { g.fillStyle = `rgba(150,96,214,${0.35 + 0.4 * u})`; g.beginPath(); g.roundRect(X0 - 4, y + 2, X1 - X0 + 8, rh - 6, 10); g.fill(); }
    scan(g, r.img, X0 + 6, y + 5, 34, 48);
    lt(g, r.name, X0 + 54, y + 22, 21, u > 0 ? "#ffffff" : "#1d1a22", 800, "left", 300);
    lt(g, r.date + "/2026", X0 + 54, y + 44, 16, u > 0 ? "#f0e2ff" : "#6a707c", 700);
    lt(g, money(r.price), X1 - 112, y + rh / 2 - 2, 24, u > 0 ? "#ffffff" : "#1d1a22", 900, "right");
    g.fillStyle = u > 0 ? "rgba(255,255,255,0.3)" : "#e2f2e6"; g.beginPath(); g.roundRect(X1 - 100, y + 16, 94, 26, 8); g.fill();
    lt(g, "ĐÃ BÁN", X1 - 53, y + 29, 16, u > 0 ? "#ffffff" : "#1f8a4c", 900, "center");
    if (u > 0.3) ghostFace(g, X0 + 22, y + 30, 34, Math.min(1, (u - 0.3) * 2));
    g.restore();
  });
  g.fillStyle = "#14161c"; g.fillRect(X0, 586, X1 - X0, 52);
  lt(g, "ĐÃ BIẾN MẤT:", X0 + 20, 612, 24, "#c9ccd2", 800); lt(g, money(counter), X1 - 20, 612, 30, "#ff6b6b", 900, "right");
};
/** the collector's phone, 540 x 1080: the sales history scrolled; paid 0..1 stamps the green ĐÃ TRẢ badge on the big row */
export const phonePage = (p: Pen, scroll: number, paid: number) => {
  const g = p.g; rrect(g, 4, 4, 532, 1072, 60, "#16181e", "#0c0d10", 8);
  g.save(); g.beginPath(); g.roundRect(26, 26, 488, 1028, 44); g.clip();
  g.fillStyle = "#f4f5f8"; g.fillRect(26, 26, 488, 1028);
  g.fillStyle = "#14161c"; g.fillRect(26, 26, 488, 150); lt(g, "FANATICS COLLECT", 270, 92, 34, "#f2c84a", 900, "center"); lt(g, "LỊCH SỬ BÁN", 270, 138, 26, "#c9ccd2", 700, "center");
  const rows = [...ROWS.slice(0, 3).map((r) => ({ ...r, big: false })), { img: "zard_lc", name: "Charizard", price: 1000000, big: true }, ...ROWS.slice(3, 6).map((r) => ({ ...r, big: false }))];
  const y0 = 200 - 450 * scroll;
  rows.forEach((r, i) => {
    const y = y0 + i * 150; if (y > 1060 || y < 40) return;
    g.fillStyle = r.big ? "#fff7d6" : "#ffffff"; g.fillRect(40, y, 460, 136); g.fillStyle = "#e3e6ec"; g.fillRect(40, y + 136, 460, 3);
    scan(g, r.img, 56, y + 14, 78, 108);
    lt(g, r.name, 152, y + 36, 30, "#1d1a22", 800, "left", 330); lt(g, money(r.price), 152, y + 82, r.big ? 42 : 32, "#1d1a22", 900, "left", 330);
    if (r.big && paid > 0) { const s = 1 + 0.8 * (1 - Math.min(1, paid)); g.save(); g.translate(408, y + 104); g.scale(s, s); stampMark(g, 0, 0, 170, 56, "ĐÃ TRẢ", "#1f8a4c", -0.1, Math.min(1, paid)); g.restore(); }
  });
  g.restore();
};
