GESAMTNOTE: 6/10

# Finale Prüfung R1: Folge „Kunde“ (firma-tag2), tag2-kunde-v1.mp4

Geprüft am 2026-10-28. Datei: 44,0 s, 1080x1920, 30 fps. Belege liegen in diesem Ordner: `hook.png` (0–6 s, 4 fps), `sheet1.png` (0–24 s, 2 fps), `sheet2.png` (24–44 s, 2 fps), `keyA.png` / `keyB.png` (Schlüsselframes 0 / 2 / 12,5 / 27,5 / 32,5 / 36,5 / 43,5 s + Cover), `z.png` (2,25 / 24,6 / 29,5 / 34,9 s), `vs.png` (Tag 1 v7 oben gegen Tag 2 unten bei 0 / 3 / 13 / 30 s), `sync.png` (Untertitel bei 30 fps), `stt.json` (ElevenLabs scribe_v1).

**Ergebnis: nicht bestanden.** Drei Punkte der Pius-Checkliste sind verletzt, und jeder davon ist K.-o.: Board angeschnitten, Lesetext, Gesang unter der Stimme. Inhalt, Fakten, Ton-Pegel, Sync und Texte sind gut. Die Fehler sitzen im Bild und in der Musikwahl, alle sind mit wenig Aufwand zu beheben.

## Messwerte
- **Lautheit:** −14,0 LUFS integriert, True Peak −1,2 dBFS, LRA 2,1. Bestanden.
- **STT gegen script.txt:** wortgleich. Einzige Abweichung: STT hört „probiere“, im Skript steht „probier“. Das ist unkritisch. Länge 120 Wörter, 44 s. Bestanden.
- **Untertitel-Sync:** „Handwerk“ erscheint bei 18,13 s, die Stimme setzt bei 18,16 s ein. „Kommentiere“ erscheint bei 38,07 s, die Stimme bei 38,10 s. Abweichung ≤ 0,03 s. Bestanden.
- **Musik:** ein durchgehendes Stück, kein Loop (gone-original ab 150,5 s). Das Bett liegt etwa 15–18 dB unter der Stimme (Stimme RMS −18,5 dB, Bett ≈ −36 dB; ab 31 s ≈ −33,7 dB). **Aber:** Ab etwa 31,7 s im Clip singt eine englische Stimme „My love is gone, gone …“ (STT auf music.mp3 28–44 s). Das läuft unter dem Fakten-Satz, unter der offenen Frage und offen hörbar in der Sprechpause 36,6–38,1 s.
- **Gemini-Review (review-video.mjs):** nicht gelaufen. OpenRouter meldet 402, für Video ist mindestens 1 $ Guthaben nötig. Der Checklistenpunkt „Gemini ohne fix_first“ ist deshalb **offen**. Das ist kein Fehler der Ersteller, aber vor der Freigabe muss Guthaben aufgeladen und der Review nachgeholt werden.

## Sonderregeln des Koordinators
| Regel | Befund | OK |
|---|---|---|
| 1 Eröffnung wörtlich, kein „Tag N.“ | STT 0,08–4,74 s wortgleich, danach direkt „Sie hat ihr Produkt“ | ja |
| 2 kein Tag 2/3 | Badge „TAG 1“ ab 5,0 s, Kachel „2 KUNDE“ ist der Gründungsschritt. Cover und Caption ohne Tageszahl. guidebook.json ohne „Tag N“ | ja |
| 3 Zähler aus, Hook-Text, Stempel | Kein Umsatz-Zähler; HUD oben rechts zeigt nur das 3x3-Mini-Board. Hook-Text 0–1,5 s, Stempel „GANZ ALLEINE.“ 2,75–5,0 s. **Frame 0 zeigt aber „Wie viel ___ macht eine KI“, ohne „Umsatz“** (fliegt erst bei ~0,4 s ein) | teilweise |
| 4 „als Nächstes“ | Skript ohne „morgen“; Caption „Das prüft die KI als Nächstes.“ | ja |
| 5 Warum-Beat | „Warum?“ bei 22,22 s; Karten 1 (24,0 s „300.000+ kleine Baubetriebe“), 2 (26,5 s „Shirt = Werbung“) und 3 (29,0 s „1–2× pro Jahr“) erscheinen nacheinander. Die Handwerk-Karte bleibt stehen. Karte 3 ist ≈ 2,2 s sichtbar, mindestens 1,2 s gefordert. Die Zahlen sind im Lauf belegt (335.272 Destatis → „über 300.000“; ein- bis zweimal im Jahr = Schätzung, auch so gesagt) | ja (Layout siehe Ticket 4) |
| 6 Emojis / Zahlen / Sidebar / Caption / replies | Keine Emojis, keine erfundenen Zahlen, Claude-Fenster ohne Sidebar. Die Caption endet mit dem Fiktiv-Hinweis, danach nur Hashtags. replies.json: 6 Antworten, jede endet mit einer Frage | ja |

## Pius-Checkliste (final, jeder Punkt K.-o.)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch (0–6 s, 4 fps) | 8 | `hook.png`: neues Ereignis in jedem 0,25-s-Frame (Bot fällt, Wörter, Board-Zoom, Kacheln, Stempel, TAG-1-Badge, Kiste). Schwach nur 4,5–5,0 s („aus“ steht). Abzug für den unvollständigen Hook-Text in Frame 0 (Ticket 1) |
| Kamera ruhig, Board/Claude-Fenster ganz im Bild | **6 (K.-o.)** | `z.png` 2,25 s: Das Gründungsplan-Board ist links und rechts angeschnitten, „9 SCHRITTE“ stößt an den Bildrand. Das gilt für ≈ 1,6–2,7 s (`hook.png` Reihe 2). Claude-Fenster 9–15 s und 31–34 s sind ganz im Bild |
| Kein Lesetext, höchstens ein neues Label gleichzeitig | **6 (K.-o.)** | `keyB.png` 32,5 s: Die Claude-Antwort steht 31,3–34,2 s als 9-Zeilen-Absatz im Bild. Die Markierungen helfen, trotzdem ist das eine lange Claude-Antwort. Das Prompt-Tippen 11–15 s (7 Zeilen, wird live getippt) ist wie bei Tag 1 v7 und ok |
| Zweite Hälfte ohne Ton verständlich | 8 | Branchen-Wand → Handwerk-Stempel → „Warum Handwerk?“ mit 3 Karten → „Research complete · 264 sources“ → „Noch offen: Was nervt Betriebe beim Bestellen?“ → Kommentar-Karte mit 3 Schritten. Jeder Akt ist klar |
| Musik am Stück, leise (≥ 15 dB unter Stimme) | **6 (K.-o.)** | Ein Stück, kein Sprung, Pegel knapp ok. Gesang „My love is gone“ ab 31,7 s unter deutscher Stimme und in der Pause 36,6–38,1 s. Das konkurriert mit der Stimme, und die Textzeile wirkt ungewollt kommentierend |
| CTA mit konkretem Wert, kein Direkt-Ansprechen | 8 | 38,1–44 s: „→ deine beste Kundenbranche · mit Quelle · in 10 Min“ plus 3 Schritt-Karten. Das CTA-„dir/du“ ist dieselbe Formel wie in Tag 1, sonst wird niemand angesprochen |
| Vergleich Tag 1 v7 (Hook, Klarheit, Look) | 8 | `vs.png`: gleicher Look und gleiche Qualität. Die Klarheit ist durch den Warum-Beat besser. Der Hook ist gleichwertig. Schwächer als v7: Überlagerungen im Warum-Beat und am Fragen-Beat (Tickets 4, 5); v7 hat bei 30 s eine saubere Gewinnerkarte ohne durchscheinende Reste |
| Regie + Design im Video bestätigt | 6 | Siehe Tickets 3–5: Untertitel überdeckt Sticker; Reste von Karten, Shirt und Bot schauen unter den Warum-Karten hervor; der Bot ist am Rand angeschnitten. Bei 35,0–38,0 s ändert sich außer den Untertiteln ≈ 3 s lang nichts (Regel: kein Beat > 1,5 s ohne sichtbare Änderung) |
| Gemini-Review ohne fix_first | offen | 402 OpenRouter, nicht gelaufen |
| −14 LUFS ±0,5; Sync ≤ 0,1 s | 10 | −14,0 LUFS, TP −1,2; Sync ≤ 0,03 s |
| Scroller-Test 1 s / 3 s / 10 s | 8 | 1 s: Ja, die Frage „Wie viel Umsatz macht eine KI in 100 Tagen?“ plus der fallende Bot erzeugen eine offene Frage. 3 s: Ja, der Stempel „GANZ ALLEINE.“ und das Board mit 9 Schritten machen klar, dass es eine Serie ist. 10 s: Eher ja, die Kachel „2 KUNDE ?“ mit leerer Kiste ist klar. „ersten Bericht anhängen“ versteht ein neuer Zuschauer aber nicht, und das Claude-Fenster zeigt bis 10 s nur „How can I help you today?“ |
| Caption mit Menüpfad, Fiktiv-Hinweis, ohne Emojis | 9 | Pfad „+“ → „Research“, „+“ → „Upload or add files“, Planhinweis Pro/Max/Team/Enterprise; Ende korrekt |
| K.-o. Fakt falsch / Zahl gegen Bibel | 10 | 264 Quellen (UI) / „über zweihundertsechzig“ (Stimme), 300.000+ (335.272), 1–2× pro Jahr, Kfz als Platz 4: alles aus LAUF.md. Die Schätzung wird offen gesagt |
| Cover | 7 | `keyB.png` rechts: Der Stempel „GANZ ALLEINE.“ verdeckt die untere Hälfte von „Tagen?“ |

## Korrektur-Tickets

```
TICKET final-R1-1 → firma-design
Kriterium: Hook-Text Frame 1 · Note: 7/10
Beleg: 0:00,00, keyA.png Bild 1 / hook.png Frame 1
Problem: Frame 0 zeigt „Wie viel ___ macht eine KI in 100 Tagen?“ mit Lücke, weil „Umsatz“ erst bei ~0,4 s einfliegt.
Soll: Frame 0 (0,00 s) zeigt den vollständigen Satz „Wie viel Umsatz macht eine KI in 100 Tagen?“ mit „Umsatz“ in Orange. Die Einflug-Animation darf ab Frame 0 nur noch skalieren/pulsieren, nicht von leer starten.
```

```
TICKET final-R1-2 → firma-design
Kriterium: Board ganz im Bild · Note: 6/10 (K.-o.)
Beleg: 0:01,6–0:02,7, z.png Bild 1 (2,25 s), hook.png Reihe 2
Problem: Beim Zoom auf den Gründungsplan ist das Board links und rechts angeschnitten, „9 SCHRITTE“ stößt an den Rand.
Soll: Zwischen 1,5 und 2,8 s liegt der Board-Rahmen inklusive Glow und „9 SCHRITTE“ in jedem Frame mit ≥ 40 px Abstand zu beiden Bildrändern (1080 px Breite). Zoomziel höchstens so groß wie bei 2,75 s.
```

```
TICKET final-R1-3 → firma-design (Bild) + firma-regie (Beat)
Kriterium: Kein Lesetext · Note: 6/10 (K.-o.)
Beleg: 0:31,3–0:34,2, keyB.png Bild 1 (32,5 s)
Problem: Die Claude-Antwort steht als 9-Zeilen-Absatz im Bild, also Lesetext.
Soll: Zwischen 31,2 und 34,2 s zeigt das Claude-Fenster nur noch die Zeile „Research complete · 264 sources · 7m 0s“ und höchstens 2 Zeilen Antworttext. Inhalt: der Satz „Eine direkte Statistik dazu … gibt es für Deutschland nicht.“ (markiert) bei „Statistik“ und danach „begründete Schätzungen“ bei „geschätzt“. Alternativ ein Stempel „GESCHÄTZT“ auf der Handwerk-Karte. Der restliche Absatz ist nicht sichtbar, auch nicht ausgegraut.
```

```
TICKET final-R1-4 → firma-design
Kriterium: Sauberer Warum-Beat (Design/Lesbarkeit) · Note: 6/10
Beleg: 0:22,2–0:31,2, z.png Bild 2 (24,6 s) und 3 (29,5 s), keyA.png Bild 4 (27,5 s)
Problem: Unter dem Banner „WARUM HANDWERK?“ schaut die Gastronomie-Karte („…RONOMIE“) hervor. Unter Grund-Karte 1 sind Friseure- und Kfz-Karte, das Shirt und der Bot halb zu sehen, und die Untertitel liegen auf dem Bot-Kopf.
Soll: Von 22,2 s bis 31,2 s sind nur die Handwerk-Karte, das Banner „WARUM HANDWERK?“, die Grund-Karten 1–3, der Bot (ganz im Bild oder ganz weg) und die Untertitel sichtbar. Keine Kanten oder Schriftreste anderer Branchenkarten, kein halbes Shirt. Die Grund-Karten bleiben in Reihenfolge und Timing wie jetzt (24,0 / 26,5 / 29,0 s).
```

```
TICKET final-R1-5 → firma-design (Bild) + firma-regie (Beat)
Kriterium: Kein Beat > 1,5 s ohne Änderung / nichts angeschnitten · Note: 6/10
Beleg: 0:11,5–0:15,0, keyA.png Bild 3 (12,5 s); 0:34,3–0:38,0, keyB.png Bild 2 (36,5 s), z.png Bild 4 (34,9 s)
Problem: (a) Bei 12,5 s überdeckt der Untertitel „brauchen“ den Sticker „Alle 3 Schritte zum Kopieren → am Ende“. (b) Bei 34,3–38,0 s steht der Bot nur als Rest im Eck unten rechts, die Friseure- und Kfz-Karten sind unter der Fragekarte angeschnitten, und bis auf die Untertitel ändert sich ≈ 3 s lang nichts.
Soll: (a) Zwischen 11,2 und 15,0 s überlappen Sticker und Untertitel-Pills in keinem Frame (Sticker nach links oben über die Untertitel-Zone versetzt oder die Pills darüber). (b) Zwischen 34,3 und 38,0 s ist der Bot ganz im Bild oder ganz weg, es sind keine angeschnittenen Branchenkarten zu sehen, und spätestens bei 36,2 s („Bestellen?“) passiert eine sichtbare Änderung, etwa ein „?“-Puls oder ein Bot-Blick auf die Karte. Kein Abschnitt > 1,5 s ohne Bildänderung außer den Untertiteln.
```

```
TICKET final-R1-6 → firma-regie
Kriterium: Musik/Ton · Note: 6/10 (K.-o.)
Beleg: 0:31,7–0:44,0 (STT auf public/firma-tag2/music.mp3 ab 28 s: „My love is gone. My love is gone, gone.“), besonders hörbar in der Sprechpause 0:36,6–0:38,1
Problem: Der Gesang des Musikbetts läuft unter der deutschen Stimme und ist in der Pause offen hörbar.
Soll: Im fertigen Mix ist zwischen 0 und 44 s kein Gesang erkennbar. Prüfung: ElevenLabs-STT auf die Musikspur (Ausschnitt genau wie im Mix) liefert keine Wörter. Dafür ein durchgehender Ausschnitt desselben Stücks ohne Gesang (≥ 44 s am Stück, ohne Loop), Bett weiterhin ≥ 15 dB unter der Stimme, Ergebnis −14 LUFS ±0,5.
```

```
TICKET final-R1-7 → firma-design
Kriterium: Cover · Note: 7/10
Beleg: cover.png, keyB.png Bild 4
Problem: Der Stempel „GANZ ALLEINE.“ verdeckt die untere Hälfte von „Tagen?“.
Soll: Auf dem Cover ist „Wie viel Umsatz macht eine KI in 100 Tagen?“ vollständig lesbar, ohne Überdeckung. Der Stempel sitzt darunter mit ≥ 20 px Abstand und bleibt innerhalb der IG-Grid-Mitte (4:5-Ausschnitt).
```

Hinweis, kein Ticket: „ersten Bericht anhängen“ (9,98 s) ist für Neue unklar. Falls firma-autor ohnehin neu spricht, wäre „Recherche von gestern anhängen“ verständlicher. Nicht nötig zum Bestehen.

Offen außerhalb der Tickets: Gemini-Review nach dem Aufladen des OpenRouter-Guthabens nachholen (Checklistenpunkt).

## Was schon stark ist
Die Fakten sind sauber und ehrlich („geschätzt, keine Statistik“). Der Warum-Beat erfüllt Sonderregel 5 mit 3 belegten Gründen und sauberem Timing. Lautheit und Sync sind exakt. CTA, Caption, replies.json und Guide (5 S.) passen zusammen, und die Sonderregeln 1–4 und 6 sind erfüllt. Nach den Tickets 2, 3, 4 und 6 ist ≥ 8 realistisch.
