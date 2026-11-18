// Character test: one full-3D stick figure in a plain room, showing walk, crouch, grab, carry, throw (box physics) and
// lying down. No story, no titles. Ink outlines (the reel's InkPass) + flat toon shading, no cast shadows.
import React, { useMemo } from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { InkPass } from "../gps/ink";
import { StickRig, toon } from "./rig";
import { poseAt, boxAt, camTarget, BOX_SIZE, CHAR_FRAMES } from "./anim";

export { CHAR_FRAMES };

const boxTexture = () => {
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!;
  g.fillStyle = "#c99a5c"; g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#b5874c"; for (let i = 0; i < 6; i++) g.fillRect(0, 20 + i * 40, 256, 3);
  g.fillStyle = "#e8d7a8"; g.fillRect(108, 0, 40, 256); // packing tape
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
};

const buildScene = () => {
  const root = new THREE.Group();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toon("#e6d6b8")); floor.rotation.x = -Math.PI / 2; root.add(floor);
  const wall = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 0.2), toon("#9cc9de")); wall.position.set(0, 2, -2.3); root.add(wall);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(40, 0.14, 0.24), toon("#f2efe6")); skirt.position.set(0, 0.07, -2.18); root.add(skirt);
  const side = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 10), toon("#b7d8e8")); side.position.set(4.0, 2, 2.6); root.add(side); // the box hits this wall if it gets that far
  // a few props for scale
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), toon("#a77b4a")); crate.position.set(-2.4, 0.3, -1.6); root.add(crate);
  const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), toon("#b98a55")); crate2.position.set(-2.35, 0.825, -1.6); crate2.rotation.y = 0.3; root.add(crate2);
  const plant = new THREE.Group(); plant.position.set(3.2, 0, -1.7);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.36, 20), toon("#d0603e")); pot.position.y = 0.18; plant.add(pot);
  const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 1), toon("#5fae5a")); leaves.position.y = 0.7; plant.add(leaves); root.add(plant);
  const box = new THREE.Mesh(new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE), toon("#ffffff", boxTexture())); root.add(box);
  // box contact shadow
  const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(40,30,50,0.3)"); gr.addColorStop(1, "rgba(40,30,50,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const boxBlob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); boxBlob.rotation.x = -Math.PI / 2; root.add(boxBlob);
  root.add(new THREE.HemisphereLight("#fff6e8", "#b9a88a", 1.4));
  const sun = new THREE.DirectionalLight("#ffffff", 1.9); sun.position.set(2.5, 5, 4); root.add(sun);
  const rig = new StickRig(); root.add(rig.root);
  return { root, rig, box, boxBlob };
};

const Inner: React.FC = () => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const S = useMemo(buildScene, []);
  const ink = useMemo(() => new InkPass(scene, camera as THREE.PerspectiveCamera), [scene, camera]);
  const tone = useMemo(() => new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }), []);
  scene.background = new THREE.Color("#9cc9de");
  // pose
  S.rig.pose(poseAt(f));
  if (S.rig.lastShort > 0.005) console.warn(`[char] f${f}: a limb falls ${S.rig.lastShort.toFixed(3)} m short (body must move closer)`);
  const b = boxAt(f); S.box.position.set(...b.p); S.box.quaternion.copy(b.q);
  const s = Math.max(0.25, 0.6 - b.p[1] * 0.3); S.boxBlob.position.set(b.p[0], 0.004, b.p[2]); S.boxBlob.scale.set(s, s, 1);
  // camera: a slow drift round him, following the action
  // three-quarter front view (we see his face), drifting slowly; it backs off while the box flies so both stay in frame
  const fly = Math.min(1, Math.max(0, (f - 214) / 18)) - Math.min(1, Math.max(0, (f - 270) / 26));
  const t = camTarget(f), a = 0.98 - 0.25 * (f / CHAR_FRAMES), dist = 4.4 + 1.3 * fly - 0.5 * Math.min(1, Math.max(0, (f - 300) / 50));
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(t[0] + dist * Math.sin(a), t[1] + 0.55, t[2] + dist * Math.cos(a));
  cam.lookAt(t[0], t[1], t[2]); cam.fov = 38; cam.near = 0.05; cam.far = 200; cam.updateProjectionMatrix();
  return (
    <>
      <primitive object={S.root} dispose={null} />
      <EffectComposer multisampling={4}>
        <primitive object={ink} dispose={null} />
        <primitive object={tone} dispose={null} />
      </EffectComposer>
    </>
  );
};

export const CharTest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#9cc9de" }}>
    <ThreeCanvas width={1080} height={1920} gl={{ antialias: false, stencil: false, powerPreference: "high-performance" }} camera={{ fov: 38, near: 0.05, far: 200 }}>
      <Inner />
    </ThreeCanvas>
  </AbsoluteFill>
);
