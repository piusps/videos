import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SIMPLE_ICONS } from "../components/logoPaths";

// FP-N "Belegkasse" (2026-11-01): real three.js still life for the hook and the "an der Kasse" beat -
// a light stone counter, a curled thermal receipt (canvas-printed, invented station, BEISPIEL) and a titanium phone
// whose screen is redrawn every frame: camera viewfinder (shutter + flash) or the light Claude app with the extracted
// row (Firma, Datum, Betrag, MwSt., Konto). The receipt ink can fade ("verblasst"). Render with --gl=angle.

const sm = (u: number) => { const x = Math.min(1, Math.max(0, u)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  React.useMemo(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = 0.55;
  }, [gl, scene]);
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

// ---------- receipt (thermal paper) ----------
export const BON = { firm: "TANKSTELLE AM RING", date: "03.11.2026", time: "08:14", brutto: "84,37", netto: "70,90", mwst: "13,47", liter: "49,66", preis: "1,699" };
const RW = 420, RH = 1000;
export const drawReceipt = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, ink = 1) => {
  const s = w / RW;
  g.save(); g.translate(x, y); g.scale(s, h / RH);
  g.fillStyle = "#FBFAF6"; g.fillRect(0, 0, RW, RH);
  const a = (o: number) => `rgba(34,32,30,${o * ink})`;
  g.textAlign = "center"; g.fillStyle = a(1);
  g.font = "800 34px 'JetBrains Mono', monospace"; g.fillText("TANKSTELLE", RW / 2, 74); g.fillText("AM RING", RW / 2, 114);
  g.font = "500 21px 'JetBrains Mono', monospace"; g.fillStyle = a(0.85);
  g.fillText("Ringstr. 12 · 50667 Köln", RW / 2, 152); g.fillText("St.-Nr. 214/5555/0000", RW / 2, 180);
  g.textAlign = "left"; g.font = "600 22px 'JetBrains Mono', monospace";
  g.fillText(`${BON.date}  ${BON.time}`, 30, 232); g.fillText("Bon 4711  Kasse 2", 30, 262);
  g.fillStyle = a(0.5); g.fillRect(30, 286, RW - 60, 2);
  g.fillStyle = a(1); g.font = "700 25px 'JetBrains Mono', monospace";
  g.fillText("Super E10  Säule 4", 30, 330);
  g.font = "500 21px 'JetBrains Mono', monospace"; g.fillText(`${BON.liter} l x ${BON.preis} €/l`, 30, 364);
  g.textAlign = "right"; g.font = "700 25px 'JetBrains Mono', monospace"; g.fillText(`${BON.brutto} A`, RW - 30, 364);
  g.textAlign = "left"; g.fillStyle = a(0.5); g.fillRect(30, 392, RW - 60, 2);
  g.fillStyle = a(1); g.font = "800 34px 'JetBrains Mono', monospace"; g.fillText("SUMME EUR", 30, 444);
  g.textAlign = "right"; g.fillText(BON.brutto, RW - 30, 444);
  g.textAlign = "left"; g.font = "500 21px 'JetBrains Mono', monospace"; g.fillStyle = a(0.85);
  g.fillText("A  MwSt 19%", 30, 494); g.textAlign = "right"; g.fillText(BON.mwst, RW - 30, 494);
  g.textAlign = "left"; g.fillText("   Netto", 30, 522); g.textAlign = "right"; g.fillText(BON.netto, RW - 30, 522);
  g.textAlign = "left"; g.fillText("Kartenzahlung girocard", 30, 568);
  g.fillStyle = a(0.5); g.fillRect(30, 594, RW - 60, 2);
  g.fillStyle = a(0.7); g.font = "500 17px 'JetBrains Mono', monospace";
  g.fillText("TSE-Signatur: MEUCIQD4x7…", 30, 630); g.fillText("TSE-Start 2026-11-03T08:13:52", 30, 654);
  // QR-like block (invented pattern)
  const qx = RW / 2 - 90, qy = 690, cs = 12;
  for (let i = 0; i < 15; i++) for (let j = 0; j < 15; j++) {
    const corner = (i < 4 && j < 4) || (i > 10 && j < 4) || (i < 4 && j > 10);
    const on = corner ? (i % 11 === 0 || j % 11 === 0 || i % 11 === 3 || j % 11 === 3 || (i % 11 > 0 && i % 11 < 3 && j % 11 > 0 && j % 11 < 3)) : Math.sin(i * 12.9898 + j * 78.233) * 43758.5 % 1 > 0.1;
    if (on) { g.fillStyle = a(0.9); g.fillRect(qx + i * cs, qy + j * cs, cs, cs); }
  }
  g.textAlign = "center"; g.fillStyle = a(0.85); g.font = "600 21px 'JetBrains Mono', monospace"; g.fillText("Vielen Dank, gute Fahrt!", RW / 2, 920);
  g.fillStyle = "rgba(160,120,40,0.55)"; g.font = "800 18px 'JetBrains Mono', monospace"; g.fillText("BEISPIEL", RW / 2, 962);
  g.restore();
};

// ---------- phone screen ----------
export type ScreenState = { mode: "camera" | "result"; aim?: number; flash?: number; rows?: number[]; konto?: number; sent?: number };
const SW = 640, SH = 1380;
const claudeMark = new Path2D(SIMPLE_ICONS.claude.d);
const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
export const ROWS: [string, string][] = [["Firma", "Tankstelle Am Ring"], ["Datum", "03.11.2026"], ["Betrag", "84,37 €"], ["MwSt. 19 %", "13,47 €"], ["Konto", "4530 Kfz · SKR03"]];
const drawScreen = (g: CanvasRenderingContext2D, s: ScreenState) => {
  g.clearRect(0, 0, SW, SH);
  if (s.mode === "camera") {
    g.fillStyle = "#0E0E0E"; g.fillRect(0, 0, SW, SH);
    const aim = s.aim ?? 1;
    const rw = 300 + 60 * aim, rh = rw * (RH / RW) * 0.82;
    g.save(); g.translate(SW / 2, 640); g.rotate((1 - aim) * 0.12); drawReceipt(g, -rw / 2, -rh / 2, rw, rh); g.restore();
    g.strokeStyle = aim > 0.95 ? "#F5C542" : "rgba(255,255,255,0.85)"; g.lineWidth = 7;
    const bx = SW / 2 - rw / 2 - 26, by = 640 - rh / 2 - 26, bw = rw + 52, bh = rh + 52, L = 60;
    [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(([x, y, dx, dy]) => { g.beginPath(); g.moveTo(x, y + dy * L); g.lineTo(x, y); g.lineTo(x + dx * L, y); g.stroke(); });
    g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(0, 0, SW, 130); g.fillRect(0, SH - 250, SW, 250);
    g.fillStyle = "#FFF"; g.font = "600 34px Inter, Arial, sans-serif"; g.textAlign = "center"; g.fillText("Foto für Claude", SW / 2, 86);
    g.beginPath(); g.arc(SW / 2, SH - 128, 66, 0, Math.PI * 2); g.fillStyle = "#FFF"; g.fill();
    g.beginPath(); g.arc(SW / 2, SH - 128, 54, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = "#0E0E0E"; g.stroke();
    if ((s.flash ?? 0) > 0) { g.fillStyle = `rgba(255,255,255,${s.flash})`; g.fillRect(0, 0, SW, SH); }
    return;
  }
  // light Claude app, project chat "Belege 2026-11"
  g.fillStyle = "#FAF9F5"; g.fillRect(0, 0, SW, SH);
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, SW, 150); g.fillStyle = "#E3DFD5"; g.fillRect(0, 150, SW, 2);
  g.fillStyle = "#1F1E1D"; g.font = "600 30px Inter, Arial, sans-serif"; g.textAlign = "left"; g.fillText("‹", 30, 104);
  g.save(); g.translate(70, 66); g.scale(1.9, 1.9); g.fillStyle = SIMPLE_ICONS.claude.hex; g.fill(claudeMark); g.restore();
  g.fillStyle = "#1F1E1D"; g.font = "700 31px Inter, Arial, sans-serif"; g.fillText("Belegkasse", 130, 96);
  g.fillStyle = "#77746C"; g.font = "500 22px Inter, Arial, sans-serif"; g.fillText("Belege 2026-11", 130, 128);
  // user photo bubble
  const sent = s.sent ?? 1;
  g.save(); g.globalAlpha = sent; g.translate(0, (1 - sent) * 60);
  rr(g, SW - 290, 186, 250, 300, 26); g.fillStyle = "#F0EEE6"; g.fill();
  g.save(); rr(g, SW - 276, 200, 222, 272, 18); g.clip(); g.fillStyle = "#CFC6B8"; g.fillRect(SW - 276, 200, 222, 272); drawReceipt(g, SW - 236, 214, 142, 250); g.restore();
  g.restore();
  // Claude answer card
  const rows = s.rows ?? [1, 1, 1, 1, 1];
  g.save(); g.translate(40, 528); g.scale(1.05, 1.05); g.fillStyle = SIMPLE_ICONS.claude.hex; g.fill(claudeMark); g.restore();
  rr(g, 36, 580, SW - 72, 560, 30); g.fillStyle = "#FFFFFF"; g.fill(); g.lineWidth = 2.5; g.strokeStyle = "#E3DFD5"; g.stroke();
  ROWS.forEach(([k2, v], i) => {
    const p = rows[i] ?? 0;
    const y = 640 + i * 104;
    if (i) { g.fillStyle = "#EFEBE4"; g.fillRect(64, y - 34, SW - 128, 2); }
    g.globalAlpha = Math.max(0.12, p);
    g.fillStyle = "#77746C"; g.font = "600 25px 'JetBrains Mono', monospace"; g.textAlign = "left"; g.fillText(k2.toUpperCase(), 66, y + 6);
    const isK = i === 4;
    g.font = `${isK ? 800 : 700} ${isK ? 33 : 34}px Inter, Arial, sans-serif`; g.textAlign = "right";
    if (isK && (s.konto ?? 0) > 0) {
      const tw = g.measureText(v).width;
      rr(g, SW - 66 - tw - 24, y - 34, (tw + 36) * Math.min(1, s.konto ?? 0), 56, 14); g.fillStyle = "#D97757"; g.fill();
      g.fillStyle = "#FFFFFF";
    } else g.fillStyle = "#1F1E1D";
    g.fillText(v, SW - 66, y + 8);
    g.globalAlpha = 1;
  });
  // composer
  rr(g, 30, SH - 170, SW - 60, 120, 40); g.fillStyle = "#FFFFFF"; g.fill(); g.strokeStyle = "#E3DFD5"; g.stroke();
  g.fillStyle = "#77746C"; g.font = "500 28px Inter, Arial, sans-serif"; g.textAlign = "left"; g.fillText("Antworten …", 70, SH - 100);
  rr(g, SW - 120, SH - 150, 70, 70, 20); g.fillStyle = "#C96442"; g.fill();
  g.strokeStyle = "#FFF"; g.lineWidth = 6; g.beginPath(); g.moveTo(SW - 85, SH - 98); g.lineTo(SW - 85, SH - 132); g.moveTo(SW - 99, SH - 118); g.lineTo(SW - 85, SH - 132); g.lineTo(SW - 71, SH - 118); g.stroke();
};

// rounded-rect slab (phone body)
const slab = (w: number, h: number, d: number, r: number) => {
  const sh = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  sh.moveTo(x + r, y); sh.lineTo(x + w - r, y); sh.quadraticCurveTo(x + w, y, x + w, y + r); sh.lineTo(x + w, y + h - r); sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  sh.lineTo(x + r, y + h); sh.quadraticCurveTo(x, y + h, x, y + h - r); sh.lineTo(x, y + r); sh.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 6, curveSegments: 20 });
  geo.translate(0, 0, -d / 2);
  return geo;
};
const roundedPlane = (w: number, h: number, r: number) => {
  const sh = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  sh.moveTo(x + r, y); sh.lineTo(x + w - r, y); sh.quadraticCurveTo(x + w, y, x + w, y + r); sh.lineTo(x + w, y + h - r); sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  sh.lineTo(x + r, y + h); sh.quadraticCurveTo(x, y + h, x, y + h - r); sh.lineTo(x, y + r); sh.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ShapeGeometry(sh, 20);
  const pos = geo.attributes.position; const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  return geo;
};

// receipt mesh with a gentle curl (thermal paper rolls up at the ends)
const receiptGeo = (w: number, h: number, curl: number) => {
  const geo = new THREE.PlaneGeometry(w, h, 2, 40);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const yy = pos.getY(i) / (h / 2);
    pos.setZ(i, curl * (Math.pow(Math.abs(yy), 3) * 0.55 + Math.sin(yy * 3.1) * 0.04));
  }
  geo.computeVertexNormals();
  return geo;
};

export type PhonePose = { pos: [number, number, number]; rot: [number, number, number] };
export const BonScene3D: React.FC<{
  t: number; w: number; h: number; screen: ScreenState; phone: PhonePose; ink?: number;
  cam?: { pos: [number, number, number]; look: [number, number, number]; fov: number }; receipt?: { pos: [number, number, number]; rotZ: number; slide?: number };
}> = ({ t, w, h, screen, phone, ink = 1, cam, receipt }) => {
  const res = React.useMemo(() => {
    const rc = document.createElement("canvas"); rc.width = RW; rc.height = RH;
    const rtex = new THREE.CanvasTexture(rc); rtex.colorSpace = THREE.SRGBColorSpace; rtex.anisotropy = 8;
    const sc = document.createElement("canvas"); sc.width = SW; sc.height = SH;
    const stex = new THREE.CanvasTexture(sc); stex.colorSpace = THREE.SRGBColorSpace; stex.anisotropy = 8;
    return {
      rc, rtex, sc, stex,
      paper: new THREE.MeshStandardMaterial({ map: rtex, roughness: 0.55, side: THREE.DoubleSide }),
      body: new THREE.MeshPhysicalMaterial({ color: "#CFCBC4", metalness: 0.85, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#0B0B0C", roughness: 0.08, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 }),
      screen: new THREE.MeshBasicMaterial({ map: stex, toneMapped: false }),
      counter: new THREE.MeshPhysicalMaterial({ color: "#EFE8DE", roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
      edge: new THREE.MeshStandardMaterial({ color: "#C9A27E", roughness: 0.6 }),
      phoneGeo: slab(3.0, 6.3, 0.26, 0.5), glassGeo: roundedPlane(2.96, 6.26, 0.46), screenGeo: roundedPlane(2.78, 6.06, 0.36),
      rGeo: receiptGeo(1.75, 4.15, 0.35),
    };
  }, []);
  const rg = res.rc.getContext("2d")!; rg.clearRect(0, 0, RW, RH); drawReceipt(rg, 0, 0, RW, RH, ink); res.rtex.needsUpdate = true;
  const sg = res.sc.getContext("2d")!; drawScreen(sg, screen); res.stex.needsUpdate = true;
  const c = cam ?? { pos: [Math.sin(t * 0.25) * 0.6, 7.6 + Math.sin(t * 0.3) * 0.15, 6.4 - t * 0.06] as [number, number, number], look: [0, 0.4, -0.3] as [number, number, number], fov: 40 };
  const rp = receipt ?? { pos: [-1.6, 0.03, 0.2] as [number, number, number], rotZ: 0.18 };
  const slide = receipt?.slide ?? 1;
  return (
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, alpha: true }}>
      <Env />
      <Cam pos={c.pos} look={c.look} fov={c.fov} />
      <hemisphereLight args={["#FFF4E8", "#E2BFA9", 0.5]} />
      <directionalLight position={[-5, 12, 6]} intensity={2.6} color="#FFE9D2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-radius={6} shadow-bias={-0.0004} />
      <directionalLight position={[7, 4, -5]} intensity={1.2} color="#FFB08A" />
      {/* counter top */}
      <mesh position={[0, -0.12, -1]} material={res.counter} receiveShadow><boxGeometry args={[30, 0.24, 14]} /></mesh>
      <mesh position={[0, -0.12, 6.02]} material={res.edge} receiveShadow><boxGeometry args={[30, 0.26, 0.06]} /></mesh>
      {/* receipt */}
      <group position={[rp.pos[0], rp.pos[1] + (1 - slide) * 0.3, rp.pos[2] - (1 - slide) * 3]} rotation={[-Math.PI / 2, 0, rp.rotZ]}>
        <mesh geometry={res.rGeo} material={res.paper} castShadow receiveShadow />
      </group>
      {/* phone */}
      <group position={phone.pos} rotation={phone.rot}>
        <mesh geometry={res.phoneGeo} material={res.body} castShadow receiveShadow />
        <mesh geometry={res.glassGeo} material={res.glass} position={[0, 0, 0.175]} />
        <mesh geometry={res.screenGeo} material={res.screen} position={[0, 0, 0.18]} />
        {/* dynamic island */}
        <mesh position={[0, 2.78, 0.185]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.09, 0.42, 4, 12]} /><meshBasicMaterial color="#000" /></mesh>
      </group>
    </ThreeCanvas>
  );
};
export { sm as bonSm, lerp as bonLerp };
