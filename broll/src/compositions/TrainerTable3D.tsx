// Step 3 "Der Trick": Sir Token at the head of a toy-3D table, four trainers working on your plan at once.
// claudebyseb "Vorstand" table look, branded on Sir Token + gym.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame, staticFile, Audio, Sequence } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BlockBuddy, CameraRig, ToyBox, canvasTex, plateTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { THEMES, PillCaptions, StepBadge, MiniGrid, Word, pixelFont, Stamp } from "../components/PixelKit";
import { Confetti } from "../components/PixelSir";
import words from "../../public/sirtoken/words.json";

const T0 = 11.0;
const th = THEMES.gym;
const W = 1080, H = 1920;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
type V3 = [number, number, number];

export const TRAINERS = [
  { key: "ATHLETIK", p: [-3.15, 1.62, -6.0] as V3, yaw: Math.PI / 2 - 0.65, color: "#5E8FE0", dark: "#3E62A8", acc: "headband" as const, accent: "#FFFFFF", plate: "#3E7BE0", at: 14.35 },
  { key: "PHYSIO", p: [3.15, 1.62, -6.0] as V3, yaw: -Math.PI / 2 + 0.65, color: "#5CC08A", dark: "#3A8A60", acc: "cross" as const, accent: "#FFFFFF", plate: "#2FA866", at: 15.1 },
  { key: "KRAFT", p: [-3.15, 1.62, -3.0] as V3, yaw: Math.PI / 2 - 0.65, color: "#EE7B4E", dark: "#B4532F", acc: "belt" as const, accent: "#2A2220", plate: "#E0612E", at: 15.6 },
  { key: "EXPLOSIV", p: [3.15, 1.62, -3.0] as V3, yaw: -Math.PI / 2 + 0.65, color: "#F0C04C", dark: "#B88D24", acc: "bolt" as const, accent: "#FF4F6E", plate: "#D9A21C", at: 16.3 },
];
const PLAN: V3 = [0, 1.02, -4.5];

export type TableMode = { t0: number; title: string; glow: string; joins: number[]; done: number; adjust?: [number, number] };
export const MODE_TRICK: TableMode = { t0: 11.0, title: "DER TRICK", glow: "#9DFFC4", joins: TRAINERS.map((x) => x.at), done: 17.05 };
export const MODE_SUNDAY: TableMode = { t0: 28.6, title: "SONNTAG", glow: "#FFD27A", joins: [28.85, 28.97, 29.09, 29.21], done: 31.27, adjust: [30.55, 31.2] };

// cubes exploding out of a point, falling with gravity
const Burst: React.FC<{ at: number; t: number; p: V3; colors: string[]; n?: number; power?: number }> = ({ at, t, p, colors, n = 14, power = 1 }) => {
  const k = t - at;
  if (k < 0 || k > 1.1) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i + at) * 0.6;
        const v = (2.2 + rnd(i * 3 + at) * 2.4) * power;
        const up = 3 + rnd(i * 7 + at) * 3;
        const x = p[0] + Math.cos(a) * v * k, z = p[2] + Math.sin(a) * v * k, y = p[1] + up * k - 6 * k * k;
        const s = 0.16 * (1 - k / 1.1) + 0.04;
        return (
          <mesh key={i} position={[x, Math.max(1.05, y), z]} rotation={[k * 9 + i, k * 7, 0]}>
            <boxGeometry args={[s, s, s]} />
            <meshBasicMaterial color={colors[i % colors.length]} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

// gold coins raining down on the table
const CoinRain: React.FC<{ at: number; t: number }> = ({ at, t }) => {
  const k = t - at;
  if (k < 0 || k > 2.2) return null;
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => {
        const d = rnd(i + 11) * 0.6;
        const kk = k - d;
        if (kk < 0) return null;
        const y = Math.max(1.12, 9 - 9 * kk * kk * 1.6);
        return (
          <mesh key={i} position={[(rnd(i) - 0.5) * 6, y, -8 + rnd(i + 5) * 9]} rotation={[Math.PI / 2 + (y > 1.2 ? kk * 8 : 0), 0, kk * 5 + i]}>
            <cylinderGeometry args={[0.24, 0.24, 0.06, 16]} />
            <meshStandardMaterial color="#F2B92A" metalness={0.6} roughness={0.3} emissive="#7A5208" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </>
  );
};

// soft light cones from the ceiling
const LightCone: React.FC<{ x: number; z: number; t: number; seed: number; color: string }> = ({ x, z, t, seed, color }) => (
  <mesh position={[x + Math.sin(t * 0.7 + seed) * 0.8, 6.5, z]} rotation={[0, 0, Math.sin(t * 0.7 + seed) * 0.12]}>
    <coneGeometry args={[2.2, 11, 24, 1, true]} />
    <meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
  </mesh>
);

const Beam: React.FC<{ a: V3; b: V3; color: string; on: number; t: number; seed: number }> = ({ a, b, color, on, t, seed }) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const end = va.clone().lerp(vb, ease(on));
  const len = va.distanceTo(end);
  if (len < 0.01) return null;
  const mid = va.clone().add(end).multiplyScalar(0.5);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(va).normalize());
  return (
    <>
      <mesh position={mid} quaternion={q}>
        <cylinderGeometry args={[0.035, 0.035, len, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} />
      </mesh>
      <mesh position={mid} quaternion={q}>
        <cylinderGeometry args={[0.11, 0.11, len, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      {on >= 1 && [0, 0.33, 0.66].map((o, i) => {
        const k = (t * 0.9 + o + seed * 0.13) % 1;
        const p = va.clone().lerp(vb, k);
        return (
          <mesh key={i} position={p} rotation={[t * 3, t * 2, 0]}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        );
      })}
    </>
  );
};

const SirToken3D: React.FC<{ t: number; face: THREE.Texture; vis?: number }> = ({ t, face, vis = 1 }) => {
  const hop = Math.abs(Math.sin(t * 3.2)) * 0.12;
  const sway = Math.sin(t * 1.6) * 0.06;
  const wave = Math.sin(t * 7) * 0.35;
  return (
    <group position={[0, 3.4 + hop - (1 - vis) * 3, -9.0]} rotation={[0.05, sway, sway * 0.4]} scale={Math.max(0.001, vis)}>
      {/* coin body */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.55, 48]} />
        <meshStandardMaterial attach="material-0" color="#C98E14" metalness={0.55} roughness={0.35} />
        <meshStandardMaterial attach="material-1" map={face} metalness={0.25} roughness={0.45} />
        <meshStandardMaterial attach="material-2" color="#B07A10" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* rim ridges */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.0, Math.sin(a) * 2.0, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.08, 0.12, 0.5]} />
            <meshStandardMaterial color="#E7B232" metalness={0.5} roughness={0.35} />
          </mesh>
        );
      })}
      {/* top hat */}
      <group position={[0.35, 2.05, 0]} rotation={[0, 0, -0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.25, 1.25, 0.14, 32]} />
          <meshStandardMaterial color="#1D1B20" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.82, 0.86, 1.3, 32]} />
          <meshStandardMaterial color="#232127" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.875, 0.875, 0.24, 32]} />
          <meshStandardMaterial color="#E2AE2E" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      {/* arms with white gloves */}
      <group position={[-2.05, -0.3, 0.1]} rotation={[0, 0, -0.5]}>
        <mesh castShadow position={[0, -0.45, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial color="#1E1A18" />
        </mesh>
        <mesh castShadow position={[0, -0.95, 0]}>
          <boxGeometry args={[0.46, 0.4, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
      </group>
      <group position={[2.05, 0.2, 0.1]} rotation={[0, 0, 2.3 + wave]}>
        <mesh castShadow position={[0, -0.45, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial color="#1E1A18" />
        </mesh>
        <mesh castShadow position={[0, -0.95, 0]}>
          <boxGeometry args={[0.46, 0.4, 0.4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

export const Scene: React.FC<{ t: number; tex: Record<string, THREE.Texture>; mode: TableMode; world?: boolean; sirVis?: number }> = ({ t, tex, mode, world, sirVis = 1 }) => {
  const dolly = ease((t - mode.t0) / 3.4);
  const punch = Math.max(0, ...mode.joins.map((j) => 1 - Math.abs(t - j) / 0.22), 1.4 * (1 - Math.abs(t - mode.done) / 0.3));
  const camPos: V3 = [Math.sin(t * 0.45) * 0.6, 13.2 - 1.2 * dolly, 9.6 - 1.6 * dolly];
  const look: V3 = [0, 2.9, -4.8];
  const planFill = TRAINERS.map((tr, i) => {
    const f = cl((t - mode.joins[i]) / 0.9);
    if (!mode.adjust) return f;
    const [a, b] = mode.adjust;
    const w = t > a && t < b + 0.3 ? 0.35 * Math.sin((t - a) * 12 + i * 1.3) * (1 - cl((t - b) / 0.3)) : 0;
    return cl(0.55 + 0.1 * i + w + (t > b ? 0.45 - 0.1 * i : 0));
  });
  const done = t >= mode.done;
  return (
    <>
      {!world && <>
      <CameraRig pos={camPos} look={look} fov={52 - 3 * cl(punch)} />
      <color attach="background" args={["#1A100C"]} />
      <fog attach="fog" args={["#1A100C", 16, 30]} />
      <ambientLight intensity={0.45} color="#FFE6C4" />
      <hemisphereLight args={["#FFE2B8", "#3A2418", 0.6]} />
      <directionalLight position={[5, 12, 6]} intensity={1.7} color="#FFE9CF" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      </>}
      <pointLight position={[0, 5.5, -6.2]} intensity={28} distance={12} color="#FFB45A" />
      <pointLight position={[0, 3.2, -2.6]} intensity={10 + 4 * Math.sin(t * 5)} distance={7} color="#BFA4FF" />

      {/* floor + back wall */}
      {!world && <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, -3]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tex.floor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 6, -11.2]} receiveShadow>
        <boxGeometry args={[24, 12, 0.4]} />
        <meshStandardMaterial map={tex.wall} roughness={0.85} />
      </mesh>
      </>}
      {world && [-4.3, 4.3].map((x) => <ToyBox key={x} p={[x, 4.4, -10.9]} s={[0.35, 8.8, 0.35]} color="#2A1A12" />)}
      {/* screen with the title */}
      <mesh position={[0, 7.6, -10.9]}>
        <boxGeometry args={[8.2, 2.6, 0.2]} />
        <meshStandardMaterial color="#14161F" />
      </mesh>
      <mesh position={[0, 7.6, -10.78]}>
        <planeGeometry args={[7.8, 2.3]} />
        <meshBasicMaterial map={tex.screen} toneMapped={false} />
      </mesh>

      {/* the table */}
      <ToyBox p={[0, 0.82, -3.6]} s={[5.3, 0.36, 11.4]} color="#7A4A26" top="#A86A3C" />
      {/* near end of the table: shaker, stopwatch, towel, apples, notebook */}
      <group position={[0, 1.0, 0.2]}>
        <mesh castShadow position={[-1.6, 0.35, 0.4]}>
          <cylinderGeometry args={[0.24, 0.2, 0.7, 12]} />
          <meshStandardMaterial color="#2B2F3A" />
        </mesh>
        <mesh castShadow position={[-1.6, 0.78, 0.4]}>
          <cylinderGeometry args={[0.2, 0.24, 0.16, 12]} />
          <meshStandardMaterial color="#FF8A4C" />
        </mesh>
        <group position={[1.5, 0.08, 0.6]} rotation={[0, -0.4, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.14, 24]} />
            <meshStandardMaterial color="#E9E4DA" />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[0, -t * 4, 0]}>
            <boxGeometry args={[0.04, 0.03, 0.32]} />
            <meshBasicMaterial color="#E04848" />
          </mesh>
        </group>
        <ToyBox p={[0.1, 0.06, 1.2]} s={[1.4, 0.12, 0.6]} color="#FF5FA2" top="#FF86BB" />
        {[-0.4, -0.1].map((x, i) => (
          <mesh key={i} castShadow position={[x + 0.9, 0.2, -0.6 + i * 0.25]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color={i ? "#7CC24A" : "#D9483E"} flatShading />
          </mesh>
        ))}
        <ToyBox p={[-0.5, 0.05, -0.7]} s={[1.0, 0.1, 1.3]} color="#2E5E9E" top="#F4EFE6" rot={[0, 0.3, 0]} />
      </group>
      {[[-2.3, -7.9], [2.3, -7.9], [-2.3, 1.5], [2.3, 1.5]].map(([x, z], i) => (
        <ToyBox key={i} p={[x, 0.32, z]} s={[0.4, 0.64, 0.4]} color="#4A2C16" />
      ))}
      {/* centre ring + console like the reference */}
      <mesh position={[0, 1.01, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.0, 64]} />
        <meshBasicMaterial color="#D9C8FF" transparent opacity={0.55 + 0.25 * Math.sin(t * 4)} toneMapped={false} />
      </mesh>

      {/* plan sheet with four bars growing as each trainer joins */}
      <group position={PLAN} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.4, 3.0]} />
          <meshStandardMaterial map={tex.plan} roughness={0.8} />
        </mesh>
        {TRAINERS.map((tr, i) => (
          <mesh key={i} position={[-0.95 + 0.9 * planFill[i], 0.07, -0.55 + i * 0.5]} castShadow>
            <boxGeometry args={[Math.max(0.01, 1.8 * planFill[i]), 0.08, 0.22]} />
            <meshStandardMaterial color={tr.plate} emissive={tr.plate} emissiveIntensity={done ? 0.25 + 0.5 * Math.abs(Math.sin(t * 6 + i)) : 0.25} />
          </mesh>
        ))}
      </group>

      {/* mini gym diorama in front of Sir Token */}
      <group position={[0, 1.0, -7.3]}>
        <ToyBox p={[0, 0.05, 0]} s={[3.0, 0.1, 1.4]} color="#2F6E8F" top="#3C88AE" />
        <group position={[-0.8, 0.28, 0]} rotation={[0, 0.3, 0]}>
          <ToyBox p={[0, 0, 0]} s={[0.9, 0.08, 0.08]} color="#B8C0CC" />
          <ToyBox p={[-0.45, 0, 0]} s={[0.12, 0.36, 0.36]} color="#22202A" />
          <ToyBox p={[0.45, 0, 0]} s={[0.12, 0.36, 0.36]} color="#22202A" />
        </group>
        <group position={[0.75, 0.35, 0.1]}>
          <mesh castShadow>
            <sphereGeometry args={[0.28, 12, 10]} />
            <meshStandardMaterial color="#2FBF71" flatShading />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <torusGeometry args={[0.15, 0.05, 6, 12]} />
            <meshStandardMaterial color="#2FBF71" />
          </mesh>
        </group>
        <mesh castShadow position={[1.25, 0.32, -0.3]}>
          <coneGeometry args={[0.18, 0.5, 8]} />
          <meshStandardMaterial color="#FF8A4C" flatShading />
        </mesh>
        <mesh castShadow position={[0.05, 0.36, -0.35]}>
          <cylinderGeometry args={[0.12, 0.12, 0.55, 10]} />
          <meshStandardMaterial color="#5FD3E0" roughness={0.3} />
        </mesh>
      </group>

      {/* trainers, chairs, name plates, cups, beams */}
      {TRAINERS.map((tr, i) => {
        const pop = back((t - (mode.joins[i] - 0.25)) / 0.45);
        const side = Math.sign(tr.p[0]);
        const s = Math.max(0.001, 1.25 * (0.15 + 0.85 * pop));
        return (
          <group key={tr.key}>
            <ToyBox p={[tr.p[0] + side * 0.95, 1.4, tr.p[2]]} s={[0.3, 2.2, 1.5]} color="#2B1C16" />
            <ToyBox p={[tr.p[0], 0.55, tr.p[2]]} s={[1.4, 0.2, 1.3]} color="#3A271D" />
            <group position={[tr.p[0], tr.p[1] - 0.6, tr.p[2]]} scale={[s, s, s]}>
              <BlockBuddy p={[0, 0.6, 0]} yaw={tr.yaw} color={tr.color} dark={tr.dark} t={t} seed={i * 1.7} accessory={tr.acc} accent={tr.accent} talk={(t > mode.joins[i] && t < mode.joins[i] + 0.6) || (!!mode.adjust && t > mode.adjust[0] + i * 0.15 && t < mode.adjust[1])} />
            </group>
            <mesh position={[side * 1.45, 1.45, tr.p[2] + 0.75]} rotation={[-0.45, -side * 0.25, 0]} scale={[Math.max(0.001, pop), Math.max(0.001, pop), 1]}>
              <planeGeometry args={[2.3, 0.58]} />
              <meshStandardMaterial map={tex["plate" + i]} roughness={0.7} />
            </mesh>
            <group position={[side * 1.7, 1.15, tr.p[2] + 0.9]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.13, 0.11, 0.26, 12]} />
                <meshStandardMaterial color="#F4EFE6" />
              </mesh>
              <mesh position={[0, 0.12, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.02, 12]} />
                <meshStandardMaterial color="#3B2414" />
              </mesh>
            </group>
            <mesh position={[side * 1.75, 1.015, tr.p[2] - 0.55]} rotation={[-Math.PI / 2, 0, side * 0.3]}>
              <planeGeometry args={[0.7, 0.9]} />
              <meshBasicMaterial color="#EDE5D3" />
            </mesh>
            <Beam a={[tr.p[0] - side * 0.7, 1.75, tr.p[2]]} b={[PLAN[0], 1.15, PLAN[2]]} color={tr.plate} on={(t - mode.joins[i]) / 0.5} t={t} seed={i} />
            <Burst at={mode.joins[i]} t={t} p={[tr.p[0], 2.2, tr.p[2]]} colors={[tr.plate, "#FFFFFF", "#FFE27A"]} />
          </group>
        );
      })}

      <SirToken3D t={t} face={tex.face} vis={sirVis} />
      <LightCone x={-3} z={-6} t={t} seed={0} color="#FFD9A0" />
      <LightCone x={3} z={-6} t={t} seed={2} color="#C9B6FF" />
      <LightCone x={0} z={-3} t={t} seed={4} color={mode.glow} />
      {/* plan done: golden shockwave + coin rain */}
      {done && (
        <mesh position={[PLAN[0], 1.06, PLAN[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2 + 6 * cl((t - mode.done) / 0.8), 0.45 + 6 * cl((t - mode.done) / 0.8), 64]} />
          <meshBasicMaterial color="#FFE27A" transparent opacity={1 - cl((t - mode.done) / 0.8)} toneMapped={false} />
        </mesh>
      )}
      <Burst at={mode.done} t={t} p={[PLAN[0], 1.4, PLAN[2]]} colors={["#FFE27A", "#FFFFFF", "#9DFFC4", "#FF8A4C"]} n={28} power={1.4} />
      <CoinRain at={mode.done + 0.1} t={t} />
      {mode.adjust && (
        <group position={[1.9, 1.0, -7.6]} rotation={[0, -0.5, 0]}>
          <ToyBox p={[0, 0.55, 0]} s={[1.3, 1.1, 0.25]} color="#FFFFFF" />
          <mesh position={[0, 0.55, 0.13]}>
            <planeGeometry args={[1.2, 1.0]} />
            <meshBasicMaterial map={tex.cal} />
          </mesh>
        </group>
      )}

      {/* floating glow motes */}
      {Array.from({ length: 46 }).map((_, i) => {
        const x = (rnd(i) - 0.5) * 12, z = -10 + rnd(i + 9) * 14;
        const y = 1.5 + ((rnd(i + 3) * 6 + t * (0.25 + rnd(i + 5) * 0.3)) % 6);
        return (
          <mesh key={i} position={[x + Math.sin(t + i) * 0.2, y, z]}>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshBasicMaterial color={i % 3 ? "#FFF2C6" : "#CFFFD9"} transparent opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} toneMapped={false} />
          </mesh>
        );
      })}

      {/* dark chair backs in the foreground like the reference */}
      {!world && <>
      <ToyBox p={[-3.6, 2.2, 3.6]} s={[1.8, 3.4, 0.6]} color="#120B08" cast={false} />
      <ToyBox p={[3.6, 2.2, 3.6]} s={[1.8, 3.4, 0.6]} color="#120B08" cast={false} />
      </>}
    </>
  );
};

export const useTextures = (ready: boolean, mode: TableMode) =>
  React.useMemo(() => {
    if (!ready) return null;
    const face = canvasTex(64, 64, (c) => {
      // pixel face: drawn small, sampled nearest = crisp pixels on the coin
      c.fillStyle = "#F2B92A"; c.fillRect(0, 0, 64, 64);
      const g = c.createRadialGradient(22, 20, 4, 32, 32, 34);
      g.addColorStop(0, "#FFE27A"); g.addColorStop(1, "#E0A01C");
      c.fillStyle = g; c.beginPath(); c.arc(32, 32, 30, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "#C88A12"; c.lineWidth = 3; c.beginPath(); c.arc(32, 32, 25, 0, Math.PI * 2); c.stroke();
      c.fillStyle = "#3A2108"; c.fillRect(13, 15, 13, 3); c.fillRect(38, 13, 13, 3); // brows
      c.fillStyle = "#FFFFFF"; c.fillRect(14, 20, 11, 13); c.fillRect(39, 20, 11, 13);
      c.fillStyle = "#15110C"; c.fillRect(18, 23, 6, 9); c.fillRect(43, 23, 6, 9);
      c.fillStyle = "#FFFFFF"; c.fillRect(19, 24, 2, 2); c.fillRect(44, 24, 2, 2);
      c.strokeStyle = "#BFE4F2"; c.lineWidth = 2; c.strokeRect(36, 17, 17, 19); // monocle
      c.fillStyle = "#E8C24A"; c.fillRect(52, 36, 2, 12);
      c.fillStyle = "#4A2C14"; // moustache
      c.fillRect(20, 37, 24, 5); c.fillRect(15, 39, 6, 5); c.fillRect(43, 39, 6, 5); c.fillRect(11, 42, 5, 3); c.fillRect(48, 42, 5, 3);
      c.fillStyle = "#7A2A1A"; c.fillRect(26, 44, 12, 4); c.fillStyle = "#E66"; c.fillRect(29, 46, 6, 2);
      c.fillStyle = "rgba(255,120,120,.55)"; c.fillRect(8, 33, 6, 3); c.fillRect(50, 33, 6, 3);
    }, true);
    face.center.set(0.5, 0.5);
    face.rotation = Math.PI / 2;
    const wall = canvasTex(1024, 512, (c) => {
      c.fillStyle = "#4A2B1A"; c.fillRect(0, 0, 1024, 512);
      for (let i = 0; i < 16; i++) {
        c.fillStyle = i % 2 ? "#52301C" : "#4C2C19"; c.fillRect(i * 64, 0, 64, 512);
        c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(i * 64, 0, 3, 512);
        c.fillStyle = "rgba(255,220,170,.06)"; c.fillRect(i * 64 + 6, 0, 2, 512);
      }
      c.fillStyle = "#2E1A10"; c.fillRect(0, 380, 1024, 132);
      c.fillStyle = "#C8A14C"; c.fillRect(0, 372, 1024, 8);
    });
    const floor = canvasTex(512, 512, (c) => {
      c.fillStyle = "#24150F"; c.fillRect(0, 0, 512, 512);
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { c.fillStyle = (x + y) % 2 ? "#2B1912" : "#21130D"; c.fillRect(x * 64, y * 64, 62, 62); }
    });
    floor.wrapS = floor.wrapT = THREE.RepeatWrapping; floor.repeat.set(6, 6);
    const screen = canvasTex(1024, 300, (c) => {
      const g = c.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, "#1C3F8F"); g.addColorStop(1, "#0F2A66");
      c.fillStyle = g; c.fillRect(0, 0, 1024, 300);
      for (let y = 0; y < 300; y += 4) { c.fillStyle = "rgba(0,0,0,.12)"; c.fillRect(0, y, 1024, 2); }
      c.font = "900 150px Rubik"; c.textAlign = "center"; c.textBaseline = "middle";
      c.shadowColor = mode.glow; c.shadowBlur = 30; c.fillStyle = mode.glow; c.fillText(mode.title, 512, 160);
    });
    const plan = canvasTex(480, 600, (c) => {
      c.fillStyle = "#FBF5E8"; roundRect(c, 0, 0, 480, 600, 30); c.fill();
      c.fillStyle = "#161921"; roundRect(c, 24, 24, 432, 92, 18); c.fill();
      c.font = "900 52px Rubik"; c.fillStyle = "#FF8A4C"; c.textBaseline = "middle"; c.fillText("DEIN PLAN", 52, 72);
      for (let i = 0; i < 4; i++) { c.fillStyle = "#E8DFCC"; roundRect(c, 40, 170 + i * 100, 400, 44, 12); c.fill(); }
    });
    const cal = canvasTex(240, 200, (c) => {
      c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 240, 200);
      c.fillStyle = "#E5534B"; c.fillRect(0, 0, 240, 56);
      c.font = "900 38px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "#FFFFFF"; c.fillText("SONNTAG", 120, 30);
      c.font = "900 92px Rubik"; c.fillStyle = "#161921"; c.fillText("✓", 120, 132);
    });
    const t: Record<string, THREE.Texture> = { face, wall, floor, screen, plan, cal };
    TRAINERS.forEach((tr, i) => (t["plate" + i] = plateTex(tr.key, tr.plate)));
    return t;
  }, [ready, mode]);

// One table shot for the master reel: 3D scene + 2D lens and stickers. No captions/HUD/audio here.
export const TableShot: React.FC<{ t: number; mode: TableMode }> = ({ t, mode }) => {
  const ready = useFontsReady(["900 70px Rubik"]);
  const tex = useTextures(ready, mode);
  const flash = Math.max(0, 1 - Math.abs(t - (mode.joins[0] - 1.75)) / 0.12) * 0.4 + Math.max(0, 1 - Math.abs(t - mode.done) / 0.14) * 0.45;
  const sunday = !!mode.adjust;
  return (
    <AbsoluteFill style={{ background: "#1A100C", fontFamily: pixelFont }}>
      {tex && (
        <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
          <Scene t={t} tex={tex} mode={mode} />
        </ThreeCanvas>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 48%, rgba(10,4,2,.62) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(255,170,90,.06), transparent 30%, transparent 70%, rgba(20,8,4,.35))" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <div style={{ position: "absolute", left: 60, top: 300, padding: "16px 34px", borderRadius: 60, background: sunday ? "linear-gradient(#FFD98A,#E6A93A)" : "linear-gradient(#B9A2FF,#8D6CF0)", border: "5px solid #FFF6E5", boxShadow: sunday ? "0 0 40px rgba(255,200,110,.7)" : "0 0 40px rgba(170,140,255,.7)", color: sunday ? "#3A2508" : "#fff", fontWeight: 900, fontSize: 46, letterSpacing: 1, transform: `scale(${back((t - (sunday ? 29.43 : 12.6)) / 0.4)}) rotate(-3deg)` }}>
        {sunday ? "CHECK-IN · WOCHE 2" : "4 TRAINER · LIVE"}
      </div>
      {!sunday && <Stamp text="GLEICHZEITIG" x={560} y={1170} at={13.1} color="#5FD3E0" rot={-8} size={84} />}
      {sunday && <Stamp text="ANGEPASST ✓" x={560} y={1170} at={31.1} color="#2FBF71" rot={-8} size={84} />}
      <Confetti at={mode.done} x={540} y={900} n={60} />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["900 70px Rubik"]);
  const tex = useTextures(ready, MODE_TRICK);
  const flash = Math.max(0, 1 - Math.abs(t - 12.62) / 0.12) * 0.5;
  return (
    <AbsoluteFill style={{ background: "#1A100C", fontFamily: pixelFont }}>
      {tex && (
        <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
          <Scene t={t} tex={tex} mode={MODE_TRICK} />
        </ThreeCanvas>
      )}
      {/* lens: vignette, slight warm grade, chromatic fringe on the edges */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 48%, rgba(10,4,2,.62) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(255,170,90,.06), transparent 30%, transparent 70%, rgba(20,8,4,.35))" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      {/* skill pill like "KUNDEN-SKILL" */}
      <div style={{ position: "absolute", left: 60, top: 300, padding: "16px 34px", borderRadius: 60, background: "linear-gradient(#B9A2FF,#8D6CF0)", border: "5px solid #EDE5FF", boxShadow: "0 0 40px rgba(170,140,255,.7)", color: "#fff", fontWeight: 900, fontSize: 46, letterSpacing: 1, transform: `scale(${back((t - 12.6) / 0.4)}) rotate(-3deg)` }}>
        4 TRAINER · LIVE
      </div>
      <StepBadge n={3} at={11.0} theme={th} />
      <MiniGrid total={7} current={3} theme={th} />
      <PillCaptions words={words as Word[]} theme={th} />
      <Audio src={staticFile("sirtoken/voice.mp3")} />
    </AbsoluteFill>
  );
};

// Sequence with a negative offset so the shared PixelKit HUD/captions see the reel's real time.
export const TrainerTable3D: React.FC = () => (
  <Sequence from={-Math.round(T0 * 30)}>
    <Inner />
  </Sequence>
);
