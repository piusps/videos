// Cinematic layer for the "Was wäre wenn" 3D scenes: physical sky, image-based reflections, soft sun shadows
// and a post chain (MSAA → depth of field → bloom → tone mapping) — closer to the rendered look of the references.
import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { V3 } from "./kit";

const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();
// reflections for glossy paint + glass, no external HDR file needed
export const Env: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const { gl, scene } = useThree();
  let tex = envCache.get(gl);
  if (!tex) {
    const pm = new THREE.PMREMGenerator(gl);
    tex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    envCache.set(gl, tex);
  }
  scene.environment = tex;
  scene.environmentIntensity = intensity;
  return null;
};

// gradient sky dome (zenith → horizon, warm glow toward the sun) + matching haze. elev/az = sun
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
  uniforms: { zen: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, glow: { value: new THREE.Color() }, sun: { value: new THREE.Vector3() } },
  vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); gl_Position.z = gl_Position.w; }",
  fragmentShader: "uniform vec3 zen; uniform vec3 hor; uniform vec3 glow; uniform vec3 sun; varying vec3 vD; void main(){ float h = clamp(vD.y,0.0,1.0); vec3 c = mix(hor, zen, pow(h,0.55)); float g = pow(max(dot(normalize(vD), normalize(sun)),0.0), 6.0); c += glow * g * (1.0-h*0.7); if (vD.y < 0.0) c = hor; gl_FragColor = vec4(c,1.0); }",
});
export const SkyDome: React.FC<{ elev?: number; az?: number; haze?: string; zenith?: string; glow?: string; fog?: [number, number]; exposure?: number; turbidity?: number }> = ({ elev = 18, az = 210, haze = "#CFDDEA", zenith = "#3E78C2", glow = "#FFE2B0", fog = [120, 2200], exposure = 0.8 }) => {
  const { scene, gl } = useThree();
  const u = skyMat.uniforms;
  (u.zen.value as THREE.Color).set(zenith).convertSRGBToLinear();
  (u.hor.value as THREE.Color).set(haze).convertSRGBToLinear();
  (u.glow.value as THREE.Color).set(glow).convertSRGBToLinear().multiplyScalar(0.5);
  const d = sunDir(elev, az, 1); (u.sun.value as THREE.Vector3).set(...d);
  scene.background = null;
  scene.fog = new THREE.Fog(haze, fog[0], fog[1]);
  gl.toneMappingExposure = exposure;
  return <mesh material={skyMat} frustumCulled={false} renderOrder={-1}><sphereGeometry args={[1000, 32, 16]} /></mesh>;
};
export const sunDir = (elev = 18, az = 210, d = 120): V3 => {
  const v = new THREE.Vector3().setFromSphericalCoords(d, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(az));
  return [v.x, v.y, v.z];
};

// sun with soft shadows that follow a target point
export const Sun: React.FC<{ elev?: number; az?: number; at?: V3; intensity?: number; span?: number; color?: string }> = ({ elev = 18, az = 210, at = [0, 0, 0], intensity = 2.6, span = 40, color = "#FFE9C8" }) => {
  const light = React.useMemo(() => new THREE.DirectionalLight(), []);
  const d = sunDir(elev, az, 150);
  light.position.set(at[0] + d[0], at[1] + d[1], at[2] + d[2]);
  light.target.position.set(...at); light.target.updateMatrixWorld();
  light.intensity = intensity; light.color.set(color);
  light.castShadow = true; light.shadow.mapSize.set(4096, 4096); light.shadow.bias = -0.0004; light.shadow.normalBias = 0.03;
  const c = light.shadow.camera; c.left = -span; c.right = span; c.top = span; c.bottom = -span; c.near = 1; c.far = 400; c.updateProjectionMatrix();
  light.shadow.radius = 4;
  return <><primitive object={light} /><primitive object={light.target} /></>;
};

// post chain; takes over rendering (priority 1). focus = distance from camera in world units (0 = no DOF)
export const Post: React.FC<{ bloom?: number; threshold?: number; focus?: number; aperture?: number; maxblur?: number }> = ({ bloom = 0.35, threshold = 0.85, focus = 0, aperture = 0.0006, maxblur = 0.006 }) => {
  const { gl, scene, camera, size } = useThree();
  const chain = React.useMemo(() => {
    const pr = gl.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(size.width * pr, size.height * pr, { samples: 4, type: THREE.HalfFloatType });
    const comp = new EffectComposer(gl, rt);
    comp.setPixelRatio(pr); comp.setSize(size.width, size.height);
    comp.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: 0.0006, maxblur: 0.006 });
    comp.addPass(bokeh);
    const bl = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), bloom, 0.5, threshold);
    comp.addPass(bl);
    comp.addPass(new OutputPass());
    return { comp, bokeh, bl };
  }, [gl, scene, camera, size.width, size.height]);
  const bu = chain.bokeh.uniforms as Record<string, { value: number }>;
  chain.bokeh.enabled = focus > 0;
  bu.focus.value = focus; bu.aperture.value = aperture; bu.maxblur.value = maxblur;
  chain.bl.strength = bloom; chain.bl.threshold = threshold;
  useFrame(() => { chain.comp.render(); }, 1);
  return null;
};

// tileable noise texture (grass, gravel, concrete)
const texCache = new Map<string, THREE.CanvasTexture>();
export const noiseTex = (key: string, base: string, spots: string[], n = 9000, size = 256, repeat: [number, number] = [1, 1], extra?: (c: CanvasRenderingContext2D) => void) => {
  const k = key + repeat.join("x");
  let t = texCache.get(k);
  if (!t) {
    const cv = document.createElement("canvas"); cv.width = size; cv.height = size;
    const c = cv.getContext("2d")!;
    c.fillStyle = base; c.fillRect(0, 0, size, size);
    let s = 1;
    const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < n; i++) { c.fillStyle = spots[i % spots.length]; c.globalAlpha = 0.25 + r() * 0.5; const w = 1 + r() * 2.5; c.fillRect(r() * size, r() * size, w, w); }
    c.globalAlpha = 1;
    extra?.(c);
    t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 16;
    t.repeat.set(...repeat);
    texCache.set(k, t);
  }
  return t;
};

export const Exposure: React.FC<{ v?: number }> = ({ v = 1 }) => { const { gl } = useThree(); gl.toneMappingExposure = v; return null; };
