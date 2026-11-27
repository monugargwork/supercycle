// Roush reel drawings (canvas): the Night UPC lid and box sides, the viewer's phone screen (the video, the small print, the Shop
// button; Video unavailable; the screenshot gallery), her reply screen, the wall calendar, the empty cork board, posters, product
// boxes, the resale shop's tags and signs, the dock carton's label, the cinema's marquee/poster/flip sign, the WHERE FROM? placard,
// the FOR SALE listings (and their REMOVED backs), shop signs, the gold coin, phone buzz lines.
// Plain lettering only, no logos. Every card drawn is a REAL scan.
import { Pen, bodyFront, Outfit } from "../../engine/toon";
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
export const rrect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw = 2) => {
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
};
export const plainSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, Math.min(W, H) * 0.12, bg, border || undefined, 8);
  lt(g, txt, W / 2, sub ? H * 0.42 : H / 2 + 2, H * (sub ? 0.4 : 0.55), fg, 900, "center", W - 30);
  if (sub) lt(g, sub, W / 2, H * 0.78, H * 0.2, fg, 700, "center", W - 30);
};
export const letters = (p: Pen, W: number, H: number, txt: string, col: string, px: number) => { lt(p.g, txt, W / 2, H / 2, px, col, 900, "center", W - 20); };
const INK = "#1d1b22";
/** hand lettering (marker): a rounded heavy face with a slight wobble per letter */
const marker = (g: CanvasRenderingContext2D, s: string, cx: number, cy: number, px: number, col: string, seed = 1) => {
  font(g, 900, px, '"Comic Sans MS", "Chalkboard SE", "Marker Felt", Arial, sans-serif'); g.textBaseline = "middle"; g.textAlign = "left";
  const w = g.measureText(s).width; let x = cx - w / 2;
  for (let i = 0; i < s.length; i++) { const ch = s[i], cw = g.measureText(ch).width; g.save(); g.translate(x + cw / 2, cy + 3 * Math.sin(i * 1.7 + seed)); g.rotate(0.05 * Math.sin(i * 2.3 + seed));
    g.fillStyle = col; g.fillText(ch, -cw / 2, 0); g.restore(); x += cw; }
};
const star = (g: CanvasRenderingContext2D, x: number, y: number, r: number, col: string) => {
  g.beginPath(); for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? r * 0.42 : r; g.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } g.closePath(); g.fillStyle = col; g.fill();
};

// ---------------- the Night UPC ----------------
/** the lid's face (W:H = 38:28): a night sky, gold stars, a gold 30, NIGHT, the real Umbreon in a window, the release sticker */
export const lidFace = (p: Pen, W: number, H: number, sticker = true) => {
  const g = p.g, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#2f4fc4"); gr.addColorStop(1, "#5a3fc0");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) star(g, (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * W, (Math.sin(i * 78.233) * 12345.678 % 1 + 1) % 1 * H, 4 + (i % 4) * 3, i % 3 ? "#ffe9a0" : "#ffffff");
  g.strokeStyle = "#f2c23a"; g.lineWidth = W * 0.018; g.strokeRect(W * 0.02, W * 0.02, W - W * 0.04, H - W * 0.04);
  // the window with the real card
  const cw = H * 0.62, ch = cw * 1.395, cx = W * 0.66, cy = H * 0.5;
  rrect(g, cx - cw / 2 - 12, cy - ch / 2 - 12, cw + 24, ch + 24, 18, "#f2c23a");
  scan(g, "umbreon_pe", cx - cw / 2, cy - ch / 2, cw, ch);
  lt(g, "30", W * 0.24, H * 0.32, H * 0.3, "#f2c23a", 900, "center");
  g.lineWidth = 6; g.strokeStyle = INK; font(g, 900, H * 0.3); g.textAlign = "center"; g.strokeText("30", W * 0.24, H * 0.32); g.fillText("30", W * 0.24, H * 0.32);
  lt(g, "CELEBRATION", W * 0.24, H * 0.5, H * 0.06, "#ffffff", 900, "center", W * 0.4);
  rrect(g, W * 0.07, H * 0.58, W * 0.34, H * 0.12, H * 0.06, "#f2c23a");
  lt(g, "NIGHT", W * 0.24, H * 0.64, H * 0.08, "#2f3fa0", 900, "center");
  lt(g, "ULTRA-PREMIUM COLLECTION", W * 0.24, H * 0.77, H * 0.04, "#ffe9a0", 800, "center", W * 0.4);
  if (sticker) {
    const sx = W * 0.06, sy = H * 0.84, sw = W * 0.36, sh = H * 0.13;
    rrect(g, sx, sy, sw, sh, 10, "#ffffff", "#d8322f", 5);
    lt(g, "RELEASE NOV 6", sx + sw / 2, sy + sh * 0.33, sh * 0.3, "#d8322f", 900, "center", sw - 16);
    lt(g, "MSRP $179.99", sx + sw / 2, sy + sh * 0.72, sh * 0.27, INK, 800, "center", sw - 16);
  }
};
/** a side of the base (long side): royal blue with a gold band */
export const boxSide = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#2f4fc4"; g.fillRect(0, 0, W, H); g.fillStyle = "#f2c23a"; g.fillRect(0, H * 0.72, W, H * 0.1);
  for (let i = 0; i < 8; i++) star(g, W * (0.06 + i * 0.125), H * 0.35, H * 0.14, "#ffe9a0");
};
/** the base's back: blue, with a bare white patch where a shipping label would be, and one yellow question-mark sticker */
export const boxBack = (p: Pen, W: number, H: number) => {
  const g = p.g; boxSide(p, W, H);
  rrect(g, W * 0.18, H * 0.12, W * 0.5, H * 0.56, 6, "#fbf7ec", "#d9cbb0", 3);
  g.setLineDash([10, 8]); g.strokeStyle = "#c9b99a"; g.lineWidth = 3; g.strokeRect(W * 0.21, H * 0.18, W * 0.44, H * 0.44); g.setLineDash([]);
  g.fillStyle = "#f2c23a"; g.beginPath(); g.arc(W * 0.8, H * 0.38, H * 0.3, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  lt(g, "?", W * 0.8, H * 0.4, H * 0.48, INK, 900, "center");
};

// ---------------- the viewer's phone ----------------
/** the video in the phone: her room in miniature, her at the counter, the open box (a still of her video) */
const miniVideo = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, her: Outfit, open = true) => {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = "#f6b8cc"; g.fillRect(x, y, w, h); g.fillStyle = "#fbf3dc"; g.fillRect(x, y + h * 0.62, w, h * 0.38);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { g.fillStyle = ["#d8322f", "#3f78d8", "#f2c23a", "#2f9a55", "#f2785a"][(i + j) % 5]; g.fillRect(x + w * 0.04 + i * w * 0.05, y + h * (0.08 + j * 0.15), w * 0.04, h * 0.11); }
  g.fillStyle = "#ffffff"; g.fillRect(x + w * 0.7, y + h * 0.1, w * 0.22, h * 0.26); g.fillStyle = "#8fc8f2"; g.fillRect(x + w * 0.72, y + h * 0.12, w * 0.18, h * 0.22);
  // her (the real character art, scaled into the frame)
  const s = (h * 0.92) / 1000; g.save(); g.translate(x + w / 2 - 300 * s, y + h * 0.07); g.scale(s, s); bodyFront(new Pen(g), her, { mode: "stand", expr: "grin", seed: 4 }); g.restore();
  // the counter and the box
  rrect(g, x + w * 0.2, y + h * 0.66, w * 0.6, h * 0.34, 4, "#ffffff"); g.fillStyle = "#f28ab0"; g.fillRect(x + w * 0.2, y + h * 0.72, w * 0.6, h * 0.28);
  rrect(g, x + w * 0.33, y + h * 0.58, w * 0.3, h * 0.09, 3, "#2f4fc4", INK, 2);
  if (open) { const cw = w * 0.11; g.save(); g.translate(x + w * 0.72, y + h * 0.46); g.rotate(0.12); scan(g, "umbreon_pe", -cw / 2, -cw * 0.7, cw, cw * 1.4); g.restore(); }
  g.restore();
};
/** the screen: the video, its title, the small print and the red Shop button; or Video unavailable; or the screenshot gallery */
export const phoneScreen = (p: Pen, W: number, H: number, sc: { mode: string; pulse: number; press: number; scroll: number; shutter: number }, L: { video: number[]; title: number; commission: number; button: number[] }, her: Outfit) => {
  const g = p.g;
  rrect(g, 0, 0, W, H, W * 0.12, INK); rrect(g, W * 0.035, W * 0.035, W * 0.93, H - W * 0.07, W * 0.09, "#ffffff");
  g.save(); g.beginPath(); g.roundRect(W * 0.035, W * 0.035, W * 0.93, H - W * 0.07, W * 0.09); g.clip();
  // status bar
  lt(g, "9:41", W * 0.12, H * 0.022, H * 0.016, INK, 800);
  const [vx0, vy0, vx1, vy1] = L.video, vx = vx0 * W, vy = vy0 * H, vw = (vx1 - vx0) * W, vh = (vy1 - vy0) * H;
  if (sc.mode === "gallery") {
    lt(g, "Screenshots", W * 0.08, H * 0.05, H * 0.026, INK, 900);
    const cols = 3, gw = (W * 0.86) / cols, gh = gw * 1.8, oy = H * 0.08 - sc.scroll * gh * 0.6;
    for (let r = 0; r < 4; r++) for (let c = 0; c < cols; c++) {
      const x = W * 0.07 + c * gw, y = oy + r * (gh + 8); if (y > H) continue;
      rrect(g, x + 3, y, gw - 6, gh, 8, "#f4f1ea", "#d9d3c6", 2);
      miniVideo(g, x + 8, y + 6, gw - 16, gh * 0.55, her);
      rrect(g, x + gw * 0.12, y + gh * 0.74, gw * 0.76, gh * 0.12, gh * 0.05, "#e8322f");
      lt(g, "Shop · $2,262", x + gw / 2, y + gh * 0.8, gh * 0.055, "#ffffff", 900, "center", gw * 0.7);
    }
    if (sc.shutter > 0) { g.fillStyle = `rgba(255,255,255,${0.85 * sc.shutter})`; g.fillRect(0, 0, W, H); }
    g.restore(); return;
  }
  if (sc.mode === "gone") {
    rrect(g, vx, vy, vw, vh, 18, "#8a8f9c");
    g.strokeStyle = "#ffffff"; g.lineWidth = 10; g.beginPath(); g.arc(vx + vw / 2, vy + vh * 0.42, vh * 0.13, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(vx + vw / 2 - vh * 0.09, vy + vh * 0.33); g.lineTo(vx + vw / 2 + vh * 0.09, vy + vh * 0.51); g.stroke();
    lt(g, "Video unavailable", vx + vw / 2, vy + vh * 0.68, vh * 0.065, "#ffffff", 900, "center", vw * 0.9);
    lt(g, "This video has been removed", vx + vw / 2, vy + vh * 0.78, vh * 0.042, "#eef0f4", 600, "center", vw * 0.9);
    g.restore(); return;
  }
  miniVideo(g, vx, vy, vw, vh, her);
  g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(vx, vy + vh - 10, vw, 10); g.fillStyle = "#e8322f"; g.fillRect(vx, vy + vh - 10, vw * 0.36, 10);
  lt(g, "OPENING THE 30th NIGHT BOX EARLY!", W * 0.07, L.title * H, H * 0.022, INK, 900, "left", W * 0.86);
  lt(g, "Earns commission", W * 0.07, L.commission * H, H * 0.017, "#7a7f8a", 600, "left");
  const [bx0, by0, bx1, by1] = L.button, s = 1 + 0.08 * sc.pulse, bcx = ((bx0 + bx1) / 2) * W, bcy = ((by0 + by1) / 2) * H, bw = (bx1 - bx0) * W * s, bh = (by1 - by0) * H * s;
  if (sc.pulse > 0) { g.strokeStyle = `rgba(232,50,47,${0.6 * sc.pulse})`; g.lineWidth = 10; g.beginPath(); g.roundRect(bcx - bw / 2 - 18, bcy - bh / 2 - 18, bw + 36, bh + 36, bh / 2 + 18); g.stroke(); }
  rrect(g, bcx - bw / 2, bcy - bh / 2, bw, bh, bh / 2, sc.press ? "#a81f1c" : "#e8322f");
  // a little bag icon + the label
  g.fillStyle = "#ffffff"; g.fillRect(bcx - bw * 0.36, bcy - bh * 0.18, bh * 0.36, bh * 0.36); g.strokeStyle = "#ffffff"; g.lineWidth = 5; g.beginPath(); g.arc(bcx - bw * 0.36 + bh * 0.18, bcy - bh * 0.18, bh * 0.12, Math.PI, 0); g.stroke();
  lt(g, "Shop · $2,262", bcx + bh * 0.2, bcy + 2, bh * 0.42, "#ffffff", 900, "center", bw * 0.7);
  // the comments under it
  for (let i = 0; i < 3; i++) { const y = H * (0.86 + i * 0.045); g.fillStyle = ["#f2a33a", "#4fb0e8", "#2f9a55"][i]; g.beginPath(); g.arc(W * 0.11, y, H * 0.014, 0, 7); g.fill(); rrect(g, W * 0.16, y - H * 0.008, W * (0.6 - i * 0.1), H * 0.016, 6, "#e6e8ee"); }
  g.restore();
};
/** her own phone: the reply being typed and sent (k 0..1 of the text typed, sent: the bubble jumped up into the thread) */
export const replyScreen = (p: Pen, W: number, H: number, k: number, sent: number) => {
  const g = p.g, txt = "I chose to spend my own money on this.";
  rrect(g, 0, 0, W, H, W * 0.12, INK); rrect(g, W * 0.035, W * 0.035, W * 0.93, H - W * 0.07, W * 0.09, "#ffffff");
  lt(g, "Replies", W * 0.1, H * 0.06, H * 0.03, INK, 900);
  for (let i = 0; i < 4; i++) { const y = H * (0.14 + i * 0.1); g.fillStyle = ["#f2a33a", "#4fb0e8", "#2f9a55", "#e85a9a"][i]; g.beginPath(); g.arc(W * 0.13, y, H * 0.022, 0, 7); g.fill(); rrect(g, W * 0.2, y - H * 0.02, W * (0.66 - (i % 2) * 0.16), H * 0.04, 12, "#eef0f4"); }
  const n = Math.round(txt.length * Math.min(1, k)), shown = txt.slice(0, n);
  const wrap = (s: string, x: number, y: number, px: number, col: string, maxW: number) => { font(g, 800, px); const words = s.split(" "); let line = "", yy = y; for (const w of words) { const t = line ? line + " " + w : w; if (g.measureText(t).width > maxW) { lt(g, line, x, yy, px, col, 800); line = w; yy += px * 1.25; } else line = t; } if (line) lt(g, line, x, yy, px, col, 800); };
  if (sent > 0) {
    const y = H * (0.58 - 0.08 * Math.min(1, sent)); g.fillStyle = "#f28ab0"; g.beginPath(); g.arc(W * 0.13, y + H * 0.02, H * 0.022, 0, 7); g.fill();
    rrect(g, W * 0.2, y - H * 0.01, W * 0.72, H * 0.1, 18, "#ffe1ec", "#f28ab0", 3); wrap(txt, W * 0.24, y + H * 0.025, H * 0.028, INK, W * 0.64);
  }
  // the reply box and keyboard
  rrect(g, W * 0.07, H * 0.62, W * 0.86, H * 0.1, 20, "#f4f5f8", "#c9ccd6", 3);
  if (sent <= 0) { wrap(shown, W * 0.1, H * 0.65, H * 0.028, INK, W * 0.66); if (Math.floor(k * 12) % 2 === 0 && k < 1) { g.fillStyle = "#3f78d8"; g.fillRect(W * 0.1, H * 0.635, 4, H * 0.03); } }
  g.fillStyle = k >= 1 ? "#3f78d8" : "#c9ccd6"; g.beginPath(); g.arc(W * 0.86, H * 0.67, H * 0.028, 0, 7); g.fill(); lt(g, "➤", W * 0.86, H * 0.672, H * 0.03, "#ffffff", 900, "center");
  rrect(g, W * 0.05, H * 0.75, W * 0.9, H * 0.2, 16, "#e2e5ec");
  for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) rrect(g, W * (0.08 + c * 0.095), H * (0.77 + r * 0.058), W * 0.08, H * 0.045, 8, "#ffffff");
};

// ---------------- the room ----------------
export const calendar = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 8, "#ffffff", "#c9b99a", 4);
  g.fillStyle = "#4fb0e8"; g.fillRect(0, 0, W, H * 0.42); for (let i = 0; i < 5; i++) { g.fillStyle = "#ffffff"; g.beginPath(); g.arc(W * (0.15 + i * 0.12), H * 0.3, H * 0.04, 0, 7); g.fill(); }
  g.fillStyle = "#f2c23a"; g.beginPath(); g.arc(W * 0.78, H * 0.14, H * 0.07, 0, 7); g.fill();
  rrect(g, 0, H * 0.42, W, H * 0.1, 0, "#d8322f"); lt(g, "SEPTEMBER 2026", W / 2, H * 0.47, H * 0.06, "#ffffff", 900, "center", W * 0.9);
  const cw = W / 7, chh = (H * 0.46) / 5;
  for (let d = 1; d <= 30; d++) { const i = (d + 1) % 7, j = Math.floor((d + 1) / 7); g.strokeStyle = "#e2d6c0"; g.lineWidth = 2; g.strokeRect(i * cw, H * 0.53 + j * chh, cw, chh); lt(g, String(d), i * cw + 8, H * 0.53 + j * chh + chh * 0.3, chh * 0.32, "#5a4a3a", 700); }
  g.strokeStyle = "#d8322f"; g.lineWidth = 5; g.beginPath(); g.ellipse(((8 + 1) % 7) * cw + cw / 2, H * 0.53 + 1 * chh + chh / 2, cw * 0.48, chh * 0.46, 0, 0, 7); g.stroke();
};
export const corkEmpty = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 6, "#b07a48"); rrect(g, W * 0.04, W * 0.04, W * 0.92, H - W * 0.08, 4, "#e3c79a");
  for (let i = 0; i < 900; i++) { g.fillStyle = i % 2 ? "rgba(140,100,60,0.18)" : "rgba(255,240,210,0.2)"; g.fillRect(((i * 97) % 1000) / 1000 * W, ((i * 389) % 1000) / 1000 * H, 3, 3); }
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(W / 2, H / 2, W * 0.028, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); g.fillStyle = "#ffb0a8"; g.beginPath(); g.arc(W / 2 - W * 0.008, H / 2 - W * 0.008, W * 0.009, 0, 7); g.fill();
};
export const poster = (p: Pen, W: number, H: number, k: number) => {
  const g = p.g, bg = ["#f2c23a", "#4fb0e8", "#f2785a"][k % 3]; rrect(g, 0, 0, W, H, 4, "#ffffff"); g.fillStyle = bg; g.fillRect(W * 0.06, W * 0.06, W * 0.88, H - W * 0.12);
  if (k % 3 === 0) { for (let i = 0; i < 6; i++) star(g, W * (0.2 + (i % 3) * 0.3), H * (0.3 + Math.floor(i / 3) * 0.3), W * 0.1, "#ffffff"); lt(g, "TRAINER", W / 2, H * 0.85, H * 0.08, "#d8322f", 900, "center", W * 0.8); }
  else if (k % 3 === 1) { g.fillStyle = "#ffffff"; g.beginPath(); g.arc(W / 2, H * 0.45, W * 0.3, 0, 7); g.fill(); g.fillStyle = "#d8322f"; g.beginPath(); g.arc(W / 2, H * 0.45, W * 0.3, Math.PI, 0); g.fill(); g.fillStyle = INK; g.fillRect(W * 0.2, H * 0.44, W * 0.6, H * 0.02); g.beginPath(); g.arc(W / 2, H * 0.45, W * 0.08, 0, 7); g.fill(); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(W / 2, H * 0.45, W * 0.05, 0, 7); g.fill(); lt(g, "GOTTA OPEN", W / 2, H * 0.85, H * 0.07, INK, 900, "center", W * 0.8); }
  else { lt(g, "LIVE", W / 2, H * 0.4, H * 0.22, "#ffffff", 900, "center", W * 0.8); lt(g, "EVERY FRIDAY", W / 2, H * 0.7, H * 0.07, "#ffffff", 900, "center", W * 0.8); }
};
/** a sealed product box face for the shelves (k picks the colourway) */
export const productBox = (p: Pen, W: number, H: number, k: number) => {
  const g = p.g, cols = [["#d8322f", "#f2c23a"], ["#3f78d8", "#ffffff"], ["#f2c23a", "#d8322f"], ["#2f9a55", "#f2c23a"], ["#f2785a", "#ffffff"], ["#8a4fc4", "#f2c23a"], ["#4fb0e8", "#f2c23a"]][k % 7];
  g.fillStyle = cols[0]; g.fillRect(0, 0, W, H); g.fillStyle = cols[1]; g.fillRect(0, H * 0.78, W, H * 0.1);
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(W / 2, H * 0.42, W * 0.3, H * 0.24, 0, 0, 7); g.fill();
  star(g, W / 2, H * 0.42, W * 0.18, cols[0]); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
};
export const ringGlow = (p: Pen, W: number) => { const g = p.g; g.strokeStyle = "#fffbe8"; g.lineWidth = W * 0.12; g.beginPath(); g.arc(W / 2, W / 2, W * 0.38, 0, 7); g.stroke(); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(W / 2, W / 2, W * 0.45, 0, 7); g.stroke(); g.beginPath(); g.arc(W / 2, W / 2, W * 0.31, 0, 7); g.stroke(); };

// ---------------- the resale shop ----------------
export const priceTag = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string) => { const g = p.g; rrect(g, 4, 4, W - 8, H - 8, H * 0.2, bg, INK, 5); lt(g, txt, W / 2, H / 2 + 2, H * 0.52, fg, 900, "center", W - 20); };
export const jarTag = (p: Pen, W: number, H: number) => { const g = p.g; rrect(g, 3, 3, W - 6, H - 6, 10, "#f2c23a", INK, 4); lt(g, "COMMISSION", W / 2, H / 2 + 2, H * 0.42, INK, 900, "center", W - 16); };
export const goldSign = (p: Pen, W: number, H: number, txt: string) => { const g = p.g; lt(g, txt, W / 2, H / 2, H * 0.7, "#d9a520", 900, "center", W - 20); g.strokeStyle = "#8a6a10"; g.lineWidth = 3; font(g, 900, H * 0.7); g.strokeText(txt, W / 2, H / 2); };
export const sneakerBox = (p: Pen, W: number, H: number, k: number) => { const g = p.g; g.fillStyle = ["#f2785a", "#4fb0e8", "#f4f1ea", "#2f9a55", "#f2c23a"][k % 5]; g.fillRect(0, 0, W, H); g.fillStyle = INK; g.fillRect(0, H * 0.75, W, H * 0.06); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4); };
export const coin = (p: Pen, S: number) => { const g = p.g; g.fillStyle = "#f2c23a"; g.beginPath(); g.arc(S / 2, S / 2, S * 0.44, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = S * 0.06; g.stroke(); lt(g, "$", S / 2, S / 2 + 2, S * 0.5, "#a8781a", 900, "center"); };

// ---------------- the dock ----------------
export const label = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 6, "#ffffff", INK, 4);
  lt(g, "FROM:", W * 0.06, H * 0.13, H * 0.07, "#7a7f8a", 900); lt(g, "OFFICIAL DISTRIBUTOR", W * 0.06, H * 0.25, H * 0.1, INK, 900, "left", W * 0.88);
  g.fillStyle = INK; g.fillRect(W * 0.05, H * 0.34, W * 0.9, 3);
  lt(g, "TO:", W * 0.06, H * 0.43, H * 0.07, "#7a7f8a", 900); lt(g, "CREATOR", W * 0.06, H * 0.55, H * 0.1, INK, 900);
  rrect(g, W * 0.05, H * 0.66, W * 0.62, H * 0.12, 6, "#2f9a55"); lt(g, "EARLY SAMPLE · NOT FOR SALE", W * 0.36, H * 0.72, H * 0.055, "#ffffff", 900, "center", W * 0.58);
  for (let i = 0; i < 36; i++) { g.fillStyle = INK; g.fillRect(W * 0.06 + i * W * 0.022, H * 0.82, (i % 3 ? 2 : 5), H * 0.12); }
  g.strokeStyle = "#2f9a55"; g.lineWidth = 8; g.beginPath(); g.moveTo(W * 0.74, H * 0.73); g.lineTo(W * 0.8, H * 0.8); g.lineTo(W * 0.92, H * 0.64); g.stroke();
};
export const cartonFace = (p: Pen, W: number, H: number) => { const g = p.g; g.fillStyle = "#c99a62"; g.fillRect(0, 0, W, H); g.fillStyle = "#e9d7a8"; g.fillRect(0, H * 0.44, W, H * 0.12); g.strokeStyle = "rgba(90,60,30,0.6)"; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4); };

// ---------------- the street ----------------
export const marquee = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 10, "#d8322f", INK, 6); rrect(g, W * 0.04, H * 0.18, W * 0.92, H * 0.64, 6, "#fbf3dc");
  lt(g, "COMING SOON", W / 2, H / 2 + 2, H * 0.4, INK, 900, "center", W * 0.86);
  for (let i = 0; i < 24; i++) { g.fillStyle = "#ffe9a0"; g.beginPath(); g.arc(W * (0.03 + i * 0.0408), H * 0.08, H * 0.04, 0, 7); g.fill(); g.beginPath(); g.arc(W * (0.03 + i * 0.0408), H * 0.92, H * 0.04, 0, 7); g.fill(); }
};
export const filmPoster = (p: Pen, W: number, H: number) => {
  const g = p.g, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#3f5fd8"); gr.addColorStop(1, "#f2a0c0"); rrect(g, 0, 0, W, H, 4, "#f2c23a"); g.fillStyle = gr; g.fillRect(W * 0.05, W * 0.05, W * 0.9, H - W * 0.1);
  for (let i = 0; i < 14; i++) star(g, W * (0.12 + ((i * 37) % 76) / 100), H * (0.08 + ((i * 53) % 30) / 100), 6 + (i % 3) * 3, "#ffffff");
  g.fillStyle = "#2f8a6a"; g.beginPath(); g.moveTo(W * 0.05, H * 0.75); g.lineTo(W * 0.4, H * 0.45); g.lineTo(W * 0.6, H * 0.6); g.lineTo(W * 0.78, H * 0.4); g.lineTo(W * 0.95, H * 0.7); g.lineTo(W * 0.95, H * 0.95); g.lineTo(W * 0.05, H * 0.95); g.fill();
  g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(W * 0.32, H * 0.52); g.lineTo(W * 0.4, H * 0.45); g.lineTo(W * 0.48, H * 0.52); g.fill();
  lt(g, "THE LONG", W / 2, H * 0.68, H * 0.06, "#ffffff", 900, "center", W * 0.8); lt(g, "NIGHT", W / 2, H * 0.76, H * 0.1, "#ffffff", 900, "center", W * 0.8);
  rrect(g, W * 0.15, H * 0.84, W * 0.7, H * 0.07, 6, "#d8322f"); lt(g, "COMING SOON", W / 2, H * 0.875, H * 0.04, "#ffffff", 900, "center", W * 0.66);
};
export const filmTin = (p: Pen, S: number) => { const g = p.g; g.fillStyle = "#c9ccd6"; g.beginPath(); g.arc(S / 2, S / 2, S * 0.45, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = S * 0.04; g.stroke(); g.fillStyle = "#9aa0ae"; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.beginPath(); g.arc(S / 2 + Math.cos(a) * S * 0.24, S / 2 + Math.sin(a) * S * 0.24, S * 0.08, 0, 7); g.fill(); } rrect(g, S * 0.2, S * 0.43, S * 0.6, S * 0.14, 6, "#ffffff", INK, 3); lt(g, "THE LONG NIGHT", S / 2, S / 2 + 1, S * 0.06, INK, 900, "center", S * 0.56); };
/** the tout's flip sign: front TICKETS with a chain-link icon; back x12 PRICE */
export const toutSign = (p: Pen, W: number, H: number, back: boolean) => {
  const g = p.g;
  if (!back) { rrect(g, 4, 4, W - 8, H - 8, 16, "#f2c23a", INK, 6); lt(g, "TICKETS", W * 0.6, H * 0.5, H * 0.3, INK, 900, "center", W * 0.66);
    g.strokeStyle = INK; g.lineWidth = H * 0.06; for (const dx of [0, 0.12]) { g.beginPath(); g.roundRect(W * (0.07 + dx), H * 0.38, W * 0.14, H * 0.24, H * 0.12); g.stroke(); } }
  else { rrect(g, 4, 4, W - 8, H - 8, 16, "#d8322f", INK, 6); lt(g, "x12", W / 2, H * 0.42, H * 0.46, "#ffffff", 900, "center"); lt(g, "PRICE", W / 2, H * 0.8, H * 0.18, "#ffffff", 900, "center"); }
};
export const closedSign = (p: Pen, W: number, H: number) => { rrect(p.g, 3, 3, W - 6, H - 6, 8, "#ffffff", INK, 4); lt(p.g, "CLOSED", W / 2, H / 2 + 2, H * 0.5, "#d8322f", 900, "center", W - 14); };
export const placard = (p: Pen, W: number, H: number) => { const g = p.g; g.fillStyle = "#e9d7a8"; g.fillRect(0, 0, W, H); g.strokeStyle = "#a8783e"; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6); marker(g, "WHERE", W / 2, H * 0.33, H * 0.3, "#d8322f", 2); marker(g, "FROM?", W / 2, H * 0.7, H * 0.3, "#d8322f", 5); };
export const boardHeader = (p: Pen, W: number, H: number) => { plainSign(p, W, H, "FOR SALE", "#3f78d8", "#ffffff", "", "#ffffff"); };
/** a printed listing (front) or its REMOVED back */
export const listing = (p: Pen, W: number, H: number, k: number, back: boolean) => {
  const g = p.g;
  if (back) { rrect(g, 2, 2, W - 4, H - 4, 6, "#d8322f", INK, 3); lt(g, "REMOVED", W / 2, H * 0.42, H * 0.16, "#ffffff", 900, "center", W * 0.9); lt(g, "stolen goods", W / 2, H * 0.62, H * 0.08, "#ffe1dc", 700, "center", W * 0.9); lt(g, "not allowed", W / 2, H * 0.73, H * 0.08, "#ffe1dc", 700, "center", W * 0.9); return; }
  rrect(g, 2, 2, W - 4, H - 4, 6, "#ffffff", "#c9ccd6", 3);
  const bw = W * 0.8, bh = bw * 0.72; rrect(g, W * 0.1, H * 0.06, bw, bh, 4, k % 2 ? "#2f4fc4" : "#f2a33a");
  lt(g, "30", W / 2, H * 0.06 + bh / 2, bh * 0.55, "#f2c23a", 900, "center");
  lt(g, "30th CELEBRATION", W / 2, H * 0.56, H * 0.06, INK, 900, "center", W * 0.9); lt(g, ["UPC NIGHT", "UPC DAY", "BOOSTER BOX", "ETB"][k % 4], W / 2, H * 0.65, H * 0.055, "#5a5f6a", 800, "center", W * 0.9);
  lt(g, ["$2,262", "$1,950", "$890", "$640", "$2,100", "$1,480", "$760", "$2,400"][k % 8], W / 2, H * 0.8, H * 0.11, "#2f9a55", 900, "center", W * 0.9);
};
export const shopSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg = "#ffffff") => plainSign(p, W, H, txt, bg, fg, "", fg);
export const timetable = (p: Pen, W: number, H: number) => { const g = p.g; rrect(g, 0, 0, W, H, 6, "#ffffff", INK, 4); rrect(g, 0, 0, W, H * 0.18, 6, "#2f9a55"); lt(g, "BUS 12", W / 2, H * 0.09, H * 0.1, "#ffffff", 900, "center"); for (let i = 0; i < 7; i++) { g.fillStyle = "#c9ccd6"; g.fillRect(W * 0.1, H * (0.28 + i * 0.1), W * 0.8, H * 0.03); } };
export const beachAd = (p: Pen, W: number, H: number) => { const g = p.g, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#4fb0e8"); gr.addColorStop(0.55, "#bfe6f8"); gr.addColorStop(0.56, "#2f8ac4"); gr.addColorStop(0.75, "#f2d9a0"); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = "#f2c23a"; g.beginPath(); g.arc(W * 0.75, H * 0.2, W * 0.1, 0, 7); g.fill(); lt(g, "SUMMER SALE", W / 2, H * 0.88, H * 0.07, "#d8322f", 900, "center", W * 0.9); };
/** phone buzz: three short shake lines on each side (W:H = 2) */
export const buzz = (p: Pen, W: number, H: number, ph: number) => {
  const g = p.g; g.lineCap = "round";
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const x = W / 2 + s * W * (0.3 + 0.06 * ph), y = H * (0.3 + i * 0.2);
    g.strokeStyle = INK; g.lineWidth = H * 0.09; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * W * 0.14, y - H * 0.06); g.stroke(); g.strokeStyle = "#ffffff"; g.lineWidth = H * 0.05; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * W * 0.14, y - H * 0.06); g.stroke(); }
};
/** blue sky with puffy white inked clouds, for windows */
export const skyPanel = (p: Pen, W: number, H: number) => {
  const g = p.g, gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#3f86e0"); gr.addColorStop(1, "#bfe0fb"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const puff = (cx: number, cy: number, s: number) => { const bl = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.25, 0.75], [-0.4, -0.35, 0.75], [0.45, -0.3, 0.65]];
    g.fillStyle = "#3a4a6a"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s + 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#ffffff"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); g.fill(); } };
  puff(W * 0.25, H * 0.3, W * 0.09); puff(W * 0.7, H * 0.22, W * 0.07); puff(W * 0.55, H * 0.62, W * 0.06);
};
/** a phone seen from behind (coral case, camera bump) (W:H = 0.5) */
export const phoneBack = (p: Pen, W: number, H: number, col = "#f2785a") => {
  const g = p.g; rrect(g, 3, 3, W - 6, H - 6, W * 0.16, col, INK, 5);
  rrect(g, W * 0.12, W * 0.12, W * 0.38, W * 0.5, W * 0.1, INK); g.fillStyle = "#4f78c8"; g.beginPath(); g.arc(W * 0.31, W * 0.26, W * 0.08, 0, 7); g.fill(); g.beginPath(); g.arc(W * 0.31, W * 0.48, W * 0.08, 0, 7); g.fill();
};
/** a real card held up (the scan, sharp: drawn at about twice its on-screen size) */
export const heldCard = (p: Pen, W: number, H: number, name: string) => { rrect(p.g, 0, 0, W, H, W * 0.05, "#f4f1ea"); scan(p.g, name, W * 0.02, H * 0.015, W * 0.96, H * 0.97); };
