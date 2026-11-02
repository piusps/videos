# Regieplan · Folge 20 „Mit oder ohne Umsatzsteuer?“ (Serientag 5, **nicht** erste Folge, Slot 2026-11-01 21:00)

firma-regie, 2026-11-01. Grundlage: script.txt (bestanden, 100 Wörter, wortgenau gesprochen). Ausgaben: `voice.mp3`, `words.json`, `beats.json` (`regie/make_beats20.py`), `musik.txt`. Arbeitsdateien in `regie/`. Keine Grafik, kein Render, Skript unverändert. Bibel-Eintrag nicht geschrieben (nur runs/firma-tag20/ erlaubt) – Vorschlag unten für den Chef.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge | voice.mp3 43,57 s (letztes Wort „durch.“ endet 43,27) + 1,03 s Endkarte = **44,60 s** (`beats.json seconds`) | 40–48 s ✓ |
| Sprechtempo | **134,5 wpm** (100 / 44,60 s, inkl. aller Pausen) | 120–135 ✓ (knapp unter Obergrenze) |
| Rückblick „Die“ → Ende „offen.“ | **6,36 s** (6,13–12,49) | ≤ 6,5 s ✓, nicht beschleunigt |
| „Heute“ beginnt bei | **13,01 s** | ≤ 14,5 s ✓ |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| „Tag“/„gestern“ | 0 | ✓ |
| STT (scribe_v1, de) | **12/12 Läufe 100/100 Wörter identisch** mit script.txt (6 auf `regie/vX.mp3`, 6 auf `regie/vX2.mp3`, beide md5 c9d261fe… = bytegleich `voice.mp3`); Vergleich `/tmp/cmp20.py`-Logik (difflib, Ziffern ↔ Zahlwörter) | 0 Abweichungen ✓ |
| words.json | 100 Wörter, Wort für Wort = script.txt (Ziffern nur für Captions: hundert→100, hundertneun→109, siebzehn→17, neunzehn→19, fünf→5, zehn→10); „Preis:“ (TTS-Schreibweise) → „Preis“ | ✓ |
| Stimme roh | −18,8 LUFS (firma-mix normalisiert auf −14) | – |
| Pausen (Stille < −45 dBFS) | Satzpausen 0,30–0,68 s; vor „Warum?“ **0,86**; „Rechnung? → Kommentiere“ **0,96** (Akt-Naht, Endkarte fährt ein, wie Folge 17/19) | 1 Ausnahme > 0,7 s, siehe Risiken |
| Musik explizit | **0** (3 Läufe auf dem Abschnitt), kein Mute | ✓ |

Warum kein anderer Kandidat: va 1/5 (4× „Websearch“), vB2 3/6 („Websearch“, „hundert neun“), vZ 3/6 („probiere/schicke“, „Websearch“), vY 4/6 („probiere/schicke“), v2-weg2 2/5, v2-weg9 4/5, vb 5/5 und vc 4/5 (Websearch) – nur vX ist auf 12 Läufen sauber.

## Storyline-Check (Kette)
- Folge 19 endet „Als Nächstes: Mit oder ohne Umsatzsteuer?“ → Folge 20 „Heute: Mit oder ohne Umsatzsteuer?“ wörtlich. Rückblick-Satz 2 „Briefe stehen, Preis offen.“ = Ergebnis Folge 19 (Versandzeile korrigiert, Fünferpreis offen). Kein „Tag“, kein „gestern“.
- Eingabe = Marge-Rechnung Lauf 18/19 als Anhang (Kolonnenshirt_Marge.md). Ergebnis Lauf 20: „Starte mit Umsatzsteuer, also mit Verzicht auf die Kleinunternehmerregelung.“ Kasse 0 € → 0 €, kein Umsatz-Zähler.
- Menschen-Schritte (nie als erledigt): Verzicht gegenüber dem Finanzamt, USt-ID beantragen, Voranmeldungen, Einkaufspreis im Printful-Konto. Board: GEWERBE bleibt offen, nur Badge „MIT UST“ (Entscheidung), kein Haken.
- Übergabe Folge 21: „Was muss auf ihre Rechnung?“ – ohne Login machbar (Rechnungsvorlage, § 14 UStG laut Lauf als Warnung genannt). Kein Widerspruch zu früheren Folgen, kein Ticket.

## Stimme
- Serienstimme Keno, `eleven_multilingual_v2`, Tempo 1,0 (`regie/el.mjs`). Zusammenbau `regie/assemble20.py`, Rezept `regie/final.env`:
  - A Eröffnung bis „aus.“ = **Folge 12 `voice.mp3`** (STT „probier“ stabil, Lehre 13)
  - B Rückblick „Die … offen.“ = Take **`t/rueckp1`** (TTS-Text „Preis: offen.“ für die Pause nach „Preis“; Untertitel „Preis offen.“)
  - C1 „Heute … Kleinunternehmer.“ = Take **`t/weg9`** (Websuche ohne Bindestrich, STT 12/12 „Websuche“)
  - C2 „Warum? … Rechnung?“ = Take **`t/warum4`**
  - D CTA = Take **`t/cta1`** (STT „schick“ 12/12)
  - Takes per Kreuzkorrelation gegen vX identifiziert (je 1,000). Keine neuen ElevenLabs-Takes nötig.

### Betonungstest (Silbenanalyse `regie/stress.py` auf den eingesetzten Takes; RMS-dB, Median-F0, Dauer je Silbe)
| Wort (Take) | Silben: dB / F0 / Dauer | Ergebnis |
|---|---|---|
| **„Vorsteuerabzug“** (warum4) | **VOR −15,8 dB 129 Hz 0,13 s** · steu −15,7 dB 116 Hz 0,24 s · er −15,6 dB 101 Hz 0,05 s · ab −21,5 dB 88 Hz 0,14 s · zug −19,3 dB 103 Hz 0,24 s | **VOR-steu-er-ab-zug ✓**: Tonhöhengipfel auf VOR (+1,8 Halbtöne über „steu“, +6,6 HT über „ab“, +3,9 HT über „zug“); VOR so laut wie die lauteste Silbe, „ab“/„zug“ 3,5–5,7 dB leiser → kein Neben-Akzent „Vorsteuer-AB-zug“. „steu“ länger = Diphthong, kein Akzent (F0 tiefer). Vergleich andere Takes: warum12 130/120 Hz, warum7 123/120 Hz, warum8 158/113 Hz – alle VOR-Gipfel, warum4 bleibt. STT 12/12 „Vorsteuerabzug“. Kein neuer Take. |
| „Umsatzsteuer?“ (weg9, 1.) | UM −15,8 dB 110 Hz · satz −18,9/87 · steu −18,2/88 · er −27,8/80 | UM-satz ✓ (Gipfel + lauteste Silbe), kein Bruch |
| „Umsatzsteuer,“ (weg9, 2.) | UM −15,2 dB 145 Hz · satz −17,6/105 · steu −16,3/95 · er −20,3 | UM ✓ |
| „Kleinunternehmer“ (weg9) | KLEIN −16,7 dB 112 Hz 0,22 s · un −20,1/95 · ter −16,7/96 · neh −20,5/79 · mer −25,9 | KLEIN ✓ (längste Silbe, höchste F0) |
| „IHK“ (weg9) | I −14,5 dB 152 Hz 0,15 s · H −15,5/115 0,17 s · K −17,3/124 0,13 s | drei Buchstaben einzeln (I-Ha-Ka), kein „ick“ ✓; satzfinal fallend, STT 12/12 „IHK“ |
| „hundertneun“ (warum4) | hun −15,5/151 · dert −17,4/152 · neun −15,6/119 0,22 s | „neun“ voll und lang, kein „neunzig“ ✓; STT 12/12 |
| „siebzehn“ (warum4) | SIEB 0,24 s −19,6/137 · zehn 0,19 s −17,5/136 | zweisilbig, nie „siebzig“ ✓; STT 12/12 |
| „neunzehn“ (warum4) | NEUN 153 Hz 0,17 s · zehn 133 Hz 0,15 s | ✓, STT 12/12 |
| „Steuer“ CTA (cta1) | STEU −14,5 dB 204 Hz 0,30 s · er −17,3/210 0,14 s | STEU ✓, Anführungszeichen nicht gesprochen |
| „Websuche“ (weg9) | Web 0,23 s · su 0,16 · che 0,24 | deutsch „Webs-uche“, STT 12/12 „Websuche“ ✓ |
Keine Fehlbetonung → kein Wort umgeschrieben, kein neuer Take.

## Akte (roter Faden; Story-Objekt = STEUER-TAFEL „MIT USt | OHNE USt“)
1. **Hook** 0–6,13 · Tafel voll (91,60 € | 109 €, MIT gerahmt) → Board
2. **Rückblick** 6,13–13,01 · Board, Shirts, fünf Briefe, PREIS OFFEN
3. **Heute** 13,01–15,95 · Tafel leer, nur Köpfe
4. **Claude-Weg** 15,95–20,12 · ein Paper-Fenster: Shot 01 → 07 (kein Ortswechsel)
5. **Entscheidung** 20,12–23,67 · Shot 02 → Tafel, Stempel MIT UMSATZSTEUER
6. **Warum** 23,67–32,32 · Tafel oben; Grund 1 Pfeil-Kette (Betrieb → Steuer zurück → 17,40 €), Grund 2 Printful-Karton +19 %, Bauchbinde KEINE STEUERBERATUNG
7. **Haken** 32,32–34,54 · Tafel mit Schloss, 5 JAHRE BINDUNG
8. **Als Nächstes** 34,54–37,78 · leeres Rechnungsblatt
9. **CTA** 37,78–44,60 · Endkarte

## Beat-Plan (Zeiten aus words.json; Details, Shot-Bereiche, SFX in beats.json)
| Zeit | Gesagt | Bild (was ändert sich) | Kamera | Frage im Kopf | Ton | Muster |
|---|---|---|---|---|---|---|
| 0,00–0,74 | Wie viel Umsatz | Hook-Frage + STEUER-TAFEL: MIT USt 91,60 € / OHNE USt 109 €, „Betrieb zahlt effektiv“, MIT gerahmt + Haken | Push-in, Punch +4 % | Warum nimmt sie freiwillig Steuer? | pop, wqh, page, bump | M-002 |
| 0,74–3,38 | macht … lang | Haken glänzt, 91,60 pulst, OHNE dimmt, Sweep, fünf Shirts auf „100“ | atmet, Mini-Punch | Was heißt „effektiv“? | tick/popHi/click/page | M-002 |
| 3,38–4,95 | ganz alleine führt? | Stempel GANZ ALLEINE. | Punch-in | Wirklich ohne Mensch? | wq, clack, bump | M-011 |
| 4,95–6,13 | Ich probier das aus. | Board blendet ein, Maskottchen | Pull-back | Was für ein Experiment? | wq2, popHi, click | – |
| 6,13–9,50 | Die Firma … Betriebe | Board, Karte SHIRTS MIT LOGO | ruhig | Worum geht es? | wqh, popHi, tick | – |
| 9,50–10,83 | bestickt … Bestellung | Banner „erst auf Bestellung bestickt“ | steht | Ohne Lager? | page | – |
| 10,83–13,01 | Briefe stehen, Preis offen. | fünf Briefseiten, Glanz; Preisschild PREIS OFFEN | Push-in | Was ist heute dran? | page, tick, stamp | – |
| 13,01–15,95 | Heute: Mit oder ohne Umsatzsteuer? | Pill HEUTE: UMSATZSTEUER?, Tafel leer, Köpfe leuchten auf „Mit“/„ohne“ | Fahrt zur Tafel | Was ist besser? | wq2, chime, tick, tick, wshort | – |
| 15,95–20,12 | Claude: Marge angehängt, Websuche: Gesetz, IHK. | Shot 01 Anhang-Karte (+ Marker „keine Steuerberatung“) → Shot 07 „Das Web durchsucht, 3 Seiten gelesen“ → Marker „(Gesetz, BMF, IHK)“ | Push-in, Scroll | Woher weiß sie das? | page, popHi, click, typing, popLo, tick | M-004 |
| 20,12–23,67 | Sie wählt: mit Umsatzsteuer, nicht Kleinunternehmer. | Shot 02 fetter Satz → Tafel, Stempel MIT UMSATZSTEUER, OHNE durchgestrichen; Pause = Bild steht | Halt → Pull-back → Push-in | Warum freiwillig? | wq2, page, wshort, stamp, roll; Musik-Mulde | M-011 |
| 23,67–29,33 | Warum? Betriebe mit Vorsteuerabzug … zurück. | Pill WARUM?, Pfeil-Kette 3 Stationen; Shot 08 Zeile „effektiv zahlt“ weich (nur 91,60 € / 109 € lesbar), Beträge fliegen auf „holen“ in die Tafel-Zeile; Karte 17,40 € ZURÜCK ohne Zusatzzeile (≤ 12 neue Wörter: 8) | Fahrt zur Kette, Halt | Warum billiger für den Betrieb? | airy, pop, page, tick, wshort, clack, popLo; Musik-Drop | – |
| 29,33–32,32 | Ihr Einkauf bliebe sonst neunzehn Prozent teurer. | Bauchbinde KEINE STEUERBERATUNG; Printful-Karton; Karte +19 % EINKAUF (unter „als Kleinunternehmer“, kein Gegenwert), Shot 10 Grund 2 nur weich + Marker „19 % teurer“ (10 neue Wörter) | Fahrt zum Karton | Hat das einen Haken? | wshort, page, popHi, tick | – |
| 32,32–34,54 | Der Haken: fünf Jahre Bindung. | Schloss auf MIT-Spalte, Karte 5 JAHRE BINDUNG, Shot 04 weich + Marker „mindestens fünf Jahre“ (6 neue Wörter) | Push-in aufs Schloss | Und danach? | wq2, clack, stamp, tick | M-011 |
| 34,54–37,78 | Als Nächstes: Was muss auf ihre Rechnung? | Pill ALS NÄCHSTES, leeres Rechnungsblatt, Karte RECHNUNG? (kein Board; Badge-Wechsel erst in der CTA) | Push-in, Halt | Was gehört drauf? | airy, pop, page, popHi, popLo | – |
| 37,78–44,60 | Kommentiere „Steuer“ … durch. | Endkarte: Keyword Steuer, PROMPT, 10 MIN: BEIDE WEGE; Board-Stand nach der Folge | ruhig, Halt | – | pop, typing, check, wqh, popHi, chime, tick, pop | M-007 |

Kartenabstände (beats.json-Ausgabe) 1,28–3,66 s, nie zwei Blöcke gleichzeitig, alle Karten ≤ 4 Wörter (+ kleine Unter-/Gegenzeile). Hook-Ereignisse ≤ 0,5 s wie Folge 19.

## Board nach der Folge (CTA)
WERBEBRIEF + ADRESSEN current (gold, kein Haken), DRUCK + PREIS Haken + Badge „5ER OFFEN“, **GEWERBE offen + Badge „MIT UST“** (Entscheidung, nicht angemeldet). Erledigt bleiben PRODUKT, PARTNER, LOGO, BETRIEBE; WEBSITE wip. Kein neues Feld, kein Umsatz-Zähler.

## Screenshots (design/lauf/, echte claude.ai-Pixel)
| Shot | Einsatz | Bereich |
|---|---|---|
| 01 | B09 Claude-Weg | Anhang-Karte; Marker auf Promptzeile „… keine Steuerberatung ist.“ |
| 07 | B09 | „Das Web durchsucht, 3 Seiten gelesen“, dann „(Gesetz, BMF, IHK)“ |
| 02 | B10 Entscheidung | nur fetter Satz (11 Wörter) |
| 08 | B11 Warum 1 | Zeile „Was ein Handwerker mit Vorsteuerabzug effektiv zahlt“ weich; lesbar NUR 91,60 € und 109 €, „bzw. 25,13 €“/„bzw. 29,90 €“ abgedeckt; Formeln/P nie |
| 10 | B12 Warum 2 (Grund 2); Reserve B13 „Der Preis dafür …“ | nur bis „… dauerhaft 19 % teurer.“ hell (weich + Marker), „Das gilt ohne USt-ID und auch mit USt-ID …“ abgedunkelt |
| 04 | B13 Haken | Verzicht-Zeile weich, scharf nur „mindestens fünf Jahre“ |
| 09 | Reserve B11 | nur „… Handwerker aber 17,40 € pro Paket teurer“, „Marge sogar 19 % höher“ nie |
| 05, 11, 12 | frei, nicht eingeplant (05 nur mit sichtbarem „laut Testbericht“) | – |
| 03, 06 | **nie** (Grenzen nicht gesprochen / Fachwort-Last) | – |

## Zahlen im Bild (nur belegt aus Lauf 20)
100 (Serie), 109 € und 91,60 € („effektiv zahlt“, Shot 08), 17,40 € (Shot 09/08: 109 − 91,60), +19 % (Shot 10), 5 Jahre (Shot 04/10, § 19 Abs. 3 UStG gegengeprüft), 10 Min (CTA). Sonst keine Zahl.

## Verbote (Auszug, voll in beats.json)
Marge/Gewinn in Euro · 18,32/17,02/25,13 groß · „das Finanzamt sagt“ · „angemeldet“/„USt-ID beantragt“/Haken an GEWERBE · „Printful bestätigt 19 %“ · „alle Betriebe holen Steuer zurück“ · Steuerrat an den Zuschauer · Grund 3/§ 14 lesbar · Umsatz-Zähler · TAG-Slam · „gestern“ · Namen/Orte/Mails · Sidebar/„Wieder am Start“.
**„KEINE STEUERBERATUNG“** sichtbar: Bauchbinde ab 29,33 bis 33,86 + Marker auf der Promptzeile in Shot 01 (B09) + Caption.

## Musik
GONE ab **152,60 s**, Stem 45,30 s bis **197,90** (Fenster 152,0–199,95), Mulde vor „Warum?“, Drop auf „Warum?“, 0 explizite Wörter (3 Läufe). Details `musik.txt`.

## Risiken / Hinweise an Design und Chef
- Tempo 134,5 wpm liegt knapp unter der Obergrenze: Endkarte nicht kürzer als 1,03 s machen (bei SEC < 44,44 s → > 135 wpm).
- Pause „Rechnung? → Kommentiere“ 0,96 s > 0,7 s (Akt-Naht, Endkarte fährt ein, wie Folge 17/19 akzeptiert). Kürzen würde wpm über 135 treiben.
- Tagesbriefing nennt Slot 15:00, Auftrag 21:00 – beats.json trägt 21:00; Text ist slot-unabhängig (kein „Tag“).
- „siebzehn“ gesprochen, Karte „17,40 €“ (Autor-Entscheid, thema.md) – Design nie „17 €“ als Karte.
- Rückblick-Badge GEWERBE „UST ?“ (Stand Folge 19) wechselt erst in der CTA-Board-Ansicht (B15) zu „MIT UST“ (Prüfer R1 zugestimmt); Autor schlug neues Feld „STEUER“ vor – Regie löst es als Badge, damit das Board gleich bleibt. Falls der Chef ein Feld will: nur Plan-Notiz ändern.
- Musik: gleicher Track-Bereich wie Folge 17 (Vortag 154,3–199,5) – laut Tagesplan erlaubt, aber Wiederkehrer hören dieselbe Stelle.
- Bibel-Vorschlag (Chef trägt ein): „Folge 20 (2026-11-01): Claude entscheidet per Websuche (Gesetz, IHK) ‚mit Umsatzsteuer, nicht Kleinunternehmer‘ – Betriebe mit Vorsteuerabzug holen sich 17,40 € von 109 € zurück, Printful bliebe als Kleinunternehmer 19 % teurer; Haken fünf Jahre Bindung. Kasse 0 € → 0 €. Menschen-Schritte offen: Verzicht/USt-ID/Gewerbe, Einkaufspreis. Faden morgen: Was muss auf ihre Rechnung?“

## Änderungen Runde 1 (Tickets regie-R1-01..04, 2026-11-01; Stimme, words.json, Musik unverändert)
- R1-01 B12: Gegenwert „MIT USt-ID: 0 %“ gestrichen (+ in Verbote); Shot 10 grund2 nur bis „… 19 % teurer.“ hell, Rest Zeile 2 abgedunkelt; B11 Shot 08: nur 91,60 € / 109 € lesbar, „bzw. 25,13 €“/„bzw. 29,90 €“ abgedeckt (Koordinaten in beats.json).
- R1-02 B05: Ereignisse „Logo@7.9“ (8,01) + „kleine@8.3“ (8,48) statt „Betriebe@8.6“; B03 Tick „führt:end+0.1“ (4,43); B15 Ereignis 43,57 (Endkarte-Halt). Prüfer-gaps.py: 0–6,13 keine Lücke > 0,5 s, danach keine > 1,5 s.
- R1-03 B11 Karte „17,40 € ZURÜCK“ ohne Unter-/Gegenzeile, 91,60/109 nur einmal (Shot 08 → fliegen auf „holen“ in die Tafel-Zeile); B12 „+19 % EINKAUF“ nur mit „als Kleinunternehmer“, Shot 10 weich + Marker; B13 Shot 04 weich + Marker „mindestens fünf Jahre“; Wortzahl je Beat im „bild“ (8 / 10 / 6). Zusätzlich (Prüfer-Hinweis): Badge-Wechsel GEWERBE „UST ?“ → „MIT UST“ erst in der CTA-Board-Ansicht.
- R1-04 B09 wort_start {"w":"Claude","after":15.5,"offset":0.15} → von 15,95; alle Beats außer B01 auf Wort + after.
