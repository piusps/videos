import React from "react";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { fonts } from "../theme";

// Example café website for the Lovable reel (runs/gpt-lovable, Pius 2026-10-05: "die Website
// sieht scheiße aus"). Pure CSS, no stock photos: editorial cream layout, big serif headline,
// drawn latte art instead of grey boxes. Authored at 1000 px width, scaled by the caller.
// Café "Lumen", its texts and prices are invented.

const { fontFamily: serif } = loadNewsreader("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: serifItalic } = loadNewsreader("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });

const INK = "#1F1712";
const CREAM = "#F4EEE4";
const CLAY = "#B4673C";

/** Top view of a latte with a heart in the crema. */
export const Latte: React.FC<{ size: number; rot?: number }> = ({ size, rot = 0 }) => {
  const s = size;
  return (
    <div style={{ position: "relative", width: s, height: s, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFDF8, #E9E1D3 70%)", boxShadow: `0 ${s * 0.06}px ${s * 0.12}px rgba(40,25,15,0.25)` }} />
      <div style={{ position: "absolute", inset: s * 0.16, borderRadius: "50%", background: "#FFFFFF", boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.04)" }} />
      <div style={{ position: "absolute", inset: s * 0.21, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%, #C98B55 0%, #8C5230 55%, #5A3019 100%)" }} />
      {/* heart */}
      <div style={{ position: "absolute", left: "50%", top: "52%", width: s * 0.2, height: s * 0.2, transform: "translate(-50%,-50%) rotate(45deg)" }}>
        <div style={{ position: "absolute", inset: 0, background: "#F6E9D7", borderRadius: s * 0.02 }} />
        <div style={{ position: "absolute", left: -s * 0.1, top: 0, width: s * 0.2, height: s * 0.2, borderRadius: "50%", background: "#F6E9D7" }} />
        <div style={{ position: "absolute", left: 0, top: -s * 0.1, width: s * 0.2, height: s * 0.2, borderRadius: "50%", background: "#F6E9D7" }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: s * 0.03, height: s * 0.14, background: "#F6E9D7", borderRadius: s, transform: `translate(-50%, ${s * 0.05}px)` }} />
      {/* handle */}
      <div style={{ position: "absolute", right: -s * 0.02, top: "44%", width: s * 0.16, height: s * 0.12, borderRadius: s * 0.06, background: "#FFFFFF", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }} />
    </div>
  );
};

/** The polished site. scroll 0..1 moves through hero → menu → reservation. */
export const PremiumSite: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => (
  <div style={{ width: 1000, height: 1700, backgroundColor: CREAM, transform: `translateY(${-scroll * 900}px)`, color: INK }}>
    {/* nav */}
    <div style={{ height: 96, display: "flex", alignItems: "center", padding: "0 56px", gap: 34 }}>
      <span style={{ fontFamily: serifItalic, fontSize: 40 }}>Lumen</span>
      <span style={{ flex: 1 }} />
      {["Karte", "Rösterei", "Besuch"].map((l) => <span key={l} style={{ fontFamily: fonts.medium, fontSize: 22, color: "#5C5048" }}>{l}</span>)}
      <span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CREAM, backgroundColor: INK, borderRadius: 999, padding: "12px 26px" }}>Reservieren</span>
    </div>
    {/* hero */}
    <div style={{ position: "relative", height: 640, padding: "40px 56px 0" }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 18, letterSpacing: 4, color: CLAY }}>KAFFEERÖSTEREI · KÖLN-EHRENFELD</div>
      <div style={{ fontFamily: serif, fontSize: 112, lineHeight: 0.98, marginTop: 22, letterSpacing: -3, width: 560 }}>
        Kaffee, der <span style={{ fontFamily: serifItalic, color: CLAY }}>Zeit</span> hat.
      </div>
      <div style={{ fontFamily: fonts.regular, fontSize: 26, lineHeight: 1.45, color: "#5C5048", marginTop: 26, width: 470 }}>Jeden Morgen frisch geröstet, langsam gebrüht. Setz dich, wir haben keine Eile.</div>
      <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
        <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: CREAM, backgroundColor: INK, borderRadius: 999, padding: "18px 34px" }}>Tisch reservieren</span>
        <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: INK, border: `2px solid ${INK}`, borderRadius: 999, padding: "16px 32px" }}>Zur Karte →</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 30, width: 400, height: 560, borderRadius: 200, background: "linear-gradient(160deg, #3A2418, #6B3E22 60%, #A8683A)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -60, top: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,160,0.45), rgba(255,214,160,0))" }} />
        <div style={{ position: "absolute", left: 60, top: 170 }}><Latte size={280} rot={-18} /></div>
        <div style={{ position: "absolute", left: 24, bottom: 26, fontFamily: fonts.medium, fontSize: 18, color: "rgba(255,240,225,0.85)" }}>Flat White · Hausröstung „Ehrenfeld“</div>
      </div>
    </div>
    {/* menu */}
    <div style={{ padding: "60px 56px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: serif, fontSize: 64, letterSpacing: -1 }}>Die Karte</span>
        <span style={{ fontFamily: fonts.medium, fontSize: 22, color: CLAY }}>alle ansehen →</span>
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 30 }}>
        {[["Flat White", "3,80", -10], ["Cortado", "3,40", 25], ["Hafer Latte", "4,20", 60]].map(([n, p, r]) => (
          <div key={n as string} style={{ flex: 1, backgroundColor: "#FBF8F2", borderRadius: 28, padding: "30px 26px", boxShadow: "0 10px 30px rgba(60,35,20,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Latte size={170} rot={r as number} /></div>
            <div style={{ fontFamily: serif, fontSize: 34, marginTop: 22 }}>{n}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: "#7A6B60", marginTop: 4 }}>{p} €</div>
          </div>
        ))}
      </div>
    </div>
    {/* reservation band */}
    <div style={{ margin: "70px 56px 0", borderRadius: 36, backgroundColor: INK, padding: "48px 52px", display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: serif, fontSize: 52, color: CREAM, lineHeight: 1.05 }}>Komm vorbei.</div>
        <div style={{ fontFamily: fonts.regular, fontSize: 22, color: "#BFAF9F", marginTop: 12 }}>Venloer Str. · täglich 8 bis 18 Uhr</div>
      </div>
      <span style={{ fontFamily: fonts.semibold, fontSize: 24, color: INK, backgroundColor: "#E8C9A0", borderRadius: 999, padding: "18px 34px" }}>Tisch reservieren</span>
    </div>
  </div>
);

/** First version: tidy but generic (what a one-line request gives you). */
export const PlainSite: React.FC = () => (
  <div style={{ width: 1000, height: 1700, backgroundColor: "#FFFFFF", color: "#222" }}>
    <div style={{ height: 96, display: "flex", alignItems: "center", padding: "0 56px", gap: 30, borderBottom: "2px solid #EEE" }}>
      <span style={{ fontFamily: fonts.bold, fontSize: 32 }}>Café Lumen</span>
      <span style={{ flex: 1 }} />
      {["Karte", "Über uns", "Kontakt"].map((l) => <span key={l} style={{ fontFamily: fonts.medium, fontSize: 22, color: "#555" }}>{l}</span>)}
    </div>
    <div style={{ height: 520, margin: "40px 56px 0", borderRadius: 18, background: "linear-gradient(135deg,#8E6A4E,#C2946A)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 44 }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 70, color: "#FFF", lineHeight: 1.05 }}>Willkommen im Café Lumen</div>
      <div style={{ fontFamily: fonts.regular, fontSize: 26, color: "rgba(255,255,255,0.9)", marginTop: 14 }}>Kaffee und Kuchen in Köln</div>
      <span style={{ alignSelf: "flex-start", marginTop: 24, fontFamily: fonts.semibold, fontSize: 24, color: "#FFF", backgroundColor: "#2F6FED", borderRadius: 10, padding: "14px 28px" }}>Kontakt</span>
    </div>
    <div style={{ display: "flex", gap: 22, margin: "40px 56px 0" }}>
      {[["Kaffee", "3,50 €"], ["Kuchen", "3,90 €"], ["Frühstück", "8,50 €"]].map(([n, p]) => (
        <div key={n} style={{ flex: 1, border: "2px solid #EEE", borderRadius: 14, padding: 22 }}>
          <div style={{ height: 120, borderRadius: 10, backgroundColor: "#E7E2DC" }} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 28, marginTop: 14 }}>{n}</div>
          <div style={{ fontFamily: fonts.regular, fontSize: 22, color: "#777" }}>{p}</div>
        </div>
      ))}
    </div>
  </div>
);

/** Grey placeholder blocks with a moving shimmer, while Lovable builds. */
export const SkeletonSite: React.FC<{ t: number }> = ({ t }) => {
  const sh = ((t * 0.9) % 1) * 1400 - 400;
  const block = (x: number, y: number, w: number, h: number, r = 16) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, backgroundColor: "#ECE7DF", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: sh - x, width: 260, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))" }} />
    </div>
  );
  return (
    <div style={{ position: "relative", width: 1000, height: 1700, backgroundColor: "#F8F5F0" }}>
      {block(56, 30, 160, 40)}{block(640, 30, 300, 40, 999)}
      {block(56, 150, 300, 22)}{block(56, 200, 520, 90)}{block(56, 305, 420, 90)}{block(56, 430, 460, 26)}{block(56, 475, 380, 26)}
      {block(56, 560, 250, 64, 999)}{block(326, 560, 220, 64, 999)}
      {block(560, 120, 400, 560, 200)}
      {block(56, 760, 300, 56)}
      {block(56, 850, 280, 330, 28)}{block(360, 850, 280, 330, 28)}{block(664, 850, 280, 330, 28)}
    </div>
  );
};

/** Browser chrome around a 1000-wide page, clipped to height h. */
export const Browser: React.FC<{ w: number; h: number; url?: string; children: React.ReactNode }> = ({ w, h, url = "cafe-lumen.lovable.app", children }) => {
  const s = w / 1000;
  return (
    <div style={{ width: w, height: h, borderRadius: 26 * s, overflow: "hidden", backgroundColor: "#FFF", boxShadow: "0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)" }}>
      <div style={{ height: 60 * s, backgroundColor: "#EDEAE4", display: "flex", alignItems: "center", gap: 11 * s, padding: `0 ${24 * s}px` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 17 * s, height: 17 * s, borderRadius: "50%", backgroundColor: c }} />)}
        <div style={{ flex: 1, margin: `0 ${60 * s}px`, height: 34 * s, borderRadius: 17 * s, backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 * s, fontFamily: fonts.medium, fontSize: 19 * s, color: "#666" }}>🔒 {url}</div>
      </div>
      <div style={{ position: "relative", height: h - 60 * s, overflow: "hidden" }}>
        <div style={{ transform: `scale(${s})`, transformOrigin: "0 0", width: 1000 }}>{children}</div>
      </div>
    </div>
  );
};
