# Performance Log — Feedback Loop (Manual, Pre-Automation)

Tracks how our own published videos actually performed, and what we think drove that result. This is the seed of the automated feedback loop described in the project roadmap (publish → wait a few days → pull performance data → feed learnings back into script generation) — until that pull is automated, it's filled in manually whenever the user reports results back.

**How this file is used:** `heygen-video-generator` (Step 7 of SKILL.md) appends an entry whenever the user reports how a video did. Once several entries exist, look for patterns across them (which hook types, which topics, which structures over/under-perform) and surface them to the user — then let that pattern actually shift which hook formula gets picked by default in future scripts (Step 3), not just sit here as a log.

**Entry format:**
```
## [Date] — [Script/video topic or short title]

**Hook type used:** [e.g. Cost-Replacement Shock, Problem-Focused, ...]
**Result:** [views, watch-time/retention %, comments, saves — whatever the user reports; qualitative is fine if that's all that's available]
**Attributed to:** [user's read, or your own reasoning from the numbers, on what drove the result]
```

---

*When the user reports how a video performed, add an entry below following the format above. Once there are enough entries to see a pattern, call it out explicitly rather than waiting to be asked.*

## 2026-09-24 — Website ("Claude ersetzt gerade deine Webagentur") — pre-publish internal review, not yet posted

**Hook type used:** Product-Displacement (Template B), cost anchor 8.000 € / 6 Wochen
**Result:** Not published yet. User review + own scroller simulation: ~5/10. Liked: silence cut "Stimme an Stimme", captions, pacing, keyframed zooms (v2). Disliked: repetitive pen-stab gesture in the first 5-8s, choppy per-sentence zooms (v1), static/generic B-Roll, redundant trailing trigger word, voice less natural than the Mahnwesen reference.
**Attributed to:** Hook was a claim about the viewer ("deine Webagentur") instead of a lived result; tool-name jargon from ~10s coincided with 11s of weak B-Roll (predicted drop-off point); the open loop paid off with a technical step ("ein Befehl, live") the target audience can't feel. All turned into rules in SKILL.md Step 1b (retention architecture) and the run-1 feedback block in Step 6a-auto.

## 2026-09-25 — Website — POSTED, Instagram retention curve

**Hook type used:** Product-Displacement ("Claude ersetzt gerade deine Webagentur"), text hook "Claude ersetzt / Webdesigner komplett"
**Result:** Retention ~50% at 2s, ~35% at 3s, ~25% at 5s, ~20% at 8s, then nearly flat to ~13% at 30s; small dip at the CTA (~30s). 32s video.
**Attributed to:** All loss in the first 2-3s. Frame 0/thumbnail: hook pill still fading in (half transparent), wide static shot, pen pointed at lens; first zoom only at 2s; spoken hook too narrow (only people with a current agency) and an unproven claim. Middle section (steps, B-Roll, zooms, pacing) held well — the predicted drop at ~10s did not happen. Fixes: no fade on frame-0 hook, push-in from frame 0, broad-pain + proof hooks, target ≥60% at 3s (SKILL.md Step 1b).

## 2026-10-02 — Abmahnung (Dd8qWL7odne, gepostet 2026-10-01 12:11) — Account-Rekord

**Hook type used:** Ersetzt-Demo, Angst/Verlust-Achse als Wir-Erlebnis („Wir haben eine Abmahnung bekommen. Zweitausend Euro, und eine Frist.“), Text-Hook „Abmahnung: 2.000 € / Claude: 5 Minuten“, 84 Wörter, 23,3 s (kürzestes Normal-Reel bisher), blauer Look.
**Result:** 15.555 Plays nach <22 h (Apify, öffentlich) = höchster Wert des Accounts (vorher 14.384 / 13.500 / 10.471), ca. 4x der Reels derselben Woche mit gleichem Look und Schnitt (Vertrag 2.753, Arbeitsvertrag 3.645, E-Rechnung 5.776, Postfach 1.597). 45 Likes, 77 Kommentare, davon ~38 echte (fast alle Triggerwort), Rest Automations-Antworten. Kommentarrate ~0,25 %, also Reichweite kam aus der Ausspielung, nicht aus Kommentaren. **Retention (Pius, aus der App): noch 46 % bei 6 s.** Zum Vergleich Website-Reel (2026-09-25): ~25 % bei 5 s, ~20 % bei 8 s, also fast doppelt so viele Zuschauer nach dem Einstieg. Shares, Saves, Non-Follower-Anteil: nicht verfügbar (InstantDM-Insights ohne Berechtigung).
**Attributed to (eigene Analyse, Hypothesen):**
1. **Das Wort „Abmahnung“ ist ein Bauchgefühl-Wort für fast jeden in Deutschland:** Händler, Selbstständige, Website-Betreiber (Impressum/DSGVO), Etsy/eBay-Verkäufer und auch Angestellte (arbeitsrechtliche Abmahnung). Kommentierende sind sichtbar breit (DJ, Näh-Account, Fahrer, Gastro, Finanz-Account), nicht nur Mittelstand. Breiteres Publikum = Instagram testet weiter.
2. **Angst schlägt Kosten:** Arbeitsvertrag hatte fast dieselbe Struktur (Anwalt 600 € / Claude 10 Min, 88 Wörter) und kam auf 3.645. Unterschied ist die Achse: drohender Verlust + Frist statt teurer Dienstleistung.
3. **Echte Szene statt Behauptung:** „Wir haben … bekommen“ (passiert, mit Betrag und Frist) statt „In deinen Verträgen steht …“ (Vertrag, 139 Wörter, „Ich zeig dir drei Schritte“ → 2.753).
4. **Einstieg hält:** 46 % bei 6 s. Gesprochener Satz 1 ist ein Ereignis mit Bedrohung („Wir haben eine Abmahnung bekommen.“), Satz 2 liefert sofort Betrag und Frist, Satz 3 die Auflösung („Claude hat sie in fünf Minuten auseinandergenommen.“): nach 6 s ist die ganze Geschichte angelegt, ohne Erklärung oder Ankündigung. Der Text-Hook im Bild sagt dasselbe als Gegenüberstellung (2.000 € vs. 5 Minuten).
5. **Kürze:** 23 s, keine Ankündigung, keine nummerierten Schritte → hohe Komplettansicht und Rewatch wahrscheinlich.
**Daraus für die nächsten FP-N-Skripte:** Angst-/Frist-Themen mit einem Wort, das jeder fürchtet (Abmahnung, Mahnbescheid, Betriebsprüfung, Kündigung, Bußgeld, Schufa, Pfändung), als Wir/Ich-Erlebnis mit echter Zahl und Frist, unter 90 Wörtern, ohne Schritt-Ankündigung. Hinweis: Einige kommentierten „Vorlage“ (Trigger des Arbeitsvertrag-Reels) unter Abmahnung, Trigger-Wörter pro Video klar halten.

## 2026-10-28 — Zernio-Analyse aller FP-N-Reels seit 2026-09-25 (53 Reels) + Klage (DfAV2ZoD8dS)

**Gruppen (Durchschnitt):** ≥7k Views (7 Reels): 9,8 Shares/1k Reach, 22,9 Saves/1k, WT 9,7 s, Skip 52 %. 2–7k (27): 3,7 / 15,6 / 10,1 s / 55 %. <2k (19): 2,2 / 16,9 / 8,5 s / 65 %. 100-Tage-Serie (5): 1,5 / 12,5 / 11,7 s / 65 %, Ø 1,5k Views.
**Ausreißer:** Jahresabschluss 45,6k (470 Shares), Browser-Belege 22,9k, Arbeitsvertrag 19,3k, Ausschreibungen 12,1k, NDA 10,6k, AGB 8,4k. Alle: bezahlter Profi oder Geldtopf mit Eurobetrag im ersten Satz, Claude mit Zeit dagegen, Text-Hook mit zwei Zahlen.
**Klage (17 h):** 1.277 Views, 915 Reach, 24 echte Kommentare (47 inkl. Funnel-Antworten), WT 12,7 s (bester Wert seit 2 Wochen), Skip 52 %, 8,7 Shares/1k, 32 Saves/1k. Text-Hook ohne Zahl. Share-Rate liegt nahe den Ausreißern, also kann es noch wachsen.
**Daraus:** Shares sind der Unterschied, nicht Watch Time und nicht Kommentare. Regel in SKILL.md Step 3 Nr. 13 und video-social-copy (Text-Hook Profi-Preis gegen Claude-Zeit).
