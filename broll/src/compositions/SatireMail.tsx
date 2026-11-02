import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, MailHead, Note, SerifTitle, serifItalic, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Die ChatGPT-Mail vom Kollegen" (ki-satire B-025, 2026-09-30), satire edit style.
// c = cue seconds on the tightened timeline, keyed by the spoken word (see runs/satire-chatgpt-mail/cues.json).
export type SatireMailProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const GREY = "#8A8A8A";

const Typed: React.FC<{ text: string; from: number; dur: number; style?: React.CSSProperties }> = ({ text, from, dur, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <span style={style}>{text.slice(0, Math.round(text.length * p))}</span>;
};

const Reveal: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, maxHeight: p > 0 ? 200 : 0 }}>{children}</div>;
};

export const SatireMail: React.FC<SatireMailProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  // Calm, almost static camera like the reference; one hard punch-in on "Und jetzt kommt's".
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.jetzt ? 1.12 : 1;
  const circle = interpolate(t, [c.Soll + 0.55, c.Soll + 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "52% 50%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook, visible from frame 0 */}
      <SerifTitle from={0} to={c.Mail - 0.05} x={0} y={150} align="center" size={124} lines={[{ text: "Kollege" }, { text: "oder ChatGPT?", italic: true }]} />

      <Sticker from={c.drei} to={c.Mail - 0.05} x={540} y={540}>
        <div style={{ padding: "18px 34px", borderRadius: 40, background: "#fff", fontFamily: fonts.bold, fontSize: 56, color: "#1C1C1C", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>⏱ 3 Sek.</div>
      </Sticker>

      <Sticker from={c.Mail} to={c.Einzige - 0.05} x={540} y={400} rotate={-2}>
        <Card w={720}>
          <MailHead from="Jens (Kollege)" subject="Re: Mittagessen?" />
          <div style={{ fontSize: 26, color: GREY }}>Ich hoffe, diese Nachricht erreicht dich gut …</div>
        </Card>
      </Sticker>

      <Sticker from={c.Einzige} to={c.Erstes - 0.05} x={540} y={390}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 150, lineHeight: 1 }}>👀</div>
          <div style={{ fontFamily: serifItalic, fontSize: 54, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>das ganze Büro</div>
        </div>
      </Sticker>

      {/* 1. Die Begrüßung */}
      <SerifTitle from={c.Erstes} to={c.hoffe - 0.35} x={70} y={130} size={96} lines={[{ text: "1." }, { text: "Die Begrüßung", italic: true }]} />
      <Sticker from={c.hoffe - 0.3} to={c.gehofft - 0.05} x={540} y={420} rotate={1.5}>
        <Card w={760}>
          <MailHead from="Jens (Kollege)" subject="Re: Mittagessen?" />
          <div style={{ fontSize: 30, lineHeight: 1.35 }}>
            Hallo,<br />
            <Typed text="ich hoffe, diese Nachricht erreicht dich gut 🙏" from={c.hoffe - 0.1} dur={1.1} style={{ background: "#FFF1B8", borderRadius: 6 }} />
          </div>
        </Card>
      </Sticker>
      <Sticker from={c.gehofft} to={c.Zweites - 0.05} x={540} y={400}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
          <div style={{ fontFamily: serifItalic, fontSize: 58, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>Jens, sonst:</div>
          <Bubble text="k." size={48} />
        </div>
      </Sticker>

      {/* 2. Die Formatierung */}
      <SerifTitle from={c.Zweites} to={c.Ueberschriften - 0.3} x={70} y={130} size={96} lines={[{ text: "2." }, { text: "Die Formatierung", italic: true }]} />
      <Sticker from={c.Ueberschriften - 0.25} to={c.Drittes - 0.05} x={540} y={400} rotate={-1.5}>
        <Card w={760} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, marginBottom: 8 }}>Mittagessen heute: Überblick</div>
          <Reveal at={c.Stichpunkte - 0.1}>
            <div style={{ fontFamily: fonts.bold, fontSize: 24, color: GREY, margin: "6px 0" }}>1. OPTIONEN</div>
            <div style={{ fontSize: 26, lineHeight: 1.4 }}>• Pizza<br />• Döner<br />• Salat (eher nicht)</div>
          </Reveal>
          <Reveal at={c.Stichpunkte + 0.5}>
            <div style={{ fontFamily: fonts.bold, fontSize: 24, color: GREY, margin: "10px 0 6px" }}>2. NÄCHSTE SCHRITTE</div>
            <div style={{ fontSize: 26, lineHeight: 1.4 }}>• 12:30 Uhr, Treffpunkt Eingang</div>
          </Reveal>
        </Card>
      </Sticker>
      <Sticker from={c.Mittagessen} to={c.Drittes - 0.05} x={880} y={200} rotate={12}>
        <div style={{ fontSize: 120 }}>🍕</div>
      </Sticker>

      {/* 3. Die Dankbarkeit */}
      <SerifTitle from={c.Drittes} to={c.bedankt - 0.3} x={70} y={130} size={96} lines={[{ text: "3." }, { text: "Die Dankbarkeit", italic: true }]} />
      <Sticker from={c.bedankt - 0.25} to={c.jetzt - 0.05} x={560} y={440}>
        <div style={{ width: 740 }}>
          <Bubble text="Vielen Dank für deine wertvolle Rückmeldung! 🙏 Ich schätze deinen Input sehr." size={32} />
        </div>
      </Sticker>
      <Sticker from={c.Daumen - 0.1} to={c.jetzt - 0.05} x={700} y={200}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: serifItalic, fontSize: 52, color: "#fff", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>dein Input:</div>
          <Bubble text="👍" me size={56} />
        </div>
      </Sticker>

      {/* Pointe: the signature */}
      <Sticker from={c.Ganz - 0.1} to={seconds + 1} x={540} y={330}>
        <Card w={720}>
          <div style={{ fontSize: 30, lineHeight: 1.4 }}>Viele Grüße<br /><span style={{ fontFamily: fonts.bold }}>Jens</span></div>
          <div style={{ position: "relative", marginTop: 18, display: "inline-block" }}>
            <Typed text="Soll ich das kürzer machen?" from={c.Soll} dur={0.8} style={{ fontSize: 30, color: "#5A5A5A", fontFamily: fonts.semibold }} />
            <svg width={560} height={90} style={{ position: "absolute", left: -30, top: -22, overflow: "visible" }}>
              <path d="M20 45 C 20 5, 520 0, 530 40 C 540 85, 40 90, 18 50 C 10 30, 60 12, 110 10" fill="none" stroke="#E5484D" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circle} />
            </svg>
          </div>
        </Card>
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
