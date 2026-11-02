#!/usr/bin/env node
// Zernio: Reel/Post auf Instagram (oder anderen verbundenen Accounts) einplanen.
// Key: ZERNIO_API_KEY in broll/.env. Doku: https://docs.zernio.com (OpenAPI /api/openapi).
//
// Einplanen:
//   node scripts/zernio-schedule.mjs --video runs/<run>/upload/x.mp4 --cover runs/<run>/upload/cover.jpg \
//     --caption-file runs/<run>/caption.txt --at "2026-10-16 18:30" [--account florent_preusser] [--trial] [--first-comment "…"] [--draft]
//     [--run runs/<run>] [--no-funnel]   legt den DM-Funnel sofort mit an (Format aus format.json, PDF + replies.json aus dem Run)
// Weitere Befehle:
//   node scripts/zernio-schedule.mjs accounts        verbundene Accounts
//   node scripts/zernio-schedule.mjs list            geplante Posts
//   node scripts/zernio-schedule.mjs delete <postId> geplanten Post löschen
// Ohne --at wird der Post als Entwurf gespeichert. Zeiten ohne Offset gelten als Europe/Berlin.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const KEY = (env.match(/^ZERNIO_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error("ZERNIO_API_KEY fehlt in broll/.env"); process.exit(1); }
const BASE = "https://zernio.com/api/v1";
const TZ = "Europe/Berlin";

const api = async (method, p, body) => {
  const r = await fetch(BASE + p, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const txt = await r.text();
  let data; try { data = JSON.parse(txt); } catch { data = txt; }
  if (!r.ok) throw new Error(`${method} ${p} -> HTTP ${r.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  return data;
};

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const has = (n) => args.includes(`--${n}`);

const accounts = async () => { const d = await api("GET", "/accounts"); return d.accounts ?? d; };

const upload = async (file) => {
  const abs = path.resolve(ROOT, file);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(abs).toLowerCase();
  const contentType = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" }[ext];
  if (!contentType) throw new Error(`Unbekannter Dateityp: ${ext}`);
  const pre = await api("POST", "/media/presign", { filename: path.basename(abs), contentType, size: buf.length });
  const put = await fetch(pre.uploadUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: buf });
  if (!put.ok) throw new Error(`Upload ${path.basename(abs)} fehlgeschlagen: HTTP ${put.status}`);
  return { url: pre.publicUrl, contentType, size: buf.length };
};

const cmd = args[0];
if (cmd === "accounts") {
  for (const a of await accounts()) console.log(a._id, a.platform, a.username || a.displayName, a.isActive ? "aktiv" : "inaktiv");
} else if (cmd === "list") {
  const d = await api("GET", "/posts?status=scheduled&limit=50");
  for (const p of d.posts ?? d) console.log(p._id, p.status, p.scheduledFor, (p.platforms || []).map((x) => x.platform).join(","), (p.content || "").slice(0, 60).replace(/\n/g, " "));
} else if (cmd === "delete") {
  await api("DELETE", `/posts/${args[1]}`);
  console.log("gelöscht:", args[1]);
} else {
  const video = flag("video");
  if (!video) { console.error("--video fehlt"); process.exit(1); }
  const want = flag("account") || "florent_preusser";
  const acc = (await accounts()).find((a) => a._id === want || (a.username || "").toLowerCase() === want.toLowerCase());
  if (!acc) { console.error(`Account ${want} nicht in Zernio verbunden.`); process.exit(1); }
  const content = flag("caption-file") ? fs.readFileSync(path.resolve(ROOT, flag("caption-file")), "utf8").trim() : flag("caption") || "";
  console.log("Lade Video hoch …");
  const v = await upload(video);
  const item = { type: "video", url: v.url, mimeType: v.contentType, size: v.size };
  if (flag("cover")) { console.log("Lade Cover hoch …"); item.instagramThumbnail = (await upload(flag("cover"))).url; }
  const psd = { shareToFeed: true };
  if (flag("first-comment")) psd.firstComment = flag("first-comment");
  if (has("trial")) psd.trialParams = { graduationStrategy: "SS_PERFORMANCE" };
  const body = { content, mediaItems: [item], timezone: TZ, platforms: [{ platform: acc.platform, accountId: acc._id, platformSpecificData: psd }] };
  if (flag("at") && !has("draft")) body.scheduledFor = flag("at");
  const res = await api("POST", "/posts", body);
  const post = res.post ?? res;
  console.log(JSON.stringify({ postId: post._id, status: post.status, scheduledFor: post.scheduledFor, account: acc.username, platform: acc.platform }, null, 1));

  // Funnel right away (Henri 2026-10-21): attached to the Zernio post id. WARNING (2026-10-21, 100-agenten-tag1):
  // Zernio did NOT remap it to the Instagram media id on publish, so the automation saw no comments. After the post is
  // live, PATCH /comment-automations/<id> {platformPostId: <IG media id>} and catch up early commenters. Run folder = --run or the folder of --video.
  // FP-S gets none. GPT-S gets the guide funnel since 2026-10-27 (Satire → Gegenmittel-Guide, texts funnel/gpts-funnel.json). Skip with --no-funnel.
  const runDir = flag("run") ? path.resolve(ROOT, flag("run")) : (path.resolve(ROOT, video).match(/^(.*\/runs\/[^/]+)\//) || [])[1];
  if (!has("no-funnel") && runDir && fs.existsSync(runDir)) {
    const run = path.basename(runDir);
    const pj = path.join(runDir, "publish.json");
    const pub = fs.existsSync(pj) ? JSON.parse(fs.readFileSync(pj, "utf8")) : {};
    Object.assign(pub, { account: acc.username, via: "Zernio", zernio_post_id: post._id, scheduled_for: post.scheduledFor, status: post.status });
    const fmt = fs.existsSync(path.join(runDir, "format.json")) ? JSON.parse(fs.readFileSync(path.join(runDir, "format.json"), "utf8")) : {};
    const format = fmt.format || "";
    const kind = format === "GPT-S" ? "gpt" : /-S$/.test(format) ? null : format === "FP-N" ? "fp2" : format === "GPT-N" ? "gpt" : format.startsWith("BX") ? (fmt.funnel || "bx-guide") : null;
    const pdf = fs.readdirSync(runDir).find((f) => f.endsWith(".pdf") && /guide/i.test(f));
    const replies = fs.existsSync(path.join(runDir, "replies.json"));
    if (kind && pdf && replies) {
      const prefix = { fp: "FP Funnel", fp2: "FP Funnel", gpt: "GPT Funnel", bx: "BX Funnel", "bx-guide": "BX Guide" }[kind];
      const { execFileSync } = await import("child_process");
      const out = execFileSync(process.execPath, [path.join(ROOT, "scripts/zernio-funnel.mjs"), "create", "--kind", kind, "--account", acc.username,
        "--name", `${format === "GPT-S" ? "GPT-S Funnel" : prefix} ${run.replace(/^(fpn|fps|gpts?|bx)-/, "")}`, "--replies", path.join(runDir, "replies.json"), "--pdf", path.join(runDir, pdf),
        "--platform-post-id", post._id, ...(format === "GPT-S" ? ["--config", "funnel/gpts-funnel.json"] : [])], { cwd: ROOT, encoding: "utf8" });
      const f = JSON.parse(out.trim().split("\n").filter((l) => l.startsWith("{")).pop());
      pub.funnel = { name: f.name, kind, workflowId: f.workflowId, automationId: f.automationId, active: f.automationActive, attachedTo: "Zernio post id (remaps on publish)" };
      console.log(`Funnel aktiv: ${f.name} (Automation ${f.automationId})`);
    } else {
      console.log(kind ? `KEIN Funnel: im Run-Ordner fehlt ${!pdf ? "das Guide-PDF " : ""}${!replies ? "replies.json" : ""}` : `Kein Funnel (Format ${format || "unbekannt"})`);
    }
    fs.writeFileSync(pj, JSON.stringify(pub, null, 1));
  }
}
