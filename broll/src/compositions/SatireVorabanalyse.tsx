import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, MailHead, Note, SerifTitle, serifItalic, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Vorabanalyse" (FP-S, 2026-10-08 19:30 Trial), white-wall seated look, template SatireProbezeit.
// c = cue seconds on the tightened timeline.
export type SatireVorabanalyseProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#2E9E5B";
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

const Line: React.FC<{ on: boolean; left: string; right: string; color?: string; strike?: number }> = ({ on, left, right, color = INK, strike = 0 }) => (
  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 36, color: INK, padding: "8px 4px", opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 8}px)` }}>
    <span>{left}</span>
    <span style={{ color, fontFamily: fonts.bold }}>{right}</span>
    <div style={{ position: "absolute", left: 0, top: "52%", height: 6, borderRadius: 3, background: RED, width: `${strike * 100}%` }} />
  </div>
);

export const SatireVorabanalyse: React.FC<SatireVorabanalyseProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Dein - 0.05 ? 1.12 : 1;
  const strike = interpolate(t, [c.okay, c.okay + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "50% 44%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Meine - 0.05} x={0} y={170} align="center" size={124} ink lines={[{ text: "Jeder Kunde" }, { text: "will Rabatt", italic: true }]} />
      <Sticker from={0} to={c.Meine - 0.05} x={540} y={510} rotate={-4}>
        <div style={{ padding: "10px 34px", borderRadius: 18, background: RED, color: "#fff", fontFamily: fonts.bold, fontSize: 72 }}>−10 %</div>
      </Sticker>

      {/* Meine Kunden kriegen jedes Mal einen */}
      <Sticker from={c.Meine - 0.1} to={c.Kumpel - 0.05} x={540} y={440} rotate={1.5}>
        <Card w={620} pad={26} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72 }}>🎁</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>Rabatt für jeden Kunden</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 36, color: GREEN, marginTop: 8, opacity: t >= c.jedes - 0.1 ? 1 : 0 }}>jedes Mal ✓</div>
        </Card>
      </Sticker>

      {/* Der Kumpel mit den zehn Prozent */}
      <Sticker from={c.Kumpel - 0.1} to={c.Vorabanalyse - 0.15} x={540} y={450} rotate={-1.5}>
        <Card w={720} pad={24}>
          <MailHead from="Dein Kumpel" subject="Re: Re: Re: Angebot" />
          <div style={{ display: "flex", gap: 14, justifyContent: "center", opacity: t >= c.zehn - 0.1 ? 1 : 0 }}>
            {["−10 %", "−10 %", "−10 %"].map((s, i) => (
              <div key={i} style={{ padding: "8px 18px", borderRadius: 14, background: RED, color: "#fff", fontFamily: fonts.bold, fontSize: 38, opacity: t >= c.zehn - 0.1 + i * 0.25 ? 1 : 0 }}>{s}</div>
            ))}
          </div>
        </Card>
      </Sticker>

      {/* Das Angebot mit Vorabanalyse */}
      <Sticker from={c.Vorabanalyse - 0.1} to={c.Kunde - 0.05} x={540} y={460} rotate={1}>
        <div style={{ position: "relative" }}>
          <Card w={720} pad={26}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1, marginBottom: 6 }}>ANGEBOT · POS. 1</div>
            <Line on={t >= c.Vorabanalyse - 0.1} left="Vorabanalyse" right={t >= c.Viertausend - 0.1 ? "4.000 €" : ""} />
            <Line on={t >= c.Zwoelf - 0.1} left="Umfang" right="12 Seiten" color={GREY} />
          </Card>
        </div>
      </Sticker>
      <Note from={c.Claude - 0.05} to={c.Kunde - 0.05} x={130} y={640} text="Claude: 30 Sekunden" color={INK} size={50} d="M60 10 C 80 40, 90 50, 120 80" />

      {/* Der Anruf */}
      <Sticker from={c.Kunde - 0.1} to={c.Psychologen - 0.05} x={540} y={450}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <Card w={720} pad={22}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1, marginBottom: 4 }}>📞 KUNDE RUFT AN</div>
            <Line on left="Vorabanalyse" right="4.000 €" strike={strike} />
          </Card>
          <div style={{ alignSelf: "flex-start", marginLeft: 10, opacity: t >= c.brauchen - 0.2 ? 1 : 0 }}><Bubble text="Die brauchen wir nicht." /></div>
          <div style={{ alignSelf: "flex-end", marginRight: 10, opacity: t >= c.okay - 0.1 ? 1 : 0 }}><Bubble me text="Okay, weil Sie es sind." /></div>
        </div>
      </Sticker>

      {/* Tür ins Gesicht */}
      <SerifTitle from={c.Psychologen - 0.05} to={c.unterschreibt - 0.05} x={0} y={150} align="center" size={110} ink lines={[{ text: "Tür ins" , at: c.Tuer - 0.1 }, { text: "Gesicht", italic: true, at: c.Tuer + 0.2 }]} />
      <Sticker from={c.Tuer - 0.1} to={c.Wer - 0.05} x={540} y={520}>
        <div style={{ fontSize: 120 }}>🚪💥</div>
      </Sticker>
      <Sticker from={c.Wer - 0.1} to={c.unterschreibt - 0.05} x={540} y={520}>
        <Card w={640} pad={22}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 36, color: INK }}>
            <span>Große Bitte</span><span style={{ color: RED, fontFamily: fonts.bold }}>Nein</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 36, color: INK, marginTop: 10, opacity: t >= c.kleineren - 0.1 ? 1 : 0 }}>
            <span>Kleine Bitte</span><span style={{ color: GREEN, fontFamily: fonts.bold }}>Ja</span>
          </div>
          <div style={{ fontFamily: serifItalic, fontSize: 40, color: INK, marginTop: 10, textAlign: "center", opacity: t >= c.revanchieren - 0.1 ? 1 : 0 }}>„Ich revanchier mich.“</div>
        </Card>
      </Sticker>

      {/* Unterschrift */}
      <Sticker from={c.unterschreibt - 0.1} to={c.Dein - 0.05} x={540} y={450} rotate={-1}>
        <Card w={700} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: GREEN }}>✍️ Unterschrieben</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 28, color: GREY, marginBottom: 8 }}>noch am Telefon</div>
          <Line on={t >= c.Zahlungsziel - 0.1} left="Zahlungsziel" right="7 Tage" />
          <Line on={t >= c.Skonto - 0.1} left="Skonto" right="—" color={RED} />
        </Card>
      </Sticker>

      {/* Pointe */}
      <Sticker from={c.Ich2 - 0.1} to={seconds + 1} x={540} y={460} rotate={1.5}>
        <div style={{ position: "relative" }}>
          <Card w={720} pad={24}>
            <MailHead from="An: Dein Kumpel" subject="Ihr Angebot" />
            <div style={{ opacity: t >= c.Angebot2 - 0.1 ? 1 : 0 }}>
              <Line on left="1. Vorabanalyse" right="4.000 €" />
              <Line on left="2. Beratung" right="…" color={GREY} />
            </div>
          </Card>
          <Draw at={c.Mit + 0.15} w={420} h={110} d="M40 40 C 60 -10, 400 -10, 410 45 C 420 100, 60 110, 30 60 C 20 40, 60 20, 110 18" style={{ left: 20, top: 128 }} />
        </div>
      </Sticker>
      <Sticker from={c.Dein - 0.1} to={c.Ich2 - 0.15} x={540} y={470}><div style={{ fontSize: 120 }}>🤝🤔</div></Sticker>
      <Note from={c.Dein - 0.05} to={c.Ich2 - 0.05} x={130} y={700} text="er hat gefragt" color={INK} size={46} d="M40 10 C 60 40, 70 60, 90 95" />

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
