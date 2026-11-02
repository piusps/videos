import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES } from "../components/HookKit";
import { ClaudeLang } from "../components/ClaudeKit";

// Felix · @moustacherecruiter · runs/bx-reply ("Reply to the rejection"), 2026-10-29.
// Same build as BxDirectBrolls (split: panel top, Felix below), skiprate standard: frame 0 = finished hook.
// Rejection mail (Sarah Mitchell, Northgate Energy, candidate Alex) is invented. Claude screen = real claude.ai chat a603556b rendered from its DOM.

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

import captionsJson from "../../runs/bx-reply/captions.json";
type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captionsJson as Cap[];
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (w: string, n = 1) => { let c = 0; for (const x of CAPS) if (nrm(x.text) === w && ++c === n) return x.startMs / 1000; throw new Error("anchor " + w + n); };
const A = {
  close: at("close"), mistake: at("mistake"), recruiter: at("recruiter"), no: at("no"), quits: at("quits"),
  shortlist: at("shortlist"), call: at("call"), replied: at("replied"),
  reply: at("reply"), paste: at("paste"), three: at("three"), thank: at("thank"), keen: at("keen"), thing: at("thing"),
  get: at("get"), northgate: at("northgate"), changes: at("changes"), grateful: at("grateful"),
  send: at("send"), day: at("day"), never: at("never"), works: at("works"),
  comment: at("comment"),
  total: CAPS[CAPS.length - 1].endMs / 1000 + 0.25,
};
export const BXRP_FRAMES = Math.round(A.total * 25);

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
const shot = (f: string) => staticFile(`bxrp-claude/${f}`);

// ---------- 1 · Hook: the rejection mail (complete at frame 0) ----------
const Avatar: React.FC<{ ch: string; bg: string; fg: string; size?: number }> = ({ ch, bg, fg, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: fg, fontFamily: fonts.bold, fontSize: size * 0.46, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{ch}</div>
);
const Hook: React.FC<{ t: number }> = ({ t }) => {
  // cursor drifts to the close button from frame 0 and clicks it on "close"
  const mv = ramp(t, 0, A.close, Easing.inOut(Easing.cubic));
  const cx = interpolate(mv, [0, 1], [700, 958]);
  const cy = interpolate(mv, [0, 1], [560, 296]);
  const clicked = t > A.close + 0.1;
  const fade = ramp(t, A.close + 0.1, A.close + 0.45);
  const stamp = t > A.mistake - 0.1;
  const underline = ramp(t, 0.2, 1.1, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, right: 40, top: 34, fontFamily: fonts.bold, fontSize: 80, lineHeight: 1.04, color: TH.ink }}>Rejected?<br /><span style={{ color: RED }}>Don't close that email.</span></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 250, borderRadius: 30, background: "#FFF", border: `3px solid ${TH.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.12)", padding: "26px 32px", boxSizing: "border-box", opacity: 1 - 0.45 * fade, transform: `scale(${1 - 0.04 * fade})` }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Avatar ch="S" bg="#DCE7F7" fg="#2F5DA8" />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 30, color: TH.ink, lineHeight: 1.1 }}>Sarah Mitchell · Northgate Energy</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim }}>Re: Marketing Executive role</div>
          </div>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: clicked ? "#FDE4E4" : "#F1F3F2", color: clicked ? RED : TH.dim, fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", border: clicked ? `3px solid ${RED}` : "3px solid transparent" }}>×</div>
        </div>
        <div style={{ marginTop: 24, fontFamily: fonts.semibold, fontSize: 38, lineHeight: 1.35, color: "#4A5550" }}>
          Hi Alex, thank you for interviewing with us. The team really enjoyed meeting you, but{" "}
          <span style={{ color: TH.ink, fontFamily: fonts.bold, backgroundImage: `linear-gradient(${RED}55, ${RED}55)`, backgroundRepeat: "no-repeat", backgroundSize: `${underline * 100}% 40%`, backgroundPosition: "0 90%" }}>we've decided to move forward with other candidates.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 590, display: "flex", gap: 16 }}>
        {["Delete", "Archive"].map((b) => <Chip key={b} text={b} size={32} bg="#FFF" fg={TH.dim} style={{ border: `3px solid ${TH.line}`, padding: "8px 26px" }} />)}
        <Chip text="↩ Reply" size={32} bg={MINT} fg={DARK} style={{ padding: "8px 26px", transform: `scale(${1 + 0.05 * Math.max(0, Math.sin(t * 5))})` }} />
      </div>
      {/* cursor */}
      <svg width={46} height={56} viewBox="0 0 24 30" style={{ position: "absolute", left: cx, top: cy, transform: `scale(${clicked && t < A.close + 0.25 ? 0.85 : 1})`, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" }}>
        <path d="M2 2 L2 24 L8 18.5 L12 27 L15.5 25.5 L11.6 17 L19.5 17 Z" fill="#111" stroke="#FFF" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      {stamp ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", ...pop(t, A.mistake - 0.1, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 64, color: "#FFF", background: RED, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-3deg)" }}>That's the mistake</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · the recruiter's shortlist ----------
const Shortlist: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.recruiter - 0.2;
  const inn = sp(t, t0, 14, 160);
  const declined = t > A.no - 0.1;
  const back = t > A.shortlist - 0.1;
  const rep = t > A.replied - 0.25;
  const calling = t > A.replied + 0.25;
  const rows: { n: string; name: string; ch: string; status: string; tone: "red" | "green" | "grey" | "none" }[] = [
    { n: "1", name: "Jordan P.", ch: "J", status: declined ? (t > A.quits - 0.05 ? "Said no / left" : "Said no") : "Offer sent", tone: declined ? "red" : "none" },
    { n: "2", name: "Alex R.", ch: "A", status: rep ? "Replied ✉" : "Rejected", tone: rep ? "green" : "grey" },
    { n: "3", name: "Priya K.", ch: "P", status: "Rejected · no reply", tone: "grey" },
  ];
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, fontFamily: fonts.bold, fontSize: 64, lineHeight: 1.05, color: TH.ink }}>My <span style={{ color: GREEN }}>shortlist.</span></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 160, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 30, padding: "18px 26px", boxShadow: "0 16px 38px rgba(0,0,0,0.08)" }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: TH.dim, marginBottom: 8 }}>Marketing Executive · final round</div>
        {rows.map((r, i) => {
          const hi = r.tone === "green";
          const dim = i > 0 && !back ? 0.45 : r.tone === "grey" && back ? 0.5 : 1;
          return (
            <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 14px", borderRadius: 20, marginTop: 6, background: hi ? TH.accentSoft : "transparent", border: hi ? `3px solid ${GREEN}` : "3px solid transparent", opacity: dim, transform: hi ? `scale(${1 + 0.03 * sp(t, A.replied - 0.25)})` : undefined }}>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: TH.dim, width: 30 }}>{r.n}</span>
              <Avatar ch={r.ch} bg={hi ? GREEN : "#E7ECEA"} fg={hi ? "#FFF" : "#5D6965"} size={58} />
              <span style={{ flex: 1, fontFamily: fonts.bold, fontSize: 36, color: TH.ink, textDecoration: r.tone === "red" ? "line-through" : undefined, textDecorationColor: RED }}>{r.name}</span>
              <Chip text={r.status} size={26} bg={r.tone === "red" ? "#FDE4E4" : hi ? GREEN : "#EEF1F0"} fg={r.tone === "red" ? RED : hi ? "#FFF" : TH.dim} />
            </div>
          );
        })}
      </div>
      {calling ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...pop(t, A.replied + 0.25, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 52, color: DARK, background: MINT, borderRadius: 22, padding: "10px 30px", display: "inline-block", transform: `rotate(-2deg) translateX(${Math.sin(t * 40) * (t < A.replied + 0.9 ? 3 : 0)}px)` }}>📞 Calling Alex…</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 3 · real claude.ai chat (strip.png, 705 px wide), scrolled in sync ----------
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
  const t0 = A.reply - 0.1;
  const asks: [number, string][] = [[A.thank - 0.1, "1 · Thank them"], [A.keen - 0.25, "2 · Still keen"], [A.thing - 0.3, "3 · One thing to improve"]];
  const showAsks = t < A.get - 0.2;
  return (
    <AbsoluteFill>
      <ScrollShot t={t} t0={t0} src={shot("strip.png")} sw={825} keys={[[A.paste, 40], [A.three, 110], [A.get - 0.3, 170], [A.get + 0.3, 620], [A.grateful + 0.5, 700]]} />
      <Tag t={t} t0={t0} text={t < A.get - 0.3 ? "Paste the rejection" : "Claude's reply"} />
      {showAsks ? (
        <div style={{ position: "absolute", left: 30, bottom: 34, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          {asks.map(([a, s]) => (t > a ? <div key={s} style={pop(t, a, 0.6)}><Chip text={s} size={36} bg={GREEN} style={{ padding: "8px 22px", boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }} /></div> : null))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 4 · send it within a day; most people never reply ----------
const SendIt: React.FC<{ t: number }> = ({ t }) => {
  const t0 = A.send - 0.1;
  const inn = sp(t, t0, 14, 160);
  const nv = t > A.never - 0.1;
  const wk = t > A.works - 0.6;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - inn) * 500}px)` }}>
      <div style={{ position: "absolute", left: 40, top: 40, fontFamily: fonts.bold, fontSize: 66, color: TH.ink }}>Send it <span style={{ color: GREEN }}>within a day.</span></div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 160, background: "#FFF", border: `3px solid ${TH.line}`, borderRadius: 26, padding: "22px 28px", display: "flex", alignItems: "center", gap: 20, ...pop(t, t0 + 0.1, 0.8) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 34, color: "#FFF", background: GREEN, borderRadius: 999, width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
        <div><div style={{ fontFamily: fonts.bold, fontSize: 36, color: TH.ink }}>Sent to Sarah Mitchell</div><div style={{ fontFamily: fonts.semibold, fontSize: 26, color: TH.dim }}>Re: Marketing Executive role · 3 lines</div></div>
      </div>
      {nv ? (
        <div style={{ position: "absolute", left: 50, right: 50, top: 330, ...pop(t, A.never - 0.1, 0.85) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim, marginBottom: 14 }}>Rejected candidates who reply:</div>
          <div style={{ display: "flex", gap: 14 }}>
            {Array.from({ length: 10 }, (_, i) => {
              const on = i === 9;
              const s = sp(t, A.never + i * 0.05, 12, 220);
              return <div key={i} style={{ width: 80, height: 80, borderRadius: "50%", background: on ? GREEN : "#E3E8E6", color: on ? "#FFF" : "#9AA5A0", fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.5 + 0.5 * s})`, border: on ? `4px solid ${MINT}` : undefined }}>{on ? "✉" : ""}</div>;
            })}
          </div>
          <div style={{ marginTop: 12, fontFamily: fonts.semibold, fontSize: 26, color: GREEN, textAlign: "right" }}>you</div>
        </div>
      ) : null}
      {wk ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", ...pop(t, A.works - 0.6, 0.5) }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 58, color: "#FFF", background: GREEN, borderRadius: 22, padding: "8px 30px", display: "inline-block", transform: "rotate(-2deg)" }}>That's why it works</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 5 · guide PDF scroll (Comment REPLY → end) ----------
const GUIDE_PAGES = 5;
const PAGES = Array.from({ length: GUIDE_PAGES }, (_, i) => staticFile(`bxrp-guide/guide-page-${i + 1}.png`));
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
          <div style={{ fontFamily: fonts.semibold, fontSize: 25, color: "#FFF" }}>reply-guide.pdf</div>
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
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#FFF", background: DARK, borderRadius: 14, padding: "10px 20px", display: "inline-block" }}>Comment <span style={{ color: MINT }}>REPLY</span></span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, t0 + 0.6) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: GREEN, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(-6deg)" }}>prompt + message</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 760, ...pop(t, t0 + 1.0) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 30, color: DARK, background: MINT, borderRadius: 14, padding: "10px 18px", display: "inline-block", transform: "rotate(5deg)" }}>free · via DM</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master ----------
export const BXRPMain: React.FC<{ avatarSrc?: string; splitSrcTop?: number; focusX?: number }> = ({ avatarSrc = "render-bxrp-tightened.mp4", splitSrcTop = 570, focusX = 0.5 }) => {
  const t = useTime();
  const dark = t >= A.reply - 0.1 && t < A.send - 0.1;
  const scenes: [number, React.FC<{ t: number }>][] = [
    [0, Hook], [A.recruiter - 0.2, Shortlist], [A.reply - 0.1, Claude], [A.send - 0.1, SendIt], [A.comment - 0.1, GuideScroll],
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
