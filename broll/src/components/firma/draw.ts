// Firma series engine — canvas drawing (cards, plan board, counter, table, mock-ups). Look = Tag 1 v7.
import { canvasTex, roundRect } from "../Voxel3D";
import { SKC, fitFont, drawIcon, drawShirtGlyph, back, bump } from "../ShirtWorld3D";
import type { CardIcon } from "./schema";

export const NAVY = "#141C33", GOLD = "#E8B64C", CYAN = "#6FE3F0", GREEN = "#2FBF71";
const cl = (v: number) => Math.max(0, Math.min(1, v));

export const dieCut = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, border = 14) => {
  c.save();
  c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 18; c.shadowOffsetY = 8;
  c.fillStyle = "#FFFFFF"; roundRect(c, x, y, w, h, r); c.fill();
  c.restore();
  c.fillStyle = fill; roundRect(c, x + border, y + border, w - 2 * border, h - 2 * border, Math.max(4, r - border)); c.fill();
};
export const centerText = (c: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, maxW: number, col: string, w = 900) => {
  const f = fitFont(c, text, size, maxW, w);
  c.font = `${w} ${f}px Rubik`; c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(text, x, y);
  return f;
};
export const glyph = (c: CanvasRenderingContext2D, icon: CardIcon, x: number, y: number, s: number) => {
  if (!["glove", "cape", "bag", "more"].includes(icon)) { drawIcon(c, icon as any, x, y, s); return; }
  c.save(); c.translate(x, y); c.lineJoin = "round"; c.lineCap = "round";
  c.lineWidth = s * 0.07; c.strokeStyle = SKC.INK;
  if (icon === "glove") {
    c.fillStyle = "#F5C542";
    c.beginPath();
    c.moveTo(-s * 0.28, s * 0.42); c.lineTo(-s * 0.3, -s * 0.05);
    [-0.24, -0.08, 0.08, 0.24].forEach((fx, i) => { const top = -s * (0.42 - Math.abs(i - 1.5) * 0.04); c.lineTo(s * fx - s * 0.06, top + s * 0.06); c.quadraticCurveTo(s * fx, top - s * 0.04, s * fx + s * 0.06, top + s * 0.06); });
    c.lineTo(s * 0.3, s * 0.0); c.quadraticCurveTo(s * 0.46, -s * 0.12, s * 0.42, s * 0.06); c.lineTo(s * 0.28, s * 0.42); c.closePath();
    c.fill(); c.stroke();
    c.fillStyle = "#3E6FD8"; c.fillRect(-s * 0.3, s * 0.3, s * 0.58, s * 0.14); c.strokeRect(-s * 0.3, s * 0.3, s * 0.58, s * 0.14);
  } else if (icon === "cape") {
    c.fillStyle = "#7A5AE0";
    c.beginPath(); c.moveTo(-s * 0.16, -s * 0.36); c.lineTo(s * 0.16, -s * 0.36); c.lineTo(s * 0.44, s * 0.4); c.quadraticCurveTo(0, s * 0.5, -s * 0.44, s * 0.4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#FFFFFF"; c.beginPath(); c.ellipse(0, -s * 0.36, s * 0.2, s * 0.08, 0, 0, 7); c.fill(); c.stroke();
  } else if (icon === "bag") {
    c.fillStyle = "#D9A66B";
    c.beginPath(); c.moveTo(-s * 0.3, -s * 0.3); c.lineTo(s * 0.3, -s * 0.3); c.lineTo(s * 0.36, s * 0.42); c.lineTo(-s * 0.36, s * 0.42); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-s * 0.3, -s * 0.3); c.lineTo(-s * 0.2, -s * 0.42); c.lineTo(s * 0.2, -s * 0.42); c.lineTo(s * 0.3, -s * 0.3); c.stroke();
    c.fillStyle = "#FFFFFF"; c.fillRect(-s * 0.18, -s * 0.02, s * 0.36, s * 0.2);
  } else {
    c.fillStyle = "#FFFFFF";
    [-1, 0, 1].forEach((k) => { c.beginPath(); c.arc(k * s * 0.24, 0, s * 0.09, 0, 7); c.fill(); c.stroke(); });
  }
  c.restore();
};

// ---------- wall card ----------
export type SlotS = { fill: number; cross: number; keep: number; dim: number; hl: number };
export const drawSlot = (c: CanvasRenderingContext2D, w: number, h: number, card: { label: string; icon: CardIcon }, s: SlotS, t: number) => {
  c.clearRect(0, 0, w, h);
  if (s.fill < 0.5) {
    c.setLineDash([26, 18]); c.lineWidth = 8; c.strokeStyle = "rgba(111,227,240,.75)";
    roundRect(c, 14, 14, w - 28, h - 28, 34); c.stroke(); c.setLineDash([]);
    c.fillStyle = "rgba(111,227,240,.08)"; roundRect(c, 14, 14, w - 28, h - 28, 34); c.fill();
    centerText(c, "?", w / 2, h / 2 + 8, 210 + 14 * Math.sin(t * 5), w, "rgba(111,227,240,.9)");
    return;
  }
  dieCut(c, 0, 0, w, h, 46, s.keep > 0.01 ? "#FFF1E3" : "#FFFDF8", 16);
  if (s.hl > 0.01 || s.keep > 0.01) { c.lineWidth = 14; c.strokeStyle = SKC.OR; roundRect(c, 22, 22, w - 44, h - 44, 32); c.stroke(); }
  const two = card.label.split("\n");
  if (two.length > 1) {
    // two-line label (name + value), bigger band, icon a bit smaller
    glyph(c, card.icon, w / 2, h * 0.3, 160);
    c.fillStyle = SKC.INK; roundRect(c, 34, h - 222, w - 68, 186, 24); c.fill();
    const f0 = Math.min(...two.map((ln) => fitFont(c, ln, 74, w - 110)));
    centerText(c, two[0], w / 2, h - 172, f0, w - 110, "#FFFFFF");
    centerText(c, two[1], w / 2, h - 88, Math.min(f0, 70), w - 110, "#FFD08A");
  } else {
    glyph(c, card.icon, w / 2, h * 0.4, 200);
    c.fillStyle = SKC.INK; roundRect(c, 40, h - 150, w - 80, 106, 22); c.fill();
    centerText(c, card.label, w / 2, h - 96, 72, w - 120, "#FFFFFF");
  }
  if (s.dim > 0.01) { c.fillStyle = `rgba(20,28,51,${0.5 * s.dim})`; roundRect(c, 16, 16, w - 32, h - 32, 30); c.fill(); }
  if (s.cross > 0.001) {
    c.lineCap = "round";
    [["#FFFFFF", 64], [SKC.INK, 48], [SKC.RED, 32]].forEach(([col, lw]) => {
      c.strokeStyle = col as string; c.lineWidth = lw as number; c.beginPath();
      const L = w * 0.3, Hh = h * 0.3, k1 = Math.min(1, s.cross * 2), k2 = Math.max(0, s.cross - 0.5) * 2;
      c.moveTo(w / 2 - L, h / 2 - Hh); c.lineTo(w / 2 - L + 2 * L * k1, h / 2 - Hh + 2 * Hh * k1);
      if (k2 > 0) { c.moveTo(w / 2 + L, h / 2 - Hh); c.lineTo(w / 2 + L - 2 * L * k2, h / 2 - Hh + 2 * Hh * k2); }
      c.stroke();
    });
  }
};

// ---------- GRÜNDUNGSPLAN board (page of 9; tiles from JSON; done tiles with check) ----------
// lastI/lastK: last done step lights up (recap) and from then on shows lastLabel (result of the previous episode); todayI/todayK: today's step glows gold
export type PlanS = { cur: number; done: number; next: number; pulse: number; cas: number; steps: number; head: number; lastI?: number; lastK?: number; lastOn?: number; todayI?: number; todayK?: number };
export type PlanCfg = { title: string; sub?: string; steps: string[]; current: number; page: number; done: Set<number>; casD: number; lastLabel?: string; wip?: Set<number> }; // wip = "in Arbeit" (orange, no check)
// tile geometry of the plan texture (px in the 1600×1220 canvas) — used by the recap camera / overlays
export const PLAN_TEX = { w: 1600, h: 1220 };
export const planTileRect = (li: number, w = PLAN_TEX.w, h = PLAN_TEX.h) => {
  const gx = 60, gy = 230, gw = w - 120, gh = h - 290, gap = 30;
  const tw = (gw - 2 * gap) / 3, th = (gh - 2 * gap) / 3;
  return { x: gx + (li % 3) * (tw + gap), y: gy + Math.floor(li / 3) * (th + gap), w: tw, h: th };
};
const check = (c: CanvasRenderingContext2D, x: number, y: number, k: number, r = 66) => {
  c.save(); c.translate(x, y); c.scale(k, k);
  c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
  c.fillStyle = GREEN; c.beginPath(); c.arc(0, 0, r * 0.82, 0, 7); c.fill();
  c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.24; c.lineCap = "round"; c.beginPath(); c.moveTo(-r * 0.36, r * 0.03); c.lineTo(-r * 0.09, r * 0.3); c.lineTo(r * 0.39, -r * 0.24); c.stroke();
  c.restore();
};
const ORANGE_WIP = "#FF8A3D";
export const drawPlan = (c: CanvasRenderingContext2D, w: number, h: number, P: PlanCfg, s: PlanS, t: number) => {
  c.clearRect(0, 0, w, h);
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1D2B52"); g.addColorStop(1, "#111A33");
  c.fillStyle = g; roundRect(c, 0, 0, w, h, 60); c.fill();
  c.strokeStyle = "rgba(111,227,240,.07)"; c.lineWidth = 2;
  for (let x = 40; x < w; x += 70) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
  for (let y = 40; y < h; y += 70) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.lineWidth = 16; c.strokeStyle = GOLD; roundRect(c, 8, 8, w - 16, h - 16, 54); c.stroke();
  const tiles = P.steps.slice(P.page * 9, P.page * 9 + 9);
  c.textAlign = "left"; c.textBaseline = "middle";
  c.globalAlpha = s.head;
  const tf = fitFont(c, P.title, 118, w * 0.62);
  c.font = `900 ${tf}px Rubik`; c.fillStyle = "#FFFFFF"; c.fillText(P.title, 70, 128);
  c.globalAlpha = 1;
  const hw = c.measureText(P.title).width;
  if (s.steps > 0.001) {
    const sub = P.sub ?? (P.page > 0 ? `· PHASE ${P.page + 1}` : `· ${tiles.length} SCHRITTE`);
    const k = back(s.steps), sx0 = 70 + hw + 26;
    c.save(); c.translate(sx0 + 150, 136); c.scale(k * (1 + 0.5 * (1 - Math.min(1, s.steps))), k); c.rotate(-0.05 * (1 - Math.min(1, s.steps)));
    c.font = "900 50px Rubik"; c.fillStyle = GOLD; c.fillText(sub, -150, 0); c.restore();
  }
  const gx = 60, gy = 230, gw = w - 120, gh = h - 290, gap = 30;
  const tw = (gw - 2 * gap) / 3, th = (gh - 2 * gap) / 3;
  tiles.forEach((label, li) => {
    const gi = P.page * 9 + li;
    const x = gx + (li % 3) * (tw + gap), y = gy + Math.floor(li / 3) * (th + gap);
    const tk = cl((s.cas - li * P.casD) / 0.16), tcx = x + tw / 2, tcy = y + th / 2;
    if (tk < 0.5) {
      const k = Math.max(0.02, 1 - 2 * tk);
      c.save(); c.translate(tcx, tcy); c.scale(1, k); c.translate(-tcx, -tcy);
      c.fillStyle = "rgba(26,39,71,.55)"; roundRect(c, x, y, tw, th, 34); c.fill();
      c.setLineDash([26, 18]); c.lineWidth = 6; c.strokeStyle = "rgba(111,227,240,.4)"; roundRect(c, x, y, tw, th, 34); c.stroke(); c.setLineDash([]);
      c.textAlign = "center"; c.textBaseline = "middle"; c.font = "900 110px Rubik"; c.fillStyle = "rgba(111,227,240,.22)"; c.fillText("?", tcx, tcy + 6);
      c.restore();
      return;
    }
    const u2 = Math.min(1, (tk - 0.5) * 2), sy2 = Math.max(0.02, back(u2));
    c.save(); c.translate(tcx, tcy); c.scale(1 + 0.08 * (1 - u2), sy2); c.translate(-tcx, -tcy);
    const isCur = gi === P.current, isNext = gi === P.current + 1, wasDone = P.done.has(gi) && !isCur;
    // a current step that is already listed in plan.done (episode deepens a finished step) is drawn done
    const done = isCur ? (P.done.has(gi) ? 1 : s.done) : wasDone ? 1 : 0;
    const isLast = s.lastI === gi, lastK = isLast ? s.lastK ?? 0 : 0;
    const wip = !!P.wip?.has(gi) && !isCur && done < 0.5;
    const isToday = s.todayI === gi, todayK = isToday ? s.todayK ?? 0 : 0;
    const glowK = Math.max(isCur ? s.cur * (1 - done) : isNext ? s.next : 0, lastK, todayK);
    c.save();
    if (lastK > 0.01 || todayK > 0.01) { const sc = 1 + 0.06 * lastK + 0.09 * todayK; c.translate(tcx, tcy); c.scale(sc, sc); c.translate(-tcx, -tcy); }
    c.save();
    if (glowK > 0.01) { c.shadowColor = lastK > todayK ? (wip ? ORANGE_WIP : GREEN) : isCur || isToday ? GOLD : CYAN; c.shadowBlur = (lastK > 0.01 || todayK > 0.01 ? 90 : 50) * glowK * (0.8 + 0.2 * Math.sin(t * 6)); }
    c.fillStyle = wip ? `rgba(110,52,20,${0.75 + 0.25 * lastK})` : done > 0.5 ? (lastK > 0.01 ? `rgb(${22 + 30 * lastK},${69 + 60 * lastK},${47 + 30 * lastK})` : "#16452F") : isCur || todayK > 0.01 ? `rgba(70,56,24,${0.55 + 0.45 * Math.max(s.cur, todayK)})` : isNext && s.next > 0.01 ? "#173A55" : "#1A2747";
    roundRect(c, x, y, tw, th, 34); c.fill();
    c.restore();
    c.lineWidth = glowK > 0.01 || done > 0.5 ? 12 : 5;
    c.strokeStyle = todayK > 0.3 ? GOLD : wip ? ORANGE_WIP : done > 0.5 ? GREEN : isCur ? GOLD : isNext && s.next > 0.01 ? CYAN : "rgba(111,227,240,.28)";
    roundRect(c, x, y, tw, th, 34); c.stroke();
    c.globalAlpha = isCur || wasDone || isToday || wip || (isNext && s.next > 0.01) ? 1 : 0.62;
    c.textAlign = "left"; c.textBaseline = "alphabetic";
    const num = String(gi + 1);
    // labels big enough for the phone (≈3 % frame height in the recap framing): number smaller, label up to 92 px
    c.font = `900 ${num.length > 1 ? 84 : 96}px Rubik`; c.fillStyle = isCur ? (done > 0.5 ? "#9BF0C2" : GOLD) : wasDone ? "#9BF0C2" : "#FFFFFF"; c.fillText(num, x + 30, y + 104);
    const result = isLast && P.lastLabel && (s.lastOn ?? 0) > 0 ? P.lastLabel : undefined;
    const lines = (result ?? label).split("\n");
    const maxF = lines.length > 1 ? 66 : 92;
    const f0 = Math.min(...lines.map((ln) => fitFont(c, ln, maxF, tw - 52)));
    lines.forEach((ln, k) => {
      c.font = `900 ${f0}px Rubik`; c.fillStyle = result ? "#FFFFFF" : "#FFFFFF";
      c.fillText(ln, x + 28, y + th - 30 - (lines.length - 1 - k) * f0 * 1.02);
    });
    if (result) { // small original step name above the result
      c.font = "900 40px Rubik"; c.fillStyle = wip ? "#FFC7A8" : "#9BF0C2"; c.textAlign = "left";
      c.fillText(label.replace("\n", " "), x + 130, y + 92);
    }
    c.globalAlpha = 1;
    c.restore();
    if (isCur && done < 0.5) {
      const qs = 1 + 0.25 * s.pulse;
      c.save(); c.translate(x + tw - 92, y + 96); c.scale(qs, qs);
      c.font = "900 150px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = GOLD; c.fillText("?", 0, 6); c.restore();
    }
    if (done > 0.01) check(c, x + tw - 80, y + 80, (isCur && !P.done.has(gi) ? Math.min(1.25, back(done)) : 0.78) * (1 + 0.25 * lastK));
    if (wip && !result) { // "IN ARBEIT" chip (top right)
      c.save(); c.font = "900 40px Rubik"; c.textAlign = "right"; c.fillStyle = ORANGE_WIP; c.fillText("IN ARBEIT", x + tw - 30, y + 84); c.restore();
    }
    if (wip && result) { c.save(); c.font = "900 34px Rubik"; c.textAlign = "right"; c.fillStyle = ORANGE_WIP; c.fillText("IN ARBEIT", x + tw - 28, y + 46); c.restore(); }
    if (isNext && s.next > 0.01) {
      c.save(); c.globalAlpha = s.next; c.font = "900 42px Rubik"; c.textAlign = "right"; c.fillStyle = CYAN; c.fillText("MORGEN", x + tw - 30, y + 84); c.restore();
    }
    if (u2 < 1) { c.globalAlpha = 0.75 * (1 - u2); c.fillStyle = "#FFFFFF"; roundRect(c, x, y, tw, th, 34); c.fill(); c.globalAlpha = 1; }
    c.restore();
  });
};

// ---------- odometer counter ----------
export const drawCounter = (c: CanvasRenderingContext2D, w: number, h: number, value: number, label: string, pulse: number, digits = 3) => {
  c.clearRect(0, 0, w, h);
  c.fillStyle = "#0E1428"; roundRect(c, 0, 0, w, h, 40); c.fill();
  c.lineWidth = 14; c.strokeStyle = GOLD; roundRect(c, 7, 7, w - 14, h - 14, 34); c.stroke();
  const dw = Math.min(150, (w - 100 - (digits - 1) * 16) / digits), dh = 200, x0 = (w - digits * dw - (digits - 1) * 16) / 2, y0 = 44;
  for (let i = 0; i < digits; i++) {
    const p = Math.pow(10, digits - 1 - i);
    const raw = value / p;
    const d = Math.floor(raw) % 10;
    const frac = digits - 1 - i === 0 ? raw - Math.floor(raw) : cl(((value % p) - (p - 1)));
    const x = x0 + i * (dw + 16);
    c.save(); c.fillStyle = "#F6EEDC"; roundRect(c, x, y0, dw, dh, 18); c.fill(); c.clip();
    c.font = `900 ${Math.round(170 * dw / 150)}px Rubik`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = SKC.INK;
    c.fillText(String(d), x + dw / 2, y0 + dh / 2 + 8 - frac * dh);
    c.fillText(String((d + 1) % 10), x + dw / 2, y0 + dh / 2 + 8 + dh - frac * dh);
    const gr = c.createLinearGradient(0, y0, 0, y0 + dh); gr.addColorStop(0, "rgba(0,0,0,.35)"); gr.addColorStop(0.25, "rgba(0,0,0,0)"); gr.addColorStop(0.75, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.35)");
    c.fillStyle = gr; c.fillRect(x, y0, dw, dh);
    c.restore();
  }
  c.font = "900 54px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = pulse > 0.01 ? GOLD : "#F6EEDC";
  c.fillText(label, w / 2, h - 52);
};

// ---------- die-cut text label (labels: white + INK, see design-system "Label-Lesbarkeit") ----------
export const dieText = (text: string, bg: string, fg: string, w: number, h: number, size: number) => canvasTex(w, h, (c) => {
  dieCut(c, 6, 6, w - 12, h - 30, Math.min(60, h * 0.3), bg, 16);
  const lines = text.split("\n");
  lines.forEach((ln, k) => centerText(c, ln, w / 2, (h - 24) / 2 + (k - (lines.length - 1) / 2) * size * 1.02 + 4, size, w - 80, fg));
});
export const labelTex = (text: string) => dieText(text, "#FFFFFF", SKC.INK, 1000, text.includes("\n") ? 330 : 230, text.includes("\n") ? 106 : 110);

// big number badge (e.g. "1" / "STÜCK")
export const badgeTex = (big: string, small: string) => canvasTex(700, 760, (c) => {
  dieCut(c, 6, 6, 688, 730, 80, "#0E1428", 16);
  c.lineWidth = 14; c.strokeStyle = GOLD; roundRect(c, 34, 34, 632, 674, 60); c.stroke();
  centerText(c, big, 350, 330, big.length > 2 ? 300 : 470, 600, GOLD);
  centerText(c, small, 350, 620, 130, 560, "#FFFFFF");
});

// open question card
export const questionTex = (pill: string, lines: string[]) => canvasTex(1400, 1000, (c) => {
  dieCut(c, 8, 8, 1384, 960, 90, "#FFFFFF", 0);
  c.fillStyle = "#FDF1E6"; roundRect(c, 40, 40, 1320, 896, 70); c.fill();
  if (pill !== "") { // pill "" (2026-10-31, Folge 16) = no head pill, lines centred; default unchanged
    c.font = "900 66px Rubik";
    const pw = Math.max(460, c.measureText(pill).width + 110);
    c.fillStyle = SKC.INK; roundRect(c, 700 - pw / 2, 90, pw, 120, 60); c.fill();
    centerText(c, pill, 700, 152, 66, pw - 60, "#FFFFFF");
  }
  const y0 = (lines.length === 1 ? 480 : lines.length === 2 ? 400 : 340) - (pill === "" ? 60 : 0);
  lines.forEach((ln, k) => centerText(c, ln, 700, y0 + k * 170, 150, 1220, SKC.INK));
});

// winner stamp ("→ FIRMENSHIRTS")
export const stampTex = (text: string) => canvasTex(1400, 360, (c) => {
  c.save(); c.shadowColor = "rgba(0,0,0,.4)"; c.shadowBlur = 20; c.shadowOffsetY = 10; c.fillStyle = "#FFFFFF"; roundRect(c, 10, 10, 1380, 320, 70); c.fill(); c.restore();
  c.fillStyle = SKC.OR; roundRect(c, 30, 30, 1340, 280, 54); c.fill();
  c.lineWidth = 10; c.strokeStyle = SKC.INK; roundRect(c, 30, 30, 1340, 280, 54); c.stroke();
  centerText(c, text, 700, 176, 190, 1260, "#FFFFFF");
});

export const logoTex = (text: string, col = "#2E6BD8") => canvasTex(512, 512, (c) => {
  c.clearRect(0, 0, 512, 512);
  c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(256, 256, 240, 0, 7); c.fill();
  c.fillStyle = col; c.beginPath(); c.arc(256, 256, 204, 0, 7); c.fill();
  centerText(c, text, 256, 266, 150, 340, "#FFFFFF");
});

// ---------- standalone winner card (when there is no wall) ----------
export const winnerCardTex = (label: string, icon: CardIcon) => canvasTex(600, 460, (c) => drawSlot(c, 600, 460, { label, icon }, { fill: 1, cross: 0, keep: 1, dim: 0, hl: 1 }, 0));

// ---------- table card (Excel-like) ----------
export type TableS = { rows: number[]; hl: number; t: number };
export const drawTable = (c: CanvasRenderingContext2D, w: number, h: number, cfg: { title: string; cols: string[]; rows: string[][]; hlRow?: number }, s: TableS) => {
  c.clearRect(0, 0, w, h);
  dieCut(c, 6, 6, w - 12, h - 12, 70, "#FFFFFF", 0);
  c.fillStyle = "#1D6F42"; roundRect(c, 30, 30, w - 60, 150, 44); c.fill();
  c.fillRect(30, 120, w - 60, 60);
  // sheet icon
  c.fillStyle = "#FFFFFF"; roundRect(c, 64, 62, 86, 86, 14); c.fill();
  c.fillStyle = "#1D6F42"; c.font = "900 62px Rubik"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("X", 107, 108);
  c.textAlign = "left"; const tf = fitFont(c, cfg.title, 72, w - 260); c.font = `900 ${tf}px Rubik`; c.fillStyle = "#FFFFFF"; c.fillText(cfg.title, 180, 106);
  const n = cfg.cols.length, x0 = 50, x1 = w - 50, cw = (x1 - x0) / n, top = 200, rh = Math.min(130, (h - top - 50) / (cfg.rows.length + 1));
  c.fillStyle = "#EEF2EE"; c.fillRect(x0, top, x1 - x0, rh);
  cfg.cols.forEach((col, k) => { c.textAlign = "left"; const f = fitFont(c, col, 46, cw - 40); c.font = `900 ${f}px Rubik`; c.fillStyle = "#4B5A4F"; c.fillText(col, x0 + k * cw + 24, top + rh / 2 + 2); });
  cfg.rows.forEach((row, r) => {
    const k = s.rows[r] ?? 1;
    if (k <= 0.001) return;
    const y = top + rh * (r + 1);
    c.save(); c.globalAlpha = Math.min(1, k * 1.5); c.translate(0, (1 - Math.min(1, k)) * 30);
    const isHl = cfg.hlRow === r && s.hl > 0.01;
    c.fillStyle = isHl ? `rgba(255,192,154,${0.85 * s.hl})` : r % 2 ? "#FAFAF7" : "#FFFFFF"; c.fillRect(x0, y, x1 - x0, rh);
    if (isHl) { c.lineWidth = 10; c.strokeStyle = SKC.OR; c.strokeRect(x0 + 5, y + 5, x1 - x0 - 10, rh - 10); }
    row.forEach((cell, k2) => { c.textAlign = "left"; const f = fitFont(c, cell, 50, cw - 40, k2 === 0 ? 900 : 700); c.font = `${k2 === 0 ? 900 : 700} ${f}px Rubik`; c.fillStyle = SKC.INK; c.fillText(cell, x0 + k2 * cw + 24, y + rh / 2 + 2); });
    c.restore();
  });
  c.strokeStyle = "#D5DCD5"; c.lineWidth = 3;
  for (let r = 0; r <= cfg.rows.length + 1; r++) { c.beginPath(); c.moveTo(x0, top + r * rh); c.lineTo(x1, top + r * rh); c.stroke(); }
  for (let k = 0; k <= n; k++) { c.beginPath(); c.moveTo(x0 + k * cw, top); c.lineTo(x0 + k * cw, top + rh * (cfg.rows.length + 1)); c.stroke(); }
};

// ---------- mock-up card: website / logo / shirt / price ----------
export const drawMock = (c: CanvasRenderingContext2D, w: number, h: number, m: { kind: string; name: string; line?: string; sub?: string; cta?: string; color?: string }, t: number, k: number) => {
  c.clearRect(0, 0, w, h);
  const col = m.color ?? SKC.OR;
  dieCut(c, 6, 6, w - 12, h - 12, 70, "#FFFFFF", 0);
  if (m.kind === "website") {
    c.fillStyle = "#EDE7DB"; roundRect(c, 30, 30, w - 60, 110, 40); c.fill(); c.fillRect(30, 100, w - 60, 40);
    ["#E5484D", "#F5C542", GREEN].forEach((cc, i) => { c.fillStyle = cc; c.beginPath(); c.arc(90 + i * 56, 86, 18, 0, 7); c.fill(); });
    c.fillStyle = "#FFFFFF"; roundRect(c, 290, 56, w - 360, 62, 31); c.fill();
    c.font = "700 36px Rubik"; c.fillStyle = "#6B655C"; c.textAlign = "left"; c.textBaseline = "middle";
    c.fillText(m.name.toLowerCase().replace(/[^a-z0-9äöü]+/g, "") + ".de", 320, 88);
    c.fillStyle = "#FBF7EF"; c.fillRect(30, 140, w - 60, h - 170);
    // nav
    c.fillStyle = col; roundRect(c, 70, 180, 64, 64, 16); c.fill();
    c.font = "900 46px Rubik"; c.fillStyle = SKC.INK; c.fillText(m.name, 156, 214);
    // hero
    const lines = (m.line ?? "").split("\n");
    lines.forEach((ln, i) => { c.textAlign = "left"; const f = fitFont(c, ln, 92, w - 160); c.font = `900 ${f}px Rubik`; c.fillStyle = SKC.INK; c.fillText(ln, 70, 360 + i * 104); });
    if (m.sub) { c.font = "600 44px Rubik"; c.fillStyle = "#5E584F"; c.fillText(m.sub, 70, 380 + lines.length * 104); }
    if (m.cta) {
      const bw = Math.max(380, (c.measureText(m.cta).width || 300) + 120), by = Math.min(h - 170, 440 + lines.length * 104);
      c.save(); c.translate(70 + bw / 2, by + 50); c.scale(1 + 0.06 * Math.sin(t * 5) * k, 1 + 0.06 * Math.sin(t * 5) * k);
      c.fillStyle = col; roundRect(c, -bw / 2, -50, bw, 100, 50); c.fill(); c.lineWidth = 8; c.strokeStyle = SKC.INK; roundRect(c, -bw / 2, -50, bw, 100, 50); c.stroke();
      c.font = "900 46px Rubik"; c.textAlign = "center"; c.fillStyle = "#FFFFFF"; c.fillText(m.cta, 0, 3); c.restore();
    }
  } else if (m.kind === "logo") {
    const r = Math.min(w, h) * 0.3;
    c.save(); c.translate(w / 2, h * 0.42); c.scale(k, k);
    c.fillStyle = SKC.INK; c.beginPath(); c.arc(0, 0, r + 14, 0, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
    const ini = (m.line ?? m.name.split(/\s+/).map((x) => x[0]).join("").slice(0, 2)).toUpperCase();
    centerText(c, ini, 0, 10, r * 1.1, r * 1.6, "#FFFFFF");
    c.restore();
    centerText(c, m.name, w / 2, h * 0.8, 96, w - 120, SKC.INK);
    if (m.sub) centerText(c, m.sub, w / 2, h * 0.9, 46, w - 140, "#6B655C", 700);
  } else if (m.kind === "shirt") {
    drawShirtGlyph(c, w / 2, h * 0.45, Math.min(w, h) * 0.62, "#F2F0EA");
    c.save(); c.translate(w / 2, h * 0.46); c.scale(k, k);
    c.fillStyle = col; c.beginPath(); c.arc(0, 0, 92, 0, 7); c.fill();
    centerText(c, (m.line ?? m.name.slice(0, 2)).toUpperCase(), 0, 6, 80, 150, "#FFFFFF");
    c.restore();
    centerText(c, m.name, w / 2, h * 0.86, 84, w - 120, SKC.INK);
  } else {
    // price tag
    c.save(); c.translate(w / 2, h * 0.44); c.rotate(-0.06); c.scale(k, k);
    c.fillStyle = SKC.INK; roundRect(c, -w * 0.36 - 12, -h * 0.22 - 12, w * 0.72 + 24, h * 0.44 + 24, 60); c.fill();
    c.fillStyle = GOLD; roundRect(c, -w * 0.36, -h * 0.22, w * 0.72, h * 0.44, 50); c.fill();
    c.fillStyle = SKC.INK; c.beginPath(); c.arc(-w * 0.28, 0, 22, 0, 7); c.fill();
    centerText(c, m.line ?? m.name, w * 0.04, 8, 220, w * 0.56, SKC.INK);
    c.restore();
    centerText(c, m.name, w / 2, h * 0.82, 84, w - 120, SKC.INK);
    if (m.sub) centerText(c, m.sub, w / 2, h * 0.91, 46, w - 140, "#6B655C", 700);
  }
};

export const cardPulse = (t: number, at: number) => 1 + 0.12 * bump(t, at + 0.05, 0.3);
