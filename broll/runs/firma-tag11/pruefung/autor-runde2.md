# Prüfung autor · Folge 11 „Gewerbe“ · Runde 2

Prüfer: frischer Prüf-Agent (firma-pruefer), 2026-10-30. Auftrag: Fehler finden. An den Autor-Dateien nichts geändert.
Prüflinge: script.txt, thema.md, hooks.md, caption.txt, prompt-fuer-kommentare.md.
Maßstab: bewertung.md „autor“; briefing.md inkl. Chef-Hinweise 2026-10-30; firma-tag9/tagesbriefing-2026-10-30.md (alle Regeln K.-o., Chef-Entscheide); Runde 1 `pruefung/autor-runde1.md`.
Belege: design/lauf/LAUF.md, bericht.md, checkliste-text.txt, Screenshots 01–07; Vorfolge firma-tag10/script.txt; Folgefolge firma-tag12/script.txt; Zeitkalibrierung firma-tag10/regie/words.json (Tempo 1,0, 100 Wörter) und public/firma-ep/tag9/words.json.

## Messwerte
- script.txt: **100 Wörter** (`wc -w`) ✓ (Obergrenze genau, null Reserve).
- Sätze: Eröffnung 15/4 (fest), Rückblick 1 = 15 (fest); sonst 2/5/8/4/1/5/6/6/7/10/12 → alle ≤ 12 ✓.
- „du/dir/dein“ und Imperativ nur im CTA (script.txt:9) ✓. Kein „Tag N“, kein „Tag drei“, kein „gestern“ ✓. Einziges „Tag“: „Pflicht ab dem ersten Tag“ (script.txt:6) = Claudes Wortlaut, kein Serientag (s. Ticket an Regie: Karte nicht „TAG EINS“).
- Hamburg (`grep -ic`): script.txt 0, caption.txt 0 ✓. prompt-fuer-kommentare.md **1** – nur im Abnahmebefehl „`grep -ic hamburg` = 0“ (Z. 29); ebenso `hmb` 1 (Z. 29). Inhaltlich kein Ortsname im Guide-Soll, formal aber 1 Treffer, und Z. 3 behauptet „In dieser Datei steht der Stadtname … bewusst nicht“ (s. T-01). hooks.md/thema.md intern (Abdeck-Hinweise) ok.
- caption.txt: **2078 Zeichen** ohne Schluss-Umbruch (2079 mit) < 2100 ✓. Zeichen > U+2000 nur „ und “ → keine Emojis ✓. Ende „(Fiktives Experiment, keine echten Umsätze.)“ + Leerzeile + nur Hashtags ✓. „Keine Rechtsberatung.“ ✓.
- Datei-Stempel (checkliste-text.txt): 9× „Mensch“, 4× „Claude“, 13 Punkte ✓ → „dreizehn Punkte“ belegt.
- Zeit (F10 words.json, gleiche Stimme Tempo 1,0): Eröffnung 0–6,29 s; Rückblick-Satz 1 6,81–11,53 s = 4,72 s ✓ (thema.md stimmt); Satzpause 0,17 s ✓; F10-Rückblick gesamt 6,43 s; „Heute“ F10 bei 13,84 s.
  - Satz 2 „Website-Entwurf, offline.“: thema.md rechnet 6 Silben × 0,21 s = 1,26 s. Wortbasiert aus echten Messungen ist das knapp: „Website.“ 0,60 s (F10), „Entwurf“ 0,42 s (F9), Komma-Pause 0,12–0,16 s (F10 „Betriebe,“), „online.“ 0,49 s (F10) → „offline.“ ≈ 0,5–0,55 s ⇒ Satz 2 realistisch **1,35–1,65 s** ⇒ Rückblick **6,24–6,54 s** (Grenze 6,5 s). Mit der Regie-Vorgabe in thema.md (Satzpause ≤ 0,25 s, Komma ≤ 0,15 s) haltbar, aber nicht mit Reserve → Messpflicht für die Regie (T-03).
  - „Heute“-Start: 6,81 + 6,24–6,54 + 0,5–0,6 s = **13,6–13,95 s** ≤ 14,5 s ✓.
  - Gesamt: Silben-Schätzung (Vokalgruppen) F10 176, F11 169, F12 169 bei je 100 Wörtern und gleicher Satzzeichenzahl wie F10 (24) → F11 ≈ 44–46 s wie F10 (45,16 s, 133 wpm) ✓ 120–135 wpm.
- Wort „Claude“ gesprochen: 0 (wie F10/F12; Werkzeug nur im Bild, Screenshot 01/06/07).

## Faktenabgleich
| Gesprochen / geschrieben | Beleg | Urteil |
|---|---|---|
| „Website-Entwurf, offline.“ (Rückblick = Ergebnis F10) | F10 script.txt:4 „Startseite fürs Handy“, :8 „Ohne Impressum und Datenschutzerklärung nicht online.“; Chef-Hinweis briefing.md:21 „(Website-Entwurf, nicht online)“ | ✓ Ergebnis F10 richtig. „offline“ statt „nicht online“ leicht unschärfer (klingt minimal nach „war mal online“), vertretbar. |
| „Heute: Was muss sie anmelden?“ | F10 script.txt:9 wörtlich „Als Nächstes: Was muss sie anmelden?“; LAUF.md:12 Prompt | ✓ Kette exakt |
| „Letztes Ergebnis angehängt, Websuche: dreizehn Punkte als Word-Checkliste.“ | LAUF.md:7 Anhang „Shirt-Firma Ergebnis Website.md“ (Titel „Ergebnis Website-Entwurf“); :16 „18 Websuchen“; :20 „13 Punkte in 3 Phasen“, Datei-Karte „DOCX“ (06) | ✓ alles belegt, nichts erfunden |
| „Als Erstes: das Gewerbe.“ | Chat „Als Erstes kommt die Gewerbeanmeldung …“; Datei Z. 4 | ✓ |
| „Pflicht ab dem ersten Tag.“ | Chat Grund 1 „Sie ist Pflicht ab dem ersten Tag.“ | ✓ wörtlich |
| „Die anderen Schritte bauen darauf auf.“ | Chat Grund 2, fette Überschrift wörtlich | ✓ wörtlich; R1-02 gelöst (kein verschobenes „erst“) |
| „Haken: Das kann nur ein Mensch.“ | Datei Punkt 1 „Mensch – Du reichst ein und zahlst.“ (checkliste-text.txt:21–22); Chef: Beleg = Datei | ✓; passt zu F12 script.txt:2 „Gewerbe macht nur ein Mensch.“ ✓ |
| „Als Nächstes: Wen spricht sie zuerst an?“ | F12 script.txt:5 „Die KI würde fünf zuerst ansprechen.“; Lauf 12 LAUF.md:13/:42 | ✓ beantwortet in F12 (dort „Heute sucht sie zwanzig Betriebe.“, nicht wörtlich gespiegelt wie 10→11; Sache von F12, kein Abzug hier) |
| CTA „Frage und echte Checkliste … in zehn Minuten eine Checkliste für dein eigenes Business“ | prompt-fuer-kommentare.md:6–9 (Vorlage A/B + echte Checkliste); Lauf 4:52 | ✓ lieferbar, keine Vollständigkeit; R1-03 gelöst |
| Caption „Die anderen Schritte bauen darauf auf: Danach folgt der Fragebogen beim Finanzamt, dann die Steuernummer, die das Verpackungsregister braucht.“ | Chat Grund 2 | ✓ Reihenfolge wie Lauf |
| Caption „Und sie ist schnell und günstig.“ | Chat Grund 3 (Betrag/Ort weggelassen) | ✓ R1-07 gelöst |
| Caption „Claude kann dort nur vorbereiten oder einbauen.“ | Datei Pkt 1/2/6 „vorbereiten“, Pkt 4/10 „einbauen“, Pkt 11 „einbinden“, Pkt 3 „durchrechnen“, Pkt 7 „durchgehen“ | ✓ ausreichend genau |
| Guide-Tabelle [Ort]-Stellen | checkliste-text.txt Z. 8, 18, 19, 24, 95, 131; Chat-Überschrift, Grund 3, Nicht-prüfen, Quellen | ✓ alle Textstellen erfasst. **Lücke Bilder:** `05-nicht-pruefen.png` zeigt zweimal „Hamburg“ („Die Seite von Hamburg Service … Handelskammer Hamburg.“, selbst gesichtet) und fehlt in Tabellenzeile 10 (T-01). 01, 06, 07 gesichtet/geprüft: ohne Ort. |

## Telegrammstil Weg-Satz (Auftrag ausdrücklich)
„Letztes Ergebnis angehängt, Websuche: dreizehn Punkte als Word-Checkliste.“
- **Verständlich beim ersten Hören: ja, knapp.** Die Rolle des Satzes (so wurde es gemacht → das kam raus) ist erkennbar, weil er direkt auf „Heute: Was muss sie anmelden?“ folgt und mit „dreizehn Punkte als … Checkliste“ in einem greifbaren Ergebnis endet. Der Doppelpunkt nach „Websuche“ trägt die Logik „Suche → Ergebnis“ richtig.
- Schwächen: (1) „Letztes Ergebnis“ ist abstrakt; dass es der Website-Entwurf ist, muss der Neue aus dem Satz davor schließen. (2) Drei Handlungen in 8 Wörtern (~2,5 s) ohne Subjekt und ohne „Claude“ – Hörer ohne Bild verliert, wer etwas tut. (3) „Word“ kippt in der TTS leicht zu „Wort-Checkliste“ (thema.md:60 hat es als Risikowort ✓).
- Getragen wird er durch die Bildfolge thema.md:54 (01 Anhang-Karte → 02 Quellen → 06 DOCX-Karte, je ein Bild pro Satzteil). Serienstil ist konsistent mit F10 („Auftrag mit Logo: Startseite fürs Handy.“) und F12 („Letztes Ergebnis als Anhang, Websuche, Excel-Liste.“), also bewusst und von Pius' Maßstabsfolgen gedeckt.
- Optionale Schärfung ohne Mehrwörter: „Entwurf als Anhang, Websuche: dreizehn Punkte als Word-Checkliste.“ (8 Wörter; „Entwurf“ greift den Rückblick auf und entspricht dem Anhang-Titel „Ergebnis Website-Entwurf“). Kein Muss, weil F12 dieselbe Formel „Letztes Ergebnis“ nutzt.

## Doppeltes „Checkliste“ im CTA (Auftrag ausdrücklich)
„… ich schick dir Frage und echte Checkliste. Damit hast du in zehn Minuten eine Checkliste für dein eigenes Business.“
- **Stört leicht, kein Fehler.** Die Unterscheidung „echte (unsere) Checkliste“ vs. „eine (deine) Checkliste“ ist logisch richtig, klingt beim Hören aber wie eine Wiederholung; der Damit-Satz verspricht scheinbar dasselbe, was man schon geschickt bekommt, und verliert dadurch Zugkraft. Mit „Word-Checkliste“ im Weg-Satz fällt „Checkliste“ in 25 s dreimal.
- Vorschlag (12 Wörter, Formel erhalten, keine Vollständigkeit): „Damit hast du in zehn Minuten deine Startliste für dein eigenes Business.“ (T-02, Hinweis).

## Bewertung
| Kriterium | Note | Beleg |
|---|---|---|
| Neuer versteht in 5 s, worum es geht | 9 | script.txt:1 feste Eröffnung wörtlich, ohne Tag (Folge 11 nicht erste des Tages) ✓; hooks.md:8 Text-Hook + Stempel „GANZ ALLEINE.“ |
| Neueinstieg/Rückblick (Produkt + Stand, ≤ 6,5 s, „Heute“ ≤ 14,5 s) | 8 | script.txt:2 Produkt + Ergebnis F10 ✓ (6 Silben ≤ 11). Kalibrierung jetzt mit echter Tempo-1,0-Stimme F10 ✓ (R1-06 gelöst), Regie-Vorgabe für Pausen vorhanden ✓. Abzug: 0,21 s/Silbe für „Website-Entwurf, offline.“ ist optimistisch; wortbasiert 6,24–6,54 s → keine Reserve (T-03 an Regie). |
| Mehrwert: nachbaubare Schritte mit Claude, Beginn ≤ 14 s | 8 | script.txt:4 Weg-Satz neu: Anhang, Websuche, Ergebnis Word-Checkliste mit 13 Punkten ✓ (R1-01-Soll erfüllt, „dreizehn“ jetzt eingeführt). Volle Prompt-Anleitung in Caption Z. 5–8 und Guide ✓. Abzug: Telegrammstil ohne Subjekt, „Claude“ nur im Bild; Weg beginnt bei ≈ 15,5–16 s (F10: „Heute …“ 1,57 s + 0,58 s Pause; strukturell durch feste Eröffnung + Rückblick, wie F9/F10, Chef-Regel „Heute ≤ 14,5 s“ erfüllt). |
| Thema: Schmerz sofort bekannt, Ergebnis in einem Bild | 9 | thema.md:5 „Was muss ich anmelden, bevor ich was verkaufe?“; Bild = echte Word-Checkliste mit „Mensch“-Stempeln ✓; Kette Tagesbriefing Zeile Folge 11 ✓ |
| Hook: Satz 2 + Frame 1 erzeugen Frage, Muster belegt | 9 | hooks.md:8–10: „GANZ ALLEINE.“ gegen „Mensch“-Stempel; Zähler „9 von 13“ aus Frame 1 entfernt, Blöcke nacheinander (R1-08 gelöst) ✓; M-002/M-011; Abdeckpflicht Ort ✓ |
| Entscheidung der KI klar erkennbar und 1:1 | 8 | script.txt:5 „Als Erstes: das Gewerbe.“ = Lauf ✓. Weiter ohne Handelnden („sie“/„Claude“ fehlt), durch Weg-Satz davor aber als Ergebnis der Recherche verständlich. |
| Warum: 2–3 konkrete Gründe 1:1 aus dem Lauf, verständlich | 8 | script.txt:6 beide Gründe wörtlich aus dem Chat ✓ (R1-02 gelöst). Abzug: Grund 2 „Die anderen Schritte bauen darauf auf.“ ist gehört abstrakt (welche Schritte?), konkret wird er erst über die Pfeilkarte Gewerbe → Finanzamt → Steuernummer → Verpackungsregister (thema.md:56) – Regie muss die Karte genau auf diesen Satz legen. |
| Haken korrekt, nichts als erledigt erzählt | 9 | script.txt:7 neutral „Das kann nur ein Mensch.“ (Chef-Formel) ✓; „angehängt“ ist ein wirklich erfolgter Schritt (LAUF.md:4) ✓; kein „ich melde an“ ✓; Board ohne Haken (thema.md:57) ✓ |
| Schritt-Kette + Übergabe | 9 | Rückblick nennt Ergebnis F10 richtig ✓; „Heute“ = Übergabe F10 wörtlich ✓; Übergabe „Wen spricht sie zuerst an?“ von F12 (script.txt:5) beantwortet, von Lauf 11 nicht ✓; F12-Rückblick „Gewerbe macht nur ein Mensch.“ passt zu Haken ✓ |
| CTA: konkreter Wert, nur Lieferbares, Formel | 8 | script.txt:9 Lieferung „Frage und echte Checkliste“ ✓, kein „Pflicht-Checkliste“ ✓, Formel „Damit hast du in zehn Minuten … für dein eigenes Business“ ✓ (R1-03 gelöst). Abzug: doppeltes „Checkliste“, Damit-Ergebnis klingt wie die Lieferung selbst (T-02). |
| Kommentar-Mechanik (prompt-fuer-kommentare.md) | 8 | Vorlage A + B ✓, „[BERUF]“ 0 ✓, Beispiele nach Beruf mit A/B ✓ (R1-05 gelöst); [Ort]-Tabelle deckt alle Textstellen aus Datei und Chat ✓, Gebühr-Entscheid begründet und mit Chef-Hinweis vereinbar („nur als … sonst nicht“ erlaubt Weglassen) ✓. Abzug: Bildzeile 10 vergisst `05-nicht-pruefen.png` (2× Hamburg im Bild), Abnahmebefehl enthält selbst „hamburg“/„hmb“ trotz Z. 3 „steht … nicht“ (T-01). |
| Länge/Satzregeln/Bildschirmtext | 8 | 100 Wörter ✓, Sätze ≤ 12 ✓, Karten ≤ 4 Wörter geplant (thema.md:56) ✓, TTS-Risikowörter ✓. Abzug: null Wortreserve; Weg-Satz = drei Handlungen in einem Satz (Grenzfall „ein Gedanke pro Satz“). |
| Caption | 9 | 2078 < 2100 ✓, Fiktiv-Ende + nur Hashtags ✓, Gründe 1:1 inkl. Lauf-Reihenfolge ✓, keine Gebühr-Formel ✓, „vorbereiten oder einbauen“ ✓, „Keine Rechtsberatung.“ ✓. Kleinigkeit: Prompt in Z. 7 kürzt „mit zwei bis drei konkreten Gründen“ zu „begründe es“ (Guide-Vorlage hat es vollständig). |
| Claude-Behauptungen belegt | 9 | Alle Zahlen/Wörter (13, 9/4, 18 Websuchen, 17 Links, 4:52, DOCX, Gründe) aus LAUF.md/Datei ✓ |
| Rechtliche Aussagen nicht als Rechtsberatung | 9 | Gesprochen nur Claudes Wortlaut, keine absolute Eigenaussage mehr ✓; Caption/Guide mit Hinweis ✓ |
| Keine private Info, keine Ansprache | 8 | Hamburg 0 in Skript/Caption ✓, Regie-Abdeckpflicht für 03/04/02 ✓, keine Ansprache außerhalb CTA ✓. Abzug: 05-Lücke + literaler Treffer in der Guide-Vorgabe (T-01). |

## K.-o.-Check
| K.-o. | Ergebnis |
|---|---|
| Zuschauer direkt angesprochen außerhalb CTA | nein ✓ |
| Ergebnis nicht aus echtem claude.ai-Lauf | nein, Chat 6358742d, 4 min 52 s ✓ |
| Unbelegte Claude-Behauptung | nein ✓ |
| ChatGPT statt Claude | nein ✓ |
| Versprechen nicht lieferbar | nein ✓ („eine Checkliste“, keine Vollständigkeit) |
| „Niemand hat kommentiert“ | nein ✓ |
| Warum fehlt | nein, 2 Gründe ✓ |
| Neuer versteht Projekt + heutigen Schritt bis ~14 s | ja ✓ („Heute“ 13,6–13,95 s) |
| Sprung/Wiederholung in der Kette | nein ✓ |
| > 100 Wörter | nein, genau 100 ✓ |
| Satz > 12 Wörter (ohne feste Eröffnung/Rückblick 1) | nein ✓ |
| Tag genannt / „Tag drei“ / „gestern“ | nein ✓ („ersten Tag“ = Claudes Grund, kein Serientag) |
| Hamburg in Video/Caption/Guide | Skript/Caption 0 ✓. Guide-Vorgabe: kein Ortsname als Inhalt; einziger Treffer ist der Prüfbefehl selbst → kein K.-o., aber T-01 (Chef kann strenger entscheiden). Bild 05 ist ein **Risiko für die Guide-Stufe**, kein Verstoß dieser Stufe. |
| Caption ≥ 2100 / falsches Ende / Emojis | nein ✓ |
| Etwas als erledigt erzählt | nein ✓ |

## Gesamt
**Bestanden.** Alle 16 Kriterien ≥ 8, kein K.-o. verletzt. Alle acht Tickets aus Runde 1 sind nachweislich gelöst (R1-01 Weg-Satz, R1-02 Grund 2 wörtlich, R1-03 CTA, R1-04 [Ort]-Tabelle, R1-05 [BERUF]/Vorlage B, R1-06 Kalibrierung mit echter Tempo-1,0-Stimme, R1-07 Caption, R1-08 Frame 1). Knapp ist es an drei Stellen: Rückblick-Zeit ohne Reserve (Regie muss messen), Telegramm-Weg-Satz nur mit Bild voll verständlich, und das doppelte „Checkliste“ im CTA. T-01 sollte vor der Guide-Stufe erledigt sein (eine Zeile), T-02 ist Geschmack, T-03 geht an die Regie.

## Tickets
```
TICKET autor-R2-01 → firma-autor
Kriterium: Kommentar-Mechanik / private Info · Note: 8/10 (Hinweis, vor Guide-Stufe erledigen)
Beleg: prompt-fuer-kommentare.md:25 (Bildzeile nennt 02, 03, 04, checkliste-ansicht, nicht 05); design/lauf/05-nicht-pruefen.png („Die Seite von Hamburg Service … Handelskammer Hamburg.“); prompt-fuer-kommentare.md:29 (`grep -ic hamburg`, `grep -ic hmb`) vs. :3 „steht … bewusst nicht“
Problem: Das Bild zur Nicht-prüfen-Liste zeigt den Ort zweimal und fehlt in der Abdeck-Liste; die Datei enthält den Ortsnamen selbst im Prüfbefehl.
Soll: Zeile 10 der Tabelle nennt `05-nicht-pruefen.png` (vorletzter Listenpunkt beschnitten/abgedeckt oder Bild nicht verwenden). `grep -ic hamburg prompt-fuer-kommentare.md` = 0 und `grep -ic hmb` = 0 (Prüfbefehl z. B. als Verweis „Stadtname aus LAUF.md:17, Ortskürzel aus Quelle Punkt 9“ oder `grep -ic "hambu[r]g"`), Z. 3 stimmt danach wörtlich.
```
```
TICKET autor-R2-02 → firma-autor
Kriterium: CTA · Note: 8/10 (Hinweis, optional)
Beleg: script.txt:9 „… Frage und echte Checkliste. Damit hast du in zehn Minuten eine Checkliste für dein eigenes Business.“; script.txt:4 „Word-Checkliste“
Problem: „Checkliste“ fällt im CTA doppelt (dreimal in ~25 s); der Damit-Satz klingt wie die Lieferung selbst statt wie ein eigenes Ergebnis.
Soll: Der Damit-Satz nennt ein Ergebnis ohne das Wort „Checkliste“ und ohne Vollständigkeitsversprechen (z. B. „Damit hast du in zehn Minuten deine Startliste für dein eigenes Business.“), ≤ 12 Wörter, Formel „Damit hast du in <Zeit> … für dein eigenes Business“ erhalten, script.txt weiter ≤ 100 Wörter; Caption Z. 14 und prompt-fuer-kommentare.md:6 gleich angepasst.
```
```
TICKET autor-R2-03 → firma-regie
Kriterium: Neueinstieg/Rückblick · Note: 8/10 (Hinweis)
Beleg: thema.md:65 (1,26 s für „Website-Entwurf, offline.“); firma-tag10/regie/words.json („Website.“ 0,60 s, „online.“ 0,49 s, Komma-Pause 0,16 s); public/firma-ep/tag9/words.json („Entwurf“ 0,42 s)
Problem: Wortbasiert dauert Satz 2 eher 1,35–1,65 s, der Rückblick damit 6,24–6,54 s – an der Grenze 6,5 s.
Soll: Regie misst in words.json „Die“ bis Ende „offline.“ ≤ 6,5 s und „Heute“-Start ≤ 14,5 s (sonst Pausen nach thema.md:65 kürzen, nie Tempo > 1,0); TTS-Test „Word-Checkliste“ ergibt hörbar „Wörd“, nicht „Wort“; die Warum-Karte zu Grund 1 enthält nicht „TAG“ als alleinstehendes Wort (keine Verwechslung mit Serientag), die Pfeilkarte zu Grund 2 liegt auf genau diesem Satz.
```
