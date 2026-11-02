import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Logo } from "../components/PanelKit";
import captionsJson from "../../runs/gpt-zinsen/captions.json";

// @florentgpt brand test "C · volle Markenfarbe" (Henri 2026-10-15: the GPT edit looked cheap).
// One brand colour (violet, same family as the Florent GPT guide #7C3AED), white type, white cards,
// no gold coins / slot reels / glow. Caption = white pill with violet text, sentence case, on the seam.
// Test only: re-builds the Zinsen reel (runs/gpt-zinsen) on the tightened timeline; nothing in the pipeline uses it yet.

const { fontFamily: tight } = loadInterTight("normal", { weights: ["700", "800", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const BRAND_C = {
  violet: "#6D28D9",
  violetDeep: "#5B21B6",
  violetSoft: "#7C3AED",
  lavender: "#DDD0FB",
  ink: "#16112A",
  dim: "#6E6987",
  line: "#ECE8F6",
  white: "#FFFFFF",
};
const C = BRAND_C;

const HW = 1080;
const HH = 1920;
const PH = Math.round(HH * 0.52);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

type Word = { text: string; startMs: number; endMs: number };
const WORDS = captionsJson as Word[];
const AVATAR = { src: "render-gpt-zinsen-tightened.mp4", focus: { x: 0.448, y: 0.641 }, scale: 1.08, faceAt: 0.57 };

const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (atSec: number) => spring({ frame: frame - Math.round(atSec * fps), fps, config: { damping: 15, stiffness: 190, mass: 0.7 } });
};

// ---------- building blocks ----------

const Wordmark: React.FC = () => (
  <div style={{ position: "absolute", left: 64, top: 64, display: "flex", alignItems: "center", gap: 14, zIndex: 20 }}>
    <div style={{ width: 44, height: 44, borderRadius: 13, background: C.white, color: C.violet, fontFamily: tight, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>F</div>
    <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 28, letterSpacing: 5, color: C.white }}>FLORENT GPT</span>
  </div>
);

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: C.white, borderRadius: 36, boxShadow: "0 24px 60px rgba(30,10,80,0.28)", ...style }}>{children}</div>
);

const Check: React.FC<{ size?: number; inverted?: boolean }> = ({ size = 56, inverted }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: inverted ? C.white : C.violet, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke={inverted ? C.violet : C.white} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const Chip: React.FC<{ text: string; a: number }> = ({ text, a }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.white, borderRadius: 999, padding: "16px 30px 16px 16px", transform: `scale(${a})`, opacity: Math.min(1, a * 2), boxShadow: "0 14px 34px rgba(30,10,80,0.25)" }}>
    <Check size={54} />
    <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 40, color: C.ink, letterSpacing: -0.5 }}>{text}</span>
  </div>
);

const Step: React.FC<{ n: number; text: string; a: number }> = ({ n, text, a }) => (
  <div style={{ position: "absolute", left: 64, top: 150, display: "flex", alignItems: "center", gap: 22, opacity: Math.min(1, a * 2), transform: `translateY(${(1 - a) * 30}px)` }}>
    <div style={{ width: 86, height: 86, borderRadius: 26, background: C.white, color: C.violet, fontFamily: tight, fontWeight: 900, fontSize: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
    <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 64, color: C.white, letterSpacing: -1.5 }}>{text}</span>
  </div>
);

const Bar: React.FC<{ label: string; value: string; fill: number; muted?: boolean }> = ({ label, value, fill, muted }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
      <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 46, color: muted ? C.dim : C.ink, letterSpacing: -1 }}>{label}</span>
      <span style={{ fontFamily: tight, fontWeight: 900, fontSize: 72, color: muted ? C.dim : C.violet, letterSpacing: -2, lineHeight: 1 }}>{value}</span>
    </div>
    <div style={{ height: 30, borderRadius: 15, background: C.line, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(fill * 100, muted ? 2.5 : 0)}%`, height: "100%", borderRadius: 15, background: muted ? "#C9C4D9" : C.violet }} />
    </div>
  </div>
);

// ---------- split frame: violet panel on top, speaker below ----------

const Split: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const s0 = AVATAR.scale;
  const f = AVATAR.focus;
  const h0 = HH - PH;
  const vw = HW * s0, vh = HH * s0;
  const left = Math.min(0, Math.max(HW - vw, HW / 2 - f.x * vw));
  const top = Math.min(0, Math.max(h0 - vh, h0 * AVATAR.faceAt - f.y * vh));
  return (
    <AbsoluteFill style={{ background: C.violet, overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top: PH + top, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile(AVATAR.src)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: PH, overflow: "hidden", background: `radial-gradient(120% 90% at 85% 0%, ${C.violetSoft} 0%, ${C.violet} 55%, ${C.violetDeep} 100%)` }}>
        <Wordmark />
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ---------- scenes (times relative to the window start, from the Zinsen props b[]) ----------

const HookScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(0.25);
  const k = ez(t, 0.5, 1.6);
  return (
    <>
      <div style={{ position: "absolute", left: 64, right: 64, top: 160, fontFamily: tight, fontWeight: 900, fontSize: 104, lineHeight: 1.0, letterSpacing: -3.5, color: C.white }}>
        Dein Girokonto<br />zahlt dir <span style={{ background: C.white, color: C.violet, borderRadius: 18, padding: "0 18px" }}>null.</span>
      </div>
      <Card style={{ position: "absolute", left: 64, right: 64, top: 480, padding: "38px 44px 44px", transform: `translateY(${(1 - card) * 500}px)` }}>
        <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 30, color: C.dim, marginBottom: 26 }}>Zinsen auf 10.000 € · Beispiel</div>
        <Bar label="Girokonto" value="0 €" fill={0} muted />
        <div style={{ height: 34 }} />
        <Bar label="Tagesgeld" value={`${Math.round(200 * k)} €`} fill={0.82 * k} />
      </Card>
    </>
  );
};

const GiroScene: React.FC<{ t: number }> = () => {
  const sp = useSp();
  return (
    <>
      <div style={{ position: "absolute", left: 64, top: 170, fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.lavender }}>Zins auf dem Girokonto</div>
      <div style={{ position: "absolute", left: 50, top: 220, fontFamily: tight, fontWeight: 900, fontSize: 380, letterSpacing: -18, color: C.white, lineHeight: 1, transform: `scale(${sp(0.2)})`, transformOrigin: "0 50%" }}>0 %</div>
      <div style={{ position: "absolute", left: 64, top: 650, fontFamily: tight, fontWeight: 800, fontSize: 52, color: C.white, letterSpacing: -1 }}>bei den meisten Banken</div>
    </>
  );
};

const TagesgeldScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const b = [0.49, 3.31, 3.77, 4.45];
  const p = ez(t, b[0] + 0.3, b[1] + 0.2);
  return (
    <>
      <div style={{ position: "absolute", left: 64, top: 160, fontFamily: tight, fontWeight: 900, fontSize: 74, color: C.white, letterSpacing: -2, opacity: Math.min(1, sp(0.1) * 2) }}>Tagesgeld statt Girokonto</div>
      <Card style={{ position: "absolute", left: 64, right: 64, top: 300, padding: "38px 44px 44px", transform: `translateY(${(1 - sp(b[0])) * 500}px)` }}>
        <Bar label="Girokonto" value="0 %" fill={0} muted />
        <div style={{ height: 34 }} />
        <Bar label="Tagesgeld" value={`über ${(2 * p).toLocaleString("de-DE", { maximumFractionDigits: 0 })} %`} fill={0.8 * p} />
      </Card>
      <div style={{ position: "absolute", left: 64, right: 64, top: 760, display: "flex", gap: 22 }}>
        <Chip text="dauerhaft" a={sp(b[2])} />
        <Chip text="nicht nur Neukunden" a={sp(b[3])} />
      </div>
    </>
  );
};

const RechnungScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const b = [0.74, 1.45, 2.07];
  const n = Math.round(200 * ez(t, b[0], b[0] + 0.7));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, fontFamily: tight, fontWeight: 800, fontSize: 52, color: C.white }}>
        <span style={{ border: `4px solid ${C.white}`, borderRadius: 999, padding: "8px 30px" }}>10.000 €</span>
        <span>×</span>
        <span style={{ border: `4px solid ${C.white}`, borderRadius: 999, padding: "8px 30px" }}>2 %</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: tight, fontWeight: 900, fontSize: 330, letterSpacing: -16, color: C.white, lineHeight: 1 }}>{n} €</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontFamily: inter, fontWeight: 600, fontSize: 38, color: C.lavender, opacity: ez(t, b[1], b[1] + 0.3) }}>rund pro Jahr · Beispiel</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.white, color: C.violet, fontFamily: tight, fontWeight: 900, fontSize: 64, letterSpacing: -1.5, borderRadius: 24, padding: "14px 40px", transform: `scale(${sp(b[2])}) rotate(-3deg)` }}>fürs Nichtstun</div>
      </div>
    </>
  );
};

const Q = "Such mir Tagesgeldkonten mit dem höchsten Zins, der auch nach der Aktion bleibt, und mit Einlagensicherung.";
const PromptScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const e = 4.5;
  const typed = Q.slice(0, Math.floor(Q.length * interpolate(t, [0, e], [0, 1], clamp)));
  const chips = [["höchster Zins", 0.25], ["bleibt nach der Aktion", 0.55], ["Einlagensicherung", 0.92]] as const;
  return (
    <>
      <Step n={2} text="Prompt schreiben" a={sp(0)} />
      <Card style={{ position: "absolute", left: 64, right: 64, top: 290, padding: "30px 34px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Logo name="openai" size={46} tile={false} />
          <span style={{ fontFamily: inter, fontWeight: 600, fontSize: 30, color: C.dim }}>ChatGPT · Websuche an</span>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 40, lineHeight: 1.32, color: C.ink, minHeight: 160 }}>{typed}<span style={{ color: C.violet, opacity: Math.floor(t * 3) % 2 }}>|</span></div>
      </Card>
      <div style={{ position: "absolute", left: 64, right: 64, top: 690, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {chips.map(([x, f]) => <Chip key={x} text={x} a={sp(e * f)} />)}
      </div>
    </>
  );
};

const SCENES: { start: number; end: number; C: React.FC<{ t: number }> }[] = [
  { start: 0, end: 4.7, C: HookScene },
  { start: 5.4, end: 7.4, C: GiroScene },
  { start: 9.8, end: 15.5, C: TagesgeldScene },
  { start: 16.4, end: 19.0, C: RechnungScene },
  { start: 23.4, end: 28.1, C: PromptScene },
];

// ---------- caption: white pill, violet text, sentence case, one word ----------

const HOLD_GAP_MS = 350;
const Caption: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const i = WORDS.findIndex((w, k) => nowMs >= w.startMs && nowMs < Math.min(WORDS[k + 1]?.startMs ?? Infinity, w.endMs + HOLD_GAP_MS));
  if (i === -1) return null;
  const w = WORDS[i];
  const local = frame - Math.round((w.startMs / 1000) * fps);
  const scale = interpolate(local, [0, 3], [1.1, 1], clamp);
  const text = w.text.replace(/[,;:.!?]+$/, "");
  const fontSize = text.length > 14 ? Math.round((76 * 14) / text.length) : 76;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: "translateY(-50%)", zIndex: 50 }}>
      <div style={{ background: C.white, color: C.violet, fontFamily: tight, fontWeight: 900, fontSize, letterSpacing: -fontSize * 0.02, borderRadius: 999, padding: `${fontSize * 0.16}px ${fontSize * 0.5}px`, boxShadow: "0 12px 30px rgba(20,8,60,0.35)", transform: `scale(${scale})`, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

export const GptBrandCTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = SCENES.find((x) => t >= x.start && t < x.end);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {s ? (
        <Split>
          <s.C t={t - s.start} />
        </Split>
      ) : (
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(AVATAR.src)} muted style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
      )}
      <Caption y={s ? PH : HH * 0.74} />
    </AbsoluteFill>
  );
};
