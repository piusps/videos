# Rückblick Folge 12 „Betriebe“ · 2026-10-30 · Serientag 3

**Ergebnis:** finale Note 8/10 (Runde 2, `pruefung/final-runde2.md`; Runde 1: 7,5). Eingeplant 2026-10-30 21:00 Europe/Berlin, Zernio-Post 6ae4aa71fb5c3396354861fd, Funnel über zernio-golive-arm (PID 2119).
Slot wechselte im Lauf des Tages: 18:00 → 21:00 → 18:00 → 21:00 (verpasster 15-Uhr-Slot). Bedingung „Folge 11 eingeplant“ war erfüllt (Folge 11 um 18:00, `runs/firma-tag11/publish.json`).

## Wo es Tickets gab
| Stufe | Runden | Kern |
|---|---|---|
| Autor | 3 Prüfrunden (4 Fassungen inkl. Chef-Rückgabe) | 100-Wort-Grenze: Weg-Satz, Haken, „zwanzig … in Chemnitz“, CTA-Formel verdrängten sich gegenseitig. R1: Weg-Satz ohne Verb, Grund 2 klang wie Regel für alle, „Wunschkunden“ nicht lieferbar, Chemnitz fehlte. Chef holte Haken + Zahl/Ort zurück, R2 lieferte die konkrete Fassung. Bestanden 8,5. |
| Regie | 0 (keine eigene Prüfrunde) | Plante eine 8-Wort-Region-Karte → wurde Design-K.-o. |
| Design (Stills) | 3 | R1: Region-Karte 8 Wörter (K.-o.), Stempel verdeckt Haken-Zellen, leere Karte, Claude-Fenster zu schwarz, Board „IN ARBEIT“. R2: Plan unter der Region-Karte sichtbar, Fenster bei 18,5/19,5 s noch leer. R3 bestanden (alle 8). |
| Final | 2 | R1 7,5: fast leeres Bild 33,2–34,5 s (Übergabe-Karte zu spät), Plan-Fragment/Plan-Blitz 13,2–16 s. R2 8/10. |

## Ursachen und Regeln (eingetragen)
- **firma-autor:** Wortbudget vor dem Schreiben verteilen, Pflichtteile nie zum Lösen eines Tickets streichen; Ein-Betrieb-Gründe markieren; „Teamgröße“ statt „Größe“; CTA-Ergebnis nur Lieferbares.
- **firma-regie:** Karten im Plan schon ≤ 4 Wörter, Quellenzeilen nur Caption/Guide; Pause nach „Claude:“ roh lassen (sonst „Websearch“).
- **firma-design:** Übergabe-Akt auf `Als-0.15`; Karten über dem Plan als hohe Varianten bei y −60 unter dem HUD; 10-fps-Streifen an jedem Akt-Übergang vor dem vollen Render; Claude-Weg aus echten Crops fensterfüllend setzen.

## Für Pius / Backlog
- Engine: claudeShot-fit-Option, Plan-Ausblendung in der Heute-Einstellung, CTA-Akt dimmt den Plan fast unsichtbar (Folge 11 ließ ihn stehen), roter Rahmen blitzt 1–2 Frames bei 13,17 s und 14,53 s.
- Musik: laut Regie ist heute kein freier GONE-Abschnitt ≥ 45,6 s mehr übrig (nur 108,5–153,15 s = 44,65 s); Folge 13 braucht einen Abschnitt vom Vortag oder ≤ 44,65 s.
- Funnel: ~20 min nach 21:00 `runs/firma-tag12/golive-arm.log` / `golive.log` prüfen.
