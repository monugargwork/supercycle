// The TCGplayer reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "../../engine/paint";
import { Pen } from "../../engine/toon";
import { LIGHTS, LOOK, LightPreset } from "../../engine/lights";
import { TONE, CHAR, untone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { Pool, Actor, Fx, stage, Stage, plateZ, leverAngle, twinX, sackPose, OWNER_EYE } from "./cast";
import { buildSets, Sets, redraw, TY } from "./sets";
import { laptopPage, tvPage, botScreen, envelopeFace, boardFace, hqWindow, nameplate, letterSheet, programSheet, chatPhone, Page } from "./art2";
import { SHOTS, ShotDef, camAt, smooth, clamp01, easeOut, SHOWN, HOMEP, HQP, SHP, TV1, STAMP1, HEAD2, MAGIC2, POKE2, BADGE2, LEVER3, FLAP3, FIRE4, CUT4,
  COINS6, BLOCK6, OFF6, DROP7, PLANE10, STAMPS11, CLIMB12, FLIP14, TYPE15, SEND15, SACK16 } from "./story";

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
    this.sun.castShadow = false; // quality bar: no shadows at all
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
    cam.fov = c.fov; cam.near = c.pos[1] > 20 ? 1.0 : 0.12; // 0.12 m (not 0.05): twice the depth precision, less z-fighting far away
    cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld(); // (was swallowed by the comment above in the base reels: the plan's fov never applied)
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
    const S = this.S, place = SHOTS[id - 1].place, H = HOMEP, Q = HQP;
    if (place === "home") {
      const pg = pageAt(id, f); redraw(S.laptop, JSON.stringify(pg), (p) => { p.g.scale(2.5, 2.5); laptopPage(p, pg); });
      const tvv = tvAt(id, f); redraw(S.tv, `${tvv.v}|${tvv.up}`, (p) => tvPage(p, tvv.v, tvv.up));
      const bs = id < 6 || (id === 6 && f < BLOCK6) ? 0 : id === 6 && f < OFF6 ? 1 : 2, fl = id === 6 && f >= BLOCK6 && f < BLOCK6 + 6 ? 1 : 0;
      redraw(S.bot, `${bs}|${fl}`, (p) => botScreen(p, bs, fl));
      const st = id > 1 || f >= STAMP1 ? 1 : 0; redraw(S.env, String(st), (p) => envelopeFace(p, st));
      S.env.tex.needsUpdate = S.env.tex.needsUpdate; // (keyed)
      // coins: a stack of 10; three hop into the PHÍ jar in S06 and stay there
      const [cx, , cz] = H.coins, [jx, , jz] = H.jar;
      S.homeCoins.forEach((m, i) => {
        const k = 9 - i; // the top coins go first
        const t0 = k < 3 ? COINS6[k] : 1e9, ff = id < 6 ? -1e9 : id > 6 ? 1e9 : f;
        const rest: [number, number, number] = [cx, TY + 0.003 * i, cz], jarP: [number, number, number] = [jx + 0.012 * (k - 1), TY + 0.006 + 0.003 * k, jz + 0.01 * k];
        if (ff < t0) m.position.set(...rest);
        else if (ff < t0 + 12) { const u = (ff - t0) / 12; m.position.set(cx + (jarP[0] - cx) * u, rest[1] + (jarP[1] - rest[1]) * u + 0.25 * Math.sin(Math.PI * u), cz + (jarP[2] - cz) * u); m.rotation.set(u * 8, 0, u * 3); return; }
        else m.position.set(...jarP);
        m.rotation.set(0, 0, 0);
      });
      const showCake = id >= 5 && id <= 7;
      S.plate.visible = S.cakeBox.visible = showCake; S.plate.position.set(H.plate[0], TY, plateZ(id, f));
    }
    if (place === "hq") {
      const bv = boardAt(id, f); redraw(S.board, `${bv.v}|${bv.spin}`, (p) => boardFace(p, bv.v, bv.spin));
      const fw: [number, number, number, string][] = id === 4 ? FIRE4.map((t, i) => [clamp01((f - t) / 22), [150, 420, 260][i], [180, 120, 260][i], ["#ffd23a", "#ff6b9a", "#6bd5ff"][i]]) : [];
      const pl = id === 10 ? clamp01((f - PLANE10[0]) / (PLANE10[1] - PLANE10[0])) : -1;
      redraw(S.win, `${fw.map((x) => Math.round(x[0] * 30)).join(",")}|${Math.round(pl * 40)}|${id === 10 ? 1 : 0}`, (p) => hqWindow(p, fw, id === 10 && f >= PLANE10[0] && f < PLANE10[1] ? pl : -1, id === 10 ? 1 : 0));
      S.lever.rotation.set(leverAngle(id, f), 0, 0);
      S.cake.visible = id === 3 || id === 4; S.slice.visible = id === 4 && f >= CUT4;
      if (S.slice.visible) { const u = smooth(clamp01((f - CUT4) / 6)); S.slice.rotation.set(0, 0, -0.14 * u); S.slice.position.set(Q.side[0] + 0.12 + 0.02 * u, Q.side_y + 0.072, Q.side[1] + 0.06); }
      // the nameplate: a full spin on FLIP14, the name changes half way
      const fl = id === 14 ? clamp01((f - FLIP14) / 8) : id > 14 ? 1 : 0;
      S.nameG.rotation.set(-Math.PI * 2 * smooth(fl), 0, 0);
      const nm = fl >= 0.5 ? "RON JAIVEN" : "ROB BIGLER"; redraw(S.name, nm, (p) => nameplate(p, nm));
      const ns = id < 11 ? 0 : id > 11 ? 2 : (f >= STAMPS11[1] ? 2 : f >= STAMPS11[0] ? 1 : 0); redraw(S.letter, String(ns), (p) => letterSheet(p, ns));
      const fx2 = id < 11 ? 0 : id > 11 ? 1 : clamp01((f - STAMPS11[2]) / 2); redraw(S.prog, String(fx2), (p) => programSheet(p, fx2));
    }
    if (place === "syr") {
      const u = id === 8 ? smooth(clamp01((f - 972) / 22)) : 0;
      S.shutter.position.y = SYRP_DH * (1 - u) + (id === 8 && f >= 994 ? 0.01 * Math.max(0, Math.sin((f - 994) * 1.1)) * Math.exp(-(f - 994) / 4) : 0);
    }
    if (place === "market") { S.twin.position.set(twinX(id, f), 0, 0); }
    if (place === "shop") {
      const ph = S.phoneMesh;
      if (f >= 2068) {
        ph.visible = true; ph.position.set(...(SHP.phone as [number, number, number])); ph.up.set(0, 1, 0);
        ph.parent!.updateMatrixWorld(true); ph.lookAt(...OWNER_EYE());
        const typed = TYPE15.map(([a, b]) => clamp01((f - a) / (b - a))), sent = f >= SEND15 ? easeOut((f - SEND15) / 10) : 0;
        redraw(S.phone, `${typed.map((t) => Math.round(t * 60)).join(",")}|${Math.round(sent * 20)}`, (p) => chatPhone(p, typed, sent));
      } else ph.visible = false;
    }
    if (place === "board") {
      const v = 1000000000 + Math.round(Math.max(0, f - 2209) * 95000 / 1000) * 1000; redraw(this.S.board2, String(v), (p) => boardFace(p, v, 0));
      const sp = sackPose(f); S.sack.position.set(BDP_SACK[0], BDP_SACK[1] + sp.y, BDP_SACK[2]); S.sack.scale.set(1 + (1 - sp.sq) * 0.5, sp.sq, 1 + (1 - sp.sq) * 0.5);
    }
  }
  /** props the cast moves (stage() returns where they are this frame, in the world) */
  private placeProps(id: number, f: number, st: Stage) {
    const S = this.S, pr = st.props, set = (o: THREE.Object3D, k: string) => { const q = pr[k]; if (!q) return; o.visible = q.vis !== false; if (!o.visible) return; o.parent!.updateMatrixWorld(true); const w = new THREE.Vector3(...(q.p as [number, number, number])); o.parent!.worldToLocal(w); o.position.copy(w); o.rotation.set(q.rx ?? 0, q.ry ?? 0, q.rz ?? 0); };
    if (SHOTS[id - 1].place === "syr") S.boxes.forEach((b, i) => set(b, `box${i}`));
    if (SHOTS[id - 1].place === "market") { set(S.bag, "bag"); set(S.scale, "scale"); S.mkCoins.forEach((m, i) => set(m, `mkcoin${i}`)); }
    void f;
  }
}

const SYRP_DH = 2.8;
/** quality bar: warm neutral shade side and a richer saturation (the reference reels sit at 25-39 mean saturation) */
const BRIGHT = { shade: [0.62, 0.58, 0.54] as [number, number, number], lift: [0.1, 0.08, 0.05] as [number, number, number], sat: 1.3 };
const BDP_SACK = [0.0, 0.75, -1.3];
const k01 = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
/** the laptop page this frame */
const pageAt = (id: number, f: number): Page => {
  if (id === 1) return { mode: "market", head: 1 };
  if (id === 2 && f >= MAGIC2 - 8 && f < BADGE2 + 10) return { mode: "market", hero: f < POKE2 ? "mtg_bolt" : "zard151" };
  if (id === 2) return { mode: "market", head: 0.4 + 0.6 * k01(f, HEAD2 - 6, HEAD2 + 4), magic: Math.min(4, Math.max(0, Math.floor((f - MAGIC2) / 3) + 1)), poke: Math.min(4, Math.max(0, Math.floor((f - POKE2) / 3) + 1)), badge: Math.round(easeOut(k01(f, BADGE2 + 10, BADGE2 + 20)) * 20) / 20 };
  if (id === 7) { const fall = k01(f, DROP7[0], DROP7[1]); return { mode: "listing", drop: Math.round(Math.min(1, fall * fall) * 60) / 60, slam: f >= DROP7[1] ? Math.round(easeOut(k01(f, DROP7[1], DROP7[1] + 5)) * 20) / 20 : 0 }; }
  if (id > 7) return { mode: "listing", drop: 1, slam: 1 };
  return { mode: "listing" };
};
/** the wall TV: the GMV counter */
const tvAt = (id: number, f: number) => {
  if (id === 1) return { v: Math.round(999999000 + 1000 * easeOut(k01(f, TV1[0], TV1[1]))) , up: 0 };
  if (id === 12) { const u = k01(f, CLIMB12[0], CLIMB12[1]); return { v: 1000000000 + Math.round(u * 87) * 1000000 + Math.round(u * 400) * 1000, up: Math.round(u * 10) / 10 }; }
  return { v: 1000000000, up: 0 };
};
/** the HQ board */
const boardAt = (id: number, f: number) => {
  if (id === 3) {
    if (f < LEVER3[0]) return { v: 987000000, spin: 0 };
    if (f < FLAP3[1]) { const u = k01(f, FLAP3[0], FLAP3[1]); return { v: Math.round(987000000 + 13000000 * easeOut(u)), spin: Math.round((f % 6) / 6 * 10) / 10 + 0.01 }; }
    return { v: 1000000000, spin: 0 };
  }
  return { v: 1000000000, spin: 0 };
};
