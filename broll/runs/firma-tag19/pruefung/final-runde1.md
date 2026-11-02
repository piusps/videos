# Prüfung final · Folge 19 „Stimmt die Versandzeile?“ · Runde 1 (Slot 2026-11-01 18:00)

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe final), 2026-11-01 ca. 14:55–15:30. Gemini/OpenRouter 402 → manuell Frame für Frame.
**Hinweis Chef:** Der Prüfer konnte diese Datei nicht selbst schreiben (Festplatte voll, ENOSPC gegen 15:30). Inhalt unten vom Chef wörtlich aus der Antwort des Prüfers übernommen, nichts geändert. Belege: `pruefung/final-r1/` (full-4fps-01…08.jpg, 14 × t30-*.jpg, 26 × full_*.png, hook-mask-f26-34.jpg, mask-35.03-kopf.jpg, final-audio.mp3, stt-final-mix.json).
Wegen voller Platte nicht selbst geprüft: Musik/Stimme-Abstand je Akt (aus regie/gap-final.txt übernommen, 18,6–26,3 dB), SSIM Handy vs. Master, automatischer Guide-Abgleich gegen briefe-text.txt (gelesen, nichts gefunden), Bibel-Zeile 19 (Desktop-Datei Zeitüberschreitung), kontaktbogen-2fps.jpg.

## Messwerte
| Punkt | Ergebnis |
|---|---|
| Länge | 45,267 s, Master und Handy gleich |
| Lautheit | Master −14,0 LUFS (TP −1,2 dBFS), Handy −14,1 LUFS |
| STT finale Mischung (scribe_v1) | wortgleich mit script.txt (nur übliche Formen „probiere“, „schicke“); kein „Tag“, kein „gestern“; kein Liedtext erkennbar |
| Musik | GONE ab 276,95 s am Stück, im Tagesfenster, Explizit-Check 3× 0 (Regie) |
| Untertitel-Sync | ≤ 0,07 s |
| Caption | 2039 Zeichen (< 2100), Serienstandard-Ende |
| replies.json | 6 Antworten, keine Emojis, jede endet mit leichter Frage |
| format.json | {"format":"PTC"} |

Maskottchen: kein K.-o.; Einschübe 10,6–15,1 s ganz sichtbar; Pills kurz auf Kopfoberseite 0,93–1,07 s (≈ 1/5) und 35,03–35,10 s (≈ 1/4), Augen immer frei.
Fakten gegen LAUF.md: Lieferzeit nirgends, 18,32 € nur Caption mit Bedingung, 4,49 € nirgends, „nur Dollar“ immer eingegrenzt („im Lauf: Versandseite“, gesprochen „nennt ihr“), Briefbeträge nie als Printful-Preise, CTA-Board Stand nach der Folge (5ER OFFEN, UST ?).
Anonymisierung: Empfängerblock/Website geschwärzt, keine Sidebar, keine Verletzung.
CTA/Guide/Funnel: Guide deckt „Prompt … in zehn Minuten prüfst du deine Versandzeile“, alle 6 Abnahmepunkte aus prompt-fuer-kommentare.md erfüllt, „Folg @pickthecompany“ genau einmal.
Cover: „Stimmt die Versandzeile?“ klar, Tag nur im HUD-Badge.

## K.-o.-Liste
Kein K.-o. verletzt.

## Noten je Kriterium
| Kriterium | Note |
|---|---|
| Hook | 9 |
| Serienrahmen Nicht-Erstfolge | 9 |
| Ton | 9 |
| Musik + Lautheit | 9 |
| Untertitel | 9 |
| Text-Regeln / Lesbarkeit | 8 |
| Bildfluss / Maskottchen | 8 |
| Fakten / Board / Kette | 9 |
| Anonymisierung | 9 |
| CTA + Guide + Funnel | 9 |
| Look | 8 |
| Cover / Caption | 9 |

## Hinweise aus design-runde2-kurz.md
H1 Platzhalterbalken DM-Karte 40,73–41,75 s (Backlog) · H2 Gesicht überstrahlt 10,5–38,4 s (Backlog) · H4 STEUER-Panel + Fragekarte doppelt (nicht blockierend) · H5 Pill auf Kopfoberseite (Backlog) · Doppelstrich 11,20 bestätigt, Ziffern oben angeschnitten (Ticket R1-02).

## Gesamtnote
**8,5 / 10** – kein K.-o., kein Kriterium unter 8.

## Urteil
**Bestanden (Runde 1).** Freigabe für Slot 18:00.

## Tickets (alle Backlog an firma-design, nicht blockierend)
- final-R1-01 (Look 8): Panels > 1 s mit > 50 % Leerfläche (Ergebnis 20,53–21,70, Offen 27,83–28,97, Fragekarte 35,03–38,37). Soll: Inhalt ≥ 60 % des Panels oder Panel kleiner.
- final-R1-02 (Text/Look 8): Warum-Panel 23,3–27,8 s: Beträge oben angeschnitten, 11,20 doppelt/5,20 einfach gestrichen. Soll: ≥ 8 px Abstand oben, gleiche Streichung.
- final-R1-03 (CTA/Bildfluss): Platzhalterbalken DM-Karte; Pills auf dem Kopf f28–32, f1051–1053. Soll: Ergebnis-Block ≤ 0,3 s nach DM-Karte; Pill-Unterkante immer über Kopfoberkante (captionY Hook ~40 px höher).
- final-R1-04 (Cover 9): leeres oranges Pill über dem Brief-Panel (y ≈ 545). Soll: entfernen oder füllen (Engine-Bestand, auch F17-Cover).
Für den Chef: briefing.md/musik.txt nennen noch Slot 12:00.
