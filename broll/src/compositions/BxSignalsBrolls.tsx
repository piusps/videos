import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import { C, Camera, ClaudeLang, InputBox, RedFrame, StartHeader, StatusLine, UserBubble, prog, typed, useT } from "../components/ClaudeKit";

// Felix × boilr · BX-C "Claude for Recruiters" Ep. 1 (runs/bx-signals).
// English claude.ai click path, frames in boilr green. Table contents are
// shortened from Claude's real answers of 2026-10-06 (klickpfad/claude-ablauf.md).

const GREEN = "#5FD3A0";
const GLOW = "rgba(95,211,160,0.22)";
const Frame: React.FC<{ x: number; y: number; w: number; h: number; at: number }> = (p) => <RedFrame {...p} color={GREEN} glow={GLOW} />;
const En: React.FC<{ children: React.ReactNode }> = ({ children }) => <ClaudeLang.Provider value="en">{children}</ClaudeLang.Provider>;

const N1 = "Find UK fintech companies that raised funding in the last 90 days and have 50 to 200 employees. Give me the round, the date, the amount and a source link.";
const INPUT = { x: 50, y: 1560, w: 980 };

/** Claude-style markdown table with fixed row heights, so frames can be placed exactly. */
const HEAD_H = 86;
const Table: React.FC<{
  x: number;
  y: number;
  cols: { h: string; w: number }[];
  rows: string[][];
  appear: number[];
  size?: number;
  rowH?: number;
  linkCol?: number;
}> = ({ x, y, cols, rows, appear, size = 32, rowH = 92, linkCol }) => (
  <div style={{ position: "absolute", left: x, top: y, border: `2px solid ${C.panelBorder}`, borderRadius: 18, overflow: "hidden", backgroundColor: "#1F1E1D" }}>
    <div style={{ display: "flex", height: HEAD_H, alignItems: "center", borderBottom: `2px solid ${C.panelBorder}`, backgroundColor: "#262624" }}>
      {cols.map((c) => (
        <div key={c.h} style={{ width: c.w, padding: "0 22px", boxSizing: "border-box", fontFamily: fonts.semibold, fontSize: size, color: C.text }}>
          {c.h}
        </div>
      ))}
    </div>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", height: rowH, alignItems: "center", borderTop: i ? `2px solid ${C.panelBorder}` : undefined, opacity: appear[i] ?? 1 }}>
        {r.map((cell, j) => (
          <div
            key={j}
            style={{
              width: cols[j].w,
              padding: "0 22px",
              boxSizing: "border-box",
              fontFamily: j === 0 ? fonts.semibold : fonts.regular,
              fontSize: size,
              lineHeight: 1.3,
              color: j === linkCol ? "#7FA8F5" : C.text,
              textDecoration: j === linkCol ? "underline" : undefined,
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    ))}
  </div>
);
/** top y of row i (0-based) inside a Table placed at y. */
const rowTop = (y: number, i: number, rowH = 92) => y + 2 + HEAD_H + 2 + i * (rowH + 2);

const FUNDING_COLS = [
  { h: "Company", w: 250 },
  { h: "Round", w: 180 },
  { h: "Date", w: 150 },
  { h: "Amount", w: 160 },
  { h: "Source", w: 260 },
];
const FUNDING_ROWS = [
  ["LemonEdge", "Series A", "29 Jul", "$21M", "UKTN"],
  ["Kody", "Series B", "17 Aug", "$19.9M", "FundedIQ"],
  ["Ryft", "Series B", "17 Sep", "£20M", "The Paypers"],
];

/** 1 · "You're the hundredth agency calling": hiring manager's inbox floods with agency CVs. */
const AGENCIES = ["Apex Talent", "Northbridge Recruitment", "Harbour Search", "Kestrel People", "Meridian Partners", "Blueline Resourcing", "Oakfield Talent", "Sterling Search"];
export const BXInbox: React.FC = () => {
  const t = useT();
  const count = Math.min(100, Math.round(Math.pow(Math.min(t / 2.6, 1), 1.6) * 100));
  return (
    <AbsoluteFill style={{ backgroundColor: "#141413" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 230 }}>
        <div style={{ fontFamily: fonts.medium, fontSize: 30, color: C.dim }}>Job posted · 2 hours ago</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 10 }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 56, color: C.text, flex: 1 }}>Inbox</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 46, color: "#fff", backgroundColor: "#E5484D", borderRadius: 999, padding: "8px 30px", minWidth: 90, textAlign: "center" }}>{count}</div>
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 30, color: C.dim, marginTop: 6 }}>Re: Senior Implementation Consultant</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 470, height: 1180, overflow: "hidden" }}>
        {(() => {
          // newest on top: each new mail pushes the list down by one row
          const rowH = 150;
          const shown = Math.max(0, Math.floor((t - 0.15) / 0.17) + 1);
          return Array.from({ length: Math.min(shown, 14) }).map((_, k) => {
            const i = shown - 1 - k;
            const at = 0.15 + i * 0.17;
            const a = prog(t, at, at + 0.15);
            const name = AGENCIES[i % AGENCIES.length];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: k * rowH,
                  height: rowH - 16,
                  backgroundColor: "#262624",
                  border: `2px solid ${C.panelBorder}`,
                  borderRadius: 22,
                  padding: "22px 28px",
                  boxSizing: "border-box",
                  opacity: k === 0 ? a : 1,
                  transform: k === 0 ? `translateY(${(1 - a) * -30}px)` : undefined,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: C.text }}>{name}</span>
                  <span style={{ fontFamily: fonts.regular, fontSize: 28, color: C.faint }}>now</span>
                </div>
                <div style={{ fontFamily: fonts.regular, fontSize: 30, color: C.dim, marginTop: 8 }}>3 great candidates for your role · CVs attached</div>
              </div>
            );
          });
        })()}
      </div>
    </AbsoluteFill>
  );
};

/** 2 · Step 1: type the prompt, send, web search, "Strong matches" table. */
export const BXStep1: React.FC = () => {
  const t = useT();
  const sendAt = 2.6;
  const sent = t >= sendAt;
  const tableY = 900;
  const inputY = 860;
  return (
    <En>
      <Camera
        keys={[
          [0, 540, 960, 1.0],
          [2.4, 540, 960, 1.0],
          [2.9, 540, 960, 1.0],
          [5.2, 540, 960, 1.0],
          [5.6, 540, rowTop(tableY, 0) + 40, 1.02],
          [6.9, 540, rowTop(tableY, 0) + 40, 1.03],
        ]}
      >
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          {!sent ? <StartHeader y={600} /> : null}
          {!sent ? <InputBox x={INPUT.x} y={inputY} w={INPUT.w} text={typed(N1, t, 0.2, 2.2)} caret /> : null}
          {!sent ? <Frame x={INPUT.x} y={inputY} w={INPUT.w} h={310} at={2.25} /> : null}
          {sent ? <UserBubble y={330} text={N1} appear={prog(t, sendAt, sendAt + 0.25)} /> : null}
          {sent ? <StatusLine y={720} text="Searched the web, read 4 pages" appear={prog(t, sendAt + 0.3, sendAt + 0.5)} /> : null}
          {sent ? (
            <div style={{ position: "absolute", left: 60, top: 800, fontFamily: fonts.bold, fontSize: 42, color: C.text, opacity: prog(t, 3.1, 3.4) }}>Strong matches</div>
          ) : null}
          {sent ? (
            <Table
              x={40}
              y={tableY}
              cols={FUNDING_COLS}
              rows={FUNDING_ROWS}
              appear={[prog(t, 3.4, 3.7), prog(t, 3.65, 3.95), prog(t, 3.9, 4.2)]}
              linkCol={4}
            />
          ) : null}
          {sent ? <Frame x={40} y={rowTop(tableY, 0)} w={1000} h={92} at={5.3} /> : null}
        </AbsoluteFill>
      </Camera>
    </En>
  );
};

/** 3 · The example: LemonEdge's funding announcement. */
export const BXNews: React.FC = () => {
  const t = useT();
  const s = 0.95 + 0.05 * prog(t, 0, 0.4);
  const hl = prog(t, 0.5, 0.8);
  const hl2 = prog(t, 2.2, 2.5);
  const mark = (on: number, text: string) => (
    <span style={{ backgroundImage: `linear-gradient(rgba(95,211,160,0.45), rgba(95,211,160,0.45))`, backgroundRepeat: "no-repeat", backgroundSize: `${on * 100}% 100%`, padding: "0 4px", borderRadius: 6 }}>{text}</span>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#141413", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 980, backgroundColor: "#fff", borderRadius: 22, padding: "56px 54px", boxSizing: "border-box", transform: `scale(${s})`, boxShadow: "0 30px 90px rgba(0,0,0,0.6)", marginTop: -160 }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, letterSpacing: 2, color: "#0A5F45" }}>FUNDING · 29 JUL 2026</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 64, lineHeight: 1.12, color: "#111", marginTop: 18 }}>
          LemonEdge raises {mark(hl, "$21M Series A")} led by Blackstone
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.45, color: "#333", marginTop: 26 }}>
          The fund accounting platform plans to expand in the US and Europe and {mark(hl2, "win a wave of new clients")} over the next 12 months.
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          {["London / New York", "~72 staff", "Press release"].map((c) => (
            <span key={c} style={{ fontFamily: fonts.medium, fontSize: 26, color: "#444", backgroundColor: "#F1F1EE", borderRadius: 999, padding: "8px 20px" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const HIRE_ROWS = [
  ["LemonEdge", "Implementation consultants, onboarding leads"],
  ["Ryft", "EU compliance (MLRO), enterprise sales"],
  ["FintechOS", "US solution engineers, US sales"],
];

/** 4 · Step 2 answer: "Likely hires (next 3 months)", frame on implementation consultants. */
export const BXHires: React.FC = () => {
  const t = useT();
  const y = 800;
  const rh = 130;
  return (
    <En>
      <Camera keys={[[0, 540, 960, 1.0], [0.4, 540, rowTop(y, 0, rh) + 20, 1.05], [3.3, 540, rowTop(y, 0, rh) + 20, 1.07]]}>
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          <UserBubble y={430} text="Which roles will each one hire in the next 3 months, and why?" appear={1} />
          <StatusLine y={680} text="Gathering fund-use details for each company" appear={1} />
          <Table
            x={40}
            y={y}
            cols={[
              { h: "Company", w: 290 },
              { h: "Likely hires (next 3 months)", w: 710 },
            ]}
            rows={HIRE_ROWS}
            appear={[prog(t, 0, 0.25), prog(t, 0.2, 0.45), prog(t, 0.4, 0.65)]}
            size={36}
            rowH={rh}
          />
          <Frame x={330} y={rowTop(y, 0, rh)} w={710} h={rh} at={0.55} />
        </AbsoluteFill>
      </Camera>
    </En>
  );
};

/** 5 · Step 3: the one-line opener. */
export const BXOpener: React.FC = () => {
  const t = useT();
  return (
    <En>
      <Camera keys={[[0, 540, 960, 1.0], [2.9, 540, 960, 1.03]]}>
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          <UserBubble y={420} text="Give me a one-line opener for a call to their hiring manager." appear={prog(t, 0, 0.2)} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 700, fontFamily: fonts.bold, fontSize: 42, color: C.text, opacity: prog(t, 0.3, 0.5) }}>LemonEdge</div>
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              top: 790,
              fontFamily: fonts.regular,
              fontSize: 54,
              lineHeight: 1.4,
              color: C.text,
              borderLeft: `8px solid ${GREEN}`,
              paddingLeft: 34,
              opacity: prog(t, 0.45, 0.75),
            }}
          >
            “Congrats on the Blackstone round. If you're onboarding a wave of new fund clients, who's going to implement them?”
          </div>
        </AbsoluteFill>
      </Camera>
    </En>
  );
};

/** 6 · Always open the source: Claude flags what it couldn't confirm. */
export const BXSource: React.FC = () => {
  const t = useT();
  const y = 560;
  return (
    <En>
      <Camera keys={[[0, 540, 960, 1.0], [3.3, 540, 960, 1.03]]}>
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          <Table x={40} y={y} cols={FUNDING_COLS} rows={FUNDING_ROWS.slice(0, 2)} appear={[1, 1]} linkCol={4} />
          <Frame x={780} y={rowTop(y, 0)} w={260} h={92} at={0.4} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 900, fontFamily: fonts.regular, fontSize: 42, lineHeight: 1.5, color: C.text, opacity: prog(t, 0.9, 1.2) }}>
            Kody: I couldn't find a press release or news article confirming the round.{" "}
            <span style={{ fontFamily: fonts.semibold }}>Treat this one as unconfirmed.</span>
          </div>
          <Frame x={44} y={890} w={992} h={210} at={1.95} />
        </AbsoluteFill>
      </Camera>
    </En>
  );
};
