#!/usr/bin/env node
// Auto-funnel for all three Instagram accounts (Henri 2026-10-21: "mach das immer automatisch nach jedem upload
// auf allen 3 kanälen"). Emergency tool, run by hand: normally zernio-schedule.mjs attaches the funnel at scheduling time.
//
// For every post published in the last 3 days on florent_preusser, florentgpt and moustacherecruiter:
//   1. skip it if any active comment automation already sits on the post (registry funnel or older simple automation);
//   2. find its run folder (publish.json with the Zernio post id), skip satire formats (FP-S, GPT-S: no guide);
//   3. create the funnel (zernio-funnel.mjs create --kind fp|gpt|bx-guide) with the run's guide PDF and replies.json;
//   4. catch up everyone who commented before the funnel existed: one private reply with the guide link (plain text,
//      no buttons, so non-followers get it too) and a public reply under the comment.
// Results go to funnel/autofunnel.log and into the run's publish.json ("funnel", "catchup").
//
//   node scripts/zernio-autofunnel.mjs            do it
//   node scripts/zernio-autofunnel.mjs --dry      only report what it would do
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^ZERNIO_API_KEY=(.+)$/m)[1].trim();
const BASE = "https://zernio.com/api/v1";
const DRY = process.argv.includes("--dry");
const LOG = path.join(ROOT, "funnel/autofunnel.log");
const log = (s) => { const line = `${new Date().toISOString()} ${s}`; console.log(line); if (!DRY) fs.appendFileSync(LOG, line + "\n"); };
const api = async (method, p, body) => {
  const r = await fetch(BASE + p, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let d; try { d = JSON.parse(t); } catch { d = t; }
  if (!r.ok) throw new Error(`${method} ${p} -> ${r.status} ${typeof d === "string" ? d.slice(0, 200) : JSON.stringify(d).slice(0, 200)}`);
  return d;
};
const sleep = (ms) => new Promise((s) => setTimeout(s, ms));

const ACCOUNTS = {
  florent_preusser: { lang: "de" },
  florentgpt: { lang: "de" },
  moustacherecruiter: { lang: "en" },
};
const TEXT = {
  de: {
    dm: (u) => `Hey, hier ist der Guide zu deinem Kommentar: ${u}\n\nWenn was unklar ist, schreib mir einfach hier.`,
    pub: ["Hab dir den Guide geschickt, liegt jetzt in deinen DMs.", "Ist raus. Schau mal in deine DMs, da liegt der Guide.", "Hab ihn dir eben geschickt. Liegt in deinen DMs.", "Guide ist jetzt bei dir in den DMs.", "Hab's dir geschickt, schau in deine DMs."],
  },
  en: {
    dm: (u) => `Hey, here's the guide you asked for: ${u}\n\nAny questions, just reply here.`,
    pub: ["Sent it over, check your DMs.", "Just sent you the guide, it's in your DMs.", "It's in your DMs now.", "Sent. Have a look in your DMs."],
  },
};

// run folders by Zernio post id
const runs = new Map();
for (const d of fs.readdirSync(path.join(ROOT, "runs"))) {
  const pj = path.join(ROOT, "runs", d, "publish.json");
  if (!fs.existsSync(pj)) continue;
  try {
    const j = JSON.parse(fs.readFileSync(pj, "utf8"));
    for (const id of [j.zernio_post_id, j.zernioPostId, j.ig_media_id].filter(Boolean)) runs.set(String(id), d);
  } catch {}
}

const accs = (await api("GET", "/accounts")).accounts;
const autos = (await api("GET", "/comment-automations?limit=200")).automations ?? [];
const covered = new Set(autos.filter((a) => a.isActive).map((a) => String(a.platformPostId)));
const since = Date.now() - 3 * 24 * 3600 * 1000;
const posts = (await api("GET", "/posts?status=published&limit=40")).posts ?? [];

let worked = 0;
for (const p of posts) {
  if (new Date(p.publishedAt || p.scheduledFor).getTime() < since) continue;
  for (const pl of p.platforms || []) {
    const accId = typeof pl.accountId === "object" ? pl.accountId._id : pl.accountId;
    const acc = accs.find((a) => a._id === accId);
    const handle = (acc?.username || "").toLowerCase();
    if (!ACCOUNTS[handle] || pl.platform !== "instagram") continue;
    const igId = String(pl.platformPostId || "");
    if (!igId || covered.has(igId)) continue;
    const run = runs.get(String(p._id)) || runs.get(igId);
    const label = `${handle} ${igId} "${(p.content || "").slice(0, 40).replace(/\n/g, " ")}"`;
    if (!run) { log(`SKIP no run folder for ${label}`); continue; }
    const dir = path.join(ROOT, "runs", run);
    const fmt = fs.existsSync(path.join(dir, "format.json")) ? JSON.parse(fs.readFileSync(path.join(dir, "format.json"), "utf8")) : {};
    const format = fmt.format || "";
    if (/-S$/.test(format)) continue; // satire: no guide, no funnel
    const kind = format === "FP-N" ? "fp2" : format === "GPT-N" ? "gpt" : format.startsWith("BX") ? (fmt.funnel || "bx-guide") : null;
    const pdf = fs.readdirSync(dir).find((f) => f.endsWith(".pdf") && /guide/i.test(f));
    const replies = fs.existsSync(path.join(dir, "replies.json")) ? path.join("runs", run, "replies.json") : null;
    if (!kind || !pdf || !replies) { log(`SKIP ${label} run=${run} kind=${kind} pdf=${pdf || "-"} replies=${replies ? "ok" : "-"}`); continue; }
    if (DRY) { log(`WOULD create ${kind} funnel for ${label} run=${run}`); continue; }

    const prefix = kind === "fp" || kind === "fp2" ? "FP Funnel" : kind === "gpt" ? "GPT Funnel" : kind === "bx" ? "BX Funnel" : "BX Guide";
    const name = `${prefix} ${run.replace(/^(fpn|gpts?|bx)-/, "")}`;
    const created = Date.now();
    const out = execFileSync(process.execPath, ["scripts/zernio-funnel.mjs", "create", "--kind", kind, "--account", handle, "--name", name, "--replies", replies, "--pdf", path.join("runs", run, pdf), "--platform-post-id", igId], { cwd: ROOT, encoding: "utf8" });
    const res = JSON.parse(out.trim().split("\n").filter((l) => l.startsWith("{")).pop());
    log(`CREATED ${name} on ${label} workflow=${res.workflowId} automation=${res.automationId}`);
    covered.add(igId);

    // catch up comments written before the funnel existed
    const T = TEXT[ACCOUNTS[handle].lang];
    let cursor = "", comments = [];
    do {
      const d = await api("GET", `/inbox/comments/${igId}?accountId=${accId}&limit=100${cursor ? "&cursor=" + cursor : ""}`);
      comments.push(...(d.comments ?? []));
      cursor = d.pagination?.cursor || "";
    } while (cursor);
    const seen = new Set(); let dm = 0, pub = 0, fail = 0;
    for (const c of comments.sort((a, b) => (a.createdTime > b.createdTime ? 1 : -1))) {
      const who = (c.from?.username || c.from?.id || "").toLowerCase();
      if (!who || who === handle || seen.has(who) || new Date(c.createdTime).getTime() > created) continue;
      seen.add(who);
      try {
        await api("POST", `/inbox/comments/${igId}/${c.id}/private-reply`, { accountId: accId, message: T.dm(res.guideUrl) });
        dm++;
        await api("POST", `/inbox/comments/${igId}`, { accountId: accId, commentId: c.id, message: T.pub[(dm - 1) % T.pub.length] });
        pub++;
      } catch (e) { fail++; log(`  catch-up failed on comment ${c.id}: ${String(e.message).slice(0, 160)}`); }
      await sleep(1500);
    }
    log(`  catch-up ${label}: ${dm} DMs, ${pub} public replies, ${fail} failed`);

    const pj = path.join(dir, "publish.json");
    const j = JSON.parse(fs.readFileSync(pj, "utf8"));
    j.ig_media_id = igId;
    j.funnel = { name, kind, workflowId: res.workflowId, automationId: res.automationId, active: true, created: new Date(created).toISOString(), by: "zernio-autofunnel" };
    j.catchup = `${dm} private replies with guide link, ${pub} public replies, ${fail} failed`;
    fs.writeFileSync(pj, JSON.stringify(j, null, 1));
    worked++;
  }
}
if (DRY || worked) log(`done, ${worked} post(s) handled`);
