// "KI gründet eine Firma, ganz alleine" · Tag 1 (Neustart, @pickthecompany, 2026-10-26) · FINAL (firma-design)
// Folge: "Heute sucht die KI ihr Produkt" → Firmenshirts. Grundlage: runs/firma-neu-tag1/regieplan.md + beats.json.
// Alle Zeiten sind über words.json verankert: at("Wort", after) = erstes Wort mit s >= after (Anker-Regel aus beats.json).
// Echte claude.ai-Ausschnitte: public/firma-neu-tag1/shots/s1–s6 (ohne Sidebar zugeschnitten).
// Ton (Voice, Musik-Kurve, SFX) wird NICHT hier, sondern per ffmpeg gemischt (runs/firma-neu-tag1/mix.sh).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, canvasTex, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, Word, pixelFont } from "../components/PixelKit";
import {
  SKC, SERIF, V3, Tex, cl, ease, inOut, back, bump, lerp3, bez3, add,
  makeWorldTex, useDyn, useImage, drawCounter, drawTag, Board, Island, Agent, PARTNER, ShirtStack, PrintMachine,
  HangingTag, Conveyor, Laptop, LightCone, ShirtRoom, TShirt, StepBar, WordSticker,
  ProductWall, drawIdeaWall, IdeaCard, IdeaCardState, FirmaHook2D, ShotPaper, Counter2D, OVERLAY,
} from "../components/ShirtWorld3D";
import wordsRaw from "../../public/firma-neu-tag1/words.json";

const W = 1080, H = 1920;
const DAY = 1;
export type FirmaShirtsTag1Props = { keyword?: string; cover?: boolean };
export const FIRMA_SHIRTS_TAG1_SECONDS = 36.3;

// ---------- word anchors ----------
type RawWord = { i: number; w: string; s: number; e: number };
const WORDS = wordsRaw as RawWord[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, after = 0, offset = 0) => {
  const hit = WORDS.find((x) => norm(x.w) === norm(w) && x.s >= after - 1e-6);
  if (!hit) throw new Error(`anchor not found: ${w} after ${after}`);
  return hit.s + offset;
};
const CAPTIONS: Word[] = WORDS.map((x) => ({ w: x.w.replace(/[„“]/g, ""), s: x.s, e: x.e }));

const T = {
  ki: at("KI", 0.9), ganz: at("ganz", 1.3), ein: at("ein", 1.9), unt: at("Unternehmen", 2.0), auf: at("aufbaut", 2.5),
  ich: at("Ich", 3.0), probier: at("probier", 3.2), tag: at("1", 4.5), kein: at("kein", 5.7), produkt: at("Produkt", 5.9),
  heute: at("Heute", 6.5), claude: at("Claude", 7.4),
  erstens: at("Erstens", 8.0), unten: at("unten", 8.7), plus: at("Plus", 9.3), research: at("Research", 10.0), an: at("an", 10.4),
  zweitens: at("Zweitens", 11.0), schreib: at("Schreib", 11.9), keinL: at("Kein", 13.2), keineM: at("keine", 13.9), kleine: at("kleine", 14.9),
  drittens: at("Drittens", 16.0), frag: at("Frag", 16.9), immer: at("immer", 18.0), kaufen: at("kaufen", 18.5),
  claude2: at("Claude", 19.2), prueft: at("prüft", 19.5), q300: at("300", 20.0), quellen: at("Quellen", 20.4),
  am: at("Am", 21.0), druck: at("Drucksachen", 21.7), arbeit: at("Arbeitskleidung", 22.4),
  ein2: at("Ein", 23.7), partner: at("Partner", 23.9), druckt: at("druckt", 24.2), einem: at("einem", 25.0),
  die: at("Die", 25.7), nimmt: at("nimmt", 26.0), shirts: at("Firmenshirts", 27.0),
  nur: at("Nur", 28.2), nirgends: at("nirgends", 29.1), nachb: at("nachbestellen", 30.3), das: at("Das", 31.2),
  komm: at("Kommentiere", 32.0), kw: at("Produkt", 32.8), und: at("und", 33.5), schick: at("schick", 34.3), guide: at("Guide", 34.8),
};

// ---------- idea wall ----------
const CARDS: IdeaCard[] = [
  { label: "KAFFEE", icon: "coffee" }, { label: "HUNDE-\nKEKSE", icon: "bone" },
  { label: "DRUCK-\nSACHEN", icon: "flyer" }, { label: "FIRMEN-\nSHIRTS", icon: "shirt" },
  { label: "WEBSITES", icon: "web" }, { label: "KERZEN", icon: "candle" },
];
const KEEP = 3;
const SCAN = [0, 3, 5, 2];
const SCAN_AT = [T.ki, at("alleine", 1.5), T.unt, T.auf];
const STRIKE_ORDER = [0, 5, 1, 4, 2];
const strikeAt = (i: number) => T.nimmt - 0.25 + STRIKE_ORDER.indexOf(i) * ((26.95 - (T.nimmt - 0.25)) / STRIKE_ORDER.length);
const wallState = (t: number): IdeaCardState[] => CARDS.map((_, i) => {
  const isKeep = i === KEEP;
  const flipT = T.kein + 0.04 + i * 0.05;
  // keeper is "?" from frame 1 (Regie: Shirt-Karte heißt bis "Firmenshirts" nur "?")
  const flip = isKeep ? 1 : cl((t - flipT) / 0.28);
  const spot = Math.max(0, ...SCAN.map((c, k) => (c === i && t < T.ich ? bump(t, SCAN_AT[k] + 0.18, 0.42) : 0)));
  const sa = isKeep ? T.shirts : strikeAt(i);
  const reveal = cl((t - sa) / 0.22);
  const cross = isKeep ? 0 : cl((t - sa - 0.12) / 0.22);
  const keep = isKeep ? back((t - T.shirts - 0.1) / 0.35) : 0;
  return { flip, spot, reveal, cross, keep };
});

// ---------- world layout ----------
const F: V3 = [1.3, 0, -2.6];
const F_R = 2.5;
const TOP = 0.5;
const STACK: V3 = add(F, [1.15, TOP, 0.75]);
const LAPTOP: V3 = add(F, [-0.95, TOP, -0.2]);
const AG_DESK: V3 = add(F, [-0.2, TOP, 0.75]);
const WALL: V3 = [0.9, 0, -7.4];
const WALL_W = 6.4, WALL_H = 7.0, WALL_LIFT = 1.7, WALL_CX = 1200, WALL_CY = Math.round(1200 * WALL_H / WALL_W);
const FW: V3 = [-1.7, 0, -5.7]; // founder in front of the wall (left, below the cards)
const P: V3 = [8.2, 0, -9.6];
const P_R = 2.6;
const P_M: V3 = add(P, [0.3, TOP, -0.5]);
const BELT_A: V3 = add(P, [-0.2, 0, P_R + 0.3]);
const BELT_B: V3 = [9.0, 0, 1.6];
const SLOTS: V3[] = [[10.4, 0, 4.4], [-6.8, 0, -9.0], [-7.6, 0, -1.0]];
// world position of an idea-wall card centre
const cardWorld = (i: number): V3 => {
  const gx = 34, gy = 190, cw = (WALL_CX - gx * 2) / 2, ch = (WALL_CY - gy - 30) / 3;
  const x = gx + (i % 2) * cw + cw / 2, y = gy + Math.floor(i / 2) * ch + ch / 2;
  return [WALL[0] + (x / WALL_CX - 0.5) * WALL_W, WALL_LIFT + WALL_H * (1 - y / WALL_CY), WALL[2]];
};
const WALL_MID: V3 = [WALL[0], WALL_LIFT + WALL_H / 2, WALL[2]];

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
const KC = cardWorld(KEEP);
const HOLDS: Hold[] = [
  // B01 hook: wall frontal, slow push-in (wall low in frame, text hook above)
  { a: 0, b: T.ich - 0.12, p0: add(WALL_MID, [0, 0.95, 16.2]), p1: add(WALL_MID, [0, 0.85, 14.6]), l0: add(WALL_MID, [0, 0.95, 0]), l1: add(WALL_MID, [0, 0.85, 0]) },
  // B02–B03 pull-back: wall + founder desk with the counter
  { a: T.ich + 0.45, b: T.kein - 0.25, p0: [2.4, 10.5, 15.5], p1: [2.3, 10.2, 14.8], l0: [1.0, 5.9, -4.6], l1: [1.0, 5.8, -4.6] },
  // B04 short push-in on the wall: everything becomes "?"
  { a: T.kein - 0.05, b: T.heute - 0.15, p0: add(WALL_MID, [0.4, 0.3, 13.6]), p1: add(WALL_MID, [0.3, 0.2, 12.4]), l0: add(WALL_MID, [0, -0.2, 0]), l1: add(WALL_MID, [0, -0.2, 0]) },
  // B05 to the laptop
  { a: T.heute + 0.55, b: T.erstens - 0.1, p0: add(AG_DESK, [0.9, 2.3, 4.6]), p1: add(AG_DESK, [0.7, 2.1, 4.0]), l0: add(AG_DESK, [-0.5, 0.9, -0.6]), l1: add(AG_DESK, [-0.5, 0.9, -0.6]) },
  // B06–B10 Claude panels (world soft behind)
  { a: T.erstens + 0.3, b: T.ein2 - 0.15, p0: add(F, [0.8, 2.6, 7.6]), p1: add(F, [0.2, 2.2, 6.4]), l0: add(F, [0, 2.6, 0]), l1: add(F, [0, 2.4, 0]) },
  // B11 partner island
  { a: T.ein2 + 0.35, b: T.die - 0.1, p0: add(P, [-1.4, 4.6, 9.2]), p1: add(P, [-1.0, 4.0, 8.0]), l0: add(P, [0, 1.6, 0]), l1: add(P, [0, 1.5, 0]) },
  // B12 back to the wall, hard push-in on the shirt card at "Firmenshirts"
  { a: T.die + 0.4, b: T.shirts - 0.02, p0: add(WALL_MID, [0, 0.2, 13.4]), p1: add(WALL_MID, [0, 0.1, 12.8]), l0: add(WALL_MID, [0, -0.2, 0]), l1: add(WALL_MID, [0, -0.25, 0]) },
  { a: T.shirts + 0.0, b: T.nur - 0.05, p0: add(KC, [0, -0.2, 7.4]), p1: add(KC, [0, -0.2, 6.8]), l0: add(KC, [0, -0.2, 0]), l1: add(KC, [0, -0.2, 0]) },
  // B13 panel s6, then the desk with the TAG-2 tag
  { a: T.nur + 0.3, b: T.das - 0.05, p0: add(F, [0.8, 2.6, 7.6]), p1: add(F, [0.5, 2.4, 7.0]), l0: add(F, [0, 2.6, 0]), l1: add(F, [0, 2.6, 0]) },
  { a: T.das + 0.25, b: T.komm - 0.05, p0: add(F, [0.6, 4.2, 9.4]), p1: add(F, [0.5, 3.9, 8.6]), l0: add(F, [-0.1, 2.9, 0]), l1: add(F, [-0.1, 2.9, 0]) },
  // B14 end card: desk + waving founder low in frame
  { a: T.komm + 0.3, b: 60, p0: add(F, [0.3, 2.8, 8.4]), p1: add(F, [0.2, 2.6, 7.8]), l0: add(F, [0, 3.3, 0]), l1: add(F, [0, 3.2, 0]) },
];
const HARD_CUT = [T.shirts]; // hold starts that cut instead of travelling
const camAt = (t: number): { pos: V3; look: V3 } => {
  for (let i = 0; i < HOLDS.length; i++) {
    const h = HOLDS[i];
    const hk = inOut((Math.max(t, h.a) - h.a) / Math.max(0.01, h.b - h.a));
    if (t <= h.b) return { pos: lerp3(h.p0, h.p1, hk), look: lerp3(h.l0, h.l1, hk) };
    const n = HOLDS[i + 1];
    if (n && t < n.a) {
      if (HARD_CUT.includes(n.a)) return { pos: h.p1, look: h.l1 };
      const k = inOut((t - h.b) / (n.a - h.b));
      const via = add(lerp3(h.p1, n.p0, 0.5), [0, 2.0, 0]);
      return { pos: bez3(h.p1, via, n.p0, k), look: bez3(h.l1, lerp3(h.l1, n.l0, 0.5), n.l0, k) };
    }
  }
  const l = HOLDS[HOLDS.length - 1];
  return { pos: l.p1, look: l.l1 };
};
const PUNCH = [T.tag, T.produkt, T.claude, T.partner, T.shirts];

// ---------- founder ----------
type Pose = { p: V3; yaw: number; reach: number; armL: number; armR: number; talk: boolean; lean: number; shirt: number };
const walk = (a: V3, b: V3, t: number, t0: number, d: number): V3 => {
  const k = inOut((t - t0) / d);
  const p = lerp3(a, b, k);
  return [p[0], p[1] + Math.abs(Math.sin(k * Math.PI * 3)) * 0.18 * (k > 0 && k < 1 ? 1 : 0), p[2]];
};
const DESK_YAW = -0.75;
const founder = (t: number): Pose => {
  const base: Pose = { p: FW, yaw: 0.2, reach: 0, armL: 15, armR: 15, talk: false, lean: 0, shirt: 0 };
  if (t < T.heute) {
    // looks up at the wall, points at the scanned card
    const look = t < T.ich ? Math.PI - 0.35 + Math.sin(t * 2) * 0.1 : 0.25 + Math.sin(t * 1.4) * 0.12;
    return { ...base, yaw: look, armR: t < T.ich ? 110 + 20 * Math.sin(t * 5) : 20, talk: t > T.ich && t < T.tag + 0.4 };
  }
  if (t < T.ein2 + 1.2) {
    const p = walk(FW, AG_DESK, t, T.heute, 0.8);
    const typing = t > T.claude && t < T.ein2;
    return { ...base, p, yaw: t < T.heute + 0.8 ? -0.6 : DESK_YAW + Math.sin(t * 3) * 0.05, reach: typing ? 0.55 + 0.1 * Math.sin(t * 16) : 0, lean: typing ? 0.12 : 0 };
  }
  if (t < T.nur + 0.4) {
    // walks back to the wall, holds a shirt up at "Firmenshirts"
    const p = walk(AG_DESK, FW, t, T.ein2 + 1.2, 0.9);
    const up = back((t - T.shirts + 0.05) / 0.35);
    return { ...base, p, yaw: t < T.shirts - 0.4 ? 0.3 : 0.15 + Math.sin(t * 4) * 0.1, armL: 15 + 150 * up, armR: 15 + 150 * up, shirt: up, talk: false };
  }
  const p = walk(FW, AG_DESK, t, T.nur + 0.4, 1.0);
  const wave = t > T.komm;
  return { ...base, p, yaw: wave ? 0.1 : 0.2, armL: wave ? 20 : 15, armR: wave ? 150 + 18 * Math.sin(t * 10) : 15, talk: wave };
};

// ---------- world ----------
const World: React.FC<{ t: number; tex: Tex; dyn: Record<string, THREE.Texture> }> = ({ t, tex, dyn }) => {
  const cam = camAt(t);
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p + 0.05, 0.22)));
  const q = React.useMemo(() => new THREE.Quaternion(), []);
  q.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), new THREE.Vector3(0, 1, 0)));
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]);
  lightTarget.updateMatrixWorld();
  const wallTarget = React.useMemo(() => new THREE.Object3D(), []);
  wallTarget.position.set(...WALL_MID); wallTarget.updateMatrixWorld();
  const look = cam.look;
  const fo = founder(t);
  const partnerOn = cl((t - T.partner + 0.1) / 0.35) * (1 - cl((t - T.nur) / 0.5) * 0.6);
  const running = t > T.druckt && t < T.nimmt;
  const drop = cl((t - T.einem + 0.25) / 0.45);
  const camD = Math.hypot(cam.pos[0] - fo.p[0], cam.pos[1] - fo.p[1] - 1, cam.pos[2] - fo.p[2]);
  const keepGlow = cl((t - T.shirts) / 0.3);
  const yawR = fo.yaw;
  const shirtP: V3 = add(fo.p, [Math.sin(yawR) * 0.25, 1.75, Math.cos(yawR) * 0.25]);
  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={44 - 3.5 * punch} />
      <color attach="background" args={[SKC.BG]} />
      <fog attach="fog" args={["#D9B98F", 26, 70]} />
      <ambientLight intensity={0.5} color="#FFF0DC" />
      <hemisphereLight args={["#FFF4E2", "#7A4A2A", 0.6]} />
      <primitive object={lightTarget} />
      <primitive object={wallTarget} />
      {/* key warm from front-right with soft shadows; cool rim from behind (D-3) */}
      <directionalLight position={[look[0] + 7, 18, look[2] + 10]} target={lightTarget} intensity={1.9} color="#FFE6C4" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} shadow-camera-far={80} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <directionalLight position={[look[0] - 6, 10, look[2] - 14]} target={lightTarget} intensity={1.0} color="#CFE6FF" />
      {/* gallery spot on the idea wall + pendant lamp over the desk (practical lights, depth) */}
      <spotLight position={add(WALL_MID, [2.5, 6.5, 7])} target={wallTarget} angle={0.55} penumbra={0.8} intensity={60} distance={30} decay={1.6} color="#FFD9A0" />
      <pointLight position={add(F, [0, 4.2, 0])} intensity={14} distance={9} decay={1.6} color="#FFC98A" />
      <ShirtRoom t={t} tex={tex} sign={t > T.heute} />
      <LightCone p={F} t={t} seed={1} color="#FFD9A8" r={3.0} o={0.07} />

      {/* idea wall */}
      <ProductWall p={WALL} tex={dyn.wall} w={WALL_W} h={WALL_H} lift={WALL_LIFT} />
      {keepGlow > 0.01 && <pointLight position={add(KC, [0, 0, 1.6])} intensity={12 * keepGlow} distance={6} color="#FFB48A" />}

      {/* founder desk */}
      <Island p={F} r={F_R} t={t} label={tex.plateFounder} />
      <Laptop p={LAPTOP} yaw={0.85} screen={tex.laptop} s={0.95} />
      <ShirtStack p={STACK} t={t} count={0} q={q} counter={dyn.counter} logo={tex.shirtLogo} s={0.9} counterVis={back((t - T.probier) / 0.35)} />
      <HangingTag anchor={add(F, [-0.6, 5.3, -0.4])} t={t} tex={tex.tag2} len={0.7} w={1.9} h={1.66} swing={0.12} vis={back((t - T.das - 0.1) / 0.4)} />
      <Agent p={fo.p} yaw={fo.yaw} t={t} s={0.66} reach={fo.reach} lean={fo.lean} armL={fo.armL} armR={fo.armR} talk={fo.talk} vis={cl((camD - 1.6) / 1.0)} />
      {fo.shirt > 0.01 && <TShirt p={shirtP} s={0.9 * fo.shirt} rot={[0.15, yawR, 0]} logo={tex.shirtLogo} />}

      {/* print partner (belongs to the partner, blue) */}
      <Island p={P} r={P_R} t={t} side={SKC.BLUE} rim="#BFE3FF" label={tex.platePartner} glow={partnerOn * (0.75 + 0.25 * Math.sin(t * 5))} glowCol="#7FD6FF" />
      {partnerOn > 0.01 && <LightCone p={P} t={t} seed={3} color="#9DD8FF" r={2.6} o={0.12 * partnerOn} />}
      {partnerOn > 0.01 && <pointLight position={add(P, [0, 3.5, 1.5])} intensity={10 * partnerOn} distance={8} color="#9DD8FF" />}
      <PrintMachine p={P_M} t={t} s={0.62} yaw={-0.25} tint="#F2F5FA" accent="#1C2440" running={running} />
      {drop > 0.001 && <TShirt p={add(P_M, [0.1, 2.0 - 1.45 * ease(drop), 1.5])} s={0.8} rot={[0, 0.3 + drop * 0.6, 0]} logo={tex.shirtLogo} />}
      
      <Agent p={add(P, [-1.5, TOP, 0.7])} yaw={0.3} t={t} s={0.55} seed={7} pal={PARTNER} armL={partnerOn > 0.5 ? 140 + 20 * Math.sin(t * 8) : 15} armR={partnerOn > 0.5 ? 40 : 15} glow={0.6 * partnerOn} />
      <Conveyor a={BELT_A} b={BELT_B} t={t} n={4} speed={1.2} parcels={0} />
      {SLOTS.map((s, i) => <Island key={i} p={s} r={2.0} t={t + i} ghost label={tex.slotQ} />)}
    </>
  );
};

// ---------- textures ----------
const useTex = (ready: boolean, claude: HTMLImageElement | null) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t = makeWorldTex(DAY);
    t.laptop = canvasTex(512, 320, (c) => {
      c.fillStyle = SKC.PAPER; c.fillRect(0, 0, 512, 320);
      if (claude) c.drawImage(claude, 196, 60, 120, 120);
      c.fillStyle = SKC.INK; c.font = `600 44px ${SERIF}`; c.textAlign = "center"; c.fillText("claude.ai", 256, 240);
    });
    t.tag2 = canvasTex(620, 540, (c) => drawTag(c, 620, 540, "TAG 2", "NACHBESTELLUNG?", "#FFFFFF"));
    t.ab1 = canvasTex(680, 420, (c) => drawCounter(c, 680, 420, "AB", "1 STÜCK", SKC.BLUE));
    return t;
  }, [ready, claude]);

const useDynTex = (t: number, ready: boolean) => {
  const pulse = Math.max(bump(t, T.probier + 0.15, 0.35), bump(t, T.shirts + 0.1, 0.35));
  const counter = useDyn(680, 560, (c) => {
    if (!ready) return;
    const w = 680, h = 560;
    c.clearRect(0, 0, w, h);
    // two lines on one plate: KASSE 0 € / PRODUKT ?
    c.fillStyle = "rgba(0,0,0,.3)"; c.beginPath(); c.roundRect(6, 16, w - 6, h - 10, 46); c.fill();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.roundRect(0, 0, w - 6, h - 16, 46); c.fill();
    c.fillStyle = SKC.INK; c.beginPath(); c.roundRect(9, 9, w - 24, h - 34, 38); c.fill();
    c.fillStyle = pulse > 0 ? "#FFF3D6" : SKC.CREAM; c.beginPath(); c.roundRect(16, 16, w - 38, h - 48, 32); c.fill();
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = SKC.OR; c.font = "900 52px Rubik"; c.fillText("KASSE", w / 2, 78);
    c.fillStyle = SKC.INK; c.font = "900 128px Rubik"; c.fillText("0 €", w / 2, 178);
    c.fillStyle = "rgba(22,19,15,.15)"; c.fillRect(60, 262, w - 140, 6);
    const pOn = t > T.produkt - 0.05;
    c.fillStyle = SKC.OR; c.font = "900 52px Rubik"; c.fillText("PRODUKT", w / 2, 330);
    const val = t > T.shirts ? "FIRMENSHIRTS" : pOn ? "?" : "–";
    c.fillStyle = t > T.shirts ? SKC.OR_D : SKC.INK;
    let fs = 120; c.font = `900 ${fs}px Rubik`; while (c.measureText(val).width > w - 110) { fs -= 4; c.font = `900 ${fs}px Rubik`; }
    c.fillText(val, w / 2, 430);
  });
  const st = wallState(t);
  const wall = useDyn(WALL_CX, WALL_CY, (c) => ready && drawIdeaWall(c, WALL_CX, WALL_CY, t, CARDS, st));
  return { counter, wall };
};

// ---------- end card (M-007) ----------
const EndCard: React.FC<{ t: number; keyword: string }> = ({ t, keyword }) => {
  const k = back((t - T.komm) / 0.4);
  if (k <= 0.001) return null;
  const INK = SKC.INK, OR = SKC.OR;
  const kw = back((t - T.komm - 0.15) / 0.4);
  const typed = keyword.slice(0, Math.max(0, Math.floor((t - T.kw) * 10)));
  const sent = t > T.und;
  const sentK = back((t - T.und) / 0.3);
  const prom = back((t - T.schick) / 0.35);
  const fly = ease((t - T.guide) / 0.45);
  const landed = t > T.guide + 0.45;
  return (
    <div style={{ position: "absolute", top: 170, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.75 + 0.25 * k})`, opacity: Math.min(1, k * 1.5) }}>
      <div style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: 84, color: "#FFFFFF", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}` }}>KOMMENTIERE</div>
      <div style={{ marginTop: 14, transform: `scale(${0.5 + 0.5 * kw}) rotate(-3deg)`, background: OR, border: `9px solid ${INK}`, borderRadius: 44, padding: "4px 70px 16px", boxShadow: "0 0 0 9px #FFFFFF, 0 24px 0 9px rgba(0,0,0,.3)" }}>
        <span style={{ fontFamily: "Rubik", fontWeight: 900, fontSize: Math.min(200, 820 / (keyword.length * 0.68)), color: "#FFFFFF", WebkitTextStroke: `11px ${INK}`, paintOrder: "stroke fill", lineHeight: 1 }}>{keyword.toUpperCase()}</span>
      </div>
      {/* comment field */}
      <div style={{ marginTop: 64, width: "100%", display: "flex", alignItems: "center", gap: 18, background: "#FFFFFF", border: `6px solid ${sent ? SKC.GREEN : INK}`, borderRadius: 60, padding: "14px 18px", boxShadow: "0 12px 0 rgba(0,0,0,.25)" }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: "#D8D2C6", border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rubik", fontWeight: 900, fontSize: 28, color: INK }}>DU</div>
        <div style={{ flex: 1, fontFamily: "Rubik", fontWeight: 800, fontSize: 54, color: typed ? INK : SKC.MUTED }}>{typed || "Kommentar hinzufügen …"}{!sent && typed && <span style={{ opacity: Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span>}</div>
        <div style={{ width: 78, height: 78, borderRadius: 39, background: sent ? SKC.GREEN : OR, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontFamily: "Rubik", fontWeight: 900, fontSize: 40, transform: `scale(${sent ? 0.8 + 0.2 * sentK : 1})` }}>{sent ? "✓" : "➤"}</div>
      </div>
      {/* Guide per DM: PDF flies into the DM bubble */}
      <div style={{ marginTop: 70, width: "100%", position: "relative", height: 300, opacity: prom > 0.01 ? 1 : 0, transform: `scale(${0.6 + 0.4 * prom})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#FFFFFF", border: `7px solid ${INK}`, borderRadius: 34, padding: "10px 40px 14px", boxShadow: OVERLAY.dieCut, fontFamily: "Rubik", fontWeight: 900, fontSize: 76, color: INK, whiteSpace: "nowrap" }}>
            GUIDE <span style={{ color: OR }}>PER DM</span>
          </div>
        </div>
        {/* DM bubble on the right */}
        <div style={{ position: "absolute", right: 40, top: 150, width: 230, height: 130, background: SKC.BLUE, border: `6px solid ${INK}`, borderRadius: "40px 40px 10px 40px", boxShadow: "0 10px 0 rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "Rubik", fontWeight: 900, fontSize: 54, color: "#FFFFFF" }}>
          DM {landed && <span style={{ display: "inline-flex", width: 52, height: 52, borderRadius: 26, background: SKC.GREEN, border: `4px solid ${INK}`, alignItems: "center", justifyContent: "center", fontSize: 32, transform: `scale(${back((t - T.guide - 0.45) / 0.3)})` }}>✓</span>}
        </div>
        {/* PDF */}
        {!landed && (
          <div style={{ position: "absolute", left: 60 + fly * 640, top: 140 + Math.sin(fly * Math.PI) * -90 + fly * 20, width: 140, height: 170, transform: `rotate(${-8 + fly * 20}deg) scale(${1 - 0.5 * fly})`, background: "#FFFFFF", border: `6px solid ${INK}`, borderRadius: 16, boxShadow: "0 10px 0 rgba(0,0,0,.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 14 }}>
            <div style={{ position: "absolute", top: 18, left: 18, right: 18, height: 10, background: "#D8D2C6", borderRadius: 5 }} />
            <div style={{ position: "absolute", top: 40, left: 18, right: 40, height: 10, background: "#D8D2C6", borderRadius: 5 }} />
            <div style={{ background: SKC.RED, color: "#FFFFFF", fontFamily: "Rubik", fontWeight: 900, fontSize: 34, padding: "2px 14px", borderRadius: 10 }}>PDF</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- composition ----------
export const FirmaShirtsTag1: React.FC<FirmaShirtsTag1Props> = ({ keyword = "Produkt", cover = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ready = useFontsReady(["900 70px Rubik", "800 40px Rubik", `600 40px ${SERIF}`, `800 40px ${pixelFont}`]);
  const claudeImg = useImage(staticFile("logos/claude.svg"));
  const tex = useTex(ready, claudeImg);
  const dyn = useDynTex(t, ready);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const panelOn = (t > T.erstens && t < T.ein2 + 0.1) || (t > T.nur && t < T.das + 0.1);
  const panelK = t < T.nur ? ease((t - T.erstens) / 0.35) * (1 - ease((t - T.ein2 + 0.15) / 0.25)) : ease((t - T.nur) / 0.35) * (1 - ease((t - T.das + 0.15) / 0.25));
  const ctaK = ease((t - T.komm) / 0.4);
  const motionBlur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const blur = motionBlur + (panelOn ? 7 * panelK : 0);
  const flash = 0.16 * bump(t, T.shirts + 0.03, 0.09) + 0.08 * bump(t, T.partner, 0.08);
  const logo = staticFile("logos/claude.svg");
  const sh = (n: string) => staticFile(`firma-neu-tag1/shots/${n}.png`);
  const PX = 50, PY = 300, PW = 980;

  // s1: pointer to "+", click, then to "Research", click
  const c1 = (() => {
    const toPlus = ease((t - T.unten) / 0.4), toRes = ease((t - T.plus - 0.3) / 0.4);
    const x = 48 + (255 - 48) * toRes + (1 - toPlus) * 140, y = 170 + (620 - 170) * toRes + (1 - toPlus) * 120;
    const press = Math.max(bump(t, T.plus + 0.05, 0.14), bump(t, T.research + 0.08, 0.14));
    return { x, y, press, vis: ease((t - T.unten + 0.1) / 0.2) };
  })();
  const quellenVal = t < T.q300 ? Math.round(169 * ease((t - T.prueft) / 0.4)) : Math.round(169 + (314 - 169) * ease((t - T.q300) / 0.4));
  return (
    <AbsoluteFill style={{ background: SKC.BG }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      {/* lens: warm vignette + soft window light from top left + foreground bokeh (depth) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(60,28,8,.42) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(160deg, rgba(255,236,200,.22) 0%, transparent 35%)", mixBlendMode: "screen" }} />
      {[[70, 1800, 150, "#FFD9A0"], [1010, 1690, 110, "#FFC27A"], [960, 120, 90, "#FFF0D0"]].map(([x, y, r, c], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) - (r as number), top: (y as number) - (r as number), width: (r as number) * 2, height: (r as number) * 2, borderRadius: "50%", background: c as string, opacity: 0.22, filter: "blur(30px)" }} />
      ))}
      {panelOn && <AbsoluteFill style={{ background: `rgba(40,22,10,${0.22 * panelK})` }} />}
      {/* calm backdrop behind the end card: frosted panel over the upper world, founder stays sharp below */}
      {ctaK > 0.01 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1340, backdropFilter: `blur(${16 * ctaK}px)`, WebkitBackdropFilter: `blur(${16 * ctaK}px)`, background: `linear-gradient(180deg, rgba(246,238,220,${0.74 * ctaK}) 0%, rgba(246,238,220,${0.62 * ctaK}) 82%, rgba(246,238,220,0) 100%)`, maskImage: "linear-gradient(180deg, #000 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, #000 85%, transparent 100%)" }} />}
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />

      {/* B01–B03 opening */}
      <FirmaHook2D t={t} top={110} out={T.tag + 0.55}
        lines={[{ text: "KI GRÜNDET", at: T.ki, size: 104 }, { text: "EINE FIRMA", at: T.ein, size: 112, color: SKC.OR }]}
        pill={{ text: "GANZ ALLEINE", at: T.ganz }} day={{ n: DAY, at: cover ? 0 : T.tag }} />

      {/* B05 */}
      <WordSticker t={t} at={T.heute} until={T.erstens - 0.1} text="HEUTE: PRODUKT FINDEN" x={540} y={250} size={70} bg={SKC.OR} fg="#FFFFFF" rot={-2} />

      {/* B06–B08 steps in claude.ai */}
      <StepBar t={t} starts={[T.erstens, T.zweitens, T.drittens]} labels={["PLUS → RESEARCH", "REGELN", "FRAGE"]} top={150} vis={t > T.erstens && t < T.claude2 - 0.1 ? ease((t - T.erstens) / 0.3) * (1 - ease((t - T.claude2 + 0.35) / 0.25)) : 0} />
      <ShotPaper t={t} at={T.erstens} out={T.zweitens - 0.1} logo={logo} src={sh("s1-plus-research")} px={[470, 714]} x={PX} y={PY} w={PW} h={860}
        view={(tt) => { const k = inOut((tt - T.plus - 0.2) / 0.6); return { cx: 235, cy: 220 + 330 * k, z: 1.0 }; }}
        marks={[{ r: [50, 595, 460, 645], at: T.research, color: "orange" }]} cursor={c1} />
      {t > T.an - 0.05 && t < T.zweitens - 0.1 && <WordSticker t={t} at={T.an} until={T.zweitens - 0.15} text="✓ RESEARCH AN" x={540} y={1250} size={64} bg={SKC.GREEN} fg="#FFFFFF" rot={-2} />}
      <ShotPaper t={t} at={T.zweitens} out={T.claude2 - 0.1} logo={logo} src={sh("s2-prompt")} px={[1018, 448]} x={PX} y={PY} w={PW} h={700}
        view={(tt) => {
          if (tt < T.keinL - 0.1) return { cx: 509, cy: 224, z: 1.0 };
          if (tt < T.drittens) { const k = inOut((tt - T.keinL + 0.1) / 0.5); const k2 = inOut((tt - T.kleine + 0.1) / 0.5); return { cx: 509 + 230 * k - 200 * k2, cy: 110 + 75 * k2, z: 1 + 0.5 * k }; }
          const k = inOut((tt - T.frag + 0.2) / 0.6); return { cx: 509, cy: 172 + 90 * k, z: 1.5 - 0.4 * k };
        }}
        reveal={(tt) => cl((tt - T.schreib) / (13.1 - T.schreib))}
        dimOthers={0.35}
        marks={[
          { r: [630, 83, 893, 117], at: T.keinL, color: "yellow", until: T.drittens },
          { r: [900, 83, 977, 117, 34, 125, 277, 159], at: T.keineM, color: "yellow", until: T.drittens },
          { r: [215, 167, 892, 201], at: T.kleine, color: "yellow", until: T.drittens },
          { r: [633, 209, 939, 243], at: T.frag, color: "yellow" },
          { r: [478, 251, 895, 285, 34, 293, 136, 327], at: T.immer, color: "orange" },
        ]}
        cursor={{ x: 960, y: 420, press: bump(t, T.kaufen + 0.1, 0.14), vis: ease((t - T.kaufen + 0.35) / 0.2) * (1 - ease((t - T.claude2 + 0.3) / 0.2)) }} />
      <WordSticker t={t} at={T.keinL} until={T.drittens - 0.1} text="KEIN LAGER" x={255} y={1115} size={54} rot={-3} />
      <WordSticker t={t} at={T.keineM} until={T.drittens - 0.1} text="KEINE MASCHINE" x={775} y={1125} size={54} rot={2} />
      <WordSticker t={t} at={T.kleine} until={T.drittens - 0.1} text="KLEINE BETRIEBE" x={540} y={1280} size={62} bg={SKC.OR} fg="#FFFFFF" rot={-1} />
      <WordSticker t={t} at={T.immer} until={T.claude2 - 0.1} text="WAS KAUFEN SIE IMMER WIEDER?" x={540} y={1130} size={52} bg={SKC.OR} fg="#FFFFFF" rot={-2} />

      {/* B09 sources */}
      <ShotPaper t={t} at={T.claude2} out={T.q300 - 0.02} logo={logo} src={sh("s3-research-laeuft")} px={[1528, 408]} x={PX} y={PY + 60} w={PW} h={440}
        view={(tt) => ({ cx: 480, cy: 300, z: 1.75 + 0.1 * cl((tt - T.claude2) / 0.8) })} marks={[{ r: [80, 292, 560, 330], at: T.prueft, color: "yellow" }]} />
      <ShotPaper t={t} at={T.q300} out={T.am - 0.05} logo={logo} src={sh("s4-research-complete")} px={[1202, 215]} x={PX} y={PY + 60} w={PW} h={440}
        view={(tt) => ({ cx: 390, cy: 108, z: 1.9 + 0.12 * cl((tt - T.q300) / 0.9) })} marks={[{ r: [139, 93, 626, 128], at: T.quellen, color: "orange" }]} />
      <Counter2D t={t} at={T.prueft} out={T.am - 0.05} label="QUELLEN GEPRÜFT" value={String(quellenVal)} x={540} y={1060} pulse={bump(t, T.q300 + 0.4, 0.25)} />

      {/* B10 result */}
      <ShotPaper t={t} at={T.am} out={T.ein2 - 0.05} logo={logo} src={sh("s5-ergebnis")} px={[1048, 520]} x={PX} y={PY} w={PW} h={760}
        view={(tt) => { const k = inOut((tt - T.druck + 0.2) / 0.6); return { cx: 545, cy: 200 - 20 * k, z: 1.0 + 0.45 * k }; }}
        dimOthers={0.4}
        marks={[{ r: [518, 148, 706, 184], at: T.druck, color: "yellow" }, { r: [370, 190, 732, 226], at: T.arbeit, color: "orange" }]} />
      <WordSticker t={t} at={T.druck + 0.05} until={T.ein2 - 0.1} text="DRUCKSACHEN" x={330} y={1150} size={58} rot={-3} />
      <WordSticker t={t} at={T.arbeit + 0.05} until={T.ein2 - 0.1} text="ARBEITSKLEIDUNG + LOGO" x={560} y={1290} size={60} bg={SKC.OR} fg="#FFFFFF" rot={2} />

      {/* B11 partner */}
      <WordSticker t={t} at={T.partner} until={T.die - 0.05} text="PARTNER DRUCKT" x={540} y={250} size={80} bg={SKC.BLUE} fg="#FFFFFF" rot={-2} />
      <Counter2D t={t} at={T.einem} out={T.die - 0.05} label="AB" value="1 STÜCK" x={330} y={500} accent={SKC.BLUE} pulse={bump(t, T.einem + 0.35, 0.2)} rot={-3} scale={0.85} />

      {/* B12 decision */}
      <WordSticker t={t} at={T.shirts} until={T.nur - 0.05} text="FIRMENSHIRTS" x={540} y={250} size={104} bg={SKC.OR} fg="#FFFFFF" rot={-3} />

      {/* B13 gap → tomorrow */}
      <ShotPaper t={t} at={T.nur} out={T.das - 0.05} logo={logo} src={sh("s6-keine-statistik")} px={[1202, 252]} x={PX} y={PY + 40} w={PW} h={560}
        view={(tt) => { const k = inOut((tt - T.nirgends + 0.2) / 0.5), k2 = inOut((tt - T.nachb + 0.1) / 0.5); return { cx: 760 + 150 * k - 250 * k2, cy: 160 + 60 * k, z: 1.0 + 0.6 * k - 0.4 * k2 }; }}
        dimOthers={0.35}
        marks={[{ r: [706, 224, 1101, 252], at: T.nirgends, color: "red" }, { r: [781, 181, 1107, 215, 16, 224, 435, 252], at: T.nachb, color: "yellow" }]} />
      <WordSticker t={t} at={T.nirgends + 0.05} until={T.das - 0.1} text="KEINE STATISTIK" x={540} y={1010} size={66} bg={SKC.RED} fg="#FFFFFF" rot={-2} />
      <WordSticker t={t} at={T.nachb} until={T.das - 0.1} text="WIE OFT NACHBESTELLT?" x={540} y={1150} size={58} rot={2} />

      {/* B14 end card */}
      <EndCard t={t} keyword={keyword} />

      {!cover && <PillCaptions words={CAPTIONS} theme={THEMES.gym} y={t > T.komm - 0.05 ? 1190 : 1665} />}
    </AbsoluteFill>
  );
};
