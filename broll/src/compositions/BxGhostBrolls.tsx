import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang, Cursor } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-ghost-jobs ("Ghost jobs"), job-seeker series, 2026-10-22.
// Same build as BxFollowupBrolls: split (panel top, Felix below). Hook / recruiter side / evening / payoff in boilr style,
// steps 1-3 = real claude.ai screens (klickpfad/claude-ablauf.md) with typing reveal, cursor and push-in only.
// Job ad and company (Halbrook Analytics) are invented. Times = word starts on the tightened timeline.

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

import captionsJson from "../../runs/bx-ghost-jobs/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const endOf = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.endMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  applying: at("applying"), never: at("never"), real: at("real"),
  im: at("im"), every: at("every"), filled: at("filled"), month: at("month"), stays: at("stays"), collect: at("collect"), later: at("later"),
  and2: at("and", 2), evening: at("evening"), cover: at("cover"), so: at("so"), check: at("check"), apply1: at("apply", 1),
  step1: at("step", 1), open: at("open"), paste: at("paste"), name: endOf("name"),
  step2: at("step", 2), is: at("is"), careers: at("careers"), posted: at("posted"), freeze: at("freeze"), news: endOf("news"),
  step3: at("step", 3), verdict: endOf("verdict"), apply2: at("apply", 2), message: at("message"), skip: at("skip"),
  your: at("your", 2), worth: at("worth"), ghost1: at("ghost", 1),
  comment: at("comment"), total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXGH_FRAMES = Math.round(A.total * 25);

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

// job ad card, reused in hook and payoff; `ghost` 0..1 fades it into a see-through ghost
const JobAd: React.FC<{ t: number; ghost: number; applied?: boolean }> = ({ t, ghost, applied }) => (
  <Card x={40} y={190} w={1000} h={420} style={{ padding: "30px 38px", opacity: 1 - 0.65 * ghost, filter: ghost > 0.02 ? `blur(${ghost * 2.5}px)` : undefined, transform: `translateY(${-ghost * 18 + Math.sin(t * 2.2) * ghost * 10}px) scale(${1 + 0.015 * Math.sin(t * 2)})` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 92, height: 92, borderRadius: 20, background: "#1F3A5F", fontFamily: fonts.bold, fontSize: 40, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>H</div>
      <div>
        <div style={{ fontFamily: fonts.bold, fontSize: 42, color: TH.ink }}>Marketing Executive</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>Halbrook Analytics · Manchester (Hybrid)</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 26, flexWrap: "wrap" }}>
      <Chip text="£28,000–£32,000" bg="#E7EFEA" fg={TH.ink} />
      <Chip text="Posted 6 weeks ago" bg="#FDECEC" fg={RED} />
      <Chip text="Reposted" bg="#FDECEC" fg={RED} />
    </div>
    <div style={{ fontFamily: fonts.regular, fontSize: 29, color: TH.dim, marginTop: 22, lineHeight: 1.35 }}>Fast-growing data company… Immediate start.</div>
    <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
      <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>Over 200 applicants</span>
      <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: applied ? "#9AA5A0" : "#0A66C2", borderRadius: 999, padding: "10px 30px" }}>{applied ? "Applied ✓" : "Easy Apply"}</span>
    </div>
  </Card>
);

// ---------- 1 · Hook: the ad you applied to was never real (0 → "I'm") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const ghost = ramp(t, A.never - 0.05, A.real + 0.35, Easing.inOut(Easing.cubic));
  const stamp = sp(t, A.real - 0.05, 10, 220);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 52, lineHeight: 1.15, color: TH.ink }}>Ghost jobs:<br /><span style={{ color: GREEN }}>the ads nobody is hiring for</span></div>
      <JobAd t={t} ghost={ghost} applied={t > A.applying + 0.2} />
      {t > A.real - 0.05 ? (
        <div style={{ position: "absolute", left: 300, top: 300, transform: `rotate(-12deg) scale(${2.2 - 1.2 * stamp})`, opacity: Math.min(1, stamp * 2), fontFamily: fonts.bold, fontSize: 78, letterSpacing: 4, color: RED, border: `8px solid ${RED}`, borderRadius: 20, padding: "8px 30px", background: "rgba(255,255,255,0.75)" }}>GHOST JOB</div>
      ) : null}
      <div style={{ position: "absolute", right: 60, top: 655, fontSize: 90, opacity: ghost, transform: `translateY(${Math.sin(t * 3) * 10}px)` }}>👻</div>
    </AbsoluteFill>
  );
};

// ---------- 2 · recruiter side: filled internally / ad stays up / collecting CVs ----------
const REASONS = [
  { k: "filled" as const, icon: "✅", who: "Filled internally", what: "A month ago. Nobody told the job board.", tag: "closed" },
  { k: "stays" as const, icon: "📌", who: "Ad still live", what: "Reposted automatically, looks brand new", tag: "still up" },
  { k: "collect" as const, icon: "🗂️", who: "Collecting CVs", what: "For roles that might open later", tag: "maybe" },
];
const SideScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.im - 0.05;
  const inn = sp(t, t0, 14, 160);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 44, color: TH.ink, ...pop(t, t0 + 0.05) }}>What I see <span style={{ color: GREEN }}>every week</span></div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, display: "flex", flexDirection: "column", gap: 22 }}>
        {REASONS.map((r, i) => {
          const a = A[r.k] - 0.12;
          if (t <= a) {
            return (
              <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", height: 136, boxSizing: "border-box", border: "3px dashed #B9C4BE", background: "rgba(255,255,255,0.7)", borderRadius: 24, ...pop(t, t0 + 0.15 + i * 0.12, 0.5) }}>
                <div style={{ width: 92, height: 92, borderRadius: 22, background: "#E1E7E3", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 46, color: "#7E8C85" }}>?</div>
                <div style={{ flex: 1 }}>
                  <div style={{ width: "46%", height: 26, borderRadius: 13, background: "#DCE3DF", marginBottom: 14 }} />
                  <div style={{ width: "68%", height: 20, borderRadius: 10, background: "#E6EBE8" }} />
                </div>
              </div>
            );
          }
          return (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", height: 136, boxSizing: "border-box", background: "#FFF", border: `3px solid ${GREEN}`, borderRadius: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", ...pop(t, a, 0.7) }}>
              <div style={{ width: 92, height: 92, borderRadius: 22, background: TH.accentSoft, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>{r.who}</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 28, color: TH.dim, whiteSpace: "nowrap" }}>{r.what}</div>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 26, color: i === 0 ? RED : "#B7791F", background: i === 0 ? "#FDECEC" : "#FFF4DD", borderRadius: 999, padding: "6px 16px", whiteSpace: "nowrap" }}>{r.tag}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · your evening on a cover letter → "check before you apply" ----------
const EveningScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.and2 - 0.05;
  const inn = sp(t, t0, 14, 170);
  const p = ramp(t, A.evening - 0.1, A.so, (x) => x);
  const mins = Math.round(19 * 60 + p * 4 * 60);
  const clock = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const LINES = ["Dear Hiring Manager,", "I was excited to see the Marketing", "Executive role at Halbrook Analytics.", "In my last role I grew our social", "channels by 40% in six months and…"];
  const chars = Math.floor(ramp(t, A.cover - 0.2, A.so, (x) => x) * LINES.join("").length);
  let left = chars;
  const chk = sp(t, A.check - 0.1, 11, 190);
  return (
    <AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 46 }}>🌙</span>
        <span style={{ fontFamily: fonts.bold, fontSize: 42, color: TH.ink }}>Your evening</span>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: p > 0.6 ? RED : GREEN, background: TH.accentSoft, borderRadius: 10, padding: "4px 14px", fontVariantNumeric: "tabular-nums" }}>{clock}</span>
      </div>
      <Card x={60} y={140} w={960} h={470} style={{ padding: "30px 40px", opacity: 1 - 0.5 * chk }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, marginBottom: 14 }}>Cover letter – Halbrook (v3).docx</div>
        {LINES.map((l, i) => {
          const shown = l.slice(0, Math.max(0, left));
          left -= l.length;
          return <div key={i} style={{ fontFamily: fonts.regular, fontSize: 33, color: TH.ink, lineHeight: 1.5, minHeight: 50 }}>{shown}</div>;
        })}
      </Card>
      {t > A.check - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", ...pop(t, A.check - 0.1, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 46, color: "#FFF", background: GREEN, borderRadius: 20, padding: "14px 34px", display: "inline-block", boxShadow: `0 0 34px ${MINT}88` }}>Check before you apply</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4-5 · Steps 1-3: the real claude.ai click path ----------
const CB = "#151515"; // claude.ai dark page
const BOXBG = "rgb(32,32,31)"; // claude.ai input box
const shot = (f: string) => staticFile(`bxgh-claude/${f}`);
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
const Dim: React.FC<{ y0: number; y1: number; o: number; w?: number }> = ({ y0, y1, o, w = 1600 }) => (
  <div style={{ position: "absolute", left: 0, top: y0, width: w, height: y1 - y0, background: CB, opacity: o }} />
);

// 01-prompt1-typed.png 1288x930: ad + findings y 180..630, question lines below
const P1: Line[] = [{ y0: 674, y1: 708, x0: 50, x1: 1178 }, { y0: 715, y1: 749, x0: 50, x1: 548 }];
const ClaudeA: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step1 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const te = A.news + 0.05;
  const ansAt = te + 0.25;
  const pasted = ramp(t, A.paste + 0.05, A.paste + 0.5, Easing.out(Easing.quad));
  const S2 = 0.8, L2 = (W - 1288 * S2) / 2, T2 = 40;
  const input: [number, number] = [L2 + 400 * S2, T2 + 400 * S2];
  const send: [number, number] = [L2 + 1217 * S2, T2 + 797 * S2];
  if (t >= ansAt) {
    // answer 1 (02-answer1.png 1176x1034): first paragraph ("couldn't find Halbrook") stays hidden
    const rev = ramp(t, ansAt, ansAt + 0.4, Easing.out(Easing.quad));
    return (
      <AbsoluteFill style={{ background: CB }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
          <Place src={shot("02-answer1.png")} s={0.86} sx={588} sy={420} px={540} py={PH * 0.5}>
            <Dim y0={0} y1={178} o={1} />
          </Place>
        </div>
      </AbsoluteFill>
    );
  }
  // question lines light up while Felix names them
  const hl = (a: number) => ramp(t, a - 0.1, a + 0.2);
  return (
    <AbsoluteFill style={{ background: CB, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.96 + 0.04 * inn})`, transformOrigin: "50% 40%" }}>
        <Place src={shot("01-prompt1-typed.png")} s={S2} sx={0} sy={0} px={L2} py={T2}>
          <div style={{ position: "absolute", left: 30, top: 175, width: 1225, height: 585, background: BOXBG, clipPath: `inset(${pasted * 100}% 0 0 0)` }} />
          {t < A.paste ? <div style={{ position: "absolute", left: 50, top: 190, fontFamily: fonts.regular, fontSize: 30, color: "#8A8A86" }}>How can I help you today?</div> : null}
          <TypeCover lines={P1} p={ramp(t, A.is - 0.1, te, (x) => x)} />
          <div style={{ position: "absolute", left: 44, top: 668, width: 360, height: 46, border: `3px solid ${MINT}`, borderRadius: 10, opacity: hl(A.careers) * (1 - hl(A.posted)) }} />
          <div style={{ position: "absolute", left: 640, top: 668, width: 345, height: 46, border: `3px solid ${MINT}`, borderRadius: 10, opacity: hl(A.posted) * (1 - hl(A.freeze)) }} />
          <div style={{ position: "absolute", left: 1000, top: 668, width: 185, height: 46, border: `3px solid ${MINT}`, borderRadius: 10, opacity: hl(A.freeze) }} />
          <div style={{ position: "absolute", left: 44, top: 709, width: 510, height: 46, border: `3px solid ${MINT}`, borderRadius: 10, opacity: hl(A.freeze) }} />
        </Place>
        <Cursor keys={[[t0, 860, 820], [A.open + 0.3, 420, 260, true], [A.paste - 0.1, input[0], input[1]], [A.paste, input[0], input[1], true], [te - 0.3, send[0] - 70, send[1] - 30], [te, send[0], send[1], true]]} showFrom={t0 + 0.2} />
      </div>
    </AbsoluteFill>
  );
};

// 03-prompt2-typed.png 1568x142, 04-answer2.png 1528x590
const P2: Line[] = [{ y0: 52, y1: 90, x0: 48, x1: 1410 }];
const ClaudeB: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step3 - 0.1;
  const te = A.verdict + 0.05;
  const ansAt = te + 0.2;
  const S4 = 0.66, L4 = (W - 1568 * S4) / 2, T4 = PH - 142 * S4 - 60;
  const slide = sp(t, t0, 15, 170);
  const send: [number, number] = [L4 + 1490 * S4, T4 + 70 * S4];
  if (t >= ansAt) {
    const rev = ramp(t, ansAt, ansAt + 0.35, Easing.out(Easing.quad));
    // apply → line 1, message → line 2 (push in), skip → line 3
    const z = ramp(t, A.message - 0.15, A.message + 0.5, Easing.inOut(Easing.cubic));
    const back = ramp(t, A.skip - 0.15, A.skip + 0.35, Easing.inOut(Easing.cubic));
    const zz = z * (1 - back);
    const s = 0.66 + 0.04 * zz;
    const fy = 370 + 28 * zz + 100 * back;
    const l1 = ramp(t, A.apply2 - 0.1, A.apply2 + 0.2) * (1 - z);
    const l3 = back;
    return (
      <AbsoluteFill style={{ background: CB }}>
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
          <Place src={shot("04-answer2.png")} s={s} sx={30} sy={fy} px={(W - 1528 * s) / 2 + 30 * s} py={PH * 0.52}>
            <Dim y0={0} y1={255} o={0.5 * Math.max(l1, zz, l3)} />
            <Dim y0={255} y1={352} o={0.6 * Math.max(zz, l3)} />
            <Dim y0={352} y1={440} o={0.6 * Math.max(l1, l3)} />
            <Dim y0={440} y1={590} o={0.6 * Math.max(l1, zz)} />
            <div style={{ position: "absolute", left: 24, top: 355, width: 1360, height: 84, border: `4px solid ${MINT}`, borderRadius: 14, opacity: zz }} />
          </Place>
        </div>
        {t > A.message + 0.4 && t < A.skip - 0.1 ? (
          <div style={{ position: "absolute", right: 50, top: 70, ...pop(t, A.message + 0.4, 0.5) }}>
            <Chip text="this is the move" bg={MINT} fg="#0B1F18" size={30} style={{ transform: "rotate(4deg)" }} />
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: CB }}>
      <div style={{ opacity: 0.5 }}>
        <Place src={shot("02-answer1.png")} s={0.82} sx={588} sy={560} px={540} py={PH * 0.4}>
          <Dim y0={0} y1={178} o={1} />
        </Place>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: T4 - 70, bottom: 0, background: `linear-gradient(transparent, ${CB} 60px)` }} />
      <Place src={shot("03-prompt2-typed.png")} s={S4} sx={0} sy={0} px={L4} py={T4} style={{ transform: `translateY(${(1 - slide) * 260}px) scale(${S4})` }}>
        <Dim y0={0} y1={22} o={1} />
        <TypeCover lines={P2} p={ramp(t, A.step3 + 0.5, te, (x) => x)} />
      </Place>
      <Cursor keys={[[t0, 700, 300], [te - 0.35, send[0] - 90, send[1] - 40], [te, send[0], send[1], true]]} showFrom={t0 + 0.3} />
    </AbsoluteFill>
  );
};

// ---------- 6 · payoff: "Your evenings are worth more than a ghost." ----------
const PayoffScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.your - 0.25;
  const inn = sp(t, t0, 14, 150);
  const gone = ramp(t, A.ghost1 - 0.1, A.ghost1 + 0.45, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 44 }}>🌙</span>
        <span style={{ fontFamily: fonts.bold, fontSize: 42, color: TH.ink }}>Your evening</span>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: GREEN, background: TH.accentSoft, borderRadius: 10, padding: "4px 14px" }}>19:00</span>
        <Chip text="free" bg={GREEN} size={30} style={pop(t, A.worth, 0.5)} />
      </div>
      <div style={{ opacity: 1 - gone, transform: `translateY(${-gone * 120}px) scale(${1 - 0.2 * gone})`, filter: `blur(${gone * 8}px)` }}>
        <JobAd t={t} ghost={0.7} />
        <div style={{ position: "absolute", right: 70, top: 640, fontSize: 96, transform: `translateY(${Math.sin(t * 3) * 10}px)` }}>👻</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: serifItalic, fontSize: 76, color: GREEN, opacity: Math.min(1, gone * 1.6), transform: `scale(${0.9 + 0.1 * gone})` }}>worth more than a ghost.</div>
    </AbsoluteFill>
  );
};

// ---------- 7 · guide PDF scroll (Comment GHOST → end) ----------
const PAGES = Array.from({ length: 3 }, (_, i) => staticFile(`bxgh-guide/p${String(i + 1).padStart(2, "0")}.png`));
const GuideScroll: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.comment;
  const inn = sp(t, t0 - 0.05, 14, 150);
  const PW = 520, PHh = Math.round(PW * 1.414), GAPp = 22, PITCH = PHh + GAPp;
  const dur = 1.4;
  const pos = (tt: number) => ramp(tt, t0 + 0.2, t0 + 0.2 + dur, Easing.inOut(Easing.cubic)) * (PAGES.length - 1) * PITCH;
  const y = pos(t);
  const page = Math.min(PAGES.length, Math.floor((y + PHh / 2) / PITCH) + 1);
  const SAMPLES = 8;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 900}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 200, width: 840, height: 600, borderRadius: 26, overflow: "hidden", background: "#E9EEEB", boxShadow: "0 30px 70px rgba(0,0,0,0.25)", transform: `perspective(1600px) rotateX(10deg) rotate(${-2 + inn * 2}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#0B1F18", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 2 }}>
          <div style={{ width: 30, height: 36, borderRadius: 6, background: "#C9473F", color: "#FFF", fontFamily: fonts.bold, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>Ghost job check.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>GHOST</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.5) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>the prompts + checklist</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 0.8) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXGHMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxgh-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.your - 0.25;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.im - 0.05, SideScene], [A.and2 - 0.05, EveningScene], [A.step1 - 0.1, ClaudeA], [A.step3 - 0.1, ClaudeB], [A.your - 0.25, PayoffScene], [A.comment - 0.1, GuideScroll],
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
