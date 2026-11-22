// Lucas reel drawings (canvas): the scale's LCD, booster-pack fronts (the REAL card art of each set's mascot cropped from the scan,
// plain lettering, no logos), calendar pages, Lucas's phone screens (the creators chat list with replies and ghosts, the dealer's
// reply, the transfer notice, the Shadowless message with the real Base Set Charizard photo), the laptop post, the check with the
// misspelt name, signs (LOS ANGELES, CARD SHOW, WE BUY · CASH, WE BUY CARDS), envelope, cardboard, rock candy, loupe.
import { Pen, INK } from "../../engine/toon";
import { TCG_IMG, rr } from "./art";

const font = (g: CanvasRenderingContext2D, w: number, px: number, fam = 'Arial, "Helvetica Neue", sans-serif') => { g.font = `${w} ${px}px ${fam}`; };
export const scan = (g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number, r = 0.045) => {
  const im = TCG_IMG[name];
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, w * r); g.clip();
  if (im) g.drawImage(im, x, y, w, h); else { g.fillStyle = "#c9a24a"; g.fillRect(x, y, w, h); }
  g.restore();
};
/** the art window of a real scan (the picture box of a 1999-era card: about 8-92 % across, 11-48 % down) into a rect */
const artCrop = (g: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h: number) => {
  const im = TCG_IMG[name];
  if (!im) { g.fillStyle = "#8a6a4a"; g.fillRect(x, y, w, h); return; }
  const sx = im.width * 0.09, sy = im.height * 0.11, sw = im.width * 0.82, sh = im.height * 0.37;
  g.drawImage(im, sx, sy, sw, sh, x, y, w, h);
};
export const lt = (g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, col: string, w = 700, align: CanvasTextAlign = "left") => {
  font(g, w, px); g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; g.fillText(s, x, y);
};
const fitText = (g: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, maxW: number, col: string, w = 900, align: CanvasTextAlign = "center") => {
  font(g, w, px); let p2 = px; while (g.measureText(s).width > maxW && p2 > 8) { p2 -= 1; font(g, w, p2); }
  g.fillStyle = col; g.textAlign = align; g.textBaseline = "middle"; g.fillText(s, x, y);
};

// ---------------- booster packs ----------------
export const PACK_SETS: { name: string; card: string; col: string; col2: string }[] = [
  { name: "BASE SET", card: "zard_base", col: "#2f5fb4", col2: "#e8c45a" },
  { name: "JUNGLE", card: "jg_scyther", col: "#2f8a45", col2: "#f2e27a" },
  { name: "FOSSIL", card: "fs_aerodactyl", col: "#8a5a34", col2: "#e8d6a8" },
  { name: "ROCKET", card: "tr_dark_zard", col: "#2a2230", col2: "#d8322f" },
];
/** a sealed pack front, 220 x 360: crimped ends, foil body in the set colour, the mascot's real card art, the set name */
export const packFront = (p: Pen, k: number) => {
  const g = p.g, S = PACK_SETS[k % 4];
  p.poly(rr(10, 6, 210, 354, 10), S.col, 6);
  for (const y of [6, 330]) { g.fillStyle = "rgba(255,255,255,0.28)"; for (let x = 16; x < 204; x += 10) g.fillRect(x, y + 4, 5, 20); }
  const gr = g.createLinearGradient(10, 0, 210, 360); gr.addColorStop(0, "rgba(255,255,255,0.25)"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,0.18)");
  g.fillStyle = gr; g.fillRect(14, 32, 192, 296);
  g.save(); g.beginPath(); g.roundRect(26, 92, 168, 150, 12); g.clip(); artCrop(g, S.card, 26, 92, 168, 150); g.restore();
  g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.roundRect(26, 92, 168, 150, 12); g.stroke();
  g.fillStyle = S.col2; g.beginPath(); g.roundRect(22, 44, 176, 40, 8); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  fitText(g, S.name, 110, 65, 30, 160, INK, 900);
  lt(g, "BOOSTER", 110, 266, 26, S.col2, 900, "center");
  lt(g, "11 CARDS", 110, 300, 18, "rgba(255,255,255,0.85)", 700, "center");
};
/** the side/back of a pack (plain foil) */
export const packBack = (p: Pen, k: number) => { const S = PACK_SETS[k % 4]; p.poly(rr(4, 4, 60, 100, 4), S.col, 3); };

// ---------------- scale, clock, calendar ----------------
/** the jewellery scale's LCD, 240 x 90: grams with two decimals; gold = the alchemist glow */
export const lcd = (p: Pen, grams: number | null, gold = 0) => {
  const g = p.g;
  g.fillStyle = gold > 0 ? `rgb(${Math.round(150 + 105 * gold)},${Math.round(190 + 25 * gold)},${Math.round(120 - 60 * gold)})` : "#9fc0a0"; g.fillRect(0, 0, 240, 90);
  g.strokeStyle = "#2a2c33"; g.lineWidth = 8; g.strokeRect(4, 4, 232, 82);
  const s = grams === null ? "0.00" : grams.toFixed(2);
  font(g, 700, 54, '"Courier New", monospace'); g.fillStyle = "#1c2a1c"; g.textAlign = "right"; g.textBaseline = "middle"; g.fillText(s, 190, 48);
  lt(g, "g", 222, 54, 26, "#1c2a1c", 700, "right");
};
export const calPage = (p: Pen, head: string, big: string, circle = false, sub = "") => {
  const g = p.g;
  p.poly(rr(8, 8, 292, 412, 10), "#fbf8f0", 6);
  g.fillStyle = "#c23a32"; g.fillRect(14, 14, 272, 84);
  fitText(g, head, 150, 58, 42, 250, "#ffffff", 900);
  lt(g, big, 150, 236, big.length > 2 ? 96 : 150, "#2a2c33", 900, "center");
  if (circle) { g.strokeStyle = "#d8322f"; g.lineWidth = 10; g.beginPath(); g.ellipse(150, 236, 104, 86, -0.08, 0, Math.PI * 2); g.stroke(); }
  if (sub) lt(g, sub, 150, 360, 34, "#7a7f8a", 700, "center");
};
/** the calendar state: n = how many pages torn so far, along a fixed list of pages */
export const CAL_PAGES: [string, string, boolean, string][] = [
  ["THÁNG 6", "6", false, ""], ["THÁNG 7", "7", false, ""], ["THÁNG 8", "8", false, ""], ["THÁNG 9", "30", true, "CUỐI THÁNG"],
  ["THỨ HAI", "T2", false, "TUẦN SAU"],
  ["THÁNG 10", "10", false, ""], ["THÁNG 11", "11", false, ""], ["THÁNG 12", "12", false, ""], ["THÁNG 1", "1", false, ""],
  ["THÁNG 2", "2", false, ""], ["THÁNG 3", "3", false, ""], ["THÁNG 4", "4", false, ""], ["THÁNG 5", "5", false, ""], ["THÁNG 5", "8", false, "THÁNG SAU"]];

// ---------------- phone screens (300 x 620, seen only from the owner's side) ----------------
const phoneFrame = (g: CanvasRenderingContext2D, top = "#f4f5f7") => {
  g.fillStyle = top; g.fillRect(0, 0, 300, 620);
  g.fillStyle = "#1f2128"; g.fillRect(0, 0, 300, 26); lt(g, "9:41", 18, 14, 13, "#fff", 700); lt(g, "▮▮▮", 282, 14, 11, "#fff", 700, "right");
};
export const CREATORS = ["@packripz", "@cardking", "@holohunt", "@vintagemon", "@ripnflip", "@tcgdaily", "@poke_jay", "@slabgod", "@mintcards", "@boostbro", "@wotcvault", "@cardboardz"];
const ghost = (g: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  g.fillStyle = "#ffffff"; g.strokeStyle = "#9aa0aa"; g.lineWidth = 2.5;
  g.beginPath(); g.arc(x, y - r * 0.2, r * 0.8, Math.PI, 0); g.lineTo(x + r * 0.8, y + r * 0.75);
  for (let i = 0; i < 4; i++) { const xa = x + r * 0.8 - (i + 0.5) * r * 0.4; g.quadraticCurveTo(xa, y + r * (i % 2 ? 0.95 : 0.45), xa - r * 0.2, y + r * 0.75); }
  g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#2a2c33"; g.beginPath(); g.ellipse(x - r * 0.28, y - r * 0.2, r * 0.12, r * 0.18, 0, 0, 7); g.ellipse(x + r * 0.28, y - r * 0.2, r * 0.12, r * 0.18, 0, 0, 7); g.fill();
};
/** S06: the chat list. sent/replied/ghosted = how many rows (0..12) have reached that state; k = sub-frame fade of the newest */
export const chatList = (p: Pen, sent: number, replied: number, ghosted: number) => {
  const g = p.g; phoneFrame(g);
  g.fillStyle = "#ffffff"; g.fillRect(0, 26, 300, 50); lt(g, "Messages", 150, 52, 22, "#1f2128", 900, "center");
  const cols = ["#e2453c", "#3f6fd8", "#2f9a55", "#e7a43a", "#7b5ac9", "#2f5f6a"];
  for (let i = 0; i < 12; i++) {
    const y = 82 + i * 44.5, gh = i < ghosted;
    g.fillStyle = gh ? "#eceef2" : "#ffffff"; g.fillRect(6, y, 288, 41);
    if (gh) ghost(g, 28, y + 21, 18); else { g.fillStyle = cols[i % 6]; g.beginPath(); g.arc(28, y + 21, 16, 0, 7); g.fill(); lt(g, CREATORS[i][1].toUpperCase(), 28, y + 22, 16, "#fff", 900, "center"); }
    lt(g, CREATORS[i], 52, y + 13, 14, gh ? "#9aa0aa" : "#1f2128", 800);
    if (gh) lt(g, "Seen", 52, y + 30, 13, "#9aa0aa", 600);
    else if (i < replied) { g.fillStyle = "#2f9a55"; g.beginPath(); g.roundRect(50, y + 21, 120, 17, 8); g.fill(); lt(g, "I'LL BUY IT!", 58, y + 30, 12, "#fff", 900); }
    else if (i < sent) lt(g, "Sealed WOTC lot, interested?", 52, y + 30, 12, "#5a606b", 500);
    if (i < sent && !gh) lt(g, i < replied ? "✓✓" : "✓", 286, y + 13, 12, i < replied ? "#3f6fd8" : "#9aa0aa", 700, "right");
  }
};
/** a single chat with one contact (S07 the dealer's reply, S10 the refund message with the Charizard photo) */
export const chatOne = (p: Pen, who: string, lines: { t: string; me?: boolean; n?: number; red?: string; photo?: string }[], lit = 1) => {
  const g = p.g; phoneFrame(g, "#eef0f4");
  g.fillStyle = "#ffffff"; g.fillRect(0, 26, 300, 56); g.fillStyle = "#22232a"; g.beginPath(); g.arc(34, 54, 18, 0, 7); g.fill(); lt(g, "LA", 34, 55, 13, "#fff", 900, "center");
  lt(g, who, 62, 54, 18, "#1f2128", 900);
  let y = 100;
  for (const L of lines) {
    if (L.photo) { const w = 150, h = 209; g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(12, y, w + 12, h + 12, 12); g.fill(); scan(g, L.photo, 18, y + 6, w, h); y += h + 22; continue; }
    const s = L.n === undefined ? L.t : L.t.slice(0, L.n);
    font(g, 700, 17); const words = s.split(" "); const rows: string[] = []; let cur = "";
    for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > 220 && cur) { rows.push(cur); cur = w; } else cur = t; }
    if (cur) rows.push(cur);
    const h = 16 + rows.length * 22, x = L.me ? 300 - 12 - 240 : 12;
    g.fillStyle = L.me ? "#3f6fd8" : "#ffffff"; g.beginPath(); g.roundRect(x, y, 240, h, 14); g.fill();
    rows.forEach((r, i) => {
      if (L.red && r.includes(L.red)) {
        const [a, b] = r.split(L.red); font(g, 700, 17); const wa = g.measureText(a).width; const wr = (font(g, 900, 17), g.measureText(L.red).width);
        lt(g, a, x + 12, y + 18 + i * 22, 17, "#1f2128", 700); lt(g, L.red, x + 12 + wa, y + 18 + i * 22, 17, "#d8322f", 900); lt(g, b ?? "", x + 12 + wa + wr, y + 18 + i * 22, 17, "#1f2128", 700);
      } else lt(g, r, x + 12, y + 18 + i * 22, 17, L.me ? "#fff" : "#1f2128", 700);
    });
    y += h + 10;
  }
  if (lit < 1) { g.fillStyle = `rgba(0,0,0,${0.85 * (1 - lit)})`; g.fillRect(0, 0, 300, 620); }
};
/** a lock-screen notification (S07 the reply arriving, S08 the transfer) */
export const notice = (p: Pen, title: string, body: string, k: number, green = false) => {
  const g = p.g; g.fillStyle = "#1c2440"; g.fillRect(0, 0, 300, 620);
  const gr = g.createLinearGradient(0, 0, 0, 620); gr.addColorStop(0, "#2a3a6a"); gr.addColorStop(1, "#6a3a5a"); g.fillStyle = gr; g.fillRect(0, 0, 300, 620);
  lt(g, "9:41", 150, 110, 64, "rgba(255,255,255,0.92)", 300, "center");
  if (k <= 0) return;
  g.globalAlpha = Math.min(1, k); const y = 200 - 30 * (1 - Math.min(1, k));
  g.fillStyle = "rgba(255,255,255,0.92)"; g.beginPath(); g.roundRect(14, y, 272, 92, 16); g.fill();
  g.fillStyle = green ? "#2f9a55" : "#22232a"; g.beginPath(); g.roundRect(26, y + 14, 34, 34, 8); g.fill(); lt(g, green ? "$" : "LA", 43, y + 32, green ? 22 : 13, "#fff", 900, "center");
  lt(g, title, 70, y + 26, 15, "#1f2128", 900); fitText(g, body, 70, y + 56, 15, 206, "#3a3f4a", 600, "left");
  g.globalAlpha = 1;
};

// ---------------- laptop, check ----------------
export const POST17 = "No amount of money is worth going through that.";
export const laptopPost = (p: Pen, n: number, pressed: number, posted: boolean) => {
  const g = p.g; g.fillStyle = "#f4f5f7"; g.fillRect(0, 0, 800, 500);
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 800, 50); g.fillStyle = "#d9dce2"; g.fillRect(0, 50, 800, 2); lt(g, "forum", 24, 26, 24, "#e2633b", 900);
  g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(40, 80, 720, 330, 14); g.fill(); g.strokeStyle = "#d9dce2"; g.lineWidth = 2; g.stroke();
  lt(g, "Selling my fiancée's childhood collection: 8 months.", 64, 116, 22, "#1f2128", 900);
  g.fillStyle = "#e9ebef"; for (let i = 0; i < 3; i++) g.fillRect(64, 150 + i * 26, 640 - i * 90, 12);
  const s = POST17.slice(0, n);
  font(g, 700, 30); const words = s.split(" "); const rows: string[] = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > 640 && cur) { rows.push(cur); cur = w; } else cur = t; }
  rows.push(cur);
  rows.forEach((r, i) => lt(g, r, 64, 262 + i * 42, 30, "#1f2128", 700));
  if (n < POST17.length && Math.floor(n / 3) % 2 === 0) { const last = rows[rows.length - 1]; font(g, 700, 30); g.fillStyle = "#3f6fd8"; g.fillRect(64 + g.measureText(last).width + 3, 246 + (rows.length - 1) * 42, 3, 32); }
  g.fillStyle = posted ? "#2f9a55" : pressed ? "#c2522f" : "#e2633b"; g.beginPath(); g.roundRect(620 + pressed * 4, 360 + pressed * 3, 120, 40, 20); g.fill(); lt(g, posted ? "POSTED" : "POST", 680 + pressed * 4, 381 + pressed * 3, 18, "#fff", 900, "center");
};
export const CHECK_NAME = "Lukas DeRiter";
/** the shop's check, 720 x 320; n = letters of the misspelt name written so far */
export const check = (p: Pen, n: number) => {
  const g = p.g; g.fillStyle = "#e9f2ea"; g.fillRect(0, 0, 720, 320);
  g.strokeStyle = "rgba(80,130,90,0.25)"; g.lineWidth = 1; for (let y = 10; y < 320; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(720, y + 30); g.stroke(); }
  g.strokeStyle = "#5a8a64"; g.lineWidth = 6; g.strokeRect(6, 6, 708, 308);
  lt(g, "GOLDEN STATE CARDS", 30, 40, 22, "#2f5a3a", 900); lt(g, "No. 1042", 690, 40, 18, "#2f5a3a", 700, "right");
  lt(g, "PAY TO THE", 30, 130, 16, "#2f5a3a", 700); lt(g, "ORDER OF", 30, 150, 16, "#2f5a3a", 700);
  g.fillStyle = "#2f5a3a"; g.fillRect(130, 162, 400, 2); g.fillRect(560, 162, 130, 2);
  lt(g, "$", 548, 146, 24, "#2f5a3a", 900);
  g.fillRect(30, 232, 660, 2); lt(g, "DOLLARS", 690, 218, 14, "#2f5a3a", 700, "right");
  g.fillRect(420, 292, 270, 2); lt(g, "MEMO", 30, 290, 14, "#2f5a3a", 700);
  const s = CHECK_NAME.slice(0, n);
  font(g, 400, 46, '"Bradley Hand", "Segoe Script", cursive'); g.fillStyle = "#1f2a6a"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText(s, 140, 156);
  if (n >= CHECK_NAME.length) { g.save(); g.translate(470, 246); g.rotate(-0.04); font(g, 400, 34, '"Bradley Hand", cursive'); g.fillStyle = "#1f2a6a"; g.fillText("~~~~~~~", -380, 0); g.restore(); }
};

// ---------------- signs and surfaces ----------------
export const signText = (p: Pen, W: number, H: number, lines: string[], bg: string, fg: string, border = "#ffffff") => {
  const g = p.g; g.fillStyle = bg; g.beginPath(); g.roundRect(0, 0, W, H, H * 0.08); g.fill();
  g.strokeStyle = border; g.lineWidth = H * 0.04; g.beginPath(); g.roundRect(H * 0.05, H * 0.05, W - H * 0.1, H - H * 0.1, H * 0.06); g.stroke();
  lines.forEach((l, i) => fitText(g, l, W / 2, (H * (i + 0.5)) / lines.length + (lines.length > 1 ? (i ? -H * 0.04 : H * 0.04) : 0), (H / lines.length) * 0.56, W * 0.86, fg, 900));
};
export const envelopeFace = (p: Pen) => {
  const g = p.g; g.fillStyle = "#d9b77a"; g.fillRect(0, 0, 460, 220);
  g.fillStyle = "#8fd18a"; g.fillRect(40, -10, 380, 34); g.strokeStyle = "#5aa55a"; g.lineWidth = 3; for (let x = 60; x < 420; x += 26) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 24); g.stroke(); }
  g.strokeStyle = "rgba(90,60,20,0.6)"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 24); g.lineTo(230, 130); g.lineTo(460, 24); g.stroke();
  g.strokeStyle = INK; g.lineWidth = 8; g.strokeRect(4, 4, 452, 212);
};
export const cardboardTex = (p: Pen, label = "") => {
  const g = p.g; g.fillStyle = "#c99a62"; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(120,80,40,0.25)"; for (let i = 0; i < 40; i++) g.fillRect(0, i * 6.4, 256, 1.5);
  g.fillStyle = "#b88a52"; g.fillRect(110, 0, 36, 256);
  if (label) lt(g, label, 128, 200, 26, "rgba(60,40,20,0.75)", 900, "center");
};
/** a rock-candy stick (fx), 120 x 300: wooden stick, blue crystal cluster */
export const rockCandy = (p: Pen, bitten = 0) => {
  const g = p.g;
  p.poly([[54, 120], [66, 120], [66, 296], [54, 296]], "#d9b77a", 3);
  const pts: [number, number][] = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, r = (i % 2 ? 34 : 50) * (1 + 0.1 * Math.sin(i * 3.1)); pts.push([60 + r * Math.cos(a) * 0.9, 80 + r * Math.sin(a) * 1.35]); }
  p.poly(pts, "#7fc8f2", 5);
  g.fillStyle = "rgba(255,255,255,0.7)"; for (const [x, y] of [[48, 50], [70, 80], [52, 110], [74, 40]]) { g.beginPath(); g.moveTo(x, y - 10); g.lineTo(x + 5, y); g.lineTo(x, y + 10); g.lineTo(x - 5, y); g.closePath(); g.fill(); }
  if (bitten > 0) { g.globalCompositeOperation = "destination-out"; g.beginPath(); g.arc(60, 18, 26, 0, 7); g.fill(); g.globalCompositeOperation = "source-over"; }
};
export const chip = (p: Pen) => { p.poly([[20, 6], [36, 18], [30, 36], [10, 32], [4, 14]], "#7fc8f2", 3); };
/** a loupe (fx), 200 x 200: brass ring, glass, short handle */
export const loupe = (p: Pen) => {
  const g = p.g; p.poly([[130, 130], [190, 186], [180, 196], [120, 140]], "#2a2c33", 3);
  g.fillStyle = "rgba(200,230,255,0.55)"; g.beginPath(); g.arc(90, 90, 60, 0, 7); g.fill(); g.strokeStyle = "#c9a24a"; g.lineWidth = 16; g.stroke(); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(90, 90, 69, 0, 7); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.ellipse(70, 66, 14, 8, -0.6, 0, 7); g.fill();
};
export const idCard = (p: Pen) => {
  const g = p.g; g.fillStyle = "#e9eef6"; g.beginPath(); g.roundRect(0, 0, 340, 214, 18); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  g.fillStyle = "#3f6fd8"; g.fillRect(6, 6, 328, 40); lt(g, "DRIVER LICENSE", 170, 27, 22, "#fff", 900, "center");
  g.fillStyle = "#c9ccd2"; g.fillRect(20, 60, 100, 130); g.fillStyle = "#6a4a2a"; g.beginPath(); g.arc(70, 110, 30, 0, 7); g.fill();
  for (let i = 0; i < 4; i++) { g.fillStyle = "#9aa0aa"; g.fillRect(140, 70 + i * 30, 170 - i * 20, 12); }
};
export const slice = (p: Pen, droop = 0) => {
  p.poly([[20, 30 + droop * 10], [180, 20], [100, 190 + droop * 30]], "#f2c84a", 5);
  p.poly([[16, 26 + droop * 10], [184, 16], [180, 40], [20, 50 + droop * 10]], "#c98a4a", 4);
  for (const [x, y] of [[80, 70], [120, 60], [100, 120]]) p.ell(x, y + droop * 12, 14, 12, "#c23a32", 3);
};
export const pizzaTop = (p: Pen) => {
  const g = p.g; g.fillStyle = "#e9e4d6"; g.fillRect(0, 0, 400, 400);
  g.fillStyle = "#c98a4a"; g.beginPath(); g.arc(200, 200, 170, 0, Math.PI * 2 * 0.75); g.lineTo(200, 200); g.closePath(); g.fill();
  g.fillStyle = "#f2c84a"; g.beginPath(); g.arc(200, 200, 150, 0, Math.PI * 2 * 0.75); g.lineTo(200, 200); g.closePath(); g.fill();
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 1.45 + 0.15, r = 60 + (i % 3) * 30; p.ell(200 + r * Math.cos(a), 200 + r * Math.sin(a), 16, 14, "#c23a32", 3); }
  g.strokeStyle = "rgba(120,70,20,0.5)"; g.lineWidth = 3; for (let i = 0; i < 6; i++) { const a = (i / 8) * Math.PI * 2; g.beginPath(); g.moveTo(200, 200); g.lineTo(200 + 170 * Math.cos(a), 200 + 170 * Math.sin(a)); g.stroke(); }
};
export const bannerTex = (p: Pen, s: string, bg: string, fg: string) => { const g = p.g; g.fillStyle = bg; g.fillRect(0, 0, 1000, 200); g.strokeStyle = fg; g.lineWidth = 10; g.strokeRect(14, 14, 972, 172); fitText(g, s, 500, 104, 120, 900, fg, 900); };
export const photoTex = (p: Pen) => { const g = p.g; g.fillStyle = "#fbf8f0"; g.fillRect(0, 0, 200, 160); g.fillStyle = "#8cc0ee"; g.fillRect(14, 14, 172, 132); g.fillStyle = "#4fa548"; g.fillRect(14, 100, 172, 46); g.fillStyle = "#f2c84a"; g.beginPath(); g.arc(150, 44, 16, 0, 7); g.fill(); };
