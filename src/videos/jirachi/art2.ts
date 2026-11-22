// Jirachi reel drawings (canvas): the seller's monitor pages (listing, grid of listings, charity banner, SOLD page, ENDED),
// mum's phone post, the hospital calendar, the donation-box label, cash-bundle faces, the 30th-anniversary pack (plain foil with
// "30" lettering, no logo), torn strips and wrappers, the framed photo, the pinboard. Plain lettering only, no logos.
// The card in every listing photo and on every page is the REAL Jirachi ex SIR scan.
import { Pen, INK, bodyFront, Outfit } from "../../engine/toon";
import { TCG_IMG, rr, text } from "./art";

const font = (g: CanvasRenderingContext2D, w: number, px: number, fam = 'Arial, "Helvetica Neue", sans-serif') => { g.font = `${w} ${px}px ${fam}`; };
export const scan = (g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number, r = 0.045) => {
  const im = TCG_IMG[name];
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, w * r); g.clip();
  if (im) g.drawImage(im, x, y, w, h); else { g.fillStyle = "#c9a24a"; g.fillRect(x, y, w, h); }
  g.restore();
};
const lt = (g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, col: string, w = 700, align: CanvasTextAlign = "left") => {
  font(g, w, px); g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; g.fillText(s, x, y);
};
export const TITLE = "JIRACHI SIR · AVERY THE POKE KID";
export const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

/** the monitor page, 1024 x 608. mode: listing (price counts, title types), grid (n tiles, banner, ended), sold (highlights) */
export type Screen = { mode: "listing" | "grid" | "sold"; price?: number; titleN?: number; tiles?: number; banner?: 0 | 1 | 2; ended?: number; hi?: number; pulse?: number };
const bar = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#f4f5f7"; g.fillRect(0, 0, 1024, 608);
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 1024, 64); g.fillStyle = "#d9dce2"; g.fillRect(0, 64, 1024, 2);
  lt(g, "market", 28, 34, 30, "#2a2c33", 900);
  g.fillStyle = "#eceef2"; g.beginPath(); g.roundRect(170, 16, 560, 34, 17); g.fill();
  lt(g, "jirachi sir 30th", 190, 34, 18, "#7a7f8a", 400);
  g.fillStyle = "#3f6fd8"; g.beginPath(); g.roundRect(750, 16, 96, 34, 17); g.fill(); lt(g, "Search", 798, 34, 16, "#fff", 700, "center");
};
const tile = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, price: string, o: { ended?: boolean; hi?: number; title?: string } = {}) => {
  g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(x, y, w, h, 10); g.fill();
  g.strokeStyle = o.hi ? `rgba(226,58,58,${o.hi})` : "#dfe2e8"; g.lineWidth = o.hi ? 6 : 2; g.stroke();
  const ph = h - 64, pw = ph * 0.72; g.fillStyle = "#e9ebef"; g.fillRect(x + 8, y + 8, w - 16, ph);
  scan(g, "jirachi_sir", x + w / 2 - pw / 2 + 6, y + 12, pw - 12, ph - 8);
  lt(g, o.title ?? "Jirachi SIR 155 · AVERY", x + 10, y + ph + 22, 13, "#4a4f5a", 600);
  lt(g, price, x + 10, y + ph + 46, 21, "#1f2128", 900);
  if (o.ended) {
    g.fillStyle = "rgba(240,241,244,0.78)"; g.fillRect(x, y, w, h);
    g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(-0.2);
    g.strokeStyle = "#c23a32"; g.lineWidth = 5; g.strokeRect(-62, -22, 124, 44); lt(g, "ENDED", 0, 1, 28, "#c23a32", 900, "center"); g.restore();
  }
};
const GRID_PRICES = ["$20,000", "$9,999", "$4,999", "$12,500", "$7,500", "$15,000", "$5,500", "$8,800", "$19,999", "$6,000"];
/** side panels (filters, related items): the camera over his shoulder sees the centre column x 252..772 */
const sides = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#ffffff"; g.fillRect(16, 80, 220, 512); g.fillRect(788, 80, 220, 512);
  for (let i = 0; i < 9; i++) { g.fillStyle = "#e3e6eb"; g.fillRect(32, 104 + i * 50, 150 - (i % 3) * 30, 14); g.fillRect(804, 104 + i * 50, 170 - (i % 2) * 40, 14); }
};
export const screenPage = (p: Pen, s: Screen) => {
  const g = p.g; bar(g); sides(g);
  if (s.mode === "listing") {
    g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(252, 80, 520, 512, 14); g.fill();
    g.fillStyle = "#eef0f3"; g.fillRect(266, 96, 166, 228); scan(g, "jirachi_sir", 276, 104, 146, 204);
    g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 5; g.strokeRect(271, 99, 156, 216); // the top loader's edge in the photo
    const n = Math.max(0, Math.min(TITLE.length, s.titleN ?? TITLE.length)), L1 = "JIRACHI SIR ·", t1 = TITLE.slice(0, Math.min(n, L1.length)), t2 = n > L1.length ? TITLE.slice(L1.length + 1, n) : "";
    lt(g, "Title", 446, 106, 16, "#7a7f8a", 600);
    g.fillStyle = "#f7f8fa"; g.fillRect(444, 120, 316, 104); g.strokeStyle = "#cfd3da"; g.lineWidth = 2; g.strokeRect(444, 120, 316, 104);
    lt(g, t1, 456, 150, 27, "#15171c", 800); lt(g, t2, 456, 194, 27, "#15171c", 800);
    if (n < TITLE.length) { font(g, 800, 27); const last = t2 || t1, w = g.measureText(last).width; g.fillStyle = "#3f6fd8"; g.fillRect(458 + w, t2 ? 178 : 134, 3, 32); }
    lt(g, "Seller: cardz_vault · 4.1 ★", 446, 250, 15, "#4a4f5a", 600);
    lt(g, "Price", 266, 352, 16, "#7a7f8a", 600);
    const k = s.pulse && s.pulse > 0 && s.pulse < 1 ? 1 + 0.12 * Math.sin(Math.PI * s.pulse) : 1;
    g.save(); g.translate(266, 404); g.scale(k, k); lt(g, money(s.price ?? 20000), 0, 0, 68, "#c23a32", 900); g.restore();
    lt(g, "Near Mint · 30th Celebration 155/128", 266, 462, 17, "#4a4f5a", 500);
    g.fillStyle = "#3f6fd8"; g.beginPath(); g.roundRect(266, 500, 240, 60, 12); g.fill(); lt(g, "List item", 386, 530, 26, "#fff", 800, "center");
    return;
  }
  if (s.mode === "grid") {
    lt(g, `Results: "jirachi sir avery"`, 266, 96, 18, "#2a2c33", 700);
    const n = s.tiles ?? 10;
    for (let i = 0; i < n; i++) { const c = i % 5, r = Math.floor(i / 5); tile(g, 92 + c * 170, 112 + r * 240, 160, 230, GRID_PRICES[i], { ended: i < (s.ended ?? 0) }); }
    if (s.banner === 1) {
      g.fillStyle = "#2f9a55"; g.beginPath(); g.roundRect(262, 236, 500, 160, 20); g.fill();
      lt(g, "90%", 512, 290, 78, "#ffffff", 900, "center"); lt(g, "TO CHARITY", 512, 358, 40, "#e6ffe9", 900, "center");
    } else if (s.banner === 2) {
      g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(262, 236, 500, 160, 20); g.fill(); g.strokeStyle = "#c23a32"; g.lineWidth = 4; g.stroke();
      lt(g, "Listing details:", 284, 270, 22, "#4a4f5a", 700);
      lt(g, "10% to a kids", 284, 320, 36, "#c23a32", 900); lt(g, "cancer fund", 284, 364, 36, "#c23a32", 900);
    }
    return;
  }
  // sold page: three sold tiles of the same card and the seller's own listing, in the centre column
  lt(g, "Sold · Jirachi SIR 155/128", 266, 96, 18, "#2a2c33", 700);
  const SOLD = ["$65", "$125", "$240"], pos = [[262, 112], [517, 112], [262, 350]];
  SOLD.forEach((v, i) => { tile(g, pos[i][0], pos[i][1], 245, 228, "SOLD " + v, { hi: s.hi && ((i === 0 && s.hi >= 1) || (i === 2 && s.hi >= 2)) ? 1 : 0, title: "Jirachi SIR 155" }); });
  tile(g, 517, 350, 245, 228, "$20,000", { hi: s.pulse && s.pulse > 0 ? 0.5 + 0.5 * Math.sin(s.pulse * Math.PI * 4) : 0 });
};

/** mum's phone screen, 300 x 620: a plain post being typed; posted = the post card is up; press = the POST button down */
export const POST_LINES = ["We are not involved.", "We receive nothing.", "Please take these", "listings down."];
export const phonePost = (p: Pen, n: number[], press: number, posted: number) => {
  const g = p.g;
  g.fillStyle = "#101114"; g.fillRect(0, 0, 300, 620);
  g.fillStyle = "#fbfbfc"; g.beginPath(); g.roundRect(10, 14, 280, 592, 26); g.fill();
  g.fillStyle = "#e8e9ee"; g.fillRect(10, 64, 280, 2);
  lt(g, "New post", 150, 42, 20, "#15171c", 800, "center");
  g.fillStyle = "#c9a9b9"; g.beginPath(); g.arc(44, 100, 18, 0, Math.PI * 2); g.fill();
  lt(g, "avery's family", 72, 100, 15, "#15171c", 700);
  const y0 = 150 - posted * 30;
  POST_LINES.forEach((l, i) => { const k = n[i] ?? 0; if (k > 0) lt(g, l.slice(0, Math.round(k * l.length)), 28, y0 + i * 40, 20, "#15171c", 600); });
  const down = press > 0 && press < 1 ? 1 : 0;
  g.fillStyle = posted > 0 ? "#9aa0aa" : down ? "#2f55b0" : "#3f6fd8"; g.beginPath(); g.roundRect(30, 520 + 3 * down, 240, 54, 27); g.fill();
  lt(g, posted > 0 ? "Posted" : "POST", 150, 548 + 3 * down, 22, "#fff", 800, "center");
};

/** the hospital wall calendar page, 300 x 420 */
export const calendarPage = (p: Pen, month: number, day = 0) => {
  const g = p.g;
  p.poly(rr(8, 8, 292, 412, 10), "#fbf8f0", 6);
  g.fillStyle = "#3f7fc9"; g.fillRect(14, 14, 272, 84);
  lt(g, `THÁNG ${month}`, 150, 58, 44, "#ffffff", 900, "center");
  if (day) { lt(g, String(day), 150, 230, 150, "#2a2c33", 900, "center"); lt(g, "2026", 150, 350, 36, "#7a7f8a", 700, "center"); return; }
  g.strokeStyle = "#c9ccd2"; g.lineWidth = 2;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { g.strokeRect(24 + c * 36, 116 + r * 56, 36, 56); lt(g, String(r * 7 + c + 1), 30 + c * 36, 130 + r * 56, 13, "#7a7f8a", 600); }
};
export const donationLabel = (p: Pen) => {
  const g = p.g; g.fillStyle = "#fbf7ec"; g.fillRect(0, 0, 400, 200);
  g.strokeStyle = "#c23a32"; g.lineWidth = 8; g.strokeRect(10, 10, 380, 180);
  lt(g, "KIDS CANCER", 200, 72, 46, "#c23a32", 900, "center"); lt(g, "FUND", 200, 134, 46, "#c23a32", 900, "center");
};
/** cash bundle top face, 256 x 112: green notes with a paper band */
export const bundleTop = (p: Pen) => {
  const g = p.g; g.fillStyle = "#9fd39a"; g.fillRect(0, 0, 256, 112);
  g.strokeStyle = "#5aa55a"; g.lineWidth = 4; g.strokeRect(10, 10, 236, 92); g.beginPath(); g.ellipse(70, 56, 26, 30, 0, 0, Math.PI * 2); g.stroke();
  lt(g, "100", 196, 30, 22, "#3d7a3d", 900, "center");
  g.fillStyle = "#f2e6c4"; g.fillRect(112, 0, 40, 112); lt(g, "$1000", 132, 56, 12, "#7a5a2a", 900, "center");
};
export const bundleSide = (p: Pen) => {
  const g = p.g; for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#8fc98a" : "#b5e0b0"; g.fillRect(0, i * 4, 256, 4); }
  g.fillStyle = "#f2e6c4"; g.fillRect(112, 0, 40, 64);
};
/** the 30th-anniversary booster pack, 220 x 360: plain foil, "30" lettering, no logo; torn = the top strip is gone */
export const pack = (p: Pen, torn = false) => {
  const g = p.g, top = torn ? 46 : 14;
  const gr = g.createLinearGradient(0, 0, 220, 360); gr.addColorStop(0, "#f7d34a"); gr.addColorStop(0.5, "#e7a43a"); gr.addColorStop(1, "#c2453c");
  const pts: [number, number][] = [];
  for (let i = 0; i <= 10; i++) pts.push([12 + i * 19.6, top + (i % 2 ? 6 : 0)]);
  pts.push([208, 346]); for (let i = 10; i >= 0; i--) pts.push([12 + i * 19.6, 346 + (i % 2 ? -6 : 0)]);
  g.fillStyle = gr; p.poly(pts, null, 0); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
  p.poly(pts, null, 6);
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.moveTo(30, 60); g.lineTo(80, 60); g.lineTo(40, 330); g.lineTo(20, 330); g.fill();
  text(p, "30", 110, 170, 120, "#ffffff", INK, 10, 900);
  text(p, "CELEBRATION", 110, 250, 24, "#fff7d6", INK, 5, 900);
  if (!torn) g.fillStyle = "rgba(0,0,0,0.25)", g.fillRect(14, 44, 192, 3);
};
export const strip = (p: Pen) => {
  const g = p.g; g.fillStyle = "#f2c84a"; g.beginPath(); g.moveTo(8, 10); for (let i = 0; i <= 10; i++) g.lineTo(8 + i * 20, 10 + (i % 2 ? 6 : 0)); g.lineTo(208, 34); g.lineTo(8, 34); g.closePath(); g.fill();
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
};
/** an emptied, crumpled wrapper (lies flat), 200 x 200 */
export const wrapper = (p: Pen, k = 0) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, r = 70 + 22 * Math.sin(i * 2.7 + k * 3); pts.push([100 + r * Math.cos(a), 100 + 0.8 * r * Math.sin(a)]); }
  p.poly(pts, k % 2 ? "#e7a43a" : "#f2c84a", 5);
  p.stroke([[60, 80], [120, 110], [90, 140]], 4, "rgba(120,60,20,0.6)");
};
/** the framed photo on the family shelf, 300 x 380: Avery grinning, holding a card up (the same drawn kid) */
export const photoFrame = (p: Pen, avery: Outfit) => {
  const g = p.g;
  p.poly(rr(6, 6, 294, 374, 8), "#8a5a34", 6); g.fillStyle = "#cfe6f5"; g.fillRect(32, 32, 236, 316);
  g.save(); g.beginPath(); g.rect(32, 32, 236, 316); g.clip();
  g.translate(150 - 300 * 0.42, 70 - 300 * 0.42 * 0.5); g.scale(0.42, 0.42);
  bodyFront(new Pen(g), avery, { mode: "stand", expr: "grin", seed: 5, wave: 1 });
  scan(g, "jirachi_sir", 300 + 70, 470, 110, 154); // the real card held up beside him
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 10; g.beginPath(); g.moveTo(60, 340); g.lineTo(240, 40); g.stroke();
};
/** a sheet of sketches pinned on the studio board, 600 x 400 */
export const pinboard = (p: Pen) => {
  const g = p.g; g.fillStyle = "#c9a06a"; g.fillRect(0, 0, 600, 400);
  const sheets = [[30, 30, 160, 120], [210, 40, 150, 110], [380, 24, 180, 130], [40, 200, 170, 160], [240, 190, 140, 170], [410, 200, 160, 150]];
  sheets.forEach(([x, y, w, h], i) => {
    g.fillStyle = "#fbf8f0"; g.fillRect(x, y, w, h); g.strokeStyle = "#5a5f6a"; g.lineWidth = 3;
    g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w * 0.25, h * 0.25, 0, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(x + w * 0.3, y + h * 0.3); g.lineTo(x + w * 0.5, y + h * 0.12 + (i % 3) * 6); g.lineTo(x + w * 0.7, y + h * 0.3); g.stroke();
    g.fillStyle = "#d8322f"; g.beginPath(); g.arc(x + w / 2, y + 8, 6, 0, Math.PI * 2); g.fill();
  });
};
/** the phone on Avery's tripod, from behind: case, camera lenses, a red REC dot when filming (160 x 300) */
export const phoneRear = (p: Pen, rec: boolean) => {
  p.poly(rr(8, 8, 152, 292, 22), "#2a2c33", 6); p.poly(rr(22, 24, 82, 104, 14), "#3a3d46", 4);
  p.ell(52, 50, 14, 14, "#111", 3); p.ell(52, 82, 14, 14, "#111", 3);
  if (rec) p.ell(120, 40, 9, 9, "#ff3b3b", 0);
};
