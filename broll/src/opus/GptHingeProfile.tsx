import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { bump, count, ez, G, GF, GreenReel, GreenScene, HH, Odometer, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-hinge-jobtitel/captions.json";

// GPT-S "Hinge-Jobtitel" v2 (Henri 2026-10-20: "anhand eines echten Hinge-Profils, wo die Facts nach und nach
// einsortiert werden"). The split panel is a rebuilt Hinge profile screen (name header, photo card, vitals card,
// prompt cards, like/skip buttons, prompt feedback); each spoken fact drops into its slot. No Hinge logo.
// Photos: CC0 from earlier runs (runs/gpts-hinge-jobtitel/sources.txt). Speaker: blue FP look on Henri's request.

const { fontFamily: serif } = loadSerif("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const HINGE2_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-hinge-jobtitel/avatar.mp4", focus: { x: 0.509, y: 0.597 }, scale: 1.0, faceAt: 0.5 };

const A = {
  jobtitel: at("jobtitel"), wenigsten: at("wenigsten"), founder: at("founder"), idee: at("idee"), domain: at("domain"), kunden: at("kunden"),
  naechstes: at("nächstes"), selbst: at("selbstständig"), maerz: at("märz"), gf: at("geschäftsführer"), firma: at("firma"), creator: at("creator"),
  elf: at("elf"), follower: at("follower"), mutter: at("mutter"), sach1: at("sachbearbeiter", 1), stadt: at("stadt"), unbefristet: at("unbefristet"),
  weihnacht: at("weihnachtsgeld"), bauspar1: at("bausparvertrag", 1), ueberspringt: at("überspringt"), ich: at("ich"), hinge2: at("hinge", 2),
  prueft: at("prüft"), langweilig: at("langweilig"), sach2: at("sachbearbeiter", 2), dreimal: at("dreimal"), grossen: at("großen"),
  matches: at("matches"), hochzeit: at("hochzeit"),
};

// ---------- Hinge-style UI pieces ----------
const H = { bg: "#F4F3F1", card: "#FFFFFF", ink: "#141414", sub: "#6F6F6F", line: "#E6E4E0" };
const PANEL_W = 1080;
const HEADER = 118;

const Heart: React.FC<{ size?: number; fill?: boolean }> = ({ size = 34, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" fill={fill ? H.ink : "none"} stroke={H.ink} strokeWidth={1.9} strokeLinejoin="round" /></svg>
);
const LikeBtn: React.FC<{ press?: number; style?: React.CSSProperties; size?: number }> = ({ press = 0, style, size = 82 }) => (
  <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: H.card, boxShadow: "0 6px 18px rgba(0,0,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.28 * press})`, ...style }}>
    <Heart size={size * 0.44} fill={press > 0.3} />
  </div>
);
const Icon: React.FC<{ kind: "cake" | "pin" | "bag" | "house" | "coin" }> = ({ kind }) => {
  const p = { fill: "none", stroke: H.ink, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={34} height={34} viewBox="0 0 24 24">
      {kind === "cake" ? <><path d="M4 20h16v-7H4z" {...p} /><path d="M4 16c2 1.2 4 1.2 6 0s4-1.2 6 0 3 1 4 0" {...p} /><path d="M12 13V9M12 6.5c.8-.6.8-1.6 0-2.5-.8.9-.8 1.9 0 2.5z" {...p} /></> : null}
      {kind === "pin" ? <><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z" {...p} /><circle cx={12} cy={10} r={2.3} {...p} /></> : null}
      {kind === "bag" ? <><rect x={3.5} y={7.5} width={17} height={12} rx={2} {...p} /><path d="M9 7.5V5.5h6v2M3.5 12.5h17" {...p} /></> : null}
      {kind === "house" ? <><path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5" {...p} /><path d="M10 20v-5h4v5" {...p} /></> : null}
      {kind === "coin" ? <><circle cx={12} cy={12} r={8.5} {...p} /><path d="M14.8 9.2a3.6 3.6 0 100 5.6M7.5 11h5.5M7.5 13.2h5" {...p} /></> : null}
    </svg>
  );
};

/** a fact that drops into its slot: flies up, lands with a short mint highlight */
const Drop: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at: a, children, style }) => {
  if (t < a - 0.2) return null;
  const p = ez(t, a - 0.2, a + 0.12, Easing.out(Easing.back(1.6)));
  const hl = 1 - ez(t, a + 0.15, a + 0.9);
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 70}px) scale(${1 + 0.18 * (1 - p)})`, background: `rgba(191,227,210,${0.9 * hl})`, borderRadius: 10, padding: "0 8px", margin: "0 -8px", ...style }}>
      {children}
    </span>
  );
};

type Vital = { icon: "bag" | "house" | "coin"; at: number; text: string };
type Prompt = { label: string; lines: { at: number; text: React.ReactNode }[]; checks?: boolean; at: number };
type Profile = { name: string; age: number; city: string; photo: string; vitals: Vital[]; prompts: Prompt[]; scroll: [number, number][]; hook?: boolean };

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: H.card, borderRadius: 22, position: "relative", ...style }}>{children}</div>
);

const scrollAt = (t: number, keys: [number, number][]) => {
  let y = keys[0][1];
  for (let i = 1; i < keys.length; i++) y += (keys[i][1] - keys[i - 1][1]) * ez(t, keys[i][0] - 0.35, keys[i][0] + 0.1, Easing.inOut(Easing.cubic));
  return y;
};

const ProfileView: React.FC<{ t: number; p: Profile; likePress?: number; skipPress?: number }> = ({ t, p, likePress = 0, skipPress = 0 }) => {
  const scroll = scrollAt(t, p.scroll);
  const zoom = 1.04 - 0.04 * ez(t, -0.2, 3);
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 32, right: 32, top: HEADER, transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* photo card */}
        <Card style={{ height: 600, overflow: "hidden" }}>
          <Img src={staticFile(p.photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
          {p.hook ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0))" }}>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 44, fontFamily: GF.tight, fontWeight: 900, fontSize: 86, lineHeight: 1.0, letterSpacing: -3, color: "#fff" }}>
                Größter Titel.<br /><span style={{ background: G.green, borderRadius: 12, padding: "0 12px", marginLeft: -12 }}>Kleinstes</span> Gehalt.
              </div>
            </div>
          ) : null}
          <LikeBtn press={0} style={{ right: 26, bottom: 26 }} />
        </Card>
        {/* vitals card */}
        <Card style={{ padding: "0 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26, height: 96, fontFamily: GF.inter, fontWeight: 600, fontSize: 32, color: H.ink }}>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}><Icon kind="cake" />{p.age}</span>
            <span style={{ width: 1.5, height: 40, background: H.line }} />
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}><Icon kind="pin" />{p.city}</span>
          </div>
          {p.vitals.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 92, borderTop: `1.5px solid ${H.line}`, fontFamily: GF.inter, fontWeight: 600, fontSize: 34, color: H.ink }}>
              <Icon kind={v.icon} />
              <Drop t={t} at={v.at}>{v.text}</Drop>
            </div>
          ))}
        </Card>
        {/* prompt cards */}
        {p.prompts.map((q, i) => (
          <Card key={i} style={{ padding: "36px 40px 44px", opacity: ez(t, q.at - 0.25, q.at), transform: `translateY(${(1 - ez(t, q.at - 0.25, q.at + 0.1)) * 40}px)` }}>
            <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>{q.label}</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: q.checks ? 10 : 2, paddingRight: 90 }}>
              {q.lines.map((l, j) => (
                <div key={j} style={{ fontFamily: serif, fontWeight: 600, fontSize: 52, lineHeight: 1.12, color: H.ink, minHeight: 58 }}>
                  <Drop t={t} at={l.at}>{q.checks ? <span style={{ color: G.green, marginRight: 14 }}>✓</span> : null}{l.text}</Drop>
                </div>
              ))}
            </div>
            <LikeBtn size={72} press={0} style={{ right: 28, bottom: 28 }} />
          </Card>
        ))}
      </div>
      {/* fixed header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEADER, background: H.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 48px 0" }}>
        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 64, color: H.ink, letterSpacing: -0.5 }}>{p.name}</div>
        <div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: H.ink }} />)}</div>
      </div>
      {/* floating skip + like (the like on the current card, pressed before the next profile) */}
      <div style={{ position: "absolute", left: 40, bottom: 40, width: 96, height: 96, borderRadius: "50%", background: H.card, boxShadow: "0 8px 22px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.3 * skipPress})` }}>
        <svg width={38} height={38} viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke={H.ink} strokeWidth={2.4} strokeLinecap="round" /></svg>
      </div>
      {likePress > 0 ? <LikeBtn size={96} press={likePress} style={{ right: 40, bottom: 40 }} /> : null}
    </div>
  );
};

// ---------- the five profiles, every fact on its spoken word ----------
const PROFILES: { p: Profile; from: number; to: number; out: "like" | "skip" }[] = [
  {
    from: 0, to: A.selbst - 0.11, out: "like",
    p: {
      name: "Max", age: 31, city: "Berlin", photo: "gpts-hinge-jobtitel/img/max.jpg", hook: true,
      vitals: [{ icon: "bag", at: A.jobtitel, text: "Founder & CEO" }, { icon: "coin", at: A.wenigsten, text: "Gehalt: noch keins" }],
      prompts: [
        { label: "Mein Unternehmen", at: A.founder + 0.2, lines: [{ at: A.idee, text: "Eine Idee." }, { at: A.domain, text: "Und eine Domain." }] },
        { label: "Meine Kunden", at: A.kunden, lines: [{ at: A.naechstes, text: "kommen nächstes Jahr." }] },
      ],
      scroll: [[0, 0], [A.jobtitel - 0.15, 330], [A.founder + 0.25, 640], [A.kunden + 0.15, 900]],
    },
  },
  {
    from: A.selbst - 0.11, to: A.gf - 0.11, out: "like",
    p: {
      name: "Jonas", age: 34, city: "Köln", photo: "gpts-hinge-jobtitel/img/jonas.jpg",
      vitals: [{ icon: "bag", at: A.selbst, text: "Selbstständig" }],
      prompts: [{ label: "Bis vor Kurzem", at: A.maerz - 0.35, lines: [{ at: A.maerz, text: "angestellt. Bis März." }] }],
      scroll: [[0, 330], [A.maerz - 0.4, 560]],
    },
  },
  {
    from: A.gf - 0.11, to: A.creator - 0.11, out: "like",
    p: {
      name: "Leon", age: 29, city: "Hamburg", photo: "gpts-hinge-jobtitel/img/leon.jpg",
      vitals: [{ icon: "bag", at: A.gf, text: "Geschäftsführer" }, { icon: "house", at: A.gf + 0.3, text: "Leon Weber GmbH" }],
      prompts: [{ label: "Mein Team", at: A.firma - 0.3, lines: [{ at: A.firma + 0.35, text: "Ich." }] }],
      scroll: [[0, 330], [A.firma - 0.35, 650]],
    },
  },
  {
    from: A.creator - 0.11, to: A.sach1 - 0.11, out: "like",
    p: {
      name: "Kai", age: 26, city: "München", photo: "gpts-hinge-jobtitel/img/kai.jpg",
      vitals: [{ icon: "bag", at: A.creator, text: "Creator" }],
      prompts: [{ label: "Meine Community", at: A.elf - 0.3, lines: [{ at: A.elf, text: <Followers /> }, { at: A.mutter, text: "Eine davon: Mama." }] }],
      scroll: [[0, 330], [A.elf - 0.35, 560]],
    },
  },
  {
    from: A.sach1 - 0.11, to: A.ueberspringt + 0.12, out: "skip",
    p: {
      name: "Thomas", age: 38, city: "Kassel", photo: "gpts-hinge-jobtitel/img/thomas.jpg",
      vitals: [{ icon: "bag", at: A.sach1, text: "Sachbearbeiter" }, { icon: "house", at: A.stadt, text: "Stadtverwaltung" }],
      prompts: [{ label: "Meine Green Flags", at: A.unbefristet - 0.3, checks: true, lines: [{ at: A.unbefristet, text: "Unbefristet" }, { at: A.weihnacht, text: "Weihnachtsgeld" }, { at: A.bauspar1, text: "Bausparvertrag" }] }],
      scroll: [[0, 330], [A.unbefristet - 0.35, 650]],
    },
  },
];

// odometer inside the Creator prompt (absolute time comes from the closure below)
let FOL_T = 0;
function Followers() {
  const c = count(FOL_T, A.elf - 0.1, A.follower + 0.35, 11, 0);
  return <span style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}><Odometer value={Math.round(c.v)} speed={c.speed} size={58} color={H.ink} /> Follower</span>;
}

const SWAP = 0.32;
const Feed: React.FC<{ t: number }> = ({ t }) => {
  FOL_T = t;
  const i = PROFILES.findIndex((x) => t >= x.from && t < x.to);
  const cur = i >= 0 ? i : PROFILES.length - 1;
  const views: React.ReactNode[] = [];
  const P = PROFILES[cur];
  const leave = ez(t, P.to - SWAP, P.to, Easing.in(Easing.cubic));
  const press = bump(t, P.to - SWAP - 0.3, 0.3);
  const lt = t - P.from;
  const shift = (x: number) => (lt < 0 ? 0 : x);
  views.push(
    <div key={cur} style={{ position: "absolute", inset: 0, transform: `translateX(${-leave * PANEL_W * 1.05}px) rotate(${-leave * 4}deg)`, transformOrigin: "50% 100%" }}>
      <ProfileView t={t} p={{ ...P.p, scroll: P.p.scroll.map(([a, y]) => [shift(a === 0 ? P.from : a), y]) as [number, number][] }} likePress={P.out === "like" ? press : 0} skipPress={P.out === "skip" ? press : 0} />
    </div>,
  );
  // next profile already underneath while the current one leaves (after the skip: back to Max)
  const nextIdx = cur + 1 < PROFILES.length ? cur + 1 : 0;
  if (leave > 0) {
    const N = PROFILES[nextIdx];
    const come = ez(t, P.to - SWAP, P.to + 0.1);
    views.unshift(
      <div key={`n${nextIdx}`} style={{ position: "absolute", inset: 0, transform: `scale(${0.94 + 0.06 * come})`, opacity: 0.4 + 0.6 * come }}>
        <ProfileView t={nextIdx === 0 ? 60 : t} p={{ ...N.p, hook: false, scroll: [[0, 330]] }} />
      </div>,
    );
  }
  if (t >= PROFILES[PROFILES.length - 1].to) {
    return <ProfileView t={60} p={{ ...PROFILES[0].p, hook: false, scroll: [[0, 330]] }} />;
  }
  return <>{views}</>;
};

// ---------- the profile editor with Hinge-style prompt feedback ----------
const Spark: React.FC<{ color?: string }> = ({ color = G.green }) => (
  <svg width={26} height={26} viewBox="0 0 24 24"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" fill={color} /></svg>
);
const Editor: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const scan = ez(t, T(A.prueft) - 0.05, T(A.prueft) + 1.1);
  const hints = [T(A.langweilig), T(A.sach2) + 0.2, T(A.dreimal) - 0.15];
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg }}>
      <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: H.ink }}>Profil bearbeiten</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 120, fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.sub, borderBottom: `1.5px solid ${H.line}`, paddingBottom: 16 }}>
        <span style={{ color: H.ink, borderBottom: `3px solid ${H.ink}`, paddingBottom: 14, marginBottom: -17 }}>Bearbeiten</span><span>Vorschau</span>
      </div>
      <div style={{ position: "absolute", left: 32, right: 32, top: 180 }}>
        <Card style={{ padding: "34px 40px 40px", overflow: "hidden" }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>Mein perfekter Sonntag</div>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 54, color: H.ink, marginTop: 12 }}>Kontoauszüge sortieren.</div>
          {scan > 0 && scan < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 5, background: G.green, boxShadow: "0 0 26px rgba(11,61,44,0.45)" }} /> : null}
        </Card>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {hints.map((a, i) => {
            const p = ez(t, a - 0.15, a + 0.12, Easing.out(Easing.back(1.5)));
            const dark = i === 2;
            return (
              <div key={i} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 50}px) scale(${0.94 + 0.06 * p})`, background: dark ? G.green : H.card, borderRadius: 20, padding: "20px 26px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
                <Spark color={dark ? G.mint : G.green} />
                <div>
                  <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", color: dark ? G.mint : H.sub }}>PROMPT-FEEDBACK</div>
                  <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 31, color: dark ? "#fff" : H.ink }}>Diese Antwort ist etwas langweilig.</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {t > T(A.dreimal) - 0.15 ? (
        <div style={{ position: "absolute", right: 60, bottom: 40, transform: `scale(${1 + 0.3 * bump(t, T(A.dreimal) - 0.15, 0.35)})`, fontFamily: GF.tight, fontWeight: 900, fontSize: 120, color: G.green, letterSpacing: -4 }}>×3</div>
      ) : null}
    </div>
  );
};

const S_ED = A.hinge2 - 0.1;
const SCENES: GreenScene[] = [
  { start: 0, end: A.ich - 0.1, El: Feed },
  { start: S_ED, end: A.grossen + 0.25, El: (p) => <Editor t={p.t} s={S_ED} /> },
];

/** Punchline: two phone notifications above the head, never over the face. */
const Banner: React.FC<{ p: number; title: string; text: string; top: number }> = ({ p, title, text, top }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, opacity: p, transform: `translateY(${(1 - p) * -40}px)`, background: "rgba(255,255,255,0.94)", borderRadius: 30, padding: "20px 24px", display: "flex", gap: 18, alignItems: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
    <div style={{ width: 64, height: 64, borderRadius: 16, background: H.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width={34} height={34} viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" fill="none" stroke="#fff" strokeWidth={2} /></svg></div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 26, color: H.ink }}>{title}</div>
      <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 28, color: H.ink }}>{text}</div>
    </div>
  </div>
);
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.matches - 0.2) return null;
  return (
    <>
      <Banner p={ez(t, A.matches - 0.15, A.matches + 0.2)} top={110} title="Neues Match" text="Max, Founder & CEO" />
      {t > A.hochzeit - 0.2 ? <Banner p={ez(t, A.hochzeit - 0.15, A.hochzeit + 0.2)} top={262} title="Save the Date" text="Thomas heiratet. Bausparvertrag inklusive." /> : null}
    </>
  );
};

const captionY = (_t: number, k: number, panelH: number) => (k > 0 ? Math.max(panelH, HH * 0.3) : 1600);

export const GptHingeProfile: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} captionY={captionY} />;
