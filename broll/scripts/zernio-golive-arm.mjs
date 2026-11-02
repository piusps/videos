#!/usr/bin/env node
// Arms the DM funnel the moment a scheduled Zernio post goes live (Pius 2026-10-22: "sorg sofort dafür, dass die
// Automatisierung funktioniert"). Fixes the 2026-10-21 failure: a funnel attached to the Zernio post id is never
// remapped to the Instagram media id, so here the funnel is only created once the IG media id exists.
//
//   1. polls GET /posts/<id> every 15 s until the Instagram platform has a platformPostId (published);
//   2. creates the funnel (zernio-funnel.mjs create) bound to that IG media id;
//   3. switches the automation to publicReplyPolicy "always", so every comment gets the public reply even if the DM fails;
//   4. catches up everyone who commented before the funnel existed (private reply with guide link + public reply);
//   5. watches for --watch minutes: every commenter must get a reply from our account within 3 min, otherwise it replies by hand;
//   6. writes publish.json and prints a summary.
//
//   node scripts/zernio-golive-arm.mjs --post-id <Zernio post id> --run runs/<run> --kind fp --account florent_preusser \
//     --name "FP Funnel <Thema>" --replies runs/<run>/replies.json --pdf runs/<run>/<guide>.pdf [--watch 20]
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/^ZERNIO_API_KEY=(.+)$/m)[1].trim();
const BASE = "https://zernio.com/api/v1";
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const sleep = (ms) => new Promise((s) => setTimeout(s, ms));
const runDir = path.resolve(ROOT, flag("run"));
const LOG = path.join(runDir, "golive.log");
const log = (s) => { const line = `${new Date().toISOString()} ${s}`; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const api = async (method, p, body) => {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(BASE + p, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
      const t = await r.text(); let d; try { d = JSON.parse(t); } catch { d = t; }
      if (!r.ok) throw new Error(`${method} ${p} -> ${r.status} ${typeof d === "string" ? d.slice(0, 300) : JSON.stringify(d).slice(0, 300)}`);
      return d;
    } catch (e) {
      // 2026-10-23: a DNS blip (ENOTFOUND) killed the go-live wait; network errors now retry for ~1 h
      const net = !/ -> \d{3} /.test(e.message);
      // 2026-10-27: a 429 (Zernio rate limit, 600/window) killed the Tag 6 go-live wait; wait it out instead of dying
      const rate = / -> 429 /.test(e.message);
      if ((/-> 4\d\d/.test(e.message) && !rate) || i >= (net || rate ? 120 : 4)) throw e;
      await sleep(rate ? (Number(e.message.match(/"retryAfterSeconds":(\d+)/)?.[1] ?? 30) + 2) * 1000 : net ? 30000 : 5000);
    }
  }
};

const postId = flag("post-id");
const handle = flag("account");
const replies = JSON.parse(fs.readFileSync(path.resolve(ROOT, flag("replies")), "utf8"));
const pubTexts = [replies.commentReply ?? replies.main, ...(replies.commentReplyVariations ?? replies.variations ?? [])];
const watchMin = Number(flag("watch") ?? 20);

// 1. wait for go-live
log(`waiting for post ${postId} to publish`);
let igId = "", accId = "", url = "";
for (;;) {
  const p = (await api("GET", `/posts/${postId}`)).post;
  const pl = (p.platforms || []).find((x) => x.platform === "instagram");
  if (pl?.platformPostId) {
    igId = String(pl.platformPostId); url = pl.platformPostUrl || "";
    accId = typeof pl.accountId === "object" ? pl.accountId._id : pl.accountId;
    break;
  }
  if (p.status === "failed" || pl?.status === "failed") { log(`POST FAILED: ${JSON.stringify(pl?.errorMessage ?? pl ?? p.status)}`); process.exit(2); }
  await sleep(15000);
}
log(`LIVE ig_media_id=${igId} ${url}`);

// 2. funnel bound to the IG media id
// --automation-id <id>: funnel already exists (re-run as a longer safety net), only watch and catch up
let created = Date.now(), res;
if (flag("automation-id")) {
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/registry.json"), "utf8"));
  const e = reg.find((x) => x.automationId === flag("automation-id"));
  res = { automationId: flag("automation-id"), workflowId: e?.workflowId, guideUrl: e?.guideUrl };
  created = 0;
  log(`WATCH ONLY automation=${res.automationId}`);
} else {
  const out = execFileSync(process.execPath, ["scripts/zernio-funnel.mjs", "create", "--kind", flag("kind"), "--account", handle, "--name", flag("name"),
    "--replies", flag("replies"), "--pdf", flag("pdf"), "--platform-post-id", igId], { cwd: ROOT, encoding: "utf8" });
  res = JSON.parse(out.trim().split("\n").filter((l) => l.startsWith("{")).pop());
  log(`FUNNEL ${flag("name")} workflow=${res.workflowId} automation=${res.automationId} active=${res.automationActive}`);
}

// 3. public reply on every comment, not only after a successful DM
try {
  await api("PATCH", `/comment-automations/${res.automationId}`, { publicReplyPolicy: "always" });
  log("publicReplyPolicy=always");
} catch (e) { log(`publicReplyPolicy patch failed (stays after_dm): ${e.message}`); }
const auto = await api("GET", `/comment-automations/${res.automationId}`).catch(() => null);
const a = auto?.automation ?? auto ?? {};
log(`automation check: platformPostId=${a.platformPostId} active=${a.isActive} policy=${a.publicReplyPolicy}`);
if (String(a.platformPostId) !== igId) {
  await api("PATCH", `/comment-automations/${res.automationId}`, { platformPostId: igId });
  log(`REBOUND automation to ${igId}`);
}

if (created) {
  const pj = path.join(runDir, "publish.json");
  const pub = fs.existsSync(pj) ? JSON.parse(fs.readFileSync(pj, "utf8")) : {};
  Object.assign(pub, { account: handle, via: "Zernio", zernio_post_id: postId, status: "published", ig_media_id: igId, url,
    funnel: { name: flag("name"), kind: flag("kind"), workflowId: res.workflowId, automationId: res.automationId, active: true, attachedTo: `IG media id ${igId}`, created: new Date(created).toISOString(), by: "zernio-golive-arm" } });
  fs.writeFileSync(pj, JSON.stringify(pub, null, 1));
}

// 4./5. catch up commenters the automation did not handle
const handled = new Set();
let n = 0;
const comments = async () => {
  const all = []; let cursor = "";
  do {
    const d = await api("GET", `/inbox/comments/${igId}?accountId=${accId}&limit=100${cursor ? "&cursor=" + cursor : ""}`);
    all.push(...(d.comments ?? [])); cursor = d.pagination?.cursor || "";
  } while (cursor);
  return all.sort((x, y) => (x.createdTime > y.createdTime ? 1 : -1));
};
const byHand = async (c, who) => {
  try {
    await api("POST", `/inbox/comments/${igId}/${c.id}/private-reply`, { accountId: accId, message: `Hey, hier sind die Prompts zu deinem Kommentar: ${res.guideUrl}\n\nWenn was unklar ist, schreib mir einfach hier.` });
  } catch (e) { log(`  DM to ${who} failed: ${String(e.message).slice(0, 160)}`); }
  try {
    await api("POST", `/inbox/comments/${igId}`, { accountId: accId, commentId: c.id, message: pubTexts[n++ % pubTexts.length] });
    log(`  replied by hand to ${who} (${c.id})`);
  } catch (e) { log(`  public reply to ${who} failed: ${String(e.message).slice(0, 160)}`); }
};

const end = Date.now() + watchMin * 60000;
let firstPass = true;
while (firstPass || Date.now() < end) {
  const cs = await comments().catch((e) => { log(`comments fetch failed: ${e.message}`); return []; });
  // ground truth: a top-level comment counts as answered once it has a reply from our account
  const answeredUsers = new Set();
  for (const c of cs) if ((c.replies || []).some((r) => r.from?.isOwner)) answeredUsers.add(String(c.from?.username || "").toLowerCase());
  for (const c of cs) {
    const who = String(c.from?.username || c.from?.id || "").toLowerCase();
    if (!who || c.from?.isOwner || who === handle.toLowerCase() || handled.has(who)) continue;
    if (answeredUsers.has(who)) { handled.add(who); log(`  answered: ${who}`); continue; }
    const t = new Date(c.createdTime).getTime();
    // before the funnel existed: catch up at once; afterwards give the automation 3 minutes
    if (t < created || Date.now() - t > 180000) { handled.add(who); await byHand(c, who); await sleep(1500); }
  }
  firstPass = false;
  if (Date.now() < end) await sleep(60000);
}
const fin = (await api("GET", `/comment-automations/${res.automationId}`).catch(() => ({}))).automation ?? {};
log(`SUMMARY ig=${igId} commenters=${handled.size} automationStats=${JSON.stringify(fin.stats ?? {})} active=${fin.isActive} bound=${fin.platformPostId}`);
