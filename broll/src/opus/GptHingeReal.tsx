import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadSans } from "@remotion/google-fonts/DMSans";
import { bump, count, ez, G, GF, GreenReel, GreenScene, HH, Odometer, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-hinge-jobtitel/captions.json";

// GPT-S "Hinge-Jobtitel" v5 = the v4 flow (GptHingeFlow, one continuous feed, soft transitions) restyled to the real
// Hinge UI from Henri's screenshot (2026-10-20): centred name + purple heart, "•••", off-white cards on light grey,
// large icon rows in the vitals card, big serif prompt answers, black like button with white heart, big white skip
// button. Only the UI is copied, no content of the real person. Photos CC0 (runs/gpts-hinge-jobtitel/sources.txt).
// Flow: Max collects every big title + the truth behind it, likes climb -> liked, Thomas pushes in -> green flags,
// 0 likes -> skipped -> "Ich finde ..." undo -> AI scan + three prompt-feedback notes on his cards -> punchline.

const { fontFamily: serif } = loadSerif("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: sans } = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const HINGE5_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-hinge-jobtitel/avatar.mp4", focus: { x: 0.507, y: 0.596 }, scale: 1.0, faceAt: 0.5 };

const A = {
  jobtitel: at("jobtitel"), founder: at("founder"), idee: at("idee"), naechstes: at("nächstes"), selbst: at("selbstständig"),
  maerz: at("märz"), gf: at("geschäftsführer"), firma: at("firma"), creator: at("creator"), elf: at("elf"), mutter: at("mutter"),
  sach1: at("sachbearbeiter", 1), stadt: at("stadt"), unbefristet: at("unbefristet"), weihnacht: at("weihnachtsgeld"),
  bauspar1: at("bausparvertrag", 1), ueberspringt: at("überspringt"), ich: at("ich"), wahrheit: at("wahrheit"),
  prueft: at("prüft"), langweilig: at("langweilig"), sach2: at("sachbearbeiter", 2), dreimal: at("dreimal"),
  grossen: at("großen"), matches: at("matches"), bauspar2: at("bausparvertrag", 2),
};

// measured on Henri's screenshot (920 px wide), scaled to the 1080 px panel
const H = { bg: "#F1F1F1", card: "#FFFDFC", ink: "#181818", sub: "#6E6E6E", line: "#ECEBE9", purple: "#6A2861", btn: "#1A1A1A" };
const HEADER = 150;
const SIDE = 52;
const ROW = 148;
const io = Easing.inOut(Easing.cubic);
const soft = Easing.out(Easing.cubic);

// ---------- Hinge UI pieces ----------
const HEART = "M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z";
const Heart: React.FC<{ size?: number; fill?: string; stroke?: string; sw?: number }> = ({ size = 34, fill = "none", stroke = H.ink, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={HEART} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" /></svg>
);
const Spark: React.FC<{ color?: string; size?: number }> = ({ color = G.green, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" fill={color} /></svg>
);
/** the black like button that sits on every photo / prompt card */
const LikeBtn: React.FC<{ size?: number; style?: React.CSSProperties; press?: number }> = ({ size = 118, style, press = 0 }) => (
  <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", background: H.btn, boxShadow: "0 6px 16px rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.25 * press})`, ...style }}>
    <Heart size={size * 0.42} stroke="#fff" sw={2.6} fill={press > 0.35 ? "#fff" : "none"} />
  </div>
);
type IconKind = "cake" | "person" | "magnet" | "bag" | "building";
const Icon: React.FC<{ kind: IconKind; size?: number }> = ({ kind, size = 56 }) => {
  const p = { fill: "none", stroke: H.ink, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {kind === "cake" ? <><path d="M7 20h10l1-6H6z" {...p} /><path d="M5.5 14c1.2-2.6 3.6-3.6 6.5-3.6s5.3 1 6.5 3.6" {...p} /><circle cx={12} cy={6} r={1.4} {...p} /><path d="M12 7.4v3" {...p} /></> : null}
      {kind === "person" ? <><circle cx={12} cy={7.5} r={3.5} {...p} /><path d="M6 20.5v-2.5c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5v2.5z" {...p} /></> : null}
      {kind === "magnet" ? <><path d="M9 5.5L5 9.5a6 6 0 008.5 8.5l4-4" {...p} /><path d="M9 5.5l3 3M17.5 14l-3-3M14 7l3-3M16 9l3-3" {...p} /></> : null}
      {kind === "bag" ? <><rect x={3.2} y={7.2} width={17.6} height={12.6} rx={1.6} {...p} /><path d="M8.5 7.2V4.6h7v2.6M8 7.2v12.6M16 7.2v12.6" {...p} /></> : null}
      {kind === "building" ? <><rect x={5} y={3.5} width={14} height={17} rx={1} {...p} /><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10.5 20.5v-3h3v3" {...p} /></> : null}
    </svg>
  );
};
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: H.card, borderRadius: 26, position: "relative", ...style }}>{children}</div>
);
/** soft entrance: fade + small drift + blur, then a mint highlight that fades out slowly */
const Soft: React.FC<{ t: number; at: number; children: React.ReactNode; hl?: boolean }> = ({ t, at: a, children, hl = true }) => {
  const p = ez(t, a - 0.18, a + 0.22, soft);
  if (p <= 0) return <span style={{ visibility: "hidden" }}>{children}</span>;
  const h = hl ? 1 - ez(t, a + 0.3, a + 1.4) : 0;
  return (
    <span style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 22}px)`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined, background: `rgba(191,227,210,${0.85 * h * p})`, borderRadius: 12, padding: "0 10px", margin: "0 -10px" }}>{children}</span>
  );
};
const Grow: React.FC<{ p: number; h: number; children: React.ReactNode }> = ({ p, h, children }) => (
  <div style={{ maxHeight: h * p, overflow: "hidden", opacity: Math.min(1, p * 1.4) }}>{children}</div>
);
const Burst: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at: a, x, y }) => {
  const d = t - a;
  if (d < 0 || d > 1.1) return null;
  const k = d / 1.1;
  return <>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: x + i * 30 + Math.sin(i * 2 + d * 6) * 8, top: y + k * (90 + i * 24), opacity: (1 - k) * 0.9 }}><Heart size={26} fill={H.purple} stroke={H.purple} /></div>)}</>;
};
/** header as in the app: centred name + purple heart, "•••" right; our counters sit on the left */
const Header: React.FC<{ name: string; likes: number; t: number; pulseAts: number[]; fb?: number; fbAt?: number }> = ({ name, likes, t, pulseAts, fb = 0, fbAt = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEADER, background: H.card, borderBottom: `1.5px solid ${H.line}` }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 54, color: H.ink, letterSpacing: -0.3 }}>{name}</span>
      <Heart size={34} fill={H.purple} stroke={H.purple} />
    </div>
    <div style={{ position: "absolute", right: 46, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 9 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: H.ink }} />)}</div>
    <div style={{ position: "absolute", left: 32, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: likes > 0 ? "rgba(106,40,97,0.10)" : "rgba(0,0,0,0.05)", borderRadius: 999, padding: "8px 16px", transform: `scale(${1 + 0.12 * Math.max(0, ...pulseAts.map((a) => bump(t, a + 0.1, 0.45)))})` }}>
        <Heart size={24} fill={likes > 0 ? H.purple : "none"} stroke={likes > 0 ? H.purple : H.sub} />
        <Odometer value={Math.round(likes)} size={32} color={likes > 0 ? H.purple : H.sub} />
      </div>
      {fb > 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: G.green, borderRadius: 999, padding: "8px 14px", transform: `scale(${1 + 0.2 * bump(t, fbAt, 0.4)})` }}>
          <Spark color={G.mint} size={22} /><span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 28, color: "#fff" }}>×{fb}</span>
        </div>
      ) : null}
    </div>
  </div>
);
const VRow: React.FC<{ icon: IconKind; children: React.ReactNode }> = ({ icon, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30, minHeight: ROW, borderTop: `2px solid ${H.line}`, fontFamily: sans, fontWeight: 400, fontSize: 40, color: H.ink, padding: "18px 0" }}>
    <Icon kind={icon} />
    <div style={{ flex: 1, lineHeight: 1.3 }}>{children}</div>
  </div>
);
const TopRow: React.FC<{ age: number }> = ({ age }) => (
  <div style={{ display: "flex", alignItems: "stretch", height: 170, fontFamily: sans, fontWeight: 400, fontSize: 40, color: H.ink }}>
    {([["cake", String(age)], ["person", "Mann"], ["magnet", "Hetero"]] as [IconKind, string][]).map(([ic, tx], i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: i === 0 ? "0 30px 0 0" : "0 30px", borderRight: i < 2 ? `2px solid ${H.line}` : undefined, margin: "20px 0" }}>
        <Icon kind={ic} size={52} /><span>{tx}</span>
      </div>
    ))}
  </div>
);
const PromptCard: React.FC<{ q: string; children: React.ReactNode; style?: React.CSSProperties; press?: number }> = ({ q, children, style, press = 0 }) => (
  <Card style={{ padding: "52px 52px 64px", ...style }}>
    <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 36, color: H.ink }}>{q}</div>
    <div style={{ marginTop: 22, paddingRight: 110 }}>{children}</div>
    <LikeBtn press={press} style={{ right: 26, bottom: 26 }} />
  </Card>
);
const scrollTo = (t: number, keys: [number, number, number?][]) => {
  let y = keys[0][1];
  for (let i = 1; i < keys.length; i++) y += (keys[i][1] - keys[i - 1][1]) * ez(t, keys[i][0], keys[i][0] + (keys[i][2] ?? 0.6), io);
  return y;
};
const ANS: React.CSSProperties = { fontFamily: serif, fontWeight: 700, fontSize: 70, lineHeight: 1.14, letterSpacing: -1.2, color: H.ink };

// ---------- Max: every big title in one profile ----------
const LIKES: [number, number][] = [[A.founder, 14], [A.selbst, 11], [A.gf, 17], [A.creator, 9]];
const TITLES: [string, number][] = [["Founder", A.founder], ["Selbstständig", A.selbst], ["Geschäftsführer", A.gf], ["Creator", A.creator]];
const TRUTH: { at: number; tag: string; text: string }[] = [
  { at: A.idee, tag: "Founder", text: "1 Idee + 1 Domain" },
  { at: A.naechstes, tag: "Founder", text: "Kunden: nächstes Jahr" },
  { at: A.maerz, tag: "Selbstständig", text: "bis März angestellt" },
  { at: A.firma + 0.3, tag: "Geschäftsführer", text: "Mitarbeiter: 1. Er." },
  { at: A.elf, tag: "Creator", text: "FOLLOWERS" },
];
const MaxView: React.FC<{ t: number; likePress: number }> = ({ t, likePress }) => {
  const likes = LIKES.reduce((s, [a, n]) => s + count(t, a, a + 0.8, n, 0).v, 0);
  const scroll = scrollTo(t, [[0, 0], [A.jobtitel - 0.4, 560, 0.7], [A.founder - 0.2, 790, 0.7], [A.elf - 0.45, 890, 0.5]]);
  const fol = count(t, A.elf - 0.1, A.elf + 0.6, 11, 0);
  const hookOut = ez(t, A.jobtitel - 0.4, A.jobtitel + 0.3);
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: SIDE, right: SIDE, top: HEADER + 28, transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 30 }}>
        <Card style={{ height: 600, overflow: "hidden" }}>
          <Img src={staticFile("gpts-hinge-jobtitel/img/max.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 - 0.06 * ez(t, 0, 3.2, io)})` }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0))", opacity: 1 - 0.6 * hookOut }}>
            <div style={{ position: "absolute", left: 40, right: 150, bottom: 44, fontFamily: GF.tight, fontWeight: 900, fontSize: 84, lineHeight: 1.0, letterSpacing: -3, color: "#fff" }}>
              Größter Titel.<br /><span style={{ background: G.green, borderRadius: 12, padding: "0 12px", marginLeft: -12 }}>Kleinstes</span> Gehalt.
            </div>
          </div>
          <LikeBtn style={{ right: 26, bottom: 26 }} />
        </Card>
        <Card style={{ padding: "0 40px" }}>
          <TopRow age={31} />
          <VRow icon="bag">
            {t < A.founder - 0.1 ? (
              <span style={{ opacity: 1 - ez(t, A.founder - 0.35, A.founder - 0.1) }}><Soft t={t} at={A.jobtitel}>Founder & CEO</Soft></span>
            ) : (
              <span>{TITLES.map(([x, a], i) => (t > a - 0.2 ? <React.Fragment key={x}>{i > 0 ? <span style={{ color: H.sub, opacity: ez(t, a - 0.2, a) }}> · </span> : null}<Soft t={t} at={a}>{x}</Soft></React.Fragment> : null))}</span>
            )}
          </VRow>
        </Card>
        <PromptCard q="Was nicht im Profil steht" press={likePress} style={{ opacity: ez(t, A.founder + 0.1, A.idee - 0.1, soft) }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TRUTH.map((x, i) => (
              <div key={i}>
                <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 20, letterSpacing: "0.1em", color: H.purple, textTransform: "uppercase", opacity: ez(t, x.at - 0.3, x.at) }}>{x.tag}</div>
                <div style={{ ...ANS, fontSize: 50, lineHeight: 1.1 }}>
                  <Soft t={t} at={x.at}>
                    {x.text === "FOLLOWERS" ? <span style={{ display: "inline-flex", alignItems: "baseline", gap: 14 }}><Odometer value={Math.round(fol.v)} speed={fol.speed} size={50} color={H.ink} /> Follower</span> : x.text}
                  </Soft>
                  {x.text === "FOLLOWERS" ? <Soft t={t} at={A.mutter}><span style={{ color: H.purple }}>, 1 davon Mama</span></Soft> : null}
                </div>
              </div>
            ))}
          </div>
        </PromptCard>
      </div>
      <Header name="Max" likes={likes} t={t} pulseAts={LIKES.map(([a]) => a)} />
      {LIKES.map(([a], i) => <Burst key={i} t={t} at={a + 0.1} x={60} y={HEADER - 20} />)}
    </div>
  );
};

// ---------- Thomas: the honest profile, then the AI feedback on HIS cards ----------
const FB = [A.langweilig, A.sach2 + 0.1, A.dreimal - 0.05];
const Feedback: React.FC<{ t: number; at: number; dark?: boolean }> = ({ t, at: a, dark }) => (
  <Grow p={ez(t, a - 0.15, a + 0.35, soft)} h={150}>
    <div style={{ marginTop: 26, background: dark ? G.green : "#EAF2EE", borderRadius: 18, padding: "18px 22px", display: "flex", alignItems: "center", gap: 14 }}>
      <Spark color={dark ? G.mint : G.green} size={30} />
      <div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", color: dark ? G.mint : G.green }}>PROMPT-FEEDBACK · KI</div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 32, color: dark ? "#fff" : H.ink }}>Diese Antwort ist etwas langweilig.</div>
      </div>
    </div>
  </Grow>
);
const ThomasView: React.FC<{ t: number }> = ({ t }) => {
  const scroll = scrollTo(t, [[0, 560], [A.unbefristet - 0.5, 900], [A.sach2 - 0.6, 1560, 0.75], [A.dreimal - 0.6, 2010, 0.6]]);
  const glow = bump(t, A.wahrheit - 0.1, 1.3);
  const fbCount = FB.filter((a) => t > a - 0.05).length;
  const lastFb = FB[Math.max(0, fbCount - 1)];
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: SIDE, right: SIDE, top: HEADER + 28, transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 30 }}>
        <Card style={{ height: 600, overflow: "hidden" }}>
          <Img src={staticFile("gpts-hinge-jobtitel/img/thomas.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <LikeBtn style={{ right: 26, bottom: 26 }} />
        </Card>
        <Card style={{ padding: "0 40px" }}>
          <TopRow age={38} />
          <VRow icon="bag"><Soft t={t} at={A.sach1}>Sachbearbeiter</Soft></VRow>
          <VRow icon="building"><Soft t={t} at={A.stadt}>Stadtverwaltung Kassel</Soft></VRow>
        </Card>
        <PromptCard q="Meine Green Flags" style={{ boxShadow: `0 0 0 ${12 * glow}px rgba(191,227,210,0.95)` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {([["Unbefristet.", A.unbefristet], ["Weihnachtsgeld.", A.weihnacht], ["Bausparvertrag.", A.bauspar1]] as [string, number][]).map(([txt, a]) => (
              <div key={txt} style={{ ...ANS, minHeight: 80 }}><Soft t={t} at={a}>{txt}</Soft></div>
            ))}
          </div>
          <Feedback t={t} at={FB[0]} />
        </PromptCard>
        <PromptCard q="Mein perfekter Sonntag">
          <div style={ANS}>Kontoauszüge sortieren.</div>
          <Feedback t={t} at={FB[1]} />
        </PromptCard>
        <PromptCard q="Ich bin Profi in">
          <div style={ANS}>Fristen.</div>
          <Feedback t={t} at={FB[2]} dark />
        </PromptCard>
      </div>
      <Header name="Thomas" likes={0} t={t} pulseAts={[]} fb={fbCount} fbAt={lastFb} />
    </div>
  );
};

/** AI scan beam over the visible profile */
const Scan: React.FC<{ t: number }> = ({ t }) => {
  const a = A.prueft - 0.1, b = A.langweilig;
  if (t < a || t > b + 0.3) return null;
  const p = ez(t, a, b, Easing.inOut(Easing.sin));
  const o = ez(t, a, a + 0.25) * (1 - ez(t, b, b + 0.3));
  const y = HEADER + p * 820;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 90, height: 180, background: "linear-gradient(to bottom, rgba(191,227,210,0), rgba(191,227,210,0.55), rgba(191,227,210,0))", opacity: o }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 4, background: G.green, opacity: o, boxShadow: "0 0 24px rgba(11,61,44,0.5)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: HEADER + 22, display: "flex", justifyContent: "center", opacity: o }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: G.green, borderRadius: 999, padding: "12px 24px" }}><Spark color={G.mint} size={26} /><span style={{ fontFamily: sans, fontWeight: 700, fontSize: 28, color: "#fff" }}>KI prüft Antworten …</span></div>
      </div>
    </>
  );
};

// ---------- the one continuous feed ----------
const L0 = A.sach1 - 0.55, L1 = A.sach1 + 0.05;
const S0 = A.ueberspringt - 0.05, S1 = A.ueberspringt + 0.5;
const R0 = A.ich - 0.2, R1 = A.ich + 0.45;
const Feed: React.FC<{ t: number }> = ({ t }) => {
  const push = ez(t, L0, L1, io);
  const skipped = ez(t, S0, S1, io) * (1 - ez(t, R0, R1, Easing.out(Easing.back(1.2))));
  const likePress = bump(t, L0 - 0.35, 0.4);
  const skipPress = bump(t, S0 - 0.3, 0.4);
  const tx = (x: number) => `translateX(${x * 1080}px)`;
  const toast = (a: number, b: number, text: string, dark?: boolean) => {
    const o = ez(t, a, a + 0.25) * (1 - ez(t, b, b + 0.3));
    if (o <= 0) return null;
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: HEADER + 22, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * -20}px)` }}>
        <div style={{ background: dark ? H.btn : H.purple, color: "#fff", borderRadius: 999, padding: "14px 28px", fontFamily: sans, fontWeight: 600, fontSize: 30 }}>{text}</div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: sans, fontWeight: 500, fontSize: 34, color: H.sub, opacity: skipped }}>Keine weiteren Profile in deiner Nähe</div>
      {push < 1 ? <div style={{ position: "absolute", inset: 0, transform: `${tx(-push)} rotate(${-push * 3}deg)`, transformOrigin: "50% 100%" }}><MaxView t={t} likePress={likePress} /></div> : null}
      {push > 0 ? (
        <div style={{ position: "absolute", inset: 0, transform: `${tx(1 - push - skipped * 0.78)} rotate(${-skipped * 4}deg)`, transformOrigin: "50% 100%", opacity: 1 - 0.35 * skipped }}>
          <ThomasView t={t} />
        </div>
      ) : null}
      <Scan t={t} />
      {toast(L0 - 0.1, L1 + 0.5, "Like an Max gesendet")}
      {toast(R0 + 0.05, A.wahrheit + 0.4, "↺  Rückgängig", true)}
      {/* the big white skip button, bottom-left as in the app */}
      <div style={{ position: "absolute", left: 30, bottom: 30, width: 140, height: 140, borderRadius: "50%", background: skipPress > 0.3 ? H.btn : "#FFFFFF", boxShadow: "0 8px 22px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.25 * skipPress})` }}>
        <svg width={54} height={54} viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke={skipPress > 0.3 ? "#fff" : H.btn} strokeWidth={2.3} strokeLinecap="round" /></svg>
      </div>
    </div>
  );
};

const SCENES: GreenScene[] = [{ start: 0, end: A.grossen + 0.05, El: Feed }];

/** Punchline in full frame: two iOS notifications in the style of Henri's screenshot (dark glass pill, app icon,
 *  bold title, time top right). App icon: the real Hinge icon cropped from Henri's notification screenshot (Henri 2026-10-20). */
const Banner: React.FC<{ p: number; title: string; text: string; time: string; top: number }> = ({ p, title, text, time, top }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top, opacity: p, transform: `translateY(${(1 - p) * -50}px) scale(${0.96 + 0.04 * p})`, background: "rgba(41,32,27,0.93)", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 42, padding: "34px 34px 34px 32px", display: "flex", gap: 28, alignItems: "center", boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
    <Img src={staticFile("gpts-hinge-jobtitel/img/hinge-icon.png")} style={{ width: 96, height: 96, borderRadius: 24, flexShrink: 0, display: "block" }} />
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 34, color: "#EAE9E7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
        <span style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 27, color: "#A8A19C", whiteSpace: "nowrap" }}>{time}</span>
      </div>
      <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 33, color: "#EAE9E7", marginTop: 4, lineHeight: 1.25 }}>{text}</div>
    </div>
  </div>
);
const Pointe: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.matches - 0.25) return null;
  return (
    <>
      <Banner p={ez(t, A.matches - 0.2, A.matches + 0.25, soft)} top={100} title="Neues Match mit Max" time="jetzt" text="Founder · Geschäftsführer · Creator" />
      {t > A.bauspar2 - 0.3 ? <Banner p={ez(t, A.bauspar2 - 0.25, A.bauspar2 + 0.2, soft)} top={300} title="Thomas hat geantwortet" time="jetzt" text="Save the Date: Hochzeit am Samstag. Bausparvertrag inklusive." /> : null}
    </>
  );
};

const captionY = (_t: number, k: number, panelH: number) => (k > 0 ? Math.max(panelH, HH * 0.3) : 1600);

export const GptHingeReal: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} captionY={captionY} />;
