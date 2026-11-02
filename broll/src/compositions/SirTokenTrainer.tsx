import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { fonts } from "../theme";
import words from "../../public/sirtoken/words.json";

// Sir Token "4 Trainer" reel (S-012, superkraft-themen) in the @claudebyseb keyword-funnel look:
// one themed world (Token Gym), mascot in every shot, a new framing every ~1.2 s, 1-3-word caption
// pills with the active word highlighted, a step counter, and an end card with comment + DM.
// Voice: ElevenLabs "Keno", word timings in public/sirtoken/words.json.

export const SIRTOKEN_FPS = 30;
export const SIRTOKEN_SECONDS = 37.5;

const C = {
  wallTop: "#1E2A3A", wallBottom: "#2E3F55", floor: "#3A2E2A", floorLine: "#4E3E38",
  orange: "#D97757", cream: "#FFF4E2", ink: "#16130F", green: "#2FBF71", red: "#E5484D",
  gold: "#F5B82E", card: "#FFFDF8", dim: "#7A7166",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const f = (s: number) => Math.round(s * SIRTOKEN_FPS);

type W = { w: string; s: number; e: number };
const WORDS = words as W[];
const tOf = (word: string, after = 0) => WORDS.find((w) => w.s >= after && w.w.replace(/[^\wäöüÄÖÜß-]/g, "") === word)!.s;

// beats, all taken from the voice timings
const T = {
  kostenlos: tOf("Kostenlos"), vier: tOf("vier"),
  s1: tOf("Eins"), s2: tOf("Zwei"), s3: tOf("Drei"), trick: tOf("Trick"),
  a1: tOf("Athletiktrainer"), a2: tOf("Physio"), a3: tOf("Krafttrainer"), a4: tOf("Explosivkraft-Coach"),
  s4: tOf("Vier"), s5: tOf("Fünf"), knie: tOf("Knie"), s6: tOf("Sechs"), timer: tOf("Timer"), haken: tOf("Häkchen"),
  s7: tOf("Sieben"), end: tOf("Den"), trainerWord: tOf("TRAINER"),
};
const STEPS = [T.s1, T.s2, T.s3, T.s4, T.s5, T.s6, T.s7];

// ---------- helpers ----------
const pop = (frame: number, at: number, fps: number, damping = 11) =>
  spring({ frame: frame - f(at), fps, config: { damping, stiffness: 170, mass: 0.7 } });

const Box: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", ...style }}>{children}</div>
);

// ---------- world ----------
const Dumbbell: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#2B2B2B" }) => (
  <Box style={{ left: x, top: y, width: 150 * s, height: 50 * s }}>
    <Box style={{ left: 30 * s, top: 20 * s, width: 90 * s, height: 10 * s, background: "#9AA0A6", borderRadius: 4 }} />
    {[0, 120 * s].map((l) => (
      <Box key={l} style={{ left: l, top: 0, width: 30 * s, height: 50 * s, background: color, borderRadius: 8 * s, boxShadow: "inset -6px -6px 0 rgba(0,0,0,.25)" }} />
    ))}
  </Box>
);

const GymWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = frame % 97 < 3 ? 0.55 : 1;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.wallTop} 0%, ${C.wallBottom} 62%)` }}>
      {/* brick rhythm */}
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: "linear-gradient(0deg, rgba(255,255,255,.5) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px)", backgroundSize: "180px 70px" }} />
      {/* neon sign */}
      <Box style={{ left: 0, right: 0, top: 270, textAlign: "center", fontFamily: fonts.caption, fontSize: 130, letterSpacing: 8, color: "#FFE3D6", opacity: flicker, textShadow: `0 0 18px ${C.orange}, 0 0 46px ${C.orange}, 0 0 90px ${C.orange}` }}>
        TOKEN GYM
      </Box>
      {/* rack */}
      <Box style={{ left: 60, right: 60, top: 900, height: 22, background: "#5A5A5A", borderRadius: 6 }} />
      <Box style={{ left: 60, right: 60, top: 1010, height: 22, background: "#5A5A5A", borderRadius: 6 }} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Dumbbell key={i} x={90 + i * 160} y={850} s={0.85} color={i % 2 ? "#C2452D" : "#2B2B2B"} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Dumbbell key={"b" + i} x={90 + i * 160} y={960} s={0.85} color={i % 2 ? "#2B2B2B" : "#3A6EA5"} />)}
      {/* floor */}
      <Box style={{ left: -400, right: -400, top: 1190, bottom: -200, background: C.floor, transform: "perspective(900px) rotateX(58deg)", transformOrigin: "top", backgroundImage: `linear-gradient(90deg, ${C.floorLine} 3px, transparent 3px), linear-gradient(0deg, ${C.floorLine} 3px, transparent 3px)`, backgroundSize: "160px 160px" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- mascot ----------
type Pose = "front" | "threequarter" | "smug" | "shocked" | "disapproving" | "delighted" | "counting" | "whispering" | "tipping";
const SirToken: React.FC<{ pose: Pose; x: number; y: number; h: number; at: number; flip?: boolean }> = ({ pose, x, y, h, at, flip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, at, fps, 9);
  const bob = Math.sin((frame - f(at)) / 5) * 8;
  const squash = 1 + Math.sin((frame - f(at)) / 5) * 0.025;
  return (
    <Box style={{ left: x, top: y + bob, height: h, transform: `translateX(-50%) scale(${p}) scaleY(${squash}) scaleX(${(flip ? -1 : 1) / squash})`, transformOrigin: "bottom center" }}>
      <Box style={{ left: "10%", right: "10%", bottom: -18, height: 36, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(8px)" }} />
      <Img src={staticFile(`sirtoken/${pose}.png`)} style={{ height: h, position: "relative" }} />
    </Box>
  );
};

// ---------- UI cards ----------
const Card: React.FC<{ x: number; y: number; w: number; at: number; children: React.ReactNode; tilt?: number; style?: React.CSSProperties }> = ({ x, y, w, at, children, tilt = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, at, fps, 12);
  return (
    <Box style={{ left: x, top: y, width: w, background: C.card, borderRadius: 34, padding: 34, boxShadow: "0 24px 60px rgba(0,0,0,.45), 0 0 0 4px rgba(0,0,0,.08)", transform: `scale(${p}) rotate(${tilt}deg)`, transformOrigin: "center", fontFamily: fonts.semibold, color: C.ink, ...style }}>
      {children}
    </Box>
  );
};

const ClaudeMark: React.FC<{ size: number }> = ({ size }) => <Img src={staticFile("logos/claude.svg")} style={{ width: size, height: size }} />;

const Typed: React.FC<{ text: string; at: number; cps?: number }> = ({ text, at, cps = 34 }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - f(at)) / SIRTOKEN_FPS) * cps));
  const shown = text.slice(0, n);
  return <span>{shown}<span style={{ opacity: n < text.length && frame % 16 < 8 ? 1 : 0 }}>|</span></span>;
};

// ---------- shots: hard cut to a new framing every ~1.2 s, slow push inside each ----------
const Camera: React.FC<{ from: number; to: number; children: React.ReactNode; seed: number }> = ({ from, to, children, seed }) => {
  const frame = useCurrentFrame();
  const len = f(to) - f(from);
  const cut = Math.max(1, Math.round(len / Math.max(1, Math.round((to - from) / 1.25))));
  const i = Math.floor((frame - f(from)) / cut);
  const local = (frame - f(from)) % cut;
  const framings = [
    { z: 1.0, x: 0, y: 0 }, { z: 1.08, x: -25, y: 30 }, { z: 1.05, x: 25, y: -20 }, { z: 1.12, x: 0, y: 50 }, { z: 1.03, x: -15, y: -30 },
  ];
  const fr = framings[(i + seed) % framings.length];
  const push = interpolate(local, [0, cut], [0, 0.04], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${fr.z + push}) translate(${fr.x}px, ${fr.y}px)` }}>{children}</AbsoluteFill>
  );
};

// ---------- scenes ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swing = Math.sin(frame / 6) * 6;
  const stamp = pop(frame, T.kostenlos, fps, 14);
  const four = pop(frame, T.vier - 0.15, fps, 10);
  return (
    <>
      <SirToken pose={frame < f(T.vier - 0.15) ? "shocked" : "delighted"} x={540} y={760} h={560} at={0} />
      <Box style={{ left: 250, top: 560, width: 580, transform: `rotate(${swing}deg)`, transformOrigin: "top center" }}>
        <Box style={{ left: 280, top: -60, width: 6, height: 60, background: "#CFCFCF" }} />
        <div style={{ background: C.gold, borderRadius: 26, padding: "26px 0", textAlign: "center", fontFamily: fonts.caption, fontSize: 104, color: C.ink, boxShadow: "0 16px 40px rgba(0,0,0,.4)" }}>
          80 € <span style={{ fontSize: 56 }}>/ STUNDE</span>
        </div>
        <Box style={{ left: 30, right: 30, top: 70, height: 16, background: C.red, borderRadius: 8, transform: `scaleX(${stamp}) rotate(-6deg)` }} />
      </Box>
      {frame >= f(T.vier - 0.15) && (
        <Box style={{ left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", gap: 18, transform: `scale(${four})` }}>
          {["⚡", "🩺", "🏋️", "💥"].map((e, i) => (
            <div key={i} style={{ width: 150, height: 150, borderRadius: 34, background: C.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, boxShadow: "0 12px 30px rgba(0,0,0,.35)" }}>{e}</div>
          ))}
        </Box>
      )}
      {frame >= f(T.kostenlos) && (
        <Box style={{ left: 470, top: 610, textAlign: "center", transform: `scale(${1.6 - 0.6 * stamp}) rotate(-12deg)`, opacity: stamp }}>
          <span style={{ fontFamily: fonts.caption, fontSize: 120, color: C.green, border: `10px solid ${C.green}`, borderRadius: 24, padding: "0 30px", background: "rgba(255,255,255,.92)" }}>0 €</span>
        </Box>
      )}
    </>
  );
};

const Step1: React.FC = () => (
  <>
    <SirToken pose="whispering" x={820} y={1000} h={420} at={T.s1} />
    <Card x={70} y={560} w={760} at={T.s1 + 0.1} tilt={-1.5}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, fontSize: 34, color: C.dim }}><ClaudeMark size={46} /> Claude</div>
      <div style={{ background: "#F1ECE3", borderRadius: 22, padding: 26, fontSize: 40, lineHeight: 1.35 }}>
        <div><b>Ziel:</b> <Typed text="sichtbare Bauchmuskeln" at={T.s1 + 0.4} /></div>
        <div style={{ marginTop: 8 }}><b>Zeit:</b> <Typed text="3× 45 Min / Woche" at={tOf("Zeit") - 0.1} /></div>
        <div style={{ marginTop: 8, color: C.red }}><b>Schmerz:</b> <Typed text="linkes Knie" at={tOf("wehtut") - 0.2} /></div>
      </div>
    </Card>
  </>
);

const Step2: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [f(T.s2 + 0.55), f(T.s2 + 0.6), f(T.s2 + 0.95)], [0, 1, 0], clamp);
  const room = frame >= f(tOf("Wohnzimmer") - 0.1);
  return (
    <>
      <SirToken pose="threequarter" x={190} y={1080} h={380} at={T.s2} />
      <Card x={300} y={480} w={640} at={T.s2 + 0.05} style={{ padding: 18, background: "#111" }}>
        <div style={{ height: 620, borderRadius: 24, overflow: "hidden", position: "relative", background: room ? "#C9B79C" : "#3C4E63" }}>
          {room ? (
            <>
              <Box style={{ left: 40, top: 300, width: 330, height: 170, background: "#7D5A44", borderRadius: 30 }} />
              <Box style={{ left: 380, top: 380, width: 160, height: 110, background: "#5B8C6B", borderRadius: 14 }} />
              <Dumbbell x={70} y={510} s={0.8} color="#C2452D" />
              <Box style={{ left: 330, top: 520, width: 230, height: 40, background: "#7A4FB5", borderRadius: 10 }} />
            </>
          ) : (
            <>
              <Box style={{ left: 60, top: 330, width: 480, height: 60, background: "#1F1F1F", borderRadius: 10 }} />
              <Box style={{ left: 90, top: 390, width: 30, height: 140, background: "#1F1F1F" }} />
              <Box style={{ left: 480, top: 390, width: 30, height: 140, background: "#1F1F1F" }} />
              <Dumbbell x={80} y={180} s={1} />
              <Dumbbell x={330} y={190} s={0.9} color="#C2452D" />
            </>
          )}
          {[0, 1, 2, 3].map((k) => (
            <Box key={k} style={{ [k < 2 ? "top" : "bottom"]: 24, [k % 2 ? "right" : "left"]: 24, width: 70, height: 70, borderTop: k < 2 ? "6px solid #fff" : undefined, borderBottom: k >= 2 ? "6px solid #fff" : undefined, borderLeft: k % 2 ? undefined : "6px solid #fff", borderRight: k % 2 ? "6px solid #fff" : undefined } as React.CSSProperties} />
          ))}
          <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
        </div>
        <Box style={{ left: "50%", bottom: -110, width: 110, height: 110, marginLeft: -55, borderRadius: "50%", border: "8px solid #fff", background: "rgba(255,255,255,.25)" }} />
      </Card>
    </>
  );
};

const AGENTS = [
  { at: () => T.a1, icon: "⚡", name: "Athletiktrainer", task: "Beweglichkeit + Ausdauer", color: "#3A86FF" },
  { at: () => T.a2, icon: "🩺", name: "Physio", task: "schützt dein linkes Knie", color: C.green },
  { at: () => T.a3, icon: "🏋️", name: "Krafttrainer", task: "Progression pro Woche", color: C.orange },
  { at: () => T.a4, icon: "💥", name: "Explosivkraft-Coach", task: "Sprünge + Sprints", color: "#B5179E" },
];

const AgentCard: React.FC<{ a: typeof AGENTS[number]; x: number; y: number; i: number }> = ({ a, x, y, i }) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [f(a.at()), f(T.s4 + 1.4)], [0, 1], clamp);
  return (
    <Card x={x} y={y} w={450} at={a.at()} tilt={i % 2 ? 1.5 : -1.5} style={{ padding: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 74, height: 74, borderRadius: 20, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{a.icon}</div>
        <div style={{ fontFamily: fonts.bold, fontSize: a.name.length > 14 ? 30 : 36, lineHeight: 1.1 }}>{a.name}</div>
      </div>
      <div style={{ marginTop: 16, fontSize: 28, color: C.dim }}>{a.task}</div>
      <div style={{ marginTop: 16, height: 14, borderRadius: 7, background: "#EEE7DA", overflow: "hidden" }}>
        <div style={{ width: `${prog * 100}%`, height: "100%", background: a.color }} />
      </div>
      <div style={{ marginTop: 10, fontSize: 24, color: a.color, fontFamily: fonts.bold }}>{prog >= 1 ? "✓ angepasst" : "passt Plan an" + ".".repeat(1 + (Math.floor(frame / 8) % 3))}</div>
    </Card>
  );
};

const Step3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const plan = pop(frame, T.s3 + 0.9, fps, 12);
  return (
    <>
      <SirToken pose={frame < f(T.a1) ? "tipping" : "counting"} x={540} y={frame < f(T.a1) ? 760 : 1090} h={frame < f(T.a1) ? 560 : 360} at={frame < f(T.a1) ? T.s3 : T.a1} />
      {frame < f(T.a1) && (
        <Box style={{ left: 0, right: 0, top: 520, textAlign: "center", transform: `scale(${plan})` }}>
          <span style={{ fontFamily: fonts.caption, fontSize: 96, color: C.gold, textShadow: "0 6px 0 rgba(0,0,0,.4)" }}>DER TRICK</span>
        </Box>
      )}
      {AGENTS.map((a, i) => (
        <AgentCard key={i} a={a} i={i} x={i % 2 ? 560 : 70} y={i < 2 ? 470 : 760} />
      ))}
    </>
  );
};

const PLAN = [
  { old: "Kniebeuge 4×12", neu: "Box-Kniebeuge 4×10", by: 1 },
  { old: "Joggen 30 Min", neu: "Intervalle 8×30 s", by: 0 },
  { old: "Bankdrücken 3×10", neu: "Bankdrücken 4×6 +2,5 kg", by: 2 },
  { old: "—", neu: "Box Jumps 4×5", by: 3 },
];
const Step4: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <SirToken pose={frame < f(tOf("Körper")) ? "disapproving" : "delighted"} x={850} y={1080} h={380} at={T.s4} />
      <Card x={60} y={480} w={820} at={T.s4 + 0.05} tilt={-1}>
        <div style={{ fontFamily: fonts.bold, fontSize: 42, marginBottom: 20 }}>Dein Plan · Woche 1</div>
        {PLAN.map((r, i) => {
          const t = T.s4 + 0.4 + i * 0.55;
          const done = frame >= f(t);
          const a = AGENTS[r.by];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderTop: i ? "2px solid #EEE7DA" : undefined, fontSize: 34 }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ position: "relative" }}>
                {done ? <span style={{ fontFamily: fonts.bold }}>{r.neu}</span> : <span style={{ color: C.dim }}>{r.old}</span>}
              </div>
              {done && <div style={{ marginLeft: "auto", color: C.green, fontFamily: fonts.bold }}>✓</div>}
            </div>
          );
        })}
      </Card>
    </>
  );
};

const Step5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = pop(frame, T.knie - 0.3, fps, 10);
  const note = pop(frame, tOf("Physio", T.s5) , fps, 12);
  const pulse = 1 + Math.sin(frame / 3) * 0.06;
  return (
    <>
      <SirToken pose="shocked" x={830} y={1100} h={360} at={T.knie - 0.2} />
      <Card x={90} y={470} w={620} at={T.s5 + 0.05} style={{ padding: 18, background: "#111" }}>
        <div style={{ height: 640, borderRadius: 22, background: "#D9CBB6", position: "relative", overflow: "hidden" }}>
          {/* squat silhouette */}
          <svg viewBox="0 0 300 320" style={{ position: "absolute", left: 60, top: 40, width: 470, height: 520 }}>
            <g stroke="#3B3B3B" strokeWidth="22" strokeLinecap="round" fill="none">
              <circle cx="150" cy="40" r="26" fill="#3B3B3B" />
              <line x1="150" y1="70" x2="120" y2="160" />
              <line x1="140" y1="95" x2="230" y2="110" />
              <line x1="120" y1="160" x2="185" y2="200" />
              <line x1="185" y1="200" x2="150" y2="290" />
              <line x1="120" y1="160" x2="160" y2="215" stroke="#565656" />
              <line x1="160" y1="215" x2="120" y2="292" stroke="#565656" />
            </g>
          </svg>
          {frame >= f(T.knie - 0.3) && (
            <Box style={{ left: 270, top: 290, width: 150, height: 150, borderRadius: "50%", border: `10px solid ${C.red}`, transform: `scale(${ring * pulse})` }} />
          )}
        </div>
      </Card>
      <Card x={420} y={900} w={560} at={tOf("Physio", T.s5)} tilt={2} style={{ padding: 24, transform: `scale(${note}) rotate(2deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: 32, color: C.green }}>🩺 Physio</div>
        <div style={{ marginTop: 10, fontSize: 32, lineHeight: 1.3 }}>Knie kippt nach innen → Füße weiter auseinander, Box als Tiefe.</div>
      </Card>
    </>
  );
};

const Step6: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = Math.max(0, 45 - Math.floor((frame - f(T.timer)) / 8));
  const ringP = interpolate(frame, [f(T.timer), f(T.s7)], [1, 0.25], clamp);
  return (
    <>
      <SirToken pose="delighted" x={240} y={1060} h={400} at={T.s6} />
      <Card x={400} y={360} w={560} at={T.s6 + 0.05} style={{ padding: 18, background: "#111", borderRadius: 60 }}>
        <div style={{ height: 900, borderRadius: 46, background: C.cream, padding: 34, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: 36 }}><ClaudeMark size={40} /> Mein Training</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <svg width="300" height="300" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#EEE7DA" strokeWidth="9" fill="none" />
              <circle cx="50" cy="50" r="42" stroke={C.orange} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={`${264 * ringP} 264`} transform="rotate(-90 50 50)" />
              <text x="50" y="58" textAnchor="middle" fontSize="24" fontFamily={fonts.bold} fill={C.ink}>0:{String(frame >= f(T.timer) ? sec : 45).padStart(2, "0")}</text>
            </svg>
          </div>
          {["Box-Kniebeuge 4×10", "Intervalle 8×30 s", "Bankdrücken 4×6", "Box Jumps 4×5"].map((x, i) => {
            const on = frame >= f(T.haken + i * 0.22);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 22, fontSize: 32 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, border: `4px solid ${on ? C.green : "#CFC6B8"}`, background: on ? C.green : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>{on ? "✓" : ""}</div>
                <span style={{ textDecoration: on ? "line-through" : undefined, color: on ? C.dim : C.ink }}>{x}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

const Step7: React.FC = () => {
  const frame = useCurrentFrame();
  const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const ver = frame < f(tOf("passen")) ? 1 : frame < f(tOf("alles")) ? 2 : 3;
  return (
    <>
      <SirToken pose="smug" x={540} y={1090} h={380} at={T.s7} />
      <Card x={70} y={480} w={940} at={T.s7 + 0.05}>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, marginBottom: 18 }}>Check-in jeden Sonntag</div>
        {[0, 1, 2].map((w) => (
          <div key={w} style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {days.map((d, i) => {
              const sun = i === 6;
              const lit = sun && frame >= f(tOf("Sonntag") + w * 0.35);
              return (
                <div key={d} style={{ flex: 1, height: 74, borderRadius: 16, background: lit ? C.orange : "#F1ECE3", color: lit ? "#fff" : C.dim, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 26 }}>{lit ? "✓" : d}</div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: 22, display: "flex", gap: 12, fontSize: 30, fontFamily: fonts.bold }}>
          {[1, 2, 3].map((v) => (
            <div key={v} style={{ padding: "10px 22px", borderRadius: 40, background: v <= ver ? C.ink : "#EEE7DA", color: v <= ver ? "#fff" : C.dim }}>Plan v{v}</div>
          ))}
        </div>
      </Card>
    </>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dm = pop(frame, T.trainerWord + 0.7, fps, 12);
  return (
    <>
      <SirToken pose="tipping" x={540} y={1060} h={460} at={T.end} />
      <Card x={90} y={440} w={900} at={T.end + 0.1} style={{ padding: 30 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 32 }}>du <span style={{ color: C.dim, fontFamily: fonts.regular }}>· jetzt</span></div>
            <div style={{ fontSize: 56, fontFamily: fonts.bold, marginTop: 4 }}>
              {frame >= f(T.trainerWord) ? <Typed text="TRAINER" at={T.trainerWord} cps={18} /> : <span style={{ color: C.dim }}>Kommentieren…</span>}
            </div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 44 }}>♡</div>
        </div>
      </Card>
      <Box style={{ left: 150, top: 760, width: 780, transform: `scale(${dm})`, transformOrigin: "top center" }}>
        <div style={{ background: "linear-gradient(135deg,#7B2FF7,#F107A3)", borderRadius: 36, padding: 30, color: "#fff", fontFamily: fonts.semibold, boxShadow: "0 24px 60px rgba(0,0,0,.45)" }}>
          <div style={{ fontSize: 28, opacity: 0.85 }}>📩 Neue Nachricht</div>
          <div style={{ fontSize: 38, marginTop: 8, fontFamily: fonts.bold }}>Hier ist dein 4-Trainer-Prompt 💪</div>
        </div>
      </Box>
    </>
  );
};

// ---------- captions ----------
const chunks = (() => {
  const out: W[][] = [];
  let cur: W[] = [];
  WORDS.forEach((w) => {
    cur.push(w);
    if (cur.length === 3 || /[.,:!?]$/.test(w.w)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / SIRTOKEN_FPS;
  const idx = chunks.findIndex((c, i) => t >= c[0].s - 0.05 && (i === chunks.length - 1 || t < chunks[i + 1][0].s - 0.05));
  if (idx < 0) return null;
  const c = chunks[idx];
  const local = frame - f(c[0].s - 0.05);
  const s = interpolate(local, [0, 4], [0.85, 1], { ...clamp, easing: ease });
  return (
    <Box style={{ left: 40, right: 40, top: 1500, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, transform: `scale(${s})` }}>
      {c.map((w, i) => {
        const active = t >= w.s - 0.03 && t < (c[i + 1]?.s ?? w.e + 0.3);
        return (
          <span key={i} style={{ fontFamily: fonts.caption, fontSize: 84, lineHeight: 1, padding: "16px 24px 12px", borderRadius: 22, background: active ? C.orange : C.cream, color: active ? "#fff" : C.ink, boxShadow: "0 8px 0 rgba(0,0,0,.35)", textTransform: "uppercase" }}>
            {w.w.replace(/[.,:]$/, "")}
          </span>
        );
      })}
    </Box>
  );
};

const StepCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / SIRTOKEN_FPS;
  const n = STEPS.filter((s) => t >= s).length;
  if (n === 0 || t >= T.end) return null;
  const at = STEPS[n - 1];
  const s = interpolate(frame - f(at), [0, 6], [1.25, 1], { ...clamp, easing: ease });
  return (
    <Box style={{ left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${s})`, display: "flex", alignItems: "center", gap: 18, background: C.ink, color: "#fff", padding: "14px 30px", borderRadius: 50, fontFamily: fonts.bold, fontSize: 40, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>
        <span style={{ color: C.orange }}>SCHRITT {n}</span><span style={{ opacity: 0.6 }}>/ 7</span>
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((_, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: i < n ? C.orange : "rgba(255,255,255,.25)" }} />)}
        </div>
      </div>
    </Box>
  );
};

// ---------- sound ----------
const Sfx: React.FC<{ at: number; src: string; v?: number }> = ({ at, src, v = 0.5 }) => (
  <Sequence from={Math.max(0, f(at))} durationInFrames={f(3)}><Audio src={staticFile(`sirtoken/sfx-${src}.mp3`)} volume={v} /></Sequence>
);

// ---------- main ----------
const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0, to: T.s1, C: Hook },
  { from: T.s1, to: T.s2, C: Step1 },
  { from: T.s2, to: T.s3, C: Step2 },
  { from: T.s3, to: T.s4, C: Step3 },
  { from: T.s4, to: T.s5, C: Step4 },
  { from: T.s5, to: T.s6, C: Step5 },
  { from: T.s6, to: T.s7, C: Step6 },
  { from: T.s7, to: T.end, C: Step7 },
  { from: T.end, to: SIRTOKEN_SECONDS, C: EndCard },
];

export const SirTokenTrainer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SCENES.map(({ from, to, C: Scene }, i) => {
        const inScene = frame >= f(from) && frame < f(to);
        if (!inScene) return null;
        return (
          <Camera key={i} from={from} to={to} seed={i}>
            <GymWorld />
            <Scene />
          </Camera>
        );
      })}
      <StepCounter />
      <Captions />

      <Audio src={staticFile("sirtoken/voice.mp3")} volume={1} />
      <Audio src={staticFile("sirtoken/music.mp3")} volume={0.09} loop />
      {SCENES.slice(1).map((s, i) => <Sfx key={i} at={s.from - 0.08} src="whoosh-quick" v={0.28} />)}
      <Sfx at={T.vier - 0.15} src="ui-pop" v={0.45} />
      <Sfx at={T.kostenlos} src="stamp" v={0.55} />
      <Sfx at={T.s1 + 0.4} src="typing" v={0.18} />
      <Sfx at={T.s2 + 0.55} src="click" v={0.6} />
      {[T.a1, T.a2, T.a3, T.a4].map((t, i) => <Sfx key={i} at={t} src="ui-pop" v={0.4} />)}
      {PLAN.map((_, i) => <Sfx key={i} at={T.s4 + 0.4 + i * 0.55} src="check" v={0.35} />)}
      <Sfx at={T.knie - 0.3} src="ui-pop" v={0.45} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={T.haken + i * 0.22} src="check" v={0.3} />)}
      <Sfx at={tOf("Sonntag")} src="chime" v={0.3} />
      <Sfx at={T.trainerWord + 0.7} src="chime" v={0.4} />
    </AbsoluteFill>
  );
};
