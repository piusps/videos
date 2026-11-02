import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// FP-N "Bescheid-Check" (2026-11-01): real three.js objects.
// 1) BescheidDesk3D - the hook: Steuererklärung (left) and Steuerbescheid (right) lean side by side on a warm desk. Claude has
//    already linked the rows (orange dotted threads) and marked every deviation in red, with floating amount tags
//    ("GESTRICHEN −1.260 €", "GEKÜRZT −710 €", "GEKÜRZT −144 €"). Camera can dolly into the fine print (Erläuterungen) that
//    gets a marker highlight. Neutral Bescheid look (no logo, no eagle, invented Finanzamt "Musterstadt"), all numbers BEISPIEL.
// 2) FristCalendar3D - tear-off desk calendar: pages flip from the Bekanntgabe day to the last day of the Einspruchsfrist.
// Render with --gl=angle.

const sm = (u: number) => { const x = Math.min(1, Math.max(0, u)); return x * x * (3 - 2 * x); };
const back = (u: number) => { const x = Math.min(1, Math.max(0, u)); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

const Env: React.FC<{ exposure?: number }> = ({ exposure = 1.05 }) => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.55;
  }, [gl, scene, exposure]);
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
const tex = (c: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; };
const canvas = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")!] as const; };
const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };

// ---------- document content ----------
export const ROWS = [
  { n: "Arbeitszimmer", e: "1.260,00", b: "0,00", dev: "GESTRICHEN", d: "−1.260 €" },
  { n: "Fahrtkosten Kunden", e: "2.140,00", b: "1.430,00", dev: "GEKÜRZT", d: "−710 €" },
  { n: "Bewirtung", e: "480,00", b: "336,00", dev: "GEKÜRZT", d: "−144 €" },
  { n: "Software / Lizenzen", e: "1.190,00", b: "1.190,00" },
  { n: "Telefon / Internet", e: "624,00", b: "624,00" },
  { n: "Fortbildung", e: "890,00", b: "890,00" },
];
const CW = 900, CH = 1272; // canvas px (A4 ratio)
const ROW_Y0 = 440, ROW_H = 74;
const ERL_Y = 1000; // fine print block (Bescheid only)
const docTex = (kind: "erkl" | "besch") => {
  const [c, g] = canvas(CW, CH);
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, CW, CH);
  const F = "Inter, Arial, sans-serif", M = "'JetBrains Mono', monospace";
  g.fillStyle = "#1F1E1D";
  if (kind === "besch") {
    g.font = `500 22px ${F}`; g.fillStyle = "#55524C"; g.fillText("Finanzamt Musterstadt", 60, 78); g.fillText("Steuernummer 123/456/78901", 60, 108);
    g.textAlign = "right"; g.fillText("Datum 29.10.2026", CW - 60, 78); g.textAlign = "left";
    g.fillStyle = "#1F1E1D"; g.font = `800 44px ${F}`; g.fillText("Bescheid für 2025", 60, 200);
    g.font = `600 30px ${F}`; g.fillText("über Einkommensteuer", 60, 244);
  } else {
    g.font = `500 22px ${F}`; g.fillStyle = "#55524C"; g.fillText("Übermittelt am 14.06.2026", 60, 78); g.fillText("Steuernummer 123/456/78901", 60, 108);
    g.fillStyle = "#1F1E1D"; g.font = `800 44px ${F}`; g.fillText("Steuererklärung 2025", 60, 200);
    g.font = `600 30px ${F}`; g.fillText("Anlage EÜR · deine Angaben", 60, 244);
  }
  g.fillStyle = kind === "besch" ? "#2A3A5C" : "#D97757"; g.fillRect(60, 290, CW - 120, 6);
  g.font = `700 20px ${M}`; g.fillStyle = "#77746C"; g.fillText("BETRIEBSAUSGABEN", 60, 360); g.textAlign = "right"; g.fillText(kind === "besch" ? "LT. BESCHEID €" : "ERKLÄRT €", CW - 60, 360); g.textAlign = "left";
  ROWS.forEach((r, i) => {
    const y = ROW_Y0 + i * ROW_H;
    g.fillStyle = i % 2 ? "#FFFFFF" : "#F7F4EE"; g.fillRect(48, y - 46, CW - 96, ROW_H);
    g.fillStyle = "#1F1E1D"; g.font = `600 30px ${F}`; g.fillText(r.n, 64, y);
    g.font = `700 30px ${M}`; g.textAlign = "right"; g.fillText(kind === "besch" ? r.b : r.e, CW - 64, y); g.textAlign = "left";
  });
  g.strokeStyle = "#CFCAC0"; g.lineWidth = 2; g.beginPath(); g.moveTo(60, ROW_Y0 + 6 * ROW_H - 30); g.lineTo(CW - 60, ROW_Y0 + 6 * ROW_H - 30); g.stroke();
  g.font = `800 30px ${F}`; g.fillStyle = "#1F1E1D"; g.fillText("Summe", 64, ROW_Y0 + 6 * ROW_H + 20);
  g.font = `800 30px ${M}`; g.textAlign = "right"; g.fillText(kind === "besch" ? "4.470,00" : "6.584,00", CW - 64, ROW_Y0 + 6 * ROW_H + 20); g.textAlign = "left";
  if (kind === "besch") {
    g.font = `700 18px ${M}`; g.fillStyle = "#77746C"; g.fillText("ERLÄUTERUNGEN", 60, ERL_Y - 34);
    g.font = `400 17px ${F}`; g.fillStyle = "#6A665E";
    const L = ["Die Aufwendungen für das häusliche Arbeitszimmer konnten nicht berücksichtigt", "werden, da der Mittelpunkt der Tätigkeit nicht nachgewiesen wurde.",
      "Fahrtkosten wurden nur in Höhe der nachgewiesenen Fahrten angesetzt. Bewirtungs-", "aufwendungen sind nur zu 70 % abziehbar. Der Bescheid ergeht unter dem",
      "Vorbehalt der Nachprüfung. Gegen diesen Bescheid ist der Einspruch zulässig. Er ist", "innerhalb eines Monats nach Bekanntgabe einzulegen."];
    L.forEach((l, i) => g.fillText(l, 60, ERL_Y + i * 26));
  } else {
    for (let j = 0; j < 5; j++) { g.fillStyle = "#ECE8E1"; g.fillRect(60, ERL_Y - 30 + j * 30, 360 + ((j * 97) % 300), 10); }
  }
  return tex(c);
};
const tagTex = (text: string, amount: string, red: boolean) => {
  const [c, g] = canvas(640, 150);
  rr(g, 4, 4, 632, 142, 30); g.fillStyle = red ? "#D2403A" : "#E08A2E"; g.fill();
  g.fillStyle = "#FFFFFF"; g.font = "800 46px 'JetBrains Mono', monospace"; g.fillText(text, 34, 92);
  g.textAlign = "right"; g.font = "800 54px Inter, Arial, sans-serif"; g.fillText(amount, 610, 96);
  return tex(c);
};
// sheet geometry in world units
const SW = 3.1, SH = (SW * CH) / CW;
const px2 = (x: number, y: number) => [(x / CW - 0.5) * SW, (0.5 - y / CH) * SH] as const;

export type DeskProps = {
  t: number; w: number; h: number;
  marks: number[]; // time each row deviation gets marked (3 values)
  erl: number; // time the fine print gets highlighted
  zoomIn: number; zoomOut: number; // camera dolly to the fine print and back
};
export const BescheidDesk3D: React.FC<DeskProps> = ({ t, w, h, marks, erl, zoomIn, zoomOut }) => {
  const res = React.useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: "#F2EEE6", roughness: 0.9 });
    const mk = (k: "erkl" | "besch") => { const m = new THREE.MeshStandardMaterial({ map: docTex(k), roughness: 0.78 }); return [edge, edge, edge, edge, m, edge]; };
    return {
      erkl: mk("erkl"), besch: mk("besch"),
      tags: ROWS.slice(0, 3).map((r, i) => new THREE.MeshBasicMaterial({ map: tagTex(r.dev!, r.d!, i === 0), transparent: true, toneMapped: false })),
      red: new THREE.MeshBasicMaterial({ color: "#D2403A", transparent: true, opacity: 0.2, toneMapped: false, depthWrite: false }),
      redLine: new THREE.MeshBasicMaterial({ color: "#D2403A", toneMapped: false }),
      orange: new THREE.MeshBasicMaterial({ color: "#D97757", toneMapped: false }),
      orangeSoft: new THREE.MeshBasicMaterial({ color: "#D97757", transparent: true, opacity: 0.16, toneMapped: false, depthWrite: false }),
      marker: new THREE.MeshBasicMaterial({ color: "#FFB45A", transparent: true, opacity: 0.5, toneMapped: false, depthWrite: false }),
      desk: new THREE.MeshPhysicalMaterial({ color: "#E9D8C4", roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
      stand: new THREE.MeshPhysicalMaterial({ color: "#D97757", roughness: 0.35, clearcoat: 0.6 }),
    };
  }, []);
  const LEAN = -0.3; // sheets lean back, pivot on their bottom edge
  const GX = [-1.78, 1.78];
  // sheet-local (x right, y up from the bottom edge, z out of the paper) → world
  const wp = (i: number, lx: number, ly: number, lz = 0): [number, number, number] => [GX[i] + lx, ly * Math.cos(LEAN) - lz * Math.sin(LEAN), 0.3 + ly * Math.sin(LEAN) + lz * Math.cos(LEAN)];
  const ly = (py: number) => SH / 2 + px2(0, py)[1];
  const zoom = sm((t - zoomIn) / 0.6) * (1 - sm((t - zoomOut) / 0.55));
  const ex = px2(430, 0)[0], ey = ly(ERL_Y + 40);
  const wide = { p: [Math.sin(t * 0.25) * 0.45, 3.0 + Math.sin(t * 0.33) * 0.08, 10.4 - t * 0.06], l: [0, 1.95, 0] };
  const fp = wp(1, ex, ey, 0);
  const close = { p: [fp[0] + 0.35, fp[1] + 0.75, fp[2] + 3.4], l: fp };
  const lerp = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * zoom) as [number, number, number];
  const rowH = (ROW_H / CH) * SH * 0.92;
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={lerp(wide.p, close.p)} look={lerp(wide.l, close.l)} fov={34} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.5]} />
      <directionalLight position={[-5, 9, 9]} intensity={2.7} color="#FFE9D2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-radius={6} shadow-bias={-0.0004} />
      <directionalLight position={[7, 4, -5]} intensity={1.3} color="#FFB08A" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={res.desk} receiveShadow><planeGeometry args={[40, 20]} /></mesh>
      {[res.erkl, res.besch].map((m, i) => (
        <group key={i} position={[GX[i], 0, 0.3]} rotation={[LEAN, 0, 0]}>
          <mesh position={[0, SH / 2, 0]} material={m} castShadow receiveShadow><boxGeometry args={[SW, SH, 0.02]} /></mesh>
          {ROWS.slice(0, 3).map((_, r) => {
            const y = ly(ROW_Y0 + r * ROW_H - 12);
            if (i === 0) {
              const p = sm((t - marks[r] + 0.1) / 0.3);
              return p > 0 ? <mesh key={r} position={[0, y, 0.013]} scale={[p, 1, 1]} material={res.orangeSoft}><planeGeometry args={[SW * 0.9, rowH]} /></mesh> : null;
            }
            const p = sm((t - marks[r]) / 0.28);
            const ax = px2(CW - 150, 0)[0];
            return p > 0 ? (
              <group key={r}>
                <mesh position={[0, y, 0.013]} scale={[p, 1, 1]} material={res.red}><planeGeometry args={[SW * 0.9, rowH]} /></mesh>
                <mesh position={[ax, y + 0.01, 0.016]} scale={[p, 1, 1]} rotation={[0, 0, 0.06]} material={res.redLine}><planeGeometry args={[0.6, 0.03]} /></mesh>
              </group>
            ) : null;
          })}
          {i === 1 ? [0, 1].map((j) => {
            const q = sm((t - erl - j * 0.22) / 0.3);
            const wl = ((j ? 610 : 790) / CW) * SW;
            const x0 = px2(56, 0)[0];
            return q > 0 ? <mesh key={j} position={[x0 + (wl * q) / 2, ly(ERL_Y - 7 + j * 26), 0.014]} material={res.marker}><planeGeometry args={[wl * q, (25 / CH) * SH]} /></mesh> : null;
          }) : null}
        </group>
      ))}
      {ROWS.slice(0, 3).map((_, r) => {
        const p = sm((t - marks[r] + 0.05) / 0.4);
        if (p <= 0) return null;
        const y = ly(ROW_Y0 + r * ROW_H - 12);
        const a = new THREE.Vector3(...wp(0, SW * 0.44, y, 0.03)), b = new THREE.Vector3(...wp(1, -SW * 0.44, y, 0.03));
        const mid = a.clone().add(b).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.12, 0.5));
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const N = 13;
        return Array.from({ length: N }, (_, j) => {
          const u = j / (N - 1);
          if (u > p) return null;
          const flow = 0.5 + 0.5 * Math.sin(t * 9 - u * 10);
          return <mesh key={`${r}-${j}`} position={curve.getPoint(u)} scale={0.032 + 0.012 * flow} material={res.orange}><sphereGeometry args={[1, 12, 12]} /></mesh>;
        });
      })}
      {ROWS.slice(0, 3).map((_, r) => {
        const p = back((t - marks[r] - 0.08) / 0.4);
        if (p <= 0.001) return null;
        const pos = wp(1, SW * 0.5 + 0.1, ly(ROW_Y0 + r * ROW_H - 12), 0.5);
        pos[1] += Math.sin(t * 1.8 + r) * 0.03;
        return (
          <mesh key={r} position={pos} rotation={[-0.08, -0.22, 0.02]} scale={[p, p, p]} material={res.tags[r]}>
            <planeGeometry args={[1.62, 0.38]} />
          </mesh>
        );
      })}
    </ThreeCanvas>
  );
};

// ---------- tear-off desk calendar ----------
const WD = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
const MN = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];
const pageTex = (d: Date, last: boolean) => {
  const [c, g] = canvas(512, 600);
  g.fillStyle = "#FFFDF8"; g.fillRect(0, 0, 512, 600);
  g.fillStyle = last ? "#D2403A" : "#D97757"; g.fillRect(0, 0, 512, 150);
  g.fillStyle = "#FFFFFF"; g.font = "800 84px Inter, Arial, sans-serif"; g.textAlign = "center"; g.fillText(`${MN[d.getMonth()]} ${d.getFullYear()}`, 256, 108);
  g.fillStyle = last ? "#9B231E" : "#1F1E1D"; g.font = "800 300px Inter, Arial, sans-serif"; g.fillText(String(d.getDate()).padStart(2, "0"), 256, 430);
  g.font = "700 56px 'JetBrains Mono', monospace"; g.fillStyle = "#77746C"; g.fillText(WD[d.getDay()], 256, 530);
  return tex(c);
};
export const CAL_DATES = ["2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30", "2026-12-02"].map((s) => new Date(`${s}T12:00:00`));
export const FristCalendar3D: React.FC<{ t: number; w: number; h: number; flipFrom: number; flipTo: number; ring: number }> = ({ t, w, h, flipFrom, flipTo, ring }) => {
  const res = React.useMemo(() => {
    const paperEdge = new THREE.MeshStandardMaterial({ color: "#F1EADF", roughness: 0.9 });
    return {
      pages: CAL_DATES.map((d, i) => { const m = new THREE.MeshStandardMaterial({ map: pageTex(d, i === CAL_DATES.length - 1), roughness: 0.75, side: THREE.DoubleSide }); return [paperEdge, paperEdge, paperEdge, paperEdge, m, m]; }),
      block: new THREE.MeshPhysicalMaterial({ color: "#2A2622", roughness: 0.35, clearcoat: 0.7 }),
      ringMat: new THREE.MeshPhysicalMaterial({ color: "#C9A26B", metalness: 1, roughness: 0.25 }),
      stack: new THREE.MeshStandardMaterial({ color: "#F4EEE3", roughness: 0.95 }),
      circle: new THREE.MeshBasicMaterial({ color: "#D2403A", toneMapped: false }),
      floor: new THREE.ShadowMaterial({ opacity: 0.22 }),
    };
  }, []);
  const n = CAL_DATES.length;
  const PW3 = 2.6, PH3 = (PW3 * 600) / 512;
  const LEAN = -0.38;
  // page i flips away during [flipFrom, flipTo]
  const flipAt = (i: number) => flipFrom + (i * (flipTo - flipFrom)) / (n - 1);
  const rp = sm((t - ring) / 0.45);
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env exposure={1.0} />
      <Cam pos={[Math.sin(t * 0.3) * 0.6 + 0.8, 2.3, 7.2 - t * 0.05]} look={[0, 1.55, 0]} fov={34} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.5]} />
      <directionalLight position={[-4, 8, 7]} intensity={2.6} color="#FFE9D2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-radius={5} />
      <directionalLight position={[6, 3, -4]} intensity={1.2} color="#FFB08A" />
      <group position={[0, 0, 0]} rotation={[LEAN, 0, 0]}>
        {/* backing board + base */}
        <mesh position={[0, PH3 / 2 + 0.05, -0.12]} material={res.block} castShadow receiveShadow><boxGeometry args={[PW3 + 0.3, PH3 + 0.4, 0.12]} /></mesh>
        <mesh position={[0, PH3 / 2 + 0.02, -0.04]} material={res.stack} castShadow><boxGeometry args={[PW3 - 0.02, PH3 - 0.04, 0.06]} /></mesh>
        {[-0.8, -0.27, 0.27, 0.8].map((x) => <mesh key={x} position={[x, PH3 + 0.06, 0.02]} rotation={[0, Math.PI / 2, 0]} material={res.ringMat}><torusGeometry args={[0.1, 0.025, 10, 24]} /></mesh>)}
        {CAL_DATES.map((_, i) => {
          const f = i === n - 1 ? 0 : sm((t - flipAt(i)) / 0.32);
          if (f >= 1) return null;
          return (
            <group key={i} position={[0, PH3 + 0.04, 0.02 + (n - i) * 0.004]} rotation={[-f * Math.PI * 0.95, 0, 0]}>
              <mesh position={[0, -PH3 / 2, 0]} material={res.pages[i]} castShadow><boxGeometry args={[PW3, PH3, 0.004]} /></mesh>
            </group>
          );
        })}
        {/* red ring drawn around the last day */}
        {rp > 0 ? <mesh position={[0, PH3 * 0.35 + 0.02, 0.06]} rotation={[0, 0, Math.PI / 2]} material={res.circle}><torusGeometry args={[0.92, 0.05, 10, 64, Math.PI * 2 * rp]} /></mesh> : null}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={res.floor} receiveShadow><planeGeometry args={[30, 30]} /></mesh>
    </ThreeCanvas>
  );
};
