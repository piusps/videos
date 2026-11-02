// Firma series engine — mascot expression + arms per shot (= Tag 1 v7 poseAt, driven by the resolved timeline)
import { ease } from "../ShirtWorld3D";
import { hopAt, Eyes } from "./world3d";
import type { TL, ShotKind } from "./timeline";

export type Pose = { eyes: Eyes; armL: number; armR: number; hop: number; squash: number; yaw: number };

export const poseAt = (tl: TL, t: number, kind: ShotKind, act: number | undefined, hk = t): Pose => {
  const HK = tl.HK, C = tl.C;
  const h = hopAt(t, tl.hops);
  const base: Pose = { eyes: { mode: "open" }, armL: 12 + 6 * Math.sin(t * 2), armR: 12 + 6 * Math.sin(t * 2 + 1), hop: h.y, squash: h.sq, yaw: 0 };
  const sway = 0.05 * Math.sin(t * 1.4);
  const r = act !== undefined ? tl.A[act] : undefined;
  switch (kind) {
    case "h1":
    case "h2":
    case "h3": {
      const tau = hk - HK.land;
      const fall = hk < HK.land ? 9 * (1 - ((hk - HK.drop0) / (HK.land - HK.drop0)) ** 2) : 0;
      const sq = hk < HK.land ? -1.1 : 2.6 * Math.exp(-7 * tau) * Math.cos(22 * tau);
      const b: Pose = { ...base, hop: Math.max(0, fall), squash: sq };
      if (hk >= HK.slam - 0.05) return { ...b, eyes: { mode: "wow", ly: 0.6 }, armL: 150, armR: 150, yaw: 0 };
      if (hk >= HK.lamps[0]) return { ...b, eyes: { mode: "happy" }, armL: 40, armR: 70 + 20 * Math.sin(t * 9), yaw: -0.15 + 0.1 * (hk - HK.lamps[0]) };
      if (hk >= HK.lever - 0.3) return { ...b, eyes: { mode: "open", lx: -1, ly: 0.4 }, armL: hk < HK.lever ? 140 : 140 - 100 * ease((hk - HK.lever) / 0.14), armR: 20, yaw: -0.55 };
      if (hk >= HK.chair) return { ...b, eyes: { mode: "open", lx: 1, ly: 0.2 }, yaw: 0.4, armR: 75, armL: 15 };
      if (hk >= HK.land) return { ...b, eyes: { mode: tau < 0.25 ? "wow" : "open", ly: 0.6 }, armL: 30 + 60 * Math.exp(-6 * tau), armR: 30 + 60 * Math.exp(-6 * tau) };
      return { ...b, eyes: { mode: "wow", ly: 1 }, armL: 165, armR: 165 };
    }
    case "h4":
      if (hk >= HK.q) return { ...base, eyes: { mode: "think", lx: -0.8, ly: 0.6 }, armL: 75 + 12 * Math.sin(t * 7), armR: 20, yaw: 0.1 };
      if (hk >= HK.lid) return { ...base, eyes: { mode: "wow", lx: -0.8, ly: 0.8 }, armL: 150, armR: 150 };
      return { ...base, eyes: { mode: "open", lx: -1, ly: -0.3 }, armL: 90 + 20 * Math.sin(t * 9), armR: 25 };
    case "claude":
    case "claudeShot": {
      const look = { lx: -1, ly: 1 };
      const on = C.feature?.on;
      if (kind === "claude" && on !== undefined && t > on - 0.05 && t < on + 0.7) return { ...base, eyes: { mode: "happy" }, yaw: -0.3 };
      if (kind === "claude" && t > C.send - 0.1) return { ...base, eyes: { mode: "wow", ...look }, yaw: -0.35 };
      return { ...base, eyes: { mode: "open", ...look }, yaw: -0.35 + sway };
    }
    case "wall":
      if (r && t > r.thinkUntil) return { ...base, eyes: { mode: "glow" }, armL: 140, armR: 140, yaw: 0.25 };
      return { ...base, eyes: { mode: "think", lx: 0.7, ly: 1 }, armR: 100 + 15 * Math.sin(t * 7), yaw: 0.3 };
    case "chain": {
      if (!r) return base;
      const st = r.stations;
      if (r.back && t >= r.back.arrive) return { ...base, eyes: { mode: "happy" }, armL: 160, armR: 160, yaw: -0.5 };
      if (t >= st[2].arrowAt) return { ...base, eyes: { mode: "open", lx: -1, ly: 0.6 }, armL: 120 + 10 * Math.sin(t * 6), armR: 15, yaw: -0.9 };
      if (t >= st[1].at) return { ...base, eyes: { mode: r.badge && t > r.badge.at ? "wow" : "open", lx: 0.2, ly: 1 }, armL: 20, armR: 135, yaw: -0.2 };
      return { ...base, eyes: { mode: "open", lx: -0.8, ly: 1 }, armL: 140, armR: 15, yaw: -0.6 };
    }
    case "question":
      return { ...base, eyes: { mode: "think", lx: -0.6, ly: 0.9 }, armL: 70 + 12 * Math.sin(t * 6), armR: 15, yaw: 0.35 };
    case "winner":
      if (r && t > r.fly - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 168, armR: 168, yaw: 0.15 };
      return { ...base, eyes: { mode: "open", lx: 0.6, ly: 0.9 }, yaw: 0.3 + sway, armR: r && t > r.dimAt ? 120 : 20 };
    case "table":
    case "mock":
      if (r && t > (r.stampAt ?? 1e9) - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 150, armR: 150, yaw: 0.2 };
      return { ...base, eyes: { mode: "open", lx: -0.7, ly: 1 }, armL: 110 + 10 * Math.sin(t * 5), armR: 20, yaw: 0.35 + sway };
    case "recap": {
      if (!r) return base;
      if (t > r.today.at - 0.05) return { ...base, eyes: { mode: "glow", lx: -0.8, ly: 1 }, armL: 150, armR: 25, yaw: -0.5 };
      if (r.last && t > r.last.at - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 150, armR: 150, yaw: -0.45 };
      return { ...base, eyes: { mode: "open", lx: -0.9, ly: 1 }, armL: 120 + 10 * Math.sin(t * 5), armR: 20, yaw: -0.45 + sway };
    }
    case "why": {
      if (!r) return base;
      const lastCard = r.cards.length ? r.cards[r.cards.length - 1].at : r.a;
      if (t > lastCard + 0.6) return { ...base, eyes: { mode: "happy" }, armL: 165, armR: 165, yaw: 0.15 };
      return { ...base, eyes: { mode: "think", lx: 0.5, ly: 0.9 }, armL: 70 + 12 * Math.sin(t * 6), armR: 160, yaw: 0.2 };
    }
    case "hub":
      if (r && t > r.next - 0.05) return { ...base, eyes: { mode: "glow" }, armR: 140, yaw: 0 };
      return { ...base, eyes: { mode: "happy" }, armL: 150, armR: 150, yaw: 0 };
    case "end": {
      if (!r) return base;
      const caught = t > r.plane[1];
      const last = r.result ? Math.max(...r.result.parts.map((p: any) => p.at)) : 1e9;
      if (t > last - 0.05) return { ...base, eyes: { mode: "happy" }, armL: 165, armR: 165 };
      if (caught) return { ...base, eyes: { mode: "glow" }, armL: 160 + 6 * Math.sin(t * 5), armR: 160 - 6 * Math.sin(t * 5) };
      return { ...base, eyes: { mode: "open", lx: 0, ly: 1 }, armR: t > r.keywordAt ? 50 + 15 * Math.sin(t * 8) : 15 };
    }
  }
  return base;
};
