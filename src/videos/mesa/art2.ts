// Mira Mesa reel drawings (canvas): the Bubble Mew in its magnetic case (and the replica), the price tag, the FIRST SHOW! tent sign,
// her LOOK WITH YOUR EYES sign, the gym's court lines, maple and block-wall textures, scoreboard and banners, the notice board and the
// police flyer (a generic black sedan), the vendor rules board, the fundraiser meter, the phone's camera view, speed lines.
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
export const rrect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw = 2) => {
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
};
export const plainSign = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "", border = "") => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, Math.min(W, H) * 0.12, bg, border || undefined, 8);
  lt(g, txt, W / 2, sub ? H * 0.42 : H / 2 + 2, H * (sub ? 0.4 : 0.55), fg, 900, "center", W - 30);
  if (sub) lt(g, sub, W / 2, H * 0.78, H * 0.2, fg, 700, "center", W - 30);
};
export const letters = (p: Pen, W: number, H: number, txt: string, col: string, px: number) => { lt(p.g, txt, W / 2, H / 2, px, col, 900, "center", W - 20); };
/** hand lettering (marker): a rounded heavy face with a slight wobble per letter */
const marker = (g: CanvasRenderingContext2D, s: string, cx: number, cy: number, px: number, col: string, seed = 1) => {
  font(g, 900, px, '"Comic Sans MS", "Chalkboard SE", "Marker Felt", Arial, sans-serif'); g.textBaseline = "middle"; g.textAlign = "left";
  const w = g.measureText(s).width; let x = cx - w / 2;
  for (let i = 0; i < s.length; i++) { const ch = s[i], cw = g.measureText(ch).width; g.save(); g.translate(x + cw / 2, cy + 3 * Math.sin(i * 1.7 + seed)); g.rotate(0.05 * Math.sin(i * 2.3 + seed));
    g.fillStyle = col; g.fillText(ch, -cw / 2, 0); g.restore(); x += cw; }
};

// ---------------- the Bubble Mew in its magnetic one-touch case (W:H = 0.72) ----------------
export const caseArt = (p: Pen, W: number, H: number, name: string, replica = false, gleam = 0) => {
  const g = p.g;
  rrect(g, 0, 0, W, H, W * 0.06, "rgba(225,240,250,0.95)", "#9fbfd6", W * 0.014);
  g.fillStyle = "rgba(255,255,255,0.7)"; g.fillRect(W * 0.04, H * 0.022, W * 0.92, H * 0.012);
  const m = W * 0.075, cw = W - 2 * m; scan(g, name, m, (H - cw * 1.395) / 2, cw, cw * 1.395);
  if (replica) { rrect(g, W * 0.2, H * 0.86, W * 0.6, H * 0.075, H * 0.015, "#ffffff", "#2f5fb4", W * 0.01); lt(g, "REPLICA", W / 2, H * 0.898, H * 0.05, "#2f5fb4", 900, "center", W * 0.56); }
  if (gleam > 0 && gleam < 1) {
    g.save(); g.beginPath(); g.roundRect(0, 0, W, H, W * 0.06); g.clip();
    const x = -0.6 * W + 2.2 * W * gleam, gg = g.createLinearGradient(x - 0.25 * W, 0, x + 0.25 * W, 0.4 * H);
    gg.addColorStop(0, "rgba(255,255,255,0)"); gg.addColorStop(0.5, "rgba(255,255,255,0.5)"); gg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gg; g.fillRect(0, 0, W, H); g.restore();
  }
};
/** a top-loader with a real card (W:H = 0.7) */
export const toploader = (p: Pen, W: number, H: number, name: string) => {
  const g = p.g; rrect(g, 0, 0, W, H, W * 0.035, "rgba(232,244,252,0.95)", "#a9c8dc", W * 0.012);
  const m = W * 0.06; scan(g, name, m, H * 0.06, W - 2 * m, (W - 2 * m) * 1.395);
  g.fillStyle = "rgba(160,200,225,0.85)"; g.fillRect(W * 0.04, H * 0.015, W * 0.92, H * 0.014);
};
/** the white price tag on a string (W:H = 1.6) */
export const priceTag = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#ffffff"; g.strokeStyle = "#c9a24a"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(H * 0.35, 4); g.lineTo(W - 4, 4); g.lineTo(W - 4, H - 4); g.lineTo(H * 0.35, H - 4); g.lineTo(4, H / 2); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#c9a24a"; g.beginPath(); g.arc(H * 0.32, H / 2, H * 0.08, 0, 7); g.fill();
  lt(g, "$3,200", W * 0.62, H * 0.53, H * 0.5, "#d8322f", 900, "center", W * 0.6);
};
/** the cardboard tent sign (W:H = 1.7) */
export const firstShow = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#d9a86a"; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(120,80,40,0.2)"; for (let i = 0; i < 14; i++) g.fillRect(0, i * H / 14, W, 2);
  marker(g, "FIRST", W / 2, H * 0.32, H * 0.3, "#d8322f", 1); marker(g, "SHOW!", W / 2, H * 0.68, H * 0.3, "#2f5fb4", 3);
  for (const [x, y] of [[W * 0.1, H * 0.2], [W * 0.9, H * 0.78], [W * 0.88, H * 0.18]]) { g.fillStyle = "#f2c23a"; g.beginPath(); for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 - Math.PI / 2, r = k % 2 ? H * 0.04 : H * 0.09; g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } g.fill(); }
};
/** her sign (W:H = 1.67): white card, LOOK WITH / YOUR EYES in red and blue marker, two strips of tape */
export const lookSign = (p: Pen, W: number, H: number, k = 0) => {
  const g = p.g; rrect(g, 6, 6, W - 12, H - 12, 10, "#fffdf6", "#d6cfbf", 4);
  marker(g, "LOOK WITH", W / 2, H * 0.34, H * 0.24, "#d8322f", 2 + k); marker(g, "YOUR EYES", W / 2, H * 0.68, H * 0.24, "#2f5fb4", 5 + k);
  g.fillStyle = "#f2a33a"; g.beginPath(); g.ellipse(W * 0.88, H * 0.5, H * 0.07, H * 0.05, 0, 0, 7); g.fill(); g.fillStyle = "#1d1b22"; g.beginPath(); g.arc(W * 0.88, H * 0.5, H * 0.025, 0, 7); g.fill(); // an eye doodle
  g.fillStyle = "rgba(240,236,210,0.85)"; g.fillRect(W * 0.05, 0, W * 0.16, H * 0.12); g.fillRect(W * 0.79, H * 0.88, W * 0.16, H * 0.12);
};

// ---------------- the gym ----------------
/** warm maple boards, 9 cm wide, one texture = 1 m */
export const maple = (g: CanvasRenderingContext2D, r: () => number) => {
  for (let i = 0; i < 11; i++) { const base = ["#e6b778", "#deae6c", "#ebbf82", "#e2b272"][i % 4]; g.fillStyle = base; g.fillRect(0, i * 47, 512, 47);
    for (let k = 0; k < 3; k++) { const x = (k * 190 + i * 71 + r() * 40) % 512; g.fillStyle = "rgba(120,70,30,0.35)"; g.fillRect(x, i * 47, 2, 47); }
    g.fillStyle = "rgba(120,70,30,0.3)"; g.fillRect(0, i * 47 + 45, 512, 2); }
  for (let i = 0; i < 260; i++) { g.fillStyle = "rgba(150,90,40,0.07)"; g.fillRect(r() * 512, r() * 512, 30 + r() * 70, 2); }
};
/** court lines on a transparent canvas covering x -9..9, z -7..8 (W:H = 18:15) */
export const courtLines = (p: Pen, W: number, H: number) => {
  const g = p.g, s = W / 18, X = (x: number) => (x + 9) * s, Z = (z: number) => (z + 7) * s, lw = 0.06 * s;
  g.strokeStyle = "#ffffff"; g.lineWidth = lw;
  g.strokeRect(X(-8.4), Z(-6.4), 16.8 * s, 13.8 * s); g.beginPath(); g.moveTo(X(-8.4), Z(0.5)); g.lineTo(X(8.4), Z(0.5)); g.stroke();
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(X(0), Z(0.5), 1.8 * s, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#ffffff"; font(g, 900, 1.5 * s); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MM", X(0), Z(0.55));
  for (const [z0, d] of [[-6.4, 1], [7.4, -1]] as [number, number][]) {
    g.fillStyle = "#3f86e0"; g.fillRect(X(-2.4), Math.min(Z(z0), Z(z0 + d * 5.8)), 4.8 * s, 5.8 * s); g.strokeRect(X(-2.4), Math.min(Z(z0), Z(z0 + d * 5.8)), 4.8 * s, 5.8 * s);
    g.beginPath(); g.arc(X(0), Z(z0 + d * 5.8), 1.8 * s, d > 0 ? 0 : Math.PI, d > 0 ? Math.PI : 2 * Math.PI); g.stroke();
    g.beginPath(); g.arc(X(0), Z(z0 + d * 1.6), 6.75 * s, d > 0 ? 0.15 : Math.PI + 0.15, d > 0 ? Math.PI - 0.15 : 2 * Math.PI - 0.15); g.stroke();
  }
};
/** painted concrete block wall, cream, a red band (one texture = 2 m wide, 2 m tall: block rows of 20 cm) */
export const blockWall = (g: CanvasRenderingContext2D, r: () => number, base = "#f8ecd2") => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 10; row++) { const y = row * 51.2; g.fillStyle = "rgba(150,120,90,0.35)"; g.fillRect(0, y, 512, 3);
    for (let i = 0; i < 6; i++) { const x = i * 102.4 + (row % 2) * 51.2; g.fillRect(x % 512, y, 3, 51.2); } }
  for (let i = 0; i < 500; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.12)" : "rgba(120,90,60,0.06)"; g.fillRect(r() * 512, r() * 512, 3, 3); }
};
export const scoreboard = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 18, "#1f6a4a", "#f2c23a", 12);
  lt(g, "HOME", W * 0.2, H * 0.2, H * 0.13, "#ffffff", 900, "center"); lt(g, "GUEST", W * 0.8, H * 0.2, H * 0.13, "#ffffff", 900, "center");
  lt(g, "MIRA MESA", W / 2, H * 0.2, H * 0.12, "#f2c23a", 900, "center");
  for (const x of [0.2, 0.8]) { rrect(g, W * (x - 0.11), H * 0.36, W * 0.22, H * 0.42, 10, "#14402c"); lt(g, "00", W * x, H * 0.58, H * 0.36, "#ff5a3a", 900, "center"); }
  rrect(g, W * 0.4, H * 0.42, W * 0.2, H * 0.3, 10, "#14402c"); lt(g, "12:00", W / 2, H * 0.58, H * 0.17, "#ffd23a", 900, "center");
};
export const banner = (p: Pen, W: number, H: number, txt: string, bg: string, fg: string, sub = "") => {
  const g = p.g; g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(0, H * 0.06, W, H * 0.04); g.fillRect(0, H * 0.9, W, H * 0.04);
  for (const x of [H * 0.18, W - H * 0.18]) { g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(x, H * 0.18, H * 0.06, 0, 7); g.fill(); }
  lt(g, txt, W / 2, sub ? H * 0.44 : H * 0.52, H * (sub ? 0.4 : 0.55), fg, 900, "center", W * 0.86);
  if (sub) lt(g, sub, W / 2, H * 0.8, H * 0.18, fg, 700, "center", W * 0.86);
};
export const corkBoard = (p: Pen, W: number, H: number) => {
  const g = p.g; g.fillStyle = "#c98a52"; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 1800; i++) { g.fillStyle = i % 2 ? "rgba(120,70,30,0.25)" : "rgba(255,220,170,0.2)"; g.fillRect((i * 97.3) % W, (i * 53.7) % H, 3, 3); }
  const note = (x: number, y: number, w: number, h: number, bg: string, t1: string, t2: string, rot: number, pin: string) => {
    g.save(); g.translate(x, y); g.rotate(rot); rrect(g, -w / 2, -h / 2, w, h, 4, bg); lt(g, t1, 0, -h * 0.15, h * 0.2, "#1d1b22", 900, "center", w * 0.9); lt(g, t2, 0, h * 0.18, h * 0.12, "#1d1b22", 700, "center", w * 0.9);
    g.fillStyle = pin; g.beginPath(); g.arc(0, -h / 2 + 12, 9, 0, 7); g.fill(); g.restore();
  };
  note(W * 0.17, H * 0.3, W * 0.22, H * 0.36, "#fff4a8", "BAKE SALE", "FRIDAY · GYM LOBBY", -0.05, "#d8322f");
  note(W * 0.17, H * 0.74, W * 0.22, H * 0.34, "#bfe6f8", "CLUB FAIR", "TUES LUNCH", 0.04, "#2f9a55");
  note(W * 0.83, H * 0.32, W * 0.22, H * 0.38, "#ffffff", "GO SUNDEVILS!", "HOME GAME SAT", 0.06, "#2f5fb4");
  note(W * 0.84, H * 0.76, W * 0.2, H * 0.3, "#ffd2e2", "ROBOTICS", "ROOM 214", -0.04, "#f2a33a");
};
/** the police flyer (W:H = 0.773, letter paper): HAVE YOU SEEN THIS CAR?, a photo-style print of a generic black sedan, SDPD */
export const flyer = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 4, "#ffffff", "#d6cfbf", 3);
  g.fillStyle = "#2f4a8a"; g.fillRect(0, 0, W, H * 0.13); lt(g, "SAN DIEGO POLICE", W / 2, H * 0.065, H * 0.06, "#ffffff", 900, "center", W * 0.9);
  lt(g, "HAVE YOU SEEN", W / 2, H * 0.2, H * 0.075, "#d8322f", 900, "center", W * 0.92); lt(g, "THIS CAR?", W / 2, H * 0.29, H * 0.085, "#d8322f", 900, "center", W * 0.92);
  // the photo: a parking lot, a black sedan three-quarter view
  const px = W * 0.08, py = H * 0.36, pw = W * 0.84, ph = H * 0.38;
  const sk = g.createLinearGradient(0, py, 0, py + ph); sk.addColorStop(0, "#9ec8ec"); sk.addColorStop(0.45, "#dfeefa"); sk.addColorStop(0.46, "#8a8790"); sk.addColorStop(1, "#6f6c78");
  g.fillStyle = sk; g.fillRect(px, py, pw, ph); g.fillStyle = "#f1e9cf"; for (let i = 0; i < 4; i++) g.fillRect(px + pw * (0.1 + i * 0.27), py + ph * 0.62, pw * 0.02, ph * 0.38);
  const cx = px + pw * 0.5, cy = py + ph * 0.66, s = pw / 10;
  g.fillStyle = "#16181e"; g.beginPath(); g.moveTo(cx - 4 * s, cy + 0.6 * s); g.lineTo(cx - 4.1 * s, cy - 0.4 * s); g.lineTo(cx - 2.6 * s, cy - 0.8 * s); g.lineTo(cx - 1.4 * s, cy - 2 * s);
  g.lineTo(cx + 1.6 * s, cy - 2 * s); g.lineTo(cx + 2.8 * s, cy - 0.8 * s); g.lineTo(cx + 4.1 * s, cy - 0.5 * s); g.lineTo(cx + 4 * s, cy + 0.6 * s); g.closePath(); g.fill();
  g.fillStyle = "#5f7c9c"; g.beginPath(); g.moveTo(cx - 1.2 * s, cy - 1.8 * s); g.lineTo(cx + 1.4 * s, cy - 1.8 * s); g.lineTo(cx + 2.4 * s, cy - 0.85 * s); g.lineTo(cx - 2.2 * s, cy - 0.85 * s); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(cx - 3.5 * s, cy - 0.55 * s, 6.8 * s, 0.12 * s);
  g.fillStyle = "#0a0a0e"; for (const x of [-2.5, 2.4]) { g.beginPath(); g.arc(cx + x * s, cy + 0.6 * s, 0.75 * s, 0, 7); g.fill(); g.fillStyle = "#9aa2ae"; g.beginPath(); g.arc(cx + x * s, cy + 0.6 * s, 0.35 * s, 0, 7); g.fill(); g.fillStyle = "#0a0a0e"; }
  g.strokeStyle = "#1d1b22"; g.lineWidth = 3; g.strokeRect(px, py, pw, ph);
  lt(g, "BLACK 4-DOOR SEDAN", W / 2, H * 0.8, H * 0.045, "#1d1b22", 900, "center", W * 0.9);
  lt(g, "THEFT AT MIRA MESA HIGH CARD SHOW", W / 2, H * 0.86, H * 0.03, "#1d1b22", 700, "center", W * 0.9);
  lt(g, "CALL CRIME STOPPERS", W / 2, H * 0.93, H * 0.04, "#2f4a8a", 900, "center", W * 0.9);
};
export const rulesBoard = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 0, 0, W, H, 12, "#fffdf6", "#2f5fb4", 14);
  g.fillStyle = "#2f5fb4"; g.fillRect(14, 14, W - 28, H * 0.18); lt(g, "VENDOR RULES", W / 2, H * 0.11, H * 0.09, "#ffffff", 900, "center", W * 0.86);
  const rows = ["ONE CARD AT A TIME", "HOLD THE EDGE", "STAFF NEARBY", "ASK SECURITY"];
  rows.forEach((t, i) => { const y = H * (0.34 + i * 0.16); g.fillStyle = "#d8322f"; g.beginPath(); g.arc(W * 0.14, y, H * 0.04, 0, 7); g.fill(); lt(g, String(i + 1), W * 0.14, y + 1, H * 0.05, "#ffffff", 900, "center");
    lt(g, t, W * 0.24, y, H * 0.065, "#1d1b22", 900, "left", W * 0.7); });
};
/** the fundraiser jar's meter card: a hand-drawn thermometer filled to k (0..1 of the goal shown; the family asks for a third) */
export const meter = (p: Pen, W: number, H: number, k: number) => {
  const g = p.g; rrect(g, 4, 4, W - 8, H - 8, 10, "#fffdf6", "#d6cfbf", 4);
  marker(g, "HELP US", W / 2, H * 0.12, H * 0.08, "#2f5fb4", 4); marker(g, "REPLACE IT!", W / 2, H * 0.22, H * 0.07, "#d8322f", 6);
  const x = W * 0.42, y0 = H * 0.32, y1 = H * 0.86, w = W * 0.16;
  rrect(g, x, y0, w, y1 - y0, w / 2, "#ffffff", "#1d1b22", 5);
  const fy = y1 - (y1 - y0) * k; g.save(); g.beginPath(); g.roundRect(x + 5, y0 + 5, w - 10, y1 - y0 - 10, (w - 10) / 2); g.clip(); g.fillStyle = "#d8322f"; g.fillRect(x, fy, w, y1 - fy); g.restore();
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(x + w / 2, y1 + w * 0.2, w * 0.62, 0, 7); g.fill(); g.strokeStyle = "#1d1b22"; g.lineWidth = 5; g.stroke();
  g.strokeStyle = "#1d1b22"; g.lineWidth = 3; for (const t of [1 / 3, 2 / 3, 1]) { const yy = y1 - (y1 - y0) * t; g.beginPath(); g.moveTo(x + w, yy); g.lineTo(x + w + 18, yy); g.stroke(); }
  marker(g, "GOAL", W * 0.8, y1 - (y1 - y0) / 3, H * 0.05, "#1d1b22", 2);
};
/** booth banner on a pole (W:H = 2.6) */
export const poleSign = (p: Pen, W: number, H: number, txt: string, bg: string) => plainSign(p, W, H, txt, bg, "#ffffff", "", "#ffffff");

// ---------------- money, phone, fx ----------------
export const bill = (p: Pen, W: number, H: number) => {
  const g = p.g;
  rrect(g, 0, 0, W, H, H * 0.04, "#dfe9d4", "#7f9a74", H * 0.03);
  g.strokeStyle = "#9fb592"; g.lineWidth = H * 0.025; g.strokeRect(W * 0.04, H * 0.08, W * 0.92, H * 0.84);
  g.fillStyle = "#c9dcbd"; g.beginPath(); g.ellipse(W * 0.5, H * 0.5, W * 0.13, H * 0.34, 0, 0, 7); g.fill();
  lt(g, "20", W * 0.12, H * 0.24, H * 0.26, "#3f5a3a", 900, "center"); lt(g, "20", W * 0.88, H * 0.76, H * 0.3, "#3f5a3a", 900, "center");
};
/** a phone seen from behind (coral case, camera bump) (W:H = 0.5) */
export const phoneBack = (p: Pen, W: number, H: number) => {
  const g = p.g; rrect(g, 3, 3, W - 6, H - 6, W * 0.16, "#f2785a", "#1d1b22", 5);
  rrect(g, W * 0.12, W * 0.12, W * 0.38, W * 0.5, W * 0.1, "#1d1b22"); g.fillStyle = "#4f78c8"; g.beginPath(); g.arc(W * 0.31, W * 0.26, W * 0.08, 0, 7); g.fill(); g.beginPath(); g.arc(W * 0.31, W * 0.48, W * 0.08, 0, 7); g.fill();
};
/** the phone in the holder's hands seen from behind it: the bezel frames the shot, the screen is open (transparent), camera UI on top.
 *  Canvas W x H matches the phone 7.4 x 15 cm; the screen window is inset 6 % / 4 %. */
export const phoneFrame = (p: Pen, W: number, H: number, k: number) => {
  const g = p.g, mx = W * 0.06, my = H * 0.04;
  g.fillStyle = "#1d1b22"; g.beginPath(); g.roundRect(0, 0, W, H, W * 0.14); g.roundRect(mx, my, W - 2 * mx, H - 2 * my, W * 0.1); g.fill("evenodd");
  g.strokeStyle = "#f2785a"; g.lineWidth = W * 0.035; g.beginPath(); g.roundRect(W * 0.018, W * 0.018, W - W * 0.036, H - W * 0.036, W * 0.13); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 3; for (const t of [1 / 3, 2 / 3]) { g.beginPath(); g.moveTo(mx + (W - 2 * mx) * t, my + H * 0.08); g.lineTo(mx + (W - 2 * mx) * t, H - my - H * 0.14); g.stroke(); g.beginPath(); g.moveTo(mx, my + H * 0.08 + (H - 2 * my - H * 0.22) * t); g.lineTo(W - mx, my + H * 0.08 + (H - 2 * my - H * 0.22) * t); g.stroke(); }
  g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(mx, my, W - 2 * mx, H * 0.07); g.fillRect(mx, H - my - H * 0.13, W - 2 * mx, H * 0.13);
  lt(g, "PHOTO", W / 2, my + H * 0.035, H * 0.028, "#f2c23a", 900, "center");
  g.fillStyle = "#ffffff"; g.beginPath(); g.arc(W / 2, H - my - H * 0.065, H * 0.042, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 5; g.beginPath(); g.arc(W / 2, H - my - H * 0.065, H * 0.052, 0, 7); g.stroke();
  if (k > 0) { const s = W * (0.62 - 0.08 * Math.min(1, k)), cx = W / 2, cy = H * 0.47; g.strokeStyle = "#f2d23a"; g.lineWidth = 5;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(cx + sx * s / 2, cy + sy * s / 2 - sy * s * 0.15); g.lineTo(cx + sx * s / 2, cy + sy * s / 2); g.lineTo(cx + sx * s / 2 - sx * s * 0.15, cy + sy * s / 2); g.stroke(); } }
};
/** speed lines behind a runner (W:H = 2), drawn on transparent */
export const speedLines = (p: Pen, W: number, H: number, ph: number) => {
  const g = p.g; g.strokeStyle = "#ffffff"; g.lineCap = "round";
  for (let i = 0; i < 7; i++) { const y = H * (0.15 + i * 0.11), L = W * (0.35 + 0.3 * Math.abs(Math.sin(i * 2.1 + ph))), x = W * 0.1 * Math.abs(Math.sin(i * 1.3 + ph * 2));
    g.lineWidth = H * 0.045; g.strokeStyle = "#1d1b22"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + L, y); g.stroke(); g.lineWidth = H * 0.025; g.strokeStyle = "#ffffff"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + L, y); g.stroke(); }
};
/** a red cartoon pain star (W:H = 1) */
export const painStar = (p: Pen, S: number, u: number) => {
  const g = p.g, c = S / 2, sc = u < 0.3 ? u / 0.3 : 1, r0 = S * 0.18 * sc, r1 = S * 0.46 * sc;
  g.globalAlpha = u > 0.75 ? (1 - u) / 0.25 : 1;
  g.beginPath(); for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2, r = k % 2 ? r0 : r1; g.lineTo(c + r * Math.cos(a), c + r * Math.sin(a)); } g.closePath();
  g.fillStyle = "#ff3a2a"; g.fill(); g.strokeStyle = "#1d1b22"; g.lineWidth = S * 0.035; g.stroke();
  g.beginPath(); for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2, r = (k % 2 ? 0.1 : 0.24) * S * sc; g.lineTo(c + r * Math.cos(a), c + r * Math.sin(a)); } g.closePath(); g.fillStyle = "#ffd23a"; g.fill();
  g.globalAlpha = 1;
};
