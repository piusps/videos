import React from "react";
import { Easing } from "remotion";
import { Backdrop, bump, Check, count, ez, G, GF, Glass, Glint, GreenReel, GreenScene, Odometer, PopWords, Ripple, useSp, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-geteilter-account/captions.json";
import { APP_H, CG, ChatGPTDesktop, Msg, ScreenCam, SidebarData } from "../components/ChatGPTDesktop";

// GPT-S Gründer-Satire "Geteilter ChatGPT-Account" (transaktives Gedächtnis), runs/gpts-geteilter-account, 2026-10-21.
// Same build as GptBenefitsGreen / GptJevonsGreen: look c4f527e4 (turquoise), GptGreenKit panels, calm full-frame punchline.
// v2 (Henri 2026-10-21): the chat mockups are replaced by the rebuilt ChatGPT desktop app (components/ChatGPTDesktop.tsx),
// UI only, every sidebar title invented for Jana and Tim (none of the real chats from the screenshot).

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text).startsWith(w) && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const ACC_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-geteilter-account/avatar.mp4", focus: { x: 0.449, y: 0.633 }, scale: 1.08, faceAt: 0.57 };

const A = {
  teilen1: at("teilen", 1), paar1: at("paar", 1), chatgpt1: at("chatgpt", 1), account1: at("account", 1), jeder: at("jeder"), elf: at("elf"), fuenfzig: at("fünfzig"), kennen1: at("kennen", 1),
  merkt1: at("merkt", 1), alles1: at("alles", 1), gefragt: at("gefragt"), egal: at("egal"), tippt: at("tippt"),
  paare2: at("paare", 1), erinnern: at("erinnern"), sie: at("sie", 1), geburtstage: at("geburtstage"), passwoerter: at("passwörter"), psychologie: at("psychologie"), transaktives: at("transaktiv"), gedaechtnis: at("gedächtnis"),
  jetzt: at("jetzt"), weiss: at("weiß"), beiden: at("beiden"),
  jana1: at("jana", 1), geschenk: at("geschenk"), schreibt1: at("schreibt", 1), playstation: at("playstation"), traut: at("traut"), sagen: at("sagen"),
  sucht: at("sucht"), restaurant: at("restaurant"), schreibt2: at("schreibt", 2), bitte: at("bitte"), italiener: at("italiener"), langweilig: at("langweilig"), witze: at("witze"),
  dann: at("dann"), heiratsantrag: at("heiratsantrag"), gern: at("gern"), kleine: at("kleine"), jana3: at("jana", 3), schluss: at("schluss"), ihr2: at("ihr", 2), kennen2: at("kennen", 2),
};

const LINE = "rgba(11,61,44,0.12)";
const GREY = "#F4F4F4";
const RED = "#C8372D";
const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: G.white, background: G.green, borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap", ...style }}>{text}</span>
);
const Label: React.FC<{ text: string; color?: string; style?: React.CSSProperties }> = ({ text, color = G.dim, style }) => (
  <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color, ...style }}>{text}</div>
);
const Person: React.FC<{ n: string; size?: number; dark?: boolean }> = ({ n, size = 64, dark }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: dark ? G.green : G.mint, color: dark ? G.white : G.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 800, fontSize: size * 0.46, flexShrink: 0 }}>{n}</div>
);
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(Math.max(0, Math.min(1, (t - a) / (b - a))) * s.length));
/** streams word by word like a ChatGPT answer */
const streamed = (s: string, t: number, a: number, b: number) => {
  const w = s.split(" ");
  const n = Math.round(Math.max(0, Math.min(1, (t - a) / (b - a))) * w.length);
  return w.slice(0, n).join(" ");
};
const Dot: React.FC<{ t: number }> = ({ t }) => <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 9, marginLeft: 8, background: G.ink, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 7)), verticalAlign: "middle" }} />;


// ---------- shared ChatGPT app state (invented titles only) ----------
const BASE: SidebarData = {
  pinned: ["Einkaufsliste"],
  projects: [{ name: "Urlaub 2027" }, { name: "Wohnung", chats: ["Mietvertrag prüfen", "Sofa ausmessen"] }],
  recent: ["Laufschuhe vergleichen", "Spanisch Vokabeln", "Laktosefreie Rezepte", "Zahnarzt Angst Tipps", "Steuer Tipps Freelancer", "Montagsmotivation", "Wäscheplan WG", "Pflanzen gießen Plan"],
  account: { initials: "JT", name: "Jana & Tim", plan: "Plus" },
};
const MORE = ["Jahrestag Ideen", "Playstation 5 Preis", "Ist Pasta langweilig?", "Tim Geburtstag Liste", "Passwort Router", "Witze für Anfänger", "Kann man Schweigen lernen?", "Mülltage Kalender", "Wie sagt man es nett?", "Laufschuhe Größe 44"];
const side = (recent: string[], active?: string): SidebarData => ({ ...BASE, recent, active });
const lerp = (t: number, a: number, b: number, from: number, to: number) => from + (to - from) * ez(t, a, b, Easing.inOut(Easing.sin));

// ---------- (old) ChatGPT phone-ish chat window, unused since v2 ----------
const ChatWin: React.FC<{ t: number; who: string; q: string; qAt: number; qEnd: number; ans: string; aAt: number; aEnd: number; extra?: React.ReactNode; top?: number }> = ({ t, who, q, qAt, qEnd, ans, aAt, aEnd, extra, top = 80 }) => {
  const sp = useSp();
  const inn = sp(0.02, 12, 220);
  const qs = typed(q, t, qAt, qEnd);
  const sent = t > qEnd + 0.05;
  const as = streamed(ans, t, aAt, aEnd);
  const done = t > aEnd + 0.1;
  return (
    <Glass style={{ position: "absolute", left: 60, right: 60, top, height: 800, padding: 0, background: "rgba(255,255,255,0.94)", transform: `translateY(${(1 - inn) * 60}px)`, opacity: Math.min(1, inn * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 30px", borderBottom: `1.5px solid ${LINE}` }}>
        <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: "#212121" }}>ChatGPT</span>
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#8A8A8A" strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Label text="TIPPT GERADE" />
          <Person n={who} size={56} dark />
        </div>
      </div>
      <div style={{ padding: "28px 30px", display: "flex", flexDirection: "column", gap: 24 }}>
        {t > qAt - 0.1 ? (
          <div style={{ alignSelf: "flex-end", maxWidth: 720, background: GREY, borderRadius: 30, padding: "18px 28px", fontFamily: GF.inter, fontWeight: 500, fontSize: 40, color: "#212121", transform: `scale(${sent ? 1 + 0.05 * bump(t, qEnd, 0.22) : 1})`, transformOrigin: "100% 50%" }}>{sent ? q : qs}</div>
        ) : null}
        {t > aAt - 0.5 ? (
          <div style={{ alignSelf: "flex-start", maxWidth: 860, fontFamily: GF.inter, fontWeight: 500, fontSize: 44, lineHeight: 1.32, color: "#212121" }}>
            {as}
            {!done ? <Dot t={t} /> : null}
          </div>
        ) : null}
        {extra}
      </div>
      <div style={{ position: "absolute", left: 26, right: 26, bottom: 24, height: 86, borderRadius: 43, border: "1.5px solid rgba(0,0,0,0.12)", background: G.white, display: "flex", alignItems: "center", padding: "0 14px 0 26px", gap: 18 }}>
        <span style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 40, color: "#8A8A8A" }}>+</span>
        <span style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 32, color: "#8A8A8A", flex: 1 }}>Frag alles</span>
        <div style={{ width: 60, height: 60, borderRadius: 30, background: "#212121", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </Glass>
  );
};

// ---------- 1 · Hook (v3: only the ChatGPT UI): the question is already sent on frame 0, the answer streams,
// then the camera pulls back to the shared account "Jana & Tim · Plus" in the sidebar ----------
const Q0 = "Sollen wir uns einen ChatGPT Account teilen?";
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const a1 = streamed("Ja, gute Idee.", t, 0.3, Math.max(0.6, A.jeder - 0.15));
  const a2 = streamed("Jeder spart 11,50 € im Monat. Und ihr lernt euch endlich richtig kennen.", t, A.jeder - 0.05, A.kennen1 + 0.3);
  const pull = ez(t, A.account1 - 0.4, A.account1 + 0.5, Easing.inOut(Easing.cubic));
  const done = t > A.kennen1 + 0.35;
  return (
    <ScreenCam x={464 * (1 - pull)} y={lerp(t, A.account1 + 0.5, A.kennen1 + 1, 0, 180) * pull} z={1.04 - 0.3 * pull}>
      <ChatGPTDesktop side={side(["Account teilen?", ...BASE.recent], "Account teilen?")} title="Account teilen?"
        messages={[{ role: "user", text: Q0 }, { role: "assistant", text: <>{a1}{a2 ? <><br /><br />{a2}</> : null}{!done ? <Dot t={t} /> : null}</> }]} />
    </ScreenCam>
  );
};

// ---------- 2 · ChatGPT remembers everything, no matter who types ----------
const MEM: { txt: string; who: string }[] = [
  { txt: "Ist laktoseintolerant", who: "J" }, { txt: "Sucht neue Laufschuhe", who: "T" }, { txt: "Hasst Montage", who: "J" },
  { txt: "Hat Angst vor Zahnärzten", who: "T" }, { txt: "Lernt Spanisch", who: "J" }, { txt: "Fragt oft nach Steuer Tipps", who: "T" },
];
const Memory: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const inn = sp(0.02, 12, 220);
  const a0 = T(A.alles1) - 0.2, a1 = T(A.tippt) + 0.2;
  const n = Math.max(0, Math.min(MEM.length, Math.floor(((t - a0) / (a1 - a0)) * MEM.length) + 1));
  const typer = t > T(A.egal) ? (Math.floor((t - T(A.egal)) / 0.32) % 2 ? "T" : "J") : "J";
  const modal = (
    <div style={{ width: 1080, background: "#fff", borderRadius: 30, boxShadow: "0 30px 80px rgba(0,0,0,0.25)", padding: "34px 40px", transform: `translateY(${(1 - inn) * 60}px) scale(${0.94 + 0.06 * inn})`, opacity: Math.min(1, inn * 2), fontFamily: CG.font }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ fontWeight: 600, fontSize: 40, color: CG.ink }}>Gespeicherte Erinnerungen</div>
        <div style={{ marginLeft: "auto", fontSize: 40, color: CG.mute }}>×</div>
      </div>
      <div style={{ fontSize: 26, color: CG.sub, marginTop: 10, lineHeight: 1.35 }}>ChatGPT merkt sich Dinge aus deinen Chats. Für alle Chats in diesem Account.</div>
      <div style={{ marginTop: 22, borderTop: `1px solid ${CG.line}` }}>
        {MEM.slice(0, n).map((m, i) => {
          const st = a0 + (i * (a1 - a0)) / MEM.length;
          const q = ez(t, st, st + 0.25);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 4px", borderBottom: `1px solid ${CG.line}`, opacity: q, transform: `translateX(${(1 - q) * 60}px)`, background: q < 1 ? `rgba(47,111,235,${0.08 * (1 - q)})` : "transparent" }}>
              <span style={{ fontSize: 34, color: CG.ink, flex: 1 }}>{m.txt}</span>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={CG.mute} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <>
      <ScreenCam x={lerp(t, 0, a1, 112, 132)} y={lerp(t, 0, a1, 110, 150)} z={0.86}>
        <ChatGPTDesktop side={side(BASE.recent)} modal={modal} />
      </ScreenCam>
    </>
  );
};

// ---------- 3 · transactive memory: she remembers birthdays, he passwords ----------
const COLS = { sie: ["Geburtstage", "Jahrestag", "Arzttermine"], er: ["Passwörter", "WLAN", "Mülltage"] };
const Transaktiv: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const q = "Wer merkt sich in einer Beziehung was?";
  const qEnd = Math.max(0.6, T(A.erinnern) - 0.25);
  const sent = t > qEnd;
  const li = (items: string[], at0: number) => items.map((it, i) => {
    const a = at0 + i * 0.18;
    return t > a ? <li key={it} style={{ marginTop: 4, opacity: ez(t, a, a + 0.15) }}>{it}</li> : null;
  });
  const intro = streamed("Paare teilen sich das Erinnern auf.", t, T(A.erinnern) - 0.2, T(A.sie) - 0.1);
  const ans = (
    <div>
      {intro}
      {t > T(A.sie) - 0.15 ? <div style={{ marginTop: 22 }}><b>Sie merkt sich</b><ul style={{ margin: "6px 0 0", paddingLeft: 44 }}>{li(COLS.sie, T(A.geburtstage) - 0.1)}</ul></div> : null}
      {t > T(A.passwoerter) - 0.35 ? <div style={{ marginTop: 18 }}><b>Er merkt sich</b><ul style={{ margin: "6px 0 0", paddingLeft: 44 }}>{li(COLS.er, T(A.passwoerter) - 0.1)}</ul></div> : null}
      {t > T(A.psychologie) - 0.1 ? <div style={{ marginTop: 22 }}>{streamed("In der Psychologie heißt das", t, T(A.psychologie) - 0.1, T(A.transaktives) - 0.05)} {t > T(A.transaktives) - 0.05 ? <b style={{ background: `rgba(47,111,235,${0.14 * ez(t, T(A.gedaechtnis), T(A.gedaechtnis) + 0.3)})`, borderRadius: 6, padding: "0 4px" }}>transaktives Gedächtnis</b> : null}{t > T(A.gedaechtnis) + 0.3 ? " (Wegner, 1991)." : ""}</div> : null}
    </div>
  );
  return (
    <ScreenCam x={464} y={lerp(t, T(A.passwoerter) - 0.3, T(A.gedaechtnis) + 0.5, 0, 300)} z={1.04}>
      <ChatGPTDesktop side={side(sent ? ["Wer merkt sich was?", ...BASE.recent] : BASE.recent, sent ? "Wer merkt sich was?" : undefined)} recentShown={sent ? BASE.recent.length + 1 : BASE.recent.length} pop={ez(t, qEnd, qEnd + 0.3)}
        title={sent ? "Wer merkt sich was?" : undefined}
        messages={sent ? [{ role: "user", text: q }, { role: "assistant", text: t > T(A.erinnern) - 0.25 ? ans : <Dot t={t} /> }] : [{ role: "assistant", text: "" }]}
        typed={sent ? undefined : typed(q, t, 0.1, qEnd)} caret={!sent} sendPulse={bump(t, qEnd, 0.22)} />
    </ScreenCam>
  );
};

// ---------- 4 · now ChatGPT knows everything, from both ----------
const ALL = [...COLS.sie, ...COLS.er, "Will eine Playstation", "Findet Italiener langweilig", "Hat Geheimnisse"];
const Alles: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const all = [...MORE.slice().reverse(), ...BASE.recent];
  const step = Math.max(0.12, (T(A.beiden) + 0.3) / MORE.length);
  const k = Math.min(MORE.length, Math.floor(t / step));
  const shown = all.slice(MORE.length - k);
  const pop = ez(t, k * step, k * step + 0.15);
  const n = count(t, 0.2, T(A.beiden) + 0.3, 248, 6);
  return (
    <>
      <ScreenCam x={0} y={lerp(t, 0, T(A.beiden) + 0.6, 380, 440)} z={1.05}>
        <ChatGPTDesktop side={side(shown)} recentShown={shown.length} pop={pop} />
      </ScreenCam>
    </>
  );
};

// ---------- 5 · Jana asks for a gift idea ----------
/** one conversation in the real app: the question is typed into the pill, sent, then the answer streams */
const Conv: React.FC<{ t: number; who: string; chat: string; q: string; qAt: number; qEnd: number; ans: string; aAt: number; aEnd: number; extra?: React.ReactNode }> = ({ t, who, chat, q, qAt, qEnd, ans, aAt, aEnd, extra }) => {
  const sent = t > qEnd + 0.05;
  const msgs: Msg[] = [];
  if (sent) msgs.push({ role: "user", text: q });
  if (t > aAt - 0.4) msgs.push({ role: "assistant", text: <>{streamed(ans, t, aAt, aEnd)}{t < aEnd + 0.1 ? <Dot t={t} /> : null}{extra}</> });
  const recent = [chat, ...BASE.recent];
  return (
    <>
      <ScreenCam x={lerp(t, 0, aEnd + 1, 0, 70)} y={0} z={lerp(t, 0, aEnd + 1, 0.74, 0.8)}>
        <ChatGPTDesktop side={side(recent, sent ? chat : undefined)} recentShown={sent ? recent.length : BASE.recent.length} pop={ez(t, qEnd, qEnd + 0.3)}
          messages={msgs.length ? msgs : [{ role: "assistant", text: "" }]} typed={sent ? undefined : typed(q, t, qAt, qEnd)} caret={!sent && t > qAt - 0.1} sendPulse={bump(t, qEnd, 0.22)} title={sent ? chat : undefined} />
      </ScreenCam>
    </>
  );
};

// ---------- 5 · Jana asks for a gift idea ----------
const Geschenk: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  return <Conv t={t} who="J" chat="Geschenkidee für Tim" q="Geschenkidee für Tim?" qAt={0.15} qEnd={T(A.geschenk) + 0.4} ans="Eine Playstation. Er traut sich nur nicht, es dir zu sagen." aAt={T(A.playstation) - 0.1} aEnd={T(A.sagen) + 0.1} />;
};

// ---------- 6 · Tim looks for a restaurant ----------
const Italiener: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const w = T(A.witze) - 0.15;
  return (
    <Conv t={t} who="T" chat="Restaurant zum Jahrestag" q="Restaurant zum Jahrestag?" qAt={0.15} qEnd={T(A.restaurant) + 0.5} ans="Bitte keinen Italiener. Den findet Jana langweilig." aAt={T(A.bitte) - 0.1} aEnd={T(A.langweilig) + 0.2}
      extra={t > w ? (
        <span style={{ position: "relative", display: "inline-block", marginLeft: 14, fontWeight: 700, opacity: ez(t, w, w + 0.12) }}>
          Wie deine Witze.
          <svg style={{ position: "absolute", left: -22, top: -16, overflow: "visible" }} width="440" height="96" viewBox="0 0 440 96">
            <ellipse cx="220" cy="48" rx="218" ry="44" fill="none" stroke={RED} strokeWidth="5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(t, w + 0.12, w + 0.42)} />
          </svg>
        </span>
      ) : null} />
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: A.merkt1 - 0.35, El: Hook },
  { start: A.merkt1 - 0.35, end: A.paare2 - 0.15, El: (p) => <Memory t={p.t} s={A.merkt1 - 0.35} />, joinPrev: true },
  { start: A.paare2 - 0.15, end: A.jetzt - 0.12, El: (p) => <Transaktiv t={p.t} s={A.paare2 - 0.15} />, joinPrev: true },
  { start: A.jetzt - 0.12, end: A.jana1 - 0.2, El: (p) => <Alles t={p.t} s={A.jetzt - 0.12} />, joinPrev: true },
  { start: A.jana1 - 0.2, end: A.sucht - 0.35, El: (p) => <Geschenk t={p.t} s={A.jana1 - 0.2} />, joinPrev: true },
  { start: A.sucht - 0.35, end: A.dann + 0.45, El: (p) => <Italiener t={p.t} s={A.sucht - 0.35} />, joinPrev: true },
];

/** Punchline in full frame: a quiet chat card above the head, never over the face; gone for the last line. */
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.dann + 0.45 || t > A.ihr2 + 0.2) return null;
  const a = ez(t, A.dann + 0.45, A.dann + 0.8);
  const out = 1 - ez(t, A.ihr2 - 0.15, A.ihr2 + 0.2);
  const q = "Wie plane ich einen Heiratsantrag?";
  const qs = typed(q, t, A.dann + 0.5, A.heiratsantrag + 0.6);
  const ans1 = streamed("Gern. Kleine Info vorab.", t, A.gern - 0.05, A.kleine + 0.6);
  const ans2 = streamed("Jana wollte gestern wissen, wie man nett Schluss macht.", t, A.jana3 - 0.05, A.schluss + 0.35);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: a * out, transform: `translateY(${(1 - a) * 16}px)` }}>
      <div style={{ width: 880, padding: "24px 30px", borderRadius: 30, background: "#fff", border: `1.5px solid ${CG.line}`, boxShadow: "0 20px 60px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", gap: 16, fontFamily: CG.font }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: CG.font, fontWeight: 600, fontSize: 30, color: CG.ink }}>Heiratsantrag planen</span>
        </div>
        <div style={{ alignSelf: "flex-end", background: CG.bubble, borderRadius: 26, padding: "12px 22px", fontFamily: CG.font, fontWeight: 400, fontSize: 32, color: CG.ink }}>{qs}</div>
        {t > A.gern - 0.3 ? (
          <div style={{ fontFamily: CG.font, fontWeight: 400, fontSize: 36, lineHeight: 1.35, color: CG.ink }}>
            {ans1} {ans2 ? <span style={{ fontWeight: 700 }}>{ans2}</span> : null}
            {t < A.schluss + 0.35 ? <Dot t={t} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const GptAccountGreen: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} />;
