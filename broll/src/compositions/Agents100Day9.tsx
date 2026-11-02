// Superkind series "KI übernimmt meine Firma", Tag 9/100 (2026-10-30) = "Das Wort aber" (Kundenservice / Beschwerden).
// Hook = example Outlook reply "Tut uns leid, aber …" with "aber" circled + anger meter; the Support house unlocks; the
// everyday scene (customer complains, the reply with "aber" = "nicht unser Fehler", everything before it no longer counts);
// Claude board: paste the mail + the prompt; rewrite overlay: Claude's reply with 4 checks. CTA "Beschwerde" → guide.
// 34 residents (real commenters on Tag 1-8). Example data only (customer + company are fictional, names blurred).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, ToyBox, canvasTex, roundRect, useFontsReady } from "../components/Voxel3D";
import { PillCaptions, Word, PixelTheme } from "../components/PixelKit";
import words from "../../public/sk100d9/words.json";

export const AGENTS_DAY9_SECONDS = 39.6;
const W = 1080, H = 1920;
type V3 = [number, number, number];
const LI_L = "#7FB7FF";
const OR = "#FF6B35", OR_D = "#E5521F", OR_L = "#FFEDE4", INK = "#16130F", MUTED = "#8A857D", LINE = "#EEEAE4", GREEN = "#1F9D55", LI = "#0A66C2", XL = "#107C41", YEL = "#F5C542", GOLD = "#E8B530";
const F_B = "Inter-Bold", F_S = "Inter-SemiBold", F_M = "Inter-Medium";
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const inOut = (v: number) => { const x = cl(v); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };
const bump = (t: number, at: number, d = 0.25) => Math.max(0, 1 - Math.abs(t - at) / d);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const bez3 = (a: V3, c: V3, b: V3, k: number): V3 => lerp3(lerp3(a, c, k), lerp3(c, b, k), k);
const WD = words as Word[];
const S = (i: number) => WD[i].s; // word start by index (script fixed, see runs/fpn-100-agenten-tag9/script.txt)

// ---------- key times from the voice ----------
const T = {
  wort: S(2), wuetender: S(7), aber0: S(10), ich: S(11), ki: S(17), tag: S(23), neun: S(24), service: S(29),
  // everyday scene: the complaint and the reply with "aber"
  kennst: S(30), kunde: S(34), schreibt: S(35), lieferung: S(37), spaet: S(42), und: S(43), antwortest: S(45), tut: S(46), aber1: S(49), probleme: S(53),
  fuer: S(54), nicht: S(59), fehler: S(61), alles: S(62), aber2: S(65), zaehlt: S(66), mehr: S(68),
  // Claude
  kopier: S(69), mail: S(71), claude: S(73), schreib: S(75), antworte: S(76), recht: S(80), wann: S(84), wieder: S(89), nie: S(93), aber3: S(96),
  // Claude's reply
  raus: S(97), sie: S(99), recht2: S(101), ihre: S(106), zwoelf: S(111), versand: S(114), wir: S(116),
  willst: S(117), system: S(121), kommentier: S(122), schick: S(123) + 0.2,
  du: S(125), bot: S(128), vierund: S(135), andere: S(136),
};
const END = T.andere + 0.55;

// ---------- world layout (same town as Tag 2) ----------
const HQ: V3 = [0, 0, 0];
const D0: V3 = [-5, 0, -11];
const I2: V3 = [5.4, 0, -15.5];
type Dept = { n: string; p: V3; yaw: number; st: "done" | "locked"; day?: number };
const DEPTS: Dept[] = [
  { n: "POSITIONIERUNG", p: [-7.6, 0.4, -8.6], yaw: 0.5, st: "done", day: 1 },
  { n: "VERTRIEB", p: [12.0, 0, -8.8], yaw: -0.54, st: "done", day: 2 },
  { n: "MARKETING", p: [-8.0, 0, 2.0], yaw: 0.6, st: "done", day: 8 },
  { n: "SUPPORT", p: [-7.5, 0, -20.5], yaw: 0.4, st: "locked" },
  { n: "BUCHHALTUNG", p: [-0.5, 0, -25.5], yaw: 0.1, st: "done", day: 7 },
  { n: "PERSONAL", p: [7.5, 0, -25.5], yaw: -0.2, st: "locked" },
  { n: "LAGER", p: [12.8, 0, -19.5], yaw: -0.5, st: "locked" },
];
const VERT = DEPTS[1].p;
const fwd = (yaw: number, d: number): [number, number] => [Math.sin(yaw) * d, Math.cos(yaw) * d];
const VD = fwd(DEPTS[1].yaw, 2.0);
const VERT_FRONT: V3 = [VERT[0] + VD[0], 0, VERT[2] + VD[1]];
// real commenters on Tag 1-8 (2026-10-29); mrb2beast moved in overnight (only new name, commented on Tag 7); onlywithpius = Pius, not counted
const RESIDENTS = ["andydeken", "dns.schuett", "leonardovincenzosimeoni1", "makaza_29", "cashflowpunk", "emanuele.augugliaro.1", "petrak_privat", "berlinermom96", "thomas._fuerst", "high5.brands",
  "timothykeller_emden", "berosfreestyle", "felix.bit.hh", "frey123124", "antonnuding", "rumo252", "enes_121212", "ivo_ole", "stamm04",
  "creedmen99", "drdrdoom666", "bastian_poggenpohl", "k.w201", "odi2von3", "dnml28",
  "marcelkaufmann.ai", "maximilianxoxo", "henner20", "vanastencoaching", "christine.k.insta", "michael.scheibe.official", "doginstinct",
  "villan.patrick", "mrb2beast"];
const OLD = 33;
const RES: V3[] = RESIDENTS.map((_, i) => [0.9 + (i % 8) * 1.4 + (Math.floor(i / 8) % 2) * 0.4, 0, -3.4 - Math.floor(i / 8) * 2.5] as V3);
// resident bot colours (Pius 2026-10-26: mixed, not only yellow; orange stays the Geschäftsführer's)
const PAL: [string, string][] = [["#4C8DF6", "#2F6AD0"], ["#3DBE7A", "#279A5C"], ["#9B6CF0", "#7A4BD0"], ["#F27BB0", "#D5578F"], ["#33C3C9", "#1F9CA1"], ["#F5C542", "#D9A520"]];
const RES_C: V3 = [6.4, 0, -5.2];
const DU_P: V3 = [6.4, 0, -1.2];
// order in which the Bürgermeister checks the houses on his morning round
const ROUND = [2, 0, 3, 4, 5, 6, 1];

// ---------- camera ----------
type Hold = { a: number; b: number; p0: V3; p1: V3; l0: V3; l1: V3 };
// hook (2D Outlook reply over the plaza) → series frame at HQ → Support unlocks (seen from the left, past the Tag 1
// monitor) → Claude board in front of Support → 2D reply → CTA → residents → end
const SP_D = fwd(0.4, 1);
const SP: V3 = [-7.5 + SP_D[0] * 2.6, 3.6, -20.5 + SP_D[1] * 2.6];
const SCR_R: [number, number] = [Math.SQRT1_2, Math.SQRT1_2]; // screen-right on the ground for the Support shots (Tag 1 monitor removed so it can't block them)
const HOLDS: Hold[] = [
  { a: 0, b: T.ich - 0.15, p0: [6.4, 4.3, 6.6], p1: [6.4, 4.35, 7.3], l0: [6.4, 3.15, -1.6], l1: [6.4, 3.1, -1.6] },
  { a: T.ich + 0.15, b: T.tag - 0.35, p0: [1.0, 3.6, 10.2], p1: [0.6, 3.6, 9.2], l0: [0.3, 2.5, -0.6], l1: [0.3, 2.5, -0.8] },
  { a: T.tag + 0.45, b: T.kopier - 0.15, p0: [-15.0, 5.4, -8.6], p1: [-14.2, 5.0, -9.8], l0: [-7.3, 2.6, -19.6], l1: [-7.2, 2.8, -19.4] },
  { a: T.kopier + 0.25, b: T.willst + 0.45, p0: [-13.6, 4.4, -11.0], p1: [-13.2, 4.4, -11.4], l0: SP, l1: SP },
  { a: T.willst + 0.65, b: T.du - 0.15, p0: [6.4, 6.2, 7.6], p1: [6.4, 5.9, 6.8], l0: [6.4, 2.6, -3.0], l1: [6.4, 2.6, -3.0] },
  { a: T.du + 0.15, b: END, p0: [6.6, 6.0, 6.0], p1: [6.6, 5.7, 5.3], l0: [6.6, 0.2, -4.6], l1: [6.6, 0.2, -4.8] },
  { a: END + 0.35, b: AGENTS_DAY9_SECONDS, p0: [6.0, 6.2, 9.6], p1: [5.8, 6.8, 10.4], l0: [6.0, 3.4, -4.6], l1: [6.0, 3.4, -4.6] },
];
// transit control points: above the midpoint of the two holds
const VIA = HOLDS.slice(0, -1).map((h, i) => {
  const n = HOLDS[i + 1];
  const pos = lerp3(h.p1, n.p0, 0.5), look = lerp3(h.l1, n.l0, 0.5);
  return { pos: [pos[0], pos[1] + 2.2, pos[2] + 1.0] as V3, look };
});
const camAt = (t: number): { pos: V3; look: V3 } => {
  for (let i = 0; i < HOLDS.length; i++) {
    const h = HOLDS[i];
    const hk = inOut((Math.max(t, h.a) - h.a) / Math.max(0.01, h.b - h.a));
    if (t <= h.b) return { pos: lerp3(h.p0, h.p1, hk), look: lerp3(h.l0, h.l1, hk) };
    const n = HOLDS[i + 1];
    if (n && t < n.a) {
      const k = inOut((t - h.b) / (n.a - h.b));
      return { pos: bez3(h.p1, VIA[i].pos, n.p0, k), look: bez3(h.l1, VIA[i].look, n.l0, k) };
    }
  }
  const l = HOLDS[HOLDS.length - 1];
  return { pos: l.p1, look: l.l1 };
};
const PUNCH = [T.aber0, T.tag, T.service, T.aber1, T.fehler, T.claude, T.aber3, T.sie, T.wir, T.kommentier, T.bot];

// ---------- helpers ----------
const useImage = (src: string) => {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [h] = React.useState(() => delayRender("image " + src));
  React.useEffect(() => {
    const i = new Image();
    i.onload = () => { setImg(i); continueRender(h); };
    i.onerror = () => continueRender(h);
    i.src = src;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return img;
};
const useDyn = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const { cv, tex } = React.useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { cv, tex };
  }, [w, h]);
  const c = cv.getContext("2d")!;
  c.clearRect(0, 0, w, h);
  draw(c);
  tex.needsUpdate = true;
  return tex;
};
const fit = (c: CanvasRenderingContext2D, text: string, fam: string, max: number, maxW: number) => {
  let s = max;
  c.font = `${s}px ${fam}`;
  while (c.measureText(text).width > maxW && s > 10) { s -= 2; c.font = `${s}px ${fam}`; }
  return s;
};
const pxArt = (c: CanvasRenderingContext2D, rows: string[], pal: Record<string, string>, x: number, y: number, px: number) => {
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch]) { c.fillStyle = pal[ch]; c.fillRect(x + i * px, y + j * px, px + 0.5, px + 0.5); } }));
};
const BOT_ROWS = [".....Y......", ".....A......", "...OOOOOO...", "..OOOOOOOO..", ".OOWWOOWWOO.", ".OOWPOOWPOO.", ".OOOOOOOOOO.", ".OOOLMMLOOO.", "..OOOOOOOO..", "HHOOOOOOOOHH", "..OOOOOOOO..", "..OO....OO..", "..DD....DD.."];
const BOT_PAL = { Y: "#F5C542", A: "#2C2420", O: "#FFFFFF", W: OR, P: "#2C2420", L: OR_D, M: OR_D, H: "#FFFFFF", D: "#FFFFFF" };
const BOT_PAL_OR = { Y: "#F5C542", A: "#2C2420", O: OR, W: "#FFFFFF", P: "#2C2420", L: "#9C4A31", M: "#9C4A31", H: "#B85F42", D: "#2C2420" };
const HAND = ["..KK......", ".KWWK.....", ".KWWK.....", ".KWWKKK...", ".KWWKWWKK.", "KKWWKWWKWK", "KWWWWWWKWK", "KWWWWWWWWK", ".KWWWWWWWK", "..KWWWWWK.", "...KKKKK.."];
const botTile = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  const g = c.createLinearGradient(x, y, x + s, y + s);
  g.addColorStop(0, "#FF8A5B"); g.addColorStop(0.6, OR); g.addColorStop(1, OR_D);
  c.fillStyle = g; roundRect(c, x, y, s, s, s * 0.28); c.fill();
  const px = s / 16;
  pxArt(c, BOT_ROWS, BOT_PAL, x + (s - 12 * px) / 2, y + (s - 13 * px) / 2, px);
};
const cursorHand = (c: CanvasRenderingContext2D, x: number, y: number, press: boolean, px = 6) => {
  c.save(); c.translate(x - 10, y - 4); c.rotate(-0.2); const s = press ? 0.86 : 1; c.scale(s, s);
  pxArt(c, HAND, { K: "rgba(0,0,0,.25)" }, 3, 6, px);
  pxArt(c, HAND, { K: INK, W: "#FFFFFF" }, 0, 0, px);
  c.restore();
};
const wrap = (c: CanvasRenderingContext2D, text: string, maxW: number) => {
  const out: string[] = [];
  let line = "";
  text.split(" ").forEach((w) => { const tr = line ? line + " " + w : w; if (c.measureText(tr).width > maxW && line) { out.push(line); line = w; } else line = tr; });
  if (line) out.push(line);
  return out;
};

const signTex = (text: string, bg: string, fg: string, border: string, w = 760, h = 190, fam = F_B) =>
  canvasTex(w, h, (c) => {
    c.fillStyle = "rgba(0,0,0,.12)"; roundRect(c, 6, 10, w - 12, h - 12, 36); c.fill();
    c.fillStyle = border; roundRect(c, 0, 0, w - 6, h - 10, 36); c.fill();
    c.fillStyle = bg; roundRect(c, 9, 9, w - 24, h - 28, 28); c.fill();
    c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
    fit(c, text, fam, h * 0.46, w - 90);
    c.fillText(text, (w - 6) / 2, (h - 10) / 2 + 3);
  });
const deptTex = (name: string, st: "done" | "today" | "locked", day?: number) =>
  canvasTex(900, 250, (c) => {
    const bg = st === "done" ? GREEN : st === "today" ? OR : "#FFFFFF";
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 888, 236, 44); c.fill();
    c.fillStyle = bg; roundRect(c, 0, 0, 888, 236, 44); c.fill();
    if (st === "locked") { c.strokeStyle = "#E2DCD3"; c.lineWidth = 6; roundRect(c, 3, 3, 882, 230, 41); c.stroke(); }
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = st === "locked" ? INK : "#FFFFFF";
    fit(c, name, F_B, 84, 800); c.fillText(name, 444, 92);
    c.font = `46px ${F_B}`;
    c.fillStyle = st === "locked" ? "#A39C90" : "rgba(255,255,255,.9)";
    c.fillText(st === "done" ? `✓ KI seit Tag ${day}` : st === "today" ? "▶ heute: Tag 3" : "🔒 noch Mensch", 444, 178);
  });
const skillTex = (name: string, on: boolean) =>
  canvasTex(900, 250, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 888, 236, 44); c.fill();
    c.fillStyle = on ? OR : "#FFFFFF"; roundRect(c, 0, 0, 888, 236, 44); c.fill();
    if (!on) { c.strokeStyle = "#E2DCD3"; c.lineWidth = 6; roundRect(c, 3, 3, 882, 230, 41); c.stroke(); }
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = on ? "#FFFFFF" : INK; fit(c, name, F_B, 84, 800); c.fillText(name, 444, 92);
    c.font = `50px ${F_B}`; c.fillStyle = on ? "rgba(255,255,255,.92)" : "#A39C90";
    c.fillText(on ? "📜 Skill = Mitarbeiter" : "📜 Skill kommt noch", 444, 178);
  });
const tagTex = (top: string, bottom: string, bg: string) =>
  canvasTex(560, 190, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 6, 12, 548, 176, 36); c.fill();
    c.fillStyle = bg; roundRect(c, 0, 0, 548, 176, 36); c.fill();
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#FFFFFF"; fit(c, top, F_B, 62, 500); c.fillText(top, 274, 64);
    c.fillStyle = "rgba(255,255,255,.88)"; fit(c, bottom, F_B, 44, 490); c.fillText(bottom, 274, 134);
  });
const card = (c: CanvasRenderingContext2D, w: number, h: number, border: string) => {
  c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, w - 16, h - 16, 40); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w - 8, h - 14, 40); c.fill();
  c.strokeStyle = border; c.lineWidth = 6; roundRect(c, 3, 3, w - 14, h - 20, 37); c.stroke();
  c.textBaseline = "middle"; c.textAlign = "left";
};
// the Bürgermeister as a small pixel avatar (orange bot with top hat) for 2D cards
const mayorIcon = (c: CanvasRenderingContext2D, x: number, y: number, s: number) => {
  c.fillStyle = OR; roundRect(c, x - s * 0.42, y - s * 0.2, s * 0.84, s * 0.7, s * 0.14); c.fill();
  c.fillStyle = "#FFFFFF"; c.fillRect(x - s * 0.24, y, s * 0.15, s * 0.17); c.fillRect(x + s * 0.09, y, s * 0.15, s * 0.17);
  c.fillStyle = INK; c.fillRect(x - s * 0.3, y - s * 0.3, s * 0.6, s * 0.1); c.fillRect(x - s * 0.19, y - s * 0.62, s * 0.38, s * 0.34);
  c.fillStyle = OR_D; c.fillRect(x - s * 0.19, y - s * 0.36, s * 0.38, s * 0.06);
  c.strokeStyle = GOLD; c.lineWidth = s * 0.06; c.beginPath(); c.arc(x, y + s * 0.3, s * 0.2, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
};

// ---------- 3D pieces ----------
type Tex = Record<string, THREE.Texture>;
const Island: React.FC<{ p: V3; r: number; t: number; active?: boolean; locked?: boolean; done?: boolean; vis?: number }> = ({ p, r, t, active, locked, done, vis = 1 }) => {
  if (vis <= 0.001) return null;
  return (
    <group position={p} scale={[vis, vis, vis]}>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r + 0.12, 0.4, 48]} />
        <meshStandardMaterial color={locked ? "#E3DDD4" : done ? GREEN : OR} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.405, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[r - 0.14, 48]} />
        <meshStandardMaterial color={locked ? "#F1EDE7" : "#FFFFFF"} roughness={0.9} />
      </mesh>
      {active && Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r + 0.03), 0.22, Math.sin(a) * (r + 0.03)]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.1, 0.26, 0.34]} />
            <meshBasicMaterial color="#FFF3EC" transparent opacity={0.25 + 0.5 * Math.max(0, Math.sin(t * 4 - i * 0.5))} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Burst3D: React.FC<{ at: number; t: number; p: V3; colors: string[]; n?: number; power?: number; floor?: number }> = ({ at, t, p, colors, n = 16, power = 1, floor = 0.45 }) => {
  const k = t - at;
  if (k < 0 || k > 1.2) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i + at) * 0.6;
        const v = (1.8 + rnd(i * 3 + at) * 2.2) * power;
        const up = 3 + rnd(i * 7 + at) * 3;
        const s = 0.15 * (1 - k / 1.2) + 0.04;
        return (
          <mesh key={i} position={[p[0] + Math.cos(a) * v * k, Math.max(floor, p[1] + up * k - 6 * k * k), p[2] + Math.sin(a) * v * k]} rotation={[k * 9 + i, k * 7, 0]}>
            <boxGeometry args={[s, s, s]} />
            <meshBasicMaterial color={colors[i % colors.length]} toneMapped={false} />
          </mesh>
        );
      })}
    </>
  );
};

// a sign that always faces the camera
const Board: React.FC<{ p: V3; tex: THREE.Texture; w: number; h: number; t: number; q: THREE.Quaternion; at?: number; until?: number; bob?: number; tilt?: number; s?: number }> = ({ p, tex, w, h, t, q, at: a = -99, until = 999, bob: _bob = 0, tilt: _tilt = 0, s: sc = 1 }) => {
  const s = back((t - a) / 0.35) * (1 - ease((t - until) / 0.25)) * sc;
  if (s <= 0.001) return null;
  return (
    <group position={p} quaternion={q.clone()}>
      <group scale={[s, s, s]}>
        <mesh renderOrder={10}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} depthWrite={false} depthTest={false} />
        </mesh>
      </group>
    </group>
  );
};

// a bot (3D PixelBot). Bürgermeister = top hat + gold chain (+ clipboard on his rounds)
type BotPose = { body?: string; dark?: string; walk?: number; armL?: number; armR?: number; lift?: number; prop?: "clipboard" | "none"; talk?: boolean; vis?: number; s?: number; badge?: THREE.Texture; mayor?: boolean };
const SkBot: React.FC<{ p: V3; yaw?: number; t: number; seed?: number } & BotPose> = ({ p, yaw = 0, t, seed = 0, body = OR, dark = OR_D, walk = 0, armL = 15, armR = 15, lift = 0, prop = "none", talk, vis = 1, s = 1, badge, mayor }) => {
  if (vis <= 0.001) return null;
  const ph = t * 11 + seed;
  const bob = Math.abs(Math.sin(t * 4.4 + seed)) * 0.1 * (1 - walk) + Math.abs(Math.sin(ph)) * 0.16 * walk;
  const swing = Math.sin(ph) * walk;
  const blink = (t * 1.2 + seed * 0.37) % 3.1 < 0.09;
  const sc = s * vis;
  const arm = (side: -1 | 1, deg: number, node?: React.ReactNode) => (
    <group position={[side * 0.72, 0.95, 0.05]} rotation={[side * swing * 0.8, 0, (side * deg * Math.PI) / 180]}>
      <mesh castShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[0.24, 0.5, 0.26]} />
        <meshStandardMaterial color={dark} roughness={0.6} />
      </mesh>
      {node && <group position={[0, -0.52, 0.05]}>{node}</group>}
    </group>
  );
  return (
    <group position={[p[0], p[1] + lift + bob, p[2]]} rotation={[0, yaw, 0]} scale={[sc, sc, sc]}>
      {[-0.28, 0.28].map((x, li) => (
        <group key={x} position={[x, 0.32, 0]} rotation={[(li ? -1 : 1) * swing * 0.75, 0, 0]}>
          <mesh castShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[0.26, 0.32, 0.3]} />
            <meshStandardMaterial color="#2C2420" />
          </mesh>
        </group>
      ))}
      <group rotation={[0.13 * walk, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <boxGeometry args={[1.28, 1.3, 1.08]} />
        <meshStandardMaterial color={body} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.3, 0.14, 1.1]} />
        <meshStandardMaterial color={dark} roughness={0.6} />
      </mesh>
      {[-0.29, 0.29].map((x) => (
        <group key={x} position={[x, 1.12, 0.545]}>
          <mesh><boxGeometry args={[0.34, blink ? 0.05 : 0.36, 0.03]} /><meshBasicMaterial color="#FFFFFF" toneMapped={false} /></mesh>
          {!blink && <mesh position={[0.05, -0.04, 0.02]}><boxGeometry args={[0.15, 0.19, 0.02]} /><meshBasicMaterial color="#2C2420" /></mesh>}
        </group>
      ))}
      <mesh position={[0, 0.72, 0.545]}>
        <boxGeometry args={[0.34, talk ? 0.05 + 0.07 * Math.abs(Math.sin(t * 14 + seed)) : 0.06, 0.03]} />
        <meshBasicMaterial color="#9C4A31" />
      </mesh>
      {badge && <mesh position={[0, 0.43, 0.56]}><planeGeometry args={[0.34, 0.34]} /><meshBasicMaterial map={badge} transparent toneMapped={false} /></mesh>}
      {mayor ? (
        <>
          {/* top hat */}
          <mesh position={[0, 1.68, 0]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.07, 28]} /><meshStandardMaterial color="#1E1A16" roughness={0.5} /></mesh>
          <mesh position={[0, 2.06, 0]} castShadow><cylinderGeometry args={[0.4, 0.42, 0.72, 28]} /><meshStandardMaterial color="#1E1A16" roughness={0.45} /></mesh>
          <mesh position={[0, 1.8, 0]}><cylinderGeometry args={[0.425, 0.43, 0.13, 28]} /><meshStandardMaterial color={OR_D} roughness={0.5} /></mesh>
          {/* chain of office */}
          {Array.from({ length: 9 }).map((_, i) => {
            const a = Math.PI * (0.15 + (i / 8) * 0.7);
            return <mesh key={i} position={[Math.cos(a) * 0.5, 0.82 - Math.sin(a) * 0.32 + 0.3, 0.56]}><boxGeometry args={[0.13, 0.13, 0.05]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} emissive={GOLD} emissiveIntensity={0.15} /></mesh>;
          })}
          <mesh position={[0, 0.5, 0.57]}><cylinderGeometry args={[0.15, 0.15, 0.05, 20]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} emissive={GOLD} emissiveIntensity={0.25} /></mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 1.83, 0]} castShadow><boxGeometry args={[0.08, 0.42, 0.08]} /><meshStandardMaterial color="#2C2420" /></mesh>
          <mesh position={[0, 2.08, 0]} castShadow><boxGeometry args={[0.22, 0.22, 0.22]} /><meshStandardMaterial color="#F5C542" emissive="#F5C542" emissiveIntensity={0.35 + 0.35 * Math.max(0, Math.sin(t * 6 + seed))} /></mesh>
        </>
      )}
      {arm(-1, armL)}
      {arm(1, armR, prop === "clipboard" ? (
        <group rotation={[-0.4, 0, -0.5]}>
          <ToyBox p={[0, -0.1, 0.12]} s={[0.5, 0.64, 0.05]} color="#8A5A35" />
          <ToyBox p={[0, -0.12, 0.15]} s={[0.42, 0.52, 0.02]} color="#FFFFFF" />
          <ToyBox p={[0, 0.2, 0.16]} s={[0.2, 0.08, 0.04]} color="#B9B1A6" />
        </group>
      ) : undefined)}
      </group>
    </group>
  );
};

const Monitor: React.FC<{ p: V3; w: number; h: number; tex: THREE.Texture; yaw?: number; stand?: number; posts?: boolean }> = ({ p, w, h, tex, yaw = 0, stand = 0, posts }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <ToyBox p={[0, 0, -0.12]} s={[w + 0.24, h + 0.24, 0.2]} color="#2A2622" />
    <mesh position={[0, 0, 0.002]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
    {stand > 0 && <><ToyBox p={[0, -h / 2 - stand / 2, -0.15]} s={[0.3, stand, 0.26]} color="#2A2622" /><ToyBox p={[0, -h / 2 - stand, -0.1]} s={[1.2, 0.08, 0.7]} color="#2A2622" /></>}
    {posts && [-w / 2 + 0.3, w / 2 - 0.3].map((x) => <ToyBox key={x} p={[x, -(p[1]) / 2 - h / 4 + 0.1, -0.2]} s={[0.22, p[1] - h / 2 + 0.2, 0.22]} color="#2A2622" />)}
  </group>
);

// Chefbüro → Rathaus: roof flips orange when the KI moves in, the sign changes at "Bürgermeister"
const HQBuilding: React.FC<{ t: number; tex: Tex }> = ({ t, tex }) => {
  const glow = bump(t, T.ki + 0.1, 0.4);
  const orange = t > T.ki + 0.05;
  const pop = 1 + 0.15 * bump(t, T.ki + 0.1, 0.2);
  const rathaus = true;
  return (
    <group position={[0, 0.4, -1.2]} scale={[pop, pop, pop]}>
      <ToyBox p={[0, 1.1, 0]} s={[3.2, 2.2, 2.2]} color="#FFFFFF" top="#FFFFFF" />
      <mesh position={[0, 2.75, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.55, 1.3, 4]} />
        <meshStandardMaterial color={orange ? OR : "#CFC6BA"} roughness={0.6} flatShading />
      </mesh>
      <ToyBox p={[0, 0.55, 1.11]} s={[0.6, 1.1, 0.05]} color="#8A5A35" />
      {[-1.0, 1.0].map((x) => <ToyBox key={x} p={[x, 1.35, 1.11]} s={[0.6, 0.55, 0.05]} color="#BFE3F2" emissive="#FFE6B0" ei={0.3 + glow} />)}
      <group position={[0, 1.95, 1.16]}>
        <ToyBox p={[0, 0, -0.03]} s={[2.5, 0.5, 0.06]} color={rathaus ? GOLD : INK} />
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.44, 0.44]} /><meshBasicMaterial map={rathaus ? tex.rathausSign : tex.hqSign} toneMapped={false} /></mesh>
      </group>
      {rathaus && (
        <group position={[0.9, 3.2, 0]}>
          <ToyBox p={[0, 0.6, 0]} s={[0.08, 1.2, 0.08]} color="#2C2420" />
          <group rotation={[0, Math.sin(t * 5) * 0.25, 0]}><ToyBox p={[0.38, 1.0, 0]} s={[0.7, 0.42, 0.04]} color={GOLD} /></group>
        </group>
      )}
      <pointLight position={[0, 1.6, 2.2]} intensity={6 * glow} distance={6} color="#FFB48A" />
    </group>
  );
};

// a department house: green roof + flag = KI, grey + padlock = still human. Checked on the Bürgermeister's round.
const DeptHouse: React.FC<{ d: Dept; i: number; t: number; plate: THREE.Texture }> = ({ d, i, t, plate }) => {
  // Support (i = 3) unlocks today at "Kundenservice": padlock flies off, roof turns orange, flag goes up
  const today = i === 3 && t > T.service;
  const st = today ? "done" : d.st;
  const roof = today ? OR : st === "done" ? GREEN : "#CFC6BA";
  const pop = 1 + (i === 3 ? 0.22 * bump(t, T.service + 0.1, 0.3) : 0);
  const lit = st !== "locked";
  const off = i === 3 ? ease((t - T.service) / 0.5) : 0;
  const lockK = d.st === "locked" ? 1 - off : 0;
  return (
    <group position={d.p} rotation={[0, d.yaw, 0]}>
      <ToyBox p={[0, 0.06, 0]} s={[3.8, 0.12, 3.6]} color={today ? OR_L : st === "done" ? "#DDF3E6" : "#E7E1D8"} />
      <group scale={[pop, pop, pop]}>
        <ToyBox p={[0, 1.0, 0]} s={[2.4, 1.7, 2.0]} color="#FFFFFF" top="#FFFFFF" />
        <mesh position={[0, 2.4, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.95, 1.15, 4]} />
          <meshStandardMaterial color={roof} roughness={0.6} flatShading />
        </mesh>
        <ToyBox p={[0, 0.5, 1.01]} s={[0.5, 0.85, 0.05]} color="#8A5A35" />
        {[-0.78, 0.78].map((x) => <ToyBox key={x} p={[x, 1.05, 1.01]} s={[0.46, 0.42, 0.05]} color={lit ? "#BFE3F2" : "#DAD4CB"} emissive={lit ? "#FFE6B0" : undefined} ei={lit ? 0.35 + 0.25 * Math.max(0, Math.sin(t * 3 + i)) : 0} />)}
        <group position={[0, 1.6, 1.04]}>
          <ToyBox p={[0, 0, -0.02]} s={[2.2, 0.44, 0.04]} color={INK} />
          <mesh position={[0, 0, 0.005]}><planeGeometry args={[2.14, 0.38]} /><meshBasicMaterial map={plate} toneMapped={false} /></mesh>
        </group>
        {st === "done" && (
          <group position={[0.55, 2.9, 0]} scale={[1, today ? ease((t - T.service - 0.2) / 0.4) : 1, 1]}>
            <ToyBox p={[0, 0.5, 0]} s={[0.07, 1.0, 0.07]} color="#2C2420" />
            <group rotation={[0, Math.sin(t * 5 + i) * 0.25, 0]}><ToyBox p={[0.33, 0.82, 0]} s={[0.6, 0.36, 0.04]} color={today ? OR : GREEN} /></group>
          </group>
        )}
        {lockK > 0.01 && (
          <group position={[off * 1.6, 3.45 + Math.sin(t * 2 + i) * 0.06 + off * 3, 0]} rotation={[0, 0, Math.sin(t * 22 + i) * 0.25 * (i === 3 ? bump(t, T.service - 0.2, 0.4) : 0) + off * 2]} scale={[lockK * 1.3, lockK * 1.3, lockK * 1.3]}>
            <ToyBox p={[0, 0, 0]} s={[0.9, 0.72, 0.36]} color="#B9B1A6" />
            <mesh position={[0, 0.45, 0]}><torusGeometry args={[0.28, 0.08, 8, 20, Math.PI]} /><meshStandardMaterial color="#8A857D" /></mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// the market around Vertrieb's lot; the 20 houses messaged on Tag 2 keep their blue roofs
const HOUSE_N = 40;
const HOUSES = (() => {
  const out: { x: number; z: number; yaw: number; s: number; pick: number }[] = [];
  for (let i = 0; out.length < HOUSE_N && i < 4000; i++) {
    const a = i * 2.39996, r = 3.95 + Math.sqrt(i) * 0.42;
    const x = I2[0] + Math.cos(a) * r, z = I2[2] + Math.sin(a) * r;
    if (Math.hypot(x - D0[0], z - D0[2]) < 6.7) continue;
    if (DEPTS.some((d) => Math.hypot(x - d.p[0], z - d.p[2]) < 3.4)) continue;
    if (z > -8.2) continue;
    out.push({ x, z, yaw: (rnd(i + 5) - 0.5) * 0.8, s: 0.9 + rnd(i + 9) * 0.25, pick: rnd(i * 7 + 1) });
  }
  return out;
})();
const TOP20 = HOUSES.map((h, j) => ({ j, p: h.pick })).sort((a, b) => b.p - a.p).slice(0, 20).map((x) => x.j);
const Houses: React.FC<{ t: number }> = ({ t }) => {
  const { body, roof, door } = React.useMemo(() => {
    const mk = (geo: THREE.BufferGeometry, mat: THREE.Material, colors?: boolean) => {
      const m = new THREE.InstancedMesh(geo, mat, HOUSE_N);
      m.castShadow = true; m.frustumCulled = false;
      if (colors) HOUSES.forEach((_, i) => m.setColorAt(i, new THREE.Color(OR)));
      return m;
    };
    const roofGeo = new THREE.ConeGeometry(0.62, 0.48, 4); roofGeo.rotateY(Math.PI / 4);
    return {
      body: mk(new THREE.BoxGeometry(0.78, 0.56, 0.7), new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.7 })),
      roof: mk(roofGeo, new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.6, flatShading: true }), true),
      door: mk(new THREE.BoxGeometry(0.18, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: "#8A5A35" })),
    };
  }, []);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), off = new THREE.Matrix4(), col = new THREE.Color();
  HOUSES.forEach((h, i) => {
    const ti = TOP20.indexOf(i);
    const s = h.s;
    e.set(0, h.yaw, 0); q.setFromEuler(e);
    m.compose(new THREE.Vector3(h.x, 0, h.z), q, new THREE.Vector3(s, s, s));
    body.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.28, 0)));
    roof.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.8, 0)));
    door.setMatrixAt(i, m.clone().multiply(off.makeTranslation(0, 0.14, 0.36)));
    roof.setColorAt(i, col.set(ti >= 0 ? LI : "#CFC6BA"));
  });
  [body, roof, door].forEach((x) => { x.instanceMatrix.needsUpdate = true; });
  if (roof.instanceColor) roof.instanceColor.needsUpdate = true;
  return <><primitive object={body} /><primitive object={roof} /><primitive object={door} /></>;
};

// ---------- motion ----------
type K = { a: number; b: number; p: V3; yaw: number; walk?: boolean };
const basePath = (keys: K[], tt: number): { p: V3; yaw: number; tr: boolean } => {
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (tt <= k.b) {
      if (tt >= k.a || i === 0) return { p: k.p, yaw: k.yaw, tr: false };
      const pr = keys[i - 1]; const kk = (k.walk ? (x: number) => x : inOut)(cl((tt - pr.b) / (k.a - pr.b))); const pp = lerp3(pr.p, k.p, kk);
      return { p: [pp[0], pp[1] + (k.walk ? 0 : Math.sin(kk * Math.PI) * 0.7), pp[2]], yaw: pr.yaw + (k.yaw - pr.yaw) * kk, tr: !k.walk };
    }
  }
  return { p: keys[keys.length - 1].p, yaw: 0, tr: false };
};
const seg = (tt: number, a: number, b: number, f: (u: number) => V3): V3 => {
  if (tt <= a || tt >= b) return [0, 0, 0];
  const env = ease((tt - a) / 0.45) * ease((b - tt) / 0.45);
  const o = f(tt - a); return [o[0] * env, o[1] * env, o[2] * env];
};
// Geschäftsführer: Chefbüro door (hook), plaza (series frame), then left of the Claude board in front of Support with his
// clipboard until the CTA; jumps out of shot during the transit to the residents
const SP_MAYOR: V3 = [SP[0] - SCR_R[0] * 3.4 - SCR_R[0] * 1.0, 0, SP[2] - SCR_R[1] * 3.4 + SCR_R[1] * 1.0];
const MAYOR_KEYS: K[] = [
  { a: 0, b: T.ich - 0.1, p: [4.2, 0, -0.4], yaw: 0.5 },
  { a: T.ich + 0.4, b: T.tag - 0.2, p: [1.8, 0.4, 1.5], yaw: -0.2, walk: true },
  { a: T.tag + 0.45, b: T.willst + 0.02, p: SP_MAYOR, yaw: -0.6 },
  { a: T.willst + 0.07, b: 99, p: [6.4, 0, -9.8], yaw: 0 },
];
// customers of Support: walk off screen-right while "aber" lands, come back for Claude's reply
const SP_DOOR: V3 = [-7.5 + SP_D[0] * 1.3, 0, -20.5 + SP_D[1] * 1.3];
const SP_SIDE: [number, number] = [SP_D[1], -SP_D[0]];
const VISITORS = [0, 1, 2, 3].map((i) => {
  const away = 4.5 + i * 1.1, side = (i - 1.5) * 1.3;
  return { out: [SP_DOOR[0] + SCR_R[0] * away + SP_D[0] * (1.2 + side * 0.4), 0, SP_DOOR[2] + SCR_R[1] * away + SP_D[1] * (1.2 + side * 0.4)] as V3, seed: 40 + i };
});
const visitorAt = (i: number, t: number): { p: V3; walk: number; yaw: number; vis: number } => {
  const v = VISITORS[i];
  const home: V3 = [SP_DOOR[0] + SP_SIDE[0] * (i - 1.5) * 0.8 + SP_D[0] * 1.0, 0, SP_DOOR[2] + SP_SIDE[1] * (i - 1.5) * 0.8 + SP_D[1] * 1.0];
  const leave = cl((t - T.nicht - i * 0.18) / (T.mehr + 0.4 - T.nicht));
  const ret = cl((t - T.sie - i * 0.15) / 0.9);
  const k = ret > 0 ? 1 - ret : leave;
  const p = lerp3(home, v.out, k);
  const moving = (leave > 0 && leave < 1 && ret === 0) || (ret > 0 && ret < 1);
  const dir = ret > 0 ? [home[0] - v.out[0], home[2] - v.out[2]] : [v.out[0] - home[0], v.out[2] - home[2]];
  return { p, walk: moving ? 1 : 0, yaw: moving ? Math.atan2(dir[0], dir[1]) : -0.6, vis: back((t - T.kennst - i * 0.1) / 0.35) };
};
const mayorWander = (tt: number): V3 => seg(tt, T.willst + 0.3, 99, (u) => [Math.sin(u * 1.0) * 0.5, 0, 0]);
const botMotion = (keys: K[], wander: (tt: number) => V3, t: number) => {
  const pos = (tt: number): V3 => { const b0 = basePath(keys, tt).p, w = wander(tt); return [b0[0] + w[0], b0[1], b0[2] + w[2]]; };
  const b = basePath(keys, t);
  const p = pos(t), pA = pos(t - 0.05), pB = pos(t + 0.05);
  const vx = (pB[0] - pA[0]) / 0.1, vz = (pB[2] - pA[2]) / 0.1;
  const walk = b.tr ? 0 : cl(Math.hypot(vx, vz) / 1.1);
  let dy = Math.atan2(vx, vz) - b.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  return { p, yaw: b.yaw + dy * walk, walk, hopping: b.tr };
};

const World: React.FC<{ t: number; tex: Tex; dyn: Record<string, THREE.Texture> }> = ({ t, tex, dyn }) => {
  const cam = camAt(t);
  const punch = Math.max(0, ...PUNCH.map((p) => bump(t, p, 0.22)));
  const q = React.useMemo(() => new THREE.Quaternion(), []);
  const m4 = new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.pos), new THREE.Vector3(...cam.look), new THREE.Vector3(0, 1, 0));
  q.setFromRotationMatrix(m4);
  const lightTarget = React.useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(cam.look[0], 0, cam.look[2]);
  lightTarget.updateMatrixWorld();
  const look = cam.look;

  const my = botMotion(MAYOR_KEYS, mayorWander, t);
  let armL = 15 + 8 * Math.sin(t * 3), armR = 15 - 8 * Math.sin(t * 3), lift = 0;
  let prop: BotPose["prop"] = "none";
  const cheer = (a: number, h = 1.0) => { if (t > a - 0.1 && t < a + 0.6) { armL = armR = 160; lift = Math.max(0, Math.sin(((t - a + 0.1) / 0.6) * Math.PI)) * h; } };
  if (my.hopping) armL = armR = 150;
  else if (t < T.ich) { prop = "clipboard"; armR = 70; armL = 20; }
  else if (t < T.tag) { cheer(T.ki + 0.05, 0.7); }
  else if (t < T.kopier) { cheer(T.service + 0.1, 1.0); if (t > T.fehler - 0.2 && t < T.mehr + 0.3) { armL = 120 + 20 * Math.sin(t * 9); } }
  else if (t < T.willst) { prop = "clipboard"; armR = 70; armL = 20; cheer(T.claude + 0.1, 0.6); cheer(T.wir + 0.1, 0.9); }
  else { armL = armR = 30; cheer(T.bot + 0.2, 0.6); }
  const camD = Math.hypot(cam.pos[0] - my.p[0], cam.pos[1] - my.p[1] - 1, cam.pos[2] - my.p[2]);
  const mayorVis = cl((camD - 2.0) / 1.5) * back((t + 0.02) / 0.35);

  return (
    <>
      <CameraRig pos={cam.pos} look={look} fov={48 - 3 * punch} />
      <color attach="background" args={["#F3EEE7"]} />
      <fog attach="fog" args={["#F3EEE7", 75, 160]} />
      <ambientLight intensity={0.75} color="#FFF4E8" />
      <hemisphereLight args={["#FFFFFF", "#E8D9C8", 0.7]} />
      <primitive object={lightTarget} />
      <directionalLight position={[look[0] + 7, 18, look[2] + 10]} target={lightTarget} intensity={1.6} color="#FFF1E0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-camera-far={80} shadow-bias={-0.0015} shadow-normalBias={0.04} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -16]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial map={tex.floor} roughness={0.95} />
      </mesh>

      {/* streets: plaza → every department; while the Bürgermeister directs they light up gold, one after the other */}
      {DEPTS.flatMap((d, j) => {
        const a = HQ, b = d.p;
        const dd = Math.hypot(b[0] - a[0], b[2] - a[2]);
        const n = Math.floor(dd / 0.9);
                return Array.from({ length: n }).map((_, i) => {
          const k = (i + 0.5) / n;
          const px = a[0] + (b[0] - a[0]) * k, pz = a[2] + (b[2] - a[2]) * k;
          if (Math.hypot(px, pz) < 4.4 || Math.hypot(px - b[0], pz - b[2]) < 2.3) return null;
          if (j !== 0 && Math.hypot(px - D0[0], pz - D0[2]) < 6.3) return null;
          if (Math.hypot(px - I2[0], pz - I2[2]) < 3.6) return null;
          const round = j === 3 && t > T.service - 0.2 + k * 0.5;
          const on = d.st === "done" || round;
          return (
            <mesh key={`${j}-${i}`} position={[px, 0.03, pz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.42]} />
              <meshBasicMaterial color={round ? OR : on ? GREEN : "#D9D1C6"} transparent opacity={on ? 0.35 + 0.5 * Math.max(0, Math.sin(t * 4 - i * 0.6)) : 0.7} toneMapped={false} />
            </mesh>
          );
        });
      })}

      {/* plaza + Chefbüro → Rathaus */}
      <Island p={HQ} r={4.2} t={t} active />
      <HQBuilding t={t} tex={tex} />
      <Burst3D at={T.ki + 0.1} t={t} p={[0, 3.6, -1.2]} colors={[OR, "#FFFFFF", YEL]} n={18} power={0.9} floor={0.5} />
      <Board p={[0, 4.4, -0.4]} tex={tex.hookSign} w={3.6} h={0.9} t={t} q={q} at={T.ki - 0.1} until={T.tag - 0.3} />
      {/* Tag 1 + Tag 2 lots */}
      <Island p={D0} r={6.2} t={t} done />
      <SkBot p={[-3.4, 0.4, -10.0]} yaw={0.5} t={t} seed={2} s={0.8} badge={tex.badge1} body={PAL[2][0]} dark={PAL[2][1]} />
      <Island p={I2} r={3.4} t={t} done />
      <Houses t={t} />
      {DEPTS.map((d, i) => <DeptHouse key={d.n} d={d} i={i} t={t} plate={tex[`plate${i}`]} />)}
      {/* Agent 2 = the sales skill, waits in front of Vertrieb */}
      <SkBot p={[VERT_FRONT[0] + 0.9, 0, VERT_FRONT[2] - 0.2]} yaw={DEPTS[1].yaw - 0.3} t={t} seed={4} s={0.8} badge={tex.badge2} body={PAL[0][0]} dark={PAL[0][1]} />
      {/* Support unlocks: burst + sign */}
      <Burst3D at={T.service + 0.1} t={t} p={[-7.5, 3.2, -20.2]} colors={[OR, "#FFFFFF", GOLD]} n={24} power={1.0} floor={0.4} />
      <Board p={[-7.0, 4.9, -19.6]} tex={tex.spSign} w={3.2} h={0.8} t={t} q={q} at={T.service + 0.05} until={T.kennst + 0.3} />
      {/* customers of Support */}
      {VISITORS.map((_, i) => { const v = visitorAt(i, t); return <SkBot key={i} p={v.p} yaw={v.yaw} t={t} seed={VISITORS[i].seed} walk={v.walk} s={0.5} vis={v.vis} body="#CFC6BA" dark="#A39C90" />; })}
      {/* the Claude board in front of Support */}
      <Board p={SP} tex={dyn.claude} w={3.3} h={3.0} t={t} q={q} at={T.kopier - 0.05} until={T.raus - 0.1} />
      <Burst3D at={T.aber3 + 0.1} t={t} p={[SP[0], SP[1] - 0.6, SP[2] + 0.4]} colors={[OR, "#FFFFFF", GOLD]} n={16} power={0.8} floor={0.4} />
      <Burst3D at={T.wir + 0.15} t={t} p={[-7.5, 3.6, -19.8]} colors={[GOLD, "#FFFFFF", GREEN]} n={22} power={1.0} floor={0.4} />

      {/* residents: 33 already live here, mrb2beast is new */}
      {RES.map((r, i) => {
        const nw = i >= OLD, j = i - OLD;
        const at = -1 + j * 0;
        const k = nw ? back((t - at + 0.3) / 0.35) : 1;
        if (nw && t < at - 0.35) return null;
        const drop = nw ? Math.max(0, 1 - (t - at) / 0.45) : 0;
        const hop = t > T.vierund + 0.1 + i * 0.03 && t < T.vierund + 0.7 + i * 0.03 ? Math.sin(((t - T.vierund - 0.1 - i * 0.03) / 0.6) * Math.PI) * 0.4 : 0;
        const work = 0;
        const yaw = (rnd(i) - 0.5) * 0.5;
        return (
          <group key={i}>
            <group position={r} scale={[k, k, k]}>
              <ToyBox p={[0, 0.05, 0]} s={[1.5, 0.1, 1.5]} color={nw ? "#FFE9D9" : "#FFF3C4"} />
              {[[-0.7, 0], [0.7, 0], [0, -0.7], [0, 0.7]].map(([x, z], jj) => <ToyBox key={jj} p={[x, 0.13, z]} s={[x ? 0.08 : 1.48, 0.06, z ? 0.08 : 1.48]} color={PAL[i % 6][1]} />)}
            </group>
            {t > at - 0.05 && <SkBot p={[r[0], 0.1 + drop * drop * 6, r[2]]} yaw={yaw} t={t} seed={10 + i} body={PAL[i % 6][0]} dark={PAL[i % 6][1]} s={0.55} armL={drop > 0 ? 150 : 20 + (hop ? 140 : 0) + work * 60 * (0.5 + 0.5 * Math.sin(t * 6 + i))} armR={drop > 0 ? 150 : 20 + (hop ? 140 : 0)} lift={hop} />}
            <Board p={[r[0], 1.7 + (i % 2) * 0.32, r[2]]} tex={tex[`res${i}`]} w={1.55} h={0.53} t={t} q={q} at={nw ? at + 0.3 : -1} />
          </group>
        );
      })}
      {RES.map((r, j) => <Burst3D key={j} at={T.vierund + 0.1 + j * 0.02} t={t} p={[r[0], 0.6, r[2]]} colors={[YEL, "#FFFFFF", OR]} n={8} power={0.45} floor={0.15} />)}
      <Board p={[6.4, 3.0, -3.0]} tex={tex.welcome} w={4.0} h={1.16} t={t} q={q} at={T.du + 0.2} until={END + 0.2} />


      {/* CTA: the complete Beschwerde-System → comment "Beschwerde" → DM, and your bot moves in */}
      <Board p={[6.4, 4.3, -1.8]} tex={dyn.offer} w={3.6} h={1.76} t={t} q={q} at={T.willst + 0.6} until={T.kommentier - 0.05} />
      <Board p={[6.4, 4.0, -1.8]} tex={dyn.comment} w={3.6} h={1.16} t={t} q={q} at={T.kommentier - 0.05} until={T.schick + 0.05} />
      <Board p={[6.4, 4.3, -1.8]} tex={dyn.dm} w={3.6} h={1.76} t={t} q={q} at={T.schick} until={T.du} />
      <Burst3D at={T.schick + 0.1} t={t} p={[6.4, 4.2, -1.4]} colors={[OR, "#FFFFFF", GOLD]} n={18} power={0.9} floor={0.5} />
      {t > T.bot - 0.1 && (() => {
        const drop = Math.max(0, 1 - (t - T.bot) / 0.45);
        const k = back((t - T.bot + 0.2) / 0.35);
        return (
          <group>
            <group position={DU_P} scale={[k, k, k]}>
              <ToyBox p={[0, 0.05, 0]} s={[1.5, 0.1, 1.5]} color={OR_L} />
              {[[-0.7, 0], [0.7, 0], [0, -0.7], [0, 0.7]].map(([x, z], j) => <ToyBox key={j} p={[x, 0.13, z]} s={[x ? 0.08 : 1.48, 0.06, z ? 0.08 : 1.48]} color={OR} />)}
            </group>
            <SkBot p={[DU_P[0], 0.1 + drop * drop * 6, DU_P[2]]} yaw={0} t={t} seed={30} body={YEL} dark="#D9A520" s={0.6} armL={150} armR={drop > 0 ? 150 : 30} />
          </group>
        );
      })()}
      <Board p={[DU_P[0], 1.55, DU_P[2]]} tex={tex.duTag} w={1.55} h={0.53} t={t} q={q} at={T.bot + 0.35} />
      <Burst3D at={T.bot + 0.45} t={t} p={[DU_P[0], 0.6, DU_P[2]]} colors={[OR, "#FFFFFF", YEL]} n={14} power={0.6} floor={0.15} />
      <Board p={[6.0, 4.7, -3.6]} tex={tex.tomorrow} w={5.6} h={1.87} t={t} q={q} at={END + 0.15} />

      <SkBot p={my.p} yaw={my.yaw} t={t} seed={1} walk={my.walk} armL={Math.round(armL)} armR={Math.round(armR)} lift={lift} prop={prop} talk={(t > T.fuer && t < T.mehr + 0.4)} vis={mayorVis} s={1.0} mayor />
    </>
  );
};

// ---------- textures ----------
const useStaticTex = (ready: boolean) =>
  React.useMemo(() => {
    if (!ready) return null;
    const t: Tex = {};
    t.floor = canvasTex(1024, 1024, (c) => {
      c.fillStyle = "#EFE9E1"; c.fillRect(0, 0, 1024, 1024);
      c.strokeStyle = "rgba(160,140,120,.16)"; c.lineWidth = 3;
      for (let i = 0; i <= 16; i++) { c.beginPath(); c.moveTo(i * 64, 0); c.lineTo(i * 64, 1024); c.stroke(); c.beginPath(); c.moveTo(0, i * 64); c.lineTo(1024, i * 64); c.stroke(); }
      for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(150,120,90,${0.03 + rnd(i) * 0.04})`; c.fillRect(rnd(i + 3) * 1024, rnd(i + 7) * 1024, 4, 4); }
    });
    t.floor.wrapS = t.floor.wrapT = THREE.RepeatWrapping;
    t.floor.repeat.set(10, 10);
    const plate = (s: string, bg = INK, fg = "#FFFFFF") => canvasTex(620, 112, (c) => { c.fillStyle = bg; c.fillRect(0, 0, 620, 112); c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle"; fit(c, s, F_B, 60, 580); c.fillText(s, 310, 60); });
    t.hqSign = plate("CHEFBÜRO");
    t.rathausSign = plate("GESCHÄFTSFÜHRUNG", GOLD, INK);
    DEPTS.forEach((d, i) => {
      t[`plate${i}`] = plate(d.n);
      t[`dept${i}`] = deptTex(d.n, d.st, d.day);
    });
    t.deptHQ = deptTex("CHEFBÜRO", "today");
    t.hookSign = signTex("KI ÜBERNIMMT ALLES", OR, "#FFFFFF", OR_D, 900, 220);
    t.bmSign = signTex("🎩 BÜRGERMEISTER: KI", INK, "#FFFFFF", GOLD, 900, 220);
    t.question = signTex("WAS IST HEUTE DAS WICHTIGSTE?", "#FFFFFF", INK, GOLD, 1300, 230);
    t.chk = canvasTex(256, 256, (c) => { c.fillStyle = GOLD; c.beginPath(); c.arc(128, 128, 110, 0, 7); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = 12; c.stroke(); c.fillStyle = "#FFFFFF"; c.font = `130px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("✓", 128, 138); });
    t.chkStar = canvasTex(256, 256, (c) => { c.fillStyle = OR; c.beginPath(); c.arc(128, 128, 110, 0, 7); c.fill(); c.strokeStyle = "#FFFFFF"; c.lineWidth = 12; c.stroke(); c.fillStyle = "#FFFFFF"; c.font = `140px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("!", 128, 136); });
    t.sticky = canvasTex(520, 400, (c) => {
      c.fillStyle = "#FFE27A"; c.fillRect(0, 0, 520, 400);
      c.fillStyle = "rgba(0,0,0,.08)"; c.fillRect(0, 360, 520, 40);
      c.fillStyle = "#D9A520"; c.fillRect(200, 0, 120, 26);
      c.fillStyle = INK; c.textAlign = "center"; c.textBaseline = "middle";
      c.font = `40px ${F_B}`; c.fillText("TUN · TAG 8", 260, 92);
      c.font = `58px ${F_B}`; c.fillText("Beste Kunden", 260, 196); c.fillText("anrufen", 260, 268);
      c.font = `30px ${F_S}`; c.fillStyle = "#6B5420"; c.fillText("– der Geschäftsführer", 260, 336);
    });
    RESIDENTS.forEach((n, i) => { t[`res${i}`] = tagTex("@" + n, i < OLD ? "Im Team ✓" : "NEU · Tag 9", i < OLD ? "#D9A520" : OR); });
    t.duTag = tagTex("DU", "ab morgen", OR);
    t.spSign = signTex("🔓 SUPPORT · HEUTE", OR, "#FFFFFF", OR_D, 1100, 270);
    t.hires = signTex("✓ GESTERN: ARBEITSVERTRÄGE", INK, "#FFFFFF", GOLD, 1200, 300);
    t.welcome = canvasTex(1000, 290, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 274, 40); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 990, 278, 40); c.fill();
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = YEL; c.font = `44px ${F_B}`; c.fillText("KOMMENTIER = DU ZIEHST EIN", 495, 78);
      c.fillStyle = "#FFFFFF"; fit(c, "Schon 34 von euch wohnen hier", F_B, 66, 900); c.fillText("Schon 34 von euch wohnen hier", 495, 176);
    });
    t.jobs = canvasTex(1000, 290, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 984, 274, 40); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 990, 278, 40); c.fill();
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = OR; c.font = `44px ${F_B}`; c.fillText("KOMMENTIER DEINEN JOB", 495, 78);
      c.fillStyle = "#FFFFFF"; c.font = `${fit(c, "Vertrieb · Marketing · Support · Personal", F_B, 60, 920)}px ${F_B}`; c.fillText("Vertrieb · Marketing · Support · Personal", 495, 176);
    });
    t.morgenEin = signTex("MORGEN: EINTEILUNG", INK, "#FFFFFF", GOLD, 760, 180);
    t.doneSite = canvasTex(1200, 750, (c) => {
      c.fillStyle = "#FFFFFF"; c.fillRect(0, 0, 1200, 750);
      c.fillStyle = INK; c.font = `34px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Wärmepumpe Umland", 50, 56);
      c.fillStyle = INK; c.font = `84px ${F_B}`; c.fillText("Wärmepumpe in 3 Tagen.", 50, 250); c.fillText("Zum Festpreis.", 50, 350);
      c.fillStyle = OR; roundRect(c, 50, 420, 380, 92, 46); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `34px ${F_B}`; c.fillText("Angebot anfragen", 92, 468);
    });
    t.tomorrow = canvasTex(1200, 400, (c) => {
      c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 1184, 384, 44); c.fill();
      c.fillStyle = INK; roundRect(c, 0, 0, 1190, 388, 44); c.fill();
      c.textBaseline = "middle"; c.textAlign = "center";
      c.fillStyle = OR; c.font = `46px ${F_B}`; c.fillText("MORGEN · TAG 10", 595, 74);
      c.fillStyle = "#FFFFFF"; c.font = `${fit(c, "Die nächste Abteilung", F_B, 82, 1100)}px ${F_B}`; c.fillText("Die nächste Abteilung", 595, 170);
      c.fillStyle = YEL; c.font = `${fit(c, "Kommentier „Beschwerde“, dann ziehst du ein", F_B, 52, 1100)}px ${F_B}`; c.fillText("Kommentier „Beschwerde“, dann ziehst du ein", 595, 290);
    });
    DEPTS.forEach((d, i) => { t[`skill${i}`] = skillTex(d.n, d.st === "done"); });
    t.regie = signTex("👔 DER GESCHÄFTSFÜHRER FÜHRT", INK, "#FFFFFF", GOLD, 1400, 248);
    t.who = signTex("❓ WER SAGT, WAS ZÄHLT?", INK, "#FFFFFF", GOLD, 900, 220);
    t.gift = signTex("🎁 AM ENDE FÜR DICH", GOLD, INK, OR_D, 900, 220);
    t.noSelf = signTex("✕ ARBEITET NICHT SELBST", "#D64545", "#FFFFFF", INK, 900, 220);
    t.chaos = signTex("🔁 HEUTE: WIR FASSEN NACH", OR, "#FFFFFF", INK, 1200, 240);
    t.cut = signTex("✋ STOPP! BRINGT NICHTS", "#D64545", "#FFFFFF", INK, 760, 190);
    const badge = (n: string) => canvasTex(128, 128, (c) => { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.fillStyle = OR; c.font = `84px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(n, 64, 70); });
    t.badge1 = badge("1"); t.badge2 = badge("2");
    return t;
  }, [ready]);

const COMMENT = "Beschwerde";
const cardFrame = (c: CanvasRenderingContext2D, h: number, head: string, sub: string, bg: string, icon = false) => {
  const w = 900;
  c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, w - 16, h - 16, 36); c.fill();
  c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, w - 8, h - 8, 36); c.fill();
  c.fillStyle = bg; roundRect(c, 0, 0, w - 8, 128, 36); c.fill(); c.fillRect(0, 90, w - 8, 38);
  c.fillStyle = "#FFFFFF"; c.textBaseline = "middle"; c.textAlign = "left";
  c.font = `${fit(c, head, F_B, 52, icon ? 700 : 800)}px ${F_B}`; c.fillText(head, 40, 52);
  c.font = `28px ${F_S}`; c.fillStyle = "rgba(255,255,255,.85)"; c.fillText(sub, 40, 100);
  if (icon) { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(820, 62, 40, 0, 7); c.fill(); mayorIcon(c, 820, 68, 56); }
};
const row = (c: CanvasRenderingContext2D, t: number, i: number, y: number, lab: string, val: string, a: number, mark = String(i + 1), on = OR, bgOn?: string) => {
  const w = 900, k = ease((t - a + 0.05) / 0.3);
  c.fillStyle = bgOn && k > 0.5 ? bgOn : "#F6F2EC"; roundRect(c, 32, y, w - 72, 156, 26); c.fill();
  if (bgOn && k > 0.5) { c.strokeStyle = on; c.lineWidth = 5; roundRect(c, 32, y, w - 72, 156, 26); c.stroke(); }
  c.fillStyle = k > 0.5 ? on : "#D6D0C7"; c.beginPath(); c.arc(86, y + 78, 30, 0, 7); c.fill();
  c.fillStyle = "#FFFFFF"; c.font = `32px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(mark, 86, y + 80); c.textAlign = "left";
  c.fillStyle = k > 0.5 ? OR_D : MUTED; c.font = `28px ${F_B}`; c.fillText(lab, 140, y + 42);
  c.save(); c.globalAlpha = 0.35 + 0.65 * k; c.translate((1 - k) * 20, 0);
  c.fillStyle = INK; c.font = `${fit(c, val, F_B, 44, w - 200)}px ${F_B}`; c.fillText(val, 140, y + 106);
  c.restore();
  return k;
};
const typeWrap = (c: CanvasRenderingContext2D, text: string, n: number, x: number, y: number, maxW: number, lh: number, col: string, hot?: string[]) => {
  let cx = x, cy = y, used = 0;
  const hotSet = new Set((hot || []).flatMap((h) => h.split(" ")));
  for (const wd of text.split(" ")) {
    if (cx + c.measureText(wd).width > x + maxW) { cx = x; cy += lh; }
    const left = n - used; if (left <= 0) break;
    c.fillStyle = hotSet.has(wd.replace(/[.,„“]/g, "")) ? OR : col; c.fillText(wd.slice(0, left), cx, cy);
    used += wd.length + 1; cx += c.measureText(wd + " ").width;
  }
  return { cx, cy };
};

const fitTxt = (c: CanvasRenderingContext2D, s: string, size: number, maxW: number) => { c.font = `${size}px ${F_S}`; while (c.measureText(s).width > maxW && size > 18) { size -= 2; c.font = `${size}px ${F_S}`; } return s; };

// Claude: the customer's mail pasted in, the prompt typed
const PROMPT = "Antworte kurz. Gib ihm recht, sag, was bis wann passiert, biete eine kleine Wiedergutmachung an, und benutz nie das Wort aber.";
const drawClaude = (c: CanvasRenderingContext2D, t: number) => {
  cardFrame(c, 820, "CLAUDE · BESCHWERDE", "Kundenmail rein, Antwort raus", OR);
  // the pasted customer mail
  const kM = back((t - T.mail + 0.05) / 0.3);
  if (kM > 0.01) {
    c.save(); c.translate(250, 250); c.scale(kM, kM); c.rotate(-0.02); c.translate(-250, -250);
    c.fillStyle = "rgba(0,0,0,.1)"; roundRect(c, 44, 166, 560, 190, 18); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 40, 158, 560, 190, 18); c.fill();
    c.strokeStyle = "#D1D1D1"; c.lineWidth = 3; roundRect(c, 40, 158, 560, 190, 18); c.stroke();
    c.fillStyle = "#0F6CBD"; roundRect(c, 40, 158, 560, 48, 18); c.fill(); c.fillRect(40, 190, 560, 16);
    c.fillStyle = "#FFFFFF"; c.font = `24px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("✉ Kunde · Beispiel", 62, 183);
    c.fillStyle = "#D64545"; c.font = `22px ${F_B}`; c.fillText("😡 verärgert", 450, 183);
    c.fillStyle = INK; c.font = `34px ${F_B}`; c.fillText("Die Lieferung ist schon", 62, 252); c.fillText("wieder zu spät.", 62, 300);
    c.restore();
  }
  const kC = back((t - T.claude + 0.05) / 0.3);
  if (kC > 0.01) {
    c.save(); c.translate(730, 250); c.scale(kC, kC);
    c.fillStyle = INK; roundRect(c, -130, -36, 260, 72, 36); c.fill();
    c.fillStyle = OR; c.font = `30px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("✳ Claude", -20, 2);
    c.fillStyle = "#FFFFFF"; c.fillText("↑", 90, 2);
    c.restore(); c.textAlign = "left";
  }
  // the console with the prompt
  c.fillStyle = INK; roundRect(c, 32, 384, 828, 400, 28); c.fill();
  c.fillStyle = OR; c.font = `30px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("claude ›", 64, 426);
  c.font = `40px ${F_B}`;
  const n = Math.floor(cl((t - T.antworte + 0.05) / Math.max(0.6, T.aber3 + 0.25 - T.antworte)) * PROMPT.length);
  const end = typeWrap(c, PROMPT, n, 64, 486, 770, 56, "#FFFFFF", ["recht,", "wann", "Wiedergutmachung", "nie", "aber."]);
  if (n < PROMPT.length && Math.floor(t * 3) % 2 === 0 && t > T.schreib - 0.2) { c.fillStyle = OR; c.fillRect(end.cx, end.cy - 22, 6, 44); }
};

const useDynTex = (t: number) => {
  const claude = useDyn(900, 820, (c) => drawClaude(c, t));

  const offer = useDyn(900, 440, (c) => {
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 424, 36); c.fill();
    c.fillStyle = INK; roundRect(c, 0, 0, 892, 428, 36); c.fill();
    c.fillStyle = OR; roundRect(c, 44, 44, 150, 186, 22); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `40px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SYS", 119, 120); c.font = `30px ${F_B}`; c.fillText(".pdf", 119, 170);
    c.textAlign = "left"; c.fillStyle = GOLD; c.font = `30px ${F_B}`; c.fillText("FÜR DEIN UNTERNEHMEN", 228, 70);
    c.fillStyle = "#FFFFFF"; c.font = `${fit(c, "Beschwerde-System", F_B, 62, 620)}px ${F_B}`; c.fillText("Beschwerde-System", 228, 140);
    c.fillStyle = "rgba(255,255,255,.75)"; c.font = `32px ${F_S}`; c.fillText(fitTxt(c, "Prompts, Vorlagen, Regeln für Claude", 32, 620), 228, 200);
    const rows = ["Antwort", "Frist", "Gutschrift", "Check"];
    rows.forEach((r, i) => {
      const kk = ease((t - T.system - 0.05 - i * 0.08) / 0.25);
      if (kk <= 0) return;
      c.save(); c.globalAlpha = kk;
      const x = 44 + i * 206;
      c.fillStyle = "rgba(255,255,255,.1)"; roundRect(c, x, 280, 190, 104, 22); c.fill();
      c.fillStyle = GREEN; c.font = `30px ${F_B}`; c.fillText("✓", x + 18, 334);
      c.fillStyle = "#FFFFFF"; c.font = `${fit(c, r, F_B, 30, 130)}px ${F_B}`; c.fillText(r, x + 50, 334);
      c.restore();
    });
  });
  const comment = useDyn(900, 290, (c) => {
    const n = Math.max(0, Math.floor((t - T.kommentier + 0.05) * 14));
    const done = t >= T.schick - 0.1;
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 274, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 278, 36); c.fill();
    c.fillStyle = INK; c.font = `38px ${F_B}`; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText("Schreib in die Kommentare:", 40, 54);
    c.strokeStyle = done ? GREEN : OR; c.lineWidth = 7; roundRect(c, 30, 100, 832, 148, 74); c.stroke();
    c.fillStyle = OR_L; c.beginPath(); c.arc(110, 174, 46, 0, 7); c.fill();
    c.fillStyle = OR; c.font = `32px ${F_B}`; c.textAlign = "center"; c.fillText("DU", 110, 176);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `${fit(c, COMMENT, F_B, 60, 520)}px ${F_B}`; c.fillText(COMMENT.slice(0, n) + (done || Math.floor(t * 3) % 2 ? "" : "|"), 184, 178);
    c.fillStyle = done ? GREEN : OR; c.beginPath(); c.arc(784, 174, 50, 0, 7); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = 8; c.beginPath(); c.moveTo(784, 196); c.lineTo(784, 152); c.moveTo(766, 170); c.lineTo(784, 152); c.lineTo(802, 170); c.stroke();
    if (done) { c.fillStyle = GREEN; roundRect(c, 640, 20, 222, 58, 29); c.fill(); c.fillStyle = "#FFFFFF"; c.font = `28px ${F_B}`; c.fillText("✓ gesendet", 668, 50); }
  });
  const dm = useDyn(900, 440, (c) => {
    const file = ease((t - T.schick - 0.05) / 0.3);
    c.fillStyle = "rgba(0,0,0,.14)"; roundRect(c, 8, 14, 884, 424, 36); c.fill();
    c.fillStyle = "#FFFFFF"; roundRect(c, 0, 0, 892, 428, 36); c.fill();
    c.fillStyle = OR; c.beginPath(); c.arc(70, 64, 32, 0, 7); c.fill();
    c.fillStyle = "#FFFFFF"; c.font = `30px ${F_B}`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("F", 70, 66);
    c.textAlign = "left"; c.fillStyle = INK; c.font = `36px ${F_B}`; c.fillText("florent_preusser", 120, 52);
    c.fillStyle = MUTED; c.font = `26px ${F_M}`; c.fillText("Direktnachricht · jetzt", 120, 88);
    c.fillStyle = "#F1EEEA"; roundRect(c, 40, 124, 700, 84, 42); c.fill();
    c.fillStyle = INK; c.font = `36px ${F_S}`; c.fillText("Hier ist dein Beschwerde-System:", 76, 168);
    if (file > 0) {
      c.save(); c.globalAlpha = file; c.translate(0, (1 - file) * 24);
      c.fillStyle = OR_L; roundRect(c, 40, 232, 812, 164, 32); c.fill();
      c.strokeStyle = OR; c.lineWidth = 5; roundRect(c, 40, 232, 812, 164, 32); c.stroke();
      c.fillStyle = OR; roundRect(c, 70, 258, 92, 112, 14); c.fill();
      c.fillStyle = "#FFFFFF"; c.font = `26px ${F_B}`; c.textAlign = "center"; c.fillText("SYS", 116, 304); c.font = `20px ${F_B}`; c.fillText(".pdf", 116, 336);
      c.textAlign = "left"; c.fillStyle = INK; c.font = `${fit(c, "Beschwerde-System mit Claude", F_B, 42, 620)}px ${F_B}`; c.fillText("Beschwerde-System mit Claude", 190, 292);
      c.fillStyle = OR_D; c.font = `30px ${F_S}`; c.fillText("Prompts + Vorlagen + Regeln", 190, 346);
      c.restore();
    }
  });
  return { claude, offer, comment, dm };
};

// ---------- 2D: captions + the series frame (scoreboard) ----------
const SK_THEME: PixelTheme = { bg: "#F3EEE7", bgPattern: "none" as PixelTheme["bgPattern"], floor: "#FFFFFF", floorLine: OR, accent: OR, dark: INK, gold: "#FFFFFF", green: OR, cream: "#FFFFFF", ink: INK };
const Pill: React.FC<{ k: number; bg?: string; color?: string; children: React.ReactNode; big?: boolean; shake?: number }> = ({ k, bg = "rgba(255,255,255,.95)", color = INK, children, big, shake = 0 }) => (
  <div style={{ opacity: k, transform: `translateY(${(1 - k) * -16}px) scale(${0.85 + 0.15 * k}) translateX(${Math.sin(shake * 40) * 8 * shake}px)`, background: bg, color, borderRadius: 999, padding: big ? "14px 30px" : "10px 20px", boxShadow: "0 8px 24px rgba(40,24,10,.16)", fontFamily: F_B, fontSize: big ? 38 : 28, whiteSpace: "nowrap" }}>{children}</div>
);
const Scoreboard: React.FC<{ t: number }> = ({ t }) => {
  // hook for new viewers: the one word, circled in the reply below
  if (t < T.ich) {
    const kT = ease((t - 0.02) / 0.25), kS = ease((t - T.wuetender + 0.1) / 0.3);
    return (
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Pill k={kT} big bg={INK} color="#FFFFFF">Dieses <span style={{ color: GOLD }}>eine Wort</span></Pill>
        {kS > 0 && <Pill k={kS} big bg="#D64545" color="#FFFFFF" shake={bump(t, T.aber0 + 0.1, 0.3)}>😡 macht jeden Kunden wütender</Pill>}
      </div>
    );
  }
  // the series frame in one sentence
  if (t < T.tag) {
    const kT = ease((t - T.ich) / 0.3);
    return (
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Pill k={kT} big bg={INK} color="#FFFFFF">KI ÜBERNIMMT MEINE FIRMA <span style={{ color: OR }}>· 100 TAGE</span></Pill>
      </div>
    );
  }
  const kTag = ease((t - T.tag) / 0.35);
  const big = t < T.kennst - 0.1;
  const houses = t > T.service ? 6 : 5;
  const hPop = bump(t, T.service + 0.12, 0.3);
  const HousePill = ({ k, big: b }: { k: number; big?: boolean }) => (
    <Pill k={k} big={b} bg={houses > 2 ? OR : "rgba(255,255,255,.95)"} color={houses > 2 ? "#FFFFFF" : INK}>
      <span style={{ display: "inline-block", transform: `scale(${1 + 0.35 * hPop})` }}>🏠 KI-HÄUSER {houses}<span style={{ opacity: 0.6 }}>/8</span></span>
    </Pill>
  );
  if (big) {
    return (
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        <Pill k={kTag} big bg={INK} color="#FFFFFF">🔥 TAG 9 <span style={{ color: "#A39C90" }}>/ 100</span></Pill>
        <HousePill k={ease((t - T.neun) / 0.35)} big />
      </div>
    );
  }
  const kBar = ease((t - T.kennst + 0.1) / 0.35);
  const QUESTS: [string, number][] = [["Mail rein", T.claude], ["Prompt", T.aber3 + 0.3], ["Antwort", T.wir]];
  const done = QUESTS.filter(([, a]) => t >= a).length;
  const kQuest = ease((t - T.kopier) / 0.4) * (1 - ease((t - T.willst - 0.2) / 0.3));
  const d3 = cl((t - T.tag) / (T.wir + 0.5 - T.tag));
  const end = t > END;
  const kRes = ease((t - T.kennst) / 0.35);
  const res = 34;
  const kAch = ease((t - T.wir - 0.35) / 0.25) * (1 - ease((t - T.willst - 0.5) / 0.2));
  const kLock = ease((t - END) / 0.35);
  return (
    <>
      <div style={{ position: "absolute", top: 112, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, opacity: kBar }}>
        <Pill k={1} bg={INK} color="#FFFFFF">🔥 TAG 9 <span style={{ color: "#A39C90" }}>/ 100</span></Pill>
        <HousePill k={1} />
        {kRes > 0 && <Pill k={kRes} bg={YEL} color={INK} shake={bump(t, T.vierund + 0.1, 0.3)}>👥 EINWOHNER {res}</Pill>}
      </div>
      <div style={{ position: "absolute", top: 172, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kBar }}>
        <div style={{ display: "flex", gap: 2.4, alignItems: "flex-end", background: "rgba(255,255,255,.9)", borderRadius: 999, padding: "8px 16px", boxShadow: "0 6px 18px rgba(40,24,10,.12)" }}>
          {Array.from({ length: 100 }, (_, i) => {
            const fill = i < 8 ? 1 : i === 8 ? d3 : 0;
            const pulse = i === 9 && end ? 0.5 + 0.5 * Math.sin(t * 10) : 0;
            return (
              <div key={i} style={{ width: 5, height: i < 8 ? 18 : 12, borderRadius: 2, background: "#E7E0D6", position: "relative", overflow: "hidden", outline: pulse ? `2px solid rgba(255,107,53,${pulse})` : undefined }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: OR }} />
              </div>
            );
          })}
        </div>
      </div>
      {kQuest > 0 && (
        <div style={{ position: "absolute", top: 222, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kQuest * kBar }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: F_B, fontSize: 22 }}>
            <span style={{ color: OR_D, letterSpacing: ".08em" }}>MISSION {done}/3</span>
            {QUESTS.map(([qn, a]) => {
              const k = t >= a; const pop = bump(t, a + 0.08, 0.2);
              return (
                <span key={qn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: k ? GREEN : "rgba(255,255,255,.9)", color: k ? "#FFFFFF" : MUTED, transform: `scale(${1 + 0.25 * pop})`, boxShadow: "0 4px 12px rgba(40,24,10,.12)" }}>
                  {k ? "✓" : "○"} {qn}
                </span>
              );
            })}
          </div>
        </div>
      )}
      {kAch > 0 && (
        <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kAch }}>
          <div style={{ transform: `translateY(${(1 - kAch) * -40}px) scale(${0.8 + 0.2 * kAch + 0.06 * bump(t, T.wir + 0.7, 0.25)})`, background: INK, color: "#FFFFFF", borderRadius: 28, padding: "18px 34px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 14px 40px rgba(40,24,10,.35)", border: `3px solid ${GOLD}` }}>
            <span style={{ fontSize: 58 }}>🤝</span>
            <div>
              <div style={{ fontFamily: F_B, fontSize: 24, color: GOLD, letterSpacing: ".1em" }}>MISSION TAG 9 GESCHAFFT</div>
              <div style={{ fontFamily: F_B, fontSize: 36 }}>Der Kunde bleibt</div>
            </div>
          </div>
        </div>
      )}
      {kLock > 0 && (
        <div style={{ position: "absolute", top: 228, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: kLock }}>
          <div style={{ transform: `scale(${0.85 + 0.15 * kLock}) rotate(${Math.sin(t * 22) * 4 * Math.max(0, Math.sin(t * 3))}deg)`, background: OR, color: "#FFFFFF", borderRadius: 999, padding: "12px 26px", fontFamily: F_B, fontSize: 30, boxShadow: "0 10px 26px rgba(255,107,53,.35)" }}>
            🔒 TAG 10 schaltet morgen frei
          </div>
        </div>
      )}
    </>
  );
};

// ---------- 2D overlay: Outlook (hook, the complaint thread, Claude's reply); fictional customer, names blurred ----------
const UI_FONT = '"Segoe UI", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif';
const OL = "#0F6CBD";
const RED = "#D64545";
const Blur: React.FC<{ children: React.ReactNode; px?: number }> = ({ children, px = 9 }) => <span style={{ filter: `blur(${px}px)`, display: "inline-block" }}>{children}</span>;
const Sticker: React.FC<{ k: number; bg: string; children: React.ReactNode; style?: React.CSSProperties; rot?: number }> = ({ k, bg, children, style, rot = -4 }) =>
  k > 0.01 ? <div style={{ position: "absolute", transform: `scale(${k}) rotate(${rot}deg)`, background: bg, color: "#FFFFFF", borderRadius: 999, padding: "12px 28px", fontFamily: F_B, fontSize: 34, boxShadow: "0 8px 20px rgba(0,0,0,.25)", whiteSpace: "nowrap", zIndex: 4, ...style }}>{children}</div> : null;
const HOOK_OUT = () => T.ich - 0.3;
// typed text in segments: [text, key]; returns the visible part of every segment
const typeSegs = (segs: [string, string][], n: number) => {
  let used = 0;
  return segs.map(([s, key]) => { const part = s.slice(0, Math.max(0, n - used)); used += s.length; return [part, key] as [string, string]; });
};
const segLen = (segs: [string, string][]) => segs.reduce((a, [s]) => a + s.length, 0);
const Caret: React.FC<{ on: boolean; t: number }> = ({ on, t }) => (on && Math.floor(t * 3) % 2 === 0 ? <span style={{ color: OL }}>|</span> : null);
// the red hand-drawn circle around "aber"
const Circle: React.FC<{ k: number }> = ({ k }) =>
  k > 0.01 ? (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{ position: "absolute", left: -12, top: -10, width: "calc(100% + 24px)", height: "calc(100% + 18px)", overflow: "visible" }}>
      <path d="M 18 52 C 12 18, 70 6, 110 8 C 160 10, 192 30, 188 56 C 184 84, 120 96, 80 92 C 36 88, 8 74, 16 48 C 20 34, 40 22, 62 18" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} vectorEffect="non-scaling-stroke" />
    </svg>
  ) : null;
const OutlookHead: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <div style={{ background: OL, color: "#FFFFFF", height: 76, display: "flex", alignItems: "center", padding: "0 28px", fontSize: 30, fontWeight: 600, gap: 16 }}>
    <span style={{ fontSize: 32 }}>↩</span> {title}<div style={{ flex: 1 }} />{right ?? <span style={{ background: "rgba(255,255,255,.2)", borderRadius: 99, padding: "4px 16px", fontSize: 22 }}>Beispiel</span>}
  </div>
);
const ToRow: React.FC = () => (
  <div style={{ padding: "14px 30px", fontSize: 28, borderBottom: "1px solid #E1E1E1", display: "flex", gap: 18, alignItems: "center" }}>
    <span style={{ color: "#616161" }}>An</span><span style={{ background: "#EBF3FC", borderRadius: 8, padding: "4px 14px" }}><Blur px={8}>einkauf@brandt-handel.de</Blur></span>
  </div>
);

// hook: the reply "Tut uns leid, aber …" with "aber" circled + the customer's anger rising
const HookMail: React.FC<{ t: number }> = ({ t }) => {
  const out = ease((t - HOOK_OUT()) / 0.22);
  if (out >= 1) return null;
  const kIn = back((t + 0.05) / 0.3);
  const kC = ease((t - T.aber0 + 0.35) / 0.45);
  const anger = cl((t - 0.4) / (T.aber0 + 0.3 - 0.4));
  const face = anger < 0.35 ? "🙂" : anger < 0.75 ? "😠" : "😡";
  const shake = anger > 0.75 ? Math.sin(t * 60) * 4 : 0;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 400, transform: `translateY(${(1 - kIn) * 200 - out * 260}px) scale(${(0.92 + 0.08 * Math.min(1, kIn)) * (1 - 0.3 * out)})`, opacity: Math.min(1, kIn) * (1 - out), fontFamily: UI_FONT }}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 80px rgba(40,24,10,.35)", border: "1px solid #D1D1D1" }}>
        <OutlookHead title="AW: Lieferung" />
        <ToRow />
        <div style={{ padding: "30px 34px 40px", color: "#242424" }}>
          <div style={{ fontSize: 30, color: "#616161" }}>Hallo <Blur px={7}>Herr Brandt</Blur>,</div>
          <div style={{ marginTop: 16, fontSize: 52, fontWeight: 700, lineHeight: 1.3 }}>
            Tut uns leid,{" "}
            <span style={{ position: "relative", display: "inline-block", margin: "0 12px", color: kC > 0.5 ? RED : "#242424", transform: `scale(${1 + 0.15 * bump(t, T.aber0 + 0.1, 0.3)})` }}>aber<Circle k={kC} /></span>{" "}
            unser Lieferant hatte Probleme.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderTop: "1px solid #E1E1E1" }}>
          <div style={{ background: OL, color: "#FFFFFF", borderRadius: 8, padding: "10px 30px", fontSize: 28, fontWeight: 600 }}>Senden</div>
        </div>
      </div>
      {/* anger meter */}
      <div style={{ marginTop: 26, background: INK, borderRadius: 999, padding: "16px 28px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 12px 30px rgba(40,24,10,.3)", transform: `translateX(${shake}px)` }}>
        <span style={{ fontSize: 46 }}>{face}</span>
        <span style={{ color: "#FFFFFF", fontFamily: F_B, fontSize: 30, whiteSpace: "nowrap" }}>Kunde</span>
        <div style={{ flex: 1, height: 22, borderRadius: 11, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
          <div style={{ width: `${anger * 100}%`, height: "100%", background: anger > 0.75 ? RED : OR, borderRadius: 11 }} />
        </div>
        <span style={{ color: anger > 0.75 ? "#FF8A8A" : GOLD, fontFamily: F_B, fontSize: 28, whiteSpace: "nowrap" }}>{anger > 0.75 ? "noch wütender" : "wütend"}</span>
      </div>
    </div>
  );
};

// everyday scene: the complaint comes in, the reply with "aber" — and what the customer reads
const COMPLAINT = "Die Lieferung ist schon wieder zu spät.";
const REPLY: [string, string][] = [["Tut uns leid,", "pre"], [" ", ""], ["aber", "aber"], [" unser Lieferant hatte Probleme.", ""]];
const ComplaintThread: React.FC<{ t: number }> = ({ t }) => {
  const kIn = ease((t - T.kennst + 0.1) / 0.3), out = ease((t - T.kopier + 0.1) / 0.25);
  if (kIn <= 0.001 || out >= 1) return null;
  const nC = Math.floor(cl((t - T.schreibt) / Math.max(0.5, T.spaet + 0.25 - T.schreibt)) * COMPLAINT.length);
  const kMad = back((t - T.spaet - 0.1) / 0.3);
  const kR = ease((t - T.und + 0.1) / 0.3);
  const nR = Math.floor(cl((t - T.tut + 0.05) / Math.max(0.6, T.probleme + 0.3 - T.tut)) * segLen(REPLY));
  const hiA = ease((t - T.aber1) / 0.25);
  const strike = ease((t - T.alles) / 0.4);
  const kZ = back((t - T.zaehlt) / 0.3);
  const kNix = back((t - T.nicht) / 0.3);
  const parts = typeSegs(REPLY, nR);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 380, transform: `translateY(${(1 - kIn) * 200 - out * 260}px) scale(${(0.94 + 0.06 * kIn) * (1 - 0.3 * out)})`, opacity: kIn * (1 - out), fontFamily: UI_FONT }}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 80px rgba(40,24,10,.35)", border: "1px solid #D1D1D1" }}>
        <div style={{ background: OL, color: "#FFFFFF", height: 76, display: "flex", alignItems: "center", padding: "0 28px", fontSize: 30, fontWeight: 600, gap: 16 }}>
          <span style={{ fontSize: 32 }}>✉</span> Posteingang<div style={{ flex: 1 }} /><span style={{ background: "rgba(255,255,255,.2)", borderRadius: 99, padding: "4px 16px", fontSize: 22 }}>Beispiel</span>
        </div>
        {/* the customer's mail */}
        <div style={{ padding: "22px 30px 26px", borderBottom: "1px solid #E1E1E1", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 58, height: 58, borderRadius: 29, background: "#8A6FB5", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700 }}><Blur px={5}>MB</Blur></div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#242424" }}><Blur px={7}>Markus Brandt</Blur> · Brandt Handel</div>
              <div style={{ fontSize: 24, color: "#616161" }}>Betreff: Lieferung · heute 08:14</div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 44, fontWeight: 700, color: "#242424", minHeight: 58 }}>{COMPLAINT.slice(0, nC)}<Caret on={nC > 0 && nC < COMPLAINT.length} t={t} /></div>
          <Sticker k={kMad} bg={RED} rot={5} style={{ right: 24, top: 18 }}>😡 schon wieder</Sticker>
        </div>
        {/* your reply */}
        <div style={{ padding: "22px 30px 28px", opacity: kR, position: "relative", background: "#FAFAFA" }}>
          <div style={{ fontSize: 24, color: "#616161" }}>↩ Deine Antwort</div>
          <div style={{ marginTop: 12, fontSize: 46, fontWeight: 700, lineHeight: 1.3, color: "#242424", minHeight: 120 }}>
            {parts.map(([s, key], i) =>
              key === "pre" ? (
                <span key={i} style={{ position: "relative", display: "inline-block", opacity: 1 - 0.6 * strike }}>
                  {s}
                  {strike > 0 && <span style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${strike * 100}%`, background: RED, borderRadius: 4 }} />}
                  {kZ > 0.01 && <span style={{ position: "absolute", left: 0, top: -44, transform: `scale(${kZ}) rotate(-4deg)`, transformOrigin: "left bottom", color: RED, fontFamily: F_B, fontSize: 30, whiteSpace: "nowrap" }}>zählt nicht mehr</span>}
                </span>
              ) : key === "aber" ? (
                <span key={i} style={{ background: hiA > 0 ? `rgba(245,197,66,${0.85 * hiA})` : undefined, color: hiA > 0.5 ? RED : undefined, borderRadius: 8, padding: "0 4px", transform: `scale(${1 + 0.15 * bump(t, T.aber1 + 0.1, 0.25) + 0.15 * bump(t, T.aber2 + 0.1, 0.25)})`, display: "inline-block" }}>{s}</span>
              ) : (
                <span key={i}>{s}</span>
              ),
            )}
            <Caret on={nR > 0 && nR < segLen(REPLY)} t={t} />
          </div>
        </div>
      </div>
      <Sticker k={kNix} bg={INK} rot={-4} style={{ right: 24, bottom: -50 }}>Er liest: <span style={{ color: "#FF8A8A" }}>Nicht unser Fehler.</span></Sticker>
    </div>
  );
};

// Claude's reply: agrees, says what happens by when, makes it up, no "aber"
const GOOD: [string, string][] = [["Sie haben recht, das war zu spät.", "recht"], [" Ihre Lieferung kommt ", ""], ["morgen bis 12 Uhr", "wann"], [", ", ""], ["die Versandkosten übernehmen wir.", "gut"]];
const GOOD_AT: Record<string, () => number> = { recht: () => T.recht2, wann: () => T.zwoelf, gut: () => T.versand };
const ClaudeReply: React.FC<{ t: number }> = ({ t }) => {
  const kIn = ease((t - T.raus + 0.15) / 0.3), out = ease((t - T.willst - 0.3) / 0.25);
  if (kIn <= 0.001 || out >= 1) return null;
  const nG = Math.floor(cl((t - T.sie + 0.05) / Math.max(0.6, T.wir + 0.25 - T.sie)) * segLen(GOOD));
  const parts = typeSegs(GOOD, nG);
  const sent = t > T.wir + 0.3;
  const kOk = back((t - T.wir - 0.35) / 0.3);
  const CHECKS: [string, number][] = [["Recht gegeben", T.recht2], ["Bis wann", T.zwoelf], ["Wiedergutmachung", T.versand], ["Kein „aber“", T.wir]];
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 400, transform: `translateY(${(1 - kIn) * 220 - out * 260}px) scale(${(0.94 + 0.06 * kIn) * (1 - 0.3 * out)})`, opacity: kIn * (1 - out), fontFamily: UI_FONT }}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 80px rgba(40,24,10,.35)", border: "1px solid #D1D1D1" }}>
        <OutlookHead title="AW: Lieferung" right={<span style={{ background: OR, borderRadius: 99, padding: "6px 18px", fontSize: 24, fontFamily: F_B }}>✳ von Claude geschrieben</span>} />
        <ToRow />
        <div style={{ padding: "26px 34px 30px", color: "#242424" }}>
          <div style={{ fontSize: 30, color: "#616161" }}>Hallo <Blur px={7}>Herr Brandt</Blur>,</div>
          <div style={{ marginTop: 14, fontSize: 46, fontWeight: 700, lineHeight: 1.32, minHeight: 300 }}>
            {parts.map(([s, key], i) => {
              const k = key ? ease((t - GOOD_AT[key]() - 0.05) / 0.3) : 0;
              return <span key={i} style={{ background: k > 0 ? `linear-gradient(transparent 62%, rgba(31,157,85,${0.35 * k}) 62%)` : undefined }}>{s}</span>;
            })}
            <Caret on={nG > 0 && nG < segLen(GOOD)} t={t} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderTop: "1px solid #E1E1E1" }}>
          <div style={{ background: sent ? GREEN : OL, color: "#FFFFFF", borderRadius: 8, padding: "12px 34px", fontSize: 30, fontWeight: 600, transform: `scale(${1 + 0.12 * bump(t, T.wir + 0.3, 0.15)})` }}>{sent ? "✓ Gesendet" : "Senden"}</div>
          <div style={{ flex: 1 }} />
          <span style={{ color: "#616161", fontSize: 24 }}>Beispiel</span>
        </div>
      </div>
      <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {CHECKS.map(([lab, a]) => {
          const k = t > a; const pop = bump(t, a + 0.08, 0.2);
          return <div key={lab} style={{ background: k ? GREEN : "rgba(255,255,255,.95)", color: k ? "#FFFFFF" : MUTED, borderRadius: 999, padding: "12px 26px", fontFamily: F_B, fontSize: 32, transform: `scale(${1 + 0.25 * pop})`, boxShadow: "0 8px 20px rgba(40,24,10,.16)" }}>{k ? "✓" : "○"} {lab}</div>;
        })}
      </div>
      <Sticker k={kOk} bg={GREEN} rot={-5} style={{ right: 30, top: 60 }}>🤝 Kunde bleibt</Sticker>
    </div>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const TRANSITS = HOLDS.slice(0, -1).map((h) => h.b);
const SFX: Sfx[] = [
  ...TRANSITS.map((c): Sfx => ["whoosh-quick", c - 0.02, 0.4]),
  ["ui-pop", 0.03, 0.4], ["typing", 0.3, 0.12], ["bump", T.wuetender, 0.3], ["stamp", T.aber0 + 0.05, 0.45], ["whoosh-quick", HOOK_OUT() - 0.05, 0.4],
  ["ui-pop", T.ich, 0.35], ["powerup", T.ki + 0.05, 0.25], ["ui-pop", T.tag, 0.4], ["powerup", T.service, 0.3], ["chime", T.service + 0.12, 0.3],
  ["ui-pop", T.kennst - 0.1, 0.4], ["typing", T.schreibt, 0.2], ["bump", T.spaet + 0.1, 0.35], ["typing", T.tut, 0.2], ["click", T.aber1, 0.35],
  ["stamp", T.nicht, 0.4], ["whoosh-quick", T.alles + 0.05, 0.3], ["bump", T.zaehlt, 0.3],
  ["ui-pop", T.kopier - 0.05, 0.4], ["ui-pop", T.mail, 0.35], ["chime", T.claude, 0.25], ["typing", T.antworte, 0.22], ["typing", T.wann, 0.18], ["typing", T.nie, 0.18], ["check", T.aber3 + 0.3, 0.3],
  ["ui-pop", T.raus - 0.1, 0.4], ["typing", T.sie, 0.22],
  ["check", T.recht2 + 0.05, 0.3], ["check", T.zwoelf + 0.05, 0.3], ["coin", T.versand + 0.05, 0.3], ["check", T.wir + 0.05, 0.3], ["click", T.wir + 0.3, 0.35], ["chime", T.wir + 0.4, 0.3], ["powerup", T.wir + 0.45, 0.2],
  ["ui-pop", T.willst + 0.6, 0.4], ["chime", T.system + 0.1, 0.25], ["ui-pop", T.kommentier - 0.05, 0.4], ["typing", T.kommentier, 0.22], ["check", T.schick - 0.1, 0.35],
  ["ui-pop", T.schick, 0.4], ["chime", T.schick + 0.15, 0.3], ["jump", T.bot + 0.35, 0.3], ["chime", T.bot + 0.45, 0.25], ["ui-pop", T.du + 0.2, 0.35], ["jump", T.vierund + 0.1, 0.3], ["chime", T.vierund + 0.15, 0.25],
  ["ui-pop", END + 0.15, 0.35], ["bump", END, 0.35],
];

export const Agents100Day9: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const ready = useFontsReady([`40px ${F_B}`, `40px ${F_S}`, `40px ${F_M}`, "800 70px Rubik"]);
  const tex = useStaticTex(ready);
  const dyn = useDynTex(t);
  const a = camAt(t - 0.03).pos, b = camAt(t + 0.03).pos;
  const speed = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 0.06;
  const blur = Math.min(3.5, Math.max(0, (speed - 8) * 0.12));
  const flash = 0.2 * bump(t, T.vierund + 0.05, 0.08) + 0.2 * bump(t, T.service + 0.05, 0.08) + 0.15 * bump(t, T.wir + 0.1, 0.08);
  return (
    <AbsoluteFill style={{ background: "#F3EEE7" }}>
      {tex && (
        <AbsoluteFill style={{ filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World t={t} tex={tex} dyn={dyn} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 58%, rgba(120,80,40,.22) 100%)" }} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <HookMail t={t} />
      <ComplaintThread t={t} />
      <ClaudeReply t={t} />
      <Scoreboard t={t} />
      <PillCaptions words={WD} theme={SK_THEME} />
      <Audio src={staticFile("sk100d9/voice.mp3")} />
      <Audio src={staticFile("sk100d9/music-loser.mp3")} volume={0.25} />
      {SFX.map(([n, s, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
