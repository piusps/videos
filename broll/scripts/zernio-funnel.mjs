// Zernio DM funnels for Instagram (replace the InstantDM Lead-Gen flows; Pius 2026-10-19, rebuilt 2026-10-20).
//
// Per post there are two pieces:
//   1. a comment automation on the post (all comments): public reply (rotating variations) + private reply
//      "welcome" with one postback button that hands the conversation to the workflow;
//   2. a workflow that only starts from that tap (inbound_message trigger with an unused keyword):
//      soft follow check -> guide button -> (fp) waitlist pitch + lead capture, (bx) boilr bridge + questions -> demo link,
//      (fpq) solo/team/employed/private question -> own pitch + waitlist, private exits, (gpt, bx-guide) guide only.
// This is Zernio's documented "comment automation -> workflow" pattern. A comment-triggered workflow cannot post
// public replies and its private reply must not carry buttons for non-followers, so we do not use that trigger.
//
//   node scripts/zernio-funnel.mjs create --kind fp|fpq|bx|gpt|bx-guide --account <handle> --name "FP Funnel <Thema>" \
//     --replies runs/<run>/replies.json --pdf runs/<run>/<x>.pdf --platform-post-id <IG media id> [--inactive] [--config <json>]
//     (--inactive: the comment automation is created paused; default config funnel/<kind>-funnel.json)
//   node scripts/zernio-funnel.mjs create ... --test-keyword FUNNELTEST   workflow only, starts on that DM text
//   node scripts/zernio-funnel.mjs credits --account florent_preusser   fp2 keyword workflow: DM "Credits" -> lead capture (once per account)
//   node scripts/zernio-funnel.mjs migrate [--dry]                      old fp/fpq posts -> new fp2 workflow (welcome button repointed)
//   node scripts/zernio-funnel.mjs rollback <name or IG media id> | --all   button back to the old workflow
//   node scripts/zernio-funnel.mjs list                                 workflows
//   node scripts/zernio-funnel.mjs posts                                registry: post -> workflow + automation
//   node scripts/zernio-funnel.mjs on|off <name or IG media id> ... | --all   activate / pause the comment automation(s)
//   node scripts/zernio-funnel.mjs activate|pause|delete <workflowId>
//   node scripts/zernio-funnel.mjs runs <workflowId>                    executions + last events
//   node scripts/zernio-funnel.mjs leads [--out funnel/leads.csv]       contacts tagged superkind-lead -> CSV (count only)
//   node scripts/zernio-funnel.mjs bx-leads [--out funnel/bx-leads.csv] Felix funnel answers -> CSV (count only)
// replies.json: { "commentReply": "...", "commentReplyVariations": ["...", ...] }
// Only one active comment automation per post: pause the old simple one (zernio-automation.mjs pause) first.
import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { EMAIL_FORMAT, EMAIL_FREE, EMAIL_ROLE, EMAIL_FAKE_DOMAIN, PHONE_VALID, PHONE_FAKE, SITE_DOMAIN, SITE_FREE } from "../funnel/rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const envVal = (k) => (ENV.match(new RegExp(`^${k}=(.+)$`, "m")) || [])[1]?.trim();
const KEY = envVal("ZERNIO_API_KEY");
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
const has = (n) => args.includes(`--${n}`);
const REGISTRY = path.join(ROOT, "funnel/registry.json");
const registry = () => (fs.existsSync(REGISTRY) ? JSON.parse(fs.readFileSync(REGISTRY, "utf8")) : []);
const saveRegistry = (r) => fs.writeFileSync(REGISTRY, JSON.stringify(r, null, 1));

const uploadPdf = async (file) => {
  const abs = path.resolve(ROOT, file);
  const buf = fs.readFileSync(abs);
  const pre = await api("POST", "/media/presign", { filename: path.basename(abs), contentType: "application/pdf", size: buf.length });
  const put = await fetch(pre.uploadUrl, { method: "PUT", headers: { "Content-Type": "application/pdf" }, body: buf });
  if (!put.ok) throw new Error(`PDF-Upload fehlgeschlagen: HTTP ${put.status}`);
  return pre.publicUrl;
};
const account = async (want) => {
  const accs = (await api("GET", "/accounts")).accounts;
  const acc = accs.find((a) => a._id === want || (a.username || "").toLowerCase() === String(want).toLowerCase());
  if (!acc) throw new Error(`Account ${want} nicht in Zernio verbunden`);
  return { acc, profileId: acc.profileId?._id ?? acc.profileId };
};

// ---------- graph helpers ----------
const graph = () => {
  const nodes = [], edges = [];
  const node = (id, type, config = {}) => { nodes.push({ id, type, config }); return id; };
  const edge = (source, target, sourceHandle = null) => edges.push({ id: `e${edges.length + 1}`, source, target, sourceHandle });
  // Postback buttons without payload answer this workflow's pending wait_for_reply; we branch on postback.title.
  const text = (id, txt, buttons) => node(id, "send_message", { messageType: "text", text: txt, ...(buttons ? { buttons } : {}) });
  const wait = (id, saveAs, minutes) => node(id, "wait_for_reply", { timeoutMinutes: minutes, saveAs });
  const tap = (title) => ({ type: "postback", title });
  const link = (title, url) => ({ type: "url", title, url });
  return { nodes, edges, node, edge, text, wait, tap, link };
};

// Lead list check: tag from any FP funnel, or a business mail saved on the contact. Zernio keeps the contact as it was
// at run start (tested 2026-10-26), so a run already waiting only sees list members by their Instagram id, which
// `rebuild` bakes in from all contacts tagged superkind-lead (t.knownIds). knownEdges() wires every "known" handle.
// Instagram ids of every contact tagged as lead (list members from the website / InstantDM get the tag via list sync).
// funnel/known-ids.json: list members whose chat has no Zernio contact (InstantDM era), found by mail/phone in their DMs.
const leadIds = async (tag) => {
  const extra = path.join(ROOT, "funnel/known-ids.json");
  const ids = fs.existsSync(extra) ? Object.keys(JSON.parse(fs.readFileSync(extra, "utf8"))) : [];
  for (let skip = 0; ; skip += 100) {
    const d = await api("GET", `/contacts?limit=100&skip=${skip}`);
    for (const c of d.contacts) if ((c.tags ?? []).includes(tag) && /^\d+$/.test(c.platformIdentifier ?? "")) ids.push(c.platformIdentifier);
    if (!d.pagination?.hasMore) return [...new Set(ids)];
  }
};
const knownEdges = (g, t, id, target) => { for (const h of ["lead_tag", "lead_mail", ...(t.knownIds?.length ? ["lead_id"] : [])]) g.edge(id, target, h); };
const knownLead = (g, t, id) => g.node(id, "condition", { rules: [
  { id: "lead_tag", variable: "contact.tags", operator: "has_tag", value: t.leadTag },
  { id: "lead_mail", variable: "contact.fields.lead_email", operator: "matches", value: "@" },
  ...(t.knownIds?.length ? [{ id: "lead_id", variable: "contact.handle", operator: "matches", value: `\\((${t.knownIds.join("|")})\\)` }] : []),
] });
// Shared start: soft follow check -> guide. Ends at node "guide_done".
const followAndGuide = (g, t, guideUrl, guideTag) => {
  g.node("c_follow", "condition", { rules: [{ id: "follows", variable: "contact.isFollower", operator: "is_true" }] });
  g.text("gate", t.gate, [g.link(t.gateProfileButton, t.profileUrl), g.tap(t.gateDoneButton)]);
  g.wait("w_gate", "tap_gate", 720);
  g.text("guide", t.guide, [g.link(t.guideButton, guideUrl)]);
  g.node("guide_done", "add_tag", { tag: guideTag });
  // fp3 (Pius 2026-10-26): people already on the lead list get the guide with its own text and nothing after it
  // (no voice note, no pitch). The caller adds the "end" node.
  const first = t.guideKnown ? "c_known" : "guide";
  if (t.guideKnown) {
    knownLead(g, t, "c_known");
    g.text("guide_known", t.guideKnown, [g.link(t.guideButton, guideUrl)]); g.node("known_done", "add_tag", { tag: guideTag });
    knownEdges(g, t, "c_known", "guide_known"); g.edge("c_known", "guide", "default");
    g.edge("guide_known", "known_done"); g.edge("known_done", "end");
  }
  g.edge("trigger", "c_follow");
  g.edge("c_follow", first, "follows"); g.edge("c_follow", "gate", "default");
  g.edge("gate", "w_gate"); g.edge("w_gate", first, "reply"); g.edge("w_gate", first, "timeout");
  g.edge("guide", "guide_done");
};

const buildFp = (t, { guideUrl, trigger, webhookUrl, flowName }) => {
  const g = graph();
  g.node("trigger", "trigger", trigger);
  followAndGuide(g, t, guideUrl, "guide-erhalten");
  g.node("delay", "delay", { delayMinutes: t.pitchDelayMinutes ?? 1 });
  g.text("pitch", t.pitch, [g.tap(t.pitchYes), g.tap(t.pitchNo)]);
  g.wait("w_pitch", "pitch_answer", 4320);
  g.node("c_pitch", "condition", { rules: [
    { id: "yes_tap", variable: "postback.title", operator: "equals", value: t.pitchYes },
    { id: "no_tap", variable: "postback.title", operator: "equals", value: t.pitchNo },
    { id: "yes_text", variable: "inboundText", operator: "matches", value: "^\\s*(ja|jo|jap|klar|gerne|gern|yes|bitte)\\b" },
  ] });
  g.text("bye", t.bye);
  g.text("ask_name", t.askName); g.wait("w_name", "lead_name", 1440); g.node("f_name", "set_field", { field: "lead_name", value: "{{lead_name}}" });
  g.text("ask_company", t.askCompany); g.wait("w_company", "lead_company", 1440); g.node("f_company", "set_field", { field: "lead_company", value: "{{lead_company}}" });
  g.text("ask_email", t.askEmail); g.wait("w_email", "lead_email", 1440);
  g.node("c_email", "condition", { rules: [
    { id: "free", variable: "lead_email", operator: "matches", value: EMAIL_FREE },
    { id: "role", variable: "lead_email", operator: "matches", value: EMAIL_ROLE },
    { id: "fake", variable: "lead_email", operator: "matches", value: EMAIL_FAKE_DOMAIN },
    { id: "ok", variable: "lead_email", operator: "matches", value: EMAIL_FORMAT },
  ] });
  g.text("free_email", t.freeEmail); g.text("role_email", t.roleEmail); g.text("fake_email", t.fakeEmail);
  g.text("bad_email", t.badEmail); g.node("f_email", "set_field", { field: "lead_email", value: "{{lead_email}}" });
  g.text("ask_phone", t.askPhone); g.wait("w_phone", "lead_phone", 1440);
  g.node("c_phone", "condition", { rules: [
    { id: "fake", variable: "lead_phone", operator: "matches", value: PHONE_FAKE },
    { id: "ok", variable: "lead_phone", operator: "matches", value: PHONE_VALID },
  ] });
  g.text("fake_phone", t.fakePhone);
  g.text("bad_phone", t.badPhone); g.node("f_phone", "set_field", { field: "lead_phone", value: "{{lead_phone}}" });
  g.node("tag_lead", "add_tag", { tag: t.leadTag });
  g.text("done", t.done);
  g.node("end", "end");

  g.edge("guide_done", "delay"); g.edge("delay", "pitch"); g.edge("pitch", "w_pitch");
  g.edge("w_pitch", "c_pitch", "reply"); g.edge("w_pitch", "end", "timeout");
  g.edge("c_pitch", "ask_name", "yes_tap"); g.edge("c_pitch", "ask_name", "yes_text"); g.edge("c_pitch", "bye", "no_tap"); g.edge("c_pitch", "bye", "default");
  g.edge("bye", "end");
  g.edge("ask_name", "w_name"); g.edge("w_name", "f_name", "reply"); g.edge("w_name", "end", "timeout"); g.edge("f_name", "ask_company");
  g.edge("ask_company", "w_company"); g.edge("w_company", "f_company", "reply"); g.edge("w_company", "end", "timeout"); g.edge("f_company", "ask_email");
  g.edge("ask_email", "w_email"); g.edge("w_email", "c_email", "reply"); g.edge("w_email", "end", "timeout");
  g.edge("c_email", "f_email", "ok"); g.edge("c_email", "bad_email", "default"); g.edge("bad_email", "w_email");
  g.edge("c_email", "free_email", "free"); g.edge("free_email", "w_email"); g.edge("c_email", "role_email", "role"); g.edge("role_email", "w_email"); g.edge("c_email", "fake_email", "fake"); g.edge("fake_email", "w_email");
  g.edge("f_email", "ask_phone"); g.edge("ask_phone", "w_phone"); g.edge("w_phone", "c_phone", "reply"); g.edge("w_phone", "tag_lead", "timeout");
  g.edge("c_phone", "f_phone", "ok"); g.edge("c_phone", "bad_phone", "default"); g.edge("bad_phone", "w_phone");
  g.edge("c_phone", "fake_phone", "fake"); g.edge("fake_phone", "w_phone");
  g.edge("f_phone", "tag_lead");
  if (webhookUrl) {
    const body = JSON.stringify({ event: "flow_completed", data: { flow_name: flowName, sender_username: "{{contact.handle}}", response_variables: { name: "{{lead_name}}", company: "{{lead_company}}", email: "{{lead_email}}", phone: "{{lead_phone}}" } } });
    g.node("hook", "webhook", { url: webhookUrl, method: "POST", headers: { "Content-Type": "application/json" }, bodyTemplate: body, saveAs: "hook" });
    g.edge("tag_lead", "hook"); g.edge("hook", "done", "success"); g.edge("hook", "done", "error");
  } else {
    g.edge("tag_lead", "done");
  }
  g.edge("done", "end");
  return g;
};

// Qualifying funnel @florent_preusser (Pius 2026-10-22): guide -> one tap question ->
// (solo, team, employed) own pitch -> waitlist form, (private) friendly exit. The pitch answer is saved per segment
// (pitch_solo / pitch_team / pitch_emp) so zernio-leads-sync.mjs can write the type into the sheet.
// Solo accepts any real mail (Gmail, info@), team and employed need a personal business mail.
// Every unanswered question gets one reminder after 20 h, still inside Instagram's 24 h window.
// Zernio's "matches" is case-sensitive: turn letters into [xX] classes (escapes like \\b, \\w stay as they are).
const ci = (re) => re.replace(/\\.|\p{L}/gu, (c) => (c.length > 1 || c.toLowerCase() === c.toUpperCase() ? c : `[${c.toLowerCase()}${c.toUpperCase()}]`));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const buildFpq = (t, { guideUrl, trigger, webhookUrl, flowName }) => {
  const g = graph();
  const REMIND = 1200;
  const quick = (id, txt, titles) => g.node(id, "send_message", { messageType: "text", text: txt, quickReplies: titles.map((title) => ({ title })) });
  g.node("trigger", "trigger", trigger);
  followAndGuide(g, t, guideUrl, "guide-erhalten");
  g.node("end", "end");

  // Segment: tap or free text, reminder once. Unclear free text goes to the employed path (still a waitlist pitch).
  const segs = [t.segSolo, t.segTeam, t.segEmp, t.segPriv];
  const rule = (id, title, re) => ({ id, variable: "inboundText", operator: "matches", value: `^\\s*${esc(title)}|${ci(re)}` });
  g.node("delay", "delay", { delayMinutes: t.segmentDelayMinutes ?? 1 });
  quick("segment", t.segment, segs); g.wait("w_seg", "segment_answer", REMIND);
  quick("seg_remind", t.segmentReminder, segs); g.wait("w_seg2", "segment_answer", REMIND);
  g.node("c_seg", "condition", { rules: [
    rule("priv", t.segPriv, t.privRegex), rule("emp", t.segEmp, t.empRegex), rule("solo", t.segSolo, t.soloRegex), rule("team", t.segTeam, t.teamRegex),
  ] });
  g.edge("guide_done", "delay"); g.edge("delay", "segment"); g.edge("segment", "w_seg");
  g.edge("w_seg", "c_seg", "reply"); g.edge("w_seg", "seg_remind", "timeout");
  g.edge("seg_remind", "w_seg2"); g.edge("w_seg2", "c_seg", "reply"); g.edge("w_seg2", "end", "timeout");

  g.node("tag_priv", "add_tag", { tag: t.privTag });
  g.text("priv", t.priv);
  g.edge("c_seg", "tag_priv", "priv"); g.edge("tag_priv", "priv"); g.edge("priv", "end");
  g.text("bye", t.bye); g.edge("bye", "end");

  // Question with one reminder: ask -> wait (-> remind -> wait) -> next.
  const step = (id, txt, saveAs, next, remindTxt = t.formReminder, ask = () => g.text(`ask_${id}`, txt)) => {
    ask(); g.wait(`w_${id}`, saveAs, REMIND);
    g.text(`r_${id}`, remindTxt); g.wait(`w2_${id}`, saveAs, REMIND);
    g.edge(`ask_${id}`, `w_${id}`); g.edge(`w_${id}`, next, "reply"); g.edge(`w_${id}`, `r_${id}`, "timeout");
    g.edge(`r_${id}`, `w2_${id}`); g.edge(`w2_${id}`, next, "reply"); g.edge(`w2_${id}`, "end", "timeout");
  };
  const emailRules = (strict) => ({ rules: [
    ...(strict ? [{ id: "free", variable: "lead_email", operator: "matches", value: EMAIL_FREE }, { id: "role", variable: "lead_email", operator: "matches", value: EMAIL_ROLE }] : []),
    { id: "fake", variable: "lead_email", operator: "matches", value: EMAIL_FAKE_DOMAIN },
    { id: "ok", variable: "lead_email", operator: "matches", value: EMAIL_FORMAT },
  ] });

  // One pitch + name + company per segment; team and employed share the strict mail step, solo has its own.
  for (const [k, pitch, yes, remind, askName, askCompany, mail] of [
    ["solo", t.soloPitch, t.meYes, t.meReminder, t.askNameSolo, t.askCompanySolo, "mail_solo"],
    ["team", t.teamPitch, t.usYes, t.teamReminder, t.askNameTeam, t.askCompanyTeam, "mail_biz"],
    ["emp", t.empPitch, t.meYes, t.meReminder, t.askNameEmp, t.askCompanyEmp, "mail_biz"],
  ]) {
    g.text(`pitch_${k}`, pitch, [g.tap(yes), g.tap(t.no)]); g.wait(`w_pitch_${k}`, `pitch_${k}`, REMIND);
    g.text(`r_pitch_${k}`, remind, [g.tap(yes), g.tap(t.no)]); g.wait(`w2_pitch_${k}`, `pitch_${k}`, REMIND);
    g.node(`c_pitch_${k}`, "condition", { rules: [
      { id: "yes_tap", variable: "postback.title", operator: "equals", value: yes },
      { id: "no_tap", variable: "postback.title", operator: "equals", value: t.no },
      { id: "yes_text", variable: "inboundText", operator: "matches", value: ci(t.yesRegex) },
    ] });
    g.edge("c_seg", `pitch_${k}`, k);
    g.edge(`pitch_${k}`, `w_pitch_${k}`); g.edge(`w_pitch_${k}`, `c_pitch_${k}`, "reply"); g.edge(`w_pitch_${k}`, `r_pitch_${k}`, "timeout");
    g.edge(`r_pitch_${k}`, `w2_pitch_${k}`); g.edge(`w2_pitch_${k}`, `c_pitch_${k}`, "reply"); g.edge(`w2_pitch_${k}`, "end", "timeout");
    g.edge(`c_pitch_${k}`, `ask_name_${k}`, "yes_tap"); g.edge(`c_pitch_${k}`, `ask_name_${k}`, "yes_text");
    g.edge(`c_pitch_${k}`, "bye", "no_tap"); g.edge(`c_pitch_${k}`, "bye", "default");
    g.node(`f_name_${k}`, "set_field", { field: "lead_name", value: "{{lead_name}}" });
    g.node(`f_company_${k}`, "set_field", { field: "lead_company", value: "{{lead_company}}" });
    step(`name_${k}`, askName, "lead_name", `f_name_${k}`); g.edge(`f_name_${k}`, `ask_company_${k}`);
    step(`company_${k}`, askCompany, "lead_company", `f_company_${k}`); g.edge(`f_company_${k}`, `ask_${mail}`);
  }
  g.edge("c_seg", "pitch_emp", "default");

  for (const [k, strict, msgs] of [
    ["mail_biz", true, [["free", t.freeEmail], ["role", t.roleEmail], ["fake", t.fakeEmail], ["bad", t.badEmail]]],
    ["mail_solo", false, [["fake", t.fakeEmailSolo], ["bad", t.badEmailSolo]]],
  ]) {
    step(k, strict ? t.askEmail : t.askEmailSolo, "lead_email", `c_${k}`);
    g.node(`c_${k}`, "condition", emailRules(strict));
    for (const [id, txt] of msgs) { g.text(`${k}_${id}`, txt); g.edge(`c_${k}`, `${k}_${id}`, id === "bad" ? "default" : id); g.edge(`${k}_${id}`, `w_${k}`); }
    g.node(`f_${k}`, "set_field", { field: "lead_email", value: "{{lead_email}}" });
    g.edge(`c_${k}`, `f_${k}`, "ok");
  }

  // Phone is optional: skip tap or timeout still makes a lead.
  quick("ask_phone", t.askPhone, [t.phoneSkip]); g.wait("w_phone", "lead_phone", REMIND);
  g.node("c_phone", "condition", { rules: [
    { id: "skip", variable: "lead_phone", operator: "matches", value: ci(t.phoneSkipRegex) },
    { id: "fake", variable: "lead_phone", operator: "matches", value: PHONE_FAKE },
    { id: "ok", variable: "lead_phone", operator: "matches", value: PHONE_VALID },
  ] });
  g.text("fake_phone", t.fakePhone); g.text("bad_phone", t.badPhone);
  g.node("f_phone", "set_field", { field: "lead_phone", value: "{{lead_phone}}" });
  g.node("f_nophone", "set_field", { field: "lead_phone", value: "" });
  g.node("tag_lead", "add_tag", { tag: t.leadTag });
  g.text("done", t.done);
  g.edge("f_mail_solo", "ask_phone"); g.edge("f_mail_biz", "ask_phone"); g.edge("ask_phone", "w_phone");
  g.edge("w_phone", "c_phone", "reply"); g.edge("w_phone", "f_nophone", "timeout");
  g.edge("c_phone", "f_nophone", "skip"); g.edge("c_phone", "f_phone", "ok");
  g.edge("c_phone", "fake_phone", "fake"); g.edge("fake_phone", "w_phone");
  g.edge("c_phone", "bad_phone", "default"); g.edge("bad_phone", "w_phone");
  g.edge("f_phone", "tag_lead"); g.edge("f_nophone", "tag_lead"); g.edge("tag_lead", "done"); g.edge("done", "end");
  return g;
};

// Standard funnel @florent_preusser since 2026-10-23 (Henri): teaser in the guide DM, pitch with 200 € start credits,
// one reminder after 20 h per open question. A lead needs a personal business mail, or (no business mail) company
// with website + mobile number. Freemail and role mails are never accepted. Free text that is neither yes nor no
// gets tag frage-offen (Florent answers by hand) and the pitch buttons once more.
const lc = (re) => ({ id: re[0], variable: re[1], operator: "matches", value: re[2] });
// Pius 2026-10-30: a second tap on an earlier button ("Ja, schick rüber", "Erledigt, folge dir", later also "Ja, eintragen")
// lands in whatever wait is open. It is no answer: the condition sends it straight back to its wait, no message.
const retap = (t, v, more = []) => lc(["retap", v, ci(`^\\s*(?:${[t.welcomeButton, t.gateDoneButton, t.gateProfileButton, t.guideButton, ...more].filter(Boolean).map(esc).join("|")})\\s*[.!]*\\s*$`)]);
const leadCapture = (g, t, askText) => {
  const REMIND = 1200;
  const quick = (id, txt, titles) => g.node(id, "send_message", { messageType: "text", text: txt, quickReplies: titles.map((title) => ({ title })) });
  const waitStep = (id, saveAs, next, remindTxt) => {
    g.wait(`w_${id}`, saveAs, REMIND); g.text(`r_${id}`, remindTxt); g.wait(`w2_${id}`, saveAs, REMIND);
    g.edge(`w_${id}`, next, "reply"); g.edge(`w_${id}`, `r_${id}`, "timeout");
    g.edge(`r_${id}`, `w2_${id}`); g.edge(`w2_${id}`, next, "reply"); g.edge(`w2_${id}`, "end", "timeout");
  };
  // Mail: business only; "Keine Firmenmail" switches to company + website + required phone.
  g.text("ask_email", askText); g.edge("ask_email", "w_email");
  waitStep("email", "lead_email", "c_email", t.emailRemind);
  g.node("c_email", "condition", { rules: [
    lc(["nobiz", "lead_email", ci(t.noBizRegex)]), lc(["free", "lead_email", ci(EMAIL_FREE)]), lc(["role", "lead_email", ci(EMAIL_ROLE)]),
    lc(["fake", "lead_email", ci(EMAIL_FAKE_DOMAIN)]), lc(["ok", "lead_email", EMAIL_FORMAT]),
  ] });
  quick("free_email", t.freeEmail, [t.noBizButton]); quick("role_email", t.roleEmail, [t.noBizButton]);
  g.text("fake_email", t.fakeEmail); g.text("bad_email", t.badEmail);
  for (const [id, h] of [["free_email", "free"], ["role_email", "role"], ["fake_email", "fake"], ["bad_email", "default"]]) { g.edge("c_email", id, h); g.edge(id, "w_email"); }
  g.node("f_email", "set_field", { field: "lead_email", value: "{{lead_email}}" });
  g.edge("c_email", "f_email", "ok");

  // Business mail: phone optional.
  quick("ask_phone", t.askPhone, [t.phoneSkip]); g.wait("w_phone", "lead_phone", REMIND);
  g.node("c_phone", "condition", { rules: [
    lc(["skip", "lead_phone", ci(t.phoneSkipRegex)]), lc(["fake", "lead_phone", PHONE_FAKE]), lc(["ok", "lead_phone", PHONE_VALID]),
  ] });
  g.text("fake_phone", t.fakePhone); g.text("bad_phone", t.badPhone);
  g.node("f_phone", "set_field", { field: "lead_phone", value: "{{lead_phone}}" });
  g.node("f_nophone", "set_field", { field: "lead_phone", value: "" });
  g.edge("f_email", "ask_phone"); g.edge("ask_phone", "w_phone");
  g.edge("w_phone", "c_phone", "reply"); g.edge("w_phone", "f_nophone", "timeout");
  g.edge("c_phone", "f_nophone", "skip"); g.edge("c_phone", "f_phone", "ok");
  g.edge("c_phone", "fake_phone", "fake"); g.edge("fake_phone", "w_phone");
  g.edge("c_phone", "bad_phone", "default"); g.edge("bad_phone", "w_phone");

  // No business mail: company with website, then phone is required.
  g.text("ask_site", t.askSite); g.edge("c_email", "ask_site", "nobiz"); g.edge("ask_site", "w_site");
  waitStep("site", "lead_company", "c_site", t.siteRemind);
  g.node("c_site", "condition", { rules: [lc(["free", "lead_company", ci(SITE_FREE)]), lc(["ok", "lead_company", SITE_DOMAIN])] });
  g.text("bad_site", t.badSite); g.edge("c_site", "bad_site", "free"); g.edge("c_site", "bad_site", "default"); g.edge("bad_site", "w_site");
  g.node("f_company", "set_field", { field: "lead_company", value: "{{lead_company}}" });
  g.edge("c_site", "f_company", "ok");
  g.text("ask_phone_req", t.askPhoneReq); g.edge("f_company", "ask_phone_req"); g.edge("ask_phone_req", "w_phreq");
  waitStep("phreq", "lead_phone", "c_phreq", t.phoneRemind);
  g.node("c_phreq", "condition", { rules: [lc(["fake", "lead_phone", PHONE_FAKE]), lc(["ok", "lead_phone", PHONE_VALID])] });
  g.text("fake_phreq", t.fakePhone); g.text("bad_phreq", t.badPhone);
  g.edge("c_phreq", "fake_phreq", "fake"); g.edge("fake_phreq", "w_phreq");
  g.edge("c_phreq", "bad_phreq", "default"); g.edge("bad_phreq", "w_phreq");
  g.node("f_phreq", "set_field", { field: "lead_phone", value: "{{lead_phone}}" });
  g.edge("c_phreq", "f_phreq", "ok");

  g.node("tag_lead", "add_tag", { tag: t.leadTag });
  g.text("done", t.done);
  g.edge("f_phone", "tag_lead"); g.edge("f_nophone", "tag_lead"); g.edge("f_phreq", "tag_lead");
  g.edge("tag_lead", "done"); g.edge("done", "end");
};
// fp3 (Pius 2026-10-26): every lead gives name, company, personal business mail and mobile number. Freemail / role /
// fake mails are never accepted (no website fallback). The phone is required; only after the third reply without any
// digits (refusing or complaining about the number) the lead goes in without it.
const leadCaptureFull = (g, t, askText) => {
  const REMIND = t.remindMinutes ?? 1200;
  const waitStep = (id, saveAs, next, remindTxt, quiet = "end") => {
    g.wait(`w_${id}`, saveAs, REMIND); g.text(`r_${id}`, remindTxt); g.wait(`w2_${id}`, saveAs, REMIND);
    g.edge(`w_${id}`, next, "reply"); g.edge(`w_${id}`, `r_${id}`, "timeout");
    g.edge(`r_${id}`, `w2_${id}`); g.edge(`w2_${id}`, next, "reply"); g.edge(`w2_${id}`, quiet, "timeout");
  };
  const LETTERS = "[A-Za-zÄÖÜäöüß]{2,}";
  // Name, then company: any answer with letters counts.
  g.text("ask_name", askText); g.edge("ask_name", "w_name");
  waitStep("name", "lead_name", "c_name", t.nameRemind);
  // A bare "Ja" button is not a retap: a typed "ja" must still get an answer.
  const again = [t.pitchYes, ...[].concat(t.pitchYesOld || [])].filter((b) => b && !/^\s*ja\s*$/i.test(b));
  // Button texts and "ja" are no names (2026-10-28/30: "Ja, schick rüber" / "Ja, eintragen" were saved as names).
  g.node("c_name", "condition", { rules: [retap(t, "lead_name", again), ...(t.notNameRegex ? [lc(["junk", "lead_name", ci(t.notNameRegex)])] : []), lc(["ok", "lead_name", LETTERS])] });
  g.edge("c_name", "w_name", "retap"); if (t.notNameRegex) g.edge("c_name", "bad_name", "junk");
  g.text("bad_name", t.badName); g.edge("c_name", "bad_name", "default"); g.edge("bad_name", "w_name");
  g.node("f_name", "set_field", { field: "lead_name", value: "{{lead_name}}" }); g.edge("c_name", "f_name", "ok");
  g.text("ask_company", t.askCompany); g.edge("f_name", "ask_company"); g.edge("ask_company", "w_company");
  waitStep("company", "lead_company", "c_company", t.companyRemind);
  g.node("c_company", "condition", { rules: [retap(t, "lead_company", again), lc(["ok", "lead_company", LETTERS])] });
  g.edge("c_company", "w_company", "retap");
  g.text("bad_company", t.badCompany); g.edge("c_company", "bad_company", "default"); g.edge("bad_company", "w_company");
  g.node("f_company", "set_field", { field: "lead_company", value: "{{lead_company}}" }); g.edge("c_company", "f_company", "ok");

  // Business mail only; every other address loops back with the reason.
  g.text("ask_email", t.askEmailFull); g.edge("ask_email", "w_email");
  g.node("c_have_mail", "condition", { rules: [lc(["have", "lead_email", "@"])] });
  g.edge("f_company", "c_have_mail"); g.edge("c_have_mail", "ask_email", "default");
  waitStep("email", "lead_email", "c_email", t.emailRemind);
  g.node("c_email", "condition", { rules: [retap(t, "lead_email", again),
    lc(["fake", "lead_email", ci(EMAIL_FAKE_DOMAIN)]), lc(["free", "lead_email", ci(EMAIL_FREE)]), lc(["role", "lead_email", ci(EMAIL_ROLE)]),
    lc(["ok", "lead_email", EMAIL_FORMAT]),
  ] });
  g.edge("c_email", "w_email", "retap");
  g.text("free_email", t.freeEmailFull); g.text("role_email", t.roleEmailFull); g.text("fake_email", t.fakeEmail); g.text("bad_email", t.badEmail);
  for (const [id, h] of [["free_email", "free"], ["role_email", "role"], ["fake_email", "fake"], ["bad_email", "default"]]) { g.edge("c_email", id, h); g.edge(id, "w_email"); }
  g.node("f_email", "set_field", { field: "lead_email", value: "{{lead_email}}" }); g.edge("c_email", "f_email", "ok");
  g.edge("c_have_mail", "f_email", "have");

  // Phone: wrong numbers loop on the same level, replies without digits count as pushback (3rd one = no phone).
  g.node("tag_lead", "add_tag", { tag: t.leadTag });
  g.node("f_nophone", "set_field", { field: "lead_phone", value: "" });
  // Silent after the reminder: mail is in, so it is still a lead, but the 24 h window is closed for a done text.
  g.node("f_quiet", "set_field", { field: "lead_phone", value: "" }); g.node("tag_quiet", "add_tag", { tag: t.leadTag });
  g.edge("f_quiet", "tag_quiet"); g.edge("tag_quiet", "end");
  g.text("ask_phone", t.askPhoneFull); g.edge("f_email", "ask_phone"); g.edge("ask_phone", "w_ph1");
  const asks = [null, t.phonePush1, t.phonePush2];
  for (let i = 1; i <= 3; i++) {
    if (i > 1) { g.text(`push${i}`, asks[i - 1]); g.edge(`push${i}`, `w_ph${i}`); }
    waitStep(`ph${i}`, "lead_phone", `c_ph${i}`, t.phoneRemind, "f_quiet");
    g.node(`c_ph${i}`, "condition", { rules: [retap(t, "lead_phone", again), lc(["fake", "lead_phone", PHONE_FAKE]), lc(["ok", "lead_phone", PHONE_VALID]), lc(["digits", "lead_phone", "\\d"])] });
    g.edge(`c_ph${i}`, `w_ph${i}`, "retap");
    g.text(`fake_ph${i}`, t.fakePhone); g.text(`bad_ph${i}`, t.badPhone);
    g.edge(`c_ph${i}`, `fake_ph${i}`, "fake"); g.edge(`fake_ph${i}`, `w_ph${i}`);
    g.edge(`c_ph${i}`, `bad_ph${i}`, "digits"); g.edge(`bad_ph${i}`, `w_ph${i}`);
    g.node(`f_ph${i}`, "set_field", { field: "lead_phone", value: "{{lead_phone}}" });
    g.edge(`c_ph${i}`, `f_ph${i}`, "ok"); g.edge(`f_ph${i}`, "tag_lead");
    g.edge(`c_ph${i}`, i < 3 ? `push${i + 1}` : "no_phone", "default");
  }
  g.text("no_phone", t.phoneGiveUp); g.edge("no_phone", "f_nophone"); g.edge("f_nophone", "tag_lead");
  g.text("done", t.done); g.edge("tag_lead", "done"); g.edge("done", "end");
};
const buildFp2 = (t, { guideUrl, trigger }) => {
  const g = graph();
  // Reminder before the 24 h messaging window closes (fp3: 23 h, so it lands about the same time of day).
  const REMIND = t.remindMinutes ?? 1200;
  const entry = t.capture === "full" ? "ask_name" : "ask_email";
  g.node("trigger", "trigger", trigger);
  followAndGuide(g, t, guideUrl, "guide-erhalten");
  g.node("end", "end");
  // fp3: without pitchNo only the yes button is shown (no easy way out); a typed "nein" still ends in bye.
  const btns = () => [g.tap(t.pitchYes), ...(t.pitchNo ? [g.tap(t.pitchNo)] : [])];
  const answer = (id) => g.node(id, "condition", { rules: [
    retap(t, "pitch_answer"),
    { id: "yes_tap", variable: "postback.title", operator: "equals", value: t.pitchYes },
    // Messages sent before a button rename still carry the old titles (pitchYesOld).
    ...(t.pitchYesOld ? [{ id: "yes_old", variable: "postback.title", operator: "matches", value: ci(`^(?:${[].concat(t.pitchYesOld).map(esc).join("|")})$`) }] : []),
    ...(t.pitchNo ? [{ id: "no_tap", variable: "postback.title", operator: "equals", value: t.pitchNo }] : []),
    lc(["yes_text", "inboundText", ci(t.yesRegex)]), lc(["no_text", "inboundText", ci(t.noRegex)]),
  ] });
  g.node("delay", "delay", { delayMinutes: t.pitchDelayMinutes ?? 2 });
  g.text("pitch", t.pitch, btns()); g.wait("w_pitch", "pitch_answer", REMIND);
  g.text("r_pitch", t.pitchRemind, btns()); g.wait("w2_pitch", "pitch_answer", REMIND);
  answer("c_pitch");
  g.node("tag_q", "add_tag", { tag: t.questionTag });
  g.text("question", t.question, btns()); g.wait("w_q", "pitch_answer", REMIND);
  answer("c_q");
  g.text("bye", t.bye);
  // fp3 (2026-10-26): Florent voice note (audio, no buttons possible) right before the short pitch text.
  if (t.voiceUrl) {
    g.node("voice", "send_message", { messageType: "media", media: { url: t.voiceUrl, mediaType: "audio" } });
    g.edge("guide_done", "delay"); g.edge("delay", "voice"); g.edge("voice", "pitch");
  } else { g.edge("guide_done", "delay"); g.edge("delay", "pitch"); }
  g.edge("pitch", "w_pitch");
  g.edge("w_pitch", "c_pitch", "reply");
  // Pius 2026-10-26: whoever got onto the list in the meantime (other funnel, website, list sync) gets no reminder.
  knownLead(g, t, "c_known_r"); g.edge("w_pitch", "c_known_r", "timeout");
  knownEdges(g, t, "c_known_r", "end"); g.edge("c_known_r", "r_pitch", "default");
  g.edge("r_pitch", "w2_pitch"); g.edge("w2_pitch", "c_pitch", "reply"); g.edge("w2_pitch", "end", "timeout");
  for (const c of ["c_pitch", "c_q"]) {
    g.edge(c, entry, "yes_tap"); g.edge(c, entry, "yes_text"); if (t.pitchYesOld) g.edge(c, entry, "yes_old"); if (t.pitchNo) g.edge(c, "bye", "no_tap"); g.edge(c, "bye", "no_text");
  }
  g.edge("c_pitch", "w2_pitch", "retap"); g.edge("c_q", "w_q", "retap");
  g.edge("c_pitch", "tag_q", "default"); g.edge("tag_q", "question"); g.edge("question", "w_q");
  g.edge("w_q", "c_q", "reply"); g.edge("w_q", "end", "timeout"); g.edge("c_q", "end", "default");
  g.edge("bye", "end");
  if (t.capture === "full") leadCaptureFull(g, t, t.askName); else leadCapture(g, t, t.askEmail);
  return g;
};
// fp4 "Guide gegen Mail" (Pius 2026-10-28: "Guide hinter der Mail", as little friction as possible). The guide only
// comes after a mail: business mail -> lead at once. Role mail (info@) -> one push for the personal one, then taken
// silently (sync: "Rollenmail (Notfall)"). Freemail -> website question -> "your address at <site>"; refusing again
// still gets the guide (Teil-Lead with site, or no lead without one). Second answers land in lead_email_retry so the
// sync can tell the fallback paths apart. After the guide: name, then phone (same 3-step push as fp3). No voice note.
const buildFp4 = (t, { guideUrl, trigger }) => {
  const g = graph();
  const REMIND = t.remindMinutes ?? 1425;
  const LETTERS = "[A-Za-zÄÖÜäöüß]{2,}";
  g.node("trigger", "trigger", trigger); g.node("end", "end");
  // Soft follow check, list members get the guide straight away (no questions).
  g.node("c_follow", "condition", { rules: [{ id: "follows", variable: "contact.isFollower", operator: "is_true" }] });
  g.text("gate", t.gate, [g.link(t.gateProfileButton, t.profileUrl), g.tap(t.gateDoneButton)]); g.wait("w_gate", "tap_gate", 720);
  knownLead(g, t, "c_known");
  g.text("guide_known", t.guideKnown, [g.link(t.guideButton, guideUrl)]); g.node("known_done", "add_tag", { tag: "guide-erhalten" });
  g.edge("trigger", "c_follow"); g.edge("c_follow", "c_known", "follows"); g.edge("c_follow", "gate", "default");
  g.edge("gate", "w_gate"); g.edge("w_gate", "c_known", "reply"); g.edge("w_gate", "c_known", "timeout");
  knownEdges(g, t, "c_known", "guide_known"); g.edge("guide_known", "known_done"); g.edge("known_done", "end");

  // Fake first, so test@test.de is not answered as a shared inbox (and never taken as a role-mail fallback).
  const mailRules = (v) => [retap(t, v), lc(["fake", v, ci(EMAIL_FAKE_DOMAIN)]), lc(["free", v, ci(EMAIL_FREE)]), lc(["role", v, ci(EMAIL_ROLE)]), lc(["ok", v, EMAIL_FORMAT])];
  // 1st ask (one reminder before the 24 h window closes).
  g.text("ask_mail", t.askMail); g.edge("c_known", "ask_mail", "default"); g.edge("ask_mail", "w_mail");
  g.wait("w_mail", "lead_email", REMIND); g.text("r_mail", t.mailRemind); g.wait("w2_mail", "lead_email", REMIND);
  g.edge("w_mail", "c_mail", "reply"); g.edge("w_mail", "r_mail", "timeout"); g.edge("r_mail", "w2_mail");
  g.edge("w2_mail", "c_mail", "reply"); g.edge("w2_mail", "end", "timeout");
  g.node("c_mail", "condition", { rules: mailRules("lead_email") }); g.edge("c_mail", "w_mail", "retap");
  g.node("f_email", "set_field", { field: "lead_email", value: "{{lead_email}}" }); g.edge("c_mail", "f_email", "ok");
  g.text("fake_mail", t.fakeEmail); g.edge("c_mail", "fake_mail", "fake"); g.edge("fake_mail", "w_mail");
  // No mail at all (text, "nein", question): one more ask, then the guide without lead.
  g.text("bad_mail", t.badMailFirst); g.edge("c_mail", "bad_mail", "default"); g.edge("bad_mail", "w_mail2");
  g.wait("w_mail2", "lead_email", REMIND); g.edge("w_mail2", "c_mail2", "reply"); g.edge("w_mail2", "guide_free", "timeout");
  g.node("c_mail2", "condition", { rules: mailRules("lead_email") }); g.edge("c_mail2", "w_mail2", "retap");
  g.edge("c_mail2", "f_email", "ok"); g.edge("c_mail2", "role_push", "role"); g.edge("c_mail2", "ask_site", "free");
  g.edge("c_mail2", "guide_free", "fake"); g.edge("c_mail2", "guide_free", "default");

  // Role mail: one push, then whatever comes is fine (a business mail replaces it).
  g.text("role_push", t.roleEmailFull); g.edge("c_mail", "role_push", "role"); g.edge("role_push", "w_role");
  g.wait("w_role", "lead_email_retry", REMIND); g.edge("w_role", "c_role", "reply"); g.edge("w_role", "tag_lead", "timeout");
  g.node("c_role", "condition", { rules: mailRules("lead_email_retry") }); g.edge("c_role", "w_role", "retap");
  g.node("f_email2", "set_field", { field: "lead_email", value: "{{lead_email_retry}}" }); g.edge("f_email2", "tag_lead");
  g.edge("c_role", "f_email2", "ok"); for (const h of ["free", "role", "fake", "default"]) g.edge("c_role", "tag_lead", h);

  // Freemail: website, then the address at that site; refusing still gets the guide.
  g.text("ask_site", t.freeAskSite); g.edge("c_mail", "ask_site", "free"); g.edge("ask_site", "w_site");
  g.wait("w_site", "lead_company", REMIND); g.edge("w_site", "c_site", "reply"); g.edge("w_site", "guide_free", "timeout");
  g.node("c_site", "condition", { rules: [retap(t, "lead_company"), lc(["free", "lead_company", ci(SITE_FREE)]), lc(["ok", "lead_company", SITE_DOMAIN])] });
  g.edge("c_site", "w_site", "retap"); g.edge("c_site", "guide_free", "free"); g.edge("c_site", "guide_free", "default");
  g.node("f_company", "set_field", { field: "lead_company", value: "{{lead_company}}" }); g.edge("c_site", "f_company", "ok");
  g.text("ask_sitemail", t.askSiteMail); g.edge("f_company", "ask_sitemail"); g.edge("ask_sitemail", "w_sitemail");
  g.wait("w_sitemail", "lead_email_retry", REMIND); g.edge("w_sitemail", "c_sitemail", "reply"); g.edge("w_sitemail", "tag_part", "timeout");
  g.node("c_sitemail", "condition", { rules: mailRules("lead_email_retry") }); g.edge("c_sitemail", "w_sitemail", "retap");
  g.edge("c_sitemail", "f_email2", "ok"); g.edge("c_sitemail", "f_email2", "role");
  for (const h of ["free", "fake", "default"]) g.edge("c_sitemail", "tag_part", h);
  g.node("tag_part", "add_tag", { tag: "teil-lead" }); g.edge("tag_part", "guide_lead");

  // Guide without lead (refused twice): fair, no bait.
  g.text("guide_free", t.guideFree, [g.link(t.guideButton, guideUrl)]); g.node("free_done", "add_tag", { tag: "guide-ohne-mail" });
  g.edge("guide_free", "free_done"); g.edge("free_done", "end");

  // Lead: guide, then name and phone.
  g.node("tag_lead", "add_tag", { tag: t.leadTag }); g.edge("f_email", "tag_lead"); g.edge("tag_lead", "guide_lead");
  g.text("guide_lead", t.guideLead, [g.link(t.guideButton, guideUrl)]); g.node("guide_done", "add_tag", { tag: "guide-erhalten" });
  g.edge("guide_lead", "guide_done");
  g.node("delay", "delay", { delayMinutes: t.nameDelayMinutes ?? 1 }); g.edge("guide_done", "delay");
  g.text("ask_name", t.askNameAfter); g.edge("delay", "ask_name"); g.edge("ask_name", "w_name");
  g.wait("w_name", "lead_name", REMIND); g.edge("w_name", "c_name", "reply"); g.edge("w_name", "end", "timeout");
  // Button texts / "ja" are no names (2026-10-28: "Ja, schick rüber" was saved as a name).
  g.node("c_name", "condition", { rules: [retap(t, "lead_name"), lc(["junk", "lead_name", ci(t.notNameRegex)]), lc(["ok", "lead_name", LETTERS])] });
  g.edge("c_name", "w_name", "retap");
  g.text("bad_name", t.badName); g.edge("c_name", "bad_name", "junk"); g.edge("c_name", "bad_name", "default"); g.edge("bad_name", "w_name");
  g.node("f_name", "set_field", { field: "lead_name", value: "{{lead_name}}" }); g.edge("c_name", "f_name", "ok");
  g.text("ask_phone", t.askPhoneFull); g.edge("f_name", "ask_phone"); g.edge("ask_phone", "w_ph1");
  g.node("f_nophone", "set_field", { field: "lead_phone", value: "" });
  const asks = [null, t.phonePush1, t.phonePush2];
  for (let i = 1; i <= 3; i++) {
    if (i > 1) { g.text(`push${i}`, asks[i - 1]); g.edge(`push${i}`, `w_ph${i}`); }
    g.wait(`w_ph${i}`, "lead_phone", REMIND); g.edge(`w_ph${i}`, `c_ph${i}`, "reply"); g.edge(`w_ph${i}`, "end", "timeout");
    g.node(`c_ph${i}`, "condition", { rules: [retap(t, "lead_phone"), lc(["fake", "lead_phone", PHONE_FAKE]), lc(["ok", "lead_phone", PHONE_VALID]), lc(["digits", "lead_phone", "\\d"])] });
    g.edge(`c_ph${i}`, `w_ph${i}`, "retap");
    g.text(`fake_ph${i}`, t.fakePhone); g.text(`bad_ph${i}`, t.badPhone);
    g.edge(`c_ph${i}`, `fake_ph${i}`, "fake"); g.edge(`fake_ph${i}`, `w_ph${i}`);
    g.edge(`c_ph${i}`, `bad_ph${i}`, "digits"); g.edge(`bad_ph${i}`, `w_ph${i}`);
    g.node(`f_ph${i}`, "set_field", { field: "lead_phone", value: "{{lead_phone}}" });
    g.edge(`c_ph${i}`, `f_ph${i}`, "ok"); g.edge(`f_ph${i}`, "done");
    g.edge(`c_ph${i}`, i < 3 ? `push${i + 1}` : "no_phone", "default");
  }
  g.text("no_phone", t.phoneGiveUp); g.edge("no_phone", "f_nophone"); g.edge("f_nophone", "done");
  g.text("done", t.done); g.edge("done", "end");
  return g;
};
// "Credits" DM (the way back after "Nein, danke"): straight into the fp2 lead capture.
const buildCredits = (t, { trigger }) => {
  const g = graph();
  g.node("trigger", "trigger", trigger);
  g.node("end", "end");
  if (t.capture === "full") {
    // Already on the list: no second sign-up, just a short confirmation.
    knownLead(g, t, "c_known"); g.text("credits_known", t.creditsKnown);
    g.edge("trigger", "c_known"); knownEdges(g, t, "c_known", "credits_known");
    g.edge("c_known", "ask_name", "default"); g.edge("credits_known", "end");
    leadCaptureFull(g, t, t.credits);
  }
  else { g.edge("trigger", "ask_email"); leadCapture(g, t, t.credits); }
  return g;
};
// Late answers (Pius 2026-10-26: PowerBorgi sent her name 5 days after the old fp run had ended, nothing answered).
// Runs only when no other run is live in the chat (Zernio rule), for guide receivers who are not leads yet, and only for
// messages that look like a sign-up answer: a name, a mail or a yes. Everything else stays for Florent by hand.
const LATE_WORD = "[A-Za-zÄÖÜäöüßéèáàç'-]{2,}";
const lateRegex = (t) => {
  const stop = ci("ich|du|mir|mich|uns|wie|was|wo|wann|warum|wer|welche|welcher|kann|bitte|danke|dankeschön|guide|pdf|link|hallo|hey|hi|moin|servus|ja|nein|ok|okay|super|top|cool|gerne|klar|schick|schicken|eintragen|credits|interesse|frage|geil|nice|perfekt|mega|alles|gut|passt");
  return {
    mail: "^\\s*\\S+@\\S+\\.\\S+\\s*$",
    name: `^\\s*(?!.*\\b(${stop})\\b)${LATE_WORD}(\\s+${LATE_WORD}){1,2}\\s*$`,
    yes: `${ci(t.yesRegex)}|${ci("^\\s*(trag mich ein|eintragen|bin dabei|will dabei sein|ich will rein|meine 100)")}`,
    // Button taps and test keywords never start this flow.
    skip: ci("schick rüber|folge dir|zum profil|guide öffnen|sktest|zfunnel|^\\s*credits?\\s*[.!]*\\s*$"),
  };
};
const buildLate = (t, { trigger }) => {
  const g = graph(), L = lateRegex(t);
  g.node("trigger", "trigger", trigger); g.node("end", "end");
  knownLead(g, t, "c_known");
  g.node("c_guide", "condition", { rules: [{ id: "guide", variable: "contact.tags", operator: "has_tag", value: "guide-erhalten" }] });
  g.node("c_late", "condition", { rules: [lc(["skip", "lastMessage", L.skip]), lc(["mail", "lastMessage", L.mail]), lc(["name", "lastMessage", L.name]), lc(["yes", "lastMessage", L.yes])] });
  g.node("set_name", "set_variable", { assignments: [{ name: "lead_name", value: "{{lastMessage}}" }] });
  g.node("c_mail_late", "condition", { rules: [
    lc(["free", "lastMessage", ci(EMAIL_FREE)]), lc(["role", "lastMessage", ci(EMAIL_ROLE)]), lc(["fake", "lastMessage", ci(EMAIL_FAKE_DOMAIN)]), lc(["ok", "lastMessage", EMAIL_FORMAT]),
  ] });
  g.node("set_mail", "set_variable", { assignments: [{ name: "lead_email", value: "{{lastMessage}}" }] });
  g.node("tag_late", "add_tag", { tag: "spaete-antwort" });
  g.edge("trigger", "c_known"); knownEdges(g, t, "c_known", "end"); g.edge("c_known", "c_guide", "default");
  g.edge("c_guide", "c_late", "guide"); g.edge("c_guide", "end", "default");
  g.edge("c_late", "end", "skip"); g.edge("c_late", "end", "default");
  g.edge("c_late", "tag_late", "name"); g.edge("tag_late", "set_name"); g.edge("set_name", "f_name");
  g.edge("c_late", "c_mail_late", "mail"); g.edge("c_late", "ask_name", "yes");
  g.edge("c_mail_late", "set_mail", "ok"); g.edge("set_mail", "ask_name");
  for (const h of ["free", "role", "fake", "default"]) g.edge("c_mail_late", "ask_name", h);
  leadCaptureFull(g, t, t.askName);
  return g;
};
// Every node reachable, every edge points at a node, every wait/condition has its outgoing handles.
const checkGraph = (g) => {
  const ids = new Set(g.nodes.map((n) => n.id));
  const errs = [];
  if (ids.size !== g.nodes.length) errs.push("doppelte Node-IDs");
  for (const e of g.edges) if (!ids.has(e.source) || !ids.has(e.target)) errs.push(`Kante ${e.source} -> ${e.target} ins Leere`);
  const out = (id) => g.edges.filter((e) => e.source === id);
  for (const n of g.nodes) {
    const hs = out(n.id).map((e) => e.sourceHandle);
    if (n.type === "wait_for_reply" && !(hs.includes("reply") && hs.includes("timeout"))) errs.push(`${n.id}: reply/timeout fehlt`);
    if (n.type === "condition") for (const h of [...n.config.rules.map((r) => r.id), "default"]) if (!hs.includes(h)) errs.push(`${n.id}: Ausgang ${h} fehlt`);
    if (n.type !== "end" && n.type !== "condition" && n.type !== "wait_for_reply" && out(n.id).length !== 1) errs.push(`${n.id}: ${out(n.id).length} Ausgänge`);
    try { if (n.type === "condition") n.config.rules.filter((r) => r.operator === "matches").forEach((r) => new RegExp(r.value)); } catch (e) { errs.push(`${n.id}: Regex ${e.message}`); }
  }
  const seen = new Set(["trigger"]), todo = ["trigger"];
  while (todo.length) for (const e of out(todo.pop())) if (!seen.has(e.target)) { seen.add(e.target); todo.push(e.target); }
  for (const id of ids) if (!seen.has(id)) errs.push(`${id} nicht erreichbar`);
  if (errs.length) throw new Error(`Graph kaputt:\n  ${errs.join("\n  ")}`);
  return g;
};

// Felix / boilr (BX-C, agency episodes): guide -> 2 min -> bridge -> role -> (agency) sector + team -> demo link, (other) friendly no.
const buildBx = (t, { guideUrl, trigger }) => {
  const g = graph();
  g.node("trigger", "trigger", trigger);
  followAndGuide(g, t, guideUrl, "boilr-guide");
  g.node("delay", "delay", { delayMinutes: t.bridgeDelayMinutes ?? 2 });
  g.text("bridge", t.bridge, [g.tap(t.bridgeYes), g.tap(t.bridgeNo)]);
  g.wait("w_bridge", "bridge_answer", 4320);
  g.node("c_bridge", "condition", { rules: [
    { id: "yes_tap", variable: "postback.title", operator: "equals", value: t.bridgeYes },
    { id: "no_tap", variable: "postback.title", operator: "equals", value: t.bridgeNo },
    { id: "yes_text", variable: "inboundText", operator: "matches", value: "\\b(yes|yeah|yep|sure|ok|okay|demo|show me|go on|please)\\b" },
  ] });
  g.text("not_now", t.notNow);
  g.wait("w_demo", "later_answer", 10080);
  g.node("c_demo", "condition", { rules: [{ id: "demo", variable: "inboundText", operator: "matches", value: "\\bdemo\\b" }] });
  g.text("ask_role", t.askRole, t.roles.map((r) => g.tap(r)));
  g.wait("w_role", "bx_role", 1440);
  g.node("c_role", "condition", { rules: [
    ...t.agencyRoles.map((r, i) => ({ id: `agency_tap_${i}`, variable: "postback.title", operator: "equals", value: r })),
    { id: "agency_text", variable: "inboundText", operator: "matches", value: "\\b(owner|director|founder|md|ceo|partner|consultant|recruiter|agency)\\b" },
  ] });
  g.text("ask_sector", t.askSector); g.wait("w_sector", "bx_sector", 1440);
  g.node("ask_team", "send_message", { messageType: "text", text: t.askTeam, quickReplies: t.teamSizes.map((s) => ({ title: s })) });
  g.wait("w_team", "bx_team", 1440);
  g.node("tag_qual", "add_tag", { tag: "boilr-qualified" });
  g.text("demo", t.demo, [g.link(t.demoButton, t.demoUrl)]);
  g.node("tag_other", "add_tag", { tag: "boilr-not-agency" });
  g.text("other", t.notAgency);
  g.node("end", "end");

  g.edge("guide_done", "delay"); g.edge("delay", "bridge"); g.edge("bridge", "w_bridge");
  g.edge("w_bridge", "c_bridge", "reply"); g.edge("w_bridge", "end", "timeout");
  g.edge("c_bridge", "ask_role", "yes_tap"); g.edge("c_bridge", "ask_role", "yes_text");
  g.edge("c_bridge", "not_now", "no_tap"); g.edge("c_bridge", "not_now", "default");
  g.edge("not_now", "w_demo"); g.edge("w_demo", "c_demo", "reply"); g.edge("w_demo", "end", "timeout");
  g.edge("c_demo", "ask_role", "demo"); g.edge("c_demo", "end", "default");
  g.edge("ask_role", "w_role"); g.edge("w_role", "c_role", "reply"); g.edge("w_role", "end", "timeout");
  t.agencyRoles.forEach((_, i) => g.edge("c_role", "ask_sector", `agency_tap_${i}`));
  g.edge("c_role", "ask_sector", "agency_text"); g.edge("c_role", "tag_other", "default");
  g.edge("ask_sector", "w_sector"); g.edge("w_sector", "ask_team", "reply"); g.edge("w_sector", "end", "timeout");
  g.edge("ask_team", "w_team"); g.edge("w_team", "tag_qual", "reply"); g.edge("w_team", "tag_qual", "timeout");
  g.edge("tag_qual", "demo"); g.edge("demo", "end");
  g.edge("tag_other", "other"); g.edge("other", "end");
  return g;
};

// Guide only (@florentgpt, Felix' candidate episodes): soft follow check -> guide -> end.
const buildGuide = (t, { guideUrl, trigger }) => {
  const g = graph();
  g.node("trigger", "trigger", trigger);
  followAndGuide(g, t, guideUrl, t.guideTag ?? "guide-erhalten");
  g.node("end", "end");
  g.edge("guide_done", "end");
  return g;
};

const cmd = args[0];
if (cmd === "create") {
  // Since 2026-10-26 (Pius) every FP funnel is fp3 (voice note + full lead data); fp2 with --kind fp2, the old fp graph only with --legacy.
  const kind = (flag("kind") ?? "fp") === "fp" && !has("legacy") ? "fp3" : flag("kind");
  const t = JSON.parse(fs.readFileSync(path.resolve(ROOT, flag("config") ?? `funnel/${kind}-funnel.json`), "utf8"));
  // fp4: list members are recognised from the first run on (fp3 gets the ids on the next rebuild).
  if (kind === "fp4") t.knownIds = await leadIds(t.leadTag);
  const { acc, profileId } = await account(flag("account"));
  const name = flag("name");
  const postId = flag("platform-post-id");
  const testKw = flag("test-keyword");
  if (!postId && !testKw) throw new Error("--platform-post-id oder --test-keyword fehlt");
  if (postId && registry().some((e) => e.platformPostId === postId)) throw new Error(`Für Post ${postId} gibt es schon einen Funnel (funnel/registry.json)`);
  const rep = postId ? JSON.parse(fs.readFileSync(path.resolve(ROOT, flag("replies")), "utf8")) : null;
  const guideUrl = flag("pdf-url") ?? (flag("pdf") ? await uploadPdf(flag("pdf")) : null);
  if (!guideUrl) throw new Error("--pdf oder --pdf-url fehlt (Guide-Button)");
  // Tap-started workflows still need a trigger; this keyword is never typed by anyone.
  const keyword = testKw ?? `zfunnel-${postId}`;
  const trigger = { triggerType: "inbound_message", keywords: [keyword], matchType: "exact", onlyFirstMessage: false, cooldownHours: 1 };
  const g = kind === "bx" ? buildBx(t, { guideUrl, trigger }) : kind === "fp" ? buildFp(t, { guideUrl, trigger, webhookUrl: envVal("WAITLIST_WEBHOOK_URL"), flowName: name }) : kind === "fpq" ? buildFpq(t, { guideUrl, trigger }) : kind === "fp2" || kind === "fp3" ? checkGraph(buildFp2(t, { guideUrl, trigger })) : kind === "fp4" ? checkGraph(buildFp4(t, { guideUrl, trigger })) : buildGuide(t, { guideUrl, trigger });
  const res = await api("POST", "/workflows", { profileId, accountId: acc._id, platform: "instagram", name, description: `${kind}-Funnel (funnel/${kind}-funnel.json)`, nodes: g.nodes, edges: g.edges, entryNodeId: "trigger" });
  const wf = res.workflow ?? res;
  await api("POST", `/workflows/${wf.id}/activate`);
  const out = { name, kind, account: acc.username, workflowId: wf.id, nodeCount: wf.nodeCount ?? g.nodes.length, guideUrl };
  if (postId) {
    const a = await api("POST", "/comment-automations", {
      profileId, accountId: acc._id, name, trigger: "comment", keywords: [], platformPostId: postId,
      dmMessage: t.welcome, buttons: [{ type: "postback", title: t.welcomeButton, payload: `zernio:workflow:${wf.id}` }],
      commentReply: rep.commentReply ?? rep.main, commentReplyVariations: rep.commentReplyVariations ?? rep.variations,
      publicReplyPolicy: "after_dm", repeatPolicy: { mode: "every_comment" }, isActive: !has("inactive"),
    });
    const auto = a.automation ?? a;
    Object.assign(out, { platformPostId: postId, automationId: auto._id ?? auto.id, automationActive: auto.isActive });
    saveRegistry([...registry(), { ...out, createdAt: new Date().toISOString() }]);
  }
  console.log(JSON.stringify(out));
} else if (cmd === "graph") {
  // Offline check of the fp3 and credits graphs (no API calls); --config for another file.
  const t = JSON.parse(fs.readFileSync(path.resolve(ROOT, flag("config") ?? "funnel/fp3-funnel.json"), "utf8"));
  const trigger = { triggerType: "inbound_message", keywords: ["x"], matchType: "exact", onlyFirstMessage: false, cooldownHours: 1 };
  for (const [n, g] of t.askMail ? [["fp4", buildFp4(t, { guideUrl: "https://example.org/g.pdf", trigger })]] : [["fp2", buildFp2(t, { guideUrl: "https://example.org/g.pdf", trigger })], ["credits", buildCredits(t, { trigger })], ...(t.capture === "full" ? [["late", buildLate(t, { trigger })]] : [])]) {
    checkGraph(g);
    console.log(`${n}: ${g.nodes.length} Nodes, ${g.edges.length} Kanten, ok`);
    if (has("dump")) fs.writeFileSync(path.join(ROOT, `funnel/${n}-graph.json`), JSON.stringify({ nodes: g.nodes, edges: g.edges }, null, 1));
  }
} else if (cmd === "credits") {
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/fp3-funnel.json"), "utf8"));
  const { acc, profileId } = await account(flag("account") ?? "florent_preusser");
  const name = flag("name") ?? "FP Funnel Credits-Keyword";
  const trigger = { triggerType: "inbound_message", keywords: [flag("test-keyword") ?? ci(t.creditsRegex)], matchType: flag("test-keyword") ? "exact" : "regex", onlyFirstMessage: false };
  const g = checkGraph(buildCredits(t, { trigger }));
  const res = await api("POST", "/workflows", { profileId, accountId: acc._id, platform: "instagram", name, description: "fp3 Credits-Keyword (funnel/fp3-funnel.json)", nodes: g.nodes, edges: g.edges, entryNodeId: "trigger" });
  const wf = res.workflow ?? res;
  await api("POST", `/workflows/${wf.id}/activate`);
  console.log(JSON.stringify({ name, workflowId: wf.id, nodeCount: g.nodes.length }));
} else if (cmd === "migrate") {
  // Old fp/fpq/fp2 posts keep their comment automation; only the welcome button now starts a new fp3 workflow (2026-10-26).
  // The old workflow stays active so people already inside it (or tapping an old DM) finish there.
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/fp3-funnel.json"), "utf8"));
  const reg = registry();
  const todo = reg.filter((e) => e.account === "florent_preusser" && ["fp", "fpq", "fp2"].includes(e.kind) && e.platformPostId && e.automationId);
  const { acc, profileId } = await account("florent_preusser");
  for (const e of todo) {
    // Automations deleted in Zernio (e.g. a duplicate post) are skipped and marked in the registry.
    const a = await api("GET", `/comment-automations/${e.automationId}`).catch((err) => (/HTTP 404/.test(err.message) ? null : Promise.reject(err)));
    if (!a) { console.log(`SKIP ${e.name}: Automation ${e.automationId} gibt es nicht mehr`); if (!has("dry")) { e.automationGone = true; saveRegistry(reg); } continue; }
    const auto = a.automation ?? a;
    const old = (auto.buttons ?? [])[0] ?? {};
    if (has("dry")) { console.log(`WOULD ${e.name}: ${e.kind} -> fp3 (Button „${old.title ?? "?"}“, aktiv=${auto.isActive})`); continue; }
    const trigger = { triggerType: "inbound_message", keywords: [`zfunnel3-${e.platformPostId}`], matchType: "exact", onlyFirstMessage: false, cooldownHours: 1 };
    const g = checkGraph(buildFp2(t, { guideUrl: e.guideUrl, trigger }));
    const res = await api("POST", "/workflows", { profileId, accountId: acc._id, platform: "instagram", name: e.name, description: "fp3-Funnel (funnel/fp3-funnel.json), migriert 2026-10-26", nodes: g.nodes, edges: g.edges, entryNodeId: "trigger" });
    const wf = res.workflow ?? res;
    await api("POST", `/workflows/${wf.id}/activate`);
    await api("PATCH", `/comment-automations/${e.automationId}`, { buttons: [{ type: "postback", title: old.title ?? t.welcomeButton, payload: `zernio:workflow:${wf.id}` }] });
    const check = await api("GET", `/comment-automations/${e.automationId}`);
    const payload = ((check.automation ?? check).buttons ?? [])[0]?.payload;
    if (payload !== `zernio:workflow:${wf.id}`) throw new Error(`${e.name}: Button zeigt nicht auf den neuen Workflow (${payload})`);
    Object.assign(e, { oldKind: e.kind, oldWorkflowId: e.workflowId, kind: "fp3", workflowId: wf.id, nodeCount: g.nodes.length, migratedAt: new Date().toISOString() });
    saveRegistry(reg);
    console.log(`${e.name}: fp3 ${wf.id}`);
  }
} else if (cmd === "late") {
  // Catch-all for late sign-up answers (see buildLate). --update <id> swaps the graph of the existing one.
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/fp3-funnel.json"), "utf8"));
  t.knownIds = await leadIds(t.leadTag);
  const L = lateRegex(t);
  const trigger = { triggerType: "inbound_message", keywords: [`^(?!.*(${L.skip}))(?:${L.mail}|${L.name}|${L.yes})`], matchType: "regex", onlyFirstMessage: false };
  const g = checkGraph(buildLate(t, { trigger }));
  if (flag("update")) {
    const id = flag("update");
    await api("POST", `/workflows/${id}/pause`);
    try { await api("PATCH", `/workflows/${id}`, { nodes: g.nodes, edges: g.edges, entryNodeId: "trigger" }); } finally { await api("POST", `/workflows/${id}/activate`); }
    console.log(JSON.stringify({ workflowId: id, nodeCount: g.nodes.length }));
  } else {
    const { acc, profileId } = await account("florent_preusser");
    const res = await api("POST", "/workflows", { profileId, accountId: acc._id, platform: "instagram", name: "FP Funnel Spaete Antworten", description: "fp3 late answers (funnel/fp3-funnel.json)", nodes: g.nodes, edges: g.edges, entryNodeId: "trigger" });
    const wf = res.workflow ?? res;
    if (!has("inactive")) await api("POST", `/workflows/${wf.id}/activate`);
    console.log(JSON.stringify({ workflowId: wf.id, nodeCount: g.nodes.length }));
  }
} else if (cmd === "rebuild") {
  // fp3 config changed: pause -> new graph -> activate on the same workflow ids (Zernio edits graphs only while paused;
  // buttons keep their payloads, in-flight runs go on). --credits <id> / --test <id> also rebuild those two.
  const t = JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/fp3-funnel.json"), "utf8"));
  t.knownIds = await leadIds(t.leadTag);
  console.log(`${t.knownIds.length} Lead-IDs`);
  const tap = (k) => ({ triggerType: "inbound_message", keywords: [k], matchType: "exact", onlyFirstMessage: false, cooldownHours: 1 });
  const jobs = registry().filter((e) => e.kind === "fp3" && e.workflowId && !e.automationGone)
    .map((e) => [e.name, e.workflowId, buildFp2(t, { guideUrl: e.guideUrl, trigger: tap(`zfunnel3-${e.platformPostId}`) })]);
  // fp4 test funnels (Guide gegen Mail, 2026-10-28) get the same baked-in list ids.
  const t4 = { ...JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/fp4-funnel.json"), "utf8")), knownIds: t.knownIds };
  for (const e of registry().filter((e) => e.kind === "fp4" && e.workflowId && !e.automationGone)) jobs.push([e.name, e.workflowId, buildFp4(t4, { guideUrl: e.guideUrl, trigger: tap(`zfunnel-${e.platformPostId}`) })]);
  // --fp2: old fp2 workflows still finishing in-flight runs get the same list check before their pitch reminder.
  if (has("fp2")) {
    const t2 = { ...JSON.parse(fs.readFileSync(path.join(ROOT, "funnel/fp2-funnel.json"), "utf8")), knownIds: t.knownIds };
    for (const e of registry().filter((e) => e.kind === "fp3" && e.oldKind === "fp2" && e.oldWorkflowId)) jobs.push([`${e.name} (fp2 alt)`, e.oldWorkflowId, buildFp2(t2, { guideUrl: e.guideUrl, trigger: tap(`zfunnel2-${e.platformPostId}`) })]);
  }
  if (flag("credits")) jobs.push(["Credits-Keyword", flag("credits"), buildCredits(t, { trigger: { triggerType: "inbound_message", keywords: [ci(t.creditsRegex)], matchType: "regex", onlyFirstMessage: false } })]);
  if (flag("test")) jobs.push(["Test SKTEST", flag("test"), buildFp2(t, { guideUrl: flag("test-pdf-url"), trigger: tap("SKTEST") })]);
  for (const [name, id, g] of jobs) {
    checkGraph(g);
    if (has("dry")) { console.log(`WOULD ${name} ${id}: ${g.nodes.length} Nodes`); continue; }
    await api("POST", `/workflows/${id}/pause`);
    try { await api("PATCH", `/workflows/${id}`, { nodes: g.nodes, edges: g.edges, entryNodeId: "trigger" }); }
    finally { await api("POST", `/workflows/${id}/activate`); }
    console.log(`${name}: ${g.nodes.length} Nodes, aktiv`);
  }
} else if (cmd === "refresh-guides") {
  // Zernio media under /temp/ expire after about 7 days (2026-10-30: 47 guide links were 404). Re-uploads the local PDF
  // (registry guidePdf, else found by file name under runs/, funnel/ or the Desktop video folders) for every link that is
  // dead or older than --days (default 5) and writes the new URL into the registry. Run `rebuild` afterwards.
  const days = Number(flag("days") ?? 5);
  const reg = registry();
  const roots = [path.join(ROOT, "runs"), path.join(ROOT, "funnel"), path.join(process.env.HOME, "Desktop/Superkind Videos")];
  const find = (name) => { for (const r of roots) { try { const hit = execSync(`find ${JSON.stringify(r)} -name ${JSON.stringify(name)} -not -path "*/node_modules/*" 2>/dev/null | head -1`).toString().trim(); if (hit) return hit; } catch {} } return null; };
  const age = (u) => { const m = u.match(/\/temp\/(\d{13})_/); return m ? (Date.now() - Number(m[1])) / 864e5 : 0; };
  let n = 0;
  for (const e of reg.filter((e) => e.guideUrl && !e.automationGone && (has("all") || /^FP/.test(e.name)))) {
    const status = await fetch(e.guideUrl, { method: "HEAD" }).then((r) => r.status).catch(() => 0);
    if (status === 200 && age(e.guideUrl) < days) continue;
    const pdf = e.guidePdf && fs.existsSync(e.guidePdf) ? e.guidePdf : find(decodeURIComponent(e.guideUrl.split("/").pop()).replace(/^\d+_[a-z0-9]+_(?:[a-f0-9]{16}_)?/, ""));
    if (!pdf) { console.log(`${e.name}: PDF nicht gefunden (${status})`); continue; }
    if (has("dry")) { console.log(`WOULD ${e.name}: ${status} -> ${pdf}`); continue; }
    e.guidePdf = pdf; e.guideUrl = await uploadPdf(pdf); e.guideRefreshedAt = new Date().toISOString(); n++;
    console.log(`${e.name}: neu (${status})`);
  }
  saveRegistry(reg);
  console.log(`${n} Guides neu hochgeladen`);
  // Same for Florent's voice note in the fp3 config (voicePath = local file).
  const cfg = path.join(ROOT, "funnel/fp3-funnel.json"), t = JSON.parse(fs.readFileSync(cfg, "utf8"));
  if (t.voiceUrl && t.voicePath && !has("dry")) {
    const status = await fetch(t.voiceUrl, { method: "HEAD" }).then((r) => r.status).catch(() => 0);
    if (status !== 200 || age(t.voiceUrl) >= days) {
      const buf = fs.readFileSync(path.join(ROOT, t.voicePath));
      const pre = await api("POST", "/media/presign", { filename: path.basename(t.voicePath), contentType: "audio/mp4", size: buf.length });
      const put = await fetch(pre.uploadUrl, { method: "PUT", headers: { "Content-Type": "audio/mp4" }, body: buf });
      if (!put.ok) throw new Error(`Voice-Upload fehlgeschlagen: HTTP ${put.status}`);
      t.voiceUrl = pre.publicUrl; fs.writeFileSync(cfg, JSON.stringify(t, null, 1));
      console.log("Sprachnachricht neu hochgeladen");
    }
  }
} else if (cmd === "rollback") {
  const reg = registry();
  const keys = has("all") ? reg.filter((x) => x.oldWorkflowId).map((x) => x.platformPostId) : args.slice(1);
  for (const k of keys) {
    const e = reg.find((x) => (x.name === k || x.platformPostId === k) && x.oldWorkflowId);
    if (!e) { console.log(`${k}: nichts zurückzurollen`); continue; }
    const a = await api("GET", `/comment-automations/${e.automationId}`);
    const old = ((a.automation ?? a).buttons ?? [])[0] ?? {};
    await api("PATCH", `/comment-automations/${e.automationId}`, { buttons: [{ type: "postback", title: old.title ?? "Ja, schick rüber", payload: `zernio:workflow:${e.oldWorkflowId}` }] });
    Object.assign(e, { kind: e.oldKind, workflowId: e.oldWorkflowId, fp2WorkflowId: e.workflowId });
    delete e.oldKind; delete e.oldWorkflowId;
    console.log(`${e.name}: zurück auf ${e.workflowId}`);
  }
  saveRegistry(reg);
} else if (cmd === "posts") {
  for (const e of registry()) console.log(e.platformPostId, e.account, e.kind, e.automationActive ? "an " : "aus", e.name);
} else if (cmd === "on" || cmd === "off") {
  const reg = registry();
  const keys = has("all") ? reg.filter((x) => x.automationActive !== (cmd === "on")).map((x) => x.platformPostId) : args.slice(1);
  for (const k of keys) {
    const e = reg.find((x) => x.name === k || x.platformPostId === k);
    if (!e) { console.log(`${k}: nicht in der Registry`); continue; }
    await api("PATCH", `/comment-automations/${e.automationId}`, { isActive: cmd === "on" });
    e.automationActive = cmd === "on";
    console.log(`${e.name}: ${cmd}`);
  }
  saveRegistry(reg);
} else if (cmd === "list") {
  const d = await api("GET", "/workflows");
  for (const w of d.workflows ?? []) console.log(w.id, w.status, w.name, `started=${w.totalStarted} completed=${w.totalCompleted} exited=${w.totalExited}`);
} else if (cmd === "activate" || cmd === "pause") {
  console.log(JSON.stringify(await api("POST", `/workflows/${args[1]}/${cmd}`), null, 1));
} else if (cmd === "delete") {
  console.log(JSON.stringify(await api("DELETE", `/workflows/${args[1]}`), null, 1));
} else if (cmd === "runs") {
  const d = await api("GET", `/workflows/${args[1]}/executions`);
  const ex = d.executions ?? d.data ?? [];
  for (const e of ex.slice(0, 10)) {
    console.log(e.id ?? e._id, e.status, e.currentNodeId ?? "", e.startedAt ?? e.createdAt ?? "");
    try {
      const ev = await api("GET", `/workflows/${args[1]}/executions/${e.id ?? e._id}/events`);
      for (const x of (ev.events ?? []).slice(-12)) console.log("   ", x.nodeId ?? "", x.type ?? x.event ?? "", (x.message ?? x.error ?? "").toString().slice(0, 120));
    } catch (err) { console.log("   (events:", err.message.slice(0, 120), ")"); }
  }
} else if (cmd === "leads") {
  const all = [];
  for (let skip = 0; ; skip += 200) {
    const d = await api("GET", `/contacts?tag=superkind-lead&limit=200&skip=${skip}`);
    const cs = d.contacts ?? [];
    all.push(...cs);
    if (cs.length < 200) break;
  }
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [["instagram", "name", "firma", "email", "telefon", "erstellt"]].concat(all.map((c) => {
    const f = c.fields ?? c.customFields ?? {};
    return [c.handle ?? c.username ?? "", f.lead_name ?? c.name ?? "", f.lead_company ?? c.company ?? "", f.lead_email ?? c.email ?? "", f.lead_phone ?? c.phone ?? "", c.createdAt ?? ""];
  }));
  const out = path.resolve(ROOT, flag("out") ?? `funnel/leads-${new Date().toISOString().slice(0, 10)}.csv`);
  fs.writeFileSync(out, rows.map((r) => r.map(esc).join(",")).join("\n"));
  console.log(`${all.length} Leads -> ${path.relative(ROOT, out)}`);
} else if (cmd === "bx-leads") {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const val = (v) => (v && typeof v === "object" ? v.value ?? v.text ?? "" : v ?? "");
  const rows = [["post", "handle", "rolle", "sektor", "team", "qualifiziert", "zeitpunkt"]];
  for (const e of registry().filter((x) => x.kind === "bx")) {
    const d = await api("GET", `/workflows/${e.workflowId}/executions?limit=100`);
    for (const x of d.executions ?? []) {
      const v = x.variables ?? {};
      if (!val(v.bx_role)) continue;
      rows.push([e.name, val(v["contact.handle"]) || x.contactHandle || "", val(v.bx_role), val(v.bx_sector), val(v.bx_team), val(v.bx_sector) ? "ja" : "nein", x.updatedAt ?? x.createdAt ?? ""]);
    }
  }
  const out = path.resolve(ROOT, flag("out") ?? `funnel/bx-leads-${new Date().toISOString().slice(0, 10)}.csv`);
  fs.writeFileSync(out, rows.map((r) => r.map(esc).join(",")).join("\n"));
  console.log(`${rows.length - 1} Felix-Leads -> ${path.relative(ROOT, out)}`);
} else {
  console.error("Befehl: create | posts | on | off | list | activate | pause | delete | runs | leads | bx-leads");
  process.exit(1);
}
