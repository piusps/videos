// Generates one pixel-art background plate via an OpenRouter image model (no characters, no text),
// for the opus reels whose pixel scenes are animated in Remotion on top of the plate.
// Usage: node scripts/gen-pixel-plate.mjs --prompt "<scene>" --out public/<run>/<name>.png [--aspect 16:9] [--model google/gemini-3-pro-image]
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => (a.startsWith("--") ? [...acc, [a.slice(2), arr[i + 1]]] : acc), []));
if (!args.prompt || !args.out) throw new Error('Usage: --prompt "<scene>" --out <file.png> [--aspect 16:9] [--model id]');
const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const KEY = env.match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) throw new Error("OPENROUTER_API_KEY missing in broll/.env");

const STYLE =
  "Detailed cozy 2D pixel art in the style of Stardew Valley, warm palette, crisp pixels, soft warm lighting, high detail, " +
  "straight-on front view, completely empty of people, animals and characters, absolutely no text, no letters, no numbers, no logos, no signs with writing.";
const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: args.model ?? "google/gemini-3-pro-image",
    messages: [{ role: "user", content: `${args.prompt}\n\n${STYLE}` }],
    modalities: ["image", "text"],
    image_config: { aspect_ratio: args.aspect ?? "16:9" },
  }),
});
const json = await res.json();
if (!res.ok) throw new Error(JSON.stringify(json).slice(0, 800));
const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
if (!url) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 800)}`);
fs.mkdirSync(path.dirname(args.out), { recursive: true });
fs.writeFileSync(args.out, Buffer.from(url.split(",")[1], "base64"));
console.log(`OK ${args.out}`);
