// AI motion B-roll for shots no stock clip covers (key press, lid opening, someone sitting down …).
// Default model is MiniMax Hailuo 3 Max ("h3max") via OpenRouter. It accepts exactly ONE keyframe (first_frame).
//
// Usage:
//   node scripts/gen-motion-broll.mjs --first <frame.png> --prompt "<text>" --out <clip.mp4>
//        [--dur 5] [--aspect 4:3|16:9|9:16|1:1] [--res 768p|480p] [--model minimax/hailuo-3-max] [--dry]
//
// --first should be a real frame from the stock clip you will cut into (same hands, light, grade),
// so the generated clip can crossfade into real footage. Costs ~$0.08/s at 768p (5 s ≈ $0.40).
// The key comes from broll/.env (OPENROUTER_API_KEY), never from CLI args.

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { dataUrl } from "./lib/openrouter.mjs";

const API = "https://openrouter.ai/api/v1";
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] === undefined ? true : all[i + 1]]] : acc), []),
);
if (!args.prompt || !args.out) {
  console.error('Usage: --first <png> --prompt "<text>" --out <mp4> [--dur 5] [--aspect 4:3] [--res 768p] [--model id] [--dry]');
  process.exit(1);
}

process.loadEnvFile(path.resolve(import.meta.dirname, "../.env"));
const h = { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" };

// credit check first: a failed job still burns time, an empty wallet fails late
const cr = await (await fetch(`${API}/credits`, { headers: h })).json();
const left = (cr.data?.total_credits ?? 0) - (cr.data?.total_usage ?? 0);
const dur = Number(args.dur ?? 5);
const est = dur * (args.res === "480p" ? 0.045 : 0.08);
console.log(`OpenRouter credit left: $${left.toFixed(2)} · this clip ≈ $${est.toFixed(2)}`);
if (left < est) console.warn("Warning: account balance looks lower than the estimate. Trying anyway; OpenRouter answers 402 if it really is empty.");
if (args.dry) process.exit(0);

const body = {
  model: args.model ?? "minimax/hailuo-3-max",
  prompt: args.prompt,
  aspect_ratio: args.aspect ?? "4:3",
  resolution: args.res ?? "768p",
  duration: dur,
  aigc_watermark: false,
};
if (args.first) body.frame_images = [{ type: "image_url", image_url: { url: await dataUrl(args.first) }, frame_type: "first_frame" }];
const r = await fetch(`${API}/videos`, { method: "POST", headers: h, body: JSON.stringify(body) });
const job = await r.json();
if (!r.ok) { console.error(r.status, JSON.stringify(job)); process.exit(1); }
console.log("job", job.id);
const poll = job.polling_url ?? `${API}/videos/${job.id}`;
for (;;) {
  await new Promise((s) => setTimeout(s, 10000));
  const st = await (await fetch(poll, { headers: h })).json();
  console.log(st.status);
  if (st.status === "completed") {
    const v = await fetch(st.unsigned_urls?.[0] ?? `${API}/videos/${job.id}/content?index=0`, { headers: h });
    await writeFile(args.out, Buffer.from(await v.arrayBuffer()));
    console.log("saved", args.out, "cost", st.usage?.cost);
    break;
  }
  if (st.status === "failed") { console.error("failed", JSON.stringify(st)); process.exit(1); }
}
