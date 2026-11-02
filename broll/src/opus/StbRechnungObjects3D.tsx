import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// FP-N "Steuerberater-Rechnung" (2026-10-31): real three.js object for the hook - a printed advisor invoice (BEISPIEL)
// lying on the desk, one line already circled red "§ fehlt" (frame 0), a glass magnifier hovering over that line,
// and a red rubber stamp that slams down "§ 9 StBVV · UNVOLLSTÄNDIG" at `stampAt`. Render with --gl=angle.

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
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.6;
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

// invoice canvas 1024 x 1448 (A4); circled row = ROW_HOT
export const INV_ROWS = [
  { d: "Einkommensteuererklärung 2025", s: "6/10", a: "1.170,00", hot: true },
  { d: "Buchführung 01–12/2025", s: "§ 33 Abs. 1", a: "840,00" },
  { d: "Auslagen Post + Telekom.", s: "§ 16", a: "20,00" },
];
const invoiceTex = () => {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 1448;
  const g = c.getContext("2d")!;
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 1024, 1448);
  g.fillStyle = "#2A3A5C"; g.fillRect(0, 0, 1024, 14);
  g.fillStyle = "#1F1E1D"; g.font = "bold 50px Inter, Arial, sans-serif"; g.fillText("Kanzlei Berger", 80, 130);
  g.fillStyle = "#77746C"; g.font = "28px Inter, Arial, sans-serif"; g.fillText("Steuerberatung · Musterstraße 12 · 80331 München", 80, 178);
  g.fillStyle = "#D97757"; g.font = "bold 26px 'JetBrains Mono', monospace"; g.fillText("BEISPIEL", 820, 130);
  g.fillStyle = "#1F1E1D"; g.font = "bold 64px Inter, Arial, sans-serif"; g.fillText("RECHNUNG", 80, 330);
  g.fillStyle = "#77746C"; g.font = "28px 'JetBrains Mono', monospace"; g.fillText("Nr. 2026-0417 · 14.10.2026", 80, 380);
  // table head
  g.fillStyle = "#F4F1EA"; g.fillRect(70, 450, 884, 60);
  g.fillStyle = "#77746C"; g.font = "bold 24px 'JetBrains Mono', monospace";
  g.fillText("LEISTUNG", 90, 490); g.fillText("SATZ", 640, 490); g.textAlign = "right"; g.fillText("BETRAG", 934, 490); g.textAlign = "left";
  INV_ROWS.forEach((r, i) => {
    const y = 580 + i * 110;
    g.fillStyle = "#1F1E1D"; g.font = "32px Inter, Arial, sans-serif"; g.fillText(r.d, 90, y);
    g.fillStyle = "#77746C"; g.font = "28px 'JetBrains Mono', monospace"; g.fillText(r.s, 640, y);
    g.fillStyle = "#1F1E1D"; g.font = "bold 32px 'JetBrains Mono', monospace"; g.textAlign = "right"; g.fillText(`${r.a} €`, 934, y); g.textAlign = "left";
    g.strokeStyle = "#E7E3DA"; g.lineWidth = 2; g.beginPath(); g.moveTo(70, y + 44); g.lineTo(954, y + 44); g.stroke();
  });
  // totals
  g.font = "30px Inter, Arial, sans-serif"; g.fillStyle = "#77746C";
  [["Netto", "2.030,00 €"], ["USt 19 %", "385,70 €"]].forEach(([l, v], i) => { g.fillText(l, 560, 960 + i * 54); g.textAlign = "right"; g.fillText(v, 934, 960 + i * 54); g.textAlign = "left"; });
  g.fillStyle = "#1F1E1D"; g.font = "bold 40px Inter, Arial, sans-serif"; g.fillText("Gesamt", 560, 1100); g.textAlign = "right"; g.fillText("2.495,70 €", 934, 1100); g.textAlign = "left";
  for (let j = 0; j < 4; j++) { g.fillStyle = "#ECE8E1"; g.fillRect(80, 1220 + j * 34, 520 - j * 80, 14); }
  // red hand-drawn ellipse around the hot row + "§ fehlt"
  g.strokeStyle = "#D2403A"; g.lineWidth = 9; g.lineCap = "round";
  g.beginPath();
  for (let a = 0; a <= Math.PI * 2.12; a += 0.05) {
    const x = 500 + Math.cos(a) * (470 + Math.sin(a * 3) * 6), y = 568 + Math.sin(a) * (66 + Math.cos(a * 2) * 4);
    if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();
  g.fillStyle = "#D2403A"; g.font = "italic bold 54px Georgia, serif"; g.fillText("§ fehlt", 600, 690);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};
const stampTex = () => {
  const c = document.createElement("canvas"); c.width = 640; c.height = 300;
  const g = c.getContext("2d")!;
  g.strokeStyle = "#D2403A"; g.lineWidth = 14; g.strokeRect(14, 14, 612, 272);
  g.fillStyle = "#D2403A"; g.textAlign = "center";
  g.font = "bold 96px 'JetBrains Mono', monospace"; g.fillText("§ 9 StBVV", 320, 136);
  g.font = "bold 60px 'JetBrains Mono', monospace"; g.fillText("UNVOLLSTÄNDIG", 320, 230);
  // worn ink
  g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 260; i++) { const x = Math.abs(Math.sin(i * 12.9898) * 640), y = Math.abs(Math.sin(i * 78.233) * 300); g.fillRect(x, y, 3 + (i % 4), 2 + (i % 3)); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const IW = 4.2, IH = IW * 1.414; // invoice plane size (x, z)
// canvas px → world (x, z) on the invoice
const px = (x: number, y: number): [number, number] => [(x / 1024 - 0.5) * IW, (y / 1448 - 0.5) * IH];

export const Invoice3D: React.FC<{ t: number; w: number; h: number; stampAt: number; lensAt?: number }> = ({ t, w, h, stampAt, lensAt = -1 }) => {
  const res = React.useMemo(() => ({
    paper: [
      new THREE.MeshStandardMaterial({ color: "#F4F1EA", roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: "#F4F1EA", roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: invoiceTex(), roughness: 0.82 }), new THREE.MeshStandardMaterial({ color: "#F4F1EA" }),
      new THREE.MeshStandardMaterial({ color: "#F4F1EA" }), new THREE.MeshStandardMaterial({ color: "#F4F1EA" }),
    ],
    under: new THREE.MeshStandardMaterial({ color: "#FBF8F2", roughness: 0.9 }),
    stamp: new THREE.MeshStandardMaterial({ map: stampTex(), transparent: true, roughness: 0.9, depthWrite: false }),
    rubber: new THREE.MeshPhysicalMaterial({ color: "#B8322D", roughness: 0.45, clearcoat: 0.4 }),
    wood: new THREE.MeshPhysicalMaterial({ color: "#3A2A20", roughness: 0.35, clearcoat: 0.7 }),
    ring: new THREE.MeshPhysicalMaterial({ color: "#D97757", roughness: 0.3, metalness: 0.2, clearcoat: 0.8 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", roughness: 0.02, metalness: 0, transparent: true, opacity: 0.16, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6 }),
    floor: new THREE.ShadowMaterial({ opacity: 0.2 }),
  }), []);
  // magnifier hovers over the circled row, drifting a little
  const [hx, hz] = px(300 + Math.sin(t * 0.9) * 50, 578);
  const lensIn = sm((t - lensAt) / 0.5);
  // stamp: comes down from above, presses, lifts away; imprint stays
  const down = sm((t - (stampAt - 0.28)) / 0.28);
  const up = sm((t - (stampAt + 0.12)) / 0.25);
  const stampY = 3.2 - 3.08 * down + 1.2 * up;
  const [sx, sz] = px(600, 1060);
  const ink = t > stampAt ? 1 : 0;
  const shake = t > stampAt && t < stampAt + 0.18 ? Math.sin((t - stampAt) * 90) * 0.03 * (1 - (t - stampAt) / 0.18) : 0;
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={[Math.sin(t * 0.22) * 0.5 - 0.2, 6.4 + Math.sin(t * 0.3) * 0.15 + shake, 3.2 - t * 0.05]} look={[-0.05, 0, -0.05]} fov={40} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.55]} />
      <directionalLight position={[-6, 14, 6]} intensity={3.0} color="#FFE9D2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-radius={5} />
      <directionalLight position={[7, 5, -6]} intensity={1.4} color="#FFB08A" />
      {/* second sheet under the invoice, slightly rotated */}
      <mesh position={[0.25, 0.005, 0.15]} rotation={[0, 0.08, 0]} material={res.under} receiveShadow castShadow><boxGeometry args={[IW, 0.01, IH]} /></mesh>
      <mesh position={[0, 0.03, 0]} rotation={[0, -0.04, 0]} material={res.paper} receiveShadow castShadow><boxGeometry args={[IW, 0.02, IH]} /></mesh>
      {/* stamp imprint */}
      <mesh position={[sx, 0.045, sz]} rotation={[-Math.PI / 2, 0, 0.16]} material={res.stamp} scale={[ink, ink, ink]}><planeGeometry args={[2.4, 1.125]} /></mesh>
      {/* rubber stamp */}
      {up < 0.999 && t > stampAt - 0.6 ? (
        <group position={[sx + 6 * up, stampY, sz + 1.5 * up]} rotation={[0, -0.16, 0]}>
          <mesh position={[0, 0.08, 0]} material={res.rubber} castShadow><boxGeometry args={[2.5, 0.16, 1.2]} /></mesh>
          <mesh position={[0, 0.3, 0]} material={res.wood} castShadow><boxGeometry args={[2.3, 0.28, 1.0]} /></mesh>
          <mesh position={[0, 0.85, 0]} material={res.wood} castShadow><cylinderGeometry args={[0.22, 0.3, 0.9, 24]} /></mesh>
          <mesh position={[0, 1.45, 0]} material={res.wood} castShadow><sphereGeometry args={[0.42, 24, 16]} /></mesh>
        </group>
      ) : null}
      {/* magnifier */}
      <group position={[hx, 0.22 + 0.04 * Math.sin(t * 1.6) + (1 - lensIn) * 2, hz + 0.32]} rotation={[-0.12, 0, 0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={res.ring} castShadow><torusGeometry args={[0.75, 0.08, 20, 64]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={res.glass}><cylinderGeometry args={[0.72, 0.72, 0.04, 48]} /></mesh>
        <mesh position={[1.25, 0, 0.5]} rotation={[0, -0.38, Math.PI / 2]} material={res.wood} castShadow><cylinderGeometry args={[0.13, 0.15, 1.3, 20]} /></mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} material={res.floor} receiveShadow><planeGeometry args={[40, 40]} /></mesh>
    </ThreeCanvas>
  );
};
