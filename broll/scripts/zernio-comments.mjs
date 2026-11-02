#!/usr/bin/env node
// Read-only: list comments (username, text, time) on the newest Instagram posts of a Zernio account.
//   node scripts/zernio-comments.mjs --account pickthecompany [--posts 5]
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = (fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^ZERNIO_API_KEY=(.+)$/m) || [])[1]?.trim();
const BASE = "https://zernio.com/api/v1";
const api = async (p) => {
  const r = await fetch(BASE + p, { headers: { Authorization: `Bearer ${KEY}` } });
  const t = await r.text();
  if (!r.ok) throw new Error(`GET ${p} -> HTTP ${r.status}: ${t}`);
  return JSON.parse(t);
};
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const acc = (await api("/accounts")).accounts.find((a) => (a.username || "").toLowerCase() === flag("account").toLowerCase());
if (!acc) throw new Error("account not found");
const posts = (await api(`/posts?accountId=${acc._id}&status=published&limit=${flag("posts") || 5}`)).posts ?? [];
for (const p of posts) {
  const ig = (p.platforms || []).find((x) => x.platform === "instagram");
  if (!ig?.platformPostId) continue;
  let cursor = "", all = [];
  do {
    const d = await api(`/inbox/comments/${ig.platformPostId}?accountId=${acc._id}&limit=100${cursor ? "&cursor=" + cursor : ""}`);
    all.push(...(d.comments ?? [])); cursor = d.pagination?.cursor || "";
  } while (cursor);
  console.log(`\n# ${ig.platformPostUrl} (${p.publishedAt || p.scheduledFor}) – ${all.length} comments`);
  for (const c of all) console.log(`@${c.from?.username ?? c.username ?? "?"} | ${(c.text ?? c.message ?? "").replace(/\n/g, " ")} | ${c.createdTime}`);
}
