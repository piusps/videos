import React from "react";
import {
  AppIcon, AvatarSource, Board, CardGrid, Chip, Connector, CounterPill, ex, Gear, Icon, IsoCube, IsoTile, lerp, Place, Pop, Split, StatusBadge, Title, useFloat, useT,
} from "../components/ExplainerKit";
import { BrandLogo, FaceAvatar, Flag } from "../components/BrandMarks";
import { ScreenFlow } from "../components/ScreenFlow";
import { fonts } from "../theme";

// Superkind vision/launch video v2 (2026-09-29, script v4, ~60 s), Explainer style.
// `cues` = seconds from the window start at which the matching words begin (from captions.json).
// Layout rule (user feedback): during B-Roll the vision caption sits centred at y = 0.5 (the
// split seam), so full boards keep the band 880-1060 px free; split boards keep content above ~880.

export type LaunchProps = { seconds: number; avatar: AvatarSource; cues: number[] };
export const LAUNCH_AVATAR = "launch/tightened.mp4";
const at = (cues: number[], i: number, fallback: number) => (cues[i] ?? fallback) - 0.08;

// 1 "Ein guter AI Engineer kostet bis zu zweihunderttausend Euro im Jahr. Und einer reicht nicht, du brauchst ein ganzes Team. Mehrere hunderttausend Euro. Und dann ist noch nichts gebaut."
// cues: [kostet, einer(reicht), Team, Mehrere, nichts]
export const LaunchKosten: React.FC<LaunchProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(8);
  const s = ramp(at(cues, 1, 3) - 0.4, at(cues, 1, 3));
  const team = at(cues, 2, 4.5);
  const teamCount = ramp(at(cues, 3, 5.5), at(cues, 3, 5.5) + 0.01);
  return (
    <Split split={s} avatar={avatar}>
      <Place top={lerp(300, 50, s)} scale={lerp(1, 0.8, s)}>
        <Title text="Ein AI Engineer" at={-0.15} size={124} style={{ width: 1000 }} />
      </Place>
      {/* One engineer, then the whole team pops in next to him */}
      <div style={{ position: "absolute", top: lerp(470, 190, s) + f, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: lerp(0, 18, s) }}>
        {[0, 1, 2, 3].map((i) => (
          <Pop key={i} p={i === 0 ? pop(0.15) : pop(team + (i - 1) * 0.12)} from={0.5}>
            <IsoTile size={i === 0 ? lerp(330, 190, s) : 190} icon="user" />
          </Pop>
        ))}
      </div>
      <Place top={lerp(1100, 400, s)} scale={lerp(1.1, 0.9, s)}>
        <Pop p={pop(at(cues, 0, 0.6))}>
          {teamCount < 1 ? (
            <CounterPill from={0} to={200000} p={ramp(at(cues, 0, 0.6), at(cues, 0, 0.6) + 1.6)} suffix="€ / Jahr" icon="euro" />
          ) : (
            <CounterPill from={200000} to={600000} p={ramp(at(cues, 3, 5.5), at(cues, 3, 5.5) + 1.1)} suffix="€ / Jahr fürs Team" icon="euro" />
          )}
        </Pop>
      </Place>
      <Place top={560}>
        <Pop p={pop(at(cues, 4, 7))}><Chip text="und noch nichts gebaut" icon="info" big /></Pop>
      </Place>
    </Split>
  );
};

// 2 "Wir waren genau dieses Team, in über zwanzig Unternehmen."  cues: [Team, zwanzig]
export const LaunchFirmen: React.FC<LaunchProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const items = Array.from({ length: 20 }).map((_, i) => (
    <Icon key={i} name={i % 3 === 0 ? "building" : i % 3 === 1 ? "users" : "file"} size={62} color={i % 4 === 0 ? "#FF6B35" : "#CFCFCF"} />
  ));
  return (
    <Split split={1} avatar={avatar}>
      <Place top={50} scale={0.8}>
        <Title text="Über 20 Unternehmen" at={-0.15} size={112} style={{ width: 1000 }} />
      </Place>
      <Place top={200} scale={0.74}>
        <CardGrid items={items} cols={5} at={0.05} step={Math.max(0.02, (at(cues, 1, 1.2) - 0.05) / 20)} cell={150} gap={18} />
      </Place>
      <Place top={755} scale={0.9}>
        <Pop p={pop(at(cues, 1, 1.2))}><CounterPill from={0} to={20} p={ramp(at(cues, 1, 1.2), at(cues, 1, 1.2) + 0.8)} suffix="Unternehmen" icon="building" /></Pop>
      </Place>
    </Split>
  );
};

// 3 "Und hier auf Instagram kommt jeden Tag dieselbe Frage: Wie kriege ich das in meine Firma?"
// cues: [jeden, dieselbe, Wie]
export const LaunchNachrichten: React.FC<LaunchProps> = ({ cues, seconds }) => {
  const { pop, ramp } = useT();
  const names = ["Geschäftsführer", "Inhaberin", "Ops-Leitung", "CFO", "Geschäftsführerin", "Vertriebsleitung", "Inhaber", "IT-Leitung", "Geschäftsführer", "Prokuristin", "COO", "Inhaber"];
  const card = (i: number) => (
    <Pop key={i} p={pop(0.05 + i * 0.08)} from={0.9} y={20}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, background: ex.white, borderRadius: 26, padding: "18px 24px", boxShadow: "0 10px 26px rgba(0,0,0,0.08)" }}>
        <FaceAvatar seed={i + 3} size={68} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: "#8A8A8A" }}>{names[i]}</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: ex.ink, letterSpacing: -0.6 }}>Wie kriege ich das in meine Firma?</div>
        </div>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#3B82F6" }} />
      </div>
    </Pop>
  );
  const scroll = ramp(at(cues, 0, 0.5), seconds, (x) => x) * 260;
  // Two stacks above and below the caption band, both scrolling up like a busy inbox.
  const stack = (from: number, top: number, height: number) => (
    <div style={{ position: "absolute", left: 100, width: 880, top, height, overflow: "hidden", maskImage: "linear-gradient(to bottom, transparent 0, #000 10%, #000 88%, transparent 100%)" }}>
      <div style={{ transform: `translateY(${-scroll}px)`, display: "flex", flexDirection: "column", gap: 18, paddingTop: 20 }}>{[0, 1, 2, 3, 4, 5].map((k) => card(from + k))}</div>
    </div>
  );
  return (
    <Board>
      <Place top={140}><Title text="Jeden Tag" at={-0.15} size={118} style={{ width: 1000 }} /></Place>
      {stack(0, 300, 560)}
      {stack(6, 1080, 460)}
      <Place top={1580}>
        <Pop p={pop(at(cues, 1, 1.5))}><CounterPill from={0} to={100} p={ramp(at(cues, 1, 1.5), at(cues, 2, 2.4))} suffix="+ Nachrichten" icon="message" /></Pop>
      </Place>
    </Board>
  );
};

// 4 "Also haben wir gebaut, was kein Team der Welt sein kann: superkind."  cues: [Also, superkind, kein]
export const LaunchReveal: React.FC<LaunchProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(10, 3);
  const glow = ramp(at(cues, 1, 1.2), at(cues, 1, 1.2) + 0.6);
  return (
    <Board>
      <Gear size={420} speed={0.3} style={{ position: "absolute", left: -120, top: 200, opacity: 0.55 }} />
      <Gear size={300} speed={-0.4} style={{ position: "absolute", left: 860, top: 1300, opacity: 0.55 }} />
      <Place top={270}><Title text="Kein Team der Welt" at={at(cues, 2, 0.1)} step={0.14} size={96} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      <Place top={470 + f}>
        <Pop p={pop(at(cues, 1, 1.2) - 0.1, 11)} from={0.3}>
          <div style={{ filter: `drop-shadow(0 0 ${60 * glow}px rgba(255,107,53,${0.55 * glow}))` }}><AppIcon size={330} logo /></div>
        </Pop>
      </Place>
      <Place top={1110}>
        <Pop p={pop(at(cues, 1, 1.2) + 0.12)} from={0.8}>
          <div style={{ fontFamily: fonts.bold, fontSize: 150, letterSpacing: -7, color: ex.title }}>superkind</div>
        </Pop>
      </Place>
    </Board>
  );
};

// 5 "Jeder in deiner Firma baut sich eigene KI-Agenten. Du schreibst ihnen wie einem Kollegen, per E-Mail, in Teams oder Slack. Wo liegt der Rahmenvertrag mit Kern Stahlbau? Sekunden später hast du ihn im Anhang."
// cues: [KI-Agenten, Kollegen, E-Mail, Teams, Slack, Wo, Sekunden]
export const LaunchKollege: React.FC<LaunchProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const bubble = (mine: boolean, children: React.ReactNode) => (
    <div style={{ maxWidth: 700, padding: "22px 28px", borderRadius: 28, borderBottomRightRadius: mine ? 8 : 28, borderBottomLeftRadius: mine ? 28 : 8, background: mine ? ex.chip : ex.white, color: mine ? ex.chipText : ex.ink, fontFamily: fonts.semibold, fontSize: 34, letterSpacing: -0.4, lineHeight: 1.25, boxShadow: "0 12px 28px rgba(0,0,0,0.12)" }}>{children}</div>
  );
  const typing = ramp(at(cues, 6, 6.5) - 0.5, at(cues, 6, 6.5));
  const chat = ramp(at(cues, 1, 3) - 0.35, at(cues, 1, 3));
  const agents = [["Angebote", "file"], ["Buchhaltung", "euro"], ["Support", "message"], ["Recruiting", "users"]] as const;
  return (
    <Split split={1} avatar={avatar}>
      <Place top={50}><Title text="Dein KI-Kollege" at={-0.15} size={104} style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 230, left: 90, width: 900, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, opacity: 1 - chat, transform: `scale(${1 - 0.06 * chat})` }}>
        {agents.map(([name, icon], i) => (
          <Pop key={name} p={pop(0.2 + i * Math.max(0.2, (at(cues, 0, 1.2) - 0.2) / 3))} from={0.8}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 28px", borderRadius: 28, background: ex.white, boxShadow: "0 14px 32px rgba(0,0,0,0.1)" }}>
              <AppIcon size={96} icon={icon} />
              <div>
                <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: "#8A8A8A" }}>KI-Agent</div>
                <div style={{ fontFamily: fonts.bold, fontSize: 38, color: ex.ink, letterSpacing: -0.8 }}>{name}</div>
              </div>
            </div>
          </Pop>
        ))}
      </div>
      <div style={{ position: "absolute", top: 200, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 18, opacity: chat }}>
        {[["E-Mail", 2], ["Teams", 3], ["Slack", 4]].map(([label, i]) => (
          <Pop key={label as string} p={pop(at(cues, i as number, 3 + (i as number) * 0.4))}><Chip text={label as string} leading={<BrandLogo name={label as string} size={30} />} big /></Pop>
        ))}
      </div>
      <div style={{ position: "absolute", top: 350, right: 70 }}>
        <Pop p={pop(at(cues, 5, 5))} from={0.85}>{bubble(true, "Wo liegt der Rahmenvertrag mit Kern Stahlbau?")}</Pop>
      </div>
      <div style={{ position: "absolute", top: 545, left: 70, display: "flex", flexDirection: "column", gap: 14 }}>
        {typing > 0 && typing < 1 && (
          <div style={{ display: "flex", gap: 10, padding: "22px 28px", background: ex.white, borderRadius: 28, width: 130, boxShadow: "0 12px 28px rgba(0,0,0,0.1)" }}>
            {[0, 1, 2].map((d) => <div key={d} style={{ width: 16, height: 16, borderRadius: 8, background: "#BDBDBD", opacity: 0.4 + 0.6 * Math.abs(Math.sin((typing * 6 + d) * 1.2)) }} />)}
          </div>
        )}
        <Pop p={pop(at(cues, 6, 6.5))} from={0.85}>{bubble(false, <span>Hier ist er, im Anhang.</span>)}</Pop>
        <Pop p={pop(at(cues, 6, 6.5) + 0.25)} from={0.85}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "18px 24px", background: ex.white, borderRadius: 20, border: `3px solid ${ex.tileTop}`, boxShadow: "0 12px 28px rgba(0,0,0,0.1)" }}>
            <Icon name="file" size={44} color={ex.tileTop} />
            <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: ex.ink }}>Rahmenvertrag_Kern_Stahlbau.pdf</span>
          </div>
        </Pop>
      </div>
    </Split>
  );
};

// 6 "Sie arbeiten direkt in euren Systemen, von Outlook bis Datev. Dein Firmenwissen wird zum Company Brain, das mitwächst."
// cues: [Systemen, Outlook, Datev, Company, mitwächst]
export const LaunchBrain: React.FC<LaunchProps> = ({ avatar, cues }) => {
  const { pop, ramp } = useT();
  const f = useFloat(7);
  const brain = ramp(at(cues, 3, 3.5) - 0.25, at(cues, 3, 3.5) + 0.2);
  const o = at(cues, 1, 1);
  const d = at(cues, 2, 2);
  const systems: [string, number][] = [["Outlook", o], ["SAP", o + (d - o) / 3], ["HubSpot", o + (2 * (d - o)) / 3], ["Datev", d]];
  const c = at(cues, 3, 3.5);
  const rules = [
    { text: "Freigaben", icon: "check", x: 210, y: 660, t: c + 0.45 },
    { text: "Reklamationen", icon: "mail", x: 540, y: 740, t: c + 0.75 },
    { text: "Tonfall", icon: "message", x: 870, y: 660, t: c + 1.05 },
  ];
  return (
    <Split split={1} avatar={avatar}>
      <div style={{ opacity: 1 - brain }}>
        <Place top={50}><Title text="In euren Systemen" at={-0.15} size={100} style={{ width: 1000 }} /></Place>
        <div style={{ position: "absolute", top: 260, left: 0, width: 1080, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, padding: "0 110px" }}>
          {systems.map(([name, t]) => (
            <Pop key={name} p={pop(t)}><Chip text={name} leading={<BrandLogo name={name} size={30} />} big /></Pop>
          ))}
        </div>
        <Place top={500}><Pop p={pop(d + 0.4)}><StatusBadge text="Nichts zieht um" /></Pop></Place>
      </div>
      <div style={{ opacity: brain }}>
        <Gear size={240} style={{ position: "absolute", left: 120, top: 250, opacity: 0.85 }} />
        <Gear size={160} speed={-0.9} style={{ position: "absolute", left: 800, top: 390, opacity: 0.85 }} />
        <Place top={50}><Title text="Company Brain" at={c - 0.2} size={112} style={{ width: 1000 }} /></Place>
        <Place top={200 + f}><Pop p={pop(c)}><IsoCube size={250} top="brain" left="book" right="shield" glow={ramp(at(cues, 4, 5), at(cues, 4, 5) + 0.5)} /></Pop></Place>
        {rules.map((r) => (
          <React.Fragment key={r.text}>
            <Connector from={[540, 480]} to={[r.x, r.y]} p={ramp(r.t - 0.3, r.t)} curve={(r.x - 540) * 0.25} />
            <div style={{ position: "absolute", top: r.y, left: r.x }}><div style={{ transform: "translateX(-50%)" }}><Pop p={pop(r.t)}><Chip text={r.text} icon={r.icon} big /></Pop></div></div>
          </React.Fragment>
        ))}
        <Place top={230} left={690}><Pop p={pop(at(cues, 4, 5))}><StatusBadge text="wächst mit" /></Pop></Place>
      </div>
    </Split>
  );
};

// 7 "DSGVO-konform, gehostet in Frankfurt."  cues: [DSGVO, Frankfurt]
export const LaunchVertrauen: React.FC<LaunchProps> = ({ avatar, cues }) => {
  const { pop } = useT();
  const badges = [
    { icon: "shield", title: "DSGVO", sub: "konform", t: at(cues, 0, 0.1) },
    { icon: "globe", title: "Frankfurt", sub: "gehostet", t: at(cues, 1, 1) },
  ];
  return (
    <Split split={1} avatar={avatar}>
      <Place top={60}><Title text="Eure Daten bleiben eure" at={-0.15} size={92} style={{ width: 1000 }} /></Place>
      <div style={{ position: "absolute", top: 300, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 36 }}>
        {badges.map((b) => (
          <Pop key={b.title} p={pop(b.t)} from={0.7}>
            <div style={{ width: 340, height: 420, borderRadius: 36, background: ex.white, boxShadow: "0 18px 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <IsoTile size={200} icon={b.icon} />
              <div style={{ fontFamily: fonts.bold, fontSize: 44, color: ex.ink, letterSpacing: -1 }}>{b.title}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 30, color: "#8A8A8A" }}>{b.sub}</div>
            </div>
          </Pop>
        ))}
      </div>
    </Split>
  );
};

// 8 "Die großen KI-Modelle kommen aus Amerika und China. Unsere Mission: den deutschen Mittelstand in die Offensive bringen."
// cues: [Amerika, China, Mission, Mittelstand, Offensive]. Flags on every country chip (same treatment for all three).
export const LaunchMission: React.FC<LaunchProps> = ({ cues }) => {
  const { pop, ramp } = useT();
  const rise = ramp(at(cues, 4, 4.5), at(cues, 4, 4.5) + 0.9);
  const f = useFloat(8, 2.6);
  const side = (label: string, country: "us" | "cn", i: number, x: number) => (
    <div style={{ position: "absolute", top: 400, left: x, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: lerp(1, 0.45, rise) }}>
      <Pop p={pop(at(cues, i, i * 0.8))}><div style={{ filter: "grayscale(1) brightness(1.15)" }}><IsoCube size={150} /></div></Pop>
      <Pop p={pop(at(cues, i, i * 0.8) + 0.1)}><Chip text={label} leading={<Flag country={country} size={22} />} big /></Pop>
    </div>
  );
  return (
    <Board>
      <Place top={170}><Title text="Die großen Modelle" at={-0.15} size={100} color="#7A7A7A" style={{ width: 1000 }} /></Place>
      {side("Amerika", "us", 0, 210)}
      {side("China", "cn", 1, 870)}
      <Place top={lerp(470, 420, rise) + f}>
        <Pop p={pop(at(cues, 3, 3.5))} from={0.4}><IsoCube size={lerp(220, 290, rise)} left="building" right="users" glow={rise} /></Pop>
      </Place>
      <Place top={1100}>
        <Pop p={pop(at(cues, 3, 3.5) + 0.1)}><Chip text="Deutscher Mittelstand" leading={<Flag country="de" size={22} />} big /></Pop>
      </Place>
      <Place top={1220}>
        <Pop p={pop(at(cues, 4, 4.5))}><div style={{ fontFamily: fonts.bold, fontSize: 118, letterSpacing: -5, color: ex.tileTop }}>in die Offensive</div></Pop>
      </Place>
    </Board>
  );
};

// 9 "Trag dich auf die Warteliste ein, und du bekommst zweihundert Euro Guthaben, sobald wir live sind."
// cues: [Trag, Trag, Warteliste, zweihundert, live]. Real superkind.ai/warteliste click path (POSTs blocked at capture).
const flowTiming = (cues: number[], seconds: number) => {
  const c0 = (cues[1] ?? 0.1) - 0.08;
  const end = Math.min(seconds - 0.25, Math.max(c0 + 4.2, (cues[4] ?? seconds - 0.4) - 0.08));
  const k = (end - c0) / 5.35;
  return (x: number) => c0 + x * k;
};
// Click moments (seconds in the clip), so the SFX land on the visual clicks.
export const wartelisteClicks = (cues: number[], seconds: number) => [0.35, 1.8, 2.2, 3.6, 3.95, 5.35].map(flowTiming(cues, seconds));

export const LaunchWarteliste: React.FC<LaunchProps> = ({ avatar, cues, seconds }) => {
  const T = flowTiming(cues, seconds);
  const R = {
    name: { x: 446, y: 477, w: 410, h: 48 }, weiter1: { x: 862, y: 477, w: 132, h: 48 },
    email: { x: 446, y: 480, w: 410, h: 48 }, weiter2: { x: 862, y: 480, w: 132, h: 48 },
    phone: { x: 446, y: 480, w: 355, h: 48 }, submit: { x: 807, y: 480, w: 187, h: 48 },
    nameText: { x: 464, y: 477, w: 136.1, h: 48 }, emailText: { x: 464, y: 480, w: 113.5, h: 48 }, phoneText: { x: 464, y: 480, w: 132.8, h: 48 },
  };
  const mid = (r: { x: number; y: number; w: number; h: number }, dx = 0) => ({ x: r.x + r.w / 2 + dx, y: r.y + r.h / 2 });
  return (
    <Split split={1} avatar={avatar}>
      <ScreenFlow
        dir="launch"
        viewport={{ width: 1440, height: 900 }}
        url="superkind.ai/warteliste"
        box={{ x: 40, y: 64, w: 1000, h: 800 }}
        screens={[{ at: 0, shot: "s1-start.png" }, { at: T(1.95), shot: "s2-start.png" }, { at: T(3.75), shot: "s3-start.png" }]}
        typing={[
          { from: T(0.5), to: T(1.3), shot: "s1-filled.png", text: R.nameText, chars: 14, field: R.name },
          { from: T(2.3), to: T(3.0), shot: "s2-filled.png", text: R.emailText, chars: 12, field: R.email },
          { from: T(4.05), to: T(4.7), shot: "s3-filled.png", text: R.phoneText, chars: 14, field: R.phone },
        ]}
        cursor={[
          { t: 0, x: 1060, y: 680 },
          { t: T(0.35), ...mid(R.name, -60), click: true },
          { t: T(1.35), ...mid(R.name, -60) },
          { t: T(1.8), ...mid(R.weiter1), click: true },
          { t: T(2.2), ...mid(R.email, -60), click: true },
          { t: T(3.1), ...mid(R.email, -60) },
          { t: T(3.6), ...mid(R.weiter2), click: true },
          { t: T(3.95), ...mid(R.phone, -40), click: true },
          { t: T(4.8), ...mid(R.phone, -40) },
          { t: T(5.35), ...mid(R.submit), click: true },
        ]}
        camera={[
          { t: 0, cx: 720, cy: 470, zoom: 1.7 },
          { t: T(0.4), cx: 720, cy: 500, zoom: 1.8 },
          { t: T(4.9), cx: 740, cy: 500, zoom: 1.85 },
          { t: T(5.35) + 1, cx: 790, cy: 500, zoom: 2.05 },
        ]}
        highlights={[
          { from: T(0.1), to: T(1.4), rect: R.name },
          { from: T(1.4), to: T(1.95), rect: R.weiter1 },
          { from: T(2.0), to: T(3.2), rect: R.email },
          { from: T(3.2), to: T(3.75), rect: R.weiter2 },
          { from: T(3.85), to: T(4.85), rect: R.phone },
          { from: T(4.9), to: seconds, rect: R.submit },
        ]}
      />
    </Split>
  );
};
