GESAMTNOTE: 7/10

# Finale Prüfung R1: Folge „Ärger“ (firma-tag3), tag3-aerger-v1.mp4

Geprüft am 2026-10-28. Datei: 45,5 s, 1080x1920, 30 fps. Die Belege liegen in diesem Ordner:
- `hook.png` (0–6 s, 4 fps), `sheet1.png` (0–24 s, 2 fps), `sheet2.png` (24–45,5 s, 2 fps)
- `z1.png` (3,5 / 4,0 / 10,5 / 12,0 s), `z2.png` (13,6 / 24,5 / 25,3 / 26,4 s), `z3.png` (31,5 / 35,5 / 37,6 / 38,6 s), `z4.png` (40,3 / 41,4 / 43,5 / 45,4 s), `z5.png` (31,8–34,2 s und 25,9 / 26,5 s)
- `vs.png` (oben Tag 1 v7 bei 0,5 / 3 / 14 / 30 s, unten diese Folge bei 0,5 / 3 / 13 / 29 s), `cover-small.png`
- `stt-final.json` (scribe_v1 auf den fertigen Mix), `stt-music.json` (scribe_v1 auf das Musikbett, so wie es gemischt ist), `music-stem.wav` und `voice-stem.wav` (nachgebaut aus `render/mix-filter.txt`), `gemini.txt`

**Ergebnis: nicht bestanden, aber knapp.** Fast alle Fehlerarten aus Tag 2 sind behoben: Board nicht mehr angeschnitten, kein Lesetext, Warum-Beat sauber, Sticker frei, Hook-Text in Frame 0 vollständig. Zwei Punkte halten die Folge unter 8:
1. **Musikpegel:** In den ersten 20 s liegt das Bett nur 13,9 dB unter der Stimme, gefordert sind mindestens 15 dB. Dieser Punkt der Pius-Checkliste ist K.-o.
2. **Rückfall aus Tag 2:** Unter der Fragekarte sind wieder angeschnittene Kartenreste zu sehen. Dazu kommen ein leerer Platzhalter-Kasten und ein schwer lesbares Banner „WASCHFEST“.

Alles davon ist mit wenig Aufwand zu beheben, ohne neues Voice-Over.

## Messwerte
- **Lautheit:** −14,0 LUFS integriert, LRA 2,1. Bestanden.
- **STT gegen script.txt:** 117 Wörter, 0,08–44,28 s, inhaltlich wortgleich.
  - Die STT hört „probiere“ statt „probier“, das ist unkritisch.
  - Beim vollen Mix hört die STT bei 28,28 s „und elf“ statt „rund elf“. Ein zweiter STT-Lauf auf 25–45,5 s hört „Rund elf“, und die Untertitel zeigen „rund 11“. Kein Fehler.
  - Wortzahl 117, Länge 45,5 s, beides im Soll von 100–120 Wörtern und 40–48 s.
- **Untertitel-Sync:** Die Wort-Pills erscheinen auf das gesprochene Wort. Stichproben aus den Kontaktbögen:
  - „Warum“: Stimme bei 26,00 s, Pill im 26,0-s-Frame.
  - „Kommentiere“: Stimme bei 39,20 s, Pill ab 39,0–39,5 s.
  - „rund 11“: Stimme bei 28,3–28,6 s, Pills bei 28,0/28,5 s.
  - Bei 2 fps lässt sich keine Abweichung über 0,1 s erkennen. Ein Frame-genauer Sync-Test ist nicht gelaufen, deshalb ist die Note 9.
- **Musik:** gone-original ab 312,0 s, ein Stück, kein Loop, kein Sprung. Die Gain-Kurve hat nur weiche Rampen. Gemessen an Stems, die genau nach `mix-filter.txt` nachgebaut sind (K-gewichtet, ebur128):

  | Abschnitt | Stimme | Musik | Abstand |
  |---|---|---|---|
  | 0–19,8 s | −18,2 LUFS | −32,1 LUFS | **13,9 dB** |
  | 19,8–25,9 s | −18,1 LUFS | −32,6 LUFS | **14,5 dB** |
  | 25,9–45,5 s | −18,4 LUFS | −33,6 LUFS | 15,2 dB |
  | gesamt | −18,3 LUFS | −32,8 LUFS | 14,5 dB |

  - **Gesang:** Laut STT auf das Bett gibt es „go“ bei ≈ 20,6 s. Ab 25,9 s wird durchgehend gesungen („Thank you for the love … You light the way along the path of love again … Thank you for your life“). Das liegt dort 15,2 dB unter der Stimme, die Regel ist also erfüllt.
  - Die STT auf den **fertigen Mix** ab 25 s erkennt keine einzige gesungene Silbe, sondern nur „[Hintergrundmusik]“. Der Gesang ist also nicht verständlich.
  - Am deutlichsten hörbar ist er in den Sprechpausen 35,45–36,75 s („love again“, Bett ≈ −31,8 dBFS RMS) und 37,95–39,15 s. Dort laufen aber SFX darüber (Mix −16,5 dBFS).
  - Fazit Gesang: Er stört nicht mehr wie bei Tag 2. Durchgefallen ist der Pegel davor, in den gesangsfreien ersten 20 s (13,9 dB). Dazu kommt der Musik-Swell nach „waschfesten“ (Gain 0,26 bei ≈ 24,6 s).
- **Gemini-Review (review-video.mjs):** nicht gelaufen. OpenRouter meldet wieder 402, für Video ist mindestens 1 $ Guthaben nötig (`gemini.txt`). Der Punkt bleibt offen.

## Sonderregeln des Koordinators
| Regel | Befund | OK |
|---|---|---|
| 1 Eröffnung wörtlich, kein „Tag N.“ | STT 0,08–5,04 s wortgleich. Danach direkt „Ihr Kunde steht“ (5,86 s) | ja |
| 2 kein Tag 2/3 | Badge „TAG 1“ ab ≈ 5,25 s. Kachel „2 KUNDE“ zeigt den Gründungsschritt. Cover, Caption, script, replies und guidebook.json ohne „Tag N“ (grep) | ja |
| 3 Zähler aus, Hook-Text, Stempel | Kein Umsatz-Zähler. Frame 0 zeigt den vollständigen Satz „Wie viel Umsatz macht eine KI in 100 Tagen?“ (`hook.png` Frame 1). Stempel „GANZ ALLEINE.“ ab 3,25 s | ja |
| 4 „als Nächstes“ | Bild: Pill „ALS NÄCHSTES“ ab ≈ 38,0 s. Caption: „Das prüft die KI als Nächstes.“ Kein „morgen“ | ja |
| 5 Warum-Beat | „Warum?“ bei 26,0 s. Die Karte „DRUCK BLÄTTERT“ bleibt stehen, das Banner „WARUM WASCHFEST?“ erscheint. Die Grund-Karten kommen nacheinander: 1 „Platz 1 · häufigstes Ärgernis“ (≈ 27,1 s), 2 „~11 Fundstellen · bei 6 Anbietern“ (≈ 28,3 s), 3 „Ab 1 Stück · drucken heute viele“ (≈ 31,0 s). Alle bleiben bis ≈ 34,4 s stehen, Karte 3 also ≈ 3,4 s. Die Zahlen sind belegt (LAUF.md: ~11 Fundstellen, 6 Anbieter, „ab 1 Stück“ kein USP). Karte 1 und 2 sind inhaltlich derselbe Grund (Häufigkeit), es bleiben also 2 echte Gründe. Das liegt im Soll von 2–3 | ja (Mängel siehe Ticket 2) |
| 6 Emojis / Zahlen / Sidebar / Caption / replies | Keine Emojis (Regex auf caption, replies, guidebook). Alle Zahlen kommen aus LAUF.md (279 Quellen, 5m 22s, ~11/6). Das Claude-Fenster zeigt nie eine Sidebar. Die Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags. replies.json hat 1 + 5 = 6 Antworten, jede endet mit einer Frage, keine Emojis | ja |
| 7 Zitat und Prompt | Prompt-Fenster 11–15,4 s: Es wird wörtlich der Prompt aus LAUF.md getippt (`z1.png` 12,0 s, `z2.png` 13,6 s, `sheet1` 15,0 s mit „… Erfinde nichts.“). Zitat 34,5–36,7 s: Kopf „Firmenshirts mit Logo: Die fünf größten Ärgernisse kleiner Betriebe · Research complete · 279 sources · 5m 22s“ plus „„… beruht auf einer groben Zählung …, nicht auf einer Statistik.““, wörtlich gekürzt aus LAUF.md (`z3.png` 35,5 s) | ja |

## Pius-Checkliste (final, jeder Punkt K.-o.)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch (0–6 s, 4 fps) | 8 | `hook.png`: In fast jedem 0,25-s-Frame passiert etwas Neues: Bot fällt, Wort-Pills, Board-Zoom, Kacheln füllen sich, Stempel bei 3,25 s, TAG-1-Badge, Kiste. Der Frame-Diff 3,5→3,75→4,0→4,25→4,5 s liegt bei 7 / 17 / 4 / 8 (Stempel wackelt, „führt“ kommt). Am schwächsten ist 4,0–4,5 s. Gleichwertig mit Tag 2 |
| Kamera ruhig, Board/Claude-Fenster ganz im Bild | 9 | Board 1,5–2,75 s mit Rand zu beiden Seiten (`hook.png` Reihe 2). Damit ist Ticket Tag 2 R1-2 behoben. Claude-Fenster 9,5–15,4 s und 34,5–36,7 s ganz im Bild, mit ≥ 30 px Rand (`z1.png`, `z2.png`, `z3.png`) |
| Kein Lesetext, höchstens ein neues Label | 9 | Die Claude-Antwort steht nur als 2-Zeilen-Zitat im Bild (`z3.png` 35,5 s). Damit ist Ticket Tag 2 R1-3 behoben. Das Prompt-Tippen ist nach Sonderregel 7 erlaubt |
| Zweite Hälfte ohne Ton verständlich | 9 | Ablauf: Quellen-Wand „279 QUELLEN“ mit 4 Ärger-Karten → Gewinner „DRUCK BLÄTTERT“ + „→ WASCHFEST“ → „WARUM WASCHFEST?“ mit 3 Karten → Claude-Zitat „grobe Zählung“ → „NOCH OFFEN: Was verlangt die Konkurrenz?“ + „ALS NÄCHSTES“ → Kommentar-Karte mit 3 Schritten. Jeder Akt ist klar |
| Musik am Stück, ≥ 15 dB unter Stimme | **7 (K.-o.)** | Am Stück: ja. Gesang ist im Mix nicht verständlich (STT). Abstand in 0–19,8 s aber nur 13,9 dB und in 19,8–25,9 s nur 14,5 dB, gefordert sind ≥ 15 dB (Ticket 1) |
| CTA mit konkretem Wert, kein Direkt-Ansprechen | 9 | 39,2–45,5 s: „ÄRGER · gesendet“, dann 3 Schritt-Karten und „→ was deine Kunden nervt · mit Quelle · in 10 Min“. „in 10 Min“ ist gedeckt (echter Lauf 5m 22s). Das CTA-„du“ ist die Serienformel |
| Vergleich Tag 1 v7 (Hook, Klarheit, Look) | 8 | `vs.png`: gleicher Look, gleiche Licht- und Kartenqualität. Der Hook ist dichter als v7 (Frage in Frame 0). Die Klarheit ist durch den Warum-Beat besser. Schwächer als v7 nur in den Details aus Ticket 2 |
| Regie + Design im Video bestätigt | 7 | Siehe Ticket 2: leerer Kasten, Banner kaum lesbar, angeschnittene Karten unter der Fragekarte (Rückfall Tag 2 R1-5b), ≈ 2,6 s Standbild im Warum-Beat |
| Gemini-Review ohne fix_first | offen | 402 OpenRouter, nicht gelaufen (`gemini.txt`) |
| −14 LUFS ±0,5; Sync ≤ 0,1 s | 9 | −14,0 LUFS; Sync in den Stichproben unauffällig, aber nicht Frame-genau gemessen |
| Scroller-Test 1 s / 3 s / 10 s | 8 | **1 s:** Ja. Die Umsatz-Frage steht schon in Frame 0, dazu fällt der Bot. **3 s:** Ja. Das Board füllt sich, „GANZ ALLEINE.“ setzt die Wette. **10 s:** Ja. „Was nervt die beim Bestellen?“ und das echte Claude-Fenster mit dem Plus-Menü (10,5 s) versprechen eine nachbaubare Antwort. Schwäche: 6–9,5 s Kiste und Kundenkarte stehen fast still, nur die Würfel fliegen |
| Caption mit Menüpfad, Fiktiv-Hinweis, ohne Emojis | 9 | „+“ → „Research“ samt Planhinweis, Quellen eingrenzen, Frage wörtlich. Der Fiktiv-Hinweis steht am Ende vor den Hashtags |
| K.-o. Fakt falsch / Zahl gegen Bibel | 10 | 279 Quellen, 5m 22s, Reihenfolge Druck → Lieferung → Logo (→ Größe auf Karte 4), ~11 Fundstellen bei 6 Anbietern, „ab 1 Stück“ reicht nicht mehr, „grobe Zählung, keine Statistik“: alles aus LAUF.md. Kasse bleibt 0 €, kein Zähler |
| Cover | 7 | Die Frage ist voll lesbar, Ticket Tag 2 R1-7 ist behoben. **Aber:** cover.png ist byte-gleich mit runs/firma-tag2/cover.png (`cmp`). Im Profil-Raster stehen dann zwei identische Kacheln hintereinander (Ticket 3). Der Stempel überdeckt außerdem den Board-Titel „GRÜNDUNGSPLAN“, das ist unkritisch |
| Guide | 9 | aerger-guide.pdf hat 4 Seiten. guidebook.json ohne Tageszahl und ohne Emojis |

## Abgleich mit den Fehlerarten aus Tag 2 (final-r1.md)
| Tag-2-Ticket | Hier |
|---|---|
| R1-1 Hook-Text in Frame 0 unvollständig | behoben |
| R1-2 Board angeschnitten | behoben |
| R1-3 Lesetext Claude-Antwort | behoben |
| R1-4 Reste unter Warum-Karten | behoben (31,5 s sauber), aber neuer leerer Kasten 26,0–27,0 s |
| R1-5a Sticker unter Untertitel | behoben (13,6 s, der Sticker sitzt unter den Pills) |
| R1-5b angeschnittene Karten unter Fragekarte / Standbild | **wieder da**: 37,0–38,3 s „LOGO FALSCH“ / „GRÖSSE FALSCH“ und ein Rest „…H“ rechts neben „ALS NÄCHSTES“ (`z3.png` 37,6 / 38,6 s) |
| R1-6 Gesang im Bett | Gesang ab 25,9 s, im Mix aber nicht verständlich. Neues Problem: Pegel ≤ 15 dB in 0–25,9 s |
| R1-7 Cover-Stempel | behoben, aber das Cover ist identisch mit Tag 2 |
| Gemini 402 | wieder offen |

## Korrektur-Tickets

```
TICKET final-R1-1 → firma-regie
Kriterium: Musik ≥ 15 dB unter Stimme · Note: 7/10 (K.-o.)
Beleg: Stems nach render/mix-filter.txt: 0–19,8 s Stimme −18,2 / Musik −32,1 LUFS (13,9 dB); 19,8–25,9 s −18,1 / −32,6 LUFS (14,5 dB); Swell auf Gain 0,26 bei ≈ 24,6 s (mix.mjs, K-Kurve)
Problem: Im gesangsfreien Anfang und um den Gewinner-Moment liegt das Bett weniger als 15 dB unter der Stimme.
Soll: Gleicher Ausschnitt (gone-original ab 312,0 s, am Stück, kein Loop). Die Kurve in mix.mjs wird für 0–25,9 s um ≥ 1,5 dB gesenkt (z. B. 0,16→0,135, 0,2→0,165, 0,26→0,21), der Rest bleibt. Messung wie in diesem Bericht (ebur128 auf die Stems): Abstand Stimme–Musik ≥ 15,0 dB in 0–19,8 s, in 19,8–25,9 s und in 25,9–45,5 s. Der fertige Mix liegt bei −14 LUFS ±0,5, und eine STT auf den Mix erkennt keine gesungenen Wörter.
```

```
TICKET final-R1-2 → firma-design
Kriterium: Regie + Design im Video bestätigt · Note: 7/10
Beleg: z2.png 24,5 / 25,3 / 26,4 s; z5.png 25,9 / 26,5 s; z3.png 37,6 / 38,6 s; z5.png 31,8–34,2 s
Problem: (a) Banner „→ WASCHFEST“ 24,4–25,9 s: weiße Schrift auf hellem, überstrahltem Orange, kaum lesbar. Bei 24,5 s überdeckt außerdem das fliegende Shirt die Karte „LOGO FALSCH“. (b) 26,0–27,0 s: Unter „WARUM WASCHFEST?“ steht ein leerer dunkler Kasten (Platzhalter für Karte 1). (c) 37,0–38,3 s: Unter der Fragekarte schauen „LOGO FALSCH“ / „GRÖSSE FALSCH“ hervor, bei 38,6 s ein Rest „…H“ rechts neben „ALS NÄCHSTES“. Das ist der Rückfall aus Tag 2 R1-5b. (d) 31,8–34,4 s: ≈ 2,6 s ändert sich außer den Untertiteln nichts.
Soll: (a) „WASCHFEST“ hat in jedem Frame 24,4–25,9 s einen Kontrast ≥ 4,5:1 zum Banner-Hintergrund (dunkle Schrift auf Orange oder weiße Schrift auf sattem Orange ohne Bloom), und das Shirt überdeckt keine Kartenbeschriftung. (b) Zwischen 26,0 und 27,1 s ist kein leerer Kasten zu sehen. Karte 1 erscheint aus dem Nichts, oder der Slot ist unsichtbar. (c) Zwischen 36,8 und 39,2 s sind außer Fragekarte, Pill „ALS NÄCHSTES“, HUD und Untertiteln keine Karten oder Kartenreste sichtbar. (d) Bei „reicht nicht mehr“ (≈ 33,0 s) gibt es eine sichtbare Änderung, z. B. Karte 3 pulst oder bekommt einen Haken-Stempel. So bleibt kein Abschnitt > 1,5 s ohne Bildänderung, und der Beat bleibt trotzdem ruhig.
```

```
TICKET final-R1-3 → firma-design
Kriterium: Cover · Note: 7/10
Beleg: cmp runs/firma-tag3/cover.png runs/firma-tag2/cover.png → identisch; cover-small.png
Problem: Das Cover ist byte-gleich mit dem Cover der Folge davor. Im Profil-Raster sind die Folgen nicht zu unterscheiden.
Soll: Das Cover behält Hook-Frage und Stempel (Serienlook), zeigt aber ein folgeneigenes Element im 4:5-Ausschnitt, z. B. die Karte „DRUCK BLÄTTERT“ oder die Ärger-Wand mit „279 QUELLEN“ statt des generischen Boards. cmp gegen das Tag-2-Cover meldet einen Unterschied, und die Hook-Frage bleibt ohne Überdeckung lesbar.
```

Offen außerhalb der Tickets: Den Gemini-Review (review-video.mjs) nachholen, sobald OpenRouter mindestens 1 $ Guthaben hat (Checklistenpunkt, 402).

## Was schon stark ist
Die Fakten sind lückenlos aus dem echten Lauf. Prompt und Zitat sind wörtlich. Der Warum-Beat nennt belegte Zahlen. Sechs der sieben Tag-2-Fehlerarten sind sauber behoben. Lautheit, Länge, Wortzahl, Caption, replies und Guide passen. Nach Ticket 1 (Mix-Kurve, kein neues Render der Grafik nötig) und Ticket 2 ist ≥ 8 realistisch. Ticket 3 ist nur ein neues Standbild.
