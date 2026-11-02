import React from "react";
import { Easing } from "remotion";
import { ez, GreenReel, GreenScene, Word } from "../components/GptGreenKit";
import { C, ChatGPTWeb, COL, cursorAt, MANAGE_BTN, MemoryDialog, POS, ProfileMenu, SettingsDialog, SideData, ThreadMsg, track, W, WebCam, WebState } from "../components/ChatGPTWeb";
import captionsJson from "../../runs/gpts-geteilter-account/captions.json";

// GPT-S "Geteilter ChatGPT-Account" v4 (Henri 2026-10-21): the whole B-roll is the ChatGPT web app rebuilt in real CSS
// pixels (components/ChatGPTWeb.tsx), filmed like a zoomed screen recording with cursor, clicks, typing, hover states,
// real scrolling and a blue accent (captions, selection). No extra cards, pills or circles. All titles invented.

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text).startsWith(w) && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const ACCW_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-geteilter-account/avatar.mp4", focus: { x: 0.449, y: 0.633 }, scale: 1.08, faceAt: 0.57 };
const BLUE = "#2F7CF6";

const A = {
  account1: at("account", 1), jeder: at("jeder"), kennen1: at("kennen", 1), merkt1: at("merkt", 1), alles1: at("alles", 1), tippt: at("tippt"),
  paare2: at("paare", 1), erinnern: at("erinnern"), sie: at("sie", 1), geburtstage: at("geburtstage"), passwoerter: at("passwörter"), psychologie: at("psychologie"),
  transaktives: at("transaktiv"), gedaechtnis: at("gedächtnis"), jetzt: at("jetzt"), beiden: at("beiden"),
  jana1: at("jana", 1), geschenk: at("geschenk"), playstation: at("playstation"), sagen: at("sagen"),
  sucht: at("sucht"), restaurant: at("restaurant"), bitte: at("bitte"), langweilig: at("langweilig"), witze: at("witze"),
  dann: at("dann"), heiratsantrag: at("heiratsantrag"), gern: at("gern"), kleine: at("kleine"), jana3: at("jana", 3), schluss: at("schluss"), ihr2: at("ihr", 2),
};

const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(Math.max(0, Math.min(1, (t - a) / (b - a))) * s.length));
const streamed = (s: string, t: number, a: number, b: number) => {
  const w = s.split(" ");
  return w.slice(0, Math.round(Math.max(0, Math.min(1, (t - a) / (b - a))) * w.length)).join(" ");
};
const Dot: React.FC<{ t: number }> = ({ t }) => <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, marginLeft: 6, background: C.ink, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 7)), verticalAlign: "middle" }} />;

// ---------- sidebar content (invented, fits Jana and Tim) ----------
const RECENT = ["Laufschuhe vergleichen", "Spanisch Vokabeln", "Laktosefreie Rezepte", "Zahnarzt Angst Tipps", "Steuer Tipps Freelancer", "Montagsmotivation", "Wäscheplan WG", "Pflanzen gießen Plan"];
const MORE = ["Jahrestag Ideen", "Playstation 5 Preis", "Ist Pasta langweilig?", "Tim Geburtstag Liste", "Passwort Router", "Witze für Anfänger", "Kann man Schweigen lernen?", "Mülltage Kalender", "Wie sagt man es nett?", "Laufschuhe Größe 44", "Geschenk unter 50 Euro", "Lieblingsessen Jana"];
const SIDE = (recent: string[]): SideData => ({
  pinned: ["Einkaufsliste"],
  projects: [{ name: "Urlaub 2027" }, { name: "Wohnung", chats: ["Mietvertrag prüfen", "Sofa ausmessen"] }],
  recent,
  account: { initials: "JT", name: "Jana & Tim", plan: "Plus" },
});

/** shared flow: click "Neuer Chat", click the composer, type, press send; afterwards the thread. */
type Flow = { q: string; title: string; prevTitle: string; prevRecent: string[]; tNew: number; tComp: number; tType: [number, number]; tSend: number };
const flowState = (t: number, f: Flow, answer: React.ReactNode, threadScroll = 0): Omit<WebState, "cursor"> => {
  const sent = t >= f.tSend + 0.05;
  const home = t >= f.tNew + 0.05;
  const recent = sent ? [f.title, ...f.prevRecent] : f.prevRecent;
  const msgs: ThreadMsg[] = sent ? [{ role: "user", content: f.q }, { role: "assistant", content: answer }] : [];
  return {
    side: SIDE(recent),
    active: sent ? f.title : home ? undefined : f.prevTitle,
    newPop: sent ? ez(t, f.tSend, f.tSend + 0.35) : undefined,
    view: sent || !home ? "thread" : "home",
    title: sent ? f.title : f.prevTitle,
    messages: sent ? msgs : home ? [] : [{ role: "user", content: "…" }],
    threadScroll,
    composer: sent ? "" : typed(f.q, t, f.tType[0], f.tType[1]),
    caret: !sent && t > f.tComp,
    sendPress: Math.max(0, 1 - Math.abs(t - f.tSend) / 0.1),
  };
};
const flowCursor = (t: number, f: Flow, park: { x: number; y: number }) => cursorAt(t, [
  { t: 0, x: COL.cx + 120, y: 520 }, { t: f.tNew - 0.05, x: POS.newChat.x, y: POS.newChat.y },
  { t: f.tComp - 0.05, x: COL.cx - 120, y: POS.composerHome.y }, { t: f.tType[1], x: COL.cx - 120, y: POS.composerHome.y },
  { t: f.tSend - 0.05, x: POS.sendHome.x, y: POS.sendHome.y }, { t: f.tSend + 0.7, x: park.x, y: park.y },
], [f.tNew, f.tComp, f.tSend]);
const flowCam = (t: number, f: Flow, thread: [number, number][]) => ({
  cx: track(t, [[0, COL.cx], [f.tNew - 0.2, 330], [f.tNew + 0.15, 330], [f.tComp - 0.1, COL.cx], [f.tSend + 0.1, COL.cx], ...thread.map(([a]) => [a, COL.cx] as [number, number])]),
  cy: track(t, [[0, 400], [f.tNew - 0.2, 240], [f.tNew + 0.15, 240], [f.tComp - 0.1, POS.composerHome.y], [f.tSend + 0.1, POS.composerHome.y], ...thread]),
  z: track(t, [[0, 1.7], [f.tNew - 0.2, 1.9], [f.tComp - 0.1, 2.05], [f.tSend + 0.3, 2.0]]),
});

// ---------- 1 · Hook: the question is sent, the answer streams, the camera pulls back to "Jana & Tim · Plus" ----------
const Q0 = "Sollen wir uns einen ChatGPT Account teilen?";
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const a1 = streamed("Ja, gute Idee.", t, 0.25, Math.max(0.6, A.jeder - 0.15));
  const a2 = streamed("Jeder spart 11,50 € im Monat. Und ihr lernt euch endlich richtig kennen.", t, A.jeder - 0.05, A.kennen1 + 0.3);
  const st: WebState = {
    side: SIDE(["Account teilen?", ...RECENT]), active: "Account teilen?", view: "thread", title: "Account teilen?",
    messages: [{ role: "user", content: Q0 }, { role: "assistant", content: <>{a1}{a2 ? <><br />{a2}</> : null}{t < A.kennen1 + 0.35 ? <Dot t={t} /> : null}</> }],
    hover: t > A.account1 + 0.35 ? "profile" : undefined,
    cursor: cursorAt(t, [{ t: 0, x: COL.cx + 150, y: 640 }, { t: A.account1 - 0.3, x: COL.cx + 120, y: 620 }, { t: A.account1 + 0.4, x: POS.profile.x, y: POS.profile.y }, { t: A.kennen1 + 1, x: POS.profile.x + 6, y: POS.profile.y - 2 }]),
  };
  const pull = [[0, 0], [A.account1 - 0.35, 0], [A.account1 + 0.5, 1]] as [number, number][];
  return (
    <WebCam cx={track(t, pull.map(([a, v]) => [a, COL.cx + (300 - COL.cx) * v]))} cy={track(t, pull.map(([a, v]) => [a, 170 + (560 - 170) * v]))} z={track(t, pull.map(([a, v]) => [a, 2.15 - 0.6 * v]))}>
      <ChatGPTWeb st={st} />
    </WebCam>
  );
};

// ---------- 2 · profile → Personalisierung → Verwalten: the memory list fills up and scrolls ----------
const MEM = ["Ist laktoseintolerant", "Sucht neue Laufschuhe", "Hasst Montage", "Hat Angst vor Zahnärzten", "Lernt Spanisch", "Fragt oft nach Steuer Tipps", "Will eine Playstation", "Findet Italiener langweilig"];
const Memory: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const k1 = 0.2, k2 = 0.72, k3 = 1.42;
  const menuP = t < k2 ? ez(t, k1, k1 + 0.15) : 1 - ez(t, k2, k2 + 0.12);
  const setP = t < k3 ? ez(t, k2 + 0.05, k2 + 0.25) : 1 - ez(t, k3, k3 + 0.15);
  const memP = ez(t, k3 + 0.05, k3 + 0.25);
  const a0 = Math.max(k3 + 0.2, T(A.alles1) - 0.2), a1 = T(A.tippt) + 0.2;
  const n = Math.max(1, Math.min(MEM.length, Math.floor(((t - a0) / (a1 - a0)) * MEM.length) + 1));
  const stepT = (i: number) => a0 + (i * (a1 - a0)) / MEM.length;
  const newest = ez(t, stepT(n - 1), stepT(n - 1) + 0.25);
  const scroll = track(t, [[stepT(5), 0], [stepT(6) + 0.2, 50], [stepT(7) + 0.2, 100]]);
  const cur = cursorAt(t, [
    { t: 0, x: POS.profile.x + 6, y: POS.profile.y - 2 }, { t: 0.15, x: POS.profile.x, y: POS.profile.y },
    { t: 0.62, x: POS.menu(0).x, y: POS.menu(0).y }, { t: 1.3, x: MANAGE_BTN.x, y: MANAGE_BTN.y }, { t: 2.2, x: MANAGE_BTN.x + 40, y: MANAGE_BTN.y + 150 },
  ], [k1, k2, k3]);
  const st: WebState = {
    side: SIDE(["Account teilen?", ...RECENT]), active: "Account teilen?", view: "thread", title: "Account teilen?",
    messages: [{ role: "user", content: Q0 }, { role: "assistant", content: <>Ja, gute Idee.<br />Jeder spart 11,50 € im Monat. Und ihr lernt euch endlich richtig kennen.</> }],
    hover: t < k1 + 0.05 ? "profile" : undefined,
    overlay: (
      <>
        {menuP > 0 ? <ProfileMenu p={menuP} hover={t > 0.5 && t < k2 + 0.1 ? 0 : undefined} /> : null}
        {setP > 0 ? <SettingsDialog p={setP} manageHover={t > 1.2 && t < k3 + 0.1} managePress={Math.max(0, 1 - Math.abs(t - k3) / 0.1)} /> : null}
        {memP > 0 ? <MemoryDialog p={memP} rows={MEM.slice(0, n)} newest={newest} scroll={scroll} /> : null}
      </>
    ),
    cursor: cur,
  };
  return (
    <WebCam cx={track(t, [[0, 300], [0.6, 300], [1.05, W.w / 2]])} cy={track(t, [[0, 600], [0.6, 610], [1.05, 400]])} z={track(t, [[0, 1.55], [0.6, 1.6], [1.05, 1.62], [3.5, 1.7]])}>
      <ChatGPTWeb st={st} />
    </WebCam>
  );
};

// ---------- 3 · new chat: "Wer merkt sich in einer Beziehung was?" ----------
const COLS = { sie: ["Geburtstage", "Jahrestag", "Arzttermine"], er: ["Passwörter", "WLAN", "Mülltage"] };
const Transaktiv: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const f: Flow = { q: "Wer merkt sich in einer Beziehung was?", title: "Wer merkt sich was?", prevTitle: "Account teilen?", prevRecent: ["Account teilen?", ...RECENT], tNew: 0.3, tComp: 0.5, tType: [0.55, 1.05], tSend: 1.15 };
  const li = (items: string[], a0: number) => items.map((it, i) => (t > a0 + i * 0.18 ? <li key={it} style={{ opacity: ez(t, a0 + i * 0.18, a0 + i * 0.18 + 0.15) }}>{it}</li> : null));
  const answer = t < T(A.erinnern) - 0.3 ? <Dot t={t} /> : (
    <div>
      {streamed("Paare teilen sich das Erinnern auf.", t, T(A.erinnern) - 0.3, T(A.sie) - 0.1)}
      {t > T(A.sie) - 0.15 ? <div style={{ marginTop: 12 }}><b>Sie merkt sich</b><ul style={{ margin: "4px 0 0", paddingLeft: 24 }}>{li(COLS.sie, T(A.geburtstage) - 0.1)}</ul></div> : null}
      {t > T(A.passwoerter) - 0.35 ? <div style={{ marginTop: 10 }}><b>Er merkt sich</b><ul style={{ margin: "4px 0 0", paddingLeft: 24 }}>{li(COLS.er, T(A.passwoerter) - 0.1)}</ul></div> : null}
      {t > T(A.psychologie) - 0.1 ? <div style={{ marginTop: 12 }}>{streamed("In der Psychologie heißt das", t, T(A.psychologie) - 0.1, T(A.transaktives) - 0.05)} {t > T(A.transaktives) - 0.05 ? <b style={{ background: `rgba(47,124,246,${0.16 * ez(t, T(A.gedaechtnis), T(A.gedaechtnis) + 0.3)})`, borderRadius: 4, padding: "0 3px" }}>transaktives Gedächtnis</b> : null}{t > T(A.gedaechtnis) + 0.3 ? " (Wegner, 1991)." : ""}</div> : null}
      {t < T(A.gedaechtnis) + 0.3 ? <Dot t={t} /> : null}
    </div>
  );
  const st: WebState = { ...flowState(t, f, answer), cursor: flowCursor(t, f, { x: COL.cx + 200, y: 640 }) };
  const cam = flowCam(t, f, [[f.tSend + 0.4, 200], [T(A.sie), 230], [T(A.passwoerter), 330], [T(A.psychologie) + 0.3, 420]]);
  return <WebCam cx={cam.cx} cy={cam.cy} z={cam.z}><ChatGPTWeb st={st} /></WebCam>;
};

// ---------- 4 · the sidebar is full of both of them: the cursor scrolls through it ----------
const Alles: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const recent = ["Wer merkt sich was?", "Account teilen?", ...MORE, ...RECENT];
  const scroll = track(t, [[0.15, 0], [T(A.beiden) + 0.3, 520]]);
  const cy = 470;
  const row = Math.floor((cy + scroll - 364) / 36);
  const st: WebState = {
    side: SIDE(recent), active: "Wer merkt sich was?", view: "thread", title: "Wer merkt sich was?",
    messages: [{ role: "user", content: "Wer merkt sich in einer Beziehung was?" }, { role: "assistant", content: "Paare teilen sich das Erinnern auf." }],
    sideScroll: scroll, hover: row >= 0 && row < recent.length ? `chat:${recent[row]}` : undefined,
    cursor: cursorAt(t, [{ t: 0, x: COL.cx + 200, y: 640 }, { t: 0.25, x: 170, y: cy }]),
  };
  return <WebCam cx={track(t, [[0, COL.cx], [0.3, 260]])} cy={track(t, [[0, 420], [0.3, 470]])} z={track(t, [[0, 1.6], [0.3, 1.85], [2.2, 1.95]])}><ChatGPTWeb st={st} /></WebCam>;
};

// ---------- 5 · Jana: gift idea for Tim ----------
const Geschenk: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const prev = ["Wer merkt sich was?", "Account teilen?", ...RECENT];
  const f: Flow = { q: "Geschenkidee für Tim?", title: "Geschenkidee für Tim", prevTitle: "Wer merkt sich was?", prevRecent: prev, tNew: 0.3, tComp: 0.55, tType: [0.6, T(A.geschenk) + 0.35], tSend: T(A.geschenk) + 0.5 };
  const answer = t < T(A.playstation) - 0.1 ? <Dot t={t} /> : <>{streamed("Eine Playstation. Er traut sich nur nicht, es dir zu sagen.", t, T(A.playstation) - 0.1, T(A.sagen) + 0.1)}{t < T(A.sagen) + 0.15 ? <Dot t={t} /> : null}</>;
  const st: WebState = { ...flowState(t, f, answer), cursor: flowCursor(t, f, { x: COL.cx + 200, y: 560 }) };
  const cam = flowCam(t, f, [[f.tSend + 0.4, 160], [T(A.playstation), 170]]);
  return <WebCam cx={cam.cx} cy={cam.cy} z={cam.z + 0.15 * ez(t, T(A.playstation), T(A.sagen))}><ChatGPTWeb st={st} /></WebCam>;
};

// ---------- 6 · Tim: restaurant for the anniversary; the cursor selects "Wie deine Witze." ----------
const Italiener: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const prev = ["Geschenkidee für Tim", "Wer merkt sich was?", "Account teilen?", ...RECENT];
  const f: Flow = { q: "Restaurant zum Jahrestag?", title: "Restaurant zum Jahrestag", prevTitle: "Geschenkidee für Tim", prevRecent: prev, tNew: 0.25, tComp: 0.45, tType: [0.5, T(A.restaurant) + 0.4], tSend: T(A.restaurant) + 0.55 };
  const w = T(A.witze) - 0.15;
  const sel = ez(t, w + 0.25, w + 0.75, Easing.inOut(Easing.quad));
  const answer = t < T(A.bitte) - 0.1 ? <Dot t={t} /> : (
    <div>
      {streamed("Bitte keinen Italiener. Den findet Jana langweilig.", t, T(A.bitte) - 0.1, T(A.langweilig) + 0.2)}
      {t > w ? <div style={{ marginTop: 10 }}><span style={{ backgroundImage: `linear-gradient(${C.select}, ${C.select})`, backgroundRepeat: "no-repeat", backgroundSize: `${sel * 100}% 100%`, padding: "1px 0" }}>Wie deine Witze.</span></div> : null}
      {t < T(A.langweilig) + 0.25 ? <Dot t={t} /> : null}
    </div>
  );
  // "Wie deine Witze." sits on its own line below the first answer line: x from the column's left edge, y ≈ 214
  const selY = 76 + 44 + 26 + 28 + 10 + 14;
  const cur = t < w + 0.1 ? flowCursor(t, f, { x: COL.cx - 200, y: selY + 40 }) : cursorAt(t, [
    { t: w + 0.1, x: COL.cx - 200, y: selY + 40 }, { t: w + 0.25, x: COL.cx - COL.w / 2 - 2, y: selY }, { t: w + 0.75, x: COL.cx - COL.w / 2 + 118, y: selY + 1 },
  ], [w + 0.25]);
  const st: WebState = { ...flowState(t, f, answer), cursor: cur };
  const cam = flowCam(t, f, [[f.tSend + 0.4, 170], [w, 190], [w + 0.4, 205]]);
  return <WebCam cx={track(t, [[0, cam.cx], [w, cam.cx], [w + 0.4, COL.cx - 60]])} cy={cam.cy} z={cam.z + 0.3 * ez(t, w, w + 0.4)}><ChatGPTWeb st={st} /></WebCam>;
};

const SCENES: GreenScene[] = [
  { start: 0, end: A.merkt1 - 0.35, El: Hook },
  { start: A.merkt1 - 0.35, end: A.paare2 - 0.15, El: (p) => <Memory t={p.t} s={A.merkt1 - 0.35} />, joinPrev: true },
  { start: A.paare2 - 0.15, end: A.jetzt - 0.12, El: (p) => <Transaktiv t={p.t} s={A.paare2 - 0.15} />, joinPrev: true },
  { start: A.jetzt - 0.12, end: A.jana1 - 0.2, El: (p) => <Alles t={p.t} s={A.jetzt - 0.12} />, joinPrev: true },
  { start: A.jana1 - 0.2, end: A.sucht - 0.35, El: (p) => <Geschenk t={p.t} s={A.jana1 - 0.2} />, joinPrev: true },
  { start: A.sucht - 0.35, end: A.dann + 0.45, El: (p) => <Italiener t={p.t} s={A.sucht - 0.35} />, joinPrev: true },
];

/** Punchline in full frame: the same app, a small window above the head (never over the face). */
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
      <div style={{ width: 880, padding: "24px 30px", borderRadius: 28, background: C.bg, boxShadow: "0 0 0 1.5px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", gap: 16, fontFamily: C.font, color: C.ink }}>
        <div style={{ fontSize: 26, fontWeight: 600 }}>Heiratsantrag planen</div>
        <div style={{ alignSelf: "flex-end", background: C.bubble, borderRadius: 26, padding: "12px 22px", fontSize: 32 }}>{qs}</div>
        {t > A.gern - 0.3 ? <div style={{ fontSize: 36, lineHeight: 1.35 }}>{ans1} {ans2 ? <b>{ans2}</b> : null}{t < A.schluss + 0.35 ? <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, marginLeft: 8, background: C.ink, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 7)) }} /> : null}</div> : null}
      </div>
    </div>
  );
};

export const GptAccountWeb: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} accent={BLUE} />;
// silence unused import warnings for W (kept for future scenes)
void W;
