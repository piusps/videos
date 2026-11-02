import React from "react";
import { interpolate } from "remotion";
import { colors, fonts } from "../theme";
import { clamp, glass, In, mono, Stage, useClip } from "../components/GlassKit";

// Type-A B-Rolls for the Postfach reel (2026-09-29, Niklas Office), one per script beat.
// Each is ~2.5-3 s, hard cut-in, in motion from frame 0.

const W = 1080;
const PAD = 60;
const label: React.CSSProperties = { fontFamily: fonts.semibold, fontSize: 28, color: "rgba(255,255,255,0.6)" };

// 1 — Hook: "Du verbringst elf Wochen im Jahr nur mit E-Mails."
export const ElfWochenBroll: React.FC<{ seconds: number }> = () => {
  const { frame, at } = useClip();
  const fill = at(0.05, 0.7, (x) => x);
  const filled = Math.round(fill * 11);
  const hours = Math.round(interpolate(fill, [0, 1], [0, 440]));
  const cols = 7;
  return (
    <Stage>
      <In p={1} style={{ position: "absolute", left: PAD, top: 440 }}>
        <div style={label}>Dein Jahr · 52 Wochen</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 64, color: colors.white, letterSpacing: -2, marginTop: 6 }}>Davon nur E-Mails:</div>
      </In>

      {/* Week grid: 52 cells, the first eleven fill up orange one by one */}
      <div style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 600, padding: 36, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
        {Array.from({ length: 52 }).map((_, i) => {
          const on = i < filled;
          const pop = on ? interpolate(fill * 11 - i, [0, 0.6], [1.15, 1], clamp) : 1;
          return (
            <div
              key={i}
              style={{
                height: 66,
                borderRadius: 16,
                background: on ? `linear-gradient(135deg, ${colors.accent}, #FFB36B)` : "rgba(255,255,255,0.07)",
                border: on ? "none" : "1.5px solid rgba(255,255,255,0.08)",
                boxShadow: on ? `0 0 26px ${colors.accent}99` : "none",
                transform: `scale(${pop})`,
                display: "grid",
                placeItems: "center",
                fontFamily: fonts.semibold,
                fontSize: 20,
                color: on ? colors.white : "rgba(255,255,255,0.3)",
              }}
            >
              {on ? "✉" : i + 1}
            </div>
          );
        })}
      </div>

      {/* Counters */}
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 1330, display: "flex", gap: 30 }}>
        <div style={{ ...glass, flex: 1, padding: 40 }}>
          <div style={label}>Wochen</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 150, color: colors.accent, letterSpacing: -6, lineHeight: 1, marginTop: 10, textShadow: `0 0 50px ${colors.accent}88` }}>{filled}</div>
        </div>
        <div style={{ ...glass, flex: 1, padding: 40 }}>
          <div style={label}>Stunden</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 150, color: colors.white, letterSpacing: -6, lineHeight: 1, marginTop: 10 }}>{hours}</div>
        </div>
      </div>

      <In p={at(0.55, 0.8)} y={30} style={{ position: "absolute", left: 0, right: 0, top: 1680, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "18px 34px", fontFamily: fonts.semibold, fontSize: 30, color: colors.white, opacity: 0.85 + 0.15 * Math.sin(frame / 4) }}>
          2 Stunden × 220 Arbeitstage
        </div>
      </In>
    </Stage>
  );
};

// 2 — "Claude liest jeden Morgen dein Postfach und sortiert alles nach dringend und unwichtig."
export const SortierenBroll: React.FC<{ seconds: number }> = () => {
  const { frame, d, at } = useClip();
  const lanes = [
    { t: "Dringend", x: 60, hot: true },
    { t: "Später", x: 390 },
    { t: "Unwichtig", x: 720 },
  ];
  const mails = [
    { f: "Kunde Becker", s: "Angebot bis heute?", l: 0 },
    { f: "Newsletter", s: "Herbst-Sale 30 %", l: 2 },
    { f: "Lieferant Kaya", s: "Lieferung verschoben", l: 0 },
    { f: "Verband", s: "Einladung Stammtisch", l: 1 },
    { f: "LinkedIn", s: "3 neue Aufrufe", l: 2 },
    { f: "Steuerbüro", s: "Unterlagen Q3", l: 1 },
    { f: "Kundin Roth", s: "Reklamation Auftrag", l: 0 },
    { f: "Webinar", s: "Nur noch heute", l: 2 },
  ];
  const step = (d * 0.72) / mails.length;
  const done = (i: number) => frame > i * step + step * 1.3;
  return (
    <Stage>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 120, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={label}>Posteingang · 07:30 Uhr</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 80, color: colors.white, letterSpacing: -3 }}>
            {47 - mails.filter((_, i) => done(i)).length} ungelesen
          </div>
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 30, color: colors.white, background: colors.accent, borderRadius: 999, padding: "14px 26px", boxShadow: `0 0 ${30 + Math.sin(frame / 4) * 12}px ${colors.accent}` }}>
          ✦ Claude sortiert
        </div>
      </div>

      {/* Mails flying from the inbox stack into their lane */}
      {mails.map((m, i) => {
        const t = interpolate(frame, [i * step - step * 0.6, i * step + step * 1.3], [0, 1], clamp);
        if (t <= 0 || t >= 1) return null;
        const x = interpolate(t, [0, 1], [230, lanes[m.l].x + 10]);
        const y = interpolate(t, [0, 0.35, 1], [330, 560, 1060]);
        return (
          <div key={i} style={{ ...glass, position: "absolute", left: x, top: y, width: 300, padding: "18px 22px", borderRadius: 22, borderColor: m.l === 0 ? `${colors.accent}aa` : undefined, opacity: interpolate(t, [0, 0.12, 0.85, 1], [0, 1, 1, 0]), transform: `rotate(${(1 - t) * (i % 2 ? 7 : -7)}deg) scale(${1 - t * 0.25})` }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 26, color: colors.white }}>{m.f}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{m.s}</div>
          </div>
        );
      })}

      {/* Lanes */}
      {lanes.map((l, li) => {
        const n = mails.filter((m, i) => m.l === li && done(i)).length;
        return (
          <div key={li} style={{ ...glass, position: "absolute", left: l.x, top: 1180, width: 300, height: 440, padding: 30, boxSizing: "border-box", borderColor: l.hot ? `${colors.accent}` : undefined, background: l.hot ? "rgba(255,107,53,0.12)" : glass.background }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: l.hot ? colors.accent : colors.white }}>{l.t}</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 110, color: colors.white, letterSpacing: -4, marginTop: 20 }}>{n + [1, 3, 6][li]}</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "rgba(255,255,255,0.55)" }}>Mails</div>
          </div>
        );
      })}

      <In p={at(0.72, 0.92)} y={30} style={{ position: "absolute", left: 0, right: 0, top: 1700, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "18px 32px", fontFamily: fonts.semibold, fontSize: 30, color: colors.white }}>
          <span style={{ color: colors.accent }}>✓</span> Nur 3 Mails brauchen dich heute
        </div>
      </In>
    </Stage>
  );
};

// 3 — "Auf Standardanfragen schreibt Claude die Antwort vor, in deinem Ton. Du klickst nur noch auf Senden."
const REPLY =
  "Hallo Frau Roth,\n\ndanke für Ihre Nachricht. Der Liefertermin für Ihren Auftrag ist der 14. Oktober. Ich melde mich, sobald die Ware bei uns eingetroffen ist.\n\nViele Grüße\nNiklas";

export const AntwortBroll: React.FC<{ seconds: number }> = () => {
  const { frame, at } = useClip();
  const typed = Math.round(at(0.12, 0.7, (x) => x) * REPLY.length);
  const click = at(0.8, 0.86);
  const sent = at(0.88, 0.98);
  return (
    <Stage>
      {/* Incoming request */}
      <In p={1} style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 120, padding: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 36, color: colors.white }}>Kundin Roth</div>
          <div style={label}>vor 4 Min.</div>
        </div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 12 }}>Wann kommt meine Lieferung?</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "rgba(255,255,255,0.55)", marginTop: 8 }}>Hallo, können Sie mir sagen, wann …</div>
      </In>

      {/* Draft being written */}
      <div style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 470, height: 1000, padding: 44, boxSizing: "border-box", background: "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))", opacity: 1 - sent * 0.4, transform: `translateY(${-sent * 80}px) scale(${1 - sent * 0.05})` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: 26, color: colors.white, background: "rgba(255,107,53,0.2)", border: `1.5px solid ${colors.accent}`, borderRadius: 999, padding: "10px 22px" }}>
          ✦ Entwurf von Claude · in deinem Ton
        </div>
        <div style={{ fontFamily: fonts.medium, fontSize: 36, lineHeight: 1.45, color: colors.white, marginTop: 36, whiteSpace: "pre-wrap" }}>
          {REPLY.slice(0, typed)}
          <span style={{ display: "inline-block", width: 4, height: 38, marginLeft: 4, verticalAlign: "middle", background: colors.accent, opacity: typed < REPLY.length && Math.floor(frame / 6) % 2 === 0 ? 1 : 0 }} />
        </div>
      </div>

      {/* Send button */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 44, color: colors.white, background: sent > 0.2 ? "rgba(255,255,255,0.14)" : colors.accent, borderRadius: 999, padding: "28px 90px", boxShadow: `0 0 ${50 + click * 40}px ${colors.accent}${sent > 0.2 ? "00" : "cc"}`, transform: `scale(${1 - Math.sin(click * Math.PI) * 0.08})` }}>
          {sent > 0.2 ? "✓ Gesendet" : "Senden"}
        </div>
      </div>
    </Stage>
  );
};

// 4 — "Claude erkennt Termine in deinen Mails und trägt sie in deinen Kalender ein."
export const KalenderBroll: React.FC<{ seconds: number }> = () => {
  const { at } = useClip();
  const lift = at(0.15, 0.35);
  const fly = at(0.35, 0.7);
  const land = at(0.68, 0.8);
  const days = ["Mo", "Di", "Mi", "Do", "Fr"];
  const slotX = PAD + 80 + 1 * 180; // Tuesday column
  const slotY = 820 + 200 + 3 * 110; // 14:00 row
  const chipX = interpolate(fly, [0, 1], [310, slotX]);
  const chipY = interpolate(fly, [0, 0.4, 1], [360, 520, slotY]);
  return (
    <Stage>
      {/* Mail with a highlighted appointment */}
      <div style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 110, padding: 40, opacity: 1 - fly * 0.45 }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: colors.white }}>Lieferant Kaya</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 30, lineHeight: 1.5, color: "rgba(255,255,255,0.75)", marginTop: 14 }}>
          … passt Ihnen{" "}
          <span style={{ color: colors.white, fontFamily: fonts.bold, background: `rgba(255,107,53,${0.15 + lift * 0.35})`, borderRadius: 10, padding: "2px 10px", boxShadow: lift ? `0 0 ${lift * 30}px ${colors.accent}` : "none" }}>
            Dienstag, 14 Uhr
          </span>{" "}
          für die Besprechung bei Ihnen vor Ort?
        </div>
      </div>

      {/* Week calendar */}
      <div style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 820, height: 900, padding: 40, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 44, color: colors.white }}>Kalender</div>
          <div style={label}>KW 41</div>
        </div>
        <div style={{ display: "flex", marginTop: 26, marginLeft: 40 }}>
          {days.map((dd) => (
            <div key={dd} style={{ width: 180, fontFamily: fonts.semibold, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>{dd}</div>
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <div key={r} style={{ position: "absolute", left: 40, right: 40, top: 190 + r * 110, height: 1.5, background: "rgba(255,255,255,0.08)" }} />
        ))}
        {[
          { c: 0, r: 0, t: "Team-Call" },
          { c: 2, r: 2, t: "Baustelle" },
          { c: 3, r: 4, t: "Angebot Meier" },
        ].map((e, i) => (
          <div key={i} style={{ position: "absolute", left: 80 + e.c * 180, top: 200 + e.r * 110, width: 160, height: 90, borderRadius: 16, background: "rgba(255,255,255,0.1)", padding: "12px 14px", boxSizing: "border-box", fontFamily: fonts.semibold, fontSize: 20, color: "rgba(255,255,255,0.75)" }}>
            {e.t}
          </div>
        ))}
      </div>

      {/* Flying appointment chip */}
      <div style={{ position: "absolute", left: chipX, top: chipY, width: lift > 0 ? 170 + (1 - fly) * 150 : 0, opacity: lift, borderRadius: 18, padding: "14px 16px", boxSizing: "border-box", background: `linear-gradient(135deg, ${colors.accent}, #FFB36B)`, boxShadow: `0 0 ${40 - land * 20}px ${colors.accent}`, transform: `scale(${1 + Math.sin(land * Math.PI) * 0.1})`, fontFamily: fonts.bold, fontSize: 22, color: colors.white, whiteSpace: "nowrap", overflow: "hidden" }}>
        Di · 14:00 Kaya
      </div>

      <In p={at(0.8, 0.95)} y={30} style={{ position: "absolute", left: 0, right: 0, top: 1760, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "18px 32px", fontFamily: fonts.semibold, fontSize: 30, color: colors.white }}>
          <span style={{ color: colors.accent }}>✓</span> Termin eingetragen
        </div>
      </In>
    </Stage>
  );
};

// Hook variant B — "Ich zeig dir, wie Claude dein Postfach in drei Schritten übernimmt."
// Shows the finished result first: the morning overview Claude delivers.
export const MorgenUebersichtBroll: React.FC<{ seconds: number }> = () => {
  const { frame, at } = useClip();
  const rows = [
    { n: 3, t: "Mails brauchen dich heute", s: "Kunde Becker · Kundin Roth · Lieferant Kaya", hot: true },
    { n: 12, t: "Antworten als Entwurf bereit", s: "in deinem Ton · du klickst nur auf Senden" },
    { n: 2, t: "Termine eingetragen", s: "Di 14:00 Kaya · Do 09:30 Meier" },
  ];
  return (
    <Stage>
      <In p={1} style={{ position: "absolute", left: PAD, right: PAD, top: 440, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={label}>Montag · 07:42 Uhr</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 78, color: colors.white, letterSpacing: -3, marginTop: 6 }}>Guten Morgen.</div>
        </div>
        <div style={{ fontFamily: fonts.bold, fontSize: 28, color: colors.white, background: colors.accent, borderRadius: 999, padding: "14px 26px", boxShadow: `0 0 ${30 + Math.sin(frame / 4) * 12}px ${colors.accent}` }}>✦ Claude</div>
      </In>

      {rows.map((r, i) => {
        const p = at(0.08 + i * 0.16, 0.3 + i * 0.16);
        const n = Math.round(interpolate(p, [0, 1], [0, r.n]));
        return (
          <In key={i} p={p} y={70} style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 660 + i * 300, height: 270, padding: "40px 44px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 40, border: r.hot ? `1.5px solid ${colors.accent}` : glass.border, background: r.hot ? "rgba(255,107,53,0.12)" : glass.background }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 150, lineHeight: 1, letterSpacing: -6, width: 190, color: r.hot ? colors.accent : colors.white, textShadow: r.hot ? `0 0 50px ${colors.accent}88` : "none" }}>{n}</div>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 44, color: colors.white, letterSpacing: -1 }}>{r.t}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 27, color: "rgba(255,255,255,0.55)", marginTop: 10 }}>{r.s}</div>
            </div>
          </In>
        );
      })}

      <In p={at(0.72, 0.9)} y={30} style={{ position: "absolute", left: 0, right: 0, top: 1600, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, borderRadius: 999, padding: "20px 36px", fontFamily: fonts.semibold, fontSize: 32, color: colors.white }}>
          <span style={{ color: colors.accent }}>✓</span> Postfach sortiert · in 2 Minuten
        </div>
      </In>
    </Stage>
  );
};

// Hook variant B, second half — "Und der dritte spart dir am meisten."
// Three step cards, the third one lights up. Content starts below the intro text-hook pill.
export const DreiSchritteBroll: React.FC<{ seconds: number }> = () => {
  const { frame, at } = useClip();
  const steps = [
    { t: "Sortieren", s: "dringend · später · unwichtig" },
    { t: "Antworten vorschreiben", s: "in deinem Ton" },
    { t: "Termine eintragen", s: "direkt in deinen Kalender" },
  ];
  const glow = at(0.35, 0.65);
  return (
    <Stage>
      <In p={1} style={{ position: "absolute", left: PAD, top: 440 }}>
        <div style={label}>Claude übernimmt dein Postfach</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 72, color: colors.white, letterSpacing: -3, marginTop: 6 }}>In 3 Schritten.</div>
      </In>
      {steps.map((st, i) => {
        const hot = i === 2;
        const p = at(i * 0.08, 0.2 + i * 0.08);
        return (
          <In key={i} p={p} y={50} style={{ ...glass, position: "absolute", left: PAD, right: PAD, top: 700 + i * 250, height: 210, padding: "34px 40px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 36, opacity: hot ? 1 : 1 - glow * 0.45, border: hot ? `1.5px solid rgba(255,107,53,${0.3 + glow * 0.7})` : glass.border, background: hot ? `rgba(255,107,53,${0.05 + glow * 0.12})` : glass.background, transform: `scale(${hot ? 1 + glow * 0.04 : 1})` }}>
            <div style={{ width: 110, height: 110, borderRadius: 55, flex: "none", display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 56, color: colors.white, background: hot ? colors.accent : "rgba(255,255,255,0.12)", boxShadow: hot ? `0 0 ${20 + glow * 40 + Math.sin(frame / 3) * 8}px ${colors.accent}` : "none" }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 44, color: colors.white, letterSpacing: -1 }}>{st.t}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "rgba(255,255,255,0.55)", marginTop: 8 }}>{st.s}</div>
            </div>
            {hot && (
              <div style={{ fontFamily: fonts.bold, fontSize: 26, color: colors.white, background: colors.accent, borderRadius: 999, padding: "10px 20px", opacity: glow, whiteSpace: "nowrap" }}>spart am meisten</div>
            )}
          </In>
        );
      })}
    </Stage>
  );
};
