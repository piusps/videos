// Firma series engine — 2D overlays: HUD (day badge, plan mini-grid, revenue counter), hook, Claude paper act, Claude screenshot act, re-hook, end card.
import React from "react";
import * as THREE from "three";
import { Img, staticFile } from "remotion";
import { pixelFont } from "../PixelKit";
import { SKC, cl, ease, inOut, back, bump } from "../ShirtWorld3D";
import { ClickPath, Click, INK, CLAUDE_ORANGE, claudeSerif } from "../ClaudeUI";
import { CrumpledPaper, WindowBar, StepChipBar, PlusMenu, InputCard, MarkedText, typedAt, LineIcon, menuRowY, inputPlus, MENU_ROW, MENU_SEP, MENU_PAD, PLUS_MENU } from "../ClaudePaperChat";
import { GOLD, CYAN, GREEN } from "./draw";
import type { TL, ShotKind } from "./timeline";

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const stroke = (px: number, col = "#0B1020") => ({ WebkitTextStroke: `${px}px ${col}`, paintOrder: "stroke fill" as const });
let mctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, font: string) => {
  if (!mctx) mctx = document.createElement("canvas").getContext("2d")!;
  mctx.font = font;
  return mctx.measureText(text).width;
};
const fitPx = (lines: string[], weight: number, family: string, max: number, maxW: number) =>
  Math.min(max, ...lines.map((l) => max * maxW / Math.max(1, measure(l, `${weight} ${max}px ${family}`))));
const fmtEuro = (v: number) => Math.round(v).toLocaleString("de-DE");

// ======================================================================================================
// HUD
// ======================================================================================================
const UMS = { x: 214, y: 42, w: 652, h: 124 };
export const UmsatzHUD: React.FC<{ tl: TL; t: number; cover?: boolean }> = ({ tl, t, cover }) => {
  const U = tl.umsatz;
  if (!U) return null;
  const v = cover ? tl.umsatzAt(tl.END) : tl.umsatzAt(t);
  const big = U.firstBig;
  // visible in the HUD: start > 0 → from popAt; first-ever revenue → after the big card docked
  const dockA = big ? big.at + 2.0 : 0, dockB = dockA + 0.5;
  const hudFrom = big ? dockB : U.popAt;
  const showHud = cover || t >= hudFrom;
  const k = cover ? 1 : big ? 1 : back((t - U.popAt) / 0.35);
  const gainNow = U.gains.find((g) => t >= g.at && t < g.at + 1.4 && g !== big);
  const acc = gainNow ? Math.exp(-2.2 * (t - gainNow.at)) : 0;
  const days = U.days;
  const prog = Math.min(1, tl.day / days);
  const box = (scale: number, x: number, y: number, rot = 0) => (
    <div style={{ position: "absolute", left: x, top: y, width: UMS.w, height: UMS.h, transform: `scale(${scale}) rotate(${rot}deg)`, transformOrigin: "50% 50%", borderRadius: 28, background: "#0E1428", border: `6px solid ${GOLD}`, boxShadow: `0 8px 0 rgba(0,0,0,.45), 0 0 ${30 + 50 * acc}px rgba(232,182,76,${0.35 + 0.5 * acc})`, boxSizing: "border-box", padding: "10px 26px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: GOLD, letterSpacing: 3 }}>UMSATZ</div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 62, lineHeight: 1, color: acc > 0.05 ? "#FFE19A" : "#FFFFFF", transform: `scale(${1 + 0.18 * acc})`, transformOrigin: "100% 60%" }}>{fmtEuro(v)} €</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 26, color: "#F6EEDC", whiteSpace: "nowrap" }}>TAG {tl.day} / {days}</div>
        <div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
          <div style={{ width: `${Math.max(2, prog * 100)}%`, height: "100%", borderRadius: 7, background: GOLD }} />
        </div>
      </div>
    </div>
  );
  const out: React.ReactNode[] = [];
  if (big && !cover && t >= big.at - 0.05 && t < dockB) {
    // first revenue ever: big card in the middle, rolls 0 → amount, then docks into the HUD
    const kin = back((t - big.at) / 0.4);
    const d = inOut(cl((t - dockA) / (dockB - dockA)));
    const s = lerp(1.45, 1, d) * Math.max(0.001, kin);
    const cx = lerp(540, UMS.x + UMS.w / 2, d), cy = lerp(700, UMS.y + UMS.h / 2, d);
    out.push(<React.Fragment key="big">{box(s, cx - UMS.w / 2, cy - UMS.h / 2, lerp(-3, 0, d))}</React.Fragment>);
  }
  if (showHud) out.push(<React.Fragment key="hud">{box(Math.max(0.001, Math.min(1.1, k)), UMS.x, UMS.y)}</React.Fragment>);
  if (gainNow) {
    const u = t - gainNow.at;
    out.push(<div key="plus" style={{ position: "absolute", left: UMS.x + UMS.w - 250, top: UMS.y + UMS.h + 10 - 40 * u, width: 250, textAlign: "right", opacity: Math.min(1, 3 * (1.4 - u)), fontFamily: pixelFont, fontWeight: 800, fontSize: 52, color: GOLD, ...stroke(8) }}>+{fmtEuro(gainNow.amount)} €</div>);
  }
  return <>{out}</>;
};

export const HUD: React.FC<{ tl: TL; t: number; cover?: boolean }> = ({ tl, t, cover = false }) => {
  const P = tl.plan, HK = tl.HK;
  const done = back((t - P.hudDone) / 0.35);
  const next = ease((t - P.next) / 0.3);
  const first = tl.firstOfDay;
  const coverBig = cover && first && !!tl.hookResult; // cover with Frame-1 object: big day badge instead of the HUD one (WasherHook)
  const badgeOn = !coverBig && (cover || !first || t >= HK.fly1);
  const pop = first ? 1 + 0.22 * bump(t, HK.fly1 + 0.03, 0.3) : 1;
  const tiles = P.steps.slice(P.page * 9, P.page * 9 + 9);
  const dayS = String(tl.day);
  return (
    <>
      {badgeOn && <div style={{ position: "absolute", left: 34, top: 40, width: 150, height: 150, borderRadius: 30, background: "#0E1428", border: `7px solid ${GOLD}`, boxShadow: "0 8px 0 rgba(0,0,0,.45), 0 0 30px rgba(232,182,76,.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(-4deg) scale(${pop})` }}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#F6EEDC", letterSpacing: 3, marginTop: 2 }}>TAG</div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: dayS.length > 2 ? 58 : dayS.length > 1 ? 74 : 92, color: GOLD, lineHeight: 0.9, marginTop: -2 }}>{dayS}</div>
      </div>}
      <div style={{ position: "absolute", right: 34, top: 40, display: "grid", gridTemplateColumns: "repeat(3, 40px)", gap: 6, padding: 10, background: "#0E1428", border: `5px solid ${GOLD}88`, borderRadius: 16, boxShadow: "0 6px 0 rgba(0,0,0,.4)" }}>
        {tiles.map((_, li) => {
          const gi = P.page * 9 + li;
          const cur = gi === P.current, isNext = gi === P.current + 1 && next > 0.01, was = P.done.has(gi) && !cur;
          const ok = (cur && done > 0.5) || was;
          const bg = ok ? GREEN : cur ? GOLD : isNext ? CYAN : "rgba(255,255,255,.1)";
          return (
            <div key={li} style={{ width: 40, height: 40, borderRadius: 8, background: bg, color: cur || isNext ? "#10162A" : "rgba(255,255,255,.35)", fontFamily: pixelFont, fontWeight: 800, fontSize: gi + 1 > 9 ? 19 : 24, display: "flex", alignItems: "center", justifyContent: "center", transform: cur ? `scale(${1 + 0.25 * bump(t, P.hudDone + 0.1, 0.35)})` : undefined, boxShadow: cur ? `0 0 ${14 + 10 * Math.sin(t * 5)}px ${done > 0.5 ? GREEN : GOLD}` : undefined }}>
              {ok ? (
                <svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : gi + 1}
            </div>
          );
        })}
      </div>
      <UmsatzHUD tl={tl} t={t} cover={cover} />
    </>
  );
};

// ======================================================================================================
// hook: headline, stamp, TAG-N slam → corner badge (first episode of the day only), "heute fehlt X" tile
// ======================================================================================================
export const shakeAt = (tl: TL, t: number, cover: boolean) => {
  if (cover) return undefined;
  const HK = tl.HK;
  const sh = (a: number, amp: number, ph = 0) => { const u = t - a; return u < 0 || u > 0.5 ? 0 : amp * Math.exp(-11 * u) * Math.sin(70 * u + ph); };
  const sl = tl.firstOfDay ? HK.slam : -9;
  const x = sh(HK.stamp, 16) + sh(sl, 14) + sh(HK.land, 5);
  const y = sh(HK.stamp, 11, 1.3) + sh(sl, 12, 1.3) + sh(HK.land, 12, 1.3);
  if (Math.abs(x) + Math.abs(y) < 0.05) return undefined;
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(1.03)`;
};
export const HookOverlay: React.FC<{ tl: TL; t: number; kind: ShotKind; cover: boolean }> = ({ tl, t, kind, cover }) => {
  const HK = tl.HK, hook = tl.ep.hook;
  const fl = (s: number) => Math.sin(t * 2.2 + s) * 4;
  const firma = cover || HK.instant ? 1 : back(cl((t - HK.firma) / 0.22));
  const st = cover ? 1 : cl((t - HK.stamp) / 0.15);
  const showStamp = (kind === "h1" || kind === "h2") && (cover || t >= HK.stamp);
  const flash = (a: number, k: number) => { const u = t - a; return u < 0 || u > 0.4 ? 0 : k * Math.exp(-10 * u); };
  const first = tl.firstOfDay;
  const fA = cover ? 0 : (first ? flash(HK.slam, 0.5) : 0) + flash(HK.stamp, 0.18);
  const tg = t - HK.slam;
  const showTag = first && !cover && tg >= 0 && t < HK.fly1;
  const f = inOut(cl((t - HK.fly0) / (HK.fly1 - HK.fly0)));
  const slam = 2.3 - 1.3 * ease(cl(tg / 0.14));
  const tx = 540 + (109 - 540) * f, ty = 650 + (115 - 650) * f, ts = 460 + (150 - 460) * f;
  const one = back(cl((t - HK.one) / 0.2));
  const onePop = 1 + 0.15 * bump(t, HK.one + 0.08, 0.25);
  const pu = inOut(cl((t - HK.tile) / 0.3));
  const px = 919 + (540 - 919) * pu, py = 75 + (420 - 75) * pu, pw = 40 + (580 - 40) * pu, ph = 40 + (400 - 40) * pu;
  const qk = 1 + 0.7 * bump(t, HK.q + 0.06, 0.32);
  const qw = 8 * Math.sin((t - HK.q) * 18) * Math.exp(-Math.max(0, t - HK.q) * 4) * (t > HK.q ? 1 : 0);
  const lines = hook.headline;
  const hot = hook.hot ?? lines.length - 1;
  const hfs = fitPx(lines, 800, pixelFont, 132, 940);
  const HL_TOP = 228; // below the HUD row (badge + mini plan, y 40–200): the badge is there from frame 0 in non-first episodes
  const stampFs = fitPx([hook.stamp], 800, pixelFont, 96, 860);
  const tileLabel = (hook.tileLabel ?? tl.plan.steps[tl.plan.current]).split("\n");
  const dayS = String(tl.day);
  const renderLine = (ln: string) => ln.split(/(\s+)/).map((w, i) => /^KI[.,!?]?$/.test(w)
    ? <span key={i} style={{ display: "inline-block", transform: `scale(${1 + 0.1 * bump(t, HK.ki + 0.06, 0.3)})` }}>{w}</span>
    : <React.Fragment key={i}>{w}</React.Fragment>);
  return (
    <>
      {(kind === "h1" || (hook.keepHeadline && (kind === "h2" || kind === "h3"))) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: HL_TOP, textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: hfs, lineHeight: 0.98, color: "#FFFFFF", letterSpacing: -1, ...stroke(16 * hfs / 132), textShadow: "0 10px 0 #0B1020, 0 0 40px rgba(0,0,0,.6)", transform: `translateY(${fl(0)}px)` }}>
            {lines.map((ln, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {i === hot ? <span style={{ display: "inline-block", color: "#FF8A57", transform: `scale(${firma})` }}>{renderLine(ln)}</span> : renderLine(ln)}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {showStamp && (
        <div style={{ position: "absolute", left: 0, right: 0, top: kind === "h1" || hook.keepHeadline ? HL_TOP + lines.length * hfs * 0.98 + 40 : 250, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "14px 44px 20px", borderRadius: 26, background: SKC.OR, border: "9px solid #0B1020", outline: "4px dashed rgba(255,255,255,.75)", outlineOffset: -22, boxShadow: "0 10px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: stampFs, color: "#FFFFFF", letterSpacing: 2, ...stroke(10), transform: `rotate(-6deg) scale(${2.4 - 1.4 * ease(st)})`, opacity: st > 0 ? 1 : 0 }}>
            {hook.stamp}
          </div>
        </div>
      )}
      {showTag && (
        <>
          <div style={{ position: "absolute", left: 540 - 700, top: 650 - 700, width: 1400, height: 1400, borderRadius: "50%", opacity: (1 - f) * Math.min(1, tg / 0.08) * 0.7, transform: `rotate(${tg * 30}deg)`, background: "repeating-conic-gradient(from 0deg, rgba(255,214,120,.42) 0deg 7deg, rgba(255,214,120,0) 7deg 20deg)", WebkitMaskImage: "radial-gradient(circle, #000 18%, rgba(0,0,0,0) 62%)" }} />
          <div style={{ position: "absolute", left: tx - ts / 2, top: ty - ts / 2, width: ts, height: ts, borderRadius: ts * 0.2, background: "#0E1428", border: `${ts * 0.047}px solid ${GOLD}`, boxShadow: `0 ${ts * 0.05}px 0 rgba(0,0,0,.45), 0 0 ${ts * 0.3}px rgba(232,182,76,.55)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${-4 * f - 3 * (1 - f)}deg) scale(${slam * onePop})` }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: ts * 0.2, color: "#F6EEDC", letterSpacing: ts * 0.02, marginTop: ts * 0.013 }}>TAG</div>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: ts * (dayS.length > 2 ? 0.38 : dayS.length > 1 ? 0.49 : 0.61), color: GOLD, lineHeight: 0.9, marginTop: -ts * 0.013, transform: `scale(${one})`, opacity: t >= HK.one ? 1 : 0 }}>{dayS}</div>
          </div>
        </>
      )}
      {kind === "h4" && t >= HK.tile && (
        <div style={{ position: "absolute", left: px - pw / 2, top: py - ph / 2, width: pw, height: ph, borderRadius: pw * 0.07, background: "#463818", border: `${Math.max(3, pw * 0.022)}px solid ${GOLD}`, boxShadow: `0 ${ph * 0.03}px 0 rgba(0,0,0,.5), 0 0 ${pw * 0.08}px rgba(232,182,76,.6)`, overflow: "hidden", transform: `rotate(${-3 * pu}deg)` }}>
          <div style={{ position: "absolute", left: pw * 0.07, top: ph * 0.04, fontFamily: "Rubik", fontWeight: 900, fontSize: ph * 0.36, color: GOLD, lineHeight: 1 }}>{tl.plan.current + 1}</div>
          <div style={{ position: "absolute", left: pw * 0.07, right: pw * 0.05, bottom: ph * 0.09, fontFamily: "Rubik", fontWeight: 900, fontSize: ph * (tileLabel.length > 1 ? 0.13 : 0.17) * Math.min(1, 9 / Math.max(...tileLabel.map((x) => x.length))), color: "#FFFFFF", lineHeight: 1 }}>
            {tileLabel.map((x, i) => <div key={i}>{x}</div>)}
          </div>
          <div style={{ position: "absolute", right: pw * 0.08, top: ph * 0.02, fontFamily: "Rubik", fontWeight: 900, fontSize: ph * 0.42, color: GOLD, lineHeight: 1, transform: `scale(${qk}) rotate(${qw}deg)`, transformOrigin: "50% 60%" }}>?</div>
        </div>
      )}
      {fA > 0.005 && <div style={{ position: "absolute", inset: 0, background: "#FFF6E0", opacity: fA }} />}
    </>
  );
};


// ======================================================================================================
// Frame-1 result object (hook.result): front-loader with temperature display + 2 care labels (ok = green ✓, bad = red ✗, never struck through)
// ======================================================================================================
const TubSvg: React.FC<{ temp: string; col: string; size: number }> = ({ temp, col, size }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 100 72">
    <path d="M6 14 L16 66 H84 L94 14" fill="#FFFFFF" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    <path d="M6 14 C18 4 28 24 40 14 C52 4 62 24 74 14 C84 6 90 18 94 14" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <text x="50" y="57" textAnchor="middle" fontFamily="Rubik" fontWeight="900" fontSize="34" fill={col}>{temp}</text>
  </svg>
);
const Badge: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: ok ? GREEN : "#E5484D", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {ok
      ? <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      : <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M6 6 L18 18 M18 6 L6 18" stroke="#fff" strokeWidth="3.8" fill="none" strokeLinecap="round" /></svg>}
  </div>
);
export const WasherHook: React.FC<{ tl: TL; t: number; cover: boolean }> = ({ tl, t, cover }) => {
  const R = tl.hookResult;
  if (!R || R.kind !== "washer") return null;
  const tt = cover ? Math.min(t, R.outAt - 0.3) : t;
  const out = ease((tt - R.outAt) / 0.35);
  if (out >= 0.999) return null;
  const kin = 0.9 + 0.1 * back(cl(tt / 0.35));
  const fl = (s: number) => Math.sin(tt * 2.1 + s) * 5;
  const MX = 270, MY = 600, MW = 540, MH = 650;
  const pulse = 1 + 0.18 * bump(tt, R.fillAt + 0.05, 0.35);
  const heat = 0.55 + 0.45 * ease((tt - R.fillAt) / 0.4);
  // drum: slow before spinAt, fast after
  const spin = tt < R.spinAt ? tt * 40 : R.spinAt * 40 + (tt - R.spinAt) * 360 + 180 * ease((tt - R.spinAt) / 0.4);
  const D = 400, dcx = MW / 2, dcy = 150 + (MH - 150) / 2;
  // display roll: from roll.from (at rollAt) up to temp (at fillAt), steps of 5
  const tMax = parseInt(R.temp, 10);
  const roll = (R as any).roll as { from: number } | undefined;
  const dispTemp = roll && R.rollAt !== undefined && !cover && tt < R.fillAt && Number.isFinite(tMax)
    ? R.temp.replace(/^\d+/, String(Math.min(tMax, roll.from + 5 * Math.floor(((tMax - roll.from) / 5) * cl((tt - R.rollAt) / Math.max(0.1, R.fillAt - R.rollAt))))))
    : R.temp;
  const push = R.pushT !== undefined && !cover ? 1 + 0.1 * inOut(cl((tt - R.pushT) / 0.35)) : 1;
  const labels = R.labels;
  const tag = (i: number) => {
    const L = labels[i];
    if (!L) return null;
    const left = i === 0;
    const k = cover || tl.HK.instant ? 1 : back(cl((tt - 0.05 - 0.1 * i) / 0.4)) ;
    const stp = cover ? undefined : (R.wStamps ?? []).find((s) => s.label === i && tt >= s.at);
    const sk = stp ? cl((tt - stp.at) / 0.13) : 0;
    const hit = stp ? Math.sin((tt - stp.at) * 60) * 7 * Math.exp(-(tt - stp.at) * 9) : 0;
    const col = L.ok ? "#1F8A4C" : "#E5484D";
    const tfs = fitPx([L.text], 800, pixelFont, 54, 270);
    return (
      <div key={i} style={{ position: "absolute", left: left ? 18 : 732, top: left ? 1010 : 1040, width: 330, transform: `translate(${(left ? -1 : 1) * 500 * out + hit}px, ${fl(i * 2) - 60 * out}px) rotate(${left ? -7 : 6}deg) scale(${Math.max(0.001, Math.min(1.08, k))})`, transformOrigin: "50% 0%" }}>
        <div style={{ position: "absolute", left: 135, top: -46, width: 60, height: 70, borderRadius: 10, background: "#E8E2D4", border: `5px solid ${INK}` }} />
        <div style={{ position: "relative", background: "#FFFDF8", borderRadius: 20, border: `7px solid ${L.ok ? INK : "#E5484D"}`, boxShadow: "0 12px 0 rgba(0,0,0,.45), 0 20px 40px rgba(0,0,0,.35)", padding: "16px 14px 18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 8, borderRadius: 14, border: "3px dashed rgba(11,16,32,.25)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TubSvg temp={L.temp} col={col} size={170} />
            <Badge ok={L.ok} size={70} />
          </div>
          <div style={{ marginTop: 6, fontFamily: pixelFont, fontWeight: 800, fontSize: tfs, color: L.ok ? INK : "#C8343A", whiteSpace: "nowrap" }}>{L.text}</div>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: col, lineHeight: 1 }}>bis {L.temp} °C</div>
          {stp && <div style={{ position: "absolute", left: -20, right: -20, top: "100%", marginTop: 4, textAlign: "center", opacity: sk > 0 ? 1 : 0, transform: `rotate(${left ? 8 : -9}deg) scale(${2.2 - 1.2 * ease(sk)})` }}>
            <span style={{ display: "inline-block", padding: "6px 18px 9px", borderRadius: 14, background: col, border: `6px solid ${INK}`, boxShadow: "0 6px 0 rgba(0,0,0,.45)", fontFamily: pixelFont, fontWeight: 800, fontSize: fitPx([stp.text], 800, pixelFont, 50, 300), color: "#FFFFFF", whiteSpace: "nowrap", ...stroke(6) }}>{stp.text}</span>
          </div>}
        </div>
      </div>
    );
  };
  return (
    <>
      <div style={{ position: "absolute", left: MX, top: MY, width: MW, height: MH, transform: `translateY(${fl(1) - 220 * out}px) scale(${kin * push * (1 - 0.85 * out)})`, transformOrigin: "50% 40%", opacity: 1 - out }}>
        <div style={{ position: "absolute", inset: -60, borderRadius: 120, background: `radial-gradient(circle, rgba(255,138,87,${0.28 * heat}) 0%, rgba(255,138,87,0) 70%)` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 52, background: "linear-gradient(180deg,#FFFFFF 0%,#ECE7DD 100%)", border: `10px solid ${INK}`, boxShadow: "0 16px 0 rgba(0,0,0,.5), 0 30px 60px rgba(0,0,0,.45)" }} />
        {/* control panel */}
        <div style={{ position: "absolute", left: 26, right: 26, top: 24, height: 104, borderRadius: 24, background: "#DCD5C7", border: `6px solid ${INK}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 16 }}>
          {[0, 1].map((k) => <div key={k} style={{ width: 58, height: 58, borderRadius: 29, background: "#F6F3EC", border: `6px solid ${INK}`, transform: `rotate(${k ? 40 : -30}deg)`, position: "relative" }}><div style={{ position: "absolute", left: 20, top: 2, width: 6, height: 20, background: INK, borderRadius: 3 }} /></div>)}
          <div style={{ marginLeft: "auto", height: 80, minWidth: 250, borderRadius: 16, background: "#141A2E", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 ${18 * heat}px rgba(255,120,60,.6)` }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 70, color: "#FF8A57", textShadow: `0 0 ${16 * heat}px rgba(255,138,87,.9)`, transform: `scale(${pulse})`, lineHeight: 1 }}>{dispTemp}</div>
          </div>
        </div>
        {/* door */}
        <div style={{ position: "absolute", left: dcx - D / 2 - 26, top: dcy - D / 2 - 26, width: D + 52, height: D + 52, borderRadius: "50%", background: "linear-gradient(145deg,#E9EDF2,#9EA6B2)", border: `9px solid ${INK}`, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: dcx - D / 2, top: dcy - D / 2, width: D, height: D, borderRadius: "50%", overflow: "hidden", border: `8px solid ${INK}`, boxSizing: "border-box", background: "radial-gradient(circle at 50% 45%, #2C4A86 0%, #142245 75%)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: D * 0.55 + 6 * Math.sin(tt * 4), bottom: 0, background: "rgba(96,170,255,.38)" }} />
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${spin}deg)` }}>
            {[0, 120, 240].map((a, k) => (
              <div key={k} style={{ position: "absolute", left: D / 2 - 62 + Math.cos((a * Math.PI) / 180) * 92, top: D / 2 - 62 + Math.sin((a * Math.PI) / 180) * 92, transform: `rotate(${a + 20}deg)` }}>
                <ShirtSvg size={124} dot={k === 1 ? "#2E6BD8" : "#FF6B35"} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: D * 0.16, top: D * 0.1, width: D * 0.5, height: D * 0.32, borderRadius: "50%", border: "10px solid rgba(255,255,255,.35)", borderColor: "rgba(255,255,255,.35) transparent transparent transparent", transform: "rotate(-25deg)" }} />
        </div>
      </div>
      {tag(0)}
      {tag(1)}
      {cover && tl.firstOfDay && (
        <div style={{ position: "absolute", left: 790, top: 1390, width: 250, height: 250, borderRadius: 50, background: "#0E1428", border: `12px solid ${GOLD}`, boxShadow: "0 12px 0 rgba(0,0,0,.5), 0 0 60px rgba(232,182,76,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(6deg)" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 52, color: "#F6EEDC", letterSpacing: 5, marginTop: 4 }}>TAG</div>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 150, color: GOLD, lineHeight: 0.9, marginTop: -4 }}>{tl.day}</div>
        </div>
      )}
    </>
  );
};

// ======================================================================================================
// Claude paper act: logo → steps chips → Plus → feature → prompt typing with highlight keys → Send
// ======================================================================================================
export const WIN_X = 40, WIN_Y = 214, WIN_W = 1000, WIN_H = 1166;
const PROMPT_FS = 46, PROMPT_LH = 1.28, PROMPT_W = WIN_W - 116 - 30;
const lineCache = new Map<string, number[]>();
const promptLineOf = (prompt: string) => {
  const hit = lineCache.get(prompt);
  if (hit) return hit;
  const c = document.createElement("canvas").getContext("2d")!;
  c.font = `600 ${PROMPT_FS}px ${pixelFont}`;
  const out: number[] = [];
  let line = 0, cur = "";
  prompt.split(/(\s+)/).forEach((tok) => {
    if (cur && /\S/.test(tok) && c.measureText(cur + tok).width > PROMPT_W) { line++; cur = ""; }
    cur += tok;
    for (let i = 0; i < tok.length; i++) out.push(line);
  });
  lineCache.set(prompt, out);
  return out;
};
const MENU_H = MENU_PAD * 2 + PLUS_MENU.filter((x) => x !== "sep").length * MENU_ROW + PLUS_MENU.filter((x) => x === "sep").length * MENU_SEP;
const A_TOP = 860, A_BOT = 1120, B_TOP = 140, B_BOT = 1130;
const MENU_TOP = A_TOP - 16 - MENU_H;
const menuLabels = PLUS_MENU.filter((x) => x !== "sep").map((x: any) => x.label as string);

const Tape: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 150, height: 46, background: "rgba(240,226,190,.82)", boxShadow: "0 2px 6px rgba(0,0,0,.25)", transform: `rotate(${rot}deg)`, borderLeft: "3px dashed rgba(0,0,0,.08)", borderRight: "3px dashed rgba(0,0,0,.08)" }} />
);
export const PaperWindow: React.FC<{ u: number; children: React.ReactNode }> = ({ u, children }) => {
  const settle = 1 + 0.025 * (1 - ease(u / 0.4));
  return (
    <div style={{ position: "absolute", left: WIN_X, top: WIN_Y, width: WIN_W, height: WIN_H, transform: `scale(${settle}) rotate(-0.6deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, boxShadow: "0 30px 60px rgba(0,0,0,.55), 0 0 0 7px #0B1020, 0 0 70px rgba(255,190,120,.25)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden" }}>
        <CrumpledPaper w={WIN_W} h={WIN_H} strength={0.45}>{children}</CrumpledPaper>
      </div>
      <Tape x={-40} y={-14} rot={-32} />
      <Tape x={WIN_W - 110} y={-14} rot={30} />
    </div>
  );
};

export const ClaudePaper: React.FC<{ tl: TL; t: number; u: number }> = ({ tl, t, u }) => {
  const C = tl.C, P = tl.ep.claude.prompt;
  const k2 = inOut((t - C.moveUp) / 0.45);
  const g = { top: lerp(A_TOP, B_TOP, k2), bot: lerp(A_BOT, B_BOT, k2) };
  const typed = typedAt(C.typing, t);
  const stepI = C.steps.reduce((a, s, i) => (t >= s.at - 0.05 ? i : a), 0);
  const F = C.feature;
  const isResearch = F?.label === "Research";
  const menuHot = F ? (menuLabels.includes(F.label) ? F.label : "Connectors") : undefined;
  const plusHit = inputPlus(A_BOT);
  const sendHit = { x: WIN_W - 28 - 18 - 48, y: B_BOT - 14 - 39 };
  const featY = menuHot ? menuRowY(menuHot, MENU_TOP) : 0;
  const clicks: Click[] = [
    ...(F ? [
      { t: F.plus, n: 1, x: plusHit.x, y: plusHit.y, mx: plusHit.x + 44, my: plusHit.y - 31, until: F.pick + 0.08 },
      { t: F.pick + 0.08, n: 2, x: 250, y: featY, mx: 520, my: featY - 31, until: F.on + 0.35 },
      { t: F.on + 0.7, n: 9, x: 860, y: 1400, mx: 0, my: 0, until: 0 },
    ] : []),
    { t: C.send, n: F ? 3 : 1, x: sendHit.x, y: sendHit.y, mx: sendHit.x - 120, my: sendHit.y - 128, until: 99 },
  ];
  const cursorVis = Math.max(F ? cl((t - C.cursorFrom) / 0.2) * (1 - cl((t - F.on - 0.45) / 0.2)) : 0, cl((t - (C.send - 1.0)) / 0.2));
  const featK = F ? cl((t - (F.pick + 0.12)) / 0.3) : 0;
  const logoK = back((t - (C.at + 0.1)) / 0.45) * (1 - ease((t - C.moveUp - 0.05) / 0.3));
  return (
    <PaperWindow u={u}>
      {t < C.moveUp + 0.5 && logoK > 0.001 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, logoK * 1.4), transform: `scale(${0.6 + 0.4 * logoK})` }}>
          <Img src={staticFile("logos/claude.svg")} style={{ width: 190, height: 190, transform: `rotate(${(t - C.logo) * 25}deg)` }} />
          <div style={{ marginTop: 22, fontFamily: claudeSerif, fontWeight: 500, fontSize: 70, color: INK }}>How can I help you today?</div>
        </div>
      )}
      <InputCard top={g.top} bottom={g.bot} t={t} focus={t > (C.typing[0]?.[0] ?? C.send) - 0.05 && t < C.send} fontSize={PROMPT_FS}
        showPlaceholder={typed === 0} placeholder="How can I help you today?"
        research={isResearch ? featK : 0} plusPress={F ? bump(t, F.plus + 0.04, 0.14) : 0} sendPress={bump(t, C.send + 0.04, 0.14)} sent={t > C.send}>
        {typed > 0 ? (() => {
          const visible = Math.floor((g.bot - g.top - 126) / (PROMPT_FS * PROMPT_LH));
          const ln = promptLineOf(P)[Math.min(P.length - 1, typed - 1)];
          const scroll = Math.max(0, ln - visible + 1) * PROMPT_FS * PROMPT_LH;
          return <div style={{ transform: `translateY(${-scroll}px)`, fontSize: PROMPT_FS, lineHeight: PROMPT_LH }}><MarkedText text={P} n={typed} t={t} marks={C.marks} caret={t < C.send} /></div>;
        })() : null}
      </InputCard>
      {F && !isResearch && featK > 0.001 && (
        <div style={{ position: "absolute", left: 28 + 102, top: g.bot - 24 - 56, height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 20px 0 14px", borderRadius: 30, background: "#E3EEFF", border: "4px solid #3E6FD8", fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#2C52A8", transform: `scale(${back(featK)})`, transformOrigin: "0% 50%" }}>
          <LineIcon k={F.icon} size={32} color="#2C52A8" sw={2.4} />{F.label}
        </div>
      )}
      {F && <PlusMenu t={t} open={F.plus + 0.1} close={F.on + 0.22} top={MENU_TOP} hot={menuHot} hotAt={F.pick - 0.25} onAt={F.pick + 0.12} />}
      {C.attach && t >= C.attach.at - 0.15 && (() => {
        const A = C.attach!;
        const k = back(cl((t - A.at + 0.12) / 0.42));
        const x = lerp(WIN_W + 60, 40, Math.min(1, ease(cl((t - A.at + 0.12) / 0.32))));
        return (
          <div style={{ position: "absolute", left: x, top: g.top - 196, width: 560, height: 168, borderRadius: 22, background: "#F4EFE6", border: `5px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxSizing: "border-box", transform: `rotate(${-2 + 6 * (1 - Math.min(1, k))}deg) scale(${0.85 + 0.15 * Math.min(1.05, k)})`, transformOrigin: "0% 50%" }}>
            <svg width="86" height="104" viewBox="0 0 20 24" fill="#FFFFFF" stroke={INK} strokeWidth="1.5" strokeLinejoin="round"><path d="M3 1.5 H13 L18 6.5 V22.5 H3 Z" /><path d="M13 1.5 V6.5 H18" fill="none" /><path d="M6 11 H15 M6 14.5 H15 M6 18 H12" stroke={CLAUDE_ORANGE} /></svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fitPx([A.label], 800, pixelFont, 40, 400), color: INK, whiteSpace: "nowrap" }}>{A.label}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ padding: "2px 14px", borderRadius: 14, border: `4px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 28, color: INK }}>MD</div>
                {A.sub && <div style={{ fontFamily: pixelFont, fontWeight: 600, fontSize: 30, color: "#6B655C", whiteSpace: "nowrap" }}>{A.sub}</div>}
              </div>
            </div>
          </div>
        );
      })()}
      <WindowBar t={t} enter={-1} top={24} chip={C.steps.length && t > C.steps[0].at - 0.1
        ? <StepChipBar key={stepI} t={t} n={stepI + 1} total={C.steps.length} label={C.steps[stepI].label} at={C.steps[stepI].at} done={C.send} />
        : null} />
      <div style={{ position: "absolute", inset: 0, opacity: cursorVis }}>
        <ClickPath t={t} clicks={clicks} start={{ t: C.cursorFrom, x: 560, y: 1300 }} />
      </div>
    </PaperWindow>
  );
};

// real claude.ai screenshot act (DOM-clone screenshot in public/), slow scroll + highlight boxes
export const ClaudeShot: React.FC<{ tl: TL; t: number; u: number; act: number }> = ({ tl, t, u, act }) => {
  const r = tl.A[act];
  const sh = tl.shots.find((s) => s.act === act)!;
  const [s0, s1] = (r.scroll as [number, number] | undefined) ?? [0, 0];
  const k = inOut((t - r.a) / Math.max(0.5, sh.b - r.a));
  const y = lerp(s0, s1, k);
  const keys = r.cam as [number, number, number, number][];
  let wrap: React.CSSProperties = { position: "absolute", left: 0, top: -y, width: WIN_W };
  if (keys.length) {
    let [, cs, cx, cy] = keys[0];
    for (let i = 1; i < keys.length; i++) { const q = inOut(cl((t - keys[i][0]) / 0.45)); cs = lerp(cs, keys[i][1], q); cx = lerp(cx, keys[i][2], q); cy = lerp(cy, keys[i][3], q); }
    const VH = WIN_H - 116;
    wrap = { position: "absolute", left: 0, top: 0, width: WIN_W, transformOrigin: "0 0", transform: `translate(${WIN_W / 2 - cx * cs}px, ${VH / 2 - cy * cs}px) scale(${cs})` };
  }
  const MC: Record<string, [string, string]> = { yellow: ["#E8B400", "rgba(255,214,0,.28)"], orange: [CLAUDE_ORANGE, "rgba(255,192,154,.22)"], red: ["#E5484D", "rgba(229,72,77,.18)"], blue: ["#3E6FD8", "rgba(62,111,216,.18)"], green: [GREEN, "rgba(46,170,100,.18)"] };
  return (
    <PaperWindow u={u}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, bottom: 0, overflow: "hidden", background: keys.length ? "#191919" : undefined }}>
        <div style={wrap}>
          <Img src={staticFile(r.src)} style={{ width: WIN_W, display: "block", ...(r.crop ? { clipPath: `polygon(0px ${r.crop[0]}px, 100% ${r.crop[0]}px, 100% ${r.crop[1]}px, 0px ${r.crop[1]}px)` } : {}) }} />
          {(r.marks as { x: number; y: number; w: number; h: number; at: number; color?: string }[]).map((m, i) => {
            const mk = back((t - m.at) / 0.3);
            if (mk <= 0.001) return null;
            const [bc, bg] = MC[m.color ?? "orange"] ?? MC.orange;
            return <div key={i} style={{ position: "absolute", left: m.x, top: m.y, width: m.w, height: m.h, borderRadius: 10, border: `${keys.length ? 4 : 7}px solid ${bc}`, background: bg, boxShadow: `0 0 0 ${keys.length ? 2 : 4}px #fff`, transform: `scale(${Math.min(1.08, mk)})` }} />;
          })}
        </div>
      </div>
      <WindowBar t={t} enter={-1} top={24} chip={r.title ? <div style={{ padding: "6px 20px", borderRadius: 30, background: GREEN, border: `5px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 30, color: "#fff" }}>{r.title}</div> : null} />
    </PaperWindow>
  );
};

// re-hook: bottom-left, below the sheet, never over Claude text
export const ReHook: React.FC<{ tl: TL; t: number }> = ({ tl, t }) => {
  const R = tl.C.rehook;
  if (!R) return null;
  const kin = back((t - R.from) / 0.45), kout = ease((t - R.to) / 0.25);
  if (kin <= 0.001 || kout >= 0.999) return null;
  const k = Math.max(0, kin) * (1 - kout);
  return (
    <div style={{ position: "absolute", left: 40, top: 1530, width: 470, transform: `rotate(${-4 + Math.sin(t * 2.2) * 1.2}deg) scale(${k})`, transformOrigin: "30% 50%" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 30, padding: 10, boxShadow: "0 12px 0 rgba(0,0,0,.45)" }}>
        <div style={{ background: "#FFF6E8", border: `5px solid ${INK}`, borderRadius: 22, padding: "12px 20px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 46, lineHeight: 1.06, color: INK }}>{R.lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</div>
          <div style={{ marginTop: 10, display: "inline-block", padding: "2px 22px 6px", borderRadius: 16, background: CLAUDE_ORANGE, border: `4px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 42, color: "#fff" }}>{R.pill}</div>
        </div>
      </div>
    </div>
  );
};

// ======================================================================================================
// end card: comment word, DM plane, delivery cards, result line
// ======================================================================================================
const Die: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; inner?: React.CSSProperties; pad?: number }> = ({ children, style, inner, pad = 10 }) => (
  <div style={{ position: "absolute", background: "#FFFFFF", borderRadius: 30, padding: pad, boxShadow: "0 12px 0 rgba(0,0,0,.45), 0 20px 40px rgba(0,0,0,.35)", ...style }}>
    <div style={{ borderRadius: 22, border: `5px solid ${INK}`, ...inner }}>{children}</div>
  </div>
);
const CopyIcon: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 70, height: 70, borderRadius: 18, border: `5px solid ${INK}`, background: on > 0.5 ? GREEN : "#F6F1E8", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.2 * Math.sin(Math.PI * Math.min(1, on))})`, flexShrink: 0 }}>
    {on > 0.5
      ? <svg width="38" height="38" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      : <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8 V6 a2 2 0 0 0 -2 -2 H6 a2 2 0 0 0 -2 2 v8 a2 2 0 0 0 2 2 h2" /></svg>}
  </div>
);
const BOT_SCREEN = { x: 540, y: 1560 };
export const EndCard: React.FC<{ tl: TL; t: number; act: number }> = ({ tl, t, act }) => {
  const r = tl.A[act];
  const keyword = tl.ep.keyword;
  const k0 = r.a;
  const head = back((t - k0) / 0.4);
  const field = back((t - (k0 + 0.15)) / 0.4);
  const typedN = Math.max(0, Math.min(keyword.length, Math.floor((t - (r.keywordAt - 0.05)) * 14)));
  const typed = keyword.toUpperCase().slice(0, typedN);
  const sentAt = r.keywordAt + 0.05 + keyword.length / 14 + 0.25;
  const sent = t > sentAt;
  const sentK = back((t - sentAt) / 0.35);
  const [planeA, planeB] = r.plane as [number, number];
  const pk = inOut((t - planeA) / (planeB - planeA));
  const fl = (s: number) => Math.sin(t * 2 + s) * 4;
  const seg = (a: number) => cl((t - a) / 0.2);
  const segStyle = (a: number, hot = false): React.CSSProperties => ({ opacity: 0.3 + 0.7 * seg(a), color: hot && seg(a) > 0.5 ? "#FF9A6A" : "#fff", display: "inline-block", transform: `scale(${1 + 0.12 * bump(t, a + 0.12, 0.3)})` });
  const items = r.items as { label: string; snip: string; table?: string[][] }[];
  const big = !!r.big;
  const gap = items.length > 3 ? 160 : big ? 236 : 196, cardH = items.length > 3 ? 132 : big ? 210 : 158;
  const res = r.result as { at: number; line1: string; line1At: number; parts: { text: string; at: number; hot?: boolean }[] } | undefined;
  const resK = res ? back((t - res.at) / 0.4) : 0;
  const headline = (r.headline as string | undefined) ?? "KOMMENTIERE";
  const dimK = r.dimBoard ? ease((t - (r.itemsAt as number) + 0.25) / 0.3) : 0;
  return (
    <>
      {dimK > 0.001 && <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 1240, opacity: dimK, background: "linear-gradient(180deg, rgba(14,20,40,0) 0%, rgba(14,20,40,.96) 8%, rgba(14,20,40,.96) 90%, rgba(14,20,40,0) 100%)" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 104, color: "#FFFFFF", ...stroke(14), textShadow: "0 9px 0 #0B1020", transform: `scale(${Math.max(0, head)}) translateY(${fl(0)}px)` }}>{headline}</div>
      <Die style={{ left: 50, right: 50, top: 350, transform: `scale(${Math.max(0, field)}) rotate(-1.5deg)` }} inner={{ background: "#FFFFFF", height: 132, display: "flex", alignItems: "center", gap: 20, padding: "0 20px", borderColor: sent ? GREEN : INK }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, background: "#E4DCCD", border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 32, color: INK }}>DU</div>
        <div style={{ flex: 1, fontFamily: pixelFont, fontWeight: 800, fontSize: keyword.length > 9 ? 64 : 84, color: typed ? CLAUDE_ORANGE : "#A39C90", letterSpacing: 2 }}>
          {typed || <span style={{ fontSize: 50 }}>Kommentar …</span>}{!sent && typed && Math.sin(t * 12) > 0 ? <span style={{ color: INK }}>|</span> : ""}
        </div>
        <div style={{ height: 88, padding: "0 22px", borderRadius: 44, background: sent ? GREEN : CLAUDE_ORANGE, border: `5px solid ${INK}`, display: "flex", alignItems: "center", gap: 10, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 38, transform: `scale(${1 + 0.15 * bump(t, sentAt, 0.25)})` }}>
          {sent ? (r.sentIcon ? <svg width="60" height="60" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : <>✓ gesendet</>) : <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"><path d="M21 3 L10 14" /><path d="M21 3 L14.5 21 L10 14 L3 9.5 Z" /></svg>}
        </div>
      </Die>
      {sentK > 0.001 && t < planeB + 0.05 && (() => {
        const pt = r.planeTo as [number, number] | undefined; const x0 = 860, y0 = 420, x1 = pt ? pt[0] : BOT_SCREEN.x, y1 = pt ? pt[1] : BOT_SCREEN.y - 120;
        const x = lerp(x0, x1, pk) + Math.sin(pk * Math.PI) * 260, y = lerp(y0, y1, pk) - Math.sin(pk * Math.PI) * 120;
        return (
          <div style={{ position: "absolute", left: x - 70, top: y - 50, transform: `rotate(${30 + pk * 70}deg) scale(${Math.min(1, sentK) * (1 - 0.3 * pk)})`, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="120" height="100" viewBox="0 0 24 20"><path d="M1 9 L23 1 L16 19 L11 12 Z" fill="#FFFFFF" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" /><path d="M11 12 L23 1" stroke={INK} strokeWidth="1.2" /></svg>
            <div style={{ padding: "4px 14px", borderRadius: 14, background: "#3E6FD8", border: `4px solid ${INK}`, fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: "#fff" }}>DM</div>
          </div>
        );
      })()}
      {items.map((f, i) => {
        const a = r.itemsAt + i * 0.22;
        const k = back((t - a) / 0.45);
        if (k <= 0.001) return null;
        const ty = 520 + i * gap;
        const fy = lerp(BOT_SCREEN.y - 200, ty, Math.min(1, k)), fx = lerp(BOT_SCREEN.x - 490, 50, Math.min(1, k));
        const copied = cl((t - (r.copyAt + 0.05 + i * 0.12)) / 0.15);
        return (
          <Die key={i} style={{ left: fx, width: 980, top: fy, transform: `rotate(${(i - 1) * 1.2 + (1 - Math.min(1, k)) * 10}deg) scale(${0.5 + 0.5 * k})`, transformOrigin: "50% 50%" }}
            inner={{ background: "#FFFDF8", height: cardH, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, padding: "10px 20px 10px 24px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ padding: "2px 16px 4px", borderRadius: 14, background: CLAUDE_ORANGE, border: `4px solid ${INK}`, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 34 }}>{(r.itemTag as string | undefined) ?? "FRAGE"} {i + 1}</div>
                <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: big ? fitPx([f.label], 800, pixelFont, 62, 700) : 48, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.label}</div>
              </div>
              {f.table ? (
                // optional mini table (first row = head), no file icon
                <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: `repeat(${f.table[0].length}, 1fr)`, border: `3px solid ${INK}`, borderRadius: 10, overflow: "hidden", maxHeight: 76 }}>
                  {f.table.flatMap((row, ri) => row.map((c, ci) => (
                    <div key={`${ri}-${ci}`} style={{ padding: "1px 10px 3px", fontFamily: pixelFont, fontWeight: ri ? 600 : 800, fontSize: 26, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", color: ri ? "#4E4840" : "#fff", background: ri ? "#FFFDF8" : "#1E7A46", borderLeft: ci ? "2px solid #CFCBC0" : undefined, borderTop: ri ? "2px solid #CFCBC0" : undefined }}>{c}</div>
                  )))}
                </div>
              ) : <div style={{ marginTop: 6, fontFamily: pixelFont, fontWeight: 600, fontSize: big ? 58 : 32, lineHeight: 1.12, color: "#4E4840", maxHeight: big ? 72 : 72, whiteSpace: big ? "nowrap" : undefined, overflow: "hidden" }}>{f.snip}</div>}
            </div>
            <CopyIcon on={copied} />
          </Die>
        );
      })}
      {res && resK > 0.001 && (
        <div style={{ position: "absolute", left: 50, right: 50, top: (r.resultY as number | undefined) ?? Math.max(1130, 520 + items.length * gap - 20), height: big ? 250 : 150, boxSizing: "border-box", borderRadius: 28, background: "#0E1428", border: `7px solid ${GOLD}`, boxShadow: "0 10px 0 rgba(0,0,0,.5), 0 0 40px rgba(232,182,76,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: pixelFont, fontWeight: 800, color: "#fff", transform: `scale(${resK}) rotate(-1deg)`, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: fitPx([res.line1], 800, pixelFont, big ? 96 : 58, 900) }}><span style={segStyle(res.line1At, true)}>{res.line1}</span></div>
          <div style={{ fontSize: big ? 72 : 44, display: "flex", gap: big ? 22 : 14 }}>
            {res.parts.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.6 }}>·</span>}
                <span style={segStyle(p.at, p.hot)}>{p.text}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ======================================================================================================
// recap act (Rückblick): product card + banner BELOW the board (never over a board column), today pill under today's tile
// ======================================================================================================
type CamLike = { pos: [number, number, number]; look: [number, number, number]; fov: number };
const projCam = new THREE.PerspectiveCamera(58, 1080 / 1920, 0.1, 200);
export const project = (cam: CamLike, p: [number, number, number]): [number, number] => {
  projCam.fov = cam.fov; projCam.position.set(...cam.pos); projCam.up.set(0, 1, 0); projCam.lookAt(...cam.look);
  projCam.updateProjectionMatrix(); projCam.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(projCam);
  return [(v.x + 1) / 2 * 1080, (1 - v.y) / 2 * 1920];
};
const ShirtSvg: React.FC<{ size: number; dot?: string }> = ({ size, dot = "#FF6B35" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0B1020" strokeWidth="1.3" strokeLinejoin="round"><path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#F2F0EA" /><circle cx="12" cy="11.5" r="3.3" fill={dot} /><path d="M10.6 11.3 h0.01 M13.4 11.3 h0.01" stroke="#0B1020" strokeWidth="1.1" strokeLinecap="round" /></svg>
);
export const RecapOverlay: React.FC<{ tl: TL; t: number; act: number; cam: CamLike; cover?: boolean }> = ({ tl, t, act, cam }) => {
  const r = tl.A[act];
  const R = tl.recap!;
  const kIn = back((t - r.product.at + 0.2) / 0.45);
  const kB = r.banner ? back((t - r.banner.at) / 0.35) : 0;
  const out = ease((t - R.today - 0.05) / 0.45);
  const label: string = r.product.label;
  const lfs = fitPx([label], 800, pixelFont, 62, 380);
  const bfs = r.banner ? fitPx(r.banner.text.split("\n"), 800, pixelFont, 40, 360) : 40;
  // today pill: under today's tile (projected), clamped above the caption band
  const tw = (() => {
    const gi = R.todayStep % 9;
    const col = gi % 3, row = Math.floor(gi / 3);
    const rx = 60 + col * (473.33 + 30) + 236.67, ry = 230 + row * (290 + 30) + 290; // px in the 1600×1220 board texture
    return [0 + (rx / 1600 - 0.5) * 6.9, 4.35 + (0.5 - ry / 1220) * 5.25, -4.46] as [number, number, number];
  })();
  const [, py0] = project(cam, [tw[0], 4.35 - 2.625, -4.46]); // pill under the board (never over a tile); today's tile glows gold + pops
  const pk = back((t - R.today - 0.12) / 0.35);
  const pill: string = r.today.pill;
  const pfs = fitPx([pill], 800, pixelFont, 74, 940);
  const py = Math.min(1250, Math.max(760, py0 + 40)); // never in the caption band (≥ 1400)
  return (
    <>
      {kIn > 0.001 && out < 0.999 && (
        <div style={{ position: "absolute", left: 40, top: 1046, width: 640, transform: `translate(${(1 - Math.min(1, kIn)) * -760 - out * 60}px, ${out * 140}px) rotate(${-2 + (1 - Math.min(1, kIn)) * -8}deg) scale(${Math.max(0.001, Math.min(1.08, kIn)) * (1 - 0.25 * out)})`, transformOrigin: "20% 50%", opacity: 1 - out }}>
          <div style={{ background: "#FFFDF8", border: "8px solid #0B1020", borderRadius: 34, boxShadow: "0 12px 0 rgba(0,0,0,.5)", padding: "14px 22px 18px 14px", display: "flex", alignItems: "center", gap: 14 }}>
            <ShirtSvg size={180} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
              <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: lfs, color: SKC.INK, lineHeight: 1, whiteSpace: "nowrap" }}>{label}</div>
              {r.banner && (
                <div style={{ marginTop: 16, padding: "8px 20px 12px", borderRadius: 16, background: SKC.OR, border: "5px solid #0B1020", fontFamily: pixelFont, fontWeight: 800, fontSize: bfs, lineHeight: 1.1, color: "#fff", transform: `scale(${Math.max(0.001, Math.min(1.1, kB))}) rotate(-2deg)`, transformOrigin: "10% 50%", whiteSpace: "pre-line" }}>{r.banner.text}</div>
              )}
            </div>
          </div>
        </div>
      )}
      {pk > 0.001 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: py, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "10px 38px 16px", borderRadius: 24, background: SKC.OR, border: "8px solid #0B1020", boxShadow: "0 10px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: pfs, color: "#fff", ...stroke(8), transform: `scale(${Math.max(0.001, Math.min(1.1, pk))}) rotate(-3deg)` }}>{pill}</div>
        </div>
      )}
    </>
  );
};

// ======================================================================================================
// why act (Warum-Beat): head pill + 2–3 reason cards, each with icon + 1–3 words (+ optional big number), one per anchor
// ======================================================================================================
const WhyGlyph: React.FC<{ icon: string; size?: number }> = ({ icon, size = 96 }) => {
  const P = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: INK, strokeWidth: 1.9, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (icon) {
    case "thermoHot":
    case "thermoCold": {
      const hot = icon === "thermoHot", col = hot ? "#E5484D" : "#3E8BFF";
      return <svg {...P}><path d="M10 3.5 a2 2 0 0 1 4 0 V14 a4 4 0 1 1 -4 0 Z" fill="#FFF6E8" /><circle cx="12" cy="17.2" r="2.6" fill={col} stroke="none" /><rect x="11" y={hot ? 5 : 10.5} width="2" height={hot ? 10 : 4.5} fill={col} stroke="none" /><path d="M15.5 6 H18 M15.5 9 H17.5 M15.5 12 H18" /></svg>;
    }
    case "careLabel": return <svg {...P} strokeWidth={1.6}><path d="M3 7 L5 20 H19 L21 7" fill="#FFFFFF" /><path d="M3 7 C5 5.4 7 8.6 9 7 C11 5.4 13 8.6 15 7 C17 5.4 19 8.6 21 7" /><text x="12" y="17" fontSize="7.4" fontWeight="900" textAnchor="middle" fill={GREEN} stroke="none" fontFamily="Rubik">60</text></svg>; // care label (wash tub 60), Folge 6
    case "chart": return <svg {...P}><rect x="2.5" y="10" width="6" height="11" fill="#F5C542" /><rect x="9" y="5" width="6.5" height="16" fill="#FF8A57" /><rect x="16" y="12" width="5.5" height="9" fill="#6FB8FF" /><path d="M1.5 21 H22.5" /></svg>;
    case "search": return <svg {...P}><circle cx="10" cy="10" r="6.5" fill="#FFF6E8" /><path d="M15 15 L21.5 21.5" strokeWidth="3" /><path d="M7 10 H13 M10 7 V13" stroke={CLAUDE_ORANGE} strokeWidth="2.2" /></svg>;
    case "shirt": return <svg {...P}><path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#F2F0EA" /><circle cx="12" cy="11.5" r="3" fill="#2E6BD8" /></svg>;
    case "shirt1x": return <svg {...P}><path d="M8 3 L4 5.5 L2 10 L5.5 11.5 L6 21 H18 L18.5 11.5 L22 10 L20 5.5 L16 3 C15 5 9 5 8 3 Z" fill="#F2F0EA" /><text x="12" y="16.2" fontSize="6.5" fontWeight="900" textAnchor="middle" fill={CLAUDE_ORANGE} stroke="none" fontFamily="Rubik">1×</text></svg>;
    case "clock": return <svg {...P}><circle cx="12" cy="12" r="9" fill="#FFF6E8" /><path d="M12 7 V12 L15.5 14" stroke={CLAUDE_ORANGE} strokeWidth="2.4" /></svg>;
    case "euro": return <svg {...P}><circle cx="12" cy="12" r="9" fill="#F5C542" /><path d="M15.5 8.2 A4.5 4.5 0 1 0 15.5 15.8 M7 10.6 H13 M7 13.4 H12.5" /></svg>;
    case "warn": return <svg {...P}><path d="M12 3 L22 20 H2 Z" fill="#F5C542" /><path d="M12 9.5 V14" strokeWidth="2.4" /><circle cx="12" cy="17" r="0.6" fill={INK} /></svg>;
    case "check": return <svg {...P}><circle cx="12" cy="12" r="9" fill={GREEN} /><path d="M7.5 12.5 L10.5 15.5 L16.5 8.5" stroke="#fff" strokeWidth="2.6" /></svg>;
    case "truck": return <svg {...P}><rect x="2" y="7" width="12" height="9" fill="#6FB8FF" /><path d="M14 10 H18.5 L21.5 13 V16 H14 Z" fill="#FFF6E8" /><circle cx="6.5" cy="17.5" r="2" fill="#FFF6E8" /><circle cx="17" cy="17.5" r="2" fill="#FFF6E8" /></svg>;
    case "people": return <svg {...P}><circle cx="8.5" cy="8" r="3" fill="#FF8A57" /><circle cx="16" cy="9" r="2.5" fill="#6FB8FF" /><path d="M3 20 C3 15 14 15 14 20 Z" fill="#FF8A57" /><path d="M12.5 20 C13 16 21 16 21 20 Z" fill="#6FB8FF" /></svg>;
    default: return <svg {...P}><circle cx="12" cy="12" r="9" fill="#FFF6E8" /></svg>;
  }
};
export const WHY_TOP = { pill: 860, card0: 1010, step: 190, cardH: 160 }; // captions move to y 1660 during the why act
export const WhyCards: React.FC<{ tl: TL; t: number; act: number }> = ({ tl, t, act }) => {
  const r = tl.A[act];
  const head = back((t - (r.pillAt - 0.05)) / 0.4);
  if (head <= 0.001) return null;
  const pfs = fitPx([r.pill], 800, pixelFont, 76, 960);
  const anyVs = r.cards.some((w: any) => !!w.vs);
  const card0 = anyVs ? 1060 : WHY_TOP.card0, step = anyVs ? 222 : WHY_TOP.step, cardH = anyVs ? 196 : WHY_TOP.cardH;
  const chipK = r.chip ? back((t - r.chip.at) / 0.35) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: WHY_TOP.pill, textAlign: "center", transform: `scale(${Math.max(0, Math.min(1.1, head))}) rotate(-2deg)` }}>
        <div style={{ display: "inline-block", padding: "8px 36px 14px", borderRadius: 24, background: SKC.OR, border: "8px solid #0B1020", boxShadow: "0 9px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: pfs, color: "#fff", whiteSpace: "nowrap", ...stroke(8) }}>{r.pill}</div>
      </div>
      {r.chip && chipK > 0.001 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: WHY_TOP.pill + 118, textAlign: "center", transform: `scale(${Math.min(1.1, chipK)}) rotate(1.5deg)` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "4px 26px 8px", borderRadius: 20, background: "#FFFDF8", border: `5px solid ${INK}`, boxShadow: "0 6px 0 rgba(0,0,0,.45)", fontFamily: pixelFont, fontWeight: 800, fontSize: 40, color: INK, whiteSpace: "nowrap" }}>{r.chip.text}</div>
        </div>
      )}
      {r.cards.map((w: any, i: number) => {
        const k = back((t - (w.at - 0.08)) / 0.4);
        if (k <= 0.001) return null;
        const pulse = 1 + 0.06 * bump(t, w.at + 0.15, 0.3);
        const hot = w.hot ?? (i === 0 && !!w.big);
        const outer = { left: 70, right: 70, top: card0 + i * step, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px) scale(${Math.max(0.001, k) * pulse}) rotate(${(i - 0.5) * 1.1}deg)` };
        if (w.vs) {
          const v = w.vs;
          const vk = back((t - (v.at - 0.06)) / 0.38);
          const vPulse = 1 + 0.12 * bump(t, v.at + 0.12, 0.3);
          const LW = 530, RW = 920 - LW;
          // conservative widths (canvas measure can run before the web font is ready)
          const bfs = fitPx([w.big], 800, pixelFont, 74, (LW - 196) * 0.88);
          const sfs = fitPx([w.small], 700, pixelFont, 40, (LW - 196) * 0.88);
          const vbfs = fitPx([v.big], 800, pixelFont, 74, (RW - (v.bad ? 130 : 70)) * 0.88);
          const vsfs = fitPx([v.small], 700, pixelFont, 40, (RW - (v.bad ? 130 : 70)) * 0.88);
          return (
            <Die key={i} style={outer} inner={{ background: "#FFFDF8", height: cardH, boxSizing: "border-box", display: "flex", alignItems: "stretch", overflow: "hidden", position: "relative" }}>
              <div style={{ width: LW, display: "flex", alignItems: "center", gap: 16, padding: "0 18px", background: "#E6F6EC", boxSizing: "border-box", position: "relative" }}>
                <WhyGlyph icon={w.icon} size={92} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: bfs, lineHeight: 1, color: hot ? "#1F8A4C" : INK, whiteSpace: "nowrap" }}>{w.big}</div>
                  <div style={{ fontFamily: pixelFont, fontWeight: 700, fontSize: sfs, color: INK, marginTop: 8, lineHeight: 1.05, whiteSpace: "nowrap" }}>{w.small}</div>
                </div>
                <div style={{ position: "absolute", right: 14, top: 12 }}><Badge ok size={52} /></div>
              </div>
              <div style={{ width: 6, background: INK }} />
              {vk <= 0.001 && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#F1EEE8", fontFamily: pixelFont, fontWeight: 800, fontSize: 96, color: "rgba(11,16,32,.18)" }}>?</div>}
              {vk > 0.001 && <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 16px 0 52px", background: v.bad ? "#FDEBEC" : "#F1EEE8", position: "relative", opacity: Math.min(1, Math.max(0, vk) * 1.5), transform: `translateX(${(1 - Math.min(1, Math.max(0, vk))) * 120}px) scale(${vPulse})` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: vbfs, lineHeight: 1, color: v.bad ? "#D63A40" : INK, whiteSpace: "nowrap" }}>{v.big}</div>
                  <div style={{ fontFamily: pixelFont, fontWeight: 700, fontSize: vsfs, color: v.bad ? "#B4343A" : "#4E4840", marginTop: 8, lineHeight: 1.05, whiteSpace: "nowrap" }}>{v.small}</div>
                </div>
                {v.bad && <div style={{ position: "absolute", right: 14, top: 12 }}><Badge ok={false} size={52} /></div>}
              </div>}
              {vk > 0.001 && <div style={{ position: "absolute", left: LW - 34, top: cardH / 2 - 44, width: 76, height: 76, borderRadius: 38, background: INK, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.min(1.1, vk)})`, border: "4px solid #fff" }}>VS</div>}
            </Die>
          );
        }
        const sfs = w.big ? fitPx([w.small], 600, pixelFont, 38, 640) : fitPx([w.small], 800, pixelFont, 58, 640);
        return (
          <Die key={i} style={{ ...outer, top: card0 + i * step, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px) scale(${Math.max(0.001, k) * pulse}) rotate(${(i - 1) * 1.1}deg)` }}
            inner={{ background: "#FFFDF8", height: cardH, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, padding: "0 26px" }}>
            <WhyGlyph icon={w.icon} />
            <div style={{ minWidth: 0 }}>
              {w.big && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 66, lineHeight: 1, color: hot ? CLAUDE_ORANGE : INK }}>{w.big}</div>}
              <div style={{ fontFamily: pixelFont, fontWeight: w.big ? 600 : 800, fontSize: sfs, color: w.big ? "#4E4840" : INK, marginTop: w.big ? 6 : 0, lineHeight: 1.05, whiteSpace: "nowrap" }}>{w.small}</div>
            </div>
            <div style={{ marginLeft: "auto", flexShrink: 0, width: 64, height: 64, borderRadius: 32, background: GREEN, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 36, color: "#fff" }}>{i + 1}</div>
          </Die>
        );
      })}
    </>
  );
};
