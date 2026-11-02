import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-higher ("Apply higher"), job-seeker series, 2026-10-23.
// Same build as BxFollowupBrolls: split (panel top, Felix below). Hook / same-pile / payoff in boilr style,
// steps 1-3 = real claude.ai answers (klickpfad/claude-ablauf.md, stitched strips) with scroll and push-in only.
// CV (Jamie Clarke, Northline Energy) is invented. Salaries: Payscale / Claude's cited sources.

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

import captionsJson from "../../runs/bx-higher/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const endOf = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.endMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  wrong: at("wrong"), cost: at("cost"), k10: at("10000"), most: at("most"),
  same1: at("same", 1), same2: at("same", 2), same3: at("same", 3),
  but: at("but"), better: at("better"), never: at("never"),
  step1: at("step", 1), titles: at("titles"), pay: at("pay", 2), sources: at("sources"),
  step2: at("step", 2), pick: at("pick"), missing: at("missing"), really: at("really"),
  step3: at("step", 3), rewrite: at("rewrite"), proof: at("proof"),
  customer1: at("customer", 1), success: at("success"),
  youre1: at("youre", 1), more: at("more"), higher: at("higher", 1),
  comment: at("comment"), total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXH_FRAMES = Math.round(A.total * 25);

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


const CB = "#151515"; // claude.ai dark page
const shot = (f: string) => staticFile(`bxh-claude/${f}`);
const SW = 780; // strip width (source px)

// ---------- 1 · Hook: wrong job title costs £10k (0 → "Most") ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.round(10000 * ramp(t, A.k10 - 0.1, A.k10 + 0.9, Easing.out(Easing.cubic)) / 100) * 100;
  const strike = ramp(t, A.wrong - 0.05, A.wrong + 0.35);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, fontFamily: fonts.bold, fontSize: 54, lineHeight: 1.12, color: TH.ink, ...pop(t, 0.05, 0.8) }}>Wrong job title<br /><span style={{ color: RED }}>on every application?</span></div>
      <Card x={60} y={230} w={960} h={300} style={{ padding: "30px 38px", transform: `rotate(-1.5deg) scale(${1 + 0.02 * Math.sin(t * 2)})` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>Searching for</div>
        <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.bold, fontSize: 56, color: TH.ink, marginTop: 8 }}>
          Customer Service Advisor
          <div style={{ position: "absolute", left: -6, top: "52%", height: 8, width: `${strike * 104}%`, background: RED, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          <Chip text="Same title" bg="#E1E7E3" fg={TH.ink} />
          <Chip text="Same pay" bg="#E1E7E3" fg={TH.ink} />
        </div>
      </Card>
      {t > A.cost - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", ...pop(t, A.cost - 0.1, 0.5) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, color: RED, fontVariantNumeric: "tabular-nums" }}>−£{k.toLocaleString("en-GB")}</span>
          <div style={{ fontFamily: serifItalic, fontSize: 52, color: TH.ink, marginTop: -6, ...pop(t, A.k10 + 1.1, 0.7) }}>a year</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · same title, same pay, same pile ----------
const SAME = [
  { k: "same1" as const, txt: "Same title", icon: "🏷️" },
  { k: "same2" as const, txt: "Same pay", icon: "💷" },
  { k: "same3" as const, txt: "Same pile", icon: "📚" },
];
const PileScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.most - 0.05;
  const inn = sp(t, t0, 14, 160);
  const n = Math.floor(40 + 260 * ramp(t, A.same3 - 0.1, A.same3 + 0.6));
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 46, color: TH.ink, ...pop(t, t0 + 0.05) }}>What most people apply for</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, display: "flex", flexDirection: "column", gap: 22 }}>
        {SAME.map((r) => (
          <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", opacity: t > A[r.k] - 0.12 ? 1 : 0.25, ...(t > A[r.k] - 0.12 ? pop(t, A[r.k] - 0.12, 0.7) : {}) }}>
            <div style={{ width: 92, height: 92, borderRadius: 22, background: TH.accentSoft, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.icon}</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 48, color: TH.ink }}>{r.txt}</div>
            {r.k === "same3" && t > A.same3 - 0.1 ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 38, color: RED, fontVariantNumeric: "tabular-nums" }}>{n} applicants</span> : null}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3 · your skills fit a better job you never searched for ----------
const BetterScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.but - 0.05;
  const inn = sp(t, t0, 14, 160);
  const lift = sp(t, A.better - 0.1, 12, 150);
  const SK = ["Complaint resolution", "Onboarding & training", "Salesforce", "Weekly reporting"];
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 2), transform: `scale(${0.94 + 0.06 * inn})` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>Your skills</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 120, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {SK.map((s, i) => <Chip key={s} text={s} bg={TH.accentSoft} fg={GREEN} size={30} style={pop(t, t0 + 0.1 + i * 0.12, 0.5)} />)}
      </div>
      <Card x={60} y={330} w={960} h={150} style={{ padding: "22px 32px", display: "flex", alignItems: "center", opacity: 1 - 0.5 * lift }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 42, color: TH.dim }}>Customer Service Advisor</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 40, color: TH.dim }}>~£21k</div>
      </Card>
      <Card x={60} y={520 - 30 * lift} w={960} h={170} style={{ padding: "22px 32px", display: "flex", alignItems: "center", border: `4px solid ${GREEN}`, boxShadow: `0 0 40px ${MINT}88`, ...pop(t, A.better - 0.1, 0.6) }}>
        <div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREEN }}>Better fit</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>Customer Success</div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 48, color: GREEN }}>~£35k</div>
      </Card>
      <div style={{ position: "absolute", right: 60, top: 740, fontFamily: serifItalic, fontSize: 54, color: GREEN, ...pop(t, A.never, 0.7) }}>never searched for.</div>
    </AbsoluteFill>
  );
};

// ---------- 4-6 · steps 1-3: real claude.ai answers, scrolled in sync ----------
// keys: [time, source y at panel top]
const ScrollShot: React.FC<{ t: number; src: string; keys: [number, number][]; s?: number; t0: number }> = ({ t, src, keys, s = W / SW, t0 }) => {
  const ts = keys.map((k) => k[0]);
  const ys = keys.map((k) => k[1]);
  const y = interpolate(t, ts, ys, { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rev = ramp(t, t0, t0 + 0.4, Easing.out(Easing.quad));
  const push = 1 + 0.03 * ramp(t, t0, keys[keys.length - 1][0] + 1.5, (x) => x);
  return (
    <AbsoluteFill style={{ background: CB, clipPath: `inset(0 0 ${(1 - rev) * 100}% 0)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${push})`, transformOrigin: "50% 30%", width: W, height: PH }}>
        <Img src={src} style={{ position: "absolute", left: 0, top: -y * s, width: SW * s }} />
      </div>
    </AbsoluteFill>
  );
};
const Step1: React.FC<{ t: number }> = ({ t }) => (
  <ScrollShot t={t} t0={A.step1 - 0.1} src={shot("a1.png")} keys={[[A.step1, 0], [A.titles, 0], [A.titles + 1.4, 170], [A.pay - 0.2, 560], [A.pay + 0.5, 1160], [A.sources - 0.1, 1400], [A.sources + 0.6, 1950]]} />
);
const Step2: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.pick - 0.05) return <ScrollShot t={t} t0={A.step2 - 0.1} src={shot("p2.png")} keys={[[A.step2, 0], [A.pick, 120]]} />;
  return <ScrollShot t={t} t0={A.pick - 0.05} src={shot("a2.png")} keys={[[A.pick, 0], [A.pick + 1.6, 120], [A.missing - 0.25, 820], [A.missing + 0.4, 1390], [A.really - 0.3, 1550], [A.really + 0.4, 1950]]} />;
};
const Step3: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.rewrite + 0.4) return <ScrollShot t={t} t0={A.step3 - 0.1} src={shot("p3.png")} keys={[[A.step3, 0], [A.rewrite + 0.4, 60]]} />;
  return <ScrollShot t={t} t0={A.rewrite + 0.4} src={shot("a3.png")} keys={[[A.rewrite + 0.4, 0], [A.proof - 0.3, 110], [A.proof + 0.4, 450]]} />;
};

// ---------- 7 · payoff: customer service advisor? ask about customer success ----------
const PayScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.customer1 - 0.1;
  const inn = sp(t, t0, 14, 150);
  const grow = ramp(t, A.success - 0.1, A.success + 0.7, Easing.out(Easing.cubic));
  const bar = (v: number, max: number) => `${(v / max) * 100}%`;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>Same skills. Different title.</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 170 }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: TH.dim }}>Customer service advisor</div>
        <div style={{ height: 90, marginTop: 10, background: "#E1E7E3", borderRadius: 18 }}>
          <div style={{ width: bar(21, 36), height: "100%", background: "#9AA5A0", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 20, boxSizing: "border-box", fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#FFF" }}>£21k</div>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: GREEN, marginTop: 46, opacity: t > A.success - 0.15 ? 1 : 0.3 }}>Customer success</div>
        <div style={{ height: 90, marginTop: 10, background: "#E1E7E3", borderRadius: 18 }}>
          <div style={{ width: bar(21 + 14 * grow, 36), height: "100%", background: GREEN, borderRadius: 18, boxShadow: `0 0 34px ${MINT}88`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 20, boxSizing: "border-box", fontFamily: MONO, fontWeight: 800, fontSize: 40, color: "#FFF" }}>£{Math.round(21 + 14 * grow)}k</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 640, ...pop(t, A.success + 0.6, 0.5) }}><Chip text="+£14k" bg={MINT} fg="#0B1F18" size={56} style={{ transform: "rotate(-4deg)" }} /></div>
      <div style={{ position: "absolute", left: 60, top: 820, fontFamily: fonts.regular, fontSize: 24, color: TH.dim }}>Payscale UK averages · Manchester CSM</div>
    </AbsoluteFill>
  );
};

// ---------- 8 · not more, higher ----------
const HigherScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.youre1 - 0.1;
  const inn = sp(t, t0, 14, 160);
  const up = sp(t, A.higher - 0.15, 11, 140);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 80, top: 170, fontFamily: fonts.bold, fontSize: 90, color: TH.dim, ...pop(t, t0, 0.7) }}>
        <span style={{ position: "relative" }}>Apply more<div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 10, background: RED, borderRadius: 5, transform: `scaleX(${ramp(t, A.more - 0.05, A.more + 0.3)})`, transformOrigin: "0 50%" }} /></span>
      </div>
      <div style={{ position: "absolute", left: 80, top: 560 - 180 * up, fontFamily: fonts.bold, fontSize: 130, color: GREEN, opacity: Math.min(1, up * 2), textShadow: `0 0 40px ${MINT}88` }}>Apply higher ↑</div>
    </AbsoluteFill>
  );
};

// ---------- 9 · guide PDF scroll (Comment HIGHER → end) ----------
const PAGES = Array.from({ length: 5 }, (_, i) => staticFile(`bxh-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>higher-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>HIGHER</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>all 4 prompts</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXHMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxh2-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.customer1 - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.most - 0.05, PileScene], [A.but - 0.05, BetterScene], [A.step1 - 0.1, Step1], [A.step2 - 0.1, Step2], [A.step3 - 0.1, Step3],
    [A.customer1 - 0.1, PayScene], [A.youre1 - 0.1, HigherScene], [A.comment - 0.1, GuideScroll],
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
