// "Was wäre wenn" kit: the 2D overlay system of the @was.wenn.dann reference look (pill, counter, info card,
// big number, serif captions, follow pill) plus the plain three.js building blocks (mannequins, parcels,
// lights, Germany dot map, camera) shared by every episode.
import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadBask } from "@remotion/google-fonts/LibreBaskerville";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const SERIF = loadBask("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
loadBask("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
export const SANS = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;

export type V3 = [number, number, number];
export type Word = { w: string; s: number; e: number };
export const cl = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
export const inOut = (v: number) => { const x = cl(v); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const back = (v: number) => { const x = cl(v); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
export const fmt = (n: number, dec = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// ---------- timeline helpers ----------
// start time of the first word of `phrase`, searching from word index `from`
export const findPhrase = (words: Word[], phrase: string, from = 0) => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const p = phrase.split(/\s+/).map(norm);
  for (let i = from; i < words.length; i++) {
    if (p.every((x, j) => words[i + j] && norm(words[i + j].w) === x)) return i;
  }
  throw new Error("phrase not found: " + phrase);
};
export const beatsFrom = (words: Word[], phrases: string[], end: number) => {
  let from = 0;
  const starts = phrases.map((ph) => { const i = findPhrase(words, ph, from); from = i + 1; return i === 0 ? 0 : words[i].s - 0.12; });
  return starts.map((a, i) => ({ a, b: i + 1 < starts.length ? starts[i + 1] : end }));
};

// ---------- 2D overlay ----------
const glass: React.CSSProperties = { background: "rgba(16,17,22,.62)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(10px)", boxShadow: "0 10px 40px rgba(0,0,0,.35)" };

export const TopPill: React.FC<{ text?: string }> = ({ text = "GEDANKENEXPERIMENT · FIKTIV" }) => (
  <div style={{ position: "absolute", top: 128, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ ...glass, borderRadius: 40, padding: "9px 26px", fontFamily: SANS, fontWeight: 600, fontSize: 19, letterSpacing: 4.2, color: "rgba(255,255,255,.88)" }}>{text}</div>
  </div>
);

export const Counter: React.FC<{ label: string; value: string; sub?: string; accent: string; op?: number; y?: number; pop?: number }> = ({ label, value, sub, accent, op = 1, y = 400, pop = 0 }) => (
  <div style={{ position: "absolute", left: 50, top: y, opacity: op, textShadow: "0 2px 18px rgba(0,0,0,.55)" }}>
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: 4, color: accent }}>{label}</div>
    <div style={{ fontFamily: SERIF, fontSize: 78, color: "#fff", lineHeight: 1.12, transform: `scale(${1 + pop * 0.08})`, transformOrigin: "left center" }}>{value}</div>
    {sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 25, color: "rgba(255,255,255,.78)" }}>{sub}</div>}
  </div>
);

export const InfoCard: React.FC<{ label: string; text: string; source?: string; accent: string; op?: number; y?: number }> = ({ label, text, source, accent, op = 1, y = 205 }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: op, transform: `translateY(${(1 - op) * 18}px)` }}>
    <div style={{ ...glass, borderRadius: 18, padding: "20px 28px", width: 640 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: 3.6, color: accent }}>{label}</div>
      <div style={{ fontFamily: SERIF, fontSize: 29, color: "#fff", lineHeight: 1.38, marginTop: 8 }}>{text}</div>
      {source && <div style={{ fontFamily: SANS, fontSize: 16, color: "rgba(255,255,255,.55)", marginTop: 10 }}>Quelle: {source}</div>}
    </div>
  </div>
);

export const BigNumber: React.FC<{ value: string; sub?: string; accent: string; op?: number; y?: number; source?: string }> = ({ value, sub, accent, op = 1, y = 215, source }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", opacity: op, transform: `scale(${0.92 + 0.08 * op})`, textShadow: "0 4px 30px rgba(0,0,0,.6)" }}>
    <div style={{ fontFamily: SERIF, fontSize: 132, color: accent, lineHeight: 1.05 }}>{value}</div>
    {sub && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,.92)", marginTop: 10 }}>{sub}</div>}
    {source && <div style={{ fontFamily: SANS, fontSize: 16, color: "rgba(255,255,255,.55)", marginTop: 8 }}>Quelle: {source}</div>}
  </div>
);

// hook title: line 1 white, line 2 accent italic, line 3 white
export const HookTitle: React.FC<{ lines: [string, string, string]; accent: string; op: number; y?: number }> = ({ lines, accent, op, y = 520 }) => (
  <div style={{ position: "absolute", top: y, left: 60, right: 60, textAlign: "center", opacity: op, fontFamily: SERIF, fontSize: 64, lineHeight: 1.2, color: "#fff", textShadow: "0 3px 24px rgba(0,0,0,.7)" }}>
    <div>{lines[0]}</div>
    <div style={{ color: accent, fontStyle: "italic" }}>{lines[1]}</div>
    <div>{lines[2]}</div>
  </div>
);

// word-by-word serif captions, chunked at sentence ends / ~8 words
export const chunkWords = (words: Word[], max = 8) => {
  const chunks: Word[][] = []; let cur: Word[] = [];
  words.forEach((w) => {
    cur.push(w);
    const end = /[.?!:“]$/.test(w.w) || /[.?!]“?$/.test(w.w);
    if (end || cur.length >= max) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
};
export const Captions: React.FC<{ words: Word[]; t: number; hideUntil?: number; y?: number; accentWords?: string[]; accent?: string }> = ({ words, t, hideUntil = 0, y = 1235, accentWords = [], accent = "#fff" }) => {
  const chunks = React.useMemo(() => chunkWords(words), [words]);
  if (t < hideUntil) return null;
  let idx = -1;
  chunks.forEach((c, i) => { if (t >= c[0].s - 0.08) idx = i; });
  if (idx < 0) return null;
  const c = chunks[idx];
  const next = chunks[idx + 1];
  if (!next && t > c[c.length - 1].e + 2.2) return null;
  return (
    <div style={{ position: "absolute", top: y, left: 70, right: 70, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 44, lineHeight: 1.32, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,.55), 0 4px 26px rgba(0,0,0,.6)" }}>
      {c.map((w, i) => {
        const k = cl((t - w.s + 0.06) / 0.16);
        const acc = accentWords.some((a) => w.w.toLowerCase().includes(a.toLowerCase()));
        return <span key={i} style={{ opacity: k, color: acc ? accent : "#fff" }}>{w.w}{i < c.length - 1 ? " " : ""}</span>;
      })}
    </div>
  );
};

export const FollowPill: React.FC<{ text: string; op: number; y?: number }> = ({ text, op, y = 1400 }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: op, transform: `translateY(${(1 - op) * 14}px)` }}>
    <div style={{ ...glass, borderRadius: 40, padding: "13px 28px", fontFamily: SERIF, fontStyle: "italic", fontSize: 27, color: "#fff", display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3.5-6 7-6s7 2 7 6" /><path d="M19 8v6M16 11h6" /></svg>
      {text}
    </div>
  </div>
);

// soft vignette + film grain feel over the 3D layer
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.55) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,.35), transparent 22%, transparent 60%, rgba(0,0,0,.45))" }} />
  </>
);

// ---------- 3D ----------
export const Cam: React.FC<{ pos: V3; look: V3; fov?: number; far?: number }> = ({ pos, look, fov = 40, far = 2000 }) => {
  const { camera } = useThree();
  const c = camera as THREE.PerspectiveCamera;
  c.position.set(...pos); c.fov = fov; c.far = far; c.near = 0.05; c.updateProjectionMatrix(); c.lookAt(...look);
  return null;
};

export const Bg: React.FC<{ color: string; fog?: [number, number] }> = ({ color, fog }) => {
  const { scene } = useThree();
  scene.background = new THREE.Color(color);
  scene.fog = fog ? new THREE.Fog(color, fog[0], fog[1]) : null;
  return null;
};

export const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};
// live canvas texture redrawn from the current frame
export const useDyn = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const { cv, tex } = React.useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    return { cv, tex };
  }, [w, h]);
  const c = cv.getContext("2d")!;
  c.clearRect(0, 0, w, h); draw(c); tex.needsUpdate = true;
  return tex;
};
export const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
};

export const Box: React.FC<{ p: V3; s: V3; color: string; rot?: V3; rough?: number; metal?: number; emissive?: string; ei?: number; cast?: boolean; map?: THREE.Texture; op?: number }> = ({ p, s, color, rot = [0, 0, 0], rough = 0.8, metal = 0, emissive, ei = 0, cast = true, map, op = 1 }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? "#000"} emissiveIntensity={ei} map={map ?? null} transparent={op < 1} opacity={op} />
  </mesh>
);

// cardboard parcel with tape + label
let _parcelTex: THREE.Texture | null = null;
export const parcelTex = () => _parcelTex ??= canvasTex(256, 256, (c) => {
  c.fillStyle = "#C79A66"; c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(90,60,30,${rnd(i) * 0.08})`; c.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 256, 3, 3); }
  c.fillStyle = "#B08350"; c.fillRect(108, 0, 40, 256);
  c.fillStyle = "#F4EFE6"; c.fillRect(30, 150, 66, 50);
  c.fillStyle = "#333"; for (let i = 0; i < 4; i++) c.fillRect(36, 158 + i * 10, 40 + (i % 2) * 12, 4);
});
export const Parcel: React.FC<{ p: V3; s?: V3; rot?: V3; scale?: number }> = ({ p, s = [0.42, 0.28, 0.32], rot = [0, 0, 0], scale = 1 }) => (
  <mesh position={p} rotation={rot} scale={scale} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial map={parcelTex()} roughness={0.9} />
  </mesh>
);

// simple matte mannequin like the reference figures
export type Pose = { armL?: number; armR?: number; foreL?: number; foreR?: number; head?: number; walk?: number };
export const Person: React.FC<{ p: V3; ry?: number; shirt?: string; pants?: string; hair?: string; skin?: string; pose?: Pose; scale?: number; children?: React.ReactNode }> = ({ p, ry = 0, shirt = "#4F6D7A", pants = "#3A3F4A", hair = "#5A4636", skin = "#D8C2A6", pose = {}, scale = 1, children }) => {
  const { armL = 0.05, armR = 0.05, foreL = 0, foreR = 0, head = 0, walk = 0 } = pose;
  const sw = Math.sin(walk) * 0.35;
  const mat = (c: string) => <meshStandardMaterial color={c} roughness={0.85} />;
  const Arm = ({ side, a, f }: { side: number; a: number; f: number }) => (
    <group position={[side * 0.215, 1.38, 0]} rotation={[-a + side * sw * 0, 0, side * 0.06]}>
      <mesh position={[0, -0.15, 0]} castShadow><capsuleGeometry args={[0.052, 0.24, 6, 12]} />{mat(shirt)}</mesh>
      <group position={[0, -0.3, 0]} rotation={[-f, 0, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow><capsuleGeometry args={[0.045, 0.2, 6, 12]} />{mat(skin)}</mesh>
        <mesh position={[0, -0.27, 0]} castShadow><sphereGeometry args={[0.05, 12, 10]} />{mat(skin)}</mesh>
        {side > 0 && children ? <group position={[0, -0.32, 0.02]}>{children}</group> : null}
      </group>
    </group>
  );
  return (
    <group position={p} rotation={[0, ry, 0]} scale={scale}>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.09, 0.86, 0]} rotation={[s * sw, 0, 0]}>
          <mesh position={[0, -0.42, 0]} castShadow><capsuleGeometry args={[0.068, 0.7, 6, 12]} />{mat(pants)}</mesh>
          <mesh position={[0, -0.82, 0.05]} castShadow><boxGeometry args={[0.1, 0.07, 0.24]} />{mat("#2A2A2E")}</mesh>
        </group>
      ))}
      <mesh position={[0, 1.18, 0]} castShadow><capsuleGeometry args={[0.165, 0.42, 8, 16]} />{mat(shirt)}</mesh>
      <mesh position={[0, 1.5, 0]} castShadow><cylinderGeometry args={[0.05, 0.055, 0.1, 12]} />{mat(skin)}</mesh>
      <group position={[0, 1.66, 0]} rotation={[head, 0, 0]}>
        <mesh castShadow scale={[1, 1.12, 1]}><sphereGeometry args={[0.115, 20, 16]} />{mat(skin)}</mesh>
        <mesh position={[0, 0.03, -0.012]} scale={[1.06, 1.05, 1.08]} castShadow><sphereGeometry args={[0.115, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />{mat(hair)}</mesh>
      </group>
      <Arm side={-1} a={armL} f={foreL} />
      <Arm side={1} a={armR} f={foreR} />
    </group>
  );
};

// yellow delivery van
export const Van: React.FC<{ p: V3; ry?: number; color?: string; scale?: number }> = ({ p, ry = 0, color = "#F2C230", scale = 1 }) => (
  <group position={p} rotation={[0, ry, 0]} scale={scale}>
    <Box p={[0, 1.15, -0.35]} s={[1.9, 1.75, 3.6]} color={color} rough={0.55} />
    <Box p={[0, 0.85, 1.85]} s={[1.85, 1.1, 1.0]} color={color} rough={0.55} />
    <Box p={[0, 1.2, 2.2]} s={[1.6, 0.55, 0.42]} color="#1D2833" rough={0.2} metal={0.3} rot={[-0.5, 0, 0]} />
    <Box p={[0, 1.15, -0.35]} s={[1.92, 0.22, 3.62]} color="#C8202A" rough={0.6} cast={false} />
    {[[-0.85, 1.4], [0.85, 1.4], [-0.85, -1.3], [0.85, -1.3]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.36, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.36, 0.36, 0.26, 16]} /><meshStandardMaterial color="#1A1A1C" roughness={0.9} /></mesh>
    ))}
    <mesh position={[0.6, 0.85, 2.36]}><boxGeometry args={[0.3, 0.12, 0.02]} /><meshStandardMaterial color="#fff" emissive="#FFF2C8" emissiveIntensity={1.5} /></mesh>
    <mesh position={[-0.6, 0.85, 2.36]}><boxGeometry args={[0.3, 0.12, 0.02]} /><meshStandardMaterial color="#fff" emissive="#FFF2C8" emissiveIntensity={1.5} /></mesh>
  </group>
);

// ---------- Germany dot map ----------
type Geo = { features: { geometry: { type: string; coordinates: number[][][][] | number[][][] } }[] };
export const useGeo = (file = "wwd/de-laender.geo.json") => {
  const [geo, setGeo] = React.useState<Geo | null>(null);
  const [h] = React.useState(() => delayRender("geo"));
  React.useEffect(() => { fetch(staticFile(file)).then((r) => r.json()).then((g) => { setGeo(g); continueRender(h); }); }, []); // eslint-disable-line
  return geo;
};
export const proj = (lon: number, lat: number): V3 => [(lon - 10.45) * 0.63, 0, -(lat - 51.16)];
const rings = (geo: Geo) => {
  const out: number[][][] = [];
  geo.features.forEach((f) => {
    const g = f.geometry;
    if (g.type === "Polygon") (g.coordinates as number[][][]).forEach((r) => out.push(r));
    else (g.coordinates as number[][][][]).forEach((poly) => poly.forEach((r) => out.push(r)));
  });
  return out;
};
const inRing = (x: number, y: number, r: number[][]) => {
  let ins = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
};
export const CITIES: [number, number, number][] = [
  [13.40, 52.52, 3.7], [10.0, 53.55, 1.9], [11.58, 48.14, 1.5], [6.96, 50.94, 1.1], [8.68, 50.11, 0.77], [9.18, 48.78, 0.63], [6.78, 51.23, 0.62],
  [7.47, 51.51, 0.59], [7.01, 51.46, 0.58], [12.37, 51.34, 0.6], [8.81, 53.08, 0.57], [13.74, 51.05, 0.56], [9.73, 52.37, 0.54], [11.08, 49.45, 0.52],
  [7.22, 51.48, 0.36], [7.1, 50.73, 0.33], [7.63, 51.96, 0.32], [8.47, 49.49, 0.31], [8.4, 49.01, 0.31], [10.9, 48.37, 0.3], [8.24, 50.08, 0.28],
  [6.44, 51.19, 0.26], [6.08, 50.78, 0.25], [12.92, 50.83, 0.24], [10.13, 54.32, 0.25], [11.97, 51.48, 0.24], [11.63, 52.12, 0.24], [7.85, 47.99, 0.23],
  [10.68, 53.87, 0.22], [12.1, 54.09, 0.21], [11.03, 50.98, 0.21], [13.06, 52.39, 0.18], [7.0, 49.23, 0.18], [8.27, 50.0, 0.22], [12.1, 49.01, 0.15],
];
export type DotMap = { pts: Float32Array; n: number; lines: Float32Array };
export const buildDots = (geo: Geo, n = 5200): DotMap => {
  const rs = rings(geo);
  const outer = rs.filter((r) => r.length > 30);
  const inside = (lon: number, lat: number) => outer.some((r) => inRing(lon, lat, r));
  const pts: number[] = []; let i = 0, k = 0;
  const total = CITIES.reduce((a, c) => a + c[2], 0);
  while (pts.length / 3 < n && k < n * 30) {
    k++;
    let lon: number, lat: number;
    if (rnd(k * 3.1) < 0.55) {
      let r = rnd(k * 5.7) * total, c = CITIES[0];
      for (const cc of CITIES) { r -= cc[2]; if (r <= 0) { c = cc; break; } }
      const rad = 0.06 + 0.32 * Math.sqrt(c[2]) * Math.pow(rnd(k * 7.3), 1.6);
      const an = rnd(k * 9.1) * Math.PI * 2;
      lon = c[0] + Math.cos(an) * rad * 1.5; lat = c[1] + Math.sin(an) * rad;
    } else { lon = 5.8 + rnd(k * 2.3) * 9.3; lat = 47.2 + rnd(k * 4.9) * 7.9; }
    if (!inside(lon, lat)) continue;
    const q = proj(lon, lat); pts.push(q[0], 0.02, q[2]); i++;
  }
  const lines: number[] = [];
  rs.forEach((r) => { for (let j = 0; j < r.length - 1; j++) { const a = proj(r[j][0], r[j][1]), b = proj(r[j + 1][0], r[j + 1][1]); lines.push(a[0], 0, a[2], b[0], 0, b[2]); } });
  return { pts: new Float32Array(pts), n: pts.length / 3, lines: new Float32Array(lines) };
};
let _dotTex: THREE.Texture | null = null;
export const dotTex = () => _dotTex ??= canvasTex(64, 64, (c) => {
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, "rgba(255,255,255,.85)"); g.addColorStop(0.6, "rgba(255,255,255,.15)"); g.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = g; c.fillRect(0, 0, 64, 64);
});
export const GermanyMap: React.FC<{ dm: DotMap; reveal: number; color?: string; size?: number; lineOp?: number; tint?: { color: string; share: number } }> = ({ dm, reveal, color = "#EAF2FF", size = 0.075, lineOp = 0.55, tint }) => {
  const pg = React.useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(dm.pts, 3)); return g; }, [dm]);
  const tg = React.useMemo(() => {
    if (!tint) return null;
    const sel: number[] = []; for (let i = 0; i < dm.n; i++) if (rnd(i * 13.3) < tint.share) sel.push(dm.pts[i * 3], 0.03, dm.pts[i * 3 + 2]);
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(sel), 3)); return g;
  }, [dm, tint?.share]); // eslint-disable-line
  const lg = React.useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(dm.lines, 3)); return g; }, [dm]);
  pg.setDrawRange(0, Math.floor(dm.n * cl(reveal)));
  return (
    <group>
      <lineSegments geometry={lg}><lineBasicMaterial color="#DDE6F5" transparent opacity={lineOp} /></lineSegments>
      <points geometry={pg}><pointsMaterial map={dotTex()} color={color} size={size} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} /></points>
      {tg && <points geometry={tg}><pointsMaterial map={dotTex()} color={tint!.color} size={size * 1.5} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} /></points>}
    </group>
  );
};
