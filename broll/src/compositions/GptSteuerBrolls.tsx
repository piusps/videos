import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Logo, MascotVariant, P, PanelSplit, PdfBadge, Slam, Stamp, Walker, WalkKey, popAt, ramp, useSec } from "../components/PanelKit";

// @florentgpt · "Steuer 2022 freiwillig nachholen" (runs/gpt-steuer-2022, 2026-10-08). Same panel style as
// GptGehaltBrolls / GptHandyBrolls: green bubble buddy, light ChatGPT rebuild, no Superkind. All euro amounts
// and answers are labelled examples; 2022 rules: 0,30/0,38 € per km, 5 €/day homeoffice (max 600 €).

export type StProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;
const GPT = { line: "#E5E5E5", text: "#0D0D0D", dim: "#8F8F8F", bubble: "#F4F4F4" };
const GREEN = "#10A37F";
// Pius 2026-10-07: "mehr Dopamin" - the buddy never stands still (hops between every key),
// and every panel has drifting, spinning emojis in the background.
const busy = (keys: WalkKey[], end = 12): WalkKey[] => {
  const out: WalkKey[] = [];
  const all = [...keys, { ...keys[keys.length - 1], t: end }];
  for (let i = 0; i < all.length - 1; i++) {
    const a = all[i], b = all[i + 1];
    if (i < keys.length) out.push(a);
    let s = a.t + 0.45, k = 0;
    if (b.x === a.x && b.y === a.y) while (s < b.t - 0.3) { out.push({ t: s, x: a.x + (k % 2 ? 0 : (k % 4 === 0 ? 34 : -34)), y: a.y, hop: 46 + (k % 3) * 14 }); s += 0.45; k++; }
  }
  return out;
};
const W: React.FC<React.ComponentProps<typeof Walker>> = (p) => <Walker {...p} keys={busy(p.keys)} />;

const Floaters: React.FC<{ items: string[]; top?: number; h?: number }> = ({ items, top = 0, h = 680 }) => {
  const t = useSec();
  return (
    <>
      {items.map((e, i) => {
        const sp = 0.35 + (i % 3) * 0.12, ph = i * 2.1;
        const x = ((i * 237 + t * 90 * sp * (i % 2 ? 1 : -1)) % 1180 + 1180) % 1180 - 50;
        const y = top + 40 + ((i * 131) % (h - 120)) + Math.sin(t * 2.4 * sp + ph) * 28;
        return <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 46 + (i % 3) * 14, opacity: 0.55 * ramp(t, 0.1 * i, 0.1 * i + 0.3), transform: `rotate(${Math.sin(t * 3 + ph) * 25}deg) scale(${1 + 0.12 * Math.sin(t * 5 + ph)})` }}>{e}</div>;
      })}
    </>
  );
};
const MONEY = ["💶", "💸", "🧾", "✨", "💰", "📅"];

const CONF = ["#FF4D6D", "#FFD23F", "#2EAD5B", "#3A86FF", "#B15EFF", "#FF8C42"];
// Confetti burst from (x,y) at second `at`.
const Burst: React.FC<{ at: number; x: number; y: number; n?: number }> = ({ at, x, y, n = 26 }) => {
  const t = useSec();
  const d = t - at;
  if (d < 0 || d > 1.4) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + i * 0.37, sp = 520 + (i % 5) * 140;
        const px = x + Math.cos(ang) * sp * d, py = y + Math.sin(ang) * sp * d + 900 * d * d;
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: 14 + (i % 3) * 6, height: 8 + (i % 2) * 8, background: CONF[i % CONF.length], borderRadius: i % 4 === 0 ? 10 : 2, opacity: 1 - d / 1.4, transform: `rotate(${d * 720 + i * 40}deg)` }} />;
      })}
    </>
  );
};
// Live-stream style reactions floating up on the right edge, all the time.
const Reactions: React.FC<{ bottom?: number }> = ({ bottom = 660 }) => {
  const t = useSec();
  const E = ["🔥", "💯", "😱", "🤑", "❤️", "👀", "🚀"];
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => {
        const per = 2.2, st = i * 0.42, d = ((t - st) % per + per) % per;
        if (t < st) return null;
        return <div key={i} style={{ position: "absolute", left: 960 + Math.sin(d * 4 + i) * 30, top: bottom - d * 280, fontSize: 52, opacity: Math.min(1, d * 4) * (1 - d / per), transform: `scale(${0.6 + Math.min(0.5, d)})` }}>{E[i % E.length]}</div>;
      })}
    </>
  );
};
const Wrap: React.FC<{ avatar: AvatarSrc; full?: boolean; bursts?: number[]; children: React.ReactNode }> = ({ avatar, full, bursts = [], children }) => {
  const t = useSec();
  const sh = bursts.some((b) => t > b && t < b + 0.18) ? Math.sin(t * 90) * 9 : 0;
  const glow = 0.35 + 0.25 * Math.sin(t * 4);
  return (
    <MascotVariant.Provider value="bubble">
      <PanelSplit avatar={avatar} full={full} brand={false}>
        <div style={{ position: "absolute", left: 140, top: full ? -200 : 40, width: 800, height: 600, borderRadius: 400, background: `radial-gradient(circle, rgba(46,173,91,${glow * 0.35}) 0%, rgba(58,134,255,${glow * 0.18}) 45%, transparent 70%)`, filter: "blur(30px)" }} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${sh}px, ${sh * 0.6}px)` }}>{children}</div>
        <Reactions bottom={full ? 1500 : 660} />
        {bursts.map((b, i) => <Burst key={i} at={b} x={i % 2 ? 760 : 320} y={full ? 300 : 260} />)}
      </PanelSplit>
    </MascotVariant.Provider>
  );
};

const RedBox: React.FC<{ x: number; y: number; w: number; h: number; on: boolean }> = ({ x, y, w, h, on }) => (on ? <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "6px solid #E53935", borderRadius: 18, boxShadow: "0 0 0 8px rgba(229,57,53,0.15)" }} /> : null);

const GptInput: React.FC<{ y: number; text?: React.ReactNode; caret?: boolean; t: number; web?: boolean }> = ({ y, text, caret, t, web }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: y, background: "#fff", border: `2px solid ${GPT.line}`, borderRadius: 40, padding: "20px 26px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
    <div style={{ fontFamily: fonts.regular, fontSize: 36, color: text ? GPT.text : "#9B9B9B", minHeight: 50, lineHeight: 1.3 }}>{text || "Frag irgendwas"}{caret ? <span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span> : null}</div>
    <div style={{ display: "flex", alignItems: "center", marginTop: 12, gap: 14 }}>
      <div style={{ width: 62, height: 62, borderRadius: 31, border: `2px solid ${GPT.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: GPT.text }}>+</div>
      {web ? <div style={{ height: 52, borderRadius: 26, background: "#E8F1FF", color: "#2F6FE4", padding: "0 22px", display: "flex", alignItems: "center", fontFamily: fonts.semibold, fontSize: 28 }}>🌐 Websuche</div> : null}
      <div style={{ flex: 1 }} />
      <div style={{ width: 62, height: 62, borderRadius: 31, background: text ? GPT.text : "#D7D7D7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34 }}>↑</div>
    </div>
  </div>
);


const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#fff", borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);
const StepBadge: React.FC<{ n: number; label: string; t: number; at?: number; y?: number }> = ({ n, label, t, at = 0, y = 40 }) => (
  <div style={{ position: "absolute", left: 60, top: y, display: "flex", alignItems: "center", gap: 18, transform: `scale(${popAt(t, at)})`, transformOrigin: "0 50%" }}>
    <div style={{ width: 84, height: 84, borderRadius: 42, background: GREEN, color: "#fff", fontFamily: fonts.bold, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(16,163,127,0.45)" }}>{n}</div>
    <span style={{ fontFamily: fonts.bold, fontSize: 54, color: P.text }}>{label}</span>
  </div>
);

/** 0 · Hook 0-5.25: Steuergeld von 2022 zurück. Beats Steuergeld 1.0, 2022 1.93, zurück 2.79, nie 3.81, Erklärung 4.2. */
export const StHook: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  const back = ramp(t, 2.6, 3.3);
  return (
    <Wrap avatar={avatar} bursts={[2.85]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, textAlign: "center", fontFamily: fonts.bold, fontSize: 76, letterSpacing: -2, color: P.text, lineHeight: 1.05 }}>
        <span style={{ color: P.red }}>2022</span> verfällt<br />an Silvester
      </div>
      <Card style={{ position: "absolute", left: 70, top: 260, width: 300, height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${popAt(t, 0.9)}) rotate(-3deg)` }}>
        <div style={{ fontSize: 80 }}>🏛️</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text }}>Finanzamt</div>
      </Card>
      {[0, 1, 2, 3].map((i) => {
        const k = Math.max(0, Math.min(1, back * 1.4 - i * 0.12));
        if (k <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: 300 + k * 420, top: 330 - Math.sin(k * Math.PI) * 120 + i * 18, fontSize: 64 }}>💶</div>;
      })}
      <div style={{ position: "absolute", right: 50, top: 270, transform: `scale(${popAt(t, 1.9)}) rotate(3deg)`, background: "#fff", border: `4px solid ${P.green}`, borderRadius: 26, padding: "16px 28px", textAlign: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim }}>Zurück für 2022</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 68, color: P.green, letterSpacing: -2, whiteSpace: "nowrap" }}>+ <Count from={0} to={480} t={t} a={2.8} b={3.6} suffix=" €" /></div>
        <div style={{ fontFamily: fonts.medium, fontSize: 22, color: P.dim }}>Beispiel</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", transform: `scale(${popAt(t, 3.8)})` }}>
        <div style={{ background: P.text, color: "#fff", borderRadius: 18, padding: "12px 26px", fontFamily: fonts.semibold, fontSize: 32 }}>Auch ohne Pflicht zur Erklärung ✅</div>
      </div>
      <W t={t} size={100} keys={[{ t: 0, x: 1150, y: G - 10 }, { t: 0.7, x: 900, y: G - 10 }, { t: 2.8, x: 900, y: G - 10 }, { t: 3.0, x: 900, y: G - 10, hop: 90 }]} />
    </Wrap>
  );
};

/** 1 · 5.25-9.0 freiwillig, vier Jahre rückwirkend. Beats freiwillig 1.66, vier 2.77, rückwirkend 3.09 (relative). */
export const StFreiwillig: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  const years = [2022, 2023, 2024, 2025];
  return (
    <Wrap avatar={avatar} bursts={[1.66, 2.8]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 60, top: 46, fontFamily: fonts.bold, fontSize: 56, color: P.text, opacity: ramp(t, 0, 0.2) }}>Keine Pflicht? Darfst trotzdem.</div>
      <Stamp text="FREIWILLIG" t={t} at={1.66} x={90} y={170} color={P.green} size={46} rot={-6} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 320, display: "flex", justifyContent: "space-between" }}>
        {years.map((y, i) => (
          <div key={y} style={{ width: 210, height: 180, borderRadius: 22, background: "#fff", border: `3px solid ${i === 0 ? P.red : P.line}`, overflow: "hidden", transform: `scale(${popAt(t, 2.5 + i * 0.14)})`, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ height: 44, background: i === 0 ? P.red : GREEN }} />
            <div style={{ fontFamily: fonts.bold, fontSize: 60, color: P.text, textAlign: "center", marginTop: 24 }}>{y}</div>
          </div>
        ))}
      </div>
      <Slam text="4 JAHRE ZURÜCK" t={t} at={3.0} y={540} size={80} color={GREEN} />
      <W t={t} size={96} keys={[{ t: 0, x: 980, y: 200 }, { t: 1.6, x: 980, y: 200 }, { t: 1.8, x: 980, y: 200, hop: 70 }]} />
    </Wrap>
  );
};

/** 2 · 9.0-12.25 bis Silvester, danach weg. Beats Silvester 1.77, weg 3.06 (relative). */
export const StSilvester: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  const gone = ramp(t, 2.9, 3.25);
  return (
    <Wrap avatar={avatar} bursts={[1.8]}>
      <Floaters items={["🎆", "🎇", "✨", "🥂", "📅", "⏰"]} />
      <Card style={{ position: "absolute", left: 80, top: 60, width: 380, height: 420, overflow: "hidden", transform: `scale(${popAt(t, 0.1)}) rotate(-3deg)` }}>
        <div style={{ height: 96, background: P.red, color: "#fff", fontFamily: fonts.bold, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>DEZEMBER 2026</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 210, color: P.text, textAlign: "center", lineHeight: 1.3 }}>31</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: P.dim, textAlign: "center" }}>Silvester 🎆</div>
      </Card>
      <div style={{ position: "absolute", left: 540, top: 90, fontFamily: fonts.semibold, fontSize: 34, color: P.dim, opacity: ramp(t, 0.4, 0.6) }}>Frist für 2022</div>
      <div style={{ position: "absolute", left: 540, top: 140, fontFamily: fonts.bold, fontSize: 82, color: P.red, letterSpacing: -2, opacity: ramp(t, 0.5, 0.7) }}>31.12.2026</div>
      <div style={{ position: "absolute", left: 540, top: 270, opacity: 1 - gone, transform: `translateY(${-gone * 300}px) rotate(${gone * 40}deg)` }}>
        <div style={{ background: "#fff", border: `4px solid ${P.green}`, borderRadius: 22, padding: "14px 26px", fontFamily: fonts.bold, fontSize: 60, color: P.green }}>💶 Dein Geld</div>
      </div>
      <Stamp text="DANACH WEG" t={t} at={3.0} x={560} y={420} color={P.red} size={48} rot={-8} />
      <W t={t} size={96} mood={t > 3 ? "shock" : "happy"} keys={[{ t: 0, x: 980, y: G - 20 }, { t: 2.9, x: 980, y: G - 20 }, { t: 3.1, x: 980, y: G - 20, hop: 80 }]} />
    </Wrap>
  );
};

const P1 = "Ich hab 2022 gearbeitet und keine Steuererklärung gemacht. Frag mich, was ich absetzen kann.";
/** 3 · Full panel 12.25-19.2: Erstens, ChatGPT öffnen, schreiben. Beats Erstens 0.67, ChatGPT 1.53, schreib 2.1, kann 6.7 (relative). */
export const StPrompt: React.FC<StProps> = ({ avatar, seconds = 7 }) => {
  const t = useSec();
  const n = Math.floor(P1.length * ramp(t, 2.3, 6.4));
  const sent = t > 6.55;
  return (
    <Wrap avatar={avatar} full bursts={[0.7, 6.6]}>
      <Floaters items={MONEY} top={-300} h={1500} />
      <StepBadge n={1} label="ChatGPT öffnen" t={t} at={0.6} y={-300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: -150, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 1.5)})` }}>
        <Logo name="openai" size={100} />
        <span style={{ fontFamily: fonts.bold, fontSize: 60, color: GPT.text }}>ChatGPT</span>
      </div>
      {!sent ? <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: fonts.semibold, fontSize: 56, color: GPT.text, opacity: ramp(t, 1.6, 1.9) }}>Womit kann ich helfen?</div> : null}
      {sent ? (
        <div style={{ position: "absolute", right: 50, top: -10, maxWidth: 820, background: GPT.bubble, borderRadius: 34, padding: "22px 30px", fontFamily: fonts.regular, fontSize: 36, color: GPT.text, lineHeight: 1.35, transform: `scale(${popAt(t, 6.55)})`, transformOrigin: "100% 0" }}>{P1}</div>
      ) : null}
      {sent ? <div style={{ position: "absolute", left: 50, top: 300, fontFamily: fonts.regular, fontSize: 36, color: GPT.text, opacity: ramp(t, 6.75, 6.95) }}>Gern! Erste Frage: In welchen Monaten hast du 2022 gearbeitet?</div> : null}
      <GptInput y={760} t={t} caret={!sent} text={sent ? undefined : P1.slice(0, n)} />
      <RedBox x={918} y={830} w={100} h={100} on={t > 6.1 && t < 6.7} />
      <W t={t} size={100} keys={[{ t: 0, x: -80, y: 1150 }, { t: 1.0, x: 300, y: 1150 }, { t: 6.3, x: 800, y: 1150 }, { t: 6.55, x: 800, y: 1150, hop: 80 }]} />
    </Wrap>
  );
};

/** 4 · 19.2-24.05 Zweitens, Fragen: Weg, Homeoffice, Laptop. Beats Fragen 1.25, Weg 2.24, Homeoffice 3.23, Laptop 4.27 (relative). */
export const StFragen: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  const Q: [string, string, string, number][] = [["🚗", "Wie weit war dein Weg zur Arbeit?", "25 km", 1.66], ["🏠", "Wie oft warst du im Homeoffice?", "80 Tage", 2.9], ["💻", "Hast du einen Laptop gekauft?", "Ja, 900 €", 3.9]];
  return (
    <Wrap avatar={avatar} bursts={[2.2, 3.2, 4.3]}>
      <Floaters items={["🚗", "🏠", "💻", "❓", "✨", "🧾"]} />
      <StepBadge n={2} label="Fragen beantworten" t={t} at={0.05} y={24} />
      {Q.map(([e, q, a, at], i) => (
        <div key={i} style={{ position: "absolute", left: 60, top: 150 + i * 160, display: "flex", alignItems: "center", gap: 16, transform: `scale(${popAt(t, at)})`, transformOrigin: "0 50%" }}>
          <div style={{ fontSize: 64 }}>{e}</div>
          <div style={{ background: GPT.bubble, borderRadius: 26, padding: "16px 24px", fontFamily: fonts.semibold, fontSize: 32, color: GPT.text }}>{q}</div>
          <div style={{ background: GREEN, color: "#fff", borderRadius: 26, padding: "16px 22px", fontFamily: fonts.bold, fontSize: 32, transform: `scale(${popAt(t, at + 0.45)})` }}>{a}</div>
        </div>
      ))}
      <div style={{ position: "absolute", right: 60, top: 640, fontFamily: fonts.medium, fontSize: 22, color: P.dim, opacity: ramp(t, 2, 2.2) }}>Beispiel-Antworten</div>
      <W t={t} size={90} keys={[{ t: 0, x: 990, y: 60 }, { t: 4.4, x: 990, y: 60 }]} />
    </Wrap>
  );
};

const ROWS: [string, string, string][] = [["Anlage N", "Wege zur Arbeit", "25 km · 140 Tage"], ["Anlage N", "Arbeitsmittel", "Laptop 900 €"], ["Anlage N", "Homeoffice-Pauschale", "80 Tage × 5 €"]];
/** 5 · Full panel 24.05-28.4 Drittens, Elster, welches Feld. Beats Drittens 0.05, ChatGPT 0.66, Elster 2.18, Feld 3.2 (relative). */
export const StElster: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <Wrap avatar={avatar} full bursts={[0.1, 3.25]}>
      <Floaters items={MONEY} top={-300} h={1500} />
      <StepBadge n={3} label="Was kommt wohin?" t={t} at={0.05} y={-300} />
      <div style={{ position: "absolute", left: 50, top: -150, display: "flex", alignItems: "center", gap: 14, opacity: ramp(t, 0.6, 0.8) }}>
        <Logo name="openai" size={56} tile={false} />
        <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: GPT.dim }}>ChatGPT sagt dir:</span>
      </div>
      <Card style={{ position: "absolute", left: 50, top: -60, width: 980, padding: "16px 30px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 36, color: P.text, padding: "10px 0" }}>Elster · Steuerjahr 2022</div>
        {ROWS.map(([a, f, v], i) => {
          const at = 0.9 + i * 0.55;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 0", borderTop: `2px solid ${P.line}`, opacity: ramp(t, at, at + 0.2), transform: `translateX(${(1 - ramp(t, at, at + 0.25)) * 80}px)` }}>
              <span style={{ background: "#E8F6F1", color: GREEN, borderRadius: 12, padding: "8px 14px", fontFamily: fonts.bold, fontSize: 28 }}>{a}</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 36, color: P.text, flex: 1 }}>{f}</span>
              <span style={{ fontFamily: fonts.bold, fontSize: 32, color: P.text }}>{v}</span>
            </div>
          );
        })}
      </Card>
      <div style={{ position: "absolute", left: 50, top: 560, width: 980, transform: `scale(${popAt(t, 2.9)})` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim, marginBottom: 10 }}>Feld in Elster</div>
        <div style={{ height: 100, borderRadius: 16, border: `3px solid ${P.line}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 28px", fontFamily: fonts.bold, fontSize: 40, color: P.text }}>
          Homeoffice-Tage: <Count from={0} to={80} t={t} a={3.2} b={3.8} style={{ marginLeft: 16, color: GREEN }} />
        </div>
      </div>
      <RedBox x={40} y={610} w={1000} h={130} on={t > 3.2} />
      <div style={{ position: "absolute", left: 50, top: 780, fontFamily: fonts.medium, fontSize: 24, color: P.dim }}>Beispielwerte</div>
      <W t={t} size={100} arms="point" keys={[{ t: 0, x: 900, y: 1000 }, { t: 3.1, x: 600, y: 1000 }, { t: 3.3, x: 600, y: 1000, hop: 80 }]} />
    </Wrap>
  );
};

/** 6 · 28.4-30.85 Abschicken tust du selbst, Finanzamt rechnet nach. Beats Abschicken 0.08, selbst 0.76, Finanzamt 1.33 (relative). */
export const StSelbst: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  const clicked = t > 0.85;
  return (
    <Wrap avatar={avatar} bursts={[0.85, 1.9]}>
      <Floaters items={["✅", "🧮", "🏛️", "✨", "📨", "🧾"]} />
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 56, color: P.text }}>Abschicken: du selbst</div>
      <div style={{ position: "absolute", left: 80, top: 220, transform: `scale(${clicked ? 0.94 + 0.06 * ramp(t, 0.85, 1.0) : popAt(t, 0.1)})` }}>
        <div style={{ background: clicked ? P.green : GPT.text, color: "#fff", borderRadius: 24, padding: "28px 56px", fontFamily: fonts.bold, fontSize: 52 }}>{clicked ? "Gesendet ✓" : "Versenden"}</div>
      </div>
      <RedBox x={66} y={206} w={clicked ? 420 : 370} h={146} on={t > 0.4 && t < 0.95} />
      <Card style={{ position: "absolute", left: 560, top: 190, width: 440, padding: "24px 28px", boxSizing: "border-box", transform: `scale(${popAt(t, 1.3)})` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim }}>🏛️ Finanzamt prüft</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 64, color: P.text, marginTop: 6, whiteSpace: "nowrap" }}>🧮 <Count from={0} to={100} t={t} a={1.4} b={2.2} suffix=" %" /></div>
      </Card>
      <Stamp text="GEPRÜFT" t={t} at={2.0} x={640} y={470} color={P.green} size={40} rot={-6} />
      <W t={t} size={96} arms="point" keys={[{ t: 0, x: 980, y: G - 20 }, { t: 0.6, x: 330, y: G - 40 }, { t: 0.85, x: 330, y: G - 40, hop: 60 }]} />
    </Wrap>
  );
};

/** 7 · CTA 30.85-end: komplette Anleitung, folg mir, STEUER. Beats Anleitung 0.88, folg 3.61, Steuer 4.26 (relative). */
export const StCta: React.FC<StProps> = ({ avatar }) => {
  const t = useSec();
  const folg = 3.61, word = 4.26;
  const w = "STEUER";
  const n = Math.max(0, Math.min(w.length, Math.floor((t - word) / 0.08)));
  const followed = t > folg + 0.1;
  return (
    <Wrap avatar={avatar} bursts={[0.9, folg + 0.1, word + 0.4]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 60, top: 30, display: "flex", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 0.8)})`, transformOrigin: "0 50%" }}>
        <PdfBadge size={80} />
        <span style={{ fontFamily: fonts.bold, fontSize: 44, color: P.text }}>Komplette Anleitung: alle Fragen + Felder</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: 160, width: 960, height: 380, padding: 36, boxSizing: "border-box", opacity: ramp(t, 2.6, 2.9) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florentgpt</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#fff", background: followed ? "#BDBDBD" : "#0095F6", borderRadius: 16, padding: "12px 30px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 40 }}>Kommentare</div>
        <div style={{ marginTop: 16, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>{w.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2, color: GREEN }}>|</span></div>
      </Card>
      <W t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1, x: 900, y: G - 20 }, { t: folg - 0.1, x: 900, y: G - 20 }, { t: folg + 0.1, x: 900, y: 130, hop: 80 }, { t: folg + 0.4, x: 900, y: 160 }, { t: folg + 0.7, x: 960, y: G - 20, hop: 40 }]} />
    </Wrap>
  );
};
