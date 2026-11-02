# Finale Prüfung Folge 7 „Preis“ · Runde 1 · frischer firma-pruefer · 2026-10-29 10:10

Prüfling: `runs/firma-tag7/firma-tag7-final.mp4` (byte-identisch mit `runs/firma-ep/tag7/render/tag2-folge7.mp4`), Cover, Caption, preis-guide.pdf, replies.json, Skript/words, episode.json, LAUF.md, Render-Stems.
Belege: `runs/firma-tag7/pruefung/final-r1/`.

## Ergebnis: **7/10, nicht bestanden** (knapp)
Kein K.-o. verletzt. Zahlen, Ton, Spleiß, Kette und Caption sind sauber. Unter 8 liegen zwei Punkte: der Hook (Objekt 0–4 s praktisch ein Standbild, Bewegung fast nur aus Wort-Pills) und die dritte Warum-Karte (die Zahl „rund 15 €“ steht nur ca. 0,7 s). Beide lassen sich ohne Skript- oder Ton-Änderung beheben, also nur Bild neu rendern und den Ton unverändert drüberlegen.

## Spleißstelle Frame 179/180 (≈ 6,0 s): sauber, 10/10
- Frame-Abgleich (54×96-Graustufen, `cmp.py`): Final 0–179 = `video-range-0-179.mp4` (neuer Hook), Final 180–1432 = alter Render `video.mp4` 180–1432 (mittlere Abweichung 0,14–0,2 = nur Encoder). Kein Frame-Versatz an irgendeiner Stelle (geprüft: 170–200, 300, 600, 900, 1200, 1400, 1432).
- Keine Doppelframes: Im ganzen Video gibt es kein Paar aufeinanderfolgender Frames mit Differenz < 0,05.
- Kein Sprung: Die Differenzen von Frame zu Frame bei 177–181 (3,2/7,2/8,1/4,9) sind die Einflug-Animation der Karte „SHIRTS MIT LOGO“ (5,93 s), die auch im alten Render genau so liegt. Siehe `splice-5.6-6.4-30fps.jpg`.
- Kein Versatz im Ton: Kreuzkorrelation Final-Tonspur gegen `mix.wav` bei 1/4/5,5/6/7/15/30/45 s ergibt 0 ms Versatz (r = 0,9999); gegen `stem-voice.wav` −1 ms.
- Nur ein Hinweis: Video 1433 Frames = 47,77 s, Audio 47,85 s. `video-v2.mp4` hatte 1436 Frames, beim Mux fehlen die letzten 3 Frames (Endkarte). Das ist unkritisch, die letzten 0,08 s Ausklang laufen über dem letzten Frame.

## Noten je Kriterium

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Opening wörtlich, kein Tag | 9 | STT (`stt-final.txt`) 0,1–4,5 s wörtlich „Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probiere das aus.“ Kein „Tag“ gesprochen. Bild: nur kleines HUD-Badge „TAG 2“, kein großes TAG-Slam (`frame0.png`). Die Bild-Headline ist die kurze Fassung „Wie viel Umsatz macht eine KI in 100 Tagen?“ (wie bei Folge 3, dort akzeptiert). |
| 2 | Rückblick ≤ 6 s, „Heute“, Neuer versteht bis 14 s | 9 | words.json: „Die“ 4,95 bis „Vorbehalt.“ 10,89 = 5,94 s. Satz 1 lautet wie festgelegt „bestickt“, Satz 2 „Partner: A einundsechzig, mit Vorbehalt.“ „Heute rechnet sie ihren Preis.“ von 10,98 bis 12,30. Bild: Board mit Haken, Kachel 5 „A61 · MIT VORBEHALT“ leuchtet, Pill „HEUTE: PREIS RECHNEN“ (`kontakt-0.5s.jpg` 9,5–12 s). |
| 3 | Kette lückenlos, kein „gestern“, Wechsel begründet | 8 | Kein „gestern“ (Skript + STT). Der Prompt hängt das Ergebnis aus Folge 6 an (LAUF.md). Der Wechsel zu Printful wird sofort mit drei Gründen belegt. Kleiner Schönheitsfehler: Auf dem Board ist Schritt 5 PARTNER abgehakt und Schritt 4 PREIS noch offen (Reihenfolge der Konzept-Kacheln). Für Neue liest sich das wie ein Rücksprung, ist aber kein K.-o. |
| 4 | Warum: 2–3 Gründe mit Zahl, Karten ≥ 1,2 s | **7** | Die Balken stehen lange genug: 151 € ab 23,3 s, Konkurrenzlinie 110 € ab 25,4 s, 69 € ab 27,0 s, alle bis 30,0 s. Die Karte „1 Shirt nachbestellt“ steht ab 27,9 s, ihre Kernzahl „rund 15 €“ aber erst ab ca. 29,3 s, und schon bei 30,0 s schrumpft sie weg. Lesbar ist die Zahl also nur ca. 0,7 s (`why-28-30.4.jpg`, Frames 1,4–1,8). |
| 5 | Zähler aus, keine erfundenen Zahlen, „gerechnet, nicht verdient“ | 8 | Kein Umsatz-Zähler im ganzen Video. Alle Zahlen gegen LAUF.md/Excel geprüft: 151,40 (B10), 69,14 (D10 69,1353), 109 (B22), −35,63 (B23), +33,50 (D23), „rund fünfzehn“ (D18 15,41), 35,80 A61-Einzelshirt (B18), 110 Konkurrenz (B7), 75 Formeln, „machine wash warm“ (alles 1:1). HAKRO 281 kommt im Video nicht vor. Der Kurs 0,8666 mit EZB-Datum 15.09.2026 steht in Caption und Guide (S. 8/10). 29,90 € ist in Caption und Guide als Vorschlag benannt. „gerechnet, nicht verdient“ steht 0–3,9 s groß im Hook (und auf dem Cover), im Ergebnis-Akt aber nur 34,1–34,7 s (`result-33.2-35.jpg`). Hinweis: Der Counter-Roll zeigt zwischendurch Fantasiewerte (+21,05 / −25,95 / +33,39 / −33,94 €, 33,4–34,0 s). Das ist Animation, auf einem Standbild aber als Zahl lesbar. |
| 6 | Echter claude.ai-Lauf, keine Sidebar/Namen/Titel | 9 | Screens 12,3–17,2 s: DOM-Klon ohne Sidebar, Kopf nur „Claude“ + eigene Pill, kein Chat-Titel, keine Namen (`claude-a.jpg`, `claude-b.jpg`). Beleg-Zitat „Ich entscheide mich für Printful“ ist wörtlich aus der Antwort (19,4 s). Vermerk: Im Lauf wurde einmal „Allow once“ für Terminal geklickt (LAUF.md, Caption Schritt 4, Guide S. 2 ehrlich genannt). Kleinigkeit: Um 16,7 s fliegen die Partner-Minikarten für ca. 0,1 s über die Pill „EXCEL · 75 FORMELN“. Die Prompt-Ansicht 13–16,5 s ist viel Text, durch Zoom und Markierungen aber geführt. |
| 7 | Länge, Lautheit, Musik, Betonung | 9 | Skript 134 Wörter (wc), 128 gesprochene Tokens, 47,85 s. ebur128: −14,0 LUFS, TP −1,1 dBFS, LRA 1,3 (`ebur128.txt`). Abstand Stimme zu Musik je Akt, eigene Messung aus den Stems, Median: Hook 21,0 · Rückblick 17,5 · Claude 19,2 · Wechsel 16,2 · Warum 18,4 · Vorschlag 20,7 · Haken 17,6 · Als Nächstes 23,2 · CTA 19,0 dB (`musik-abstand.txt`). Render-Messung min 17,6 dB. Alle ≥ 15. STT Stimm-Stem = Skript Wort für Wort, Betonung unauffällig („A einundsechzig“, „Sechzig-Grad-Wäsche“, „Kalkulationsvorlage“). Nur im Mix hört STT bei 23,4 s „hundereineundfünfzig“ (der Stem ist sauber). Vermutlich überdeckt der SFX-Pop auf „151“ (v 0,3) die Silbe ein wenig, das ist kein Ticket. Kein explizites Wort (Chef-Vorprüfung, gesprochener Text sauber). |
| 8 | Ansprache, Emojis, Caption-Ende, CTA-Versprechen | 9 | Du-Form nur im CTA (Video 41,5–46,9 s, Caption-CTA-Absatz). Keine Emojis. Die Caption endet mit „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags. Menüpfad Settings > Capabilities steht drin. Der Guide hält das Versprechen: „Die Frage zum Kopieren“ wörtlich (S. 2) und die „Kalkulationsvorlage“ mit Eingaben- und Formel-Tabellen (S. 5–7, `guide-p5.png`) sowie dem ausgefüllten Beispiel (S. 8–9). replies.json: neutral, keine Emojis. Die Länge der Caption ist wie vorgegeben nicht bewertet. |
| H | Hook-Regel (Frame 0, Ereignis ≤ 0,5 s, kein Overlap, Maskottchen, Labels) | **7** | Siehe unten. |
| L | Look und Vergleich mit Folge 3 v8 | 8 | Ruhige Kamera, Board und Claude-Fenster ganz im Bild (`sheet-maskottchen.jpg`), Maskottchen nie mehr als ⅓ angeschnitten, höchstens ein neues Label gleichzeitig. Die zweite Hälfte ist ohne Ton verständlich (Balken, Vorschlag 109 €, 60 °C durchgestrichen, „Firma ???“, DM-Karten). Der Hook ist schwächer als bei F3 v8, dort füllten sich die Kacheln und das Board zoomte. |
| G | Gemini-Review | – | Nicht gelaufen: OpenRouter 402 (Guthaben < 1 $), siehe `gemini-review.txt`. Ersatz: manuelle Prüfung Frame für Frame (Kontaktbogen 0,5 s, Hook mit 4 fps, Übergänge mit 30 fps). |

## Hook im Detail (`hook-0-6s-4fps.jpg`, `hook-bewegung.txt`, `alt-hook-vor-splice.jpg`)
- Frame 0 zeigt die ganze Frage (Kurzform) und das Objekt (Kalkulationskarte mit allen Werten, „PRINTFUL STATT A61“, „gerechnet, nicht verdient“). Erfüllt.
- Overlap mit dem Plan: keiner. Die Karte fliegt 3,9–4,2 s unten heraus, während das Board oben erscheint, und die beiden überdecken sich nicht (`uebergang-3.6-4.4-30fps.jpg`). Maskottchen immer ganz im Bild. Labels sind Aussagen aus dem Lauf.
- **Bildereignis alle ≤ 0,5 s: formal ja, im Objekt nein.** Mittlere Differenz von Frame zu Frame in der Kartenregion: 0,25–1,0 s Push (27–37), **1,0–1,75 s fast null (0,44–0,64), die Karte ist 0,75 s ein Standbild**, 1,75–2,75 s Sweep (12–15), 3,0–3,75 s Stempel „GANZ ALLEINE.“. Der Inhalt der Karte (Zahlen, Stempel, Note) ändert sich 0–3,9 s überhaupt nicht. Alle geplanten Beats „bad/good/note“ (episode.json hook.beats) sind im Bild kaum zu sehen. In 1,0–1,75 s kommt die Bewegung nur aus den Pills „Unternehmen/das/eine“ und dem Maskottchen. **5,1–5,9 s:** Die Differenz über das ganze Bild liegt bei ≈ 2, es gibt nur Pills („Die Firma der KI“), bis bei 5,93 s „SHIRTS MIT LOGO“ einfliegt.
- Der neu gespleißte Hook unterscheidet sich vom alten kaum (`alt-hook-vor-splice.jpg` gegen `hook-0-6s-4fps.jpg`). Das Problem „Karte steht“ ist mit dem Spleiß also nicht behoben.
- Scroller-Test: Bei 1 s bleibt man (große Frage + rote/grüne Zahl). Bei 3 s eher ja („GANZ ALLEINE.“-Stempel). Bei 10 s ja (Board + „A61 mit Vorbehalt“ + „Heute: Preis rechnen“). Das Risiko liegt bei 1,0–1,75 s.

## Tickets

```
TICKET final-R1-1 → firma-design
Kriterium: Hook-Regel / Hook nicht statisch · Note: 7/10
Beleg: final-r1/hook-0-6s-4fps.jpg Frames 1,0–1,75 s; hook-bewegung.txt Spalte card 1,00–1,50 (0,44–0,64); 5,1–5,9 s Gesamtbild ≈ 2
Problem: Die Kalkulationskarte (das Objekt) bleibt 0–3,9 s inhaltlich unverändert und steht 1,0–1,75 s als Standbild, die Bewegung kommt nur aus Wort-Pills und Maskottchen; 5,1–5,9 s ebenso nur Pills.
Soll: In jedem 0,5-s-Fenster 0–6 s ändert sich ein Objekt sichtbar (nicht nur Pills/Maskottchen). Die geplanten Beats auf der Karte werden deutlich sichtbar, z. B. „macht“ = A61-Wert −35,63 pulst rot mit Skalierung ≥ 10 %, „Unternehmen“ = Printful-Spalte leuchtet grün auf, „das“ = Zeilen-Sweep, „100“ = Stempel „PRINTFUL STATT A61“ setzt neu auf, „Tage“ = Note „gerechnet, nicht verdient“ wackelt/blinkt. Im Rückblick erscheint bei „Firma“ (5,09 s) schon ein Bildereignis (Shirt-Karte oder Board-Kachel-Glow) statt erst bei 5,93 s. Messung Kartenregion: kein 0,5-s-Fenster mit maximaler Frame-Differenz < 3. Frame 0 bleibt wie jetzt (ganze Frage + volle Karte). Ton unverändert, nur Video 0–179 neu rendern und wieder framegenau spleißen.
```

```
TICKET final-R1-2 → firma-regie (Timing in episode.json) + firma-design
Kriterium: Warum-Karten ≥ 1,2 s · Note: 7/10
Beleg: final-r1/why-28-30.4.jpg; Video 29,3–30,0 s
Problem: Die dritte Warum-Karte „1 Shirt nachbestellt“ zeigt ihre Kernzahl „rund 15 €“ nur ca. 0,7 s (ab „15“ 29,32 s bis zum Abbau bei 30,0 s).
Soll: „rund 15 €“ ist ≥ 1,2 s voll lesbar, z. B. Zahl schon bei „nachbestellt“ (28,39 s) zeigen oder die Karte bis „109“ (30,65 s) stehen lassen, ohne dass sie den Vorschlag-Zettel überlappt.
```

Ohne eigenes Ticket, aber beim Nachrender mit erledigen (nicht bewertungsrelevant):
- Counter-Roll im Ergebnis-Akt (33,4–34,0 s) ohne lesbare Zwischenwerte, also Blur/Slot oder direkt von „?“ auf den Endwert.
- „gerechnet, nicht verdient“ im Ergebnis-Akt länger als 0,6 s stehen lassen.
- 16,7 s: Partner-Minikarten fliegen kurz über die Claude-Pill.
- Mux: die 3 fehlenden Endframes (1433 statt 1436) ergänzen oder das Audio auf 47,77 s kürzen.

## Was ausdrücklich in Ordnung ist
Die Spleißstelle (frame- und tongenau), alle Zahlen, Lautheit −14,0 LUFS, Musikabstand je Akt, STT gegen Skript, die Rückblick-Länge, kein „gestern“, kein Umsatz-Zähler, keine Sidebar/Titel/Namen, Caption-Ende und Fiktiv-Hinweis, und der Guide enthält Frage und Vorlage. Nichts wurde eingeplant, gepostet oder gerendert. Geändert wurden nur Belegdateien in `final-r1/` und dieser Bericht.
