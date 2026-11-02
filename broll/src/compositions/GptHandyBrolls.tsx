import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Crowd, Fly, Logo, MascotVariant, P, PanelSplit, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// @florentgpt · "Handyvertrag: Neukundenpreis holen" (runs/gpt-handyvertrag, 2026-10-07). First GPT reel in the
// @florent_preusser panel style (Pius 2026-10-06): no Superkind brand, green chat-bubble buddy as the mascot,
// a new picture roughly every second. Light ChatGPT UI rebuild. All prices are invented examples.

export type HvProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;
const GPT = { bg: "#FFFFFF", line: "#E5E5E5", text: "#0D0D0D", dim: "#8F8F8F", bubble: "#F4F4F4" };

const Wrap: React.FC<{ avatar: AvatarSrc; full?: boolean; children: React.ReactNode }> = ({ avatar, full, children }) => (
  <MascotVariant.Provider value="bubble">
    <PanelSplit avatar={avatar} full={full} brand={false}>{children}</PanelSplit>
  </MascotVariant.Provider>
);

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#fff", borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

const PriceTag: React.FC<{ label: string; price: string; color: string; a: number; rot?: number }> = ({ label, price, color, a, rot = 0 }) => (
  <div style={{ transform: `scale(${a}) rotate(${rot}deg)`, background: "#fff", border: `4px solid ${color}`, borderRadius: 26, padding: "18px 30px", textAlign: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}>
    <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim }}>{label}</div>
    <div style={{ fontFamily: fonts.bold, fontSize: 84, color, letterSpacing: -2 }}>{price}</div>
  </div>
);

const Phone: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = 300, h = 560 }) => (
  <div style={{ width: w, height: h, borderRadius: 46, background: "#111", padding: 12, boxSizing: "border-box", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 36, background: "#fff", overflow: "hidden", position: "relative" }}>{children}</div>
  </div>
);

/** 0 · Hook (0-2.95): Neukunde pays less than you. Beats: Neukunden 1.14, besseren Preis 1.91, als dir 2.6. */
export const HvHook: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 52, color: P.text, opacity: ramp(t, 0, 0.2) }}>Gleicher Tarif. Anderer Preis.</div>
      <div style={{ position: "absolute", left: 90, top: 190 }}><PriceTag label="Neukunde" price="19,99 €" color={P.green} a={popAt(t, 1.05)} rot={-4} /></div>
      <div style={{ position: "absolute", right: 90, top: 260 }}><PriceTag label="Du, seit 5 Jahren" price="34,99 €" color={P.red} a={popAt(t, 2.5)} rot={4} /></div>
      <Slam text="UNFAIR" t={t} at={2.75} y={520} size={110} color={P.red} />
      <Walker t={t} size={110} mood={t > 2.6 ? "shock" : "happy"} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: 0.6, x: 540, y: G - 20 }, { t: 2.6, x: 540, y: G - 20 }, { t: 2.8, x: 540, y: G - 20, hop: 80 }]} />
    </Wrap>
  );
};

/** 1 · ChatGPT writes the message (3.0-5.8). Beats: ChatGPT 0.04, Nachricht 1.1, bekommst 2.3. */
export const HvErgebnis: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  const msg = "Hallo, ich bin seit 5 Jahren Kunde und zahle 34,99 €. Neukunden bekommen den gleichen Tarif für 19,99 €…";
  const n = Math.floor(msg.length * ramp(t, 1.0, 2.6));
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 0)})`, transformOrigin: "0 50%" }}>
        <Logo name="openai" size={88} />
        <span style={{ fontFamily: fonts.bold, fontSize: 54, color: P.text }}>ChatGPT schreibt</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: 190, width: 760, padding: "26px 32px", boxSizing: "border-box", opacity: ramp(t, 0.9, 1.1) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: P.dim, marginBottom: 10 }}>An: Kundenservice</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.35, color: P.text, minHeight: 200 }}>{msg.slice(0, n)}<span style={{ color: "#10A37F", opacity: Math.floor(t * 3) % 2 }}>|</span></div>
      </Card>
      <Stamp text="DEIN PREIS" t={t} at={2.35} x={560} y={520} color={P.green} size={36} />
      <Walker t={t} size={100} keys={[{ t: 0.2, x: 960, y: G - 20 }, { t: 1.2, x: 960, y: G - 20 }, { t: 1.5, x: 960, y: 250, hop: 90 }, { t: 2.3, x: 960, y: 250 }, { t: 2.6, x: 960, y: G - 20, hop: 50 }]} />
    </Wrap>
  );
};

/** 2 · Screenshot of the bill (6.3-8.45). Beats: Screenshot 0.44, Handyrechnung 1.48. */
export const HvScreenshot: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  const flash = t > 0.44 && t < 0.62 ? 1 - (t - 0.44) / 0.18 : 0;
  return (
    <Wrap avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 64, color: P.text }}>1 · Screenshot</div>
      <div style={{ position: "absolute", left: 390, top: 130, transform: `rotate(${-3 + Math.sin(t * 2) * 1.5}deg) scale(${popAt(t, 0, 0.3)})` }}>
        <Phone w={300} h={560}>
          <div style={{ padding: "40px 22px" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 26, color: P.text }}>Deine Rechnung</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 18, color: P.dim, marginTop: 4 }}>September</div>
            {[["Tarif", "Allnet 20 GB"], ["Laufzeit", "seit 2021"], ["Monatlich", "34,99 €"]].map(([k, v], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontFamily: fonts.semibold, fontSize: 20, color: i === 2 ? P.red : P.text, borderBottom: `1px solid ${P.line}`, paddingBottom: 10 }}><span>{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 720, top: 470, transform: `scale(${popAt(t, 1.45)})` }}>
        <div style={{ background: P.text, color: "#fff", borderRadius: 18, padding: "12px 20px", fontFamily: fonts.semibold, fontSize: 26 }}>📸 gespeichert</div>
      </div>
      <Walker t={t} size={96} prop={<div style={{ fontSize: 48 }}>📱</div>} keys={[{ t: 0, x: 200, y: G - 20 }, { t: 0.4, x: 200, y: G - 20, hop: 60 }, { t: 1.6, x: 240, y: G - 20 }]} />
    </Wrap>
  );
};

const GptInput: React.FC<{ y: number; text?: string; img?: number; caret?: boolean; t: number }> = ({ y, text = "", img = 0, caret, t }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: y, background: "#fff", border: `2px solid ${GPT.line}`, borderRadius: 40, padding: "20px 26px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
    {img > 0 ? <div style={{ width: 120, height: 150, borderRadius: 16, background: "#F2F2F2", border: `2px solid ${GPT.line}`, marginBottom: 14, opacity: img, transform: `scale(${0.8 + 0.2 * img})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>🧾</div> : null}
    <div style={{ fontFamily: fonts.regular, fontSize: 36, color: text ? GPT.text : "#9B9B9B", minHeight: 50, lineHeight: 1.3 }}>{text || "Frag irgendwas"}{caret ? <span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span> : null}</div>
    <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
      <div style={{ width: 62, height: 62, borderRadius: 31, border: `2px solid ${GPT.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: GPT.text }}>+</div>
      <div style={{ flex: 1 }} />
      <div style={{ width: 62, height: 62, borderRadius: 31, background: text ? GPT.text : "#D7D7D7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 34 }}>↑</div>
    </div>
  </div>
);

const RedBox: React.FC<{ x: number; y: number; w: number; h: number; on: boolean }> = ({ x, y, w, h, on }) => (on ? <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "6px solid #E53935", borderRadius: 18, boxShadow: "0 0 0 8px rgba(229,57,53,0.15)" }} /> : null);

/** 3 · Full panel: ChatGPT app, Plus, photo uploaded (8.48-11.55). Beats: ChatGPT 0.36, Plus 1.91, Bild 2.63. */
export const HvUpload: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  const menu = ramp(t, 1.95, 2.15) * (1 - ramp(t, 2.55, 2.7));
  return (
    <Wrap avatar={avatar} full>
      <div style={{ position: "absolute", left: 0, right: 0, top: -260, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 0.3)})` }}>
        <Logo name="openai" size={100} />
        <span style={{ fontFamily: fonts.bold, fontSize: 60, color: GPT.text }}>ChatGPT</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: fonts.semibold, fontSize: 60, color: GPT.text }}>Womit kann ich helfen?</div>
      {menu > 0 ? (
        <Card style={{ position: "absolute", left: 50, top: 380, width: 600, padding: "10px 0", opacity: menu }}>
          {["📷 Kamera", "🖼️ Fotos", "📎 Dateien"].map((m) => <div key={m} style={{ height: 90, display: "flex", alignItems: "center", padding: "0 34px", fontFamily: fonts.regular, fontSize: 40, color: GPT.text }}>{m}</div>)}
        </Card>
      ) : null}
      <RedBox x={44} y={480} w={612} h={96} on={t > 2.2 && t < 2.65} />
      <GptInput y={760} t={t} img={ramp(t, 2.65, 2.9)} />
      <RedBox x={66} y={(t > 2.65 ? 760 + 164 : 760) + 84} w={78} h={78} on={t > 1.6 && t < 2.05} />
      <Walker t={t} size={100} keys={[{ t: 0, x: 900, y: 1100 }, { t: 1.7, x: 300, y: 1100 }, { t: 1.95, x: 300, y: 1100, hop: 70 }, { t: 2.8, x: 700, y: 1100, hop: 40 }]} />
    </Wrap>
  );
};

const Q = "Such mir die aktuellen Neukundenpreise meines Anbieters für genau diesen Tarif.";

/** 4 · Message, web search, overpay counter (11.6-19.1). Beats: Such 0.83-3.7 typing, send 4.0, sucht 4.56, zu viel 6.8. */
export const HvSuche: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  const sent = t > 4.0;
  return (
    <Wrap avatar={avatar}>
      {!sent ? <GptInput y={200} t={t} img={1} text={Q.slice(0, Math.floor(Q.length * ramp(t, 0.8, 3.7)))} caret /> : (
        <>
          <div style={{ position: "absolute", right: 50, top: 40, width: 700, background: GPT.bubble, borderRadius: 30, padding: "18px 26px", fontFamily: fonts.regular, fontSize: 30, color: GPT.text, opacity: ramp(t, 4.0, 4.2) }}>{Q}</div>
          <div style={{ position: "absolute", left: 50, top: 230, display: "flex", gap: 12, alignItems: "center", opacity: ramp(t, 4.5, 4.7) }}>
            <Logo name="openai" size={52} tile={false} />
            <span style={{ fontFamily: fonts.regular, fontSize: 28, color: GPT.dim }}>Sucht im Netz</span>
            {["anbieter.de", "vergleich.de", "tarif-check"].map((s, i) => <span key={s} style={{ background: GPT.bubble, borderRadius: 14, padding: "6px 14px", fontFamily: fonts.medium, fontSize: 22, color: GPT.text, transform: `scale(${popAt(t, 4.8 + i * 0.25)})` }}>{s}</span>)}
          </div>
          <Card style={{ position: "absolute", left: 50, top: 320, width: 980, padding: "16px 30px", boxSizing: "border-box", opacity: ramp(t, 5.3, 5.5) }}>
            {[["Dein Tarif", "34,99 €", P.red], ["Neukunde, gleicher Tarif", "19,99 €", P.green]].map(([k, v, c], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderTop: i ? `2px solid ${P.line}` : "none", fontFamily: fonts.semibold, fontSize: 38, color: P.text, opacity: ramp(t, 5.5 + i * 0.4, 5.7 + i * 0.4) }}><span>{k}</span><span style={{ color: c as string, fontFamily: fonts.bold }}>{v}</span></div>
            ))}
          </Card>
          <div style={{ position: "absolute", left: 60, top: 560, fontFamily: fonts.bold, fontSize: 64, color: P.red, transform: `scale(${popAt(t, 6.7)})`, transformOrigin: "0 50%" }}>
            Zu viel: <Count from={0} to={180} t={t} a={6.75} b={7.3} suffix=" € / Jahr" />
          </div>
          <div style={{ position: "absolute", left: 60, top: 650, fontFamily: fonts.medium, fontSize: 24, color: P.dim, opacity: ramp(t, 7, 7.2) }}>Beispiel · Preise ändern sich ständig</div>
        </>
      )}
      <Walker t={t} size={96} mood={t > 6.8 ? "shock" : "happy"} keys={[{ t: 0, x: 980, y: G - 30 }, { t: 6.6, x: 980, y: G - 30 }, { t: 6.8, x: 980, y: G - 30, hop: 90 }]} />
    </Wrap>
  );
};

const M = "Ich bin gern Kunde, zahle aber deutlich mehr als Neukunden. Bitte machen Sie mir ein vergleichbares Angebot, sonst kündige ich zum nächstmöglichen Termin.";

/** 5 · Full panel: DER TRICK, then the customer-service message with the cancel line framed (19.16-24.15). */
export const HvTrick: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  const n = Math.floor(M.length * ramp(t, 1.0, 4.4));
  const cut = M.indexOf("sonst kündige");
  return (
    <Wrap avatar={avatar} full>
      <Slam text="TRICK" accent="DER" t={t} at={0.3} y={-250} size={170} />
      <Card style={{ position: "absolute", left: 60, top: 60, width: 960, padding: "30px 36px", boxSizing: "border-box", opacity: ramp(t, 0.8, 1.0) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><Logo name="openai" size={52} tile={false} /><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim }}>Nachricht an den Kundenservice</span></div>
        <div style={{ fontFamily: fonts.regular, fontSize: 42, lineHeight: 1.4, color: P.text, minHeight: 360 }}>
          {M.slice(0, Math.min(n, cut))}
          {n > cut ? <span style={{ background: t > 4.5 ? "#FDE2E2" : "transparent", color: t > 4.5 ? P.red : P.text, fontFamily: t > 4.5 ? fonts.bold : fonts.regular }}>{M.slice(cut, n)}</span> : null}
        </div>
      </Card>
      <Stamp text="FREUNDLICH + KLAR" t={t} at={2.9} x={520} y={560} color={P.green} size={34} rot={-4} />
      <Walker t={t} size={110} prop={<div style={{ fontSize: 52 }}>✉️</div>} keys={[{ t: 0, x: -80, y: 860 }, { t: 0.9, x: 300, y: 860 }, { t: 4.5, x: 300, y: 860 }, { t: 4.7, x: 300, y: 860, hop: 80 }]} />
    </Wrap>
  );
};

/** 6 · The offer arrives (24.2-26.9), crowd cheers. Beats: rücken 0.45, Angebot 2.0. */
export const HvAngebot: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  return (
    <Wrap avatar={avatar}>
      <Fly t={t} at={0.3} from="left" style={{ left: 60, top: 60 }}>
        <div style={{ background: GPT.bubble, borderRadius: 30, padding: "22px 30px", width: 760, fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.35, color: P.text }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: P.dim, marginBottom: 8 }}>Kundenservice</div>
          Wir möchten Sie gern behalten. Wir können Ihnen den Tarif für <b style={{ color: P.green }}>19,99 €</b> anbieten.
        </div>
      </Fly>
      <Stamp text="ANGEBOT" t={t} at={1.95} x={640} y={330} color={P.green} size={48} rot={-8} />
      <Crowd t={t} at={2.0} cols={11} rows={2} x={90} y={560} gap={90} size={56} step={0.015} mood="proud" />
    </Wrap>
  );
};

/** 7 · CTA (26.95-30.68): comment HANDY, follow. Beats: Kopieren 1.2, folg 1.97, Handy 2.87. */
export const HvCta: React.FC<HvProps> = ({ avatar }) => {
  const t = useSec();
  const w = "HANDY";
  const n = Math.max(0, Math.min(w.length, Math.floor((t - 2.8) / 0.08)));
  const followed = t > 2.1;
  return (
    <Wrap avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 400, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florentgpt</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#fff", background: followed ? "#BDBDBD" : "#0095F6", borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 2.0 && t < 2.25 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>{w.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2, color: "#10A37F" }}>|</span></div>
      </Card>
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.2, x: 900, y: G - 20 }, { t: 1.8, x: 900, y: G - 20 }, { t: 2.05, x: 900, y: 120, hop: 80 }, { t: 2.3, x: 900, y: 150 }, { t: 2.6, x: 960, y: G - 20, hop: 40 }]} />
    </Wrap>
  );
};
