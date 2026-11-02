// Firma series engine — generic 2D story objects (Folge 7, 2026-10-29). All optional; nothing changes for episodes without them.
//   hook.result.kind "calcSheet" → CalcSheetHook  (Frame 1 = finished calculation sheet, beats every ≤ 0.5 s)
//   act type "result"            → ResultSheet    (Vorschlag-Akt: the sheet comes back, price tag + row value roll + note)
//   episode.overlays[]           → Overlays2D     (time-windowed objects: partners, bars, card, pill, careTag, nameSign)
// Anchors are resolved through tl.at (memoised), so the timeline needs no extra fields.
import React from "react";
import { Img, staticFile } from "remotion";
import { pixelFont } from "../PixelKit";
import { cl, ease, back, bump } from "../ShirtWorld3D";
import { INK, CLAUDE_ORANGE } from "../ClaudeUI";
import { GREEN, GOLD } from "./draw";
import type { TL } from "./timeline";
import type { Anchor, SheetSpec, Obj2D } from "./schema";

const RED = "#D63A40", XL = "#1E7A46", GREY = "#8C867C";
const stroke = (px: number, col = INK) => ({ WebkitTextStroke: `${px}px ${col}`, paintOrder: "stroke fill" as const });
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const A = (tl: TL, a: Anchor | undefined, fb: number) => (a === undefined ? fb : tl.at(a));
let mctx: CanvasRenderingContext2D | null = null;
const fit = (text: string, weight: number, max: number, maxW: number) => {
  if (!mctx) mctx = document.createElement("canvas").getContext("2d")!;
  mctx.font = `${weight} ${max}px ${pixelFont}`;
  return Math.min(max, (max * maxW) / Math.max(1, mctx.measureText(text).width));
};
const pop = (t: number, a: number, d = 0.35) => Math.max(0.001, Math.min(1.08, back(cl((t - a) / d))));

const ShirtIco: React.FC<{ size: number; fill?: string; dot?: string; text?: string }> = ({ size, fill = "#F2F0EA", dot = CLAUDE_ORANGE, text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
    <path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill={fill} />
    {text ? <text x="12" y="16.4" fontSize="6.6" fontWeight="900" textAnchor="middle" fill={CLAUDE_ORANGE} stroke="none" fontFamily="Rubik">{text}</text> : <circle cx="12" cy="11.5" r="3" fill={dot} />}
  </svg>
);
const Lock: React.FC<{ size: number; col?: string }> = ({ size, col = INK }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M7 11 V7.5 a5 5 0 0 1 10 0 V11" /><rect x="4" y="11" width="16" height="11" rx="2.5" fill="#F5C542" /><path d="M12 15 V18" />
  </svg>
);
const Tub: React.FC<{ size: number; text: string; col?: string }> = ({ size, text, col = "#2E6BD8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 7 L5 20 H19 L21 7" fill="#FFFFFF" /><path d="M3 7 C5 5.4 7 8.6 9 7 C11 5.4 13 8.6 15 7 C17 5.4 19 8.6 21 7" />
    <text x="12" y="17" fontSize="7" fontWeight="900" textAnchor="middle" fill={col} stroke="none" fontFamily="Rubik">{text}</text>
  </svg>
);
const Pill: React.FC<{ text: string; k: number; y: number; bg?: string; fs?: number; rot?: number }> = ({ text, k, y, bg = CLAUDE_ORANGE, fs = 76, rot = -2 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: `scale(${k}) rotate(${rot}deg)` }}>
    <div style={{ padding: "8px 38px 14px", borderRadius: 24, background: bg, border: `8px solid ${INK}`, boxShadow: "0 9px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: fit(text, 800, fs, 900), color: "#fff", whiteSpace: "nowrap", ...stroke(8) }}>{text}</div>
  </div>
);

// ======================================================================================================
// calculation sheet (spreadsheet look). vis(row, col) = 0..1 visibility of a value, roll = rolling number for hot cells
// ======================================================================================================
type SheetState = {
  rowK: (i: number) => number; valK: (i: number, c: number) => number; hl: (i: number) => number;
  bad: number; good: number; sweep: number; note: number; noteK: number; stampK: number; stampP: number; roll: (i: number, c: number) => number;
  amp?: number; colGood?: number; colBad?: number; tilt?: number; // optional (calcSheet strong): beat amplitude factor (default 1), column glow green/red, green value tilt
};
const SHEET_W = 1000;
const parseEuro = (s: string) => { const m = s.match(/([+−-]?)\s*(\d+(?:,\d+)?)/); if (!m) return null; return { sign: m[1], v: parseFloat(m[2].replace(",", ".")), dec: (m[2].split(",")[1] ?? "").length }; };
const fmtRoll = (s: string, k: number) => {
  const p = parseEuro(s);
  if (!p || k >= 0.999) return s;
  const v = p.v * k;
  return s.replace(/([+−-]?\s*)(\d+(?:,\d+)?)/, `$1${v.toFixed(p.dec).replace(".", ",")}`);
};
export const CalcSheet: React.FC<{ S: SheetSpec; st: SheetState; t: number }> = ({ S, st, t }) => {
  const cols = S.cols, nC = cols.length;
  const RN = 50, LW = 360, CW = (SHEET_W - 2 * 14 - RN - LW) / nC;
  const hot = S.hotCol ?? nC - 1;
  return (
    <div style={{ width: SHEET_W, background: "#FFFDF8", border: `9px solid ${INK}`, borderRadius: 32, boxShadow: "0 16px 0 rgba(0,0,0,.5), 0 30px 60px rgba(0,0,0,.45)", overflow: "hidden", boxSizing: "border-box", position: "relative" }}>
      {/* header bar */}
      <div style={{ height: 92, background: XL, display: "flex", alignItems: "center", gap: 18, padding: "0 26px", borderBottom: `6px solid ${INK}` }}>
        <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M3 9 H21 M3 15 H21 M9 3 V21" /></svg>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit(S.title, 800, 48, 800), color: "#fff", whiteSpace: "nowrap" }}>{S.title}</div>
      </div>
      {/* column letters */}
      <div style={{ display: "flex", height: 40, background: "#ECEBE5", borderBottom: "3px solid #CFCBC0", fontFamily: pixelFont, fontWeight: 700, fontSize: 26, color: GREY, padding: "0 14px" }}>
        <div style={{ width: RN }} /><div style={{ width: LW, textAlign: "center", lineHeight: "40px" }}>A</div>
        {cols.map((_, c) => <div key={c} style={{ width: CW, textAlign: "center", lineHeight: "40px" }}>{String.fromCharCode(66 + c)}</div>)}
      </div>
      {/* column heads */}
      <div style={{ display: "flex", height: 88, alignItems: "center", borderBottom: "3px solid #CFCBC0", padding: "0 14px" }}>
        <div style={{ width: RN, fontFamily: pixelFont, fontWeight: 700, fontSize: 26, color: GREY, textAlign: "center" }}>1</div>
        <div style={{ width: LW }} />
        {cols.map((c, ci) => (
          <div key={ci} style={{ width: CW, height: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: ci === hot ? "#DDF3E5" : "transparent", border: ci === hot ? `4px solid ${GREEN}` : "4px solid transparent", boxSizing: "border-box", fontFamily: pixelFont, fontWeight: 800, fontSize: fit(c, 800, 52, CW - 30), color: ci === hot ? "#17643A" : INK }}>{c}</div>
        ))}
      </div>
      {S.rows.map((r, i) => {
        const rk = st.rowK(i);
        const h = r.hot ? 136 : 104;
        const hl = st.hl(i);
        return (
          <div key={i} style={{ display: "flex", height: h, alignItems: "center", borderBottom: "3px solid #E2DED4", padding: "0 14px", position: "relative", background: hl > 0.01 ? `rgba(245,197,66,${0.28 * hl})` : r.hot ? "#FBF6EA" : "transparent", opacity: 0.25 + 0.75 * rk }}>
            {r.hot && st.sweep > 0.001 && st.sweep < 0.999 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${st.sweep * 110 - 20}%`, width: "18%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,236,170,.85), rgba(255,255,255,0))" }} />}
            <div style={{ width: RN, fontFamily: pixelFont, fontWeight: 700, fontSize: 26, color: GREY, textAlign: "center" }}>{i + 2}</div>
            <div style={{ width: LW, fontFamily: pixelFont, fontWeight: r.hot ? 800 : 700, fontSize: fit(r.label, 800, r.hot ? 46 : 42, LW - 16), color: INK, whiteSpace: "nowrap", lineHeight: 1.05 }}>{r.label}</div>
            {r.vals.map((v, c) => {
              const vk = st.valK(i, c);
              const tone = r.tone?.[c] ?? "";
              const col = tone === "good" ? "#1C8A4A" : tone === "bad" ? RED : tone === "dim" ? GREY : INK;
              const big = r.hot && c === hot;
              const amp = st.amp ?? 1;
              const shake = tone === "bad" && r.hot ? Math.sin(t * 60) * 7 * amp * st.bad : 0;
              const glow = big ? st.good : 0;
              const cg = c === hot ? st.colGood ?? 0 : st.colBad ?? 0;
              const tiltDeg = big ? (st.tilt ?? 0) : 0;
              const fs = fit(v, 800, big ? 72 : r.hot ? 54 : 48, CW - 34);
              return (
                <div key={c} style={{ width: CW, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", alignSelf: cg > 0.01 ? "stretch" : undefined, background: cg > 0.01 ? (c === hot ? `rgba(47,191,113,${0.42 * cg})` : `rgba(214,58,64,${0.32 * cg})`) : undefined }}>
                  {vk <= 0.001 ? <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 52, color: "rgba(11,16,32,.18)" }}>?</div> : (
                    <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fs, color: col, whiteSpace: "nowrap", transform: `translateX(${shake}px) scale(${Math.min(1.06, vk) * (1 + 0.2 * glow + (tone === "bad" && r.hot ? 0.2 * st.bad : 0))}) rotate(${tiltDeg}deg)`, textShadow: glow > 0.01 ? `0 0 ${26 * glow}px rgba(47,191,113,.9)` : tone === "bad" && r.hot && st.bad > 0.01 && (st.amp ?? 1) > 1 ? `0 0 ${30 * st.bad}px rgba(214,58,64,.9)` : undefined }}>{fmtRoll(v, st.roll(i, c))}</div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {S.note && (
        <div style={{ height: 112, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {st.noteK > 0.001 && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 28px 12px", borderRadius: 20, background: INK, transform: `scale(${Math.min(1.08, st.noteK) * (1 + 0.12 * (st.amp ?? 1) * st.note)}) rotate(${-1.5 + 3 * (st.amp ?? 1) * st.note * Math.sin(t * 30)}deg)`, boxShadow: (st.amp ?? 1) > 1 && st.note > 0.01 ? `0 0 ${40 * st.note}px rgba(232,182,76,.95)` : undefined }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7 V13" /><circle cx="12" cy="16.6" r="0.6" fill={GOLD} /></svg>
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 50, color: "#FFF6E0", whiteSpace: "nowrap" }}>{S.note.text}</div>
            </div>
          )}
        </div>
      )}
      {S.stamp && st.stampK > 0.001 && (
        <div style={{ position: "absolute", right: 22, top: 18, transform: `rotate(-7deg) scale(${(2.2 - 1.2 * ease(cl(st.stampK))) * (1 + 0.18 * st.stampP)})`, transformOrigin: "80% 50%", opacity: Math.min(1, st.stampK * 3) }}>
          <div style={{ padding: "4px 18px 8px", borderRadius: 14, border: `6px solid ${CLAUDE_ORANGE}`, background: "rgba(255,255,255,.95)", color: CLAUDE_ORANGE, fontFamily: pixelFont, fontWeight: 800, fontSize: 36, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(0,0,0,.2)" }}>{S.stamp.text}</div>
        </div>
      )}
    </div>
  );
};

// price tag hanging from the sheet (Vorschlag)
const PriceTag: React.FC<{ head: string; big?: string; small?: string; kH: number; kB: number; kS: number; pB: number }> = ({ head, big, small, kH, kB, kS, pB }) => (
  <div style={{ position: "relative", width: 380, transform: `scale(${kH}) rotate(4deg)`, transformOrigin: "50% 0%" }}>
    <div style={{ position: "absolute", left: 186, top: -60, width: 8, height: 70, background: INK, borderRadius: 4 }} />
    <div style={{ background: GREEN, border: `8px solid ${INK}`, borderRadius: 30, boxShadow: "0 12px 0 rgba(0,0,0,.45)", padding: "14px 20px 18px", textAlign: "center" }}>
      <div style={{ width: 30, height: 30, borderRadius: 15, background: "#FFFDF8", border: `6px solid ${INK}`, margin: "0 auto 6px" }} />
      <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 46, color: "#fff", letterSpacing: 3, ...stroke(6) }}>{head}</div>
      {big && kB > 0.001 && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 110, lineHeight: 1, color: "#fff", ...stroke(10), transform: `scale(${Math.min(1.08, kB) * (1 + 0.15 * pB)})` }}>{big}</div>}
      {small && kS > 0.001 && <div style={{ marginTop: 4, fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: "#EFFFF4", transform: `scale(${Math.min(1.08, kS)})`, ...stroke(5) }}>{small}</div>}
    </div>
  </div>
);

// ---------- hook: Frame 1 = the finished sheet ----------
export const CalcSheetHook: React.FC<{ tl: TL; t: number; cover: boolean }> = ({ tl, t, cover }) => {
  const R = tl.ep.hook.result as Extract<NonNullable<TL["ep"]["hook"]["result"]>, { kind: "calcSheet" }>;
  const outAt = tl.hookResult!.outAt;
  const beats = (R.beats ?? []).map((b) => ({ what: b.what, at: tl.at(b.at) }));
  // strong: hard attack (0.07 s) + 0.35 s decay instead of the soft triangle, so every beat reads as a hit
  const hit = (a: number) => (a < 0 ? 0 : a < 0.07 ? a / 0.07 : Math.max(0, 1 - (a - 0.07) / 0.35));
  const bt = (w: string) => (cover ? 0 : beats.reduce((m, b) => (b.what === w ? Math.max(m, R.strong ? hit(t - b.at) : bump(t, b.at + 0.03, 0.42)) : m), 0));
  const pushes = beats.filter((b) => b.what === "push");
  const strong = !!R.strong && !cover;
  const zoom = cover ? 1 : 1 + pushes.reduce((z, b) => Math.max(z, (strong ? 0.13 : 0.08) * bump(t, b.at + 0.12, strong ? 0.36 : 0.3)), 0); // punch-in + settle per push beat
  const sweepB = beats.find((b) => b.what === "sweep");
  const out = cover ? 0 : ease((t - outAt) / 0.4);
  if (out >= 0.999) return null;
  // strong: stamp lifts off and slams back on its beat (scale 2.2 → 1 in 0.16 s), frame 0 keeps the stamp
  const stampB = strong ? beats.filter((b) => b.what === "stamp" && t >= b.at).pop() : undefined;
  const st: SheetState = {
    rowK: () => 1, valK: () => 1, hl: (i) => (R.sheet.rows[i].hot ? Math.max(bt("sweep"), 0.6 * bt("bad"), 0.6 * bt("good")) : 0), roll: () => 1,
    bad: bt("bad"), good: bt("good"), sweep: sweepB && !cover ? cl((t - sweepB.at) / 0.6) : 0, note: bt("note"), noteK: 1,
    stampK: stampB ? cl((t - stampB.at) / 0.16) : 1, stampP: bt("stamp"),
    ...(strong ? { amp: 1.8, colGood: bt("good"), colBad: bt("bad"), tilt: -7 * bt("good") } : {}),
  };
  const top = R.y ?? 690;
  return (
    <div style={{ position: "absolute", left: 540 - SHEET_W / 2, top: top + out * 1300, width: SHEET_W, transform: `scale(${zoom * 0.9 * (1 - 0.3 * out)}) rotate(${-1 + out * 12}deg)`, transformOrigin: strong ? "50% 78%" : "50% 40%", opacity: 1 - out * 0.3 }}>
      <CalcSheet S={R.sheet} st={st} t={t} />
    </div>
  );
};

// ---------- act "result": the sheet comes back, price tag, row roll, note ----------
export const ResultSheet: React.FC<{ tl: TL; t: number; act: number }> = ({ tl, t, act }) => {
  const x = tl.acts[act] as Extract<TL["acts"][number], { type: "result" }>;
  const a0 = tl.A[act].a;
  const S = x.sheet;
  const inK = back(cl((t - a0) / 0.45));
  const rowAt = S.rows.map((r) => A(tl, r.at, a0));
  const valAt = S.rows.map((r, i) => r.vals.map((_, c) => A(tl, r.valAt?.[c], rowAt[i])));
  const hlR = x.hl ? { row: x.hl.row, at: tl.at(x.hl.at) } : undefined;
  const noteAt = A(tl, S.note?.at, a0);
  const stampAt = A(tl, S.stamp?.at, 1e9);
  const st: SheetState = {
    rowK: (i) => ease((t - rowAt[i] + 0.1) / 0.3),
    valK: (i, c) => back(cl((t - valAt[i][c]) / 0.3)),
    hl: (i) => (hlR && hlR.row === i ? ease((t - hlR.at) / 0.25) : 0),
    roll: (i, c) => (S.rows[i].hot && x.roll !== false ? ease((t - valAt[i][c]) / 0.7) : 1),
    bad: 0, good: S.rows.reduce((m, r, i) => (r.hot ? Math.max(m, bump(t, Math.max(...valAt[i]) + 0.75, 0.5)) : m), 0),
    sweep: hlR ? cl((t - hlR.at) / 0.6) : 0, note: bump(t, noteAt + 0.3, 0.4), noteK: back(cl((t - noteAt) / 0.35)), stampK: cl((t - stampAt) / 0.16), stampP: 0,
  };
  const top = x.y ?? 236;
  const sc = x.scale ?? 0.92;
  const tg = S.tag;
  const tagAt = tg ? tl.at(tg.at) : 1e9, bigAt = tg ? A(tl, tg.bigAt, tagAt) : 1e9, smallAt = tg ? A(tl, tg.smallAt, bigAt) : 1e9;
  const hot = S.hotCol ?? S.cols.length - 1;
  const RN = 50, LW = 360, CW = (SHEET_W - 28 - RN - LW) / S.cols.length;
  const colX = 540 + (-SHEET_W / 2 + 14 + RN + LW + CW * (hot + 0.5)) * sc;
  const sheetH = 92 + 40 + 88 + S.rows.reduce((h, r) => h + (r.hot ? 136 : 104) + 3, 0) + (S.note ? 112 : 0) + 18;
  return (
    <>
      <div style={{ position: "absolute", left: 540 - SHEET_W / 2, top: top + (1 - Math.min(1, inK)) * 500, width: SHEET_W, transform: `scale(${sc * Math.max(0.001, Math.min(1.04, inK))}) rotate(${-0.8 + (1 - Math.min(1, inK)) * -6}deg)`, transformOrigin: "50% 0%" }}>
        <CalcSheet S={S} st={st} t={t} />
      </div>
      {tg && t >= tagAt - 0.05 && (
        <div style={{ position: "absolute", left: Math.min(1080 - 400, colX - 190), top: top + sheetH * sc + 40 + 6 * Math.sin(t * 2.4), width: 380 }}>
          <PriceTag head={tg.head} big={tg.big} small={tg.small} kH={pop(t, tagAt)} kB={pop(t, bigAt, 0.3)} kS={pop(t, smallAt, 0.3)} pB={bump(t, bigAt + 0.1, 0.3)} />
        </div>
      )}
    </>
  );
};

// ======================================================================================================
// time-windowed overlay objects (episode.overlays)
// ======================================================================================================
type Place = { x: number; y: number; s: number; o: number; g?: number };
const PARTNER_PLACES: Record<string, [Place, Place]> = {
  // [card 0, card 1] — card 1 = the winner by default
  mini: [{ x: 690, y: 1268, s: 0.5, o: 1 }, { x: 930, y: 1268, s: 0.5, o: 1 }],
  duel: [{ x: 300, y: 760, s: 1.0, o: 1 }, { x: 800, y: 790, s: 0.8, o: 1, g: 0.6 }],
  swap: [{ x: 250, y: 690, s: 0.66, o: 1, g: 1 }, { x: 640, y: 830, s: 1.12, o: 1 }],
  top: [{ x: -300, y: 330, s: 0.5, o: 0, g: 1 }, { x: 540, y: 336, s: 0.6, o: 1 }],
  haken: [{ x: -300, y: 450, s: 0.5, o: 0, g: 1 }, { x: 540, y: 470, s: 0.86, o: 1 }],
  off: [{ x: 540, y: -400, s: 0.5, o: 0 }, { x: 540, y: -400, s: 0.5, o: 0 }],
  fade: [{ x: 690, y: 1268, s: 0.4, o: 0 }, { x: 930, y: 1268, s: 0.4, o: 0 }], // fade out in place (no flight over the Claude window)
};
const CW0 = 500, CH0 = 290;
const PartnerCard: React.FC<{ name: string; sub?: string; stamp?: { text: string; color?: string }; stampOff: number; win: number; grey: number; t: number; idx: number }> = ({ name, sub, stamp, stampOff, win, grey, t, idx }) => (
  <div style={{ position: "relative", width: CW0, height: CH0, filter: grey > 0.01 ? `grayscale(${grey}) brightness(${1 - 0.35 * grey})` : undefined }}>
    {win > 0.01 && <div style={{ position: "absolute", inset: -50, borderRadius: 90, background: `radial-gradient(circle, rgba(47,191,113,${0.5 * win}) 0%, rgba(47,191,113,0) 70%)` }} />}
    <div style={{ position: "absolute", inset: 0, borderRadius: 38, background: "#FFFDF8", border: `9px solid ${win > 0.5 ? "#1C8A4A" : INK}`, boxShadow: "0 14px 0 rgba(0,0,0,.5), 0 26px 40px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 18, top: 40 }}><ShirtIco size={200} fill={idx ? "#FF8A57" : "#F2F0EA"} /></div>
    <div style={{ position: "absolute", left: 220, top: 36, width: 256, height: 150, borderRadius: 24, background: INK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit(name, 800, 96, 230), color: "#fff", lineHeight: 1 }}>{name}</div>
      {sub && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: GOLD, marginTop: 6, letterSpacing: 2 }}>{sub}</div>}
    </div>
    {stamp && stampOff < 0.999 && (
      <div style={{ position: "absolute", right: 18, top: 200, transform: `translate(${stampOff * 60}px, ${stampOff * stampOff * 520}px) rotate(${-6 + stampOff * 55}deg)`, opacity: 1 - stampOff * stampOff }}>
        <div style={{ padding: "4px 16px 8px", borderRadius: 12, border: `6px solid ${stamp.color === "grey" ? GREY : CLAUDE_ORANGE}`, background: "rgba(255,255,255,.96)", color: stamp.color === "grey" ? "#5E584F" : CLAUDE_ORANGE, fontFamily: pixelFont, fontWeight: 800, fontSize: 38, whiteSpace: "nowrap" }}>{stamp.text}</div>
      </div>
    )}
  </div>
);

const placeAt = <P,>(keys: { at: number; place: string }[], t: number, get: (p: string) => P, mix: (a: P, b: P, k: number) => P, d = 0.45) => {
  let i = -1;
  for (let k = 0; k < keys.length; k++) if (t >= keys[k].at) i = k;
  if (i < 0) return null;
  const to = get(keys[i].place);
  if (i === 0) return { p: to, k: cl((t - keys[0].at) / d), first: true };
  return { p: mix(get(keys[i - 1].place), to, ease((t - keys[i].at) / d)), k: 1, first: false };
};
const mixPlace = (a: Place, b: Place, k: number): Place => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), o: lerp(a.o, b.o, k), g: lerp(a.g ?? 0, b.g ?? 0, k) });

const Partners: React.FC<{ tl: TL; t: number; o: Extract<Obj2D, { kind: "partners" }> }> = ({ tl, t, o }) => {
  const keys = o.keys.map((k) => ({ at: tl.at(k.at), place: k.place }));
  const r = placeAt(keys, t, (p) => PARTNER_PLACES[p] ?? PARTNER_PLACES.off, (a, b, k) => [mixPlace(a[0], b[0], k), mixPlace(a[1], b[1], k)] as [Place, Place]);
  if (!r) return null;
  const winI = o.win ?? 1;
  const offAt = A(tl, o.stampOff, 1e9), swapAt = A(tl, o.swap, 1e9);
  const stampOff = cl((t - offAt) / 0.6);
  const winK = ease((t - swapAt) / 0.35);
  const big = o.bigStamp ? { text: o.bigStamp.text, at: tl.at(o.bigStamp.at), until: A(tl, o.bigStamp.until, 1e9) } : undefined;
  const pr = o.proof ? { ...o.proof, at: tl.at(o.proof.at), to: A(tl, o.proof.to, 1e9) } : undefined;
  const order = winK > 0.5 ? [1 - winI, winI] : [winI, 1 - winI];
  const out: React.ReactNode[] = [];
  for (const i of order) {
    const p = r.p[i];
    const k0 = r.first ? Math.max(0.001, Math.min(1.08, back(cl((t - keys[0].at + i * -0.0) / 0.4)))) : 1;
    const appear = o.cards[i].at !== undefined ? back(cl((t - tl.at(o.cards[i].at!)) / 0.4)) : 1;
    const s = p.s * (r.first ? k0 : 1) * Math.max(0.001, Math.min(1.08, appear));
    if (p.o <= 0.01 || appear <= 0.001) continue;
    const isWin = i === winI;
    const pulse = isWin ? 1 + 0.07 * bump(t, swapAt + 0.05, 0.4) : 1;
    out.push(
      <div key={i} style={{ position: "absolute", left: p.x - CW0 / 2, top: p.y - CH0 / 2 + Math.sin(t * 1.7 + i) * 4, width: CW0, height: CH0, transform: `scale(${s * pulse}) rotate(${(i ? 2 : -2) + (isWin ? -2 * winK : 0)}deg)`, opacity: p.o }}>
        <PartnerCard name={o.cards[i].name} sub={o.cards[i].sub} stamp={o.cards[i].stamp} stampOff={i === winI ? 0 : stampOff} win={isWin ? winK : 0} grey={isWin ? (1 - winK) * (p.g ?? 0) : Math.max(p.g ?? 0, 0.85 * winK)} t={t} idx={i} />
        {isWin && big && t >= big.at && t < big.until + 0.3 && (() => {
          const k = cl((t - big.at) / 0.18) * (1 - ease((t - big.until) / 0.3));
          return (
            <div style={{ position: "absolute", left: -40, right: -40, top: 150, display: "flex", justifyContent: "center", transform: `rotate(-8deg) scale(${2.3 - 1.3 * ease(k)})`, opacity: Math.min(1, k * 4) }}>
              <div style={{ padding: "8px 26px 14px", borderRadius: 18, background: CLAUDE_ORANGE, border: `8px solid ${INK}`, outline: "4px dashed rgba(255,255,255,.8)", outlineOffset: -18, boxShadow: "0 10px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: 58, color: "#fff", whiteSpace: "nowrap", ...stroke(8) }}>{big.text}</div>
            </div>
          );
        })()}
      </div>,
    );
  }
  if (pr && t >= pr.at - 0.05 && t < pr.to + 0.3) {
    const k = back(cl((t - pr.at) / 0.4)) * (1 - ease((t - pr.to) / 0.3));
    const sc = pr.w / pr.sw;
    const mk = back(cl((t - pr.at - 0.25) / 0.3));
    if (pr.bare) out.push(
      <div key="proof" style={{ position: "absolute", left: (pr.x ?? 540) - pr.w / 2, top: pr.y, width: pr.w, height: pr.sh * sc, overflow: "hidden", borderRadius: 14, boxShadow: "0 8px 0 rgba(0,0,0,.45)", transform: `scale(${Math.max(0.001, Math.min(1.05, k))}) rotate(-2deg)`, opacity: Math.min(1, k * 2) }}>
        <Img src={staticFile(pr.src)} style={{ position: "absolute", left: -pr.sx * sc, top: -pr.sy * sc, width: pr.srcW * sc }} />
      </div>,
    );
    else out.push(
      <div key="proof" style={{ position: "absolute", left: (pr.x ?? 540) - (pr.w + 40) / 2, top: pr.y, transform: `translateY(${(1 - Math.min(1, k)) * 200}px) scale(${Math.max(0.001, Math.min(1.05, k))}) rotate(-1deg)`, opacity: Math.min(1, k * 2) }}>
        <div style={{ background: "#fff", borderRadius: 26, padding: 10, boxShadow: "0 12px 0 rgba(0,0,0,.45)" }}>
          <div style={{ borderRadius: 18, border: `5px solid ${INK}`, background: "#1A1A1A", padding: "10px 10px 14px" }}>
            {pr.label && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px 8px" }}>
              <Img src={staticFile("logos/claude.svg")} style={{ width: 34, height: 34 }} />
              <div style={{ fontFamily: pixelFont, fontWeight: 700, fontSize: 30, color: "#D8D3C8" }}>{pr.label}</div>
            </div>}
            <div style={{ position: "relative", width: pr.w, height: pr.sh * sc, overflow: "hidden", borderRadius: 10 }}>
              <Img src={staticFile(pr.src)} style={{ position: "absolute", left: -pr.sx * sc, top: -pr.sy * sc, width: pr.srcW * sc }} />
              {mk > 0.001 && <div style={{ position: "absolute", inset: 2, borderRadius: 10, border: `6px solid ${CLAUDE_ORANGE}`, background: "rgba(255,192,154,.14)", transform: `scale(${Math.min(1.04, mk)})` }} />}
            </div>
          </div>
        </div>
      </div>,
    );
  }
  return <>{out}</>;
};

const Bars: React.FC<{ tl: TL; t: number; o: Extract<Obj2D, { kind: "bars" }>; k: number }> = ({ tl, t, o, k }) => {
  const y = o.y ?? 540, H = o.h ?? 580;
  const base = H - 92, top0 = 150; // chart: baseline at `base`, value max at `top0`
  const vy = (v: number) => base - (v / o.max) * (base - top0);
  const pulses = (o.pulses ?? []).map((a) => tl.at(a));
  const pulse = pulses.reduce((m, a) => Math.max(m, bump(t, a + 0.03, 0.35)), 0);
  const L = o.line ? { ...o.line, at: tl.at(o.line.at), valueAt: A(tl, o.line.valueAt, tl.at(o.line.at)) } : undefined;
  const lineK = L ? ease((t - L.at) / 0.45) : 0;
  const nB = o.bars.length, bw = 210, gap = (880 - nB * bw) / (nB + 1);
  return (
    <div style={{ position: "absolute", left: 40, top: y, width: 1000, height: H, transform: `scale(${k * (1 + 0.03 * pulse)}) rotate(-0.6deg)`, transformOrigin: "50% 30%" }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: 34, boxShadow: "0 14px 0 rgba(0,0,0,.45), 0 26px 40px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", inset: 10, borderRadius: 26, border: `6px solid ${INK}`, background: "#FFFDF8", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 20, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 56, color: INK, whiteSpace: "nowrap" }}>{o.title}</div>
          <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: o.icons ?? 0 }, (_, i) => <ShirtIco key={i} size={50} />)}</div>
        </div>
        {/* axis */}
        <div style={{ position: "absolute", left: 50, right: 30, top: base - 10, height: 6, background: INK, borderRadius: 3 }} />
        {o.bars.map((b, i) => {
          const at = tl.at(b.at), vAt = A(tl, b.valueAt, at), lAt = A(tl, b.labelAt, -1);
          const g = ease((t - at) / 0.6);
          const vk = back(cl((t - vAt) / 0.3));
          const lk = lAt < 0 ? 1 : 0.35 + 0.65 * cl((t - lAt) / 0.2);
          const x = 40 + gap * (i + 1) + bw * i;
          const hgt = (base - 10 - vy(b.value)) * g;
          const col = b.color === "red" ? "#E5484D" : b.color === "green" ? "#2FBF71" : GREY;
          const lp = lAt >= 0 ? bump(t, lAt + 0.05, 0.35) : 0;
          return (
            <React.Fragment key={i}>
              {g <= 0.001 && <div style={{ position: "absolute", left: x, width: bw, top: base - 110, height: 100, border: "5px dashed rgba(11,16,32,.2)", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 60, color: "rgba(11,16,32,.2)", boxSizing: "border-box" }}>?</div>}
              {g > 0.001 && <div style={{ position: "absolute", left: x, width: bw, top: base - 10 - hgt, height: hgt, background: col, border: `6px solid ${INK}`, borderBottom: "none", borderRadius: "18px 18px 0 0", boxSizing: "border-box", boxShadow: "inset -18px 0 0 rgba(0,0,0,.12)" }} />}
              {vk > 0.001 && <div style={{ position: "absolute", left: x - 40, width: bw + 80, top: b.inside ? vy(b.value) + 6 : vy(b.value) - 10 - 92, textAlign: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 82, color: b.color === "red" ? RED : b.color === "green" ? "#1C8A4A" : INK, transform: `scale(${Math.min(1.1, vk)})`, ...stroke(0), ...(b.inside ? { color: "#fff", ...stroke(8) } : {}) }}>{b.value} €</div>}
              <div style={{ position: "absolute", left: x - 40, width: bw + 80, top: base + 4, textAlign: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: fit(b.label, 800, 52, bw + 70), color: INK, opacity: lk, transform: `scale(${1 + 0.15 * lp})` }}>{b.label}</div>
            </React.Fragment>
          );
        })}
        {L && lineK > 0.001 && (() => {
          const ly = vy(L.value) - 10;
          const vk = back(cl((t - L.valueAt) / 0.3));
          return (
            <>
              <div style={{ position: "absolute", left: 40, top: ly - 3, width: 920 * lineK, height: 0, borderTop: "8px dashed #6F6A62" }} />
              <div style={{ position: "absolute", right: 20, top: ly - 64, display: "flex", alignItems: "center", gap: 10, padding: "2px 16px 6px", borderRadius: 14, background: "#E9E6DF", border: "4px solid #6F6A62", opacity: lineK, transform: `scale(${0.6 + 0.4 * lineK})`, transformOrigin: "100% 50%" }}>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 32, color: "#4E4840" }}>{L.label}</div>
                {vk > 0.001 && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 46, color: INK, transform: `scale(${Math.min(1.1, vk)})` }}>{L.value} €</div>}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

const Card: React.FC<{ tl: TL; t: number; o: Extract<Obj2D, { kind: "card" }>; k: number }> = ({ tl, t, o, k }) => {
  const y = o.y ?? 1150, H = o.h ?? 232;
  const preAt = A(tl, o.main.preAt, 1e9), bigAt = tl.at(o.main.at);
  const vs = o.vs ? { ...o.vs, at: tl.at(o.vs.at) } : undefined;
  const vk = vs ? back(cl((t - vs.at) / 0.35)) : 0;
  const bk = back(cl((t - bigAt) / 0.3)), pk = t >= preAt ? 1 : 0;
  const LW = vs ? 600 : 920;
  return (
    <div style={{ position: "absolute", left: 40, top: y, width: 1000, height: H, transform: `scale(${k}) rotate(0.8deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", borderRadius: 32, boxShadow: "0 12px 0 rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", inset: 10, borderRadius: 24, border: `6px solid ${INK}`, overflow: "hidden", display: "flex" }}>
        <div style={{ width: LW, background: "#E6F6EC", display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
          <ShirtIco size={120} text={o.iconText ?? "1×"} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit(o.title, 800, 40, LW - 190), color: INK, whiteSpace: "nowrap" }}>{o.title}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 4, height: 92 }}>
              {pk > 0 && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 52, color: "#1C8A4A" }}>{o.main.pre}</div>}
              {bk > 0.001 ? <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 92, lineHeight: 1, color: "#1C8A4A", transform: `scale(${Math.min(1.1, bk) * (1 + 0.12 * Math.max(bump(t, bigAt + 0.1, 0.3), ...(o.main.pulse ?? []).map((a) => bump(t, tl.at(a) + 0.08, 0.3))))})`, transformOrigin: "0% 70%" }}>{o.main.big}</div>
                : <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 80, color: "rgba(11,16,32,.2)" }}>?</div>}
            </div>
          </div>
        </div>
        {vs && <div style={{ width: 6, background: INK }} />}
        {vs && (
          <div style={{ flex: 1, background: "#EEECE7", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 22px", opacity: vk > 0.001 ? 1 : 0.6 }}>
            {vk > 0.001 ? (
              <div style={{ transform: `translateX(${(1 - Math.min(1, vk)) * 80}px) scale(${Math.min(1.08, vk)})`, transformOrigin: "0% 50%" }}>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: "#6F6A62" }}>{vs.label}</div>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 70, color: "#6F6A62", lineHeight: 1 }}>{vs.big}</div>
              </div>
            ) : <div style={{ textAlign: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 80, color: "rgba(11,16,32,.18)" }}>?</div>}
          </div>
        )}
      </div>
    </div>
  );
};

const CareTag: React.FC<{ tl: TL; t: number; o: Extract<Obj2D, { kind: "careTag" }>; k: number }> = ({ tl, t, o, k }) => {
  const y = o.y ?? 660;
  const sAt = tl.at(o.strikeAt), qAt = o.quote ? tl.at(o.quote.at) : 1e9, cAt = o.chip ? tl.at(o.chip.at) : 1e9;
  const sk = ease((t - sAt) / 0.3);
  const pz = (o.pulse ? [tl.at(o.pulse)] : []).reduce((m, a) => Math.max(m, bump(t, a + 0.03, 0.4)), 0) + bump(t, sAt + 0.05, 0.35);
  const qk = back(cl((t - qAt) / 0.35)), ck = back(cl((t - cAt) / 0.35));
  return (
    <>
      {/* care label */}
      <div style={{ position: "absolute", left: 70, top: y, width: 440, height: 330, transform: `scale(${k * (1 + 0.06 * pz)}) rotate(-4deg)`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 206, top: -64, width: 8, height: 70, background: INK, borderRadius: 4 }} />
        <div style={{ position: "absolute", inset: 0, background: "#F7F4EC", border: `8px solid ${INK}`, borderRadius: 28, boxShadow: "0 12px 0 rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Tub size={170} text="" />
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 96, color: "#2E6BD8", lineHeight: 1, marginTop: -16 }}>{o.temp}</div>
        </div>
        {sk > 0.001 && <div style={{ position: "absolute", left: 24, top: 286, width: 440 * sk, height: 22, background: "#E5484D", border: `5px solid ${INK}`, borderRadius: 12, transform: "rotate(-24deg)", transformOrigin: "0% 50%", boxShadow: `0 0 ${18 * pz}px rgba(229,72,77,.9)` }} />}
      </div>
      {o.quote && qk > 0.001 && (
        <div style={{ position: "absolute", left: 530, top: y + 10, width: 500, transform: `scale(${Math.min(1.08, qk)}) rotate(3deg)`, transformOrigin: "0% 30%" }}>
          <div style={{ background: "#FFFDF8", border: `7px solid ${INK}`, borderRadius: 26, padding: "18px 24px 22px", boxShadow: "0 12px 0 rgba(0,0,0,.45)" }}>
            {o.quote.label && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#6F6A62", marginBottom: 6 }}>{o.quote.label}</div>}
            <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 62, color: INK, lineHeight: 1.05 }}>„{o.quote.text}“</div>
          </div>
        </div>
      )}
      {o.chip && ck > 0.001 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: y + 380, display: "flex", justifyContent: "center", transform: `scale(${Math.min(1.08, ck)}) rotate(-1.5deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 30px 14px 20px", borderRadius: 24, background: "#FDEBEC", border: `7px solid ${INK}`, boxShadow: "0 9px 0 rgba(0,0,0,.45)" }}>
            <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round"><path d="M10 3.5 a2 2 0 0 1 4 0 V14 a4 4 0 1 1 -4 0 Z" fill="#FFF6E8" /><circle cx="12" cy="17.2" r="2.6" fill="#E5484D" stroke="none" /><rect x="11" y="5" width="2" height="10" fill="#E5484D" stroke="none" /></svg>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 56, color: "#B4343A", whiteSpace: "nowrap" }}>{o.chip.text}</div>
          </div>
        </div>
      )}
    </>
  );
};

const NameSign: React.FC<{ tl: TL; t: number; o: Extract<Obj2D, { kind: "nameSign" }>; k: number }> = ({ tl, t, o, k }) => {
  const y = o.y ?? 360;
  const sAt = tl.at(o.at);
  const sk = back(cl((t - sAt) / 0.4));
  const wig = (o.wiggle ?? []).map((a) => tl.at(a)).reduce((m, a) => Math.max(m, bump(t, a + 0.03, 0.4)), 0);
  const [pre, q] = (() => { const m = o.text.match(/^(.*?)(\?+)$/); return m ? [m[1], m[2]] : [o.text, ""]; })();
  const steps = o.chain ?? [];
  const tw = 290, gap = (1000 - steps.length * tw) / Math.max(1, steps.length - 1);
  return (
    <>
      {sk > 0.001 && (
        <div style={{ position: "absolute", left: 90, top: y, width: 900, transform: `translateY(${(1 - Math.min(1, sk)) * -260}px) rotate(${Math.sin(t * 2.2) * 1.5 + 4 * wig * Math.sin(t * 25)}deg)`, transformOrigin: "50% -60px" }}>
          <div style={{ position: "absolute", left: 160, top: -70, width: 8, height: 80, background: INK, transform: "rotate(-10deg)" }} />
          <div style={{ position: "absolute", right: 160, top: -70, width: 8, height: 80, background: INK, transform: "rotate(10deg)" }} />
          <div style={{ background: "#0E1428", border: `10px solid ${GOLD}`, borderRadius: 34, boxShadow: "0 16px 0 rgba(0,0,0,.5), 0 0 60px rgba(232,182,76,.45)", padding: "26px 30px 34px", textAlign: "center" }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: GOLD, letterSpacing: 6 }}>{o.head ?? "FIRMENNAME"}</div>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 150, lineHeight: 1, color: "#fff", whiteSpace: "nowrap" }}>
              {pre}<span style={{ color: "#FF8A57", display: "inline-block", transform: `scale(${1 + 0.25 * wig})` }}>{q}</span>
            </div>
          </div>
        </div>
      )}
      {steps.map((s, i) => {
        const at = A(tl, s.at, sAt - 0.6 + i * 0.12);
        const tk = back(cl((t - at) / 0.35));
        if (tk <= 0.001) return null;
        const lockAt = A(tl, s.lockAt, 1e9);
        const lk = back(cl((t - lockAt) / 0.3));
        const x = 40 + i * (tw + gap);
        const cur = !!s.current;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ position: "absolute", left: x - gap + 6, top: y + 556, width: gap - 12, height: 12, background: GOLD, borderRadius: 6, opacity: 0.8, transform: `scaleX(${1 + 0.2 * bump(t, A(tl, s.arrowPulse, -9) + 0.03, 0.4)})` }} />}
            <div style={{ position: "absolute", left: x, top: y + 440, width: tw, height: 240, borderRadius: 28, background: cur ? "#463818" : "#1A2547", border: `8px solid ${cur ? GOLD : "#3A4670"}`, boxShadow: cur ? "0 0 40px rgba(232,182,76,.6), 0 10px 0 rgba(0,0,0,.5)" : "0 10px 0 rgba(0,0,0,.5)", transform: `scale(${Math.min(1.08, tk) * (1 + 0.1 * bump(t, lockAt + 0.05, 0.35))})`, boxSizing: "border-box" }}>
              <div style={{ position: "absolute", left: 22, top: 10, fontFamily: "Rubik", fontWeight: 900, fontSize: 76, color: cur ? GOLD : "rgba(255,255,255,.45)" }}>{s.n}</div>
              <div style={{ position: "absolute", left: 22, right: 14, bottom: 22, fontFamily: "Rubik", fontWeight: 900, fontSize: fit(s.label, 900, 54, tw - 40), color: cur ? "#fff" : "rgba(255,255,255,.7)", whiteSpace: "nowrap" }}>{s.label}</div>
              {cur && <div style={{ position: "absolute", right: 20, top: 6, fontFamily: "Rubik", fontWeight: 900, fontSize: 84, color: GOLD, transform: `scale(${1 + 0.3 * wig})` }}>?</div>}
              {lk > 0.001 && <div style={{ position: "absolute", right: 14, top: 14, transform: `scale(${Math.min(1.1, lk)}) rotate(${8 - 8 * Math.min(1, lk)}deg)` }}><Lock size={86} /></div>}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Overlays2D: React.FC<{ tl: TL; t: number; cover?: boolean }> = ({ tl, t, cover }) => {
  const list = tl.ep.overlays;
  if (!list || cover) return null;
  return (
    <>
      {list.map((o, i) => {
        const from = tl.at(o.from), to = A(tl, o.to, 1e9);
        if (t < from - 0.05 || t > to + 0.45) return null;
        const outK = ease((t - to) / 0.35);
        const k = Math.max(0.001, Math.min(1.06, back(cl((t - from) / 0.4)))) * (1 - outK);
        if (k <= 0.002 && o.kind !== "partners") return null;
        switch (o.kind) {
          case "pill": return <Pill key={i} text={o.text} k={k} y={o.y ?? 240} bg={o.color === "gold" ? "#C8901E" : o.color === "green" ? "#1C8A4A" : CLAUDE_ORANGE} />;
          case "partners": return t > to + 0.4 ? null : <Partners key={i} tl={tl} t={t} o={o} />;
          case "bars": return <Bars key={i} tl={tl} t={t} o={o} k={k} />;
          case "card": return <Card key={i} tl={tl} t={t} o={o} k={k} />;
          case "careTag": return <CareTag key={i} tl={tl} t={t} o={o} k={k} />;
          case "nameSign": return <NameSign key={i} tl={tl} t={t} o={o} k={k} />;
          default: return null;
        }
      })}
    </>
  );
};
