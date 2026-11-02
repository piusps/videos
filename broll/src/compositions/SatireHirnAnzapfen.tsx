import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, MailHead, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// FP-S "Hirn anzapfen" (@florent_preusser, slot 2026-10-10 12:00), seated white-wall look f4f3ac11.
// Style: video-satire-edit + "GPT-Satire Stil" (Henri 2026-10-09/10, now also for FP-S):
// - light dopamine: 3 calm flat white split panels on number moments (2,40 €/h, 12 Seiten, 600 € - 4,80 €)
// - real CC0 stock photos (Wikimedia/Unsplash, StockSnap), cut-outs with white border; no emoji, no clipart
// - two fonts only: Instrument Serif (SatireKit serif) + Inter (fonts.*); no glow, no gradient
// - no CTA, no dopamine hook; punchline "Im Viertelstundentakt" stays calm and uncovered
// Prebuilt BEFORE the avatar exists: c = estimated cue seconds (see runs/fps-hirn-anzapfen/edit-plan.md),
// src "" renders a grey placeholder. After the render: mkcues.py -> props.json (real c + words),
// facefocus.py -> face {x,y,box} for the split framing, then stills + render.
export type SatireHirnAnzapfenProps = {
  src: string;
  seconds: number;
  words: Word[];
  c: Record<string, number>;
  face?: { x: number; y: number; box: number }; // median face centre (px in 1080x1920 source) + Vision face box height (px)
};

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#2E9E5B";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const IMG = (f: string) => staticFile(`fps-hirn-anzapfen/img/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], clamp);
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// ---------- split panels ----------
const PH = 800; // panel height (top); speaker area below = 1120 px (58 %)
const IN = 0.24;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }));

// Split framing per "Sprecher-Framing im Split": scale >= 1 (no side gaps), face horizontally centred,
// hair top to chin centred in the speaker area with air above the head.
const splitFrame = (face: { x: number; y: number; box: number }) => {
  const head = face.box * 1.55; // hair top (~0.45 box above face box) to chin (~0.1 box below)
  const S = Math.min(1.6, Math.max(1.0, (1120 * 0.62) / head));
  const tx = Math.min(0, Math.max(1080 - 1080 * S, 540 - S * face.x));
  const headCentre = face.y - face.box * 0.05;
  const ty = Math.min(PH, Math.max(1920 - 1920 * S, PH + 1120 * 0.5 - S * headCentre));
  return { S, tx, ty };
};

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

// Flat slot counter (from SatireKostenV2): each digit rolls on its own strip. No glow, no blur.
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
        const p = interpolate(t, [start + k * 0.05, start + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const v = p * ((2 + (digitsTotal - k)) * 10 + d);
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

const PhotoCard: React.FC<{ src: string; w: number; h: number; label?: string }> = ({ src, w, h, label }) => (
  <div style={{ width: w, padding: 10, background: "#fff", borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.28)" }}>
    <Img src={src} style={{ width: w - 20, height: h, objectFit: "cover", borderRadius: 16, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, padding: "10px 6px 2px" }}>{label}</div>}
  </div>
);

// Cut-out sticker (white border baked into the PNG) with an Inter name tag.
// Fallback (lift blocked 2026-10-10): .jpg = rounded photo card with white border, cropped on the subject.
const CROP: Record<string, string> = { "steuerberater.jpg": "50% 20%" };
const Cutout: React.FC<{ img: string; w: number; name?: string; rot?: number }> = ({ img, w, name, rot = 0 }) => (
  <div style={{ position: "relative", width: w, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}>
    {img.endsWith(".png") ? (
      <Img src={IMG(img)} style={{ width: w, display: "block" }} />
    ) : (
      <div style={{ width: w, padding: 9, background: "#fff", borderRadius: 26 }}>
        <Img src={IMG(img)} style={{ width: w - 18, height: (w - 18) * (img === "steuerberater.jpg" ? 1.3 : 0.85), objectFit: "cover", objectPosition: CROP[img] ?? "50% 50%", borderRadius: 18, display: "block" }} />
      </div>
    )}
    {name && <div style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>{name}</div>}
  </div>
);

const PriceTag: React.FC<{ text: string; rot?: number }> = ({ text, rot = 8 }) => (
  <div style={{ display: "flex", alignItems: "center", transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.22))" }}>
    <div style={{ width: 0, height: 0, borderTop: "38px solid transparent", borderBottom: "38px solid transparent", borderRight: `34px solid #fff` }} />
    <div style={{ height: 76, background: "#fff", borderRadius: "0 14px 14px 0", padding: "0 26px 0 12px", display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.bold, fontSize: 44, color: INK, whiteSpace: "nowrap" }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, background: LINE }} />
      {text}
    </div>
  </div>
);

const Check: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={GREEN} /><path d="M11 21 L 17 27 L 29 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Row: React.FC<{ at: number; text: string; right?: string; color?: string; size?: number; strike?: number }> = ({ at, text, right, color = INK, size = 36, strike = 0 }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], clamp);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o, transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: size, color: INK }}>
      <span style={{ flex: 1 }}>{text}</span>
      {right && <span style={{ color, fontFamily: fonts.bold, fontSize: size + 2 }}>{right}</span>}
      {strike > 0 && <div style={{ position: "absolute", left: 0, top: "52%", height: 6, borderRadius: 3, background: RED, width: `${strike * 100}%` }} />}
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

// Voice-memo card (flat UI mockup): red dot, waveform bars grow while he talks.
const VoiceMemo: React.FC<{ at: number; w: number }> = ({ at, w }) => {
  const { t } = useSec();
  const bars = 26;
  return (
    <Card w={w} pad={22}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.bold, fontSize: 30, color: INK }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: RED, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 4)) }} />
        Sprachmemo · Kaffee-Treffen
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, height: 70, marginTop: 10 }}>
        {Array.from({ length: bars }).map((_, i) => {
          const on = t >= at + i * 0.06;
          const h = 14 + 48 * Math.abs(Math.sin(i * 1.7 + t * 6));
          return <div key={i} style={{ width: 10, height: on ? h : 6, borderRadius: 5, background: on ? INK : LINE }} />;
        })}
      </div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY }}>2:00:00 Gespräch · im Auto</div>
    </Card>
  );
};

// One page of the protocol (flat): title line + grey text lines + page number.
const Page: React.FC<{ n: number; w?: number }> = ({ n, w = 300 }) => (
  <div style={{ width: w, height: w * 1.38, background: "#fff", borderRadius: 10, border: `2px solid ${LINE}`, boxShadow: "0 8px 18px rgba(0,0,0,0.10)", padding: 22, position: "relative" }}>
    <div style={{ fontFamily: fonts.bold, fontSize: 22, color: INK, marginBottom: 12 }}>Protokoll</div>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} style={{ height: 8, borderRadius: 4, background: "#E8E8E4", marginTop: 12, width: `${92 - ((i * 13 + n * 7) % 30)}%` }} />
    ))}
    <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: fonts.semibold, fontSize: 20, color: GREY }}>{n} / 12</div>
  </div>
);

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

const Placeholder: React.FC = () => (
  <AbsoluteFill style={{ background: "#D9D7D2", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 460, height: 560, borderRadius: 230, background: "#BDBAB3", marginTop: 160 }} />
    <div style={{ position: "absolute", top: 1500, fontFamily: fonts.bold, fontSize: 40, color: "#8C8982" }}>AVATAR PLACEHOLDER</div>
  </AbsoluteFill>
);

export const SatireHirnAnzapfen: React.FC<SatireHirnAnzapfenProps> = ({ src, seconds, words, c, face = { x: 540, y: 950, box: 430 } }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  // exactly one hard punch-in: the re-entry before the punchline ("Ich hab zugesagt.")
  const punchAt = c.zugesagt - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  // the three dopamine panels (light level): number moments only, never on the punchline
  const P1: Win = { from: c.Stundensatz - 0.12, to: c.Nach - 0.08 }; // 2,40 € / Stunde
  const P2: Win = { from: c.zwoelf - 0.15, to: c.Am - 0.06 }; // 12 Seiten
  const P3: Win = { from: c.Zwei2 - 0.12, to: c.Gestern + 0.4 }; // 600 € - 4,80 €
  const split = Math.max(...[P1, P2, P3].map((w) => envelope(t, w)));
  const F = splitFrame(face);
  const k = drift * punch;
  // normal: scale k around (540, 845) (= transformOrigin 50% 44%); split: measured reframe
  const nx = 540 * (1 - k);
  const ny = 845 * (1 - k);
  const tx = (1 - split) * nx + split * F.tx;
  const ty = (1 - split) * ny + split * F.ty;
  const sc = (1 - split) * k + split * F.S;
  const strikeGift = interpolate(t, [c.Geschenk, c.Geschenk + 0.35], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: "0 0" }}>
        {src ? <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} /> : <Placeholder />}
      </AbsoluteFill>

      {/* Hook = thumbnail (frame 0): serif title + real cappuccino cutout */}
      <SerifTitle from={0} to={c.Darf - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Ein Cappuccino für" }, { text: "zwei Stunden Beratung", italic: true }]} />
      <Sticker from={0} to={c.Darf - 0.05} x={800} y={600} rotate={-4}>
        <div style={{ position: "relative" }}>
          <Cutout img="cappuccino-crop.jpg" w={330} />
          <div style={{ position: "absolute", left: -150, top: 150 }}><PriceTag text="4,80 €" rot={-6} /></div>
        </div>
      </Sticker>

      {/* Die Nachricht */}
      <Sticker from={c.Darf - 0.1} to={c.Ich1 - 0.05} x={540} y={470} rotate={-1}>
        <Card w={800} pad={24} style={{ background: "#F4F6F9" }}>
          <div style={{ paddingBottom: 10, marginBottom: 14, borderBottom: "2px solid #E3E7EC", fontFamily: fonts.bold, fontSize: 28, color: INK }}>Neue Nachricht</div>
          <Bubble text="Darf ich dich auf einen Kaffee einladen und dein Hirn anzapfen?" size={34} />
        </Card>
      </Sticker>

      {/* Ich sag inzwischen immer ja */}
      <Sticker from={c.Ich1 - 0.1} to={c.Der - 0.05} x={540} y={470} rotate={1}>
        <Card w={800} pad={24} style={{ background: "#F4F6F9" }}>
          <div style={{ opacity: 0.45 }}><Bubble text="… dein Hirn anzapfen?" size={30} /></div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 14, opacity: fade(t, c.ja - 0.1) }}>
            <Bubble me text="Ja, sehr gern." size={36} />
            <Check s={46} />
          </div>
        </Card>
      </Sticker>

      {/* Der Kaffee ist kein Geschenk */}
      <Sticker from={c.Der - 0.1} to={c.Dahinter - 0.05} x={540} y={500} rotate={-2}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <PhotoCard src={IMG("cappuccino.jpg")} w={560} h={320} />
          <div style={{ position: "absolute", left: 120, right: 120, top: 150, textAlign: "center" }}>
            <div style={{ display: "inline-block", position: "relative", background: "#fff", borderRadius: 14, padding: "8px 26px", fontFamily: fonts.bold, fontSize: 48, color: INK, boxShadow: "0 6px 14px rgba(0,0,0,0.18)" }}>
              Geschenk
              <div style={{ position: "absolute", left: 14, top: "50%", height: 7, borderRadius: 4, background: RED, width: `${strikeGift * 85}%` }} />
            </div>
          </div>
        </div>
      </Sticker>

      {/* Reziprozität: serif term + rule card */}
      <SerifTitle from={c.Dahinter - 0.05} to={c.Ein2 - 0.05} x={0} y={150} align="center" size={116} ink lines={[{ text: "Reziprozität", italic: true, at: c.Reziprozitaet - 0.1 }]} />
      <Sticker from={c.Wer - 0.1} to={c.Ein2 - 0.05} x={540} y={520} rotate={-1}>
        <Card w={760} pad={22}>
          <Row at={c.Wer} text="Er gibt dir" right="1 Cappuccino" />
          <Row at={c.zurueckgeben - 0.2} text="Du gibst ihm" right="zurück" color={RED} />
        </Card>
      </Sticker>

      {/* Ein Cappuccino für zwei Stunden Beratung */}
      <Sticker from={c.Ein2 - 0.1} to={P1.from} x={540} y={520} rotate={0}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ position: "relative" }}>
            <Cutout img="cappuccino-crop.jpg" w={300} />
            <div style={{ position: "absolute", left: 120, top: -30 }}><PriceTag text="4,80 €" /></div>
          </div>
          <div style={{ fontFamily: serif, fontSize: 90, color: INK, opacity: fade(t, c.Ein2 + 0.3) }}>=</div>
          <Card w={300} pad={22} style={{ textAlign: "center", opacity: fade(t, c.Stunden1 - 0.1) }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 80, color: INK, lineHeight: 1 }}>2 h</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: GREY, marginTop: 6 }}>Beratung</div>
          </Card>
        </div>
      </Sticker>

      {/* Nach dem Treffen: im Auto ins Handy (car photo + phone cutout + voice memo) */}
      <Sticker from={P1.to - 0.05} to={c.Claude1 - 0.05} x={540} y={470} rotate={-1}>
        <div style={{ position: "relative", width: 760, height: 520 }}>
          <PhotoCard src={IMG("auto.jpg")} w={620} h={360} label="Nach dem Treffen · im Auto" />
          <div style={{ position: "absolute", left: 470, top: 120, opacity: fade(t, c.Handy - 0.1) }}><Cutout img="handy.jpg" w={290} rot={5} /></div>
        </div>
      </Sticker>

      {/* Claude macht daraus ein Protokoll (before the 12-Seiten panel) */}
      <Sticker from={c.Claude1 - 0.1} to={P2.from} x={540} y={470} rotate={1}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <VoiceMemo at={c.Claude1 - 0.1} w={700} />
          <Card w={520} pad={18} style={{ textAlign: "center", opacity: fade(t, c.Protokoll - 0.1) }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 36, color: INK }}>Claude → Protokoll</div>
          </Card>
        </div>
      </Sticker>

      {/* Am nächsten Morgen geht es raus. Mit Rechnung. */}
      <Sticker from={P2.to - 0.05} to={P3.from} x={540} y={470} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={780} pad={24}>
            <MailHead from="Ich" subject="Protokoll unseres Kaffees" />
            <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
              <div style={{ flex: 1, border: `2px solid ${LINE}`, borderRadius: 12, padding: "10px 14px", fontFamily: fonts.semibold, fontSize: 28, color: INK }}>Protokoll.pdf · 12 S.</div>
              <div style={{ flex: 1, border: `2px solid ${LINE}`, borderRadius: 12, padding: "10px 14px", fontFamily: fonts.semibold, fontSize: 28, color: INK, opacity: fade(t, c.Rechnung - 0.1) }}>Rechnung.pdf</div>
            </div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY, marginTop: 12 }}>gesendet · am nächsten Morgen, 8:00</div>
          </Card>
          <div style={{ position: "absolute", right: 40, bottom: -70 }}><Stamp at={c.Rechnung} text="MIT RECHNUNG" size={50} /></div>
        </div>
      </Sticker>

      {/* Steuerberater lädt mich ein */}
      <Sticker from={P3.to - 0.05} to={c.Ich3 - 0.05} x={540} y={500} rotate={0}>
        <div style={{ position: "relative", width: 760, height: 560 }}>
          <div style={{ position: "absolute", left: 20, top: 30 }}><Cutout img="steuerberater.jpg" w={330} name="Mein Steuerberater" rot={-3} /></div>
          <div style={{ position: "absolute", left: 360, top: 40, opacity: fade(t, c.Kaffee3 - 0.1) }}><Bubble text="Darf ich dich auf einen Kaffee einladen?" size={32} /></div>
          <div style={{ position: "absolute", left: 360, top: 250, opacity: fade(t, c.wissen - 0.1) }}><Bubble text="Wie machst du das mit Claude?" size={32} /></div>
        </div>
      </Sticker>

      {/* Punchline: calm, uncovered. My reply bubble, then the serif line on the word; nothing over the face */}
      <Sticker from={c.Ich3 - 0.1} to={seconds + 1} x={540} y={430} rotate={0}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Bubble me text="Gern. Zugesagt." size={38} />
        </div>
      </Sticker>
      <SerifTitle from={c.Im - 0.1} to={seconds + 1} x={0} y={560} align="center" size={96} ink lines={[{ text: "im Viertelstundentakt.", italic: true, at: c.Im - 0.05 }]} />

      {/* ---------- dopamine panels (light) ---------- */}
      <Panel w={P1}>
        <div style={{ position: "absolute", top: 120, width: 1080, textAlign: "center" }}><Label>Mein Stundensatz beim Kaffee</Label></div>
        <div style={{ position: "absolute", top: 190, width: 1080, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18 }}>
          <Roller text="2,40 €" start={c.Stundensatz + 0.05} dur={0.8} size={180} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 54, color: GREY, paddingBottom: 26 }}>/ Stunde</div>
        </div>
        <div style={{ position: "absolute", top: 450, width: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: fade(t, c.Stundensatz + 0.4) }}>
          <Cutout img="cappuccino-crop.jpg" w={150} />
          <div style={{ fontFamily: fonts.bold, fontSize: 52, color: INK }}>4,80 € ÷ 2 h</div>
        </div>
      </Panel>

      <Panel w={P2}>
        <div style={{ position: "absolute", left: 120, top: 120 }}><Label>Claude · Protokoll</Label></div>
        <div style={{ position: "absolute", left: 120, top: 190 }}>
          <Roller text="12" start={c.zwoelf - 0.05} dur={0.7} size={200} />
          <div style={{ fontFamily: serifItalic, fontSize: 70, color: INK, marginTop: -6, opacity: fade(t, c.Seiten - 0.1) }}>Seiten</div>
        </div>
        {Array.from({ length: 12 }).map((_, i) => {
          const at = c.zwoelf + i * 0.07;
          const s = spring({ frame: frame - at * fps, fps, config: { damping: 16, stiffness: 190, mass: 0.6 } });
          return (
            <div key={i} style={{ position: "absolute", left: 520 + i * 14, top: 150 + i * 10, opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - s) * -320}px) rotate(${((i % 3) - 1) * 2.5 * s}deg)` }}>
              <Page n={i + 1} w={290} />
            </div>
          );
        })}
      </Panel>

      <Panel w={P3}>
        <div style={{ position: "absolute", left: 140, top: 90, width: 800 }}>
          <Label style={{ marginBottom: 8 }}>Rechnung · Beratung beim Kaffee</Label>
          <div style={{ borderTop: `3px solid ${INK}`, paddingTop: 10 }}>
            <Row at={c.Zwei2} text="2 Stunden Beratung" right="600,00 €" size={40} />
            <Row at={c.Abzueglich - 0.05} text="abzüglich Cappuccino" right="− 4,80 €" color={RED} size={40} />
          </div>
          <div style={{ borderTop: `3px solid ${INK}`, marginTop: 10, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: fade(t, c.achtzig) }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 40, color: INK, paddingBottom: 18 }}>Summe</span>
            <Roller text="595,20 €" start={c.achtzig} dur={0.7} size={120} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 610, top: 300, opacity: fade(t, c.Zwei2 + 0.6) }}>
          <Draw at={c.Zwei2 + 0.5} w={320} h={140} d={CIRCLE} style={{ left: 0, top: -40, transform: "scale(1.05,0.6)", transformOrigin: "0 0" }} />
        </div>
      </Panel>

      <Captions words={words} split={split} />
    </AbsoluteFill>
  );
};
