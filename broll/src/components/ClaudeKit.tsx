import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { fonts } from "../theme";

// ClaudeKit: a faithful rebuild of the claude.ai chat UI (dark theme, German
// labels) for @florentgpt click-path B-Roll (gpt-normal-reel, Pius 2026-10-02:
// "die B-Rolls sind die exakten Klickpfade, die der Zuschauer selbst macht").
// Labels, menu order and states were copied from the real UI on 2026-10-02
// (runs/gpt-urlaub-mallorca/klickpfad/claude-ablauf.md). Rebuilt instead of
// screen-recorded so no private chat history ever appears on screen.
// Everything is laid out on a 1080-wide phone canvas, type is sized for phones.

const { fontFamily: serif } = loadNewsreader("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const C = {
  bg: "#262624",
  panel: "#30302E",
  panelBorder: "#45443F",
  menu: "#1F1E1D",
  text: "#F0EEE6",
  dim: "#A6A39A",
  faint: "#77756E",
  orange: "#D97757",
  blue: "#5B9BFF",
  userBubble: "#141413",
  red: "#E53935",
};

/** UI language of the rebuilt claude.ai (de = @florentgpt, en = Felix/boilr BX-C). Wrap a composition in
 * <ClaudeLang.Provider value="en"> to get the English labels (copied from claude.ai on 2026-10-06). */
export const ClaudeLang = React.createContext<"de" | "en">("de");
const LABELS = {
  de: { start: "Los geht’s!", placeholder: "Wie kann ich dir heute helfen?", effort: "Mittel", doc: "Dokument · PDF", download: "Herunterladen", reply: "Schreib eine Nachricht…", modes: true },
  en: { start: "Good afternoon", placeholder: "How can I help you today?", effort: "Medium", doc: "Document · PDF", download: "Download", reply: "Reply…", modes: false },
};
export const useLabels = () => LABELS[React.useContext(ClaudeLang)];

const ease = Easing.bezier(0.45, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0→1 between a and b seconds (eased). */
export const prog = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });

/** Camera: zoom onto a point of the 1080×1920 canvas. keys: [t, cx, cy, zoom]. */
export const Camera: React.FC<{ keys: [number, number, number, number][]; children: React.ReactNode; bg?: string }> = ({ keys, children, bg = C.bg }) => {
  const t = useT();
  const pick = (i: number) =>
    keys.length === 1 ? keys[0][i] : interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[i]), { ...clamp, easing: ease });
  const cx = pick(1);
  const cy = pick(2);
  const z = pick(3);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: bg }}>
      <AbsoluteFill style={{ transform: `translate(${540 - cx * z}px, ${960 - cy * z}px) scale(${z})`, transformOrigin: "0 0" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** macOS-like arrow cursor gliding through keys [t, x, y, click?]. */
export const Cursor: React.FC<{ keys: [number, number, number, boolean?][]; showFrom?: number }> = ({ keys, showFrom = 0 }) => {
  const t = useT();
  if (t < showFrom) return null;
  const x = keys.length === 1 ? keys[0][1] : interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: ease });
  const y = keys.length === 1 ? keys[0][2] : interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[2]), { ...clamp, easing: ease });
  const clicks = keys.filter((k) => k[3]);
  return (
    <>
      {clicks.map(([ct, x0, y0], i) => {
        const p = prog(t, ct, ct + 0.45);
        if (t < ct || p >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 - 46,
              top: y0 - 46,
              width: 92,
              height: 92,
              borderRadius: 46,
              border: `5px solid rgba(255,255,255,${0.9 * (1 - p)})`,
              transform: `scale(${0.4 + p})`,
            }}
          />
        );
      })}
      <svg width={44} height={66} viewBox="0 0 20 30" style={{ position: "absolute", left: x - 4, top: y - 2, overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}>
        <path d="M1 1 L1 23 L6.5 17.8 L10.3 27 L14 25.4 L10.3 16.6 L17.8 16.6 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Red highlight frame that draws on at `at` (mavgpt look). */
export const RedFrame: React.FC<{ x: number; y: number; w: number; h: number; at: number; until?: number; color?: string; glow?: string }> = ({
  x, y, w, h, at, until = 99, color = C.red, glow = "rgba(229,57,53,0.18)",
}) => {
  const t = useT();
  if (t < at || t > until) return null;
  const p = prog(t, at, at + 0.25);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 10,
        width: w + 20,
        height: h + 20,
        border: `6px solid ${color}`,
        borderRadius: 14,
        opacity: p,
        transform: `scale(${1.06 - 0.06 * p})`,
        boxShadow: `0 0 0 4px ${glow}`,
      }}
    />
  );
};

/** Typed text: reveals `text` between from and to seconds. */
export const typed = (text: string, t: number, from: number, to: number) => {
  const n = Math.round(interpolate(t, [from, to], [0, text.length], clamp));
  return text.slice(0, n);
};

/** The start screen header "Los geht's!" with the orange Claude mark. */
export const StartHeader: React.FC<{ y: number; text?: string }> = ({ y, text }) => {
  const L = useLabels();
  return (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
    <ClaudeMark size={74} />
    <span style={{ fontFamily: serif, fontSize: 92, color: C.text, letterSpacing: -1 }}>{text ?? L.start}</span>
  </div>
  );
};

export const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={47} y={6} width={6} height={44} rx={3} fill={C.orange} transform={`rotate(${i * 30} 50 50)`} />
    ))}
  </svg>
);

/** The input box (start screen or bottom bar). */
export const InputBox: React.FC<{
  x: number;
  y: number;
  w: number;
  text?: string;
  placeholder?: string;
  plusActive?: boolean;
  caret?: boolean;
}> = ({ x, y, w, text = "", placeholder, plusActive = false, caret = false }) => {
  const t = useT();
  const L = useLabels();
  placeholder = placeholder ?? L.placeholder;
  const blink = Math.floor(t * 2) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        minHeight: 250,
        backgroundColor: C.panel,
        border: `2px solid ${C.panelBorder}`,
        borderRadius: 34,
        padding: "34px 34px 26px",
        boxSizing: "border-box",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ fontFamily: fonts.regular, fontSize: 40, lineHeight: 1.35, color: text ? C.text : C.dim, minHeight: 108 }}>
        {text || placeholder}
        {caret && blink ? <span style={{ color: C.text }}>|</span> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 18,
            border: `2px solid ${C.panelBorder}`,
            backgroundColor: plusActive ? "#3A3936" : "transparent",
            color: C.text,
            fontFamily: fonts.regular,
            fontSize: 52,
            lineHeight: "64px",
            textAlign: "center",
          }}
        >
          +
        </div>
        {L.modes ? (
        <div style={{ display: "flex", borderRadius: 16, backgroundColor: "#262624", padding: 6, gap: 4 }}>
          <span style={{ fontFamily: fonts.medium, fontSize: 30, color: C.text, backgroundColor: "#3A3936", borderRadius: 12, padding: "8px 18px" }}>Chat</span>
          <span style={{ fontFamily: fonts.medium, fontSize: 30, color: C.faint, padding: "8px 18px" }}>Cowork</span>
        </div>
        ) : null}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: fonts.medium, fontSize: 30, color: C.dim }}>Opus 5.5</span>
        <span style={{ fontFamily: fonts.regular, fontSize: 30, color: C.faint }}>{L.effort}</span>
      </div>
    </div>
  );
};

const MENU_ITEMS: { label: string; sep?: boolean; arrow?: boolean; check?: boolean }[] = [
  { label: "Dateien oder Fotos hinzufügen" },
  { label: "Screenshot erstellen", sep: true },
  { label: "Skills", arrow: true },
  { label: "Konnektoren", arrow: true },
  { label: "Designsystem", arrow: true },
  { label: "Plugins hinzufügen", sep: true },
  { label: "Recherche" },
  { label: "Websuche", check: true },
  { label: "Speicher", check: true },
];
export const MENU_ROW = 82;

/** The "+" menu. websucheOn reveals the blue check on "Websuche". Returns row y of an item via menuRowY. */
export const PlusMenu: React.FC<{ x: number; y: number; open: number; websucheOn: boolean; hover?: string }> = ({ x, y, open, websucheOn, hover }) => {
  if (open <= 0) return null;
  let yy = 18;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 760,
        backgroundColor: C.menu,
        border: `2px solid ${C.panelBorder}`,
        borderRadius: 26,
        boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
        opacity: open,
        transform: `translateY(${(1 - open) * 20}px)`,
        padding: "18px 0",
        height: MENU_ITEMS.length * MENU_ROW + 2 * 22 + 36,
        boxSizing: "border-box",
      }}
    >
      {MENU_ITEMS.map((m) => {
        const top = yy;
        yy += MENU_ROW + (m.sep ? 22 : 0);
        const showCheck = m.label === "Websuche" ? websucheOn : m.check;
        return (
          <React.Fragment key={m.label}>
            <div
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                top,
                height: MENU_ROW,
                borderRadius: 16,
                backgroundColor: hover === m.label ? "#33322F" : "transparent",
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                boxSizing: "border-box",
                gap: 22,
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, border: `3px solid ${C.dim}` }} />
              <span style={{ fontFamily: fonts.regular, fontSize: 38, color: C.text, flex: 1 }}>{m.label}</span>
              {m.arrow ? <span style={{ fontFamily: fonts.regular, fontSize: 38, color: C.dim }}>›</span> : null}
              {showCheck ? <span style={{ fontFamily: fonts.bold, fontSize: 40, color: C.blue }}>✓</span> : null}
            </div>
            {m.sep ? <div style={{ position: "absolute", left: 30, right: 30, top: top + MENU_ROW + 10, height: 2, backgroundColor: C.panelBorder }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** y of a menu row's centre relative to the menu's top. */
export const menuRowY = (label: string) => {
  let yy = 18;
  for (const m of MENU_ITEMS) {
    if (m.label === label) return yy + MENU_ROW / 2;
    yy += MENU_ROW + (m.sep ? 22 : 0);
  }
  return 0;
};

/** A user message bubble, right-aligned. */
export const UserBubble: React.FC<{ y: number; text: string; appear: number }> = ({ y, text, appear }) => (
  <div
    style={{
      position: "absolute",
      right: 50,
      top: y,
      maxWidth: 860,
      backgroundColor: C.userBubble,
      borderRadius: 30,
      padding: "28px 34px",
      fontFamily: fonts.regular,
      fontSize: 38,
      lineHeight: 1.38,
      color: C.text,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 24}px)`,
    }}
  >
    {text}
  </div>
);

/** Small grey status line like "Web durchsucht". */
export const StatusLine: React.FC<{ y: number; text: string; appear: number }> = ({ y, text, appear }) => (
  <div style={{ position: "absolute", left: 60, top: y, fontFamily: fonts.regular, fontSize: 32, color: C.dim, opacity: appear, display: "flex", gap: 14, alignItems: "center" }}>
    <ClaudeMark size={34} /> {text} ›
  </div>
);

/** Claude answer block: heading + paragraph, revealed by `appear`. */
export const AnswerBlock: React.FC<{ y: number; heading?: string; body: string; appear: number }> = ({ y, heading, body, appear }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, opacity: appear, transform: `translateY(${(1 - appear) * 18}px)` }}>
    {heading ? <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.text, marginBottom: 14 }}>{heading}</div> : null}
    <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.45, color: C.text }}>{body}</div>
  </div>
);

/** Place card as Claude renders them (title, text, chips). */
export const PlaceCard: React.FC<{ x: number; y: number; w: number; title: string; text: string; chips: string[]; appear: number }> = ({
  x,
  y,
  w,
  title,
  text,
  chips,
  appear,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      backgroundColor: C.panel,
      border: `2px solid ${C.panelBorder}`,
      borderRadius: 28,
      padding: "30px 32px",
      boxSizing: "border-box",
      opacity: appear,
      transform: `translateY(${(1 - appear) * 24}px)`,
    }}
  >
    <div style={{ fontFamily: fonts.bold, fontSize: 42, color: C.text }}>{title}</div>
    <div style={{ fontFamily: fonts.regular, fontSize: 32, lineHeight: 1.4, color: C.dim, marginTop: 10 }}>{text}</div>
    <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
      {chips.map((c) => (
        <span key={c} style={{ fontFamily: fonts.medium, fontSize: 30, color: C.text, backgroundColor: "#3A3936", borderRadius: 999, padding: "10px 22px" }}>
          {c}
        </span>
      ))}
    </div>
  </div>
);

/** File card (PDF) Claude shows after creating a file. */
export const FileCard: React.FC<{ x: number; y: number; w: number; name: string; appear: number }> = ({ x, y, w, name, appear }) => {
  const L = useLabels();
  return (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      backgroundColor: C.panel,
      border: `2px solid ${C.panelBorder}`,
      borderRadius: 26,
      padding: "28px 30px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 26,
      opacity: appear,
      transform: `scale(${0.94 + 0.06 * appear})`,
    }}
  >
    <div style={{ width: 86, height: 104, borderRadius: 14, backgroundColor: "#C9473F", color: "#fff", fontFamily: fonts.bold, fontSize: 28, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14, boxSizing: "border-box" }}>
      PDF
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: C.text }}>{name}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 30, color: C.dim, marginTop: 6 }}>{L.doc}</div>
    </div>
    <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: C.text, border: `2px solid ${C.panelBorder}`, borderRadius: 16, padding: "14px 22px" }}>
      {L.download}
    </div>
  </div>
  );
};
