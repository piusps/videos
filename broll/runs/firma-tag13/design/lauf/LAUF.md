# Echter claude.ai-Lauf Folge 13 (Werbebrief), 2026-10-29, 19:29:15-19:31:40 (MEZ)
Chat: https://claude.ai/chat/b0fbcaf2-5900-4728-afad-29f58c2d2448 (T3-Preview-Profil "Chrome", Organisation = Pius' eigene Pro-Organisation 77f569ac…, Cookie lastActiveOrg vor dem Senden geprüft, stand bereits richtig), Modell Opus 5.5 Mittel (API: claude-opus-5-5, effort_level medium)
Chat-Titel (von claude.ai vergeben): "Werbung an Handwerksbetriebe"
Weg: neuer Tab (claude.ai/new, Composer leer, kein fremder Text) -> Plus-Menü geprüft -> Gedächtnis für diesen Chat aus -> 2 Dateien angehängt (verstecktes input[type=file], DataTransfer; Dateien kamen per lokalem Server 127.0.0.1 in den Tab) -> Prompt per Paste (vor dem Senden 1:1 mit dem Soll verglichen; in der Chat-API identisch) -> "Nachricht senden". KEIN Research (Plus-Menü: "Recherche" aria-checked=false, blieb aus). Kein eigener Websuche-Schalter; Chat-API settings.enabled_web_search = true, Claude hat gesucht.
**Gedächtnis: für diesen Chat AUS.** Häkchen "Gedächtnis" im Plus-Menü (stand auf an) einmal geklickt -> aria-checked=false. /api/account-Einstellungen vorher gesichert, direkt danach und nach dem Lauf verglichen: unverändert (Schalter gilt nur für diesen Chat). Chat-API: settings.chat_memory_mode = "disabled". Kein memory-Aufruf im Protokoll.
**Konnektoren:** Apify, HeyGen, InstantDM stehen wie in Lauf 12 konto-weit in settings.enabled_mcp_tools. Nichts angefasst. Während des Laufs alle 10 s per Chat-API überwacht: **kein Konnektor-Aufruf, keine Freigabe-Abfrage, kein Dialog.**
Nichts verbunden, nichts gekauft, nirgends angemeldet, nichts geteilt, nichts versendet. Am Composer "Manuell".
Anhänge (liegen in diesem Ordner): (1) "Shirt-Firma Ergebnis Betriebe.md" = Titelzeile "# Shirt-Firma · Ergebnis erste zwanzig Betriebe (letzter Schritt)" + Schlussantwort aus Lauf 12 wörtlich (aus firma-tag12/design/lauf/bericht.md, Abschnitt "Schlussantwort", identisch mit /tmp/t12/final.txt; enthält damit Betriebsnamen und einmal "Hamburg"); claude.ai-Karte "41 Zeilen · MD" (4398 Byte). (2) "Kolonnenshirt-Logo.svg" = firma-tag10/design/lauf/Kolonnenshirt-Logo.svg unverändert (cmp identisch, 7727 Byte); claude.ai-Karte "6 Zeilen · TEXT" (im Chat danach "SVG").
Rückfragen: keine. Login/Connector/Geld verlangt: nein.
Erster Satz: "Ich prüfe zuerst die Rechtslage für E-Mail, Anruf und Brief und schreibe danach den Brief als Word-Datei."

## Prompt (wörtlich)
Im Anhang sind mein letztes Ergebnis und mein Logo. Ich verkaufe Firmenshirts mit gesticktem Logo an kleine Handwerks- und Baubetriebe unter zehn Leuten, gestickt erst auf Bestellung über Printful, unter dem Namen Kolonnenshirt. Mein Angebot: 109 Euro brutto für fünf Shirts, 29,90 Euro für ein nachbestelltes Einzelshirt. Sechzig Grad Wäsche kann ich noch nicht versprechen. Mein letztes Ergebnis: zwanzig Betriebe in der Testregion Chemnitz, fünf davon spreche ich zuerst an. Prüf mit der Websuche, wie ich diese Betriebe zum ersten Mal werblich ansprechen darf, per E-Mail, Anruf oder Brief, jeweils mit Quelle. Entscheide dich für einen Weg und begründe es mit zwei bis drei konkreten Gründen. Schreib dann den ersten Werbebrief, so kurz, dass ein Dachdecker ihn in einer Minute liest, als Word-Datei. Schreib nur, was belegt ist. Sag mir auch, was du nicht prüfen kannst. Erfinde nichts.

## Ergebnis
Dauer: 2 min 25 s (gesendet 19:29:15, Antwort fertig 19:31:40; Chat-API created_at/updated_at). Deutlich kürzer als Lauf 11/12.
Werkzeuge laut Chat-API: 18 Aufrufe = **5 Websuchen**, **0 Seitenabrufe (kein WebFetch; alle Quellen nur aus Suchergebnissen/Snippets)**, **9 Befehle** (Bash, davon 4 mit Exit-Code 1: Arbeitsordner/SVG-Werkzeuge prüfen; cairosvg installieren (scheitert); ImageMagick-SVG (scheitert, rsvg fehlt); @resvg/resvg-js (scheitert); erfolgreich: Logo per LibreOffice SVG -> PNG umgewandelt, getrimmt, groß neu gerendert; Brief bauen + LibreOffice -> PDF -> JPG; Korrektur per sed + neu bauen), **1 Datei geschrieben** (Write: build.js, Skript für die Word-Datei mit docx-js), 1 Bildansicht (Read page-1.jpg = Claudes eigene Prüfansicht), 1 Skill geladen (docx), 1 Dateiausgabe (SendUserFile, 1 .docx, Bildunterschrift "Werbebrief mit Logo; gelb markiert ist alles, was du noch einsetzen musst."). Keine Aufgaben-Aufrufe. Kein Konnektor-Aufruf. Chat-Zeile: "Eine Datei erstellt, eine Datei geteilt und 15 weitere Schritte"; Kopfzeile des Denkblocks: "Suche nach UWG-Regeln für E-Mail-Werbung im B2B-Bereich".
Websuchen (in Reihenfolge, wörtlich): § 7 UWG E-Mail-Werbung Gewerbetreibende Einwilligung B2B | Telefonwerbung B2B mutmaßliche Einwilligung BGH Handwerker | Briefwerbung adressiert zulässig DSGVO berechtigtes Interesse Erwägungsgrund 47 Widerspruch | Art. 21 Abs. 4 DSGVO Hinweis Widerspruchsrecht spätestens erste Kommunikation Werbebrief Art. 14 Informationspflicht | adressierte Briefwerbung Briefkasten "keine Werbung" Aufkleber Gewerbe
Quellen in der Antwort: 11 Links, alle in den Suchergebnissen enthalten, keine davon geöffnet. Art: IHK 2 (Bodensee-Oberschwaben, Karlsruhe) + 1 IHK-Merkblatt über Uni-Archiv ULB Bonn; Kanzleien/Berater 4 (IT-Recht Kanzlei 2×, Kanzlei Plutte, Dr. Datenschutz); Fachpresse 2 (Computerwoche, Betriebs-Berater zu BGH I ZR 27/08); Gesetzestext 1 (Art. 21 DSGVO über Jusline, österreichisches Portal); Verbraucherzentrale 1. Kein Gesetz von gesetze-im-internet.de, kein Urteil im Volltext; das OLG-Stuttgart-Urteil (2 U 63/22, 2024) ist nur über zwei Kanzlei-Seiten belegt.
Datei (Karte im Chat "Kolonnenshirt werbebrief · Dokument · DOCX"): Kolonnenshirt_Werbebrief.docx, über die claude.ai-API des Tabs (/api/organizations/77f569ac…/files/3a83dd13-…/contents) unverändert heruntergeladen (37107 Byte, Word 2007+). Inhalt: 1 Seite, Logo oben rechts (Claudes PNG-Umwandlung des SVG, liegt als brief-logo-aus-docx.png hier), Absenderzeile, Empfängerblock, Datum, Betreff, 1 Satz, 4 Aufzählungspunkte, Kontakt-Satz, Gruß, Linie, Widerspruchshinweis; 14 gelb markierte Platzhalter. Volltext: brief-text.txt.
**Weg (Claudes Entscheidung): der Brief.** Gründe (wörtlich gekürzt): (1) E-Mail: keine Einwilligung, und die darf man auch nicht per E-Mail einholen -> fällt ganz weg (§ 7 UWG, IHK). (2) Anruf: bei keinem der fünf Betriebe ein konkreter Grund aus deren Interesse; "Firmenshirts sind nützlich" reicht laut Quellen nicht, Risiko beim Anrufer (BGH laut Betriebs-Berater/IHK-Merkblatt). (3) Brief ohne Einwilligung erlaubt (§ 7 UWG nennt Brief nicht; OLG Stuttgart 2024 laut Kanzleien), einzige Pflicht = Widerspruchshinweis (Art. 21 DSGVO), steht im Brief; "Keine Werbung"-Aufkleber stoppt adressierte Briefe nicht (Verbraucherzentrale).

Chat-Schlussantwort (wörtlich, vollständig; auch in bericht.md):
"
Meine Entscheidung: **der Brief.** Die Word-Datei „Kolonnenshirt_Werbebrief.docx“ ist fertig. Ich bin kein Anwalt; das ist eine Zusammenfassung der Quellen, keine Rechtsberatung.

**Was für die drei Wege gilt**

- **E-Mail:** E-Mail-Werbung ohne vorherige ausdrückliche und nachweisbare Einwilligung gilt nach § 7 UWG als belästigende Werbung und ist grundsätzlich unzulässig. Das UWG unterscheidet dabei gar nicht zwischen B2C und B2B. Du darfst auch nicht per E-Mail nach der Einwilligung fragen: Die Empfänger dürfen nicht angeschrieben werden, um zu fragen, ob sie eine Einwilligung in E-Mail-Werbung geben möchten.
- **Anruf:** Bei Gewerbetreibenden genügt eine mutmaßliche Einwilligung, die sich in der Regel aber nur annehmen lässt, wenn der Anruf einen hinreichend spezifischen Bezug zum Gewerbe des Angerufenen hat. Dass die Leistung für den Betrieb nützlich ist, reicht dafür nicht aus. Laut BGH kann nur ein konkreter Grund aus dem Interessenbereich des Angerufenen eine mutmaßliche Einwilligung begründen. Das Risiko einer Fehleinschätzung trägt grundsätzlich der Anrufer.
- **Brief:** Da Briefwerbung in § 7 UWG anders als E-Mail-Werbung in keinem der geregelten Tatbestände vorkommt, ist sie grundsätzlich zulässig. Beim Datenschutz hat das OLG Stuttgart 2024 entschieden, dass personalisierte Briefwerbung ohne Einwilligung zulässig ist und erst ein Widerspruch weitere Werbung dieser Art unzulässig macht. Eine Bedingung: Der Empfänger muss spätestens bei der ersten Kommunikation ausdrücklich auf sein Widerspruchsrecht hingewiesen werden, verständlich und getrennt von anderen Informationen.

**Warum der Brief**
1. Für E-Mail fehlt dir die Einwilligung, und du darfst sie nicht per E-Mail einholen. Der Weg fällt also ganz weg.
2. Für einen Anruf hast du bei keinem der fünf Betriebe einen konkreten Grund, der aus seinem Interesse kommt. „Firmenshirts sind nützlich für Handwerker“ reicht laut den Quellen nicht. Das Risiko läge bei dir.
3. Der Brief ist ohne Einwilligung erlaubt. Die einzige Pflicht, den Widerspruchshinweis, erfüllt der Brief bereits. Ein „Keine Werbung“-Aufkleber stoppt ihn nicht: Die Post muss adressierte Briefe zustellen, auch Werbebriefe.

**Was im Brief steht:** Er enthält nur deine Angaben: Kolonnenshirt, gesticktes Logo, kleine Handwerks- und Baubetriebe, 109 € brutto für fünf, 29,90 € für ein nachbestelltes Shirt, gestickt erst nach Bestellung. Waschtemperatur, Printful, Qualität und Lieferzeit stehen nicht drin. Der Betreff beginnt mit „Werbung:“, damit der Brief sofort als Werbung erkennbar ist. Unten steht der Widerspruchshinweis, durch eine Linie abgetrennt. Gelb markiert ist, was du einsetzen musst: dein Name, deine Adresse, Telefon, E-Mail, die Firmenadresse aus dem Impressum, die Versandkosten, die Datenquelle und der Datenschutzlink.

**Was ich nicht prüfen konnte**
- **Versandkosten und Lieferzeit:** Die kenne ich nicht. Ohne sie wirkt „109 €“ womöglich wie ein Endpreis. Trag sie ein oder streich die Zeile bewusst.
- **„Brutto“:** Falls du Kleinunternehmer nach § 19 UStG bist, weist du keine Umsatzsteuer aus. Dann passt das Wort „brutto“ nicht. Das habe ich nicht geprüft.
- **Datenschutz-Informationspflichten (Art. 14 DSGVO):** Bei Einzelunternehmen wie „Fabrice Müller“ verarbeitest du Daten einer Person, die du nicht bei ihr selbst erhoben hast. Ob über den Widerspruchshinweis und die Quellenangabe hinaus vollständige Datenschutzinformationen nötig sind, habe ich nicht im Einzelnen geprüft. Deshalb gibt es den Platzhalter für den Link zur Datenschutzerklärung.
- **Pflichtangaben im Geschäftsbrief:** Welche Angaben auf deinen Briefbogen müssen, hängt von deiner Rechtsform ab. Die kenne ich nicht.
- **Die Betriebe selbst:** Ob sie noch aktiv sind, ob sie schon Firmenkleidung haben und die Impressums-Adressen der fünf, das ist weiter offen, wie im letzten Ergebnis.
- **Rechtsprechung:** Die Gerichtsurteile sind Einzelfälle. Dass ein Gericht bei dir genauso entscheidet, ist nicht garantiert.

Als Nächstes kann ich die Impressums-Adressen der fünf Betriebe heraussuchen, damit du die Empfängerfelder füllen kannst.

Sources:
- [IHK Bodensee-Oberschwaben: Werbung – was ist erlaubt?](https://www.ihk.de/bodensee-oberschwaben/recht/werbung-und-vertrieb/was-ist-erlaubt-1943228)
- [IHK Karlsruhe: Werbung – was ist erlaubt?](https://www.ihk.de/karlsruhe/fachthemen/recht/wettbewerbsrecht/werbung-was-ist-erlaubt-2459622)
- [IT-Recht Kanzlei: B2B-E-Mail-Marketing](https://www.it-recht-kanzlei.de/b2b-e-mail-marketing-unterlassung-schadensersatz-uwg-dsgvo.html)
- [Computerwoche: E-Mail-Werbung und DSGVO](https://www.computerwoche.de/a/lass-uns-freunde-bleiben,3545372)
- [IHK-Merkblatt: Werbung per Telefon (ULB Bonn)](https://epflicht.ulb.uni-bonn.de/download/pdf/446310)
- [Betriebs-Berater: BGH I ZR 27/08](https://betriebs-berater.ruw.de/wirtschaftsrecht/urteile/Telefonwerbung-nach-Unternehmenswechsel-17124)
- [Dr. Datenschutz: Telefonische Kaltakquise B2B](https://www.dr-datenschutz.de/ist-die-telefonische-kaltakquise-im-b2b-nach-dsgvo-verboten/)
- [IT-Recht Kanzlei: OLG Stuttgart zur Briefwerbung](https://www.it-recht-kanzlei.de/olg-stuttgart-briefwerbung-datenschutz.html)
- [Kanzlei Plutte: OLG Stuttgart, 2 U 63/22](https://www.ra-plutte.de/olg-stuttgart-personalisierte-briefwerbung-dsgvo-konform/amp/)
- [Art. 21 DSGVO (Jusline)](https://www.jusline.at/gesetz/dsgvo/paragraf/21.pdf)
- [Verbraucherzentrale: Werbung im Briefkasten](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/werbung/briefkastenwerbung-wie-sie-sich-gegen-unerwuenschte-werbung-wehren-10418)"

## Brieftext (wörtlich aus der Word-Datei, Absatz für Absatz; [ … ] = gelb markierter Platzhalter in der Datei)
```

[Dein Name] · Kolonnenshirt · [Straße, PLZ Ort] · [Telefon] · [E-Mail]
[Firmenname laut Impressum]
[Straße Hausnummer]
[PLZ Ort]
[Ort, Datum]
Werbung: Firmenshirts mit Ihrem gestickten Logo
Guten Tag,
ich verkaufe unter dem Namen Kolonnenshirt Firmenshirts mit gesticktem Logo, gemacht für kleine Handwerks- und Baubetriebe.
5 Shirts mit Ihrem Logo: 109 Euro brutto
Ein Shirt nachbestellen: 29,90 Euro brutto
Gestickt wird erst, wenn Sie bestellen.
Versand: [Versandkosten und Lieferzeit ergänzen]
Wenn Sie Interesse haben, rufen Sie mich an oder schreiben Sie mir: [Telefon] oder [E-Mail].
Viele Grüße
[Dein Name], Kolonnenshirt
Ihr Recht auf Widerspruch
Sie können der Nutzung Ihrer Daten für Werbung jederzeit widersprechen. Ein kurzer Anruf, eine E-Mail oder ein Brief an die Adresse oben genügt. Danach erhalten Sie von mir keine Werbung mehr.
Ihre Firmenanschrift stammt aus [Quelle, z. B. Ihrem Impressum]. Mehr zum Datenschutz: [Link oder Hinweis zur Datenschutzerklärung]
```

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- **Quellen offiziell oder Kanzlei?** Gemischt, überwiegend nicht amtlich: 2 IHK-Seiten + 1 IHK-Merkblatt (über ein Uni-Archiv) sind Kammer-Quellen; 4 Kanzlei-/Berater-Seiten, 2 Fachpresse, 1 Verbraucherzentrale, 1 Gesetzestext über ein österreichisches Portal (Jusline). Kein Gesetz von gesetze-im-internet.de/eur-lex, kein Urteil im Volltext. Die Schlüsselaussage für den Brief (OLG Stuttgart 2024: personalisierte Briefwerbung ohne Einwilligung zulässig) ist nur über zwei Kanzlei-Seiten belegt. **Keine einzige Seite wurde geöffnet** (0 WebFetch); alles stammt aus Suchergebnissen. Was genau in den Snippets stand, speichert die Chat-API nicht im Klartext nachprüfbar -> von mir nicht nachgeprüft.
- **Unbelegtes im Brief:** kein 60 °C, keine Waschtemperatur, keine Lieferzeit (Platzhalter "[Versandkosten und Lieferzeit ergänzen]"), keine Garantie, keine Qualitätsaussage, kein Printful, keine erfundenen Kontaktdaten (Name, Adresse, Telefon, E-Mail, Empfänger, Datum, Datenquelle, Datenschutzlink = gelbe Platzhalter). Preise wie im Prompt. **Eine Abweichung:** Im Brief steht "Ein Shirt nachbestellen: 29,90 Euro brutto" – im Prompt steht 29,90 Euro ohne "brutto"; das "brutto" beim Einzelshirt hat Claude ergänzt (im Chattext dagegen ohne "brutto"). Claude selbst warnt, dass "brutto" bei Kleinunternehmer-Regelung nicht passt. "Gemacht für kleine Handwerks- und Baubetriebe" und "Gestickt wird erst, wenn Sie bestellen" stammen aus dem Prompt. "Danach erhalten Sie von mir keine Werbung mehr" ist eine Zusage des Absenders, keine Tatsachenbehauptung.
- **Platzhalter:** 14 gelb markierte Stellen (Dein Name 2×, Straße/PLZ Ort, Telefon 2×, E-Mail 2×, Firmenname laut Impressum, Straße Hausnummer, PLZ Ort, Ort/Datum, Versandkosten und Lieferzeit, Quelle der Anschrift, Datenschutzlink). Der Brief ist so **nicht abschickbar**, ohne dass ein Mensch Absender, Empfänger, Versand und Datenschutzlink einsetzt.
- **Betriebsname/Ansprechpartner im Brief:** keiner (Empfänger nur als Platzhalter) -> keine brief-anonym.png nötig. Im Chattext steht aber einmal ein Betriebsname mit Personennamen (aus dem Anhang, als Beispiel für Einzelunternehmen unter "Was ich nicht prüfen konnte") -> 05 nur als *-anonym.png fürs Video.
- **Wortzahl des Briefs:** 142 Wörter gesamt inkl. Platzhalter (Absender-/Empfängerblock + Datum 19, Betreff bis Unterschrift 71, Widerspruchsblock 52). Lesbarer Kern (Betreff bis Gruß) 71 Wörter -> "in einer Minute lesbar" erfüllt.
- **Betreff beginnt mit "Werbung:"** und der Widerspruchshinweis ist mit Linie abgetrennt – beides begründet Claude mit der Quelle (Hinweis spätestens bei erster Kommunikation, getrennt von anderen Informationen, Art. 21 Abs. 4 DSGVO).
- **Rechtliche Lücken, die Claude nicht anspricht (von mir nur vermerkt, nicht geprüft):** § 7 Abs. 1 UWG (erkennbar unerwünschte Werbung) bzw. Abs. 2 Nr. 1 (hartnäckige Ansprache) gelten auch für Briefe; Claude schreibt "Briefwerbung kommt in keinem der geregelten Tatbestände vor". Robinsonliste wird in einer Suche gefunden, aber nicht erwähnt.
- **Gedächtnis aus, kein privater Bezug:** Absender ist reiner Platzhalter, keine Stadt, keine Adresse. "Hamburg" steht nirgends in Antwort oder Datei. Kein "boilr".
- **Logo:** Claude konnte das SVG nicht direkt einbetten (3 Werkzeuge fehlten), hat es per LibreOffice in PNG umgewandelt (1978 × 744) und eingesetzt; Farbe/Schrift sehen in der Ansicht wie das Original aus (dunkelblaue Fläche, weiße Schrift "KOLONNEN / SHIRT").
- **Nicht prüfen (laut Claude):** Versandkosten/Lieferzeit, ob "brutto" passt (§ 19 UStG), Art.-14-DSGVO-Informationspflichten bei Einzelunternehmen, Pflichtangaben im Geschäftsbrief (Rechtsform unbekannt), ob Betriebe aktiv sind/Firmenkleidung haben/Impressums-Adressen, Urteile = Einzelfälle. "Ich bin kein Anwalt; … keine Rechtsberatung."
- **Offene Frage für Folge 14 (von Claude angeboten, nicht beantwortet):** "Als Nächstes kann ich die Impressums-Adressen der fünf Betriebe heraussuchen, damit du die Empfängerfelder füllen kannst." Weitere offene Punkte aus dem Lauf: Versandkosten/Lieferzeit (Printful), Kleinunternehmer ja/nein ("brutto").
- Leak-Check: Klon-Text ohne Sidebar-Titel, ohne "boilr", "Hamburg", Pius/Niklas/Florent, ohne Mails; das aria-label "Claude Desktop … zu Superkind gewechselt" im Klon entfernt. Datei-Vorschau-Panel vor dem Klon geschlossen.

## Screenshots und Bilder
Echte claude.ai-Pixel (DOM-Klon ohne Sidebar/nav/aside/Screenreader-Texte, Datei-Vorschau-Panel vorher geschlossen, Dark Mode, headless Chrome 1400 px × 1,5, Klon über lokalen Empfänger 127.0.0.1). Geschwärzte Variante: im selben Klon der eine Betriebs-/Personenname als schwarzer Balken gesetzt und identisch gerendert (gleiche Pixel bis auf den Balken).
| Bild | Inhalt | Video |
|---|---|---|
| 01-prompt-mit-anhang.png | Composer mit beiden Anhängen ("Shirt-Firma Ergebnis Betriebe.md" 41 Zeilen MD, "Kolonnenshirt-Logo.svg" 6 Zeilen TEXT) + Prompt vor dem Senden ("Projekt", "Opus 5.5 Mittel", "Manuell"; Begrüßung "Abendgedanken") | Video ok |
| 07-schritte-zeile.png | Denkblock "Suche nach UWG-Regeln für E-Mail-Werbung im B2B-Bereich", erster Satz, "Eine Datei erstellt, eine Datei geteilt und 15 weitere Schritte" | Video ok |
| 02-rechtslage-quellen.png | "Meine Entscheidung: der Brief." + "Was für die drei Wege gilt" (E-Mail / Anruf / Brief mit § 7 UWG, BGH, OLG Stuttgart) | Video ok |
| 03-entscheidung-gruende.png | "Warum der Brief" mit 3 Gründen | Video ok |
| 04-brief-chat.png | "Was im Brief steht" (Chattext) | Video ok |
| 05-nicht-pruefen.png | "Was ich nicht prüfen konnte" (6 Punkte) | nicht für Video (1 Betriebsname) |
| 05-nicht-pruefen-anonym.png | dasselbe, Name geschwärzt | Video ok |
| 08-quellen.png | "Als Nächstes …" + "Sources:" (11 Links) | Video ok (nur Kammer-/Kanzlei-/Portalnamen) |
| 06-datei-karte.png | Datei-Karte "Kolonnenshirt werbebrief · Dokument · DOCX" | Video ok |

Lokal gerendert aus Claudes Datei (KEINE claude.ai-Pixel, keine Word-Optik 1:1):
| Bild | Inhalt | Video |
|---|---|---|
| brief-ansicht.png (1590 × 2245) | ganze Seite des Briefs mit Logo und gelben Platzhaltern | Video ok (kein Betriebsname, keine Person, nur Platzhalter) |
| 04-brief-word.png (1590 × 1335) | Ausschnitt: Logo, Absender, Empfänger, Betreff, Text, Aufzählung, Gruß (ohne Widerspruchsblock) | Video ok |
Weg: Word/Pages nicht benutzt. Die .docx unverändert mit der JS-Bibliothek docx-preview 0.4 (+ JSZip, lokal aus Lauf 11) in HTML gerendert (brief-ansicht.html, Datei als base64 eingebettet), dann headless Chrome 900 px × 2. Farben, Markierungen, Logo und Linie kommen aus der Datei; Schrift Arial wie in der Datei; Seitenränder/Schatten sind die docx-preview-Darstellung, nicht Words eigene. Claudes eigene LibreOffice-Prüfung ergab 1 Seite.
brief-text.txt: Volltext der Datei (aus word/document.xml). brief-logo-aus-docx.png: das Logo-Bild, wie Claude es in die Datei gesetzt hat.

## Ein Satz an den Autor
Mit Websuche (5 Suchen, keine Seite geöffnet, Gedächtnis aus, kein Konnektor) entscheidet Claude in 2 min 25 s **für den Brief**, weil Werbe-E-Mail ohne Einwilligung nach § 7 UWG auch an Firmen verboten ist (und man nicht einmal per Mail um Erlaubnis fragen darf), weil für einen Anruf bei keinem der fünf Betriebe ein konkreter Grund vorliegt und weil ein Werbebrief ohne Einwilligung erlaubt ist, solange der Widerspruchshinweis drinsteht; die Word-Datei „Kolonnenshirt_Werbebrief.docx“ ist ein einseitiger Brief mit Logo, Betreff „Werbung: Firmenshirts mit Ihrem gestickten Logo“, 71 Wörtern Kern, den Preisen 109 € für fünf und 29,90 € fürs Nachbestellen, „Gestickt wird erst, wenn Sie bestellen.“, ohne 60 °C, ohne Lieferzeit und mit 14 gelben Platzhaltern (Absender, Empfänger, Versand) – Achtung: Quellen meist Kanzleien/IHK aus Suchtreffern, „brutto“ beim Einzelshirt hat Claude ergänzt, und abschicken kann den Brief erst ein Mensch.
