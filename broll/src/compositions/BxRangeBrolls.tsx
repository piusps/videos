import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-range ("Salary expectations"), story-format test, 2026-10-26.
// Built like BxDecodeBrolls (split: panel top, Felix below), but under the skiprate standard:
// frame 0 already shows the finished hook (headline + phone call with the question), no entrance animation on it.
// Job ad (Northgate Insurance, Leeds) and CV (Sam Patel) are invented. £32k = ITJobsWatch entry-level data analyst Leeds (£25k–£32k), via Claude.

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

import captionsJson from "../../runs/bx-range/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  say1: at("say", 1), similar: at("similar", 1), up: at("up"), gave: at("gave"), sentence1: at("sentence", 1),
  never: at("never"), blind: at("blind"), before: at("before"),
  step1: at("step", 1), paste: at("paste"),
  step2: at("step", 2), pay2: at("pay", 2), now: at("now"), sources: at("sources"),
  step3: at("step", 3), write: at("write"), range1: at("range", 1), market: at("market"),
  something: at("something"), looking: at("looking"),
  make: at("make"), bottom: at("bottom"), hear: at("hear"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXRG_FRAMES = Math.round(A.total * 25);

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
const gbp = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

const CB = "#191919"; // claude.ai dark page
const shot = (f: string) => staticFile(`bxr-claude/${f}`);

// ---------- 1 · Hook: the phone call (complete at frame 0) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const secs = 42 + Math.floor(t);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 76, lineHeight: 1.04, color: TH.ink }}>One sentence.<br /><span style={{ color: RED }}>£7,000 gone.</span></div>
      <div style={{ position: "absolute", left: 50, top: 236, width: 980, height: 340, borderRadius: 34, background: DARK, boxShadow: "0 24px 50px rgba(0,0,0,0.22)", padding: "28px 34px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: "#2B4A3E", color: "#FFF", fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>R</div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: "#FFF" }}>Recruiter</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: MINT }}>Junior Data Analyst · Leeds</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: "#FFF", fontVariantNumeric: "tabular-nums" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: RED, opacity: 0.5 + 0.5 * Math.sin(t * 6) }} />
            00:{String(secs).padStart(2, "0")}
          </div>
        </div>
        <div style={{ marginTop: 34, display: "inline-block", maxWidth: 800, background: "#FFF", borderRadius: "30px 30px 30px 8px", padding: "22px 30px", fontFamily: fonts.bold, fontSize: 50, lineHeight: 1.12, color: TH.ink }}>
          “So, what are your salary expectations?”
        </div>
      </div>
      {t > A.say1 - 0.1 ? (
        <div style={{ position: "absolute", right: 70, top: 610, display: "flex", alignItems: "center", gap: 18, ...pop(t, A.say1 - 0.1, 0.5) }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: TH.dim }}>You:</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 72, color: "#FFF", background: GREEN, borderRadius: "30px 30px 8px 30px", padding: "12px 34px", display: "inline-block" }}>“£25,000.”</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · similar roles pay up to £32k → £7,000 a year gone ----------
const LossScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.similar - 0.05;
  const inn = sp(t, t0, 14, 160);
  const grow = ramp(t, A.up - 0.1, A.up + 0.6);
  const BW = 900, MAXV = 34000;
  const x25 = (25000 / MAXV) * BW, x32 = (32000 / MAXV) * BW;
  const gap = t > A.gave - 0.1;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 48, color: TH.ink }}>Similar roles in Leeds</div>
      <div style={{ position: "absolute", left: 90, top: 150 }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim }}>You said</div>
        <div style={{ width: x25, height: 90, marginTop: 10, borderRadius: 18, background: "#C9D3CE", display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box", fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>£25,000</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, marginTop: 34 }}>Advertised up to</div>
        <div style={{ width: x25 + (x32 - x25) * grow, height: 90, marginTop: 10, borderRadius: 18, background: GREEN, display: "flex", alignItems: "center", paddingLeft: 26, boxSizing: "border-box", fontFamily: fonts.bold, fontSize: 46, color: "#FFF", fontVariantNumeric: "tabular-nums" }}>{gbp(25000 + 7000 * grow)}</div>
        {gap ? <div style={{ position: "absolute", left: x25, top: 46, width: x32 - x25, height: 300, borderLeft: `4px dashed ${RED}`, borderRight: `4px dashed ${RED}`, background: "rgba(229,72,77,0.10)", ...pop(t, A.gave - 0.1, 0.8) }} /> : null}
      </div>
      {gap ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", ...pop(t, A.gave - 0.1, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 84, color: "#FFF", background: RED, borderRadius: 22, padding: "10px 34px", display: "inline-block", transform: "rotate(-3deg)" }}>−£7,000 a year</span>
        </div>
      ) : null}
      {t > A.sentence1 - 0.2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", fontFamily: serifItalic, fontSize: 64, color: TH.ink, ...pop(t, A.sentence1 - 0.2, 0.7) }}>in one sentence.</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3 · never say the first number blind ----------
const NeverScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.never - 0.05;
  const inn = sp(t, t0, 14, 160);
  const blind = t > A.blind - 0.1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 2), transform: `scale(${0.94 + 0.06 * inn})` }}>
      <div style={{ position: "absolute", left: 70, top: 170, fontFamily: fonts.bold, fontSize: 96, lineHeight: 1.05, color: TH.ink }}>
        Never say the<br />first number<br />
        <span style={{ color: RED, display: "inline-block", ...(blind ? pop(t, A.blind - 0.1, 0.6) : { opacity: 0 }) }}>blind.</span>
      </div>
      {t > A.before - 0.1 ? (
        <div style={{ position: "absolute", left: 70, top: 600, ...pop(t, A.before - 0.1, 0.6) }}>
          <Chip text="Do this before the call" bg={GREEN} size={46} style={{ padding: "12px 30px" }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4-6 · steps 1-3: real claude.ai screens, scrolled in sync ----------
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
const Step1: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step1 - 0.1} src={shot("p1.png")} sw={800} keys={[[A.step1, 0], [A.paste, 0], [A.step2, 40]]} />
);
const Step2: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step2 - 0.1} src={shot("a1.png")} sw={740} keys={[[A.step2, 0], [A.pay2, 0], [A.now + 0.2, 430], [A.sources - 0.1, 470], [A.step3 - 0.1, 1130]]} />
);
const Step3: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step3 - 0.1} src={shot("a2.png")} sw={740} top={140} keys={[[A.step3, 0], [A.market, 0], [A.something - 0.1, 40]]} />
);

// ---------- 7 · the sentence, big ----------
const Sentence: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.something - 0.1;
  const inn = sp(t, t0, 14, 150);
  const hi = ramp(t, A.looking, A.looking + 0.5);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.semibold, fontSize: 34, color: GREEN }}>Say this instead:</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 120, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 30, padding: "36px 40px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)" }}>
        <div style={{ fontFamily: serifItalic, fontSize: 56, lineHeight: 1.18, color: TH.ink }}>
          “Based on what similar roles in Leeds are paying, I’m looking for{" "}
          <span style={{ fontFamily: fonts.bold, fontStyle: "normal", color: hi > 0 ? "#FFF" : TH.ink, background: `rgba(10,95,69,${hi})`, borderRadius: 12, padding: "0 10px" }}>£30,000 to £32,000</span>
          , depending on the overall package.”
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8 · the bottom number is the one they hear ----------
const BottomScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.make - 0.1;
  const inn = sp(t, t0, 14, 160);
  const mark = t > A.bottom - 0.1;
  const fade = ramp(t, A.hear - 0.1, A.hear + 0.4);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 48, color: TH.ink }}>Your range</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 260, height: 130, borderRadius: 26, background: TH.accentSoft, border: `3px solid ${GREEN}` }} />
      <div style={{ position: "absolute", left: 90, top: 260, height: 130, display: "flex", alignItems: "center", paddingLeft: 30, fontFamily: fonts.bold, fontSize: 66, color: GREEN, ...(mark ? pop(t, A.bottom - 0.1, 0.7) : {}) }}>
        <span style={{ background: mark ? GREEN : "transparent", color: mark ? "#FFF" : GREEN, borderRadius: 16, padding: "0 14px" }}>£30,000</span>
      </div>
      <div style={{ position: "absolute", right: 120, top: 260, height: 130, display: "flex", alignItems: "center", fontFamily: fonts.bold, fontSize: 66, color: GREEN, opacity: 1 - 0.75 * fade }}>£32,000</div>
      {mark ? (
        <div style={{ position: "absolute", left: 100, top: 430, ...pop(t, A.bottom, 0.6) }}>
          <div style={{ width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderBottom: `28px solid ${DARK}`, marginLeft: 80 }} />
          <span style={{ fontFamily: fonts.bold, fontSize: 48, color: "#FFF", background: DARK, borderRadius: 18, padding: "14px 28px", display: "inline-block" }}>The number they’ll hear</span>
        </div>
      ) : null}
      {t > A.hear - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: serifItalic, fontSize: 60, color: TH.ink, ...pop(t, A.hear - 0.1, 0.7) }}>Only say a bottom you’d accept.</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 9 · guide PDF scroll (Comment RANGE → end) ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`bxr-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>range-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>RANGE</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>8 exact sentences</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXRGMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxr-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.something - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.similar - 0.05, LossScene], [A.never - 0.05, NeverScene], [A.step1 - 0.1, Step1], [A.step2 - 0.1, Step2], [A.step3 - 0.1, Step3],
    [A.something - 0.1, Sentence], [A.make - 0.1, BottomScene], [A.comment - 0.1, GuideScroll],
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
