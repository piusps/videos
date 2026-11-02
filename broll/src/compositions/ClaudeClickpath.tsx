// Step 1 click path: Claude UI (paper look) in the top half, the wood stage with die-cut Sir Token below.
// claudebyseb "github link in Claude" scene, branded on Sir Token + the trainer topic.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, Audio } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { THEMES, PillCaptions, Word, pixelFont, Sticker } from "../components/PixelKit";
import { DieCutSir, Sparkle, PixelCoin, PxArt } from "../components/PixelSir";
import words from "../../public/sirtoken/words.json";

const { fontFamily: serif } = loadSerif("normal", { weights: ["600"] });
const T0 = 4.4;
const th = THEMES.gym;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };

const PANEL_H = 960;
const FLOOR = 1270;
// typed prompt: each part starts on its spoken word; the key word gets a highlight
const PARTS = [
  { at: 5.5, pre: "", key: "Ziel:", rest: " 5 kg Muskeln bis März.", color: "#FFD27A", icon: "🎯", label: "ZIEL" },
  { at: 6.25, pre: " ", key: "Zeit:", rest: " 3× 45 Min pro Woche.", color: "#A7E3FF", icon: "⏱️", label: "ZEIT" },
  { at: 6.95, pre: " ", key: "Knie", rest: " links tut weh.", color: "#FFB3B3", icon: "🦵", label: "KNIE" },
];
const CPS = 42; // typing speed
const SEND = 7.65;
// click path: where the pixel cursor is and when it clicks
const PATH = [
  { t: 4.4, x: 760, y: 1500 },
  { t: 4.75, x: 470, y: 112 }, // 1 open claude.ai
  { t: 5.25, x: 300, y: 790 }, // 2 click into the input
  { t: 7.35, x: 300, y: 790 },
  { t: SEND, x: 975, y: 895 }, // 3 send
  { t: 9.0, x: 975, y: 895 },
];
const CLICKS = [{ t: 4.85, n: 1, x: 470, y: 112, mx: 700, my: 82 }, { t: 5.32, n: 2, x: 300, y: 790, mx: 18, my: 545 }, { t: SEND + 0.05, n: 3, x: 975, y: 895, mx: 940, my: 735 }];

const cursorAt = (t: number) => {
  for (let i = 0; i < PATH.length - 1; i++) {
    const a = PATH[i], b = PATH[i + 1];
    if (t <= b.t) {
      const k = ease((t - a.t) / Math.max(0.01, b.t - a.t));
      const arc = Math.sin(k * Math.PI) * 60;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k - arc };
    }
  }
  return PATH[PATH.length - 1];
};

const HAND = ["..KK......", ".KWWK.....", ".KWWK.....", ".KWWKKK...", ".KWWKWWKK.", "KKWWKWWKWK", "KWWWWWWKWK", "KWWWWWWWWK", ".KWWWWWWWK", "..KWWWWWK.", "...KKKKK.."];
const PxGrid: React.FC<{ rows: string[]; pal: Record<string, string>; px: number }> = ({ rows, pal, px }) => (
  <svg width={rows[0].length * px} height={rows.length * px} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" style={{ display: "block" }}>
    {rows.flatMap((r, y) => [...r].map((c, x) => (pal[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pal[c]} /> : null)))}
  </svg>
);

const Wood: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(#4A2C1A, #3A2214 60%, #2A170D)" }}>
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: i * 128, top: 0, width: 124, height: FLOOR, background: i % 2 ? "rgba(255,210,160,.035)" : "rgba(0,0,0,.06)", borderLeft: "4px solid rgba(0,0,0,.28)" }} />
    ))}
    {/* panel frames like the reference */}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: 40 + i * 345, top: PANEL_H + 40, width: 310, height: FLOOR - PANEL_H - 70, border: "6px solid rgba(0,0,0,.22)", borderRadius: 10, boxShadow: "inset 0 0 0 3px rgba(255,220,180,.05)" }} />
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR, bottom: 0, background: "linear-gradient(#3B2214, #24130B)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR - 6, height: 14, background: "linear-gradient(#E4C06A, #A8822E)", boxShadow: "0 6px 0 rgba(0,0,0,.35)" }} />
  </AbsoluteFill>
);

const ClaudePanel: React.FC<{ t: number }> = ({ t }) => {
  const drop = back((t - 4.4) / 0.5);
  const y = -PANEL_H * (1 - drop);
  // typed text
  const spans = PARTS.map((p) => {
    const full = p.pre + p.key + p.rest;
    const n = Math.max(0, Math.floor((t - p.at) * CPS));
    const shown = full.slice(0, n);
    const keyStart = p.pre.length, keyEnd = keyStart + p.key.length;
    return { p, a: shown.slice(0, keyStart), k: shown.slice(keyStart, keyEnd), r: shown.slice(keyEnd), hl: n >= keyEnd };
  });
  const typing = PARTS.some((p) => t > p.at && t < p.at + (p.pre + p.key + p.rest).length / CPS);
  const sent = t >= SEND;
  const sendPop = sent ? 1 + 0.25 * Math.max(0, 1 - (t - SEND) / 0.25) : 1;
  const inputFocus = t > 5.32;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: PANEL_H }}>
      <div style={{ position: "absolute", inset: 0, background: "#F4EFE5", borderBottom: "8px solid #1E1A16", boxShadow: "0 18px 0 rgba(0,0,0,.35)" }}>
        {/* paper grain */}
        <svg width="1080" height={PANEL_H} style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" /><feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0.5 0" /></filter>
          <rect width="1080" height={PANEL_H} filter="url(#grain)" />
        </svg>
        {/* window bar */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 88, background: "#EAE3D5", borderTop: "6px solid #1E1A16", borderBottom: "6px solid #1E1A16", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 22, display: "flex", gap: 12 }}>
            {["#E5534B", "#E9B23A", "#3FB950"].map((c) => <div key={c} style={{ width: 30, height: 30, borderRadius: 15, background: c, border: "3px solid #1E1A16" }} />)}
          </div>
          <Img src={staticFile("logos/claude.svg")} style={{ width: 44, height: 44, marginRight: 14 }} />
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: "#1E1A16" }}>Claude</div>
        </div>
        {/* greeting */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, opacity: ease((t - 4.75) / 0.3), transform: `translateY(${(1 - ease((t - 4.75) / 0.3)) * 20}px)` }}>
          <Img src={staticFile("logos/claude.svg")} style={{ width: 74, height: 74, transform: `rotate(${t * 40}deg)` }} />
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 74, color: "#1A1714" }}>Wie kann ich dir helfen?</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 18 }}>
          {["Schreiben", "Lernen", "Code", "Recherche"].map((c, i) => (
            <div key={c} style={{ fontFamily: pixelFont, fontWeight: 600, fontSize: 34, color: "#4A443C", padding: "10px 26px", borderRadius: 40, border: "3px solid #CFC6B5", background: "#EFE8DA", transform: `scale(${back((t - 4.9 - i * 0.06) / 0.35)})` }}>{c}</div>
          ))}
        </div>
        {/* input card */}
        <div style={{ position: "absolute", left: 28, right: 28, top: 590, height: 340, background: "#FFFFFF", border: "7px solid #1E1A16", borderRadius: 34, boxShadow: inputFocus ? "0 0 0 8px rgba(217,119,87,.35), 0 12px 0 rgba(0,0,0,.25)" : "0 12px 0 rgba(0,0,0,.25)" }}>
          <div style={{ position: "absolute", left: 34, right: 34, top: 26, fontFamily: pixelFont, fontWeight: 600, fontSize: 44, lineHeight: 1.32, color: "#1E1A16" }}>
            {t < 5.5 && <span style={{ color: "#A39C90" }}>Schreib Claude …</span>}
            {spans.map(({ p, a, k, r, hl }, i) => (
              <span key={i}>
                {a}
                {k && <span style={{ background: hl ? p.color : "transparent", borderRadius: 10, padding: "0 6px", boxShadow: hl ? "0 4px 0 rgba(0,0,0,.18)" : "none" }}>{k}</span>}
                {r}
              </span>
            ))}
            {inputFocus && !sent && <span style={{ display: "inline-block", width: 5, height: 46, marginLeft: 3, background: "#D97757", verticalAlign: "-8px", opacity: typing || Math.floor(t * 3) % 2 ? 1 : 0 }} />}
          </div>
          <div style={{ position: "absolute", left: 26, bottom: 22, width: 64, height: 64, borderRadius: 32, border: "5px solid #1E1A16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 700, fontFamily: pixelFont }}>+</div>
          <div style={{ position: "absolute", right: 140, bottom: 34, fontFamily: pixelFont, fontWeight: 500, fontSize: 34, color: "#7C756A" }}>Opus 5.5</div>
          <div style={{ position: "absolute", right: 22, bottom: 16, width: 96, height: 80, borderRadius: 22, background: sent ? "#B85C3E" : "#D97757", border: "5px solid #1E1A16", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sendPop})`, boxShadow: "0 6px 0 rgba(0,0,0,.3)" }}>
            <svg width="44" height="44" viewBox="0 0 10 10" shapeRendering="crispEdges"><path d="M5 1 L5 9 M5 1 L2 4 M5 1 L8 4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="square" /></svg>
          </div>
        </div>
        {/* gold sparkles drifting over the paper */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 60 + rnd(i) * 960, top: 200 + rnd(i + 4) * 360, color: "#E3B341", fontSize: 26, opacity: 0.25 + 0.6 * Math.abs(Math.sin(t * 2 + i)), transform: `rotate(${t * 60 + i * 30}deg)` }}>✦</div>
        ))}
      </div>
    </div>
  );
};

const ClickPath: React.FC<{ t: number }> = ({ t }) => {
  const c = cursorAt(t);
  const press = CLICKS.some((k) => t >= k.t && t < k.t + 0.12);
  return (
    <>
      {CLICKS.map((k) => {
        const p = back((t - k.t) / 0.35);
        const ring = cl((t - k.t) / 0.45);
        return t >= k.t - 0.02 ? (
          <React.Fragment key={k.n}>
            <div style={{ position: "absolute", left: k.x - 70 * ring, top: k.y - 70 * ring, width: 140 * ring, height: 140 * ring, borderRadius: "50%", border: `6px solid rgba(217,119,87,${1 - ring})` }} />
            <div style={{ position: "absolute", left: k.mx, top: k.my, width: 62, height: 62, borderRadius: 31, background: "#D97757", border: "5px solid #fff", boxShadow: "0 6px 0 rgba(0,0,0,.35)", color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>{k.n}</div>
          </React.Fragment>
        ) : null;
      })}
      <div style={{ position: "absolute", left: c.x - 14, top: c.y - 6, transform: `scale(${press ? 0.85 : 1}) rotate(-12deg)`, transformOrigin: "20% 10%", filter: "drop-shadow(0 8px 0 rgba(0,0,0,.35))" }}>
        <PxGrid rows={HAND} pal={{ K: "#1E1A16", W: "#FFFFFF" }} px={9} />
      </div>
    </>
  );
};

const Keyboard: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const typing = PARTS.some((p) => t > p.at && t < p.at + (p.pre + p.key + p.rest).length / CPS);
  const hit = typing ? Math.floor(t * 18) : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 9px 0 rgba(0,0,0,.35))" }}>
      <div style={{ width: 330, padding: 10, background: "#E9E4DA", border: "5px solid #1E1A16", borderRadius: 14, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const on = hit >= 0 && (rnd(hit + i * 0.1) * 30 | 0) === i;
          return <div key={i} style={{ height: 22, borderRadius: 4, background: on ? "#D97757" : "#FBF8F2", border: "3px solid #1E1A16", transform: `translateY(${on ? 3 : 0}px)` }} />;
        })}
      </div>
      <div style={{ width: 290, height: 60, margin: "0 auto", background: "#6B3F22", border: "5px solid #1E1A16", borderTop: "none" }} />
    </div>
  );
};

const FP: Record<string, { rows: string[]; pal: Record<string, string> }> = {
  dumbbell: { rows: ["KK.........KK", "KKK.......KKK", "KKKMMMMMMMKKK", "KKK.......KKK", "KK.........KK"], pal: { K: "#2A2630", M: "#AEB6C4" } },
  bottle: { rows: ["..KK..", ".KwwK.", "KccccK", "KcwccK", "KcwccK", "KccccK", "KccccK", ".KKKK."], pal: { K: "#1E1A16", c: "#5FD3E0", w: "#FFFFFF" } },
  shoe: { rows: [".....KKK...", "....KrrrK..", "...KrrwrrK.", "KKKrrrrrrrK", "KwwwwwwwwwK", "KKKKKKKKKKK"], pal: { K: "#1E1A16", r: "#E8574E", w: "#FFFFFF" } },
  kettle: { rows: ["..KKK..", ".K...K.", "KKKKKKK", "KkkkkkK", "KkhkkkK", "KkkkkkK", ".KKKKK."], pal: { K: "#1E1A16", k: "#2FBF71", h: "#FFFFFF" } },
  apple: { rows: ["...g..", "..g...", ".RRRR.", "RRwRRR", "RRRRRR", "RRRRRR", ".RRRR."], pal: { g: "#3C8A3A", R: "#D9483E", w: "#FFFFFF" } },
};
const FLOOR_PROPS = [
  { k: "dumbbell", x: 70, y: 1690, px: 14, r: -8 },
  { k: "bottle", x: 330, y: 1700, px: 14, r: 6 },
  { k: "shoe", x: 520, y: 1730, px: 13, r: -4 },
  { k: "kettle", x: 760, y: 1690, px: 14, r: 5 },
  { k: "apple", x: 930, y: 1745, px: 11, r: -6 },
];

const Inner: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const typing = PARTS.some((p) => t > p.at && t < p.at + (p.pre + p.key + p.rest).length / CPS);
  const bob = typing ? Math.abs(Math.sin(t * 18)) * 6 : Math.abs(Math.sin(t * 4)) * 4;
  const cheer = t > SEND && t < SEND + 0.8;
  const zoom = 1.02 + 0.012 * Math.sin(t * 0.8) + 0.04 * Math.max(0, 1 - Math.abs(t - SEND - 0.1) / 0.25);
  return (
    <AbsoluteFill style={{ background: "#2A170D", overflow: "hidden", fontFamily: pixelFont }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${4 * Math.sin(t * 0.5)}px, ${3 * Math.sin(t * 0.37)}px)` }}>
        <Wood />
        {/* stage: Sir Token types the prompt, stickers pop on Ziel / Zeit / Knie */}
        <DieCutSir x={250} floorY={FLOOR} px={6.4} lift={cheer ? 60 * Math.sin(((t - SEND) / 0.8) * Math.PI) : 0} sy={1 - (typing ? 0.03 : 0)} pose={{ expr: cheer ? "happy" : "normal", blink: Math.floor(t * 10) % 37 === 0, armL: typing ? 70 + bob * 3 : 10, armR: cheer ? 170 : typing ? 70 - bob * 3 : 10 }} />
        <Keyboard t={t} x={390} y={FLOOR - 165} />
        {PARTS.map((p, i) => (
          <Sticker key={i} x={760 + i * 100} y={FLOOR - 245 + (i % 2) * 30} w={130} at={p.at + 0.15} label={p.label} rot={[-6, 4, -3][i]}>
            <div style={{ height: 90, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58 }}>{p.icon}</div>
          </Sticker>
        ))}
        {/* letters flying out of the keyboard while typing */}
        {Array.from({ length: 14 }).map((_, i) => {
          const life = ((t * 1.7 + rnd(i) * 3) % 1);
          if (!typing) return null;
          return <div key={i} style={{ position: "absolute", left: 555 + (rnd(i + 2) - 0.5) * 260 + life * (rnd(i + 5) - 0.5) * 160, top: FLOOR - 170 - life * 240, fontFamily: pixelFont, fontWeight: 900, fontSize: 30, color: "#FFE9B0", opacity: 1 - life, textShadow: "0 3px 0 rgba(0,0,0,.4)" }}>{"ZIELKNEZT35"[i % 11]}</div>;
        })}
        {cheer && Array.from({ length: 8 }).map((_, i) => <PixelCoin key={i} x={250 + Math.cos(i) * 160 * cl((t - SEND) / 0.5)} y={FLOOR - 420 - Math.sin(i * 2) * 120 * cl((t - SEND) / 0.5)} px={6} phase={i} />)}
        <Sparkle x={980} y={600} at={SEND + 0.05} size={10} />
        <ClaudePanel t={t} />
        <ClickPath t={t} />
        {/* floor: rug, dumbbells, mat with reflections so the lower third is not empty */}
        <div style={{ position: "absolute", left: 140, top: FLOOR + 380, width: 800, height: 120, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(217,119,87,.28), transparent)" }} />
        {FLOOR_PROPS.map((fp, i) => (
          <div key={"fp" + i} style={{ position: "absolute", left: fp.x, top: fp.y - Math.abs(Math.sin(t * 2.4 + i)) * (i % 2 ? 8 : 0), transform: `rotate(${fp.r}deg)`, filter: "drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 10px 0 rgba(0,0,0,.4))" }}>
            <PxArt rows={FP[fp.k].rows} pal={FP[fp.k].pal} px={fp.px} />
          </div>
        ))}
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 1000, top: FLOOR + 30 + rnd(i + 8) * 600, width: 6, height: 6, background: "#FFE1A8", opacity: 0.2 + 0.5 * Math.abs(Math.sin(t * 2 + i)) }} />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10,4,2,.5) 100%)" }} />
      <PillCaptions words={words as Word[]} theme={th} />
      <Audio src={staticFile("sirtoken/voice.mp3")} />
    </AbsoluteFill>
  );
};

export const ClaudeClickpath: React.FC = () => (
  <Sequence from={-Math.round(T0 * 30)}>
    <Inner />
  </Sequence>
);
