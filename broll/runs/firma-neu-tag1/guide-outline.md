# Guide Tag 1 · Gliederung (video-guidebook v3, `--brand superkind`)

**Trigger-Wort:** Produkt. Es muss identisch mit script.txt sein.
**Titel:** „Finde dein nächstes Produkt mit Claude“
**Untertitel:** „Die drei Fragen, mit denen die KI in ‚KI baut mein Unternehmen‘ ihr Produkt gefunden hat. Für deine Firma zum Nachmachen.“
**Credit:** Florent Preusser × Superkind (Chef prüft, ob @pickthecompany einen eigenen Credit braucht).

**Cover-Konsole (wird gezählt):**
- ✓ 8 Prompts
- ✓ 8 GitHub-Repos
- ✓ 3 MCP-Server
- ✓ 1 Skill
- ✓ 1 Bewertungstabelle

**Länge:** 8–10 Seiten.

**Regel für den Inhalt:** Was aus dem echten Lauf kommt (Tabelle, Screenshots), kommt erst nach dem Lauf in den Guide. Bis dahin steht dort `[AUS LAUF]`.

---

## 00 // Quick Win in 5 Minuten (`callout`, tone `win`)
Die Frage 1 aus dem Video, fertig zum Kopieren, mit Platzhaltern [deine Regeln], [deine Kunden], [dein Land/deine Region].
Dazu der Klickpfad: claude.ai → neuer Chat → unten links „+“ → „Research“ → Frage einfügen → senden.
Ergebnis nach wenigen Minuten: zehn Ideen mit Quellen.

## 01 // Die Geschichte in drei Sätzen (`p`)
- Die KI startet ohne Produkt und ohne Geld.
- Ihre Regeln: kein Lager, keine Maschine, Kunden sind Betriebe unter zehn Leuten.
- Ihre Wahl: Firmenshirts mit Logo, und warum (`[AUS LAUF]`: ein Satz aus der Tabelle bzw. Frage 3).

Kein Erfolgsversprechen, Hinweis „fiktives Experiment“.

## 02 // Zwei Wege (`paths`)
- **Mit Claude** (Hauptweg, Schritt für Schritt):
  1. Research einschalten
  2. Regeln dazuschreiben
  3. Tabelle bauen lassen
  4. Gegenprobe machen
- **Mit Superkind** (leise, ein Absatz): Du sagst @Superkind in Slack oder Teams „Such mir drei neue Produktideen für unsere Kunden“. Der Agent kennt deine Firma schon und braucht keine Einrichtung.

## 03 // Was du vorher einschalten musst (`checklist`, Belege in thema.md)
- [ ] Bezahlter Plan (Pro, Max, Team oder Enterprise), sonst gibt es kein Research. (Q-RS)
- [ ] Websuche an. Im Team- oder Enterprise-Konto gibt ein Besitzer sie frei unter Organisationseinstellungen > Funktionen. (Q-WS de)
- [ ] Settings > Capabilities: „Code execution and file creation“ an, für die Excel-Tabelle. Das geht in allen Plänen. (Q-FC)
- [ ] Gibt es bei dir keinen Websuche-Schalter (neue Oberfläche): Claude sucht selbst, wenn es hilft. Schreib „Such im Web“ in die Frage. (Q-WS)

## 04 // Die Klickpfade (`steps`, mit Screenshots aus dem Lauf `[AUS LAUF]`)
1. „+“-Menü → Research
2. Frage 1 einfügen
3. Fortschrittsanzeige abwarten
4. Quellen anklicken und gegenlesen
5. Frage 2 → Excel herunterladen
6. Frage 3 → Gegenprobe

## 05 // Prompt-Bibliothek (`prompt`, ≥ 6, bauen aufeinander auf, alle mit „Erfinde nichts“)
1. **Ideen sammeln** (= Frage 1 aus dem Video, Research an)
2. **Bewerten** (= Frage 2, Excel mit Punkten 1–5 und Summenformel)
3. **Gegenprobe** (= Frage 3, „Was spricht am stärksten dagegen?“)
4. **Nachfrage prüfen:** „Suche nach Belegen, dass [Kunden] [Produkt] wirklich kaufen: Ausschreibungen, Foren, Bewertungen, Branchenartikel. Nur mit Link.“
5. **Konkurrenz-Schnellblick:** „Nenne fünf Anbieter für [Produkt] an [Kunden] in [Land], mit Mindestmenge und Preis, nur wenn auf der Seite angegeben, sonst ‚nicht angegeben‘.“
6. **Erster Test ohne Geld:** „Wie kann ich in den nächsten sieben Tagen ohne Ausgaben testen, ob [Kunden] [Produkt] wollen? Drei Wege, je mit Aufwand in Stunden.“
7. **Entscheidung festhalten:** „Fass meine Entscheidung auf einer Seite zusammen: Produkt, Kunde, Regeln, stärkster Grund dafür, stärkstes Risiko, nächster Schritt. Als Word-Datei.“
8. **Wöchentlich nachschärfen:** „Hier sind meine Erfahrungen dieser Woche: [Notizen]. Was ändert das an der Bewertung von [Produkt]? Aktualisiere die Tabelle.“

## 06 // Vorlage: Bewertungstabelle (`facts` oder `code`)
Spalten wie in Frage 2, eine Beispielzeile leer, Summenformel als Text.
Nach dem Lauf kommt die echte Zeile „Firmenshirts“ als Beispiel dazu (`[AUS LAUF]`).

## 07 // Stack mit GitHub-Links (`repos`, 8 Stück)
Alle stehen in `link-library.md` (verifiziert 2026-10-22) oder sind am 2026-10-26 neu geprüft.

| Repo | Art | Wozu für diesen Schritt | Installationszeile (aus README / link-library) |
|---|---|---|---|
| anthropics/skills | SKILL | `xlsx` für die Tabelle, `docx` für das Entscheidungsblatt, `skill-creator` für den eigenen Skill | `/plugin marketplace add anthropics/skills` dann `/plugin install document-skills@anthropic-agent-skills` |
| anthropics/claude-cookbooks | PROMPTS | Rezepte für Recherche und Auswertung | lesen |
| exa-labs/exa-mcp-server | MCP | KI-Websuche für tiefere Marktrecherche | Remote-URL `https://mcp.exa.ai/mcp` |
| firecrawl/firecrawl-mcp-server | MCP | Konkurrenzseiten auslesen (Preise, Mindestmengen) | `env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp` |
| apify/apify-mcp-server | MCP | Google-Maps-Einträge: wie viele Betriebe einer Branche es in deiner Region gibt | Remote-URL `https://mcp.apify.com` (OAuth, geht in claude.ai) |
| punkpeye/awesome-mcp-servers | MCP | weitere Server nach Thema | stöbern |
| ComposioHQ/awesome-claude-skills | SKILL | weitere Skills | stöbern |
| f/prompts.chat | PROMPTS | große Prompt-Sammlung | stöbern |

## 08 // Konsole (`terminal`, mit deutschen Kommentaren)
```
# Exa-Websuche als MCP in Claude Code verbinden
claude mcp add --transport http exa https://mcp.exa.ai/mcp
# Apify verbinden (Google Maps, Branchenverzeichnisse)
claude mcp add --transport http apify https://mcp.apify.com
# Offizielle Anthropic-Skills holen (Excel, Word, PDF)
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
# Prüfen, was verbunden ist
claude mcp list
# Ordner für deinen eigenen Skill
mkdir -p ~/.claude/skills/produkt-finder
```
Dazu der Weg ohne Terminal: claude.ai → Customize/Settings → Connectors → „Add custom connector“ → URL einfügen. (Q-CD: Remote-MCP in allen Plänen, Free nur einer)

## 09 // Dein eigener Skill „produkt-finder“ (`code`, Label „SKILL.md“)
- Kompletter SKILL.md: Name, Beschreibung, Ablauf (Regeln abfragen → Research → Tabelle → Gegenprobe → Entscheidungsblatt), Regel „Erfinde nichts, ‚unklar‘ statt raten“.
- Interview-Prompt, mit dem Claude den Skill für deine Firma ausfüllt.
- Hochladen als ZIP über „Upload skill“ (Q-SK, Menüname je nach Oberfläche Settings > Capabilities oder Customize > Skills).

## 10 // Stolperfallen (`callout warn` + `checklist`)
- Research findet Quellen, aber keine Garantie, dass sich etwas verkauft. Ein echter Test mit Kunden ersetzt das nicht (Prompt 6).
- Zahlen in der Tabelle gegen die Quelle prüfen. Wo „unklar“ steht, nicht raten.
- Mobil: Research nutzt dort nur das Web, keine verbundenen Werkzeuge. (Q-RS)
- Keine Kundendaten oder Geschäftsgeheimnisse in die Frage, die du nicht teilen darfst.
- Wenn Research nicht startet: Schreib in die Frage, dass Claude das Research-Werkzeug nutzen soll. (Q-RS, Troubleshooting)

## 11 // CTA (`cta`)
„Morgen sucht die KI ihren Kunden. Folg @pickthecompany für Tag 2.“ Superkind leise in einem Satz: „Wenn du das ohne Einrichtung jede Woche willst: Superkind macht es in Slack und Teams.“

---
**Check vor dem Rendern:**
- Trigger-Wort = Produkt.
- Die drei Fragen sind wörtlich identisch mit thema.md, damit das Versprechen „allen drei Fragen“ stimmt.
- Jedes `[AUS LAUF]` ist ersetzt.
- Jede Installationszeile ist wörtlich aus dem README oder der link-library. Die `claude mcp add --transport http`-Form steht in link-library.md als Standardbefehl.
- Seitenumbrüche sind geprüft.
