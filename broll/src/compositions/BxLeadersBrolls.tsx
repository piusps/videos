import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import { C, Camera, ClaudeLang, InputBox, RedFrame, StartHeader, StatusLine, UserBubble, prog, typed, useT } from "../components/ClaudeKit";

// Felix × boilr · BX-C "Claude for Recruiters" · runs/bx-leaders (new sales leaders).
// Same look as BxSignalsBrolls: English claude.ai, frames in boilr mint green.
// Table rows are real public appointments checked on 2026-10-08 (sources in runs/bx-leaders/brief.md):
// Tokenovate (new CRO, 1 Oct 2026, Securities Finance Times) and NFON UK (new MD & Head of Sales, 5 Oct 2026, IT Brief UK).
// No person names on screen. "Likely hires" are Claude-style hypotheses, labelled as such.

const GREEN = "#5FD3A0";
const GLOW = "rgba(95,211,160,0.22)";
const Frame: React.FC<{ x: number; y: number; w: number; h: number; at: number }> = (p) => <RedFrame {...p} color={GREEN} glow={GLOW} />;
const En: React.FC<{ children: React.ReactNode }> = ({ children }) => <ClaudeLang.Provider value="en">{children}</ClaudeLang.Provider>;

const N1 = "Find British software companies that appointed a new sales director in the last 30 days. Give me the company, the date and the source.";

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
const rowTop = (y: number, i: number, rowH = 92) => y + 2 + HEAD_H + 2 + i * (rowH + 2);

const LEADER_COLS = [
  { h: "Company", w: 250 },
  { h: "New role", w: 300 },
  { h: "Date", w: 140 },
  { h: "Source", w: 310 },
];
const LEADER_ROWS = [
  ["Tokenovate", "Chief Revenue Officer", "1 Oct", "Securities Finance Times"],
  ["NFON UK", "MD & Head of Sales", "5 Oct", "IT Brief UK"],
];

/** 1 · Step 1: type the prompt, send, web search, table of new sales leaders. */
export const BXLStep1: React.FC = () => {
  const t = useT();
  const sendAt = 5.6;
  const sent = t >= sendAt;
  const tableY = 900;
  const inputY = 860;
  const rh = 120;
  return (
    <En>
      <Camera
        keys={[
          [0, 540, 960, 1.0],
          [5.5, 540, 960, 1.0],
          [7.2, 540, 960, 1.0],
          [7.7, 540, rowTop(tableY, 0, rh) + 60, 1.03],
          [10, 540, rowTop(tableY, 0, rh) + 60, 1.03],
        ]}
      >
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          {!sent ? <StartHeader y={600} /> : null}
          {!sent ? <InputBox x={50} y={inputY} w={980} text={typed(N1, t, 0.9, 5.0)} caret /> : null}
          {!sent ? <Frame x={50} y={inputY} w={980} h={310} at={5.0} /> : null}
          {sent ? <UserBubble y={330} text={N1} appear={prog(t, sendAt, sendAt + 0.25)} /> : null}
          {sent ? <StatusLine y={720} text="Searched the web, read 6 pages" appear={prog(t, sendAt + 0.3, sendAt + 0.5)} /> : null}
          {sent ? (
            <div style={{ position: "absolute", left: 60, top: 800, fontFamily: fonts.bold, fontSize: 42, color: C.text, opacity: prog(t, 6.0, 6.3) }}>New sales leaders (confirmed)</div>
          ) : null}
          {sent ? (
            <Table x={40} y={tableY} cols={LEADER_COLS} rows={LEADER_ROWS} appear={[prog(t, 6.3, 6.6), prog(t, 6.6, 6.9)]} linkCol={3} rowH={rh} />
          ) : null}
          {sent ? <Frame x={40} y={rowTop(tableY, 0, rh)} w={1000} h={rh} at={7.4} /> : null}
        </AbsoluteFill>
      </Camera>
    </En>
  );
};

const HIRE_ROWS = [
  ["Tokenovate", "Account executives, solutions consultants"],
  ["NFON UK", "Partner managers, enterprise sales"],
];

/** 2 · Step 2: which roles each new leader will hire next, and why. */
export const BXLHires: React.FC = () => {
  const t = useT();
  const y = 760;
  const rh = 150;
  return (
    <En>
      <Camera keys={[[0, 540, 960, 1.0], [0.4, 540, rowTop(y, 0, rh) + 40, 1.04], [4, 540, rowTop(y, 0, rh) + 40, 1.05]]}>
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          <UserBubble y={400} text="Which roles will each new leader hire next, and why?" appear={prog(t, 0, 0.2)} />
          <StatusLine y={640} text="Reading the announcements and current job ads" appear={prog(t, 0.15, 0.35)} />
          <Table
            x={40}
            y={y}
            cols={[
              { h: "Company", w: 290 },
              { h: "Likely hires (next 90 days)", w: 710 },
            ]}
            rows={HIRE_ROWS}
            appear={[prog(t, 0.3, 0.55), prog(t, 0.5, 0.75)]}
            size={36}
            rowH={rh}
          />
          <div style={{ position: "absolute", left: 60, right: 60, top: rowTop(y, 2, rh) + 30, fontFamily: fonts.regular, fontSize: 34, lineHeight: 1.45, color: C.dim, opacity: prog(t, 1.0, 1.3) }}>
            Why: a new revenue leader hired to grow the pipeline usually builds the team first. Treat these as hypotheses for the call.
          </div>
          <Frame x={330} y={rowTop(y, 0, rh)} w={710} h={rh} at={0.8} />
        </AbsoluteFill>
      </Camera>
    </En>
  );
};

/** 3 · Step 3: congratulations message that offers one useful thing. */
export const BXLMessage: React.FC = () => {
  const t = useT();
  return (
    <En>
      <Camera keys={[[0, 540, 960, 1.0], [4, 540, 960, 1.03]]}>
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
          <UserBubble y={330} text="Write a congratulations message that offers one useful thing, not my services." appear={prog(t, 0, 0.2)} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 720, fontFamily: fonts.bold, fontSize: 42, color: C.text, opacity: prog(t, 0.3, 0.5) }}>Tokenovate</div>
          <div
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              top: 810,
              fontFamily: fonts.regular,
              fontSize: 50,
              lineHeight: 1.4,
              color: C.text,
              borderLeft: `8px solid ${GREEN}`,
              paddingLeft: 34,
              opacity: prog(t, 0.45, 0.75),
            }}
          >
            “Congrats on the new role. If you're planning the sales team for the next quarter, I've pulled current AE salary ranges for UK capital markets tech. Happy to send them over.”
          </div>
          <Frame x={40} y={790} w={1000} h={390} at={1.4} />
        </AbsoluteFill>
      </Camera>
    </En>
  );
};

/** 4 · Always open the source: the real announcement behind row 1. */
export const BXLSource: React.FC = () => {
  const t = useT();
  const s = 0.95 + 0.05 * prog(t, 0, 0.4);
  const hl = prog(t, 0.5, 0.8);
  const hl2 = prog(t, 1.6, 1.9);
  const mark = (on: number, text: string) => (
    <span style={{ backgroundImage: `linear-gradient(rgba(95,211,160,0.45), rgba(95,211,160,0.45))`, backgroundRepeat: "no-repeat", backgroundSize: `${on * 100}% 100%`, padding: "0 4px", borderRadius: 6 }}>{text}</span>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#141413", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 980, backgroundColor: "#fff", borderRadius: 22, padding: "56px 54px", boxSizing: "border-box", transform: `scale(${s})`, boxShadow: "0 30px 90px rgba(0,0,0,0.6)", marginTop: -160 }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, letterSpacing: 2, color: "#0A5F45" }}>PEOPLE MOVES · 01 OCT 2026</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 64, lineHeight: 1.12, color: "#111", marginTop: 18 }}>
          Tokenovate appoints {mark(hl, "new Chief Revenue Officer")}
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.45, color: "#333", marginTop: 26 }}>
          The new CRO will focus on {mark(hl2, "expanding the commercial pipeline")} as the company works to scale the business.
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          {["Securities Finance Times", "UK", "Source ↗"].map((c) => (
            <span key={c} style={{ fontFamily: fonts.medium, fontSize: 26, color: "#444", backgroundColor: "#F1F1EE", borderRadius: 999, padding: "8px 20px" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
