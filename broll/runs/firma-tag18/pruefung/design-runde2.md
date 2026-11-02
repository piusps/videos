# Prüfung DESIGN · Folge 18 · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer, Stufe design), 2026-11-01. Nichts geändert außer diesem Bericht + Belegen in `pruefung/design-r2/`.
Prüfling: `firma-tag18-final.mp4` (12:45). Maßstab: Folge 17 final R2 (`firma-tag17-final.mp4`, Vergleich `b-ref-0.8-f17.jpg`).
Gemini nicht genutzt (402 laut Auftrag) → manuell: 10-fps-Durchgang ganzes Video (`s10-00…11.jpg`, Einzelbilder `f10/`), 30-fps-Streifen ±0,4 s an allen Akt-Übergängen (`s30-<t>.jpg`, `s30-uebergaenge-7-16.jpg`), Vollbilder `full/`, Detail-Montagen `b-*.jpg`.

## Ticket-Nachprüfung Runde 1

| Ticket | Ergebnis | Beleg |
|---|---|---|
| R1-01 Badge „5ER OFFEN“ | ✓ unter dem Board (y≈1240), alle 9 Feldnummern/-titel frei; liegt auf der Kopf-Oberkante, Augen frei. **Neu:** Badge (+ Flieger) bleibt 2 Frames über dem Endkarten-Panel stehen (39,967–40,000) → Ticket R2-02 | `b-38.5-39.8-42.0.jpg`, `b-39.95-badge-misch.jpg`, `s30-39.95.jpg` |
| R1-02 Hook-Karte | ✓ letzter Hook-Frame 4,867, ab 4,900 Board + Maskottchen, kein Mischframe | `s30-4.95.jpg` |
| R1-03 zwei Blöcke 33,9 | ✓ Frage-Karte pop 33,90, „Versand: zzgl.“ erst 35,20 (1,3 s). Klein: 35,43–35,57 graue Doppelkante unter der Versand-Karte | `s30-33.9.jpg`, `s30-35.22.jpg`, `b-35.5-versand.jpg` |
| R1-04 Ränder/Überlappung | teils: WARUM-Pill ganz frei ✓ (`b-31.0-warum.jpg`); Claude-Text ≥ 40 px Innenabstand ✓ (`b-21.5-fenster.jpg`); Versand-Karte nicht mehr unter HUD ✓. **Offen:** Endkarte 40,0–44,5 reicht bis ~5 px an beide Bildränder (ep.py Z. 74: letztes `cta-3.png` mit Breite **1080**, nicht 1040) und ihre oberen Ecken liegen unter TAG-Badge und HUD-Kachel → Ticket R2-03 | `b-endkarte-raender-42.0-44.3.jpg`, `full/t42.0.jpg` |
| R1-06 Licht | besser, Augen klare Rechtecke, Orange an den Rändern sichtbar; heller Spot mitten im Gesicht bleibt (16–37 s), aber auf F17-Niveau (F17 27,5 s gleich) → kein Ticket | `b-licht-9.0-27.5-31.0.jpg`, `b-ref-0.8-f17.jpg` |
| R1-07 Fensterrahmen | ✓ 19,700 harter Schnitt, Kopfzeile „✳ Claude“ bleibt, kein Doppelrahmen. **Regression:** 23,300–23,333 zwei Fensterrahmen übereinander (Claude-Fenster bleibt hinter dem Ergebnis-Rahmen) → Ticket R2-01 | `s30-19.8.jpg`, `s30-23.39.jpg`, `b-23.30-23.37-doppelrahmen.jpg` |
| R1-05 Brief | unverändert (dunkle Balken), Note 8 wie R1 | `s10-03.jpg` |

## Noten je Kriterium

| Kriterium | Note | Beleg |
|---|---|---|
| Seite an Seite mit Referenz | **8** | Licht auf F17-Niveau; Hook/Slam unverändert stark. Leere Flächen Heute 14,0–15,4 und Endkarte 40,0–41,3 (Backlog) | `b-licht-…`, `s10-03`, `s10-10` |
| Lesbarkeit | **7,5** | Board/WARUM/Claude-Text gelöst; Endkarte randnah + Ecken unter HUD (R2-03) | `b-endkarte-raender…` |
| Keine leere Karte / Platzhalter / Fantasie-UI | **8** | wie R1 (Brief-Balken), Kopfzeile Claude jetzt durchgehend | `s30-19.8.jpg` |
| Bewegung / Schnitte | **6** | zwei neue Mischframes: 23,300–23,333 Doppelrahmen; 39,967–40,000 Badge + Flieger über Endkarte. Untertitel springt 40,9 weiterhin von Mundhöhe über den Kopf (`s10-10.jpg`) | `b-23.30…`, `b-39.95…` |
| Backlog-Upgrade | **8** | D-24 (fensterfüllender Anhang) + neue Engine-Option `ringLight` | `s10-04.jpg` |
| K.-o. design (Logo / Text ≠ Stimme) | ok | — | — |

**Durchschnitt 7,6 · niedrigste Note 6.**

## K.-o.-Liste

| Punkt | Ergebnis | Beleg |
|---|---|---|
| Maskottchen ≤ 1/3 verdeckt, Augen frei, keine Untertitel auf Augen | ✓ (knapp): CTA 37,2–39,9 Badge auf Kopf-Oberkante + Untertitel auf Wangen/Mund ≈ 30 %, Augen frei; Flieger 39,6–39,97 zwischen den Augen, nicht darauf; 17–23 s zweite Untertitelzeile + „?“ berühren Kopfoberkante, Augen frei; Endkarte Untertitel unter den Augen | `b-38.5-39.8-42.0.jpg`, `b-18.5-20.6-21.5-unten.jpg` |
| Ein neuer Textblock gleichzeitig | **✗ (knapp, in R1 übersehen)** 37,20–37,30: Titel „KOMMENTIERE“ wächst und Badge „5ER OFFEN“ poppt im selben Moment (37,233), Kommentarfeld 0,1 s später | `s30-37.3.jpg` |
| Texte ≥ 58 px | ✓ aussagende Texte; klein nur Fenster-Chrome („Claude“, „gesendet“, „IN ARBEIT“) wie F17 | `b-21.5-fenster.jpg` |
| Mischframes an Akt-Übergängen | **✗** 23,30–23,33 (Doppelrahmen), 39,967–40,000 (Badge über Endkarte). Sauber: 4,90 / 7,07 / 11,93 / 13,90 / 16,00 / 19,70 / 26,60 / 33,90 / 37,17 | `s30-*.jpg` |
| Nur „17 €“ (kein 17,15 / 5,75) | ✓ | ganzes Video |

## Gesamturteil
**Nicht bestanden.** Note **6/10** (Schnitte 6, Lesbarkeit 7,5); K.-o. Mischframes verletzt (zwei neue, je 2 Frames), K.-o. ein Textblock knapp verletzt (CTA-Einstieg). R1-01/02/03/06/07 im Kern gelöst.

## Tickets

```
TICKET design-R2-01 → firma-design
Kriterium: Bewegung/Schnitte (K.-o. Mischframe) · Note: 6/10
Beleg: 0:23,300–0:23,333 · pruefung/design-r2/b-23.30-23.37-doppelrahmen.jpg, s30-23.39.jpg
Problem: Beim Schnitt Claude-Ergebnis → Preisbild steht das alte Claude-Fenster 2 Frames hinter dem neuen Rahmen (doppelte Ränder links/oben/rechts).
Soll: Im 30-fps-Streifen 23,0–23,6 s genau ein Fensterrahmen pro Frame; alter Rahmen weg auf demselben Frame, auf dem der neue erscheint.
```
```
TICKET design-R2-02 → firma-design
Kriterium: Bewegung/Schnitte (K.-o. Mischframe) · Note: 6/10
Beleg: 0:39,967–0:40,000 · pruefung/design-r2/b-39.95-badge-misch.jpg (ep.py Z. 72/80 Badge „to“ Rechenweg+8.95 vs. Panel-Schnitt Rechenweg-0.05)
Problem: Badge „5ER OFFEN“ und Papierflieger stehen 2 Frames über dem schon geschnittenen Endkarten-Panel.
Soll: Badge und Flieger verschwinden auf genau dem Frame des Panel-Schnitts; im Streifen 39,8–40,2 kein Frame mit Badge + Endkarte.
```
```
TICKET design-R2-03 → firma-design
Kriterium: Lesbarkeit (angeschnitten/überdeckt) · Note: 7,5/10
Beleg: 0:40,0–0:44,5 · pruefung/design-r2/b-endkarte-raender-42.0-44.3.jpg, full/t42.0.jpg (ep.py Z. 74 cut("cta-3.png", …, 1080, …))
Problem: Endkarten-Panel reicht bis ~5 px an beide Bildränder (letzter Abschnitt 1080 breit statt 1040) und seine oberen Ecken liegen unter TAG-Badge und HUD-Kachel.
Soll: Alle CTA-Abschnitte 1040 breit mit ≥ 20 px Rand links/rechts; Panel-Oberkante unter der HUD-Unterkante (oder Ecken frei), in jedem Frame 40,0–44,5.
```
```
TICKET design-R2-04 → firma-design
Kriterium: Ein neuer Textblock gleichzeitig · Note: 7,5/10
Beleg: 0:37,20–0:37,43 · pruefung/design-r2/s30-37.3.jpg (ep.py Z. 72 Badge at "Kommentiere-0.65")
Problem: „KOMMENTIERE“, Badge „5ER OFFEN“ und Kommentarfeld erscheinen innerhalb 0,25 s.
Soll: Badge entweder schon mit dem Board im Recap stehend (vor dem CTA-Titel) oder ≥ 1,2 s nach „KOMMENTIERE“; nie zwei neue Textblöcke innerhalb 1,2 s.
```
Hinweise ohne Ticket: 35,43–35,57 dünne graue Doppelkante unter der Karte „Versand: zzgl.“ (`b-35.5-versand.jpg`); Untertitel-Sprung 40,9 s (Mundhöhe → über Kopf) aus R1 weiter offen.
