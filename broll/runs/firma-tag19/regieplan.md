# Regieplan · Folge 19 „Stimmt die Versandzeile?“ (Serientag 5, Slot 2026-11-01 12:00, NICHT erste Folge)

firma-regie, 2026-10-31. Grundlage: script.txt nach Autor-Runde 2 (`pruefung/autor-runde1.md`, `pruefung/autor-runde2-kurz.md`, 100 Wörter). Ausgaben: `voice.mp3`, `words.json` (auch in `public/firma-ep/tag19/`), `beats.json` (`regie/make_beats19.py`), `musik.txt`, Bibel-Zeile (`wirtschaftsbuch-v2.md`, `regie/bibel_eintrag.py`). Arbeitsdateien/Tests in `regie/`. Keine Grafik, kein Render.

## Messwerte
| Messung | Wert | Vorgabe |
|---|---|---|
| Länge | voice.mp3 **44,27 s** (letztes Wort endet 43,95, Ausklang 0,32 s) + 1,0 s Endkarte = **45,27 s** (`beats.json seconds`) | 40–48 s ✓ |
| Sprechtempo | **132,5 wpm** (100 / 45,27 s); nur voice.mp3 135,5 | 120–135 ✓ |
| Rückblick „Die“ → Ende „fehlt.“ | **6,37 s** (6,17–12,54) | ≤ 6,5 s ✓, nicht beschleunigt |
| Pause „aus.“ → „Die“ | **0,34 s** | ✓ |
| Pause „fehlt.“ → „Heute“ | **0,56 s** | ✓ |
| „Heute“ beginnt bei | **13,10 s** | ≤ 14,5 s ✓ |
| Tempo TTS | 1,0 überall, kein atempo | ✓ |
| STT (scribe_v1, de) | Endfassung **11/11 Läufe 100/100 Wörter identisch** (5 auf `regie/v-weg4-warum3.mp3` + 6 auf der bytegleichen `regie/vb.mp3`; `voice.mp3` per `cmp` bytegleich). „probier“, „Briefe“, „Websuche“, „Beleg“, „Hundertneun“, „schick“ immer sauber | 0 Abweichungen ✓ |
| Musik explizit | **0** (3 Läufe auf dem Abschnitt), kein Mute | ✓ |
| Musik-Abstand | jeder Akt ≥ 18,6 dB unter der Stimme (`regie/gap-final.txt`) | ≥ 15 ✓ |

## Storyline-Check (Bibel v2 + Kette)
- Folge 18 endet (finales script.txt) „Als Nächstes: Stimmt die Versandzeile?“ → Folge 19 „Heute prüft sie ihre Versandzeile.“ Rückblick-Satz 2 „Fünf Briefe, Einkaufspreis fehlt.“ = Ergebnis Folge 18. Slot 12:00: kein „Tag“, kein Slam, kein „gestern“.
- Eingabe = Serienbriefe Lauf 17 (unverändert angehängt). Ergebnis: für 11,20 €/5,20 € kein Beleg; Entscheidung: Beträge gestrichen (neue Zeile „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“ in allen fünf Briefen, Word-Datei zurück). Gründe: Versandseite zeigte Claude nur Dollar (im Lauf, nie verallgemeinert); Umrechnen mit angenommenem Kurs wäre geraten. 109 € Verkaufspreis für fünf bleibt offen; es fehlen Einkaufspreis + Umsatzsteuer-Status. Kasse 0 € → 0 €, kein Zähler.
- Fortschritt gegenüber Folge 18 (Wiederholung „Fünferpreis offen“): neue Briefdatei + neue fehlende Größe (Umsatzsteuer-Status) → Übergabe Folge 20 „Mit oder ohne Umsatzsteuer?“ (vom Chef bestätigt; Lauf 19 beantwortet sie nicht, ohne Login recherchierbar).
- Board: wie `public/firma-ep/tag18`; WERBEBRIEF + ADRESSEN bleibt current (Briefe weiter mit Platzhaltern), DRUCK + PREIS Haken + Badge „5ER OFFEN“, GEWERBE ab B15 Badge „UST ?“.
- Faktenschutz: Lieferzeit in keinem Bild (Shot 04 nie, Shot 02 nur bis „Bestellung.“, Briefansicht Lieferzeit-Satz abgedeckt); Shot 06 nur „Achtung Umsatzsteuer“ (Claudes „Versand extra“-Satz nie lesbar); 4,49 € nie; 18,32 € nie (Shot 05 nur Kopf). Kein Widerspruch zu früheren Folgen, kein Ticket an firma-autor.

## Stimme
- Serienstimme Keno `5qxnhLWq1rPhIVOrGuRh`, `eleven_multilingual_v2`, stability 0.35, similarity 0.8, style 0.5, speaker boost, **Tempo 1,0** (`regie/el.mjs`, Takes `regie/take.mjs` → `regie/t/`). TTS-Text = script.txt (kein Wort umgeschrieben).
- Takes je Satzgruppe: rueck ×4, weg ×4 (weg2/weg3: STT „Brief“ statt „Briefe“ → verworfen), warum ×4, cta ×4. Eröffnung aus Folge 12 (Lehre 13/17).
- **Zusammenbau (`regie/assemble19.py`, Parameter `regie/final.env`; Schnitte nur in Stille an Satz-/Komma-/Doppelpunktgrenzen, 3-ms-Fades, Pegel aller Teile auf −17,2 dB RMS):**
  - A Eröffnung bis „aus.“ = Folge 12 `voice.mp3` | 0,34 s
  - B Rückblick „Die“ … „fehlt.“ = Take rueck4 (Pausen Betriebe, 0,07 · Bestellung. 0,12 · Briefe, 0,12) | 0,56 s
  - C1 „Heute“ … „Beträge.“ = Take weg4 (Versandzeile. 0,6 · Claude: roh · angehängt, 0,15 · Printful. 0,6 · Beleg. 0,5) | 0,86 s (vor „Warum?“)
  - C2 „Warum?“ … „Umsatzsteuer?“ = Take warum3 (Warum? 0,5 · Dollar. 0,35 · geraten. 0,7 · Shirts? 0,3 · offen. 0,5 · Status. 0,6 · Nächstes: 0,35) | 0,96 s (Akt-Naht zum CTA, Präzedenz F18 1,00)
  - D CTA = Take cta4 („Prompt.“ → „In“ 0,6)
- Kandidaten-STT (5×): weg1+warum1 1/5, weg4+warum1 3/5, weg1+warum4 5/5 (+6: 4/6), weg4+warum4 4/5, **weg4+warum3 5/5 (+6: 6/6)**. Einziger Fehlertyp: „hundert neun“ getrennt.
- **Betonungstest** (`regie/stress19.py`, Silben-RMS/F0/Dauer im Satzkontext + STT):
  - „Beleg“ (weg4): Be 0,08 s / leg 0,25 s → be-LEG; STT immer „Beleg“, nie „Belag“. CTA cta4 „Beleg“ ebenso.
  - „geraten“ (warum3): ra 0,17 s lauter als ge (−16,3 vs −17,4 dB) → ge-RA-ten ✓.
  - „Hundertneun“: drei Silben 0,20/0,20/0,22 s, „neun“ ohne „-zig“; STT 11/11 „Hundertneun“.
  - „Umsatzsteuer-Status“: kein Bruch am Bindestrich (er- 0,10 s → Sta direkt), Um betont (−14,7 dB, 156 Hz); STT „Umsatzsteuerstatus“ (zusammen) ✓.
  - „Printful“: Print/ful ≈ englisch, STT immer „Printful“.
  - „Verkaufspreis“: Ver kurz 0,12 s, kaufs 0,26 s (wie „Einkaufspreis“ als Gegenpaar).

## Akte (roter Faden)
1. Hook 0–6,17: Briefseite alt durchgestrichen → neu (Ergebnis in Frame 1), Frage oben, GANZ ALLEINE.
2. Rückblick 6,17–13,10: Board, SHIRTS MIT LOGO, erst auf Bestellung, fünf Briefe + EINKAUF FEHLT.
3. Heute + Claude-Weg 13,10–19,05: eine Briefseite → Paper-Fenster (Shot 01 → 07).
4. Ergebnis + Entscheidung 19,05–23,46: Shot 03 „keinen Beleg“ → Stempel KEIN BELEG → Strich + neue Zeile (Story-Objekt Briefseite).
5. Warum 23,46–27,93: NUR DOLLAR · UMRECHNEN = GERATEN unter der Briefzeile.
6. Offen 27,93–35,15: Fünferpack mit Verkaufs-Schild, OFFEN, EINKAUF ? · STEUER ?
7. Als Nächstes + CTA 35,15–45,27: MIT ODER OHNE? → Endkarte „Beleg“.

## Beat-Plan (Zeiten aus words.json; Anker in beats.json)
| Beat | Zeit | Bild (was ändert sich) | Kamera | Frage im Kopf | Karten | Ton |
|---|---|---|---|---|---|---|
| B01 hook | 0.00–0.74 | Frame 1 = Ergebnis (hooks.md, M-002/M-011): Hook-Frage oben ab Frame 0 ('Wie viel Umsatz macht eine KI in 100 Tagen?'). Darunter die Briefseite (BRIEF, Empfänger schwarz) mit der ALTEN Versandzeile 'Versand: zzgl. 11,20 Euro … 5,20 Euro …' schon rot durchgestrichen, darunter die NEUE Zeile nur bis 'Bestellung.'. Stempel 'KEIN BELEG' erst ab Beat B08 (nur ein Textblock im Hook). Kein Umsatz-Zähler, kein TAG. | langsamer Push-in auf die durchgestrichene Zeile; Drop-Punch +4 % auf 'Umsatz' | Warum streicht die KI ihre eigenen Zahlen? | Wie viel Umsatz macht / eine KI in 100 Tagen? | pop@0.03, wqh@Umsatz-0.22, page@Umsatz, bump@Umsatz+0.04 |
| B02 hook | 0.74–3.38 | Nur Ereignisse, kein neuer Text: Strich-Linie zieht nach ('macht'), Beträge '11,20'/'5,20' wackeln ('Unternehmen'), Marker-Glanz über der neuen Zeile ('das@1.5'), Licht-Sweep ('KI@1.9'), vier weitere Briefseiten fächern dahinter auf (fünf Briefe, '100'), Tick auf 'Tage', Kamera rutscht auf 'lang' zurück auf die Zeile. | steht, atmet; Mini-Punch auf '100' | Was stand da vorher? | – | tick@macht, tick@Unternehmen, popHi@das@1.5, click@KI@1.9, page@100, tick@Tage, wshort@lang |
| B03 hook | 3.38–4.95 | Stempel 'GANZ ALLEINE.' oben auf 'alleine'; Punch-in auf 'führt?'; in der Pause danach (4,6) pulst die durchgestrichene Zeile einmal (kein neuer Text). | Punch-in 4 % auf 'führt?' | Wirklich ohne Mensch? | GANZ ALLEINE. | wq@ganz@3-0.06, clack@alleine, bump@führt, tick@4.6 |
| B04 hook | 4.95–6.17 | Brief fliegt raus (outAt 'Ich'), Gründungsplan blendet ein (planFrom 'Ich-0.05'), Maskottchen hüpft auf 'probier' (ganz im Bild, Augen frei). KEIN Tages-Slam (nicht erste Folge). Hook-Objekt überlappt nie den Plan. | Pull-back zum Board | Was ist das für ein Experiment? | – | wq2@Ich@4.5-0.05, popHi@probier, click@aus@5 · Pause roh 'aus.' → 'Die' 0,34 s (Stille-Messung) |
| B05 rueckblick | 6.17–9.25 | Gründungsplan ganz im Bild (wie Folge 13–18): WERBEBRIEF + ADRESSEN gold (current). Produkt-Karte 'SHIRTS MIT LOGO' auf 'verkauft'; auf 'Betriebe@8.6' kleine Handwerker-Silhouetten mit Shirt (kein Text). | ruhig, Board voll | Worum geht es hier? | SHIRTS MIT LOGO | wqh@Die@6.0-0.08, popHi@verkauft, tick@Betriebe@8.6 |
| B06 rueckblick | 9.25–10.60 | Banner 'erst auf Bestellung bestickt' in der Produkt-Karte. | steht | Ohne Lager? | erst auf Bestellung / bestickt | page@bestickt |
| B07 rueckblick | 10.60–13.10 | Am Feld WERBEBRIEF + ADRESSEN: auf '5@10.5' fächern FÜNF Briefseiten heraus (Empfänger schwarz, kein Text lesbar); auf 'Einkaufspreis@11.4' Stempel 'EINKAUF FEHLT' (Stand Folge 18, ≤ 4 Wörter, 2,2 s nach dem Banner) an einem leeren Preisschild neben den Briefen. | leichter Push-in auf die Briefe | Und was ist heute dran? | EINKAUF FEHLT | page@5@10.5, tick@Briefe@10.8, stamp@Einkaufspreis@11.4 |
| B08 heute | 13.10–15.41 | Pill 'HEUTE: VERSANDZEILE' auf 'Heute'. Kamera fährt in EINE Briefseite; auf 'Versandzeile@13.9' Marker über die alte Zeile 'Versand: zzgl. 11,20 … 5,20 …' (Beträge normal klein, Lieferzeit-Satz abgedeckt). | Fahrt vom Board in die Briefseite, Halt auf der Zeile | Was stimmt an der Zeile nicht? | HEUTE: VERSANDZEILE | wq2@Heute-0.1, chime@Heute+0.05, wshort@Versandzeile@13.9, tick@Versandzeile@13.9:end |
| B09 claude | 15.41–19.05 | Echter Shot 01 im Paper-Fenster (SHOT01), Einstieg 'Claude+0.15': nur die Anhang-Karte DOCX. Auf 'Briefe@16.0' orange Rahmen + Zeiger tippt '+', Karte hüpft; 'angehängt' Klick. Auf 'Websuche' Wechsel IM SELBEN Fenster auf SHOT07 (Marker 'das Web durchsucht'); auf 'Printful@17.9' Printful-Wort im Screenshot markiert (kein selbstgemaltes Logo). | Push-in auf Anhang-Karte, dann ruhiger Scroll im Fenster (kein Ortswechsel) | Was findet Claude? | Shot 01 Anhang-Karte DOCX (Screenshot, ≤ 4 lesbare Wörter) · Shot 07 Schritte-Zeile (Screenshot, 10 Wörter) | page@Claude, popHi@Briefe@16.0, click@angehängt, typing@Websuche, popLo@Printful@17.9 · Pausen: 'Versandzeile.' → 'Claude:' 0,57 s; 'Claude:' → 'Briefe' roh 0,43 s (STT 'Briefe'); 'angehängt,' → 'Websuche' 0,15 s (STT 'Websuche', kein 'Websearch'); 'Printful.' → 'Versandpreise' 0,60 s |
| B10 ergebnis | 19.05–21.50 | Ergebnis im selben Paper-Fenster: SHOT03 Bereich 'kein_beleg' ('Für die 11,20 € und 5,20 € habe ich keinen Beleg gefunden.', Marker auf 'keinen Beleg gefunden'). Auf 'Brief' Mini-Briefseite mit der alten Zeile rechts daneben (Beträge markiert). Auf 'Beleg@20.5' Stempel 'KEIN BELEG' (Lauf-Wort) auf den Beträgen der Briefzeile. | Halt auf dem Kernsatz, kleiner Push-in auf 'keinen Beleg' | Und jetzt? Andere Zahl rein? | Shot 03 Satz 'keinen Beleg gefunden' (≤ 12 Wörter) · KEIN BELEG | wshort@Versandpreise, page@Brief@19.8, tick@kein@20.3, stamp@Beleg@20.5 |
| B11 entscheidung | 21.50–23.46 | Entscheidung auf der Briefseite (Story-Objekt): auf 'streicht' zieht ein roter Strich über die Beträge der alten Zeile (= Frame-1-Bild); auf 'Beträge' blendet darunter die NEUE Zeile ein (SHOT02 bzw. lokale Briefansicht, NUR 'Versand: Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.'), kleines Häkchen 'in allen 5 Briefen' als Icon (5 Mini-Seiten blinken, kein Text). In der Pause vor 'Warum?' steht das Bild (Musik-Mulde). | Pull-back, Halt auf alt (durchgestrichen) → neu | Warum nicht einfach umrechnen? | neue Zeile (Screenshot/Brief, 9 Wörter) | wq2@Sie@21.3-0.1, roll@streicht, page@Beträge, tick@Beträge:end · Musik: Mulde Clip 22,55–23,38 (Kurve 0,018), Akzent auf 'Warum?' (23,46; Kurve 0,045), danach 0,03 |
| B12 warum | 23.46–27.93 | Alt→neu-Briefzeile rückt ins obere Drittel und bleibt. Pill 'WARUM?' auf 'Warum?'. Grund 1 auf 'Dollar': Karte 'NUR DOLLAR' mit Unterzeile 'im Lauf: Versandseite' (nie verallgemeinern), Gegenwert grau '€-Preis: kein Beleg'; Beleg-Textur SHOT03 Bereich 'nur_dollar'. Grund 2 auf 'geraten': Karte 'UMRECHNEN = GERATEN', Unterzeile 'kein angenommener Kurs'; Beleg SHOT03 Bereich 'kurs'. Je Grund ≥ 1,2 s; ~0,3 s Pause 'Dollar.' → 'Umrechnen'. | kurze Fahrt nach unten zu den Karten, Halt | Wie viel kostet der Versand dann? | WARUM? · NUR DOLLAR · UMRECHNEN = GERATEN | airy@Warum-0.1, pop@Warum, tick@Printful@24.0, popLo@Dollar, wshort@Umrechnen, clack@geraten |
| B13 offen | 27.93–31.80 | Fünf Logo-Shirts als Fünferpack mit IHREM Verkaufs-Preisschild (Kunden-Seite: Pfeil Kunde → Firma, nicht Printful). Schild fliegt auf '109' ein (noch ohne Text), Karte 'VERKAUF: 109 € / 5' auf 'Verkaufspreis'. Auf 'offen' Stempel 'OFFEN' aufs Schild. Beleg-Textur SHOT05 (Kopf 'Können die 109 € bleiben?' + 'nicht entscheiden'). 18,32 € NIE. | Fahrt von der Briefzeile zum Fünferpack (einziger Ortswechsel im Satz), Halt | Reicht der Preis überhaupt? | VERKAUF: 109 € / 5 · OFFEN | page@109, popHi@Verkaufspreis, tick@Shirts@30, stamp@offen |
| B14 offen | 31.80–35.15 | Neben dem Fünferpack zwei leere Felder: Karte 'EINKAUF ? · STEUER ?' auf 'Einkaufspreis@32' (≥ 1,2 s nach OFFEN); auf 'Umsatzsteuer-Status' pulst das Feld 'STEUER ?' (kein neuer Text). Beleg-Textur SHOT09 (Marker 'Printful-Preis' + 'Umsatzsteuerstatus'). | steht, kleiner Push-in auf die zwei Felder | Was heißt Umsatzsteuer-Status? | EINKAUF ? · STEUER ? | wshort@Ihr@31.5, popLo@Einkaufspreis@32, tick@Umsatzsteuer-Status |
| B15 als_naechstes | 35.15–38.53 | Pill 'ALS NÄCHSTES' auf 'Als'. Feld 'STEUER ?' wächst zur Frage-Karte 'MIT ODER OHNE?' auf 'Umsatzsteuer@36.8'; Beleg-Textur SHOT06 nur Absatz 'Achtung Umsatzsteuer … 19 %' (Marker). Am Board pulst GEWERBE (offen). Kein Steuerrat. | Push-in auf die Frage-Karte, Halt | Was ist besser? | ALS NÄCHSTES · MIT ODER OHNE? | airy@Als@35.0-0.1, pop@Als@35.0, tick@Mit@36, popHi@Umsatzsteuer@36.8 |
| B16 cta | 38.53–45.27 | Endkarte wie Folge 9–18 (end-Akt, itemTag 'DM'): Keyword 'Beleg' tippt auf '„Beleg“', Haken, Flieger. EIN Block 'PRÜF-PROMPT' auf 'Prompt' (Snip: Mini-Prompt-Karte ohne lesbaren Text außer 'Erfinde nichts.'). Ergebnis-Block '10 MIN: VERSANDZEILE GEPRÜFT' auf '10@41.9' (≥ 1,2 s nach PRÜF-PROMPT). CTA-Board zeigt Stand NACH der Folge: WERBEBRIEF + ADRESSEN gold (current, kein Haken: Briefe noch nicht versandfertig), DRUCK + PREIS Badge '5ER OFFEN', GEWERBE Badge 'UST ?'. Halt bis Ende (Endkarte ab 43,95), Bot-Hüpfer ~SEC-0,3. | ruhiger Push-in, Halt | – | Beleg (Keyword) · PRÜF-PROMPT · 10 MIN: VERSANDZEILE GEPRÜFT | pop@Kommentiere-0.15, typing@Beleg@39, check@Beleg@39:end, wqh@ich@40, popHi@Prompt, chime@In@41.7, tick@10@41.9, pop@Versandzeile@43, tick@44.97 |
## Risiken / Hinweise an Design
- Die lokale Briefansicht (alt durchgestrichen → neu) gibt es noch nicht (LAUF.md): Design baut sie aus den beiden .docx; Empfängerblock, Absender-Platzhalter, Website schwarz; Lieferzeit-Satz in beiden Zuständen abgedeckt.
- „Versandpreise im Brief“ (B10): Karte nie „Printful-Preise“ – es sind ihre Preise im Brief.
- Karte „NUR DOLLAR“ immer mit Unterzeile „im Lauf: Versandseite“ (Gegenprüfung zeigte Euro).
- Zwei Pausen > 0,7 s außerhalb „Warum?“: „Umsatzsteuer?“ → „Kommentiere“ 0,96 s (Akt-Naht, Bild bewegt sich: Endkarte fährt ein). „Prompt.“ → „In“ 0,62 s.
- Kollisionen (Anker immer Wort@Zeit): Versandzeile 13,97/43,28 · Printful 17,91/24,37 · Einkaufspreis 11,45/32,30 · Briefe 10,89/16,06 · 5 10,60/29,81 · Beleg 20,59/39,32 · ihr/Ihr 25,00/31,80 · mit/Mit 7,81/36,08.

## Änderungen Runde 2 (Tickets regie-R1-01..04, 2026-11-01)
- R1-01 B01: Frame 0 außer Hook-Frage ≤ 12 lesbare Wörter: alte Zeile nur Beträge „11,20 € · 5,20 €“ scharf durchgestrichen (Rest weich), neue Zeile bis „Bestellung.“ (9 W.).
- R1-02 B14: Ereignis „Umsatzsteuer-Status+0.85“ (~34,2 s, Badge UST ? am Board-Feld GEWERBE blinkt, tick); B15: Ereignis „Umsatzsteuer@36.8+0.7“ (~37,6 s, GEWERBE pulst, popLo). Keine Lücke > 1,5 s zwischen 6,17 und 43,95.
- R1-03 B12: Gegenwert „€-Preis: kein Beleg“ gestrichen, Unterzeile „im Lauf: Versandseite“ bleibt; Shot-03-Bereich nur weiche Textur mit Marker, Briefzeile oben abgedunkelt.
- R1-04 B09: wort_start = Claude@15.0.
- Slot jetzt 2026-11-01 18:00 (Chef-Umplanung); Stimme, words.json, Musik unverändert.

## Änderungen Runde 3 (Ticket regie-R2-01)
- B05: Ereignis auf „Logo@7.9“ (~7,98 s, Logo-Glanz auf der Shirt-Karte, tick) und Silhouetten auf „kleine@8.3“ (8,38 s) statt „Betriebe“ → Lücken 7,09→7,98→8,38→8,67 alle < 1,5 s.
- B07: Ereignis auf „fehlt@12.1“ (12,17 s, Preisschild wackelt, tick) → 11,45→12,17→13,10 < 1,5 s.
- Damit keine Lücke > 1,5 s zwischen 6,17 und 43,95 s (alle Beats geprüft gegen words.json).
