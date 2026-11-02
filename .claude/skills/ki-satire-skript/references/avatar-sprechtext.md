# Avatar-Sprechtext: Satzzeichen sind Regie

Der Text wird von einem AI-Avatar vorgelesen. Das Tool deutet nur wenige Zeichen, und jedes Zeichen verändert, wie die Stimme klingt. Deshalb setzt du Zeichen nach Wirkung, nicht nach Grammatik.

## Die Zeichen

| Zeichen | Wirkung | Wofür du es nutzt |
|---|---|---|
| **Komma** | kurze Pause | Timing innerhalb eines Gedankens. Vor der Wendung, vor dem nachgeschobenen Detail, vor "und" in einer Pointe. Darf auch dort stehen, wo der Duden keins will ("Bei den Chefs, sind es noch mehr.") |
| **Punkt** | lange Pause, Stimme geht nach unten | Ende eines Gedankens. Vor jeder Pointe. Nach Einwort-Sätzen, die wirken sollen ("Anonym." "Er auch nicht."). |
| **Bindestrich** | trennt Silben, deutlichere Aussprache | Nur für Wörter, die der Avatar verschluckt oder falsch betont. Siehe Aussprache-Liste. |
| **Fragezeichen** | Frage-Betonung (zu testen, wie der Avatar es macht) | Nur für echte Fragen, die der Zuschauer im Kopf beantworten soll. Höchstens zwei pro Skript. |
| **Absatz** | Beat-Wechsel | Ein Absatz ist ein Beat. |

## Verboten im Sprechtext

- **Gedankenstrich (–) und jeder Strich zwischen Wörtern.** Der Avatar liest ihn als Bindestrich, also als Silbentrennung. Stattdessen Komma oder Punkt.
- **Bindestriche in normalen Wortzusammensetzungen**, wenn keine Trennung gewollt ist. "Firmenchatbot" statt "Firmen-Chatbot". Ausnahme: "KI-Kurs", "KI-Regeln" usw. bleiben, dort ist die kleine Trennung gewollt.
- **Anführungszeichen.** Direkte Rede wird mit Komma eingeleitet: "Seitdem sagt er in jedem Meeting, da setzen wir einen Agenten drauf."
- **Doppelpunkt, Semikolon, Klammern, Auslassungspunkte, Ausrufezeichen, Emojis, Sternchen.**
- **Prozentzeichen, Dezimalzahlen, Abkürzungen.** "Fast jeder Dritte" statt "29,1 %". "zum Beispiel" statt "z. B.".

## Zahlen

- Runde Zahlen, als Wort geschrieben, wenn der Avatar sie sonst komisch liest: "fünftausend", "vierhundertachtzig Euro". Kleine Zahlen bis zwölf immer als Wort.
- Höchstens eine Zahl pro Satz. Geldbeträge mit "Euro" ausgeschrieben.
- Eine Jahreszahl nur, wenn sie die Pointe ist.

## Rhythmus

- Sätze mit 3 bis 12 Wörtern. Ein Satz mit mehr als 15 Wörtern braucht mindestens ein Komma für eine Atempause.
- Einwort- und Zweiwort-Sätze sind die stärkste Waffe des Avatars, weil er dann eine lange Pause mit fallender Stimme macht. Das ersetzt die Mimik, die Hanna hat. Nutze sie für Pointen und Nachsätze, nicht öfter als drei- bis viermal pro Skript, sonst klingt es abgehackt.
- Spiegelsätze helfen beim Hören: gleicher Bau, anderes Ende ("Du kriegst die Seite, und lässt sie zusammenfassen. Auf drei Stichpunkte.").

## Aussprache-Liste

Wörter, die der Avatar falsch sagt oder sagen könnte. Einträge mit "zu testen" sind Vermutungen. Wenn Niklas meldet, dass ein Wort falsch klingt oder passt, wird der Eintrag hier aktualisiert.

| Im Text | Schreibweise im Sprechtext | Status |
|---|---|---|
| Jevons | Dschevons | zu testen |
| ChatGPT | ChatGPT, falls falsch: Tschätt-Dschi-Pi-Ti | zu testen |
| KI | KI, falls es wie "Key" klingt: Ka-I | zu testen |
| Datenschutzbeauftragte | Daten-schutz-beauftragte | zu testen |
| Meeting, Mail, Homeoffice | unverändert | zu testen |
| Englische Fachbegriffe allgemein | möglichst vermeiden, sonst eindeutschen ("Dschevons") | Regel |

## Tempo

| Wert | Stand |
|---|---|
| Wörter pro Minute des Avatars | **~165 roh** (HeyGen Avatar V, Stimme nikstudio 6cc88d5a, Standard-Einstellungen) |
| gemessen an | Arbeitsvertrag 2026-09-30: 82 Wörter → 29,8 s roh (165 wpm); Vertrag 2026-09-30: 139 Wörter → 48,8 s roh (171 wpm). Nach Silence-Cut ca. 10–14 % kürzer. |

So wird gemessen: Wörter im Sprechtext zählen, durch die echte Dauer des Renders in Sekunden teilen, mal 60. Wenn Niklas eine Dauer meldet, hier eintragen und die Wortzahlen in SKILL.md, Schritt 2, im selben Verhältnis anpassen.
