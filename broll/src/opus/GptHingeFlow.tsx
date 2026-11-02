import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { bump, count, ez, G, GF, GreenReel, GreenScene, HH, Odometer, Word } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpts-hinge-jobtitel/captions.json";

// GPT-S "Hinge-Jobtitel" v4 (Henri 2026-10-20: "zu blockig, immer nur Teile reingespuckt, Pointe geht verloren,
// smoothere Übergänge, roter Faden"). ONE continuous Hinge screen from frame 0 until the punchline:
//   Max collects every big title as a chip, the truth drops into his prompt, likes climb
//   -> Max gets liked, his card pushes out while Thomas (Sachbearbeiter) pushes in
//   -> Thomas: green flags, 0 likes -> skipped -> "Ich finde ..." brings him back (Rückgängig), his truth lights up
//   -> "Hinge prüft ... mit KI": a scan runs over HIS profile, three prompt-feedback notes attach to his cards
//   -> panel leaves, punchline in full frame with two phone notifications.
// Everything eases in (fade + small drift + soft highlight), the profile scrolls continuously. No Hinge logo.

const { fontFamily: serif } = loadSerif("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] });

const WORDS = captionsJson as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WORDS) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const END = WORDS[WORDS.length - 1].endMs / 1000;
export const HINGE4_FRAMES = Math.round((END + 0.9) * 25);
const AVATAR = { src: "gpts-hinge-jobtitel/avatar.mp4", focus: { x: 0.507, y: 0.596 }, scale: 1.0, faceAt: 0.5 };

const A = {
  jobtitel: at("jobtitel"), wenigsten: at("wenigsten"), founder: at("founder"), idee: at("idee"), domain: at("domain"),
  naechstes: at("nächstes"), selbst: at("selbstständig"), maerz: at("märz"), gf: at("geschäftsführer"), firma: at("firma"), creator: at("creator"),
  elf: at("elf"), mutter: at("mutter"), sach1: at("sachbearbeiter", 1), stadt: at("stadt"), unbefristet: at("unbefristet"),
  weihnacht: at("weihnachtsgeld"), bauspar1: at("bausparvertrag", 1), ueberspringt: at("überspringt"), ich: at("ich"), wahrheit: at("wahrheit"),
  hinge2: at("hinge", 2), prueft: at("prüft"), langweilig: at("langweilig"), sach2: at("sachbearbeiter", 2), dreimal: at("dreimal"),
  grossen: at("großen"), matches: at("matches"), bauspar2: at("bausparvertrag", 2),
};

const H = { bg: "#F4F3F1", card: "#FFFFFF", ink: "#141414", sub: "#707070", line: "#E7E5E1" };
const HEADER = 118;
const io = Easing.inOut(Easing.cubic);
const soft = Easing.out(Easing.cubic);

// ---------- small UI pieces ----------
const HEART = "M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z";
const Heart: React.FC<{ size?: number; fill?: string; stroke?: string }> = ({ size = 34, fill = "none", stroke = H.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={HEART} fill={fill} stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" /></svg>
);
const Spark: React.FC<{ color?: string; size?: number }> = ({ color = G.green, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z" fill={color} /></svg>
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
/** soft entrance: fade + small drift + blur, then a mint highlight that fades out slowly */
const Soft: React.FC<{ t: number; at: number; children: React.ReactNode; hl?: boolean; style?: React.CSSProperties }> = ({ t, at: a, children, hl = true, style }) => {
  const p = ez(t, a - 0.18, a + 0.22, soft);
  if (p <= 0) return <span style={{ visibility: "hidden", ...style }}>{children}</span>;
  const h = hl ? 1 - ez(t, a + 0.3, a + 1.4) : 0;
  return (
    <span style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 22}px)`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined, background: `rgba(191,227,210,${0.85 * h * p})`, borderRadius: 12, padding: "0 10px", margin: "0 -10px", ...style }}>{children}</span>
  );
};
/** chip that grows in place, pushing the following chips smoothly */
const Chip: React.FC<{ t: number; at: number; text: string }> = ({ t, at: a, text }) => {
  const p = ez(t, a - 0.12, a + 0.3, soft);
  if (p <= 0) return null;
  return (
    <span style={{ display: "inline-block", maxWidth: 30 + 420 * p, overflow: "hidden", whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5), fontFamily: GF.inter, fontWeight: 700, fontSize: 32, color: "#fff", background: H.ink, borderRadius: 999, padding: "10px 22px", marginRight: 10, marginBottom: 10, boxShadow: `0 0 0 ${8 * bump(t, a + 0.1, 0.5)}px rgba(191,227,210,0.9)` }}>{text}</span>
  );
};
/** collapsible row (feedback notes, toasts) that opens smoothly so the card grows instead of jumping */
const Grow: React.FC<{ p: number; h: number; children: React.ReactNode }> = ({ p, h, children }) => (
  <div style={{ maxHeight: h * p, overflow: "hidden", opacity: Math.min(1, p * 1.4) }}>{children}</div>
);
const Burst: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at: a, x, y }) => {
  const d = t - a;
  if (d < 0 || d > 1.1) return null;
  const k = d / 1.1;
  return <>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: x + (i - 1) * 30 + Math.sin(i * 2 + d * 6) * 8, top: y - k * (110 + i * 26), opacity: (1 - k) * 0.9 }}><Heart size={26} fill={G.green} stroke={G.green} /></div>)}</>;
};
const Header: React.FC<{ name: string; likes: number; honest?: boolean; t: number; pulseAts: number[]; fb?: number; fbAt?: number }> = ({ name, likes, honest, t, pulseAts, fb = 0, fbAt = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEADER, background: H.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 36px 0 48px" }}>
    <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 64, color: H.ink, letterSpacing: -0.5 }}>{name}</div>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {fb > 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: G.green, borderRadius: 999, padding: "10px 18px", transform: `scale(${1 + 0.2 * bump(t, fbAt, 0.4)})` }}>
          <Spark color={G.mint} size={24} /><span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 32, color: "#fff" }}>×{fb}</span>
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: honest ? H.card : H.ink, borderRadius: 999, padding: "10px 20px", transform: `scale(${1 + 0.1 * Math.max(0, ...pulseAts.map((a) => bump(t, a + 0.1, 0.45)))})` }}>
        <Heart size={28} fill={honest ? "none" : G.mint} stroke={honest ? H.ink : G.mint} />
        <Odometer value={Math.round(likes)} size={38} color={honest ? H.ink : "#fff"} />
        <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 23, color: honest ? H.sub : "rgba(255,255,255,0.75)" }}>Likes</span>
      </div>
    </div>
  </div>
);
const Vitals: React.FC<{ age: number; height: string; city: string; children: React.ReactNode }> = ({ age, height, city, children }) => (
  <Card style={{ padding: "0 34px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, height: 96, fontFamily: GF.inter, fontWeight: 600, fontSize: 31, color: H.ink }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon kind="cake" />{age}</span>
      <span style={{ width: 1.5, height: 40, background: H.line }} />
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon kind="ruler" />{height}</span>
      <span style={{ width: 1.5, height: 40, background: H.line }} />
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon kind="pin" />{city}</span>
    </div>
    {children}
  </Card>
);
const scrollTo = (t: number, keys: [number, number, number?][]) => {
  let y = keys[0][1];
  for (let i = 1; i < keys.length; i++) y += (keys[i][1] - keys[i - 1][1]) * ez(t, keys[i][0], keys[i][0] + (keys[i][2] ?? 0.6), io);
  return y;
};

// ---------- Max: every big title in one profile ----------
const LIKES: [number, number][] = [[A.founder, 14], [A.selbst, 11], [A.gf, 17], [A.creator, 9]];
const TRUTH: { at: number; tag: string; text: string }[] = [
  { at: A.idee, tag: "Founder", text: "1 Idee + 1 Domain" },
  { at: A.naechstes, tag: "Founder", text: "Kunden: nächstes Jahr" },
  { at: A.maerz, tag: "Selbstständig", text: "bis März angestellt" },
  { at: A.firma + 0.3, tag: "Geschäftsführer", text: "Mitarbeiter: 1. Er." },
  { at: A.elf, tag: "Creator", text: "FOLLOWERS" },
];
const MaxView: React.FC<{ t: number }> = ({ t }) => {
  const likes = LIKES.reduce((s, [a, n]) => s + count(t, a, a + 0.8, n, 0).v, 0);
  const scroll = scrollTo(t, [[0, 0], [A.jobtitel - 0.4, 400, 0.7], [A.firma - 0.1, 520], [A.elf - 0.45, 680]]);
  const fol = count(t, A.elf - 0.1, A.elf + 0.6, 11, 0);
  const hookOut = ez(t, A.jobtitel - 0.4, A.jobtitel + 0.3);
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 32, right: 32, top: HEADER, transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 18 }}>
        <Card style={{ height: 520, overflow: "hidden" }}>
          <Img src={staticFile("gpts-hinge-jobtitel/img/max.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 - 0.06 * ez(t, 0, 3.2, io)})` }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 330, background: "linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0))", opacity: 1 - 0.6 * hookOut }}>
            <div style={{ position: "absolute", left: 40, right: 120, bottom: 40, fontFamily: GF.tight, fontWeight: 900, fontSize: 84, lineHeight: 1.0, letterSpacing: -3, color: "#fff" }}>
              Größter Titel.<br /><span style={{ background: G.green, borderRadius: 12, padding: "0 12px", marginLeft: -12 }}>Kleinstes</span> Gehalt.
            </div>
          </div>
          <Round size={78} style={{ right: 24, bottom: 24 }}><Heart size={34} /></Round>
        </Card>
        <Vitals age={31} height="1,86 m" city="Berlin">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, borderTop: `1.5px solid ${H.line}`, padding: "20px 0 12px", minHeight: 96 }}>
            <div style={{ paddingTop: 10 }}><Icon kind="bag" /></div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", flex: 1 }}>
              {t < A.founder - 0.1 ? <span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: H.ink, paddingTop: 6, marginBottom: 10, opacity: 1 - ez(t, A.founder - 0.35, A.founder - 0.1) }}><Soft t={t} at={A.jobtitel}>Founder & CEO</Soft></span> : null}
              <Chip t={t} at={A.founder} text="Founder" />
              <Chip t={t} at={A.selbst} text="Selbstständig" />
              <Chip t={t} at={A.gf} text="Geschäftsführer" />
              <Chip t={t} at={A.creator} text="Creator" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, borderTop: `1.5px solid ${H.line}`, height: 92, fontFamily: GF.inter, fontWeight: 600, fontSize: 32, color: H.ink }}>
            <Icon kind="house" /><Soft t={t} at={A.gf + 0.35}>Max Ventures GmbH</Soft>
          </div>
        </Vitals>
        <Card style={{ padding: "34px 40px 40px", opacity: ez(t, A.founder + 0.1, A.idee - 0.1, soft) }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>Was nicht im Profil steht</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10, paddingRight: 80 }}>
            {TRUTH.map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16, minHeight: 54 }}>
                <span style={{ fontFamily: GF.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.08em", color: H.sub, width: 196, flexShrink: 0, textTransform: "uppercase", opacity: ez(t, x.at - 0.3, x.at) }}>{x.tag}</span>
                <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 44, color: H.ink, lineHeight: 1.15 }}>
                  <Soft t={t} at={x.at}>
                    {x.text === "FOLLOWERS" ? (
                      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 12 }}><Odometer value={Math.round(fol.v)} speed={fol.speed} size={44} color={H.ink} /> Follower</span>
                    ) : x.text}
                  </Soft>
                  {x.text === "FOLLOWERS" ? <Soft t={t} at={A.mutter}><span style={{ color: G.green }}> · 1 davon: Mama</span></Soft> : null}
                </span>
              </div>
            ))}
          </div>
          <Round size={70} style={{ right: 26, bottom: 26 }}><Heart size={30} /></Round>
        </Card>
      </div>
      <Header name="Max" likes={likes} t={t} pulseAts={LIKES.map(([a]) => a)} />
      {LIKES.map(([a], i) => <Burst key={i} t={t} at={a + 0.1} x={860} y={110} />)}
    </div>
  );
};

// ---------- Thomas: the honest profile, then the AI feedback on HIS cards ----------
const FB = [A.langweilig, A.sach2 + 0.1, A.dreimal - 0.05];
const Feedback: React.FC<{ t: number; at: number; dark?: boolean }> = ({ t, at: a, dark }) => (
  <Grow p={ez(t, a - 0.15, a + 0.35, soft)} h={110}>
    <div style={{ marginTop: 20, background: dark ? G.green : "#EAF2EE", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <Spark color={dark ? G.mint : G.green} />
      <div>
        <div style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", color: dark ? G.mint : G.green }}>PROMPT-FEEDBACK · KI</div>
        <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 29, color: dark ? "#fff" : H.ink }}>Diese Antwort ist etwas langweilig.</div>
      </div>
    </div>
  </Grow>
);
const ThomasView: React.FC<{ t: number }> = ({ t }) => {
  const scroll = scrollTo(t, [[0, 330], [A.unbefristet - 0.5, 560], [A.sach2 - 0.55, 900, 0.7], [A.dreimal - 0.55, 1180, 0.6]]);
  const glow = bump(t, A.wahrheit - 0.1, 1.3);
  const fbCount = FB.filter((a) => t > a - 0.05).length;
  const lastFb = FB[Math.max(0, fbCount - 1)];
  const typed = "Kontoauszüge sortieren.";
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 32, right: 32, top: HEADER, transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 18 }}>
        <Card style={{ height: 520, overflow: "hidden" }}>
          <Img src={staticFile("gpts-hinge-jobtitel/img/thomas.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Round size={78} style={{ right: 24, bottom: 24 }}><Heart size={34} /></Round>
        </Card>
        <Vitals age={38} height="1,82 m" city="Kassel">
          <div style={{ display: "flex", alignItems: "center", gap: 18, borderTop: `1.5px solid ${H.line}`, height: 96, fontFamily: GF.inter, fontWeight: 700, fontSize: 36, color: H.ink }}>
            <Icon kind="bag" /><Soft t={t} at={A.sach1}>Sachbearbeiter bei der Stadt</Soft>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, borderTop: `1.5px solid ${H.line}`, height: 92, fontFamily: GF.inter, fontWeight: 600, fontSize: 32, color: H.ink }}>
            <Icon kind="house" /><Soft t={t} at={A.stadt}>Stadtverwaltung Kassel</Soft>
          </div>
        </Vitals>
        <Card style={{ padding: "34px 40px 36px", boxShadow: `0 0 0 ${10 * glow}px rgba(191,227,210,0.95)` }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>Meine Green Flags</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, paddingRight: 80 }}>
            {([["Unbefristet", A.unbefristet], ["Weihnachtsgeld", A.weihnacht], ["Bausparvertrag", A.bauspar1]] as [string, number][]).map(([txt, a]) => (
              <div key={txt} style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: H.ink, minHeight: 58 }}>
                <Soft t={t} at={a}><span style={{ color: G.green, marginRight: 14 }}>✓</span>{txt}</Soft>
              </div>
            ))}
          </div>
          <Feedback t={t} at={FB[0]} />
          <Round size={70} style={{ right: 26, top: 26 }}><Heart size={30} /></Round>
        </Card>
        <Card style={{ padding: "34px 40px 36px" }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>Mein perfekter Sonntag</div>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: H.ink, marginTop: 12 }}>{typed}</div>
          <Feedback t={t} at={FB[1]} />
          <Round size={70} style={{ right: 26, top: 26 }}><Heart size={30} /></Round>
        </Card>
        <Card style={{ padding: "34px 40px 36px" }}>
          <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: H.ink }}>Ich bin Profi in</div>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: H.ink, marginTop: 12 }}>Fristen.</div>
          <Feedback t={t} at={FB[2]} dark />
          <Round size={70} style={{ right: 26, top: 26 }}><Heart size={30} /></Round>
        </Card>
      </div>
      <Header name="Thomas" likes={0} honest t={t} pulseAts={[]} fb={fbCount} fbAt={lastFb} />
    </div>
  );
};

/** KI scan beam sweeping over the visible profile while the AI "checks" it */
const Scan: React.FC<{ t: number }> = ({ t }) => {
  const a = A.prueft - 0.1, b = A.langweilig;
  if (t < a || t > b + 0.3) return null;
  const p = ez(t, a, b, Easing.inOut(Easing.sin));
  const o = ez(t, a, a + 0.25) * (1 - ez(t, b, b + 0.3));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: HEADER + p * 760, height: 160, marginTop: -80, background: "linear-gradient(to bottom, rgba(191,227,210,0), rgba(191,227,210,0.55), rgba(191,227,210,0))", opacity: o }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: HEADER + p * 760, height: 4, background: G.green, opacity: o, boxShadow: "0 0 24px rgba(11,61,44,0.5)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: HEADER + 14, display: "flex", justifyContent: "center", opacity: o }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: G.green, borderRadius: 999, padding: "10px 22px" }}><Spark color={G.mint} size={24} /><span style={{ fontFamily: GF.inter, fontWeight: 700, fontSize: 26, color: "#fff" }}>KI prüft Antworten …</span></div>
      </div>
    </>
  );
};

// ---------- the one continuous feed ----------
const L0 = A.sach1 - 0.55, L1 = A.sach1 + 0.05; // Max liked, Thomas pushes in
const S0 = A.ueberspringt - 0.05, S1 = A.ueberspringt + 0.5; // Thomas skipped
const R0 = A.ich - 0.2, R1 = A.ich + 0.45; // "Ich finde ..." -> undo
const Feed: React.FC<{ t: number }> = ({ t }) => {
  const push = ez(t, L0, L1, io);
  const skipped = ez(t, S0, S1, io) * (1 - ez(t, R0, R1, Easing.out(Easing.back(1.2))));
  const likePress = bump(t, L0 - 0.3, 0.4);
  const skipPress = bump(t, S0 - 0.3, 0.4);
  const tx = (x: number) => `translateX(${x * 1080}px)`;
  const toast = (a: number, b: number, text: string, dark?: boolean) => {
    const o = ez(t, a, a + 0.25) * (1 - ez(t, b, b + 0.3));
    if (o <= 0) return null;
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: HEADER + 20, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - o) * -20}px)` }}>
        <div style={{ background: dark ? H.ink : G.green, color: "#fff", borderRadius: 999, padding: "12px 26px", fontFamily: GF.inter, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", gap: 10 }}>{text}</div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: H.bg, overflow: "hidden" }}>
      {/* what is behind a skipped profile */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: H.sub, opacity: skipped }}>Keine weiteren Profile in deiner Nähe</div>
      {push < 1 ? <div style={{ position: "absolute", inset: 0, transform: `${tx(-push)} rotate(${-push * 3}deg)`, transformOrigin: "50% 100%" }}><MaxView t={t} /></div> : null}
      {push > 0 ? (
        <div style={{ position: "absolute", inset: 0, transform: `${tx(1 - push - skipped * 0.78)} rotate(${-skipped * 4}deg)`, transformOrigin: "50% 100%", opacity: 1 - 0.35 * skipped }}>
          <ThomasView t={t} />
        </div>
      ) : null}
      <Scan t={t} />
      {toast(L0 - 0.1, L1 + 0.5, "♥  Like an Max gesendet")}
      {toast(R0 + 0.05, A.wahrheit + 0.4, "↺  Rückgängig gemacht", true)}
      {/* bottom buttons stay put, like in the app */}
      <Round size={100} style={{ left: 40, bottom: 40, transform: `scale(${1 + 0.3 * skipPress})`, background: skipPress > 0.3 ? H.ink : H.card }}>
        <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke={skipPress > 0.3 ? "#fff" : H.ink} strokeWidth={2.4} strokeLinecap="round" /></svg>
      </Round>
      <Round size={100} style={{ right: 40, bottom: 40, transform: `scale(${1 + 0.3 * likePress})`, background: likePress > 0.3 ? H.ink : H.card }}>
        <Heart size={42} fill={likePress > 0.3 ? "#fff" : "none"} stroke={likePress > 0.3 ? "#fff" : H.ink} />
      </Round>
    </div>
  );
};

const SCENES: GreenScene[] = [{ start: 0, end: A.grossen + 0.05, El: Feed }];

/** Punchline in full frame: two phone notifications above the head. */
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
  if (t < A.matches - 0.25) return null;
  return (
    <>
      <Banner p={ez(t, A.matches - 0.2, A.matches + 0.25, soft)} top={110} title="Neues Match" text="Max · Founder, Geschäftsführer, Creator" />
      {t > A.bauspar2 - 0.3 ? <Banner p={ez(t, A.bauspar2 - 0.25, A.bauspar2 + 0.2, soft)} top={262} title="Save the Date" text="Thomas heiratet. Bausparvertrag inklusive." /> : null}
    </>
  );
};

const captionY = (_t: number, k: number, panelH: number) => (k > 0 ? Math.max(panelH, HH * 0.3) : 1600);

export const GptHingeFlow: React.FC = () => <GreenReel avatar={AVATAR} scenes={SCENES} words={WORDS} overlay={(t) => <Pointe t={t} />} captionY={captionY} />;
