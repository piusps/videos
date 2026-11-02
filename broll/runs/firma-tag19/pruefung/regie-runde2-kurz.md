# Prüfung Regie · Folge 19 „Stimmt die Versandzeile?“ · Runde 2 (Kurzprüfung) · 2026-11-01

Prüfer: firma-pruefer (frisch, nicht Ersteller). Geprüft: beats.json gegen regie/beats-r1.json (Diff), Abschnitt „Änderungen Runde 2“ in regieplan.md, Anker gegengerechnet mit words.json (alle Karten-, SFX-, Event- und Beat-Start-Anker aufgelöst, Format Wort[@Zeit][:end][±Offset]).

## Diff r1 → r2 (vollständig)
Nur: slot 12:00 → 18:00; B01 „bild“ + „brief.hinweis“; B09 wort_start; B12 „bild“ + Karte NUR DOLLAR ohne „vs“; B14 „bild“ + SFX tick + events; B15 „bild“ + SFX popLo + events. Sonst nichts verändert. JSON gültig (json.load ok).

## Tickets
| Ticket | Befund | Note |
|---|---|---|
| regie-R1-01 (B01 Frame 0 ≤ 12 lesbare Wörter außer Hook-Frage) | Erfüllt. „bild“ und „brief.hinweis“ legen fest: alte Zeile nur „11,20 € · 5,20 €“ scharf durchgestrichen, Rest weich; neue Zeile „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ (8 W.). Zusammen ca. 10–12 lesbare Wörter. Stempel KEIN BELEG erst ab B10. | 9 |
| regie-R1-02 (keine Lücke > 1,5 s zwischen 6,17 und 43,95) | B14/B15 erfüllt: neue Ereignisse 34,18 s (Umsatzsteuer-Status+0.85, Status-Start 33,33) und 37,58 s (Umsatzsteuer@36.8+0.7, Wort 36,88); größte Lücke dort jetzt 0,97 s. **Globales Soll aber nicht erfüllt**, und die Aussage in regieplan.md Z. 81 („Keine Lücke > 1,5 s zwischen 6,17 und 43,95“) stimmt nicht: B05 „verkauft“ 7,09 → „Betriebe@8.6“ 8,67 = **1,58 s**; B07 „Einkaufspreis@11.4“ 11,45 → nächstes Ereignis „Heute-0.1“ 13,00 = **1,55 s** (bis zum Bildwechsel B08 13,10 = 1,65 s). Ende: Versandzeile 43,28 → Endkarte 43,95 = 0,67 s, ok. | 7 |
| regie-R1-03 (B12 ohne Gegenwert, Unterzeile bleibt) | Erfüllt. „vs“: „€-Preis: kein Beleg“ gestrichen, „unter“: „im Lauf: Versandseite“ bleibt; Shot-03 „nur_dollar“ nur weiche Textur mit Marker, Briefzeile abgedunkelt, ≤ 12 neue Wörter festgeschrieben. Karte 2 „UMRECHNEN = GERATEN“ unverändert (nicht Teil des Tickets). | 9 |
| regie-R1-04 (alle Beats außer B01 mit Wort + after) | Erfüllt. B02–B16 alle mit Wort + after; jeder löst auf den Beat-Start auf (Abweichung ≤ 0,01 s), außer B09: „Claude“ ab 15,0 = 15,26 s, „von“ 15,41 (= Karte Claude+0.15). Entspricht wörtlich dem Ticket-Soll; Design soll B09 auf Claude+0.15 starten (Hinweis, kein Ticket). | 9 |
| Nichts verschlechtert | Keine Änderung außerhalb der Ticket-Felder und Slot; JSON gültig; Stimme, words.json, Musik unberührt laut regieplan. | 10 |

K.-o.: keins verletzt.

## Gesamtnote
**8,8/10** (Mittel), aber regie-R1-02 bei 7 → **nicht bestanden**.

## Ticket

TICKET regie-R2-01 → firma-regie
Kriterium: kein Beat > 1,5 s ohne sichtbare Änderung · Note: 7/10
Beleg: beats.json B05 (Karte „verkauft“ 7,09 → SFX/Bild „Betriebe@8.6“ 8,67 = 1,58 s); B07 (Stempel „Einkaufspreis@11.4“ 11,45 → „Heute-0.1“ 13,00 = 1,55 s); regieplan.md Z. 81 behauptet das Gegenteil
Problem: zwei Restlücken knapp über 1,5 s im Rückblick, die Runde 1 nicht benannt hat, die das Ticket-Soll aber einschließt.
Soll: B05 Handwerker-Silhouetten (Bild + SFX tick) auf „kleine@8.3“ (8,38 s) statt „Betriebe@8.6“, oder zusätzliches Ereignis bei „Logo“ (7,98 s); B07 zusätzliches verankertes Ereignis auf „fehlt@12.1“ (12,17 s, z. B. leeres Preisschild wackelt, kein neuer Text, SFX leise). Danach keine Lücke > 1,5 s zwischen 6,17 und 43,95 (nachrechenbar aus words.json); Satz in regieplan.md Z. 81 entsprechend korrekt.

Runde 3 = Kurzprüfung nur dieses Tickets.
