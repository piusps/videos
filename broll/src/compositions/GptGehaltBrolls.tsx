import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Count, Logo, MascotVariant, P, PanelSplit, Slam, Stamp, Walker, WalkKey, popAt, ramp, useSec } from "../components/PanelKit";

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
const MONEY = ["💶", "💸", "📈", "✨", "💰", "🤑"];

// @florentgpt · "Gehalt: Was bist du wirklich wert?" (runs/gpt-gehalt, 2026-10-07). Same panel style as
// GptHandyBrolls (green bubble buddy, light ChatGPT rebuild). All salary numbers are invented examples and
// labelled as such. b = beat seconds relative to the panel start (from captions.json).

export type GhProps = { seconds?: number; avatar: AvatarSrc; b?: Record<string, number> };
const G = 690;
const GPT = { line: "#E5E5E5", text: "#0D0D0D", dim: "#8F8F8F", bubble: "#F4F4F4" };
const bt = (b: Record<string, number> | undefined, k: string, d: number) => (b && typeof b[k] === "number" ? b[k] : d);

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

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#fff", borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

const Pay: React.FC<{ who: string; amount: string; color: string; a: number; rot?: number; emoji: string }> = ({ who, amount, color, a, rot = 0, emoji }) => (
  <div style={{ transform: `scale(${a}) rotate(${rot}deg)`, background: "#fff", border: `4px solid ${color}`, borderRadius: 26, padding: "18px 30px", textAlign: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}>
    <div style={{ fontSize: 56 }}>{emoji}</div>
    <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim }}>{who}</div>
    <div style={{ fontFamily: fonts.bold, fontSize: 76, color, letterSpacing: -2 }}>{amount}</div>
  </div>
);

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

/** 0 · Hook: same job, same city, more money. */
export const GhHook: React.FC<GhProps> = ({ avatar, b }) => {
  const t = useSec();
  const other = bt(b, "verdient", 1.6), du = bt(b, "du", 3.2);
  return (
    <Wrap avatar={avatar} bursts={[du, du + 0.3]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 52, color: P.text, opacity: ramp(t, 0, 0.2) }}>Gleicher Job. Gleiche Stadt.</div>
      <div style={{ position: "absolute", left: 90, top: 170 }}><Pay who="Kollegin, gleiche Stelle" amount="4.100 €" color={P.green} a={popAt(t, other)} rot={-4} emoji="👩‍💼" /></div>
      <div style={{ position: "absolute", right: 90, top: 230 }}><Pay who="Du" amount="3.400 €" color={P.red} a={popAt(t, du)} rot={4} emoji="🫵" /></div>
      <div style={{ position: "absolute", left: 60, top: 640, fontFamily: fonts.medium, fontSize: 24, color: P.dim, opacity: ramp(t, du, du + 0.2) }}>Beispiel, brutto im Monat</div>
      <Slam text="-700 €" t={t} at={du + 0.3} y={560} size={100} color={P.red} />
      <W t={t} size={110} mood={t > du ? "shock" : "happy"} keys={[{ t: 0, x: 1150, y: G - 20 }, { t: 0.6, x: 540, y: G - 20 }, { t: du, x: 540, y: G - 20 }, { t: du + 0.2, x: 540, y: G - 20, hop: 80 }]} />
    </Wrap>
  );
};

/** 1 · What are you really worth? */
export const GhWert: React.FC<GhProps> = ({ avatar, b }) => {
  const t = useSec();
  const wert = bt(b, "wert", 1.8);
  return (
    <Wrap avatar={avatar} bursts={[wert]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 0)})`, transformOrigin: "0 50%" }}>
        <Logo name="openai" size={88} />
        <span style={{ fontFamily: fonts.bold, fontSize: 54, color: P.text }}>Dein Marktwert</span>
      </div>
      <Card style={{ position: "absolute", left: 60, top: 200, width: 760, padding: "30px 36px", boxSizing: "border-box", textAlign: "center", opacity: ramp(t, 0.3, 0.5) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: P.dim }}>Was du wirklich wert bist</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 110, color: P.green, letterSpacing: -3 }}>
          <Count from={0} to={4100} t={t} a={wert - 0.6} b={wert + 0.2} suffix=" €" />
        </div>
      </Card>
      <Stamp text="RAUSFINDEN" t={t} at={wert} x={600} y={540} color={P.green} size={36} />
      <W t={t} size={100} keys={[{ t: 0.2, x: 960, y: G - 20 }, { t: wert, x: 960, y: G - 20 }, { t: wert + 0.2, x: 960, y: G - 20, hop: 80 }]} />
    </Wrap>
  );
};

/** 2 · Full panel: ChatGPT, Plus, Websuche. */
export const GhPlus: React.FC<GhProps> = ({ avatar, b }) => {
  const t = useSec();
  const plus = bt(b, "Plus", 1.5), web = bt(b, "Websuche", 2.4);
  const menu = ramp(t, plus + 0.05, plus + 0.25) * (1 - ramp(t, web + 0.4, web + 0.55));
  return (
    <Wrap avatar={avatar} full bursts={[web + 0.4]}>
      <Floaters items={MONEY} top={-300} h={1500} />
      <div style={{ position: "absolute", left: 0, right: 0, top: -260, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `scale(${popAt(t, 0.1)})` }}>
        <Logo name="openai" size={100} />
        <span style={{ fontFamily: fonts.bold, fontSize: 60, color: GPT.text }}>ChatGPT</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: fonts.semibold, fontSize: 60, color: GPT.text }}>Womit kann ich helfen?</div>
      {menu > 0 ? (
        <Card style={{ position: "absolute", left: 50, top: 290, width: 600, padding: "10px 0", opacity: menu }}>
          {["📷 Kamera", "🖼️ Fotos", "📎 Dateien", "🌐 Websuche"].map((m) => <div key={m} style={{ height: 90, display: "flex", alignItems: "center", padding: "0 34px", fontFamily: fonts.regular, fontSize: 40, color: GPT.text }}>{m}</div>)}
        </Card>
      ) : null}
      <RedBox x={44} y={570} w={612} h={96} on={t > web - 0.1 && t < web + 0.45} />
      <GptInput y={760} t={t} web={t > web + 0.45} />
      <RedBox x={66} y={844} w={78} h={78} on={t > plus - 0.4 && t < plus + 0.1} />
      <W t={t} size={100} keys={[{ t: 0, x: 900, y: 1100 }, { t: plus - 0.3, x: 300, y: 1100 }, { t: plus, x: 300, y: 1100, hop: 70 }, { t: web + 0.5, x: 700, y: 1100, hop: 40 }]} />
    </Wrap>
  );
};

const Chip: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => (
  <span style={{ background: on ? "#FDE2E2" : "transparent", color: on ? P.red : GPT.text, fontFamily: on ? fonts.bold : fonts.regular, borderRadius: 10, padding: on ? "0 8px" : 0 }}>{children}</span>
);

/** 3 · Typing the question; Beruf + Stadt get highlighted. */
export const GhFrage: React.FC<GhProps> = ({ avatar, b, seconds = 7 }) => {
  const t = useSec();
  const end = bt(b, "einsetzen", seconds - 1.6);
  const p = ramp(t, 0.4, Math.max(1.5, end - 1.2));
  const parts: [string, boolean][] = [["Was verdienen Leute als ", false], ["Pflegefachkraft", true], [" in ", false], ["Köln", true], [", laut Entgeltatlas der Arbeitsagentur?", false]];
  const total = parts.reduce((s, [x]) => s + x.length, 0);
  let left = Math.floor(total * p);
  const hl = t > end - 0.3;
  return (
    <Wrap avatar={avatar} bursts={[end]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 60, top: 50, fontFamily: fonts.bold, fontSize: 56, color: P.text }}>Deine Frage</div>
      <GptInput y={170} t={t} web caret text={<>{parts.map(([x, isVar], i) => { const s = x.slice(0, Math.max(0, left)); left -= x.length; return s ? <Chip key={i} on={isVar && hl}>{s}</Chip> : null; })}</>} />
      <div style={{ position: "absolute", left: 60, top: 560, transform: `scale(${popAt(t, end - 0.2)})`, transformOrigin: "0 50%", background: P.text, color: "#fff", borderRadius: 18, padding: "12px 22px", fontFamily: fonts.semibold, fontSize: 30 }}>✏️ deinen Beruf + deine Stadt</div>
      <W t={t} size={96} keys={[{ t: 0, x: 980, y: G - 30 }, { t: end, x: 980, y: G - 30 }, { t: end + 0.2, x: 980, y: G - 30, hop: 70 }]} />
    </Wrap>
  );
};

/** 4 · Result: salary range with source. */
export const GhSpanne: React.FC<GhProps> = ({ avatar, b }) => {
  const t = useSec();
  const sp = bt(b, "Spanne", 1.2), q = bt(b, "Quelle", 1.9);
  const bar = ramp(t, sp - 0.2, sp + 0.4);
  return (
    <Wrap avatar={avatar} bursts={[sp + 0.3, q]}>
      <Floaters items={MONEY} />
      <div style={{ position: "absolute", left: 50, top: 40, display: "flex", gap: 12, alignItems: "center", opacity: ramp(t, 0, 0.2) }}>
        <Logo name="openai" size={52} tile={false} />
        <span style={{ fontFamily: fonts.regular, fontSize: 30, color: GPT.dim }}>Sucht im Netz</span>
      </div>
      <Card style={{ position: "absolute", left: 50, top: 130, width: 980, padding: "26px 34px", boxSizing: "border-box", opacity: ramp(t, 0.2, 0.4) }}>
        <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: P.text }}>Pflegefachkraft · Köln · brutto/Monat</div>
        <div style={{ position: "relative", height: 70, marginTop: 30, borderRadius: 35, background: "#F1F1F1", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: "10%", width: `${80 * bar}%`, top: 0, bottom: 0, borderRadius: 35, background: "linear-gradient(90deg,#F6C453,#2EAD5B)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: fonts.bold, fontSize: 34, color: P.text, opacity: bar }}>
          <span>3.300 €</span><span style={{ color: P.green }}>Mitte 3.900 €</span><span>4.500 €</span>
        </div>
        <div style={{ marginTop: 22, display: "inline-block", background: GPT.bubble, borderRadius: 14, padding: "8px 16px", fontFamily: fonts.medium, fontSize: 24, color: GPT.text, transform: `scale(${popAt(t, q)})`, transformOrigin: "0 50%" }}>🔗 entgeltatlas.arbeitsagentur.de</div>
      </Card>
      <div style={{ position: "absolute", left: 60, top: 600, fontFamily: fonts.medium, fontSize: 24, color: P.dim, opacity: bar }}>Beispielwerte</div>
      <RedBox x={66} y={440} w={430} h={70} on={t > q && t < q + 1.2} />
      <W t={t} size={96} mood="happy" keys={[{ t: 0, x: 980, y: G - 30 }, { t: sp, x: 980, y: G - 30 }, { t: sp + 0.2, x: 980, y: G - 30, hop: 90 }]} />
    </Wrap>
  );
};

const Mine = "Ich verdiene 3.400 € brutto. Schreib mir einen Satz für das Gespräch mit meinem Chef.";

/** 5 · Full panel: DER TRICK, add your own salary. */
export const GhTrick: React.FC<GhProps> = ({ avatar, b, seconds = 6 }) => {
  const t = useSec();
  const n = Math.floor(Mine.length * ramp(t, 1.0, Math.max(2, seconds - 0.6)));
  return (
    <Wrap avatar={avatar} full bursts={[0.25]}>
      <Floaters items={MONEY} top={-300} h={1500} />
      <Slam text="TRICK" accent="DER" t={t} at={0.2} y={-250} size={170} />
      <GptInput y={120} t={t} web caret text={Mine.slice(0, n)} />
      <RedBox x={60} y={128} w={420} h={60} on={n > 28 && t < seconds - 0.3} />
      <W t={t} size={110} prop={<div style={{ fontSize: 52 }}>💶</div>} keys={[{ t: 0, x: -80, y: 860 }, { t: 0.9, x: 300, y: 860 }, { t: seconds, x: 300, y: 860 }]} />
    </Wrap>
  );
};

const Msg = "Ich mache meine Arbeit gern hier. Für meine Stelle in Köln liegt die Mitte bei 3.900 €, ich bekomme 3.400 €. Können wir darüber sprechen, wie wir das angleichen?";

/** 6 · The message: friendly, number in it. */
export const GhSatz: React.FC<GhProps> = ({ avatar, b }) => {
  const t = useSec();
  const fr = bt(b, "Freundlich", 0.1), z = bt(b, "Zahl", 1.4);
  const cut = Msg.indexOf("liegt die Mitte"), cut2 = Msg.indexOf(", ich bekomme");
  return (
    <Wrap avatar={avatar} bursts={[fr + 0.1, z]}>
      <Floaters items={MONEY} />
      <Card style={{ position: "absolute", left: 60, top: 50, width: 960, padding: "26px 32px", boxSizing: "border-box", opacity: ramp(t, 0, 0.15) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}><Logo name="openai" size={46} tile={false} /><span style={{ fontFamily: fonts.semibold, fontSize: 26, color: P.dim }}>Dein Satz für den Chef</span></div>
        <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.38, color: P.text }}>
          {Msg.slice(0, cut)}
          <span style={{ background: t > z ? "#DDF5E5" : "transparent", color: t > z ? P.green : P.text, fontFamily: t > z ? fonts.bold : fonts.regular }}>{Msg.slice(cut, cut2)}</span>
          {Msg.slice(cut2)}
        </div>
      </Card>
      <Stamp text="FREUNDLICH" t={t} at={fr + 0.1} x={260} y={560} color={P.green} size={34} rot={-5} />
      <Stamp text="MIT ZAHL" t={t} at={z} x={700} y={560} color={P.red} size={34} rot={5} />
      <W t={t} size={96} mood="proud" keys={[{ t: 0, x: 980, y: G - 30 }]} />
    </Wrap>
  );
};

/** 7 · CTA: comment GEHALT, follow. */
export const GhCta: React.FC<GhProps> = ({ avatar, b, seconds = 4 }) => {
  const t = useSec();
  const folg = bt(b, "folg", seconds - 2), word = bt(b, "Gehalt", seconds - 1.1);
  const w = "GEHALT";
  const n = Math.max(0, Math.min(w.length, Math.floor((t - word) / 0.08)));
  const followed = t > folg + 0.1;
  return (
    <Wrap avatar={avatar} bursts={[folg + 0.1, word + 0.4]}>
      <Floaters items={MONEY} />
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 400, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florentgpt</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#fff", background: followed ? "#BDBDBD" : "#0095F6", borderRadius: 16, padding: "12px 30px" }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>{w.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2, color: "#10A37F" }}>|</span></div>
      </Card>
      <W t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1, x: 900, y: G - 20 }, { t: folg - 0.1, x: 900, y: G - 20 }, { t: folg + 0.1, x: 900, y: 120, hop: 80 }, { t: folg + 0.4, x: 900, y: 150 }, { t: folg + 0.7, x: 960, y: G - 20, hop: 40 }]} />
    </Wrap>
  );
};
