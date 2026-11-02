#!/usr/bin/env node
// Holt alle Posts (veröffentlicht + geplant) aller Zernio-Accounts und schreibt themen/zernio-posts.md
// (Datum, Account, erste Caption-Zeile, Link). Quelle für den Themen-Abstandscheck (themen/README.md).
//   node scripts/themen-sync.mjs [--since 2026-09-20]
// Key: ZERNIO_API_KEY in broll/.env (oder als Umgebungsvariable).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "../themen/zernio-posts.md");
const envFile = path.join(ROOT, ".env");
const KEY = process.env.ZERNIO_API_KEY || (fs.existsSync(envFile) ? (fs.readFileSync(envFile, "utf8").match(/^ZERNIO_API_KEY=(.+)$/m) || [])[1]?.trim() : "");
if (!KEY) { console.error("ZERNIO_API_KEY fehlt (broll/.env oder Umgebung)"); process.exit(1); }
const args = process.argv.slice(2);
const since = (args[args.indexOf("--since") + 1] && args.includes("--since")) ? args[args.indexOf("--since") + 1] : "2026-09-20";
const BASE = "https://zernio.com/api/v1";
const api = async (p) => {
  const r = await fetch(BASE + p, { headers: { Authorization: `Bearer ${KEY}` } });
  const t = await r.text();
  if (!r.ok) throw new Error(`GET ${p} -> HTTP ${r.status}: ${t.slice(0, 300)}`);
  return JSON.parse(t);
};

const accs = (await api("/accounts")).accounts ?? [];
const rows = [];
for (const acc of accs) {
  for (const status of ["published", "scheduled"]) {
    const seen = new Set();
    for (let page = 1; page <= 50; page++) {
      const d = await api(`/posts?accountId=${acc._id}&status=${status}&limit=100&page=${page}`);
      const posts = d.posts ?? [];
      let fresh = 0;
      for (const p of posts) {
        if (seen.has(p._id)) continue; seen.add(p._id); fresh++;
        const when = (p.publishedAt || p.scheduledFor || p.createdAt || "").slice(0, 16).replace("T", " ");
        if (when && when.slice(0, 10) < since) continue;
        const ig = (p.platforms || []).find((x) => x.platform === "instagram") || (p.platforms || [])[0] || {};
        const first = (p.content || p.caption || "").split("\n").map((s) => s.trim()).find(Boolean) || "";
        rows.push({ when, acc: acc.username || acc.name || acc._id, status, title: first.slice(0, 140).replace(/\|/g, "/"), url: ig.platformPostUrl || "", id: p._id });
      }
      const pg = d.pagination;
      if (!posts.length || !fresh || (pg && (pg.page >= pg.pages || pg.hasMore === false)) || (!pg && posts.length < 100)) break;
    }
  }
}
rows.sort((a, b) => a.when.localeCompare(b.when));
const md = [
  "# Zernio-Posts (automatisch, nicht von Hand bearbeiten)",
  "",
  `Stand: ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · seit ${since} · ${rows.length} Posts · erzeugt von broll/scripts/themen-sync.mjs`,
  "",
  "| Zeit (UTC) | Account | Status | Erste Caption-Zeile | Link |",
  "|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.when} | ${r.acc} | ${r.status} | ${r.title} | ${r.url || r.id} |`),
  "",
].join("\n");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);
console.log(`${rows.length} Posts -> ${OUT}`);
