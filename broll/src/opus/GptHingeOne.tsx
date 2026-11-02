import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { bump, count, ez, G, GF, GreenReel, GreenScene, HH, Odometer, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-hinge-jobtitel/captions.json";

// GPT-S "Hinge-Jobtitel" v3 (Henri 2026-10-20: "das ganze Skript beschreibt ein Hinge-Profil, mach alles in eins,
// schöner, mehr Inhalt und Value"). ONE rebuilt Hinge profile: every big title the speaker names lands as a chip in
// Max's job field, the truth behind it drops into his prompt "Was nicht im Profil steht", and his like counter climbs.
// On "Sachbearbeiter" the same screen flips to the honest profile (green flags, 0 likes) and gets skipped.
// Then Hinge-style prompt feedback x3, punchline as two phone notifications. No Hinge logo; photos CC0 (sources.txt).

const { fontFamily: serif } = loadSerif("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const HINGE3_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-hinge-jobtitel/avatar.mp4", focus: { x: 0.509, y: 0.597 }, scale: 1.0, faceAt: 0.5 };

const A = {
  jobtitel: at("jobtitel"), wenigsten: at("wenigsten"), founder: at("founder"), idee: at("idee"), domain: at("domain"), kunden: at("kunden"),
  naechstes: at("nächstes"), selbst: at("selbstständig"), maerz: at("märz"), gf: at("geschäftsführer"), firma: at("firma"), creator: at("creator"),
  elf: at("elf"), follower: at("follower"), mutter: at("mutter"), sach1: at("sachbearbeiter", 1), stadt: at("stadt"), unbefristet: at("unbefristet"),
  weihnacht: at("weihnachtsgeld"), bauspar1: at("bausparvertrag", 1), ueberspringt: at("überspringt"), ich: at("ich"), hinge2: at("hinge", 2),
  prueft: at("prüft"), langweilig: at("langweilig"), sach2: at("sachbearbeiter", 2), dreimal: at("dreimal"), grossen: at("großen"),
  matches: at("matches"), hochzeit: at("hochzeit"),
};

// ---------- Hinge-style building blocks ----------
const H = { bg: "#F4F3F1", card: "#FFFFFF", ink: "#141414", sub: "#707070", line: "#E7E5E1" };
const HEADER = 118;
const HEART = "M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z";
const Heart: React.FC<{ size?: number; fill?: string; stroke?: string }> = ({ size = 34, fill = "none", stroke = H.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={HEART} fill={fill} stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" /></svg>
);
const Round: React.FC<{ size: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, style, children }) => (
  <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: H.card, boxShadow: "0 6px 18px rgba(0,0,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
const Icon: React.FC<{ kind: "cake" | "pin" | "ruler" | "bag" | "house" }> = ({ kind }) => {
  const p = { fill: "none", stroke: H.ink, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={34} height={34} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {kind === "cake" ? <><path d="M4 20h16v-7H4z" {...p} /><path d="M4 16c2 1.2 4 1.2 6 0s4-1.2 6 0 3 1 4 0" {...p} /><path d="M12 13V9M12 6.5c.8-.6.8-1.6 0-2.5-.8.9-.8 1.9 0 2.5z" {...p} /></> : null}
      {kind === "pin" ? <><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z" {...p} /><circle cx={12} cy={10} r={2.3} {...p} /></> : null}
      {kind === "ruler" ? <><path d="M4 16L16 4l4 4L8 20z" {...p} /><path d="M8 12l2 2M11 9l2 2M14 6l2 2" {...p} /></> : null}
      {kind === "bag" ? <><rect x={3.5} y={7.5} width={17} height={12} rx={2} {...p} /><path d="M9 7.5V5.5h6v2M3.5 12.5h17" {...p} /></> : null}
      {kind === "house" ? <><path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5" {...p} /><path d="M10 20v-5h4v5" {...p} /></> : null}
    </svg>
  );
};
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: H.card, borderRadius: 22, position: "relative", ...style }}>{children}</div>
);
/** a fact drops into its slot: flies up with a little overshoot, lands with a mint highlight that fades */
const Drop: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at: a, children, style }) => {
  if (t < a - 0.22) return null;
  const p = ez(t, a - 0.22, a + 0.12, Easing.out(Easing.back(1.7)));
  const hl = 1 - ez(t, a + 0.2, a + 1.0);
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 70}px) scale(${1 + 0.16 * (1 - p)})`, background: `rgba(191,227,210,${0.95 * hl})`, borderRadius: 12, padding: "0 10px", margin: "0 -10px", ...style }}>{children}</span>
  );
};
const Chip: React.FC<{ t: number; at: number; text: string }> = ({ t, at: a, text }) => {
  if (t < a - 0.2) return null;
  const p = ez(t, a - 0.2, a + 0.14, Easing.out(Easing.back(2)));
  return (
    <span style={{ display: "inline-block", transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 30}px)`, opacity: Math.min(1, p * 2), fontFamily: GF.inter, fontWeight: 700, fontSize: 32, color: "#fff", background: H.ink, borderRadius: 999, padding: "10px 22px", boxShadow: `0 0 0 ${10 * bump(t, a + 0.05, 0.4)}px rgba(191,227,210,0.9)` }}>{text}</span>
  );
};
/** floating hearts when likes come in */
const Burst: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at: a, x, y }) => {
  const d = t - a;
  if (d < 0 || d > 0.9) return null;
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const k = d / 0.9;
        return <div key={i} style={{ position: "absolute", left: x + (i - 1.5) * 26 + Math.sin(i * 2 + d * 8) * 10, top: y - k * (120 + i * 30), opacity: 1 - k, transform: `scale(${0.7 + 0.2 * i})` }}><Heart size={30} fill={G.green} stroke={G.green} /></div>;
      })}
    </>
  );
};

// likes come in with every big title
const LIKES: [number, number][] = [[A.founder, 14], [A.selbst, 11], [A.gf, 17], [A.creator, 9]];
const likesAt = (t: number) => LIKES.reduce((s, [a, n]) => s + count(t, a, a + 0.6, n, 0).v, 0);

// the truth behind the titles, line by line
const TRUTH: { at: number; tag: string; text: React.ReactNode }[] = [
  { at: A.idee, tag: "Founder", text: "1 Idee + 1 Domain" },
  { at: A.naechstes, tag: "Founder", text: "Kunden: nächstes Jahr" },
  { at: A.maerz, tag: "Selbstständig", text: "bis März angestellt" },
  { at: A.firma + 0.3, tag: "Geschäftsführer", text: "Mitarbeiter: 1. Er." },
  { at: A.elf, tag: "Creator", text: "FOLLOWERS" },
];

let NOW = 0;
const Followers: React.FC = () => {
  const c = count(NOW, A.elf - 0.1, A.follower + 0.35, 11, 0);
  const mum = NOW > A.mutter - 0.1;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
      <Odometer value={Math.round(c.v)} speed={c.speed} size={44} color={H.ink} /> Follower
      {mum ? <Drop t={NOW} at={A.mutter}><span style={{ color: G.green }}>· 1 davon: Mama</span></Drop> : null}
    </span>
  );
};

// ---------- the one profile screen ----------
const SKIP_AT = A.ueberspringt;
const Profile: React.FC<{ t: number; asBack?: boolean }> = ({ t, asBack }) => {
  NOW = t;
  const honest = ez(t, A.sach1 - 0.3, A.sach1 + 0.05, Easing.inOut(Easing.cubic)); // flip to the honest profile
  const flip = Math.sin(Math.PI * honest); // squash at the midpoint of the flip
  const isHonest = honest > 0.5;
  const skipPress = asBack ? 0 : bump(t, SKIP_AT - 0.35, 0.35);
  const back = asBack || t > SKIP_AT + 0.4; // after the skip the feed shows Max again
  const skip = back ? 0 : ez(t, SKIP_AT - 0.05, SKIP_AT + 0.4, Easing.in(Easing.cubic));
  const showHonest = isHonest && !back;
  const scroll = showHonest ? 400 + 140 * ez(t, A.unbefristet - 0.4, A.unbefristet) : t < 0.5 ? 0 : 400 * ez(t, A.jobtitel - 0.45, A.jobtitel + 0.1, Easing.inOut(Easing.cubic)) + 120 * ez(t, A.firma, A.firma + 0.4, Easing.inOut(Easing.cubic)) + 150 * ez(t, A.elf - 0.4, A.elf, Easing.inOut(Easing.cubic));
  const likes = showHonest ? 0 : likesAt(back ? 99 : t);
  const zoom = 1.05 - 0.05 * ez(t, 0, 3);

  const name = showHonest ? "Thomas" : "Max";
  const photo = showHonest ? "gpts-hinge-jobtitel/img/thomas.jpg" : "gpts-hinge-jobtitel/img/max.jpg";
  const vt = back ? 99 : t; // facts already in place when Max comes back
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      {skip > 0 && !back ? <div style={{ position: "absolute", inset: 0, transform: `scale(${0.93 + 0.07 * skip})`, opacity: 0.5 + 0.5 * skip }}><Profile t={t} asBack /></div> : null}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-skip * 1150}px) rotate(${-skip * 5}deg) scaleY(${1 - 0.08 * flip})`, transformOrigin: "50% 100%", opacity: 1 - 0.3 * flip }}>
        <div style={{ position: "absolute", left: 32, right: 32, top: HEADER, transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ height: 520, overflow: "hidden" }}>
            <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
            {!showHonest && !back ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0))" }}>
                <div style={{ position: "absolute", left: 40, right: 120, bottom: 40, fontFamily: GF.tight, fontWeight: 900, fontSize: 84, lineHeight: 1.0, letterSpacing: -3, color: "#fff" }}>
                  Größter Titel.<br /><span style={{ background: G.green, borderRadius: 12, padding: "0 12px", marginLeft: -12 }}>Kleinstes</span> Gehalt.
                </div>
              </div>
            ) : null}
            <Round size={78} style={{ right: 24, bottom: 24 }}><Heart size={34} /></Round>
          </Card>
          <Card style={{ padding: "0 34px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, height: 96, fontFamily: GF.inter, fontWeight: 600, fontSize: 31, color: H.ink }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon kind="cake" />{showHonest ? 38 : 31}</span>
              <span style={{ width: 1.5, height: 40, background: H.line }} />
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon kind="ruler" />{showHonest ? "1,82 m" : "1,86 m"}</span>
              <span style={{ width: 1.5, height: 40, background: H.line }} />
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon kind="pin" />{showHonest ? "Kassel" : "Berlin"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 18, borderTop: `1.5px solid ${H.line}`, padding: "22px 0", minHeight: 96 }}>
              <div style={{ paddingTop: 10 }}><Icon kind="bag" /></div>
              {showHonest ? (
                <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: H.ink, paddingTop: 6 }}><Drop t={t} at={A.sach1}>Sachbearbeiter bei der Stadt</Drop></div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {t < A.founder - 0.2 && !back ? <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: H.ink, paddingTop: 6 }}><Drop t={t} at={A.jobtitel}>Founder & CEO</Drop></span> : null}
                  <Chip t={vt} at={A.founder} text="Founder" />
                  <Chip t={vt} at={A.selbst} text="Selbstständig" />
                  <Chip t={vt} at={A.gf} text="Geschäftsführer" />
                  <Chip t={vt} at={A.creator} text="Creator" />
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, borderTop: `1.5px solid ${H.line}`, height: 92, fontFamily: GF.inter, fontWeight: 600, fontSize: 32, color: H.ink }}>
              <Icon kind="house" />
              {showHonest ? <Drop t={t} at={A.stadt}>Stadtverwaltung Kassel</Drop> : <Drop t={vt} at={A.firma - 0.1}>Max Ventures GmbH</Drop>}
            </div>
          </Card>
          <Card style={{ padding: "34px 40px 40px", opacity: showHonest ? ez(t, A.unbefristet - 0.35, A.unbefristet - 0.1) : back ? 1 : ez(t, A.idee - 0.4, A.idee - 0.1) }}>
            <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>{showHonest ? "Meine Green Flags" : "Was nicht im Profil steht"}</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, paddingRight: 80 }}>
              {showHonest
                ? [["Unbefristet", A.unbefristet], ["Weihnachtsgeld", A.weihnacht], ["Bausparvertrag", A.bauspar1]].map(([txt, a]) => (
                    <div key={txt as string} style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: H.ink, minHeight: 58 }}>
                      <Drop t={t} at={a as number}><span style={{ color: G.green, marginRight: 14 }}>✓</span>{txt}</Drop>
                    </div>
                  ))
                : TRUTH.map((x, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, minHeight: 56 }}>
                      {vt > x.at - 0.2 ? <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.08em", color: H.sub, width: 196, flexShrink: 0, textTransform: "uppercase" }}>{x.tag}</span> : null}
                      <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 44, color: H.ink, lineHeight: 1.15 }}>
                        <Drop t={vt} at={x.at}>{x.text === "FOLLOWERS" ? <Followers /> : x.text}</Drop>
                      </span>
                    </div>
                  ))}
            </div>
            <Round size={70} style={{ right: 26, bottom: 26 }}><Heart size={30} /></Round>
          </Card>
        </div>
        {/* header with name and the like counter */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEADER, background: H.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 40px 0 48px" }}>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 64, color: H.ink, letterSpacing: -0.5 }}>{name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: showHonest ? H.card : H.ink, borderRadius: 999, padding: "10px 22px", transform: `scale(${1 + 0.12 * Math.max(...LIKES.map(([a]) => bump(t, a + 0.1, 0.35)))})` }}>
            <Heart size={30} fill={showHonest ? "none" : G.mint} stroke={showHonest ? H.ink : G.mint} />
            <Odometer value={Math.round(likes)} size={40} color={showHonest ? H.ink : "#fff"} />
            <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: showHonest ? H.sub : "rgba(255,255,255,0.75)" }}>Likes</span>
          </div>
        </div>
        {!showHonest ? LIKES.map(([a], i) => <Burst key={i} t={t} at={a + 0.1} x={880} y={120} />) : null}
      </div>
      {/* the skip button, pressed on "überspringt" */}
      {asBack ? null : <Round size={100} style={{ left: 40, bottom: 40, transform: `scale(${1 + 0.32 * skipPress})`, background: skipPress > 0.3 ? H.ink : H.card }}>
        <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke={skipPress > 0.3 ? "#fff" : H.ink} strokeWidth={2.4} strokeLinecap="round" /></svg>
      </Round>}
    </div>
  );
};

// ---------- profile editor with prompt feedback x3 ----------
const Spark: React.FC<{ color?: string }> = ({ color = G.green }) => (
  <svg width={28} height={28} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" fill={color} /></svg>
);
const Editor: React.FC<{ t: number; s: number }> = ({ t, s }) => {
  const T = (x: number) => x - s;
  const scan = ez(t, T(A.prueft) - 0.05, T(A.prueft) + 1.1);
  const hints = [T(A.langweilig), T(A.sach2) + 0.2, T(A.dreimal) - 0.15];
  const typed = "Kontoauszüge sortieren.";
  const n = Math.round(typed.length * ez(t, 0.15, 0.95, Easing.linear));
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg }}>
      <div style={{ height: 106, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.inter, fontWeight: 700, fontSize: 34, color: H.ink }}>Profil bearbeiten</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 120, fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.sub, borderBottom: `1.5px solid ${H.line}`, paddingBottom: 16 }}>
        <span style={{ color: H.ink, borderBottom: `3px solid ${H.ink}`, paddingBottom: 14, marginBottom: -17 }}>Bearbeiten</span><span>Vorschau</span>
      </div>
      <div style={{ position: "absolute", left: 32, right: 32, top: 176 }}>
        <Card style={{ padding: "30px 38px 36px", overflow: "hidden" }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 27, color: H.ink }}>Mein perfekter Sonntag</div>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 54, color: H.ink, marginTop: 10 }}>{typed.slice(0, n)}<span style={{ opacity: n < typed.length && Math.floor(t * 4) % 2 === 0 ? 1 : 0 }}>|</span></div>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 22, color: H.sub, marginTop: 8 }}>Thomas · Sachbearbeiter bei der Stadt</div>
          {scan > 0 && scan < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 5, background: G.green, boxShadow: "0 0 26px rgba(11,61,44,0.45)" }} /> : null}
        </Card>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {hints.map((a, i) => {
            const p = ez(t, a - 0.15, a + 0.12, Easing.out(Easing.back(1.5)));
            const dark = i === 2;
            return (
              <div key={i} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 50}px) scale(${0.94 + 0.06 * p})`, background: dark ? G.green : H.card, borderRadius: 20, padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
                <Spark color={dark ? G.mint : G.green} />
                <div>
                  <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 19, letterSpacing: "0.08em", color: dark ? G.mint : H.sub }}>PROMPT-FEEDBACK · KI</div>
                  <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: dark ? "#fff" : H.ink }}>Diese Antwort ist etwas langweilig.</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {t > T(A.dreimal) - 0.15 ? (
        <div style={{ position: "absolute", right: 56, bottom: 30, transform: `scale(${1 + 0.3 * bump(t, T(A.dreimal) - 0.15, 0.35)})`, fontFamily: GF.tight, fontWeight: 900, fontSize: 120, color: G.green, letterSpacing: -4 }}>×3</div>
      ) : null}
    </div>
  );
};

const S_ED = A.hinge2 - 0.1;
const SCENES: GreenScene[] = [
  { start: 0, end: A.ich - 0.1, El: Profile },
  { start: S_ED, end: A.grossen + 0.25, El: (p) => <Editor t={p.t} s={S_ED} /> },
];

/** Punchline: two phone notifications above the head, never over the face. */
const Banner: React.FC<{ p: number; title: string; text: string; top: number }> = ({ p, title, text, top }) => (
  <div style={{ position: "absolute", left: 56, right: 56, top, opacity: p, transform: `translateY(${(1 - p) * -40}px)`, background: "rgba(255,255,255,0.95)", borderRadius: 30, padding: "20px 24px", display: "flex", gap: 18, alignItems: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
    <div style={{ width: 64, height: 64, borderRadius: 16, background: H.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Heart size={34} stroke="#fff" /></div>
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
      <Banner p={ez(t, A.matches - 0.15, A.matches + 0.2)} top={110} title="Neues Match" text="Max · Founder, Geschäftsführer, Creator" />
      {t > A.hochzeit - 0.2 ? <Banner p={ez(t, A.hochzeit - 0.15, A.hochzeit + 0.2)} top={262} title="Save the Date" text="Thomas heiratet. Bausparvertrag inklusive." /> : null}
    </>
  );
};

const captionY = (_t: number, k: number, panelH: number) => (k > 0 ? Math.max(panelH, HH * 0.3) : 1600);

export const GptHingeOne: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} captionY={captionY} />;
