import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { Easing, interpolate } from "remotion";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// FP-N "Konto" (2026-10-29): real three.js object for the hook - a clear glass jar on the desk that fills with small
// glossy red fee tokens (no coins), one burst of tokens per fee line that flies off the bank statement.
// Render with --gl=angle.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

const Env: React.FC<{ intensity?: number; exposure?: number }> = ({ intensity = 0.6, exposure = 1.05 }) => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = intensity;
  }, [gl, scene, intensity, exposure]);
  return null;
};
const Cam: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(...look);
  return null;
};

// rounded token (soft pill-shaped tile)
const tokenGeo = () => {
  const w = 1.5, h = 1.0, r = 0.42;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1, bevelSegments: 4, curveSegments: 10 });
  g.center();
  return g;
};

// jar profile (lathe): rounded base, straight body, soft shoulder, short neck
const JAR_R = 3.3, JAR_H = 8.4, FLOOR_Y = 0.32;
const jarGeo = () => {
  const p: THREE.Vector2[] = [];
  p.push(new THREE.Vector2(0.001, 0));
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); p.push(new THREE.Vector2(JAR_R - 0.6 + Math.sin(a) * 0.6, 0.6 - Math.cos(a) * 0.6)); }
  p.push(new THREE.Vector2(JAR_R, JAR_H - 1.6));
  for (let i = 1; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); p.push(new THREE.Vector2(JAR_R - Math.sin(a) * 0.55, JAR_H - 1.6 + Math.sin(a) * 0.9)); }
  p.push(new THREE.Vector2(JAR_R - 0.55, JAR_H));
  const g = new THREE.LatheGeometry(p, 72);
  g.computeVertexNormals();
  return g;
};

// resting slots: layered disks with jitter
const slot = (j: number) => {
  const per = 9, L = Math.floor(j / per), q = j % per;
  const rr = (JAR_R - 1.05) * Math.sqrt((q + 0.5) / per);
  const ang = q * 2.39996 + L * 0.9;
  return {
    x: Math.cos(ang) * rr + (rnd(j, 2) - 0.5) * 0.3,
    z: Math.sin(ang) * rr + (rnd(j, 3) - 0.5) * 0.3,
    y: FLOOR_Y + 0.25 + L * 0.42 + rnd(j, 4) * 0.18,
    rx: -Math.PI / 2 + (rnd(j, 5) - 0.5) * 0.9,
    ry: rnd(j, 6) * Math.PI * 2,
    rz: (rnd(j, 7) - 0.5) * 0.8,
  };
};

export const FeeJar3D: React.FC<{ t: number; w: number; h: number; drops: number[]; glow?: number; camDist?: number }> = ({ t, w, h, drops, glow = 0, camDist = 25 }) => {
  const geo = React.useMemo(() => ({ token: tokenGeo(), jar: jarGeo(), rim: new THREE.TorusGeometry(JAR_R - 0.55, 0.16, 16, 72) }), []);
  const mats = React.useMemo(() => ({
    glass: new THREE.MeshPhysicalMaterial({ color: "#E9F1F2", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.36, clearcoat: 1, clearcoatRoughness: 0.03, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }),
    rim: new THREE.MeshPhysicalMaterial({ color: "#DCD5CA", roughness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1 }),
    tokA: new THREE.MeshPhysicalMaterial({ color: "#D8352F", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4, sheenColor: new THREE.Color("#FF9A8A") }),
    tokB: new THREE.MeshPhysicalMaterial({ color: "#E85A3C", roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }),
    floor: new THREE.ShadowMaterial({ opacity: 0.2 }),
  }), []);
  const g = 26; // gravity units/s^2
  const top = JAR_H + 3.2;
  const shake = drops.reduce((acc, d) => { const u = t - (d + 0.35); return acc + (u > 0 && u < 0.25 ? Math.sin(u * 60) * 0.012 * (1 - u / 0.25) : 0); }, 0);
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env intensity={0.7} />
      <Cam pos={[Math.sin(t * 0.3) * 3 + 4, 9.6 + Math.sin(t * 0.4) * 0.4, camDist - t * 0.25]} look={[0, 3.6, 0]} fov={30} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.45]} />
      <directionalLight position={[-10, 18, 12]} intensity={3.2} color="#FFE6CC" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={14} shadow-camera-bottom={-6} shadow-radius={6} />
      <directionalLight position={[12, 6, -8]} intensity={3.5} color="#FF8A5A" />
      <pointLight position={[0, 3, 4]} intensity={20 + glow * 60} distance={18} color="#FF6A50" />
      <group rotation={[0, 0, shake]}>
        {drops.map((d, j) => {
          const s = slot(j);
          const u = t - d;
          if (u < 0) return null;
          const fallT = Math.sqrt((2 * (top - s.y)) / g);
          let y: number, q: number;
          if (u < fallT) { y = top - 0.5 * g * u * u; q = u / fallT; }
          else { const b = u - fallT; y = s.y + Math.max(0, Math.sin(b * 18) * 0.35 * Math.exp(-b * 9)); q = 1; }
          const spin = (1 - q) * (2 + rnd(j, 9) * 2);
          const sx = s.x * (0.35 + 0.65 * q), sz = s.z * (0.35 + 0.65 * q);
          return (
            <mesh key={j} geometry={geo.token} material={j % 3 === 1 ? mats.tokB : mats.tokA} position={[sx, y, sz]} rotation={[s.rx + spin, s.ry + spin * 0.7, s.rz]} castShadow receiveShadow />
          );
        })}
        <mesh geometry={geo.jar} material={mats.glass} renderOrder={2} />
        <mesh geometry={geo.rim} material={mats.rim} position={[0, JAR_H, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={3} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={mats.floor} receiveShadow>
        <planeGeometry args={[60, 60]} />
      </mesh>
    </ThreeCanvas>
  );
};
export const _unused = { interpolate, Easing, clamp };
