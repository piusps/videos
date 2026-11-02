# Prüfung final · Folge 20 „Mit oder ohne Umsatzsteuer?“ · Runde 2 (Slot 2026-11-01 21:00, Serientag 5, nicht erste Folge)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-11-01. Nichts geändert, nur Belege in `pruefung/final-r2/` angelegt.
Gemini/OpenRouter nicht genutzt (402 aus R1) → manuell Frame für Frame + Pixelmessung (Python/PIL, eigene Glyphen-Segmentierung). ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 15:48): `firma-tag20-final.mp4` (44,600 s, 1080×1920, 30 fps, h264 9,5 Mbit/s, AAC 48 kHz), `firma-tag20-final-handy.mp4` (44,608 s, 1,75 Mbit/s), `kontaktbogen-2fps.jpg` (15:48), `cover.jpg` (15:32).
Grundlage: `final-runde1.md` (7,5; blockierend R1-01/R1-02, Backlog R1-03/R1-04). Geprüft: Ticket-Stellen, Regression, ganzes Video mit 4 fps, Maskottchen-Durchgang, Ton, Kontaktbogen/Cover.

## Belege (`pruefung/final-r2/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos mit 4 fps (gleiches Raster wie R1: 8×3 Zellen à 240×426, 6 s pro Bogen)
- `regression-4fps.txt`: Zelle-für-Zelle-Differenz R1-Bogen vs. R2-Bogen (179 Zeitpunkte)
- `full_<s>.jpg` (2,0 / 24,0 / 27,75 / 31,0 / 33,75 / 38,5 / 41,5) und `regr_<s>.jpg` (R1 | R2 | Differenz ×4)
- 30-fps-Streifen: `t30-23.40.jpg` (Tafel kommt), `t30-34.23.jpg` (Tafel geht), `t30-37.47.jpg` (CTA-Schnitt, Pill „ihre Rechnung“)
- Ton: `final-audio.mp3`, `stt-final-mix.json` (6 Läufe), `stt-final-mix-2.json`, `stt-final-mix-3.json` (je 3 Läufe), `stt-voice.json` (3 Läufe voice.mp3), `stt.mjs`, `black-freeze.txt`

## Ticket-Stellen – Pixelmessung (Versalhöhe an 1080×1920, Schrift ≈ Versal / 0,72 wie R1)
| Ticket | Text | Zeit | Messung | ≈ Schrift | Soll | Urteil |
|---|---|---|---|---|---|---|
| R1-02 | „Mit Vorsteuerabzug zahlt:“ (Kopfzeile Warum-/Einkauf-/Haken-Tafel) | 23,57–34,37 | „M“ 45 px, „V“ 45 px (x 190–238, y 390–434), identisch bei 24,0 / 27,75 / 31,0 / 33,75 | ≈ 62 | ≥ 58 | **erledigt** |
| R1-02 | Kopfzeile von Anfang an Teil der Tafel | 23,57 / 34,37 | Tafel skaliert ab 23,57 bereits mit Kopfzeile ein (`t30-23.40`), bleibt bis zum letzten Tafel-Frame 34,37 (`t30-34.23`), lückenlos in allen 4-fps-Zellen 23,5–34,25 | – | durchgehend | **erledigt** |
| R1-02 | 91,60 € nie ohne Bedingung | ganzes Video | Vorkommen: Hook 0–4,87 (Kopfzeile, unverändert), Tafel 23,57–34,37 (Kopfzeile), Shot-08-Chips 25,25–26,0 (innerhalb der Tafel unter der Kopfzeile), Cover (Kopfzeile). Sonst nirgends (4 fps lückenlos) | – | – | **erledigt** |
| R1-01 | „als Klein-“ / „unternehmer“ | 30,4–32,20 | „K“ 47 px, „h“ 47 px, x-Höhe 35 px (R1: „K“ 37 px) | ≈ 65–67 (Design 68) | ≥ 58 | **erledigt** |
| R1-04 | „17,40 € ZURÜCK“ | 27,5–29,20 | Ziffern/Versalien 45–47 px (R1 40–42) | ≈ 64 | Versal ≥ 46 | **erledigt** |
| R1-04 | Pill „ihre Rechnung“ endet am CTA-Schnitt | 37,60→37,64 | letzter Frame mit Pill 37,60, ab 37,64 CTA-Board ohne Pill (R1: 3 Frames Überhang) | – | – | **erledigt** |

Nebenwirkung der Kopfzeile (gemessen): Die Tafel-Inhalte sind etwas kleiner geworden. „MIT USt“ 43 px Versal (R1 49) → ≈ 60 px Schrift, knapp über 58. „91,60 €“ / „109 €“ 61 px, „+19 % EINKAUF“ 52 px, „19 % teurer.“ 48 px, KEINE STEUERBERATUNG unverändert. Alles ≥ 58 px Schrift.

## Regression gegen R1
Gleiche Zeitpunkte (Vollbilder, Mittelwert-Pixeldifferenz): 2,0 → 0,5 · 38,5 → 0,8 · 41,5 → 0,5 (Encode-Rauschen) · 24,0 → 6,9 · 27,75 → 8,4 · 31,0 → 11,6 · 33,75 → 7,1 (gewollt: Tafel mit Kopfzeile, Klein-/unternehmer, 17,40 €).
Ganzes Video 4 fps, Zelle für Zelle (`regression-4fps.txt`): außerhalb 23,5–34,25 s **max Δ 1,2**, also unverändert; innerhalb nur die Tafel (Δ 7,3–12,4, Differenz liegt ausschließlich im Tafelbereich, `regr_*.jpg`). Untertitel, Maskottchen, HUD im Tafelfenster unverändert. **Keine ungewollte Änderung.**
blackdetect: 0. freezedetect (≥ 0,6 s): 1 Treffer 22,40–23,03 (0,63 s), gleich wie R1, gewollte Pause (H3 R1).
Handy vs. Master: SSIM 0,9955 (5 fps), Ton-Korrelation 0,9992.

## Maskottchen-Durchgang (ganzes Video; ≤ 1/3 verdeckt, Augen frei, nichts auf den Augen)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,0–23,53 | Bild identisch mit R1 (Δ ≤ 1,2), R1-Befund gilt: ganz sichtbar oder ganz weg | ok |
| 23,57–34,37 | Tafel mit Kopfzeile endet über dem Maskottchen (Tafelunterkante ≈ y 1150, Maskottchen ab ≈ y 1200), ganz sichtbar, Augen frei, Untertitel darunter (`full-4fps-04…06`, `t30-23.40`, `t30-34.23`) | ok |
| 34,40–37,60 | klein unten rechts, unverändert zu R1 | ok |
| 37,64–44,60 | CTA groß, identisch mit R1; Pill „ihre Rechnung“ nicht mehr im Board; Augen frei (Blinzeln 37,67–37,70 ist Animation) | ok |

**Untertitel-Sync 33–38 s (captionY):** „Als Nächstes“ STT 34,58 / Pill ab 34,53; „Was muss auf ihre Rechnung“ STT 35,64–36,80 / Pills 35,6–37,60 an gleicher Position wie R1; „Kommentiere“ STT 37,84 / Pill ab 37,77; „Steuer“ 38,68 / ≈ 38,75. Nichts verschwunden oder verrutscht, ≤ 0,1 s. **Kein Maskottchen-K.-o.**

## Ton
| Punkt | Wert | Soll |
|---|---|---|
| Mischung vs. R1 | Versatz 0, Korrelation 0,9995; Unterschiede nur 17,2–20,6 s (Tipp-SFX verschoben) + Kodierrauschen ≤ −13 dB | sonst unverändert ✓ |
| Tipp-SFX (R1-03) | alter Einsatz auf „Websuche“ (17,38) weg, neuer Einsatz ≈ 17,99 s = Wortende 17,84 + 0,15 (Differenzfenster 17,9–18,1) | umgesetzt ✓ |
| STT Mischung, 12 Läufe | „Websuche“/„Web-Suche“ **7/12** (Lauf 1: 5/6, Lauf 2: 0/3, Lauf 3: 2/3), Rest „Websearch“; R1: 3/6. voice.mp3 allein 3/3 „Web-Suche“. Sonst wortgleich mit script.txt (bekannte STT-Formen „probiere“, „schicke“, Zahlen ausgeschrieben), „Vorsteuerabzug“ 12/12, kein „Tag“/„gestern“ | **nicht stabil** (Backlog) |
| Lautheit final | −14,0 LUFS, LRA 2,0 LU, True Peak −1,2 dBFS | ✓ |
| Lautheit handy | −14,1 LUFS, True Peak **−0,4 dBFS** | LUFS ✓; TP über der üblichen −1-dBTP-Marke, Risiko leichter Übersteuerung beim Plattform-Reencode; nicht hörbar, Hinweis |

Bewertung „Websuche“: Das SFX ist nicht mehr die Ursache (liegt jetzt nach dem Wort). Scribe kippt auf der Mischung weiter zufällig zu „Websearch“, auf der reinen Stimme nie → Rest kommt aus Musik/Mischung unter dem Wort. Für Zuschauer klingt das Wort deutsch (Stimme 3/3), daher kein K.-o., aber das Soll „6/6“ aus R1-03 ist nicht erfüllt.

## Kontaktbogen und Cover
- `kontaktbogen-2fps.jpg` (10×9 à 270×480, 0,0–44,0 s): zeigt Kopfzeile, „als Klein-/unternehmer“, 17,40 € ZURÜCK wie der Master; Zellen 2,0 / 24,0 / 31,0 / 33,5 Δ 2,3–3,7 zum Master-Frame (Skalierung), Abweichungen bei 27,5 / 38,0 nur Animationsphase. ✓
- `cover.jpg`: „Mit oder ohne Umsatzsteuer?“, Tafel mit Kopfzeile „Mit Vorsteuerabzug zahlt:“, Maskottchen ganz, HUD TAG 5, kein Name. Passt zum Master. ✓

## Noten je Kriterium
| Kriterium | R1 | R2 | Beleg / Abzug |
|---|---|---|---|
| Hook (0–6 s) | 9 | 9 | unverändert |
| Serienrahmen Nicht-Erstfolge | 9 | 9 | unverändert |
| Ton: Stimme, Tempo, Aussprache | 8 | 8 | SFX verschoben, aber „Websuche“ in der Mischung nur 7/12 |
| Musik + Lautheit | 9 | 9 | −14,0 / −14,1 LUFS; Hinweis Handy-TP −0,4 |
| Untertitel | 9 | 9 | Sync 33–38 s intakt, Pill-Überhang weg |
| **Text-Regeln / Lesbarkeit** | 7 | **9** | alle Ticket-Texte 62–67 px; Abzug: „MIT USt“ in der Tafel nur noch ≈ 60 px |
| Bildfluss / Maskottchen | 8 | 8 | kein K.-o.; offen aus R1-04: Hook-Abgang 1 Frame, HEUTE-Pill-Rest, Tafel bis 25,2 halb leer, graue Balken über „Erfinde nichts.“ |
| **Fakten / Board / Kette** | 7 | **9** | Bedingung 23,57–34,37 durchgehend sichtbar, 91,60 € nirgends ohne Bedingung |
| Anonymisierung | 9 | 9 | unverändert |
| CTA + Guide + Funnel | 9 | 9 | unverändert |
| Look vs. Folge 17/19 | 8 | 8 | Kopfzeile fügt sich in die Tafel; Gesicht weiter überstrahlt |
| Cover / Caption | 9 | 9 | passt |

**Scroller-Test (geänderte Stellen):** 24 s ohne Ton: „Mit Vorsteuerabzug zahlt: MIT USt 91,60 € / OHNE USt 109 €“ – Bedingung sofort lesbar. 31 s „+19 % EINKAUF als Kleinunternehmer“ auf dem Handy lesbar. 28 s „17,40 € ZURÜCK“ klar.

## Gesamtnote
**8,5 / 10** (Schnitt ≈ 8,75; kein Kriterium unter 8).

## Urteil
**Bestanden (Runde 2).** Kein K.-o. Blockierende Tickets R1-01 und R1-02 erledigt und nachgemessen, R1-04 (17,40 € / Pill) erledigt, R1-03 umgesetzt, aber ohne den gewünschten STT-Effekt. Keine Regression außerhalb der Tafel. Freigabe für den Slot 21:00.

## Tickets (nur Backlog, nicht blockierend)
```
TICKET final-R2-01 → firma-regie   (Backlog, nicht blockierend)
Kriterium: Ton · Note: 8/10
Beleg: 00:17,38–00:17,84 · final-r2/stt-final-mix.json, stt-final-mix-2.json, stt-final-mix-3.json, stt-voice.json
Problem: Trotz verschobenem Tipp-SFX hört Scribe in der Mischung „Websuche“ nur 7/12 (Rest „Websearch“), auf der reinen Stimme 3/3 richtig; die Ursache liegt in Musik/Mischung unter dem Wort.
Soll: In künftigen Folgen Musik unter englisch klingenden Komposita (Websuche o. ä.) ≥ 3 dB zusätzlich ducken oder das Wort im Skript eindeutschen („Suche im Netz“); STT der fertigen Mischung ≥ 5/6 richtig.
```
```
TICKET final-R2-02 → firma-design   (Backlog, nicht blockierend)
Kriterium: Musik + Lautheit / Text · Note: 9/10
Beleg: firma-tag20-final-handy.mp4 ebur128 · full_31.0.jpg („MIT USt“ y 471–516)
Problem: Handy-Fassung True Peak −0,4 dBFS (Master −1,2); durch die Kopfzeile ist „MIT USt“ in der Tafel auf 43 px Versal (≈ 60 px) geschrumpft.
Soll: Handy-Encode mit Limiter auf ≤ −1,0 dBTP; Tafel-Labels Ziel ≥ 46 px Versal (≥ 64 px Schrift) für Luft nach Handy-Skalierung.
```
Offen aus R1 (unverändert, Backlog): R1-04 Rest (Hook-Raum verschwindet in 1 Frame 0,87→0,90; HEUTE-Pill-Rest 15,67–15,83; Tafel rechts leer 23,57–25,2; graue Platzhalter-Balken über „Erfinde nichts.“ 40,1–41,4).
Hinweise: H3 Standbild 22,40–23,03 gewollt. H5 Caption-Schritt 2 „sinngemäß“ weiter optional. H6 Maskottchen-Gesicht überstrahlt (F16-R2-03).
