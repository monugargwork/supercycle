// The attic Pokémon reel as one three.js scene: painted sky, camera-relative sun frozen per shot, the sets (sets.ts) and
// the cast (cast.ts). update(id, f, camera) poses everything for shot `id` at frame f (a pure function of id + f).
import * as THREE from "three";
import { ctex, cloudHD } from "./paint";
import { Pen } from "./toon";
import { LIGHTS, LOOK, LightPreset } from "./lights";
import { TONE, CHAR, untone } from "./shade";
import { NOINK } from "./ink";
import { Pool, Actor, Fx, stage } from "./cast";
import { buildSets, Sets } from "./sets";
import { crtPage, priceBoard } from "./art";
import { SHOTS, ShotDef, camAt, smooth, easeOut, clamp01, V3, HATCH_SLAM, SHUT8, CORD, GLOW, CLICKS, CLICK2, LADDER_TOP, LADDER_BOT, STACK_AT, BINDER, boardValue, dustAt } from "./story";

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
  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const s = SHOTS[id - 1], L = LIGHTS[s.light], K = LOOK[s.light];
    const c = camAt(id, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = c.pos[1] > 20 ? 1.0 : 0.05; cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = V(...c.look), dist = cam.position.distanceTo(focus);
    cam.layers.enable(NOINK);
    // ---- light rig ----
    const sunDir = this.shotSun(id, s, L);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    let Rr = THREE.MathUtils.clamp(dist * 1.15 + 7, 10, 95);
    if (s.light === "golden") Rr = Math.max(Rr, 22);
    this.sun.position.copy(focus).addScaledVector(sunDir, 220); this.sun.target.position.copy(focus);
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
    for (const [name, g] of Object.entries(this.S.groups)) g.visible = name === s.place;
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
    const S = this.S;
    // the loft hatch: open (PI/2) or shut, by shot; it slams on "quên" (hook), shuts in shot 8, drops open on the cord (10, 20)
    let a = 0;
    if (id === 1) a = f < 116 ? Math.PI / 2 : f < HATCH_SLAM ? (Math.PI / 2) * (1 - easeOut((f - 116) / 9) ** 2) : 0;
    else if (id === 8) a = f < SHUT8 - 8 ? Math.PI / 2 : f < SHUT8 ? (Math.PI / 2) * (1 - ((f - SHUT8 + 8) / 8) ** 2) : 0;
    else if (id === 10) { const u = (f - CORD) / 8; a = u <= 0 ? 0 : u < 1 ? (Math.PI / 2) * u * u : Math.PI / 2 - 0.12 * Math.sin((u - 1) * 3) * Math.exp(-(u - 1) * 2); }
    else if (id === 20) { const u = (f - (GLOW - 10)) / 10; a = u <= 0 ? 0 : (Math.PI / 2) * Math.min(1, u * u); }
    else if (id === 6) a = 0;
    S.hatch.rotation.x = a; S.cord.rotation.x = -a;
    // the sliding ladder: out of sight until the hatch hangs open, then down its own axis with a little bounce
    const dir = V(LADDER_TOP[0] - LADDER_BOT[0], LADDER_TOP[1] - LADDER_BOT[1], LADDER_TOP[2] - LADDER_BOT[2]), L = dir.length(); dir.normalize();
    let slide = 0;
    if (id === 10) { const u = (f - (CORD + 8)) / 10; slide = u <= 0 ? L : u < 1 ? L * (1 - u * u) : -0.03 * Math.sin((u - 1) * 6) * Math.exp(-(u - 1) * 3); }
    else if (id === 20) slide = f < GLOW + 20 ? L : 0;
    else if (id === 8) slide = 0;
    else if (id === 1) slide = 0;
    else slide = L;
    S.ladder.visible = slide < L - 0.01;
    S.ladder.position.set(LADDER_BOT[0] + dir.x * slide, LADDER_BOT[1] + dir.y * slide, LADDER_BOT[2] + dir.z * slide);
    S.ladder.quaternion.setFromUnitVectors(V(0, 1, 0), dir);
    // the gold light in the hatch at the end
    S.glow.opacity = id === 20 ? smooth((f - GLOW) / 14) : 0;
    // study era: the beige CRT (late 90s) or the flat screen (15 years later); parcels pile up between shots; the paper
    const era90 = [4, 5, 7, 16, 17].includes(id);
    S.crt.visible = era90; S.flat.visible = id === 9;
    const nParcels = ({ 4: 1, 5: 2, 7: 5, 16: 3, 17: 3 } as Record<number, number>)[id] ?? 0;
    S.parcels.forEach((p, i) => (p.visible = i < nParcels));
    S.paper.visible = id === 9;
    if (era90) { // the web page: three purchases stamped one by one, the cursor pressing each button
      const all = [...CLICKS, CLICK2], bought = Math.min(3, all.filter((c) => f >= c + 2).length), cur = Math.min(2, CLICKS.filter((c) => f >= c - 8).length - 1 + (f < CLICKS[0] - 8 ? 1 : 0));
      const press = all.some((c) => f >= c - 2 && f < c + 2), key = `${bought}|${cur}|${press}`;
      if (key !== S.crtScreen.key) { S.crtScreen.key = key; S.crtScreen.g.setTransform(1, 0, 0, 1, 0, 0); crtPage(new Pen(S.crtScreen.g), bought, Math.max(0, cur), press); S.crtScreen.tex.needsUpdate = true; }
    }
    // the auction price board
    const v = boardValue(f), bk = String(v);
    if (bk !== S.board.key) { S.board.key = bk; S.board.g.setTransform(1, 0, 0, 1, 0, 0); priceBoard(new Pen(S.board.g), v); S.board.tex.needsUpdate = true; }
    // the son's football: rests by the toy box, then rolls off ahead of him
    if (id === 6) { const t = Math.max(0, f - 673), x = -0.95 + 0.055 * t, hop = Math.abs(Math.sin(t * 0.35)) * 0.12 * Math.exp(-t / 40); S.ball.position.set(x, 0.11 + hop, 1.3); S.ball.rotation.z = -t * 0.5; S.ball.visible = true; }
    else S.ball.visible = false;
  }
  /** pieces the cast drives (stage()): the stack and the openable binder */
  private placeProps(id: number, f: number, st: { stack?: { p: V3; ry?: number; lift?: number; tilt?: number } | null; book?: { p: V3; open: number; ry?: number } | null }) {
    const S = this.S, place = SHOTS[id - 1].place;
    const inAttic = place === "house" && id !== 20;
    const sp = st.stack ?? (inAttic && id !== 6 && id !== 10 ? { p: STACK_AT } : null);
    S.stack.visible = !!sp && (place === "house" || place === "auction") && id !== 20;
    if (sp) { S.stack.position.set(...sp.p); S.stack.rotation.set(0, sp.ry ?? 0, 0); }
    const top = S.binders[5];
    top.position.y = 5 * BINDER.h + (sp?.lift ?? 0); top.rotation.set(sp?.tilt ?? 0, 0.03 * Math.sin(5 * 3.1), 0);
    S.dust.opacity = place === "house" ? 0.8 * dustAt(f) : 0;
    S.book.g.visible = !!st.book;
    if (st.book) { S.book.g.position.set(...st.book.p); if (S.book.g.parent) { S.book.g.parent.updateWorldMatrix(true, false); S.book.g.parent.worldToLocal(S.book.g.position); } S.book.g.rotation.set(0, st.book.ry ?? 0, 0); S.book.hinge.rotation.z = st.book.open; }
    void f;
  }
}
