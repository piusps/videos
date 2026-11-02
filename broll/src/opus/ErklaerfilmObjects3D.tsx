import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { Easing, continueRender, delayRender, interpolate } from "remotion";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { canvasTex, roundRect } from "../components/Voxel3D";

// FP-N "Erklaerfilm" (2026-10-29): real three.js set for the hook film of the example roofer
// "Holzmann Dachtechnik" (BEISPIEL, invented company). A plastered house, rafters, terracotta tile rows that drop in
// row by row, ridge cap, scaffold, trees, branded van, warm low sun with soft shadows and warm fog for depth.
// Camera = film shots with hard cuts (see filmCam). Render with --gl=angle.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.4, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });

export const FOG = "#F5E2CE";

const useFontsReady = (fams: string[]) => {
  const [ready, setReady] = React.useState(false);
  const [h] = React.useState(() => delayRender("roof3d fonts"));
  React.useEffect(() => {
    Promise.all(fams.map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(() => { setReady(true); continueRender(h); }).catch(() => { setReady(true); continueRender(h); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ready;
};

const Env: React.FC<{ intensity?: number; exposure?: number; fog?: boolean }> = ({ intensity = 0.35, exposure = 1.0, fog = true }) => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = intensity;
    scene.fog = fog ? new THREE.Fog(FOG, 34, 95) : null;
  }, [gl, scene, intensity, exposure, fog]);
  return null;
};
export type CamSpec = { pos: [number, number, number]; look: [number, number, number]; fov: number; roll?: number };
const Cam: React.FC<CamSpec> = ({ pos, look, fov, roll = 0 }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  (camera as THREE.PerspectiveCamera).near = 0.5;
  (camera as THREE.PerspectiveCamera).far = 200;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...look);
  return null;
};

const rbox = (w: number, h: number, d: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2 + r, y = -h / 2 + r, iw = w - 2 * r, ih = h - 2 * r;
  s.moveTo(x, y - r);
  s.lineTo(x + iw, y - r);
  s.quadraticCurveTo(x + iw + r, y - r, x + iw + r, y);
  s.lineTo(x + iw + r, y + ih);
  s.quadraticCurveTo(x + iw + r, y + ih + r, x + iw, y + ih + r);
  s.lineTo(x, y + ih + r);
  s.quadraticCurveTo(x - r, y + ih + r, x - r, y + ih);
  s.lineTo(x - r, y);
  s.quadraticCurveTo(x - r, y - r, x, y - r);
  const bev = Math.min(r * 0.6, d * 0.3);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * bev), bevelEnabled: true, bevelSize: bev, bevelThickness: bev, bevelSegments: 4, curveSegments: 8 });
  g.center();
  return g;
};

// ---------- geometry constants ----------
const HW = 6, HD = 4.5, WALL = 5.2, RISE = 4.0, OVER = 0.75, OVX = 0.7; // half width (x), half depth (z), wall height, roof rise, eave overhang
const RIDGE_Y = WALL + RISE;
const TH = Math.atan(RISE / HD); // roof pitch
const EAVE_Z = HD + OVER;
const EAVE_Y = RIDGE_Y - EAVE_Z * Math.tan(TH);
const SLOPE = Math.hypot(EAVE_Z, RIDGE_Y - EAVE_Y);
export const ROWS = 9;
const ROW_STEP = SLOPE / ROWS;

// tile texture: pan tiles with grooves, sun-faded top, darker overlap at the bottom edge
const tileTex = (base: string, dark: string) =>
  canvasTex(1024, 128, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, base); g.addColorStop(0.8, base); g.addColorStop(1, dark);
    c.fillStyle = g; c.fillRect(0, 0, 1024, 128);
    for (let x = 0; x < 1024; x += 46) {
      const gg = c.createLinearGradient(x, 0, x + 46, 0);
      gg.addColorStop(0, "rgba(0,0,0,0.22)"); gg.addColorStop(0.18, "rgba(255,255,255,0.14)"); gg.addColorStop(0.55, "rgba(255,255,255,0.0)"); gg.addColorStop(1, "rgba(0,0,0,0.12)");
      c.fillStyle = gg; c.fillRect(x, 0, 46, 128);
    }
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "0,0,0"},${Math.random() * 0.06})`; c.fillRect(Math.random() * 1024, Math.random() * 128, 3 + Math.random() * 10, 2 + Math.random() * 6); }
  });
const plasterTex = () =>
  canvasTex(512, 512, (c) => {
    c.fillStyle = "#F7F1E8"; c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) { c.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "120,90,60"},${Math.random() * 0.05})`; c.fillRect(Math.random() * 512, Math.random() * 512, 2, 2); }
  });
const groundTex = () =>
  canvasTex(1024, 1024, (c) => {
    c.fillStyle = "#EADCC6"; c.fillRect(0, 0, 1024, 1024);
    const g = c.createRadialGradient(512, 512, 60, 512, 512, 470);
    g.addColorStop(0, "#BFCB98"); g.addColorStop(0.55, "#B7C48F"); g.addColorStop(0.8, "rgba(205,205,160,0.6)"); g.addColorStop(1, "rgba(234,220,198,0)");
    c.fillStyle = g; c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,240" : "70,90,40"},${Math.random() * 0.07})`; c.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 3); }
    // stone path to the door
    c.fillStyle = "#E4DACB"; c.fillRect(496, 512 + 70, 32, 300);
  });
const vanTex = () =>
  canvasTex(1024, 300, (c) => {
    c.fillStyle = "#FBF8F3"; c.fillRect(0, 0, 1024, 300);
    c.fillStyle = "#D97757"; c.beginPath(); c.moveTo(0, 210); c.lineTo(1024, 150); c.lineTo(1024, 300); c.lineTo(0, 300); c.fill();
    c.fillStyle = "#16130F"; c.font = "800 92px Inter-Bold"; c.textBaseline = "middle"; c.fillText("HOLZMANN", 70, 92);
    c.fillStyle = "#7C756B"; c.font = "800 34px 'JetBrains Mono'"; c.fillText("DACHTECHNIK · MEISTERBETRIEB", 74, 162);
  });

type Variant = { roof: string; roofDark: string; wall?: string };
export const VARIANTS: Record<string, Variant> = {
  terracotta: { roof: "#C8623B", roofDark: "#8E3E22" },
  anthracite: { roof: "#5A5E63", roofDark: "#33363A" },
  brown: { roof: "#7A4630", roofDark: "#4A2414", wall: "#F3E6D6" },
};

// roof progress: row i of side s is placed when p passes its slot; returns 0..1 drop per row
export type RoofTiming = (side: 0 | 1, row: number) => number; // time (s) the row lands
const dropOf = (t: number, land: number) => interpolate(t, [land - 0.34, land], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.25)) });

const House: React.FC<{ t: number; land: RoofTiming; ridgeAt: number; variant: Variant; van?: boolean; scaffold?: boolean }> = ({ t, land, ridgeAt, variant, van = true, scaffold = true }) => {
  const ready = useFontsReady(["800 92px Inter-Bold", "800 34px 'JetBrains Mono'"]);
  const geo = React.useMemo(() => {
    const tri = new THREE.Shape();
    tri.moveTo(-HD, 0); tri.lineTo(HD, 0); tri.lineTo(0, RISE); tri.lineTo(-HD, 0);
    return {
      walls: new THREE.BoxGeometry(HW * 2, WALL, HD * 2),
      plinth: new THREE.BoxGeometry(HW * 2 + 0.16, 0.5, HD * 2 + 0.16),
      gable: new THREE.ExtrudeGeometry(tri, { depth: 0.3, bevelEnabled: false }),
      row: new THREE.BoxGeometry(HW * 2 + OVX * 2, 0.2, ROW_STEP * 1.22),
      gutter: new THREE.CylinderGeometry(0.17, 0.17, HW * 2 + OVX * 2 + 0.2, 14, 1),
      fascia: new THREE.BoxGeometry(HW * 2 + OVX * 2 + 0.1, 0.34, 0.12),
      rafter: new THREE.BoxGeometry(0.22, 0.3, SLOPE),
      purlin: new THREE.BoxGeometry(HW * 2 + OVX * 2, 0.16, 0.2),
      ridge: new THREE.CylinderGeometry(0.34, 0.34, HW * 2 + OVX * 2 + 0.1, 20, 1),
      win: rbox(1.7, 2.0, 0.24, 0.05),
      glass: new THREE.PlaneGeometry(1.42, 1.72),
      door: rbox(1.5, 2.7, 0.24, 0.05),
      chimney: new THREE.BoxGeometry(1.1, 3.2, 1.1),
      pole: new THREE.CylinderGeometry(0.07, 0.07, 7.4, 8),
      plank: new THREE.BoxGeometry(0.9, 0.08, 9.6),
      trunk: new THREE.CylinderGeometry(0.22, 0.32, 3, 8),
      crown: new THREE.IcosahedronGeometry(1.9, 1),
      vanBody: rbox(5.4, 2.3, 2.4, 0.42),
      vanCab: rbox(1.7, 1.5, 2.3, 0.4),
      wheel: new THREE.CylinderGeometry(0.5, 0.5, 0.36, 20),
      side: new THREE.PlaneGeometry(4.0, 1.2),
    };
  }, []);
  const mats = React.useMemo(() => ({
    tile: new THREE.MeshStandardMaterial({ map: tileTex(variant.roof, variant.roofDark), roughness: 0.62, metalness: 0.02 }),
    ridge: new THREE.MeshStandardMaterial({ color: variant.roofDark, roughness: 0.5 }),
    wall: new THREE.MeshStandardMaterial({ map: plasterTex(), color: variant.wall ?? "#FFFFFF", roughness: 0.92 }),
    plinth: new THREE.MeshStandardMaterial({ color: "#B9AE9E", roughness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ color: "#C9955F", roughness: 0.7 }),
    frame: new THREE.MeshStandardMaterial({ color: "#3A3430", roughness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#B9CAD6", roughness: 0.04, metalness: 0.4, clearcoat: 1, envMapIntensity: 1.6 }),
    door: new THREE.MeshStandardMaterial({ color: "#8C5A38", roughness: 0.55 }),
    chimney: new THREE.MeshStandardMaterial({ color: "#E9E1D4", roughness: 0.85 }),
    copper: new THREE.MeshStandardMaterial({ color: "#C27A4A", roughness: 0.35, metalness: 0.75 }),
    steel: new THREE.MeshStandardMaterial({ color: "#C7C9CC", roughness: 0.3, metalness: 0.8 }),
    trunk: new THREE.MeshStandardMaterial({ color: "#8A6A4E", roughness: 0.9 }),
    crown: new THREE.MeshStandardMaterial({ color: "#9FB27E", roughness: 0.85, flatShading: true }),
    crown2: new THREE.MeshStandardMaterial({ color: "#B4C28D", roughness: 0.85, flatShading: true }),
    vanBody: new THREE.MeshPhysicalMaterial({ color: "#FBF8F3", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 }),
    vanGlass: new THREE.MeshPhysicalMaterial({ color: "#5D6A73", roughness: 0.05, metalness: 0.5 }),
    tyre: new THREE.MeshStandardMaterial({ color: "#2A2725", roughness: 0.8 }),
    ground: new THREE.MeshStandardMaterial({ map: groundTex(), roughness: 1 }),
  }), [variant]);
  const side = React.useMemo(() => (ready ? new THREE.MeshBasicMaterial({ map: vanTex(), toneMapped: false }) : null), [ready]);

  // slope frame: side 0 = front (z>0), side 1 = back
  const rowEls: React.ReactNode[] = [];
  const raftEls: React.ReactNode[] = [];
  ([0, 1] as const).forEach((sd) => {
    const sg = sd === 0 ? 1 : -1;
    const rx = sg * TH;
    const nrm = new THREE.Vector3(0, Math.cos(TH), sg * Math.sin(TH));
    for (let i = 0; i < ROWS; i++) {
      const s = SLOPE - (i + 0.5) * ROW_STEP; // from ridge downwards? rows are laid eave first: i=0 at the eave
      const sEave = (i + 0.5) * ROW_STEP;
      const z = sg * (EAVE_Z - (sEave / SLOPE) * EAVE_Z);
      const y = EAVE_Y + (sEave / SLOPE) * (RIDGE_Y - EAVE_Y);
      void s;
      const d = dropOf(t, land(sd, i));
      if (d <= 0) continue;
      const lift = (1 - d) * 7;
      const off = 0.22 + i * 0.012;
      rowEls.push(
        <mesh key={`r${sd}${i}`} geometry={geo.row} material={mats.tile} castShadow receiveShadow
          position={[0, y + nrm.y * off + lift, z + nrm.z * off]} rotation={[rx + (1 - d) * 0.25 * sg, 0, (1 - d) * 0.04]} />,
      );
    }
    // rafters (visible until tiles cover them) + purlins
    for (let x = -HW - 0.2; x <= HW + 0.21; x += 1.2) {
      const zc = sg * EAVE_Z * 0.5, yc = (EAVE_Y + RIDGE_Y) / 2;
      raftEls.push(<mesh key={`a${sd}${x.toFixed(1)}`} geometry={geo.rafter} material={mats.wood} castShadow position={[x, yc, zc]} rotation={[rx, 0, 0]} />);
    }
    for (let j = 1; j < 4; j++) {
      const f = j / 4;
      raftEls.push(<mesh key={`p${sd}${j}`} geometry={geo.purlin} material={mats.wood} castShadow position={[0, EAVE_Y + f * (RIDGE_Y - EAVE_Y) + nrm.y * 0.2, sg * EAVE_Z * (1 - f) + nrm.z * 0.2]} rotation={[rx, 0, 0]} />);
    }
  });
  const ridgeP = dropOf(t, ridgeAt);
  const trees: [number, number, number][] = [[-14, -7, 1.15], [14.5, -9, 1.3], [-17, 7, 0.95], [17.5, 4, 1.05], [-9, -15, 1.25], [7, -16, 1.1]];
  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={mats.ground} receiveShadow>
        <planeGeometry args={[90, 90]} />
      </mesh>
      {/* body */}
      <mesh geometry={geo.plinth} material={mats.plinth} position={[0, 0.25, 0]} castShadow receiveShadow />
      <mesh geometry={geo.walls} material={mats.wall} position={[0, WALL / 2 + 0.01, 0]} castShadow receiveShadow />
      {[-1, 1].map((sx) => <mesh key={sx} geometry={geo.gable} material={mats.wall} position={[sx * (HW - 0.15) - 0.15, WALL, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow />)}
      {/* windows + door front */}
      {[-3.6, 3.6].map((x) => (
        <group key={x} position={[x, 2.6, HD + 0.06]}>
          <mesh geometry={geo.win} material={mats.frame} castShadow />
          <mesh geometry={geo.glass} material={mats.glass} position={[0, 0, 0.13]} />
          <mesh position={[0, 0, 0.14]}><boxGeometry args={[0.08, 1.72, 0.04]} /><meshStandardMaterial color="#3A3430" /></mesh>
        </group>
      ))}
      <mesh geometry={geo.door} material={mats.door} position={[0, 1.35, HD + 0.06]} castShadow />
      {/* gable window (side) */}
      <group position={[HW + 0.12, WALL + 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh geometry={geo.win} material={mats.frame} scale={[0.8, 0.8, 1]} />
        <mesh geometry={geo.glass} material={mats.glass} position={[0, 0, 0.13]} scale={[0.8, 0.8, 1]} />
      </group>
      {[-1.4, 1.4].map((z) => (
        <group key={z} position={[HW + 0.06, 2.6, z * 1.6]} rotation={[0, Math.PI / 2, 0]}>
          <mesh geometry={geo.win} material={mats.frame} />
          <mesh geometry={geo.glass} material={mats.glass} position={[0, 0, 0.13]} />
        </group>
      ))}
      {/* roof structure */}
      {raftEls}
      {rowEls}
      {[-1, 1].map((sg) => (
        <group key={`e${sg}`}>
          <mesh geometry={geo.fascia} material={mats.wood} position={[0, EAVE_Y - 0.02, sg * (EAVE_Z + 0.02)]} rotation={[sg * TH, 0, 0]} castShadow />
          <mesh geometry={geo.gutter} material={mats.copper} rotation={[0, 0, Math.PI / 2]} position={[0, EAVE_Y - 0.12, sg * (EAVE_Z + 0.2)]} castShadow />
        </group>
      ))}
      {ridgeP > 0 ? <mesh geometry={geo.ridge} material={mats.ridge} rotation={[0, 0, Math.PI / 2]} position={[0, RIDGE_Y + 0.28 + (1 - ridgeP) * 5, 0]} castShadow /> : null}
      <mesh geometry={geo.chimney} material={mats.chimney} position={[2.8, RIDGE_Y - 0.6, -1.6]} castShadow receiveShadow />
      {/* scaffold on the left gable */}
      {scaffold ? (
        <group position={[-HW - 1.3, 0, 0]}>
          {[-4.4, -1.5, 1.5, 4.4].flatMap((z) => [0, 1].map((xx) => <mesh key={`${z}${xx}`} geometry={geo.pole} material={mats.steel} position={[xx * 1.0 - 0.5, 3.7, z]} castShadow />))}
          {[2.4, 4.9].map((y) => <mesh key={y} geometry={geo.plank} material={mats.wood} position={[0, y, 0]} castShadow receiveShadow />)}
          {[2.4, 4.9].map((y) => <mesh key={`g${y}`} position={[-0.5, y + 0.9, 0]} material={mats.steel}><boxGeometry args={[0.06, 0.06, 9.6]} /></mesh>)}
        </group>
      ) : null}
      {/* trees */}
      {trees.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s} rotation={[0, i * 1.3 + Math.sin(t * 0.8 + i) * 0.02, 0]}>
          <mesh geometry={geo.trunk} material={mats.trunk} position={[0, 1.5, 0]} castShadow />
          <mesh geometry={geo.crown} material={i % 2 ? mats.crown : mats.crown2} position={[0, 4.1, 0]} castShadow />
          <mesh geometry={geo.crown} material={i % 2 ? mats.crown2 : mats.crown} position={[0.8, 5.2, 0.3]} scale={0.7} castShadow />
        </group>
      ))}
      {/* branded van */}
      {van ? (
        <group position={[-9.2, 0, 10.6]} rotation={[0, 0.32, 0]}>
          <mesh geometry={geo.vanBody} material={mats.vanBody} position={[0, 1.65, 0]} castShadow receiveShadow />
          <mesh geometry={geo.vanCab} material={mats.vanBody} position={[3.25, 1.3, 0]} castShadow />
          <mesh position={[3.65, 1.65, 0]} material={mats.vanGlass} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[1.9, 0.75]} /></mesh>
          {[[-1.7, 1.25], [-1.7, -1.25], [2.9, 1.25], [2.9, -1.25]].map(([x, z], i) => <mesh key={i} geometry={geo.wheel} material={mats.tyre} position={[x, 0.5, z]} rotation={[Math.PI / 2, 0, 0]} castShadow />)}
          {side ? <mesh geometry={geo.side} material={side} position={[-0.2, 1.75, 1.215]} /> : null}
          {side ? <mesh geometry={geo.side} material={side} position={[-0.2, 1.75, -1.215]} rotation={[0, Math.PI, 0]} /> : null}
        </group>
      ) : null}
    </group>
  );
};

// ---------- the scene ----------
export const RoofScene3D: React.FC<{ t: number; w: number; h: number; cam: CamSpec; land: RoofTiming; ridgeAt: number; variant?: Variant; sun?: number; fog?: boolean }> = ({ t, w, h, cam, land, ridgeAt, variant = VARIANTS.terracotta, sun = 1, fog = true }) => (
  <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
    <Env intensity={0.32} exposure={1.02} fog={fog} />
    <Cam {...cam} />
    <hemisphereLight args={["#FFF1E2", "#D7B596", 0.75]} />
    <directionalLight position={[-22, 17, 16]} intensity={3.3 * sun} color="#FFD6AA" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-28} shadow-camera-right={28} shadow-camera-top={28} shadow-camera-bottom={-28} shadow-radius={6} shadow-bias={-0.0004} />
    <directionalLight position={[20, 7, -16]} intensity={1.8} color="#FF9A6A" />
    <directionalLight position={[10, 12, 22]} intensity={0.55} color="#FFF4EA" />
    <House t={t} land={land} ridgeAt={ridgeAt} variant={variant} van={false} />
  </ThreeCanvas>
);

// film shots for the hook (t = film seconds). Hard cuts at the shot borders.
export const SHOTS = [0, 1.42, 2.5, 3.55, 4.42];
const lerp3 = (a: number[], b: number[], p: number) => a.map((v, i) => v + (b[i] - v) * p) as [number, number, number];
export const filmCam = (t: number): CamSpec => {
  const ez = Easing.inOut(Easing.sin);
  if (t < SHOTS[1]) { // wide crane-down establishing, 3/4 front-left
    const p = ez(Math.min(1, Math.max(0, (t + 0.6) / (SHOTS[1] + 0.6))));
    return { pos: lerp3([-23, 15.5, 25], [-19, 10.5, 20.5], p), look: [0.5, 4.6, 0], fov: 33, roll: -0.01 };
  }
  if (t < SHOTS[2]) { // low tracking along the front eave, tiles landing close
    const p = ez((t - SHOTS[1]) / (SHOTS[2] - SHOTS[1]));
    return { pos: lerp3([10.5, 5.6, 12.5], [6.2, 6.3, 11.4], p), look: lerp3([-1.5, 7.0, 1.5], [-3.5, 7.3, 1.2], p), fov: 30, roll: 0.03 };
  }
  if (t < SHOTS[3]) { // drone: high orbit over the ridge
    const p = (t - SHOTS[2]) / (SHOTS[3] - SHOTS[2]);
    const a = -0.95 + p * 0.55;
    return { pos: [Math.sin(a) * 19, 23 - p * 2.5, Math.cos(a) * 19], look: [0, 5, 0], fov: 34 };
  }
  if (t < SHOTS[4]) { // hero: low angle front-right, slow push
    const p = ez((t - SHOTS[3]) / (SHOTS[4] - SHOTS[3]));
    return { pos: lerp3([3.5, 2.0, 22.5], [2.2, 2.5, 19.0], p), look: [-1.2, 5.6, 0], fov: 38, roll: -0.015 };
  }
  // after the sting: slow orbit of the finished house (shown inside the player card)
  const p = (t - SHOTS[4]) / 3;
  const a = 0.62 + p * 0.35;
  return { pos: [Math.sin(a) * 25, 9.5, Math.cos(a) * 25], look: [0, 4.5, 0], fov: 33 };
};
// tile timing in the film: front slope rows land 0.0 .. 2.3 s (one every ~0.26 s), back slope 2.45 .. 3.3 s, ridge 3.42 s.
// Frame 0 already shows 3 rows so the thumbnail reads as "roof in progress".
export const filmLand: RoofTiming = (side, row) => (side === 0 ? -0.55 + row * 0.27 : 2.42 + row * 0.1);
export const FILM_RIDGE = 3.45;
// finished roof (for photos)
export const doneLand: RoofTiming = () => -10;
export const noneLand: RoofTiming = () => 999;
export const halfLand: RoofTiming = (side, row) => (row < 5 ? -10 : 999);

// photo views for the phone shots / clip thumbnails (portrait)
export const PHOTO_CAMS: Record<string, CamSpec> = {
  rafters: { pos: [-11, 3.2, 15], look: [0, 6.6, 0], fov: 42, roll: 0.02 },
  half: { pos: [9, 4.5, 13], look: [-1, 6.8, 0], fov: 40 },
  front: { pos: [-12, 5.5, 20], look: [0, 4.6, 0], fov: 42 },
  ridge: { pos: [11, 13.5, 9], look: [-2, 8.6, 0], fov: 38, roll: -0.02 },
  hero: { pos: [4, 2.4, 21], look: [-1, 5.4, 0], fov: 44 },
};

// unused helper kept for completeness (rounded rect on canvas)
export const _rr = roundRect;
export const _k = k;
