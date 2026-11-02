// Zernio DM-funnel leads -> "Waitlist Superkind" Google Sheet (Pius 2026-10-19: "alle 2 Tage die Leads aus Zernio ins Sheet").
// Zernio has no Sheets integration, so this script only prepares rows; a scheduled Claude task appends them with the
// Google Sheets connector and then confirms with `mark`.
//
//   node scripts/zernio-leads-sync.mjs collect [--include-test]   completed funnel runs -> funnel/sync/pending.json (prints counts only)
//   node scripts/zernio-leads-sync.mjs mark                       after the append: pending emails -> funnel/sync/synced.json
//   node scripts/zernio-leads-sync.mjs block <sheet.json> [--dry]   waitlist rows -> Instagram ids blocked in every FP funnel
//
// block (Pius 2026-10-26: people on the waitlist must not get voice notes / follow-ups again): sheet.json is the raw
// get_values result of Tabellenblatt1!A:I (header + rows). Each row is looked up in all florent_preusser DM chats by
// mail, phone (last 8 digits) or full name in the incoming messages, or full name in the Instagram name/username.
// A hit with a Zernio contact gets the tags superkind-lead + liste-abgleich, a hit without one (InstantDM era) goes into
// funnel/known-ids.json. When the blocked id set changed, it runs zernio-funnel rebuild --fp2 + late --update, because
// waiting runs only see list members by the ids baked into the graph. Chats are cached in funnel/sync/chats.json and
// only re-read when updatedTime changed. Prints counts only.
//
// Rows match the sheet header Vorname,Nachname,Email,Telefonnummer,Firma,Zeitpunkt,Sprache,Seite,Typ.
// fp2 (2026-10-23): Typ "Firmenmail", or "Telefon (keine Firmenmail)" for company + website + phone rows (no email; key tel:<digits> in synced.json).
// Typ comes from the qualifying funnel (fpq, Pius 2026-10-22): pitch_solo / pitch_team / pitch_emp -> Allein / Freelancer,
// Firma mit Team, Angestellt; older fp funnels -> "unbekannt (alter Funnel)". Solo leads may use freemail and role mails.
// Every run with a valid lead_email counts, not only completed ones (the optional phone step can keep a run open for 20 h). Every cell is sent with a
// leading apostrophe so Sheets keeps it as text (+49 numbers, "19.10.2026 20:15", formula injection).
// Same rules as the funnel (funnel/rules.mjs): freemail / role / fake emails are dropped (solo: only fake), fake or invalid phones are blanked.
// Seite is "Instagram (Zernio)", like the older "Instagram (InstantDM)" rows. Workflows with "test" in the name are skipped unless --include-test.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EMAIL_FORMAT, EMAIL_FREE, EMAIL_ROLE, EMAIL_FAKE_DOMAIN, PHONE_VALID, PHONE_FAKE, SITE_DOMAIN, SITE_FREE } from "../funnel/rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const KEY = (ENV.match(/^ZERNIO_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error("ZERNIO_API_KEY fehlt in broll/.env"); process.exit(1); }
const BASE = "https://zernio.com/api/v1";
const api = async (p, method = "GET", body) => {
  for (let i = 0; ; i++) {
    const r = await fetch(BASE + p, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
    const txt = await r.text();
    // 600 requests/min; the first block run reads every chat once.
    if (r.status === 429 && i < 30) { await new Promise((s) => setTimeout(s, ((JSON.parse(txt).details?.retryAfterSeconds ?? 5) + 1) * 1000)); continue; }
    if (!r.ok) throw new Error(`${method} ${p} -> HTTP ${r.status}: ${txt.slice(0, 200)}`);
    return JSON.parse(txt);
  }
};
const args = process.argv.slice(2);
const cmd = args[0];
const DIR = path.join(ROOT, "funnel/sync");
const PENDING = path.join(DIR, "pending.json");
const SYNCED = path.join(DIR, "synced.json");
fs.mkdirSync(DIR, { recursive: true });
const readJson = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : d);

const re = (s) => new RegExp(s, "i");
const R = { format: re(EMAIL_FORMAT), free: re(EMAIL_FREE), role: re(EMAIL_ROLE), fake: re(EMAIL_FAKE_DOMAIN), phoneOk: re(PHONE_VALID), phoneFake: re(PHONE_FAKE), site: re(SITE_DOMAIN), siteFree: re(SITE_FREE) };
const val = (v) => (v && typeof v === "object" ? v.value ?? v.text ?? "" : v ?? "").toString().replace(/\s+/g, " ").trim();
const berlin = (iso) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
    .formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`;
};
const txt = (s) => (s ? `'${String(s).slice(0, 120)}` : "");

const pageAll = async (p, key) => {
  const out = [];
  for (let skip = 0; ; skip += 100) {
    const d = await api(`${p}${p.includes("?") ? "&" : "?"}limit=100&skip=${skip}`);
    const items = d[key] ?? [];
    out.push(...items);
    if (items.length < 100 || d.pagination?.hasMore === false) break;
  }
  return out;
};

if (cmd === "collect") {
  const synced = new Set(readJson(SYNCED, []).map((e) => e.toLowerCase()));
  const wfs = (await api("/workflows")).workflows ?? [];
  // Only the Superkind waitlist funnels (FP); GPT and Felix funnels collect no waitlist data.
  const use = wfs.filter((w) => /^FPQ? Funnel/i.test(w.name ?? "") && (args.includes("--include-test") || !/test/i.test(w.name ?? "")));
  const stats = { funnels: use.length, runs: 0, leads: 0, schon_im_sheet: 0, abgelehnt_freemail: 0, abgelehnt_rollenmail: 0, abgelehnt_fake: 0, abgelehnt_format: 0, telefon_geleert: 0, doppelt: 0, neu: 0 };
  const rows = [], emails = [], seen = new Set();
  for (const w of use) {
    const fp2 = /fp[234]/.test(w.description ?? "") || /Credits-Keyword/.test(w.name ?? "");
    const fp4 = /fp4/.test(w.description ?? "");
    const runs = await pageAll(`/workflows/${w.id ?? w._id}/executions`, "executions");
    for (const x of runs) {
      stats.runs++;
      const v = x.variables ?? {};
      // Own test accounts never go into the sheet.
      if (/^onlywithpius\b/i.test(val(v.contact?.name) || val(v.contact?.handle))) continue;
      let email = val(v.lead_email).toLowerCase();
      // fp4 (2026-10-28, Guide gegen Mail): second answers sit in lead_email_retry. A business mail from either wins; a role
      // mail is only accepted by the funnel after one push ("Rollenmail (Notfall)"); freemail + website = "Teil-Lead".
      let typ4 = "";
      if (fp4) {
        const ok = (m) => R.format.test(m) && !R.fake.test(m);
        const cands = [val(v.lead_email_retry).toLowerCase(), email].filter(ok);
        const biz = cands.find((m) => !R.free.test(m) && !R.role.test(m));
        const role = cands.find((m) => !R.free.test(m) && R.role.test(m));
        const site = val(v.lead_company);
        if (biz) { email = biz; typ4 = "Firmenmail"; }
        else if (role) { email = role; typ4 = "Rollenmail (Notfall)"; }
        else if (cands[0] && R.site.test(site) && !R.siteFree.test(site)) { email = cands[0]; typ4 = "Teil-Lead (Freemail + Website)"; }
        else continue;
      }
      // fp2 (2026-10-23): no business mail -> company with website + valid phone is a lead too (dedupe key tel:<digits>).
      const company = val(v.lead_company), phoneRaw = val(v.lead_phone);
      const bizMail = R.format.test(email) && !R.free.test(email) && !R.role.test(email) && !R.fake.test(email);
      if (fp2 && !fp4 && !bizMail && R.site.test(company) && !R.siteFree.test(company) && R.phoneOk.test(phoneRaw) && !R.phoneFake.test(phoneRaw)) {
        const key = `tel:${phoneRaw.replace(/\D/g, "").replace(/^(?:0049|49|0)/, "")}`;
        stats.leads++;
        if (synced.has(key)) { stats.schon_im_sheet++; continue; }
        if (seen.has(key)) { stats.doppelt++; continue; }
        seen.add(key);
        rows.push(["", "", "", txt(phoneRaw), txt(company), txt(berlin(x.completedAt ?? x.updatedAt ?? x.createdAt)), "de", "Instagram (Zernio)", "Telefon (keine Firmenmail)"]);
        emails.push(key);
        continue;
      }
      if (!email) continue;
      stats.leads++;
      const typ = typ4 || (val(v.pitch_solo) ? "Allein / Freelancer" : val(v.pitch_team) ? "Firma mit Team" : val(v.pitch_emp) ? "Angestellt" : fp2 ? "Firmenmail" : "unbekannt (alter Funnel)");
      const solo = typ === "Allein / Freelancer";
      if (!R.format.test(email)) { stats.abgelehnt_format++; continue; }
      if (!solo && !typ4 && R.free.test(email)) { stats.abgelehnt_freemail++; continue; }
      if (!solo && !typ4 && R.role.test(email)) { stats.abgelehnt_rollenmail++; continue; }
      if (R.fake.test(email)) { stats.abgelehnt_fake++; continue; }
      if (synced.has(email)) { stats.schon_im_sheet++; continue; }
      if (seen.has(email)) { stats.doppelt++; continue; }
      seen.add(email);
      let phone = val(v.lead_phone);
      if (phone && (R.phoneFake.test(phone) || !R.phoneOk.test(phone))) { phone = ""; stats.telefon_geleert++; }
      // fp2 asks no name: derive it from vorname.nachname@ when possible.
      const local = email.split("@")[0];
      const guess = !val(v.lead_name) && /^[a-zäöüß]{2,}[._-][a-zäöüß]{2,}$/.test(local) ? local.split(/[._-]/).map((p) => p[0].toUpperCase() + p.slice(1)).join(" ") : "";
      const [first, ...rest] = (val(v.lead_name) || guess).split(" ");
      rows.push([txt(first), txt(rest.join(" ")), txt(email), txt(phone), txt(val(v.lead_company) || (fp4 ? email.split("@")[1] : "")), txt(berlin(x.completedAt ?? x.updatedAt ?? x.createdAt)),
        "de", "Instagram (Zernio)", typ]);
      emails.push(email);
    }
  }
  stats.neu = rows.length;
  fs.writeFileSync(PENDING, JSON.stringify({ createdAt: new Date().toISOString(), emails, rows }, null, 1));
  console.log(JSON.stringify(stats));
  console.log(`pending: ${path.relative(ROOT, PENDING)} (${rows.length} Zeilen)`);
} else if (cmd === "mark") {
  const p = readJson(PENDING, null);
  if (!p) { console.log("nichts zu markieren"); process.exit(0); }
  const synced = new Set(readJson(SYNCED, []));
  p.emails.forEach((e) => synced.add(e));
  fs.writeFileSync(SYNCED, JSON.stringify([...synced], null, 1));
  fs.unlinkSync(PENDING);
  console.log(`${p.emails.length} als synchronisiert markiert, gesamt ${synced.size}`);
} else if (cmd === "block") {
  const ACC = "6ad1f3276d875a165b145114"; // florent_preusser
  // Workflows that carry the lead check besides the registry ones (see zernio-funnel.mjs rebuild / late).
  const CREDITS = "6adf702a4596241c52b36767", TEST = "6adf6fd9dab5d7442f85bde5", LATE = "6adf8c2ae864c6775fc8b7b1";
  const TEST_PDF = "https://media.zernio.com/temp/1793023352658_7hb99tpj_maps-guidebook.pdf";
  const KNOWN = path.join(ROOT, "funnel/known-ids.json"), CHATS = path.join(DIR, "chats.json"), BAKED = path.join(DIR, "baked-ids.json");
  const sheet = readJson(args[1] ?? "", null);
  if (!sheet) { console.error("block braucht die get_values-Antwort als JSON-Datei"); process.exit(1); }
  const dry = args.includes("--dry");
  const norm = (s) => (s || "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");
  const tail = (s) => (s || "").replace(/\D/g, "").replace(/^(?:0049|49|0043|43|0041|41|0)/, "").slice(-8);
  const cell = (r, i) => String(r[i] ?? "").replace(/^'/, "").trim();
  const rows = (sheet.values ?? sheet).slice(1).filter((r) => cell(r, 2) || cell(r, 3))
    .filter((r) => !/@superkind\.ai$/i.test(cell(r, 2))); // own test entries
  // Chats: list all, re-read messages only for changed ones.
  const cache = readJson(CHATS, {});
  const convs = [];
  for (let cursor = ""; ;) {
    const d = await api(`/inbox/conversations?accountId=${ACC}&limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
    convs.push(...(d.data ?? []));
    if (!d.pagination?.hasMore) break;
    cursor = d.pagination.nextCursor;
  }
  const stale = convs.filter((c) => cache[c.id]?.t !== c.updatedTime);
  let i = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (i < stale.length) {
      const c = stale[i++];
      const d = await api(`/inbox/conversations/${c.id}/messages?accountId=${ACC}&limit=100`);
      cache[c.id] = { t: c.updatedTime, u: c.participantUsername ?? "", n: c.participantName ?? "",
        txt: (d.messages ?? []).filter((m) => m.direction === "incoming").map((m) => m.message ?? m.text ?? "").join("\n") };
    }
  }));
  fs.writeFileSync(CHATS, JSON.stringify(cache));
  const chats = Object.entries(cache).map(([id, c]) => ({ id, who: norm(`${c.u} ${c.n}`).replace(/[._\d]+/g, " "), txt: norm(c.txt), dig: c.txt.replace(/[^\d\n]/g, "").split("\n").map(tail) }));
  const stats = { zeilen: rows.length, chats_neu_gelesen: stale.length, gefunden: 0, nicht_gefunden: 0, neu_getaggt: 0, neu_ohne_kontakt: 0 };
  const hitIds = new Set();
  for (const r of rows) {
    const mail = norm(cell(r, 2)).replace(/\.coml$/, ".com"), tel = tail(cell(r, 3));
    const first = norm(cell(r, 0)), last = norm(cell(r, 1)), full = first.length > 2 && last.length > 2 ? `${first} ${last}` : "";
    const hits = chats.filter((c) => (mail.includes("@") && c.txt.includes(mail)) || (tel.length === 8 && c.dig.includes(tel))
      || (full && (c.txt.includes(full) || c.who.includes(full) || c.who.replace(/ /g, "").includes(full.replace(/ /g, "")))));
    hits.forEach((h) => hitIds.add(h.id));
    stats[hits.length ? "gefunden" : "nicht_gefunden"]++;
  }
  // Tag hits that have a contact, park the rest in known-ids.json.
  const contacts = new Map();
  for (let skip = 0; ; skip += 100) {
    const d = await api(`/contacts?limit=100&skip=${skip}`);
    for (const c of d.contacts ?? []) if (/^\d+$/.test(c.platformIdentifier ?? "")) contacts.set(c.platformIdentifier, c);
    if (!d.pagination?.hasMore) break;
  }
  const known = readJson(KNOWN, {});
  for (const id of hitIds) {
    const c = contacts.get(id);
    if (c) {
      if ((c.tags ?? []).includes("superkind-lead")) continue;
      stats.neu_getaggt++;
      if (!dry) await api(`/contacts/${c._id ?? c.id}`, "PATCH", { tags: [...new Set([...(c.tags ?? []), "superkind-lead", "liste-abgleich"])] });
      c.tags = [...(c.tags ?? []), "superkind-lead"];
    } else if (!known[id]) {
      stats.neu_ohne_kontakt++;
      known[id] = `Liste (${cache[id]?.u || id})`;
    }
  }
  if (!dry) fs.writeFileSync(KNOWN, JSON.stringify(known, null, 1) + "\n");
  // Same id set as zernio-funnel leadIds(); rebuild only when it changed since the last bake.
  const ids = [...new Set([...Object.keys(known), ...[...contacts.values()].filter((c) => (c.tags ?? []).includes("superkind-lead")).map((c) => c.platformIdentifier)])].sort();
  const changed = JSON.stringify(ids) !== JSON.stringify(readJson(BAKED, []));
  Object.assign(stats, { gesperrte_ids: ids.length, rebuild: changed && !dry });
  if (changed && !dry) {
    const { execFileSync } = await import("child_process");
    const run = (...a) => execFileSync("node", [path.join(ROOT, "scripts/zernio-funnel.mjs"), ...a], { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"] }).toString();
    const out = run("rebuild", "--fp2", "--credits", CREDITS, "--test", TEST, "--test-pdf-url", TEST_PDF) + run("late", "--update", LATE);
    stats.workflows_aktiv = (out.match(/aktiv/g) ?? []).length;
    fs.writeFileSync(BAKED, JSON.stringify(ids, null, 1));
  }
  console.log(JSON.stringify(stats));
} else {
  console.error("Befehl: collect [--include-test] | mark | block <sheet.json> [--dry]");
  process.exit(1);
}
