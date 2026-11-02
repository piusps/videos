import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { BL } from "./belegLogos";

// FP-N "Belegsammler" (2026-10-31): real three.js object for the hook - four glossy app tiles with the official marks
// (Gmail, Amazon, PayPal, Uber) float in an arc above an open orange file box ("Belege Okt. 2026"). Invoices
// (canvas-printed: RECHNUNG, firm, date, amount, all BEISPIEL) shoot out of the tiles and land neatly stacked in the box.
// Frame 0 already shows a half-full box and invoices in flight. Render with --gl=angle.

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

export const SOURCES = ["gmail", "amazon", "paypal", "uber"] as const;
type Src = (typeof SOURCES)[number];
const TILE_BG: Record<Src, string> = { gmail: "#FFFFFF", amazon: "#232F3E", paypal: "#FFFFFF", uber: "#000000" };
const tileTex = (s: Src) => {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = TILE_BG[s]; g.fillRect(0, 0, 256, 256);
  if (s === "gmail") {
    const [vx, vy, vw, vh] = BL.gmail.viewBox;
    const sc = 150 / vw;
    g.save(); g.translate(128 - (vw * sc) / 2 - vx * sc, 128 - (vh * sc) / 2 - vy * sc); g.scale(sc, sc);
    BL.gmail.paths.forEach((p) => { g.fillStyle = p.fill; g.fill(new Path2D(p.d)); });
    g.restore();
  } else {
    const m = BL[s];
    const sc = s === "uber" ? 7.4 : 6.4;
    g.save(); g.translate(128 - 12 * sc, 128 - 12 * sc); g.scale(sc, sc);
    g.fillStyle = s === "amazon" ? "#FF9900" : s === "uber" ? "#FFFFFF" : m.hex; g.fill(new Path2D(m.d));
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};

const DOCS: { firm: string; date: string; sum: string; src: number }[] = [
  { firm: "Amazon", date: "03.10.2026", sum: "89,90", src: 1 },
  { firm: "Uber", date: "07.10.2026", sum: "23,40", src: 3 },
  { firm: "Adobe", date: "04.10.2026", sum: "71,39", src: 0 },
  { firm: "PayPal · Shop", date: "09.10.2026", sum: "134,00", src: 2 },
  { firm: "Telekom", date: "12.10.2026", sum: "59,95", src: 0 },
  { firm: "Amazon", date: "14.10.2026", sum: "212,49", src: 1 },
  { firm: "Uber", date: "18.10.2026", sum: "31,10", src: 3 },
  { firm: "Microsoft", date: "20.10.2026", sum: "12,60", src: 0 },
  { firm: "PayPal · Shop", date: "22.10.2026", sum: "48,00", src: 2 },
  { firm: "Amazon", date: "25.10.2026", sum: "64,99", src: 1 },
  { firm: "Uber", date: "28.10.2026", sum: "18,70", src: 3 },
  { firm: "Lexware", date: "30.10.2026", sum: "29,90", src: 0 },
];
export const FI_N = DOCS.length;
const docTex = (i: number) => {
  const d = DOCS[i];
  const c = document.createElement("canvas");
  c.width = 256; c.height = 360;
  const g = c.getContext("2d")!;
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 256, 360);
  g.fillStyle = "#D97757"; g.fillRect(0, 0, 256, 14);
  g.fillStyle = "#1F1E1D"; g.font = "bold 30px Inter, Arial, sans-serif"; g.fillText("RECHNUNG", 22, 60);
  g.font = "bold 24px Inter, Arial, sans-serif"; g.fillStyle = "#B4532F"; g.fillText(d.firm, 22, 98);
  g.font = "18px 'JetBrains Mono', monospace"; g.fillStyle = "#77746C"; g.fillText(d.date, 22, 128);
  for (let j = 0; j < 5; j++) { g.fillStyle = "#ECE8E1"; g.fillRect(22, 160 + j * 22, 110 + ((i + j) % 3) * 32, 9); }
  g.strokeStyle = "#CFCAC0"; g.beginPath(); g.moveTo(22, 290); g.lineTo(234, 290); g.stroke();
  g.font = "bold 26px 'JetBrains Mono', monospace"; g.fillStyle = "#1F1E1D";
  g.fillText("SUMME", 22, 330); g.textAlign = "right"; g.fillText(`${d.sum} €`, 234, 330);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};

const DW = 1.7, DH = 2.4, DT = 0.02; // invoice sheet (x, z) + thickness
const BOX = { x: 0, z: 1.0, w: 3.6, d: 2.0, h: 1.5 }; // open file box: width (x), depth (z), wall height
// tile positions (arc above/behind the box)
const TILES = [{ x: -3.6, y: 3.6, z: -2.6 }, { x: -1.25, y: 4.4, z: -3.1 }, { x: 1.25, y: 4.4, z: -3.1 }, { x: 3.6, y: 3.6, z: -2.6 }];

export const FolderInvoices3D: React.FC<{ t: number; w: number; h: number; flyAt: number[]; pulse?: number[]; camDist?: number }> = ({ t, w, h, flyAt, pulse = [], camDist = 10.4 }) => {
  const res = React.useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: "#F4F1EA", roughness: 0.9 });
    return {
      paper: DOCS.map((_, i) => { const m = new THREE.MeshStandardMaterial({ map: docTex(i), roughness: 0.8 }); return [edge, edge, edge, edge, m, edge]; }),
      tiles: SOURCES.map((s) => { const m = new THREE.MeshPhysicalMaterial({ map: tileTex(s), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12 }); const side = new THREE.MeshPhysicalMaterial({ color: TILE_BG[s] === "#FFFFFF" ? "#E9E6E0" : TILE_BG[s], roughness: 0.3, clearcoat: 0.8 }); return [side, side, side, side, m, side]; }),
      box: new THREE.MeshPhysicalMaterial({ color: "#D97757", roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.3 }),
      boxIn: new THREE.MeshStandardMaterial({ color: "#B4532F", roughness: 0.75 }),
      label: (() => {
        const c = document.createElement("canvas"); c.width = 512; c.height = 200;
        const g = c.getContext("2d")!; g.fillStyle = "#FFFDF8"; g.fillRect(0, 0, 512, 200);
        g.fillStyle = "#16130F"; g.font = "bold 62px Inter, Arial, sans-serif"; g.textAlign = "center"; g.fillText("Belege", 256, 92);
        g.fillStyle = "#B4532F"; g.font = "bold 40px 'JetBrains Mono', monospace"; g.fillText("OKTOBER 2026", 256, 160);
        const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshStandardMaterial({ map: tx, roughness: 0.7 });
      })(),
      floor: new THREE.ShadowMaterial({ opacity: 0.2 }),
    };
  }, []);
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={[Math.sin(t * 0.22) * 1.4, 6.2 + Math.sin(t * 0.3) * 0.25, camDist - t * 0.1]} look={[0, 1.9, -0.5]} fov={38} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.55]} />
      <directionalLight position={[-6, 14, 8]} intensity={3.0} color="#FFE9D2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-radius={5} />
      <directionalLight position={[8, 5, -6]} intensity={1.5} color="#FFB08A" />
      {/* app tiles: bob gently, kick when they shoot an invoice or get named in the script */}
      {TILES.map((p, i) => {
        const kick = flyAt.reduce((m, a, j) => (DOCS[j].src === i ? Math.max(m, Math.max(0, 1 - Math.abs(t - a) / 0.18)) : m), 0);
        const pl = pulse[i] !== undefined ? Math.max(0, 1 - Math.abs(t - pulse[i] - 0.12) / 0.3) : 0;
        const s = 1 + 0.12 * kick + 0.25 * pl;
        return (
          <group key={i} position={[p.x, p.y + Math.sin(t * 1.6 + i * 1.3) * 0.12, p.z]} rotation={[0.55 + Math.sin(t * 0.9 + i) * 0.05, -p.x * 0.07 + Math.sin(t * 0.8 + i * 2) * 0.08, Math.sin(t * 0.7 + i) * 0.05]} scale={[s, s, s]}>
            <mesh material={res.tiles[i]}><boxGeometry args={[1.5, 1.5, 0.28]} /></mesh>
          </group>
        );
      })}
      {/* open file box */}
      <group position={[BOX.x, 0, BOX.z]}>
        <mesh position={[0, 0.04, 0]} material={res.boxIn} receiveShadow><boxGeometry args={[BOX.w, 0.08, BOX.d]} /></mesh>
        <mesh position={[0, BOX.h / 2, BOX.d / 2]} material={res.box} castShadow receiveShadow><boxGeometry args={[BOX.w, BOX.h, 0.08]} /></mesh>
        <mesh position={[0, BOX.h * 0.5, BOX.d / 2 + 0.045]} material={res.label}><boxGeometry args={[BOX.w * 0.62, BOX.h * 0.42, 0.01]} /></mesh>
        <mesh position={[0, BOX.h * 1.15 / 2, -BOX.d / 2]} material={res.box} castShadow receiveShadow><boxGeometry args={[BOX.w, BOX.h * 1.15, 0.08]} /></mesh>
        {[-1, 1].map((sx) => <mesh key={sx} position={[(sx * BOX.w) / 2, BOX.h / 2, 0]} material={res.box} castShadow receiveShadow><boxGeometry args={[0.08, BOX.h, BOX.d]} /></mesh>)}
      </group>
      {/* invoices: tile → arc → standing upright in the box, filed front to back */}
      {DOCS.map((d, i) => {
        const a = flyAt[i] ?? 999;
        const u = sm((t - a) / 0.55);
        if (u <= 0) return null;
        const tp = TILES[d.src];
        const slot = i;
        const p1 = { x: BOX.x + (rnd(i, 2) - 0.5) * 0.25, y: 0.08 + DH / 2 - 0.25, z: BOX.z + BOX.d / 2 - 0.2 - slot * 0.14 };
        const L = (x: number, y: number) => x + (y - x) * u;
        const arc = Math.sin(u * Math.PI) * 1.4;
        const spin = (1 - u) * (rnd(i, 3) - 0.5) * 3;
        return (
          <group key={i} position={[L(tp.x, p1.x), L(tp.y, p1.y) + arc, L(tp.z + 0.3, p1.z)]} rotation={[L(-0.4, 0) - 0.06 * (1 - u), spin * 0.3, L(spin, 0)]} scale={[0.4 + 0.6 * u, 0.4 + 0.6 * u, 0.4 + 0.6 * u]}>
            <mesh material={res.paper[i]} castShadow receiveShadow><boxGeometry args={[DW, DH, DT]} /></mesh>
          </group>
        );
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} material={res.floor} receiveShadow><planeGeometry args={[40, 40]} /></mesh>
    </ThreeCanvas>
  );
};
