# Prüfung Autor · Folge 19 (firma-tag19) · Runde 1 · 2026-10-31
Prüfer: frischer Prüf-Agent (nicht Ersteller). Geprüft: briefing.md, ../firma-tag18/tagesbriefing-2026-11-01.md, thema.md, hooks.md, script.txt, caption.txt, prompt-fuer-kommentare.md, replies.json, design/lauf/LAUF.md (inkl. Gegenprüfung), design/lauf/bericht.md. Regeln: runs/firma-tag9/tagesbriefing-2026-10-30.md, references/bewertung.md (autor), Auftrag Chef (Übergabe „Mit oder ohne Umsatzsteuer?“ bestätigt). Alt-Fassung Skript: pruefung/script-r1.txt.

## Harte Prüfungen
| Punkt | Befund | ok |
|---|---|---|
| Wörter | `wc -w script.txt` = 100 (Grenze) | ✓ |
| Sätze ≤ 12 | längster freier Satz 8 (CTA „Damit prüfst du …“); feste Sätze 15 ausgenommen | ✓ |
| Slot 12:00, nicht erste Folge | kein „Tag“, kein „gestern“ (grep 0 in script/caption) | ✓ |
| Rückblick ↔ Folge 18 final (R2) | F18 final: „Ohne Printful-Konto findet sie keinen Einkaufspreis. / Ihren Verkaufspreis fürs Fünferpack lässt sie offen. / Als Nächstes: Stimmt die Versandzeile?“ → F19 „Fünf Briefe, Einkaufspreis fehlt.“ + „Heute prüft sie ihre Versandzeile.“ | ✓ Kette ohne Sprung |
| Caption | 2009 Zeichen (< 2100); „(Fiktives Experiment, keine echten Umsätze.)“, danach nur Hashtags; keine Emojis; Menüpfad claude.ai → „+“ → anhängen | ✓ |
| „Printful nennt ihr nur Dollar“ nie verallgemeinert | script.txt:7 „nennt ihr“; caption.txt:10 „Die Versandseite zeigt ihm nur Dollar“; prompt-fuer-kommentare.md:19 ausdrücklich ausgeschlossen; Gegenprüfung LAUF.md:32 (Euro bei anderem Abruf) | ✓ |
| Lieferzeit nicht behauptet | Skript ✓, Caption ✓ (nur „in der Regel“, keine Zahl), replies ✓; **aber** hooks.md:9 (Frame 1 = neue Zeile) und prompt-fuer-kommentare.md:8 (Vorher/Nachher) zeigen die volle neue Zeile inkl. „2 bis 5 Werktage“ als gutes Beispiel | ✗ → T-04 |
| Neue Zeile nicht als „Versand extra“ | Skript ✓, Caption zitiert neue Zeile wörtlich ✓, Guide schließt Claudes Satz aus ✓. caption.txt:3 nennt die ALTE Zeile „Versand extra“ im Präsens → T-05 (klein) | (✓) |
| Nur Belegtes | 11,20/5,20 kein Beleg ✓ (03), gestrichen ✓ (02, Diff), „Umrechnen wäre geraten“ ✓ (03), 109 nicht entscheidbar ✓ (05), Einkaufspreis + USt-Status ✓ (09). **caption.txt:18 „Netto sind das 18,32 € pro Shirt“** gilt laut Lauf nur „mit USt-Ausweis“ – ausgerechnet die offene Frage der Folge | ✗ → T-03 |
| Echter Lauf | Chat 0c969b98…, 16:28:14–16:30:02, Gedächtnis aus, kein Konnektor, kein Login/Kauf; Screenshots 01–10 | ✓ |
| Kommentar-Mechanik | prompt-fuer-kommentare.md fertig (Prompt A/B, Regel, Gegencheck, 1:1-außer); replies.json 1 + 5 Varianten, je mit leichter Frage, keine Emojis | ✓ |
| Kein „du“ außerhalb CTA | ✓ | ✓ |
| Wiederholung „Fünferpreis offen“ aus F18 | Fortschritt vorhanden: Beträge gestrichen (neue Datei) + neue fehlende Größe Umsatzsteuer-Status → neue Übergabe. Eigenständig für Neue ✓ – aber gehört ist „Hundertneun Euro für fünf Shirts?“ nicht als ihr Verkaufspreis erkennbar (T-01) | (✓) |

## Noten
| Kriterium | Note | Beleg / Begründung |
|---|---|---|
| Neuer Zuschauer versteht in 5 s | 9 | script.txt:1 feste Frage |
| Mehrwert (nachbaubar, ≤ 14 s, heute umsetzbar) | 8 | „Heute …“ ≈ 13,8 s, Weg direkt danach; Prüf-Prompt im Guide |
| Thema (Schmerz, ein Bild) | 8 | „Zahl im Angebot ohne Beleg“ kennt jeder; Bild alte Zeile durchgestrichen |
| Hook (Satz 2 + Frame 1 → Frage, Muster) | 7 | M-002/M-011 ✓; Frame 1 soll laut hooks.md:9 die ganze neue Zeile zeigen = Lieferzeit-Behauptung im Bild + > 12 neue Wörter (Regel „ein Textblock, Karten ≤ 4 Wörter“) → T-04 |
| Kommentar-Mechanik | 7 | Guide-Nachher macht die umstrittene Lieferzeit (2–5 vs. 5–20, LAUF.md:24/32) zum Vorbild → T-04 |
| Länge / Satzbau / Serienregeln | 9 | 100 W., Schätzung ≈ 46 s / 130 wpm; Entscheidung mit 2 Gründen (nur Dollar, Umrechnen geraten) |
| **Beim reinen Zuhören eindeutig (wer zahlt wem was)** | **6** | T-01, T-02 |
| Fakten / nur Belegtes | 7 | T-03 |
| Caption / Replies | 8 | s. o., T-05 klein |

K.-o.: keines verletzt. **Nicht bestanden** (vier Kriterien < 8).

## Zuhör-Test (nur Ton, als neuer Zuschauer)
1. script.txt:5 „Die alten Versandpreise: kein Beleg.“ – welche Versandpreise? Gehört direkt nach „Websuche bei Printful“ klingt es wie Printfuls alte Preise. Dass es die Preise sind, die SIE im Brief ihren Kunden berechnet, ist nicht hörbar.
2. script.txt:8 „Hundertneun Euro für fünf Shirts? Bleibt offen.“ – folgt auf Printful/Dollar und vor „Einkaufspreis“. Ein Neuer kann 109 € als Printfuls Preis für fünf Shirts hören (genau die Einkauf/Verkauf-Falle aus Folge 18, Ticket autor-R1-01 dort). „Verkaufspreis“ fehlt.

## Tickets
```
TICKET autor-R1-01 → firma-autor
Kriterium: Beim Zuhören eindeutig · Note: 6/10
Beleg: script.txt:8 „Hundertneun Euro für fünf Shirts? Bleibt offen.“
Problem: 109 € ist gehört nicht als IHR Verkaufspreis erkennbar (kann als Printful-/Einkaufspreis gehört werden).
Soll: Satz enthält hörbar „Verkaufspreis“, „Hundertneun Euro“ und „fünf Shirts“ bleiben, ≤ 12 Wörter; „offen“ bleibt.
```
```
TICKET autor-R1-02 → firma-autor
Kriterium: Beim Zuhören eindeutig · Note: 7/10
Beleg: script.txt:5 „Die alten Versandpreise: kein Beleg.“
Problem: Bezug fehlt – gehört nach „Websuche bei Printful“ wie Printfuls Preise statt die Preise in ihrem Brief.
Soll: Satz verankert die Preise hörbar im Brief („im Brief“), „kein Beleg“ bleibt, ≤ 12 Wörter.
```
```
TICKET autor-R1-03 → firma-autor
Kriterium: Fakten / nur Belegtes · Note: 7/10
Beleg: caption.txt:18 „Netto sind das 18,32 € pro Shirt“; Lauf LAUF.md:26 „mit USt-Ausweis bleiben … 18,32 €“
Problem: 18,32 € gilt nur mit Umsatzsteuer – genau die offene Frage der Folge; ohne Bedingung falsch für Kleinunternehmer.
Soll: Caption nennt die Bedingung („Mit Umsatzsteuer bleiben netto 18,32 € pro Shirt“ o. ä.); keine weitere Zahl.
```
```
TICKET autor-R1-04 → firma-autor
Kriterium: Hook / Kommentar-Mechanik · Note: 7/10
Beleg: hooks.md:9 + thema.md:43 (Frame 1 neue Zeile, Ellipse), prompt-fuer-kommentare.md:8 (Nachher mit „2 bis 5 Werktage“)
Problem: Die neue Zeile enthält Claudes Lieferzeit, die sich mit Printfuls Europa-Angabe 5–20 Werktage widerspricht (LAUF.md:24, 32); als Ergebnis-Bild bzw. Vorbild wäre das eine Lieferzeit-Behauptung, im Bild außerdem > 12 neue Wörter.
Soll: hooks.md/thema.md: Frame 1 zeigt von der neuen Zeile nur „Die Versandkosten nenne ich Ihnen vor Ihrer Bestellung.“, Lieferzeit-Teil abgeschnitten/abgedeckt; Guide-Nachher zeigt nur diesen Satz, Lieferzeit-Teil ausdrücklich als „im Lauf von Claude eingesetzt, Quellen widersprechen sich – nicht übernehmen“.
```
```
TICKET autor-R1-05 → firma-autor
Kriterium: Caption · Note: 8/10 (klein)
Beleg: caption.txt:3 „Fünf Werbebriefe stehen, darin Versand extra: 11,20 € …“
Problem: Präsens liest sich wie der aktuelle Stand, obwohl die Folge genau diese Beträge streicht.
Soll: als bisheriger Stand markiert („darin stand bisher: Versand zzgl. …“); „Versand extra“ nie für die neue Zeile.
```
```
TICKET autor-R1-06 → firma-autor
Kriterium: Länge · Note: 9/10 (Bedingung)
Beleg: script.txt (100 Wörter)
Problem: T-01/T-02 brauchen Wörter, Grenze erreicht.
Soll: `wc -w` 85–100, kein freier Satz > 12 Wörter; feste Sätze, Rückblick-Satz 2, „Heute …“, Warum-Block und Übergabe unverändert; gekürzt nur bei CTA-„Damit“ / „alten“.
```
Folgeänderungen: thema.md Faktentabelle/Länge, hooks.md „Danach“, TTS-Risikowörter (neu „Verkaufspreis“), prompt-fuer-kommentare.md CTA-Zitat.
