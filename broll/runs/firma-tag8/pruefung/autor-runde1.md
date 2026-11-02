# Prüfung autor · Folge 8 „Firmenname“ · Runde 1 (Prüfer, 2026-10-28)

Geprüft: `script.txt`, `caption.txt`, `thema.md`, `hooks.md`, `prompt-fuer-kommentare.md`, `briefing.md` gegen `design/lauf/LAUF.md`, `design/lauf/bericht.md`, `../firma-tag7/script.txt` + `caption.txt` (Stand 20:45 bzw. 20:41, nach F7-Korrektur: „Vorschlag: hundertneun Euro für fünf.“), `../firma-tag4/tagesbriefing-2026-10-29.md` (Regeln 1–8 + Chef-Entscheide), Maßstab `../firma-tag6/pruefung/autor-runde2.md` + `../firma-tag7/pruefung/autor-runde1.md`, Kalibrierung `../firma-tag4/words.json`.

**Ergebnis: NICHT BESTANDEN** (Kriterium 2 bei 6, Kriterium 5 bei 7; kein K.-o. sicher verletzt, Kriterium 2 streift Regel 5/Fakt-K.-o.). 2 Tickets an firma-autor.

## Noten

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Eröffnung wörtlich, ohne Tag, ohne „gestern“ | 10 | script.txt:1 wörtlich; grep: kein „gestern“, kein „Tag N“ in Skript/Caption; Caption „In der letzten Folge“. HUD-Badge „TAG 2“ (hooks.md) erlaubt. |
| 2 | Rückblick ≤ 6 s, Satz 2 ≤ 11 Silben, sachlich, kein Umsatz-Klang | **6** | Silben: Print·ful·stickt·fünf·Shirts·für·hun·dert·neun·Eu·ro = 11 ✓. Dauer: Satz 1 = 3,83 s (words.json 5,732→9,562), Satz 2 ≈ 1,9–2,0 s (F4: 12 Silben = 2,06 s, 9,625→11,683) → ≈ 5,8–5,9 s ✓, knapp. **Sachlich falsch hörbar:** „Printful stickt, fünf Shirts für hundertneun Euro.“ hat Printful als Subjekt; der natürliche Höreindruck ist „Printful macht fünf Shirts für 109 €“ = Printfuls Preis. Printfuls Einkauf ist aber 69,14 € (F7 caption.txt:10, F7 script.txt:7 „Bei Printful: neunundsechzig“); 109 € ist der Verkaufs-**Vorschlag** der KI (F7 script.txt:9). Das Wort „Vorschlag“ fehlt, damit fehlt auch jedes Signal „geplant, nicht verdient“; direkt nach „Wie viel Umsatz macht …“ kann „fünf Shirts für hundertneun Euro“ wie ein erster Verkauf klingen (Regel 5). thema.md behauptet, „fünf Shirts für“ löse das Problem; es löst nur Stück- vs. Paketpreis, nicht Einkauf vs. Verkauf. → Ticket 1. |
| 3 | Neuer versteht bis 14 s | 9 | Eröffnung endet ≈ 4,8 s (F4 ohne „Tag 2“), Rückblick ≈ 10,7 s, „Heute sucht sie einen Firmennamen.“ ≈ 12,5 s. Projekt, Produkt, Kunde, Verfahren, heutiger Schritt vor 14 s. |
| 4 | Warum: 2–3 Gründe 1:1, „nichts gefunden“ ≠ frei/geschützt | 8 | Grund 1 „Kolonne heißt auf dem Bau Arbeitstrupp, passend zum Fünferpaket“ = LAUF.md „Trupp von Arbeitern … so nennt ein Dachdecker seine Leute … passt zu deinem Fünferpaket“ (LEO). Grund 2 „Firma oder Shop mit dem Namen: keine gefunden.“ = „brachten keine Firma, keinen Shop …“, als Nicht-Fund formuliert, klingt weder „frei“ noch „geschützt“ ✓. Grund 3 „Die anderen zwei: Allerweltswörter.“ = Claude-Wortlaut. Abzug: „die anderen zwei“ setzt Rechnen voraus (10 − 7 = 3); Bild muss Handwerkerhemd/Betriebsshirt zeigen (thema.md Regie ✓). Hinweis H2 zur Karte „0 Treffer“. |
| 5 | Haken ehrlich, keine Menschen-Handlung | **7** | „Die Domain ist nicht als frei bestätigt.“ = LAUF.md („bestätigt ist es nicht“) ✓, keine Handlung angekündigt ✓. **Aber:** „Das Markenregister prüft Claude nicht.“ ist eine allgemeine Fähigkeitsaussage im Präsens; belegt ist nur der Befund dieses Laufs („DPMA … und EUIPO … habe ich nicht durchsucht“). Ob Claude das Register grundsätzlich nicht prüfen kann, ist nicht belegt (K.-o.-Nähe „unbelegte Claude-Behauptung“). Handelsregister („nicht geprüft“, LAUF.md) fehlt gesprochen, steht nur in der Caption. Zudem wechselt das Subjekt von „die KI“ auf „Claude“. DENIC-Fehler korrekt nur in Caption (Z. 11) ✓. → Ticket 2. |
| 6 | Gestrichene Namen 1:1 mit Grund | 9 | Skript: „Sieben fliegen raus, vier davon zu nah am Arbeitskleidungs-Shop Kluft.“ = Tabelle (7× gestrichen, 4× „Sehr ähnlich: Kluft.de, Onlineshop für Arbeitskleidung“). Caption Z. 9 nennt alle sieben mit Grund aus dem Lauf (Kluft.de/dieselben Kunden; Stichfest Tirol + Domain; Logostich fast gleiches Angebot; Meistershirt Domain + Fußball). Kleine Unschärfen siehe H3. |
| 7 | Übergabe Logo (Folge 9) | 8 | „Als Nächstes: Wie sieht ein Logo aus, das sich sticken lässt?“ = Kette (briefing.md, tagesbriefing Folge 9), als Frage, kein Canva-/Ergebnis-Versprechen ✓. Abzug: Claudes eigener nächster Schritt im Lauf ist „DPMAregister und EUIPO eSearch … bevor du das Logo in Auftrag gibst“. Die Folge darf das nicht übergehen: Folge-9-Rückblick muss „noch ungeprüft“ tragen (thema.md schlägt das vor), H4. |
| 8 | Ansprache nur im CTA, auch Caption-Anleitung | 9 | Skript: dir/du/dein nur Z. 10 (CTA); „Ergebnis anhängen. Frage: …“ neutral. Caption: Anleitung im Infinitiv („öffnen“, „anhängen“, „Fragen:“, „selbst nachsehen“); „mir/meine/dich/du“ in Z. 7 stehen im Prompt an Claude; „dir“ Z. 14 = CTA. prompt-fuer-kommentare.md Prüfliste neutral. |
| 9 | CTA verspricht nur Lieferbares | 8 | „Frage und Prüfliste“ liegen fertig in prompt-fuer-kommentare.md (Prompt + 8-Punkte-Liste + Beispiele + echter Lauf). „Damit prüfst du deinen Firmennamen in zehn Minuten“: Lauf 1 min 54 s, DPMA/EUIPO laut Claude „ein paar Minuten“ → plausibel; F7-Wortlaut („Damit rechnest du …“) übernommen. Abzug: „prüfst“ ohne Einschränkung kann als vollständige/rechtssichere Prüfung gelesen werden; Guide hat den Rechtsberatungs-Hinweis ✓, Caption nicht (H5). |
| 10 | 110–135 Wörter, 40–48 s | 9 | 133 Wörter (wc). Kalibrierung F4: 133 Wörter/222 Silben = 40,5 s. F8 ≈ 230 Silben → ≈ 42 s + Doppelpunkt-/Warum-Pausen ≈ 44–45 s. Nach den Tickets ≈ +0,9 s, weiter im Rahmen. |
| 11 | Keine Emojis, Caption-Ende, Superkind leise | 10 | Zeichenprüfung Skript/Caption/Guide: keine Emojis. Caption endet „(Fiktives Experiment, keine echten Umsätze.)“ + nur Hashtags. Superkind nicht genannt. |
| 12 | Aussagen über reale Firmen sachlich und belegt | 8 | Kluft.de: „zu nah am Arbeitskleidungs-Shop“ / „Arbeitskleidung für dieselben Kunden“ = Claude + Händlerbund-Quelle; keine Rechtsverletzung behauptet (Claude: „Ob das rechtlich ein Problem wäre, kann ich nicht beurteilen“) ✓. Logostich: „aktiver Shop mit fast genau diesem Angebot“ = Tabelle „aktiver Shop“ + „fast genau dein Angebot“, aber Claude schreibt im Detail „wirkt noch unfertig“. Stichfest: „Stickerei in Tirol, Domain belegt“ lässt offen, dass die Tiroler Firma nicht als Inhaberin von stichfest.de belegt ist. Beides H3. |

## K.-o.-Check
| K.-o. | Status |
|---|---|
| Eröffnung wörtlich / kein Tag / kein „gestern“ / Satz 1 „bestickt“ | ok |
| Rückblick ≤ 6 s | ok rechnerisch (≈ 5,8–5,9 s, Regie misst) |
| Warum mit 2–3 belegten Gründen | ok (3 gesprochen) |
| Ansprache nur im CTA | ok |
| Kein Geld erfunden / kein Umsatz-Zähler | grenzwertig: Satz 2 kann als Printful-Preis oder Verkauf gehört werden → Ticket 1 |
| Ergebnis aus echtem Lauf, Fakten 1:1 | ok, außer Präsens-Fähigkeitsaussage „prüft Claude nicht“ → Ticket 2 |
| Schritt-Kette ab Ergebnis Folge 7 | ok (F7 endet „Wie heißt die Firma?“, Lauf-8-Prompt nennt F7-Ergebnis + Anhang) |
| Versprechen, das wir nicht liefern können | ok |

## Tickets

```
TICKET autor-R1-1 → firma-autor
Kriterium: Rückblick-Satz 2 sachlich, kein Umsatz-Klang · Note: 6/10
Beleg: script.txt:2 („Printful stickt, fünf Shirts für hundertneun Euro.“); ../firma-tag7/script.txt:7 + :9; ../firma-tag7/caption.txt:10
Problem: Mit Printful als Subjekt klingt 109 € wie Printfuls Preis (Einkauf ist 69,14 €) oder wie ein erster Verkauf; das Wort „Vorschlag“ aus Folge 7 fehlt.
Soll: Satz 2 macht hörbar, dass 109 € für fünf der geplante Verkaufspreis der KI ist, ≤ 11 Silben, ohne „Ihr …“ (Sie-Ansprache-Gefahr wie „Ihre Firma“). Vorschlag:
  „Printful stickt, Vorschlag: hundertneun für fünf.“ (Print·ful·stickt·Vor·schlag·hun·dert·neun·für·fünf = 10 Silben, 6 Wörter)
  Alternative ohne Partner: „Preisvorschlag: hundertneun Euro für fünf Shirts.“ (11 Silben)
  Bild-Karte im Rückblick: „Vorschlag 109 € · 5 Shirts“ (nicht grün, kein €-Zähler). thema.md (Faktenabgleich, TTS-Liste) und hooks.md (Variante B → neue Wahl) nachziehen.
```

```
TICKET autor-R1-2 → firma-autor
Kriterium: Haken ehrlich · Note: 7/10
Beleg: script.txt:8 („Das Markenregister prüft Claude nicht.“); LAUF.md Schlussantwort „DPMA … und EUIPO … habe ich nicht durchsucht“, „Handelsregister und Unternehmensregister: nicht geprüft“
Problem: Präsens-Fähigkeitsaussage über Claude statt Befund aus dem Lauf; Handelsregister fehlt gesprochen; Subjekt wechselt von „die KI“ zu „Claude“.
Soll: Haken nennt nur, was in diesem Lauf nicht geprüft wurde, als Befund in der Vergangenheit, ohne Menschen-Handlung. Vorschlag:
  „Haken: Die Domain ist nicht als frei bestätigt. Markenregister und Handelsregister hat sie nicht geprüft.“
  (+2 Wörter; mit Ticket 1, Variante 1: −2 → wieder 133 Wörter; ≈ +0,9 s, Gesamt ≈ 45–46 s)
  Falls Länge knapp: „Das Markenregister hat sie nicht geprüft.“ (Handelsregister dann nur Caption, wie jetzt).
  TTS-Test „Handelsregister“ in die Liste.
```

## Hinweise (kein Ticket)
- **H1 Rückblick-Puffer:** ≈ 5,8–5,9 s rechnerisch, Regie misst; > 6,0 s → zurück an Autor. Mit Ticket-1-Vorschlag (10 Silben) etwas mehr Luft.
- **H2 Regie-Karte Grund 2:** „GEFUNDEN: 0“ / „0 Treffer“ (thema.md) ist ungenau, die Suchen hatten Treffer, nur keine Firma/keinen Shop dieses Namens. Besser „Firma: keine gefunden · Shop: keine gefunden“. Frame 1 (hooks.md) „Domain + Marke: ungeprüft“ besser „Domain: nicht bestätigt · Marke: nicht geprüft“ (DENIC wurde abgefragt, brach nur ab).
- **H3 Caption reale Firmen:** Stichfest → „Stichfest (Stickerei in Tirol mit diesem Namen, dazu stichfest.de laut DENIC belegt)“; Logostich → „Logostich (Shop für bestickte Firmenkleidung, laut Claude noch unfertig, Domain registriert, fast genau dieses Angebot)“. Sachlich schon jetzt vertretbar, so ist es 1:1.
- **H4 Folge 9:** Claude empfiehlt im Lauf DPMA/EUIPO vor dem Logo. Folge 9 muss den Namen als „noch ungeprüft“ führen; kein Satz darf so tun, als sei Kolonnenshirt gesichert.
- **H5 Caption-CTA/Anleitung:** Punkt 3 der Anleitung um „(keine Rechtsberatung)“ ergänzen, wie im Guide.
