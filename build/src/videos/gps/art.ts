// 2D drawings for the PSA reel: graded slabs with our own creature art, the news props (calendar page, count-up
// numbers, the stolen-items list, money), stamps (red X, green check), envelopes, alarm, shards, the dossier and the
// journey icons. All drawn with the Pen (plum ink, flat fills) so they sit with the cast. Text is numbers only, so the
// picture works with the Vietnamese voice.
import { Pen, INK, shade, mix } from "./toon";

type P2 = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
export const rr = (x0: number, y0: number, x1: number, y1: number, r: number, n = 8): P2[] => {
  const pts: P2[] = [];
  for (const [cx, cy, a] of [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]])
    for (let i = 0; i <= n; i++) pts.push([cx + r * Math.cos(rad(a + (90 * i) / n)), cy + r * Math.sin(rad(a + (90 * i) / n))]);
  return pts;
};
const star = (cx: number, cy: number, r0: number, r1: number, n = 5, rot = -90): P2[] => {
  const pts: P2[] = [];
  for (let k = 0; k < n * 2; k++) { const r = k % 2 ? r1 : r0, a = rad(rot + (k * 180) / n); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return pts;
};
export const text = (p: Pen, s: string, x: number, y: number, size: number, fill: string, stroke = INK, sw = 0, weight = 900, align: CanvasTextAlign = "center") => {
  const g = p.g;
  g.font = `${weight} ${size}px "Arial Black", Arial, sans-serif`; g.textAlign = align; g.textBaseline = "middle"; g.lineJoin = "round";
  if (sw) { g.lineWidth = sw; g.strokeStyle = stroke; g.strokeText(s, x, y); }
  g.fillStyle = fill; g.fillText(s, x, y);
};

// ---------------- our own creatures (card art) ----------------
export type Kind = 0 | 1 | 2 | 3 | 4;
/** number of slab looks (slab1..slab5 images when present) */
export const NSLAB = 5;
const CRE = [
  { bg: ["#ffd27a", "#ff8a3c"], body: "#ff7b2e", belly: "#ffe1b0" }, // ember fox
  { bg: ["#bfe7ff", "#4fa3e8"], body: "#5ab0f0", belly: "#e3f5ff" }, // cloud fish
  { bg: ["#d9f5b0", "#6fbf4a"], body: "#7cc95a", belly: "#f1ffd8" }, // sprout bun
  { bg: ["#ffd0ee", "#b46fd8"], body: "#c17ee6", belly: "#fbe8ff" }, // star moth
];
/** creature portrait inside (x0, y0, x1, y1) */
export const creature = (p: Pen, k: Kind, x0: number, y0: number, x1: number, y1: number) => {
  const c = CRE[k % 4], w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = y0 + h * 0.58, s = Math.min(w, h) / 100, g = p.g;
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c.bg[0]); gr.addColorStop(1, c.bg[1]);
  p.clip(rr(x0, y0, x1, y1, 2), () => {
    g.fillStyle = gr; g.fillRect(x0, y0, w, h);
    for (let i = 0; i < 6; i++) p.ell(x0 + w * ((i * 37) % 100) / 100, y0 + h * ((i * 53) % 100) / 100, 6 * s, 6 * s, "rgba(255,255,255,0.35)", 0);
    if (k === 0) { // ember fox: flame tail, pointy ears
      p.poly([[cx + 18 * s, cy + 10 * s], [cx + 42 * s, cy - 6 * s], [cx + 36 * s, cy - 34 * s], [cx + 46 * s, cy - 22 * s], [cx + 48 * s, cy + 6 * s], [cx + 28 * s, cy + 22 * s]], "#ffcf3a", 2.4 * s);
      for (const sd of [-1, 1]) p.poly([[cx + sd * 10 * s, cy - 20 * s], [cx + sd * 22 * s, cy - 42 * s], [cx + sd * 26 * s, cy - 14 * s]], c.body, 2.4 * s);
    } else if (k === 1) { // cloud fish: fins
      p.poly([[cx - 26 * s, cy], [cx - 46 * s, cy - 16 * s], [cx - 42 * s, cy + 16 * s]], shade(c.body, 0.85), 2.4 * s);
      p.ell(cx + 4 * s, cy - 26 * s, 9 * s, 6 * s, shade(c.body, 0.9), 2.4 * s);
    } else if (k === 2) { // sprout bun: leaf on top
      p.stroke([[cx, cy - 22 * s], [cx + 2 * s, cy - 34 * s]], 2.4 * s, "#3c7a2a");
      p.ell(cx + 10 * s, cy - 38 * s, 12 * s, 6 * s, "#4fae3a", 2.4 * s, 0, 360, -25);
    } else { // star moth: wings
      for (const sd of [-1, 1]) p.ell(cx + sd * 26 * s, cy - 8 * s, 18 * s, 22 * s, "#ffe38a", 2.4 * s, 0, 360, sd * 20);
    }
    p.ell(cx, cy, 24 * s, 21 * s, c.body, 2.6 * s);
    p.ell(cx, cy + 7 * s, 13 * s, 10 * s, c.belly, 0);
    for (const sd of [-1, 1]) { p.ell(cx + sd * 9 * s, cy - 5 * s, 4.2 * s, 5.4 * s, INK, 0); p.dot(cx + sd * 9 * s - s, cy - 7 * s, 1.4 * s, "#ffffff"); }
    p.arc(cx, cy + 2 * s, 5 * s, 3.5 * s, 20, 160, 1.8 * s);
  });
};

/** trading card (no slab): yellow border, art window, text lines */
/** bare card cut out of slab2's image (public/psa/cards/card2.png), used after the case is smashed */
export const CARD_IMG: { card2: HTMLImageElement | null } = { card2: null };
export const card = (p: Pen, k: Kind, x0: number, y0: number, x1: number, y1: number) => {
  const w = x1 - x0, h = y1 - y0, s = w / 100;
  if (k === 1 && CARD_IMG.card2) {
    const im = CARD_IMG.card2, r = Math.min(w / im.width, h / im.height);
    p.g.drawImage(im, x0 + (w - im.width * r) / 2, y0 + (h - im.height * r) / 2, im.width * r, im.height * r);
    return;
  }
  p.poly(rr(x0, y0, x1, y1, 5 * s), "#ffd23f", 2.2 * s);
  p.poly(rr(x0 + 6 * s, y0 + 6 * s, x1 - 6 * s, y1 - 6 * s, 3 * s), "#f6f1e3", 0);
  creature(p, k, x0 + 9 * s, y0 + 14 * s, x1 - 9 * s, y0 + h * 0.56);
  p.poly(rr(x0 + 9 * s, y0 + 14 * s, x1 - 9 * s, y0 + h * 0.56, 2 * s), null, 1.6 * s);
  p.stroke([[x0 + 10 * s, y0 + 9 * s], [x0 + 50 * s, y0 + 9 * s]], 2.4 * s, "#6a6050");
  for (let i = 0; i < 3; i++) p.stroke([[x0 + 12 * s, y0 + h * (0.64 + i * 0.09)], [x1 - (14 + i * 9) * s, y0 + h * (0.64 + i * 0.09)]], 2 * s, "#a39a88");
};

/** graded slab on a W x H canvas (aspect ~0.62): clear case, red-bordered label (grade + cert number), card inside.
 *  glow = highlight on the cert number; voidK = red strike over the label (cancelled) */
/** optional real slab / card photos (public/psa/cards/slab1..4.png|jpg), loaded by Reel.tsx; used as-is when present */
export const SLAB_IMG: (HTMLImageElement | null)[] = [null, null, null, null, null];
const barcode = (p: Pen, x: number, y: number, w: number, h: number) => {
  const g = p.g; g.fillStyle = "#1d1a22";
  for (let i = 0, xx = x; xx < x + w; i++) { const bw = ((i * 7) % 3 + 1) * (w / 90); if (i % 2 === 0) g.fillRect(xx, y, bw, h); xx += bw + w / 120; }
};
/** graded slab on a W x H canvas (aspect ~0.62), laid out like a real graded slab: clear case with a raised frame, a
 *  red-bordered label (set / card lines on the left, grade word + big number on the right, cert number + barcode),
 *  the card in its inner well. glow = highlight on the cert number; voidK = red strike over the label (cancelled) */
export const slab = (p: Pen, W: number, H: number, k: Kind, o: { grade?: string; cert?: string; glow?: number; voidK?: number; noLabel?: boolean } = {}) => {
  const s = W / 100, g = p.g, x0 = 4 * s, x1 = W - 4 * s, y0 = 4 * s, y1 = H - 4 * s;
  const photo = SLAB_IMG[k];
  if (photo) { // the user's own slab image (already outlined in the art style), fitted to the card
    p.clip(rr(0, 0, W, H, 0), () => {
      const r = Math.min(W / photo.width, H / photo.height), w = photo.width * r, h = photo.height * r; // contain: never crop the case
      g.drawImage(photo, (W - w) / 2, (H - h) / 2, w, h);
    });
    if (o.glow) { // cert-number row on the supplied slab image (x .155-.35, y .192-.229 of the image)
      const r = Math.min(W / photo.width, H / photo.height), w = photo.width * r, h = photo.height * r, ox = (W - w) / 2, oy = (H - h) / 2;
      g.save(); g.globalAlpha = o.glow * 0.6; g.globalCompositeOperation = "multiply";
      p.poly(rr(ox + 0.155 * w, oy + 0.192 * h, ox + 0.35 * w, oy + 0.229 * h, 6), "#fff27a", 0); g.restore();
    }
    return;
  }
  p.poly(rr(x0, y0, x1, y1, 7 * s), "rgba(214,232,244,0.96)", 2.6 * s);
  p.poly(rr(x0 + 4 * s, y0 + 4 * s, x1 - 4 * s, y1 - 4 * s, 5 * s), "rgba(236,246,252,0.9)", 1.2 * s);
  const ly1 = y0 + 0.24 * (y1 - y0);
  if (!o.noLabel) {
    p.poly(rr(x0 + 8 * s, y0 + 8 * s, x1 - 8 * s, ly1, 2.5 * s), "#d8322f", 1.6 * s);
    p.poly(rr(x0 + 11 * s, y0 + 11 * s, x1 - 11 * s, ly1 - 3 * s, 1.5 * s), "#ffffff", 0);
    const top = y0 + 11 * s, bot = ly1 - 3 * s, L = x0 + 15 * s;
    for (let i = 0; i < 3; i++) p.stroke([[L, top + 4.5 * s + i * 4.6 * s], [L + [40, 46, 30][i] * s, top + 4.5 * s + i * 4.6 * s]], 2.2 * s, "#3a3640");
    text(p, "GEM MT", x1 - 22 * s, top + 4.5 * s, 4.6 * s, "#1d1a22", INK, 0, 900);
    text(p, o.grade ?? "10", x1 - 22 * s, top + 11.5 * s, 11 * s, "#1d1a22");
    if (o.glow) { g.save(); g.globalAlpha = o.glow; p.poly(rr(L - 2 * s, bot - 9.5 * s, L + 38 * s, bot - 2.5 * s, 1.5 * s), "#fff27a", 0); g.restore(); }
    text(p, o.cert ?? "81043392", L, bot - 6 * s, 5.4 * s, "#1d1a22", INK, 0, 700, "left");
    barcode(p, L + 40 * s, bot - 9 * s, 26 * s, 6 * s);
    if (o.voidK) { g.save(); g.globalAlpha = Math.min(1, o.voidK); p.stroke([[x0 + 9 * s, ly1 - 2 * s], [x1 - 9 * s, y0 + 10 * s]], 4 * s, "#e0262a"); g.restore(); }
  }
  // inner well around the card (raised holder ridge)
  p.poly(rr(x0 + 10 * s, ly1 + 4 * s, x1 - 10 * s, y1 - 6 * s, 4 * s), "rgba(205,224,238,0.9)", 1.4 * s);
  card(p, k, x0 + 14 * s, ly1 + 8 * s, x1 - 14 * s, y1 - 10 * s);
  g.save(); g.globalAlpha = 0.28; p.poly([[x0 + 12 * s, y1 - 12 * s], [x0 + 30 * s, y1 - 12 * s], [x1 - 12 * s, y0 + 40 * s], [x1 - 12 * s, y0 + 24 * s]], "#ffffff", 0); g.restore();
};

/** the label piece alone (pops off when the case is cracked) */
export const label = (p: Pen, W: number, H: number) => {
  const s = W / 100;
  p.poly(rr(3 * s, 3 * s, W - 3 * s, H - 3 * s, 4 * s), "#d8322f", 2 * s);
  p.poly(rr(7 * s, 7 * s, W - 7 * s, H - 7 * s, 2 * s), "#ffffff", 0);
  for (let i = 0; i < 2; i++) p.stroke([[12 * s, H * 0.38 + i * 9 * s], [(i ? 44 : 56) * s, H * 0.38 + i * 9 * s]], 3 * s, "#3a3640");
  text(p, "10", W - 20 * s, H / 2, 22 * s, "#1d1a22");
};

/** broken case shards (t: 0..1 flying out) on 600 x 600 */
export const shards = (p: Pen, t: number) => {
  for (let i = 0; i < 9; i++) {
    const a = rad(-160 + i * 20 + (i % 2) * 7), d = 60 + 220 * t, x = 300 + d * Math.cos(a), y = 330 + d * Math.sin(a) + 200 * t * t;
    const r = 26 - 1.5 * i, rot = rad(i * 40 + 300 * t);
    p.poly([0, 1, 2].map((k) => [x + r * Math.cos(rot + k * 2.1), y + r * 0.8 * Math.sin(rot + k * 2.1)] as P2), "rgba(220,238,250,0.95)", 5);
  }
};

// ---------------- news props ----------------
/** tear-off calendar page: month on a red band, big day number (Vietnamese order) on 500 x 560 */
export const calendar = (p: Pen) => {
  p.poly(rr(20, 40, 480, 540, 34), "#fbf7ee", 12);
  p.clip(rr(20, 40, 480, 540, 34), () => p.poly(rr(10, 30, 490, 190, 0), "#e2433b", 0));
  p.stroke([[20, 190], [480, 190]], 10);
  for (const x of [130, 370]) { p.ell(x, 46, 18, 34, "#c9ccd2", 9); }
  text(p, "THÁNG 10", 250, 118, 76, "#ffffff");
  text(p, "13", 250, 370, 250, "#2b2733");
};

/** count-up number on a burst plate; v = shown value (formatted by caller) */
export const bigNumber = (p: Pen, W: number, H: number, s: string, col = "#ffd23a", plate = "#e2433b") => {
  const pts = star(W / 2, H / 2, H * 0.48, H * 0.36, 14, -90).map(([x, y]) => [W / 2 + (x - W / 2) * (W / H) * 0.9, y] as P2);
  p.poly(pts, plate, 12);
  const size = Math.min(H * 0.42, (W * 1.25) / Math.max(3, s.length));
  text(p, s, W / 2, H / 2 + 4, size, col, INK, size * 0.16);
};

/** long printed list (the stolen items) on 400 x 1200: rows of numbers; n rows visible from the top (unrolling) */
export const listScroll = (p: Pen, rows = 22) => {
  p.poly(rr(20, 10, 380, 1190, 12), "#fffdf5", 10);
  for (let i = 0; i < rows; i++) {
    const y = 70 + i * 50;
    p.ell(56, y, 9, 9, i % 3 ? "#d8322f" : "#f08a3c", 3);
    p.stroke([[84, y], [84 + 140 + ((i * 47) % 90), y]], 9, "#6b6774");
    p.stroke([[270, y], [350, y]], 9, "#b4b0bc");
  }
};

/** cash stack / money bag on 400 x 400 */
export const moneyBag = (p: Pen) => {
  p.ell(200, 250, 140, 130, "#c9a35a", 12);
  p.poly([[150, 130], [250, 130], [280, 70], [120, 70]], "#c9a35a", 12);
  p.stroke([[140, 135], [260, 135]], 18, "#8a6a32");
  text(p, "$", 200, 262, 170, "#3d7a3a", INK, 14);
};

// ---------------- stamps & signs ----------------
/** cert numbers on the database monitor: the real slabs first (Charizard, Lugia, Babe Ruth, Smaug), then fillers */
export const CERTS = ["81043392", "27967506", "02043875", "179183951", "88353809", "95664226", "29746430", "10285060", "17595477"];

/** "not this": a bold prohibition sign (ring + slash) with an inner white rim, ink outline and a darker lower lip
 *  for thickness. k = 0..1 draws the slash across; on S x S */
export const noSign = (p: Pen, S: number, k = 1) => {
  const c = S / 2, R = S * 0.42, w = S * 0.11, g = p.g;
  p.ell(c, c + S * 0.025, R + w / 2 + S * 0.02, R + w / 2 + S * 0.02, "#7d1012", 0); // lip
  p.ell(c, c, R + w / 2 + S * 0.02, R + w / 2 + S * 0.02, INK, 0);
  p.ell(c, c, R + w / 2, R + w / 2, "#e3262a", 0);
  p.ell(c, c, R - w / 2, R - w / 2, null, S * 0.022, 0, 360);
  g.save(); g.globalCompositeOperation = "destination-out"; p.ell(c, c, R - w / 2 - S * 0.008, R - w / 2 - S * 0.008, "#000", 0); g.restore();
  p.arc(c, c, R - w * 0.2, R - w * 0.2, 200, 250, S * 0.018, "rgba(255,255,255,0.75)");
  const a = Math.PI / 4, L = (R - w / 4) * k, x0 = c - Math.cos(a) * (R - w / 4), y0 = c - Math.sin(a) * (R - w / 4);
  const x1 = x0 + Math.cos(a) * 2 * L, y1 = y0 + Math.sin(a) * 2 * L;
  if (k > 0) { p.stroke([[x0, y0], [x1, y1]], w + S * 0.04, INK); p.stroke([[x0, y0], [x1, y1]], w, "#e3262a"); p.stroke([[x0 + S * 0.01, y0 - S * 0.012], [x1 + S * 0.01, y1 - S * 0.012]], S * 0.015, "rgba(255,255,255,0.6)"); }
};
/** scanner laser: a red fan from the scanner (right end) to a vertical line on the slab (left end), on 800 x 240.
 *  u = sweep 0..1 (the line moves top to bottom) */
export const laser = (p: Pen, u: number) => {
  const g = p.g, ly = 30 + 180 * u;
  const gr = g.createLinearGradient(780, 0, 20, 0); gr.addColorStop(0, "rgba(255,40,40,0.95)"); gr.addColorStop(1, "rgba(255,70,70,0.45)");
  g.fillStyle = gr; g.beginPath(); g.moveTo(780, 112); g.lineTo(780, 128); g.lineTo(20, ly + 30); g.lineTo(20, ly - 30); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,90,90,0.95)"; g.fillRect(10, ly - 4, 26, 8);
  g.fillStyle = "rgba(255,230,230,1)"; g.fillRect(14, ly - 1.5, 18, 3);
};
export const redX = (p: Pen, S: number, k = 1) => {
  const a = S * 0.14, b = S * 0.86, e = (u: number) => a + (b - a) * u;
  for (const [p0, p1] of [[[a, a], [e(k), e(k)]], [[b, a], [b - (b - a) * k, e(k)]]] as [P2, P2][]) {
    p.stroke([p0, p1], S * 0.2, "#ffffff"); p.stroke([p0, p1], S * 0.15, "#e0262a");
  }
};
export const check = (p: Pen, S: number) => {
  p.ell(S / 2, S / 2, S * 0.46, S * 0.46, "#38b65c", S * 0.035);
  p.stroke([[S * 0.27, S * 0.52], [S * 0.43, S * 0.68], [S * 0.74, S * 0.34]], S * 0.1, "#ffffff");
};
/** envelope with motion ticks on 400 x 300 */
export const envelope = (p: Pen) => {
  p.poly(rr(70, 60, 360, 250, 14), "#fbf7ee", 10);
  p.poly([[74, 66], [215, 170], [356, 66]], null, 9);
  p.ell(215, 190, 22, 22, "#d8322f", 6);
  for (let i = 0; i < 3; i++) p.stroke([[10, 110 + i * 45], [50 - i * 8, 110 + i * 45]], 10);
};
export const exclaim = (p: Pen) => {
  p.poly(star(150, 150, 140, 100, 12, -90), "#ffd23a", 10);
  p.poly(rr(132, 60, 168, 175, 16), "#e0262a", 7);
  p.ell(150, 215, 22, 22, "#e0262a", 7);
};
export const sparkle = (p: Pen, t: number) => {
  for (let i = 0; i < 5; i++) {
    const a = rad(i * 72 + 30), d = 60 + 110 * t, r = 34 * (1 - t) + 4;
    p.poly(star(200 + d * Math.cos(a), 200 + d * Math.sin(a), r, r * 0.35, 4, 0), "#fff3a0", 5);
  }
  p.poly(star(200, 200, 90 * (1 - t) + 8, 26 * (1 - t) + 3, 4, 45 * t), "#ffffff", 6);
};
export const poof = (p: Pen, t: number) => {
  for (let i = 0; i < 7; i++) {
    const a = rad(i * 51), d = 30 + 120 * t, r = (50 + 15 * (i % 2)) * (1 - 0.7 * t);
    p.ell(200 + d * Math.cos(a), 200 + d * Math.sin(a), r, r * 0.85, `rgba(255,255,255,${(1 - t).toFixed(3)})`, 0);
  }
};
/** buzzing fly over the empty mailbox, 200 x 200 */
export const fly = (p: Pen, ph: number) => {
  for (const s of [-1, 1]) p.ell(100 + s * 26, 78 - 6 * Math.sin(ph * 20), 26, 14, "rgba(220,240,255,0.9)", 5, 0, 360, s * (20 + 20 * Math.sin(ph * 40)));
  p.ell(100, 104, 22, 18, "#2c2833", 5);
  p.dot(92, 98, 4, "#ffffff");
};
/** padlock: state 0 shut, 1 shackle popped open; broken = bent shackle, on 300 x 360 */
export const padlock = (p: Pen, open = 0, broken = false) => {
  if (broken) { p.stroke([[100, 190], [96, 120], [140, 70], [190, 86], [230, 60]], 30); p.stroke([[100, 190], [96, 120], [140, 70], [190, 86], [230, 60]], 18, "#9aa1aa"); }
  else if (open) { // shackle popped up and swung out to the side
    p.rot = [-0.6, 88, 150];
    p.arc(150, 70, 62, 74, 180, 360, 30); p.arc(150, 70, 62, 74, 180, 360, 18, "#9aa1aa");
    p.stroke([[88, 70], [88, 150]], 30); p.stroke([[88, 70], [88, 150]], 18, "#9aa1aa"); p.stroke([[212, 70], [212, 110]], 30); p.stroke([[212, 70], [212, 110]], 18, "#9aa1aa");
    p.rot = null;
  } else {
    p.arc(150, 150, 62, 74, 180, 360, 30); p.arc(150, 150, 62, 74, 180, 360, 18, "#9aa1aa");
    for (const x of [88, 212]) { p.stroke([[x, 150], [x, 192]], 30); p.stroke([[x, 150], [x, 192]], 18, "#9aa1aa"); }
  }
  p.poly(rr(60, 180, 240, 340, 26), "#e3b54a", 10);
  p.ell(150, 245, 18, 18, INK, 0); p.poly([[142, 250], [158, 250], [162, 296], [138, 296]], INK, 0);
};
/** icon sign (no words) on 600 x 300: kind slab (grading), laptop (marketplace), gavel (auction) */
export const iconSign = (p: Pen, kind: "slab" | "laptop" | "gavel", bg: string) => {
  p.poly(rr(10, 10, 590, 290, 30), bg, 12);
  if (kind === "slab") {
    p.poly(rr(230, 40, 370, 260, 14), "#e6f2fa", 9); p.poly(rr(245, 55, 355, 95, 6), "#d8322f", 6);
    p.poly(rr(258, 110, 342, 245, 6), "#ffd23f", 6);
    for (const x of [130, 470]) p.poly(star(x, 150, 60, 26, 5), "#ffd23a", 8);
  } else if (kind === "laptop") {
    p.poly(rr(190, 60, 410, 200, 10), "#3a3f4e", 9); p.poly(rr(205, 75, 395, 185, 4), "#7fc4ff", 0);
    p.poly([[160, 205], [440, 205], [470, 245], [130, 245]], "#9aa1aa", 9);
    p.poly([[255, 110], [345, 110], [332, 150], [268, 150]], "#ffd23a", 6); p.dot(275, 165, 8); p.dot(325, 165, 8);
  } else {
    p.band([[220, 230], [360, 110]], "#8a5a34", 26, 7, "round");
    p.poly([[300, 60], [400, 160], [370, 190], [270, 90]], "#a8744a", 9);
    p.poly(rr(170, 230, 330, 262, 8), "#7a4f33", 8);
  }
};
/** database monitor on 1200 x 680: rows of cert numbers; red(i) 0..1 turns row i cancelled; hi = highlighted row */
export const monitor = (p: Pen, red: (i: number) => number, hi = -1, hiK = 0) => {
  // laid out for the canvas it is given: the office screen is portrait-ish (560 x 700) so it fits a vertical frame
  const g = p.g, W = g.canvas.width, Hc = g.canvas.height, wide = W > 900;
  g.fillStyle = "#0f2238"; g.fillRect(0, 0, W, Hc);
  g.fillStyle = "#16314f"; g.fillRect(0, 0, W, 70);
  for (let i = 0; i < 3; i++) p.ell(40 + i * 40, 35, 11, 11, ["#ff5f57", "#febc2e", "#28c840"][i], 0);
  p.poly(rr(wide ? 420 : 165, 18, W - 30, 52, 16), "#0f2238", 0);
  const rowH = wide ? 62 : Math.min(66, (Hc - 120) / 9);
  for (let r = 0; r < 9; r++) {
    const y = 110 + r * rowH, k = Math.max(0, Math.min(1, red(r)));
    if (r === hi && hiK > 0) { g.save(); g.globalAlpha = hiK; g.fillStyle = "#fff27a"; g.fillRect(24, y - 26, W - 48, 52); g.restore(); }
    const col = mix("#28c840", "#ff3b3b", k), tc = r === hi && hiK > 0.5 ? "#1d1a22" : mix("#d6e6f5", "#ff8a8a", k);
    p.ell(wide ? 70 : 52, y, 14, 14, col, 0);
    text(p, `#${CERTS[r]}`, wide ? 120 : 84, y, wide ? 34 : 38, tc, INK, 0, 700, "left");
    if (wide) for (let c = 0; c < 3; c++) { g.fillStyle = mix("#3b5b80", "#7a3040", k); g.fillRect(520 + c * 210, y - 7, 150 - c * 25, 14); }
    else { g.fillStyle = mix("#3b5b80", "#7a3040", k); g.fillRect(W - 140, y - 7, 110, 14); }
    if (k > 0) { g.fillStyle = "#ff3b3b"; g.fillRect(wide ? 100 : 70, y - 3, (W - (wide ? 200 : 100)) * k, 6); }
  }
};
/** dossier folder with a photo, lines and a stamp, on 600 x 460 */
export const dossier = (p: Pen) => {
  p.poly(rr(20, 30, 580, 440, 20), "#e8b65a", 10);
  p.poly([[20, 60], [20, 30], [200, 30], [230, 60]], "#d9a548", 10);
  p.poly(rr(50, 80, 550, 420, 10), "#fffdf5", 8);
  p.poly(rr(80, 110, 220, 300, 8), "#cfe6f5", 6); slabMini(p, 95, 120, 110, 170);
  for (let i = 0; i < 6; i++) p.stroke([[250, 130 + i * 40], [250 + 230 - (i * 31) % 90, 130 + i * 40]], 10, "#8a8f9c");
  p.ell(150, 360, 46, 46, null, 8); p.ell(150, 360, 30, 30, "#d8322f", 5);
};
const slabMini = (p: Pen, x: number, y: number, w: number, h: number) => {
  p.poly(rr(x, y, x + w, y + h, 6), "#e6f2fa", 4); p.poly(rr(x + 8, y + 8, x + w - 8, y + 34, 3), "#d8322f", 3);
  p.poly(rr(x + 14, y + 42, x + w - 14, y + h - 10, 3), "#ffd23f", 3);
};
/** round journey badge: check (authenticated), truck (shipped), house (owner) on 300 x 300 */
export const badge = (p: Pen, kind: "check" | "truck" | "house" | "grader") => {
  p.ell(150, 150, 135, 135, kind === "check" ? "#38b65c" : kind === "truck" ? "#4f8fe0" : kind === "house" ? "#f08a3c" : "#d8322f", 11);
  p.ell(150, 150, 112, 112, "#fffaf0", 0);
  if (kind === "check") p.stroke([[90, 155], [135, 200], [215, 105]], 26, "#38b65c");
  else if (kind === "truck") {
    p.poly(rr(60, 110, 190, 200, 8), "#ffffff", 8); p.poly(rr(190, 140, 245, 200, 8), "#4f8fe0", 8);
    for (const x of [100, 210]) p.ell(x, 205, 20, 20, "#2c2833", 7);
  } else if (kind === "house") {
    p.poly([[150, 60], [240, 140], [60, 140]], "#e2433b", 9); p.poly(rr(80, 140, 220, 235, 4), "#ffe0b0", 9);
    p.poly(rr(132, 175, 168, 235, 4), "#8a5a34", 7);
  } else {
    p.poly(rr(100, 60, 200, 240, 12), "#e6f2fa", 8); p.poly(rr(112, 74, 188, 110, 5), "#d8322f", 5); p.poly(rr(118, 122, 182, 226, 5), "#ffd23f", 5);
  }
};
/** dotted travel line between badges, grows with k (0..1), on W x H with points in canvas units */
export const trail = (p: Pen, pts: P2[], k: number) => {
  let total = 0; const segs: number[] = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); total += d; }
  let left = total * k;
  for (let i = 1; i < pts.length && left > 0; i++) {
    const d = segs[i - 1], u = Math.min(1, left / d), n = Math.floor((d * u) / 34);
    for (let j = 0; j <= n; j++) {
      const v = (j * 34) / d;
      p.ell(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * v, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * v, 9, 9, "#fffaf0", 4);
    }
    left -= d;
  }
};

// ======================= GPS-tracker reel =======================
/** the street map shared by the phone screen and the aerial (main road across at y 620, cross road up at x 180) */
export type MapMode = "live" | "pins" | "route" | "him";
const MAP_ROUTE: [number, number][] = [[540, 620], [180, 620], [180, 300], [180, 160]]; // live: along the main road, left turn up
const ROUTE_B: [number, number][] = [[90, 980], [300, 980], [300, 760], [470, 760], [470, 430], [250, 430], [250, 250]]; // shared with the route sheet
const along = (pts: [number, number][], k: number): [number, number] => {
  const L: number[] = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let r = Math.max(0, Math.min(1, k)) * tot;
  for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const u = r / L[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; } r -= L[i]; }
  return pts[pts.length - 1];
};
const pin = (p: Pen, x: number, y: number, s: number, col = "#e2433b", icon: "box" | "store" | "court" = "store") => {
  p.poly([[x, y], [x - 16 * s, y - 30 * s], [x - 22 * s, y - 50 * s], [x, y - 72 * s], [x + 22 * s, y - 50 * s], [x + 16 * s, y - 30 * s]], col, 5 * s);
  if (icon === "box") { p.poly(rr(x - 12 * s, y - 58 * s, x + 12 * s, y - 40 * s, 2 * s), "#f2c84a", 3 * s); p.poly(rr(x - 12 * s, y - 52 * s, x + 12 * s, y - 48 * s, 0), "#2f7fbf", 0); }
  else if (icon === "court") { p.poly([[x - 13 * s, y - 44 * s], [x + 13 * s, y - 44 * s], [x, y - 58 * s]], "#ffffff", 2.5 * s); for (const dx of [-8, 0, 8]) p.stroke([[x + dx * s, y - 44 * s], [x + dx * s, y - 34 * s]], 3 * s, "#ffffff"); }
  else p.ell(x, y - 50 * s, 9 * s, 9 * s, "#ffffff", 0);
};
/** phone with the map (600 x 1100). k: progress along the route; blink: LED/dot pulse on; pins: how many store pins show */
export const phoneMap = (p: Pen, mode: MapMode, k: number, blink: boolean, pins = 0, finger = -1) => {
  p.poly(rr(10, 10, 590, 1090, 70), "#1d1b22", 10);
  const g = p.g; g.save(); g.beginPath(); g.roundRect(44, 70, 512, 960, 30); g.clip();
  g.fillStyle = "#ece6d6"; g.fillRect(44, 70, 512, 960);
  for (const [x, y, rx, ry] of [[420, 200, 90, 60], [110, 860, 70, 90], [480, 960, 60, 40]] as const) p.ell(x, y, rx, ry, "#bfdca8", 0);
  p.ell(330, 330, 70, 40, "#a9d4f2", 0);
  const road = (pts: [number, number][], w: number) => { p.line(pts, "#b8b0a0", w + 8); p.line(pts, "#ffffff", w); };
  road([[40, 620], [560, 620]], 34); road([[180, 620], [180, 60]], 30); road([[440, 620], [440, 1040]], 26); road([[40, 300], [560, 300]], 22);
  road([[300, 1040], [300, 760], [560, 760]], 20); road([[40, 980], [560, 980]], 18); road([[250, 430], [470, 430], [470, 760]], 18); road([[250, 430], [250, 60]], 16);
  for (let x = 60; x < 560; x += 70) for (const y of [470, 830]) p.poly(rr(x, y, x + 40, y + 50, 4), "#d9d0bd", 0);
  if (mode === "route") { p.line(ROUTE_B, "#3d7fe0", 16); }
  if (mode === "live" || mode === "pins") { pin(p, 180, 300, 1, "#e2433b"); pin(p, 440, 840, 1, "#e2433b"); if (pins > 0) pin(p, 300, 620, 1.1, "#e2433b", "box"); if (pins > 1) pin(p, 440, 900, 1.1, "#e2433b", "box"); }
  if (mode === "route") { pin(p, 250, 250, 1.1, "#e2433b", k > 0.97 ? "box" : "store"); }
  if (mode === "him") pin(p, 470, 780, 1.1, "#5a6f8f", "court");
  // the dot
  let d: [number, number] = [540, 620];
  if (mode === "live") d = along(MAP_ROUTE, k);
  else if (mode === "pins") d = pins > 1 ? [440, 900] : pins > 0 ? [300, 620] : along([[180, 300], [180, 620], [300, 620]], k);
  else if (mode === "route") d = along(ROUTE_B, k);
  else d = along([[470, 760], [470, 620], [380, 620]], k);
  p.ell(d[0], d[1], blink ? 38 : 26, blink ? 38 : 26, "rgba(46,204,85,0.28)", 0);
  p.ell(d[0], d[1], 17, 17, "#2ecc55", 5); p.ell(d[0], d[1], 7, 7, "#ffffff", 0);
  if (finger >= 0) { const [fx, fy] = mode === "route" ? along(ROUTE_B, finger) : d; p.poly([[fx + 6, fy + 10], [fx + 40, fy + 60], [fx + 70, fy + 200], [fx + 150, fy + 230], [fx + 120, fy + 40], [fx + 30, fy - 4]], "#f5c9a0", 6); }
  g.restore();
  p.poly(rr(230, 30, 370, 52, 11), "#2b2933", 0);
};
/** the driver's route sheet on her clipboard (600 x 1100); tick1 marks the store, tick2 circles its time */
export const routeSheet = (p: Pen, tick1: number, tick2: number) => {
  p.poly(rr(20, 40, 580, 1080, 26), "#b98a52", 10);
  p.poly(rr(60, 110, 540, 1050, 8), "#fbf7ec", 6);
  p.poly(rr(220, 20, 380, 120, 18), "#9aa0aa", 8);
  text(p, "LỘ TRÌNH GIAO HÀNG", 300, 170, 34, INK, INK, 0, 900);
  const rows: [string, string][] = [["Walmart", "7:40"], ["Target", "9:10"], ["Walmart", "10:30"], ["Best Buy", "12:15"], ["Walmart", "13:50"]];
  rows.forEach(([n, t], i) => {
    const y = 250 + i * 66;
    text(p, n, 100, y, 34, "#2a2733", INK, 0, 700, "left"); text(p, t, 500, y, 34, "#2a2733", INK, 0, 700, "right");
    p.stroke([[100, y + 26], [500, y + 26]], 2, "#c9c2b0");
  });
  if (tick1 > 0) { const k = Math.min(1, tick1); p.line([[70, 250], [70 + 10 * k, 262], [70 + 26 * k, 232 - 6 * k]], "#3d7fe0", 7); }
  if (tick2 > 0) { const g = p.g; g.save(); g.strokeStyle = "#e2433b"; g.lineWidth = 6; g.beginPath(); const [cx, cy] = p.P(462, 250); g.ellipse(cx, cy, 58, 30, 0, 0, Math.PI * 2 * Math.min(1, tick2)); g.stroke(); g.restore(); }
  // the same route drawn as a little map: its line matches the phone's route (the match dissolve)
  const g = p.g; g.save(); g.beginPath(); g.rect(60, 590, 480, 460); g.clip();
  for (const pts of [[[40, 980], [560, 980]], [[300, 1040], [300, 760], [560, 760]], [[250, 430], [470, 430], [470, 760]], [[250, 430], [250, 60]]] as [number, number][][]) p.line(pts.map(([x, y]) => [x, 590 + (y - 200) * 0.55] as [number, number]), "#d8cfbb", 10);
  p.line(ROUTE_B.map(([x, y]) => [x, 590 + (y - 200) * 0.55] as [number, number]), "#3d7fe0", 9);
  g.restore();
};
/** store temperature board (512 x 256): amber digits; red and blinking once it runs hot */
export const tempBoard = (p: Pen, deg: number, on: boolean) => {
  const g = p.g; g.fillStyle = "#151319"; g.fillRect(0, 0, 512, 256);
  const hot = deg >= 104, col = hot ? (on ? "#ff3b30" : "#5a1410") : "#ffb02e";
  g.font = "900 168px Arial Black, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col;
  g.fillText(`${Math.round(deg)}°`, 256, 134);
  g.fillStyle = "rgba(255,255,255,0.05)"; for (let y = 0; y < 256; y += 8) g.fillRect(0, y, 512, 3);
};
/** wall clock face (256): minutes since midnight */
export const clockFace = (p: Pen, minutes: number) => {
  const g = p.g; g.fillStyle = "#fbf7ec"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; p.stroke([[128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100], [128 + Math.sin(a) * 116, 128 - Math.cos(a) * 116]], i % 3 ? 4 : 8, INK); }
  const am = (minutes / 60) * Math.PI * 2, ah = (minutes / 720) * Math.PI * 2;
  p.stroke([[128, 128], [128 + Math.sin(ah) * 60, 128 - Math.cos(ah) * 60]], 10, INK); p.stroke([[128, 128], [128 + Math.sin(am) * 92, 128 - Math.cos(am) * 92]], 6, INK);
  p.ell(128, 128, 8, 8, "#d8322f", 0);
};
/** clear evidence bag with the tracker inside (300 x 380) */
export const evidenceBag = (p: Pen, led: boolean) => {
  p.poly(rr(20, 30, 280, 360, 14), "rgba(225,240,250,0.55)", 6);
  p.poly(rr(20, 30, 280, 64, 6), "#e2433b", 5); text(p, "EVIDENCE", 150, 48, 28, "#ffffff", INK, 0, 900);
  p.poly(rr(70, 170, 230, 250, 12), "#1f1d24", 6); p.ell(196, 210, 10, 10, led ? "#5dff7a" : "#1d4a28", 0);
};
/** the ankle monitor (360 x 220): strap closes with k (0 open .. 1 shut), the box's LED blinks once it is on */
export const ankleMonitor = (p: Pen, k: number, led: boolean) => {
  const open = 1 - Math.min(1, k);
  p.line([[60, 120 - 50 * open], [100, 150], [180, 162], [260, 150], [300, 120 - 50 * open]], "#2a2733", 34);
  p.poly(rr(120, 70, 240, 170, 16), "#1f1d24", 7); p.poly(rr(132, 82, 228, 98, 4), "#3a3742", 0);
  p.ell(214, 140, 10, 10, led ? "#5dff7a" : "#1d4a28", 0);
  if (led) p.ell(214, 140, 22, 22, "rgba(93,255,122,0.35)", 0);
};
/** a judgment sheet (400 x 520) with optional red stamps */
export const judgment = (p: Pen, s1: number, s2: number) => {
  p.poly(rr(10, 10, 390, 510, 8), "#fbf7ec", 6);
  text(p, "PHÁN QUYẾT", 200, 60, 40, INK, INK, 0, 900);
  for (let i = 0; i < 8; i++) p.stroke([[50, 110 + i * 34], [350 - (i % 3) * 40, 110 + i * 34]], 6, "#c9c2b0");
  const stamp = (y: number, txt: string, k: number, rot: number) => {
    if (k <= 0) return; const g = p.g; g.save(); const [cx, cy] = p.P(200, y); g.translate(cx, cy); g.rotate(rot); const s = 1 + 0.25 * (1 - Math.min(1, k));
    g.scale(s, s); g.strokeStyle = "#d8322f"; g.lineWidth = 7; g.strokeRect(-160, -34, 320, 68);
    g.fillStyle = "#d8322f"; g.font = "900 38px Arial Black, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 2); g.restore();
  };
  stamp(300, "QUẢN CHẾ 1 NĂM", s1, -0.08); stamp(420, "CẤM LIÊN LẠC", s2, 0.06);
};
/** a dollar bill (240 x 110), a ballpoint pen (240 x 40) */
export const bill = (p: Pen) => { p.poly(rr(6, 6, 234, 104, 8), "#8fd18a", 5); p.ell(120, 55, 30, 30, "#5aa55a", 4); text(p, "100", 40, 30, 22, "#2f6a2f", INK, 0, 900); };
export const pen = (p: Pen) => { p.poly(rr(10, 12, 200, 28, 8), "#2f6fc4", 4); p.poly([[200, 12], [232, 20], [200, 28]], "#d9d1c3", 4); p.poly(rr(40, 6, 110, 14, 3), "#c9ccd2", 3); };
/** green glow around the tracker when seen from far (aerial): a soft disc */
export const glow = (p: Pen, col = "93,255,122") => { const g = p.g, gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, `rgba(${col},0.95)`); gr.addColorStop(0.35, `rgba(${col},0.45)`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); };
