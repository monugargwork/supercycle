// The Gengar reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { LIGHTS, LOOK, LightPreset } from "../../engine/lights";
import { TONE, CHAR, untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { Pool, Actor, Fx, stage, Stage, stringEnd } from "./cast";
import { buildSets, Sets, redraw, SHARD_N } from "./sets";
import { caseContents, contract, chargeFolder } from "./art2";
import { doorShardsAt, caseShardsAt, lockAt, Pose } from "./physics";
import { SHOTS, ShotDef, camAt, smooth, clamp01, easeOut, SHOWN, ORIGIN, SHOPP, ROADP, RENTP, POLP, JUSP, vanAt, d14, SMASH1, STRIKE4, TAKE5, TILL5, SNAP6, DOORS6,
  FLASH10, SIGN12, STAMP12, FLOOD14, PINS16, PIN17, ROLL18, GDOOR20, SLAM21, ARREST21, WANTED21, FILE24, SHUT24 } from "./story";

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const discTex = () => ctex("sunDisc", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 58, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
const haloTex = () => ctex("sunHalo", 256, 256, (g) => {
  const im = g.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const u = Math.hypot(x - 127.5, y - 127.5) / 128;
    const a = (0.55 * Math.exp(-((u / 0.25) ** 2)) + 0.35 * Math.exp(-((u / 0.6) ** 2))) * (1 - Math.min(1, Math.max(0, (u - 0.8) / 0.2)));
    const i = (y * 256 + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = Math.round(255 * Math.min(1, a));
  }
  g.putImageData(im, 0, 0);
});
const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

export class World {
  root = new THREE.Group();
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight;
  private sky: THREE.Mesh; private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#bccbec", 25, 420);
  private sunDisc: THREE.Sprite; private sunHalo: THREE.Sprite;
  private sunCache = new Map<number, THREE.Vector3>();
  private cloudMaps: Record<"day" | "golden" | "night", THREE.Texture[]>;
  private moon: THREE.Sprite;
  private clouds: THREE.Mesh[] = [];
  private S: Sets;
  private frustum = new THREE.Frustum();
  private m4 = new THREE.Matrix4(); private v = new THREE.Vector3(); private sph = new THREE.Sphere();
  private ledC = [new THREE.Color(0.2, 2.6, 0.7), new THREE.Color(0.3, 1.2, 3.0), new THREE.Color(0.05, 0.12, 0.08)];

  constructor() {
    const R = this.root;
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el));
          c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el));
          c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1100, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK);
    R.add(this.sky);
    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(6.0, 4.4, 2.4), fog: false, depthWrite: false }));
    this.sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: new THREE.Color(1, 1, 1), fog: false, depthWrite: false, depthTest: true,
      transparent: true, blending: THREE.AdditiveBlending }));
    this.sunDisc.renderOrder = -0.5; this.sunHalo.renderOrder = 5;
    for (const m of [this.sunDisc, this.sunHalo]) { m.frustumCulled = false; m.layers.set(NOINK); R.add(m); }
    this.hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 1.1);
    this.sun = new THREE.DirectionalLight("#fff0d6", 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(4096, 4096);
    R.add(this.hemi, this.sun, this.sun.target);
    this.cloudMaps = { day: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.day.cloud)), golden: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.golden.cloud)), night: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.night.cloud)) };
    this.moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(2.6, 2.6, 2.3), fog: false, depthWrite: false })); this.moon.frustumCulled = false; this.moon.layers.set(NOINK); R.add(this.moon);
    for (let i = 0; i < 10; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.1, 1.1, 1.1), transparent: true, depthWrite: false, fog: false }));
      m.layers.set(NOINK); this.clouds.push(m); R.add(m);
    }
    this.S = buildSets(R);
  }

  /** camera-relative sun frozen per shot: the shot's mean view direction turned by az toward screen right, lifted by el */
  private shotSun(id: number, s: ShotDef, L: LightPreset) {
    let v = this.sunCache.get(id);
    if (v) return v;
    let fx = 0, fz = 0;
    for (let f = s.a; f < s.b; f += 3) {
      const c = camAt(id, f), x = c.look[0] - c.pos[0], z = c.look[2] - c.pos[2], n = Math.hypot(x, z) || 1;
      fx += x / n; fz += z / n;
    }
    const n = Math.hypot(fx, fz) || 1; fx /= n; fz /= n;
    const az = THREE.MathUtils.degToRad(s.sunAz ?? L.az), el = THREE.MathUtils.degToRad(s.sunEl ?? L.el);
    const hx = fx * Math.cos(az) - fz * Math.sin(az), hz = fz * Math.cos(az) + fx * Math.sin(az);
    v = new THREE.Vector3(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
    this.sunCache.set(id, v);
    return v;
  }
  private shadowCache = new Map<number, { centre: THREE.Vector3; R: number }>();
  /** one shadow frustum per shot: centred on the shot's mean look point, big enough for every frame of it, texel-snapped */
  private shotShadow(id: number, s: ShotDef, sunDir: THREE.Vector3) {
    const hit = this.shadowCache.get(id); if (hit) return hit;
    const L = LIGHTS[s.light]; void L;
    let cx = 0, cy = 0, cz = 0, n = 0, maxD = 0;
    for (let f = s.a; f < s.b; f += 2) { const c = camAt(id, f); cx += c.look[0]; cy += c.look[1]; cz += c.look[2]; n++; }
    cx /= n; cy /= n; cz /= n;
    for (let f = s.a; f < s.b; f += 2) { const c = camAt(id, f); maxD = Math.max(maxD, Math.hypot(c.pos[0] - cx, c.pos[1] - cy, c.pos[2] - cz) + Math.hypot(c.look[0] - cx, c.look[1] - cy, c.look[2] - cz)); }
    let R = THREE.MathUtils.clamp(maxD * 1.15 + 7, 10, 95);
    if (s.light === "golden") R = Math.max(R, 22);
    // snap the centre to whole shadow texels along the light's right/up axes
    const texel = (2 * R) / this.sun.shadow.mapSize.x, up = Math.abs(sunDir.y) > 0.99 ? V(1, 0, 0) : V(0, 1, 0);
    const right = V(0, 0, 0).crossVectors(up, sunDir).normalize(), up2 = V(0, 0, 0).crossVectors(sunDir, right).normalize();
    const c0 = V(cx, cy, cz), a = Math.round(c0.dot(right) / texel) * texel, b = Math.round(c0.dot(up2) / texel) * texel, d = c0.dot(sunDir);
    const centre = right.multiplyScalar(a).add(up2.multiplyScalar(b)).add(sunDir.clone().multiplyScalar(d));
    const out = { centre, R }; this.shadowCache.set(id, out); return out;
  }
  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const s = SHOTS[id - 1], L = LIGHTS[s.light], K = LOOK[s.light];
    const c = camAt(id, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = c.pos[1] > 20 ? 1.0 : 0.12; // 0.12 m (not 0.05): twice the depth precision, less z-fighting far away cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = V(...c.look), dist = cam.position.distanceTo(focus);
    cam.layers.enable(NOINK);
    // ---- light rig ----
    const sunDir = this.shotSun(id, s, L);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    // shadow map frozen per shot (anti-flicker): one centre and one radius for the whole shot, centre snapped to the shadow
    // map's texel grid in light space. A shadow camera that follows the look point / camera distance every frame makes shadow
    // edges swim and whole areas pop in and out of shadow as the camera moves (the Monaco v1 "glitch").
    const { centre: sCentre, R: Rr } = this.shotShadow(id, s, sunDir);
    this.sun.position.copy(sCentre).addScaledVector(sunDir, 220); this.sun.target.position.copy(sCentre);
    void focus; void dist;
    const sc = this.sun.shadow.camera;
    sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 20; sc.far = 480; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...K.bounce); TONE.uSat.value = K.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    // ---- sky, fog, sun disc, clouds ----
    const su = this.skyMat.uniforms;
    K.sky.c.forEach((h, i) => untone(h, su["c" + i].value));
    const e = K.sky.e.map((deg) => THREE.MathUtils.degToRad(deg));
    su.e.value.set(e[1], e[2], e[3], e[4]);
    this.sky.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar;
    scene.fog = this.fog; scene.background = null;
    // the moon (night shots): fixed in the sky, high over the road ahead of the tracking camera (S10) and over the shop
    this.moon.visible = s.light === "night";
    if (this.moon.visible) { const md = new THREE.Vector3(0.28, 0.3, 0.91).normalize(); this.moon.position.copy(cam.position).addScaledVector(md, 900); this.moon.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(1.4))); }
    const showSun = s.light === "golden";
    this.sunDisc.visible = this.sunHalo.visible = showSun;
    if (showSun) {
      this.sunDisc.position.copy(cam.position).addScaledVector(sunDir, 900);
      this.sunDisc.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(1.7)));
      this.sunHalo.position.copy(this.sunDisc.position); this.sunHalo.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(24)));
      (this.sunHalo.material as THREE.SpriteMaterial).color.set(L.sunDisc).multiplyScalar(1.3);
    }
    this.clouds.forEach((m, i) => {
      const a = (i / this.clouds.length) * Math.PI * 2 + 0.3, d = 620 + (i % 3) * 60, w = 130 + (i % 4) * 30;
      m.position.set(cam.position.x + Math.cos(a) * d, 110 + (i % 4) * 36, cam.position.z + Math.sin(a) * d); m.scale.set(w, w / 2, 1);
      m.lookAt(cam.position.x, m.position.y, cam.position.z);
      (m.material as THREE.MeshBasicMaterial).map = this.cloudMaps[s.light][i % 4]; m.visible = s.light !== "night" || i % 3 === 0;
    });
    // ---- sets ----
    for (const [name, g] of Object.entries(this.S.groups)) g.visible = SHOWN[s.place].includes(name);
    this.pose(id, f);
    // ---- cast + effects ----
    const right = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 0), upv = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 1);
    const fwd = V(0, 0, 0); cam.getWorldDirection(fwd);
    const st = stage(id, f, { pos: cam.position.clone(), right, up: upv, fwd, sun: sunDir });
    this.placeProps(id, f, st);
    this.frustum.setFromProjectionMatrix(this.m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    let ai = 0;
    const used: Actor[] = [];
    for (const p of st.places) {
      const sc2 = p.scale ?? 1;
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y + 1.1 * sc2, p.z), 3.5))) continue;
      const a = this.actor(ai++);
      const [w, h, k] = p.size ?? [300, 500, 0.5];
      a.r = this.pool.req(p.key, w, h, k, p.draw);
      a.mesh.visible = true;
      a.mesh.position.set(p.x, p.y, p.z);
      a.mesh.rotation.set(0, p.yaw ?? Math.atan2(cam.position.x - p.x, cam.position.z - p.z), 0);
      a.mesh.scale.set(p.mirror ? -sc2 : sc2, sc2, sc2);
      a.mesh.castShadow = L.actorShadow;
      used.push(a);
    }
    for (let i = ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    let fi = 0;
    const fused: Fx[] = [];
    for (const p of st.fx) {
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y, p.z), Math.max(p.w, p.h)))) continue;
      const ef = this.fx(fi++);
      ef.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw);
      ef.use(!!p.soft);
      ef.mesh.visible = true;
      ef.mesh.position.set(p.x, p.y, p.z);
      if (p.axis) {
        const [a, b2] = p.axis, X = V(b2[0] - a[0], b2[1] - a[1], b2[2] - a[2]).normalize();
        const Zc = cam.position.clone().sub(V(p.x, p.y, p.z)).normalize(), Y = V(0, 0, 0).crossVectors(Zc, X).normalize(), Z = V(0, 0, 0).crossVectors(X, Y);
        ef.mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
        ef.soft.depthTest = false; // a laser reads in front of the glass-case rails
      } else if (p.flat) { ef.soft.depthTest = true; ef.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0); }
      else if (p.face !== undefined) { ef.soft.depthTest = true; ef.mesh.rotation.set(0, 0, 0); ef.mesh.rotation.order = "YXZ"; ef.mesh.rotation.set(p.tilt ?? 0, p.face, p.rot ?? 0); }
      else { ef.soft.depthTest = true; ef.mesh.quaternion.copy(cam.quaternion); ef.mesh.rotateZ(p.rot ?? 0); }
      ef.mesh.scale.set(p.w, p.h, 1);
      fused.push(ef);
    }
    for (let i = fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of used) a.bind();
    for (const ef of fused) ef.bind();
    return focus;
  }


  /** moving set pieces that depend only on the shot and frame */
  private pose(id: number, f: number) {
    const S = this.S, place = SHOTS[id - 1].place, SH = SHOPP;
    // the van: in whichever set the scene's van pose names
    const v = vanAt(id, f);
    S.van.visible = !!v && v.set === place;
    if (v && S.van.visible) {
      const o = ORIGIN[v.set]; S.van.position.set(o[0] + v.x, o[1], o[2] + v.z); S.van.rotation.set(0, v.yaw, 0);
      S.vanBrake.color.setRGB(v.brake ? 3.2 : 0.55, v.brake ? 0.15 : 0.05, v.brake ? 0.12 : 0.05);
      S.vanHaz.color.setRGB(v.hazard ? 3.4 : 0.45, v.hazard ? 1.8 : 0.25, v.hazard ? 0.2 : 0.05);
    }
    if (place === "shop") {
      S.pane.visible = id === 1 && f < SMASH1;
      S.caseTops.forEach((m, i) => { m.visible = id < 4 || (id === 4 && f < STRIKE4[i]); S.caseFronts[i].visible = m.visible; });
      // case contents: emptied as each thing named goes into a bag
      const takes = [TAKE5.A, TAKE5.B, TAKE5.C];
      S.cases.forEach((c, i) => { const left = i > 2 ? 0 : id < 5 ? 0 : id > 5 ? 1 : f >= (takes[i][0] + takes[i][1]) / 2 ? 1 : 0; redraw(c, `${i}|${left}`, (p) => caseContents(p, i, left)); });
      S.drawer.position.x = SH.register[0] - (id === 5 && f >= TILL5 ? 0.3 * easeOut(clamp01((f - TILL5) / 4)) : id > 5 ? 0.3 : 0);
      // glass shards: the door pane (from f60) and the four case tops, from the bakes; after their scenes, the resting poses
      let n = 0;
      const put = (sz: [number, number, number], P: Pose) => { const m = S.shards[n++]; if (!m) return; m.visible = true; m.position.set(P.p[0], P.p[1], P.p[2]); m.quaternion.set(P.q[0], P.q[1], P.q[2], P.q[3]); if (sz[2] < sz[1]) m.scale.set(sz[0] * 0.75, sz[1] * 0.7, 1); else { m.scale.set(sz[0], sz[2], 1); m.rotateX(Math.PI / 2); } };
      const door = doorShardsAt(id === 1 ? f : 99999); if (door) for (const s of door) put(s.size, s.pose);
      if (id >= 4 && id !== 23) for (let ci = 0; ci < 4; ci++) { const cs = caseShardsAt(ci, id === 4 ? f : 99999); if (cs) for (const s of cs) put(s.size, s.pose); }
      for (; n < SHARD_N; n++) S.shards[n].visible = false;
      // the trailer's right door swings open after the lock is cut (heavy: eases, a small bounce at the stop)
      const ang = id < 6 ? 0 : id > 6 ? 1 : f < DOORS6[0] ? 0 : (() => { const u = clamp01((f - DOORS6[0]) / (DOORS6[1] - DOORS6[0])); return smooth(u) + (u > 0.85 ? 0.03 * Math.sin((u - 0.85) * 40) * (1 - u) * 6 : 0); })();
      S.tDoors.forEach((d) => { d.g.rotation.y = d.side > 0 ? -ang * 1.75 : 0; });
      // the padlock: on the hasp, then the bake
      const lk = id < 6 ? null : lockAt(id === 6 ? f : 99999);
      if (!lk) { S.lock.position.set(...(SH.lock as [number, number, number])); S.lock.quaternion.identity(); S.shackle.position.set(SH.lock[0], SH.lock[1] + 0.08, SH.lock[2]); S.shackle.rotation.set(0, 0, 0); }
      else { S.lock.position.set(...lk[0].p); S.lock.quaternion.set(...lk[0].q); S.shackle.position.set(...lk[1].p); S.shackle.quaternion.set(...lk[1].q); }
    }
    if (place === "road") {
      // the gold trail: floods along the road the van came by (S14 'nhớ từng con đường'), then keeps drawing behind it
      const g = S.trail.geometry; S.trail.visible = id === 14 && f >= FLOOD14[0];
      if (S.trail.visible) { const dv = d14(f), k = smooth(clamp01((f - FLOOD14[0]) / (FLOOD14[1] - FLOOD14[0]))), from = Math.max(0, dv - 175), end = Math.max(from, dv - 2.6), shown = from + (end - from) * k;
        const i0 = Math.floor(from), i1 = Math.floor(shown); g.setDrawRange(i0 * 6, Math.max(0, i1 - i0) * 6); }
      ROADP.pings.forEach((t, i) => { const on = id === 14 && f >= t; S.towerLamps[i].color.setRGB(on ? 0.6 : 0.4, on ? 1.6 : 0.08, on ? 4.0 : 0.08); });
      S.flash.visible = id === 10 && f >= FLASH10 && f < FLASH10 + 3;
    }
    if (place === "rent") {
      S.paperMesh.visible = id === 12 || id === 13;
      if (S.paperMesh.visible) { const sig = id === 12 ? Math.round(clamp01((f - SIGN12[0]) / (SIGN12[1] - SIGN12[0])) * 30) / 30 : 1, st = id === 12 ? (f >= STAMP12 ? Math.round(easeOut(clamp01((f - STAMP12) / 5)) * 10) / 10 : 0) : 1;
        redraw(S.paper, `${sig}|${st}`, (p) => contract(p, sig, st)); S.paperMesh.position.y = RENTP.paper[1] + (id === 12 && f >= STAMP12 && f < STAMP12 + 2 ? 0.002 : 0); }
      const open = id === 24 ? (f < SHUT24 - 6 ? 0.36 : f < SHUT24 ? 0.36 * (1 - (f - SHUT24 + 6) / 6) : 0) : 0;
      S.drawer26.position.x = RENTP.archive_x + 0.36 + open; void FILE24;
    }
    if (place === "pol") {
      const pinned = (i: number) => id > 16 || (id === 16 && f >= PINS16[i]);
      S.items.forEach((m, i) => { m.visible = id !== 21 && pinned(i); });
      const pts = ["cctv", "rental", "gps", "phone", "prints"].map((n) => (POLP.slots as Record<string, number[]>)[n]);
      const seg = (m: THREE.Mesh, a: number[], b: number[], k = 1) => { const bx = a[0] + (b[0] - a[0]) * k, by = a[1] + (b[1] - a[1]) * k, L = Math.hypot(bx - a[0], by - a[1]); m.visible = L > 0.01; m.position.set((a[0] + bx) / 2, (a[1] + by) / 2 + 0.1, POLP.board_z - 0.012); m.scale.set(L, 1, 1); m.rotation.set(0, 0, Math.atan2(by - a[1], bx - a[0])); };
      S.strings.forEach((m, i) => { m.visible = false; if (id === 21) return; if (i < 4) { if (pinned(i + 1)) seg(m, pts[i], pts[i + 1]); } else if (i === 4) { const k = stringEnd(id, f); if (k > 0) seg(m, pts[4], [POLP.pin_justice[0], POLP.pin_justice[1] - 0.1], k); } });
      S.pinJ.visible = id === 17 ? f >= PIN17 : id > 17;
      S.folderMeshes.forEach((m, i) => { m.visible = id === 21 && (i < 4 || f >= SLAM21); });
      if (id === 21) S.folders.forEach((c, i) => { const t = i < 2 ? ARREST21[i] : WANTED21[i - 2], k = f >= t ? Math.round(easeOut(clamp01((f - t) / 4)) * 8) / 8 : 0, mark = k > 0 ? (i < 2 ? 1 : 2) : 0; redraw(c, `${mark}|${k}`, (p) => chargeFolder(p, i, mark, k)); });
    }
    if (place === "jus") {
      const J = JUSP, [go0, go1] = J.gdoor, GOH = J.gdoor_h, segH = GOH / 4, zf = J.garage[3] - 0.08;
      const lift = id < 20 ? 0 : id > 20 ? 2.4 : 2.4 * smooth(clamp01((f - GDOOR20[0]) / (GDOOR20[1] - GDOOR20[0])));
      S.gdoor.forEach((m, i) => { const s = i * segH + segH / 2 + lift; if (s <= GOH) { m.position.set((go0 + go1) / 2, s, zf); m.rotation.set(0, 0, 0); } else { m.position.set((go0 + go1) / 2, GOH + 0.18, zf - (s - GOH)); m.rotation.set(Math.PI / 2, 0, 0); } });
      J.cars.forEach(([cx, cz], i) => { const g = S.cars[i]; g.visible = id >= 18; if (!g.visible) return; const [a, b] = ROLL18[i], u = id === 18 ? clamp01((f - a) / (b - a)) : 1, k = 1 - (1 - u) ** 2.2;
        g.position.set(J.cars_from[i] + (cx - J.cars_from[i]) * k, 0, cz); g.rotation.y = Math.PI; const on = Math.floor(f / 4) % 2 === (i % 2);
        S.bars[i][0].color.setRGB(on ? 3.2 : 0.5, on ? 0.25 : 0.05, on ? 0.25 : 0.05); S.bars[i][1].color.setRGB(on ? 0.1 : 0.25, on ? 0.12 : 0.5, on ? 0.6 : 3.6); });
    }
  }
  /** props the cast moves (none in this reel: the moving pieces are posed in pose()) */
  private placeProps(id: number, f: number, st: Stage) { void id; void f; void st; }
}
