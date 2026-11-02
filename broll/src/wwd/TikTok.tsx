// "Was wäre, wenn du 1.000 Milliarden Jahre TikTok scrollst?" — episode 4 (ends in a loop on frame 1).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import {
  BigNumber, Bg, Box, Cam, Captions, Counter, FollowPill, Grade, GermanyMap, HookTitle, InfoCard, Person, TopPill, V3, Word,
  beatsFrom, buildDots, canvasTex, cl, ease, findPhrase, fmt, inOut, lerp, lerp3, rnd, rr, useDyn, useGeo, proj, SANS, SERIF,
} from "./kit";
import wordsJson from "../../public/wwd/tiktok/words.json";

const words = wordsJson as Word[];
const A = "#3FE0E6";
const PINK = "#FF3D6E";
const W = 1080, H = 1920;
export const TT_END = words[words.length - 1].e + 2.0;
const B = beatsFrom(words, ["„Nur noch", "Ohne Pause.", "Das sind", "Jeder Swipe:", "Pro Jahr", "Nach 80", "Nach fünf", "Nach 150", "Nach 1.000 Milliarden Jahren ist", "Du hast zehn", "Der Algorithmus", "Weißt du"], TT_END);
const ws = (ph: string, from = 0) => words[findPhrase(words, ph, from)].s;
const T = {
  was: ws("Was wäre"), n840: ws("840"), fyp: ws("Deine For"), glueht: ws("Die Erde glüht."), weiter: ws("Du scrollst"), himmel: ws("Am Himmel:"),
  bildschirm: ws("Und dein Bildschirm."), aldebaran: ws("Weiter als"), kein: ws("Und es kommt"), niemand: ws("Niemand"), zeigt: ws("Und zeigt"),
  erstes: ws("dein allererstes."),
};

// ---------- the feed ----------
// scroll position (in videos) over time: one swipe per 3 s, faster later
const scrollAt = (t: number) => {
  const base = t < 5.3 ? t / 3 : 5.3 / 3 + (t - 5.3) / 1.4;
  const i = Math.floor(base), f = base - i;
  return i + ease((f - 0.72) / 0.28);
};
const HANDLES = ["@lenas.kitchen", "@fitmitmo", "@katzenkanal", "@bahnfail", "@omaskocht", "@techtom", "@reisefieber", "@dancewithjo", "@lifehacks.de", "@hundeleben"];
const CAPS = ["Warte bis zum Ende 😳", "POV: Montagmorgen", "Das wusste keiner", "Teil 2?", "Rezept in 30 Sek.", "Niemand: … Ich:", "3 Tricks, die keiner kennt", "Hätte ich das früher gewusst"];
const drawVideo = (c: CanvasRenderingContext2D, i: number, y: number) => {
  const h1 = Math.floor(rnd(i * 3.3) * 360), h2 = (h1 + 40 + Math.floor(rnd(i * 5.1) * 80)) % 360;
  const g = c.createLinearGradient(0, y, 540, y + 1100); g.addColorStop(0, `hsl(${h1},55%,42%)`); g.addColorStop(1, `hsl(${h2},60%,22%)`);
  c.fillStyle = g; c.fillRect(0, y, 540, 1100);
  // subject: a simple figure / object
  c.fillStyle = `hsla(${(h1 + 180) % 360},70%,75%,.9)`;
  const k = Math.floor(rnd(i * 7.7) * 3);
  if (k === 0) { c.beginPath(); c.arc(270, y + 430, 120, 0, Math.PI * 2); c.fill(); }
  else if (k === 1) { rr(c, 150, y + 300, 240, 260, 40); c.fill(); }
  else { c.beginPath(); c.arc(270, y + 360, 70, 0, Math.PI * 2); c.fill(); rr(c, 180, y + 440, 180, 260, 70); c.fill(); }
  // right rail
  c.fillStyle = "rgba(255,255,255,.95)";
  [620, 740, 860].forEach((yy, j) => { c.beginPath(); c.arc(480, y + yy, 30, 0, Math.PI * 2); c.fill(); c.font = `600 22px ${SANS}`; c.textAlign = "center"; c.fillText(j === 0 ? `${(rnd(i) * 900 + 20).toFixed(0)}K` : `${(rnd(i + j) * 9 + 1).toFixed(1)}K`, 480, y + yy + 58); });
  c.fillStyle = PINK; c.beginPath(); c.arc(480, y + 620, 18, 0, Math.PI * 2); c.fill();
  c.textAlign = "left"; c.fillStyle = "#fff"; c.font = `700 30px ${SANS}`; c.fillText(HANDLES[i % HANDLES.length], 30, y + 930);
  c.font = `500 26px ${SANS}`; c.fillText(CAPS[(i * 3) % CAPS.length], 30, y + 972);
};
const drawTop = (c: CanvasRenderingContext2D) => {
  c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(0, 0, 540, 120);
  c.textAlign = "center"; c.font = `600 28px ${SANS}`; c.fillStyle = "rgba(255,255,255,.6)"; c.fillText("Folge ich", 200, 80);
  c.fillStyle = "#fff"; c.font = `700 28px ${SANS}`; c.fillText("Für dich", 350, 80); c.fillRect(325, 94, 50, 4);
};
type ScreenMode = "feed" | "empty" | "search" | "first";
const drawScreen = (c: CanvasRenderingContext2D, t: number, mode: ScreenMode, k = 0) => {
  c.fillStyle = "#000"; c.fillRect(0, 0, 540, 1100);
  if (mode === "feed" || mode === "search") {
    const s = mode === "search" ? scrollAt(T.niemand) + (t - T.niemand) * (2 + k * 18) : scrollAt(t);
    const i = Math.floor(s), f = s - i;
    drawVideo(c, i, -f * 1100); drawVideo(c, i + 1, (1 - f) * 1100);
    drawTop(c);
    if (mode === "search") { c.fillStyle = `rgba(0,0,0,${0.35 + k * 0.4})`; c.fillRect(0, 0, 540, 1100); }
  } else if (mode === "empty") {
    c.fillStyle = "#0A0A0C"; c.fillRect(0, 0, 540, 1100); drawTop(c);
    c.strokeStyle = "rgba(255,255,255,.25)"; c.lineWidth = 8; c.beginPath(); c.arc(270, 470, 60, 0, Math.PI * 2); c.stroke();
    c.strokeStyle = "#fff"; c.beginPath(); c.arc(270, 470, 60, t * 5, t * 5 + 1.2); c.stroke();
    c.fillStyle = "#fff"; c.textAlign = "center"; c.font = `700 34px ${SANS}`; c.fillText("Keine neuen Videos", 270, 620);
    c.fillStyle = "rgba(255,255,255,.6)"; c.font = `500 26px ${SANS}`; c.fillText("Versuch es später noch einmal", 270, 664);
  } else {
    const g = c.createLinearGradient(0, 0, 0, 1100); g.addColorStop(0, "#6A8BB0"); g.addColorStop(1, "#2A3A50");
    c.fillStyle = g; c.fillRect(0, 0, 540, 1100);
    // a shaky, badly lit first video: a hand-drawn dance in a bedroom
    c.fillStyle = "#C8A878"; c.fillRect(0, 760, 540, 340);
    c.fillStyle = "#F2E8D8"; rr(c, 330, 200, 150, 200, 8); c.fill();
    c.fillStyle = "#E8C8A0"; c.beginPath(); c.arc(240 + Math.sin(t * 6) * 20, 420, 55, 0, Math.PI * 2); c.fill();
    c.fillStyle = PINK; rr(c, 180 + Math.sin(t * 6) * 20, 480, 120, 220, 40); c.fill();
    c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(0, 0, 540, 1100);
    drawTop(c);
    c.fillStyle = "#fff"; c.textAlign = "left"; c.font = `700 30px ${SANS}`; c.fillText("@du", 30, 930);
    c.font = `500 26px ${SANS}`; c.fillText("mein erstes video lol", 30, 972);
    c.fillStyle = "rgba(255,255,255,.95)"; c.font = `600 22px ${SANS}`; c.textAlign = "center"; c.fillText("3 Likes", 480, 678);
    c.beginPath(); c.arc(480, 620, 30, 0, Math.PI * 2); c.fill();
    const a = cl(k * 3);
    c.fillStyle = `rgba(0,0,0,${0.55 * a})`; rr(c, 90, 150, 360, 70, 35); c.fill();
    c.fillStyle = `rgba(255,255,255,${a})`; c.font = `700 28px ${SANS}`; c.fillText("Dein erstes Video", 270, 196);
  }
};

const Phone: React.FC<{ tex: THREE.Texture; p: V3; rot?: V3; scale?: number; light?: number }> = ({ tex, p, rot = [0, 0, 0], scale = 1, light = 1 }) => (
  <group position={p} rotation={rot} scale={scale}>
    <Box p={[0, 0, -0.006]} s={[0.078, 0.16, 0.009]} color="#16161A" rough={0.3} metal={0.4} />
    <mesh position={[0, 0, -0.001]}><planeGeometry args={[0.072, 0.152]} /><meshBasicMaterial map={tex} toneMapped={false} color={new THREE.Color(light, light, light)} /></mesh>
    <pointLight position={[0, 0, 0.12]} intensity={0.6 * light} distance={0.8} color="#CFE8FF" />
  </group>
);
const Room: React.FC<{ old?: number }> = ({ old = 0 }) => (
  <>
    <Bg color="#06080D" fog={[3, 9]} />
    <ambientLight intensity={0.1} color="#9DB0E0" />
    <Box p={[0, -0.05, -1]} s={[12, 0.1, 10]} color={old ? "#2E2620" : "#3A2C22"} rough={0.9} />
    <Box p={[0, 1.5, -3.2]} s={[12, 3.2, 0.1]} color={old ? "#262520" : "#1A2030"} />
    <pointLight position={[-2.2, 2.2, 0.6]} intensity={old ? 1.2 : 2.2} distance={7} color="#FFB872" />
  </>
);
// POV: hands with the phone, thumb swipes when the feed moves
const PovScene: React.FC<{ t: number; tex: THREE.Texture; abs: number; cam?: { pos: V3; look: V3; fov: number } }> = ({ t, tex, abs, cam }) => {
  const s = scrollAt(abs); const f = s - Math.floor(s);
  const swipe = Math.sin(Math.PI * cl(f / 1)) * (f > 0.001 && f < 0.999 ? 1 : 0);
  const skin = "#D8C2A6";
  const sway = Math.sin(t * 1.3) * 0.004;
  return (
    <>
      <Room />
      <Cam pos={cam ? cam.pos : [0, 1.2 + sway, 1.18]} look={cam ? cam.look : [0, 1.0, 0]} fov={cam ? cam.fov : 36} />
      <group position={[0, 0.86, 0.12]} rotation={[0.32, 0, 0]}>
        <Phone tex={tex} p={[0, 0, 0]} scale={2.1} light={1.15} />
        {[-1, 1].map((sd) => (
          <group key={sd}>
            <mesh position={[sd * 0.13, -0.2, 0.0]} rotation={[0.3, 0, sd * 0.6]}><capsuleGeometry args={[0.04, 0.22, 6, 12]} /><meshStandardMaterial color="#2F3542" roughness={0.9} /></mesh>
            <mesh position={[sd * 0.085, -0.095, 0.012]} rotation={[0.2, 0, sd * 0.4]}><capsuleGeometry args={[0.028, 0.06, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.85} /></mesh>
            <mesh position={[sd * 0.088, -0.03, 0.0]} rotation={[0, 0, sd * 0.2]}><capsuleGeometry args={[0.022, 0.1, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.85} /></mesh>
          </group>
        ))}
        <mesh position={[0.04, -0.07 + swipe * 0.09, 0.026]} rotation={[0.2, 0, 0.6]}>
          <capsuleGeometry args={[0.017, 0.07, 6, 12]} /><meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
      </group>
    </>
  );
};
const tapeTex = canvasTex(1024, 128, (c) => {
  c.fillStyle = "#F2C230"; c.fillRect(0, 0, 1024, 128); c.fillStyle = "#1A1A1A";
  for (let i = 0; i <= 80; i++) { const x = 8 + i * 12.6; c.fillRect(x, 0, 2, i % 10 === 0 ? 60 : i % 5 === 0 ? 42 : 26); if (i % 10 === 0) { c.font = `700 30px ${SANS}`; c.fillText(String(i / 10), x + 4, 100); } }
});
const ThumbScene: React.FC<{ t: number; tex: THREE.Texture; abs: number }> = ({ t, tex, abs }) => (
  <>
    <PovScene t={t} tex={tex} abs={abs} cam={{ pos: [0.32, 0.98, 0.5 - t * 0.02], look: [0.03, 0.86, 0.14], fov: 34 }} />
    <group position={[0, 0.86, 0.12]} rotation={[0.32, 0, 0]}>
      <mesh position={[0.11, 0.0, 0.03]} rotation={[0, 0, Math.PI / 2]} scale={[ease(t / 0.7), 1, 1]}><planeGeometry args={[0.2, 0.025]} /><meshStandardMaterial map={tapeTex} emissive="#ffffff" emissiveMap={tapeTex} emissiveIntensity={0.5} /></mesh>
    </group>
  </>
);
const MapScene: React.FC<{ t: number; dm: ReturnType<typeof buildDots> }> = ({ t, dm }) => {
  const a = proj(10.0, 53.55), b = proj(11.58, 48.14);
  const k = ease((t - 0.5) / 2.4);
  const end = lerp3(a, b, Math.max(0.001, k));
  const path = new THREE.LineCurve3(new THREE.Vector3(a[0], 0.08, a[2]), new THREE.Vector3(end[0], 0.08, end[2]));
  return (
    <>
      <Bg color="#05060B" />
      <ambientLight intensity={0.6} />
      <Cam pos={[0, 10 - t * 0.2, 5.5 - t * 0.1]} look={[0, 0, 0]} fov={42} />
      <GermanyMap dm={dm} reveal={1} lineOp={0.4} />
      <mesh><tubeGeometry args={[path, 8, 0.05, 8, false]} /><meshStandardMaterial color={A} emissive={A} emissiveIntensity={2} /></mesh>
      {[a, end].map((p, i) => <mesh key={i} position={[p[0], 0.1, p[2]]}><sphereGeometry args={[0.12, 16, 12]} /><meshStandardMaterial color="#fff" emissive={A} emissiveIntensity={2} /></mesh>)}
    </>
  );
};
const OldScene: React.FC<{ t: number; tex: THREE.Texture }> = ({ t, tex }) => {
  const cal = useDyn(256, 320, (c) => {
    c.fillStyle = "#F2EEE6"; c.fillRect(0, 0, 256, 320); c.fillStyle = "#C8202A"; c.fillRect(0, 0, 256, 70);
    c.fillStyle = "#fff"; c.font = `700 40px ${SANS}`; c.textAlign = "center"; c.fillText("JAHR", 128, 50);
    c.fillStyle = "#111"; c.font = `700 92px ${SANS}`; c.fillText(String(2026 + Math.min(80, Math.floor(ease(t / 2.5) * 80))), 128, 210);
  });
  return (
    <>
      <Room old={1} />
      <Cam pos={[1.1, 1.35, 2.0 - t * 0.08]} look={[-0.1, 1.0, -0.6]} fov={42} />
      <ambientLight intensity={0.35} color="#C8B8A0" />
      <pointLight position={[1.4, 2.0, 0.8]} intensity={4} distance={6} color="#FFD8A8" />
      <mesh position={[-0.9, 1.35, -3.13]}><planeGeometry args={[0.5, 0.62]} /><meshStandardMaterial map={cal} emissive="#fff" emissiveMap={cal} emissiveIntensity={0.25} /></mesh>
      <Box p={[0, 0.25, 0]} s={[1.6, 0.5, 0.7]} color="#4A3E36" />
      <Box p={[0, 0.65, 0.3]} s={[1.6, 0.6, 0.15]} color="#4A3E36" />
      <Person p={[0.15, -0.3, -0.05]} ry={Math.PI} shirt="#5A5048" pants="#3A3632" hair="#E8E6E2" pose={{ armL: 0.9, armR: 0.9, foreL: 0.7, foreR: 0.7, head: 0.35 }} />
      <Phone tex={tex} p={[0.15, 1.15, -0.42]} rot={[-0.4, Math.PI, 0]} scale={2} light={1.2} />
      <pointLight position={[0.15, 1.3, -0.7]} intensity={2.5} distance={2.5} color="#9FD8FF" />
    </>
  );
};
let _earth: THREE.Texture | null = null;
const earthTex = () => _earth ??= canvasTex(2048, 1024, (c) => {
  c.fillStyle = "#123A66"; c.fillRect(0, 0, 2048, 1024);
  [[420, 330, 220], [600, 650, 160], [1050, 300, 260], [1150, 600, 180], [1550, 380, 300], [1700, 700, 140]].forEach(([x, y, r], j) => {
    c.fillStyle = "#2E4A2A"; for (let i = 0; i < 60; i++) { c.beginPath(); c.arc(x + (rnd(j * 100 + i) - 0.5) * r * 2, y + (rnd(j * 100 + i * 2) - 0.5) * r, r * (0.2 + rnd(j * 100 + i * 3) * 0.35), 0, Math.PI * 2); c.fill(); }
  });
});
let _glow: THREE.Texture | null = null;
const glowTex = () => _glow ??= canvasTex(256, 256, (c) => {
  const g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.2, "rgba(255,255,255,.7)"); g.addColorStop(0.5, "rgba(255,255,255,.15)"); g.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = g; c.fillRect(0, 0, 256, 256);
});
const Glow: React.FC<{ p: V3; size: number; color: string; op?: number }> = ({ p, size, color, op = 1 }) => (
  <sprite position={p} scale={[size, size, 1]}><spriteMaterial map={glowTex()} color={color} transparent opacity={op} depthWrite={false} blending={THREE.AdditiveBlending} /></sprite>
);
const Stars: React.FC<{ n?: number; r?: number }> = ({ n = 1200, r = 400 }) => {
  const g = React.useMemo(() => {
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const th = rnd(i * 1.3) * Math.PI * 2, ph = Math.acos(2 * rnd(i * 2.7) - 1); a.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(a, 3)); return geo;
  }, [n, r]);
  return <points geometry={g}><pointsMaterial size={1.4} color="#fff" sizeAttenuation={false} /></points>;
};
const SunScene: React.FC<{ t: number; glueht: number; weiter: number; tex: THREE.Texture }> = ({ t, glueht, weiter, tex }) => {
  const grow = ease(t / 3.5);
  const hot = cl((t - glueht) / 1.2);
  const sunR = lerp(1.2, 9, grow);
  const phone = cl((t - weiter + 0.3) / 0.8);
  return (
    <>
      <Bg color="#020205" />
      <Stars />
      <ambientLight intensity={0.05} />
      <pointLight position={[-18, 0, -8]} intensity={lerp(400, 1400, grow)} distance={0} decay={1.4} color={grow > 0.3 ? "#FF7A40" : "#FFF0D0"} />
      <mesh position={[-18, 0, -8]}><sphereGeometry args={[sunR, 48, 32]} /><meshBasicMaterial color={grow > 0.3 ? "#FF5A28" : "#FFE6A0"} toneMapped={false} /></mesh>
      <Glow p={[-18, 0, -8]} size={sunR * 4.2} color="#FF7A30" op={0.9} />
      <group rotation={[0.3, t * 0.05, 0]}>
        <mesh><sphereGeometry args={[1, 64, 48]} /><meshStandardMaterial map={earthTex()} roughness={0.9} emissive="#FF3A10" emissiveIntensity={hot * 0.9} color={new THREE.Color(1, 1 - hot * 0.4, 1 - hot * 0.6)} /></mesh>
      </group>
      <Glow p={[0, 0, 0]} size={3.2} color="#FF4A20" op={hot * 0.8} />
      {phone > 0 && <Phone tex={tex} p={[1.15, -0.1, 3.0]} rot={[0, -0.35, 0.05]} scale={3 * ease(phone)} light={1.3} />}
      <Cam pos={[2.6 - t * 0.06, 0.6, 6.2 - t * 0.12]} look={[-1.5, 0, -1]} fov={42} far={500} />
    </>
  );
};
const galaxyGeo = (n: number, arms: number, seed: number, rad: number) => {
  const a = new Float32Array(n * 3), col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = Math.pow(rnd(i * 1.7 + seed), 1.6) * rad;
    const arm = (Math.floor(rnd(i * 3.1 + seed) * arms) / arms) * Math.PI * 2;
    const th = arm + r / rad * 4.2 + (rnd(i * 5.3 + seed) - 0.5) * 0.7;
    a.set([Math.cos(th) * r, (rnd(i * 7.1 + seed) - 0.5) * rad * 0.06 * (1 - r / rad), Math.sin(th) * r], i * 3);
    const w = 1 - r / rad; col.set([0.75 + w * 0.25, 0.75 + w * 0.15, 0.95 - w * 0.25], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(a, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return g;
};
const GALS: [number, number, number, number][] = [[60, 8, -40, 0.5], [-70, -10, -60, 0.4], [30, -20, -90, 0.6], [-40, 25, -30, 0.35], [90, 30, -100, 0.5], [-100, 0, 20, 0.45], [20, 40, -70, 0.3], [70, -35, 10, 0.4]];
const GalaxyScene: React.FC<{ t: number; himmel: number; bild: number }> = ({ t, himmel, bild }) => {
  const mw = React.useMemo(() => galaxyGeo(9000, 4, 1, 14), []);
  const small = React.useMemo(() => galaxyGeo(1400, 2, 7, 6), []);
  const fade = 1 - cl((t - 1.5) / (himmel - 1.5));
  const drift = 1 + t * 0.12;
  const scr = cl((t - bild + 0.2) / 0.5);
  return (
    <>
      <Bg color="#010103" />
      <points geometry={mw} rotation={[0.5, t * 0.03, 0.1]}><pointsMaterial size={0.09} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} /></points>
      <Glow p={[0, 0, 0]} size={7} color="#FFE0B0" op={0.5} />
      {GALS.map(([x, y, z, s], i) => (
        <group key={i} position={[x * 0.28 * drift, y * 0.28 * drift, z * 0.28 * drift]} rotation={[rnd(i) * 2, rnd(i * 2) * 2, 0]} scale={s * 1.6}>
          <points geometry={small}><pointsMaterial size={0.25} vertexColors transparent opacity={0.9 * fade} depthWrite={false} blending={THREE.AdditiveBlending} /></points>
          <Glow p={[0, 0, 0]} size={4} color="#FFE8C8" op={0.6 * fade} />
        </group>
      ))}
      {scr > 0 && <Glow p={[3, 0.4, 6]} size={0.6 + scr * 0.5} color="#BFEFFF" op={scr} />}
      <Cam pos={[0, 22 - t * 0.5, 34 - t * 0.6]} look={[0, 0, 0]} fov={50} far={2000} />
    </>
  );
};
const labelTex = (txt: string, sub: string, color: string) => canvasTex(512, 160, (c) => {
  c.textAlign = "center"; c.fillStyle = color; c.font = `600 54px ${SERIF}`; c.fillText(txt, 256, 70);
  c.fillStyle = "rgba(255,255,255,.75)"; c.font = `italic 400 34px ${SERIF}`; c.fillText(sub, 256, 124);
});
const LBL_SUN = labelTex("Sonne", "Start", "#FFE6A0");
const LBL_ALD = labelTex("Aldebaran", "65 Lichtjahre", "#FFB070");
const LightYearScene: React.FC<{ t: number; ald: number }> = ({ t, ald }) => {
  const k = ease((t - 0.4) / Math.max(1, ald - 0.4 + 1.2));
  const x0 = -6, x1 = x0 + 78 * 0.16, xa = x0 + 65 * 0.16;
  const end = lerp(x0, x1, k);
  const path = new THREE.LineCurve3(new THREE.Vector3(x0, 0, 0), new THREE.Vector3(Math.max(end, x0 + 0.01), 0, 0));
  return (
    <>
      <Bg color="#020206" />
      <Stars n={1600} />
      <ambientLight intensity={0.5} />
      <Glow p={[x0, 0, 0]} size={1.4} color="#FFE6A0" />
      <Glow p={[xa, 0, 0]} size={2.4} color="#FF9A50" />
      <mesh position={[xa, 0, 0]}><sphereGeometry args={[0.18, 20, 14]} /><meshBasicMaterial color="#FFB070" /></mesh>
      <mesh position={[x0, 0, 0]}><sphereGeometry args={[0.1, 16, 12]} /><meshBasicMaterial color="#FFF2C8" /></mesh>
      <mesh><tubeGeometry args={[path, 8, 0.035, 8, false]} /><meshStandardMaterial color={A} emissive={A} emissiveIntensity={2.5} /></mesh>
      <Glow p={[end, 0, 0]} size={0.8} color={A} />
      <sprite position={[x0, -0.75, 0]} scale={[2.2, 0.69, 1]}><spriteMaterial map={LBL_SUN} transparent depthWrite={false} /></sprite>
      <sprite position={[xa, 0.85, 0]} scale={[2.6, 0.81, 1]}><spriteMaterial map={LBL_ALD} transparent depthWrite={false} /></sprite>
      <Cam pos={[lerp(x0 + 0.8, end - 1.5, k), 0.9, 6.8 + k * 1.8]} look={[lerp(x0 + 0.8, end - 1.0, k), 0, 0]} fov={46} />
    </>
  );
};
const VoidScene: React.FC<{ t: number; tex: THREE.Texture; dolly?: number }> = ({ t, tex, dolly = 0 }) => (
  <>
    <Bg color="#000" />
    <Stars n={300} />
    <Phone tex={tex} p={[0, 0, 0]} rot={[0.05, Math.sin(t * 0.3) * 0.15, 0]} scale={2.4} light={1.25} />
    <Glow p={[0, 0, -0.1]} size={0.9} color="#7FD8FF" op={0.35} />
    <Cam pos={[0, 0, lerp(0.75, 0.52, dolly) - t * 0.01]} look={[0, 0, 0]} fov={38} />
  </>
);

const Overlay: React.FC<{ t: number }> = ({ t }) => {
  const fi = (a: number, d = 0.3) => cl((t - a) / d);
  const ab = (i: number) => t >= B[i].a && t < B[i].b;
  const fo = (i: number) => cl((B[i].b - t) / 0.2);
  const op = (i: number) => (ab(i) ? Math.min(fi(B[i].a + 0.15), fo(i)) : 0);
  const up = (a: number, b: number, d: number) => ease((t - a) / d) * b;
  return (
    <>
      <TopPill />
      {ab(0) && t > T.was - 0.15 && <HookTitle lines={["„Nur noch ein Video“ –", "1.000 Milliarden", "Jahre lang?"]} accent={A} op={fi(T.was - 0.15, 0.25)} y={470} />}
      {ab(1) && <Counter label="EIN SWIPE ALLE" value="3 Sek." sub="24 Stunden am Tag · ohne Pause" accent={A} op={op(1)} />}
      {ab(2) && <Counter label="VIDEOS PRO JAHR" value={fmt(Math.round(up(B[2].a + 0.2, 10512000, 1.4)))} sub="365 × 24 × 1.200" accent={A} op={op(2)} />}
      {ab(3) && <InfoCard label="ANNAHME" text="7 cm Daumenweg pro Swipe." source="eigene Messung" accent={A} op={op(3)} />}
      {ab(4) && <Counter label="DAUMENWEG PRO JAHR" value={fmt(Math.round(up(B[4].a + 0.4, 736, 1.6))) + " km"} sub="ungefähr Hamburg → München" accent={A} op={op(4)} />}
      {ab(5) && (t < T.n840 - 0.1
        ? <Counter label="JAHRE GESCROLLT" value={fmt(Math.round(up(B[5].a + 0.1, 80, 1.2)))} sub="ohne ein einziges Mal aufzuhören" accent={A} op={op(5)} />
        : <Counter label="VIDEOS GESEHEN" value={fmt(Math.round(up(T.n840 - 0.1, 840000000, 1.4)))} sub="in einem Menschenleben" accent={A} op={fi(T.n840 - 0.1) * fo(5)} />)}
      {ab(6) && <BigNumber value="5 Mrd. Jahre" sub="DIE SONNE WIRD ZUM ROTEN RIESEN" accent={A} op={op(6)} source="NASA" />}
      {ab(7) && <BigNumber value="150 Mrd. Jahre" sub="ANDERE GALAXIEN: HINTER DEM HORIZONT" accent={A} op={Math.min(op(7), cl((T.himmel + 0.6 - t) / 0.3))} source="Krauss & Scherrer, 2007" />}
      {ab(8) && <Counter label="DAUMENWEG GESAMT" value={fmt(up(B[8].a + 0.4, 77.8, T.aldebaran + 0.8 - B[8].a), 1) + " Lj."} sub="1.000 Mrd. Jahre × 736 km" accent={A} op={op(8)} />}
      {ab(9) && t < T.kein - 0.1 && <BigNumber value="10 Trillionen" sub="VIDEOS GESEHEN" accent={A} op={fi(B[9].a + 0.1) * cl((T.kein - 0.1 - t) / 0.2)} />}
      <FollowPill text="Folg – dann siehst du, welches Video am Ende kommt." op={Math.min(fi(T.fyp + 0.2), cl((B[6].a - 0.3 - t) / 0.3))} y={1420} />
      <Captions words={words} t={t} hideUntil={0} />
    </>
  );
};

export const TikTok: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const geo = useGeo();
  const dm = React.useMemo(() => (geo ? buildDots(geo) : null), [geo]);
  const cur = B.findIndex((b) => t >= b.a && t < b.b);
  const lt = cur >= 0 ? t - B[cur].a : 0;
  const L_ = (x: number) => x - (cur >= 0 ? B[cur].a : 0);
  const mode: ScreenMode = cur >= 10 ? (t < T.zeigt + 0.5 ? "search" : "first") : t >= T.kein - 0.2 && cur === 9 ? "empty" : "feed";
  const k = mode === "search" ? cl((t - B[10].a) / 2.2) : mode === "first" ? cl((t - T.erstes + 0.2) / 1) : 0;
  const tex = useDyn(540, 1100, (c) => drawScreen(c, t, mode, k));
  if (!dm) return null;
  let scene: React.ReactNode = null;
  switch (cur) {
    case 0: case 1: case 2: scene = <PovScene t={t} tex={tex} abs={t} />; break;
    case 3: scene = <ThumbScene t={lt} tex={tex} abs={t} />; break;
    case 4: scene = <MapScene t={lt} dm={dm} />; break;
    case 5: scene = <OldScene t={lt} tex={tex} />; break;
    case 6: scene = <SunScene t={lt} glueht={L_(T.glueht)} weiter={L_(T.weiter)} tex={tex} />; break;
    case 7: scene = <GalaxyScene t={lt} himmel={L_(T.himmel)} bild={L_(T.bildschirm)} />; break;
    case 8: scene = <LightYearScene t={lt} ald={L_(T.aldebaran)} />; break;
    case 9: case 10: scene = <VoidScene t={lt} tex={tex} dolly={cur === 10 ? inOut((t - T.erstes + 0.6) / 1.2) : 0} />; break;
    default: {
      // pull back out of the screen into the opening POV frame -> seamless loop
      const kk = inOut(lt / Math.max(1, TT_END - B[11].a - 0.2));
      scene = <PovScene t={t} tex={tex} abs={t} cam={{ pos: lerp3([0, 0.88, 0.42], [0, 1.2, 1.18], kk), look: lerp3([0, 0.86, 0.1], [0, 1.0, 0], kk), fov: 36 }} />;
    }
  }
  const sfx = (name: string, at: number, vol = 0.5) => <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={210}><Audio src={staticFile(`wwd/tiktok/sfx/${name}.mp3`)} volume={vol} /></Sequence>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ThreeCanvas width={W} height={H} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        {scene}
      </ThreeCanvas>
      <Grade />
      <Overlay t={t} />
      <Audio src={staticFile("wwd/tiktok/voice.mp3")} />
      <Audio src={staticFile("wwd/tiktok/music.mp3")} volume={(fr) => 0.17 * Math.min(1, fr / 15) * Math.min(1, (TT_END * 30 - fr) / 30)} />
      {B.slice(2).map((b, i) => <React.Fragment key={i}>{sfx("whoosh", b.a - 0.15, 0.16)}</React.Fragment>)}
      {[1.7, 4.7].map((x, i) => <React.Fragment key={"s" + i}>{sfx("swipe", x, 0.4)}</React.Fragment>)}
      {sfx("swipes", B[1].a + 0.2, 0.3)}
      {sfx("tick", B[2].a + 0.2, 0.3)}
      {sfx("tick", B[4].a + 0.4, 0.3)}
      {sfx("tick", T.n840, 0.3)}
      {sfx("sunroar", B[6].a + 0.2, 0.45)}
      {sfx("hit", T.glueht, 0.35)}
      {sfx("space", B[7].a, 0.4)}
      {sfx("glitch", T.kein, 0.35)}
      {sfx("search", B[10].a, 0.35)}
      {sfx("chime", T.erstes - 0.1, 0.45)}
    </AbsoluteFill>
  );
};
