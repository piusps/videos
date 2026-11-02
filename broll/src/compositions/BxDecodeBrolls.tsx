import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-decode ("Job ad decoder"), job-seeker series, 2026-10-25.
// Same build as BxHigherBrolls: split (panel top, Felix below). Hook / hidden-salary / phrase payoff in boilr style,
// steps 1-3 = real claude.ai answers (stitched strips, dark) with scroll and push-in only.
// Ad (Brightwell Group, Manchester) is invented. 58% = Adzuna Dec 2025 (41.97% of ads show pay). Salary range from Claude's cited sources.

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

import captionsJson from "../../runs/bx-decode/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const endOf = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.endMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  competitive: at("competitive"), doesnt: at("doesnt"), means1: at("means", 1), tell: at("tell"),
  more: at("more"), half: at("half"), hide: at("hide"), after: at("after"), three1: at("three", 1), interviews: at("interviews"),
  so: at("so"), decode1: at("decode", 1), before1: at("before", 1),
  step1: at("step", 1), paste: at("paste"),
  step2: at("step", 2), decode2: at("decode", 2), each: at("each"), red: at("red"), flags: at("flags"),
  step3: at("step", 3), actually: at("actually"), pay2: at("pay", 2), sources: at("sources"),
  fast: at("fastpaced"), under: at("understaffed"), wear: at("wear"), two: at("two"), one2: at("one", 2), salary3: at("salary", 3),
  then: at("then"), questions: at("questions"), salaryFirst: at("salary", 4),
  comment: at("comment"), total: Math.min(CAPS[CAPS.length - 1].endMs / 1000 + 0.25, 41.68),
};
export const BXDC_FRAMES = Math.round(A.total * 25);

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


const CB = "#191919"; // claude.ai dark page
const shot = (f: string) => staticFile(`bxd-claude/${f}`);

// ---------- 1 · Hook: "Competitive salary" = they don't want to tell you (0 → "More") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const strike = ramp(t, A.doesnt - 0.05, A.doesnt + 0.35);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, fontFamily: fonts.bold, fontSize: 68, lineHeight: 1.05, color: TH.ink }}>What the job ad<br /><span style={{ color: RED }}>really says</span></div>
      <Card x={60} y={260} w={960} h={330} style={{ padding: "30px 38px", transform: `rotate(-1.5deg) scale(${1 + 0.02 * Math.sin(t * 2)})` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 44, color: TH.ink }}>Marketing Executive</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim, marginTop: 4 }}>Manchester (hybrid)</div>
        <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: 60, color: TH.ink, marginTop: 34 }}>
          Competitive salary
          <div style={{ position: "absolute", left: -6, top: "52%", height: 8, width: `${strike * 104}%`, background: RED, borderRadius: 4 }} />
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, marginTop: 8 }}>+ benefits, DOE</div>
      </Card>
      {t > A.means1 - 0.1 ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 640, ...pop(t, A.means1 - 0.1, 0.5) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: GREEN }}>Translated:</div>
          <div style={{ fontFamily: serifItalic, fontSize: 70, lineHeight: 1.05, color: TH.ink, marginTop: 6 }}>“We don’t want<br />to tell you.”</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · 58% hide the salary, you find out after 3 interviews ----------
const HideScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.more - 0.05;
  const inn = sp(t, t0, 14, 160);
  const pct = Math.round(58 * ramp(t, A.half - 0.1, A.hide + 0.5));
  const late = t > A.after - 0.1;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 46, color: TH.ink, ...pop(t, t0 + 0.05) }}>UK job ads without a salary</div>
      <div style={{ position: "absolute", left: 40, top: 110, display: "flex", alignItems: "baseline", gap: 24, opacity: late ? 0.35 : 1, transform: `scale(${late ? 0.8 : 1})`, transformOrigin: "0 0" }}>
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 230, color: RED, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: 400, fontFamily: fonts.regular, fontSize: 24, color: TH.dim, opacity: late ? 0 : 1 }}>Adzuna UK, December 2025</div>
      {late ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: 380, display: "flex", alignItems: "center", gap: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ flex: 1, padding: "26px 0", textAlign: "center", background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", ...pop(t, A.three1 - 0.1 + i * 0.16, 0.6) }}>
              <div style={{ fontSize: 50 }}>🗓️</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 32, color: TH.ink, marginTop: 6 }}>Interview {i + 1}</div>
            </div>
          ))}
        </div>
      ) : null}
      {t > A.interviews + 0.2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...pop(t, A.interviews + 0.2, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 58, color: "#FFF", background: RED, borderRadius: 18, padding: "12px 28px", display: "inline-block", transform: "rotate(-3deg)" }}>…then the salary</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3 · decode the ad before you apply ----------
const DecodeScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.so - 0.05;
  const inn = sp(t, t0, 14, 160);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 2), transform: `scale(${0.94 + 0.06 * inn})` }}>
      <div style={{ position: "absolute", left: 80, top: 230, fontFamily: fonts.bold, fontSize: 150, color: GREEN, textShadow: `0 0 40px ${MINT}88`, ...pop(t, A.decode1 - 0.1, 0.6) }}>Decode it</div>
      <div style={{ position: "absolute", left: 90, top: 450, fontFamily: serifItalic, fontSize: 70, color: TH.ink, ...pop(t, A.before1 - 0.1, 0.7) }}>before you apply.</div>
    </AbsoluteFill>
  );
};

// ---------- 4-6 · steps 1-3: real claude.ai screens, scrolled in sync ----------
// keys: [time, source y at panel top]; sw = source width of the strip
const ScrollShot: React.FC<{ t: number; src: string; keys: [number, number][]; sw: number; t0: number }> = ({ t, src, keys, sw, t0 }) => {
  const s = W / sw;
  const y = interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rev = ramp(t, t0, t0 + 0.4, Easing.out(Easing.quad));
  const push = 1 + 0.03 * ramp(t, t0, keys[keys.length - 1][0] + 1.5, (x) => x);
  return (
    <AbsoluteFill style={{ background: CB, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${push})`, transformOrigin: "50% 30%", width: W, height: PH }}>
        <Img src={src} style={{ position: "absolute", left: 0, top: -y * s, width: sw * s }} />
      </div>
    </AbsoluteFill>
  );
};
const Step1: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step1 - 0.1} src={shot("p1.png")} sw={800} keys={[[A.step1, 0], [A.paste, 0], [A.step2, 40]]} />
);
const Step2: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step2 - 0.1} src={shot("a1.png")} sw={740} keys={[[A.step2, 0], [A.each, 0], [A.each + 0.8, 300], [A.red - 0.3, 560], [A.flags + 0.1, 1100], [A.step3 - 0.1, 1440]]} />
);
const Step3: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step3 - 0.1} src={shot("a2.png")} sw={740} keys={[[A.step3, 0], [A.actually, 0], [A.pay2 + 0.3, 170], [A.sources - 0.1, 330], [A.fast - 0.1, 560]]} />
);

// ---------- 7 · phrase payoff ----------
const PHR = [
  { k: "fast" as const, r: "under" as const, ad: "“Fast-paced”", real: "understaffed" },
  { k: "wear" as const, r: "two" as const, ad: "“Wear many hats”", real: "2 jobs, 1 salary" },
];
const PhraseScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.fast - 0.1;
  const inn = sp(t, t0, 14, 150);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>Ad says → often means</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, display: "flex", flexDirection: "column", gap: 34 }}>
        {PHR.map((p) => (
          <div key={p.k} style={{ padding: "26px 32px", background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 26, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", opacity: t > A[p.k] - 0.15 ? 1 : 0.25, ...(t > A[p.k] - 0.15 ? pop(t, A[p.k] - 0.15, 0.7) : {}) }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 52, color: TH.dim }}>{p.ad}</div>
            <div style={{ marginTop: 14, ...(t > A[p.r] - 0.15 ? pop(t, A[p.r] - 0.15, 0.5) : { opacity: 0 }) }}>
              <Chip text={`→ ${p.real}`} bg={RED} size={50} style={{ transform: "rotate(-2deg)" }} />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8 · three questions for the recruiter, salary first (real answer) ----------
const Questions: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.then - 0.1} src={shot("a2.png")} sw={740} keys={[[A.then, 760], [A.questions + 0.2, 885], [A.salaryFirst, 885], [A.comment, 930]]} />
);

// ---------- 9 · guide PDF scroll (Comment DECODE → end) ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`bxd-guide/guide-page-${i + 1}.png`));
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
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#0B1F18", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 2 }}>
          <div style={{ width: 30, height: 36, borderRadius: 6, background: "#C9473F", color: "#FFF", fontFamily: fonts.bold, fontSize: 11, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, boxSizing: "border-box" }}>PDF</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>decode-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>DECODE</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>20 phrases translated</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXDCMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxd-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = (t >= A.step1 - 0.1 && t < A.fast - 0.1) || (t >= A.then - 0.1 && t < A.comment - 0.1);
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.more - 0.05, HideScene], [A.so - 0.05, DecodeScene], [A.step1 - 0.1, Step1], [A.step2 - 0.1, Step2], [A.step3 - 0.1, Step3],
    [A.fast - 0.1, PhraseScene], [A.then - 0.1, Questions], [A.comment - 0.1, GuideScroll],
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
