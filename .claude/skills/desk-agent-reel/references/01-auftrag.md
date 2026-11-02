# Phase 1: Auftrag verstehen

Ziel: Bevor irgendetwas gebaut wird, ist klar, **was das Video beweisen soll** und **für wen**. Ausgabe: `broll/runs/sd-<slug>/auftrag.md` und `format.json` (`{"account":"@florent_preusser","format":"SD","variante":null}`).

## 1.1 Was will Pius?
- Den Wortlaut der Anfrage notieren, wörtlich.
- Gibt es eine Vorlage (Reel-Link, älteres Video)? Dann zuerst die Vorlage zerlegen: Kontaktbogen alle 0,5 s plus Schnitt-Erkennung (`select='gt(scene,0.25)'`). Erst danach planen.
- Feedback-Runde zu einem bestehenden Video? Dann jeden Punkt als nummerierte Liste übernehmen. Jeder Punkt wird in Phase 8 einzeln abgehakt.

## 1.2 Was macht das Video eigentlich? (Outcome-First)
In einem Satz: **Welches Ergebnis** liegt am Ende da, ohne dass die Person es selbst gemacht hat?
Beispiel: „Jeden Tag um 17 Uhr liegt die Liste der Kunden ohne Bestellung da, die persönlichen Mails sind geschrieben, Florent drückt nur Enter.“
Pflichtfrage: Kann Superkind das heute im Trial genau so? Wenn nein, anderes Ergebnis wählen.

## 1.3 Zuschauer und Versprechen
- Zuschauer auf @florent_preusser: Mittelstand, Unternehmer und Angestellte im Büro (Vertrieb, Einkauf, Buchhaltung, HR).
- Versprechen (Website): KI-Mitarbeiter, dem man in Outlook, Teams oder Slack schreibt wie einem Kollegen. Er erledigt die Aufgabe in deinen Tools, fragt vor allem, was rausgeht, und macht aus einmal Erklärtem eine Routine.
- Kanal pro Aufgabe festlegen (z. B. Aufgabe 1 Teams, Aufgabe 2 Mail).
- App-Welt festlegen (max. 3 echte Apps pro Video, z. B. Outlook + SAP + Teams) und prüfen, ob die Logos in `broll/public/logos` liegen.

## 1.4 Passt das Format?
SD passt, wenn sich der Use-Case **am Bildschirm zeigen** lässt und eine Person ihn **in einem Satz** delegieren kann. Passt es nicht (abstraktes Thema, Meinung, Satire), zurück zu `reel-formate`.

## Vorlage `auftrag.md`
```
# <Thema> (SD, <Datum>)
Anfrage (wörtlich): …
Feedback-Punkte (falls Runde): 1. … 2. …
Ein Satz: …
Zuschauer: …
App-Welt: Outlook, SAP, Teams (Logos vorhanden: ja/nein)
Länge: ≤ 30 s (zwei Aufgaben ≤ 35 s)
Ergebnis im ersten Frame: …
Vorlage: <Pfad/Link> (zerlegt: ja/nein)
```

**Gate:** Ein-Satz-Beschreibung steht, App-Welt steht, Feedback-Punkte sind nummeriert.
