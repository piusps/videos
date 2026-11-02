import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { Easing, continueRender, delayRender, interpolate } from "remotion";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { canvasTex, roundRect } from "../components/Voxel3D";

// FP-N "Claude Duet" (2026-10-28): real three.js objects for the split panels.
// - Anthropic3D: cream ceramic tile with the official Anthropic mark (Simple Icons path) extruded in glossy ink
// - ApproveButton3D: chunky orange "Freigeben" key on a ceramic base, pressed at `pressAt`
// Render with --gl=angle.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.4, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const back = (t: number, a: number, d = 0.5, s = 1.6) => k(t, a, d, Easing.out(Easing.back(s)));

const useFontsReady = (fams: string[]) => {
  const [ready, setReady] = React.useState(false);
  const [h] = React.useState(() => delayRender("duet3d fonts"));
  React.useEffect(() => {
    Promise.all(fams.map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(() => { setReady(true); continueRender(h); }).catch(() => { setReady(true); continueRender(h); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ready;
};

const rbox = (w: number, h: number, d: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2 + r, y = -h / 2 + r, iw = w - 2 * r, ih = h - 2 * r;
  s.moveTo(x, y - r);
  s.lineTo(x + iw, y - r);
  s.quadraticCurveTo(x + iw + r, y - r, x + iw + r, y);
  s.lineTo(x + iw + r, y + ih);
  s.quadraticCurveTo(x + iw + r, y + ih + r, x + iw, y + ih + r);
  s.lineTo(x, y + ih + r);
  s.quadraticCurveTo(x - r, y + ih + r, x - r, y + ih);
  s.lineTo(x - r, y);
  s.quadraticCurveTo(x - r, y - r, x, y - r);
  const bev = Math.min(r * 0.6, d * 0.3);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * bev), bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 6, curveSegments: 12 });
  g.center();
  return g;
};

const Env: React.FC<{ intensity?: number; exposure?: number }> = ({ intensity = 0.4, exposure = 1.05 }) => {
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

// ---------- Anthropic tile ----------
const anthropicGeo = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${SIMPLE_ICONS.anthropic.d}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const g = new THREE.ExtrudeGeometry(shapes, { depth: 1.4, bevelEnabled: true, bevelSize: 0.22, bevelThickness: 0.3, bevelSegments: 5, curveSegments: 10 });
  g.rotateX(Math.PI);
  g.center();
  g.computeVertexNormals();
  return g;
};

export const Anthropic3D: React.FC<{ t: number; w: number; h: number; at?: number; spinAt?: number; camZ?: number; x?: number }> = ({ t, w, h, at = 0, spinAt = -1, camZ = 46, x = 0 }) => {
  const geo = React.useMemo(() => ({ mark: anthropicGeo(), tile: rbox(17, 17, 2.4, 3.6) }), []);
  const mats = React.useMemo(() => ({
    ink: new THREE.MeshPhysicalMaterial({ color: "#1E1C1A", roughness: 0.22, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08 }),
    tile: new THREE.MeshPhysicalMaterial({ color: "#F1ECE2", roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.2, sheen: 0.4, sheenColor: new THREE.Color("#FFD9C2") }),
    floor: new THREE.ShadowMaterial({ opacity: 0.18 }),
  }), []);
  // enters already 70 % settled at frame 0, finishes with a soft overshoot; optional 360 spin on the "Update" word
  const e = back(t, at - 0.25, 0.8, 1.4);
  const spin = spinAt >= 0 ? k(t, spinAt, 0.75, Easing.inOut(Easing.cubic)) * Math.PI * 2 : 0;
  const ry = -0.75 * (1 - e) + Math.sin(t * 0.9) * 0.16 + spin;
  const rx = -0.12 + Math.sin(t * 0.7) * 0.05;
  const s = 0.82 + 0.18 * e;
  const bob = Math.sin(t * 1.3) * 0.35;
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env intensity={0.55} />
      <Cam pos={[Math.sin(t * 0.35) * 1.2, 2.2, camZ - t * 0.6]} look={[0, 0.4, 0]} fov={32} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.35]} />
      <directionalLight position={[-12, 16, 18]} intensity={3.4} color="#FFE6CC" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-45} shadow-camera-right={45} shadow-camera-top={45} shadow-camera-bottom={-45} shadow-radius={8} />
      <directionalLight position={[14, 6, -10]} intensity={4.5} color="#FF7A4A" />
      <pointLight position={[8, 4, 10]} intensity={60} distance={40} color="#FFC9A0" />
      <group position={[x, bob, 0]} rotation={[rx, ry, 0]} scale={s}>
        <mesh geometry={geo.tile} material={mats.tile} castShadow receiveShadow />
        <mesh geometry={geo.mark} material={mats.ink} position={[0, 0, 1.6]} scale={0.52} castShadow />
        <mesh geometry={geo.mark} material={mats.ink} position={[0, 0, -1.6]} rotation={[0, Math.PI, 0]} scale={0.52} castShadow />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -11.5, 0]} material={mats.floor} receiveShadow>
        <planeGeometry args={[120, 120]} />
      </mesh>
    </ThreeCanvas>
  );
};

// ---------- Freigeben key ----------
const keyLabel = (done: boolean) =>
  canvasTex(1024, 320, (c) => {
    c.clearRect(0, 0, 1024, 320);
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "rgba(120,40,15,0.35)"; c.font = "700 150px Inter-Bold"; c.fillText(done ? "Freigegeben" : "Freigeben", 512 + 3, 166 + 5);
    c.fillStyle = "#FFFFFF"; c.fillText(done ? "Freigegeben" : "Freigeben", 512, 166);
  });
const plateLabel = () =>
  canvasTex(1024, 128, (c) => {
    c.fillStyle = "#EFE7DA"; roundRect(c, 0, 0, 1024, 128, 30); c.fill();
    c.fillStyle = "#8A8178"; c.font = "800 54px 'JetBrains Mono'"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText("MAHNUNG · KESSLER BAU", 512, 68);
  });

export const ApproveButton3D: React.FC<{ t: number; w: number; h: number; pressAt: number; at?: number }> = ({ t, w, h, pressAt, at = 0 }) => {
  const ready = useFontsReady(["700 150px Inter-Bold", "800 54px 'JetBrains Mono'"]);
  const geo = React.useMemo(() => ({ base: rbox(13.6, 6.2, 1.2, 1.6), well: rbox(12.2, 4.6, 0.6, 1.2), cap: rbox(11.4, 3.9, 1.5, 1.05) }), []);
  const tex = React.useMemo(() => (ready ? { a: keyLabel(false), b: keyLabel(true), plate: plateLabel() } : null), [ready]);
  const mats = React.useMemo(() => ({
    base: new THREE.MeshPhysicalMaterial({ color: "#F4EEE4", roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    well: new THREE.MeshStandardMaterial({ color: "#D9CFC1", roughness: 0.7 }),
    cap: new THREE.MeshPhysicalMaterial({ color: "#D97757", roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.5, sheenColor: new THREE.Color("#FFB08A") }),
    capDone: new THREE.MeshPhysicalMaterial({ color: "#1E9E57", roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 }),
    floor: new THREE.ShadowMaterial({ opacity: 0.2 }),
  }), []);
  if (!tex) return null;
  const down = interpolate(t, [pressAt - 0.06, pressAt, pressAt + 0.08, pressAt + 0.38], [0, 1, 1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const done = t >= pressAt + 0.08;
  const e = back(t, at - 0.2, 0.7, 1.3);
  const recoil = t > pressAt ? Math.sin((t - pressAt) * 22) * 0.04 * Math.max(0, 1 - (t - pressAt) / 0.6) : 0;
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env intensity={0.5} />
      <Cam pos={[Math.sin(t * 0.4) * 1.6, 13 - t * 0.25, 15 - t * 0.45]} look={[0, 0, 0.6]} fov={34} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.35]} />
      <directionalLight position={[-9, 18, 10]} intensity={3.6} color="#FFE6CC" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-radius={5} />
      <directionalLight position={[10, 5, -8]} intensity={2.6} color="#FF8A5A" />
      <pointLight position={[0, 6, 6]} intensity={done ? 70 : 40} distance={30} color={done ? "#CFFFE0" : "#FFC9A0"} />
      <group rotation={[0, Math.sin(t * 0.6) * 0.06 + (1 - e) * -0.4, recoil]} scale={0.88 + 0.12 * e}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={geo.base} material={mats.base} position={[0, 0, 0.6]} castShadow receiveShadow />
          <mesh geometry={geo.well} material={mats.well} position={[0, 0.25, 1.05]} receiveShadow />
          <group position={[0, 0.25, 1.85 - down * 0.62]}>
            <mesh geometry={geo.cap} material={done ? mats.capDone : mats.cap} castShadow />
            <mesh position={[0, 0, 0.76]}>
              <planeGeometry args={[9.6, 3.0]} />
              <meshBasicMaterial map={done ? tex.b : tex.a} transparent toneMapped={false} />
            </mesh>
          </group>
          <mesh position={[0, -2.55, 1.21]}>
            <planeGeometry args={[8, 1]} />
            <meshBasicMaterial map={tex.plate} transparent toneMapped={false} />
          </mesh>
        </group>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={mats.floor} receiveShadow>
        <planeGeometry args={[80, 80]} />
      </mesh>
    </ThreeCanvas>
  );
};
