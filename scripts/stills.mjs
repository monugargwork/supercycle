// usage: node scripts/stills.mjs <outPrefix> <frame,frame,...> [dpr]   (bundles once; silent; software GL here, ANGLE/GPU on a PC)
import fs from "node:fs";
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [prefix, frames, dpr = "0.5"] = process.argv.slice(2);
const chromiumOptions = { gl: process.env.REMOTION_GL || (process.platform === "darwin" ? "angle" : "swangle") }; // Mac GPU, else software
const inputProps = { audio: false, post: { dpr: Number(dpr), ...JSON.parse(process.env.POST || "{}") } }; // POST='{"lens":false}' switches post passes off (A/B tests)
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "PsaReel", chromiumOptions, inputProps });
const onBrowserLog = (l) => { if (l.type === "error" || l.type === "warning") console.log(`[${l.type}]`, l.text.slice(0, 400)); };
// frames: "120,640" or with "every:60" (0, 60, … up to the last frame), e.g. "every:60,333,1501"; sorted, no repeats
const list = [...new Set(frames.split(",").flatMap((t) => {
  if (!t.startsWith("every:")) return [Number(t)];
  const step = Number(t.slice(6)), last = composition.durationInFrames - 1, out = [];
  for (let f = 0; f <= last; f += step) out.push(f);
  return out;
}))].sort((a, b) => a - b);
fs.writeFileSync(`${prefix}frames.txt`, list.join("\n") + "\n");
for (const f of list) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: `${prefix}${f}.jpg`, imageFormat: "jpeg", jpegQuality: 88, scale: 1,
    chromiumOptions, inputProps, timeoutInMilliseconds: 300000, onBrowserLog });
  console.log("still", f, ((Date.now() - t0) / 1000).toFixed(1) + "s");
}
