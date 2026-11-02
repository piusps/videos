import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-ask ("Any questions for us?"), 2026-11-02.
// Same build as BxDirectBrolls (split: panel top, Felix below), skiprate standard: frame 0 = finished hook.
// Interview + Brightwell Software are invented. Claude screen = real claude.ai chat 18638e31 rendered from its DOM; Felix speaks Claude's short answer verbatim.

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

import captionsJson from "../../runs/bx-ask/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  say: at("say"), covered: at("covered"), recruiter: at("recruiter"), flat: at("flat"), curious: at("curious"),
  open: at("open"), learned: at("learned"), two: at("two"), doing: at("doing"), google: at("google"),
  get: at("get"), own: at("own"),
  just: at("just", 2), role: at("role"), react: at("react"), sentence: at("sentence"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXAK_FRAMES = Math.round(A.total * 25);

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
const shot = (f: string) => staticFile(`bxak-claude/${f}`);

// strip source y at panel top (sw 760); rows: prompt ~30-375 (round-one facts ~175-240), Q1 ~570-720, Q2 ~980-1110, "Make the first one shorter" ~1605, short answer ~1740-1795
const KEYS: [number, number][] = [[A.open, 0], [A.learned, 40], [A.two, 90], [A.get - 0.4, 110], [A.get + 0.2, 1440], [A.own, 1450]];

// ---------- 1 · Hook: the last question + the answer that kills it (complete at frame 0) ----------
const Bubble: React.FC<{ who: string; text: React.ReactNode; right?: boolean; bg: string; fg: string; style?: React.CSSProperties }> = ({ who, text, right, bg, fg, style }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: right ? "flex-end" : "flex-start", ...style }}>
    <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, margin: "0 12px 6px" }}>{who}</span>
    <div style={{ maxWidth: 820, background: bg, color: fg, fontFamily: fonts.bold, fontSize: 42, lineHeight: 1.22, padding: "20px 28px", borderRadius: 30, borderBottomLeftRadius: right ? 30 : 8, borderBottomRightRadius: right ? 8 : 30, boxShadow: "0 14px 30px rgba(0,0,0,0.10)" }}>{text}</div>
  </div>
);
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const shake = t > A.covered && t < A.covered + 0.4 ? Math.sin(t * 60) * 5 : 0;
  const ul = ramp(t, 0.15, 0.9, Easing.inOut(Easing.quad));
  const rec = t > A.recruiter - 0.2;
  const fl = t > A.flat - 0.15;
  const cu = t > A.curious - 0.2;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 76, lineHeight: 1.04, color: TH.ink }}>"Any questions for us?"<br /><span style={{ color: RED }}>Don't say this.</span></div>
      <Bubble who="Final interview · Brightwell Software" text="Do you have any questions for us?" bg="#FFF" fg={TH.ink} style={{ position: "absolute", left: 50, right: 50, top: 245 }} />
      <Bubble who="You" right text={<span style={{ backgroundImage: `linear-gradient(#FFFFFF55, #FFFFFF55)`, backgroundRepeat: "no-repeat", backgroundSize: `${ul * 100}% 38%`, backgroundPosition: "0 92%" }}>No, I think you've covered everything.</span>} bg={RED} fg="#FFF" style={{ position: "absolute", left: 50, right: 50, top: 455, transform: `translateX(${shake}px)` }} />
      {rec ? (
        <div style={{ position: "absolute", left: 50, top: 700, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", ...pop(t, A.recruiter - 0.2, 0.7) }}>
          <Chip text="Recruiter's notes:" size={30} bg={DARK} fg={MINT} style={{ padding: "8px 22px" }} />
          {cu ? <div style={pop(t, A.curious - 0.2, 0.7)}><Chip text="✗ Not curious" size={30} bg="#FDE4E4" fg={RED} style={{ padding: "8px 22px" }} /></div> : null}
        </div>
      ) : null}
      {fl ? (
        <div style={{ position: "absolute", right: 46, top: 708, ...pop(t, A.flat - 0.15, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 56, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 28px", display: "inline-block", transform: "rotate(-3deg)" }}>Interview: flat</span>
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
  const asks: [number, string][] = [[A.learned - 0.3, "What you learned in round 1"], [A.two - 0.2, "2 questions"], [A.doing - 0.3, "Already doing the job"], [A.google - 0.3, "Nothing you could google"]];
  const showAsks = t < A.get - 0.4;
  return (
    <AbsoluteFill>
      <ScrollShot t={t} t0={t0} src={shot("strip.png")} sw={760} keys={KEYS} />
      <Tag t={t} t0={t0} text={t < A.get - 0.4 ? "Round-one notes" : "Claude's answer"} />
      {showAsks ? (
        <div style={{ position: "absolute", left: 30, bottom: 34, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          {asks.map(([a, s]) => (t > a ? <div key={s} style={pop(t, a, 0.6)}><Chip text={s} size={36} bg={GREEN} style={{ padding: "8px 22px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }} /></div> : null))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4 · you, already in the role + react in one sentence ----------
const InRole: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.just - 0.4;
  const inn = sp(t, t0, 14, 160);
  const ro = t > A.role - 0.3;
  const re = t > A.react - 0.2;
  const se = t > A.sentence - 0.3;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 70, lineHeight: 1.05, color: TH.ink }}>Not just a question.{ro ? <><br /><span style={{ color: GREEN }}>You, already in the role.</span></> : null}</div>
      <div style={{ position: "absolute", left: 50, right: 50, top: ro ? 250 : 180, background: "#FFF", border: `3px solid ${GREEN}`, borderRadius: 26, padding: "18px 26px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)", opacity: re ? 0.45 : 1, ...pop(t, t0 + 0.15, 0.85) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: GREEN }}>You ask</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 36, lineHeight: 1.25, color: TH.ink }}>"…how do you spot at-risk accounts early, and <span style={{ background: ro ? TH.accentSoft : "transparent", borderRadius: 8 }}>what part of that would I own?</span>"</div>
      </div>
      {re ? (
        <div style={{ position: "absolute", left: 50, right: 50, top: 520, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start", ...pop(t, A.react - 0.2, 0.8) }}>
          <Chip text="Then: react in one sentence" size={34} bg={DARK} fg={MINT} style={{ padding: "10px 24px" }} />
          {se ? <div style={{ ...pop(t, A.sentence - 0.3, 0.8), background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 24, padding: "14px 22px", fontFamily: fonts.bold, fontSize: 32, lineHeight: 1.25, color: TH.ink }}>"That makes sense. In that case, I'd want to get to know the accounts that renew in the first quarter early on."</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 5 · guide PDF scroll (Comment QUESTIONS → end) ----------
const GUIDE_PAGES = 5;
const PAGES = Array.from({ length: GUIDE_PAGES }, (_, i) => staticFile(`bxak-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>questions-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>QUESTIONS</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>prompt + the questions</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXAKMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxak-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.open - 0.1 && t < A.just - 0.4;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.open - 0.1, Claude], [A.just - 0.4, InRole], [A.comment - 0.1, GuideScroll],
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
