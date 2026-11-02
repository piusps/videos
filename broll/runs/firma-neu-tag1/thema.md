# Tag 1 · Heute findet die KI ihr Produkt

Serie: „KI baut mein Unternehmen“ (@pickthecompany). Konzept: konzept.md. Bibel: wirtschaftsbuch-v2.md.
Trigger-Wort: **Produkt**

## Folgenfrage
Die KI hat nichts: kein Produkt, keinen Kunden, keinen Euro. **Was verkauft sie?**
Für den Zuschauer heißt das: Wie finde ich heraus, welches Produkt oder welche Leistung sich für meine Firma lohnt, bevor ich Geld ausgebe?

## Warum dieser Schritt zuerst
Pius' Reihenfolge lautet: „erstmal gucken, was lässt sich gut verkaufen, wer ist unser Kunde“. Das Produkt kommt zuerst, der Kunde ist Tag 2. Jeder Unternehmer kennt den Schritt: neues Angebot, zweites Standbein, Zusatzgeschäft.

## Der Claude-Weg (3 Schritte, wie im Skript)
1. **Recherche einschalten:** Im Chat unten links auf „+“ → „Research“. Plan: Pro, Max, Team oder Enterprise. Die Websuche muss an sein. (Q-RS)
2. **Eigene Regeln dazuschreiben:** kein Lager, keine Maschine, nur Betriebe unter zehn Leuten als Kunden. Diese Regeln stehen in Frage 1.
3. **Ideen in einer Tabelle bewerten lassen:** Claude erstellt eine Excel-Datei. Dafür muss unter Settings > Capabilities „Code execution and file creation“ an sein, das geht in allen Plänen. (Q-FC)

## Skills / Connectors / MCPs für diesen Schritt (nur echte)
| Was | Wofür | Beleg | Status |
|---|---|---|---|
| Research (eingebaut) | mehrere Suchen nacheinander, Antwort mit Quellen | Q-RS | ✓ |
| Websuche (eingebaut) | Voraussetzung für Research; im Team-/Enterprise-Konto muss ein Besitzer sie freigeben | Q-WS | ✓ |
| Dateierstellung, Excel (eingebaut) | Bewertungstabelle mit Formeln | Q-FC | ✓ |
| Skill `xlsx` (anthropics/skills) | dasselbe in Claude Code, als installierbarer Skill | G-SK | ✓ (Guide) |
| Exa-MCP / Firecrawl-MCP | tiefere Websuche bzw. Seiten auslesen, für Fortgeschrittene | link-library.md, verifiziert 2026-10-22 | ✓ (nur Guide) |
| Apify-MCP | z. B. Google-Maps-Einträge zählen, wie viele Betriebe einer Branche es in der Region gibt | G-AP | ✓ (nur Guide) |

Im Video wird nur das Eingebaute gesagt: Plus, Recherche, Tabelle. Die MCPs und Skills stehen im Guide.

## Story-Logik und Ehrlichkeit
- Die Entscheidung „Firmenshirts mit Logo für Betriebe unter 10 Leuten“ ist Pius' Wahl und bleibt.
- Im Video trifft die KI diese Entscheidung **auf Grundlage der echten Tabelle**. Der Satz `[ECHTES ERGEBNIS …]` kommt wörtlich sinngemäß aus dem Lauf, keine Zahl und kein Grund wird erfunden.
- **Fallback, falls Claude Firmenshirts nicht selbst vorschlägt:** Frage 2 nimmt sie ausdrücklich in die Tabelle auf. Das ist im Bild sichtbar und ehrlich, weil die KI eine eigene Idee gegen Claudes Liste antreten lässt. Der Ergebnissatz sagt dann, wo die Shirts in der Tabelle landen.
- **Fallback, falls die Shirts in der echten Tabelle schlecht abschneiden:** Den Satz „Sie nimmt Firmenshirts“ nicht schönreden. Chef meldet das an Pius. Ein möglicher Satz ist „Nicht Platz eins, aber [echter Grund aus Frage 3]“, aber nur, wenn Frage 3 so einen Grund liefert.

## Für den Design-Lauf (echter claude.ai-Lauf, Pius' OK liegt vor, Chef macht ihn)
**Konto:** ein bezahlter Plan (Research braucht Pro/Max/Team/Enterprise). Oberfläche möglichst auf Deutsch, damit das echte Label sichtbar wird.

**Vorher:**
- Settings > Capabilities: „Code execution and file creation“ an.
- Websuche an.

**Ablauf:** Neuer Chat (kein Projekt), „+“ → „Research“ einschalten.

**Frage 1 (mit Research):**
> Ich will in Deutschland eine kleine Firma gründen, die ich komplett vom Schreibtisch aus führe. Meine Regeln: kein eigenes Lager, keine eigene Maschine, ein Partner stellt her und verschickt, und meine Kunden sind kleine Betriebe mit weniger als zehn Leuten, zum Beispiel Handwerker, Friseure, Bäckereien. Recherchiere: Welche zehn Produkte oder Leistungen kaufen solche Betriebe immer wieder, und welche davon könnte ich nach diesen Regeln verkaufen? Nenne zu jeder Idee kurz, warum, und die Quelle. Erfinde nichts. Wo du keine Quelle findest, schreib „unklar“.

**Frage 2 (im selben Chat, Research darf aus sein):**
> Bewerte diese Ideen in einer Excel-Tabelle. Spalten: Idee · Wie oft kauft ein Betrieb das? · Geht es ohne Lager und Maschine? · Wie viele Anbieter gibt es schon? · Wie schnell ist ein erster Auftrag möglich? Gib je Spalte 1 bis 5 Punkte und eine kurze Begründung, dazu eine Summenspalte mit Formel. Nimm auch „Firmenshirts mit Logo für Betriebe unter zehn Leuten“ auf, falls die noch nicht dabei sind. Erfinde keine Zahlen. Wo du nichts weißt, schreib „unklar“.

**Frage 3:**
> Welche Idee würdest du an meiner Stelle nehmen? Und was spricht am stärksten gegen Firmenshirts mit Logo für Betriebe unter zehn Leuten? Antworte in fünf Sätzen.

**Abfotografieren (Datum hier eintragen):**
1. „+“-Menü mit dem echten Label für Research (deutsche Oberfläche, falls vorhanden).
2. Frage 1 lesbar im Eingabefeld.
3. Research läuft (Fortschrittsanzeige).
4. Ausschnitt der Antwort mit Quellen-Links.
5. Die Excel-Tabelle, Zeile Firmenshirts sichtbar.
6. Antwort auf Frage 3.

**Was aus dem Lauf ins Skript geht:** ein Satz (8–12 gesprochene Wörter) über die Zeile Firmenshirts, also Platz und stärkster Grund, nur aus Tabelle oder Frage 3. Der Gegengrund aus Frage 3 geht in den Guide und, wenn er stark ist, in Tag 2 oder 3 als Faden.

**Rückmeldung an Autor, wenn:**
- das Label nicht „Recherche“ heißt (dann Skriptwort anpassen),
- es keinen Research-Schalter gibt,
- die Shirts schlecht abschneiden.

Lauf: _noch nicht gemacht_ · Datum: … · Konto/Plan: … · Screenshots: `design/lauf-tag1/`

## Faktenprüfung Skript
| Satz | Art | Beleg |
|---|---|---|
| „Was passiert, wenn eine KI ganz alleine …? Ich probier das aus.“ | Serienrahmen (fiktives Experiment, Caption sagt es) | – |
| „Die KI hat kein Produkt und keinen Euro.“ | Story, Startzustand laut Bibel §5 | wirtschaftsbuch-v2.md |
| „Heute sucht sie mit Claude ihr Produkt.“ | Story | – |
| „Erstens: unten aufs Plus und die Recherche einschalten.“ | Claude-Funktion | Q-RS: „Click the "+" button on the bottom left …, then "Research."“ Das deutsche Label ist nicht belegt ⚠, Lauf-Screenshot entscheidet |
| „Zweitens: Schreib deine Regeln dazu.“ | Anleitung (Prompt-Inhalt) | Frage 1 |
| „Drittens: Lass die Ideen in einer Tabelle bewerten.“ | Claude-Funktion (Excel) | Q-FC: „Claude can create Excel spreadsheets (.xlsx) …“ |
| `[ECHTES ERGEBNIS]` | aus Lauf | Screenshot 5/6 |
| „Sie nimmt Firmenshirts mit Logo für Betriebe unter zehn Leuten.“ | Story-Entscheidung (Pius' Wahl) | briefing.md |
| „Wer die kauft, findet sie morgen raus.“ | Faden zu Tag 2 | konzept.md |
| „Kommentiere Produkt, dann schick ich dir den Guide mit allen drei Fragen.“ | Lieferung | guide-outline.md (enthält die drei Fragen wörtlich + mehr) |

Nicht im Skript: Plan-Voraussetzung (Research nur bezahlt). Sie steht in der Caption und im Guide. Das Skript sagt nichts, was im Free-Plan falsch wäre, außer dass der Schalter dort fehlt. ⚠ Hinweis für den Prüfer: Die Caption fängt das ab.

## Quellen (2026-10-26)
- Q-RS https://support.claude.com/en/articles/11088861-using-research-on-claude
- Q-WS https://support.claude.com/en/articles/10684626-enable-and-use-web-search (de: https://support.claude.com/de/articles/10684626-websuche-aktivieren-und-verwenden)
- Q-FC https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude
- G-SK https://github.com/anthropics/skills (Ordner `skills/xlsx` per GitHub-API gelistet)
- G-AP https://github.com/apify/apify-mcp-server
- Exa/Firecrawl: `~/.claude/skills/video-guidebook/references/link-library.md`
