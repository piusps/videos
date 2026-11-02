GESAMTNOTE: 7/10

# Finale Prüfung R2: Folge „Kunde“ (firma-tag2), tag2-kunde-v2.mp4

Geprüft am 2026-10-28 von einem frischen Prüfer. Datei: 44,0 s, 1080x1920, 30 fps. Alle Belege liegen in `pruefung/r2/`:
- `hook.png`: 0–6 s mit 4 fps
- `sheet1.png`: 0–21,5 s mit 2 fps
- `sheet2.png`: 22–44 s mit 2 fps. **Die Zeitstempel im Bild beginnen bei 0, also jeweils +22 s rechnen.**
- `keyA.png`: 1,75 / 2,25 / 12,5 / 24,6 / 27,5 s
- `keyB.png`: 29,5 / 32,5 / 34,9 / 36,5 / 43,5 s
- `q.png`: 35,6–36,7 s mit 10 fps
- `sync.png`: 37,9–38,3 s mit 30 fps
- `sticker.png`: 11,2–15 s, unterer Bildteil
- `vs.png`: Tag 1 v7 oben, Tag 2 unten, bei 0 / 3 / 13 / 30 s
- `stt-final.json`, `stt-music.json`, `music-stem.wav`, `voice-stem.wav` (nachgebaut aus `render/mix-filter.txt`), `gemini.txt`

**Ergebnis: knapp nicht bestanden.** Alle drei K.-o.-Punkte aus R1 sind behoben: Board, Lesetext und Musik. Der Warum-Beat ist jetzt sauber. Zwei Punkte liegen noch bei 7: Unter der Fragekarte sind weiterhin Reste von Branchenkarten zu sehen, und der Cover-Titel passt nicht ins Profil-Raster. Beides ist Kleinarbeit im Design, Skript und Ton bleiben unverändert. Der Gemini-Review ist weiter offen (OpenRouter 402).

## Messwerte
- **Lautheit:** −14,0 LUFS integriert, True Peak −1,2 dBFS, LRA 2,0 LU. Bestanden.
- **STT (scribe_v1) gegen script.txt:** wortgleich. Die STT hört nur „probiere“ statt „probier“ und „schicke“ statt „schick“, beides unkritisch. 120 Wörter, 44 s. Bestanden.
- **Untertitel-Sync:** „Kommentiere“ startet laut words.json bei 38,069 s, die Pill erscheint bei 38,067 s (`sync.png`). „ALS NÄCHSTES“ kommt bei 36,3 s, „Bestellen?“ startet bei 36,234 s. Abweichung ≤ 0,07 s. Bestanden.
- **Musik:** ein durchgehender Ausschnitt aus gone-original ab 150,5 s, kein Loop, kein Sprung. Den Abstand habe ich nur über die Sprechstellen gemessen (Fenster von 0,1 s, Stimme > −35 dB), in 2-s-Blöcken:
  - 0–12 s: 18–22 dB
  - 12–18 s: 16,0–16,6 dB (das ist die Bett-Spitze)
  - 18–42 s: 16,2–23,9 dB, ab 31 s 16,2–18,7 dB
  - 42–44 s: 14,2 dB. Das ist nur das Outro mit dem letzten Wort „findest“ und der Ausblende, deshalb hier nicht gewertet.
- **Gesang:** Die isolierte, um 20 dB angehobene Musikspur enthält „My love is gone“ ab 31,4 s. Das Wort „My love“ fällt bei 37,74–37,80 s in die Sprechpause 36,76–38,07 s. Das Bett liegt dort bei −32 bis −45 dB, also etwa 12–16 dB unter dem Sprechpegel von −20 dB. Die **STT auf dem fertigen Mix erkennt keinen englischen Wortlaut**, nur „[Outro-Musik]“ bei 42,78 s. Der Gesang ist also nur noch als Klangfarbe zu hören und konkurriert nicht mit der Stimme. Gewertet als bestanden, mit Hinweis.
- **Gemini-Review:** wieder nicht gelaufen. OpenRouter meldet 402, für Video ist mindestens 1 $ Guthaben nötig (`gemini.txt`). Der Checklistenpunkt bleibt **offen** und ist kein Fehler der Ersteller.

## Tickets aus R1: Status
| Ticket | Soll | Befund R2 | Status |
|---|---|---|---|
| R1-1 Frame 0 vollständig | voller Hook-Satz bei 0,00 s | `hook.png` 0,00 s: „Wie viel Umsatz macht eine KI in 100 Tagen?“ vollständig, „Umsatz“ in Orange | erledigt |
| R1-2 Board im Bild | Rand ≥ 40 px, 1,5–2,8 s | `keyA` Bild 1–2: Der Rahmen liegt bei ≈ 90 px zum Bildrand. Kleiner Schönheitsfehler, kein Ticket: Bei ≈ 2,0–2,5 s stößt das Label „9 SCHRITTE“ ohne Abstand an „GRÜNDUNGSPLAN“ und an den rechten Board-Rahmen | erledigt |
| R1-3 kein Lesetext | Status-Zeile + ≤ 2 Zeilen | `keyB` Bild 2 (32,5 s): Kopfzeile „Research complete · 264 sources · 7m 0s“ plus das gekürzte Zitat „Eine direkte Statistik dazu … gibt es für Deutschland nicht.“ (3 kurze Zeilen, Wortlaut aus LAUF.md, Sonderregel 7). „Statistik dazu“ wird markiert | erledigt |
| R1-4 sauberer Warum-Beat | nur Handwerk-Karte, Banner, Karten, Untertitel | `sheet2` 22,5–30,5 s: keine Reste anderer Branchenkarten, kein halbes Shirt, Bot ausgeblendet | erledigt |
| R1-5a Sticker/Untertitel | keine Überlappung 11,2–15 s | `sticker.png`: Nur bei 12,2–12,4 s berührt die Pill „brauchen“ die obere rechte Ecke des Stickers um wenige Pixel. Sonst ist der Abstand frei | praktisch erledigt |
| R1-5b Fragekarte 34,3–38 s | keine angeschnittenen Branchenkarten, Änderung bis 36,2 s | `keyB` Bild 3–4, `q.png`: Unter der Fragekarte sind **weiterhin** „FRISEURE“ und die durchgestrichene Kfz-Karte („K…WERKST…T“) angeschnitten zu sehen. Die Änderung „ALS NÄCHSTES“ kommt bei 36,3 s und ist damit ok. Davor stehen 34,4–36,3 s ≈ 1,9 s ohne Bildänderung außer den Untertiteln | **offen** → Ticket R2-1 |
| R1-6 Musik | siehe Messwerte | Pegel ≥ 16 dB unter der Sprache, Gesang im Mix per STT nicht erkennbar, am Stück | erledigt (nach Vorgabe des Koordinators bewertet) |
| R1-7 Cover | Titel frei, Stempel ≥ 20 px darunter, in der 4:5-Mitte | Der Titel ist frei lesbar, der Stempel hat ≈ 75 px Abstand. **Neu:** Der Stempel verdeckt jetzt den Board-Titel, nur „…LAN · 9 SCHRITTE“ ist zu sehen. Zeile 1 des Titels (y ≈ 228–310) liegt außerhalb des 4:5-Rasters (y 285–1635) und knapp außerhalb des 3:4-Rasters (y 240–1680) | **teilweise** → Ticket R2-2 |

## Sonderregeln des Koordinators
| Regel | Befund | OK |
|---|---|---|
| 1 Eröffnung wörtlich, kein „Tag N.“ | STT 0–4,7 s wortgleich, direkt danach „Sie hat ihr Produkt“ | ja |
| 2 kein Tag 2/3 | Badge „TAG 1“ ab 5,0 s, Kachel „2 KUNDE“. In Cover, Caption, guidebook.json und replies kein „Tag N“ (grep) | ja |
| 3 Zähler aus, Hook-Text, Stempel | kein Umsatz-Zähler. Hook-Text 0–1,4 s, Stempel „GANZ ALLEINE.“ 3,25–5,25 s | ja |
| 4 „als Nächstes“ | Pill „ALS NÄCHSTES“ bei 36,3 s, Caption „Das prüft die KI als Nächstes.“, kein „morgen“ (grep) | ja |
| 5 Warum-Beat | „Warum?“ bei 22,16 s. Die Handwerk-Karte bleibt stehen, 3 Grund-Karten kommen nacheinander: 300.000+ (≈ 23,0 s), Shirt = Werbung (≈ 26,0 s), 1–2× pro Jahr (≈ 28,5 s). Jede ist ≥ 2,5 s sichtbar. Die Zahlen sind belegt (335.272 Destatis → „über 300.000“, 1–2× als Schätzung). 120 Wörter, 44 s | ja |
| 6 Emojis/Zahlen/Sidebar/Caption/replies | keine Emojis (Scan), keine unbelegte Zahl, keine Sidebar. Die Caption endet mit dem Fiktiv-Hinweis, danach nur Hashtags. replies.json: 6 Antworten, alle enden mit „?“ | ja |
| 7 gekürztes Zitat | Das Zitat mit „…“ ist wörtlich aus LAUF.md | ja |

## Pius-Checkliste (final, jeder Punkt K.-o.)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch (0–6 s, 4 fps) | 8 | `hook.png`: Fast jedes 0,25-s-Frame bringt ein neues Ereignis (Bot fällt, Wort-Pills, Board-Zoom, Kacheln füllen sich, Stempel, TAG-1-Badge, Kiste, Kachel „2 KUNDE“). Schwächste Stelle: 3,5–4,75 s steht das Board, nur Pills wechseln, bei 4,25 s kommt das Ein-Wort-Pill „Ich probier“. Gleichwertig zu Tag 1 v7 |
| Kamera ruhig, Board/Claude-Fenster ganz im Bild | 8 | `keyA` 1,75 / 2,25 s: Board mit ≈ 90 px Rand. Claude-Fenster 7,5–15 s und 31–34 s ganz im Bild. Abzug für „9 SCHRITTE“ am Rahmen (Hinweis) |
| Kein Lesetext, ≤ 1 neues Label gleichzeitig | 8 | 31–34 s: Zitat statt Absatz. Das Prompt-Tippen 11–15 s ist wie bei Tag 1 v7. Hinweis: Das Claude-Fenster bei 31–34 s ist zu ≈ 60 % leer und weiß (`keyB` Bild 2). Ein kürzeres Fenster sähe hochwertiger aus, nötig ist das nicht |
| Zweite Hälfte ohne Ton verständlich | 8 | Branchenwand mit 264 Quellen → Kfz durchgestrichen → Handwerk-Stempel → „Warum Handwerk?“ mit 3 Karten → Research-Zitat „keine Statistik“ → „Noch offen“ + „Als Nächstes“ → Kommentar-Karte mit 3 Schritten und Ergebnis-Zeile |
| Musik am Stück, ≥ 15 dB unter der Stimme | 8 | siehe Messwerte: ≥ 16,0 dB in allen Sprechblöcken bis 42 s, kein Loop. Die Gesangsfarbe bei 37,7 s (Pause) ist nur leise hörbar und für die STT nicht als Wort erkennbar |
| CTA mit konkretem Wert, kein Direkt-Ansprechen | 8 | 38,1–44 s: „deine beste Kundenbranche · mit Quelle · in 10 Min“ plus 3 Schritt-Karten. Das „du“ steht nur im CTA, wie bei Tag 1 v7. Die Story spricht den Zuschauer nie als Gründer an |
| Vergleich mit Tag 1 v7 | 8 | `vs.png`: gleiche Welt, gleiches Licht, gleiche UI-Qualität. Der Hook-Text in Frame 0 ist stärker als „KI gründet“. Der Warum-Beat bei 30 s ist klarer als die Kreuz-Wand in v7 |
| regie + design bestätigt | 7 | Alle Kriterien halten bis auf R1-5b (`keyB` Bild 3–4: angeschnittene FRISEURE- und Kfz-Karte; 1,9 s ohne Bildänderung). Ende 42–44 s: Untertitel liegen auf dem halb sichtbaren Bot-Kopf (`keyB` Bild 5). Für ein End-Bild ok |
| Gemini ohne fix_first | offen | 402, kein Guthaben (`gemini.txt`) |
| −14 LUFS ±0,5; Sync ≤ 0,1 s | 9 | −14,0 LUFS / TP −1,2. Sync ≤ 0,07 s |
| Scroller-Test | 8 | **1 s:** Die konkrete Frage „Wie viel Umsatz macht eine KI in 100 Tagen?“ mit gelber Zahl und fallendem Bot stoppt den Daumen. **3 s:** „GANZ ALLEINE.“ und der Plan mit 9 Schritten zeigen, dass es eine Serie mit Ziel ist, also bleiben. **10 s:** echtes Claude mit Research-Menü und angehängtem Bericht. Wer nicht gründet, hat hier den schwächsten Moment, aber der Sticker „Alle 3 Schritte → am Ende“ hält ihn |
| Caption mit Menüpfad, Fiktiv-Hinweis, ohne Emojis | 9 | „+“ → „Research“, „+“ → „Upload or add files“, mit Plan-Hinweis. Fiktiv-Hinweis vor den Hashtags, keine Emojis |
| K.-o. Fakt falsch / Zahl widerspricht der Bibel | ok | 264 Quellen, 335.272 → „über 300.000“, 1–2× pro Jahr (Schätzung), Reihenfolge Handwerk/Gastro/Friseure: alles aus LAUF.md |
| Cover | 7 | siehe R1-7 → Ticket R2-2 |
| Begleitdateien | 9 | Guide 5 Seiten, prompt-fuer-kommentare.md fertig mit Beispielen, replies.json passend |

## Korrektur-Tickets

```
TICKET final-R2-1 → firma-design
Kriterium: nichts angeschnitten / kein Beat > 1,5 s ohne Änderung · Note: 7/10
Beleg: 0:34,4–0:38,0, keyB.png Bild 3 (34,9 s) und 4 (36,5 s), q.png
Problem: Unter der Fragekarte „Was nervt Betriebe beim Bestellen?“ sind weiterhin die angeschnittenen Karten „FRISEURE“ und die durchgestrichene Kfz-Karte zu sehen. 34,4–36,3 s ändert sich nur der Untertitel.
Soll: Zwischen 34,3 und 38,0 s ist im Bild keine Kante und kein Schriftrest einer Branchenkarte zu sehen (Karten ausgeblendet oder ganz verdeckt). Mindestens eine sichtbare Änderung zwischen 34,9 und 35,8 s, z. B. ein Unterstreichen von „nervt“ bei 35,4 s (Wort „nervt“). „ALS NÄCHSTES“ bleibt bei 36,3 s. Ton, Untertitel und alle anderen Beats bleiben unverändert.
```

```
TICKET final-R2-2 → firma-design
Kriterium: Cover · Note: 7/10
Beleg: cover.png (Titelzeile 1 bei y ≈ 228–310; Stempel über dem Board-Titel, sichtbar nur „…LAN · 9 SCHRITTE“)
Problem: Die erste Titelzeile fällt im Profil-Raster (4:5 = y 285–1635) teilweise weg, und der Stempel schneidet den Board-Titel zu einem Rest „…LAN“ ab.
Soll: Titel „Wie viel Umsatz macht eine KI in 100 Tagen?“ und Stempel „GANZ ALLEINE.“ liegen vollständig zwischen y 300 und y 1620. Der Board-Titel „GRÜNDUNGSPLAN“ ist ganz zu sehen oder ganz verdeckt, kein Wortrest. Der Stempel hält ≥ 20 px Abstand zum Titel.
```

Offen außerhalb der Tickets: Gemini-Review (`node scripts/review-video.mjs --video runs/firma-tag2/tag2-kunde-v3.mp4`) nach dem Aufladen von OpenRouter nachholen.

Hinweise, keine Tickets:
- „9 SCHRITTE“ klebt bei 2,0–2,5 s am Rahmen.
- Bei 12,2–12,4 s berührt die Pill „brauchen“ den Sticker um wenige Pixel.
- Das Claude-Fenster bei 31–34 s ist zu ≈ 60 % leer und könnte auf Inhaltshöhe schrumpfen.

## Was stark ist
Alle K.-o.-Punkte aus R1 sind sauber gelöst, ohne an Skript oder Ton etwas zu verschlechtern. Der Warum-Beat ist jetzt der beste Moment der Folge: ruhig, belegt, 3 Karten mit Zahl. Lautheit und Sync sind exakt. Die Fakten stimmen bis zur Quelle. Nach R2-1 und R2-2 (reine Bildkorrekturen, kein neuer Ton) ist ≥ 8 in allen Kriterien erreicht, dann fehlt nur noch der Gemini-Review.
