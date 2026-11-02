import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-interview ("Tell me about yourself"), story format, 2026-10-27.
// Built like BxDecodeBrolls (split: panel top, Felix below), but under the skiprate standard:
// frame 0 already shows the finished hook (headline + phone call with the question), no entrance animation on it.
// Job ad (Ledgerly, Bristol) and CV (Jamie Clarke, Brightline Broadband) are invented. Claude screens = real claude.ai chat c6a71953 rendered from its DOM.

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

import captionsJson from "../../runs/bx-interview/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  school: at("school"), uni: at("uni"), job1: at("job", 1), twenty: at("twenty"), listening: at("listening"), offer: at("offer"), point: at("point"),
  sixty: at("60"), build: at("build"),
  step1: at("step", 1), paste: at("paste"),
  step2: at("step", 2), proves: at("proves"),
  step3: at("step", 3), talking: at("talking"),
  something: at("something"), rewrote: at("rewrote"), down: at("down"),
  loud: at("loud"), timer: at("timer"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXI_FRAMES = Math.round(A.total * 25);

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
const shot = (f: string) => staticFile(`bxi-claude/${f}`);

// ---------- 1 · Hook: the interview (complete at frame 0) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const secs = Math.min(59, 12 + Math.floor(t));
  const lost = t > A.listening - 0.15;
  const life = [["School", A.school], ["Uni", A.uni], ["First job", A.job1]] as const;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 76, lineHeight: 1.04, color: TH.ink }}>20 seconds.<br /><span style={{ color: RED }}>Then I stop listening.</span></div>
      <div style={{ position: "absolute", left: 50, top: 236, width: 980, height: 300, borderRadius: 34, background: DARK, boxShadow: "0 24px 50px rgba(0,0,0,0.22)", padding: "28px 34px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 74, height: 74, borderRadius: "50%", background: "#2B4A3E", color: "#FFF", fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>R</div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: "#FFF" }}>Interview</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: MINT }}>Customer Success Manager</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: secs >= 20 ? RED : "#FFF", fontVariantNumeric: "tabular-nums" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: RED, opacity: 0.5 + 0.5 * Math.sin(t * 6) }} />
            00:{String(secs).padStart(2, "0")}
          </div>
        </div>
        <div style={{ marginTop: 30, display: "inline-block", maxWidth: 860, background: "#FFF", borderRadius: "30px 30px 30px 8px", padding: "22px 30px", fontFamily: fonts.bold, fontSize: 54, lineHeight: 1.12, color: TH.ink }}>
          “So, tell me about yourself.”
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 580, display: "flex", alignItems: "center", gap: 14, justifyContent: "flex-end" }}>
        {t > A.school - 0.1 ? <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim }}>You:</span> : null}
        {life.map(([l, a], i) => t > a - 0.1 ? (
          <React.Fragment key={l}>
            {i > 0 ? <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.dim, ...pop(t, a - 0.1) }}>→</span> : null}
            <span style={{ fontFamily: fonts.bold, fontSize: 46, color: "#FFF", background: GREEN, borderRadius: "26px 26px 8px 26px", padding: "10px 26px", display: "inline-block", opacity: lost ? 0.35 : 1, ...pop(t, a - 0.1, 0.5) }}>{l}</span>
          </React.Fragment>
        ) : null)}
      </div>
      {lost ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", ...pop(t, A.listening - 0.15, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 64, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-3deg)" }}>{t > A.offer - 0.1 ? "Offer → next candidate" : "Not listening"}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · 60 seconds, three parts ----------
const PARTS = [["Now", "what you do"], ["Proof", "one result"], ["Why this job", "the link"]] as const;
const PartsScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.sixty - 0.05;
  const inn = sp(t, t0, 14, 160);
  const fill = ramp(t, t0 + 0.6, A.build + 0.2, (x) => x);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 84, color: TH.ink, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ color: GREEN }}>0:{String(Math.round(60 * fill)).padStart(2, "0")}</span> <span style={{ fontSize: 56 }}>/ 60 seconds</span>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 200, display: "flex", gap: 16 }}>
        {PARTS.map(([k, v], i) => {
          const a = t0 + 0.35 + i * 0.3;
          const f = Math.max(0, Math.min(1, fill * 3 - i));
          return (
            <div key={k} style={{ flex: 1, height: 380, borderRadius: 28, background: "#FFF", border: `3px solid ${TH.line}`, position: "relative", overflow: "hidden", ...pop(t, a, 0.7) }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${f * 100}%`, background: TH.accentSoft }} />
              <div style={{ position: "absolute", left: 24, top: 22, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: GREEN }}>{i + 1} · 20s</div>
              <div style={{ position: "absolute", left: 24, right: 18, top: 150, fontFamily: fonts.bold, fontSize: 52, lineHeight: 1.02, color: TH.ink }}>{k}</div>
              <div style={{ position: "absolute", left: 24, top: 290, fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>{v}</div>
            </div>
          );
        })}
      </div>
      {t > A.build - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...pop(t, A.build - 0.1, 0.6) }}>
          <Chip text="Build it before the interview" bg={GREEN} size={46} style={{ padding: "12px 30px" }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3-5 · steps 1-3: real claude.ai screens (strip.png, 705 px wide), scrolled in sync ----------
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
  <ScrollShot t={t} t0={A.step1 - 0.1} src={shot("strip.png")} sw={705} keys={[[A.step1, 90], [A.paste, 90], [A.step2 - 0.1, 130]]} />
);
const Step2: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step2 - 0.1} src={shot("strip.png")} sw={705} keys={[[A.step2, 520], [A.proves, 600], [A.step3 - 0.1, 900]]} />
);
const Step3: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step3 - 0.1} src={shot("strip.png")} sw={705} keys={[[A.step3, 1700], [A.talking, 1700], [A.something - 0.1, 1900]]} />
);

// ---------- 6 · the answer, big ----------
const Sentence: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.something - 0.1;
  const inn = sp(t, t0, 14, 150);
  const hi1 = ramp(t, A.rewrote - 0.1, A.rewrote + 0.4);
  const hi2 = ramp(t, A.down - 0.1, A.down + 0.4);
  const mark = (on: number): React.CSSProperties => ({ fontFamily: fonts.bold, fontStyle: "normal", color: on > 0.5 ? "#FFF" : TH.ink, background: `rgba(10,95,69,${on})`, borderRadius: 12, padding: "0 10px" });
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.semibold, fontSize: 34, color: GREEN }}>Your 60 seconds start like this:</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 120, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 30, padding: "36px 40px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)" }}>
        <div style={{ fontFamily: serifItalic, fontSize: 56, lineHeight: 1.2, color: TH.ink }}>
          “Right now I lead the support team at a broadband company. <span style={mark(hi1)}>I rewrote our welcome emails</span>, and complaints went <span style={mark(hi2)}>down by 30%</span>.”
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 700, display: "flex", gap: 14 }}>
        <Chip text="1 · Now" size={34} />
        <Chip text="2 · Proof" size={34} style={{ opacity: hi1 > 0 ? 1 : 0.3 }} />
        <Chip text="3 · Why this job" size={34} bg={TH.accentSoft} fg={GREEN} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7 · say it out loud, with a timer ----------
const TimerScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.loud - 0.6;
  const inn = sp(t, t0, 14, 160);
  const run = ramp(t, A.loud - 0.3, A.comment - 0.1, (x) => x);
  const s = Math.round(run * 58);
  const R0 = 190, C = 2 * Math.PI * R0;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 60, color: TH.ink }}>Say it out loud.</div>
      <div style={{ position: "absolute", left: 40, top: 120, ...pop(t, A.loud, 0.6) }}><Chip text="3 times, with a timer" bg={DARK} fg={MINT} size={36} /></div>
      <svg width={460} height={460} style={{ position: "absolute", left: 310, top: 250 }}>
        <circle cx={230} cy={230} r={R0} fill="#FFF" stroke={TH.line} strokeWidth={26} />
        <circle cx={230} cy={230} r={R0} fill="none" stroke={GREEN} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${C * run} ${C}`} transform="rotate(-90 230 230)" />
      </svg>
      <div style={{ position: "absolute", left: 310, top: 250, width: 460, height: 460, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 800, fontSize: 110, color: TH.ink, fontVariantNumeric: "tabular-nums" }}>0:{String(s).padStart(2, "0")}</div>
    </AbsoluteFill>
  );
};

// ---------- 8 · guide PDF scroll (Comment INTERVIEW → end) ----------
const GUIDE_PAGES = 5;
const PAGES = Array.from({ length: GUIDE_PAGES }, (_, i) => staticFile(`bxi-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>interview-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>INTERVIEW</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>3-part structure</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXIMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxi-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.something - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.sixty - 0.05, PartsScene], [A.step1 - 0.1, Step1], [A.step2 - 0.1, Step2], [A.step3 - 0.1, Step3],
    [A.something - 0.1, Sentence], [A.loud - 0.6, TimerScene], [A.comment - 0.1, GuideScroll],
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
