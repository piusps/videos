GESAMTNOTE: 8/10

# Finale Prüfung R2: Folge „Ärger“ (firma-tag3), tag3-aerger-v3.mp4

Geprüft am 2026-10-28 von einem frischen Prüfer. Datei: 45,5 s, 1080x1920, 30 fps. Belege in `pruefung/r2/`:
- `sheet-1s.png` (ganze Folge, alle 1 s)
- `z-24-27.png` (4 fps), `z-26-34.png` (4 fps), `z-36-39.png` (4 fps)
- `banner-25.0.png`, `tag-33.3.png`, `cta-40-41.png`, `cta-41.5.png`, `cover-vs-tag2.png`
- `stt-final.json` (scribe_v1 auf den fertigen Mix)
- `voice.wav` und `music.wav`: Stems, nachgebaut aus `render/mix-filter.txt` (Stand 15:17, Video-Render 15:25)

**Ergebnis: bestanden.** Alle drei Tickets aus R1 erfüllen ihr Soll. Kein K.-o.-Punkt ist verletzt. Offen bleibt nur der Gemini-Review (OpenRouter 402), laut Koordinator kein K.-o.

## Messwerte
- **Lautheit:** −14,1 LUFS integriert, LRA 2,2 LU, Peak −1,2 dBFS. Im Soll.
- **STT gegen script.txt:** 117 Wörter, 0,08–44,22 s, wortgleich mit dem Skript. „probiere“ statt „probier“ ist unkritisch, so war es auch in R1. „rund elf“ wird jetzt im vollen Mix richtig erkannt. Die einzige Audio-Markierung ist „[Outro-Musik]“ bei 44,28 s. **Im Mix wird keine gesungene Silbe erkannt.**
- **Musik:** gone-original ab 312 s, ein Stück, kein Loop, nur weiche Rampen. Gemessen mit ebur128 auf den Stems (die Loudnorm-Verstärkung ist linear und betrifft beide gleich, der Abstand bleibt also gleich):

  | Abschnitt | Stimme | Musik | Abstand | R1 |
  |---|---|---|---|---|
  | 0–19,8 s | −18,2 | −34,5 | **16,3 dB** | 13,9 |
  | 19,8–25,9 s | −18,1 | −35,0 | **16,9 dB** | 14,5 |
  | 24,2–25,9 s (Swell) | −19,0 | −34,1 | **15,1 dB** | – |
  | 25,9–34 s (Gesang) | −18,5 | −33,6 | **15,1 dB** | 15,2 |
  | 34–45,5 s | −18,3 | −33,9 | **15,6 dB** | – |
  | gesamt | −18,3 | −34,2 | 15,9 dB | 14,5 |

  Jeder Abschnitt liegt bei ≥ 15 dB. Der Abschnitt mit Gesang (25,9–34 s) liegt mit 15,1 dB nur knapp darüber.

## R1-Tickets
| Ticket | Soll | Befund | OK |
|---|---|---|---|
| R1-1 Musik | ≥ 15,0 dB in 0–19,8 / 19,8–25,9 / 25,9–45,5 s; −14 ±0,5; STT ohne Gesang | 16,3 / 16,9 / 15,1–15,6 dB; −14,1 LUFS; STT ohne Gesang (siehe oben) | ja |
| R1-2a Banner | WASCHFEST mit Kontrast ≥ 4,5:1, kein Shirt über Kartenbeschriftung | `banner-25.0.png`: cremefarbene/orange Schrift auf dunkelbraunem Grund, gut lesbar (geschätzt deutlich über 4,5:1). In `z-24-27.png` gibt es von 24,0 bis 27,25 s kein fliegendes Shirt mehr, bei 24,5 s nur Konfetti am Kartenrand | ja |
| R1-2b leerer Kasten | 26,0–27,1 s kein leerer Kasten | `z-26-34.png` Reihe 1: unter „WARUM WASCHFEST?“ ist es bis 27,0 s leer, dann erscheint Karte 1 | ja |
| R1-2c Kartenreste | 36,8–39,2 s nur Fragekarte, Pill, HUD, Untertitel | `z-36-39.png`: 36,75–39,0 s sauber. Der Übergang bei 36,5 s ist ein reiner Hintergrund-Frame | ja |
| R1-2d Standbild Warum-Beat | kein Abschnitt > 1,5 s ohne Bildänderung | Frame-Diff im Bild ohne Untertitel (y 0–1560, Schwelle 0,3 % Pixel > 12): längster Abschnitt ohne Änderung 31,43–32,73 s = **1,30 s**, danach 33,37–34,33 s = 0,97 s. Der rote Tag „reicht nicht mehr“ steht ab ≈ 33,0 s (`tag-33.3.png`) | ja |
| R1-3 Cover | anderes Cover als Tag 2, Hook ohne Überdeckung | `cmp` meldet einen Unterschied. `cover-vs-tag2.png`: Sticker „Was nervt die Kunden?“ statt „Wer kauft die Shirts?“, Hook-Frage frei, Stempel mit Abstand zum Board. Alles liegt im 4:5- und 3:4-Ausschnitt | ja (Hinweis unten) |

## Frage-Shot 36,6–39,2 s
- Die Fragekarte erscheint bei ≈ 36,75 s.
- Pill „ALS NÄCHSTES“ ab ≈ 37,5 s (nach „verlangt“).
- Puls bei „Konkurrenz“ ≈ 38,0 s.
- Roter Marker unter „Konkurrenz?“ bei 38,75 s.
- Schnitt auf „KOMMENTIERE“ bei 39,0 s.
- Längste Strecke ohne Änderung unter 0,8 s.

## Sonderregeln des Koordinators
| Regel | Befund | OK |
|---|---|---|
| Eröffnung wörtlich, ohne „Tag N“ | STT 0,08–5,0 s wortgleich, danach direkt „Ihr Kunde steht“ | ja |
| Badge TAG 1 | sichtbar im ganzen Video | ja |
| Kein Umsatz-Zähler | keiner im Kontaktbogen | ja |
| „als Nächstes“ statt „morgen“ | Pill „ALS NÄCHSTES“, kein „morgen“ in der STT | ja |
| Warum-Beat mit 2–3 Karten, jede ≥ 1,2 s | Karte 1 ab 27,0 s, Karte 2 ab 28,25 s, Karte 3 ab 31,0 s, alle bis ≈ 34,0 s. Karte 3 steht ≈ 3,0 s | ja |
| Keine Emojis, keine erfundenen Zahlen, keine Sidebar | Zahlen 279 / 5m 22s / ~11 / 6 wie in R1 gegen LAUF.md geprüft und unverändert. Claude-Fenster ohne Sidebar | ja |
| Caption-Ende, gekürztes Zitat | unverändert gegenüber R1 (dort geprüft). Das Zitat „… beruht auf einer groben Zählung …, nicht auf einer Statistik.“ ist gewollt | ja |

## Pius-Checkliste (final)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch | 8 | `sheet-1s.png` 0–5 s ist gleich wie R1: Frage in Frame 0, Board füllt sich, Stempel. Der Teil war von den Änderungen nicht betroffen |
| Kamera ruhig, Board/Claude-Fenster ganz im Bild | 9 | Board 1–5 s und 40–45 s und Claude-Fenster 9–15 s und 34–36 s mit Rand. Das Antwortfenster bei 34–36 s ist jetzt kompakt, ohne leere Fläche |
| Kein Lesetext | 9 | Das Zitat hat 2–3 Zeilen |
| Zweite Hälfte ohne Ton verständlich | 9 | Ablauf: Wand 279 → DRUCK BLÄTTERT/→ WASCHFEST → WARUM + 3 Gründe + „reicht nicht mehr“ → Zitat → NOCH OFFEN/ALS NÄCHSTES → KOMMENTIERE ÄRGER |
| Musik am Stück, ≥ 15 dB | 8 | Alle Abschnitte ≥ 15,1 dB, Gesang im Mix unverständlich. Der Gesangsteil hat nur knapp Reserve |
| CTA mit Wert, kein Direkt-Ansprechen | 9 | „→ was deine Kunden nervt · mit Quelle · in 10 Min“ (`cta-41.5.png`) |
| Vergleich Tag 1 v7 | 8 | Gleicher Look. Die Klarheit ist durch den Warum-Beat und den Frage-Shot besser |
| Regie + Design bestätigt | 8 | Alle Punkte aus R1-2 sind behoben (siehe oben). Kein Platzhalter, keine Reste, nichts angeschnitten |
| Untertitel verdecken nichts | 9 | Die Pills liegen auf Brusthöhe des Bots. Kein Label, keine Karte und kein HUD darunter. Der Papierflieger bei 40,6–41,0 s läuft kurz über „gesendet“ (Animation, `cta-40-41.png`), das ist unkritisch |
| Gemini-Review | offen | OpenRouter 402, laut Koordinator kein K.-o. |
| LUFS / Sync | 9 | −14,1 LUFS. Die Pills sitzen in den 4-fps-Bögen auf dem Wort (z. B. „Warum“ 26,0 s, „Konkurrenz“ 38,0 s) |
| Scroller-Test 1 s / 3 s / 10 s | 8 | wie R1: Frage in Frame 0 / „GANZ ALLEINE.“ / echtes Claude-Plus-Menü bei 10 s |
| Caption | 9 | unverändert gegenüber R1 |
| K.-o. Fakt/Zahl | 10 | keine neue Zahl, alle aus LAUF.md |
| Cover | 8 | Eigener Sticker, Unterschied per cmp belegt. Aufbau und Board sind aber sonst gleich wie bei Tag 2. Im Profil-Raster ist der Unterschied nur am kleinen Sticker zu sehen |
| Guide | 9 | unverändert (4 Seiten) |

## Tickets
Keine, alle Kriterien liegen bei ≥ 8.

Hinweise ohne Ticket (für die Lehre im Chef):
1. Im Gesangsteil liegt die Musik nur 15,1 dB unter der Stimme. Bei künftigen Folgen den Gesangsteil auf ≥ 16 dB legen, damit Reserve bleibt.
2. Im Raster unterscheiden sich die Cover der Folgen nur durch den Sticker. Ab der nächsten Folge sollte ein folgeneigenes Hauptobjekt ins Cover (z. B. die Gewinner-Karte statt des immer gleichen Boards).
3. Den Gemini-Review nachholen, sobald OpenRouter mindestens 1 $ Guthaben hat.
