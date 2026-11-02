import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { C, ClaudeLang, ClaudeMark, typed } from "../components/ClaudeKit";

// Felix × boilr · @moustacherecruiter · runs/bx-uni-job ("Fresh out of uni. 140 applications. 0 interviews.").
// One continuous split (panel top, Felix below) from frame 0 to the end, a new impulse every 1-2 s.
// Dopamine level medium, boilr green. All names / companies / numbers on screen are invented examples.

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

export type BxuTimes = {
  hundred: number; not: number; recruiter: number; see: number; studied: number; never: number; can: number;
  open: number; paste: number; degree: number; dissertation: number; side: number; ask: number; ones: number;
  found: number; jobad: number; rewrite: number; words: number; thats: number; phone: number; comment: number; total: number;
};
export type BxuProps = { A: BxuTimes; avatarSrc: string; seconds?: number; splitSrcTop?: number; focusX?: number; skin?: boolean };

const DEF: BxuTimes = { hundred: 1.4, not: 2.3, recruiter: 3.1, see: 4.0, studied: 5.6, never: 6.0, can: 6.9, open: 7.6, paste: 8.4, degree: 9.4, dissertation: 10.0, side: 10.8, ask: 12.4, ones: 14.6, found: 16.4, jobad: 17.1, rewrite: 18.0, words: 19.6, thats: 20.4, phone: 21.8, comment: 22.6, total: 25.6 };

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

// ---------- shared bits ----------
const Card: React.FC<{ x: number; y: number; w: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode; dark?: boolean }> = ({ x, y, w, h, style, children, dark }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: dark ? C.panel : TH.card, border: `2px solid ${dark ? C.panelBorder : TH.line}`, borderRadius: 26, boxShadow: dark ? "0 14px 40px rgba(0,0,0,0.4)" : "0 16px 38px rgba(0,0,0,0.08)", boxSizing: "border-box", ...style }}>{children}</div>
);
const Stamp: React.FC<{ t: number; at: number; text: string; x: number; y: number; rot?: number; color?: string; size?: number }> = ({ t, at, text, x, y, rot = -8, color = RED, size = 30 }) => {
  if (t < at) return null;
  const a = sp(t, at, 9, 260);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * a})`, opacity: Math.min(1, a * 1.6), fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, color, border: `4px solid ${color}`, borderRadius: 10, padding: "4px 14px", background: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>{text}</div>
  );
};
const Num: React.FC<{ v: number; size: number; color: string; style?: React.CSSProperties }> = ({ v, size, color, style }) => (
  <span style={{ fontFamily: fonts.bold, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -2, lineHeight: 1, ...style }}>{Math.round(v)}</span>
);

// ---------- 1 · application tracker (0 → "I'm a recruiter") ----------
const COMPANIES = ["Northbridge Capital", "Halden Analytics", "Ferro & Lane", "Brightwell Retail", "Kestrel Insurance", "Mercer Row Media", "Albion Logistics", "Thistle Bank", "Corvid Consulting", "Larkspur Energy", "Pembroke Health", "Ashgrove Partners", "Wexley Foods", "Saltmarsh Tech", "Orchard Lane PR", "Tamworth Mutual"];
const ROLES = ["Graduate Analyst", "Marketing Assistant", "Junior Consultant", "Graduate Scheme", "Data Assistant", "Business Analyst"];
const Tracker: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const count = 140 * ramp(t, 0.05, Math.max(1.4, A.hundred + 0.6), Easing.out(Easing.quad));
  const locked = t > A.hundred + 0.6;
  const blink = locked ? (Math.floor(t * 4) % 2 === 0 ? 1 : 0.35) : 1;
  const scroll = t * 520; // rows race upwards
  const ROW = 78;
  return (
    <AbsoluteFill>
      {/* back layer: endless application list, blurred behind the hook box */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 0, height: PH, overflow: "hidden", opacity: 0.55, filter: "blur(1.5px)" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const y = ((i * 64 - scroll * 0.6) % (40 * 64) + 40 * 64) % (40 * 64) - 64;
          return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: 54, borderRadius: 14, background: TH.card, border: `1.5px solid ${TH.line}`, display: "flex", alignItems: "center", padding: "0 22px", fontFamily: fonts.medium, fontSize: 24, color: TH.dim, gap: 16 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: i % 3 ? "#C9D2CD" : RED }} />{COMPANIES[i % COMPANIES.length]} · {ROLES[i % ROLES.length]}</div>;
        })}
      </div>
      {/* counters */}
      <Card x={40} y={500} w={560} h={190} style={{ padding: "20px 28px", transform: `translateY(${(1 - sp(t, 0, 14, 160)) * 300}px)` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>Applications sent</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 6 }}>
          <Num v={count} size={118} color={TH.ink} style={{ transform: `scale(${locked ? 1 + 0.08 * Math.max(0, 1 - (t - A.hundred - 0.6) * 4) : 1})`, display: "inline-block" }} />
          <span style={{ fontFamily: fonts.medium, fontSize: 28, color: TH.dim }}>in 4 months</span>
        </div>
      </Card>
      <Card x={620} y={500} w={420} h={190} style={{ padding: "20px 28px", border: `3px solid ${t > A.not - 0.1 ? RED : TH.line}`, boxShadow: t > A.not - 0.1 ? `0 0 0 ${8 * blink}px ${RED}22` : undefined, transform: `translateY(${(1 - sp(t, 0.15, 14, 160)) * 300}px)` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>Interviews</div>
        <Num v={0} size={118} color={RED} style={{ opacity: blink, display: "inline-block", marginTop: 6 }} />
      </Card>
      {/* front layer: rows with stamps */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 710, height: 196, overflow: "hidden", borderRadius: 18 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const y = i * ROW - Math.min(scroll, 22 * ROW) ;
          if (y < -ROW || y > 200) return null;
          const stamped = i % 3 === 1 ? "NO REPLY" : "REJECTED";
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: ROW - 10, borderRadius: 16, background: TH.card, border: `2px solid ${TH.line}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 18 }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.ink }}>{COMPANIES[(i * 5) % COMPANIES.length]}</span>
              <span style={{ fontFamily: fonts.regular, fontSize: 24, color: TH.dim }}>{ROLES[i % ROLES.length]}</span>
              <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 24, letterSpacing: 1.5, color: stamped === "REJECTED" ? RED : "#B07A12", border: `3px solid ${stamped === "REJECTED" ? RED : "#B07A12"}`, borderRadius: 8, padding: "2px 10px", transform: "rotate(-5deg)" }}>{stamped}</span>
            </div>
          );
        })}
      </div>
      <Stamp t={t} at={A.not} text="0 INTERVIEWS" x={560} y={760} rot={-9} size={44} />
    </AbsoluteFill>
  );
};

// ---------- 2 · recruiter's inbox (I'm a recruiter → So open Claude) ----------
const Inbox: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const t0 = A.recruiter;
  const inn = sp(t, t0, 14, 150);
  const skim = ramp(t, A.see, A.studied, Easing.inOut(Easing.cubic));
  const hl = ramp(t, A.studied - 0.1, A.studied + 0.35);
  const col = sp(t, A.never, 12, 190);
  const q = t > A.can ? 1 + 0.06 * Math.sin((t - A.can) * 12) : 1;
  const secs = Math.max(0, 6 - (t - t0) * 1.6);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      {/* stack of other CVs flicking past behind */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} x={70 + i * 8} y={130 - i * 10} w={600} h={720} style={{ transform: `rotate(${-6 + i * 2.5 + Math.sin(t * 2 + i) * 1.2}deg) translateX(${-((t * 300 + i * 140) % 700)}px)`, opacity: 0.35 }} />
      ))}
      <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 16, ...pop(t, t0 + 0.1) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>Graduate Analyst</div>
        <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: "#FFF", background: GREEN, borderRadius: 999, padding: "6px 16px" }}>412 applications</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: RED, border: `2.5px solid ${RED}`, borderRadius: 10, padding: "3px 12px", fontVariantNumeric: "tabular-nums" }}>⏱ {secs.toFixed(1)} s</span>
      </div>
      {/* the CV being skimmed */}
      <Card x={40} y={130} w={600} h={760} style={{ padding: "30px 32px", overflow: "hidden" }}>
        <div style={{ transform: `translateY(${-skim * 120}px)` }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 36, color: TH.ink }}>Jamie R.</div>
          <div style={{ fontFamily: fonts.regular, fontSize: 22, color: TH.dim, marginTop: 4 }}>Graduate · Leeds</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: TH.dim, marginTop: 26, letterSpacing: 1.5 }}>EDUCATION</div>
          <div style={{ position: "relative", marginTop: 10, fontFamily: fonts.semibold, fontSize: 30, color: TH.ink, lineHeight: 1.3 }}>
            <div style={{ position: "absolute", left: -8, top: 0, bottom: 0, width: `${hl * 104}%`, background: "#FFE873", borderRadius: 6, zIndex: 0 }} />
            <span style={{ position: "relative" }}>BSc Economics, 2:1</span>
          </div>
          <div style={{ position: "relative", marginTop: 8, fontFamily: fonts.regular, fontSize: 26, color: TH.ink, lineHeight: 1.4 }}>
            <div style={{ position: "absolute", left: -8, top: 0, bottom: 0, width: `${ramp(t, A.studied + 0.2, A.studied + 0.6) * 104}%`, background: "#FFE873", borderRadius: 6 }} />
            <span style={{ position: "relative" }}>Modules: Econometrics, Research Methods, Behavioural Economics</span>
          </div>
          {[0.9, 0.7, 0.95, 0.6, 0.85, 0.75, 0.5, 0.9, 0.65].map((w, i) => <div key={i} style={{ height: 18, width: `${w * 100}%`, background: "#E9EEEB", borderRadius: 9, marginTop: 20 }} />)}
        </div>
      </Card>
      {/* empty column: what can you do? */}
      <div style={{ position: "absolute", left: 670, top: 130, width: 370, height: 760, borderRadius: 26, border: `4px dashed ${t > A.can - 0.1 ? RED : "#BFCBC4"}`, background: "rgba(255,255,255,0.6)", boxSizing: "border-box", padding: 28, transform: `translateX(${(1 - col) * 500}px)`, opacity: Math.min(1, col * 2) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 36, color: TH.ink, lineHeight: 1.15 }}>What can<br />you do?</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: serifItalic, fontSize: 230, color: RED, transform: `scale(${q * sp(t, A.can, 9, 220)})` }}>?</div>
        <div style={{ position: "absolute", left: 28, right: 28, bottom: 30, fontFamily: fonts.medium, fontSize: 24, color: TH.dim, textAlign: "center", opacity: ramp(t, A.can + 0.3, A.can + 0.6) }}>nothing here</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · claude.ai: drop everything in (So open Claude → The ones …) ----------
const FILES = [
  { name: "BSc_Economics_transcript.pdf", kind: "PDF", col: "#C9473F", key: "degree" as const, from: [-700, -200] },
  { name: "Dissertation_final_v7.pdf", kind: "PDF", col: "#C9473F", key: "dissertation" as const, from: [900, -300] },
  { name: "side-project: pricing-tracker", kind: "</>", col: GREEN, key: "side" as const, from: [-600, 500] },
];
const ASK = "Which jobs would I be unfairly good at? Include ones I've never searched for.";
const ClaudeIn: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const t0 = A.open;
  const inn = sp(t, t0, 15, 160);
  const sent = t > A.ones - 0.15;
  const txt = typed(ASK, t, A.ask, A.ones - 0.3);
  return (
    <AbsoluteFill style={{ background: C.bg, transform: `scale(${0.9 + 0.1 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        <ClaudeMark size={56} />
        <span style={{ fontFamily: serifItalic, fontSize: 64, color: C.text }}>Good afternoon</span>
      </div>
      {/* attachments row */}
      <div style={{ position: "absolute", left: 40, top: 220, width: 1000, height: 150 }}>
        {FILES.map((f, i) => {
          const at = A[f.key];
          const a = sp(t, at - 0.15, 12, 150);
          if (t < at - 0.2) return null;
          const x = i * 335;
          return (
            <div key={f.name} style={{ position: "absolute", left: x, top: 0, width: 318, height: 140, background: C.panel, border: `2px solid ${t < at + 0.6 ? MINT : C.panelBorder}`, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 18px", boxSizing: "border-box", transform: `translate(${(1 - a) * f.from[0]}px, ${(1 - a) * f.from[1]}px) rotate(${(1 - a) * 18}deg) scale(${0.7 + 0.3 * a})`, boxShadow: t < at + 0.6 ? `0 0 24px ${MINT}66` : undefined }}>
              <div style={{ width: 62, height: 76, borderRadius: 10, background: f.col, color: "#fff", fontFamily: fonts.bold, fontSize: 20, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, boxSizing: "border-box", flexShrink: 0 }}>{f.kind}</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 23, color: C.text, lineHeight: 1.25, wordBreak: "break-word" }}>{f.name}</div>
            </div>
          );
        })}
      </div>
      {/* input box */}
      <div style={{ position: "absolute", left: 40, top: 400, width: 1000, minHeight: 300, background: C.panel, border: `2px solid ${t > A.ask - 0.1 ? MINT : C.panelBorder}`, borderRadius: 32, padding: "30px 32px", boxSizing: "border-box", boxShadow: t > A.ask - 0.1 ? `0 0 0 4px ${MINT}55, 0 12px 40px rgba(0,0,0,0.35)` : "0 12px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ fontFamily: fonts.regular, fontSize: 38, lineHeight: 1.36, color: txt ? C.text : C.dim, minHeight: 156 }}>
          {txt || (t > A.paste ? "Here's everything about me: my degree, my dissertation, my side project…" : "How can I help you today?")}
          {!sent && Math.floor(t * 2) % 2 === 0 ? "|" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, border: `2px solid ${C.panelBorder}`, color: C.text, fontFamily: fonts.regular, fontSize: 46, lineHeight: "54px", textAlign: "center" }}>+</div>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: fonts.medium, fontSize: 28, color: C.dim }}>Opus 5.5</span>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orange, color: "#fff", fontFamily: fonts.bold, fontSize: 36, lineHeight: "60px", textAlign: "center", transform: `scale(${sent ? 0.88 : 1})` }}>↑</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 740, display: "flex", gap: 14, ...pop(t, A.side + 0.4) }}>
        {["3 files", "everything in", "no polishing"].map((s) => <span key={s} style={{ fontFamily: fonts.semibold, fontSize: 26, color: MINT, border: `2px solid ${MINT}`, borderRadius: 999, padding: "6px 18px" }}>{s}</span>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4 · Claude's answer: 3 roles + match bars (The ones … → Found one?) ----------
const JOBS = [
  { title: "Pricing Analyst", why: "Dissertation on price elasticity + your tracker", pct: 92 },
  { title: "Customer Insight Analyst", why: "Survey design + Research Methods", pct: 88 },
  { title: "Revenue Operations Associate", why: "Side project = live revenue data", pct: 84 },
];
const ClaudeOut: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const t0 = A.ones - 0.1;
  const gap = Math.max(0.35, Math.min(0.6, (A.found - t0 - 1.2) / 3));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", right: 40, top: 40, maxWidth: 820, background: C.userBubble, borderRadius: 24, padding: "16px 24px", fontFamily: fonts.regular, fontSize: 27, lineHeight: 1.35, color: C.text, transform: `translateY(${(1 - sp(t, t0, 14, 170)) * -160}px)` }}>{ASK}</div>
      <div style={{ position: "absolute", left: 40, top: 165, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.regular, fontSize: 28, color: C.dim, ...pop(t, t0 + 0.15) }}><ClaudeMark size={32} /> Roles you'd be unfairly good at</div>
      {JOBS.map((j, i) => {
        const at = t0 + 0.3 + i * gap;
        const a = sp(t, at, 13, 160);
        const fill = ramp(t, at + 0.15, at + 0.9, Easing.out(Easing.quad));
        return (
          <div key={j.title} style={{ position: "absolute", left: 40, top: 235 + i * 222, width: 1000, height: 200, background: C.panel, border: `2px solid ${fill > 0.98 ? MINT : C.panelBorder}`, borderRadius: 24, padding: "22px 28px", boxSizing: "border-box", transform: `translateX(${(1 - a) * 1100}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 38, color: C.text }}>{j.title}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 21, color: "#1B1B19", background: MINT, borderRadius: 999, padding: "4px 14px", ...pop(t, at + 0.5) }}>never searched</span>
              <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 46, color: MINT, fontVariantNumeric: "tabular-nums" }}>{Math.round(j.pct * fill)}%</span>
            </div>
            <div style={{ fontFamily: fonts.regular, fontSize: 25, color: C.dim, marginTop: 6 }}>{j.why}</div>
            <div style={{ height: 22, borderRadius: 11, background: "#3A3936", marginTop: 16, overflow: "hidden" }}>
              <div style={{ width: `${j.pct * fill}%`, height: "100%", borderRadius: 11, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 5 · job ad → application in their words (Found one? → That's the one) ----------
const PHRASES = [
  { ad: "commercial insight", mine: "good with numbers" },
  { ad: "pricing decisions", mine: "my dissertation" },
  { ad: "work with stakeholders", mine: "team player" },
];
const Rewrite: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const t0 = A.found;
  const inn = sp(t, t0, 14, 160);
  const hlAt = (i: number) => A.jobad + 0.15 + i * 0.35;
  const flyAt = (i: number) => A.rewrite + 0.1 + i * Math.max(0.35, (A.words - A.rewrite) / 3);
  const AD_Y = (i: number) => 150 + i * 190;
  const ME_Y = (i: number) => 150 + i * 190;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <Card x={30} y={110} w={500} h={790} style={{ padding: "24px 26px" }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: TH.dim, letterSpacing: 1.5 }}>JOB AD</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 32, color: TH.ink, marginTop: 4 }}>Junior Pricing Analyst</div>
        {PHRASES.map((p, i) => {
          const h = ramp(t, hlAt(i), hlAt(i) + 0.25);
          return (
            <div key={p.ad} style={{ position: "absolute", left: 26, right: 26, top: AD_Y(i), fontFamily: fonts.regular, fontSize: 31, color: TH.dim, lineHeight: 1.4 }}>
              {["You'll bring", "You'll support", "You'll"][i]}{" "}
              <span style={{ position: "relative", color: h > 0.5 ? GREEN : TH.ink, fontFamily: fonts.semibold }}>
                <span style={{ position: "absolute", left: -4, right: -4, top: 2, bottom: 2, background: `${MINT}66`, borderRadius: 6, transform: `scaleX(${h})`, transformOrigin: "0 50%" }} />
                <span style={{ position: "relative" }}>{p.ad}</span>
              </span>
              {[" to the team.", " across our range.", " across the business."][i]}
              <div style={{ height: 14, width: "80%", background: "#EEF2EF", borderRadius: 7, marginTop: 14 }} />
            </div>
          );
        })}
      </Card>
      <Card x={550} y={110} w={500} h={790} style={{ padding: "24px 26px", border: `3px solid ${t > A.words ? MINT : TH.line}`, boxShadow: t > A.words ? `0 0 26px ${MINT}88` : undefined }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: TH.dim, letterSpacing: 1.5 }}>YOUR APPLICATION</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 32, color: TH.ink, marginTop: 4 }}>Jamie R.</div>
        {PHRASES.map((p, i) => {
          const done = t > flyAt(i) + 0.45;
          const strike = ramp(t, flyAt(i) - 0.1, flyAt(i) + 0.15);
          return (
            <div key={p.mine} style={{ position: "absolute", left: 26, right: 26, top: ME_Y(i), fontFamily: fonts.regular, fontSize: 33, color: TH.dim, lineHeight: 1.45 }}>
              {done ? (
                <span style={{ fontFamily: fonts.semibold, color: GREEN, background: `${MINT}55`, borderRadius: 6, padding: "0 4px", display: "inline-block", ...pop(t, flyAt(i) + 0.45, 0.8) }}>{p.ad}</span>
              ) : (
                <span style={{ textDecoration: strike > 0.5 ? "line-through" : undefined, color: strike > 0.5 ? RED : TH.ink }}>{p.mine}</span>
              )}
              <div style={{ height: 14, width: "70%", background: "#EEF2EF", borderRadius: 7, marginTop: 14 }} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 26, bottom: 26, fontFamily: fonts.semibold, fontSize: 24, color: "#FFF", background: GREEN, borderRadius: 999, padding: "8px 18px", ...pop(t, A.words) }}>in their words ✓</div>
      </Card>
      {/* flying chips left → right */}
      {PHRASES.map((p, i) => {
        const k = ramp(t, flyAt(i), flyAt(i) + 0.45, Easing.inOut(Easing.cubic));
        if (k <= 0 || k >= 1) return null;
        const x = 60 + k * 520;
        const y = 110 + AD_Y(i) + (ME_Y(i) - AD_Y(i)) * k - Math.sin(k * Math.PI) * 90;
        return <div key={p.ad} style={{ position: "absolute", left: x, top: y, fontFamily: fonts.semibold, fontSize: 31, color: "#FFF", background: GREEN, borderRadius: 10, padding: "6px 14px", boxShadow: `0 10px 26px ${GREEN}66`, transform: `rotate(${Math.sin(k * Math.PI) * -6}deg) scale(${1 + 0.15 * Math.sin(k * Math.PI)})`, whiteSpace: "nowrap" }}>{p.ad}</div>;
      })}
    </AbsoluteFill>
  );
};

// ---------- 6 · phone rings: interview (That's the one → Comment) ----------
const Phone: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const t0 = A.thats;
  const inn = sp(t, t0, 13, 150);
  const cardAt = Math.min(A.phone - 0.1, t0 + 0.55);
  const ring = t > t0 + 0.1 && t < A.comment;
  const shake = ring ? Math.sin(t * 70) * 7 : 0;
  const card = sp(t, cardAt, 12, 170);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 700}px)` }}>
      {/* ring waves */}
      {ring ? [0, 1, 2].map((i) => {
        const p = ((t - t0) * 1.6 + i / 3) % 1;
        return <div key={i} style={{ position: "absolute", left: 540 - 180 - p * 160, top: 470 - 260 - p * 160, width: 360 + p * 320, height: 520 + p * 320, borderRadius: 120, border: `5px solid ${MINT}`, opacity: 1 - p }} />;
      }) : null}
      <div style={{ position: "absolute", left: 540 - 170, top: 160, width: 340, height: 640, borderRadius: 54, background: "#111", border: "10px solid #2A2A2A", boxShadow: "0 30px 70px rgba(0,0,0,0.3)", transform: `rotate(${shake * 0.4}deg) translateX(${shake}px)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${GREEN}, #06261C)` }} />
        <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: fonts.medium, fontSize: 24, color: "#CFEFE0" }}>incoming call</div>
        <div style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: fonts.bold, fontSize: 36, color: "#FFF" }}>Felix · Recruiter</div>
        <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: RED }} />
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#34C759", transform: `scale(${1 + 0.12 * Math.abs(Math.sin(t * 6))})`, color: "#FFF", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>✆</div>
        </div>
      </div>
      <Card x={130} y={560} w={820} h={190} style={{ padding: "26px 32px", display: "flex", alignItems: "center", gap: 26, border: `3px solid ${MINT}`, boxShadow: `0 0 30px ${MINT}88, 0 20px 50px rgba(0,0,0,0.15)`, transform: `translateY(${(1 - card) * 500}px) scale(${0.8 + 0.2 * card})`, opacity: Math.min(1, card * 2) }}>
        <div style={{ width: 120, height: 128, borderRadius: 20, overflow: "hidden", border: `2px solid ${TH.line}`, flexShrink: 0, textAlign: "center" }}>
          <div style={{ background: RED, color: "#FFF", fontFamily: fonts.bold, fontSize: 24, padding: "6px 0" }}>THU</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 62, color: TH.ink, lineHeight: "82px" }}>10</div>
        </div>
        <div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>Invitation accepted</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 50, color: TH.ink, letterSpacing: -1 }}>Interview: Thursday 10:00</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 7 · guide PDF scroll (Comment JOB → end) ----------
const PAGES = Array.from({ length: 11 }, (_, i) => staticFile(`bxu-guide/p${String(i + 1).padStart(2, "0")}.png`));
const GuideScroll: React.FC<{ t: number; A: BxuTimes }> = ({ t, A }) => {
  const t0 = A.comment;
  const inn = sp(t, t0 - 0.05, 14, 150);
  const PW = 520, PHh = Math.round(PW * 1.414), GAPp = 26, PITCH = PHh + GAPp;
  const dur = Math.max(1.6, Math.min(2.8, A.total - t0 - 0.4));
  const pos = (tt: number) => ramp(tt, t0 + 0.25, t0 + 0.25 + dur, Easing.inOut(Easing.cubic)) * (PAGES.length - 1) * PITCH;
  const y = pos(t);
  const page = Math.min(PAGES.length, Math.floor((y + PHh / 2) / PITCH) + 1);
  const SAMPLES = 6;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 900}px)` }}>
      <div style={{ position: "absolute", left: 150, top: 300, width: 780, height: 600, borderRadius: 26, overflow: "hidden", background: "#E9EEEB", boxShadow: "0 30px 70px rgba(0,0,0,0.25)", transform: `perspective(1600px) rotateX(10deg) rotate(${-2 + inn * 2}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#0B1F18", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 2 }}>
          <div style={{ width: 30, height: 36, borderRadius: 6, background: "#C9473F", color: "#FFF", fontFamily: fonts.bold, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>Graduate Job Playbook.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>6 prompts</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 700, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>11 pages · free</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXUMain: React.FC<BxuProps> = ({ A = DEF, avatarSrc, splitSrcTop = 330, focusX = 0.5, skin = false }) => {
  const t = useTime();
  const dark = t >= A.open - 0.05 && t < A.found - 0.05;
  const scenes: [number, React.FC<{ t: number; A: BxuTimes }>][] = [
    [0, Tracker], [A.recruiter - 0.05, Inbox], [A.open - 0.05, ClaudeIn], [A.ones - 0.15, ClaudeOut], [A.found - 0.05, Rewrite], [A.thats - 0.05, Phone], [A.comment - 0.1, GuideScroll],
  ];
  let idx = 0;
  scenes.forEach(([at], i) => { if (t >= at) idx = i; });
  const El = scenes[idx][1];
  const since = t - scenes[idx][0];
  // whip transition: small vertical blur-ish push on each cut
  const whip = Math.max(0, 1 - since / 0.18);
  const s = 1.0;
  const vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - focusX * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - splitSrcTop * s));
  const push = 1 + 0.025 * Math.sin(t * 0.35);
  return (
    <ClaudeLang.Provider value="en">
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${push})`, transformOrigin: "50% 30%" }}>
          <OffthreadVideo src={staticFile(avatarSrc)} muted style={{ width: "100%", height: "100%", filter: skin ? "saturate(0.92) sepia(0.06) hue-rotate(-4deg)" : undefined }} />
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

export const bxuMeta = ({ props }: { props: { seconds?: number } }) => (props.seconds ? { durationInFrames: Math.round(props.seconds * 25) } : {});
