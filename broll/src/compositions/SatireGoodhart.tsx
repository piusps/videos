import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// "Zwanzig Komplimente" · Goodharts Gesetz (GPT-S @florentgpt, 2026-10-10).
// Built on SatireKostenV2 (Konzertkarten v3): light dopamine = 4 flat white split panels on number/term moments,
// real CC0 stock photos (sources.txt), Instrument Serif + Inter only, punchline calm and uncovered.
export type SatireGoodhartProps = { src: string; seconds: number; words: Word[]; c: Record<string, number>; splitS: number; splitTx: number; splitTy: number };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#10A37F";
const GREY = "#8A8A8A";
const IMG = (f: string) => staticFile(`gpts-effekt-goodhart/img/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], clamp);
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const PH = 800;
const IN = 0.24;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }));

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], clamp);
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", pointerEvents: "none", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = GREY, size = 34, style }) => (
  <div style={{ fontFamily: fonts.semibold, fontSize: size, color, ...style }}>{children}</div>
);

// flat count-up number (tabular), no glow
const Count: React.FC<{ from: number; to: number; a: number; b: number; size: number; color?: string }> = ({ from, to, a, b, size, color = INK }) => {
  const { t } = useSec();
  const n = Math.round(interpolate(t, [a, b], [from, to], { ...clamp, easing: Easing.out(Easing.quad) }));
  const pop = interpolate(t, [b, b + 0.08, b + 0.25], [1, 1.08, 1], clamp);
  return <div style={{ fontFamily: fonts.bold, fontSize: size, color, letterSpacing: -3, lineHeight: 1, fontVariantNumeric: "tabular-nums", transform: `scale(${pop})` }}>{n}</div>;
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

const PhotoCard: React.FC<{ src: string; w: number; h: number; label?: string; pos?: string }> = ({ src, w, h, label, pos = "center" }) => (
  <div style={{ width: w, padding: 10, background: "#fff", borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.28)" }}>
    <Img src={src} style={{ width: w - 20, height: h, objectFit: "cover", objectPosition: pos, borderRadius: 16, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, padding: "10px 6px 2px" }}>{label}</div>}
  </div>
);

const Cutout: React.FC<{ img: string; w: number; name?: string; rot?: number }> = ({ img, w, name, rot = 0 }) => (
  <div style={{ position: "relative", width: w, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}>
    <Img src={IMG(img)} style={{ width: w, display: "block" }} />
    {name && <div style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>{name}</div>}
  </div>
);

const Stamp: React.FC<{ at: number; text: string; size?: number; rot?: number }> = ({ at, text, size = 56, rot = -9 }) => {
  const { t } = useSec();
  const f = fade(t, at);
  return (
    <div style={{ transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * f})`, opacity: f, border: `7px solid ${RED}`, borderRadius: 16, padding: "6px 24px", color: RED, fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, background: "rgba(255,255,255,0.94)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// chat stack: bubbles appear at their time and push the older ones up (bottom-anchored, clipped)
const ChatStack: React.FC<{ items: { at: number; text: string; me?: boolean }[]; h: number; w: number; size?: number; gap?: number }> = ({ items, h, w, size = 32, gap = 14 }) => {
  const { t } = useSec();
  const shown = items.filter((m) => t >= m.at - 0.04);
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap }}>
      {shown.map((m, i) => {
        const o = interpolate(t, [m.at - 0.04, m.at + 0.1], [0, 1], clamp);
        return (
          <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start", opacity: o, transform: `translateY(${(1 - o) * 24}px) scale(${0.9 + 0.1 * o})`, transformOrigin: m.me ? "right bottom" : "left bottom", flexShrink: 0 }}>
            <Bubble me={m.me} text={m.text} size={size} />
          </div>
        );
      })}
    </div>
  );
};

const Bar: React.FC<{ label: string; at: number; fill: number; value: string; color: string; t: number; w: number; dur?: number; tag?: React.ReactNode }> = ({ label, at, fill, value, color, t, w, dur = 0.5, tag }) => {
  const p = interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ marginBottom: 22, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: INK }}>{label}</span>
        <span style={{ fontFamily: fonts.bold, fontSize: 38, color }}>{value}</span>
      </div>
      <div style={{ width: w, height: 30, borderRadius: 15, background: "#EFEFEC" }}>
        <div style={{ width: Math.max(30, w * fill * p), height: 30, borderRadius: 15, background: color }} />
      </div>
      {tag}
    </div>
  );
};

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

export const SatireGoodhart: React.FC<SatireGoodhartProps> = ({ src, seconds, words, c, splitS, splitTx, splitTy }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.wievielte - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  // four light dopamine panels (term / number moments), never on the punchline
  const P1: Win = { from: c.zwanzig - 0.12, to: c.Steuererklaerung + 0.7 }; // chat Max -> Lea, 1 -> 20
  const P2: Win = { from: c.Goodharts - 0.18, to: c.genau - 0.25 }; // term tile
  const P3: Win = { from: c.benutzt - 0.3, to: c.Also + 0.1 }; // dashboard
  const P4: Win = { from: c.fuenfzigmal - 0.12, to: c.Max2 - 0.08 }; // 50x Wetter + Mitarbeiter des Monats
  const split = Math.max(...[P1, P2, P3, P4].map((w) => envelope(t, w)));

  const sc = (1 - split) * drift * punch + split * splitS;
  const tx = (1 - split) * 540 * (1 - drift * punch) + split * splitTx;
  const ty = (1 - split) * 960 * (1 - drift * punch) + split * splitTy;

  // P1 bubbles: filler compliments fire fast, then the three spoken ones
  const p1s = P1.from + 0.15;
  const fill = ["Guten Morgen, Schöne.", "Tolle Schuhe.", "Du riechst gut.", "Schöne Augen."];
  const p1Items = [
    ...fill.map((text, i) => ({ at: p1s + i * 0.12, text, me: true })),
    { at: c.Haare, text: "Deine Haare sind toll.", me: true },
    { at: c.Lachen, text: "Dein Lachen ist so schön.", me: true },
    { at: c.Steuererklaerung, text: "Deine Steuererklärung ist wunderschön.", me: true },
  ];

  // P4: "Wie wird das Wetter?" stacking fast
  const p4s = P4.from + 0.12;
  const wetter = Array.from({ length: 12 }).map((_, i) => ({ at: p4s + i * 0.11, text: "Wie wird das Wetter?", me: true }));

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Date - 0.08} x={0} y={150} align="center" size={104} ink lines={[{ text: "Zwanzig Komplimente" }, { text: "am Tag.", italic: true }]} />
      <Sticker from={0} to={c.Date - 0.08} x={540} y={530} rotate={0}>
        <div style={{ position: "relative", width: 460, height: 260 }}>
          <div style={{ position: "absolute", left: 30, top: 20 }}><Cutout img="max.png" w={180} name="Max" rot={-4} /></div>
          <div style={{ position: "absolute", left: 230, top: 0 }}><Cutout img="lea.png" w={200} name="Lea" rot={4} /></div>
        </div>
      </Sticker>
      {/* erstes Date: candle dinner + Lea's line */}
      <Sticker from={c.Date - 0.08} to={P1.from} x={540} y={470} rotate={-2}>
        <div style={{ position: "relative", width: 640, height: 400 }}>
          <PhotoCard src={IMG("dinner.jpg")} w={640} h={330} label="Erstes Date" />
          <div style={{ position: "absolute", right: -10, top: -40, opacity: fade(t, c.Komplimente - 0.2), transform: "rotate(3deg)" }}>
            <Bubble text="Ich mag Männer, die Komplimente machen." size={28} />
          </div>
        </div>
      </Sticker>

      {/* Lea weiß nicht mehr, welches er ernst meint */}
      <Sticker from={P1.to - 0.05} to={P2.from} x={540} y={440} rotate={0}>
        <div style={{ position: "relative", width: 760, height: 330 }}>
          <div style={{ position: "absolute", left: 270, top: 0 }}><Cutout img="lea.png" w={220} name="Lea" /></div>
          {[{ s: "Haare?", x: 0, y: 40, r: -5 }, { s: "Lachen?", x: 540, y: 30, r: 4 }, { s: "Steuererklärung?", x: 490, y: 170, r: -3 }].map((q, i) => (
            <div key={i} style={{ position: "absolute", left: q.x, top: q.y, transform: `rotate(${q.r}deg)`, opacity: fade(t, P1.to + 0.1 + i * 0.15) }}>
              <Card w={q.s.length > 10 ? 290 : 210} pad={16}><div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, textAlign: "center" }}>{q.s}</div></Card>
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, top: 200, fontFamily: serifItalic, fontSize: 64, color: RED, transform: "rotate(-4deg)", opacity: fade(t, c.ernst - 0.1) }}>ernst gemeint?</div>
        </div>
      </Sticker>

      {/* deine Firma mit KI */}
      <Sticker from={P2.to - 0.05} to={c.Chef - 0.08} x={540} y={470} rotate={-2}>
        <PhotoCard src={IMG("buero.jpg")} w={600} h={300} label="Deine Firma · jetzt mit KI" />
      </Sticker>
      {/* Chef zählt */}
      <Sticker from={c.Chef - 0.08} to={P3.from} x={540} y={470} rotate={2}>
        <div style={{ position: "relative" }}>
          <PhotoCard src={IMG("chef.jpg")} w={580} h={300} label="Dein Chef" pos="20% 30%" />
          <div style={{ position: "absolute", right: -30, top: -30, opacity: fade(t, c.zaehlt) }}>
            <Card w={260} pad={16}><div style={{ fontFamily: fonts.semibold, fontSize: 24, color: GREY }}>ChatGPT-Anfragen</div><div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>wird gezählt</div></Card>
          </div>
        </div>
      </Sticker>
      {/* Kollege */}
      <Sticker from={P3.to - 0.05} to={P4.from} x={540} y={470} rotate={-2}>
        <div style={{ position: "relative" }}>
          <PhotoCard src={IMG("kollege.jpg")} w={580} h={300} label="Dein Kollege" pos="50% 25%" />
          <div style={{ position: "absolute", left: -20, top: -34, opacity: fade(t, c.Morgen - 0.1) }}>
            <Card w={250} pad={14}><div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK }}>Jeden Morgen</div></Card>
          </div>
        </div>
      </Sticker>

      {/* Pointe: calm, uncovered */}
      <Sticker from={c.Max2 - 0.05} to={seconds + 1} x={540} y={450} rotate={0}>
        <div style={{ position: "relative", width: 820, height: 380 }}>
          <div style={{ position: "absolute", left: 160, top: 130 }}><Cutout img="max.png" w={190} name="Max" rot={-3} /></div>
          <div style={{ position: "absolute", left: 450, top: 115 }}><Cutout img="lea.png" w={210} name="Lea" rot={3} /></div>
          <div style={{ position: "absolute", left: 0, top: 10, opacity: fade(t, c.schoen - 0.5) }}>
            <Bubble me text="Du siehst heute besonders schön aus." size={30} />
          </div>
          <div style={{ position: "absolute", right: 0, top: 80, opacity: fade(t, c.wievielte - 0.1), transform: `scale(${t >= punchAt ? 1 + 0.1 * (1 - spring({ frame: frame - punchAt * fps, fps, config: { damping: 12, stiffness: 240, mass: 0.5 } })) : 1})`, transformOrigin: "right top" }}>
            <Bubble text="Das wievielte war das heute?" size={32} />
          </div>
        </div>
      </Sticker>

      {/* ---------- dopamine panels (light) ---------- */}
      <Panel w={P1}>
        <div style={{ position: "absolute", left: 70, top: 70, width: 300 }}>
          <Label>Komplimente heute</Label>
          <div style={{ marginTop: 8 }}><Count from={1} to={20} a={P1.from + 0.1} b={c.Steuererklaerung} size={200} /></div>
          <Label size={30} style={{ marginTop: 6 }}>von Max an Lea</Label>
        </div>
        <div style={{ position: "absolute", left: 390, top: 50 }}>
          <ChatStack items={p1Items} h={620} w={640} size={30} gap={12} />
          <Draw at={c.Steuererklaerung + 0.25} w={320} h={140} d={CIRCLE} style={{ left: 40, top: 528, transform: "scale(1.95,0.75)", transformOrigin: "0 0" }} />
        </div>
      </Panel>

      <Panel w={P2}>
        <div style={{ position: "absolute", top: 110, width: 1080, textAlign: "center" }}><Label style={{ opacity: fade(t, P2.from + 0.1) }}>Ökonomen nennen das</Label></div>
        <div style={{ position: "absolute", top: 165, width: 1080, textAlign: "center", color: INK }}>
          <div style={{ fontFamily: serif, fontSize: 150, lineHeight: 1, letterSpacing: -2, opacity: fade(t, c.Goodharts), transform: `translateY(${(1 - fade(t, c.Goodharts)) * 16}px)` }}>Goodharts</div>
          <div style={{ fontFamily: serifItalic, fontSize: 150, lineHeight: 1.05, letterSpacing: -2, opacity: fade(t, c.Goodharts + 0.3), transform: `translateY(${(1 - fade(t, c.Goodharts + 0.3)) * 16}px)` }}>Gesetz</div>
          <div style={{ width: interpolate(t, [c.Goodharts + 0.35, c.Goodharts + 0.8], [0, 360], { ...clamp, easing: ease }), height: 4, background: INK, margin: "16px auto 0", borderRadius: 2 }} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 36, color: INK, marginTop: 24, padding: "0 110px", lineHeight: 1.25, opacity: fade(t, c.Wenn - 0.05) }}>Wenn eine Zahl zum Ziel wird, sagt sie nichts mehr aus.</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY, marginTop: 14, opacity: fade(t, c.Wenn + 0.3) }}>engl. Goodhart's Law · Ökonom Charles Goodhart, 1975</div>
        </div>
      </Panel>

      <Panel w={P3}>
        <div style={{ position: "absolute", top: 70, width: 1080, textAlign: "center" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 46, color: INK }}>KI-Nutzung diese Woche</div>
          <Label size={26} style={{ marginTop: 4 }}>ChatGPT-Anfragen pro Person · Beispiel</Label>
        </div>
        <div style={{ position: "absolute", left: 150, top: 215 }}>
          <Bar t={t} label="Anna" at={P3.from + 0.15} fill={0.22} value="38" color={INK} w={780} />
          <Bar t={t} label="Jonas" at={P3.from + 0.22} fill={0.17} value="29" color={INK} w={780} />
          <Bar t={t} label="Du" at={P3.from + 0.29} fill={0.04} value="6" color={RED} w={780}
            tag={<div style={{ position: "absolute", left: 120, top: -10, opacity: fade(t, c.Bremse - 0.05) }}><Stamp at={c.Bremse - 0.05} text="BREMSE" size={34} rot={-6} /></div>} />
          <div style={{ position: "relative" }}>
            <Bar t={t} label="Dein Kollege" at={P3.from + 0.45} dur={0.4} fill={1} value="250" color={GREEN} w={780} />
            <Draw at={P3.from + 0.9} w={320} h={140} d={CIRCLE} style={{ left: 600, top: -38, transform: "scale(0.75,0.75)", transformOrigin: "0 0" }} />
          </div>
        </div>
      </Panel>

      <Panel w={P4}>
        <div style={{ position: "absolute", left: 40, top: 40 }}>
          <Label size={30} style={{ marginBottom: 8, paddingLeft: 10 }}>Kollege an ChatGPT · 7:00 Uhr</Label>
          <ChatStack items={wetter} h={600} w={520} size={30} gap={10} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 60, width: 440, textAlign: "center" }}>
          <Label size={30}>Anfragen heute</Label>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}><Count from={1} to={50} a={P4.from + 0.1} b={c.Wetter + 0.2} size={170} /></div>
        </div>
        <div style={{ position: "absolute", left: 610, top: 300, opacity: 1 - fade(t, c.Mitarbeiter - 0.1) }}>
          <PhotoCard src={IMG("regen.jpg")} w={420} h={240} label="Wetter: Regen" />
        </div>
        {/* employee-of-the-month plaque (flat mockup with the real colleague photo) */}
        <div style={{ position: "absolute", left: 615, top: 250, opacity: fade(t, c.Mitarbeiter - 0.1), transform: `translateY(${(1 - fade(t, c.Mitarbeiter - 0.1)) * 30}px)` }}>
          <div style={{ width: 410, background: "#fff", border: `3px solid ${INK}`, borderRadius: 14, padding: 16, boxShadow: "0 16px 36px rgba(0,0,0,0.18)", textAlign: "center" }}>
            <Img src={IMG("kollege.jpg")} style={{ width: 374, height: 220, objectFit: "cover", objectPosition: "50% 25%", borderRadius: 8, display: "block" }} />
            <div style={{ fontFamily: serif, fontSize: 46, color: INK, marginTop: 10, lineHeight: 1 }}>Mitarbeiter</div>
            <div style={{ fontFamily: serifItalic, fontSize: 46, color: INK, lineHeight: 1.05 }}>des Monats</div>
          </div>
          <div style={{ position: "absolute", left: -60, top: 110 }}><Stamp at={c.Monats - 0.05} text="MITARBEITER DES MONATS" size={30} rot={-10} /></div>
        </div>
      </Panel>

      <Captions words={words} split={split} />
    </AbsoluteFill>
  );
};
