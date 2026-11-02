// Firma series engine — episode.json schema (documented in ~/.claude/skills/firma-design/references/episode-schema.md)
import type { StorySpec } from "./story-data";
import type { NameCheckSpec } from "./namecheck";
export type Anchor = number | string;
export type RawWord = { i?: number; w: string; s: number; e: number };
export type MarkColor = "yellow" | "orange" | "red" | "blue" | "green";

// wall card icons (canvas glyphs)
export type CardIcon = "flyer" | "shirt" | "glove" | "cape" | "bag" | "more" | "coffee" | "candle" | "bone" | "web" | "plant" | "box" | "phone" | "soap";
// 3D object catalog for chain stations / hook prop / held items
export type ObjKind = "shop" | "printer" | "parcel" | "shirt" | "laptop" | "phone" | "coins" | "mail" | "box" | "partnerBot" | "emptyBox";

export type HookKey = "ki" | "ganz" | "alleine" | "ein" | "unt" | "aufbaut" | "ich" | "probier" | "das" | "aus" | "tagWord" | "tagNum" | "sie" | "kein" | "missing" | "end";

// icons of the why-reason cards (inline SVG, overlays.tsx WhyGlyph)
export type WhyIcon = "careLabel" | "thermoHot" | "thermoCold" | "chart" | "search" | "shirt" | "shirt1x" | "clock" | "euro" | "warn" | "check" | "truck" | "people";

export type Station = { obj: ObjKind; label: string; at?: Anchor; labelAt?: Anchor; arrowAt?: Anchor; logo?: string };

export type Act =
  | {
      type: "wall"; at: Anchor; thinkUntil?: Anchor;
      tie?: { left: string; mid: string; right: string; at: Anchor }; // optional banner under the wall ("UNSER PAKET  mit  RUND 110 €"), extras.tsx
    }
  | {
      type: "chain"; at: Anchor; stations: [Station, Station, Station]; logo?: string;
      badge?: { big: string; small: string; at: Anchor; pulse?: Anchor; station?: number };
      item?: { obj: ObjKind; at: Anchor; fly: Anchor };
      back?: { at: Anchor; go: Anchor; arrive: Anchor };
      lid?: Anchor;
    }
  | { type: "winner"; at: Anchor; card?: number; label?: string; icon?: CardIcon; fly?: Anchor; dimAt?: Anchor; stamp?: string; stampAt?: Anchor; hold?: ObjKind;
      bare?: boolean; bot?: { dx?: number; dz?: number; s?: number } } // bot = optional mascot placement for this act (x offset from the wall centre, z, scale); bare = no 3D winner card / stamp plate (an overlay object carries the beat, objects.tsx); default false
  | {
      // Vorschlag-/Ergebnis-Akt: calculation sheet (SheetSpec) comes back, rows/values pop on their words, hot row rolls, price tag hangs below (objects.tsx)
      type: "result"; at: Anchor; sheet: SheetSpec; roll?: boolean; /* roll: false = hot values pop in directly, no counting */ hl?: { row: number; at: Anchor }; y?: number; scale?: number; bot?: { dx?: number; dz?: number; s?: number };
    }
  | {
      type: "question"; at: Anchor; pill?: string; lines: string[]; pop?: Anchor; stamp?: string | null; stampAt?: Anchor; bubble?: Anchor;
      objects?: { kind?: "careShirt" | "chip"; text: string; at: Anchor; color?: "orange" | "gold" }[]; // optional 2D objects under the card (extras.tsx)
      card?: boolean; // false = no 3D question card (the story object carries the beat, story.tsx); default true
      bot?: { dx?: number; dz?: number; s?: number }; // optional mascot x offset from the wall centre (default 2.0), depth dz (default 0, negative = further back) + scale (default 1.05); smaller dx keeps it fully in frame
    }
  | { type: "table"; at: Anchor; title: string; cols: string[]; rows: string[][]; rowAt?: Anchor[]; hl?: { row: number; at: Anchor }; pop?: Anchor; stamp?: string; stampAt?: Anchor }
  | { type: "mock"; at: Anchor; kind: "website" | "logo" | "shirt" | "price"; name: string; line?: string; sub?: string; cta?: string; color?: string; pop?: Anchor; stamp?: string; stampAt?: Anchor }
  | {
      type: "claudeShot"; at: Anchor; src: string; title?: string; scroll?: [number, number]; marks?: { x: number; y: number; w: number; h: number; at: Anchor; color?: MarkColor }[];
      // optional camera inside the screenshot: keys [anchor, scale, cx, cy] (cx/cy = point of the displayed image, 1000 px wide, that sits in the window centre); eased 0.45 s from each key
      cam?: [Anchor, number, number, number][];
      bot?: { dx?: number; dz?: number; s?: number; hide?: boolean }; // optional (2026-10-31, Folge 16): mascot in the Claude backdrop of this act — offset from the default spot (dx, dz), scale (default 0.8), hide = no mascot; default unchanged
      crop?: [number, number]; // optional visible band [y0, y1] in displayed px (1000 px wide image); everything outside stays hidden (names, wrong numbers)
    }
  | { type: "hub"; at: Anchor; done?: Anchor; next?: Anchor }
  | {
      // Rückblick-Akt (≤ 6 s, directly after the hook): plan board full frame with the done steps, product card + banner
      // below the board, last done step lights up with the result of the previous episode, camera flies to today's step + pill.
      type: "recap"; at: Anchor;
      product: { label: string; at: Anchor };            // e.g. "SHIRTS MIT LOGO" on "Logo-Shirts"
      punch?: Anchor[];                                  // optional short camera push-ins on the board (e.g. on "Firma"), default none
      banner?: { text: string; at: Anchor };             // e.g. "erst auf Bestellung gedruckt" on "gedruckt"
      bot?: { dx?: number; s?: number };                 // optional: mascot x offset from the board centre (default 0.95) + scale (default 0.8)
      last?: { step?: number; label: string; at: Anchor; obj?: { kind: "yarn" | "shirt"; text: string; at: Anchor } }; // step (0-based, default = highest index in plan.done) shows `label` (result of the previous episode); obj = optional object card right of the product card (extras.tsx)
      today: { step?: number; pill: string; at: Anchor }; // default step = plan.current; camera flight + pill on "Heute"
    }
  | {
      // Warum-Beat: the chosen object stays, head pill "WARUM …?", 2–3 reason cards one after another (≥ 1.2 s apart)
      type: "why"; at: Anchor;
      card?: number;                 // wall index of the chosen card (keeps the wall + flown winner card), else label + icon
      label?: string; icon?: CardIcon;
      pill: string; pillAt?: Anchor; // "WARUM ERST WASCHEN?"
      cards: {
        icon: WhyIcon; big?: string; small: string; at: Anchor; hot?: boolean; // big = optional big number ("60 °C")
        vs?: { big: string; small: string; at: Anchor; bad?: boolean };      // counter value on the right half of the card (e.g. "30 °C Digitaldruck"), bad = red with ✗ (never struck through)
      }[];
      chip?: { text: string; at: Anchor }; // small chip under the head pill ("gleicher Anbieter")
      bot?: { dx?: number; dz?: number; s?: number }; // optional mascot placement for this act (default unchanged)
      bare?: boolean; // bare = engine draws no head pill / reason cards / 3D card (overlay objects carry the beat); cards still define the ≥ 1.2 s check; default false
    }
  | {
      type: "end"; at: Anchor; headline?: string; keywordAt: Anchor; plane: [Anchor, Anchor]; itemsAt: Anchor; copyAt: Anchor;
      items: { label: string; snip: string; table?: string[][] }[]; // table = optional mini table (first row = head) instead of the snip text, no file icon itemTag?: string; dimBoard?: boolean; // dimBoard = dark panel hides the plan board behind the DM items // chip before each item ("FRAGE" → "FRAGE 1")
      result?: { at: Anchor; line1: string; line1At: Anchor; parts: { text: string; at: Anchor; hot?: boolean }[] };
      hopAt?: Anchor;
      planeTo?: [number, number]; // optional (Folge 19): screen target of the DM plane (default = above the mascot head)
      sentIcon?: boolean; // optional (Folge 19): send chip shows only a large check icon instead of the ~40 px "gesendet" text
      big?: boolean; // optional (2026-10-31, Folge 16): DM label/snip ≥ 58 px and a larger result box (line1 ~96 px, parts ~72 px); default false = unchanged
      resultY?: number; // optional top y of the result box (default max(1130, below the DM items))
    };

export type Episode = {
  tag: number; // = folder key public/firma-ep/tag<tag>/ (kept for compatibility; equals `folge` when folge is set)
  folge?: number; // internal running episode number (5 per calendar day)
  serientag?: number; // calendar day of the series, the number that is SHOWN / spoken (default = tag)
  ersteFolgeDesTages?: boolean; // default true. Only the first episode of a day has the "TAG N" slam in the hook; the other 4 show no day stamp in the hook (HUD badge "TAG N/100" stays, never counts up within a day)
  seconds?: number;
  keyword: string;
  date?: string; // YYYY-MM-DD of the Desktop folder
  ringLight?: number; // optional: multiplier for the glow-ring point light under the mascot (default 1); < 1 keeps the face orange instead of washed out
  ringFixed?: boolean; // optional: mascot glow ring stays at the old fixed spot (XC − 1.2) instead of under the mascot (Folge 7 splice consistency), default off
  audio?: { voice?: string; words?: string; musicStart?: number; musicGain?: number; dips?: [Anchor, Anchor, number][]; musicCurve?: [number, number][] }; // musicCurve: optional own volume curve [sec, level] (regie beats.json), replaces the duck curve; mix still scales it down until ≥ 15 dB // dips: optional local music dips [from, to, factor] // musicGain: start factor on the duck curve (mix lowers it further until every act is ≥ 15 dB under the voice)
  anchors?: Record<string, Anchor>;
  plan: { title?: string; sub?: string; steps: string[]; current: number; done?: number[]; hudDone?: Anchor; wip?: number[] }; // wip = steps "in Arbeit" (orange, no check)
  hook: {
    headline: string[]; hot?: number; stamp: string; prop?: ObjKind; tileLabel?: string; at: Partial<Record<HookKey, Anchor>>;
    instant?: boolean;  // optional: whole headline (all lines) + hook object fully visible from frame 0 (no pop-in); default false
    keepHeadline?: boolean; // optional: headline (+ stamp at its h1 position) stays in every hook shot h1–h3, not only h1; default false
    planFrom?: Anchor;  // optional: plan board is hidden in the hook shots until this time (hook object never overlaps the board); default: always shown
    // Frame-1 result object (2D, centre of the frame, h1/h2): washer = front loader with temperature display + care labels
    result?:
      | { kind: "washer"; temp: string; fillAt?: Anchor; spinAt?: Anchor; outAt?: Anchor; labels: { temp: string; text: string; ok: boolean }[];
          roll?: { from: number; at: Anchor }; // display rolls from `from` (at `at`) up to temp (at fillAt), steps of 5
          stamps?: { label: number; text: string; at: Anchor }[]; // stamp slams onto care label i (label colour)
          pushAt?: Anchor } // 2D push-in on the washer (labels at frame 0 via hook.instant, board via hook.planFrom)
      // priceTags = big price tag (top line + big price, never an upper bound) + row of shop tags with "ERST AB n" stamps (extras.tsx)
      | { kind: "priceTags"; main: { top: string; big: string }; stamps: { text: string; at: Anchor }[]; punch?: Anchor[]; fillAt?: Anchor; outAt?: Anchor } // punch = 2D push-in steps (+5 % each)
      // calcSheet = finished calculation sheet at frame 0 (objects.tsx); beats = visible events (push = +4 % zoom, bad/good = hot row values, sweep, note, stamp)
      | { kind: "calcSheet"; sheet: SheetSpec; beats?: { at: Anchor; what: "push" | "bad" | "good" | "sweep" | "note" | "stamp" }[]; outAt?: Anchor; fillAt?: Anchor; y?: number; strong?: boolean }; // strong: strong beats (push-in on the hot row, red/green column glow, value slam, stamp re-slam), default off
  };
  claude: {
    at?: Anchor; logo?: Anchor; moveUp?: Anchor; cursorFrom?: Anchor;
    steps: { label: string; at: Anchor }[];
    feature?: { label: string; icon?: string; plus: Anchor; pick: Anchor; on: Anchor };
    prompt: string;
    typing: [Anchor, string][]; // [time, prompt typed up to and including this substring] — "" = nothing, "*" = all
    marks?: { find: string; at: Anchor; color: MarkColor }[];
    send: Anchor;
    rehook?: { lines: string[]; pill: string; from: Anchor; to: Anchor };
    attach?: { label: string; sub?: string; at: Anchor }; // file chip flies into the composer (e.g. result of the previous episode)
  };
  wall?: {
    cards: { label: string; icon: CardIcon }[];
    fill: { at: Anchor; step?: number };
    counter?: { label: string; at: Anchor; keys: [Anchor, number, number?][]; pulse?: Anchor; digits?: number };
    hl?: { i: number; at: Anchor; until?: Anchor }[];
    dim?: { i: number; at: Anchor }[];
    strike?: { at: Anchor; step?: number; cards: number[] };
    bot?: { dx?: number; dz?: number; s?: number; whyOnly?: boolean }; // whyOnly = no mascot in wall/winner shots (only in why/question); optional mascot in wall/winner/why shots: x offset from the wall centre (default -1.2), depth (default -0.4), scale (default 1.05)
  };
  acts: Act[];
  bot?: { hops?: [Anchor, number][] };
  // revenue counter (HUD). Invisible while the revenue is 0 €: shown only if start > 0 or a gain happens in this episode.
  // start > 0: pops in the hook at popAt (default: first spoken word "Umsatz", else 0.3 s), rolls 0 → start, stays in the HUD.
  // first gain while start = 0: big centre pop, rolls 0 → amount, then flies into the HUD and stays.
  umsatz?: { start: number; popAt?: Anchor; gains?: { at: Anchor; amount: number }[]; days?: number };
  sfx?: { t: Anchor; f: string; v?: number }[];
  story?: StorySpec;
  nameCheck?: NameCheckSpec; // optional naming-episode 2D layer (namecheck.tsx, Folge 8)
  captionY?: { from: Anchor; to: Anchor; y: number }[]; // optional (2026-10-31, Folge 16): caption band top y inside [from, to) (default 1400, why act 1660) — e.g. keep captions off the mascot's eyes in the CTA
  botHide?: [Anchor, Anchor][]; // optional (2026-10-29): mascot in wall/winner shots shrinks away (0.2 s) inside these windows, e.g. when the camera would cut it in half
  overlays?: Obj2D[]; // optional time-windowed 2D objects (objects.tsx), drawn above the world, below captions // optional story object that runs through the episode (story.tsx)
};

// ---- objects.tsx (Folge 7) ----
export type SheetSpec = {
  title: string; cols: string[]; hotCol?: number;
  rows: { label: string; vals: string[]; tone?: ("good" | "bad" | "dim" | "")[]; hot?: boolean; at?: Anchor; valAt?: (Anchor | undefined)[] }[];
  note?: { text: string; at?: Anchor }; stamp?: { text: string; at?: Anchor };
  tag?: { head: string; big?: string; small?: string; at: Anchor; bigAt?: Anchor; smallAt?: Anchor };
};
type O2 = { from: Anchor; to?: Anchor };
export type Obj2D =
  | (O2 & { kind: "pill"; text: string; y?: number; color?: "orange" | "gold" | "green" })
  | (O2 & {
      kind: "partners"; keys: { at: Anchor; place: "mini" | "duel" | "swap" | "top" | "haken" | "off" | "fade" }[]; // fade = fade out in place (mini spot), no flight
      cards: [PartnerCardSpec, PartnerCardSpec]; win?: number; stampOff?: Anchor; swap?: Anchor; bigStamp?: { text: string; at: Anchor; until?: Anchor };
      proof?: { src: string; srcW: number; sx: number; sy: number; sw: number; sh: number; w: number; y: number; at: Anchor; to?: Anchor; label?: string; x?: number; bare?: boolean }; // x = optional centre x (default 540, Folge 19); bare = image only, no white/dark frame + orange marker (Folge 19 board badges)
    })
  | (O2 & { kind: "bars"; title: string; icons?: number; max: number; bars: { label: string; value: number; color: "red" | "green" | "grey"; at: Anchor; valueAt?: Anchor; labelAt?: Anchor; inside?: boolean }[]; line?: { label: string; value: number; at: Anchor; valueAt?: Anchor }; pulses?: Anchor[]; y?: number; h?: number })
  | (O2 & { kind: "card"; title: string; iconText?: string; main: { pre?: string; preAt?: Anchor; big: string; at: Anchor; pulse?: Anchor[] }; vs?: { label: string; big: string; at: Anchor }; y?: number; h?: number })
  | (O2 & { kind: "careTag"; temp: string; strikeAt: Anchor; quote?: { text: string; label?: string; at: Anchor }; chip?: { text: string; at: Anchor }; pulse?: Anchor; y?: number })
  | (O2 & { kind: "nameSign"; text: string; head?: string; at: Anchor; wiggle?: Anchor[]; chain?: { n: number | string; label: string; at?: Anchor; lockAt?: Anchor; current?: boolean; arrowPulse?: Anchor }[]; y?: number });
export type PartnerCardSpec = { name: string; sub?: string; stamp?: { text: string; color?: "orange" | "grey" }; at?: Anchor };
