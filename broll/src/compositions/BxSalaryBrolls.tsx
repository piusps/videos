import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { C, ClaudeLang, ClaudeMark, typed } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-salary ("Your first offer isn't the final number"), graduate series, 2026-10-18.
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

import captionsJson from "../../runs/bx-salary/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  straight: at("straight"), two: at("2000", 1), year: at("year", 1), every: at("every"), im: at("im"), offer: at("offer", 2), room: at("room"), not: at("not"), but: at("but"), heres: at("heres"),
  step1: at("step", 1), ask1: at("ask", 2), sources: at("sources"), step2: at("step", 2), paste: at("paste"), sits: at("sits"), range: at("range"),
  step3: at("step", 3), short: at("short"), thank: at("thank"), excited: at("excited"), number: at("number"),
  polite: at("polite"), two2: at("2000", 2), year2: at("year", 2), email: at("email"), comment: at("comment"), total: CAPS[CAPS.length - 1].endMs / 1000 + 0.8,
};
export const BXS_FRAMES = Math.round(A.total * 25);

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

// ---------- 1 · Hook: the offer, accepted on the spot, −£2,000 a year (0 → "I'm") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const clickAt = A.straight - 0.05;
  const accepted = t > clickAt + 0.1;
  const loss = 2000 * ramp(t, A.two - 0.1, A.year + 0.3);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 36, textAlign: "center", fontFamily: fonts.bold, fontSize: 62, color: TH.ink, lineHeight: 1.05 }}>
        Your first offer <span style={{ background: GREEN, color: "#FFF", borderRadius: 14, padding: "0 14px" }}>isn't final</span>
      </div>
      <Card x={60} y={170} w={620} h={470} style={{ padding: "28px 32px" }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, letterSpacing: 1.5 }}>OFFER OF EMPLOYMENT</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 42, color: TH.ink, marginTop: 10 }}>Graduate Analyst</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 26, color: TH.dim, marginTop: 4 }}>Halden Group · Leeds</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 76, color: TH.ink, marginTop: 24 }}>£28,000</div>
        <div style={{ position: "absolute", left: 32, right: 32, bottom: 30, display: "flex", gap: 16 }}>
          <div style={{ flex: 1, height: 84, borderRadius: 18, background: accepted ? GREEN : MINT, color: accepted ? "#FFF" : "#0B1F18", fontFamily: fonts.bold, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t > clickAt && t < clickAt + 0.2 ? 0.92 : 1})` }}>{accepted ? "✓ Accepted" : "Accept"}</div>
          <div style={{ width: 200, height: 84, borderRadius: 18, border: `3px solid ${TH.line}`, color: TH.dim, fontFamily: fonts.semibold, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>Reply</div>
        </div>
      </Card>
      {/* cursor */}
      {t < clickAt + 0.5 ? <div style={{ position: "absolute", left: 220 + 60 * (1 - ramp(t, 0.3, clickAt)), top: 590 + 60 * (1 - ramp(t, 0.3, clickAt)), width: 44, height: 44, borderRadius: 22, border: "5px solid #0B1F18", background: "rgba(255,255,255,0.7)" }} /> : null}
      <Card x={710} y={250} w={330} h={260} style={{ padding: "22px 24px", border: `3px solid ${RED}`, ...pop(t, A.two - 0.15, 0.5) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: RED, letterSpacing: 1.2 }}>LEFT ON THE TABLE</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 64, color: RED, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>−{fmtGBP(loss)}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.ink }}>every year</div>
      </Card>
      <Stamp t={t} at={A.every - 0.05} text="SAID YES IN 4 MIN" x={600} y={600} rot={-6} size={38} />
    </AbsoluteFill>
  );
};

// ---------- 2 · recruiter view: there's often room in the budget ----------
const Room: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.im - 0.05;
  const inn = sp(t, t0, 14, 160);
  const gap = ramp(t, A.room - 0.2, A.room + 0.4);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 42, color: TH.ink, ...pop(t, t0 + 0.05) }}>What I see on my side</div>
      <Card x={40} y={130} w={1000} h={420} style={{ padding: "34px 36px" }}>
        {[{ l: "Your offer", v: 28000, c: MINT }, { l: "Their budget", v: 31000, c: GREEN }].map((b, i) => (
          <div key={b.l} style={{ marginTop: i ? 36 : 0, ...pop(t, A.offer - 0.1 + i * 0.4, 0.8) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.bold, fontSize: 34, color: TH.ink }}><span>{b.l}</span><span>{fmtGBP(b.v)}</span></div>
            <div style={{ height: 46, borderRadius: 14, background: "#E3EAE6", marginTop: 12, overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${(b.v / 32000) * 100 * ramp(t, A.offer + i * 0.4, A.offer + 0.6 + i * 0.4)}%`, height: "100%", background: b.c, borderRadius: 14 }} />
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36 + 928 * (28000 / 32000), top: 210, width: 928 * (3000 / 32000) * gap, height: 46, borderRadius: 10, border: `4px dashed ${RED}`, boxSizing: "border-box", opacity: gap }} />
        <div style={{ position: "absolute", right: 40, top: 280, ...pop(t, A.room, 0.5) }}><Chip text="room left" bg={RED} size={30} /></div>
      </Card>
      <div style={{ position: "absolute", left: 40, top: 600, display: "flex", gap: 16 }}>
        <div style={pop(t, A.not - 0.05, 0.7)}><Chip text="Not always" bg="#FFF" fg={TH.ink} size={34} style={{ border: `3px solid ${TH.line}` }} /></div>
        <div style={pop(t, A.but - 0.05, 0.7)}><Chip text="But often" size={34} /></div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 720, textAlign: "center", fontFamily: serifItalic, fontSize: 64, color: TH.ink, ...pop(t, A.heres - 0.05, 0.7) }}>ask without sounding greedy</div>
    </AbsoluteFill>
  );
};

// ---------- 3 · Step 1: Claude, what does this role pay? ----------
const ASK = "What does a Graduate Analyst earn in Leeds, entry level? Give me a range and your sources.";
const ClaudeAsk: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step1 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const txt = typed(ASK, t, A.ask1 - 0.05, A.sources - 0.1);
  const res = t > A.sources + 0.1;
  return (
    <AbsoluteFill style={{ background: C.bg, transform: `scale(${0.9 + 0.1 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: MINT, color: "#0B1F18", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
        <ClaudeMark size={48} /><span style={{ fontFamily: serifItalic, fontSize: 56, color: C.text }}>Claude</span>
        <span style={{ fontFamily: fonts.medium, fontSize: 24, color: MINT, border: `2px solid ${MINT}`, borderRadius: 999, padding: "6px 16px", marginLeft: 10 }}>🌐 Web search</span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 140, width: 1000, background: C.panel, border: `2px solid ${MINT}`, borderRadius: 28, padding: "24px 28px", boxSizing: "border-box", fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.35, color: C.text, minHeight: 200 }}>
        {txt}{!res && Math.floor(t * 2) % 2 === 0 ? "|" : ""}
      </div>
      {res ? (
        <div style={{ position: "absolute", left: 40, top: 380, width: 1000, background: C.panel, border: `2px solid ${C.panelBorder}`, borderRadius: 24, padding: "24px 28px", boxSizing: "border-box", ...pop(t, A.sources + 0.1, 0.9) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.dim, letterSpacing: 1.5 }}>GRADUATE ANALYST · LEEDS</div>
          <div style={{ position: "relative", height: 60, borderRadius: 14, background: `linear-gradient(90deg, #2A3B33, ${GREEN}, ${MINT})`, marginTop: 20 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.bold, fontSize: 32, color: C.text, marginTop: 12 }}><span>£26k</span><span>£30k</span><span>£34k</span></div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            {["prospects.ac.uk", "reed.co.uk", "glassdoor.co.uk"].map((s, i) => <span key={s} style={{ fontFamily: fonts.medium, fontSize: 22, color: C.text, border: `2px solid ${C.panelBorder}`, borderRadius: 999, padding: "6px 14px", ...pop(t, A.sources + 0.3 + i * 0.12) }}>↗ {s}</span>)}
          </div>
          <div style={{ fontFamily: fonts.regular, fontSize: 20, color: C.dim, marginTop: 12 }}>example figures</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4 · Step 2: where does my offer sit? ----------
const Sits: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step2 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const m = ramp(t, A.sits - 0.2, A.range + 0.2, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: MINT, color: "#0B1F18", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: C.text }}>Where does my offer sit?</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 150, background: C.userBubble, borderRadius: 20, padding: "14px 22px", fontFamily: fonts.regular, fontSize: 30, color: C.text, ...pop(t, A.paste - 0.05, 0.9) }}>📎 offer-letter.pdf · £28,000</div>
      <div style={{ position: "absolute", left: 40, top: 300, width: 1000 }}>
        <div style={{ position: "relative", height: 70, borderRadius: 16, background: `linear-gradient(90deg, #2A3B33, ${GREEN}, ${MINT})` }}>
          <div style={{ position: "absolute", left: `${25 * m}%`, top: -60, transform: "translateX(-50%)", opacity: Math.min(1, m * 2) }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: RED, borderRadius: 12, padding: "6px 14px", whiteSpace: "nowrap" }}>your offer</div>
            <div style={{ width: 4, height: 90, background: RED, margin: "0 auto" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.bold, fontSize: 32, color: C.text, marginTop: 14 }}><span>£26k</span><span>£30k</span><span>£34k</span></div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 560, ...pop(t, A.range + 0.15, 0.6) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.panel, border: `3px solid ${MINT}`, borderRadius: 22, padding: "20px 26px" }}>
          <ClaudeMark size={40} />
          <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: C.text }}>Lower quarter. Asking for £30k is reasonable.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5 · Step 3: the short reply ----------
const LINES = [
  { at: () => A.thank, label: "THANK THEM", text: "Thank you so much for the offer." },
  { at: () => A.excited, label: "YOU'RE EXCITED", text: "I'm genuinely excited about the role and the team." },
  { at: () => A.number, label: "ONE NUMBER, ONE REASON", text: "Similar roles in Leeds pay £29–32k. Is there room to go to £30,000?" },
];
const Reply: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step3 - 0.1;
  const inn = sp(t, t0, 14, 160);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>To: Hiring Manager</span>
        <Chip text="3 lines" style={pop(t, A.short)} />
      </div>
      <Card x={40} y={130} w={1000} h={640} style={{ padding: "26px 30px" }}>
        {LINES.map((l, i) => {
          const a0 = l.at();
          const a = sp(t, a0 - 0.1, 13, 180);
          if (t < a0 - 0.15) return <div key={i} style={{ height: 196, ...pop(t, t0 + 0.3 + i * 0.15, 0.8) }}><div style={{ width: 220, height: 30, borderRadius: 15, background: "#E3EAE6" }} /><div style={{ width: `${[80, 70, 90][i]}%`, height: 30, borderRadius: 10, background: "#EEF2F0", marginTop: 18 }} /></div>;
          return (
            <div key={i} style={{ height: 196, opacity: Math.min(1, a * 2), transform: `translateX(${(1 - a) * 300}px)` }}>
              <Chip text={l.label} bg={i === 2 ? "#FFF" : i === 0 ? GREEN : MINT} fg={i === 2 ? GREEN : i === 0 ? "#FFF" : "#0B1F18"} size={22} style={{ border: i === 2 ? `2px solid ${GREEN}` : undefined }} />
              <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: TH.ink, lineHeight: 1.3, marginTop: 10 }}>{l.text}</div>
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

// ---------- 6 · payoff: they said yes, +£2,000 a year ----------
const Payoff: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.polite - 0.05;
  const inn = sp(t, t0, 14, 150);
  const gain = 2000 * ramp(t, A.two2 - 0.1, A.year2 + 0.3);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <Card x={140} y={120} w={800} h={220} style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 24, border: `3px solid ${MINT}`, boxShadow: `0 0 30px ${MINT}88` }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>↩</div>
        <div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>Re: Offer · Halden Group</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 42, color: TH.ink }}>"We can do £30,000. Welcome aboard!"</div>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", ...pop(t, A.two2 - 0.15, 0.5) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 130, color: GREEN, fontVariantNumeric: "tabular-nums" }}>+{fmtGBP(gain)}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: TH.ink }}>a year, from one email</div>
      </div>
      <Stamp t={t} at={A.email - 0.05} text="1 EMAIL" x={720} y={700} rot={-8} color={GREEN} size={48} />
    </AbsoluteFill>
  );
};

// ---------- 9 · guide PDF scroll (Comment REPOST → end) ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`bxs-guide/p${String(i + 1).padStart(2, "0")}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>Your first offer.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>SALARY</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>3 prompts</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXSMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxs-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.step3 - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.im - 0.05, Room], [A.step1 - 0.1, ClaudeAsk], [A.step2 - 0.1, Sits], [A.step3 - 0.1, Reply], [A.polite - 0.05, Payoff], [A.comment - 0.1, GuideScroll],
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
