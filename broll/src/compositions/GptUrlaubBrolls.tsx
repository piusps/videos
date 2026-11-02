import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import {
  AnswerBlock,
  C,
  Camera,
  Cursor,
  FileCard,
  InputBox,
  PlaceCard,
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

// @florentgpt · H-017 "So planst du deinen ganzen Urlaub mit Claude"
// (runs/gpt-urlaub-mallorca). Click-path B-Roll in ClaudeKit: exactly what the
// viewer does in Claude (Plus → Websuche → 3 Nachrichten). Answer texts are
// shortened from Claude's real answers of 2026-10-02 (klickpfad/claude-ablauf.md).

const N1 = "Ich will im Mai eine Woche nach Mallorca, Abflug ab Düsseldorf, meine Daten sind flexibel, plus minus drei Tage. Such mir die günstigsten Flugtage.";
const N2 = "Zeig mir ruhige Orte auf Mallorca, wo kaum Touristen sind. Tipps wie von Einheimischen, mit der besten Uhrzeit.";
const N3 = "Mach mir daraus einen Plan für jeden Tag, mit Budget, als PDF.";

const INPUT = { x: 50, y: 1560, w: 980 };

/** 1 · Ergebnis zuerst: the finished day plan (shown right after the hook). */
export const GUErgebnis: React.FC = () => {
  const t = useT();
  const days: [string, string, string][] = [
    ["Tag 1", "Ankunft Palma, Abend in Colònia de Sant Pere", "Mietwagen"],
    ["Tag 2", "Cala Torta, wochentags vor 11 Uhr", "Bucht"],
    ["Tag 3", "Orient und Castell d’Alaró", "Wandern"],
    ["Tag 4", "Galilea zum Sonnenuntergang", "Dorf"],
    ["Tag 5", "Biniaraix-Schlucht, Start vor 9 Uhr", "Wandern"],
    ["Tag 6", "Cala Tuent, früh morgens", "Bucht"],
    ["Tag 7", "Markt in Sineu, Rückflug", "Rückreise"],
  ];
  const s = 0.94 + 0.06 * prog(t, 0, 0.5);
  return (
    <AbsoluteFill style={{ backgroundColor: "#1B1B1A", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1000,
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          padding: "60px 56px",
          boxSizing: "border-box",
          transform: `scale(${s})`,
          boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
          marginTop: -180,
        }}
      >
        <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "#D97757", letterSpacing: 2 }}>DEIN PLAN · BEISPIEL</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 58, color: "#111", marginTop: 10 }}>Mallorca · 7 Tage im Mai</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 30, color: "#555", marginTop: 8 }}>Ruhige Orte, beste Uhrzeiten, Kosten pro Tag</div>
        <div style={{ marginTop: 34 }}>
          {days.map(([d, what, tag], i) => {
            const a = prog(t, 0.3 + i * 0.22, 0.55 + i * 0.22);
            return (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 0", borderTop: "2px solid #EEE", opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 32, color: "#111", width: 112 }}>{d}</span>
                <span style={{ fontFamily: fonts.regular, fontSize: 31, color: "#222", flex: 1 }}>{what}</span>
                <span style={{ fontFamily: fonts.medium, fontSize: 24, color: "#666", backgroundColor: "#F2F2F2", borderRadius: 99, padding: "6px 16px" }}>{tag}</span>
                <span style={{ fontFamily: fonts.bold, fontSize: 34, color: "#2E7D32", opacity: prog(t, 0.6 + i * 0.22, 0.75 + i * 0.22) }}>✓</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 2 · Plus → Websuche (the setup click path). */
export const GUPlus: React.FC = () => {
  const t = useT();
  const plus = { x: INPUT.x + 34 + 35, y: 760 + 34 + 108 + 14 + 35 };
  const menu = { x: 60, y: 1040 };
  const webY = menu.y + menuRowY("Websuche");
  const open = prog(t, 0.6, 0.8);
  const on = t > 1.45;
  return (
    <Camera
      keys={[
        [0, 540, 900, 1.15],
        [0.45, plus.x + 260, plus.y + 120, 1.45],
        [0.95, 460, webY - 120, 1.3],
        [2.6, 460, webY - 120, 1.3],
      ]}
    >
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <StartHeader y={560} />
        <InputBox x={INPUT.x} y={760} w={INPUT.w} plusActive={open > 0} />
        <PlusMenu x={menu.x} y={menu.y} open={open} websucheOn={on} hover={t > 1.1 ? "Websuche" : undefined} />
        <RedFrame x={menu.x + 14} y={webY - 41} w={732} h={82} at={1.55} />
        <Cursor keys={[[0, 640, 1150], [0.5, plus.x, plus.y, true], [0.95, plus.x + 40, plus.y + 60], [1.4, 420, webY, true], [2.6, 430, webY + 6]]} />
      </AbsoluteFill>
    </Camera>
  );
};

const Conversation: React.FC<{
  msg: string;
  typeTo: number;
  sendAt: number;
  status: string;
  children: (t: number) => React.ReactNode;
  camera: [number, number, number, number][];
}> = ({ msg, typeTo, sendAt, status, children, camera }) => {
  const t = useT();
  const sent = t >= sendAt;
  return (
    <Camera keys={camera}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        {sent ? <UserBubble y={120} text={msg} appear={prog(t, sendAt, sendAt + 0.25)} /> : null}
        {sent ? <StatusLine y={120 + 60 + Math.ceil(msg.length / 34) * 52} text={status} appear={prog(t, sendAt + 0.25, sendAt + 0.45)} /> : null}
        {children(t)}
        <InputBox
          x={INPUT.x}
          y={INPUT.y}
          w={INPUT.w}
          placeholder="Schreib eine Nachricht…"
          text={sent ? "" : typed(msg, t, 0.1, typeTo)}
          caret={!sent}
        />
      </AbsoluteFill>
    </Camera>
  );
};

/** 3 · Nachricht 1: Flugtage → "Diese Tage solltest du meiden". */
export const GUNachricht1: React.FC = () => (
  <Conversation
    msg={N1}
    typeTo={1.3}
    sendAt={1.45}
    status="Web durchsucht"
    camera={[
      [0, 540, 1580, 1.08],
      [1.35, 540, 1580, 1.08],
      [1.8, 540, 820, 1.0],
      [5.0, 540, 840, 1.03],
    ]}
  >
    {(t) => (
      <>
        <AnswerBlock
          y={560}
          heading="Diese Tage solltest du meiden"
          body="Christi Himmelfahrt am 6. Mai mit Brückentag-Wochenende, Pfingsten am 16. und 17. Mai und Fronleichnam am 27. Mai. Da steigen die Preise."
          appear={prog(t, 1.9, 2.2)}
        />
        <AnswerBlock
          y={900}
          heading="Am günstigsten wird es wahrscheinlich hier"
          body="Abflug Dienstag oder Mittwoch, in der Woche nach Pfingsten. Samstage und Sonntage sind fast immer am teuersten."
          appear={prog(t, 2.3, 2.6)}
        />
        <RedFrame x={60} y={556} w={960} h={250} at={2.75} />
      </>
    )}
  </Conversation>
);

/** 4 · Nachricht 2: ruhige Orte → Karten mit Uhrzeit. */
export const GUNachricht2: React.FC = () => (
  <Conversation
    msg={N2}
    typeTo={1.2}
    sendAt={1.35}
    status="Web durchsucht"
    camera={[
      [0, 540, 1580, 1.08],
      [1.25, 540, 1580, 1.08],
      [1.7, 540, 860, 1.0],
      [4.8, 540, 860, 1.03],
    ]}
  >
    {(t) => (
      <>
        <PlaceCard x={60} y={470} w={960} title="Cala Torta, Artà" text="Wilde Sandbucht, nur über eine Piste erreichbar. Unter der Woche vormittags bist du fast allein." chips={["Wochentags vor 11 Uhr", "Wasser mitnehmen"]} appear={prog(t, 1.85, 2.15)} />
        <PlaceCard x={60} y={820} w={960} title="Cala Tuent" text="Die ruhige Schwester von Sa Calobra, ohne Ausflugsboote und Busse." chips={["Früh morgens", "Badeschuhe"]} appear={prog(t, 2.25, 2.55)} />
        <PlaceCard x={60} y={1130} w={960} title="Orient" text="Bergdorf mit wenigen Dutzend Einwohnern, mehr Schafe als Menschen." chips={["Unter der Woche", "Zum Mittagessen bleiben"]} appear={prog(t, 2.65, 2.95)} />
        <RedFrame x={92} y={680} w={392} h={58} at={3.15} />
      </>
    )}
  </Conversation>
);

/** 5 · Nachricht 3: Plan als PDF → Datei herunterladen. */
export const GUNachricht3: React.FC = () => {
  return (
    <Conversation
      msg={N3}
      typeTo={0.55}
      sendAt={0.65}
      status="PDF wird erstellt"
      camera={[
        [0, 540, 1580, 1.08],
        [0.6, 540, 1580, 1.08],
        [0.95, 540, 720, 1.0],
        [2.5, 560, 720, 1.05],
      ]}
    >
      {(t) => (
        <>
          <AnswerBlock y={430} body="Hier ist dein Plan für jeden Tag, mit Uhrzeiten und Kosten. Du kannst ihn direkt herunterladen." appear={prog(t, 0.95, 1.2)} />
          <FileCard x={60} y={620} w={960} name="Mallorca-Urlaubsplan.pdf" appear={prog(t, 1.15, 1.4)} />
          <RedFrame x={60} y={620} w={960} h={162} at={1.45} until={1.95} />
          <Cursor showFrom={1.3} keys={[[1.3, 600, 1100], [1.95, 905, 701, true], [2.5, 915, 712]]} />
        </>
      )}
    </Conversation>
  );
};
