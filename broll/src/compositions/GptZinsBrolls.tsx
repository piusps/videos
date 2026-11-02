import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, Logo, serifItalic } from "../components/PanelKit";
import { DopamineHookProps, DopamineHookScene, HOOK_THEMES, SlotCounter } from "../components/HookKit";

// @florentgpt · "Zinsen aufs Ersparte" (runs/gpt-zinsen, Slot 2026-10-09 11:00). Helpers copied from GptRabattBrolls.
// Dopamin-Split-B-Rolls (Henri 2026-10-08): panel on top (panelFrac 0.52), speaker below, caption pill on the seam,
// glossy casino-style objects on white/green, gold only for money. No bank names/logos, no emojis.
// Amounts are examples ("Beispiel"). Beat times come in via props `b` (seconds relative to the window start).

const th = HOOK_THEMES.gpt;
const HW = 1080;
const HH = 1920;
const PH = Math.round(HH * 0.52); // 998
const RED = "#E5484D";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bt = (b: number[] | undefined, i: number, d: number) => (b && b[i] !== undefined ? b[i] : d);
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);
const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

export type ZsProps = { seconds?: number; avatar: AvatarSrc; b?: number[] };

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
/** spring 0→1 at second `at` (small overshoot). */
const useSp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 13, stiffness = 180) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};

// ---------- Split wrapper: panel on top, speaker below; last 0.35 s panel fades, speaker grows to full frame ----------

const Split: React.FC<{ avatar: AvatarSrc; children: React.ReactNode }> = ({ avatar, children }) => {
  const t = useT();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = durationInFrames / fps;
  const k = ez(t, seconds - 0.35, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1.0;
  const f = avatar.focus ?? { x: 0.52, y: 0.45 };
  const h0 = HH - PH;
  const vw0 = HW * s0, vh0 = HH * s0;
  const left0 = Math.min(0, Math.max(HW - vw0, HW / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.42) - f.y * vh0));
  const vw = vw0 + (HW - vw0) * k, vh = vh0 + (HH - vh0) * k;
  const cp = t / seconds;
  const dx = Math.sin(t * 0.9) * 8;
  const dy = -cp * 12;
  return (
    <AbsoluteFill style={{ background: th.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left0 * (1 - k), top: (PH + top0) * (1 - k), width: vw, height: vh }}>
        <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: HW, height: PH, overflow: "hidden", background: th.bg, boxShadow: `0 10px 30px rgba(0,0,0,${0.25 * (1 - k)})`, opacity: 1 - k, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
        <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: 300 + Math.sin(t * 0.7) * 160, top: 100 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${th.accentSoft}AA 0%, transparent 65%)` }} />
        <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${1 + 0.05 * cp})`, transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Glossy pieces (casino/slot UI: bevel, thick rim, gloss sweep, soft shadow) ----------

const Gloss: React.FC<{ t: number; speed?: number; off?: number }> = ({ t, speed = 0.7, off = 0 }) => {
  const g = ((t * speed + off) % 1.6) / 1.6;
  return <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "35%", left: `${-50 + g * 190}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "rotate(18deg)", pointerEvents: "none" }} />;
};

/** Chunky bevel button / badge. */
const Chunk: React.FC<{ t: number; color: string; dark: string; children: React.ReactNode; style?: React.CSSProperties; rim?: string; glossOff?: number }> = ({ t, color, dark, children, style, rim, glossOff = 0 }) => (
  <div style={{ position: "relative", overflow: "hidden", borderRadius: 30, background: `linear-gradient(180deg, ${color} 0%, ${dark} 100%)`, border: `5px solid ${rim ?? dark}`, boxShadow: `0 16px 34px ${dark}55, inset 0 6px 0 rgba(255,255,255,0.35), inset 0 -8px 0 rgba(0,0,0,0.18)`, color: "#fff", fontFamily: fonts.bold, ...style }}>
    {children}
    <Gloss t={t} off={glossOff} />
  </div>
);

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: th.card, borderRadius: 30, border: `2px solid ${th.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.09)", ...style }}>{children}</div>
);

/** Price with an animated red strike line (drawn from `at`). */
const Struck: React.FC<{ t: number; at: number; text: string; size: number; color?: string }> = ({ t, at, text, size, color = th.dim }) => {
  const p = ez(t, at, at + 0.3, Easing.inOut(Easing.cubic));
  return (
    <span style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: size, color, lineHeight: 1 }}>
      {text}
      <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: Math.max(5, size * 0.09), borderRadius: 99, background: RED, transformOrigin: "0 50%", transform: `scaleX(${p}) rotate(-6deg)` }} />
    </span>
  );
};

/** Drawn check / cross in a glossy round badge. */
const Mark: React.FC<{ t: number; at: number; ok: boolean; size?: number }> = ({ t, at, ok, size = 96 }) => {
  const sp = useSp();
  const a = sp(at, 11, 220);
  const p = ez(t, at + 0.1, at + 0.4);
  const c = ok ? th.accent : RED;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${ok ? "#4FE0B5" : "#FF8A8D"}, ${c} 60%, ${ok ? "#0B7A5F" : "#B8282D"})`, border: `5px solid ${ok ? "#0B7A5F" : "#B8282D"}`, boxShadow: `0 10px 24px ${c}66, inset 0 5px 0 rgba(255,255,255,0.35)`, transform: `scale(${a})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        {ok ? <path d="M4 12.5 L10 18 L20 6" stroke="#fff" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          : <>
            <path d="M6 6 L18 18" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 2)} />
            <path d="M18 6 L6 18" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
          </>}
      </svg>
    </div>
  );
};

const StepNo: React.FC<{ t: number; at: number; n: number; text: string; top?: number }> = ({ t, at, n, text, top = 50 }) => {
  const sp = useSp();
  const a = sp(at, 12, 200);
  return (
    <div style={{ position: "absolute", left: 60, top, display: "flex", alignItems: "center", gap: 20, transform: `translateX(${(1 - a) * -500}px)`, opacity: Math.min(1, a * 2), zIndex: 50 }}>
      <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ width: 84, height: 84, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{n}</Chunk>
      <span style={{ fontFamily: fonts.bold, fontSize: 56, color: th.ink, letterSpacing: -1 }}>{text}</span>
    </div>
  );
};

const Tag: React.FC<{ text: string; t: number; at: number; style?: React.CSSProperties }> = ({ text, t, at, style }) => {
  const sp = useSp();
  const a = sp(at, 12, 220);
  return <span style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: 26, color: th.ink, background: th.card, border: `1.5px solid ${th.line}`, borderRadius: 999, padding: "6px 18px", transform: `scale(${a})`, opacity: Math.min(1, a * 2), ...style }}>{text}</span>;
};

/** Red click frame (ChatGPT style). */
const RedBox: React.FC<{ x: number; y: number; w: number; h: number; t: number; a: number; b: number; r?: number }> = ({ x, y, w, h, t, a, b, r = 22 }) => {
  if (t < a || t > b) return null;
  const k = ez(t, a, a + 0.15);
  return <div style={{ position: "absolute", left: x - 8 * (1 - k), top: y - 8 * (1 - k), width: w + 16 * (1 - k), height: h + 16 * (1 - k), border: `6px solid ${RED}`, borderRadius: r, boxShadow: `0 0 0 8px ${RED}26`, opacity: k, zIndex: 80 }} />;
};

// ---------- shared: glossy gold coin + bank-ish account card ----------

const GoldCoin: React.FC<{ size: number; t: number; off?: number }> = ({ size, t, off = 0 }) => (
  <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 35% 30%, #FFF3B8, #F2C14E 45%, #C8901E 85%)", border: `${Math.max(3, size * 0.07)}px solid #B47A12`, boxShadow: `0 ${size * 0.12}px ${size * 0.25}px rgba(138,90,11,0.35), inset 0 ${size * 0.06}px 0 rgba(255,255,255,0.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: size * 0.48, color: "#8A5A0B" }}>
    €
    <Gloss t={t} speed={0.9} off={off} />
  </div>
);

const AccountCard: React.FC<{ t: number; title: string; sub: string; dark?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ t, title, sub, dark, style, children }) => (
  <div style={{ position: "relative", overflow: "hidden", borderRadius: 34, background: dark ? "linear-gradient(150deg,#3A3A3A,#141414)" : "linear-gradient(150deg,#2BC497,#0B8A6A)", border: `5px solid ${dark ? "#0A0A0A" : "#0B7A5F"}`, boxShadow: `0 22px 44px ${dark ? "rgba(0,0,0,0.3)" : "rgba(11,138,106,0.35)"}, inset 0 6px 0 rgba(255,255,255,0.2)`, padding: "26px 34px", boxSizing: "border-box", color: "#fff", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 70, height: 50, borderRadius: 10, background: "linear-gradient(135deg,#FFE58A,#C8901E)", border: "3px solid #B47A12" }} />
      <div style={{ fontFamily: fonts.bold, fontSize: 46, letterSpacing: -1 }}>{title}</div>
    </div>
    <div style={{ fontFamily: fonts.semibold, fontSize: 28, opacity: 0.75, marginTop: 10 }}>{sub}</div>
    {children}
    <Gloss t={t} speed={0.45} />
  </div>
);

// ---------- 1 · Girokonto: null Zinsen. b = [Girokonten, null, Zinsen] ----------
export const ZsGiro: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [g, n, z] = [bt(b, 0, 0.3), bt(b, 1, 1.4), bt(b, 2, 1.8)];
  const cardA = sp(Math.max(0, g - 0.2), 12, 160);
  const shake = bump(t, n + 0.1, 0.6) * Math.sin(t * 70) * 10;
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 70, width: 600, transform: `translateX(${(1 - cardA) * -800}px) rotate(${-4 + (1 - cardA) * -12}deg)` }}>
        <AccountCard t={t} dark title="Girokonto" sub="Guthaben · Beispiel">
          <div style={{ fontFamily: serifItalic, fontSize: 96, marginTop: 14, lineHeight: 1 }}>10.000 €</div>
        </AccountCard>
      </div>
      {/* zero coin that stays empty */}
      <div style={{ position: "absolute", left: 720, top: 90, transform: `scale(${sp(g + 0.4, 11, 200)}) translateX(${shake}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 230, height: 230, borderRadius: "50%", border: `10px dashed ${th.line}`, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", boxShadow: "0 16px 34px rgba(0,0,0,0.08)" }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 64, color: t > n ? RED : th.dim }}>0 €</span>
        </div>
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>Zinsen im Jahr</span>
      </div>
      {/* zins counter rolls down to 0,00 % */}
      <Card style={{ position: "absolute", left: 60, top: 560, width: 960, padding: "26px 36px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 30, transform: `translateY(${(1 - sp(g + 0.2, 12, 170)) * 500}px)` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.dim }}>Zins auf dem Girokonto</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 52, color: th.ink, marginTop: 6 }}>bei den meisten</div>
        </div>
        <div style={{ transform: `scale(${sp(g + 0.3, 10, 220) * (1 + 0.15 * bump(t, n, 0.45))}) translateX(${shake}px)` }}><Chunk t={t} color="#4A4A4A" dark="#151515" rim="#0A0A0A" style={{ padding: "14px 30px", fontSize: 96, letterSpacing: -2 }}>{t > n ? "0,00 %" : "0,0? %".replace("?", String(9 - Math.floor((t * 12) % 9)))}</Chunk></div>
        <Mark t={t} at={z} ok={false} size={110} />
      </Card>
    </Split>
  );
};

// ---------- 2 · Tagesgeld: über 2 %, dauerhaft, nicht nur Neukunden. b = [Tagesgeldkonto, zwei Prozent, dauerhaft, Neukunden] ----------
export const ZsTagesgeld: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [tg, zp, d, nk] = [bt(b, 0, 0.3), bt(b, 1, 2.0), bt(b, 2, 3.0), bt(b, 3, 4.2)];
  const rows: { label: string; fill: number; val: string; muted?: boolean; at: number }[] = [
    { label: "Girokonto", fill: 0, val: "0 %", muted: true, at: tg },
    { label: "Tagesgeld", fill: 0.8, val: "über 2 %", at: tg + 0.4 },
  ];
  return (
    <Split avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 70, width: 960, padding: "28px 38px 34px", boxSizing: "border-box", transform: `translateX(${(1 - sp(Math.max(0, tg - 0.25), 12, 150)) * 1100}px)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.dim }}>Zinsen aufs Ersparte</span>
          <Tag t={t} at={tg + 0.3} text="bei einigen Anbietern" />
        </div>
        {rows.map((r, i) => {
          const p = ez(t, r.at + 0.2, (i ? zp : r.at + 0.8) + 0.2, Easing.bezier(0.3, 0.7, 0.2, 1));
          const shimmer = ((t * 0.9 + i * 0.4) % 1.2) / 1.2;
          const done = i === 1 && t > zp + 0.2;
          return (
            <div key={r.label} style={{ marginTop: i ? 26 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>{r.label}</span>
                <span style={{ fontFamily: serifItalic, fontSize: 68, color: r.muted ? RED : th.accent, lineHeight: 1, display: "inline-block", transform: `scale(${1 + 0.15 * bump(t, zp + 0.2, 0.45) * (i ? 1 : 0)})` }}>{i === 1 && !done ? `${(2 * p).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %` : r.val}</span>
              </div>
              <div style={{ position: "relative", height: 44, borderRadius: 22, background: "#EDEDE8", overflow: "hidden", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.08)" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(r.fill * p * 100, r.muted ? 2 : 0)}%`, borderRadius: 22, background: r.muted ? "#CFCFCA" : "linear-gradient(180deg,#4FE0B5,#10A37F 60%,#0B8A6A)", boxShadow: done ? "0 0 26px rgba(16,163,127,0.55)" : undefined, overflow: "hidden" }}>
                  {!r.muted ? <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", left: `${-30 + shimmer * 160}%`, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)" }} /> : null}
                </div>
              </div>
            </div>
          );
        })}
      </Card>
      {/* coins pop over the green bar when it lands */}
      {[0, 1, 2, 3, 4].map((i) => {
        const at = zp + 0.25 + i * 0.09;
        if (t < at) return null;
        const k = ez(t, at, at + 0.7);
        return <div key={i} style={{ position: "absolute", left: 760 + i * 40, top: 330 - k * (90 + i * 22), opacity: 1 - ez(t, at + 0.5, at + 0.8), transform: `rotate(${(i - 2) * 18}deg) scale(${0.8 + 0.3 * k})` }}><GoldCoin size={64} t={t} off={i * 0.3} /></div>;
      })}
      <div style={{ position: "absolute", left: 60, right: 60, top: 620, display: "flex", gap: 24 }}>
        {[["dauerhaft", d], ["nicht nur für Neukunden", nk]].map(([x, at]) => {
          const a = sp(at as number, 10, 220);
          return (
            <div key={x as string} style={{ flex: x === "dauerhaft" ? 0.75 : 1.25, transform: `scale(${a})`, opacity: Math.min(1, a * 2) }}>
              <Card style={{ padding: "26px 26px", display: "flex", alignItems: "center", gap: 18 }}>
                <Mark t={t} at={(at as number) + 0.1} ok size={86} />
                <span style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink, lineHeight: 1.1 }}>{x}</span>
              </Card>
            </div>
          );
        })}
      </div>
    </Split>
  );
};

// ---------- 3 · Rechnung: 10.000 € → rund 200 € im Jahr, fürs Nichtstun. b = [zweihundert, Jahr, Nichtstun] ----------
export const ZsRechnung: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = durationInFrames / fps;
  const [zw, j, ni] = [bt(b, 0, 0.1), bt(b, 1, 1.0), bt(b, 2, 1.6)];
  // coin rain + towers left and right of the counter
  const towers = [-400, -310, 310, 400];
  const coins = Array.from({ length: Math.floor(seconds / 0.08) }, (_, i) => i);
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", transform: `scale(${sp(0, 12, 200)})` }}>
        <Chunk t={t} color="#4A4A4A" dark="#151515" rim="#0A0A0A" style={{ padding: "12px 28px", fontSize: 46 }}>10.000 €</Chunk>
        <span style={{ fontFamily: fonts.bold, fontSize: 50, color: th.ink }}>×</span>
        <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ padding: "12px 28px", fontSize: 46 }}>2 %</Chunk>
        <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.dim }}>Beispiel</span>
      </div>
      {coins.map((i) => {
        const at = i * 0.08;
        const col = i % 4;
        const lvl = Math.floor(i / 4);
        const floorY = 760 - lvl * 22;
        const y = Math.min(floorY, -100 + 0.5 * 5200 * Math.max(0, t - at) ** 2);
        if (t < at || lvl > 14) return null;
        const landed = y >= floorY;
        return (
          <div key={i} style={{ position: "absolute", left: HW / 2 + towers[col] - 40, top: y, zIndex: 5 + lvl }}>
            <div style={{ width: 80, height: landed ? 26 : 80, borderRadius: landed ? "50% / 50%" : "50%", background: landed ? "linear-gradient(180deg,#FFE58A,#E0A92E 55%,#B47A12)" : undefined, border: landed ? "3px solid #9E6A0E" : undefined, boxShadow: landed ? "0 4px 6px rgba(0,0,0,0.15)" : undefined, overflow: "hidden" }}>
              {!landed ? <GoldCoin size={80} t={t} off={i * 0.2} /> : null}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 100 }}>
        <div style={{ transform: "scale(1.05)" }}><SlotCounter t={t} from={0} to={200} start={zw} dur={0.9} suffix="€" th={th} ticks={{ text: "+ €", every: 0.5 }} seconds={seconds} /></div>
        <div style={{ marginTop: 18, transform: `scale(${sp(j, 11, 220)})` }}>
          <Tag t={t} at={j} text="rund · pro Jahr" style={{ fontSize: 34, padding: "8px 24px" }} />
        </div>
        <div style={{ marginTop: 26, transform: `scale(${sp(ni, 9, 220)}) rotate(-3deg)` }}>
          <Chunk t={t} color="#FFE58A" dark="#E0A92E" rim="#B47A12" style={{ padding: "14px 34px", fontSize: 50, color: "#5A3A00" }}>fürs Nichtstun</Chunk>
        </div>
      </div>
    </Split>
  );
};

// ---------- ChatGPT composer (light) ----------
const Composer: React.FC<{ t: number; typed: string; webA: number; sendBump: number }> = ({ t, typed, webA, sendBump }) => (
  <div style={{ background: "#fff", border: "2px solid #E5E5E5", borderRadius: 40, padding: "22px 26px", boxShadow: "0 10px 26px rgba(0,0,0,0.07)" }}>
    <div style={{ fontFamily: fonts.regular, fontSize: 38, color: typed ? "#0D0D0D" : "#9B9B9B", minHeight: 100, lineHeight: 1.3 }}>{typed || "Frag irgendwas"}<span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span></div>
    <div style={{ display: "flex", alignItems: "center", marginTop: 14, gap: 14 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, border: "2px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, color: "#0D0D0D", fontFamily: fonts.regular }}>+</div>
      <div style={{ opacity: Math.min(1, webA * 2), transform: `scale(${webA})`, display: "flex", alignItems: "center", gap: 10, background: "#E8F1FF", color: "#1A6BFF", borderRadius: 32, padding: "12px 22px", fontFamily: fonts.semibold, fontSize: 30 }}>
        <svg width={30} height={30} viewBox="0 0 24 24"><circle cx={12} cy={12} r={9} stroke="#1A6BFF" strokeWidth={2} fill="none" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" stroke="#1A6BFF" strokeWidth={2} fill="none" /></svg>
        Websuche
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ width: 64, height: 64, borderRadius: 32, background: typed ? "#0D0D0D" : "#D7D7D7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34, transform: `scale(${1 - 0.12 * sendBump})` }}>↑</div>
    </div>
  </div>
);

// ---------- 4 · Erstens: ChatGPT öffnen, Websuche an. b = [Erstens, ChatGPT, Websuche] ----------
export const ZsWebsuche: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [e, c, w] = [bt(b, 0, 0.0), bt(b, 1, 0.6), bt(b, 2, 1.5)];
  const appA = sp(c, 11, 170);
  const menuA = sp(w - 0.45, 12, 220);
  const webA = sp(w + 0.25, 11, 220);
  const IY = 600;
  return (
    <Split avatar={avatar}>
      <StepNo t={t} at={e} n={1} text="Websuche an" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 180, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, transform: `scale(${appA})` }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 40, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}><Logo name="openai" size={150} /><Gloss t={t} speed={0.6} /></div>
        <span style={{ fontFamily: fonts.bold, fontSize: 80, color: th.ink, letterSpacing: -2 }}>ChatGPT</span>
      </div>
      {/* "+" menu with Websuche entry */}
      {t > w - 0.45 && t < w + 0.35 ? (
        <Card style={{ position: "absolute", left: 60, top: IY - 200, width: 420, padding: "14px 18px", transform: `scale(${menuA})`, transformOrigin: "0 100%", zIndex: 60 }}>
          {["Fotos & Dateien", "Websuche", "Bild erstellen"].map((x) => (
            <div key={x} style={{ fontFamily: fonts.semibold, fontSize: 32, color: x === "Websuche" ? "#1A6BFF" : th.ink, padding: "10px 12px", borderRadius: 14, background: x === "Websuche" ? "#E8F1FF" : "transparent" }}>{x}</div>
          ))}
        </Card>
      ) : null}
      <div style={{ position: "absolute", left: 50, right: 50, top: IY, opacity: ez(t, c + 0.2, c + 0.4) }}>
        <Composer t={t} typed="" webA={webA} sendBump={0} />
      </div>
      <RedBox x={50 + 26 - 6} y={IY + 22 + 100 + 14 - 6} w={76} h={76} t={t} a={w - 0.7} b={w - 0.2} r={40} />
      <RedBox x={50 + 26 + 78 - 6} y={IY + 22 + 100 + 14 - 6} w={220} h={76} t={t} a={w + 0.3} b={99} r={40} />
    </Split>
  );
};

// ---------- 5 · Zweitens: Prompt tippen. b = [such mir (typing start), Einlagensicherung end] ----------
const Q = "Such mir Tagesgeldkonten mit dem höchsten Zins, der auch nach der Aktion bleibt, und mit Einlagensicherung.";
export const ZsPrompt: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [s, e] = [bt(b, 0, 0.0), bt(b, 1, 4.5)];
  const typed = Q.slice(0, Math.floor(Q.length * ez(t, s, e, Easing.linear)));
  const chips = [["höchster Zins", 0.25], ["bleibt nach der Aktion", 0.55], ["Einlagensicherung", 0.92]] as const;
  return (
    <Split avatar={avatar}>
      <StepNo t={t} at={0} n={2} text="Prompt schreiben" />
      <div style={{ position: "absolute", left: 50, right: 50, top: 190 }}>
        <Composer t={t} typed={typed} webA={1} sendBump={bump(t, e, 0.3)} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 600, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {chips.map(([x, f]) => {
          const at = s + (e - s) * f;
          const a = sp(at, 10, 220);
          return (
            <div key={x} style={{ transform: `scale(${a})`, opacity: Math.min(1, a * 2) }}>
              <Chunk t={t} color="#2BC497" dark="#0B8A6A" glossOff={f} style={{ padding: "14px 26px", fontSize: 38, display: "flex", alignItems: "center", gap: 12 }}>✓ {x}</Chunk>
            </div>
          );
        })}
      </div>
      <RedBox x={50 - 6} y={190 - 6} w={980 + 12} h={100 + 44 + 14 + 64 + 12 + 40} t={t} a={s} b={s + 0.6} r={44} />
    </Split>
  );
};

// ---------- 6 · Drittens: die drei besten mit Link, Zins bei der Bank prüfen. b = [drei besten, Link, prüf, Bank] ----------
export const ZsDrei: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [dr, l, p, bk] = [bt(b, 0, 0.3), bt(b, 1, 1.0), bt(b, 2, 1.8), bt(b, 3, 2.8)];
  const rows = ["Tagesgeld A", "Tagesgeld B", "Tagesgeld C"];
  return (
    <Split avatar={avatar}>
      <StepNo t={t} at={0} n={3} text={t < p ? "Die drei besten" : "Bei der Bank prüfen"} />
      <Card style={{ position: "absolute", left: 60, top: 180, width: 960, padding: "18px 34px 22px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <Logo name="openai" size={52} tile={false} />
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: th.dim, flex: 1 }}>Top 3 · dauerhafter Zins</span>
          <Tag t={t} at={dr} text="Beispiel" />
        </div>
        {rows.map((name, i) => {
          const at = dr + i * 0.25;
          const a = sp(at, 12, 220);
          const linkA = sp(l + i * 0.15, 11, 240);
          const checked = t > p + 0.3 + i * 0.3;
          return (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderTop: i ? `2px solid ${th.line}` : "none", transform: `translateX(${(1 - a) * 700}px)`, opacity: Math.min(1, a * 2) }}>
              <Chunk t={t} color={i === 0 ? "#FFE58A" : "#F4F4F0"} dark={i === 0 ? "#E0A92E" : "#D6D6D0"} rim={i === 0 ? "#B47A12" : "#C4C4BE"} glossOff={i * 0.3} style={{ width: 70, height: 70, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: i === 0 ? "#5A3A00" : th.ink }}>{i + 1}</Chunk>
              <span style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink, flex: 1 }}>{name}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: "#1A6BFF", background: "#E8F1FF", borderRadius: 999, padding: "8px 20px", transform: `scale(${linkA})`, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width={26} height={26} viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" stroke="#1A6BFF" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
                Link
              </span>
              <div style={{ width: 76 }}>{checked ? <Mark t={t} at={p + 0.3 + i * 0.3} ok size={76} /> : null}</div>
            </div>
          );
        })}
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", transform: `scale(${sp(bk, 10, 220)})` }}>
        <Chunk t={t} color="#2BC497" dark="#0B8A6A" style={{ padding: "16px 36px", fontSize: 46 }}>Zins direkt bei der Bank prüfen</Chunk>
      </div>
      <RedBox x={60 + 34 + 960 - 68 - 76 - 20 - 150 - 4} y={180 + 18 + 60 + 6} w={150} h={70} t={t} a={l} b={l + 0.7} r={999} />
    </Split>
  );
};

// ---------- 7 · CTA: folg mir, ZINSEN kommentieren. b = [folg mir, Zinsen] ----------
export const ZsCta: React.FC<ZsProps> = ({ avatar, b }) => {
  const t = useT();
  const sp = useSp();
  const [fo, zi] = [bt(b, 0, 0.2), bt(b, 1, 0.9)];
  const word = "ZINSEN";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - zi) / 0.08)));
  const followed = t > fo + 0.2;
  const guideA = sp(0, 11, 170);
  return (
    <Split avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 420, transform: `translateX(${(1 - guideA) * -700}px) rotate(${-3 + (1 - guideA) * -10}deg)` }}>
        <Card style={{ width: 430, height: 500, padding: 30, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: "#7C3AED" }}>Florent GPT · Anleitung</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 50, color: th.ink, lineHeight: 1.05, marginTop: 14, letterSpacing: -1 }}>Zinsen für dein Erspartes</div>
          {["Der genaue Prompt", "Dauerzins oder Lockangebot", "Einlagensicherung"].map((x, i) => (
            <div key={x} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: i ? 14 : 30, opacity: ez(t, 0.2 + i * 0.2, 0.35 + i * 0.2) }}>
              <Mark t={t} at={0.2 + i * 0.2} ok size={44} />
              <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.ink }}>{x}</span>
            </div>
          ))}
          <Gloss t={t} speed={0.5} />
        </Card>
      </div>
      <Card style={{ position: "absolute", left: 530, top: 450, width: 490, padding: 28, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Logo name="instagram" size={58} />
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: th.ink, flex: 1 }}>florentgpt</span>
        </div>
        <div style={{ marginTop: 22, height: 76, borderRadius: 18, background: followed ? "#E4E4E4" : "#0095F6", color: followed ? th.ink : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34, transform: `scale(${1 + 0.1 * bump(t, fo, 0.35)})` }}>{followed ? "Gefolgt" : "Folgen"}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: th.dim, marginTop: 30 }}>Kommentar</div>
        <div style={{ marginTop: 12, height: 84, borderRadius: 42, border: `2px solid ${th.line}`, display: "flex", alignItems: "center", padding: "0 28px", fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>{word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2, color: th.accent }}>|</span></div>
      </Card>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const at = zi + 0.6 + i * 0.12;
        if (t < at) return null;
        const k = ez(t, at, at + 0.9);
        return <div key={i} style={{ position: "absolute", left: 560 + i * 70, top: 420 + (1 - k) * -40 + k * 200, opacity: 1 - ez(t, at + 0.6, at + 0.9) }}><GoldCoin size={90} t={t} off={i * 0.3} /></div>;
      })}
      <RedBox x={530 + 28 - 6} y={450 + 28 + 58 + 22 - 6} w={434 + 12} h={88} t={t} a={fo - 0.3} b={fo + 0.4} r={24} />
      <RedBox x={530 + 28 - 6} y={450 + 28 + 58 + 22 + 76 + 30 + 32 + 12 - 6} w={434 + 12} h={96} t={t} a={zi + 0.5} b={zi + 2} r={48} />
    </Split>
  );
};

export const zsMetadata = ({ props }: { props: { seconds?: number } }) => ({ durationInFrames: Math.max(1, Math.round((props.seconds ?? 4) * 25)) });
