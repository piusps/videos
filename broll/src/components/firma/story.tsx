// Firma series engine — story object (Folge 6, 2026-10-28). Optional top-level `story` in episode.json.
// One 2D card that runs through the episode (e.g. the chosen partner "A61"): green care label, stamps, an attached
// receipt (bill) and "?" fields. Where it sits is keyed by `show` [{at, place, bill?}]; it glides between places.
//   place "hook"  = Frame 1, centre, everything already filled in (only proven facts), bill below
//   place "top"   = upper third (covers the flown winner card in the why act), bill/fields below or on it
//   place "small" = small, top centre under the HUD (next to a question card)
//   place "off"   = flown out
// Not set → nothing changes (Tag 1–5 untouched).
import React from "react";
import { pixelFont } from "../PixelKit";
import { cl, ease, back, bump } from "../ShirtWorld3D";
import { INK, CLAUDE_ORANGE } from "../ClaudeUI";
import { GREEN } from "./draw";
import type { StoryR } from "./story-data";
export type { StorySpec, StoryR } from "./story-data";


// care label (wash tub + temperature), also used as why-card icon "careLabel"
export const CareTub: React.FC<{ size: number; col?: string; text?: string }> = ({ size, col = GREEN, text = "60" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 7 L5 20 H19 L21 7" fill="#FFFFFF" />
    <path d="M3 7 C5 5.4 7 8.6 9 7 C11 5.4 13 8.6 15 7 C17 5.4 19 8.6 21 7" />
    <text x="12" y="17" fontSize="7.4" fontWeight="900" textAnchor="middle" fill={col} stroke="none" fontFamily="Rubik">{text}</text>
  </svg>
);
const ShirtBig: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
    <path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#FF8A57" />
    <path d="M14.2 8.6 h3 v2.2 h-3 Z" fill="#FFFFFF" strokeWidth="0.6" />
    <path d="M14.6 9.7 c.4-.5 .8 .5 1.2 0 c.4-.5 .8 .5 1.2 0" stroke="#2FBF71" strokeWidth="0.5" />
  </svg>
);

const W0 = 700, H0 = 470; // base card size at scale 1
type Place = { x: number; y: number; s: number; o: number };
const PLACES: Record<string, Place> = {
  hook: { x: 540, y: 660, s: 1.06, o: 1 },
  top: { x: 540, y: 590, s: 0.98, o: 1 },
  small: { x: 540, y: 300, s: 0.42, o: 1 },
  off: { x: 540, y: -400, s: 0.6, o: 0 },
};
const placeAt = (S: StoryR, t: number) => {
  const ks = S.show;
  let i = -1;
  for (let k = 0; k < ks.length; k++) if (t >= ks[k].at) i = k;
  if (i < 0) return { p: { ...PLACES.off, o: 0 }, key: undefined as StoryR["show"][number] | undefined, since: 0 };
  const cur = ks[i], prev = i > 0 ? ks[i - 1] : undefined;
  const to = PLACES[cur.place];
  // first appearance: pop in place; later: glide from the previous place
  // a hook key at t = 0 stands from frame 0 (Frame 1 = result, no pop-in)
  if (!prev && cur.place === "hook" && cur.at <= 0.001) return { p: to, key: cur, since: t - cur.at };
  const from = prev ? PLACES[prev.place] : { ...to, s: to.s * 0.2, o: 0 };
  const f = prev && prev.place === "off" && cur.place !== "off" ? back(cl((t - cur.at) / 0.45)) : ease((t - cur.at) / 0.45);
  const fo = cl((t - cur.at) / 0.3);
  const lerp = (a: number, b: number) => a + (b - a) * f;
  return {
    p: { x: lerp(from.x, to.x), y: lerp(from.y, to.y), s: Math.max(0.001, lerp(from.s, to.s)), o: from.o + (to.o - from.o) * fo },
    key: cur, since: t - cur.at,
  };
};

const money = (v: number) => `${Math.round(v)} €`;
const stampCol = (c?: string) => (c === "orange" ? CLAUDE_ORANGE : c === "red" ? "#E5484D" : GREEN);

export const StoryCard: React.FC<{ S: StoryR; t: number; cover?: boolean; hookOnly?: boolean }> = ({ S, t, cover }) => {
  const { p: p0, key } = placeAt(S, t);
  // cover: card sits lower + a bit smaller so the hook stamp between headline and card stays readable
  const p = cover && key?.place === "hook" ? { ...p0, y: p0.y + 170, s: p0.s * 0.92 } : p0;
  if (!key || p.o <= 0.01) return null;
  const isHook = key.place === "hook";
  const beat = (w: string) => S.beats.reduce((m, b) => (b.what === w ? Math.max(m, bump(t, b.at + 0.04, 0.42)) : m), 0);
  const pushes = S.beats.filter((b) => b.what === "push" && b.at >= key.at);
  const zoom = pushes.reduce((z, b) => z * (1 + 0.07 * ease((t - b.at) / 0.3)), 1);
  const bLabel = beat("label"), bStamp = beat("stamp"), bB0 = beat("bill0"), bB1 = beat("bill1"), bDiff = beat("diff");
  const vis = (a: number) => (isHook || a < 0 ? 1 : cl((t - a) / 0.3)); // in the hook everything is already there (Frame 1 = result)
  const fields = S.fields.filter((f) => t >= f.at - 0.05);
  const fieldH = fields.length ? 34 + fields.length * 84 : 0;
  const fl = cover ? 0 : Math.sin(t * 1.6) * 4;
  const glow = t >= S.glowAt ? bump(t, S.glowAt + 0.15, 0.5) + (t > S.glowAt + 0.4 ? 1 : 0) : 0;
  const lk = S.label ? (isHook || S.label.at < 0 ? 1 : back(cl((t - S.label.at) / 0.35))) : 0;
  const billOn = !!S.bill && !!key.bill;
  const B = S.bill;
  const billK = billOn ? (isHook ? 1 : back(cl((t - key.at - 0.1) / 0.4))) : 0;
  const pulseB = B ? B.pulse.reduce((m, a) => Math.max(m, bump(t, a + 0.05, 0.45)), 0) : 0;
  const chipK = S.chip ? back(cl((t - S.chip.at) / 0.35)) : 0;
  const cardH = H0 + fieldH;
  return (
    <>
      {/* the card */}
      <div style={{ position: "absolute", left: p.x - W0 / 2, top: p.y - H0 / 2 + fl, width: W0, height: cardH, opacity: p.o, transform: `scale(${p.s * zoom}) rotate(${-1.5 + 1.5 * (zoom - 1) * 10 * Math.sin(t * 3)}deg)`, transformOrigin: `50% ${H0 / 2}px`, filter: "drop-shadow(0 16px 0 rgba(0,0,0,.5)) drop-shadow(0 30px 40px rgba(0,0,0,.45))" }}>
        <div style={{ position: "absolute", inset: -60, borderRadius: 120, background: "radial-gradient(circle, rgba(47,191,113,.22) 0%, rgba(47,191,113,0) 70%)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 46, background: "#FFFDF8", border: `9px solid ${INK}` }} />
        <div style={{ position: "absolute", inset: 18, borderRadius: 32, border: `7px solid ${CLAUDE_ORANGE}`, height: cardH - 36, boxSizing: "border-box" }} />
        {/* shirt + care label */}
        <div style={{ position: "absolute", left: 30, top: 34, width: 300, height: 300 }}><ShirtBig size={300} /></div>
        {S.label && lk > 0.001 && (
          <div style={{ position: "absolute", left: 40, top: 262, transform: `rotate(${-6 + 6 * bLabel}deg) scale(${Math.max(0.001, Math.min(1.1, lk)) * (1 + 0.4 * bLabel)})`, transformOrigin: "50% 0%" }}>
            <div style={{ position: "absolute", left: 104, top: -30, width: 6, height: 34, background: INK, borderRadius: 3 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 20px 10px 12px", borderRadius: 18, background: GREEN, border: `6px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.4)" }}>
              <CareTub size={60} />
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1, whiteSpace: "nowrap", WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill" }}>{S.label.text}</div>
            </div>
          </div>
        )}
        {/* name plate */}
        <div style={{ position: "absolute", left: 350, top: 58, width: 310, height: 170, borderRadius: 26, background: INK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 118, color: "#FFFFFF", lineHeight: 0.95 }}>{S.name}</div>
          {S.sub && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: "#F5C542", lineHeight: 1.1, marginTop: 6 }}>{S.sub}</div>}
        </div>
        {/* stamps */}
        {S.stamps.map((s, i) => {
          if (s.at >= 0 && t < s.at) return null;
          const k = s.at < 0 ? 1 : cl((t - s.at) / 0.16);
          const col = stampCol(s.color);
          return (
            <div key={i} style={{ position: "absolute", right: 40 + i * 4, top: 258 + i * 92, transform: `rotate(${i ? 5 : -7}deg) scale(${(2.1 - 1.1 * ease(k)) * (i === 0 ? 1 + 0.45 * bStamp : 1)})`, transformOrigin: "50% 50%", opacity: Math.min(1, k * 3) }}>
              <div style={{ padding: "6px 18px 10px", borderRadius: 14, border: `7px solid ${col}`, background: "rgba(255,255,255,.94)", color: col, fontFamily: pixelFont, fontWeight: 800, fontSize: i ? 40 : 52, lineHeight: 1, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(0,0,0,.25)" }}>{s.text}</div>
            </div>
          );
        })}
        {/* "?" fields */}
        {fields.length > 0 && (
          <div style={{ position: "absolute", left: 40, right: 40, top: H0 - 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {fields.map((f, i) => {
              const k = back(cl((t - f.at) / 0.35));
              const [lab] = f.text.split(/\s*\?\s*$/);
              return (
                <div key={i} style={{ height: 70, borderRadius: 18, background: "#ECE8E0", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 4px 24px", transform: `scale(${Math.max(0.001, Math.min(1.06, k))})`, transformOrigin: "0% 50%" }}>
                  <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 46, color: "rgba(11,16,32,.7)", whiteSpace: "nowrap" }}>{lab}</div>
                  <div style={{ width: 62, height: 54, borderRadius: 14, background: glow > 0.01 ? CLAUDE_ORANGE : "#C9C3B8", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 46, color: "#fff", transform: `scale(${1 + 0.25 * bump(t, S.glowAt + 0.1 + i * 0.08, 0.4)})`, boxShadow: glow > 0.01 ? `0 0 ${30 * Math.min(1, glow)}px rgba(255,107,53,.9)` : "none" }}>?</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* pill under the card */}
      {key.pill && (() => {
        const k = back(cl((t - key.at - 0.05) / 0.35));
        const y = p.y - H0 / 2 + p.s * (cardH - 10) + 2;
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: `scale(${Math.max(0.001, Math.min(1.08, k))}) rotate(-2deg)` }}>
            <div style={{ padding: "8px 40px 16px", borderRadius: 26, background: CLAUDE_ORANGE, border: `8px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 76, color: "#fff", WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", lineHeight: 1 }}>{key.pill}</div>
          </div>
        );
      })()}
      {/* bill (receipt) hanging under the card */}
      {B && billK > 0.001 && (() => {
        const top = isHook ? p.y - H0 / 2 + p.s * zoom * H0 + 30 : 930;
        const sc = isHook ? 0.86 : 1;
        const rows = B.rows;
        return (
          <div style={{ position: "absolute", left: 540 - 380, top, width: 760, transform: `scale(${Math.max(0.001, Math.min(1.05, billK)) * sc * (isHook ? zoom : 1)}) rotate(1.2deg)`, transformOrigin: "50% 0%", opacity: p.o, filter: "drop-shadow(0 12px 0 rgba(0,0,0,.45)) drop-shadow(0 24px 30px rgba(0,0,0,.4))" }}>
            {/* clip */}
            <div style={{ position: "absolute", left: 330, top: -34, width: 100, height: 56, borderRadius: 12, background: "#C9C1B2", border: `6px solid ${INK}`, zIndex: 2 }} />
            <div style={{ background: "#FBF7EE", border: `7px solid ${INK}`, borderRadius: "22px 22px 6px 6px", padding: "22px 40px 16px", position: "relative" }}>
              {B.title && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 36, letterSpacing: 2, color: "rgba(11,16,32,.55)", textAlign: "center", opacity: vis(B.titleAt), marginBottom: 2 }}>{B.title}</div>}
              {rows.map((r, i) => {
                const k = vis(r.at);
                const roll = isHook || r.at < 0 ? r.value : r.value * ease((t - r.at) / 0.7);
                const pulse = i === 0 ? Math.max(pulseB, bB0) : bB1;
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "2px 0", borderTop: i ? "5px dashed rgba(11,16,32,.25)" : "none", opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
                    <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 56, color: r.bad ? INK : "rgba(11,16,32,.55)" }}>{r.label}</div>
                    <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: r.bad ? 92 : 72, color: r.bad ? "#D63A40" : "rgba(11,16,32,.55)", transform: `scale(${1 + 0.35 * pulse})`, textShadow: pulse > 0.05 ? `0 0 ${24 * pulse}px rgba(229,72,77,.8)` : "none", transformOrigin: "100% 60%" }}>{money(roll)}</div>
                  </div>
                );
              })}
              {B.diff && (() => {
                const k = isHook || B.diff.at < 0 ? 1 : back(cl((t - B.diff.at) / 0.4));
                if (k <= 0.001) return <div style={{ height: 78 }} />;
                return (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                    <div style={{ padding: "4px 26px 10px", borderRadius: 18, background: "#E5484D", border: `6px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 58, color: "#fff", WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill", transform: `scale(${Math.max(0.001, Math.min(1.06, k)) * (1 + 0.45 * bDiff)}) rotate(${-4 + 10 * bDiff}deg)`, transformOrigin: "50% 50%" }}>{B.diff.text}</div>
                  </div>
                );
              })()}
            </div>
            {/* torn edge */}
            <svg width={760} height={24} viewBox="0 0 760 24" style={{ display: "block", marginTop: -7 }}>
              <path d={`M0 0 ${Array.from({ length: 20 }, (_, i) => `L${i * 38 + 19} 20 L${(i + 1) * 38} 0`).join(" ")} Z`} fill="#FBF7EE" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            </svg>
          </div>
        );
      })()}
      {/* chip under the card */}
      {S.chip && chipK > 0.001 && key.place === "top" && (() => {
        const y = p.y - H0 / 2 + p.s * cardH + 34;
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: `scale(${Math.max(0.001, Math.min(1.08, chipK))}) rotate(1.5deg)`, opacity: p.o }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 30px 14px 20px", borderRadius: 24, background: "#FFFDF8", border: `7px solid ${INK}`, boxShadow: "0 9px 0 rgba(0,0,0,.45)" }}>
              <svg width={62} height={62} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="10" r="6.5" fill="#FFF6E8" /><path d="M15 15 L21 21" strokeWidth="3" /><path d="M7.6 7.6 L12.4 12.4 M12.4 7.6 L7.6 12.4" stroke="#E5484D" strokeWidth="2.2" /></svg>
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 54, color: INK, whiteSpace: "nowrap" }}>{S.chip.text}</div>
            </div>
          </div>
        );
      })()}
    </>
  );
};
