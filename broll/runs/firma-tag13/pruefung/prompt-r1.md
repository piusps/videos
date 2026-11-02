# Folge „Werbebrief“: Frage + Briefvorlage + drei Wege (Lieferung für Kommentare „Brief“)

## Was der Guide liefern muss
Gesprochen verspricht das Skript: „Frage und Briefvorlage. Damit hast du in zehn Minuten einen Briefentwurf für dein eigenes Business.“ Die Caption verspricht zusätzlich: „die drei Wege im Vergleich mit Quellen“. Genau das, nicht mehr:
1. **Die Frage zum Kopieren**, zwei Varianten: A mit Anhang (letztes Ergebnis + Logo), B ohne Anhang (unten).
2. **Die echte Briefvorlage** = Claudes Brief aus dem Lauf (`design/lauf/brief-text.txt`) 1:1 mit allen Platzhaltern in eckigen Klammern, Kolonnenshirt-Angaben als Beispiel markiert, inkl. Betreff „Werbung: …“ und abgetrenntem Widerspruchshinweis. Bild: `design/lauf/brief-ansicht.png` (lokal aus Claudes Datei gerendert, so benennen).
3. **Die drei Wege im Vergleich** (E-Mail / Anruf / Brief) mit Claudes Begründung 1:1 und den Quellen aus der Sources-Liste des Laufs (11 Links), jeweils mit Quellenart (IHK, Kanzlei/Berater, Fachpresse, Verbraucherzentrale, Gesetzestext über Jusline). Hinweis im Guide: „Alle Quellen sind Suchtreffer, Claude hat keine Seite geöffnet. Claude: ‚Ich bin kein Anwalt; das ist eine Zusammenfassung der Quellen, keine Rechtsberatung.‘“ Nie „rechtssicher“, „amtlich“, „Gericht bestätigt“.
4. **„Was Claude nicht prüfen konnte“** 1:1 außer der unten genannten Stelle (Versandkosten/Lieferzeit, „brutto“ bei § 19 UStG, Datenschutz-Informationspflichten Art. 14 DSGVO, Pflichtangaben im Geschäftsbrief, Betriebe aktiv + Impressums-Adressen, Urteile = Einzelfälle).

Nicht versprechen: einen versandfertigen Brief, Rechtssicherheit, fertige Adressen. Nichts versenden, nicht erzählen, dass ein Brief abgeschickt wurde.

## 1:1 außer … (Behandlung, K.-o. für die Guide-Stufe)
| Stelle im Lauf | Behandlung im Guide |
|---|---|
| „Was ich nicht prüfen konnte“, Punkt „Datenschutz-Informationspflichten (Art. 14 DSGVO)“: nennt in Anführungszeichen den Namen eines Einzelunternehmers aus der Liste von Folge 12 | Namen streichen, Satz lautet: „Bei Einzelunternehmen verarbeitest du Daten einer Person, die du nicht bei ihr selbst erhoben hast.“ Rest des Punkts 1:1. |
| Anhang „Shirt-Firma Ergebnis Betriebe.md“ (Betriebsnamen, Orte, einmal die Stadt aus dem Chef-Entscheid Folge 11) | Nicht in den Guide, nicht als Bild. Im Guide nur „letztes Ergebnis (Liste mit Betrieben)“. |
| Screenshot `05-nicht-pruefen.png` | Nur `05-nicht-pruefen-anonym.png` verwenden. |
| Screenshot 01 (Anhang-Karten) | Ok, zeigt nur Dateinamen, nicht den Inhalt. |
Claudes Antwort, Brief und Sources-Liste enthalten laut LAUF.md keinen Ortsnamen außer Chemnitz (Testregion, darf genannt werden) und keinen Betriebsnamen; der Stadtname aus Lauf 11 steht nur im Anhang.
**Abnahme über den fertigen Guide-Text (guidebook.json/HTML):**
- `grep -i` nach dem Stadtnamen aus Lauf 11 (Tagesbriefing 2026-10-30, Chef-Entscheide) = 0. Der Name steht absichtlich auch hier nicht.
- `grep -i` nach dem Personennamen aus LAUF.md, Abschnitt „Was ich nicht prüfen konnte“, Punkt „Datenschutz-Informationspflichten“ = 0 (Name absichtlich nicht hier).
- Kein Betriebsname aus der Liste von Folge 12; `grep -ic boilr` = 0; `grep -c "\[BERUF\]"` = 0.
- Alle eingebundenen Bilder visuell ohne Betriebs-/Personennamen (grep findet keine Pixel).

## Weg
claude.ai → neuer Chat → „+“ → letztes Ergebnis (z. B. Kundenliste) und Logo anhängen → Frage einfügen → senden. Websuche läuft ohne eigenen Schalter (Lauf 29.10.2026: 5 Suchen), Research nicht nötig. Die Word-Datei erscheint als Karte im Chat („Dokument · DOCX“). Tipp aus dem Lauf: Gedächtnis für diesen Chat ausschalten (Plus-Menü, Häkchen „Gedächtnis“).
Zeit: Lauf 2 min 25 s; mit Anhängen, Lesen und eigenen Daten in den gelben Feldern ≈ 10 Minuten. Empfängeradressen sind darin nicht enthalten (eigener Schritt).

## Variante A: mit Anhang (letztes Ergebnis + Logo)
> Im Anhang sind mein letztes Ergebnis und mein Logo. Ich verkaufe [PRODUKT] an [ZIELKUNDEN], unter dem Namen [FIRMENNAME]. Mein Angebot: [PREIS UND MENGE]. [WAS ICH NOCH NICHT VERSPRECHEN KANN]. Mein letztes Ergebnis: [STAND IN EINEM SATZ, z. B. zwanzig passende Firmen, fünf davon spreche ich zuerst an]. Prüf mit der Websuche, wie ich diese Firmen zum ersten Mal werblich ansprechen darf, per E-Mail, Anruf oder Brief, jeweils mit Quelle. Entscheide dich für einen Weg und begründe es mit zwei bis drei konkreten Gründen. Schreib dann den ersten Werbebrief, so kurz, dass [TYPISCHER KUNDE] ihn in einer Minute liest, als Word-Datei. Schreib nur, was belegt ist. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

Nur Logo, keine Liste: ersten Satz ersetzen durch „Im Anhang ist mein Logo.“ Nur Liste, kein Logo: „Im Anhang ist mein letztes Ergebnis.“ (Brief kommt dann ohne Logo.)

## Variante B: ohne Anhang (kein letztes Ergebnis, kein Logo)
> Ich verkaufe [PRODUKT] an [ZIELKUNDEN], unter dem Namen [FIRMENNAME]. Mein Angebot: [PREIS UND MENGE]. [WAS ICH NOCH NICHT VERSPRECHEN KANN]. Ich will [ZIELKUNDEN, z. B. kleine Arztpraxen in meiner Stadt] zum ersten Mal anschreiben. Prüf mit der Websuche, wie ich solche Firmen zum ersten Mal werblich ansprechen darf, per E-Mail, Anruf oder Brief, jeweils mit Quelle. Entscheide dich für einen Weg und begründe es mit zwei bis drei konkreten Gründen. Schreib dann den ersten Werbebrief, so kurz, dass [TYPISCHER KUNDE] ihn in einer Minute liest, als Word-Datei. Lass Platzhalter für Logo, Absender und Empfänger. Schreib nur, was belegt ist. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

(Original im Lauf: „Im Anhang sind mein letztes Ergebnis und mein Logo. Ich verkaufe Firmenshirts mit gesticktem Logo an kleine Handwerks- und Baubetriebe unter zehn Leuten, gestickt erst auf Bestellung über Printful, unter dem Namen Kolonnenshirt. Mein Angebot: 109 Euro brutto für fünf Shirts, 29,90 Euro für ein nachbestelltes Einzelshirt. Sechzig Grad Wäsche kann ich noch nicht versprechen. Mein letztes Ergebnis: zwanzig Betriebe in der Testregion Chemnitz, fünf davon spreche ich zuerst an. Prüf mit der Websuche, … so kurz, dass ein Dachdecker ihn in einer Minute liest, als Word-Datei. …“) Variante B ist nicht gelaufen; Hinweis im Guide: „ungetestete Abwandlung des echten Prompts“.

## Beispiele nach Beruf
- **Gebäudereiniger:** [PRODUKT] Glasreinigung im Monatsabo · [ZIELKUNDEN] Arztpraxen und Kanzleien im Erdgeschoss · [PREIS UND MENGE] eigener Monatspreis · nicht versprechen: Termine am Wochenende · [TYPISCHER KUNDE] eine Praxismanagerin.
- **Fotografin:** Team- und Bewerbungsfotos vor Ort · Firmen mit 5–20 Leuten · Festpreis pro Teamtermin · nicht versprechen: Lieferung am selben Tag · ein Geschäftsführer.
- **Kaffeerösterin:** Kaffee mit eigenem Etikett · Büros · Probepaket mit drei Sorten · nicht versprechen: Bio-Siegel · eine Büroleiterin.
- **IT-Techniker:** PC- und WLAN-Betreuung · kleine Handwerksbetriebe · Monatspauschale je Arbeitsplatz · nicht versprechen: 24-Stunden-Notdienst · eine Meisterin im eigenen Betrieb.
(Keine Lauf-Zahlen; Preise setzt der Zuschauer selbst ein.)

## Echter Lauf (29.10.2026, Chat b0fbcaf2…, 2 min 25 s, Opus 5.5 Mittel, Gedächtnis aus, kein Research, 5 Websuchen, 0 Seiten geöffnet, 11 Quellenlinks, 1 Word-Datei)
- **Entscheidung (Claude):** „Meine Entscheidung: der Brief.“
- **E-Mail:** „E-Mail-Werbung ohne vorherige ausdrückliche und nachweisbare Einwilligung gilt nach § 7 UWG als belästigende Werbung und ist grundsätzlich unzulässig. Das UWG unterscheidet dabei gar nicht zwischen B2C und B2B.“ + „Du darfst auch nicht per E-Mail nach der Einwilligung fragen“ → „Der Weg fällt also ganz weg.“ (Quellen: IHK Bodensee-Oberschwaben, IHK Karlsruhe, IT-Recht Kanzlei, Computerwoche)
- **Anruf:** mutmaßliche Einwilligung nur mit „hinreichend spezifischem Bezug zum Gewerbe“; „Laut BGH kann nur ein konkreter Grund aus dem Interessenbereich des Angerufenen eine mutmaßliche Einwilligung begründen.“ „Das Risiko einer Fehleinschätzung trägt grundsätzlich der Anrufer.“ Bei keinem der fünf Betriebe ein solcher Grund. (Quellen: IHK-Merkblatt über ULB Bonn, Betriebs-Berater zu BGH I ZR 27/08, Dr. Datenschutz)
- **Brief:** in § 7 UWG in keinem Tatbestand → „grundsätzlich zulässig“; OLG Stuttgart 2024 (2 U 63/22, nur über zwei Kanzlei-Seiten belegt): personalisierte Briefwerbung ohne Einwilligung zulässig; Pflicht: Hinweis auf Widerspruchsrecht spätestens bei der ersten Kommunikation, getrennt (Art. 21 DSGVO über Jusline); „Keine Werbung“-Aufkleber stoppt adressierte Briefe nicht (Verbraucherzentrale).
- **Brief (Datei):** 1 Seite, Logo oben rechts, Betreff „Werbung: Firmenshirts mit Ihrem gestickten Logo“, „5 Shirts mit Ihrem Logo: 109 Euro brutto“, „Ein Shirt nachbestellen: 29,90 Euro brutto“ („brutto“ hier von Claude ergänzt), „Gestickt wird erst, wenn Sie bestellen.“, „Versand: [Versandkosten und Lieferzeit ergänzen]“, Widerspruchshinweis unter einer Linie; 14 gelbe Platzhalter; kein 60 °C, kein Printful, keine Lieferzeit.
- **Claudes Angebot am Ende:** „Als Nächstes kann ich die Impressums-Adressen der fünf Betriebe heraussuchen, damit du die Empfängerfelder füllen kannst.“
