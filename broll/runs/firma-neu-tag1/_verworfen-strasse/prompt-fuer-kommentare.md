# Tag 1 · Prompt für Kommentierende (Vorlage)

**Lieferweg:** Alle, die einen Beruf kommentieren, bekommen sofort dieselbe DM über die Zernio-Kommentar-Automation (Text unten, zwischen den Linien). Es gibt keine Einzelanpassung. Der Prompt hat Platzhalter, die jeder selbst ausfüllt, und vier Beispielzeilen helfen dabei. Pius gibt den DM-Text einmal frei, bevor die Automation live geht. Danach läuft jede DM ohne Zwischenschritt.

---

Hier ist dein Prompt. Du setzt nur deinen Beruf und deine typischen Leistungen ein.

Wichtig vorab: Das funktioniert, wenn deine Kundenanfragen in Gmail ankommen. Anhänge liest Claude in Gmail nicht, die Anfrage muss im Mailtext stehen.

Einmal einrichten (2 Minuten):
1. In Claude: Customize → Connectors → + → Gmail → Connect, mit deinem Google-Konto anmelden. Danach dasselbe für Google Drive.
2. Deine Preisliste als Google-Dokument in Google Drive ablegen, Name: „Preisliste“.
3. Im Chat unten links auf + → Connectors → Gmail und Google Drive einschalten.

Dann diesen Text in Claude kopieren und die Klammern ausfüllen:

Ich bin [DEIN BERUF]. Such in meinem Gmail alle Kundenanfragen der letzten 7 Tage, auf die ich noch kein Angebot geschickt habe.
Lies mein Google-Dokument „Preisliste“ in Google Drive.
Schreib zu jeder Anfrage ein Angebot und leg es als Mail-Entwurf an den Kunden in Gmail an:
1. Kurze Anrede, Bezug auf seine Anfrage.
2. Positionen mit Menge, Einheit und Preis, nur aus meiner Preisliste. Typische Positionen bei mir: [DEINE LEISTUNGEN].
3. Summe netto, Mehrwertsteuer, Summe brutto. Angebot gültig 30 Tage.
Fehlt dir eine Angabe (Maße, Menge, Termin), schreib [?] an die Stelle und stell am Ende eine Rückfrage an den Kunden. Erfinde keine Preise.
Nur Entwürfe anlegen, nichts senden. Zeig mir am Ende eine Liste: Kunde | worum geht es | Summe | was fehlt.

Beispiele für [DEINE LEISTUNGEN]:
- Maler: Wände streichen pro m², Decke pro m², Abkleben pauschal, Anfahrt
- Elektriker: Steckdose setzen pro Stück, Leitung verlegen pro Meter, Arbeitsstunde, Anfahrt
- Garten- und Landschaftsbau: Rasen mähen pro m², Hecke schneiden pro Meter, Grünschnitt-Entsorgung pro m³
- Gebäudereinigung: Unterhaltsreinigung pro m² und Monat, Fenster pro Stück, Grundreinigung pauschal

Kein klassisches Angebot in deinem Beruf (Friseur, Café, Praxis)? Dann ersetze „Angebot“ durch „Antwort auf die Preisanfrage“ und lass Punkt 3 weg.

---

Belege für die Vorlage: Gmail lesen, suchen und Entwürfe anlegen sowie Google Docs in Drive suchen und lesen stehen in https://support.claude.com/en/articles/10166901-use-google-workspace-connectors. Den Menüpfad Customize → Connectors → + nennt https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities. Ein- und Ausschalten pro Chat über + → Connectors ist in beiden Artikeln beschrieben. Die Formulierung lautet bewusst „Mail-Entwurf an den Kunden“ und nicht „Antwort im Thread“, weil Letzteres nicht belegt ist.
