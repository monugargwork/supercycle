// The Lucas reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { LIGHTS, LOOK, LightPreset } from "../../engine/lights";
import { TONE, CHAR, untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { Pool, Actor, Fx, stage, Stage, weighAt, PACKS, PACK_T, queueShift, carX } from "./cast";
import { buildSets, Sets, redraw } from "./sets";
import * as A2 from "./art2";
import { clockFace } from "./art";
import * as S from "./story";
import { SHOTS, ShotDef, camAt, smooth, clamp01, easeOut, SHOWN, HOME, HALL, STREET, SHOP, V3 } from "./story";

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
    const Sx = this.S, place = SHOTS[id - 1].place, k = (a: number, b: number) => clamp01((f - a) / (b - a));
    if (place === "home") {
      // door: closed, except the hook (flies open f12-16, bounces, settles 95 deg) and the glide that follows
      const dk = id === 1 ? (f < S.DOOR1 ? 0 : 1.66 + 0.25 * Math.exp(-(f - S.DOOR1 - 4) / 5) * Math.cos((f - S.DOOR1 - 4) * 0.9) * (f > S.DOOR1 + 4 ? 1 : 0) - (f < S.DOOR1 + 4 ? 1.66 * (1 - (f - S.DOOR1) / 4) : 0)) : id === 2 ? 1.66 : 0;
      Sx.door.rotation.y = Math.max(0, Math.min(1.9, dk));
      // clock (minutes since midnight)
      const mins = id === 1 ? 420 + 45 * k(S.CLOCK45[0], S.CLOCK45[1]) + 120 * k(S.CLOCK120[0], S.CLOCK120[1]) : id === 2 ? 585 + (f - 268) * 0.05 : id === 11 ? 465 + 120 * k(S.CLOCK11[0], S.CLOCK11[1]) : id === 8 ? 705 : 600;
      redraw(Sx.clock, String(Math.round(mins * 2)), (p) => clockFace(p, mins));
      // calendar: pages torn so far
      const pg = calPageAt(id, f); const P = A2.CAL_PAGES[Math.min(A2.CAL_PAGES.length - 1, pg)];
      redraw(Sx.cal, String(pg), (p) => A2.calPage(p, ...P));
      // the weighing
      const weigh = id === 1 || id === 2 || id === 8 || id === 11;
      const w = weighAt(id, f);
      Sx.chairDealer.visible = weigh; Sx.scaleG.visible = weigh; Sx.chairsPair.visible = id >= 16;
      Sx.packs.forEach((m, i) => {
        m.visible = weigh;
        if (!weigh) return;
        const inHand = w.held && w.held.k === i, onPan = w.pan === i;
        if (inHand || onPan) { m.visible = false; return; }
        if (i < w.done) m.position.set(HOME.done[0], HOME.table_y + 0.004 + PACK_T * i + 0.0055, HOME.done[2]);
        else m.position.set(HOME.todo[0], HOME.table_y + 0.004 + PACK_T * (PACKS - 1 - i) + 0.0055, HOME.todo[2]);
        m.rotation.set(0, 0.05 * Math.sin(i * 2.3), 0);
      });
      Sx.panPack.visible = weigh && w.pan !== null;
      redraw(Sx.lcd, `${w.grams}|${Math.round(w.lamp * 10)}`, (p) => A2.lcd(p, w.grams, w.lamp));
      Sx.groups.home.children.forEach(() => undefined);
      // tubs: full in S03 (lids burst off), empty elsewhere (lids leaning against the wall)
      const [bw, bh] = HOME.bin_size;
      Sx.tubPacks.visible = id === 3;
      Sx.lids.forEach((m, i) => {
        const [bx, bz] = HOME.bins[i], top: V3 = [bx, bh + 0.0125, bz], lean: V3 = [bx + bw / 2 + 0.1, 0.33, bz];
        const u = id === 3 ? clamp01((f - S.LIDS3[i]) / 12) : id < 3 && id !== 1 && id !== 2 ? 0 : 1;
        const hopY = id === 3 && f >= S.LIDS3[i] ? 0.06 * Math.sin(Math.PI * clamp01((f - S.LIDS3[i]) / 6)) : 0;
        const e = smooth(u);
        m.position.set(top[0] + (lean[0] - top[0]) * e, top[1] + (lean[1] - top[1]) * e + hopY, top[2]);
        m.rotation.set(0, 0, -1.32 * e);
      });
      Sx.heroPacks.forEach((m, i) => {
        m.visible = id === 3 && f >= S.RISE3[i];
        if (!m.visible) return;
        const [bx, bz] = HOME.bins[1], u = clamp01((f - S.RISE3[i]) / 10), x = bx - 0.15 + i * 0.1, z1 = bz + HOME.bin_size[2] / 2 - 0.01;
        const y0 = 0.2, y1 = HOME.bin_size[1] + 0.081;
        m.position.set(x, y0 + (y1 - y0) * u + 0.18 * Math.sin(Math.PI * u), bz + (z1 - bz) * u);
        const gl = id === 3 && f >= S.GLINT3[i] && f < S.GLINT3[i] + 6 ? 1 : 0;
        m.rotation.set(-0.5 * u, 0, 0.3 * (1 - u) * Math.sin(i * 2 + 1));
        m.scale.setScalar(1 + 0.06 * gl);
      });
      // the phone: on the table (S07 the reply, S08 the transfer), held for the POV (S10 the refund message)
      const ph = Sx.phone; ph.visible = id === 7 || id === 8 || id === 10;
      if (id === 7 || id === 8) {
        ph.position.set(...(HOME.phone as V3)); ph.position.y = HOME.table_y + 0.004; ph.rotation.set(-Math.PI / 2, 0, 0.15);
        const buzz = id === 7 && f >= S.BUZZ7 && f < S.BUZZ7 + 14 ? 0.004 * Math.sin(f * 3.1) : 0; ph.position.x += buzz;
        if (id === 7) redraw(Sx.phoneCv, `n${f >= S.BUZZ7 ? Math.round(clamp01((f - S.BUZZ7) / 8) * 8) : 0}`, (p) => A2.notice(p, "LA DEALER", "I'll take all of it. Coming tomorrow.", f >= S.BUZZ7 ? (f - S.BUZZ7) / 8 : 0));
        else redraw(Sx.phoneCv, `t${f >= S.PAID8 ? Math.round(clamp01((f - S.PAID8) / 8) * 8) : 0}`, (p) => A2.notice(p, "BANK", "Transfer received", f >= S.PAID8 ? (f - S.PAID8) / 8 : 0, true));
      } else if (id === 10) {
        const L = HOME.lucas; ph.position.set(L[0] + 0.02, 1.2, L[1] - 0.32); ph.up.set(0, 1, 0); ph.parent!.updateMatrixWorld(true);
        const e = new THREE.Vector3(L[0] + 0.03, 1.56, L[1] + 0.08).add(ph.parent!.position); ph.lookAt(e);
        const n = Math.round(30 * k(S.TYPE10[0], S.TYPE10[1]));
        redraw(Sx.phoneCv, `s${n}`, (p) => A2.chatOne(p, "LA DEALER", [{ t: "about the packs" }, { t: "", photo: "zard_base" }, { t: "Thought these were SHADOWLESS. Refund.", n: n ? n + 9 : 0, red: "SHADOWLESS" }]));
      }
      Sx.lampG.visible = id < 16;
      Sx.laptop.visible = id === 17;
      if (id === 17) { const n = Math.round(A2.POST17.length * k(S.TYPE17[0], S.TYPE17[1])), pr = f >= S.POST17 && f < S.POST17 + 4 ? 1 : 0; redraw(Sx.laptopCv, `${n}|${pr}|${f >= S.POST17 + 4}`, (p) => A2.laptopPost(p, n, pr, f >= S.POST17 + 4)); }
      Sx.pizza.visible = id >= 16;
      Sx.candies.forEach((c, i) => { c.visible = id >= 16 && !(id === 18 && i === 0 && f >= S.GRAB18); });
    }
    if (place === "hall") {
      const mins = 600 + 90 * k(S.CLOCK90[0], S.CLOCK90[1]) + (id === 6 ? 90 : 0);
      redraw(Sx.hallClock, String(Math.round(mins * 2)), (p) => clockFace(p, mins));
      const sh = id === 5 ? queueShift(f) : -0.6;
      Sx.truck.position.set(HALL.truck[0] + sh, 0, HALL.truck[1]);
      const hp = Sx.hallPhone; hp.visible = id === 6;
      if (id === 6) {
        hp.position.set(...(HALL.phone as V3)); hp.up.set(0, 1, 0); hp.parent!.updateMatrixWorld(true);
        hp.lookAt(new THREE.Vector3(...(HALL.eye as V3)).add(hp.parent!.position));
        const sent = Math.round(12 * k(S.SEND6[0], S.SEND6[1])), rep = Math.round(12 * k(S.REPLY6[0], S.REPLY6[1])), gh = Math.round(12 * k(S.GHOST6[0], S.GHOST6[1]));
        redraw(Sx.hallPhoneCv, `${sent}|${rep}|${gh}`, (p) => A2.chatList(p, sent, rep, gh));
      }
    }
    if (place === "street") {
      if (id === 12) { Sx.carL.position.set(carX(f), 0, STREET.car_z); Sx.carL.rotation.y = 0; }
      else { Sx.carL.position.set(STREET.car_l[0], 0, STREET.car_l[1]); Sx.carL.rotation.y = 0; }
      Sx.lotBox.visible = id === 13;
    }
    if (place === "shop") {
      const n = Math.round(A2.CHECK_NAME.length * k(S.WRITE14[0], S.WRITE14[1]));
      redraw(Sx.checkCv, String(n), (p) => A2.check(p, n));
      const on = f >= S.SCAN14[0] && f < S.SCAN14[1];
      (Sx.scanWin.material as THREE.MeshBasicMaterial).color.setRGB(on ? 3.0 : 0.5, on ? 0.3 : 0.05, on ? 0.3 : 0.05);
    }
    void smooth; void easeOut; void SHOP;
  }
  /** props the cast moves (stage() returns where they are this frame) */
  private placeProps(id: number, f: number, st: Stage) {
    void id; void f;
    const b = st.props.box; if (b) { this.S.lotBox.position.set(b.p[0], b.p[1], b.p[2]); this.S.lotBox.rotation.y = b.ry ?? 0; }
    const s = st.props.shopbox; if (s) { this.S.shopBox.position.set(s.p[0], s.p[1], s.p[2]); }
  }
}

/** how many calendar pages are torn at frame f (CAL_PAGES: 6, 7, 8, 9/30, Monday, then the eight months) */
const calPageAt = (id: number, f: number) => {
  if (id < 7) return 3;
  if (id === 7) return Math.min(3, Math.floor(Math.max(0, f - S.CAL7[0]) / 11));
  if (id === 8) return 3;
  if (id <= 11) return 4;
  if (id === 15) return 4 + Math.min(9, Math.floor(Math.max(0, f - S.PAGES15[0]) / 5.5));
  return 13;
};
