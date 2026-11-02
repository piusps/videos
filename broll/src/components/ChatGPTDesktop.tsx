import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

// ChatGPT desktop app (light) rebuilt from Henri's screenshot 2026-10-21: icon rail, sidebar with "ChatGPT ⌄",
// "Neuer Chat", Angeheftet / Projekte / Letzte, "Chat | Work" toggle, "Was steht heute an?" home with the input pill
// ("ChatGPT fragen", "Mittel ⌄", mic, blue voice button), and a conversation view.
// Only the UI is copied: every sidebar title is invented per video, never the real chats from the screenshot.

const { fontFamily: inter } = loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });
export const CG = { bg: "#FFFFFF", side: "#F9F9F9", ink: "#0D0D0D", sub: "#5D5D5D", mute: "#8F8F8F", line: "#ECECEC", hover: "#ECECEC", bubble: "#F4F4F4", blue: "#2F6FEB", font: inter };
export const APP_W = 1500;
export const APP_H = 1300;
const RAIL = 64;
const SIDE = 400;

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 30, color = CG.sub, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const I = {
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  lib: "M4 4h4v16H4zM10 4h4v16h-4zM16 5l4 1-3 14-4-1z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  at: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  pencil: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20h4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  chev: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM19 11a7 7 0 0 1-14 0M12 18v3",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
};

export type Msg = { role: "user" | "assistant"; text: React.ReactNode };
export type SidebarData = { pinned: string[]; projects: { name: string; chats?: string[] }[]; recent: string[]; active?: string; account: { initials: string; name: string; plan?: string } };

const Section: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 24, color: CG.mute, padding: "0 22px", marginTop: 30, marginBottom: 10 }}>{title}</div>
);
const Item: React.FC<{ text: string; active?: boolean; indent?: boolean; dim?: boolean; style?: React.CSSProperties }> = ({ text, active, indent, dim, style }) => (
  <div style={{ margin: "0 10px", padding: `9px ${indent ? 12 : 12}px 9px ${indent ? 48 : 12}px`, borderRadius: 12, background: active ? CG.hover : "transparent", fontFamily: inter, fontWeight: 400, fontSize: 26, color: dim ? CG.mute : CG.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...style }}>{text}</div>
);

/** Sidebar; `recentShown` limits how many recent chats are visible (for "it fills up" animations), `pop` animates the newest. */
export const Sidebar: React.FC<{ d: SidebarData; recentShown?: number; pop?: number; scroll?: number }> = ({ d, recentShown, pop = 1, scroll = 0 }) => {
  const rec = recentShown === undefined ? d.recent : d.recent.slice(0, recentShown);
  return (
    <div style={{ position: "absolute", left: RAIL, top: 0, width: SIDE, bottom: 0, background: CG.side, borderRight: `1px solid ${CG.line}`, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "26px 22px 14px" }}>
        <span style={{ fontFamily: inter, fontWeight: 600, fontSize: 30, color: CG.ink }}>ChatGPT</span>
        <Icon d={I.chev} size={24} color={CG.mute} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}><Icon d={I.bell} size={28} /><Icon d={I.search} size={28} /></div>
      </div>
      <div style={{ margin: "6px 10px", padding: "11px 12px", borderRadius: 12, background: CG.hover, display: "flex", alignItems: "center", gap: 12, fontFamily: inter, fontSize: 26, color: CG.ink }}><Icon d={I.pencil} size={26} color={CG.ink} />Neuer Chat</div>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        <Section title="Angeheftet" />
        {d.pinned.map((p) => <Item key={p} text={p} active={d.active === p} />)}
        <Section title="Projekte" />
        {d.projects.map((p) => (
          <React.Fragment key={p.name}>
            <div style={{ margin: "0 10px", padding: "9px 12px", display: "flex", alignItems: "center", gap: 12, fontFamily: inter, fontSize: 26, color: CG.ink }}><Icon d={I.folder} size={26} />{p.name}</div>
            {(p.chats || []).map((c) => <Item key={c} text={c} indent active={d.active === c} />)}
          </React.Fragment>
        ))}
        <Section title="Letzte" />
        {rec.map((r, i) => {
          const newest = recentShown !== undefined && i === 0;
          return <Item key={r + i} text={r} active={d.active === r} style={newest ? { opacity: pop, transform: `translateX(${(1 - pop) * -40}px)`, background: pop < 1 ? `rgba(47,111,235,${0.12 * (1 - pop)})` : d.active === r ? CG.hover : "transparent" } : undefined} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, background: CG.side, borderTop: `1px solid ${CG.line}`, display: "flex", alignItems: "center", gap: 14, padding: "0 22px" }}>
        <div style={{ width: 50, height: 50, borderRadius: 25, background: "#3A3A3A", color: "#fff", fontFamily: inter, fontWeight: 600, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{d.account.initials}</div>
        <div style={{ fontFamily: inter, fontSize: 25, color: CG.ink, lineHeight: 1.2 }}>{d.account.name}{d.account.plan ? <div style={{ fontSize: 21, color: CG.mute }}>{d.account.plan}</div> : null}</div>
      </div>
    </div>
  );
};

const Rail: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: RAIL, background: CG.side, borderRight: `1px solid ${CG.line}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26, gap: 30 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: CG.hover, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={I.home} size={26} color={CG.ink} /></div>
    {[I.clock, I.lib, I.grid, I.at, I.dots].map((d, i) => <Icon key={i} d={d} size={26} />)}
  </div>
);

/** Input pill; `typed` shows text instead of the placeholder, `sendPulse` 0..1 bumps the button. */
export const InputPill: React.FC<{ typed?: string; caret?: boolean; width?: number; sendPulse?: number }> = ({ typed, caret, width = 900, sendPulse = 0 }) => (
  <div style={{ width, height: 92, borderRadius: 46, background: "#fff", border: `1.5px solid ${CG.line}`, boxShadow: "0 6px 24px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", padding: "0 16px 0 26px", gap: 18 }}>
    <Icon d={I.plus} size={30} color={CG.sub} />
    <span style={{ flex: 1, fontFamily: inter, fontSize: 30, color: typed ? CG.ink : "#A8A8A8", whiteSpace: "nowrap", overflow: "hidden" }}>{typed || "ChatGPT fragen"}{caret ? <span style={{ display: "inline-block", width: 2.5, height: 32, background: CG.ink, marginLeft: 2, verticalAlign: "middle" }} /> : null}</span>
    <span style={{ fontFamily: inter, fontSize: 25, color: CG.mute, display: "flex", alignItems: "center", gap: 4 }}>Mittel<Icon d={I.chev} size={20} color={CG.mute} /></span>
    <Icon d={I.mic} size={28} color={CG.sub} />
    <div style={{ width: 58, height: 58, borderRadius: 29, background: typed ? CG.ink : CG.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.15 * sendPulse})` }}>
      {typed ? <Icon d="M12 19V5M5 12l7-7 7 7" size={28} color="#fff" sw={2.6} /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="9" width="2" height="6" rx="1" /><rect x="9" y="6" width="2" height="12" rx="1" /><rect x="13" y="8" width="2" height="8" rx="1" /><rect x="17" y="10" width="2" height="4" rx="1" /></svg>}
    </div>
  </div>
);

/** The whole app. `main` = home (greeting + pill) or a conversation; `modal` sits above everything (settings dialogs). */
export const ChatGPTDesktop: React.FC<{ side: SidebarData; recentShown?: number; pop?: number; sideScroll?: number; messages?: Msg[]; typed?: string; caret?: boolean; sendPulse?: number; modal?: React.ReactNode; title?: string }> = ({ side, recentShown, pop, sideScroll, messages, typed, caret, sendPulse, modal, title }) => {
  const mainL = RAIL + SIDE;
  const mainW = APP_W - mainL;
  return (
    <div style={{ position: "relative", width: APP_W, height: APP_H, background: CG.bg, overflow: "hidden", fontFamily: inter }}>
      <Rail />
      <Sidebar d={side} recentShown={recentShown} pop={pop} scroll={sideScroll} />
      <div style={{ position: "absolute", left: mainL, top: 0, width: mainW, height: APP_H }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 22, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", background: "#F3F3F3", borderRadius: 26, padding: 4 }}>
            <div style={{ padding: "9px 30px", borderRadius: 22, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", fontFamily: inter, fontWeight: 500, fontSize: 24, color: CG.ink }}>Chat</div>
            <div style={{ padding: "9px 30px", fontFamily: inter, fontWeight: 500, fontSize: 24, color: CG.sub }}>Work</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 30, top: 30 }}><Icon d={I.refresh} size={28} /></div>
        {title ? <div style={{ position: "absolute", left: 32, top: 34, fontFamily: inter, fontWeight: 500, fontSize: 26, color: CG.ink }}>{title}</div> : null}
        {messages && messages.length ? (
          <>
            <div style={{ position: "absolute", left: 80, right: 80, top: 150, display: "flex", flexDirection: "column", gap: 34 }}>
              {messages.map((m, i) => m.role === "user"
                ? <div key={i} style={{ alignSelf: "flex-end", maxWidth: 760, background: CG.bubble, borderRadius: 32, padding: "20px 30px", fontFamily: inter, fontSize: 42, lineHeight: 1.35, color: CG.ink }}>{m.text}</div>
                : <div key={i} style={{ alignSelf: "flex-start", maxWidth: 900, fontFamily: inter, fontSize: 48, lineHeight: 1.4, color: CG.ink }}>{m.text}</div>)}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center" }}><InputPill typed={typed} caret={caret} width={mainW - 140} sendPulse={sendPulse} /></div>
          </>
        ) : (
          <div style={{ position: "absolute", left: 0, right: 0, top: APP_H * 0.36, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 50, color: CG.ink }}>Was steht heute an?</div>
            <InputPill typed={typed} caret={caret} width={Math.min(940, mainW - 120)} sendPulse={sendPulse} />
          </div>
        )}
      </div>
      {modal ? <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>{modal}</div> : null}
    </div>
  );
};

/** Pan/zoom "screen recording" camera: shows the app inside the 1080-wide panel. */
export const ScreenCam: React.FC<{ x: number; y: number; z: number; children: React.ReactNode }> = ({ x, y, z, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "#E9E9EB", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-x * z}px, ${-y * z}px) scale(${z})` }}>{children}</div>
  </div>
);
