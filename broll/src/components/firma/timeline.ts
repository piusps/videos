// Firma series engine — pure timeline (no React / three). Shared by FirmaEpisode.tsx and scripts/firma-mix.mjs.
// An episode = episode.json + voice + words.json. Every time in the JSON is an *anchor* (see parseAnchor).
import type { Episode, Anchor, RawWord, Act, Station, HookKey } from "./schema";
import { resolveStory } from "./story-data";

export const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");

// Anchor grammar (strings):  word[#n][@after][:end][+/-offset]   or   $name[+/-offset]
//   "Logo@23+0.33"  = start of the first "Logo" at/after 23 s, plus 0.33 s
//   "Claude#2"      = second "Claude" in the voice;   "Stück:end" = end of the word
//   "$send-0.18"    = named anchor from episode.anchors
// Numbers are absolute seconds. Numeric strings ("300", "1") are words.
export const makeResolver = (words: RawWord[], named: Record<string, Anchor> = {}) => {
  const memo = new Map<string, number>();
  const res = (a: Anchor, depth = 0): number => {
    if (typeof a === "number") return a;
    if (memo.has(a)) return memo.get(a)!;
    if (depth > 8) throw new Error(`anchor loop: ${a}`);
    let s = a.trim(), off = 0;
    const mo = s.match(/\s*([+-]\s*\d+(?:\.\d+)?)$/);
    if (mo && mo.index! > 0) { off = parseFloat(mo[1].replace(/\s/g, "")); s = s.slice(0, mo.index); }
    let useEnd = false;
    if (s.endsWith(":end")) { useEnd = true; s = s.slice(0, -4); }
    let after = -1;
    const ma = s.match(/@(\d+(?:\.\d+)?)$/);
    if (ma) { after = parseFloat(ma[1]); s = s.slice(0, ma.index); }
    let nth = 1;
    const mn = s.match(/#(\d+)$/);
    if (mn) { nth = parseInt(mn[1], 10); s = s.slice(0, mn.index); }
    let base: number;
    if (s.startsWith("$")) {
      const key = s.slice(1);
      if (!(key in named)) throw new Error(`named anchor missing: ${key}`);
      base = res(named[key], depth + 1);
    } else {
      const k = norm(s);
      const hits = words.filter((x) => norm(x.w) === k && x.s >= after - 1e-6);
      const hit = hits[nth - 1];
      if (!hit) throw new Error(`anchor not found: "${a}" (word "${s}" #${nth} after ${after})`);
      base = useEnd ? hit.e : hit.s;
    }
    const v = base + off;
    memo.set(a, v);
    return v;
  };
  return res;
};

// ---------------------------------------------------------------------------------------------
// resolved timeline
// ---------------------------------------------------------------------------------------------
export type ShotKind = "h1" | "h2" | "h3" | "h4" | "claude" | Act["type"];
export type Shot = { kind: ShotKind; a: number; b: number; act?: number };
export type SfxEvent = { t: number; f: string; v: number };

// V7 hook proportions (seconds in Tag 1 v7, hook end "Heute" = 6.70) — used when a hook anchor is missing
const HOOK_V7: Record<HookKey, number> = {
  ki: 0.95, ganz: 1.32, alleine: 1.58, ein: 1.95, unt: 2.11, aufbaut: 2.55, ich: 3.18, probier: 3.37, das: 3.63, aus: 3.81,
  tagWord: 4.38, tagNum: 4.68, sie: 5.4, kein: 5.84, missing: 6.01, end: 6.7,
};

const easeC = (v: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, v)), 3);
const mapObj = <T, U>(o: Record<string, T>, f: (v: T) => U): Record<string, U> => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));

export const buildTimeline = (ep: Episode, words: RawWord[]) => {
  const at = makeResolver(words, ep.anchors ?? {});
  const opt = (a: Anchor | undefined, fb: number) => (a === undefined ? fb : at(a));
  const lastE = words.length ? words[words.length - 1].e : 10;
  const END = ep.seconds ?? Math.round((lastE + 1.0) * 10) / 10;

  // ---- hook ----
  const hookEnd = at(ep.hook.at.end ?? HOOK_V7.end);
  const ha = (k: HookKey) => (ep.hook.at[k] !== undefined ? at(ep.hook.at[k]!) : (HOOK_V7[k] / HOOK_V7.end) * hookEnd);
  const H = mapObj(HOOK_V7 as Record<string, number>, () => 0) as Record<HookKey, number>;
  (Object.keys(HOOK_V7) as HookKey[]).forEach((k) => { H[k] = ha(k); });
  const HK = {
    head: 0.25, firma: 0.55, drop0: H.ki - 0.22, land: H.ki + 0.04, chair: H.ganz, stamp: H.alleine,
    h2: H.ein - 0.02, cas: H.unt - 0.06, casD: 0.085, steps: H.aufbaut, h3: H.ich - 0.06, lever: H.probier,
    lamps: [H.das, H.aus, H.aus + 0.2], slam: H.tagWord, one: H.tagNum, fly0: H.tagNum + 0.36, fly1: H.tagNum + 0.62,
    h4: H.sie - 0.06, tile: H.sie, rattle: H.sie + 0.2, lid: H.kein, dust: H.kein + 0.1, q: H.missing, moth: H.missing + 0.14,
    end: hookEnd, kein: H.kein, missing: H.missing, tagNum: H.tagNum, ki: H.ki,
    planFrom: ep.hook.planFrom !== undefined ? at(ep.hook.planFrom) : -1, instant: ep.hook.instant === true,
  };

  // ---- recap act (Rückblick, between hook and Claude): no "heute fehlt X" box shot (h4) then ----
  const recapI = ep.acts.findIndex((x) => x.type === "recap");
  const recapX = recapI >= 0 ? (ep.acts[recapI] as Extract<Act, { type: "recap" }>) : undefined;
  if (recapX) HK.h4 = 1e9;
  const recapToday = recapX ? at(recapX.today.at) : 1e9;

  // ---- claude paper act ----
  const c = ep.claude;
  const send = at(c.send);
  const steps = c.steps.map((s) => ({ label: s.label, at: at(s.at) }));
  const C = {
    at: opt(c.at, recapX ? recapToday + 1.6 : hookEnd - 0.15),
    logo: opt(c.logo, recapX ? opt(c.at, recapToday + 1.6) + 0.95 : hookEnd + 0.8),
    steps,
    moveUp: opt(c.moveUp, steps[1] ? steps[1].at - 0.1 : send - 2),
    send,
    feature: c.feature ? { label: c.feature.label, icon: c.feature.icon ?? "research", plus: at(c.feature.plus), pick: at(c.feature.pick), on: at(c.feature.on) } : undefined,
    typing: c.typing.map(([a, upto]) => {
      const n = upto === "" ? 0 : upto === "*" ? c.prompt.length : c.prompt.indexOf(upto) + upto.length;
      if (upto !== "" && upto !== "*" && c.prompt.indexOf(upto) < 0) throw new Error(`typing target not in prompt: ${upto}`);
      return [at(a), n] as [number, number];
    }),
    marks: (c.marks ?? []).map((m) => ({ find: m.find, at: at(m.at), color: m.color })),
    rehook: c.rehook ? { ...c.rehook, from: at(c.rehook.from), to: at(c.rehook.to) } : undefined,
    cursorFrom: opt(c.cursorFrom, steps[0]?.at ?? hookEnd + 1),
    attach: c.attach ? { ...c.attach, at: at(c.attach.at) } : undefined,
  };
  // Frame-1 result object (hook)
  const hr = ep.hook.result;
  const hookResult = hr ? { ...hr, fillAt: opt(hr.fillAt, 0.2), spinAt: opt((hr as any).spinAt, 0.6), outAt: opt(hr.outAt, HK.h3 - 0.05), stamps: hr.kind === "priceTags" ? hr.stamps.map((s) => ({ text: s.text, at: at(s.at) })) : undefined, punch: hr.kind === "priceTags" ? (hr.punch ?? []).map((a) => at(a)) : undefined, wStamps: hr.kind === "washer" && hr.stamps ? hr.stamps.map((s) => ({ label: s.label, text: s.text, at: at(s.at) })) : undefined, rollAt: hr.kind === "washer" && hr.roll ? at(hr.roll.at) : undefined, pushT: hr.kind === "washer" && hr.pushAt !== undefined ? at(hr.pushAt) : undefined } : undefined;

  // ---- acts → shots ----
  const acts = ep.acts.map((x) => x);
  const actAt = acts.map((x) => at(x.at));
  const shots: Shot[] = [
    { kind: "h1", a: 0, b: 0 }, { kind: "h2", a: HK.h2, b: 0 }, { kind: "h3", a: HK.h3, b: 0 }, ...(recapX ? [] : [{ kind: "h4" as ShotKind, a: HK.h4, b: 0 }]),
    ...acts.map((x, i) => ({ kind: x.type as ShotKind, a: actAt[i], b: 0, act: i })).filter((s) => s.kind === "recap"),
    { kind: "claude", a: C.at, b: 0 },
    ...acts.map((x, i) => ({ kind: x.type as ShotKind, a: actAt[i], b: 0, act: i })).filter((s) => s.kind !== "recap"),
  ];
  for (let i = 0; i < shots.length; i++) shots[i].b = i + 1 < shots.length ? shots[i + 1].a : END;
  const warnings: string[] = [];
  shots.forEach((s) => {
    if (s.kind === "recap" && s.b - s.a > 6.05) warnings.push(`recap act is ${(s.b - s.a).toFixed(2)} s long (rule: ≤ 6 s)`);
  });
  for (let i = 1; i < shots.length; i++) if (shots[i].a < shots[i - 1].a) throw new Error(`shots out of order at ${shots[i].kind} (${shots[i].a.toFixed(2)} < ${shots[i - 1].a.toFixed(2)})`);

  // ---- per-act resolved data ----
  const A = acts.map((x, i) => resolveAct(x, actAt[i], at));
  const findAct = <K extends Act["type"]>(k: K) => {
    const i = acts.findIndex((x) => x.type === k);
    return i < 0 ? undefined : { i, r: A[i] as ResolvedAct, a: actAt[i] };
  };

  // ---- wall (shared by wall / winner / question shots) ----
  const w = ep.wall;
  const wall = w ? {
    cards: w.cards,
    fillAt: (k: number) => at(w.fill.at) + k * (w.fill.step ?? 0.22),
    fillStart: at(w.fill.at),
    counter: w.counter ? { label: w.counter.label, at: at(w.counter.at), keys: w.counter.keys.map(([a, v, d]) => [at(a), v, d ?? 0.5] as [number, number, number]), pulse: opt(w.counter.pulse, -99), digits: w.counter.digits ?? 3 } : undefined,
    hl: (w.hl ?? []).map((h) => ({ i: h.i, at: at(h.at), until: h.until === undefined ? 1e9 : at(h.until) })),
    dim: (w.dim ?? []).map((d) => ({ i: d.i, at: at(d.at) })),
    strike: w.strike ? { at: at(w.strike.at), step: w.strike.step ?? 0.09, cards: w.strike.cards } : undefined,
  } : undefined;

  const win = findAct("winner");
  const hub = findAct("hub");
  const plan = {
    title: ep.plan.title ?? "GRÜNDUNGSPLAN",
    steps: ep.plan.steps,
    current: ep.plan.current,
    page: Math.floor(ep.plan.current / 9),
    sub: ep.plan.sub,
    done: new Set<number>(ep.plan.done ?? Array.from({ length: ep.plan.current }, (_, k) => k)),
    wip: new Set<number>(ep.plan.wip ?? []),
    hudDone: ep.plan.hudDone !== undefined ? at(ep.plan.hudDone) : hub ? (hub.r as any).done : 1e9,
    boardDone: hub ? (hub.r as any).done : 1e9,
    next: hub ? (hub.r as any).next : 1e9,
  };

  const hops: [number, number][] = ep.bot?.hops
    ? ep.bot.hops.map(([a, h]) => [at(a), h])
    : autoHops(C, wall, A, acts);

  // ---- revenue counter (only when > 0) ----
  const u = ep.umsatz;
  const gains = (u?.gains ?? []).map((g) => ({ at: at(g.at), amount: g.amount })).sort((a, b) => a.at - b.at);
  const hasU = !!u && (u.start > 0 || gains.some((g) => g.amount > 0));
  const umsatzWord = words.find((x) => norm(x.w) === "umsatz");
  const umsatz = hasU ? {
    start: u!.start, days: u!.days ?? 100, gains,
    popAt: u!.start > 0 ? opt(u!.popAt, umsatzWord ? umsatzWord.s : 0.3) : 1e9,
    firstBig: u!.start <= 0 ? gains.find((g) => g.amount > 0) ?? null : null,
  } : undefined;
  const umsatzAt = (t: number) => {
    if (!umsatz) return 0;
    let v = umsatz.start > 0 ? umsatz.start * easeC((t - umsatz.popAt - 0.15) / 0.9) : 0;
    for (const g of umsatz.gains) v += g.amount * easeC((t - g.at - (umsatz.firstBig === g ? 0.3 : 0.1)) / (umsatz.firstBig === g ? 1.0 : 0.7));
    return v;
  };

  // ---- why act: every reason card must stay ≥ 1.2 s alone before the next one comes (hard rule, Pius 2026-10-28) ----
  acts.forEach((x, i) => {
    if (x.type !== "why") return;
    const r = A[i];
    const ts: number[] = r.cards.map((k: any) => k.at);
    for (let k = 1; k < ts.length; k++) if (ts[k] - ts[k - 1] < 1.2 - 1e-6) throw new Error(`why act ${i}: card ${k + 1} comes ${(ts[k] - ts[k - 1]).toFixed(2)} s after card ${k} (min 1.2 s) - re-anchor the cards`);
    if (ts.length < 2 || ts.length > 3) warnings.push(`why act ${i}: ${ts.length} cards (rule: 2-3)`);
    const sh = shots.find((s) => s.act === i);
    if (sh && ts.length && sh.b - ts[ts.length - 1] < 1.2) warnings.push(`why act ${i}: last card only ${(sh.b - ts[ts.length - 1]).toFixed(2)} s visible`);
  });

  // recap resolved (board state + camera)
  const recap = recapX ? (() => {
    const r = A[recapI];
    const doneArr = ep.plan.done ?? Array.from({ length: ep.plan.current }, (_, k) => k);
    return { i: recapI, a: r.a, today: r.today.at, todayStep: r.today.step ?? ep.plan.current, last: r.last ? r.last.at : 1e9, lastStep: r.last ? (r.last.step ?? Math.max(...doneArr, 0)) : -1, lastLabel: r.last?.label as string | undefined };
  })() : undefined;

  const words2 = words.map((x) => ({ w: x.w.replace(/[„“"]/g, ""), s: x.s, e: x.e }));
  const story = ep.story ? resolveStory(ep.story, at) : undefined;
  const tl = { story, hookResult, ep, at, END, H, HK, C, shots, acts, A, actAt, wall, plan, hops, captions: words2, win, hub, recap, warnings, tag: ep.tag, folge: ep.folge ?? ep.tag, day: ep.serientag ?? ep.tag, firstOfDay: ep.ersteFolgeDesTages !== false, umsatz, umsatzAt };
  return tl;
};
export type TL = ReturnType<typeof buildTimeline>;

// resolve all anchors of an act to numbers (keeps the shape, adds `a` = act start)
export type ResolvedAct = Record<string, any> & { a: number; type: Act["type"] };
const resolveAct = (x: Act, a: number, at: (v: Anchor) => number): ResolvedAct => {
  const T = (v: Anchor | undefined, fb: number) => (v === undefined ? fb : at(v));
  switch (x.type) {
    case "wall":
      return { ...x, a, thinkUntil: T(x.thinkUntil, a + 1.5), tie: x.tie ? { ...x.tie, at: at(x.tie.at) } : undefined };
    case "chain": {
      const st = x.stations.map((s: Station, k: number) => ({ ...s, at: T(s.at, a + 0.05 + k * 1.2), labelAt: T(s.labelAt, T(s.at, a + 0.05 + k * 1.2) + 0.3), arrowAt: T(s.arrowAt, T(s.at, a + k * 1.2) - 0.2) }));
      return {
        ...x, a, stations: st,
        badge: x.badge ? { ...x.badge, at: at(x.badge.at), pulse: T(x.badge.pulse, at(x.badge.at) + 0.25) } : undefined,
        item: x.item ? { ...x.item, at: at(x.item.at), fly: at(x.item.fly) } : undefined,
        back: x.back ? { ...x.back, at: at(x.back.at), go: at(x.back.go), arrive: at(x.back.arrive) } : undefined,
        lid: T(x.lid, st[2].at + 0.3),
      };
    }
    case "winner":
      return { ...x, a, fly: T(x.fly, a + 0.4), stampAt: T(x.stampAt, T(x.fly, a + 0.4) + 0.07), dimAt: T(x.dimAt, a + 0.3) };
    case "question":
      return { ...x, a, pop: T(x.pop, a + 0.1), stampAt: T(x.stampAt, a + 1.0), bubble: T(x.bubble, a + 0.3), objects: (x.objects ?? []).map((o) => ({ ...o, at: at(o.at) })) };
    case "table":
      return { ...x, a, pop: T(x.pop, a + 0.1), rowAt: (x.rowAt ?? []).map((v) => at(v)), hl: x.hl ? { ...x.hl, at: at(x.hl.at) } : undefined, stampAt: T(x.stampAt, a + 1.2) };
    case "mock":
      return { ...x, a, pop: T(x.pop, a + 0.1), stampAt: T(x.stampAt, a + 1.2) };
    case "claudeShot":
      return { ...x, a, marks: (x.marks ?? []).map((m) => ({ ...m, at: at(m.at) })), cam: (x.cam ?? []).map(([k, s, cx, cy]) => [at(k), s, cx, cy] as [number, number, number, number]) };
    case "result":
      return { ...x, a };
    case "hub":
      return { ...x, a, done: T(x.done, a + 0.15), next: T(x.next, a + 0.6) };
    case "recap":
      return {
        ...x, a,
        product: { ...x.product, at: at(x.product.at) },
        banner: x.banner ? { ...x.banner, at: at(x.banner.at) } : undefined,
        last: x.last ? { ...x.last, at: at(x.last.at), obj: x.last.obj ? { ...x.last.obj, at: at(x.last.obj.at) } : undefined } : undefined,
        today: { ...x.today, at: at(x.today.at) },
      };
    case "why":
      return { ...x, a, pillAt: T(x.pillAt, a + 0.1), chip: x.chip ? { ...x.chip, at: at(x.chip.at) } : undefined, cards: x.cards.map((k) => ({ ...k, at: at(k.at), vs: k.vs ? { ...k.vs, at: at(k.vs.at) } : undefined })) };
    case "end":
      return {
        ...x, a,
        keywordAt: at(x.keywordAt), plane: [at(x.plane[0]), at(x.plane[1])], itemsAt: at(x.itemsAt), copyAt: at(x.copyAt),
        result: x.result ? { ...x.result, at: at(x.result.at), line1At: at(x.result.line1At), parts: x.result.parts.map((p) => ({ ...p, at: at(p.at) })) } : undefined,
        hopAt: T(x.hopAt, at(x.plane[1])),
      };
  }
};

const autoHops = (C: any, wall: any, A: ResolvedAct[], acts: Act[]): [number, number][] => {
  const out: [number, number][] = [];
  if (C.feature) out.push([C.feature.on, 0.18]);
  if (wall?.counter?.keys?.length) out.push([wall.counter.keys[wall.counter.keys.length - 1][0] + 0.05, 0.35]);
  A.forEach((r, i) => {
    if (acts[i].type === "winner") out.push([r.fly - 0.03, 0.75]);
    if (acts[i].type === "hub") out.push([r.next, 0.25]);
    if (acts[i].type === "end") { out.push([r.plane[1], 0.3]); if (r.result) out.push([r.result.line1At, 0.3]); }
    if (acts[i].type === "chain" && r.badge) out.push([r.badge.at + 0.1, 0.25]);
  });
  return out;
};

export const shotAt = (tl: TL, t: number) => {
  let i = 0;
  for (let k = 0; k < tl.shots.length; k++) if (t >= tl.shots[k].a) i = k;
  const s = tl.shots[i];
  return { ...s, i, u: t - s.a, len: s.b - s.a };
};

// ---------------------------------------------------------------------------------------------
// SFX events (light, one per visual event) — used by scripts/firma-mix.mjs
// ---------------------------------------------------------------------------------------------
const F = {
  uiPop: "public/sirtoken/sfx-ui-pop.mp3", bump: "public/sirtoken/sfx-bump.mp3", click: "public/sirtoken/sfx-click.mp3", chime: "public/sirtoken/sfx-chime.mp3",
  whoosh: "public/sirtoken/sfx-whoosh-quick.mp3", check: "public/sirtoken/sfx-check.mp3", typing: "public/sirtoken/sfx-typing.mp3", stamp: "public/sirtoken/sfx-stamp.mp3",
  powerup: "public/sirtoken/sfx-powerup.mp3",
  clickLow: "sfx/heygen/variants/click-low.mp3", popHigh: "sfx/heygen/variants/pop-high.mp3", whooshHigh: "sfx/heygen/variants/whoosh-quick-high.mp3",
  clickHigh: "sfx/heygen/variants/click-high.mp3", tick: "sfx/heygen/variants/tick.mp3", popLow: "sfx/heygen/variants/pop-low.mp3", pingHigh: "sfx/heygen/variants/ping-high.mp3",
  whooshShort: "sfx/heygen/whoosh-short.mp3", whooshQuick: "sfx/heygen/whoosh-quick.mp3", airy: "sfx/heygen/whoosh-airy.mp3", synthPop: "sfx/heygen/synth-pop.mp3",
  chimeAsc: "sfx/heygen/chime-asc.mp3", clack: "sfx/heygen/extra/stamp-clack.mp3", roll: "sfx/heygen/extra/counter-roll.mp3", page: "sfx/heygen/extra/page-turn.mp3",
  ping: "sfx/ping.mp3",
};
export const SFX_FILES = F;

export const buildSfx = (tl: TL): SfxEvent[] => {
  const ev: SfxEvent[] = [];
  const e = (t: number, f: string, v = 0.3) => { if (t >= 0 && t < tl.END - 0.05) ev.push({ t: Math.round(t * 1000) / 1000, f, v }); };
  const HK = tl.HK;
  // hook
  e(0.03, F.uiPop, 0.3); e(HK.head, F.clickLow, 0.3); e(HK.firma, F.popHigh, 0.3);
  e(HK.drop0, F.whooshHigh, 0.22); e(HK.land, F.bump, 0.4); e(HK.chair, F.whooshShort, 0.25); e(HK.stamp, F.clack, 0.42);
  e(HK.h2 - 0.03, F.clickHigh, 0.2);
  for (let k = 0; k < 5; k++) { e(HK.cas + 0.08 + k * 0.17, F.tick, 0.2); e(HK.cas + 0.17 + k * 0.17, F.popHigh, 0.2); }
  e(HK.steps, F.clack, 0.2); e(HK.h3, F.clickHigh, 0.2); e(HK.lever, F.click, 0.45);
  e(HK.lamps[0], F.clickHigh, 0.35); e(HK.lamps[1], F.clickHigh, 0.35); e(HK.lamps[2], F.pingHigh, 0.22);
  if (tl.firstOfDay) { e(HK.slam, F.clack, 0.45); e(HK.one, F.popHigh, 0.35); e(HK.fly0, F.whooshHigh, 0.25); e(HK.fly1, F.tick, 0.3); }
  e(HK.tile, F.whooshQuick, 0.22); e(HK.rattle, F.clickLow, 0.22); e(HK.lid, F.popLow, 0.4); e(HK.dust, F.airy, 0.22); e(HK.q, F.uiPop, 0.3); e(HK.moth, F.popLow, 0.15);
  // claude
  const C = tl.C;
  e(C.at + 0.17, F.uiPop, 0.35); e(C.at + 0.45, F.whoosh, 0.22); e(C.logo + 0.2, F.chime, 0.25);
  C.steps.forEach((s, k) => { if (k === 0) { e(s.at - 0.04, F.whoosh, 0.22); e(s.at + 0.03, F.uiPop, 0.35); } else if (k === 1) e(s.at + 0.01, F.page, 0.3); else e(s.at + 0.01, F.uiPop, 0.35); });
  if (C.attach) { e(C.attach.at - 0.12, F.whooshQuick, 0.2); e(C.attach.at + 0.25, F.popLow, 0.35); }
  if (tl.hookResult && tl.hookResult.stamps) { e(tl.hookResult.fillAt + 0.05, F.popHigh, 0.25); tl.hookResult.stamps.forEach((s) => e(s.at, F.clack, 0.24)); (tl.hookResult.punch ?? []).forEach((a) => e(a - 0.04, F.whooshQuick, 0.18)); e(tl.hookResult.outAt, F.whooshHigh, 0.2); }
  else if (tl.hookResult && tl.hookResult.kind === "calcSheet") { e(tl.hookResult.outAt, F.whooshHigh, 0.2); } // beat sounds come from ep.sfx
  else if (tl.hookResult) { e(tl.hookResult.spinAt, F.whooshShort, 0.2); e(tl.hookResult.fillAt + 0.1, F.roll, 0.22); e(tl.hookResult.outAt, F.whooshHigh, 0.2); (tl.hookResult.wStamps ?? []).forEach((s) => e(s.at, F.clack, 0.24)); }
  if (C.feature) { e(C.feature.plus + 0.02, F.click, 0.4); e(C.feature.pick + 0.03, F.click, 0.4); e(C.feature.on + 0.01, F.check, 0.3); }
  const firstKey = C.typing.find(([, n]) => n > 0);
  if (firstKey) e(C.typing[Math.max(0, C.typing.indexOf(firstKey) - 1)][0], F.typing, 0.2);
  const markF = [F.popLow, F.popHigh, F.synthPop, F.tick, F.chime];
  C.marks.forEach((m, k) => e(m.at + 0.01, markF[k % markF.length], k >= 3 ? 0.25 : 0.35));
  e(C.send - 0.14, F.click, 0.35);
  // acts
  tl.acts.forEach((x, i) => {
    const r = tl.A[i];
    const cut = () => e(r.a - 0.03, F.whooshHigh, 0.22);
    switch (x.type) {
      case "wall": {
        const w = tl.wall;
        if (!w) break;
        if (w.counter) { e(w.counter.keys[0][0] + 0.35, F.roll, 0.3); e(w.counter.keys[w.counter.keys.length - 1][0] + 0.4, F.ping, 0.3); }
        w.hl.forEach((h) => e(h.at, F.popHigh, 0.3));
        if (r.tie) { e(r.tie.at - 0.04, F.whooshHigh, 0.2); e(r.tie.at + 0.12, F.tick, 0.25); }
        if (w.strike) w.strike.cards.forEach((_, k) => e(w.strike!.at + 0.16 + k * w.strike!.step, F.tick, 0.22));
        break;
      }
      case "chain": {
        cut();
        const st = r.stations;
        const objF = [F.uiPop, F.popLow, F.bump];
        st.forEach((s: any, k: number) => {
          e(s.at, objF[k], 0.3); e(s.labelAt, F.clickLow, 0.25);
          if (k > 0) e(s.arrowAt, k === 1 ? F.whoosh : F.whooshHigh, 0.2);
        });
        if (r.item) e(r.item.at, F.synthPop, 0.28);
        if (r.badge) { e(r.badge.at, F.stamp, 0.3); e(r.badge.pulse, F.tick, 0.25); }
        if (st[2].obj === "parcel") e(r.lid - 0.08, F.clack, 0.25);
        if (r.back) e(r.back.go, F.airy, 0.25);
        break;
      }
      case "result":
        cut(); e(r.a + 0.12, F.popLow, 0.3);
        break;
      case "winner":
        cut(); e(r.fly - 0.03, F.whooshHigh, 0.25); e(r.stampAt + 0.21, F.stamp, 0.3); e(r.stampAt + 0.28, F.powerup, 0.3);
        break;
      case "question":
        cut(); e(r.pop, F.popLow, 0.35); if (r.stamp !== null) e(r.stampAt, F.stamp, 0.3); e(r.stampAt + 0.6, F.tick, 0.2);
        (r.objects ?? []).forEach((o: any, k: number) => e(o.at, k % 2 ? F.popLow : F.popHigh, 0.28));
        break;
      case "table":
        cut(); e(r.pop, F.popLow, 0.35); r.rowAt.forEach((t: number) => e(t, F.tick, 0.22)); if (r.hl) e(r.hl.at, F.popHigh, 0.3); if (r.stamp) e(r.stampAt, F.stamp, 0.3);
        break;
      case "mock":
        cut(); e(r.pop, F.popLow, 0.35); e(r.pop + 0.35, F.synthPop, 0.25); if (r.stamp) e(r.stampAt, F.stamp, 0.3);
        break;
      case "claudeShot":
        cut(); e(r.a + 0.15, F.page, 0.3); r.marks.forEach((m: any) => e(m.at, F.popHigh, 0.3));
        break;
      case "recap":
        e(r.a - 0.04, F.whooshHigh, 0.22); e(r.a + 0.1, F.clickLow, 0.25);
        e(r.product.at - 0.2, F.whooshQuick, 0.22); e(r.product.at, F.popHigh, 0.3);
        if (r.banner) e(r.banner.at, F.stamp, 0.25);
        if (r.last) { e(r.last.at, F.chimeAsc, 0.22); if (r.last.obj) e(r.last.obj.at, F.popLow, 0.3); }
        e(r.today.at - 0.12, F.airy, 0.25); e(r.today.at + 0.35, F.uiPop, 0.35);
        break;
      case "why":
        e(r.pillAt - 0.15, F.whoosh, 0.2); e(r.pillAt, F.uiPop, 0.35);
        r.cards.forEach((k: any, j: number) => { e(k.at - 0.08, j % 2 ? F.popHigh : F.popLow, 0.35); if (k.big) e(k.at + 0.15, F.tick, 0.2); if (k.vs) e(k.vs.at - 0.04, k.vs.bad ? F.bump : F.popHigh, 0.3); });
        if (r.chip) e(r.chip.at, F.tick, 0.2);
        break;
      case "hub":
        e(r.a - 0.06, F.whooshHigh, 0.2); e(r.done + 0.2, F.chimeAsc, 0.25); e(r.next + 0.05, F.uiPop, 0.3);
        break;
      case "end": {
        e(r.a + 0.15, F.uiPop, 0.4); e(r.keywordAt, F.typing, 0.22);
        const kw = tl.ep.keyword;
        e(r.keywordAt + 0.05 + kw.length / 14 + 0.25, F.check, 0.3);
        (r.items ?? []).forEach((_: any, k: number) => e(r.itemsAt + k * 0.22 + 0.05, F.uiPop, 0.3));
        if (r.result) { e(r.result.line1At, F.popHigh, 0.35); const last = r.result.parts[r.result.parts.length - 1]; if (last) e(Math.max(...r.result.parts.map((p: any) => p.at)), F.chime, 0.3); }
        e(tl.END - 0.75, F.uiPop, 0.3);
        break;
      }
    }
  });
  if (tl.umsatz) {
    if (tl.umsatz.start > 0) { e(tl.umsatz.popAt, F.popHigh, 0.3); e(tl.umsatz.popAt + 0.2, F.roll, 0.22); }
    tl.umsatz.gains.forEach((g) => { e(g.at, F.popHigh, 0.32); e(g.at + 0.15, F.roll, 0.25); e(g.at + 1.1, F.chime, 0.3); });
  }
  (tl.ep.sfx ?? []).forEach((s) => e(tl.at(s.t), s.f, s.v ?? 0.3));
  return ev.sort((a, b) => a.t - b.t);
};

// music level curve (same character as Tag 1 mix-v9): quiet under voice, small lift in the search act,
// short dip right before the winner stamp, fade out at the end. Returns [t, level] breakpoints; volume=0.5 is applied after.
export const musicCurve = (tl: TL, gain = 1): [number, number][] => {
  const pts: [number, number][] = [[0, 0.16]];
  const C = tl.C;
  pts.push([Math.max(1, C.steps[0]?.at ?? C.at + 1.5), 0.2]);
  const firstAct = tl.A[0];
  if (firstAct) pts.push([firstAct.a + 2.2, 0.28]);
  tl.acts.forEach((x, i) => {
    const r = tl.A[i];
    if (x.type === "chain") pts.push([r.a, 0.2]);
    if (x.type === "winner") { pts.push([r.fly - 0.38, 0.2]); pts.push([r.fly - 0.28, 0.03]); pts.push([r.fly - 0.03, 0.3]); pts.push([r.fly + 1.97, 0.2]); }
    if (x.type === "end") pts.push([r.a + 0.2, 0.22]);
  });
  pts.push([tl.END - 0.7, 0.22]);
  pts.push([tl.END, 0]);
  const out: [number, number][] = [];
  pts.sort((a, b) => a[0] - b[0]).forEach((p) => { if (!out.length || p[0] > out[out.length - 1][0] + 0.02) out.push([Math.round(p[0] * 100) / 100, Math.round(p[1] * gain * 10000) / 10000]); });
  // optional local dips (audio.dips [[from, to, factor]]), e.g. to hide a sung word in the music bed; default none
  const dips = tl.ep.audio?.dips ?? [];
  if (!dips.length) return out;
  const vAt = (t: number) => { let i = 0; while (i + 1 < out.length && out[i + 1][0] <= t) i++; const [t0, v0] = out[i], [t1, v1] = out[Math.min(i + 1, out.length - 1)]; return t1 > t0 ? v0 + (v1 - v0) * Math.max(0, Math.min(1, (t - t0) / (t1 - t0))) : v0; };
  let res = out.slice();
  for (const [a0, b0, k] of dips) {
    const a = tl.at(a0), b = tl.at(b0);
    const add: [number, number][] = [[a - 0.08, vAt(a - 0.08)], [a, vAt(a) * k], [b, vAt(b) * k], [b + 0.08, vAt(b + 0.08)]];
    res = res.filter((p) => p[0] < a - 0.1 || p[0] > b + 0.1).concat(add.map(([t, v]) => [Math.round(t * 100) / 100, Math.round(v * 10000) / 10000] as [number, number]));
    res.sort((x, y) => x[0] - y[0]);
  }
  return res;
};
