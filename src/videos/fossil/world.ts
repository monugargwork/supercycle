// The Fossil sheet reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { LIGHTS, LOOK, LightPreset } from "../../engine/lights";
import { TONE, CHAR, untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { Pool, Actor, Fx, stage, Stage } from "./cast";
import { buildSets, Sets, poseSheet, SL } from "./sets";
import { lotBoard, calendar, tvNews, report } from "./art2";
import { SHOTS, ShotDef, camAt, smooth, clamp01, boardAt, yearAt, SHOWN, H, PR, PRESS, LOFT, CEIL, CORD1, SLAM1, POPS3, OPEN5, CREAK3, LAMP14, NEXT15, BLADEUP15, CHOP15, FLASHES, STAMP17, DOOR20, BLADE20 } from "./story";

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
  private cloudMaps: Record<"day" | "golden", THREE.Texture[]>;
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
    this.cloudMaps = { day: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.day.cloud)), golden: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.golden.cloud)) };
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
      (m.material as THREE.MeshBasicMaterial).map = this.cloudMaps[s.light][i % 4];
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
    const S = this.S, place = SHOTS[id - 1].place;
    const redraw = (c: { key: string; g: CanvasRenderingContext2D; tex: THREE.CanvasTexture }, key: string, draw: (p: Pen) => void) => {
      if (key === c.key) return;
      c.key = key; c.g.setTransform(1, 0, 0, 1, 0, 0); c.g.clearRect(0, 0, c.g.canvas.width, c.g.canvas.height); draw(new Pen(c.g)); c.tex.needsUpdate = true;
    };
    if (place === "landing" || place === "loft") {
      const y = yearAt(f, id); redraw(S.cal, String(y), (p) => calendar(p, y));
      if (id === 10) redraw(S.tv, "tv" + f, (p) => tvNews(p, f)); else redraw(S.tv, "tv0", (p) => tvNews(p, 0));
      // the hatch door angle (rad about its hinge; pi/2 = standing up, a touch past it rests on its stop)
      const OPEN = 1.62;
      let a = 0;
      if (id === 1) a = f < CORD1[0] ? OPEN : f < CORD1[1] ? OPEN - 0.17 * smooth((f - CORD1[0]) / (CORD1[1] - CORD1[0])) : f < SLAM1 ? (OPEN - 0.17) * (1 - ((f - CORD1[1]) / (SLAM1 - CORD1[1])) ** 2) : 0.05 * Math.abs(Math.sin((f - SLAM1) * 0.9)) * Math.exp(-(f - SLAM1) / 3);
      else if (id === 3) { for (const p0 of POPS3) { const u = f - p0 + 3; if (u >= 0 && u < 17) a = Math.max(a, u < 4 ? OPEN * smooth(u / 4) : u < 13 ? OPEN : OPEN * (1 - smooth((u - 13) / 3))); } }
      else if (id === 5) a = f < OPEN5 - 7 ? 0 : f < OPEN5 ? OPEN * smooth((f - OPEN5 + 7) / 7) : OPEN + 0.05 * Math.sin((f - OPEN5) * 1.3) * Math.exp(-(f - OPEN5) / 4);
      else if (id >= 6 && id <= 10) a = OPEN;
      else if (id === 20) a = f < DOOR20 - 4 ? 0 : OPEN * smooth((f - DOOR20 + 4) / 6);
      S.door.rotation.z = a;
      // the pull cord: from the door's free edge, hanging (or in his hand in S01)
      const at0 = new THREE.Vector3(H.hatch_x[0] + 0.8 * Math.cos(a), LOFT + 0.8 * Math.sin(a) - 0.012, (H.hatch_z[0] + H.hatch_z[1]) / 2);
      const end = this.cordEnd ? new THREE.Vector3(...this.cordEnd) : at0.clone().add(new THREE.Vector3(0, -1.0, 0));
      const L = at0.distanceTo(end); S.cord.position.copy(at0).add(end).multiplyScalar(0.5); S.cord.scale.set(1, Math.max(0.01, L), 1);
      S.cord.quaternion.setFromUnitVectors(V(0, 1, 0), end.clone().sub(at0).normalize());
      // dust on the boards; the clean stripe after the tube is taken (S06 on)
      const d = id < 2 ? 0 : id === 2 ? 0.6 * clamp01((f - 212) / 38) : 0.75;
      (S.dust.material as THREE.MeshBasicMaterial).opacity = id >= 6 && !(id === 6 && f < 586) ? 0 : d; (S.dustClean.material as THREE.MeshBasicMaterial).opacity = id >= 6 && !(id === 6 && f < 586) ? 0.75 : 0;
      // the loose fan blade: a pendulum that creaks, twitches at each head, and drops in S20
      let sw = 0.12 * Math.sin(f * 0.05);
      if (id === 3) { sw += f >= CREAK3 ? 0.32 * Math.sin((f - CREAK3) * 0.5) * Math.exp(-(f - CREAK3) / 20) : 0; for (const p0 of POPS3) if (f >= p0 + 4) sw += 0.15 * Math.sin((f - p0 - 4) * 0.9) * Math.exp(-(f - p0 - 4) / 6); }
      S.fanBlade.visible = true; S.fanBlade.rotation.set(0, 0, sw); S.fanBlade.position.set(H.fan[0], H.fan_cage[1], H.fan[2] + 0.02);
      if (id === 20 && f >= BLADE20) { const t = (f - BLADE20) / 30, y0 = H.fan_cage[1] - 0.1, rest = H.blade_rest;
        let y = y0 - 4.9 * t * t, x = H.fan[0] + (rest[0] - H.fan[0]) * Math.min(1, t / 0.4); const z = H.fan[2] + (rest[2] - H.fan[2]) * Math.min(1, t / 0.4);
        const tl = Math.sqrt((y0 - rest[1]) / 4.9); if (t > tl) { const u = t - tl; y = rest[1] + Math.abs(0.12 * Math.sin(u * 14)) * Math.exp(-u * 9); x = rest[0]; }
        S.fanBlade.position.set(x, y + 0.1, z); S.fanBlade.rotation.set(t > tl ? -Math.PI / 2 * Math.min(1, (t - tl) * 6) : t * 8, 0, t * 5); }
      S.ladder.visible = true;
      S.tin.visible = id >= 7 && id <= 10;
    }
    if (place === "auction") {
      const bd = boardAt(f, id); redraw(S.board, `${bd.a}${bd.b}`, (p) => lotBoard(p, bd.a, bd.b));
      const st = id > 17 || (id === 17 && f >= STAMP17) ? 1 : 0; redraw(S.report, "r" + st, (p) => report(p, st));
      S.lampOn.visible = id > 14 || (id === 14 && f >= LAMP14);
      const fl = id === 17 && FLASHES.some((ff) => f >= ff && f < ff + 3);
      S.flashes.forEach((m) => ((m.material as THREE.Material[])[4] as THREE.MeshBasicMaterial).color.setRGB(fl ? 4 : 1.2, fl ? 4 : 1.2, fl ? 3.8 : 1.15));
    }
    if (place === "press") {
      S.rollers.forEach((r, i) => { r.rotation.y = (i ? -1 : 1) * f * 0.25; });
      const by = f < BLADEUP15[0] ? 1.55 : f < BLADEUP15[1] ? 1.55 + 0.1 * smooth((f - BLADEUP15[0]) / (BLADEUP15[1] - BLADEUP15[0])) : f < CHOP15 ? 1.65 : f < CHOP15 + 3 ? 1.01 : 1.01 + 0.54 * smooth((f - CHOP15 - 3) / 12);
      S.blade.position.y = by;
      const cut = f >= CHOP15;
      // the sheet on the bed loses its last row at the chop (clipped at the blade line)
      const cz = PRESS[2] + PR.blade_z;
      for (const m of [S.press.front, S.press.back]) { const mm = m.material as THREE.Material; mm.clippingPlanes = cut ? [new THREE.Plane(V(0, 0, -1), cz)] : null; }
      // the next sheet slides out of the rollers
      const e = f < NEXT15 ? 0 : 0.6 * clamp01((f - NEXT15) / 60);
      S.press2.g.position.set(PRESS[0] + PR.rollers_x - SL / 2 - 0.02 + e, PRESS[1] + 1.07, PRESS[2] + PR.press[1]);
      // the cut strip: slides off the front edge and tips into the tray
      S.strip.visible = cut;
      if (cut) { const t = clamp01((f - CHOP15) / 14), zEdge = PR.bed[2] + 0.6;
        const z = PR.blade_z + 0.044 + (zEdge + 0.08 - PR.blade_z) * Math.min(1, t * 1.6), y = t < 0.6 ? PR.bed[1] + 0.004 : PR.bed[1] + 0.004 - (PR.bed[1] - PR.tray[1]) * smooth((t - 0.6) / 0.4);
        S.strip.position.set(PR.bed[0], y, z); S.strip.rotation.set(-Math.PI / 2 + (t > 0.55 ? 0.5 * Math.sin(Math.PI * clamp01((t - 0.55) / 0.45)) : 0), 0, 0); }
    }
  }
  private cordEnd: number[] | null = null;
  /** props the cast moves (stage() returns where they are this frame) */
  private placeProps(id: number, f: number, st: Stage) {
    const S = this.S, P = st.props;
    const had = this.cordEnd; this.cordEnd = st.cordEnd ?? null;
    if (had || this.cordEnd) this.pose(id, f);
    const put = (o: THREE.Object3D, k?: { p: number[]; ry?: number; rx?: number; rz?: number; vis?: boolean }) => {
      if (!k) return; o.visible = k.vis !== false; o.position.set(k.p[0], k.p[1], k.p[2]); o.rotation.set(k.rx ?? 0, k.ry ?? 0, k.rz ?? 0);
    };
    put(S.tin, P.tin); put(S.toy, P.toy);
    const h = st.sheet;
    S.hero.g.visible = !!h && h.vis !== false;
    if (h && h.vis !== false) {
      S.hero.g.position.set(...h.p);
      if (h.q) S.hero.g.quaternion.copy(h.q); else S.hero.g.rotation.set(...(h.r ?? [0, 0, 0]));
      poseSheet(S.hero, h.pose);
    }
    void CEIL; void SL;
  }
}
