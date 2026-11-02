import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, WordCaptions, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// Effekt-Satire "Versunkene Kosten" (gpt-effekt-satire, GPT-S @florentgpt, Slot 2026-10-09 20:00).
// Max und Lea, Konzertkarten, Firmen-Chatbot. Copy of SatireFluch, content swapped. Icons drawn as SVG, no emojis.
export type SatireKostenProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#1FA45A";
const GREY = "#8A8A8A";

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Photo: React.FC<{ img: string; w?: number; label?: string }> = ({ img, w = 330, label }) => (
  <div style={{ width: w, padding: 10, paddingBottom: label ? 8 : 10, background: "#fff", borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
    <Img src={staticFile(`gpts-effekt-versunkene-kosten/img/${img}.png`)} style={{ width: w - 20, height: (w - 20) * 1.25, objectFit: "cover", borderRadius: 14, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: w < 260 ? 24 : 28, color: INK, padding: "8px 4px 2px" }}>{label}</div>}
  </div>
);

// Concert ticket with perforated stub.
const Ticket: React.FC<{ w: number; title: string; sub: string; price?: string; seat?: string; tint?: string }> = ({ w, title, sub, price, seat, tint = "#6C3BE4" }) => (
  <div style={{ width: w, display: "flex", borderRadius: 18, overflow: "hidden", boxShadow: "0 14px 34px rgba(0,0,0,0.28)", background: "#fff" }}>
    <div style={{ flex: 1, padding: "18px 22px", background: `linear-gradient(135deg, ${tint}, #E0457B)`, color: "#fff" }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 22, letterSpacing: 3, opacity: 0.85 }}>KONZERT · TICKET</div>
      <div style={{ fontFamily: fonts.bold, fontSize: 40, marginTop: 4 }}>{title}</div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 26, opacity: 0.9, marginTop: 2 }}>{sub}</div>
    </div>
    <div style={{ width: 170, borderLeft: "4px dashed #D6D6D6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, gap: 4 }}>
      {seat && <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: GREY }}>{seat}</div>}
      {price && <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>{price}</div>}
    </div>
  </div>
);

const Bot: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60">
    <line x1="30" y1="6" x2="30" y2="14" stroke="#5B6B7E" strokeWidth="3" />
    <circle cx="30" cy="6" r="4" fill={RED} />
    <rect x="8" y="14" width="44" height="34" rx="10" fill="#DCE4EE" stroke="#5B6B7E" strokeWidth="3" />
    <circle cx="22" cy="30" r="5" fill="#2B3A4C" />
    <circle cx="38" cy="30" r="5" fill="#2B3A4C" />
    <path d="M22 41 H 38" stroke="#2B3A4C" strokeWidth="3" strokeLinecap="round" />
    <rect x="2" y="24" width="6" height="12" rx="3" fill="#5B6B7E" />
    <rect x="52" y="24" width="6" height="12" rx="3" fill="#5B6B7E" />
  </svg>
);

const GptLogo: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ width: s, height: s, borderRadius: s / 2, background: "#0F0F0F", display: "grid", placeItems: "center" }}>
    <svg width={s * 0.62} height={s * 0.62} viewBox="0 0 40 40">
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx="20" cy="12" rx="6" ry="9" fill="none" stroke="#fff" strokeWidth="2.6" transform={`rotate(${r} 20 20)`} />
      ))}
    </svg>
  </div>
);

const Person: React.FC<{ s: number; color?: string }> = ({ s, color = "#C9D3DE" }) => (
  <svg width={s} height={s} viewBox="0 0 60 60">
    <circle cx="30" cy="20" r="11" fill={color} />
    <path d="M8 56 C 8 38, 52 38, 52 56 Z" fill={color} />
  </svg>
);

const Heart: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60">
    <path d="M30 52 C 10 38, 4 28, 6 18 C 8 8, 22 4, 30 16 C 38 4, 52 8, 54 18 C 56 28, 50 38, 30 52 Z" fill={RED} stroke="#A32025" strokeWidth="2.5" />
  </svg>
);

const Check: React.FC<{ s: number; color?: string }> = ({ s, color = GREEN }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={color} /><path d="M11 21 L 17 27 L 29 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Row: React.FC<{ at: number; icon?: React.ReactNode; text: string; right?: string; color?: string; size?: number }> = ({ at, icon, text, right, color = GREEN, size = 36 }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o, transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: size, color: INK }}>
      {icon}
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

export const SatireKosten: React.FC<SatireKostenProps> = ({ src, seconds, words, c }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.Karten2 - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;
  const ticketPunch = t >= punchAt ? 1 + 0.16 * spring({ frame: frame - punchAt * fps, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } }) : 1;
  const split = interpolate(t, [c.getrennt - 0.05, c.getrennt + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Montag - 0.05} x={0} y={150} align="center" size={104} ink lines={[{ text: "Getrennt." }, { text: "Karten schon bezahlt.", italic: true }]} />
      <Sticker from={0} to={c.Montag - 0.05} x={850} y={890} rotate={0}>
        <div style={{ position: "relative", width: 260, height: 330 }}>
          {([["lea", "Lea", -8, -40, -180], ["max", "Max", 4, 10, 30]] as [string, string, number, number, number][]).map(([img, label, rot, dx, dy]) => (
            <div key={img} style={{ position: "absolute", left: 20 + dx, top: dy, transform: `rotate(${rot}deg)` }}>
              <Photo img={img} label={label} w={220} />
            </div>
          ))}
        </div>
      </Sticker>

      {/* Konzertkarten: 300 €, 1. Reihe (below the hook title) */}
      <Sticker from={c.Konzertkarten - 0.08} to={c.Montag - 0.05} x={500} y={510} rotate={-3}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ position: "absolute", left: 22, top: -22, transform: "rotate(-4deg)", opacity: 0.9 }}><Ticket w={640} title="2 × Konzertkarte" sub="für Max & Lea" /></div>
          <div style={{ position: "relative" }}>
            <Ticket w={640} title="2 × Konzertkarte" sub={fade(t, c.Reihe) > 0.5 ? "1. Reihe · Sa 20:00" : "Sa 20:00"} seat="gesamt" price={t >= c.Dreihundert - 0.05 ? "300 €" : ""} />
          </div>
          <Draw at={c.Dreihundert + 0.05} w={320} h={140} d={CIRCLE} style={{ left: 452, top: 18, transform: "scale(0.66,0.92)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* Montag: getrennt */}
      <SerifTitle from={c.Montag - 0.1} to={c.Samstag - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Montag: getrennt", italic: true, at: c.getrennt - 0.1 }]} />
      <Sticker from={c.Montag - 0.05} to={c.Samstag - 0.05} x={540} y={450} rotate={0}>
        <div style={{ position: "relative", width: 520, height: 300 }}>
          <div style={{ position: "absolute", left: 40 - 40 * split, top: 0, transform: `rotate(${-3 - 7 * split}deg)` }}><Photo img="max" label="Max" w={200} /></div>
          <div style={{ position: "absolute", left: 280 + 40 * split, top: 0, transform: `rotate(${3 + 7 * split}deg)` }}><Photo img="lea2" label="Lea" w={200} /></div>
          <svg width={60} height={320} style={{ position: "absolute", left: 230, top: -10, opacity: split, overflow: "visible" }}>
            <path d="M30 0 L 18 55 L 40 100 L 16 155 L 42 210 L 20 260 L 34 320" fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - split} />
          </svg>
        </div>
      </Sticker>

      {/* Samstag: nebeneinander in der ersten Reihe */}
      <Sticker from={c.Samstag - 0.08} to={c.Oekonomen - 0.05} x={540} y={340} rotate={-1}>
        <Card w={600} pad={20}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 12, borderBottom: "2px solid #EFEFEF" }}><span>Samstag · Konzert</span><span style={{ color: RED, opacity: fade(t, c.Reihe2) }}>1. Reihe</span></div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", opacity: fade(t, c.nebeneinander) }}>
            <div style={{ transform: "rotate(-3deg)" }}><Photo img="max" label="Platz 1 · Max" w={210} /></div>
            <div style={{ transform: "rotate(3deg)" }}><Photo img="lea2" label="Platz 2 · Lea" w={210} /></div>
          </div>
        </Card>
      </Sticker>

      {/* Versunkene Kosten: genau beim Wort */}
      <SerifTitle from={c.versunkene - 0.08} to={c.deshalb - 0.1} x={0} y={120} align="center" size={116} ink lines={[{ text: "Versunkene" }, { text: "Kosten", italic: true }]} />
      <Sticker from={c.Du - 0.1} to={c.deshalb - 0.1} x={540} y={480} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={800} pad={22}>
            <Row at={c.Du} text="Du machst weiter," right="" />
            <Row at={c.nur} text="nur weil du" right="schon bezahlt hast" color={RED} size={34} />
          </Card>
          <Draw at={c.bezahlt + 0.05} w={320} h={140} d={CIRCLE} style={{ left: 410, top: 64, transform: "scale(1.27,0.68)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* Firmen-Chatbot: 2 Jahre, 1 Mio. € */}
      <Sticker from={c.deshalb - 0.1} to={c.versteht - 0.05} x={540} y={400} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={780} pad={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 10, marginBottom: 6, borderBottom: "2px solid #EFEFEF" }}>
              <Bot s={64} />
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 36, color: INK }}>Firmen-Chatbot</div>
                <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: GREY }}>intern · eigene Entwicklung</div>
              </div>
            </div>
            <Row at={c.Zwei} text="Bauzeit" right="2 Jahre" color={INK} />
            <Row at={c.Million} text="Kosten" right="1 Mio. €" color={INK} />
          </Card>
          <Draw at={c.Euro + 0.05} w={320} h={140} d={CIRCLE} style={{ left: 506, top: 178, transform: "scale(0.86,0.7)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* Versteht den Urlaubsantrag nicht */}
      <Sticker from={c.versteht - 0.1} to={c.Kollegen - 0.05} x={540} y={430} rotate={0}>
        <Card w={820} pad={24} style={{ background: "#F4F6F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 10, marginBottom: 14, borderBottom: "2px solid #E3E7EC", fontFamily: fonts.bold, fontSize: 28 }}><Bot s={40} /> Firmen-Chatbot</div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}><Bubble me text="Wie stelle ich einen Urlaubsantrag?" size={32} /></div>
          <div style={{ position: "relative", marginTop: 16, opacity: fade(t, c.Urlaubsantrag + 0.25), display: "inline-block" }}>
            <Bubble text="Das habe ich leider nicht verstanden." size={32} />
            <div style={{ position: "absolute", left: 14, right: 14, bottom: 6, height: 6, borderRadius: 3, background: RED, transformOrigin: "left", transform: `scaleX(${interpolate(t, [c.Urlaubsantrag + 0.4, c.Urlaubsantrag + 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }} />
          </div>
        </Card>
      </Sticker>

      {/* Kollegen fragen heimlich ChatGPT */}
      <Sticker from={c.Kollegen - 0.1} to={c.Der - 0.05} x={540} y={430} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={800} pad={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 10, marginBottom: 14, borderBottom: "2px solid #EFEFEF" }}>
              <GptLogo s={46} />
              <div style={{ fontFamily: fonts.bold, fontSize: 32 }}>ChatGPT</div>
              <div style={{ marginLeft: "auto", fontFamily: fonts.semibold, fontSize: 24, color: GREY }}>privater Tab</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: fade(t, c.ChatGPT) }}><Bubble me text="Wie stell ich bei uns Urlaub ein?" size={30} /></div>
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ opacity: fade(t, c.Kollegen + i * 0.08) }}><Person s={58} /></div>
              ))}
              <div style={{ alignSelf: "center", marginLeft: 8, fontFamily: fonts.semibold, fontSize: 26, color: GREY, opacity: fade(t, c.Kollegen + 0.5) }}>alle Kollegen</div>
            </div>
          </Card>
          <div style={{ position: "absolute", right: -30, top: -62 }}><Stamp at={c.heimlich} text="PSST, HEIMLICH" size={36} rot={6} /></div>
        </div>
      </Sticker>

      {/* Wird nicht abgeschaltet, kriegt Update 2027 */}
      <Sticker from={c.Der - 0.1} to={c.Max2 - 0.05} x={540} y={420} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 10, marginBottom: 8, borderBottom: "2px solid #EFEFEF" }}>
              <Bot s={56} />
              <div style={{ fontFamily: fonts.bold, fontSize: 34 }}>Firmen-Chatbot</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.semibold, fontSize: 34, color: INK, opacity: fade(t, c.abgeschaltet - 0.3) }}>
              <span style={{ flex: 1 }}>Abschalten?</span>
              <div style={{ width: 96, height: 54, borderRadius: 27, background: "#D9D9D9", position: "relative" }}><div style={{ position: "absolute", left: 6, top: 6, width: 42, height: 42, borderRadius: 21, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }} /></div>
              <span style={{ fontFamily: fonts.bold, color: RED }}>Nein</span>
            </div>
          </Card>
          <div style={{ position: "absolute", right: 120, bottom: -86 }}><Stamp at={c.Update} text="UPDATE 2027" /></div>
        </div>
      </Sticker>

      {/* Pointe: wieder zusammen, neue Karten */}
      <SerifTitle from={c.Max2 - 0.1} to={seconds + 1} x={0} y={150} align="center" size={100} ink lines={[{ text: "Max und Lea" }, { text: "wieder zusammen", italic: true, at: c.zusammen - 0.1 }]} />
      <Sticker from={c.Max2 - 0.05} to={punchAt} x={850} y={900} rotate={-3}>
        <div style={{ position: "relative", display: "flex", gap: 10 }}>
          <Photo img="max" label="Max" w={210} />
          <Photo img="lea2" label="Lea" w={210} />
          <div style={{ position: "absolute", left: 180, top: 110, opacity: fade(t, c.zusammen), transform: `scale(${0.5 + 0.5 * fade(t, c.zusammen)})` }}><Heart s={84} /></div>
        </div>
      </Sticker>
      <Sticker from={punchAt} to={seconds + 1} x={540} y={540} rotate={-4}>
        <div style={{ position: "relative", transform: `scale(${ticketPunch})` }}>
          <Ticket w={640} title="2 × Konzertkarte" sub="nächstes Konzert · 1. Reihe" price="" tint="#1F6FEB" />
          <div style={{ position: "absolute", right: 48, top: 34, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: fade(t, c.gekauft) }}>
            <Check s={56} />
            <div style={{ fontFamily: serifItalic, fontSize: 30, color: GREEN }}>bezahlt</div>
          </div>
        </div>
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
