// "Attic Pokémon millions" reel (Vietnamese voice, 77.1 s) in the flat-characters-in-a-3D-toon-world style of the cartoon
// short skill. Same post chain as the bridge short; the sound mix (score, SFX, meme sounds) plays from public/attic/mix.wav.
// One three.js world (world.ts) posed per frame from the story timeline (story.ts). Post chain (look-match pass):
//   InkPass (world ink lines, own pass) -> lens blur pre + main (thin-lens DOF per shot from dofAt) ->
//   [bloom (emissive only) + NEUTRAL tone mapping + colour grade] (one merged EffectPass), MSAA 4.
// Ink runs before the DOF so lines blur with what they belong to; bloom after the DOF so glows defocus with their
// source; the grade is display-referred, so it comes after tone mapping. Every pixel-sized parameter is specified at
// 1080x1920 and scaled with the output size, so stills at --scale 0.5 and the 1440x2560 final match.
// Place changes crossfade by stacking a second canvas for the fade frames; the hook ends on a 4-frame white flash.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, continueRender, delayRender, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { Title2, Cue, TOut } from "../../enzo/lib4";
import { useBolota } from "../../enzo/fonts";
import { CAPTIONS } from "./captions";
import { L as ENZO_L } from "../../enzo/lib3";
import { PAT, GAVEL } from "./story";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { World } from "./world";
import { TCG_IMG, TCG_ALL, loadTcg } from "./art";
import { InkPass, noInkFallback } from "./ink";
import { LensBlur, GrainEffect } from "./lensblur";
import { GradeEffect, GRADES, GRADE_STRENGTH, gradeFor } from "./grade";
import { TOTAL, FLASH_AT, SHOTS, layersAt, dofAt } from "./story";

export const ATTIC_FRAMES = TOTAL;

/** A/B switches for test stills only (Remotion inputProps `{ post: { ink: false, ... } }`); everything is on by default. */
type PostToggles = { ink: boolean; lens: boolean; pre: boolean; bloom: boolean; grade: boolean; grain: boolean };
const toggles = (): PostToggles => ({ ink: true, lens: true, pre: true, bloom: true, grade: true, grain: false, ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });

/** Bloom for emissive sources only (depth.md 6.4). Its MIP chain always starts at 540x960 (half of 1080x1920),
 *  whatever the output size, so the glow keeps the same size relative to the frame (e-fold ~30 px at 1080p,
 *  ~1.5 % of the frame height) at 540, 1080 and 1440 widths. ADD blend: HDR-safe (SCREEN darkens values > 1). */
const makeBloom = () => {
  const b = new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.5, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, levels: 6, radius: 0.6 });
  const mip = b.mipmapBlurPass;
  const setSize = mip.setSize.bind(mip);
  mip.setSize = (w: number, h: number) => setSize(Math.round((1920 * w) / Math.max(h, 1)), 1920);
  return b;
};

const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

const Inner: React.FC<{ id: number }> = ({ id }) => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const world = useMemo(() => new World(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const on = useMemo(toggles, []);
  const fx = useMemo(() => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 24, nearScale: 1.2 }),
    bloom: makeBloom(),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect(GRADES.day, GRADE_STRENGTH.day),
    grain: new GrainEffect({ amount: 0.025, cellPx: 1.5 }), // film grain, OFF by default (inputProps post.grain): the reference measures no grain and it quadruples the file size
  }), [camera, scene]);
  useEffect(() => () => fx.ink.dispose(), [fx]);
  const post = useMemo(() => (
    <EffectComposer multisampling={4}>
      {on.ink ? <primitive object={fx.ink} dispose={null} /> : null}
      {on.lens && on.pre ? <primitive object={fx.lens.pre} dispose={null} /> : null}
      {on.lens ? <primitive object={fx.lens.main} dispose={null} /> : null}
      {on.bloom ? <primitive object={fx.bloom} dispose={null} /> : null}
      <primitive object={fx.tone} dispose={null} />
      {on.grade ? <primitive object={fx.grade} dispose={null} /> : null}
      {on.grain ? <primitive object={fx.grain} dispose={null} /> : null}
    </EffectComposer>
  ), [fx, on]);
  const cam = camera as THREE.PerspectiveCamera;
  target.copy(world.update(id, f, cam, scene));
  noInkFallback(world.root);
  // thin-lens focus: distance along the view axis to the shot's focus point (default: the camera's look target)
  const d = dofAt(f);
  cam.getWorldDirection(fwd);
  if (d.focus) fpt.set(...d.focus(f)); else fpt.copy(target);
  fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
  fx.lens.cInf = d.cInf;
  gradeFor(fx.grade, SHOTS[id - 1].light);
  fx.grain.seed = f; // deterministic per frame
  return (
    <>
      <primitive object={world.root} dispose={null} />
      {post}
    </>
  );
};

/** test stills only: inputProps `{ post: { dpr: 0.5 } }` forces the WebGL buffer size (R3F clamps dpr to >= 1 by default) */
const dprOverride = () => (getInputProps() as { post?: { dpr?: number } }).post?.dpr;
const ShotView: React.FC<{ id: number; alpha: number }> = ({ id, alpha }) => (
  <AbsoluteFill style={{ opacity: alpha }}>
    <ThreeCanvas width={1080} height={1920} {...(dprOverride() ? { dpr: dprOverride() } : {})} shadows gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMappingExposure: 1.0 }}
      camera={{ fov: 40, near: 0.05, far: 1500 }}>
      <Inner id={id} />
    </ThreeCanvas>
  </AbsoluteFill>
);

/** real card scans: everything that draws a card waits for these (one delayRender for the whole set) */
const useTcg = () => {
  const [ready, setReady] = useState(() => Object.keys(TCG_IMG).length >= TCG_ALL.length);
  const [h] = useState(() => (ready ? null : delayRender("tcg card scans")));
  useEffect(() => { if (!h) return; loadTcg((n) => staticFile(`attic/cards/${n}.png`)).then(() => { setReady(true); continueRender(h); }); }, [h]);
  return ready;
};
/** inputProps { audio: false } renders silent stills */
const withAudio = () => (getInputProps() as { audio?: boolean }).audio !== false;
/** Enzo house titles (Title2 from the Enzo repo: red box, Bolota Bold, glides in while typing), one block per beat.
 *  Bolota has no glyphs for some Vietnamese letters (Ị Ắ Ầ Ệ Ạ), so the words are picked from ones it can draw. */
const TITLES: { cues: Cue[]; out: TOut }[] = [
  { cues: [{ t: PAT[0] / 30, lines: ["£300"], style: 3, from: "top" }], out: { t: 128 / 30, mode: "up" } },
  { cues: [{ t: 156 / 30, lines: ["15 NĂM"], style: 1, from: "left" }], out: { t: 190 / 30, mode: "left" } },
  { cues: [{ t: 868 / 30, lines: ["15 NĂM SAU"], style: 2, from: "right" }], out: { t: 926 / 30, mode: "right" } },
  { cues: [{ t: (GAVEL - 4) / 30, lines: ["£97.500"], style: 3, from: "top" }], out: { t: 1966 / 30, mode: "up" } },
  { cues: [{ t: 1998 / 30, lines: ["£1.560.000"], style: 3, from: "top" }], out: { t: 2074 / 30, mode: "up" } },
  { cues: [{ t: 2082 / 30, lines: ["30 NĂM"], style: 1, from: "left" }], out: { t: 2112 / 30, mode: "left" } },
];
const Titles: React.FC<{ f: number }> = ({ f }) => {
  useBolota();
  const t = f / 30;
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{TITLES.map((b, i) => <Title2 key={i} t={t} cues={b.cues} y={ENZO_L.TOP} out={b.out} />)}</AbsoluteFill>;
};
/** Captions: Inter Regular, white with a black outline, lower middle of the frame (from the user's reference frame). */
const useInter = () => {
  const [h] = useState(() => delayRender("Inter font"));
  useEffect(() => {
    const ff = new FontFace("InterCap", `url(${staticFile("fonts/Inter-Regular.woff2")}) format("woff2")`, { weight: "400" });
    ff.load().then((x) => { (document.fonts as unknown as { add: (f: FontFace) => void }).add(x); return document.fonts.ready; }).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};
const RING = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return `${(5 * Math.cos(a)).toFixed(2)}px ${(5 * Math.sin(a)).toFixed(2)}px 0 #000`; }).join(", ");
const Captions: React.FC<{ f: number }> = ({ f }) => {
  useInter();
  const c = CAPTIONS.find(([a, b]) => f >= a && f < b);
  if (!c) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1352, height: 90, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "InterCap, sans-serif", fontWeight: 400, fontSize: 58, lineHeight: 1, color: "#fff", textAlign: "center", whiteSpace: "nowrap", textShadow: RING }}>{c[2]}</div>
    </AbsoluteFill>
  );
};
/** Captions alone on a transparent frame, for a ProRes 4444 overlay the user lays over the finished render. */
export const AtticCaptions: React.FC = () => (
  // drawn on the 1080 x 1920 layout and scaled up to the composition size (1440 x 2560 = the main render), so no --scale is needed
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(1.3333333)", transformOrigin: "0 0" }}><Captions f={useCurrentFrame()} /></div>
  </AbsoluteFill>
);
/** the main render carries the titles and the sound; captions are burned in with inputProps { captions: true } */
export const AtticReel: React.FC = () => {
  const f = useCurrentFrame();
  const flash = f >= FLASH_AT && f < FLASH_AT + 4 ? [1, 0.75, 0.45, 0.2][f - FLASH_AT] : 0;
  const tcg = useTcg();
  return (
    <AbsoluteFill style={{ background: "#cfe3f2" }}>
      {tcg && layersAt(f).map((l, i) => <ShotView key={i ? "over" : "base"} id={l.id} alpha={l.alpha} />)}
      {flash > 0 && <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />}
      <Titles f={f} />
      {(getInputProps() as { captions?: boolean }).captions && <Captions f={f} />}
      {withAudio() && <Audio src={staticFile("attic/mix.wav")} />}
    </AbsoluteFill>
  );
};
