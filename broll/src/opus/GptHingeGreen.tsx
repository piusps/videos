import React from "react";
import { bump, Check, count, ez, G, GF, Glass, Glint, GreenReel, GreenScene, HH, Odometer, PopWords, Ripple, useSp, Word, Backdrop } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-hinge-jobtitel/captions.json";

// GPT-S Gründer-Satire "Hinge-Jobtitel", runs/gpts-hinge-jobtitel, 2026-10-20 (Henri).
// Same build as GptWorkshopGreen, but rendered in the blue FP main look (niklasblau 42a2318d) on Henri's request.

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const HINGE_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-hinge-jobtitel/avatar.mp4", focus: { x: 0.509, y: 0.597 }, scale: 1.0, faceAt: 0.5 };

const A = {
  wenigsten: at("wenigsten"), founder: at("founder"), idee: at("idee"), domain: at("domain"), kunden: at("kunden"), naechstes: at("nächstes"),
  selbst: at("selbstständig"), maerz: at("märz"), gf: at("geschäftsführer"), firma: at("firma"), creator: at("creator"), elf: at("elf"),
  follower: at("follower"), mutter: at("mutter"), sach1: at("sachbearbeiter", 1), unbefristet: at("unbefristet"), weihnacht: at("weihnachtsgeld"),
  bauspar1: at("bausparvertrag", 1), ueberspringt: at("überspringt"), ich: at("ich"), hinge2: at("hinge", 2), prueft: at("prüft"),
  langweilig: at("langweilig"), sach2: at("sachbearbeiter", 2), dreimal: at("dreimal"), grossen: at("großen"), matches: at("matches"),
  bauspar2: at("bausparvertrag", 2), hochzeit: at("hochzeit"),
};

const LINE = "rgba(11,61,44,0.12)";
const Tag: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: G.white, background: G.green, borderRadius: 10, padding: "8px 14px", whiteSpace: "nowrap", ...style }}>{text}</span>
);
const Label: React.FC<{ text: string; color?: string }> = ({ text, color = G.dim }) => (
  <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color }}>{text}</div>
);
const Avatar: React.FC<{ ch: string; size?: number; on?: boolean }> = ({ ch, size = 64, on }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: on ? G.green : G.mint, color: on ? G.white : G.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: size * 0.44, flexShrink: 0 }}>{ch}</div>
);
const pop = (t: number, a: number) => ({ o: ez(t, a - 0.12, a + 0.08), s: 0.86 + 0.14 * ez(t, a - 0.12, a + 0.16) + 0.06 * bump(t, a + 0.1, 0.3) });

// ---------- 1 · Hook: three big job titles fan in, the salary bars shrink ----------
const HOOK_CARDS = [
  { ch: "M", name: "Max, 31", job: "Founder & CEO", at: 0.12, pay: 0.22 },
  { ch: "J", name: "Jonas, 29", job: "Geschäftsführer", at: 0.38, pay: 0.3 },
  { ch: "L", name: "Leon, 27", job: "Creator", at: 0.64, pay: 0.14 },
];
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const shrink = ez(t, A.wenigsten - 0.45, A.wenigsten + 0.3);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Größter Titel. Kleinstes Gehalt." hi="Kleinstes" at={-1} style={{ position: "absolute", left: 60, right: 60, top: 90, fontFamily: GF.tight, fontWeight: 900, fontSize: 86, lineHeight: 1.04, letterSpacing: -3, color: G.green }} />
      {HOOK_CARDS.map((c, i) => {
        const p = pop(t, c.at);
        return (
          <Glass key={i} style={{ position: "absolute", left: 60, right: 60, top: 330 + i * 196, padding: "20px 26px", display: "flex", alignItems: "center", gap: 20, opacity: p.o, transform: `translateX(${(1 - p.o) * 120}px) scale(${p.s})` }}>
            <Avatar ch={c.ch} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: G.dim }}>{c.name}</div>
              <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{c.job}</div>
            </div>
            <div style={{ width: 230, flexShrink: 0 }}>
              <Label text="GEHALT" />
              <div style={{ height: 20, borderRadius: 10, background: "rgba(11,61,44,0.07)", marginTop: 8 }}>
                <div style={{ width: `${(1 - shrink) * 92 + shrink * c.pay * 100}%`, height: "100%", borderRadius: 10, background: shrink > 0.5 ? G.green : G.mint }} />
              </div>
            </div>
          </Glass>
        );
      })}
      <Ripple t={t} at={A.wenigsten + 0.1} x={860} y={620} r={220} />
    </>
  );
};

// ---------- 2 · what the job field says vs. what it means ----------
const Row: React.FC<{ t: number; at: number; job: string; children: React.ReactNode; top: number }> = ({ t, at: a, job, children, top }) => {
  const p = pop(t, a);
  return (
    <Glass style={{ position: "absolute", left: 60, right: 60, top, padding: "24px 28px", opacity: p.o, transform: `translateY(${(1 - p.o) * 40}px) scale(${p.s})` }}>
      <Label text="IM PROFIL" />
      <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 64, color: G.green, letterSpacing: -2, lineHeight: 1.05 }}>{job}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>{children}</div>
    </Glass>
  );
};
const Fact: React.FC<{ t: number; at: number; text: string; dark?: boolean }> = ({ t, at: a, text, dark }) => {
  const p = pop(t, a);
  return (
    <span style={{ opacity: p.o, transform: `scale(${p.s})`, display: "inline-block", fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: dark ? G.white : G.ink, background: dark ? G.green : G.white, border: `1.5px solid ${dark ? G.green : LINE}`, borderRadius: 16, padding: "10px 18px", boxShadow: "0 8px 18px rgba(11,61,44,0.1)" }}>{text}</span>
  );
};

const Titel1: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  return (
    <>
      <Backdrop t={t} variant={1} />
      <Row t={t} at={T(A.founder)} job="Founder" top={70}>
        <Fact t={t} at={T(A.idee)} text="1 Idee" />
        <Fact t={t} at={T(A.domain)} text="1 Domain" />
        <Fact t={t} at={T(A.kunden)} text="Kunden: 0" />
        <Fact t={t} at={T(A.naechstes)} text="nächstes Jahr" dark />
      </Row>
      <Row t={t} at={T(A.selbst)} job="Selbstständig" top={470}>
        <Fact t={t} at={T(A.maerz)} text="bis März angestellt" dark />
      </Row>
      <Ripple t={t} at={T(A.naechstes) + 0.1} x={760} y={330} r={180} />
    </>
  );
};

const Titel2: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const fol = count(t, T(A.elf) - 0.15, T(A.follower) + 0.35, 11, 0);
  const mum = t > T(A.mutter) - 0.05;
  return (
    <>
      <Backdrop t={t} variant={2} />
      <Row t={t} at={T(A.gf)} job="Geschäftsführer" top={70}>
        <Fact t={t} at={T(A.firma)} text="Mitarbeiter: 1" />
        <Fact t={t} at={T(A.firma) + 0.45} text="das ist er" dark />
      </Row>
      <Row t={t} at={T(A.creator)} job="Creator" top={470}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: ez(t, T(A.elf) - 0.2, T(A.elf)) }}>
          <Odometer value={Math.round(fol.v)} speed={fol.speed} size={64} />
          <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: G.dim }}>Follower</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
          {Array.from({ length: 11 }, (_, i) => {
            const on = mum && i === 10;
            const p = ez(t, T(A.elf) + i * 0.05, T(A.elf) + 0.2 + i * 0.05);
            return <div key={i} style={{ opacity: p, transform: `scale(${(0.7 + 0.3 * p) * (on ? 1 + 0.25 * bump(t, T(A.mutter), 0.35) : 1)})` }}><Avatar ch={on ? "M" : ""} size={34} on={on} /></div>;
          })}
        </div>
        {mum ? <Fact t={t} at={T(A.mutter)} text="1 davon: Mama" dark /> : null}
      </Row>
    </>
  );
};

// ---------- 3 · the honest clerk: three green checks, then everyone swipes him away ----------
const Stadt: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const sp = useSp();
  const T = (x: number) => x - s;
  const card = sp(T(A.sach1) - 0.1, 12, 220);
  const swipe = ez(t, T(A.ueberspringt) - 0.05, T(A.ueberspringt) + 0.45);
  const perks = [
    { text: "Unbefristet", a: T(A.unbefristet) },
    { text: "Weihnachtsgeld", a: T(A.weihnacht) },
    { text: "Bausparvertrag", a: T(A.bauspar1) },
  ];
  return (
    <>
      <Backdrop t={t} variant={3} />
      <Glass style={{ position: "absolute", left: 90, right: 90, top: 80, padding: "28px 32px", opacity: Math.min(1, card * 2) * (1 - 0.65 * swipe), transform: `translateX(${-swipe * 760}px) rotate(${-swipe * 14}deg) scale(${0.9 + 0.1 * card})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar ch="T" size={70} />
          <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 32, color: G.ink }}>Thomas, 32</div>
        </div>
        <div style={{ marginTop: 16 }}><Label text="JOB" /></div>
        <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 56, color: G.ink, lineHeight: 1.08 }}>Sachbearbeiter bei der Stadt</div>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {perks.map((p) => (
            <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 14, opacity: ez(t, p.a - 0.12, p.a + 0.08) }}>
              <Check size={44} p={ez(t, p.a, p.a + 0.3)} />
              <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: G.ink }}>{p.text}</span>
            </div>
          ))}
        </div>
        <Glint t={t} at={T(A.bauspar1) + 0.2} />
      </Glass>
      {swipe > 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", opacity: ez(t, T(A.ueberspringt) + 0.1, T(A.ueberspringt) + 0.3) }}>
          <Tag text="ÜBERSPRUNGEN" style={{ fontSize: 40, padding: "14px 26px" }} />
        </div>
      ) : null}
    </>
  );
};

// ---------- 4 · the dating app checks profile answers with AI, three hints for the clerk ----------
const KI: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const scan = ez(t, T(A.prueft) - 0.1, T(A.prueft) + 1.2);
  const hints = [T(A.langweilig), T(A.sach2) + 0.2, T(A.dreimal) - 0.15];
  return (
    <>
      <Backdrop t={t} variant={0} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 70, padding: "26px 30px", overflow: "hidden" }}>
        <Label text="MEIN PERFEKTER SONNTAG" />
        <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.ink, marginTop: 8, lineHeight: 1.1 }}>Kontoauszüge sortieren.</div>
        {scan > 0 && scan < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: G.green, boxShadow: "0 0 24px rgba(11,61,44,0.45)" }} /> : null}
      </Glass>
      <div style={{ position: "absolute", left: 60, right: 60, top: 330, display: "flex", flexDirection: "column", gap: 16 }}>
        {hints.map((a, i) => {
          const p = pop(t, a);
          return (
            <div key={i} style={{ opacity: p.o, transform: `translateX(${(1 - p.o) * 60}px) scale(${p.s})`, display: "flex", alignItems: "center", gap: 16, background: i === 2 ? G.green : G.white, border: `1.5px solid ${i === 2 ? G.green : LINE}`, borderRadius: 22, padding: "18px 22px", boxShadow: "0 10px 24px rgba(11,61,44,0.12)" }}>
              <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: i === 2 ? G.mint : G.dim, whiteSpace: "nowrap" }}>KI-HINWEIS</span>
              <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 30, color: i === 2 ? G.white : G.ink }}>Diese Antwort ist etwas langweilig.</span>
            </div>
          );
        })}
      </div>
      {t > T(A.dreimal) - 0.15 ? (
        <div style={{ position: "absolute", right: 70, top: 700, transform: `scale(${1 + 0.3 * bump(t, T(A.dreimal) - 0.15, 0.35)})` }}>
          <span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 110, color: G.green, letterSpacing: -4 }}>×3</span>
        </div>
      ) : null}
      <Ripple t={t} at={T(A.dreimal)} x={880} y={760} r={200} />
    </>
  );
};

const S1 = A.founder - 0.12, S2 = A.gf - 0.12, S3 = A.sach1 - 0.12, S4 = A.hinge2 - 0.1;
const SCENES: GreenScene[] = [
  { start: 0, end: S1, El: Hook },
  { start: S1, end: S2, El: (p) => <Titel1 t={p.t} s={S1} />, joinPrev: true },
  { start: S2, end: S3, El: (p) => <Titel2 t={p.t} s={S2} />, joinPrev: true },
  { start: S3, end: A.ich - 0.1, El: (p) => <Stadt t={p.t} s={S3} />, joinPrev: true },
  { start: S4, end: A.grossen + 0.25, El: (p) => <KI t={p.t} s={S4} /> },
];

/** Punchline in full frame: two small cards above the head, never over the face. */
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.matches - 0.2) return null;
  const a = ez(t, A.matches - 0.15, A.matches + 0.2);
  const b = ez(t, A.hochzeit - 0.15, A.hochzeit + 0.2);
  const card = (label: string, who: string, dark: boolean, p: number) => (
    <Glass style={{ padding: "16px 24px", borderRadius: 22, opacity: p, transform: `translateY(${(1 - p) * 16}px) scale(${0.92 + 0.08 * p})`, background: dark ? "rgba(11,61,44,0.95)" : G.white }}>
      <div style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: dark ? G.mint : G.dim }}>{label}</div>
      <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 36, color: dark ? G.white : G.ink }}>{who}</div>
    </Glass>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 18 }}>
      {card("MATCHES", "Founder & CEO", false, a)}
      {t > A.hochzeit - 0.2 ? card("HOCHZEIT", "Bausparvertrag", true, b) : null}
    </div>
  );
};

// full frame: caption well below the chin of the blue look (chin ~1455 px), split: on the seam
const captionY = (_t: number, k: number, panelH: number) => (k > 0 ? Math.max(panelH, HH * 0.3) : 1600);

export const GptHingeGreen: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} captionY={captionY} />;
