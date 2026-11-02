import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// "Fake screen recording" of a real app click path (user request 2026-09-29):
// real retina screenshots of every state (scripts/capture-flow.mjs records
// them plus the exact element rectangles), and on top an animated macOS cursor
// that glides to the real button, a click ring, an orange focus highlight,
// typing revealed character by character, and a camera that zooms onto the
// area being used (Screen-Studio style, so it reads on a phone).
// All coordinates are the page's CSS px from flow.json; times are seconds in the clip.

export type Rect = { x: number; y: number; w: number; h: number };
export type FlowScreen = { at: number; shot: string };
export type FlowTyping = { from: number; to: number; shot: string; text: Rect; chars: number; field: Rect };
export type FlowCursor = { t: number; x: number; y: number; click?: boolean };
export type FlowCamera = { t: number; cx: number; cy: number; zoom: number };
export type FlowHighlight = { from: number; to: number; rect: Rect };

export type ScreenFlowProps = {
  dir: string; // folder in public/ with the screenshots
  viewport: { width: number; height: number };
  url: string;
  screens: FlowScreen[];
  typing?: FlowTyping[];
  cursor: FlowCursor[];
  camera: FlowCamera[];
  highlights?: FlowHighlight[];
  box: { x: number; y: number; w: number; h: number }; // window position on the 1080×1920 canvas
  accent?: [number, number, number]; // highlight + click ring RGB; default Superkind orange, @florentgpt uses red (mavgpt-edit-style.md)
};

const ease = Easing.bezier(0.45, 0, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BAR = 58;

const interpKeys = <K extends { t: number }>(keys: K[], t: number, fields: (keyof K)[]) => {
  const out: Record<string, number> = {};
  for (const f of fields) {
    if (keys.length === 1) out[f as string] = keys[0][f] as unknown as number;
    else out[f as string] = interpolate(t, keys.map((k) => k.t), keys.map((k) => k[f] as unknown as number), { ...clamp, easing: ease });
  }
  return out;
};

const Arrow: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 20 30" style={{ overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.35))" }}>
    <path d="M1 1 L1 23 L6.5 17.8 L10.3 27 L14 25.4 L10.3 16.6 L17.8 16.6 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export const ScreenFlow: React.FC<ScreenFlowProps> = ({ dir, viewport, url, screens, typing = [], cursor, camera, highlights = [], box, accent = [255, 107, 53] }) => {
  const rgb = accent.join(",");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const src = (s: string) => staticFile(`${dir}/${s}`);

  const cw = box.w;
  const ch = box.h - BAR;
  const cam = interpKeys(camera, t, ["cx", "cy", "zoom"]);
  // Page CSS px → content-area px.
  const toX = (x: number) => (x - cam.cx) * cam.zoom + cw / 2;
  const toY = (y: number) => (y - cam.cy) * cam.zoom + ch / 2;

  // Which screenshot is showing (short cross-fade into each new one).
  const idx = screens.reduce((a, s, i) => (t >= s.at ? i : a), 0);
  const prev = idx > 0 ? screens[idx - 1] : null;
  const fadeIn = prev ? interpolate(t, [screens[idx].at, screens[idx].at + 0.14], [0, 1], clamp) : 1;

  const cur = interpKeys(cursor, t, ["x", "y"]);
  const lastClick = [...cursor].reverse().find((k) => k.click && t >= k.t);
  const sinceClick = lastClick ? t - lastClick.t : 99;
  const press = sinceClick < 0.16 ? interpolate(sinceClick, [0, 0.06, 0.16], [1, 0.82, 1], clamp) : 1;
  const ring = interpolate(sinceClick, [0, 0.45], [0, 1], clamp);

  const pageLayer = (shot: string, opacity: number) => (
    <Img src={src(shot)} style={{ position: "absolute", left: 0, top: 0, width: viewport.width, height: viewport.height, opacity }} />
  );

  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: 26, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)" }}>
      {/* Browser bar */}
      <div style={{ height: BAR, background: "#F3F3F2", borderBottom: "1px solid #E4E4E2", display: "flex", alignItems: "center", padding: "0 22px", gap: 10 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, padding: "8px 22px", border: "1px solid #E4E4E2", fontFamily: fonts.medium, fontSize: 22, color: "#555" }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth={2.4}><rect x={4} y={11} width={16} height={10} rx={2} /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
            {url}
          </div>
        </div>
        <div style={{ width: 65 }} />
      </div>

      {/* Page content under the camera */}
      <div style={{ position: "absolute", left: 0, top: BAR, width: cw, height: ch, overflow: "hidden", background: "#FAF8F5" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: viewport.width, height: viewport.height, transformOrigin: "0 0", transform: `translate(${toX(0)}px, ${toY(0)}px) scale(${cam.zoom})` }}>
          {prev && fadeIn < 1 && pageLayer(prev.shot, 1)}
          {pageLayer(screens[idx].shot, fadeIn)}

          {/* Typing: the filled screenshot inside the field, covered right of the caret */}
          {typing.filter((ty) => t >= ty.from && t < (screens.find((s) => s.at > ty.from)?.at ?? 1e9)).map((ty, i) => {
            const p = interpolate(t, [ty.from, ty.to], [0, 1], clamp);
            const shown = Math.round(p * ty.chars) / ty.chars;
            const caretX = ty.text.x + ty.text.w * shown;
            const inner = { x: ty.field.x + 3, y: ty.field.y + 5, w: ty.field.w - 6, h: ty.field.h - 10 };
            const blink = p >= 1 ? (Math.floor(t * 2.2) % 2 === 0 ? 1 : 0) : 1;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: inner.x, top: inner.y, width: inner.w, height: inner.h, overflow: "hidden" }}>
                  <Img src={src(ty.shot)} style={{ position: "absolute", left: -inner.x, top: -inner.y, width: viewport.width, height: viewport.height }} />
                  <div style={{ position: "absolute", left: caretX - inner.x, top: 0, right: 0, bottom: 0, background: "#fff" }} />
                </div>
                <div style={{ position: "absolute", left: caretX + 1, top: ty.text.y + 14, width: 1.6, height: ty.text.h - 28, background: "#111", opacity: blink }} />
              </React.Fragment>
            );
          })}

          {/* Orange focus ring around the element to use */}
          {highlights.map((h, i) => {
            const o = interpolate(t, [h.from, h.from + 0.2, h.to - 0.15, h.to], [0, 1, 1, 0], clamp);
            if (o <= 0) return null;
            return <div key={i} style={{ position: "absolute", left: h.rect.x - 6, top: h.rect.y - 6, width: h.rect.w + 12, height: h.rect.h + 12, borderRadius: 30, border: `2.5px solid rgb(${rgb})`, boxShadow: `0 0 0 6px rgba(${rgb},0.14), 0 0 22px rgba(${rgb},0.35)`, opacity: o }} />;
          })}
        </div>

        {/* Click ring + cursor stay a constant size on screen */}
        {lastClick && ring < 1 && (
          <div style={{ position: "absolute", left: toX(lastClick.x) - 45 * ring, top: toY(lastClick.y) - 45 * ring, width: 90 * ring, height: 90 * ring, borderRadius: "50%", border: `3px solid rgba(${rgb},${0.8 * (1 - ring)})`, background: `rgba(${rgb},${0.18 * (1 - ring)})` }} />
        )}
        <div style={{ position: "absolute", left: toX(cur.x) - 2, top: toY(cur.y) - 2, transform: `scale(${press})`, transformOrigin: "2px 2px" }}>
          <Arrow size={30} />
        </div>
      </div>
    </div>
  );
};
