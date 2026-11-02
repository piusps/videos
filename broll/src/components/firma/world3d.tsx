// Firma series engine — 3D building blocks (room, lamps, mascot, props, object catalog). Look = Tag 1 v7.
import React from "react";
import * as THREE from "three";
import { canvasTex, roundRect } from "../Voxel3D";
import { SKC, V3, cl, ease, back, bump, rnd, drawBotLogo, PrintMachine } from "../ShirtWorld3D";
import { Plate3D } from "../FirmaFX3D";
import { dieCut, centerText, GOLD, GREEN } from "./draw";
import type { ObjKind } from "./schema";

export const pop = (t: number, a: number, d = 0.35) => Math.max(0.001, Math.min(1.15, back((t - a) / d)));

// ---------- static textures shared by every episode ----------
export const useBaseTex = (ready: boolean) => React.useMemo(() => {
  if (!ready) return null;
  const floor = canvasTex(1024, 1024, (c) => {
    c.fillStyle = "#3B2416"; c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 8; i++) {
      const y = i * 128;
      c.fillStyle = i % 2 ? "#432A1A" : "#382214"; c.fillRect(0, y, 1024, 124);
      c.fillStyle = "rgba(0,0,0,.45)"; c.fillRect(0, y + 124, 1024, 4);
      for (let k = 0; k < 3; k++) { const x = ((i * 397 + k * 331) % 1024); c.fillRect(x, y, 4, 124); }
      for (let k = 0; k < 14; k++) { c.fillStyle = `rgba(255,220,180,${0.03 + rnd(i * 31 + k) * 0.04})`; c.fillRect(rnd(i * 7 + k) * 1024, y + 10 + rnd(k + i) * 100, 120 + rnd(k * 3 + i) * 200, 3); }
    }
  });
  floor.wrapS = floor.wrapT = THREE.RepeatWrapping; floor.repeat.set(12, 6);
  const wall = canvasTex(1024, 1024, (c) => {
    c.fillStyle = "#18223D"; c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#1A2542" : "#172039"; c.fillRect(i * 128, 0, 124, 1024); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(i * 128 + 124, 0, 4, 1024); }
    c.fillStyle = "#121A30"; c.fillRect(0, 700, 1024, 324);
    c.fillStyle = "#2A3760"; c.fillRect(0, 690, 1024, 16);
  });
  wall.wrapS = wall.wrapT = THREE.RepeatWrapping; wall.repeat.set(14, 1);
  const glow = canvasTex(512, 512, (c) => {
    const g = c.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, "rgba(255,140,70,.95)"); g.addColorStop(0.45, "rgba(255,107,53,.45)"); g.addColorStop(1, "rgba(255,107,53,0)");
    c.fillStyle = g; c.fillRect(0, 0, 512, 512);
  });
  const shirtLogo = canvasTex(256, 256, (c) => { c.clearRect(0, 0, 256, 256); drawBotLogo(c, 128, 128, 96); });
  const bubbleQ = canvasTex(512, 400, (c) => { dieCut(c, 10, 10, 492, 360, 150, "#FFFFFF", 0); centerText(c, "?", 256, 196, 260, 300, SKC.OR); });
  const coin = canvasTex(256, 256, (c) => { c.clearRect(0, 0, 256, 256); c.fillStyle = "#B8862B"; c.beginPath(); c.arc(128, 128, 120, 0, 7); c.fill(); c.fillStyle = GOLD; c.beginPath(); c.arc(128, 128, 100, 0, 7); c.fill(); centerText(c, "€", 128, 136, 130, 160, "#7A5414"); });
  const screen = canvasTex(512, 320, (c) => {
    c.fillStyle = "#F6F1E8"; c.fillRect(0, 0, 512, 320);
    c.fillStyle = SKC.OR; roundRect(c, 30, 30, 120, 26, 13); c.fill();
    c.fillStyle = "#D8D0C2"; [80, 120, 160, 200].forEach((y, i) => { roundRect(c, 30, y, 452 - i * 60, 18, 9); c.fill(); });
    c.fillStyle = SKC.OR; roundRect(c, 30, 250, 160, 44, 22); c.fill();
  });
  return { floor, wall, glow, shirtLogo, bubbleQ, coin, screen };
}, [ready]);
export type BaseTex = NonNullable<ReturnType<typeof useBaseTex>>;

export const Room: React.FC<{ tex: BaseTex }> = ({ tex }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[160, 60]} />
      <meshStandardMaterial map={tex.floor} roughness={0.55} metalness={0.05} />
    </mesh>
    <mesh position={[0, 7, -5]} receiveShadow>
      <planeGeometry args={[160, 14]} />
      <meshStandardMaterial map={tex.wall} roughness={0.85} />
    </mesh>
  </group>
);

export const Lamp: React.FC<{ p: V3; t: number; seed?: number; i?: number; r?: number; on?: number }> = ({ p, t, seed = 0, i = 26, r = 13, on = 1 }) => {
  const sw = 0.03 * Math.sin(t * 0.9 + seed);
  return (
    <group position={p} rotation={[0, 0, sw]}>
      <mesh position={[0, 3, 0]}><cylinderGeometry args={[0.02, 0.02, 6, 6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.12, 0]}><coneGeometry args={[0.55, 0.5, 24, 1, true]} /><meshStandardMaterial color="#1E2233" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.08, 0]}><sphereGeometry args={[0.2, 16, 12]} /><meshBasicMaterial color={on > 0.3 ? "#FFE2B0" : "#3A342A"} toneMapped={false} /></mesh>
      {on > 0.01 && <pointLight position={[0, -0.4, 0]} intensity={i * on} distance={r} decay={1.6} color="#FFC07A" />}
    </group>
  );
};

// optional per-episode multiplier for the glow-ring point light (episode.ringLight, default 1 = unchanged; Folge 18: face wash-out)
export const RING = { light: 1 };
export const GlowRing: React.FC<{ p: V3; r: number; t: number; tex: THREE.Texture; k?: number; col?: string }> = ({ p, r, t, tex, k = 1, col = "#FF7A3D" }) => (
  <group position={p}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[r * 3.2, r * 3.2]} />
      <meshBasicMaterial map={tex} transparent opacity={0.55 * k} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
    </mesh>
    {[1, 1.22].map((m, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, t * (i ? -0.4 : 0.6)]} position={[0, 0.04 + i * 0.01, 0]}>
        <torusGeometry args={[r * m, 0.035 + 0.015 * i, 8, 96]} />
        <meshBasicMaterial color={col} toneMapped={false} transparent opacity={(0.9 - 0.35 * i) * k * (0.85 + 0.15 * Math.sin(t * 4 + i))} />
      </mesh>
    ))}
    <pointLight position={[0, 0.5, 0.6]} intensity={9 * k * RING.light} distance={6} color={col} />
  </group>
);

// ---------- mascot ----------
export type Eyes = { mode: "open" | "blink" | "happy" | "glow" | "think" | "wow"; lx?: number; ly?: number };
export type Pal = { body: string; dark: string; line: string; blush: string };
export const ORANGE_PAL: Pal = { body: "#E87A55", dark: "#C55E3C", line: "#2A1610", blush: "#FF9C9C" };
export const BLUE_PAL: Pal = { body: "#4F7FE0", dark: "#3459AD", line: "#0F1A38", blush: "#FFB0C8" };
export const Out: React.FC<{ size: V3; p?: V3; color: string; line: string; o?: number; rough?: number }> = ({ size, p = [0, 0, 0], color, line, o = 0.05, rough = 0.5 }) => (
  <group position={p}>
    <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={rough} /></mesh>
    <mesh><boxGeometry args={[size[0] + o * 2, size[1] + o * 2, size[2] + o * 2]} /><meshBasicMaterial color={line} side={THREE.BackSide} /></mesh>
  </group>
);
export const Bot: React.FC<{
  p: V3; t: number; s?: number; yaw?: number; pitch?: number; pal?: Pal; eyes: Eyes; armL?: number; armR?: number; hop?: number; squash?: number;
  hold?: React.ReactNode; seed?: number;
}> = ({ p, t, s = 1, yaw = 0, pitch = 0, pal = ORANGE_PAL, eyes, armL = 10, armR = 10, hop = 0, squash = 0, hold, seed = 0 }) => {
  const BW = 1.7, BH = 1.25, BD = 1.15;
  const breathe = 0.025 * Math.sin(t * 2.6 + seed);
  const sy = 1 - 0.18 * squash + breathe, sx = 1 + 0.12 * squash - breathe * 0.5;
  const blink = eyes.mode === "open" && (t * 1.1 + seed * 0.37 + 1.5) % 3.3 < 0.08;
  const mode = blink ? "blink" : eyes.mode;
  const lx = eyes.lx ?? 0, ly = eyes.ly ?? 0;
  const fz = BD / 2 + 0.012;
  const eye = (side: -1 | 1) => {
    const x = side * 0.38 + lx * 0.12, y = 0.72 + ly * 0.1;
    if (mode === "happy") {
      return (
        <group key={side} position={[x, y, fz]}>
          <mesh position={[-0.07, -0.02, 0]} rotation={[0, 0, 0.75]}><boxGeometry args={[0.2, 0.065, 0.02]} /><meshBasicMaterial color="#120A08" /></mesh>
          <mesh position={[0.07, -0.02, 0]} rotation={[0, 0, -0.75]}><boxGeometry args={[0.2, 0.065, 0.02]} /><meshBasicMaterial color="#120A08" /></mesh>
        </group>
      );
    }
    if (mode === "glow") {
      return (
        <group key={side} position={[x, y, fz]}>
          <mesh position={[0, 0, -0.002]}><boxGeometry args={[0.26, 0.4, 0.015]} /><meshBasicMaterial color="#120A08" /></mesh>
          <mesh><boxGeometry args={[0.16, 0.3, 0.02]} /><meshBasicMaterial color="#FFE9A8" /></mesh>
        </group>
      );
    }
    const hgt = mode === "blink" ? 0.04 : mode === "wow" ? 0.4 : 0.32;
    const wid = mode === "wow" ? 0.2 : 0.16;
    return (
      <group key={side} position={[x, y, fz]}>
        <mesh><boxGeometry args={[wid, hgt, 0.02]} /><meshBasicMaterial color="#120A08" /></mesh>
        {mode !== "blink" && <mesh position={[-wid * 0.22, hgt * 0.26, 0.012]}><boxGeometry args={[wid * 0.36, wid * 0.36, 0.01]} /><meshBasicMaterial color="#FFFFFF" toneMapped={false} /></mesh>}
      </group>
    );
  };
  const arm = (side: -1 | 1, deg: number) => (
    <group position={[side * (BW / 2 + 0.02), 0.62, 0.05]} rotation={[0, 0, (side * deg * Math.PI) / 180]}>
      <Out size={[0.26, 0.5, 0.36]} p={[side * 0.13, -0.18, 0]} color={pal.dark} line={pal.line} o={0.04} />
    </group>
  );
  return (
    <group position={[p[0], p[1] + hop, p[2]]} rotation={[pitch, yaw, 0]} scale={[s * sx, s * sy, s]}>
      {[-0.52, -0.18, 0.18, 0.52].map((x, i) => (
        <Out key={x} size={[0.2, 0.26, 0.3]} p={[x, 0.13 + (hop > 0.02 ? 0 : 0.015 * Math.sin(t * 9 + i)), 0.05]} color={pal.dark} line={pal.line} o={0.035} />
      ))}
      <Out size={[BW, BH, BD]} p={[0, 0.26 + BH / 2, 0]} color={pal.body} line={pal.line} o={0.05} rough={0.42} />
      <mesh position={[0, 0.26 + BH + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[BW * 0.92, BD * 0.9]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.12} /></mesh>
      <group position={[0, 0.26, 0]}>
        {eye(-1)}{eye(1)}
        {mode !== "glow" && [-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.58, 0.46, fz]}><boxGeometry args={[0.2, 0.08, 0.01]} /><meshBasicMaterial color={pal.blush} transparent opacity={0.85} /></mesh>
        ))}
      </group>
      {arm(-1, armL)}
      {arm(1, armR)}
      {mode === "glow" && <pointLight position={[0, 1.0, 1.4]} intensity={2.5} distance={3} color="#FFD58A" />}
      {hold}
    </group>
  );
};

// ---------- hook props ----------
export const Chair: React.FC<{ p: V3; rot: number }> = ({ p, rot }) => (
  <group position={p} rotation={[0, rot, 0]}>
    {[0, 1, 2, 3, 4].map((k) => (
      <group key={k} rotation={[0, (k * 2 * Math.PI) / 5, 0]}>
        <mesh position={[0.3, 0.1, 0]}><boxGeometry args={[0.6, 0.07, 0.1]} /><meshStandardMaterial color="#1A1F30" /></mesh>
        <mesh position={[0.58, 0.05, 0]}><sphereGeometry args={[0.06, 8, 6]} /><meshStandardMaterial color="#0E1220" /></mesh>
      </group>
    ))}
    <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.05, 0.05, 0.75, 10]} /><meshStandardMaterial color="#9AA0B0" metalness={0.7} roughness={0.3} /></mesh>
    <Out size={[0.95, 0.16, 0.9]} p={[0, 0.9, 0]} color="#3A4A73" line={SKC.INK} o={0.035} />
    <Out size={[0.95, 1.0, 0.16]} p={[0, 1.5, -0.42]} color="#3A4A73" line={SKC.INK} o={0.035} />
  </group>
);
export const Lever: React.FC<{ p: V3; a: number }> = ({ p, a }) => (
  <group position={p}>
    <Out size={[0.62, 1.0, 0.5]} p={[0, 0.5, 0]} color="#2B3350" line={SKC.INK} o={0.04} />
    <mesh position={[0, 0.72, 0.26]}><boxGeometry args={[0.44, 0.12, 0.02]} /><meshBasicMaterial color={GOLD} toneMapped={false} /></mesh>
    <group position={[0, 1.0, 0]} rotation={[0, 0, a]}>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.05, 0.05, 0.9, 10]} /><meshStandardMaterial color="#C8CCD8" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 0.95, 0]} castShadow><sphereGeometry args={[0.18, 18, 14]} /><meshStandardMaterial color="#E5484D" roughness={0.35} /></mesh>
    </group>
  </group>
);
// the empty box of the "heute fehlt X" moment: rattles, lid flies off, dust + moth
export const CardBox: React.FC<{ p: V3; hk: number; rattleAt: number; lidAt: number }> = ({ p, hk, rattleAt, lidAt }) => {
  const r = hk - rattleAt;
  const rattle = r > 0 && hk < lidAt ? 0.07 * Math.sin(r * 46) : 0;
  const u = cl((hk - lidAt) / 0.55);
  return (
    <group position={p} rotation={[0, 0.35, rattle]}>
      <Out size={[1.25, 0.95, 1.1]} p={[0, 0.475, 0]} color="#C99A6B" line={SKC.INK} o={0.04} rough={0.9} />
      <mesh position={[0, 0.5, 0.556]}><boxGeometry args={[0.22, 0.95, 0.01]} /><meshStandardMaterial color="#E2C79C" roughness={0.6} /></mesh>
      <mesh position={[0, 0.953, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.18, 1.03]} /><meshBasicMaterial color="#20150C" /></mesh>
      {u < 1 && (
        <group position={[-1.6 * u, 1.0 + 4.2 * u - 1.4 * u * u + (rattle !== 0 ? Math.abs(rattle) * 0.8 : 0), -0.6 * u]} rotation={[-2.6 * u, 0, 1.6 * u]}>
          <Out size={[1.32, 0.1, 1.17]} color="#B88A5C" line={SKC.INK} o={0.035} rough={0.9} />
          <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.22, 1.17]} /><meshStandardMaterial color="#E2C79C" /></mesh>
        </group>
      )}
    </group>
  );
};
export const Moth: React.FC<{ p: V3; hk: number; at: number }> = ({ p, hk, at }) => {
  const u = hk - at;
  if (u < 0 || u > 3) return null;
  const f = 0.9 * Math.sin(u * 50);
  const pos: V3 = [p[0] + 0.45 * Math.sin(u * 5) + 0.5 * u, p[1] + 0.2 + 1.5 * u, p[2] + 0.3 * Math.cos(u * 4)];
  return (
    <group position={pos} rotation={[0.5, 0.4 * Math.sin(u * 3), 0]} scale={1.5}>
      <mesh><boxGeometry args={[0.07, 0.07, 0.24]} /><meshStandardMaterial color="#5B5246" /></mesh>
      {[-1, 1].map((sd) => (
        <group key={sd} rotation={[0, 0, sd * f]}>
          <mesh position={[sd * 0.15, 0, 0]}><boxGeometry args={[0.26, 0.012, 0.22]} /><meshStandardMaterial color="#D6CBB2" side={THREE.DoubleSide} /></mesh>
        </group>
      ))}
    </group>
  );
};

// ---------- floor arrows ----------
export const pathLen = (pts: V3[]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[2] - pts[i][2]), 0);
export const pathAt = (pts: V3[], d: number): { p: V3; yaw: number } => {
  let i = 0;
  const seg = (k: number) => Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][2] - pts[k][2]);
  while (i < pts.length - 2 && d > seg(i)) { d -= seg(i); i++; }
  const a = pts[i], b = pts[i + 1], u = Math.max(0, Math.min(1, d / seg(i)));
  return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u], yaw: Math.atan2(b[0] - a[0], b[2] - a[2]) };
};
export const Arrow3D: React.FC<{ pts: V3[]; k: number; t: number; col?: string }> = ({ pts, k, t, col = SKC.OR }) => {
  if (k <= 0.001) return null;
  const L = pathLen(pts), shown = L * Math.min(1, k), step = 0.34;
  const n = Math.floor(L / step);
  const head = pathAt(pts, Math.max(0.01, shown));
  const pulseD = k >= 1 ? ((t * 2.4) % (L + 0.6)) : -1;
  return (
    <group>
      {Array.from({ length: n }).map((_, j) => {
        const d = j * step + 0.12;
        if (d > shown - 0.3) return null;
        const q = pathAt(pts, d);
        const lit = pulseD >= 0 && Math.abs(d - pulseD) < 0.45 ? 1 : 0;
        return (
          <mesh key={j} position={[q.p[0], 0.06, q.p[2]]} rotation={[0, q.yaw, 0]}>
            <boxGeometry args={[0.16, 0.05, 0.2]} />
            <meshBasicMaterial color={lit ? "#FFF3D6" : col} toneMapped={false} />
          </mesh>
        );
      })}
      <group position={[head.p[0], 0.08, head.p[2]]} rotation={[0, head.yaw, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.26, 0.42, 3]} /><meshBasicMaterial color={col} toneMapped={false} /></mesh>
      </group>
    </group>
  );
};

// ---------- object catalog ----------
export const ShirtUp: React.FC<{ p: V3; s?: number; rot?: V3; logo: THREE.Texture }> = ({ p, s = 1, rot = [0, 0, 0], logo }) => (
  <group position={p} rotation={rot} scale={s}>
    <Out size={[1.0, 1.15, 0.1]} color="#F2F0EA" line={SKC.INK} o={0.035} rough={0.9} />
    <group position={[-0.62, 0.36, 0]} rotation={[0, 0, 0.7]}><Out size={[0.42, 0.34, 0.1]} color="#E6E2D8" line={SKC.INK} o={0.035} rough={0.9} /></group>
    <group position={[0.62, 0.36, 0]} rotation={[0, 0, -0.7]}><Out size={[0.42, 0.34, 0.1]} color="#E6E2D8" line={SKC.INK} o={0.035} rough={0.9} /></group>
    <mesh position={[0, 0.54, 0.056]}><boxGeometry args={[0.36, 0.08, 0.01]} /><meshStandardMaterial color={SKC.OR} /></mesh>
    <mesh position={[0, 0.02, 0.058]}><planeGeometry args={[0.6, 0.6]} /><meshStandardMaterial map={logo} transparent /></mesh>
  </group>
);
export const Shop: React.FC<{ p: V3; s: number; logo: THREE.Texture; hop?: number }> = ({ p, s, logo, hop = 0 }) => (
  <group position={[p[0], p[1] + hop, p[2]]} scale={[s * (1 + 0.1 * hop), s * (1 - 0.1 * hop), s]} rotation={[0, 0.15, 0]}>
    <Out size={[1.7, 1.25, 1.2]} p={[0, 0.625, 0]} color="#EDE6D8" line={SKC.INK} o={0.04} rough={0.8} />
    <Out size={[1.9, 0.18, 1.4]} p={[0, 1.34, 0]} color="#3A4A73" line={SKC.INK} o={0.035} />
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} position={[-0.71 + i * 0.284, 1.05, 0.72]} rotation={[0.55, 0, 0]}><boxGeometry args={[0.28, 0.05, 0.42]} /><meshStandardMaterial color={i % 2 ? "#FFFFFF" : SKC.OR} /></mesh>
    ))}
    <mesh position={[-0.48, 0.38, 0.61]}><boxGeometry args={[0.42, 0.74, 0.02]} /><meshStandardMaterial color="#2A1C14" /></mesh>
    <mesh position={[0.36, 0.5, 0.61]}><boxGeometry args={[0.62, 0.42, 0.02]} /><meshBasicMaterial color="#9FD8F0" /></mesh>
    <Plate3D w={0.9} h={0.9} d={0.06} r={0.45} tex={logo} body="#FFFFFF" glow={0.2} p={[0, 1.95, 0.1]} rot={[-0.35, 0, 0]} />
  </group>
);
export const Parcel: React.FC<{ p: V3; s: number; lid: number; yaw?: number }> = ({ p, s, lid, yaw = 0 }) => (
  <group position={p} scale={s} rotation={[0, yaw, 0]}>
    <Out size={[1.0, 0.72, 0.85]} p={[0, 0.36, 0]} color="#C99A6B" line={SKC.INK} o={0.035} rough={0.9} />
    <mesh position={[0, 0.725, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.94, 0.79]} /><meshBasicMaterial color="#20150C" /></mesh>
    {[-1, 1].map((sd) => (
      <group key={sd} position={[0, 0.73, sd * 0.425]} rotation={[sd * (1 - lid) * 2.0, 0, 0]}>
        <Out size={[1.0, 0.05, 0.425]} p={[0, 0, -sd * 0.2125]} color="#B88A5C" line={SKC.INK} o={0.025} rough={0.9} />
      </group>
    ))}
    {lid > 0.95 && <mesh position={[0, 0.765, 0]}><boxGeometry args={[0.2, 0.012, 0.86]} /><meshStandardMaterial color="#E2C79C" /></mesh>}
    <mesh position={[0.22, 0.42, 0.428]}><boxGeometry args={[0.36, 0.24, 0.01]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
  </group>
);
export const Laptop: React.FC<{ p: V3; s?: number; screen: THREE.Texture; yaw?: number }> = ({ p, s = 1, screen, yaw = 0 }) => (
  <group position={p} scale={s} rotation={[0, yaw, 0]}>
    <Out size={[1.6, 0.08, 1.05]} p={[0, 0.04, 0]} color="#C8CCD8" line={SKC.INK} o={0.03} rough={0.4} />
    <group position={[0, 0.08, -0.5]} rotation={[-0.25, 0, 0]}>
      <Out size={[1.6, 1.0, 0.07]} p={[0, 0.5, 0]} color="#C8CCD8" line={SKC.INK} o={0.03} rough={0.4} />
      <mesh position={[0, 0.5, 0.04]}><planeGeometry args={[1.44, 0.86]} /><meshBasicMaterial map={screen} toneMapped={false} /></mesh>
    </group>
  </group>
);
export const Phone: React.FC<{ p: V3; s?: number; screen: THREE.Texture; yaw?: number }> = ({ p, s = 1, screen, yaw = 0 }) => (
  <group position={p} scale={s} rotation={[0, yaw, 0]}>
    <Out size={[0.62, 1.2, 0.08]} p={[0, 0.6, 0]} color="#1E2233" line={SKC.INK} o={0.03} rough={0.4} />
    <mesh position={[0, 0.6, 0.045]}><planeGeometry args={[0.52, 1.02]} /><meshBasicMaterial map={screen} toneMapped={false} /></mesh>
  </group>
);
export const Coins: React.FC<{ p: V3; s?: number; tex: THREE.Texture; n?: number; t: number }> = ({ p, s = 1, tex, n = 5, t }) => (
  <group position={p} scale={s}>
    {Array.from({ length: n }).map((_, i) => (
      <group key={i} position={[(i % 2) * 0.08 - 0.04, 0.06 + i * 0.12, 0]} rotation={[0, i * 0.7 + 0.1 * Math.sin(t * 2), 0]}>
        <mesh castShadow><cylinderGeometry args={[0.42, 0.42, 0.1, 28]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} /></mesh>
        {i === n - 1 && <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.8, 0.8]} /><meshBasicMaterial map={tex} transparent toneMapped={false} /></mesh>}
      </group>
    ))}
  </group>
);
export const Mail: React.FC<{ p: V3; s?: number; yaw?: number }> = ({ p, s = 1, yaw = 0 }) => (
  <group position={p} scale={s} rotation={[0, yaw, 0]}>
    <Out size={[1.3, 0.85, 0.06]} p={[0, 0.6, 0]} color="#FFFFFF" line={SKC.INK} o={0.03} rough={0.8} />
    {[-1, 1].map((sd) => (
      <mesh key={sd} position={[sd * 0.32, 0.78, 0.04]} rotation={[0, 0, sd * 0.58]}><boxGeometry args={[0.78, 0.04, 0.01]} /><meshBasicMaterial color={SKC.INK} /></mesh>
    ))}
    <mesh position={[0, 0.22, 0.04]}><boxGeometry args={[0.3, 0.12, 0.01]} /><meshBasicMaterial color={SKC.OR} /></mesh>
  </group>
);

// one object of the catalog, standing on the floor at p (scale ≈ 1 → about 1.2 m tall)
export const CatalogObj: React.FC<{
  kind: ObjKind; p: V3; t: number; tex: BaseTex; s?: number; logo?: THREE.Texture; lid?: number; running?: boolean; hop?: number; yaw?: number;
  rattleAt?: number; lidAt?: number;
}> = ({ kind, p, t, tex, s = 1, logo, lid = 1, running = true, hop = 0, yaw = 0, rattleAt = 1e9, lidAt = 1e9 }) => {
  switch (kind) {
    case "shop": return <Shop p={p} s={s} logo={logo ?? tex.shirtLogo} hop={hop} />;
    case "printer": return <PrintMachine p={p} t={t} s={0.46 * s} yaw={yaw || -0.3} tint="#E9EEF7" accent="#1C2440" running={running} />;
    case "parcel": return <Parcel p={p} s={s} lid={lid} yaw={yaw || 0.2} />;
    case "shirt": return <ShirtUp p={[p[0], p[1] + 0.75 * s, p[2]]} s={s * 0.9} logo={logo ?? tex.shirtLogo} rot={[0, yaw, 0.05 * Math.sin(t * 2)]} />;
    case "laptop": return <Laptop p={p} s={s} screen={tex.screen} yaw={yaw} />;
    case "phone": return <Phone p={p} s={s} screen={tex.screen} yaw={yaw} />;
    case "coins": return <Coins p={p} s={s} tex={tex.coin} t={t} />;
    case "mail": return <Mail p={p} s={s} yaw={yaw} />;
    case "partnerBot": return <Bot p={p} t={t} s={0.6 * s} yaw={yaw || -0.4} pal={BLUE_PAL} eyes={{ mode: running ? "happy" : "open", lx: -1 }} armL={100 + 25 * Math.sin(t * 7)} armR={40} seed={7} hop={hop} />;
    case "emptyBox": return <CardBox p={p} hk={t} rattleAt={rattleAt} lidAt={lidAt} />;
    case "box":
    default: return <Parcel p={p} s={s} lid={lid} yaw={yaw} />;
  }
};

// mascot hop list → { y, squash }
export const hopAt = (t: number, list: [number, number][]) => list.reduce((a, [s, h]) => {
  const u = (t - s) / 0.42;
  if (u < -0.2 || u > 1.25) return a;
  if (u < 0) return { y: a.y, sq: a.sq + 0.45 * Math.sin((Math.PI * (u + 0.2)) / 0.2) };
  if (u <= 1) return { y: a.y + 4 * h * u * (1 - u), sq: a.sq - 0.3 * (1 - Math.abs(2 * u - 1)) };
  return { y: a.y, sq: a.sq + 0.5 * Math.sin((Math.PI * (u - 1)) / 0.25) };
}, { y: 0, sq: 0 });

export { ease, bump, GREEN };
