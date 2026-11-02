# Prüfung autor · Folge 15 · Runde 2 (Kurzprüfung nach Ticket-Umsetzung)

2026-10-31. Umgesetzt im Eilauftrag vom Regie-Agenten mit geladenem Skill `firma-autor`; als Autor verantwortet. Nur die Ticket-Punkte aus `autor-runde1.md` geändert (Skill-Regel: „nur die genannten Punkte ändern“). R1-Fassungen gesichert: `pruefung/script-r1.txt`, `caption-r1.txt`, `prompt-fuer-kommentare-r1.md`.

## Änderungen (Soll aus R1 wörtlich übernommen)
| Ticket | Datei | vorher | nachher |
|---|---|---|---|
| R1-01 | script.txt:2 | Eine von fünf Adressen sicher. | Fünf Briefe, einer sicher. |
| R1-01 | script.txt:3 | Heute prüft sie nach. | Heute prüft sie die Adressen. |
| R1-02 | script.txt:5 | Bei einem streiten Impressum und Register. | Ein Betrieb: Impressum gegen Register. |
| R1-02 | script.txt:8 | Ein neuerer Eintrag bestätigt das Impressum. | Laut Firmendatenbank bestätigt ein neuerer Eintrag das Impressum. |
| R1-03 | caption.txt:3 | eine Abschrift aus dem Handelsregister | eine Register-Abschrift bei einem Drittanbieter |
| R1-03 | caption.txt:7 | … Erfinde nichts.“ | … Erfinde nichts. Gib mir die aktualisierte Excel-Datei zurück.“ (= echter Lauf-Prompt) |
| R1-03 | caption.txt:14 | Ein späterer Registereintrag von 2015 nennt … | Ein späterer Registereintrag von 2015, gelesen bei einem Datendienst, nennt … |
| R1-04 | prompt-fuer-kommentare.md:12 | „seit 1.8.2022 gebührenfrei“ (Gedächtnis) | gestrichen; „kostenlos“ = Claudes Angabe, Gebührenfreiheit nur mit Quell-URL der Guide-Stufe |
| R1-04 | prompt-fuer-kommentare.md:7 | „zusätzlich Handelsregister“ | + „[im Lauf: gelesen bei North Data, nicht im amtlichen Register]“ |
hooks.md / thema.md: Silbenzahl korrigiert (R1-Satz hatte 9, nicht 8), Faktentabelle und TTS-Risikowörter auf R2 nachgezogen („Firmendatenbank“ neu, „streiten“ entfällt).
H-1 (CTA „sichere Adressen“) bewusst nicht umgesetzt: +2 Wörter sprengen 100; keine Pflicht.

## Kurzprüfung
| Prüfpunkt | Ergebnis |
|---|---|
| `wc -w script.txt` | **100** (85–100 ✓, Obergrenze) |
| Satzlängen frei | max. 9 („Als Nächstes …“), neu: 4 / 5 / 5 / 8 ✓ |
| „Tag“ / „gestern“ | 0 ✓ |
| Hörtest Neueinstieg | „Fünf Briefe, einer sicher. Heute prüft sie die Adressen.“ → Briefe + Adressen vor 14 s hörbar ✓ |
| Bezugswort Streit-Satz | „Ein Betrieb:“ ✓ |
| Quellenart | „Laut Firmendatenbank“ (= North Data, LAUF.md:17), nie „amtlich“/„im Handelsregister nachgesehen“ ✓ |
| Rückblick-Schätzung | Satz 2 = 7 Silben wie Folge 13 (6,26 s) → ≈ 6,2–6,4 s; Regie misst |
| `wc -m caption.txt` | **2047** (< 2100 ✓), Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓ |
| `grep -c 2022 prompt-fuer-kommentare.md` | 0 ✓ |
| Emojis (Zeichen > U+2500) in script/caption/replies/prompt | 0 ✓ |
| Namen/Adressen | keine neuen Wörter mit Lauf-Daten ✓ |

## Noten nach Umsetzung
Neueinstieg 8 · Mehrwert 8 · Faktentreue 8 · Länge/Rückblick 8 (vorbehaltlich Regie-Messung ≤ 6,5 s) · übrige Kriterien unverändert ≥ 8.
**Bestanden (Kurzprüfung), Gesamt ≈ 8,3.** Restrisiko: 100 Wörter = Tempo-Kante (Regie hält ≤ 135 wpm über Pausen), Caption 2047 Zeichen, „Firmendatenbank“ TTS-Test.
Hinweis Prozess: Diese Kurzprüfung stammt nicht von einem frischen Prüf-Agenten, sondern vom umsetzenden Agenten (Auftrag Chef: Ausnahme Eilauftrag). Finale Prüfung bleibt Pflicht.
