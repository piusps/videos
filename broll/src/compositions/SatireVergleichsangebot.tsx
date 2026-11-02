import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, MailHead, Note, SerifTitle, serifItalic, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Vergleichsangebot" (FP-S, 2026-10-09 20:00), white-wall seated look, template SatireVorabanalyse.
// c = cue seconds on the tightened timeline.
export type SatireVergleichsangebotProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

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

const Doc: React.FC<{ label: string; on: boolean; tag?: string; dim?: boolean }> = ({ label, on, tag, dim }) => (
  <div style={{ width: 190, height: 240, borderRadius: 16, background: "#fff", boxShadow: "0 12px 30px rgba(0,0,0,0.22)", padding: 18, opacity: on ? (dim ? 0.55 : 1) : 0, transform: `translateY(${on ? 0 : 12}px)`, position: "relative" }}>
    <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK }}>{label}</div>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{ height: 10, borderRadius: 5, background: "#E3E3E3", marginTop: 16, width: `${90 - i * 12}%` }} />
    ))}
    {tag ? (
      <div style={{ position: "absolute", left: -10, right: -10, bottom: 18, textAlign: "center", padding: "6px 0", borderRadius: 10, background: RED, color: "#fff", fontFamily: fonts.bold, fontSize: 24, transform: "rotate(-6deg)" }}>{tag}</div>
    ) : null}
  </div>
);

export const SatireVergleichsangebot: React.FC<SatireVergleichsangebotProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Dieses - 0.05 ? 1.12 : 1;
  const strikeBudget = interpolate(t, [c.gestrichen, c.gestrichen + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strikeRest = interpolate(t, [c.loswerden, c.loswerden + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moodColors = ["#F2C6B4", "#B9D7C8", "#E8DCC2", "#9FB8D6", "#D9A7C7", "#F4E3A1"];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "50% 44%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Eins - 0.05} x={0} y={160} align="center" size={112} ink lines={[{ text: "Ich schreib nur noch" }, { text: "das Alibiangebot", italic: true }]} />
      <Sticker from={0} to={c.Eins - 0.05} x={540} y={540} rotate={-3}>
        <div style={{ display: "flex", gap: 18 }}>
          <Doc label="Angebot 1" on dim />
          <Doc label="Angebot 2" on dim />
          <Doc label="Angebot 3" on={t >= 0} tag="ALIBI" />
        </div>
      </Sticker>

      {/* Eins davon ist nur zum Vergleich da */}
      <Sticker from={c.Eins - 0.1} to={c.Freelancerkumpel - 0.05} x={540} y={470} rotate={1}>
        <div style={{ display: "flex", gap: 18 }}>
          <Doc label="Angebot 1" on />
          <Doc label="Angebot 2" on />
          <Doc label="Angebot 3" on tag={t >= c.Vergleich - 0.1 ? "nur zum Vergleich" : undefined} />
        </div>
      </Sticker>

      {/* Der Freelancerkumpel */}
      <Sticker from={c.Freelancerkumpel - 0.1} to={c.Ich1 - 0.05} x={540} y={450} rotate={-1.5}>
        <Card w={720} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>👨‍💻 Dein Freelancerkumpel</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 28, color: GREY, marginBottom: 8 }}>schreibt das Vergleichsangebot</div>
          {t >= c.ernsthaft - 0.1 ? <Line on left="Ernsthaft" right="jedes Mal" color={GREEN} /> : null}
          {t >= c.Wochenende - 0.1 ? <Line on left="Arbeitszeit" right="Sa + So" /> : null}
          {t >= c.Moodboard - 0.1 ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
                {moodColors.map((col, i) => (
                  <div key={i} style={{ height: 70, borderRadius: 10, background: col, opacity: t >= c.Moodboard - 0.1 + i * 0.08 ? 1 : 0 }} />
                ))}
              </div>
              <div style={{ fontFamily: serifItalic, fontSize: 38, color: INK, textAlign: "center", marginTop: 8 }}>Moodboard</div>
            </>
          ) : null}
        </Card>
      </Sticker>

      {/* Ich schreib nur noch dieses Angebot. Claude, eine Minute. Dreimal so teuer. */}
      <Sticker from={c.Ich1 - 0.1} to={c.Ab - 0.05} x={540} y={450} rotate={1}>
        <Card w={720} pad={24}>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1, marginBottom: 6 }}>MEIN VERGLEICHSANGEBOT</div>
          <Line on={t >= c.Claude - 0.1} left="Erstellt von" right="Claude" />
          <Line on={t >= c.Minute - 0.1} left="Dauer" right="1 Minute" color={GREEN} />
          <Line on={t >= c.Immer - 0.1} left="Preis" right={t >= c.dreimal - 0.1 ? "3 × echter Preis" : ""} color={RED} />
        </Card>
      </Sticker>

      {/* Ab Oktober */}
      <Sticker from={c.Ab - 0.1} to={c.Oekonomen - 0.05} x={540} y={470} rotate={-2}>
        <Card w={380} pad={0} style={{ overflow: "hidden", textAlign: "center" }}>
          <div style={{ background: RED, color: "#fff", fontFamily: fonts.bold, fontSize: 36, padding: "10px 0" }}>OKTOBER</div>
          <div style={{ fontSize: 110, padding: "10px 0 6px" }}>💰</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, color: GREEN, paddingBottom: 16 }}>lohnt sich richtig</div>
        </Card>
      </Sticker>

      {/* Dezemberfieber */}
      <SerifTitle from={c.Oekonomen - 0.05} to={c.Letzten - 0.05} x={0} y={150} align="center" size={116} ink lines={[{ text: "Dezember", at: c.Dezemberfieber - 0.1 }, { text: "fieber", italic: true, at: c.Dezemberfieber + 0.25 }]} />
      <Sticker from={c.Dezemberfieber - 0.1} to={c.Was - 0.05} x={540} y={520}>
        <div style={{ fontSize: 130 }}>🌡️🎄</div>
      </Sticker>
      <Sticker from={c.Was - 0.1} to={c.Letzten - 0.05} x={540} y={540}>
        <Card w={720} pad={22}>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1, marginBottom: 6 }}>BUDGET DER ABTEILUNG</div>
          <Line on left="Bis Silvester" right={t >= c.Silvester - 0.1 ? "nicht ausgegeben" : ""} color={GREY} />
          <Line on={t >= c.naechstes - 0.1} left="Nächstes Jahr" right={t >= c.gestrichen - 0.1 ? "gestrichen" : ""} color={RED} strike={strikeBudget} />
        </Card>
      </Sticker>

      {/* Letzten Dezember: Einkäufer nimmt das Vergleichsangebot */}
      <Sticker from={c.Letzten - 0.1} to={c.musste - 0.05} x={540} y={440} rotate={-1}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <Card w={720} pad={24}>
            <MailHead from="Einkauf" subject="Zuschlag: Ihr Vergleichsangebot" />
            <div style={{ fontFamily: fonts.bold, fontSize: 38, color: GREEN, opacity: t >= c.Vergleichsangebot - 0.1 ? 1 : 0 }}>✓ Angenommen</div>
          </Card>
          <div style={{ alignSelf: "flex-start", marginLeft: 10, opacity: t >= c.bedankt - 0.25 ? 1 : 0 }}><Bubble text="Vielen Dank!" /></div>
        </div>
      </Sticker>

      {/* Vierzigtausend loswerden */}
      <Sticker from={c.musste - 0.1} to={c.Dieses - 0.05} x={540} y={470} rotate={1.5}>
        <Card w={660} pad={24}>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1, marginBottom: 6 }}>RESTBUDGET DEZEMBER</div>
          <Line on={t >= c.vierzigtausend - 0.1} left="Noch übrig" right="40.000 €" strike={strikeRest} />
          <div style={{ fontFamily: serifItalic, fontSize: 40, color: INK, textAlign: "center", marginTop: 8, opacity: t >= c.loswerden - 0.1 ? 1 : 0 }}>„muss weg“</div>
        </Card>
      </Sticker>

      {/* Dieses Jahr frag ich vorher */}
      <Sticker from={c.Dieses - 0.1} to={c.Das - 0.05} x={540} y={470}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <div style={{ alignSelf: "flex-end", marginRight: 10, opacity: t >= c.frag - 0.2 ? 1 : 0 }}><Bubble me size={44} text="Wie viel Geld ist noch übrig?" /></div>
        </div>
      </Sticker>
      <Note from={c.Dieses - 0.05} to={c.Das - 0.05} x={130} y={640} text="vorher fragen" color={INK} size={46} d="M40 10 C 60 40, 70 60, 90 95" />

      {/* Pointe */}
      <Sticker from={c.Das - 0.1} to={seconds + 1} x={540} y={460} rotate={1.5}>
        <div style={{ position: "relative" }}>
          <Card w={720} pad={24}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1, marginBottom: 6 }}>MEIN ANGEBOT · DEZEMBER</div>
            <Line on left="Mein Preis" right={t >= c.Preis - 0.1 ? "= Restbudget" : ""} color={RED} />
          </Card>
          <Draw at={c.Preis + 0.15} w={330} h={90} d="M30 35 C 50 -10, 320 -10, 325 40 C 330 90, 50 95, 25 50 C 15 30, 50 15, 95 14" style={{ left: 395, top: 62 }} />
        </div>
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
