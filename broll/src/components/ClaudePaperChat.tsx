// Claude chat in the claudebyseb paper look, extended for real multi-step runs (Firma-Serie v3, 2026-10-27):
// crumpled paper sheet, fixed window frame with step chip, input card that grows for long prompts, the real "+" menu,
// typed text with marker highlights, user bubble, research card, report card. Builds on ClaudeUI.tsx (unchanged look).
// All timing in reel seconds (t). Layout is in window pixels (1080 wide, window top = frame top).
import React from "react";
import { Img, staticFile } from "remotion";
import { claudeSerif, INK, CLAUDE_ORANGE, cl, ease, back } from "./ClaudeUI";
import { pixelFont } from "./PixelKit";

export const PAPER = "#F4EFE5";
export const PAPER_BAR = "#EAE3D5";
export const MARK = { yellow: "#FFE08A", orange: "#FFC09A", red: "#FFB3B3", blue: "#BFD8FF", green: "#B8F0CF" } as const;
export type MarkColor = keyof typeof MARK;

// ---------- crumpled paper sheet (grain + baked crumple/fold shading) ----------
export const CrumpledPaper: React.FC<{ w: number; h: number; strength?: number; tex?: string; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, strength = 0.42, tex = "firma-neu-tag1/v3/paper-crumple.png", bg = PAPER, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, background: bg, overflow: "hidden", ...style }}>
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, opacity: 0.2 }}>
      <filter id="pgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.35  0 0 0 0.55 0" /></filter>
      <rect width={w} height={h} filter="url(#pgrain)" />
    </svg>
    <Img src={staticFile(tex)} style={{ position: "absolute", inset: 0, width: w, height: h, objectFit: "cover", mixBlendMode: "overlay", opacity: strength }} />
    {/* warm light falloff to the edges */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 45% 30%, rgba(255,250,240,.35), transparent 60%), radial-gradient(ellipse at 50% 50%, transparent 65%, rgba(120,90,50,.16) 100%)" }} />
    {children}
  </div>
);

// ---------- typing ----------
// keyframes [time, chars] → chars visible at t (piecewise linear)
export const typedAt = (keys: [number, number][], t: number) => {
  if (t <= keys[0][0]) return 0;
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, a] = keys[i], [tb, b] = keys[i + 1];
    if (t <= tb) return Math.floor(a + (b - a) * cl((t - ta) / (tb - ta)));
  }
  return keys[keys.length - 1][1];
};

export type TextMark = { find: string; at: number; color: MarkColor; until?: number; nth?: number };
// text with marker highlights (marker swipes in left → right), optional dimming of the unmarked rest
export const MarkedText: React.FC<{ text: string; n?: number; t: number; marks?: TextMark[]; dim?: number; caret?: boolean; caretColor?: string }> = ({ text, n = text.length, t, marks = [], dim = 0, caret, caretColor = CLAUDE_ORANGE }) => {
  const shown = text.slice(0, n);
  const ranges = marks
    .map((m) => {
      let i = -1;
      for (let k = 0; k <= (m.nth ?? 0); k++) i = text.indexOf(m.find, i + 1);
      return { ...m, a: i, b: i + m.find.length };
    })
    .filter((m) => m.a >= 0)
    .sort((x, y) => x.a - y.a);
  const out: React.ReactNode[] = [];
  let pos = 0;
  const plain = (s: string, key: string) => out.push(<span key={key} style={{ opacity: 1 - dim }}>{s}</span>);
  ranges.forEach((r, i) => {
    if (r.a < pos) return;
    if (r.a > pos) plain(shown.slice(pos, Math.min(r.a, n)), "p" + i);
    if (n <= r.a) { pos = n; return; }
    const seg = shown.slice(r.a, Math.min(r.b, n));
    const done = n >= r.b;
    const k = done ? ease((t - r.at) / 0.3) * (r.until !== undefined ? 1 - ease((t - r.until) / 0.25) : 1) : 0;
    out.push(
      <span key={"m" + i} style={{
        backgroundImage: `linear-gradient(${MARK[r.color]}, ${MARK[r.color]})`, backgroundRepeat: "no-repeat", backgroundSize: `${k * 100}% 100%`,
        borderRadius: 8, padding: "0 4px", margin: "0 -4px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone",
        boxShadow: k > 0.5 ? `0 3px 0 rgba(0,0,0,${0.12 * k})` : undefined, opacity: k > 0.01 ? 1 : 1 - dim,
      }}>{seg}</span>,
    );
    pos = Math.min(r.b, n);
  });
  if (pos < n) plain(shown.slice(pos), "rest");
  return (
    <>
      {out}
      {caret && <span style={{ display: "inline-block", width: 4, height: "1.05em", marginLeft: 3, background: caretColor, verticalAlign: "-0.15em", opacity: Math.floor(t * 3) % 2 || n < text.length ? 1 : 0 }} />}
    </>
  );
};

// ---------- window frame (fixed, never moves) ----------
export const WindowBar: React.FC<{ t: number; enter: number; top?: number; chip?: React.ReactNode }> = ({ t, enter, top = 40, chip }) => {
  const k = back((t - enter) / 0.45);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: top - (1 - k) * 220, height: 92, background: PAPER_BAR, borderTop: `6px solid ${INK}`, borderBottom: `6px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: 24, display: "flex", gap: 12 }}>
        {["#E5534B", "#E9B23A", "#3FB950"].map((c) => <div key={c} style={{ width: 28, height: 28, borderRadius: 14, background: c, border: `3px solid ${INK}` }} />)}
      </div>
      <Img src={staticFile("logos/claude.svg")} style={{ width: 44, height: 44, marginRight: 14 }} />
      <div style={{ fontFamily: claudeSerif, fontWeight: 600, fontSize: 50, color: INK }}>Claude</div>
      {chip}
    </div>
  );
};

// step chip that lives in the window bar (number in a white disc + short label)
export const StepChipBar: React.FC<{ t: number; n: number; total?: number; label: string; at: number; done?: number }> = ({ t, n, total = 3, label, at, done }) => {
  const k = back((t - at) / 0.4);
  const ok = done !== undefined && t >= done;
  return (
    <div style={{ position: "absolute", right: 18, top: 10, height: 60, display: "flex", alignItems: "center", gap: 10, padding: "0 20px 0 8px", borderRadius: 34, background: ok ? "#2FBF71" : CLAUDE_ORANGE, border: `4px solid ${INK}`, boxShadow: "0 5px 0 rgba(0,0,0,.3)", transform: `scale(${k}) rotate(${2 - 2 * k + 1.5}deg)`, transformOrigin: "100% 50%", fontFamily: pixelFont, fontWeight: 900, fontSize: 32, color: "#fff", letterSpacing: 1 }}>
      <span style={{ width: 46, height: 46, borderRadius: 23, background: "#fff", color: ok ? "#2FBF71" : CLAUDE_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{ok ? "✓" : n}</span>
      {label}
      <span style={{ opacity: 0.75, fontSize: 24 }}>{n}/{total}</span>
    </div>
  );
};

// ---------- small line icons (24 grid) ----------
const ICON: Record<string, string> = {
  clip: "M20 11.5l-8 8a5 5 0 01-7-7l8.5-8.5a3.3 3.3 0 014.7 4.7L9.7 17.2a1.7 1.7 0 01-2.4-2.4L15 7",
  skills: "M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4",
  connectors: "M4 13h7v7H4zM13 13h7v7h-7zM4 4h7v7H4zM15 4.5l4.5 4.5L15 13.5 10.5 9z",
  palette: "M12 3a9 9 0 100 18c1.2 0 1.6-1 1.2-2-.6-1.4.4-2.6 1.8-2.6H18a3 3 0 003-3C21 7 17 3 12 3zM7.5 11h.01M10 7h.01M15 7h.01",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 01-12 0zM12 17v4",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  research: "M6 3h8l4 4v6M6 3v18h6M15 15a3 3 0 106 0 3 3 0 00-6 0zM20 18l2 2",
  memory: "M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 003 3h1V4zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-3 3h-1V4z",
  globe: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
  doc: "M7 3h7l4 4v14H7zM10 11h5M10 15h5",
  chev: "M9 6l6 6-6 6",
};
export const LineIcon: React.FC<{ k: keyof typeof ICON | string; size?: number; color?: string; sw?: number }> = ({ k, size = 34, color = INK, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}><path d={ICON[k]} /></svg>
);

// ---------- the "+" menu, labels exactly as in the real run (English UI) ----------
export const PLUS_MENU = [
  { icon: "clip", label: "Upload or add files", right: "⌘U" },
  "sep",
  { icon: "skills", label: "Skills", chev: true },
  { icon: "connectors", label: "Connectors", chev: true },
  { icon: "palette", label: "Design system", chev: true },
  { icon: "plug", label: "Add plugins" },
  { icon: "monitor", label: "Devices", chev: true },
  "sep",
  { icon: "research", label: "Research" },
  { icon: "memory", label: "Memory", check: true },
] as const;
export const MENU_ROW = 56, MENU_SEP = 18, MENU_PAD = 16;
export const menuRowY = (label: string, top: number) => {
  let y = top + MENU_PAD;
  for (const it of PLUS_MENU) {
    if (it === "sep") { y += MENU_SEP; continue; }
    if (it.label === label) return y + MENU_ROW / 2;
    y += MENU_ROW;
  }
  return y;
};
export const PlusMenu: React.FC<{ t: number; open: number; close: number; left?: number; top: number; width?: number; hot?: string; hotAt?: number; onAt?: number }> = ({ t, open, close, left = 36, top, width = 640, hot, hotAt = 999, onAt = 999 }) => {
  const k = back((t - open) / 0.3) * (1 - ease((t - close) / 0.2));
  if (k <= 0.001) return null;
  let y = MENU_PAD;
  return (
    <div style={{ position: "absolute", left, top, width, transform: `scale(${k})`, transformOrigin: "10% 100%", background: "#FFFFFF", border: `5px solid ${INK}`, borderRadius: 26, boxShadow: "0 12px 0 rgba(0,0,0,.28)", paddingBottom: MENU_PAD }}>
      {PLUS_MENU.map((it, i) => {
        if (it === "sep") { y += MENU_SEP; return <div key={i} style={{ position: "absolute", left: 26, right: 26, top: y - MENU_SEP / 2 - 1, height: 3, background: "#E4DCCD" }} />; }
        const ry = y; y += MENU_ROW;
        const isHot = hot === it.label && t >= hotAt;
        const on = hot === it.label && t >= onAt;
        return (
          <div key={i} style={{ position: "absolute", left: 12, right: 12, top: ry, height: MENU_ROW, display: "flex", alignItems: "center", gap: 18, padding: "0 16px", borderRadius: 16, background: on ? "#FFE3D3" : isHot ? "#F3EEE4" : "transparent", border: on ? `4px solid ${CLAUDE_ORANGE}` : "4px solid transparent", fontFamily: pixelFont, fontWeight: on ? 800 : 600, fontSize: 34, color: INK }}>
            <LineIcon k={it.icon} size={36} color={on ? CLAUDE_ORANGE : INK} sw={on ? 2.6 : 2} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {"right" in it && <span style={{ color: "#8A8378", fontSize: 28 }}>{it.right}</span>}
            {"chev" in it && <LineIcon k="chev" size={30} color="#8A8378" />}
            {"check" in it && <span style={{ color: "#3E6FD8", fontSize: 34, fontWeight: 900 }}>✓</span>}
            {on && <span style={{ width: 40, height: 40, borderRadius: 20, background: CLAUDE_ORANGE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, transform: `scale(${back((t - onAt) / 0.3)})` }}>✓</span>}
          </div>
        );
      })}
      <div style={{ height: y }} />
    </div>
  );
};

// ---------- input card ----------
export const InputCard: React.FC<{
  top: number; bottom: number; t: number; focus?: boolean; children?: React.ReactNode; placeholder?: string; showPlaceholder?: boolean;
  research?: number; plusPress?: number; sendPress?: number; sent?: boolean; fontSize?: number; model?: string;
}> = ({ top, bottom, t, focus, children, placeholder = "How can I help you today?", showPlaceholder, research = 0, plusPress = 0, sendPress = 0, sent, fontSize = 34, model = "Opus 5.5" }) => (
  <div style={{ position: "absolute", left: 28, right: 28, top, height: bottom - top, background: "#FFFFFF", border: `7px solid ${INK}`, borderRadius: 34, boxShadow: focus ? "0 0 0 8px rgba(217,119,87,.35), 0 12px 0 rgba(0,0,0,.25)" : "0 12px 0 rgba(0,0,0,.25)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 30, right: 30, top: 22, bottom: 104, fontFamily: pixelFont, fontWeight: 600, fontSize, lineHeight: 1.32, color: INK, overflow: "hidden" }}>
      {showPlaceholder ? <span style={{ color: "#A39C90" }}>{placeholder}</span> : children}
    </div>
    <div style={{ position: "absolute", left: 22, bottom: 20, width: 64, height: 64, borderRadius: 32, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 700, fontFamily: pixelFont, background: plusPress > 0 ? `rgba(246,217,205,${plusPress})` : "transparent", transform: `scale(${1 - 0.12 * plusPress})` }}>+</div>
    {research > 0.001 && (
      <div style={{ position: "absolute", left: 102, bottom: 24, height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 20px 0 14px", borderRadius: 30, background: "#E3EEFF", border: "4px solid #3E6FD8", fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#2C52A8", transform: `scale(${back(research)})`, transformOrigin: "0% 50%" }}>
        <LineIcon k="research" size={32} color="#2C52A8" sw={2.4} />Research
      </div>
    )}
    <div style={{ position: "absolute", right: 136, bottom: 36, fontFamily: pixelFont, fontWeight: 500, fontSize: 32, color: "#7C756A" }}>{model}</div>
    <div style={{ position: "absolute", right: 18, bottom: 14, width: 96, height: 78, borderRadius: 22, background: sent ? "#B85C3E" : CLAUDE_ORANGE, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.22 * sendPress})`, boxShadow: "0 6px 0 rgba(0,0,0,.3)" }}>
      <svg width="44" height="44" viewBox="0 0 10 10"><path d="M5 1 L5 9 M5 1 L2 4 M5 1 L8 4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="square" /></svg>
    </div>
  </div>
);
// hit points inside an InputCard (window px)
export const inputPlus = (bottom: number) => ({ x: 28 + 22 + 32, y: bottom - 20 - 32 });
export const inputSend = (bottom: number) => ({ x: 1080 - 28 - 18 - 48, y: bottom - 14 - 39 });

// ---------- conversation pieces ----------
export const UserBubble: React.FC<{ text: string; lines?: number; fontSize?: number; style?: React.CSSProperties }> = ({ text, lines = 3, fontSize = 30, style }) => (
  <div style={{ marginLeft: "auto", maxWidth: 860, background: "#E9E1D1", border: `4px solid ${INK}`, borderRadius: 26, padding: "14px 22px", fontFamily: pixelFont, fontWeight: 500, fontSize, lineHeight: 1.3, color: INK, position: "relative", ...style }}>
    <div style={{ maxHeight: lines * fontSize * 1.3, overflow: "hidden", WebkitMaskImage: "linear-gradient(#000 60%, transparent)" }}>{text}</div>
  </div>
);

export const SourceDots: React.FC<{ t: number; spin?: boolean }> = ({ t, spin }) => (
  <div style={{ display: "flex" }}>
    {["globe", "doc", "globe"].map((k, i) => (
      <div key={i} style={{ width: 46, height: 46, borderRadius: 23, marginLeft: i ? -12 : 0, background: ["#FFFFFF", "#FFE9A8", "#DCEBFF"][i], border: `3px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", transform: spin ? `translateY(${Math.sin(t * 9 + i * 1.3) * 4}px)` : undefined }}>
        <LineIcon k={k} size={28} sw={2.2} />
      </div>
    ))}
  </div>
);

// research card exactly as in the run: title, status line, "Given access to"
export const ResearchCard: React.FC<{ t: number; title: string; status: React.ReactNode; running: boolean; access?: string; highlight?: number; style?: React.CSSProperties; compact?: boolean }> = ({ t, title, status, running, access, highlight = 0, style, compact }) => (
  <div style={{ background: "#FFFFFF", border: `5px solid ${INK}`, borderRadius: 24, padding: compact ? "14px 24px" : "20px 26px", boxShadow: `0 8px 0 rgba(0,0,0,.2)${highlight > 0 ? `, 0 0 0 ${8 * highlight}px rgba(217,119,87,.45)` : ""}`, ...style }}>
    <div style={{ display: "flex", alignItems: "center", fontFamily: pixelFont, fontWeight: 700, fontSize: compact ? 32 : 36, color: INK }}>
      <span style={{ flex: 1 }}>{title}</span><LineIcon k="chev" size={30} color="#8A8378" />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: compact ? 8 : 14, fontFamily: pixelFont, fontWeight: 600, fontSize: compact ? 30 : 34, color: "#5E574D" }}>
      <SourceDots t={t} spin={running} />
      {running && <div style={{ width: 30, height: 30, borderRadius: 15, border: "5px solid #E4DCCD", borderTopColor: CLAUDE_ORANGE, transform: `rotate(${t * 540}deg)` }} />}
      <span>{status}</span>
    </div>
    {access && !compact && <div style={{ marginTop: 10, fontFamily: pixelFont, fontWeight: 500, fontSize: 28, color: "#8A8378" }}>{access}</div>}
  </div>
);

// wrapper that slides content in from the right and out to the left inside the fixed window
export const Slide: React.FC<{ t: number; inAt: number; outAt?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, inAt, outAt = 999, children, style }) => {
  const kin = ease((t - inAt) / 0.35), kout = ease((t - outAt) / 0.3);
  if (kin <= 0.001 || kout >= 0.999) return null;
  return <div style={{ position: "absolute", ...style, transform: `translateX(${(1 - kin) * 1100 - kout * 1100}px) rotate(${(1 - kin) * 2 - kout * 2}deg)`, opacity: Math.min(1, kin * 1.5) * (1 - kout) }}>{children}</div>;
};
