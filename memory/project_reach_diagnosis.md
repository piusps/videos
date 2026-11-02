---
name: project-reach-diagnosis
description: "2026-10-26 Reichweiten-Analyse aller IG-Accounts via Zernio /v1/analytics; \"Kommentiere X\"-Hook-Reels bleiben bei ~120 Views hängen"
metadata:
  node_type: memory
  type: project
  originSessionId: e4cf589d-314e-4574-beb7-820a8ba342e3
  modified: 2026-10-26T14:45:27.588Z
---

Zernio `GET /v1/analytics?limit=50&page=N` liefert pro Reel views, reach, avg watch time, skip rate, saves, shares für alle Accounts (InstantDM get_post_insights hat seit Okt keine Berechtigung mehr).

Ergebnis 2026-10-26:
- @florentgpt: Reels, deren Hook/Caption mit „Kommentiere X“ startet (GPT-N), hängen fast alle bei 100–160 Views fest, 60–75 % Skip. Satire ohne Aufforderung: 1,5–2,5k, einmal 17,8k, Skip 25–35 %.
- @florent_preusser: Median nach 24 h fiel von ~4k (Jul/Aug) auf ~2,2k (Okt). Avg watch time 11→8,5 s, Saves 130→30, Shares 12→4 pro Reel. Videos von ~65 s auf ~33 s gekürzt. Ausreißer (44k, 22k, 12k) kommen weiter, also keine Sperre. Posts/Tag ohne klaren Effekt.
- @moustacherecruiter, @pickthecompany: 30–300 Views, das ist nur die erste Testgruppe.

**Why:** Pius hat gefragt, warum Reels in den ersten 30 min nur ~50 Leute erreichen.
**How to apply:** Bei Fragen zur Reichweite zuerst Zernio-Analytics neu ziehen und mit diesen Basiswerten vergleichen. Siehe [[reference-zernio]], [[feedback-all-comments-funnel]].

Update 2026-10-28 (53 FP-N-Reels): Shares/1k Reach trennen die Gruppen (≥7k: 9,8 · 2–7k: 3,7 · <2k: 2,2), Watch Time kaum. Ausreißer = Profi/Geldtopf mit Eurobetrag im 1. Satz gegen Claude-Zeit, Text-Hook mit zwei Zahlen. 100-Tage-Serie Ø 1,5k / 1,5 Shares/1k. Trigger-Kommentare (inkl. Funnel-Antworten, die IG mitzählt) bringen keine Reichweite. Regel jetzt in video-script Step 3 Nr. 13 + video-social-copy.

Follower-Split 2026-10-28 (Zernio `/v1/analytics/instagram/account-insights?breakdown=follow_type`, nur Account-Ebene; Posts haben keinen Split, Interaktionen lassen sich nicht nach Follower aufteilen): @florent_preusser, 30 Tage bis 28.10.: Reichweite 91 % Nicht-Follower (84,9k von 92,8k), Views 78 % (185k von 236k); Sep-Fenster 67 % / 60 %, Aug 89 % / 77 %. follows_and_unfollows mit follow_type: FOLLOWER = neue Follows, NON_FOLLOWER = Entfolgungen (Okt +715/−347). Nicht-Follower-Reichweite → Follow ~0,8 %. Ca. 16,2k Follower.
Pro Video (Schätzung 2026-10-28, kein Per-Post-Split in der API): Tageswerte mit fromDate=toDate + Zerfallsmodell (/tmp/fpa/fit.js) → mittlere Reels (1,2–3k Views) ≈ 70 % Nicht-Follower / 30 % Follower (ruhige Tage 62–75 %), Ausreißer ≈ 87–89 % Nicht-Follower. Follower liefern pro Reel konstant ~400–600 Views; der Unterschied zwischen 1,8k und 20k+ liegt komplett bei den Nicht-Followern.
Kommentierende (2026-10-28): Follow-Status zum Kommentarzeitpunkt = Zernio-Workflow-Events, Knoten c_follow (sourceHandle follows/default) beim Button-Tap, vor dem Gate (/tmp/fpa/wfx.js). Heutiger follow-status ist wegen Follow-Gate wertlos. Mittlere Reels (1,4–2,7k, 16.–27.10.): ~90 % der Kommentierenden schon Follower (93 vs. 10); Ausreißer Belege/Aufträge ~62 % Follower / 38 % neu. Views der mittleren Reels dagegen ~70 % Nicht-Follower → neue Leute schauen, kommentieren aber kaum.
