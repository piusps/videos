import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-gap ("Gap on your CV"), 2026-10-30.
// Same build as BxDirectBrolls (split: panel top, Felix below), skiprate standard: frame 0 = finished hook.
// CV (Sam Taylor, Harbourline Travel) is invented. Claude screen = real claude.ai chat 66ab4708 rendered from its DOM.

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

import captionsJson from "../../runs/bx-gap/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  gap: at("gap"), months: at("months"), fudge: at("fudge"), dates: at("dates"),
  recruiter: at("recruiter"), worry: at("worry"), fudged: at("fudged"), reference: at("reference"), out: at("out"),
  name: at("name"), line: at("line"), sentence: at("sentence"),
  open: at("open"), happened: at("happened"), ask: at("ask"), line2: at("line", 2), answer: at("answer"), calm: at("calm"), apology: at("apology"),
  get: at("get"), march: at("march"), course: at("course"), job: at("job"),
  stop: at("stop"), explain: at("explain"), minutes: at("minutes"), dig: at("dig"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXGP_FRAMES = Math.round(A.total * 25);

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
const shot = (f: string) => staticFile(`bxgp-claude/${f}`);

// strip source y (px) at panel top; strip rows: prompt ~120-510, CV line ~640-760, interview answer ~900-1090, follow-up ~1390, short answer ~1550-1670
const KEYS: [number, number][] = [[A.open, 40], [A.happened, 120], [A.calm, 330], [A.get - 0.3, 560], [A.march, 760], [A.course + 0.3, 1000]];

// ---------- 1 · Hook: the CV with the gap (complete at frame 0), dates get fudged on "fudge" ----------
const Row: React.FC<{ role: string; firm: string; dates: React.ReactNode; dim?: boolean }> = ({ role, firm, dates, dim }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: dim ? 0.55 : 1 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: GREEN, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 36, color: TH.ink, lineHeight: 1.1 }}>{role}</div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: TH.dim }}>{firm}</div>
    </div>
    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: TH.ink, whiteSpace: "nowrap" }}>{dates}</div>
  </div>
);
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const f = A.fudge - 0.05;
  const typed = ramp(t, f + 0.15, f + 0.75, (x) => x);
  const fudged = t > f;
  const gapH = interpolate(ramp(t, f + 0.2, f + 0.8, Easing.inOut(Easing.cubic)), [0, 1], [150, 0]);
  const newTxt = "Dec 2025".slice(0, Math.round(typed * 8));
  const cx = interpolate(ramp(t, 0.1, f, Easing.inOut(Easing.cubic)), [0, 1], [760, 900]);
  const cy = interpolate(ramp(t, 0.1, f, Easing.inOut(Easing.cubic)), [0, 1], [700, 548]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 80, lineHeight: 1.04, color: TH.ink }}>Gap on your CV?<br /><span style={{ color: RED }}>Don't fudge the dates.</span></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 250, borderRadius: 30, background: "#FFF", border: `3px solid ${TH.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.12)", padding: "24px 32px 28px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink }}>Sam Taylor · CV</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim }}>Experience</span>
        </div>
        <Row role="Admin Assistant (temp)" firm="Brightwell Staffing" dates="Jan 2026 – now" />
        <div style={{ height: gapH + 24, position: "relative", overflow: "hidden" }}>
          {gapH > 4 ? (
            <div style={{ position: "absolute", left: 6, right: 0, top: 12, height: gapH, borderLeft: `4px dashed ${RED}`, display: "flex", alignItems: "center", paddingLeft: 26, opacity: Math.max(0, Math.min(1, (gapH - 70) / 50)) }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 40, color: RED, background: "#FDE4E4", borderRadius: 14, padding: "4px 18px" }}>9 months · nothing</span>
            </div>
          ) : null}
        </div>
        <Row role="Marketing Assistant" firm="Harbourline Travel" dates={
          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            {fudged ? <span style={{ fontSize: 22, textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: 3, color: TH.dim }}>Mar 2025</span> : null}
            <span>Jun 2022 – {fudged ? <span style={{ color: RED, background: "#FDE4E4", borderRadius: 8, padding: "0 6px" }}>{newTxt || "\u00a0"}</span> : "Mar 2025"}</span>
          </span>
        } />
      </div>
      {fudged ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", ...pop(t, A.fudge + 0.45, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 58, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-3deg)" }}>Gap gone. Problem made.</span>
        </div>
      ) : null}
      <svg width={46} height={56} viewBox="0 0 24 30" style={{ position: "absolute", left: cx, top: cy, transform: `scale(${t > f && t < f + 0.15 ? 0.85 : 1})`, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" }}>
        <path d="M2 2 L2 24 L8 18.5 L12 27 L15.5 25.5 L11.6 17 L19.5 17 Z" fill="#111" stroke="#FFF" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 2 · the recruiter's view: gap fine, fudged dates not; reference check ----------
const RefCheck: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.recruiter - 0.2;
  const inn = sp(t, t0, 14, 160);
  const ok = t > A.worry - 0.2;
  const bad = t > A.fudged - 0.1;
  const ref = t > A.reference - 0.15;
  const out = t > A.out - 0.35;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, fontFamily: fonts.bold, fontSize: 64, lineHeight: 1.05, color: TH.ink }}>What I <span style={{ color: GREEN }}>actually check.</span></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 150, display: "flex", gap: 20 }}>
        <div style={{ flex: 1, opacity: ok ? 1 : 0.25, ...(ok ? pop(t, A.worry - 0.2, 0.8) : {}) }}>
          <Chip text="Gap ✓ fine" size={38} bg={TH.accentSoft} fg={GREEN} style={{ width: "100%", textAlign: "center", boxSizing: "border-box", border: `3px solid ${GREEN}`, padding: "12px 0" }} />
        </div>
        <div style={{ flex: 1, opacity: bad ? 1 : 0.25, ...(bad ? pop(t, A.fudged - 0.1, 0.8) : {}) }}>
          <Chip text="Fudged dates ✗" size={38} bg="#FDE4E4" fg={RED} style={{ width: "100%", textAlign: "center", boxSizing: "border-box", border: `3px solid ${RED}`, padding: "12px 0" }} />
        </div>
      </div>
      {ref ? (
        <div style={{ position: "absolute", left: 50, right: 50, top: 290, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 28, padding: "22px 28px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)", ...pop(t, A.reference - 0.15, 0.85) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim, marginBottom: 12 }}>Reference check · Harbourline Travel HR</div>
          {[["CV says", "Jun 2022 – Dec 2025", false], ["HR confirms", "Jun 2022 – Mar 2025", true]].map(([k, v, h], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderTop: i ? `2px solid ${TH.line}` : undefined, opacity: i === 1 ? Math.min(1, sp(t, A.reference + 0.35) * 2) : 1 }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, width: 210 }}>{k as string}</span>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: h ? RED : TH.ink }}>{v as string}</span>
              {h ? <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: RED, borderRadius: 999, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>✗</span> : null}
            </div>
          ))}
        </div>
      ) : null}
      {out ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...pop(t, A.out - 0.35, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 66, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 34px", display: "inline-block", transform: "rotate(-3deg)" }}>You're out</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3 · name it: one CV line, one interview sentence ----------
const NameIt: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.name - 0.35;
  const inn = sp(t, t0, 14, 160);
  const card = (a: number, icon: string, title: string, sub: string, top: number) => (t > a ? (
    <div style={{ position: "absolute", left: 50, right: 50, top, background: "#FFF", border: `3px solid ${GREEN}`, borderRadius: 28, padding: "24px 30px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 16px 38px rgba(0,0,0,0.08)", ...pop(t, a, 0.7) }}>
      <span style={{ fontSize: 64 }}>{icon}</span>
      <div><div style={{ fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>{title}</div><div style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>{sub}</div></div>
    </div>
  ) : null);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 88, color: TH.ink }}>So <span style={{ color: GREEN }}>name it.</span></div>
      {card(A.line - 0.3, "📄", "1 line on your CV", "dated, like a job", 220)}
      {card(A.sentence - 0.3, "🎤", "1 sentence in the interview", "ten seconds, then stop", 440)}
    </AbsoluteFill>
  );
};

// ---------- 4 · real claude.ai chat (strip.png, 825 px wide), scrolled in sync ----------
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
  const asks: [number, string][] = [[A.line2 - 0.3, "1 · One CV line"], [A.answer - 0.5, "2 · Ten-second answer"], [A.calm - 0.1, "Calm · no apology"]];
  const showAsks = t > A.ask - 0.2 && t < A.get - 0.2;
  return (
    <AbsoluteFill>
      <ScrollShot t={t} t0={t0} src={shot("strip.png")} sw={825} keys={KEYS} />
      <Tag t={t} t0={t0} text={t < A.get - 0.3 ? "Say what really happened" : "Claude's lines"} />
      {showAsks ? (
        <div style={{ position: "absolute", left: 30, bottom: 34, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          {asks.map(([a, s]) => (t > a ? <div key={s} style={pop(t, a, 0.6)}><Chip text={s} size={36} bg={GREEN} style={{ padding: "8px 22px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }} /></div> : null))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 5 · then stop: 10 seconds vs two minutes ----------
const Stop: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.stop - 0.35;
  const inn = sp(t, t0, 14, 160);
  const ex = t > A.explain - 0.2;
  const grow = ramp(t, A.explain - 0.1, A.minutes + 0.4, Easing.out(Easing.quad));
  const secs = Math.round(10 + grow * 110);
  const dig = t > A.dig - 0.3;
  const bar = (label: string, w: number, col: string, val: string, top: number, show: boolean, a: number) => (show ? (
    <div style={{ position: "absolute", left: 50, right: 50, top, ...pop(t, a, 0.85) }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ height: 64, width: w, background: col, borderRadius: 16 }} />
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: col, fontVariantNumeric: "tabular-nums" }}>{val}</span>
      </div>
    </div>
  ) : null);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 88, color: TH.ink }}>Then <span style={{ color: GREEN }}>stop.</span></div>
      {bar("You", 70, GREEN, "0:10 ✓", 200, true, t0 + 0.2)}
      {bar("Most people", 70 + grow * 640, RED, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`, 380, ex, A.explain - 0.2)}
      {dig ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...pop(t, A.dig - 0.3, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 60, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-2deg)" }}>That's when I dig 🔍</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 6 · guide PDF scroll (Comment GAP → end) ---------- (Comment REPLY → end) ----------
const GUIDE_PAGES = 6;
const PAGES = Array.from({ length: GUIDE_PAGES }, (_, i) => staticFile(`bxgp-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>gap-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>GAP</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>prompt + the lines</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXGPMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxgp-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.open - 0.1 && t < A.stop - 0.35;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.recruiter - 0.2, RefCheck], [A.name - 0.35, NameIt], [A.open - 0.1, Claude], [A.stop - 0.35, Stop], [A.comment - 0.1, GuideScroll],
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
