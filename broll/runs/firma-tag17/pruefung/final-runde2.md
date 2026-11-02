# Prüfung final · Folge 17 „Was kostet der Versand der Shirts?“ · Runde 2 (Slot 2026-10-31 21:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-10-31. Nichts geändert (nur Belege in `pruefung/final-r2/` angelegt).
Gemini/OpenRouter nicht genutzt (402) → manuell Frame für Frame + Pixelmessung (Python/PIL). ffmpeg nur `broll/node_modules/ffmpeg-static` + `@ffprobe-installer`.
Prüflinge (Stand 15:25): `firma-tag17-final.mp4` (44,560 s, 1080×1920, 30 fps, h264 9,7 Mbit/s, AAC 48 kHz), `firma-tag17-final-handy.mp4` (44,566 s, 1,76 Mbit/s), `kontaktbogen-2fps.jpg`.
Grundlage: `final-runde1.md` (7,5; blockierend R1-01/02/03). Laut Auftrag war der Rest in R1 abnahmefähig. Hier geprüft: Ticket-Stellen, Schnitte, Regressionen, Maskottchen über das ganze Video, Fakten an den geänderten Stellen, Ton, Lautheit.

## Belege (`pruefung/final-r2/`)
- `full-4fps-01…08.jpg`: ganzes Video lückenlos mit 4 fps
- 30-fps-Streifen: `t30-6.80` (SHIRTS-Karte kommt), `t30-10.55` (Schnitt 10,66), `t30-16.25` (Schnitt 16,4), `t30-17.47` (Datei-Karte, Stufe 17,6), `t30-18.47` (Datei → Schritte), `t30-19.27` (Schritte → Quellen), `t30-20.43` (Quellen → Uhr); Sammelbilder `tr-a.jpg`, `tr-b.jpg`
- Vollbilder `full_<s>.png` (0,0 / 5,5 / 8,0 / 8,5 / 10,0 / 10,6 / 10,7 / 12,0 / 15,0 / 16,5 / 17,5 / 18,3 / 19,0 / 19,5 / 20,3 / 22,0 / 26,5 / 28,9 / 29,5 / 30,2 / 31,0 / 34,0 / 38,5 / 41,5 / 44,0)

## Regression gegen R1 (Mittelwert-Pixeldifferenz gleicher Zeitpunkte, R1-Vollbilder vs. R2)
| Zeit | Δ | Urteil |
|---|---|---|
| 0,0 / 5,5 / 12,0 / 15,0 / 22,0 / 26,5 / 31,0 / 34,0 / 38,5 / 41,5 / 44,0 | 0,0–0,6 | unverändert (nur Encode-Rauschen) ✓ |
| 8,0 | 20,7 | gewollt: neue SHIRTS-Karte (R1-01) |
| 16,5 / 19,0 / 19,5 | 4,1–5,5 | gewollt: Claude-Fenster vergrößert (R1-02) |
| 28,9 | 5,9 | gewollt: Zitat entfernt (R1-03) |

Keine ungewollte Änderung außerhalb der Ticket-Stellen. Kontaktbogen-2fps deckt sich mit dem Master. Handy-Fassung: SSIM zum Master 0,9955 (5 fps) ✓. blackdetect/freezedetect (≥ 0,6 s): 0 Treffer (Standbilder im Claude-Fenster ≤ 1,2 s, mit Licht-Sweep).

## Ticket-Stellen – Pixelmessung (Versalhöhe an 1080×1920, Schriftgröße ≈ Versalhöhe / 0,72 wie in R1)
| Ticket | Text | Zeit | Messung | ≈ Schrift | Soll ≥ 58 | Urteil |
|---|---|---|---|---|---|---|
| R1-01 | „SHIRTS MIT LOGO“ (neue Overlay-Karte) | 6,93–10,63 | „S“ 59 px, „M“ 58 px (`full_8.5.png`); Karte steht statisch (Δ 0,0 über alle Frames 6,9–10,6) | ≈ 81 | ✓ | **erledigt** (R1 ≈ 50, F16 ≈ 60 Versal) |
| R1-02 | Datei-Karte „Kolonnenshirt_ Serienbriefe.docx“ | 16,37–17,57 / 17,60–18,57 | „K“ 58 px / 60 px | ≈ 81–83 | ✓ | **erledigt** |
| R1-02 | „Eine Datei geteilt, / das Web durchsucht / und 5 weitere Schritte“ | 18,60–19,37 | „E“ 44 px, „S“ (Schritte) 44 px | ≈ 61 | ✓ (knapp über Soll, Versal ≥ 42) | **erledigt** |
| R1-02 | „Sources:“ / „Printful – Shipping Speeds & Pricing“ | 19,40–20,53 | „S“ 45 px, „P“ 44 px | ≈ 61–62 | ✓ | **erledigt** |
| R1-03 | Lauf-Zitat „Das kann ich nicht sicher beantworten.“ | 28,7–30,3 | nicht mehr im Bild (`full_28.9`, `full_29.5`, `full-4fps-05/06`) | – | ✓ (Soll „weg“) | **erledigt** |

R1-02 im Detail: Die Zeilen wuchsen von ≈ 38–40 px auf 44–45 px Versalhöhe (≈ +12–15 % gemessen, nicht +30 %), erreichen damit aber ≈ 61 px Schrift und erfüllen das Soll (≥ 58 px Schrift / ≥ 42 px Versal). Die Datei-Karte liegt mit ≈ 81 px deutlich drüber. Der Umbruch „Serienbriefe.do / cx“ ist echt (Original-Anhangkarte aus `design/lauf/01-prompt-mit-anhang.png`), also kein Fehler.

## 30-fps-Streifen an geänderten Stellen und Schnitten
| Stelle | Befund | Urteil |
|---|---|---|
| 6,90→6,933 | SHIRTS-Karte steht in **einem Frame** voll da (kein Einflug/Scale-in), während „KI verkauft“ läuft | ok, H1 (harter Pop) |
| 10,633→10,667 (Schnitt gesäubert) | Board+Karte → Briefe im selben Frame, der leere Frame aus R1 ist weg; Pill „Bestellung“ läuft 1 Frame im Brief-Bild weiter | ✓ sauber |
| 16,333→16,367 (Schnitt gesäubert) | HEUTE-Karte schrumpft 16,27–16,33 heraus, harter Schnitt auf Claude-Fenster, Pill „den Shirt-Versand“ hält 2 Frames, „Claude“ ab 16,43 | ✓ sauber |
| 17,567→17,600 | Datei-Karte springt in einem Frame um ≈ 3 % größer und ≈ 10 px nach oben (zweite Push-in-Stufe ohne Übergang) | ok, H2 (kleiner Ruck, auf dem Handy kaum sichtbar) |
| 18,567→18,600 | Datei-Karte → Schritte-Zeile, harter Schnitt im selben Frame wie „Websuche“ | ✓ |
| 19,367→19,400 | Schritte → Quellen, harter Schnitt, kein Doppelbild | ✓ |
| 20,533→20,567 | Quellen → Uhr, harter Schnitt, kein Doppelbild | ✓ |

Frame-Differenz-Scan über das ganze Video (30 fps): außer den bekannten Schnitten und Animationen keine neuen Sprünge. Die R1-Backlog-Stellen (1,07; 4,90–5,00; 33,0–33,1; 39,93) unverändert, wie angekündigt.

## Maskottchen-Durchgang (ganzes Video; ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf den Augen)
| Zeit | Zustand | Urteil |
|---|---|---|
| 0,0–1,07 | steigt auf, ganz sichtbar, Pill auf der Stirn halbtransparent, Augen frei | ok (wie R1) |
| 1,10–4,87 | ganz weg | ok |
| 4,90–6,13 | ganz sichtbar, Pill auf Kopfoberkante | ok |
| 6,17–10,63 | Halbprofil unten rechts ganz im Bild; **neue SHIRTS-Karte endet bei y ≈ 1335, Maskottchen beginnt bei y ≈ 1450 → keine Überdeckung** (`full_8.5.png`) | ok |
| 10,67–16,33 | Vollbild-Einschub Briefe/Heute, Maskottchen klein unten rechts wie R1 (Bild unverändert, Δ 0,3–0,4) | ok |
| 16,37–20,53 | **vergrößertes Claude-Fenster endet bei y ≈ 1235; Maskottchen ganz sichtbar** unten rechts (Füße bei y ≈ 1840), Pills „Websuche bei Printful“ + „?“-Blase über dem Kopf, Augen frei (`full_17.5`, `full_19.0`, `full_20.3`) | ok |
| 20,57–24,73 | ganz sichtbar unter dem Fenster | ok (unverändert) |
| 24,77–32,97 | ganz unter dem Panel | ok (unverändert) |
| 33,0–36,97 | klein unten rechts ganz sichtbar | ok (unverändert) |
| 37,07–44,56 | CTA groß, Untertitel auf Mund/Unterkörper ≈ 25–30 %, Augen frei; Flieger streift 39,78–39,85 das Auge (R1-04 Backlog) | ok (unverändert, knapp) |

**Kein Maskottchen-K.-o.** Die beiden vergrößerten Elemente (SHIRTS-Karte, Claude-Fenster) berühren das Maskottchen nicht.

## Fakten an den geänderten Stellen
| Prüfpunkt | Befund | Urteil |
|---|---|---|
| Keine Beträge im Claude-Fenster | 16,4–20,5 sichtbar nur: Datei-Karte (Name + „DOCX“), Schritte-Zeile, „Sources:“ + Quelle 1 „Printful – Shipping Speeds & Pricing“. Erste Zeile oben und übrige Quellen unscharf, nicht lesbar (`full_19.0`, `full_20.3`) | ✓ |
| Kein Printful-Preis | keine Euro-/Dollar-Zahl, kein Printful-Logo; Screenshots 03/09 nicht im Bild | ✓ |
| SHIRTS MIT LOGO | deckt „verkauft Shirts mit Logo“ (Sprechtext 7,0–8,5) | ✓ |
| Zitat entfernt | Aussage trägt der Sprechtext „Ohne Einkaufspreis weiß sie nicht …“ + Karte EINKAUFSPREIS FEHLT (unverändert) | ✓ |
| Datenschutz Claude-Fenster | nur Kopf „Claude“, keine Sidebar/Chatliste/Namen | ✓ |

## Ton
| Punkt | Wert | Soll |
|---|---|---|
| Vergleich mit R1-Mischung (`final-r1/final-audio.mp3`) | Versatz 0 Samples, Korrelation 0,9997, schlechteste Sekunde 0,9991 (MP3-Kodierung) | unverändert ✓ |
| Handy vs. Master | Korrelation 0,9995, Rest −29,6 dB | ✓ |
| STT | nicht neu gelaufen; Tonspur identisch mit R1 → R1-STT (wortgleich mit script.txt, kein „Tag“) gilt | ✓ |
| Lautheit final / handy | −14,0 / −14,1 LUFS, LRA 2,3 LU, True Peak −1,2 dBFS | −14 ±0,5 ✓ |

## Noten je Kriterium
| Kriterium | R1 | R2 | Beleg / Abzug |
|---|---|---|---|
| Hook (0–6 s) | 9 | 9 | unverändert |
| Serienrahmen Nicht-Erstfolge | 9 | 9 | unverändert |
| Ton: Stimme, Tempo, Aussprache | 9 | 9 | Tonspur identisch |
| Musik + Lautheit | 9 | 9 | −14,0 LUFS |
| Untertitel | 9 | 9 | unverändert, Pills über den neuen Elementen frei |
| **Text-Regeln / Lesbarkeit** | 7 | **8** | alle drei Tickets erfüllt (SHIRTS ≈ 81, Datei-Karte ≈ 81–83, Fenster-Zeilen ≈ 61–62, Zitat weg); Abzug: Fenster-Zeilen nur knapp über Soll, Chip „gesendet“ ≈ 40 px (R1-05 Backlog), Board-Feldtexte Engine-Bestand |
| Bildfluss / Maskottchen | 8 | 8 | Schnitte 10,66 und 16,4 jetzt sauber; neu: SHIRTS-Karte poppt in 1 Frame, 1-Frame-Ruck 17,60; R1-04-Stellen offen |
| Fakten / Board / Kette | 9 | 9 | keine Beträge, kein Printful-Preis |
| Anonymisierung | 9 | 9 | sauber |
| CTA + Guide + Funnel | 9 | 9 | unverändert |
| Look vs. Folge 13/16 | 8 | 8 | Claude-Fenster füllt die Fläche jetzt besser (R1-Abzug „eine Karte auf viel Leerfläche“ erledigt); Maskottchen-Gesicht weiter überstrahlt |
| Cover / Caption | 9 | 9 | unverändert |

**Scroller-Test (geänderte Stellen):** 8 s SHIRTS MIT LOGO auf dem Handy sofort lesbar; 17 s Datei-Karte groß; 19 s „das Web durchsucht“ orange markiert und lesbar; 20 s Printful-Quelle lesbar.

## Gesamtnote
**8,5 / 10** (Schnitt ≈ 8,8; kein Kriterium unter 8).

## Urteil
**Bestanden (Runde 2).** Kein K.-o. Die blockierenden Tickets R1-01, R1-02 und R1-03 sind erledigt und nachgemessen. Keine Regression außerhalb der Ticket-Stellen, Ton unverändert, Lautheit im Ziel. Freigabe für den Slot 21:00.

## Tickets (nur Backlog, nicht blockierend)
```
TICKET final-R2-01 → firma-design   (Backlog, nicht blockierend)
Kriterium: Bildfluss · Note: 8/10
Beleg: 00:06,90→00:06,933 (t30-6.80.jpg) · 00:17,567→00:17,600 (t30-17.47.jpg)
Problem: Neue SHIRTS-Karte steht in einem Frame voll da ohne Einflug; Datei-Karte springt bei 17,60 in einem Frame um ≈ 3 % (zweite Push-in-Stufe ohne Übergang).
Soll: Overlay-Karten mit ≥ 6 Frames Scale-/Slide-in wie die übrigen Karten; Push-in im Claude-Fenster stetig (Keyframe-Easing) statt Stufe.
```
Offen aus R1 (unverändert, Backlog): **R1-04** (Hook-Abgang 1 Frame, Mischframes 4,90–5,00, Stempel hinter Panel, CTA-Panel halb leer 39,93–41,23, Flieger übers Auge), **R1-05** (Chip „gesendet“ ≈ 40 px).
Hinweise: H1 Fenster-Zeilen liegen mit ≈ 61 px nur knapp über 58 – in künftigen Folgen Ziel ≥ 64 px setzen, damit Encode/Handy-Skalierung Luft hat. H2 Maskottchen-Gesicht weiter überstrahlt (F16-R2-03). H3/H4 aus R1 (Wort „netto“, Caption-Schritt 2 „sinngemäß“) weiter optional.
