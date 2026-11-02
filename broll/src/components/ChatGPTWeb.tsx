import React from "react";
import { Easing, interpolate } from "remotion";

// ChatGPT web app (light), v2 (Henri 2026-10-21): built in real CSS pixels from chatgpt.com (measured in the browser:
// sidebar 260 px on #FCFCFC, rows 36 px / 14 px text / radius 10, composer 52 px high / radius 28 / layered shadow,
// heading 24 px, system font) plus the logged-in layout from Henri's screenshot (icon rail, "Angeheftet / Projekte /
// Letzte", "Chat | Work", "Mittel ⌄", blue voice button). Filmed with WebCam like a zoomed screen recording, with a real
// cursor, hover/press states and real scroll offsets. Only the UI is copied: all chat titles are invented per video.

export const W = { w: 900, h: 800, rail: 52, side: 260 }; // narrow window, so the thread column fits a 9:16 crop
export const MAIN_X = W.rail + W.side; // 312
export const MAIN_W = W.w - MAIN_X; // 968
export const COL = { cx: MAIN_X + MAIN_W / 2, w: 500 }; // thread / composer column
export const C = {
  bg: "#FCFCFC", side: "#F9F9F9", ink: "#0D0D0D", sub: "#5D5D5D", mute: "#8F8F8F", line: "#E8E8E8",
  hover: "#EFEFEF", active: "#E8E8E8", bubble: "#F3F3F3", blue: "#2F7CF6", select: "rgba(47,124,246,0.28)",
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Inter, Arial, sans-serif',
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

// ---------- icons (paths from chatgpt.com where complete, simple strokes otherwise) ----------
const P = {
  pencil: "M8.17 2.5a.67.67 0 0 1 0 1.33H5.83a2 2 0 0 0-2 2v8.34a2 2 0 0 0 2 2h8.34a2 2 0 0 0 2-2v-2.34a.67.67 0 0 1 1.33 0v2.34a3.33 3.33 0 0 1-3.33 3.33H5.83a3.33 3.33 0 0 1-3.33-3.33V5.83A3.33 3.33 0 0 1 5.83 2.5zM13.43 3.1a2.44 2.44 0 0 1 3.45 3.47l-5.16 5.2a2.6 2.6 0 0 1-1.55.85l-2.39.53a.81.81 0 0 1-.97-.97l.53-2.38c.13-.6.43-1.14.86-1.56z",
  plus: "M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z",
  mic: "M18.49 13.25a1 1 0 0 1 1.85.75A8.26 8.26 0 0 1 13 19.57V22a1 1 0 1 1-2 0v-2.43A8.26 8.26 0 0 1 3.65 14a1 1 0 0 1 1.86-.75 6.75 6.75 0 0 0 12.98 0zM12 1.13a5 5 0 0 1 5 5v4.48a5 5 0 1 1-10 0V6.13a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v4.48a3 3 0 1 0 6 0V6.13a3 3 0 0 0-3-3z",
  up: "M12 5.5a1 1 0 0 1 .7.3l5.5 5.5a1 1 0 0 1-1.4 1.4L13 8.9V18a1 1 0 1 1-2 0V8.9l-3.8 3.8a1 1 0 0 1-1.4-1.4l5.5-5.5a1 1 0 0 1 .7-.3z",
};
const Svg: React.FC<{ d: string; s?: number; c?: string; vb?: number }> = ({ d, s = 20, c = C.ink, vb = 24 }) => (
  <svg width={s} height={s} viewBox={`0 0 ${vb} ${vb}`}><path d={d} fill={c} /></svg>
);
const Stroke: React.FC<{ d: string; s?: number; c?: string }> = ({ d, s = 20, c = C.sub }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const S = {
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z", clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  lib: "M4 4h4v16H4zM10 4h4v16h-4zM16 5l4 1-3 14-4-1z", grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  dots: "M5 12h.01M12 12h.01M19 12h.01", bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20h4", search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", chev: "M6 9l6 6 6-6", refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0", spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01", logout: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10",
};

// ---------- layout constants the scenes aim the cursor at ----------
export const POS = {
  newChat: { x: W.rail + 120, y: 74 },
  profile: { x: W.rail + 110, y: W.h - 32 },
  recentY: (i: number) => 382 + i * 36, // centre of the i-th "Letzte" row (unscrolled)
  composerHome: { x: COL.cx, y: 372 },
  sendHome: { x: COL.cx + COL.w / 2 - 28, y: 372 },
  composerThread: { x: COL.cx, y: W.h - 58 },
  sendThread: { x: COL.cx + COL.w / 2 - 28, y: W.h - 58 },
  menu: (i: number) => ({ x: W.rail + 120, y: 593 + i * 38 }), // profile menu rows
};

export type SideData = { pinned: string[]; projects: { name: string; chats?: string[] }[]; recent: string[]; account: { initials: string; name: string; plan?: string } };
export type ThreadMsg = { role: "user" | "assistant"; content: React.ReactNode };
export type WebState = {
  side: SideData;
  active?: string; // highlighted chat
  hover?: string; // hovered element id ("newChat", "profile", "send", "chat:<title>", "menu:<i>", "manage")
  newPop?: number; // 0..1 slide-in of recent[0]
  sideScroll?: number;
  view: "home" | "thread";
  title?: string;
  messages?: ThreadMsg[];
  threadScroll?: number;
  composer?: string;
  caret?: boolean;
  sendPress?: number;
  overlay?: React.ReactNode; // menus / modals in app coordinates
  cursor?: { x: number; y: number; down?: number; ring?: number } | null;
};

const Row: React.FC<{ id?: string; st: WebState; text: string; icon?: React.ReactNode; indent?: boolean; style?: React.CSSProperties }> = ({ id, st, text, icon, indent, style }) => {
  const on = id && (st.active === text || st.hover === id);
  return (
    <div style={{ height: 36, margin: "0 8px", padding: `0 10px 0 ${indent ? 34 : 10}px`, borderRadius: 10, display: "flex", alignItems: "center", gap: 8, background: st.active === text ? C.active : on ? C.hover : "transparent", fontSize: 14, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", ...style }}>
      {icon}<span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
    </div>
  );
};
const Label: React.FC<{ text: string }> = ({ text }) => <div style={{ height: 32, padding: "12px 18px 0", fontSize: 13, color: C.mute }}>{text}</div>;

const Sidebar: React.FC<{ st: WebState }> = ({ st }) => {
  const d = st.side;
  return (
    <div style={{ position: "absolute", left: W.rail, top: 0, width: W.side, height: W.h, background: C.side, borderRight: `1px solid ${C.line}`, overflow: "hidden" }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 14px 0 18px" }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>ChatGPT</span><Stroke d={S.chev} s={16} c={C.mute} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}><Stroke d={S.bell} s={18} /><Stroke d={S.search} s={18} /></div>
      </div>
      <Row id="newChat" st={{ ...st, active: st.hover === "newChat" ? undefined : st.active }} text="Neuer Chat" icon={<Svg d={P.pencil} s={18} vb={20} />} style={{ background: st.hover === "newChat" ? C.active : C.hover }} />
      <div style={{ transform: `translateY(${-(st.sideScroll || 0)}px)` }}>
        <Label text="Angeheftet" />
        {d.pinned.map((p) => <Row key={p} id={`chat:${p}`} st={st} text={p} />)}
        <Label text="Projekte" />
        {d.projects.map((p) => (
          <React.Fragment key={p.name}>
            <Row st={st} text={p.name} icon={<Stroke d={S.folder} s={17} />} />
            {(p.chats || []).map((c) => <Row key={c} id={`chat:${c}`} st={st} text={c} indent />)}
          </React.Fragment>
        ))}
        <Label text="Letzte" />
        {d.recent.map((r, i) => {
          const pop = i === 0 && st.newPop !== undefined ? st.newPop : 1;
          return (
            <div key={r + i} style={{ height: 36 * Math.min(1, pop * 1.6), opacity: pop, transform: `translateX(${(1 - pop) * -24}px)`, overflow: "hidden" }}>
              <Row id={`chat:${r}`} st={st} text={r} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: C.side, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center" }}>
        <div style={{ margin: "0 8px", flex: 1, height: 48, borderRadius: 10, padding: "0 10px", display: "flex", alignItems: "center", gap: 10, background: st.hover === "profile" ? C.hover : "transparent" }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: "#3A3A3A", color: "#fff", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.account.initials}</div>
          <div style={{ fontSize: 14, lineHeight: "18px" }}>{d.account.name}<div style={{ fontSize: 12, color: C.mute }}>{d.account.plan}</div></div>
        </div>
      </div>
    </div>
  );
};

const Rail: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W.rail, height: W.h, background: C.side, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 18 }}>
    <div style={{ width: 34, height: 34, borderRadius: 9, background: C.active, display: "flex", alignItems: "center", justifyContent: "center" }}><Stroke d={S.home} s={18} c={C.ink} /></div>
    {[S.clock, S.lib, S.grid, S.spark, S.dots].map((d, i) => <Stroke key={i} d={d} s={18} />)}
  </div>
);

export const Composer: React.FC<{ st: WebState; width: number }> = ({ st, width }) => {
  const txt = st.composer || "";
  const pressed = st.sendPress || 0;
  return (
    <div style={{ width, height: 52, borderRadius: 28, background: "#fff", boxShadow: "rgba(0,0,0,0.06) 0 0 0 1px, rgba(0,0,0,0.05) 0 2px 8px 0, rgba(0,0,0,0.03) 0 4px 80px 8px", display: "flex", alignItems: "center", padding: "0 8px 0 6px", gap: 6 }}>
      <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}><Svg d={P.plus} s={20} /></div>
      <div style={{ flex: 1, fontSize: 17, lineHeight: "24px", color: txt ? C.ink : "#9B9B9B", whiteSpace: "nowrap", overflow: "hidden" }}>
        {txt || "ChatGPT fragen"}{st.caret ? <span style={{ display: "inline-block", width: 1.5, height: 20, background: C.ink, marginLeft: 1, verticalAlign: "-4px" }} /> : null}
      </div>
      <span style={{ fontSize: 14, color: C.mute, display: "flex", alignItems: "center", gap: 2, marginRight: 4 }}>Mittel<Stroke d={S.chev} s={14} c={C.mute} /></span>
      <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}><Svg d={P.mic} s={19} c={C.sub} /></div>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: txt ? C.ink : C.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.12 * pressed})`, opacity: st.hover === "send" ? 0.85 : 1 }}>
        {txt ? <Svg d={P.up} s={20} c="#fff" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="9" width="2.2" height="6" rx="1.1" /><rect x="9" y="6" width="2.2" height="12" rx="1.1" /><rect x="13" y="8" width="2.2" height="8" rx="1.1" /><rect x="17" y="10" width="2.2" height="4" rx="1.1" /></svg>}
      </div>
    </div>
  );
};

/** macOS arrow cursor (app coordinates), `down` 0..1 = pressed, `ring` 0..1 = click ripple */
const Cursor: React.FC<{ c: NonNullable<WebState["cursor"]> }> = ({ c }) => (
  <div style={{ position: "absolute", left: c.x, top: c.y, zIndex: 100, pointerEvents: "none" }}>
    {c.ring !== undefined && c.ring > 0 && c.ring < 1 ? <div style={{ position: "absolute", left: -18 * c.ring - 4, top: -18 * c.ring - 4, width: 8 + 36 * c.ring, height: 8 + 36 * c.ring, borderRadius: "50%", border: `2px solid ${C.blue}`, opacity: 1 - c.ring }} /> : null}
    <svg width="22" height="22" viewBox="0 0 22 22" style={{ position: "absolute", left: -2, top: -1, transform: `scale(${1 - 0.12 * (c.down || 0)})`, transformOrigin: "2px 1px", filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))" }}>
      <path d="M2 1.5v16.2l4.2-4 2.7 6.3 2.6-1.1-2.7-6.2h5.9z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  </div>
);

export const ChatGPTWeb: React.FC<{ st: WebState }> = ({ st }) => (
  <div style={{ position: "relative", width: W.w, height: W.h, background: C.bg, overflow: "hidden", fontFamily: C.font, color: C.ink }}>
    <Rail />
    <Sidebar st={st} />
    <div style={{ position: "absolute", left: MAIN_X, top: 0, width: MAIN_W, height: W.h, overflow: "hidden" }}>
      {st.view === "thread" ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 96, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: (MAIN_W - COL.w) / 2, width: COL.w, top: 76 - (st.threadScroll || 0), display: "flex", flexDirection: "column", gap: 26 }}>
              {(st.messages || []).map((m, i) => m.role === "user"
                ? <div key={i} style={{ alignSelf: "flex-end", maxWidth: "72%", background: C.bubble, borderRadius: 18, padding: "10px 16px", fontSize: 16, lineHeight: "24px" }}>{m.content}</div>
                : <div key={i} style={{ fontSize: 16, lineHeight: "28px" }}>{m.content}</div>)}
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, background: `linear-gradient(${C.bg} 70%, rgba(252,252,252,0))` }} />
          <div style={{ position: "absolute", left: (MAIN_W - COL.w) / 2, bottom: 32 }}><Composer st={st} width={COL.w} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontSize: 11.5, color: C.mute }}>ChatGPT kann Fehler machen. Überprüfe wichtige Informationen.</div>
        </>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <div style={{ fontSize: 24, lineHeight: "28px" }}>Was steht heute an?</div>
          <Composer st={st} width={COL.w} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 12, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", background: "#F0F0F0", borderRadius: 18, padding: 3 }}>
          <div style={{ padding: "5px 16px", borderRadius: 15, background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 500 }}>Chat</div>
          <div style={{ padding: "5px 16px", fontSize: 13, fontWeight: 500, color: C.sub }}>Work</div>
        </div>
      </div>
      {st.title && st.view === "thread" ? <div style={{ position: "absolute", left: 18, top: 18, fontSize: 14, color: C.ink }}>{st.title}</div> : null}
      <div style={{ position: "absolute", right: 16, top: 16 }}><Stroke d={S.refresh} s={18} /></div>
    </div>
    {st.overlay}
    {st.cursor ? <Cursor c={st.cursor} /> : null}
  </div>
);

// ---------- overlays ----------
export const ProfileMenu: React.FC<{ p: number; hover?: number }> = ({ p, hover }) => {
  const items = [{ t: "Personalisierung", d: S.spark }, { t: "Einstellungen", d: S.gear }, { t: "Hilfe", d: S.help }, { t: "Abmelden", d: S.logout }];
  return (
    <div style={{ position: "absolute", left: W.rail + 8, width: W.side - 16, bottom: 64 + 4, background: "#fff", borderRadius: 16, boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 10px 30px rgba(0,0,0,0.14)", padding: "6px 0", opacity: p, transform: `translateY(${(1 - p) * 8}px) scale(${0.97 + 0.03 * p})`, transformOrigin: "50% 100%" }}>
      {items.map((it, i) => (
        <div key={it.t} style={{ height: 38, margin: "0 6px", padding: "0 10px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, fontSize: 14, background: hover === i ? C.hover : "transparent" }}><Stroke d={it.d} s={17} c={C.ink} />{it.t}</div>
      ))}
    </div>
  );
};

/** Settings dialog on the "Personalisierung" tab with the memory section; `manageHover` highlights "Verwalten". */
export const SettingsDialog: React.FC<{ p: number; manageHover?: boolean; managePress?: number }> = ({ p, manageHover, managePress = 0 }) => {
  const tabs = ["Allgemein", "Benachrichtigungen", "Personalisierung", "Apps", "Datenkontrollen", "Sicherheit", "Konto"];
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.32 * p})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 680, height: 470, background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", overflow: "hidden", opacity: p, transform: `scale(${0.96 + 0.04 * p})` }}>
        <div style={{ width: 190, background: C.side, padding: "16px 8px", borderRight: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 18, margin: "0 0 12px 10px" }}>×</div>
          {tabs.map((t) => <div key={t} style={{ height: 34, padding: "0 10px", borderRadius: 9, display: "flex", alignItems: "center", fontSize: 14, background: t === "Personalisierung" ? C.active : "transparent" }}>{t}</div>)}
        </div>
        <div style={{ flex: 1, padding: "22px 26px" }}>
          <div style={{ fontSize: 18, fontWeight: 600, paddingBottom: 14, borderBottom: `1px solid ${C.line}` }}>Personalisierung</div>
          <div style={{ fontSize: 14, color: C.mute, margin: "18px 0 8px" }}>Erinnerungen</div>
          {[{ t: "Gespeicherte Erinnerungen referenzieren", on: true }, { t: "Auf Chatverlauf zugreifen", on: true }].map((r) => (
            <div key={r.t} style={{ display: "flex", alignItems: "center", height: 46, borderBottom: `1px solid ${C.line}`, fontSize: 14 }}>
              {r.t}<div style={{ marginLeft: "auto", width: 36, height: 20, borderRadius: 10, background: C.blue, position: "relative" }}><div style={{ position: "absolute", right: 2, top: 2, width: 16, height: 16, borderRadius: 8, background: "#fff" }} /></div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", height: 52, fontSize: 14 }}>
            Gespeicherte Erinnerungen verwalten
            <div style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 999, border: `1px solid ${C.line}`, fontSize: 13, background: manageHover ? C.hover : "#fff", transform: `scale(${1 - 0.06 * managePress})` }}>Verwalten</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const MANAGE_BTN = { x: (W.w - 680) / 2 + 680 - 26 - 40, y: 381 };

/** "Gespeicherte Erinnerungen" manager: rows slide in, the list scrolls once it is full. */
export const MemoryDialog: React.FC<{ p: number; rows: string[]; newest?: number; scroll?: number }> = ({ p, rows, newest = 1, scroll = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.32 * p})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 600, height: 440, background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: "22px 26px", opacity: p, transform: `scale(${0.96 + 0.04 * p})`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center" }}><div style={{ fontSize: 18, fontWeight: 600 }}>Gespeicherte Erinnerungen</div><div style={{ marginLeft: "auto", fontSize: 18, color: C.mute }}>×</div></div>
      <div style={{ fontSize: 13, color: C.sub, margin: "8px 0 12px", lineHeight: "18px" }}>ChatGPT merkt sich nützliche Details aus deinen Chats, damit Antworten persönlicher werden.</div>
      <div style={{ flex: 1, overflow: "hidden", borderTop: `1px solid ${C.line}` }}>
        <div style={{ transform: `translateY(${-scroll}px)` }}>
          {rows.map((r, i) => {
            const q = i === rows.length - 1 ? newest : 1;
            return (
              <div key={r} style={{ height: 50, display: "flex", alignItems: "center", borderBottom: `1px solid ${C.line}`, fontSize: 15, opacity: q, background: q < 1 ? `rgba(47,124,246,${0.1 * (1 - q)})` : "transparent", transform: `translateY(${(1 - q) * 10}px)` }}>
                {r}<span style={{ marginLeft: "auto" }}><Stroke d={S.trash} s={16} c={C.mute} /></span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// ---------- motion helpers ----------
export type Key = { t: number; x: number; y: number };
/** cursor path through keyframes with eased moves; `clicks` = times of mouse presses */
export const cursorAt = (t: number, keys: Key[], clicks: number[] = []): NonNullable<WebState["cursor"]> => {
  let x = keys[0].x, y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    const q = b.t <= a.t ? (t >= b.t ? 1 : 0) : interpolate(t, [a.t, b.t], [0, 1], { ...clamp, easing: ease });
    x += (b.x - a.x) * q; y += (b.y - a.y) * q;
  }
  let down = 0, ring = 0;
  for (const c of clicks) {
    if (t >= c - 0.08 && t < c + 0.1) down = 1 - Math.abs(t - c) / 0.1;
    if (t >= c && t < c + 0.4) ring = (t - c) / 0.4;
  }
  return { x, y, down: Math.max(0, down), ring };
};
/** eased value through keyframes [[t, v], ...] */
export const track = (t: number, keys: [number, number][]) => {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [ta, va] = keys[i - 1], [tb, vb] = keys[i];
    v += (vb - va) * (tb <= ta ? (t >= tb ? 1 : 0) : interpolate(t, [ta, tb], [0, 1], { ...clamp, easing: ease }));
  }
  return v;
};
/** camera: shows the app region around (cx, cy) at zoom z inside a w x h viewport */
export const WebCam: React.FC<{ cx: number; cy: number; z: number; w?: number; h?: number; children: React.ReactNode }> = ({ cx, cy, z, w = 1080, h = 998, children }) => {
  const x = Math.max(0, Math.min(W.w - w / z, cx - w / z / 2));
  const y = Math.max(0, Math.min(W.h - h / z, cy - h / z / 2));
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `scale(${z}) translate(${-x}px, ${-y}px)` }}>{children}</div>
    </div>
  );
};
