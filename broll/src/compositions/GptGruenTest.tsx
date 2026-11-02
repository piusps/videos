import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Logo } from "../components/PanelKit";
import captionsJson from "../../runs/gpt-zinsen/captions.json";

// @florentgpt test "Weiß + Dunkelgrün" (Henri 2026-10-15): photos read as stock, violet reads as AI slop.
// White as the base, one deep green as the main colour (darker than boilr #0A5F45 so the accounts stay apart),
// no photos, no gradients, no glow. Motion: odometer counters, bars, drawn checks, pop-ins, a slow ledger-line drift.
// Test only on runs/gpt-zinsen (tightened timeline).

const { fontFamily: tight } = loadInterTight("normal", { weights: ["700", "800", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

const C = { green: "#0B3D2C", greenMid: "#1F6B50", tint: "#EAF2EE", line: "#DCE8E2", ink: "#0B1F18", dim: "#5E716A", white: "#FFFFFF" };
const HW = 1080;
const HH = 1920;
const PH = Math.round(HH * 0.52);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin((Math.PI * (t - at)) / d));

type Word = { text: string; startMs: number; endMs: number };
const WORDS = captionsJson as Word[];
const AVATAR = { src: "render-gpt-zinsen-tightened.mp4", focus: { x: 0.448, y: 0.641 }, scale: 1.08, faceAt: 0.57 };

const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (atSec: number, damping = 14) => spring({ frame: frame - Math.round(atSec * fps), fps, config: { damping, stiffness: 200, mass: 0.7 } });
};

// ---------- odometer: every digit rolls, carries roll only during the last unit ----------

const Odometer: React.FC<{ value: number; size: number; color?: string; suffix?: string; decimals?: number }> = ({ value, size, color = C.green, suffix = "", decimals = 0 }) => {
  const scaled = Math.max(0, value) * 10 ** decimals;
  const digits = Math.max(1 + decimals, String(Math.floor(scaled)).length);
  const places = Array.from({ length: digits }, (_, i) => digits - 1 - i);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: tight, fontWeight: 900, fontSize: size, color, letterSpacing: -size * 0.04, lineHeight: 1 }}>
      {places.map((p) => {
        const unit = 10 ** p;
        const base = Math.floor(scaled / unit) % 10;
        const roll = p === 0 ? scaled - Math.floor(scaled) : Math.min(1, Math.max(0, (scaled % unit) - (unit - 1)));
        return (
          <React.Fragment key={p}>
            {decimals > 0 && p === decimals - 1 ? <span>,</span> : null}
            <div style={{ height: size, overflow: "hidden", width: size * 0.6 }}>
              <div style={{ transform: `translateY(${-(base + roll) * size}px)` }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => <div key={k} style={{ height: size, textAlign: "center" }}>{d}</div>)}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {suffix ? <span style={{ marginLeft: size * 0.12 }}>{suffix}</span> : null}
    </div>
  );
};

// ---------- building blocks ----------

const Wordmark: React.FC = () => (
  <div style={{ position: "absolute", left: 60, top: 60, display: "flex", alignItems: "center", gap: 12, zIndex: 30 }}>
    <div style={{ width: 40, height: 40, borderRadius: 11, background: C.green, color: C.white, fontFamily: tight, fontWeight: 900, fontSize: 27, display: "flex", alignItems: "center", justifyContent: "center" }}>F</div>
    <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 25, letterSpacing: 4, color: C.green }}>FLORENT GPT</span>
  </div>
);

/** White paper with faint ledger lines drifting up: motion without decoration. */
const Paper: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -80, bottom: -80, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 78px, ${C.tint} 78px 80px)`, transform: `translateY(${-(t * 24) % 80}px)` }} />
  </AbsoluteFill>
);

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: C.white, borderRadius: 32, border: `3px solid ${C.green}`, boxShadow: `10px 10px 0 ${C.green}`, ...style }}>{children}</div>
);

const Check: React.FC<{ size?: number; p?: number; inverted?: boolean }> = ({ size = 52, p = 1, inverted }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: inverted ? C.white : C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke={inverted ? C.green : C.white} strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>
  </div>
);

const Chip: React.FC<{ text: string; t: number; at: number }> = ({ text, t, at }) => {
  const sp = useSp();
  const a = sp(at, 11);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.green, borderRadius: 999, padding: "14px 30px 14px 14px", transform: `scale(${a})`, opacity: Math.min(1, a * 2) }}>
      <Check size={50} p={ez(t, at + 0.1, at + 0.4)} inverted />
      <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 38, color: C.white, letterSpacing: -0.5 }}>{text}</span>
    </div>
  );
};

const Bar: React.FC<{ label: string; fill: number; muted?: boolean; t: number; children: React.ReactNode }> = ({ label, fill, muted, t, children }) => {
  const shimmer = ((t * 0.9) % 1.3) / 1.3;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 46, color: muted ? C.dim : C.ink, letterSpacing: -1 }}>{label}</span>
        {children}
      </div>
      <div style={{ height: 28, borderRadius: 14, background: C.tint, overflow: "hidden" }}>
        <div style={{ position: "relative", width: `${Math.max(fill * 100, muted ? 2.5 : 0)}%`, height: "100%", borderRadius: 14, background: muted ? "#C7D3CE" : C.green, overflow: "hidden" }}>
          {!muted ? <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", left: `${-30 + shimmer * 160}%`, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)" }} /> : null}
        </div>
      </div>
    </div>
  );
};

// ---------- split frame ----------

const Split: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const s0 = AVATAR.scale;
  const f = AVATAR.focus;
  const h0 = HH - PH;
  const vw = HW * s0, vh = HH * s0;
  const left = Math.min(0, Math.max(HW - vw, HW / 2 - f.x * vw));
  const top = Math.min(0, Math.max(h0 - vh, h0 * AVATAR.faceAt - f.y * vh));
  return (
    <AbsoluteFill style={{ background: C.white, overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top: PH + top, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile(AVATAR.src)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: PH, overflow: "hidden" }}>
        <Paper t={t} />
        <Wordmark />
        {children}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PH - 4, height: 8, background: C.green }} />
    </AbsoluteFill>
  );
};

// ---------- scenes (t = seconds since window start; beat times from the Zinsen props) ----------

const HookScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(0.35);
  const k = ez(t, 0.8, 2.4, Easing.inOut(Easing.cubic));
  const land = bump(t, 2.4, 0.3);
  return (
    <>
      <div style={{ position: "absolute", left: 60, right: 60, top: 150, fontFamily: tight, fontWeight: 900, fontSize: 100, lineHeight: 1.0, letterSpacing: -3.5, color: C.green }}>
        Dein Girokonto<br />zahlt dir <span style={{ background: C.green, color: C.white, borderRadius: 16, padding: "0 16px" }}>null.</span>
      </div>
      <Card style={{ position: "absolute", left: 60, right: 70, top: 470, padding: "32px 40px 38px", transform: `translateY(${(1 - card) * 520}px) rotate(${(1 - card) * 4}deg)` }}>
        <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 28, color: C.dim, marginBottom: 22 }}>Zinsen im Jahr auf 10.000 € · Beispiel</div>
        <Bar label="Girokonto" fill={0} muted t={t}><span style={{ fontFamily: tight, fontWeight: 900, fontSize: 70, color: C.dim, letterSpacing: -2, lineHeight: 1 }}>0 €</span></Bar>
        <div style={{ height: 30 }} />
        <Bar label="Tagesgeld" fill={0.82 * k} t={t}>
          <div style={{ transform: `scale(${1 + 0.12 * land})`, transformOrigin: "100% 100%" }}><Odometer value={200 * k} size={70} suffix="€" /></div>
        </Bar>
      </Card>
    </>
  );
};

const GiroScene: React.FC<{ t: number }> = ({ t }) => {
  const k = ez(t, 0.15, 1.2, Easing.out(Easing.quad));
  const shake = bump(t, 1.2, 0.4) * Math.sin(t * 80) * 12;
  const stamp = ez(t, 1.25, 1.45);
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 170, fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.dim }}>Zins auf dem Girokonto</div>
      <div style={{ position: "absolute", left: 50, top: 240, transform: `translateX(${shake}px)` }}>
        <Odometer value={2.5 * (1 - k)} decimals={2} size={260} suffix="%" />
      </div>
      <div style={{ position: "absolute", left: 60, top: 560, fontFamily: tight, fontWeight: 900, fontSize: 54, color: C.white, background: C.green, borderRadius: 18, padding: "10px 28px", letterSpacing: -1, transform: `scale(${1.6 - 0.6 * stamp}) rotate(-4deg)`, opacity: stamp, transformOrigin: "0 50%" }}>bei den meisten Banken</div>
    </>
  );
};

const TagesgeldScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const b = [0.49, 3.31, 3.77, 4.45];
  const p = ez(t, b[0] + 0.3, b[1] + 0.2, Easing.inOut(Easing.cubic));
  const land = bump(t, b[1] + 0.2, 0.3);
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 150, fontFamily: tight, fontWeight: 900, fontSize: 76, color: C.green, letterSpacing: -2.5, opacity: Math.min(1, sp(0.05) * 2), transform: `translateY(${(1 - sp(0.05)) * 30}px)` }}>Tagesgeld statt Girokonto</div>
      <Card style={{ position: "absolute", left: 60, right: 70, top: 290, padding: "32px 40px 38px", transform: `translateY(${(1 - sp(b[0])) * 520}px)` }}>
        <Bar label="Girokonto" fill={0} muted t={t}><span style={{ fontFamily: tight, fontWeight: 900, fontSize: 70, color: C.dim, letterSpacing: -2, lineHeight: 1 }}>0 %</span></Bar>
        <div style={{ height: 30 }} />
        <Bar label="Tagesgeld" fill={0.8 * p} t={t}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, transform: `scale(${1 + 0.12 * land})`, transformOrigin: "100% 100%" }}>
            <span style={{ fontFamily: tight, fontWeight: 800, fontSize: 40, color: C.green, marginBottom: 6 }}>über</span>
            <Odometer value={2 * p} decimals={1} size={70} suffix="%" />
          </div>
        </Bar>
      </Card>
      <div style={{ position: "absolute", left: 60, right: 60, top: 770, display: "flex", gap: 20 }}>
        <Chip text="dauerhaft" t={t} at={b[2]} />
        <Chip text="nicht nur Neukunden" t={t} at={b[3]} />
      </div>
    </>
  );
};

const RechnungScene: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const b = [0.74, 1.45, 2.07];
  const k = ez(t, b[0] - 0.2, b[0] + 0.9, Easing.inOut(Easing.cubic));
  const land = bump(t, b[0] + 0.9, 0.3);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, fontFamily: tight, fontWeight: 800, fontSize: 50, color: C.green }}>
        <span style={{ border: `4px solid ${C.green}`, borderRadius: 999, padding: "6px 28px", transform: `scale(${sp(0)})` }}>10.000 €</span>
        <span style={{ opacity: ez(t, 0.15, 0.3) }}>×</span>
        <span style={{ background: C.green, color: C.white, borderRadius: 999, padding: "10px 32px", transform: `scale(${sp(0.25)})` }}>2 %</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${1 + 0.1 * land})` }}>
        <Odometer value={200 * k} size={300} suffix="€" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: inter, fontWeight: 600, fontSize: 36, color: C.dim, opacity: ez(t, b[1], b[1] + 0.3) }}>rund pro Jahr · Beispiel</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.green, color: C.white, fontFamily: tight, fontWeight: 900, fontSize: 64, letterSpacing: -1.5, borderRadius: 22, padding: "12px 38px", transform: `scale(${sp(b[2], 10)}) rotate(-3deg)` }}>fürs Nichtstun</div>
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
      <div style={{ position: "absolute", left: 60, top: 150, display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, sp(0) * 2) }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: C.green, color: C.white, fontFamily: tight, fontWeight: 900, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(0, 10)})` }}>2</div>
        <span style={{ fontFamily: tight, fontWeight: 900, fontSize: 62, color: C.green, letterSpacing: -1.5 }}>Prompt schreiben</span>
      </div>
      <Card style={{ position: "absolute", left: 60, right: 70, top: 280, padding: "28px 32px", transform: `translateY(${(1 - sp(0.1)) * 500}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <Logo name="openai" size={44} tile={false} />
          <span style={{ fontFamily: inter, fontWeight: 600, fontSize: 28, color: C.dim }}>ChatGPT · Websuche an</span>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 40, lineHeight: 1.32, color: C.ink, minHeight: 160 }}>{typed}<span style={{ color: C.green, opacity: Math.floor(t * 3) % 2 }}>|</span></div>
      </Card>
      <div style={{ position: "absolute", left: 60, right: 60, top: 690, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {chips.map(([x, f]) => <Chip key={x} text={x} t={t} at={e * f} />)}
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

// ---------- caption: white pill with green text; key words as green pill with white text ----------

const KEY = /^(null|ChatGPT|Bank|Tagesgeld\w*|zwei|Prozent|dauerhaft|Neukunden|zweihundert|Euro|Nichtstun|Einlagensicherung|Zinsen?)$/i;
const HOLD_GAP_MS = 350;
const Caption: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const i = WORDS.findIndex((w, k) => nowMs >= w.startMs && nowMs < Math.min(WORDS[k + 1]?.startMs ?? Infinity, w.endMs + HOLD_GAP_MS));
  if (i === -1) return null;
  const w = WORDS[i];
  const local = frame - Math.round((w.startMs / 1000) * fps);
  const scale = interpolate(local, [0, 3], [1.12, 1], clamp);
  const text = w.text.replace(/[,;:.!?]+$/, "");
  const key = KEY.test(text);
  const fontSize = text.length > 14 ? Math.round((74 * 14) / text.length) : 74;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: "translateY(-50%)", zIndex: 50 }}>
      <div style={{ background: key ? C.green : C.white, color: key ? C.white : C.green, border: `4px solid ${C.green}`, fontFamily: tight, fontWeight: 900, fontSize, letterSpacing: -fontSize * 0.02, borderRadius: 999, padding: `${fontSize * 0.14}px ${fontSize * 0.5}px`, transform: `scale(${scale})`, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

export const GptGruenTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const s = SCENES.find((x) => t >= x.start && t < x.end);
  return (
    <AbsoluteFill style={{ background: C.white }}>
      {s ? (
        <Split t={t}>
          {/* Sequence: springs inside the scene count frames from the window start */}
          <Sequence from={Math.round(s.start * fps)} layout="none">
            <s.C t={t - s.start} />
          </Sequence>
        </Split>
      ) : (
        <OffthreadVideo src={staticFile(AVATAR.src)} muted style={{ width: "100%", height: "100%" }} />
      )}
      <Caption y={s ? PH : HH * 0.74} />
    </AbsoluteFill>
  );
};
