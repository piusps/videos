import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import { C, Camera, InputBox, RedFrame, StatusLine, UserBubble, prog, typed, useT } from "../components/ClaudeKit";
import { AvatarPanel, AvatarSource } from "../components/ExplainerKit";

// @florentgpt · H-013 "Die günstigsten Flüge mit Claude finden" (runs/gpt-fluege, 2026-10-05).
// First reel on "Niklas Office -- 5", which has a lot of empty wall above the head (Pius 2026-10-05:
// show as little of it as possible). So the result beats are split screens: Claude on top, the
// speaker's face in a panel at the bottom; the click path (Plus → Websuche) reuses GUPlus full-frame.
// The GPT captions move to the seam during the splits (captionZones y 0.585).
// Every price, date and airport here is an invented example; prices are snapshots, the reel says so.

const TOP = 1080; // split seam: screen 0..TOP, speaker panel TOP..1920
const INPUT = { x: 50, y: 1560, w: 980 };
const GREEN = "#4CAF50";

export type GFSplitProps = { seconds?: number; avatar: AvatarSource };

const SplitScreen: React.FC<{ avatar: AvatarSource; children: React.ReactNode }> = ({ avatar, children }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: TOP, overflow: "hidden" }}>{children}</div>
    <AvatarPanel avatar={avatar} top={TOP} height={1920 - TOP} />
    <div style={{ position: "absolute", left: 0, right: 0, top: TOP - 3, height: 6, backgroundColor: "#000", opacity: 0.35 }} />
  </AbsoluteFill>
);

type Day = [string, string, number];
const DAYS: Day[] = [
  ["Sa", "24.5.", 214],
  ["So", "25.5.", 198],
  ["Mo", "26.5.", 131],
  ["Di", "27.5.", 89],
  ["Mi", "28.5.", 97],
  ["Do", "29.5.", 156],
  ["Fr", "30.5.", 189],
];

/** Price-per-day strip; the cheapest day gets the red frame. */
const DayStrip: React.FC<{ top: number; from: number; markAt: number }> = ({ top, from, markAt }) => {
  const t = useT();
  const max = Math.max(...DAYS.map((d) => d[2]));
  const cheapest = DAYS.reduce((m, d, i) => (d[2] < DAYS[m][2] ? i : m), 0);
  const colW = 136;
  const x0 = (1080 - colW * DAYS.length) / 2;
  return (
    <>
      {DAYS.map(([wd, date, price], i) => {
        const a = prog(t, from + i * 0.09, from + i * 0.09 + 0.25);
        const h = 330 * (price / max) * a;
        const best = i === cheapest;
        return (
          <div key={date} style={{ position: "absolute", left: x0 + i * colW, top, width: colW, height: 520 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", fontFamily: fonts.bold, fontSize: 34, color: best ? GREEN : C.text, opacity: a }}>{price} €</div>
            <div style={{ position: "absolute", left: 22, right: 22, bottom: 110, height: h, borderRadius: 14, backgroundColor: best ? GREEN : "#5A5853" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: fonts.semibold, fontSize: 30, color: C.text, opacity: a }}>{wd}</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: fonts.regular, fontSize: 24, color: C.dim, opacity: a }}>{date}</div>
          </div>
        );
      })}
      <RedFrame x={x0 + cheapest * colW + 4} y={top - 14} w={colW - 8} h={548} at={markAt} />
    </>
  );
};

/** 1 · Result right after the hook: every day around the wish date, cheapest one framed. */
export const GFErgebnis: React.FC<GFSplitProps> = ({ avatar }) => {
  const t = useT();
  const card = prog(t, 0, 0.3);
  return (
    <SplitScreen avatar={avatar}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 120, height: 880, backgroundColor: C.panel, border: `2px solid ${C.panelBorder}`, borderRadius: 32, opacity: card, transform: `scale(${0.96 + 0.04 * card})` }} />
      <div style={{ position: "absolute", left: 100, top: 170, fontFamily: fonts.medium, fontSize: 28, color: C.orange, letterSpacing: 2, opacity: card }}>CLAUDE · FRANKFURT → MALLORCA</div>
      <div style={{ position: "absolute", left: 100, top: 220, fontFamily: fonts.bold, fontSize: 52, color: C.text, opacity: card }}>Preis pro Tag, Ende Mai</div>
      <DayStrip top={360} from={0.35} markAt={1.25} />
      <div style={{ position: "absolute", left: 100, right: 100, top: 900, fontFamily: fonts.regular, fontSize: 28, color: C.dim, opacity: prog(t, 1.4, 1.7) }}>Beispiel · Preise ändern sich ständig</div>
    </SplitScreen>
  );
};

const N1 = "Ich will von Frankfurt nach Mallorca, Ende Mai, plus minus drei Tage. Such mir die günstigsten Flugtage und zeig sie als Tabelle.";
const N2 = "Welche Flughäfen in meiner Nähe sind noch billiger?";

const Row: React.FC<{ y: number; cells: string[]; head?: boolean; best?: boolean; appear: number }> = ({ y, cells, head, best, appear }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", backgroundColor: head ? C.panel : "transparent", borderBottom: `2px solid ${C.panelBorder}`, opacity: appear }}>
    {cells.map((c, i) => (
      <span key={i} style={{ flex: i === 2 ? 1.6 : 1, padding: "18px 22px", fontFamily: head ? fonts.bold : i === 1 ? fonts.bold : fonts.regular, fontSize: 32, color: !head && i === 1 && best ? GREEN : i === 2 && !head ? C.blue : C.text }}>{c}</span>
    ))}
  </div>
);

export type GFNachrichtProps = { seconds?: number; typeTo?: number; sendAt?: number };

/** 3 · Nachricht 1 full-frame: typing, sending, answer as a table with source links. */
export const GFNachricht1: React.FC<GFNachrichtProps> = ({ typeTo = 4.2, sendAt = 4.5 }) => {
  const t = useT();
  const sent = t >= sendAt;
  const lines = Math.ceil(N1.length / 34);
  const tableY = 110 + 70 + lines * 52 + 90;
  const rows: [string, string, string, boolean][] = [
    ["Mo 26.5.", "131 €", "airline-a.de ↗", false],
    ["Di 27.5.", "89 €", "airline-b.de ↗", true],
    ["Mi 28.5.", "97 €", "airline-b.de ↗", false],
    ["Sa 31.5.", "204 €", "airline-a.de ↗", false],
  ];
  const r0 = sendAt + 0.6;
  return (
    <Camera keys={[[0, 540, 1560, 1.08], [sendAt - 0.1, 540, 1560, 1.08], [sendAt + 0.35, 540, 820, 1.0], [sendAt + 4, 540, 860, 1.03]]}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {sent ? (
          <>
            <UserBubble y={110} text={N1} appear={prog(t, sendAt, sendAt + 0.25)} />
            <StatusLine y={110 + 70 + lines * 52} text="Web durchsucht · 9 Quellen" appear={prog(t, sendAt + 0.25, sendAt + 0.45)} />
            <Row y={tableY} cells={["Tag", "Preis", "Quelle"]} head appear={prog(t, r0, r0 + 0.25)} />
            {rows.map(([d, p, q, best], i) => (
              <Row key={d} y={tableY + 82 * (i + 1)} cells={[d, p, q]} best={best} appear={prog(t, r0 + 0.2 + i * 0.18, r0 + 0.45 + i * 0.18)} />
            ))}
            <RedFrame x={50} y={tableY + 82 * 2 - 6} w={980} h={92} at={r0 + 1.2} />
          </>
        ) : null}
        <InputBox x={INPUT.x} y={INPUT.y} w={INPUT.w} placeholder="Schreib eine Nachricht…" text={sent ? "" : typed(N1, t, 0.1, typeTo)} caret={!sent} />
      </AbsoluteFill>
    </Camera>
  );
};

/** 4 · The trick, split: second message, nearby airports compared. */
export const GFTrick: React.FC<GFSplitProps & { typeTo?: number; sendAt?: number }> = ({ avatar, typeTo = 1.6, sendAt = 1.8 }) => {
  const t = useT();
  const sent = t >= sendAt;
  const ports: [string, string, string, boolean][] = [
    ["Frankfurt", "89 €", "Di 27.5.", false],
    ["Köln/Bonn", "64 €", "Di 27.5. · 1 h 50 Fahrt", true],
    ["Stuttgart", "79 €", "Mi 28.5. · 2 h Fahrt", false],
  ];
  const a0 = sendAt + 0.55;
  return (
    <SplitScreen avatar={avatar}>
      {sent ? (
        <>
          <UserBubble y={90} text={N2} appear={prog(t, sendAt, sendAt + 0.25)} />
          <StatusLine y={90 + 70 + Math.ceil(N2.length / 34) * 52} text="Web durchsucht" appear={prog(t, sendAt + 0.2, sendAt + 0.4)} />
          {ports.map(([n, p, d, best], i) => {
            const a = prog(t, a0 + i * 0.22, a0 + 0.3 + i * 0.22);
            return (
              <div key={n} style={{ position: "absolute", left: 60, right: 60, top: 420 + i * 170, height: 146, display: "flex", alignItems: "center", gap: 22, padding: "0 30px", boxSizing: "border-box", backgroundColor: C.panel, border: `${best ? 3 : 2}px solid ${best ? GREEN : C.panelBorder}`, borderRadius: 24, opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.text }}>{n}</div>
                  <div style={{ fontFamily: fonts.regular, fontSize: 28, color: C.dim, marginTop: 4 }}>{d}</div>
                </div>
                <div style={{ fontFamily: fonts.bold, fontSize: 52, color: best ? GREEN : C.text }}>{p}</div>
              </div>
            );
          })}
          <RedFrame x={50} y={420 + 170 - 10} w={980} h={166} at={a0 + 0.9} />
        </>
      ) : (
        <InputBox x={INPUT.x} y={700} w={INPUT.w} placeholder="Schreib eine Nachricht…" text={typed(N2, t, 0.05, typeTo)} caret />
      )}
    </SplitScreen>
  );
};
