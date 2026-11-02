---
name: ki-satire-skript
description: Schreibt aus einer KI-Satire-Idee oder einem Ersetzt-Demo-Briefing aus ersetzt-radar (Hook plus Kern) ein fertiges, sprechbares Reel-Skript für Niklas' AI-Avatar im Stil von help.hannaa. Liefert den Sprechtext exakt so, wie er in das Avatar-Tool kopiert wird (Komma = kurze Pause, Punkt = lange Pause mit fallender Stimme, Bindestrich = Silbentrennung für deutliche Aussprache), dazu Text-Overlay, Wortzahl, geschätzte Dauer und einen Beat-Plan, der Zuschauer bis zur Pointe hält. Nutze diesen Skill immer, wenn Niklas ein Skript, Sprechtext, Avatar-Text, Voiceover, "schreib das aus", "mach daraus ein Reel", "Skript für Idee 3", "Skript für B-004", "vertonen" oder "fertig zum Drehen" will, auch wenn er nur die Nummer einer Idee oder eines Backlog-Briefings nennt. Für die Themenfindung selbst ist ki-satire zuständig, für Thesen ohne Witz ai-takes. Nur für @florent_preusser (FP-S und Ersetzt-Demos); Satire-Sprechtexte für @florentgpt schreibt gpt-satire.
---

> **STOPP – keine Satire auf @florent_preusser (Henri 2026-10-21):** FP-S wird nicht mehr produziert, eingeplant oder gepostet. Satire gibt es nur noch auf @florentgpt (GPT-S). Wer nach Satire fragt, macht GPT-S. Bitte um FP-Satire: einmal nachfragen, ob wirklich gewollt.

# KI-Satire-Skript: vom Hook zum Avatar-Text

Du bekommst eine Idee aus ki-satire (Format, Hook, Kern, Pointe) und machst daraus einen Sprechtext, den ein AI-Avatar vorliest. Das Ziel ist nicht "schön geschrieben", sondern: **Der Zuschauer scrollt nicht weg, bis die Pointe kommt.** Maßstab ist help.hannaa, in Länge, Dichte und Witz.

Drei Dinge entscheiden:

1. **Dramaturgie.** Jede Sekunde muss eine offene Frage haben. Details, Beat-Pläne pro Format und Hannas Tricks: `references/dramaturgie.md`.
2. **Sprache.** Es gelten alle Regeln aus `~/.claude/skills/ki-satire/references/sprache.md`. Der Kumpel-Test gilt doppelt, denn ein Avatar kann einen schweren Satz nicht mit Mimik retten.
3. **Avatar-Satzzeichen.** Satzzeichen sind hier Regieanweisungen, keine Grammatik. Details, Aussprache-Liste und Tempo: `references/avatar-sprechtext.md`.

## Ablauf

### 1. Kontext laden

- `references/dramaturgie.md` und `references/avatar-sprechtext.md` (immer)
- `~/.claude/skills/ki-satire/references/sprache.md` und `figur-und-formate.md` (immer)
- `~/.claude/ki-satire/backlog.md`: Hier liegen alle Ideen als Briefings mit Nummer (B-001 …). Nennt Niklas eine Nummer, einen Titel oder „Idee 3 von eben“, such das Briefing dort. Steht die Idee nur im Chatverlauf, nimm sie von dort. Sagt er nur „schreib mir ein Skript“ ohne Idee, schlag ihm die 3 stärksten offenen Briefings vor und lass ihn wählen.
- `~/.claude/skills/ki-satire/references/quelle-hannaa-transkripte.md` nur, wenn du ein Format im Original nachhören musst.

- Bei Briefings mit `Format: Ersetzt-Demo` (Quelle ersetzt-radar): zusätzlich `~/.claude/skills/ersetzt-radar/references/hooks.md`. Das ist kein Satire-Format: Es gilt der Beat-Plan „Ersetzt-Demo“ in `dramaturgie.md`, Sprach- und Avatar-Regeln bleiben gleich. Nimm Hook oder Hook B aus dem Briefing. Steht im Beleg `INSIDER:`, frag Niklas nach dem echten Wert, bevor er in den Sprechtext kommt.

Wenn Niklas eine Idee ohne ki-satire-Vorlauf mitbringt, ordne sie selbst einem Format zu. Fehlt ein Beleg für eine Faktenbehauptung, schreib das Skript trotzdem und markiere die Stelle.

### 2. Länge festlegen

Zielwerte aus `avatar-sprechtext.md` (Wörter pro Format, abgeleitet vom gemessenen Avatar-Tempo). Faustregel bei 160 Wörtern pro Minute:

| Format | Dauer | Wörter |
|---|---|---|
| Einzeiler, Wiederholungs-Gag | 12–20 s | 35–55 |
| Anapher-Sketch, Gegenüberstellung | 30–40 s | 85–110 |
| Begriff-Reel, News, Ranking, Check | 40–50 s | 105–135 |
| Kostenrechnung | 45–60 s | 120–160 |
| Ersetzt-Demo (aus ersetzt-radar) | 25–35 s | 65–95 |

Nie über 60 Sekunden. Hannas Reels über 60 s laufen nur mit Werbe-Deal oder als Talk.

### 3. Beat-Plan schreiben

Bevor du Sätze schreibst, schreib den Plan: pro Beat eine Zeile mit Sekunde, Funktion und der offenen Frage, die der Zuschauer in dem Moment hat. Nimm die Vorlage für das Format aus `dramaturgie.md`. Wenn du für einen Beat keine offene Frage benennen kannst, fliegt der Beat raus.

### 4. Sprechtext schreiben

Schreib auf Wirkung beim Hören, nicht beim Lesen. Die Pflichtpunkte:

- **Die ersten drei Wörter tragen.** Kein "Hallo", kein "Heute", kein "Also", kein "Ich möchte". Der Hook startet mitten in der Provokation.
- **Der zweite Satz eskaliert oder verspricht.** Er erklärt den Hook nicht, er macht ihn schlimmer oder kündigt eine Begründung an.
- **Alle 6 bis 10 Sekunden ein Wiedereinstieg.** Zum Beispiel "Und jetzt kommt's." oder "Mein Favorit." (Liste in `dramaturgie.md`). Höchstens zwei pro Skript.
- **Die Beispiele werden immer absurder.** Das stärkste kommt zuletzt, direkt vor der Pointe.
- **Die Pointe ist der letzte Satz.** Unter 10 Wörtern, am besten mit Rückgriff auf den Hook, damit das Reel beim Loop wieder am Anfang andockt. Danach kommt nichts mehr. Ausnahme: Beim Anapher-Sketch ist der Aufruf zum Kommentieren selbst die Pointe.
- **Kein Satz mit "Spaß beiseite".** Die Figur erklärt nie, dass es ironisch gemeint war.
- **Niklas spricht immer als er selbst.** Kein Sprechtext in einer Rolle, auch kein POV. Steht im Briefing eine Rolle („Ich bin die KI …“), schreib sie in die dritte Person um („Die KI in deiner Firma …“). Nach dem Reel muss er klug und nah dran wirken, nie verkleidet.

### 5. Avatar-Durchgang (eigener Schritt)

Geh den Text Satz für Satz durch und setz die Zeichen nach `avatar-sprechtext.md`:

- Kommas nach Timing setzen, nicht nach Duden: vor die Pointe eines Satzes, vor ein nachgeschobenes Detail.
- Einen Punkt überall dort, wo die Stimme runtergehen und kurz stehen soll, auch nach Einwort-Sätzen ("Anonym.").
- Bindestriche nur für Wörter, die der Avatar sonst verschluckt oder falsch betont (Aussprache-Liste).
- Raus mit allem, was der Avatar nicht deuten kann: Anführungszeichen, Klammern, Doppelpunkte, Gedankenstriche, Auslassungspunkte, Emojis, Ausrufezeichen, Ziffern mit Komma oder Prozentzeichen.

Danach Wörter zählen und die Dauer mit dem Tempo aus `avatar-sprechtext.md` schätzen. Liegst du über dem Zielwert, kürze Beispiele, nie den Hook oder die Pointe.

### 6. Retention-Check

Arbeite die Checkliste am Ende von `dramaturgie.md` ab. Ein Punkt, der durchfällt, wird umgebaut, nicht verteidigt.

### 7. Ausgeben und speichern

Ausgabe pro Skript im Format unten. Wenn Niklas mehrere Ideen will, schreib alle aus. Danach fragst du, ob er Hook-Variante B testen will und ob der Avatar Wörter falsch ausgesprochen hat. Falsche Wörter trägst du in die Aussprache-Liste in `avatar-sprechtext.md` ein. Meldet er die echte Dauer eines Renders, rechne das Tempo neu aus und trag es dort ein.

Speichere jedes Skript als `~/.claude/ki-satire/skripte/JJJJ-MM-TT-titel.md` (Ordner anlegen, falls er fehlt). Setz danach im Backlog beim Briefing `Status: geskriptet → skripte/JJJJ-MM-TT-titel.md` und aktualisiere die Zählerzeile oben.

## Ausgabeformat

````
## [Arbeitstitel]
Format: [Name] · Ziel: [~X s] · Wörter: [N] · geschätzt: [~X s bei Y wpm]

**Overlay (0–3 s, Text auf dem Bild):** [3 bis 7 Wörter, funktioniert ohne Ton]

**Beat-Plan**
| Sek. | Beat | Offene Frage beim Zuschauer |
|---|---|---|
| 0–3 | Hook | … |
| … | … | … |

**Sprechtext (so ins Avatar-Tool kopieren):**
```
[Text, ein Beat pro Absatz, nur Komma, Punkt, Bindestrich und Fragezeichen]
```

**Hook-Variante B:** [ein alternativer erster Satz, gleiche Länge, anderer Winkel]
**Schnitt-Hinweise:** [höchstens 3 Stichpunkte: Einblendungen, Zahlen als Text, Bild zum Beat]
**Zu prüfen:** [Fakten, Aussprache, Rechte, oder "nichts"]
````

Die Leerzeilen zwischen den Absätzen im Sprechtext sind nur zur Übersicht für Niklas. Wenn das Avatar-Tool Absätze als extra Pause liest, ist das gewollt: Ein Absatz ist ein Beat.

## Kalibrierung: So soll ein Skript aussehen

## Gesparte Zeit ist weg
Format: Begriff-Reel · Ziel: ~40 s · Wörter: 103 · geschätzt: ~39 s bei 160 wpm

**Overlay:** KI spart dir Zeit. Wo ist sie?

| Sek. | Beat | Offene Frage |
|---|---|---|
| 0–4 | Hook plus Eskalation: Kollege ist schuld | Wieso weniger Zeit? Was hat mein Kollege damit zu tun? |
| 4–10 | Begriff plus "Heißt" | Ach, dafür gibt's ein Wort? |
| 10–16 | Bild: Mails werden mehr und länger | Stimmt, aber wo ist der Witz? |
| 16–30 | Pingpong der zwei KIs | Wie weit geht das noch? |
| 30–41 | Wiedereinstieg, Eskalation, Pointe | Was ist das Fazit? |

```
KI spart dir jeden Tag eine Stunde. Trotzdem hast du weniger Zeit als vorher. Und schuld ist dein Kollege.

Das nennt sich Dschevons-Paradox. Heißt, wenn etwas billiger wird, wird viel mehr davon verbraucht.

Eine Mail kostet jetzt keine Mühe mehr. Also schreibt jeder mehr Mails. Und längere.

Dein Kollege schreibt drei Stichpunkte, und lässt sie von ChatGPT aufblasen. Auf eine ganze Seite.
Du kriegst die Seite, und lässt sie von ChatGPT zusammenfassen. Auf drei Stichpunkte.

Und jetzt kommt's. Die zwei KIs schreiben sich den ganzen Tag. Und ihr zwei sitzt daneben, und kriegt Gehalt.

Ich nenne das nicht Zeitverschwendung. Ich nenne das Vollbeschäftigung.
```

Warum das funktioniert: Der dritte Satz ("Und schuld ist dein Kollege") öffnet eine zweite Frage, bevor die erste beantwortet ist. Das Pingpong steht in zwei spiegelgleichen Sätzen, das versteht man auch ohne Ton. Die Kommas vor "und lässt sie" geben dem Avatar eine Atempause genau vor der Wendung. Die Pointe steht allein im letzten Absatz.

**So nicht:**
- „Hallo zusammen, heute möchte ich über das Jevons-Paradox sprechen." Begrüßung, Begriff im Hook, keine Frage offen. Der Zuschauer ist nach 2 Sekunden weg.
- „KI spart Zeit – aber (Achtung!) wir verbrauchen sie wieder…" Gedankenstrich, Klammer, Ausrufezeichen und Auslassungspunkte, die der Avatar nicht deuten kann, und der Gedankenstrich wird als Silbentrennung gelesen.
- „Das ist übrigens gut belegt, der Kohleverbrauch stieg damals, als Dampfmaschinen effizienter wurden, was zeigt, dass…" Schachtelsatz, Nebenwissen, das die Spannung killt. Der Beleg gehört in "Zu prüfen", nicht in den Sprechtext.

## Ehrlichkeit

Es gelten die Regeln aus ki-satire: Übertreibung ist erlaubt, wenn sie erkennbar ist. Faktenbehauptungen müssen stimmen und werden unter "Zu prüfen" mit Quelle genannt. Kundenerlebnisse werden nie erfunden: Szenen sind entweder erkennbar Satire oder belegt.

> **Satire auf @florent_preusser: 15–20 s (Henri 2026-10-12):** Satire-Reels (FP-S) so kosteneffizient wie möglich: Ziel 15–20 s Video, d. h. Sprechtext ca. 40–55 Wörter, eine Pointe, maximal 3 Beats. Spart HeyGen-Credits (~13–17 pro Reel).
> **Korrektur (Henri 2026-10-15):** Normale FP-Videos (FP-N) laufen auf @florent_preusser weiterhin, die frühere Aussage „nur noch Satire“ gilt nicht. FP-N bleibt bei den normalen Regeln (110–140 Wörter, 30–35 s, Guide + Trigger-Wort).
