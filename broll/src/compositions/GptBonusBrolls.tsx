import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Crowd, Fly, Logo, MascotVariant, P, PanelSplit, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// @florentgpt · "Krankenkasse Bonusprogramm" (runs/gpt-krankenkasse-bonus, 2026-10-08). Same panel style as
// GptHandyBrolls: no Superkind brand, green chat-bubble buddy, light ChatGPT UI, red click frames.
// Only sourced numbers on screen (TK 10 € pro Maßnahme, tk.de). Beat times come in via props `b` (seconds
// relative to the window start, from captions.json).

export type KbProps = { seconds?: number; avatar: AvatarSrc; b?: number[] };
const G = 690;
const GPT = { line: "#E5E5E5", text: "#0D0D0D", dim: "#8F8F8F", bubble: "#F4F4F4" };
const bt = (b: number[] | undefined, i: number, d: number) => (b && b[i] !== undefined ? b[i] : d);

const Wrap: React.FC<{ avatar: AvatarSrc; full?: boolean; children: React.ReactNode }> = ({ avatar, full, children }) => (
  <MascotVariant.Provider value="bubble">
    <PanelSplit avatar={avatar} full={full} brand={false}>{children}</PanelSplit>
  </MascotVariant.Provider>
);

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#fff", borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

const Coin: React.FC<{ size?: number; label?: string }> = ({ size = 70, label = "€" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(145deg,#F7D774,#E0A92E)", border: "4px solid #C98F1C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: size * 0.45, color: "#7A5300", boxShadow: "0 8px 18px rgba(0,0,0,0.15)" }}>{label}</div>
);

const Icon: React.FC<{ e: string; label: string; a: number; size?: number }> = ({ e, label, a, size = 120 }) => (
  <div style={{ transform: `scale(${a})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "#fff", border: `2px solid ${P.line}`, boxShadow: "0 12px 30px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.55 }}>{e}</div>
    <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.text }}>{label}</div>
  </div>
);

const RedBox: React.FC<{ x: number; y: number; w: number; h: number; on: boolean }> = ({ x, y, w, h, on }) => (on ? <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "6px solid #E53935", borderRadius: 18, boxShadow: "0 0 0 8px rgba(229,57,53,0.15)" }} /> : null);

/** 0 · Hook: Kasse zahlt dir Geld für den Zahnarzttermin. b = [Krankenkasse, Geld, Zahnarzttermin, eh hattest] */
export const KbHook: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [k, g, z, e] = [bt(b, 0, 0.2), bt(b, 1, 1.0), bt(b, 2, 1.6), bt(b, 3, 2.6)];
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 60, transform: `scale(${popAt(t, k)})`, transformOrigin: "0 50%" }}>
        <Card style={{ padding: "22px 30px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🏥</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 44, color: P.text }}>Deine Krankenkasse</div>
        </Card>
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = g + i * 0.12;
        const k2 = ramp(t, a, a + 0.5);
        return t < a ? null : <div key={i} style={{ position: "absolute", left: 140 + i * 70, top: 210 + k2 * (330 - i * 18), opacity: 1 - ramp(t, a + 1.6, a + 1.9), transform: `rotate(${i * 25 - 40}deg)` }}><Coin size={66} /></div>;
      })}
      <div style={{ position: "absolute", right: 70, top: 230, transform: `scale(${popAt(t, z)}) rotate(3deg)` }}>
        <Card style={{ padding: "22px 28px", width: 380 }}>
          <div style={{ fontSize: 64 }}>🦷</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 36, color: P.text, marginTop: 6 }}>Zahnarzt-Termin</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.green, marginTop: 8, opacity: ramp(t, e, e + 0.15) }}>✓ schon erledigt</div>
        </Card>
      </div>
      <Stamp text="+ GELD" t={t} at={e + 0.2} x={640} y={540} color={P.green} size={44} rot={-6} />
      <Walker t={t} size={100} mood={t > g ? "proud" : "happy"} keys={[{ t: 0, x: -80, y: G - 20 }, { t: g, x: 260, y: G - 20 }, { t: g + 0.25, x: 260, y: G - 20, hop: 80 }]} />
    </Wrap>
  );
};

/** 1 · ChatGPT sagt dir, wie viel. b = [ChatGPT, wie viel] */
export const KbErgebnis: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [c, w] = [bt(b, 0, 0.05), bt(b, 1, 0.9)];
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 18, transform: `scale(${popAt(t, c)})`, transformOrigin: "0 50%" }}>
        <Logo name="openai" size={88} />
        <span style={{ fontFamily: fonts.bold, fontSize: 54, color: P.text }}>ChatGPT</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: 190, width: 760, padding: "26px 32px", boxSizing: "border-box", opacity: ramp(t, c + 0.3, c + 0.5) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginBottom: 12 }}>Dein Bonus dieses Jahr</div>
        {["Zahnvorsorge ✓", "Gesundheits-Check ✓", "Impfung ✓"].map((x, i) => (
          <div key={x} style={{ fontFamily: fonts.semibold, fontSize: 38, color: P.text, padding: "8px 0", opacity: ramp(t, w + i * 0.2, w + 0.15 + i * 0.2) }}>{x}</div>
        ))}
      </Card>
      <div style={{ position: "absolute", left: 860, top: 260, fontSize: 90, transform: `scale(${popAt(t, w + 0.7)})` }}>💸</div>
      <Walker t={t} size={96} keys={[{ t: 0, x: 960, y: G - 20 }, { t: w + 0.6, x: 960, y: G - 20 }, { t: w + 0.9, x: 960, y: G - 20, hop: 90 }]} />
    </Wrap>
  );
};

const KASSEN = ["TK", "BARMER", "DAK", "AOK", "IKK", "KKH", "hkk", "BKK"];

/** 2 · Fast jede Kasse hat ein Bonusprogramm, TK 10 € pro Maßnahme. b = [Fast jede, Bonusprogramm, Techniker, zehn Euro, Maßnahme] */
export const KbKassen: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [f, bp, tk, z, m] = [bt(b, 0, 0.1), bt(b, 1, 1.2), bt(b, 2, 2.4), bt(b, 3, 3.3), bt(b, 4, 4.0)];
  const tkFocus = ramp(t, tk, tk + 0.3);
  return (
    <Wrap avatar={avatar}>
      {tkFocus < 1 ? (
        <div style={{ position: "absolute", left: 60, top: 60, width: 960, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, opacity: 1 - tkFocus }}>
          {KASSEN.map((k, i) => (
            <div key={k} style={{ transform: `scale(${popAt(t, f + i * 0.1)})`, background: "#fff", border: `2px solid ${P.line}`, borderRadius: 22, height: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text }}>{k}</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 22, color: P.green, opacity: ramp(t, bp + i * 0.06, bp + 0.1 + i * 0.06) }}>Bonus ✓</div>
            </div>
          ))}
        </div>
      ) : null}
      {tkFocus > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", opacity: tkFocus, transform: `scale(${0.8 + 0.2 * tkFocus})` }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 52, color: P.text }}>Techniker Krankenkasse</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 36, color: P.dim, marginTop: 6, opacity: ramp(t, tk + 0.4, tk + 0.6) }}>TK-Bonusprogramm</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 170, color: P.green, letterSpacing: -6, marginTop: 10, transform: `scale(${popAt(t, z)})` }}>
            <Count from={0} to={10} t={t} a={z} b={z + 0.4} suffix=" €" />
          </div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 46, color: P.text, opacity: ramp(t, m, m + 0.15) }}>pro Maßnahme</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 22, color: P.dim, marginTop: 14, opacity: ramp(t, m + 0.3, m + 0.5) }}>Quelle: tk.de · TK-Bonusprogramm</div>
        </div>
      ) : null}
      <Walker t={t} size={96} mood={t > z ? "proud" : "happy"} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: bp, x: 960, y: G - 20 }, { t: z, x: 960, y: G - 20 }, { t: z + 0.25, x: 960, y: G - 20, hop: 90 }]} />
    </Wrap>
  );
};

/** 3 · Full panel: Zahnvorsorge, Gesundheitscheck, Impfung, Fitnessstudio. b = [Zahn, Check, Impfung, Fitness] */
export const KbMassnahmen: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const at = [bt(b, 0, 0.2), bt(b, 1, 1.0), bt(b, 2, 1.8), bt(b, 3, 2.8)];
  const items: [string, string][] = [["🦷", "Zahnvorsorge"], ["🩺", "Gesundheits-Check"], ["💉", "Impfung"], ["🏋️", "Fitnessstudio"]];
  const n = at.filter((a) => t > a).length;
  return (
    <Wrap avatar={avatar} full>
      <div style={{ position: "absolute", left: 0, right: 0, top: -250, textAlign: "center", fontFamily: fonts.bold, fontSize: 64, color: P.text, opacity: ramp(t, 0, 0.2) }}>Dafür gibt's Bonus</div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 0, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 70, columnGap: 40 }}>
        {items.map(([e, l], i) => (
          <div key={l} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <Icon e={e} label={l} a={popAt(t, at[i])} size={190} />
            {t > at[i] + 0.25 ? <div style={{ position: "absolute", right: 30, top: -20, transform: `scale(${popAt(t, at[i] + 0.25)}) rotate(8deg)`, background: P.green, color: "#fff", fontFamily: fonts.bold, fontSize: 36, borderRadius: 18, padding: "8px 18px" }}>+ Bonus</div> : null}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: fonts.bold, fontSize: 52, color: P.text }}>{n} von 4 erledigt</div>
      <Walker t={t} size={110} prop={<div style={{ fontSize: 52 }}>✅</div>} keys={[{ t: 0, x: -80, y: 1000 }, { t: at[0], x: 200, y: 1000 }, { t: at[1], x: 420, y: 1000, hop: 40 }, { t: at[2], x: 640, y: 1000, hop: 40 }, { t: at[3], x: 860, y: 1000, hop: 60 }]} />
    </Wrap>
  );
};

/** 4 · Die Kasse überweist nichts von allein. Du musst einreichen. b = [nichts, von allein, einreichen] */
export const KbEinreichen: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [ni, va, ei] = [bt(b, 0, 0.5), bt(b, 1, 1.0), bt(b, 2, 2.0)];
  return (
    <Wrap avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 70, width: 600, padding: "26px 32px", boxSizing: "border-box", transform: `scale(${popAt(t, 0)})` }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim }}>Dein Konto · Eingang</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 96, color: P.red, marginTop: 8 }}>0,00 €</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: P.dim, opacity: ramp(t, va, va + 0.2) }}>von deiner Krankenkasse</div>
      </Card>
      <Slam text="NICHTS" t={t} at={ni} y={400} size={110} color={P.red} />
      <div style={{ position: "absolute", left: 700, top: 120, transform: `scale(${popAt(t, ei)}) rotate(4deg)` }}>
        <div style={{ background: "#E53935", color: "#fff", fontFamily: fonts.bold, fontSize: 40, borderRadius: 22, padding: "22px 30px", boxShadow: "0 16px 36px rgba(229,57,53,0.35)" }}>Einreichen ↑</div>
      </div>
      <Walker t={t} size={100} mood={t > ni ? "shock" : "happy"} keys={[{ t: 0, x: 950, y: G - 20 }, { t: ni, x: 950, y: G - 20 }, { t: ni + 0.2, x: 950, y: G - 20, hop: 80 }, { t: ei, x: 850, y: G - 20 }, { t: ei + 0.25, x: 850, y: G - 20, hop: 60 }]} />
    </Wrap>
  );
};

const GptInput: React.FC<{ y: number; text?: string; caret?: boolean; t: number; web?: number }> = ({ y, text = "", caret, t, web = 0 }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: y, background: "#fff", border: `2px solid ${GPT.line}`, borderRadius: 40, padding: "20px 26px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
    <div style={{ fontFamily: fonts.regular, fontSize: 36, color: text ? GPT.text : "#9B9B9B", minHeight: 50, lineHeight: 1.3 }}>{text || "Frag irgendwas"}{caret ? <span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span> : null}</div>
    <div style={{ display: "flex", alignItems: "center", marginTop: 12, gap: 14 }}>
      <div style={{ width: 62, height: 62, borderRadius: 31, border: `2px solid ${GPT.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: GPT.text }}>+</div>
      {web > 0 ? <div style={{ opacity: web, transform: `scale(${0.8 + 0.2 * web})`, display: "flex", alignItems: "center", gap: 8, background: "#E8F1FF", color: "#1A6BFF", borderRadius: 31, padding: "12px 20px", fontFamily: fonts.semibold, fontSize: 28 }}>🌐 Suche</div> : null}
      <div style={{ flex: 1 }} />
      <div style={{ width: 62, height: 62, borderRadius: 31, background: text ? GPT.text : "#D7D7D7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34 }}>↑</div>
    </div>
  </div>
);

/** 5 · Full panel: So geht's, 1 ChatGPT öffnen, Plus, Websuche. b = [So geht's, öffne ChatGPT, Plus, Websuche] */
export const KbWebsuche: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [s, o, pl, ws] = [bt(b, 0, 0.0), bt(b, 1, 1.0), bt(b, 2, 2.0), bt(b, 3, 2.8)];
  const menu = ramp(t, pl + 0.05, pl + 0.25);
  const webOn = ramp(t, ws + 0.4, ws + 0.6);
  return (
    <Wrap avatar={avatar} full>
      <Slam text="SO GEHT'S" t={t} at={s} y={-270} size={130} />
      {t > o ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `scale(${popAt(t, o)})` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 44, color: "#fff", background: P.text, borderRadius: 30, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
            <Logo name="openai" size={90} />
            <span style={{ fontFamily: fonts.bold, fontSize: 56, color: GPT.text }}>ChatGPT</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: fonts.semibold, fontSize: 54, color: GPT.text, opacity: ramp(t, o + 0.2, o + 0.4) }}>Womit kann ich helfen?</div>
        </>
      ) : null}
      {menu > 0 && webOn < 1 ? (
        <Card style={{ position: "absolute", left: 50, top: 300, width: 600, padding: "10px 0", opacity: menu * (1 - webOn) }}>
          {["📷 Kamera", "🖼️ Fotos", "🌐 Websuche", "📎 Dateien"].map((m) => <div key={m} style={{ height: 88, display: "flex", alignItems: "center", padding: "0 34px", fontFamily: m.includes("Web") ? fonts.semibold : fonts.regular, fontSize: 40, color: GPT.text }}>{m}</div>)}
        </Card>
      ) : null}
      <RedBox x={44} y={300 + 10 + 88 * 2 - 4} w={612} h={96} on={t > ws - 0.1 && t < ws + 0.45} />
      {t > o ? <GptInput y={780} t={t} web={webOn} /> : null}
      <RedBox x={66} y={780 + 84 + 14} w={78} h={78} on={t > pl - 0.35 && t < pl + 0.1} />
      <Walker t={t} size={100} keys={[{ t: 0, x: 900, y: 1150 }, { t: pl, x: 300, y: 1150 }, { t: pl + 0.25, x: 300, y: 1150, hop: 70 }, { t: ws + 0.6, x: 700, y: 1150, hop: 40 }]} />
    </Wrap>
  );
};

const Q = "Ich bin bei der TK. Was zahlt mir das Bonusprogramm, und was davon hab ich dieses Jahr schon gemacht?";

/** 6 · 2 · the prompt is typed and sent. b = [Zweitens, typing start, typing end] */
export const KbPrompt: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [z, a, e] = [bt(b, 0, 0.0), bt(b, 1, 0.6), bt(b, 2, 5.5)];
  const sent = t > e + 0.2;
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16, transform: `scale(${popAt(t, z)})`, transformOrigin: "0 50%" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 44, color: "#fff", background: P.text, borderRadius: 30, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
        <span style={{ fontFamily: fonts.bold, fontSize: 52, color: P.text }}>Schreib das</span>
      </div>
      {!sent ? <GptInput y={170} t={t} web={1} text={Q.slice(0, Math.floor(Q.length * ramp(t, a, e)))} caret /> : (
        <>
          <div style={{ position: "absolute", right: 50, top: 150, width: 760, background: GPT.bubble, borderRadius: 30, padding: "18px 26px", fontFamily: fonts.regular, fontSize: 32, color: GPT.text, opacity: ramp(t, e + 0.2, e + 0.4) }}>{Q}</div>
          <div style={{ position: "absolute", left: 50, top: 420, display: "flex", gap: 12, alignItems: "center", opacity: ramp(t, e + 0.5, e + 0.7) }}>
            <Logo name="openai" size={52} tile={false} />
            <span style={{ fontFamily: fonts.regular, fontSize: 30, color: GPT.dim }}>Sucht im Netz</span>
            {["tk.de", "Bonusprogramm"].map((s, i) => <span key={s} style={{ background: GPT.bubble, borderRadius: 14, padding: "6px 14px", fontFamily: fonts.medium, fontSize: 24, color: GPT.text, transform: `scale(${popAt(t, e + 0.7 + i * 0.25)})` }}>{s}</span>)}
          </div>
        </>
      )}
      <RedBox x={44} y={164} w={992} h={0} on={false} />
      <Walker t={t} size={96} prop={<div style={{ fontSize: 46 }}>⌨️</div>} keys={[{ t: 0, x: 980, y: G - 30 }, { t: e, x: 980, y: G - 30 }, { t: e + 0.25, x: 980, y: G - 30, hop: 90 }]} />
    </Wrap>
  );
};

/** 7 · 3 · ChatGPT makes the list, you submit in the app. b = [Drittens, Liste, einreichst/App] */
export const KbListe: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [d, l, app] = [bt(b, 0, 0.0), bt(b, 1, 1.2), bt(b, 2, 3.0)];
  const rows: [string, string, boolean][] = [["Zahnvorsorge", "✓ gemacht", true], ["Gesundheits-Check", "✓ gemacht", true], ["Impfung", "✓ gemacht", true], ["Sportverein", "offen", false]];
  const toApp = ramp(t, app, app + 0.3);
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16, transform: `scale(${popAt(t, d)})`, transformOrigin: "0 50%" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 44, color: "#fff", background: P.text, borderRadius: 30, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
        <span style={{ fontFamily: fonts.bold, fontSize: 52, color: P.text }}>{t < app ? "Deine Liste" : "In der Kassen-App einreichen"}</span>
      </div>
      {toApp < 1 ? (
        <Card style={{ position: "absolute", left: 60, top: 150, width: 960, padding: "12px 30px", boxSizing: "border-box", opacity: 1 - toApp }}>
          {rows.map(([k, v, ok], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderTop: i ? `2px solid ${P.line}` : "none", fontFamily: fonts.semibold, fontSize: 40, color: P.text, opacity: ramp(t, l + i * 0.3, l + 0.15 + i * 0.3) }}>
              <span>{k}</span><span style={{ color: ok ? P.green : P.dim, fontFamily: fonts.bold }}>{v}</span>
            </div>
          ))}
        </Card>
      ) : null}
      {toApp > 0 ? (
        <div style={{ position: "absolute", left: 330, top: 140, opacity: toApp, transform: `scale(${0.85 + 0.15 * toApp})` }}>
          <div style={{ width: 420, height: 540, borderRadius: 50, background: "#111", padding: 12, boxSizing: "border-box", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 40, background: "#fff", padding: "40px 26px", boxSizing: "border-box", position: "relative" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 32, color: P.text }}>Bonusprogramm</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 22, color: P.dim, marginTop: 6 }}>Nachweis hochladen</div>
              {["Zahnvorsorge", "Gesundheits-Check", "Impfung"].map((x, i) => (
                <div key={x} style={{ marginTop: 18, display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 24, color: P.text, borderBottom: `1px solid ${P.line}`, paddingBottom: 10 }}><span>{x}</span><span style={{ color: P.green, opacity: ramp(t, app + 0.6 + i * 0.25, app + 0.7 + i * 0.25) }}>✓</span></div>
              ))}
              <div style={{ position: "absolute", left: 26, right: 26, bottom: 34, height: 74, borderRadius: 37, background: P.green, color: "#fff", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t > app + 1.5 && t < app + 1.7 ? 0.94 : 1})` }}>Einreichen</div>
              <RedBox x={18} y={540 - 24 - 34 - 74 - 14} w={384 - 4} h={90} on={t > app + 1.1 && t < app + 1.9} />
            </div>
          </div>
        </div>
      ) : null}
      <Walker t={t} size={96} prop={<div style={{ fontSize: 46 }}>📄</div>} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: l, x: 960, y: G - 20 }, { t: app + 1.6, x: 960, y: G - 20 }, { t: app + 1.85, x: 960, y: G - 20, hop: 90 }]} />
    </Wrap>
  );
};

/** 8 · CTA: Anleitung + Liste der 10 größten Kassen, folg mir, BONUS. b = [Anleitung, zehn größten, folg, Bonus] */
export const KbCta: React.FC<KbProps> = ({ avatar, b }) => {
  const t = useSec();
  const [an, zg, fo, bo] = [bt(b, 0, 0.3), bt(b, 1, 1.2), bt(b, 2, 2.2), bt(b, 3, 3.0)];
  const w = "BONUS";
  const n = Math.max(0, Math.min(w.length, Math.floor((t - bo) / 0.08)));
  const followed = t > fo + 0.15;
  const showList = t < fo - 0.1;
  return (
    <Wrap avatar={avatar}>
      {showList ? (
        <Fly t={t} at={an} from="left" style={{ left: 60, top: 70 }}>
          <Card style={{ width: 600, padding: "26px 30px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: P.text }}>📄 Anleitung</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim, marginTop: 8 }}>+ Prompt zum Kopieren</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: P.green, marginTop: 12, opacity: ramp(t, zg, zg + 0.15) }}>+ Liste: 10 größte Kassen</div>
          </Card>
        </Fly>
      ) : (
        <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 400, padding: 36, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Logo name="instagram" size={66} />
            <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florentgpt</span>
            <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#fff", background: followed ? "#BDBDBD" : "#0095F6", borderRadius: 16, padding: "12px 30px", transform: `scale(${t > fo && t < fo + 0.25 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
          </div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
          <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>{w.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2, color: "#10A37F" }}>|</span></div>
        </Card>
      )}
      {showList ? <Crowd t={t} at={zg} cols={5} rows={2} x={720} y={170} gap={70} size={50} step={0.03} mood="proud" /> : null}
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.0, x: 900, y: G - 20 }, { t: fo - 0.2, x: 900, y: G - 20 }, { t: fo, x: 900, y: 120, hop: 80 }, { t: fo + 0.3, x: 900, y: 150 }, { t: fo + 0.6, x: 960, y: G - 20, hop: 40 }]} />
    </Wrap>
  );
};
