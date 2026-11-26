// iCaterpie reel drawings (canvas). The notice board (MẠNG XÃ HỘI) and its empty official frame, the post sheet (judge doodle,
// complaint scribbles, the name under a censor bar, the torn corner), the announcement, the hall sign, the shutter, the ban
// sign, the clock face, the signpost, the sticker suitcase, the trophies, the phone's photo page, the scale's weights, the crow,
// the Worlds banners and the Golden Gate panorama, playmats with real cards. Plain lettering only, no logos.
import { Pen, INK } from "../../engine/toon";
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
const rrect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw = 2) => {
  g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = fill; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
};
const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
/** marker handwriting: a wobbly scribble line from x0 to x1 at y (illegible on purpose: we never put words in his mouth) */
const scribble = (g: CanvasRenderingContext2D, x0: number, x1: number, y: number, k: number, col: string, w: number, seed: number) => {
  if (k <= 0) return;
  const xe = x0 + (x1 - x0) * Math.min(1, k);
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(x0, y);
  for (let x = x0, i = 0; x < xe; x += 7, i++) {
    const word = Math.floor((x - x0) / 70 + hh(seed, 1) * 3) % 5 === 4;
    if (word) { g.moveTo(x + 7, y); continue; }
    g.lineTo(x, y + Math.sin(i * 1.9 + seed) * w * 1.3 + (hh(i, seed) - 0.5) * w * 1.6);
  }
  g.stroke();
};

// ---------------- the notice board ----------------
/** cork face 750 x 1000 (= 1.5 x 2 m): the official frame at the top (EMPTY all reel), old flyers in the free spaces */
export const boardFace = (p: Pen) => {
  const g = p.g;
  g.fillStyle = "#c98f55"; g.fillRect(0, 0, 750, 1000);
  for (let i = 0; i < 9000; i++) { g.fillStyle = hh(i) > 0.5 ? "rgba(120,70,30,0.22)" : "rgba(255,225,180,0.22)"; g.fillRect(hh(i, 2) * 750, hh(i, 3) * 1000, 2 + hh(i, 4) * 3, 2); }
  // the official frame: THE POKÉMON COMPANY · THÔNG BÁO CHÍNH THỨC, a blank cream panel behind glass
  rrect(g, 142, 62, 466, 306, 10, "#2f5fd0"); rrect(g, 156, 120, 438, 236, 6, "#fbf6e8");
  lt(g, "THE POKÉMON COMPANY", 375, 82, 26, "#ffffff", 900, "center", 440); lt(g, "THÔNG BÁO CHÍNH THỨC", 375, 106, 18, "#ffd65a", 800, "center", 440);
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.moveTo(180, 356); g.lineTo(240, 120); g.lineTo(272, 120); g.lineTo(212, 356); g.fill();
  // flyers (Italian town life), each with a red push pin
  const flyer = (x: number, y: number, w: number, h: number, bg: string, t1: string, t2: string, rot: number, col = "#2a2c33") => {
    g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.fillStyle = bg; g.fillRect(-w / 2, -h / 2, w, h);
    lt(g, t1, 0, -h / 2 + 24, 20, col, 900, "center", w - 16); lt(g, t2, 0, -h / 2 + 50, 14, col, 600, "center", w - 16);
    for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(40,40,50,0.35)"; g.fillRect(-w / 2 + 14, -h / 2 + 72 + i * 16, w - 28 - (i % 2) * 20, 5); }
    if (h > 150) for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(40,40,50,0.35)"; g.fillRect(-w / 2 + 8 + i * ((w - 16) / 6), h / 2 - 30, 4, 24); }
    g.fillStyle = "#d8322f"; g.beginPath(); g.arc(0, -h / 2 + 6, 7, 0, 7); g.fill(); g.restore();
  };
  flyer(440, 400, 150, 200, "#fff3a8", "GATTO", "SMARRITO", -0.05);
  flyer(605, 420, 130, 190, "#bfe6ff", "LEZIONI", "DI CHITARRA", 0.06);
  flyer(618, 70, 120, 150, "#ffd0d8", "SAGRA", "DEL PANE", 0.04);
  flyer(620, 240, 116, 130, "#d8f2c0", "AFFITTASI", "BICI", -0.07);
  flyer(10, 120, 120, 170, "#ffe0b8", "MERCATO", "SABATO", 0.05);
};
/** the header plank 1600 x 360: MẠNG XÃ HỘI */
export const boardHeader = (p: Pen) => {
  const g = p.g; g.fillStyle = "#8a5a34"; g.fillRect(0, 0, 1600, 360);
  for (let i = 0; i < 10; i++) { g.fillStyle = "rgba(60,35,20,0.18)"; g.fillRect(0, 20 + i * 34, 1600, 3); }
  rrect(g, 40, 40, 1520, 280, 26, "#d8322f"); lt(g, "MẠNG XÃ HỘI", 800, 186, 170, "#fff6dc", 900, "center", 1460);
};

// ---------------- the post sheet ----------------
/** 900 x 1200 (= 60 x 80 cm): o.lines/doodle/name/censor 0..1 (written so far) */
export type SheetO = { title?: number; doodle?: number; lines?: number; name?: number; censor?: number };
export const postSheet = (p: Pen, o: SheetO = {}) => {
  const g = p.g, { title = 1, doodle = 1, lines = 1, name = 1, censor = 1 } = o;
  g.fillStyle = "#fffdf6"; g.fillRect(0, 0, 900, 1200);
  g.fillStyle = "rgba(140,170,220,0.35)"; for (let y = 140; y < 1180; y += 52) g.fillRect(30, y, 840, 3); // ruled paper
  // the title in black marker, revealed left to right
  if (title > 0) { g.save(); g.beginPath(); g.rect(0, 0, 60 + 800 * title, 130); g.clip(); lt(g, "VỀ MỘT TRỌNG TÀI Ở WORLDS", 450, 74, 64, "#1d1b22", 900, "center", 840); g.restore(); }
  // the doodle: a judge in a striped shirt (stick limbs), a stop hand; drawn stroke by stroke
  if (doodle > 0) {
    const d = doodle, cx = 240, cy = 420;
    g.save(); g.lineWidth = 10; g.strokeStyle = "#1d1b22"; g.lineCap = "round";
    if (d > 0) { g.beginPath(); g.arc(cx, cy - 150, 56, 0, Math.PI * 2 * Math.min(1, d / 0.2)); g.stroke(); }
    if (d > 0.2) { g.beginPath(); g.rect(cx - 70, cy - 86, 140, 170 * Math.min(1, (d - 0.2) / 0.2)); g.stroke(); }
    if (d > 0.4) { g.save(); g.beginPath(); g.rect(cx - 70, cy - 86, 140, 170); g.clip(); for (let i = 0; i < 7 * Math.min(1, (d - 0.4) / 0.2); i++) { g.fillStyle = "#1d1b22"; g.fillRect(cx - 70 + i * 40, cy - 86, 18, 170); } g.restore(); }
    if (d > 0.6) { g.beginPath(); g.moveTo(cx - 70, cy - 70); g.lineTo(cx - 150, cy - 170); g.moveTo(cx + 70, cy - 70); g.lineTo(cx + 140, cy - 10); g.moveTo(cx - 35, cy + 84); g.lineTo(cx - 45, cy + 190); g.moveTo(cx + 35, cy + 84); g.lineTo(cx + 45, cy + 190); g.stroke(); }
    if (d > 0.8) { g.beginPath(); g.arc(cx - 20, cy - 160, 6, 0, 7); g.arc(cx + 20, cy - 160, 6, 0, 7); g.fillStyle = "#1d1b22"; g.fill(); g.beginPath(); g.moveTo(cx - 25, cy - 120); g.lineTo(cx + 25, cy - 128); g.stroke();
      g.strokeStyle = "#d8322f"; g.lineWidth = 12; g.beginPath(); g.arc(cx + 210, cy - 120, 70, 0, 7); g.moveTo(cx + 160, cy - 170); g.lineTo(cx + 260, cy - 70); g.stroke(); lt(g, "!?", cx + 210, cy - 120, 70, "#d8322f", 900, "center"); }
    g.restore();
  }
  // complaint lines (scribbles), right of the doodle then full width
  const L = [[480, 860, 300], [480, 840, 352], [480, 870, 404], [480, 800, 456], [60, 860, 640], [60, 840, 692], [60, 870, 744], [60, 620, 796]];
  L.forEach(([a, b, y], i) => scribble(g, a, b, y, lines * L.length - i, "#2a3f8f", 7, i + 3));
  // the name in red marker (never legible) and the censor bar over it
  if (name > 0) { lt(g, "TÊN:", 60, 920, 54, "#1d1b22", 900); scribble(g, 200, 820, 920, name, "#d8322f", 16, 41); scribble(g, 220, 800, 936, name - 0.4, "#d8322f", 10, 17); }
  if (censor > 0) { const s = censor < 1 ? 1 + 0.15 * Math.sin(censor * Math.PI) : 1; g.save(); g.translate(510, 925); g.scale(s, 1 / s); g.fillStyle = "#0d0d10"; g.fillRect(-330, -58, 660, 116); g.restore(); }
  // the pin
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(450, 40, 22, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
};
/** what stays on the pin after the rip: 240 x 160 corner of the sheet with a jagged bottom edge */
export const tornCorner = (p: Pen) => {
  const g = p.g; g.beginPath(); g.moveTo(40, 0); g.lineTo(200, 0);
  const pts: [number, number][] = [[200, 0], [215, 30], [190, 52], [205, 80], [176, 104], [150, 96], [128, 128], [104, 108], [80, 132], [62, 104], [38, 118], [30, 84], [12, 64], [28, 34]];
  g.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts) g.lineTo(x, y); g.lineTo(40, 0); g.closePath();
  g.fillStyle = "#fffdf6"; g.fill(); g.strokeStyle = "rgba(90,80,70,0.6)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "rgba(140,170,220,0.4)"; g.fillRect(28, 100, 150, 3);
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(120, 40, 22, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
};
/** the crumpled post in his hand / the paper ball, 160 x 160 */
export const paperBall = (p: Pen) => {
  p.poly([[30, 70], [50, 30], [92, 22], [130, 44], [140, 92], [112, 132], [62, 136], [28, 108]], "#fffdf6", 5);
  p.stroke([[50, 60], [80, 80], [110, 58]], 4, "#9aa0b0"); p.stroke([[60, 110], [86, 92], [118, 104]], 4, "#9aa0b0"); p.stroke([[70, 40], [74, 66]], 3, "#2a3f8f");
};
/** the announcement 660 x 870 (= 44 x 58 cm): his own words, his signature */
export const annSheet = (p: Pen) => {
  const g = p.g; g.fillStyle = "#fffdf6"; g.fillRect(0, 0, 660, 870);
  lt(g, "TÔI BỊ", 330, 110, 92, "#d8322f", 900, "center", 600); lt(g, "CẤM", 330, 230, 150, "#d8322f", 900, "center", 600); lt(g, "VĨNH VIỄN", 330, 360, 104, "#d8322f", 900, "center", 620);
  lt(g, "khỏi mọi giải đấu chính thức", 330, 470, 40, "#1d1b22", 700, "center", 620); lt(g, "của Pokémon.", 330, 520, 40, "#1d1b22", 700, "center", 620);
  // a sad face
  g.strokeStyle = "#1d1b22"; g.lineWidth = 9; g.beginPath(); g.arc(330, 640, 62, 0, 7); g.stroke(); g.fillStyle = "#1d1b22"; g.beginPath(); g.arc(306, 625, 7, 0, 7); g.arc(354, 625, 7, 0, 7); g.fill();
  g.beginPath(); g.arc(330, 680, 26, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); g.fillStyle = "#3f86e0"; g.beginPath(); g.ellipse(300, 650, 6, 11, 0, 0, 7); g.fill();
  lt(g, "— iCaterpie", 600, 790, 54, "#2f7a2a", 900, "right", 560);
  g.fillStyle = "#d8322f"; g.beginPath(); g.arc(330, 30, 20, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
};

// ---------------- the hall ----------------
export const hallSign = (p: Pen) => {
  const g = p.g; rrect(g, 0, 0, 1800, 300, 30, "#2f5fd0"); rrect(g, 18, 18, 1764, 264, 22, "#2f5fd0", "#f2c84a", 10);
  lt(g, "POKÉMON", 900, 98, 104, "#ffd65a", 900, "center", 1700); lt(g, "GIẢI ĐẤU CHÍNH THỨC", 900, 210, 86, "#ffffff", 900, "center", 1700);
};
/** red rolling shutter slats, 512 x 512 (tiled) */
export const shutterTex = (p: Pen) => {
  const g = p.g; g.fillStyle = "#d8322f"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) { g.fillStyle = "rgba(120,20,20,0.55)"; g.fillRect(0, y, 512, 4); g.fillStyle = "rgba(255,200,190,0.45)"; g.fillRect(0, y + 5, 512, 4); g.fillStyle = "rgba(150,30,30,0.2)"; g.fillRect(0, y + 20, 512, 8); }
};
export const banSign = (p: Pen) => {
  const g = p.g; rrect(g, 10, 40, 580, 260, 22, "#fffdf6", "#d8322f", 22);
  lt(g, "CẤM", 300, 130, 110, "#d8322f", 900, "center", 520); lt(g, "VĨNH VIỄN", 300, 240, 82, "#d8322f", 900, "center", 540);
  g.strokeStyle = "#8a8f98"; g.lineWidth = 8; g.beginPath(); g.moveTo(150, 46); g.lineTo(300, 4); g.lineTo(450, 46); g.stroke();
};
/** the façade clock, 512 x 512: cream face, black numerals, gold rim; minutes since midnight */
export const clockFace = (p: Pen, minutes: number) => {
  const g = p.g, c = 256;
  g.fillStyle = "#c9a24a"; g.beginPath(); g.arc(c, c, 254, 0, 7); g.fill(); g.fillStyle = "#fbf6e8"; g.beginPath(); g.arc(c, c, 224, 0, 7); g.fill();
  g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(c, c, 224, 0, 7); g.stroke();
  const R = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; lt(g, R[i], c + Math.sin(a) * 180, c - Math.cos(a) * 180, 36, "#1d1b22", 900, "center"); }
  for (let i = 0; i < 60; i++) { const a = (i / 60) * Math.PI * 2, r0 = i % 5 ? 212 : 204; g.strokeStyle = INK; g.lineWidth = i % 5 ? 3 : 6; g.beginPath(); g.moveTo(c + Math.sin(a) * r0, c - Math.cos(a) * r0); g.lineTo(c + Math.sin(a) * 222, c - Math.cos(a) * 222); g.stroke(); }
  const am = (minutes / 60) * Math.PI * 2, ah = ((minutes % 720) / 720) * Math.PI * 2;
  p.line([[c, c], [c + Math.sin(ah) * 112, c - Math.cos(ah) * 112]], "#1d1b22", 18, false); p.line([[c, c], [c + Math.sin(am) * 168, c - Math.cos(am) * 168]], "#1d1b22", 10, false);
  g.fillStyle = "#c9a24a"; g.beginPath(); g.arc(c, c, 16, 0, 7); g.fill();
};

// ---------------- the square ----------------
export const cafeSign = (p: Pen) => { const g = p.g; rrect(g, 0, 0, 1200, 240, 24, "#2f8a55"); lt(g, "CAFFÈ", 600, 124, 160, "#fff6dc", 900, "center", 1100); };
/** one signpost arrow 700 x 140 pointing right (or left), a name on it */
export const arrow = (p: Pen, name: string, col: string, left = false) => {
  const g = p.g; g.save(); if (left) { g.translate(700, 0); g.scale(-1, 1); }
  g.beginPath(); g.moveTo(10, 14); g.lineTo(590, 14); g.lineTo(690, 70); g.lineTo(590, 126); g.lineTo(10, 126); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  g.restore(); lt(g, name, left ? 400 : 300, 72, 76, "#fff6dc", 900, "center", 520);
};
/** the suitcase's broad side 600 x 420: red shell, ribs, city stickers (25 years on the road) */
export const suitcaseSide = (p: Pen) => {
  const g = p.g; rrect(g, 6, 6, 588, 408, 40, "#c0323c", INK, 10);
  for (const x of [150, 300, 450]) { g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(x - 4, 20, 8, 380); }
  const st: [string, string, string, number, number, number][] = [["ROMA", "#f2c84a", "#7a2a1a", 110, 100, -0.2], ["NAPOLI", "#3f86e0", "#ffffff", 300, 80, 0.1], ["TORINO", "#2f9a55", "#ffffff", 480, 110, -0.08],
    ["VENEZIA", "#ffffff", "#2f5fd0", 160, 230, 0.12], ["MILANO", "#f28a3a", "#ffffff", 360, 220, -0.1], ["BOLOGNA", "#fff3a8", "#c0323c", 480, 310, 0.18], ["FIRENZE", "#e86aa0", "#ffffff", 140, 340, -0.05], ["GENOVA", "#9fd0f2", "#1d2a6a", 320, 340, 0.06]];
  for (const [t, bg, fg, x, y, r] of st) { g.save(); g.translate(x, y); g.rotate(r); rrect(g, -80, -36, 160, 72, 16, bg, INK, 5); lt(g, t, 0, 2, 30, fg, 900, "center", 148); g.restore(); }
};
export const luggageTag = (p: Pen) => { const g = p.g; rrect(g, 8, 8, 284, 164, 18, "#f2c84a", INK, 8); g.fillStyle = INK; g.beginPath(); g.arc(40, 90, 12, 0, 7); g.fill(); lt(g, "NICE", 170, 90, 92, "#1d2a6a", 900, "center", 220); };
/** a gold trophy 300 x 420 with a plate */
export const trophy = (p: Pen) => {
  p.poly([[60, 40], [240, 40], [222, 170], [180, 220], [120, 220], [78, 170]], "#f2c84a", 8);
  p.arc(52, 110, 40, 50, 100, 260, 12, INK); p.arc(248, 110, 40, 50, -80, 80, 12, INK);
  p.poly([[132, 220], [168, 220], [176, 300], [124, 300]], "#e0b23a", 8); p.poly([[70, 300], [230, 300], [244, 400], [56, 400]], "#8a5a34", 8);
  const g = p.g; rrect(g, 84, 326, 132, 50, 8, "#f2c84a"); lt(g, "VÔ ĐỊCH", 150, 342, 20, "#5a3a12", 900, "center", 124); lt(g, "QUỐC GIA", 150, 364, 18, "#5a3a12", 900, "center", 124);
  g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(96, 60, 22, 110);
};
/** the friend's phone screen 540 x 1080: Ảnh (photos) of the post, three shares, a strip of 37 copies */
export const phonePhotos = (p: Pen, page: number) => {
  const g = p.g; g.fillStyle = "#ffffff"; g.fillRect(0, 0, 540, 1080);
  g.fillStyle = "#f2f4f8"; g.fillRect(0, 0, 540, 120); lt(g, "18:42", 30, 40, 26, "#1d1b22", 700); lt(g, "Ảnh", 270, 88, 36, "#1d1b22", 900, "center");
  lt(g, ["ảnh chụp · 13:42", "đã chia sẻ · 14:05", "đã lưu · 16:31"][page % 3], 270, 150, 26, "#5a6070", 600, "center");
  // the photo: the sheet on the cork, taken at three slightly different angles
  g.save(); g.fillStyle = "#c98f55"; g.fillRect(20, 180, 500, 640); g.translate(270, 500); g.rotate([-0.04, 0.05, -0.015][page % 3]); g.scale(0.5, 0.5); g.translate(-450, -600);
  const pp = new Pen(g); postSheet(pp); g.restore();
  // thumbnails: copies everywhere
  for (let i = 0; i < 5; i++) { g.fillStyle = "#c98f55"; g.fillRect(24 + i * 100, 860, 92, 120); g.fillStyle = "#fffdf6"; g.fillRect(40 + i * 100, 872, 60, 80); g.fillStyle = "#0d0d10"; g.fillRect(52 + i * 100, 930, 36, 8); }
  rrect(g, 380, 996, 140, 56, 28, "#d8322f"); lt(g, "37 bản", 450, 1024, 30, "#ffffff", 900, "center");
};
/** an iron weight 400 x 360 with its words */
export const ironWeight = (p: Pen, txt: string[]) => {
  p.arc(200, 70, 60, 50, 180, 360, 26, INK); p.arc(200, 70, 60, 50, 180, 360, 14, "#5f6b8a");
  p.poly([[60, 90], [340, 90], [384, 350], [16, 350]], "#3f4a6a", 10);
  const g = p.g; g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(70, 100, 40, 240);
  txt.forEach((t, i) => lt(g, t, 200, 200 + i * 70 - (txt.length - 1) * 35, 58, "#ffd65a", 900, "center", 330));
};
/** the crow 300 x 260: pose 0 perched, 1 wings up (landing), caw opens the beak */
export const crow = (p: Pen, pose: number, caw: boolean) => {
  const body = "#1d2a5a";
  if (pose) { p.poly([[150, 120], [40, 30], [70, 110]], body, 6); p.poly([[150, 120], [270, 20], [230, 110]], body, 6); }
  p.ell(150, 150, 70, 50, body, 6); p.poly([[90, 150], [20, 190], [80, 175]], body, 6);
  p.ell(208, 104, 36, 32, body, 6);
  if (caw) { p.poly([[236, 96], [292, 84], [240, 106]], "#f2c84a", 4); p.poly([[236, 108], [290, 122], [238, 114]], "#f2c84a", 4); }
  else p.poly([[236, 98], [290, 106], [236, 114]], "#f2c84a", 4);
  p.dot(214, 98, 7, "#ffffff"); p.dot(216, 98, 3.5, INK);
  p.stroke([[140, 196], [134, 236]], 6, "#f2c84a"); p.stroke([[166, 196], [170, 236]], 6, "#f2c84a");
};
export const puddle = (p: Pen) => {
  const g = p.g, gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, "rgba(120,190,255,0.85)"); gr.addColorStop(0.8, "rgba(90,160,235,0.8)"); gr.addColorStop(1, "rgba(90,160,235,0)");
  g.fillStyle = gr; g.beginPath(); for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2, r = 112 + 12 * Math.sin(i * 2.7); g.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(96, 96, 30, 10, -0.5, 0, 7); g.fill();
};
export const wetPrint = (p: Pen) => { const g = p.g; g.fillStyle = "rgba(60,110,190,0.75)"; g.beginPath(); g.ellipse(64, 64, 40, 26, 0, 0, 7); g.fill(); g.fillStyle = "rgba(160,210,255,0.6)"; g.beginPath(); g.ellipse(52, 56, 12, 6, 0, 0, 7); g.fill(); };
export const tearDrop = (p: Pen) => { p.poly([[32, 4], [52, 40], [44, 58], [20, 58], [12, 40]], "#7fc4ff", 4); p.dot(26, 40, 5, "#ffffff"); };
export const wetDot = (p: Pen) => { const g = p.g; g.fillStyle = "rgba(90,70,55,0.55)"; g.beginPath(); g.ellipse(32, 32, 28, 20, 0, 0, 7); g.fill(); };
export const napkin = (p: Pen) => { p.poly([[20, 40], [180, 24], [196, 120], [30, 140]], "#ffffff", 6); p.stroke([[40, 60], [170, 50]], 4, "#d8322f"); };
export const marker = (p: Pen) => { p.poly([[10, 30], [190, 30], [190, 70], [10, 70]], "#d8322f", 6); p.poly([[190, 36], [236, 50], [190, 64]], "#1d1b22", 4); p.poly([[10, 26], [60, 26], [60, 74], [10, 74]], "#1d1b22", 4); };
export const espresso = (p: Pen) => { p.poly([[40, 40], [160, 40], [148, 130], [52, 130]], "#ffffff", 7); p.ell(100, 40, 60, 14, "#6a3a1e", 6); p.arc(168, 80, 22, 26, -80, 80, 10, INK); p.ell(100, 140, 86, 14, "#ffffff", 6); };
export const deckBox = (p: Pen) => { p.poly([[20, 20], [180, 20], [180, 240], [20, 240]], "#5fb84a", 8); p.poly([[20, 20], [180, 20], [180, 70], [20, 70]], "#f2c84a", 8); p.dot(100, 150, 34, "#d8322f"); p.dot(100, 150, 16, "#fff6dc"); };

// ---------------- the Worlds hall ----------------
export const banner = (p: Pen, a: string, b: string, bg: string) => {
  const g = p.g; g.fillStyle = bg; g.beginPath(); g.moveTo(0, 0); g.lineTo(600, 0); g.lineTo(600, 1500); g.lineTo(300, 1640); g.lineTo(0, 1500); g.closePath(); g.fill();
  g.fillStyle = "#ffd65a"; g.fillRect(24, 24, 552, 16); g.fillRect(24, 1450, 552, 16);
  g.save(); g.translate(300, 760); g.rotate(-Math.PI / 2); lt(g, a, 0, -90, 170, "#ffffff", 900, "center", 1360); lt(g, b, 0, 110, 150, "#ffd65a", 900, "center", 1360); g.restore();
};
/** the view through the window, 2048 x 900: cloudy blue sky, green hills, the blue bay, the red Golden Gate Bridge */
export const goldenGate = (p: Pen) => {
  const g = p.g, W = 2048, H = 900;
  const sk = g.createLinearGradient(0, 0, 0, 560); sk.addColorStop(0, "#3f86e0"); sk.addColorStop(1, "#bfe0fb"); g.fillStyle = sk; g.fillRect(0, 0, W, H);
  const puff = (cx: number, cy: number, s: number) => { const bl = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.25, 0.75], [-0.4, -0.35, 0.75], [0.45, -0.3, 0.65]];
    g.fillStyle = "#3a4a6a"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s + 5, 0, 7); g.fill(); }
    g.fillStyle = "#ffffff"; for (const [dx, dy, r] of bl) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, 7); g.fill(); } };
  puff(260, 150, 70); puff(900, 100, 56); puff(1500, 170, 80); puff(1900, 90, 50);
  g.fillStyle = "#5aa64a"; g.beginPath(); g.moveTo(0, 600); g.bezierCurveTo(300, 440, 520, 470, 760, 600); g.lineTo(0, 640); g.fill();
  g.fillStyle = "#4f9a48"; g.beginPath(); g.moveTo(1300, 600); g.bezierCurveTo(1600, 420, 1850, 460, 2048, 560); g.lineTo(2048, 640); g.lineTo(1300, 640); g.fill();
  g.fillStyle = "#2f7fd0"; g.fillRect(0, 600, W, 300); g.fillStyle = "rgba(255,255,255,0.35)"; for (let i = 0; i < 40; i++) g.fillRect(hh(i) * W, 620 + hh(i, 2) * 260, 40 + hh(i, 3) * 80, 4);
  const red = "#d0402a", deck = 560;
  for (const tx of [560, 1460]) { g.fillStyle = red; g.fillRect(tx - 26, 220, 18, 400); g.fillRect(tx + 8, 220, 18, 400); for (const y of [240, 330, 430, 520]) g.fillRect(tx - 26, y, 52, 14); }
  g.strokeStyle = red; g.lineWidth = 7; g.beginPath(); g.moveTo(0, 470); g.quadraticCurveTo(280, 560, 560, 226); g.quadraticCurveTo(1010, 590, 1460, 226); g.quadraticCurveTo(1760, 560, 2048, 470); g.stroke();
  g.lineWidth = 3; for (let x = 20; x < W; x += 34) { const yc = x < 560 ? 470 + (226 - 470) * (x / 560) ** 2 * 0 + 0 : 0; void yc; }
  for (let x = 580; x < 1450; x += 30) { const u = (x - 560) / 900, y = 226 + (1 - (2 * u - 1) ** 2) * 186; g.beginPath(); g.moveTo(x, y); g.lineTo(x, deck); g.stroke(); }
  g.fillStyle = red; g.fillRect(0, deck, W, 22); g.fillStyle = "#9a2a1a"; g.fillRect(0, deck + 22, W, 8);
};
/** a playmat 1200 x 700 (= 60 x 35 cm) with real cards laid out: his line starts with the Caterpie */
export const playmat = (p: Pen, cards: string[], col: string) => {
  const g = p.g; rrect(g, 0, 0, 1200, 700, 40, col); g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 6;
  for (let i = 0; i < 6; i++) g.strokeRect(40 + i * 190, 400, 160, 224); g.strokeRect(500, 80, 200, 280);
  cards.forEach((c, i) => scan(g, c, i === 0 ? 500 : 40 + (i - 1) * 190, i === 0 ? 80 : 400, i === 0 ? 200 : 160, i === 0 ? 280 : 224));
};
export const tableNo = (p: Pen) => { const g = p.g; rrect(g, 0, 0, 200, 140, 14, "#ffffff", INK, 6); lt(g, "12", 100, 74, 90, "#2f5fd0", 900, "center"); };
