import React from "react";
import { fonts } from "../theme";
import { AvatarSrc, Fly, Logo, P, PanelSplit, PdfBadge, PropClipboard, PropLens, Rail, Slam, Stamp, Walker, popAt, ramp, useSec } from "../components/PanelKit";

// FP-N "Claude-Limit" (runs/fpn-claude-limit, 2026-10-08), PanelKit style with the Superkind smiley.
// Times are seconds from each window start. No limit numbers anywhere (source: Anthropic help center).

export type LimProps = { seconds?: number; avatar: AvatarSrc };
const G = 690;

const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: P.card, borderRadius: 26, border: `2px solid ${P.line}`, boxShadow: "0 18px 44px rgba(0,0,0,0.08)", ...style }}>{children}</div>
);

const Bubble: React.FC<{ me?: boolean; w: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ me, w, style, children }) => (
  <div style={{ alignSelf: me ? "flex-end" : "flex-start", width: w, minHeight: 34, borderRadius: 18, background: me ? "#F1EEE8" : "#FFF", border: me ? "none" : `2px solid ${P.line}`, padding: "10px 16px", boxSizing: "border-box", fontFamily: fonts.semibold, fontSize: 24, color: P.text, ...style }}>{children}</div>
);

/** 0 · Hook (0-1.95): clock runs to 12:00, "Limit erreicht" banner on "voll" (1.79). */
export const LimHook: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const h = 8 + Math.floor(4 * ramp(t, 0.1, 1.5));
  const m = t < 1.5 ? Math.floor((ramp(t, 0.1, 1.5) * 240) % 60) : 0;
  const hit = t > 1.5;
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", inset: 0, background: "#F3EFE6" }} />
      <div style={{ position: "absolute", left: 60, top: 54, fontFamily: fonts.bold, fontSize: 22, letterSpacing: 5, color: "#B4673C" }}>SUPERKIND · CLAUDE</div>
      <div style={{ position: "absolute", left: 60, top: 110, fontFamily: fonts.bold, fontSize: 150, color: hit ? P.red : P.text, letterSpacing: -3 }}>{String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}</div>
      <Fly t={t} at={0.2} from="right" style={{ left: 560, top: 60 }}>
        <Card style={{ width: 420, padding: "24px 26px", boxSizing: "border-box", transform: "rotate(2deg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="claude" size={52} /><span style={{ fontFamily: fonts.bold, fontSize: 26, color: P.text }}>Claude</span></div>
          {[300, 220, 340, 260].map((w, i) => <div key={i} style={{ width: w, height: 12, borderRadius: 6, background: "#E6E3DC", marginTop: 16, marginLeft: i % 2 ? 60 : 0 }} />)}
          <div style={{ marginTop: 22, borderRadius: 16, padding: "16px 18px", background: hit ? "rgba(229,72,77,0.10)" : "#F4F4F4", border: `2px solid ${hit ? P.red : P.line}`, fontFamily: fonts.bold, fontSize: 26, color: hit ? P.red : P.dim, transform: `scale(${hit ? popAt(t, 1.5) : 1})` }}>
            {hit ? "Limit erreicht. Bitte warten." : "Nachricht schreiben …"}
          </div>
        </Card>
      </Fly>
      <Walker t={t} size={100} mood={hit ? "shock" : "happy"} keys={[{ t: 0, x: 140, y: G - 30 }, { t: 1.4, x: 420, y: G - 30 }, { t: 1.6, x: 420, y: G - 30, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 1 · Full: chat grows, each new question costs more (2.0-8.6). Beats: Nachricht 0.68, Anthropic 2.09, Chat 3.8, Je länger 4.28, teurer 5.51, Frage 6.21. */
export const LimLaenge: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const qs = [0.3, 1.2, 2.1, 3.0, 3.9, 4.8];
  return (
    <PanelSplit avatar={avatar} full>
      <div style={{ position: "absolute", left: 60, top: -250, fontFamily: fonts.bold, fontSize: 60, color: P.text, lineHeight: 1.05 }}>Je länger der Chat,<br /><span style={{ color: P.orange }}>desto teurer jede Frage</span></div>
      <div style={{ position: "absolute", left: 60, top: -60, display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.medium, fontSize: 26, color: P.dim, opacity: ramp(t, 1.9, 2.2) }}><Logo name="anthropic" size={40} /> laut Anthropic</div>
      <Card style={{ position: "absolute", left: 60, top: 20, width: 600, height: 1010, padding: "26px 26px", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12 }}>
        {qs.map((at, i) => {
          const k = ramp(t, at, at + 0.25);
          if (k <= 0) return null;
          return (
            <React.Fragment key={i}>
              <Bubble me w={300} style={{ opacity: k }}>Frage {i + 1}</Bubble>
              <Bubble w={440} style={{ opacity: ramp(t, at + 0.25, at + 0.5), height: 70 }}>
                <div style={{ width: "80%", height: 10, borderRadius: 5, background: "#E6E3DC", marginTop: 4 }} />
                <div style={{ width: "55%", height: 10, borderRadius: 5, background: "#E6E3DC", marginTop: 10 }} />
              </Bubble>
            </React.Fragment>
          );
        })}
      </Card>
      <div style={{ position: "absolute", left: 700, top: 20, width: 320, fontFamily: fonts.bold, fontSize: 28, color: P.dim }}>Verbrauch pro Frage</div>
      {qs.map((at, i) => {
        const k = ramp(t, at, at + 0.4);
        const h = (i + 1) * 120 * k;
        return (
          <div key={i} style={{ position: "absolute", left: 710 + i * 52, top: 1030 - h, width: 38, height: h, borderRadius: 10, background: i >= 4 ? P.red : i >= 2 ? P.yellow : P.green, opacity: k > 0 ? 1 : 0 }} />
        );
      })}
      <Stamp text="TEURER" t={t} at={5.45} x={720} y={160} size={46} rot={-8} />
      <Walker t={t} size={100} prop={PropLens} mood={t > 5.5 ? "shock" : "happy"} keys={[{ t: 0, x: 900, y: 1150 }, { t: 5.4, x: 900, y: 1150 }, { t: 5.6, x: 900, y: 1150, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 2 · Schritt 1: long chat → 5-sentence summary → new chat (8.68-14.55). Beats: Erstens 0.88, lang 1.9, zusammenfassen 3.73, neuen Chat 5.27. */
export const LimZusammen: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const squash = ramp(t, 3.0, 3.8);
  const toNew = ramp(t, 4.9, 5.5);
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={1} t={t} at={0.8} y={30} />
      <Card style={{ position: "absolute", left: 60, top: 160, width: 420, height: 520, padding: 22, boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 26, color: P.dim, marginBottom: 12 }}>Langer Chat</div>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ramp(t, 0.9 + i * 0.08, 1.1 + i * 0.08);
          return <div key={i} style={{ width: i % 2 ? 260 : 330, height: 22, borderRadius: 11, background: i % 2 ? "#F1EEE8" : "#E6E3DC", marginLeft: i % 2 ? 60 : 0, marginTop: 12 * (1 - squash) + 2, transform: `scaleY(${1 - 0.8 * squash})`, opacity: a * (1 - 0.7 * squash) }} />;
        })}
      </Card>
      <div style={{ position: "absolute", left: 495, top: 380, fontFamily: fonts.bold, fontSize: 60, color: P.orange, opacity: ramp(t, 3.4, 3.7) }}>→</div>
      <Fly t={t} at={3.6} from="right" style={{ left: 570, top: 160 + toNew * 40 }}>
        <Card style={{ width: 450, padding: "22px 26px", boxSizing: "border-box", border: `3px solid ${toNew > 0.5 ? P.green : P.orange}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Logo name="claude" size={46} /><span style={{ fontFamily: fonts.bold, fontSize: 28, color: P.text }}>{toNew > 0.5 ? "Neuer Chat" : "Zusammenfassung"}</span></div>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, opacity: ramp(t, 3.8 + n * 0.12, 4.0 + n * 0.12) }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 24, color: P.orange, width: 22 }}>{n}</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E6E3DC" }} />
            </div>
          ))}
          <div style={{ marginTop: 16, fontFamily: fonts.semibold, fontSize: 24, color: P.dim }}>5 Sätze statt langem Verlauf</div>
        </Card>
      </Fly>
      <Walker t={t} size={90} prop={PropClipboard} keys={[{ t: 0, x: 1150, y: G - 10 }, { t: 3.6, x: 960, y: G - 10 }, { t: 5.2, x: 960, y: G - 10 }, { t: 5.4, x: 960, y: G - 10, hop: 70 }]} />
    </PanelSplit>
  );
};

/** 3 · Schritt 2: files into a project, cached (14.6-21.45). Beats: Zweitens 0, Dateien 0.63, Projekt 3.32, jeden Chat 4.27, zwischengespeichert 5.99. */
export const LimProjekt: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const files: [string, number][] = [["Preisliste.pdf", 0.6], ["Leitfaden.docx", 0.9], ["Vorlagen.xlsx", 1.2]];
  const cached = t > 5.9;
  return (
    <PanelSplit avatar={avatar}>
      <Rail active={2} t={t} y={30} />
      {files.map(([n, at], i) => {
        const fly = ramp(t, 2.9 + i * 0.12, 3.4 + i * 0.12);
        return (
          <Fly key={n} t={t} at={at} from="left" style={{ left: 60 + fly * 470, top: 170 + i * 110 + fly * (60 - i * 40), transform: `scale(${1 - 0.35 * fly})`, opacity: 1 - fly }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.card, border: `2px solid ${P.line}`, borderRadius: 18, padding: "14px 22px", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}><PdfBadge size={52} /><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.text }}>{n}</span></div>
          </Fly>
        );
      })}
      <Card style={{ position: "absolute", left: 540, top: 170, width: 480, height: 330, padding: 28, boxSizing: "border-box", transform: `scale(${t > 3.3 ? popAt(t, 3.3) : 1})`, border: `3px solid ${cached ? P.green : P.line}` }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 38, color: P.text }}>📁 Projekt</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 26, color: P.dim, marginTop: 8 }}>Projektwissen</div>
        <div style={{ display: "flex", gap: 14, marginTop: 24 }}>{files.map(([n], i) => <div key={n} style={{ opacity: ramp(t, 3.4 + i * 0.12, 3.6 + i * 0.12) }}><PdfBadge size={70} /></div>)}</div>
      </Card>
      <div style={{ position: "absolute", left: 60, top: 560, display: "flex", gap: 16, opacity: ramp(t, 4.1, 4.4) }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ position: "relative", padding: "12px 20px", borderRadius: 16, background: "#FFF", border: `2px solid ${P.line}`, fontFamily: fonts.semibold, fontSize: 24, color: P.dim }}>
            Chat {n} + 📎
            <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 4, background: P.red, transform: `scaleX(${ramp(t, 4.4 + n * 0.1, 4.6 + n * 0.1)})`, transformOrigin: "left" }} />
          </div>
        ))}
      </div>
      <Fly t={t} at={5.9} from="bottom" style={{ left: 560, top: 540 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderRadius: 40, background: P.green, color: "#FFF", fontFamily: fonts.bold, fontSize: 30 }}>✓ zwischengespeichert</div>
      </Fly>
    </PanelSplit>
  );
};

/** 4 · Full: der Trick, three messages merge into one (21.52-27.85). Beats: fast keiner 0.87-1.33, Drittens 1.8, drei Fragen 2.56, einer Nachricht 3.42, statt in drei 4.0, zählt mit 5.76. */
export const LimBuendeln: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const merge = ramp(t, 3.2, 3.9);
  const qs = ["Fass die Mail zusammen.", "Schreib eine Antwort.", "Mach sie kürzer."];
  return (
    <PanelSplit avatar={avatar} full>
      <Slam text="FAST KEINER" t={t} at={0.85} y={-280} size={130} color={P.orange} />
      <div style={{ position: "absolute", left: 0, right: 0, top: -120, display: "flex", justifyContent: "center", opacity: ramp(t, 1.7, 2.0) }}><Rail active={3} t={t} at={1.7} y={0} /></div>
      {qs.map((q, i) => {
        const a = ramp(t, 2.3 + i * 0.2, 2.5 + i * 0.2);
        const y = 40 + i * 150;
        return (
          <div key={q} style={{ position: "absolute", left: 60 + merge * 40, top: y + merge * (260 - y) * 0.9, width: 640, opacity: a * (1 - merge), transform: `scale(${1 - 0.2 * merge})` }}>
            <div style={{ padding: "22px 28px", borderRadius: 26, background: "#F1EEE8", fontFamily: fonts.semibold, fontSize: 34, color: P.text }}>{q}</div>
            <div style={{ position: "absolute", right: -70, top: 18, fontFamily: fonts.bold, fontSize: 34, color: P.red }}>✉</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 60, top: 140, width: 960, opacity: merge, transform: `scale(${0.9 + 0.1 * merge})` }}>
        <Card style={{ padding: "28px 32px", boxSizing: "border-box", border: `3px solid ${P.green}` }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 26, color: P.green, letterSpacing: 2 }}>EINE NACHRICHT</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 36, color: P.text, marginTop: 12, lineHeight: 1.3 }}>1. Fass die Mail zusammen.<br />2. Schreib eine Antwort.<br />3. Halte sie kurz.</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 620, display: "flex", justifyContent: "space-around", alignItems: "center", opacity: ramp(t, 5.5, 5.8) }}>
        <div style={{ textAlign: "center" }}><div style={{ fontFamily: fonts.bold, fontSize: 90, color: P.red }}>3×</div><div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim }}>einzeln</div></div>
        <div style={{ fontFamily: fonts.bold, fontSize: 80, color: P.text }}>→</div>
        <div style={{ textAlign: "center" }}><div style={{ fontFamily: fonts.bold, fontSize: 90, color: P.green }}>1×</div><div style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.dim }}>gebündelt</div></div>
      </div>
      <Stamp text="JEDE NACHRICHT ZÄHLT" t={t} at={5.75} x={250} y={900} size={40} rot={-5} />
      <Walker t={t} size={110} arms="point" keys={[{ t: 0, x: 1150, y: 1150 }, { t: 0.85, x: 900, y: 1150 }, { t: 1.05, x: 900, y: 1150, hop: 90 }, { t: 3.8, x: 900, y: 1150 }, { t: 4.0, x: 900, y: 1150, hop: 80 }]} />
    </PanelSplit>
  );
};

/** 5 · Gleiches Abo, mehr Fragen am Tag (27.92-29.85). Beats: Abo 0.51, mehr Fragen 0.91, Tag 1.51. */
export const LimAbo: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const k = ramp(t, 0.8, 1.6);
  return (
    <PanelSplit avatar={avatar}>
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: fonts.bold, fontSize: 64, color: P.text }}>Gleiches Abo.</div>
      <div style={{ position: "absolute", left: 60, top: 150, fontFamily: fonts.bold, fontSize: 64, color: P.orange, opacity: ramp(t, 0.8, 1.0) }}>Mehr Fragen am Tag.</div>
      {[["Vorher", 0.35, P.red], ["Mit den 3 Tipps", 0.35 + 0.55 * k, P.green]].map(([l, v, c], i) => (
        <div key={l as string} style={{ position: "absolute", left: 60, right: 60, top: 300 + i * 140 }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: P.text }}>{l}</div>
          <div style={{ marginTop: 10, height: 44, borderRadius: 22, background: P.line, overflow: "hidden" }}><div style={{ width: `${(v as number) * 100}%`, height: "100%", background: c as string, borderRadius: 22 }} /></div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 60, top: 600, fontFamily: fonts.medium, fontSize: 24, color: P.dim }}>Schema, keine echten Werte</div>
      <Walker t={t} size={90} mood="proud" keys={[{ t: 0, x: 900, y: G - 10 }, { t: 1.4, x: 900, y: G - 10 }, { t: 1.6, x: 900, y: G - 10, hop: 70 }]} />
    </PanelSplit>
  );
};

/** 6 · CTA (29.89-34.85). Beats: Nachricht zum Zusammenfassen 0.1-1.2, Guide 3.0, Kommentiere 3.47, Limit 4.0, folg 4.39. */
export const LimCta: React.FC<LimProps> = ({ avatar }) => {
  const t = useSec();
  const word = "LIMIT";
  const n = Math.max(0, Math.min(word.length, Math.floor((t - 3.9) / 0.07)));
  const followed = t > 4.5;
  return (
    <PanelSplit avatar={avatar}>
      <Card style={{ position: "absolute", left: 60, top: 110, width: 960, height: 420, padding: 36, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo name="instagram" size={66} />
          <span style={{ fontFamily: fonts.bold, fontSize: 34, color: P.text, flex: 1 }}>florent_preusser</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 28, color: "#FFF", background: followed ? "#BDBDBD" : P.orange, borderRadius: 16, padding: "12px 30px", transform: `scale(${t > 4.4 && t < 4.65 ? 1.12 : 1})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: P.dim, marginTop: 44 }}>Kommentare</div>
        <div style={{ marginTop: 18, height: 96, borderRadius: 48, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 36px", fontFamily: fonts.bold, fontSize: 46, color: P.text }}>
          {word.slice(0, n)}<span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: P.orange }}>|</span>
        </div>
      </Card>
      <Fly t={t} at={0.3} from="bottom" style={{ left: 60, top: 572 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><PdfBadge size={60} /><span style={{ fontFamily: fonts.semibold, fontSize: 30, color: P.text }}>Guide: Nachricht zum Zusammenfassen + alle Tipps</span></div>
      </Fly>
      <Walker t={t} size={100} arms="point" keys={[{ t: 0.2, x: 1150, y: G - 20 }, { t: 1.0, x: 900, y: G - 20 }, { t: 4.2, x: 900, y: G - 20 }, { t: 4.45, x: 900, y: 120, hop: 80 }, { t: 4.65, x: 900, y: 150 }, { t: 4.85, x: 960, y: G - 20, hop: 40 }]} />
    </PanelSplit>
  );
};
