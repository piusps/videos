import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import {
  AnswerBlock,
  C,
  Camera,
  ClaudeMark,
  Cursor,
  InputBox,
  PlusMenu,
  RedFrame,
  StartHeader,
  StatusLine,
  UserBubble,
  menuRowY,
  prog,
  typed,
  useT,
} from "../components/ClaudeKit";

// @florentgpt batch for 2026-10-03 (H-008 Lebenslauf, H-006 Kühlschrank, H-007 Datenschutz).
// Click paths in ClaudeKit. Plus menu labels from runs/gpt-urlaub-mallorca/klickpfad, the settings
// path (name menu → Einstellungen → Datenschutz → "Help improve our AI models") read from claude.ai
// on 2026-10-02 (runs/gpt-datenschutz/klickpfad/claude-ablauf.md). CV, job ad and fridge are invented.

export const INPUT = { x: 50, y: 1560, w: 980 };

// ---------- shared pieces ----------

export const Paper: React.FC<{ w: number; title: string; sub?: string; lines?: number; rot?: number; children?: React.ReactNode }> = ({ w, title, sub, lines = 14, rot = 0, children }) => {
  const s = w / 800;
  return (
    <div style={{ position: "relative", width: w, height: w * 1.38, backgroundColor: "#FBFAF6", borderRadius: 8 * s, transform: `rotate(${rot}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 60 * s, top: 56 * s, fontFamily: fonts.bold, fontSize: 40 * s, color: "#1A1A1A" }}>{title}</div>
      {sub ? <div style={{ position: "absolute", left: 60 * s, top: 110 * s, fontFamily: fonts.regular, fontSize: 24 * s, color: "#666" }}>{sub}</div> : null}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 60 * s, top: (190 + i * 52) * s, width: [640, 560, 680, 500, 620, 580, 660, 450, 600, 640, 520, 610, 560, 480][i % 14] * s, height: 13 * s, borderRadius: 7 * s, backgroundColor: i % 5 === 0 ? "#A8A8A8" : "#DADADA" }} />
      ))}
      {children}
    </div>
  );
};

export const Thumb: React.FC<{ x: number; y: number; appear: number; children: React.ReactNode }> = ({ x, y, appear, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 150, borderRadius: 18, overflow: "hidden", border: `2px solid ${C.panelBorder}`, backgroundColor: "#3A3936", opacity: appear, transform: `scale(${0.8 + 0.2 * appear})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </div>
);

const Fridge: React.FC<{ w: number }> = ({ w }) => {
  const s = w / 600;
  const shelf = (top: number, items: string[]) => (
    <div style={{ position: "absolute", left: 30 * s, right: 30 * s, top: top * s, height: 150 * s, borderBottom: `${6 * s}px solid #CFE3EE`, display: "flex", alignItems: "flex-end", justifyContent: "space-around", fontSize: 78 * s, lineHeight: 1 }}>
      {items.map((it, i) => <span key={i}>{it}</span>)}
    </div>
  );
  return (
    <div style={{ position: "relative", width: w, height: w * 1.5, borderRadius: 26 * s, background: "linear-gradient(#F4FAFD, #E3EEF4)", border: `${8 * s}px solid #D5DEE4`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)", overflow: "hidden" }}>
      {shelf(20, ["🥚", "🧀", "🥛"])}
      {shelf(200, ["🥬", "🍅", "🫑"])}
      {shelf(380, ["🍗", "🥕", "🧈"])}
      {shelf(560, ["🍋", "🫙", "🥒"])}
      {shelf(740, ["🍶", "🥤", "🍎"])}
    </div>
  );
};

/** Start screen: Plus → "Dateien oder Fotos hinzufügen" → attachment appears. */
export const PlusUpload: React.FC<{ thumb: React.ReactNode }> = ({ thumb }) => {
  const t = useT();
  const plus = { x: INPUT.x + 34 + 35, y: 760 + 34 + 108 + 14 + 35 };
  const menu = { x: 60, y: 1040 };
  const rowY = menu.y + menuRowY("Dateien oder Fotos hinzufügen");
  const open = t < 1.75 ? prog(t, 0.55, 0.75) : 1 - prog(t, 1.75, 1.9);
  const att = prog(t, 2.0, 2.3);
  return (
    <Camera keys={[[0, 540, 900, 1.15], [0.45, plus.x + 260, plus.y + 60, 1.45], [0.95, 470, rowY - 60, 1.35], [1.8, 470, rowY - 60, 1.35], [2.2, 400, 720, 1.4], [3.6, 400, 720, 1.45]]}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <StartHeader y={440} />
        <InputBox x={INPUT.x} y={760} w={INPUT.w} plusActive={open > 0} />
        <Thumb x={INPUT.x + 30} y={590} appear={att}>{thumb}</Thumb>
        <PlusMenu x={menu.x} y={menu.y} open={open} websucheOn={false} hover={t > 1.05 && t < 1.8 ? "Dateien oder Fotos hinzufügen" : undefined} />
        <RedFrame x={menu.x + 14} y={rowY - 41} w={732} h={82} at={1.2} until={1.75} />
        <RedFrame x={INPUT.x + 30} y={590} w={150} h={150} at={2.35} />
        <Cursor keys={[[0, 640, 1150], [0.5, plus.x, plus.y, true], [0.95, plus.x + 60, plus.y + 90], [1.4, 430, rowY, true], [2.2, 300, 860], [3.6, 310, 870]]} />
      </AbsoluteFill>
    </Camera>
  );
};

/** Typing a message (with attachment), then Claude's answer. */
export const Ask: React.FC<{ msg: string; thumb?: React.ReactNode; status: string; typeTo: number; sendAt: number; camera: [number, number, number, number][]; children: (t: number) => React.ReactNode }> = ({ msg, thumb, status, typeTo, sendAt, camera, children }) => {
  const t = useT();
  const sent = t >= sendAt;
  const lines = Math.ceil(msg.length / 34);
  return (
    <Camera keys={camera}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {sent ? (
          <>
            {thumb ? <div style={{ position: "absolute", right: 50, top: 60, opacity: prog(t, sendAt, sendAt + 0.25) }}><Thumb x={-150} y={0} appear={1}>{thumb}</Thumb></div> : null}
            <UserBubble y={thumb ? 230 : 110} text={msg} appear={prog(t, sendAt, sendAt + 0.25)} />
            <StatusLine y={(thumb ? 230 : 110) + 70 + lines * 52} text={status} appear={prog(t, sendAt + 0.25, sendAt + 0.45)} />
            {children(t)}
          </>
        ) : thumb ? (
          <Thumb x={INPUT.x + 30} y={INPUT.y - 175} appear={1}>{thumb}</Thumb>
        ) : null}
        <InputBox x={INPUT.x} y={INPUT.y} w={INPUT.w} placeholder="Schreib eine Nachricht…" text={sent ? "" : typed(msg, t, 0.1, typeTo)} caret={!sent} />
      </AbsoluteFill>
    </Camera>
  );
};

export const Chip: React.FC<{ text: string; tone?: "red" | "green" }> = ({ text, tone = "red" }) => (
  <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: "#fff", backgroundColor: tone === "red" ? "#C62828" : "#2E7D32", borderRadius: 999, padding: "10px 22px", display: "inline-block", margin: "0 12px 14px 0" }}>{text}</span>
);

export const ResultCard: React.FC<{ kicker: string; rows: [string, string][]; times: number[] }> = ({ kicker, rows, times }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 760, backgroundColor: C.bg, border: `2px solid ${C.panelBorder}`, borderRadius: 30, padding: "36px 40px", boxShadow: "0 30px 90px rgba(0,0,0,0.6)", opacity: prog(t, 0.35, 0.7), transform: `translateY(${(1 - prog(t, 0.35, 0.7)) * 50}px)` }}>
      <div style={{ fontFamily: fonts.medium, fontSize: 28, color: C.orange, letterSpacing: 2, marginBottom: 12 }}>{kicker}</div>
      {rows.map(([h, b], i) => {
        const a = prog(t, times[i], times[i] + 0.3);
        return (
          <div key={h} style={{ display: "flex", gap: 22, padding: "18px 0", borderTop: i ? `2px solid ${C.panelBorder}` : "none", opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#4CAF50", width: 44 }}>✓</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.text }}>{h}</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 32, lineHeight: 1.4, color: C.dim, marginTop: 6 }}>{b}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- H-008 Lebenslauf ----------

const CV = <Paper w={110} title="Lebenslauf" lines={8} />;
const GL_N1 = "Vergleich meinen Lebenslauf mit dieser Stelle. Was fehlt?";
const GL_N2 = "Schreib meinen Lebenslauf passend zu dieser Stelle um.";

export const GLErgebnis: React.FC = () => {
  const t = useT();
  const lp = prog(t, 0, 0.45);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A" }}>
      <div style={{ position: "absolute", left: 150, top: 90, opacity: lp, transform: `translateY(${(1 - lp) * 40}px)` }}>
        <Paper w={520} title="Lebenslauf" sub="Max Muster · Marketing" rot={-3}>
          <div style={{ position: "absolute", left: 30, top: 300, width: 460, height: 70, border: "6px solid #E53935", borderRadius: 10, opacity: prog(t, 1.4, 1.7) }} />
        </Paper>
      </div>
      <ResultCard
        kicker="CLAUDE · DAS FEHLT DIR"
        rows={[
          ["Diese Wörter aus der Anzeige fehlen", "Projektmanagement · Social Media Ads · Teamführung"],
          ["Das ist zu vage", "„Verantwortlich für Marketing“ sagt nichts. Zahlen und Ergebnisse fehlen."],
          ["So kommst du weiter", "Begriffe aus der Anzeige übernehmen, Erfolge mit Zahlen nennen."],
        ]}
        times={[0.7, 1.2, 1.7]}
      />
    </AbsoluteFill>
  );
};

export const GLPlus: React.FC = () => <PlusUpload thumb={CV} />;

export const GLNachricht1: React.FC = () => (
  <Ask msg={GL_N1} thumb={CV} status="Datei gelesen" typeTo={1.3} sendAt={1.5} camera={[[0, 540, 1560, 1.08], [1.4, 540, 1560, 1.08], [1.85, 540, 860, 1.0], [5, 540, 900, 1.02]]}>
    {(t) => (
      <>
        <AnswerBlock y={500} heading="Diese Wörter aus der Anzeige fehlen" body="" appear={prog(t, 1.9, 2.2)} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 580, opacity: prog(t, 2.1, 2.4) }}>
          <Chip text="Projektmanagement" />
          <Chip text="Social Media Ads" />
          <Chip text="Teamführung" />
          <Chip text="Budgetverantwortung" />
        </div>
        <AnswerBlock y={830} heading="Das passt schon" body="Studium, drei Jahre Berufserfahrung, Englisch fließend." appear={prog(t, 2.5, 2.8)} />
        <RedFrame x={60} y={496} w={960} h={240} at={3.75} />
      </>
    )}
  </Ask>
);

export const GLNeu: React.FC = () => (
  <Ask msg={GL_N2} status="Lebenslauf wird angepasst" typeTo={0.9} sendAt={1.05} camera={[[0, 540, 1560, 1.08], [1.0, 540, 1560, 1.08], [1.45, 540, 900, 1.0], [4.5, 540, 980, 1.04]]}>
    {(t) => {
      const lines = [
        ["Berufserfahrung", true],
        ["Online-Marketing-Managerin · 2023 bis heute", false],
        ["· Projektmanagement für 12 Kampagnen pro Jahr", false],
        ["· Social Media Ads mit 40.000 € Budget pro Quartal", false],
        ["· Teamführung von 3 Werkstudierenden", false],
      ] as [string, boolean][];
      return (
        <>
          <div style={{ position: "absolute", left: 50, right: 50, top: 330, backgroundColor: "#FBFAF6", borderRadius: 22, padding: "44px 46px", opacity: prog(t, 1.4, 1.7), boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
            {lines.map(([l, h], i) => (
              <div key={i} style={{ fontFamily: h ? fonts.bold : fonts.regular, fontSize: h ? 40 : 34, lineHeight: 1.5, color: "#1A1A1A", opacity: prog(t, 1.6 + i * 0.2, 1.8 + i * 0.2) }}>
                {l}
              </div>
            ))}
          </div>
          <RedFrame x={70} y={482} w={940} h={160} at={2.9} />
        </>
      );
    }}
  </Ask>
);

// ---------- H-006 Kühlschrank ----------

const FRIDGE = <div style={{ transform: "scale(1)" }}><Fridge w={90} /></div>;
const GK_N1 = "Mach mir daraus einen Plan für fünf Tage und sag mir, was ich noch kaufen muss.";

export const GKErgebnis: React.FC = () => {
  const t = useT();
  const days: [string, string][] = [
    ["Mo", "Spinat-Omelett mit Feta"],
    ["Di", "Hähnchen-Gemüse-Pfanne"],
    ["Mi", "Paprika-Tomaten-Pasta"],
    ["Do", "Ofengemüse mit Joghurt-Dip"],
    ["Fr", "Gurken-Salat mit Ei"],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A" }}>
      <div style={{ position: "absolute", left: 60, top: 120, opacity: prog(t, 0, 0.4) }}><Fridge w={330} /></div>
      <div style={{ position: "absolute", left: 430, right: 50, top: 120, backgroundColor: "#FFFFFF", borderRadius: 24, padding: "34px 34px", opacity: prog(t, 0.3, 0.6), boxShadow: "0 30px 90px rgba(0,0,0,0.6)" }}>
        <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "#D97757", letterSpacing: 2 }}>DEIN PLAN</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: "#111", margin: "6px 0 14px" }}>5 Tage, 0 Verschwendung</div>
        {days.map(([d, m], i) => (
          <div key={d} style={{ display: "flex", gap: 16, padding: "12px 0", borderTop: "2px solid #EEE", opacity: prog(t, 0.6 + i * 0.25, 0.85 + i * 0.25) }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 30, width: 54, color: "#111" }}>{d}</span>
            <span style={{ fontFamily: fonts.regular, fontSize: 29, color: "#222", flex: 1 }}>{m}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 760, backgroundColor: C.bg, border: `2px solid ${C.panelBorder}`, borderRadius: 26, padding: "30px 36px", opacity: prog(t, 2.0, 2.3) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 36, color: C.text, marginBottom: 12 }}>🛒 Noch kaufen</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 32, color: C.dim, lineHeight: 1.5 }}>Nudeln · Zwiebeln · Knoblauch · Brot</div>
      </div>
    </AbsoluteFill>
  );
};

export const GKPlus: React.FC = () => <PlusUpload thumb={FRIDGE} />;

export const GKNachricht1: React.FC = () => (
  <Ask msg={GK_N1} thumb={FRIDGE} status="Bild gelesen" typeTo={1.6} sendAt={1.8} camera={[[0, 540, 1560, 1.08], [1.7, 540, 1560, 1.08], [2.15, 540, 900, 1.0], [5.5, 540, 930, 1.02]]}>
    {(t) => (
      <>
        <AnswerBlock y={560} heading="Das hab ich erkannt" body="Eier, Feta, Milch, Spinat, Tomaten, Paprika, Hähnchen, Karotten, Butter, Gurke, Joghurt, Zitrone." appear={prog(t, 4.4, 4.7)} />
        <AnswerBlock y={900} heading="Zuerst weg, weil es bald schlecht wird" body="Spinat und Hähnchen am Montag und Dienstag, der Joghurt bis Donnerstag." appear={prog(t, 5.6, 5.9)} />
        <RedFrame x={60} y={896} w={960} h={250} at={6.0} />
      </>
    )}
  </Ask>
);

// ---------- H-007 Datenschutz ----------

const Sidebar: React.FC<{ menuOpen: number; hover?: string }> = ({ menuOpen, hover }) => {
  const items = ["Einstellungen", "Nutzung", "Sprache", "Hilfe", "|", "Tarif upgraden", "Apps und Erweiterungen holen", "Mehr erfahren", "|", "Abmelden"];
  let y = 70;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1080, backgroundColor: "#1F1E1D" }}>
        <div style={{ position: "absolute", left: 60, top: 120, fontFamily: fonts.semibold, fontSize: 52, color: C.text }}>Claude</div>
        {["Neu", "Projekte", "Artifacts", "Geplant", "Anpassungen"].map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 60, top: 240 + i * 82, fontFamily: fonts.regular, fontSize: 40, color: C.dim }}>{l}</div>
        ))}
        <div style={{ position: "absolute", left: 40, right: 40, top: 1640, height: 110, borderRadius: 24, backgroundColor: menuOpen > 0 ? "#33322F" : "#2A2927", display: "flex", alignItems: "center", gap: 24, padding: "0 28px" }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#4A4945", color: C.text, fontFamily: fonts.semibold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>DU</div>
          <span style={{ fontFamily: fonts.medium, fontSize: 40, color: C.text, flex: 1 }}>Dein Name</span>
          <span style={{ fontFamily: fonts.regular, fontSize: 36, color: C.dim }}>⌄</span>
        </div>
      </div>
      {menuOpen > 0 ? (
        <div style={{ position: "absolute", left: 40, width: 760, top: 760, height: 860, backgroundColor: C.menu, border: `2px solid ${C.panelBorder}`, borderRadius: 26, opacity: menuOpen, transform: `translateY(${(1 - menuOpen) * 20}px)`, boxShadow: "0 18px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ position: "absolute", left: 34, top: 26, fontFamily: fonts.regular, fontSize: 32, color: C.faint }}>du@mail.de</div>
          {items.map((l, i) => {
            if (l === "|") {
              y += 26;
              return <div key={i} style={{ position: "absolute", left: 30, right: 30, top: y + 50, height: 2, backgroundColor: C.panelBorder }} />;
            }
            y += 78;
            return (
              <div key={i} style={{ position: "absolute", left: 14, right: 14, top: y, height: 74, borderRadius: 16, backgroundColor: hover === l ? "#33322F" : "transparent", display: "flex", alignItems: "center", padding: "0 22px", fontFamily: fonts.regular, fontSize: 38, color: C.text }}>
                {l}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export const GDMenu: React.FC = () => {
  const t = useT();
  const open = prog(t, 0.6, 0.8);
  const einstY = 760 + 70 + 78;
  return (
    <Camera keys={[[0, 540, 1300, 1.0], [0.5, 420, 1500, 1.2], [1.0, 420, 1100, 1.15], [3, 420, 1100, 1.18]]}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <Sidebar menuOpen={open} hover={t > 1.2 ? "Einstellungen" : undefined} />
        <RedFrame x={54} y={einstY} w={732} h={74} at={1.35} />
        <Cursor keys={[[0, 700, 1300], [0.55, 300, 1695, true], [1.0, 360, 1400], [1.5, 300, einstY + 37, true], [3, 310, einstY + 45]]} />
      </AbsoluteFill>
    </Camera>
  );
};

const SettingsDialog: React.FC<{ section: boolean; toggleOn: boolean; hover?: boolean }> = ({ section, toggleOn, hover }) => {
  const nav = ["Allgemein", "Konto", "Datenschutz", "Abrechnung", "Nutzung", "Funktionen", "Speicher"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#141413" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 200, bottom: 200, backgroundColor: C.bg, border: `2px solid ${C.panelBorder}`, borderRadius: 30 }}>
        <div style={{ position: "absolute", left: 30, top: 40, width: 330 }}>
          <div style={{ fontFamily: fonts.regular, fontSize: 28, color: C.faint, margin: "0 0 18px 18px" }}>Einstellungen</div>
          {nav.map((n) => (
            <div key={n} style={{ height: 72, borderRadius: 14, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: fonts.regular, fontSize: 34, color: C.text, backgroundColor: (section && n === "Datenschutz") || (hover && n === "Datenschutz") ? "#3A3936" : "transparent" }}>{n}</div>
          ))}
        </div>
        {section ? (
          <div style={{ position: "absolute", left: 390, right: 40, top: 50 }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 42, color: C.text }}>Datenschutz</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 26, color: C.dim, marginTop: 14, lineHeight: 1.4 }}>Anthropic steht für transparente Datenpraktiken.</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: C.text, marginTop: 70 }}>Präferenzen</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 34 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.medium, fontSize: 30, color: C.text }}>Standortmetadaten</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 24, color: C.dim, marginTop: 6 }}>Ungefähre Region verwenden …</div>
              </div>
              <Toggle on />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 44 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.medium, fontSize: 30, color: C.text }}>Help improve our AI models</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 24, color: C.dim, marginTop: 6, lineHeight: 1.4 }}>Allow the use of your chats and coding sessions to train and improve Anthropic AI models.</div>
              </div>
              <Toggle on={toggleOn} />
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 92, height: 52, borderRadius: 26, backgroundColor: on ? "#2F7BF6" : "#55534E", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 6, left: on ? 46 : 6, width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff" }} />
  </div>
);

export const GDSchalter: React.FC = () => {
  const t = useT();
  const section = t > 0.9;
  const off = t > 3.9;
  // toggle sits at right edge of the dialog: dialog right = 1040, padding 40 → toggle x ≈ 908..1000, y ≈ 200+50+…
  const tg = { x: 954, y: 644 };
  return (
    <Camera keys={[[0, 300, 560, 1.25], [0.9, 300, 560, 1.25], [1.4, 720, 660, 1.3], [3.5, 720, 660, 1.34]]}>
      <SettingsDialog section={section} toggleOn={!off} hover={t > 0.5} />
      {!section ? <RedFrame x={70} y={200 + 40 + 46 + 2 * 72} w={330} h={72} at={0.45} until={0.9} /> : null}
      {section ? <RedFrame x={420} y={606} w={590} h={132} at={1.9} /> : null}
      <Cursor keys={[[0, 500, 700], [0.6, 220, 200 + 40 + 46 + 2 * 72 + 36, true], [1.4, 800, 900], [3.3, tg.x - 30, tg.y + 40], [3.85, tg.x, tg.y, true], [4.8, tg.x + 10, tg.y + 10]]} />
    </Camera>
  );
};

const Result: React.FC<{ flipAt: number; note: string }> = ({ flipAt, note }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 920, backgroundColor: C.bg, border: `2px solid ${C.panelBorder}`, borderRadius: 30, padding: "50px 50px", marginTop: -200, transform: `scale(${0.94 + 0.06 * prog(t, 0, 0.4)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <ClaudeMark size={60} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: C.text }}>Help improve our AI models</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 64, color: t > flipAt ? "#4CAF50" : "#E57373" }}>{t > flipAt ? "AUS ✓" : "AN"}</div>
          <div style={{ transform: "scale(1.8)", transformOrigin: "right center" }}><Toggle on={t <= flipAt} /></div>
        </div>
        <div style={{ fontFamily: fonts.regular, fontSize: 34, color: C.dim, marginTop: 40, lineHeight: 1.4, opacity: prog(t, 0.3, 0.6) }}>{t > flipAt || flipAt > 50 ? note : ""}</div>
      </div>
    </AbsoluteFill>
  );
};

export const GDAn: React.FC = () => <Result flipAt={99} note="Deine Chats dürfen genutzt werden, um die KI zu trainieren." />;
export const GDErgebnis: React.FC = () => <Result flipAt={0.5} note="Neue Chats werden nicht mehr fürs Training genutzt." />;
