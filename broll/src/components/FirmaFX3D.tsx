// FirmaFX3D: 3D/2.5D building blocks for "Superkind baut eine Firma" v2 (2026-10-27, Pius: "mehr Bewegung, alles 3D/2.5D").
// - PostFX: own post pipeline (scene → depth-of-field → motion blur → bloom → lens) on a render target that keeps the
//   normal per-material tone mapping + sRGB output (isXRRenderTarget trick), so UI textures stay true to colour.
// - Plate3D / Sticker3D / Burst / ExtrudedText / Rope / Odometer: thick die-cut objects that live in the world.
// - Orbit camera keys with a monotone Hermite spline (continuous velocity, no stops), handheld noise, motion vectors.
import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { canvasTex, roundRect } from "./Voxel3D";
import { SKC, V3, back, cl, ease, rnd, fitFont } from "./ShirtWorld3D";

// =====================================================================================================
// post pipeline
// =====================================================================================================
export type FX = {
  focus: number; aperture: number; maxBlur: number; // DoF: focus distance (m), strength, max CoC (px)
  mb: [number, number]; zoom: number; // motion blur: screen-space shift (uv) + radial zoom amount over the shutter
  bloom: number; bloomRadius?: number; bloomThreshold?: number;
  chroma?: number; grain?: number; vignette?: number; t: number; near?: number; far?: number;
};
const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const DOF_FRAG = `
#include <packing>
varying vec2 vUv; uniform sampler2D tColor; uniform sampler2D tDepth; uniform float focus, aperture, maxBlur, near, far; uniform vec2 res;
float vz(vec2 uv){ return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, near, far); }
float coc(float z){ return clamp(abs(z - focus) / max(z, 0.001) * aperture, 0.0, 1.0) * maxBlur; }
void main(){
  float z = vz(vUv); float c = coc(z);
  vec4 base = texture2D(tColor, vUv);
  if (c < 0.6) { gl_FragColor = base; return; }
  vec3 acc = base.rgb; float ws = 1.0;
  const int N = 48;
  for (int i = 1; i < N; i++) {
    float r = sqrt(float(i) / float(N)); float a = float(i) * 2.39996323;
    vec2 uv2 = vUv + vec2(cos(a), sin(a)) * r * c / res;
    float cs = coc(vz(uv2));
    float w = clamp(min(cs, c) - r * c + 1.0, 0.0, 1.0);
    acc += texture2D(tColor, uv2).rgb * w; ws += w;
  }
  gl_FragColor = vec4(acc / ws, base.a);
}`;
const MB_FRAG = `
varying vec2 vUv; uniform sampler2D tColor; uniform vec2 dir; uniform float zoom;
void main(){
  if (length(dir) < 0.0006 && abs(zoom) < 0.0006) { gl_FragColor = texture2D(tColor, vUv); return; }
  vec3 acc = vec3(0.0); const int N = 17;
  for (int i = 0; i < N; i++) { float f = float(i) / float(N - 1) - 0.5; vec2 uv2 = vUv + dir * f + (vUv - 0.5) * zoom * f; acc += texture2D(tColor, clamp(uv2, 0.001, 0.999)).rgb; }
  gl_FragColor = vec4(acc / float(N), 1.0);
}`;
const LENS_FRAG = `
varying vec2 vUv; uniform sampler2D tColor; uniform float chroma, grain, vignette, time; uniform vec2 res;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 d = vUv - 0.5; float r2 = dot(d, d);
  vec3 col;
  col.r = texture2D(tColor, vUv + d * chroma * r2 * 4.0).r;
  col.g = texture2D(tColor, vUv).g;
  col.b = texture2D(tColor, vUv - d * chroma * r2 * 4.0).b;
  col *= 1.0 - vignette * smoothstep(0.12, 0.62, r2 * 1.6);
  col += (h(vUv * res + time * 61.0) - 0.5) * grain;
  gl_FragColor = vec4(col, 1.0);
}`;

export const PostFX: React.FC<{ fx: FX }> = ({ fx }) => {
  const { gl, scene, camera } = useThree();
  const fxRef = React.useRef(fx);
  fxRef.current = fx;
  const P = React.useMemo(() => {
    const v = gl.getDrawingBufferSize(new THREE.Vector2());
    const W = v.x, H = v.y;
    const mk = (depth: boolean) => {
      const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: depth ? 4 : 0 });
      rt.texture.colorSpace = THREE.SRGBColorSpace;
      if (depth) {
        rt.depthTexture = new THREE.DepthTexture(W, H);
        rt.depthTexture.type = THREE.UnsignedIntType;
        // render like the screen: per-material tone mapping + sRGB encoding stay exactly as without post
        (rt as unknown as { isXRRenderTarget: boolean }).isXRRenderTarget = true;
      }
      return rt;
    };
    const sceneRT = mk(true), a = mk(false), b = mk(false);
    const mat = (frag: string, uniforms: Record<string, THREE.IUniform>) => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
    const dof = new FullScreenQuad(mat(DOF_FRAG, { tColor: { value: null }, tDepth: { value: null }, focus: { value: 10 }, aperture: { value: 1 }, maxBlur: { value: 10 }, near: { value: 0.1 }, far: { value: 200 }, res: { value: new THREE.Vector2(W, H) } }));
    const mb = new FullScreenQuad(mat(MB_FRAG, { tColor: { value: null }, dir: { value: new THREE.Vector2() }, zoom: { value: 0 } }));
    const lens = new FullScreenQuad(mat(LENS_FRAG, { tColor: { value: null }, chroma: { value: 0.004 }, grain: { value: 0.03 }, vignette: { value: 0.3 }, time: { value: 0 }, res: { value: new THREE.Vector2(W, H) } }));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.4, 0.5, 0.82);
    return { sceneRT, a, b, dof, mb, lens, bloom };
  }, [gl]);
  useFrame(() => {
    const f = fxRef.current;
    const cam = camera as THREE.PerspectiveCamera;
    gl.setRenderTarget(P.sceneRT);
    gl.clear();
    gl.render(scene, cam);
    const du = (P.dof.material as THREE.ShaderMaterial).uniforms;
    du.tColor.value = P.sceneRT.texture; du.tDepth.value = P.sceneRT.depthTexture;
    du.focus.value = f.focus; du.aperture.value = f.aperture; du.maxBlur.value = f.maxBlur; du.near.value = cam.near; du.far.value = cam.far;
    gl.setRenderTarget(P.a); P.dof.render(gl);
    const mu = (P.mb.material as THREE.ShaderMaterial).uniforms;
    mu.tColor.value = P.a.texture; mu.dir.value.set(f.mb[0], f.mb[1]); mu.zoom.value = f.zoom;
    gl.setRenderTarget(P.b); P.mb.render(gl);
    P.bloom.strength = f.bloom; P.bloom.radius = f.bloomRadius ?? 0.55; P.bloom.threshold = f.bloomThreshold ?? 0.82;
    if (f.bloom > 0.001) P.bloom.render(gl, P.a, P.b, 0, false);
    const lu = (P.lens.material as THREE.ShaderMaterial).uniforms;
    lu.tColor.value = P.b.texture; lu.chroma.value = f.chroma ?? 0.004; lu.grain.value = f.grain ?? 0.025; lu.vignette.value = f.vignette ?? 0.32; lu.time.value = f.t;
    gl.setRenderTarget(null); P.lens.render(gl);
  }, 1);
  return null;
};

// soft studio reflections for every standard material ("Glanz")
export const EnvLight: React.FC<{ intensity?: number }> = ({ intensity = 0.35 }) => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
  }, [gl, scene]);
  (scene as unknown as { environmentIntensity: number }).environmentIntensity = intensity;
  return null;
};

export const CameraRig2: React.FC<{ pos: V3; look: V3; fov: number; roll?: number; near?: number; far?: number }> = ({ pos, look, fov, roll = 0, near = 0.4, far = 160 }) => {
  const { camera } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...pos);
  c.fov = fov; c.near = near; c.far = far;
  c.up.set(Math.sin(roll), Math.cos(roll), 0);
  c.lookAt(...look);
  c.updateProjectionMatrix();
  c.updateMatrixWorld();
  return null;
};

// =====================================================================================================
// camera keys: orbit around a pivot, monotone cubic Hermite through all keys → never stands still, no overshoot
// =====================================================================================================
export type CamKey = { t: number; p: V3; yaw: number; pitch: number; dist: number; fov?: number; ap?: number };
type Vec = number[];
const toVec = (k: CamKey): Vec => [k.p[0], k.p[1], k.p[2], k.yaw, k.pitch, k.dist, k.fov ?? 40, k.ap ?? 1];
export const makeCamPath = (keys: CamKey[]) => {
  const ts = keys.map((k) => k.t), vs = keys.map(toVec), n = keys.length, D = vs[0].length;
  // Fritsch–Carlson tangents per component
  const m: Vec[] = vs.map(() => new Array(D).fill(0));
  for (let d = 0; d < D; d++) {
    const del = [] as number[];
    for (let i = 0; i < n - 1; i++) del.push((vs[i + 1][d] - vs[i][d]) / (ts[i + 1] - ts[i]));
    m[0][d] = del[0]; m[n - 1][d] = del[n - 2];
    for (let i = 1; i < n - 1; i++) m[i][d] = del[i - 1] * del[i] <= 0 ? 0 : (del[i - 1] + del[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (del[i] === 0) { m[i][d] = 0; m[i + 1][d] = 0; continue; }
      const a = m[i][d] / del[i], b = m[i + 1][d] / del[i], s = a * a + b * b;
      if (s > 9) { const tt = 3 / Math.sqrt(s); m[i][d] = tt * a * del[i]; m[i + 1][d] = tt * b * del[i]; }
    }
  }
  return (t: number): Vec => {
    if (t <= ts[0]) return vs[0].map((v, d) => v + m[0][d] * (t - ts[0]));
    if (t >= ts[n - 1]) return vs[n - 1].map((v, d) => v + m[n - 1][d] * (t - ts[n - 1]) * 0.6);
    let i = 0; while (t > ts[i + 1]) i++;
    const h = ts[i + 1] - ts[i], u = (t - ts[i]) / h;
    const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
    return vs[i].map((v, d) => h00 * v + h10 * h * m[i][d] + h01 * vs[i + 1][d] + h11 * h * m[i + 1][d]);
  };
};
export const orbitPos = (v: Vec): { pos: V3; look: V3 } => {
  const [px, py, pz, yaw, pitch, dist] = v;
  return { pos: [px + dist * Math.sin(yaw) * Math.cos(pitch), py + dist * Math.sin(pitch), pz + dist * Math.cos(yaw) * Math.cos(pitch)], look: [px, py, pz] };
};
// handheld: tiny layered sines (no randomness → deterministic per frame)
export const handheld = (t: number, amp = 1): [number, number, number] => [
  amp * (0.006 * Math.sin(t * 1.3) + 0.003 * Math.sin(t * 3.7 + 1)),
  amp * (0.004 * Math.sin(t * 1.7 + 2) + 0.002 * Math.sin(t * 4.3)),
  amp * 0.006 * Math.sin(t * 0.9 + 0.5),
];
// screen-space motion of the image centre between two camera poses (uv units) + radial zoom
const _c1 = new THREE.PerspectiveCamera(), _c2 = new THREE.PerspectiveCamera(), _v = new THREE.Vector3();
export const motionVec = (a: { pos: V3; look: V3; fov: number }, b: { pos: V3; look: V3; fov: number }, aspect: number): { mb: [number, number]; zoom: number } => {
  const setC = (c: THREE.PerspectiveCamera, s: typeof a) => { c.fov = s.fov; c.aspect = aspect; c.near = 0.4; c.far = 200; c.position.set(...s.pos); c.up.set(0, 1, 0); c.lookAt(...s.look); c.updateProjectionMatrix(); c.updateMatrixWorld(); };
  setC(_c1, a); setC(_c2, b);
  // point 12 m in front of camera A along its view axis
  const dir = new THREE.Vector3(b.look[0] - b.pos[0], 0, 0); void dir;
  const fw = new THREE.Vector3(); _c1.getWorldDirection(fw);
  const P = new THREE.Vector3(...a.pos).addScaledVector(fw, 12);
  _v.copy(P).project(_c2);
  const da = Math.hypot(a.look[0] - a.pos[0], a.look[1] - a.pos[1], a.look[2] - a.pos[2]);
  const db = Math.hypot(b.look[0] - b.pos[0], b.look[1] - b.pos[1], b.look[2] - b.pos[2]);
  const zoom = (da - db) / Math.max(1, da) + (a.fov - b.fov) / a.fov;
  return { mb: [-_v.x * 0.5, -_v.y * 0.5], zoom };
};

// =====================================================================================================
// geometry + materials
// =====================================================================================================
const geoCache = new Map<string, THREE.BufferGeometry>();
export const roundRectGeo = (w: number, h: number, r: number, d: number, bevel = 0.04) => {
  const key = [w, h, r, d, bevel].map((x) => x.toFixed(3)).join("/");
  const hit = geoCache.get(key);
  if (hit) return hit;
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2, rr = Math.min(r, w / 2, h / 2);
  s.moveTo(x + rr, y); s.lineTo(x + w - rr, y); s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr); s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h); s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr); s.quadraticCurveTo(x, y, x + rr, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 10 });
  g.translate(0, 0, -d / 2);
  g.computeVertexNormals();
  geoCache.set(key, g);
  return g;
};

// thick die-cut plate with a textured face (texture covers w×h, transparent corners are cut by alphaTest)
export const Plate3D: React.FC<{
  w: number; h: number; d?: number; r?: number; tex?: THREE.Texture; body?: string; edge?: string; glow?: number;
  p?: V3; rot?: V3; s?: number | V3; backTex?: THREE.Texture; rough?: number; children?: React.ReactNode; shadow?: boolean;
}> = ({ w, h, d = 0.12, r = 0.18, tex, body = "#FFFFFF", edge = SKC.INK, glow = 0.55, p = [0, 0, 0], rot = [0, 0, 0], s = 1, backTex, rough = 0.35, children, shadow = true }) => {
  const bev = Math.min(0.05, d * 0.35);
  const geo = roundRectGeo(w, h, r, d, bev);
  return (
    <group position={p} rotation={rot} scale={s}>
      <mesh geometry={geo} castShadow={shadow} receiveShadow>
        <meshStandardMaterial attach="material-0" color={body} roughness={rough} metalness={0.05} />
        <meshStandardMaterial attach="material-1" color={edge} roughness={0.5} />
      </mesh>
      {tex && (
        <mesh position={[0, 0, d / 2 + bev + 0.004]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#FFFFFF" emissiveIntensity={glow * 0.4} roughness={rough} metalness={0} alphaTest={0.5} transparent={false} />
        </mesh>
      )}
      {backTex && (
        <mesh position={[0, 0, -d / 2 - bev - 0.004]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={backTex} emissiveMap={backTex} emissive="#FFFFFF" emissiveIntensity={glow * 0.4} roughness={rough} metalness={0} alphaTest={0.5} />
        </mesh>
      )}
      {children}
    </group>
  );
};

// face texture for plates: ink outline, coloured plate, glossy top band, centred text (1–2 lines)
export const drawFace = (c: CanvasRenderingContext2D, w: number, h: number, o: { bg: string; fg?: string; text?: string; sub?: string; subCol?: string; r?: number; size?: number; border?: number; stroke?: string }) => {
  const r = o.r ?? Math.min(w, h) * 0.22, b = o.border ?? Math.round(Math.min(w, h) * 0.05);
  c.clearRect(0, 0, w, h);
  c.fillStyle = SKC.INK; roundRect(c, 0, 0, w, h, r); c.fill();
  c.fillStyle = o.bg; roundRect(c, b, b, w - 2 * b, h - 2 * b, Math.max(4, r - b)); c.fill();
  c.fillStyle = "rgba(255,255,255,.20)"; roundRect(c, b * 2, b * 1.6, w - 4 * b, (h - 2 * b) * 0.34, Math.max(4, r - b * 1.5)); c.fill();
  c.textAlign = "center"; c.textBaseline = "middle";
  if (o.text) {
    const lines = o.text.split("\n");
    const hasSub = !!o.sub;
    const area = h - 2 * b - (hasSub ? h * 0.26 : 0);
    const fs0 = o.size ?? (area / lines.length) * 0.78;
    lines.forEach((ln, i) => {
      const fs = fitFont(c, ln, fs0, w - b * 2 - w * 0.08);
      const y = b + (hasSub ? h * 0.26 : 0) + (area / lines.length) * (i + 0.5) + fs * 0.04;
      if (o.stroke) { c.lineWidth = fs * 0.16; c.strokeStyle = o.stroke; c.lineJoin = "round"; c.strokeText(ln, w / 2, y); }
      c.fillStyle = o.fg ?? SKC.INK; c.fillText(ln, w / 2, y);
    });
  }
  if (o.sub) { c.fillStyle = o.subCol ?? SKC.OR; fitFont(c, o.sub, h * 0.17, w - b * 4); c.fillText(o.sub, w / 2, b + h * 0.15); }
};
export const faceTex = (w: number, h: number, o: Parameters<typeof drawFace>[3]) => canvasTex(w, h, (c) => drawFace(c, w, h, o));

// particle burst (confetti cubes + sparks), deterministic
export const Burst: React.FC<{ p: V3; t: number; at: number; n?: number; colors?: string[]; speed?: number; size?: number; up?: number; seed?: number; life?: number }> = ({ p, t, at, n = 16, colors = [SKC.OR, SKC.GOLD, "#FFFFFF", SKC.GREEN], speed = 3.2, size = 0.12, up = 1.5, seed = 0, life = 0.9 }) => {
  const tau = t - at;
  if (tau < 0 || tau > life) return null;
  return (
    <group position={p}>
      {Array.from({ length: n }).map((_, i) => {
        const a = rnd(i + seed * 13) * Math.PI * 2, e = (rnd(i + seed * 7 + 3) - 0.3) * 1.4, sp = speed * (0.55 + rnd(i + seed + 5) * 0.7);
        const vx = Math.cos(a) * Math.cos(e) * sp, vy = Math.sin(e) * sp + up, vz = Math.sin(a) * Math.cos(e) * sp * 0.6 + 0.6;
        const x = vx * tau, y = vy * tau - 4.5 * tau * tau, z = vz * tau;
        const k = 1 - cl((tau - life * 0.45) / (life * 0.55));
        const sz = size * (0.6 + rnd(i + 9) * 0.8) * k;
        return (
          <mesh key={i} position={[x, y, z]} rotation={[tau * 9 + i, tau * 7, i]}>
            <boxGeometry args={[sz, sz, sz * 0.4]} />
            <meshBasicMaterial color={colors[i % colors.length]} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// sticker that lives in the world: pops in with overshoot + wobble + burst, floats, pops out
export const Sticker3D: React.FC<{
  t: number; at: number; until?: number; tex: THREE.Texture; w: number; h: number; p: V3; rot?: number; yaw?: number; d?: number;
  from?: V3; burst?: boolean; seed?: number; body?: string; glow?: number; tilt?: number;
}> = ({ t, at, until = 999, tex, w, h, p, rot = 0, yaw = 0, d = 0.14, from, burst = true, seed = 0, body = "#FFFFFF", glow = 0.6, tilt = 0 }) => {
  const kin = back((t - at) / 0.38);
  const kout = ease((t - until) / 0.22);
  const k = kin * (1 - kout);
  if (k <= 0.001 && !(burst && t > at && t < at + 0.9)) return null;
  const tau = Math.max(0, t - at);
  const wob = Math.sin(tau * 13) * 0.22 * Math.exp(-tau * 4.5);
  const fly = from ? ease((t - at) / 0.4) : 1;
  const pos: V3 = from ? [from[0] + (p[0] - from[0]) * fly, from[1] + (p[1] - from[1]) * fly + Math.sin(fly * Math.PI) * 0.6, from[2] + (p[2] - from[2]) * fly] : p;
  const bob = Math.sin(t * 2.1 + seed) * 0.05;
  return (
    <group>
      {k > 0.001 && (
        <Plate3D w={w} h={h} d={d} r={Math.min(w, h) * 0.22} tex={tex} body={body} glow={glow}
          p={[pos[0], pos[1] + bob + kout * 0.4, pos[2]]} rot={[tilt + wob * 0.4, yaw + Math.sin(t * 1.3 + seed) * 0.06 + wob * 0.6, (rot * Math.PI) / 180 + wob * 0.35]} s={Math.max(0.001, k)} />
      )}
      {burst && <Burst p={pos} t={t} at={at + 0.05} seed={seed + 1} n={14} speed={2.6 * Math.max(w, 1.4) / 2} size={0.1 * Math.max(1, w / 2.5)} />}
    </group>
  );
};

// fake-extruded text: face layer + N dark layers behind it (2.5D letters that read from any angle)
export const ExtrudedText: React.FC<{ face: THREE.Texture; side: THREE.Texture; w: number; h: number; depth?: number; layers?: number; p?: V3; rot?: V3; s?: number }> = ({ face, side, w, h, depth = 0.3, layers = 9, p = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={rot} scale={s}>
    {Array.from({ length: layers }).map((_, i) => (
      <mesh key={i} position={[0, 0, -depth * (1 - i / layers)]} castShadow={i === 0}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={side} alphaTest={0.5} toneMapped={false} />
      </mesh>
    ))}
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={face} emissiveMap={face} emissive="#FFFFFF" emissiveIntensity={0.7} alphaTest={0.5} roughness={0.3} />
    </mesh>
  </group>
);
// text textures for ExtrudedText (face = fill + ink stroke, side = ink only)
export const textTex = (text: string, fill: string, px: number, pad = 0.18) => {
  const tmp = document.createElement("canvas").getContext("2d")!;
  tmp.font = `900 ${px}px Rubik`;
  const tw = tmp.measureText(text).width;
  const w = Math.ceil(tw + px * pad * 2), h = Math.ceil(px * 1.35);
  const draw = (c: CanvasRenderingContext2D, face: boolean) => {
    c.clearRect(0, 0, w, h);
    c.font = `900 ${px}px Rubik`; c.textAlign = "center"; c.textBaseline = "middle"; c.lineJoin = "round";
    c.lineWidth = px * 0.2; c.strokeStyle = SKC.INK; c.strokeText(text, w / 2, h / 2 + px * 0.04);
    c.fillStyle = face ? fill : SKC.INK; c.fillText(text, w / 2, h / 2 + px * 0.04);
  };
  return { face: canvasTex(w, h, (c) => draw(c, true)), side: canvasTex(w, h, (c) => draw(c, false)), aspect: w / h };
};

// rope from a ceiling anchor down to a point (thin dark cylinder)
export const Rope: React.FC<{ a: V3; b: V3; r?: number; color?: string }> = ({ a, b, r = 0.025, color = SKC.INK }) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const len = Math.hypot(dx, dy, dz);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q}>
      <cylinderGeometry args={[r, r, len, 6]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
};

// odometer drum with digits 0–9 around the circumference (rolls physically)
export const digitStripTex = (fg = SKC.INK, bg = "#FFFFFF") => canvasTex(2560, 256, (c) => {
  // horizontal strip: digit k in segment k, glyph rotated so that +x (around the drum) is "up"
  c.fillStyle = bg; c.fillRect(0, 0, 2560, 256);
  for (let i = 0; i < 10; i++) {
    c.fillStyle = "rgba(22,19,15,.12)"; c.fillRect(i * 256, 0, 5, 256);
    c.save(); c.translate(i * 256 + 128, 128); c.rotate(Math.PI / 2);
    c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 190px Rubik"; c.fillStyle = fg; c.fillText(String(i), 0, 10);
    c.restore();
  }
});
export const OdometerDigit: React.FC<{ p: V3; value: number; tex: THREE.Texture; r?: number; w?: number }> = ({ p, value, tex, r = 0.5, w = 0.62 }) => {
  // value may be fractional (rolling); digit k faces the camera at angle (k+0.5)*36°
  const ang = ((value + 0.5) * Math.PI * 2) / 10;
  return (
    <group position={p}>
      <mesh rotation={[ang, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r, r, w, 48, 1, true]} />
        <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#FFFFFF" emissiveIntensity={0.25} roughness={0.35} side={THREE.FrontSide} />
      </mesh>
    </group>
  );
};

// cheap point sprite field: dust / sparkles drifting in light (bokeh-ish with DoF)
export const Motes: React.FC<{ t: number; center: V3; size: V3; n?: number; seed?: number; color?: string; s?: number; rise?: number }> = ({ t, center, size, n = 60, seed = 0, color = "#FFF4D6", s = 0.04, rise = 0.25 }) => (
  <group>
    {Array.from({ length: n }).map((_, i) => {
      const j = i + seed * 101;
      const x = center[0] + (rnd(j) - 0.5) * size[0] + Math.sin(t * 0.6 + j) * 0.3;
      const y = center[1] - size[1] / 2 + ((rnd(j + 3) * size[1] + t * rise * (0.5 + rnd(j + 5))) % size[1]);
      const z = center[2] + (rnd(j + 9) - 0.5) * size[2] + Math.cos(t * 0.5 + j) * 0.3;
      const tw = 0.22 + 0.2 * Math.sin(t * 2.4 + j * 1.7);
      return (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[s * (0.5 + rnd(j + 2)), 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={tw} depthWrite={false} toneMapped={false} />
        </mesh>
      );
    })}
  </group>
);

export { cl, ease, back };
