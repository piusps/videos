// Firma series engine — the sets in the one room (fixed X locations as in Tag 1 v7). Each set reads the resolved timeline.
import React from "react";
import * as THREE from "three";
import { SKC, V3, cl, ease, inOut, back, bump, rnd } from "../ShirtWorld3D";
import { Plate3D, Burst, Motes } from "../FirmaFX3D";
import { GOLD, CYAN, GREEN, SlotS } from "./draw";
import { Lamp, GlowRing, Bot, Chair, Lever, CardBox, Moth, Arrow3D, pathLen, pathAt, CatalogObj, ShirtUp, pop, BaseTex } from "./world3d";
import type { TL, ShotKind } from "./timeline";
import type { Pose } from "./poses";
import type { EpTex } from "./textures";

export const XA = 0, XC = -18, XD = 18, XB = 36, XH = 8, XE = 54;
export const HOOK_BOT: V3 = [-0.2, 0, 2.0];
export type BotHereT = React.FC<{ p: V3; s: number; yaw?: number; hold?: React.ReactNode }>;
export const isHookKind = (k: ShotKind) => k === "h1" || k === "h2" || k === "h3" || k === "h4";

export const lampOn = (tl: TL, hk: number, k: number) => {
  const a = tl.HK.lamps[k];
  if (hk < a) return 0;
  const u = hk - a;
  return u < 0.05 ? 0.5 : 1 + 0.6 * Math.exp(-u * 9);
};

const Shelves: React.FC<{ x0: number; xs: number[]; z: number; w?: number }> = ({ x0, xs, z, w = 1.8 }) => (
  <>
    {xs.map((x, k) => (
      <group key={x} position={[x0 + x, 0, z]}>
        <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[w, 2.8, 1.0]} /><meshStandardMaterial color="#2A1C14" roughness={0.7} /></mesh>
        {[0, 1, 2].map((j) => <mesh key={j} position={[(j - 1) * w * 0.28, 2.95 + (j % 2) * 0.1, 0.1]} castShadow><boxGeometry args={[w * 0.233, 0.34 + j * 0.06, 0.5]} /><meshStandardMaterial color={["#C99A6B", SKC.OR, "#E8E2D6"][(j + k) % 3]} /></mesh>)}
      </group>
    ))}
  </>
);

// ---------- set A: plan board hub (hook h1-h3, hub, end) ----------
export const HubSet: React.FC<{ tl: TL; t: number; hk: number; kind: ShotKind; inHook: boolean; tex: BaseTex; plan: THREE.Texture; BotHere: BotHereT }> = ({ tl, t, hk, kind, inHook, tex, plan, BotHere }) => {
  const HK = tl.HK;
  const recapBot = (tl.ep.acts.find((x) => x.type === "recap") as any)?.bot as { dx?: number; s?: number } | undefined;
  const botP: V3 = kind === "recap" ? [XA + (recapBot?.dx ?? 0.95), 0, 1.2] : [XA, 0, 0.8];
  const lon = (k: number) => (inHook ? lampOn(tl, hk, k) : 1);
  const hook = isHookKind(kind);
  return (
    <group>
      {!(hook && t < HK.planFrom) && <Plate3D w={6.9} h={5.25} d={0.22} r={0.4} tex={plan} body="#111A33" edge={GOLD} glow={0.9} p={[XA, 4.35, -4.62]} />}
      {!(hook && t < HK.planFrom) && [-3.9, 3.9].map((x) => <mesh key={x} position={[XA + x, 4.35, -4.7]}><boxGeometry args={[0.08, 5.6, 0.08]} /><meshBasicMaterial color={CYAN} toneMapped={false} /></mesh>)}
      <Lamp p={[XA - 3.6, 8.3, -1.0]} t={t} seed={1} on={lon(0)} />
      <Lamp p={[XA + 3.8, 8.0, 0.5]} t={t} seed={2} on={lon(1)} />
      <Lamp p={[XA + 0.2, 9.4, 3.2]} t={t} seed={3} i={14} on={lon(2)} />
      {!hook && <GlowRing p={botP} r={1.3} t={t} tex={tex.glow} />}
      {!hook && <BotHere p={botP} s={kind === "recap" ? recapBot?.s ?? 0.8 : 1.15} yaw={kind === "recap" ? -0.45 : 0} />}
      {(kind === "h1" || kind === "h3") && (
        <group>
          <GlowRing p={HOOK_BOT} r={1.4} t={t} tex={tex.glow} k={inHook ? cl((hk - HK.land) / 0.2) * 0.9 + 0.1 : 1} />
          {hk >= HK.drop0 && <BotHere p={HOOK_BOT} s={1.1} />}
          <Burst p={[HOOK_BOT[0], 0.12, HOOK_BOT[2] + 0.3]} t={hk} at={HK.land} n={30} speed={3.6} up={0.6} size={0.13} life={0.8} seed={71} colors={["#D9C3A0", "#B79B76", "#F2E6D0"]} />
          {hk < HK.chair + 0.55 && <Chair p={[HOOK_BOT[0] + 2.1 + 7 * cl((hk - HK.chair) / 0.55) ** 1.5, 0, HOOK_BOT[2] - 0.2]} rot={0.5 + 7 * cl((hk - HK.chair) / 0.55)} />}
          <Lever p={[HOOK_BOT[0] - 2.1, 0, HOOK_BOT[2] - 0.1]} a={-0.6 + 1.2 * back(cl((hk - HK.lever) / 0.18))} />
          <Burst p={[HOOK_BOT[0] - 2.1, 2.0, HOOK_BOT[2]]} t={hk} at={HK.lever + 0.12} n={14} speed={2.4} size={0.07} life={0.6} seed={73} colors={[GOLD, "#FFFFFF"]} />
        </group>
      )}
      <Shelves x0={XA} xs={[-5.6, 5.4]} z={-3.4} />
      <Burst p={[XA - 1.9, 6.0, -4.3]} t={t} at={tl.plan.boardDone + 0.1} n={22} speed={3} size={0.07} seed={51} colors={[GREEN, "#FFFFFF", GOLD]} />
      <Motes t={t} center={[XA, 4, 0]} size={[14, 8, 8]} n={70} seed={3} color="#FFE7C2" s={0.035} />
    </group>
  );
};

// ---------- set H: "heute fehlt X" (hook shot h4): empty box or a prop from the catalog ----------
export const HookBoxSet: React.FC<{ tl: TL; t: number; hk: number; tex: BaseTex; BotHere: BotHereT }> = ({ tl, t, hk, tex, BotHere }) => {
  const HK = tl.HK;
  const prop = tl.ep.hook.prop ?? "emptyBox";
  const P: V3 = [XH - 0.85, 0, 0.3];
  return (
    <group>
      <Lamp p={[XH + 0.3, 6.6, -0.6]} t={t} seed={4} i={22} />
      <GlowRing p={[XH + 1.0, 0, -0.3]} r={1.1} t={t} tex={tex.glow} />
      <BotHere p={[XH + 1.0, 0, -0.3]} s={0.95} yaw={-0.55} />
      {prop === "emptyBox"
        ? <CardBox p={P} hk={hk} rattleAt={HK.rattle} lidAt={HK.lid} />
        : <group position={P} scale={pop(hk, HK.lid - 0.05, 0.35)} rotation={[0, 0.35, hk > HK.rattle && hk < HK.lid ? 0.07 * Math.sin((hk - HK.rattle) * 46) : 0]}><CatalogObj kind={prop} p={[0, 0, 0]} t={t} tex={tex} running={false} lid={0} /></group>}
      <Burst p={[XH - 0.85, 1.0, 0.3]} t={hk} at={HK.dust} n={36} speed={1.5} up={2.3} size={0.17} life={1.2} seed={61} colors={["#8E877A", "#B9B09C", "#6E685C", "#D2C9B5"]} />
      {prop === "emptyBox" && <Moth p={[XH - 0.85, 1.0, 0.3]} hk={hk} at={HK.moth} />}
      <Shelves x0={XH} xs={[-3.2, 3.4]} z={-2.6} w={1.6} />
      <Motes t={t} center={[XH, 2, 0]} size={[8, 5, 5]} n={40} seed={5} color="#FFE7C2" s={0.03} />
    </group>
  );
};

// ---------- set C: candidate wall + counter (wall / winner / question shots) ----------
export const SLOT_W = 2.35, SLOT_H = 1.8;
export const slotPos = (i: number, n: number): { p: V3; s: number } => {
  if (n <= 6) return { p: [XC + ((i % 3) - 1) * 2.6, [5.15, 3.2][Math.floor(i / 3)], -4.62], s: 1 };
  return { p: [XC + ((i % 3) - 1) * 2.25, [5.85, 4.35, 2.85][Math.floor(i / 3)], -4.62], s: 0.78 };
};
export const slotState = (tl: TL, t: number, i: number): SlotS => {
  const w = tl.wall!;
  const fill = t >= w.fillAt(i) ? 1 : 0;
  const win = tl.win ? tl.A[tl.win.i] : undefined;
  const keepI = win && win.card !== undefined ? win.card : -1;
  const hlE = w.hl.find((h) => h.i === i), dimE = w.dim.find((d) => d.i === i);
  const dim = dimE ? ease((t - dimE.at) / 0.3) : 0;
  const hl = hlE ? ease((t - hlE.at) / 0.25) * (1 - (hlE.until < 1e8 ? ease((t - hlE.until) / 0.3) : 0)) : 0;
  const si = w.strike ? w.strike.cards.indexOf(i) : -1;
  const cross = si >= 0 ? cl((t - (w.strike!.at + si * w.strike!.step)) / 0.18) : 0;
  return { fill, cross, keep: i === keepI ? back((t - win!.fly) / 0.3) : 0, dim, hl };
};
export const WallSet: React.FC<{ tl: TL; t: number; kind: ShotKind; act?: number; tex: BaseTex; ept: EpTex; slots: THREE.Texture[]; counter: THREE.Texture; card: THREE.Texture; BotHere: BotHereT }> = ({ tl, t, kind: kind0, act, tex, ept, slots, counter, card, BotHere }) => {
  const isWhy = kind0 === "why";
  const whyR = isWhy && act !== undefined ? tl.A[act] : undefined;
  const whyStandalone = !!whyR && !whyR.bare && (whyR.card === undefined || !tl.wall);
  const isRes = kind0 === "result"; // result act (objects.tsx ResultSheet): same room, dark backdrop, no 3D card
  // optional per-act mascot placement for result / why / winner acts ({ dx, dz, s }); default unchanged
  const ob = (act !== undefined && (isRes || isWhy || kind0 === "winner") ? tl.A[act].bot : undefined) as { dx?: number; dz?: number; s?: number } | undefined;
  const kind: ShotKind = isWhy ? "winner" : kind0;
  const w = tl.wall;
  const win = tl.win ? tl.A[tl.win.i] : undefined;
  const winTex = tl.win ? ept.acts[tl.win.i] : undefined;
  const keepI = win && win.card !== undefined ? win.card : -1;
  const n = w ? w.cards.length : 0;
  const wallAct = tl.acts.findIndex((x) => x.type === "wall");
  const wallR = wallAct >= 0 ? tl.A[wallAct] : undefined;
  const q = kind === "question" && act !== undefined ? tl.A[act] : undefined;
  const qTex = act !== undefined ? ept.acts[act] : undefined;
  const botPos: V3 = q ? [XC + (q.bot?.dx ?? 2.0), 0, q.bot?.dz ?? 0.0] : ob ? [XC + (ob.dx ?? (isRes ? 2.0 : -1.2)), 0, ob.dz ?? (isRes ? 0 : -0.4)] : isRes ? [XC + 2.0, 0, 0] : [XC + (tl.ep.wall?.bot?.dx ?? -1.2), 0, tl.ep.wall?.bot?.dz ?? -0.4];
  const botShown = !!(q || isWhy || !tl.ep.wall?.bot?.whyOnly); // whyOnly hides mascot + its glow ring in wall/winner
  // optional ep.botHide windows (2026-10-29): mascot shrinks away inside [a, b] (default: none → unchanged)
  const botK = (tl.ep.botHide ?? []).reduce((m, [a, b]) => { const ta = tl.at(a), tb = tl.at(b); return t < ta || t >= tb ? m : Math.min(m, 1 - ease((t - ta) / 0.2)); }, 1);
  const fly = kind === "winner" && win && !whyStandalone ? inOut(cl((t - win.fly + 0.02) / 0.4)) : 0;
  return (
    <group>
      {w && <mesh position={[XC, 4.2, -4.82]} receiveShadow><boxGeometry args={[8.6, 4.6, 0.2]} /><meshStandardMaterial color="#202C50" roughness={0.8} /></mesh>}
      {w && <mesh position={[XC, 4.2, -4.9]}><boxGeometry args={[8.9, 4.9, 0.1]} /><meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} /></mesh>}
      {w && w.cards.map((_, i) => {
        const s = slotState(tl, t, i);
        const fillK = back((t - w.fillAt(i)) / 0.35);
        const { p, s: ss } = slotPos(i, n);
        const keepK = i === keepI ? s.keep : 0;
        const f = i === keepI ? fly : 0;
        const sc = (s.fill ? Math.max(0.001, Math.min(1.2, fillK)) * (1 + 0.1 * keepK) : 1) * (1 + 0.55 * f / ss) * ss;
        return (
          <group key={i}>
            <Plate3D w={SLOT_W} h={SLOT_H} d={s.fill ? 0.1 : 0.02} r={0.3} tex={slots[i]} body={s.fill ? "#FFFFFF" : "#1A2547"} edge={s.fill ? SKC.INK : "#1A2547"} glow={s.fill ? 0.3 : 0.8}
              p={[p[0] + (XC - p[0]) * f, p[1] + (4.3 - p[1]) * f, p[2] + 0.12 + 0.35 * keepK + 2.6 * f]} rot={[0, 0, (rnd(i + 3) - 0.5) * 0.08 + 0.02 * Math.sin(t * 1.5 + i)]} s={sc} />
            {s.fill > 0 && <Burst p={[p[0], p[1], p[2] + 0.4]} t={t} at={w.fillAt(i)} n={10} speed={2} size={0.08} seed={i + 20} colors={[CYAN, "#FFFFFF", GOLD]} />}
          </group>
        );
      })}
      {/* standalone winner card when the winner is not on the wall */}
      {whyStandalone && whyR && (
        <Plate3D w={SLOT_W} h={SLOT_H} d={0.1} r={0.3} tex={card} body="#FFFFFF" edge={SKC.INK} glow={0.3} p={[XC, 4.3, -2.0]} rot={[0, 0, 0.02 * Math.sin(t * 1.5)]} s={pop(t, whyR.a + 0.05, 0.4) * 1.55} />
      )}
      {!isWhy && kind === "winner" && win && keepI < 0 && !win.bare && (
        <Plate3D w={SLOT_W} h={SLOT_H} d={0.1} r={0.3} tex={card} body="#FFFFFF" edge={SKC.INK} glow={0.3} p={[XC, 4.3, -2.0]} rot={[0, 0, 0.02 * Math.sin(t * 1.5)]} s={pop(t, win.a + 0.05, 0.4) * 1.55} />
      )}
      {/* green check bar across the keeper (after the winner shot) */}
      {w && win && keepI >= 0 && kind !== "winner" && (() => {
        const k = ease((t - win.fly - 0.1) / 0.35);
        if (k <= 0.001) return null;
        const { p } = slotPos(keepI, n);
        return (
          <group position={[p[0], p[1] + SLOT_H / 2 + 0.32, p[2] + 0.6]}>
            <mesh scale={[k, 1, 1]}><boxGeometry args={[SLOT_W + 0.4, 0.09, 0.06]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
            <mesh scale={back((t - win.fly - 0.25) / 0.3)}><cylinderGeometry args={[0.3, 0.3, 0.08, 32]} /><meshBasicMaterial color={GREEN} toneMapped={false} /></mesh>
          </group>
        );
      })()}
      {w?.counter && kind === "wall" && (() => {
        const k = back((t - w.counter!.at) / 0.4);
        return <Plate3D w={3.2} h={1.6} d={0.2} r={0.24} tex={counter} body="#0E1428" edge={GOLD} glow={1.0} p={[XC + 1.9, 7.55 - (1 - Math.min(1, k)) * 3, -4.3]} rot={[0, 0, 0.03 * Math.sin(t * 1.2)]} s={Math.max(0.001, Math.min(1.1, k))} />;
      })()}
      {win && winTex?.stamp && kind !== "question" && !isWhy && !isRes && !win.bare && (() => {
        const k = back((t - win.stampAt) / 0.3);
        if (k <= 0.001) return null;
        return <Plate3D w={4.2} h={1.08} d={0.1} r={0.3} tex={winTex.stamp} glow={0} p={[XC, 7.45, -4.0]} rot={[0, 0, -0.05]} s={Math.max(0.001, 2.2 - 1.2 * Math.min(1, k))} />;
      })()}
      {win && <Burst p={[XC + 2.6, 2.4, -3.8]} t={t} at={win.fly + 0.08} n={44} speed={4.2} size={0.16} up={2.4} seed={61} life={1.6} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN, CYAN]} />}
      {win && <Burst p={[XC - 1.4, 3.0, 1.5]} t={t} at={win.fly + 0.12} n={30} speed={3.6} size={0.12} up={2.2} seed={62} life={1.5} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN]} />}
      <Lamp p={[XC - 2.4, 8.4, -1.2]} t={t} seed={4} />
      <Lamp p={[XC + 2.8, 8.1, -0.2]} t={t} seed={5} />
      {botShown && botK > 0.02 && <GlowRing p={q?.bot || ob || tl.ep.wall?.bot ? [botPos[0], 0, botPos[2]] : [XC - 1.2, 0, -0.4]} r={1.15} t={t} tex={tex.glow} />}
      {isRes && <mesh position={[XC, 4.3, -3.6]}><planeGeometry args={[12, 8]} /><meshBasicMaterial color="#05070F" transparent opacity={w ? 0.45 : 0.2} /></mesh>}
      {q && qTex && (
        <group>
          <mesh position={[XC, 4.3, -3.6]}><planeGeometry args={[12, 8]} /><meshBasicMaterial color="#05070F" transparent opacity={w ? 0.45 : 0.2} /></mesh>
          {q.card !== false && <Plate3D w={4.9} h={3.5} d={0.14} r={0.36} tex={qTex.qcard!} rough={1} glow={0} p={[XC - 0.3, 4.9 + 0.05 * Math.sin(t * 2), -2.4]} rot={[0, 0, 0.02]} s={pop(t, q.pop, 0.4)} />}
          {q.card !== false && qTex.qstamp && t > q.stampAt && <Plate3D w={4.0} h={0.8} d={0.08} r={0.3} tex={qTex.qstamp} glow={0} p={[XC - 0.2, 3.65, -2.05]} rot={[0, 0, -0.06]} s={2.2 - 1.2 * ease(cl((t - q.stampAt) / 0.16))} />}
        </group>
      )}
      {botShown && botK > 0.02 && <BotHere p={botPos} s={(q ? q.bot?.s ?? 1.05 : ob ? ob.s ?? 1.05 : tl.ep.wall?.bot?.s ?? 1.05) * botK} yaw={q || isRes ? -0.35 : 0.15} hold={
        q ? (
          <group position={[-1.0, 2.25, 0]} scale={back((t - q.bubble) / 0.35)}>
            <Plate3D w={0.9} h={0.7} d={0.08} r={0.3} tex={tex.bubbleQ} glow={0.9} rot={[0, 0, 0.12 + 0.05 * Math.sin(t * 4)]} />
          </group>
        ) : kind === "wall" && wallR && t < wallR.thinkUntil ? (
          <group position={[1.0, 2.25, 0]} scale={back((t - (wallR.a + 0.05)) / 0.35)}>
            <Plate3D w={0.9} h={0.7} d={0.08} r={0.3} tex={tex.bubbleQ} glow={0.9} rot={[0, 0, -0.12 + 0.05 * Math.sin(t * 4)]} />
          </group>
        ) : kind === "winner" && win && t > win.fly - 0.05 ? (
          (win.hold ?? "shirt") === "shirt"
            ? <ShirtUp p={[0, 2.25 + 0.12 * back((t - win.fly + 0.05) / 0.35), 0.35]} s={Math.max(0.001, back((t - win.fly + 0.05) / 0.35)) * 0.72} rot={[0, 0, 0.06 * Math.sin(t * 5)]} logo={tex.shirtLogo} />
            : <group position={[0, 1.6 + 0.12 * back((t - win.fly + 0.05) / 0.35), 0.35]} scale={Math.max(0.001, back((t - win.fly + 0.05) / 0.35)) * 0.62}><CatalogObj kind={win.hold} p={[0, 0, 0]} t={t} tex={tex} /></group>
        ) : undefined
      } />}
      <Motes t={t} center={[XC, 4, 0]} size={[14, 8, 8]} n={70} seed={5} color="#FFE7C2" s={0.035} />
    </group>
  );
};

// ---------- set E: 3-station explanation chain (≥4 s): station → label, running floor arrows, return arrow ----------
const S1: V3 = [XD - 1.1, 0, -4.0], S2: V3 = [XD + 1.15, 0, -1.6], S3: V3 = [XD - 1.0, 0, 0.5];
const A12: V3[] = [[S1[0] + 0.9, 0, S1[2] + 0.6], [S2[0] - 1.0, 0, S2[2] - 0.2]];
const A23: V3[] = [[S2[0] - 0.7, 0, S2[2] + 1.0], [S3[0] + 0.8, 0, S3[2] - 0.35]];
const A31: V3[] = [[S3[0] - 0.75, 0, S3[2] - 0.1], [XD - 2.2, 0, S3[2] - 0.9], [XD - 2.2, 0, S1[2] + 1.6], [S1[0] - 0.55, 0, S1[2] + 0.85]];
export const ChainSet: React.FC<{ tl: TL; t: number; act: number; tex: BaseTex; ept: EpTex; pose: Pose }> = ({ tl, t, act, tex, ept, pose }) => {
  const r = tl.A[act];
  const et = ept.acts[act];
  const st = r.stations as { obj: any; at: number; labelAt: number; arrowAt: number }[];
  const running = t > st[1].labelAt - 0.05;
  const item = r.item;
  const itemK = item ? cl((t - item.at) / 0.3) : 0;
  const flyK = item ? cl((t - item.fly) / 0.3) : 0;
  const lid = ease((t - r.lid) / 0.2);
  const L31 = pathLen(A31);
  const go = r.back ? inOut(cl((t - r.back.go) / (r.back.arrive - r.back.go))) : 0;
  const tilt: V3 = [-0.85, 0, 0];
  const arrive = r.back ? r.back.arrive : 1e9;
  const stationNode = (k: number) => {
    const s = st[k];
    if (t < s.at) return null;
    const P = [S1, S2, S3][k];
    if (k === 2 && go > 0 && (s.obj === "parcel" || s.obj === "box" || s.obj === "mail")) {
      const pp = pathAt(A31, L31 * go).p;
      return <CatalogObj kind={s.obj} p={pp} t={t} tex={tex} lid={lid} yaw={0.3} logo={et.logo} />;
    }
    const sc = pop(t, s.at, k === 2 ? 0.3 : 0.35) * (k === 2 ? 1 + 0.1 * bump(t, r.lid + 0.15, 0.25) : 1);
    const hop = k === 0 ? bump(t, arrive + 0.05, 0.3) * 0.25 : 0;
    return (
      <group scale={sc} position={P}>
        <CatalogObj kind={s.obj} p={[0, 0, 0]} t={t} tex={tex} lid={lid} running={running} hop={hop} logo={et.logo} />
      </group>
    );
  };
  const LP: V3[] = [[S1[0], 3.0, S1[2] - 0.2], [S2[0] + 0.05, 0.45, S2[2] + 1.65], [S3[0] - 0.05, 0.45, S3[2] + 1.85]];
  return (
    <group>
      {[0, 1, 2].map((k) => <React.Fragment key={k}>{stationNode(k)}</React.Fragment>)}
      {[0, 1, 2].map((k) => t >= st[k].labelAt && <Plate3D key={`l${k}`} w={2.5} h={0.82} d={0.08} r={0.3} tex={et.labels![k]} rough={1} glow={0} p={LP[k]} rot={tilt} s={pop(t, st[k].labelAt)} />)}
      <Arrow3D pts={A12} k={cl((t - st[1].arrowAt) / 0.4)} t={t} />
      <Arrow3D pts={A23} k={cl((t - st[2].arrowAt) / 0.35)} t={t} />
      {r.back && <Arrow3D pts={A31} k={cl((t - r.back.at) / 0.35)} t={t} col={GREEN} />}
      {r.badge && t >= r.badge.at && et.badge && <Plate3D w={1.15} h={1.25} d={0.12} r={0.25} tex={et.badge} rough={1} glow={0} p={[S2[0] + 0.1, 2.75 + 0.05 * Math.sin(t * 3), S2[2] - 0.3]} rot={[-0.5, 0, -0.05]} s={pop(t, r.badge.at, 0.3) * (1 + 0.12 * bump(t, r.badge.pulse, 0.3))} />}
      {item && itemK > 0 && flyK < 1 && (() => {
        const from: V3 = [S2[0] - 0.2, 0.75 + 0.45 * ease(itemK), S2[2] + 1.05];
        const to: V3 = [S3[0], 1.0, S3[2]];
        const f = ease(flyK);
        const pp: V3 = [from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f + 1.2 * f * (1 - f) * 4 * 0.5, from[2] + (to[2] - from[2]) * f];
        const sc = Math.max(0.001, back(itemK)) * (1 - 0.6 * f) * 0.62;
        return item.obj === "shirt"
          ? <group position={pp} scale={sc} rotation={[-0.3, -0.3 + 2 * f, 0.08 * Math.sin(t * 5)]}><ShirtUp p={[0, 0, 0]} s={1} logo={et.logo ?? tex.shirtLogo} /></group>
          : <group position={[pp[0], pp[1] - 0.4, pp[2]]} scale={sc} rotation={[0, -0.3 + 2 * f, 0]}><CatalogObj kind={item.obj} p={[0, 0, 0]} t={t} tex={tex} logo={et.logo} /></group>;
      })()}
      {r.badge && <Burst p={[S2[0] - 0.2, 1.3, S2[2] + 1.1]} t={t} at={r.badge.at + 0.05} n={18} speed={2.6} size={0.08} seed={41} colors={["#FFFFFF", GOLD, SKC.OR]} />}
      {r.back && <Burst p={[S1[0], 1.2, S1[2] + 0.8]} t={t} at={r.back.arrive} n={26} speed={3} size={0.1} seed={44} colors={[GREEN, "#FFFFFF", GOLD]} />}
      <Lamp p={[XD - 1.0, 8.6, -2.0]} t={t} seed={6} i={30} />
      <Lamp p={[XD + 2.2, 8.4, 1.6]} t={t} seed={7} i={18} />
      <Bot p={[XD + 2.25, 0, -0.9]} t={t} s={0.6} yaw={pose.yaw} eyes={pose.eyes} armL={pose.armL} armR={pose.armR} hop={pose.hop} squash={pose.squash} />
      <Motes t={t} center={[XD, 3, 0]} size={[10, 6, 10]} n={50} seed={7} color="#FFE7C2" s={0.03} />
    </group>
  );
};

// ---------- set F: one big card (table / mock-up) on an easel wall, stamp, mascot points at it ----------
export const CardSet: React.FC<{ tl: TL; t: number; act: number; tex: BaseTex; ept: EpTex; card: THREE.Texture; BotHere: BotHereT }> = ({ tl, t, act, tex, ept, card, BotHere }) => {
  const r = tl.A[act];
  const et = ept.acts[act];
  const k = pop(t, r.pop, 0.4);
  return (
    <group>
      <mesh position={[XE, 4.2, -4.82]} receiveShadow><boxGeometry args={[8.6, 6.4, 0.2]} /><meshStandardMaterial color="#202C50" roughness={0.8} /></mesh>
      <mesh position={[XE, 4.2, -4.9]}><boxGeometry args={[8.9, 6.7, 0.1]} /><meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.4} /></mesh>
      <Plate3D w={5.6} h={4.4} d={0.14} r={0.36} tex={card} rough={1} glow={0} p={[XE - 0.2, 4.55 + 0.04 * Math.sin(t * 2), -3.6]} rot={[0, 0, 0.015]} s={k} />
      {et.stamp && t > r.stampAt && <Plate3D w={4.2} h={1.08} d={0.1} r={0.3} tex={et.stamp} glow={0} p={[XE, 2.05, -2.9]} rot={[0, 0, -0.05]} s={Math.max(0.001, 2.2 - 1.2 * Math.min(1, back((t - r.stampAt) / 0.3)))} />}
      {et.stamp && <Burst p={[XE + 1.8, 2.4, -2.8]} t={t} at={r.stampAt + 0.05} n={34} speed={3.8} size={0.14} up={2.2} seed={63} life={1.4} colors={[SKC.OR, GOLD, "#FFFFFF", GREEN]} />}
      <Lamp p={[XE - 2.4, 8.4, -1.2]} t={t} seed={10} />
      <Lamp p={[XE + 2.8, 8.1, -0.2]} t={t} seed={11} i={20} />
      <GlowRing p={[XE + 2.4, 0, 0.6]} r={1.0} t={t} tex={tex.glow} />
      <BotHere p={[XE + 2.4, 0, 0.6]} s={0.95} yaw={-0.5} />
      <Motes t={t} center={[XE, 4, 0]} size={[14, 8, 8]} n={60} seed={11} color="#FFE7C2" s={0.035} />
    </group>
  );
};

// ---------- set B: wall behind the Claude paper window, mascot peeks in from the bottom ----------
export const ClaudeBackdrop: React.FC<{ t: number; tex: BaseTex; BotHere: BotHereT }> = ({ t, tex, BotHere }) => (
  <group>
    <Lamp p={[XB - 2.6, 7.6, 0.4]} t={t} seed={8} i={34} />
    <Lamp p={[XB + 2.8, 7.4, -1.8]} t={t} seed={9} i={20} />
    <mesh position={[XB, 0.95, 3.2]} castShadow receiveShadow><boxGeometry args={[9, 0.22, 2.2]} /><meshStandardMaterial color="#5A3A24" roughness={0.6} /></mesh>
    <mesh position={[XB, 1.07, 3.2]}><boxGeometry args={[9.04, 0.03, 2.24]} /><meshStandardMaterial color="#7A5034" roughness={0.5} /></mesh>
    <GlowRing p={[XB + 1.2, 1.08, 3.6]} r={0.9} t={t} tex={tex.glow} k={0.7} />
    <BotHere p={[XB + 1.2, 1.08, 3.6]} s={0.8} yaw={0} />
    <Motes t={t} center={[XB, 4, 0]} size={[12, 8, 8]} n={50} seed={9} color="#FFE7C2" s={0.03} />
  </group>
);
