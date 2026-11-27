// The Retford reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { LIGHTS, LOOK, LightPreset } from "../../engine/lights";
import { TONE, CHAR, untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { Pool, Actor, Fx, stage, Stage } from "./cast";
import { buildSets, Sets, redraw } from "./sets";
import * as A2 from "./art2";
import { LOOKS } from "./looks";
import { SHOTS, ShotDef, camAt, smooth, clamp01, easeOut, SHOWN, UP, VANP, KIDP, CTRLP, YARDP, COURTP, ROOMP, recOn, vanRoute, hop,
  RING1, TIP1, LAND1, BELL3, PANEL3, TEAR5, RED6, REC7, SWIVEL7, PEEL9, STICK9, OPEN9, MON10, MONSTEP10, ROUTE10, STOP11, DOORS11, DROP11, LAND11, OUT15, GLANCE15, DOOR17 } from "./story";

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
    this.sun.castShadow = false; // quality bar: no shadows at all
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
    cam.fov = c.fov; cam.near = c.pos[1] > 20 ? 1.0 : 0.12; // 0.12 m (not 0.05): twice the depth precision, less z-fighting far away
    cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld(); // (was swallowed by the comment above: the plan's fov never applied)
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
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...BRIGHT.shade); TONE.uShadeLift.value.set(...BRIGHT.lift); // warm, bright shading (no violet shade)
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...K.bounce); TONE.uSat.value = BRIGHT.sat;
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
    this.moon.visible = s.light === "night";
    if (this.moon.visible) { const md = new THREE.Vector3(-0.35, 0.34, 0.87).normalize(); this.moon.position.copy(cam.position).addScaledVector(md, 900); this.moon.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(1.6))); }
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
      (m.material as THREE.MeshBasicMaterial).map = this.cloudMaps[s.light][i % 4]; m.visible = s.light !== "night" || i % 2 === 0;
    });
    // ---- sets ----
    for (const [name, g] of Object.entries(this.S.groups)) g.visible = SHOWN[s.place].includes(name);
    this.S.van.visible = s.place === "unit" || s.place === "yard";
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
    const S = this.S, place = SHOTS[id - 1].place;
    const W = (o: number[], x: number, y: number, z: number) => new THREE.Vector3(o[0] + x, o[1] + y, o[2] + z);
    // ---- the van: where it stands in each scene (world), its rear doors, its plate, the dash calendar ----
    const vp = (p: number[], set: "unit" | "yard") => { const o = this.S.groups[set].position; S.van.position.set(o.x + p[0], 0, o.z + p[1]); S.van.rotation.set(0, -THREE.MathUtils.degToRad(p[2]), 0); };
    if (place === "unit") {
      if (id === 5) vp(VANP.layby, "unit"); else if (id === 8) vp(vanRoute(f), "unit"); else if (id === 17) S.van.position.set(0, -40, 0); else vp(VANP.yard, "unit");
      const open = id === 8 ? 1 - smooth(k01(f, 828, 842)) : id === 5 ? 0 : 1;
      S.vanDoors.forEach((d, i) => { d.rotation.y = (i ? 1 : -1) * 1.9 * open; });
    } else if (place === "yard") { vp(YARDP.van, "yard"); S.vanDoors.forEach((d, i) => { d.rotation.y = (i ? 1 : -1) * 1.9; }); }
    const lift = id === 8 && f < 900 ? Math.round((0.45 + 0.25 * Math.sin(f * 0.55)) * 20) / 20 : 0.45;
    redraw(S.plate, String(lift), (p) => A2.plate(p, 600, 140, VANP.plate, VANP.plate_under, lift));
    const day = id === 5 ? (f < TEAR5[0] ? 22 : f < TEAR5[1] ? 23 : f < TEAR5[2] ? 24 : 26) : 26;
    redraw(S.vanCal, String(day), (p) => A2.deskCal(p, 200, 220, day));
    { const t = id === 5 ? TEAR5.find((t0) => f >= t0 && f < t0 + 14) : undefined;
      if (t === undefined) S.calPage.visible = false;
      else { const u = (f - t) / 14, prev = t === TEAR5[0] ? 22 : t === TEAR5[1] ? 23 : 24; S.calPage.visible = true;
        redraw(S.calPageC, String(prev), (p) => A2.deskCal(p, 200, 220, prev));
        S.calPage.position.set(2.05 - 0.35 * u, 1.3 + 0.12 * Math.sin(u * Math.PI) - 0.75 * u * u, 0.06 + 0.08 * Math.sin(u * 7)); S.calPage.rotation.set(-0.25 - 2.2 * u, 0.6 * Math.sin(u * 5), 0.4 * u); } }
    if (place === "unit") {
      // ---- the breach: the ring of drilled holes, the plug's fall, the loose bricks, the repair (S17) ----
      const [hx, hy, hz] = UP.hole, HR = UP.hole_r, WT = UP.wall_t, intact = id === 5 || (id === 1 && f < TIP1), fixed = id === 17;
      const done = id === 5 ? 0 : id === 1 && f < RING1 ? UP.ring_n - 1 : UP.ring_n;
      redraw(S.plugRing, String(done), (p) => A2.plugFace(p, 512, UP.ring_n, done));
      S.patch.visible = fixed; S.holeOut.visible = S.holeIn.visible = S.tunnel.visible = !fixed; S.plug.visible = !fixed;
      let th = 0, drop = 0, slide = 0;
      if (!intact && !fixed) {
        const g = id === 1 ? f : 999;
        th = (Math.PI / 2) * Math.min(1, ((g - TIP1) / 6) ** 2);
        drop = g < TIP1 + 6 ? 0 : g < LAND1 ? 0.5 * ((g - TIP1 - 6) / (LAND1 - TIP1 - 6)) ** 2 : 0.5 - hop(g, LAND1, 0.35);
        slide = g < LAND1 ? 0 : 0.75 * easeOut(k01(g, LAND1, LAND1 + 10));
      }
      S.plug.position.set(hx - WT, hy - HR - drop, hz - slide); S.plug.rotation.set(0, 0, th);
      const rest = [[5.1, -4.25], [4.95, -3.6], [5.45, -3.45], [4.85, -5.0]];
      S.bricks.forEach((m, i) => {
        if (intact || fixed) { m.visible = false; return; }
        m.visible = true; const g = id === 1 ? f : 999, u = easeOut(k01(g, TIP1 + 2, TIP1 + 16 + i * 2)), sx = hx - WT, sy = hy - HR + 0.1 + i * 0.2, sz = hz + (i - 1.5) * 0.25;
        m.position.set(sx + (rest[i][0] - sx) * u, (g < TIP1 + 2 ? sy : 0.033 + Math.max(0, (sy - 0.033) * (1 - u) * (1 - u)) + hop(g, TIP1 + 16 + i * 2, 0.6)), sz + (rest[i][1] - sz) * u);
        m.rotation.set(u * (1.2 + i), u * (0.5 + i * 0.7), 0); });
      S.rackGap.visible = id === 1 || id === 5 || (id === 2 && f < 118);
      // ---- the alarm: the bell box strobe, the station's panel lamp ----
      const ringing = (id === 3 && f >= BELL3) || id === 4 || id === 6 || (id === 7 && f < 760), st = ringing && Math.floor(f / 6) % 2 === 0;
      S.strobe.color.setRGB(st ? 0.4 : 0.15, st ? 0.8 : 0.3, st ? 3.2 : 1.0);
      const pl = id === 3 && f >= PANEL3 && Math.floor((f - PANEL3) / 6) % 2 === 0; S.panel.color.setRGB(pl ? 3.2 : 0.4, pl ? 0.25 : 0.05, pl ? 0.2 : 0.05);
      // ---- the yard camera: REC from S07 on, the swivel to the van; the road cameras light as the van passes ----
      const rec = (id === 7 && f >= REC7) || id === 8 ? recOn(f) : false;
      S.recMat.color.setRGB(rec ? 3.0 : 0.35, rec ? 0.25 : 0.05, rec ? 0.2 : 0.05);
      const o = this.S.groups.unit.position, oo = [o.x, o.y, o.z], far = W(oo, 11.0, 1.0, -10.5), vanT = W(oo, VANP.yard[0], 1.2, VANP.yard[1]);
      let aim = far;
      if (id === 7) aim = far.clone().lerp(vanT, smooth(k01(f, SWIVEL7[0], SWIVEL7[1])));
      if (id === 8) { const v = vanRoute(f); aim = W(oo, v[0], 1.2, v[1]); }
      S.cctvHead.lookAt(aim);
      S.roadRec.forEach((m, i) => { const on = id === 8 && Math.abs(vanRoute(f)[0] - UP.road_cams[i]) < 10 && recOn(f); m.color.setRGB(on ? 3.0 : 0.35, on ? 0.25 : 0.05, on ? 0.2 : 0.05); });
      // ---- Christmas bulbs twinkle; the shop door opens for the kid (S17) ----
      S.bulbs.forEach((m, i) => { const base = [[2.6, 0.3, 0.25], [2.6, 2.0, 0.3], [0.3, 2.4, 0.5], [0.3, 1.2, 2.8]][i], k = Math.floor(f / 30 + i * 0.37) % 4 === i ? 0.45 : 1; m.color.setRGB(base[0] * k, base[1] * k, base[2] * k); });
      S.door.rotation.y = id === 17 ? 1.3 * easeOut(k01(f, DOOR17 - 2, DOOR17 + 10)) * (1 - smooth(k01(f, 2330, 2350))) : 0;
    }
    if (place === "kidroom") {
      const lab = id !== 9 || f < PEEL9[0] ? "MINH" : f >= STICK9[1] ? "AN" : "";
      redraw(S.label, lab, (p) => { if (lab) A2.nbLabel(p, 330, 150, lab); });
      redraw(S.peelC, "MINH", (p) => A2.nbLabel(p, 330, 150, "MINH"));
      S.cover.rotation.set(0, 0, id === 9 ? Math.PI * smooth(k01(f, OPEN9[0], OPEN9[1])) : 0);
      S.newLabel.visible = id !== 9 || f < STICK9[0];
    }
    if (place === "ctrl") {
      const k = Math.round(clamp01((f - ROUTE10[0]) / (ROUTE10[1] - ROUTE10[0])) * 60) / 60;
      redraw(S.map, String(k), (p) => A2.routeMap(p, 1600, 1000, CTRLP.route, CTRLP.towns, k));
      S.mons.forEach((m, i) => { const on = f >= MON10 + i * MONSTEP10, rec = recOn(f + i * 7); redraw(m, `${on}|${rec}`, (p) => A2.roadMon(p, 640, 360, [4, 7, 11, 15, 18, 22][i], on, rec)); });
    }
    if (place === "yard") {
      const [a, b] = STOP11, u = id === 11 ? easeOut(k01(f, a, b)) : id === 12 ? 1 : 0, [x0, z0] = YARDP.car_from, [x1, z1] = YARDP.car_stop;
      S.car.visible = id === 12 || (id === 11 && f >= a - 4);
      S.car.position.set(x0 + (x1 - x0) * u, 0, z0 + (z1 - z0) * u - 0.6 * Math.sin(u * Math.PI));
      S.car.rotation.set(0, Math.PI + 0.35 * Math.sin(u * Math.PI), id === 11 && f >= b && f < b + 10 ? 0.03 * Math.sin((f - b) * 0.9) * (1 - (f - b) / 10) : 0);
      const fl = Math.floor(f / 4) % 2; S.barMats[0].color.setRGB(fl ? 0.3 : 0.08, fl ? 0.5 : 0.12, fl ? 3.0 : 0.6); S.barMats[1].color.setRGB(fl ? 0.08 : 0.3, fl ? 0.12 : 0.5, fl ? 0.6 : 3.0);
      S.cDoors.forEach((d, i) => { d.rotation.y = (i ? 1 : -1) * 4.45; });
      S.stack.visible = id === 12;
    }
    if (place === "court") {
      const op = id === 15 ? easeOut(k01(f, OUT15[0] - 4, OUT15[0] + 8)) * (1 - smooth(k01(f, GLANCE15[0] - 6, GLANCE15[0] + 4))) : 0;
      S.courtDoors.forEach((d, i) => { d.rotation.y = (i ? 1 : -1) * 1.4 * op; });
    }
    if (place === "courtroom") {
      const grey = (o: typeof LOOKS.m1) => ({ ...o, jacket: "#a8b4c4", pants: "#a8b4c4", tie: undefined });
      redraw(S.tv, "tv", (p) => A2.videoLink(p, 1530, 864, grey(LOOKS.m1), grey(LOOKS.m3), LOOKS.m5));
    }
    void KIDP; void COURTP; void ROOMP;
  }
  /** props the cast moves (stage() returns where they are this frame, in the world) */
  private placeProps(id: number, f: number, st: Stage) {
    const S = this.S, pr = st.props, place = SHOTS[id - 1].place, host = S.groups[place];
    const set = (o: THREE.Object3D, k: string) => { const q = pr[k]; if (!q) { o.visible = false; return; } if (o.parent !== host) host.add(o); o.visible = q.vis !== false; if (!o.visible) return;
      host.updateMatrixWorld(true); const w = new THREE.Vector3(...(q.p as [number, number, number])); host.worldToLocal(w); o.position.copy(w); o.rotation.set(q.rx ?? 0, q.ry ?? 0, q.rz ?? 0); };
    S.carry.forEach((c, i) => set(c, `carry${i}`));
    if (place === "kidroom") { set(S.peel, "peel"); if (pr.label2) set(S.newLabel, "label2"); }
    if (place === "yard") set(S.drop, "drop"); else S.drop.visible = false;
    void f;
  }
}

/** quality bar: warm neutral shade side and a richer saturation (the reference reels sit at 25-39 mean saturation) */
const BRIGHT = { shade: [0.62, 0.58, 0.54] as [number, number, number], lift: [0.1, 0.08, 0.05] as [number, number, number], sat: 1.3 };
const k01 = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
