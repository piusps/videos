import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { C, ClaudeLang, ClaudeMark, typed } from "../components/ClaudeKit";

// Felix × boilr · @moustacherecruiter · runs/bx-before-the-ad ("Stop waiting for job ads. Recruiters don't.").
// Same build as BxUniJobBrolls: one continuous split (panel top, Felix below), a new impulse every 1-2 s,
// dopamine level medium, boilr green. All names / companies / numbers on screen are invented examples.

const TH = HOOK_THEMES.boilr;
const MINT = "#5FD3A0";
const GREEN = "#0A5F45";
const RED = "#E5484D";
const AMBER = "#B07A12";
const W = 1080;
const H = 1920;
const PF = 0.48;
const PH = Math.round(H * PF);
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

export type BxbTimes = {
  slowest: number; recruiter: number; calls: number; written: number; sodo: number; signals: number;
  open: number; ask: number; raised: number; degree: number; pick: number; manager: number; why: number;
  send: number; news: number; skill: number; question: number; never: number; thats: number; before: number; comment: number; total: number;
};
export type BxbProps = { A: BxbTimes; avatarSrc: string; seconds?: number; splitSrcTop?: number; focusX?: number };

const DEF: BxbTimes = { slowest: 3.2, recruiter: 4.6, calls: 5.6, written: 7.4, sodo: 8.2, signals: 9.4, open: 10.2, ask: 11.0, raised: 12.6, degree: 16.8, pick: 17.6, manager: 19.0, why: 19.8, send: 21.6, news: 23.0, skill: 23.8, question: 24.6, never: 25.6, thats: 27.4, before: 28.8, comment: 30.0, total: 33.0 };

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
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * a})`, opacity: Math.min(1, a * 1.6), fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, color, border: `4px solid ${color}`, borderRadius: 10, padding: "4px 14px", background: "rgba(255,255,255,0.88)", whiteSpace: "nowrap" }}>{text}</div>
  );
};
const Chip: React.FC<{ text: string; bg?: string; fg?: string; size?: number; style?: React.CSSProperties }> = ({ text, bg = GREEN, fg = "#FFF", size = 26, style }) => (
  <span style={{ fontFamily: fonts.semibold, fontSize: size, color: fg, background: bg, borderRadius: 999, padding: "6px 18px", whiteSpace: "nowrap", display: "inline-block", ...style }}>{text}</span>
);

// ---------- 1 · job board on refresh (0 → "I'm a recruiter") ----------
const ADS = [
  { title: "Graduate Marketing Assistant", co: "Brightwell Retail", base: 212 },
  { title: "Junior Data Analyst", co: "Halden Analytics", base: 348 },
  { title: "Graduate Operations Scheme", co: "Albion Logistics", base: 486 },
  { title: "Business Development Associate", co: "Corvid Consulting", base: 171 },
];
const JobBoard: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const spin = (t * 540) % 360;
  const refreshes = Math.floor(t / 0.55);
  const grow = ramp(t, 0.1, A.slowest + 0.4, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 84, borderRadius: 22, background: TH.card, border: `2px solid ${TH.line}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px", ...pop(t, 0, 0.85) }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, border: `5px solid ${GREEN}`, borderTopColor: "transparent", transform: `rotate(${spin}deg)` }} />
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.ink }}>graduate jobs · Leeds</span>
        <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 26, color: TH.dim }}>refresh #{refreshes + 1}</span>
      </div>
      {ADS.map((ad, i) => {
        const a = sp(t, 0.1 + i * 0.22, 13, 170);
        const n = Math.round(ad.base * (0.35 + 0.65 * grow) + Math.floor(t * 9) * (i + 1));
        const hot = t > A.slowest - 0.1;
        return (
          <Card key={ad.title} x={40} y={150 + i * 178} w={1000} h={160} style={{ padding: "20px 28px", transform: `translateX(${(1 - a) * 1100}px)` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: TH.ink }}>{ad.title}</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 25, color: TH.dim, marginTop: 4 }}>{ad.co} · posted {i + 1} day{i ? "s" : ""} ago</div>
            <div style={{ position: "absolute", right: 26, top: 30, textAlign: "right" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 52, color: hot ? RED : TH.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 22, color: TH.dim }}>applicants</div>
            </div>
          </Card>
        );
      })}
      <Stamp t={t} at={A.slowest} text="TOO LATE" x={560} y={420} rot={-10} size={58} />
    </AbsoluteFill>
  );
};

// ---------- 2 · how a role really starts (I'm a recruiter → So do what I do) ----------
const STEPS = [
  { k: "News", d: "money raised, new office", icon: "£" },
  { k: "Manager needs help", d: "more work than people", icon: "!" },
  { k: "Recruiter gets the call", d: "that's me", icon: "✆" },
  { k: "Job ad goes live", d: "everyone applies", icon: "▤" },
];
const Timeline: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.recruiter;
  const inn = sp(t, t0, 14, 150);
  const at = (i: number) => t0 + 0.15 + i * Math.max(0.25, (A.written - t0 - 0.4) / 4);
  const call = t > A.calls - 0.1;
  const notYet = t > A.written - 0.2;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 40, color: TH.ink, ...pop(t, t0 + 0.05) }}>How a job really starts</div>
      <div style={{ position: "absolute", left: 112, top: 150, width: 8, height: 4 * 175 - 60, background: "#DDE5E0", borderRadius: 4 }}>
        <div style={{ width: "100%", height: `${ramp(t, t0 + 0.1, at(3) + 0.3) * 100}%`, background: `linear-gradient(180deg, ${MINT}, ${GREEN})`, borderRadius: 4 }} />
      </div>
      {STEPS.map((s, i) => {
        const a = sp(t, at(i), 12, 180);
        const isCall = i === 2 && call;
        const isAd = i === 3;
        return (
          <div key={s.k} style={{ position: "absolute", left: 60, top: 140 + i * 175, display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, a * 2), transform: `translateX(${(1 - a) * -400}px)` }}>
            <div style={{ width: 112, height: 112, borderRadius: 56, background: isCall ? GREEN : isAd ? "#FFF" : TH.card, border: `4px ${isAd && notYet ? "dashed" : "solid"} ${isCall ? MINT : isAd && notYet ? RED : GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 50, color: isCall ? "#FFF" : GREEN, boxShadow: isCall ? `0 0 0 ${10 + 6 * Math.sin(t * 9)}px ${MINT}44` : undefined }}>{s.icon}</div>
            <div style={{ opacity: isAd && notYet ? 0.45 : 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink, textDecoration: isAd && notYet ? "line-through" : undefined }}>{s.k}</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 27, color: TH.dim }}>{s.d}</div>
            </div>
            {isCall ? <Chip text="I start here" style={{ marginLeft: 10, ...pop(t, A.calls) }} /> : null}
          </div>
        );
      })}
      <Stamp t={t} at={A.written} text="NOT WRITTEN YET" x={470} y={700} rot={-6} size={40} />
      {/* "you are here" marker sits at the end */}
      <div style={{ position: "absolute", left: 640, top: 805, ...pop(t, at(3) + 0.25) }}>
        <Chip text="you wait here" bg="#FFF" fg={RED} style={{ border: `3px solid ${RED}` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · read the signals (So do what I do → Open Claude) ----------
const SIGS = [
  { t: "£6M raised", x: 70, y: 150, r: -6 },
  { t: "New Leeds office", x: 560, y: 120, r: 5 },
  { t: "New Head of Marketing", x: 120, y: 650, r: 4 },
  { t: "Big new contract", x: 600, y: 610, r: -5 },
  { t: "8 roles in one team", x: 330, y: 760, r: -2 },
];
const Signals: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.sodo;
  const inn = sp(t, t0, 14, 160);
  const sweep = (t * 220) % 360;
  const gap = Math.max(0.18, Math.min(0.3, (A.open - t0 - 0.3) / 5));
  return (
    <AbsoluteFill style={{ transform: `scale(${0.85 + 0.15 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 540 - 300, top: 470 - 300, width: 600, height: 600, borderRadius: 300, border: `3px solid ${GREEN}55`, overflow: "hidden", background: `radial-gradient(circle, ${MINT}22 0%, transparent 70%)` }}>
        {[200, 120].map((r) => <div key={r} style={{ position: "absolute", left: 300 - r, top: 300 - r, width: r * 2, height: r * 2, borderRadius: r, border: `2px solid ${GREEN}33` }} />)}
        <div style={{ position: "absolute", inset: 0, background: `conic-gradient(from ${sweep}deg, ${MINT}AA, transparent 60deg)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: serifItalic, fontSize: 92, color: TH.ink, ...pop(t, A.signals - 0.05, 0.7) }}>read the signals</div>
      {SIGS.map((s, i) => {
        const at = t0 + 0.25 + i * gap;
        if (t < at) return null;
        return (
          <div key={s.t} style={{ position: "absolute", left: s.x, top: s.y, ...pop(t, at, 0.4) }}>
            <span style={{ display: "inline-block", transform: `rotate(${s.r}deg)`, fontFamily: fonts.bold, fontSize: 34, color: i % 2 ? "#0B1F18" : "#FFF", background: i % 2 ? MINT : GREEN, borderRadius: 16, padding: "12px 22px", boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>{s.t}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 4 · claude.ai: the prompt (Open Claude → … my degree) ----------
const ASK = "Which companies near me raised money or opened a new office in the last 90 days? And which of them hire people with my degree?";
const ClaudeIn: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.open;
  const inn = sp(t, t0, 15, 160);
  const sent = t > A.degree + 0.15;
  const txt = typed(ASK, t, A.ask - 0.05, A.degree);
  return (
    <AbsoluteFill style={{ background: C.bg, transform: `scale(${0.9 + 0.1 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        <ClaudeMark size={56} />
        <span style={{ fontFamily: serifItalic, fontSize: 64, color: C.text }}>Good evening</span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 230, width: 1000, minHeight: 420, background: C.panel, border: `2px solid ${t > A.ask - 0.1 ? MINT : C.panelBorder}`, borderRadius: 32, padding: "30px 32px", boxSizing: "border-box", boxShadow: t > A.ask - 0.1 ? `0 0 0 4px ${MINT}55, 0 12px 40px rgba(0,0,0,0.35)` : "0 12px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ fontFamily: fonts.regular, fontSize: 40, lineHeight: 1.36, color: txt ? C.text : C.dim, minHeight: 270 }}>
          {txt || "How can I help you this evening?"}
          {!sent && Math.floor(t * 2) % 2 === 0 ? "|" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, border: `2px solid ${C.panelBorder}`, color: C.text, fontFamily: fonts.regular, fontSize: 46, lineHeight: "54px", textAlign: "center" }}>+</div>
          <span style={{ fontFamily: fonts.medium, fontSize: 26, color: MINT, border: `2px solid ${MINT}`, borderRadius: 999, padding: "6px 16px", ...pop(t, t0 + 0.4) }}>🌐 Web search</span>
          <div style={{ flex: 1 }} />
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orange, color: "#fff", fontFamily: fonts.bold, fontSize: 36, lineHeight: "60px", textAlign: "center", transform: `scale(${sent ? 0.88 : 1})` }}>↑</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 690, display: "flex", gap: 14 }}>
        {[{ s: "near me", at: A.ask + 0.3 }, { s: "last 90 days", at: A.raised + 0.6 }, { s: "my degree", at: A.degree - 0.2 }].map((c) => <span key={c.s} style={{ fontFamily: fonts.semibold, fontSize: 28, color: MINT, border: `2px solid ${MINT}`, borderRadius: 999, padding: "6px 18px", ...pop(t, c.at) }}>{c.s}</span>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5 · Claude's answer: signal table, pick one (… degree → Ask Claude who …) ----------
const ROWS = [
  { co: "Fernhill Robotics", sig: "Raised £6M · 12 Sep", why: "Engineering + ops hires" },
  { co: "Copperleaf Health", sig: "New Leeds office · 2 Oct", why: "Admin, marketing, data" },
  { co: "Northgate Foods", sig: "New Head of Marketing · 24 Sep", why: "Building a new team" },
  { co: "Lantern Studio", sig: "Big NHS contract · 30 Sep", why: "Project + research roles" },
];
const ROW_H = 150;
const rowTop = (i: number) => 230 + i * (ROW_H + 14);
const ClaudeOut: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.degree + 0.2;
  const picked = t > A.pick + 0.15;
  const gap = Math.max(0.12, Math.min(0.22, (A.pick - t0 - 0.2) / 4));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", left: 40, top: 50, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.regular, fontSize: 30, color: C.dim, ...pop(t, t0) }}><ClaudeMark size={34} /> Searched the web · 14 sources</div>
      <div style={{ position: "absolute", left: 40, top: 140, width: 1000, display: "flex", fontFamily: fonts.semibold, fontSize: 24, color: C.dim, letterSpacing: 1, ...pop(t, t0 + 0.05, 0.9) }}>
        <span style={{ width: 330, paddingLeft: 24 }}>COMPANY</span><span style={{ width: 390 }}>SIGNAL</span><span>SOURCE</span>
      </div>
      {ROWS.map((r, i) => {
        const a = sp(t, t0 + 0.1 + i * gap, 13, 170);
        const sel = picked && i === 1;
        const dim = picked && i !== 1;
        return (
          <div key={r.co} style={{ position: "absolute", left: 40, top: rowTop(i), width: 1000, height: ROW_H, background: C.panel, border: `${sel ? 4 : 2}px solid ${sel ? MINT : C.panelBorder}`, borderRadius: 22, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 24px", transform: `translateX(${(1 - a) * 1100}px) scale(${sel ? 1 + 0.02 * sp(t, A.pick + 0.15) : 1})`, opacity: dim ? 0.4 : 1, boxShadow: sel ? `0 0 30px ${MINT}88` : undefined }}>
            <div style={{ width: 306 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 32, color: C.text }}>{r.co}</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 22, color: C.dim, marginTop: 4 }}>{r.why}</div>
            </div>
            <div style={{ width: 390, fontFamily: fonts.semibold, fontSize: 28, color: MINT }}>{r.sig}</div>
            <span style={{ fontFamily: fonts.medium, fontSize: 22, color: C.text, border: `2px solid ${C.panelBorder}`, borderRadius: 999, padding: "6px 14px" }}>↗ link</span>
          </div>
        );
      })}
      {picked ? <div style={{ position: "absolute", left: 640, top: rowTop(1) - 34, ...pop(t, A.pick + 0.2, 0.5) }}><Chip text="pick one" bg={MINT} fg="#0B1F18" size={30} style={{ transform: "rotate(4deg)" }} /></div> : null}
      <div style={{ position: "absolute", left: 40, bottom: 26, fontFamily: fonts.regular, fontSize: 20, color: C.dim }}>example companies</div>
    </AbsoluteFill>
  );
};

// ---------- 6 · who'd be your manager + why (Ask Claude who … → Then send) ----------
const Manager: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.manager - 0.35;
  const inn = sp(t, t0, 14, 160);
  const why = sp(t, A.why, 12, 170);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", right: 40, top: 40, maxWidth: 820, background: C.userBubble, borderRadius: 24, padding: "16px 24px", fontFamily: fonts.regular, fontSize: 28, lineHeight: 1.35, color: C.text, transform: `translateY(${(1 - inn) * -160}px)` }}>Copperleaf Health: who would be my manager? And why will they need help soon?</div>
      <Card dark x={40} y={210} w={1000} h={300} style={{ padding: "28px 32px", transform: `translateX(${(1 - sp(t, t0 + 0.25, 13, 170)) * -1100}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.semibold, fontSize: 24, color: C.dim, letterSpacing: 1.5 }}><ClaudeMark size={28} /> LIKELY MANAGER</div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 22 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: `linear-gradient(135deg, ${GREEN}, ${MINT})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 52, color: "#FFF" }}>?</div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 46, color: C.text }}>Operations Manager</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 28, color: C.dim, marginTop: 6 }}>Leeds office · named on their team page</div>
          </div>
        </div>
      </Card>
      <Card dark x={40} y={540} w={1000} h={330} style={{ padding: "28px 32px", border: `3px solid ${why > 0.5 ? MINT : C.panelBorder}`, transform: `translateY(${(1 - why) * 500}px)`, opacity: Math.min(1, why * 2) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: MINT, letterSpacing: 1.5 }}>WHY THEY'LL NEED HELP SOON</div>
        {["New office opened 2 Oct", "40 new clinics to onboard by March", "Team of 3 today"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontFamily: fonts.semibold, fontSize: 34, color: C.text, ...pop(t, A.why + 0.25 + i * 0.3, 0.8) }}>
            <span style={{ width: 34, height: 34, borderRadius: 17, background: MINT, color: "#0B1F18", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>{s}
          </div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 7 · four lines (Then send … → That's how) ----------
const LINES = [
  { key: "news" as const, label: "THEIR NEWS", text: "Saw you've opened the new Leeds office." },
  { key: "skill" as const, label: "YOUR SKILL", text: "In my final year I ran onboarding for 200 new society members." },
  { key: "question" as const, label: "ONE QUESTION", text: "Will the Leeds team need an extra pair of hands?" },
];
const Message: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.send - 0.1;
  const inn = sp(t, t0, 14, 160);
  const bad = sp(t, A.never - 0.05, 11, 200);
  const strike = ramp(t, A.never + 0.45, A.never + 0.8);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 36, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>To: Operations Manager</span>
        <Chip text="4 lines" style={pop(t, t0 + 0.3)} />
      </div>
      <Card x={40} y={120} w={1000} h={600} style={{ padding: "26px 30px" }}>
        {LINES.map((l, i) => {
          const at = A[l.key];
          const a = sp(t, at - 0.1, 13, 180);
          if (t < at - 0.15) return <div key={l.key} style={{ height: 170 }} />;
          return (
            <div key={l.key} style={{ height: 170, opacity: Math.min(1, a * 2), transform: `translateX(${(1 - a) * 300}px)` }}>
              <Chip text={l.label} bg={i === 2 ? "#FFF" : i === 0 ? GREEN : MINT} fg={i === 2 ? GREEN : i === 0 ? "#FFF" : "#0B1F18"} size={22} style={{ border: i === 2 ? `2px solid ${GREEN}` : undefined }} />
              <div style={{ fontFamily: fonts.semibold, fontSize: 36, color: TH.ink, lineHeight: 1.3, marginTop: 10 }}>{l.text}</div>
            </div>
          );
        })}
        <div style={{ fontFamily: fonts.medium, fontSize: 30, color: TH.dim, ...pop(t, A.question + 0.4, 0.9) }}>– Sam</div>
      </Card>
      {t > A.never - 0.1 ? (
        <div style={{ position: "absolute", left: 120, top: 740, width: 840, height: 140, borderRadius: 26, background: "#FFF", border: `4px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * bad}) rotate(-2deg)`, opacity: Math.min(1, bad * 2), boxShadow: `0 20px 50px ${RED}33` }}>
          <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 44, color: RED }}>
            "I'm open to opportunities"
            <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 7, background: RED, borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 8 · in before the ad (That's how … → Comment) ----------
const BeforeAd: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.thats - 0.05;
  const inn = sp(t, t0, 14, 150);
  const you = sp(t, A.before - 0.1, 11, 190);
  const reply = sp(t, Math.min(A.comment - 0.5, A.before + 0.5), 12, 180);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 10, borderRadius: 5, background: "#DDE5E0" }}>
        <div style={{ width: `${ramp(t, t0, A.before + 0.2) * 100}%`, height: "100%", borderRadius: 5, background: `linear-gradient(90deg, ${MINT}, ${GREEN})` }} />
      </div>
      {[{ x: 60, k: "News" }, { x: 360, k: "You write" }, { x: 760, k: "Job ad" }].map((p, i) => (
        <div key={p.k} style={{ position: "absolute", left: p.x, top: 260, width: 220, textAlign: i === 2 ? "right" : i === 1 ? "center" : "left", ...pop(t, t0 + 0.1 + i * 0.15, 0.8) }}>
          <div style={{ width: 90, height: 90, borderRadius: 45, margin: i === 2 ? "0 0 0 auto" : i === 1 ? "0 auto" : 0, background: i === 1 ? GREEN : "#FFF", border: `5px ${i === 2 ? "dashed" : "solid"} ${i === 2 ? "#BFCBC4" : GREEN}`, transform: i === 1 ? `scale(${0.7 + 0.5 * you})` : undefined, boxShadow: i === 1 && you > 0.5 ? `0 0 0 ${10 + 6 * Math.sin(t * 8)}px ${MINT}55` : undefined }} />
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: i === 2 ? TH.dim : TH.ink, marginTop: 18 }}>{p.k}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 310, top: 120, ...pop(t, A.before, 0.4) }}><Chip text="you're first" bg={MINT} fg="#0B1F18" size={38} style={{ transform: "rotate(-4deg)" }} /></div>
      <Card x={140} y={560} w={800} h={170} style={{ padding: "24px 30px", display: "flex", alignItems: "center", gap: 22, border: `3px solid ${MINT}`, boxShadow: `0 0 30px ${MINT}88`, transform: `translateY(${(1 - reply) * 400}px)`, opacity: Math.min(1, reply * 2) }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>↩</div>
        <div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>New reply · Operations Manager</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>"Got time for a quick call?"</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 9 · guide PDF scroll (Comment HIRED → end) ----------
const PAGES = Array.from({ length: 10 }, (_, i) => staticFile(`bxb-guide/p${String(i + 1).padStart(2, "0")}.png`));
const GuideScroll: React.FC<{ t: number; A: BxbTimes }> = ({ t, A }) => {
  const t0 = A.comment;
  const inn = sp(t, t0 - 0.05, 14, 150);
  const PW = 520, PHh = Math.round(PW * 1.414), GAPp = 26, PITCH = PHh + GAPp;
  const dur = Math.max(1.6, Math.min(2.8, A.total - t0 - 0.4));
  const pos = (tt: number) => ramp(tt, t0 + 0.25, t0 + 0.25 + dur, Easing.inOut(Easing.cubic)) * (PAGES.length - 1) * PITCH;
  const y = pos(t);
  const page = Math.min(PAGES.length, Math.floor((y + PHh / 2) / PITCH) + 1);
  const SAMPLES = 8;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 900}px)` }}>
      <div style={{ position: "absolute", left: 150, top: 300, width: 780, height: 600, borderRadius: 26, overflow: "hidden", background: "#E9EEEB", boxShadow: "0 30px 70px rgba(0,0,0,0.25)", transform: `perspective(1600px) rotateX(10deg) rotate(${-2 + inn * 2}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#0B1F18", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 2 }}>
          <div style={{ width: 30, height: 36, borderRadius: 6, background: "#C9473F", color: "#FFF", fontFamily: fonts.bold, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>Get in before the job ad.pdf</div>
          <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#0B1F18", background: MINT, borderRadius: 10, padding: "4px 12px", fontVariantNumeric: "tabular-nums" }}>{page} / {PAGES.length}</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 64, bottom: 0, overflow: "hidden" }}>
          {Array.from({ length: SAMPLES }, (_, j) => {
            const yy = pos(t - (j / (SAMPLES - 1)) * 0.06);
            return (
              <div key={j} style={{ position: "absolute", left: (780 - PW) / 2, top: 20 - yy, opacity: 1 / (j + 1) }}>
                {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PW, height: PHh, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 560, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>5 prompts</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 700, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>10 pages · free</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXBMain: React.FC<BxbProps> = ({ A = DEF, avatarSrc, splitSrcTop = 330, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.open - 0.05 && t < A.send - 0.1;
  const scenes: [number, React.FC<{ t: number; A: BxbTimes }>][] = [
    [0, JobBoard], [A.recruiter - 0.05, Timeline], [A.sodo - 0.05, Signals], [A.open - 0.05, ClaudeIn], [A.degree + 0.15, ClaudeOut],
    [A.manager - 0.35, Manager], [A.send - 0.1, Message], [A.thats - 0.05, BeforeAd], [A.comment - 0.1, GuideScroll],
  ];
  let idx = 0;
  scenes.forEach(([at], i) => { if (t >= at) idx = i; });
  const El = scenes[idx][1];
  const since = t - scenes[idx][0];
  const whip = Math.max(0, 1 - since / 0.18);
  const vw = W, vh = H;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - focusX * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - splitSrcTop));
  const push = 1 + 0.025 * Math.sin(t * 0.35);
  return (
    <ClaudeLang.Provider value="en">
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 30%" }}>
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
            <El t={t} A={A} />
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} />
        </div>
      </AbsoluteFill>
    </ClaudeLang.Provider>
  );
};

export const bxbMeta = ({ props }: { props: { seconds?: number } }) => (props.seconds ? { durationInFrames: Math.round(props.seconds * 25) } : {});
