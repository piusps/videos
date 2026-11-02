# Prüfung autor · Folge 6 „Partner“ · Runde 2 (Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md` gegen `pruefung/autor-runde1.md`, die Altfassungen `pruefung/script-vor-r1.txt` + `caption-vor-r1.txt`, `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `../firma-tag5/script.txt`, `../firma-tag7/briefing.md`, `../firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8 + Chef-Entscheide), Kalibrierung `../firma-tag4/words.json`.

**Ergebnis: BESTANDEN** (alle Kriterien ≥ 8, kein K.-o. verletzt). Weiter an firma-regie.

## Diff gegenüber Runde 1 (nachgeprüft)
- script.txt:8 „am Markt hundertzehn“ → „am Markt rund hundertzehn“ (+1 Wort).
- script.txt:9 „Die Händlerpreise frage ich an.“ → „Händlerpreise und Einrichtungskosten findet Claude dort nicht.“ (+2 Wörter).
- Rückblick-Satz 2 unverändert „Ihre Lücke: Shirts einzeln nachbestellen.“
- caption.txt:10 „stehen nirgends. Die Anfrage schicke ich …“ → „… (also auch, ob bei Nachbestellungen neue Einrichtung anfällt) und Lieferzeit hat Claude bei A61 nicht gefunden; die müssten angefragt werden.“; „rund 110“ → „rund 110 Euro“. Sonst Caption identisch (diff geprüft).
- thema.md: Grenze-Absatz (Z. 7), Faktenabgleich, Befund-Beat statt „Hand legt Brief“, Notiz an Pius (Mail-Connector, Regel 6) neu. Keine Menschen-Handlung mehr in Skript, Caption, Regie-Notizen.
- Wortzahl: 135 (wc), Altfassung 132.

## Noten

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Tickets R1-1, R1-2, R1-3 erfüllt | 9 | R1-1: „Einrichtungskosten“ steht im Skript (script.txt:9), 1:1 zu bericht.md:3 „Kosten für das Stickprogramm … nicht zu finden (n. g.)“ und LAUF.md:19; kein Satz behauptet, A61 erfülle „ohne neue Einrichtung“ (Grund 2 sagt nur „ab einem Stück“ = bericht.md Grund 2). Rückblick 11 Silben, 135 Wörter. R1-2: keine angekündigte Handlung des Erzählers mehr; Regie-Bild „Händlerpreis: ?“/„Einrichtung: ?“ statt Brief (thema.md Befund-Beat); Mail-Connector-Notiz an Pius vorhanden. R1-3: Caption wörtlich nach Formulierungsvorschlag, „nicht gefunden“ statt „nirgends“, Einrichtung bei Nachbestellung als offen benannt. TTS-Test „Einrichtungskosten“ an Regie übergeben (thema.md). |
| 2 | Nichts Neues kaputt | 9 | „dort“ in script.txt:9 bezieht sich eindeutig auf A61 (direkt nach „fünf Shirts dort“). Befund-Satz übergibt sauber an „Als Nächstes rechnet sie …“. Caption-Rest unverändert, Reihenfolge Fiktiv-Hinweis → Hashtags intakt. Einziger Nebeneffekt: Skript steht jetzt exakt an der Wortobergrenze 135 (siehe H1). |
| 3 | Pius-Regeln | 9 | Eröffnung script.txt:1 wörtlich, ohne „Tag zwei“; kein „Tag N“, kein „gestern“ in Skript und Caption (grep; Caption „In der letzten Folge“). Rückblick: Satz 1 = 3,83 s (words.json 5,732→9,562), Lücke ~0,06 s, Satz 2 11 Silben ≈ 1,9 s (Folge 4: 12 Silben = 2,06 s inkl. Doppelpunkt, dort Pause nur 0,009 s) → ≈ 5,8 s ≤ 6 s. Warum: 2 Gründe mit Zahl (60 Grad, ein Stück), je eigener Satz, 1:1 bericht.md Entscheidung 1+2. Ansprache: „du/dir/dein“ nur in script.txt:11 und caption.txt:12 (CTA); Caption-Anleitung neutral („So geht das für die eigene Firma“, „das letzte Ergebnis“, Infinitive). Keine Emojis (Skript, Caption, Guide geprüft). Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags. 135 Wörter; Silbenheuristik 245 gegen Folge 4 225 = 40,5 s Sprechzeit → ≈ 44 s + Warum-Pausen ≈ 45–46 s (40–48). |
| 4 | Zahlen 1:1 mit Lauf/Bericht | 8 | 294 Quellen (LAUF.md:12), A61 „mit Vorbehalt bis zum Händlerangebot“ (bericht.md Entscheidung), 60 °C + ab 1 Stück (Gründe 1/2), 151,40 € = 5 × 28,90 + 6,90 (bericht.md Beispielrechnungen), „ca. 110 € brutto“ (bericht.md:49) = „rund hundertzehn“; Caption 29,90 €, 151,40 €, 5 Min 56 s, sieben Partner, Printful-Zweitwahl ohne neue Einrichtung (LAUF.md:20) alle korrekt. Kleiner Rest: gesprochen „hunderteinundfünfzig Euro“ ohne „rund“ für 151,40 € (abgerundet, Richtung konservativ, kein Ticket, siehe H2). |
| 5 | Übergabefrage Folge 5 ehrlich beantwortet | 8 | Folge 5 (script.txt:10): „Welcher Partner stickt Sechzig-Grad-Shirts einzeln, ohne Neueinrichtung?“ Folge 6: A61 hat 60 °C belegt (script.txt:6), einzeln ab einem Stück (:7), Einrichtungskosten nicht gefunden (:9), deshalb „unter Vorbehalt“ (:5). Zwei von drei Bedingungen belegt, die dritte ehrlich offen; nichts geglättet. Abzug: die gesprochene Frage (script.txt:4 „Wer stickt einzeln und verschickt direkt?“) nennt 60 Grad nicht, obwohl der Lauf-Prompt es verlangt (LAUF.md:9) und die Entscheidung daran hängt; dass Printful die Einrichtungs-Bedingung erfüllt, steht nur in der Caption. Vertretbar im Wortbudget (siehe H3). |
| 6 | Übergabe Folge 7 (Preis rechnen) | 9 | script.txt:10 „Als Nächstes rechnet sie: Bleibt pro Shirt überhaupt etwas übrig?“ = firma-tag7/briefing.md Leitidee („ob pro Shirt überhaupt etwas übrig bleibt“) und Tagesbriefing-Kette Folge 7. Folge-7-Briefing übernimmt die Grenzen aus Folge 6 bereits (A61-Ladenpreis als Obergrenze, Händlerpreise fehlen, Wechselkurs nur mit Quelle, Rückblick „unter Vorbehalt“). Der Befund „Einrichtungskosten nicht gefunden“ ist konsistent mit dem Posten „Stickeinrichtung“ im Folge-7-Briefing, der dort als offen geführt werden muss. |

## K.-o.-Check
| K.-o. | Status |
|---|---|
| Eröffnung wörtlich, kein Tag, kein „gestern“, Satz 1 „bestickt“ | ok |
| Rückblick ≤ 6 s | ok rechnerisch ≈ 5,8 s (Regie misst) |
| Warum mit 2–3 belegten Gründen | ok (2) |
| Zuschauer nur im CTA angesprochen (Skript + Caption-Anleitung) | ok |
| Keine Emojis | ok |
| Caption-Ende Fiktiv-Hinweis + nur Hashtags | ok |
| 110–135 Wörter / 40–48 s | ok (135 / ≈ 45–46 s) |
| Unbelegte Behauptung / angekündigter Menschen-Schritt | ok (behoben) |
| Schritt-Kette ab Ergebnis Folge 5 | ok |

## Tickets
Keine.

## Hinweise (kein Ticket, an Chef/Regie)
- **H1 Wortgrenze:** 135 = Obergrenze. Regie darf kein Wort ergänzen. Wenn die gemessene Länge > 48 s oder der Rückblick > 6,0 s ist: zuerst „rund“ in script.txt:8 streichen (thema.md sagt dasselbe), dann zurück an Autor.
- **H2 151 €:** gesprochen „hunderteinundfünfzig Euro“, Lauf 151,40 €. Abgerundet, im Bild „5 Shirts: 151 €“ ok; in Caption und Guide steht 151,40 €. Falls Regie Zeit hat, kein Handlungsbedarf.
- **H3 60 Grad in der Frage:** Regie sollte im Prompt-Screenshot (01b) die Stelle „60 Grad Wäsche“ kurz hervorheben, damit Neue verstehen, warum Grund 1 zählt (zugleich R1-Hinweis H4).
- **H4 Guide-Ansprache:** prompt-fuer-kommentare.md „Weg: … dein letztes Ergebnis anhängen (z. B. deine Konkurrenzpreise)“ duzt. Der Guide geht per DM an Kommentierende (nach dem CTA), Chef-Entscheid betrifft nur die Caption-Anleitung; für Einheitlichkeit optional neutral fassen.
- **H5 Chef-Datei:** firma-tag6/briefing.md „Echter Lauf“ nennt das Abschicken der Anfrage noch als Menschenschritt; inhaltlich korrekt als Notiz, darf aber nicht als Regie-Vorgabe gelesen werden (Chef-Entscheid am Ende des Tagesbriefings gilt).
