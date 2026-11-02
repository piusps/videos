import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { HOOK_THEMES, Pile, SlotCounter, setHookLocale } from "../components/HookKit";
import { AvatarSrc, serifItalic } from "../components/PanelKit";
import { C, ClaudeMark, prog, typed } from "../components/ClaudeKit";

// Felix × boilr · BX-C "Claude for Recruiters" Ep. 3 · runs/bx-job-cuts (job cuts → teams, not names).
// Every B-Roll is a split (panel on top, Felix below) so the speaker is always in frame (facecheck gate).
// Dopamine level: medium (BX-C = FP-N level), boilr green, gold only for money.
// Table rows = real public news, checked 2026-10-10 (runs/bx-job-cuts/klickpfad/claude-ablauf.md):
// KPMG UK (Irish Times 15 Sep 2026), Admiral (ITV / Metaintro 23-24 Sep 2026), Carlsberg Britvic (The Grocer 8 Oct 2026).
// No person names anywhere. Open roles in step 2 are invented examples.

const TH = HOOK_THEMES.boilr;
setHookLocale("en-GB");
const MINT = "#5FD3A0";
const GREEN = "#0A5F45";
const RED = "#E5484D";
const W = 1080;
const H = 1920;
const PF = 0.48; // panel fraction (speaker area 52 %, Henri framing rule)
const PH = Math.round(H * PF);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

// global timeline (tightened, s) of the countdown: 45 days at 0 s, "last" at LAST_AT → too late
const LAST_AT = 14.0;
const daysLeft = (tg: number, last = LAST_AT) => (tg >= last ? 0 : 45 - 39 * (tg / last));

const useTime = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
const useSoft = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, damping = 14, stiffness = 150) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness, mass: 0.7 } });
};
const resolve = (s: string) => (/^(https?:|file:)/.test(s) ? s : staticFile(s));

const DEFAULT_AV: AvatarSrc = { src: "render-bxjc-p1.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 };

/** Split shell: panel on top (PF of the height), Felix below with a fixed framing; last 0.3 s the panel fades and
 * the speaker grows to the plain full frame (invisible cut back to the talking head). */
const Split: React.FC<{ avatar: AvatarSrc; dark?: boolean; children: React.ReactNode }> = ({ avatar, dark, children }) => {
  setHookLocale("en-GB");
  const t = useTime();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = durationInFrames / fps;
  const k = ramp(t, seconds - 0.3, seconds, Easing.inOut(Easing.cubic));
  const s0 = avatar.scale ?? 1;
  const f = avatar.focus ?? DEFAULT_AV.focus!;
  const h0 = H - PH;
  const vw0 = W * s0;
  const vh0 = H * s0;
  const left0 = Math.min(0, Math.max(W - vw0, W / 2 - f.x * vw0));
  const top0 = Math.min(0, Math.max(h0 - vh0, h0 * (avatar.faceAt ?? 0.6) - f.y * vh0));
  const vw = vw0 + (W - vw0) * k;
  const vh = vh0 + (H - vh0) * k;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: left0 * (1 - k), top: (PH + top0) * (1 - k), width: vw, height: vh }}>
        <OffthreadVideo src={resolve(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: dark ? C.bg : TH.bg, opacity: 1 - k, transform: `scale(${1 + 0.04 * k})`, transformOrigin: "50% 30%", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
        {!dark ? (
          <>
            <div style={{ position: "absolute", inset: -80, backgroundImage: `radial-gradient(${TH.grid} 2px, transparent 2.5px)`, backgroundSize: "36px 36px", transform: `translate(${(t * 14) % 36}px, ${(t * 22) % 36}px)` }} />
            <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", left: -200 + Math.sin(t * 0.7) * 140, top: 100 + Math.cos(t * 0.5) * 100, background: `radial-gradient(circle, ${TH.accentSoft}AA 0%, transparent 65%)` }} />
          </>
        ) : null}
        {children}
        {/* thin boilr-green seam */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} />
      </div>
    </AbsoluteFill>
  );
};

/** Gentle camera drift for panel content. */
const Drift: React.FC<{ children: React.ReactNode; amt?: number }> = ({ children, amt = 1 }) => {
  const t = useTime();
  return <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 0.9) * 6 * amt}px, ${Math.sin(t * 1.3) * 4 * amt}px) scale(${1 + 0.012 * amt * t})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>;
};

// ---------- countdown card (45-day consultation window) ----------
const Countdown: React.FC<{ tg: number; t: number; enterAt: number; y: number; x?: number; w?: number; label?: string; lastAt?: number }> = ({ tg, t, enterAt, y, x = 60, w = 960, label = "Consultation window", lastAt = LAST_AT }) => {
  const LAST = lastAt;
  const soft = useSoft();
  const e = soft(enterAt, 13, 130);
  const d = daysLeft(tg, LAST);
  const late = tg >= LAST;
  const flash = late ? Math.max(0, 1 - (tg - LAST) / 0.5) : 0;
  const shake = late ? Math.sin(t * 60) * 10 * flash : 0;
  const dayInt = Math.ceil(d);
  // tick pop on every whole day
  const frac = d - Math.floor(d);
  const tick = late ? 0 : Math.max(0, frac - 0.75) * 4;
  const col = late ? RED : d < 15 ? "#C98A1A" : GREEN;
  const lateS = late ? spring({ frame: Math.round((tg - LAST) * 25), fps: 25, config: { damping: 11, stiffness: 180, mass: 0.6 } }) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translateX(${(1 - e) * 1100 + shake}px) rotate(${(1 - e) * 5}deg)`, background: TH.card, borderRadius: 30, border: `2.5px solid ${late ? RED : TH.line}`, boxShadow: late ? `0 0 0 ${8 * flash}px ${RED}33, 0 18px 40px rgba(0,0,0,0.10)` : "0 18px 40px rgba(0,0,0,0.08)", padding: "22px 32px 26px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: TH.dim }}>{label}</span>
        <span style={{ fontFamily: serifItalic, fontSize: 66, lineHeight: 1, color: col, transform: `scale(${1 + 0.1 * tick})`, display: "inline-block" }}>
          {late ? <span style={{ fontFamily: fonts.bold, fontStyle: "normal", fontSize: 52, letterSpacing: 1, display: "inline-block", transform: `scale(${0.6 + 0.4 * lateS})` }}>TOO LATE</span> : `${dayInt} days left`}
        </span>
      </div>
      <div style={{ height: 34, borderRadius: 17, background: TH.bg, border: `1.5px solid ${late ? RED : TH.line}`, overflow: "hidden", position: "relative", marginTop: 14 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(1.5, (d / 45) * 100)}%`, borderRadius: 17, background: late ? RED : `linear-gradient(90deg, ${GREEN}, ${col})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: `${((t * 0.8) % 1.3) * 100 - 20}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
        </div>
        {/* day ticks */}
        {[15, 30].map((m) => <div key={m} style={{ position: "absolute", top: 0, bottom: 0, left: `${(m / 45) * 100}%`, width: 3, background: "rgba(255,255,255,0.8)" }} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: fonts.medium, fontSize: 24, color: TH.dim }}>
        <span>Job board CVs</span>
        <span>Announcement · day 1</span>
      </div>
    </div>
  );
};

const Chip: React.FC<{ text: string; t: number; at: number; color?: string; bg?: string; size?: number; dark?: boolean }> = ({ text, t, at, color, bg, size = 28, dark }) => {
  const soft = useSoft();
  const a = soft(at, 10, 220);
  if (t < at - 0.05) return null;
  return (
    <span style={{ display: "inline-block", fontFamily: fonts.semibold, fontSize: size, color: color ?? (dark ? C.text : TH.ink), background: bg ?? (dark ? "#30302E" : TH.card), border: `1.5px solid ${dark ? C.panelBorder : TH.line}`, borderRadius: 999, padding: "7px 20px", transform: `scale(${a})`, opacity: Math.min(1, a * 2), boxShadow: dark ? undefined : "0 6px 16px rgba(0,0,0,0.06)" }}>
      {text}
    </span>
  );
};

// ---------- 1 · Hook: 200 job cuts + 45-day countdown from frame 0 ----------
export const BXJHook: React.FC<{ avatar?: AvatarSrc; t0?: number; govAt?: number; lastAt?: number; seconds?: number }> = ({ avatar = DEFAULT_AV, t0 = 0, govAt = 5.75, lastAt = LAST_AT }) => {
  const t = useTime();
  const tg = t0 + t;
  const soft = useSoft();
  const chip = soft(1.5, 12, 170);
  const top = 535; // below the pipeline's text-hook box (bottom ≈ 510 px)
  const gov = soft(govAt, 11, 200); // on "45 days"
  return (
    <Split avatar={avatar}>
      <Drift>
        <div style={{ position: "absolute", left: 60, top, display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ transform: "scale(0.66)", transformOrigin: "0 50%", width: 370, height: 112 }}>
            <SlotCounter t={t} from={0} to={200} start={0.05} dur={1.2} th={TH} seconds={6.5} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: -50, transform: `translateX(${(1 - chip) * 700}px)`, opacity: Math.min(1, chip * 2) }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 40, color: TH.ink, letterSpacing: -0.5 }}>roles at risk</span>
            <span style={{ fontFamily: fonts.medium, fontSize: 24, color: TH.dim }}>one UK company · example</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 318, top: top + 84, display: "flex", gap: 6 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const at = 0.15 + i * 0.06;
            const a = soft(at, 10, 220);
            const look = soft(3.2 + i * 0.12, 12, 180); // they start to wake up / look around
            return <div key={i} style={{ width: 24, height: 24, borderRadius: 12, background: look > 0.5 ? MINT : "#C9D2CD", border: `3px solid ${look > 0.5 ? GREEN : "#AEB9B3"}`, transform: `scale(${a * (1 + 0.15 * Math.max(0, 1 - Math.abs(look - 0.6) * 3))})`, opacity: Math.min(1, a * 2) }} />;
          })}
        </div>
        <Countdown tg={tg} t={t} enterAt={-0.2} y={top + 132} label="UK law: 45-day consultation" lastAt={lastAt} />
        <div style={{ position: "absolute", left: 52, top: top + 124, width: 976, height: 206, borderRadius: 34, border: `6px solid ${MINT}`, boxShadow: `0 0 26px ${MINT}88`, opacity: gov > 0.02 ? Math.min(1, gov) : 0, transform: `scale(${1.04 - 0.04 * Math.min(1, gov)})` }} />
      </Drift>
    </Split>
  );
};

// ---------- 2 · £11,000 per placement + countdown runs out on "last" ----------
export const BXJMoney: React.FC<{ avatar?: AvatarSrc; t0?: number; lockAt?: number; boardsAt?: number; lastAt?: number; seconds?: number }> = ({ avatar = DEFAULT_AV, t0 = 7.29, lockAt = 2.05, boardsAt, lastAt = LAST_AT }) => {
  const t = useTime();
  const tg = t0 + t;
  const soft = useSoft();
  const card = soft(0.05, 13, 140);
  const boards = soft(boardsAt ?? lastAt - t0 - 1.35, 12, 200); // on "job boards"
  const cx = 200;
  const cy = 300;
  return (
    <Split avatar={avatar}>
      <Drift>
        {/* coins around the £ tile, medium density */}
        <Pile t={t} kind="coins" every={0.55} cx={cx} cy={cy} th={TH} seconds={lockAt + 4.5} size={0.5} stackDx={[-150, -100, 100, 150]} front={[1, 2]} dropFrom={-60} floor={cy + 70} gravity={5200} />
        <div style={{ position: "absolute", left: cx - 60, top: cy - 60, width: 120, height: 120, borderRadius: 32, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 70, color: "#FFF", boxShadow: "0 18px 40px rgba(0,0,0,0.16), inset 0 -6px 0 rgba(0,0,0,0.1)", transform: `scale(${(0.7 + 0.3 * card) * (1 + 0.02 * Math.sin(t * 3))}) rotate(${Math.sin(t * 1.7) * 3}deg)` }}>£</div>
        {/* the £11,000 card */}
        <div style={{ position: "absolute", left: 370, top: 110, width: 670, background: TH.card, borderRadius: 30, border: `2px solid ${TH.line}`, boxShadow: "0 20px 44px rgba(0,0,0,0.09)", padding: "22px 28px 22px", boxSizing: "border-box", transform: `translateX(${(1 - card) * 900}px) rotate(${(1 - card) * 5}deg)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: TH.dim }}>One placement</span>
            <Chip text="Example" t={t} at={0.5} size={22} />
          </div>
          <div style={{ transform: "scale(0.66)", transformOrigin: "0 0", width: 800, height: 118, marginTop: 10 }}>
            <SlotCounter t={t} from={0} to={11000} start={lockAt - 1.3} dur={1.3} prefix="£" th={TH} seconds={7} />
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: TH.ink, marginTop: 6, opacity: ramp(t, lockAt + 0.1, lockAt + 0.4) }}>
            20 % × £55k salary <span style={{ color: TH.dim }}>· in commission</span>
          </div>
        </div>
        <Countdown tg={tg} t={t} enterAt={0.35} y={480} label="45-day window" lastAt={lastAt} />
        {/* "job boards": where the slow agencies wait (end of the window) */}
        <div style={{ position: "absolute", left: 60, top: 735, display: "flex", gap: 12, alignItems: "center", transform: `scale(${boards})`, transformOrigin: "0 50%", opacity: Math.min(1, boards * 2) }}>
          <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: tg >= lastAt ? RED : TH.dim }}>Agencies on job boards meet them here</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: tg >= lastAt ? RED : TH.dim, transform: `translateX(${Math.sin(t * 6) * 4}px)` }}>←</span>
        </div>
      </Drift>
    </Split>
  );
};

// ---------- Claude-style building blocks (dark, English) ----------
const Bubble: React.FC<{ text: string; appear: number; y: number; size?: number }> = ({ text, appear, y, size = 30 }) => (
  <div style={{ position: "absolute", right: 40, top: y, maxWidth: 900, backgroundColor: C.userBubble, borderRadius: 26, padding: "18px 26px", fontFamily: fonts.regular, fontSize: size, lineHeight: 1.35, color: C.text, opacity: appear, transform: `translateY(${(1 - appear) * 20}px)` }}>{text}</div>
);
const Status: React.FC<{ text: string; appear: number; y: number }> = ({ text, appear, y }) => (
  <div style={{ position: "absolute", left: 50, top: y, fontFamily: fonts.regular, fontSize: 27, color: C.dim, opacity: appear, display: "flex", gap: 12, alignItems: "center" }}>
    <ClaudeMark size={28} /> {text} ›
  </div>
);
const HEAD = 66;
type Col = { h: string; w: number; strike?: boolean };
const Table: React.FC<{ x: number; y: number; cols: Col[]; rows: string[][]; appear: number[]; rowH: number; size?: number; linkCol?: number; strikeP?: number; dimRows?: number[] }> = ({ x, y, cols, rows, appear, rowH, size = 29, linkCol, strikeP = 0, dimRows = [] }) => (
  <div style={{ position: "absolute", left: x, top: y, border: `2px solid ${C.panelBorder}`, borderRadius: 16, overflow: "hidden", backgroundColor: "#1F1E1D" }}>
    <div style={{ display: "flex", height: HEAD, alignItems: "center", borderBottom: `2px solid ${C.panelBorder}`, backgroundColor: "#2A2927" }}>
      {cols.map((c) => (
        <div key={c.h} style={{ width: c.w, padding: "0 20px", boxSizing: "border-box", fontFamily: fonts.semibold, fontSize: size, color: c.strike ? interpolateColor(strikeP) : C.text, position: "relative" }}>
          {c.h}
          {c.strike ? <div style={{ position: "absolute", left: 14, top: "52%", height: 6, borderRadius: 3, width: `${strikeP * 70}%`, background: RED }} /> : null}
        </div>
      ))}
    </div>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", height: rowH, alignItems: "center", borderTop: i ? `2px solid ${C.panelBorder}` : undefined, opacity: appear[i] ?? 1, transform: `translateY(${(1 - (appear[i] ?? 1)) * 18}px)` }}>
        {r.map((cell, j) => (
          <div key={j} style={{ width: cols[j].w, padding: "0 20px", boxSizing: "border-box", fontFamily: j === 0 ? fonts.semibold : fonts.regular, fontSize: size, lineHeight: 1.28, color: dimRows.includes(i) ? C.dim : j === linkCol ? "#7FA8F5" : C.text, textDecoration: j === linkCol && !dimRows.includes(i) ? "underline" : undefined, position: "relative" }}>
            {cols[j].strike ? (
              <>
                <div style={{ height: 22, width: 180, borderRadius: 11, background: "#4A4945", filter: "blur(3px)", opacity: 1 - 0.6 * strikeP }} />
                <div style={{ position: "absolute", left: 14, top: "50%", height: 5, borderRadius: 3, width: `${strikeP * 70}%`, background: RED }} />
              </>
            ) : (
              cell
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);
const interpolateColor = (p: number) => (p > 0.5 ? RED : C.text);
const rowTop = (y: number, i: number, rowH: number) => y + 2 + HEAD + 2 + i * (rowH + 2);
const GFrame: React.FC<{ x: number; y: number; w: number; h: number; t: number; at: number; until?: number; color?: string }> = ({ x, y, w, h, t, at, until = 99, color = MINT }) => {
  if (t < at || t > until) return null;
  const p = prog(t, at, at + 0.22);
  return <div style={{ position: "absolute", left: x - 8, top: y - 8, width: w + 16, height: h + 16, border: `6px solid ${color}`, borderRadius: 14, opacity: p, transform: `scale(${1.06 - 0.06 * p})`, boxShadow: `0 0 0 4px ${color}38, 0 0 24px ${color}55` }} />;
};

/** Green "teams found" slot counter pill (from Step one on). */
const TeamsFound: React.FC<{ t: number; n: number; at?: number; label?: string }> = ({ t, n, at = 0, label = "teams found" }) => {
  const soft = useSoft();
  const a = soft(at, 11, 200);
  // pop whenever the number changes: approximated by the fractional part of n
  const shown = Math.floor(n);
  const pop = Math.max(0, 1 - (n - shown) * 4);
  return (
    <div style={{ position: "absolute", right: 34, top: 26, display: "flex", alignItems: "center", gap: 14, background: GREEN, borderRadius: 999, padding: "10px 26px 10px 14px", boxShadow: `0 10px 26px rgba(10,95,69,0.45), 0 0 ${18 * pop}px ${MINT}`, transform: `scale(${a * (1 + 0.06 * pop)})`, transformOrigin: "100% 0", opacity: Math.min(1, a * 2), zIndex: 50 }}>
      <div style={{ minWidth: 64, height: 64, borderRadius: 18, background: "#062F23", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 44, color: MINT, padding: "0 10px", boxSizing: "border-box" }}>{shown}</div>
      <span style={{ fontFamily: fonts.bold, fontSize: 32, color: "#FFF" }}>{label}</span>
    </div>
  );
};

// ---------- 3 · Step 1: the prompt, web search, table Company / Teams / City / Source ----------
const N1 = "Find British companies that announced redundancies, relocations or acquisitions in the last 30 days. Give me the company, the teams affected, the city and the source.";
const S1_COLS: Col[] = [
  { h: "Company", w: 230 },
  { h: "Teams", w: 330 },
  { h: "City", w: 200 },
  { h: "Source", w: 240 },
];
const S1_ROWS = [
  ["KPMG UK", "Data & technology, AI, cyber", "HQ: London", "Irish Times"],
  ["Admiral", "UK insurance", "Cardiff", "Metaintro"],
  ["Carlsberg Britvic", "Brewing & logistics", "Burton upon Trent", "The Grocer"],
  ["+ 16 more", "", "", ""],
];
export const BXJStep1: React.FC<{ avatar?: AvatarSrc; teamsAt?: number; cityAt?: number; sourceAt?: number; seconds?: number }> = ({ avatar = DEFAULT_AV, teamsAt = 7.78, cityAt = 8.88, sourceAt = 9.79 }) => {
  const t = useTime();
  const sendAt = 3.9;
  const sent = t >= sendAt;
  const tableY = 352;
  const rh = 100;
  const rowsAt = [5.0, 5.35, 5.7, 6.05];
  const ap = rowsAt.map((a) => prog(t, a, a + 0.28));
  // counter: 1,2,3 with the rows, then rolls up to 19 with the "+16 more" row
  const n = t < rowsAt[0] ? 0 : t < rowsAt[3] ? Math.min(3, 1 + (t - rowsAt[0]) / 0.35) : Math.min(19.999, 3 + ((t - rowsAt[3]) / 0.9) * 16.999);
  const scroll = sent ? 0 : 0;
  const colX = (i: number) => 40 + 2 + S1_COLS.slice(0, i).reduce((s, c) => s + c.w, 0);
  const frameH = rowTop(tableY, 3, rh) - rowTop(tableY, 0, rh);
  return (
    <Split avatar={avatar} dark>
      <AbsoluteFill style={{ transform: `translateY(${scroll}px)` }}>
        {!sent ? (
          <div style={{ position: "absolute", left: 40, top: 150, width: 1000, minHeight: 300, backgroundColor: C.panel, border: `2px solid ${C.panelBorder}`, borderRadius: 30, padding: "28px 30px", boxSizing: "border-box", boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}>
            <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.36, color: C.text, minHeight: 200 }}>
              {typed(N1, t, 0.2, 3.5)}
              {Math.floor(t * 2) % 2 === 0 ? "|" : ""}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, border: `2px solid ${C.panelBorder}`, color: C.text, fontFamily: fonts.regular, fontSize: 46, lineHeight: "54px", textAlign: "center" }}>+</div>
              <div style={{ flex: 1 }} />
              <span style={{ fontFamily: fonts.medium, fontSize: 28, color: C.dim }}>Opus 5.5</span>
              <span style={{ fontFamily: fonts.regular, fontSize: 28, color: C.faint }}>Medium</span>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orange, color: "#fff", fontFamily: fonts.bold, fontSize: 36, lineHeight: "60px", textAlign: "center", transform: `scale(${t > 3.6 ? 0.9 : 1})` }}>↑</div>
            </div>
          </div>
        ) : null}
        {!sent ? <GFrame x={40} y={150} w={1000} h={300} t={t} at={3.5} /> : null}
        {sent ? <Bubble y={112} size={26} text={N1} appear={prog(t, sendAt, sendAt + 0.22)} /> : null}
        {sent ? <Status y={262} text="Searched the web, read a page" appear={prog(t, sendAt + 0.25, sendAt + 0.45)} /> : null}
        {sent ? <div style={{ position: "absolute", left: 50, top: 305, fontFamily: fonts.regular, fontSize: 29, color: C.text, opacity: prog(t, 4.6, 4.9) }}>I found 19 announcements dated 10 Sep to 10 Oct 2026.</div> : null}
        {sent ? <Table x={40} y={tableY} cols={S1_COLS} rows={S1_ROWS} appear={ap} rowH={rh} linkCol={3} dimRows={[3]} /> : null}
        {sent ? <GFrame x={colX(1)} y={rowTop(tableY, 0, rh)} w={S1_COLS[1].w} h={frameH} t={t} at={teamsAt} until={cityAt} /> : null}
        {sent ? <GFrame x={colX(2)} y={rowTop(tableY, 0, rh)} w={S1_COLS[2].w} h={frameH} t={t} at={cityAt} until={sourceAt} /> : null}
        {sent ? <GFrame x={colX(3)} y={rowTop(tableY, 0, rh)} w={S1_COLS[3].w} h={frameH} t={t} at={sourceAt} /> : null}
      </AbsoluteFill>
      <TeamsFound t={t} n={n} at={0.0} />
    </Split>
  );
};

// ---------- 4 · Step 2: paste open roles, which teams fit ----------
const S2_COLS: Col[] = [
  { h: "Company", w: 230 },
  { h: "Team", w: 330 },
  { h: "Matching role", w: 440 },
];
const S2_ROWS = [
  ["KPMG UK", "Data & technology", "Senior data engineer (London)"],
  ["KPMG UK", "Cyber security", "Cyber security consultant"],
  ["Admiral", "UK insurance", "Claims team leader (Cardiff)"],
];
export const BXJStep2: React.FC<{ avatar?: AvatarSrc; seconds?: number }> = ({ avatar = DEFAULT_AV }) => {
  const t = useTime();
  const y = 372;
  const rh = 112;
  const ap = [0.45, 0.75, 1.05].map((a) => prog(t, a, a + 0.25));
  const m = t < 0.45 ? 0 : Math.min(3.999, 1 + (t - 0.45) / 0.3);
  return (
    <Split avatar={avatar} dark>
      <Bubble y={112} size={27} text="Here are my open roles: Senior data engineer (London), Cyber security consultant (London), Claims team leader (Cardiff). Which teams fit?" appear={prog(t, 0, 0.18)} />
      <Status y={318} text="Matching roles to the affected teams" appear={prog(t, 0.15, 0.35)} />
      <Table x={40} y={y} cols={S2_COLS} rows={S2_ROWS} appear={ap} rowH={rh} />
      <GFrame x={40} y={rowTop(y, 0, rh)} w={1000} h={rh} t={t} at={1.5} />
      <TeamsFound t={t} n={m} label="matches" />
    </Split>
  );
};

// ---------- 5 · Step 3: a post that offers help, not a pitch ----------
const POST = "To the KPMG UK data and technology team: if your role is affected by the current consultation, two things are open to you, no strings attached.\n1. A free CV review.\n2. A current list of London firms hiring data engineers right now.\nComment “list” or message me. No sign-up, no sales call.";
export const BXJStep3: React.FC<{ avatar?: AvatarSrc; helpAt?: number; seconds?: number }> = ({ avatar = DEFAULT_AV, helpAt = 1.8 }) => {
  const t = useTime();
  const soft = useSoft();
  const card = soft(0.3, 14, 150);
  const txt = typed(POST, t, 0.45, 2.2);
  const stamp = soft(helpAt + 0.35, 10, 200);
  return (
    <Split avatar={avatar} dark>
      <Bubble y={112} size={28} text="Write a short LinkedIn post for that team that offers help, not a pitch." appear={prog(t, 0, 0.18)} />
      <div style={{ position: "absolute", left: 40, top: 240, width: 1000, height: 600, backgroundColor: "#1F1E1D", border: `2px solid ${C.panelBorder}`, borderRadius: 22, padding: "26px 30px", boxSizing: "border-box", transform: `translateY(${(1 - card) * 60}px)`, opacity: Math.min(1, card * 1.6) }}>
        <div style={{ fontFamily: fonts.regular, fontSize: 33, lineHeight: 1.42, color: C.text, whiteSpace: "pre-wrap" }}>{txt}</div>
        <div style={{ position: "absolute", right: 22, bottom: 20, fontFamily: fonts.medium, fontSize: 26, color: C.text, border: `2px solid ${C.panelBorder}`, borderRadius: 12, padding: "6px 16px", background: "#2A2927" }}>⧉ Copy</div>
      </div>
      <GFrame x={40} y={240} w={1000} h={600} t={t} at={helpAt} />
      <div style={{ position: "absolute", right: 70, top: 712, transform: `scale(${stamp}) rotate(-6deg)`, opacity: Math.min(1, stamp * 2), fontFamily: fonts.bold, fontSize: 40, color: "#062F23", background: MINT, borderRadius: 14, padding: "10px 24px", boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>
        ✓ Help, not a pitch
      </div>
      <TeamsFound t={t} n={19} label="teams found" />
    </Split>
  );
};

// ---------- 6 · The trick: search teams, never names. Public news only. ----------
const T_COLS: Col[] = [
  { h: "Company", w: 260 },
  { h: "Team", w: 400 },
  { h: "Name", w: 340, strike: true },
];
const T_ROWS = [
  ["KPMG UK", "Data & technology", ""],
  ["Admiral", "UK insurance", ""],
  ["Carlsberg Britvic", "Brewing & logistics", ""],
];
export const BXJTrick: React.FC<{ avatar?: AvatarSrc; teamsAt?: number; neverAt?: number; newsAt?: number; seconds?: number }> = ({ avatar = DEFAULT_AV, teamsAt = 0.53, neverAt = 1.25, newsAt = 2.33 }) => {
  const t = useTime();
  const soft = useSoft();
  const y = 120;
  const rh = 104;
  const strikeP = prog(t, neverAt, neverAt + 0.35);
  const stamp = soft(newsAt, 9, 220);
  const ap = [0, 0.12, 0.24].map((a) => prog(t, a, a + 0.22));
  const shake = Math.sin(t * 55) * 6 * Math.max(0, 1 - Math.abs(t - neverAt - 0.35) / 0.25);
  return (
    <Split avatar={avatar} dark>
      <div style={{ position: "absolute", left: 50, top: 36, fontFamily: fonts.bold, fontSize: 46, color: C.text }}>Search teams, <span style={{ color: strikeP > 0.3 ? RED : C.text }}>never names</span></div>
      <div style={{ transform: `translateX(${shake}px)` }}>
        <Table x={40} y={y} cols={T_COLS} rows={T_ROWS} appear={ap} rowH={rh} strikeP={strikeP} />
      </div>
      <GFrame x={40 + 2 + 260} y={rowTop(y, 0, rh)} w={400} h={rowTop(y, 3, rh) - rowTop(y, 0, rh)} t={t} at={teamsAt} />
      <div style={{ position: "absolute", left: 40, top: 610, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ transform: `scale(${stamp}) rotate(-4deg)`, opacity: Math.min(1, stamp * 2), fontFamily: fonts.bold, fontSize: 44, letterSpacing: 1, color: "#062F23", background: MINT, borderRadius: 14, padding: "12px 26px", boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>PUBLIC NEWS ONLY</div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 720, display: "flex", gap: 14 }}>
        <Chip text="Irish Times ↗" t={t} at={newsAt + 0.2} dark />
        <Chip text="Metaintro ↗" t={t} at={newsAt + 0.35} dark />
        <Chip text="The Grocer ↗" t={t} at={newsAt + 0.5} dark />
      </div>
    </Split>
  );
};

export const bxjMeta = ({ props }: { props: { seconds?: number } }) => (props.seconds ? { durationInFrames: Math.round(props.seconds * 25) } : {});
