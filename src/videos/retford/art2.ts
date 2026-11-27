// Chicago reel drawings (canvas): the box's items (real scans in toploaders and a magnetic case, real slab photos) with the shop's
// price stickers, $100 bills, the caller-ID screen, the customer monitor's camera views, the officer's notepad, the shop signs,
// the GRAND OPENING banner, the window calendar and lettering, the clock, the chalkboard, sealed-product boxes and packs, the jacket
// lining and its pockets, the gift paper, the spoon tray. Plain lettering only, no logos. Every card drawn is a REAL scan.
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
export const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const rrect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw = 2) => {
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
};
export const plainSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, Math.min(W, H) * 0.12, bg, border || undefined, 8);
  lt(g, txt, W / 2, sub ? H * 0.42 : H / 2 + 2, H * (sub ? 0.4 : 0.55), fg, 900, "center", W - 30);
  if (sub) lt(g, sub, W / 2, H * 0.78, H * 0.2, fg, 700, "center", W - 30);
};
export const letters = (p: Pen, W: number, H: number, txt: string, col: string, px: number) => { lt(p.g, txt, W / 2, H / 2, px, col, 900, "center", W - 20); };

// ---------------- the box's items (W x H, aspect ~0.6) ----------------
/** the shop's white price sticker: OLD SKOOL in red over the price */
export const sticker = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, price: number) => {
  rrect(g, x, y, w, h, h * 0.18, "#ffffff", "#c9c2b4", Math.max(2, h * 0.04));
  lt(g, "OLD SKOOL TCG", x + w / 2, y + h * 0.27, h * 0.2, "#d8322f", 900, "center", w * 0.9);
  lt(g, money(price), x + w / 2, y + h * 0.66, h * 0.44, "#1d1b22", 900, "center", w * 0.92);
};
/** an item standing in the box: a real slab photo, or a real scan in a toploader / a magnetic one-touch case; gleam 0..1 = a shine */
export const itemArt = (p: Pen, W: number, H: number, name: string, kind: string, price: number, gleam = 0) => {
  const g = p.g;
  if (kind === "slab") {
    const im = TCG_IMG[name]; if (im) g.drawImage(im, 0, 0, W, H); else rrect(g, 0, 0, W, H, W * 0.05, "#e8eef2");
    sticker(g, W * 0.5, H * 0.905, W * 0.44, H * 0.08, price);
  } else if (kind === "case") {   // magnetic one-touch: a thick clear acrylic frame with bevelled edges around the card
    rrect(g, 0, 0, W, H, W * 0.06, "rgba(225,240,250,0.92)", "#9fbfd6", W * 0.012);
    g.fillStyle = "rgba(255,255,255,0.65)"; g.fillRect(W * 0.03, H * 0.02, W * 0.94, H * 0.012);
    const m = W * 0.085; scan(g, name, m, m * 1.05, W - 2 * m, (W - 2 * m) * 1.395);
    sticker(g, W * 0.48, H * 0.885, W * 0.46, H * 0.085, price);
  } else {                         // toploader: thin rigid clear sleeve, open at the top
    rrect(g, 0, 0, W, H, W * 0.035, "rgba(232,244,252,0.9)", "#a9c8dc", W * 0.01);
    const m = W * 0.055; scan(g, name, m, H * 0.05, W - 2 * m, (W - 2 * m) * 1.395);
    g.fillStyle = "rgba(160,200,225,0.8)"; g.fillRect(W * 0.04, H * 0.015, W * 0.92, H * 0.012);
    sticker(g, W * 0.5, H * 0.885, W * 0.44, H * 0.085, price);
  }
  if (gleam > 0 && gleam < 1) {
    g.save(); g.beginPath(); g.roundRect(0, 0, W, H, W * 0.05); g.clip();
    const x = -0.6 * W + 2.2 * W * gleam, gg = g.createLinearGradient(x - 0.25 * W, 0, x + 0.25 * W, 0.4 * H);
    gg.addColorStop(0, "rgba(255,255,255,0)"); gg.addColorStop(0.5, "rgba(255,255,255,0.55)"); gg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gg; g.fillRect(0, 0, W, H); g.restore();
  }
};

// ---------------- money ----------------
/** a US $100 bill, face up (W:H = 2.35) */
export const bill = (p: Pen, W: number, H: number) => {
  const g = p.g;
  rrect(g, 0, 0, W, H, H * 0.04, "#dfe9d4", "#7f9a74", H * 0.03);
  g.strokeStyle = "#9fb592"; g.lineWidth = H * 0.025; g.strokeRect(W * 0.04, H * 0.08, W * 0.92, H * 0.84);
  g.fillStyle = "#c9dcbd"; g.beginPath(); g.ellipse(W * 0.5, H * 0.5, W * 0.13, H * 0.34, 0, 0, 7); g.fill(); g.strokeStyle = "#6f8a66"; g.lineWidth = H * 0.02; g.stroke();
  g.fillStyle = "#7f9a74"; g.beginPath(); g.ellipse(W * 0.5, H * 0.42, W * 0.045, H * 0.12, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(W * 0.5, H * 0.72, W * 0.09, H * 0.13, 0, Math.PI, 0); g.fill();
  g.fillStyle = "#3f78d8"; g.fillRect(W * 0.66, 0, W * 0.025, H);
  lt(g, "100", W * 0.12, H * 0.24, H * 0.24, "#3f5a3a", 900, "center"); lt(g, "100", W * 0.88, H * 0.76, H * 0.3, "#c98a3e", 900, "center");
  lt(g, "THE UNITED STATES OF AMERICA", W * 0.5, H * 0.12, H * 0.08, "#3f5a3a", 700, "center", W * 0.6);
};

// ---------------- the counter phone's caller ID (W:H = 2) ----------------
export const callerId = (p: Pen, W: number, H: number, lit: boolean) => {
  const g = p.g;
  rrect(g, 0, 0, W, H, H * 0.08, "#2a2c33");
  rrect(g, W * 0.05, H * 0.08, W * 0.9, H * 0.84, H * 0.05, lit ? "#c9f0a2" : "#b4d692");
  const ink = "#1f3a1a";
  lt(g, "INCOMING", W * 0.1, H * 0.25, H * 0.15, ink, 800); lt(g, "3:12 PM", W * 0.9, H * 0.25, H * 0.15, ink, 800, "right");
  lt(g, "(773) 555-0142", W * 0.5, H * 0.57, H * 0.27, ink, 900, "center", W * 0.82);
  lt(g, "CALL 01   WED NOV 18", W * 0.5, H * 0.82, H * 0.11, ink, 700, "center", W * 0.82);
};

// ---------------- the customer monitor: four camera views, or one frozen view of his face ----------------
const camView = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string, rec: boolean, draw: () => void) => {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); draw();
  g.fillStyle = "rgba(255,255,255,0.05)"; for (let yy = y; yy < y + h; yy += 6) g.fillRect(x, yy, w, 2); // scan lines
  lt(g, label, x + w * 0.04, y + h * 0.09, h * 0.08, "#ffffff", 800);
  if (rec) { g.fillStyle = "#ff3a2f"; g.beginPath(); g.arc(x + w * 0.8, y + h * 0.09, h * 0.035, 0, 7); g.fill(); lt(g, "REC", x + w * 0.85, y + h * 0.09, h * 0.07, "#ffffff", 800); }
  g.restore();
};
const tiles = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, s: number) => {
  for (let i = 0; i * s < w; i++) for (let j = 0; j * s < h; j++) { g.fillStyle = (i + j) % 2 ? "#e2786a" : "#f2e6cc"; g.fillRect(x + i * s, y + j * s, s, s); }
};
const figure = (g: CanvasRenderingContext2D, o: Outfit, cx: number, sole: number, hgt: number, expr: "smile" | "smirk" | "neutral" = "neutral") => {
  g.save(); const k = hgt / 900; g.translate(cx - 300 * k, sole - 975 * k); g.scale(k, k);
  bodyFront(new Pen(g), o, { mode: "stand", expr: expr === "smirk" ? "grin" : expr, seed: 2 }); g.restore();
};
export const monitorFeed = (p: Pen, W: number, H: number, f: number, rec: boolean, man: Outfit, owner: Outfit, face: boolean, gaps: number) => {
  const g = p.g;
  g.fillStyle = "#14161c"; g.fillRect(0, 0, W, H);
  const clock = `4:0${Math.min(9, 5 + Math.floor((f % 9000) / 1800))}:${String(10 + Math.floor((f / 30) % 50)).padStart(2, "0")} PM`;
  if (face) {   // one frozen view: his face at the counter, big
    camView(g, 0, 0, W, H, "CAM 1  COUNTER  ·  NOV 18 2026  4:07 PM", rec, () => {
      g.fillStyle = "#e9d6b4"; g.fillRect(0, 0, W, H); tiles(g, 0, H * 0.82, W, H * 0.18, H * 0.09);
      g.fillStyle = "#b8743e"; g.fillRect(0, H * 0.78, W, H * 0.06);
      figure(g, man, W * 0.5, H * 2.05, H * 2.25, "smirk");
    });
    g.strokeStyle = "#ffffff"; g.lineWidth = 3; g.strokeRect(W * 0.33, H * 0.12, W * 0.34, H * 0.62); // the operator's freeze box round his face
    lt(g, "PAUSED", W * 0.5, H * 0.92, H * 0.06, "#ffffff", 900, "center");
    return;
  }
  const w2 = W / 2, h2 = H / 2;
  camView(g, 0, 0, w2 - 2, h2 - 2, "CAM 1  COUNTER", rec, () => {   // the counter from the ceiling corner: him at the box, the owner behind
    g.fillStyle = "#efe2c4"; g.fillRect(0, 0, w2, h2); tiles(g, 0, h2 * 0.55, w2, h2 * 0.45, h2 * 0.12);
    figure(g, owner, w2 * 0.66, h2 * 0.58, h2 * 0.5); g.fillStyle = "#b8743e"; g.fillRect(w2 * 0.12, h2 * 0.5, w2 * 0.8, h2 * 0.14);
    g.fillStyle = "#c99a62"; g.fillRect(w2 * 0.22, h2 * 0.44, w2 * 0.2, h2 * 0.07);
    for (let i = 0; i < 5; i++) { g.fillStyle = i < gaps ? "#c99a62" : ["#f2c23a", "#d8322f", "#4fb0e8", "#f4f1ea", "#2f9a55"][i]; g.fillRect(w2 * (0.235 + i * 0.036), h2 * 0.4, w2 * 0.025, h2 * 0.05); }
    figure(g, man, w2 * 0.38, h2 * 0.98, h2 * 0.56);
  });
  camView(g, w2 + 2, 0, w2 - 2, h2 - 2, "CAM 2  DOOR", rec, () => {
    g.fillStyle = "#efe2c4"; g.fillRect(w2, 0, w2, h2); tiles(g, w2, h2 * 0.7, w2, h2 * 0.3, h2 * 0.12);
    g.fillStyle = "#8fd0f2"; g.fillRect(w2 * 1.15, h2 * 0.2, w2 * 0.45, h2 * 0.5); g.fillStyle = "#7a4a2a"; g.fillRect(w2 * 1.62, h2 * 0.18, w2 * 0.25, h2 * 0.55);
    g.fillStyle = "#bfe6f8"; g.fillRect(w2 * 1.65, h2 * 0.22, w2 * 0.19, h2 * 0.36);
  });
  camView(g, 0, h2 + 2, w2 - 2, h2 - 2, "CAM 3  BOX", rec, () => {   // the box from above
    g.fillStyle = "#b8743e"; g.fillRect(0, h2, w2, h2); g.fillStyle = "#c99a62"; g.fillRect(w2 * 0.15, h2 * 1.2, w2 * 0.7, h2 * 0.6);
    const cols = ["#f2c23a", "#d8322f", "#4fb0e8", "#c9a24a", "#2f9a55"];
    for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) { const gone = (r === 0 && i === 0 && gaps >= 1) || (r === 0 && i === 1 && gaps >= 2) || (r === 1 && i === 0 && gaps >= 3) || (r === 1 && i === 1 && gaps >= 4);
      g.fillStyle = gone ? "#8a5a34" : cols[(i + r) % 5]; g.fillRect(w2 * (0.2 + i * 0.125), h2 * (1.3 + r * 0.25), w2 * 0.1, h2 * 0.16); }
  });
  camView(g, w2 + 2, h2 + 2, w2 - 2, h2 - 2, "CAM 4  AISLE", rec, () => {
    g.fillStyle = "#efe2c4"; g.fillRect(w2, h2, w2, h2);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { g.fillStyle = ["#d8322f", "#2f5fb4", "#f2c23a", "#2f9a55", "#e8782f", "#4fb0e8"][(i + r) % 6]; g.fillRect(w2 * (1.08 + i * 0.14), h2 * (1.2 + r * 0.17), w2 * 0.11, h2 * 0.12); }
  });
  lt(g, clock, W * 0.98, H * 0.97, H * 0.035, "#ffffff", 700, "right");
};

// ---------------- the officer's notepad (W:H = 0.75); k 0..1 = how much of the number is written ----------------
export const notepad = (p: Pen, W: number, H: number, k: number) => {
  const g = p.g;
  rrect(g, 0, 0, W, H, W * 0.03, "#fff3a8", "#c9a24a", 3);
  g.fillStyle = "#c0323c"; g.fillRect(0, 0, W, H * 0.07);
  g.strokeStyle = "rgba(63,120,216,0.45)"; g.lineWidth = 2; for (let y = H * 0.18; y < H; y += H * 0.09) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = "rgba(216,50,47,0.6)"; g.beginPath(); g.moveTo(W * 0.12, H * 0.07); g.lineTo(W * 0.12, H); g.stroke();
  lt(g, "OLD SKOOL TCG", W * 0.16, H * 0.225, H * 0.06, "#2f4a8a", 700, "left", W * 0.8);
  lt(g, "4 CARDS  $6,700", W * 0.16, H * 0.315, H * 0.06, "#2f4a8a", 700, "left", W * 0.8);
  if (k > 0) { g.save(); g.beginPath(); g.rect(0, 0, W * (0.14 + 0.84 * k), H); g.clip(); font(g, 800, H * 0.1, '"Comic Sans MS", "Marker Felt", cursive'); g.fillStyle = "#1f3a8a"; g.textBaseline = "middle"; g.fillText("(773) 555-0142", W * 0.15, H * 0.43, W * 0.82); g.restore(); }
};

// ---------------- signs and dressing ----------------
export const signBoard = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, H * 0.08, "#c0323c", "#f2c23a", H * 0.07);
  g.strokeStyle = "#fbf3dc"; g.lineWidth = H * 0.025; g.strokeRect(H * 0.13, H * 0.13, W - H * 0.26, H - H * 0.26);
  lt(g, "OLD SKOOL TCG", W / 2, H * 0.52, H * 0.56, "#fbf3dc", 900, "center", W * 0.86);
};
export const bladeSign = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, W * 0.12, "#f2c23a", "#c0323c", W * 0.07);
  const words = ["OLD", "SKOOL", "TCG"];
  words.forEach((t, i) => lt(g, t, W / 2, H * (0.2 + i * 0.3), W * (t.length > 3 ? 0.27 : 0.42), i === 2 ? "#2f5fb4" : "#c0323c", 900, "center", W * 0.84));
};
export const grandOpening = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#f2c23a"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#d8322f"; g.fillRect(0, 0, W, H * 0.1); g.fillRect(0, H * 0.9, W, H * 0.1);
  lt(g, "GRAND OPENING!", W / 2, H * 0.53, H * 0.56, "#d8322f", 900, "center", W * 0.9);
  g.fillStyle = "#c9ccd2"; for (const x of [H * 0.2, W - H * 0.2]) { g.beginPath(); g.arc(x, H * 0.5, H * 0.08, 0, 7); g.fill(); }
};
/** the window calendar: NOV 2026 with the torn stubs of SEP and OCT at the top */
export const calendar = (p: Pen, W: number, H: number) => {
  const g = p.g;
  g.fillStyle = "#c0323c"; g.fillRect(W * 0.1, 0, W * 0.8, H * 0.06);
  for (let i = 0; i < 2; i++) { g.fillStyle = "#fbf3dc"; g.beginPath(); g.moveTo(W * 0.1, H * 0.06); for (let x = 0; x <= 16; x++) g.lineTo(W * (0.1 + x * 0.05), H * (0.075 + (x % 2) * 0.012 + i * 0.018)); g.lineTo(W * 0.9, H * 0.06); g.fill(); }
  rrect(g, W * 0.1, H * 0.1, W * 0.8, H * 0.88, 6, "#ffffff", "#c9c2b4", 3);
  lt(g, "NOV 2026", W / 2, H * 0.2, H * 0.09, "#c0323c", 900, "center");
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const d = r * 7 + c - 6 + 1; if (d < 1 || d > 30) continue;
    const x = W * (0.16 + c * 0.11), y = H * (0.34 + r * 0.12); if (d === 18) { g.fillStyle = "#f2c23a"; g.beginPath(); g.arc(x + W * 0.035, y, H * 0.045, 0, 7); g.fill(); }
    lt(g, String(d), x + W * 0.035, y, H * 0.055, "#1d1b22", 700, "center"); }
};
export const windowLettering = (p: Pen, W: number, H: number) => {
  const g = p.g; lt(g, "SINGLES · SLABS · SEALED", W / 2, H * 0.3, H * 0.2, "#fbf3dc", 900, "center", W * 0.95);
  lt(g, "WE BUY CARDS", W / 2, H * 0.72, H * 0.18, "#f2c23a", 900, "center", W * 0.7);
};
export const openNeon = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, H * 0.3, "rgba(0,0,0,0)", "#4fb0e8", H * 0.07);
  lt(g, "OPEN", W / 2, H / 2 + 2, H * 0.58, "#ff4a3a", 900, "center");
};
export const clockFace = (p: Pen, S: number) => {
  const g = p.g, c = S / 2; g.fillStyle = "#fbf3dc"; g.beginPath(); g.arc(c, c, c * 0.92, 0, 7); g.fill(); g.strokeStyle = "#c0323c"; g.lineWidth = c * 0.1; g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.fillStyle = "#1d1b22"; g.fillRect(c + Math.sin(a) * c * 0.72 - 3, c - Math.cos(a) * c * 0.72 - 3, 6, 6); }
  g.strokeStyle = "#1d1b22"; g.lineCap = "round"; g.lineWidth = c * 0.08; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.sin((4 / 12) * Math.PI * 2) * c * 0.42, c - Math.cos((4 / 12) * Math.PI * 2) * c * 0.42); g.stroke();
  g.lineWidth = c * 0.05; g.beginPath(); g.moveTo(c, c); g.lineTo(c, c - c * 0.66); g.stroke();
};
export const chalkboard = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 8, "#2f6a4a", "#b8743e", W * 0.04);
  lt(g, "TODAY: WED", W / 2, H * 0.22, H * 0.13, "#fbf3dc", 800, "center", W * 0.85);
  lt(g, "TOURNAMENT 6PM", W / 2, H * 0.45, H * 0.1, "#f2c23a", 800, "center", W * 0.85);
  lt(g, "BUY · SELL · TRADE", W / 2, H * 0.68, H * 0.09, "#fbf3dc", 700, "center", W * 0.85);
  lt(g, "SLABS · SEALED", W / 2, H * 0.85, H * 0.08, "#8fd0f2", 700, "center", W * 0.85);
};
export const cameraSign = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, H * 0.1, "#f2c23a", "#1d1b22", H * 0.05);
  lt(g, "SMILE!", W * 0.62, H * 0.3, H * 0.22, "#1d1b22", 900, "center"); lt(g, "YOU ARE ON CAMERA", W * 0.62, H * 0.66, H * 0.12, "#1d1b22", 800, "center", W * 0.66);
  g.fillStyle = "#1d1b22"; g.fillRect(W * 0.08, H * 0.35, W * 0.17, H * 0.3); g.beginPath(); g.moveTo(W * 0.25, H * 0.5); g.lineTo(W * 0.32, H * 0.36); g.lineTo(W * 0.32, H * 0.64); g.fill();
};
/** a sealed booster box face: bright art with a star burst; plain words, no logo */
const BOXCOL = [["#d8322f", "#f2c23a"], ["#2f5fb4", "#8fd0f2"], ["#2f9a55", "#f2e14a"], ["#e8782f", "#fff3c4"], ["#7a3fd8", "#f2a3e8"], ["#1f8ad8", "#f2c23a"], ["#c0323c", "#4fb0e8"]];
export const productFace = (p: Pen, W: number, H: number, k: number, label = "BOOSTER BOX") => {
  const g = p.g, [a, b] = BOXCOL[k % BOXCOL.length];
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); const cx = W * (0.3 + 0.4 * ((k * 37) % 10) / 10), cy = H * 0.45;
  for (let i = 0; i < 16; i++) { const r = i % 2 ? H * 0.12 : H * 0.3, t = (i / 16) * Math.PI * 2; g.lineTo(cx + Math.cos(t) * r, cy + Math.sin(t) * r); } g.fill();
  g.fillStyle = b; g.beginPath(); g.arc(cx, cy, H * 0.1, 0, 7); g.fill();
  g.fillStyle = "#1d1b22"; g.fillRect(0, H * 0.78, W, H * 0.22); lt(g, label, W / 2, H * 0.89, H * 0.12, "#fbf3dc", 900, "center", W * 0.9);
  g.strokeStyle = "#1d1b22"; g.lineWidth = Math.max(2, W * 0.02); g.strokeRect(1, 1, W - 2, H - 2);
};
/** the back wall shelving face: five shelves of sealed product on warm oak */
export const shelfWall = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#c98a4e"; g.fillRect(0, 0, W, H);
  const rows = 5, rh = H / rows;
  for (let r = 0; r < rows; r++) {
    const y0 = r * rh; let x = 10, k = r * 3;
    while (x < W - 40) {
      const w = 70 + ((k * 53) % 5) * 18, h = rh * (0.55 + ((k * 29) % 4) * 0.08);
      g.save(); g.translate(x, y0 + rh - 14 - h); productFace(new Pen(g), w, h, k, ["BOOSTER BOX", "ELITE BOX", "TIN", "COLLECTION", "BUNDLE"][k % 5]); g.restore();
      x += w + 8; k++;
    }
    g.fillStyle = "#8a5a34"; g.fillRect(0, y0 + rh - 14, W, 14); g.fillStyle = "#e8b878"; g.fillRect(0, y0 + rh - 14, W, 3);
  }
};
/** the pegboard of hanging booster packs */
export const pegboard = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#e8c896"; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(90,60,30,0.35)"; for (let x = 20; x < W; x += 40) for (let y = 20; y < H; y += 40) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const x = 30 + c * (W - 60) / 7, y = 40 + r * (H - 60) / 4, w = (W - 60) / 7 - 16, h = (H - 60) / 4 - 22;
    g.fillStyle = "#8a8a8a"; g.fillRect(x + w / 2 - 2, y - 18, 4, 20);
    g.save(); g.translate(x, y); productFace(new Pen(g), w, h, r * 7 + c + 2, "BOOSTER"); g.restore();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(x, y, w, 8); }
};
export const poster = (p: Pen, W: number, H: number, txt: string, sub: string, bg: string, fg: string) => {
  const g = p.g; rrect(g, 0, 0, W, H, 6, bg, "#fbf3dc", W * 0.04);
  lt(g, txt, W / 2, H * 0.35, H * 0.16, fg, 900, "center", W * 0.86); lt(g, sub, W / 2, H * 0.62, H * 0.09, fg, 800, "center", W * 0.86);
  g.fillStyle = fg; for (let i = 0; i < 5; i++) { const t = (i / 5) * Math.PI * 2 - Math.PI / 2; g.beginPath(); g.arc(W / 2 + Math.cos(t) * W * 0.22, H * 0.84 + Math.sin(t) * H * 0.05, W * 0.03, 0, 7); g.fill(); }
};

// ---------------- the jacket ----------------
/** the open jacket's lining (W:H = 0.68): red satin with diamond stitching, the camel front edge on the left */
export const lining = (p: Pen, W: number, H: number) => {
  const g = p.g, gr = g.createLinearGradient(0, 0, W, 0);
  gr.addColorStop(0, "#a8282e"); gr.addColorStop(0.5, "#d8423e"); gr.addColorStop(1, "#b8302f"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(120,20,25,0.4)"; g.lineWidth = 3;
  for (let i = -H; i < W + H; i += 90) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + H, H); g.stroke(); g.beginPath(); g.moveTo(i, H); g.lineTo(i + H, 0); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.12)"; for (let x = 0; x < W; x += 140) g.fillRect(x + 30, 0, 26, H);
  g.fillStyle = "#c98a3e"; g.fillRect(0, 0, W * 0.09, H); g.fillStyle = "#a86a28"; g.fillRect(W * 0.09, 0, W * 0.012, H);
  g.fillStyle = "#c98a3e"; g.fillRect(W * 0.91, 0, W * 0.09, H); g.fillStyle = "#a86a28"; g.fillRect(W * 0.898, 0, W * 0.012, H);
  g.fillStyle = "#e8c48a"; for (let y = H * 0.1; y < H; y += H * 0.18) { g.beginPath(); g.arc(W * 0.045, y, W * 0.02, 0, 7); g.fill(); }
  g.fillStyle = "#8a1a20"; g.fillRect(W * 0.18, H * 0.02, W * 0.64, H * 0.02); lt(g, "CAMEL & CO.", W * 0.5, H * 0.035, H * 0.014, "#f2c23a", 800, "center");
};
/** a clear vinyl inner pocket (transparent canvas): a faint sheen and the stitched top seam */
export const pocket = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "rgba(235,245,255,0.05)"; g.fillRect(0, H * 0.32, W, H * 0.68);
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = Math.max(3, H * 0.012); g.strokeRect(2, H * 0.32, W - 4, H * 0.68 - 2);
  g.setLineDash([10, 8]); g.strokeStyle = "#f2c23a"; g.beginPath(); g.moveTo(4, H * 0.32 + 8); g.lineTo(W - 4, H * 0.32 + 8); g.stroke(); g.setLineDash([]);
  g.fillStyle = "rgba(255,255,255,0.1)"; g.beginPath(); g.moveTo(W * 0.1, H); g.lineTo(W * 0.25, H); g.lineTo(W * 0.55, H * 0.34); g.lineTo(W * 0.4, H * 0.34); g.fill();
};

// ---------------- the house ----------------
export const giftPaper = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#d8322f"; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,240,200,0.35)"; for (let x = 10; x < W; x += 40) for (let y = 10; y < H; y += 40) { g.beginPath(); g.arc(x + ((y / 40) % 2) * 20, y, 5, 0, 7); g.fill(); }
  g.fillStyle = "#f2c23a"; g.fillRect(W * 0.45, 0, W * 0.1, H); g.fillRect(0, H * 0.43, W, H * 0.14);
};
/** the silver spoon tray seen from above (W:H = 1.6): six spoon slots, `n` spoons in them */
export const spoonTray = (p: Pen, W: number, H: number, n: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, H * 0.15, "#dfe6ee", "#8a96a8", H * 0.05); rrect(g, W * 0.05, H * 0.08, W * 0.9, H * 0.84, H * 0.1, "#eef3f8");
  for (let i = 0; i < 6; i++) {
    const x = W * (0.14 + i * 0.145);
    g.fillStyle = "#c9d2dc"; g.fillRect(x - W * 0.045, H * 0.14, W * 0.09, H * 0.72);
    if (i >= n) continue;
    g.fillStyle = "#f8fbff"; g.strokeStyle = "#7f8ca0"; g.lineWidth = H * 0.02;
    g.beginPath(); g.ellipse(x, H * 0.27, W * 0.032, H * 0.1, 0, 0, 7); g.fill(); g.stroke();
    g.beginPath(); g.roundRect(x - W * 0.01, H * 0.36, W * 0.02, H * 0.46, W * 0.01); g.fill(); g.stroke();
  }
};
