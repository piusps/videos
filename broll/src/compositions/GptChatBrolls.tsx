import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts } from "../theme";
import { Camera, RedFrame, prog, typed, useT } from "../components/ClaudeKit";
import { Logo } from "../components/PanelKit";

// @florentgpt · "Schick Claude euren WhatsApp-Chat, es sagt dir, wer schuld ist" (runs/gpt-chat, 2026-10-06).
// v2 (Pius 2026-10-06): light Claude branding (cream/white/orange) instead of the dark claude.ai rebuild,
// real logos, and the real (light iOS) WhatsApp UI: wallpaper, white/green bubbles, grouped contact info,
// iOS action sheet. Names are placeholders (Person A / B); every chat line and finding is an invented example.

const L = { bg: "#FAF9F5", card: "#FFFFFF", line: "#E8E6DC", text: "#141413", dim: "#73726C", orange: "#D97757", green: "#2E9E5B" };
const WA = { wall: "#EFE7DE", head: "#F6F6F6", them: "#FFFFFF", me: "#D9FDD3", text: "#111B21", dim: "#667781", tick: "#53BDEB", ios: "#F2F2F7", blue: "#007AFF", red: "#FF3B30", green: "#25D366" };

export type GCtProps = { seconds?: number };

/** Faint WhatsApp wallpaper doodle: scattered soft dots on the beige wall. */
const Wall: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: WA.wall, backgroundImage: "radial-gradient(rgba(0,0,0,0.035) 3px, transparent 3px)", backgroundSize: "46px 46px" }} />
);

const Bubble: React.FC<{ me?: boolean; y: number; text: string; a: number; time?: string }> = ({ me, y, text, a, time = "22:41" }) => (
  <div style={{ position: "absolute", top: y, left: me ? 230 : 36, right: me ? 36 : 230, display: "flex", justifyContent: me ? "flex-end" : "flex-start", opacity: a, transform: `translateY(${(1 - a) * 16}px) scale(${0.97 + 0.03 * a})`, transformOrigin: me ? "100% 0" : "0 0" }}>
    <div style={{ background: me ? WA.me : WA.them, color: WA.text, borderRadius: 24, borderTopRightRadius: me ? 6 : 24, borderTopLeftRadius: me ? 24 : 6, padding: "16px 24px 10px", fontFamily: fonts.regular, fontSize: 38, lineHeight: 1.3, boxShadow: "0 2px 3px rgba(0,0,0,0.10)" }}>
      {text}
      <div style={{ textAlign: "right", fontSize: 22, color: WA.dim, marginTop: 4 }}>{time}{me ? <span style={{ color: WA.tick, marginLeft: 8 }}>✓✓</span> : null}</div>
    </div>
  </div>
);

const Avatar: React.FC<{ size: number; label?: string }> = ({ size, label = "B" }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: "linear-gradient(135deg,#B7C4CC,#8FA1AB)", color: "#fff", fontFamily: fonts.bold, fontSize: size * 0.42, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{label}</div>
);

/** iOS WhatsApp chat header: back arrow, avatar, name, call icons. */
const WaHeader: React.FC<{ highlight?: boolean }> = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 230, background: WA.head, borderBottom: "1px solid #D9D9D9", display: "flex", alignItems: "flex-end", padding: "0 34px 26px", gap: 22, boxSizing: "border-box" }}>
    <span style={{ fontFamily: fonts.regular, fontSize: 64, color: WA.blue, lineHeight: 1 }}>‹</span>
    <Avatar size={84} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 42, color: WA.text }}>Person B</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 26, color: WA.dim }}>tippe hier für Kontaktinfo</div>
    </div>
    <span style={{ fontSize: 44, color: WA.blue }}>📹</span>
    <span style={{ fontSize: 44, color: WA.blue }}>📞</span>
  </div>
);

/** Light Claude input box with the "+" button and the orange send arrow. */
const ClaudeInput: React.FC<{ y: number; text?: string; caret?: boolean; plusOn?: boolean; file?: number }> = ({ y, text = "", caret, plusOn, file = 0 }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, background: L.card, border: `2px solid ${L.line}`, borderRadius: 34, padding: "26px 30px 22px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      {file > 0 ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: L.bg, border: `2px solid ${L.line}`, borderRadius: 18, padding: "12px 20px", marginBottom: 18, opacity: file, transform: `scale(${0.9 + 0.1 * file})`, transformOrigin: "0 50%" }}>
          <Logo name="whatsapp" size={56} />
          <div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: L.text }}>Chat mit Person B.txt</div>
            <div style={{ fontFamily: fonts.regular, fontSize: 22, color: L.dim }}>412 Nachrichten · TXT</div>
          </div>
        </div>
      ) : null}
      <div style={{ minHeight: 56, fontFamily: fonts.regular, fontSize: 38, lineHeight: 1.35, color: text ? L.text : "#A8A69E" }}>
        {text || "Wie kann ich helfen?"}
        {caret ? <span style={{ color: L.orange, opacity: Math.floor(t * 3) % 2 ? 1 : 0 }}>|</span> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
        <div style={{ width: 66, height: 66, borderRadius: 18, border: `2px solid ${L.line}`, background: plusOn ? "#F0EEE6" : L.card, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.regular, fontSize: 46, color: L.text }}>+</div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: fonts.regular, fontSize: 28, color: L.dim, marginRight: 22 }}>Sonnet 4.5 ⌄</span>
        <div style={{ width: 66, height: 66, borderRadius: 18, background: text ? L.orange : "#E8C2B4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 38 }}>↑</div>
      </div>
    </div>
  );
};

const ClaudeTop: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
    <Logo name="claude" size={74} tile={false} />
    <span style={{ fontFamily: fonts.semibold, fontSize: 48, color: L.text, letterSpacing: -1 }}>Claude</span>
  </div>
);

/** 1 · Right after the hook: Claude's verdict card, "unangenehm ehrlich". */
export const GCtErgebnis: React.FC<GCtProps> = () => {
  const t = useT();
  const card = prog(t, 0, 0.3);
  const rows: [string, string, string, number][] = [
    ["↩︎", "Zieht sich zurück", "Person A · 14 Antworten nur „ok“", 0.45],
    ["⚡", "Fängt Streit an", "Person B · Vorwürfe ab 22:41", 0.75],
    ["💬", "Zwischen den Zeilen", "Beide fühlen sich nicht gesehen", 1.05],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: L.bg }}><Camera bg={L.bg} keys={[[0, 540, 960, 1.05], [2, 540, 960, 1.0]]}>
      <AbsoluteFill style={{ backgroundColor: L.bg }}>
        <ClaudeTop />
        <div style={{ position: "absolute", left: 50, right: 50, top: 300, height: 1180, backgroundColor: L.card, border: `2px solid ${L.line}`, borderRadius: 36, boxShadow: "0 24px 60px rgba(0,0,0,0.08)", opacity: card, transform: `scale(${0.96 + 0.04 * card})` }} />
        <div style={{ position: "absolute", left: 100, top: 350, display: "flex", alignItems: "center", gap: 14, opacity: card }}>
          <Logo name="whatsapp" size={50} />
          <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: L.orange, letterSpacing: 2 }}>CHAT-ANALYSE</span>
        </div>
        <div style={{ position: "absolute", left: 100, top: 420, fontFamily: fonts.bold, fontSize: 66, color: L.text, letterSpacing: -1.5, opacity: card }}>Wer ist schuld?</div>
        {rows.map(([ic, h, d, at], i) => {
          const a = prog(t, at, at + 0.25);
          return (
            <div key={h} style={{ position: "absolute", left: 100, right: 100, top: 570 + i * 220, display: "flex", gap: 26, alignItems: "center", opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
              <div style={{ width: 88, height: 88, borderRadius: 24, background: "#FBEDE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: L.orange, flexShrink: 0 }}>{ic}</div>
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 44, color: L.text }}>{h}</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 32, color: L.dim, marginTop: 6 }}>{d}</div>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 100, right: 100, top: 1290, height: 110, borderRadius: 24, background: "#E9F6EE", display: "flex", alignItems: "center", padding: "0 30px", boxSizing: "border-box", fontFamily: fonts.bold, fontSize: 38, color: L.green, opacity: prog(t, 1.35, 1.6) }}>Schuld: beide, aber anders als du denkst</div>
        <RedFrame x={84} y={1276} w={912} h={138} at={1.45} />
      </AbsoluteFill>
    </Camera></AbsoluteFill>
  );
};

/** 2 · WhatsApp click path (light iOS UI): chat → tap the name → "Chat exportieren" → "Ohne Medien". */
export const GCtExport: React.FC<GCtProps & { nameAt?: number; exportAt?: number; mediaAt?: number }> = ({ nameAt = 1.9, exportAt = 2.75, mediaAt = 3.45 }) => {
  const t = useT();
  const info = prog(t, nameAt + 0.1, nameAt + 0.4);
  const sheet = prog(t, exportAt + 0.15, exportAt + 0.4);
  const groups: [string, string, string?][][] = [
    [["🖼️", "Medien, Links und Doks", "128"], ["⭐", "Mit Stern markiert", "Keine"]],
    [["🔔", "Benachrichtigungen"], ["🎨", "Chat-Design"]],
    [["⬆️", "Chat exportieren"], ["🗑️", "Chat leeren"]],
  ];
  let gy = 640;
  return (
    <AbsoluteFill>
      <Wall />
      <WaHeader />
      <RedFrame x={110} y={140} w={430} h={90} at={nameAt - 0.3} until={nameAt + 0.3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center" }}>
        <span style={{ background: "#FFFFFFCC", borderRadius: 14, padding: "8px 20px", fontFamily: fonts.medium, fontSize: 26, color: WA.dim }}>Gestern</span>
      </div>
      <Bubble y={350} text="Du meldest dich halt nie zuerst." a={prog(t, 0, 0.2)} />
      <Bubble me y={510} text="ok" a={prog(t, 0.15, 0.35)} />
      <Bubble y={640} text="Genau das meine ich." a={prog(t, 0.3, 0.5)} />
      <Bubble me y={800} text="Ich hatte einfach viel zu tun" a={prog(t, 0.45, 0.65)} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: WA.head, borderTop: "1px solid #D9D9D9", display: "flex", alignItems: "center", padding: "0 30px", gap: 22, boxSizing: "border-box" }}>
        <span style={{ fontSize: 50, color: WA.blue }}>＋</span>
        <div style={{ flex: 1, height: 76, borderRadius: 38, background: "#fff", border: "1px solid #D9D9D9" }} />
        <span style={{ fontSize: 44 }}>🎤</span>
      </div>
      {/* contact info (iOS grouped list) */}
      <div style={{ position: "absolute", inset: 0, background: WA.ios, opacity: info > 0 ? 1 : 0, transform: `translateX(${(1 - info) * 1080}px)` }}>
        <div style={{ position: "absolute", left: 34, top: 110, fontFamily: fonts.regular, fontSize: 40, color: WA.blue }}>‹ Zurück</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar size={220} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 56, color: WA.text, marginTop: 24 }}>Person B</div>
          <div style={{ fontFamily: fonts.regular, fontSize: 32, color: WA.dim, marginTop: 6 }}>+49 ••• ••••••</div>
        </div>
        {groups.map((g, gi) => {
          const top = gy;
          gy += g.length * 112 + 44;
          return (
            <div key={gi} style={{ position: "absolute", left: 34, right: 34, top, background: "#fff", borderRadius: 24, overflow: "hidden" }}>
              {g.map(([ic, r, v], i) => (
                <div key={r} style={{ height: 112, display: "flex", alignItems: "center", gap: 24, padding: "0 30px", borderTop: i ? "1px solid #E5E5EA" : "none", fontFamily: fonts.regular, fontSize: 40, color: r === "Chat leeren" ? WA.red : WA.text }}>
                  <span style={{ fontSize: 38, width: 48, textAlign: "center" }}>{ic}</span>
                  <span style={{ flex: 1 }}>{r}</span>
                  {v ? <span style={{ color: WA.dim, fontSize: 34 }}>{v}</span> : null}
                  {r !== "Chat leeren" ? <span style={{ color: "#C7C7CC", fontSize: 44 }}>›</span> : null}
                </div>
              ))}
            </div>
          );
        })}
        <RedFrame x={26} y={640 + 2 * 112 + 44 + 2 * 112 + 44 - 8} w={1028} h={128} at={exportAt - 0.3} until={exportAt + 0.4} />
      </div>
      {/* iOS action sheet */}
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.35 * sheet})` }} />
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 60, opacity: sheet > 0 ? 1 : 0, transform: `translateY(${(1 - sheet) * 900}px)` }}>
        <div style={{ background: "rgba(249,249,249,0.97)", borderRadius: 30, overflow: "hidden" }}>
          <div style={{ padding: "30px 40px", fontFamily: fonts.regular, fontSize: 28, color: "#8E8E93", textAlign: "center" }}>Wenn du Medien anhängst, wird der exportierte Chat größer.</div>
          {["Medien anhängen", "Ohne Medien"].map((o) => (
            <div key={o} style={{ borderTop: "1px solid #D1D1D6", height: 124, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.regular, fontSize: 44, color: WA.blue }}>{o}</div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 30, marginTop: 16, height: 124, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.semibold, fontSize: 44, color: WA.blue }}>Abbrechen</div>
      </div>
      <RedFrame x={30} y={1920 - 60 - 124 - 16 - 124} w={1020} h={124} at={mediaAt - 0.2} />
    </AbsoluteFill>
  );
};

/** 3 · Claude (light): tap the Plus, "Datei hochladen", the exported chat lands in the input. */
export const GCtUpload: React.FC<GCtProps & { plusAt?: number; fileAt?: number }> = ({ plusAt = 1.7, fileAt = 2.4 }) => {
  const t = useT();
  const menu = prog(t, plusAt + 0.05, plusAt + 0.25) * (1 - prog(t, fileAt, fileAt + 0.15));
  const items: [string, string][] = [["📎", "Datei hochladen"], ["📷", "Screenshot machen"], ["📁", "Zum Projekt hinzufügen"], ["🌐", "Websuche"]];
  return (
    <AbsoluteFill style={{ backgroundColor: L.bg }}><Camera bg={L.bg} keys={[[0, 540, 1300, 1.06], [fileAt, 540, 1300, 1.0]]}>
      <AbsoluteFill style={{ backgroundColor: L.bg }}>
        <ClaudeTop />
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Logo name="claude" size={110} tile={false} />
          <div style={{ fontFamily: "Georgia, serif", fontSize: 72, color: L.text }}>Guten Abend</div>
        </div>
        <ClaudeInput y={1380} plusOn={t > plusAt && t < fileAt + 0.2} file={prog(t, fileAt + 0.1, fileAt + 0.35)} />
        <RedFrame x={58} y={1380 + 26 + 56 + 14 + 26 - 8} w={84} h={84} at={plusAt - 0.25} until={plusAt + 0.3} />
        {menu > 0 ? (
          <div style={{ position: "absolute", left: 40, top: 960, width: 720, background: L.card, border: `2px solid ${L.line}`, borderRadius: 28, padding: "14px 0", boxShadow: "0 20px 50px rgba(0,0,0,0.12)", opacity: menu, transform: `translateY(${(1 - menu) * 20}px)` }}>
            {items.map(([ic, m]) => (
              <div key={m} style={{ height: 88, display: "flex", alignItems: "center", gap: 22, padding: "0 32px", fontFamily: fonts.regular, fontSize: 38, color: L.text }}>
                <span style={{ fontSize: 36 }}>{ic}</span>{m}
              </div>
            ))}
          </div>
        ) : null}
        <RedFrame x={46} y={972} w={708} h={92} at={plusAt + 0.3} until={fileAt + 0.1} />
      </AbsoluteFill>
    </Camera></AbsoluteFill>
  );
};

const N1 = "Antworte wie ein neutraler Paartherapeut: Wer zieht sich zurück, wer fängt Streit an, und was steht zwischen den Zeilen?";

/** 4 · The trick: the therapist message gets typed and sent, the analysis streams with red frames. */
export const GCtTrick: React.FC<GCtProps & { typeTo?: number; sendAt?: number; marks?: number[] }> = ({ typeTo = 2.3, sendAt = 2.5, marks = [3.7, 4.4, 6.0] }) => {
  const t = useT();
  const sent = t >= sendAt;
  const items: [string, string][] = [
    ["Wer zieht sich zurück?", "Du. Auf drei lange Nachrichten antwortest du mit „ok“. Für B wirkt das wie Desinteresse."],
    ["Wer fängt Streit an?", "B, aber erst nachdem zwei Tage keine Antwort kam."],
    ["Zwischen den Zeilen", "B will nicht recht haben, sondern wissen, dass du an sie denkst."],
  ];
  const y0 = 600;
  return (
    <AbsoluteFill style={{ backgroundColor: L.bg }}><Camera bg={L.bg} keys={[[0, 540, 1500, 1.08], [sendAt - 0.1, 540, 1500, 1.08], [sendAt + 0.35, 540, 900, 1.0], [sendAt + 5, 540, 1000, 1.03]]}>
      <AbsoluteFill style={{ backgroundColor: L.bg }}>
        <ClaudeTop />
        {sent ? (
          <>
            <div style={{ position: "absolute", right: 40, top: 240, width: 820, background: "#F0EEE6", borderRadius: 30, padding: "24px 30px", fontFamily: fonts.regular, fontSize: 34, lineHeight: 1.35, color: L.text, opacity: prog(t, sendAt, sendAt + 0.25) }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: "8px 14px", marginBottom: 12 }}><Logo name="whatsapp" size={36} tile={false} /><span style={{ fontSize: 24, color: L.dim }}>Chat mit Person B.txt</span></div>
              <div>{N1}</div>
            </div>
            <div style={{ position: "absolute", left: 50, top: y0 - 70, display: "flex", alignItems: "center", gap: 14, opacity: prog(t, sendAt + 0.25, sendAt + 0.45) }}>
              <Logo name="claude" size={44} tile={false} />
              <span style={{ fontFamily: fonts.regular, fontSize: 28, color: L.dim }}>412 Nachrichten gelesen</span>
            </div>
            {items.map(([h, b], i) => {
              const a = prog(t, marks[i] - 0.35, marks[i] - 0.1);
              return (
                <div key={h} style={{ position: "absolute", left: 60, right: 60, top: y0 + i * 290, opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
                  <div style={{ fontFamily: fonts.bold, fontSize: 42, color: L.text, marginBottom: 10 }}>{h}</div>
                  <div style={{ fontFamily: fonts.regular, fontSize: 36, lineHeight: 1.4, color: "#3D3D3A" }}>{b}</div>
                </div>
              );
            })}
            {marks.map((m, i) => <RedFrame key={i} x={40} y={y0 + i * 290 - 16} w={1000} h={232} at={m} until={i < 2 ? marks[i + 1] - 0.1 : undefined} />)}
          </>
        ) : null}
        <ClaudeInput y={sent ? 1560 : 1380} text={sent ? "" : typed(N1, t, 0.1, typeTo)} caret={!sent} file={sent ? 0 : 1} />
      </AbsoluteFill>
    </Camera></AbsoluteFill>
  );
};

/** 5 · The one message that fixes it, typed into the real WhatsApp chat and sent. */
export const GCtNachricht: React.FC<GCtProps & { msgAt?: number }> = ({ msgAt = 1.3 }) => {
  const t = useT();
  const msg = "Hey, ich war die letzten Tage echt kurz angebunden. Das lag nicht an dir. Lass uns heute Abend telefonieren? ❤️";
  const sentAt = msgAt + 1.25;
  const n = typed(msg, t, msgAt, msgAt + 1.2);
  return (
    <AbsoluteFill>
      <Wall />
      <WaHeader />
      <div style={{ position: "absolute", left: 40, right: 40, top: 270, display: "flex", alignItems: "center", gap: 14, background: "#FFF6F1", border: `2px solid #F3D3C4`, borderRadius: 22, padding: "16px 22px", opacity: prog(t, 0, 0.25) }}>
        <Logo name="claude" size={44} tile={false} />
        <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: L.orange }}>Vorschlag von Claude für deine nächste Nachricht</span>
      </div>
      <Bubble y={420} text="Du meldest dich halt nie zuerst." a={prog(t, 0.2, 0.4)} />
      {t > sentAt ? <Bubble me y={580} text={msg} a={prog(t, sentAt, sentAt + 0.2)} time="jetzt" /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 170, background: WA.head, borderTop: "1px solid #D9D9D9", display: "flex", alignItems: "center", padding: "22px 30px", gap: 22, boxSizing: "border-box" }}>
        <span style={{ fontSize: 50, color: WA.blue }}>＋</span>
        <div style={{ flex: 1, minHeight: 76, borderRadius: 38, background: "#fff", border: "1px solid #D9D9D9", padding: "16px 28px", boxSizing: "border-box", fontFamily: fonts.regular, fontSize: 34, color: WA.text }}>{t > sentAt ? "" : n}</div>
        <div style={{ width: 76, height: 76, borderRadius: 38, background: WA.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 36 }}>➤</div>
      </div>
      <RedFrame x={210} y={560} w={850} h={290} at={sentAt + 0.25} />
    </AbsoluteFill>
  );
};
