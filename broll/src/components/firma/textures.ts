// Firma series engine — per-episode static textures (labels, stamps, cards), built once from episode.json
import React from "react";
import * as THREE from "three";
import { SKC } from "../ShirtWorld3D";
import { labelTex, badgeTex, questionTex, stampTex, dieText, logoTex } from "./draw";
import type { TL } from "./timeline";

export type ActTex = { labels?: THREE.Texture[]; badge?: THREE.Texture; logo?: THREE.Texture; stamp?: THREE.Texture; qcard?: THREE.Texture; qstamp?: THREE.Texture };
export type EpTex = { acts: ActTex[] };

export const useEpTex = (tl: TL, ready: boolean): EpTex | null => React.useMemo(() => {
  if (!ready) return null;
  const acts: ActTex[] = tl.acts.map((x) => {
    switch (x.type) {
      case "chain":
        return {
          labels: x.stations.map((s) => labelTex(s.label)),
          badge: x.badge ? badgeTex(x.badge.big, x.badge.small) : undefined,
          logo: logoTex(x.logo ?? "LOGO"),
        };
      case "winner": {
        const label = x.label ?? (x.card !== undefined && tl.wall ? tl.wall.cards[x.card].label : "");
        return { stamp: stampTex(x.stamp ?? `→ ${label}`) };
      }
      case "question":
        return {
          qcard: questionTex(x.pill ?? "NOCH OFFEN", x.lines),
          qstamp: x.stamp === null ? undefined : dieText(x.stamp ?? "QUELLE: KEINE GEFUNDEN", "#E5484D", "#FFFFFF", 1300, 260, 100),
        };
      case "table":
      case "mock":
        return { stamp: x.stamp ? stampTex(x.stamp) : undefined };
      default:
        return {};
    }
  });
  return { acts };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [ready, tl]);

export { SKC };
