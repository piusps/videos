# Prüfung final · Folge 20 „Mit oder ohne Umsatzsteuer?“ · Runde 1 (Slot 2026-11-01 21:00, Serientag 5, nicht erste Folge)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-11-01. Nichts geändert, nur Belege in `pruefung/final-r1/` angelegt.
Gemini/OpenRouter: `review-video.mjs` versucht → **402** (`final-r1/gemini-402.txt`), deshalb manuell Frame für Frame und Pixelmessung (PIL). ffmpeg nur `node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge: `firma-tag20-final.mp4` (44,600 s, 1080×1920, 30 fps, h264 9,5 Mbit/s, AAC 48 kHz), `firma-tag20-final-handy.mp4` (44,608 s, 1,74 Mbit/s), `kontaktbogen-2fps.jpg`, `cover.jpg`, `caption.txt`, `replies.json`, `umsatzsteuer-guide.pdf` (10 Seiten) + `guidebook.json` + `guide-pages/`, `prompt-fuer-kommentare.md`, `format.json` (PTC).
Maßstab: script.txt, briefing.md, regieplan.md, beats.json, design/lauf/ (LAUF.md, bericht.md, Kolonnenshirt_Marge.md, Shots), Tagesbriefings 2026-11-01 / 2026-10-30, Folge 17 final R1/R2, design-runde1/2 (H5–H10), Folge 19 script.txt.

## Belege (`pruefung/final-r1/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos mit 4 fps (je 6 s, Zeitstempel absolut)
- 30-fps-Streifen an allen Übergängen: `tr-a.jpg` (0,87 Hook-Abgang · 4,73 Hook→Board · 6,00 Board-Zoom · 10,60 Board→Briefe), `tr-b.jpg` (12,87 →Heute · 15,67 →Claude · 17,00 Shot 01→07 · 19,93 →Entscheidung), `tr-c.jpg` (20,87 Shot 02→Tafel · 23,33 →Warum · 29,10 Grund 1→2 · 32,20 →Haken), `tr-d.jpg` (34,30 →Als Nächstes · 37,50 →CTA · 39,80 Board→DM-Karte · 41,20 →10 MIN)
- Maskottchen: `mask-kleinunternehmer-21.7-23.53.jpg` (8 Ausschnitte), Streifen `tr-a…d`
- Schrift: `schrift-2.png … schrift-7.png` (Lineal in px), `als-kleinunternehmer-31.0.png`
- Fakten: `bedingung-hook-vs-warum.jpg` (2,0 / 26,0 / 31,0 / 33,75), `full_<s>.jpg` (2,0 / 24,0 / 27,75 / 31,0 / 33,75 / 38,5 / 41,5), `cta-board-cover.jpg`, `guide-1-10.jpg`
- Ton: `final-audio.mp3`, `stt-final-mix.json` + `stt-final-mix-2.json` (je 3 × Scribe der fertigen Mischung), `stt-voice.json` (3 × Scribe auf voice.mp3 zum Vergleich)

## Messwerte
| Punkt | Wert | Soll |
|---|---|---|
| Länge final / handy | 44,600 / 44,608 s | 40–48 s ✓ |
| Wörter / Tempo | 100 Wörter / 134,5 wpm (inkl. Pausen) | 85–100 / 120–135 ✓ (knapp) |
| Rückblick / „Heute“ | 6,13–12,49 = 6,36 s / „Heute“ 13,01 s | ≤ 6,5 / ≤ 14,5 ✓ |
| STT fertige Mischung (6 Läufe) | wortgleich mit script.txt bis auf bekannte STT-Formen („probiere“ 6/6, „schicke“ 4/6, Zahlen ausgeschrieben) und **„Websuche“ → „Websearch“ 3/6** (andere 3: „Web-Suche“). Auf voice.mp3 allein 3/3 „Web-Suche“ (Regie 12/12). Ursache: SFX `typing` liegt genau auf „Websuche“ (beats.json B09). **„Vorsteuerabzug“ 6/6 richtig.** Kein „Tag“, kein „gestern“ | ✓ mit Abzug (Backlog-Ticket) |
| Lautheit final / handy | −14,0 LUFS, LRA 2,0 LU, True Peak −1,2 dBFS / −14,1 LUFS | −14 ±0,5 ✓ |
| Musik unter Stimme | Sprache (STT-Wortfenster) −15,8 dB mean; Musik-Boden in Sprechpausen (min. 100-ms-RMS) −42 bis −60 dB → ≥ 26 dB Abstand; Regie-Messung je Akt 22,2–25,5 dB; Abschnitt 152,6–197,9 am Stück im Fenster 152,0–199,95, 0 explizite Wörter | ≥ 15 dB ✓ |
| blackdetect | 0 | ✓ |
| freezedetect (≥ 0,6 s) | 1 Treffer **22,40–23,03 s (0,63 s)**: geplante Pause nach „Kleinunternehmer.“ (Regieplan „Pause = Bild steht“), Musik-Mulde, kein Hook-Bereich | ok (Hinweis H3) |
| Handy-Fassung | SSIM zum Master 0,991 (5 fps) | ✓ |
| Kontaktbogen-2fps | deckt sich mit dem Master | ✓ |
| Untertitel-Sync | „Websuche“ STT 17,38 / Pill 17,33–17,37 · „Vorsteuerabzug“ 25,26 / 25,25 · „Warum“ 23,67 / 23,67 · „Steuer“ (CTA) 38,68 / 38,75 | ≤ 0,1 s ✓ |
| Caption | 2082 Zeichen, keine Emojis, „Tag“ nur in „100 Tage“, Fiktiv-Hinweis + 6 Hashtags | < 2100 ✓ |
| replies.json | 1 + 5 Antworten, alle enden mit Frage, keine Emojis, Florent-Ton, keine Zusagen außer Prompt in DM | ✓ |

## Maskottchen-Durchgang (ganzes Video, eigener Durchgang; ≤ 1/3 verdeckt, Augen frei, nichts auf den Augen)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,00–0,87 | ganz sichtbar im Raum unter der Tafel | ok |
| 0,90–4,87 | ganz weg (Raum verschwindet in einem Frame 0,87→0,90, wie F17 R1-04) | ok (ganz weg) |
| 4,90–6,03 | ganz sichtbar; Pills „ganz alleine führt“ / „Ich probier“ auf der Kopfoberkante (< 10 %), Augen frei | ok |
| 6,07–10,77 | Halbprofil unten rechts ganz im Bild; SHIRTS-Karte endet darüber; Pills unter dem Kopf | ok |
| 10,80–21,00 | Vollbild-Einschübe Briefe/Heute/Claude: Maskottchen klein unten rechts **ganz sichtbar**, Füße im Bild, „?“-Blase darüber | ok (Soll „ganz sichtbar“ erfüllt) |
| 21,03–23,53 | Tafel/Stempel: ganz sichtbar; beim Hüpfer 23,20–23,47 liegt die Pill „Kleinunternehmer“ auf der Kopfoberkante (≈ 5–10 %), Augen frei (`mask-kleinunternehmer-…jpg`) | ok |
| 23,57–34,37 | Warum/Haken: ganz sichtbar unter dem Panel, Untertitel darunter | ok |
| 34,40–37,60 | klein unten rechts ganz sichtbar | ok |
| 37,63–40,03 | CTA-Board: groß ganz sichtbar, Pills „ihre Rechnung“ (bis 37,73) / „Kommentiere Steuer“ / „ich schick dir“ an der Kopfoberkante, Augen frei; DM-Flieger 39,80–40,07 fliegt über dem Board, **nicht über die Augen** (F17-H2 behoben) | ok |
| 40,07–44,60 | groß, ganz sichtbar inkl. Füße (Hüpfer 43,25–43,5), Pills an der Kopfoberkante, Augen frei; Augen wechseln 40,07 gefüllt → hohl (Alt-H5 F17) | ok |

**Kein Maskottchen-K.-o.** Gesicht weiter überstrahlt (Alt-H6).

## Übergänge 30 fps – Befund
- Sauber (harter Schnitt im selben Frame, kein Doppelbild): 4,87→4,90, 6,03→6,07, 10,77→10,80, 12,87→12,90, 15,83→15,87, 17,27→17,30, 20,00→20,03, 21,00→21,03, 23,53→23,57, 29,20→29,23, 32,20→32,23, 34,37→34,40, 37,60→37,63, 40,03→40,07, 41,37→41,40.
- **H10 (Doppelrahmen 20,97–21,00) im Final nicht mehr sichtbar** – erledigt.
- Restschwächen (kein K.-o.): 0,87→0,90 Raum + Maskottchen weg in 1 Frame (F17 R1-04 offen); 15,67–15,83 Rest der HEUTE-Pill schrumpft als roter Strich (H9, bestätigt, fällt auf dem Handy als kurzes Flackern auf); 37,63–37,73 Pill „ihre Rechnung“ läuft 3 Frames ins CTA-Board; 40,07 Augenwechsel.

## Texte ≥ 58 px (Versalhöhe gemessen an 1080×1920; Schrift ≈ Versal / 0,72)
| Text | Zeit | Versal | ≈ Schrift | Urteil |
|---|---|---|---|---|
| Hook-Frage | 0–6,0 | ≈ 53 | ≈ 74 | ✓ |
| „Mit Vorsteuerabzug zahlt:“ | 0–4,87 | 44 | ≈ 61 | ✓ |
| MIT USt / OHNE USt (Hook) · 91,60 € / 109 € | 0–4,87 | ≈ 50 / > 60 | ≥ 69 | ✓ |
| SHIRTS MIT LOGO · „erst auf Bestellung“ | 6,9–10,77 | ≈ 60 · 48 | ≈ 83 · 67 | ✓ |
| PREIS OFFEN · HEUTE: UMSATZSTEUER? · MIT/OHNE USt | 11,5–15,83 | ≥ 55 | ≥ 76 | ✓ |
| Claude: „Kolonnenshirt_ Marge.md“ · „das keine Steuerberatung ist.“ | 15,87–17,27 | ≈ 45 · 46 | ≈ 62 · 64 | ✓ |
| „Das Web durchsucht,“ · „(Gesetz, BMF, IHK)“ | 17,30–20,00 | ≈ 48 · 46 | ≈ 64–67 | ✓ |
| Shot 02 „Meine Entscheidung: Starte mit Umsatzsteuer, …“ | 20,03–21,00 | 43–46 | ≈ 60–64 | ✓ (knapp) |
| Stempel MIT UMSATZSTEUER | 21,7–23,53 | ≈ 45 | ≈ 62 | ✓ |
| Warum-Panel MIT USt · 91,60 € | 23,57–34,37 | 49 · > 60 | ≈ 68 | ✓ |
| Shot 08 „91,60 €“ / „109 €“ | 25,25–26,0 | ≈ 42 | ≈ 58 | ✓ (Grenze) |
| „17,40 € ZURÜCK“ | 27,5–29,20 | 40–42 | ≈ 56–58 | Grenze (H1) |
| KEINE STEUERBERATUNG | 29,4–34,37 | 46 | ≈ 64 | ✓ |
| „+19 % EINKAUF“ | 30,4–32,20 | ≈ 50 | ≈ 69 | ✓ |
| **„als Kleinunternehmer“** (Bedingung zu +19 %) | 30,4–32,20 | **37** („K“ 808–844) | **≈ 51** | **✗** |
| „19 % teurer.“ (Shot 10 Marker) | 30,5–32,20 | ≈ 45 | ≈ 62 | ✓ |
| 5 JAHRE BINDUNG · „mindestens / fünf Jahre“ | 32,9–34,37 | 44 · x-Höhe 33 | ≈ 61 · ≈ 62 | ✓ |
| Als Nächstes: Rechnung? | 34,5–37,6 | ≈ 60 | ≈ 83 | ✓ |
| KOMMENTIERE · STEUER · PROMPT · 10 MIN: BEIDE WEGE · „Erfinde nichts.“ | 37,7–44,6 | 47–60 | ≥ 65 | ✓ |
| Board-Feldtexte, Plaketten „5ER OFFEN“/„MIT UST“ | 5–10,8 / 37,6–40,0 | ≈ 25–35 | ≈ 35–50 | Engine-Bestand wie F13–F19 |

## Fakten Satz für Satz (gegen design/lauf/LAUF.md, bericht.md, Gegenprüfung)
| Aussage (Ton / Bild) | Lauf | Urteil |
|---|---|---|
| Hook-Tafel „Mit Vorsteuerabzug zahlt: MIT USt 91,60 € / OHNE USt 109 €“ | Claude-Tabelle „Was ein Handwerker mit Vorsteuerabzug effektiv zahlt: 91,60 € / 109 €“; 109 ÷ 1,19 = 91,60 | ✓ Bedingung sichtbar |
| „Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, bestickt erst auf Bestellung.“ | Kolonnenshirt_Marge.md | ✓ |
| „Briefe stehen, Preis offen.“ | Ergebnis Folge 19 (Versandbeträge gestrichen, 109 € offen) | ✓ Kette |
| „Heute: Mit oder ohne Umsatzsteuer?“ | F19 „Als Nächstes: Mit oder ohne Umsatzsteuer?“ wörtlich | ✓ Kette |
| „Claude: Marge angehängt, Websuche: Gesetz, IHK.“ / Shot 01 + 07 „(Gesetz, BMF, IHK)“ | Anhang Kolonnenshirt_Marge.md, 5 Websuchen (§ 19 UStG, IHK), erster Satz Claudes wörtlich | ✓ |
| „Sie wählt: mit Umsatzsteuer, nicht Kleinunternehmer.“ / Shot 02 / Stempel | „Starte mit Umsatzsteuer, also mit Verzicht auf die Kleinunternehmerregelung.“ | ✓ |
| „Betriebe mit Vorsteuerabzug holen von hundertneun Euro siebzehn Steuer zurück.“ / 17,40 € ZURÜCK | 109 − 91,60 = 17,40 ✓ (Grund 1, Gegenprüfung) | ✓ im Ton; **Bild: siehe unten** |
| „Ihr Einkauf bliebe sonst neunzehn Prozent teurer.“ / +19 % EINKAUF als Kleinunternehmer / Shot 10 | Grund 2 (Testbericht), nur als Folge für die Firma, kein Printful-Zitat; Gegenwert „0 %“ gestrichen | ✓ |
| „Der Haken: fünf Jahre Bindung.“ / Shot 04 „mindestens fünf Jahre“ | § 19 Abs. 3 UStG gegengeprüft | ✓ |
| „Als Nächstes: Was muss auf ihre Rechnung?“ | Übergabe-Vorschlag LAUF/bericht | ✓ |
| **Warum-Tafel 23,57–34,37: „MIT USt ✓ 91,60 € / OHNE USt 109 €“ ohne Bedingungszeile** | gilt nur „mit Vorsteuerabzug“ | **✗ (Abzug, blockierend):** Im Hook steht die Bedingung als Kopfzeile, im Warum-/Einkauf-/Haken-Akt fehlt sie ≈ 10,8 s lang. Ohne Ton liest man „mit Umsatzsteuer kostet es 91,60 €, ohne 109 €“ – das ist falsch für Privatkunden und Kleinunternehmer-Betriebe und für die Firma selbst. Gesprochen und als Pill kommt „Vorsteuerabzug“ nur 25,0–26,1; Shot-08-Kopfzeile ist unlesbar; einzige Bildbrücke ist das Haus-Icon (`bedingung-hook-vs-warum.jpg`). |
| „Keine Steuerberatung“ sichtbar | Marker Shot 01 (16,7–17,27) + Bauchbinde 29,4–34,37 + Caption + Guide | ✓ |
| Menschen-Schritte | Board GEWERBE ohne Haken, nur Plakette „MIT UST“; nirgends „angemeldet“/„USt-ID beantragt“ | ✓ |
| Kein Umsatz-Zähler / kein TAG-Slam / kein gesprochenes „Tag“ | nur HUD-Badge „TAG 5“; Kasse nicht gezeigt | ✓ |
| Verbotene Zahlen | 18,32 / 17,02 / 25,13 / 129,71 / Marge in € / Grund 3 / Shot 03, 06 nie im Bild | ✓ |

## Datenschutz
Claude-Fenster nur mit Kopf „Claude“, keine Sidebar, keine Chatliste, kein Name, keine Mail; Begrüßung nicht im Bild; oberste Zeile in 17,3–20,0 unscharf. Cover, Guide-Bilder ebenso. ✓

## CTA-Board (37,63–40,03)
Stand nach der Folge: 1/3/4/7 erledigt, 2 DRUCK + PREIS grün mit Plakette „5ER OFFEN“ (Haken verdeckt, H8 offen), 5 WEBSITE in Arbeit, **6 GEWERBE offen mit Plakette „MIT UST“, kein Haken**, 8 BRIEF current „?“, 9 ERSTER UMSATZ offen. Plan-HUD oben rechts gleich. ✓ (`cta-board-cover.jpg`)

## Guide (`umsatzsteuer-guide.pdf`, 10 Seiten)
- Deckt den CTA: Prompt zum Kopieren (Variante A = echter Lauf-Prompt verallgemeinert, B als „nicht getestet“), Klickpfad mit Gedächtnis aus, Quick Win „10 Minuten … beide Wege durchgerechnet“, Rechenweg mit Eintrage-Tabelle. ✓
- Rechnungen nachgerechnet: 109 ÷ 1,19 = 91,596 → 91,60 ✓ · 109 − 91,60 = 17,40 ✓ · 5 × 1,19 = 5,95 ✓ · 109 ÷ 5,95 = 18,32 ✓ · (91,60 − 6,50) ÷ 5 = 17,02 ✓ · 2,95 × 1,19 = 3,51 ✓ · 6,50 × 1,19 = 7,74 ✓ · 29,90 ÷ 1,19 = 25,13 ✓ · 29,90 − 25,13 = 4,77 ✓ · 109 × 1,19 = 129,71 ✓ · 1,19 × (91,60 − 5P) = 109,00 − 5,95P ✓ (19 % mehr Marge) · 0,95 × P als Claude-Aussage gekennzeichnet ✓.
- 1:1-außer-Liste eingehalten: 19 % nur „laut Testbericht“, „Verzicht sinnvoll“ mit IHK Schwarzwald-Baar-Heuberg, BMF-Erlass „laut IHK Ostwürttemberg, nicht gelesen“, kein UStAE/Erwerbsschwelle, 17,02 € nur mit „6,50 € Digitalisierung“ und „ohne Versand“. „keine Steuerberatung“ 5×, boilr/Namen/Orte 0×. Menschen-Schritte als eigene Liste. ✓

## Cover / Caption
- Cover: „Mit oder ohne Umsatzsteuer?“ + Tafel **mit** Kopfzeile „Mit Vorsteuerabzug zahlt:“, Maskottchen ganz, HUD „TAG 5“ (Badge erlaubt), kein Name. ✓
- Caption: Beträge nur mit Bedingung („Zahlt ein Betrieb mit Vorsteuerabzug 109 € …“), Gegenseite ehrlich, „nur Testbericht“, Menschen-Schritt Finanzamt, „keine Steuerberatung“, Menüpfad, Fiktiv-Hinweis. ✓ Klein: Prompt in Schritt 2 ist gekürzt, nicht als „sinngemäß“ markiert (wie F17-H4).

## Scroller-Test
1 s: Frage + Tafel „91,60 € vs 109 €“ mit Haken → bleibt (Rätsel: warum zahlt man mit Steuer weniger?). 3 s: Sweep + Shirts + „100“ → bleibt. 10 s: Board + SHIRTS MIT LOGO + „erst auf Bestellung“ → bleibt. 24 s: WARUM? + Tafel → bleibt, aber Panel halb leer bis 25,2 s (H7) und ohne Ton fehlt die Bedingung (Ticket 02).

## Noten je Kriterium
| Kriterium | Note | Beleg / Abzug |
|---|---|---|
| Hook (0–6 s) | 9 | Bedingung sichtbar, Ereignisse ≤ 0,5 s, Stempel GANZ ALLEINE. ganz vor der Tafel |
| Serienrahmen Nicht-Erstfolge | 9 | kein „Tag“/„gestern“/TAG-Slam/Zähler, Kette F19→F20 wörtlich |
| Ton: Stimme, Tempo, Aussprache | 8 | „Vorsteuerabzug“ 6/6; „Websuche“ in der Mischung nur 3/6 (typing-SFX darauf) |
| Musik + Lautheit | 9 | −14,0 LUFS, Musik ≥ 26 dB unter Stimme, am Stück im Fenster |
| Untertitel | 9 | synchron, Augen nie bedeckt |
| **Text-Regeln / Lesbarkeit** | **7** | „als Kleinunternehmer“ ≈ 51 px; „17,40 € ZURÜCK“ an der Grenze |
| Bildfluss / Maskottchen | 8 | kein K.-o.; Abzug Hook-Abgang 1 Frame, H9-Pillrest, Panel halb leer 23,57–25,2 (H7), Pill-Überhang 37,63 |
| **Fakten / Board / Kette** | **7** | alles belegt, Board richtig, aber Warum-Tafel 23,57–34,37 ohne Bedingung „mit Vorsteuerabzug“ |
| Anonymisierung | 9 | sauber |
| CTA + Guide + Funnel | 9 | Guide deckt CTA, Rechnungen stimmen, replies ok |
| Look vs. Folge 17/19 | 8 | Tafel-Story-Objekt stark, Claude-Shots groß; Abzug Gesicht überstrahlt, graue Balken über „Erfinde nichts.“ 40,1–41,4 (Alt-H5), Haken Feld 2 verdeckt (H8) |
| Cover / Caption | 9 | Bedingung auf dem Cover, Caption 2082 Zeichen |

## Gesamtnote
**7,5 / 10** (Schnitt ≈ 8,4, aber zwei Kriterien unter 8 → nach Regel nicht bestanden). Kein K.-o.: Kein Fakt ist falsch gesprochen, die Maskottchen-Regel hält, Lautheit und Ton im Ziel.

## Urteil
**Nicht bestanden (Runde 1).** Korrektur klein und lokal im Warum-Akt (eine Kopfzeile, eine Unterzeile), Ton/Musik/Schnitte bleiben. Danach Runde 2 mit frischem Agent: nur Ticket-Stellen + Regression + Maskottchen-Durchgang.

## Tickets
```
TICKET final-R1-01 → firma-design   (blockierend)
Kriterium: Text-Regeln / Lesbarkeit · Note: 7/10
Beleg: 00:30,4–00:32,2 · final-r1/als-kleinunternehmer-31.0.png, full_31.0.jpg, schrift-5.png
Problem: Unterzeile „als Kleinunternehmer“ (Bedingung zu +19 % EINKAUF) hat 37 px Versalhöhe (≈ 51 px Schrift).
Soll: „als Kleinunternehmer“ ≥ 58 px Schrift (Versal ≥ 42 px, Ziel ≥ 46) bei 1080×1920; Karte bleibt im Panel, höchstens ein neuer Textblock gleichzeitig, Maskottchen unter dem Panel weiter ganz sichtbar.
```
```
TICKET final-R1-02 → firma-design   (blockierend; Freigabe firma-regie für die Bildzeile)
Kriterium: Fakten / Board / Kette · Note: 7/10
Beleg: 00:23,57–00:34,37 · final-r1/bedingung-hook-vs-warum.jpg, full_24.0.jpg, full_31.0.jpg, full_33.75.jpg
Problem: Die Warum-Tafel zeigt „MIT USt 91,60 € / OHNE USt 109 €“ ≈ 10,8 s ohne die Bedingung „mit Vorsteuerabzug“, die im Hook als Kopfzeile steht; ohne Ton liest es sich als allgemeiner Preis.
Soll: Von 23,57 bis 34,37 steht über oder in der Tafel lesbar „Mit Vorsteuerabzug zahlt:“ (gleiche Kopfzeile wie Hook, ≥ 58 px, kein neuer Textblock zusätzlich zum Zeitpunkt des Einblendens anderer Karten – z. B. von Anfang an Teil der Tafel); 91,60 € erscheint nirgends im Video ohne diese Bedingung.
```
```
TICKET final-R1-03 → firma-regie   (Backlog, nicht blockierend)
Kriterium: Ton · Note: 8/10
Beleg: 00:17,38–00:17,84 · final-r1/stt-final-mix.json, stt-final-mix-2.json, stt-voice.json
Problem: SFX „typing“ (v 0,16) liegt genau auf „Websuche“; Scribe hört in der Mischung 3/6 „Websearch“, auf der reinen Stimme 3/3 „Web-Suche“.
Soll: typing-SFX ≥ 0,15 s nach Wortende von „Websuche“ (oder leiser/weg); STT der fertigen Mischung 6/6 „Websuche“/„Web-Suche“.
```
```
TICKET final-R1-04 → firma-design   (Backlog, nicht blockierend)
Kriterium: Bildfluss / Look · Note: 8/10
Beleg: 00:00,87→00:00,90 (tr-a.jpg) · 00:15,67–00:15,83 (tr-b.jpg) · 00:23,57–00:25,2 (full-4fps-04/05) · 00:37,63–00:37,73 (tr-d.jpg) · 00:40,1–00:41,4 (full-4fps-07) · 00:27,5–00:29,2 (full_27.75.jpg)
Problem: Hook-Raum verschwindet in einem Frame; HEUTE-Pill schrumpft als roter Strich aus (H9); Warum-Panel rechts ≈ 50 % leer bis 25,2 s (H7); Pill „ihre Rechnung“ läuft 3 Frames ins CTA-Board; graue Platzhalter-Balken über „Erfinde nichts.“ (Alt-H5); „17,40 € ZURÜCK“ nur 40–42 px Versal.
Soll: Raum-Abgang ≥ 6 Frames oder Schnitt mit SFX; Pills enden mit dem Schnitt; Panel bis zum Beleg kompakter (≤ 25 % Leerfläche); keine grauen Platzhalter-Balken; „17,40 € ZURÜCK“ Versal ≥ 46 px.
```
Hinweise (kein Ticket): H1 „17,40 € ZURÜCK“ und Shot-08-Beträge liegen genau an der 58-px-Grenze (siehe Ticket 04). H2 H8 (Haken von Feld 2 unter „5ER OFFEN“) unverändert, Board trotzdem lesbar. H3 Standbild 22,40–23,03 s ist gewollt (Pause nach der Entscheidung); bei einer Korrektur nicht verlängern. H4 Musik-Bereich gleich wie Folge 17 (laut Tagesplan erlaubt). H5 Caption-Schritt 2 als „sinngemäß“ markieren (18 Zeichen Luft bis 2100). H6 Maskottchen-Gesicht weiter überstrahlt (F16-R2-03).
