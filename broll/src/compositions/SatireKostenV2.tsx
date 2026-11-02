import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// v2 of "Versunkene Kosten" (GPT-S @florentgpt, Henri 2026-10-09):
// - light dopamine: 4 calm split panels (1.9-2.2 s) on number/term moments, flat white, clear numbers, no glow/glitter
// - no clipart / emoji: real stock photos (Unsplash via Wikimedia Commons, CC0), people as white-border cutouts
// - two fonts only: Instrument Serif (terms/titles) + Inter (everything else); no gradients, no glow
// - punchline (Max2 → end) stays calm and uncovered
export type SatireKostenV2Props = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#10A37F";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const IMG = (f: string) => staticFile(`gpts-effekt-versunkene-kosten-v2/img/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], clamp);
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ---------- split panels ----------
const PH = 800; // panel height (top), speaker area below = 1120 px (58 %)
// v3 split framing (Henri 2026-10-09: "Avatar abgeschnitten"): face measured with facecheck/facefocus.py
// (median face centre x 0.35, y 0.555, Vision face box 480 px). While a panel is open the speaker is scaled to
// S = 1.35 with the left edge flush (no side gaps) so the face sits ~centred (x ≈ 0.47), and moved so cap top
// to chin fill the speaker area with air above the cap: face box top at y 1166, chin ≈ 1810.
const SPLIT_S = 1.35;
const SPLIT_TY = 1166 - SPLIT_S * 826; // 826 = face box top in the source (1066 - 480/2)
const IN = 0.24;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }));

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], clamp);
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

// Flat slot counter: each digit rolls on its own strip, left digits land first. No glow, no blur.
const Roller: React.FC<{ text: string; start: number; dur: number; size: number; color?: string }> = ({ text, start, dur, size, color = INK }) => {
  const { t } = useSec();
  const H = size * 1.08;
  const digitsTotal = text.replace(/\D/g, "").length;
  let di = 0;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: fonts.bold, fontSize: size, color, letterSpacing: -2, lineHeight: `${H}px`, fontVariantNumeric: "tabular-nums" }}>
      {text.split("").map((ch, i) => {
        if (!/\d/.test(ch)) return <div key={i} style={{ height: H, opacity: interpolate(t, [start + dur * 0.6, start + dur], [0.25, 1], clamp) }}>{ch === " " ? " " : ch}</div>;
        const k = di++;
        const d = Number(ch);
        const p = interpolate(t, [start + k * 0.05, start + dur - (digitsTotal - 1 - k) * 0.0 ], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const spins = 2 + (digitsTotal - k);
        const v = p * (spins * 10 + d);
        return (
          <div key={i} style={{ height: H, overflow: "hidden", width: size * 0.62 }}>
            <div style={{ transform: `translateY(${-(v % 10) * H}px)` }}>
              {Array.from({ length: 11 }).map((_, j) => (
                <div key={j} style={{ height: H, textAlign: "center" }}>{j % 10}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = GREY, size = 34, style }) => (
  <div style={{ fontFamily: fonts.semibold, fontSize: size, color, ...style }}>{children}</div>
);

// Flat ticket card (no gradient): white, thin border, ink stub.
const Ticket: React.FC<{ w: number; seat: string; price?: string; sub?: string }> = ({ w, seat, price, sub = "Konzert · Sa 20:00" }) => (
  <div style={{ width: w, display: "flex", borderRadius: 18, overflow: "hidden", background: "#fff", border: `2px solid ${LINE}`, boxShadow: "0 10px 24px rgba(0,0,0,0.10)" }}>
    <div style={{ flex: 1, padding: "18px 24px" }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 22, letterSpacing: 3, color: GREY }}>TICKET</div>
      <div style={{ fontFamily: fonts.bold, fontSize: 38, color: INK, marginTop: 2 }}>{sub}</div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: RED, marginTop: 2 }}>{seat}</div>
    </div>
    <div style={{ width: 150, borderLeft: `3px dashed ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 38, color: INK }}>{price}</div>
  </div>
);

const Bar: React.FC<{ label: string; at: number; fill: number; value: string; color: string; t: number; w?: number }> = ({ label, at, fill, value, color, t, w = 560 }) => {
  const p = interpolate(t, [at, at + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ opacity: fade(t, at), marginBottom: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: INK }}>{label}</span>
        <span style={{ fontFamily: fonts.bold, fontSize: 40, color }}>{value}</span>
      </div>
      <div style={{ width: w, height: 30, borderRadius: 15, background: "#EFEFEC" }}>
        <div style={{ width: Math.max(30, w * fill * p), height: 30, borderRadius: 15, background: color }} />
      </div>
    </div>
  );
};

const Panel: React.FC<{ w: Win; children: React.ReactNode }> = ({ w, children }) => {
  const { t } = useSec();
  const s = envelope(t, w);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateY(${-(1 - s) * PH}px)`, background: "#FFFFFF", boxShadow: "0 6px 0 rgba(0,0,0,0.04)", overflow: "hidden" }}>
      {children}
    </div>
  );
};

// Photo card (rounded, white border) for scenes.
const PhotoCard: React.FC<{ src: string; w: number; h: number; label?: string }> = ({ src, w, h, label }) => (
  <div style={{ width: w, padding: 10, background: "#fff", borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.28)" }}>
    <Img src={src} style={{ width: w - 20, height: h, objectFit: "cover", borderRadius: 16, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, padding: "10px 6px 2px" }}>{label}</div>}
  </div>
);

// Cut-out person sticker (white border baked into the PNG) with an Inter name tag.
const Cutout: React.FC<{ img: string; w: number; name?: string; rot?: number }> = ({ img, w, name, rot = 0 }) => (
  <div style={{ position: "relative", width: w, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}>
    <Img src={IMG(img)} style={{ width: w, display: "block" }} />
    {name && <div style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>{name}</div>}
  </div>
);

const Check: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={GREEN} /><path d="M11 21 L 17 27 L 29 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Row: React.FC<{ at: number; text: string; right?: string; color?: string; size?: number }> = ({ at, text, right, color = GREEN, size = 36 }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], clamp);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o, transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: size, color: INK }}>
      <span style={{ flex: 1 }}>{text}</span>
      {right && <span style={{ color, fontFamily: fonts.bold, fontSize: size + 2 }}>{right}</span>}
    </div>
  );
};

const Stamp: React.FC<{ at: number; text: string; size?: number; rot?: number }> = ({ at, text, size = 56, rot = -9 }) => {
  const { t } = useSec();
  const f = fade(t, at);
  return (
    <div style={{ transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * f})`, opacity: f, border: `7px solid ${RED}`, borderRadius: 16, padding: "6px 24px", color: RED, fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, background: "rgba(255,255,255,0.92)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// One-word captions: white on the speaker; while a panel is open they sit inside the panel, dark ink.
const Captions: React.FC<{ words: Word[]; split: number }> = ({ words, split }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  return (
    <div style={{ position: "absolute", top: inPanel ? PH - 104 : 1920 * 0.8, width: 1080, textAlign: "center", fontFamily: fonts.bold, fontSize: 54, color: inPanel ? INK : "#fff", letterSpacing: -0.5, textShadow: inPanel ? "none" : "0 2px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)", opacity: split > 0.05 && split < 0.95 ? 0 : 1 }}>
      {cur.text}
    </div>
  );
};

export const SatireKostenV2: React.FC<SatireKostenV2Props> = ({ src, seconds, words, c }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.Karten2 - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;
  const ticketPunch = t >= punchAt ? 1 + 0.12 * spring({ frame: frame - punchAt * fps, fps, config: { damping: 12, stiffness: 240, mass: 0.5 } }) : 1;
  const apart = interpolate(t, [c.getrennt - 0.05, c.getrennt + 0.3], [0, 1], { ...clamp, easing: ease });

  // the four dopamine panels (light level): number / term moments only, never on the punchline
  const P1: Win = { from: c.Dreihundert - 0.12, to: c.Montag - 0.08 }; // 300 €
  const P2: Win = { from: c.versunkene - 0.18, to: c.nur - 0.02 }; // term tile
  const P3: Win = { from: c.Zwei - 0.12, to: c.versteht - 0.08 }; // 2 Jahre, 1 Mio. €
  const P4: Win = { from: c.Kollegen - 0.12, to: c.Der - 0.1 }; // Kollegen fragen ChatGPT
  const split = Math.max(...[P1, P2, P3, P4].map((w) => envelope(t, w)));

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * 410.4 * (1 - drift * punch)}px, ${(1 - split) * 921.6 * (1 - drift * punch) + split * SPLIT_TY}px) scale(${(1 - split) * drift * punch + split * SPLIT_S})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail: serif title + Max & Lea as real-photo cutouts */}
      <SerifTitle from={0} to={P1.from} x={0} y={150} align="center" size={104} ink lines={[{ text: "Getrennt." }, { text: "Karten schon bezahlt.", italic: true }]} />
      <Sticker from={0} to={P1.from} x={845} y={800} rotate={0}>
        <div style={{ position: "relative", width: 330, height: 420 }}>
          <div style={{ position: "absolute", left: 40, top: -60 }}><Cutout img="lea.png" w={250} name="Lea" rot={-5} /></div>
          <div style={{ position: "absolute", left: 70, top: 215 }}><Cutout img="max.png" w={200} name="Max" rot={4} /></div>
        </div>
      </Sticker>
      {/* Konzertkarten: real concert photo */}
      <Sticker from={c.Konzertkarten - 0.08} to={P1.from} x={250} y={585} rotate={-3}>
        <PhotoCard src={IMG("concert.jpg")} w={390} h={230} label="2 Konzertkarten" />
      </Sticker>

      {/* Montag: getrennt */}
      <SerifTitle from={c.Montag - 0.1} to={c.Samstag - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Montag: getrennt", italic: true, at: c.getrennt - 0.1 }]} />
      <Sticker from={c.Montag - 0.05} to={c.Samstag - 0.05} x={540} y={470} rotate={0}>
        <div style={{ position: "relative", width: 600, height: 300 }}>
          <div style={{ position: "absolute", left: 50 - 50 * apart, top: 10 }}><Cutout img="max.png" w={230} name="Max" rot={-3 - 6 * apart} /></div>
          <div style={{ position: "absolute", left: 300 + 50 * apart, top: -10 }}><Cutout img="lea.png" w={260} name="Lea" rot={3 + 6 * apart} /></div>
          <svg width={60} height={340} style={{ position: "absolute", left: 270, top: -20, opacity: apart, overflow: "visible" }}>
            <path d="M30 0 L 18 55 L 40 100 L 16 155 L 42 210 L 20 260 L 34 320" fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - apart} />
          </svg>
        </div>
      </Sticker>

      {/* Samstag: nebeneinander in der ersten Reihe (concert photo + both cutouts) */}
      <Sticker from={c.Samstag - 0.08} to={P2.from} x={540} y={420} rotate={-1}>
        <div style={{ position: "relative", width: 700, height: 470 }}>
          <PhotoCard src={IMG("concert.jpg")} w={700} h={380} />
          <div style={{ position: "absolute", left: 18, top: 22, background: "#fff", borderRadius: 12, padding: "6px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK }}>Samstag · <span style={{ color: RED, opacity: fade(t, c.Reihe2) }}>1. Reihe</span></div>
          <div style={{ position: "absolute", left: 130, top: 200, opacity: fade(t, c.nebeneinander - 0.1) }}><Cutout img="max.png" w={210} rot={-3} /></div>
          <div style={{ position: "absolute", left: 360, top: 180, opacity: fade(t, c.nebeneinander) }}><Cutout img="lea.png" w={230} rot={3} /></div>
        </div>
      </Sticker>

      {/* "nur weil du schon bezahlt hast" card after the term tile */}
      <Sticker from={P2.to - 0.05} to={c.deshalb - 0.1} x={540} y={470} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={800} pad={22}>
            <Row at={P2.to - 0.05} text="Du machst weiter," />
            <Row at={P2.to} text="nur weil du" right="schon bezahlt hast" color={RED} size={34} />
          </Card>
          <Draw at={c.bezahlt + 0.05} w={320} h={140} d={CIRCLE} style={{ left: 410, top: 64, transform: "scale(1.27,0.68)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* Firmen-Chatbot intro (before P3) */}
      <Sticker from={c.deshalb - 0.1} to={P3.from} x={540} y={430} rotate={-1}>
        <Card w={720} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>Firmen-Chatbot</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY, marginTop: 4 }}>intern · eigene Entwicklung</div>
        </Card>
      </Sticker>

      {/* Versteht den Urlaubsantrag nicht */}
      <Sticker from={P3.to - 0.05} to={P4.from} x={540} y={430} rotate={0}>
        <Card w={820} pad={24} style={{ background: "#F4F6F9" }}>
          <div style={{ paddingBottom: 10, marginBottom: 14, borderBottom: "2px solid #E3E7EC", fontFamily: fonts.bold, fontSize: 28 }}>Firmen-Chatbot</div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}><Bubble me text="Wie stelle ich einen Urlaubsantrag?" size={32} /></div>
          <div style={{ position: "relative", marginTop: 16, opacity: fade(t, c.Urlaubsantrag + 0.25), display: "inline-block" }}>
            <Bubble text="Das habe ich leider nicht verstanden." size={32} />
            <div style={{ position: "absolute", left: 14, right: 14, bottom: 6, height: 6, borderRadius: 3, background: RED, transformOrigin: "left", transform: `scaleX(${interpolate(t, [c.Urlaubsantrag + 0.4, c.Urlaubsantrag + 0.7], [0, 1], clamp)})` }} />
          </div>
        </Card>
      </Sticker>

      {/* Wird nicht abgeschaltet, kriegt Update 2027 */}
      <Sticker from={P4.to - 0.05} to={c.Max2 - 0.05} x={540} y={420} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={24}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, paddingBottom: 10, marginBottom: 8, borderBottom: "2px solid #EFEFEF" }}>Firmen-Chatbot</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.semibold, fontSize: 34, color: INK, opacity: fade(t, c.abgeschaltet - 0.3) }}>
              <span style={{ flex: 1 }}>Abschalten?</span>
              <div style={{ width: 96, height: 54, borderRadius: 27, background: "#D9D9D9", position: "relative" }}><div style={{ position: "absolute", left: 6, top: 6, width: 42, height: 42, borderRadius: 21, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }} /></div>
              <span style={{ fontFamily: fonts.bold, color: RED }}>Nein</span>
            </div>
          </Card>
          <div style={{ position: "absolute", right: 120, bottom: -86 }}><Stamp at={c.Update} text="UPDATE 2027" /></div>
        </div>
      </Sticker>

      {/* Pointe: calm, uncovered. Serif title + both cutouts, then the paid ticket */}
      <SerifTitle from={c.Max2 - 0.1} to={seconds + 1} x={0} y={150} align="center" size={100} ink lines={[{ text: "Max und Lea" }, { text: "wieder zusammen", italic: true, at: c.zusammen - 0.1 }]} />
      <Sticker from={c.Max2 - 0.05} to={punchAt} x={540} y={560} rotate={0}>
        <div style={{ position: "relative", width: 560, height: 320 }}>
          <div style={{ position: "absolute", left: 40, top: 20 }}><Cutout img="max.png" w={230} name="Max" rot={-3} /></div>
          <div style={{ position: "absolute", left: 250, top: 0 }}><Cutout img="lea.png" w={260} name="Lea" rot={3} /></div>
        </div>
      </Sticker>
      <Sticker from={punchAt} to={seconds + 1} x={540} y={540} rotate={-3}>
        <div style={{ position: "relative", transform: `scale(${ticketPunch})` }}>
          <Ticket w={660} sub="Nächstes Konzert" seat="1. Reihe · 2 Karten" price="" />
          <div style={{ position: "absolute", right: 34, top: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: fade(t, c.gekauft) }}>
            <Check s={56} />
            <div style={{ fontFamily: fonts.bold, fontSize: 26, color: GREEN }}>bezahlt</div>
          </div>
        </div>
      </Sticker>

      {/* ---------- dopamine panels (light) ---------- */}
      <Panel w={P1}>
        <div style={{ position: "absolute", top: 130, width: 1080, textAlign: "center" }}><Label>2 Konzertkarten · 1. Reihe</Label></div>
        <div style={{ position: "absolute", top: 200, width: 1080, display: "flex", justifyContent: "center" }}>
          <Roller text="300 €" start={P1.from + 0.1} dur={0.75} size={190} />
        </div>
        {[0, 1].map((i) => {
          const at = P1.from + 0.25 + i * 0.28;
          const s = spring({ frame: frame - at * fps, fps, config: { damping: 15, stiffness: 170, mass: 0.7 } });
          return (
            <div key={i} style={{ position: "absolute", left: 200 + i * 40, top: 420 + i * 60, opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - s) * -260}px) rotate(${(i ? 3 : -4) * s}deg)` }}>
              <Ticket w={640} seat={`Reihe 1 · Platz ${i + 1}`} price="150 €" sub={i ? "für Lea" : "für Max"} />
            </div>
          );
        })}
      </Panel>

      <Panel w={P2}>
        <div style={{ position: "absolute", top: 150, width: 1080, textAlign: "center" }}><Label style={{ opacity: fade(t, P2.from + 0.1) }}>Ökonomen nennen das</Label></div>
        <div style={{ position: "absolute", top: 205, width: 1080, textAlign: "center", color: INK }}>
          <div style={{ fontFamily: serif, fontSize: 150, lineHeight: 1, letterSpacing: -2, opacity: fade(t, c.versunkene), transform: `translateY(${(1 - fade(t, c.versunkene)) * 16}px)` }}>Versunkene</div>
          <div style={{ fontFamily: serifItalic, fontSize: 150, lineHeight: 1.05, letterSpacing: -2, opacity: fade(t, c.versunkene + 0.3), transform: `translateY(${(1 - fade(t, c.versunkene + 0.3)) * 16}px)` }}>Kosten</div>
          <div style={{ width: interpolate(t, [c.versunkene + 0.35, c.versunkene + 0.8], [0, 360], { ...clamp, easing: ease }), height: 4, background: INK, margin: "18px auto 0", borderRadius: 2 }} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: GREY, marginTop: 22, opacity: fade(t, c.Du - 0.1) }}>engl. Sunk Cost Fallacy</div>
        </div>
      </Panel>

      <Panel w={P3}>
        <div style={{ position: "absolute", top: 130, width: 1080, textAlign: "center" }}><Label>Firmen-Chatbot · Kosten</Label></div>
        <div style={{ position: "absolute", top: 200, width: 1080, display: "flex", justifyContent: "center" }}>
          <Roller text="1.000.000 €" start={c.Zwei + 0.1} dur={c.Euro + 0.15 - (c.Zwei + 0.1)} size={150} />
        </div>
        <div style={{ position: "absolute", left: 160, top: 400 }}>
          <Bar t={t} label="Bauzeit" at={c.Zwei - 0.02} fill={1} value="2 Jahre" color={INK} w={760} />
          <Bar t={t} label="Versteht Urlaubsantrag" at={c.Million} fill={0.0} value="nein" color={RED} w={760} />
        </div>
      </Panel>

      <Panel w={P4}>
        <div style={{ position: "absolute", top: 120, width: 1080, textAlign: "center" }}><Label>Wen fragen die Kollegen?</Label></div>
        <div style={{ position: "absolute", left: 70, top: 200, transform: "rotate(-2deg)" }}>
          <PhotoCard src={IMG("office.jpg")} w={380} h={300} />
        </div>
        <div style={{ position: "absolute", left: 500, top: 230 }}>
          <Bar t={t} label="Firmen-Chatbot" at={c.Kollegen + 0.15} fill={0.04} value="2" color={RED} w={500} />
          <Bar t={t} label="ChatGPT, heimlich" at={c.heimlich - 0.05} fill={1} value="214" color={GREEN} w={500} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: GREY, opacity: fade(t, c.heimlich) }}>Fragen pro Woche · Beispiel</div>
        </div>
      </Panel>

      <Captions words={words} split={split} />
    </AbsoluteFill>
  );
};
