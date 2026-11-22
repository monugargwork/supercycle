// The Gengar reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { LIGHTS, LOOK, LightPreset } from "../../engine/lights";
import { TONE, CHAR, untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { Pool, Actor, Fx, stage, Stage, markerY, iouPose } from "./cast";
import { buildSets, Sets, redraw } from "./sets";
import { cgcSlab, tagFace, tagGhost, priceBoard, bidCounter, historyPage, phonePage, iouNote, GONE_ORDER, ROWS } from "./art2";
import { SHOTS, ShotDef, camAt, smooth, clamp01, easeOut, SHOWN, HALLP, CAFP, SLAM1, FLICK2, GHOST2, LIFT2, FADE2, GLEAM3, GRADE3, BIDS4, LAND4,
  CLIMB6, SLAM6, GLEAM7, ROWS12, NOMONEY12, BTN13, BIG14, SCROLL14, PAID14, SOLID11, STAMP11, MEGA11, THUMP11 } from "./story";

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
    const S = this.S, place = SHOTS[id - 1].place, H = HALLP;
    if (place === "hall") {
      // the price board and the bid counter
      const bv = boardAt(id, f); redraw(S.board, `${bv.v}|${bv.sold}|${bv.ok}`, (p) => priceBoard(p, bv.v, bv.sold, bv.ok));
      const bc = bidsAt(id, f); redraw(S.bids, `${bc.n}|${bc.flap}`, (p) => bidCounter(p, bc.n, bc.flap));
      // the slab on the plinth: Gengar (S01-S05, S15), Latios (S06-S14)
      const img = id >= 6 && id <= 14 ? "dx_latios_star" : "lc_gengar";
      const gl = id === 3 ? Math.round(k01(f, GLEAM3[0], GLEAM3[1]) * 30) / 30 : 0, fl = id === 3 && f >= GRADE3 ? Math.round(clamp01(1 - (f - GRADE3 - 10) / 20) * 10) / 10 : 0;
      redraw(S.slabC, `${img}|${gl}|${fl}`, (p) => cgcSlab(p, 540, 860, img, { gleam: gl, flash: fl }));
      this.poseTag(id, f);
      S.markerNew.position.y = markerY(id, f);
      S.cordKnot.position.y = 1.3 + (id === 5 ? 0.35 * (1 - ((markerY(id, f) - 1.0) * 8 / 1.604) % 1) : 0.2);
      S.button.position.y = H.rostrum_y + 0.01 - (id === 13 && f >= BTN13 && f < BTN13 + 6 ? 0.008 : 0);
      if (id === 14) { const sc = Math.round(smooth(k01(f, SCROLL14[0], SCROLL14[1])) * 60) / 60, pd = f >= PAID14 ? Math.round(easeOut(k01(f, PAID14, PAID14 + 6)) * 20) / 20 : 0; redraw(S.phone, `${sc}|${pd}`, (p) => phonePage(p, sc, pd)); }
    }
    if (place === "census") { const gl = id === 7 ? Math.round(k01(f, GLEAM7[0], GLEAM7[1]) * 30) / 30 : 0; redraw(S.censusSlab, String(gl), (p) => cgcSlab(p, 540, 860, "dx_latios_star", { gleam: gl })); }
    if (place === "cafe") {
      const io = iouPose(id, f), solid = id === 11 ? Math.round(smooth(k01(f, SOLID11[0], SOLID11[1])) * 20) / 20 : 0, st = id === 11 && f >= STAMP11 ? Math.round(easeOut(k01(f, STAMP11, STAMP11 + 5)) * 20) / 20 : 0;
      S.iou.position.set(io.p[0] + (io.ghost > 0.5 ? 0.002 * Math.sin(f * 0.7) : 0), io.p[1], io.p[2]); S.iou.rotation.set(-Math.PI / 2, 0, io.ghost * 0.04 * Math.sin(f * 0.13));
      S.iouMat.opacity = 0.72 + 0.28 * solid; redraw(S.iouC, `${solid}|${st}`, (p) => iouNote(p, solid, st));
      // the cups hop on each shout pulse and on the thump
      const kicks = id === 11 ? [MEGA11[0] + 8, MEGA11[0] + 16, MEGA11[0] + 24, THUMP11] : [];
      S.cups.forEach((c, i) => { let y = 0; for (const t of kicks) y = Math.max(y, hop(f, t + i, t === THUMP11 ? 0.55 : 0.3)); c.position.y = CAFP.table_y + y; c.rotation.z = y * 2 * (i ? 1 : -1); });
    }
    if (place === "desk") {
      const gone = ROWS.map((_, i) => { const n = GONE_ORDER.indexOf(i); return n < 0 || id !== 12 ? 0 : Math.round(k01(f, ROWS12[n], ROWS12[n] + 24) * 24) / 24; });
      const total = GONE_ORDER.reduce((a, r, n) => a + ROWS[r].price * (id === 12 ? clamp01((f - ROWS12[n]) / 12) : 0), 0);
      const cnt = Math.round(total / 1000) * 1000 + (id === 12 && f > ROWS12[4] ? 1002000 + Math.round(easeOut(k01(f, ROWS12[4], 1950)) * 52) * 1000 : 0);
      redraw(S.laptop, `${gone.join(",")}|${cnt}|${f >= NOMONEY12}`, (p) => historyPage(p, gone, cnt, f >= NOMONEY12));
    }
  }
  /** the tag: LOT n flips to SOLD on the gavel and swings; S02 the flick spins it to its back, it ghosts and floats away */
  private poseTag(id: number, f: number) {
    const S = this.S, [tf, tb] = S.tagPlanes;
    const show = id <= 2 || (id >= 6 && id <= 14);
    tf.visible = tb.visible = show;
    S.tagG.rotation.set(0, 0, 0); tf.position.y = tb.position.y = -HALLP.tag_len - HALLP.tag_size[1] / 2; tf.position.x = tb.position.x = HALLP.tag_size[0] * 0.36;
    S.tagMats.forEach((m) => { m.opacity = 1; });
    if (!show) return;
    const lot = id >= 6 ? "LOT 24" : "LOT 11", price = id >= 6 ? 504000 : 576000, T = id >= 6 ? SLAM6 : SLAM1;
    const flip = id === 1 || id === 6 ? (f < T ? 0 : Math.round(clamp01((f - T) / 4) * 8) / 8) : 1;
    redraw(S.tagFront, `${lot}|${flip}`, (p) => tagFace(p, "front", price, lot, flip));
    if (id === 1 || id === 6) { const t = f - T; S.tagG.rotation.z = t > 0 ? 0.22 * Math.sin(t * 0.55) * Math.exp(-t / 14) : 0.01 * Math.sin(f * 0.1); }
    if (id !== 2) { redraw(S.tagBack, "back", (p) => tagFace(p, "back")); return; }
    // S02: the flick and the spin (1.5 turns to its back), the ghost, the lift and the fade
    const u = clamp01((f - FLICK2) / 26);
    S.tagG.rotation.y = f < FLICK2 ? 0 : 3 * Math.PI * (1 - (1 - u) ** 2.2);
    const k = Math.round(clamp01((f - GHOST2[0]) / (GHOST2[1] - GHOST2[0])) * 20) / 20;
    redraw(S.tagBack, `g${k}`, (p) => (k > 0 ? tagGhost(p, k) : tagFace(p, "back")));
    S.tagMats[1].opacity = 1 - 0.4 * k;
    if (k > 0 && f < LIFT2) tb.position.x += 0.0025 * Math.sin(f * 2.7);
    if (f >= LIFT2) {
      const t = f - LIFT2, rise = 0.0015 * t * t + 0.012 * t;
      tb.position.y += rise; tb.position.x += 0.04 * Math.sin(t * 0.25);
      S.tagMats[1].opacity = (1 - 0.4 * k) * (1 - clamp01((f - FADE2[0]) / (FADE2[1] - FADE2[0])));
    }
  }
  /** props the cast moves (stage() returns where they are this frame, in the world) */
  private placeProps(id: number, f: number, st: Stage) {
    const S = this.S, pr = st.props, set = (o: THREE.Object3D, k: string) => { const q = pr[k]; if (!q) { o.visible = false; return; } o.visible = q.vis !== false; if (!o.visible) return; o.parent!.updateMatrixWorld(true); const w = new THREE.Vector3(...(q.p as [number, number, number])); o.parent!.worldToLocal(w); o.position.copy(w); o.rotation.set(q.rx ?? 0, q.ry ?? 0, q.rz ?? 0); };
    const place = SHOTS[id - 1].place;
    if (place === "cafe") set(S.env, "env");
    if (place === "hall") {
      set(S.phoneMesh, "phone");
      if (S.phoneMesh.visible) { const eye = new THREE.Vector3(2.0, 1.66, 0.75); S.phoneMesh.parent!.updateMatrixWorld(true); S.phoneMesh.parent!.localToWorld(eye); S.phoneMesh.lookAt(eye); }
    }
    void f;
  }
}

const k01 = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
const hop = (f: number, f0: number, v0: number) => {
  let t = (f - f0) / 30, v = v0;
  if (t < 0) return 0;
  for (let i = 0; i < 3; i++) { const T = (2 * v) / 9.8; if (t < T) return v * t - 4.9 * t * t; t -= T; v *= 0.35; }
  return 0;
};
/** the price board this frame */
const boardAt = (id: number, f: number): { v: number | null; sold: boolean; ok: number } => {
  if (id === 1) return f >= SLAM1 ? { v: 576000, sold: true, ok: 0 } : { v: 540000 + Math.min(9, Math.floor(f / 8)) * 4000, sold: false, ok: 0 };
  if (id === 4) { const n = BIDS4.filter((t) => f >= t).length; return { v: n ? 200000 + Math.round((376000 * n) / 32 / 1000) * 1000 : 180000, sold: f >= LAND4, ok: 0 }; }
  if (id === 6) { if (f < CLIMB6[0]) return { v: 400000, sold: false, ok: 0 }; if (f < SLAM6) return { v: 420000 + Math.round(easeOut(k01(f, CLIMB6[0], CLIMB6[1])) * 21) * 4000, sold: false, ok: 0 }; return { v: 504000, sold: true, ok: 0 }; }
  if (id >= 7 && id <= 12) return { v: 504000, sold: true, ok: 0 };
  if (id === 13) return f >= BTN13 + 2 ? { v: null, sold: false, ok: Math.round(clamp01((f - BTN13 - 2) / 4) * 4) / 4 } : { v: 576000, sold: true, ok: 0 };
  if (id === 14) return f >= BIG14 ? { v: 1000000, sold: true, ok: 0 } : { v: null, sold: false, ok: 1 };
  if (id === 15) return { v: null, sold: false, ok: 0 };
  return { v: 576000, sold: true, ok: 0 };
};
/** the bid counter this frame */
const bidsAt = (id: number, f: number) => {
  if (id === 4) { const n = BIDS4.filter((t) => f >= t).length, last = BIDS4[n - 1] ?? -99; return { n, flap: f - last < 3 ? Math.round(((f - last) / 3) * 3) / 3 : 1 }; }
  if (id >= 6 && id <= 12) return { n: 27, flap: 1 };
  if (id === 14) return { n: f >= BIG14 ? 41 : 0, flap: 1 };
  if (id === 13 || id === 15) return { n: 0, flap: 1 };
  return { n: 32, flap: 1 };
};
