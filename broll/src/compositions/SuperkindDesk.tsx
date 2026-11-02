import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLogo } from "../components/BrandMarks";
import { colors, fonts } from "../theme";
import words from "../../runs/superkind-desk/words.json";

// Superkind company reel "Desk" (2026-10-20), modelled on @_heyclicky's "i wanna be a good agent":
// split screen — top: the app, bottom: Pius' own keyboard footage (IMG_7427/7428) with a soft film grade.
// v10 (Pius, 2026-10-21): sleek + minimal like the Claude app, rebranded as Superkind. One calm column: agent text streams
// in sync with Ava (serif), Florent's short replies as bubbles, results as quiet cards. No sidebar, no avatars, no button rows.
// Starts directly with Superkind's proactive line (no Florent hook). After Enter the hand rests (own-ret-m9), no stray keys.
// Older versions: v7 (64 s funnel) / v8 (Outlook) / v9 (Teams) as runs/superkind-desk/SuperkindDesk-v*.tsx.bak.

const D = "superkind-desk/";
export const SD_FPS = 25;
export const SD_SECONDS = 31.9;
const TOP_H = 960;
const ACC = colors.accent;
const INK = "#1D1D1F"; // Apple label
const MUTED = "#86868B";
const LINE = "rgba(0,0,0,0.08)";
const GREEN = "#28A745";
const TEAMS = "#5B5FC7";
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif';
const sf = (size: number, weight = 400, color = INK, extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: SF, fontSize: size, fontWeight: weight, color, letterSpacing: size >= 28 ? -0.02 * size : -0.01 * size, ...extra });

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useSec = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const seq = (a: number, b: number) => ({ from: Math.round(a * SD_FPS), durationInFrames: Math.max(1, Math.round((b - a) * SD_FPS)) });
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const pop = (t: number, a: number) => k(t, a, 0.45, Easing.out(Easing.back(1.5)));

type Wd = { text: string; s: number; e: number; sp: "n" | "a" };
const WORDS = words as Wd[];
const wordAt = (txt: string, after = 0) => WORDS.find((w) => w.s >= after && w.text.toLowerCase().startsWith(txt.toLowerCase()))?.s ?? after;

// Key moments (seconds). Voice placement lives in runs/superkind-desk/build-voice-v9.py.
const T = {
  a1: 0.35, ask: wordAt("Soll", 0),
  press1: 6.35, stop1: 8.3, sched: 8.5, done1: 8.75,
  close: 8.95, lidShut: 9.6, roll: 10.1, notif: 10.6, morning: 11.0, lidUp: 11.95, list: 12.05,
  press2: 16.8, stop2: 20.15, drafts: 20.3, draftsDone: 21.6, approve: 21.9, enter: 23.3,
  outcome: 23.85, next: 27.45, end: 28.5,
};
const T_FIX1 = wordAt("drei", 23), T_FIX2 = wordAt("zwei", 23);
const T_14 = wordAt("14", 12), T_81 = wordAt("81", 12);
const T_4X = wordAt("viermal", 0);

const SkMark: React.FC<{ size: number; white?: boolean }> = ({ size, white }) => (
  <Img src={staticFile("superkind-logo.svg")} style={{ width: size, height: size, objectFit: "contain", filter: white ? "invert(1)" : undefined, display: "block" }} />
);
// Superkind as a Teams contact: round avatar + presence
const SkAvatar: React.FC<{ size?: number; presence?: boolean }> = ({ size = 40, presence = true }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <div style={{ width: size, height: size, borderRadius: size / 2, background: "linear-gradient(150deg,#FF9466,#FF6B35 55%,#E8541F)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 6px rgba(232,84,31,0.3)" }}>
      <SkMark size={size * 0.52} white />
    </div>
    {presence && <div style={{ position: "absolute", right: -1, bottom: -1, width: size * 0.32, height: size * 0.32, borderRadius: size, background: "#6BB700", border: "2.5px solid #fff" }} />}
  </div>
);
const Person: React.FC<{ c: string; bg: string; size?: number }> = ({ c, bg, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, ...sf(size * 0.4, 600, "#fff"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c}</div>
);
const Check: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 30, color = ACC }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * p})`, opacity: p, flexShrink: 0 }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
  </div>
);
const Icon: React.FC<{ d: string; size?: number; color?: string; w?: number }> = ({ d, size = 22, color = "#5E5E66", w = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
// Mac return key cap next to the approve button
const ReturnCap: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const down = t >= at - 0.04 && t < at + 0.14;
  return (
    <div style={{ height: 40, minWidth: 92, borderRadius: 9, background: down ? "#E6E6EA" : "linear-gradient(180deg,#FFFFFF,#F2F2F5)", border: "1px solid rgba(0,0,0,0.12)", boxShadow: down ? "inset 0 2px 3px rgba(0,0,0,0.15)" : "0 2px 0 rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)", transform: `translateY(${down ? 2 : 0}px)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...sf(16, 500, "#3A3A3F"), padding: "0 12px" }}>return <span style={{ fontSize: 18 }}>⏎</span></div>
  );
};

const AppIcon: React.FC<{ size?: number }> = ({ size = 54 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: "linear-gradient(150deg,#FF8A5B,#FF6B35 55%,#E5521F)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)", flexShrink: 0 }}>
    <SkMark size={size * 0.58} white />
  </div>
);


// ---------- data ----------

const CUSTOMERS = [
  { co: "Schreinerei Hofmann", last: "14.06.", rev: "9.800 €" },
  { co: "Elektro Krause", last: "02.07.", rev: "12.400 €" },
  { co: "Autohaus Brandt", last: "30.05.", rev: "11.900 €" },
  { co: "Hotel Seeblick", last: "08.07.", rev: "8.900 €" },
  { co: "Gartenbau Vogel", last: "25.06.", rev: "7.200 €" },
];
const N_ALL = 14;

// ---------- Claude-style app, branded Superkind ----------

const BG = "#FAF9F6"; // warm ivory
const SERIF = 'ui-serif, "New York", "Iowan Old Style", Georgia, serif';
const serif = (size: number, weight = 400, color = INK, extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: SERIF, fontSize: size, fontWeight: weight, color, letterSpacing: -0.005 * size, ...extra });
const COL_L = 92, COL_R = 92; // content column
const TOP_BAR = 72;
const COMPOSER_H = 116;
const MSG_TOP = TOP_BAR, MSG_BOT = TOP_H - COMPOSER_H - 70;

// agent text streams word by word with Ava's voice (from words.json); unspoken words keep their space (fixed layout)
const Stream: React.FC<{ t: number; a: number; b: number; style: React.CSSProperties; bold?: (w: string, i: number) => boolean }> = ({ t, a, b, style, bold }) => {
  const ws = WORDS.filter((w) => w.sp === "a" && w.s >= a && w.s < b);
  return (
    <div style={style}>
      {ws.map((w, i) => {
        const p = k(t, w.s - 0.06, 0.18);
        return <span key={i} style={{ opacity: p, fontWeight: bold?.(w.text, i) ? 600 : undefined }}>{w.text}{i < ws.length - 1 ? " " : ""}</span>;
      })}
    </div>
  );
};
const Typed: React.FC<{ t: number; a: number; text: string; dur?: number; style: React.CSSProperties }> = ({ t, a, text, dur = 0.6, style }) => {
  const ws = text.split(" ");
  return <div style={style}>{ws.map((w, i) => <span key={i} style={{ opacity: k(t, a + (i / ws.length) * dur, 0.15) }}>{w}{i < ws.length - 1 ? " " : ""}</span>)}</div>;
};

// Superkind's turn marker (like Claude's spark): small orange mark + name, no avatar bubble
const Turn: React.FC<{ when: string; children: React.ReactNode }> = ({ when, children }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: ACC, display: "flex", alignItems: "center", justifyContent: "center" }}><SkMark size={18} white /></div>
      <div style={sf(17, 600)}>Superkind</div>
      <div style={sf(16, 400, MUTED)}>{when}</div>
    </div>
    {children}
  </div>
);
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 30px rgba(40,30,20,0.05)", padding: "22px 26px", ...style }}>{children}</div>
);
const You: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <div style={{ background: "#EFECE6", borderRadius: 24, padding: "14px 24px", ...sf(27, 500) }}>{text || "…"}</div>
  </div>
);

const spokenN = (t: number, a: number, b: number) => WORDS.filter((w) => w.sp === "n" && w.s >= a && w.s < b && t >= w.s - 0.02).map((w) => w.text).join(" ");

// --- messages ---

const NoticeMsg: React.FC<{ t: number }> = ({ t }) => (
  <Turn when="gerade eben">
    <Card style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><BrandLogo name="outlook" size={24} /><div style={sf(16, 500, MUTED)}>Outlook · deine Suchen</div></div>
        <div style={{ ...sf(25, 650), marginTop: 8 }}>Kunden ohne Bestellung seit 90 Tagen</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {["30. Sep", "7. Okt", "14. Okt", "heute"].map((d, i) => {
            const p = i === 3 ? pop(t, T_4X) : 1;
            return <div key={d} style={{ padding: "6px 12px", borderRadius: 999, background: i === 3 ? "#FFF0E8" : "#F4F2EE", ...sf(15, i === 3 ? 650 : 500, i === 3 ? ACC : "#55524C"), opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>{d}</div>;
          })}
        </div>
      </div>
      <div style={{ ...sf(80, 700, ACC, { letterSpacing: -2 }), lineHeight: 1 }}>{t >= T_4X ? "4×" : "3×"}</div>
    </Card>
    <Stream t={t} a={0} b={T.ask - 0.01} style={{ ...serif(31, 400, INK, { lineHeight: 1.42 }), marginTop: 22 }} />
    <Stream t={t} a={T.ask - 0.01} b={T.press1} style={{ ...serif(31, 600, INK, { lineHeight: 1.42 }), marginTop: 6 }} />
  </Turn>
);

const SchedMsg: React.FC<{ t: number }> = ({ t }) => (
  <Turn when="16:53">
    <Typed t={t} a={T.sched} text="Mach ich. Ab morgen jeden Tag um 17:00." style={serif(31, 400, INK, { lineHeight: 1.42 })} />
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 14, padding: "9px 16px 9px 10px", borderRadius: 999, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", opacity: k(t, T.done1, 0.3) }}>
      <Check p={k(t, T.done1, 0.35)} size={26} color={GREEN} /><div style={sf(17, 600)}>Routine aktiv · täglich 17:00</div>
    </div>
  </Turn>
);

const DayDivider: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} /><div style={sf(16, 600, MUTED)}>Donnerstag, 17:00</div><div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
  </div>
);

const ListMsg: React.FC<{ t: number }> = ({ t }) => {
  const n14 = Math.round(interpolate(t, [T_14 - 0.3, T_14 + 0.2], [0, 14], clamp));
  const rev = Math.round(interpolate(t, [T_81 - 0.5, T_81 + 0.3], [0, 81.4], clamp) * 10) / 10;
  return (
    <Turn when="17:00">
      <Stream t={t} a={T.list} b={T.press2} style={serif(31, 400, INK, { lineHeight: 1.42 })} />
      <Card style={{ marginTop: 18, padding: "20px 26px 14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
          <div><span style={sf(44, 700, INK, { fontVariantNumeric: "tabular-nums" })}>{n14}</span><span style={{ ...sf(17, 500, MUTED), marginLeft: 8 }}>Kunden</span></div>
          <div><span style={sf(44, 700, INK, { fontVariantNumeric: "tabular-nums" })}>{rev.toLocaleString("de-DE", { minimumFractionDigits: 1 })}k €</span><span style={{ ...sf(17, 500, MUTED), marginLeft: 8 }}>Umsatz 12 Mon.</span></div>
        </div>
        <div style={{ marginTop: 10 }}>
          {CUSTOMERS.map((c, i) => {
            const p = k(t, T.list + 0.5 + i * 0.1, 0.3);
            return (
              <div key={c.co} style={{ display: "flex", alignItems: "center", height: 46, borderTop: "1px solid rgba(0,0,0,0.06)", opacity: p }}>
                <div style={{ ...sf(19, 500), flex: 1 }}>{c.co}</div>
                <div style={{ ...sf(17, 400, MUTED), width: 150 }}>seit {c.last}</div>
                <div style={{ ...sf(19, 600, INK, { fontVariantNumeric: "tabular-nums" }), width: 110, textAlign: "right" }}>{c.rev}</div>
              </div>
            );
          })}
          <div style={{ ...sf(16, 500, MUTED), paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.06)" }}>+ 9 weitere</div>
        </div>
      </Card>
    </Turn>
  );
};

const DraftsMsg: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.round(interpolate(t, [T.drafts + 0.15, T.draftsDone], [1, N_ALL], clamp));
  const sent = t >= T.enter;
  const ap = k(t, T.approve, 0.35);
  return (
    <Turn when="17:03">
      <Stream t={t} a={T.drafts} b={T.outcome - 0.1} style={serif(31, 400, INK, { lineHeight: 1.42 })} />
      <div style={{ position: "relative", marginTop: 18 }}>
        <Card style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrandLogo name="outlook" size={22} />
            <div style={{ ...sf(16, 500, MUTED), flex: 1 }}>An Lena Hofmann · Schreinerei Hofmann</div>
            <div style={sf(16, 600, sent ? GREEN : ACC, { fontVariantNumeric: "tabular-nums" })}>{sent ? "14/14 gesendet" : `${n}/14 Entwürfe`}</div>
          </div>
          <div style={{ ...sf(21, 650), marginTop: 10 }}>Ihre Eichentreppe – alles gut?</div>
          <div style={{ ...serif(19, 400, "#4A4740", { lineHeight: 1.45 }), marginTop: 6 }}>Hallo Frau Hofmann, wie macht sich die Eichentreppe aus dem Juni? Für den Herbst hätten wir noch Termine frei …</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)", opacity: ap }}>
            <div style={{ flex: 1 }} />
            {!sent && <ReturnCap t={t} at={T.enter} />}
            <div style={{ padding: "11px 22px", borderRadius: 12, background: sent ? GREEN : INK, ...sf(18, 600, "#fff"), transform: `scale(${t >= T.enter - 0.04 && t < T.enter + 0.14 ? 0.94 : 1})` }}>{sent ? "✓ Gesendet" : "Alle 14 senden"}</div>
          </div>
        </Card>
      </div>
    </Turn>
  );
};

const OutcomeMsg: React.FC<{ t: number }> = ({ t }) => {
  const rows: [number, string][] = [[T_FIX1, "3 Dubletten zusammengeführt"], [T_FIX2, "2 fehlende Adressen ergänzt"]];
  return (
    <Turn when="17:04">
      <Card style={{ padding: "22px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Check p={k(t, T.outcome + 0.1, 0.35)} size={38} color={GREEN} />
          <div style={sf(38, 700)}>14 Mails sind raus.</div>
        </div>
        {rows.map(([a, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, opacity: k(t, a - 0.05, 0.3), transform: `translateY(${(1 - k(t, a - 0.05, 0.3)) * 8}px)` }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: ACC, marginLeft: 15, marginRight: 15 }} />
            <div style={sf(20, 500, "#3A3732")}>{l}</div>
          </div>
        ))}
        <div style={{ ...sf(17, 500, MUTED), marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)", opacity: k(t, T.next, 0.3) }}>Nächste Liste: morgen, 17:00</div>
      </Card>
    </Turn>
  );
};

// [appear time, height incl. gap, render] — bottom-anchored, each grows in so the column scrolls smoothly
const MESSAGES: [number, number, (t: number) => React.ReactNode][] = [
  [-1, 380, (t) => <NoticeMsg t={t} />],
  [T.stop1 + 0.05, 108, () => <You text={spokenN(99, T.press1, T.stop1 + 0.5)} />],
  [T.sched, 176, (t) => <SchedMsg t={t} />],
  [T.list - 0.3, 78, () => <DayDivider />],
  [T.list, 492, (t) => <ListMsg t={t} />],
  [T.stop2 + 0.05, 108, () => <You text={spokenN(99, T.press2, T.stop2 + 0.5)} />],
  [T.drafts, 380, (t) => <DraftsMsg t={t} />],
  [T.outcome, 300, (t) => <OutcomeMsg t={t} />],
];

const Thread: React.FC<{ t: number }> = ({ t }) => {
  const items = MESSAGES.map(([a, h, r], i) => ({ i, h: a < 0 ? h : h * k(t, a, 0.55, Easing.inOut(Easing.cubic)), p: a < 0 ? 1 : k(t, a + 0.1, 0.4), r }));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: MSG_TOP, height: MSG_BOT - MSG_TOP, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: COL_L, right: COL_R, bottom: 0, display: "flex", flexDirection: "column" }}>
        {items.filter((x) => x.h > 0.5).map((x) => (
          <div key={x.i} style={{ height: x.h, position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, opacity: x.p, transform: `translateY(${(1 - x.p) * 18}px)` }}>{x.r(t)}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - k(t, T.ask - 0.6, 0.6), transform: `translateY(${-k(t, T.ask - 0.6, 0.8, Easing.inOut(Easing.cubic)) * 60}px)` }}>
        <div style={{ width: 58, height: 58, borderRadius: 17, background: ACC, display: "flex", alignItems: "center", justifyContent: "center" }}><SkMark size={34} white /></div>
        <div style={serif(52, 400, INK, { letterSpacing: -0.8 })}>Hallo Florent.</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: `linear-gradient(180deg, ${BG}, rgba(250,249,246,0))` }} />
    </div>
  );
};

const Composer: React.FC<{ t: number }> = ({ t }) => {
  const on = (t >= T.press1 && t < T.stop1) || (t >= T.press2 && t < T.stop2);
  const live = t >= T.press1 && t < T.stop1 ? spokenN(t, T.press1, T.stop1) : t >= T.press2 && t < T.stop2 ? spokenN(t, T.press2, T.stop2) : "";
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: MSG_BOT, height: COMPOSER_H, borderRadius: 28, background: "#fff", border: `1px solid ${on ? "rgba(255,107,53,0.55)" : "rgba(0,0,0,0.09)"}`, boxShadow: on ? "0 0 0 5px rgba(255,107,53,0.10), 0 12px 32px rgba(40,30,20,0.08)" : "0 12px 32px rgba(40,30,20,0.07)", padding: "20px 22px 16px 28px", display: "flex", flexDirection: "column" }}>
      <div style={{ ...sf(24, live ? 500 : 400, live ? INK : "#A8A39A"), whiteSpace: "nowrap", overflow: "hidden", flex: 1 }}>{live || "Schreib Superkind …"}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Icon d="M12 5v14M5 12h14" size={22} color="#8A857D" w={1.8} />
        <div style={{ flex: 1 }} />
        {on ? <Wave t={t} on={speaking(t, "n")} /> : <Icon d="M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v3" size={22} color="#8A857D" w={1.8} />}
        <div style={{ width: 40, height: 40, borderRadius: 12, background: live ? ACC : "#F1C9B5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={20} height={20} viewBox="0 0 24 24"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
};

const speaking = (t: number, sp: "n" | "a") => WORDS.some((w) => w.sp === sp && t >= w.s - 0.03 && t <= w.e + 0.03);
const Wave: React.FC<{ t: number; on: boolean }> = ({ t, on }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 3, height: 26 }}>
    {Array.from({ length: 14 }).map((_, i) => {
      const n = Math.abs(Math.sin(t * 13 + i * 1.7) * Math.cos(t * 7.3 + i * 0.9));
      const v = on ? 0.2 + 0.8 * n : 0.15;
      return <div key={i} style={{ width: 3, height: 26 * v, borderRadius: 2, background: ACC }} />;
    })}
  </div>
);

const TopBar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: TOP_BAR, display: "flex", alignItems: "center", padding: "0 28px", zIndex: 3 }}>
    <div style={{ display: "flex", gap: 9 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85 }} />)}</div>
    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      <SkMark size={20} />
      <div style={sf(17, 600)}>superkind</div>
    </div>
    <div style={{ width: 60 }} />
  </div>
);

// lid closed: just the time passing, nothing else
const Night: React.FC<{ t: number }> = ({ t }) => {
  const p = k(t, T.lidShut + 0.05, 0.35) * (1 - k(t, T.list - 0.2, 0.3));
  if (p <= 0.001) return null;
  const roll = k(t, T.roll, 0.5, Easing.inOut(Easing.cubic));
  const next = t >= T.roll + 0.25;
  return (
    <AbsoluteFill style={{ background: "#0B0A09", opacity: p, zIndex: 60, alignItems: "center", justifyContent: "center" }}>
      <div style={sf(26, 500, "rgba(255,255,255,0.55)")}>{next ? "Donnerstag" : "Mittwoch"}</div>
      <div style={{ height: 190, overflow: "hidden", marginTop: 4 }}>
        <div style={{ transform: `translateY(${-roll * 190}px)` }}>
          {["16:58", "17:00"].map((s) => <div key={s} style={{ ...sf(170, 300, "rgba(255,255,255,0.92)"), lineHeight: "190px", letterSpacing: -5, fontVariantNumeric: "tabular-nums" }}>{s}</div>)}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, opacity: k(t, T.notif, 0.35), transform: `translateY(${(1 - k(t, T.notif, 0.35)) * 12}px)` }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: ACC, display: "flex", alignItems: "center", justifyContent: "center" }}><SkMark size={16} white /></div>
        <div style={sf(22, 500, "rgba(255,255,255,0.85)")}>Deine Liste ist da.</div>
      </div>
    </AbsoluteFill>
  );
};

// gentle camera: slow push-ins on the newest result, mostly still
const CAM: [number, number, number, number][] = [
  [0, 1.07, 540, 420], [5.8, 1.02, 540, 520], [T.lidShut, 1.0, 540, 600],
  [T.list, 1.0, 540, 600], [16.2, 1.05, 540, 520], [T.press2 + 0.4, 1.0, 540, 600],
  [T.drafts + 0.3, 1.0, 540, 600], [T.enter - 0.6, 1.06, 640, 700], [T.enter + 0.6, 1.06, 640, 700], [T.outcome + 0.4, 1.0, 540, 600], [T.end, 1.05, 540, 520],
];

const Screen: React.FC<{ t: number }> = ({ t }) => {
  const at = (i: number) => interpolate(t, CAM.map((x) => x[0]), CAM.map((x) => x[i]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const off = k(t, T.lidShut - 0.15, 0.2) * (1 - k(t, T.list - 0.2, 0.3));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: BG }}>
      <AbsoluteFill style={{ transform: `scale(${at(1)})`, transformOrigin: `${at(2)}px ${at(3)}px` }}>
        <TopBar />
        <Thread t={t} />
        <Composer t={t} />
      </AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: off, zIndex: 58 }} />
      <Night t={t} />
    </AbsoluteFill>
  );
};

// ---------- desk (bottom half) ----------

type Cam = [number, number, number, number][];
const followKey = (a: number, x: number, y: number, press: number): Cam => {
  const k1 = Math.max(a + 0.04, press - 0.55), k2 = Math.max(k1 + 0.04, press - 0.15);
  return [[a, 1, 540, 480], [k1, 1.12, (540 + x) / 2, (480 + y) / 2], [k2, 1.75, x, y], [press + 0.6, 1.75, x, y], [press + 1.35, 1, 540, 480]];
};
// Contact frames: own-on-* 0.96 s, own-off-e 1.0 s, own-off-m 0.95 s; own-ret-m9: Return key-down at 1.80 s, from 3.7 s the
// hand only rests (ping-pong of the quiet 3.0–3.7 s part) — no stray key presses after the approval.
const FN: [number, number] = [110, 424];
const RET: [number, number] = [764, 240];
const RET_DOWN = 1.8;
const DESK: { a: number; b: number; src: string; from: number; cam?: Cam; dimAt?: number }[] = [
  { a: 0, b: T.press1 - 0.96, src: "own-rest-e", from: 47.6 - (T.press1 - 0.96) },
  { a: T.press1 - 0.96, b: T.stop1 - 1.0, src: "own-on-e", from: 0, cam: followKey(T.press1 - 0.96, ...FN, T.press1) },
  { a: T.stop1 - 1.0, b: T.close, src: "own-off-e", from: 0, cam: followKey(T.stop1 - 1.0, ...FN, T.stop1) },
  { a: T.close, b: T.close + 1.65, src: "own-close-e", from: 0 },
  { a: T.close + 1.65, b: T.morning, src: "own-night", from: 0 },
  { a: T.morning, b: T.morning + 1.6, src: "own-open-m", from: 0 },
  { a: T.morning + 1.6, b: T.press2 - 0.96, src: "own-rest-m", from: 47.6 - (T.press2 - 0.96 - T.morning - 1.6) },
  { a: T.press2 - 0.96, b: T.press2 - 0.96 + 2.6, src: "own-on-m", from: 0, cam: followKey(T.press2 - 0.96, ...FN, T.press2) },
  { a: T.press2 - 0.96 + 2.6, b: T.stop2 - 0.95, src: "own-rest-m", from: 5 },
  { a: T.stop2 - 0.95, b: T.stop2 + 0.85, src: "own-off-m", from: 0, cam: followKey(T.stop2 - 0.95, ...FN, T.stop2) },
  { a: T.stop2 + 0.85, b: T.enter - RET_DOWN, src: "own-rest-m", from: 47.6 - (T.enter - RET_DOWN - T.stop2 - 0.85) },
  { a: T.enter - RET_DOWN, b: SD_SECONDS, src: "own-ret-m9", from: 0, cam: followKey(T.enter - RET_DOWN, ...RET, T.enter) },
];

const FilmGrade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(200deg, rgba(255,170,100,0.55), rgba(255,170,100,0) 45%, rgba(30,80,110,0) 60%, rgba(20,70,100,0.6))", mixBlendMode: "soft-light", opacity: 0.55 }} />
    <AbsoluteFill style={{ background: "rgba(18,22,30,1)", mixBlendMode: "lighten", opacity: 0.12 }} />
    <AbsoluteFill style={{ backdropFilter: "blur(2.6px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 74%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 74%, #000 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(130% 110% at 50% 42%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.32) 100%)" }} />
  </>
);

const DeskShot: React.FC<{ src: string; at: number; from: number; cam?: Cam; dimAt?: number }> = ({ src, at, from, cam, dimAt }) => {
  const s = useSec() + at;
  const c = (i: number, def: number) => (cam ? interpolate(s, cam.map((x) => x[0]), cam.map((x) => x[i]), { ...clamp, easing: Easing.inOut(Easing.cubic) }) : def);
  const drift = 1.02 + (s - at) * 0.002;
  const bright = dimAt ? interpolate(s, [dimAt + 0.1, dimAt + 0.8], [1, 0.4], clamp) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(D + `desk/${src}.mp4`)} trimBefore={Math.round(from * SD_FPS)} muted style={{ width: 1080, height: 960, objectFit: "cover", transform: `scale(${drift * c(1, 1)})`, transformOrigin: `${c(2, 540)}px ${c(3, src === "relax-m" ? 300 : 200)}px`, filter: bright < 1 ? `brightness(${bright})` : undefined }} />
    </AbsoluteFill>
  );
};

// ---------- captions (centred on the seam) ----------

const CHUNKS: { a: number; b: number; ws: Wd[] }[] = (() => {
  const out: { a: number; b: number; ws: Wd[] }[] = [];
  let cur: Wd[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    const brk = /[.,:?!]$/.test(w.text) || cur.length >= 3 || !next || next.s - w.e > 0.35 || next.sp !== w.sp;
    if (brk) { out.push({ a: cur[0].s - 0.05, b: 0, ws: cur }); cur = []; }
  });
  out.forEach((c, i) => { const last = c.ws[c.ws.length - 1]; const nx = out[i + 1]; c.b = nx ? Math.min(nx.a, last.e + 0.6) : last.e + 0.6; });
  return out;
})();

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const c = CHUNKS.find((x) => t >= x.a && t < x.b);
  if (!c) return null;
  const agent = c.ws[0].sp === "a";
  const pop = k(t, c.a, 0.22, Easing.out(Easing.back(2.2)));
  const chars = c.ws.reduce((n, w) => n + w.text.length + 1, 0);
  const fs = Math.min(68, 1010 / (chars * 0.56));
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: TOP_H, transform: `translateY(-50%) scale(${0.9 + 0.1 * pop})`, display: "flex", justifyContent: "center", zIndex: 80 }}>
      <div style={{ fontFamily: fonts.bold, fontSize: fs, lineHeight: 1.05, letterSpacing: -1.6, color: "#fff", textShadow: "0 4px 22px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
        {c.ws.map((w, i) => {
          const p = k(t, w.s - 0.04, 0.16);
          return <span key={i} style={{ opacity: p, display: "inline-block", transform: `translateY(${(1 - p) * 10}px)`, marginRight: i < c.ws.length - 1 ? fs * 0.26 : 0, color: agent ? "#FFB08A" : "#fff" }}>{w.text.toLowerCase()}</span>;
        })}
      </div>
    </div>
  );
};

// ---------- end card (top of the stack: pure white, no grain, no split remnants) ----------

const EndCard: React.FC<{ at: number }> = ({ at }) => {
  const t = useSec() + at;
  const a = k(t, at + 0.35, 0.45), b = k(t, at + 1.45, 0.45), sw = k(t, at + 2.5, 0.45);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", alignItems: "center", justifyContent: "center", opacity: k(t, at, 0.4, Easing.inOut(Easing.cubic)), zIndex: 100 }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(255,107,53,0.10), rgba(255,107,53,0) 65%)", transform: `scale(${0.9 + 0.1 * Math.sin(t * 1.4)})` }} />
      <div style={{ opacity: 1 - sw, transform: `translateY(${-sw * 20}px)`, textAlign: "center", position: "absolute" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 92, letterSpacing: -3, color: INK, opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>jeder mitarbeiter.</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 92, letterSpacing: -3, color: ACC, opacity: b, transform: `translateY(${(1 - b) * 18}px)` }}>sein eigenes team.</div>
      </div>
      <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 26, opacity: sw, transform: `scale(${0.94 + 0.06 * sw})` }}>
        <AppIcon size={120} />
        <div style={{ fontFamily: fonts.bold, fontSize: 104, letterSpacing: -4, color: INK }}>superkind.ai</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- film look ----------

const Grain: React.FC<{ t: number }> = ({ t }) => {
  const seed = Math.floor(t * SD_FPS) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.09, zIndex: 90 }}>
      <svg width={1080} height={1920}>
        <filter id={`g${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
// ---------- main ----------

export const SuperkindDesk: React.FC = () => {
  const t = useSec();
  const sfx = (name: string, at: number, vol: number, len = 4.5) => (
    <Sequence key={name + at} {...seq(at, at + len)}><Audio src={staticFile(D + `sfx2/${name}.mp3`)} volume={vol} /></Sequence>
  );
  const DONE = 0.34; // one consistent premium chime per result, on the frame it appears
  const musicVol = (f: number) => {
    const s = f / SD_FPS;
    return interpolate(s, [0, 0.4], [0, 0.12], clamp) * interpolate(s, [T.end - 0.5, T.end + 0.6, SD_SECONDS - 1.4, SD_SECONDS - 0.1], [1, 1.5, 1.5, 0], clamp);
  };
  const inEnd = t >= T.end + 0.45;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {!inEnd && <>
        <AbsoluteFill style={{ height: TOP_H }}><Screen t={t} /></AbsoluteFill>
        <div style={{ position: "absolute", left: 0, top: TOP_H, width: 1080, height: 960, overflow: "hidden", filter: "contrast(1.07) saturate(0.86) brightness(0.98)" }}>
          {DESK.map((d) => (
            <Sequence key={d.src + d.a} {...seq(d.a, d.b)} layout="none">
              <AbsoluteFill><DeskShot src={d.src} at={d.a} from={d.from} cam={d.cam} dimAt={d.dimAt} /></AbsoluteFill>
            </Sequence>
          ))}
          <FilmGrade />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0) 18%)" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: TOP_H - 1, height: 2, background: "rgba(0,0,0,0.6)" }} />
        <Captions t={t} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,170,90,0.04), rgba(255,140,60,0.06))", mixBlendMode: "soft-light", pointerEvents: "none" }} />
        <Grain t={t} />
      </>}
      <Sequence {...seq(T.end, SD_SECONDS)}><EndCard at={T.end} /></Sequence>

      <Audio src={staticFile(D + "voice.wav")} />
      <Audio src={staticFile(D + "music-v4.mp3")} volume={musicVol} />
      {/* Superkind speaks up */}
      {sfx("notif", 0.15, 0.22)}
      {sfx("pop2", T_4X, 0.18)}
      {/* "Ja, mach." */}
      {sfx("key", T.press1 - 0.03, 0.55)}
      {sfx("listen", T.press1 + 0.06, 0.3)}
      {sfx("key", T.stop1 - 0.03, 0.55)}
      {sfx("tick", T.stop1 + 0.05, 0.22)}
      {sfx("done", T.done1, DONE)}
      {/* night */}
      {sfx("lidclose", T.close - 0.35, 0.7)}
      {sfx("tick", T.roll + 0.2, 0.16)}
      {sfx("notif", T.notif, 0.26)}
      {sfx("lidopen", T.morning + 0.4, 0.5)}
      {/* the list is there */}
      {CUSTOMERS.map((_, i) => sfx("tick", T.list + 0.5 + i * 0.1, 0.07))}
      {/* reply in one sentence */}
      {sfx("key", T.press2 - 0.03, 0.5)}
      {sfx("listen", T.press2 + 0.06, 0.28)}
      {sfx("key", T.stop2 - 0.03, 0.5)}
      {sfx("tick", T.stop2 + 0.05, 0.22)}
      {sfx("done", T.draftsDone, DONE)}
      {/* approve with Enter: key-down = button = sound, same frame */}
      {sfx("key", T.enter - 0.03, 0.6)}
      {sfx("done", T.enter + 0.04, DONE)}
      {/* outcome */}
      {sfx("reveal", T.outcome, 0.14)}
      {sfx("pop2", T_FIX1, 0.14)}
      {sfx("pop2", T_FIX2, 0.14)}
      {sfx("whoosh", T.end - 0.05, 0.1)}
      {sfx("reveal", T.end + 2.4, 0.24)}
    </AbsoluteFill>
  );
};
