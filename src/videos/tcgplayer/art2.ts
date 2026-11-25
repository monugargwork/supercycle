// TCGplayer reel drawings (canvas): the seller's laptop page (the marketplace grid, his listing and the Direct listing that slams onto it),
// the wall TV, the price-scanner screen, the envelope and its stamp, the HQ split-flap board, the night window (fireworks, the dome,
// a paper plane), the nameplate, the desk papers and their stamps, signs, the shop owner's chat, small FX drawings.
// Plain lettering only, no logos. The cards on every page are REAL scans (Magic Alpha, Pokémon Base Set).
import { Pen } from "../../engine/toon";
import { TCG_IMG, rr } from "./art";

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

// ---------------- the laptop (1024 x 648), seen from his eyes ----------------
export type Page = { mode: "market" | "listing"; head?: number; magic?: number; poke?: number; badge?: number; drop?: number; slam?: number; hero?: string };
export const PAGE_MAGIC = ["mtg_bolt", "mtg_serra", "mtg_solring", "mtg_llanowar"], PAGE_POKE = ["zard151", "pika151", "blast151", "venu151"];
const PRICES = ["$42", "$310", "$1,450", "$65", "$350", "$48", "$140", "$95"];
const bar = (g: CanvasRenderingContext2D, head = 1) => {
  g.fillStyle = "#f3f4f7"; g.fillRect(0, 0, 1024, 648);
  g.fillStyle = "#1d2a44"; g.fillRect(0, 0, 1024, 78);
  g.globalAlpha = 0.35 + 0.65 * head; lt(g, "TCGplayer", 30, 40, 40, "#ffffff", 900); g.globalAlpha = 1;
  rrect(g, 300, 20, 470, 38, 19, "#ffffff"); lt(g, "Magic · Pokémon · …", 322, 40, 19, "#7a7f8a", 400);
  rrect(g, 800, 20, 190, 38, 19, "#f2c84a"); lt(g, "Sell", 895, 40, 20, "#1d2a44", 800, "center");
};
const tile = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, img: string, title: string, price: string, seller: string, o: { grey?: number; seal?: boolean; rank?: string } = {}) => {
  rrect(g, x, y, w, h, 12, "#ffffff", o.seal ? "#3f6fd8" : "#dfe2e8", o.seal ? 6 : 2);
  const ph = h - 20, pw = ph * 0.716;
  g.fillStyle = "#eceef2"; g.fillRect(x + 10, y + 10, pw + 16, ph); scan(g, img, x + 18, y + 14, pw, ph - 8);
  const tx = x + pw + 46;
  lt(g, title, tx, y + 40, 26, "#15171c", 800, "left", w - pw - 60);
  lt(g, "Seller: " + seller, tx, y + 80, 20, "#4a4f5a", 600, "left", w - pw - 60);
  lt(g, price, tx, y + 132, 48, "#c23a32", 900);
  if (o.rank) { rrect(g, x + w - 92, y + 12, 78, 40, 20, o.seal ? "#3f6fd8" : "#5a606c"); lt(g, o.rank, x + w - 53, y + 32, 22, "#fff", 900, "center"); }
  if (o.seal) { rrect(g, tx, y + 168, 270, 40, 20, "#3f6fd8"); lt(g, "TCGplayer Direct", tx + 135, y + 188, 21, "#fff", 900, "center"); }
  if (o.grey) { g.fillStyle = `rgba(236,238,242,${0.62 * o.grey})`; g.beginPath(); g.roundRect(x, y, w, h, 12); g.fill(); }
};
export const laptopPage = (p: Pen, s: Page) => {
  const g = p.g;
  bar(g, s.head ?? 1);
  // the camera (his eyes) sees the centre column x 200..824: the content lives there
  if (s.mode === "market" && s.hero) { // one card big enough to read (the voice names its game): fills the column his eyes see
    const H = 540, W = H * 0.716; g.fillStyle = "#e9ecf2"; g.fillRect(200, 84, 624, 564);
    scan(g, s.hero, 512 - W / 2, 96, W, H);
    return;
  }
  if (s.mode === "market") {
    lt(g, "Best sellers", 512, 104, 22, "#2a2c33", 800, "center");
    const items = [...PAGE_MAGIC, ...PAGE_POKE], shown = [s.magic ?? 4, s.poke ?? 4];
    items.forEach((im, i) => {
      const grp = i < 4 ? 0 : 1, j = i % 4; if (j >= shown[grp]) return;
      const w = 148, h = 252, x = 212 + j * (w + 6), y = 124 + grp * (h + 8);
      rrect(g, x, y, w, h, 10, "#ffffff", "#dfe2e8");
      scan(g, im, x + 9, y + 8, 130, 181);
      lt(g, PRICES[i], x + 10, y + 214, 24, "#1f2128", 900);
      lt(g, grp ? "Pokémon" : "Magic", x + w - 8, y + 238, 15, "#7a7f8a", 600, "right");
    });
    const b = s.badge ?? 0;
    if (b > 0) {
      g.save(); g.globalAlpha = Math.min(1, b * 1.5); const y = 648 - 120 * Math.min(1, b);
      rrect(g, 252, y, 520, 84, 42, "#ffffff", "#e2433b", 6);
      lt(g, "an eBay company ♥", 512, y + 43, 40, "#e2433b", 900, "center"); g.restore();
    }
    return;
  }
  // his listing, and the Direct copy dropping onto it
  lt(g, "Charizard ex · 151 · SIR 199/165", 512, 106, 24, "#2a2c33", 800, "center");
  const drop = s.drop ?? 0, slam = s.slam ?? 0, push = 250 * Math.min(1, slam);
  tile(g, 206, 130 + push, 612, 236, "zard151", "Charizard ex", "$350", "thecardnook", { rank: slam > 0 ? "#2" : "#1", grey: Math.min(1, slam) });
  if (drop > 0) tile(g, 206, -260 + 390 * drop, 612, 236, "zard151", "Charizard ex", "$339", "TCGplayer", { seal: true, rank: "#1" });
};

// ---------------- the wall TV (1024 x 576): business news with the GMV counter ----------------
export const tvPage = (p: Pen, v: number, up = 0) => {
  const g = p.g;
  const gr = g.createLinearGradient(0, 0, 0, 576); gr.addColorStop(0, "#1b2f5a"); gr.addColorStop(1, "#0e1a33"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 576);
  rrect(g, 40, 36, 220, 52, 8, "#e2433b"); lt(g, "TIN NÓNG", 150, 63, 30, "#fff", 900, "center");
  lt(g, "TCGplayer · GMV 12 THÁNG", 512, 170, 46, "#ffffff", 800, "center");
  rrect(g, 92, 222, 840, 170, 18, "#0a1222", "#f2c84a", 5);
  lt(g, money(v), 512, 310, 104, "#f2c84a", 900, "center", 800);
  if (up > 0) { g.fillStyle = "#3fd16a"; g.beginPath(); g.moveTo(880, 300 - 30 * up); g.lineTo(920, 350 - 30 * up); g.lineTo(840, 350 - 30 * up); g.fill(); }
  g.fillStyle = "#e2433b"; g.fillRect(0, 470, 1024, 70); lt(g, "eBay: kỷ lục mới · người bán phàn nàn về phí · …", 30, 506, 30, "#fff", 700, "left", 980);
};

/** the price scanner's top screen (256 x 160): 0 = PRICE BOT working, 1 = BỊ CHẶN, 2 = off */
export const botScreen = (p: Pen, st: number, flash = 0) => {
  const g = p.g;
  if (st === 2) { g.fillStyle = "#14161b"; g.fillRect(0, 0, 256, 160); return; }
  g.fillStyle = st ? (flash ? "#ff5a4a" : "#c23a32") : "#1f6a3a"; g.fillRect(0, 0, 256, 160);
  if (!st) { lt(g, "PRICE BOT", 128, 50, 34, "#bff5cf", 900, "center"); lt(g, "$350 ▲", 128, 108, 38, "#ffffff", 900, "center"); return; }
  lt(g, "BỊ CHẶN", 128, 64, 46, "#ffffff", 900, "center"); lt(g, "third-party tool", 128, 116, 22, "#ffe0dc", 700, "center");
};

/** the envelope (440 x 220), addressed; stamped = the red XIN ĐIỀU TRA */
export const envelopeFace = (p: Pen, stamped: number) => {
  const g = p.g;
  rrect(g, 4, 4, 432, 212, 10, "#d8b88a", "#a07a4a", 4);
  g.strokeStyle = "rgba(120,80,40,0.45)"; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 4); g.lineTo(220, 120); g.lineTo(436, 4); g.stroke();
  lt(g, "GỬI: CƠ QUAN LIÊN BANG", 40, 168, 24, "#3a2a1a", 700);
  rrect(g, 360, 24, 56, 66, 4, "#5a86b8");
  if (stamped > 0) {
    g.save(); g.translate(200, 92); g.rotate(-0.12); g.globalAlpha = 0.9 * Math.min(1, stamped);
    g.strokeStyle = "#d12a2a"; g.lineWidth = 7; g.beginPath(); g.roundRect(-150, -40, 300, 80, 10); g.stroke();
    lt(g, "XIN ĐIỀU TRA", 0, 2, 44, "#d12a2a", 900, "center"); g.restore();
  }
};

// ---------------- the HQ split-flap board (1024 x 732) ----------------
export const boardFace = (p: Pen, v: number, spin = 0, small = "GMV 12 THÁNG") => {
  const g = p.g;
  g.fillStyle = "#15171c"; g.fillRect(0, 0, 1024, 732);
  rrect(g, 20, 20, 984, 692, 20, "#1f2229", "#8a8f9a", 6);
  lt(g, small, 512, 110, 64, "#f2c84a", 900, "center");
  const s = money(v).replace("$", ""), digits = s.padStart(13, " ");
  const W = 58, gap = 6, x0 = 540 - (digits.length * (W + gap)) / 2;
  lt(g, "$", x0 - 34, 360, 104, "#ffffff", 900, "center");
  for (let i = 0; i < digits.length; i++) {
    const ch = digits[i], x = x0 + i * (W + gap);
    if (ch === ",") { lt(g, ",", x + W / 2, 420, 90, "#ffffff", 900, "center"); continue; }
    rrect(g, x, 270, W, 180, 8, "#2d313b");
    g.fillStyle = "#0e1014"; g.fillRect(x, 358, W, 4);
    const c = ch === " " ? "" : spin > 0 && i > digits.length - 1 - 11 * spin ? String((Math.floor(spin * 97 + i * 7)) % 10) : ch;
    lt(g, c, x + W / 2, 362, 112, "#ffffff", 900, "center");
  }
  lt(g, "eBay Q3 2026", 512, 560, 40, "#9aa0aa", 700, "center");
  for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? "#3fd16a" : "#2a8a48"; g.fillRect(170 + i * 76, 640 - i * 6, 52, 20 + i * 6); }
};

/** the HQ window on the night city (600 x 750): skyline, the federal dome; fireworks (list of [u 0..1, cx, cy, hue]); plane2 u 0..1 */
export const hqWindow = (p: Pen, fw: [number, number, number, string][], plane = -1, open = 0) => {
  const g = p.g;
  const gr = g.createLinearGradient(0, 0, 0, 750); gr.addColorStop(0, "#1a3fa0"); gr.addColorStop(1, "#3f78d8"); g.fillStyle = gr; g.fillRect(0, 0, 600, 750);
  for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect((i * 137) % 600, (i * 71) % 300, 2, 2); }
  // the dome (the federal building), far right
  g.fillStyle = "#d9dde6"; g.beginPath(); g.ellipse(470, 520, 70, 64, 0, Math.PI, 0); g.fill(); g.fillRect(392, 520, 156, 80); g.fillRect(462, 430, 16, 30);
  for (let i = 0; i < 6; i++) { g.fillStyle = "#b9bec9"; g.fillRect(398 + i * 26, 530, 10, 64); }
  // skyline
  const B = [[0, 470, 90], [80, 400, 70], [150, 520, 60], [205, 360, 80], [280, 450, 60], [335, 560, 50], [560, 480, 40]];
  for (const [x, y, w] of B) { g.fillStyle = "#2a3f7a"; g.fillRect(x, y, w, 750 - y); for (let yy = y + 14; yy < 740; yy += 26) for (let xx = x + 8; xx < x + w - 8; xx += 18) { g.fillStyle = (xx * yy) % 7 < 4 ? "#ffd86a" : "#3a5296"; g.fillRect(xx, yy, 8, 12); } }
  g.fillStyle = "#24386e"; g.fillRect(0, 690, 600, 60);
  for (const [u, cx, cy, hue] of fw) {
    if (u <= 0 || u >= 1) continue;
    const R = 30 + 120 * Math.sqrt(u), a = u < 0.7 ? 1 : (1 - u) / 0.3;
    g.save(); g.globalAlpha = a; g.strokeStyle = hue; g.lineWidth = 5; g.lineCap = "round";
    for (let k = 0; k < 16; k++) { const an = (k / 16) * Math.PI * 2; g.beginPath(); g.moveTo(cx + Math.cos(an) * R * 0.55, cy + Math.sin(an) * R * 0.55 + 20 * u); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R + 30 * u); g.stroke(); }
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(cx, cy, 10 * (1 - u), 0, Math.PI * 2); g.fill(); g.restore();
  }
  if (plane >= 0 && plane <= 1) { // the paper plane flying off toward the dome, shrinking
    const x = 80 + 390 * plane, y = 260 + 200 * plane, s = 1.6 - 1.3 * plane;
    g.save(); g.translate(x, y); g.scale(s, s); g.rotate(0.35); g.fillStyle = "#ffffff"; g.strokeStyle = "#2a2c33"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(40, 0); g.lineTo(-30, -16); g.lineTo(-14, 0); g.lineTo(-30, 16); g.closePath(); g.fill(); g.stroke(); g.restore();
  }
  // frame bars
  g.fillStyle = "#3a3d46"; g.fillRect(296, 0, 8, 750); g.fillRect(0, 372, 600, 8);
  if (open > 0) { g.fillStyle = "rgba(200,220,255,0.18)"; g.fillRect(0, 380, 296, 370); }
};

/** the desk nameplate (512 x 136) */
export const nameplate = (p: Pen, name: string) => {
  const g = p.g; rrect(g, 4, 4, 504, 128, 10, "#2a2c33", "#c9a24a", 6);
  lt(g, name, 256, 60, 52, "#f2d27a", 900, "center", 470); lt(g, "TCGplayer", 256, 108, 22, "#c9ccd2", 700, "center");
};
/** a letter on the desk (300 x 390): red BÁC BỎ stamps n */
export const letterSheet = (p: Pen, n: number) => {
  const g = p.g; g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 300, 390); g.strokeStyle = "#c9c4b6"; g.lineWidth = 4; g.strokeRect(2, 2, 296, 386);
  lt(g, "Gửi Tổng giám đốc,", 24, 40, 22, "#2a2c33", 700);
  for (let i = 0; i < 9; i++) { g.fillStyle = "#c9ccd2"; g.fillRect(24, 76 + i * 30, 250 - (i % 3) * 40, 9); }
  lt(g, "— người bán nhỏ", 276, 360, 18, "#4a4f5a", 600, "right");
  for (let i = 0; i < n; i++) stampMark(g, 150 + (i ? 20 : -10), 150 + i * 110, 230, 70, "BÁC BỎ", "#d12a2a", -0.18 + 0.3 * i);
};
/** the program sheet (300 x 390): green ĐÃ SỬA when fixed */
export const programSheet = (p: Pen, fixed: number) => {
  const g = p.g; g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 300, 390); g.strokeStyle = "#c9c4b6"; g.lineWidth = 4; g.strokeRect(2, 2, 296, 386);
  lt(g, "CHƯƠNG TRÌNH", 150, 44, 28, "#1d2a44", 900, "center"); lt(g, "DIRECT", 150, 84, 34, "#3f6fd8", 900, "center");
  for (let i = 0; i < 7; i++) { g.fillStyle = "#c9ccd2"; g.fillRect(24, 126 + i * 30, 250 - (i % 2) * 50, 9); }
  if (fixed > 0) stampMark(g, 150, 270, 230, 72, "ĐÃ SỬA", "#1f8a4c", -0.1, Math.min(1, fixed));
};
export const stampMark = (g: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, txt: string, col: string, rot: number, alpha = 0.9) => {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = 7;
  g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 10); g.stroke(); lt(g, txt, 0, 2, h * 0.58, col, 900, "center", w - 20); g.restore();
};

// ---------------- signs ----------------
export const plainSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, Math.min(W, H) * 0.12, bg, border || undefined, 8);
  lt(g, txt, W / 2, sub ? H * 0.42 : H / 2 + 2, H * (sub ? 0.4 : 0.55), fg, 900, "center", W - 30);
  if (sub) lt(g, sub, W / 2, H * 0.78, H * 0.2, fg, 700, "center", W - 30);
};
/** the eBay sign: plain bold letters in four colours (not the logo artwork) */
export const ebaySign = (p: Pen) => {
  const g = p.g; g.clearRect(0, 0, 800, 256); font(g, 900, 210); g.textBaseline = "middle"; g.textAlign = "left";
  const cols = ["#e2433b", "#3f6fd8", "#f2b33a", "#5aa64a"]; let x = 120;
  ["e", "B", "a", "y"].forEach((c, i) => { g.lineWidth = 14; g.strokeStyle = "#1d1b22"; g.strokeText(c, x, 130); g.fillStyle = cols[i]; g.fillText(c, x, 130); x += g.measureText(c).width + 6; });
};
export const posterUnion = (p: Pen) => {
  const g = p.g; rrect(g, 4, 4, 392, 552, 14, "#f4f1ea", "#b8322f", 10);
  lt(g, "UNION", 200, 110, 90, "#b8322f", 900, "center"); lt(g, "LOCAL 2023", 200, 190, 40, "#2a2c33", 800, "center");
  g.fillStyle = "#2a2c33"; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(110 + i * 90, 340, 34, 0, Math.PI * 2); g.fill(); g.fillRect(84 + i * 90, 380, 52, 110); }
};
export const closedSign = (p: Pen) => { const g = p.g; rrect(g, 4, 4, 392, 152, 14, "#d8322f", "#1d1b22", 8); lt(g, "ĐÃ ĐÓNG CỬA", 200, 82, 50, "#fff", 900, "center", 360); };

// ---------------- the shop owner's chat (300 x 620) ----------------
export const CHAT = ["Vậy thì gặp 50", "người bán nhỏ đi,", "đừng chỉ gặp mấy", "tài khoản to nhất."];
export const chatPhone = (p: Pen, typed: number[], sent: number) => {
  const g = p.g;
  g.fillStyle = "#101114"; g.fillRect(0, 0, 300, 620); rrect(g, 10, 14, 280, 592, 26, "#eef0f4");
  g.fillStyle = "#ffffff"; g.fillRect(10, 40, 280, 54); lt(g, "Ron · TCGplayer", 150, 68, 19, "#15171c", 800, "center");
  const lines = [CHAT[0] + " " + CHAT[1], CHAT[2] + " " + CHAT[3]].map((_, i) => i);
  void lines;
  const n1 = typed[0] ?? 0, n2 = typed[1] ?? 0, y0 = sent > 0 ? 260 - 120 * Math.min(1, sent) : 260;
  const L1a = CHAT[0], L1b = CHAT[1], L2a = CHAT[2], L2b = CHAT[3];
  const cut = (s: string, k: number) => s.slice(0, Math.round(k * s.length));
  const box = sent > 0;
  if (box) { rrect(g, 24, y0 - 14, 262, 200, 18, "#3f6fd8"); }
  else { rrect(g, 18, 250, 264, 170, 14, "#ffffff", "#cfd3da"); }
  const col = box ? "#ffffff" : "#15171c", yb = box ? y0 + 22 : 282;
  const a1 = Math.min(1, n1 * 2), b1 = Math.max(0, n1 * 2 - 1), a2 = Math.min(1, n2 * 2), b2 = Math.max(0, n2 * 2 - 1);
  [[cut(L1a, a1), 0], [cut(L1b, b1), 1], [cut(L2a, a2), 2], [cut(L2b, b2), 3]].forEach(([t, i]) => { if (t) lt(g, t as string, box ? 36 : 30, yb + (i as number) * 42, 25, col, 800, "left", 240); });
  if (!box) { rrect(g, 210, 596 - 40, 60, 30, 15, "#3f6fd8"); lt(g, "Gửi", 240, 571, 15, "#fff", 800, "center"); }
  else lt(g, "Đã gửi ✓", 272, y0 + 186, 14, "#7a7f8a", 600, "right");
};

// ---------------- small FX drawings ----------------
export const paperPlane = (p: Pen) => {
  const g = p.g; g.fillStyle = "#ffffff"; g.strokeStyle = "#2a2c33"; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.moveTo(190, 50); g.lineTo(10, 10); g.lineTo(60, 50); g.lineTo(10, 90); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(60, 50); g.lineTo(190, 50); g.stroke();
};
export const popper = (p: Pen, fired: boolean) => {
  const g = p.g; g.lineJoin = "round";
  g.fillStyle = "#e2433b"; g.strokeStyle = "#1d1b22"; g.lineWidth = 6; g.beginPath(); g.moveTo(60, 230); g.lineTo(20, 40); g.lineTo(100, 40); g.closePath(); g.fill(); g.stroke();
  for (let i = 0; i < 4; i++) { g.fillStyle = "#f2c84a"; g.fillRect(28 + i * 2, 70 + i * 40, 70 - i * 18, 10); }
  if (!fired) { g.strokeStyle = "#f4f1ea"; g.lineWidth = 4; g.beginPath(); g.moveTo(60, 230); g.lineTo(64, 252); g.stroke(); }
};
export const CONF = ["#e2433b", "#3f6fd8", "#f2c84a", "#5aa64a", "#d36ac9", "#ffffff"];
export const confettiBit = (p: Pen, k: number) => { const g = p.g; g.fillStyle = CONF[k % CONF.length]; if (k % 3 === 0) { g.beginPath(); g.arc(32, 32, 22, 0, Math.PI * 2); g.fill(); } else g.fillRect(10, 22, 44, 20); };
export const stampTool = (p: Pen, col = "#d12a2a") => {
  const g = p.g; g.strokeStyle = "#1d1b22"; g.lineWidth = 6;
  g.fillStyle = "#8a5a34"; g.beginPath(); g.ellipse(100, 52, 44, 40, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.fillStyle = "#b07a48"; g.beginPath(); g.roundRect(82, 84, 36, 110, 8); g.fill(); g.stroke();
  g.fillStyle = "#5a3b2a"; g.beginPath(); g.roundRect(30, 190, 140, 50, 8); g.fill(); g.stroke();
  g.fillStyle = col; g.fillRect(36, 240, 128, 20);
};
export const knife = (p: Pen) => { const g = p.g; g.fillStyle = "#3a2a20"; g.beginPath(); g.roundRect(10, 30, 70, 24, 8); g.fill(); g.fillStyle = "#dfe3ea"; g.strokeStyle = "#1d1b22"; g.lineWidth = 4; g.beginPath(); g.moveTo(80, 28); g.lineTo(240, 34); g.lineTo(80, 56); g.closePath(); g.fill(); g.stroke(); };
export const sackFace = (p: Pen) => { const g = p.g; g.fillStyle = "#b8925a"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(90,60,30,0.25)"; for (let i = 0; i < 40; i++) g.fillRect((i * 53) % 256, (i * 31) % 256, 30, 3); lt(g, "$", 64, 128, 70, "#2f5a2a", 900, "center"); lt(g, "$", 192, 128, 70, "#2f5a2a", 900, "center"); };
export const boxSide = (p: Pen) => { const g = p.g; g.fillStyle = "#c99a62"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#e9d7a8"; g.fillRect(52, 0, 24, 128); g.fillStyle = "rgba(90,60,30,0.5)"; g.fillRect(0, 0, 128, 4); };
export const coinFace = (p: Pen) => { const g = p.g; g.fillStyle = "#e9b93a"; g.beginPath(); g.arc(32, 32, 30, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#a07a1a"; g.lineWidth = 4; g.beginPath(); g.arc(32, 32, 22, 0, Math.PI * 2); g.stroke(); };
void rr;
