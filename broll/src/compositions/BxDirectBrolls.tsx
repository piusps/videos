import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-direct ("Easy Apply"), story format, 2026-10-28.
// Built like BxDecodeBrolls (split: panel top, Felix below), but under the skiprate standard:
// frame 0 already shows the finished hook (headline + phone call with the question), no entrance animation on it.
// Job ad (Brookmoor Foods, Leeds) and CV (Sam Okafor, Hartley Logistics) are invented. Claude screens = real claude.ai chat 3c1d9c28 rendered from its DOM.

const TH = HOOK_THEMES.boilr;
const MINT = "#5FD3A0";
const GREEN = "#0A5F45";
const RED = "#E5484D";
const DARK = "#0B1F18";
const W = 1080;
const H = 1920;
const PF = 0.48;
const PH = Math.round(H * PF);
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

import captionsJson from "../../runs/bx-direct/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  click: at("click"), applicants: at("applicants"), never: at("never"), instead: at("instead"), boss: at("boss"),
  step1: at("step", 1), paste: at("paste"), report: at("report"),
  step2: at("step", 2), search: at("search"), linkedin: at("linkedin"),
  step3: at("step", 3), why: at("why"), proof: at("proof"), question: at("question"),
  something: at("something"), hiring: at("hiring"), cut: at("cut"), directly: at("directly"),
  still: at("still"), waiting: at("waiting"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXEA_FRAMES = Math.round(A.total * 25);

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
const Chip: React.FC<{ text: string; bg?: string; fg?: string; size?: number; style?: React.CSSProperties }> = ({ text, bg = GREEN, fg = "#FFF", size = 26, style }) => (
  <span style={{ fontFamily: fonts.semibold, fontSize: size, color: fg, background: bg, borderRadius: 999, padding: "6px 18px", whiteSpace: "nowrap", display: "inline-block", ...style }}>{text}</span>
);

const CB = "#191919"; // claude.ai dark page
const shot = (f: string) => staticFile(`bxea-claude/${f}`);

// ---------- 1 · Hook: Easy Apply + the pile (complete at frame 0) ----------
const BLUE = "#0A66C2";
const Hook: React.FC<{ t: number }> = ({ t }) => {
  // applicant counter runs from frame 0 and lands on "Over 100" when he says "applicants"
  const n = Math.round(interpolate(t, [0, A.applicants], [38, 100], { ...clamp, easing: Easing.in(Easing.quad) }));
  const label = n >= 100 ? "Over 100 applicants" : `${n} applicants`;
  const pressed = t < 0.5 ? 1 : 0; // button already shows "Applied" from frame 0
  const pile = Math.min(9, Math.floor(interpolate(t, [0, A.applicants], [3, 9], clamp)));
  const closed = t > A.never - 0.15;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 80, lineHeight: 1.04, color: TH.ink }}>Easy Apply?<br /><span style={{ color: RED }}>So did 100+ others.</span></div>
      <div style={{ position: "absolute", left: 50, top: 240, width: 600, height: 330, borderRadius: 30, background: "#FFF", border: `3px solid ${TH.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.12)", padding: "26px 30px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ width: 70, height: 70, borderRadius: 14, background: "#F2E3C6", color: "#8A5A12", fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>B</div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: TH.ink, lineHeight: 1.1 }}>Junior Data Analyst</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim }}>Brookmoor Foods · Leeds</div>
          </div>
        </div>
        <div style={{ marginTop: 22, fontFamily: fonts.semibold, fontSize: 30, color: n >= 100 ? RED : TH.dim, fontVariantNumeric: "tabular-nums" }}>{label}</div>
        <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 10, background: BLUE, color: "#FFF", fontFamily: fonts.bold, fontSize: 32, borderRadius: 999, padding: "12px 30px", transform: `scale(${1 - 0.04 * pressed})` }}>
          ✓ Applied · Easy Apply
        </div>
      </div>
      {/* the pile of CVs */}
      <div style={{ position: "absolute", left: 690, top: 250, width: 340, height: 330 }}>
        {Array.from({ length: pile }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 30 + ((i * 37) % 60) - 20, top: 210 - i * 22, width: 230, height: 120, borderRadius: 14, background: i === pile - 1 ? "#FFF" : "#F3F5F4", border: `2px solid ${TH.line}`, transform: `rotate(${((i * 53) % 13) - 6}deg)`, boxShadow: "0 6px 14px rgba(0,0,0,0.08)" }}>
            <div style={{ margin: "18px 0 0 18px", width: 120, height: 14, borderRadius: 7, background: "#D5DDD9" }} />
            <div style={{ margin: "12px 0 0 18px", width: 170, height: 10, borderRadius: 5, background: "#E3E8E6" }} />
            <div style={{ margin: "10px 0 0 18px", width: 140, height: 10, borderRadius: 5, background: "#E3E8E6" }} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>CV pile</div>
      </div>
      {t > A.click + 0.25 ? (
        <div style={{ position: "absolute", left: 60, top: 600, ...pop(t, A.click + 0.25, 0.6) }}>
          <Chip text="10 seconds. Done." bg={DARK} fg={MINT} size={40} style={{ padding: "10px 26px" }} />
        </div>
      ) : null}
      {closed ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", ...pop(t, A.never - 0.15, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 62, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-3deg)" }}>Most never get opened</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · instead: one short message to your future boss ----------
const Instead: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.instead - 0.35;
  const inn = sp(t, t0, 14, 160);
  const fly = ramp(t, A.boss - 0.9, A.boss + 0.1, Easing.inOut(Easing.cubic));
  const x = interpolate(fly, [0, 1], [150, 700]);
  const y = interpolate(fly, [0, 1], [430, 330]) - Math.sin(fly * Math.PI) * 90;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, fontFamily: fonts.bold, fontSize: 70, lineHeight: 1.05, color: TH.ink }}>Instead: <span style={{ color: GREEN }}>one short message.</span></div>
      {/* grey pile on the left, faded */}
      <div style={{ position: "absolute", left: 50, top: 560, width: 300, opacity: 0.75 }}>
        {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 23) % 40, top: -i * 16, width: 220, height: 100, borderRadius: 12, background: "#F3F5F4", border: `2px solid ${TH.line}`, transform: `rotate(${((i * 47) % 11) - 5}deg)` }} />)}
        <div style={{ position: "absolute", top: 120, left: 0, fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>Over 100 applicants</div>
      </div>
      {/* the person who'd be your boss */}
      <div style={{ position: "absolute", left: 640, top: 240, width: 380, height: 300, borderRadius: 30, background: "#FFF", border: `3px solid ${fly > 0.98 ? GREEN : TH.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, ...pop(t, t0 + 0.2, 0.7) }}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: TH.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={60} height={60} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2" fill={GREEN} /><path d="M3.5 21c0-4.4 3.8-7.5 8.5-7.5s8.5 3.1 8.5 7.5" fill={GREEN} /></svg>
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink, textAlign: "center", lineHeight: 1.1 }}>Your future boss</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: TH.dim }}>the hiring manager</div>
      </div>
      {/* message bubble flying across */}
      <div style={{ position: "absolute", left: x, top: y, transform: `scale(${1 - fly * 0.35}) rotate(${-4 + fly * 4}deg)`, transformOrigin: "0 0", opacity: fly > 0.99 ? 0 : 1 }}>
        <div style={{ background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 34, borderRadius: "26px 26px 26px 8px", padding: "16px 26px", boxShadow: "0 14px 30px rgba(10,95,69,0.35)" }}>3 lines ✉</div>
      </div>
      {fly > 0.98 ? (
        <div style={{ position: "absolute", left: 640, width: 380, top: 560, textAlign: "center", ...pop(t, A.boss + 0.1, 0.5) }}>
          <Chip text="✓ Seen" bg={DARK} fg={MINT} size={36} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3-5 · steps: real claude.ai chat (strip.png, 705 px wide) ----------
const StepTag: React.FC<{ t: number; t0: number; n: number; text: string }> = ({ t, t0, n, text }) => (
  <div style={{ position: "absolute", left: 24, top: 24, ...pop(t, t0 + 0.05, 0.7) }}>
    <span style={{ fontFamily: fonts.bold, fontSize: 34, color: DARK, background: MINT, borderRadius: 14, padding: "8px 18px", display: "inline-block" }}>Step {n} · {text}</span>
  </div>
);
const Step1: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <ScrollShot t={t} t0={A.step1 - 0.1} src={shot("strip.png")} sw={705} keys={[[A.step1, 60], [A.report - 0.2, 110], [A.report + 0.6, 560], [A.step2 - 0.1, 600]]} />
    <StepTag t={t} t0={A.step1 - 0.1} n={1} text="Who's the boss?" />
  </AbsoluteFill>
);
const Step2: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <ScrollShot t={t} t0={A.step2 - 0.1} src={shot("strip.png")} sw={705} keys={[[A.step2, 900], [A.linkedin, 960], [A.step3 - 0.1, 1010]]} />
    <StepTag t={t} t0={A.step2 - 0.1} n={2} text="Find the title" />
  </AbsoluteFill>
);
const Step3: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill>
    <ScrollShot t={t} t0={A.step3 - 0.1} src={shot("strip.png")} sw={705} keys={[[A.step3, 1500], [A.why - 0.1, 1560], [A.question, 1990], [A.something - 0.1, 2010]]} />
    <StepTag t={t} t0={A.step3 - 0.1} n={3} text="3 lines" />
  </AbsoluteFill>
);

// ---------- 6 · the message, big ----------
const Sentence: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.something - 0.1;
  const inn = sp(t, t0, 14, 150);
  const l1 = ramp(t, A.hiring - 0.6, A.hiring);
  const l2 = ramp(t, A.cut - 0.4, A.cut + 0.1);
  const l3 = ramp(t, A.directly - 0.6, A.directly);
  const lines: [string, string, number][] = [["Why them", "Hi, I saw you're hiring a junior analyst.", l1], ["Proof", "In my last job, I cut our weekly report from two days to three hours.", l2], ["Question", "Could I send you my CV directly?", l3]];
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.semibold, fontSize: 34, color: GREEN }}>Your message, 3 lines:</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 110, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 30, padding: "30px 36px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 22 }}>
        {lines.map(([k, v, on]) => (
          <div key={k} style={{ opacity: 0.25 + 0.75 * on, transform: `translateX(${(1 - on) * 20}px)` }}>
            <Chip text={k} size={24} bg={on > 0.5 ? GREEN : TH.line} fg={on > 0.5 ? "#FFF" : TH.dim} />
            <div style={{ marginTop: 8, fontFamily: serifItalic, fontSize: 46, lineHeight: 1.16, color: TH.ink }}>{v}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7 · still apply, but now someone's waiting ----------
const Waiting: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.still - 0.1;
  const inn = sp(t, t0, 14, 160);
  const w = t > A.waiting - 0.15;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 70, color: TH.ink }}>Still apply.</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 170, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 26, padding: "24px 30px", display: "flex", alignItems: "center", gap: 20, ...pop(t, t0 + 0.1, 0.8) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: BLUE, borderRadius: 999, width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
          <div><div style={{ fontFamily: fonts.bold, fontSize: 38, color: TH.ink }}>Application sent</div><div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>the normal way</div></div>
        </div>
        <div style={{ background: w ? TH.accentSoft : "#FFF", border: `3px solid ${w ? GREEN : TH.line}`, borderRadius: 26, padding: "24px 30px", display: "flex", alignItems: "center", gap: 20, ...pop(t, t0 + 0.35, 0.8) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 36, color: "#FFF", background: GREEN, borderRadius: 999, width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>✉</span>
          <div><div style={{ fontFamily: fonts.bold, fontSize: 38, color: TH.ink }}>Message to the manager</div><div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREEN }}>{w ? "Seen · they know your name" : "sent"}</div></div>
        </div>
      </div>
      {w ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", ...pop(t, A.waiting - 0.15, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 56, color: "#FFF", background: GREEN, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-2deg)" }}>Someone's waiting for it</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3-5  · steps 1-3: real claude.ai screens (strip.png, 705 px wide), scrolled in sync ----------
// keys: [time, source y at panel top]; sw = source width of the strip
const ScrollShot: React.FC<{ t: number; src: string; keys: [number, number][]; sw: number; t0: number; top?: number }> = ({ t, src, keys, sw, t0, top = 0 }) => {
  const s = W / sw;
  const y = interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rev = ramp(t, t0, t0 + 0.4, Easing.out(Easing.quad));
  const push = 1 + 0.03 * ramp(t, t0, keys[keys.length - 1][0] + 1.5, (x) => x);
  return (
    <AbsoluteFill style={{ background: CB, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${push})`, transformOrigin: "50% 30%", width: W, height: PH }}>
        <Img src={src} style={{ position: "absolute", left: 0, top: top - y * s, width: sw * s }} />
      </div>
    </AbsoluteFill>
  );
};
// ---------- 7 · guide PDF scroll (Comment INTERVIEW → end) ----------
const GUIDE_PAGES = 5;
const PAGES = Array.from({ length: GUIDE_PAGES }, (_, i) => staticFile(`bxea-guide/guide-page-${i + 1}.png`));
const GuideScroll: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.comment;
  const inn = sp(t, t0 - 0.05, 14, 150);
  const PW = 520, PHh = Math.round(PW * 1.414), GAPp = 22, PITCH = PHh + GAPp;
  const dur = 2.0;
  const pos = (tt: number) => ramp(tt, t0 + 0.25, t0 + 0.25 + dur, Easing.inOut(Easing.cubic)) * (PAGES.length - 1) * PITCH;
  const y = pos(t);
  const page = Math.min(PAGES.length, Math.floor((y + PHh / 2) / PITCH) + 1);
  const SAMPLES = 8;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 900}px)` }}>
      <div style={{ position: "absolute", left: 120, top: 200, width: 840, height: 600, borderRadius: 26, overflow: "hidden", background: "#E9EEEB", boxShadow: "0 30px 70px rgba(0,0,0,0.25)", transform: `perspective(1600px) rotateX(10deg) rotate(${-2 + inn * 2}deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: DARK, display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 2 }}>
          <div style={{ width: 30, height: 36, borderRadius: 6, background: "#C9473F", color: "#FFF", fontFamily: fonts.bold, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>direct-guide.pdf</div>
          <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: DARK, background: MINT, borderRadius: 10, padding: "4px 12px", fontVariantNumeric: "tabular-nums" }}>{page} / {PAGES.length}</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>DIRECT</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>3-line message</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXEAMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxea-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.something - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.instead - 0.35, Instead], [A.step1 - 0.1, Step1], [A.step2 - 0.1, Step2], [A.step3 - 0.1, Step3],
    [A.something - 0.1, Sentence], [A.still - 0.1, Waiting], [A.comment - 0.1, GuideScroll],
  ];
  let idx = 0;
  scenes.forEach(([a], i) => { if (t >= a) idx = i; });
  const El = scenes[idx][1];
  const since = t - scenes[idx][0];
  // no whip, drift or zoom on the opening scene: frame 0 must already be the finished hook
  const whip = idx === 0 ? 0 : Math.max(0, 1 - since / 0.18);
  const drift = idx === 0 ? 0 : 1;
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
          <AbsoluteFill style={{ transform: `translate(${drift * Math.sin(t * 0.9) * 5}px, ${whip * 40 + drift * Math.sin(t * 1.3) * 3}px) scale(${1 + drift * 0.006 * since})`, filter: whip > 0.05 ? `blur(${whip * 6}px)` : undefined }}>
            <El t={t} />
          </AbsoluteFill>
          {!dark ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} /> : null}
        </div>
      </AbsoluteFill>
    </ClaudeLang.Provider>
  );
};
