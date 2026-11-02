# Prüfung autor · Folge 14 „Empfängerliste“ · Runde 1

Prüfer: firma-pruefer (fremder Agent, nicht der Autor), 2026-10-31, Eilauftrag. Maßstab: bewertung.md „autor“, `runs/firma-tag9/tagesbriefing-2026-10-30.md`, `briefing.md`, Textregeln 2026-10-30. Beleg des Laufs: `design/lauf/LAUF.md`, `bericht.md`, `prompt.txt`. Vergleich: `runs/firma-tag13` (R3 bestanden 8,5).
Nicht geprüft (Eile): Kommentare der Vorfolgen (thema.md nennt das selbst), Support-Links nicht neu geöffnet (keine neue Funktionsbehauptung im Skript).

## Messwerte
- `wc -w script.txt` = **99** (85–100 ✓).
- Längster freier Satz: 8 Wörter („Verzeichnisse hatten bei zwei Betrieben frühere Adressen.“ / „Kommentiere „Adresse“, ich schick dir Frage und Tabellenvorlage.“). Feste Sätze 15/15 ausgenommen. Alle ≤ 12 ✓.
- „Tag“/„gestern“ in script.txt und caption.txt: 0 ✓ (nicht erste Folge; Folge 13 = 9:00 „Tag vier“).
- Caption: **2076** Zeichen < 2100 ✓; Ende „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags ✓; Zeichen > U+2500: keine ✓.
- Namen/Orte (Knauth, Tillmann, Metzler, Demeter, M3/Raumbau, Müller, Flöha, Hamburg, PLZ) in script/caption/hooks/thema/prompt/replies: 0 Treffer ✓. Nur „Chemnitz“ (erlaubt).
- Rückblick-Satz 2 „Der Werbebrief steht.“ 5 Silben ≤ 11 ✓, passt zu Ergebnis Folge 13 (Brief als Word-Datei, Empfänger Platzhalter; firma-tag13/script.txt + LAUF.md Anhang 1) ✓.
- Tempo: 99 Wörter, Folge 13 (100 Wörter) maß 44,9–45,0 s → ≈ 44–45 s, ≈ 132–135 wpm ✓ (an der Oberkante, Regie über Pausen).

## Faktenabgleich Skript ↔ Lauf
| Skript | Lauf | ok |
|---|---|---|
| Heute sucht sie Adressen für fünf Briefe. | prompt.txt „Hol mit der Websuche die Postadressen dieser fünf Betriebe“ | ✓ |
| Claude: Brief angehängt, Websuche, Excel-Datei. | LAUF.md: DOCX-Anhang, 15 Websuchen, XLSX-Karte | ✓ |
| Sie nimmt das Impressum, nicht Verzeichnisse. | „Die verlässlichste Quelle … das Impressum“; Brief-Adressen = Impressum | ✓ (Verzeichnisse dienten nur als Gegenprobe, Vereinfachung vertretbar) |
| Warum? Es ist Pflicht. / Der Betrieb pflegt es selbst. | Gründe 1 und 2 wörtlich | ✓ |
| Verzeichnisse hatten bei zwei Betrieben frühere Adressen. | Grund 2: „Bei [zwei] stehen dort noch frühere Adressen.“ | ✓ |
| Der Haken: Eindeutig belegt ist nur eine. | „Eindeutig belegt ist allerdings nur eine.“ | ✓ |
| Als Nächstes: Welche Adresse stimmt? | Claude: Handelsregister nachsehen / Anruf | ✓ (offene Frage, nicht beantwortet) |
Kein „geprüft“, „amtlich“, „bestätigt“ ✓. Grund 3 (Handelsregister) bewusst nicht gesprochen, weil das amtliche Register nicht abgefragt wurde ✓.

## Noten
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer Zuschauer versteht in 5 s / Neueinstieg ≤ 14 s | 9 | script.txt:1–3; Rückblick sagt Produkt + Stand, „Heute“ ≈ 13,0–13,5 s (thema.md Länge) |
| Mehrwert: nachbaubar, Beginn ≤ 14 s, heute umsetzbar | 8 | script.txt:4 Weg in einem Satz; Caption Schritt 1–3 + Guide Variante A = echter Prompt |
| Thema: Schmerz + Ergebnis in einem Bild | 8 | „Woher Firmenadressen, und stimmen sie?“ eher Gründer- als Handwerker-Schmerz; Ergebnisbild Status-Spalte stark (hooks.md Frame 1) |
| Hook (Satz 2 + Frame 1 erzeugen Frage, Muster) | 8 | „Der Werbebrief steht.“ allein trägt keine Frage; die Frage kommt aus Frame 1 (1× grün, 3× gelb, 1× rot → „warum nur eine?“). M-002/M-011 existieren in SPY/muster.md:29/101 |
| Entscheidung + Warum (2–3 konkrete Gründe) | 8 | script.txt:5–7: Alternative hörbar, 2 Gründe + Befund aus dem Lauf. „Es ist Pflicht.“ knapp/abstrakt, durch Befund „frühere Adressen“ konkret |
| Schritt-Kette | 9 | Übergabe F13 „Wohin gehen die Briefe?“ → genau dieser Schritt; Eingabe = DOCX aus Lauf 13 unverändert (LAUF.md) |
| Faktentreue / nichts Unbelegtes | 8 | Skript 1:1 belegt. Caption Z. 10 „Für alle 5 Betriebe gibt es eine Adresse aus dem Impressum.“ ist Claudes Aussage, aber laut LAUF.md nur 2 Impressen gelesen, 3 aus Suchtreffern → Zuschreibung fehlt (Hinweis H-1) |
| Kommentar-Mechanik / CTA | 8 | script.txt:10–11 Lieferung konkret (Frage + Tabellenvorlage), prompt-fuer-kommentare.md vollständig mit Abnahme-Checks; „in zehn Minuten deine Empfängerliste“ leicht optimistisch, da die Folge selbst zeigt, dass nur 1 von 5 belegt ist (Caption Schritt 3 fängt das auf) |
| Länge / Satzlänge / Tempo | 9 | 99 Wörter, max. 8 Wörter/Satz, ≈ 44–45 s |
| Serien-Regeln (Eröffnung ohne Tag, kein gestern, Stand-Satz, offene Frage) | 9 | script.txt:1 wortgleich mit fester Eröffnung ohne Tag; kein Umsatz-Zähler (hooks.md) |
| Caption-Regeln | 9 | 2076 Zeichen, Ende korrekt, keine Emojis, Menüpfad („neuer Chat“, „+“), Datenschutz-Hinweis, „Das amtliche Register hat Claude nicht selbst abgefragt.“ |
| replies.json | 9 | jede Antwort endet mit Frage, keine Emojis, Bezug zur Folge |

## K.-o.-Liste
| K.-o. | verletzt? |
|---|---|
| Zuschauer außerhalb CTA direkt angesprochen | nein |
| „Tag N“/„gestern“ in Nicht-Erstfolge | nein |
| > 100 Wörter / Satz > 12 | nein |
| Ergebnis nicht aus echtem Lauf / unbelegte Claude-Behauptung | nein |
| ChatGPT statt Claude | nein |
| Unlieferbares Versprechen | nein |
| Erwähnung „niemand kommentiert“ | nein |
| Echte Namen/Adressen / Hamburg | nein |
| Caption ≥ 2100 / falsches Ende / Emojis | nein |

## Hinweise (keine Pflicht-Tickets, alle Kriterien ≥ 8)
- **H-1 (Autor, empfohlen, 1 Satz):** caption.txt Z. 10, letzten Satz ersetzen durch „Laut Claude alle 5 aus dem Impressum; gelesen hat sie nur 2, 3 kamen aus Suchtreffern.“ (+28 Zeichen; zusammen mit der Kürzung in Z. 10 „Ergebnis im echten Lauf (etwa 2 Minuten 40 Sekunden, 15 Websuchen)“ auf „Echter Lauf (2 Min. 40 s, 15 Websuchen)“ gerechnet 2076 Zeichen; Soll: Caption < 2100, Ende unverändert).
- **H-2 (Regie):** Tempo an der 135-wpm-Kante → Pausen 0,4–0,7 s an Satzgrenzen, vor „Warum?“ bis 0,9 s; „Heute“ ≤ 14,5 s messen; „Claude:“ mit 0,2 s Pause; „Impressum“ Betonung Im-PRES-sum testen.
- **H-3 (Design):** Frame 1 trägt den Hook allein (Satz 2 ist neutral) → Status-Spalte mit 1× grün / 3× gelb / 1× rot muss in Frame 0 lesbar sein, nur „-anonym“-Screenshots.

## Urteil
**Bestanden.** Gesamtnote **8,5/10** (gleichauf mit Folge 13), kein K.-o., alle Kriterien ≥ 8. Keine Korrektur-Tickets an firma-autor.
