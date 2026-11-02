// Firma series engine — additive 2D overlays (Folge 5, 2026-10-28). All optional, only drawn when the episode.json field is set:
//   hook.result.kind "priceTags"  → PriceTagsHook   (Frame-1 price tag + shop tags with "ERST AB" stamps)
//   recap.last.obj                → RecapObj        (e.g. yarn spool "Garn 95 °C" beside the product card)
//   wall act .tie                 → TieBanner       ("UNSER PAKET  mit  RUND 110 €")
//   question act .objects         → QuestionObjects (care-label shirt / chips under the question card)
import React from "react";
import { pixelFont } from "../PixelKit";
import { SKC, cl, ease, back, bump } from "../ShirtWorld3D";
import { INK, CLAUDE_ORANGE } from "../ClaudeUI";
import { GOLD, GREEN } from "./draw";
import type { TL } from "./timeline";

const stroke = (px: number, col = "#0B1020") => ({ WebkitTextStroke: `${px}px ${col}`, paintOrder: "stroke fill" as const });
let mctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, font: string) => {
  if (!mctx) mctx = document.createElement("canvas").getContext("2d")!;
  mctx.font = font;
  return mctx.measureText(text).width;
};
const fitPx = (lines: string[], weight: number, family: string, max: number, maxW: number) =>
  Math.min(max, ...lines.map((l) => max * maxW / Math.max(1, measure(l, `${weight} ${max}px ${family}`))));

const ShirtGlyph: React.FC<{ size: number; dot?: string }> = ({ size, dot = "#FF6B35" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.3" strokeLinejoin="round"><path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#F2F0EA" /><circle cx="12" cy="11.5" r="3.1" fill={dot} /></svg>
);

// ======================================================================================================
// Frame 1: big green price tag (top line + big price, no upper bound) + a row of shop tags that get "ERST AB n" stamps
// ======================================================================================================
const TagShape: React.FC<{ w: number; h: number; fill: string; border: string; children?: React.ReactNode; bw?: number }> = ({ w, h, fill, border, children, bw = 9 }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={`M ${h * 0.42} ${bw / 2} H ${w - 26} Q ${w - bw / 2} ${bw / 2} ${w - bw / 2} 26 V ${h - 26} Q ${w - bw / 2} ${h - bw / 2} ${w - 26} ${h - bw / 2} H ${h * 0.42} L ${bw / 2} ${h / 2} Z`} fill={fill} stroke={border} strokeWidth={bw} strokeLinejoin="round" />
      <circle cx={h * 0.36} cy={h / 2} r={h * 0.075} fill="#0B1020" />
      <circle cx={h * 0.36} cy={h / 2} r={h * 0.075} fill="none" stroke="#FFFFFF" strokeWidth={3} />
    </svg>
    <div style={{ position: "absolute", left: h * 0.5, right: 18, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);
export const PriceTagsHook: React.FC<{ tl: TL; t: number; cover: boolean }> = ({ tl, t, cover }) => {
  const R = tl.hookResult as any;
  if (!R || R.kind !== "priceTags") return null;
  const instant = tl.HK.instant || cover;
  const tt = cover ? 99 : t;
  const out = cover ? 0 : ease((t - R.outAt) / 0.35);
  if (out >= 0.999) return null;
  const fl = (s: number) => (cover ? 0 : Math.sin(t * 2.1 + s) * 5);
  const kin = instant ? 1 : back(cl(t / 0.35));
  const stamps = R.stamps as { text: string; at: number }[];
  const punches = (R.punch ?? []) as number[];
  // 2D push-in: every punch adds 5 % (eased 0.25 s) + a short overshoot; every stamp jolts the big tag
  const zoom = cover ? 1 : 1 + punches.reduce((v, a) => v + 0.04 * ease((t - a) / 0.25) + 0.03 * bump(t, a + 0.08, 0.3), 0);
  const jolt = cover ? 0 : stamps.reduce((v, s) => v + bump(t, s.at + 0.03, 0.22), 0);
  const pulse = 1 + 0.08 * bump(tt, R.fillAt + 0.05, 0.35) + 0.035 * jolt;
  const top: string = R.main.top, big: string = R.main.big;
  const MW = 860, MH = 330;
  const tfs = fitPx([top], 800, pixelFont, 62, MW - MH * 0.5 - 60);
  const bfs = fitPx([big], 800, pixelFont, 150, MW - MH * 0.5 - 60);
  const n = stamps.length;
  const SW = 172, gap = 14, rowW = n * SW + (n - 1) * gap, x0 = (1080 - rowW) / 2;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 52%" }}>
      <div style={{ position: "absolute", left: (1080 - MW) / 2, top: 670, width: MW, transform: `translate(${-700 * out}px, ${fl(0)}px) rotate(${-3 + 1.2 * Math.sin(jolt * 3)}deg) scale(${Math.max(0.001, Math.min(1.06, kin)) * pulse})`, transformOrigin: "50% 50%", filter: "drop-shadow(0 14px 0 rgba(0,0,0,.5)) drop-shadow(0 26px 40px rgba(0,0,0,.4))" }}>
        <div style={{ position: "absolute", inset: -70, borderRadius: 120, background: "radial-gradient(circle, rgba(47,191,113,.28) 0%, rgba(47,191,113,0) 70%)" }} />
        <TagShape w={MW} h={MH} fill="#FFFDF8" border={INK} bw={11}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: tfs, color: INK, lineHeight: 1, whiteSpace: "nowrap" }}>{top}</div>
          <div style={{ marginTop: 14, padding: "4px 26px 12px", borderRadius: 22, background: GREEN, border: `7px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: bfs * 0.86, color: "#FFFFFF", lineHeight: 1, whiteSpace: "nowrap", ...stroke(7) }}>{big}</div>
        </TagShape>
      </div>
      {stamps.map((s, i) => {
        const kIn = instant ? 1 : back(cl((t - 0.12 - 0.07 * i) / 0.4));
        const sk = cover ? 1 : cl((t - s.at) / 0.14);
        const ring = cover ? 0 : cl((t - s.at) / 0.4);
        const x = x0 + i * (SW + gap);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 1075 + (i % 2) * 30, width: SW, transform: `translate(${(i < n / 2 ? -1 : 1) * 700 * out}px, ${fl(i + 1)}px) rotate(${(i - (n - 1) / 2) * 3}deg) scale(${Math.max(0.001, Math.min(1.08, kIn)) * (1 + 0.1 * bump(t, s.at + 0.05, 0.25))})` }}>
            <div style={{ position: "absolute", left: SW / 2 - 3, top: -40, width: 6, height: 46, background: "#C9C1B2", borderRadius: 3 }} />
            <div style={{ background: sk > 0 ? "#FBE3E3" : "#F3EEE4", border: `6px solid ${INK}`, borderRadius: 22, height: 190, boxShadow: "0 10px 0 rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <ShirtGlyph size={88} dot={["#2E6BD8", "#FF6B35", "#2FBF71", "#8A5CF6", "#E5484D"][i % 5]} />
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: "rgba(11,16,32,.4)", lineHeight: 1 }}>5 Stück?</div>
            </div>
            {ring > 0 && ring < 1 && <div style={{ position: "absolute", left: SW / 2 - 130, top: 100 - 130, width: 260, height: 260, borderRadius: 130, border: `${10 * (1 - ring)}px solid rgba(229,72,77,${0.8 * (1 - ring)})`, transform: `scale(${0.4 + 0.9 * ring})` }} />}
            {sk > 0 && (
              <div style={{ position: "absolute", left: -18, right: -18, top: 44, textAlign: "center", transform: `rotate(${-12 + (i % 2) * 6}deg) scale(${2.6 - 1.6 * ease(sk)})`, opacity: sk > 0 ? 1 : 0 }}>
                <div style={{ display: "inline-block", padding: "6px 12px 10px", borderRadius: 14, background: "#FFFFFF", border: "7px solid #E5484D", color: "#D63A40", fontFamily: pixelFont, fontWeight: 800, fontSize: 36, lineHeight: 0.98, whiteSpace: "pre", boxShadow: "0 7px 0 rgba(0,0,0,.4)" }}>{s.text.replace(/^ERST AB /, "ERST AB\n")}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ======================================================================================================
// recap: small object beside the product card (right of it, below the board), e.g. yarn spool "Garn 95 °C"
// ======================================================================================================
const Yarn: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
    <path d="M6 3.5 H18 L17 6 H7 Z" fill="#C99A6B" />
    <path d="M6 20.5 H18 L17 18 H7 Z" fill="#C99A6B" />
    <rect x="7" y="6" width="10" height="12" fill="#FF6B35" />
    {[7.6, 9.4, 11.2, 13, 14.8, 16.6].map((y) => <path key={y} d={`M7 ${y} L17 ${y + 0.9}`} stroke="#B8441C" strokeWidth="0.7" />)}
    <path d="M17 12 C20 12 21 15 19.5 17 C18.5 18.5 20 20 22 19.5" stroke="#FF6B35" strokeWidth="1.1" />
  </svg>
);
export const RecapObj: React.FC<{ tl: TL; t: number; act: number }> = ({ tl, t, act }) => {
  const r = tl.A[act];
  const o = r.last?.obj as { kind: string; text: string; at: number } | undefined;
  if (!o) return null;
  const R = tl.recap!;
  const k = back((t - o.at) / 0.4);
  const out = ease((t - R.today - 0.05) / 0.45);
  if (k <= 0.001 || out >= 0.999) return null;
  const pulse = 1 + 0.12 * bump(t, o.at + 0.2, 0.35);
  const fs = fitPx([o.text], 800, pixelFont, 52, 280);
  return (
    <div style={{ position: "absolute", left: 708, top: 1046, width: 330, transform: `translate(${out * 80}px, ${out * 140}px) rotate(${3 + (1 - Math.min(1, k)) * 12}deg) scale(${Math.max(0.001, Math.min(1.08, k)) * pulse * (1 - 0.25 * out)})`, transformOrigin: "50% 50%", opacity: 1 - out }}>
      <div style={{ background: "#FFFDF8", border: `8px solid ${INK}`, borderRadius: 34, boxShadow: "0 12px 0 rgba(0,0,0,.5)", padding: "10px 12px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {o.kind === "yarn" ? <Yarn size={180} /> : <ShirtGlyph size={180} />}
        <div style={{ marginTop: 4, padding: "4px 18px 8px", borderRadius: 14, background: GREEN, border: `5px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: fs, color: "#fff", whiteSpace: "nowrap", ...stroke(5) }}>{o.text}</div>
      </div>
    </div>
  );
};

// ======================================================================================================
// wall act: tie banner ("UNSER PAKET  mit  RUND 110 €") — under the wall, above the captions
// ======================================================================================================
export const TieBanner: React.FC<{ tl: TL; t: number; act: number }> = ({ tl, t, act }) => {
  const T = tl.A[act].tie as { left: string; mid: string; right: string; at: number } | undefined;
  if (!T) return null;
  const k = back((t - T.at + 0.05) / 0.4);
  if (k <= 0.001) return null;
  const mk = back((t - T.at - 0.12) / 0.35);
  const box = (txt: string, bg: string, col: string, rot: number, from: number) => (
    <div style={{ padding: "10px 26px 16px", borderRadius: 24, background: bg, border: `8px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 60, color: col, whiteSpace: "nowrap", transform: `translateX(${(1 - Math.min(1, k)) * from}px) rotate(${rot}deg)`, ...(col === "#FFFFFF" ? stroke(7) : {}) }}>{txt}</div>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, transform: `scale(${Math.max(0.001, Math.min(1.05, k))})` }}>
      {box(T.left, SKC.OR, "#FFFFFF", -3, -400)}
      <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 74, color: "#FFFFFF", ...stroke(10), textShadow: "0 7px 0 #0B1020", transform: `scale(${Math.max(0.001, Math.min(1.2, mk))})` }}>{T.mid}</div>
      {box(T.right, GREEN, "#FFFFFF", 2, 400)}
    </div>
  );
};

// ======================================================================================================
// question act: objects under the question card (care-label shirt, chips), one per anchor
// ======================================================================================================
export const QuestionObjects: React.FC<{ tl: TL; t: number; act: number }> = ({ tl, t, act }) => {
  const objs = tl.A[act].objects as { kind?: string; text: string; at: number; color?: string }[] | undefined;
  if (!objs || !objs.length) return null;
  const big = objs.filter((o) => o.kind === "careShirt");
  const chips = objs.filter((o) => o.kind !== "careShirt");
  return (
    <>
      {big.map((o, i) => {
        const k = back((t - o.at + 0.05) / 0.4);
        if (k <= 0.001) return null;
        const pulse = 1 + 0.1 * bump(t, o.at + 0.15, 0.3);
        const parts = o.text.split(/\s(?=\d)/); // "Shirt-Stoff 60 °C" → ["Shirt-Stoff", "60 °C"]
        return (
          <div key={`b${i}`} style={{ position: "absolute", left: 50, top: 975, width: 450, transform: `rotate(${-4 + (1 - Math.min(1, k)) * -10}deg) scale(${Math.max(0.001, Math.min(1.08, k)) * pulse})`, transformOrigin: "30% 50%" }}>
            <div style={{ background: "#FFFDF8", border: `8px solid ${INK}`, borderRadius: 34, boxShadow: "0 12px 0 rgba(0,0,0,.5)", padding: "12px 16px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={130} height={130} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
                <path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#DCE9F7" />
                <rect x="9.3" y="5.2" width="5.4" height="7.4" rx="0.6" fill="#FFFFFF" />
                <path d="M10 7.3 L10.6 10.8 H13.4 L14 7.3" stroke="#2E6BD8" strokeWidth="0.7" fill="none" />
                <path d="M10 7.3 C10.7 6.8 11.3 7.8 12 7.3 C12.7 6.8 13.3 7.8 14 7.3" stroke="#2E6BD8" strokeWidth="0.6" />
              </svg>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: INK, lineHeight: 1, whiteSpace: "nowrap" }}>{parts[0]}</div>
                {parts[1] && <div style={{ marginTop: 8, padding: "2px 14px 6px", display: "inline-block", borderRadius: 14, background: "#2E6BD8", border: `5px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1, whiteSpace: "nowrap", ...stroke(5) }}>{parts[1]}</div>}
              </div>
            </div>
          </div>
        );
      })}
      {chips.map((o, i) => {
        const k = back((t - o.at + 0.05) / 0.35);
        if (k <= 0.001) return null;
        const left = big.length ? 510 : 70 + i * 480;
        const top = big.length ? 985 + i * 100 : 1215;
        return (
          <div key={`c${i}`} style={{ position: "absolute", left, top, transform: `rotate(${i % 2 ? 2 : -2}deg) scale(${Math.max(0.001, Math.min(1.1, k)) * (1 + 0.1 * bump(t, o.at + 0.12, 0.3))})`, transformOrigin: "0% 50%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", padding: "6px 24px 12px", borderRadius: 22, background: o.color === "orange" ? CLAUDE_ORANGE : o.color === "gold" ? GOLD : "#FFFDF8", border: `6px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.45)", fontFamily: pixelFont, fontWeight: 800, fontSize: 42, color: o.color === "orange" ? "#fff" : INK, whiteSpace: "nowrap" }}>{o.text}</div>
          </div>
        );
      })}
    </>
  );
};
