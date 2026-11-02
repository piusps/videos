import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// FP-N "Steuerberater-Pauschale" (2026-10-30): real three.js object for the hook - a messy pile of paper receipts
// (canvas-printed: Tankstelle, Farben, Software, Telefon …) on the desk; one by one they lift, straighten and land
// neatly stacked in an open orange ring binder with coloured category tabs; at the end the cover closes.
// Render with --gl=angle.

const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const sm = (u: number) => { const x = Math.min(1, Math.max(0, u)); return x * x * (3 - 2 * x); };

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.55;
  }, [gl, scene]);
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

export const TABS = ["#D97757", "#1E9E57", "#3E7BD9", "#D9901E"]; // Kfz, Material, Software, Telefon/Sonstiges
const KINDS = [
  { shop: "ARAL", lines: ["Super E10  51,2 l", "Säule 4"], sum: "84,37", tab: 0 },
  { shop: "FARBEN SCHMIDT", lines: ["Fassadenfarbe 4x", "12,5 l weiß"], sum: "412,80", tab: 1 },
  { shop: "Adobe", lines: ["Creative Cloud", "Teams 10/2026"], sum: "71,39", tab: 2 },
  { shop: "Telekom", lines: ["Mobilfunk", "Festnetz Okt."], sum: "59,95", tab: 3 },
  { shop: "SHELL", lines: ["Diesel  49,8 l", "Säule 2"], sum: "91,12", tab: 0 },
  { shop: "BAUHAUS", lines: ["Abdeckvlies", "Kreppband 6x"], sum: "129,95", tab: 1 },
  { shop: "Microsoft", lines: ["365 Business", "Basic 10/2026"], sum: "12,60", tab: 2 },
];
const receiptTex = (i: number) => {
  const kd = KINDS[i % KINDS.length];
  const c = document.createElement("canvas");
  c.width = 256; c.height = 384;
  const g = c.getContext("2d")!;
  g.fillStyle = i % 3 === 2 ? "#FBF7EE" : "#FFFFFF"; g.fillRect(0, 0, 256, 384);
  g.fillStyle = "#1F1E1D"; g.textAlign = "center";
  g.font = "bold 34px Inter, Arial, sans-serif"; g.fillText(kd.shop, 128, 56);
  g.font = "18px 'JetBrains Mono', monospace"; g.fillStyle = "#77746C";
  g.fillText("03.10.2026  14:22", 128, 90);
  g.strokeStyle = "#CFCAC0"; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(20, 110); g.lineTo(236, 110); g.stroke();
  g.textAlign = "left"; g.fillStyle = "#1F1E1D"; g.font = "22px 'JetBrains Mono', monospace";
  kd.lines.forEach((l, j) => g.fillText(l, 24, 150 + j * 34));
  for (let j = 0; j < 4; j++) { g.fillStyle = "#E7E3DA"; g.fillRect(24, 230 + j * 18, 120 + ((i + j) % 3) * 30, 8); }
  g.beginPath(); g.moveTo(20, 312); g.lineTo(236, 312); g.stroke();
  g.font = "bold 28px 'JetBrains Mono', monospace"; g.fillStyle = "#1F1E1D";
  g.fillText("SUMME", 24, 352); g.textAlign = "right"; g.fillText(`${kd.sum} €`, 236, 352);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};

const N = 14;
const RW = 1.9, RH = 2.85, RT = 0.025; // receipt size (x, z) and thickness
const PILE = { x: -2.4, z: 0.6 };
const BIND = { x: 2.1, z: 0.2 };
const BW = 3.0, BD = 3.9; // binder board width (x) / depth (z)
const SPINE = 0.12 + N * RT * 1.2 + 0.12;

export const ReceiptBinder3D: React.FC<{ t: number; w: number; h: number; sortAt: number[]; closeAt: number; camDist?: number }> = ({ t, w, h, sortAt, closeAt, camDist = 11.2 }) => {
  const res = React.useMemo(() => {
    const tex = Array.from({ length: N }, (_, i) => receiptTex(i));
    const edge = new THREE.MeshStandardMaterial({ color: "#F4F1EA", roughness: 0.9 });
    return {
      paper: tex.map((m) => [edge, edge, new THREE.MeshStandardMaterial({ map: m, roughness: 0.85 }), edge, edge, edge]),
      tabs: TABS.map((c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.35, clearcoat: 0.6 })),
      board: new THREE.MeshPhysicalMaterial({ color: "#D97757", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3 }),
      inner: new THREE.MeshStandardMaterial({ color: "#F3E3D8", roughness: 0.8 }),
      metal: new THREE.MeshPhysicalMaterial({ color: "#C9C6C0", metalness: 1, roughness: 0.22 }),
      label: (() => {
        const c = document.createElement("canvas"); c.width = 512; c.height = 256;
        const g = c.getContext("2d")!; g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 512, 256);
        g.fillStyle = "#16130F"; g.font = "bold 64px Inter, Arial, sans-serif"; g.textAlign = "center"; g.fillText("Buchungsmappe", 256, 120);
        g.fillStyle = "#B4532F"; g.font = "bold 44px 'JetBrains Mono', monospace"; g.fillText("OKTOBER 2026", 256, 195);
        const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshStandardMaterial({ map: tx, roughness: 0.7 });
      })(),
      floor: new THREE.ShadowMaterial({ opacity: 0.18 }),
    };
  }, []);
  // binder cover angle: open (leaning back) → closed (0)
  const close = sm((t - closeAt) / 0.55);
  const coverRot = Math.PI * 0.6 * (1 - close); // open = cover stands up, leaning back to the left
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={[Math.sin(t * 0.25) * 1.6 + 0.4, 9.8 + Math.sin(t * 0.35) * 0.3, camDist - t * 0.12]} look={[0.1, 0, 0.5]} fov={34} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.5]} />
      <directionalLight position={[-6, 14, 8]} intensity={3.0} color="#FFE9D2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-radius={5} />
      <directionalLight position={[8, 5, -6]} intensity={1.6} color="#FFB08A" />
      {/* binder: back board, spine rings, cover hinged on the left edge */}
      <group position={[BIND.x, 0, BIND.z]}>
        <mesh position={[0, 0.04, 0]} material={res.board} castShadow receiveShadow><boxGeometry args={[BW, 0.08, BD]} /></mesh>
        <mesh position={[0, 0.085, 0]} material={res.inner} receiveShadow><boxGeometry args={[BW - 0.12, 0.01, BD - 0.12]} /></mesh>
        {[-1.1, 0, 1.1].map((z, i) => (
          <mesh key={i} position={[-BW / 2 + 0.32, 0.3, z]} rotation={[Math.PI / 2, 0, 0]} material={res.metal} castShadow><torusGeometry args={[0.2, 0.035, 10, 24, Math.PI]} /></mesh>
        ))}
        <mesh position={[-BW / 2, SPINE / 2, 0]} material={res.board} castShadow><boxGeometry args={[0.08, SPINE, BD]} /></mesh>
        <group position={[-BW / 2, SPINE, 0]} rotation={[0, 0, coverRot]}>
          <mesh position={[BW / 2, 0.04, 0]} material={res.board} castShadow><boxGeometry args={[BW, 0.08, BD]} /></mesh>
          <mesh position={[BW / 2, 0.085, 0.3]} material={res.label}><boxGeometry args={[BW * 0.72, 0.01, BD * 0.36]} /></mesh>
        </group>
      </group>
      {/* receipts */}
      {Array.from({ length: N }, (_, i) => {
        const a = sortAt[i] ?? 999;
        const u = sm((t - a) / 0.5);
        const p0 = { x: PILE.x + (rnd(i, 1) - 0.5) * 1.4, y: 0.03 + i * 0.05, z: PILE.z + (rnd(i, 2) - 0.5) * 1.5, ry: (rnd(i, 3) - 0.5) * 1.6, rx: (rnd(i, 4) - 0.5) * 0.12, rz: (rnd(i, 5) - 0.5) * 0.12 };
        const p1 = { x: BIND.x + 0.15, y: 0.11 + i * RT * 1.2, z: BIND.z, ry: 0, rx: 0, rz: 0 };
        const L = (x: number, y: number) => x + (y - x) * u;
        const arc = Math.sin(u * Math.PI) * (2.2 + rnd(i, 6) * 0.6);
        const flip = Math.sin(u * Math.PI) * 0.5;
        const tab = KINDS[i % KINDS.length].tab;
        return (
          <group key={i} position={[L(p0.x, p1.x), L(p0.y, p1.y) + arc, L(p0.z, p1.z)]} rotation={[L(p0.rx, 0) + flip * 0.4, L(p0.ry, 0), L(p0.rz, 0) - flip * 0.3]}>
            <mesh material={res.paper[i]} castShadow receiveShadow><boxGeometry args={[RW, RT, RH]} /></mesh>
            {/* index tab sticks out on the right, staggered by category */}
            <mesh position={[RW / 2 + 0.16, 0, -RH / 2 + 0.45 + tab * 0.62]} material={res.tabs[tab]} castShadow><boxGeometry args={[0.34, RT * 1.6, 0.5]} /></mesh>
          </group>
        );
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} material={res.floor} receiveShadow><planeGeometry args={[40, 40]} /></mesh>
    </ThreeCanvas>
  );
};
export const RB_N = N;
