# Prüfung autor · Folge 7 „Preis“ · Runde 1 (Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md`, `briefing.md` gegen `design/lauf/LAUF.md`, `design/lauf/bericht.md` (Excel-Werte B10/D10/D18/B22/B23/D23), `../firma-tag6/script.txt`, `../firma-tag6/design/lauf/bericht.md`, `../firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8 + Chef-Entscheide), Maßstab `../firma-tag5/pruefung/autor-runde3.md` + `../firma-tag6/pruefung/autor-runde2.md`, Kalibrierung `../firma-tag4/words.json`, Gegenprobe `../firma-tag8/design/lauf/LAUF.md`.

**Ergebnis: NICHT BESTANDEN** (2 Kriterien bei 7, kein K.-o. verletzt). 2 Tickets an firma-autor.

## Noten

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Eröffnung wörtlich, ohne Tag, ohne „gestern“ | 10 | script.txt:1 wörtlich; grep: kein „gestern“, kein „Tag N“ in Skript/Caption; Caption „In der letzten Folge“. |
| 2 | Rückblick ≤ 6 s, Satz 2 ≤ 11 Silben | 8 | Satz 1 = 3,83 s (words.json 5,732→9,562). Satz 2 „Part·ner·A·ein·und·sech·zig·mit·Vor·be·halt“ = 11 Silben, ca. 1,9–2,1 s mit Doppelpunkt + Komma → ca. 5,85–6,0 s. Kein Puffer (H1). „mit Vorbehalt“ = Claudes Wortlaut Lauf 6 („mit Vorbehalt bis zum Händlerangebot“, tag6 bericht.md:66); Folge 6 sagt „unter Vorbehalt“ (tag6 script.txt:5). Sinngleich, beide idiomatisch korrekt, kein Widerspruch. |
| 3 | Neuer versteht bis 14 s | 8 | Eröffnung (Projekt + Umsatz) → Produkt/Kunde/Verfahren → Partner mit Vorbehalt → „Heute rechnet sie ihren Preis.“ endet rechnerisch bei ca. 12,5 s. Abzug: „Partner“ ohne Funktion (wer stickt/verschickt) muss die Regie im Bild tragen. |
| 4 | Warum: 2–3 Gründe, Zahlen 1:1 | 8 | Grund 1: 151 (B10 151,40, „schon im Einkauf 151,40 € brutto“) > Konkurrenz 110, Printful 69 (D10 69,14). Grund 2: „rund fünfzehn“ (D18 15,41, Grund 3 im Chat). 1:1. Abzug: Grund 2 hat gesprochen keinen Vergleichswert (A61 35,80 €), H2. Rundung uneinheitlich („hunderteinundfünfzig“ ohne „rund“, „rund fünfzehn“ mit), unkritisch. |
| 5 | Kehrtwende A61 → Printful ehrlich und verständlich | **7** | Ehrlich: Claude-Wortlaut „Ich entscheide mich für Printful“ (LAUF.md), Rückblick setzt den Vorbehalt auf. Verständlich nicht: Printful fällt gesprochen zum ersten Mal im Wechsel-Satz (script.txt:5); auch Folge 6 hat Printful nur in der Caption. Die Frage „Was kostet jeder Partner“ (script.txt:4) lässt offen, dass es zwei gibt. Ein Neuer und ein Folge-6-Zuschauer hören einen unbekannten Namen als Gewinner. → Ticket 1. |
| 6 | Haken: kein 60-°C-Versprechen | 9 | script.txt:10 „Sechzig-Grad-Wäsche verspricht Printful nicht.“ = bericht.md:37 („keine 60-°C-Wäsche versprechen … machine wash warm“). Kein Test angekündigt, Faden offen (thema.md „Offene Fäden“). |
| 7 | Rohertrag/Vorschlag nie als Umsatz | 8 | „Vorschlag: hundertneun Euro für fünf. Rohertrag pro Auftrag: …“ (script.txt:9); Caption „(netto, geplant, nicht verdient)“; Frame 1 mit „pro Auftrag“ + „Vorschlag“ Pflicht (hooks.md). Abzug: Frame 1 steht unter dem Text-Hook „Wie viel Umsatz macht eine KI …“, ein grünes „+33,50 €“ direkt darunter kann als Umsatz gelesen werden (H3). |
| 8 | Gelbe Annahmen nicht verschwiegen | 9 | Caption nennt Dollarkurs 15.09.2026, Stickprogramm A61 = 0 €, Vorsteuerabzug (39,86 € als Kleinunternehmer = bericht.md:45). Gesprochen nicht nötig: Die Annahmen tragen die Entscheidung nicht (Printful positiv, A61 negativ in beiden Steuerfällen; 33,50 € ist der niedrigere, also vorsichtige Wert). Guide listet alle gelben Werte. |
| 9 | Ansprache nur im CTA, auch Caption-Anleitung | 9 | Skript: dir/dein nur Z. 12. Caption: Anleitung neutral (Infinitive, „das letzte Ergebnis“); „dich“ Z. 8 und „du“ in prompt-fuer-kommentare.md:7 stehen im Prompt an Claude, nicht an den Zuschauer; „dir“ Z. 15 = CTA. |
| 10 | CTA verspricht nur Lieferbares | **7** | „die Frage und die Kalkulationsvorlage“: Frage liegt vor; die „Vorlage“ ist in prompt-fuer-kommentare.md nur als Textbeschreibung des Aufbaus, die Datei „optional als Beispiel“. „Damit steht dein Preis in zehn Minuten“ verspricht einen fertigen Preis; der Lauf liefert einen Vorschlag unter gelben Annahmen und setzt einen vorhandenen Partnervergleich voraus. → Ticket 2. |
| 11 | 110–135 Wörter, 40–48 s | 8 | 133 Wörter (wc). Kalibrierung Folge 4: 222 Silben = 40,5 s → Folge 7 (241 Silben) ca. 44 s + 9 Doppelpunkt-Pausen + Warum-Pausen ≈ 45,5–47,5 s. Gegenprobe: Folge-6-Rohstimme 243 Silben = 47,7/48,3 s (tag6 regie/words-raw*.json). Am Rand (H1). |
| 12 | Keine Emojis, Caption-Ende, Superkind leise | 9 | Keine Emojis (Zeichenprüfung Skript/Caption/Guide). Caption endet „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags. Superkind nicht genannt. |
| 13 | Übergabe „Wie heißt die Firma?“ | 9 | = Kette Folge 8 (tagesbriefing). Lauf 7 nennt keinen Namen. Lauf 8 liegt inzwischen vor und liefert einen Namen („Kolonnenshirt“, tag8 LAUF.md), Prompt 8 übernimmt „kein Logo, kein Muster-Shirt und keine Werbung“ wörtlich. |

## K.-o.-Check
| K.-o. | Status |
|---|---|
| Eröffnung wörtlich / kein Tag / kein „gestern“ / Satz 1 „bestickt“ | ok |
| Rückblick ≤ 6 s | ok rechnerisch (≈ 5,85–6,0 s, Regie misst) |
| Warum mit 2–3 belegten Gründen | ok (2 gesprochen, 3. in Caption) |
| Ansprache nur im CTA | ok |
| Kein Geld erfunden / kein Umsatz-Zähler | ok |
| Ergebnis aus echtem Lauf, Zahlen 1:1 | ok |
| Schritt-Kette ab Ergebnis Folge 6 | ok (beantwortet „Bleibt pro Shirt überhaupt etwas übrig?“: A61 nein, Printful ja) |
| Versprechen, das wir nicht liefern können | grenzwertig → Ticket 2 |

## Tickets

```
TICKET autor-R1-1 → firma-autor
Kriterium: Kehrtwende A61 → Printful verständlich · Note: 7/10
Beleg: script.txt:4–5; ../firma-tag6/script.txt (Printful gesprochen nie genannt)
Problem: Printful wird gesprochen erst im Wechsel-Satz eingeführt, „jeder Partner“ verrät nicht, dass es zwei Kandidaten gibt; der Gewinner ist ein unbekannter Name.
Soll: Printful fällt gesprochen vor „Die KI wechselt“. Vorschlag:
  Z. 4: „Ergebnis anhängen. Frage: Was kosten A einundsechzig und Printful, als Excel mit Formeln?“ (= Prompt „bei beiden Partnern“, LAUF.md)
  Ausgleich Z. 8: „Ein Shirt nachbestellt: rund fünfzehn.“ (statt „Ein Shirt nachbestellen kostet dort rund fünfzehn.“)
  Wortzahl danach 133 (±0), Silben ±0 (+4 in Z. 4, −4 in Z. 8). thema.md (Faktenabgleich, TTS-Liste: Printful jetzt 4×) und Frame-/Regie-Hinweis nachziehen. Rückblick bleibt unverändert.
```

```
TICKET autor-R1-2 → firma-autor
Kriterium: CTA verspricht nur Lieferbares · Note: 7/10
Beleg: script.txt:12; prompt-fuer-kommentare.md:3 („Optional die Datei … als Beispiel“), :11–19
Problem: „Damit steht dein Preis in zehn Minuten“ verspricht einen fertigen Preis, der Lauf liefert einen Vorschlag unter gelben Annahmen; die „Kalkulationsvorlage“ ist bisher nur eine Textbeschreibung.
Soll: (a) CTA verspricht die Rechnung, nicht den fertigen Preis. Vorschlag:
  „Kommentiere „Preis“, und ich schick dir die Frage und die Kalkulationsvorlage. Damit rechnest du deinen Preis in zehn Minuten.“ (Wortzahl gleich)
  (b) prompt-fuer-kommentare.md legt fest, dass der Guide die Vorlage tatsächlich enthält: leere Excel-Datei (Blätter „Eingaben“ + „Kalkulation“ mit den Formeln aus dem Lauf, Werte gelöscht) als Download-Link ODER die Tabelle als kopierbare Vorlage im PDF; „optional“ streichen. Caption-CTA (caption.txt:12) gleichlautend.
```

## Hinweise (kein Ticket)
- **H1 Länge/Rückblick am Rand:** Rückblick rechnerisch 5,85–6,0 s, Gesamt 45,5–47,5 s, Folge-6-Rohstimme lag bei 47,7 s. Regie misst; > 48 s oder Rückblick > 6,0 s → zurück an Autor.
- **H2 Grund 2:** Ohne A61-Vergleich (35,80 €) wirkt „rund fünfzehn“ als Grund schwach. Regie-Karte „NACHBESTELLEN 1 SHIRT“ sollte A61 35,80 € grau daneben zeigen (bericht.md:35).
- **H3 Frame 1:** Unter „Wie viel Umsatz …“ steht grün +33,50 €. Zeilenbeschriftung zusätzlich „gerechnet, nicht verdient“ oder „Plan“, damit niemand Umsatz liest (Regel 5).
- **H4 „Bei Printful: neunundsechzig.“** direkt nach „Konkurrenzpreis: hundertzehn.“ kann als Printfuls Verkaufspreis gehört werden; Regie-Karte (gleiche Karte „EINKAUF 5 SHIRTS“, zweiter Balken) löst das, im Bild Pflicht.
- **H5 „im Einkauf hunderteinundfünfzig“:** Claude-Wortlaut, aber es ist der A61-Ladenpreis (Händlerpreis unbekannt). Caption nennt die 17,16-€-Schwelle; Guide ebenso. Kein Handlungsbedarf im Skript.
