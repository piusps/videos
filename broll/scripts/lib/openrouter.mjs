// Thin OpenRouter client for the three things this pipeline uses it for:
//   1. video generation (Type-B B-Roll, e.g. Seedance) — /api/v1/videos
//   2. video understanding (auto-QC of B-Roll clips and the final cut)
//   3. image understanding (auto-QC of start frames / frame 0 / thumbnails)
// Key comes from broll/.env as OPENROUTER_API_KEY — never from chat/CLI args.

import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BROLL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const API = "https://openrouter.ai/api/v1";

function apiKey() {
  const envFile = path.join(BROLL_ROOT, ".env");
  if (!process.env.OPENROUTER_API_KEY && existsSync(envFile)) process.loadEnvFile(envFile);
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error(`OPENROUTER_API_KEY missing — add it to ${envFile}`);
  return key;
}

async function call(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status} ${url}: ${await res.text()}`);
  return res;
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".mov": "video/mov", ".webm": "video/webm" };

export async function dataUrl(file) {
  const mime = MIME[path.extname(file).toLowerCase()];
  if (!mime) throw new Error(`Unsupported file type: ${file}`);
  return `data:${mime};base64,${(await readFile(file)).toString("base64")}`;
}

// ---------- 1. Video generation ----------

export async function listVideoModels() {
  const res = await call(`${API}/videos/models`);
  const json = await res.json();
  return json.data ?? json;
}

// Picks the newest Seedance model if no model is given (OpenRouter's catalog
// changes; resolving at runtime avoids hardcoding a stale ID).
export async function resolveVideoModel(preferred) {
  const models = await listVideoModels();
  if (preferred) {
    const m = models.find((x) => x.id === preferred);
    if (!m) throw new Error(`Model ${preferred} not available. Available: ${models.map((x) => x.id).join(", ")}`);
    return m;
  }
  const seedance = models.filter((x) => /seedance/i.test(x.id)).sort((a, b) => b.id.localeCompare(a.id));
  if (!seedance.length) throw new Error(`No Seedance model on OpenRouter right now. Available: ${models.map((x) => x.id).join(", ")}`);
  return seedance[0];
}

// references: [{ kind: "image" | "video" | "audio", file } | { kind, url }] — sent as
// input_references (video/audio only honored by Seedance 2+; video must be a public HTTPS url).
// resolution: null omits it (for editing models that keep the input's size).
export async function generateVideo({ model, prompt, firstFrame, references = [], duration, resolution = "1080p", aspectRatio = "9:16", seed, generateAudio = false, out }) {
  const body = { model, prompt, aspect_ratio: aspectRatio, generate_audio: generateAudio };
  if (resolution) body.resolution = resolution;
  if (duration) body.duration = duration;
  if (seed !== undefined) body.seed = seed;
  if (firstFrame) {
    body.frame_images = [{ type: "image_url", image_url: { url: await dataUrl(firstFrame) }, frame_type: "first_frame" }];
  }
  if (references.length) {
    body.input_references = await Promise.all(
      references.map(async (r) => ({ type: `${r.kind}_url`, [`${r.kind}_url`]: { url: r.url ?? (await dataUrl(r.file)) } })),
    );
  }
  const job = await (await call(`${API}/videos`, { method: "POST", body: JSON.stringify(body) })).json();
  console.log(`Video job ${job.id} submitted (${model})`);

  const pollUrl = job.polling_url ?? `${API}/videos/${job.id}`;
  for (;;) {
    await new Promise((r) => setTimeout(r, 15000));
    const status = await (await call(pollUrl)).json();
    console.log(`  status: ${status.status}`);
    if (status.status === "completed") {
      const video = await call(status.unsigned_urls?.[0] ?? `${API}/videos/${job.id}/content?index=0`);
      await writeFile(out, Buffer.from(await video.arrayBuffer()));
      return { id: job.id, cost: status.usage?.cost, out };
    }
    if (status.status === "failed") throw new Error(`Video generation failed: ${status.error}`);
  }
}

// ---------- Text (Studio app: topics, scripts, captions, guidebook content) ----------

export const TEXT_MODEL = "anthropic/claude-opus-5.5";

// Structured JSON answer. schema: a JSON Schema object (strict). plugins: e.g. [{ id: "web" }]
// for live web research. Returns { data, cost }.
export async function chatJSON({ system, user, schema, name = "answer", model = TEXT_MODEL, plugins, maxTokens = 16000, effort = "medium" }) {
  const body = {
    model,
    max_tokens: maxTokens,
    reasoning: { effort },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_schema", json_schema: { name, strict: true, schema } },
    usage: { include: true },
  };
  if (plugins) body.plugins = plugins;
  const json = await (await call(`${API}/chat/completions`, { method: "POST", body: JSON.stringify(body) })).json();
  const text = json.choices?.[0]?.message?.content ?? "";
  try {
    return { data: JSON.parse(text.replace(/^```json\s*|\s*```$/g, "")), cost: json.usage?.cost ?? 0 };
  } catch {
    throw new Error(`Model returned no valid JSON: ${text.slice(0, 300)}`);
  }
}

export function hasApiKey() {
  try {
    return Boolean(apiKey());
  } catch {
    return false;
  }
}

// ---------- 2 + 3. Video / image understanding ----------

export const REVIEW_MODEL = "google/gemini-2.5-flash";

// media: [{ kind: "image" | "video", file }]
export async function review({ media, instructions, model = REVIEW_MODEL }) {
  const content = [{ type: "text", text: instructions }];
  for (const m of media) {
    const url = await dataUrl(m.file);
    content.push(m.kind === "video" ? { type: "video_url", video_url: { url } } : { type: "image_url", image_url: { url } });
  }
  const res = await call(`${API}/chat/completions`, {
    method: "POST",
    body: JSON.stringify({ model, messages: [{ role: "user", content }], response_format: { type: "json_object" } }),
  });
  const json = await res.json();
  const text = json.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
  } catch {
    return { pass: false, raw: text };
  }
}
