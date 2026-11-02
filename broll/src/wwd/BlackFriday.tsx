// "Was wäre, wenn ganz Deutschland am Black Friday gleichzeitig bestellt?" — episode 1 of the Was-wäre-wenn series.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import {
  BigNumber, Bg, Box, Cam, Captions, Counter, FollowPill, Grade, GermanyMap, HookTitle, InfoCard, Parcel, Person, TopPill, V3, Van, Word,
  beatsFrom, buildDots, cl, ease, findPhrase, fmt, inOut, lerp, lerp3, rnd, rr, useDyn, useGeo, back, SANS, SERIF, canvasTex, parcelTex,
} from "./kit";
import wordsJson from "../../public/wwd/blackfriday/words.json";

const words = wordsJson as Word[];
const A = "#F2B33D";
const W = 1080, H = 1920;
export const BF_END = words[words.length - 1].e + 1.9;
const B = beatsFrom(words, ["Was wäre", "Donnerstag", "Mitternacht.", "Jeder nur", "DHL schafft", "Tag 1.", "Tag 2.", "Tag 3.", "Tag 4.", "Tag 6,", "Du machst es auf.", "Und dann kommt die", "Bei Mode", "Die Transporter drehen", "Und genau da", "Dein Daumen liegt schon"], BF_END);
const ws = (ph: string, from = 0) => words[findPhrase(words, ph, from)].s;
const T = {
  drueck: ws("drücken"), iss: ws("25-mal"), nacht: ws("Für diese eine"), ruhe: ws("Zustellung heute"), kaffee: ws("Ihr trinkt"),
  klingelt: ws("Es klingelt."), deinPaket: ws("Dein Paket.", findPhrase(words, "Es klingelt.")), kabel: ws("Ein Kabel."), mio14: ws("14 Millionen."),
  cyber: ws("Cyber"), knopf: ws("Knopf."), frage: ws("Was hast"),
};

// ---------- phone screens ----------
const drawShop = (c: CanvasRenderingContext2D, clock: string, press: number, glow: number) => {
  c.fillStyle = "#F6F4F1"; c.fillRect(0, 0, 540, 1100);
  c.fillStyle = "#111"; c.font = `600 30px ${SANS}`; c.textAlign = "left"; c.fillText(clock, 44, 62);
  c.fillStyle = "#111"; rr(c, 36, 110, 468, 70, 35); c.fill();
  c.fillStyle = A; c.font = `800 30px ${SANS}`; c.textAlign = "center"; c.fillText("BLACK FRIDAY", 270, 156);
  const g = c.createLinearGradient(0, 220, 0, 640); g.addColorStop(0, "#E9E4DC"); g.addColorStop(1, "#D9D2C6");
  c.fillStyle = g; rr(c, 36, 210, 468, 430, 28); c.fill();
  // product: headphones
  c.strokeStyle = "#2B2B30"; c.lineWidth = 26; c.beginPath(); c.arc(270, 430, 120, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
  c.fillStyle = "#2B2B30"; rr(c, 130, 410, 62, 120, 26); c.fill(); rr(c, 348, 410, 62, 120, 26); c.fill();
  c.fillStyle = A; rr(c, 400, 236, 84, 48, 24); c.fill(); c.fillStyle = "#111"; c.font = `800 26px ${SANS}`; c.fillText("−50 %", 442, 269);
  c.fillStyle = "#111"; c.textAlign = "left"; c.font = `700 36px ${SANS}`; c.fillText("Kopfhörer Pro", 44, 702);
  c.fillStyle = "#888"; c.font = `500 28px ${SANS}`; c.fillText("Nur heute", 44, 744);
  c.fillStyle = "#111"; c.font = `800 52px ${SANS}`; c.fillText("79,00 €", 44, 822);
  c.fillStyle = "#999"; c.font = `500 30px ${SANS}`; c.fillText("159,00 €", 260, 820); c.fillRect(258, 808, 130, 3);
  const s = 1 - press * 0.05;
  c.save(); c.translate(270, 950); c.scale(s, s);
  c.shadowColor = A; c.shadowBlur = 30 * glow;
  c.fillStyle = A; rr(c, -234, -55, 468, 110, 55); c.fill(); c.shadowBlur = 0;
  c.fillStyle = "#111"; c.textAlign = "center"; c.font = `800 40px ${SANS}`; c.fillText("Jetzt kaufen", 0, 14);
  c.restore();
};
const drawLock = (c: CanvasRenderingContext2D, k: number) => {
  const g = c.createLinearGradient(0, 0, 0, 1100); g.addColorStop(0, "#1B2340"); g.addColorStop(1, "#3A2440");
  c.fillStyle = g; c.fillRect(0, 0, 540, 1100);
  c.fillStyle = "#fff"; c.textAlign = "center"; c.font = `600 30px ${SANS}`; c.fillText("Montag, 30. November", 270, 170);
  c.font = `300 150px ${SANS}`; c.fillText("0:00", 270, 330);
  const y = lerp(-200, 420, back(k));
  c.fillStyle = "rgba(245,245,248,.94)"; rr(c, 26, y, 488, 170, 34); c.fill();
  c.fillStyle = A; rr(c, 50, y + 28, 60, 60, 16); c.fill();
  c.fillStyle = "#111"; c.textAlign = "left"; c.font = `700 26px ${SANS}`; c.fillText("SHOP · jetzt", 128, y + 66);
  c.font = `800 36px ${SANS}`; c.fillText("CYBER MONDAY", 50, y + 130);
  c.fillStyle = "#C8202A"; c.textAlign = "right"; c.fillText("−70 %", 490, y + 130);
};

const Phone: React.FC<{ tex: THREE.Texture; p: V3; rot?: V3; scale?: number; light?: number }> = ({ tex, p, rot = [0, 0, 0], scale = 1, light = 1 }) => (
  <group position={p} rotation={rot} scale={scale}>
    <Box p={[0, 0, -0.006]} s={[0.078, 0.16, 0.009]} color="#16161A" rough={0.3} metal={0.4} />
    <mesh position={[0, 0, -0.001]}><planeGeometry args={[0.072, 0.152]} /><meshBasicMaterial map={tex} toneMapped={false} color={new THREE.Color(light, light, light)} /></mesh>
    <pointLight position={[0, 0, 0.12]} intensity={0.5 * light} distance={0.8} color="#FFE7C4" />
  </group>
);

// ---------- scenes ----------
const Room: React.FC<{ tv?: boolean }> = ({ tv = true }) => (
  <>
    <Bg color="#07090F" fog={[3, 9]} />
    <ambientLight intensity={0.12} color="#9DB0E0" />
    <Box p={[0, -0.05, -1]} s={[12, 0.1, 10]} color="#3A2C22" rough={0.7} />
    <Box p={[0, 1.5, -3.2]} s={[12, 3.2, 0.1]} color="#1A2030" />
    {tv && <>
      <Box p={[0, 1.55, -3.1]} s={[1.9, 1.07, 0.06]} color="#0E1220" emissive="#3D4E8F" ei={0.55} />
      <pointLight position={[0, 1.5, -2.6]} intensity={2.2} distance={5} color="#6F86E8" />
      <Box p={[0, 0.3, -2.9]} s={[2.4, 0.5, 0.45]} color="#E8E6E2" />
    </>}
    <pointLight position={[-2.2, 2.2, 0.6]} intensity={3} distance={7} color="#FFB872" castShadow />
  </>
);
const HookScene: React.FC<{ t: number; tex: THREE.Texture }> = ({ t, tex }) => {
  const k = inOut(t / 3.6);
  return (
    <>
      <Room />
      <Cam pos={lerp3([0.5, 1.05, 1.7], [0.12, 0.8, 0.85], k)} look={[0, 0.5, -0.4]} fov={40} />
      <spotLight position={[0.3, 2.4, 0.6]} intensity={9} angle={0.5} penumbra={0.8} color="#FFC98A" castShadow />
      <Box p={[0, 0.2, 0]} s={[1.3, 0.4, 0.7]} color="#5B4636" />
      <Box p={[0, 0.42, 0]} s={[1.34, 0.04, 0.74]} color="#6E5643" />
      <Box p={[0, 0.35, 1.9]} s={[2.4, 0.7, 0.9]} color="#3D475B" />
      <Phone tex={tex} p={[0.05, 0.445, 0.05]} rot={[-Math.PI / 2, 0, 0.3]} scale={2.2} light={1.3} />
      <mesh position={[-0.4, 0.5, -0.1]} castShadow><cylinderGeometry args={[0.05, 0.04, 0.12, 16]} /><meshStandardMaterial color="#D8D2C8" /></mesh>
    </>
  );
};
// POV: two hands holding the phone
const PovScene: React.FC<{ t: number; tex: THREE.Texture; pressAt?: number; drift?: number }> = ({ t, tex, pressAt = 99, drift = 0 }) => {
  const press = Math.max(0, 1 - Math.abs(t - pressAt) / 0.18);
  const reach = cl((t - pressAt + 0.8) / 0.6);
  const skin = "#D8C2A6";
  const sway = Math.sin(t * 1.3) * 0.004;
  return (
    <>
      <Room />
      <Cam pos={[0, 1.2 + sway, 1.18 - t * 0.012]} look={[0, 1.0, 0]} fov={36} />
      <group position={[0, 0.86, 0.12]} rotation={[0.32, 0, 0]}>
        <Phone tex={tex} p={[0, 0, 0]} scale={2.1} light={1.15} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.13, -0.2, 0.0]} rotation={[0.3, 0, s * 0.6]} castShadow><capsuleGeometry args={[0.04, 0.22, 6, 12]} /><meshStandardMaterial color="#2F3542" roughness={0.9} /></mesh>
            <mesh position={[s * 0.085, -0.095, 0.012]} rotation={[0.2, 0, s * 0.4]} castShadow><capsuleGeometry args={[0.028, 0.06, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.85} /></mesh>
            <mesh position={[s * 0.088, -0.03, 0.0]} rotation={[0, 0, s * 0.2]} castShadow><capsuleGeometry args={[0.022, 0.1, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.85} /></mesh>
          </group>
        ))}
        <mesh position={[0.07 - reach * 0.06, -0.06 + reach * 0.02, 0.025 - press * 0.012]} rotation={[0.2, 0, 0.9 - reach * 0.5]} castShadow>
          <capsuleGeometry args={[0.017, 0.07, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
      </group>
    </>
  );
};
const MapScene: React.FC<{ t: number; dm: ReturnType<typeof buildDots>; reveal: number; tint?: { color: string; share: number }; pulse?: number }> = ({ t, dm, reveal, tint, pulse = 0 }) => (
  <>
    <Bg color="#05060A" />
    <Cam pos={[Math.sin(t * 0.12) * 0.6, 9.2 - t * 0.12, 4.4 - t * 0.05]} look={[0, 0, -0.2]} fov={44} />
    <group rotation={[0, 0, 0]} scale={[1, 1, 1]}>
      <GermanyMap dm={dm} reveal={reveal} tint={tint} size={0.07 + pulse * 0.02} />
    </group>
  </>
);
// tower of parcels from the ground to space
let _stackTex: THREE.Texture | null = null;
const stackTex = () => { if (_stackTex) return _stackTex; const t = canvasTex(256, 512, (c) => {
  for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#C79A66" : "#BC8E5B"; c.fillRect(0, i * 64, 256, 64); c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(0, i * 64, 256, 3); c.fillStyle = "#AE8150"; c.fillRect(100 + (i % 3) * 14, i * 64, 30, 64); }
}); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 4000); _stackTex = t; return t; };
let _earth: THREE.Texture | null = null;
const earthTex = () => _earth ??= canvasTex(2048, 1024, (c) => {
  const g = c.createLinearGradient(0, 0, 0, 1024); g.addColorStop(0, "#1E4E8C"); g.addColorStop(0.5, "#2A6BB0"); g.addColorStop(1, "#1E4E8C");
  c.fillStyle = g; c.fillRect(0, 0, 2048, 1024);
  const blob = (x: number, y: number, r: number, col: string, n: number, seed: number) => { c.fillStyle = col; for (let i = 0; i < n; i++) { c.beginPath(); c.arc(x + (rnd(seed + i) - 0.5) * r * 2, y + (rnd(seed + i * 2) - 0.5) * r, r * (0.2 + rnd(seed + i * 3) * 0.35), 0, Math.PI * 2); c.fill(); } };
  [[420, 330, 220], [600, 650, 160], [1050, 300, 260], [1150, 600, 180], [1550, 380, 300], [1700, 700, 140]].forEach(([x, y, r], i) => { blob(x, y, r, "#4E7A3A", 60, i * 100); blob(x + 30, y - 20, r * 0.6, "#7A6A45", 25, i * 100 + 50); });
  c.fillStyle = "#E8EEF6"; c.fillRect(0, 0, 2048, 18); c.fillRect(0, 1006, 2048, 18);
  for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255,255,255,${0.2 + rnd(i) * 0.3})`; c.beginPath(); c.ellipse(rnd(i * 7) * 2048, 220 + rnd(i * 9) * 580, 12 + rnd(i) * 40, 4 + rnd(i * 3) * 7, rnd(i * 5), 0, Math.PI * 2); c.fill(); }
});
const TowerScene: React.FC<{ t: number; dur: number; space: number }> = ({ t, dur, space }) => {
  if (t >= space) {
    const u = (t - space) / Math.max(0.5, dur - space);
    const R = 6371;
    return (
      <>
        <Bg color="#02030A" />
        <ambientLight intensity={0.25} />
        <directionalLight position={[30000, 12000, 20000]} intensity={3.2} color="#FFF4E0" />
        <Cam pos={[5600 - u * 900, 9000, 30500 - u * 2200]} look={[0, 8300, 0]} fov={42} far={500000} />
        <mesh rotation={[0.3, 2.2, 0]}><sphereGeometry args={[R, 128, 96]} /><meshStandardMaterial map={earthTex()} roughness={0.85} /></mesh>
        <mesh><sphereGeometry args={[R * 1.03, 96, 64]} /><meshBasicMaterial color="#6FA8FF" transparent opacity={0.18} side={THREE.BackSide} /></mesh>
        <mesh position={[0, R + 5010, 0]}><boxGeometry args={[90, 10020, 90]} /><meshStandardMaterial color="#E9A642" emissive="#FFB040" emissiveIntensity={0.6} roughness={0.8} /></mesh>
        <mesh rotation={[Math.PI / 2 - 0.25, 0, 0]}><torusGeometry args={[R + 408, 22, 8, 256]} /><meshBasicMaterial color="#9EC5FF" transparent opacity={0.85} /></mesh>
        <mesh position={[0, (R + 408) * Math.cos(0.25), (R + 408) * Math.sin(0.25)]}><sphereGeometry args={[90, 16, 12]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
        {Array.from({ length: 400 }, (_, i) => <mesh key={"s" + i} position={[(rnd(i * 3) - 0.5) * 300000, (rnd(i * 5) - 0.3) * 300000, -120000 - rnd(i * 7) * 60000]}><sphereGeometry args={[160, 4, 4]} /><meshBasicMaterial color="#fff" /></mesh>)}
      </>
    );
  }
  const k = inOut(t / space);
  const camY = 1.5 + Math.pow(k, 2.6) * 9000;
  const R = 60000;
  const sky = new THREE.Color("#7FA7D6").lerp(new THREE.Color("#02030A"), cl((camY - 1500) / 5000));
  return (
    <>
      <Bg color={"#" + sky.getHexString()} fog={camY < 2000 ? [600, 9000] : undefined} />
      <hemisphereLight args={["#DDEBFF", "#4A6B3A", 0.9]} />
      <directionalLight position={[50, 80, 30]} intensity={2.2} color="#FFF1DA" />
      <Cam pos={[0.9, camY, 1.9]} look={[0, camY + 2.2, -0.2]} fov={52} far={200000} />
      <mesh position={[0, -R, 0]}><sphereGeometry args={[R, 128, 96]} /><meshStandardMaterial color="#5E8A4A" roughness={1} /></mesh>
      <mesh position={[0, -R, 0]}><sphereGeometry args={[R * 1.02, 96, 64]} /><meshBasicMaterial color="#8FB8FF" transparent opacity={0.12} side={THREE.BackSide} /></mesh>
      <mesh position={[0, 5000, 0]} castShadow><boxGeometry args={[0.5, 10000, 0.5]} /><meshStandardMaterial map={stackTex()} roughness={0.9} /></mesh>
      {Array.from({ length: 30 }, (_, i) => (
        <mesh key={i} position={[(rnd(i) - 0.5) * 700 + (rnd(i) < 0.5 ? -60 : 60), 1100 + rnd(i + 3) * 300, (rnd(i + 7) - 0.5) * 700 - 100]} scale={[60 + rnd(i) * 80, 12, 40 + rnd(i + 1) * 60]}>
          <sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#F4F7FB" transparent opacity={0.8} />
        </mesh>
      ))}
      {/* ISS near the top */}
      <group position={[3, 4080, -2]} scale={2.2}>
        <Box p={[0, 0, 0]} s={[3, 0.3, 0.3]} color="#D8DCE2" metal={0.4} rough={0.4} />
        {[-1.4, 1.4].map((x) => <Box key={x} p={[x, 0, 0]} s={[0.12, 0.05, 2.6]} color="#2A3D7A" metal={0.6} rough={0.3} emissive="#203070" ei={0.3} />)}
      </group>
      {Array.from({ length: 300 }, (_, i) => (
        <mesh key={"s" + i} position={[(rnd(i * 3) - 0.5) * 60000, 20000 + rnd(i * 5) * 30000, -20000 - rnd(i * 7) * 30000]}><sphereGeometry args={[30, 4, 4]} /><meshBasicMaterial color="#fff" transparent opacity={cl((camY - 3000) / 3000)} /></mesh>
      ))}
    </>
  );
};
// DHL-ish sorting hub
const HubScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Bg color="#0B0D12" fog={[6, 26]} />
    <ambientLight intensity={0.25} />
    <Cam pos={[3.2 - t * 0.12, 3.4, 6.5 - t * 0.25]} look={[0, 0.8, -3]} fov={42} />
    <Box p={[0, -0.05, -6]} s={[30, 0.1, 30]} color="#2B2E35" rough={0.6} />
    {Array.from({ length: 6 }, (_, i) => <Box key={"l" + i} p={[0, 6, 2 - i * 4]} s={[6, 0.05, 0.4]} color="#fff" emissive="#FFF5E0" ei={2} cast={false} />)}
    <pointLight position={[0, 5, 0]} intensity={8} distance={18} color="#FFE8C0" castShadow />
    {[-2.2, 0, 2.2].map((x, li) => (
      <group key={li}>
        <Box p={[x, 0.55, -6]} s={[1, 0.12, 30]} color="#2E2F33" rough={0.4} />
        <Box p={[x - 0.55, 0.65, -6]} s={[0.08, 0.15, 30]} color="#F2C230" />
        <Box p={[x + 0.55, 0.65, -6]} s={[0.08, 0.15, 30]} color="#F2C230" />
        {Array.from({ length: 22 }, (_, i) => {
          const z = ((i * 1.35 + t * (1.6 + li * 0.2) + li * 0.5) % 29.7) - 21;
          return <Parcel key={i} p={[x + (rnd(i + li) - 0.5) * 0.3, 0.76, z]} rot={[0, rnd(i * 3 + li) * 0.6, 0]} scale={0.8 + rnd(i + 9) * 0.5} />;
        })}
      </group>
    ))}
    {Array.from({ length: 4 }, (_, i) => <Person key={i} p={[i % 2 ? 3.4 : -3.4, 0, -1 - i * 3.2]} ry={i % 2 ? -Math.PI / 2 : Math.PI / 2} shirt="#F2C230" pants="#2E3440" pose={{ armR: 0.9, armL: 0.9, foreL: 0.4, foreR: 0.4 }} />)}
    {Array.from({ length: 40 }, (_, i) => <Parcel key={"pile" + i} p={[-5 + rnd(i) * 1.5, 0.14 + Math.floor(i / 10) * 0.28, -2 - (i % 10) * 0.45]} />)}
  </>
);
const Street: React.FC<{ night?: boolean }> = ({ night = true }) => (
  <>
    <Bg color={night ? "#0A0E18" : "#9FB6CF"} fog={night ? [5, 22] : [20, 80]} />
    <hemisphereLight args={[night ? "#3A4A78" : "#DDE8F5", "#1A1A1A", night ? 0.35 : 1]} />
    <Box p={[0, -0.05, -5]} s={[40, 0.1, 40]} color={night ? "#23262D" : "#5C6068"} rough={0.35} />
    <Box p={[0, 0.02, -5]} s={[40, 0.06, 3.2]} color="#8A8C90" rough={0.8} />
  </>
);
const PackstationScene: React.FC<{ t: number }> = ({ t }) => {
  const doors = Array.from({ length: 30 }, (_, i) => i);
  return (
    <>
      <Street />
      <Cam pos={[2.2 - t * 0.15, 1.7, 6.2 - t * 0.3]} look={[0, 1.0, -0.6]} fov={42} />
      <pointLight position={[2.5, 4, 1.5]} intensity={14} distance={12} color="#FFD49A" castShadow />
      <Box p={[3.2, 2, 1.5]} s={[0.08, 4, 0.08]} color="#3A3D44" />
      <Box p={[0, 1.15, -1.3]} s={[4.2, 2.3, 0.6]} color="#F2C230" rough={0.5} />
      <Box p={[0, 2.38, -1.25]} s={[4.4, 0.16, 0.75]} color="#C8202A" />
      {doors.map((i) => {
        const col = i % 6, row = Math.floor(i / 6);
        const open = rnd(i * 2.7) < 0.8;
        const x = -1.75 + col * 0.7, y = 0.3 + row * 0.42;
        return (
          <group key={i}>
            <Box p={[x, y, -0.99]} s={[0.66, 0.38, 0.02]} color="#141414" cast={false} />
            <group position={[x - 0.33, y, -0.98]} rotation={[0, open ? -1.6 - rnd(i) * 0.4 : 0, 0]}>
              <Box p={[0.33, 0, 0.01]} s={[0.64, 0.36, 0.03]} color="#E5B42B" rough={0.5} />
            </group>
            {open && <Parcel p={[x, y - 0.04, -0.95]} s={[0.5, 0.26, 0.3]} />}
          </group>
        );
      })}
      {Array.from({ length: 46 }, (_, i) => <Parcel key={"p" + i} p={[-1.8 + rnd(i) * 3.8, 0.13 + Math.floor(rnd(i + 5) * 3) * 0.26, -0.5 + rnd(i * 3) * 1.6]} rot={[0, rnd(i * 7) * 3, 0]} scale={0.8 + rnd(i * 11) * 0.5} />)}
      <Person p={[1.3, 0, 0.9]} ry={-2.6} shirt="#6C4A3A" pants="#2A2E38" pose={{ armR: 0.25, armL: 0.05, head: 0.15 }} />
    </>
  );
};
const HighwayScene: React.FC<{ t: number; reverse?: boolean }> = ({ t, reverse = false }) => {
  const vans = Array.from({ length: 70 }, (_, i) => i);
  return (
    <>
      <Bg color="#C9B79A" fog={[30, 140]} />
      <hemisphereLight args={["#FFE6C4", "#4C5A3A", 1.1]} />
      <directionalLight position={[-30, 40, 20]} intensity={2.4} color="#FFD7A0" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
      <Cam pos={[18 - t * 0.4, 16, 22]} look={[0, 0, -12 - t * 0.6]} fov={40} far={400} />
      <Box p={[0, -0.1, -40]} s={[300, 0.1, 300]} color="#6F7F4E" rough={1} cast={false} />
      <Box p={[0, 0, -40]} s={[22, 0.1, 300]} color="#45474C" rough={0.6} cast={false} />
      <Box p={[0, 0.1, -40]} s={[0.8, 0.3, 300]} color="#9A9C9F" />
      {[-7.5, -3.75, 3.75, 7.5].map((x) => Array.from({ length: 40 }, (_, j) => <Box key={x + "-" + j} p={[x, 0.06, -170 + j * 8]} s={[0.15, 0.02, 3]} color="#E8E8E8" cast={false} />))}
      {vans.map((i) => {
        const lane = i % 5;
        const side = lane < 3 ? 1 : -1;
        const x = side > 0 ? 1.9 + (lane % 3) * 3.6 : -(1.9 + (lane % 2) * 3.6);
        const speed = 7 + rnd(i) * 2;
        const dir = reverse ? -side : side;
        const z = ((-i * 5.1 + dir * t * speed + 10000) % 160) - 140;
        return <Van key={i} p={[x * (reverse ? -1 : 1), 0, z]} ry={dir > 0 ? Math.PI : 0} />;
      })}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={"tr" + i} position={[(i % 2 ? 1 : -1) * (16 + rnd(i) * 30), 2, -150 + i * 7]} castShadow><coneGeometry args={[1.6, 5, 8]} /><meshStandardMaterial color="#3E5A35" roughness={1} /></mesh>
      ))}
    </>
  );
};
const WindowsScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Bg color="#141A2A" fog={[8, 30]} />
    <hemisphereLight args={["#5A6FA8", "#1A1A20", 0.5]} />
    <Cam pos={[-1.5 + t * 0.15, 4.2, 10 - t * 0.35]} look={[0, 4.6, 0]} fov={40} />
    <Box p={[0, 5, -0.5]} s={[14, 12, 1]} color="#8C8F96" rough={0.9} />
    {Array.from({ length: 24 }, (_, i) => {
      const c = i % 6, r = Math.floor(i / 6); const x = -5 + c * 2, y = 1.6 + r * 2.4;
      const lit = rnd(i * 3) < 0.85;
      return (
        <group key={i}>
          <Box p={[x, y, 0.0]} s={[1.3, 1.6, 0.05]} color={lit ? "#FFD9A0" : "#1E2433"} emissive={lit ? "#FFB860" : "#000"} ei={lit ? 1.2 : 0} cast={false} />
          {lit && rnd(i) < 0.8 && <Person p={[x + (rnd(i + 2) - 0.5) * 0.5, y - 1.4, 0.15]} ry={0} scale={0.82} shirt={["#4F6D7A", "#8A4F4F", "#5C7A4F", "#7A6A4F"][i % 4]} hair={["#2B2018", "#8A6A3A", "#1A1A1A", "#B0B0B0"][i % 4]} pose={{ armR: 0.6 + (i % 3) * 0.2, foreR: 1.2, head: 0.25 }} />}
          <Box p={[x, y - 0.85, 0.3]} s={[1.5, 0.12, 0.6]} color="#7A7D84" />
        </group>
      );
    })}
    <pointLight position={[0, 3, 6]} intensity={6} distance={20} color="#FFB870" />
  </>
);
const HallScene: React.FC<{ t: number; cups: boolean }> = ({ t, cups }) => {
  const cup = <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.034, 0.09, 16]} /><meshStandardMaterial color="#F2EEE8" roughness={0.5} /></mesh>;
  return (
    <>
      <Bg color="#120E0B" fog={[4, 14]} />
      <ambientLight intensity={0.25} color="#FFDDBB" />
      <pointLight position={[0, 2.7, 0.5]} intensity={8} distance={8} color="#FFC888" castShadow />
      <Cam pos={[2.6 - t * 0.1, 1.55, 3.4 - t * 0.12]} look={[0, 1.15, 0]} fov={40} />
      <Box p={[0, -0.05, 0]} s={[8, 0.1, 8]} color="#6B5440" rough={0.6} />
      <Box p={[0, 1.5, -1.6]} s={[8, 3, 0.1]} color="#D9CDB8" />
      <Box p={[-1.0, 1.05, -1.53]} s={[0.95, 2.1, 0.06]} color="#7A5A3E" />
      <Box p={[1.4, 1.05, -1.53]} s={[0.95, 2.1, 0.06]} color="#5E6A74" />
      <Person p={[-0.75, 0, -0.6]} ry={0.9} shirt="#5C7A4F" pants="#3A3F4A" hair="#8A8A8A" pose={{ armR: cups ? 0.9 : 0.75, foreR: cups ? 0.9 : 1.0, armL: cups ? 0.05 : 0.7, foreL: cups ? 0 : 1.0 }}>{cups ? cup : <Parcel p={[0.12, 0.05, 0.12]} s={[0.42, 0.28, 0.32]} />}</Person>
      <Person p={[0.75, 0, -0.2]} ry={-1.25} shirt="#4F6D7A" pants="#2E3440" hair="#3A2A1E" pose={{ armR: cups ? 0.9 : 0.1, foreR: cups ? 0.9 : 0 }}>{cups ? cup : null}</Person>
      {cups && <Parcel p={[0.1, 0.14, 0.2]} rot={[0, 0.4, 0]} />}
    </>
  );
};
const DoorScene: React.FC<{ t: number; ring: number; push: number }> = ({ t, ring, push }) => (
  <>
    <Bg color="#0E0C0A" fog={[3, 10]} />
    <ambientLight intensity={0.5} color="#FFDDBB" />
    <spotLight position={[0.4, 2.8, 1.6]} intensity={22} angle={0.55} penumbra={0.7} distance={9} color="#FFC07A" castShadow />
    <Cam pos={lerp3([0.9, 1.4, 3.2], [0.15, 0.55, 1.1], inOut(push))} look={lerp3([0, 1.0, -1], [0, 0.15, -0.6], inOut(push))} fov={40} />
    <Box p={[0, -0.05, 0]} s={[8, 0.1, 8]} color="#55463A" />
    <Box p={[0, 1.5, -1.2]} s={[8, 3, 0.1]} color="#D8CCB6" />
    <Box p={[0, 1.05, -1.13]} s={[1.0, 2.1, 0.06]} color="#4E6A80" />
    <Box p={[0, 1.05, -1.14]} s={[1.12, 2.2, 0.05]} color="#EDE6DA" />
    <mesh position={[0.36, 1.0, -1.08]}><sphereGeometry args={[0.035, 12, 10]} /><meshStandardMaterial color="#C9A86A" metalness={0.8} roughness={0.3} /></mesh>
    <Box p={[0.75, 1.3, -1.13]} s={[0.07, 0.11, 0.03]} color="#222" emissive="#FFE0A0" ei={0.3 + ring * 3} />
    <Box p={[0, 0.01, -0.55]} s={[0.9, 0.02, 0.55]} color="#4A3A2A" rough={1} />
    <Parcel p={[0, 0.16, -0.55]} rot={[0, 0.25, 0]} scale={1.1} />
  </>
);
const OpenScene: React.FC<{ t: number }> = ({ t }) => {
  const o = ease(t / 0.9);
  const rise = ease((t - 0.9) / 1.0);
  const curve = React.useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 220; i++) { const a = i * 0.21; pts.push(new THREE.Vector3(Math.cos(a) * 0.07, i * 0.0022, Math.sin(a) * 0.07)); }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  return (
    <>
      <Bg color="#0E0C0A" fog={[2, 7]} />
      <ambientLight intensity={0.25} color="#FFDDBB" />
      <spotLight position={[0.4, 2.2, 1]} intensity={14} angle={0.6} penumbra={0.7} color="#FFD49A" castShadow />
      <Cam pos={[0.0, 0.85 + t * 0.03, 0.95 - t * 0.04]} look={[0, 0.25, 0]} fov={40} />
      <Box p={[0, -0.05, 0]} s={[6, 0.1, 6]} color="#55463A" />
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow><boxGeometry args={[0.5, 0.32, 0.38]} /><meshStandardMaterial map={parcelTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <Box p={[0, 0.315, 0]} s={[0.48, 0.01, 0.36]} color="#3A2A1A" cast={false} />
      {[[0, 0.19, 1], [0, -0.19, -1]].map(([x, z, s], i) => (
        <group key={i} position={[0, 0.32, z]} rotation={[s * -o * 2.2, 0, 0]}><mesh position={[0, 0, s * 0.095]} castShadow><boxGeometry args={[0.5, 0.008, 0.19]} /><meshStandardMaterial map={parcelTex()} /></mesh></group>
      ))}
      {[[0.25, 1], [-0.25, -1]].map(([x, s], i) => (
        <group key={"s" + i} position={[x, 0.32, 0]} rotation={[0, 0, s * o * 2.0]}><mesh position={[s * 0.06, 0, 0]} castShadow><boxGeometry args={[0.12, 0.008, 0.38]} /><meshStandardMaterial map={parcelTex()} /></mesh></group>
      ))}
      <group position={[0, 0.12 + rise * 0.36, 0]} rotation={[0.5 + Math.sin(t * 1.5) * 0.08, t * 0.5, 0.2]}>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[Math.PI / 2 + (rnd(i) - 0.5) * 0.35, (rnd(i + 4) - 0.5) * 0.35, 0]} castShadow><torusGeometry args={[0.085 + i * 0.002, 0.007, 8, 48]} /><meshStandardMaterial color="#F2F2F2" roughness={0.45} /></mesh>)}
        <mesh position={[0.1, -0.04, 0]} rotation={[0, 0, 0.6]} castShadow><cylinderGeometry args={[0.007, 0.007, 0.12, 8]} /><meshStandardMaterial color="#F2F2F2" roughness={0.45} /></mesh>
        <Box p={[0.14, -0.09, 0]} s={[0.026, 0.05, 0.016]} color="#E8E8E8" rough={0.3} rot={[0, 0, 0.6]} />
        <Box p={[0.155, -0.12, 0]} s={[0.012, 0.022, 0.006]} color="#B8B8B8" metal={0.9} rough={0.2} rot={[0, 0, 0.6]} />
      </group>
    </>
  );
};
const ModeScene: React.FC<{ t: number }> = ({ t }) => {
  const shirt = (c: string) => (
    <group>
      <Box p={[0, 0, 0]} s={[0.42, 0.55, 0.06]} color={c} />
      <Box p={[0.27, 0.17, 0]} s={[0.18, 0.18, 0.06]} color={c} rot={[0, 0, -0.6]} />
      <Box p={[-0.27, 0.17, 0]} s={[0.18, 0.18, 0.06]} color={c} rot={[0, 0, 0.6]} />
    </group>
  );
  return (
    <>
      <Bg color="#1A1716" fog={[3, 12]} />
      <ambientLight intensity={0.35} />
      <spotLight position={[0, 3.5, 2]} intensity={20} angle={0.7} penumbra={0.6} castShadow color="#FFE8CC" />
      <Cam pos={[0, 1.5, 3.2 - t * 0.1]} look={[0, 1.3, 0]} fov={40} />
      <Box p={[0, -0.05, 0]} s={[8, 0.1, 8]} color="#3A3330" />
      <Box p={[0, 1.5, -1.0]} s={[8, 3, 0.1]} color="#2C2725" />
      <Box p={[0, 1.95, 0]} s={[2.2, 0.03, 0.03]} color="#B8B8B8" metal={0.8} rough={0.3} />
      {["#C8202A", "#E8E4DC", "#3D5A80"].map((c, i) => {
        const gone = i < 2 ? ease((t - 0.6 - i * 0.35) / 0.7) : 0;
        return <group key={i} position={[-0.7 + i * 0.7 + gone * (i === 0 ? -3 : 3), 1.55 + gone * 0.6, 0]} rotation={[0, 0, gone * (i === 0 ? 0.6 : -0.6)]}>{shirt(c)}</group>;
      })}
    </>
  );
};

// ---------- overlay per beat ----------
const daySub = (d: number) => `Tag ${d}`;
const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const fi = (a: number, d = 0.3) => cl((t - a) / d);
  const ab = (i: number) => t >= B[i].a && t < B[i].b;
  const opBeat = (i: number) => (ab(i) ? Math.min(fi(B[i].a + 0.15), cl((B[i].b - t) / 0.2)) : 0);
  const delivered = (() => {
    if (t < B[5].a) return 0;
    const pts: [number, number][] = [[B[5].a, 0], [B[6].a, 14.9], [B[7].a, 29.7], [B[8].a, 44.6], [B[9].a, 59.4], [T.klingelt, 86.4]];
    for (let i = pts.length - 1; i >= 0; i--) if (t >= pts[i][0]) { const n = pts[i + 1]; return n ? lerp(pts[i][1], n[1], ease((t - pts[i][0]) / 0.9)) : pts[i][1]; }
    return 0;
  })();
  const dayN = [1, 2, 3, 4, 6][[5, 6, 7, 8, 9].findIndex((i) => ab(i))] ?? 0;
  return (
    <>
      <TopPill />
      {ab(0) && <HookTitle lines={["Was wäre, wenn", "ganz Deutschland", "am Black Friday gleichzeitig bestellt?"]} accent={A} op={fi(0.05, 0.25)} y={470} />}
      {ab(1) && <Counter label="BESTELLUNGEN" value="0" sub="Do · 23:59 Uhr" accent={A} op={opBeat(1)} />}
      {ab(2) && <>
        <InfoCard label="ANNAHME" text="Alle 83,5 Mio. Menschen in Deutschland bestellen um 0:00 genau ein Paket." source="Destatis · eigene Annahme" accent={A} op={opBeat(2)} />
        <Counter label="BESTELLUNGEN" value={fmt(Math.round(83500000 * ease((t - B[2].a - 0.3) / (T.drueck + 1.4 - B[2].a))))} sub="Fr · 0:00 Uhr" accent={A} op={opBeat(2)} y={450} />
      </>}
      {ab(3) && (t < T.iss
        ? <Counter label="STAPELHÖHE" value={fmt(Math.round(10020 * Math.pow(cl((t - B[3].a) / (B[3].b - B[3].a - 0.4)), 2.6))) + " km"} sub="83,5 Mio. Pakete à 12 cm" accent={A} op={opBeat(3)} />
        : <BigNumber value="25 ×" sub="BIS ZUR ISS · 10.020 KM" accent={A} op={fi(T.iss, 0.25)} />)}
      {ab(4) && (t < T.nacht
        ? <InfoCard label="ECHTER REKORD" text="12,4 Mio. Sendungen an einem Tag: DHL-Rekord in der Black Week 2025." source="DHL, 02.12.2025" accent={A} op={opBeat(4)} />
        : <BigNumber value="6,7 Tage" sub="BIS ALLES ZUGESTELLT IST" source="83,5 Mio. ÷ 12,4 Mio. pro Tag" accent={A} op={fi(T.nacht, 0.25) * cl((B[4].b - t) / 0.2)} />)}
      {dayN > 0 && <Counter label="ZUGESTELLT" value={fmt(delivered, 1) + " %"} sub={daySub(dayN) + (dayN === 6 ? " · 19:58 Uhr" : "")} accent={A} />}
      {ab(7) && t > T.ruhe - 0.1 && (
        <div style={{ position: "absolute", top: 230, left: 90, right: 90, opacity: fi(T.ruhe - 0.1, 0.25), transform: `translateY(${(1 - ease((t - T.ruhe + 0.1) / 0.3)) * -40}px)` }}>
          <div style={{ background: "rgba(245,245,248,.95)", borderRadius: 34, padding: "22px 28px", display: "flex", gap: 20, alignItems: "center", boxShadow: "0 12px 40px rgba(0,0,0,.4)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: A, flexShrink: 0 }} />
            <div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "#666" }}>PAKET · jetzt</div><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#111" }}>Zustellung heute</div><div style={{ fontFamily: SANS, fontSize: 24, color: "#444" }}>zwischen 8 und 20 Uhr</div></div>
          </div>
        </div>
      )}
      {ab(14) && t > T.cyber - 0.5 && (
        <div style={{ position: "absolute", top: 230, left: 90, right: 90, opacity: fi(T.cyber - 0.5, 0.25), transform: `translateY(${(1 - ease((t - T.cyber + 0.5) / 0.3)) * -40}px)` }}>
          <div style={{ background: "rgba(245,245,248,.96)", borderRadius: 34, padding: "22px 28px", display: "flex", gap: 20, alignItems: "center", boxShadow: "0 12px 40px rgba(0,0,0,.4)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: A, flexShrink: 0 }} />
            <div style={{ flex: 1 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "#666" }}>SHOP · jetzt</div><div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#111", display: "flex", justifyContent: "space-between" }}><span>CYBER MONDAY</span><span style={{ color: "#C8202A" }}>−70 %</span></div><div style={{ fontFamily: SANS, fontSize: 24, color: "#444" }}>Nur heute. Alles, was du gerade zurückgeschickt hast.</div></div>
          </div>
        </div>
      )}
      {ab(11) && <>
        <InfoCard label="ECHTE QUOTE" text="Etwa jedes sechste Paket geht in Deutschland zurück." source="Forschungsgruppe Retourenmanagement, Uni Bamberg" accent={A} op={opBeat(11)} />
        <Counter label="RETOUREN" value={fmt(Math.round(13900000 * ease((t - B[11].a - 0.6) / 2.6)))} sub="jedes 6. Paket" accent={A} op={opBeat(11)} y={480} />
      </>}
      {ab(12) && <BigNumber value="64 %" sub="RETOURENQUOTE BEI MODE" source="European Return-O-Meter, Uni Bamberg" accent={A} op={opBeat(12)} />}
      <FollowPill text="Folg – dann siehst du, was im Paket ist." op={Math.min(fi(B[5].a + 0.2), cl((B[7].a - 0.3 - t) / 0.3))} />
      <Captions words={words} t={t} hideUntil={B[1].a - 0.05} />
    </>
  );
};

export const BlackFriday: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const geo = useGeo();
  const dm = React.useMemo(() => (geo ? buildDots(geo) : null), [geo]);
  const clock = t < B[2].a ? `23:59` : "0:00";
  const shopTex = useDyn(540, 1100, (c) => drawShop(c, clock, Math.max(0, 1 - Math.abs(t - (ab(1) ? B[2].a - 0.25 : T.knopf + 0.1)) / 0.2), 0.6 + 0.4 * Math.sin(t * 5)));
  function ab(i: number) { return t >= B[i].a && t < B[i].b; }
  const lockTex = useDyn(540, 1100, (c) => drawLock(c, cl((t - (T.cyber - 0.5)) / 0.5)));
  const cur = B.findIndex((b) => t >= b.a && t < b.b);
  const lt = cur >= 0 ? t - B[cur].a : 0;
  const dur = cur >= 0 ? B[cur].b - B[cur].a : 1;
  if (!dm) return null;
  let scene: React.ReactNode = null;
  switch (cur) {
    case 0: scene = <HookScene t={lt} tex={shopTex} />; break;
    case 1: scene = <PovScene t={lt} tex={shopTex} pressAt={dur - 0.25} />; break;
    case 2: scene = <MapScene t={lt} dm={dm} reveal={ease((t - B[2].a - 0.3) / (T.drueck + 1.4 - B[2].a))} />; break;
    case 3: scene = <TowerScene t={lt} dur={dur} space={T.iss - 0.5 - B[3].a} />; break;
    case 4: scene = <HubScene t={lt} />; break;
    case 5: scene = <PackstationScene t={lt} />; break;
    case 6: scene = <HighwayScene t={lt} />; break;
    case 7: scene = <WindowsScene t={lt} />; break;
    case 8: scene = <HallScene t={lt} cups={t >= T.kaffee - 0.15} />; break;
    case 9: scene = <DoorScene t={lt} ring={Math.max(0, 1 - Math.abs(t - T.klingelt - 0.2) / 0.5)} push={cl((t - T.deinPaket + 0.3) / 1.3)} />; break;
    case 10: scene = <OpenScene t={lt} />; break;
    case 11: scene = <MapScene t={lt} dm={dm} reveal={1} tint={{ color: "#FF6A3D", share: 0.167 * ease((lt - 0.4) / 2.4) }} pulse={Math.sin(lt * 6) * 0.5 + 0.5} />; break;
    case 12: scene = <ModeScene t={lt} />; break;
    case 13: scene = <HighwayScene t={lt + 3} reverse />; break;
    case 14: scene = <PovScene t={lt} tex={lockTex} />; break;
    default: scene = <PovScene t={lt} tex={shopTex} pressAt={T.knopf - B[15].a + 0.1} />;
  }
  const sfx = (name: string, at: number, vol = 0.5) => <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={120}><Audio src={staticFile(`wwd/blackfriday/sfx/${name}.mp3`)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        {scene}
      </ThreeCanvas>
      <Grade />
      <Overlay t={t} />
      <Audio src={staticFile("wwd/blackfriday/voice.mp3")} />
      <Audio src={staticFile("wwd/blackfriday/music.mp3")} volume={(fr) => 0.16 * Math.min(1, fr / 20) * Math.min(1, (BF_END * 30 - fr) / 30)} />
      {B.slice(1).map((b, i) => <React.Fragment key={i}>{sfx("whoosh", b.a - 0.15, 0.22)}</React.Fragment>)}
      {sfx("tap", B[2].a - 0.3, 0.6)}
      {sfx("hit", B[2].a, 0.55)}
      {sfx("tick", T.drueck, 0.35)}
      {sfx("tick", T.iss, 0.35)}
      {sfx("tick", T.nacht, 0.35)}
      {sfx("vans", B[6].a, 0.35)}
      {sfx("ping", T.ruhe - 0.1, 0.5)}
      {sfx("coffee", T.kaffee + 0.2, 0.6)}
      {sfx("bell", T.klingelt, 0.55)}
      {sfx("box", B[10].a, 0.6)}
      {sfx("tick", T.mio14, 0.35)}
      {sfx("vans", B[13].a, 0.3)}
      {sfx("ping", T.cyber - 0.5, 0.55)}
      {sfx("hit", T.cyber, 0.4)}
      {sfx("tap", T.knopf + 0.05, 0.6)}
    </AbsoluteFill>
  );
};
