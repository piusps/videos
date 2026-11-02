# Prüfung Regie · Folge 20 „Mit oder ohne Umsatzsteuer?“ · Runde 1 · 2026-11-01

Prüfer: firma-pruefer (frisch, nicht Ersteller). Slot 2026-11-01 21:00, Serientag 5, nicht erste Folge.
Geprüft: voice.mp3, words.json, regieplan.md, beats.json, musik.txt, regie/musik-abschnitt.mp3, regie/curve.json, regie/gap-final.txt, final.env.
Maßstab: script.txt, briefing.md, design/lauf/LAUF.md + bericht.md, tagesbriefing-2026-11-01.md (Fenster F20 152,0–199,95), tagesbriefing-2026-10-30.md (Tempo/Text), Vergleich firma-tag17/regieplan.md + Prüfungen firma-tag19/pruefung/regie-runde1–3.md (gleiche Fehlerbilder).
Gemini nicht nötig (Stufe Regie, kein Video). Belege in `pruefung/regie-r1/`.

## Eigene Messungen
- **STT selbst** (scribe_v1 de über regie/el.mjs, 3 Läufe auf voice.mp3, `regie-r1/stt1-3.json`, Skript `regie-r1/stt.mjs`): 3/3 wortgleich mit script.txt. Nur Schreibweisen: „Web-Suche“, „Ihre Rechnung“ (Großschreibung, gesprochen gleich; Untertitel aus words.json = „ihre“), Doppelpunkte/Anführungen fehlen, 1× „100“ als Ziffer. voice.mp3 md5 c9d261fe… = regie/vX.mp3 ✓.
- **Länge/Tempo:** voice.mp3 43,57 s (ffprobe), letztes Wort endet 43,27; seconds 44,60 → **134,5 wpm** (100/44,60) ✓ (knapp unter 135). Rückblick „Die“ 6,13 → „offen.“ 12,49 = **6,36 s** ✓. „Heute“ **13,01 s** ✓. Kein „Tag“, kein „gestern“ ✓.
- **Pausen (words.json):** führt?→Ich 0,62 · aus.→Die 0,30 (feste Eröffnung F12) · offen.→Heute 0,52 · Umsatzsteuer?→Claude 0,61 · IHK.→Sie 0,58 · Kleinunternehmer.→Warum? **0,86** (≤ 0,9 ✓) · Rechnung?→Kommentiere **0,96** (Akt-Naht, Präzedenz F18/F19) · Prompt.→In 0,64.
- **Betonung „Vorsteuerabzug“ selbst gemessen auf voice.mp3** (nicht auf dem Take; `regie-r1/vorsteuer.py`, Kontur `regie-r1/vorsteuer-kontur.txt`, 20-ms-Schritte): VOR 25,25–25,39 s F0 steigt 117→**154 Hz** (Gipfel), −13 bis −19 dB · steu 25,45–25,61 fällt 129→100 Hz · er/ab 76–88 Hz · zug 25,87–25,95 ~107 Hz, −15,6 dB. Tonhöhenakzent eindeutig auf VOR (+6 HT über „zug“), „zug“ ohne Tonhöhengipfel → **VOR-steu-er-ab-zug ✓**. Take-Messung regie/stress20.py nachgelaufen: identisch mit regieplan (VOR 129 Hz Median, ab −21,5 dB). STT 3/3 „Vorsteuerabzug“.
- **Musik:** Stem 45,35 s (ffprobe); per Kreuzkorrelation an 3 Stellen (5/20/40 s) gegen den Original-Track = Start **152,60** ohne Sprung → Ende 197,95 ≤ 199,95 ✓, im Fenster, Tabu ≥ 200 nicht berührt, nie geloopt. `node scripts/music-explicit-check.mjs .env runs/firma-tag20/regie/musik-abschnitt.mp3` einmal: **exit 0, kein explizites Wort** (`regie-r1/explicit.txt`). gap-final.txt: jeder Akt 22,2–25,5 dB unter Stimme ✓ (≥ 15). Kurve mit Mulde 22,81–23,60 und Akzent auf „Warum?“ ✓.
- **Ereignis-Lücken** (eigenes Skript `regie-r1/gaps.py`, alle Karten/SFX/Events/Beat-Starts gegen words.json aufgelöst, Ausgabe `regie-r1/gaps.txt`): alle Anker lösen auf. Eröffnung 0–6,13: eine Lücke **0,54 s** (B03 „führt“ 3,99 → „führt:end+0.2“ 4,53). Ab 6,13: **B05 „verkauft“ 7,05 → „Betriebe@8.6“ 8,77 = 1,72 s** (> 1,5). Sonst max. 1,48 s (22,09→23,57, Mulde, Bild steht bewusst) und 1,33 s; Ende 42,73 → Endkarte-Halt 43,57 = 0,84 s (wie F19 gewertet).
- **Kartenabstände:** alle neuen Textblöcke ≥ 1,28 s auseinander ✓, Karten ≤ 4 Wörter ✓ – aber Zusatzzeilen + Beleg-Screenshots überladen B11/B12 (siehe Tickets).
- **Fakten gegen LAUF.md:** 109 / 91,60 / 17,40 € ✓ (109 − 91,60), 19 % ✓ (Testbericht, nicht als Printful-Zitat), 5 Jahre ✓ (§ 19 Abs. 3, IHK), Bedingung „mit Vorsteuerabzug“ in der Tafel-Unterzeile ab Frame 0 und gesprochen ✓. **Zwei Problemstellen:** Gegenwert „MIT USt-ID: 0 %“ an der Karte „+19 % EINKAUF / als Kleinunternehmer“ (B12) – laut Lauf hilft die USt-ID dem Kleinunternehmer gerade nicht (Shot 10 Zeile 2 im geplanten Bereich: „Das gilt ohne USt-ID und auch mit USt-ID“) → Karte und Screenshot widersprechen sich sichtbar. Und Shot 08 Bereich „effektiv“ (B11) zeigt lesbar „bzw. 25,13 €“ / „bzw. 29,90 €“ (`regie-r1/shot08-effektiv.png`) – beides steht in der eigenen Verbotsliste („keine Zahl außer …“, „25,13 € groß“).
- **„Keine Steuerberatung“ sichtbar:** Bauchbinde 29,33–33,86 + Marker Shot 01 Promptzeile ✓.
- **Menschen-Schritte:** GEWERBE ohne Haken, Verbote „angemeldet / Verzicht erklärt / USt-ID beantragt“ ✓.
- **Datenschutz Screenshots** (01, 07, 02, 04, 08, 09, 10 angesehen, `regie-r1/shots-07-02-04-09.png`): keine Namen, Mails, Orte, Sidebar; Dateiname „Kolonnenshirt_Marge.md“ = Firmenname der Serie; Quellen-Chips „ihk“/„dws-medien“ unkritisch ✓.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| STT = Skript | 10 | regie-r1/stt1-3.json, 3/3 |
| Länge / Tempo / Rückblick / Heute / Pausen | 9 | s. o.; 134,5 wpm knapp |
| Betonung „Vorsteuerabzug“ + Zahlwörter | 9 | regie-r1/vorsteuer-kontur.txt |
| Warum-Beats mit eigenen Grund-Karten | 8 | B11 17,40 € ZURÜCK, B12 +19 % EINKAUF, B13 5 JAHRE BINDUNG |
| Roter Faden (Akte, Ort je Akt, ≤ 1 Ortswechsel/Satz, 3-Stationen-Kette) | 8 | 9 Akte (F17: 8), Haken bleibt auf der Tafel; Kette B11 ok |
| Storyline / Kette / Faden gestern–morgen | 9 | F19 endet „Als Nächstes: Mit oder ohne Umsatzsteuer?“, F21 „Was muss auf ihre Rechnung?“ |
| Hook (≤ 0,5 s) + Frame 1 = Ergebnis | 8 | Tafel 91,60 € / 109 € ab Frame 0 ✓; eine Lücke 0,54 s → Ticket 02 |
| Nach dem Hook kein Beat > 1,5 s ohne Änderung | **7** | B05 1,72 s → Ticket 02 |
| Bildschirmtext (ein Block, ≤ 4 W., ≤ 12 neue Wörter) | **6** | B11/B12/B13 → Ticket 03 |
| Faktenschutz / nur Belegtes | **6** | B12 „MIT USt-ID: 0 %“, B11 Shot 08 25,13/29,90 → Ticket 01 |
| Echte Claude-UI in Mehrwert-Beats | 9 | Shots 01/07/02/08/10/04 mit Bereichen |
| Ton-Plan (Musikstruktur, SFX-Vielfalt) | 9 | musik.txt, curve.json, ~17 SFX-Varianten |
| Musik im Fenster, explizit-frei | 10 | regie-r1/explicit.txt, Kreuzkorrelation |
| „Keine Steuerberatung“ sichtbar / Menschen-Schritte / Datenschutz | 9 | B09, B12, plan.notiz |
| beats.json vollständig, Anker Wort + after | **7** | B09 wort_start null → Ticket 04 |

K.-o.: keins verletzt (Faktenfehler wäre erst im fertigen Video K.-o.; hier noch Plan).

## Offene Frage der Regie: Plakette „MIT UST“ an GEWERBE statt neuem Feld „STEUER“ → **zugestimmt (9/10)**
Die Umsatzsteuer-Wahl wird beim Finanzamt zusammen mit der Gewerbe-/Steueranmeldung erklärt, gehört also inhaltlich zu GEWERBE; das Board bleibt wiedererkennbar (9 Felder wie F13–19), und eine Plakette zeigt „entschieden, nicht erledigt“ ohne Haken – genau der richtige Stand. Ein neues Feld „STEUER“ würde mit Haken wie eine erledigte Anmeldung wirken. Bedingung (Hinweis an Design, kein Ticket): Plakette im selben Stil wie „5ER OFFEN“, Feldtext bleibt „GEWERBE OFFEN“, kein Haken; Wechsel „UST ?“ → „MIT UST“ nur dort zeigen, wo das Board auch im Bild ist (B14 hat Rechnungsblatt + Tafel im Bild – dann den Wechsel erst in der CTA-Board-Ansicht zeigen, sonst zweiter Ort im Satz).

## Tickets

TICKET regie-R1-01 → firma-regie
Kriterium: Faktenschutz / nur Belegtes · Note: 6/10
Beleg: beats.json B12 Karte „+19 % EINKAUF“ vs „MIT USt-ID: 0 %“ + beleg grund2 (x75 y185 w610 h62, enthält Zeile 2 „Das gilt ohne USt-ID und auch mit USt-ID, weil“, `regie-r1/shot10-grund2.png`); B11 beleg_bereich „effektiv“ (Shot 08, „bzw. 25,13 €“/„bzw. 29,90 €“ lesbar, `regie-r1/shot08-effektiv.png`)
Problem: „MIT USt-ID: 0 %“ legt nahe, ein Kleinunternehmer käme mit USt-ID ohne Aufschlag weg – der Lauf sagt das Gegenteil, und der gleichzeitig gezeigte Screenshot widerspricht der Karte; in B11 stehen zwei verbotene Zahlen lesbar.
Soll: B12 ohne Gegenwert (oder nur „MIT USt: 0 %“, belegt durch Tabellenkopf 08 „Printful 0 %“); Shot-10-Bereich grund2 nur bis „… dauerhaft 19 % teurer.“ hell, Rest der Zeile 2 abgedunkelt (Bereich/crop entsprechend). B11 Shot 08: nur „91,60 €“ und „109 €“ lesbar, „bzw. 25,13 €“ und „bzw. 29,90 €“ abgedeckt/abgedunkelt, im hinweis festgeschrieben. Danach keine lesbare Zahl außerhalb der erlaubten Liste in beats.json.

TICKET regie-R1-02 → firma-regie
Kriterium: Ereignis-Takt (Eröffnung ≤ 0,5 s, danach ≤ 1,5 s) · Note: 7/10
Beleg: beats.json B05 („verkauft“ 7,05 → „Betriebe@8.6“ 8,77 = 1,72 s); B03 („führt“ 3,99 → „führt:end+0.2“ 4,53 = 0,54 s); regie-r1/gaps.txt
Problem: eine Lücke über 1,5 s im Rückblick (gleiches Fehlerbild wie F19 R2-01) und eine knapp über 0,5 s in der Eröffnung.
Soll: B05 zusätzliches verankertes Ereignis ohne neuen Text auf „Logo@7.9“ (8,01) und Silhouetten auf „kleine@8.3“ (8,48) statt „Betriebe@8.6“; B03 Tick auf „führt:end+0.1“ (4,43) statt +0.2. Nachrechenbar: zwischen 0 und 6,13 keine Lücke > 0,5 s, zwischen 6,13 und Ende keine > 1,5 s.

TICKET regie-R1-03 → firma-regie
Kriterium: Bildschirmtext (ein neuer Block, ≤ 4 Wörter + kleine Unterzeile, ≤ 12 neue Wörter) · Note: 6/10
Beleg: beats.json B12 (auf „19“: Karte 3 W. + Unterzeile 2 + Gegenwert 4 + Shot-10-Bereich ~20 W. ≈ 29 neue Wörter, Bauchbinde 1,28 s davor); B11 (auf „17“: Karte 3 + Unterzeile „Betrieb zahlt effektiv 91,60 €“ 4 + Gegenwert „OHNE USt: 109 €“ 3, gleichzeitig füllt sich die Tafel-Zeile mit denselben 91,60 € | 109 € = doppelt); B13 (Karte 3 + Shot-04-Zeile 10 = 13)
Problem: Karten tragen wieder drei Textelemente plus Screenshot-Satz gleichzeitig (Fehlerbild F19 R1-03), B11 zeigt dieselben Beträge zweimal.
Soll: B11 Karte „17,40 € ZURÜCK“ ohne Unterzeile und ohne Gegenwert (die Tafel-Zeile 91,60 € | 109 € trägt den Vergleich); B12 Karte „+19 % EINKAUF“ höchstens mit Unterzeile „als Kleinunternehmer“, Shot 10 nur weiche Textur mit Marker auf „19 % teurer“; B13 Shot 04 weiche Textur mit Marker auf „mindestens fünf Jahre“. In jedem Beat ≤ 12 neue lesbare Wörter, im „bild“ festgeschrieben.

TICKET regie-R1-04 → firma-regie
Kriterium: beats.json vollständig, Anker Wort + after · Note: 7/10
Beleg: beats.json B09 `"wort_start": {"w": null, "after": 0}` bei von 15,95
Problem: Beat-Start nicht verankert (nur B01 darf null sein; gleiches Ticket wie F19 R1-04).
Soll: B09 wort_start = {"w": "Claude", "after": 15.5} (Start Claude+0.15 = 15,95 wie „einstieg“), alle Beats außer B01 mit Wort + after, jeder löst auf seinen „von“ auf (± 0,2 s).

## Hinweise (kein Ticket)
- Slot: briefing.md nennt 15:00, beats.json 21:00; Musikfenster 152,0–199,95 ist laut Tagesbriefing das von Folge 20 und bleibt gültig. Chef gleicht den Slot ab.
- 134,5 wpm: Endkarte nicht kürzen (seconds ≥ 44,44).
- Gleicher Track-Bereich wie F17 (Vortag) – erlaubt, Wiederkehrer hören dieselbe Stelle.
- Bibel-Eintrag (Vorschlag im regieplan) trägt der Chef ein.

## Ergebnis
Gesamtnote **8,4/10** (Mittel), aber 4 Kriterien unter 8 (Faktenschutz 6, Bildschirmtext 6, Takt 7, Anker 7) → **nicht bestanden**.
Alle vier Tickets sind reine beats.json-/regieplan-Änderungen; Stimme, words.json, STT, Betonung und Musik bestehen und bleiben unverändert. Runde 2 = Kurzprüfung der Tickets.
