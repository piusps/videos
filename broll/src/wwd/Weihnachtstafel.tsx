// "Was wäre, wenn ganz Deutschland an einem einzigen Tisch Weihnachten feiert?" — episode 2.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import {
  BigNumber, Bg, Box, Cam, Captions, Counter, FollowPill, Grade, HookTitle, InfoCard, Person, TopPill, V3, Word,
  beatsFrom, cl, ease, findPhrase, fmt, inOut, lerp, lerp3, rnd, canvasTex, SERIF, SANS,
} from "./kit";
import wordsJson from "../../public/wwd/weihnachtstafel/words.json";

const words = wordsJson as Word[];
const A = "#E9B04C";
const W = 1080, H = 1920;
export const WT_END = words[words.length - 1].e + 1.9;
const B = beatsFrom(words, ["Was wäre", "Heiligabend,", "60 Zentimeter", "Mehr als halb", "In der Küche:", "Du sitzt genau", "Die Soße steht", "Sie geht von", "Sie kommt im", "Ihr singt", "Der Weihnachtsmann", "Um Mitternacht", "Dann fragt", "Die Frage kommt", "Neben wem"], WT_END);
const ws = (ph: string, from = 0) => words[findPhrase(words, ph, from)].s;
const T = {
  tisch: ws("Der Tisch ist"), oma: ws("Oma hat"), kannst: ws("„Kannst"), kalt: ws("Kalt."), zehn: ws("zehn Stunden"), juli: ws("Im Juli"),
  erstes: ws("Zum ersten Mal"), politik: ws("Und keiner"), stille: ws("Per Stille"), schinken: ws("„Hast du schon"),
};

const SHIRTS = ["#7A2E2E", "#2F4A3A", "#3D4E6E", "#8C6A3E", "#5A3E5E", "#2E5A5E", "#9A8A70", "#4A4A50"];
const HAIRS = ["#2B2018", "#8A6A3A", "#1A1A1A", "#B8B0A4", "#6A3A20", "#D8C090"];

// ---------- the endless table ----------
// table runs along -z from z=0; seat i at z = -i*0.6, people on x = ±0.75
const SEAT = 0.6;
const Lights: React.FC<{ from: number; to: number; t: number }> = ({ from, to, t }) => {
  const n = Math.floor((to - from) / 0.25);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const z = -(from + i * 0.25);
        const tw = 0.6 + 0.4 * Math.sin(t * 3 + i * 1.7);
        return <mesh key={i} position={[Math.sin(i * 0.7) * 0.05, 0.79 + Math.sin(i * 0.9) * 0.01, z]}><sphereGeometry args={[0.018, 6, 6]} /><meshStandardMaterial color="#FFE2A0" emissive="#FFC860" emissiveIntensity={2.5 * tw} /></mesh>;
      })}
    </>
  );
};
const Table: React.FC<{ from?: number; to?: number; t: number; people?: boolean; glassUp?: number; pass?: number; hide?: number[]; lean?: (i: number, side: number) => number }> = ({ from = -2, to = 60, t, people = true, glassUp = 0, pass = -1, hide = [], lean }) => {
  const seats = Math.floor((to - Math.max(0, from)) / SEAT);
  const s0 = Math.max(0, Math.floor(from / SEAT));
  return (
    <group>
      <Box p={[0, 0.72, -(from + to) / 2]} s={[1.1, 0.06, to - from]} color="#F2EDE4" rough={0.9} />
      <Box p={[0, 0.7, -(from + to) / 2]} s={[1.0, 0.04, to - from]} color="#5A3A28" />
      <Box p={[0, 0.755, -(from + to) / 2]} s={[0.35, 0.005, to - from]} color="#8E1E24" rough={0.9} cast={false} />
      <Lights from={from} to={Math.min(to, 40)} t={t} />
      {Array.from({ length: Math.min(seats, 70) }, (_, k) => {
        const i = s0 + k;
        const z = -(i * SEAT + 0.3);
        return [-1, 1].map((side) => {
          const key = i * 2 + (side > 0 ? 1 : 0);
          const hid = hide.includes(key);
          const up = glassUp * (0.6 + 0.4 * rnd(key));
          const handOn = pass >= 0 && Math.abs(pass - i) < 1 && side < 0;
          const ln = lean ? lean(i, side) : 0;
          return (
            <group key={key}>
              <Box p={[side * 0.62, 0.743, z]} s={[0.22, 0.012, 0.22]} color="#FAFAF8" rough={0.4} cast={false} />
              <mesh position={[side * 0.42, 0.8, z + 0.12]}><cylinderGeometry args={[0.025, 0.02, 0.1, 10]} /><meshStandardMaterial color="#E8F0F4" roughness={0.1} transparent opacity={0.55} /></mesh>
              <Box p={[side * 1.0, 0.45, z]} s={[0.42, 0.06, 0.42]} color="#6B4A30" />
              <Box p={[side * 1.2, 0.8, z]} s={[0.05, 0.7, 0.42]} color="#6B4A30" />
              {people && !hid && (
                <group position={[side * 0.98, -0.42, z]} rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
                  <group rotation={[ln, 0, 0]}>
                    <Person p={[0, 0, 0]} shirt={SHIRTS[key % SHIRTS.length]} hair={HAIRS[(key * 7) % HAIRS.length]} pants="#2E3038"
                      pose={{ armR: up > 0 ? 1.0 + up * 1.6 : handOn ? 1.25 : 0.5 + rnd(key) * 0.3, foreR: up > 0 ? 0.6 : handOn ? 0.2 : 1.2, armL: 0.45, foreL: 1.25, head: 0.08 }}>
                      {up > 0 ? <mesh><cylinderGeometry args={[0.025, 0.02, 0.1, 10]} /><meshStandardMaterial color="#F6E8B0" roughness={0.1} transparent opacity={0.8} /></mesh> : null}
                    </Person>
                  </group>
                </group>
              )}
            </group>
          );
        });
      })}
    </group>
  );
};
const Room: React.FC<{ t: number; dark?: boolean; far?: number }> = ({ dark, far }) => (
  <>
    <Bg color={dark ? "#06070C" : "#120C08"} fog={[4, far ?? (dark ? 30 : 22)]} />
    <ambientLight intensity={0.22} color="#FFD8B0" />
    <hemisphereLight args={["#FFD8A8", "#2A1A10", 0.35]} />
    <Box p={[0, -0.05, -25]} s={[8, 0.1, 80]} color="#4A3424" rough={0.7} />
    {Array.from({ length: 10 }, (_, i) => <pointLight key={i} position={[0, 2.4, -i * 4]} intensity={4} distance={6} color="#FFB868" castShadow={i < 3} />)}
  </>
);
const GravyBoat: React.FC<{ p: V3; rot?: number; steam?: number }> = ({ p, rot = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <mesh scale={[1.6, 0.7, 1]} castShadow><sphereGeometry args={[0.06, 20, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#F4F1EA" roughness={0.3} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.55, 1, 1]}><circleGeometry args={[0.057, 20]} /><meshStandardMaterial color="#6A3A1A" roughness={0.3} /></mesh>
    <mesh position={[-0.11, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.025, 0.007, 8, 16, Math.PI]} /><meshStandardMaterial color="#F4F1EA" roughness={0.3} /></mesh>
  </group>
);

// ---------- scenes ----------
const HookScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Room t={t} />
    <Cam pos={[0.15, 1.75 - t * 0.05, 2.6 - t * 0.35]} look={[0, 0.85, -8]} fov={42} />
    <Table t={t} from={-1} to={40} />
  </>
);
const ChairsScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Room t={t} dark />
    <Cam pos={[3.6 - t * 0.2, 6 + t * 0.8, 4 - t * 0.6]} look={[0, 0.5, -10 - t]} fov={40} />
    <Table t={t} from={-1} to={60} />
  </>
);
const tapeTex = canvasTex(1024, 128, (c) => {
  c.fillStyle = "#F2C230"; c.fillRect(0, 0, 1024, 128); c.fillStyle = "#1A1A1A";
  for (let i = 0; i <= 60; i++) { const x = 12 + i * 16.6; c.fillRect(x, 0, 2, i % 10 === 0 ? 60 : i % 5 === 0 ? 42 : 26); if (i % 10 === 0) { c.font = `700 30px ${SANS}`; c.fillText(String(i), x + 4, 100); } }
});
const MeasureScene: React.FC<{ t: number; tableT: number }> = ({ t, tableT }) => {
  const zoomOut = ease((t - tableT) / 2.2);
  return (
    <>
      <Room t={t} far={lerp(22, 60, zoomOut)} />
      <Cam pos={lerp3([-0.55, 2.1, 0.5], [-3, 6.5, 5], zoomOut)} look={lerp3([-0.6, 0.75, -0.7], [0, 0.6, -14], zoomOut)} fov={40} far={400} />
      {Array.from({ length: 10 }, (_, i) => <pointLight key={"m" + i} position={[0, 2.4, -40 - i * 4]} intensity={4} distance={6} color="#FFB868" />)}
      <Box p={[0, -0.05, -70]} s={[8, 0.1, 60]} color="#4A3424" rough={0.7} />
      <Table t={t} from={-1} to={90} />
      <mesh position={[-0.62, 0.76, -0.6]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={[ease(t / 0.8), 1, 1]}><planeGeometry args={[0.6, 0.075]} /><meshStandardMaterial map={tapeTex} roughness={0.5} /></mesh>
    </>
  );
};
let _earth: THREE.Texture | null = null;
const earthTex = () => _earth ??= canvasTex(2048, 1024, (c) => {
  const g = c.createLinearGradient(0, 0, 0, 1024); g.addColorStop(0, "#0E2A4C"); g.addColorStop(0.5, "#123A66"); g.addColorStop(1, "#0E2A4C");
  c.fillStyle = g; c.fillRect(0, 0, 2048, 1024);
  [[420, 330, 220], [600, 650, 160], [1050, 300, 260], [1150, 600, 180], [1550, 380, 300], [1700, 700, 140]].forEach(([x, y, r], j) => {
    c.fillStyle = "#1E3A26"; for (let i = 0; i < 60; i++) { c.beginPath(); c.arc(x + (rnd(j * 100 + i) - 0.5) * r * 2, y + (rnd(j * 100 + i * 2) - 0.5) * r, r * (0.2 + rnd(j * 100 + i * 3) * 0.35), 0, Math.PI * 2); c.fill(); }
    for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,210,140,${0.3 + rnd(i + j * 7) * 0.6})`; c.fillRect(x + (rnd(j * 50 + i * 5) - 0.5) * r * 1.6, y + (rnd(j * 50 + i * 9) - 0.5) * r * 0.8, 3, 3); }
  });
});
const GlobeScene: React.FC<{ t: number; dur: number }> = ({ t, dur }) => {
  const k = ease(t / Math.min(2.2, dur - 0.3));
  const R = 3, frac = 0.625 * k;
  const curve = React.useMemo(() => new THREE.EllipseCurve(0, 0, R * 1.012, R * 1.012, 0, Math.PI * 2 * 0.625, false, 0), []);
  const pts = curve.getPoints(300).map((p) => new THREE.Vector3(p.x, 0, p.y));
  const n = Math.max(2, Math.floor(pts.length * (frac / 0.625)));
  const path = new THREE.CatmullRomCurve3(pts.slice(0, n));
  return (
    <>
      <Bg color="#03040A" />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-8, 4, 6]} intensity={2.2} color="#FFF0D8" />
      <Cam pos={[Math.sin(t * 0.15) * 2, 7.5, 13 - t * 0.25]} look={[0, -0.3, 0]} fov={40} />
      <group rotation={[0.35, t * 0.08, 0.1]}>
        <mesh><sphereGeometry args={[R, 96, 64]} /><meshStandardMaterial map={earthTex()} roughness={0.9} /></mesh>
        <mesh><sphereGeometry args={[R * 1.04, 64, 48]} /><meshBasicMaterial color="#6FA8FF" transparent opacity={0.12} side={THREE.BackSide} /></mesh>
        <mesh><tubeGeometry args={[path, 300, 0.035, 8, false]} /><meshStandardMaterial color="#FFD27A" emissive="#FFB040" emissiveIntensity={2} /></mesh>
      </group>
      {Array.from({ length: 200 }, (_, i) => <mesh key={i} position={[(rnd(i * 3) - 0.5) * 80, (rnd(i * 5) - 0.5) * 80, -30 - rnd(i * 7) * 20]}><sphereGeometry args={[0.06, 4, 4]} /><meshBasicMaterial color="#fff" /></mesh>)}
    </>
  );
};
const KitchenScene: React.FC<{ t: number; omaT: number }> = ({ t, omaT }) => (
  <>
    <Bg color="#0E0B08" fog={[3, 24]} />
    <ambientLight intensity={0.3} color="#FFDCB8" />
    <Cam pos={[2.2, 1.7, 2.5 - t * 0.25]} look={[-0.2, 0.9, -6]} fov={42} />
    <Box p={[0, -0.05, -15]} s={[10, 0.1, 40]} color="#C9C2B4" rough={0.5} />
    <Box p={[-1.3, 1.5, -15]} s={[0.1, 3, 40]} color="#E6DDD0" />
    {Array.from({ length: 22 }, (_, i) => {
      const z = -i * 1.2;
      return (
        <group key={i}>
          <Box p={[-0.95, 0.45, z]} s={[0.65, 0.9, 1.1]} color="#2B2B2E" rough={0.4} metal={0.3} />
          <Box p={[-0.62, 0.45, z]} s={[0.02, 0.5, 0.7]} color="#1A1008" emissive="#FF8A30" ei={1.4} cast={false} />
          <pointLight position={[-0.4, 0.5, z]} intensity={0.6} distance={1.6} color="#FF8A30" />
          <mesh position={[-0.88, 0.47, z]} scale={[1.3, 0.8, 1]}><sphereGeometry args={[0.13, 14, 10]} /><meshStandardMaterial color="#B06A2A" roughness={0.5} /></mesh>
        </group>
      );
    })}
    <pointLight position={[0.5, 2.6, 0]} intensity={6} distance={10} color="#FFE0B8" castShadow />
    <Person p={[0.55, 0, -1.9]} ry={0.5 + Math.PI} shirt="#7A3A4A" pants="#3A3540" hair="#E8E4DE" pose={{ armR: 0.9, foreR: 0.6, armL: 0.6, foreL: 0.8, head: 0.2 }} />
    <Box p={[0.3, 0.92, -1.1]} s={[0.9, 0.04, 0.5]} color="#D8CFC0" />
    <Box p={[0.3, 0.46, -1.1]} s={[0.85, 0.9, 0.45]} color="#8A6A4A" />
    {t > omaT - 0.2 && <Box p={[-0.2, 1.55, -2.6]} s={[0.36, 0.42, 0.02]} color="#F6F2EA" />}
  </>
);
const MiddleScene: React.FC<{ t: number }> = ({ t }) => {
  const pan = Math.sin(t * 0.9) * 1.2;
  return (
    <>
      <Room t={t} dark />
      <group position={[0, 0, 0]}>
        <Table t={t} from={-35} to={35} />
      </group>
      <Cam pos={[2.8, 1.5, 0.6]} look={[0, 0.85, pan * 8]} fov={46} />
      {Array.from({ length: 10 }, (_, i) => <pointLight key={"b" + i} position={[0, 2.4, i * 4]} intensity={4} distance={6} color="#FFB868" />)}
    </>
  );
};
const GravyScene: React.FC<{ t: number; ask: number }> = ({ t, ask }) => {
  const k = ease((t - ask + 0.6) / 1.6);
  return (
    <>
      <Room t={t} dark />
      <Cam pos={lerp3([0.0, 1.0, -36.5], [0.6, 1.4, -2.0], k)} look={lerp3([0, 0.78, -40], [0, 0.85, -30], k)} fov={40} />
      <Table t={t} from={-1} to={40} />
      <Box p={[0, 0.72, -40.3]} s={[1.1, 0.06, 0.6]} color="#F2EDE4" />
      <GravyBoat p={[0, 0.79, -39.8]} rot={0.4} />
    </>
  );
};
const PassScene: React.FC<{ t: number }> = ({ t }) => {
  const pass = t * 1.0;
  const z = -(pass * SEAT + 0.3);
  return (
    <>
      <Room t={t} />
      <Cam pos={[-2.6, 1.6, z - 1.2]} look={[-0.6, 0.8, z + 0.3]} fov={40} />
      <Table t={t} from={-1} to={30} pass={pass} />
      <GravyBoat p={[-0.5 + Math.sin(t * Math.PI) * 0.06, 0.86 + Math.abs(Math.sin(t * Math.PI)) * 0.08, z]} rot={Math.PI / 2} />
    </>
  );
};
const ArriveScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Bg color="#C9D6E4" fog={[3, 18]} />
    <hemisphereLight args={["#FFF6E0", "#6A5A40", 1.0]} />
    <directionalLight position={[3, 5, 2]} intensity={2.6} color="#FFE8C0" castShadow />
    <Cam pos={[0.7, 1.25, 0.7 - t * 0.08]} look={[0, 0.8, -0.3]} fov={40} />
    <Table t={t} from={-1} to={20} />
    <GravyBoat p={[-0.05, 0.79, -0.3]} rot={0.3} />
    <Box p={[0, 0.79, -0.32]} s={[0.24, 0.01, 0.12]} color="#D8D0C4" cast={false} />
  </>
);
const SingScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Room t={t} dark />
    <Cam pos={[2.4, 2.4, 1.2 - t * 0.8]} look={[0, 0.8, -8 - t * 0.8]} fov={42} />
    <Table t={t} from={-1} to={60} lean={(i) => Math.sin(t * 2 + i * 0.4) * 0.04} />
    {Array.from({ length: 6 }, (_, j) => {
      const r = ((t * 2.2 + j * 1.6) % 10);
      return <mesh key={j} position={[0, 1.4, -r * 3]} rotation={[0, 0, 0]}><torusGeometry args={[0.9, 0.012, 6, 64]} /><meshBasicMaterial color="#FFE2A0" transparent opacity={0.6 * (1 - r / 10)} /></mesh>;
    })}
  </>
);
const SantaScene: React.FC<{ t: number }> = ({ t }) => {
  const z = -t * 1.2;
  return (
    <>
      <Room t={t} dark />
      <Cam pos={[3.2, 1.8, z + 3.2]} look={[1.6, 1.0, z - 1]} fov={42} />
      <Table t={t} from={-4} to={60} />
      <group position={[1.7, 0, z]} rotation={[0, Math.PI, 0]}>
        <Person p={[0, 0, 0]} shirt="#B8202A" pants="#B8202A" hair="#F2F2F2" pose={{ walk: t * 6, armL: Math.sin(t * 6) * 0.3, armR: -Math.sin(t * 6) * 0.3 }} scale={1.05} />
        <mesh position={[0, 1.6, 0.1]} scale={[1, 1.1, 0.8]}><sphereGeometry args={[0.13, 14, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /><meshStandardMaterial color="#F2F2F2" roughness={1} /></mesh>
        <mesh position={[0, 1.86, 0]}><coneGeometry args={[0.12, 0.25, 14]} /><meshStandardMaterial color="#B8202A" /></mesh>
        <mesh position={[0, 1.99, 0]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#fff" /></mesh>
        <Box p={[0, 1.1, -0.22]} s={[0.4, 0.5, 0.22]} color="#6A4A2E" />
      </group>
    </>
  );
};
const ToastScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Room t={t} />
    <Cam pos={[-1.8 + t * 0.12, 2.1, 1.8 - t * 0.3]} look={[0, 1.0, -6]} fov={42} />
    <Table t={t} from={-1} to={40} glassUp={ease(t / 0.8)} />
  </>
);
const WhisperScene: React.FC<{ t: number; stille: number }> = ({ t, stille }) => {
  const chain = cl((t - stille) / 1.5);
  return (
    <>
      <Room t={t} />
      <Cam pos={[2.4, 1.55, -53]} look={[0.6, 0.95, -58]} fov={40} />
      <Table t={t} from={50} to={62} lean={(i, side) => (side > 0 && i * SEAT > 55.5 - chain * 4 ? 0.22 * Math.abs(Math.sin(t * 3 + i)) : 0)} />
      <Box p={[0, 0.72, -62.3]} s={[1.1, 0.06, 0.6]} color="#F2EDE4" />
      <Person p={[0, -0.42, -62.8]} ry={0} shirt="#8E3A6A" hair="#C89A5A" pants="#2E3038" pose={{ armR: 0.9, foreR: 1.4, head: -0.1 }} />
    </>
  );
};
const HamScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Room t={t} />
    <Cam pos={[1.6, 1.45, 0.4]} look={[-0.6, 1.05, -1.2]} fov={40} />
    <Table t={t} from={-1} to={30} lean={(i, side) => (i === 1 && side < 0 ? 0.25 : 0)} />
    <mesh position={[0.05, 0.84, -0.9]} scale={[1.2, 0.8, 0.9]} castShadow><sphereGeometry args={[0.12, 20, 14]} /><meshStandardMaterial color="#C8645A" roughness={0.5} /></mesh>
    <mesh position={[0.05, 0.78, -0.9]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.2, 24]} /><meshStandardMaterial color="#F4F1EA" /></mesh>
  </>
);
const OutroScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Bg color="#04050A" fog={[6, 70]} />
    <ambientLight intensity={0.15} />
    {Array.from({ length: 12 }, (_, i) => <pointLight key={i} position={[0, 2.4, -i * 5]} intensity={3} distance={6} color="#FFB868" />)}
    <Box p={[0, -0.05, -40]} s={[8, 0.1, 100]} color="#1A140E" />
    <Cam pos={[0.6, 3 + t * 2.2, 3 + t * 1.5]} look={[0, 0.5, -16]} fov={42} far={300} />
    <Table t={t} from={-1} to={90} />
  </>
);

const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const fi = (a: number, d = 0.3) => cl((t - a) / d);
  const ab = (i: number) => t >= B[i].a && t < B[i].b;
  const op = (i: number) => (ab(i) ? Math.min(fi(B[i].a + 0.15), cl((B[i].b - t) / 0.2)) : 0);
  const up = (a: number, b: number, d: number) => ease((t - a) / d) * b;
  return (
    <>
      <TopPill />
      {ab(0) && <HookTitle lines={["Was wäre, wenn", "ganz Deutschland", "an einem Tisch Weihnachten feiert?"]} accent={A} op={fi(0.05, 0.25)} y={470} />}
      {ab(1) && <Counter label="STÜHLE" value={fmt(Math.round(up(B[1].a + 0.6, 83500000, B[1].b - B[1].a - 1)))} sub="Heiligabend · 18:00 Uhr" accent={A} op={op(1)} />}
      {ab(2) && (t < T.tisch
        ? <InfoCard label="ANNAHME" text="60 cm pro Gedeck, auf beiden Seiten des Tisches." source="Gastro-Standard · eigene Rechnung" accent={A} op={op(2)} />
        : <Counter label="TISCHLÄNGE" value={fmt(Math.round(up(T.tisch, 25050, 1.8))) + " km"} sub="83,5 Mio. ÷ 2 × 60 cm" accent={A} op={op(2)} />)}
      {ab(3) && <BigNumber value="62,5 %" sub="DES ERDUMFANGS" accent={A} op={op(3)} />}
      {ab(4) && <Counter label="GÄNSE" value={fmt(Math.round(up(B[4].a + 0.4, 10437500, 1.6)))} sub="eine Gans für 8 Personen" accent={A} op={op(4)} />}
      {ab(5) && <Counter label="DEIN PLATZ" value={fmt(41750000)} sub="genau in der Mitte" accent={A} op={op(5)} />}
      {(ab(7) || ab(8)) && (t < T.kalt - 1.3
        ? <Counter label="WEITERGEREICHT" value={fmt(Math.round(up(B[7].a, 20875000, B[8].a + 0.8 - B[7].a)))} sub="1 Sekunde pro Person" accent={A} />
        : <BigNumber value="23. August" sub="2027 · NACH 242 TAGEN" accent={A} op={fi(T.kalt - 1.3, 0.25) * cl((B[8].b - t) / 0.2)} />)}
      {ab(9) && <Counter label="SCHALL BIS ZUM ENDE" value={fmt(up(B[9].a + 0.5, 10.1, B[9].b - B[9].a - 1), 1) + " Std."} sub="12.525 km · 343 m/s" accent={A} op={op(9)} />}
      {ab(10) && (t < T.juli - 0.1
        ? <Counter label="WEIHNACHTSMANN" value={fmt(Math.round(up(B[10].a + 0.3, 25050, T.juli - B[10].a - 0.4))) + " km"} sub="bei 5 km/h" accent={A} op={op(10)} />
        : <BigNumber value="21. Juli" sub="2027 · NACH 209 TAGEN" accent={A} op={fi(T.juli - 0.1, 0.25) * cl((B[10].b - t) / 0.2)} />)}
      {ab(11) && t > T.erstes && <InfoCard label="ERSTES MAL" text="83,5 Mio. Menschen. Ein Tisch. Kein Wort über Politik." accent={A} op={fi(T.erstes, 0.3) * cl((B[11].b - t) / 0.2)} />}
      {ab(12) && t > T.stille - 0.1 && <Counter label="STILLE POST" value="3 Sek." sub="pro Person · 20,9 Mio. Personen" accent={A} op={fi(T.stille - 0.1) * cl((B[12].b - t) / 0.2)} />}
      {ab(13) && (t < T.schinken - 0.1
        ? <BigNumber value="18.12.2028" sub="NACH 725 TAGEN" accent={A} op={fi(B[13].a + 0.2, 0.25)} />
        : (
          <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: fi(T.schinken - 0.1, 0.2), transform: `scale(${0.9 + 0.1 * ease((t - T.schinken + 0.1) / 0.3)})` }}>
            <div style={{ background: "rgba(250,247,240,.96)", borderRadius: 40, padding: "26px 40px", fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: "#1A1410", boxShadow: "0 14px 50px rgba(0,0,0,.5)" }}>„Hast du schon Schinken?“</div>
          </div>
        ))}
      <FollowPill text="Folg – dann siehst du, wann die Soße ankommt." op={Math.min(fi(B[5].a + 0.3), cl((B[7].a - 0.3 - t) / 0.3))} />
      <Captions words={words} t={t} hideUntil={B[1].a - 0.05} />
    </>
  );
};

export const Weihnachtstafel: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cur = B.findIndex((b) => t >= b.a && t < b.b);
  const lt = cur >= 0 ? t - B[cur].a : 0;
  const dur = cur >= 0 ? B[cur].b - B[cur].a : 1;
  const L = (x: number) => x - (cur >= 0 ? B[cur].a : 0);
  let scene: React.ReactNode = null;
  switch (cur) {
    case 0: scene = <HookScene t={lt} />; break;
    case 1: scene = <ChairsScene t={lt} />; break;
    case 2: scene = <MeasureScene t={lt} tableT={L(T.tisch)} />; break;
    case 3: scene = <GlobeScene t={lt} dur={dur} />; break;
    case 4: scene = <KitchenScene t={lt} omaT={L(T.oma)} />; break;
    case 5: scene = <MiddleScene t={lt} />; break;
    case 6: scene = <GravyScene t={lt} ask={L(T.kannst)} />; break;
    case 7: scene = <PassScene t={lt} />; break;
    case 8: scene = t < T.kalt - 1.3 ? <PassScene t={lt + 5} /> : <ArriveScene t={t - T.kalt + 1.3} />; break;
    case 9: scene = <SingScene t={lt} />; break;
    case 10: scene = <SantaScene t={lt} />; break;
    case 11: scene = <ToastScene t={lt} />; break;
    case 12: scene = <WhisperScene t={lt} stille={L(T.stille)} />; break;
    case 13: scene = <HamScene t={lt} />; break;
    default: scene = <OutroScene t={lt} />;
  }
  const sfx = (name: string, at: number, vol = 0.5) => <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={180}><Audio src={staticFile(`wwd/weihnachtstafel/sfx/${name}.mp3`)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        {scene}
      </ThreeCanvas>
      <Grade />
      <Overlay t={t} />
      <Audio src={staticFile("wwd/weihnachtstafel/voice.mp3")} />
      <Audio src={staticFile("wwd/weihnachtstafel/music.mp3")} volume={(fr) => 0.16 * Math.min(1, fr / 20) * Math.min(1, (WT_END * 30 - fr) / 30)} />
      {B.slice(1).map((b, i) => <React.Fragment key={i}>{sfx("whoosh", b.a - 0.15, 0.2)}</React.Fragment>)}
      {sfx("chatter", 0, 0.18)}
      {sfx("tick", B[1].a + 0.6, 0.3)}
      {sfx("tick", T.tisch, 0.3)}
      {sfx("hit", B[3].a, 0.4)}
      {sfx("oven", B[4].a, 0.4)}
      {sfx("pour", T.kannst, 0.35)}
      {sfx("tick", T.kalt - 1.3, 0.35)}
      {sfx("choir", B[9].a, 0.3)}
      {sfx("steps", B[10].a, 0.4)}
      {sfx("bells", B[10].a + 0.4, 0.3)}
      {sfx("clink", B[11].a + 0.3, 0.55)}
      {sfx("whisper", T.stille, 0.6)}
      {sfx("hit", T.schinken, 0.35)}
    </AbsoluteFill>
  );
};
