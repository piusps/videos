# Prüfung autor · Folge 13 „Werbebrief“ · Runde 3 (Kurzprüfung Tag-Umplanung)

Prüfer: frischer Agent firma-pruefer, 2026-10-30. Umfang: nur die Änderung gegenüber R2 (bestanden 8,5, `autor-runde2.md`) und die betroffenen Grenzen. Maßstab: bewertung.md „autor“; firma-autor SKILL (Eröffnung/Tageszählung Z. 18–19, Länge Z. 24, CTA-Formel Z. 25); `runs/firma-tag9/tagesbriefing-2026-10-30.md`; Vorbild `runs/firma-tag9/` (script, hooks, caption).

## Diff gegen R2
| Datei | Änderung |
|---|---|
| script.txt:1 | + „Tag vier.“ |
| script.txt:12 | „einen Briefentwurf fürs eigene Business“ → „deinen eigenen Briefentwurf“ (−2) |
| hooks.md:1/3/8 | Kopf Serientag 4, 2026-10-31 09:00, erste Folge; Eröffnung mit „Tag vier.“; Slam „TAG 4“ |
| caption.txt:1 | „Jetzt schreibt sie …“ → „Tag 4: Heute schreibt sie …“ |
| thema.md | Kopf, Kettenprüfung Z. 4, Tabelle Z. 20, CTA-Notiz Z. 48–49, Übergabe Folge 14 Z. 51/55, Länge Z. 73–81 |
Alle übrigen Sätze wortgleich zu R2.

## Messwerte
- `wc -w script.txt` = **100** (≤ 100 ✓, R2 ebenfalls 100).
- Sätze (nicht fest): max. **9** Wörter („Damit hast du in zehn Minuten deinen eigenen Briefentwurf.“); „Tag vier.“ 2. Feste Sätze 15 / 4 / 15. Alle ≤ 12 ✓.
- „gestern“ in script/caption: 0 ✓ (nur Verbotsnotiz in hooks.md:3).
- Tageszählung: Start 2026-10-28 = Tag 1 → 2026-10-31 = **Tag 4** ✓.
- Caption: **2081** Zeichen ohne Schluss-Umbruch (2082 mit) < 2100 ✓; Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓; Emoji-Scan (Zeichen > U+2500) leer ✓; „Hamburg“ in script/caption/hooks/thema: 0 ✓; Betriebs-/Personennamen in script/caption: 0 ✓.
- Rückblick „Liste: zwanzig Betriebe.“ gegen Folge 12: `firma-tag12/script.txt:3` „Heute sucht sie zwanzig Betriebe in Chemnitz.“, Caption Folge 12 Z. 10 „20 Betriebe als Excel-Datei“ ✓. Folge 12 ist laut `firma-tag12/publish.json` für 2026-10-30 21:00 eingeplant, läuft also vor Folge 13 ✓. 6 Silben ≤ 11 ✓.
- Timing nachgemessen: `public/firma-ep/tag13/words.json` „aus.“ Ende 6,24 → „Die“ 6,888 (0,65 s); `tag9/words.json` „aus.“ Ende 5,921 → „Tag“ 5,979 → „3.“ Ende 6,711 → „Die“ 6,792. thema.md-Zahlen stimmen.
  - Bei Folge-9-Sprechweise (Einschub aus.→Die 0,87 s statt 0,65 s): „Heute“ ≈ 13,82 + 0,22 = **≈ 14,0 s** ✓.
  - Worst Case (volle 0,65-s-Pause nach „Tag vier.“): ≈ 14,6 s ✗ → Regie-Hinweis in thema.md (Pause nach „Tag vier.“ ≤ 0,40 s) ist nötig und ausreichend. Rechnung ≈ 14,1–14,2 s plausibel.
  - Gesamt: CTA verliert 4 Silben (11 → 7, ≈ −0,7 s), Eröffnung +0,5…0,8 s → ≈ 44,3–44,8 s = 134–136 wpm. Knapp an 135, Regie gleicht über Pausen aus (in thema.md benannt) ✓.

## Noten (nur betroffene Kriterien)
| Kriterium | Note | Beleg |
|---|---|---|
| Serien-Regel Eröffnung/Tageszählung (erste Folge) | 9 | script.txt:1 wortgleich mit Vorbild firma-tag9/script.txt:1 bis auf Tageszahl; hooks.md:3/8 „TAG 4“-Slam wie F9; caption.txt:1 „Tag 4: Heute …“ exakt F9-Muster (firma-tag9/caption.txt:1) |
| Länge / Satzlänge / Tempo | 8 | 100/100 Wörter, max. 9 Wörter; „Heute“ ≤ 14,5 s nur mit Pausen-Hinweis, Gesamttempo an der 135-wpm-Kante (thema.md:78–80) |
| Neueinstieg ≤ 14 s / Rückblick | 8 | Rückblick unverändert, passt zu F12; „Heute“ bei ≈ 14,0–14,2 s (Grenze 14,5 aus thema.md, Prüffrage firma-autor „≤ 14 s“ knapp) |
| CTA: konkreter Wert, Lieferbares, Formel | 8 | script.txt:11–12: Lieferung (Frage + Briefvorlage) und Ergebnis („Briefentwurf“, 10 Min.) unverändert konkret; „deinen eigenen“ trägt den Eigenbezug. Formabweichung von SKILL:25 („für dein eigenes Business“ fehlt, „und“ fehlt) |
| Schritt-Kette | 9 | thema.md:4 unverändert, Übergabe F14 Z. 55 korrekt auf „ohne Tag“ umgestellt |
| Caption-Regeln | 9 | 2081 < 2100, Ende korrekt, keine Emojis; Z. 21 behält volle Formel „für dein eigenes Business“ |

## Frage: Wegfall „für dein eigenes Business“ = K.-o.?
**Nein.** Die K.-o.-Liste (bewertung.md „autor“) enthält die Formel nicht; K.-o. wäre nur ein unlieferbares Versprechen oder direkte Ansprache der Zielgruppe („du willst was Eigenes starten“). Die CTA bleibt konkret und lieferbar (prompt-fuer-kommentare.md Punkt 1+2). Präzedenz: Folge 9 (`firma-tag9/script.txt:9` „… drei geprüfte Logo-Entwürfe.“, ganz ohne Business-Bezug) hat bestanden. „deinen eigenen Briefentwurf“ ist sogar näher an der Formel als F9. Abzug nur in der Form → 8.

## K.-o.-Liste
| K.-o. | verletzt? |
|---|---|
| Zuschauer direkt angesprochen (außer CTA) | nein |
| „Tag N“ falsch / in Nicht-Erstfolge | nein (Tag 4 korrekt, erste Folge) |
| „gestern“ / Vorwissen vorausgesetzt | nein |
| > 100 Wörter / Satz > 12 | nein |
| Versprechen, das wir nicht liefern | nein |
| Ergebnis nicht aus echtem Lauf / unbelegte Behauptung | nein (unverändert R2) |
| Caption ≥ 2100 / falsches Ende / Emojis | nein |
| Neueinstieg > 14,5 s | nein, sofern Regie-Pausenhinweis umgesetzt wird |

## Hinweise (keine Tickets an firma-autor)
- `briefing.md:1` (Chef-Datei) steht noch auf „Slot 2026-10-30 21:00 · Serientag 3, letzte Folge“ → firma-chef nachziehen.
- Regie: „Heute“ nach Neueinsprache messen (Grenze 14,5 s), Pause nach „Tag vier.“ ≤ 0,40 s, nie Tempo > 1,0. Rückblick bleibt 6,26 s; Tagesbriefing/firma-autor nennen ≤ 6,0 s, R2 hatte das mit 6,5 s akzeptiert, unverändert.
- Design: Cover nennt jetzt „Tag 4“ (Regel firma-autor Z. 19: Caption und Cover nennen den Tag bei der ersten Folge); HUD-Badge auf „TAG 4“.

## Urteil
**Bestanden.** Note **8,5/10**, kein K.-o., alle betroffenen Kriterien ≥ 8. Keine Tickets an firma-autor.
