#!/usr/bin/env node
// Zernio: public comment replies for vote posts (pickthecompany series). One ACCOUNT-WIDE automation per option
// (Zernio allows only one automation per post, but unlimited stacked account-wide ones). Every episode re-runs
// `create` with its new replies.json: existing "Vote · A"/"Vote · B" automations get patched, not duplicated.
// Note: account-wide = also fires on older posts of the account (5 newest are polled).
// a comment voting "A" gets an A-flavoured reply, "B" a B-flavoured one. Comments naming both options get none.
// Public reply only: Instagram requires a dmMessage, so the audience rule (minFollowerCount far out of reach,
// whenUnknown=skip) makes sure the DM never goes out, and publicReplyPolicy=always posts the reply anyway.
//
//   node scripts/zernio-vote-replies.mjs create --account pickthecompany --config <replies.json>
//   node scripts/zernio-vote-replies.mjs post <Zernio post id>      status + platform post id of a post
//
// replies.json: { "A": { "keywords": ["A", "Option A", "Team A"], "replies": ["…", …up to 6] }, "B": { … } }
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

const cmd = args[0];
if (cmd === "post") {
  const p = (await api("GET", `/posts/${args[1]}`)).post;
  console.log(JSON.stringify({ status: p.status, platforms: (p.platforms || []).map((x) => ({ platform: x.platform, status: x.status, platformPostId: x.platformPostId, url: x.platformPostUrl })) }, null, 1));
} else if (cmd === "create") {
  const cfg = JSON.parse(fs.readFileSync(path.resolve(ROOT, flag("config")), "utf8"));
  const accs = (await api("GET", "/accounts")).accounts;
  const acc = accs.find((a) => (a.username || "").toLowerCase() === flag("account").toLowerCase() || a._id === flag("account"));
  if (!acc) throw new Error(`Account ${flag("account")} nicht in Zernio verbunden`);
  const profileId = acc.profileId?._id ?? acc.profileId;
  const existing = ((await api("GET", "/comment-automations")).automations ?? []).filter((a) => (a.accountId?._id ?? a.accountId) === acc._id);
  const keys = Object.keys(cfg);
  for (const k of keys) {
    const o = cfg[k];
    const others = keys.filter((x) => x !== k).flatMap((x) => cfg[x].keywords);
    const [first, ...rest] = o.replies;
    const body = {
      profileId, accountId: acc._id, name: `Vote · ${k}`, trigger: "comment",
      keywords: o.keywords, matchMode: "word", excludeKeywords: others,
      dmMessage: "Deine Stimme ist gezählt.", // required by Zernio on Instagram, never sent (audience below)
      audience: { followerStatus: "any", minFollowerCount: 1000000000, whenUnknown: "skip" },
      commentReply: first, commentReplyVariations: rest.slice(0, 5),
      publicReplyPolicy: "always", repeatPolicy: { mode: "every_comment", cooldownHours: 12 },
    };
    const old = existing.find((a) => a.name === body.name);
    const res = old
      ? await api("PATCH", `/comment-automations/${old._id ?? old.id}`, (({ profileId, accountId, trigger, ...rest }) => ({ ...rest, isActive: true }))(body))
      : await api("POST", "/comment-automations", body);
    const a = res.automation ?? res;
    console.log(JSON.stringify({ option: k, automationId: a._id ?? a.id, active: a.isActive, mode: old ? "aktualisiert" : "neu", scope: "account-wide" }));
  }
} else {
  console.error("Befehl: create | post");
  process.exit(1);
}
