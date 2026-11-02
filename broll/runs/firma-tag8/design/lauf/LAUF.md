# Echter claude.ai-Lauf Tag 8 (Folge "Firmenname"), 2026-10-28, 20:38:55-20:40:49 (MEZ)
Chat: https://claude.ai/chat/86d0f42a-c5c9-4148-9bec-7726029fd22f (T3-Preview-Profil "Chrome"), Modell Opus 5.5 Medium
Chat-Titel (von claude.ai vergeben): "Firmenname für Stickerei-Shirts"
Weg: neuer Chat (claude.ai/new, Composer leer, kein fremder Text) -> Datei angehängt -> Prompt gesendet. KEIN Research (Research-Schalter im Plus-Menü stand auf aus und blieb aus).
Websuche: im Plus-Menü gibt es keinen eigenen Websuche-Schalter mehr (Menü: Upload, Skills, Connectors, Design system, Add plugins, Devices, Research, Memory); Claude nutzte die Websuche ohne Umschalten, wie in Lauf 7. Nichts umgeschaltet, nichts verbunden, nichts gekauft, nichts angemeldet.
Anhang: "Shirt-Firma Ergebnis Preis.md" = Schlussantwort aus Lauf 7 wörtlich (Tabellen, Gründe, Haken, gelbe Annahmen), mit einer Titelzeile davor; liegt in diesem Ordner.
Rückfragen: keine. Login/Connector verlangt: nein. Freigabe-Abfrage ("Allow once"): keine.
Erster Satz: "Ich suche zehn Namen und prüfe jeden per Websuche auf Firmen in Textil, Arbeitskleidung oder Stickerei. Danach rufe ich die jeweilige .de-Adresse auf."

## Prompt (wörtlich)
Im Anhang ist mein letztes Ergebnis. Ich verkaufe Firmenshirts mit gesticktem Logo an kleine Handwerks- und Baubetriebe unter zehn Leuten, gestickt erst auf Bestellung. Mein letztes Ergebnis: Partner ist Printful, das Fünferpaket kostet 109 Euro brutto, ein nachbestelltes Einzelshirt 29,90 Euro; sechzig Grad Wäsche kann ich damit noch nicht versprechen. Jetzt brauche ich einen Firmennamen, sonst gibt es kein Logo, kein Muster-Shirt und keine Werbung. Schlag mir zehn deutsche Namen vor, die ein Dachdecker oder Elektriker sofort versteht. Prüf für jeden mit der Websuche, ob es schon eine Firma mit diesem oder einem sehr ähnlichen Namen im Bereich Textil, Arbeitskleidung oder Stickerei gibt und ob die .de-Domain offensichtlich belegt ist, jeweils mit Quelle. Streich alle belegten Namen, entscheide dich für einen und begründe es mit zwei bis drei konkreten Gründen. Sag mir auch, was du nicht prüfen kannst, zum Beispiel das Markenregister. Erfinde nichts.

## Ergebnis
Dauer: 1 min 54 s (gesendet 20:38:55, Antwort fertig 20:40:49)
Quellen: Chat-Leiste "Web search: 19 searches, 11 sites read"; Arbeitsblock im Chat "Read 20 pages, searched the web, ran 2 commands, 1 failed". In der Antwort 10 Quellenlinks (Händlerbund/Kluft.de, Herold/Stichfest, logostich.de, 3x DENIC-RDAP, ZDF/funk, LEO, Blogspot-Angebot Handwerkerhemd, Facebook "Firmenkluft").
Werkzeuge laut Chat-API: 41 Aufrufe = 19 WebSearch, 20 WebFetch (10 Websites + 10 DENIC-RDAP-Abfragen), 2 Bash (DNS-/HTTP-Check in Claudes Sandbox; einer davon "failed").
Gewählter Name: **Kolonnenshirt**. Übrig außerdem: Handwerkerhemd, Betriebsshirt. Gestrichen: Kluftwerk, Teamkluft, Firmenkluft, Baukluft, Stichfest, Logostich, Meistershirt.

Chat-Schlussantwort (wörtlich, vollständig; auch in bericht.md):
"Ich empfehle **Kolonnenshirt**. Von den zehn Namen sind drei übrig geblieben. Bei sieben der zehn Domains konnte ich nicht eindeutig feststellen, ob sie frei sind (Details unten).

| # | Name | Firma im Bereich Textil/Arbeitskleidung/Stickerei? | .de-Domain | Ergebnis |
|---|---|---|---|---|
| 1 | Kluftwerk | Sehr ähnlich: Kluft.de, Onlineshop für Arbeitskleidung | Ungeklärt | gestrichen |
| 2 | Teamkluft | Gleiches Problem wie Nr. 1 | Ungeklärt | gestrichen |
| 3 | Firmenkluft | Gleiches Problem wie Nr. 1 | Ungeklärt | gestrichen |
| 4 | Baukluft | Gleiches Problem wie Nr. 1 | Ungeklärt | gestrichen |
| 5 | Stichfest | Ja, Stickerei in Österreich | belegt | gestrichen |
| 6 | Logostich | Ja, aktiver Shop für bestickte Firmenkleidung | belegt | gestrichen |
| 7 | Meistershirt | Keine Firma gefunden, aber Standardbegriff für Fußball-Meistershirts | belegt | gestrichen |
| 8 | Handwerkerhemd | Keine Firma, aber verbreiteter Produktname | Ungeklärt | übrig |
| 9 | Betriebsshirt | Nichts gefunden | Ungeklärt | übrig |
| 10 | **Kolonnenshirt** | Nichts gefunden | Ungeklärt | **Empfehlung** |

**Was hinter den Streichungen steckt:**
- **Die vier „Kluft“-Namen:** Unter Kluft.de verkaufen zwei Brüder Arbeitskleidung, die nicht nur praktisch, sondern vor allem auch robust und belastbar ist. Laut derselben Quelle sitzt die Firma in Hohenlockstedt und Leipzig und hat 16 Angestellte. Sie verkauft Arbeitskleidung an dieselben Kunden wie du, deshalb habe ich alle vier gestrichen. Ob das rechtlich ein Problem wäre, kann ich nicht beurteilen. „Firmenkluft“ ist außerdem ein ganz normales Wort, etwa für Neue Firmenkluft für @hoermann.garagentore.
- **Stichfest:** In Tirol gibt es „STICHFEST – Stickerei-Textilien-Grafik“. Die Firma bietet laut Herold Berufsbekleidung an und hat sich auf Grafikdesign und kreative Computer-Stickerei spezialisiert. Die Domain stichfest.de ist laut Registereintrag der DENIC aktiv.
- **Logostich:** Unter logostich.de läuft ein Shopify-Shop für bestickte Kleidung für Firmen und Teams, mit Rabatt ab fünf Stück. Er wirkt noch unfertig, die Domain ist aber registriert. Das ist fast genau dein Angebot.
- **Meistershirt:** Die Domain ist laut DENIC-Eintrag aktiv. Außerdem denkt bei dem Wort jeder an Fußball, zum Beispiel an die Meistershirts vom FC Bayern München.

**Warum Kolonnenshirt:**
1. **Es ist das Wort vom Bau.** „Kolonne“ heißt laut Wörterbuch auch gang oder crew, also ein Trupp von Arbeitern. Genau so nennt ein Dachdecker seine Leute, und das passt zu deinem Fünferpaket für die ganze Truppe. Elektriker sagen eher „Team“ oder „Monteure“, verstehen das Wort aber auch.
2. **Ich habe nichts dazu gefunden.** Zwei Suchen, auch eine gründlichere, brachten keine Firma, keinen Shop und keine Produktbezeichnung mit diesem Namen.
3. **Die beiden anderen sind Allerweltswörter.** „Handwerkerhemd“ ist eine Produktart. Händler verkaufen unter diesem Wort zum Beispiel ein Staude-Hemd im altdeutschen Handwerker-Stil, also ein Webhemd und kein T-Shirt. „Betriebsshirt“ beschreibt nur die Ware. Du würdest mit beiden in den Suchergebnissen untergehen. Außerdem gelten rein beschreibende Begriffe meist als schwer schützbar (keine Rechtsberatung).

**Was ich nicht prüfen konnte:**
- **Domains:** Nur drei Domains konnte ich sicher als belegt bestätigen (meistershirt.de, logostich.de, stichfest.de). Bei den anderen sieben brach die DENIC-Abfrage mit einem Fehler ab. Solche Fehler bekommt man bei freien Domains typisch, aber bestätigt ist es nicht. Ob kolonnenshirt.de wirklich frei ist, siehst du am schnellsten beim Versuch, sie zu registrieren.
- **Markenregister:** DPMA (Deutschland) und EUIPO (EU) habe ich nicht durchsucht. Eine eingetragene Marke ohne Website findet die Websuche nicht.
- **Handelsregister und Unternehmensregister:** nicht geprüft.
- **Kleine Betriebe:** Eine Stickerei ohne Website oder mit anderem Namen auf dem Schild findet die Websuche nicht.
- **Social Media:** Ob Benutzernamen wie @kolonnenshirt auf Instagram oder Facebook frei sind, habe ich nicht nachgesehen.

Mein Vorschlag für den nächsten Schritt: Gib „Kolonnenshirt“ im DPMAregister und bei EUIPO eSearch ein (beides kostenlos, ein paar Minuten). Ist dort nichts, registriere kolonnenshirt.de und den Instagram-Namen sofort, bevor du das Logo in Auftrag gibst.

Sources:
- [Händlerbund: Kundengeschichte Kluft.de](https://www.haendlerbund.de/de/haendlerbund/ueber-uns/referenzen/kluft)
- [Herold: STICHFEST – Stickerei-Textilien-Grafik, Wattens](https://www.herold.at/gelbe-seiten/wattens/qc4kB/stichfest-stickerei-textilien-grafik/)
- [logostich.de](https://logostich.de)
- [DENIC-Registereintrag meistershirt.de](https://rdap.denic.de/domain/meistershirt.de) · [logostich.de](https://rdap.denic.de/domain/logostich.de) · [stichfest.de](https://rdap.denic.de/domain/stichfest.de)
- [ZDF/funk: Wer näht die Meistershirts vom FC Bayern?](https://www.zdf.de/video/funk-collection-funk-1052-1178/funk-wer-naeht-eigentlich-die-meistershirts-vom-fc-bayern-muenchen-100)
- [LEO Wörterbuch: Kolonne](https://dict.leo.org/german-english/Kolonne)
- [Angebot „Altdeutsches Handwerkerhemd“](http://bestenhemdenhosenjeanshosen.blogspot.com/2012/07/altdeutsches-handwerkerhemd-natur-gre-5.html)
- [Facebook: Frau Chaos mediendesign („Firmenkluft“)](https://www.facebook.com/profile.php?id=100089144265549)"

## Auffälligkeiten (nur festgehalten, nichts korrigiert)
- Die .de-Domain des gewählten Namens ist NICHT als frei bestätigt: bei 7 von 10 Domains (auch kolonnenshirt.de) brach die DENIC-Abfrage mit Fehler ab; Claude schreibt selbst "typisch für freie Domains, aber nicht bestätigt". Belegt bestätigt nur meistershirt.de, logostich.de, stichfest.de.
- Die vier "Kluft"-Namen sind nicht wegen eines gleichen Namens gestrichen, sondern wegen Ähnlichkeit zu Kluft.de (Arbeitskleidung, Hohenlockstedt/Leipzig, 16 Angestellte, Quelle Händlerbund); Domains dort "ungeklärt".
- Meistershirt: keine Firma gefunden, gestrichen wegen belegter Domain + Fußball-Bedeutung.
- Grund 2 für Kolonnenshirt ist ein Nicht-Fund ("Zwei Suchen ... brachten keine Firma"), kein positiver Beleg.
- Nicht geprüft (von Claude genannt): DPMA/EUIPO-Markenregister, Handels-/Unternehmensregister, kleine Betriebe ohne Website, Social-Media-Namen. Nächster Schritt laut Claude: DPMAregister + EUIPO eSearch, dann kolonnenshirt.de + Instagram-Namen registrieren.
- Es wurde kein Login und kein Connector verlangt.

## Screenshots (DOM-Klon ohne Sidebar/nav/aside, Dark Mode, Leak-Check leer)
- 01-prompt-mit-anhang.png: Composer mit Anhang "Shirt-Firma Ergebnis Preis.md" + Prompt, vor dem Senden, kein Research
- 02-antwort-tabelle.png: Antwort-Kopf ("Ich empfehle Kolonnenshirt ...") + Tabelle der 10 Namen mit Firma/Domain/Ergebnis
- 03-streichungen.png: "Was hinter den Streichungen steckt" (Kluft-Namen, Stichfest, Logostich, Meistershirt)
- 04-entscheidung.png: "Warum Kolonnenshirt" (3 Gründe) + "Was ich nicht prüfen konnte" (Domains, Markenregister, Handelsregister)

## Ein Satz an den Autor
Claude prüft zehn Namen mit 19 Websuchen und 20 Seitenabrufen (inkl. DENIC-Registerabfragen) in knapp 2 Minuten, streicht sieben (vier "Kluft"-Namen wegen des Arbeitskleidungs-Shops Kluft.de, Stichfest = Stickerei in Tirol, Logostich = fast identischer Shop, Meistershirt = Domain belegt + Fußball) und entscheidet sich für **Kolonnenshirt**: Bau-Wort für den Arbeitertrupp, passt zum Fünferpaket, nichts gleichnamiges gefunden; ehrlich offen: ob kolonnenshirt.de frei ist, ist nicht bestätigt, Markenregister nicht geprüft.
