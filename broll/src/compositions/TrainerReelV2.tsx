// Full trainer reel (S-012, keyword TRAINER) in the approved claudebyseb style:
// Claude paper UI + click path with a die-cut wood stage below, toy-3D table for the trick and the Sunday check-in.
// Every scene reads reel time t directly, transitions overlap neighbouring scenes by 2 × D.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { THEMES, PillCaptions, Word, pixelFont, Sticker, Stamp, Checklist, CommentCard } from "../components/PixelKit";
import { DieCutSir, PixelCoin, CoinBurst, Confetti, Sparkle, PxArt, SirPose } from "../components/PixelSir";
import { cl, ease, back, rnd, INK, CLAUDE_ORANGE, PANEL_H, STAGE_FLOOR, DIECUT, ClaudeWindow, ClickPath, Click, WoodStage, PropSticker, Buddy, PROPS, PromptPart, isTyping, claudeSerif } from "../components/ClaudeUI";
import { TableShot, MODE_TRICK, MODE_SUNDAY } from "./TrainerTable3D";
import words from "../../public/sirtoken/words.json";

export const TRAINER_V2_SECONDS = 37.5;
const th = THEMES.gym;
const D = 0.17; // half transition length
const CUTS = [0, 4.45, 7.78, 11.0, 17.85, 20.78, 24.92, 28.62, 31.72, TRAINER_V2_SECONDS];
const IS3D = [false, false, false, true, false, false, false, true, false];

// ---------- shared bits ----------
const bounce = (t: number, at: number, dur = 0.3) => Math.max(0, 1 - Math.abs(t - at) / dur);

const StepChip: React.FC<{ n: number; t: number; at: number; y?: number; label?: string }> = ({ n, t, at, y = 300, label }) => (
  <div style={{ position: "absolute", right: 50, top: y, transform: `scale(${back((t - at) / 0.4)}) rotate(3deg)`, transformOrigin: "100% 50%", display: "flex", alignItems: "center", gap: 14, padding: "10px 26px 10px 12px", borderRadius: 50, background: CLAUDE_ORANGE, border: `5px solid ${INK}`, boxShadow: "0 7px 0 rgba(0,0,0,.35)", fontFamily: pixelFont, fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: 1 }}>
    <span style={{ width: 58, height: 58, borderRadius: 29, background: "#fff", color: CLAUDE_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{n}</span>
    {label ?? "SCHRITT"}
    <span style={{ opacity: 0.7, fontSize: 30 }}>/ 7</span>
  </div>
);

const KEYS_ROWS = 3;
const Keyboard: React.FC<{ t: number; x: number; y: number; typing: boolean }> = ({ t, x, y, typing }) => {
  const hit = typing ? Math.floor(t * 18) : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, filter: DIECUT(5) }}>
      <div style={{ width: 330, padding: 10, background: "#E9E4DA", border: `5px solid ${INK}`, borderRadius: 14, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5 }}>
        {Array.from({ length: 10 * KEYS_ROWS }).map((_, i) => {
          const on = hit >= 0 && ((rnd(hit + i * 0.1) * 30) | 0) === i;
          return <div key={i} style={{ height: 22, borderRadius: 4, background: on ? CLAUDE_ORANGE : "#FBF8F2", border: `3px solid ${INK}`, transform: `translateY(${on ? 3 : 0}px)` }} />;
        })}
      </div>
      <div style={{ width: 290, height: 60, margin: "0 auto", background: "#6B3F22", border: `5px solid ${INK}`, borderTop: "none" }} />
    </div>
  );
};

// Sir Token typing at the desk under the Claude window; cheers after send
const TypingDesk: React.FC<{ t: number; prompt: PromptPart[]; sendAt: number; letters: string; sirX?: number; kbX?: number }> = ({ t, prompt, sendAt, letters, sirX = 250, kbX = 390 }) => {
  const typing = isTyping(prompt, t);
  const bob = typing ? Math.abs(Math.sin(t * 18)) * 6 : Math.abs(Math.sin(t * 4)) * 4;
  const cheer = t > sendAt && t < sendAt + 0.8;
  return (
    <>
      <DieCutSir x={sirX} floorY={STAGE_FLOOR} px={6.4} lift={cheer ? 60 * Math.sin(((t - sendAt) / 0.8) * Math.PI) : 0} sy={1 - (typing ? 0.03 : 0)}
        pose={{ expr: cheer ? "happy" : "normal", blink: Math.floor(t * 10) % 37 === 0, armL: Math.round((typing ? 70 + bob * 3 : 10) / 5) * 5, armR: Math.round((cheer ? 170 : typing ? 70 - bob * 3 : 10) / 5) * 5 }} />
      <Keyboard t={t} x={kbX} y={STAGE_FLOOR - 165} typing={typing} />
      {typing && Array.from({ length: 14 }).map((_, i) => {
        const life = (t * 1.7 + rnd(i) * 3) % 1;
        return <div key={i} style={{ position: "absolute", left: kbX + 165 + (rnd(i + 2) - 0.5) * 260 + life * (rnd(i + 5) - 0.5) * 160, top: STAGE_FLOOR - 170 - life * 240, fontFamily: pixelFont, fontWeight: 900, fontSize: 30, color: "#FFE9B0", opacity: 1 - life, textShadow: "0 3px 0 rgba(0,0,0,.4)" }}>{letters[i % letters.length]}</div>;
      })}
      {cheer && Array.from({ length: 8 }).map((_, i) => <PixelCoin key={i} x={sirX + Math.cos(i) * 160 * cl((t - sendAt) / 0.5)} y={STAGE_FLOOR - 420 - Math.sin(i * 2) * 120 * cl((t - sendAt) / 0.5)} px={6} phase={i} />)}
    </>
  );
};

const FloorProps: React.FC<{ t: number; set?: number; floor?: number }> = ({ t, set = 0, floor = STAGE_FLOOR }) => {
  const sets = [
    [{ k: "dumbbell", x: 70, y: 420, px: 14, r: -8 }, { k: "bottle", x: 330, y: 430, px: 14, r: 6 }, { k: "shoe", x: 520, y: 460, px: 13, r: -4 }, { k: "kettle", x: 760, y: 420, px: 14, r: 5 }, { k: "apple", x: 930, y: 475, px: 11, r: -6 }],
    [{ k: "mat", x: 60, y: 440, px: 14, r: -4 }, { k: "band", x: 340, y: 420, px: 13, r: 8 }, { k: "dumbbell", x: 520, y: 455, px: 13, r: 5 }, { k: "bottle", x: 760, y: 420, px: 14, r: -6 }, { k: "apple", x: 930, y: 470, px: 11, r: 4 }],
  ][set];
  return (
    <>
      <div style={{ position: "absolute", left: 140, top: floor + 380, width: 800, height: 120, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(217,119,87,.28), transparent)" }} />
      {sets.map((p, i) => <PropSticker key={i} k={p.k} x={p.x} y={floor + p.y} px={p.px} r={p.r} t={t} bob={i % 2 ? 8 : 0} />)}
    </>
  );
};

// chip in the Claude window bar so the step number never covers UI
const BarChip: React.FC<{ n: number; t: number; enter: number }> = ({ n, t, enter }) => {
  const drop = back((t - enter) / 0.5);
  return (
    <div style={{ position: "absolute", right: 22, top: 84 - PANEL_H * (1 - drop), transform: `scale(${back((t - enter - 0.35) / 0.35)})`, padding: "8px 22px", borderRadius: 40, background: CLAUDE_ORANGE, border: `4px solid ${INK}`, fontFamily: pixelFont, fontWeight: 900, fontSize: 34, color: "#fff", boxShadow: "0 5px 0 rgba(0,0,0,.3)" }}>
      SCHRITT {n}<span style={{ opacity: 0.7, fontSize: 26 }}> / 7</span>
    </div>
  );
};

const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10,4,2,.5) 100%)", pointerEvents: "none" }} />;

const Drift: React.FC<{ t: number; punches?: number[]; children: React.ReactNode }> = ({ t, punches = [], children }) => {
  const z = 1.02 + 0.012 * Math.sin(t * 0.8) + 0.04 * Math.max(0, ...punches.map((p) => bounce(t, p, 0.25)));
  return <AbsoluteFill style={{ transform: `scale(${z}) translate(${4 * Math.sin(t * 0.5)}px, ${3 * Math.sin(t * 0.37)}px)` }}>{children}</AbsoluteFill>;
};

// little pixel photos used as attachments
const Photo: React.FC<{ bg: string; k: string; px: number }> = ({ bg, k, px }) => (
  <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <PxArt rows={PROPS[k].rows} pal={PROPS[k].pal} px={px} />
  </div>
);
const SquatPhoto: React.FC = () => (
  <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(#BFE3F5,#E9F5FB)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, background: "#C9A27A" }} />
    <DieCutSir x={60} floorY={104} px={1.9} pose={{ squat: 3, armL: 90, armR: 90 }} />
  </div>
);

// ---------- S0 hook ----------
const WALLET = ["KKKKKKKKKKKK", "KbbbbbbbbbbK", "KbbbbbbbKKKK", "KbbbbbbKyyyK", "KbbbbbbKyyyK", "KbbbbbbbKKKK", "KbbbbbbbbbbK", "KKKKKKKKKKKK"];
const S0: React.FC<{ t: number }> = ({ t }) => {
  const price = t < 3.45 ? Math.round(80 * ease((t - 1.25) / 0.45)) : Math.round(80 * (1 - ease((t - 3.45) / 0.3)));
  const coachOut = ease((t - 2.3) / 0.35);
  const sirExpr: SirPose["expr"] = t < 1.25 ? "normal" : t < 2.38 ? "shocked" : "happy";
  const jump = t > 3.45 && t < 4.15 ? 110 * Math.sin(((t - 3.45) / 0.7) * Math.PI) : 0;
  const free = t >= 3.45;
  const FL = 1270;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Drift t={t} punches={[1.25, 2.38, 3.45]}>
        <WoodStage t={t} top={170} floor={FL} plaque="PERSONAL TRAINER" lamps />
        {/* price card */}
        <div style={{ position: "absolute", left: 70, top: 340, width: 470, transform: `scale(${back((t - 1.15) / 0.4)}) rotate(-4deg)`, transformOrigin: "50% 100%", filter: DIECUT(6) }}>
          <div style={{ background: free ? "#2FBF71" : "#FFF3D6", border: `6px solid ${INK}`, borderRadius: 20, padding: "16px 10px 12px", textAlign: "center" }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 900, fontSize: 150, lineHeight: 1, color: free ? "#fff" : "#D9483E", letterSpacing: 2 }}>{price} €</div>
            <div style={{ fontFamily: pixelFont, fontWeight: 900, fontSize: 40, color: free ? "#fff" : INK, letterSpacing: 4, opacity: t > 1.9 ? 1 : 0 }}>PRO STUNDE</div>
          </div>
        </div>
        {/* wallet losing coins */}
        <div style={{ position: "absolute", left: 610, top: 470, transform: `scale(${back((t - 1.5) / 0.35)}) rotate(${t < 2.38 ? 6 * Math.sin(t * 30) * cl((t - 1.6) / 0.2) : 4}deg)`, filter: DIECUT(5) }}>
          <PxArt rows={WALLET} pal={{ K: INK, b: "#8A5A35", y: "#F2B92A" }} px={16} />
        </div>
        {t < 2.38 && [0, 1, 2, 3, 4, 5].map((i) => {
          const k = ((t - 1.62 - i * 0.12) % 0.7) / 0.7;
          if (t < 1.62 + i * 0.12) return null;
          return <PixelCoin key={i} x={720 + k * (180 + i * 30)} y={530 - Math.sin(k * Math.PI) * 160 + k * 260} px={6} phase={i} opacity={1 - k} />;
        })}
        {/* Claude badge */}
        <div style={{ position: "absolute", left: 600, top: 300, width: 400, height: 400, transform: `scale(${back((t - 2.38) / 0.45)})` }}>
          <div style={{ position: "absolute", inset: -60, background: "repeating-conic-gradient(rgba(255,222,150,.32) 0 10deg, transparent 10deg 24deg)", borderRadius: "50%", transform: `rotate(${t * 30}deg)`, maskImage: "radial-gradient(closest-side, #000 40%, transparent)" }} />
          <div style={{ position: "absolute", inset: 40, borderRadius: "50%", background: "#F4EFE5", border: `8px solid ${INK}`, boxShadow: "0 14px 0 rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", filter: DIECUT(6) }}>
            <Img src={staticFile("logos/claude.svg")} style={{ width: 200, height: 200, transform: `rotate(${t * 40}deg)` }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -10, textAlign: "center", fontFamily: claudeSerif, fontWeight: 600, fontSize: 70, color: "#F4EFE5", textShadow: `0 5px 0 ${INK}` }}>Claude</div>
        </div>
        {/* coach leaves, four helpers arrive */}
        <div style={{ opacity: 1 - coachOut, transform: `translateX(${-500 * coachOut}px)` }}>
          <Buddy kind="coach" x={330} floorY={FL} px={13} t={t} at={0.15} label="80 €/STD" seed={2} hop={0.4} />
        </div>
        {(["athletik", "physio", "kraft", "explosiv"] as const).map((k, i) => (
          <Buddy key={k} kind={k} x={110 + i * 170} floorY={FL} px={10} t={t} at={3.01 + i * 0.08} seed={i} hop={free ? 2.2 : 1} />
        ))}
        {[3.01, 3.09, 3.17, 3.25].map((a, i) => <Sparkle key={i} x={110 + i * 170} y={FL - 150} at={a} size={9} />)}
        <DieCutSir x={850} floorY={FL} px={6} lift={jump} pose={{ expr: sirExpr, blink: t % 2.7 < 0.09, armL: free ? 165 : t > 1.25 && t < 2.38 ? 140 : 20, armR: free ? 165 : t > 1.25 && t < 2.38 ? 140 : 20, hatLift: t > 1.25 && t < 1.6 ? 4 : 0 }} />
        {t >= 3.45 && <Stamp text="KOSTENLOS" x={540} y={820} at={3.45} color="#2FBF71" rot={-8} size={104} />}
        <FloorProps t={t} set={1} floor={FL} />
      </Drift>
      <Confetti at={3.45} x={540} y={800} n={70} />
      <CoinBurst at={3.47} x={540} y={850} n={18} />
      <AbsoluteFill style={{ background: "#fff", opacity: 0.55 * bounce(t, 3.45, 0.1) + 0.35 * bounce(t, 2.38, 0.08) }} />
    </AbsoluteFill>
  );
};

// ---------- S1 profile prompt ----------
const S1_PROMPT: PromptPart[] = [
  { at: 5.5, text: "Ziel: 5 kg Muskeln bis März.", key: "Ziel:", color: "#FFD27A" },
  { at: 6.25, text: " Zeit: 3× 45 Min pro Woche.", key: "Zeit:", color: "#A7E3FF" },
  { at: 6.95, text: " Knie links tut weh.", key: "Knie", color: "#FFB3B3" },
];
const S1_SEND = 7.48;
const S1_CLICKS: Click[] = [{ t: 4.85, n: 1, x: 470, y: 112, mx: 330, my: 84 }, { t: 5.32, n: 2, x: 300, y: 790, mx: 18, my: 545 }, { t: S1_SEND, n: 3, x: 975, y: 895, mx: 940, my: 735 }];
const S1: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Drift t={t} punches={[S1_SEND + 0.1]}>
      <WoodStage t={t} />
      <TypingDesk t={t} prompt={S1_PROMPT} sendAt={S1_SEND} letters="ZIELKNEZT35" />
      {[{ at: 5.65, label: "ZIEL", icon: "🎯", c: "#FFD27A" }, { at: 6.4, label: "ZEIT", icon: "⏱️", c: "#A7E3FF" }, { at: 7.1, label: "KNIE", icon: "🦵", c: "#FFB3B3" }].map((p, i) => (
        <Sticker key={i} x={760 + i * 100} y={STAGE_FLOOR - 245 + (i % 2) * 30} w={130} at={p.at} label={p.label} rot={[-6, 4, -3][i]}>
          <div style={{ height: 90, background: p.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 58 }}>{p.icon}</div>
        </Sticker>
      ))}
      <Sparkle x={980} y={600} at={S1_SEND + 0.05} size={10} />
      <ClaudeWindow t={t} enter={4.45} prompt={S1_PROMPT} sendAt={S1_SEND} focusAt={5.32} />
      <BarChip n={1} t={t} enter={4.45} />
      <ClickPath t={t} clicks={S1_CLICKS} start={{ t: 4.45, x: 760, y: 1500 }} />
      <FloorProps t={t} />
    </Drift>
    <Vignette />
  </AbsoluteFill>
);

// ---------- S2 equipment photo ----------
const S2_PROMPT: PromptPart[] = [
  { at: 8.9, text: "Das ist mein Equipment. ", key: "Equipment", color: "#A7E3FF" },
  { at: 9.75, text: "Plan fürs Wohnzimmer.", key: "Wohnzimmer", color: "#E3C8FF" },
];
const S2_ATTACH = 8.42;
const S2_SEND = 10.42;
const S2_CLICKS: Click[] = [{ t: 8.3, n: 1, x: 86, y: 872, mx: 20, my: 520 }, { t: S2_SEND, n: 2, x: 975, y: 895, mx: 940, my: 735 }];
const S2: React.FC<{ t: number }> = ({ t }) => {
  const hop = Math.abs(Math.sin(t * 5)) * 30;
  const flash = bounce(t, S2_ATTACH - 0.05, 0.09);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Drift t={t} punches={[S2_ATTACH, 10.11]}>
        <WoodStage t={t} />
        <DieCutSir x={190} floorY={STAGE_FLOOR} px={6} lift={t > 9.6 ? hop : 0} pose={{ expr: t > 9.6 ? "happy" : "normal", blink: t % 2.7 < 0.09, armL: t > 9.6 ? 150 : 20, armR: t < 9.0 ? 100 : 150 }} />
        <Sticker x={390} y={STAGE_FLOOR - 270} w={250} at={9.71} label="GYM" rot={-5}>
          <div style={{ height: 150, background: "#DCEBFF", display: "flex", alignItems: "center", justifyContent: "center" }}><PxArt rows={PROPS.rack.rows} pal={PROPS.rack.pal} px={11} /></div>
        </Sticker>
        <Sticker x={770} y={STAGE_FLOOR - 270} w={270} at={10.36} label="WOHNZIMMER" rot={4}>
          <div style={{ height: 150, background: "#F1E3FF", display: "flex", alignItems: "center", justifyContent: "center" }}><PxArt rows={PROPS.sofa.rows} pal={PROPS.sofa.pal} px={11} /></div>
        </Sticker>
        <div style={{ position: "absolute", left: 655, top: STAGE_FLOOR - 200, width: 110, height: 110, borderRadius: 55, background: "#E5534B", border: `6px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 52, color: "#fff", transform: `scale(${back((t - 10.11) / 0.3)}) rotate(${-8 + 6 * Math.sin(t * 8)}deg)`, filter: DIECUT(5) }}>VS</div>
        <ClaudeWindow t={t} enter={7.78} prompt={S2_PROMPT} sendAt={S2_SEND} focusAt={8.5}
          attach={{ at: S2_ATTACH, nodes: [<Photo key="a" bg="#DCEBFF" k="rack" px={6} />, <Photo key="b" bg="#F1E3FF" k="sofa" px={6} />] }} />
        <BarChip n={2} t={t} enter={7.78} />
        <ClickPath t={t} clicks={S2_CLICKS} start={{ t: 7.78, x: 700, y: 1500 }} />
        <FloorProps t={t} set={1} />
      </Drift>
      <AbsoluteFill style={{ background: "#fff", opacity: 0.6 * flash }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- S3 / S7 table ----------
const S3: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <TableShot t={t} mode={MODE_TRICK} />
    <StepChip n={3} t={t} at={11.09} />
  </AbsoluteFill>
);
const S7: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <TableShot t={t} mode={MODE_SUNDAY} />
    <StepChip n={7} t={t} at={28.68} />
  </AbsoluteFill>
);

// ---------- S4 exercise check ----------
const EX = [
  { name: "KNIEBEUGE", kind: "kraft" as const, ok: 19.1 },
  { name: "LIEGESTÜTZ", kind: "athletik" as const, ok: 19.4 },
  { name: "AUSFALLSCHRITT", kind: "physio" as const, ok: 19.7 },
  { name: "BOX-SPRUNG", kind: "explosiv" as const, ok: 20.0 },
];
const MAG = ["..KKKK....", ".KwwwwK...", "KwwccwwK..", "KwccccwK..", "KwwccwwK..", ".KwwwwK...", "..KKKKbb..", "......bbb.", ".......bbb", "........bb"];
const S4: React.FC<{ t: number }> = ({ t }) => {
  const FL = 1300;
  const fill = cl((t - 18.52) / (20.21 - 18.52));
  // magnifier glides from frame to frame just before each check
  const idx = Math.max(0, Math.min(3, EX.findIndex((e) => t < e.ok + 0.05)));
  const fx = (i: number) => 70 + (i % 2) * 490, fy = (i: number) => 330 + Math.floor(i / 2) * 320;
  const prevI = Math.max(0, idx - 1);
  const k = idx === 0 ? 1 : ease((t - EX[prevI].ok) / 0.22);
  const mx = fx(prevI) + (fx(idx) - fx(prevI)) * k + 300, my = fy(prevI) + (fy(idx) - fy(prevI)) * k + 150;
  const done = t >= 20.21;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Drift t={t} punches={[...EX.map((e) => e.ok), 20.21]}>
        <WoodStage t={t} top={150} floor={FL} plaque="ÜBUNGS-CHECK" lamps />
        {EX.map((e, i) => {
          const ok = t >= e.ok;
          const pop = back((t - 17.95 - i * 0.1) / 0.4);
          return (
            <div key={e.name} style={{ position: "absolute", left: fx(i), top: fy(i), width: 450, height: 290, transform: `scale(${pop}) rotate(${[-2, 2, 1.5, -1.5][i]}deg)` }}>
              {ok && <div style={{ position: "absolute", inset: -70, background: "repeating-conic-gradient(rgba(255,226,140,.35) 0 9deg, transparent 9deg 22deg)", borderRadius: "50%", transform: `rotate(${t * 40}deg) scale(${ease((t - e.ok) / 0.3)})`, maskImage: "radial-gradient(closest-side, #000 30%, transparent)" }} />}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#F2D483,#B98F3A)", border: `6px solid ${INK}`, borderRadius: 14, boxShadow: "0 10px 0 rgba(0,0,0,.35)", padding: 14 }}>
                <div style={{ position: "relative", width: "100%", height: 200, background: ok ? "#E8F8EE" : "#FBEAEA", border: `5px solid ${INK}`, borderRadius: 8, overflow: "hidden" }}>
                  <Buddy kind={e.kind} x={210} floorY={180} px={8} t={t} seed={i} hop={ok ? 1.6 : 0.3} />
                </div>
                <div style={{ marginTop: 8, textAlign: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: "#2A1F0E" }}>{e.name}</div>
              </div>
              <div style={{ position: "absolute", right: -18, top: -18, width: 84, height: 84, borderRadius: 42, background: ok ? "#2FBF71" : "#E5534B", border: "6px solid #fff", boxShadow: "0 6px 0 rgba(0,0,0,.35)", color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ok ? back((t - e.ok) / 0.3) : 1})` }}>{ok ? "✓" : "✗"}</div>
              <Sparkle x={420} y={10} at={e.ok} size={9} />
            </div>
          );
        })}
        {/* fit bar */}
        <div style={{ position: "absolute", left: 90, right: 90, top: 1000, height: 96, background: "#1B120C", border: `6px solid ${INK}`, borderRadius: 50, boxShadow: "0 8px 0 rgba(0,0,0,.4)", overflow: "hidden", transform: `scale(${back((t - 18.3) / 0.4)})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: done ? "linear-gradient(#7BE7A5,#2FBF71)" : "linear-gradient(#FFB36B,#E8743A)", borderRadius: 50 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 3, textShadow: `0 4px 0 ${INK}` }}>KÖRPER-FIT {Math.round(fill * 100)} %</div>
        </div>
        <div style={{ position: "absolute", left: mx, top: my, transform: `rotate(${-10 + 6 * Math.sin(t * 7)}deg)`, filter: DIECUT(5), opacity: t < 20.25 ? cl((t - 18.4) / 0.2) : 1 - cl((t - 20.25) / 0.2) }}>
          <PxArt rows={MAG} pal={{ K: INK, w: "#D5F1FF", c: "#FFFFFF", b: "#8A5A35" }} px={14} />
        </div>
        <DieCutSir x={880} floorY={FL} px={4.6} lift={done ? 70 * Math.sin(cl((t - 20.21) / 0.6) * Math.PI) : 0} pose={{ expr: done ? "happy" : "normal", blink: t % 2.7 < 0.09, armL: 20, armR: done ? 170 : 120 }} />
        <PropSticker k="dumbbell" x={90} y={FL - 90} px={10} r={-6} t={t} />
        <PropSticker k="kettle" x={300} y={FL - 110} px={11} r={5} t={t} bob={6} />
        {done && <Stamp text="PASST ✓" x={540} y={760} at={20.21} color="#2FBF71" rot={-7} size={110} />}
      </Drift>
      <Confetti at={20.21} x={540} y={700} n={50} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- S5 form check ----------
const S5_PROMPT: PromptPart[] = [{ at: 21.75, text: "Check meine Kniebeuge.", key: "Kniebeuge", color: "#FFD27A" }];
const S5_ATTACH = 21.42;
const S5_SEND = 22.4;
const S5_CLICKS: Click[] = [{ t: 21.3, n: 1, x: 86, y: 872, mx: 20, my: 520 }, { t: S5_SEND, n: 2, x: 975, y: 895, mx: 940, my: 735 }];
const S5: React.FC<{ t: number }> = ({ t }) => {
  const squat = Math.round(3 * Math.abs(Math.sin((t - 20.78) * 2.6)));
  const fixed = t >= 24.21;
  const sx = 540, FL = STAGE_FLOOR;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Drift t={t} punches={[S5_ATTACH, 24.21]}>
        <WoodStage t={t} />
        {/* viewfinder around the squatting Sir Token */}
        <div style={{ position: "absolute", left: sx - 250, top: PANEL_H + 20, width: 500, height: FL - PANEL_H + 10 }}>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
            <div key={i} style={{ position: "absolute", left: a ? undefined : 0, right: a ? 0 : undefined, top: b ? undefined : 0, bottom: b ? 0 : undefined, width: 60, height: 60, borderLeft: a ? undefined : "8px solid #fff", borderRight: a ? "8px solid #fff" : undefined, borderTop: b ? undefined : "8px solid #fff", borderBottom: b ? "8px solid #fff" : undefined }} />
          ))}
          <div style={{ position: "absolute", left: 20, top: 16, display: "flex", alignItems: "center", gap: 8, fontFamily: pixelFont, fontWeight: 900, fontSize: 28, color: "#fff" }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: "#E5534B", opacity: Math.floor(t * 2) % 2 ? 1 : 0.2 }} />REC
          </div>
        </div>
        <DieCutSir x={sx} floorY={FL} px={5.6} pose={{ expr: fixed ? "happy" : "normal", blink: t % 2.7 < 0.09, squat, armL: 90, armR: 90 }} />
        {[-1, 1].map((s) => (
          <div key={s} style={{ position: "absolute", left: sx + s * 58 - 34, top: FL - 70 - squat * 5.6, width: 68, height: 68, borderRadius: 34, border: `7px solid ${fixed ? "#2FBF71" : "#E5534B"}`, boxShadow: `0 0 ${fixed ? 26 : 16}px ${fixed ? "#2FBF71" : "#E5534B"}`, opacity: t > 23.9 ? 1 : 0, transform: `scale(${1 + 0.15 * Math.sin(t * 10)})` }} />
        ))}
        {/* arrows pushing knees out after the fix */}
        {fixed && [-1, 1].map((s) => <div key={s} style={{ position: "absolute", left: sx + s * 130 - 30, top: FL - 90, fontFamily: pixelFont, fontWeight: 900, fontSize: 60, color: "#2FBF71", textShadow: `0 4px 0 ${INK}`, transform: `translateX(${s * 14 * Math.abs(Math.sin(t * 6))}px)` }}>{s < 0 ? "←" : "→"}</div>)}
        <Buddy kind="physio" x={900} floorY={FL} px={8} t={t} at={22.85} seed={1} label="PHYSIO" hop={0.6} />
        <PropSticker k="mat" x={60} y={FL - 30} px={11} r={-3} t={t} />
        <ClaudeWindow t={t} enter={20.78} prompt={S5_PROMPT} sendAt={S5_SEND} focusAt={21.6}
          attach={{ at: S5_ATTACH, nodes: [<SquatPhoto key="q" />] }}
          reply={{ at: 22.85, name: "PHYSIO", avatar: "#5CC08A", text: "Deine Knie kippen nach innen. Füße etwas breiter, Gewicht auf die Fersen.", hl: [{ word: "Knie", color: "#FFB3B3" }, { word: "Fersen", color: "#B8F0CF" }] }} />
        <BarChip n={5} t={t} enter={20.78} />
        <ClickPath t={t} clicks={S5_CLICKS} start={{ t: 20.78, x: 700, y: 1500 }} />
        <FloorProps t={t} />
      </Drift>
      <AbsoluteFill style={{ background: "#fff", opacity: 0.6 * bounce(t, S5_ATTACH - 0.05, 0.09) }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- S6 training app ----------
const S6_PROMPT: PromptPart[] = [
  { at: 25.45, text: "Bau mir daraus eine Trainings-App ", key: "Trainings-App", color: "#C9B6FF" },
  { at: 26.25, text: "mit Timer und Häkchen.", key: "Timer", color: "#FFD27A" },
];
const S6_SEND = 26.8;
const S6_CLICKS: Click[] = [{ t: 25.3, n: 1, x: 300, y: 790, mx: 18, my: 545 }, { t: S6_SEND, n: 2, x: 975, y: 895, mx: 940, my: 735 }];
const APP_ITEMS = ["Kniebeuge 3×10", "Liegestütz 3×12", "Ausfallschritt 3×8", "Box-Sprung 3×6"];
const S6: React.FC<{ t: number }> = ({ t }) => {
  const slide = back((t - 26.84) / 0.5);
  const timer = cl((t - 27.64) / 3);
  const secs = Math.max(0, 45 - Math.floor((t - 27.64) * 6));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Drift t={t} punches={[S6_SEND + 0.1, 27.64, 28.13]}>
        <WoodStage t={t} />
        <TypingDesk t={t} prompt={S6_PROMPT} sendAt={S6_SEND} letters="APPTIMER✓" sirX={200} kbX={330} />
        <ClaudeWindow t={t} enter={24.92} prompt={S6_PROMPT} sendAt={S6_SEND} focusAt={25.32} />
        <BarChip n={6} t={t} enter={24.92} />
        <ClickPath t={t} clicks={S6_CLICKS} start={{ t: 24.92, x: 700, y: 1500 }} />
        {/* artifact phone */}
        <div style={{ position: "absolute", left: 590, top: 470, width: 430, height: 820, transform: `translateX(${(1 - slide) * 600}px) rotate(${4 - 2 * slide}deg)`, filter: DIECUT(7) }}>
          <div style={{ position: "absolute", inset: 0, background: INK, borderRadius: 56, padding: 18 }}>
            <div style={{ width: "100%", height: "100%", background: "#F4EFE5", borderRadius: 40, overflow: "hidden", position: "relative" }}>
              <div style={{ background: CLAUDE_ORANGE, color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 34, padding: "36px 24px 16px", letterSpacing: 1 }}>MEIN TRAINING</div>
              <div style={{ position: "relative", width: 230, height: 230, margin: "20px auto 6px", transform: `scale(${1 + 0.08 * bounce(t, 27.64, 0.25)})` }}>
                <svg width="230" height="230" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#E2D9C8" strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="42" stroke={CLAUDE_ORANGE} strokeWidth="10" fill="none" strokeDasharray={`${264 * (t >= 27.64 ? 1 - timer : 1)} 264`} transform="rotate(-90 50 50)" strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: 56, color: INK }}>0:{String(secs).padStart(2, "0")}</div>
              </div>
              {APP_ITEMS.map((it, i) => {
                const on = t >= 28.13 + i * 0.12;
                return (
                  <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 22px", padding: "10px 14px", background: on ? "#E3F6EA" : "#fff", border: `4px solid ${INK}`, borderRadius: 14, fontFamily: pixelFont, fontWeight: 800, fontSize: 27, color: INK, transform: `scale(${back((t - 27.0 - i * 0.08) / 0.3)})` }}>
                    <span style={{ width: 38, height: 38, borderRadius: 8, border: "4px solid #2FBF71", background: on ? "#2FBF71" : "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, transform: `scale(${on ? back((t - 28.13 - i * 0.12) / 0.25) : 1})` }}>{on ? "✓" : ""}</span>
                    {it}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ position: "absolute", left: -40, top: -36, padding: "8px 20px", borderRadius: 30, background: "#C9B6FF", border: `5px solid ${INK}`, fontFamily: pixelFont, fontWeight: 900, fontSize: 30, color: INK, transform: `rotate(-8deg) scale(${back((t - 27.1) / 0.3)})` }}>DEINE APP</div>
        </div>
        {[0, 1, 2, 3].map((i) => <Sparkle key={i} x={640 + rnd(i + 3) * 330} y={600 + rnd(i + 9) * 600} at={28.13 + i * 0.12} size={9} />)}
        <FloorProps t={t} set={1} />
      </Drift>
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- S8 CTA ----------
const S8: React.FC<{ t: number }> = ({ t }) => {
  const FL = 1320;
  const sent = 33.47 + 0.4 + "TRAINER".length / 10;
  const plane = cl((t - sent) / 0.9);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Drift t={t} punches={[33.47, sent]}>
        <WoodStage t={t} top={130} floor={FL} lamps />
        <Checklist title="DER 4-TRAINER-PROMPT" items={["Ziel, Zeit, Schmerzen", "Equipment-Foto", "4 Trainer am Tisch", "Übungs-Check", "Form-Check per Foto", "Deine Trainings-App", "Sonntags-Check-in"]} x={80} y={150} w={920} at={31.85} theme={th} tickEvery={0.17} />
        <CommentCard keyword="TRAINER" at={33.47} y={860} theme={th} />
        {t > sent && <div style={{ position: "absolute", left: 900 + plane * 300, top: 900 - plane * 700, fontSize: 90, transform: `rotate(${-30 + plane * 20}deg)`, opacity: 1 - cl((plane - 0.8) / 0.2), filter: DIECUT(4) }}>✈️</div>}
        {(["athletik", "physio", "kraft", "explosiv"] as const).map((k, i) => <Buddy key={k} kind={k} x={110 + i * 165} floorY={FL} px={9} t={t} at={32.0 + i * 0.08} seed={i} hop={t > sent ? 2.4 : 1} />)}
        <DieCutSir x={870} floorY={FL} px={5.4} lift={t > sent && t < sent + 0.7 ? 90 * Math.sin(((t - sent) / 0.7) * Math.PI) : 0} pose={{ expr: "happy", blink: t % 2.7 < 0.09, armL: 20, armR: Math.round((130 + 25 * Math.sin(t * 9)) / 5) * 5 }} />
        {t > 34.7 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1590 + 18 * Math.abs(Math.sin(t * 5)), textAlign: "center", transform: `scale(${back((t - 34.7) / 0.4)})` }}>
            <span style={{ display: "inline-block", padding: "18px 40px", borderRadius: 60, background: CLAUDE_ORANGE, border: `6px solid ${INK}`, boxShadow: "0 9px 0 rgba(0,0,0,.4)", fontFamily: pixelFont, fontWeight: 900, fontSize: 64, color: "#fff", letterSpacing: 2 }}>KOMMENTIER „TRAINER“ ↓</span>
          </div>
        )}
      </Drift>
      {t > sent && Array.from({ length: 22 }).map((_, i) => {
        const k = (t - sent - rnd(i) * 1.5) * 0.9;
        if (k < 0) return null;
        return <PixelCoin key={i} x={40 + rnd(i + 3) * 1000} y={-60 + ((k * 1300) % 2100)} px={6} phase={i} />;
      })}
      <Confetti at={sent} x={540} y={900} n={70} />
      <Vignette />
    </AbsoluteFill>
  );
};

const SCENES: React.FC<{ t: number }>[] = [S0, S1, S2, S3, S4, S5, S6, S7, S8];

// ---------- transitions ----------
const Shot: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const a = CUTS[i], b = CUTS[i + 1];
  if (t < a - D || t > b + D) return null;
  const Scene = SCENES[i];
  const inP = i > 0 ? cl((t - (a - D)) / (2 * D)) : 1;
  const outP = i < SCENES.length - 1 ? cl((t - (b - D)) / (2 * D)) : 0;
  const zoomIn = i > 0 && (IS3D[i] || IS3D[i - 1]);
  const zoomOut = i < SCENES.length - 1 && (IS3D[i] || IS3D[i + 1]);
  let tf = "", op = 1, blur = 0;
  if (inP < 1) {
    if (zoomIn) { tf += ` scale(${1.35 - 0.35 * ease(inP)})`; op = ease(inP); blur += (1 - inP) * 10; }
    else { tf += ` translateX(${(1 - ease(inP)) * 1080}px) rotate(${(1 - ease(inP)) * 3}deg)`; blur += (1 - inP) * 14; }
  }
  if (outP > 0) {
    if (zoomOut) { tf += ` scale(${1 + 0.9 * outP * outP})`; blur += outP * 12; }
    else { tf += ` translateX(${-ease(outP) * 1080}px) rotate(${-ease(outP) * 3}deg)`; blur += outP * 14; }
  }
  return (
    <AbsoluteFill style={{ transform: tf || undefined, opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      <Scene t={t} />
    </AbsoluteFill>
  );
};

// ---------- audio ----------
type Sfx = [string, number, number];
const SFX: Sfx[] = [
  ...CUTS.slice(1, -1).map((c): Sfx => ["whoosh-quick", c - 0.16, 0.5]),
  ["riser", 10.45, 0.3], ["riser", 28.05, 0.3],
  ...[0.2, 1.2, 1.5, 2.38, 3.01, 3.09, 3.17, 3.25, 4.55, 5.65, 6.4, 7.1, 7.88, 9.71, 10.36, 14.3, 15.05, 15.55, 16.25, 18.0, 18.3, 20.88, 22.85, 25.0, 26.84, 27.1, 31.85, 32.0, 33.47].map((a): Sfx => ["ui-pop", a, 0.4]),
  ...[4.85, 5.32, S1_SEND, 8.3, S2_SEND, 21.3, S5_SEND, 25.3, S6_SEND].map((a): Sfx => ["click", a, 0.55]),
  ...[S2_ATTACH, S5_ATTACH].map((a): Sfx => ["click", a, 0.8]),
  ...[5.5, 6.25, 6.95, 8.9, 9.75, 21.75, 25.45, 26.25].map((a): Sfx => ["typing", a, 0.22]),
  ...[1.62, 1.85, 2.05, 3.5, 7.55, 17.15, 31.37, 34.7, 34.9].map((a): Sfx => ["coin", a, 0.22]),
  ...[3.45, 10.11, 13.1, 20.21, 31.1].map((a): Sfx => ["stamp", a, 0.5]),
  ...[...EX.map((e) => e.ok), 24.21, 28.13, 28.25, 28.37, 28.49, ...[0, 1, 2, 3, 4, 5, 6].map((k) => 32.15 + k * 0.17), 34.57].map((a): Sfx => ["check", a, 0.36]),
  ...[3.45, 17.05, 20.21, 24.21, 31.27].map((a): Sfx => ["chime", a, 0.33]),
  ["jump", 3.45, 0.25], ["jump", 7.5, 0.2], ["jump", 20.25, 0.2], ["jump", 34.6, 0.2],
  ["powerup", 17.05, 0.28], ["powerup", 34.6, 0.3], ["bump", 2.38, 0.35],
];

export const TrainerReelV2: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const flash = Math.max(...CUTS.slice(1, -1).map((c, i) => (IS3D[i] || IS3D[i + 1] ? bounce(t, c, 0.12) : 0)));
  return (
    <AbsoluteFill style={{ background: "#1A100C", overflow: "hidden", fontFamily: pixelFont }}>
      {SCENES.map((_, i) => <Shot key={i} i={i} t={t} />)}
      <AbsoluteFill style={{ background: "#FFF6E5", opacity: 0.75 * flash, pointerEvents: "none" }} />
      <PillCaptions words={words as Word[]} theme={th} />
      <Audio src={staticFile("sirtoken/voice.mp3")} />
      <Audio src={staticFile("sirtoken/music.mp3")} volume={0.085} loop />
      {SFX.map(([n, at, v], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * 30))} durationInFrames={90}>
          <Audio src={staticFile(`sirtoken/sfx-${n}.mp3`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
