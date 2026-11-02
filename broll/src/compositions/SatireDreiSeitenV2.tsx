import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, OffthreadVideo, staticFile } from "remotion";
import { useSec, Word } from "../components/SatireKit";

// GPT-S @florentgpt "Drei Seiten" v2, 2026-10-12. Look = SatireAustralienV4 (clean Apple base + ChatGPT UI language).
// No photos, no cards over the avatar, no serif/condensed/mono, no stamps/grids/slot counters, no OpenAI logo.
// Scenes fill the split panel: 1 notice board (note pinned, pages fan to 3, "3 Seiten."), 2 ChatGPT web chat (Krüger:
// letter streams + bullet list builds, "12 Stichpunkte"), 3 ChatGPT in a floating iPhone (family reply), 4 ChatGPT chat
// "Bitte auch auf Englisch und Ukrainisch" -> DE/EN/UK stream in, 5 drawn ring binder on the stairwell wall,
// 6 drawn pram in a clean hallway. Punchline "Alle lesen." calm on the speaker, no panel.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireDreiSeitenV2Props = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing; capY: number; zk?: { drift: number; push: number; punch: number } };

const FONT = "GPTS Inter";
const INK = "#1D1D1F";
const GREY = "#86868B";
const LIGHT = "#F5F5F7";
const BLUE = "#0071E3";
const GREEN = "#10A37F";
const G_BG = "#F4F4F4";
const G_INK = "#212121";

const useLocalFonts = () => {
  const [h] = useState(() => delayRender("gpts inter"));
  useEffect(() => {
    new FontFace(FONT, `url(${staticFile("fonts/gpts/Inter-VF.ttf")})`, { weight: "100 900" })
      .load()
      .then((f) => { (document.fonts as unknown as { add: (x: FontFace) => void }).add(f); continueRender(h); })
      .catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
};
const type = (size: number, weight: number, color = INK, track = -0.022): React.CSSProperties => ({
  fontFamily: FONT, fontSize: size, fontWeight: weight, color, letterSpacing: `${track}em`, fontVariationSettings: `"opsz" 32`, lineHeight: 1.04,
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.42, 0, 0.58, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);
const PH = 800;
const IN = 0.34;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: io }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: io }));
const prog = (t: number, a: number, b: number, e = io) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

const Reveal: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dur = 0.6, children, style }) => {
  const { t } = useSec();
  const p = prog(t, at, at + dur, out);
  return <div style={{ opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 18}px) scale(${0.96 + 0.04 * p})`, ...style }}>{children}</div>;
};

const Panel: React.FC<{ w: Win; bg: string; children: React.ReactNode }> = ({ w, bg, children }) => {
  const { t } = useSec();
  const s = envelope(t, w);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateY(${-(1 - s) * PH}px)`, background: bg, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.18)" }}>
      {children}
    </div>
  );
};

// Token streaming with ChatGPT's filled dot at the end.
const Stream: React.FC<{ text: string; start: number; end: number; style?: React.CSSProperties; dot?: number; hideDot?: boolean }> = ({ text, start, end, style, dot = 22, hideDot }) => {
  const { t } = useSec();
  const toks = text.match(/\S+\s*/g) ?? [];
  const n = Math.floor(interpolate(t, [start, end], [0, toks.length], clamp));
  const live = !hideDot && t >= start - 0.3 && t < end + 0.35;
  return (
    <div style={style}>
      {toks.slice(0, n).map((x, i) => {
        const at = start + ((end - start) * i) / toks.length;
        return <span key={i} style={{ opacity: prog(t, at, at + 0.18) }}>{x}</span>;
      })}
      {live && <span style={{ display: "inline-block", width: dot, height: dot, borderRadius: dot, background: G_INK, marginLeft: 4, verticalAlign: "-0.05em", transform: `scale(${t < start ? 0.8 + 0.25 * Math.abs(Math.sin(t * 5)) : 1})` }} />}
    </div>
  );
};

const Composer: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", border: "2px solid #E5E5E5", borderRadius: 999, padding: `${size * 0.45}px ${size * 0.5}px ${size * 0.45}px ${size * 0.8}px`, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
    <div style={{ ...type(size * 1.15, 300, "#8E8E8E", 0), lineHeight: 1 }}>+</div>
    <div style={{ ...type(size, 400, "#8E8E8E", -0.005), flex: 1 }}>Frag alles</div>
    <div style={{ width: size * 1.45, height: size * 1.45, borderRadius: size, background: G_INK, display: "grid", placeItems: "center" }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 20 20"><path d="M10 16 V4 M4.5 9.5 L10 4 L15.5 9.5" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  </div>
);

const ChatTitle: React.FC<{ who?: string; size?: number }> = ({ who, size = 30 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={type(size, 600, G_INK, -0.015)}>ChatGPT</div>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20"><path d="M5 8 L10 13 L15 8" stroke="#8E8E8E" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
    {who && <div style={{ ...type(size * 0.8, 400, GREY, 0), marginLeft: 10 }}>{who}</div>}
  </div>
);

const UserBubble: React.FC<{ text: string; at: number; size?: number; max?: number }> = ({ text, at, size = 34, max = 620 }) => {
  const { t } = useSec();
  const p = prog(t, at, at + 0.35, out);
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ maxWidth: max, background: G_BG, borderRadius: 30, padding: "18px 26px", ...type(size, 400, G_INK, -0.01), lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};


// ---------- Hook scene (frame 0 - ~2.9 s): dense, fast, several things moving at once ----------
const springy = (t: number, at: number, dur = 0.32) => {
  const x = Math.max(0, Math.min(1, (t - at) / dur));
  if (t < at) return 0;
  return 1 + Math.exp(-6 * x) * Math.sin(x * Math.PI * 2.6) * -0.9 * (1 - x) + 0 * x;
};
const NOTES = [
  { at: 0.0, x: 70, y: 300, r: -6, t: "An alle!" },
  { at: 0.25, x: 300, y: 270, r: 5, t: "Bitte beachten" },
  { at: 0.5, x: 120, y: 470, r: 3, t: "Flur frei halten" },
  { at: 0.75, x: 330, y: 500, r: -4, t: "Wichtig" },
  { at: 1.0, x: 40, y: 520, r: 6, t: "Hausordnung" },
  { at: 1.3, x: 330, y: 330, r: -3, t: "Rücksicht!" },
  { at: 1.65, x: 90, y: 360, r: 4, t: "Kinderwagen" },
  { at: 2.0, x: 280, y: 520, r: -6, t: "Nachtrag" },
  { at: 2.35, x: 200, y: 400, r: -1, t: "Liebe Nachbarschaft" },
];
const HOOK_BULLETS = ["Gemeinsame Verantwortung", "Fluchtwege im Brandfall", "Barrierefreiheit im Flur", "Hausordnung § 4 Abs. 2", "Wertschätzender Umgang", "Ruhezeiten ab 22 Uhr", "Lösungsfindung", "Feedback-Kultur", "Nächste Schritte"];
const MiniNote: React.FC<{ title: string; page?: string }> = ({ title, page }) => (
  <div style={{ position: "relative", width: 250, height: 310, background: "#FFFFFF", borderRadius: 10, padding: "40px 26px", boxSizing: "border-box", boxShadow: "0 24px 44px rgba(0,0,0,0.16), 0 4px 10px rgba(0,0,0,0.08)" }}>
    <div style={{ position: "absolute", left: 113, top: 12, width: 24, height: 24, borderRadius: 12, background: BLUE, boxShadow: "0 3px 6px rgba(0,0,0,0.25)" }} />
    <div style={{ ...type(26, 600, INK, -0.015), marginBottom: 18 }}>{title}</div>
    {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ height: 8, width: i % 3 === 2 ? "60%" : "100%", background: "#E8E8ED", borderRadius: 4, marginBottom: 15 }} />)}
    {page && <div style={{ position: "absolute", right: 18, bottom: 14, ...type(18, 500, GREY, 0) }}>{page}</div>}
  </div>
);
const HookScene: React.FC<{ end: number }> = ({ end }) => {
  const { t } = useSec();
  const k = prog(t, 0, end, Easing.linear);
  const flips = [2.75, 3.0, 3.25];
  const pageIdx = flips.filter((f) => t >= f).length;
  const flipNow = flips.map((f) => prog(t, f - 0.12, f + 0.12)).find((p) => p > 0 && p < 1) ?? 0;
  const bStart = 1.35;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F2F2F5 100%)", transform: `scale(${1 + 0.06 * k})`, transformOrigin: "50% 60%" }}>
      {/* headline, readable on frame 0 */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 46, textAlign: "center", transform: `translateY(${-8 * k}px)` }}>
        <div style={type(70, 650, INK, -0.035)}>Der Zettel im Treppenhaus</div>
        <div style={{ ...type(70, 400, "#6E6E73", -0.035), marginTop: 6 }}>hat jetzt <span style={{ color: GREEN, fontWeight: 650 }}>Stichpunkte.</span></div>
      </div>
      {/* notes slap onto the board, one every 0.25 s */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateX(${-26 * k}px)` }}>
        {NOTES.map((n, i) => {
          const sp = n.at <= 0 ? 1 : springy(t, n.at);
          if (n.at > 0 && t < n.at) return null;
          const last = i === NOTES.length - 1;
          const flipRot = last ? flipNow * 180 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: n.x, top: n.y - 30, opacity: Math.min(1, sp * 2), transform: `rotate(${n.r}deg) scale(${n.at <= 0 ? 1 : 1.35 - 0.35 * sp}) rotateY(${flipRot > 90 ? flipRot - 180 : flipRot}deg)`, filter: `blur(${n.at <= 0 ? 0 : Math.max(0, 1 - sp) * 6}px)` }}>
              <MiniNote title={n.t} page={last ? `Seite ${pageIdx + 1}` : undefined} />
            </div>
          );
        })}
      </div>
      {/* ChatGPT chat streaming the letter while bullets shoot in */}
      <div style={{ position: "absolute", left: 580, top: 250, width: 440, transform: `translateX(${18 * k}px) translateY(${(1 - prog(t, 0, 0.35, out)) * 40}px)`, opacity: Math.max(0.6, prog(t, 0, 0.3)) }}>
        <div style={{ background: "#FFFFFF", borderRadius: 30, padding: "24px 26px", boxShadow: "0 30px 60px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.06)", height: 500, boxSizing: "border-box", overflow: "hidden" }}>
          <ChatTitle size={26} />
          <div style={{ transform: `translateY(${-150 * prog(t, 2.1, 3.3)}px)` }}>
          <div style={{ marginTop: 16 }}><UserBubble text="Schreib einen Zettel wegen dem Kinderwagen." at={-0.4} size={22} max={330} /></div>
          <div style={{ marginTop: 16 }}>
            <Stream text="Liebe Nachbarschaft, ein harmonisches Miteinander liegt uns allen am Herzen." start={0.15} end={1.15} dot={18} hideDot={t > bStart} style={{ ...type(25, 500, G_INK, -0.01), lineHeight: 1.3 }} />
          </div>
          <div style={{ marginTop: 12 }}>
            {HOOK_BULLETS.map((b, i) => {
              const at = bStart + i * 0.22;
              const p = springy(t, at, 0.28);
              if (t < at) return null;
              return (
                <div key={i} style={{ display: "flex", gap: 10, ...type(22, 400, G_INK, -0.005), lineHeight: 1.45, transform: `translateX(${(1 - Math.min(1, p)) * 120}px)`, opacity: Math.min(1, p * 1.5) }}>
                  <span style={{ fontWeight: 600, minWidth: 24 }}>{i + 1}.</span>{b}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 1: notice board, note pinned, pages fan to 3 ----------
const Page: React.FC<{ title?: string; lines: number; n: number }> = ({ title, lines, n }) => (
  <div style={{ position: "relative", width: 380, height: 520, background: "#FFFFFF", borderRadius: 10, padding: "48px 40px", boxSizing: "border-box", boxShadow: "0 30px 60px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.06)" }}>
    {title && <div style={{ ...type(30, 600, INK, -0.015), marginBottom: 26 }}>{title}</div>}
    {Array.from({ length: lines }).map((_, i) => <div key={i} style={{ height: 9, width: i % 5 === 4 ? "58%" : "100%", background: "#E8E8ED", borderRadius: 5, marginBottom: 19 }} />)}
    <div style={{ position: "absolute", right: 30, bottom: 22, ...type(20, 500, GREY, 0) }}>{n} / 3</div>
  </div>
);
const BoardScene: React.FC<{ w: Win; drei: number }> = ({ w, drei }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to, Easing.linear);
  const pin = prog(t, w.from + 0.15, w.from + 0.6, out);
  const pinDot = prog(t, w.from + 0.5, w.from + 0.7, out);
  const fan = (i: number) => prog(t, drei - 0.2 + i * 0.16, drei + 0.35 + i * 0.16, out);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F7F7F9 0%, #EDEDF0 100%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `scale(${1 + 0.05 * k})`, transformOrigin: "70% 50%" }}>
        <div style={{ position: "absolute", left: 76, top: 64, ...type(26, 500, GREY, 0.01), opacity: prog(t, w.from + 0.2, w.from + 0.5) }}>Aushang · Treppenhaus</div>
        {[2, 1, 0].map((i) => {
          const f = i === 0 ? 1 : fan(i);
          const show = i === 0 ? pin : f;
          return (
            <div key={i} style={{ position: "absolute", left: 520 + i * 120 * f, top: 150 + i * 22 * f + (i === 0 ? (1 - pin) * -60 : 0), opacity: show, filter: `blur(${(1 - show) * 10}px)`, transform: `rotate(${(i === 0 ? -3 : i * 5) * (i === 0 ? 1 : f)}deg)`, transformOrigin: "50% 0%" }}>
              <Page title={i === 0 ? "An alle Bewohner" : undefined} lines={i === 0 ? 13 : 16} n={i + 1} />
              {i === 0 && <div style={{ position: "absolute", left: 172, top: 14, width: 30, height: 30, borderRadius: 15, background: BLUE, transform: `scale(${pinDot})`, boxShadow: "0 4px 8px rgba(0,0,0,0.25), inset 0 -3px 0 rgba(0,0,0,0.15)" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, top: 280 }}>
        <Reveal at={drei - 0.05} dur={0.55}>
          <div style={type(190, 600, INK, -0.045)}>3</div>
          <div style={{ ...type(84, 300, "#6E6E73", -0.03), marginTop: -6 }}>Seiten.</div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 2: ChatGPT web chat, Krüger's letter + bullet list -> "12 Stichpunkte" ----------
const BULLETS = [
  "Gemeinsame Verantwortung", "Fluchtwege im Brandfall", "Rücksicht auf alle Generationen", "Barrierefreiheit im Flur",
  "Hausordnung § 4 Abs. 2", "Wertschätzender Umgang", "Ästhetik des Eingangsbereichs", "Reinigungsplan Erdgeschoss",
  "Ruhezeiten ab 22 Uhr", "Gemeinsame Lösungsfindung", "Feedback-Kultur im Haus", "Nächste Schritte",
];
const KruegerChat: React.FC<{ w: Win; c: Record<string, number> }> = ({ w, c }) => {
  const { t } = useSec();
  const bStart = c.Darunter - 0.05, bEnd = c.zwölf + 0.55;
  const nb = Math.floor(interpolate(t, [bStart, bEnd], [0, 12], clamp));
  const scroll = interpolate(t, [bStart, bEnd], [0, 330], { ...clamp, easing: io });
  const big = prog(t, c.zwölf + 0.3, c.zwölf + 0.8, out);
  const k = prog(t, w.from, w.to, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, filter: `blur(${big * 10}px)`, opacity: 1 - 0.75 * big, transform: `scale(${1 + 0.03 * k})` }}>
        <div style={{ position: "absolute", left: 90, right: 90, top: 130, transform: `translateY(${-scroll}px)` }}>
          <UserBubble text="Schreib einen Zettel wegen dem Kinderwagen im Flur." at={w.from + 0.25} />
          <div style={{ marginTop: 40 }}>
            <Stream text="Liebe Nachbarschaft, ein harmonisches Miteinander liegt uns allen am Herzen." start={c.Liebe - 0.05} end={c.Darunter - 0.25} dot={26} hideDot={t > bStart} style={{ ...type(44, 500, G_INK, -0.014), lineHeight: 1.32 }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 18, height: 52 }}>
            {[{ at: c.Liebe + 0.5, l: "Ton: wertschätzend" }, { at: c.Liebe + 1.6, l: "Länge: 3 Seiten" }, { at: c.Liebe + 2.6, l: "Format: Stichpunkte" }].map((x, i) => {
              const sp = springy(t, x.at, 0.3);
              if (t < x.at) return null;
              return <div key={i} style={{ background: "#E7F6F1", color: GREEN, borderRadius: 999, padding: "10px 20px", ...type(24, 600, GREEN, 0), transform: `scale(${0.6 + 0.4 * sp})`, opacity: Math.min(1, sp * 2) }}>{x.l}</div>;
            })}
          </div>
          <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 30, rowGap: 14 }}>
            {BULLETS.map((b, i) => {
              const at = bStart + ((bEnd - bStart) * i) / 12;
              const p = prog(t, at, at + 0.2);
              return (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", opacity: i < nb ? p : 0, ...type(30, 400, G_INK, -0.008), lineHeight: 1.25 }}>
                  <span style={{ ...type(30, 600, G_INK, 0), minWidth: 34 }}>{i + 1}.</span>{b}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 112, background: "linear-gradient(180deg, #FFF 75%, rgba(255,255,255,0))", padding: "44px 70px 0", boxSizing: "border-box" }}><ChatTitle who="Herr Krüger" /></div>
        <div style={{ position: "absolute", left: 90, right: 90, bottom: 40, background: "#FFF" }}><Composer size={30} /></div>
      </div>
      {big > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 230, textAlign: "center", opacity: big, filter: `blur(${(1 - big) * 12}px)`, transform: `scale(${0.96 + 0.04 * big})` }}>
          <div style={type(220, 600, INK, -0.045)}>12</div>
          <div style={{ ...type(80, 300, "#6E6E73", -0.03), marginTop: -4 }}>Stichpunkte.</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Scene 3: floating iPhone, family answers with ChatGPT ----------
const IPhone: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = 500, h = 1030 }) => (
  <div style={{ width: w, height: h, borderRadius: 74, padding: 13, boxSizing: "border-box", background: "linear-gradient(135deg, #3A3A3C 0%, #1C1C1E 45%, #48484A 100%)", boxShadow: "0 50px 90px rgba(0,0,0,0.30), 0 12px 24px rgba(0,0,0,0.18), inset 0 0 0 2px rgba(255,255,255,0.10)" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 62, overflow: "hidden", background: "#FFFFFF" }}>
      <div style={{ position: "absolute", left: "50%", top: 16, transform: "translateX(-50%)", width: 118, height: 34, borderRadius: 17, background: "#000", zIndex: 2 }} />
      {children}
    </div>
  </div>
);
const FamilyScene: React.FC<{ w: Win; c: Record<string, number> }> = ({ w, c }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to, Easing.linear);
  const enter = prog(t, w.from, w.from + 0.7, out);
  const float = Math.sin(t * 1.6) * 8;
  return (
    <AbsoluteFill style={{ background: G_BG }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, perspective: 1800, display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: 50 + (1 - enter) * 200 + float, transform: `rotateY(${18 - 14 * k}deg) rotateX(${7 - 3 * k}deg) rotateZ(${2 - 2 * k}deg)`, transformOrigin: "50% 30%", opacity: enter }}>
          <IPhone>
            <div style={{ position: "relative", height: "100%", padding: "92px 28px 0", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><ChatTitle size={32} /></div>
              <div style={{ marginTop: 40 }}><UserBubble text="Antworte freundlich auf den Zettel von Herrn Krüger." at={w.from + 0.3} size={29} max={360} /></div>
              <div style={{ marginTop: 32 }}>
                <Stream text="Lieber Herr Krüger, mit Dank für die wertschätzende Kommunikation." start={c.Dank - 0.2} end={c.Dank + 1.4} dot={24} style={{ ...type(36, 500, G_INK, -0.012), lineHeight: 1.3 }} />
              </div>
              <div style={{ position: "absolute", left: 22, right: 22, bottom: 150 }}><Composer size={28} /></div>
            </div>
          </IPhone>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, top: 60, ...type(26, 500, GREY, 0.01), opacity: prog(t, w.from + 0.2, w.from + 0.5) }}>Familie, EG</div>
    </AbsoluteFill>
  );
};

// ---------- Scene 4: ChatGPT chat, DE / EN / UK stream in ----------
const LangScene: React.FC<{ w: Win; c: Record<string, number> }> = ({ w, c }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to, Easing.linear);
  const blocks = [
    { at: c.Deutsch - 0.1, l: "Deutsch", txt: "Liebe Nachbarschaft, ein harmonisches Miteinander …" },
    { at: c.Englisch - 0.1, l: "Englisch", txt: "Dear neighbours, a harmonious coexistence …" },
    { at: c.Ukrainisch - 0.1, l: "Ukrainisch", txt: "Шановні сусіди, гармонійне співіснування …" },
  ];
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `scale(${1 + 0.03 * k})` }}>
        <div style={{ position: "absolute", left: 70, top: 44 }}><ChatTitle who="Herr Krüger" /></div>
        <div style={{ position: "absolute", left: 90, right: 90, top: 128 }}>
          <UserBubble text="Bitte auch auf Englisch und Ukrainisch." at={w.from + 0.25} />
          <div style={{ marginTop: 30 }}>
            {blocks.map((b, i) => {
              const p = prog(t, b.at - 0.1, b.at + 0.3, out);
              return (
                <div key={i} style={{ marginBottom: 22, opacity: p, filter: `blur(${(1 - p) * 8}px)`, transform: `translateX(${(1 - p) * 40}px)` }}>
                  <div style={{ ...type(24, 600, GREEN, 0.02), marginBottom: 6 }}>{b.l}</div>
                  <Stream text={b.txt} start={b.at} end={b.at + 0.5} dot={22} hideDot={i < 2 && t > blocks[i + 1].at - 0.1} style={{ ...type(38, 500, G_INK, -0.012), lineHeight: 1.25 }} />
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "absolute", right: 90, top: 46, ...type(30, 600, INK, -0.015), opacity: prog(t, c.Für - 0.05, c.Für + 0.25) }}>Für alle.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 5: drawn ring binder hanging on the stairwell wall ----------
const BinderScene: React.FC<{ w: Win; c: Record<string, number> }> = ({ w, c }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to + 1.6, Easing.linear);
  const enter = prog(t, w.from + 0.05, w.from + 0.7, out);
  const swing = Math.sin((t - w.from) * 2.4) * 2.2 * (1 - prog(t, w.from, w.from + 1.6));
  const label = prog(t, c.Ordner - 0.1, c.Ordner + 0.35, out);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #FAFAFB 0%, #EEEEF1 100%)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `scale(${1 + 0.06 * k})`, transformOrigin: "50% 45%" }}>
        {/* nail + string */}
        <svg width={1080} height={PH} style={{ position: "absolute" }}>
          <circle cx={540} cy={70} r={9} fill="#8E8E93" />
          <path d={`M 540 72 L 470 150 M 540 72 L 610 150`} stroke="#A1A1A6" strokeWidth={3} />
        </svg>
        <div style={{ position: "absolute", left: 540 - 175, top: 140 + (1 - enter) * 40, opacity: enter, transform: `rotate(${swing}deg)`, transformOrigin: "50% -70px" }}>
          {/* spine view of a lever-arch file */}
          <div style={{ position: "relative", width: 350, height: 600, borderRadius: 18, background: "linear-gradient(90deg, #1C1C1E 0%, #48484A 36%, #3A3A3C 70%, #1C1C1E 100%)", boxShadow: "0 40px 70px rgba(0,0,0,0.16), 0 8px 18px rgba(0,0,0,0.08), inset 0 0 0 1.5px rgba(0,0,0,0.05)" }}>
            <div style={{ position: "absolute", left: 40, right: 40, top: 70, height: 250, borderRadius: 10, background: "#FFFFFF", boxShadow: "inset 0 0 0 2px #E1E1E6", padding: "26px 22px", boxSizing: "border-box", opacity: 0.85 + 0.15 * label, transform: `scale(${0.98 + 0.02 * label})` }}>
              <div style={type(24, 500, GREY, 0.01)}>Treppenhaus</div>
              <div style={{ ...type(34, 600, INK, -0.025), marginTop: 10, lineHeight: 1.1 }}>Korrespondenz<br />Flur</div>
              <div style={{ ...type(22, 400, GREY, 0), marginTop: 14 }}>Band 1</div>
            </div>
            <div style={{ position: "absolute", left: 175 - 42, top: 430, width: 84, height: 84, borderRadius: 42, background: "radial-gradient(circle at 50% 40%, #0A0A0A 0%, #2C2C2E 70%)", boxShadow: "inset 0 4px 10px rgba(0,0,0,0.18)" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 6: drawn pram in a clean hallway ----------
const PramScene: React.FC<{ w: Win; noteAt?: number; label?: string }> = ({ w, noteAt, label = "Flur · Erdgeschoss" }) => {
  const { t } = useSec();
  const k = prog(t, w.from, w.to, Easing.linear);
  const enter = prog(t, w.from - 0.1, w.from + 0.5, out);
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <svg width={1080} height={PH} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="wallH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FAFAFB" /><stop offset="100%" stopColor="#ECECEF" /></linearGradient>
          <linearGradient id="floorH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E3E3E7" /><stop offset="100%" stopColor="#D5D5DA" /></linearGradient>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4A4A4E" /><stop offset="100%" stopColor="#1C1C1E" /></linearGradient>
          <filter id="pshadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        </defs>
        <g transform={`translate(540 400) scale(${1 + 0.07 * k}) translate(-540 -400)`}>
          <rect width={1080} height={PH} fill="url(#wallH)" />
          <rect y={590} width={1080} height={210} fill="url(#floorH)" />
          <rect y={582} width={1080} height={10} fill="#FFFFFF" />
          {/* apartment door */}
          <rect x={760} y={150} width={220} height={432} rx={6} fill="#FFFFFF" stroke="#E1E1E6" strokeWidth={3} />
          <rect x={940} y={370} width={24} height={8} rx={4} fill="#A1A1A6" />
          <circle cx={870} cy={230} r={10} fill="#E1E1E6" />
          {/* pram */}
          <ellipse cx={470} cy={690} rx={230} ry={22} fill="#000" opacity={0.18} filter="url(#pshadow)" />
          <g>
            <path d="M 300 590 C 360 520, 700 520, 640 590" stroke="#2C2C2E" strokeWidth={8} fill="none" />
            <line x1={330} y1={600} x2={300} y2={665} stroke="#3A3A3C" strokeWidth={8} strokeLinecap="round" />
            <line x1={610} y1={600} x2={640} y2={665} stroke="#3A3A3C" strokeWidth={8} strokeLinecap="round" />
            <path d="M 600 420 L 720 330" stroke="#3A3A3C" strokeWidth={10} strokeLinecap="round" />
            <rect x={705} y={318} width={60} height={18} rx={9} fill="#1C1C1E" transform="rotate(-37 735 327)" />
            <path d="M 250 420 L 640 420 C 640 540, 560 590, 445 590 C 330 590, 250 540, 250 420 Z" fill="url(#body)" />
            <path d="M 250 420 C 250 300, 330 250, 440 250 L 440 420 Z" fill="#2C2C2E" />
            <path d="M 270 420 C 272 320, 340 272, 430 270" stroke="#5A5A5E" strokeWidth={4} fill="none" />
            <rect x={250} y={412} width={390} height={14} rx={7} fill="#5A5A5E" />
            {[300, 640].map((x) => (
              <g key={x}>
                <circle cx={x} cy={668} r={46} fill="#1C1C1E" />
                <circle cx={x} cy={668} r={30} fill="#3A3A3C" />
                <circle cx={x} cy={668} r={9} fill="#A1A1A6" />
              </g>
            ))}
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 70, top: 60, ...type(26, 500, GREY, 0.01), opacity: prog(t, w.from + 0.3, w.from + 0.6) }}>{label}</div>
      {noteAt !== undefined && t >= noteAt && (() => {
        const sp = springy(t, noteAt, 0.34);
        const ul = prog(t, noteAt + 0.9, noteAt + 1.4, out);
        return (
          <div style={{ position: "absolute", left: 80, top: 150, transform: `rotate(-4deg) scale(${1.35 - 0.35 * sp})`, opacity: Math.min(1, sp * 2), filter: `blur(${Math.max(0, 1 - sp) * 6}px)` }}>
            <div style={{ position: "relative", width: 380, background: "#FFFFFF", borderRadius: 10, padding: "40px 32px 30px", boxShadow: "0 24px 44px rgba(0,0,0,0.16), 0 4px 10px rgba(0,0,0,0.08)" }}>
              <div style={{ position: "absolute", left: 178, top: 12, width: 24, height: 24, borderRadius: 12, background: BLUE }} />
              <div style={type(22, 500, GREY, 0.01)}>Früher</div>
              <div style={{ ...type(46, 650, INK, -0.025), marginTop: 8, lineHeight: 1.1 }}>Flur ist kein Abstellraum.</div>
              <div style={{ height: 6, width: 300 * ul, background: BLUE, borderRadius: 3, marginTop: 10 }} />
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ words: Word[]; split: number; capY: number }> = ({ words, split, capY }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  const size = 56;
  const top = inPanel ? PH - size * 0.6 : capY - size * 0.6;
  return (
    <div style={{ position: "absolute", top, width: 1080, textAlign: "center", ...type(size, 600, inPanel ? INK : "#FFFFFF", -0.015),
      textShadow: inPanel ? "0 0 14px rgba(255,255,255,0.95), 0 0 4px rgba(255,255,255,0.9)" : "0 2px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)",
      opacity: split > 0.05 && split < 0.95 ? 0 : 1 }}>{cur.text}</div>
  );
};

export const SatireDreiSeitenV2: React.FC<SatireDreiSeitenV2Props> = ({ src, seconds, words, c, fr, capY, zk = { drift: 0.02, push: 0.045, punch: 0.07 } }) => {
  useLocalFonts();
  const { t } = useSec();

  const S1: Win = { from: c.Seine + 0.35, to: c.Kinderwagen + 0.2 };
  const pram1 = c.Kinderwagen - 0.15;
  const S2: Win = { from: c.Jetzt - 0.15, to: c.zwölf + 1.35 };
  const S3: Win = { from: c.Auch - 0.45, to: c.Herr2 - 0.1 };
  const S4: Win = { from: c.Herr2 + 0.6, to: c.Im + 0.25 }; // S56 slides in over it, one continuous split
  const S56: Win = { from: c.Im - 0.15, to: c.Alle - 0.3 }; // binder, then cut to the pram on "Der Kinderwagen"
  const wins = [S2, S3, S56];
  const split = Math.max(...[{ from: -1, to: S2.to }, S3, { from: S4.from, to: S56.to }].map((w) => envelope(t, w)));

  const lastEnd = Math.max(0, ...wins.filter((w) => w.to <= t).map((w) => w.to));
  const push = lastEnd > 0 ? 1 + zk.push * prog(t, lastEnd, lastEnd + 0.9, io) : 1;
  const punch = 1 + zk.punch * prog(t, c.Alle - 0.1, c.Alle + 0.3, out);
  const z = (1 + zk.drift * (t / seconds)) * push * punch;
  const pramCut = c.Der2 - 0.12;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook B-Roll in the split from frame 0, then the board scene (one continuous split) */}
      <Panel w={{ from: -1, to: S2.from + 0.4 }} bg={LIGHT}>
        {t < S1.from + 0.35 && <HookScene end={S1.from + 0.35} />}
        {t >= S1.from && t < pram1 + 0.35 && <div style={{ position: "absolute", inset: 0, opacity: prog(t, S1.from, S1.from + 0.3) }}><BoardScene w={S1} drei={c.drei} /></div>}
        {t >= pram1 && <div style={{ position: "absolute", inset: 0, opacity: prog(t, pram1, pram1 + 0.3) }}><PramScene w={{ from: pram1, to: S2.from + 0.4 }} noteAt={c.Früher - 0.08} label="Herr Krüger, 3. OG" /></div>}
      </Panel>
      <Panel w={S2} bg="#fff"><KruegerChat w={S2} c={c} /></Panel>
      <Panel w={S3} bg={G_BG}><FamilyScene w={S3} c={c} /></Panel>
      <Panel w={S4} bg="#fff"><LangScene w={S4} c={c} /></Panel>
      <Panel w={S56} bg={LIGHT}>
        {t < pramCut + 0.3 && <BinderScene w={{ from: S56.from, to: pramCut }} c={c} />}
        {t >= pramCut - 0.1 && <PramScene w={{ from: pramCut, to: S56.to }} />}
      </Panel>

      <Captions words={words} split={split} capY={capY} />
    </AbsoluteFill>
  );
};
