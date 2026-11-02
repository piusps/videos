# Finale Prüfung Runde 1: Folge 6 „Partner“ (@pickthecompany, Slot 2026-10-29 15:00)

Prüfer: firma-pruefer (frisch, übernimmt Belege des Vorgängers aus `final-r1/`), 2026-10-29 10:05
Prüfling: `runs/firma-tag6/firma-tag6-final.mp4` (render 2026-10-28 21:39, identisch mit `firma-ep/tag6/render/tag2-folge6.mp4`, 79 679 851 Byte)

## Ergebnis

**Gesamtnote 8,4/10: bestanden.** Keine K.-o.-Regel ist verletzt. Die Tickets unten sind Verbesserungen für den Hook und die Endkarte. Sie blockieren das Posten nicht.

## Messwerte (selbst nachgemessen)

| Prüfpunkt | Soll | Ist | Beleg |
|---|---|---|---|
| Dauer | 40–48 s | 46,75 s, 1080×1920, 30 fps | ffprobe |
| Lautheit | −14 ±0,5 LUFS | −14,0 LUFS integriert, TP −1,31 dB | ebur128 (neu gemessen), mix-info.json |
| Musik unter Stimme je Akt | ≥15 dB | min. 16,0 dB (winner-a4 20,52–22,4 s), sonst 17,1–21,8 dB | mix-info.json gapsPerAct |
| Wörter | 110–135 | 135 (Obergrenze) | script.txt |
| Explizites Wort in der Musik | keins | Roh-Musik enthält „some shit“ bei ~6,9 s. Im Stem ist es durch die Stummschaltung 6,72–7,32 s weg. Nachprüfung jetzt: `r2-stem-5-9s-boost.mp3` (+20 dB) → „But you won't see what I've never seen“, kein explizites Wort. Ganzer Stem (+boost, Vorgänger): sauber. | stt-music-full.txt, r2-stem-5-9s-boost.mp3 |
| STT gegen Skript | wörtlich | passt Wort für Wort. „probiere“ statt „probier“ ist ein STT-Artefakt. | stt.txt |
| Caption | ≤2200 Zeichen, Disclaimer, dann nur Hashtags | 2139 Zeichen, endet mit „(Fiktives Experiment, keine echten Umsätze.)“ + 6 Hashtags, keine Emojis | caption.txt |
| Gemini-Review (review-video.mjs) | läuft | **nicht möglich**: OpenRouter 402 (Guthaben < 1 $). Ersetzt durch manuelle Durchsicht Frame für Frame. | gemini.txt |

## K.-o.-Regeln

1. **Opening: erfüllt, Note 9.** Gesprochen 0,1–4,6 s: „Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus.“ Es wird kein Tag gesprochen. Oben links steht nur das kleine HUD-Badge „TAG 2“, kein großes TAG N.
2. **Recap: erfüllt, Note 9.** Satz 1 läuft 5,1–8,4 s („Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, bestickt erst auf Bestellung“), Satz 2 (Ergebnis der Vorfolge) 9,0–10,1 s („Ihre Lücke: Shirts einzeln nachbestellen“). Gesprochen sind das 5,7 s, „Heute“ kommt bei 10,9 s. Bis 14 s sind Firma, Lücke, Ziel und Werkzeug klar. Schwäche: Der Recap-Akt steht 7,11 s im Bild (4,93–12,04 s).
3. **Kette: erfüllt, Note 9.** Kein „gestern“ in Skript, Caption oder episode.json. Der Anhang „Shirt-Firma Ergebnis Konkurrenz.md“ verbindet die Folge sichtbar mit der Vorfolge. Die Caption sagt „in der letzten Folge“.
4. **Warum: erfüllt, Note 9.** Grund-Karte 1 „60 °C nur hier belegt“ (ab 23,0 s, mit Gegenwert „60 °C? 6 andere Partner“). Grund-Karte 2 „ab 1 Stück“ (ab 26,5 s, Gegenwert „ab 10 Lohnstickereien“). Beide stehen weit über 1,2 s. Danach kommt der Haken als Preiskarte (28–33 s).
5. **Zahlen: erfüllt, Note 8.** Es gibt keinen Umsatzzähler (das Raster oben rechts ist der Gründungsplan). Diese Zahlen sind im Lauf belegt (bericht.md/LAUF.md):
   - 294 Quellen, 5 min 56 s
   - A61 „mit Vorbehalt bis zum Händlerangebot“
   - 151,40 € (gezeigt als 151 €)
   - Markt 110 € (Vorfolge)
   - Lohnstickereien „ab 10 Stück“
   - 7 Partner

   Die Printful-Marge kommt nur im Guide vor und ist dort als Annahme markiert: „≈ 25 netto, nur bei Annahme 1 USD ≈ 1 € (Wechselkurs nicht belegt)“. Abschnitt „Fehler“ dazu: „Wechselkurs annehmen … im Bericht nicht belegt“. Im Video kommt Printful nicht vor. F6 stellt einen Befund fest („nimmt A61 unter Vorbehalt“, „findet Claude dort nicht“), keine Anfrage.
   Kleiner Abzug: Die Hochzähl-Animation zeigt kurz Zwischenwerte, die nicht im Lauf stehen: „43 €“ bei 29,5 s, „150 €“ bei 30,0 s, „Markt 102 €“ bei 32,0 s (jeweils < 0,5 s).
6. **Claude-UI: erfüllt, Note 9.** Gezeigt werden echte claude.ai-Screens (DOM-Klon): Plus-Menü mit Research, Anhang, Prompt und „Research complete · 294 sources · 5m 56s“. Es gibt keine Sidebar, keine Chat-Titel und keine Namen. Sichtbar ist nur der eigene Dateiname „Shirt-Firma Ergebnis Konkurrenz.md“ sowie „Project“ und „Opus 5.5“ (claude-shots.jpg).
7. **Ton: erfüllt, Note 9.** Werte siehe Tabelle. 135 Wörter liegen genau an der Obergrenze.
8. **Ansprache und Caption: erfüllt, Note 9.**
   - Direkte Ansprache gibt es nur im CTA (39,6–45,1 s).
   - Die Caption enthält keine Emojis, kein Superkind, keinen Preis und nicht „KI-Mitarbeiter“.
   - Die Replies enden alle mit einer Frage.
   - Der Guide nennt Superkind nur leise in der Konsolenzeile.

## Weitere Kriterien

| Kriterium | Note | Begründung |
|---|---|---|
| Hook 0–6 s | 7 | Frame 0 hat die ganze Frage plus Objekt (A61-Karte, Preiszettel). Bildereignisse im 0,25-s-Raster (hook4.jpg, motion-hook-10fps.txt) liegen bei 0,4 / 0,9 / 1,1 / 2,3 / 3,2 / 4,0 / 4,9 / 5,8 s. In 0–3 s sind es überwiegend Pulse und Wackler. Die Lücke 1,2–2,3 s wird nur von Untertitel-Pills getragen. Zwischen ca. 2,0 und 3,0 s schiebt sich die A61-Karte über die Unterzeile „eine KI in 100 Tagen?“ (r2-3.1s.png, hook4 Bild 10–13). „GANZ ALLEINE.“ liegt ab 3,2 s ca. 0,7 s auf der Karte. Kein Overlap mit dem Plan. |
| Gestaltung / Lesbarkeit | 8 | Sauberer, durchgehender Raum-Look. „UNTER VORBEHALT“ (21,5–22,4 s) ist überstrahlt: weiß auf hellem Orange, auf dem Kontaktbogen kaum lesbar. Die A61-Karte ist 4–22 s außerhalb des Bilds. Das ist gewollt (Spannung), wirkt aber wie ein Spoiler in Frame 0. |
| Maskottchen | 8 | Im Hook ganz im Bild. Auf der Endkarte (39,5–46,75 s) ist es unten etwa ⅓ angeschnitten, also an der Grenze. Die Untertitel-Pills liegen auf Stirn und Augenhöhe (r2-end-45s.png, 44–45 s). |
| Labels nur aus dem Lauf | 9 | Alle Labels sind belegt, Ausnahme die Zwischenwerte beim Hochzählen (siehe 5). |
| Paket (Cover, Guide, Replies) | 9 | Cover mit Frage, Objekt und Preiszettel. Guide (v3-Konsole) mit Prompt, Partnertabelle, 31 Quellen und markierter Annahme. 6 Replies. |

**Gesamt:** Mittelwert aus 13 Noten = 8,4. Damit bestanden (≥8). K.-o. frei.

## Tickets (nicht blockierend, für die nächste Folge oder bei Zeit vor 15:00)

1. **Hook 0–3 s zu ruhig** (firma-regie und firma-design)
   - Problem: Bildereignisse 1,2–2,3 s nur durch Untertitel; Unterzeile der Frage ca. 2,0–3,0 s von der Karte verdeckt; „GANZ ALLEINE.“ liegt 3,2–3,9 s auf der Karte.
   - Soll: alle ≤0,5 s ein echtes Objekt-Ereignis (Stempel, Kamerasprung, Zettel-Flip), keine Überdeckung der Frage, das Banner mit Abstand über der Karte.
2. **Hochzählen zeigt unbelegte Zwischenwerte** (firma-design)
   - Problem: 29,5 s „43 €“, 30,0 s „150 €“, 32,0 s „Markt 102 €“.
   - Soll: Zahl ohne Count-up einblenden (Pop/Stempel) oder sie unsichtbar hochzählen lassen, bis der Endwert steht.
3. **„UNTER VORBEHALT“ überstrahlt** (firma-design)
   - Problem: 21,5–22,4 s, weiß auf Orange mit Glow.
   - Soll: dunkle Schrift oder dunkler Hintergrund, Kontrast ≥4,5:1.
4. **Endkarte** (firma-design)
   - Problem: 39,5–46,75 s ist das Maskottchen ca. ⅓ angeschnitten, Untertitel auf dem Gesicht.
   - Soll: Maskottchen ganz im Bild oder Untertitel über die Gründungsplan-Leiste, Gesicht frei.
5. **Prozess: Gemini-Review fehlt** (firma-chef)
   - Problem: OpenRouter-Guthaben < 1 $ (402).
   - Soll: Guthaben aufladen, damit `review-video.mjs` bei der nächsten Folge läuft. Diesmal ersetzt durch manuelle Prüfung aller 0,5-s-Frames.

## Belege (final-r1/)
- Vom Vorgänger: sheet1-3.jpg, hook4.jpg, h4/, frame0.png, claude-shots.jpg, cs/, key4.jpg, stt.txt, stt-music-full.txt, motion-hook-10fps.txt, gemini.txt
- Neu: r2-stem-5-9s-boost.mp3, r2-end-45s.png, r2-3.1s.png
