// HD set for the Zug episode: modelled ICE (lofted body + nose), ballast with sleepers, catenary,
// daylight station with canopy, landscape — rendered with the cinematic layer from look.tsx.
import React from "react";
import * as THREE from "three";
import { Box, Cam, Person, V3, canvasTex, ease, inOut, lerp, lerp3, rnd, rr, SANS } from "./kit";
import { Board, Crowd, L, P, curveX } from "./Zug";
import { Env, SkyDome, Sun, noiseTex } from "./look";

// ---------- ICE geometry ----------
const NS = 6; // superellipse exponent → flat sides, rounded roof edges
const HW = 1.475, TOP = 4.0, BOT = 0.95, NL = 8.5;
type Sec = { z: number; hw: number; top: number; bot: number };
const se = (t: number) => { const c = Math.cos(t), s = Math.sin(t); return [Math.sign(c) * Math.pow(Math.abs(c), 2 / NS), Math.sign(s) * Math.pow(Math.abs(s), 2 / NS)]; };
const loft = (secs: Sec[], seg: number, col?: (u: number, x: number, y: number, s: Sec) => THREE.Color) => {
  const pos: number[] = [], cols: number[] = [], idx: number[] = [];
  const white = new THREE.Color(1, 1, 1);
  secs.forEach((s, i) => {
    const yc = (s.top + s.bot) / 2, hh = (s.top - s.bot) / 2;
    for (let j = 0; j <= seg; j++) {
      const [a, b] = se(-Math.PI / 2 + (j / seg) * Math.PI * 2);
      const x = s.hw * a, y = yc + hh * b;
      pos.push(x, y, s.z);
      const c = col ? col(i / (secs.length - 1), x, y, s) : white; cols.push(c.r, c.g, c.b);
    }
  });
  const R = seg + 1;
  for (let i = 0; i < secs.length - 1; i++) for (let j = 0; j < seg; j++) {
    const a = i * R + j, b = a + 1, c = a + R, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  // caps
  const cap = (si: number, dir: number) => {
    const s = secs[si]; const ci = pos.length / 3;
    pos.push(0, (s.top + s.bot) / 2, s.z); const c = cols.slice(si * R * 3, si * R * 3 + 3); cols.push(...c);
    for (let j = 0; j < seg; j++) { const a = si * R + j, b = a + 1; if (dir > 0) idx.push(ci, a, b); else idx.push(ci, b, a); }
  };
  cap(0, -1); cap(secs.length - 1, 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
};
const BODY_GEO = loft([{ z: -L / 2, hw: HW, top: TOP, bot: BOT }, { z: L / 2, hw: HW, top: TOP, bot: BOT }], 96);
const RED = new THREE.Color("#E3001B"), GLASS = new THREE.Color("#0E141B"), SKIRT = new THREE.Color("#34383D"), PAINT = new THREE.Color("#FFFFFF");
const noseSec = (u: number): Sec => {
  const tip = u > 0.86 ? Math.sqrt(Math.max(0.04, 1 - Math.pow((u - 0.86) / 0.14, 2))) : 1;
  const top = TOP - 2.2 * (1 - Math.cos(u * Math.PI / 2));
  const bot = BOT + 0.28 * Math.pow(u, 3);
  const yc = (top + bot) / 2, hh = ((top - bot) / 2) * (0.35 + 0.65 * tip);
  return { z: u * NL, hw: HW * (1 - 0.68 * Math.pow(u, 2.2)) * tip, top: yc + hh, bot: yc - hh };
};
const NOSE_GEO = loft(Array.from({ length: 48 }, (_, i) => noseSec(i / 47)), 128, (u, x, y, s) => {
  const yc = (s.top + s.bot) / 2, hh = (s.top - s.bot) / 2;
  if (u > 0.36 && u < 0.7 && y > yc + 0.12 * hh && Math.abs(x) < s.hw * 0.97) return GLASS;
  if (Math.abs(y - (1.45 + 0.12 * u)) < 0.09 && u < 0.9) return RED;
  if (y < s.bot + 0.12) return SKIRT;
  return PAINT;
});
const paint = new THREE.MeshPhysicalMaterial({ color: "#F4F5F3", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 });
const paintVC = new THREE.MeshPhysicalMaterial({ color: "#F4F5F3", roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08, vertexColors: true });
// side livery (windows, doors, red stripe) as a decal plane. canvas: x along car, y = world 3.85 → 1.05
const PX = 2048 / L, sideH = 2.8, PY = 224 / sideH;
const yPx = (yw: number) => (3.85 - yw) * PY;
const drawSide = (c: CanvasRenderingContext2D, night: boolean) => {
  c.clearRect(0, 0, 2048, 224);
  const doors = [1.3, L - 2.3];
  const win = (x0: number) => {
    if (night) { c.fillStyle = "#FFD7A0"; } else { const g = c.createLinearGradient(0, yPx(3.2), 0, yPx(2.4)); g.addColorStop(0, "#3C4A58"); g.addColorStop(0.45, "#1B2530"); g.addColorStop(1, "#121A22"); c.fillStyle = g; }
    rr(c, x0 * PX, yPx(3.2), 1.45 * PX, 0.8 * PY, 16); c.fill();
  };
  for (let i = 0; i < 9; i++) win(3.1 + i * 2.25);
  if (night) return;
  c.fillStyle = "#E3001B"; c.fillRect(0, yPx(1.56), 2048, 0.16 * PY);
  doors.forEach((d) => {
    c.strokeStyle = "#8E959C"; c.lineWidth = 4; rr(c, d * PX, yPx(3.05), 1.0 * PX, 1.98 * PY, 10); c.stroke();
    c.fillStyle = "#1B2530"; rr(c, (d + 0.2) * PX, yPx(2.9), 0.6 * PX, 0.75 * PY, 8); c.fill();
    c.fillStyle = "#6E767E"; c.fillRect((d + 0.49) * PX, yPx(3.05), 2, 1.98 * PY);
  });
  c.fillStyle = "#E3001B"; c.font = `800 34px ${SANS}`; c.fillText("DB", 1.2 * PX, yPx(1.75));
};
const SIDE_TEX = canvasTex(2048, 224, (c) => drawSide(c, false));
const SIDE_NIGHT = canvasTex(2048, 224, (c) => drawSide(c, true));
const sideMat = new THREE.MeshPhysicalMaterial({ map: SIDE_TEX, transparent: true, alphaTest: 0.4, roughness: 0.15, clearcoat: 1, polygonOffset: true, polygonOffsetFactor: -2 });
const sideMatNight = new THREE.MeshStandardMaterial({ map: SIDE_NIGHT, emissiveMap: SIDE_NIGHT, emissive: "#ffffff", emissiveIntensity: 2.2, transparent: true, alphaTest: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
const dark = new THREE.MeshStandardMaterial({ color: "#26292D", roughness: 0.8 });
const steel = new THREE.MeshStandardMaterial({ color: "#5B5F64", roughness: 0.45, metalness: 0.7 });
const roofGrey = new THREE.MeshStandardMaterial({ color: "#C9CDD1", roughness: 0.55 });
const nightBody = new THREE.MeshStandardMaterial({ color: "#2A2D33", roughness: 0.5 });

const Bogie: React.FC<{ z: number }> = ({ z }) => (
  <group position={[0, 0, z]}>
    <mesh material={dark} position={[0, 0.72, 0]} castShadow><boxGeometry args={[2.3, 0.42, 3.2]} /></mesh>
    {[-1.25, 1.25].map((dz) => [-0.78, 0.78].map((x) => (
      <mesh key={`${dz}${x}`} material={steel} position={[x, 0.46, dz]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.46, 0.46, 0.14, 24]} /></mesh>
    )))}
  </group>
);
const Lights: React.FC<{ z: number; tail?: boolean; on?: number }> = ({ z, tail, on = 1 }) => {
  const s = noseSec(0.9);
  return (
    <>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * s.hw * 0.62, s.bot + 0.28, z]} scale={[1.6, 0.7, 0.6]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color={tail ? "#FF2418" : "#FFFFFF"} emissive={tail ? "#FF0A00" : "#FFF6E0"} emissiveIntensity={on * (tail ? 1.6 : 8)} />
        </mesh>
      ))}
    </>
  );
};
// one car; nose = +1 → nose cone attached at +z end pointing +z, -1 → at -z end pointing -z
export const IceCar: React.FC<{ z: number; nose?: number; tail?: boolean; night?: boolean; simple?: boolean; doorOpen?: number; panto?: boolean; lightsOn?: number }> = ({ z, nose = 0, tail, night, simple, doorOpen = -1, panto, lightsOn = 1 }) => (
  <group position={[0, 0, z]}>
    <mesh geometry={BODY_GEO} material={night ? nightBody : paint} castShadow={!simple} receiveShadow />
    {[1, -1].map((k) => (
      <mesh key={k} position={[k * (HW + 0.004), 2.45, 0]} rotation={[0, (k * Math.PI) / 2, 0]} material={night ? sideMatNight : sideMat}>
        <planeGeometry args={[L, sideH]} />
      </mesh>
    ))}
    {!simple && <>
      <mesh material={dark} position={[0, 0.82, 0]}><boxGeometry args={[2.5, 0.3, L - 7]} /></mesh>
      <Bogie z={L / 2 - 3.4} /><Bogie z={-L / 2 + 3.4} />
      <mesh material={roofGrey} position={[0, 4.05, 0]} castShadow><boxGeometry args={[1.8, 0.22, 5]} /></mesh>
      <mesh material={dark} position={[0, 2.4, L / 2 + 0.3]}><boxGeometry args={[2.5, 3.0, 0.62]} /></mesh>
      {panto && (
        <group position={[0, 4.0, -L / 4]}>
          <mesh material={steel} position={[0, 0.7, 0]} rotation={[0.9, 0, 0]}><boxGeometry args={[0.06, 0.06, 1.8]} /></mesh>
          <mesh material={steel} position={[0, 1.4, 0.55]}><boxGeometry args={[1.9, 0.06, 0.12]} /></mesh>
        </group>
      )}
      {doorOpen >= 0 && [1, -1].map((s) => (
        <group key={s}>
          <mesh position={[HW + 0.012, 2.04, L / 2 - 1.8]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.0, 1.98]} /><meshStandardMaterial color="#14191F" /></mesh>
          <mesh position={[HW + 0.03, 2.04, L / 2 - 1.8 + s * (0.25 + doorOpen * 0.5)]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.5, 1.98]} /><meshPhysicalMaterial color="#EEF0EE" roughness={0.3} clearcoat={1} /></mesh>
        </group>
      ))}
    </>}
    {nose !== 0 && (
      <group position={[0, 0, (nose * L) / 2]} rotation={[0, nose > 0 ? 0 : Math.PI, 0]}>
        <mesh geometry={NOSE_GEO} material={night ? nightBody : paintVC} castShadow={!simple} receiveShadow />
        <Lights z={NL * 0.9 - 0.02} tail={tail} on={lightsOn} />
      </group>
    )}
  </group>
);
// coupled 13-car units heading +z; front nose at z0
export const UNIT = 13 * P + 2 * NL;
export const carZ = (z0: number, i: number) => z0 - NL - L / 2 - i * P - Math.floor(i / 13) * (2 * NL + 1.2);
export const IceTrain: React.FC<{ z0?: number; n: number; night?: boolean; from?: number; simpleAfter?: number; x?: number }> = ({ z0 = 0, n, night, from = 0, simpleAfter = 16, x = 0 }) => (
  <group position={[x, 0, 0]}>
    {Array.from({ length: n }, (_, k) => {
      const i = k + from;
      const first = i % 13 === 0, last = i % 13 === 12;
      return <IceCar key={i} z={carZ(z0, i)} nose={first ? 1 : last ? -1 : 0} tail={last} night={night} simple={k > simpleAfter} panto={i % 13 === 3} />;
    })}
  </group>
);

// ---------- track, catenary, ground ----------
const ballastTex = (len: number) => noiseTex("ballast", "#8A8178", ["#5E574F", "#A39A90", "#6F675E", "#B5ADA3", "#4C463F"], 14000, 256, [1, len / 2.4], (c) => {
  for (let i = 0; i < 4; i++) {
    c.fillStyle = "#77736C"; c.fillRect(28, i * 64 + 22, 200, 20);
    c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(28, i * 64 + 42, 200, 3);
  }
});
const railMat = new THREE.MeshStandardMaterial({ color: "#8E9196", roughness: 0.25, metalness: 0.9 });
export const HDTrack: React.FC<{ z: number; len: number; x?: number; cat?: boolean; masts?: number }> = ({ z, len, x = 0, cat = true, masts = 50 }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.14, 0]} receiveShadow><boxGeometry args={[4.6, 0.28, len]} /><meshStandardMaterial map={ballastTex(len)} roughness={1} /></mesh>
    {[-0.72, 0.72].map((r) => <mesh key={r} material={railMat} position={[r, 0.36, 0]} receiveShadow><boxGeometry args={[0.07, 0.16, len]} /></mesh>)}
    {cat && <>
      <mesh material={dark} position={[0, 5.55, 0]}><boxGeometry args={[0.025, 0.025, len]} /></mesh>
      <mesh material={dark} position={[0, 6.5, 0]}><boxGeometry args={[0.02, 0.02, len]} /></mesh>
      {Array.from({ length: Math.floor(len / masts) }, (_, i) => {
        const zz = len / 2 - 10 - i * masts;
        return (
          <group key={i} position={[-3.3, 0, zz]}>
            <mesh material={steel} position={[0, 3.6, 0]} castShadow><boxGeometry args={[0.28, 7.2, 0.28]} /></mesh>
            <mesh material={steel} position={[1.7, 6.6, 0]} castShadow><boxGeometry args={[3.6, 0.1, 0.1]} /></mesh>
            <mesh material={steel} position={[1.7, 5.9, 0]} rotation={[0, 0, -0.2]}><boxGeometry args={[3.5, 0.06, 0.06]} /></mesh>
          </group>
        );
      })}
    </>}
  </group>
);
export const Ground: React.FC<{ z?: number; size?: number; night?: boolean }> = ({ z = -300, size = 3000, night }) => (
  <mesh position={[0, -0.02, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[size, size]} />
    <meshStandardMaterial color={night ? "#1A2016" : "#FFFFFF"} map={noiseTex("grass", "#6F8A4C", ["#5C7A3C", "#86A05E", "#4E6834", "#9AAF6A"], 16000, 256, [size / 6, size / 6])} roughness={1} />
  </mesh>
);
const leaf = ["#3F5F2E", "#4A6B34", "#355428", "#58773A"];
export const Trees: React.FC<{ n: number; seed?: number; x: [number, number]; z: [number, number]; side?: number; s?: number }> = ({ n, seed = 1, x, z, side = 0, s = 1 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: number) => rnd(i * 13 + seed * 7 + k);
      const sx = side ? side * lerp(x[0], x[1], r(1)) : (r(5) > 0.5 ? 1 : -1) * lerp(x[0], x[1], r(1));
      const zz = lerp(z[0], z[1], r(2)); const h = (6 + r(3) * 8) * s;
      const round = r(4) > 0.45;
      return (
        <group key={i} position={[sx, 0, zz]}>
          <mesh position={[0, h * 0.25, 0]} castShadow><cylinderGeometry args={[0.18 * s, 0.25 * s, h * 0.5, 6]} /><meshStandardMaterial color="#4A3A2C" roughness={1} /></mesh>
          {round
            ? <mesh position={[0, h * 0.62, 0]} scale={[1, 1.15, 1]} castShadow><icosahedronGeometry args={[h * 0.32, 1]} /><meshStandardMaterial color={leaf[i % 4]} roughness={1} flatShading /></mesh>
            : <mesh position={[0, h * 0.6, 0]} castShadow><coneGeometry args={[h * 0.24, h * 0.8, 8]} /><meshStandardMaterial color={leaf[(i + 2) % 4]} roughness={1} flatShading /></mesh>}
        </group>
      );
    })}
  </>
);

// ---------- station ----------
const concrete = (len: number) => noiseTex("concrete", "#B3B0AA", ["#9C9993", "#C4C1BB", "#A8A59F"], 9000, 256, [2, len / 8], (c) => {
  c.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < 4; i++) c.fillRect(0, i * 64, 256, 2);
});
const signTex = canvasTex(512, 160, (c) => {
  c.fillStyle = "#14286E"; c.fillRect(0, 0, 512, 160);
  c.fillStyle = "#fff"; c.font = `700 92px ${SANS}`; c.fillText("1", 40, 118);
  c.font = `600 52px ${SANS}`; c.fillText("Gleis", 120, 104);
});
export const HDPlatform: React.FC<{ z: number; len: number; t?: number }> = ({ z, len }) => (
  <group position={[0, 0, z]}>
    <mesh position={[6.2, 0.38, 0]} receiveShadow castShadow><boxGeometry args={[8.2, 0.76, len]} /><meshStandardMaterial map={concrete(len)} roughness={0.9} /></mesh>
    <Box p={[2.3, 0.766, 0]} s={[0.14, 0.01, len]} color="#F4F4F2" cast={false} />
    <Box p={[2.85, 0.767, 0]} s={[0.4, 0.01, len]} color="#E2C24A" rough={0.7} cast={false} />
    {/* canopy */}
    <mesh position={[6.6, 5.9, 0]} castShadow receiveShadow><boxGeometry args={[7.6, 0.35, len]} /><meshStandardMaterial color="#8E949A" roughness={0.7} /></mesh>
    <mesh position={[6.6, 6.2, 0]}><boxGeometry args={[7.8, 0.25, len]} /><meshStandardMaterial color="#9EA4AA" roughness={0.4} metalness={0.5} /></mesh>
    {Array.from({ length: Math.floor(len / 14) }, (_, i) => {
      const zz = len / 2 - 7 - i * 14;
      return (
        <group key={i}>
          <mesh position={[7.4, 3.3, zz]} castShadow><cylinderGeometry args={[0.16, 0.18, 5.1, 16]} /><meshStandardMaterial color="#E8EAEC" roughness={0.4} metalness={0.3} /></mesh>
          <Box p={[5.2, 5.69, zz]} s={[0.4, 0.05, 3]} color="#fff" emissive="#FFF6E8" ei={0.8} cast={false} />
          {i % 2 === 0 && <mesh position={[5.0, 4.6, zz + 3]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.5, 0.47]} /><meshStandardMaterial map={signTex} emissiveMap={signTex} emissive="#fff" emissiveIntensity={0.25} side={THREE.DoubleSide} /></mesh>}
          {i % 3 === 1 && <group position={[8.4, 0.76, zz - 4]}><Box p={[0, 0.45, 0]} s={[0.5, 0.06, 2]} color="#6B4A2E" /><Box p={[0, 0.22, -0.8]} s={[0.4, 0.44, 0.08]} color="#3A3F46" /><Box p={[0, 0.22, 0.8]} s={[0.4, 0.44, 0.08]} color="#3A3F46" /></group>}
        </group>
      );
    })}
    <Box p={[10.4, 1.7, 0]} s={[0.2, 1.9, len]} color="#9AA0A6" rough={0.5} cast={false} />
  </group>
);
// distant city blocks for depth behind the station
export const Skyline: React.FC<{ z: number; x0: number }> = ({ z, x0 }) => (
  <>
    {Array.from({ length: 34 }, (_, i) => {
      const h = 12 + rnd(i * 3) * 46; const w = 14 + rnd(i * 5) * 22;
      return <Box key={i} p={[x0 + rnd(i * 7) * 160, h / 2, z - i * 32 - rnd(i) * 20]} s={[w, h, 18 + rnd(i * 9) * 20]} color={["#C9C2B6", "#B9B4AC", "#D6D0C6", "#A9A39A"][i % 4]} rough={0.9} cast={false} />;
    })}
  </>
);
const DayStation: React.FC<{ at?: V3; span?: number; elev?: number; az?: number }> = ({ at = [3, 0, -10], span = 45, elev = 22, az = 235 }) => (
  <>
    <SkyDome elev={elev} az={az} fog={[120, 1600]} />
    <Env intensity={0.55} />
    <hemisphereLight args={["#DDE8F6", "#6A6450", 0.7]} />
    <Sun elev={elev} az={az} at={at} span={span} intensity={2.8} />
    <Ground />
  </>
);

// ---------- scenes ----------
export const HookHD: React.FC<{ t: number }> = ({ t }) => (
  <>
    <DayStation at={[4, 0, -20]} span={55} />
    <HDTrack z={-150} len={420} />
    <HDTrack z={-150} len={420} x={-5.2} />
    <HDPlatform z={-70} len={196} />
    <IceTrain z0={12} n={12} />
    <Crowd n={120} z0={4} len={110} t={t} />
    <Skyline z={-120} x0={30} />
    <Trees n={40} x={[-14, -60]} z={[-40, -500]} side={1} seed={3} />
    <Cam pos={[7.8 - t * 0.2, 2.6 + t * 0.05, 16 - t * 1.6]} look={[0.6, 2.4, -40]} fov={40} far={2500} />
  </>
);
// beside the train in open land, pulling back to aerial
export const SideHD: React.FC<{ t: number; pull: number }> = ({ t, pull }) => {
  const k = ease(pull);
  return (
    <>
      <SkyDome elev={20} az={240} fog={[150, lerp(1400, 3000, k)]} />
      <Env intensity={0.55} />
      <hemisphereLight args={["#DDE8F6", "#5A6440", 0.7]} />
      <Sun elev={20} az={240} at={lerp3([0, 0, -20], [0, 0, -150], k)} span={lerp(40, 260, k)} />
      <Ground />
      <HDTrack z={-500} len={1400} />
      <IceTrain z0={14 + t * 3} n={52} simpleAfter={8} />
      <Trees n={160} x={[16, 260]} z={[60, -1300]} seed={5} />
      <Cam pos={lerp3([14, 2.6, 2], [70, 46, 60], k)} look={lerp3([0, 2.6, -16], [0, 0, -220], k)} fov={lerp(38, 42, k)} far={3000} />
    </>
  );
};
// fields patchwork for aerials
const FIELD = ["#7C9A4E", "#A8A55A", "#6E8C44", "#C2B36A", "#8BA65A", "#9C8A54"];
const Fields: React.FC<{ night?: boolean }> = ({ night }) => (
  <>
    {Array.from({ length: 140 }, (_, i) => {
      const w = 90 + rnd(i * 3) * 160, d = 80 + rnd(i * 5) * 200;
      const x = (rnd(i * 7) - 0.5) * 2200, z = 200 - rnd(i * 11) * 3800;
      return <mesh key={i} position={[x, 0.02 + (i % 5) * 0.01, z]} rotation={[-Math.PI / 2, 0, rnd(i) * 0.4]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial color={night ? "#141A12" : FIELD[i % FIELD.length]} roughness={1} /></mesh>;
    })}
  </>
);
export const LongHD: React.FC<{ t: number; night?: boolean; up?: number }> = ({ t, night, up = 0 }) => {
  const n = 150;
  return (
    <>
      {night
        ? <><BgNight /><hemisphereLight args={["#2A3550", "#05060A", 0.35]} /><directionalLight position={[300, 400, 200]} intensity={0.25} color="#9AB0FF" /></>
        : <><SkyDome elev={14} az={250} fog={[300, 4200]}  /><Env intensity={0.5} /><hemisphereLight args={["#DDE8F6", "#5A6440", 0.65]} /><Sun elev={14} az={250} at={[curveX(-300), 0, -300]} span={420} intensity={2.4} /></>}
      <Ground size={8000} z={-1500} night={night} />
      {!night && <Fields />}
      <Trees n={360} x={[14, 900]} z={[200, -3800]} seed={9} s={1.4} />
      {Array.from({ length: n }, (_, i) => {
        const z = -i * P * 0.98; const x = curveX(z); const ang = Math.atan((curveX(z - 1) - x) / -1);
        return (
          <group key={i} position={[x, 0, 0]} rotation={[0, -ang, 0]}>
            <IceCar z={z} simple night={night} nose={i === 0 ? 1 : 0} />
            <mesh position={[0, 0.12, z]}><boxGeometry args={[4.4, 0.24, P]} /><meshStandardMaterial color={night ? "#15130F" : "#8A8178"} roughness={1} /></mesh>
          </group>
        );
      })}
      <Cam pos={[curveX(60) + 40, 26 + up * t * 6 + t * 1.5, 70 + t * 4]} look={[curveX(-300), 0, -300 - t * 20]} fov={44} far={5000} />
    </>
  );
};
const BgNight: React.FC = () => <SkyDome elev={-6} az={250} fog={[200, 2400]} haze="#141C30" zenith="#03050C" glow="#203050" exposure={0.9} />;

export const BoardHD: React.FC<{ t: number; rows: [string, string, string, string][]; ticker: string }> = ({ t, rows, ticker }) => (
  <>
    <DayStation at={[5, 0, 0]} span={30} />
    <HDTrack z={-60} len={260} />
    <HDPlatform z={-30} len={140} />
    <IceTrain z0={-6} n={6} />
    <Crowd n={30} z0={-2} len={60} t={t} />
    <Board p={[5.2, 4.0, 2]} t={t} w={5.2} rows={rows} ticker={ticker} />
    <Box p={[5.2, 5.3, 2]} s={[0.12, 0.8, 0.12]} color="#5B5F64" />
    <Cam pos={[5.0 + Math.sin(t * 0.4) * 0.3, 3.2, 12.5 - t * 0.35]} look={[5.2, 3.8, 2]} fov={42} />
  </>
);
export const WalkHD: React.FC<{ t: number }> = ({ t }) => {
  const z = -t * 2.2;
  return (
    <>
      <DayStation at={[4, 0, z - 10]} span={35} />
      <HDTrack z={-200} len={500} />
      <HDPlatform z={-150} len={420} />
      <IceTrain z0={8} n={16} />
      <Person p={[3.6, 0.76, z]} ry={Math.PI} shirt="#4F6D7A" pose={{ walk: t * 7, armL: Math.sin(t * 7) * 0.35, armR: -Math.sin(t * 7) * 0.35 }} />
      <Box p={[3.85, 1.9, z + 0.18]} s={[0.32, 0.45, 0.18]} color="#3A3A3A" />
      <Cam pos={[6.4, 2.3, z + 5.5]} look={[2.6, 1.6, z - 20]} fov={42} />
    </>
  );
};
export const DoorHD: React.FC<{ t: number; close: number }> = ({ t, close }) => {
  const d = 1 - inOut((t - close) / 0.9);
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <DayStation at={[2, 0, -8]} span={18} />
      <HDTrack z={-60} len={180} />
      <HDPlatform z={-40} len={120} />
      <IceCar z={-L / 2 - 2} doorOpen={d} />
      <IceCar z={-L / 2 - 2 - P} />
      <IceCar z={-L / 2 - 2 + P} />
      <mesh position={[HW + 0.05, 3.15, -2 - 1.8]}><sphereGeometry args={[0.06, 12, 10]} /><meshStandardMaterial color="#FF3020" emissive="#FF2010" emissiveIntensity={blink && d > 0.05 ? 8 : 0.2} toneMapped={false} /></mesh>
      <Person p={[4.2, 0.76, -5.2]} ry={-1.9} shirt="#8C6A3E" pose={{ armR: 0.2 }} />
      <Cam pos={[5.2, 1.9, -3.8 + 4.6 - t * 0.12]} look={[1.4, 2.0, -3.8 - 0.4]} fov={38} />
    </>
  );
};
// Lok meets the tail of its own train
export const NoseHD: React.FC<{ t: number; reveal: number }> = ({ t, reveal }) => {
  const k = inOut((t - reveal + 0.3) / 1.6);
  const gap = 5.5;
  return (
    <>
      <SkyDome elev={16} az={200} fog={[120, 1600]} />
      <Env intensity={0.55} />
      <hemisphereLight args={["#DDE8F6", "#5A6440", 0.6]} />
      <Sun elev={16} az={200} at={[0, 0, 0]} span={40} intensity={2.4} />
      <pointLight position={[0, 1.6, -1.2]} intensity={k * 8} distance={6} color="#FF2A10" />
      <Ground />
      <HDTrack z={0} len={900} />
      <Trees n={120} x={[14, 300]} z={[300, -500]} seed={4} />
      {/* our Lok heading -z: front unit, nose at z = gap/2 pointing -z */}
      <group rotation={[0, Math.PI, 0]}><IceTrain z0={-gap / 2} n={4} /></group>
      {/* our own last car ahead, tail nose pointing +z at -gap/2 */}
      <IceCar z={-gap / 2 - NL - L / 2} nose={1} tail />
      <IceCar z={-gap / 2 - NL - L / 2 - P} />
      <IceCar z={-gap / 2 - NL - L / 2 - 2 * P} />
      <Cam pos={lerp3([9, 3.2, 26], [4, 15, 19], k)} look={lerp3([0, 2.2, 4], [0, 1.2, -3], k)} fov={lerp(34, 40, k)} />
    </>
  );
};
export const SignalHD: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SkyDome elev={6} az={280} fog={[100, 1400]} exposure={0.7} />
    <Env intensity={0.45} />
    <hemisphereLight args={["#C8D4EA", "#4A4A3A", 0.5]} />
    <Sun elev={6} az={280} at={[0, 0, -10]} span={30} intensity={2.2} color="#FFC890" />
    <Ground />
    <HDTrack z={-100} len={500} />
    <Trees n={80} x={[12, 200]} z={[60, -500]} seed={6} />
    <group rotation={[0, Math.PI, 0]}><IceTrain z0={10} n={3} /></group>
    <group position={[-2.8, 0, -12]}>
      <mesh material={steel} position={[0, 2.6, 0]}><cylinderGeometry args={[0.1, 0.12, 5.2, 12]} /></mesh>
      <Box p={[0, 5.4, 0.1]} s={[0.7, 1.5, 0.25]} color="#141618" />
      <mesh position={[0, 5.75, 0.25]}><sphereGeometry args={[0.19, 20, 14]} /><meshStandardMaterial color="#FF2A20" emissive="#FF0A00" emissiveIntensity={2.2} /></mesh>
      <mesh position={[0, 5.2, 0.25]}><sphereGeometry args={[0.19, 20, 14]} /><meshStandardMaterial color="#1A3A1A" /></mesh>
    </group>
    <Cam pos={[-5.4 - t * 0.05, 3.0, 4 - t * 0.4]} look={[-2.4, 4.6, -12]} fov={38} />
  </>
);
