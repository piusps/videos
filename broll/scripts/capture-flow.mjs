#!/usr/bin/env node
// Captures the real screens of an app click path for a ScreenFlow B-Roll:
// drives a headless Google Chrome over CDP, takes a retina screenshot per
// state and records the exact on-screen rectangle of every element the cursor
// has to hit, so the animated cursor lands on the real button, not a guess.
//
// SAFETY: every non-GET request is blocked (Fetch domain), so typing fake data
// and pressing "Weiter"/"Senden" never submits anything to the real service.
//
// Usage:
//   node scripts/capture-flow.mjs --steps runs/<topic>/flow-steps.json --out runs/<topic>/flow
//
// flow-steps.json:
// { "viewport": {"width": 1440, "height": 900, "dpr": 2},
//   "steps": [
//     {"do": "goto", "url": "https://…"},
//     {"do": "wait", "ms": 1500},
//     {"do": "shot", "name": "start"},
//     {"do": "rect", "sel": "#wl-name", "as": "nameField"},   // first VISIBLE match
//     {"do": "click", "sel": "#wl-name"},
//     {"do": "type", "text": "Max Mustermann"},
//     {"do": "eval", "js": "document.querySelector('…').hidden = false"}  // local DOM only
//     {"do": "textw", "sel": "#wl-name", "as": "nameText"}  // typed text start x + width, for the typing reveal
//   ] }
// Writes <out>/<name>.png and <out>/flow.json ({viewport, shots, rects}), rects in CSS px.

import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 500);

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
if (!args.steps || !args.out) throw new Error("Usage: --steps flow-steps.json --out <dir>");
const spec = JSON.parse(await readFile(args.steps, "utf-8"));
const vp = { width: 1440, height: 900, dpr: 2, ...spec.viewport };
await mkdir(args.out, { recursive: true });

const profile = await mkdtemp(path.join(tmpdir(), "flow-chrome-"));
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", `--window-size=${vp.width},${vp.height}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.find((t) => t.type === "page")) break; } catch {}
  await sleep(200);
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let id = 0;
const pending = new Map();
const blocked = [];
ws.addEventListener("message", async (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
  } else if (msg.method === "Fetch.requestPaused") {
    const { requestId, request } = msg.params;
    if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") {
      blocked.push(`${request.method} ${request.url}`);
      send("Fetch.failRequest", { requestId, errorReason: "BlockedByClient" });
    } else send("Fetch.continueRequest", { requestId });
  }
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Page.enable");
await send("Runtime.enable");
await send("Fetch.enable", { patterns: [{ urlPattern: "*", requestStage: "Request" }] });
await send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr, mobile: false });

const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description ?? ""));
  return r.result.value;
};
const visibleRect = (sel) => evaluate(`(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; });
  if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
})()`);

const flow = { viewport: vp, shots: {}, rects: {}, blocked };
for (const step of spec.steps) {
  if (step.do === "goto") { await send("Page.navigate", { url: step.url }); await sleep(2500); }
  else if (step.do === "wait") await sleep(step.ms ?? 800);
  else if (step.do === "eval") { await evaluate(step.js); await sleep(400); }
  else if (step.do === "rect") {
    const r = await visibleRect(step.sel);
    if (!r) throw new Error(`No visible element for ${step.sel}`);
    flow.rects[step.as] = r;
  } else if (step.do === "click") {
    const r = await visibleRect(step.sel);
    if (!r) throw new Error(`No visible element for ${step.sel}`);
    const x = r.x + r.w / 2, y = r.y + r.h / 2;
    for (const type of ["mouseMoved", "mousePressed", "mouseReleased"]) await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
    await sleep(step.ms ?? 900);
  } else if (step.do === "type") { await send("Input.insertText", { text: step.text }); await sleep(300); }
  else if (step.do === "textw") {
    // Where typed text starts and how wide it is inside a field (for the typing reveal).
    flow.rects[step.as] = await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(step.sel)}); const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      const c = document.createElement('canvas').getContext('2d'); c.font = s.font;
      return { x: r.x + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth), y: r.y, w: c.measureText(el.value).width, h: r.height };
    })()`);
  }
  else if (step.do === "blur") { await evaluate("document.activeElement && document.activeElement.blur()"); await sleep(300); }
  else if (step.do === "shot") {
    const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    const file = path.join(args.out, `${step.name}.png`);
    await writeFile(file, Buffer.from(data, "base64"));
    flow.shots[step.name] = path.basename(file);
  } else throw new Error(`Unknown step ${step.do}`);
}

await writeFile(path.join(args.out, "flow.json"), JSON.stringify(flow, null, 2));
console.log(`Captured ${Object.keys(flow.shots).length} screens, ${Object.keys(flow.rects).length} rects. Blocked requests: ${blocked.length ? blocked.join(", ") : "none"}`);
ws.close();
chrome.kill();
