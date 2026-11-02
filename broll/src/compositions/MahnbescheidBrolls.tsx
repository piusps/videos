import React from "react";
import { AvatarSource, Board, Chip, ex, Icon, Place, Pop, RowCard, Split, StatusBadge, Title, useFloat, useT } from "../components/ExplainerKit";
import { fonts } from "../theme";

// "Mahnbescheid" reel (2026-10-03, ersetzt-radar B-033), Explainer style like AbmahnungBrolls.
// cues = seconds from the window start at which the matching spoken words begin. Vision captions sit at
// y 0.5 during B-Roll: full boards keep 880-1060 px free, split boards keep content above ~880 px.
// The letter, sender and amount are invented examples.

export type MbProps = { seconds: number; avatar: AvatarSource; cues: number[] };
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;
const RED = "#E5484D";
const YELLOW = "#F4C430";

const Envelope: React.FC<{ w: number }> = ({ w }) => {
  const s = w / 640;
  return (
    <div style={{ position: "relative", width: w, height: 420 * s, background: YELLOW, borderRadius: 18 * s, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0, borderLeft: `${w / 2}px solid transparent`, borderRight: `${w / 2}px solid transparent`, borderTop: `${190 * s}px solid #E5B520` }} />
      <div style={{ position: "absolute", left: 40 * s, bottom: 40 * s, fontFamily: fonts.bold, fontSize: 40 * s, color: "#3A2E00" }}>Amtsgericht</div>
      <div style={{ position: "absolute", left: 40 * s, bottom: 92 * s, fontFamily: fonts.semibold, fontSize: 26 * s, color: "#5A4A10", letterSpacing: 2 }}>FÖRMLICHE ZUSTELLUNG</div>
      <div style={{ position: "absolute", right: 36 * s, bottom: 36 * s, padding: `${8 * s}px ${16 * s}px`, border: `${4 * s}px solid ${RED}`, color: RED, fontFamily: fonts.bold, fontSize: 28 * s, transform: "rotate(-6deg)", borderRadius: 8 * s }}>MAHNBESCHEID</div>
    </div>
  );
};

// 1 "Claude sagt dir in fünf Minuten, was jetzt zu tun ist."  cues: [Claude, fünf, tun] — full board
export const MbZeit: React.FC<MbProps> = ({ cues }) => {
  const { pop } = useT();
  const f = useFloat(6);
  return (
    <Board>
      <Place top={130}><Title text="In 5 Minuten" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 330 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(0)} from={0.9}><Envelope w={640} /></Pop>
      </div>
      <Place top={1110}><Pop p={pop(at(cues, 1, 0.7))}><Chip text="Claude · 5 Min." icon="clock" big /></Pop></Place>
    </Board>
  );
};

// 2 "Du lädst den Bescheid hoch. Claude erklärt dir, wer was von dir will, und bis wann du reagieren musst."
// cues: [lädst, wer, will, bis] — split
export const MbAnalyse: React.FC<MbProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Claude erklärt" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <Pop p={pop(at(cues, 0, 0.1))} from={0.85}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 26px", background: ex.chip, borderRadius: 18, boxShadow: "0 12px 26px rgba(0,0,0,0.2)" }}>
            <Icon name="file" size={34} color={ex.tileTop} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 34, color: ex.chipText }}>Mahnbescheid.pdf hochgeladen</span>
          </div>
        </Pop>
      </Place>
      <Place top={270}>
        <RowCard rows={["Wer: Muster Versand GmbH", "Was: 1.240 € plus Kosten", "Bis wann: 2 Wochen ab Zustellung"]} at={at(cues, 1, 1.5)} times={[1, 2, 3].map((i) => at(cues, i, 1 + i * 0.9))} width={800} />
      </Place>
    </Split>
  );
};

// 3 "Es prüft, ob die Forderung überhaupt stimmt oder schon verjährt ist, und zeigt dir, wo du im Widerspruch dein Kreuz setzt."
// cues: [prüft, Forderung, verjährt, Kreuz] — split
export const MbPruefung: React.FC<MbProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const cross = ramp(at(cues, 3, 4.2), at(cues, 3, 4.2) + 0.3);
  return (
    <Split split={1} avatar={avatar}>
      <Place top={36}><Title text="Claude prüft" at={-0.15} size={84} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={150}>
        <RowCard rows={["Forderung plausibel?", "Schon verjährt?"]} at={at(cues, 1, 0.6)} times={[at(cues, 1, 0.6), at(cues, 2, 2.2)]} width={800} icon="check" />
      </Place>
      <Place top={430}>
        <Pop p={pop(at(cues, 3, 4.2) - 0.35)} from={0.9}>
          <div style={{ width: 800, background: ex.white, borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.14)", padding: "26px 30px", textAlign: "left" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: ex.ink, marginBottom: 14 }}>Widerspruch</div>
            {["Ich widerspreche dem Anspruch insgesamt.", "Ich widerspreche nur einem Teil."].map((l, i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 0" }}>
                <div style={{ position: "relative", width: 44, height: 44, border: `4px solid ${ex.ink}`, borderRadius: 6 }}>
                  {i === 0 ? (
                    <svg width={44} height={44} viewBox="0 0 44 44" style={{ position: "absolute", left: -4, top: -4 }}>
                      <path d="M8 8 L36 36 M36 8 L8 36" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cross} />
                    </svg>
                  ) : null}
                </div>
                <span style={{ fontFamily: fonts.medium, fontSize: 28, color: ex.ink }}>{l}</span>
              </div>
            ))}
          </div>
        </Pop>
      </Place>
    </Split>
  );
};

// 4 "Verpasst du die Frist, kann am Ende der Gerichtsvollzieher vor der Tür stehen."
// cues: [Verpasst, Frist, Gerichtsvollzieher] — full board
export const MbFrist: React.FC<MbProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(6);
  const fill = ramp(at(cues, 0, 0.1), at(cues, 1, 0.7) + 0.4);
  return (
    <Board>
      <Place top={130}><Title text="Frist verpasst?" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 330 + f, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(0)} from={0.9}>
          <div style={{ width: 760, background: ex.white, borderRadius: 28, boxShadow: "0 22px 50px rgba(0,0,0,0.14)", padding: 30 }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: ex.ink, marginBottom: 18 }}>14 Tage ab Zustellung</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ height: 72, borderRadius: 12, background: i / 14 < fill ? RED : "#EFEFEF", color: i / 14 < fill ? "#fff" : "#9A9A9A", fontFamily: fonts.bold, fontSize: 28, display: "grid", placeItems: "center" }}>{i + 1}</div>
              ))}
            </div>
          </div>
        </Pop>
      </div>
      <div style={{ position: "absolute", top: 1110, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Pop p={pop(at(cues, 2, 1.5))}><Chip text="Danach droht die Vollstreckung" icon="info" big /></Pop>
      </div>
    </Board>
  );
};
