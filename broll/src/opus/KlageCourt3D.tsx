import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { canvasTex, roundRect } from "../components/Voxel3D";

const monoF = loadMono("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });
const serifF = loadSerif("normal", { weights: ["500"], subsets: ["latin", "latin-ext"] });
const serifI = loadSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const useFontsReady = () => {
  const [ready, setReady] = React.useState(false);
  const [h] = React.useState(() => delayRender("court3d fonts"));
  React.useEffect(() => {
    Promise.all([monoF.waitUntilDone(), serifF.waitUntilDone(), serifI.waitUntilDone()]).then(() => document.fonts.ready).then(() => { setReady(true); continueRender(h); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ready;
};

// Real 3D court scene (2026-10-27 v6): ceramic courthouse, polished brass posts, red velvet rope, hanging sign,
// soft shadows, studio env reflections, ACES tone mapping. Replaces the flat CSS "Bis 2025" cards.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.4, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const back = (t: number, a: number, d = 0.5) => k(t, a, d, Easing.out(Easing.back(1.6)));

const rbox = (w: number, h: number, d: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2 + r, y = -h / 2 + r, iw = w - 2 * r, ih = h - 2 * r;
  s.moveTo(x, y);
  s.lineTo(x + iw, y);
  s.lineTo(x + iw, y + ih);
  s.lineTo(x, y + ih);
  s.lineTo(x, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true, bevelSize: r, bevelThickness: r, bevelSegments: 5, curveSegments: 8 });
  g.center();
  return g;
};

const Env: React.FC<{ intensity?: number }> = ({ intensity = 0.32 }) => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = intensity;
  }, [gl, scene, intensity]);
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

type Mats = ReturnType<typeof useMats>;
const useMats = (tone: "red" | "green") =>
  React.useMemo(() => {
    const ceramic = new THREE.MeshPhysicalMaterial({ color: tone === "red" ? "#F4E6E0" : "#EEF2EA", roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.25 });
    const ceramicDark = new THREE.MeshPhysicalMaterial({ color: tone === "red" ? "#E2C8C0" : "#D6E2D4", roughness: 0.5, clearcoat: 0.3 });
    const brass = new THREE.MeshPhysicalMaterial({ color: "#D9A94E", metalness: 1, roughness: 0.22, clearcoat: 0.4 });
    const velvet = new THREE.MeshPhysicalMaterial({ color: "#8A1310", roughness: 0.62, sheen: 1, sheenColor: new THREE.Color("#FF6B5E"), sheenRoughness: 0.35 });
    const floor = new THREE.MeshStandardMaterial({ color: tone === "red" ? "#EFE4D7" : "#E6EDE4", roughness: 0.92 });
    return { ceramic, ceramicDark, brass, velvet, floor };
  }, [tone]);

const Courthouse: React.FC<{ t: number; at: number; m: Mats; plate: THREE.Texture; scale?: number; position?: [number, number, number] }> = ({ t, at, m, plate, scale = 1, position = [0, 0, 0] }) => {
  const g = React.useMemo(() => ({
    step: [rbox(5.4, 0.2, 2.6, 0.05), rbox(5.0, 0.2, 2.3, 0.05), rbox(4.6, 0.2, 2.0, 0.05)],
    col: (() => {
      const s = new THREE.Shape();
      const n = 20;
      for (let i = 0; i <= n * 8; i++) {
        const a = (i / (n * 8)) * Math.PI * 2;
        const r = 0.18 - 0.016 * Math.pow(Math.abs(Math.sin((a * n) / 2)), 0.6);
        if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r); else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      const e = new THREE.ExtrudeGeometry(s, { depth: 2.1, bevelEnabled: false, curveSegments: 4 });
      e.rotateX(-Math.PI / 2); e.translate(0, -1.05, 0); e.computeVertexNormals();
      return e;
    })(),
    cap: rbox(0.5, 0.14, 0.5, 0.03),
    wall: rbox(4.0, 2.1, 0.9, 0.04),
    beam: rbox(4.7, 0.42, 1.6, 0.05),
    ped: (() => {
      const s = new THREE.Shape();
      s.moveTo(-2.45, 0); s.lineTo(2.45, 0); s.lineTo(0, 1.0); s.lineTo(-2.45, 0);
      const e = new THREE.ExtrudeGeometry(s, { depth: 1.3, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4 });
      e.translate(0, 0, -0.65);
      return e;
    })(),
    plate: new THREE.PlaneGeometry(3.6, 0.3),
  }), []);
  const rise = (i: number) => back(t, at + i * 0.05, 0.55);
  const cols = [-1.8, -1.08, -0.36, 0.36, 1.08, 1.8];
  return (
    <group position={position} scale={scale}>
      {g.step.map((s, i) => (
        <mesh key={i} geometry={s} material={m.ceramic} position={[0, 0.1 + i * 0.2, 0]} scale={[1, Math.max(0.001, rise(i)), 1]} castShadow receiveShadow />
      ))}
      <mesh geometry={g.wall} material={m.ceramicDark} position={[0, 0.6 + 1.05 * rise(3), -0.35]} scale={[1, Math.max(0.001, rise(3)), 1]} castShadow receiveShadow />
      {cols.map((x, i) => {
        const p = rise(4 + i);
        return (
          <group key={x} position={[x, 0.6, 0.45]} scale={[1, Math.max(0.001, p), 1]}>
            <mesh geometry={g.col} material={m.ceramic} position={[0, 1.05, 0]} castShadow receiveShadow />
            <mesh geometry={g.cap} material={m.ceramic} position={[0, 2.12, 0]} castShadow />
            <mesh geometry={g.cap} material={m.ceramic} position={[0, 0.07, 0]} castShadow />
          </group>
        );
      })}
      <group position={[0, 2.95 + (1 - back(t, at + 0.55, 0.6)) * 1.5, 0.15]}>
        <mesh geometry={g.beam} material={m.ceramic} castShadow receiveShadow />
        <mesh geometry={g.plate} position={[0, 0, 0.81]}>
          <meshPhysicalMaterial map={plate} metalness={0.9} roughness={0.28} transparent />
        </mesh>
        <mesh geometry={g.ped} material={m.ceramic} position={[0, 0.21, 0]} castShadow />
      </group>
    </group>
  );
};

const Rope: React.FC<{ t: number; at: number; m: Mats; sign: THREE.Texture; span?: number; z?: number; openAt?: number }> = ({ t, at, m, sign, span = 2.55, z = 2.4, openAt }) => {
  const p = back(t, at, 0.6);
  const o = openAt === undefined ? 0 : k(t, openAt, 0.7, Easing.out(Easing.bounce));
  const sag = 0.42 * p;
  const swing = Math.sin(t * 2.3) * 0.04 * p * (1 - o);
  const L = new THREE.Vector3(-span + o * 0.5, 1.88 - o * 1.8, o * 0.7);
  const curve = React.useMemo(() => new THREE.CatmullRomCurve3([
    L, new THREE.Vector3(-span * 0.5, 1.88 - sag * 0.75 - o * 1.55, 0.05 + o * 0.5), new THREE.Vector3(swing, 1.88 - sag - o * 1.0, 0.08 + o * 0.3), new THREE.Vector3(span * 0.5, 1.88 - sag * 0.75 - o * 0.5, 0.05), new THREE.Vector3(span, 1.88, 0),
  ]), [span, sag, swing, o]); // eslint-disable-line react-hooks/exhaustive-deps
  const tube = React.useMemo(() => new THREE.TubeGeometry(curve, 80, 0.075, 20, false), [curve]);
  const post = React.useMemo(() => ({ base: new THREE.CylinderGeometry(0.34, 0.38, 0.07, 48), stem: new THREE.CylinderGeometry(0.065, 0.075, 1.9, 32), knob: new THREE.SphereGeometry(0.14, 32, 24), ring: new THREE.TorusGeometry(0.1, 0.03, 12, 32) }), []);
  const board = React.useMemo(() => rbox(2.1, 0.66, 0.06, 0.025), []);
  const face = React.useMemo(() => new THREE.PlaneGeometry(2.02, 0.6), []);
  const drop = (1 - k(t, at - 0.05, 0.35)) * 2.5;
  const signP = back(t, at + 0.2, 0.6);
  if (t < at - 0.1) return null;
  return (
    <group position={[0, drop, z]}>
      {[-span, span].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh geometry={post.base} material={m.brass} position={[0, 0.035, 0]} castShadow receiveShadow />
          <mesh geometry={post.stem} material={m.brass} position={[0, 0.98, 0]} castShadow />
          <mesh geometry={post.knob} material={m.brass} position={[0, 2.0, 0]} castShadow />
          <mesh geometry={post.ring} material={m.brass} position={[x < 0 ? 0.08 : -0.08, 1.88, 0]} rotation={[0, Math.PI / 2, 0]} />
        </group>
      ))}
      <mesh geometry={tube} material={m.velvet} castShadow />
      <group position={[swing - o * 0.2, 1.88 - sag - 0.08 - o * 0.62, 0.1 + o * 0.6]} rotation={[0.05 - o * 1.15, 0, swing * 2 + o * 0.22]} scale={Math.max(0.001, signP)}>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x * 0.9, -0.16, 0]} rotation={[0, 0, x > 0 ? 0.5 : -0.5]}>
            <cylinderGeometry args={[0.012, 0.012, 0.38, 8]} />
            <primitive object={m.brass} attach="material" />
          </mesh>
        ))}
        <mesh geometry={board} position={[0, -0.62, 0]} castShadow>
          <meshPhysicalMaterial color="#FBF6EE" roughness={0.4} clearcoat={0.5} />
        </mesh>
        <mesh geometry={face} position={[0, -0.62, 0.032]}>
          <meshStandardMaterial map={sign} color="#D9D3CC" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

const plateTexture = (text: string) =>
  canvasTex(2048, 170, (c) => {
    c.clearRect(0, 0, 2048, 170);
    const g = c.createLinearGradient(0, 0, 0, 170);
    g.addColorStop(0, "#F6E1AE"); g.addColorStop(0.45, "#D2A85A"); g.addColorStop(0.55, "#A7803B"); g.addColorStop(1, "#E9CB86");
    roundRect(c, 4, 4, 2040, 162, 18);
    c.fillStyle = g; c.fill();
    c.font = "500 112px Newsreader";
    c.textAlign = "center"; c.textBaseline = "middle";
    (c as unknown as { letterSpacing: string }).letterSpacing = "26px";
    c.fillStyle = "rgba(255,240,205,0.8)"; c.fillText(text, 1024, 92);
    c.fillStyle = "#4E3810"; c.fillText(text, 1024, 88);
  });
const signTexture = (top: string, sub: string, color: string) =>
  canvasTex(1400, 416, (c) => {
    c.fillStyle = "#FBF6EE"; c.fillRect(0, 0, 1400, 416);
    roundRect(c, 22, 22, 1356, 372, 26);
    c.lineWidth = 14; c.strokeStyle = color; c.stroke();
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = color; c.font = "800 120px 'JetBrains Mono'";
    (c as unknown as { letterSpacing: string }).letterSpacing = "8px";
    c.fillText(top, 700, 170);
    (c as unknown as { letterSpacing: string }).letterSpacing = "0px";
    c.fillStyle = "#7C756B"; c.font = "italic 400 64px Newsreader"; c.fillText(sub, 700, 300);
  });

const billTexture = () =>
  canvasTex(1000, 1300, (c) => {
    c.fillStyle = "#FCF8F1"; c.fillRect(0, 0, 1000, 1300);
    c.fillStyle = "#C8322C"; c.fillRect(0, 0, 1000, 14);
    c.textBaseline = "alphabetic"; c.textAlign = "left";
    c.fillStyle = "#1E1A16"; c.font = "500 66px Newsreader"; c.fillText("Kanzlei", 80, 140);
    c.fillStyle = "#8A8178"; c.font = "800 30px 'JetBrains Mono'"; c.fillText("HONORARNOTE · RVG", 80, 196);
    c.fillStyle = "#E6DED2"; c.fillRect(80, 240, 840, 3);
    const rows: [string, string][] = [["Verfahrensgebühr 1,3", "···"], ["Terminsgebühr 1,2", "···"], ["Auslagen", "···"], ["+ USt. 19 %", "···"]];
    rows.forEach(([a, b], i) => {
      const y = 330 + i * 92;
      c.fillStyle = "#2E2924"; c.font = "400 46px Newsreader"; c.fillText(a, 80, y);
      c.textAlign = "right"; c.fillStyle = "#A39A90"; c.fillText(b, 920, y); c.textAlign = "left";
      c.fillStyle = "#EFE8DD"; c.fillRect(80, y + 30, 840, 2);
    });
    c.fillStyle = "#1E1A16"; c.fillRect(80, 760, 840, 4);
    c.fillStyle = "#8A8178"; c.font = "800 30px 'JetBrains Mono'"; c.fillText("SUMME 1. INSTANZ", 80, 840);
    c.fillStyle = "#A8140F"; c.font = "600 150px Newsreader"; c.fillText("über 1.000 €", 70, 1000);
    c.fillStyle = "#A39A90"; c.font = "italic 400 40px Newsreader"; c.fillText("zahlbar vor Klageeinreichung", 80, 1090);
    c.save(); c.translate(720, 1180); c.rotate(-0.14);
    c.strokeStyle = "rgba(200,50,44,0.85)"; c.lineWidth = 9; roundRect(c, -190, -62, 380, 124, 14); c.stroke();
    c.fillStyle = "rgba(200,50,44,0.85)"; c.font = "800 58px 'JetBrains Mono'"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FÄLLIG", 0, 4);
    c.restore();
  });

// slightly curled paper sheet
const Bill: React.FC<{ t: number; at: number; tex: THREE.Texture }> = ({ t, at, tex }) => {
  const geo = React.useMemo(() => {
    const g = new THREE.PlaneGeometry(1.7, 2.2, 30, 30);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, 0.08 * Math.pow(x / 1.0, 2) + 0.05 * Math.max(0, (1.3 - y) / 2.6) ** 3);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const p = back(t, at, 0.7);
  const fall = 1 - k(t, at, 0.7);
  if (t < at - 0.05) return null;
  return (
    <group position={[0.3, 1.55 + fall * 3, 12.6]} rotation={[-0.42 - fall * 0.5, -0.12, -0.1 + fall * 0.4 + Math.sin(t * 1.4) * 0.015]} scale={Math.max(0.001, p) * 0.48}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial map={tex} color="#E2DCD4" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export type CourtProps = {
  t: number; from: number; courtAt: number; ropeAt: number; billAt?: number; openAt?: number;
  tone?: "red" | "green"; plate?: string; signTop?: string; signSub?: string; signColor?: string;
  cam?: (r: number) => { pos: [number, number, number]; look: [number, number, number]; fov: number };
  w?: number; h?: number;
};
const camBefore = (r: number) => ({ pos: [Math.sin(r * 0.25) * 0.8 - 0.4, 0.9 + r * 0.03, 19.5 - r * 0.45] as [number, number, number], look: [0, 2.45, 0.6] as [number, number, number], fov: 34 });

// real 3D court: courthouse rises, rope drops in front of it, sign swings; optional bill falls in, rope can open
export const Court3D: React.FC<CourtProps> = ({ t, from, courtAt, ropeAt, billAt, openAt, tone = "red", plate = "LANDGERICHT", signTop = "NUR MIT ANWALT", signSub = "§ 78 ZPO · Anwaltszwang", signColor = "#C8322C", cam = camBefore, w = 1080, h = 1920 }) => {
  const ready = useFontsReady();
  const tex = React.useMemo(() => (ready ? { plate: plateTexture(plate), sign: signTexture(signTop, signSub, signColor), bill: billTexture() } : null), [ready, plate, signTop, signSub, signColor]);
  const m = useMats(tone);
  const c = cam(t - from);
  if (!tex) return null;
  const green = tone === "green";
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={c.pos} look={c.look} fov={c.fov} />
      <fog attach="fog" args={[green ? "#D7E6D8" : "#E9CDBE", 18, 40]} />
      <hemisphereLight args={["#FFF4E8", green ? "#B8D0BC" : "#D9B8A6", 0.25]} />
      <directionalLight position={[-7, 9, 9]} intensity={4.4} color="#FFE6CC" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-radius={4} shadow-bias={-0.0008} shadow-normalBias={0.03} />
      <directionalLight position={[7, 3, 8]} intensity={0.5} color="#FFE2D4" />
      <directionalLight position={[6, 5, -7]} intensity={2.2} color={green ? "#5FCB8A" : "#FF6A50"} />
      <pointLight position={[0, 1.2, 4.5]} intensity={5} distance={9} color={green ? "#E2FFE9" : "#FFC9A0"} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.floor}>
        <planeGeometry args={[80, 80]} />
      </mesh>
      <Courthouse t={t} at={courtAt} m={m} plate={tex.plate} position={[0, 0, -0.6]} />
      <Rope t={t} at={ropeAt} m={m} sign={tex.sign} openAt={openAt} />
      {billAt !== undefined && <Bill t={t} at={billAt} tex={tex.bill} />}
    </ThreeCanvas>
  );
};
export const CourtBefore3D = Court3D;

// standalone test comp
export const CourtTest: React.FC = () => {
  const t = useCurrentFrame() / 25;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #D98A6E 0%, #EDB9A0 30%, #F1D6C6 55%, #E9CDBE 75%)" }}>
      <CourtBefore3D t={t} from={0} courtAt={0.2} ropeAt={1.2} billAt={2.2} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(70,25,10,0.35))" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", color: "#FFF8F2", textShadow: "0 6px 30px rgba(120,40,20,0.35)" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontWeight: 800, fontSize: 26, letterSpacing: "0.4em" }}>SO WAR ES</div>
        <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 150, lineHeight: 1, marginTop: 8 }}>bis 2025</div>
      </div>
    </AbsoluteFill>
  );
};

// split panel test: Amtsgericht, rope opens
export const camNow = (r: number) => ({ pos: [Math.sin(r * 0.3) * 0.6 + 0.2, 1.5 + r * 0.04, 11.8 - r * 0.5] as [number, number, number], look: [0, 1.75, 0.6] as [number, number, number], fov: 30 });
export const CourtNowTest: React.FC = () => {
  const t = useCurrentFrame() / 25;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #8FC4A0 0%, #C4E0CB 45%, #DDEBDF 80%)" }}>
      <Court3D t={t} from={0} courtAt={0.1} ropeAt={0} openAt={1.2} tone="green" plate="AMTSGERICHT" signTop="NUR MIT ANWALT" cam={camNow} w={1080} h={820} />
    </AbsoluteFill>
  );
};
