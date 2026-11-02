// "Was wäre, wenn ganz Deutschland in einen einzigen Zug steigt?" — episode 3.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import {
  BigNumber, Bg, Box, Cam, Captions, Counter, FollowPill, Grade, GermanyMap, HookTitle, InfoCard, Person, TopPill, V3, Word,
  beatsFrom, buildDots, canvasTex, cl, ease, findPhrase, fmt, inOut, lerp, lerp3, rnd, rr, useDyn, useGeo, CITIES, proj, SANS, SERIF,
} from "./kit";
import wordsJson from "../../public/wwd/zug/words.json";

const words = wordsJson as Word[];
const A = "#F0503C";
const W = 1080, H = 1920;
export const ZG_END = words[words.length - 1].e + 1.9;
const B = beatsFrom(words, ["Was wäre", "Alle 83,5", "Ein ICE4", "Der Zug ist", "Alle Gleise", "Du hast Wagen", "Durchsage: Heute", "Und auf deinem", "Fahrkartenkontrolle:", "Dann: Türen", "Wir legen", "Die Lok will", "630 Kilometer", "Durchsage: Wegen", "2025 waren", "In welchem"], ZG_END);
const ws = (ph: string, from = 0) => words[findPhrase(words, ph, from)].s;
const T = {
  n918: ws("918"), z90: ws("90.959"), laenger: ws("Der Zug ist länger."), merk: ws("Merk dir"), ende: ws("am anderen Ende."), fuss: ws("Zu Fuß:"),
  acht: ws("Die Schaffnerin"), tueren: ws("Türen zu."), direkt: ws("Direkt vor"), unser: ws("Unser eigener"), wir: ws("Der vorausfahrende Zug"),
  heute: ws("Heute fährt"), nicht: ws("Und der fährt"),
};

// ---------- ICE ----------
export const L = 26.4, P = 27; // car length, car pitch (m)
const winTex = canvasTex(1024, 64, (c) => {
  c.fillStyle = "#F4F4F2"; c.fillRect(0, 0, 1024, 64);
  for (let i = 0; i < 11; i++) { c.fillStyle = "#26323E"; rr(c, 34 + i * 88, 8, 70, 48, 9); c.fill(); }
});
const winTexNight = canvasTex(1024, 64, (c) => {
  c.fillStyle = "#000"; c.fillRect(0, 0, 1024, 64);
  for (let i = 0; i < 11; i++) { c.fillStyle = "#FFD9A0"; rr(c, 34 + i * 88, 8, 70, 48, 9); c.fill(); }
});
// nose: dir = +1 nose points +z, -1 nose points -z
const Nose: React.FC<{ ze: number; dir: number; tail?: boolean; lit?: boolean }> = ({ ze, dir, tail, lit = true }) => (
  <group position={[0, 0, ze]}>
    <mesh position={[0, 2.35, 0]} scale={[1.48, 1.68, 4.2]} castShadow><sphereGeometry args={[1, 32, 20, 0, Math.PI * 2, 0, Math.PI]} /><meshStandardMaterial color="#F2F2F0" roughness={0.35} /></mesh>
    <mesh position={[0, 3.05, dir * 1.5]} scale={[1.18, 0.62, 2.55]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#141A22" roughness={0.15} metalness={0.4} /></mesh>
    {[-0.75, 0.75].map((x) => (
      <mesh key={x} position={[x, 1.75, dir * 2.75]}><sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color={tail ? "#FF2A20" : "#fff"} emissive={tail ? "#FF1A10" : "#FFF4D8"} emissiveIntensity={lit ? 3 : 0.2} /></mesh>
    ))}
  </group>
);
const Car: React.FC<{ z: number; nose?: number; tail?: boolean; night?: boolean; doorOpen?: number; simple?: boolean }> = ({ z, nose = 0, tail, night, doorOpen = -1, simple }) => (
  <group>
    <Box p={[0, 2.35, z]} s={[2.95, 3.3, L]} color="#F2F2F0" rough={0.4} cast={!simple} />
    <mesh position={[0, 2.75, z]}><boxGeometry args={[2.97, 0.8, L - 0.4]} /><meshStandardMaterial map={winTex} emissiveMap={winTexNight} emissive="#ffffff" emissiveIntensity={night ? 1.6 : 0} roughness={0.3} /></mesh>
    <Box p={[0, 1.45, z]} s={[2.97, 0.2, L - 0.2]} color="#EC0016" rough={0.5} cast={false} />
    {!simple && <>
      <Box p={[0, 4.08, z]} s={[2.5, 0.22, L - 1.2]} color="#B8BCC2" rough={0.6} cast={false} />
      {[-1, 1].map((k) => <Box key={k} p={[0, 0.5, z + k * (L / 2 - 4)]} s={[2.3, 0.6, 3]} color="#222428" cast={false} />)}
      {doorOpen >= 0 && [-1, 1].map((k) => <Box key={"d" + k} p={[1.49, 1.95, z + L / 2 - 2.2 + k * 0.42 * (1 + doorOpen * 0.95)]} s={[0.02, 2.0, 0.82]} color="#D2D4D6" rough={0.4} cast={false} />)}
      {doorOpen >= 0 && <Box p={[1.485, 1.95, z + L / 2 - 2.2]} s={[0.01, 2.04, 1.7]} color="#2A2F36" cast={false} />}
    </>}
    {nose !== 0 && <Nose ze={z + nose * L / 2} dir={nose} tail={tail} lit={night || !tail} />}
  </group>
);
// train along -z starting at z0 (front nose points +z), n cars drawn
const Train: React.FC<{ z0?: number; n: number; night?: boolean; tailAt?: number; skip?: number }> = ({ z0 = 0, n, night, tailAt, skip = 0 }) => (
  <>
    {Array.from({ length: n }, (_, k) => {
      const i = k + skip;
      const z = z0 - i * P - L / 2;
      const isFront = i % 13 === 0, isBack = i % 13 === 12 || i === tailAt;
      return <Car key={i} z={z} nose={isFront && i !== skip - 1 ? 1 : isBack ? -1 : 0} tail={isBack} night={night} simple={k > 14} />;
    })}
  </>
);
const Track: React.FC<{ z: number; len: number; x?: number }> = ({ z, len, x = 0 }) => (
  <>
    <Box p={[x, 0.12, z]} s={[4.4, 0.24, len]} color="#6A655E" rough={1} cast={false} />
    {[-0.72, 0.72].map((r) => <Box key={r} p={[x + r, 0.32, z]} s={[0.08, 0.16, len]} color="#9A9CA0" rough={0.3} metal={0.7} cast={false} />)}
  </>
);
const Platform: React.FC<{ z: number; len: number; night?: boolean }> = ({ z, len, night }) => (
  <>
    <Box p={[6.1, 0.38, z]} s={[8.2, 0.76, len]} color="#8E8C88" rough={0.9} cast={false} />
    <Box p={[2.25, 0.765, z]} s={[0.12, 0.01, len]} color="#F2F2F0" cast={false} />
    <Box p={[2.7, 0.765, z]} s={[0.35, 0.01, len]} color="#D8C060" cast={false} />
    <Box p={[6.2, 5.6, z]} s={[8.4, 0.3, len]} color="#2C3036" cast={false} />
    {Array.from({ length: Math.floor(len / 14) }, (_, i) => {
      const zz = z + len / 2 - 7 - i * 14;
      return (
        <group key={i}>
          <Box p={[6.4, 3.2, zz]} s={[0.3, 4.8, 0.3]} color="#3A3F46" cast={false} />
          <Box p={[4.6, 5.38, zz]} s={[0.5, 0.06, 2.4]} color="#fff" emissive="#FFF4E0" ei={night ? 2 : 1} cast={false} />
          <pointLight position={[4.6, 5.0, zz]} intensity={night ? 14 : 6} distance={12} color="#FFF0D8" />
        </group>
      );
    })}
    <Box p={[10.3, 3, z]} s={[0.2, 6, len]} color="#4A4E54" cast={false} />
  </>
);
const SHIRTS = ["#7A2E2E", "#2F4A3A", "#3D4E6E", "#8C6A3E", "#5A3E5E", "#2E5A5E", "#9A8A70", "#4A4A50", "#B8862E"];
const HAIRS = ["#2B2018", "#8A6A3A", "#1A1A1A", "#B8B0A4", "#6A3A20", "#D8C090"];
export const Crowd: React.FC<{ n: number; z0: number; len: number; t: number }> = ({ n, z0, len, t }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <Person key={i} p={[3.3 + rnd(i * 3) * 5.5, 0.76, z0 - rnd(i * 7) * len]} ry={-Math.PI / 2 + (rnd(i * 11) - 0.5) * 1.4}
        shirt={SHIRTS[i % SHIRTS.length]} hair={HAIRS[(i * 5) % HAIRS.length]} pose={{ head: Math.sin(t + i) * 0.05, armR: rnd(i) * 0.3 }} />
    ))}
  </>
);
const Station: React.FC<{ night?: boolean; fog?: [number, number] }> = ({ night, fog = [10, 150] }) => (
  <>
    <Bg color={night ? "#05070C" : "#1A1D24"} fog={fog} />
    <ambientLight intensity={night ? 0.15 : 0.35} color="#E8EEF8" />
    <hemisphereLight args={["#DDE6F5", "#2A2620", night ? 0.25 : 0.55]} />
    <directionalLight position={[-20, 30, 15]} intensity={night ? 0.2 : 1.3} color="#FFF2DE" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} />
    <Box p={[0, -0.05, -150]} s={[60, 0.1, 400]} color="#3A3934" rough={1} cast={false} />
  </>
);

// ---------- interior ----------
const Interior: React.FC<{ len?: number; seated?: (row: number, side: number) => boolean; t: number }> = ({ len = 40, seated, t }) => (
  <>
    <Bg color="#0C0E12" fog={[3, 34]} />
    <ambientLight intensity={0.5} color="#F2F4F8" />
    <hemisphereLight args={["#F4F6FA", "#3A3A40", 0.5]} />
    <Box p={[0, 0, -len / 2 + 2]} s={[2.8, 0.1, len]} color="#5A5E66" rough={0.9} cast={false} />
    <Box p={[0, 0.06, -len / 2 + 2]} s={[0.7, 0.02, len]} color="#7A2228" rough={1} cast={false} />
    <Box p={[0, 2.45, -len / 2 + 2]} s={[2.8, 0.1, len]} color="#E8E8E4" cast={false} />
    {[-1, 1].map((s) => <Box key={s} p={[s * 1.42, 1.2, -len / 2 + 2]} s={[0.06, 2.5, len]} color="#DCDCD6" cast={false} />)}
    {[-1, 1].map((s) => <Box key={"l" + s} p={[s * 0.55, 2.39, -len / 2 + 2]} s={[0.12, 0.02, len]} color="#fff" emissive="#FFFFFF" ei={1.2} cast={false} />)}
    {[-1, 1].map((s) => <Box key={"r" + s} p={[s * 1.15, 1.95, -len / 2 + 2]} s={[0.5, 0.04, len]} color="#9AA0A8" metal={0.5} rough={0.4} cast={false} />)}
    {Array.from({ length: Math.floor(len / 1.05) }, (_, row) => {
      const z = -row * 1.05;
      return (
        <group key={row}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <Box p={[side * 1.395, 1.35, z - 0.5]} s={[0.02, 0.6, 0.7]} color="#20262E" rough={0.2} cast={false} />
              {[0.55, 1.05].map((x, j) => (
                <group key={j}>
                  <Box p={[side * x, 0.45, z]} s={[0.46, 0.14, 0.5]} color="#2E3A55" rough={0.95} />
                  <Box p={[side * x, 0.95, z + 0.25]} s={[0.46, 0.85, 0.1]} color="#2E3A55" rough={0.95} />
                  <Box p={[side * x, 1.32, z + 0.24]} s={[0.4, 0.14, 0.11]} color="#C8C4BA" rough={0.95} cast={false} />
                  {seated && seated(row, side * (j + 1)) && (
                    <Person p={[side * x, -0.38, z - 0.05]} ry={Math.PI} shirt={SHIRTS[(row * 4 + j + side) & 7]} hair={HAIRS[(row * 3 + j) % 6]} pants="#2E3038"
                      pose={{ armL: 0.5, armR: 0.5, foreL: 1.0, foreR: 1.0, head: 0.1 + Math.sin(t * 0.7 + row) * 0.04 }} />
                  )}
                </group>
              ))}
            </group>
          ))}
        </group>
      );
    })}
  </>
);
const ResDisplay: React.FC<{ p: V3; t: number; text: string; sub: string }> = ({ p, t, text, sub }) => {
  const tex = useDyn(512, 160, (c) => {
    c.fillStyle = "#0B0F14"; c.fillRect(0, 0, 512, 160);
    c.fillStyle = "#FF5A3C"; c.font = `700 64px ${SANS}`; c.fillText(text, 26, 80);
    c.fillStyle = "#FFB89A"; c.font = `500 34px ${SANS}`; c.fillText(sub, 26, 132);
    if (Math.floor(t * 2) % 2 === 0) { c.fillStyle = "#FF5A3C"; c.beginPath(); c.arc(470, 50, 12, 0, Math.PI * 2); c.fill(); }
  });
  return <mesh position={p} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.56, 0.175]} /><meshStandardMaterial map={tex} emissiveMap={tex} emissive="#fff" emissiveIntensity={1.4} /></mesh>;
};

// ---------- departure board ----------
export const Board: React.FC<{ p: V3; t: number; rows: [string, string, string, string][]; ticker: string; red?: boolean; w?: number }> = ({ p, t, rows, ticker, w = 9 }) => {
  const tex = useDyn(1600, 900, (c) => {
    c.fillStyle = "#0A1A4A"; c.fillRect(0, 0, 1600, 900);
    c.fillStyle = "#fff"; c.font = `700 54px ${SANS}`; c.fillText("Abfahrt", 50, 90);
    c.font = `500 40px ${SANS}`; c.fillStyle = "rgba(255,255,255,.7)"; c.fillText("Zeit      Zug        Ziel", 50, 170);
    rows.forEach((r, i) => {
      const y = 280 + i * 150;
      c.fillStyle = "#fff"; c.font = `700 64px ${SANS}`; c.fillText(r[0], 50, y); c.fillText(r[1], 300, y);
      c.font = `600 64px ${SANS}`; c.fillText(r[2], 560, y);
      c.fillStyle = "#FFD23C"; c.font = `700 56px ${SANS}`; c.fillText(r[3], 560, y + 70);
      c.fillStyle = "rgba(255,255,255,.15)"; c.fillRect(50, y + 100, 1500, 2);
    });
    c.fillStyle = "#fff"; c.fillRect(0, 760, 1600, 140);
    c.fillStyle = "#0A1A4A"; c.font = `700 62px ${SANS}`;
    const tw = c.measureText(ticker).width + 200;
    const off = (t * 260) % tw;
    c.fillText(ticker, 1600 - off, 852); c.fillText(ticker, 1600 - off + tw, 852);
  });
  return (
    <group position={p}>
      <Box p={[0, 0, -0.08]} s={[w + 0.3, w * 0.5625 + 0.3, 0.12]} color="#2A2E34" />
      <mesh><planeGeometry args={[w, w * 0.5625]} /><meshStandardMaterial map={tex} emissiveMap={tex} emissive="#fff" emissiveIntensity={1.0} roughness={0.4} /></mesh>
    </group>
  );
};

// ---------- map helpers ----------
const EDGES = (() => {
  const pts = CITIES.map((c) => proj(c[0], c[1]));
  const e: [V3, V3][] = []; const seen = new Set<string>();
  pts.forEach((a, i) => {
    const near = pts.map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[2] - b[2]) })).filter((x) => x.j !== i).sort((x, y) => x.d - y.d).slice(0, 3);
    near.forEach(({ j }) => { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (!seen.has(k)) { seen.add(k); e.push([a, pts[j]]); } });
  });
  return e;
})();
export const Network: React.FC<{ k: number; op?: number; color?: string }> = ({ k, op = 1, color = "#FFFFFF" }) => {
  const g = React.useMemo(() => new THREE.BufferGeometry(), []);
  const arr: number[] = [];
  EDGES.forEach(([a, b], i) => {
    const kk = cl(k * 1.6 - (i / EDGES.length) * 0.6);
    if (kk <= 0) return;
    arr.push(a[0], 0.05, a[2], lerp(a[0], b[0], kk), 0.05, lerp(a[2], b[2], kk));
  });
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(arr.length ? arr : [0, 0, 0, 0, 0, 0]), 3));
  return <lineSegments geometry={g}><lineBasicMaterial color={color} transparent opacity={op} /></lineSegments>;
};
export const RING_R = 4.6;
export const Ring: React.FC<{ k: number; color?: string; r?: number; y?: number; thick?: number; start?: number }> = ({ k, color = "#fff", r = RING_R, y = 0.06, thick = 0.05, start = Math.PI / 2 }) => {
  if (k <= 0.002) return null;
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, start]}>
      <torusGeometry args={[r, thick, 8, 220, Math.PI * 2 * Math.min(k, 1)]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
    </mesh>
  );
};

// ---------- scenes ----------
export const HookScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Station />
    <Cam pos={[7.5 - t * 0.25, 2.2, 14 - t * 1.4]} look={[0.5, 2.2, -40]} fov={42} />
    <Track z={-100} len={300} />
    <Platform z={-60} len={180} />
    <Train z0={8} n={20} />
    <Crowd n={90} z0={6} len={90} t={t} />
  </>
);
export const MapScene: React.FC<{ t: number; dm: ReturnType<typeof buildDots>; reveal: number; net?: number; ring?: number; netOp?: number; train?: number; over?: number; cam?: "top" | "tilt" | "high" }> = ({ t, dm, reveal, net = 0, ring = 0, netOp = 1, train = 0, over = 0, cam = "tilt" }) => (
  <>
    <Bg color="#05060B" />
    <ambientLight intensity={0.6} />
    <Cam pos={cam === "high" ? [0, 23 - t * 0.2, 0.8] : cam === "top" ? [0, 14.5 - t * 0.15, 0.6] : [0, 9.5 - t * 0.2, 7.5 - t * 0.2]} look={[0, 0, 0]} fov={42} />
    <GermanyMap dm={dm!} reveal={reveal} lineOp={0.4} />
    {net > 0 && <Network k={net} op={netOp} />}
    <Ring k={ring} color="#FFFFFF" thick={0.035} />
    <Ring k={train} color={A} r={RING_R} y={0.09} thick={0.07} />
    {over > 0 && <Ring k={over * 0.09} color="#FF2A20" r={RING_R + 0.32} y={0.1} thick={0.14} start={Math.PI / 2} />}
  </>
);
export const SideScene: React.FC<{ t: number; pull: number; night?: boolean }> = ({ t, pull, night }) => {
  const k = ease(pull);
  return (
    <>
      <Station night={night} fog={[20, lerp(120, 420, k)]} />
      <Cam pos={lerp3([16, 3.2, -6], [60, 34, 40], k)} look={lerp3([0, 2.4, -14 - t * 0.6], [0, 0, -150], k)} fov={40} far={2000} />
      <Track z={-300} len={800} />
      <Train z0={14} n={40} night={night} />
    </>
  );
};
// endless train curving to the horizon (aerial)
export const curveX = (z: number) => Math.sin(z / 600) * 120 + Math.sin(z / 170) * 18;
export const LongScene: React.FC<{ t: number; night?: boolean; up?: number }> = ({ t, night, up = 0 }) => {
  const n = 160;
  return (
    <>
      <Bg color={night ? "#04060C" : "#9FB3C8"} fog={[60, night ? 1700 : 2600]} />
      <hemisphereLight args={[night ? "#2A3550" : "#EAF2FF", night ? "#05060A" : "#4A5A38", night ? 0.25 : 1.0]} />
      <directionalLight position={[300, 400, 200]} intensity={night ? 0.15 : 1.6} color="#FFF2DA" />
      <Box p={[0, -0.2, -2000]} s={[6000, 0.2, 6000]} color={night ? "#0A0E0A" : "#4E6040"} rough={1} cast={false} />
      {Array.from({ length: 260 }, (_, i) => {
        const z = -rnd(i * 3) * 4000; const x = curveX(z) + (rnd(i * 5) > 0.5 ? 1 : -1) * (12 + rnd(i * 9) * 300);
        return <mesh key={i} position={[x, 6, z]}><coneGeometry args={[4, 14, 7]} /><meshStandardMaterial color={night ? "#0E140E" : "#2E4628"} roughness={1} /></mesh>;
      })}
      {Array.from({ length: n }, (_, i) => {
        const z = -i * P * 0.98; const x = curveX(z); const ang = Math.atan((curveX(z - 1) - x) / -1);
        return (
          <group key={i} position={[x, 0, 0]} rotation={[0, -ang, 0]}>
            <Car z={z} simple night={night} nose={i === 0 ? 1 : 0} />
          </group>
        );
      })}
      <Cam pos={[curveX(60) + 40, 26 + up * t * 6 + t * 1.5, 70 + t * 4]} look={[curveX(-300), 0, -300 - t * 20]} fov={44} far={4000} />
    </>
  );
};
export const SeatScene: React.FC<{ t: number; occupied?: number }> = ({ t, occupied = 0 }) => (
  <>
    <Interior t={t} seated={(row, s) => (row === 3 && s === 1 ? occupied > 0 : rnd(row * 7 + s * 3) > 0.45 && row > 3)} />
    <ResDisplay p={[0.92, 1.88, -3.2]} t={t} text="12 | 42" sub="reserviert" />
    <pointLight position={[0.3, 2.1, -2.5]} intensity={2} distance={4} />
    {occupied > 0 ? (
      <>
        <Cam pos={[-0.55, 1.65, -0.6]} look={[0.6, 1.0, -3.3]} fov={46} />
        <Person p={[-0.1, 0.05, -2.5]} ry={-0.9} shirt="#4F6D7A" pose={{ armL: 0.2, armR: 0.25, head: -0.1 }} />
      </>
    ) : (
      <Cam pos={[-0.4, 1.7, 0.2 - t * 0.25]} look={[0.7, 1.4, -3.6]} fov={44} />
    )}
  </>
);
export const WalkScene: React.FC<{ t: number }> = ({ t }) => {
  const z = -t * 2.2;
  return (
    <>
      <Station fog={[10, 130]} />
      <Track z={-200} len={500} />
      <Platform z={-150} len={400} />
      <Train z0={6} n={30} />
      <Person p={[3.6, 0.76, z]} ry={Math.PI} shirt="#4F6D7A" pose={{ walk: t * 7, armL: Math.sin(t * 7) * 0.35, armR: -Math.sin(t * 7) * 0.35 }} />
      <Box p={[3.85, 1.9, z + 0.18]} s={[0.32, 0.45, 0.18]} color="#3A3A3A" />
      <Cam pos={[6.6, 2.4, z + 5.5]} look={[2.6, 1.5, z - 20]} fov={44} />
    </>
  );
};
export const ControlScene: React.FC<{ t: number }> = ({ t }) => {
  const z = -2 - t * 0.6;
  return (
    <>
      <Interior t={t} len={60} seated={(row, s) => rnd(row * 5 + s) > 0.15} />
      <group position={[0, 0, z]}>
        <Person p={[0, 0.05, 0]} ry={Math.PI} shirt="#1F2B4A" pants="#1F2B4A" hair="#6A3A20" pose={{ walk: t * 4, armR: 0.9 + Math.sin(t * 6) * 0.1, foreR: 0.9, armL: 0.2 }}>
          <Box p={[0, 0, 0.05]} s={[0.12, 0.16, 0.03]} color="#222" />
        </Person>
        <Box p={[0, 1.42, 0]} s={[0.3, 0.06, 0.04]} color="#EC0016" />
        <mesh position={[0, 1.83, 0]}><cylinderGeometry args={[0.13, 0.13, 0.08, 16]} /><meshStandardMaterial color="#1F2B4A" /></mesh>
      </group>
      <Cam pos={[0.15, 1.75, z - 3.2]} look={[0, 1.3, z + 2]} fov={44} />
    </>
  );
};
export const DoorScene: React.FC<{ t: number; close: number }> = ({ t, close }) => {
  const d = 1 - ease((t - close) / 0.8);
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <Station />
      <Cam pos={[5.5, 1.9, -L / 2 + 4.5 - t * 0.1]} look={[1.5, 1.9, -L / 2 - 2.2]} fov={40} />
      <Track z={-60} len={160} />
      <Platform z={-40} len={100} />
      <Car z={-L / 2} nose={1} doorOpen={d} />
      <Car z={-L / 2 - P} />
      <mesh position={[1.5, 3.1, -2.2 - 0]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color="#FF3020" emissive="#FF2010" emissiveIntensity={blink && d > 0.05 ? 4 : 0.3} /></mesh>
    </>
  );
};
// Lok sees its own last car right in front of it
export const NoseScene: React.FC<{ t: number; reveal: number }> = ({ t, reveal }) => {
  const k = inOut((t - reveal + 0.3) / 1.6);
  return (
    <>
      <Station fog={[10, 220]} />
      <Track z={-100} len={400} />
      {/* our Lok heading -z */}
      <Car z={L / 2 + 2} nose={-1} /><Car z={L / 2 + 2 + P} /><Car z={L / 2 + 2 + 2 * P} />
      {/* the tail of our own train, directly ahead */}
      <Car z={-8.4 - L / 2} nose={1} tail />
      <Car z={-8.4 - L / 2 - P} />
      <Car z={-8.4 - L / 2 - 2 * P} />
      <pointLight position={[0, 2, -5]} intensity={k * 6} distance={8} color="#FF2A20" />
      <Cam pos={lerp3([3.4, 3.4, 8], [9, 5, -1], k)} look={lerp3([0.3, 2.6, -10], [0, 2.2, -3.4], k)} fov={lerp(40, 42, k)} />
    </>
  );
};
export const BoardScene: React.FC<{ t: number; mode: 0 | 1; late?: number; rows?: [string, string, string, string][]; ticker?: string }> = ({ t, mode, rows: rowsO, ticker: tickerO }) => (
  <>
    <Station fog={[8, 120]} />
    <ambientLight intensity={0.3} />
    <Track z={-60} len={200} />
    <Platform z={-40} len={120} />
    <Train z0={-10} n={8} />
    <Board p={[5.2, 3.7, 2]} t={t} w={6.6}
      rows={rowsO ?? (mode === 0
        ? [["0:00", "ICE 1", "Ganz Deutschland", "+ 2 Min."], ["0:00", "ICE 1", "Ganz Deutschland", "Abfahrt verzögert"]]
        : [["0:00", "ICE 1", "Ganz Deutschland", "+ ∞ Min."], ["", "", "Heute nur dieser Zug", "Fällt aus"]])}
      ticker={tickerO ?? (mode === 0 ? "+++ Verzögerung durch einen vorausfahrenden Zug +++ Wir bitten um Entschuldigung +++" : "+++ Grund: Verzögerung durch vorausfahrenden Zug (uns) +++")} />
    <Cam pos={[5.2 + Math.sin(t * 0.4) * 0.3, 3.3, 17 - t * 0.3]} look={[5.2, 3.6, 2]} fov={44} />
  </>
);
export const SignalScene: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Station fog={[8, 160]} />
    <Track z={-60} len={200} />
    <Car z={L / 2 + 6} nose={-1} /><Car z={L / 2 + 6 + P} />
    <Box p={[-2.6, 2.6, -2]} s={[0.18, 5.2, 0.18]} color="#3A3F46" />
    <Box p={[-2.6, 5.1, -1.9]} s={[0.7, 1.4, 0.2]} color="#141618" />
    <mesh position={[-2.6, 5.4, -1.78]}><sphereGeometry args={[0.18, 16, 12]} /><meshStandardMaterial color="#FF2A20" emissive="#FF1A10" emissiveIntensity={4} /></mesh>
    <mesh position={[-2.6, 4.9, -1.78]}><sphereGeometry args={[0.18, 16, 12]} /><meshStandardMaterial color="#1A3A1A" /></mesh>
    <pointLight position={[-2.6, 5.4, -1.2]} intensity={5} distance={6} color="#FF3020" />
    <Cam pos={[-4.6 - t * 0.05, 3.4, 9 - t * 0.4]} look={[-2.4, 4.5, -2]} fov={40} />
  </>
);

export const Bars: React.FC<{ t: number; a: number; op: number }> = ({ t, a, op }) => {
  const k1 = ease((t - a) / 0.6), k2 = ease((t - a - 0.4) / 0.9);
  const Row = ({ label, val, w, c }: { label: string; val: string; w: number; c: string }) => (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: "rgba(255,255,255,.85)" }}><span>{label}</span><span style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: 0, fontSize: 30 }}>{val}</span></div>
      <div style={{ height: 22, marginTop: 8, borderRadius: 11, background: "rgba(255,255,255,.12)", overflow: "visible", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${w}%`, background: c, borderRadius: 11 }} />
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: 380, left: 60, right: 60, opacity: op, background: "rgba(16,17,22,.62)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, padding: "18px 30px 28px" }}>
      <Row label="ALLE GLEISE" val="33.389 km" w={92 * k1} c="#E8ECF2" />
      <Row label="DER ZUG" val="34.019 km" w={93.7 * k2} c={A} />
      <div style={{ fontFamily: SANS, fontSize: 16, color: "rgba(255,255,255,.55)", marginTop: 14 }}>Quelle: DB InfraGO 2025 · ICE 4 (DB) · eigene Rechnung</div>
    </div>
  );
};

const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const fi = (a: number, d = 0.3) => cl((t - a) / d);
  const ab = (i: number) => t >= B[i].a && t < B[i].b;
  const fo = (i: number) => cl((B[i].b - t) / 0.2);
  const op = (i: number) => (ab(i) ? Math.min(fi(B[i].a + 0.15), fo(i)) : 0);
  const up = (a: number, b: number, d: number) => ease((t - a) / d) * b;
  return (
    <>
      <TopPill />
      {ab(0) && <HookTitle lines={["Was wäre, wenn", "ganz Deutschland", "in einen einzigen Zug steigt?"]} accent={A} op={fi(0.05, 0.25)} y={470} />}
      {ab(1) && <Counter label="FAHRGÄSTE" value={fmt(Math.round(up(B[1].a + 0.3, 83500000, 1.6)))} sub="ein Ticket · ein Zug" accent={A} op={op(1)} />}
      {ab(2) && (t < T.z90 - 0.1
        ? <InfoCard label="ECHTE ZAHL" text="Ein ICE 4 mit 13 Wagen: 374 Meter, 918 Sitzplätze." source="Deutsche Bahn" accent={A} op={fi(B[2].a + 0.15) * cl((T.z90 - 0.1 - t) / 0.2)} />
        : <Counter label="ICE 4 HINTEREINANDER" value={fmt(Math.round(up(T.z90 - 0.1, 90959, 1.6)))} sub="83,5 Mio. ÷ 918 Plätze" accent={A} op={fi(T.z90 - 0.1) * fo(2)} />)}
      {ab(3) && <Counter label="ZUGLÄNGE" value={fmt(Math.round(up(B[3].a + 0.2, 34019, 2))) + " km"} sub="90.959 × 374 m" accent={A} op={op(3)} />}
      {ab(4) && (t < T.laenger - 0.1
        ? <Counter label="ALLE GLEISE IN DEUTSCHLAND" value={fmt(Math.round(up(B[4].a + 1.2, 33389, 1.6))) + " km"} sub="Betriebslänge DB-Netz, Ende 2025" accent="#E8ECF2" op={op(4)} />
        : <Bars t={t} a={T.laenger - 0.1} op={fi(T.laenger - 0.1) * fo(4)} />)}
      {ab(6) && (t < T.fuss - 0.1
        ? <Counter label="DEIN WEG ZU WAGEN 12" value={fmt(Math.round(up(T.ende - 0.3, 34000, 1.2))) + " km"} sub="umgekehrte Wagenreihung" accent={A} op={fi(T.ende - 0.3) * cl((T.fuss - 0.1 - t) / 0.2)} />
        : <BigNumber value="283 Tage" sub="ZU FUSS · 5 KM/H · OHNE PAUSE" accent={A} op={fi(T.fuss - 0.1, 0.25) * fo(6)} />)}
      {ab(8) && (t < T.acht - 0.1
        ? <Counter label="KONTROLLE" value="3 Sek." sub="pro Fahrgast · 83,5 Mio. Fahrgäste" accent={A} op={op(8)} />
        : <BigNumber value="7,9 Jahre" sub="BIS SIE BEI DIR IST" accent={A} op={fi(T.acht - 0.1, 0.25) * fo(8)} />)}
      {ab(10) && <InfoCard label="ANNAHME" text="Alle Gleise werden zu einem einzigen Kreis verbunden." accent={A} op={op(10)} />}
      {ab(12) && <BigNumber value="630 km" sub="ZU VIEL ZUG" accent={A} op={op(12)} source="34.019 km − 33.389 km" />}
      {ab(14) && (t < T.heute - 0.1
        ? <BigNumber value="60,1 %" sub="FERNZÜGE PÜNKTLICH · 2025" accent={A} op={fi(B[14].a + 0.1) * cl((T.heute - 0.1 - t) / 0.2)} source="Deutsche Bahn via dpa" />
        : null)}
      <FollowPill text="Folg – dann siehst du, ob der Zug ankommt." op={Math.min(fi(B[5].a + 0.2), cl((B[7].a - 0.3 - t) / 0.3))} y={1420} />
      <Captions words={words} t={t} hideUntil={B[1].a - 0.05} />
    </>
  );
};

export const Zug: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const geo = useGeo();
  const dm = React.useMemo(() => (geo ? buildDots(geo) : null), [geo]);
  const cur = B.findIndex((b) => t >= b.a && t < b.b);
  const lt = cur >= 0 ? t - B[cur].a : 0;
  const L_ = (x: number) => x - (cur >= 0 ? B[cur].a : 0);
  let scene: React.ReactNode = null;
  if (!dm) return null;
  switch (cur) {
    case 0: scene = <HookScene t={lt} />; break;
    case 1: scene = <MapScene t={lt} dm={dm!} reveal={ease(lt / 1.8)} />; break;
    case 2: scene = <SideScene t={lt} pull={(t - T.z90 + 0.3) / 2.5} />; break;
    case 3: scene = <LongScene t={lt} />; break;
    case 4: scene = <MapScene t={lt} dm={dm!} reveal={1} net={ease(lt / 2.4)} cam="top" />; break;
    case 5: scene = <SeatScene t={lt} />; break;
    case 6: scene = t < T.ende - 0.4 ? <BoardScene t={lt} mode={0} /> : <WalkScene t={t - T.ende} />; break;
    case 7: scene = <SeatScene t={lt} occupied={1} />; break;
    case 8: scene = <ControlScene t={lt} />; break;
    case 9: scene = <DoorScene t={lt} close={L_(T.tueren)} />; break;
    case 10: scene = <MapScene t={lt} dm={dm!} reveal={1} net={1} netOp={1 - ease(lt / 1.2)} ring={ease((lt - 0.3) / 1.6)} cam="high" />; break;
    case 11: scene = <NoseScene t={lt} reveal={L_(T.direkt)} />; break;
    case 12: scene = <MapScene t={lt} dm={dm!} reveal={1} ring={1} train={ease(lt / 1.2)} over={ease((lt - 1.0) / 0.8)} cam="high" />; break;
    case 13: scene = t < T.wir - 0.2 ? <SignalScene t={lt} /> : <BoardScene t={t - T.wir} mode={0} />; break;
    case 14: scene = t < T.heute - 0.2 ? <LongScene t={lt + 3} night /> : <BoardScene t={t - T.heute} mode={1} />; break;
    default: scene = <LongScene t={lt} night up={1} />;
  }
  const sfx = (name: string, at: number, vol = 0.5) => <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={210}><Audio src={staticFile(`wwd/zug/sfx/${name}.mp3`)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        {scene}
      </ThreeCanvas>
      <Grade />
      <Overlay t={t} />
      <Audio src={staticFile("wwd/zug/voice.mp3")} />
      <Audio src={staticFile("wwd/zug/music.mp3")} volume={(fr) => 0.15 * Math.min(1, fr / 20) * Math.min(1, (ZG_END * 30 - fr) / 30)} />
      {B.slice(1).map((b, i) => <React.Fragment key={i}>{sfx("whoosh", b.a - 0.15, 0.18)}</React.Fragment>)}
      {sfx("crowd", 0, 0.22)}
      {sfx("horn", 0.6, 0.3)}
      {sfx("tick", B[1].a + 0.3, 0.3)}
      {sfx("clack", B[2].a + 0.3, 0.22)}
      {sfx("tick", T.z90, 0.3)}
      {sfx("hit", T.laenger - 0.05, 0.4)}
      {sfx("gong", B[6].a - 0.55, 0.32)}
      {sfx("steps", T.fuss - 0.4, 0.4)}
      {sfx("sigh", B[7].a + 1.2, 0.35)}
      {sfx("stamp", B[8].a + 1.0, 0.5)}
      {sfx("stamp", B[8].a + 2.0, 0.5)}
      {sfx("hit", T.acht + 0.6, 0.35)}
      {sfx("doors", T.tueren - 0.3, 0.45)}
      {sfx("brake", T.direkt - 0.2, 0.4)}
      {sfx("hit", T.unser, 0.45)}
      {sfx("gong", B[13].a - 0.5, 0.32)}
      {sfx("sigh", T.wir + 1.0, 0.4)}
      {sfx("pop", T.nicht + 0.4, 0.35)}
    </AbsoluteFill>
  );
};
