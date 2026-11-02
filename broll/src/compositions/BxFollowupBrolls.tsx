import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang, Cursor } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-followup (R-021 "Ghosted after the interview"), job-seeker series, 2026-10-21.
// Same build as BxSearchBrolls: split (panel top, Felix below). Hook / recruiter side / payoff in boilr style,
// steps 1-3 = real claude.ai screens (klickpfad/claude-ablauf.md) with typing reveal, cursor, scroll and push-in only.
// Job ad, notes, names (Larkfield, Hannah, Tom) are invented. Times = word starts on the tightened timeline.

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

import captionsJson from "../../runs/bx-followup/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const endOf = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.endMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  reply1: at("reply", 1), week1: at("week", 1), interview1: at("interview", 1), not: at("not"),
  im: at("im"), happening: at("happening"), holiday: at("holiday"), finance: at("finance"), waiting: at("waiting"), candidate: at("candidate"),
  just: at("just"), checking: at("checking"), cant: at("cant"), waits: at("waits"),
  step1: at("step", 1), open: at("open"), paste: at("paste"), notes: at("notes"),
  step2: at("step", 2), ask1: at("ask", 1), recruiter2: endOf("recruiter", 2), thing: at("thing"), clear: at("clear"), begging: endOf("begging"),
  step3: at("step", 3), ask2: at("ask", 2), easy: at("easy"), line1: endOf("line", 1), like: at("like"), decision: at("decision"), week2: at("week", 2),
  can: at("can"), between: at("between"), calls: at("calls"),
  comment: at("comment"), total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXFU_FRAMES = Math.round(A.total * 25);

const useTime = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const sp = (t: number, a: number, damping = 13, stiffness = 170) => (t < a ? 0 : spring({ frame: Math.round((t - a) * 25), fps: 25, config: { damping, stiffness, mass: 0.7 } }));
const pop = (t: number, a: number, from = 0.6): React.CSSProperties => {
  const s = sp(t, a, 11, 200);
  return { transform: `scale(${from + (1 - from) * s})`, opacity: Math.min(1, s * 2) };
};

const Card: React.FC<{ x: number; y: number; w: number; h?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: TH.card, border: `2px solid ${TH.line}`, borderRadius: 26, boxShadow: "0 16px 38px rgba(0,0,0,0.08)", boxSizing: "border-box", ...style }}>{children}</div>
);
const Chip: React.FC<{ text: string; bg?: string; fg?: string; size?: number; style?: React.CSSProperties }> = ({ text, bg = GREEN, fg = "#FFF", size = 26, style }) => (
  <span style={{ fontFamily: fonts.semibold, fontSize: size, color: fg, background: bg, borderRadius: 999, padding: "6px 18px", whiteSpace: "nowrap", display: "inline-block", ...style }}>{text}</span>
);

// ---------- 1 · Hook: sent 8 days ago, no reply (0 → "I'm") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const days = Math.max(1, Math.min(8, Math.floor(1 + 7 * ramp(t, 0.15, A.interview1 + 0.3, Easing.inOut(Easing.quad)))));
  const relief = sp(t, A.not - 0.1, 12, 170);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 52, lineHeight: 1.15, color: TH.ink }}>Why recruiters go quiet<br /><span style={{ color: GREEN }}>after your interview</span></div>
      <Card x={40} y={190} w={1000} h={390} style={{ padding: "30px 38px", transform: `scale(${1 + 0.02 * Math.sin(t * 2)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#DDE6E1", fontFamily: fonts.bold, fontSize: 32, color: TH.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>T</div>
          <div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>To: Tom · Recruiter</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 38, color: TH.ink }}>Thanks for today's interview</div>
          </div>
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 30, color: TH.dim, marginTop: 24, lineHeight: 1.35 }}>Hi Tom, thanks again for arranging the interview with Hannah. Really enjoyed it…</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30 }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>Sent</span>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: days >= 7 ? RED : TH.ink, fontVariantNumeric: "tabular-nums" }}>{days} {days === 1 ? "day" : "days"} ago</span>
          <span style={{ marginLeft: "auto" }}><Chip text="No reply" bg={RED} size={28} style={pop(t, A.reply1 - 0.1, 0.5)} /></span>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: serifItalic, fontSize: 64, color: GREEN, opacity: Math.min(1, relief * 2), transform: `translateY(${(1 - relief) * 40}px)` }}>usually not about you.</div>
    </AbsoluteFill>
  );
};

// ---------- 2 · recruiter side: holiday / finance / one more candidate ----------
const REASONS = [
  { k: "holiday" as const, icon: "🌴", who: "Hiring manager", what: "Out of office until Monday" },
  { k: "finance" as const, icon: "🧾", who: "Finance", what: "Sign-off pending" },
  { k: "waiting" as const, icon: "👤", who: "One more candidate", what: "Final interview on Thursday" },
];
const SideScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.im - 0.05;
  const inn = sp(t, t0, 14, 160);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 44, color: TH.ink, ...pop(t, t0 + 0.05) }}>Meanwhile, on my side</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, display: "flex", flexDirection: "column", gap: 22 }}>
        {REASONS.map((r) => {
          const a = A[r.k] - 0.12;
          const on = t > a;
          if (!on) {
            return (
              <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", height: 136, boxSizing: "border-box", border: "3px dashed #B9C4BE", background: "rgba(255,255,255,0.7)", borderRadius: 24, ...pop(t, t0 + 0.15 + REASONS.indexOf(r) * 0.12, 0.5) }}>
                <div style={{ width: 92, height: 92, borderRadius: 22, background: "#E1E7E3", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 46, color: "#7E8C85" }}>?</div>
                <div style={{ flex: 1 }}>
                  <div style={{ width: "46%", height: 26, borderRadius: 13, background: "#DCE3DF", marginBottom: 14 }} />
                  <div style={{ width: "68%", height: 20, borderRadius: 10, background: "#E6EBE8" }} />
                </div>
                <div style={{ fontFamily: fonts.bold, fontSize: 40, color: "#7E8C85", opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 3)) }}>…</div>
              </div>
            );
          }
          return (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", background: "#FFF", border: `3px solid ${on ? GREEN : TH.line}`, borderRadius: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", ...pop(t, a, 0.7) }}>
              <div style={{ width: 92, height: 92, borderRadius: 22, background: TH.accentSoft, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>{r.who}</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 30, color: TH.dim }}>{r.what}</div>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 26, color: "#B7791F", background: "#FFF4DD", borderRadius: 999, padding: "6px 16px" }}>waiting</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · "just checking in" → nothing to answer → it waits ----------
const INBOX = [
  { f: "Hannah · Head of CS", s: "Re: offer approval?" },
  { f: "Client · Northgate", s: "Can we move Thursday's interview?" },
  { f: "Priya · Candidate", s: "Notice period confirmed: 4 weeks" },
  { f: "Finance", s: "Headcount sign-off: next week" },
];
const CheckScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.just - 0.05;
  const inn = sp(t, t0, 14, 170);
  const sink = ramp(t, A.waits - 0.1, A.waits + 0.45, Easing.inOut(Easing.cubic));
  const ROW = 118;
  const rows = [{ f: "You", s: "Just checking in!", me: true }, ...INBOX.map((x) => ({ ...x, me: false }))];
  return (
    <AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 42, color: TH.ink }}>My inbox <span style={{ color: TH.dim, fontFamily: fonts.semibold, fontSize: 30 }}>· 214 unread</span></div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 130, height: ROW * 5 + 20 }}>
        {rows.map((r, i) => {
          const y = r.me ? sink * ROW * 4 : (i - sink) * ROW;
          return (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: ROW - 14, display: "flex", alignItems: "center", gap: 20, padding: "0 26px", background: r.me ? (sink > 0.5 ? "#F1F3F2" : "#FFF") : "#FFF", border: `${r.me ? 4 : 2}px solid ${r.me && sink < 0.5 ? RED : TH.line}`, borderRadius: 20, boxSizing: "border-box", opacity: r.me ? 1 - 0.45 * sink : 1, zIndex: r.me ? 2 : 1 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim }}>{r.f}</div>
                <div style={{ fontFamily: fonts.bold, fontSize: 34, color: TH.ink, whiteSpace: "nowrap" }}>{r.s}</div>
              </div>
              {r.me && t > A.cant - 0.1 ? <span style={{ marginLeft: "auto", ...pop(t, A.cant - 0.1, 0.5) }}><Chip text={sink > 0.5 ? "⏳ later" : "nothing to answer"} bg={sink > 0.5 ? "#9AA5A0" : RED} size={26} /></span> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4-5 · Steps 1-3: the real claude.ai click path ----------
const CB = "#151515"; // claude.ai dark page
const BOXBG = "rgb(32,32,31)"; // claude.ai input box
const shot = (f: string) => staticFile(`bxfu-claude/${f}`);
type Line = { y0: number; y1: number; x0: number; x1: number };

// covers the not-yet-typed part of the real prompt text (source coords), plus a caret
const TypeCover: React.FC<{ lines: Line[]; p: number }> = ({ lines, p }) => {
  const total = lines.reduce((a, l) => a + (l.x1 - l.x0), 0);
  let left = p * total;
  let caretDone = false;
  return (
    <>
      {lines.map((l, i) => {
        const len = l.x1 - l.x0;
        const shown = Math.max(0, Math.min(len, left));
        left -= len;
        const x = l.x0 + shown - (shown === 0 ? 3 : 0);
        const caret = !caretDone && (shown < len || i === lines.length - 1);
        if (caret) caretDone = true;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: l.y0 - 4, width: l.x1 - x + 8, height: l.y1 - l.y0 + 8, background: BOXBG }} />
            {caret && p < 1 ? <div style={{ position: "absolute", left: x + 1, top: l.y0 - 2, width: 3, height: l.y1 - l.y0 + 4, background: "#EEE" }} /> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

// image placed so that source point (sx, sy) sits at panel point (px, py) with scale s
const Place: React.FC<{ src: string; s: number; sx: number; sy: number; px: number; py: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ src, s, sx, sy, px, py, children, style }) => (
  <div style={{ position: "absolute", left: px - sx * s, top: py - sy * s, transform: `scale(${s})`, transformOrigin: "0 0", ...style }}>
    <Img src={src} style={{ display: "block" }} />
    {children}
  </div>
);

const P1: Line[] = [{ y0: 790, y1: 817, x0: 50, x1: 1113 }, { y0: 821, y1: 855, x0: 48, x1: 676 }];
const ClaudeA: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step1 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const te = A.recruiter2 + 0.05;
  const ansAt = te + 0.3;
  const pasted = ramp(t, A.paste + 0.05, A.paste + 0.45, Easing.out(Easing.quad));
  // typed view: 1204 x 1000 at s 0.86, centred
  const S2 = 0.86, L2 = (W - 1204 * S2) / 2, T2 = 26;
  const input: [number, number] = [L2 + 300 * S2, T2 + 470 * S2];
  const send: [number, number] = [L2 + 1138 * S2, T2 + 888 * S2];
  if (t >= ansAt) {
    // answer 1: appears full width; "one thing from the interview" lights the interview line,
    // "one clear question" pushes in on the question line
    const rev = ramp(t, ansAt, ansAt + 0.6, Easing.out(Easing.quad));
    const z = ramp(t, A.clear - 0.2, A.clear + 0.45, Easing.inOut(Easing.cubic));
    const s = 0.74 + 0.38 * z;
    const sx = 730 + (442 - 730) * z;
    const sy = 300 + (370 - 300) * z;
    const hl1 = ramp(t, A.thing - 0.1, A.thing + 0.3) * (1 - z);
    return (
      <AbsoluteFill style={{ background: CB }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
          <Place src={shot("03-answer1.png")} s={s} sx={sx} sy={sy} px={540} py={PH * 0.5}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1548, height: 215, background: CB, opacity: 0.55 * Math.max(hl1, z) }} />
            <div style={{ position: "absolute", left: 0, top: 303, width: 1548, height: 44, background: CB, opacity: 0.55 * hl1 + 0.55 * z }} />
            <div style={{ position: "absolute", left: 0, top: 215, width: 1548, height: 88, background: CB, opacity: 0.55 * z }} />
            <div style={{ position: "absolute", left: 0, top: 347, width: 1548, height: 43, background: CB, opacity: 0.55 * hl1 }} />
            <div style={{ position: "absolute", left: 0, top: 390, width: 1548, height: 160, background: CB, opacity: 0.55 * Math.max(hl1, z) }} />
          </Place>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: CB, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.96 + 0.04 * inn})`, transformOrigin: "50% 40%" }}>
        {t < A.paste - 0.02 ? (
          <Place src={shot("01-home-empty.png")} s={0.75} sx={692} sy={234} px={540} py={PH / 2} />
        ) : (
          <Place src={shot("02-prompt1-typed.png")} s={S2} sx={0} sy={0} px={L2} py={T2}>
            <div style={{ position: "absolute", left: 30, top: 150, width: 1150, height: 632, background: BOXBG, clipPath: `inset(${pasted * 100}% 0 0 0)` }} />
            <TypeCover lines={P1} p={ramp(t, A.ask1, te, (x) => x)} />
          </Place>
        )}
        <Cursor keys={[[t0, 860, 820], [A.open + 0.3, 400, PH / 2 + 10, true], [A.paste - 0.1, input[0], input[1]], [A.paste, input[0], input[1], true], [te - 0.3, send[0] - 70, send[1] - 30], [te, send[0], send[1], true]]} showFrom={t0 + 0.2} />
      </div>
    </AbsoluteFill>
  );
};

const P2: Line[] = [{ y0: 121, y1: 159, x0: 53, x1: 1454 }];
const ClaudeB: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step3 - 0.1;
  const te = A.line1 + 0.05;
  const ansAt = te + 0.25;
  const S4 = 0.68, L4 = (W - 1568 * S4) / 2, T4 = PH - 268 * S4 - 30;
  const slide = sp(t, t0, 15, 170);
  const send: [number, number] = [L4 + 1508 * S4, T4 + 140 * S4];
  if (t >= ansAt) {
    const rev = ramp(t, ansAt, ansAt + 0.5, Easing.out(Easing.quad));
    const z = ramp(t, A.like - 0.15, A.like + 0.6, Easing.inOut(Easing.cubic));
    const s = 0.72 + 0.26 * z;
    const fy = 330 + 166 * z;
    const hl = ramp(t, A.decision - 0.1, A.decision + 0.5);
    return (
      <AbsoluteFill style={{ background: CB }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
          <Place src={shot("05-answer2.png")} s={s} sx={63 + 0 * z} sy={fy} px={40 + 0 * z} py={PH * 0.5}>
            {/* dim everything but the question line once the zoom has landed */}
            <div style={{ position: "absolute", left: 0, top: 0, width: 1548, height: 478, background: CB, opacity: 0.55 * hl }} />
            <div style={{ position: "absolute", left: 0, top: 516, width: 1548, height: 160, background: CB, opacity: 0.55 * hl }} />
          </Place>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: CB }}>
      <div style={{ opacity: 0.5 }}>
        <Place src={shot("03-answer1.png")} s={0.78} sx={730} sy={300} px={540} py={PH * 0.4} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: T4 - 70, bottom: 0, background: `linear-gradient(transparent, ${CB} 60px)` }} />
      <Place src={shot("04-prompt2-typed.png")} s={S4} sx={0} sy={0} px={L4} py={T4} style={{ transform: `translateY(${(1 - slide) * 260}px) scale(${S4})` }}>
        <TypeCover lines={P2} p={ramp(t, A.ask2, te, (x) => x)} />
      </Place>
      <Cursor keys={[[t0, 700, 300], [te - 0.35, send[0] - 90, send[1] - 40], [te, send[0], send[1], true]]} showFrom={t0 + 0.3} />
    </AbsoluteFill>
  );
};

// ---------- 6 · payoff: "I can reply to that between two calls" ----------
const ReplyScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.can - 0.3;
  const inn = sp(t, t0, 14, 150);
  const typing = t < A.between + 0.1;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 44 }}>📞</span>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>Between two calls</span>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: GREEN, background: TH.accentSoft, borderRadius: 10, padding: "4px 12px" }}>11:42</span>
      </div>
      <Card x={60} y={150} w={960} h={190} style={{ padding: "24px 30px", opacity: 0.9 }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim }}>You · follow-up</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: TH.ink, marginTop: 6, lineHeight: 1.3 }}>Is a decision still likely this week, or should I expect to hear next week?</div>
      </Card>
      <div style={{ position: "absolute", left: 160, right: 60, top: 380 }}>
        {typing ? (
          <div style={{ display: "inline-flex", gap: 10, background: GREEN, borderRadius: 28, padding: "24px 30px", ...pop(t, t0 + 0.25, 0.6) }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#FFF", opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i)) }} />)}
          </div>
        ) : (
          <div style={{ background: GREEN, color: "#FFF", borderRadius: 28, padding: "24px 30px", boxShadow: `0 0 34px ${MINT}66`, ...pop(t, A.between + 0.1, 0.7) }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, opacity: 0.8 }}>Tom · Recruiter</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, marginTop: 4 }}>Yes, this week. You'll hear by Friday.</div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 60, top: 640, fontFamily: serifItalic, fontSize: 54, color: GREEN, ...pop(t, A.calls, 0.7) }}>one line. done.</div>
    </AbsoluteFill>
  );
};

// ---------- 7 · guide PDF scroll (Comment FOLLOWUP → end) ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`bxfu-guide2/p${String(i + 1).padStart(2, "0")}.png`));
const GuideScroll: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.comment;
  const inn = sp(t, t0 - 0.05, 14, 150);
  const PW = 520, PHh = Math.round(PW * 1.414), GAPp = 22, PITCH = PHh + GAPp;
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>The follow-up.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>FOLLOWUP</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>prompts + 3 versions</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXFUMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxfu-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.can - 0.3;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.im - 0.05, SideScene], [A.just - 0.05, CheckScene], [A.step1 - 0.1, ClaudeA], [A.step3 - 0.1, ClaudeB], [A.can - 0.3, ReplyScene], [A.comment - 0.1, GuideScroll],
  ];
  let idx = 0;
  scenes.forEach(([a], i) => { if (t >= a) idx = i; });
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
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: dark ? CB : TH.bg, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
          {!dark ? (
            <>
              <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${TH.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
              <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: -200 + Math.sin(t * 0.7) * 140, top: 100 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${TH.accentSoft}AA 0%, transparent 65%)` }} />
            </>
          ) : null}
          <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 0.9) * 5}px, ${whip * 40 + Math.sin(t * 1.3) * 3}px) scale(${1 + 0.006 * since})`, filter: whip > 0.05 ? `blur(${whip * 6}px)` : undefined }}>
            <El t={t} />
          </AbsoluteFill>
          {!dark ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} /> : null}
        </div>
      </AbsoluteFill>
    </ClaudeLang.Provider>
  );
};
