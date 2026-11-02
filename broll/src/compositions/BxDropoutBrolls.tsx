import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { serifItalic } from "../components/PanelKit";
import { C, ClaudeLang, Cursor } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-dropout ("Dropped out, 300 applications, 0 interviews"), candidate series, 2026-10-19.
// Same build as BxSalaryBrolls: one continuous split (panel top, Felix below), a new impulse every 1-2 s, boilr green.
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

import captionsJson from "../../runs/bx-dropout/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  dropped: at("dropped"), three: at("300"), interview: at("interview"), im: at("im"), lots: at("lots"), person: at("person", 1), box: at("box"), required: at("required"), out: at("out", 2),
  stop: at("stop"), filter: at("filter"), open: at("open"), without: at("without"),
  step1: at("step", 1), ask1: at("ask", 1), appr: at("apprenticeships"), skills: at("skills"), portfolio: at("portfolio"), sources: at("sources"),
  step2: at("step", 2), paste: at("paste"), ask2: at("ask", 3), built: at("built"), fixed: at("fixed"), sold: at("sold"), top: at("top"), not2: at("not", 2),
  step3: at("step", 3), ask3: at("ask", 4), leaving: at("leaving"), honest: at("honest"), short: at("short"), apology: at("apology"),
  fewer: at("fewer"), person2: at("person", 2), reads: at("reads"), comment: at("comment"), total: CAPS[CAPS.length - 1].endMs / 1000 + 0.8,
};
export const BXD_FRAMES = Math.round(A.total * 25);

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

// ---------- 1 · Hook: 300 applications sent, 0 interviews (0 → "I'm") ----------
const CO = ["Halden Group", "Northbeam", "Corrie & Co", "Fenwick Labs", "Ashby Retail", "Mere Studio", "Kestrel Media", "Brightline", "Oakmont", "Tamsin Digital", "Larch & Pine", "Severn Foods"];
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.round(300 * ramp(t, A.three - 0.15, A.interview - 0.1, Easing.out(Easing.quad)));
  const zero = t > A.interview - 0.05;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 36, textAlign: "center", fontFamily: fonts.bold, fontSize: 62, color: TH.ink, lineHeight: 1.05 }}>
        Dropped out. <span style={{ background: GREEN, color: "#FFF", borderRadius: 14, padding: "0 14px" }}>300 tries.</span>
      </div>
      <Card x={50} y={170} w={540} h={480} style={{ padding: "28px 32px" }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, letterSpacing: 1.5 }}>APPLICATIONS SENT</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 130, color: TH.ink, marginTop: 4, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{n}</div>
        <div style={{ height: 22, borderRadius: 11, background: "#E3EAE6", overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${(n / 300) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${GREEN}, ${MINT})`, borderRadius: 11 }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 34, ...pop(t, A.interview - 0.1, 0.7) }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, letterSpacing: 1.2 }}>INTERVIEWS</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 96, color: zero ? RED : TH.ink }}>0</span>
        </div>
      </Card>
      {/* falling "no reply" cards stacking on the right */}
      {CO.map((c, i) => {
        const t0 = 0.25 + i * 0.16;
        if (t < t0) return null;
        const a = ramp(t, t0, t0 + 0.35, Easing.out(Easing.back(1.2)));
        const yEnd = 600 - i * 36;
        const rot = ((i * 37) % 11) - 5;
        return (
          <div key={c} style={{ position: "absolute", left: 630 + ((i * 53) % 40), top: -120 + (yEnd + 120) * a, width: 380, height: 84, background: "#FFF", border: `2px solid ${TH.line}`, borderRadius: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.08)", transform: `rotate(${rot}deg)`, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", boxSizing: "border-box" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF2F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✉</div>
            <div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.ink }}>{c}</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 20, color: TH.dim }}>No reply</div>
            </div>
          </div>
        );
      })}
      <Stamp t={t} at={A.interview - 0.05} text="0 INTERVIEWS" x={600} y={700} rot={-6} size={44} />
    </AbsoluteFill>
  );
};

// ---------- 2 · recruiter view: one tick box ends it, then "stop applying where the degree is the filter" ----------
const Filter: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.im - 0.05;
  const inn = sp(t, t0, 14, 160);
  const ticked = t > A.box + 0.1;
  const rejected = t > A.out - 0.05;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 42, color: TH.ink, ...pop(t, t0 + 0.05) }}>What I see on my side</div>
      <div style={{ position: "absolute", right: 40, top: 40, ...pop(t, A.lots - 0.05, 0.7) }}><Chip text="🤖 auto-screening" bg="#FFF" fg={TH.ink} size={28} style={{ border: `3px solid ${TH.line}` }} /></div>
      <Card x={40} y={130} w={1000} h={500} style={{ padding: "30px 36px", border: rejected ? `3px solid ${RED}` : `2px solid ${TH.line}` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, letterSpacing: 1.5 }}>ONLINE APPLICATION · STEP 2 OF 5</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 46, color: TH.ink, marginTop: 14 }}>Do you have a university degree?</div>
        <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
          {["Yes", "No"].map((o) => {
            const on = o === "No" && ticked;
            const hl = o === "No" && t > A.box - 0.15;
            return (
              <div key={o} style={{ flex: 1, height: 100, borderRadius: 20, border: `4px solid ${hl ? RED : TH.line}`, display: "flex", alignItems: "center", gap: 20, padding: "0 28px", boxSizing: "border-box", transform: `scale(${hl && !ticked ? 1.04 : 1})`, background: on ? "#FDECEC" : "#FFF" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, border: `4px solid ${hl ? RED : TH.line}`, background: on ? RED : "#FFF", color: "#FFF", fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</div>
                <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>{o}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 34, ...pop(t, A.required - 0.1, 0.7) }}>
          <Chip text="⚠ Degree required" bg={RED} size={32} />
        </div>
        {rejected ? (
          <div style={{ position: "absolute", left: 36, right: 36, bottom: 28, fontFamily: fonts.semibold, fontSize: 30, color: RED, ...pop(t, A.out - 0.05, 0.85) }}>Application closed automatically. No human review.</div>
        ) : null}
      </Card>
      <Stamp t={t} at={A.out - 0.05} text="REJECTED" x={720} y={395} rot={-10} size={48} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 680, textAlign: "center", fontFamily: serifItalic, fontSize: 60, color: TH.ink, lineHeight: 1.1, ...pop(t, A.stop - 0.05, 0.7) }}>
        stop applying where the degree is the <span style={{ color: GREEN }}>filter</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3-5 · Steps 1-3: the real claude.ai click path ----------
// Real screenshots from claude.ai (Chrome, Opus 5.5, 2026-10-20, runs/bx-dropout/klickpfad/claude-ablauf.md).
// Only motion is added: typing reveal over the real prompt text, cursor clicks, scroll through Claude's real answers.
// The CV is invented (Jordan Ellis). No green frames, chips or stamps in this part.
const CB = "#151515"; // claude.ai dark page
const BOXBG = "rgb(32,32,31)"; // claude.ai input box
const shot = (f: string) => staticFile(`bxd-claude/${f}`);
type Line = { y0: number; y1: number; x0: number; x1: number };
const typeEnd = () => A.without + 0.75;

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

const PROMPT1: Line[] = [{ y0: 225, y1: 244, x0: 407, x1: 1168 }, { y0: 252, y1: 271, x0: 407, x1: 1140 }, { y0: 275, y1: 299, x0: 407, x1: 588 }];
const ClaudeStep1: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step1 - 0.1;
  const inn = sp(t, t0, 15, 160);
  const te = typeEnd();
  const ansAt = te + 0.35;
  const S = 1.2, PX = 540, PY = 430, SX = 800, SY = 260;
  const toP = (x: number, y: number): [number, number] => [PX + (x - SX) * S, PY + (y - SY) * S];
  const [ix, iy] = toP(640, 250);
  const [bx, by] = toP(1183, 331);
  return (
    <AbsoluteFill style={{ background: CB, opacity: Math.min(1, inn * 2) }}>
      {t < ansAt ? (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${0.94 + 0.06 * inn + 0.04 * ramp(t, A.ask1, te, Easing.inOut(Easing.quad))})`, transformOrigin: "50% 45%" }}>
          {t < A.ask1 - 0.05 ? (
            <Shot src={shot("home-empty.png")} s={S} sx={SX} sy={SY} px={PX} py={PY} clipY={[60, 415]} />
          ) : (
            <Shot src={shot("home-typed.png")} s={S} sx={SX} sy={SY} px={PX} py={PY} clipY={[60, 415]}>
              <TypeCover lines={PROMPT1} p={ramp(t, A.ask1, te, (x) => x)} />
            </Shot>
          )}
          <Cursor keys={[[t0, 860, 820], [A.open + 0.35, ix, iy, true], [te - 0.25, ix + 60, iy + 40], [te + 0.1, bx, by, true]]} showFrom={t0 + 0.2} />
        </div>
      ) : (
        <ScrollShot t={t} src={shot("answer1.png")} s={1.3} offX={-40} appear={ansAt}
          keys={[[ansAt, 150], [A.appr + 0.2, 390], [A.skills - 0.1, 935], [A.portfolio - 0.1, 1470], [A.sources - 0.25, 1770]]} />
      )}
    </AbsoluteFill>
  );
};

// reply view: tail of the previous answer on top, the real reply box (cropped) at the bottom
const RS = 0.69;
const CV_LINES: Line[] = [{ y0: 424, y1: 453, x0: 67, x1: 1404 }, { y0: 465, y1: 494, x0: 66, x1: 691 }];
const ClaudeStep2: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step2 - 0.1;
  const tEnd = A.sold + 0.3;
  const ansAt = tEnd + 0.3;
  const boxTop = PH - (587 - 100) * RS - 150; // keep the prompt above the captions on the seam // reply-cv cropped from source y 100
  const pdf = sp(t, A.paste - 0.05, 12, 190);
  const send: [number, number] = [1483 * RS, boxTop + (476 - 100) * RS];
  return (
    <AbsoluteFill style={{ background: CB }}>
      {t < ansAt ? (
        <>
          <ScrollShot t={t} src={shot("answer1.png")} s={1.3} offX={-40} appear={-1} keys={[[0, 1770], [t0, 1960]]} />
          <div style={{ position: "absolute", left: 0, right: 0, top: boxTop - 60, bottom: 0, background: `linear-gradient(transparent, ${CB} 60px)` }} />
          <Shot src={shot("reply-cv.png")} s={RS} sx={0} sy={100} px={0} py={boxTop} clipY={[100, 587]} style={{ transform: `translateY(${(1 - sp(t, t0, 15, 170)) * 200}px) scale(${RS})` }}>
            {/* PDF card pops in on "paste" */}
            <div style={{ position: "absolute", left: 58, top: 133, width: 240, height: 240, background: BOXBG, opacity: 1 - Math.min(1, pdf * 1.5) }} />
            <TypeCover lines={CV_LINES} p={ramp(t, A.ask2, tEnd, (x) => x)} />
          </Shot>
          <Cursor keys={[[t0, 700, 300], [A.paste - 0.15, 120, boxTop + 120, true], [tEnd - 0.3, send[0] - 80, send[1] - 30], [tEnd + 0.05, send[0], send[1], true]]} showFrom={t0 + 0.3} />
        </>
      ) : (
        <ScrollShot t={t} src={shot("answer2.png")} s={1.3} offX={-40} appear={ansAt}
          keys={[[ansAt, 330], [A.top - 0.2, 640], [A.not2 - 0.2, 1250]]} />
      )}
    </AbsoluteFill>
  );
};

const HONEST_LINE: Line[] = [{ y0: 458, y1: 495, x0: 67, x1: 1425 }];
const ClaudeStep3: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.step3 - 0.1;
  const tEnd = A.leaving + 0.2;
  const ansAt = tEnd + 0.3;
  const boxTop = PH - (587 - 400) * RS - 150;
  const send: [number, number] = [1483 * RS, boxTop + (476 - 400) * RS];
  const zoom = ramp(t, A.short - 0.1, A.short + 0.5, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{ background: CB }}>
      {t < ansAt ? (
        <>
          <ScrollShot t={t} src={shot("answer2.png")} s={1.3} offX={-40} appear={-1} keys={[[0, 1250], [t0, 1600]]} />
          <div style={{ position: "absolute", left: 0, right: 0, top: boxTop - 60, bottom: 0, background: `linear-gradient(transparent, ${CB} 60px)` }} />
          <Shot src={shot("reply-honest.png")} s={RS} sx={0} sy={400} px={0} py={boxTop} clipY={[400, 587]} style={{ transform: `translateY(${(1 - sp(t, t0, 15, 170)) * 200}px) scale(${RS})` }}>
            <TypeCover lines={HONEST_LINE} p={ramp(t, A.ask3, tEnd, (x) => x)} />
          </Shot>
          <Cursor keys={[[t0, 700, 400], [tEnd - 0.35, send[0] - 90, send[1] - 40], [tEnd + 0.05, send[0], send[1], true]]} showFrom={t0 + 0.3} />
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, (t - ansAt) * 6), transform: `scale(${1 + 0.05 * zoom})`, transformOrigin: "15px 30%" }}>
          <Shot src={shot("answer3.png")} s={1.04} sx={0} sy={0} px={-40} py={60 - 140 * zoom} clipY={[0, 440]} style={{ clipPath: `inset(0 0 ${(1 - ramp(t, ansAt, ansAt + 0.6, Easing.out(Easing.quad))) * 100}% 0)` }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- 6 · payoff: fewer applications, a person reads them ----------
const Payoff: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.fewer - 0.05;
  const inn = sp(t, t0, 14, 150);
  const n = Math.round(300 - 290 * ramp(t, A.fewer, A.fewer + 0.8, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 600}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center" }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, letterSpacing: 1.5 }}>APPLICATIONS</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 150, color: GREEN, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>{n}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: TH.ink }}>instead of 300</div>
      </div>
      <Card x={140} y={420} w={800} h={220} style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 24, border: `3px solid ${MINT}`, boxShadow: `0 0 30px ${MINT}88`, ...pop(t, A.person2 - 0.15, 0.6) }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: GREEN, color: "#FFF", fontFamily: fonts.bold, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>↩</div>
        <div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>Re: Marketing Assistant · Kestrel Media</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink }}>"Loved the café project. Free for a call Thursday?"</div>
        </div>
      </Card>
      <Stamp t={t} at={A.reads - 0.05} text="READ BY A PERSON" x={390} y={690} rot={-7} color={GREEN} size={40} />
    </AbsoluteFill>
  );
};

// ---------- 7 · guide PDF scroll (Comment START → end) ----------
const PAGES = Array.from({ length: 4 }, (_, i) => staticFile(`bxd-guide/p${String(i + 1).padStart(2, "0")}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>No degree, get read.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: "#0B1F18", borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>START</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>3 prompts + bonus</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#0B1F18", background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXDMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxd-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.step1 - 0.1 && t < A.fewer - 0.05;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.im - 0.05, Filter], [A.step1 - 0.1, ClaudeStep1], [A.step2 - 0.1, ClaudeStep2], [A.step3 - 0.1, ClaudeStep3], [A.fewer - 0.05, Payoff], [A.comment - 0.1, GuideScroll],
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
