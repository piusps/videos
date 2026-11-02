# Prüfung Autor · Folge 4 „Druck“ · Runde 1 (frischer Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `hooks.md`, `prompt-fuer-kommentare.md` (`thema.md` **fehlt**), gegen `tagesbriefing-2026-10-29.md`, `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `../firma-tag3/script.txt`, `bewertung.md` Abschnitt „autor“, Skill firma-autor.

**Gesamturteil: nicht bestanden.** Zwei K.-o.-Punkte: der CTA verspricht etwas, das der eigene Lauf ausschließt, und „Frag:“ spricht den Zuschauer direkt an. Dazu fehlt `thema.md`, und Grund 1 im Warum gibt den Lauf nicht korrekt wieder.

## Sprechdauer (Schätzung, Tempo 1,15)
- 133 Wörter (`wc -w`). Silben (Heuristik): Folge 4 214, Folge 3 235. Folge 3 dauerte bei 135 W / 235 Silben 47,8 s, also ergeben sich hier **ca. 43–45 s** mit Pausen. ✓ (40–48 s)
- Kalibriert an der STT von Folge 3 v8: Eröffnung bis „aus.“ 5,22 s, Satz „Ihre Firma …“ (22 Silben) 3,26 s, „Heute: …“ ab 11,43 s.
  - „Tag zwei.“: ca. 5,8–6,4 s.
  - Rückblick-Satz 1 (fest, 25 Silben, 3 mehr als in Folge 3): ca. 3,7 s. Satz 2 (12 Silben): ca. 1,9 s. Mit Pause **ca. 5,8 s**, also **≤ 6 s gerade so**, ohne Luft.
  - „Heute …“ beginnt bei **ca. 12,2 s** ✓ (vor 14 s) und endet bei ca. 14,1 s. „Plus, Research an“ (Mehrwert) beginnt bei ca. 14,3 s.
  - Für die Regie: Die Pause nach „führt?“ (Folge 3: 0,64 s) und vor „Tag zwei.“ ≤ 0,3 s halten, sonst kippt „Projekt + heutiger Schritt bis 14 s“.

## K.-o.-Check
| Regel | Ergebnis | Beleg |
|---|---|---|
| Eröffnung wörtlich + „Tag zwei.“ (nur Folge 4) | ✓ | script.txt:1 |
| Rückblick Satz 1 wörtlich, nicht „Ihre Firma“ | ✓ | script.txt:2 |
| Rückblick 2 Sätze, ≤ 6 s | ✓ knapp (ca. 5,8 s) | script.txt:2, Schätzung oben |
| „Heute …“ als Satz, danach | ✓ | script.txt:3 |
| Schritt-Kette an Folge 3 („Welcher Druck hält sechzig Grad?“) | ✓ | tag3 script.txt:9 → tag4 script.txt:3 |
| „gestern“ nur in Folge 4, „Als Nächstes“ | ✓ | script.txt:2, 9 |
| Warum mit 2–3 Gründen mit Zahl | ✓ formal (2 Gründe: 95/30, 1/50); Grund 1 sachlich ungenau, siehe Ticket 2 | script.txt:6–7 |
| 110–135 Wörter | ✓ 133 | |
| Keine direkte Ansprache | **✗** „Frag:“ ist ein Imperativ an den Zuschauer außerhalb des CTA. Der CTA in Du-Form ist durch die Vorlage in firma-autor gedeckt, „Frag:“ nicht | script.txt:4 |
| Kein Versprechen, das wir nicht liefern | **✗** „Damit prüfst du in zehn Minuten, ob dein Produkt hält.“ Laut Lauf stammen fast alle Gradzahlen von Anbietern, und Claude rät: „Ein Muster 10–20-mal bei 60 °C waschen, bevor Sie ‚60 °C waschbar‘ versprechen“ (LAUF.md:33, 36). Eine Recherche kann also nicht prüfen, ob ein Produkt hält. Das Video widerspricht seinem eigenen „Haken“ (script.txt:8) | script.txt:10 |
| Ergebnis aus echtem claude.ai-Lauf | ✓ | LAUF.md:2, 12 |
| Kein Umsatz, kein Geld erfunden | ✓ | |
| Caption-Ende Fiktiv-Hinweis, danach nur Hashtags | ✓ | caption.txt:16–18 |
| Keine Emojis | ✓ (Bytes geprüft, nur „€“) | |
| Superkind leise, kein Preis | ✓ (nicht erwähnt) | |

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 8 | Die feste Eröffnung trägt. Produkt + Stand kommen bei ca. 6–12 s. Die Schätzung ist eng, aber machbar |
| Mehrwert: nachbaubar, Beginn ≤ 14 s, heute umsetzbar | 8 | Weg „Plus, Research an, Ergebnis anhängen, Frage“ (script.txt:4) entspricht dem Lauf (LAUF.md:3). Start ca. 14,3 s, also knapp über 14 s. Wegen fester Eröffnung + „Tag zwei.“ ist das nur über Regie-Pausen lösbar (Hinweis an Regie, kein Autor-Ticket) |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | Logo, das sich in der 60-Grad-Wäsche löst, kennt jeder Handwerker. Bild: 95 °C gegen 30 °C beim selben Anbieter |
| Hook (Satz 2 + Frame 1, Muster) | 7 | Satz 2 ist gut (9 W, Zahl, Ergebnis der Vorfolge, hooks.md:13). Frame 1 (hooks.md:8): „der gedruckte Logo-Aufdruck bröckelt“ bei 60 °C. Der Lauf zeigt das nicht. Laut Lauf sind die 30 °C „Pflegeempfehlungen …, keine Grenzen des Materials“, Flexfolie hält laut Hersteller 60 °C (LAUF.md:20), Bröckeln stützt nur ein nicht mehr abrufbarer Forumsbeitrag (LAUF.md:36). Das Bild behauptet mehr als der Lauf → Ticket 4 |
| Warum (2–3 konkrete Gründe mit Zahl) | 7 | Zwei Gründe mit Zahl ✓. Probleme: (a) Grund 1 ist falsch verallgemeinert (Ticket 2). (b) „Er geht ab einem Stück“ (script.txt:7): Das „Er“ folgt direkt auf „gängige Drucke“ und ist beim Hören unklar. (c) „Haken: Das sagen fast nur die Anbieter.“ (script.txt:8): „Das“ bezieht sich grammatisch auf „Siebdruck lohnt erst ab fünfzig“, gemeint sind die Gradzahlen |
| Faktentreue Skript (1:1 aus Lauf) | 6 | ✓ 246 Quellen (LAUF.md:12). ✓ Stickerei (LAUF.md:18). ✓ 95 °C Stick (Spreadshirt, bericht.md:16). ✓ „Siebdruck lohnt erst ab fünfzig“ (Siluri, „ab 50 Stück pro Motiv wirtschaftlich“, bericht.md:8, 57; B2B ab 25 wird weggelassen, das ist bei „lohnt“ vertretbar). ✓ Haken (LAUF.md:36). **✗ „gängige Drucke nur bis dreißig“** (script.txt:6): Der Lauf sagt „beim selben Print-on-Demand-Anbieter … für Flex und Digitaldruck nur 30 °C“ (bericht.md:56), Spreadshirt-Siebdruck 40 °C (bericht.md:16), „30 bzw. 40 °C“ (bericht.md:3). Vor allem korrigiert der Lauf genau diese Folge-3-Aussage: „Ihre alten 30-°C-Belege: Das sind Pflegeempfehlungen …, keine Grenzen des Materials“ (LAUF.md:20). Das Skript wiederholt damit den Folge-3-Satz (tag3 script.txt:7 „Gängige Drucke … vertragen dreißig“), statt die neue, genauere Erkenntnis zu bringen. Das ist sachlich schief und eine Wiederholung. **✗ CTA-Versprechen** (s. K.-o.) |
| Klarheit „Druck“ → Stickerei | 7 | „Heute findet sie einen **Druck**, der das aushält“ (script.txt:3), dann „Die KI nimmt **Stickerei**“ (script.txt:5). Der Dreh aus hooks.md:21 („gar kein Druck“) wird nie gesagt. Ein Laie hört: Versprechen „Druck“ nicht eingelöst, oder er weiß nicht, ob Stickerei ein Druck ist |
| Kommentar-Mechanik (Nutzen, prompt-fuer-kommentare.md fertig) | 6 | Die Datei ist sehr gut: Zahlen 1:1 (prompt-fuer-kommentare.md:15–19 gegen LAUF.md/bericht.md geprüft ✓), Lieferung = Frage + Ergebnis + Tabelle ✓. Aber das Wertversprechen im Skript ist nicht lieferbar (K.-o., Ticket 1) |
| Länge 110–135 / 40–48 s | 9 | 133 W, ca. 43–45 s |
| Schritt-Kette / Anschluss | 9 | Start bei Folge-3-Ergebnis + offener Frage, genau ein Schritt, Übergabe an Folge 5 passt zum Tagesbriefing (Z. 32). Abzug nur für den wiederholten 30-°C-Satz (Ticket 2) |
| Caption | 8 | Fakten 1:1 ✓: 246 Quellen / 5 Min 21 s / acht Verfahren (LAUF.md:12, 38), 95 vs. 30 „Flex- und Digitaldruck“ korrekt eingeschränkt, „laut Anbieter ab 50“, 4,85 € / 5,85 € netto (bericht.md:61), Muster vor 60-Grad-Versprechen (LAUF.md:33). Menüpfad wie in Tag 2 belegt (firma-tag2/thema.md:5). Ende + Hashtags ✓. Kleinigkeiten: Der Stand-Absatz (caption.txt:3) wiederholt „gängige Drucke … etwa 30“ ohne die Korrektur des Laufs. „So machst du das …“ ist Du-Form wie in Folge 3 (dort in der Endprüfung akzeptiert), deshalb nur Hinweis |
| Pflicht-Ausgaben vollständig | 5 | `thema.md` fehlt (firma-autor SKILL.md:15, 39, 41). Damit gibt es keine Themenbegründung und keine Quellennotiz für die Claude-Behauptungen der Caption („Pro, Max, Team, Enterprise“, „Websuche muss an sein“) |

## Tickets

```
TICKET autor-R1-1 → firma-autor
Kriterium: Kommentar-Mechanik / K.-o. „Versprechen, das wir nicht liefern können“ · Note: 6/10
Beleg: script.txt:10 gegen LAUF.md:33, 36 und script.txt:8
Problem: „Damit prüfst du in zehn Minuten, ob dein Produkt hält.“ verspricht einen Haltbarkeitsnachweis, den eine Recherche laut Lauf nicht liefern kann (fast nur Anbieterangaben, Claude rät zum Muster-Waschtest), und widerspricht dem eigenen „Haken“.
Soll: Der CTA-Wert beschreibt nur, was Frage + Tabelle wirklich liefern (Vergleich der Verfahren mit Quellen), z. B. „Damit hast du in zehn Minuten die passenden Verfahren mit Quellen.“ Kein Wort wie „prüfst, ob … hält“ / „weißt, dass … hält“.
```

```
TICKET autor-R1-2 → firma-autor
Kriterium: Faktentreue Skript / Schritt-Kette (keine Wiederholung) · Note: 6/10
Beleg: script.txt:6 gegen bericht.md:3, 16, 56 und LAUF.md:20; Wiederholung von firma-tag3/script.txt:7
Problem: „Stick ist bis fünfundneunzig Grad freigegeben, gängige Drucke nur bis dreißig“ macht aus der Freigabe EINES Anbieters (Spreadshirt: Digital-/Flexdruck 30 °C, Siebdruck 40 °C) eine allgemeine Grenze aller Drucke. Genau diese Verallgemeinerung korrigiert der Lauf („Pflegeempfehlungen …, keine Grenzen des Materials“). Außerdem ist es der Warum-Satz aus Folge 3.
Soll: Grund 1 nennt den Vergleich beim selben Anbieter, so wie bericht.md:56, z. B. „Warum? Beim selben Anbieter: Stick bis fünfundneunzig Grad, Digitaldruck bis dreißig.“ Kein „gängige Drucke“ ohne Einschränkung. Gleich im Stand-Absatz der Caption (caption.txt:3): nach „etwa 30“ den Halbsatz „(laut Händlern, als Pflegeangabe)“ ergänzen oder den Lauf-Befund nennen.
```

```
TICKET autor-R1-3 → firma-autor
Kriterium: K.-o. „Zielgruppe nie direkt ansprechen“ (Pius-Regel 8) · Note: 7/10
Beleg: script.txt:4
Problem: „Frag: Was hält sechzig Grad ab einem Stück?“ ist ein Imperativ an den Zuschauer außerhalb des CTA. In Folge 2/3 war der Weg immer neutral („Plus, Research an, letztes Ergebnis dran.“).
Soll: Im gesprochenen Text gibt es keine Du-Form und keinen Imperativ an den Zuschauer außer im CTA, z. B. „Frage: Was hält sechzig Grad ab einem Stück?“
```

```
TICKET autor-R1-4 → firma-autor
Kriterium: Hook (Frame 1) / Faktentreue Bild · Note: 7/10
Beleg: hooks.md:8 gegen LAUF.md:20, 36 und bericht.md:3, 45, 47
Problem: Frame 1 lässt bei 60 °C „den gedruckten Logo-Aufdruck bröckeln“. Der Lauf belegt das nicht: 30 °C ist eine Pflegeangabe, Flex hält laut Hersteller 60 °C, Bröckeln stützt nur ein nicht abrufbarer Forumsbeitrag.
Soll: Frame 1 zeigt nur, was der Lauf belegt, z. B. Waschtrommel + 60-°C-Zähler, daneben Freigabe-Etiketten „Druck: 30 °C“ (durchgestrichen/rot) und „Stick: 95 °C“ (grün). Kein zerfallender Druck, oder nur als „?“ gekennzeichnet.
```

```
TICKET autor-R1-5 → firma-autor
Kriterium: Warum / Klarheit „Druck“ → Stickerei · Note: 7/10
Beleg: script.txt:3, 5, 7, 8; hooks.md:21
Problem: Das Ziel heißt „einen Druck“, das Ergebnis ist Stickerei, der Dreh wird aber nicht gesagt. „Er geht …“ und „Das sagen …“ haben beim Hören keinen klaren Bezug.
Soll: (a) Ziel und Ergebnis passen ohne Erklärung zusammen, z. B. „Heute sucht sie ein Logo, das sechzig Grad aushält.“ (oder den Dreh aussprechen: „… nimmt gar keinen Druck: Stickerei.“). (b) „Stick geht ab einem Stück, …“ statt „Er geht“. (c) Im Haken steht das Bezugswort, z. B. „Haken: Fast alle Gradzahlen sind Anbieterangaben.“ Gesamt bleibt bei 110–135 Wörtern und der Rückblick unverändert.
```

```
TICKET autor-R1-6 → firma-autor
Kriterium: Pflicht-Ausgaben / Fakten prüfen · Note: 5/10
Beleg: runs/firma-tag4/ (thema.md fehlt); firma-autor SKILL.md:15, 41; caption.txt:6
Problem: thema.md fehlt, damit fehlen die Themenbegründung und die Quellennotiz für die Claude-Behauptungen der Caption (Research nur in Pro/Max/Team/Enterprise, Websuche muss an sein, Menüpunkt „Upload or add files“).
Soll: thema.md liegt vor mit Schritt, Begründung (Kette Folge 3 → 4 → 5), passendem Muster (M-002), Lauf-Verweis und je Claude-Behauptung einer Quelle (z. B. support.claude.com/en/articles/11088861 für Research-Pläne, support.claude.com/de/articles/10684626 für die Websuche, firma-tag2/design/lauf/01 für „Upload or add files“).
```

## Vorschlag Skript (133 Wörter, deckt Tickets 1, 2, 3, 5 ab, Rückblick unverändert)
```
Wie viel Umsatz macht ein Unternehmen, das eine KI hundert Tage lang ganz alleine führt? Ich probier das aus. Tag zwei.
Die Firma der KI verkauft Shirts mit Logo an kleine Betriebe, gedruckt erst auf Bestellung. Gestern lernte sie: Der Bau wäscht mit sechzig Grad.
Heute sucht sie ein Logo, das sechzig Grad aushält.
Plus, Research an, Ergebnis anhängen. Frage: Was hält sechzig Grad ab einem Stück?
Claude prüft zweihundertsechsundvierzig Quellen. Die KI nimmt Stickerei.
Warum? Beim selben Anbieter: Stick bis fünfundneunzig Grad, Digitaldruck bis dreißig.
Stick geht ab einem Stück, Siebdruck lohnt erst ab fünfzig.
Haken: Fast alle Gradzahlen sind Anbieterangaben.
Als Nächstes: Was verlangt die Konkurrenz für bestickte Shirts?
Kommentiere „Druck“, und ich schick dir die Frage und die Vergleichstabelle. Damit hast du in zehn Minuten die passenden Verfahren mit Quellen.
```
TTS-Test: „Digitaldruck“, „Anbieterangaben“, „zweihundertsechsundvierzig“, „Research“.

## Hinweise an firma-chef (kein Autor-Ticket)
- Der feste Rückblick-Satz 1 „… gedruckt erst auf Bestellung“ stimmt ab dieser Entscheidung nicht mehr (die Firma stickt). Ab Folge 5 widerspricht der Pflichtsatz dem Stand. Pius fragen, ob er auf „… gemacht erst auf Bestellung“ oder „… veredelt erst auf Bestellung“ geändert werden darf.
- Regie: Rückblick und „Heute“ haben kaum Luft (Rückblick ca. 5,8 s, Mehrwert-Start ca. 14,3 s). Die Pausen nach „führt?“ und vor „Tag zwei.“ kurz halten.
