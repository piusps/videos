GESAMTNOTE: 8/10, BESTANDEN (kein K.-o. verletzt, explizites Wort entfernt und nachgeprüft; 4 Wunsch-Tickets, kein Render allein dafür nötig)

# Finale Prüfung Runde 1 · Folge 5 „Konkurrenzpreise“ · Slot 2026-10-29 12:00 (nicht erste Folge des Tages)
Prüfer: firma-pruefer, 2026-10-28/29.
Geprüft: runs/firma-tag5/firma-tag5-final.mp4, Stand **28.10. 21:35:30, 79 875 603 Byte** (44,80 s, 1080×1920, 30 fps, AAC 48 kHz). Die Bildanalyse lief auf der Fassung von 21:30 (jetzt firma-tag5-final-r1.mp4). Die Videospur beider Dateien ist bitgleich (MD5 der Videospur 9644a327…), deshalb gelten alle Bildbefunde auch für die aktuelle Datei. Ton, LUFS und STT wurden auf der aktuellen Datei gemessen.
Außerdem geprüft: cover.jpg, kontaktbogen-2fps.jpg, pruefung/hookcheck/kontakt-0-6s-4fps.jpg, mix-info.json (21:35), caption.txt, konkurrenz-guide.pdf, replies.json, format.json, prompt-fuer-kommentare.md, public/firma-ep/tag5/episode.json.
Maßstab: script.txt, words.json, regieplan.md, beats.json, autor-runde3.md, design/lauf/LAUF.md + bericht.md, tagesbriefing-2026-10-29.md, Folge 4 final-runde1/2.md (8/10).

## Belege (alle in pruefung/final-r1/)
- `frame0.png`; `h4/` + `hook4.jpg` (0–6 s, 4 fps); `f2/` 90 Frames bei 2 fps + `sheet1–3.jpg`
- `claude-shots.jpg` (12,5–19,0 s, 4 fps, obere 1100 px voll aufgelöst), `winner.jpg` (20,5–25,0 s, 4 fps), `why2.jpg` (29,5–31,5 s, 4 fps), `guide.jpg` (alle 10 Seiten)
- `motion-hook-10fps.txt`: mittlere Helligkeitsdifferenz bei 10 fps (270×480, Graustufen), 0–6 s
- `stt.json`: whisper medium auf der aktuellen Tonspur. Dazu `../audio/stt-mix-final.json` (scribe, aktuelle Spur)
- `diff16.wav`: Fassung 21:30 minus Fassung 21:35. `mm16.wav` ist der neue Musik-Stem (`../audio/music-muted.mp3`), `music16.wav` das Original (GONE ab 3,47 s)
- Gemini-Review (`gemini.txt`): nicht gelaufen („fetch failed“). Der Vorbehalt bleibt wie bei Folge 3/4

## Explizites Wort in der Musik (Chef-Hinweis) – erledigt, nachgeprüft
- Pegel des neuen Musik-Stems je 0,1 s gegen das Original: Von 16,55 bis 17,20 s ist der Stem komplett stumm (−270 dB), mit kurzen Rampen bei 16,5 s (−34,9 dB) und 17,2 s (−40,5 dB). Außerhalb dieses Fensters liegt er überall 0,2–0,3 dB unter dem Original, sonst unverändert. Die Differenz der beiden Fassungen hat ihre Energie fast nur bei 16,5–17,25 s (RMS bis 1254 gegen sonst ≈ 100–500 Codec-/Limiter-Rest).
- STT des neuen Musik-Stems über die ganze Länge (scribe, `../audio/stt-music-muted.json`): kein Schimpfwort. Gesucht wurde nach shit, fuck, bitch, damn, ass, dick u. a., Treffer: 0. Ein verstärkter Ausschnitt 14–19 s ergibt „My August. I don't remember“. Hinweis: Im Original steht laut STT an dieser Stelle „Was it my August? I don't remember“. Das „Shit“ war möglicherweise ein STT-Hörfehler. Die Stummschaltung schadet aber nicht und bleibt.
- Folge: Unter „Claude prüft“ fehlt die Musik 0,65 s. An der Stelle laufen Stimme und der Zähler-SFX weiter, die Lücke liegt 18 dB unter der Stimme und fällt beim Hören nicht als Sprung auf. Musik ist sonst am Stück, kein Loop. Kleiner Abzug bei Kriterium 9.

## K.-o.-Checks
| # | Check | Ergebnis | Note |
|---|---|---|---|
| 1 | Kein privater Name, kein Chat-Titel, keine Sidebar | ✓ Alle Claude-Frames 12,5–18,7 s (`claude-shots.jpg`): Papier-UI mit „+“-Menü (Upload or add files, Skills, Connectors, Design system, Add plugins, Devices, Research, Memory), dann der Prompt mit Tippen. Shot 01b ab ≈ 14,5 s beginnt beim Anhang-Chip „Shirt-Firma Ergebnis Druck.md · 34 lines“, die Begrüßung ist abgeschnitten. Shot 02 (16,8–18,7 s) zeigt nur „Ich starte jetzt die Recherche …“, „Preisvergleich bestickte Firmenshirts“, „Research complete · 295 sources · 7m 19s“ und „Given access to: Google Sheets“. **„Sechs Anbieter“ ist in keinem Frame zu sehen.** Keine Sidebar, kein Chat-Titel, kein Name | 10 |
| 2 | Kein Umsatz-Zähler | ✓ Im HUD steht nur das Mini-Board (✓ ✓ ✓ / 4). „Umsatz“ kommt nur im Hook-Titel vor, „9 ERSTER UMSATZ“ ist eine Plan-Kachel | 10 |
| 3 | Kein „Tag N“ | ✓ Gesprochen: keiner (STT). Die Caption sagt „Jetzt will sie wissen …“ und „In der letzten Folge“, ohne Tageszahl. Das Cover zeigt nur das kleine HUD-Badge „TAG 2“, der Titel lautet „Was verlangt die Konkurrenz? / KI RECHERCHIERT ALLEIN.“. Es gibt keinen Slam. Der Hook-Titel „… eine KI in 100 Tagen?“ ist der Serienrahmen | 10 |
| 4 | Eröffnung wörtlich, ohne „Tag zwei“ | ✓ STT (scribe): „Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probiere das aus.“ „probiere“ ist dieselbe STT-Normalisierung wie in Folge 2–4. Danach kommt direkt „Die Firma …“ | 10 |
| 5 | Rückblick ≤ 6 s, ein Neuer versteht bis 14 s | ✓ words.json: „Die“ 4,94 s bis „Grad.“ 10,84 s = 5,90 s. Satz 1 steht in der Fassung des Chef-Entscheids („bestickt erst auf Bestellung“). Board ab 4,9 s groß mit ✓ ✓ ✓, Shirt-Karte unter dem Board (5,9 s), Banner „erst auf Bestellung bestickt“ (≈ 7,5 s), DRUCK „STICK BIS 95 °C“ + Garnrolle „Garn 95 °C“ (≈ 9,9 s), Fahrt zu 4 PREIS + „HEUTE: KONKURRENZPREISE“ ab ≈ 11,5 s. Projekt und heutiger Schritt sind vor 12 s klar. **Abzug:** Das Maskottchen ist 4,9–5,8 s groß und unten etwa halb angeschnitten (h4/020–024), die Wort-Pills liegen darauf. Das ist derselbe Befund wie Ticket final-R2-2 aus Folge 4 und weiter offen | 8 |
| 6 | Warum-Karten je ≥ 1,2 s auf ihrem Wort | ✓ Karte 1 „5 Stück · Erstauftrag“ ab 25,4 s (Wort „Fünf“), Gegenwert „erst ab 10–30 · 5 Anbieter“ auf „nicht“ (≈ 26,7 s), steht 1,95 s solo. Karte 2 „1 Shirt · nachbestellen“ ab 27,4 s, solo 3,6 s, Pause dazwischen 0,30 s. **Abzug:** Der Gegenwert „erst ab 5“ von Karte 2 erscheint erst auf „erst“ (≈ 30,2 s) und ist nur ≈ 0,75 s zu sehen, bis 30,95 s der Haken kommt (`why2.jpg`). Die Karte selbst hält die Regel, die Kernzahl ist kurz | 8 |
| 7 | Zahlen/Labels 1:1 aus dem Lauf | ✓ Hook/Cover: „5 bestickte Shirts · ab rund 110 €“ ohne Obergrenze. Stempel ERST AB 10/10/15/20/30 ohne Namen (= stickbetrieb, CUVIO, Stoiber, Workline, Shirtlabor). Wand: 110 € workwear one (110,85), 126 € a61 (126,40), 151 € a61 · 60 °C (150,90), „150 € BIS ÜBER 200 € →“ offen, ERST AB 20 Workline, 15 Stoiber, 30 Shirtlabor, 10 stickbetrieb.de, 10 CUVIO. 295 Quellen, 7m 19s. **Spreadshirt/109,95 € erscheint nirgends im Video.** 95 °C (Garnrolle, Rückblick) und 60 °C (Pflegeetikett „Shirt-Stoff 60 °C“, Als Nächstes ≈ 34,6 s) sind getrennte Objekte in anderer Form und Farbe. Haken-Zitat „Es sind meist ‚ab'-Preise, also Untergrenzen.“ wörtlich aus der Chat-Antwort. „Fünf Anbieter“ statt Claudes „Sechs“ ist in autor-runde3 und thema.md begründet (5 in der Tabelle belegt). Stempel „EINZELN NACHBESTELLEN“ ist sinngemäß aus der Empfehlung, keine Zahl | 9 |
| 8 | Untertitel frei | ✓ Pills auf dem Wort, sie verdecken keine Karte, kein Etikett und keine Zahl. Kleinigkeiten wie in Folge 4: Bei 4,9–5,8 s liegen die Pills auf dem angeschnittenen Maskottchen, bei 41,5–44,8 s liegt „Konkurrenzpreise“ auf dessen Gesicht | 8 |
| 9 | Länge, LUFS, Musik | ✓ 44,80 s (40–48). ebur128 auf der aktuellen Datei: **−14,0 LUFS**, TP −1,2 dBFS, LRA 1,0. mix-info (21:35): Abstand je Akt 16,0–22,7 dB, Minimum 16,0 (Haken, CTA), alle ≥ 15. Musik ab 3,47 s am Stück, kein Loop, ruhige Pause unter „rund 110 Euro“, Ende ausgeblendet. Abzug: 0,65-s-Stummschaltung 16,55–17,20 s (siehe oben), und die Abstände stammen nur aus dem Engine-Mixer, ohne eigene Rückrechnung | 8 |
| 10 | Keine Emojis, Caption-Ende, Ansprache | ✓ Caption und Replies ohne Emoji. Die Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach eine Hashtag-Zeile. Anleitung neutral („So geht das für die eigene Firma mit Claude:“), Du-Form nur im CTA „Kommentiere …, dann schick ich dir …“. Menüpfad genau. Superkind kommt nicht vor, kein Preis. Spreadshirt wird nur als Logo-Grenze genannt, nicht als Preis | 9 |
| 11 | Guide hält das CTA-Versprechen | ✓ 10 Seiten: S. 2 „Die Frage zum Kopieren“ als Konsole mit [Klammern], Quick Win, Klickpfad. S. 4 Ergebnis + Haken. S. 5–8 Preistabelle aller 14 Anbieter 1:1 mit Legende „Berechnung“/„n. g.“. S. 9 alle 29 Quellen. S. 10 Vorlage + 4 Berufsbeispiele. Spreadshirt 109,95 € steht dort mit offengelegter Herkunft („aus unserer Vorrecherche übernommen, ob der Stick darin steckt, nicht gefunden“), das ist korrekt. Rest wie Folge 4: „⚡ Quick Win“-Template-Zeichen | 9 |
| 12 | replies.json | ✓ commentReply + 5 Varianten = 6 Antworten, keine Emojis, jede endet mit „?“. format.json = PTC | 10 |

STT gegen Skript: scribe (aktuelle Spur) ist wortgleich bis auf „probiere“ und „schicke“ (Normalisierung). Whisper hört zusätzlich „nahmen sie“ und „Einrichtungen“. Beide Wörter sind bei scribe korrekt. Das sind Whisper-Artefakte, kein Ticket.

## Pius-Checkliste
| Punkt | Ergebnis | Note |
|---|---|---|
| Hook nicht statisch (0–4,85 s) | ✓ Frame 0 zeigt die ganze Frage in zwei Zeilen, das Preisschild „ab rund 110 €“ und fünf „5 Stück?“-Schilder. Ereignisse: 0,25/0,5 Pills, 0,75 Maskottchen, 1,0 Titel raus, 1,25–2,75 fünf Stempel im 0,25–0,5-s-Takt, 2,9 „GANZ ALLEINE.“, 3,5 Board klein, 3,8 Board groß, 4,9 Board-Zoom. Messwerte 10 fps: Minimum 1,05 (3,7 s, ein Schritt vor dem Schnitt), sonst ≥ 1,98, Spitzen 18–57 an jedem Ereignis. Kein Stillstand > 0,5 s. Danach 5,2–5,8 s Werte 0,7–2,4 (Board steht, Maskottchen dreht sich). Das ist schon Rückblick und wie in Folge 4 R2 vertretbar | 9 |
| Board/Fenster ganz im Bild | ✓ Board und Claude-Fenster stehen ganz im Bild. Ausnahmen: Der „UNSER PAKET mit RUND 110 €“-Balken stößt bei 22,0 s links und rechts an den Rand. Auf der Endkarte (≈ 38,5–44,8 s) schauen die Board-Reihen PREIS/PARTNER/NAME und 7/8/9 unter den DM-Karten hervor, „ERSTER UMSATZ“ wird vom Balken „in 10 Minuten“ angeschnitten. Das ist ein Rückfall gegenüber Folge 4 R2 (dort dimBoard) | 8 |
| Kein Lesetext | Shot 01b ≈ 14,5–15,5 s zeigt den ganzen Prompt-Block ungezoomt (Schrift ≈ 1 % Bildhöhe), dann Zoom auf die Markierungen. Getragen von „Die Frage zum Kopieren → am Ende“. Wie in Folge 4 grenzwertig | 8 |
| Zweite Hälfte ohne Ton | ✓ Preiswand mit 110 hervorgehoben, oranges Schild „1 SHIRT · OHNE NEUE EINRICHTUNG“, „WARUM EINZELN?“ mit 2 Karten und rotem Gegenwert, Haken-Zitat + Stempel UNTERGRENZEN, „ALS NÄCHSTES“-Frage + 60-°C-Etikett, Endkarte | 9 |
| CTA nennt Wert, keine Ansprache außerhalb | ✓ „Die Frage“ + „Die Preistabelle · 14 Anbieter · Gesamtpreis 5 Stk. · Quelle“ + „in 10 Minuten deine Konkurrenzpreise“. Du nur im CTA | 9 |
| Vergleich Folge 4 final | Frame 0 gleichwertig (ganze Frage + starkes Ergebnisobjekt), Hook dichter als Folge 4 R1, Rückblick gleich gut, Warum-Akt gleich klar. Schwächer: Entscheidungs-Moment 21,8–24,5 s (Banner kurz, Stempel kontrastarm), Endkarte mit durchscheinendem Board | 8 |
| Scroller-Test | 1 s: Preisschild „ab rund 110 €“ + Frage nach Umsatz. Ich bleibe, weil ich wissen will, was 5 Shirts kosten. 3 s: fünf rote „ERST AB“-Stempel knallen, „GANZ ALLEINE.“. Kein Loch. 10 s: Shirt-Firma, Stick bis 95 °C, klar. 14 s: Konkurrenzpreise, Claude-Klickpfad, klar | – |
| Gemini-Review | nicht gelaufen (fetch failed) | – |

## Bekannte Schwächen laut Design, bewertet
- **Maskottchen 5,0–5,8 s unten halb angeschnitten:** bestätigt (h4/020–024). Groß im Vordergrund, darauf die Pills. Wirkt eher wie ein Fehler als gewollt angeschnitten. Wiederholung von Folge 4 final-R2-2. Abzug bei Kriterium 5, Wunsch-Ticket 1.
- **Gewinner-Stempel ≈ 0,5 s, kontrastarm:** bestätigt (`winner.jpg`). „EINZELN NACHBESTELLEN“ fliegt bei ≈ 23,5 s groß und unscharf rein, bei 24,0–24,5 s ist er goldene Schrift auf goldenem Grund und kaum lesbar, ab 24,7 s ist er weg. Die Entscheidung tragen das orange Schild (ab 22,7 s bis Ende Warum) und die gesprochene Zeile, deshalb kein K.-o. Wunsch-Ticket 2.
- **„mit“-Banner 0,7 s:** bestätigt, ≈ 21,75–22,45 s, und er stößt bei 22,0 s an beide Ränder. Er liest sich als „UNSER PAKET mit RUND 110 €“, der Gleichstand kommt also an. Kurz, aber auf dem Wort. Teil von Wunsch-Ticket 2.
- **Kleine Wandkarten:** bestätigt. Die Schrift auf den Karten ist ≈ 1 % Bildhöhe. Die Wand soll Überblick geben, die Kernzahl 110 € ist hervorgehoben und steht groß in Hook und Banner. Auf dem Handy ist „110 € workwear one“ gerade noch lesbar, die ERST-AB-Namen nicht. Vertretbar, Wunsch-Ticket 3.
- **Zusätzlich gefunden:** Endkarte mit angeschnittenem Board (Rückfall gegenüber Folge 4). Wunsch-Ticket 4.

## Noten je Kriterium
| Kriterium | Note |
|---|---|
| 1 Privatsphäre / Shot 02 | 10 |
| 2 Kein Umsatz-Zähler | 10 |
| 3 Kein Tag N | 10 |
| 4 Eröffnung wörtlich | 10 |
| 5 Rückblick | 8 |
| 6 Warum-Karten | 8 |
| 7 Zahlen 1:1 | 9 |
| 8 Untertitel | 8 |
| 9 Länge/Ton (inkl. explizites Wort) | 8 |
| 10 Text | 9 |
| 11 Guide | 9 |
| 12 Replies/Format | 10 |
| P1 Hook / Board / Lesetext | 8 |
| P2 Vergleich Folge 4 | 8 |

**Gesamt 8/10, bestanden.** Alle Kriterien ≥ 8, kein K.-o. verletzt. Das explizite Wort ist aus dem Musik-Stem entfernt und per STT nachgeprüft. Freigabe für Slot 2026-10-29 12:00 aus Prüfersicht, mit Vorbehalt: kein Gemini-Review. Abschluss laut Chef: das aktuelle Video (21:35) und den Mix in den Desktop-Ordner kopieren, nicht r1.

## Tickets (alle Wunsch, kein Render allein dafür; für Folge 6 ff. oder beim nächsten Render mitnehmen)
```
TICKET final-R1-1 → firma-design
Kriterium: Rückblick · Note: 8/10
Beleg: Video 0:04,9–0:05,8 · pruefung/final-r1/h4/020.png–024.png
Problem: Das Maskottchen steht groß im Vordergrund und ist unten etwa zur Hälfte vom Bildrand abgeschnitten, die Wort-Pills liegen darauf (offen seit Folge 4 final-R2-2).
Soll: Maskottchen im Rückblick ganz im Bild oder höchstens ⅓ angeschnitten, Pills frei; gilt als feste Regel ab Folge 6.
```
```
TICKET final-R1-2 → firma-design
Kriterium: Zahlen/Lesbarkeit Entscheidung · Note: 8/10
Beleg: Video 0:21,75–0:24,7 · pruefung/final-r1/winner.jpg
Problem: Der „mit“-Balken steht nur 0,7 s und stößt an beide Bildränder. Der Stempel „EINZELN NACHBESTELLEN“ ist nur ≈ 0,5 s lesbar und danach gold auf gold kaum zu erkennen.
Soll: Gleichstand-Balken mit ≥ 40 px Rand und ≥ 1,0 s Standzeit; Entscheidungs-Stempel in Kontrastfarbe (weiß auf orange oder dunkel auf hell), ≥ 1,0 s ruhig lesbar.
```
```
TICKET final-R1-3 → firma-design
Kriterium: Kein Lesetext / Wand · Note: 8/10
Beleg: Video 0:18,8–0:22,5 · pruefung/final-r1/sheet2.jpg Reihe 1–2; 0:30,2–0:30,95 · why2.jpg
Problem: Die Wandkarten-Schrift ist ≈ 1 % Bildhöhe, die Namen sind auf dem Handy nicht lesbar. Der Gegenwert „erst ab 5“ von Warum-Karte 2 ist nur ≈ 0,75 s zu sehen.
Soll: Wandkarten mit Preis ≥ 3 % Bildhöhe (lieber 6 große als 9 kleine Karten, Rest als Zahl „+5 erst ab 10–30“); Gegenwert jeder Warum-Karte ≥ 1,2 s sichtbar, bevor der nächste Akt kommt.
```
```
TICKET final-R1-4 → firma-design
Kriterium: Board/Fenster ganz im Bild (Endkarte) · Note: 8/10
Beleg: Video 0:38,5–0:44,8 · pruefung/final-r1/sheet3.jpg Reihe 3
Problem: Unter den DM-Karten scheinen die Board-Reihen 4–9 durch, „ERSTER UMSATZ“ wird vom Balken „in 10 Minuten“ angeschnitten. Das ist ein Rückfall gegenüber Folge 4 R2 (dimBoard).
Soll: Endkarte wie Folge 4 R2: Board unter den DM-Karten ausgeblendet oder ganz abgedunkelt, keine angeschnittene Beschriftung.
```
Hinweis an firma-regie (kein Ticket): Musik-Stellen vor dem Mix per STT auf Gesang prüfen und Fenster mit Text meiden, statt nachträglich zu muten. Die Stummschaltung 16,55–17,20 s ist hier unauffällig, verletzt aber streng genommen „Musik am Stück“.
