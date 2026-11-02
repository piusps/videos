// Firma series engine — story object data + anchor resolution (pure, no React; used by timeline.ts). Component: story.tsx
import type { Anchor } from "./schema";

export type StorySpec = {
  name: string; sub?: string;
  label?: { text: string; at?: Anchor };                         // green care label on the shirt ("60 °C")
  stamps?: { text: string; at?: Anchor; color?: "green" | "orange" | "red" }[]; // "AB 1 STÜCK", "UNTER VORBEHALT"
  fields?: { text: string; at: Anchor }[];                       // "Händlerpreis: ?" (grey, "?" glows on glowAt)
  glowAt?: Anchor;
  chip?: { text: string; at: Anchor };                           // "nicht gefunden" under the card
  bill?: {
    title?: string; titleAt?: Anchor; pulse?: Anchor[];
    rows: { label: string; value: number; at?: Anchor; bad?: boolean }[]; // value in € (rolls 0 → value on `at`)
    diff?: { text: string; at?: Anchor };
  };
  show: { at: Anchor; place: "hook" | "top" | "small" | "off"; bill?: boolean; pill?: string }[];
  // visible events while the card stands (hook rule: an image event at least every 0.5 s): pulse one part, or "push" = step zoom +5 %
  beats?: { at: Anchor; what: "label" | "stamp" | "bill0" | "bill1" | "diff" | "push" }[];
};
type R = (a: Anchor) => number;
export const resolveStory = (s: StorySpec, at: R) => ({
  ...s,
  label: s.label ? { text: s.label.text, at: s.label.at === undefined ? -1 : at(s.label.at) } : undefined,
  stamps: (s.stamps ?? []).map((x) => ({ ...x, at: x.at === undefined ? -1 : at(x.at) })),
  fields: (s.fields ?? []).map((x) => ({ ...x, at: at(x.at) })),
  glowAt: s.glowAt === undefined ? 1e9 : at(s.glowAt),
  chip: s.chip ? { ...s.chip, at: at(s.chip.at) } : undefined,
  bill: s.bill ? {
    ...s.bill, titleAt: s.bill.titleAt === undefined ? -1 : at(s.bill.titleAt), pulse: (s.bill.pulse ?? []).map(at),
    rows: s.bill.rows.map((r) => ({ ...r, at: r.at === undefined ? -1 : at(r.at) })),
    diff: s.bill.diff ? { text: s.bill.diff.text, at: s.bill.diff.at === undefined ? -1 : at(s.bill.diff.at) } : undefined,
  } : undefined,
  beats: (s.beats ?? []).map((b) => ({ ...b, at: at(b.at) })),
  show: s.show.map((k) => ({ ...k, at: at(k.at) })).sort((a, b) => a.at - b.at),
});
export type StoryR = ReturnType<typeof resolveStory>;
