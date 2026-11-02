import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { C, ClaudeLang, ClaudeMark, typed } from "../components/ClaudeKit";

// Felix × boilr · @moustacherecruiter · runs/bx-repost (R-009, "The money is in the old job ads"), 2026-10-16.
// Same build as BxBeforeAdBrolls: one continuous split (panel top, Felix below), a new impulse every 1-2 s, boilr green.
// All companies / names / numbers on screen are invented examples. Times = word starts on the tightened timeline (captions.json).

const TH = HOOK_THEMES.boilr;
const MINT = "#5FD3A0";
const GREEN = "#0A5F45";
const RED = "#E5484D";
const W = 1080;
const H = 1920;
const PF = 0.48;
const PH = Math.round(H * PF);
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

const A = {
  six: 1.57, pounds: 2.6, nobody: 3.92, most: 5.44, brand: 7.1, hundred: 8.31, queuing: 9.95,
  easy: 10.74, old: 11.87, step1: 12.56, search: 13.51, indeed: 14.9, screenshot: 15.6,
  step2: 16.84, drop: 17.42, claude: 18.2, ask: 18.8, open30: 20.44, which2: 21.68, same: 23.37, job: 23.76,
  step3: 24.16, ask3: 25.03, message: 26.01, manager: 26.87, role: 27.84, how: 28.73, question: 30.0,
  six2: 30.88, alone: 32.87, call: 33.92, comment: 34.28, total: 37.0,
};
export const BXR_SECONDS = 37.0;

const useTime = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const sp = (t: number, at: number, damping = 13, stiffness = 170) => (t < at ? 0 : spring({ frame: Math.round((t - at) * 25), fps: 25, config: { damping, stiffness, mass: 0.7 } }));
const pop = (t: number, at: number, from = 0.6): React.CSSProperties => {
  const a = sp(t, at, 11, 200);
  return { transform: `scale(${from + (1 - from) * a})`, opacity: Math.min(1, a * 2) };
};

const Card: React.FC<{ x: number; y: number; w: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode; dark?: boolean }> = ({ x, y, w, h, style, children, dark }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: dark ? C.panel : TH.card, border: `2px solid ${dark ? C.panelBorder : TH.line}`, borderRadius: 26, boxShadow: dark ? "0 14px 40px rgba(0,0,0,0.4)" : "0 16px 38px rgba(0,0,0,0.08)", boxSizing: "border-box", ...style }}>{children}</div>
);
const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; rot?: number; color?: string; size?: number }> = ({ t, at, text, x, y, rot = -8, color = RED, size = 30 }) => {
  if (t < at) return null;
  const a = sp(t, at, 9, 260);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * a})`, opacity: Math.min(1, a * 1.6), fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, color, border: `4px solid ${color}`, borderRadius: 10, padding: "4px 14px", background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>{text}</div>
  );
};
const Chip: React.FC<{ text: string; bg?: string; fg?: string; size?: number; style?: React.CSSProperties }> = ({ text, bg = GREEN, fg = "#FFF", size = 26, style }) => (
  <span style={{ fontFamily: fonts.semibold, fontSize: size, color: fg, background: bg, borderRadius: 999, padding: "6px 18px", whiteSpace: "nowrap", display: "inline-block", ...style }}>{text}</span>
);
const fmtGBP = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

// ---------- 1 · Hook: the 6-week-old ad = £12,000 nobody calls about (0 → "Most") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const days = Math.round(1 + 41 * ramp(t, 0.15, A.six + 0.5, Easing.inOut(Easing.cubic)));
  const money = 12000 * ramp(t, A.pounds - 0.1, A.pounds + 0.8, Easing.out(Easing.cubic));
  const blur = t > A.pounds - 0.1 && t < A.pounds + 0.6 ? 2 : 0;
  const ring = Math.sin(t * 30) * (t < A.nobody - 0.2 ? 0 : 0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 36, textAlign: "center", fontFamily: fonts.bold, fontSize: 64, color: TH.ink, lineHeight: 1.05, ...pop(t, -1) }}>
        Old job ads = <span style={{ background: GREEN, color: "#FFF", borderRadius: 14, padding: "0 14px" }}>easy commission</span>
      </div>
      <Card x={40} y={180} w={1000} h={300} style={{ padding: "26px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 44, color: TH.ink }}>Finance Manager</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 28, color: TH.dim, marginTop: 4 }}>Halden Group · Manchester · £60,000</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: TH.dim }}>posted</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 64, color: days > 30 ? RED : TH.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{days}d</div>
          </div>
        </div>
        <div style={{ height: 14, borderRadius: 7, background: "#E3EAE6", marginTop: 34, overflow: "hidden" }}>
          <div style={{ width: `${(days / 42) * 100}%`, height: "100%", background: days > 30 ? RED : MINT, borderRadius: 7 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: TH.dim }}>
          <span>week 1</span><span>week 6</span>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 40, top: 510, display: "flex", alignItems: "center", gap: 22, ...pop(t, A.pounds - 0.15, 0.5) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 112, color: GREEN, fontVariantNumeric: "tabular-nums", letterSpacing: -3, filter: blur ? `blur(${blur}px)` : undefined, transform: `scale(${1 + 0.12 * Math.max(0, Math.sin(Math.PI * ramp(t, A.pounds + 0.75, A.pounds + 1.05, Easing.linear)))})` }}>{fmtGBP(money)}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, lineHeight: 1.2 }}>commission<br />(20% of £60k)</div>
      </div>
      {t > A.nobody - 0.1 ? (
        <div style={{ position: "absolute", left: 40, top: 700, display: "flex", alignItems: "center", gap: 18, transform: `translateX(${ring}px)`, ...pop(t, A.nobody - 0.1, 0.5) }}>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: "#FFF", border: `4px solid ${TH.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>✆</div>
          <span style={{ fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>agencies calling:</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 72, color: RED }}>0</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · everyone queues on the brand-new ad ("Most" → "The easy money") ----------
const Queue: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.most - 0.05;
  const inn = sp(t, t0, 14, 160);
  const n = Math.round(3 + 97 * ramp(t, A.hundred - 0.4, A.hundred + 0.6, Easing.out(Easing.quad)));
  const dots = Math.min(60, Math.round(n * 0.6));
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <Card x={40} y={40} w={1000} h={200} style={{ padding: "24px 30px", border: `3px solid ${MINT}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Chip text="NEW" bg={MINT} fg="#0B1F18" size={24} style={pop(t, A.brand)} />
          <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>Finance Manager</span>
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 28, color: TH.dim, marginTop: 10 }}>Corvid Retail · Manchester · posted today</div>
      </Card>
      <div style={{ position: "absolute", left: 40, top: 280, fontFamily: fonts.bold, fontSize: 40, color: TH.ink, ...pop(t, t0 + 0.3) }}>Agencies calling about it</div>
      <div style={{ position: "absolute", right: 40, top: 262, fontFamily: fonts.bold, fontSize: 80, color: RED, fontVariantNumeric: "tabular-nums", ...pop(t, A.hundred - 0.4) }}>{n}{n >= 100 ? "+" : ""}</div>
      <div style={{ position: "absolute", left: 40, top: 390, width: 1000, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {Array.from({ length: dots }, (_, i) => (
          <div key={i} style={{ width: 82, height: 82, borderRadius: 41, background: i % 3 ? "#E3EAE6" : "#CFDAD4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: TH.dim, ...pop(t, A.hundred - 0.4 + i * 0.012, 0.3) }}>✆</div>
        ))}
      </div>
      <Stamp t={t} at={A.queuing} text="QUEUE" x={600} y={560} rot={-8} size={64} />
    </AbsoluteFill>
  );
};

// ---------- 3 · the easy money is in the old ones ----------
const OldOnes: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.easy - 0.25;
  const inn = sp(t, t0, 14, 160);
  const OLD = [{ r: "Finance Manager", d: 42 }, { r: "Payroll Lead", d: 37 }, { r: "FP&A Analyst", d: 51 }];
  return (
    <AbsoluteFill style={{ transform: `scale(${0.85 + 0.15 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: serifItalic, fontSize: 96, color: TH.ink, ...pop(t, t0 + 0.05, 0.7) }}>the money is in</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", ...pop(t, A.old - 0.05, 0.5) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 110, color: "#FFF", background: GREEN, borderRadius: 22, padding: "0 30px" }}>the old ones</span>
      </div>
      {OLD.map((o, i) => (
        <div key={o.r} style={{ position: "absolute", left: 70 + i * 320, top: 470 + (i % 2) * 40, ...pop(t, A.old + 0.05 + i * 0.12, 0.4) }}>
          <div style={{ width: 290, padding: "22px 24px", background: TH.card, border: `3px solid ${MINT}`, borderRadius: 22, boxShadow: `0 0 30px ${MINT}66`, transform: `rotate(${[-4, 2, -2][i]}deg)` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink }}>{o.r}</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 52, color: RED, marginTop: 6 }}>{o.d} days</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: GREEN, marginTop: 4 }}>no agency on it</div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ---------- 4 · Step 1: search niche + city, screenshot with the dates ----------
const RESULTS = [
  { r: "Finance Manager", co: "Halden Group", p: "Posted 30+ days ago", old: true },
  { r: "Finance Manager", co: "Brightwell Foods", p: "Posted 3 days ago", old: false },
  { r: "Financial Controller", co: "Albion Logistics", p: "Posted 30+ days ago", old: true },
  { r: "Finance Manager", co: "Halden Group", p: "Posted 12 days ago", old: false },
];
const Step1: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step1 - 0.1;
  const inn = sp(t, t0, 14, 160);
  const q = typed("Finance Manager · Manchester", t, A.search - 0.1, A.indeed);
  const flash = Math.max(0, 1 - Math.abs(t - (A.screenshot + 0.25)) / 0.12);
  const shot = t > A.screenshot + 0.25;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16, ...pop(t, t0) }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
        <span style={{ fontFamily: fonts.bold, fontSize: 44, color: TH.ink }}>Search niche + city</span>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 130, height: 84, borderRadius: 22, background: TH.card, border: `3px solid ${t > A.search - 0.15 ? MINT : TH.line}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 16 }}>
        <span style={{ fontSize: 34, color: TH.dim }}>⌕</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: TH.ink }}>{q}{t < A.indeed && Math.floor(t * 2) % 2 === 0 ? "|" : ""}</span>
        <span style={{ marginLeft: "auto", fontFamily: fonts.medium, fontSize: 24, color: TH.dim }}>job board</span>
      </div>
      {RESULTS.map((r, i) => {
        const a = sp(t, A.indeed - 0.2 + i * 0.12, 13, 170);
        return (
          <Card key={i} x={40} y={240 + i * 166} w={1000} h={150} style={{ padding: "18px 26px", transform: `translateX(${(1 - a) * 1100}px)`, border: shot && r.old ? `4px solid ${MINT}` : undefined }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: TH.ink }}>{r.r}</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 25, color: TH.dim, marginTop: 4 }}>{r.co} · Manchester</div>
            <div style={{ position: "absolute", right: 24, top: 46, fontFamily: fonts.semibold, fontSize: 26, color: r.old ? RED : TH.dim, background: r.old ? "#FDECEC" : "#F0F3F1", borderRadius: 12, padding: "8px 14px" }}>{r.p}</div>
          </Card>
        );
      })}
      {shot ? <div style={{ position: "absolute", right: 40, top: 30, ...pop(t, A.screenshot + 0.25, 0.4) }}><Chip text="📸 screenshot" bg={MINT} fg="#0B1F18" size={30} /></div> : null}
      <AbsoluteFill style={{ background: "#FFF", opacity: flash * 0.85, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// ---------- 5 · Step 2a: drop screenshots into Claude, ask ----------
const ASK = "Which roles have been open 30 days or more? Which companies keep advertising the same job?";
const ClaudeIn: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step2 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const txt = typed(ASK, t, A.ask - 0.05, A.which2 - 0.25);
  const sent = t > A.which2 - 0.2;
  return (
    <AbsoluteFill style={{ background: C.bg, transform: `scale(${0.9 + 0.1 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: MINT, color: "#0B1F18", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
        <ClaudeMark size={48} />
        <span style={{ fontFamily: serifItalic, fontSize: 56, color: C.text }}>Claude</span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 140, width: 1000, minHeight: 640, background: C.panel, border: `2px solid ${t > A.ask - 0.1 ? MINT : C.panelBorder}`, borderRadius: 32, padding: "26px 30px", boxSizing: "border-box", boxShadow: t > A.ask - 0.1 ? `0 0 0 4px ${MINT}55, 0 12px 40px rgba(0,0,0,0.35)` : "0 12px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 150, height: 190, borderRadius: 14, background: "#F4F6F5", border: `2px solid ${C.panelBorder}`, padding: 10, boxSizing: "border-box", ...pop(t, A.drop + i * 0.12, 0.3) }}>
              {[0, 1, 2, 3].map((j) => <div key={j} style={{ height: 32, borderRadius: 6, background: j % 2 ? "#E3EAE6" : "#FFF", marginBottom: 8, borderLeft: `5px solid ${(i + j) % 3 === 0 ? RED : MINT}` }} />)}
            </div>
          ))}
          <div style={{ alignSelf: "center", fontFamily: fonts.medium, fontSize: 26, color: C.dim, ...pop(t, A.claude) }}>4 screenshots</div>
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 40, lineHeight: 1.36, color: txt ? C.text : C.dim, marginTop: 26, minHeight: 230 }}>
          {txt || "How can I help you today?"}
          {!sent && Math.floor(t * 2) % 2 === 0 ? "|" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, border: `2px solid ${C.panelBorder}`, color: C.text, fontFamily: fonts.regular, fontSize: 46, lineHeight: "54px", textAlign: "center" }}>+</div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orange, color: "#fff", fontFamily: fonts.bold, fontSize: 36, lineHeight: "60px", textAlign: "center", transform: `scale(${sent ? 0.88 : 1})` }}>↑</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 810, display: "flex", gap: 14 }}>
        {[{ s: "30+ days", at: A.open30 }, { s: "same job twice", at: A.same }].map((c) => <span key={c.s} style={{ fontFamily: fonts.semibold, fontSize: 28, color: MINT, border: `2px solid ${MINT}`, borderRadius: 999, padding: "6px 18px", ...pop(t, c.at) }}>{c.s}</span>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6 · Step 2b: Claude's table, long-open + repeat ads highlighted ----------
const ROWS = [
  { co: "Halden Group", role: "Finance Manager", days: "42 days", rep: "posted 3×", hot: true },
  { co: "Albion Logistics", role: "Financial Controller", days: "37 days", rep: "posted 2×", hot: true },
  { co: "Fernhill Robotics", role: "FP&A Analyst", days: "51 days", rep: "—", hot: true },
  { co: "Brightwell Foods", role: "Finance Manager", days: "3 days", rep: "—", hot: false },
];
const ROW_H = 132;
const ClaudeOut: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.which2 - 0.1;
  const marked = t > A.same - 0.05;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.regular, fontSize: 30, color: C.dim, ...pop(t, t0) }}><ClaudeMark size={34} /> Read 4 screenshots · 38 listings</div>
      <div style={{ position: "absolute", left: 40, top: 120, width: 1000, display: "flex", fontFamily: fonts.semibold, fontSize: 24, color: C.dim, letterSpacing: 1, ...pop(t, t0 + 0.05, 0.9) }}>
        <span style={{ width: 430, paddingLeft: 24 }}>COMPANY · ROLE</span><span style={{ width: 230 }}>OPEN</span><span>REPEAT</span>
      </div>
      {ROWS.map((r, i) => {
        const a = sp(t, t0 + 0.1 + i * 0.12, 13, 170);
        const sel = marked && r.hot;
        return (
          <div key={r.co} style={{ position: "absolute", left: 40, top: 170 + i * (ROW_H + 12), width: 1000, height: ROW_H, background: C.panel, border: `${sel ? 4 : 2}px solid ${sel ? MINT : C.panelBorder}`, borderRadius: 22, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 24px", transform: `translateX(${(1 - a) * 1100}px)`, opacity: marked && !r.hot ? 0.4 : 1, boxShadow: sel ? `0 0 26px ${MINT}77` : undefined }}>
            <div style={{ width: 406 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.text }}>{r.co}</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 24, color: C.dim, marginTop: 4 }}>{r.role}</div>
            </div>
            <div style={{ width: 230, fontFamily: fonts.bold, fontSize: 34, color: r.hot ? MINT : C.dim }}>{r.days}</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: r.rep !== "—" ? "#FFB4A8" : C.dim }}>{r.rep}</div>
          </div>
        );
      })}
      {marked ? <div style={{ position: "absolute", left: 700, top: 120, ...pop(t, t0 + 0.9, 0.5) }}><Chip text="call these 3" bg={MINT} fg="#0B1F18" size={30} style={{ transform: "rotate(4deg)" }} /></div> : null}
      <div style={{ position: "absolute", left: 40, bottom: 22, fontFamily: fonts.regular, fontSize: 20, color: C.dim }}>example companies</div>
    </AbsoluteFill>
  );
};

// ---------- 7 · Step 3: three-line message ----------
const LINES = [
  { at: A.role, label: "THEIR ROLE", text: "Hi Priya, I'm working on Finance Manager roles in Manchester." },
  { at: A.how, label: "HOW LONG IT'S OPEN", text: "I noticed yours has been advertised since early September." },
  { at: A.question, label: "ONE QUESTION", text: "Is it still live, and would a shortlist this week help?" },
];
const Message: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step3 - 0.1;
  const inn = sp(t, t0, 14, 160);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, t0) }}>3</div>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink, ...pop(t, A.manager - 0.1, 0.8) }}>To: Hiring Manager, Halden</span>
        <Chip text="3 lines" style={pop(t, A.message)} />
      </div>
      <Card x={40} y={130} w={1000} h={640} style={{ padding: "26px 30px" }}>
        {LINES.map((l, i) => {
          const a = sp(t, l.at - 0.1, 13, 180);
          if (t < l.at - 0.15) return <div key={i} style={{ height: 190, ...pop(t, A.step3 + 0.3 + i * 0.15, 0.8) }}><div style={{ width: 220, height: 30, borderRadius: 15, background: "#E3EAE6" }} /><div style={{ width: `${[88, 80, 70][i]}%`, height: 30, borderRadius: 10, background: "#EEF2F0", marginTop: 18 }} /><div style={{ width: `${[60, 52, 40][i]}%`, height: 30, borderRadius: 10, background: "#EEF2F0", marginTop: 12 }} /></div>;
          return (
            <div key={i} style={{ height: 190, opacity: Math.min(1, a * 2), transform: `translateX(${(1 - a) * 300}px)` }}>
              <Chip text={l.label} bg={i === 2 ? "#FFF" : i === 0 ? GREEN : MINT} fg={i === 2 ? GREEN : i === 0 ? "#FFF" : "#0B1F18"} size={22} style={{ border: i === 2 ? `2px solid ${GREEN}` : undefined }} />
              <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: TH.ink, lineHeight: 1.3, marginTop: 10 }}>{l.text}</div>
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 8 · six weeks open = they can't fill it alone → your call ----------
const YourCall: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.six2 - 0.1;
  const inn = sp(t, t0, 14, 150);
  const ring = t > A.call - 0.1 ? Math.sin(t * 40) * 6 : 0;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 60, display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 120, color: RED, letterSpacing: -3 }}>6 weeks</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: TH.dim, lineHeight: 1.2 }}>open =<br />in-house search stuck</span>
      </div>
      <Stamp t={t} at={A.alone - 0.1} text="CAN'T FILL IT ALONE" x={120} y={250} rot={-5} size={48} />
      <Card x={140} y={420} w={800} h={300} style={{ padding: "30px 34px", border: `4px solid ${MINT}`, boxShadow: `0 0 36px ${MINT}88`, transform: `translateX(${ring}px)`, ...pop(t, A.call - 0.3, 0.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: GREEN, color: "#FFF", fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${10 + 8 * Math.abs(Math.sin(t * 8))}px ${MINT}55` }}>✆</div>
          <div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>Calling · Halden Group</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 56, color: TH.ink }}>That's your call.</div>
          </div>
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
          <Chip text="£12,000 commission" bg={MINT} fg="#0B1F18" size={28} />
          <Chip text="0 agencies" bg="#FFF" fg={RED} size={28} style={{ border: `2px solid ${RED}` }} />
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 9 · guide PDF scroll (Comment REPOST → end) ----------
const PAGES = Array.from({ length: 5 }, (_, i) => staticFile(`bxr-guide/p${String(i + 1).padStart(2, "0")}.png`));
const GuideScroll: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.comment;
  const inn = sp(t, t0 - 0.05, 14, 150);
  const PW = 680, PHh = Math.round(PW * 0.5625), GAPp = 22, PITCH = PHh + GAPp;
  const dur = 2.2;
  const pos = (tt: number) => ramp(tt, t0 + 0.25, t0 + 0.25 + dur, Easing.inOut(Easing.cubic)) * (PAGES.length - 1) * PITCH;
  const y = pos(t);
  const page = Math.min(PAGES.length, Math.floor((y + PHh / 2) / PITCH) + 1);
  const SAMPLES = 8;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 900}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 200, width: 840, height: 600, borderRadius: 26, overflow: "hidden", background: "#E9EEEB", boxShadow: "0 30px 70px rgba(0,0,0,0.25)", transform: `perspective(1600px) rotateX(10deg) rotate(${-2 + inn * 2}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#0B1F18", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 2 }}>
          <div style={{ width: 30, height: 36, borderRadius: 6, background: "#C9473F", color: "#FFF", fontFamily: fonts.bold, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>The old job ads playbook.pdf</div>
          <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#0B1F18", background: MINT, borderRadius: 10, padding: "4px 12px", fontVariantNumeric: "tabular-nums" }}>{page} / {PAGES.length}</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 64, bottom: 0, overflow: "hidden" }}>
          {Array.from({ length: SAMPLES }, (_, j) => {
            const yy = pos(t - (j / (SAMPLES - 1)) * 0.06);
            return (
              <div key={j} style={{ position: "absolute", left: (840 - PW) / 2, top: 30 - yy, opacity: 1 / (j + 1) }}>
                {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PW, height: PHh, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 30, top: 60, ...pop(t, t0 + 0.1) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>REPOST</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>4 prompts</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXRMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxr-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step2 - 0.1 && t < A.step3 - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.most - 0.05, Queue], [A.easy - 0.25, OldOnes], [A.step1 - 0.1, Step1], [A.step2 - 0.1, ClaudeIn], [A.which2 - 0.1, ClaudeOut],
    [A.step3 - 0.1, Message], [A.six2 - 0.1, YourCall], [A.comment - 0.1, GuideScroll],
  ];
  let idx = 0;
  scenes.forEach(([at], i) => { if (t >= at) idx = i; });
  const El = scenes[idx][1];
  const since = t - scenes[idx][0];
  const whip = idx === 0 ? 0 : Math.max(0, 1 - since / 0.18);
  const vLeft = Math.min(0, Math.max(0, W / 2 - focusX * W));
  const vTop = Math.min(PH, Math.max(0, PH - splitSrcTop));
  const push = 1 + 0.025 * Math.sin(t * 0.35);
  return (
    <ClaudeLang.Provider value="en">
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: vLeft, top: vTop, width: W, height: H, transform: `scale(${push})`, transformOrigin: "50% 30%" }}>
          <OffthreadVideo src={staticFile(avatarSrc)} muted style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: dark ? C.bg : TH.bg, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
          {!dark ? (
            <>
              <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${TH.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
              <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: -200 + Math.sin(t * 0.7) * 140, top: 100 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${TH.accentSoft}AA 0%, transparent 65%)` }} />
            </>
          ) : null}
          <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 0.9) * 5}px, ${whip * 40 + Math.sin(t * 1.3) * 3}px) scale(${1 + 0.006 * since})`, filter: whip > 0.05 ? `blur(${whip * 6}px)` : undefined }}>
            <El t={t} />
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} />
        </div>
      </AbsoluteFill>
    </ClaudeLang.Provider>
  );
};
