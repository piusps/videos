import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { C, ClaudeLang, Cursor } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-search (R-020 "The search recruiters type"), job-seeker series, 2026-10-20.
// Same build as BxDropoutBrolls: split (panel top, Felix below). Hook / search / payoff in boilr style,
// steps 1-3 = real claude.ai screens (klickpfad/claude-ablauf.md) with typing reveal, cursor and scroll only.
// Job ad, profile, names and results on screen are invented. Times = word starts on the tightened timeline.

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

import captionsJson from "../../runs/bx-search/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  aspiring: at("aspiring", 1), wont: at("wont"), im: at("im"), client: at("client"), post: at("post"), search1: at("search", 1), job1: at("job", 1), skills1: at("skills", 1), city1: at("city", 1), boxes: at("3"),
  aspiring2: at("aspiring", 2), nobody: at("nobody"),
  step1: at("step", 1), open: at("open"), paste1: at("paste", 1), ask1: at("ask", 1), recruiter2: at("recruiter", 2),
  step2: at("step", 2), paste2: at("paste", 2), ask2: at("ask", 2), words2: at("words", 2), top: at("top"), city2: at("city", 2),
  step3: at("step", 3), ask3: at("ask", 3), missing: at("missing"), add: at("add"), trueW: at("true"),
  next: at("next"), list: at("list"), comment: at("comment"), total: CAPS[CAPS.length - 1].endMs / 1000 + 0.8,
};
export const BXS2_FRAMES = Math.round(A.total * 25);

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
const StepHead: React.FC<{ n: number; title: React.ReactNode; dark?: boolean }> = ({ n, title, dark }) => (
  <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 70, height: 70, borderRadius: 20, background: dark ? MINT : GREEN, color: dark ? "#0B1F18" : "#FFF", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
    {title}
  </div>
);

// ---------- shared: generic people search (no real platform branding) ----------
const PEOPLE = [
  { i: "SK", t: "Marketing Executive", s: "Meta Ads · Shopify · Klaviyo", c: "Manchester" },
  { i: "AM", t: "Digital Marketing Executive", s: "Meta Ads · TikTok · GA4", c: "Salford" },
  { i: "RT", t: "Social Media Executive", s: "Instagram · Meta Ads · Canva", c: "Stockport" },
];
const Field: React.FC<{ label: string; value: string; t: number; from: number; n: number; showN: boolean }> = ({ label, value, t, from, n, showN }) => {
  const on = t > from - 0.05;
  return (
    <div style={{ position: "relative", flex: 1, background: "#FFF", border: `3px solid ${on ? GREEN : TH.line}`, borderRadius: 18, padding: "12px 18px", boxSizing: "border-box", minHeight: 96 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 20, color: TH.dim, letterSpacing: 1.2 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden" }}>{typedRaw(value, t, from, from + 0.45)}</div>
      {showN ? <div style={{ position: "absolute", right: -14, top: -18, width: 46, height: 46, borderRadius: 23, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, A.boxes - 0.1 + n * 0.08, 0.4) }}>{n}</div> : null}
    </div>
  );
};
const typedRaw = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * ramp(t, a, b, (x) => x)));
const PersonRow: React.FC<{ p: { i: string; t: string; s: string; c: string }; style?: React.CSSProperties; hl?: boolean }> = ({ p, style, hl }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 20px", background: hl ? "#EAF7F0" : "#FFF", border: `${hl ? 4 : 2}px solid ${hl ? MINT : TH.line}`, borderRadius: 18, boxShadow: hl ? `0 0 28px ${MINT}88` : undefined, ...style }}>
    <div style={{ width: 62, height: 62, borderRadius: 31, background: hl ? GREEN : "#DDE6E1", color: hl ? "#FFF" : TH.ink, fontFamily: fonts.bold, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.i}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.t}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 23, color: TH.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.s} · {p.c}</div>
    </div>
  </div>
);

// ---------- 1 · Hook: "Aspiring marketer" headline, the recruiter won't find you (0 → "I'm") ----------
const HEAD = "Aspiring marketer | Passionate about creativity and storytelling | Open to work";
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const mark = ramp(t, A.aspiring - 0.05, A.aspiring + 0.35);
  const lost = ramp(t, A.wont - 0.1, A.wont + 0.4);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 44, color: TH.ink, ...pop(t, 0.05) }}>Your headline</div>
      <Card x={40} y={130} w={1000} h={470} style={{ padding: "34px 40px", transform: `scale(${1 - 0.05 * lost})`, opacity: 1 - 0.35 * lost, ...pop(t, 0.0, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: "#DDE6E1", fontFamily: fonts.bold, fontSize: 44, color: TH.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>JE</div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 46, color: TH.ink }}>Jordan Ellis</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 26, color: TH.dim }}>Manchester · example profile</div>
          </div>
        </div>
        <div style={{ position: "relative", fontFamily: fonts.semibold, fontSize: 40, color: TH.ink, lineHeight: 1.3, marginTop: 30 }}>
          <span style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: -6, right: -6, bottom: 2, height: 18, background: RED, opacity: 0.28, transform: `scaleX(${mark})`, transformOrigin: "0 50%", borderRadius: 6 }} />
            Aspiring marketer
          </span>{HEAD.slice("Aspiring marketer".length)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
          <span style={{ fontFamily: fonts.regular, fontSize: 26, color: TH.dim }}>Skills: Canva · Instagram · TikTok</span>
          <span style={{ marginLeft: "auto" }}><Chip text="#OpenToWork" size={24} /></span>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 60, right: 60, top: 640, display: "flex", alignItems: "center", gap: 16, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 999, padding: "14px 28px", whiteSpace: "nowrap", ...pop(t, A.wont - 0.15, 0.7) }}>
        <span style={{ fontSize: 34 }}>🔍</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.ink }}>Marketing Executive · Manchester</span>
        <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: RED }}>you: not found</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2 · recruiter view: a client calls, no ad, I search: title, skills, city ----------
const SearchScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.im - 0.05;
  const inn = sp(t, t0, 14, 160);
  const searchOn = t > A.search1 - 0.15;
  const sIn = sp(t, A.search1 - 0.15, 14, 170);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 42, color: TH.ink, ...pop(t, t0 + 0.05) }}>What I do when a client calls</div>
      {!searchOn ? (
        <>
          <Card x={140} y={150} w={800} h={190} style={{ padding: "26px 32px", display: "flex", alignItems: "center", gap: 24, ...pop(t, A.client - 0.1, 0.7) }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: GREEN, color: "#FFF", fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(t * 30) * (t < A.client + 0.8 ? 8 : 0)}deg)` }}>📞</div>
            <div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim }}>Client · Halden & Pike</div>
              <div style={{ fontFamily: fonts.bold, fontSize: 38, color: TH.ink }}>"We need a Marketing Executive."</div>
            </div>
          </Card>
          <div style={{ position: "absolute", left: 300, top: 420, width: 480, height: 110, borderRadius: 24, border: `3px dashed ${TH.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 38, color: TH.dim, ...pop(t, A.post - 0.1, 0.7) }}>
            + Post a job ad
            <div style={{ position: "absolute", left: 30, right: 30, top: "50%", height: 6, background: RED, borderRadius: 3, transform: `scaleX(${ramp(t, A.post + 0.15, A.post + 0.45)})`, transformOrigin: "0 50%" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 570, textAlign: "center", fontFamily: serifItalic, fontSize: 54, color: TH.ink, ...pop(t, A.post + 0.4, 0.7) }}>not yet.</div>
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, sIn * 2), transform: `translateY(${(1 - sIn) * 60}px)` }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 130, display: "flex", gap: 18 }}>
            <Field label="Job title" value="Marketing Executive" t={t} from={A.job1} n={1} showN />
            <Field label="Skills" value="Meta Ads, Shopify" t={t} from={A.skills1} n={2} showN />
            <Field label="Location" value="Manchester" t={t} from={A.city1} n={3} showN />
          </div>
          <div style={{ position: "absolute", left: 40, top: 262, fontFamily: fonts.semibold, fontSize: 26, color: TH.dim, ...pop(t, A.boxes + 0.15, 0.8) }}>People who match all three</div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 310, display: "flex", flexDirection: "column", gap: 14 }}>
            {PEOPLE.map((p, i) => <PersonRow key={p.i} p={p} style={pop(t, A.boxes + 0.25 + i * 0.12, 0.85)} />)}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 3 · "Aspiring isn't a job title. Nobody types it." → 0 results ----------
const ZeroScene: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.aspiring2 - 0.05;
  const inn = sp(t, t0, 14, 170);
  const zero = t > A.nobody - 0.1;
  return (
    <AbsoluteFill style={{ transform: `scale(${0.92 + 0.08 * inn})`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 120 }}>
        <Field label="Job title" value="aspiring marketer" t={t} from={t0 + 0.05} n={1} showN={false} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", ...pop(t, A.nobody - 0.1, 0.5) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 190, color: zero ? RED : TH.ink, lineHeight: 1 }}>0</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: TH.ink }}>people found</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: serifItalic, fontSize: 52, color: TH.dim, ...pop(t, A.nobody + 0.25, 0.7) }}>nobody searches for “aspiring”</div>
    </AbsoluteFill>
  );
};

// ---------- 4-5 · Steps 1-3: the real claude.ai click path ----------
const CB = "#151515"; // claude.ai dark page
const BOXBG = "rgb(32,32,31)"; // claude.ai input box
const shot = (f: string) => staticFile(`bxs2-claude/${f}`);
type Line = { y0: number; y1: number; x0: number; x1: number };

// source-pixel image placed with scale s so that source point (sx, sy) lands on panel point (px, py)
const Shot: React.FC<{ src: string; s: number; sx: number; sy: number; px: number; py: number; clipY?: [number, number]; children?: React.ReactNode; style?: React.CSSProperties }> = ({ src, s, sx, sy, px, py, clipY, children, style }) => (
  <div style={{ position: "absolute", left: px - sx * s, top: py - sy * s, transform: `scale(${s})`, transformOrigin: "0 0", ...style }}>
    <Img src={src} style={{ display: "block", clipPath: clipY ? `inset(${clipY[0]}px 0 calc(100% - ${clipY[1]}px) 0)` : undefined }} />
    {children}
  </div>
);

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

// scrolling answer: keys = [time, source y at panel top]; motion blur while moving
const ScrollShot: React.FC<{ t: number; src: string; s: number; offX: number; keys: [number, number][]; appear: number }> = ({ t, src, s, offX, keys, appear }) => {
  const yAt = (tt: number) => {
    let y = keys[0][1];
    for (let i = 1; i < keys.length; i++) y += (keys[i][1] - keys[i - 1][1]) * ramp(tt, keys[i][0], keys[i][0] + 0.38, Easing.inOut(Easing.cubic));
    return y;
  };
  const moving = Math.abs(yAt(t) - yAt(t - 0.04)) > 2;
  const N = 1; void moving;
  const reveal = ramp(t, appear, appear + 0.7, Easing.out(Easing.quad)); // streaming-in look
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`, opacity: Math.min(1, (t - appear) * 6) }}>
      {Array.from({ length: N }, (_, j) => (
        <Img key={j} src={src} style={{ position: "absolute", left: offX, top: -yAt(t - (j / Math.max(1, N - 1)) * 0.025) * s, width: 936 * s, opacity: j ? 0.35 / j : 1 }} />
      ))}
    </div>
  );
};

const Q1: Line[] = [{ y0: 169, y1: 193, x0: 290, x1: 1206 }, { y0: 202, y1: 224, x0: 290, x1: 607 }];
const typeEnd1 = () => A.recruiter2 + 0.3;
const ClaudeStep1: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step1 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const te = typeEnd1();
  const ansAt = te + 0.25;
  // home-empty (1568 px wide) is captured at 2.18 px per screen px, home-typed (1517) at 2.71: scale 1.244 vs 1.0
  const pasted = t > A.paste1 + 0.05;
  const [ix, iy] = [540 + (640 - 799) * 1.244 * 0.9, 120 + (247 - 160) * 1.244 * 0.9];
  const send: [number, number] = [540 + (1254 - 778) * 0.9, 120 + (672 - 72) * 0.9];
  return (
    <AbsoluteFill style={{ background: CB, opacity: Math.min(1, inn * 2) }}>
      {t < ansAt ? (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${0.96 + 0.04 * inn})`, transformOrigin: "50% 40%" }}>
          {t < A.paste1 - 0.02 ? (
            <Shot src={shot("home-empty.png")} s={1.244 * 0.9} sx={799} sy={160} px={540} py={120} clipY={[60, 415]} />
          ) : (
            <Shot src={shot("home-typed.png")} s={0.9} sx={778} sy={72} px={540} py={120}>
              <div style={{ position: "absolute", left: 280, top: 228, width: 1000, height: 410, background: BOXBG, opacity: pasted ? 0 : 1 }} />
              <TypeCover lines={Q1} p={ramp(t, A.ask1, te, (x) => x)} />
            </Shot>
          )}
          <Cursor keys={[[t0, 860, 820], [A.open + 0.3, ix, iy, true], [A.paste1 - 0.1, ix + 20, iy + 10], [A.paste1, ix + 20, iy + 10, true], [te - 0.25, send[0] - 60, send[1] - 30], [te + 0.05, send[0], send[1], true]]} showFrom={t0 + 0.2} />
        </div>
      ) : (
        <ScrollShot t={t} src={shot("answer1.png")} s={1.3} offX={-40} appear={ansAt}
          keys={[[ansAt, 430], [ansAt + 0.75, 690], [ansAt + 1.4, 1030]]} />
      )}
    </AbsoluteFill>
  );
};

const RS = 0.69;
const Q2: Line[] = [{ y0: 67, y1: 95, x0: 67, x1: 1404 }, { y0: 107, y1: 136, x0: 65, x1: 408 }];
const ClaudeStep2: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.paste2 - 0.05;
  const tEnd = A.words2 + 0.2;
  const ansAt = tEnd + 0.25;
  const boxTop = PH - (719 - 20) * RS - 150;
  const pasted = t > A.paste2 + 0.05;
  const send: [number, number] = [1481 * RS, boxTop + (607 - 20) * RS];
  return (
    <AbsoluteFill style={{ background: CB }}>
      {t < ansAt ? (
        <>
          <ScrollShot t={t} src={shot("answer1.png")} s={1.3} offX={-40} appear={-1} keys={[[0, 1030], [t0, 1080]]} />
          <div style={{ position: "absolute", left: 0, right: 0, top: boxTop - 60, bottom: 0, background: `linear-gradient(transparent, ${CB} 60px)` }} />
          <Shot src={shot("reply-profile.png")} s={RS} sx={0} sy={20} px={0} py={boxTop} clipY={[20, 719]} style={{ transform: `translateY(${(1 - sp(t, t0, 15, 170)) * 200}px) scale(${RS})` }}>
            <div style={{ position: "absolute", left: 50, top: 140, width: 1430, height: 452, background: BOXBG, opacity: pasted ? 0 : 1 }} />
            <TypeCover lines={Q2} p={ramp(t, A.ask2, tEnd, (x) => x)} />
          </Shot>
          <Cursor keys={[[t0, 700, 200], [A.paste2 + 0.05, 160, boxTop + 200, true], [tEnd - 0.3, send[0] - 80, send[1] - 30], [tEnd + 0.05, send[0], send[1], true]]} showFrom={t0 + 0.1} />
        </>
      ) : (
        <ScrollShot t={t} src={shot("answer2.png")} s={1.3} offX={-40} appear={ansAt}
          keys={[[ansAt, 470], [A.top - 0.15, 560], [A.city2 - 0.1, 730]]} />
      )}
    </AbsoluteFill>
  );
};

const Q3: Line[] = [{ y0: 458, y1: 495, x0: 66, x1: 1209 }];
const ClaudeStep3: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step3 - 0.1;
  const tEnd = A.missing + 0.2;
  const ansAt = tEnd + 0.25;
  const boxTop = PH - (587 - 400) * RS - 150;
  const send: [number, number] = [1483 * RS, boxTop + (476 - 400) * RS];
  return (
    <AbsoluteFill style={{ background: CB }}>
      {t < ansAt ? (
        <>
          <ScrollShot t={t} src={shot("answer2.png")} s={1.3} offX={-40} appear={-1} keys={[[0, 730], [t0, 900]]} />
          <div style={{ position: "absolute", left: 0, right: 0, top: boxTop - 60, bottom: 0, background: `linear-gradient(transparent, ${CB} 60px)` }} />
          <Shot src={shot("reply-missing.png")} s={RS} sx={0} sy={400} px={0} py={boxTop} clipY={[400, 587]} style={{ transform: `translateY(${(1 - sp(t, t0, 15, 170)) * 200}px) scale(${RS})` }}>
            <TypeCover lines={Q3} p={ramp(t, A.ask3, tEnd, (x) => x)} />
          </Shot>
          <Cursor keys={[[t0, 700, 400], [tEnd - 0.35, send[0] - 90, send[1] - 40], [tEnd + 0.05, send[0], send[1], true]]} showFrom={t0 + 0.3} />
        </>
      ) : (
        <ScrollShot t={t} src={shot("answer3.png")} s={1.3} offX={-40} appear={ansAt}
          keys={[[ansAt, 150], [A.add - 0.05, 430], [A.trueW - 0.05, 660]]} />
      )}
    </AbsoluteFill>
  );
};

// ---------- 6 · payoff: next time I search, you're on the list ----------
const ME = { i: "JE", t: "Social Media & Ecommerce Marketer", s: "Meta Ads · Instagram · Shopify", c: "Manchester" };
const Found: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.next - 0.05;
  const inn = sp(t, t0, 14, 150);
  const slot = ramp(t, A.list - 0.45, A.list - 0.05, Easing.out(Easing.back(1.4)));
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, display: "flex", gap: 18 }}>
        <Field label="Job title" value="Marketing Executive" t={t} from={-1} n={1} showN={false} />
        <Field label="Skills" value="Meta Ads, Shopify" t={t} from={-1} n={2} showN={false} />
        <Field label="Location" value="Manchester" t={t} from={-1} n={3} showN={false} />
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 180, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ height: 94 * slot, opacity: slot, overflow: "visible" }}>
          {slot > 0.02 ? <PersonRow p={ME} hl style={{ transform: `translateX(${(1 - slot) * 700}px)` }} /> : null}
        </div>
        {PEOPLE.map((p) => <PersonRow key={p.i} p={p} />)}
      </div>
      <Stamp t={t} at={A.list - 0.05} text="YOU'RE ON THE LIST" x={330} y={690} rot={-6} color={GREEN} size={42} />
    </AbsoluteFill>
  );
};

// ---------- 7 · guide PDF scroll (Comment SEARCH → end) ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`bxs2-guide/p${String(i + 1).padStart(2, "0")}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>Get found.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>SEARCH</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>3 prompts + headline formula</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXS2Main: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxs2-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.next - 0.05;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.im - 0.05, SearchScene], [A.aspiring2 - 0.05, ZeroScene], [A.step1 - 0.1, ClaudeStep1], [A.paste2 - 0.05, ClaudeStep2], [A.step3 - 0.1, ClaudeStep3], [A.next - 0.05, Found], [A.comment - 0.1, GuideScroll],
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
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: dark ? "#151515" : TH.bg, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
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
