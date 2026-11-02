#!/usr/bin/env node
// Zernio-Konsole: direkte Aufrufe der Zernio-API (https://zernio.com/api/v1), interaktiv oder als Einzelbefehl.
//   node scripts/zernio-console.mjs                       -> interaktiv (Prompt "zernio>")
//   node scripts/zernio-console.mjs GET /accounts         -> ein Aufruf, JSON auf stdout
//   node scripts/zernio-console.mjs posts pickthecompany 5
// Befehle:
//   accounts                      alle verbundenen Accounts (username, _id, Plattform)
//   posts <account> [n] [status]  letzte n Posts (Standard 10, status: published|scheduled|draft)
//   GET <pfad>                    beliebiger Lesezugriff, z. B. GET /analytics?accountId=...
//   POST|PUT|PATCH|DELETE <pfad> [json]   Schreibzugriff, nur nach Bestätigung mit "ja"
//   help, exit
// Key: ZERNIO_API_KEY aus der Umgebung oder broll/.env. Der Key wird nie ausgegeben.
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.join(ROOT, ".env");
const KEY = process.env.ZERNIO_API_KEY || (fs.existsSync(envFile) ? (fs.readFileSync(envFile, "utf8").match(/^ZERNIO_API_KEY=(.+)$/m) || [])[1]?.trim() : "");
if (!KEY) { console.error("ZERNIO_API_KEY fehlt (Umgebungsvariable oder broll/.env)"); process.exit(1); }
const BASE = "https://zernio.com/api/v1";

async function call(method, p, body) {
  if (!p.startsWith("/")) p = "/" + p;
  const r = await fetch(BASE + p, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await r.text();
  let data; try { data = JSON.parse(t); } catch { data = t; }
  return { status: r.status, ok: r.ok, data };
}

const print = (res) => {
  if (!res.ok) console.log(`HTTP ${res.status}`);
  console.log(typeof res.data === "string" ? res.data : JSON.stringify(res.data, null, 2));
};

let accCache;
const accounts = async () => (accCache ??= ((await call("GET", "/accounts")).data.accounts ?? []));
const findAcc = async (name) => (await accounts()).find((a) => [a.username, a.name, a._id].some((v) => (v || "").toLowerCase() === name.toLowerCase()));

async function run(line, ask) {
  const parts = line.trim().match(/^(\S+)\s*(\S*)\s*([\s\S]*)$/);
  if (!parts) return;
  const [, cmd0, a1, rest] = parts;
  const cmd = cmd0.toLowerCase();
  if (cmd === "help") { console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 12).map((l) => l.replace(/^\/\/ ?/, "")).join("\n")); return; }
  if (cmd === "accounts") {
    for (const a of await accounts()) console.log(`${(a.username || a.name || "?").padEnd(24)} ${a._id}  ${a.platform || ""}`);
    return;
  }
  if (cmd === "posts") {
    const acc = await findAcc(a1 || "");
    if (!acc) { console.log("Account nicht gefunden. 'accounts' zeigt alle."); return; }
    const [n = "10", status = "published"] = rest.split(/\s+/).filter(Boolean);
    const d = (await call("GET", `/posts?accountId=${acc._id}&status=${status}&limit=${n}`)).data;
    for (const p of d.posts ?? []) {
      const ig = (p.platforms || [])[0] || {};
      const first = (p.content || "").split("\n").find((s) => s.trim()) || "";
      console.log(`${(p.publishedAt || p.scheduledFor || "").slice(0, 16)}  ${p._id}  ${ig.platformPostUrl || ""}\n    ${first.slice(0, 110)}`);
    }
    return;
  }
  const method = cmd0.toUpperCase();
  if (method === "GET") { print(await call("GET", a1)); return; }
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    let body;
    if (rest.trim()) { try { body = JSON.parse(rest); } catch { console.log("Body ist kein gültiges JSON."); return; } }
    const ok = await ask(`${method} ${a1} wirklich senden? Das ändert Daten auf Zernio. (ja/nein) `);
    if (ok.trim().toLowerCase() !== "ja") { console.log("abgebrochen"); return; }
    print(await call(method, a1, body));
    return;
  }
  console.log("Unbekannter Befehl. 'help' zeigt alle.");
}

const argv = process.argv.slice(2);
if (argv.length) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((res) => rl.question(q, res));
  await run(argv.join(" "), ask).catch((e) => { console.error(e.message); process.exitCode = 1; });
  rl.close();
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "zernio> " });
  const ask = (q) => new Promise((res) => rl.question(q, res));
  console.log("Zernio-Konsole. 'help' für Befehle, 'exit' zum Beenden.");
  rl.prompt();
  for await (const line of rl) {
    if (/^(exit|quit)$/i.test(line.trim())) break;
    if (line.trim()) await run(line, ask).catch((e) => console.error(e.message));
    rl.prompt();
  }
  rl.close();
}
