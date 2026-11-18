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
// One map of the town in WORLD metres (x right, z down = map "up" is world -z, like the top-down aerial cameras). The phone
// screens, the driver's route sheet and the final town map all draw from it, so every map agrees with the 3D street:
// main road along z 0 (12 m), the cross road down at x -70 (the aerial left turn), the Walmart from the hook at x -19..31.
type W2 = [number, number];
export type MapT = { cx: number; cz: number; s: number; ax: number; ay: number }; // world (cx, cz) lands at canvas (ax, ay), s px per metre
const toC = (t: MapT, x: number, z: number): W2 => [t.ax + (x - t.cx) * t.s, t.ay + (z - t.cz) * t.s];
const ROADS: { pts: W2[]; w: number }[] = [
  { pts: [[-600, 0], [600, 0]], w: 12 }, { pts: [[-70, 0], [-70, 600]], w: 12 },
  { pts: [[-600, 150], [600, 150]], w: 9 }, { pts: [[60, -600], [60, 600]], w: 9 }, { pts: [[-600, -120], [600, -120]], w: 9 },
  { pts: [[-220, -600], [-220, 600]], w: 9 }, { pts: [[-150, 150], [-150, 600]], w: 6 }, { pts: [[-220, 60], [-70, 60]], w: 6 },
  { pts: [[60, 80], [400, 80]], w: 6 }, { pts: [[-600, 300], [600, 300]], w: 9 }, { pts: [[200, -600], [200, 600]], w: 6 },
];
// real footprints from the street set (sets.ts) + the stores on her route
const SIDEWALK: [number, number, number, number][] = [[-600, -11, 600, -6], [-600, 6, 600, 11], [-81, 11, -76, 600], [-64, 11, -59, 600]];
const BUILT: [number, number, number, number, string][] = [
  [-19, 13.5, 31, 48, "#d3dbe6"], [-16, -25, -4, -13, "#f1d2b4"], [2, -25, 16, -13, "#e8dcc4"],          // the Walmart, the two shops across
  [-58, 84, -34, 116, "#ead0cc"], [-176, 158, -124, 196, "#d3dbe6"], [-262, 22, -228, 58, "#f0e6b8"], [72, -150, 112, -128, "#d3dbe6"],
];
export const STORES: { name: string; x: number; z: number; col: string }[] = [
  { name: "Walmart", x: 6, z: 30, col: "#1f63b6" }, { name: "Target", x: -46, z: 100, col: "#d8322f" },
  { name: "Walmart", x: -150, z: 177, col: "#1f63b6" }, { name: "Best Buy", x: -245, z: 40, col: "#e2b21f" }, { name: "Walmart", x: 92, z: -139, col: "#1f63b6" },
];
// her delivery route (the route sheet): Walmart 7:40, Target 9:10, Walmart 10:30, Best Buy 12:15, Walmart 13:50
export const ROUTE: W2[] = [[0, 3], [-70, 3], [-70, 100], [-70, 150], [-150, 150], [-220, 150], [-220, 40], [-220, -120], [60, -120], [60, -136]];
export const ROUTE_STOP = [0, 167, 297, 477, 933]; // metres along ROUTE where each store is
const segLens = (pts: W2[]) => { const L: number[] = []; for (let i = 1; i < pts.length; i++) L.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
/** point at distance d (metres) along a polyline */
export const alongD = (pts: W2[], d: number): W2 => {
  const L = segLens(pts); let r = Math.max(0, d);
  for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const u = r / L[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; } r -= L[i]; }
  return pts[pts.length - 1];
};
/** the polyline from 0 to distance d */
const partD = (pts: W2[], d: number): W2[] => {
  const L = segLens(pts), out: W2[] = [pts[0]]; let r = Math.max(0, d);
  for (let i = 0; i < L.length; i++) { if (r <= L[i]) { out.push(alongD(pts, d)); return out; } out.push(pts[i + 1]); r -= L[i]; }
  return out;
};
const strokeW = (g: CanvasRenderingContext2D, t: MapT, pts: W2[], w: number, col: string, cap: CanvasLineCap = "round") => {
  g.beginPath(); pts.forEach(([x, z], i) => { const [cx, cy] = toC(t, x, z); if (i) g.lineTo(cx, cy); else g.moveTo(cx, cy); });
  g.lineCap = cap; g.lineJoin = "round"; g.strokeStyle = col; g.lineWidth = w; g.stroke();
};
const rectW = (g: CanvasRenderingContext2D, t: MapT, x0: number, z0: number, x1: number, z1: number, col: string, ol = 0) => {
  const [a, b] = toC(t, x0, z0), [c, d] = toC(t, x1, z1);
  g.fillStyle = col; g.fillRect(a, b, c - a, d - b);
  if (ol) { g.strokeStyle = "rgba(90,80,60,0.35)"; g.lineWidth = ol; g.strokeRect(a, b, c - a, d - b); }
};
const nearRoad = (x0: number, z0: number, x1: number, z1: number) => ROADS.some(({ pts, w }) => {
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1], [bx, bz] = pts[i], m = w / 2 + 4;
    if (Math.max(x0, x1) > Math.min(ax, bx) - m && Math.min(x0, x1) < Math.max(ax, bx) + m && Math.max(z0, z1) > Math.min(az, bz) - m && Math.min(z0, z1) < Math.max(az, bz) + m) return true;
  }
  return false;
});
const BLOCKS: [number, number, number, number][] = (() => { // filler houses, kept out of the part of town the 3D sets show
  const out: [number, number, number, number][] = [];
  for (let x = -600; x < 600; x += 24) for (let z = -600; z < 600; z += 24) {
    const h = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
    const x0 = x + 4 + h * 4, z0 = z + 4 + ((h * 7) % 1) * 4, x1 = x0 + 10 + h * 6, z1 = z0 + 9 + ((h * 3) % 1) * 6;
    if (h < 0.18) continue;
    if (x1 > -100 && x0 < 45 && z1 > -40 && z0 < 70) continue;
    if (nearRoad(x0, z0, x1, z1) || BUILT.some(([a, b, c, d]) => x1 > a - 3 && x0 < c + 3 && z1 > b - 3 && z0 < d + 3)) continue;
    out.push([x0, z0, x1, z1]);
  }
  return out;
})();
/** the town map in the clip rect (canvas px); px of ui scale `ui` keep pins/labels readable at any zoom */
export const townMapLayer = (p: Pen, t: MapT, clip: [number, number, number, number], ui = 1, labels = true) => {
  const g = p.g; g.save(); g.beginPath(); g.rect(clip[0], clip[1], clip[2] - clip[0], clip[3] - clip[1]); g.clip();
  g.fillStyle = "#e0d8c4"; g.fillRect(clip[0], clip[1], clip[2] - clip[0], clip[3] - clip[1]);
  for (const [x0, z0, x1, z1] of [[-330, 190, -240, 280], [110, 170, 190, 290], [-200, -300, -120, -150]]) {
    const [a, b] = toC(t, x0, z0), [c, d] = toC(t, x1, z1); g.fillStyle = "#bfdca8"; g.beginPath(); g.roundRect(a, b, c - a, d - b, 14 * ui); g.fill();
  }
  { const [a, b] = toC(t, -300, -40), [c, d] = toC(t, -250, 10); g.fillStyle = "#a9d4f2"; g.beginPath(); g.ellipse((a + c) / 2, (b + d) / 2, (c - a) / 2, (d - b) / 2, 0, 0, Math.PI * 2); g.fill(); }
  for (const [x0, z0, x1, z1] of SIDEWALK) rectW(g, t, x0, z0, x1, z1, "#efe9dc");
  for (const r of BLOCKS) rectW(g, t, ...r, "#cdbfa3", Math.max(1, 1.2 * ui));
  for (const [x0, z0, x1, z1, col] of BUILT) rectW(g, t, x0, z0, x1, z1, col, Math.max(1.5, 2 * ui));
  for (const r of ROADS) strokeW(g, t, r.pts, r.w * t.s + 6 * ui, "#9c8f76", "butt");
  for (const r of ROADS) strokeW(g, t, r.pts, r.w * t.s, "#ffffff", "butt");
  if (t.s > 8) for (const r of ROADS.slice(0, 2)) { g.setLineDash([3 * t.s, 3 * t.s]); strokeW(g, t, r.pts, Math.max(1, 0.16 * t.s), "#e7c34a", "butt"); g.setLineDash([]); }
  if (labels) for (const st of STORES) { // store markers: brand dot + name
    const [cx, cy] = toC(t, st.x, st.z);
    if (cx < clip[0] - 80 || cx > clip[2] + 80 || cy < clip[1] - 80 || cy > clip[3] + 80) continue;
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(cx, cy, 15 * ui, 0, Math.PI * 2); g.fill();
    g.fillStyle = st.col; g.beginPath(); g.arc(cx, cy, 11 * ui, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(cx, cy, 4 * ui, 0, Math.PI * 2); g.fill();
    g.font = `700 ${Math.round(19 * ui)}px Arial, sans-serif`; g.textAlign = "center"; g.textBaseline = "top";
    g.lineWidth = 5 * ui; g.strokeStyle = "rgba(255,255,255,0.9)"; g.strokeText(st.name, cx, cy + 18 * ui); g.fillStyle = "#3a3542"; g.fillText(st.name, cx, cy + 18 * ui);
  }
  g.restore();
};
/** red pin dropping onto a map point (k 0..1 drop with bounce), optional chip text above it */
export const mapPin = (p: Pen, x: number, y: number, k: number, ui: number, chip = "", cards = false, xr: [number, number] = [-1e9, 1e9]) => {
  if (k <= 0) return;
  const g = p.g, drop = k < 0.6 ? (1 - k / 0.6) ** 2 * -120 * ui : -10 * ui * Math.sin(((k - 0.6) / 0.4) * Math.PI) * (1 - (k - 0.6) / 0.4), s = ui * 1.15;
  g.save(); g.globalAlpha = Math.min(1, k * 3);
  g.fillStyle = "rgba(0,0,0,0.18)"; g.beginPath(); g.ellipse(x, y, 12 * s, 5 * s, 0, 0, Math.PI * 2); g.fill();
  g.translate(x, y + drop);
  g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-8 * s, -18 * s, -24 * s, -30 * s, -24 * s, -48 * s); g.arc(0, -48 * s, 24 * s, Math.PI, 0); g.bezierCurveTo(24 * s, -30 * s, 8 * s, -18 * s, 0, 0);
  g.fillStyle = "#e2433b"; g.fill(); g.lineWidth = 4 * s; g.strokeStyle = "#7a1f1a"; g.stroke();
  if (cards) { g.fillStyle = "#ffd23f"; g.fillRect(-9 * s, -62 * s, 18 * s, 26 * s); g.strokeStyle = "#7a1f1a"; g.lineWidth = 2.5 * s; g.strokeRect(-9 * s, -62 * s, 18 * s, 26 * s); g.fillStyle = "#e2433b"; g.beginPath(); g.arc(0, -49 * s, 5 * s, 0, Math.PI * 2); g.fill(); }
  else { g.fillStyle = "#ffffff"; g.beginPath(); g.arc(0, -48 * s, 9 * s, 0, Math.PI * 2); g.fill(); }
  if (chip && k > 0.7) {
    const a = Math.min(1, (k - 0.7) / 0.3); g.globalAlpha = a; g.font = `800 ${Math.round(24 * ui)}px Arial, sans-serif`;
    const w = g.measureText(chip).width + 30 * ui, cx = Math.min(xr[1] - 12 - w / 2, Math.max(xr[0] + 12 + w / 2, x)) - x; // kept on the screen
    g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(cx - w / 2, -118 * s, w, 44 * ui, 22 * ui); g.fill();
    g.strokeStyle = "#2a2733"; g.lineWidth = 3 * ui; g.stroke(); g.fillStyle = "#2a2733"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(chip, cx, -118 * s + 22 * ui);
  }
  g.restore();
};
/** the tracker dot: green with a pulse ring on each blink */
export const mapDot = (p: Pen, x: number, y: number, blink: boolean, ui: number) => {
  const g = p.g;
  if (blink) { g.fillStyle = "rgba(46,204,85,0.28)"; g.beginPath(); g.arc(x, y, 34 * ui, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x, y, 18 * ui, 0, Math.PI * 2); g.fill();
  g.fillStyle = blink ? "#2ee85e" : "#22b04c"; g.beginPath(); g.arc(x, y, 13 * ui, 0, Math.PI * 2); g.fill();
};
export type PovMap = {
  t: MapT; dot: W2 | null; blink: boolean; trail: number; route?: number; // trail: metres of ROUTE already driven (green history); route: metres of the blue route drawn
  pins: { d: number; k: number; chip: string; cards?: boolean }[]; time: string; tag: string; finger?: number; // finger: metres along ROUTE under his fingertip
};
const ARM_K = "#5a4733", BODY_K = "#8a6a4a"; // his stick arm (jacket mixed with ink, as on his card) and cardigan
/** POV: his own phone held up in front of him (720 x 1280 canvas, 2000 px per metre; phone 0.82 scale at (114, 243)). We look
 *  past the phone at nothing but the screen side, the only side a held screen is seen from. He is a stick figure: his arms are
 *  two plain lines that end on the phone's edges (no hands, no fingers), his round cardigan body soft below. */
export const PHONE_O = { x: 114, y: 243, s: 0.82 };
export const SCREEN: [number, number, number, number] = [PHONE_O.x + 44 * PHONE_O.s, PHONE_O.y + 70 * PHONE_O.s, PHONE_O.x + 556 * PHONE_O.s, PHONE_O.y + 1030 * PHONE_O.s];
const stickArm = (p: Pen, pts: P2[]) => { const ol = p.ol; p.ol = 5; p.line(pts, ARM_K, 30); p.ol = ol; };
export const povPhone = (p: Pen, m: PovMap) => {
  const g = p.g, O = PHONE_O;
  // below: the rug, and his round cardigan body with its buttons, out of focus
  g.save(); g.filter = "blur(8px)";
  g.fillStyle = "#b8483e"; g.fillRect(-20, -20, 760, 1320);
  g.fillStyle = BODY_K; g.beginPath(); g.ellipse(360, 520, 470, 820, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#6e5236"; for (const y of [160, 420, 680, 940]) { g.beginPath(); g.arc(360, y, 16, 0, Math.PI * 2); g.fill(); }
  g.filter = "none"; g.restore();
  const right = m.finger === undefined;
  // left arm (and the right one when it isn't pointing) come up from below and end on the phone's sides
  stickArm(p, [[40, 1330], [70, 1120], [O.x + 8, 900]]);
  if (right) stickArm(p, [[680, 1330], [650, 1120], [O.x + 590 * O.s - 8, 900]]);
  // the phone
  g.save(); g.translate(O.x, O.y); g.scale(O.s, O.s);
  p.poly(rr(10, 10, 590, 1090, 70), "#1d1b22", 10);
  g.restore();
  const [s0, s1, s2, s3] = SCREEN;
  g.save(); g.beginPath(); g.roundRect(s0, s1, s2 - s0, s3 - s1, 26); g.clip();
  townMapLayer(p, m.t, [s0, s1, s2, s3], 1);
  if (m.route !== undefined) strokeW(g, m.t, partD(ROUTE, m.route), 12, "#3d7fe0");
  if (m.trail > 0) { strokeW(g, m.t, partD(ROUTE, m.trail), 13, "rgba(255,255,255,0.9)"); strokeW(g, m.t, partD(ROUTE, m.trail), 7, "#2ecc55"); }
  for (const pn of m.pins) { const [x, z] = alongD(ROUTE, pn.d), [cx, cy] = toC(m.t, x, z); mapPin(p, cx, cy, pn.k, 1, pn.chip, pn.cards, [s0, s2]); }
  if (m.dot) { const [cx, cy] = toC(m.t, m.dot[0], m.dot[1]); mapDot(p, cx, cy, m.blink, 1); }
  // status bar + app tag
  g.fillStyle = "rgba(255,255,255,0.92)"; g.fillRect(s0, s1, s2 - s0, 46);
  g.font = "800 26px Arial, sans-serif"; g.textBaseline = "middle"; g.textAlign = "left"; g.fillStyle = "#1d1b22"; g.fillText(m.time, s0 + 26, s1 + 24);
  g.fillRect(s2 - 70, s1 + 15, 40, 18); g.fillRect(s2 - 29, s1 + 20, 4, 8);
  for (let i = 0; i < 4; i++) g.fillRect(s2 - 128 + i * 11, s1 + 33 - i * 5, 7, 5 + i * 5);
  g.font = "800 24px Arial, sans-serif"; const tw = g.measureText(m.tag).width + 58;
  const ty = s3 - 70;
  g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(s0 + 18, ty, tw, 44, 22); g.fill(); g.strokeStyle = "#2a2733"; g.lineWidth = 3; g.stroke();
  g.fillStyle = m.blink ? "#2ee85e" : "#22b04c"; g.beginPath(); g.arc(s0 + 42, ty + 22, 9, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#2a2733"; g.textAlign = "left"; g.fillText(m.tag, s0 + 60, ty + 23);
  g.restore();
  g.save(); g.translate(O.x, O.y); g.scale(O.s, O.s); p.poly(rr(230, 30, 370, 52, 11), "#2b2933", 0); g.restore();
  if (!right) { // his right arm reaches in and its tip traces her route on the screen
    const [x, z] = alongD(ROUTE, m.finger!), [fx, fy] = toC(m.t, x, z);
    stickArm(p, [[fx + 230, 1330], [fx + 120, 1080], [fx, fy + 6]]);
  }
};
/** full-bleed town map (720 x 1280) for the last shot: the town seen from the crane, now a map; the dot is him */
export const townMapFull = (p: Pen, t: MapT, dot: W2, blink: boolean) => {
  townMapLayer(p, t, [0, 0, 720, 1280], 1.4);
  const [cx, cy] = toC(t, dot[0], dot[1]); mapDot(p, cx, cy, blink, 1.4);
};
/** the driver's route sheet on her clipboard (600 x 1100); tick1 marks the store, tick2 circles its time.
 *  The little map is the same town map at the same place on the card as on his phone (POV canvas - (60, 90)), so the line matches */
export const ROUTE_T: MapT = { cx: -80, cz: 8, s: 1.3, ax: 340, ay: 790 }; // in POV canvas px
export const routeSheet = (p: Pen, tick1: number, tick2: number) => {
  p.poly(rr(20, 40, 580, 1080, 26), "#b98a52", 10);
  p.poly(rr(60, 110, 540, 1050, 8), "#fbf7ec", 6);
  p.poly(rr(220, 20, 380, 120, 18), "#9aa0aa", 8);
  text(p, "LỘ TRÌNH GIAO HÀNG", 300, 160, 32, INK, INK, 0, 900);
  const rows: [string, string][] = [["Walmart", "7:40"], ["Target", "9:10"], ["Walmart", "10:30"], ["Best Buy", "12:15"], ["Walmart", "13:50"]];
  rows.forEach(([n, t], i) => {
    const y = 222 + i * 54;
    text(p, n, 104, y, 30, "#2a2733", INK, 0, 700, "left"); text(p, t, 500, y, 30, "#2a2733", INK, 0, 700, "right");
    p.stroke([[100, y + 22], [500, y + 22]], 2, "#c9c2b0");
  });
  if (tick1 > 0) { const k = Math.min(1, tick1); p.line([[72, 276], [72 + 10 * k, 288], [72 + 26 * k, 258 - 6 * k]], "#3d7fe0", 7); }
  if (tick2 > 0) { const g = p.g; g.save(); g.strokeStyle = "#e2433b"; g.lineWidth = 6; g.beginPath(); g.ellipse(466, 276, 54, 26, 0, 0, Math.PI * 2 * Math.min(1, tick2)); g.stroke(); g.restore(); }
  const t: MapT = { ...ROUTE_T, ax: ROUTE_T.ax - 60, ay: ROUTE_T.ay - 90 };
  const g = p.g; g.save(); g.globalAlpha = 0.85; townMapLayer(p, t, [70, 510, 530, 1040], 0.8, true); g.restore();
  strokeW(g, t, ROUTE, 10, "#3d7fe0");
  g.strokeStyle = "#8a7f6a"; g.lineWidth = 3; g.strokeRect(70, 510, 460, 530);
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
/** ankle monitor (360 x 280) clamped round a stick leg: a strap band just wider than the leg line, the box on its front.
 *  k 0..1: the two strap halves swing shut round the leg */
export const ankleMonitor = (p: Pen, k: number, led: boolean) => {
  const open = 1 - Math.min(1, k), g = p.g;
  for (const s of [-1, 1]) { // strap halves, hinged at the box
    g.save(); const [hx, hy] = p.P(180 + s * 70, 140); g.translate(hx, hy); g.rotate(s * -open * 1.1); g.translate(-hx, -hy);
    p.poly(rr(s < 0 ? 96 : 184, 112, s < 0 ? 176 : 264, 168, 10), "#2a2733", 5); g.restore();
  }
  p.poly(rr(120, 82, 240, 198, 18), "#1f1d24", 6); p.poly(rr(134, 96, 226, 112, 4), "#3a3742", 0);
  p.ell(208, 166, 10, 10, led ? "#5dff7a" : "#1d4a28", 0);
  if (led) p.ell(208, 166, 22, 22, "rgba(93,255,122,0.35)", 0);
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
