// Superkind design tokens — mirrors ~/.claude/skills/heygen-video-generator/references/brand.md
// Single source of truth: every component imports from here, never hardcodes a hex/duration.
// If Superkind's branding ever changes, re-verify against superkind.ai and update ONLY this file.

export const colors = {
  accent: "#FF6B35",
  ink: "#111111",
  dark: "#0A0A0A",
  muted: "#6B7280",
  surface: "#F4F4F5",
  rule: "#E5E5E5",
  white: "#FFFFFF",
} as const;

export const fonts = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semibold: "Inter-SemiBold",
  bold: "Inter-Bold",
  // Karaoke captions only — Anton, picked by rendering candidates side by
  // side against a frame of the reference edit (nikvideo2final); width,
  // weight and cap height match almost exactly. Loaded via
  // @remotion/google-fonts in loadFonts.ts.
  caption: "Anton",
} as const;

// design.md §5 — the one canonical easing curve, used everywhere. Do not
// introduce spring/bounce/elastic easing anywhere in this project.
export const easing = {
  standard: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// design.md §5 — timing in frames, assuming FPS = 30 (see Root.tsx).
export const timing = {
  fps: 30,
  entranceFrames: 12, // ~400ms
  exitFrames: 8, // ~270ms
  minHoldFrames: 24, // ~800ms minimum settled time before the next beat
};
