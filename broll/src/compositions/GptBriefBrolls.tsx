import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import {
  AnswerBlock,
  C,
  Camera,
  Cursor,
  InputBox,
  PlusMenu,
  RedFrame,
  StartHeader,
  StatusLine,
  UserBubble,
  menuRowY,
  prog,
  typed,
  useT,
} from "../components/ClaudeKit";

// @florentgpt · H-015 "Behördenbrief in einfach" (runs/gpt-behoerdenbrief).
// Click path in ClaudeKit: Plus → "Dateien oder Fotos hinzufügen" → Foto → Nachricht
// (menu labels from runs/gpt-urlaub-mallorca/klickpfad/claude-ablauf.md, 2026-10-02).
// The letter is invented ("Stadt Musterstadt"), no real authority, person or file number.

const N1 = "Erklär mir diesen Brief in einfachen Worten. Was wollen die, bis wann, und was muss ich tun?";
const N2 = "Schreib mir eine kurze Antwort an das Amt, dass ich die Unterlagen schicke.";
const INPUT = { x: 50, y: 1560, w: 980 };

/** The (invented) letter as a photo: white paper, slightly rotated. */
const Letter: React.FC<{ w: number; rot?: number; highlight?: boolean }> = ({ w, rot = -2, highlight }) => {
  const s = w / 800;
  const line = (top: number, width: number, dark = false) => (
    <div style={{ position: "absolute", left: 60 * s, top: top * s, width: width * s, height: 12 * s, borderRadius: 6 * s, backgroundColor: dark ? "#9A9A9A" : "#D9D9D9" }} />
  );
  return (
    <div style={{ position: "relative", width: w, height: w * 1.38, backgroundColor: "#FBFAF6", borderRadius: 8 * s, transform: `rotate(${rot}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 60 * s, top: 56 * s, fontFamily: fonts.bold, fontSize: 30 * s, color: "#1E3A5F" }}>Stadt Musterstadt</div>
      <div style={{ position: "absolute", left: 60 * s, top: 96 * s, fontFamily: fonts.regular, fontSize: 22 * s, color: "#555" }}>Bürgeramt · Wohngeldstelle</div>
      <div style={{ position: "absolute", right: 60 * s, top: 60 * s, width: 90 * s, height: 90 * s, borderRadius: 45 * s, border: `${4 * s}px solid #1E3A5F`, opacity: 0.5 }} />
      {line(200, 260)}
      {line(226, 220)}
      <div style={{ position: "absolute", left: 60 * s, top: 300 * s, fontFamily: fonts.bold, fontSize: 30 * s, color: "#111", width: 680 * s, lineHeight: 1.25 }}>
        Anhörung gemäß § 24 SGB X · Aufforderung zur Mitwirkung (§ 60 SGB I)
      </div>
      {[400, 430, 460, 490, 520, 570, 600, 630, 660].map((tp, i) => line(tp, [680, 640, 690, 600, 420, 680, 660, 610, 520][i]))}
      <div style={{ position: "absolute", left: 50 * s, top: 700 * s, padding: `${8 * s}px ${10 * s}px`, fontFamily: fonts.semibold, fontSize: 25 * s, color: "#111", backgroundColor: highlight ? "rgba(229,57,53,0.16)" : "transparent", borderRadius: 6 * s }}>
        … bis spätestens 30.10.2026 vorzulegen. Andernfalls kann die Leistung ganz versagt werden.
      </div>
      {[790, 820, 850, 880, 930, 960].map((tp, i) => line(tp, [690, 650, 600, 450, 300, 240][i]))}
    </div>
  );
};

/** Attachment thumbnail as Claude shows it above the input. */
const Attachment: React.FC<{ x: number; y: number; appear: number }> = ({ x, y, appear }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 150, borderRadius: 18, overflow: "hidden", border: `2px solid ${C.panelBorder}`, backgroundColor: "#3A3936", opacity: appear, transform: `scale(${0.8 + 0.2 * appear})` }}>
    <div style={{ position: "absolute", left: 22, top: 10, transform: "scale(1)" }}>
      <Letter w={106} rot={0} />
    </div>
  </div>
);

/** 1 · Ergebnis zuerst: letter photo + Claude's three-part summary. */
export const GBErgebnis: React.FC = () => {
  const t = useT();
  const rows: [string, string][] = [
    ["Was die wollen", "Für deinen Wohngeld-Antrag fehlen noch Unterlagen: drei Gehaltsabrechnungen und der Mietvertrag."],
    ["Bis wann", "Spätestens 30. Oktober 2026. Sonst kann der Antrag abgelehnt werden."],
    ["Was du tun musst", "Unterlagen kopieren, Aktenzeichen draufschreiben, per Post oder online schicken."],
  ];
  const lp = prog(t, 0, 0.45);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A" }}>
      <div style={{ position: "absolute", left: 130, top: 90, opacity: lp, transform: `translateY(${(1 - lp) * 40}px)` }}>
        <Letter w={560} rot={-4} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 760, backgroundColor: C.bg, border: `2px solid ${C.panelBorder}`, borderRadius: 30, padding: "36px 40px", boxShadow: "0 30px 90px rgba(0,0,0,0.6)", opacity: prog(t, 0.35, 0.7), transform: `translateY(${(1 - prog(t, 0.35, 0.7)) * 50}px)` }}>
        <div style={{ fontFamily: fonts.medium, fontSize: 28, color: C.orange, letterSpacing: 2, marginBottom: 12 }}>CLAUDE · IN EINFACHEN WORTEN</div>
        {rows.map(([h, b], i) => {
          const a0 = [2.15, 3.1, 3.65][i];
          const a = prog(t, a0, a0 + 0.3);
          return (
            <div key={h} style={{ display: "flex", gap: 22, padding: "18px 0", borderTop: i ? `2px solid ${C.panelBorder}` : "none", opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#4CAF50", width: 44 }}>✓</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.text }}>{h}</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 32, lineHeight: 1.4, color: C.dim, marginTop: 6 }}>{b}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** 2 · Plus → "Dateien oder Fotos hinzufügen" → photo attached. */
export const GBPlus: React.FC = () => {
  const t = useT();
  const plus = { x: INPUT.x + 34 + 35, y: 760 + 34 + 108 + 14 + 35 };
  const menu = { x: 60, y: 1040 };
  const rowY = menu.y + menuRowY("Dateien oder Fotos hinzufügen");
  const open = t < 1.75 ? prog(t, 0.55, 0.75) : 1 - prog(t, 1.75, 1.9);
  const att = prog(t, 2.0, 2.3);
  return (
    <Camera
      keys={[
        [0, 540, 900, 1.15],
        [0.45, plus.x + 260, plus.y + 60, 1.45],
        [0.95, 470, rowY - 60, 1.35],
        [1.8, 470, rowY - 60, 1.35],
        [2.2, 400, 720, 1.4],
        [3.6, 400, 720, 1.45],
      ]}
    >
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <StartHeader y={440} />
        <InputBox x={INPUT.x} y={760} w={INPUT.w} plusActive={open > 0} />
        <Attachment x={INPUT.x + 30} y={590} appear={att} />
        <PlusMenu x={menu.x} y={menu.y} open={open} websucheOn={false} hover={t > 1.05 && t < 1.8 ? "Dateien oder Fotos hinzufügen" : undefined} />
        <RedFrame x={menu.x + 14} y={rowY - 41} w={732} h={82} at={1.2} until={1.75} />
        <RedFrame x={INPUT.x + 30} y={590} w={150} h={150} at={2.35} />
        <Cursor keys={[[0, 640, 1150], [0.5, plus.x, plus.y, true], [0.95, plus.x + 60, plus.y + 90], [1.4, 430, rowY, true], [2.2, 300, 860], [3.6, 310, 870]]} />
      </AbsoluteFill>
    </Camera>
  );
};

/** 3 · Nachricht 1 tippen → Antwort, roter Rahmen um die Frist. */
export const GBNachricht1: React.FC = () => {
  const t = useT();
  const sendAt = 1.7;
  const sent = t >= sendAt;
  return (
    <Camera
      keys={[
        [0, 540, 1560, 1.08],
        [1.6, 540, 1560, 1.08],
        [2.05, 540, 860, 1.0],
        [3.4, 540, 900, 1.0],
        [3.9, 540, 980, 1.06],
        [6.0, 540, 980, 1.08],
      ]}
    >
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {sent ? (
          <>
            <div style={{ position: "absolute", right: 50, top: 70, opacity: prog(t, sendAt, sendAt + 0.25) }}>
              <Attachment x={-150} y={0} appear={1} />
            </div>
            <UserBubble y={240} text={N1} appear={prog(t, sendAt, sendAt + 0.25)} />
            <StatusLine y={500} text="Bild gelesen" appear={prog(t, sendAt + 0.25, sendAt + 0.45)} />
            <AnswerBlock y={580} heading="Was die wollen" body="Für deinen Wohngeld-Antrag fehlen noch drei Gehaltsabrechnungen und dein Mietvertrag." appear={prog(t, 2.1, 2.4)} />
            <AnswerBlock y={850} heading="Bis wann" body="Bis spätestens 30. Oktober 2026. Wenn bis dahin nichts kommt, kann der Antrag abgelehnt werden." appear={prog(t, 2.5, 2.8)} />
            <AnswerBlock y={1170} heading="Was du tun musst" body="Unterlagen kopieren, Aktenzeichen draufschreiben und per Post oder online schicken." appear={prog(t, 2.9, 3.2)} />
            <RedFrame x={60} y={846} w={960} h={270} at={3.45} />
          </>
        ) : (
          <Attachment x={INPUT.x + 30} y={INPUT.y - 175} appear={1} />
        )}
        <InputBox x={INPUT.x} y={INPUT.y} w={INPUT.w} placeholder="Schreib eine Nachricht…" text={sent ? "" : typed(N1, t, 0.1, 1.5)} caret={!sent} />
      </AbsoluteFill>
    </Camera>
  );
};

/** 4 · Nachricht 2 → fertiger Antwortbrief. */
export const GBAntwort: React.FC = () => {
  const t = useT();
  const sendAt = 1.05;
  const sent = t >= sendAt;
  const lines = [
    "Betreff: Ihr Schreiben vom 2. Oktober 2026",
    "Aktenzeichen: (aus deinem Brief)",
    "",
    "Sehr geehrte Damen und Herren,",
    "anbei sende ich Ihnen die angeforderten Unterlagen zu meinem Antrag auf Wohngeld:",
    "· Gehaltsabrechnungen Juli bis September",
    "· Mietvertrag",
    "Bitte bestätigen Sie mir kurz den Eingang.",
    "",
    "Mit freundlichen Grüßen",
  ];
  const card = prog(t, 1.4, 1.7);
  return (
    <Camera
      keys={[
        [0, 540, 1560, 1.08],
        [1.0, 540, 1560, 1.08],
        [1.45, 540, 900, 1.0],
        [4.5, 540, 1000, 1.04],
      ]}
    >
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {sent ? <UserBubble y={110} text={N2} appear={prog(t, sendAt, sendAt + 0.25)} /> : null}
        {sent ? (
          <div style={{ position: "absolute", left: 50, right: 50, top: 380, backgroundColor: "#FBFAF6", borderRadius: 22, padding: "44px 46px", opacity: card, transform: `translateY(${(1 - card) * 40}px)`, boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontFamily: i < 2 ? fonts.semibold : fonts.regular, fontSize: 34, lineHeight: 1.42, color: "#1A1A1A", minHeight: 22, opacity: prog(t, 1.6 + i * 0.16, 1.8 + i * 0.16) }}>
                {l}
              </div>
            ))}
          </div>
        ) : null}
        {sent ? <RedFrame x={50} y={380} w={980} h={150} at={2.9} /> : null}
        <InputBox x={INPUT.x} y={INPUT.y} w={INPUT.w} placeholder="Schreib eine Nachricht…" text={sent ? "" : typed(N2, t, 0.05, 0.9)} caret={!sent} />
      </AbsoluteFill>
    </Camera>
  );
};
