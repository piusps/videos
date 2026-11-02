# Recherche: Woher der Rohstoff kommt

Ziel: genug Material für 6 starke Ideen pro Runde, plus Nachschub für den Backlog. Gesucht werden **absurde Bilder und Mechanismen**, keine Schlagzeilen.

## Quellen für die aktuelle Recherche (6 bis 10 Suchen, letzte 7 Tage)

Verteil die Suchen auf mindestens 4 der 5 Töpfe. Die Websuche ist auf die USA ausgerichtet. Deutsche Treffer bekommst du deshalb am besten mit deutschen Suchbegriffen und `allowed_domains`.

| Topf | Wo | Suchbeispiele | Was man dort findet |
|---|---|---|---|
| **Deutschland, Job** | heise.de, t3n.de, spiegel.de, handelsblatt.com, haufe.de, zeit.de, sueddeutsche.de | „KI Arbeitsplatz Umfrage“, „Schatten-KI“, „KI Stellenabbau Deutschland“, „Betriebsrat KI“ | Studien mit einer Zahl, die man in einem Satz sagen kann. Firmen-Theater aus dem Mittelstand |
| **Angestellte lästern** | reddit.com (r/de, r/antiwork, r/sysadmin, r/ITCareerQuestions, r/recruitinghell, r/cscareerquestions) | „ChatGPT boss“, „AI mandate work“, „manager AI“, „Chef ChatGPT“ | echte Szenen aus dem Büro, die absurder sind als jede erfundene. Nur als Anregung, nie eine Person aus dem Thread zum Thema machen |
| **LinkedIn-Fremdscham** | Suche nach viral gegangenen LinkedIn-Posts über KI, zum Beispiel über reddit.com/r/LinkedInLunatics | „LinkedInLunatics AI“, „LinkedIn post AI CEO viral“ | Chefs und Berater, die sich selbst entlarven. Ideal für Check und Anapher. Nur öffentliche Personen oder Konzerne, keine Privatleute |
| **Pannen weltweit** | theverge.com, 404media.co, arstechnica.com, techcrunch.com, washingtonpost.com | „AI chatbot mistake company“, „AI agent went wrong“, „AI refund lawsuit“ | Chatbots, die Rabatte erfinden, Agenten, die Chaos anrichten. Das beste Futter für News mit Mechanismus |
| **Big Tech, Drama** | cnbc.com, reuters.com, businessinsider.com | „OpenAI“, „Meta AI“, „Google AI“ plus „this week“ | CEO-Zitate, Machtkämpfe, Geldsummen. Nur nehmen, wenn es ein einfaches Bild gibt |

Regeln:
- **Das Bild zählt, nicht die Nachricht.** Frag dich bei jedem Fund: Kann ich das in einem Satz so erzählen, dass meine Mutter lacht oder sich aufregt? Wenn nein, weiter.
- **Jeder Fakt kriegt einen Link.** Zahlen vor dem Übernehmen gegen die Originalquelle prüfen. Wenn nur ein Blog sie nennt, markier sie mit „zu prüfen“.
- **Reddit und LinkedIn sind Anregung, kein Beleg.** Daraus wird eine erkennbar erfundene Szene („Stell dir vor, dein Chef …“), nie „Ein Typ auf Reddit hat …“ als Tatsache.
- Wirf gute Funde, die heute nicht in die Top 6 kommen, als Rohidee in den Backlog. Für eine gute News reicht heute kein Platz? Dann in den Backlog damit, samt Datum.

## Hanna-Update (wöchentlich)

Datei: `~/.claude/ki-satire/hanna-neu.md`. Sie ergänzt die feste Sammlung `references/quelle-hannaa-transkripte.md`, ersetzt sie aber nicht.

1. Apify-Actor `steadyfetch/instagram-reel-transcript-scraper`, Input:
   `{"handles": ["help.hannaa"], "maxReelsPerHandle": 12, "newReelsOnly": true, "watchlistId": "hannaa"}`
   Kosten: etwa 1,5 Cent pro neuem Reel, also höchstens rund 18 Cent pro Lauf. Schon bekannte Reels werden übersprungen und nicht berechnet.
2. Für jedes neue Reel festhalten: Link, Datum, Dauer, Aufrufe, Likes, Kommentare, Hook (erste 3 Sekunden), Transkript. Prüf vorher, ob der Link schon in `hanna-neu.md` oder in `quelle-hannaa-transkripte.md` steht, dann weglassen.
3. Neue Reels oben in `hanna-neu.md` einfügen, im selben Aufbau wie `quelle-hannaa-transkripte.md`.
4. Den Abschnitt **„Was gerade läuft“** ganz oben in der Datei neu schreiben, höchstens 8 Zeilen:
   - Welche 3 neuen Reels haben die meisten Aufrufe, und in welchem Format sind sie gebaut (Format-Namen aus `figur-und-formate.md`)?
   - Gibt es ein neues Format oder einen neuen Trick, den der Skill noch nicht kennt? Wenn ja, in einem Satz beschreiben.
   - Welche Themen hat sie jetzt besetzt? Diese Themen gelten für ki-satire als besetzt, genau wie die Liste in `rohstoff.md`.
   - Was ist gefloppt, und warum vermutlich?
5. Oben in der Datei steht immer `Stand: JJJJ-MM-TT`, damit die nächste Runde weiß, ob ein Update fällig ist.

Wenn Apify nicht erreichbar ist oder das Guthaben leer ist, überspring das Update, sag es Niklas in einem Satz und arbeite mit dem letzten Stand weiter.
