import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-leave ("Why are you leaving?"), 2026-10-31.
// Same build as BxDirectBrolls (split: panel top, Felix below), skiprate standard: frame 0 = finished hook.
// Interview + Calder Homes are invented. Claude screen = real claude.ai chat 5eff3445 rendered from its DOM; Felix speaks Claude's short answer verbatim.

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

import captionsJson from "../../runs/bx-leave/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  say: at("say"), nightmare: at("nightmare"), recruiter: at("recruiter"), stop: at("stop"),
  not: at("not"), true: at("true"), client: at("client"), hears: at("hears"), us: at("us"),
  open: at("open"), ugly: at("ugly"), two: at("two"), complaining: at("complaining"), newjob: at("new"),
  get: at("get"), calder: at("calder"), step: at("step"),
  same: at("same"), drama: at("drama"), their: at("their"), boss: at("boss"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXLV_FRAMES = Math.round(A.total * 25);

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
const shot = (f: string) => staticFile(`bxlv-claude/${f}`);

// strip source y at panel top (sw 800); rows: prompt ~120-575 (ugly reason ~250-350), first answer ~730-920, "Shorter" ~1230, short answer ~1335-1440
const KEYS: [number, number][] = [[A.open, 30], [A.ugly, 170], [A.two, 260], [A.get - 0.4, 300], [A.get + 0.2, 880], [A.step, 900]];

// ---------- 1 · Hook: the interview question + the answer that kills it (complete at frame 0) ----------
const Bubble: React.FC<{ who: string; text: React.ReactNode; right?: boolean; bg: string; fg: string; style?: React.CSSProperties }> = ({ who, text, right, bg, fg, style }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: right ? "flex-end" : "flex-start", ...style }}>
    <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, margin: "0 12px 6px" }}>{who}</span>
    <div style={{ maxWidth: 820, background: bg, color: fg, fontFamily: fonts.bold, fontSize: 42, lineHeight: 1.22, padding: "20px 28px", borderRadius: 30, borderBottomLeftRadius: right ? 30 : 8, borderBottomRightRadius: right ? 8 : 30, boxShadow: "0 14px 30px rgba(0,0,0,0.10)" }}>{text}</div>
  </div>
);
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const shake = t > A.nightmare && t < A.nightmare + 0.4 ? Math.sin(t * 60) * 5 : 0;
  const ul = ramp(t, 0.15, 0.9, Easing.inOut(Easing.quad));
  const rec = t > A.recruiter - 0.2;
  const stop = t > A.stop - 0.15;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 80, lineHeight: 1.04, color: TH.ink }}>"Why are you leaving?"<br /><span style={{ color: RED }}>Don't say this.</span></div>
      <Bubble who="Interviewer · Calder Homes" text="So, why are you leaving your current job?" bg="#FFF" fg={TH.ink} style={{ position: "absolute", left: 50, right: 50, top: 250 }} />
      <Bubble who="You" right text={<span>Honestly?{" "}<span style={{ backgroundImage: `linear-gradient(#FFFFFF55, #FFFFFF55)`, backgroundRepeat: "no-repeat", backgroundSize: `${ul * 100}% 38%`, backgroundPosition: "0 92%" }}>My manager's a nightmare.</span></span>} bg={RED} fg="#FFF" style={{ position: "absolute", left: 50, right: 50, top: 470, transform: `translateX(${shake}px)` }} />
      {rec ? (
        <div style={{ position: "absolute", left: 50, top: 690, ...pop(t, A.recruiter - 0.2, 0.7) }}>
          <Chip text="Recruiter's notes:" size={30} bg={DARK} fg={MINT} style={{ padding: "8px 22px" }} />
        </div>
      ) : null}
      {stop ? (
        <div style={{ position: "absolute", right: 50, top: 668, ...pop(t, A.stop - 0.15, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 60, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-3deg)" }}>That's where I stop</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · what the client hears ----------
const ClientHears: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.true - 0.7;
  const inn = sp(t, t0, 14, 160);
  const tr = t > A.true - 0.2;
  const cl = t > A.client - 0.2;
  const hr = t > A.hears + 0.25;
  const nx = t > A.us + 0.05;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, fontFamily: fonts.bold, fontSize: 64, lineHeight: 1.05, color: TH.ink }}>True or not.<br /><span style={{ color: GREEN }}>Here's what my client hears.</span></div>
      {tr ? <div style={{ position: "absolute", left: 50, top: 230, ...pop(t, A.true - 0.2, 0.7) }}><Chip text="✓ Probably true" size={32} bg="#EEF1F0" fg={TH.dim} style={{ padding: "8px 22px" }} /></div> : null}
      {cl ? (
        <div style={{ position: "absolute", left: 50, right: 50, top: 320, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 30, padding: "24px 30px", display: "flex", gap: 22, alignItems: "flex-start", boxShadow: "0 16px 38px rgba(0,0,0,0.08)", ...pop(t, A.client - 0.2, 0.85) }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#DCE7F7", color: "#2F5DA8", fontFamily: fonts.bold, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>CH</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink }}>Hiring manager · Calder Homes</div>
            <div style={{ marginTop: 10, fontFamily: fonts.bold, fontSize: 44, lineHeight: 1.2, color: hr ? RED : "#B9C2BE" }}>{hr ? "“One day, they'll say that about us.”" : "thinking…"}</div>
          </div>
        </div>
      ) : null}
      {nx ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", ...pop(t, A.us + 0.05, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 58, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-2deg)" }}>Next candidate →</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3 · real claude.ai chat
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
const Tag: React.FC<{ t: number; t0: number; text: string }> = ({ t, t0, text }) => (
  <div style={{ position: "absolute", left: 24, top: 24, ...pop(t, t0 + 0.05, 0.7) }}>
    <span style={{ fontFamily: fonts.bold, fontSize: 34, color: DARK, background: MINT, borderRadius: 14, padding: "8px 18px", display: "inline-block" }}>{text}</span>
  </div>
);
const Claude: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.open - 0.1;
  const asks: [number, string][] = [[A.ugly - 0.3, "Real reason · ugly version"], [A.two - 0.2, "2 honest sentences"], [A.complaining - 0.2, "No complaining"], [A.newjob - 0.3, "End on the new job"]];
  const showAsks = t < A.get - 0.4;
  return (
    <AbsoluteFill>
      <ScrollShot t={t} t0={t0} src={shot("strip.png")} sw={800} keys={KEYS} />
      <Tag t={t} t0={t0} text={t < A.get - 0.4 ? "The ugly version" : "Claude's answer"} />
      {showAsks ? (
        <div style={{ position: "absolute", left: 30, bottom: 34, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          {asks.map(([a, s]) => (t > a ? <div key={s} style={pop(t, a, 0.6)}><Chip text={s} size={36} bg={GREEN} style={{ padding: "8px 22px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }} /></div> : null))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4 · same truth, no drama: before / after ----------
const SameTruth: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.same - 0.35;
  const inn = sp(t, t0, 14, 160);
  const dr = t > A.drama - 0.2;
  const th = t > A.their - 0.2;
  const bo = t > A.boss - 0.2;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 76, color: TH.ink }}>Same truth. {dr ? <span style={{ color: GREEN }}>No drama.</span> : null}</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 180, background: "#FDE4E4", border: `3px solid ${RED}`, borderRadius: 26, padding: "18px 26px", opacity: dr ? 0.55 : 1 }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: RED }}>Before</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 38, color: TH.ink, textDecoration: dr ? "line-through" : undefined, textDecorationColor: RED, textDecorationThickness: 4 }}>"My manager's a nightmare."</div>
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 350, background: "#FFF", border: `3px solid ${GREEN}`, borderRadius: 26, padding: "18px 26px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)", ...pop(t, t0 + 0.2, 0.85) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: GREEN }}>After</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, lineHeight: 1.25, color: TH.ink }}>"I'm ready to run my own projects end to end… <span style={{ background: th ? TH.accentSoft : "transparent", borderRadius: 8 }}>This position at Calder Homes is exactly that next step.</span>"</div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 650, display: "flex", gap: 18 }}>
        {th ? <div style={pop(t, A.their - 0.2, 0.6)}><Chip text="Ends on: their job ✓" size={34} bg={GREEN} style={{ padding: "10px 24px" }} /></div> : null}
        {bo ? <div style={pop(t, A.boss - 0.2, 0.6)}><Chip text="Not: your old boss ✗" size={34} bg="#FDE4E4" fg={RED} style={{ padding: "10px 24px" }} /></div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5 · guide PDF scroll (Comment LEAVE → end) ---------- (Comment REPLY → end) ----------
const GUIDE_PAGES = 5;
const PAGES = Array.from({ length: GUIDE_PAGES }, (_, i) => staticFile(`bxlv-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>leave-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>LEAVE</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>prompt + the answers</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXLVMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxlv-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.open - 0.1 && t < A.same - 0.35;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.true - 0.7, ClientHears], [A.open - 0.1, Claude], [A.same - 0.35, SameTruth], [A.comment - 0.1, GuideScroll],
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
          <AbsoluteFill style={{ transform: `translate(${drift * Math.sin(t * 0.9) * 5}px, ${whip * 40 + drift * Math.sin(t * 1.3) * 3}px) scale(${1 + (dark ? 0 : drift * 0.006 * since)})`, filter: whip > 0.05 ? `blur(${whip * 6}px)` : undefined }}>
            <El t={t} />
          </AbsoluteFill>
          {!dark ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} /> : null}
        </div>
      </AbsoluteFill>
    </ClaudeLang.Provider>
  );
};
