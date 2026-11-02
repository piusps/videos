import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { fonts } from "../theme";
import { C, Camera, Cursor, InputBox, PlusMenu, RedFrame, StartHeader, menuRowY, prog, typed, useT } from "../components/ClaudeKit";
import { Ask, INPUT } from "./GptBatchBrolls";
import { Browser, PlainSite, PremiumSite, SkeletonSite } from "../components/LovableSite";

// @florentgpt · H-020 "Claude mit Lovable verbinden" (runs/gpt-lovable, 2026-10-05, Pius' topic).
// Click path from Lovable's docs (docs.lovable.dev/integrations/lovable-mcp-server): in Claude
// "+" → Konnektoren → search "Lovable" → Verbinden → log in to Lovable. The café, its texts and
// the preview URL are invented examples; nothing here is a real customer site.

const GLOW: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 80 + 60 * Math.sin(t * 0.9), top: 260, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,157,0.35), rgba(255,107,157,0))" }} />
    <div style={{ position: "absolute", left: 360 - 50 * Math.sin(t * 0.7), top: 700, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.33), rgba(139,92,246,0))" }} />
    <div style={{ position: "absolute", left: 200, top: 1050 + 40 * Math.cos(t), width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,138,61,0.28), rgba(255,138,61,0))" }} />
  </>
);

const Tick: React.FC<{ x: number; y: number; text: string; a: number }> = ({ x, y, text, a }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, backgroundColor: "rgba(20,18,16,0.82)", border: "1px solid rgba(255,255,255,0.14)", fontFamily: fonts.semibold, fontSize: 30, color: "#FFF", opacity: a, transform: `translateY(${(1 - a) * 20}px) scale(${0.9 + 0.1 * a})`, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}>
    <span style={{ color: "#4ADE80" }}>✓</span>{text}
  </div>
);

/** 1 · Result first: the polished site tilts into frame and scrolls itself. */
export const GLvErgebnis: React.FC = () => {
  const t = useT();
  const inP = prog(t, 0, 0.6);
  const rot = interpolate(inP, [0, 1], [22, 6]);
  const scroll = prog(t, 0.6, 1.8) * 0.58;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0C0B", overflow: "hidden" }}>
      <GLOW t={t} />
      <div style={{ position: "absolute", left: 70, top: 300, perspective: 1800 }}>
        <div style={{ transform: `rotateX(${rot}deg) rotateY(${-rot * 0.5}deg) scale(${0.86 + 0.14 * inP})`, opacity: inP, transformOrigin: "50% 40%" }}>
          <Browser w={940} h={1080}><PremiumSite scroll={scroll} /></Browser>
        </div>
      </div>
      <Tick x={600} y={250} text="Speisekarte" a={prog(t, 0.7, 0.95)} />
      <Tick x={40} y={1330} text="Reservierung" a={prog(t, 0.95, 1.2)} />
      <Tick x={560} y={1420} text="Handy-optimiert" a={prog(t, 1.2, 1.45)} />
    </AbsoluteFill>
  );
};

export const GLvKonnektor: React.FC<{ seconds?: number; pickAt?: number; typeFrom?: number; connectAt?: number }> = ({ pickAt = 1.1, typeFrom = 1.6, connectAt = 3.1 }) => {
  const t = useT();
  const plus = { x: INPUT.x + 34 + 35, y: 760 + 34 + 108 + 14 + 35 };
  const menu = { x: 60, y: 1040 };
  const rowY = menu.y + menuRowY("Konnektoren");
  const open = t < pickAt + 0.3 ? prog(t, 0.4, 0.6) : 1 - prog(t, pickAt + 0.3, pickAt + 0.45);
  const panel = prog(t, pickAt + 0.35, pickAt + 0.6);
  const found = prog(t, typeFrom + 0.7, typeFrom + 0.95);
  const on = t >= connectAt;
  const btn = { x: 831, y: 633 }; // centre of the Verbinden button
  return (
    <Camera keys={[[0, 540, 900, 1.15], [0.35, plus.x + 260, plus.y + 120, 1.4], [pickAt - 0.2, 460, rowY - 100, 1.3], [pickAt + 0.5, 540, 700, 1.04], [connectAt + 1.5, 540, 680, 1.06]]}>
      <AbsoluteFill style={{ backgroundColor: C.bg }}>
        <StartHeader y={560} />
        <InputBox x={INPUT.x} y={760} w={INPUT.w} plusActive={open > 0} />
        <PlusMenu x={menu.x} y={menu.y} open={open} websucheOn={false} hover={t > pickAt - 0.35 ? "Konnektoren" : undefined} />
        <RedFrame x={menu.x + 14} y={rowY - 41} w={732} h={82} at={pickAt - 0.25} until={pickAt + 0.3} />
        {panel > 0 ? (
          <div style={{ position: "absolute", left: 50, right: 50, top: 300, height: 760, backgroundColor: C.menu, border: `2px solid ${C.panelBorder}`, borderRadius: 30, opacity: panel, transform: `translateY(${(1 - panel) * 24}px)`, padding: 40, boxSizing: "border-box" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 44, color: C.text }}>Konnektoren durchsuchen</div>
            <div style={{ marginTop: 28, height: 84, borderRadius: 18, border: `2px solid ${C.panelBorder}`, display: "flex", alignItems: "center", padding: "0 26px", fontFamily: fonts.regular, fontSize: 36, color: t > typeFrom ? C.text : C.faint }}>
              🔍&nbsp;&nbsp;{t > typeFrom ? typed("Lovable", t, typeFrom, typeFrom + 0.6) : "Suchen…"}
            </div>
            <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 26, padding: 26, borderRadius: 22, backgroundColor: C.panel, opacity: found, transform: `translateY(${(1 - found) * 16}px)` }}>
              <div style={{ width: 96, height: 96, borderRadius: 22, background: "linear-gradient(135deg,#FF6B9D,#FF8A3D 55%,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>♥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.text }}>Lovable</div>
                <div style={{ fontFamily: fonts.regular, fontSize: 28, color: C.dim, marginTop: 4 }}>Apps und Websites bauen und veröffentlichen</div>
              </div>
              <div style={{ padding: "16px 28px", borderRadius: 16, fontFamily: fonts.semibold, fontSize: 32, color: on ? "#4CAF50" : "#111", backgroundColor: on ? "transparent" : C.text, border: on ? "2px solid #4CAF50" : "none" }}>{on ? "Verbunden ✓" : "Verbinden"}</div>
            </div>
            <div style={{ marginTop: 26, fontFamily: fonts.regular, fontSize: 28, color: C.faint, opacity: prog(t, connectAt + 0.2, connectAt + 0.5) }}>Bei Lovable angemeldet · Claude darf jetzt Projekte bauen</div>
          </div>
        ) : null}
        <RedFrame x={btn.x - 125} y={btn.y - 48} w={250} h={96} at={connectAt + 0.15} />
        <Cursor keys={[[0, 640, 1150], [0.4, plus.x, plus.y, true], [pickAt - 0.3, 440, rowY], [pickAt, 440, rowY, true], [typeFrom - 0.2, 400, 450, true], [connectAt - 0.4, btn.x, btn.y + 10], [connectAt, btn.x, btn.y + 10, true], [connectAt + 1.5, btn.x + 30, btn.y + 50]]} />
      </AbsoluteFill>
    </Camera>
  );
};

const N1 = "Bau mir in Lovable eine Website für mein Café in Köln, modern, mit Speisekarte und Kontaktformular.";
const N2 = "Mach das Design hochwertiger, ruhiger, mit großen Bildern, und stell die Seite online.";

const ToolCard: React.FC<{ y: number; title: string; sub: string; appear: number }> = ({ y, title, sub, appear }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", alignItems: "center", gap: 20, padding: "20px 26px", borderRadius: 20, border: `2px solid ${C.panelBorder}`, backgroundColor: C.panel, opacity: appear }}>
    <div style={{ width: 54, height: 54, borderRadius: 14, background: "linear-gradient(135deg,#FF6B9D,#FF8A3D 55%,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>♥</div>
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: C.text }}>{title}</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 26, color: C.dim }}>{sub}</div>
    </div>
  </div>
);

export type GLvAskProps = { seconds?: number; typeTo?: number; sendAt?: number };

/** 3 · Nachricht 1 → Lovable builds → preview link. */
/** 3 · Nachricht 1 → Lovable builds (skeleton + progress) → first version + preview link. */
export const GLvNachricht1: React.FC<GLvAskProps> = ({ typeTo = 3.0, sendAt = 3.3 }) => (
  <Ask msg={N1} status="Lovable verwendet" typeTo={typeTo} sendAt={sendAt} camera={[[0, 540, 1560, 1.08], [sendAt - 0.1, 540, 1560, 1.08], [sendAt + 0.4, 540, 820, 1.0], [sendAt + 5, 540, 860, 1.03]]}>
    {(t) => {
      const b0 = sendAt + 0.6;
      const pct = Math.round(100 * prog(t, b0, b0 + 1.9));
      const done = prog(t, b0 + 1.9, b0 + 2.3);
      return (
        <>
          <ToolCard y={400} title="Projekt erstellt: Café Lumen" sub={done > 0.5 ? "Fertig gebaut" : `Lovable baut die Seite … ${pct} %`} appear={prog(t, sendAt + 0.5, sendAt + 0.75)} />
          <div style={{ position: "absolute", left: 60, right: 60, top: 520, height: 8, borderRadius: 4, backgroundColor: C.panelBorder, opacity: prog(t, b0, b0 + 0.2) * (1 - done) }}>
            <div style={{ width: `${pct}%`, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#FF6B9D,#FF8A3D,#8B5CF6)" }} />
          </div>
          <div style={{ position: "absolute", left: 160, top: 560, opacity: prog(t, b0, b0 + 0.3) }}>
            <Browser w={760} h={540}>
              <div style={{ position: "relative" }}>
                <SkeletonSite t={t} />
                <div style={{ position: "absolute", left: 0, top: 0, opacity: done }}><PlainSite /></div>
              </div>
            </Browser>
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 1130, fontFamily: fonts.regular, fontSize: 34, color: C.text, opacity: prog(t, b0 + 2.3, b0 + 2.6) }}>
            Fertig. Hier ist die Vorschau: <span style={{ color: C.blue }}>cafe-lumen.lovable.app ↗</span>
          </div>
          <RedFrame x={50} y={1115} w={980} h={80} at={b0 + 2.7} />
        </>
      );
    }}
  </Ask>
);

/** 4 · The trick: before/after wipe from the first version to the polished one, then published. */
export const GLvTrick: React.FC<GLvAskProps> = ({ typeTo = 2.2, sendAt = 2.45 }) => (
  <Ask msg={N2} status="Lovable verwendet" typeTo={typeTo} sendAt={sendAt} camera={[[0, 540, 1560, 1.08], [sendAt - 0.1, 540, 1560, 1.08], [sendAt + 0.4, 540, 820, 1.0], [sendAt + 5, 540, 860, 1.03]]}>
    {(t) => {
      const w = prog(t, sendAt + 0.8, sendAt + 1.9);
      const W = 760;
      return (
        <>
          <div style={{ position: "absolute", left: 160, top: 370, opacity: prog(t, sendAt + 0.35, sendAt + 0.6) }}>
            <Browser w={W} h={640}>
              <div style={{ position: "relative", width: 1000, height: 1700 }}>
                <PlainSite />
                <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1700, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}><PremiumSite /></div>
              </div>
            </Browser>
            <div style={{ position: "absolute", top: 60, bottom: 0, left: w * W - 3, width: 6, backgroundColor: "#FFF", boxShadow: "0 0 24px rgba(255,255,255,0.8)", opacity: w > 0.01 && w < 0.99 ? 1 : 0 }} />
            <div style={{ position: "absolute", top: -54, left: 0, fontFamily: fonts.semibold, fontSize: 28, color: C.dim, opacity: 1 - w }}>Vorher</div>
            <div style={{ position: "absolute", top: -54, right: 0, fontFamily: fonts.semibold, fontSize: 28, color: "#E8C9A0", opacity: w }}>Nachher</div>
          </div>
          <div style={{ position: "absolute", left: 60, right: 60, top: 1090, display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderRadius: 22, border: "3px solid #4CAF50", backgroundColor: C.panel, opacity: prog(t, sendAt + 2.1, sendAt + 2.4) }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 40, color: "#4CAF50" }}>✓</span>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: C.text }}>Veröffentlicht</div>
              <div style={{ fontFamily: fonts.regular, fontSize: 30, color: C.blue }}>cafe-lumen.lovable.app ↗</div>
            </div>
          </div>
          <RedFrame x={50} y={1080} w={980} h={150} at={sendAt + 2.6} />
        </>
      );
    }}
  </Ask>
);
