import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// FP-N "Terminplaner Steuerberater" (2026-11-02): real three.js objects.
// 1) Stopwatch3D - the hook: cream desk stopwatch with chrome bezel and crown, a 60-minute dial split into four quarter-hour
//    segments; the elapsed time is an arc on the dial (green ≤ 15 min, red once it crosses into the next quarter hour), plus a
//    hand. Driven by `minutes` so the hook can run 10:00 → 15:01 (+41 €) and snap back to 10:00.
// 2) DeadlineCalendar3D - tear-off desk calendar (from BescheidObjects3D.FristCalendar3D, dates as a prop): pages flip to the
//    first to-do deadline, red ring drawn around it.
// Render with --gl=angle.

const sm = (u: number) => { const x = Math.min(1, Math.max(0, u)); return x * x * (3 - 2 * x); };

const Env: React.FC<{ exposure?: number }> = ({ exposure = 1.05 }) => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.6;
  }, [gl, scene, exposure]);
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
const tex = (c: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; };
const canvas = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")!] as const; };

// ---------- stopwatch dial ----------
const dialTex = () => {
  const S = 1024, [c, g] = canvas(S, S), R = S / 2;
  g.fillStyle = "#FFFDF8"; g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill();
  g.translate(R, R);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2, q = i % 15 === 0, f = i % 5 === 0;
    g.strokeStyle = q ? "#D97757" : f ? "#1F1E1D" : "#9C978D"; g.lineWidth = q ? 14 : f ? 7 : 3;
    const r1 = R * (q ? 0.74 : f ? 0.8 : 0.85), r2 = R * 0.92;
    g.beginPath(); g.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); g.stroke();
  }
  g.fillStyle = "#1F1E1D"; g.font = "800 92px Inter, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  [["60", 0], ["15", 15], ["30", 30], ["45", 45]].forEach(([s, m]) => { const a = ((m as number) / 60) * Math.PI * 2 - Math.PI / 2; g.fillText(s as string, Math.cos(a) * R * 0.6, Math.sin(a) * R * 0.6); });
  g.font = "700 40px 'JetBrains Mono', monospace"; g.fillStyle = "#77746C"; g.fillText("MIN", 0, R * 0.3);
  return tex(c);
};

export const Stopwatch3D: React.FC<{ t: number; w: number; h: number; minutes: number; kick?: number }> = ({ t, w, h, minutes, kick = 0 }) => {
  const res = React.useMemo(() => ({
    dial: new THREE.MeshStandardMaterial({ map: dialTex(), roughness: 0.6 }),
    body: new THREE.MeshPhysicalMaterial({ color: "#F6EFE4", roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    chrome: new THREE.MeshPhysicalMaterial({ color: "#E9E4DC", metalness: 1, roughness: 0.18 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", transmission: 1, roughness: 0.05, thickness: 0.1, transparent: true, opacity: 0.18 }),
    green: new THREE.MeshBasicMaterial({ color: "#1E9E57", transparent: true, opacity: 0.55, toneMapped: false, depthWrite: false }),
    red: new THREE.MeshBasicMaterial({ color: "#D2403A", transparent: true, opacity: 0.6, toneMapped: false, depthWrite: false }),
    hand: new THREE.MeshStandardMaterial({ color: "#D97757", roughness: 0.3 }),
    ink: new THREE.MeshStandardMaterial({ color: "#1F1E1D", roughness: 0.4 }),
    floor: new THREE.ShadowMaterial({ opacity: 0.2 }),
  }), []);
  const R = 1.6;
  const m = Math.max(0, minutes);
  const first = Math.min(m, 15), over = Math.max(0, m - 15);
  const ang = (mm: number) => (mm / 60) * Math.PI * 2;
  // wobble when the quarter hour is crossed
  const wob = Math.sin(kick * 40) * 0.08 * Math.max(0, 1 - kick);
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={[Math.sin(t * 0.35) * 0.9 + 0.6, 0.9 + Math.sin(t * 0.27) * 0.15, 7.2 - Math.min(t, 6) * 0.05]} look={[0, 0.15, 0]} fov={34} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.55]} />
      <directionalLight position={[-4, 6, 8]} intensity={2.6} color="#FFE9D2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-radius={6} />
      <directionalLight position={[6, 3, -4]} intensity={1.3} color="#FFB08A" />
      <group rotation={[-0.12, -0.22 + wob, wob * 0.5]}>
        {/* body (cylinder faces +z) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={res.body} castShadow><cylinderGeometry args={[R + 0.18, R + 0.18, 0.55, 96]} /></mesh>
        <mesh position={[0, 0, 0.28]} material={res.chrome}><torusGeometry args={[R + 0.1, 0.11, 24, 96]} /></mesh>
        <mesh position={[0, 0, 0.281]} material={res.dial}><circleGeometry args={[R, 96]} /></mesh>
        {/* elapsed arcs: first quarter green, everything over 15 min red */}
        {first > 0.01 ? <mesh position={[0, 0, 0.29]} material={over > 0 ? res.red : res.green}><ringGeometry args={[R * 0.93, R * 0.99, 96, 1, Math.PI / 2 - ang(first), ang(first)]} /></mesh> : null}
        {over > 0.01 ? <mesh position={[0, 0, 0.292]} material={res.red}><ringGeometry args={[R * 0.6, R * 0.99, 96, 1, Math.PI / 2 - ang(15) - ang(over), ang(over)]} /></mesh> : null}
        {/* hand */}
        <group position={[0, 0, 0.31]} rotation={[0, 0, -ang(m)]}>
          <mesh position={[0, R * 0.42, 0]} material={res.hand} castShadow><boxGeometry args={[0.06, R * 0.95, 0.03]} /></mesh>
        </group>
        <mesh position={[0, 0, 0.33]} rotation={[Math.PI / 2, 0, 0]} material={res.ink}><cylinderGeometry args={[0.12, 0.12, 0.05, 32]} /></mesh>
        <mesh position={[0, 0, 0.36]} material={res.glass}><circleGeometry args={[R + 0.02, 96]} /></mesh>
        {/* crown + loop + side pusher */}
        <mesh position={[0, R + 0.38, 0]} material={res.chrome} castShadow><cylinderGeometry args={[0.2, 0.2, 0.32, 32]} /></mesh>
        <mesh position={[0, R + 0.62, 0]} material={res.chrome}><torusGeometry args={[0.24, 0.06, 16, 40]} /></mesh>
        <mesh position={[(R + 0.3) * Math.sin(0.7), (R + 0.3) * Math.cos(0.7), 0]} rotation={[0, 0, -0.7]} material={res.chrome}><cylinderGeometry args={[0.13, 0.13, 0.3, 24]} /></mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -R - 0.3, 0]} material={res.floor} receiveShadow><planeGeometry args={[30, 30]} /></mesh>
    </ThreeCanvas>
  );
};

// ---------- tear-off desk calendar ----------
const WD = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
const MN = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];
const pageTex = (d: Date, last: boolean) => {
  const [c, g] = canvas(512, 600);
  g.fillStyle = "#FFFDF8"; g.fillRect(0, 0, 512, 600);
  g.fillStyle = last ? "#D2403A" : "#D97757"; g.fillRect(0, 0, 512, 150);
  g.fillStyle = "#FFFFFF"; g.font = "800 84px Inter, Arial, sans-serif"; g.textAlign = "center"; g.fillText(`${MN[d.getMonth()]} ${d.getFullYear()}`, 256, 108);
  g.fillStyle = last ? "#9B231E" : "#1F1E1D"; g.font = "800 300px Inter, Arial, sans-serif"; g.fillText(String(d.getDate()).padStart(2, "0"), 256, 430);
  g.font = "700 56px 'JetBrains Mono', monospace"; g.fillStyle = "#77746C"; g.fillText(WD[d.getDay()], 256, 530);
  return tex(c);
};
export const DeadlineCalendar3D: React.FC<{ t: number; w: number; h: number; dates: string[]; flipFrom: number; flipTo: number; ring: number }> = ({ t, w, h, dates, flipFrom, flipTo, ring }) => {
  const res = React.useMemo(() => {
    const ds = dates.map((s) => new Date(`${s}T12:00:00`));
    const paperEdge = new THREE.MeshStandardMaterial({ color: "#F1EADF", roughness: 0.9 });
    return {
      pages: ds.map((d, i) => { const m = new THREE.MeshStandardMaterial({ map: pageTex(d, i === ds.length - 1), roughness: 0.75, side: THREE.DoubleSide }); return [paperEdge, paperEdge, paperEdge, paperEdge, m, m]; }),
      block: new THREE.MeshPhysicalMaterial({ color: "#2A2622", roughness: 0.35, clearcoat: 0.7 }),
      ringMat: new THREE.MeshPhysicalMaterial({ color: "#C9A26B", metalness: 1, roughness: 0.25 }),
      stack: new THREE.MeshStandardMaterial({ color: "#F4EEE3", roughness: 0.95 }),
      circle: new THREE.MeshBasicMaterial({ color: "#D2403A", toneMapped: false }),
      floor: new THREE.ShadowMaterial({ opacity: 0.22 }),
    };
  }, [dates]);
  const n = dates.length;
  const PW3 = 2.6, PH3 = (PW3 * 600) / 512;
  const LEAN = -0.38;
  const flipAt = (i: number) => flipFrom + (i * (flipTo - flipFrom)) / Math.max(1, n - 1);
  const rp = sm((t - ring) / 0.45);
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env exposure={1.0} />
      <Cam pos={[Math.sin(t * 0.3) * 0.6 + 0.8, 2.3, 7.2 - t * 0.05]} look={[0, 1.55, 0]} fov={34} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.5]} />
      <directionalLight position={[-4, 8, 7]} intensity={2.6} color="#FFE9D2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-radius={5} />
      <directionalLight position={[6, 3, -4]} intensity={1.2} color="#FFB08A" />
      <group rotation={[LEAN, 0, 0]}>
        <mesh position={[0, PH3 / 2 + 0.05, -0.12]} material={res.block} castShadow receiveShadow><boxGeometry args={[PW3 + 0.3, PH3 + 0.4, 0.12]} /></mesh>
        <mesh position={[0, PH3 / 2 + 0.02, -0.04]} material={res.stack} castShadow><boxGeometry args={[PW3 - 0.02, PH3 - 0.04, 0.06]} /></mesh>
        {[-0.8, -0.27, 0.27, 0.8].map((x) => <mesh key={x} position={[x, PH3 + 0.06, 0.02]} rotation={[0, Math.PI / 2, 0]} material={res.ringMat}><torusGeometry args={[0.1, 0.025, 10, 24]} /></mesh>)}
        {dates.map((_, i) => {
          const f = i === n - 1 ? 0 : sm((t - flipAt(i)) / 0.32);
          if (f >= 1) return null;
          return (
            <group key={i} position={[0, PH3 + 0.04, 0.02 + (n - i) * 0.004]} rotation={[-f * Math.PI * 0.95, 0, 0]}>
              <mesh position={[0, -PH3 / 2, 0]} material={res.pages[i]} castShadow><boxGeometry args={[PW3, PH3, 0.004]} /></mesh>
            </group>
          );
        })}
        {rp > 0 ? <mesh position={[0, PH3 * 0.35 + 0.02, 0.06]} rotation={[0, 0, Math.PI / 2]} material={res.circle}><torusGeometry args={[0.92, 0.05, 10, 64, Math.PI * 2 * rp]} /></mesh> : null}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={res.floor} receiveShadow><planeGeometry args={[30, 30]} /></mesh>
    </ThreeCanvas>
  );
};
