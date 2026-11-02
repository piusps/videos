import React from "react";
import {
  AvatarSource, Board, Chip, ex, Icon, IsoTile, Place, Pop, RowCard, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";
import { fonts } from "../theme";

// "Arbeitsvertrag" reel (2026-09-30, ersetzt-radar B-031), Explainer style. cues = seconds from the
// window start at which the matching spoken words begin (from captions.json). During B-Roll the vision
// caption sits centred at y 0.5, so full boards keep 880-1060 px free and split boards keep content
// above ~880 px.

export type AVProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;

const RED = "#E5484D";
const GREY = "#9A9A9A";

// Paper page with a bold title; children render on top in page coordinates.
const Page: React.FC<{ w: number; h: number; title: string; children?: React.ReactNode }> = ({ w, h, title, children }) => (
  <div style={{ position: "relative", width: w, height: h, background: ex.white, borderRadius: 22, boxShadow: "0 24px 60px rgba(0,0,0,0.14)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 44, top: 34, fontFamily: fonts.bold, fontSize: 32, color: ex.ink, letterSpacing: -0.5 }}>{title}</div>
    {children}
  </div>
);

// Grey placeholder text lines.
const Lines: React.FC<{ top: number; n: number; left?: number; widths?: number[] }> = ({ top, n, left = 44, widths = [86, 72, 80, 64] }) => (
  <>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left, top: top + i * 24, height: 10, width: `${widths[i % widths.length]}%`, borderRadius: 5, background: "#E6E6E6" }} />
    ))}
  </>
);

// 1 "Claude hat ihn in zehn Minuten geschrieben."  cues: [Claude, zehn, Minuten] — full board
export const AVRechnung: React.FC<AVProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(6);
  const strike = ramp(at(cues, 1, 0.7), at(cues, 1, 0.7) + 0.25);
  return (
    <Board>
      <Place top={130}><Title text="Die Rechnung" at={-0.15} size={96} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={290 + f}>
        <Pop p={pop(0)} from={0.9}>
          <Page w={800} h={520} title="Kanzlei · Rechnung">
            <Lines top={104} n={3} />
            <div style={{ position: "absolute", left: 44, right: 44, top: 220, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "2px solid #EEE", paddingTop: 26 }}>
              <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: ex.ink }}>Arbeitsvertrag erstellen</span>
              <span style={{ position: "relative", fontFamily: fonts.bold, fontSize: 64, color: ex.ink, letterSpacing: -2 }}>
                600 €
                <span style={{ position: "absolute", left: -8, right: -8, top: "52%", height: 7, borderRadius: 4, background: RED, transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
              </span>
            </div>
            <Lines top={380} n={3} widths={[50, 40, 46]} />
          </Page>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 1110, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 1, 0.7))}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "22px 40px", background: ex.chip, borderRadius: 22, boxShadow: "0 16px 34px rgba(0,0,0,0.24)" }}>
            <Icon name="clock" size={54} color={ex.tileTop} stroke={2.4} />
            <span style={{ fontFamily: fonts.bold, fontSize: 72, color: ex.white, letterSpacing: -2 }}>Claude · 10 Min.</span>
          </div>
        </Pop>
      </div>
    </Board>
  );
};

// 2 "Claude fragt dich zuerst ab, was rein muss. Stelle, Gehalt, Arbeitszeit, Urlaub, Probezeit."
// cues: [fragt, Stelle, Gehalt, Arbeitszeit, Urlaub, Probezeit] — split
export const AVFragen: React.FC<AVProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  const rows = ["Stelle: Bürokraft", "Gehalt: 3.200 € brutto", "Arbeitszeit: 40 Std.", "Urlaub: 28 Tage", "Probezeit: 6 Monate"];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Claude fragt ab" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(at(cues, 0, 0.4))} from={0.85}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 26px", background: ex.chip, borderRadius: 18, borderBottomLeftRadius: 4, boxShadow: "0 12px 26px rgba(0,0,0,0.2)" }}>
            <Icon name="message" size={34} color={ex.tileTop} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: ex.chipText }}>Was soll in den Vertrag?</span>
          </div>
        </Pop>
      </Place>
      <Place top={262}>
        <RowCard rows={rows} at={at(cues, 1, 2.2)} times={[1, 2, 3, 4, 5].map((i) => at(cues, i, 2 + i * 0.6))} width={760} />
      </Place>
    </Split>
  );
};

// 3 "Dann schreibt es den kompletten Vertrag. Mit allen Angaben, die das Gesetz vorschreibt."
// cues: [schreibt, Vertrag, Angaben, Gesetz] — split
export const AVVertrag: React.FC<AVProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const paras = ["§ 1 Tätigkeit und Arbeitsort", "§ 2 Beginn und Probezeit", "§ 3 Arbeitszeit", "§ 4 Vergütung", "§ 5 Urlaub", "§ 6 Kündigung"];
  const write = ramp(at(cues, 0, 0.25), at(cues, 1, 1.3) + 0.2, (x) => x);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Der Vertrag" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(0.02)} from={0.9} y={80}>
          <Page w={860} h={560} title="Arbeitsvertrag">
            {paras.map((t, i) => {
              const p = Math.min(1, Math.max(0, write * paras.length - i));
              const done = pop(at(cues, 2, 2.1) + i * 0.1);
              return (
                <div key={t} style={{ position: "absolute", left: 44, right: 44, top: 100 + i * 74, opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 17, background: ex.active, display: "grid", placeItems: "center", transform: `scale(${Math.min(1.1, done)})` }}>
                      <Icon name="check" size={22} color={ex.white} stroke={3} />
                    </div>
                    <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: ex.ink }}>{t}</span>
                  </div>
                  <div style={{ marginLeft: 48, marginTop: 10, height: 9, width: `${[70, 58, 64, 52, 46, 60][i]}%`, borderRadius: 5, background: "#E6E6E6" }} />
                </div>
              );
            })}
          </Page>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 740, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 3, 2.8))}><StatusBadge text="Alle Pflichtangaben nach Nachweisgesetz" /></Pop>
      </div>
    </Split>
  );
};

// 4 "Es erklärt dir jede Klausel, in einem einzigen Satz. So weißt du genau, was drinsteht."
// cues: [erklärt, Klausel, Satz, drinsteht] — split
export const AVKlausel: React.FC<AVProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const plain = "Heißt: sechs Monate testen, zwei Wochen Kündigungsfrist.";
  const typed = ramp(at(cues, 2, 2.1), at(cues, 2, 2.1) + 0.9, (x) => x);
  const arrow = ramp(at(cues, 1, 0.9) + 0.4, at(cues, 2, 2.1));
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="In einem Satz" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={160}>
        <Pop p={pop(at(cues, 0, 0.2))} from={0.9}>
          <div style={{ width: 860, padding: "26px 30px", background: ex.white, borderRadius: 20, boxShadow: "0 18px 44px rgba(0,0,0,0.12)", border: `3px solid ${ramp(at(cues, 1, 0.9), at(cues, 1, 0.9) + 0.3) > 0.5 ? ex.tileTop : "transparent"}` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 26, color: GREY, marginBottom: 10 }}>§ 2 Beginn und Probezeit</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 27, lineHeight: 1.35, color: ex.ink }}>
              Die ersten sechs Monate des Arbeitsverhältnisses gelten als Probezeit. Während der Probezeit kann das Arbeitsverhältnis von beiden Seiten mit einer Frist von zwei Wochen gekündigt werden.
            </div>
          </div>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 468, left: 530, width: 6, height: 70 * arrow, background: ex.tileTop, borderRadius: 3 }} />
      <Place top={550}>
        <Pop p={pop(at(cues, 2, 2.1) - 0.1)} from={0.85}>
          <div style={{ width: 860, padding: "22px 28px", background: ex.rowCard, border: `4px solid ${ex.tileTop}`, borderRadius: 20, boxShadow: "0 14px 34px rgba(0,0,0,0.12)" }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 36, color: ex.ink, letterSpacing: -0.5 }}>{plain.slice(0, Math.round(plain.length * typed))}</span>
          </div>
        </Pop>
      </Place>
      <div style={{ position: "absolute", top: 760, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 3, 3.3))}><StatusBadge text="Jede Klausel erklärt" /></Pop>
      </div>
    </Split>
  );
};

// 5 "Beim Anwalt, sechshundert Euro. Mit Claude, zehn Minuten."
// cues: [Anwalt, sechshundert, Claude, zehn] — full board
export const AVVergleich: React.FC<AVProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  const Card: React.FC<{ p: number; label: string; value: string; icon: string; hot?: boolean }> = ({ p, label, value, icon, hot }) => (
    <Pop p={p} from={0.8}>
      <div style={{ width: 400, height: 470, borderRadius: 30, background: hot ? ex.rowCard : ex.white, border: `4px solid ${hot ? ex.tileTop : "#DADADA"}`, boxShadow: "0 22px 50px rgba(0,0,0,0.14)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        {hot ? <IsoTile size={150} icon={icon} /> : <div style={{ width: 150, height: 150, borderRadius: 75, background: "#EFEFEF", display: "grid", placeItems: "center" }}><Icon name={icon} size={80} color={GREY} /></div>}
        <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: hot ? ex.ink : GREY }}>{label}</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 88, letterSpacing: -3, color: hot ? ex.tileTop : "#7A7A7A" }}>{value}</div>
      </div>
    </Pop>
  );
  return (
    <Board>
      <div style={{ position: "absolute", top: 300 + f, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 60 }}>
        <Card p={pop(at(cues, 0, 0.35))} label="Anwalt" value="600 €" icon="user" />
        <Card p={pop(at(cues, 2, 2.1))} label="Claude" value="10 Min." icon="bolt" hot />
      </div>
      <Place top={140}><Title text="Pro Arbeitsvertrag" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={1110}><Pop p={pop(at(cues, 3, 2.4) + 0.2)}><Chip text="bei jeder Einstellung" icon="users" big /></Pop></Place>
    </Board>
  );
};

// 2b Click path version of window 2 (user request 2026-09-30 "gerne mit Klickpfad-B-Roll"): a neutral
// chat window (no real product UI), the prompt types into the input, the cursor clicks send, then
// Claude's questions get answered on the spoken words.
// cues: [fragt, Stelle, Gehalt, Arbeitszeit, Urlaub, Probezeit] — split
const Cursor: React.FC<{ x: number; y: number; ring: number }> = ({ x, y, ring }) => (
  <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
    {ring > 0 && ring < 1 && (
      <div style={{ position: "absolute", left: -34 * ring, top: -34 * ring, width: 68 * ring, height: 68 * ring, borderRadius: "50%", border: `4px solid ${ex.tileTop}`, opacity: 1 - ring }} />
    )}
    <svg width={34} height={51} viewBox="0 0 20 30" style={{ overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.35))" }}>
      <path d="M1 1 L1 23 L6.5 17.8 L10.3 27 L14 25.4 L10.3 16.6 L17.8 16.6 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  </div>
);

export const AVKlickpfad: React.FC<AVProps> = ({ avatar, cues }) => {
  const { pop, ramp, t } = useT();
  const prompt = "Erstelle mir einen Arbeitsvertrag.";
  const sendAt = 1.0;
  const typed = ramp(0.1, sendAt - 0.15, (x) => x);
  const sent = t >= sendAt;
  const move = ramp(0.35, sendAt - 0.05);
  const cx = 880 + (866 - 880) * move;
  const cy = 820 + (648 - 820) * move;
  const ring = ramp(sendAt, sendAt + 0.4, (x) => x);
  const cursorOut = ramp(sendAt + 0.5, sendAt + 0.9);
  const answers = [["Stelle", "Bürokraft"], ["Gehalt", "3.200 € brutto"], ["Arbeitszeit", "40 Std./Woche"], ["Urlaub", "28 Tage"], ["Probezeit", "6 Monate"]];
  return (
    <Split split={1} avatar={avatar}>
      <div style={{ position: "absolute", left: 90, top: 40, width: 900, height: 690, background: ex.white, borderRadius: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.16)", overflow: "hidden" }}>
        <div style={{ height: 64, borderBottom: "2px solid #F0F0F0", display: "flex", alignItems: "center", gap: 12, padding: "0 26px" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
          <span style={{ marginLeft: 14, fontFamily: fonts.semibold, fontSize: 24, color: GREY }}>Projekt · Arbeitsverträge</span>
        </div>
        <div style={{ position: "absolute", left: 26, right: 26, top: 84, display: "flex", flexDirection: "column", gap: 12 }}>
          {sent && (
            <Pop p={pop(sendAt)} from={0.9} y={14} style={{ alignSelf: "flex-end" }}>
              <div style={{ padding: "14px 22px", borderRadius: 18, borderBottomRightRadius: 4, background: "#F1ECE4", fontFamily: fonts.medium, fontSize: 28, color: ex.ink }}>{prompt}</div>
            </Pop>
          )}
          <Pop p={pop(Math.max(sendAt + 0.3, at(cues, 0, 0.45)))} from={0.9} y={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: ex.tileTop, display: "grid", placeItems: "center" }}><Icon name="bolt" size={24} color={ex.white} /></div>
              <span style={{ fontFamily: fonts.medium, fontSize: 28, color: ex.ink }}>Gern. Ich brauche fünf Angaben:</span>
            </div>
          </Pop>
          <div style={{ marginLeft: 52, display: "flex", flexDirection: "column", gap: 8 }}>
            {answers.map(([k, v], i) => {
              const p = pop(at(cues, i + 1, 2 + i * 0.6));
              return (
                <div key={k} style={{ maxHeight: 60 * Math.min(1, p * 1.5), overflow: "visible" }}>
                  <Pop p={p} from={0.9} y={10}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderRadius: 14, background: "#FAFAFA", border: "2px solid #EFEFEF" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 15, background: ex.active, display: "grid", placeItems: "center" }}><Icon name="check" size={20} color={ex.white} stroke={3} /></div>
                      <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY, width: 170 }}>{k}</span>
                      <span style={{ fontFamily: fonts.bold, fontSize: 30, color: ex.ink }}>{v}</span>
                    </div>
                  </Pop>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, height: 76, borderRadius: 20, border: `2px solid ${typed > 0 && !sent ? ex.tileTop : "#E4E4E4"}`, display: "flex", alignItems: "center", padding: "0 12px 0 24px" }}>
          <span style={{ flex: 1, fontFamily: fonts.medium, fontSize: 28, color: sent ? "#B5B5B5" : ex.ink }}>
            {sent ? "Antworten …" : prompt.slice(0, Math.round(prompt.length * typed)) + (t % 0.6 < 0.3 ? "|" : "")}
          </span>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: sent ? "#E4E4E4" : ex.tileTop, display: "grid", placeItems: "center", transform: `scale(${ring > 0 && ring < 0.4 ? 0.9 : 1})` }}>
            <svg width={26} height={26} viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
      {cursorOut < 1 && <div style={{ opacity: 1 - cursorOut }}><Cursor x={cx} y={cy} ring={ring} /></div>}
    </Split>
  );
};
