import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { AvatarSrc, Brand, serifItalic } from "../components/PanelKit";
import { Bars, BrandTile, HOOK_THEMES, SlotCounter } from "../components/HookKit";

// FP-N "Vorauszahlung senken" (runs/fpn-vorauszahlung, Reel 2026-10-09 11:00).
// Dopamin-Split-B-Rolls, FP mittlere Stufe (Henri 2026-10-08: "mehr Dopamin, aber nicht so crazy wie bei GPT"):
// panel on top (52 %), speaker below, caption pill on the seam, one new event every ~0.6-0.8 s, few objects at once,
// serious white/orange B2B look. Beat times = seconds from the window start (captions.json). All amounts are examples.

const W = 1080;
const H = 1920;
const th = HOOK_THEMES.fp;
const GREEN = "#2E9E5B";
const RED = "#E5484D";
const GOLD = { hi: "#FFF3B8", mid: "#F2C14E", lo: "#C8901E" };

export type VzProps = { seconds?: number; avatar: AvatarSrc; panelFrac?: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(Math.PI * Math.sqrt((t - at) / d)) * (1 - (t - at) / d) * 1.6);
const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const useSoft = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 13, stiffness = 170) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};
const resolveSrc = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

// ---------- split frame ----------
const VzSplit: React.FC<{ avatar: AvatarSrc; seconds: number; panelFrac?: number; children: (t: number) => React.ReactNode }> = ({ avatar, seconds, panelFrac = 0.52, children }) => {
  const t = useT();
  const { fps } = useVideoConfig();
  const PH = Math.round(H * panelFrac);
  const k = ramp(t, seconds - 0.35, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1.0;
  const f = avatar.focus ?? { x: 0.52, y: 0.45 };
  const h0 = H - PH;
  const vw0 = W * s0, vh0 = H * s0;
  const left0 = Math.min(0, Math.max(W - vw0, W / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.42) - f.y * vh0));
  const vw = vw0 + (W - vw0) * k, vh = vh0 + (H - vh0) * k;
  const cp = t / seconds;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left0 * (1 - k), top: (PH + top0) * (1 - k), width: vw, height: vh }}>
        <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: "#FBF9F6", boxShadow: `0 10px 30px rgba(0,0,0,${0.25 * (1 - k)})`, opacity: 1 - k, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${th.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 12) % 36}px, ${(t * 18) % 36}px)` }} />
        <div style={{ position: "absolute", width: 950, height: 950, borderRadius: "50%", left: 120 + Math.sin(t * 0.6) * 150, top: 60 + Math.cos(t * 0.45) * 100, background: `radial-gradient(circle, ${th.accentSoft}88 0%, transparent 65%)` }} />
        <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 0.8) * 6}px, ${-cp * 10}px) scale(${1 + 0.045 * cp})`, transformOrigin: "50% 60%" }}>{children(t)}</AbsoluteFill>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60 }}><Brand /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- pieces ----------
const Sweep: React.FC<{ t: number; at: number; dur?: number }> = ({ t, at, dur = 0.7 }) => {
  const p = (t - at) / dur;
  if (p <= 0 || p >= 1) return null;
  return <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "35%", left: `${-40 + p * 150}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", transform: "rotate(18deg)", pointerEvents: "none" }} />;
};
const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; edge?: string }> = ({ style, children, edge }) => (
  <div style={{ position: "relative", background: "#FFF", borderRadius: 30, border: `3px solid ${edge ?? th.line}`, boxShadow: "0 18px 40px rgba(0,0,0,0.09), inset 0 -5px 0 rgba(0,0,0,0.04)", overflow: "hidden", ...style }}>{children}</div>
);
const Pop: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: "up" | "down" | "left" | "right" | "none" }> = ({ t, at, children, style, from = "none" }) => {
  const soft = useSoft();
  const a = soft(at);
  const d = (1 - a) * 160;
  const tr = from === "left" ? `translateX(${-d}px)` : from === "right" ? `translateX(${d}px)` : from === "up" ? `translateY(${-d}px)` : from === "down" ? `translateY(${d}px)` : "";
  if (t < at - 0.01) return null;
  return <div style={{ position: "absolute", opacity: Math.min(1, a * 2), transform: `${tr} scale(${0.6 + 0.4 * a})`, ...style }}>{children}</div>;
};
const Badge: React.FC<{ text: string; color?: string; ink?: string; size?: number }> = ({ text, color = th.accent, ink = "#FFF", size = 34 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: color, color: ink, fontFamily: fonts.bold, fontSize: size, borderRadius: 999, padding: `${size * 0.28}px ${size * 0.7}px`, boxShadow: `0 8px 20px ${color}55, inset 0 -4px 0 rgba(0,0,0,0.12), inset 0 3px 0 rgba(255,255,255,0.35)`, whiteSpace: "nowrap" }}>{text}</div>
);
const Check: React.FC<{ size?: number; color?: string }> = ({ size = 52, color = GREEN }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: `radial-gradient(circle at 35% 30%, #6FD597, ${color})`, color: "#FFF", fontFamily: fonts.bold, fontSize: size * 0.58, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 14px ${color}66, inset 0 -3px 0 rgba(0,0,0,0.15)`, flexShrink: 0 }}>✓</div>
);
const Title: React.FC<{ t: number; text: string; em?: string; y?: number }> = ({ t, text, em, y = 150 }) => {
  const a = ramp(t, 0, 0.3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: fonts.bold, fontSize: 62, color: th.ink, letterSpacing: -1.5, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>
      {text} {em ? <span style={{ fontFamily: serifItalic, color: th.accent, fontSize: 72 }}>{em}</span> : null}
    </div>
  );
};
const StepRail: React.FC<{ t: number; active: number }> = ({ t, active }) => {
  const soft = useSoft();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      {[1, 2, 3].map((n) => {
        const on = n === active;
        const a = on ? soft(0.05, 10, 200) : 1;
        return (
          <React.Fragment key={n}>
            {n > 1 ? <div style={{ width: 70, height: 6, borderRadius: 3, background: n <= active ? th.accent : th.line }} /> : null}
            <div style={{ width: on ? 74 : 54, height: on ? 74 : 54, borderRadius: 40, background: n < active ? GREEN : on ? th.accent : "#FFF", border: `3px solid ${n <= active ? "transparent" : th.line}`, color: n <= active ? "#FFF" : th.dim, fontFamily: fonts.bold, fontSize: on ? 38 : 28, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.6 + 0.4 * a : 1})`, boxShadow: on ? `0 8px 22px ${th.accent}66, inset 0 -4px 0 rgba(0,0,0,0.12)` : "none" }}>{n < active ? "✓" : n}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
const FileChip: React.FC<{ name: string; kind: "xlsx" | "pdf"; done: number }> = ({ name, kind, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `3px solid ${th.line}`, borderRadius: 22, padding: "14px 22px", width: 600, boxSizing: "border-box", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}>
    <div style={{ width: 58, height: 70, borderRadius: 10, background: kind === "pdf" ? RED : GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 18, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8, boxSizing: "border-box", boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.15)" }}>{kind.toUpperCase()}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.ink, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ marginTop: 8, height: 10, borderRadius: 5, background: th.line, overflow: "hidden" }}><div style={{ width: `${done * 100}%`, height: "100%", background: th.accent, borderRadius: 5 }} /></div>
    </div>
    {done >= 1 ? <Check size={44} /> : null}
  </div>
);

const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * ramp(t, a, b, Easing.linear)));

// ---------- W2 · Vorauszahlung richtet sich nach dem letzten Bescheid (4.68 s) ----------
// beats: Vorauszahlung 0.44, Steuerbescheid 2.19, nicht 2.88, dieses Jahr 3.73, verdienst 4.18
export const VzBescheid: React.FC<VzProps> = ({ avatar, seconds = 4.68, panelFrac }) => (
  <VzSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
    {(t) => {
      const quarters = ["10.03.", "10.06.", "10.09.", "10.12."];
      return (
        <>
          <Title t={t} text="Vorauszahlung nach" em="Vorjahr" y={120} />
          <Pop t={t} at={0.1} from="left" style={{ left: 50, top: 250 }}>
            <Card style={{ width: 400, height: 330, padding: 28, boxSizing: "border-box" }} edge={th.accentSoft}>
              <div style={{ fontFamily: fonts.bold, fontSize: 22, letterSpacing: 3, color: th.dim }}>FINANZAMT</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink, marginTop: 10, lineHeight: 1.1 }}>Steuerbescheid<br />Vorjahr</div>
              {[0.9, 0.7, 0.8].map((w, i) => <div key={i} style={{ width: `${w * 100}%`, height: 10, borderRadius: 5, background: th.line, marginTop: 16 }} />)}
              <div style={{ position: "absolute", right: 22, bottom: 22, fontFamily: serifItalic, fontSize: 52, color: th.ink }}>80.000 €</div>
              <Sweep t={t} at={2.1} />
            </Card>
          </Pop>
          <Pop t={t} at={0.3} style={{ left: 300, top: 596 }}><Badge text="Gewinn · Beispiel" color="#FFF" ink={th.ink} size={26} /></Pop>
          {quarters.map((q, i) => {
            const at = 0.75 + i * 0.6;
            return (
              <Pop key={q} t={t} at={at} from="right" style={{ left: 490 + (i % 2) * 275, top: 255 + Math.floor(i / 2) * 165 }}>
                <div style={{ width: 255, height: 145, borderRadius: 24, background: th.ink, color: "#FFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(0,0,0,0.18), inset 0 -6px 0 rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: "#BDB6AA" }}>Rate {q}</div>
                  <div style={{ fontFamily: fonts.bold, fontSize: 52, color: GOLD.mid, transform: `scale(${1 + 0.1 * bump(t, at + 0.15, 0.35)})` }}>4.000 €</div>
                </div>
              </Pop>
            );
          })}
          <div style={{ position: "absolute", left: 50, top: 640 }}>
            <Bars t={t} th={th} at={2.1} title="Gewinn" badge="Beispiel" width={980} bars={[{ label: "Vorjahr", fill: 1, num: 80000, suffix: " €", muted: true }, { label: "Dieses Jahr", fill: 0.56, num: 45000, suffix: " €" }]} />
          </div>
        </>
      );
    }}
  </VzSplit>
);

// ---------- W3 · Schritt 1: Einnahmen, Ausgaben, Bescheid an Claude (5.04 s) ----------
// beats: Schritt eins 0, Claude 0.92, Einnahmen 1.30, Ausgaben 1.87, Bescheid 3.65, Vorauszahlungen 4.36
export const VzSchritt1: React.FC<VzProps> = ({ avatar, seconds = 5.04, panelFrac }) => (
  <VzSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
    {(t) => {
      const files: [string, "xlsx" | "pdf", number][] = [["Einnahmen_2026.xlsx", "xlsx", 1.2], ["Ausgaben_2026.xlsx", "xlsx", 1.85], ["Bescheid_Vorauszahlung.pdf", "pdf", 3.5]];
      const count = files.filter((f) => t >= f[2] + 0.55).length;
      return (
        <>
          <StepRail t={t} active={1} />
          <Title t={t} text="Gib Claude" em="drei Dateien" y={175} />
          <Pop t={t} at={0.15} style={{ left: 60, top: 320 }}>
            <Card style={{ width: 960, height: 590, padding: 30, boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <BrandTile t={t} logo="claude" th={th} size={70} />
                <span style={{ fontFamily: fonts.bold, fontSize: 36, color: th.ink }}>Claude</span>
                <div style={{ marginLeft: "auto" }}><Badge text={`${count} / 3`} color={count === 3 ? GREEN : th.accent} size={30} /></div>
              </div>
            </Card>
          </Pop>
          {files.map(([n, k, at], i) => (
            <Pop key={n} t={t} at={at} from="down" style={{ left: 120, top: 440 + i * 114 }}>
              <div style={{ transform: `rotate(${(1 - ramp(t, at, at + 0.4)) * (i % 2 ? 4 : -4)}deg)` }}>
                <FileChip name={n} kind={k} done={ramp(t, at + 0.1, at + 0.55)} />
              </div>
            </Pop>
          ))}
          <Pop t={t} at={2.6} from="right" style={{ left: 760, top: 455 }}><Badge text="Jan – Sep" color="#FFF" ink={th.ink} size={30} /></Pop>
          <Pop t={t} at={0.15} from="down" style={{ left: 90, top: 790 }}>
            <div style={{ width: 900, height: 96, boxSizing: "border-box", borderRadius: 26, border: `3px solid ${th.accentSoft}`, background: "#FFF", display: "flex", alignItems: "center", padding: "0 14px 0 26px", gap: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
              <span style={{ flex: 1, fontFamily: fonts.medium, fontSize: 29, color: th.ink, whiteSpace: "nowrap", overflow: "hidden" }}>{typed("Rechne meinen Gewinn 2026 hoch und vergleich ihn mit dem Vorjahr.", t, 0.2, 1.25)}<span style={{ color: th.accent, opacity: Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span></span>
              <div style={{ width: 180, height: 68, borderRadius: 34, background: t > 4.3 ? th.accent : "#E9C9BA", color: "#FFF", fontFamily: fonts.bold, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t > 4.3 ? `0 10px 24px ${th.accent}66, inset 0 -5px 0 rgba(0,0,0,0.15)` : "none", transform: `scale(${1 + 0.1 * bump(t, 4.35, 0.4)})` }}>Senden ↑</div>
            </div>
          </Pop>
        </>
      );
    }}
  </VzSplit>
);

// ---------- W4 · Schritt 2: Hochrechnung aufs ganze Jahr (4.52 s) ----------
// beats: rechnet 0.31, Gewinn 0.98, ganze Jahr 1.5, hoch 1.97, zeigt 2.46, unter dem Vorjahr 3.27, liegst 3.97
export const VzSchritt2: React.FC<VzProps> = ({ avatar, seconds = 4.52, panelFrac }) => (
  <VzSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
    {(t) => {
      const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
      const vals = [0.42, 0.38, 0.47, 0.4, 0.44, 0.36, 0.41, 0.39, 0.43, 0.41, 0.41, 0.41];
      return (
        <>
          <StepRail t={t} active={2} />
          <Title t={t} text="Claude rechnet" em="hoch" y={175} />
          <Pop t={t} at={0.1} style={{ left: 60, top: 310 }}>
            <Card style={{ width: 520, height: 330, padding: "24px 26px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 24, color: th.dim }}><span>Gewinn pro Monat</span><span>Beispiel</span></div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 210, marginTop: 14 }}>
                {months.map((m, i) => {
                  const proj = i >= 9;
                  const at = proj ? 1.4 + (i - 9) * 0.2 : 0.2 + i * 0.08;
                  const h = ramp(t, at, at + 0.35, Easing.out(Easing.back(1.6))) * vals[i] * 400;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ width: "100%", height: h, borderRadius: 8, background: proj ? "transparent" : `linear-gradient(180deg, ${th.itemA}, ${th.accent})`, border: proj ? `3px dashed ${th.accent}` : "none", boxSizing: "border-box" }} />
                      <div style={{ fontFamily: fonts.semibold, fontSize: 20, color: th.dim }}>{m}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Pop>
          <Pop t={t} at={1.5} from="up" style={{ left: 330, top: 290 }}><Badge text="hochgerechnet" size={26} /></Pop>
          <Pop t={t} at={0.6} from="right" style={{ left: 585, top: 330 }}>
            <Card style={{ width: 440, height: 290, padding: "24px 10px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: th.dim }}>Gewinn ganzes Jahr</div>
              <div style={{ transform: "scale(0.47)", transformOrigin: "50% 0%", height: 100, marginTop: 20, display: "flex", justifyContent: "center", width: 440 }}>
                <SlotCounter t={t} from={0} to={45000} start={0.8} dur={1.3} suffix="€" th={th} seconds={seconds} />
              </div>
              <div style={{ marginTop: 22, fontFamily: fonts.semibold, fontSize: 24, color: th.dim }}>Beispiel</div>
            </Card>
          </Pop>
          <div style={{ position: "absolute", left: 60, top: 670 }}>
            <Bars t={t} th={th} at={2.3} title="Vergleich" width={700} bars={[{ label: "Vorjahr", fill: 1, num: 80000, suffix: " €", muted: true }, { label: "Dieses Jahr", fill: 0.56, num: 45000, suffix: " €" }]} />
          </div>
          <Pop t={t} at={3.35} style={{ left: 775, top: 700 }}>
            <div style={{ width: 250, height: 250, borderRadius: 125, background: `radial-gradient(circle at 35% 30%, #FF9A6E, ${th.accent})`, border: `8px solid ${GOLD.mid}`, color: "#FFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 30px ${th.accent}66, inset 0 -8px 0 rgba(0,0,0,0.15)`, transform: `rotate(${-6 + Math.sin(t * 2) * 2}deg) scale(${1 + 0.06 * bump(t, 3.5, 0.5)})`, position: "relative", overflow: "hidden" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 60, lineHeight: 1, whiteSpace: "nowrap" }}>−44 %</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, marginTop: 6 }}>unter Vorjahr</div>
              <Sweep t={t} at={3.7} />
            </div>
          </Pop>
        </>
      );
    }}
  </VzSplit>
);

// ---------- W5 · Schritt 3: Claude schreibt den Antrag (4.48 s) — busiest beat ----------
// beats: Schritt drei 0, schreibt 1.06, Antrag 1.66, Herabsetzung 2.08, Begründung 2.92, Hochrechnung 3.68
export const VzSchritt3: React.FC<VzProps> = ({ avatar, seconds = 4.48, panelFrac }) => (
  <VzSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
    {(t) => {
      const head = "Antrag auf Herabsetzung der Einkommensteuer-Vorauszahlungen 2026";
      const body = "Mein Gewinn 2026 liegt voraussichtlich bei 45.000 € statt 80.000 €.";
      return (
        <>
          <StepRail t={t} active={3} />
          <Pop t={t} at={0.1} from="down" style={{ left: 70, top: 180 }}>
            <Card style={{ width: 640, height: 760, padding: "34px 36px", boxSizing: "border-box" }}>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.dim }}>An das Finanzamt</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.dim, marginTop: 4 }}>Steuernummer …</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 38, color: th.ink, marginTop: 28, lineHeight: 1.2, minHeight: 190 }}>{typed(head, t, 0.9, 2.4)}{t > 0.9 && t < 2.5 ? <span style={{ color: th.accent }}>|</span> : null}</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.accent, marginTop: 10, opacity: ramp(t, 2.6, 2.8), letterSpacing: 2 }}>BEGRÜNDUNG</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 30, color: th.ink, marginTop: 8, lineHeight: 1.3, minHeight: 120 }}>{typed(body, t, 2.7, 3.5)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, opacity: ramp(t, 3.6, 3.8) }}>
                <div style={{ width: 46, height: 56, borderRadius: 8, background: GREEN, boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.15)" }} />
                <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: th.ink }}>Anlage: Hochrechnung</span>
              </div>
              <Sweep t={t} at={3.9} dur={0.6} />
            </Card>
          </Pop>
          <Pop t={t} at={0.6} from="right" style={{ left: 740, top: 230 }}><BrandTile t={t} logo="claude" th={th} size={150} /></Pop>
          <Pop t={t} at={1.3} from="right" style={{ left: 735, top: 440 }}><Badge text="§ 37 Abs. 3 EStG" color="#FFF" ink={th.ink} size={28} /></Pop>
          <Pop t={t} at={3.0} from="right" style={{ left: 735, top: 560 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Check /><span style={{ fontFamily: fonts.bold, fontSize: 34, color: th.ink }}>Begründung</span></div></Pop>
          <Pop t={t} at={3.75} from="right" style={{ left: 735, top: 650 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Check /><span style={{ fontFamily: fonts.bold, fontSize: 34, color: th.ink }}>Hochrechnung</span></div></Pop>
        </>
      );
    }}
  </VzSplit>
);

// ---------- W6 · Kein Formular nötig, nächste Rate 10. Dezember (3.0 s) ----------
// beats: Formular 0.11, brauchst du nicht 0.39-1.08, nächste Rate 1.22-1.79, zehnten Dezember 2.02-3.0
export const VzRate: React.FC<VzProps> = ({ avatar, seconds = 3.0, panelFrac }) => (
  <VzSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
    {(t) => {
      const strike = ramp(t, 0.55, 0.85);
      return (
        <>
          <Pop t={t} at={0} from="left" style={{ left: 60, top: 170 }}>
            <Card style={{ width: 420, height: 400, padding: 30, boxSizing: "border-box" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 34, color: th.dim }}>Amtliches Formular</div>
              {[0.9, 0.6, 0.8, 0.5, 0.7].map((w, i) => <div key={i} style={{ display: "flex", gap: 10, marginTop: 22 }}><div style={{ width: 28, height: 28, borderRadius: 6, border: `3px solid ${th.line}` }} /><div style={{ width: `${w * 80}%`, height: 14, borderRadius: 7, background: th.line, marginTop: 7 }} /></div>)}
              <div style={{ position: "absolute", left: 20, top: 190, width: `${strike * 380}px`, height: 14, borderRadius: 7, background: RED, transform: "rotate(-28deg)", transformOrigin: "0 50%" }} />
            </Card>
          </Pop>
          <Pop t={t} at={0.9} from="up" style={{ left: 120, top: 600 }}><Badge text="formlos reicht" color={GREEN} size={40} /></Pop>
          <Pop t={t} at={1.25} from="right" style={{ left: 540, top: 170 }}>
            <Card style={{ width: 480, height: 560, boxSizing: "border-box" }}>
              <div style={{ height: 110, background: `linear-gradient(180deg, #FF8A5C, ${th.accent})`, color: "#FFF", fontFamily: fonts.bold, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 4, boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.12)" }}>DEZEMBER</div>
              <div style={{ textAlign: "center", fontFamily: fonts.bold, fontSize: 210, color: th.ink, lineHeight: 1.1, transform: `scale(${1 + 0.08 * bump(t, 2.05, 0.45)})` }}>10</div>
              <div style={{ textAlign: "center", fontFamily: fonts.semibold, fontSize: 30, color: th.dim }}>nächste Rate</div>
              <Sweep t={t} at={2.1} />
            </Card>
          </Pop>
          <Pop t={t} at={1.9} from="down" style={{ left: 560, top: 760 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `3px solid ${th.line}`, borderRadius: 24, padding: "14px 24px", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: th.dim, textDecoration: "line-through" }}>4.000 €</span>
              <span style={{ fontFamily: serifItalic, fontSize: 56, color: th.accent }}>1.500 €</span>
            </div>
          </Pop>
          <Pop t={t} at={2.35} style={{ left: 630, top: 880 }}><span style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.dim }}>Beispiel</span></Pop>
        </>
      );
    }}
  </VzSplit>
);

// ---------- W7 · Guide: Nachricht an Claude + Vorlage, Kommentar "Antrag" (3.04 s) ----------
// beats: Nachricht an Claude 0.14-1.01, Vorlage für den Antrag 1.41-2.33, Guide 2.66
export const VzGuide: React.FC<VzProps> = ({ avatar, seconds = 3.04, panelFrac }) => (
  <VzSplit avatar={avatar} seconds={seconds} panelFrac={panelFrac}>
    {(t) => {
      const word = "Antrag";
      const typedW = word.slice(0, Math.round(word.length * ramp(t, 1.85, 2.35, Easing.linear)));
      return (
        <>
          <Pop t={t} at={0} from="down" style={{ left: 60, top: 150 }}>
            <Card style={{ width: 560, height: 610, padding: 34, boxSizing: "border-box" }} edge={th.accentSoft}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 54, height: 66, borderRadius: 8, background: RED, color: "#FFF", fontFamily: fonts.bold, fontSize: 18, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>PDF</div>
                <span style={{ fontFamily: fonts.bold, fontSize: 40, color: th.ink }}>Guide</span>
              </div>
              <div style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink, marginTop: 24, lineHeight: 1.15 }}>Vorauszahlung<br /><span style={{ fontFamily: serifItalic, color: th.accent, fontSize: 52 }}>senken lassen</span></div>
              {[["Nachricht an Claude", 0.4, 0.9], ["Vorlage für den Antrag", 1.4, 1.95]].map(([s, a, c]) => (
                <div key={s as string} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30, opacity: ramp(t, a as number, (a as number) + 0.2), transform: `translateX(${(1 - ramp(t, a as number, (a as number) + 0.3)) * 60}px)` }}>
                  {t > (c as number) ? <Check size={46} /> : <div style={{ width: 46, height: 46, borderRadius: 23, border: `3px solid ${th.line}` }} />}
                  <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: th.ink }}>{s as string}</span>
                </div>
              ))}
              <Sweep t={t} at={1.0} />
            </Card>
          </Pop>
          <Pop t={t} at={1.65} from="right" style={{ left: 560, top: 540 }}>
            <Card style={{ width: 470, padding: "22px 26px", boxSizing: "border-box" }}>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: th.dim }}>Kommentar</div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", border: `3px solid ${th.accent}`, borderRadius: 18, padding: "12px 18px" }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 44, color: th.ink }}>{typedW}<span style={{ color: th.accent, opacity: Math.sin(t * 12) > 0 ? 1 : 0 }}>|</span></span>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: th.accent, color: "#FFF", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.15 * bump(t, 2.4, 0.3)})` }}>↑</div>
              </div>
            </Card>
          </Pop>
        </>
      );
    }}
  </VzSplit>
);

export const vzMetadata = ({ props }: { props: { seconds?: number } }) => ({ durationInFrames: Math.max(1, Math.round((props.seconds ?? 4) * 25)) });
