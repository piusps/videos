#!/usr/bin/env node
// Type-B B-Roll: Seedance (via OpenRouter) animates a start frame WE render
// in Remotion (crisp Superkind glass UI) into a cinematic camera move.
// HeyGen is never used for B-Roll. Every clip goes through an automated QC
// (image QC on the start frame before paying for video, video QC on the
// result) and is regenerated once with a new seed if it fails.
//
// Usage:
//   node scripts/generate-broll.mjs --prompt "<motion prompt>" --first-frame still.png \
//     --out clip.mp4 [--duration 5] [--model <openrouter id>] [--no-review]
//
// Render a start frame first, e.g.:
//   npx remotion still src/index.ts WebsiteScrollBroll still.png --frame=20

import { writeFile } from "node:fs/promises";
import { generateVideo, resolveVideoModel, review } from "./lib/openrouter.mjs";
import { BROLL_RUBRIC, STILL_RUBRIC } from "./lib/rubrics.mjs";

function parseArgs(argv) {
  const out = { duration: 5, review: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prompt") out.prompt = argv[++i];
    else if (a === "--first-frame") out.firstFrame = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--duration") out.duration = parseInt(argv[++i], 10);
    else if (a === "--model") out.model = argv[++i];
    else if (a === "--no-review") out.review = false;
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!out.prompt || !out.out) throw new Error("Usage: --prompt <text> --out <file.mp4> [--first-frame <png>] [--duration 5] [--model id]");
  return out;
}

// Appended to every prompt — the Superkind B-Roll look + the no-stock rule.
const STYLE = `
Style: clean Apple-level software UI, frosted glassmorphism panels with soft reflections and thin white borders, near-black background with warm orange (#FF6B35) glow, cinematic lighting, shallow depth of field, ultra sharp, smooth confident camera move, constant motion in every frame, vertical 9:16.
Avoid: people, hands, faces, rooms, desks, offices, furniture, stock-footage look, logos, watermarks, garbled or melting text, warped layout, flicker, static frames.`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const model = await resolveVideoModel(args.model);
  console.log(`Model: ${model.id}`);

  if (args.review && args.firstFrame) {
    const still = await review({ media: [{ kind: "image", file: args.firstFrame }], instructions: STILL_RUBRIC });
    console.log(`Start-frame QC: ${still.pass ? "PASS" : "FAIL"} ${JSON.stringify(still.issues ?? still.raw ?? "")}`);
    if (!still.pass) throw new Error("Start frame failed QC — fix the Remotion still before paying for a video.");
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    const result = await generateVideo({
      model: model.id,
      prompt: args.prompt.trim() + "\n" + STYLE,
      firstFrame: args.firstFrame,
      duration: args.duration,
      seed: attempt === 1 ? undefined : Math.floor(Math.random() * 1e9),
      out: args.out,
    });
    console.log(`Generated ${args.out} (cost ${result.cost ?? "?"})`);
    if (!args.review) return;

    const verdict = await review({ media: [{ kind: "video", file: args.out }], instructions: BROLL_RUBRIC });
    await writeFile(args.out.replace(/\.mp4$/, ".review.json"), JSON.stringify(verdict, null, 2));
    console.log(`Clip QC: ${verdict.pass ? "PASS" : "FAIL"} ${JSON.stringify(verdict.issues ?? verdict.raw ?? "")}`);
    if (verdict.pass) return;
    if (attempt === 2) throw new Error("Clip failed QC twice — adjust the prompt or build this beat in Remotion (Type A).");
    console.log("Regenerating once with a new seed…");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
