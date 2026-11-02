// Claude UI in the claudebyseb paper look + click path cursor + wood stage pieces for the Pixelwelt reels.
// All timing is in reel seconds (t), so a scene can be dropped into a master timeline as is.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { pixelFont } from "./PixelKit";
import { PxArt } from "./PixelSir";

const { fontFamily: serif } = loadSerif("normal", { weights: ["600"] });
export const claudeSerif = serif;

export const cl = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (v: number) => 1 - Math.pow(1 - cl(v), 3);
export const back = (v: number) => { const x = cl(v); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const rnd = (i: number) => { const v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); };

export const INK = "#1E1A16";
export const CLAUDE_ORANGE = "#D97757";
export const PANEL_H = 960;
export const STAGE_FLOOR = 1270;
// fixed hit points inside the window
export const UI = { plus: { x: 86, y: 872 }, input: { x: 300, y: 770 }, send: { x: 982, y: 872 }, bar: { x: 470, y: 112 } };

export const DIECUT = (o = 5) => `drop-shadow(${o}px 0 0 #fff) drop-shadow(-${o}px 0 0 #fff) drop-shadow(0 ${o}px 0 #fff) drop-shadow(0 -${o}px 0 #fff) drop-shadow(0 ${o * 1.8}px 0 rgba(0,0,0,.38))`;

export type PromptPart = { at: number; text: string; key?: string; color?: string };
export type Reply = { at: number; name: string; avatar: string; text: string; hl?: { word: string; color: string }[] };

const CPS = 42;
const typedLen = (p: PromptPart[], t: number) => p.map((x) => Math.max(0, Math.min(x.text.length, Math.floor((t - x.at) * CPS))));
export const isTyping = (p: PromptPart[], t: number) => p.some((x) => t > x.at && t < x.at + x.text.length / CPS);

// renders text, highlighting the key word once it is fully typed
const Typed: React.FC<{ part: PromptPart; n: number }> = ({ part, n }) => {
  const shown = part.text.slice(0, n);
  if (!part.key) return <>{shown}</>;
  const i = part.text.indexOf(part.key);
  if (i < 0 || n <= i) return <>{shown}</>;
  const done = n >= i + part.key.length;
  return (
    <>
      {shown.slice(0, i)}
      <span style={{ background: done ? part.color : "transparent", borderRadius: 10, padding: "0 6px", boxShadow: done ? "0 4px 0 rgba(0,0,0,.18)" : "none" }}>{shown.slice(i, i + part.key.length)}</span>
      {shown.slice(i + part.key.length)}
    </>
  );
};

const HL: React.FC<{ text: string; hl?: Reply["hl"] }> = ({ text, hl }) => {
  if (!hl?.length) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let rest = text, k = 0;
  while (rest.length) {
    let best: { i: number; h: { word: string; color: string } } | null = null;
    for (const h of hl) { const i = rest.indexOf(h.word); if (i >= 0 && (!best || i < best.i)) best = { i, h }; }
    if (!best) { out.push(rest); break; }
    out.push(rest.slice(0, best.i));
    out.push(<span key={k++} style={{ background: best.h.color, borderRadius: 8, padding: "0 5px" }}>{best.h.word}</span>);
    rest = rest.slice(best.i + best.h.word.length);
  }
  return <>{out}</>;
};

export const ClaudeWindow: React.FC<{
  t: number; enter: number; prompt: PromptPart[]; sendAt?: number; focusAt?: number;
  attach?: { at: number; nodes: React.ReactNode[] }; reply?: Reply; placeholder?: string;
}> = ({ t, enter, prompt, sendAt = 999, focusAt = enter + 0.6, attach, reply, placeholder = "Schreib Claude …" }) => {
  const drop = back((t - enter) / 0.5);
  const lens = typedLen(prompt, t);
  const typing = isTyping(prompt, t);
  const sent = t >= sendAt;
  const sendPop = 1 + 0.25 * Math.max(0, 1 - Math.abs(t - sendAt) / 0.2);
  const focus = t > focusAt && !sent;
  const fullPrompt = prompt.map((p) => p.text).join("");
  const att = attach && t >= attach.at ? attach.nodes : [];
  const replyN = reply ? Math.max(0, Math.floor((t - reply.at) * 58)) : 0;
  const replyText = reply ? reply.text.slice(0, replyN) : "";
  const fs = att.length && !sent ? 38 : 44;
  return (
    <div style={{ position: "absolute", left: 0, top: -PANEL_H * (1 - drop), width: 1080, height: PANEL_H }}>
      <div style={{ position: "absolute", inset: 0, background: "#F4EFE5", borderBottom: `8px solid ${INK}`, boxShadow: "0 18px 0 rgba(0,0,0,.35)", overflow: "hidden" }}>
        <svg width="1080" height={PANEL_H} style={{ position: "absolute", inset: 0, opacity: 0.22 }}>
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" /><feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0.5 0" /></filter>
          <rect width="1080" height={PANEL_H} filter="url(#grain)" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 88, background: "#EAE3D5", borderTop: `6px solid ${INK}`, borderBottom: `6px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 22, display: "flex", gap: 12 }}>
            {["#E5534B", "#E9B23A", "#3FB950"].map((c) => <div key={c} style={{ width: 30, height: 30, borderRadius: 15, background: c, border: `3px solid ${INK}` }} />)}
          </div>
          <Img src={staticFile("logos/claude.svg")} style={{ width: 44, height: 44, marginRight: 14 }} />
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: INK }}>Claude</div>
        </div>
        {/* greeting until the message is sent */}
        {!sent && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, opacity: ease((t - enter - 0.3) / 0.3) }}>
              <Img src={staticFile("logos/claude.svg")} style={{ width: 74, height: 74, transform: `rotate(${t * 40}deg)` }} />
              <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 74, color: "#1A1714" }}>Wie kann ich dir helfen?</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 18 }}>
              {["Schreiben", "Lernen", "Code", "Recherche"].map((c, i) => (
                <div key={c} style={{ fontFamily: pixelFont, fontWeight: 600, fontSize: 34, color: "#4A443C", padding: "10px 26px", borderRadius: 40, border: "3px solid #CFC6B5", background: "#EFE8DA", transform: `scale(${back((t - enter - 0.45 - i * 0.06) / 0.35)})` }}>{c}</div>
              ))}
            </div>
          </>
        )}
        {/* conversation after sending */}
        {sent && (
          <div style={{ position: "absolute", left: 40, right: 40, top: 190 }}>
            <div style={{ marginLeft: "auto", maxWidth: 820, width: "fit-content", background: "#E9E1D1", border: `4px solid ${INK}`, borderRadius: 26, padding: "14px 22px", fontFamily: pixelFont, fontWeight: 600, fontSize: 32, lineHeight: 1.25, color: INK, transform: `translateY(${(1 - ease((t - sendAt) / 0.3)) * 260}px) scale(${0.8 + 0.2 * ease((t - sendAt) / 0.3)})`, transformOrigin: "right bottom", display: "flex", gap: 12, alignItems: "center" }}>
              {attach && <div style={{ display: "flex", gap: 6 }}>{attach.nodes.map((n, i) => <div key={i} style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", border: `3px solid ${INK}` }}>{n}</div>)}</div>}
              <span>{fullPrompt}</span>
            </div>
            {reply && t >= reply.at - 0.3 && (
              <div style={{ display: "flex", gap: 18, marginTop: 22, alignItems: "flex-start", opacity: ease((t - reply.at + 0.3) / 0.25) }}>
                <div style={{ flex: "0 0 auto", width: 74, height: 74, borderRadius: 18, background: reply.avatar, border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div style={{ width: 9, height: 20, background: INK }} /><div style={{ width: 9, height: 20, background: INK }} />
                </div>
                <div>
                  <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 28, color: "#6B635A", letterSpacing: 1 }}>{reply.name}</div>
                  <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: INK }}>
                    {replyN === 0 ? <span style={{ color: "#A39C90" }}>{".".repeat(1 + (Math.floor(t * 6) % 3))}</span> : <HL text={replyText} hl={replyN >= reply.text.length ? reply.hl : undefined} />}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* input card */}
        <div style={{ position: "absolute", left: 28, right: 28, top: 590, height: 340, background: "#FFFFFF", border: `7px solid ${INK}`, borderRadius: 34, boxShadow: focus ? "0 0 0 8px rgba(217,119,87,.35), 0 12px 0 rgba(0,0,0,.25)" : "0 12px 0 rgba(0,0,0,.25)" }}>
          {!sent && att.length > 0 && (
            <div style={{ position: "absolute", left: 30, top: 22, display: "flex", gap: 14 }}>
              {att.map((n, i) => (
                <div key={i} style={{ width: 120, height: 120, borderRadius: 16, overflow: "hidden", border: `4px solid ${INK}`, transform: `scale(${back((t - attach!.at - i * 0.12) / 0.35)}) rotate(${i % 2 ? 3 : -3}deg)`, boxShadow: "0 6px 0 rgba(0,0,0,.25)" }}>{n}</div>
              ))}
            </div>
          )}
          <div style={{ position: "absolute", left: 34, right: 34, top: att.length && !sent ? 158 : 26, fontFamily: pixelFont, fontWeight: 600, fontSize: fs, lineHeight: 1.3, color: INK }}>
            {sent ? <span style={{ color: "#A39C90" }}>Antworten …</span> : lens.every((n) => n === 0) ? <span style={{ color: "#A39C90" }}>{placeholder}</span> : prompt.map((p, i) => <Typed key={i} part={p} n={lens[i]} />)}
            {focus && <span style={{ display: "inline-block", width: 5, height: fs + 2, marginLeft: 3, background: CLAUDE_ORANGE, verticalAlign: -8, opacity: typing || Math.floor(t * 3) % 2 ? 1 : 0 }} />}
          </div>
          <div style={{ position: "absolute", left: 26, bottom: 22, width: 64, height: 64, borderRadius: 32, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 700, fontFamily: pixelFont, background: attach && Math.abs(t - attach.at + 0.1) < 0.15 ? "#F6D9CD" : "transparent" }}>+</div>
          <div style={{ position: "absolute", right: 140, bottom: 34, fontFamily: pixelFont, fontWeight: 500, fontSize: 34, color: "#7C756A" }}>Opus 5.5</div>
          <div style={{ position: "absolute", right: 22, bottom: 16, width: 96, height: 80, borderRadius: 22, background: sent ? "#B85C3E" : CLAUDE_ORANGE, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sendPop})`, boxShadow: "0 6px 0 rgba(0,0,0,.3)" }}>
            <svg width="44" height="44" viewBox="0 0 10 10"><path d="M5 1 L5 9 M5 1 L2 4 M5 1 L8 4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="square" /></svg>
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 60 + rnd(i) * 960, top: 190 + rnd(i + 4) * 360, color: "#E3B341", fontSize: 26, opacity: 0.25 + 0.6 * Math.abs(Math.sin(t * 2 + i)), transform: `rotate(${t * 60 + i * 30}deg)` }}>✦</div>
        ))}
      </div>
    </div>
  );
};

// ---------- click path ----------
export type Click = { t: number; n: number; x: number; y: number; mx: number; my: number; until?: number }; // until (optional): badge disappears after this time
const HAND = ["..KK......", ".KWWK.....", ".KWWK.....", ".KWWKKK...", ".KWWKWWKK.", "KKWWKWWKWK", "KWWWWWWKWK", "KWWWWWWWWK", ".KWWWWWWWK", "..KWWWWWK.", "...KKKKK.."];

export const ClickPath: React.FC<{ t: number; clicks: Click[]; start: { t: number; x: number; y: number } }> = ({ t, clicks, start }) => {
  // the cursor flies to each click and arrives just before it
  const pts = [start, ...clicks.flatMap((c) => [{ t: c.t - 0.05, x: c.x, y: c.y }, { t: c.t + 0.15, x: c.x, y: c.y }])];
  let pos = pts[pts.length - 1];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (t <= b.t) {
      const travel = Math.min(0.45, b.t - a.t);
      const k = ease((t - (b.t - travel)) / travel);
      const arc = Math.sin(k * Math.PI) * 60;
      pos = { t, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k - arc };
      break;
    }
  }
  const press = clicks.some((k) => t >= k.t && t < k.t + 0.12);
  return (
    <>
      {clicks.map((k) => {
        const p = back((t - k.t) / 0.35);
        const ring = cl((t - k.t) / 0.45);
        return t >= k.t - 0.02 && (k.until === undefined || t < k.until) ? (
          <React.Fragment key={k.n}>
            <div style={{ position: "absolute", left: k.x - 70 * ring, top: k.y - 70 * ring, width: 140 * ring, height: 140 * ring, borderRadius: "50%", border: `6px solid rgba(217,119,87,${1 - ring})` }} />
            <div style={{ position: "absolute", left: k.mx, top: k.my, width: 62, height: 62, borderRadius: 31, background: CLAUDE_ORANGE, border: "5px solid #fff", boxShadow: "0 6px 0 rgba(0,0,0,.35)", color: "#fff", fontFamily: pixelFont, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>{k.n}</div>
          </React.Fragment>
        ) : null;
      })}
      <div style={{ position: "absolute", left: pos.x - 14, top: pos.y - 6, transform: `scale(${press ? 0.85 : 1}) rotate(-12deg)`, transformOrigin: "20% 10%", filter: "drop-shadow(0 8px 0 rgba(0,0,0,.35))" }}>
        <PxArt rows={HAND} pal={{ K: INK, W: "#FFFFFF" }} px={9} />
      </div>
    </>
  );
};

// ---------- wood stage ----------
export const WoodStage: React.FC<{ top?: number; floor?: number; t: number; plaque?: string; lamps?: boolean }> = ({ top = PANEL_H, floor = STAGE_FLOOR, t, plaque, lamps }) => (
  <AbsoluteFill style={{ background: "linear-gradient(#4A2C1A, #3A2214 60%, #2A170D)" }}>
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: i * 128, top: 0, width: 124, height: floor, background: i % 2 ? "rgba(255,210,160,.035)" : "rgba(0,0,0,.06)", borderLeft: "4px solid rgba(0,0,0,.28)" }} />
    ))}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: 40 + i * 345, top: top + 40, width: 310, height: floor - top - 70, border: "6px solid rgba(0,0,0,.22)", borderRadius: 10 }} />
    ))}
    {lamps && [180, 540, 900].map((x, i) => (
      <React.Fragment key={x}>
        <div style={{ position: "absolute", left: x - 230, top: top + 150, width: 460, height: floor - top - 150, background: "linear-gradient(rgba(255,226,160,.30), rgba(255,226,160,0))", clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)", opacity: 0.75 + 0.25 * Math.sin(t * 2 + i) }} />
        <div style={{ position: "absolute", left: x - 80, top: top + 120, width: 160, height: 34, borderRadius: 20, background: "linear-gradient(#FFF2C2,#D9B25A)", border: `5px solid ${INK}`, boxShadow: "0 0 40px rgba(255,220,140,.8)" }} />
      </React.Fragment>
    ))}
    {plaque && (
      <div style={{ position: "absolute", left: 140, right: 140, top: top + 20, height: 90, background: "linear-gradient(#E9CC7A,#B8913C)", border: `6px solid ${INK}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: pixelFont, fontWeight: 900, fontSize: 54, letterSpacing: 3, color: "#2A1F0E", boxShadow: "0 8px 0 rgba(0,0,0,.35), 0 0 40px rgba(255,210,120,.35)" }}>
        <span style={{ fontSize: 40 }}>✦</span>{plaque}<span style={{ fontSize: 40 }}>✦</span>
      </div>
    )}
    <div style={{ position: "absolute", left: 0, right: 0, top: floor, bottom: 0, background: "linear-gradient(#3B2214, #24130B)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: floor - 6, height: 14, background: "linear-gradient(#E4C06A, #A8822E)", boxShadow: "0 6px 0 rgba(0,0,0,.35)" }} />
    {Array.from({ length: 22 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 40 + rnd(i) * 1000, top: floor + 30 + rnd(i + 8) * 600, width: 6, height: 6, background: "#FFE1A8", opacity: 0.2 + 0.5 * Math.abs(Math.sin(t * 2 + i)) }} />
    ))}
  </AbsoluteFill>
);

// pixel props as die-cut stickers
export const PROPS: Record<string, { rows: string[]; pal: Record<string, string> }> = {
  dumbbell: { rows: ["KK.........KK", "KKK.......KKK", "KKKMMMMMMMKKK", "KKK.......KKK", "KK.........KK"], pal: { K: "#2A2630", M: "#AEB6C4" } },
  bottle: { rows: ["..KK..", ".KwwK.", "KccccK", "KcwccK", "KcwccK", "KccccK", "KccccK", ".KKKK."], pal: { K: INK, c: "#5FD3E0", w: "#FFFFFF" } },
  shoe: { rows: [".....KKK...", "....KrrrK..", "...KrrwrrK.", "KKKrrrrrrrK", "KwwwwwwwwwK", "KKKKKKKKKKK"], pal: { K: INK, r: "#E8574E", w: "#FFFFFF" } },
  kettle: { rows: ["..KKK..", ".K...K.", "KKKKKKK", "KkkkkkK", "KkhkkkK", "KkkkkkK", ".KKKKK."], pal: { K: INK, k: "#2FBF71", h: "#FFFFFF" } },
  apple: { rows: ["...g..", "..g...", ".RRRR.", "RRwRRR", "RRRRRR", "RRRRRR", ".RRRR."], pal: { g: "#3C8A3A", R: "#D9483E", w: "#FFFFFF" } },
  sofa: { rows: [".KKKKKKKKKKKK.", "KppppppppppppK", "KppppppppppppK", "KKKKKKKKKKKKKK", "KPKppppppppKPK", "KPKKKKKKKKKKPK", "KPPPPPPPPPPPPK", "KKKKKKKKKKKKKK", ".K..........K."], pal: { K: INK, p: "#C77DFF", P: "#9B57D6" } },
  mat: { rows: ["KKKKKKKKKKKKKK", "KbbbbbbbbbbbbK", "KbBbbbbbbbbBbK", "KbbbbbbbbbbbbK", "KKKKKKKKKKKKKK"], pal: { K: INK, b: "#4FB0E8", B: "#FFFFFF" } },
  rack: { rows: ["K............K", "KKKKKKKKKKKKKK", "K.rr.gg.bb.yyK", "KrrrrggggbbyyK", "KKKKKKKKKKKKKK", "K.rr.gg.bb.yyK", "KrrrrggggbbyyK", "KKKKKKKKKKKKKK", "K............K"], pal: { K: INK, r: "#E8574E", g: "#2FBF71", b: "#4F8BE0", y: "#F0C04C" } },
  band: { rows: ["..KKKK..", ".KyyyyK.", "Ky....yK", "Ky....yK", "Ky....yK", ".KyyyyK.", "..KKKK.."], pal: { K: INK, y: "#FFB347" } },
};

export const PropSticker: React.FC<{ k: string; x: number; y: number; px: number; r?: number; at?: number; t: number; bob?: number }> = ({ k, x, y, px, r = 0, at, t, bob = 0 }) => {
  const s = at === undefined ? 1 : back((t - at) / 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y - Math.abs(Math.sin(t * 2.4 + x)) * bob, transform: `rotate(${r}deg) scale(${s})`, transformOrigin: "50% 100%", filter: DIECUT(5) }}>
      <PxArt rows={PROPS[k].rows} pal={PROPS[k].pal} px={px} />
    </div>
  );
};

// blocky helper (our trainers) as 2D pixel sprite
export const BUDDY_COLORS: Record<string, { b: string; d: string; a: string }> = {
  athletik: { b: "#5E8FE0", d: "#3E62A8", a: "#FFFFFF" },
  physio: { b: "#5CC08A", d: "#3A8A60", a: "#FFFFFF" },
  kraft: { b: "#EE7B4E", d: "#B4532F", a: "#2A2220" },
  explosiv: { b: "#F0C04C", d: "#B88D24", a: "#FF4F6E" },
  coach: { b: "#9AA3B5", d: "#6B7385", a: "#E8574E" },
};
export const buddyRows = (blink = false, legs = 0) => [
  "..AAAAAAAAAA..",
  ".BBBBBBBBBBBB.",
  ".BBBBBBBBBBBB.",
  blink ? ".BBBBBBBBBBBB." : ".BBKKBBBBKKBB.",
  blink ? ".BBKKBBBBKKBB." : ".BBKKBBBBKKBB.",
  ".BBBBBBBBBBBB.",
  "BBBBBBMMBBBBBB",
  ".BBBBBBBBBBBB.",
  ".DDDDDDDDDDDD.",
  legs ? "..D.D....D.D.." : "..D..D..D..D..",
  legs ? ".D..D....D..D." : "..D..D..D..D..",
];
export const Buddy: React.FC<{ kind: keyof typeof BUDDY_COLORS; x: number; floorY: number; px: number; t: number; at?: number; seed?: number; label?: string; hop?: number }> = ({ kind, x, floorY, px, t, at, seed = 0, label, hop = 1 }) => {
  const c = BUDDY_COLORS[kind];
  const s = at === undefined ? 1 : back((t - at) / 0.4);
  const jump = Math.abs(Math.sin(t * 5 + seed)) * 10 * hop;
  const blink = (t + seed) % 2.6 < 0.1;
  const w = 14 * px, h = 11 * px;
  return (
    <>
      <div style={{ position: "absolute", left: x - w * 0.4, top: floorY - 10, width: w * 0.8, height: 20, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.5), transparent)", transform: `scale(${s})` }} />
      <div style={{ position: "absolute", left: x - w / 2, top: floorY - h - jump, transform: `scale(${s})`, transformOrigin: "50% 100%", filter: DIECUT(Math.max(4, px * 0.6)) }}>
        <PxArt rows={buddyRows(blink, Math.floor(t * 6 + seed) % 2)} pal={{ A: c.a, B: c.b, D: c.d, K: INK, M: "#3A1712" }} px={px} />
      </div>
      {label && (
        <div style={{ position: "absolute", left: x - 110, width: 220, top: floorY + 14, textAlign: "center", transform: `scale(${s})` }}>
          <span style={{ background: "#F6EEDC", border: `4px solid ${INK}`, borderLeft: `14px solid ${c.b}`, borderRadius: 10, padding: "4px 12px", fontFamily: pixelFont, fontWeight: 900, fontSize: 26, letterSpacing: 1, color: c.d }}>{label}</span>
        </div>
      )}
    </>
  );
};
