# Superkind Brand — shared by every video phase skill

Verified live from superkind.ai on 2026-09-23 (not guessed: colors read via computed-style inspection, logo downloaded as the actual served SVG). This is the single source of truth for anything visual we produce under the Superkind brand: the Guidebook PDFs (`video-guidebook`), the Remotion B-Roll (`video-broll`) and the edit (`video-post-production`).

**Why this file exists:** the talking-head footage (HeyGen), the B-Roll animations (Remotion) and the lead-magnet PDF are different production pipelines for the same video. Without one shared rulebook they drift: slightly different oranges, different fonts, different motion feel. `broll/src/theme.ts` mirrors these tokens in code.

## 1. Brand identity

- **Company:** Superkind, "AI employees for the Mittelstand" (superkind.ai). Builds AI systems that integrate into a company's existing tools (email, Teams, CRM, ERP) rather than making the company adopt new software.
- **Voice:** direct, pragmatic, no corporate jargon. Concrete over abstract ("your people still type in data by hand", not "we optimize workflows"). Confident but not hypey.
- **These videos' framing:** presented by **Florent Preusser** (on-camera creator/channel owner), credited alongside Superkind as "Ein Guide von Florent Preusser × Superkind" wherever both are named.
- **Contact / soft CTA:** `https://calendly.com/henri-superkind/30min`, the closing CTA in the Guidebook PDF; reuse this link if a B-Roll ever needs a CTA end-card.

## 2. Color tokens

Use these exact hex values everywhere. Don't eyeball a "close enough" orange.

| Token | Hex | Usage |
|---|---|---|
| `accent` | `#FF6B35` | The one accent color. Highlighted words, links, kickers, prompt labels, key numbers. Use sparingly; it works because it's rare. |
| `ink` | `#111111` | Primary text/logo color on light backgrounds. |
| `dark` | `#0A0A0A` | Dark section backgrounds (hero panels, CTA end-cards), buttons on light backgrounds. White text sits on this. |
| `muted` | `#6B7280` | Secondary/caption text, timestamps, de-emphasized labels. |
| `surface` | `#F4F4F5` | Light gray fill for cards/boxes on white. |
| `rule` | `#E5E5E5` | Hairlines, borders, dividers. |
| `white` | `#FFFFFF` | Base light background; text on dark panels. |

Never introduce a second accent color. If a B-Roll needs a second data-viz color, use `ink` at 40-60% opacity.

## 3. Typography

**Font:** Inter, static weights in `~/.claude/skills/video-guidebook/assets/fonts/` (400/500/600/700) and `broll/public/fonts/`. No other typeface anywhere, with two exceptions: the burned-in karaoke captions use **Anton** (see `video-post-production`), and the intro/outro text-hook pills mimic Instagram's native "Strong" sticker (see `video-post-production`).

**Scale for full-frame B-Roll text** (relative to frame height):

| Role | Weight | Size | Notes |
|---|---|---|---|
| Hero number / big stat | Bold | ~18-22% | One number, huge, nothing competing. |
| Headline / step title | Bold | ~7-9% | 3-6 words max on screen at once. |
| Body / supporting line | Medium | ~3-4% | Only when a headline truly needs one supporting line. |
| Kicker / label | SemiBold, accent | ~2-2.5%, letter-spacing ~0.05em | Small label above a headline. |

Rule of thumb from the live site's hero: one short, punchy headline with a single accent-colored phrase inside it. One idea, one screen, then cut.

## 4. Logo

- Asset: `~/.claude/skills/video-guidebook/assets/superkind-logo.svg` (the actual mark served on superkind.ai).
- `ink` on light backgrounds, `white` on dark. Never orange, never recolored.
- Minimum ~24px effective height in a 1080p frame; clear space ≈ half the mark's height on all sides.
- Pair with the "Superkind" wordmark in Inter-Bold when there's room.
- **Never burned into the video** (see `video-broll` → what not to render).

## 5. Motion style: "clean, Apple-style, classy"

Restrained, premium-feeling motion; not flashy, not bouncy, not skeuomorphic.

- **One easing curve everywhere:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No spring/bounce/elastic.
- **Timing:** entrance 300-450 ms, exit 200-300 ms, ≥800 ms settled hold before the next move. A full B-Roll insert runs 2-4 s.
- **What moves:** text = opacity + 12-16 px rise (not scale-pop); cards = soft scale 1.0→1.02-1.04 + opacity; counters count over the full hold.
- **Never:** overshoot, spinning entrances, particle effects, heavy drop shadows. If it wouldn't look at home on apple.com, it doesn't belong.
- **The B-Roll look actually in use (user-validated, supersedes the "white or dark background only" idea):** dark base, drifting orange glow orbs, frosted-glass cards, staggered blur-to-sharp reveals, content visible from frame 0. Lives in `broll/src/components/GlassKit.tsx`.

---

*Update this file, don't fork it, if Superkind's branding changes. Re-verify against the live site (computed-style inspection), don't trust memory of an old palette.*
