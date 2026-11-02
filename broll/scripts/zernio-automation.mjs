#!/usr/bin/env node
// Zernio comment-to-DM automation (ersetzt den InstantDM-Dashboard-Weg, seit 2026-10-17).
// Lädt das Guide-PDF zu Zernio hoch (öffentliche URL für den DM-Button) und legt eine Automation an,
// die auf JEDEN Kommentar (keywords leer = All Comments) eine DM mit Guide-Button schickt und öffentlich antwortet.
//
//   node scripts/zernio-automation.mjs create --account florent_preusser --name "FP Wissen" \
//     --pdf runs/fpn-wissen/wissen-guidebook.pdf --config runs/fpn-wissen/automation.json \
//     (--platform-post-id <IG media id> | --post-id <Zernio post id>)
//   node scripts/zernio-automation.mjs list
//   node scripts/zernio-automation.mjs logs <automationId>
//   node scripts/zernio-automation.mjs pause|resume|delete <automationId>
//
// automation.json: { "dmMessage": "...", "dmMessageVariations": [...], "buttonTitle": "Guide öffnen",
//                    "commentReply": "...", "commentReplyVariations": [...] }
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = (fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^ZERNIO_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error("ZERNIO_API_KEY fehlt in broll/.env"); process.exit(1); }
const BASE = "https://zernio.com/api/v1";
const api = async (method, p, body) => {
  const r = await fetch(BASE + p, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const txt = await r.text();
  let data; try { data = JSON.parse(txt); } catch { data = txt; }
  if (!r.ok) throw new Error(`${method} ${p} -> HTTP ${r.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  return data;
};
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };

const uploadPdf = async (file) => {
  const abs = path.resolve(ROOT, file);
  const buf = fs.readFileSync(abs);
  const pre = await api("POST", "/media/presign", { filename: path.basename(abs), contentType: "application/pdf", size: buf.length });
  const put = await fetch(pre.uploadUrl, { method: "PUT", headers: { "Content-Type": "application/pdf" }, body: buf });
  if (!put.ok) throw new Error(`PDF-Upload fehlgeschlagen: HTTP ${put.status}`);
  return pre.publicUrl;
};

const cmd = args[0];
if (cmd === "list") {
  const d = await api("GET", "/comment-automations");
  for (const a of d.automations ?? d) console.log(a._id ?? a.id, a.isActive ? "aktiv" : "pausiert", a.name, a.platformPostId ?? a.postId ?? "account-wide", JSON.stringify(a.stats ?? {}));
} else if (cmd === "logs") {
  console.log(JSON.stringify(await api("GET", `/comment-automations/${args[1]}/logs`), null, 1));
} else if (cmd === "pause" || cmd === "resume") {
  console.log(JSON.stringify(await api("PATCH", `/comment-automations/${args[1]}`, { isActive: cmd === "resume" }), null, 1));
} else if (cmd === "delete") {
  console.log(JSON.stringify(await api("DELETE", `/comment-automations/${args[1]}`), null, 1));
} else if (cmd === "create") {
  const cfg = JSON.parse(fs.readFileSync(path.resolve(ROOT, flag("config")), "utf8"));
  const accs = (await api("GET", "/accounts")).accounts;
  const want = flag("account");
  const acc = accs.find((a) => a._id === want || (a.username || "").toLowerCase() === want.toLowerCase());
  if (!acc) throw new Error(`Account ${want} nicht in Zernio verbunden`);
  const profileId = acc.profileId?._id ?? acc.profileId ?? "6ad10bb001681e77d331a87a";
  const pdfUrl = cfg.pdfUrl ?? (flag("pdf") ? await uploadPdf(flag("pdf")) : undefined);
  const body = {
    profileId, accountId: acc._id, name: flag("name"), trigger: "comment", keywords: [],
    dmMessage: cfg.dmMessage, dmMessageVariations: cfg.dmMessageVariations,
    commentReply: cfg.commentReply, commentReplyVariations: cfg.commentReplyVariations,
    publicReplyPolicy: "after_dm", repeatPolicy: { mode: "every_comment" },
  };
  if (pdfUrl) body.buttons = [{ type: "url", title: cfg.buttonTitle ?? "Guide öffnen", url: pdfUrl }];
  if (flag("platform-post-id")) body.platformPostId = flag("platform-post-id");
  if (flag("post-id")) body.postId = flag("post-id");
  if (cfg.postTitle) body.postTitle = cfg.postTitle;
  const res = await api("POST", "/comment-automations", body);
  const a = res.automation ?? res;
  console.log(JSON.stringify({ automationId: a._id ?? a.id, active: a.isActive, status: a.status, pdfUrl, account: acc.username }, null, 1));
} else {
  console.error("Befehl: create | list | logs | pause | resume | delete");
  process.exit(1);
}
