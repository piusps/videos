import React from "react";
import { Easing } from "remotion";
import { Backdrop, bump, Check, clamp, count, ez, G, GF, Glass, Glint, GreenReel, GreenScene, HW, Odometer, PopWords, Ripple, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-effekt-jevons/captions.json";

// GPT-S Effekt-Satire "Jevons Paradox" (Hinge), runs/gpts-effekt-jevons, 2026-10-16.
// Look "Niklas gpt normal" c4f527e4 (türkis), GPT-Look Weiß + Dunkelgrün (GptGreenKit), Satire-Pointe ruhig im Vollbild.
// Alle Zeiten an Wortzeiten (captions.json, tightened Timeline). Szenen-intern: t relativ zum Szenenstart.

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
/** Startzeit des n-ten Worts, das mit `w` beginnt (Whisper schreibt z. B. "Jevons-Paradox" zusammen). */
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if ((w === "jevons" ? norm(x.text).startsWith(w) : norm(x.text) === w) && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const JV_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-effekt-jevons/avatar.mp4", focus: { x: 0.445, y: 0.646 }, scale: 1.08, faceAt: 0.57 };

const A = {
  pro: at("pro"), drei: at("drei", 1), zehn1: at("zehn", 1), also1: at("also", 1), vier: at("vier", 1), vierzig: at("vierzig"),
  jetzt1: at("jetzt", 2), zwei: at("zwei"), handy: at("handy"),
  auf: at("auf"), jevons: at("jevons"), wenn: at("wenn"), weniger: at("weniger"), viel: at("viel"),
  und: at("und", 1), feierabend: at("feierabend"),
  eine1: at("eine", 1), zehn2: at("zehn", 2), also2: at("also", 2), dreimal: at("dreimal"), lesen: at("lesen"),
  jonas2: at("jonas", 2), jede: at("jede"), geschrieben: at("geschrieben"), freundin: at("freundin"), nach: at("nach"), donnerstag: at("donnerstag"), ohne: at("ohne"),
};

const TINT = "rgba(11,61,44,0.06)";
const LINE = "rgba(11,61,44,0.12)";
const NAMES = ["Lea", "Sophie", "Mara", "Jule", "Nina", "Clara", "Paula", "Emma", "Lina", "Hanna", "Zoe", "Ida", "Mila", "Nele", "Romy", "Leni"];
const SNIPS = ["haha, und du so?", "klingt nach einem plan", "sag bloß, du kochst auch?", "ich liebe hunde!", "wann hast du zeit?", "erzähl mehr", "okay du bist witzig", "wo wohnst du eigentlich?"];

/** Kleine Chat-Zeile wie in einer Dating-App (ohne Logo). */
const ChatRow: React.FC<{ name: string; snip: string; time: string; unread?: number; style?: React.CSSProperties }> = ({ name, snip, time, unread, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 26px", borderBottom: `1.5px solid ${LINE}`, background: "rgba(255,255,255,0.7)", ...style }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: G.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 800, fontSize: 30, color: G.green, flexShrink: 0 }}>{name[0]}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: G.ink }}>{name}</div>
      <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 25, color: G.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{snip}</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <span style={{ fontFamily: GF.mono, fontWeight: 700, fontSize: 20, color: G.dim }}>{time}</span>
      {unread ? <span style={{ minWidth: 34, height: 34, borderRadius: 17, background: G.green, color: G.white, fontFamily: GF.inter, fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>{unread}</span> : null}
    </div>
  </div>
);

const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: G.white, background: G.green, borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap", ...style }}>{text}</span>
);

// ---------- 1 · Hook (0 → "Also" 1): Text-Hook + Hinge-Chat, ChatGPT schreibt in 3 s ----------
const REPLY = "Haha, Pasta ist mein Kryptonit. Aber nur selbstgemacht. Du?";
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = 1;
  const gpt = 0.35; // ChatGPT schreibt ab hier
  const shown = REPLY.slice(0, Math.round(REPLY.length * ez(t, gpt, gpt + 0.9, Easing.linear)));
  // Timer: 10:00 → 0:03 auf "drei Sekunden statt zehn Minuten"
  const tm = count(t, A.drei - 0.15, A.drei + 0.5, 3, 600);
  const secs = Math.round(tm.v);
  const timer = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const sent = t > gpt + 1.1;
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="KI spart ihm Zeit. Jetzt hat er keine mehr." hi="keine" at={-1} style={{ position: "absolute", left: 60, right: 60, top: 96, fontFamily: GF.tight, fontWeight: 900, fontSize: 84, lineHeight: 1.04, letterSpacing: -3, color: G.green }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 400, height: 470, transform: `translateY(${(1 - card) * 60}px)`, opacity: Math.min(1, card * 2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", borderBottom: `1.5px solid ${LINE}` }}>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: G.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 800, fontSize: 28, color: G.green }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: G.ink }}>Lea</div>
            <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 22, color: G.dim }}>Hinge · Match</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: GF.mono, fontWeight: 700, fontSize: 18, letterSpacing: "0.12em", color: G.dim }}>ANTWORT IN</div>
            <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 40, color: G.green, fontVariantNumeric: "tabular-nums", filter: tm.speed > 50 ? "blur(1.5px)" : undefined }}>{timer}</div>
          </div>
        </div>
        <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ alignSelf: "flex-start", background: G.white, border: `1.5px solid ${LINE}`, borderRadius: 22, borderTopLeftRadius: 6, padding: "12px 20px", fontFamily: GF.inter, fontWeight: 500, fontSize: 30, color: G.ink }}>Was ist dein Guilty Pleasure?</div>
          <div style={{ alignSelf: "flex-end", maxWidth: 760, background: sent ? G.green : G.tint, color: sent ? G.white : G.ink, borderRadius: 22, borderTopRightRadius: 6, padding: "12px 20px", fontFamily: GF.inter, fontWeight: 500, fontSize: 30, minHeight: 44, opacity: ez(t, gpt - 0.1, gpt + 0.1) }}>
            {shown}
            {!sent && t > gpt ? <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, marginLeft: 6, background: G.green, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 8)) }} /> : null}
          </div>
          <div style={{ alignSelf: "flex-end", opacity: ez(t, gpt, gpt + 0.2) }}>
            <Tag text={sent ? "VON CHATGPT GESCHRIEBEN" : "CHATGPT SCHREIBT …"} style={{ fontSize: 20 }} />
          </div>
        </div>
      </Glass>
      <Ripple t={t} at={A.drei + 0.5} x={880} y={470} r={200} />
    </>
  );
};

// ---------- 2 · vier → vierzig Chats, bis zwei Uhr am Handy ----------
const Chats: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const c = count(t, T(A.vierzig) - 0.1, T(A.vierzig) + 0.7, 40, 4);
  const n = Math.round(c.v);
  const rows = Math.min(NAMES.length, Math.round(4 + 12 * ez(t, T(A.vierzig) - 0.1, T(A.vierzig) + 0.7)));
  const scroll = 96 * Math.max(0, rows - 5) * ez(t, T(A.vierzig), T(A.vierzig) + 0.9, Easing.inOut(Easing.cubic));
  const night = ez(t, T(A.zwei) - 0.2, T(A.zwei) + 0.3);
  const head = sp(0, 12, 220);
  return (
    <>
      <Backdrop t={t} variant={1} />
      <div style={{ position: "absolute", left: 60, top: 96, display: "flex", alignItems: "center", gap: 26, transform: `scale(${head})`, transformOrigin: "0 50%" }}>
        <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 64, color: G.green, letterSpacing: -2 }}>Offene Chats</span>
        <div style={{ position: "relative", transform: `scale(${1 + 0.18 * bump(t, T(A.vierzig) + 0.6, 0.35)})` }}>
          <Odometer value={n} speed={c.speed} size={120} />
          <Glint t={t} at={T(A.vierzig) + 0.7} />
        </div>
      </div>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 270, height: 610 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
          {NAMES.slice(0, rows).map((nm, i) => (
            <ChatRow key={nm} name={nm} snip={SNIPS[i % SNIPS.length]} time={`${21 + Math.floor(i / 6)}:${String((i * 7) % 60).padStart(2, "0")}`} unread={(i % 3) + 1} style={{ opacity: i < 4 ? 1 : ez(t, T(A.vierzig) - 0.1 + i * 0.04, T(A.vierzig) + 0.1 + i * 0.04) }} />
          ))}
        </div>
      </Glass>
      {/* "bis zwei Uhr": Nacht-Karte mit Uhrzeit + Bildschirmzeit */}
      {t > T(A.zwei) - 0.3 ? (
        <Glass style={{ position: "absolute", left: 160, right: 160, top: 360, padding: "34px 40px", background: `rgba(11,31,24,${0.88 * night})`, transform: `translateY(${(1 - night) * 40}px) scale(${0.94 + 0.06 * night})`, opacity: night }}>
          <div style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 150, color: G.white, letterSpacing: -5, lineHeight: 1, textAlign: "center" }}>02:00</div>
          <div style={{ fontFamily: GF.mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: G.mint, textAlign: "center", marginTop: 10 }}>BILDSCHIRMZEIT HEUTE</div>
          <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.15)", marginTop: 18, overflow: "hidden" }}>
            <div style={{ width: `${30 + 66 * ez(t, T(A.zwei), T(A.handy) + 0.4)}%`, height: "100%", background: G.mint, borderRadius: 13 }} />
          </div>
          <div style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 46, color: G.white, textAlign: "center", marginTop: 14 }}>{(2 + 4 * ez(t, T(A.zwei), T(A.handy) + 0.4)).toFixed(1).replace(".", ",")} Std.</div>
        </Glass>
      ) : null}
    </>
  );
};

// ---------- 3 · Jevons Paradox: Begriff + Kneipen-Definition ----------
const Effekt: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const term = sp(T(A.jevons) - 0.05, 11, 230);
  const l = sp(T(A.wenn), 12, 220), r = sp(T(A.viel) - 0.1, 10, 240);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 110, textAlign: "center" }}>
        <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: G.dim, opacity: ez(t, 0, 0.3) }}>AUF ENGLISCH HEISST DAS</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 18, transform: `scale(${term})`, opacity: Math.min(1, term * 2) }}>
          <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 124, color: G.green, letterSpacing: -4, lineHeight: 1 }}>Jevons Paradox</span>
          <div style={{ height: 10, borderRadius: 5, background: G.mint, marginTop: 8, transformOrigin: "0 50%", transform: `scaleX(${ez(t, T(A.jevons) + 0.3, T(A.jevons) + 0.8)})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 470, display: "flex", gap: 30 }}>
        <Glass style={{ flex: 1, padding: "30px 30px", transform: `translateY(${(1 - l) * 50}px)`, opacity: Math.min(1, l * 2) }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: G.dim }}>GEHT SCHNELLER</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 50, color: G.green, marginTop: 10, letterSpacing: -1.5, whiteSpace: "nowrap" }}>10 Min → 3 Sek</div>
        </Glass>
        <Glass style={{ flex: 1, padding: "30px 30px", background: `rgba(11,61,44,${0.92 * r})`, transform: `translateY(${(1 - r) * 50}px) scale(${0.9 + 0.1 * r})`, opacity: Math.min(1, r * 2) }}>
          <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: G.mint }}>ERGEBNIS</div>
          <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 60, color: G.white, marginTop: 10, letterSpacing: -1.5 }}>viel mehr davon</div>
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 720, textAlign: "center", opacity: ez(t, T(A.weniger) - 0.1, T(A.weniger) + 0.2) }}>
        <span style={{ position: "relative", fontFamily: GF.tight, fontWeight: 800, fontSize: 54, color: G.dim }}>
          nicht weniger
          <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 7, borderRadius: 4, background: G.green, transformOrigin: "0 50%", transform: `scaleX(${ez(t, T(A.viel) - 0.15, T(A.viel) + 0.15)})` }} />
        </span>
      </div>
      <Ripple t={t} at={T(A.viel)} x={HW * 0.73} y={560} r={240} />
    </>
  );
};

// ---------- 4 · Mails: 10 Sekunden pro Mail, dreimal so viele, alle lesen ----------
const SUBJ = ["Kurze Rückfrage zum Meeting", "Re: Re: Fwd: Abstimmung", "Zusammenfassung von ChatGPT", "Follow-up zu meinem Follow-up", "Update (KI-generiert)", "Nur kurz zur Info", "Re: Kurze Rückfrage", "Agenda für das Vorab-Meeting", "Feedback zum Feedback", "Gedanken dazu?"];
const Mails: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const chip = sp(T(A.zehn2) - 0.1, 10, 240);
  const c = count(t, T(A.dreimal) - 0.1, T(A.dreimal) + 0.8, 120, 40);
  const unread = count(t, T(A.jede) - 0.2, T(A.lesen) + 0.2, 347, 120);
  const rows = Math.round(3 + 7 * ez(t, T(A.also2), T(A.dreimal) + 0.8));
  const scroll = 92 * Math.max(0, rows - 5) * ez(t, T(A.dreimal), T(A.lesen) + 0.2, Easing.inOut(Easing.cubic));
  return (
    <>
      <Backdrop t={t} variant={3} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 96, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 64, color: G.green, letterSpacing: -2 }}>Posteingang</span>
        <div style={{ transform: `scale(${chip})`, opacity: Math.min(1, chip * 2) }}><Tag text="1 MAIL = 10 SEK." style={{ fontSize: 26 }} /></div>
      </div>
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 230, height: 520 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
          {SUBJ.slice(0, rows).map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 92, padding: "0 26px", borderBottom: `1.5px solid ${LINE}`, opacity: i < 3 ? 1 : ez(t, T(A.also2) + i * 0.12, T(A.also2) + 0.2 + i * 0.12) }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: G.green, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: GF.inter, fontWeight: 700, fontSize: 29, color: G.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x}</span>
              <span style={{ fontFamily: GF.mono, fontWeight: 700, fontSize: 20, color: G.dim }}>{`09:${String(2 + i * 3).padStart(2, "0")}`}</span>
            </div>
          ))}
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 60, right: 60, top: 780, display: "flex", gap: 24 }}>
        <Glass style={{ flex: 1, padding: "16px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: ez(t, T(A.dreimal) - 0.2, T(A.dreimal)) }}>
          <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: G.dim }}>MAILS / TAG</span>
          <Odometer value={Math.round(c.v)} speed={c.speed} size={58} />
        </Glass>
        <Glass style={{ flex: 1, padding: "16px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `rgba(11,61,44,${0.92 * ez(t, T(A.jede) - 0.3, T(A.jede))})`, opacity: ez(t, T(A.jede) - 0.3, T(A.jede)) }}>
          <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: G.mint }}>UNGELESEN</span>
          <Odometer value={Math.round(unread.v)} speed={unread.speed} size={58} color={G.white} />
        </Glass>
      </div>
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: A.also1 - 0.12, El: Hook },
  { start: A.also1 - 0.12, end: A.auf - 0.15, El: (p) => <Chats t={p.t} s={A.also1 - 0.12} />, joinPrev: true },
  { start: A.auf - 0.15, end: A.und - 0.1, El: (p) => <Effekt t={p.t} s={A.auf - 0.15} />, joinPrev: true },
  // "Und genau deshalb hast du mit KI nicht früher Feierabend." = Vollbild
  { start: A.eine1 - 0.15, end: A.jonas2 - 0.02, El: (p) => <Mails t={p.t} s={A.eine1 - 0.15} /> },
];

/** Pointe im Vollbild: kleine Karte über dem Kopf, nie über dem Gesicht. */
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.geschrieben - 0.4) return null;
  const a = ez(t, A.geschrieben - 0.3, A.geschrieben + 0.05);
  const msg = ez(t, A.donnerstag - 0.1, A.donnerstag + 0.15);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
      <Glass style={{ padding: "22px 28px", borderRadius: 26, display: "flex", flexDirection: "column", gap: 12, minWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: G.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 800, fontSize: 24, color: G.green }}>M</div>
          <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 28, color: G.ink, flex: 1 }}>Marie</span>
          <Tag text="NACHRICHT 3" style={{ fontSize: 18 }} />
        </div>
        <div style={{ alignSelf: "flex-start", background: G.white, border: `1.5px solid ${LINE}`, borderRadius: 22, borderTopLeftRadius: 6, padding: "12px 22px", fontFamily: GF.inter, fontWeight: 600, fontSize: 36, color: G.ink, opacity: msg, transform: `scale(${0.9 + 0.1 * msg})`, transformOrigin: "0 0" }}>
          Donnerstag, 19 Uhr?
        </div>
        {t > A.ohne - 0.1 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: ez(t, A.ohne - 0.1, A.ohne + 0.2) }}>
            <Check size={34} p={ez(t, A.ohne, A.ohne + 0.35)} />
            <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: G.green }}>SELBST GESCHRIEBEN</span>
          </div>
        ) : null}
      </Glass>
    </div>
  );
};

export const GptJevonsGreen: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} />;
void clamp;
