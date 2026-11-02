// "Superkind baut eine Firma" — series engine. One composition for every episode: everything comes from
// public/firma-ep/tag<N>/episode.json (+ words.json). Look, light, camera, labels = Tag 1 v7 (FirmaShirtsTag1V7.tsx).
// New episode = episode.json + voice + words, no new code. Missing building block → src/components/firma/.
// Schema: ~/.claude/skills/firma-design/references/episode-schema.md
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, staticFile, useCurrentFrame, CalculateMetadataFunction } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFontsReady } from "../components/Voxel3D";
import { PillCaptions, THEMES, pixelFont } from "../components/PixelKit";
import { V3, cl, ease, inOut, bump, useDyn, useImage } from "../components/ShirtWorld3D";
import { PostFX, EnvLight, CameraRig2 } from "../components/FirmaFX3D";
import type { Episode, RawWord } from "../components/firma/schema";
import { buildTimeline, shotAt, TL, ShotKind } from "../components/firma/timeline";
import { drawPlan, drawCounter, drawSlot, drawTable, drawMock, PlanS, NAVY, planTileRect, PLAN_TEX } from "../components/firma/draw";
import { useBaseTex, BaseTex, Room, Bot } from "../components/firma/world3d";
import { useEpTex, EpTex } from "../components/firma/textures";
import { poseAt } from "../components/firma/poses";
import { HubSet, HookBoxSet, WallSet, ChainSet, CardSet, ClaudeBackdrop, slotState, isHookKind, lampOn, BotHereT, XA, XB, XC, XD, XE, XH } from "../components/firma/sets";
import { HUD, HookOverlay, ClaudePaper, ClaudeShot, ReHook, EndCard, shakeAt, RecapOverlay, WhyCards, WasherHook } from "../components/firma/overlays";
import { PriceTagsHook, RecapObj, TieBanner, QuestionObjects } from "../components/firma/extras";
import { StoryCard } from "../components/firma/story";
import { NameCheckLayer } from "../components/firma/namecheck";
import { CalcSheetHook, ResultSheet, Overlays2D } from "../components/firma/objects";

const W = 1080, H = 1920, FPS = 30;
export type FirmaEpisodeProps = { tag?: number; episode?: Episode | null; words?: RawWord[] | null; cover?: boolean };

export const calculateFirmaEpisodeMetadata: CalculateMetadataFunction<FirmaEpisodeProps> = async ({ props }) => {
  let episode = props.episode ?? null, words = props.words ?? null;
  const dir = `firma-ep/tag${props.tag ?? 1}`;
  if (!episode) episode = await (await fetch(staticFile(`${dir}/episode.json`))).json();
  if (!words) words = await (await fetch(staticFile(`${dir}/${episode!.audio?.words ?? "words.json"}`))).json();
  const tl = buildTimeline(episode!, words!); // throws early on bad anchors
  return { durationInFrames: Math.round(tl.END * FPS), props: { ...props, episode, words } };
};

// ---------- cameras per shot kind (= v7 CAMS) ----------
type CamDef = { pos: V3; look: V3; fov: number; focus: V3; push?: number };
const CAMS: Record<ShotKind, CamDef> = {
  h1: { pos: [XA, 5.2, 12.5], look: [XA, 5.0, -4.6], fov: 58, focus: [XA, 1.2, 2.5], push: 0.03 },
  h2: { pos: [XA, 4.35, 6.9], look: [XA, 4.35, -4.6], fov: 58, focus: [XA, 4.35, -4.6], push: 0.03 },
  h3: { pos: [XA + 1.0, 4.4, 11.4], look: [XA + 0.2, 4.6, -4.6], fov: 58, focus: [XA, 1.2, 2.5], push: 0.03 },
  h4: { pos: [XH, 2.9, 9.2], look: [XH, 1.5, -1], fov: 50, focus: [XH, 0.8, 0], push: 0.04 },
  claude: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  claudeShot: { pos: [XB, 3.0, 9.0], look: [XB, 3.0, -4], fov: 58, focus: [XB + 1.2, 1.2, 3.6], push: 0.03 },
  wall: { pos: [XC, 3.9, 8.6], look: [XC, 4.7, -4.8], fov: 58, focus: [XC, 4, -4.4], push: 0.06 },
  winner: { pos: [XC + 0.3, 3.8, 8.2], look: [XC, 4.6, -4.8], fov: 58, focus: [XC, 4, -4.4], push: 0.07 },
  chain: { pos: [XD, 7.2, 5.6], look: [XD, 0.9, -1.4], fov: 58, focus: [XD, 1.2, -1.0], push: 0.03 },
  question: { pos: [XC, 3.9, 7.0], look: [XC, 4.3, -3], fov: 58, focus: [XC, 4.4, -2.2], push: 0.04 },
  result: { pos: [XC, 3.9, 7.0], look: [XC, 4.3, -3], fov: 58, focus: [XC, 4.4, -2.2], push: 0.04 },
  table: { pos: [XE + 0.3, 4.1, 8.2], look: [XE, 4.4, -4.6], fov: 58, focus: [XE, 4.5, -3.6], push: 0.05 },
  mock: { pos: [XE + 0.3, 4.1, 8.2], look: [XE, 4.4, -4.6], fov: 58, focus: [XE, 4.5, -3.6], push: 0.05 },
  hub: { pos: [XA + 0.2, 3.9, 8.4], look: [XA, 4.25, -4.6], fov: 58, focus: [XA, 4.3, -4.6], push: 0.05 },
  // recap: whole plan board in the upper half (y ≈ 230–1010 px), room for the product card below it; see recapCam
  recap: { pos: [XA, 2.75, 7.15], look: [XA, 2.2, -4.6], fov: 58, focus: [XA, 4.35, -4.5], push: 0.02 },
  // why: same framing as winner (the flown card sits in the upper third), reason cards are 2D below it
  why: { pos: [XC + 0.3, 1.75, 8.2], look: [XC, 2.5, -4.8], fov: 58, focus: [XC, 4.3, -1.6], push: 0.03 },
  end: { pos: [XA, 3.0, 8.4], look: [XA, 3.6, -3], fov: 58, focus: [XA, 1.4, 1.2], push: 0.04 },
};
// world position of a plan tile (board plate at [XA, 4.35, -4.62], 6.9 × 5.25, front face z ≈ -4.46)
export const BOARD = { x: XA, y: 4.35, z: -4.46, w: 6.9, h: 5.25 };
export const tileWorld = (gi: number): V3 => {
  const r = planTileRect(gi % 9);
  return [BOARD.x + ((r.x + r.w / 2) / PLAN_TEX.w - 0.5) * BOARD.w, BOARD.y + (0.5 - (r.y + r.h / 2) / PLAN_TEX.h) * BOARD.h, BOARD.z];
};
const mix3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const camAt = (tl: TL, t: number) => {
  const s = shotAt(tl, t);
  const c = CAMS[s.kind];
  if (s.kind === "recap" && tl.recap) {
    // phase 1: full board, slow push; phase 2 (on "Heute"): flight to today's tile (tile ≈ 55 % of the frame width, upper half)
    const R = tl.recap;
    const settle = 0.05 * (1 - ease(s.u / 0.45));
    const k1 = 1 + settle - 0.025 * inOut(cl((t - s.a) / Math.max(0.5, R.today - s.a)));
    const pos1: V3 = [c.look[0] + (c.pos[0] - c.look[0]) * k1, c.look[1] + (c.pos[1] - c.look[1]) * k1 + 0.02 * Math.sin(t * 0.8), c.look[2] + (c.pos[2] - c.look[2]) * k1];
    const tw = tileWorld(R.todayStep);
    // push-in + tilt toward today's row; the board stays whole in width (no label cut), today's tile pops out (drawPlan todayK)
    const dz = 10.9 - 0.2 * inOut(cl((t - R.today - 0.7) / 1.5));
    const look2: V3 = [XA, c.look[1] + 0.35 * (tw[1] - BOARD.y), -4.6];
    const pos2: V3 = [XA, c.pos[1] + 0.35 * (tw[1] - BOARD.y), -4.6 + dz];
    const f = inOut(cl((t - R.today + 0.05) / 0.7));
    const pos = mix3(pos1, pos2, f), look = mix3(c.look, look2, f);
    const focusP = mix3(c.focus, tw, f);
    return { pos, look, fov: c.fov, focus: Math.hypot(pos[0] - focusP[0], pos[1] - focusP[1], pos[2] - focusP[2]), shot: s };
  }
  if (s.kind === "why") {
    // continuous move from the winner framing up to the why framing (card in the upper third, room for the reason cards)
    const prev = tl.shots[s.i - 1];
    const from = prev && prev.kind === "winner" ? CAMS.winner : c;
    const f = inOut(cl(s.u / 0.32)); // done before the head pill lands (pill pops at pillAt ≈ act start + 0.1)
    const push = 1 - 0.03 * inOut(cl((s.u - 0.32) / Math.max(0.5, s.len - 0.32)));
    const look = mix3(from.look, c.look, f), p0 = mix3(from.pos, c.pos, f);
    const pos: V3 = [look[0] + (p0[0] - look[0]) * push, look[1] + (p0[1] - look[1]) * push + 0.03 * Math.sin(t * 0.8), look[2] + (p0[2] - look[2]) * push];
    const fo = mix3(from.focus, c.focus, f);
    return { pos, look, fov: c.fov, focus: Math.hypot(pos[0] - fo[0], pos[1] - fo[1], pos[2] - fo[2]), shot: s };
  }
  const settle = (isHookKind(s.kind) ? 0.035 : 0.08) * (1 - ease(s.u / 0.45));
  const push = (c.push ?? 0.05) * inOut(s.u / Math.max(0.5, s.len));
  const k = 1 + settle - push;
  const pos: V3 = [c.look[0] + (c.pos[0] - c.look[0]) * k, c.look[1] + (c.pos[1] - c.look[1]) * k + 0.03 * Math.sin(t * 0.8), c.look[2] + (c.pos[2] - c.look[2]) * k];
  const d = Math.hypot(pos[0] - c.focus[0], pos[1] - c.focus[1], pos[2] - c.focus[2]);
  return { pos, look: c.look, fov: c.fov, focus: d, shot: s };
};

const planState = (tl: TL, t: number, hk: number): PlanS => {
  const HK = tl.HK, P = tl.plan, C = tl.C;
  const tagMark = tl.firstOfDay ? HK.tagNum : HK.tile;
  return {
    cur: 0.6 + 0.4 * Math.max(bump(t, tagMark + 0.1, 0.5), t > tagMark ? 1 : 0),
    done: cl((t - P.boardDone) / 0.4),
    next: ease((t - P.next) / 0.3),
    pulse: bump(t, tagMark + 0.1, 0.35) + bump(t, HK.kein + 0.15, 0.35) + bump(t, HK.missing + 0.1, 0.3),
    cas: t >= C.at ? 99 : hk - HK.cas,
    steps: t >= C.at ? 1 : cl((hk - HK.steps) / 0.22),
    head: t >= C.at || hk >= HK.head + 0.14 ? 1 : hk < HK.head ? 0.3 : Math.sin(hk * 140) > 0 ? 1 : 0.4,
    ...(tl.recap ? {
      lastI: tl.recap.lastStep, lastK: bump(t, tl.recap.last + 0.05, 1.0), lastOn: t >= tl.recap.last + 0.12 ? 1 : 0,
      todayI: tl.recap.todayStep, todayK: t >= tl.recap.today ? Math.min(1, ease((t - tl.recap.today) / 0.3)) * (t < C.at ? 1 : 0) : 0,
    } : {}),
  };
};
const counterValue = (tl: TL, t: number) => {
  const c = tl.wall?.counter;
  if (!c) return 0;
  let v = 0;
  for (const [a, val, d] of c.keys) if (t >= a) v = v + (val - v) * ease((t - a) / d);
  return Math.max(0, v);
};
// the one card texture in use: current table/mock act, else a standalone winner card
const drawCurrentCard = (tl: TL, t: number, c: CanvasRenderingContext2D, w: number, h: number) => {
  const s = shotAt(tl, t);
  const i = s.act ?? tl.acts.findIndex((x) => x.type === "table" || x.type === "mock");
  const x = i !== undefined && i >= 0 ? tl.acts[i] : undefined;
  if (x?.type === "table") {
    const r = tl.A[i!];
    const rows = x.rows.map((_, k) => ease((t - (r.rowAt[k] ?? r.pop + 0.4 + k * 0.25)) / 0.3));
    drawTable(c, w, h, { title: x.title, cols: x.cols, rows: x.rows, hlRow: x.hl?.row }, { rows, hl: r.hl ? ease((t - r.hl.at) / 0.25) : 0, t });
  } else if (x?.type === "mock") {
    const r = tl.A[i!];
    drawMock(c, w, h, x, t, Math.max(0.001, Math.min(1.1, ease((t - (r.pop + 0.3)) / 0.4))));
  } else if (x?.type === "why" && (x.card === undefined || !tl.wall)) {
    // standalone why object (not from the wall): one big card with label + icon
    c.clearRect(0, 0, w, h);
    c.save(); c.scale(w / 600, h / 460);
    drawSlot(c, 600, 460, { label: x.label ?? "", icon: x.icon ?? "box" }, { fill: 1, cross: 0, keep: 1, dim: 0, hl: 1 }, t);
    c.restore();
  } else if (tl.win) {
    const r = tl.A[tl.win.i];
    if (r.card === undefined || !tl.wall) {
      c.clearRect(0, 0, w, h);
      c.save(); c.scale(w / 600, h / 460);
      drawSlot(c, 600, 460, { label: r.label ?? "", icon: r.icon ?? "box" }, { fill: 1, cross: 0, keep: 1, dim: 0, hl: 1 }, t);
      c.restore();
    }
  }
};

type Dyn = { plan: THREE.Texture; counter: THREE.Texture; slots: THREE.Texture[]; card: THREE.Texture };
const World: React.FC<{ tl: TL; t: number; hk: number; tex: BaseTex; ept: EpTex; dyn: Dyn; cam: ReturnType<typeof camAt> }> = ({ tl, t, hk, tex, ept, dyn, cam }) => {
  const kind = cam.shot.kind, act = cam.shot.act;
  const pose = poseAt(tl, t, kind, act, hk);
  const inHook = isHookKind(kind) && t < tl.HK.end;
  const lon = (k: number) => (inHook ? lampOn(tl, hk, k) : 1);
  const lit = inHook ? 0.4 + 0.6 * Math.min(1, (lon(0) + lon(1) + lon(2)) / 3) : 1;
  const light = React.useMemo(() => new THREE.Object3D(), []);
  light.position.set(cam.look[0], 0, cam.look[2] + 1);
  light.updateMatrixWorld();
  const BotHere: BotHereT = ({ p, s, yaw = 0, hold }) => (
    <Bot p={p} t={t} s={s} yaw={yaw + pose.yaw} eyes={pose.eyes} armL={pose.armL} armR={pose.armR} hop={pose.hop} squash={pose.squash} hold={hold} />
  );
  const isClaude = kind === "claude" || kind === "claudeShot";
  const sharp = kind === "chain" || kind === "question" || kind === "table" || kind === "mock" || kind === "recap" || kind === "why";
  return (
    <>
      <CameraRig2 pos={cam.pos} look={cam.look} fov={cam.fov} />
      <PostFX fx={{ focus: cam.focus, aperture: isClaude ? 0.55 : sharp ? 0.1 : 0.32, maxBlur: 9, mb: [0, 0], zoom: 0, bloom: 0.3, bloomRadius: 0.55, bloomThreshold: 0.9, chroma: 0.004, grain: 0.022, vignette: 0.34, t }} />
      <EnvLight intensity={0.3} />
      <color attach="background" args={["#0B1020"]} />
      <fog attach="fog" args={["#0B1020", 18, 46]} />
      <ambientLight intensity={0.3 * (0.6 + 0.4 * lit)} color="#9FB4FF" />
      <hemisphereLight args={["#B8CCFF", "#4A2C1C", 0.6]} />
      <primitive object={light} />
      <directionalLight position={[cam.look[0] + 4, 12, cam.look[2] + 12]} target={light} intensity={1.5 * lit} color="#FFD9A8" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} />
      <directionalLight position={[cam.look[0] - 6, 6, cam.look[2] - 9]} target={light} intensity={1.1} color="#6FE3F0" />
      <Room tex={tex} />
      {(kind === "h1" || kind === "h2" || kind === "h3" || kind === "hub" || kind === "end" || kind === "recap") && <HubSet tl={tl} t={t} hk={hk} kind={kind} inHook={inHook} tex={tex} plan={dyn.plan} BotHere={BotHere} />}
      {kind === "h4" && <HookBoxSet tl={tl} t={t} hk={hk} tex={tex} BotHere={BotHere} />}
      {(kind === "wall" || kind === "winner" || kind === "question" || kind === "why" || kind === "result") && <WallSet tl={tl} t={t} kind={kind} act={act} tex={tex} ept={ept} slots={dyn.slots} counter={dyn.counter} card={dyn.card} BotHere={BotHere} />}
      {kind === "chain" && act !== undefined && <ChainSet tl={tl} t={t} act={act} tex={tex} ept={ept} pose={pose} />}
      {(kind === "table" || kind === "mock") && act !== undefined && <CardSet tl={tl} t={t} act={act} tex={tex} ept={ept} card={dyn.card} BotHere={BotHere} />}
      {isClaude && <ClaudeBackdrop t={t} tex={tex} BotHere={BotHere} />}
    </>
  );
};

const MAX_SLOTS = 9;
const EpisodeView: React.FC<{ tl: TL; cover: boolean }> = ({ tl, cover }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ready = useFontsReady(["800 70px Rubik", "900 70px Rubik", "700 70px Rubik", "600 40px Rubik", `800 40px ${pixelFont}`]);
  useImage(staticFile("logos/claude.svg"));
  const tex = useBaseTex(ready);
  const ept = useEpTex(tl, ready);
  const hk = cover ? tl.HK.slam - 0.08 : t;
  const ps = planState(tl, t, hk);
  const planCfg = { title: tl.plan.title, sub: tl.plan.sub, steps: tl.plan.steps, current: tl.plan.current, page: tl.plan.page, done: tl.plan.done, casD: tl.HK.casD, lastLabel: tl.recap?.lastLabel, wip: tl.plan.wip };
  const plan = useDyn(1600, 1220, (c) => ready && drawPlan(c, 1600, 1220, planCfg, ps, t));
  const cnt = tl.wall?.counter;
  const counter = useDyn(800, 400, (c) => ready && cnt && drawCounter(c, 800, 400, counterValue(tl, t), cnt.label, bump(t, cnt.pulse, 0.4), cnt.digits));
  const cards = tl.wall?.cards ?? [];
  const slots: THREE.Texture[] = [];
  for (let i = 0; i < MAX_SLOTS; i++) {
    // fixed hook count (9); unused slots draw nothing
    // eslint-disable-next-line react-hooks/rules-of-hooks
    slots.push(useDyn(600, 460, (c) => ready && i < cards.length && drawSlot(c, 600, 460, cards[i], slotState(tl, t, i), t)));
  }
  const card = useDyn(1400, 1100, (c) => ready && drawCurrentCard(tl, t, c, 1400, 1100));
  const cam = camAt(tl, t);
  const kind = cam.shot.kind;
  return (
    <AbsoluteFill style={{ background: "#0B1020" }}>
      <AbsoluteFill style={{ transform: shakeAt(tl, t, cover) }}>
        {tex && ept && (
          <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }}>
            <World tl={tl} t={t} hk={hk} tex={tex} ept={ept} dyn={{ plan, counter, slots, card }} cam={cam} />
          </ThreeCanvas>
        )}
        {kind === "claude" && <ClaudePaper tl={tl} t={t} u={cam.shot.u} />}
        {kind === "claudeShot" && cam.shot.act !== undefined && <ClaudeShot tl={tl} t={t} u={cam.shot.u} act={cam.shot.act} />}
        {(kind === "claude" || kind === "claudeShot") && !cover && <ReHook tl={tl} t={t} />}
        {tl.hookResult && isHookKind(kind) && t < tl.hookResult.outAt + 0.4 && (tl.hookResult.kind === "priceTags" ? <PriceTagsHook tl={tl} t={t} cover={cover} /> : tl.hookResult.kind === "calcSheet" ? <CalcSheetHook tl={tl} t={t} cover={cover} /> : <WasherHook tl={tl} t={t} cover={cover} />)}
        {tl.ep.nameCheck && <NameCheckLayer tl={tl} t={t} cover={cover} part="hook" />}
        {isHookKind(kind) && t < tl.HK.end && <HookOverlay tl={tl} t={t} kind={kind} cover={cover} />}
      </AbsoluteFill>
      {kind === "recap" && cam.shot.act !== undefined && <RecapOverlay tl={tl} t={t} act={cam.shot.act} cam={cam} cover={cover} />}
      {kind === "recap" && cam.shot.act !== undefined && <RecapObj tl={tl} t={t} act={cam.shot.act} />}
      {kind === "wall" && cam.shot.act !== undefined && <TieBanner tl={tl} t={t} act={cam.shot.act} />}
      {kind === "question" && cam.shot.act !== undefined && <QuestionObjects tl={tl} t={t} act={cam.shot.act} />}
      {kind === "result" && cam.shot.act !== undefined && <ResultSheet tl={tl} t={t} act={cam.shot.act} />}
      {tl.ep.overlays && <Overlays2D tl={tl} t={t} cover={cover} />}
      {kind === "why" && cam.shot.act !== undefined && !tl.A[cam.shot.act].bare && <WhyCards tl={tl} t={t} act={cam.shot.act} />}
      {kind === "end" && cam.shot.act !== undefined && <EndCard tl={tl} t={t} act={cam.shot.act} />}
      {tl.ep.nameCheck && <NameCheckLayer tl={tl} t={t} cover={cover} part="rest" />}
      {tl.story && <StoryCard S={tl.story} t={t} cover={cover} />}
      <HUD tl={tl} t={t} cover={cover} />
      {!cover && <PillCaptions words={tl.captions} theme={THEMES.night} y={kind === "why" && cam.shot.act !== undefined && t > tl.A[cam.shot.act].pillAt - 0.2 ? 1660 : 1400} />}
    </AbsoluteFill>
  );
};

export const FirmaEpisode: React.FC<FirmaEpisodeProps> = ({ episode, words, cover = false }) => {
  const tl = React.useMemo(() => (episode && words ? buildTimeline(episode, words) : null), [episode, words]);
  if (!tl) return <AbsoluteFill style={{ background: NAVY }} />;
  return <EpisodeView tl={tl} cover={cover} />;
};
