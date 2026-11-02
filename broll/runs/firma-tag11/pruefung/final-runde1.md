# Prüfung final · Runde 1 · Folge 11 „Gewerbe“ (firma-tag11)
Prüfer: frischer Agent, 2026-10-30 ~15:20. Gemini-Review entfällt (Ausfall) → manuelle Prüfung Frame für Frame.
Prüfling: `runs/firma-ep/tag11/render/tag3-folge11.mp4` (+ `-handy.mp4`). Nichts an den Prüflingen geändert.
Belege (eigene Frames, alle in `pruefung/final-r1/`): `hook-4fps.jpg` (0–6 s @ 4 fps), `c2fps-1.jpg` / `c2fps-2.jpg` (Kontaktbogen 2 fps, 0–24,5 s / 25–45 s), `z1.png` (8,0 · 12,2 · 16,6 · 20,0 s), `z2.png` (31,6 · 34,0 · 38,5 · 44,5 s), `z3.png` (16,9 · 18,0 · 32,4 · 32,8 s), `dm.png` (38,5–39,4 s @ 8 fps, Endkarte), `ws.png` (Websuche 17,3–18,7 s @ 10 fps), `stamp.png` („9 VON 13“ 31,0–32,6 s), `ref.png` (Folge 8 Ende · Folge 9 Ende · Folge 9 20 s · Folge 11 20 s), `guide-sheet.jpg` (alle 10 Guide-Seiten), `stt.json` (ElevenLabs Scribe der finalen Tonspur).

## Messwerte
| Messung | Wert | Soll | ok |
|---|---|---|---|
| Länge | 45,50 s (Handy 45,50 s), 1080×1920, 30 fps | 40–48 s | ja |
| Wörter / Tempo | 100 Wörter (script.txt = words.json = STT); 131,9 wpm über 45,5 s (134,9 über Sprechspanne 0–44,48 s) | 85–100 / 120–135 | ja (100 = Grenze) |
| Rückblick „Die“ → Ende „offline.“ | 6,52–12,58 s = 6,06 s (render.log warnt „recap act 6,69 s“ = Akt inkl. Ränder, nicht Sprechzeit) | ≤ 6,5 s | ja |
| „Heute“-Start | 13,23 s | ≤ 14,5 s | ja |
| „Tag drei“ gesprochen | nein (STT) ; nur HUD-Badge „TAG 3“ | nicht gesprochen | ja |
| Lautheit final | −14,0 LUFS, TP −1,1 dBFS, LRA 2,1 (Handy −14,1) | −14 ±0,5 | ja |
| Stimme/Musik | Abstand je Akt 23,0–27,2 dB (mix-info.json), Musik 153,15–198,94 s am Stück, kein Loop; Explizit-Check 0 Wörter (musik.txt) | ≥ 15 dB, keine expliziten Wörter | ja |
| Untertitel-Sync | STT-Wortstarts vs. words.json: Median +0,02 s, max 0,10 s („Die“ 6,52) | ≤ 0,1 s | ja |
| STT vs. Skript | wortgleich (nur STT-Normalisierung „probiere“/„schicke“, „Web-Suche“) | = script.txt | ja |
| Caption | 2080 Zeichen, endet „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags, keine Emojis, Menüpfad „+“ → Anhang | < 2100 | ja (knapp) |
| Replies | 1 + 5 = 6, alle enden mit Frage, keine Emojis, Florent-Ton | 6, Frage | ja |
| Ortsname | `grep -ic "hamburg\|hmb\|bezirksamt\|handelskammer"`: caption 0, replies 0, Guide-PDF-Text 0, episode.json 0; Guide-Bilder (nicht-pruefen.png, Stempel-Seite, Chat-Screenshot) und alle Video-Shots visuell ohne Ort | 0 | ja |
| Guide | 10 Seiten; Gebühr weggelassen (S. 4/7 Redaktionsnote „Zuständigkeit und Gebühr … für eine einzelne Stadt … lassen sie weg“); „nicht vollständig“, „keine Rechts- oder Steuerberatung“, „Nichts davon wurde angemeldet“; „Folg @pickthecompany“ 1× | Briefing | ja |
| Cover | `runs/firma-tag11/cover.jpg` vorhanden (15:06): „Was muss die KI anmelden?“ + echte Checkliste mit MENSCH-Stempel, HUD 5 grau/6 gold | – | ja |
| SFX | 145 Effekte (Folgen 8/9/10: 97/80/113); nur Pegel gemessen, nicht abgehört | – | Hinweis |

## K.-o.-Check
| Regel | Befund | Beleg |
|---|---|---|
| Frame 0 = ganze Frage + Ergebnis-Objekt | ok: „Wie viel Umsatz macht eine KI in 100 Tagen?“ + echte Checkliste mit MENSCH-Stempel | hook-4fps 0,000 |
| 0–6 s jedes 0,5-s-Fenster ein Ereignis | ok: Lupen „Mensch“/„1. Gewerbe anmelden (zuerst)“ 0,5–2,0, Kästchen-Puls 2,25–3,25, „GANZ ALLEINE.“ 3,5, Checkliste fliegt weg 4,25, Board-Einflug 4,75–5,5, Wort-Pills durchgehend | hook-4fps |
| Hook-Objekt überlappt nie den Gründungsplan | ok: Checkliste weg bei 4,5 s, Board ab 4,75 s | hook-4fps Z. 4 |
| Board: WEBSITE nie grün, GEWERBE current, kein Umsatz-Zähler | ok: Kachel 5 orange „IN ARBEIT / ENTWURF · WEBSITE“, Kachel 6 gold „?“ GEWERBE, Endkarte gleich; HUD 5 grau, 6 gold; kein Zähler | z1 (8,0/12,2), z2 (38,5) |
| Board ganz im Bild | ok: 6,5–12,5 s vollständig mit Rand, kein Überlappen mit HUD | z1 |
| **≤ 1 neuer Textblock gleichzeitig** | **VERLETZT (formal, wie Folge 10 R1-03)**: Endkarte DM 1 „Die Frage / „… Mach daraus eine Checkliste als Word-Datei.““ erscheint ~38,75 s, DM 2 „Echte Checkliste / 13 Punkte · Mensch oder Claude“ ~0,25–0,4 s später (~39,0–39,1 s) → zwei neue Blöcke mit zusammen ~17 Wörtern in einem 0,5-s-Fenster. Folge 10 hatte das in R2 durch eine einzige DM-Karte gelöst; Folge 11 hat wieder zwei `items` auf `itemsAt: "Frage"` (episode.json, act `end`). | dm.png Bild 3–6; c2fps-2 Z. 4 Sp. 8–9 |
| Karten ≤ 4 Wörter | ok: HEUTE: ANMELDEN · 13 PUNKTE · WARUM? · PFLICHT AB BEGINN · ZUERST GEWERBE · 9 VON 13 · ALS NÄCHSTES WEN? | c2fps |
| Text ≥ 1,2 s | ok für alle Karten/Stempel („9 VON 13“ groß 31,5–32,45 s, danach klein am Maskottchen bis ~33 s; „PFLICHT AB BEGINN“ 26,0–27,4 s). Grenzfall: Websuche-Screenshot (Kopfzeile 7 Wörter + „§ 14 GewO“) nur 17,5–18,5 s ≈ 1,0 s; wie in Folge 10 R2 als Teil des Klickpfads gewertet, gesprochen „Websuche“ | ws.png |
| Kein Frame > ~12 neue lesbare Wörter (außer Untertitel) | ok außer Endkarte (siehe oben); Checklisten-Fließtext überall unscharf, nur Titel Punkt 1 + „Mensch“/„Claude“ scharf | z1 20,0 · z2 31,6 · check-hook.png |
| Kein Ortsname / keine Sidebar / Namen / Mails | ok: Titel „1. Gewerbe anmelden (zuerst)“ ohne Ort (sauber retuschiert, kein Balken), Bubble „Als Erstes kommt die Gewerbeanmeldung“ ohne Ort; keine Sidebar; Claudes Bitte um Name/Anschrift nicht gezeigt | z1, c2fps 21,5 |
| Nichts als erledigt erzählt | ok: „Das kann nur ein Mensch.“, kein „angemeldet“; Guide „Nichts davon wurde angemeldet.“ | STT, guide S. 10 |
| Fakten 1:1 aus dem Lauf | ok: 13 Punkte, 9 × Mensch / 4 × Claude, Als Erstes Gewerbe, Grund 1 § 14 GewO, Grund 2 Kette Finanzamt → Steuernummer → Verpackung (LAUF.md:21), knapp 5 min / 18 Websuchen / 17 Links (LAUF.md:17, Guide 4 min 52 s), Dateiname „Kolonnenshirt checkliste erster verkauf · DOCX“ | LAUF.md, z1 20,0, z3 |
| Übergabe Folge 10 → 11 | ok: Folge 10 „Als Nächstes: Was muss sie anmelden?“ → Folge 11 „Heute: Was muss sie anmelden?“; Rückblick-Satz 2 „Website-Entwurf, offline.“ | script.txt, firma-tag10/script.txt |
| Übergabe 11 → 12 | Briefing: Folge 12 erwartet als Rückblick „Gewerbe macht nur ein Mensch.“ – Folge 11 trägt „Als Erstes: das Gewerbe … Das kann nur ein Mensch.“ ✓; Frage „Wen spricht sie zuerst an?“ passt zu Betriebe | script.txt |
| Musik ohne explizite Wörter, Stimme verständlich | ok (s. Messwerte) | musik.txt, mix-info.json, STT fehlerfrei |
| Caption / Guide / Replies | ok (s. Messwerte) | – |

## Design-Tickets aus `design-runde1.md` im Video
| Ticket | Status | Beleg |
|---|---|---|
| R1-01 Hook-Lupen ohne Lesesätze | gelöst: Lupen zeigen nur „Mensch“ und „1. Gewerbe anmelden (zuerst)“, Rest unscharf; jedes Fenster ein Ereignis | hook-4fps |
| R1-02 Checkliste nicht in Lesegröße | gelöst: Fließtext unscharf, nur Titel 1 + Wer-Wörter scharf | z1 20,0, z2 31,6 |
| R1-03 kein Schwärzungsbalken | gelöst: Titel liest „1. Gewerbe anmelden (zuerst)“ | check-hook.png, cover.jpg |
| R1-04 Board ganz im Bild | gelöst (keine Zoomfahrt mehr, Schnitt zum Claude-Fenster bei 13,0 s) | z1 |
| R1-05 Shots füllen Fenster, Datei-Karte ganz | gelöst: Datei-Karte mit vollem Namen + DOCX; Websuche zeigt Band + markierte Quelle | z1 20,0, z3 18,0 |
| R1-06 Maskottchen ganz / nur ein MENSCH-Stempel | gelöst: nie zwei Stempel gleichzeitig; Maskottchen höchstens unten leicht angeschnitten (Endkarte, < 1/3) | hook-4fps, z2 |
| R1-07 Haken: alle 9 Mensch-Zellen sichtbar | gelöst: 9 orange Rahmen + „9 VON 13“, keine abgeschnittene Überschrift | z2 31,6 |
| R1-08 offline-Symbol / Übergabe-Board / Kettenkacheln | teilweise: Kettenkacheln ohne Ziffern ✓, WEBSITE groß + ENTWURF-Etikett ✓, Übergabe als Kette WEBSITE–GEWERBE–BETRIEBE „?“ ✓ (statt Mini-Board, gleichwertig); **Offline-Symbol am WEBSITE-Feld fehlt** (12,0–12,6 s nur Pfeil-Gesicht am Maskottchen) – kein K.-o. | z1 12,2 |
| Backlog D-23 (Endkarte, „ERSTER“ halb verdeckt) | weiter sichtbar, kosmetisch | z2 44,5 |

## Bewertung (Stufe final)
| Kriterium | Note | Beleg |
|---|---|---|
| Hook nicht statisch, Frame 0 | 9 | Frage + echtes Ergebnis mit MENSCH-Stempel in Frame 0, dichte Ereignisse (hook-4fps) |
| Kamera ruhig, Board/Fenster ganz im Bild | 9 | Board 6,5–12,5 s ganz; Claude-Fenster immer ganz (z1, z3) |
| Kein Lesetext / ein Label gleichzeitig | 6 | sonst sauber; Endkarte 2 DM-Blöcke in ~0,3 s (dm.png) = Regression ggü. Folge 10 R2 |
| Zweite Hälfte ohne Ton verständlich | 9 | WARUM? → PFLICHT AB BEGINN → ZUERST GEWERBE + Kette → 9 VON 13 / MENSCH → ALS NÄCHSTES WEN? → Kommentar-Karte |
| Musik/Ton | 9 | −14,0 LUFS, ≥ 23 dB Abstand, ein Stück; SFX-Dichte hoch (145) – nicht abgehört |
| CTA konkreter Wert, Guide hält Versprechen | 9 | DM Frage + echte Checkliste 13 Punkte Mensch/Claude + „in 10 Minuten deine Startliste“; Guide S. 2–5 liefern genau das |
| Untertitel | 9 | STT = Skript, Sync ≤ 0,10 s |
| Fakten / Bibel / Lauf | 9 | alles aus LAUF.md; Ort sauber entfernt; Board-Logik nach Briefing (Hinweis unten) |
| Look vs. Folge 8/9 | 8 | gleiche Raum-/Board-/HUD-Sprache, echte Claude-Shots; weniger 3D-Objekt im Mittelteil als Folge 9 (ref.png), Offline-Symbol fehlt |
| Caption / Replies / Cover | 9 | alle Formalia erfüllt; Caption 2080 Zeichen (knapp) |
| Scroller-Test | 8 | 1 s: Frage + echte Checkliste mit Stempel → bleiben. 3 s: „GANZ ALLEINE.“-Stempel + Pills → bleiben. 10 s: Board mit gelbem „?“ GEWERBE + Rückblick kurz → bleiben; Risiko 16,5–18,5 s zwei dunkle Screenshots nacheinander (je ~1 s) |

**Gesamtnote: 8/10 · NICHT bestanden** (1 formaler K.-o.: ≤ 1 neuer Textblock gleichzeitig an der Endkarte; alle anderen K.-o.-Punkte erfüllt). Fix ist klein (~5 min + Re-Render ~2 min, render.log total 103 s); Ton, Caption, Replies, Guide, Cover brauchen keine Neuprüfung.

## Tickets
```
TICKET final-R1-01 → firma-design
Kriterium: ≤ 1 neuer Textblock gleichzeitig · Note: 6/10
Beleg: 38,75–39,1 s, pruefung/final-r1/dm.png Bild 3–6; public/firma-ep/tag11/episode.json act "end": itemsAt "Frage", zwei items
Problem: DM 1 („Die Frage“ + Zitat) und DM 2 („Echte Checkliste“ + „13 Punkte · Mensch oder Claude“) erscheinen ~0,3 s nacheinander, ~17 neue Wörter in einem 0,5-s-Fenster – derselbe Fehler, der in Folge 10 R1-03 schon gelöst war.
Soll: Wie Folge 10 R2 genau eine DM-Karte (z. B. „Frage + echte Checkliste“ / „13 Punkte · Mensch oder Claude“, ≤ 10 Wörter) auf „Frage“ (38,74 s); ODER DM 2 erst auf „Checkliste.“ (39,87 s), also ≥ 1,1 s nach DM 1. Beleg: Kontaktbogen 38–41 s @ 8 fps zeigt in jedem 0,5-s-Fenster höchstens einen neuen Block. Rest des Videos unverändert (gleicher Ton-Mix).
```
Optional (kein K.-o., nur falls ohnehin neu gerendert wird), alle → firma-design:
- Offline-Symbol (ohne Text) am WEBSITE-Feld auf „offline.“ 12,10–12,58 s (Rest aus design-R1-08).
- Endkarte D-23: Board-Reihe „7 8 9 ERSTER“ nicht halb zwischen Karten/Band durchschauen lassen.
- Websuche-Screenshot 17,5–18,5 s auf ≥ 1,2 s strecken oder Kopfzeile unscharf, damit kein Text < 1,2 s stehen bleibt.

Hinweise (kein Ticket):
- Board-Nummerierung neu ggü. Folge 10 (dort LOGO = 7, WEBSITE = 8, „9 SCHRITTE“; jetzt LOGO = 4, WEBSITE = 5, „12 SCHRITTE“ mit zusammengelegten Kacheln). Vom Tagesbriefing gedeckt („Design entscheidet“), aber Folgen 12/13 müssen dieselbe Nummerierung halten (firma-chef).
- Die Checkliste im Video zeigt „1. Gewerbe anmelden (zuerst)“, im Original steht der Ort im Titel. Pflicht laut Briefing; der Guide legt die Retusche offen, das Video nicht. Vertretbar.
- `prompt-fuer-kommentare.md` (intern, nicht veröffentlicht) nennt noch „Bezirksamt“/„Handelskammer“ als Abdeck-Anweisung; kein Ortsname. Nicht veröffentlichen.
- Guide nutzt „⚡ Quick Win“ wie Folge 10 (Template-Icon), Caption/Replies emojifrei.

Nach Fix: Runde 2 mit frischem Agent, Fokus 36–45 s (Endkarte) + Stichprobe Hook-Frame 0 und LUFS.
